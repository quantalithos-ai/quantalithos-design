# L0-sdk 06 验收标准 Step 8: 状态机、事务与一致性验收

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 8 中间产物。
> 本步定义状态转换、事务原子性、一致性、幂等和并发控制的验收门禁。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 8 |
| 主题 | 定义状态机、事务与一致性验收 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §8 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `03-详细设计.md` §9 / §10 / §12 / §15 | 已完成 | 提取正式状态集合、事务边界、一致性策略、幂等键和测试切口 |
| `03_ddd_step_06_object_contracts.md` | 已确认 | 作为 enum variant 和对象函数真相源 |
| `03_ddd_step_10_state_matrix.md` | 已确认 | 作为状态转换、非法迁移和跨状态门禁真相源 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已确认 | 作为 truth、projection、outbox、artifact 和 UoW 一致性真相源 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已确认 | 作为幂等键、重复调用、并发冲突和重入保护真相源 |
| `05-测试方案.md` §6 / §10 / §13 / §15 | 已完成 | 提取状态、事务、幂等、恢复和 evidence 证据来源 |
| `06_acceptance_step_05_function_gate.md` | 已确认 | 继承 F-001~F-010 的功能验收主线 |
| `06_acceptance_step_06_boundary_gate.md` | 已确认 | 继承 query / projection / runtime boundary 不写 truth 的红线 |
| `06_acceptance_step_07_interface_sync_gate.md` | 已确认 | 继承 Command / Query / Event / Job 的接口验收主语 |

---

## 3. SOP 问题回答

### 3.1 哪些合法状态迁移必须通过?

状态验收必须使用 `03` 的正式 enum variant。P0 至少覆盖以下合法迁移：

| 状态机 | 必须通过的合法迁移 | 验收关注点 |
|---|---|---|
| `SnapshotFreshnessState` | `Unknown / PendingRefresh / Stale -> Fresh`，`Fresh -> PendingRefresh / Stale`，`PendingRefresh -> Unsupported` | 只有 `Fresh` 可支撑 candidate；source 失败不写 fresh |
| `CapabilitySupportState` | `Pending -> Supported / FakeOnly / Unsupported`，`FakeOnly -> Supported`，`Unsupported -> Pending` | `FakeOnly` 可验证最小接入，但不能支撑 stable |
| `PackageCandidateStatus` | `Draft -> NotVerified / Verified / Failed / Superseded`，`NotVerified -> Verified / Failed / Superseded`，`Verified -> Stable / NotVerified / Failed / Superseded`，`Stable -> Superseded` | `Built` 不是状态；`Stable` 不是 public registry publish |
| `EvidenceResult` | `NotVerified -> Passed / Failed / Skipped`，`Passed -> Failed` | `Skipped` 不得当作 `Passed` |
| `EvidenceRedactionStatus` | `Unredacted -> Redacted` | `Redacted` 只表示安全引用，不表示验证通过 |
| `CompatibilityDecisionState` | `PendingEvidence -> Compatible / RequiresMigration / Breaking / Rejected`，`Compatible / RequiresMigration -> Breaking / Rejected` | `RequiresMigration` 必须有 `MigrationGuideRef` |
| `DeprecatedApiLifecycleState` | `Announced -> Deprecated -> PendingRemoval -> Removed`，非终态可 `Superseded` | `Removed` / `Superseded` 不得 reopen |

### 3.2 哪些非法迁移必须拒绝?

| 非法迁移 / 误用 | 必须拒绝的原因 | 失败口径 |
|---|---|---|
| `Stale` / `PendingRefresh` / `Unknown` 支撑 candidate | 派生视图未 fresh | `CandidateGateRejected`，不得创建或推进 candidate |
| `Unsupported` 直接当作 `Fresh` 或 `Supported` | 绕过范围裁剪 | `InvalidStateTransition` 或 scope validation failed |
| `FakeOnly` 支撑 production supported 或 candidate `Stable` | fake-only 不能证明正式能力 | `FakeOnlyCapabilityCannotStabilize` |
| `Built` / `Published` / `Released` 被写成 `PackageCandidateStatus` | 过程口语不是正式 enum variant | 状态名称不一致，验收不通过 |
| `PackageCandidateStatus::Rejected` 被当作 candidate 状态 | `Rejected` 只属于 `CompatibilityDecisionState` | 命名漂移，验收不通过 |
| `Skipped` 当作 `Passed` | skipped 只表示裁剪或未执行 | `EvidenceGateRejected` |
| `Redacted` 当作验证通过 | redaction 与 result 是两个维度 | `EvidenceGateRejected` |
| `Breaking` / `Rejected` compatibility 支撑 `Stable` | 兼容门禁不成立 | `CompatibilityGateRejected` |
| `RequiresMigration` 缺少 `MigrationGuideRef` | 迁移条件不完整 | validation failed |
| `Announced -> Removed` 或 `Deprecated -> Removed` | deprecated lifecycle 缺少中间阶段 | `InvalidStateTransition` |
| `Removed` / `Superseded` reopen | 终态不能重新打开 | terminal reopen rejected |
| Query / projection / runtime boundary 改写 truth 状态 | 违反只读与边界红线 | `ReadOnlyFlowStateMutationRejected` |

