# 00 需求 Step 6 · 使用方与依赖

> 状态：`completed`
> 前置：`00_req_step_05_users_roles.md`
> 依据：`standards/document/全局项目依赖关系与裁剪规则.md` §2、§4、§5、§6
> 回填章节：正式 `00` §6 使用方与依赖

## 1. 本步目标

说明 Runner 为哪些产品/系统提供端侧运行体验，依赖哪些内部仓提供正式能力，以及依赖失效时对核心闭环的影响。只写能力级关系，不写 API、事件名、DTO、调用链或实现组织。

## 2. 输入与诊断

- 全局依赖矩阵将 `L5-runner` 定义为 `L0-core/L0-sdk` 编译/访问消费者、`L4-sandbox` 运行期消费者、按需消费 Artifact 状态的 L5 产品。
- 产品矩阵把 Runner 的主要消费聚焦在 Artifact、SDK 和 Sandbox，并把 Work 作为只读项目身份语境。
- 当前专项上游正式文档进一步确认：Artifact/Governance/Runtime/Sandbox/Observability/Archive 各自拥有不同 truth；Runner 不应通过源码或内部表依赖它们。
- `RUN-UP-001~008` 记录了 Release locator、authority、adapter、runtime read surface、handoff、resource 和 SDK 合同缺口。

## 3. 内部仓依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 ID、typed ref、错误、trace、metadata 和版本语义。 | 是（共享契约成立前置） | Runner 无法稳定表达 source ref、错误和请求关联；不应本地复制。 |
| 输入 | `L0-sdk` | 官方身份/语境、Artifact/Governance/Runtime/Sandbox/Observability/Archive 的正式访问封装和错误/redaction/trace 边界。 | 是（访问路径前置） | 不能以正式方式访问上游；本地直连或 fake-ready 均不允许。 |
| 输入 | `L1-artifact` | 可消费 Release/version/baseline 摘要、locator/manifest/integrity authority 和撤销/过期语境（合同成立后）。 | 是 | 无法证明选择的是不可变、可下载、可验证版本；下载/启动保持 blocked。 |
| 输入 | `L1-governance` | approved/baselined authority、适用 scope、expiry/revoke/conflict 结论。 | 是 | Runner 不能本地判定批准；不得进入下载或启动资格。 |
| 输入 | `L1-work` | Project/ProjectMember 的正式项目语境或安全引用。 | 条件前置 | 无法确认项目运行语境时，项目受限入口应保持不可见/blocked；不由 Runner 补造成员资格。 |
| 输入 | `L1-workspace` | 仅在正式 export/read 面成立时提供安全跨域摘要。 | 否（可选） | Workspace 视图缺失不应改变 Runner 自有选择和本地状态，但不得用它替代 owner truth。 |
| 输入 | `L2-runtime` | Runtime execution/status/result 的正式安全消费面和恢复语境。 | 运行观察前置 | 只能显示 request/unknown 或 unavailable，不能将本地进程状态写成运行结果。 |
| 输入 | `L4-sandbox` | Sandbox request、boundary、policy、lease、controlled run、capture、cleanup 和 reconcile 的正式运行期能力。 | 是（运行闭环前置） | 无法安全启动、停止或清理；不得直接调用私有 backend。 |
| 输入 | `L4-observability` | 安全 diagnostic view、handoff/receipt、visibility/freshness 和 retention 交接语境。 | 诊断/交接前置；非启动前置 | 只能保留本地受限诊断；不得将其升级为 evidence/report/verdict。 |
| 输入 | `L4-archive` | 归档/恢复安全引用或状态（正式合同成立后）。 | 否（当前可选） | 不影响核心运行闭环；不得将 archive 状态当运行或清理成功。 |
| 输出 | `L5-console` / `L5-chat` / `L5-sync` | 安全运行摘要、状态链接或用户入口引用（若下游正式开放）。 | 否 | 下游无法展示 Runner 状态，但不改变 Runner/上游 truth；不反向写入 Runner。 |

## 4. 外部系统依赖

当前阶段没有已形成正式合同、且必须纳入 Runner 核心需求主链的外部系统依赖。操作系统、文件系统、网络、进程和端口仅作为端侧环境/能力边界，具体平台实现与资源探针合同后置到架构、配置和测试阶段；它们不能被写成全局调度、治理或 Sandbox truth。

## 5. 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | L0 shared contract source | 依赖方 | 编译期 | 是 | Runner 需要正式 ref/error/metadata 语义；仅此类关系可成为 package dependency。 |
| `L0-sdk` | L5 产品官方访问封装 | 依赖方 | 编译期 + 运行期 | 是 | SDK 是上游访问入口；具体语言/package surface 待核验。 |
| `L1-artifact` | Artifact/版本/baseline owner | 运行期消费方 | 运行期 | 是，blocked by `RUN-UP-001` | Runner 只消费 Release/version/integrity 语境，不拥有 Artifact truth。 |
| `L1-governance` | Policy/Gate/Decision/Approval owner | 运行期消费方 | 运行期 | 是，blocked by `RUN-UP-002` | 只消费 authority chain，不本地批准。 |
| `L1-work` | Project/ProjectMember/WorkItem owner | 语境消费方 | 运行期 | 条件 | 只接收 project context，防止 Runner 伪造项目资格。 |
| `L1-workspace` | 跨域只读 view owner | 可选消费方 | 运行期 | 否/条件 | Workspace view 不是运行、Release 或权限真相。 |
| `L2-runtime` | Runtime execution owner | 状态/结果消费方 | 运行期 | 是，blocked by `RUN-UP-004` | 不扩展 runtime control，不拥有 outcome。 |
| `L4-sandbox` | isolation/execution owner | 正式请求方 | 运行期 | 是，blocked by `RUN-UP-003` | 仅经公开边界提交运行和清理意图。 |
| `L4-observability` | observation/diagnostic owner | 摘要/handoff 消费方 | 运行期 | 条件，blocked by `RUN-UP-005` | 不把本地诊断升级成正式证据。 |
| `L4-archive` | archive/restore owner | 受限引用消费方 | 运行期 | 否/条件，blocked by `RUN-UP-006` | archive 不参与运行成功判定。 |
| `L0-bus` | 事件传递主干 | 间接协作方 | 事件协作 | 否，除非 SDK 正式暴露 | Runner 不拥有 delivery/ack/replay truth，不直接订阅内部 topic。 |
| `L5-console` / `L5-chat` / `L5-sync` | L5 产品消费者 | 被消费方 | 运行期/引用 | 否 | 只消费安全摘要或链接，不反向定义 Runner truth。 |

