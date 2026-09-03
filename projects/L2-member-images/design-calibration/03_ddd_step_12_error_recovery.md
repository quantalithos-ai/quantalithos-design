# L2-member-images 03 详细设计 Step 12：错误模型、异常分支与恢复口径

> 创建日期：2026-08-30  
> 状态：`completed_stop_review`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 12  
> 回填位置：正式 `03-详细设计.md` 第 11 章“错误模型、异常分支与恢复口径”（当前仅形成回填草稿，禁止装配正式 03）  
> 当前授权：用户已明确授权完成 Step 12；本文件完成后必须停审，未经再次明确确认不得创建 Step 13、装配正式 03、实现、测试或提交。

## 0. Step 状态与开工确认

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 12：错误模型、异常分支与恢复口径。 |
| 当前模块 | `error_recovery`；本 Step 只收束已有模块的错误和恢复，不新增业务模块。 |
| 恢复入口 | 已先读取 `project_execution_ledger.md`、`03_ddd_calibration_flow.md`，再读取 Step 6~11 中间产物、Step 12 SOP/书写规范以及 L1-governance 同粒度样例。 |
| 直接输入 | Step 6 `DomainError` 与生命周期；Step 7 `ImageApplicationError`、port/UoW/replay；Step 8 protocol surface；Step 9 28 条 flow；Step 10 state matrix；Step 11 persistence/consistency。 |
| 方法参照 | 仅借鉴 L1-governance 的“错误层级 → 对外映射 → 异常分支 → 恢复分类 → 跨 Step 审计”粒度；不继承其 outbox、publisher、delivery、receipt、dead-letter、job report 或治理对象。 |
| 当前写入上限 | Query 只读；条件入站 marker-only；Command/Job 仍受 `DDD-S9-B01/B02` 阻断，不能 begin UoW、reserve、save、complete 或 commit。 |
| 完成结论 | 目标为 `pass_with_explicit_blockers`：已有错误类型和 surface 可以形成实现者可用的分类与分支；未闭合 owner contract、result identity、projection recovery 与 AvailabilityTransition persistence 仍明确保留。 |
| 强制停点 | Step 12 完成后只允许停审并等待用户确认 Step 13；不得自动创建 `03_ddd_step_13_concurrency_idempotency.md`。 |

### 0.1 本 Step 的边界重申

- 本 Step 只解释已有对象、port、protocol、flow 和 state 的失败语义；不凭错误分类新增业务对象、状态、port、事件、存储或 transport。
- `ImageApplicationError` 是本仓现有 port/application 统一错误面。本 Step 不另造 `RepositoryError`、`ResolverError`、`PublisherError`、`JobError` 等 Rust enum；来源差异通过现有 variant、`SafeReason` 与所属 port/flow 记录。
- `ImageProtocolErrorKind`、`ImageCommandOutcomeKind`、`ImageQuerySurfaceStatus`、`ImageJobOutcomeKind` 和 `InboundContractState` 均沿用 Step 8/10 既有定义；本 Step 不扩展 variant。
- Query 的 degraded 结果必须留在既有 `ImageQuerySurface`（`Present`、`Empty`、`Stale`、`Rebuilding`、`Unavailable`、`Gap`）和 `ImageQueryContentState` 内，不通过 query-time repair、gap 创建或 freshness 写入恢复。
- 条件入站只可返回 `ImageInboundBoundaryResult` 的 marker disposition，`accepted_input=false`；不引入 envelope、payload、receipt、dedup、quarantine 或事件重试记录。
- 本仓没有授权的 outbound event inventory，`ImageOutboundEventInventory::NoneAuthorized` 继续有效；`ImageTraceRecord`、`AvailabilityTransition`、stored result 和 local marker 不是 outbox/event/delivery receipt。
- `MI-UP-001/002/003/005/006/007/009`、`Q-MI-003/004`、`DDD-S9-B01/B02`、`DDD-S11-B03` 与 `PF-UNAVAILABLE-RECOVERY` 在本 Step 只作为 blocker 或 reopen 条件，不得转写成已解决事实。

## 1. Step 内计划、批次与停审门禁

| 批次 | 覆盖范围 | 状态 | 完成判断 |
|---:|---|---|---|
| 12.0 | 开工恢复、输入、范围与 SOP 问答 | `done` | 已确认不读取旧正式 03，不把兄弟项目 pending 写成正向合同。 |
| 12.1 | 错误层级与既有错误类型表 | `done` | domain/application/port/entry/protocol/query/job 的责任和错误来源可回指。 |
| 12.2 | 内部错误到 Command/Query/条件入站/Job surface 的映射 | `done` | 每类 surface 都有安全返回、禁止泄漏和 caller 处理上限。 |
| 12.3 | 异常分支、事务失败、重复、外部 seam 与 projection 分支 | `done` | 检测位置、处理顺序、rollback/无写边界和审计写入规则明确。 |
| 12.4 | retryable / non-retryable / manual 恢复口径与 defect catalog | `done` | 恢复不反写真相，未知结果不盲重试，人工介入条件可判定。 |
| 12.5 | Step 6~11 跨审计、回填草稿、Step 13 handoff 与停审 | `done` | 无新增未授权契约；台账和 flow 可切换为 `completed_stop_review`。 |

| Step / 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| `error_recovery` | done | done | done | done | done | done | `pass_with_explicit_blockers` | 停审，等待用户明确确认 Step 13。 |

## 2. 本步输入与准入检查

| 输入 | 定位 | 本 Step 使用方式 | 不得推导 |
|---|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已完成对象与 domain 基线 | 读取 `DomainError`、`SafeReason`、生命周期非法边和 marker 状态 | 不新增 domain error variant；不把错误文本当 identity。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 port / adapter 方向 | 读取 `ImageApplicationError`、UoW、repository、projection、replay 与 external seam 失败边界 | 不把 port 来源扩展成 sibling public API；不泄露 provider body。 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 public protocol surface | 读取 command/query/inbound/job outcome、错误 kind、surface 与 replay 映射 | 不定义 HTTP/RPC code、route、topic、envelope 或 receipt。 |
| `03_ddd_step_09_function_flows.md` | 已完成逐接口流 | 逐 flow 收束异常分支、停止点、调用顺序与副作用 | 不把 future/reopen sequence 写成当前执行事实。 |
| `03_ddd_step_10_state_matrices.md` | 已完成状态矩阵 | 将非法 transition、terminal、unknown、stale、gap 映射到既有错误 | 不新增全局状态机或 `Ready` 汇总状态。 |
| `03_ddd_step_11_persistence_consistency.md` | 已完成 persistence/transaction | 收束 version conflict、UoW、append-only、projection、replay 和一致性缺陷 | 不选数据库、隔离级别、重试次数或物理恢复脚本。 |
| standards 与 L1 样例 | normative / 粒度参照 | 约束四张表、恢复分类、审计与停审记录 | 不复制治理领域对象和 outbox 体系。 |

### 2.1 准入结论

```text
Step 6 domain error
  -> Step 7 application / port error
  -> Step 8 protocol surface
  -> Step 9 flow branch
  -> Step 10 illegal transition
  -> Step 11 transaction / consistency failure
  -> Step 12 unified recovery classification
```

上述链路只允许引用已存在的类型和函数。任何需要新 DTO、newtype、状态 variant、result factory、事件 receipt 或 owner confirmation 的分支必须退回相应 Step，并登记 blocker，而不能在本 Step 临时补定义。

## 3. SOP 问题回答

| # | SOP 问题 | 收敛回答 |
|---:|---|---|
| 1 | 每个模块有哪些错误类型？ | `domain` 只返回 `DomainError`；application/port/UoW/replay 统一返回 `ImageApplicationError`；protocol 映射为 `ImageProtocolError` 或既有 query/job/inbound surface；infra 的底层异常不得穿透。 |
| 2 | 哪些错误映射到 HTTP/RPC/Event 失败？ | 当前没有绑定 transport。Command 通过 `ImageProtocolErrorKind` 与 `ImageCommandOutcomeKind` 表达；Query 通过 `ImageQuerySurface` 表达；条件入站通过 marker disposition 表达；Job 通过 `ImageJobOutcomeKind` 表达。未来 transport 只能包裹这些安全 surface，不能自行暴露底层错误。 |
| 3 | 哪些可重试、不可重试、需人工介入？ | transient local store/adapter unavailable、可重新读取的 optimistic conflict 属于 retryable；输入/typed-ref/状态/幂等冲突与未闭合 schema 属于 non-retryable；commit unknown、rollback uncertain、stored result missing、sidecar/projection 关系损坏、B03 与 raw body 污染属于 manual。具体退避、次数、并发窗口留 Step 13/14。 |
| 4 | 事务失败、并发冲突、重复请求、外部依赖失败如何处理？ | UoW 内 local failure 在 commit 前整体 rollback；version conflict 停止并要求 reload；同 key 同 canonical input 只读 stored replay；同 key 不同 input 返回 conflict；外部 seam 不参与 local atomic commit，temporary unavailable 只能返回 safe unavailable/delayed 或 future local marker，不能伪造成功。 |
| 5 | 哪些异常写审计、日志或事件？ | 本仓没有通用 audit backend 和 outbound event。只有既有 flow 明确要求的 `ImageTraceRecord`、availability history、gap、freshness、stored result 或 local marker 才能写入；拒绝、重复、Query no-write、当前 marker-only inbound 不写 success trace/event。日志与指标埋点留 Step 15。 |

## 4. 当前材料问题诊断

