# Step 9. 定义配置加载、校验与生效机制

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 9 中间产物。
> 本步定义配置如何加载、解析、校验、装配和生效。
> 本步不新增公开 `ConfigLoader` API,不新增 `SdkRuntimeConfig` 字段,不改变 `03-详细设计.md` 中的 runtime builder、adapter、trait、error 或函数流契约。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 9
- 回填章节：`projects/L0-sdk/04-配置设计.md` §9 配置加载、校验与生效机制

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 7 配置项清单 | 11 个既有配置组内的字段级 JSON key、默认值、来源、失败策略 | 固定加载和校验对象 |
| Step 8 敏感配置 | P0 无 secret material,只允许 sensitive reference,禁止输出真实秘密材料 | 固定 secret boundary 校验和脱敏输出 |
| Step 5 来源优先级 | `code defaults < JSON config file < environment variables`,CLI / job args 只作局部输入 | 固定来源合并顺序 |
| Step 6 profile 矩阵 | local-dev、ci-test、integration-test、candidate-validation 为 P0 | 固定 profile 下加载时机和支持范围 |
| `03-详细设计.md` §13 | `ConfigLoader -> ConfigValidator -> SdkRuntimeBuilder -> SdkRuntimeHandle` | 固定装配入口和模块读取边界 |

已确认结论:

```text
P0 配置在 SDK runtime、CLI 或 operations job 启动时加载。
P0 不支持 reload / hot update。
普通来源只包括 code defaults、JSON config file、environment variables。
CLI / job args 只能选择 config path、profile、run id 或本次 operation 参数,不能成为全局覆盖层。
配置必须先完成 parse、type validate、sensitive boundary validate 和 cross-field validate,再进入 SdkRuntimeBuilder。
```

## 3. SOP 问题回答

1. 配置在什么时机加载?

   回答：P0 配置在 SDK runtime bootstrap、CLI 启动或 operations job 启动时加载。client facade、CLI 和 jobs 最终都消费 `SdkRuntimeHandle`。application service、domain object、reports 和 language package surface 不直接读取 JSON、env 或 secret material。

2. 配置如何 parse 和 type validate?

   回答：`ConfigLoader` 先合并 ordinary sources,再把外部 JSON key 解析为 `SdkRuntimeConfig` 的 11 个配置组。类型校验覆盖 enum、bool、array、path、ref、profile 和 language target。未知 key、重复 key、类型错误、非法 enum、非法 path、非法 ref 和非法 language target 都 fail-fast,不得回退低优先级来源。

3. 哪些配置需要 cross-field validate?

   回答：store / outbox / projection root 需要隔离校验;artifacts root、report root 和 package output root 需要层级和可写校验;sources 的 contracts path 需要与编译期依赖边界一致;boundaries 的 formal / fake / bus refs 需要与 profile 和 fake marker 一致;policies 不能降级 redaction、credential protection、fake marker 或 compatibility gate;language packages 必须覆盖 P0 三语言;jobs 必须要求 run id。

4. 哪些配置 startup / reload / hot / build-time / static?

   回答：store、sources、boundaries、runners、artifacts、outbox、projections、language_packages、policies、cli 和 jobs 全部是 startup 或 job-startup 配置。P0 没有 reload / hot 配置。`core-contracts` / `bus-contracts` 的 Cargo path dependency 属于 build-time 约束,但 source adapter 可在 startup 校验其本地路径。禁止配置化项属于 static 设计约束。

5. 校验失败后如何处理?

   回答：parse、type validate、cross-field validate、secret boundary validate 和 forbidden boundary validate 失败必须 fail-fast 或 fail-closed,不得静默回退。runner、boundary、source、artifact、projection 或 outbox 的运行期不可用按已有 domain / adapter 语义转为 stale、pending、failed、evidence failed 或 dependency error。错误输出必须脱敏。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 7 配置项清单 | 已给字段和失败策略,但未统一加载 / 校验顺序 | 实现者可能在 adapter 内分散读取配置 |
| Step 8 敏感配置 | 已定义 sensitive reference 和禁止输出 | 需要进入加载校验链,防止 ref 校验缺失 |
| `03-详细设计.md` §13 | 已给 config loader / validator / builder 图 | 需要由 `04` 补齐 parse、type validate、cross-field validate 和生效方式 |
| 当前 `04-配置设计.md` | 尚未创建 §9 | 测试和验收无法判断非法配置是启动失败、job 失败还是降级 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 加载时机 | 只知道配置进入 runtime builder | 明确 runtime / CLI / job 启动时加载 | 保持 domain / application 不读配置 |
| 校验层次 | 字段失败策略分散 | 拆成 source merge、parse、type validate、sensitive boundary、cross-field validate、builder assemble | 便于实现和测试 |
| CLI / job 参数 | 容易被当全局最高优先级 | 限定为 source selector 或 operation-local 参数 | 避免绕过普通来源和安全边界 |
| 热更新 | 未在本步集中说明 | P0 reload / hot update 一律 unsupported | 避免虚构在线配置系统 |
| 03 回写 | 未判断 | 不新增公开 API、字段或 adapter 参数 | 无需回写 03 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：在 04 中定义正式 Rust loader 函数签名 | 实施更直接 | 会改变详细设计代码契约,需要回写 03 | 不采用 |
| 方案 B：在 04 中定义加载行为、校验阶段和失败策略,函数名留给实现 | 保持配置设计边界,可直接指导测试 | 具体内部函数名由实施阶段决定 | 采用 |
| 方案 C：允许 reload / hot update | 灵活 | 需要在线状态、审计、回滚和 last-known-good,超出 P0 | 不采用 |
| 方案 D：非法高优先级值回退低优先级 | 可用性高 | 掩盖错误配置,破坏验收可判定性 | 不采用 |

