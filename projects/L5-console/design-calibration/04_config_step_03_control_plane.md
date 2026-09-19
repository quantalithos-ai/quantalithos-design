# Step 3. 建立配置控制面总览

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 3
> 回填章节：`04-配置设计.md` §3
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_03_control_plane.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标、输入与边界

本 Step 固定配置来源到 `entry` composition root 的全链路，并把 P0 拆为四个功能配置域。输入为 Step 2 和 03 Step 14；不进入具体 key/default，不把 injected dependency instance、owner contract 或 host route 当 JSON。

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 从哪些来源读取？ | validated code defaults + 至多一个 host-provided external strict JSON document。env/CLI只可在未来 host/deployment 层选择文档，不直接覆盖叶子 key；browser URL/DOM/storage/config center/admin override 均不属于 P0 来源。 |
| 唯一装配入口？ | `entry` composition root：merge→parse→validate→构造既有 `ConsoleClientBindingConfig`→注册依赖 slots→observe availability→`buildConsoleRuntime`。 |
| 谁读配置？ | 只有 entry/config loader/validator/registry binding；业务模块只消费注入的 narrow Ports 和 typed values。 |
| 控制什么？ | profile selection、本地 binding correlation、两条 optional side-path request；不控制 truth、权限、formal contract、状态正向提升或 owner 操作。 |
| 影响哪些下游？ | 05 profile/negative test，06 config veto，07 parser/validator/builder任务，09 artifact注入/回滚；不预写其细节。 |
| 配置域？ | `runtime`、`bindings`、`invalidation`、`diagnostics`。state/host 是依赖绑定结果，不新增 P0 JSON 域。 |

## 3. 当前诊断、对比与取舍

| 议题 | 收口前风险 | 收口后 |
|---|---|---|
| 来源数量 | file/env/CLI/remote/admin 都可能覆盖 | P0 只有 defaults + 一个 external document；消除浏览器叶子覆盖漂移 |
| 配置读者 | 各 feature 读取 flag | 只有 entry/config pipeline；features 不读 raw config |
| dependency/config 混淆 | SDK client、host/router、carrier、sink instance 写进配置 | JSON 只存 binding ref/switch；instances 由 `ConsoleRuntimeDependencies` 注入 |
| `bindings` 泛化 | 任意 adapter name/URL map | 封闭 slot union + profile + local ref |
| state | 单独设 medium 域 | 当前不是配置域；固定 session-volatile dependency posture |
| enable flag | 控制 active/enabled | 只表达 request；availability/合同验证仍是必要条件 |

## 4. 结构化中间产物

### 4.1 配置来源链图：L5-console 配置覆盖与装配链

```text
[safe defaults for optional fields]
          |
          +------> [one host-provided strict JSON document
                    providing required runtime.profile]
                              |
                              v
                    [merge / strict parse]
                              |
                    [type + cross-field + forbidden checks]
                              |
                    [ConsoleClientBindingConfig]
                              |
          +-------------------+--------------------+
          |                   |                    |
 [adapter registry]   [optional side paths]  [runtime profile]
          |                   |                    |
          +----------> [observe availability] <----+
                              |
                    [buildConsoleRuntime]
                              |
             [injected narrow module dependencies]
```

关键说明：

- external document 提供必填 `runtime.profile` 并覆盖 optional defaults；高优先级非法值不得回退到 default。没有该文档 / profile 时 fail-fast，不能隐式进入 `local-fake`。
- 图不表达部署命令、env key、URL、secret provider、SDK method 或 owner endpoint。
- `buildConsoleRuntime` 只在 whole-document validation 后调用；flag/binding存在不能把 slot 标为 `bound`。
- 架构/安全/状态不变量永远不受来源覆盖。

### 4.2 配置控制面总表

| 控制面 | 作用 | 对应模块/既有对象 | P0 | 禁止控制 |
|---|---|---|---|---|
| source/validation/assembly | 取得一个文档、合并 defaults、严格校验、构造 typed config | `entry`; `ConsoleClientBindingConfig`; `buildConsoleRuntime` | 是 | 新增字段、绕过 validator、partial activation |
| runtime profile | 选择 `local-fake/integration-pending/production-pending` posture | `entry`/adapter registry | 是 | 声称环境 ready、授予权限、改变 owner truth |
| adapter binding correlation | 将封闭 slot 在特定 profile 下关联 local config ref | `adapters`; `ConsoleAdapterBindingRef[]` | 是 | endpoint/secret/SDK method/owner body；配置即 bound |
| optional invalidation | 请求绑定 SDK hint consumer | `adapters/state`; boolean | 是 | 绕过合同、直连 bus、写 owner truth、恢复 positive state |
| optional diagnostics | 请求绑定 body-free diagnostic facade/sink | `diagnostics`; boolean | 是 | raw error/body/secret、formal audit/evidence、影响业务结果 |
| dependency injection（非 JSON 域） | host lifecycle/route/a11y、volatile carrier、diagnostic/formal adapters 实例注入 | `ConsoleRuntimeDependencies` | 是（装配） | 将 instance/credential/URL/DOM序列化进配置 |