| 来源 | 已有内容 | 若不收束的实施风险 | 本 Step 诊断与修正 |
|---|---|---|---|
| Step 6 | `DomainError::{Validation, WrongReferenceKind, InvalidTransition, Blocked, Conflict}` 与大量 lifecycle state | 实现者可能把 repository、transport、provider error 塞进 domain，或把所有失败都叫 blocked | 固定 domain 只验证 local invariant / state / typed ref；port 和 protocol 错误在上层映射。 |
| Step 7 | `ImageApplicationError` 已有八个 variant，repository/UoW/replay 均使用该面 | 可能按 port 自行新增错误 enum，导致 fake/durable 与 application 不一致 | 保持统一 application error；来源通过表格和 `SafeReason` 分类，不新增 Rust error type。 |
| Step 8 | command/query/inbound/job surface 已定义，但 retry 与 manual 规则留空 | 可能把 Query missing 当 command failure、把 marker 当 receipt、把 job result 当 report | 固定 surface-specific mapping 和 no-write / no-report 边界。 |
| Step 9 | 每条 flow 已有当前停止点与 future 顺序 | 可能在失败后继续 repository save、adapter retry、page scan 或重跑 duplicate | 为每条 flow 写检测点、停止点、rollback 与允许副作用。 |
| Step 10 | 非法转换统一回到 `DomainError::InvalidTransition` | 可能用 `Blocked`、`Unavailable` 或外部 readiness 覆盖非法 transition | 非法状态严格映射 `InvalidTransition`；依赖缺口和不可用保持各自类别。 |
| Step 11 | optimistic version、append-only、projection/read model、replay 顺序已定义 | 可能 commit 半成品、覆盖 history、从当前 truth 重算旧结果 | 固定 commit 前 all-or-nothing；commit unknown 不盲回滚/重试；缺 sidecar 进入 consistency defect。 |
| 并行兄弟项目 | `L2-member`、`L2-member-service` 尚未停审 | 可能把 consumer/member contract 当成已闭合 dependency | 仅保留 `MI-UP-001/002` 等 pending；错误分支只能 gap/unavailable/reopen。 |

## 5. 改动前后对比

| 主题 | 进入 Step 12 前 | 本 Step 后 | 为什么改 |
|---|---|---|---|
| 错误层级 | 类型分散在 Step 6~8，缺统一 caller 处理口径 | 建立 domain → application/port → protocol/query/inbound/job 的单向映射 | 让实现者知道错误在哪一层转换，避免底层异常穿透。 |
| retry 分类 | Step 11 只说明“后续定义” | 对每个失败场景标记 retryable、non-retryable 或 manual，并注明 Step 13 deferred 项 | 防止把不可判定结果当 transient retry，或把 schema defect 交给无限重试。 |
| Command/Job 当前状态 | future UoW 顺序与当前 B01/B02 停止点并列 | 明确当前所有写类入口在设计 blocker 处停止；future 分支只作为 reopen contract | 防止把设计草稿误当已运行、已持久化或已执行事实。 |
| Query / inbound | surface 已定义，异常副作用边界分散 | 固定 Query no-write、marker-only inbound、无 receipt/dedup/event mutation | 保持读侧和条件入口的纯度，避免隐式 repair。 |
| replay | result missing 已在 port 中出现，恢复未统一 | 缺 result/shell/body、kind mismatch、commit unknown 统一归 consistency defect，禁止重算 | 防止 duplicate 产生与原事务不同的结果。 |
| projection / history | 有状态和持久化规则，但异常处理不集中 | projection failure 只保留 source truth 与 safe stale/unavailable；history append-only | 防止 projection/cache/repair 反写真相或覆盖历史。 |
| outbound | 参照 L1 容易误加 publisher/outbox | 明确 inventory 仍为 `NoneAuthorized`，本 Step 零 outbound 错误面 | 防止粒度参照变成职责越界。 |

## 6. 设计取舍

| 议题 | 候选 | 本 Step 结论 | 取舍理由 |
|---|---|---|---|
| 错误 enum 组织 | 每个 port 自建 error；或沿用统一 application error | 沿用 `ImageApplicationError`，不新增 port error enum | Step 7 已确定统一安全面；避免 provider/存储实现泄漏。 |
| 传输映射 | 在 domain 直接写 HTTP/RPC；或由 application/protocol mapper 映射 | 由 application → protocol surface 映射；transport code 未绑定 | domain 不应知道 route/status，且当前没有 transport authority。 |
| Query 失败 | 统一返回 generic error；或用既有 surface | 使用 `ImageQuerySurface` 的状态/内容矩阵 | 保留 Empty、Gap、Stale、Rebuilding、Unavailable 的可区分语义，同时维持 no-write。 |
| 未知外部结果 | 自动重试；或保守 unknown/reconciliation | 保持 `Unknown`，等待新 safe observation 或人工 reconciliation | ACK/cache/2xx 不能证明结果；盲重试可能重复外部副作用。 |
| 事务失败 | 部分提交后补写；或 commit 前整体 rollback | commit 前 all-or-nothing；commit unknown 走 idempotency audit | 避免半成品 truth、trace、result 与 reservation。 |
| 重复请求 | 重跑当前操作；或 stored replay | stored shell/body replay；缺失即 manual consistency defect | 原结果必须可再现，不能由 current truth 重算。 |
| projection failure | Query 即时修复；或返回 stale/unavailable | 只读 surface；rebuild 通过 bounded job，且 `PF-UNAVAILABLE-RECOVERY` 未闭合时不虚构恢复函数 | 保持 truth 与 projection 单向依赖。 |
| owner gap | 默认值/fake/ACK 解除；或 gap/unavailable/reopen | fail closed，按 affected lane 保留 gap | 兄弟项目和 Artifact 合同仍 pending，不能私造正向 readiness。 |

## 7. 结构化中间产物：错误层级与类型表

### 7.1 错误传播与转换边界

```text
[domain factory / guard / lifecycle member]
  | DomainError + SafeReason
  v
[application coordinator / port / UoW / replay]
  | ImageApplicationError
  v
[logical protocol facade]
  | Command: ImageCommandResult + ImageProtocolError
  | Query: ImageQuerySurface / ImageProtocolError
  | inbound: ImageInboundBoundaryResult
  | Job: ImageOperationsJobResult + ImageProtocolError
  v
[future transport wrapper only]
  | no route, status code, topic, envelope or receipt is defined here
```

关键说明：

- `domain` 不读取 repository、adapter、UoW、HTTP/RPC 或 transport；其失败只表达本仓 invariant、typed-ref、state、blocked condition 或 deterministic relation conflict。
- `application` 是唯一可以将 domain/port failure 转成 protocol-safe reason 的层；`infra` 只返回既有 `ImageApplicationError`，不得将 SQL、SDK、payload、secret、cache/private-map 细节透出。
- Command/Job 的 future mutation 和 replay branch 受 B01/B02 阻断；本图不表示已有成功写入、recovery worker 或运行中的 transport。
- Query/conditional inbound 不经过 write UoW；它们的无写异常路径不是 transaction rollback 的替代实现。

### 7.2 Domain error 类型表

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `DomainError::Validation(SafeReason)` | `domain` 各 factory / guard | 必填值、静态/ref-only边界、object invariant、reason/option 关系或 factory input 不合法 | 否；调用方必须修正输入或新建合法 context | Command/Job=`ContractViolation` 或 `Missing`；Query 不从非法 local relation补 body。 |
| `DomainError::WrongReferenceKind(SafeReason)` | `contracts` / `domain` typed-ref guard | local/external owner、kind、declared use 或 exact relation 不匹配 | 否；必须换成正确 typed ref | `ContractViolation`；不得 fallback 到近似 ref、string 或 scan。 |
| `DomainError::InvalidTransition(SafeReason)` | 各 lifecycle member / guard | Step 10 矩阵外的转换、terminal state 回退、未满足 transition 前置条件 | 否，就当前 state 而言；只有新 context/合法前置状态才可能重新请求 | `InvalidTransition`；对象和已提交历史不变。 |
| `DomainError::Blocked(SafeReason)` | domain guard / declared lane | 缺少、stale、unavailable、unknown、pending 或 owner contract 未闭合的必需条件 | 视 reason：`Unavailable` 可稍后 retry；`ContractPending` / `Gap` 必须等 owner closure；不能原样盲重试 | `ContractGap` 或 `Unavailable`，并仅冻结 affected lane。 |
| `DomainError::Conflict(SafeReason)` | deterministic set / relation guard | duplicate/inconsistent local association、immutable relation 或结论相互矛盾 | 否；需以新、无冲突 input/context 重试 | `Conflict`；不得 silently dedup、任选一个值或 last-write-wins。 |

### 7.3 Application / port / persistence error 类型表

`ImageApplicationError` 是所有 repository、projection、idempotency、UoW 和 external seam 的唯一公开 application 错误面。以下表记录 source 分类，不要求实现为新的 Rust variant。

| 错误类型 | 所属模块 / 典型来源 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `ImageApplicationError::Domain` | application coordinator | domain factory、guard 或 lifecycle member 返回 `DomainError` | 按内层 error 分类 | 见 §7.2；不得丢弃 `SafeReason`。 |
| `NotFound { subject_ref }` | typed repository exact read | 已明确要求存在的 committed local object、marker、result shell 或 relation target 不存在 | 通常否；若对象由另一个未来 commit 创建，调用方需重读后显式重试，不得猜补 | Command=`Missing`；Query 按 selector 可能 `Empty` 或 `Unavailable`；future Job item 可 non-positive。 |
| `VersionConflict { subject_ref, expected, observed }` | versioned repository / marker save | `ExpectedLocalObjectVersion::Exact` 与同一对象当前 committed version 不一致；或 create 的 `Absent` 撞唯一键 | 是，但必须 reload same object、重新跑 guard；具体 backoff/次数留 Step 13 | `Conflict`；rollback current UoW，不得覆盖/merge。 |
| `Unavailable { reason }` | local store、projection、slot、resolver、builder/registry、qualification/consumer boundary | 被调用 seam 暂不可安全读取/使用，或 owner/source 当前未可验证 | 仅 `SafeReasonCategory::Unavailable` 的临时依赖可 retry；`ContractPending`/gap 不属于即时 retry | `Unavailable` 或 `ContractGap`；不泄露 adapter/provider detail。 |
| `ContractViolation { reason }` | port boundary、mapper、UoW mode、page/ref/relation、fake parity | typed ref、operation/result kind、UoW、projection key、scope、adapter result 或 fake 行为违反已声明 contract | 否；需要修正 DTO、implementation 或重新开设计 | `ContractViolation`；不得通过 fallback/default/private map 绕过。 |
| `IdempotencyConflict { reason }` | idempotency reservation | same key 绑定不同 channel、operation 或 canonical input | 否；使用原请求或一个新 key | `IdempotencyConflict` + Command/Job `Conflict`；不得返回旧 result 或执行新 body。 |
| `StoredResultMissing { result_ref }` | replay repository | completed reservation 指向缺失 shell/replay body，或 body 无法正确取回 | 否；属于 consistency defect，需人工 repair/reconciliation | `ReplayUnavailable`；不能从 current truth、cache 或重新执行来合成旧结果。 |
| `TransactionBoundary { reason }` | `ImageUnitOfWorkManager` | begin/commit/rollback 失败、commit durable status 不可安全确定、同 UoW 边界失效 | begin failure 可 retry；commit unknown / rollback uncertain 禁止盲重试，需 idempotency audit/manual | `Unavailable` 或 `Unknown`；不能声称 commit 成功或已完全回滚。 |

