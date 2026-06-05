# Step 8. 定义状态机、事务与一致性验收

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 8 中间产物。
> 本步把状态机、事务、幂等、并发、恢复和副作用断言转成可裁决门禁。
> 本步不新增状态、错误、repository 函数或测试用例。

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 8
- 回填章节: `projects/L1-work/06-验收标准.md` §8 状态机、事务与一致性验收
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03-详细设计.md` §9 | 12 组正式状态机、业务 truth / auxiliary state 分层、非法转换错误 | 状态门禁来源 |
| `03-详细设计.md` §10 | 强一致 / 最终一致分层、UnitOfWork、repository version、query no-write | 事务与一致性门禁来源 |
| `03-详细设计.md` §11 / §12 | 错误映射、duplicate、conflict、commit status unknown、重入保护 | 恢复与幂等门禁来源 |
| `design-calibration/03_ddd_step_10_state_matrix.md` | 状态集合、转换矩阵、跨状态副作用、非法转换处理表 | 正式状态名和副作用断言来源 |
| `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | 数据所有权、逻辑存储、repository、版本、事务边界 | 原子性和 rollback 来源 |
| `design-calibration/03_ddd_step_13_concurrency_idempotency.md` | 幂等键、digest、并发场景、commit unknown 审计 | 幂等 / 并发门禁来源 |
| `05-测试方案.md` §3.4 / §6.7 / §10.1 | 状态 / 一致性 / 恢复切口、NFR idempotency、OPS recovery | 测试证据来源 |

已确认结论:

```text
状态名必须使用 `03-详细设计.md` 的正式 enum variant。
业务 truth 状态和辅助状态必须分层验收。
Command / Consumer / Job 写路径必须证明 UoW、idempotency / dedup、outbox、projection stale 和 rollback 语义。
Query 不写状态、不触发修复、不写幂等记录。
```

## 3. SOP 问题回答

### 3.1 哪些合法状态迁移必须通过?

合法迁移必须覆盖 9 组业务 truth 状态和 3 组辅助状态。

| 状态机 | 必须通过的合法迁移族 |
|---|---|
| `ProjectLifecycleState` | create -> `Active`;`Active` -> `ReadOnly` / `Closed`;`ReadOnly` -> `Closed`;`Closed` -> `Archived` |
| `ProjectMemberResponsibilityState` | assign -> `Proposed`;`Proposed` -> `Active` / `Released`;`Active` -> `Paused` / `Released`;`Paused` -> `Active` / `Released` |
| `BacklogState` | create -> `Open`;`Open` <-> `LockedForMaintenance`;`Open` -> `Archived` via project archive |
| `WorkItemState` | create / promote accept -> `Formalized`;`Formalized` -> `Committed` / `InProgress` / `Cancelled` / `Superseded`;`Committed` -> `InProgress` / `Cancelled` / `Superseded`;`InProgress` -> `Completed` / `Superseded` |
| `PromoteResultState` | create -> `PendingReview`;`PendingReview` -> `Accepted` / `Rejected` / `Superseded`;`Accepted` / `Rejected` -> `Superseded` only where正式 flow 开放 |
| `DependencyState` | create -> `Proposed`;`Proposed` -> `Active` / `Cancelled`;`Active` -> `Satisfied` / `Waived` / `Cancelled` |
| `BlockerState` | create -> `Open`;`Open` -> `Resolved`;`Mitigating` / `Closed` 只在正式写入口开放后验收 |
| `IterationState` | create -> `Planning`;`Planning` -> `Committed` / `Cancelled`;`Committed` -> `InProgress` / `Cancelled`;`InProgress` -> `Closed` |
| `CommitmentState` | create -> `Candidate`;`Candidate` -> `Committed`;`Committed` -> `Changed` / `Closed`;`Changed` -> `Closed` |
| `DerivedFreshnessState` | `Fresh` -> `Stale`;`Stale` -> `Rebuilding`;`Rebuilding` -> `Fresh` / `Failed`;`Failed` -> `Rebuilding` |
| `ReferenceResolutionStatus` | create -> `Unresolved`;`Unresolved` / `Stale` / `Failed` -> `Resolved`;`Resolved` -> `Stale` / `Failed` |
| `OutboxPublicationState` | create -> `Pending`;`Pending` -> `Published` / `Failed`;`Failed` -> `Pending` by retry policy |