推荐方案 B。

原因:

- `03` 已确认 `ConfigLoader -> ConfigValidator -> SdkRuntimeBuilder` 主路径,`04` 应定义行为而不是重写代码 API。
- SDK P0 是启动 / job 级配置,不是在线配置中心或热更新系统。
- fail-fast / fail-closed 能让测试、验收和实施形成一致门禁。

## 7. 结构化中间产物

#### 配置加载流程图: L0-sdk 配置加载与校验

```text
[code defaults]
  + [JSON config file]
  + [environment variables]
        |
        v
[merge ordinary sources by priority]
        |
        v
[parse external JSON keys]
        |
        v
[type validate]
        |
        v
[sensitive boundary validate]
        |
        v
[cross-field validate]
        |
        v
[assemble SdkRuntimeConfig]
        |
        v
[ConfigValidator -> ValidatedSdkRuntimeConfig]
        |
        v
[SdkRuntimeBuilder]
        |
        v
[SdkRuntimeHandle for client / CLI / jobs]

CLI / job args
  +-- may select config path / profile / run id
  +-- may pass operation-local parameters
  +-- must not override forbidden boundaries
```

关键说明:

- 本图表达 P0 启动 / 作业启动配置链,不表达在线 reload 或 hot update。
- 高优先级配置非法时 fail-fast,不得回退低优先级配置。
- CLI / job args 不进入 ordinary source priority chain。
- secret material 不进入配置加载链;配置中只能出现 sensitive reference。

### 7.1 配置加载校验表

| 配置项 / 配置组 | 加载时机 | 校验方式 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| ordinary source merge | runtime / CLI / job 启动 | defaults、JSON、env 顺序;重复 key、未知 key、非法 env 检查 | startup / job-startup | fail-fast |
| CLI / job selector | CLI / job 启动 | 只允许 config path、profile、run id、target 等局部参数 | startup / job-startup | selector 非法 fail-fast |
| `store` | runtime 启动 | `kind` enum、`root` path、profile 允许范围、root 隔离 | startup | fail-fast |
| `sources` | runtime / job 启动 | contracts path 可定位、snapshot ref 可解析、不得复制上游类型 | startup / job-startup | 不可用 stale / pending;真实编译依赖缺失则暂停实现 |
| `boundaries` | runtime / job 启动 | endpoint / boundary ref 格式、fake marker、profile 匹配、无 credential value | startup / job-startup | ref 非法 fail-closed;fake marker 缺失 fail-fast |
| `runners` | job 启动 | profile enum、runner target 支持、P0 不依赖远程 runner | job-startup | profile 非法 fail-fast;运行失败 evidence failed / skipped |
| `artifacts` | runtime / job 启动 | root / report_root path、可写、无项目名重复层级 | startup / job-startup | fail-fast |
| `outbox` | runtime 启动 | kind enum、root path、append / mark 能力、root 隔离 | startup | fail-fast;publish 失败 pending / failed |
| `projections` | runtime / job 启动 | kind enum、root path、只读投影边界、root 隔离 | startup / job-startup | fail-fast;运行失败 stale / rebuild |
| `language_packages` | job 启动 | enabled languages 覆盖 Rust / Python / TypeScript,output_root 可写 | job-startup | 缺语言或不支持语言 fail-fast |
| `policies` | runtime / job 启动 | redaction、credential、fake marker、compatibility gate 不得关闭或降级 | startup / job-startup / static guard | fail-fast |
| `cli` | CLI 启动 | config path 可读、profile 属于 Step 6 矩阵 | startup | fail-fast |
| `jobs` | job 启动 | artifact_root、report_root 可写,`require_run_id` 必须为 true | job-startup | false 或缺 run id fail-fast |
| sensitive boundary | runtime / job 启动 | raw secret / raw token / private key 禁止,ref 输出脱敏 | startup / job-startup | fail-fast / fail-closed |
| reload / hot update request | 任意时刻 | P0 不支持 reload / hot | unsupported | reject-new-value;不修改当前 runtime |
| static forbidden boundaries | 设计和启动校验 | 禁止 fake-as-production、关闭 gate、关闭 redaction / credential | static | fail-fast + 设计变更流程 |

### 7.2 cross-field validate 清单