### 7.4 External seam、entry 与 technical state 的来源映射

| source / state | 所属模块 | 可产生的既有 application/protocol 结果 | retry 分类 | 明确禁止 |
|---|---|---|---|---|
| `ImageReferenceResolution::{Blocked,Unavailable,Unknown}` | assembly reference resolver | `DomainError::Blocked` 或 `ImageApplicationError::Unavailable` → `ContractGap` / `Unavailable` / `Unknown` | only `Unavailable` may later retry; Blocked waits for refs/contract; Unknown requires new safe observation | 不加载 Role/mapping/component/seed/base body，不默认 `Concluded`。 |
| `BuildHandoffSubmission::{Blocked,Unavailable,Unknown}` / `BuildOutcomeResolution::{Blocked,Unavailable,Unknown}` | builder/registry seam | `Blocked` / `Unavailable` / `Unknown` command/job result，或 future local non-positive context | Unavailable may retry only through reopened bounded flow; Unknown is not retry | 不把 `Recorded`、ACK、2xx、tag/cache 变 candidate/digest/success。 |
| `QualificationBoundaryAssessment::{Blocked,Unavailable,Unknown,ReopenRequired}` | qualification seam | `ContractGap` / `Unavailable` / `Unknown` / `Blocked` | only temporary Unavailable may retry; ReopenRequired awaits owner contract | 不产生 `Passed`、`Eligible`、gate inventory、evidence body 或 Artifact truth。 |
| `ArtifactHandoffBoundaryAssessment::{Gap,Unavailable,ReopenRequired}` | Artifact boundary | local Pending/Gap future mapping，或 `ContractGap` / `Unavailable` | Gap/ReopenRequired wait for `MI-UP-007`; temporary Unavailable may retry later | 不产生 `Accepted`、Artifact version/lineage/ref mint 或 receipt。 |
| `MemberServiceSupplyAssessment::{Gap,Unavailable,ReopenRequired}` | Member Service seam | local `ConsumerHandoffGap` future mapping，或 `ContractGap` / `Unavailable` | Gap/ReopenRequired wait for `MI-UP-001`; Unavailable may retry later | 不产生 manifest、confirmation、instance、host/container/launch/health 或 `Resolved`。 |
| `ConditionalInboundBoundaryAssessment::{Unavailable,Rejected,ReopenRequired}` | entry boundary | `ImageInboundBoundaryResult` with `accepted_input=false` | no transport retry semantics exists; ReopenRequired awaits `MI-UP-005` | 不解析/保存 envelope/payload，不生成 receipt/dedup/quarantine。 |
| `ImageJobActionAvailability::{Blocked,ReopenRequired}` | bounded job entry | non-persisted Job `Blocked`/safe error before selection | Blocked depends on reason; ReopenRequired is design reopen, not retry | 不读取 page、不创建 scheduler/run/report/evidence；`Declared` 仍在 B01 停止。 |
| `ProjectionFreshnessLifecycle::Unavailable` | projection maintenance | Query `Unavailable`; future bounded rebuild non-positive result | recovery function not yet defined: no automatic retry transition | 不造 `Unavailable -> Rebuilding/Fresh` 路径；`PF-UNAVAILABLE-RECOVERY` remains open. |
| `AvailabilityTransitionLifecycle` existing transition update | supply persistence | `ContractViolation` / `InvalidTransition` / manual blocker | not retryable while `DDD-S11-B03` is open | 不 delete/reinsert、silent overwrite 或用 entry 状态伪代 history terminalization。 |

### 7.5 Protocol error / outcome 类型表

| protocol type | 触发来源 | retry / recovery class | caller 处理上限 |
|---|---|---|---|
| `ImageProtocolErrorKind::Missing` | required local object/field/ref absent，且无安全默认 | non-retryable same input；待 object/field合法出现后发起新的合法调用 | 修正 selector/input；不得从 history、cache、route 或 sibling draft 猜补。 |
| `Conflict` | domain relation conflict、optimistic version conflict、unique conflict | version conflict may retry after reload; deterministic conflict requires corrected input | 停止 mutation；不 last-write-wins。 |
| `Unavailable` | local store/source/projection/slot/owner temporarily unavailable | retryable only after same dependency is restored; exact policy deferred to Step 13 | 保持 safe error/no-write 或 future rollback；不得把 unavailable 映射 success。 |
| `Unknown` | external effect / safe conclusion / commit status cannot be determined | no blind retry; inspect idempotency/local state or await new safe observation | 不能声明 accepted/rejected success，不能重新运行 side effect。 |
| `ContractGap` | owner schema/authority/ref/confirmation pending，或 lane-scoped gap | non-retryable until owner contract closes; reopen affected Step/flow | 冻结 exact lane；不升格为 global readiness 或 default value。 |
| `InvalidTransition` | Step 10 lifecycle matrix rejects requested state move | non-retryable in current state | 不修改 object/history；新 context 必须走正式 flow。 |
| `IdempotencyConflict` | same key, different canonical operation/input | non-retryable same key | 使用原 request 或新 key；不返回不匹配 replay。 |
| `ReplayUnavailable` | stored shell/body missing/mismatched | manual consistency repair | 不重算 response、不重跑 command/job/adapter/page scan。 |
| `ContractViolation` | DTO/mapper/ref/UoW/page/adapter/fake contract breach | non-retryable until caller/implementation/design corrected | fail closed；不得 fallback。 |
| `ImageCommandOutcomeKind::Accepted` | only a future UoW commit with all required local writes | not a recovery error; current B01/B02 forbids reaching it | 不表示 external build/publish/Artifact/consumer/runtime success。 |
| `Rejected` / `Blocked` / `Unavailable` / `Unknown` / `Conflict` | mapped protocol/application/domain condition | see matching error kind | `result_ref`/stored body only if future replay path is legally closed; current B01/B02 do not fabricate one。 |
| `ImageQuerySurfaceStatus::{Empty,Gap,Stale,Rebuilding,Unavailable}` | existing read path / marker / relation | `Stale`/`Rebuilding`/`Unavailable` can be re-read later; Gap waits owner/recovery contract | no body where matrix requires `None`; query never writes recovery. |
| `ImageJobOutcomeKind::{NoOp,Blocked,Unavailable,Unknown,Conflict,DuplicateReplay}` | bounded selected scope or entry boundary | `NoOp` is not external pass; see matching reason | no run/report/evidence/scheduler state; current Declared path still stops B01/B02. |

## 8. 错误映射表

### 8.1 `DomainError` → `ImageApplicationError` → protocol mapping

| 内部错误 | HTTP / RPC / Event 映射 | 调用方应如何处理 |
|---|---|---|
| `DomainError::Validation` | `ImageProtocolErrorKind::Missing`（确为必填字段/关联缺失）或 `ContractViolation`（shape/invariant违反） | 修正请求；不启动 UoW 或在 future UoW 内 rollback；不补默认值。 |
| `DomainError::WrongReferenceKind` | `ContractViolation` | 更换 exact typed ref；禁止把 generic/string/route 作为替代。 |
| `DomainError::InvalidTransition` | `InvalidTransition`；Command/Job 不接受，Query 仅读取现有状态 | 不改 object；通过合法状态或新 context 再操作。 |
| `DomainError::Blocked` + `SafeReasonCategory::{ContractPending,Missing,Stale}` | `ContractGap`（有 owner/lane gap）或 `Missing`（单纯 local requirement缺失） | 等待 owner closure/新的合法 context；不要无限 retry。 |
| `DomainError::Blocked` + `SafeReasonCategory::Unavailable` | `Unavailable` | 可在依赖恢复后按 future retry policy重试；当前不造 fallback。 |
| `DomainError::Blocked` + `SafeReasonCategory::Unknown` | `Unknown` | 不盲重试外部副作用；等待新 safe observation 或进入 manual/reconciliation。 |
| `DomainError::Conflict` | `Conflict` | 解决关联/输入冲突，或 reload 后重新评估；不静默消重。 |

### 8.2 `ImageApplicationError` → public surface mapping