### 4.3 配置域 / 功能模块表

| 配置域 | 对应 03 字段 | 允许配置 | 禁止配置 | 实际消费者 |
|---|---|---|---|---|
| `runtime` | `profile` | 选择既有 runtime posture | 修改 union、声称 readiness、切换 truth/guard | entry composition |
| `bindings` | `adapterBindings[]` | 封闭 slot、profile、body-free local `bindingRef` | URL/endpoint/secret/method/owner ref；重复 slot；跨 profile偷渡 | entry/adapters registry |
| `invalidation` | `enableSdkInvalidation` | 请求启用 optional hint path | 无合同启用、bus/topic/cursor/replay、刷新/写入 | entry/adapters/state coordinator |
| `diagnostics` | `enableDiagnostics` | 请求启用 optional body-free diagnostic path | endpoint/sampling/raw metadata/audit/evidence/readiness | entry/diagnostic facade |

### 4.4 每域小循环与停审

| 域 | 来源 | 允许能力 | 失败安全上限 | 03 影响 | 结论 |
|---|---|---|---|---|---|
| runtime | default + external document | exact union selection | unknown/mismatch→startup reject | 既有字段 | pass |
| bindings | external document（默认空） | exact slot/profile/local ref | empty/pending合法；duplicate/forbidden→reject | 既有字段 | pass with external blockers |
| invalidation | default false + external document | contract-ready profile中的 request | 当前 false/disabled；不降级为私有 consumer | 既有字段 | pass with `CON-Q-034/038/044` |
| diagnostics | default false + external document | controlled local fake request | production false/disabled；失败隔离 | 既有字段 | pass with `CON-Q-046` |

### 4.5 跨控制面审计

| 审计项 | 结论 | 修正/说明 |
|---|---|---|
| 是否遗漏 03 typed config 字段 | pass | 四字段逐一归域 |
| 是否把 dependencies 写进 JSON | pass | 明确为装配实例、非 JSON |
| 是否有控制面重叠 | pass | runtime选姿态；bindings关联slot；两个switch各自独立 |
| 是否允许业务模块读 raw config | no | 仅 entry/config pipeline读取 |
| 是否把 state/host pending伪造成配置项 | no | 只作为 dependency posture / risk |
| 是否允许 flag/route/config授予权限或 active | no | availability + formal observation 必须存在 |
| 是否引入 secret/endpoint/owner body | no | 明确禁止 |
| 是否需要 03 回写 | no | 没有新增字段/port/flow |

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 以一个 strict JSON document 映射现有 config object | 否 | source/serialization | 不适用 | 无回写 |
| 四域严格对应现有四字段 | 否 | 配置组织 | 不适用 | 无回写 |
| dependencies 是注入对象而非 JSON | 否 | 重申既有 builder 签名 | 不适用 | 无回写 |
| 未来配置 state/host/sink/endpoint 新字段 | 是 | builder/config/adapter变更 | 03 Step 4/7/11/14/15 | 当前排除 |

## 6. 回填草稿、待确认与门禁

正式 §3 应包含来源链图、控制面总表和四域表，明确 config reader、runtime assembly 与禁止能力。过程停审留本文件，不把 pending写成已启用。

| 待确认 | 当前处理 |
|---|---|
| host 如何提供 external document | 只定义 source role；07/09 决定具体机制 |
| positive bindings / consumer / sink | pending；Step 5～11 定义拒绝/disabled 姿态 |

| 进入 Step 4 条件 | 结论 |
|---|---|
| 来源链和唯一装配入口明确 | pass |
| 四域均完成停审 | pass / explicit blockers |
| 跨域无 unresolved 内部冲突 | pass |
| 无当前 03 待回写 | pass |

Step 3 `done / pass / self_reviewed`；允许串行进入 Step 4。正式 04 仍不可写。