### 3.2 哪些非法迁移必须拒绝?

非法迁移验收的核心不是错误文案,而是无副作用。

| 非法迁移类型 | 必须拒绝的例子 | 副作用断言 |
|---|---|---|
| 终态再次迁移 | `Archived` Project 正常写;`Released` ProjectMember 恢复;`Completed` / `Cancelled` Work 再推进;`Closed` / `Cancelled` Iteration reopen | no truth / no trace / no outbox / no projection stale |
| 证据不足 | `WorkItemState::Completed` 缺 verified evidence;`DependencyState::Satisfied` 缺 verified evidence;`BlockerState::Resolved` 缺 evidence | no truth / no outbox / no evidence body |
| 图约束失败 | dependency self-loop、orphan、cycle;commitment 包含 non-formal work | no dependency / no history / no outbox |
| 维护锁约束失败 | `BacklogState::LockedForMaintenance` 下新增 formal work | no WorkItem / no membership / no trace / no outbox |
| 并发冲突 | stale expected version、promote 多赢家、dual publisher stale version | losing path no business side effect |
| Query 写入 | stale / failed projection 被 query 读取时触发 rebuild 或 marker | query no-write |

### 3.3 哪些事务必须原子提交?

以下写路径必须以同一 `UnitOfWork` 原子提交或整体 rollback:

| 事务族 | 必须同 UoW 的写入 |
|---|---|
| accepted Command truth write | truth save、history / trace、audit summary、outbox enqueue、projection stale marker、idempotency complete |
| `CreateProjectFlow` | Project create、Backlog create、trace / audit、outbox、projection stale、idempotency complete |
| promote accept | PromoteResult、optional WorkItem / membership、decision record、trace、outbox、projection stale、idempotency complete |
| iteration commit | Iteration、IterationCommitment、Work marks、iteration change record、trace、outbox、projection stale、idempotency complete |
| inbound consumer accepted marker | reference / snapshot state、affected projection stale、dedup complete |
| projection rebuild success | projection replace、freshness marker、job idempotency complete、optional `DerivedWorkViewChanged` outbox |
| outbox publish item | publication state marker only;不得改 business truth |
| handoff / reconciliation job | marker / report / failed refs / job result;不得改 business truth |

### 3.4 哪些幂等和并发行为必须成立?

| 行为 | 必须成立的结果 |
|---|---|
| same key + same digest + completed | 返回 stored result,不重放 domain transition |
| same key + same digest + reserved / unknown | 返回 temporarily unavailable / retry later,不执行业务写 |
| same key + different digest | `IdempotencyConflict`,无业务副作用 |
| duplicate inbound event same digest | `AckDuplicate` 或同等 duplicate receipt,不重复 snapshot / marker |
| stale expected version | `VersionConflict`,losing path no truth / outbox |
| concurrent promote review | single-winner,loser no WorkItem / outbox |
| dual outbox publisher | 一个 worker 成功,另一个 version conflict / item failure,不改 source truth |
| projection stale vs rebuild race | newer cursor 不被 older cursor 覆盖 |
| commit status unknown retry | 先读 `IdempotencyRepository.get`,不得盲重放 domain transition |

### 3.5 失败时如何判定不通过?

以下任一情况即视为 Step 8 门禁失败:

| 失败类型 | 不通过条件 |
|---|---|
| 状态名偏离 | 使用旧状态名、口语状态名、未定义 enum variant 或后续 phase 状态作为通过条件 |
| 非法迁移有副作用 | reject / version conflict / policy failure 后出现 accepted truth、outbox、projection stale 或 success idempotency result |
| 事务半提交 | truth 成立但 trace / outbox / idempotency 缺失,或 idempotency complete 但 truth 缺失 |
| 幂等破坏 | duplicate 产生第二 truth / trace / outbox,或 same key different digest 被接受 |
| Query 反写 | query 写 idempotency、audit、outbox、projection state 或触发 rebuild |
| 辅助状态反写真相 | projection / reference / outbox / handoff / reconciliation 修改业务 truth |
| commit unknown 盲重试 | 未查询 idempotency result 就重放 domain transition |