| 内部错误 | Command 映射 | Query 映射 | 条件入站映射 | Job 映射 | 调用方应如何处理 |
|---|---|---|---|---|---|
| `Domain(Validation/WrongReferenceKind)` | `Rejected` + `Missing`/`ContractViolation` | 关系损坏=`Gap`/`Unavailable`；不将错误 relation 伪成 Empty | `ContractViolation`；仍 `accepted_input=false` | `Blocked`/`Conflict` + safe error；无当前持久化 disposition | 修正 input/ref；不得 fallback。 |
| `Domain(InvalidTransition)` | `Rejected` + `InvalidTransition` | N/A；Query 不发起 transition | marker state不变，若 boundary mismatch则 `ContractViolation` | `Conflict`/`Blocked` + `InvalidTransition` | 维持现状；新操作必须满足矩阵。 |
| `Domain(Blocked)` | `Blocked` + `ContractGap` 或 `Unavailable` | `Gap` / `Unavailable` surface；按 content-state清空或 partial | `Unavailable`/`ReopenRequired` marker disposition | `Blocked` 或 `Unavailable` before/after legal future selection | 等 contract/source recovery；仅 affected lane冻结。 |
| `Domain(Conflict)` / `VersionConflict` | `Conflict` + `Conflict` | local relation conflict=`Gap`/`Unavailable`，不能任取一方 | no mutation；marker inconsistency=`ContractViolation` | `Conflict`；future reload/re-evaluate before retry | version case reload same object；其余修正输入。 |
| `NotFound` | `Rejected` + `Missing` | only explicit readable scope may return `Empty`; otherwise `Unavailable`/`Gap` | composition marker absent=`Unavailable` + `ContractGap` | non-positive item / `Blocked`，不扫描替代对象 | 不猜补 object；明确 scope 后重试。 |
| `Unavailable` | `Unavailable` + safe error | `Unavailable` with no body/items | `Unavailable` marker disposition | `Unavailable` before selection or for exact future item | 依赖恢复后可按 future policy retry；不泄露底层细节。 |
| `ContractViolation` | `Rejected` + `ContractViolation` | `Unavailable`/`Gap` where view relation cannot合法映射 | `ContractViolation` with no payload persistence | `Conflict`/`Blocked` + `ContractViolation` | 修正 DTO/mapper/port/config/design；不绕过。 |
| `IdempotencyConflict` | `Conflict` + `IdempotencyConflict` | Query never sees idempotency | no idempotency surface exists | `Conflict` + `IdempotencyConflict` | 使用原 request 或新 key；不重跑不同 input。 |
| `StoredResultMissing` | `Unavailable`/`Unknown` + `ReplayUnavailable` | Query does not synthesize replay | no replay exists | `Unavailable`/`Unknown` + `ReplayUnavailable` | manual repair；不得重算/重跑。 |
| `TransactionBoundary` | `Unavailable`，commit status unknown时也可 `Unknown` | Query only returns read failure `Unavailable`，不 rollback/repair | boundary inspection cannot open UoW | `Unavailable`/`Unknown`；不声明 result persisted | begin failure可稍后 retry；commit/rollback uncertain 先 idempotency audit。 |

### 8.3 Query surface 是错误映射而非 generic failure

| Query condition | `ImageQuerySurface` 固定写法 | 是否可重试 | 禁止事项 |
|---|---|---|---|
| exact local item absence in a confirmed readable scope | `Visible + Empty + content_state=None` | 调用方可在新的合法对象提交后重新读取 | 不把 Empty 解释为全局不存在、owner contract 已关闭或 object 可自动创建。 |
| local relation / view-marker relation断裂 | `Visible + Gap`，仅在该 Query 明确许可时 `Partial` | 通常 manual/rebuild/relation repair；不由 caller retry掩盖 | 不拼 view ref、watermark 或缺失 child；不把 partial 标 complete。 |
| existing projection stale | `Visible + Stale + Complete`，仅返回既有允许 body/marker | 可稍后 re-read 或 future bounded rebuild | 不 Query-time rebuild/mark fresh；不把 stale 当 Fresh。 |
| existing projection rebuilding | `Visible + Rebuilding + None`，仅 `InspectMarker` 允许时返回 marker | 可 later re-read；不等待 job | 不创建 marker、阻塞等待、把 old view直接当 fresh。 |
| projection/source/store不可用 | `Unavailable + content_state=None`，body=None/items=[] | store/source恢复后 re-read；`Unavailable` lifecycle恢复仍受 PF blocker | 不从 cache/fake/old view补 source，不写 repair。 |
| owner visibility/scope 未正式可判定 | `ImageQueryVisibility::Unavailable` + no body | 等 owner authority，不是 ordinary retry | 不伪造 `NotVisible`、Visible 或 Empty。 |
| `RequireFresh` 但无现有 Fresh companion | `Unavailable + content_state=None` | existing marker later Fresh 后重读 | 不降级 direct truth/history，不创建/rebuild projection。 |

## 9. 异常分支处理表

### 9.1 Command：所有十条写类 logical surface 的共同分支

本表覆盖 `DefineImageVariant`、`CaptureAssemblyBaseline`、`ProposeVariantRevision`、`RequestBuildIntent`、`RecordBuildOutcome`、`EvaluateCandidateEligibility`、`RecordArtifactHandoff`、`PublishInstantiableEntry`、`TransitionAvailability` 和 `RollbackOrRetireEntry`。各命令的对象、selector、future guard 和当前停止点仍以 Step 9 的独立 flow 为准；本表不把它们合并为一个通用业务行为。

| 场景 | 检测位置 | 处理方式 | 是否写本仓 trace / history / event |
|---|---|---|---|
| request body、actor、metadata、typed ref、action/Option 形状不合法 | API logical entry、protocol mapper、`ImageOperationContext::from_write` 之前 | 返回 `Rejected + Missing/ContractViolation`；当前与 future 都不进入 domain mutation | 否；无 stored result、UoW、reservation、trace、history、gap、freshness 或 outbound。 |
| `DDD-S9-B01`：缺 concrete canonical carrier/mapper | context 构造后、canonicalize 之前 | 返回未持久化 fail-closed protocol error；当前停止 | 否；B01 不是 `ContractGap`/trace/result/marker，不得为它创建任何 local record。 |
| `DDD-S9-B02`：缺 result identity/shell-body mapper | B01 解除后、任何 mutation 之前 | 停止 future write path；必须先重开 Step 6~8 定义合法 result ref | 否；不得先 begin/save 再“以后补 result”，不得随机构造 ref。 |
| canonicalizer / `begin(ReadWrite)` 不可用 | future reopened write path的 canonicalize/begin | 映射 `Unavailable`；无 UoW 或 rollback 已开始 UoW | 否；不得 reserve、external call、domain factory 或 repository save。 |
| reserve same key + different canonical input | future idempotency reservation | 映射 `Conflict + IdempotencyConflict`；停止，本次不执行 domain/external action | 否新增；不覆盖 reservation、不返回不匹配旧 body。 |
| reserve returns duplicate | future idempotency reservation | rollback current UoW，再 exact-read stored shell/body；成功则 `DuplicateReplay` | 否新增；不得重跑 domain、adapter、page selection、trace 或 projection rebuild。 |
| duplicate shell/body missing、kind/name 不匹配 | replay read | `ReplayUnavailable`，归入 manual consistency defect | 否；不得从 current truth 或 response mapper重建旧 body。 |
| exact local object absent | future typed repository read | Command=`Rejected + Missing`，或由 explicit local gap 返回 `Blocked`；不得扫描相似对象 | 否 accepted trace/history；若 future protocol 已合法允许 post-reserve negative disposition，只可按同 UoW 保存该安全 body，当前 B01/B02 下仍为零写。 |
| local relation/immutable input/typed ref/domain guard拒绝 | domain factory / guard | `Rejected + ContractViolation`、`InvalidTransition` 或 `Conflict`；若已 begin则 rollback，除非 future closed protocol明确允许记录 negative replay body | 不写 success trace/history/freshness；不生成 positive state。 |
| required external static source/owner contract blocked | resolver / qualification / consumer boundary guard | `Blocked + ContractGap`，仅冻结 declared lane | 不写 positive baseline/revision/candidate/eligibility/entry/Artifact/consumer confirmation；future合法 gap写入也须 B01/B02 和 flow ownership。 |
| external seam temporarily unavailable | resolver/builder/qualification/consumer seam | `Unavailable`；若调用尚未发生可在 dependency恢复后重试；若 effect已可能发生则转 `Unknown` / manual review | 不把 adapter slot、ACK、cache、tag、2xx 写成 success。 |
| external seam gives `Unknown` | builder/source/qualification boundary | `Unknown`；不盲重试同一外部 side effect，等待新的 safe observation 或人工判断 | 无 success trace/history；不将 Unknown silently downgrade to Blocked/Accepted。 |
| optimistic version/unique conflict | save/append/versioned relation write | rollback entire staged UoW，映射 `Conflict`；future retry先 exact reload、重跑 guard | 否 commit；不 last-write-wins、不 merge history。 |
| required local truth/trace/gap/freshness/result/complete write失败 | repository / idempotency port | rollback entire staged UoW，`Unavailable` 或 `TransactionBoundary`；若 prior external effect可能发生，不可盲重试 | 无 committed local success effect；不事后“补写”缺失 trace/result。 |
| `commit` durable status unknown | `ImageUnitOfWorkManager::commit` | 返回 `Unavailable`（safe reason 可指向 unknown completion）；后续以同 key 检查 reservation/result，不得新 key重试 | 不写 compensating truth、trace、gap、history、event；不宣称 rollback/success。 |
| `rollback` 失败或结果不确定 | `ImageUnitOfWorkManager::rollback` | 返回 `TransactionBoundary`，进入 manual consistency diagnosis | 不假定 staged values不可见；不重新发同一 external action。 |

当前实现可达性必须单独解释：上表中标记“future reopened”的分支仅在 B01/B02、该 protocol mapper 与相应 owner contract 全部重新闭合后才可实现。当前十个 Command 的唯一允许上限仍是 validation/context 后的无写 fail-closed 结果；它们没有真实 reservation、stored negative disposition、trace、gap、freshness、build、digest、Artifact、consumer 或发布事实。

### 9.2 Command 家族的特定异常上限

| Command 家族 | 特定异常 | 正确映射 / 恢复 | 禁止事项 |
|---|---|---|---|
| DefinitionAssembly：`DefineImageVariant`、`CaptureAssemblyBaseline`、`ProposeVariantRevision` | mapping/component/seed/base ref 缺失、stale、body-free inspection未闭合 | `Blocked + ContractGap` 或 `Unavailable`；等 `MI-UP-002/003/006` 的 formal ref/compatibility 关闭后新 context重开 | 不加载外部正文，不将 policy/memory/workspace template 变 live state，不用默认 pin/seed/base。 |
| BuildCandidate：`RequestBuildIntent`、`RecordBuildOutcome` | build handoff/result不可确定、attempt relation冲突、safe observation缺 immutable image/output identity | `Unavailable`/`Unknown`/`Conflict`；Unknown 等新 safe observation，不能重试/新建第二 attempt | 不从 ACK、tag、registry cache、真实或猜测 digest 形成 candidate。 |
| Qualification：`EvaluateCandidateEligibility`、`RecordArtifactHandoff` | gate/evidence owner未闭合、Artifact handoff ref/acceptance缺失 | `Blocked + ContractGap` 或 `Unavailable`；保留 Pending/Gap future local lane | 不默认 gate pass/eligible，不 mint Artifact ref/lineage，不写 `Accepted`。 |
| SupplyEntry：`PublishInstantiableEntry`、`TransitionAvailability`、`RollbackOrRetireEntry` | local eligibility/entry/current facts不足；action/ref pairing非法；既有 transition需要 supersede/terminal update | `Blocked`/`InvalidTransition`/`Conflict`；`DDD-S11-B03` 必须 manual/reopen Step 7/10 | 不把 `Available` 当 consumer/container success；不 delete/reinsert/overwrite availability history。 |

