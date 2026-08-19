# L2-runtime 03 详细设计 Step 5: 分层、能力切片与模块实现契约主轴

> 创建日期: 2026-08-08
> 状态: done
> 当前模式: controlled_reopen
> 回填位置: 正式 `03-详细设计.md` 第 5 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 3/4、`02-概要设计.md` 八个主要组成部分、`L1-governance` Step 5 结构、详细设计闭环标准 |
| 目标 | 建立“业务能力 -> 技术分层 -> 对象 -> Port -> 协议 -> Flow -> 状态 -> 测试”推导主轴 |
| 禁止 | 只列模块职责；把业务能力机械拆成 crate；在本 Step 提前写完整字段或函数实现 |

## 1. 技术实现分层

| 层 | 负责 | 读写权 | 不能做 |
|---|---|---|---|
| `contracts` | public DTO、typed ref、metadata、event/job/view/error | 无 truth 写权 | 不承载 domain invariant |
| `domain` | Runtime local truth、decision、state、policy、不变量 | 只改 domain 对象 | 不读 I/O/config/adapter |
| `application` | command/query/event/job service、UoW、幂等、port 调用 | 唯一 use-case 写编排 | 不依赖具体 infra |
| `infra` | repositories、adapters、projection、publisher、builder、config | 实现 application port | 不替代 application/domain |
| `api` | sync command/query entry | 解析并调用 application | 不直写 truth |
| `worker` | async inbound event/continuation | 调用 application | 不绕过 application |
| `jobs` | bounded rebuild/recovery/reconcile/handoff | 调用 application | 不制造 readiness/evidence |

## 2. Runtime 业务能力切片

| 能力 ID | 能力 | 输入 | 输出/本地事实 | 主要对象 | 主要 Port | 主 Flow | 状态族 | 测试切口 |
|---|---|---|---|---|---|---|---|---|
| `CAP-01` | Shared Runtime Vocabulary | Core refs、metadata、scope | typed identity、digest、correlation、reason | `RuntimeScope`、`CommandMetadata`、`RuntimeCorrelation` | `ClockPort`、`IdGeneratorPort` | envelope validation | metadata/marker | invalid/missing/forbidden-body |
| `CAP-02` | Admission & Control | trigger、actor、scope、governance precondition | admission decision、run creation/control fact | `RuntimeTriggerContext`、`RuntimeAdmissionDecision`、`ControlledRun` | source/governance/idempotency/run repo/UoW | Accept/ApplyControl | admission/run | duplicate/scope/version/fail-closed |
| `CAP-03` | Goal & Plan Working State | goal refs、constraints、progress inputs | working plan、progress decision/history | `GoalPlanWorkspace`、`RunProgressDecision` | run/workspace/history repo、definition resolver | EvaluateRunProgress | run/goal-plan | missing dependency/no terminal |
| `CAP-04` | Context Composition | source refs、candidates、budget | composition decision、frozen context | `MemoryCandidate`、`ContextCompositionDecision`、`WorkingContext` | source/memory resolver | ComposeWorkingContext | context/source | stale/budget/body |
| `CAP-05` | Working/Episodic/Semantic Memory Mediation | retrieval request、candidate refs | working window、memory use record | `WorkingMemory`、`MemoryUseRecord` | `MemoryRetrievalPort` | Retrieve/UseMemory | memory | unavailable/duplicate/compaction |
| `CAP-06` | Provider-neutral Model Decision | frozen context、logical selection | model turn、semantic decision、safe summary | `ModelIntent`、`ModelTurn`、`ModelDecision` | `ModelDecisionPort` | Start/ConsumeModelResult | turn/disposition | late/unknown/raw-body |
| `CAP-07` | Action Orchestration | model action candidate、scope/budget/preconditions | action choice、guard、submission attempt | `ActionDecision`、`ActionPreconditionDecision`、`SideEffectMarker` | governance/capability/tools/sandbox | Evaluate/SubmitAction | action/effect | denied/unknown/no execution |
| `CAP-08` | Sub-agent Delegation | parent context、child scope/budget | child delegation and result incorporation | `Delegation`、`ChildContextBoundary` | child runtime seam, source resolver | Create/ConsumeChildResult | delegation | budget/context isolation/duplicate |
| `CAP-09` | Feedback Incorporation | action/model/child feedback | immutable feedback record、新 progress decision | `ActionFeedbackRecord`、`ModelDecision`、`RuntimeHistoryEntry` | event consumer、feedback repo | IncorporateFeedback | feedback/order | duplicate/late/out-of-order |
| `CAP-10` | Checkpoint & Recovery | stable candidate、effect fence、recovery trigger | checkpoint、recovery decision | `RuntimeCheckpoint`、`RecoveryDecision`、`SideEffectMarker` | checkpoint repo/UoW/lease | CommitCheckpoint/RequestRecovery | checkpoint/recovery | commit-unknown/manual-review |
| `CAP-11` | Local Outcome | terminal local facts、result refs | Runtime local outcome | `RuntimeOutcome` | run/outcome/history repo | FinalizeRuntimeOutcome | outcome | terminal/unknown fence |
| `CAP-12` | Handoff & Safe Projection | committed outcome、safe refs、query scope | handoff attempt/gap、safe view/projection | `HandoffAttempt`、`HandoffGap`、`SafeRuntimeView`、`ProjectionState` | publisher/projection/handoff/bus/obs | CreateHandoff/Reconcile/Rebuild | handoff/gap/projection | local-first/stale/gap |

