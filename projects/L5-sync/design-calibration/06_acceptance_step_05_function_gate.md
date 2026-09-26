# Step 5. 定义功能验收门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 5
> 回填位置：正式 `06-验收标准.md` §5

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 5 / function_gate |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 验收项范围 | `AC-SYNC-001~009`（P0 functional） |
| 下一步 | `Step 6 / boundary_gate` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 核心能力、FR/BR/AC | `00-需求文档.md` §7/§9/§10/§14 | `available` | 功能验收主语 |
| 29 objects、Commands/Queries、flows/states | `03-详细设计.md` §6～§9 | `available` | 正式设计契约 |
| 用例和计划证据 | `05-测试方案.md` §5/§6/§13 | `planned` | 只作为未来证据入口 |
| Step 2 范围、Step 4 进入/退出 | 当前 calibration | `available` | P0 gate 和 blocker 上限 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 每个 P0 功能的通过条件是什么？ | 以正式 selection/access、binding/metadata、status/materialization、conflict/recovery、handoff/provenance、posture/diagnostic contract 成立，且必要的安全负面路径和分层结果可判定。 | 00 §14；03 §7～§12 |
| 失败条件是什么？ | 缺显式选择/权限、dirty overwrite、comparator/gap unknown 仍 apply、cursor 过早推进、冲突证据丢失、ACK 升格 accepted、owner truth 被本仓修改、Query 有写副作用或 raw body/secret 泄露。 | BR-SYNC-001~025；VETO-SYNC-001~005 |
| 证据来自哪里？ | 只引用 05 已登记的 TC/EV 计划与固定 `reports/runs/<run_id>/...` 路径；当前不声称 evidence 已存在。 | 05 §5/§6/§13 |
| 哪些 P1 功能后置？ | 正向 SDK/source/access/review/probe、metadata driver、Git/fs physical integration 仅在合同闭合后进入 P1；不能替代 P0 local gate。 | 05 §2、Step 2 |
| 哪些失败会导致总体不通过？ | 任一 P0 AC 失败通常为不通过；若同时命中 VETO，绝不允许风险接受。若仅 P1 blocked 且 P0 local contract 成立，进入 residual/有条件通过候选。 | 06 SOP Step 5/11/13 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 旧主语是 SyncTask/SyncStatus | 无法回指 03 exact contract | 以 CP、object、Command/Query、state 作为验收主语 |
| 通过条件只有“同步成功” | 没有 dirty/unknown/owner/truth 分支 | 每项写 positive、negative、证据和裁决影响 |
| 用 ACK/commit/HTTP 200 证明 handoff | 越权解释外部 Review truth | 分离 candidate/attempt/transport/probe/Decision |
| 功能项未绑定 TC/EV/report | 无法复验 | 每项固定计划 ID和run-scoped path |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| AC 粒度 | 泛化功能描述 | AC-SYNC-001~009 各自有契约/TC/EV/path/裁决 | 满足可判定 |
| status/pull | 可能混成一个成功结果 | status zero-write；pull 受 source/comparator/dirty/cursor gate | 对齐 BR-008~010 |
| conflict/recovery | 失败后自动继续 | conflict fact + checkpoint + manual/probe/resume | 防 blind replay |
| handoff | 上传成功=Review 成功 | candidate freeze 与 layered handoff | 保持 Governance owner boundary |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 用一个“端到端成功”验收全部功能 | 简洁 | 无法定位红线、分层和失败影响 | 拒绝 |
| 每个命令单独作为 AC | 过细且重复，忽略能力闭环 | 维护成本高 | 拒绝 |
| 按 6 个 CP 与用户可裁决闭环分组，逐项回指命令/查询/状态/证据 | 兼顾完整性和裁决粒度 | 需要跨协议审计 | 采用 |

## 7. 结构化中间产物

### 7.1 功能验收门禁表

