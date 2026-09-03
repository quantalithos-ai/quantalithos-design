# L2-member-images 06 验收标准 Step 8：状态机、事务与一致性验收

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 8  
> 对应书写规范：standards/document/验收标准书写规范.md §5.8  
> 回填位置：正式 06-验收标准.md 第 8 章“状态机、事务与一致性验收”  
> 方法粒度：沿用 L1-governance 的“验收项 → 设计契约 → TC → EV family → 固定 report path → 单项停审 → 跨门禁审计”方法；不继承其 approval、outbox、publisher、event、report 或签署语义。  
> 文档模式：full-restart；本文件是 future acceptance contract，不是实现、测试报告、evidence instance 或验收结论。

## 1. Step 状态、开工确认与本步边界

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 8：定义状态机、事务与一致性验收。 |
| 输出文件 | projects/L2-member-images/design-calibration/06_acceptance_step_08_state_tx_consistency.md。 |
| 开工恢复 | 已先核对项目执行台账、06 flow 与已完成的 Step 7；并读取验收 SOP Step 8、书写规范 §5.8、依赖裁剪规则、正式 03 §9~§12、03 Step 9/10/11/13 和正式 05 §5/§6/§9/§13。 |
| 本步状态 | completed_stop_review。状态、事务、幂等、并发、projection 与 phase-isolation 仅完成设计门禁校准；实际验收输入、实现、run、artifact、report、EV instance、verdict、signoff 与 readiness 仍全部不存在。 |
| 设计停审结论 | pass_with_explicit_blockers。所有 planned gate 都有正式状态/flow/TC/EV/path 追溯；受 DDD-S9-B01/B02、DDD-S11-B03、DDD-S13-OPEN-01/02、PF-UNAVAILABLE-RECOVERY、MI-UP-* 与 Q-MI-* 影响的正向 lane 保持 blocked/not_evaluable。 |
| 当前可达面 | Command 与 Job 在 B01/B02 前 zero-effect；Query 是 committed local truth/view 的 strict read-only；两条 inbound 只有 marker disposition 且 accepted_input=false；outbound inventory 为 NoneAuthorized。 |
| 本步不做 | 不新造 enum、route、topic、event、outbox、publisher、lease、scheduler、physical storage、recovery edge、result factory、implementation、test run、证据、digest、Artifact/consumer/container truth 或总体通过结论。 |

### 1.1 本 Step 的状态与实际验收分界

| 语境 | 此处可以定义 | 此处不得声称 |
|---|---|---|
| 设计校准 | future pass/failure、local state enum、合法/非法边、UoW/rollback、version、append-only、planned TC/EV/path、blocked/not_evaluable upper bound。 | 某个 transition、commit、replay、recovery、consumer handoff 或验收已真实发生。 |
| 当前 B01/B02 面 | valid shape 被安全停止、illegal input/edge 被拒绝、无 UoW/IO/write 的 boundary assertion。 | valid Command/Job 已创建 state、保存 replay、提交 supply history 或形成正向业务结果。 |
| future/reopen 写面 | 关联 blocker 已关闭后，canonicalize → UoW → reserve → exact read → transition → local write → result → complete → commit 的验收要求。 | 该顺序已经实现，或 external adapter/owner result 属于 local atomic commit。 |
| 真实验收 | 同一 <run_id> 的 artifact/report pair 如何支撑未来裁决。 | planned TC、EV family、固定路径、fake 或静态表就是实际 evidence。 |

### 1.2 本步输入与使用边界

| 输入 | 当前状态 | 本 Step 使用 | 不得推导 |
|---|---|---|---|
| 正式 03 §8 | 已停审 | 28 条 logical flow 的当前 stop / read-only / marker-only 边界与 future UoW 顺序。 | Command/Job 当前可写、Job scheduler/run、inbound accept 或 outbound delivery。 |
| 正式 03 §9 | 已停审 | 19 张矩阵、20 个 local lifecycle subject、正式 enum、合法/非法边、phase isolation。 | 全局 image lifecycle、Ready、runtime/consumer/global readiness。 |
| 正式 03 §10 | 已停审 | logical store、same-object version、Absent create、UoW、append-only、projection/replay consistency。 | DB/DDL、outbox/publisher、external two-phase commit 或已存在 recovery implementation。 |
| 正式 03 §11 | 已停审 | InvalidTransition、VersionConflict、TransactionBoundary、safe failure 与 PF 上限。 | provider body、transport status、blind retry 或 Unavailable recovery function。 |
| 正式 03 §12 | 已停审 | reservation/replay、duplicate、commit unknown、race、in-flight / namespace open items。 | AlreadyInProgress、lease、TTL、raw-key global index、automatic cleanup。 |
| 正式 05 §5/§6/§9/§13 | 已停审 | planned TC、EV family、suite 与 fixed future artifact/report path。 | 已执行测试、实际 report/evidence、量化阈值或验收结果。 |
| Step 5~7 | 已停审 | 功能、redline、protocol 与跨仓边界的状态/transaction 影响。 | owner pending 已闭合、下游同步成功或 VETO 已实际触发。 |
| L2-member、L2-member-service 与其他 owner | parallel / pending | 仅作为 gap、ref、adapter、marker 或 blocked 影响。 | manifest、consumer confirmation、container launch、Artifact acceptance、event receipt 或 readiness。 |

## 2. SOP 问题回答

| SOP 问题 | 收敛回答 | 依据 |
|---|---|---|
| 哪些合法状态迁移必须通过？ | 仅 03 §9 已列的 19 matrix allowed edge 可在 future/reopen 通过；每一 state family 都要同时证明合法 edge、terminal/replacement 纪律和阶段隔离。当前 Command/Job 无正向 transition 可判。 | 03 §9；TC-STATE-001~019。 |
| 哪些非法迁移必须拒绝？ | 任何非正式 edge、terminal 原地复活、history overwrite、cross-phase shortcut、Unavailable → Rebuilding/Fresh 假恢复、marker → accepted inbound 都必须拒绝、保持对象不变或返回正式 safe disposition。 | 03 §9~§12；TC-STATE-001~019、TC-REC-001。 |
| 哪些事务必须原子提交？ | 仅 future/reopen local write：canonicalize、reserve、same-object exact reads、domain transition、许可的 local truth/trace/既有 freshness、stored result、complete 必须同一 ReadWrite UoW commit 或同回滚。 | 03 §8/§10/§12；TC-CON-001~005。 |
| 哪些幂等和并发行为必须成立？ | same channel/name/key + same stable input 只读 stored replay；different input conflict；existing object 只用自己的 version；create 只用 Absent；commit unknown 不盲重跑；Query/inbound 不参与 reservation。 | 03 §10/§12；TC-CON-001~005、TC-QUERY-001~010、TC-IN-001~002。 |
| 失败时如何判定不通过？ | 真实 run 若接受非法 edge、留下 partial local effect、last-write-wins、重跑 duplicate、Query/inbound write、history overwrite、假的 recovery 或 state promotion，则相应 P0 gate failed；缺 owner/implementation/evidence 时是 blocked/not_evaluable，不得写 pass。 | 03 §9~§12；05 §6/§9/§13。 |
| 是否存在旧状态名、口语状态名或后续 phase 状态？ | 不存在可进入本轮正式口径的旧状态。只使用正式 enum；不得写 Ready、Published、Delivered、Running、global lifecycle 或把 Available/Fresh/Assembled 升格为 readiness。 | 03 §9；TC-STATE-013~019、TC-SEC-002。 |
| 每项能否回指矩阵、flow、TC、EV 和 path？ | 可以。第 7 节逐项闭环矩阵固定每个 AC 的 formal contract、触发 flow、planned TC、EV family、future report path 与裁决影响。 | 本文件第 7 节；05 §13。 |
| 每项完成后是否停审？ | 是。第 9 节对每个 AC 逐项复核状态名、flow 范围、证据路径、副作用断言与 blocker/phase 边界。 | 验收 SOP Step 8。 |
| 是否有 unresolved 冲突？ | 没有设计命名/追溯冲突；但 B01/B02/B03、OPEN、PF 和 owner gap 使对应正向实际验收尚不可裁决，必须显式保留。 | 第 10、12 节。 |