## 3. 能力到技术模块交叉矩阵

| 能力 | contracts | domain | application | infra | api | worker | jobs |
|---|---|---|---|---|---|---|---|
| CAP-01 | metadata/refs/reasons | value validators | operation context | clock/id | envelope mapping | event envelope | job metadata |
| CAP-02 | trigger/control/result | admission/run | admission/control service | run/idempotency repos, governance adapter | command handlers | none | resume scan |
| CAP-03 | progress DTO/view | goal-plan/history | progress service | truth/history repos | progress handler | progress event | eligible scan |
| CAP-04/05 | context/memory DTO | context/memory/source | context service | source/memory adapters | compose handler | snapshot changed | compact/refresh job |
| CAP-06 | model DTO/event | model turn/decision | model service | model adapter | turn handler | result consumer | retry/reconcile candidate |
| CAP-07/08 | action/delegation DTO | action/delegation/effect | action/delegation service | Tools/Sandbox/child adapters | action handler | feedback consumer | unknown fence scan |
| CAP-09 | feedback envelope | feedback/history | feedback service | feedback repository | none | event consumer | late reconciliation |
| CAP-10/11 | checkpoint/recovery/outcome DTO | checkpoint/recovery/outcome | recovery/outcome service | UoW/checkpoint/lease | recovery handler | continuation | resume/recovery job |
| CAP-12 | handoff/view/job DTO | handoff/projection | handoff/query/job service | publisher/projection/handoff | query handler | outbox publisher | rebuild/reconcile |

## 4. 每能力实现卡片要求

后续 Step 6~10 必须按上表逐能力推进，每张能力卡至少包含：

1. Capability contract：输入、输出、scope、budget、owner、forbidden body。
2. Domain object group：对象字段、构造、成员函数、状态 enum、不变量。
3. Port group：每个读写函数、版本/分页/ordering、错误和 adapter availability。
4. Protocol group：Command/Query/Event/Job DTO 与 secondary public types。
5. Flow group：每接口单独调用链、UoW、commit/outbox/projection、副作用和错误分支。
6. State group：状态主语、转换、guard、非法迁移和测试。
7. Cross audit：字段来源、DTO 构造、状态、phase boundary 和 evidence boundary。

## 5. 深度重建 annex 索引

| Annex | 能力 | 已闭合内容 | 状态 |
|---|---|---|---|
| `03_ddd_step_05_capabilities_01_03.md` | CAP-01 Shared Vocabulary、CAP-02 Admission & Control、CAP-03 Goal & Plan | typed input/output、crate/file、object、Port、protocol、Flow、state、transaction/error、test | done |
| `03_ddd_step_05_capabilities_04_06.md` | CAP-04 Context、CAP-05 Memory、CAP-06 Model | typed input/output、crate/file、object、Port、protocol、Flow、state、transaction/error、test | done |
| `03_ddd_step_05_capabilities_07_09.md` | CAP-07 Action、CAP-08 Delegation、CAP-09 Feedback | typed input/output、crate/file、object、Port、protocol、Flow、state、transaction/error、test | done |
| `03_ddd_step_05_capabilities_10_12.md` | CAP-10 Checkpoint/Recovery、CAP-11 Outcome、CAP-12 Handoff/Projection | typed input/output、crate/file、object、Port、protocol、Flow、state、transaction/error、test | done |

本主文件只保存技术分层、能力总索引和 Step 门禁。上述四个 annex 是 Step 6~17 的逐项推导输入；后续文档不得只回指本文件第 2 章总表而跳过 annex 中的字段、失败、事务和测试承接。

## 6. 模块停审记录

| 模块/能力批次 | 结论 | 下一承接 |
|---|---|---|
| contracts / CAP-01 | shared identity/metadata/marker owner 闭合 | Step 6 shared types、Step 8 envelope |
| domain / CAP-02~12 | Runtime local truth 语义 owner 闭合 | Step 6 逐对象字段与函数 |
| application | 每能力 service/UoW/port 编排 owner 闭合 | Step 7 port、Step 9 flow |
| infra | adapter/repository/builder owner 闭合，外部正向 seam 仍 blocked | Step 7 adapter state、Step 14 binding |
| api/worker/jobs | entry/consumer/job 只调用 application | Step 8 protocol、Step 9 handler/job flow |

## 7. Step 5 深度重建门禁

| 检查 | 结果 |
|---|---|
| 技术分层与业务能力两条轴均明确 | pass |
| 12 个能力均有对象/Port/协议/Flow/状态/测试承接 | pass |
| 四个 annex 均逐能力列出 crate/file/object/function 分配 | pass |
| 12 个能力均逐项列出 transaction/error/test 与后续 Step 回指 | pass |
| 未以本主文件摘要替代 capability 独立实现卡 | pass |
| 未把业务能力机械拆 crate | pass |
| pending seam 未写成 positive implementation | pass |
| Step 6 可按能力批次逐对象展开 | pass |

```text
gate_status = done
next_allowed_action = create_03_ddd_step_06_object_contracts
```