| 验收项 ID | 功能/场景 | 设计契约 | 通过条件 | 失败条件 | 测试用例 | 计划证据 / report path | 裁决影响 |
|---|---|---|---|---|---|---|---|
| `AC-SYNC-001` | 显式选择与访问语境 | `SyncSelection`、`AccessEvaluation`、`GetAccessEvaluation`；BR-001~004 | actor/principal、projectRef、versionRef、sourceRef、targetRef、operation 全部显式；owner/access/posture 结果可见且 Eligible 才能进入 mutation | 缺字段、默认/latest 猜测、本地 default allow、owner unknown/stale/revoked/archived/dissolved/conflicting 仍危险继续 | `TC-SYNC-MOD-001`、`TC-SYNC-PROTO-001/002`、`TC-SYNC-CMD-001`、`TC-SYNC-QRY-001` | `EV-SYNC-TRACE-001`；`reports/runs/<run_id>/evidence-index.md` | 失败则 P0 不通过；命中 VETO-005 时不可接受 |
| `AC-SYNC-002` | 来源绑定与 metadata 初始化/迁移 | `WorkingCopyBinding`、`MetadataManifest`、`CursorState`、`MappingSet`、`ProvenanceRecord`；`CloneWorkingCopy`、`MigrateSyncMetadata`、`RebindWorkingCopy` | binding 回指 source/version/target/generation/manifest/provenance；迁移建新 generation，rebind 建新 identity；protected history 保留 | 静默绑定、旧 generation 原地改写、物理/完整性未知继续、provenance 删除/伪造 | `TC-SYNC-MOD-002`、`TC-SYNC-CMD-002/003`、`TC-SYNC-PROTO-005` | `EV-SYNC-TRACE-001`、`EV-SYNC-CONFIG-001`；`reports/runs/<run_id>/...` | 失败则 P0 不通过；命中 VETO-004/005 不可接受 |
| `AC-SYNC-003` | status 与增量 materialization | `InspectWorkingCopy`、`GetSyncStatus`、`PullWorkingCopy`、`MaterializationPlan/Run`；BR-006/008~010 | status 只读并分层显示 source/local cursor、Git/fs、metadata、conflict/recovery/handoff；pull 只有 comparator/gap/path/dirty/access 全 known-safe 才 materialize；cursor 仅 Finalized 推进 | Query 写入/refresh/probe；无 comparator/gap/dirty/path unknown 仍 apply；partial/unknown 推 cursor；Git commit 当 source truth | `TC-SYNC-MOD-003`、`TC-SYNC-CMD-004`、`TC-SYNC-QRY-004`、`TC-SYNC-PROTO-005` | `EV-SYNC-FLOW-001`；`reports/runs/<run_id>/...` | 失败则 P0 不通过；自动 apply/overwrite 命中 VETO-001/005 |
| `AC-SYNC-004` | 冲突与安全恢复 | `ConflictRecord`、`RecoveryCheckpoint`、`ManualResolution`、`ProbeRecord`、`RecordConflictResolution`、`ResumeSyncOperation`、`ProbeUnknownOutcome`、`CancelSyncOperation` | conflict 保存来源、路径/映射、依据、影响和恢复关联；manual intent 与 effect 分离；unknown 先 formal probe；resume/cancel 只走 typed next action | 自动 merge/rebase/resolve、删除冲突证据、partial/unknown 直接 Finalized、同 run blind replay、用 log/telemetry 判断 effect | `TC-SYNC-MOD-004`、`TC-SYNC-CMD-005~008`、`TC-SYNC-STATE-011`、`TC-SYNC-CONSISTENCY-001` | `EV-SYNC-CONSISTENCY-001`；`reports/runs/<run_id>/...` | 失败则 P0 不通过；命中 VETO-001/004 不可接受 |
| `AC-SYNC-005` | Review candidate handoff | `ReviewCandidate`、`HandoffAttempt`、`LayeredHandoffStatus`、`PushReviewCandidate`、`RefreshReviewHandoffStatus`；BR-015/016/022/024 | candidate 在 selection/binding/generation/path/provenance 复检后 freeze；attempt/checkpoint 先于外部 call；transport、probe、Decision 分层；ACK/HTTP 200 只代表 transport | dirty/source drift/archived/unknown 仍 submit；绕过 Review Gate；ACK/remote object 当 accepted/approved/signoff；本仓创建 Decision | `TC-SYNC-MOD-005`、`TC-SYNC-CMD-009/010`、`TC-SYNC-PROTO-003` | `EV-SYNC-HANDOFF-001`；`reports/runs/<run_id>/...` | 失败则 P0 不通过；命中 VETO-002/003/005 不可接受 |
| `AC-SYNC-006` | 姿态失效、结果分层与安全诊断 | `FreshnessState`、`EligibilityOutcome`、`SyncStatusView`、`GetSyncStatus`、`GetSyncDiagnosticSummary`、Consumers/Jobs；BR-017~019/021~022 | revoked/archived/source invalidation 使本地 snapshot/evaluation/plan/candidate 收紧；cursor、Git、transport、Decision、archive posture、diagnostic 不混淆；诊断 bounded/redacted | 旧 cache 恢复 Fresh/Eligible；consumer/job 修 owner truth；diagnostic/telemetry 证明 success/readiness；raw body/secret/path/stdout 泄露 | `TC-SYNC-MOD-009`、`TC-SYNC-QRY-001`、`TC-SYNC-PROTO-004/005` | `EV-SYNC-OPS-001`、`EV-SYNC-REDACT-001`；`reports/runs/<run_id>/...` | 失败则 P0 不通过；命中 VETO-002~005 不可接受 |
| `AC-SYNC-007` | 选择/绑定/metadata 失败闭环 | FR-SYNC-001~004、BR-001~007 | 所有 validation、denied、stale、blocked、needs migration/rebind、unknown 分支有稳定结果和 next action；无 silent fallback | 通过 cache/default/旧 snapshot 猜上下文；缺 owner/source/schema 仍返回 success | `TC-SYNC-CMD-001~003`、`TC-SYNC-PROTO-001/002/005` | `EV-SYNC-TRACE-001`、`EV-SYNC-CONFIG-001`；`reports/runs/<run_id>/...` | 失败则 P0 不通过 |
| `AC-SYNC-008` | status/pull/conflict/recovery 主流程 | FR-SYNC-005~008、BR-006/008~014/024 | `status` no-write；pull 全量/增量仅在 known-safe；conflict/checkpoint/resume/probe/cancel 保留 local history 和 cursor safety | 任何隐式写、dirty overwrite、自动冲突选择、gap/unknown 继续、盲重放 | `TC-SYNC-CMD-004~008`、`TC-SYNC-QRY-004`、`TC-SYNC-STATE-011`、`TC-SYNC-CONSISTENCY-001` | `EV-SYNC-FLOW-001`、`EV-SYNC-CONSISTENCY-001`；`reports/runs/<run_id>/...` | 失败则 P0 不通过；必要时升级 VETO-001 |
| `AC-SYNC-009` | handoff/诊断/审计结果分层 | FR-SYNC-009~012、BR-015~019/022 | freeze、handoff attempt、transport ACK、probe、Decision ref、archive posture、provenance 和 diagnostic 各自可读；无正式 accepted/readiness 假象 | bypass Review Gate、ACK 升格、provenance 缺失、raw data/credential 泄露、diagnostic sink 影响业务结果 | `TC-SYNC-CMD-009/010`、`TC-SYNC-PROTO-003/004`、`TC-SYNC-REDACT-001` | `EV-SYNC-HANDOFF-001`、`EV-SYNC-OPS-001`、`EV-SYNC-REDACT-001`；`reports/runs/<run_id>/...` | 失败则 P0 不通过；VETO-002~004 不可接受 |