### 3.3 哪些事务必须原子提交?

| 事务主题 | 必须原子提交的内容 | 回滚条件 |
|---|---|---|
| semantic baseline 写入 | baseline、capability projection、outbox append、idempotency complete | validation、version conflict、projection failure、outbox append failure |
| derived view refresh | derived view、language view、version ref、freshness outbox event | source digest mismatch、derivation failure、repository conflict、outbox append failure |
| upstream changed consumer | upstream version ref、affected view stale mark、outbox append、idempotency complete | missing source ref、duplicate conflict、repository failure |
| package candidate 生成 | candidate insert、candidate generated event、idempotency complete | freshness gate failed、candidate duplicate、outbox append failure |
| validation / docs / smoke / boundary evidence | evidence insert、candidate update、projection update、outbox append | unredacted evidence、failed blocking gate、repository or outbox failure |
| compatibility decision | decision save、compatibility projection、outbox append、idempotency complete | missing evidence、missing migration ref、repository or outbox failure |
| deprecated API lifecycle | deprecated record save、outbox append、idempotency complete | illegal lifecycle、missing migration ref、version conflict |
| projection rebuild batch | projection batch replace | projection write failure；truth 不得改变 |
| outbox mark published | outbox published marker | publisher failure 不回滚 truth；mark failure 保持 retryable |

### 3.4 哪些幂等和并发行为必须成立?

| 行为 | 必须成立的规则 |
|---|---|
| Command replay | same key + same digest 返回既有 receipt，不重复写 truth / outbox |
| Command key conflict | same key + different digest 返回 `Conflict`，不得覆盖旧记录 |
| Inbound Event duplicate | same `event_id + source_ref + idempotency_key` 不重复写 view / evidence / outbox |
| Job rerun | `job_run_id` 管 run summary，target item key 管业务写入，已完成 item skip 或 replay summary |
| Candidate 多 job 并发 | build、smoke、docs、boundary、compatibility 并发更新同一 candidate 时，只有符合状态矩阵和 expected version 的写入成功 |
| Optimistic lock | 两个写事务基于同一 `ExpectedVersion` 保存同一对象时，后提交者返回 `Conflict` |
| Outbox retry | post-commit publish retry 使用同一 outbox event id / CloudEvent id，不生成新 truth |
| Projection rebuild | rebuild 只更新 projection，不反写真相；旧 projection version 不覆盖新 projection |
| Artifact orphan | artifact body 写入成功但 truth 事务失败时，artifact 不出现在 candidate truth 中 |

### 3.5 失败时如何判定不通过?

| 失败类型 | 裁决口径 |
|---|---|
| 状态名不是正式 enum variant | 不通过；如果进入代码或测试断言，必须修正设计 / 实现 |
| 合法迁移缺少测试或证据 | 对应 `AC-STATE-*` 不通过 |
| 非法迁移未被拒绝 | 对应状态门禁不通过；若造成 stable / truth 污染，进入 Step 11 一票否决候选 |
| truth、projection、outbox、idempotency 原子性破坏 | `AC-TX-*` 不通过 |
| Query / projection / runtime boundary 写 truth | 同时触发 Step 6 架构红线和本步一致性失败 |
| duplicate command / event / job 重复写入 | `AC-IDEM-*` 不通过 |
| 并发冲突覆盖旧 truth | `AC-CONC-*` 不通过 |
| outbox publish failure 回滚 truth | `AC-TX-002` 不通过 |
| artifact orphan 对外可见 | `AC-TX-004` 不通过 |

### 3.6 是否存在旧状态名、口语状态名或后续 phase 状态被写入本轮验收?

存在需要防止的漂移项：