## 3. 当前材料诊断、改动对比与裁决取舍

### 3.1 当前材料诊断

| 诊断点 | 若不收敛的风险 | 本 Step 处置 |
|---|---|---|
| 19 matrix / 20 subject 规模大且部分 enum 同名 | 将 Complete、Accepted、Available、Resolved、Fresh 混成单一成功状态。 | 按 DefinitionAssembly、BuildCandidate、Qualification、SupplyEntry、ReferenceDerived、technical 六族分开验收，并增加 cross-phase gate。 |
| current zero-effect 与 future/reopen UoW 同时存在 | 将设计的 future mutation 写成当前 capability，或把 B01 stop 误报为业务成功。 | 所有 AC 分开写 current boundary pass 与 future positive lane；后者在 blocker 未关闭时只能 blocked/not_evaluable。 |
| append-only 与 supply terminalization 有缺口 | 用 delete/reinsert、entry current state 或 silent overwrite 伪造 rollback/history 正确性。 | 将 DDD-S11-B03 单列为事务 gate blocker，禁止把未定义更新面当 evidence。 |
| idempotency 对 existing Reserved 与 namespace 未闭合 | 自造 lease、AlreadyInProgress、global key index 或自动清理，使 replay/commit-unknown 不可审计。 | 保留 DDD-S13-OPEN-01/02，要求 fail-closed/manual consistency，不定义新正向行为。 |
| PF recovery 未闭合 | Query/Job/cache/fake 偷偷把 Unavailable 变 Fresh，或把 view 写回 truth。 | Projection gate 只验 no-repair/no-invented edge；正向 recovery 保持 blocked。 |
| owner / sibling pending | local state 被误写为 Artifact、consumer、container、event 或 runtime success。 | 只验本仓 local boundary；external positive oracle 持续 blocked/not_evaluable。 |

### 3.2 改动前后对比

| 项 | 进入 Step 8 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| 状态验收 | Step 7 已逐协议提及状态，但无完整 state-family 裁决。 | 19 matrix / 20 subject 按正式 enum、allowed/forbidden edge 与 phase isolation 归入 AC-STATE-MI-001~007。 | 防止状态漂移和 local success 误升格。 |
| 事务验收 | 流程和 store 分别描述 UoW。 | current zero-write、future local atomicity、version、append-only、query/inbound、projection 分成 AC-TX-MI-001~007。 | 防止 partial commit 和维护面反写。 |
| 幂等 / 并发验收 | 03 §12 有设计约束，05 有 TC-CON 族。 | replay、conflict、race、unknown、re-entry 与 fake parity 分成 AC-IDEM-MI-001~006。 | 防止 duplicate 重跑与伪恢复。 |
| 证据闭环 | TC/EV 是规划方向。 | 每项均固定 future suite/report path，并重申同 <run_id> artifact/report pair 才是实际 evidence。 | 防止静态造证据。 |

### 3.3 验收裁决取舍

| 议题 | 可选方案 | 结论 | 理由 |
|---|---|---|---|
| 状态验收粒度 | 每个 enum 值单独一个 AC；或按 19 matrix 风险相邻族聚合。 | 采用六族 + 跨状态隔离共 7 项。 | 逐 enum 细节仍由 matrix 与 TC-STATE-001~019 承接，正式 06 保持可读且不丢 19 matrix 覆盖。 |
| future write 的验收结论 | 将 B01 stop 当成所有 write gate pass；或区分 boundary pass 与 future positive pass。 | 严格区分。 | 当前 no-write 可验证，但不能证明 mutation、replay、history 或 owner 正向结果。 |
| external adapter 与 UoW | adapter ACK 纳入 local atomic commit；或只接收 revalidated local safe consequence。 | 后者。 | 本仓不拥有 provider/Artifact/consumer truth，且无 outbound inventory。 |
| projection recovery | Query 或 fake 代替 rebuild；或维持 committed-truth-only 与 PF blocker。 | 后者。 | Query strict no-write；Unavailable 无正式恢复 edge。 |
| in-flight / namespace gap | 自造 runtime control；或 blocked/manual consistency。 | 后者。 | DDD-S13-OPEN-01/02 尚未定义正式 carrier、lookup 或 recovery。 |

## 4. 状态机范围与统一判定规则

### 4.1 正式 local matrix 清单

| 验收族 | matrix / local subject | 必须保留的边界 |
|---|---|---|
| DefinitionAssembly | DefinitionLifecycle（ImageFamilyDefinition、ImageVariantDefinition 两个 subject）、BaselineCompleteness、VariantRevisionLifecycle。 | Resolved、Complete、Buildable 各自只表示 definition、static baseline、revision；不等 build/supply。 |
| BuildCandidate | BuildIntentLifecycle、BuildSnapshotLifecycle、BuildAttemptLifecycle、CandidateLifecycle。 | Accepted 不等 builder handoff；Succeeded 不等 candidate；Formed 不等 qualification。 |
| Qualification | ProvenanceLifecycle、GateEvaluationLifecycle、EligibilityLifecycle、ArtifactHandoffLifecycle。 | Complete、Passed、Eligible、Artifact Accepted 彼此独立；gate/Artifact owner truth 外置。 |
| SupplyEntry | AvailabilityTransitionLifecycle、InstantiableEntryLifecycle、ConsumerHandoffGapLifecycle。 | Committed 是 local history；Available 是 local pinned supply；Resolved 是 owner-controlled consumer handoff。 |
| ReferenceDerived | ReferenceValidity、ContractGapLifecycle、ProjectionFreshnessLifecycle。 | Valid 限 declared use；gap 只冻结 affected lane；Fresh 只表示 committed-truth watermark alignment。 |
| technical | ImageIdempotencyLifecycle、InboundContractState。 | replay 不等 domain success；inbound 只有 Unavailable/Rejected/ReopenRequired，固定 accepted_input=false。 |

### 4.2 跨矩阵不变量

1. 本仓没有 GlobalState、SystemState、Ready 或 image 总生命周期；20 个 subject 不得因便利而合并。
2. 合法状态名和 edge 只能来自正式 03 §9。非法 lifecycle edge 返回 DomainError::InvalidTransition(SafeReason) 并映射 ImageProtocolErrorKind::InvalidTransition；输入、owner、reference、version 与 transaction 问题不能被误写成 state edge。
3. Blocked、Invalid、Conflict、Unknown、Stale、Retired、Superseded 等恢复只能通过新 local context、replacement relation 或 owner formal resolution；不得 overwrite 历史。没有 Superseded enum 的 subject 只能保留 superseded_by history relation。
4. ArtifactHandoffLifecycle::Accepted、ConsumerHandoffGapLifecycle::Resolved、gate Passed、eligibility Eligible、entry Available 等不是相互推导的总体成功信号。MI-UP/Q-MI 未闭合时任何 owner-positive relation 都保持 blocked/not_evaluable。
5. ProjectionFreshnessLifecycle::Unavailable 没有正式 Unavailable → Rebuilding/Fresh 边。任何 cache、fake、query、job 或 report 造成此边均为 failure。
6. current Command/Job 不得调用 factory、UoW、repository、adapter、trace、gap、freshness、stored result 或 commit；Query 不得改变 lifecycle；inbound marker 不得变 accepted event state。

## 5. 结构化中间产物：状态机验收门禁

### 5.1 状态与一致性验收表：AC-STATE-MI-001~007