## 6. 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core`、`L0-sdk`（仅 exact package surface 成立后） | 使用共享契约和官方访问封装；不得引入 sibling 私有实现。 | `01` 架构、`03` 详细、`07` 实施计划 |
| 运行期依赖 | Artifact、Governance、Work、Runtime、Sandbox、Observability、Archive | 消费正式查询、请求、状态、结果和 handoff 能力；每条边界独立校准。 | `01` 架构、`02/03` 概要/详细、`04` 配置 |
| 事件协作依赖 | `L0-bus`（仅经正式 SDK/事件面） | 接收状态变化或协作信号时保持本地 cursor/状态与 bus delivery truth 分离。 | `01` 架构、`03` 详细、`05` 测试 |

## 7. 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| Runner → Artifact/Governance/Sandbox/Runtime/Observability 的源码路径、内部表或共享数据库事务 | 绕过 owner truth、visibility、审计和版本边界。 | SDK、正式 query/command/result 或评审 adapter。 |
| Runner → Sandbox 私有实现（Docker/gVisor/Firecracker/Tauri 绑定） | 将可替换实现变成跨仓契约，破坏 Sandbox isolation owner。 | 公开 Sandbox API/adapter seam；技术选型后置。 |
| Runner → `L0-bus` 的直接内部 topic/consumer group（未由 SDK 暴露） | 把 delivery/replay truth 和产品状态混在一起。 | 使用 SDK/正式事件协作面或安全 read surface。 |
| Runner → `latest`/默认版本/目录最新文件 | 版本可变、不可审计、无法证明 authority。 | 用户显式选择 immutable Release/version ref。 |
| Runner → 本地日志/telemetry 作为 Observability evidence | 材料不完整、可能含 secret，且不具备正式审计 authority。 | redacted diagnostic + Observability handoff。 |
| Runner → 下游产品内部状态反写 RunnerRun 或上游 truth | 形成产品间多真相和循环依赖。 | 只提供稳定安全摘要/ref；控制动作回到 owner。 |

## 8. 依赖裁剪图：L5-runner

```text
          +-------------------+
          | L0-core [compile] |
          +---------+---------+
                    v
          +-------------------+
          | L0-sdk [compile]  |
          |   [runtime seam]  |
          +---------+---------+
                    v
 +------------------+------------------+
 |                  |                  |
 v                  v                  v
L1-artifact     L1-governance      L1-work
[runtime]       [runtime]          [runtime]
   |                  |                  |
   +-----------+------+------------------+
               v
         L5-runner local product state
               |
       +-------+--------+----------------+
       v                v                v
 L2-runtime       L4-sandbox      L4-observability
 [runtime]        [runtime]       [runtime]
       |                |                |
       +----------------+----------------+
                        v
                  L4-archive [runtime, conditional]

 L0-bus --[event, only via formal SDK/event seam]--> Runner
 Runner --[runtime/ref, conditional]--> L5-console / Chat / Sync
```

图示说明：该图只展示从全局基线裁剪出的 Runner 相关依赖边；只有 `[compile]` 关系在 exact contract 成立后才可能进入 package dependency，`[runtime]` 和 `[event]` 不得写成 Cargo/path 依赖。图不表达调用顺序、事件 payload、接口时序或实现流程。

## 9. 依赖失效与主链影响

| 依赖失效类别 | 核心能力影响 | 需求层处置 |
|---|---|---|
| authority/Release 不可用 | 选择、下载和运行资格无法验证 | blocked/pending；不使用旧 cache 直接启动。 |
| SDK/actor/context 不可用 | 无可信请求语境 | 安全停留在未认证/不可用；不直连上游。 |
| Sandbox/lease/cleanup 不可用 | 正式运行与清理不能安全成立 | 禁止启动或危险控制，保留 reconcile/人工确认。 |
| Runtime status/result 不可用 | 不能证明 running/terminal | 显示 unknown/unavailable；不以 PID/端口替代。 |
| Observability handoff 不可用 | 诊断交接受限 | 只保留本地 redacted 摘要，不生成 evidence/verdict。 |
| Archive 不可用 | 仅影响归档/恢复外围能力 | 不影响核心运行判断，不把 archive 状态当成功。 |

## 10. 回填草稿与门禁

正式 §6 将按规范包含内部仓依赖表、外部系统依赖说明、本仓依赖裁剪表、依赖类型分类表、禁止依赖表和裁剪图。所有关系均保持能力级表达；具体协议留给后续文档。

- [x] 已区分编译期、运行期和事件协作依赖。
- [x] 已指出闭环前置和失效影响。
- [x] 已裁剪而非复制全局 27 仓矩阵。
- [x] 已显式列出禁止源码/私有实现/直接 bus/`latest`/日志依赖。
- [x] 未写 API、事件名、DTO、调用链或实现目录。

`Step 6 gate_status = pass`；下一步允许进入 `Step 7 核心能力闭环`。