### 7.2 单项停审记录

| 验收项 | 设计契约/字段 | TC/EV/path | 通过/失败可判定 | 裁决 | 状态 |
|---|---|---|---|---|---|
| AC-SYNC-001 | exact selection/access/query | 已绑定 | 是 | P0；unknown fail-closed | `stop_review` |
| AC-SYNC-002 | exact binding/manifest/generation/provenance | 已绑定 | 是 | P0；physical positive blocked | `stop_review` |
| AC-SYNC-003 | status/pull/materialization/cursor | 已绑定 | 是 | P0；tool positive blocked | `stop_review` |
| AC-SYNC-004 | conflict/checkpoint/resolution/probe | 已绑定 | 是 | P0；blind replay veto | `stop_review` |
| AC-SYNC-005 | candidate/attempt/layered handoff | 已绑定 | 是 | P0；Governance positive blocked | `stop_review` |
| AC-SYNC-006 | posture/freshness/diagnostic | 已绑定 | 是 | P0；redaction required | `stop_review` |
| AC-SYNC-007 | FR-001~004 negative closure | 已绑定 | 是 | P0 | `stop_review` |
| AC-SYNC-008 | FR-005~008 flow closure | 已绑定 | 是 | P0 | `stop_review` |
| AC-SYNC-009 | FR-009~012 layered output | 已绑定 | 是 | P0 | `stop_review` |

### 7.3 跨功能门禁裁决审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| P0 AC 是否覆盖 CP1～CP6 | pass | 每个 CP 至少一个主 AC，CP3/4/5 有专属负面路径 |
| AC 是否回指正式设计契约 | pass | 使用 03 exact object/Command/Query/state 名称 |
| AC 是否回指 TC/EV/report path | pass (planned) | EV/path 仅是计划入口，真实实例待 Step 3/10 送验 |
| P1/P2 是否污染 P0 | pass | 正向 owner/tool/physical integration 与外围能力后置 |
| 证据是否存在孤儿映射 | pending until Step 10 | Step 10 做全量 evidence audit |
| VETO 覆盖是否完整 | pending until Step 11 | Step 11 做跨 VETO 审计 |

## 8. 回填草稿

正式 §5 应使用 AC-SYNC-001～009 功能门禁表：每项必须绑定正式设计契约、可复核通过条件、失败条件、TC-SYNC 计划、EV-SYNC 计划和 `reports/runs/<run_id>/...` 路径。功能失败不得写成“基本通过”；P1 正向 integration blocked/waiting 不得替代 P0 local contract；任何 VETO 命中都不能风险接受。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 真实 suite artifact/report 是否覆盖每个 EV | 当前只能定义计划闭环 | Step 10 / 正式送验 |
| owner/source/review exact contract | AC-001/002/005 的 P1 positive | blocker 解锁 |
| Git/fs physical contract | AC-003/004 的 P1 positive | blocker 解锁 |

## 10. 进入下一步条件

- [x] AC-SYNC-001~009 均有正式设计契约、通过条件、失败条件、TC、EV、report path 和裁决影响。
- [x] 每个 P0 AC 已单独停审。
- [x] 跨功能审计已记录 pending 的全局 evidence/VETO 审查点，不把它们提前宣称通过。
- [x] 正式 §5 回填草稿已形成。
- [x] 本步停审；进入 Step 6 前读取 00/01/03 data ownership/redline 和 05 architecture cut。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`。
- 功能门禁可判定但尚无真实执行证据；未填写任何 AC 实际结论。
- 下一步阅读：03 §10/§13/§14、00 §11/§10、`05_test_plan_step_03_test_objects_cuts.md`、`05_test_plan_step_10_nonfunctional.md`，创建 Step 6。