### 3.6 是否存在旧状态名、口语状态名或后续 phase 状态被写入本轮验收?

本步不引入旧状态名。`BlockerState::Mitigating` / `Closed`、`PromoteResultState::Superseded` 等已在状态集合中存在但当前 public 写入口未完整开放的状态,不能写成本轮 P0 通过前置。它们只可作为正式 enum 存在性和“不得自行实现未开放 flow”的边界说明。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` | 状态和事务验收泛化为“状态正确” | 无法裁决哪些 transition、UoW、副作用必须成立 | 重建状态 / 事务 / 幂等门禁 |
| 旧 `06-验收标准.md` | 未区分业务 truth 状态和 projection / reference / outbox 辅助状态 | 容易把辅助状态反写真相 | 本步分表验收 |
| `03_ddd_step_10_state_matrix.md` | 某些正式 enum 变体是后续 flow 预留 | 若直接写成 P0 通过条件会扩大实施范围 | 本步明确不作为当前 P0 前置 |
| `05-测试方案.md` | 状态 / 一致性断言已存在,但不是验收裁决表 | 需要转成通过 / 失败条件 | 本步承接 |
| Step 7 | 已覆盖 interface / event / job surface | 仍需补状态和事务副作用裁决 | 本步继续收口 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 状态验收 | 泛化“合法状态流转” | 12 组正式状态机分别裁决 | 避免漏状态和旧状态名 |
| 非法迁移 | 只说 reject | 明确 reject 后 no truth / no outbox / no projection stale | 支撑验收裁决 |
| 事务验收 | 只写同 UoW 原则 | 列出 CreateProject、promote accept、iteration commit、consumer、job 等原子族 | 防止半提交 |
| 幂等 / 并发 | 分散在功能和接口门禁 | 统一 duplicate、conflict、version conflict、commit unknown | 可复验 |
| 恢复 | 只写 failed marker | 明确 outbox / projection / reference / handoff failure 不反写真相 | 承接 OPS / NFR evidence |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 把所有状态矩阵完整复制进正式 06 | 极完整 | 06 会重复详细设计,且容易产生第二真相 | 不采用 |
| 方案 B: 按状态机族和一致性主题写验收门禁,回指 `03` 矩阵 | 可裁决,不复制设计 | 需要读者回查 `03` 获取完整 From/To | 采用 |
| 方案 C: 只按测试用例族写门禁 | 证据直接 | 容易弱化正式 enum 和副作用断言 | 不采用 |

推荐方案 B。

原因:

- 验收标准要裁决是否符合设计,不应重写状态矩阵。
- Step 8 的关键风险是副作用错误、半提交、重复写和旧状态名污染。
- 通过条件必须绑定证据,但状态名和错误口径仍以 `03-详细设计.md` 为真相源。

## 7. 结构化中间产物

### 7.1 状态与一致性验收表

| 验收项 ID | 主题 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| `ST-WORK-STATE-001` | 业务 truth 状态集合 | `ProjectLifecycleState`、`ProjectMemberResponsibilityState`、`BacklogState`、`WorkItemState`、`PromoteResultState`、`DependencyState`、`BlockerState`、`IterationState`、`CommitmentState` 使用正式 enum variant | 使用旧状态名、口语状态名、临时状态或未定义 variant | domain state tests;`EV-WORK-CORE-*`;`EV-WORK-MEMBER-*`;`EV-WORK-FORMAL-*`;`EV-WORK-PROMOTE-*`;`EV-WORK-DEP-*`;`EV-WORK-ITER-*` |
| `ST-WORK-STATE-002` | Project / Backlog 状态迁移 | Project create -> `Active`;archive path `Closed` -> `Archived`;Backlog create -> `Open`;`Open` <-> `LockedForMaintenance`;archive 联动成立 | Project 隐式创建;Archived 后正常写;Backlog lock 失效;archive 未联动 | `TC-WORK-CORE-001`~`003`;`TC-WORK-FORMAL-003`;`EV-WORK-CORE-*`;`EV-WORK-FORMAL-003` |
| `ST-WORK-STATE-003` | ProjectMember 状态迁移 | `Proposed` / `Active` / `Paused` / `Released` 合法转换,`Released` 终态成立 | Released 后恢复;identity resolver failure 写 accepted member truth | `TC-WORK-MEMBER-001`~`004`;`EV-WORK-MEMBER-*` |
| `ST-WORK-STATE-004` | WorkItem / ChildWorkItem 状态迁移 | `Formalized`、`Committed`、`InProgress`、`Completed`、`Cancelled`、`Superseded` 转换符合矩阵,`Completed` 需要 verified evidence | 非 formal work 进入 commitment;terminal reopen;缺 evidence 完成;外部正文入仓 | `TC-WORK-FORMAL-*`;`TC-WORK-DEP-005`;`TC-WORK-ITER-002`;`EV-WORK-FORMAL-*`;`EV-WORK-DEP-005`;`EV-WORK-ITER-002` |
| `ST-WORK-STATE-005` | Promote 状态迁移 | `PendingReview` -> `Accepted` / `Rejected` 成立;accept path 和 created / bound Work 同 UoW;reject 不创建 Work | request 阶段创建 Work;reject 创建 Work;并发 review 多赢家 | `TC-WORK-PROMOTE-001`~`005`;`EV-WORK-PROMOTE-*` |
| `ST-WORK-STATE-006` | Dependency / Blocker 状态迁移 | dependency `Proposed` / `Active` / `Satisfied` / `Waived` / `Cancelled` 和 blocker `Open` -> `Resolved` 成立 | cycle / self-loop 成功;terminal reopen;缺 evidence resolve / satisfy | `TC-WORK-DEP-001`~`005`;`EV-WORK-DEP-*` |
| `ST-WORK-STATE-007` | Iteration / Commitment 状态迁移 | Iteration `Planning` -> `Committed` -> `InProgress` -> `Closed`,cancel path 和 Commitment `Candidate` -> `Committed` -> `Changed` / `Closed` 成立 | non-formal candidate commit;非法 reopen;commitment 与 iteration 半提交 | `TC-WORK-ITER-001`~`005`;`EV-WORK-ITER-*` |
| `ST-WORK-STATE-008` | Auxiliary states | `DerivedFreshnessState`、`ReferenceResolutionStatus`、`OutboxPublicationState` 按正式矩阵推进,且不反写业务 truth | projection / reference / outbox state 改写 Project、WorkItem、Iteration 等 truth | `TC-WORK-QUERY-004`~`008`;`TC-WORK-OPS-001`~`003`;`EV-WORK-QUERY-*`;`EV-WORK-OPS-*` |
| `ST-WORK-TX-001` | Command UoW 原子性 | accepted Command 同 UoW 完成 truth、history / trace、audit、outbox、projection stale、idempotency complete | truth 已写但 outbox / trace / idempotency 缺失;idempotency complete 但 truth 缺失 | `TC-WORK-CORE-001`;`TC-WORK-PROMOTE-002`;`TC-WORK-ITER-002`;`EV-WORK-CORE-*`;`EV-WORK-PROMOTE-002`;`EV-WORK-ITER-002` |
| `ST-WORK-TX-002` | Reject / rollback | metadata reject、domain reject、policy reject、version conflict、cycle reject 后无 accepted truth、无 business trace、无 outbox、无 projection stale | reject path 写入任何 accepted side effect | `TC-WORK-CORE-002`;`TC-WORK-DEP-002`;`TC-WORK-PROMOTE-005`;`EV-WORK-CORE-002`;`EV-WORK-DEP-002`;`EV-WORK-PROMOTE-005` |
| `ST-WORK-TX-003` | Query no-write consistency | 8 Query 在 hit / missing / not visible / stale / failed / rebuilding 时均不写任何状态 | Query 写 audit、outbox、idempotency、projection state 或触发 rebuild | `TC-WORK-QUERY-001`~`008`;`EV-WORK-QUERY-*` |
| `ST-WORK-TX-004` | Job no truth repair | publish、rebuild、refresh、reconciliation、handoff job 只写允许的 marker / report / projection / publication state | Job 自动修复 Project / WorkItem / Iteration / dependency truth | `TC-WORK-OPS-001`~`006`;`EV-WORK-OPS-*` |
| `ST-WORK-IDEM-001` | Command duplicate | same key + same digest + completed 返回 stored result,无新 truth / trace / outbox | duplicate 重放 domain transition 或创建第二正式事实 | `TC-WORK-CORE-004`;`EV-WORK-CORE-004`;`EV-WORK-NFR-004` |
| `ST-WORK-IDEM-002` | Idempotency conflict | same key + different digest 返回 `IdempotencyConflict`,无业务副作用 | different digest 被接受或覆盖原 result | `TC-WORK-NFR-004`;`EV-WORK-NFR-004` |
| `ST-WORK-IDEM-003` | Event dedup | duplicate inbound event same digest 不重复写 snapshot / marker;different digest 进入 dead-letter / conflict | 重复 event 重复写 accepted state;digest conflict 被接受 | `TC-WORK-MEMBER-*`;`TC-WORK-PROMOTE-*`;`EV-WORK-MEMBER-*`;`EV-WORK-PROMOTE-*` |
| `ST-WORK-CONC-001` | Optimistic version / single-winner | stale expected version 返回 `VersionConflict`;promote review single-winner;loser no WorkItem / outbox | silent overwrite、多赢家或 losing path 有副作用 | `TC-WORK-PROMOTE-005`;`TC-WORK-ITER-005`;`EV-WORK-PROMOTE-005`;`EV-WORK-ITER-005`;`EV-WORK-NFR-004` |
| `ST-WORK-CONC-002` | Outbox / projection concurrency | dual publisher、projection stale vs rebuild race、older cursor 等场景不覆盖 newer state、不改 business truth | old cursor 覆盖 fresh view;dual publisher 改 truth 或重复 publication truth | `TC-WORK-OPS-001`;`TC-WORK-OPS-002`;`EV-WORK-OPS-001`;`EV-WORK-OPS-002` |
| `ST-WORK-REC-001` | Failure marker / recovery | publisher / projection / reference / handoff failure 有 `Failed` / `Stale` / report marker,rerun 按正式状态推进 | failure silent success;failed marker 不可见;rerun 非幂等;恢复时改业务 truth | `TC-WORK-OPS-001`~`006`;`EV-WORK-OPS-*`;`EV-WORK-NFR-002` |
| `ST-WORK-REC-002` | CommitStatusUnknown | retry 前读取 `IdempotencyRepository.get`;Completed same digest 返回 stored result;Reserved unknown 不重放 domain transition | commit unknown 后盲重试导致重复 truth / outbox | `TC-WORK-NFR-004`;`EV-WORK-NFR-004`;commit unknown audit report |

### 7.2 合法 / 非法转换证据映射

| 主题 | 合法迁移证据 | 非法迁移证据 | 必须检查的副作用 |
|---|---|---|---|
| Project / Backlog | `CORE-001/003`;`FORMAL-003` | `CORE-002`;`FORMAL-003` | Project、Backlog、trace、outbox、projection stale、idempotency |
| ProjectMember | `MEMBER-001` | `MEMBER-002/003/004` | ProjectMember、snapshot ref、trace、outbox、no identity body |
| WorkItem / ChildWorkItem | `FORMAL-001/005`;`ITER-002` | `FORMAL-002/003/004/005`;`DEP-005` | Work truth、membership、completion ref、trace、outbox |
| Promote | `PROMOTE-001/002/003` | `PROMOTE-004/005` | PromoteResult、decision record、optional WorkItem、outbox |
| Dependency / Blocker | `DEP-001/003/004/005` | `DEP-002/005` | relation state、history、trace、outbox、evidence ref only |
| Iteration / Commitment | `ITER-001/002/004/005` | `ITER-003/005` | iteration、commitment、work marks、trace、outbox |
| Auxiliary states | `OPS-001/002/003/005/006` | `QUERY-*`;`OPS-004` no-write | publication / projection / reference / handoff marker only |
| Idempotency / concurrency | `CORE-004`;`PROMOTE-005`;`NFR-004` | same key different digest / stale version / commit unknown | no duplicate truth / no blind retry |

### 7.3 一致性边界图

#### 一致性边界图: Truth / Side Effects / Recovery

```text
Accepted write path
  -> domain transition
  -> save truth
  -> append trace / audit
  -> enqueue outbox
  -> mark projection stale
  -> complete idempotency
        |
        v
      commit