### 9.3 Query：十条只读 surface 的异常分支

本表覆盖 `GetImageVariantDefinition`、`GetAssemblyDerivation`、`GetBuildTrace`、`GetProvenanceAndEligibility`、`ResolveInstantiableEntry`、`ListAvailableVariants`、`GetAvailabilityHistory`、`GetImageTrace`、`GetContractGaps` 和 `GetProjectionFreshness`。

| 场景 | 检测位置 | 处理方式 | 是否写本仓 trace / history / event |
|---|---|---|---|
| query name、selector、typed ref、page cursor/limit、projection key 不合法 | query handler / mapper | `ImageProtocolError::ContractViolation`；不调用其它 selector/read port作为 fallback | 否；no UoW/reserve/replay/trace/gap/freshness/view write。 |
| exact item不存在且 local readable scope已确认 | exact read / bounded list | 按协议返回 `Visible + Empty + None`；只代表该 scope内 absence | 否；不得创建 object/view/marker，不能写成 global absence。 |
| scope/visibility authority自身不可确认 | query reachability guard | `ImageQueryVisibility::Unavailable`，body/items empty | 否；不得伪造 Visible、NotVisible 或 Empty。 |
| required local relation断裂、source subject缺失或 view-marker relation不一致 | read relation mapper | `Gap`，只有指定 Query 可 `Partial`；否则 no body | 否；不通过 current truth、cursor、watermark 或 string 拼 missing relation。 |
| existing projection is `Stale` | freshness read | 返回既有 `Stale` surface与允许的 body；caller 可稍后重读 | 否；不得 mark fresh、refresh source 或 invoke rebuild。 |
| existing projection is `Rebuilding` | freshness read | 返回 `Rebuilding + None`，仅在协议许可的 marker inspect路径暴露 marker | 否；不等待 job、不造 result。 |
| projection/store/source unavailable | read port / freshness marker | `Unavailable + None`；保留已提交 truth不变 | 否；不得读 cache/fake/private map补 body，不在 query修复。 |
| `RequireFresh` 无 matching existing Fresh marker | preference gate | `Unavailable + None` | 否；不得降级 direct truth/history、mint view ref或启动 rebuild。 |
| availability/trace page为空 | exact bounded history list | 仅明确 scope下可 `Empty`；空页不等 entry available、transition pass、consumer confirmation 或 global readiness | 否；不得创建 trace/history/entry。 |
| unknown build / gap / consumer pending 可安全读取 | view mapper | 保留显式 `Unknown` state、gap ref 或 partial body，遵守每 Query content matrix | 否；不得隐藏 unknown、关闭 gap、重新 inspect external seam。 |

### 9.4 条件入站：marker-only fail-closed 分支

| 场景 | 检测位置 | 处理方式 | 是否写本仓 trace / history / event |
|---|---|---|---|
| caller 提供 envelope、payload、event id/source、offset、receipt、dedup、correlation 等输入 | `ConsumeVerifiedBuildRequest` / `ConsumeVerifiedSourceRefresh` entry shape | `ContractViolation`；不解析、不缓存、不转 Command | 否；无 receipt、dedup、quarantine、snapshot、gap、trace、UoW 或 truth write。 |
| composition 缺少 named marker | worker composition / marker lookup | `Unavailable + ContractGap`；不 mint default marker | 否；不从 broker/adapter status猜 marker。 |
| marker name 与 selected consumer不匹配 | entry boundary mapper | `ContractViolation`；不交叉使用另一个 marker | 否；不写 any state。 |
| marker=`Unavailable` | `inspect_inbound_boundary` | 返回 disposition，`accepted_input=false` | 否；不创 BuildIntent/ExternalReferenceSnapshot。 |
| marker=`Rejected` | `inspect_inbound_boundary` | 返回 disposition，`accepted_input=false` | 否；它不是 rejected transport receipt，不存 payload或 replay。 |
| marker=`ReopenRequired` | `inspect_inbound_boundary` | 返回 disposition，`accepted_input=false`；等待 `MI-UP-005` 正式关闭后重开 Step 7~9 | 否；不将 reopen 写作 received/accepted input。 |
| boundary port unavailable | entry boundary call | `Unavailable`；无 broker fallback | 否；无 retry/delay/dead-letter 语义，因为当前没有 transport contract。 |

### 9.5 Operations Job：六条 bounded action 的异常分支

本表覆盖 `RunNightlyBuildSweep`、`ReconcileBuildAttempts`、`ReevaluatePendingQualifications`、`RefreshExternalReferenceSnapshots`、`RebuildImageDerivedViews` 和 `ReconcileArtifactAndConsumerHandoffs`。Job result 是 bounded local disposition，不是 scheduler run、report、counter、evidence、verdict 或 signoff。

| 场景 | 检测位置 | 处理方式 | 是否写本仓 trace / history / event |
|---|---|---|---|
| non-System actor、metadata缺失、scope/page/target不合法 | job handler input validation | `ContractViolation`；停止于 boundary 前 | 否；无 scheduler/run/report、UoW、reserve、page read。 |
| action boundary=`Blocked` / `ReopenRequired` | `ImageEntryBoundaryPort::inspect_job_action_boundary` | 返回 non-persisted `Blocked` + safe error；不选 page/target | 否；不得把 reopen 作为 retry/执行。 |
| action boundary port unavailable | entry boundary call | non-persisted `Unavailable`；不选 page/target | 否；不从 config/fake/private state猜 action availability。 |
| action boundary=`Declared` but B01/B02仍未关闭 | boundary后 | 当前停在 B01/B02；返回无写 fail-closed error | 否；不得 selection、adapter call、result/disposition save、run/report。 |
| future exact page/target为空 | legal future bounded read | `NoOp` 只表示本仓 selected scope无动作 | 不代表 build/gate/Artifact/consumer success；是否保存 replay body须先有 B02合法路径。 |
| future selected item version/relation conflict | exact read/guard/save | `Conflict` 或 `Blocked`；rollback该 UoW，重试前 reload exact local subject | 不覆盖对象，不扩大 page/scan。 |
| future builder/source/qualification/consumer seam unavailable | declared local facade | `Unavailable`；仅 temporary availability 可在 future policy下重试 | 不把 slot/ACK/cache当成功；不生成 report。 |
| future external observation unknown | builder/source/qualification seam | `Unknown`；不对同一 side effect blind retry | 不建立第二 attempt、不把 unknown变 passed/available。 |
| future external adapter returns positive Artifact acceptance / consumer confirmation while pending | adapter result validation | `ContractViolation`；拒绝该结果并保留 current gap/open lane | 不 save `Accepted`/`Resolved`、Artifact ref/confirmation。 |
| future projection rebuild缺 committed truth、view/marker relation或版本不匹配 | projection rebuild flow | `Unavailable` / `ContractViolation` / `Conflict`；source truth不回滚；已有 marker仅按已定义 transition可 stale/unavailable | 不以 view/cache补 truth；不造 `Unavailable` recovery；不 query-time repair。 |
| future duplicate same canonical job | idempotency replay | `DuplicateReplay`，只读 stored `JobDisposition` body | 否新增；不重选 page、不重调 adapter、不重 rebuild。 |

### 9.6 本 Step 的审计 / local marker 写入规则

本表的“可写”只指已有本仓 local object，且仅在 future/reopen write path 同时具备 B01/B02、对象 factory、result replay、UoW 与相关 owner contract 时才适用；它不代表现在有任何写入实现。

| 分支 | `ImageTraceRecord` / availability history | gap / freshness | stored result / replay | outbound event / receipt / report |
|---|---|---|---|---|
| 当前 Command/Job B01/B02 stop | 不可写 | 不可写 | 不可写 | 严格为零。 |
| pre-reserve validation / canonicalization / begin rejection | 不可写 | 不可写 | 不可写 | 严格为零。 |
| future accepted local mutation | 只按该 Step 9 flow inventory写 required local trace/history；history仍 append-only | 仅保存该 flow拥有的 gap，或更新 existing affected freshness | save shell/body → complete → commit；仅在合法 identity已闭合时 | `NoneAuthorized`；没有 outbound/receipt/report。 |
| future post-reserve rejected/blocked且协议明确允许 negative disposition | 不写 success trace/history | 不以 rejection为由修 projection；仅有 flow明示且合法的 local gap可写 | 可保存 body-free negative result并 complete；否则 rollback | `NoneAuthorized`；不生成 event。 |
| duplicate replay / idempotency conflict | 不新增 | 不新增 | duplicate仅读；conflict不覆盖旧 record | 严格为零。 |
| Query 任一分支 | 不可写 | 不可写 | 不可写 | 严格为零。 |
| 条件入站任一分支 | 不可写 | 不可写 | 不可写 | 严格为零；marker disposition不是 receipt。 |
| projection rebuild failure | 不写业务 trace/history | source truth不变；仅 existing marker且已有合法 transition时可 future标 stale/unavailable | future bounded disposition仅在 B02闭合时可存；当前不可写 | 没有 report/event。 |
| UoW commit/rollback unknown | 不做补偿写 | 不做猜测性 marker写 | 不生成伪 replay；先检查已提交 reservation/result | 严格为零。 |

## 10. 恢复口径表

### 10.1 恢复分类总则