| 校验项 | 规则 | 失败处理 |
|---|---|---|
| store / outbox / projection 隔离 | `store.root`、`outbox.root`、`projections.root` 不得混用同一目录 | fail-fast |
| artifact / report 层级 | `artifacts.report_root` 和 `jobs.report_root` 不得写成 `reports/<project>` | fail-fast |
| package output 层级 | `language_packages.output_root` 必须落在 artifact root 或明确允许的 package output root | fail-fast |
| source dependency 边界 | `core_contracts_path`、`bus_contracts_path` 只能指向 contracts 依赖,不得指向服务仓 domain / application truth | fail-fast 或暂停实现 |
| fake boundary | fake endpoint 必须保留 fake marker,不能与 production support 混淆 | fail-fast |
| formal boundary | formal endpoint ref 若存在,必须满足 sensitive reference 规则,不得携带 credential value | fail-closed |
| bus boundary | bus boundary ref 不得生成 bus publication / delivery truth | fail-closed |
| language target | P0 candidate-validation 必须包含 Rust / Python / TypeScript | fail-fast |
| policy lower bound | redaction、credential protection、fake marker、compatibility gate 只能保持或收紧 | fail-fast |
| job run identity | operations job 必须携带 run id;`jobs.require_run_id` 不得为 false | fail-fast |
| secret boundary | 普通来源和局部参数不得包含 secret material | fail-fast |
| unsupported config capability | remote config、admin override、hot reload、public registry token 不得作为 P0 配置启用 | fail-fast / unsupported |

### 7.3 生效方式分类表

| 类别 | 配置组 | 生效方式 |
|---|---|---|
| startup | store、sources、boundaries、artifacts、outbox、projections、policies | runtime 启动读取,变更需重建 `SdkRuntimeHandle` |
| job-startup | runners、language_packages、jobs、artifacts、sources、boundaries、policies | job run 开始读取,运行中不变 |
| CLI-startup | cli | CLI 入口读取,只选择 config source / profile / run id |
| build-time | `core-contracts` / `bus-contracts` Cargo path dependency | 由 Cargo / workspace 决定,配置文件不得替代 |
| static | forbidden boundaries、semantic baseline、redaction / credential 下限、fake marker、compatibility gate | 不是普通配置;改变需回到设计链路 |
| unsupported in P0 | reload、hot update、remote config、admin override | 发现即拒绝,不修改当前 runtime |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 定义 P0 配置在 runtime / CLI / job 启动时加载 | 否 | 配置设计行为规则 | 无 | 无回写 |
| 不定义公开 Rust loader 函数签名 | 否 | 避免新增代码契约 | 无 | 无回写 |
| P0 reload / hot update 请求按 unsupported 拒绝 | 否 | 范围裁剪 | 无 | 无回写 |
| cross-field validate 只约束既有配置组和字段级 JSON key | 否 | 配置校验规则 | 无 | 无回写 |
| 如果后续需要公开 loader API 或新增 reload / hot update 机制 | 是 | function / module / lifecycle contract 变化 | `03-详细设计.md` §13 或 infra module 契约 | 待回写 |

说明:

- 本步没有新增 `SdkRuntimeConfig` 字段、adapter constructor 参数、trait 方法、错误枚举或函数流。
- 本步定义实现必须满足的加载行为;具体内部函数名留给实施阶段。

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §9。

````md
## 9. 配置加载、校验与生效机制

> 校准来源：
> - `design-calibration/04_config_step_09_load_validate_apply.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置加载流程图”“配置加载校验表”“cross-field validate 清单”“生效方式分类表”和“对详细设计的影响判定”小节，了解本章加载机制如何从配置项和敏感配置边界收敛。

P0 配置在 SDK runtime、CLI 或 operations job 启动时加载。普通来源按 `code defaults < JSON config file < environment variables` 合并;CLI / job args 只用于选择 config path、profile、run id 或 operation-local 参数,不能作为全局配置覆盖层。

配置必须完成 parse、type validate、sensitive boundary validate 和 cross-field validate,再装配为 `SdkRuntimeConfig`,由 `ConfigValidator` 形成 `ValidatedSdkRuntimeConfig`,最后交给 `SdkRuntimeBuilder` 构造 `SdkRuntimeHandle`。

P0 不支持 reload 或 hot update。reload / hot update 请求必须作为 unsupported 拒绝,不得修改当前 runtime,也不得静默回滚。高优先级配置非法时必须 fail-fast,不得回退低优先级配置。
````

## 10. 待确认事项

- 是否接受 P0 配置只在 runtime / CLI / job 启动时加载。
- 是否接受 CLI / job args 不作为全局配置覆盖层。
- 是否接受 P0 reload / hot update 请求直接 unsupported。
- 是否接受本步不定义公开 Rust loader API。
- 是否接受本步无需回写 `03-详细设计.md`。

## 11. 进入下一步条件

- [x] 配置加载流程图已明确。
- [x] 配置加载校验表已覆盖 11 个配置组。
- [x] cross-field validate 清单已覆盖关键组合约束。
- [x] 生效方式分类已明确 startup / job-startup / build-time / static / unsupported。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 9 状态从 `[~]` 更新为 `[x]`。