Reject / conflict path
  -> validation / policy / version failure
  -> rollback
  -> no truth / no outbox / no projection stale

Async recovery path
  -> publish / rebuild / refresh / handoff job
  -> Published / Fresh / Resolved / handoff marker
  -> Failed / Stale / report marker
  -> no business truth repair
```

关键说明:

- `Accepted write path` 的副作用必须同 UoW 成立。
- `Reject / conflict path` 必须证明没有 accepted 副作用。
- `Async recovery path` 只推进辅助状态或 report,不得修业务 truth。

### 7.4 旧状态名和后续状态防污染清单

| 类别 | 不得写成本轮通过条件 | 正确口径 |
|---|---|---|
| 旧口语状态 | `Draft`、`Dissolved`、`DraftIteration`、child work proposal 等旧状态名 | 使用 `03-详细设计.md` §9 的正式 enum variant |
| 后续 flow 预留 | `BlockerState::Mitigating`、`BlockerState::Closed` | 当前只验 `OpenWorkBlocker` / `ResolveWorkBlocker`;开放写入口后再验 |
| 后续 promote cleanup | `PromoteResultState::Superseded` | 不作为当前 P0 accept / reject 成功前置 |
| 产品化 DB 状态 | SQL lock、queue product-specific ack 状态 | 验 repository / UoW / marker 语义,不锁产品实现 |
| Query 派生修复状态 | query-triggered rebuild / auto repair | Query 只返回 stale / failed / rebuilding surface |

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认 12 组正式状态机进入验收,状态名以 `03-详细设计.md` 为准 | 否 | 状态机门禁承接 | 无 | 无回写 |
| 确认 accepted Command / Consumer / Job 写路径必须验证 UoW 和副作用一致性 | 否 | 事务一致性门禁 | 无 | 无回写 |
| 确认 duplicate、conflict、version conflict、event dedup、commit unknown 均进入一致性验收 | 否 | 幂等 / 并发门禁 | 无 | 无回写 |
| 确认后续 flow 预留状态不得写成本轮 P0 通过条件 | 否 | 范围裁剪 | 无 | 无回写 |

说明:

```text
本步没有新增状态、错误、repository 函数、事务边界或测试用例。
本步只把已确认的状态矩阵、事务一致性和测试切口转成可裁决验收门禁。
```

## 9. 回填草稿

正式 `06-验收标准.md` §8 建议采用以下结构:

```text
8. 状态机、事务与一致性验收
  8.1 业务 truth 状态机验收
  8.2 辅助状态机验收
  8.3 UnitOfWork 与 rollback 验收
  8.4 幂等、并发与重入保护验收
  8.5 恢复、failed marker 与 no truth repair 验收
  8.6 旧状态名和后续状态防污染