| 漂移项 | 正确口径 |
|---|---|
| `Built` | 不是 `PackageCandidateStatus`，只表示 artifact metadata attached |
| `Published` / `Released` | 不属于 P0 candidate 状态；public registry 不作为 P0 |
| `PackageCandidateStatus::Rejected` | 不采用；candidate 失败状态按对象契约和状态矩阵为 `Failed` |
| `Redacted passed` | 不采用；必须拆成 `EvidenceResult::Passed` + `EvidenceRedactionStatus::Redacted` |
| `Completed` / `Succeeded` | 不作为正式 evidence 或 candidate 状态，必须映射到正式 enum |
| stale query auto-refresh | 不采用；Query 返回 marker，不写 truth |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 状态验收容易只写 happy path | 只验证 candidate 到 stable，不验非法迁移 | 非法状态可进入主线 | 本步拆 `AC-STATE-*` 正向和负向门禁 |
| 事务边界分散在处理流中 | application service、repository、outbox、projection 分散说明 | 实现漏掉同事务副作用 | 本步形成 `AC-TX-*` 原子性门禁 |
| 幂等与并发容易被当实现细节 | command replay、event duplicate、job rerun 没进入验收 | 重复执行污染 truth | 本步形成 `AC-IDEM-*` / `AC-CONC-*` 门禁 |
| outbox append 与 publish 容易混淆 | publish failure 可能被误认为要回滚 truth | post-commit 语义错误 | 本步明确 append 同事务，publish 后置重试 |
| candidate 状态名存在局部漂移风险 | 正式摘要可能把 candidate failure 写成 `Rejected` | 实现 agent 可能无法 1:1 对齐对象契约 | 本步固定 candidate 使用 `Failed`，`Rejected` 只属于 compatibility |
| artifact 与 truth 一致性容易被忽略 | artifact body 先写 store，truth 失败后可能残留 | orphan artifact 被误认为候选产物 | 本步要求 orphan 不可见 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 状态验收 | 泛称状态机正确 | 按 7 个正式状态集合分别裁决 | 可定位 |
| 非法迁移 | 分散在详细设计和测试方案 | 明确列出必须拒绝的迁移和误用 | 可执行 |
| 事务原子性 | 写在处理流中 | 转成 `AC-TX-*` 验收门禁 | 可验收 |
| 幂等并发 | 被当作实现约束 | 转成 `AC-IDEM-*` / `AC-CONC-*` 门禁 | 防重复副作用 |
| 证据来源 | 泛称测试通过 | 回指 `TC-SDK-*`、`SPECIAL-SDK-*` 和 `EV-SDK-*` | 可追溯 |
| 状态命名 | 可能混入口语状态 | 明确禁止 `Built`、candidate `Rejected`、`Published` 等漂移 | 防实现冲突 |

---

## 6. 验收设计取舍

### 6.1 是否按每个状态机单独生成验收项

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个状态机单独验收 | 失败定位清楚 | 表格较长 | 采用 |
| B. 只写一个“状态机全部通过” | 文档短 | 无法定位具体状态漂移 | 不采用 |
| C. 只验 candidate 状态机 | 贴近发布主线 | 漏掉 freshness、evidence、compatibility 和 deprecated | 不采用 |

### 6.2 是否把 outbox publish 放入 command 事务

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. publish 在 command 事务内 | 看似强一致 | 外部发布失败会污染本地 truth 事务 | 不采用 |
| B. append 与 truth 同事务，publish 在 commit 后重试 | 符合 outbox 模式 | 需要单独验 retry | 采用 |
| C. 不验 outbox | 简单 | 已提交事实不可传播 | 不采用 |

### 6.3 是否允许自动重试覆盖并发冲突

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. Command 自动覆盖重试 | 调用方简单 | 可能静默覆盖旧 truth | 不采用 |
| B. Command 返回 `Conflict`，job item 可有限 retry / skip | 明确且可审计 | 调用方需要处理冲突 | 采用 |
| C. 全部忽略重复 | 实现简单 | 幂等语义不成立 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 状态与一致性验收表