| 分类 | 判定条件 | 允许动作 | 禁止动作 |
|---|---|---|---|
| `retryable` | 同一输入、同一依赖在短暂不可用后可再次安全读取，且没有未知外部副作用 | 依赖恢复后按同一 operation/key 重试；具体退避、次数和并发窗口留 Step 13 | 换 key 绕过幂等、扩大 scope、重复发起未知 side effect。 |
| `reload_then_retry` | 本地 optimistic version 冲突，或同一对象在重试前可能已被合法更新 | 重新读取**同一对象** `Versioned<T>`，重新执行 guard，再用 `Exact(loaded.version)` 保存 | last-write-wins、无界自动重试、用 cursor/timestamp/external revision 代 version。 |
| `non_retryable` | 输入、typed ref、schema、状态矩阵或幂等 key 本身不合法 | 修正调用方输入或创建新的合法业务 context | 原样重复提交、默认补值、fallback 到相近 selector。 |
| `owner_blocked` | owner contract、authority、Artifact/consumer confirmation 或 event schema 尚未闭合 | 保留/读取 affected-lane gap 或 marker；owner 正式闭合后重开对应 Step/flow | 用 config、fake、ACK、projection、local availability 解除 gap。 |
| `manual_consistency` | 已提交记录与 sidecar/result/view 断裂，或 commit/rollback 结果不可判定 | 暂停受影响 lane，执行人工核查或正式 repair/reconciliation 设计 | 从 current truth 重算历史结果、删除历史、盲目补写或盲重试。 |
| `unknown` | 外部副作用、safe conclusion 或 UoW commit status 不能安全判定 | 保留 `Unknown` surface，先做 idempotency/local-state audit 或等待新的 safe observation | 将 unknown 降级为 failed/success，重复调用可能产生第二个副作用。 |

### 10.2 场景恢复表

| 场景 | 分类 | 恢复方式 | 必须保留 | 禁止事项 |
|---|---|---|---|---|
| local repository / projection store 暂时不可用 | `retryable` | 依赖恢复后重试相同 read/write；若已 begin UoW，先按结果明确 rollback | 已提交旧 truth；未提交 staged write不得对外可见 | 读 cache/fake/private map代替 store；部分提交。 |
| `VersionConflict` | `reload_then_retry` | rollback 当前 UoW；exact reload 同一 object；重新校验状态/关系后再提交 | 冲突对象的 observed version 与安全 reason | 覆盖更新、选择较新/较旧任意值、扩大到全量扫描。 |
| create 遇唯一键冲突 | `non_retryable` 或合法 duplicate replay | 判断是否为同一 canonical operation；是则只读 stored replay，否则换合法业务 identity/context | 原有对象及 reservation | upsert、静默合并、把 unique conflict当 Accepted。 |
| resolver / source temporary unavailable | `retryable` | future bounded flow 在依赖恢复后按 declared use 重读/重试 | 原 snapshot validity、local gap 或 unavailable reason | 伪造 `Valid`、从字符串/缓存推 source body。 |
| resolver / builder / qualification / consumer 返回 `Unknown` | `unknown` | 不自动再次发起可能有副作用的调用；等待新安全观察或人工 reconciliation | attempt/qualification/gap 的 existing history | 新建第二 attempt、把 ACK/2xx/cache当 outcome。 |
| owner schema / authority pending | `owner_blocked` | affected lane 保持 `ContractGap`、`ConsumerHandoffGap` 或 `ReopenRequired`；owner closure后重开 | owner、seam、lane、safe reason | 从兄弟 draft、配置或假数据得到 `Resolved`/`Accepted`。 |
| UoW `begin` 失败 | `retryable`（若 reason 为 local unavailable） | 不执行 reservation/domain/adapter；依赖恢复后重新开始完整 flow | 无 staged effect；原请求 context可重新验证 | 直接调用 repository、继续半初始化 UoW。 |
| UoW `commit` 明确失败且确认未写入 | `retryable` 或 `manual` 依 reason | 保守 rollback；若状态不确定则转 `unknown`，先查 idempotency/result | 已提交旧 truth；不假定新 truth存在 | 立刻用新 key重跑。 |
| UoW `commit` status unknown | `manual_consistency` + `unknown` | 停止；用同一 operation/key 查询 reservation 与 stored result，交人工/正式 reconciliation | unknown 状态及原 correlation/ref | 盲目 commit、rollback、补偿写或重发外部 side effect。 |
| UoW `rollback` 失败/不确定 | `manual_consistency` | 标记 transaction boundary defect，隔离该 UoW；后续只允许人工核查 | 原 UoW ref、失败 reason（脱敏） | 假定 staged values已消失、再次执行同一副作用。 |
| stored result shell/body 缺失或 kind/name mismatch | `manual_consistency` | 保留 reservation，不重算；修复 result store/replay relation 的正式方案需后续确认 | 原 result ref、operation/channel relation | 从 current truth 组装旧 response、重跑 command/job。 |
| duplicate same key + same canonical input | 非错误 replay | rollback 当前 read/write UoW，读取既有 shell/body并原样返回 | 原 stored effect/body | 重跑 domain、adapter、page scan、projection rebuild。 |
| duplicate same key + different canonical input | `non_retryable` | 返回 `Conflict + IdempotencyConflict`；调用方使用原请求或新的业务 key | 既有 reservation 不变 | 覆盖旧 key、返回旧结果、执行新 input。 |
| Query stale / rebuilding | `degraded_read` | 仅重读或由未来 bounded rebuild处理；Query 本身不写 | existing view、freshness marker、source truth | query-time mark fresh/rebuild/gap creation。 |
| Query projection unavailable / relation gap | `manual_consistency` 或 `owner_blocked` | 返回既有 `Unavailable`/`Gap` surface；按正式 repair/rebuild 方案处理 | source truth不变，gap/freshness marker（若已存在） | 用空 body伪装 Empty，或从 view反推 truth。 |
| conditional inbound marker unavailable/rejected/reopen | `owner_blocked` / `non_retryable` | 返回 marker-only result，`accepted_input=false`；待 MI-UP-005 后重开 | marker 的 safe reason/observed_at | 添加 envelope、receipt、dedup、delay、quarantine 或 BuildIntent 写入。 |
| bounded Job action boundary blocked/reopen | `owner_blocked` | 返回 non-persisted `Blocked`；不选择 page | boundary marker 与 affected action | 把 reopen 当 retry、创建 run/report/scheduler state。 |
| bounded Job selected item conflict | `reload_then_retry`（future only） | 停止该 item 或整个 UoW，reload exact subject；不扩大 page | item ref、safe reason | 跳过冲突 item后伪报 Completed、无界扩大 scope。 |
| `DDD-S11-B03` availability transition supersede gap | `manual_consistency` / reopen | 在 Step 7/10 重开后决定 versioned update 或纯 append-final-record 模型 | 既有 transition history | delete/reinsert、silent overwrite、用 entry state替代 history。 |
| `PF-UNAVAILABLE-RECOVERY` | `owner_blocked` / reopen | 保持 `ProjectionFreshness::Unavailable`；等待正式 recovery function、source、version/UoW 规则 | unavailable marker 与 reason | 直接构造 `Unavailable -> Rebuilding/Fresh`、把 old view标 Fresh。 |

### 10.3 恢复顺序（future/reopen 写路径）

下列顺序只描述已有 port 的组合约束，不引入新的函数或当前执行事实：

```text
detect safe error
  -> stop further domain / adapter side effects
  -> if a write UoW exists: rollback once
  -> map to existing protocol/query/job/inbound surface
  -> if commit status is unknown: inspect same-key reservation/result
  -> if replay/sidecar is missing: classify manual consistency defect
  -> retry only when the table explicitly permits it
```

关键说明：

- `rollback once` 不是保证底层已回滚；当 rollback 返回错误或未知时，必须进入 `TransactionBoundary` 人工路径。
- 任何 retry 都必须保持原 operation、canonical input、typed subject 和 declared scope；不能通过更换 key、扩大 page 或重建 ref 绕过保护。
- 外部调用已经可能发生而结果未知时，恢复动作优先是 observation/reconciliation，而不是再次 submit/inspect；本仓不拥有外部补偿语义。
- 本 Step 不定义 retry delay、attempt count、lease、dead-letter、scheduler、run/report 或告警阈值；这些若需要，必须由后续 Step/owner 正式定义。

## 11. 一致性缺陷目录与反例

### 11.1 consistency-defect catalog

以下项目不是普通业务拒绝，而是设计、adapter、存储或边界一致性缺陷。它们必须以 `ContractViolation`、`StoredResultMissing`、`TransactionBoundary` 或相应 safe `Unavailable/Unknown` 暴露，并进入人工/正式 repair 设计；不能通过普通 retry 隐藏。

| 缺陷 | 检测位置 | 必须响应 | 禁止恢复 |
|---|---|---|---|
| completed idempotency record 指向不存在 result shell | duplicate replay `get_stored_result` | 返回 `ReplayUnavailable`，保留 reservation relation，进入人工修复 | 以当前 truth 生成新 result。 |
| shell 存在但 replay body 缺失/operation 或 kind 不匹配 | `get_replay_body` / body mapper | `StoredResultMissing` 或 `ContractViolation`；停止 replay | 重跑原 command/job、接受不同 kind body。 |
| commit status unknown 且找不到 reservation/result | UoW commit 后 recovery audit | `Unknown + TransactionBoundary`，隔离 operation，人工核查 | 新 key 重试、补写 success trace。 |
| rollback unknown 后 query 仍能看到 staged truth | transaction/repository visibility check | 标记 UoW consistency defect，禁止继续使用该 adapter | 假设隔离有效并继续写。 |
| mutable save 接受非同对象 version | repository adapter/fake parity test | `ContractViolation`，修正 adapter | 用 cursor、watermark、timestamp、digest替代版本。 |
| append-only trace/availability history 被 update/delete | repository API or storage audit | `ContractViolation`，保留旧 history，设计新 context | 删除历史、原地 terminalize。 |
| relation index 指向不存在 view/marker/child | query/rebuild affected lookup | `Gap`/`Unavailable`，人工 rebuild/relation repair | 临时拼 ref、从 page/cursor 猜 target。 |
| projection source 不是 committed local truth | projection rebuild | `ContractViolation`，停止 rebuild | 用 cache、旧 view、fake private map 或 external body。 |
| `ProjectionFreshness::Unavailable` 被直接标 Fresh/Rebuilding | state transition guard | `InvalidTransition`/`Unavailable`，保持 blocker `PF-UNAVAILABLE-RECOVERY` | 新增未审计 recovery shortcut。 |
| external raw body、secret、live state 进入 local store/result | boundary validator/audit | `ContractViolation`，隔离并按 owner 处理 | 脱敏不完整时继续持久化。 |
| Artifact/consumer positive result 在 pending contract 下出现 | external result mapper | `ContractViolation`，保持 local Gap/Pending | 将 ACK/response 解释为 Accepted/Resolved。 |
| conditional inbound 出现 accepted input/receipt 但 MI-UP-005 未闭合 | worker boundary | `ContractViolation`，保持 marker-only | 解析 payload、写 receipt/dedup/BuildIntent。 |
| job result 被扩展为 run/report/evidence/verdict | job result mapper/schema audit | `ContractViolation`，退回 bounded disposition | 添加 run_id、count、schedule、report 或 signoff。 |
| local `Available` 被用作 runtime/member/container readiness | supply/query consumer handoff | `ContractViolation` / `Gap` | 改写为 global ready 或 consumer confirmed。 |
| `ImageOutboundEventInventory` 非 `NoneAuthorized` | protocol effect audit | 立即停审并重开 Step 5/7/8/9/11~13 | 偷渡 event/outbox/publisher 类型。 |