| 验收项 ID | 主题与正式状态机 / subject | future 通过条件 | failure 条件 | planned evidence |
|---|---|---|---|---|
| AC-STATE-MI-001 | DefinitionAssembly：DefinitionLifecycle（family、variant）、BaselineCompleteness、VariantRevisionLifecycle。 | 19 matrix 中本族全部 allowed edge 仅由正式 factory/member 产生；Draft/Incomplete/Proposed 的合法后继与 recheck 语义正确；Blocked/Superseded/Conflict/Invalid 不能原地提升。 | 接受 Blocked/Superseded → Resolved、Conflict/Superseded → Complete、Invalid/Superseded → Buildable，或把 mapping/seed/body/fake 变成 definition/baseline/revision truth。 | TC-STATE-001~003、013~016、019；EV-UNIT-001、EV-SVC-001；reports/runs/<run_id>/suites/pr-contract-domain.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md。 |
| AC-STATE-MI-002 | BuildCandidate：BuildIntentLifecycle、BuildSnapshotLifecycle、BuildAttemptLifecycle、CandidateLifecycle。 | Pending/Accepted/Blocked/Cancelled、Incomplete/Complete/Invalid、Created/HandoffPending/OutcomePending/Succeeded/Failed/Unknown、Formed/Rejected/Blocked/Unknown 各守正式 guard；safe outcome、immutable identity、complete snapshot 与 correlation 都存在才可 future Formed。 | 将 intent Accepted 写成 builder acceptance；Created/Unknown/Failed 原地 Succeeded；Invalid snapshot Complete；ACK/tag/cache/bare digest 形成 candidate；candidate shortcut 到 qualification/supply。 | TC-STATE-004~006、013、015~016；TC-CMD-004~005、TC-JOB-001~002；EV-UNIT-001、EV-SVC-001、EV-INT-001；reports/runs/<run_id>/suites/pr-contract-domain.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-integration-seams.md。 |
| AC-STATE-MI-003 | Qualification：ProvenanceLifecycle、GateEvaluationLifecycle、EligibilityLifecycle、ArtifactHandoffLifecycle。 | provenance Complete、gate Passed、eligibility Eligible 与 Artifact Accepted 分别满足自己的 formal guard；缺 authority/evidence/ref 时保持 Incomplete/Pending/Blocked/Unknown/Gap，而不是默认正向。 | Complete/Passed/Eligible/Accepted 被互相推导；empty gate、fake、ACK、body 或 local ref 形成 Passed/Eligible/Artifact Accepted；terminal evaluation/decision 被原地覆盖。 | TC-STATE-006~007、013、015~016；TC-CMD-006~007、TC-QUERY-004、TC-JOB-003/006；EV-UNIT-001、EV-SVC-001、EV-INT-001、EV-SEC-001；reports/runs/<run_id>/suites/pr-contract-domain.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-integration-seams.md。 |
| AC-STATE-MI-004 | SupplyEntry：AvailabilityTransitionLifecycle、InstantiableEntryLifecycle、ConsumerHandoffGapLifecycle。 | transition 的 Proposed → Committed/Rejected/Superseded、entry 的 Unavailable → Available/Retired 与 Available → Superseded、gap 的 Open → Stale / future reserved Resolved 都严格按 matrix；entry、history 与 consumer gap 独立。 | Committed/Rejected 回 Proposed 或互换；history 被更新/删除；Retired/Superseded 原地 Available；Available 关闭 consumer gap、代表 launch/health/readiness，或 gap Stale 直接 Resolved。 | TC-STATE-008~010、013、015~016；TC-CMD-008~010、TC-QUERY-005~007、TC-JOB-006；EV-UNIT-001、EV-SVC-001、EV-INT-001、EV-ENTRY-001；reports/runs/<run_id>/suites/pr-contract-domain.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/ci-entry-contracts.md。 |
| AC-STATE-MI-005 | ReferenceDerived：ReferenceValidity、ContractGapLifecycle、ProjectionFreshnessLifecycle。 | Valid/Stale/Conflict/Unavailable 限 exact declared use；gap lane-scoped；Stale → Rebuilding → Fresh 只在 formal future rebuild 条件成立时发生，Fresh 仅 watermark alignment。 | non-Valid 原地 Valid、Resolved/Expired reopening、query/cache/fake 写 gap，Unavailable → Rebuilding/Fresh，或 Fresh 升格为 entry/consumer/runtime readiness。 | TC-STATE-010~011、013、015~016；TC-QUERY-002/009~010、TC-JOB-004~005、TC-REC-001；EV-SVC-001、EV-ENTRY-001、EV-REC-001、EV-SEC-001；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-entry-contracts.md；reports/runs/<run_id>/suites/nightly-risk.md。 |
| AC-STATE-MI-006 | technical：ImageIdempotencyLifecycle、InboundContractState。 | Reserved → Completed/Conflict 只在 future result/replay contract 完整时发生；Completed/Conflict 不复用。inbound 只可产生 formal marker，任一次均 accepted_input=false。 | Query reserve；缺 result shell/body仍 Completed；duplicate 重跑；marker 变 accepted/write/receipt/dedup/event lifecycle，或自造 accepted enum。 | TC-STATE-012、018；TC-CON-001~002、TC-IN-001~002、TC-QUERY-001~010；EV-SVC-001、EV-ENTRY-001、EV-INT-001；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-entry-contracts.md；reports/runs/<run_id>/suites/ci-integration-seams.md。 |
| AC-STATE-MI-007 | 19 matrix / 20 subject cross-phase isolation、naming and no-global-lifecycle。 | 所有 matrix 至少覆盖 legal、illegal、terminal/replacement 与 phase assertion；正式 enum 名无漂移；Resolved/Complete/Buildable/Succeeded/Passed/Eligible/Available/Fresh/Assembled 都保留 subject、owner、source/gap 与 phase。 | Ready、Published、Delivered、Running 等口语/旧名进入 state；任一 local state、planned EV、report、cache、fake 或 sibling draft 被聚合为 global/Artifact/consumer/container/runtime readiness。 | TC-STATE-013~019、TC-SEC-002、TC-DEP-001；EV-UNIT-001、EV-SVC-001、EV-SEC-001、EV-GATE-001；reports/runs/<run_id>/suites/pr-contract-domain.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/pr-config-security.md；reports/runs/<run_id>/gate-results.md。 |

### 5.2 逐 matrix 的合法 / 非法边验收索引