| 验收项 ID | 主题 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-STATE-001 | `SnapshotFreshnessState` | `Fresh / PendingRefresh / Stale / Unsupported / Unknown` 合法迁移成立；只有 `Fresh` 支撑 candidate | stale / unknown / unsupported 被当 fresh；source failure 写 view | `TC-SDK-CONTRACT-*`、`EV-SDK-CONTRACT-001` |
| AC-STATE-002 | `CapabilitySupportState` | `Supported / FakeOnly / Pending / Unsupported` 门禁成立；`FakeOnly` 保留 marker | fake-only 支撑 production supported 或 stable；unsupported 仍执行 | `TC-SDK-BOUNDARY-*`、`EV-SDK-BOUNDARY-001` |
| AC-STATE-003 | `PackageCandidateStatus` | `Draft -> NotVerified -> Verified -> Stable` 主线和 `Failed / Superseded` 分支合法；`Built` 不是状态 | `Built` / `Published` / candidate `Rejected` 被写成状态；未验证进入 stable | `TC-SDK-CANDIDATE-*`、`EV-SDK-CANDIDATE-001` |
| AC-STATE-004 | `EvidenceResult` + `EvidenceRedactionStatus` | 只有 `Passed + Redacted` 支撑 verified / stable | `Skipped`、`Failed`、`NotVerified` 或 `Unredacted` 支撑 gate | `TC-SDK-SECURITY-003`、`TC-SDK-SMOKE-*`、`EV-SDK-SMOKE-001` |
| AC-STATE-005 | `CompatibilityDecisionState` | `Compatible` 或 `RequiresMigration + MigrationGuideRef` 可进入 stable；`Breaking / Rejected` 阻断 | missing migration ref；breaking / rejected 进入 stable | `TC-SDK-COMPAT-*`、`EV-SDK-COMPAT-001` |
| AC-STATE-006 | `DeprecatedApiLifecycleState` | `Announced -> Deprecated -> PendingRemoval -> Removed` 合法；终态只读 | 直接 removed；removed / superseded reopen；静默移除 | `TC-SDK-COMPAT-004`、`EV-SDK-COMPAT-001` |
| AC-TX-001 | 写路径 UoW 原子性 | truth、required projection、outbox append、idempotency complete 同事务成功或同事务回滚 | projection / outbox append 失败后 truth 仍提交；idempotency 与业务结果不一致 | `SPECIAL-SDK-CONSISTENCY-001`、`EV-SDK-CONSISTENCY-001` |
| AC-TX-002 | outbox append 与 publish 一致性 | append 与 truth 同事务；publish post-commit；publish failure 保持 pending / retryable | publish failure 回滚 truth；retry 生成新 truth 或新 event identity | `SPECIAL-SDK-RECOVERY-001`、outbox retry evidence |
| AC-TX-003 | Query / projection 只读一致性 | Query 不开写事务；projection rebuild 不写 truth；stale 返回 marker | Query 自动 refresh；projection 反写 baseline、view、candidate 或 evidence | `SPECIAL-SDK-CONSISTENCY-001`、projection rebuild evidence |
| AC-TX-004 | artifact metadata 一致性 | artifact body digest verified 后，truth 只保存 ref / digest；truth failure 时 orphan 不可见 | digest 失败仍 attach；orphan artifact 出现在 candidate view | `TC-SDK-CANDIDATE-002`、`SPECIAL-SDK-RECOVERY-001` |
| AC-IDEM-001 | Command 幂等 | same key + same digest replay receipt；same key + different digest conflict | 重放重复写 truth / outbox；key 冲突覆盖旧记录 | `SPECIAL-SDK-IDEMPOTENCY-001`、`EV-SDK-IDEMPOTENCY-001` |
| AC-IDEM-002 | Event / Job 幂等 | duplicate event skip；job rerun 按 item key skip / replay；partial failure 可恢复 | duplicate event 写第二份 truth；job rerun 重复写 evidence / candidate | `TC-SDK-CONTRACT-003`、`SPECIAL-SDK-IDEMPOTENCY-001` |
| AC-CONC-001 | 乐观锁和 expected version | 同资源并发写只允许一个 expected version 成功，后提交者 `Conflict` | 后提交者覆盖旧 truth；version conflict 被吞掉 | `candidate_jobs_race_on_expected_version`、nightly concurrency evidence |
| AC-CONC-002 | candidate 多 job 并发 | build、smoke、docs、boundary、compatibility 并发时，candidate 状态只按矩阵推进 | jobs 竞态导致非法 stable、failed evidence 被覆盖或 skipped 当 passed | `SPECIAL-SDK-IDEMPOTENCY-001`、`EV-SDK-CANDIDATE-001` |

### 7.2 状态、事务与幂等验收图

图类型: 状态与一致性验收图

图标题: L0-sdk P0 状态、事务和幂等验收链