```

正文草稿:

```text
本章用于裁决 `L1-work` 的状态转换、事务原子性、幂等、并发和恢复语义是否成立。状态名必须使用 `03-详细设计.md` §9 的正式 enum variant;任何旧状态名、口语状态名、临时状态或未开放 public flow 的后续状态,不得写成本轮 P0 通过条件。

accepted 写路径必须在同一 UnitOfWork 内完成 truth save、history / trace、outbox、projection stale 和 idempotency complete。reject、policy failure、version conflict、idempotency conflict 和 commit unknown retry 不得产生 accepted truth、副作用或盲重试。projection、reference、outbox、handoff 和 reconciliation 只推进辅助状态或 report,不得修复业务 truth。
```

## 10. 待确认事项

无阻塞进入 Step 9 的待确认事项。

后续 Step 必须继续收口:

- Step 9 将性能、可用性、安全、配置边界和容量等非功能门禁转成验收项。
- Step 10 将 trace、audit、safe log、metric、evidence index、redaction 和 report 路径转成证据门禁。
- Step 11 将旧状态名、半提交、重复 truth、query / job 反写和 commit unknown 盲重试纳入一票否决裁决。

## 11. 进入下一步条件

- [x] 合法状态迁移已经覆盖。
- [x] 非法状态迁移和 reject 副作用已经定义。
- [x] 事务原子提交和 rollback 门禁已经定义。
- [x] 幂等、并发和 commit unknown 行为已经定义。
- [x] 失败时不通过条件已经定义。
- [x] 旧状态名、口语状态名和后续状态防污染口径已经定义。
- [x] 用户审核并确认本 Step。