| matrix / subject | 必须通过的合法边或受控起点 | 必须拒绝的非法边 / shortcut | 对应 AC / TC |
|---|---|---|---|
| DefinitionLifecycle / family、variant | Draft → Resolved/Blocked/Superseded；Resolved → Blocked/Superseded。 | Blocked/Superseded → Resolved；Resolved 直接推 baseline/revision/candidate。 | AC-STATE-MI-001；TC-STATE-001、014~016。 |
| BaselineCompleteness / baseline | Incomplete → Complete/Conflict/Superseded；Complete 可 recheck 为 Incomplete/Conflict。 | Conflict/Superseded → Complete；immutable baseline 原地补 pin/seed/base。 | AC-STATE-MI-001；TC-STATE-002、015~016。 |
| VariantRevisionLifecycle / revision | Proposed → Buildable/Invalid/Superseded。 | Invalid/Superseded → Buildable；Buildable 自动发起 build。 | AC-STATE-MI-001；TC-STATE-003、013。 |
| BuildIntentLifecycle / intent | Pending 在 safe input 下可到 Accepted；Accepted/Pending 可到 Pending/Blocked/Cancelled。 | Blocked/Cancelled → Accepted；Accepted 当 builder acceptance。 | AC-STATE-MI-002；TC-STATE-004、016。 |
| BuildSnapshotLifecycle / snapshot | Incomplete → Complete/Invalid；Complete 经有效 recheck 可到 Incomplete/Invalid。 | Invalid → Complete；capture 后原地追加或替换 input。 | AC-STATE-MI-002；TC-STATE-005、015。 |
| BuildAttemptLifecycle / attempt | Created → HandoffPending/Unknown；pending 依 safe conclusion 到 outcome state。 | Created → Succeeded；Unknown/Failed 原地 Succeeded；unknown blind retry。 | AC-STATE-MI-002；TC-STATE-005、015；TC-JOB-002。 |
| CandidateLifecycle / candidate | correlated complete snapshot + safe outcome + immutable identity 时可 Formed；也可 Rejected/Blocked/Unknown。 | negative terminal → Formed；Formed → Eligible/Available/Artifact Accepted shortcut。 | AC-STATE-MI-002；TC-STATE-006、013、015。 |
| ProvenanceLifecycle / binding | Incomplete → Complete/Conflict；Complete 发现问题可到 Conflict。 | Conflict → Complete；Complete 自动成为 gate/eligibility/Artifact success。 | AC-STATE-MI-003；TC-STATE-006~007、013。 |
| GateEvaluationLifecycle / evaluation | Pending 收集 formal applicable authority 后到 Passed/Failed/Blocked/Unknown。 | missing authority/evidence → Passed；terminal outcome overwrite；fake/default pass。 | AC-STATE-MI-003；TC-STATE-006、015~016；TC-CMD-006。 |
| EligibilityLifecycle / decision | Pending 在 same candidate + Complete provenance + Passed gate 下到 Eligible；也可 Ineligible/Blocked。 | terminal overwrite；Eligible 推 entry/Artifact/consumer；owner pending default positive。 | AC-STATE-MI-003；TC-STATE-007、013、016；TC-CMD-006。 |
| ArtifactHandoffLifecycle / record | Pending/Gap 可保持 local gap；Accepted 是 formal future reserved owner result。 | image ref/ACK/fake → Accepted；local handoff 代替 Artifact truth。 | AC-STATE-MI-003；TC-STATE-007、016；TC-CMD-007。 |
| AvailabilityTransitionLifecycle / transition | Proposed → Committed/Rejected/Superseded；replacement 保留历史。 | Committed ↔ Rejected 或回 Proposed；delete/reinsert/overwrite existing history。 | AC-STATE-MI-004；TC-STATE-008、014~015；TC-CMD-009~010。 |
| InstantiableEntryLifecycle / entry | Unavailable 在 immutable pin + Eligible + Complete provenance + committed transition 下 future → Available；可 Retired；Available 可 Superseded。 | Retired/Superseded → Available；Available → Unavailable by delete；Available 当 consumer/runtime state。 | AC-STATE-MI-004；TC-STATE-009、013、015；TC-CMD-008。 |
| ConsumerHandoffGapLifecycle / gap | Open → Stale；formal future owner resolution 才能 Reserved Resolved。 | Stale → Resolved；Resolved → Open；Available entry 自动 close gap。 | AC-STATE-MI-004；TC-STATE-010、016；TC-QUERY-005。 |
| ReferenceValidity / snapshot | safe capture maps declared-use result；Valid 可转 non-Valid。 | non-Valid → Valid 原地复活；一个 declared use 影响其他 lane。 | AC-STATE-MI-005；TC-STATE-010、015~016；TC-JOB-004。 |
| ContractGapLifecycle / gap | Open → Blocked/Expired；formal owner resolution 后才 Reserved Resolved。 | Resolved/Expired reopen；global readiness conclusion；Query creates/closes gap。 | AC-STATE-MI-005；TC-STATE-010、016；TC-QUERY-009。 |
| ProjectionFreshnessLifecycle / freshness | Stale → Rebuilding → Fresh；Fresh/Rebuilding → Stale；Stale/Rebuilding → Unavailable。 | Unavailable → Rebuilding/Fresh；Fresh → readiness；Query-triggered rebuild/repair。 | AC-STATE-MI-005；TC-STATE-011、013、015；TC-QUERY-010、TC-JOB-005、TC-REC-001。 |
| ImageIdempotencyLifecycle / record | Reserved → Completed only with matching stored result；or → Conflict。 | Completed/Conflict → Reserved；Query reserve；stored result absent/mismatch 仍 Completed。 | AC-STATE-MI-006；TC-STATE-012；TC-CON-001~002。 |
| InboundContractState / marker | factory produces Unavailable/Rejected/ReopenRequired only; marker inspection stays accepted_input=false。 | any marker → accepted event/write; envelope/receipt/dedup/intent/snapshot creation。 | AC-STATE-MI-006；TC-STATE-012、018；TC-IN-001~002。 |

### 5.3 状态失败的统一裁决

| failure class | future acceptance disposition | 不允许的改写 |
|---|---|---|
| formal enum / allowed-edge drift | 对应 AC-STATE-MI failed；真实 run 的同 run evidence 不可支撑总体通过。 | 用口语状态、测试 fixture、配置或 reviewer 说明补正。 |
| illegal transition accepted / terminal overwritten | 对应 AC-STATE-MI failed；若涉及 core truth、history、external truth promotion 或 readiness，转交 Step 11 的 VETO candidate 核验。 | 将它降为 warning、blocked、retry success 或风险接受。 |
| owner contract absent | 本仓 no-write/gap/marker boundary 可 future 判 local pass；owner-positive relation remains blocked/not_evaluable。 | 将 local state 或 fake 写成 Artifact/consumer/event/container success。 |
| current B01/B02 stop | 只可 future 判 zero-effect boundary assertion；不可裁决 future mutation/replay/history positive lane。 | 以 valid input / context 构造为 state transition 或 business success。 |
| actual artifact/report pair 缺失 | 设计 gate 留 pending；实际验收不可裁决。 | 手写 EV、静态 mapping、stdout、planned case 或历史报告充当 evidence。 |

## 6. 结构化中间产物：事务、版本、历史与读侧一致性门禁

### 6.1 事务与一致性验收表：AC-TX-MI-001~007

| 验收项 ID | 主题 | future 通过条件 | failure 条件 | planned evidence |
|---|---|---|---|---|
| AC-TX-MI-001 | current Command / Job zero-effect boundary。 | 全部 10 Command 与 6 Job 在 B01/B02 前只验证 input/context 或 bounded marker；spy/audit 证明无 begin UoW、reserve、repository read/write、factory、adapter、trace/gap/freshness/result、complete 或 commit。 | legal shape 被当 mutation；任一 UoW/IO/write/adapter/history/replay/result 出现，或 Job 产生 scheduler/run/report/evidence truth。 | TC-CMD-001~010、TC-JOB-001~006、TC-STATE-018；EV-SVC-001、EV-ENTRY-001、EV-INT-001；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-entry-contracts.md；reports/runs/<run_id>/suites/ci-integration-seams.md。 |
| AC-TX-MI-002 | future/reopen local write UoW atomicity。 | 仅在 B01/B02 和 affected owner contracts closed 后：canonicalize → ReadWrite UoW → reserve → exact versioned reads → domain transition → permitted local truth/trace/existing freshness → stored result → complete → commit 同一 UoW；任一步失败全回滚。 | truth/history/result/replay/complete/freshness 部分可见；truth commit 后“稍后补 result”；external call 或 owner ACK 被当 local commit evidence；未闭 blocker 的 path 被启用。 | TC-CON-001~005、TC-CMD-003~010、TC-JOB-001~006；EV-INT-001、EV-SVC-001、EV-REC-001；reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/nightly-risk.md。 |
| AC-TX-MI-003 | same-object optimistic version、Absent create 与 relation consistency。 | existing mutable subject 的 ExpectedLocalObjectVersion::Exact 只来自该 subject 的 Versioned<T>.version；new local subject 只用 Absent；cross-object relation 在同 UoW exact-read/guard/stage/commit。 | cursor、timestamp、external revision、tag、digest、watermark、idempotency key 或 trace id 作为 version；upsert/last-write-wins；stale writer 覆盖新 state；关联对象部分提交。 | TC-CON-003、TC-CON-005、TC-STATE-001~012；EV-INT-001、EV-UNIT-001；reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/pr-contract-domain.md。 |
| AC-TX-MI-004 | immutable input、append-only trace/history 与 replacement。 | baseline/build snapshot input、pin/seed/base identity 与 stored result identity 不原地改；ImageTraceRecord 与 AvailabilityTransition 只 append；修复使用 new context/replacement/supersede，历史可追。 | delete/reinsert、overwrite、mutable latest/default/body 补写、old transition/trace update，或 entry state 代替 transition history。 | TC-STATE-001~010、TC-QUERY-007~008、TC-CON-005；EV-UNIT-001、EV-INT-001、EV-SVC-001；reports/runs/<run_id>/suites/pr-contract-domain.md；reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md。 |
| AC-TX-MI-005 | Query / conditional inbound strict no-write。 | 10 Query 仅 exact/page/existing projection/marker read，无 ReadWrite UoW、reserve、trace/gap/freshness/view write、refresh/rebuild/adapter；2 inbound 只 inspect formal marker、accepted_input=false、无 receipt/dedup/intent/snapshot。 | Query repairs, writes, fetches, rebuilds or creates state；inbound parses payload/envelope or writes accepted event result；read result bypasses phase/visibility boundary。 | TC-QUERY-001~010、TC-IN-001~002、TC-STATE-012、018；EV-SVC-001、EV-ENTRY-001；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-entry-contracts.md。 |
| AC-TX-MI-006 | projection direction、staged visibility 与 recovery isolation。 | Query sees committed local truth/view/marker only；projection rebuild only reads CommittedImageTruthSnapshotPort；staged writes invisible outside UoW；existing view/freshness uses exact version；failure preserves source truth and safe stale/unavailable boundary。 | projection/cache/fake/report becomes truth source；Query creates/repairs view；old view overwrites newer truth；Unavailable is silently recovered；source truth rolled back for view failure。 | TC-QUERY-002/010、TC-JOB-005、TC-CON-003~005、TC-REC-001；EV-SVC-001、EV-INT-001、EV-REC-001；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/nightly-risk.md。 |
| AC-TX-MI-007 | external seam / owner boundary and zero outbound consistency。 | adapter/owner response is not local commit proof；only revalidated safe local consequence may enter permitted local truth；no outbox/publisher/delivery/outbound persistence；Artifact/consumer/container/gate/builder body stays external。 | ACK/2xx/tag/cache/fake/registry presence forms Candidate/Eligible/Available/Accepted/Resolved；external body enters store；outbox/publisher/receipt is introduced to “complete” transaction。 | TC-CMD-004~008、TC-STATE-006~010、TC-SEC-001~002、TC-DEP-001、TC-EVENT-001；EV-SEC-001、EV-GATE-001、EV-SVC-001；reports/runs/<run_id>/suites/pr-config-security.md；reports/runs/<run_id>/gate-results.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md。 |