### 11.2 反例与正确规则

| 反例 | 为什么无效 | 正确规则 |
|---|---|---|
| 所有错误都返回 `Unavailable` | 丢失输入错误、状态错误、冲突和一致性缺陷的可操作性 | 使用既有 `Missing`、`Conflict`、`InvalidTransition`、`ContractGap`、`ReplayUnavailable`、`ContractViolation` 等精确类别。 |
| Query 查不到对象就创建 view/gap 或刷新 source | 违反 no-write，改变读取结果 | 只在明确 readable scope 返回 `Empty`，否则 `Unavailable`/`Gap`。 |
| version conflict 自动 save 再试 | 可能覆盖合法新状态或重复副作用 | reload 同对象 version，重新跑 guard；策略交给 Step 13。 |
| duplicate 通过 current truth 重建 response | 当前 truth 可能已变化，不再是原事务结果 | 只读取 stored shell/body；缺失即 manual defect。 |
| unknown external outcome 当失败并立即重试 | 可能产生第二次构建/发布/交接 | 保持 `Unknown`，等待新的 safe observation/reconciliation。 |
| owner gap 用 fake/config/ACK 关闭 | 把 pending 输入伪装成正向 authority | 只允许 owner formal resolution ref，且重开受影响 Steps。 |
| rollback 失败后假设全部撤销 | 可能留下不可见半成品 | 进入 `TransactionBoundary` manual path，禁止继续副作用。 |
| 用 `latest`、tag、digest、watermark、page cursor当版本或 identity | 混淆不同语义并破坏幂等/并发 | identity/version/page/watermark 各自使用既有 typed carrier。 |
| 把 local trace/history/result 当 event receipt | 伪造 transport 或 delivery 事实 | 本仓 outbound inventory 为零；只保留 declared local records。 |

## 12. Step 6~11 跨文档闭环审计

### 12.1 对象 → port → protocol → flow → state → persistence → error

| 对象 / 状态族 | Step 7 port / repository | Step 8 surface | Step 9 flow | Step 10 / 11 约束 | Step 12 错误与恢复结论 |
|---|---|---|---|---|---|
| DefinitionAssembly：family、variant、baseline、revision、mapping snapshot | `DefinitionAssemblyRepositoryPort` + `ImageAssemblyReferenceResolverPort` | 3 个 Definition Command、2 个 definition/derivation Query | Define/Capture/Propose | typed ref、immutable baseline、同 UoW relation、owner ref pending | missing/wrong ref=`Missing`/`ContractViolation`；owner blocked=`ContractGap`；version conflict reload；不得补 body。 |
| BuildCandidate：intent、input snapshot、attempt、outcome、candidate | `BuildCandidateRepositoryPort` + `BuilderRegistryPort` | Request/Record Command、BuildTrace Query、2 个 Job | Request/Record/Reconcile | safe observation 不等 candidate；unknown 不盲 retry；candidate relation exact | unavailable=`Unavailable`；unknown=`Unknown`；relation/version=`Conflict`；不得用 ACK/tag/cache/digest。 |
| Qualification：provenance、gate evaluation、eligibility、Artifact handoff | `QualificationRepositoryPort` + `QualificationBoundaryPort` | Evaluate/Record Artifact Command、qualification Query、2 个 Job | Evaluate/Record/Reevaluate/Reconcile | gate/evidence body 外置；Artifact 仅 Pending/Gap；Q-MI-004/MI-UP-007 pending | owner gap=`ContractGap`；positive result under pending=`ContractViolation`；不默认 Passed/Eligible/Accepted。 |
| SupplyEntry：transition、entry、consumer gap | `SupplyEntryRepositoryPort` + `MemberServiceSupplyPort` | Publish/Transition/Rollback Command、entry/history Query、handoff Job | Publish/Transition/Rollback/Reconcile | transition append-only；entry local Available 不等 consumer/runtime；B03 open | illegal action=`InvalidTransition`；consumer pending=`ContractGap`；B03=`manual_consistency`；不 delete/reinsert。 |
| ReferenceDerived：external snapshot、ContractGap、trace、freshness、read model | `ReferenceDerivedRepositoryPort` + projection ports | trace/gap/freshness Query、source/projection Job | Refresh/Rebuild/Query | source/use exact；trace append-only；projection only committed truth；PF blocker | stale/unavailable=`Unavailable`/`Gap`；relation corruption=`manual_consistency`；Unavailable recovery不虚构。 |
| application replay：idempotency record、stored result | `ImageIdempotencyRepositoryPort` + `ImageUnitOfWorkManager` | all future Command/Job result/replay fields | all future write flows | reserve→result→complete→commit；B01/B02 当前不可达 | same input=`DuplicateReplay`；different input=`IdempotencyConflict`；missing body=`ReplayUnavailable`；commit unknown=`Unknown` + manual。 |
| conditional inbound marker | `ImageEntryBoundaryPort` | `ImageInboundBoundaryResult` | 2 marker-only flows | `accepted_input=false`；无 envelope/receipt/dedup/UoW | marker unavailable/reopen=`Unavailable`/`ContractGap`；附带 payload=`ContractViolation`；无写。 |

### 12.2 错误、状态与持久化闭环检查

| 审计项 | 结论 | 证据 / 未关闭项 |
|---|---|---|
| 每个 Step 6 domain error 有上层映射 | 通过 | §7.2、§8.1；`DomainError` 不越过 application 直接暴露 transport。 |
| 每个 Step 7 `ImageApplicationError` 有 retry/manual 分类 | 通过（显式 blocker） | §7.3、§10；具体退避/次数留 Step 13，`TransactionBoundary`/stored result defect 需人工。 |
| Step 8 protocol error 与 outcome 能回指 source/flow | 通过 | §7.5、§8.2；不增加 variant。 |
| Step 9 每类 flow 有异常停止点 | 通过 | §9.1~§9.5；Command/Job B01/B02 当前零 mutation，Query/inbound zero-write。 |
| Step 10 非法状态转换未与 blocked/unavailable 混淆 | 通过 | `InvalidTransition` 保留；依赖缺口/不可用/未知分别映射。 |
| Step 11 UoW/版本/append-only/sidecar failure 有恢复 | 通过（B03/PF pending） | §10、§11；B03 与 `PF-UNAVAILABLE-RECOVERY` 不被伪造关闭。 |
| Query no-write 与 Empty/Gap/Stale/Rebuilding/Unavailable 矩阵一致 | 通过 | §8.3、§9.3；不 query-time repair。 |
| duplicate replay 不重跑 mutation/adapter/page scan | 通过 | §9.1、§10.2、§11.1；B02 未闭合时不声称 replay 可执行。 |
| 外部 body/live state 未进入 error/result | 通过 | §7.4、§9.4、§11.1；错误原因只用脱敏 `SafeReason`。 |
| outbound/event/reporter scope 未被参照材料污染 | 通过 | `NoneAuthorized` 固定；无 outbox/publisher/delivery/receipt/report。 |

### 12.3 跨边界依赖分类审计

| 依赖 | seam 分类 | 错误进入本仓的方式 | 本仓允许的恢复 | 禁止推导 |
|---|---|---|---|---|
| `L3-method-library` RoleDefinition / method assets | `ref` / `adapter` | body-free mapping snapshot 或 blocked/unavailable conclusion | refresh declared-use ref；owner closure 后重开 | Role body、固定 Role 数量、映射 readiness。 |
| `L2-runtime`、`L2-tools`、`L2-member`、supervisor/extras | `ref` / `runtime` | component pin/ref resolution 或 local gap | 依赖恢复后重读；pending 时 blocked | runtime loop、tool execution、member主体、live state。 |
| `L1-artifact` | `ref` / `adapter` | local Artifact handoff Pending/Gap | formal owner contract 后 reopen | Artifact version/lineage/acceptance。 |
| `L2-member-service` | `runtime` / `ref` / `adapter` | `ConsumerHandoffGap` open/stale | owner contract 后 reopen | manifest、instance、container、launch、health、confirmation。 |
| inbound owner / event family | `event` | marker-only boundary disposition | MI-UP-005 closure 后 reopen | envelope、topic、event ID、receipt、dedup。 |
| outbound consumers | `event` / `adapter` | 当前无 inventory | MI-UP-009 closure 后多 Step reopen | publisher、delivery、outbox、ACK/readiness。 |

## 13. 正式 `03-详细设计.md` 第 11 章回填草稿（禁止当前装配）

> 本节只摘录已在本文件前文收束的结论。正式 03 仍未开放；回填前必须通过 Step 13~19 的后续门禁和用户确认。

### 11. 错误模型、异常分支与恢复口径

#### 11.1 错误层级