```text
Command / Event / Job item
  |
  | validate metadata + idempotency key + digest
  v
Idempotency reservation
  |-- same key + same digest ------> replay receipt
  |-- same key + different digest -> Conflict
  v
UnitOfWork
  |
  | get_for_update + expected_version
  v
Domain state transition
  |
  | legal enum transition only
  v
truth + required projection + outbox append
  |
  | commit succeeds
  v
receipt / evidence / outbox event ref
  |
  | post-commit
  v
outbox publish retry boundary
```

关键说明:

- 幂等先于 domain mutation。
- 状态迁移必须使用正式 enum variant。
- outbox append 属于写事务，publish 不属于写事务。
- Query、projection rebuild 和 runtime boundary 不进入 truth 写事务。

### 7.3 状态命名防漂移表

| 禁止名称 | 禁止原因 | 正确表达 |
|---|---|---|
| `Built` | 不是 `PackageCandidateStatus` | artifact metadata attached，candidate 保持 `Draft` 或进入 `NotVerified` |
| `Published` / `Released` | public registry 不在 P0 状态机内 | `PackageCandidateStatus::Stable` 仅表示本地稳定基线 |
| candidate `Rejected` | 不属于 candidate enum | candidate failure 用 `Failed`；compatibility rejection 用 `CompatibilityDecisionState::Rejected` |
| `redacted passed` | 混合两个状态维度 | `EvidenceResult::Passed` + `EvidenceRedactionStatus::Redacted` |
| `completed` / `succeeded` | 过程口语 | 映射到正式 result、decision 或 receipt 字段 |
| `stale fixed by query` | Query 不写 truth | stale marker + refresh command / job |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_08_state_tx_consistency.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“状态与一致性验收表”“状态、事务与幂等验收图”和“状态命名防漂移表”小节,了解本章如何把详细设计状态矩阵、事务契约和幂等规则转换为可裁决验收门禁。

L0-sdk 的状态机、事务与一致性验收以 `AC-STATE-001`~`AC-STATE-006`、`AC-TX-001`~`AC-TX-004`、`AC-IDEM-001`~`AC-IDEM-002` 和 `AC-CONC-001`~`AC-CONC-002` 为裁决入口。所有状态名必须使用 `03-详细设计.md` 和 `design-calibration/03_ddd_step_06_object_contracts.md` / `03_ddd_step_10_state_matrix.md` 中的正式 enum variant。

状态验收必须证明合法迁移可执行，非法迁移被拒绝。`Built`、`Published`、`Released`、candidate `Rejected`、`completed`、`succeeded` 等口语或后续阶段名称不得作为本轮正式状态。`Rejected` 只属于 `CompatibilityDecisionState`，candidate 验证失败使用 `PackageCandidateStatus::Failed`。

事务验收必须证明写路径的 truth、required projection、outbox append 和 idempotency complete 要么同事务成功，要么同事务回滚。Outbox publish 是提交后的重试边界，publish failure 不得回滚已提交 truth。Query、projection rebuild 和 runtime boundary call 不得写 SDK truth。

幂等和并发验收必须证明 Command replay、Command key conflict、duplicate inbound event、job rerun、candidate 多 job 并发、optimistic lock、outbox retry、projection rebuild 和 artifact orphan 场景均符合详细设计契约。

---

## 9. 待确认事项

当前没有阻塞进入 Step 9 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否按每个状态机拆验收项 | A. 拆；B. 合成一条；C. 只验 candidate | 采用 A | 失败定位更清楚，能覆盖 freshness、evidence、compatibility 和 deprecated |
| outbox publish 是否进入写事务 | A. 进入；B. append 同事务、publish 后置；C. 不验 outbox | 采用 B | 与 `03` outbox 一致性契约一致 |
| candidate 失败状态使用 `Failed` 还是 `Rejected` | A. `Failed`；B. `Rejected`；C. 二者并存 | 采用 A | 对象契约和状态矩阵均使用 `Failed`；`Rejected` 已用于 compatibility decision |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 合法状态迁移已有验收门禁 | 已满足 |
| 非法状态迁移已有拒绝口径 | 已满足 |
| 事务原子性已有副作用断言 | 已满足 |
| outbox append / publish 边界已区分 | 已满足 |
| Query / projection / runtime boundary 只读一致性已定义 | 已满足 |
| Command / Event / Job 幂等和重复调用处理已定义 | 已满足 |
| 并发冲突和 expected version 验收已定义 | 已满足 |
| 旧状态名、口语状态名和后续 phase 状态已列入防漂移表 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 9,定义非功能验收门禁。