### 6.2 事务、副作用与回滚判定图

#### 事务判定图：current stop 与 future/reopen local atomicity

```text
current Command / Job
  validate / context / bounded marker
            |
            v
       [DDD-S9-B01/B02]
            |
            v
safe error / blocked disposition
  -> no UoW, reserve, read, write, trace, result, commit

future/reopen only after all applicable blockers close
  canonicalize
  -> begin ReadWrite UoW
  -> reserve
  -> exact Versioned<T> reads + guards
  -> local domain transition
  -> allowed local truth / trace / existing freshness
  -> matching stored result + complete
  -> commit
       | any failure
       v
     rollback all staged local effects
```

关键说明：

1. 下半图是 future acceptance contract，不代表已有实现，也不授权当前写入。
2. external adapter、Artifact、consumer、builder、gate 或 event outcome 不在 local UoW 中，不能被 ACK/fake/adapter success 作为 commit proof。
3. current stop 与 future atomicity 都只能由未来同一 <run_id> 的 artifact/report pair 裁决；本 Step 没有生成实例。
4. 无 outbound inventory，因此图中没有 outbox、publisher、delivery、receipt、topic 或 retry branch。

### 6.3 持久化 / 状态副作用闭环矩阵

| 验收项 | state / transaction contract | trigger flow | planned TC | planned EV | fixed future report path | 裁决影响 |
|---|---|---|---|---|---|---|
| AC-TX-MI-001 | 03 §8 current B01/B02 stop；03 §10 current Command/Job none。 | 10 handle_*_command；six run_*_job。 | TC-CMD-001~010、TC-JOB-001~006、TC-STATE-018。 | EV-SVC-001、EV-ENTRY-001、EV-INT-001。 | reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-entry-contracts.md；reports/runs/<run_id>/suites/ci-integration-seams.md。 | actual write/IO = P0 failed；no-write only proves boundary, not business mutation. |
| AC-TX-MI-002 | 03 §8 future order；03 §10 UoW/result/complete；03 §12 replay。 | future/reopened Command/Job only。 | TC-CON-001~005、TC-CMD-003~010、TC-JOB-001~006。 | EV-INT-001、EV-SVC-001、EV-REC-001。 | reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/nightly-risk.md。 | partial local effect or omitted rollback = P0 failed；positive lane blocked until design/owner closure. |
| AC-TX-MI-003 | 03 §10 same-object Exact / Absent；03 §12 race guard。 | future writes / projection marker only。 | TC-CON-003、TC-CON-005、TC-STATE-001~012。 | EV-INT-001、EV-UNIT-001。 | reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/pr-contract-domain.md。 | stale overwrite/version-source drift = P0 failed. |
| AC-TX-MI-004 | 03 §9 terminal/replacement；§10 immutable/append-only/B03。 | revision/build/supply/history/query flows。 | TC-STATE-001~010、TC-QUERY-007~008、TC-CON-005。 | EV-UNIT-001、EV-INT-001、EV-SVC-001。 | reports/runs/<run_id>/suites/pr-contract-domain.md；reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md。 | history overwrite / missing replacement = P0 failed；B03 blocks affected positive supply judgment. |
| AC-TX-MI-005 | 03 §8 Query / inbound no-write；§10 ReadOnly / marker boundary。 | ten get_*_read_only；two consume_* marker flows。 | TC-QUERY-001~010、TC-IN-001~002、TC-STATE-012、018。 | EV-SVC-001、EV-ENTRY-001。 | reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-entry-contracts.md。 | any Query/inbound write = P0 failed and Step 11 VETO candidate. |
| AC-TX-MI-006 | 03 §9 ProjectionFreshness；§10 committed-truth projection；§11 PF limit。 | GetProjectionFreshness；RebuildImageDerivedViews future only。 | TC-QUERY-002/010、TC-JOB-005、TC-CON-003~005、TC-REC-001。 | EV-SVC-001、EV-INT-001、EV-REC-001。 | reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/nightly-risk.md。 | truth repair / invented recovery = P0 failed；PF positive recovery stays blocked. |
| AC-TX-MI-007 | 03 §10 external atomicity / zero outbound；§13 dependency crop。 | build/qualification/supply/handoff flows and dependency audit。 | TC-CMD-004~008、TC-STATE-006~010、TC-SEC-001~002、TC-DEP-001、TC-EVENT-001。 | EV-SEC-001、EV-GATE-001、EV-SVC-001。 | reports/runs/<run_id>/suites/pr-config-security.md；reports/runs/<run_id>/gate-results.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md。 | external truth/write or outbound addition = P0 failed / VETO candidate. |

## 7. 结构化中间产物：幂等、并发与重入验收门禁

### 7.1 幂等与并发验收表：AC-IDEM-MI-001~006