`domain` 只产生 `DomainError::{Validation, WrongReferenceKind, InvalidTransition, Blocked, Conflict}`；它不依赖 repository、adapter、transport 或外部 body。`application` 与各 port 统一使用 `ImageApplicationError`，由 application facade 将其映射为 `ImageProtocolError`、`ImageCommandOutcomeKind`、`ImageQuerySurface`、`ImageInboundBoundaryResult` 或 `ImageOperationsJobResult`。底层 SQL、SDK、HTTP、broker、secret、raw payload 与 fake private state 不得穿透。

#### 11.2 错误映射

| 内部错误 | HTTP / RPC / Event 映射 | 调用方应如何处理 |
|---|---|---|
| `DomainError::Validation` / `WrongReferenceKind` | `Missing` 或 `ContractViolation` | 修正输入/ref；不 fallback。 |
| `DomainError::InvalidTransition` | `InvalidTransition` | 不修改对象；通过合法新 context 重试。 |
| `DomainError::Blocked` | `ContractGap` 或 `Unavailable` | 只冻结 affected lane；等待 owner/source 条件。 |
| `DomainError::Conflict`、`VersionConflict` | `Conflict` | version conflict 先 reload 同对象；不得覆盖。 |
| `NotFound` | Command=`Missing`；Query 按显式 scope=`Empty`，否则 `Unavailable`/`Gap` | 不从 history/cache 猜补。 |
| `Unavailable` | `Unavailable` | 依赖恢复后按 policy 重试；不暴露底层细节。 |
| `ContractViolation` | `ContractViolation` | 修正 mapper/port/adapter/design；不绕过。 |
| `IdempotencyConflict` | `IdempotencyConflict` | 使用原请求或新 key；不重跑不同 input。 |
| `StoredResultMissing` | `ReplayUnavailable` | 人工修复；不得重算旧结果。 |
| `TransactionBoundary` | `Unavailable` 或 `Unknown` | begin failure 可 retry；commit/rollback uncertain 先审计。 |

#### 11.3 异常分支与恢复

- Command/Job 在当前 `DDD-S9-B01/B02` 前于 validation/context 后 fail closed；不开始 UoW、reserve、repository save、external seam、trace、gap、freshness 或 stored result 写入。
- future write flow 必须遵循 `canonicalize → begin ReadWrite UoW → reserve → exact reads/guard → local saves → required trace/freshness → save result/body → complete → commit`。任一本地写失败均 rollback；duplicate 先 rollback 再只读 stored shell/body。
- Query 只读既有 local truth/view/marker。`Empty`、`Gap`、`Stale`、`Rebuilding`、`Unavailable` 必须按既有 content-state 矩阵返回；query 不创建 view/gap、不刷新 source、不修复 projection。
- 条件入站只检查 `InboundContractMarker`，返回 `accepted_input=false`；不定义 envelope、payload、receipt、dedup、delay 或 quarantine。
- 外部 seam 的 `Blocked`/`Unavailable`/`Unknown` 分别保持 gap、unavailable、unknown 语义；ACK、2xx、tag、cache、adapter availability 不能形成 candidate、eligible、available、Artifact accepted 或 consumer resolved。
- `commit` status unknown、rollback uncertain、stored result missing、sidecar/relation corruption、`DDD-S11-B03` 和 `PF-UNAVAILABLE-RECOVERY` 属于人工/重开路径，不可盲重试或从 current truth 重算。

#### 11.4 恢复分类

| 分类 | 口径 |
|---|---|
| `retryable` | 仅临时 local dependency/source unavailable 且未产生未知副作用；保持同一 operation/key/scope。 |
| `reload_then_retry` | optimistic version conflict；重新读取同一对象并重跑 guard。 |
| `non_retryable` | 输入、typed ref、schema、状态、幂等 key 违反 contract。 |
| `owner_blocked` | owner contract/authority/Artifact/consumer/event schema pending；保留 lane gap/marker。 |
| `manual_consistency` | sidecar/result/view 断裂、commit/rollback unknown、非法 storage behavior 或 B03/PF blocker。 |
| `unknown` | 外部副作用或结论不可判定；等待 safe observation/reconciliation，不盲重试。 |

#### 11.5 审计与写入边界

本仓没有授权 outbound event。只有既有 flow 明确拥有的 local trace、availability history、gap、freshness、stored result 才能在 future/reopen UoW 内写入；拒绝、重复、Query、当前 marker-only inbound 和所有当前 B01/B02 stop 均不写 success trace/event。任何 raw external body、live memory/checkpoint/workspace、provider log、Artifact/consumer confirmation 或 run/report/evidence 进入本仓均为 `ContractViolation`。

## 14. 待确认事项与 blocker 交接

| ID | 事项 | 当前影响 | 需要谁确认 / 重开位置 | 未确认前处理 |
|---|---|---|---|---|
| `DDD-S9-B01` | concrete `CanonicalImageOperationInput` 与 per-protocol mapper 缺失 | 所有 Command/Job 不能 canonicalize/reserve | 本仓 Step 7/8 重开 | 保持 validation/context 后零 mutation。 |
| `DDD-S9-B02` | `ImageOperationResultRef` 合法构造、shell/body mapper 缺失 | 不能保存/complete/replay result | Step 6/7/8 重开 | 不伪造 result ref/body；duplicate 设计不可达。 |
| `DDD-S11-B03` | `AvailabilityTransition` append port 与 supersede/terminal state 不一致 | Supply history mutation 不能安全实施 | Step 7/10 重开 | 禁止 delete/reinsert/silent overwrite；保持 blocker。 |
| `PF-UNAVAILABLE-RECOVERY` | `ProjectionFreshness::Unavailable` 无正式恢复函数 | projection failure recovery 未闭合 | Step 13/14 或专项重开 | 只返回 Unavailable；不直接转 Rebuilding/Fresh。 |
| `MI-UP-001` | Member Service consumer contract 未停审 | ConsumerGap Resolved / confirmation | owner 正式合同后 Step 7~11 重开 | 只 Open/Stale/Gap/Unavailable。 |
| `MI-UP-002/003/006` | member/component/mapping/seed/base 正向 refs/compatibility pending | baseline/revision positive lane | 对应 owner + Step 7~11 重开 | Incomplete/Blocked/Gap，不补 body。 |
| `MI-UP-005` | inbound event authority/schema/identity/dedup/receipt pending | accepted inbound flow | owner + Step 7~9 重开 | marker-only，`accepted_input=false`。 |
| `MI-UP-007` | Artifact consumable ref/lineage/acceptance pending | Artifact handoff Accepted | L1-artifact + Step 7~11 重开 | Pending/Gap only。 |
| `MI-UP-009` | outbound owner/consumer/schema/delivery pending | outbound inventory | 多 Step 重开 | `NoneAuthorized`，无 outbox/publisher。 |
| `Q-MI-003/004` | builder/registry 与 gate/evidence authority pending | candidate/eligibility positive lane | owner正式合同 + Step 7~11 重开 | 不以 ACK/tag/cache/default pass 推导。 |

## 15. Step 13 handoff（仅输入，不自动进入）

| Step 13 议题 | 本 Step 已提供输入 | Step 13 仍需收束 |
|---|---|---|
| 并发冲突 | `VersionConflict`、same-object reload、UoW rollback 与 conflict surface | 并发场景、锁/无锁边界、重入窗口和测试切口；不得改变本 Step error taxonomy。 |
| 幂等 key / canonical input | `IdempotencyConflict`、DuplicateReplay、B01/B02 blocker | key scope、digest/canonical implementation、重复请求窗口和 race handling；不得伪造 digest。 |
| unknown / commit status | `Unknown`、`TransactionBoundary`、same-key audit | commit ambiguity、recovery probe、人工交接；不得盲重试。 |
| retry 分类 | `retryable` / `reload_then_retry` / `non_retryable` / `manual` | 具体次数、退避、并发控制；不得新增 scheduler/report。 |
| job / inbound re-entry | marker-only inbound、bounded Job no-report | 重入保护与重复 page/action 语义；当前仍无 receipt/run。 |

Step 13 开工前必须重新读取本文件 §10、§11、§14 以及 Step 8/9/11 对应段落；只有用户明确确认 Step 12 停审后，才允许创建 Step 13 文件。

## 16. Step 12 自检与停审清单

- [x] 已先读取项目级台账、03 flow、Step 12 SOP/书写规范与 Step 6~11 输入；未读取旧正式 `03-详细设计.md`。
- [x] 已输出 SOP 要求的错误类型表、错误映射表、异常分支处理表、恢复口径表。
- [x] 错误类型可回指既有 domain/application/port/protocol/job/inbound surface；未新增错误 enum 或状态 variant。
- [x] 已区分 retryable、reload-then-retry、non-retryable、owner-blocked、unknown 与 manual consistency；具体 transport/backoff/count 留后续 Step。
- [x] 已明确 Command/Job 当前 B01/B02 零 mutation、Query no-write、conditional inbound marker-only。
- [x] 已明确 UoW rollback、commit unknown、duplicate replay、stored result missing、projection failure、append-only history 和 external seam failure 的处理。
- [x] 已明确 raw external body/live state 不入库，`NoneAuthorized` outbound inventory 不变；未创建 outbox、publisher、delivery、receipt、run/report/evidence、digest 或 readiness。
- [x] 已保留 `DDD-S9-B01/B02`、`DDD-S11-B03`、`MI-UP-*`、`Q-MI-*`、`PF-UNAVAILABLE-RECOVERY` blocker。
- [x] 未实现代码、未运行测试、未创建实现仓、未修改其他项目、未提交 commit。

### 16.1 Step 完成记录

| 项目 | 记录 |
|---|---|
| Step 12 是否完成 | 是；`pass_with_explicit_blockers`。 |
| 文件状态 | 本文件已切换为 `completed_stop_review`，现在停审。 |
| 正式文档 | `03-详细设计.md` 未装配；旧正式 03 未读取。 |
| 新增实现事实 | 无；没有 run、report、artifact digest、evidence alias、test result、verdict、signoff 或 readiness。 |
| 下一步 | 等待用户明确确认后，才可创建并进入 Step 13 `03_ddd_step_13_concurrency_idempotency.md`。 |
