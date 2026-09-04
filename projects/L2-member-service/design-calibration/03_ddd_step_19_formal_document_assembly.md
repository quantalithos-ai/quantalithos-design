# 03-详细设计 Step 19：正式详细设计装配

> 项目：`L2-member-service`
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 19
> 书写规范：`standards/document/详细设计书写规范.md`
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_19_formal_document_assembly.md`
> 目标正式文档：`projects/L2-member-service/03-详细设计.md`
> 校准日期：2026-09-02

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 19：正式详细设计装配 |
| 当前状态 | completed / pass_with_upstream_blockers |
| 输入基线 | Step 1~18 均已完成，Gate 为 `pass_with_upstream_blockers` |
| 输出 | 本装配材料与全量重建、审计完成的正式 `03-详细设计.md` |
| 装配方式 | full-restart；旧正式 03 仅作污染审计，不继承正文、对象、协议或实现事实 |
| 停审方式 | 正式 03 完成审计后立即停审；未经用户再次明确确认不得进入 04 |

## 2. 本步目标与装配边界

本 Step 把 Step 1~18 已停审的详细设计结论装配为正式阅读入口。正式 03 固定实现主轴、对象与协议分母、状态和事务红线、配置 / 观测 / 测试切口、实施承接和 blocker；字段级对象卡、完整 trait 签名、DTO 字段和逐接口调用顺序继续由对应 Step 文件承载。

正式 03 不承担以下工作：

- 不复制旧正式 03 的 `MemberRuntimeSession`、`WorkerSlot`、`CapabilityMount`、`ExecutionHandle`、`GovernanceRequest` 或直接执行主线。
- 不替 Runtime、Member、Images、Sandbox、Core、Bus、SDK 或 L1 owner 定义 exact contract。
- 不锁定数据库、broker、RPC、容器、编排、观测后端或配置数值。
- 不创建实现仓、源码、phase、commit、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。
- 不进入 `04-配置设计.md`。

## 3. 装配输入

| 输入 | 状态 | 正式装配用途 |
|---|---|---|
| `03_ddd_step_01_input_boundary.md` | completed | 上游关系、historical material 与输入不足边界 |
| `03_ddd_step_02_scope.md` | completed | 目标、范围、非范围与实现 ceiling |
| `03_ddd_step_03_runtime_constraints.md` | completed | Rust、仓库、注释、依赖与安全约束 |
| `03_ddd_step_04_module_layout.md` | completed_with_owner_correction | planned workspace、crate、binary 与文件 owner |
| `03_ddd_step_05_module_contracts.md` | completed_rebuild | 七模块主轴、职责、依赖方向与 seam 分类 |
| `03_ddd_step_06_object_contracts.md` | completed | 29 个业务对象、shared carrier、application / infra / entry object cards |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | completed | repository、UoW、external port、adapter 与 fake parity |
| `03_ddd_step_08_protocol_contracts.md` | completed | 10 Command、6 Query、5 Consumer、1 material helper、7 Job |
| `03_ddd_step_09_function_flows.md` | completed | 每个协议的函数级顺序、事务、副作用与负向流 |
| `03_ddd_step_10_state_machine.md` | completed | 正交状态轴、合法迁移、禁止推导与 writer |
| `03_ddd_step_11_persistence_tx_consistency.md` | completed | logical store、UoW、revision、cursor、outbox / projection / history |
| `03_ddd_step_12_errors_recovery.md` | completed | 错误分层、结果面、rollback 与恢复分类 |
| `03_ddd_step_13_concurrency_idempotency.md` | completed | revision、key、digest、replay、commit unknown 与重入 |
| `03_ddd_step_14_config_dependencies.md` | completed | typed config binding、runtime builder 和依赖分类 |
| `03_ddd_step_15_observability_audit.md` | completed | 安全日志、低基数指标、审计、trace 与 redaction |
| `03_ddd_step_16_test_cut.md` | completed | 模块、协议、状态、一致性、错误、配置、观测测试切口 |
| `03_ddd_step_17_implementation_handoff.md` | completed | 实施承接、前置阅读与可落码性预复核 |
| `03_ddd_step_18_risks_open_questions.md` | completed | blocker、owner、影响及未确认前处理 |

## 4. 冻结分母

### 4.1 实现模块

```text
contracts -> domain -> application -> infra -> api / worker / jobs
```

七个 crate 是唯一实现主轴；`CMP-MS-01~07` 是跨模块业务责任切片，不是 crate。

### 4.2 业务对象

正式分母为 29 个：

| CMP | 数量 | 对象 |
|---|---:|---|
| CMP-MS-01 | 3 | `HostIntent`、`HostOrchestrationDecision`、`HostControlPolicy` |
| CMP-MS-02 | 4 | `HostQualificationContext`、`RequiredQualificationPolicy`、`HostAssembly`、`HostReadinessDecision` |
| CMP-MS-03 | 4 | `MemberExecutionHost`、`HostActionAttempt`、`HostExternalAssociation`、`HostGenerationFence` |
| CMP-MS-04 | 4 | `HostRegistration`、`HostEndpoint`、`HostSession`、`RegistrationSessionPolicy` |
| CMP-MS-05 | 4 | `HealthSignalSnapshot`、`HostHealthAssessment`、`HostFailureClassification`、`HostRecoveryDecision` |
| CMP-MS-06 | 4 | `HostClosure`、`CleanupAttempt`、`ResidualFinding`、`ReconciliationCase` |
| CMP-MS-07 | 6 | `HostFactMaterial`、`HostHandoffRecord`、`SafeHostView`、`HostProjectionState`、`HostOutboxRecord`、`HostHistoryEntry` |

support value、DTO、application carrier、infra availability 与 entry disposition 不计入 29 个业务对象。

### 4.3 协议

```text
10 Command = 8 public + 2 internal
6 Query
5 Inbound Consumer
1 HostFactMaterialEventCandidate append helper
7 Operations Job
```

该分母以 Step 8 和 Step 16 为唯一依据。统一 material helper 不是已闭合的 Core / Bus event family，不能扩算为多个 ready outbound event。

## 5. 18 章装配矩阵

| 正式章节 | 主要来源 | 装配结论 |
|---|---|---|
| 1. 与上游文档的关系声明 | Step 1 | 只承接已停审 00/01/02；兄弟 WIP 不是 truth |
| 2. 本次详细设计目标与范围 | Step 2 | Host Truth 控制面 ceiling、非范围和 fail-closed |
| 3. 实现约束与编码规范承接 | Step 3 | Rust-facing、依赖分类、实现仓未确认 |
| 4. 实现单元与文件布局 | Step 4 | planned 七 crate 与唯一文件 owner |
| 5. 模块实现契约 | Step 5~7 | 七模块职责、对象与 port/adapter owner |
| 6. 全局对象 / Trait / API 索引 | Step 6~9 | 29 对象、port family 与协议查找入口 |
| 7. API / Command / Query / Event / Job 协议契约 | Step 8 | 统一为 10/6/5/1/7；placeholder 保真 |
| 8. 逐接口函数级处理流 | Step 9 | command/query/consumer/material/job 模板与索引 |
| 9. 状态机与转换矩阵 | Step 10 | 正交状态、合法迁移与禁止推导 |
| 10. 数据持久化、事务与一致性契约 | Step 11 | logical store、原子写集、revision、cursor 分离 |
| 11. 错误模型、异常分支与恢复口径 | Step 12 | 分层错误、稳定 disposition 和恢复 owner |
| 12. 并发、幂等与重入保护 | Step 13 | key/digest/replay/unknown/single-winner |
| 13. 配置引用与外部依赖绑定 | Step 14 | typed section 与 builder；具体 truth 留 04 |
| 14. 可观测性与审计埋点契约 | Step 15 | body-free、low-cardinality、trace / audit 分层 |
| 15. 测试切口与最小验证清单 | Step 16 | 只定义切口，不声称执行 |
| 16. 详细设计到实施计划的承接清单 | Step 17 | 前置阅读、闭环复核与 07 输入 |
| 17. 风险与待确认事项 | Step 18 | blocker、owner、影响与未确认前处置 |
| 18. 参考 | Step 1~19 + standards | 实际使用的标准与设计索引 |

## 6. 装配门禁

| 门禁 | 当前结论 |
|---|---|
| 每章具有具体校准来源与延伸阅读 | 待正式正文装配后审计 |
| 正式对象分母为 29 | pass；装配后审计保持 29 |
| 协议分母为 10/6/5/1/7 | pass；装配后审计保持 10/6/5/1/7 |
| Query no-write | fixed；不得 reserve / refresh / repair / rebuild / append / publish |
| Job no-authorization | fixed；不得创建 intent / decision / authorization / generation / 新 effect key |
| 四层 handoff | fixed；submitted / delivered / observed / accepted 互不推导 |
| cursor exact type | pending；不得创建 alias、conversion、第三类 cursor或替代字段 |
| 上游 exact contract | pending / blocked；正文仅保留 placeholder / fail-closed |
| 历史污染 | pass；正式正文已执行名称与旧主线污染 grep |
| 实现 / 测试 / 交付事实 | pass；正式正文仅保留 planned design，不含实现、测试结果或交付证据 |

## 7. 当前 Gate

```text
step_18_status = completed / pass_with_upstream_blockers
step_19_status = completed / pass_with_upstream_blockers
formal_03_write_allowed = false_after_step_19_stop_review
formal_03_audit = completed
formal_03_stop_review = completed
next_allowed_action = stopped_waiting_for_user_explicit_confirmation_for_04
next_formal_document = 04-配置设计.md
next_formal_document_allowed = false_until_user_explicit_confirmation_after_03_stop_review
```

## 8. 装配后审计记录

| 审计项 | 结果 |
|---|---|
| 正式章节 | 18 章存在，顺序为 1~18；每章均能回指 Step 1~18 或本装配 Step |
| 对象与协议分母 | 29 个业务对象；10 Command、6 Query、5 Consumer、1 material helper、7 Job |
| 核心边界名称 | `MemberRuntimeSession`、`WorkerSlot`、`CapabilityMount`、`ExecutionHandle`、`GovernanceRequest`、`ExecuteRuntimeAction` 未重新引入为本仓 truth |
| cursor 边界 | `HostChangeCursor` / `CommittedChangeCursor` 均保持 exact type pending；无 alias、转换或第三类 cursor |
| handoff 边界 | `submitted`、`delivered`、`observed`、`accepted` 独立；未互相推导 |
| Query / Job 红线 | Query 保持 no-write；Job 仅推进已提交 work，不创建 intent、decision、authorization、generation 或新 effect key |
| 历史污染与越界 | 未发现旧正式 03 主线污染、兄弟项目 truth 冒领或实现事实伪造 |
| 交付事实 | 未创建实现仓、源码、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness |
| 停审 | 正式 03 已完成并停审；未经用户明确确认不得创建或进入 `04-配置设计.md` |

## 9. 停审交接

当前正式文档为 `03-详细设计.md`，Step 19 已完成，Gate 为
`completed / pass_with_upstream_blockers`。`MSVC-UP-001~008`、两类 cursor 的 exact type、
Core/Bus route/envelope/receipt、具体存储/消息/观测产品及 Runtime/Member/Images/Sandbox
正向 mapper 仍是上游 pending / blocked；正式 03 只保留 placeholder / fail-closed 口径。

下一步只有在用户明确确认后，才可读取 `standards/document/配置设计讨论流程_SOP.md`、
`standards/document/配置设计书写规范.md` 及对应上游配置材料，并创建
`projects/L2-member-service/04-配置设计.md`。当前无需提交 commit。