| 验收项 ID | 主题 | future 通过条件 | failure 条件 | planned evidence |
|---|---|---|---|---|
| AC-IDEM-MI-001 | same operation duplicate replay。 | 同一 channel + operation_name + idempotency_key 且 StableOperationInputRef 相同，只回放已保存的 matching CommandResult 或 JobDisposition；duplicate 不再执行 domain transition、adapter、page scan、projection rebuild、trace/gap/history 写或第二次 commit。 | duplicate 重跑 mutation/adapter/page/rebuild，产生第二份 local truth/result/history，或把 current truth 重新计算为 replay body。 | TC-CON-001；TC-CMD-010；TC-JOB-001~006；EV-SVC-001、EV-INT-001；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-integration-seams.md。 |
| AC-IDEM-MI-002 | same key with different stable input conflict。 | 同一 reservation lookup 但 stable input 不同，返回 IdempotencyConflict/formal Conflict；首个 reservation、stored result、local state 和历史保持不变。 | 覆盖首个 input、last-write-wins、任选一个 body、改 key 后静默重跑或把不同 input 当 Duplicate。 | TC-CON-002；TC-CMD-001~010；EV-SVC-001、EV-INT-001；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-integration-seams.md。 |
| AC-IDEM-MI-003 | existing Versioned<T> race guard。 | 每个 existing mutable subject 的 ExpectedLocalObjectVersion::Exact 来自同一 subject 的 versioned read；并发 stale writer 返回 VersionConflict，不覆盖 newer state；new subject 使用 Absent 并受 business unique guard。 | 以 cursor/timestamp/tag/digest/watermark/idempotency key 当 version、upsert、silent merge、last-write-wins、跨对象借用 version 或部分 relation commit。 | TC-CON-003、TC-CON-005；TC-STATE-001~012；EV-INT-001、EV-UNIT-001；reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/pr-contract-domain.md。 |
| AC-IDEM-MI-004 | commit unknown / rollback uncertainty。 | commit 或 rollback 状态不明时保持 TransactionBoundary/Unknown safe disposition；以同一 operation/key/stable input 审计 reservation/result/truth 后才能判 Duplicate 或未提交；不得换 key 或盲重跑。 | unknown 后盲重跑 accepted mutation、换 key、补偿写、删除不确定 history、伪造 committed/rejected 或吞掉 rollback failure。 | TC-CON-004~005；EV-INT-001、EV-REC-001；reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/nightly-risk.md。 |
| AC-IDEM-MI-005 | partial failure、stored-result 完整性与 re-entry。 | local save/append/projection/result/complete 任一失败时 staged UoW 全回滚；Completed 必有 matching stored result shell/body；缺失或错配返回 StoredResultMissing/ReplayUnavailable，不从 current truth 重算。 | truth 已提交但 result/complete 缺失、half-written history/view、Completed 无 body、re-entry 触发第二 writer 或自动 cleanup/lease。 | TC-CON-005、TC-CON-001~002、TC-STATE-012；EV-INT-001、EV-SVC-001、EV-REC-001；reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/nightly-risk.md。 |
| AC-IDEM-MI-006 | bounded Job / Query / inbound concurrency 与 fake parity。 | Job 仅按 explicit page/item exact version 处理；same-key Job replay 不重新 list；Query 可并发但始终 committed read-only；inbound 重复仍 marker-only；durable/fake 在 key、version、staging、rollback、append-only、replay 语义上等价。 | Job 扩页、创建 scheduler cursor/lease/report、Query 参与 reservation 或修复、inbound 产生 dedup/receipt/write、fake 产生 external success 或与 durable 语义漂移。 | TC-JOB-001~006、TC-QUERY-001~010、TC-IN-001~002、TC-CON-003~005、TC-DEP-001；EV-ENTRY-001、EV-SVC-001、EV-INT-001、EV-GATE-001；reports/runs/<run_id>/suites/ci-entry-contracts.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/gate-results.md。 |

### 7.2 幂等 / 并发闭环矩阵

| 验收项 | 正式 identity / version 契约 | 触发 flow | planned TC | planned EV | fixed future report path | 裁决影响 |
|---|---|---|---|---|---|---|
| AC-IDEM-MI-001 | 03 §10/§12 normalized reservation lookup + stored replay。 | future Command/Job duplicate path。 | TC-CON-001、TC-CMD-010、TC-JOB-001~006。 | EV-SVC-001、EV-INT-001。 | reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-integration-seams.md。 | duplicate side effect = P0 failed。 |
| AC-IDEM-MI-002 | 03 §12 same lookup / stable-input comparison。 | future Command/Job conflict path。 | TC-CON-002、TC-CMD-001~010。 | EV-SVC-001、EV-INT-001。 | reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-integration-seams.md。 | overwrite or false duplicate = P0 failed。 |
| AC-IDEM-MI-003 | 03 §10 same-object Exact/Absent + relation UoW。 | all future local writes and projection marker updates。 | TC-CON-003、TC-CON-005、TC-STATE-001~012。 | EV-INT-001、EV-UNIT-001。 | reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/pr-contract-domain.md。 | stale overwrite/version drift = P0 failed。 |
| AC-IDEM-MI-004 | 03 §11/§12 TransactionBoundary and unknown-state recovery。 | future commit/rollback fault path。 | TC-CON-004~005。 | EV-INT-001、EV-REC-001。 | reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/nightly-risk.md。 | blind retry or fabricated commit = P0 failed。 |
| AC-IDEM-MI-005 | 03 §10 result-before-complete and rollback；§12 replay integrity。 | future local write/re-entry path。 | TC-CON-001~005、TC-STATE-012。 | EV-INT-001、EV-SVC-001、EV-REC-001。 | reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/nightly-risk.md。 | partial commit or missing replay body = P0 failed。 |
| AC-IDEM-MI-006 | 03 §8/§10 Query, marker, bounded Job and fake parity。 | ten Query、two inbound、six Job。 | TC-QUERY-001~010、TC-IN-001~002、TC-JOB-001~006、TC-DEP-001。 | EV-SVC-001、EV-ENTRY-001、EV-INT-001、EV-GATE-001。 | reports/runs/<run_id>/suites/pr-boundary-no-write.md；reports/runs/<run_id>/suites/ci-entry-contracts.md；reports/runs/<run_id>/suites/ci-integration-seams.md；reports/runs/<run_id>/gate-results.md。 | Query/inbound write, Job expansion or fake drift = P0 failed / VETO candidate。 |

### 7.3 并发失败与恢复裁决

| 场景 | 允许的验收面 | 不允许的恢复或结论 |
|---|---|---|
| 两个 writer 争用同一 existing object | stale writer 得到 VersionConflict，local state/history 不被覆盖；可判 local concurrency boundary。 | last-write-wins、借用其他对象 version、静默合并。 |
| 两个 writer 创建相同 business key | 一个 future local create 以 Absent 成功，另一方为 conflict；当前 B01/B02 下两者均 zero-effect。 | upsert、任选一方、以 timestamp/tag 决胜。 |
| same key duplicate | 只读取 matching stored result；若 result 不完整则 ReplayUnavailable/manual consistency。 | 重新执行 domain、adapter、page scan、projection 或从 truth 重算 body。 |
| commit/rollback unknown | 保持 Unknown/TransactionBoundary，使用同 key 审计；无法证明时不继续。 | 换 key 重跑、补偿写、伪造 commit、吞掉 rollback failure。 |
| projection/query race | Query 只看 committed view/marker；rebuild 只读 committed truth，old writer 不覆盖 newer marker。 | Query 修复、cache 当 truth、Unavailable 直接变 Fresh。 |
| inbound/job overlap | inbound 仍 marker-only；Job 只 bounded explicit scope，不能互相构造 intent/receipt。 | accepted event、scheduler cursor、dedup receipt 或跨 lane mutation。 |

## 8. 状态 / 事务 / 幂等验收项停审记录

### 8.1 状态验收项停审

| 验收项 | 正式 enum / subject 已核对 | 触发 flow 在本轮范围 | TC、EV、path 固定（planned） | 副作用与 phase 断言清楚 | 结论 |
|---|---|---|---|---|---|
| AC-STATE-MI-001 | 是：DefinitionLifecycle、BaselineCompleteness、VariantRevisionLifecycle。 | 是；current write 仍由 B01 stop。 | 是；TC-STATE-001~003、013~016、019；EV-UNIT/SVC。 | 是；不原地复活、不把 static ref/body 升格。 | pass_with_explicit_blocker |
| AC-STATE-MI-002 | 是：BuildIntent/Snapshot/Attempt/Candidate lifecycle。 | 是；future Command/Job 映射，当前 zero-effect。 | 是；TC-STATE-004~006、013、015~016；EV-UNIT/SVC/INT。 | 是；Accepted、Succeeded、Formed 不跨 phase。 | pass_with_explicit_blocker |
| AC-STATE-MI-003 | 是：Provenance/GateEvaluation/Eligibility/ArtifactHandoff lifecycle。 | 是；owner positive lane future/reopen。 | 是；TC-STATE-006~007、013、015~016；EV-UNIT/SVC/INT/SEC。 | 是；缺 authority/evidence/ref 不 default pass。 | pass_with_explicit_blocker |
| AC-STATE-MI-004 | 是：AvailabilityTransition/InstantiableEntry/ConsumerHandoffGap lifecycle。 | 是；B01/B02 与 B03 限制已标明。 | 是；TC-STATE-008~010、013、015~016；EV-UNIT/SVC/INT/ENTRY。 | 是；history append-only，entry 不等 consumer/container。 | pass_with_explicit_blocker |
| AC-STATE-MI-005 | 是：ReferenceValidity/ContractGap/ProjectionFreshness lifecycle。 | 是；Query/Job recovery 受 PF 限制。 | 是；TC-STATE-010~011、013、015~016、TC-REC-001；EV-SVC/ENTRY/REC/SEC。 | 是；Unavailable 无未授权恢复边。 | pass_with_explicit_blocker |
| AC-STATE-MI-006 | 是：ImageIdempotencyLifecycle、InboundContractState。 | 是；inbound marker-only。 | 是；TC-STATE-012、018、TC-CON-001~002、TC-IN-001~002；EV-SVC/ENTRY/INT。 | 是；Completed 必须有 result，marker 不得 accepted。 | pass_with_explicit_blocker |
| AC-STATE-MI-007 | 是：19 matrix / 20 subject cross-phase index。 | 是；只做 local boundary 与 naming audit。 | 是；TC-STATE-013~019、TC-SEC-002、TC-DEP-001；EV-UNIT/SVC/SEC/GATE。 | 是；无 GlobalState/Ready/Published/Delivered/Running。 | pass_with_explicit_blocker |

### 8.2 事务与一致性验收项停审

| 验收项 | UoW / version / history 规则 | current/future 范围 | 失败副作用断言 | 结论 |
|---|---|---|---|---|
| AC-TX-MI-001 | current Command/Job 不开始 UoW；B01/B02 前 zero-effect。 | 10 Command、6 Job 全覆盖。 | 任一 read/write、reserve、adapter、trace、result、commit 或 scheduler/report 出现即失败。 | pass_with_explicit_blocker |
| AC-TX-MI-002 | future local effect 与 stored result/complete 同一 ReadWrite UoW。 | 仅 blocker 关闭后 reopen。 | partial commit、truth 后补 result、失败不 rollback 即失败。 | pass_with_explicit_blocker |
| AC-TX-MI-003 | existing 用同对象 Exact；new 用 Absent；relation 同 UoW。 | local mutable subjects 与 existing projection marker。 | cursor/tag/digest/watermark 当 version、upsert、last-write-wins 即失败。 | pass_with_explicit_blocker |
| AC-TX-MI-004 | immutable input、ImageTraceRecord、AvailabilityTransition 的 append/replacement 规则。 | definition/build/supply/history/query。 | overwrite/delete/reinsert、terminal history 改写或 input body 补写即失败。 | pass_with_explicit_blocker |
| AC-TX-MI-005 | Query ReadOnly；inbound marker inspection 无写。 | 10 Query、2 inbound。 | Query repair/refresh/rebuild/write 或 accepted inbound/receipt/dedup 即失败。 | pass_with_explicit_blocker |
| AC-TX-MI-006 | projection 只从 committed truth；staged write 不外泄；PF recovery fail-closed。 | query、rebuild job、view/freshness。 | cache/view/fake 成 truth、old view 覆盖、Unavailable 假恢复即失败。 | pass_with_explicit_blocker |
| AC-TX-MI-007 | external seam 不参加 local atomic commit；outbound store 严格为零。 | build/qualification/supply/handoff/依赖 audit。 | ACK/body/fake/registry 形成 local positive，或出现 outbox/publisher/receipt 即失败。 | pass_with_explicit_blocker |

### 8.3 幂等 / 并发验收项停审

| 验收项 | identity / concurrency contract | 失败条件 | 结论 |
|---|---|---|---|
| AC-IDEM-MI-001 | same lookup + same stable input → stored replay only。 | duplicate 重跑 domain/adapter/page/rebuild 或产生第二副作用。 | pass_with_explicit_blocker |
| AC-IDEM-MI-002 | same lookup + different stable input → Conflict；首条记录不变。 | 覆盖、误判 Duplicate、换 key 静默重跑。 | pass_with_explicit_blocker |
| AC-IDEM-MI-003 | same-object Exact/Absent、unique 与 relation guard。 | version 来源漂移、upsert、部分 relation commit。 | pass_with_explicit_blocker |
| AC-IDEM-MI-004 | commit/rollback unknown → Unknown/TransactionBoundary，同 key 审计。 | 盲重跑、换 key、补偿写、伪造 commit。 | pass_with_explicit_blocker |
| AC-IDEM-MI-005 | save/complete/replay body 一致，失败全回滚。 | Completed 无 body、half-written history/view、自动 lease/cleanup。 | pass_with_explicit_blocker |
| AC-IDEM-MI-006 | bounded Job、Query、inbound 与 fake/durable parity。 | Job 扩页、Query reserve、inbound receipt、fake external success 或语义漂移。 | pass_with_explicit_blocker |

以上停审结论仅表示：正式状态名、设计范围、future pass/failure、planned TC/EV/path 和副作用断言之间没有已知设计冲突；不表示任何实际测试或状态迁移已经通过。

## 9. 跨状态一致性门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 状态名、subject 与合法 edge 是否只来自正式 03 §9 | pass | 19 matrix、20 个 local subject 已按六族和 AC-STATE-MI-001~007 回指；未引入 `Ready`、`Published`、`Delivered`、`Running` 或 global lifecycle。 |
| 终态、replacement 与 append-only 是否一致 | pass_with_explicit_blocker | baseline/build snapshot 不可变，trace/history append-only；`DDD-S11-B03` 仍使既有 availability transition terminalization 的正向持久化裁决 blocked，禁止 delete/reinsert/overwrite。 |
| current stop 与 future positive write 是否被混淆 | pass | AC-TX-MI-001 只验证 B01/B02 前 zero-effect；AC-TX-MI-002~004 的 positive UoW / replay 是 reopen-only，不将 boundary assertion 写成 mutation pass。 |
| UoW、stored result、rollback 与 external seam 的副作用断言是否完整 | pass_with_explicit_blockers | local staged truth/trace/freshness/result/complete 只能同 UoW commit 或回滚；B01/B02、B03、OPEN-01/02 仍阻断真实 write/replay；external ACK/body/fake 永不构成 local commit proof。 |
| version、business unique 与 relation guard 是否互不替代 | pass | existing object 仅以自身 `Versioned<T>.version` 的 `Exact` 更新；new object 仅 `Absent`；cursor、tag、digest、watermark、idempotency key 与 trace id 均不是 version，unique conflict 不是 upsert 授权。 |
| Query、inbound、projection 与 Job 的读写方向是否一致 | pass_with_explicit_blocker | Query strict read-only，inbound marker-only / `accepted_input=false`，Job 仅 bounded scope；projection 只读 committed local truth；PF 未闭合时 `Unavailable` 不得被恢复为 `Rebuilding`/`Fresh`。 |
| duplicate、same-key conflict、in-flight 与 commit unknown 的裁决是否冲突 | pass_with_explicit_blockers | matching stable input 仅 stored replay，different input conflict；`DDD-S13-OPEN-01/02` 未闭时 in-flight/namespace 只可 fail-closed/manual，不私造 lease、TTL、cleanup、`AlreadyInProgress` 或 global raw-key index。 |
| fake / durable parity 是否被越界解释为外部成功 | pass | fake 只可证明 local key/version/staging/rollback/append/replay boundary parity；不得证明 builder、gate、Artifact、consumer、container、event、digest、report 或 readiness。 |
| TC、EV family 与 fixed report path 是否有孤儿、重复或断裂 | pass | 20 个 AC 全部回指 03 state/flow/transaction contract、05 planned TC/EV 与 `reports/runs/<run_id>/...` future path；路径与 EV 仅为计划，不是 evidence instance。 |
| P0 裁决是否被 sibling/owner pending 或实际缺证据误写为通过 | pass | MI-UP-001~009、Q-MI-001~004 与实际 delivery/run/artifact/report/EV 缺失均保留 blocked/not_evaluable；没有 actual verdict、signoff 或 readiness。 |

跨审计结论：未发现状态名漂移、phase 越界、非法转换缺设计证据路径、副作用断言遗漏或幂等/并发裁决冲突。这里的 `pass` 仅表示 Step 8 的设计闭环；它不解除任何 blocker，也不构成实际验收通过。

## 10. 回填草稿（正式 §8）

> 校准来源：  
> - `design-calibration/06_acceptance_step_08_state_tx_consistency.md`  
>
> 延伸阅读：  
> - 建议继续阅读本中间产物的“状态机范围与统一判定规则”“状态机验收门禁”“事务、版本、历史与读侧一致性门禁”“幂等、并发与重入验收门禁”“验收项停审记录”和“跨状态一致性门禁审计表”。

正式 `06-验收标准.md` 第 8 章应保留以下结论：

- 状态、事务与一致性验收覆盖 `AC-STATE-MI-001~007`、`AC-TX-MI-001~007` 与 `AC-IDEM-MI-001~006`。状态只能使用正式 03 §9 的 19 matrix / 20 个 local lifecycle subject；不设置 global lifecycle，不把 `Resolved`、`Complete`、`Buildable`、`Succeeded`、`Passed`、`Eligible`、`Available`、`Fresh` 或 `Assembled` 升格为 Artifact、consumer、runtime、container 或 readiness 成功。
- 非法 edge、terminal overwrite、history overwrite、static/live 混淆、外部 truth promotion、Query/inbound write、version drift、duplicate side effect、blind retry 与虚构 recovery 均为 P0 failure；涉及 core truth、history、external truth 或 readiness 误升格的结果须在 Step 11 按 VETO 候选复核，不能以 warning 或风险接受替代。
- 当前 10 Command 与 6 Job 在 `DDD-S9-B01/B02` 前仅可验证 zero-effect；不得 begin UoW、reserve、read/write repository、调用 adapter、写 trace/gap/freshness/result、complete、commit、创建 scheduler/run/report/evidence。10 Query 只能读取 committed local truth/view；2 条 inbound 仅返回 `accepted_input=false` marker；outbound inventory 固定为 `ImageOutboundEventInventory::NoneAuthorized`。
- 仅在相关 blocker 与 owner contract 正式关闭并重开受影响设计/验收项后，future local write 才必须按 `canonicalize -> ReadWrite UoW -> reserve -> exact Versioned<T> reads -> domain transition -> permitted local truth/trace/existing freshness -> stored result -> complete -> commit` 原子执行；任一阶段失败必须回滚所有 staged local effects，external adapter/owner response 不参与 local atomic commit。
- existing mutable object 只能使用该对象 `Versioned<T>.version` 形成 `ExpectedLocalObjectVersion::Exact`；new object 只能 `Absent`。baseline/build snapshot 不可变，trace 与 availability history append-only，repair 只能通过 new context、replacement 或 supersede；不得使用 cursor、timestamp、tag、digest、watermark、idempotency key 或 trace id 代替 version，也不得 upsert 或 last-write-wins。
- 同一 `channel + operation_name + idempotency_key` 且 matching `StableOperationInputRef` 只可读取 matching stored command/job result replay；same key different stable input 必须 conflict；shell/body 缺失或错配返回 `StoredResultMissing` / `ReplayUnavailable`，不得从 current truth、cache、adapter 或重跑合成。commit/rollback unknown、in-flight 或 namespace ambiguity 必须 fail-closed/manual consistency，禁止换 key、blind retry、compensating write、lease、TTL、cleanup、`AlreadyInProgress` 或 global raw-key index。
- `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY`、`MI-UP-001~009` 与 `Q-MI-001~004` 仍是显式 blocker；所有 TC、EV family 和 `<run_id>` report path 均为 planned contract，不表示存在实际 run、artifact、report、evidence、digest、verdict、signoff 或 readiness。

## 11. 待确认事项、自检与进入下一步条件

| 事项 | 状态 | 当前处置 / 重开条件 |
|---|---|---|
| `DDD-S9-B01` canonical input / mapper | open | 10 Command、6 Job 的 canonicalize、reserve、read/write、adapter、trace/result/commit 继续 zero-effect；需重开 03 Step 7~9 与受影响 TC/AC。 |
| `DDD-S9-B02` result ref、shell/body mapper | open | 不保存/complete reservation、不形成 replay；需先定义唯一构造与 shell/body consistency，再重开 03 Step 6~8 和 AC-TX/IDEM。 |
| `DDD-S11-B03` availability transition terminal persistence | open | 禁止 delete/reinsert/overwrite history 或 entry 代替 history；需重开 supply state/persistence/flow 与 AC-STATE-MI-004、AC-TX-MI-004。 |
| `DDD-S13-OPEN-01/02` in-flight / namespace | open | 只 fail-closed/manual consistency；不得新增 in-flight enum、lease、TTL、cleanup、global index 或 cross replay；需重开 reservation/store/recovery/fake parity。 |
| `PF-UNAVAILABLE-RECOVERY` | open | Query、cache、fake、Job 不得制造 `Unavailable -> Rebuilding/Fresh`；需定义正式 function、truth source、version/UoW 和 TC 后重开。 |
| `MI-UP-001~009`、`Q-MI-001~004` | owner-controlled pending | 外部 relation 仅 ref/adapter/gap/marker/blocked；双方正式闭口后才能重开 corresponding positive state、interface 和 acceptance lane。 |
| actual delivery / run / artifact / report / EV instance | absent by design | future actual acceptance 必须满足 Step 3/4 baseline，并以同一 `<run_id>` 的 artifact/report pair 支撑；本 Step 未创建任何实例。 |
| implementation、test execution、commit | not authorized / not performed | 不实现、不执行、不生成 evidence/run/report/digest/verdict/signoff/readiness；当前无需提交。 |

自检结论：

- 20 个状态、事务与幂等验收项均有正式契约、future pass/failure、planned TC、EV family 与 fixed report path；不存在孤儿 P0 gate。
- 状态、UoW、version、append-only、replay、Query/inbound no-write、projection direction、fake boundary 与 zero outbound 均有明确副作用失败断言。
- 19 matrix / 20 subject、10 Command、10 Query、2 marker-only inbound、6 bounded Job 与 0 outbound 的约束一致；未新造 state、route、topic、event、outbox、publisher、scheduler、physical store、recovery edge 或外部 success。
- 所有 blocker 与 owner pending 保持显式；没有把 planned TC/EV/path、fake、静态表或历史材料写成真实 evidence 或 acceptance conclusion。

进入下一步条件：

| 条件 | 状态 | 说明 |
|---|---|---|
| 状态、事务、幂等与并发门禁可裁决 | pass_with_explicit_blockers | 见第 5~7 节；正向 lane 的实际验收仍受 blocker 限制。 |
| 每个状态 / 事务 / 幂等验收项已停审 | pass_with_explicit_blockers | 见第 8 节；所有 open blocker 已逐项关联。 |
| 跨状态一致性审计无 unresolved 冲突 | pass | 见第 9 节；无设计级状态名漂移、phase 越界或裁决冲突。 |
| 可进入 Step 9 | pass | 下一步只能定义非功能验收门禁；Step 15 前不得改写正式 06。 |

```text
step_08_status = completed_stop_review
next_allowed_action = create_and_complete_step_09_nonfunctional
formal_06_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
