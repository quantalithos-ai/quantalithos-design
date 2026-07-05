# Step 8. 定义状态机、事务与一致性验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 8
> 回填章节: `06-验收标准.md` §8 状态机、事务与一致性验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 定义状态机、事务与一致性验收 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 功能门禁;Step 6 数据边界与架构红线;Step 7 接口 / 事件 / 跨仓同步;`03-详细设计.md` §8~§12;`03_ddd_step_10_state_matrix.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md`;`05-测试方案.md` §6 / §9 / §10 / §13 |
| 输出文件 | `projects/L1-artifact/design-calibration/06_acceptance_step_08_state_tx_consistency.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 9 |

## 2. 本步目标

把状态机、事务、持久化一致性、幂等、并发和恢复语义转成正式验收门禁。

本 Step 只回答:

- 哪些正式状态迁移、非法迁移和终态保护必须被证据证明。
- accepted command / consumer / job mutation 的 UoW、trace/audit/outbox/stale/result/report 顺序如何验收。
- query no-write、projection / report / job no truth repair 如何判失败。
- optimistic version、duplicate replay、commit unknown、rollback 和 race guard 如何形成验收项。
- 每个一致性门禁如何回指状态矩阵、触发 flow、测试用例、EV 和 report path。

本 Step 不填写真实执行结果,不替代 Step 10 的 evidence index 真实性审计,不替代 Step 11 的一票否决最终列表。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_05_function_gate.md` | 已完成 | 提供 AC-ART-001~020 功能失败对状态 / 事务的影响 |
| `06_acceptance_step_06_data_arch_redlines.md` | 已完成 | 提供 query/job/report 不反写真相、正文不入仓和 dependency redline |
| `06_acceptance_step_07_interfaces_events_sync.md` | 已完成 | 提供 Command / Query / Consumer / Outbound / Job 协议范围 |
| `03-详细设计.md` §8 | 已完成 | 提供 command、query、consumer、job / outbox / handoff 函数级处理模板 |
| `03-详细设计.md` §9 | 已完成 | 提供正式状态族、状态 enum 约束和 forbidden transition 规则 |
| `03-详细设计.md` §10 | 已完成 | 提供持久化、事务、outbox snapshot 和 UoW 一致性契约 |
| `03-详细设计.md` §11 | 已完成 | 提供错误、恢复、forbidden body 和 outbox failure 口径 |
| `03-详细设计.md` §12 | 已完成 | 提供幂等、duplicate replay、commit unknown 和重入保护口径 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供 truth / support / derived / replay 状态矩阵和终态保护 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 提供 version 来源、UoW 顺序、stored snapshot 和 append-only 语义 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 提供 duplicate replay、commit unknown、race guard 和 key / digest 规则 |
| `05-测试方案.md` §6 / §9 / §10 / §13 | 已完成 | 提供 `TC-ART-STATE-*`、`TC-ART-IDEMP-*`、blocking suite 和 `EV-CAND-ART-*` 证据路径 |
| `projects/L1-governance/design-calibration/06_acceptance_step_08_state_tx_consistency.md` | 已读取 | 仅作为粒度与结构参考,不复用 governance 专属语义 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些合法状态迁移必须通过? | `ArtifactFactState`、`ArtifactVersionState`、`ArtifactLineageState`、`ArtifactBaselineState`、`ArtifactDerivedFreshnessState`、`ExternalReferenceResolutionState`、`ArtifactInboundDisposition`、`ArtifactJobOutcome` 和 `ArtifactIdempotencyState` 的正式 allowed transition 必须由 `contract-domain-fast`、`service-flow-fast`、`operations-replay-core` 或 `infra-runtime-fake` 证明。 |
| 哪些非法迁移必须拒绝? | 终态回开、query/job/report/handoff 反写真相、cursor / page token 代替 version、duplicate replay 触发第二次 truth write、relay 从 current truth 现查现造、consumer/job 直接修复 core truth,都必须拒绝或保持 no-write。 |
| 哪些事务必须原子提交? | accepted command 的 truth、trace/audit/history、outbox payload snapshot、projection stale、stored result 必须在同一 UoW 内提交;consumer 的 snapshot/reference/stale/receipt,以及 job 的 marker/report/derived state,也必须遵守各自事务边界。 |
| 哪些幂等和并发行为必须成立? | same digest duplicate replay 必须读取 stored result/receipt/report;same key different digest 必须冲突;in-flight reservation 不得进入第二次 mutation;commit unknown 必须先查 idempotency / stored result / truth;relay publication 必须按 pending item version 更新。 |
| 失败时如何判定不通过? | 任一 P0 状态 / 事务门禁缺证据、状态名漂移、写路径缺 expected_version、duplicate 重跑 mutation、query / job 反写真相、outbox publisher failure 回滚 accepted truth,均不得通过。 |
| 是否存在旧状态名、口语状态名或后续 phase 状态被写入本轮验收? | 本 Step 只引用 `03-详细设计.md` §9 状态族和正式 enum 约束,不新增口语状态或后续 phase 状态。 |
| 每个状态 / 事务验收项能否回指状态矩阵、触发 flow、测试用例、证据 ID 和 report path? | 可以。见 §8.2 状态 / 事务闭环矩阵。 |
| 每个状态 / 事务验收项完成后是否通过停审? | 已按状态名、flow 范围、证据、version 来源、副作用断言和 VETO 影响停审。见 §8.4。 |
| 所有状态一致性验收项完成后是否存在状态名漂移、phase 越界、非法转换缺证据或副作用断言缺失? | 未发现 unresolved 冲突。正式验收仍需由 Step 10 证明 EV index 与 raw artifact / report pair 真实存在。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 状态 / 事务验收只写 request/decision 旧主线,缺 UoW、outbox、stored result、job report 和 query no-write | 重建为 `AC-ART-033~041` |
| Step 5 / Step 6 / Step 7 | 多个功能 / 红线失败条件引用状态和一致性,但没有集中裁决表 | 本 Step 汇总为状态、事务、幂等、并发和恢复门禁 |
| `05-测试方案.md` | `EV-CAND-ART-STATE-*` / `EV-CAND-ART-IDEMP-*` 已定义,但验收裁决尚未写 | 本 Step 将其绑定到正式 AC 和 report path |
| `03_ddd_step_10_state_matrix.md` / `03_ddd_step_11_persistence_transaction_consistency.md` / `03_ddd_step_13_concurrency_idempotency.md` | 已有正式状态、事务和幂等契约,但验收层未集中 | 本 Step 统一裁决口径 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 状态验收 | 泛化“状态正确” | 按状态族、allowed / forbidden transition、终态保护裁决 | 防止口语状态和非法转换漏验 |
| 事务验收 | 只看接口成功 | 验证 UoW 内 truth/trace/audit/outbox/stale/result/report 原子性 | 防止半提交和伪成功 |
| 幂等验收 | 重复请求不报错 | same digest replay、different digest conflict、commit unknown reconstruction | 防止 duplicate 重跑 mutation |
| 维护面验收 | job 能跑完 | job / outbox / handoff 只写 marker / report / derived state,不得修复 core truth | 防止维护面反写真相 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否给每个状态 enum 单独 AC | A. 每个 enum 单独 AC;B. 按状态族和风险聚合 | 采用 B。状态细节由 `EV-CAND-ART-STATE-*` 和状态矩阵测试展开,正式 `06` 保持可读 |
| 是否允许 query-time 修复 stale / missing projection | A. 允许;B. 禁止 | 采用 B。query 只能返回 degraded / stale / failed / missing surface |
| 是否允许 duplicate 缺 stored result 时从 current truth 重算 | A. 允许;B. 禁止 | 采用 B。缺 stored result 属一致性错误,不得重算伪 replay |
| 是否把 publisher failure 作为 accepted transaction rollback | A. rollback;B. 只标 publication failed/retry | 采用 B。accepted truth 和 publish marker 分事务 |

## 8. 结构化中间产物

### 8.1 状态与一致性验收表

| 验收项 ID | 验收主题 | 设计契约 | 测试用例 | 证据候选 ID | report path | 裁决影响 |
|---|---|---|---|---|---|---|
| AC-ART-033 | 正式状态名与合法迁移 | `03` §9;`03_ddd_step_10_state_matrix.md`;`03_ddd_step_11_persistence_transaction_consistency.md` | `TC-ART-STATE-001~003`;`TC-ART-CONTRACT-001~004` | `EV-CAND-ART-STATE-*`;`EV-CAND-ART-CONTRACT-*` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | 失败则不通过 |
| AC-ART-034 | 终态和不可原地改写保护 | `03` §9;`03_ddd_step_10_state_matrix.md`;`03_ddd_step_12_error_recovery.md` | `TC-ART-STATE-003`;`TC-ART-CMD-*` | `EV-CAND-ART-STATE-*`;`EV-CAND-ART-CMD-*` | `reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/suites/service-flow-fast.md` | 终态对象被原地 update 则不通过 |
| AC-ART-035 | accepted command transaction 原子性 | `03` §10;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_09_function_flows.md` | `TC-ART-CMD-001~016`;`TC-ART-OUTBOX-001~008`;`TC-ART-IDEMP-001~005` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-IDEMP-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | truth / trace / audit / outbox / stale / stored result 不同 UoW 则不通过 |
| AC-ART-036 | consumer / job mutation 边界 | `03` §8 / §10 / §11;`03_ddd_step_11_persistence_transaction_consistency.md` | `TC-ART-CONSUMER-001~006`;`TC-ART-JOB-001~006` | `EV-CAND-ART-CONSUMER-*`;`EV-CAND-ART-JOB-*`;`EV-CAND-ART-HANDOFF-*` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | consumer/job 写 core truth 或补真相则不通过 |
| AC-ART-037 | query no-write | `03` §8 / §14;`03_ddd_step_11_persistence_transaction_consistency.md` | `TC-ART-QUERY-001~013`;`TC-ART-IDEMP-006` | `EV-CAND-ART-QUERY-*` | `reports/runs/<run_id>/suites/service-flow-fast.md` | query 开写事务或隐式修复则不通过 |
| AC-ART-038 | duplicate replay 与 stored replay | `03` §12 / §13;`03_ddd_step_13_concurrency_idempotency.md` | `TC-ART-IDEMP-001~004`;`TC-ART-IDEMP-007` | `EV-CAND-ART-IDEMP-*` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | duplicate 产生第二次 truth 或从 current truth 重算则不通过 |
| AC-ART-039 | optimistic version 与 race guard | `03` §10 / §11 / §13;`03_ddd_step_11_persistence_transaction_consistency.md` | `TC-ART-IDEMP-002~005`;`TC-ART-CONC-*` | `EV-CAND-ART-IDEMP-*`;`EV-CAND-ART-STATE-*` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | cursor / page token / ad hoc version 覆盖已有 state 则不通过 |
| AC-ART-040 | commit unknown / rollback 恢复 | `03` §12;`03_ddd_step_12_error_recovery.md`;`03_ddd_step_13_concurrency_idempotency.md` | `TC-ART-IDEMP-004~005`;`TC-ART-IDEMP-007` | `EV-CAND-ART-IDEMP-*`;`EV-CAND-ART-JOB-*` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | commit unknown 盲写或 rollback failure 伪成功则不通过 |
| AC-ART-041 | outbox / relay publication item-level 防重 | `03` §10 / §11 / §13;`03_ddd_step_11_persistence_transaction_consistency.md` | `TC-ART-OUTBOX-001~008`;`TC-ART-RELAY-001` | `EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-RELAY-*` | `reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 从 current truth 重算 payload 或 publish failure 回滚 truth 则不通过 |

### 8.2 状态 / 事务闭环矩阵

| 验收项 ID | 状态机 / 事务契约 | 触发 flow | 测试用例 | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|---|
| AC-ART-033 | truth / support state family;formal enum only | domain transition;Command accepted flow | `TC-ART-STATE-001~003`;`TC-ART-CONTRACT-001~004` | `EV-CAND-ART-STATE-*` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | 失败则不通过 |
| AC-ART-034 | terminal / immutable guard;supersede / new fact only | Record / Supersede / retire-like reserved flow | `TC-ART-STATE-003`;`TC-ART-CMD-003~010` | `EV-CAND-ART-STATE-*`;`EV-CAND-ART-CMD-*` | `reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/suites/service-flow-fast.md` | 可能触发 VETO 候选 |
| AC-ART-035 | accepted command UoW order | 16 Command accepted transaction template | `TC-ART-CMD-001~016`;`TC-ART-OUTBOX-001~008` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-OUTBOX-*` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 失败则不通过 |
| AC-ART-036 | consumer / job mutation boundary | 6 Consumer;6 public Job | `TC-ART-CONSUMER-001~006`;`TC-ART-JOB-001~006` | `EV-CAND-ART-CONSUMER-*`;`EV-CAND-ART-JOB-*` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 可能触发 VF-ART-004 |
| AC-ART-037 | query read template no-write | 13 Query | `TC-ART-QUERY-001~013` | `EV-CAND-ART-QUERY-*` | `reports/runs/<run_id>/suites/service-flow-fast.md` | Query 写入触发 VETO 候选 |
| AC-ART-038 | stored replay / duplicate replay | Command / Consumer / Job duplicate families | `TC-ART-IDEMP-001~004`;`TC-ART-IDEMP-007` | `EV-CAND-ART-IDEMP-*` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | duplicate 重跑 mutation 不通过 |
| AC-ART-039 | expected_version on existing state | repository / projection / reference / outbox / report writes | `TC-ART-IDEMP-002~005`;`TC-ART-CONC-*` | `EV-CAND-ART-IDEMP-*`;`EV-CAND-ART-STATE-*` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | version 来源缺失不通过 |
| AC-ART-040 | commit unknown and rollback surface | fake UoW fault injection | `TC-ART-IDEMP-004~005`;`TC-ART-OUTBOX-001~008` | `EV-CAND-ART-IDEMP-*`;`EV-CAND-ART-OUTBOX-*` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 盲目重跑 accepted mutation 不通过 |
| AC-ART-041 | outbox stored snapshot publication | PublishPendingArtifactRelays / outbox publish | `TC-ART-OUTBOX-001~008`;`TC-ART-RELAY-001` | `EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-RELAY-*` | `reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | payload 现查现造或 failure rollback 不通过 |

### 8.3 一致性失败裁决表

| 失败类型 | 裁决 |
|---|---|
| 状态名不是正式 enum variant | 对应状态验收项失败;不得写入正式通过条件 |
| illegal transition accepted | 对应状态验收项失败;若改变核心 truth,进入 VETO 候选 |
| accepted truth 缺 trace / audit / outbox / stored result | 事务验收失败;不得通过 |
| Query / projection / report / job 反写 core truth | 不通过;进入 VF-ART-004 候选 |
| duplicate 重新执行 mutation | 幂等验收失败;不得风险接受为 P0 |
| expected_version 无正式来源 | 一致性验收失败;回写设计或实现后复验 |
| static report 宣称一致性 pass 但无 raw artifact | Step 10 证据门禁失败;不得引用该结果 |
| relay publish 从 current truth 现查现造 payload | 不通过;必须使用 stored payload snapshot |

### 8.4 状态 / 事务验收项停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| AC-ART-033~034 | 状态名是否来自 `03` §9 / 状态矩阵 | 通过 | 正式验收不得手写新状态名 |
| AC-ART-035 | Command transaction 是否有副作用断言 | 通过 | Step 10 继续审计 artifact / report pair |
| AC-ART-036~037 | Consumer/Job/Query 是否明确 no truth repair/no-write | 通过 | 命中时由 Step 11 纳入 VETO |
| AC-ART-038~041 | duplicate/version/commit unknown / relay snapshot 是否有正式证据 | 通过 | 真实执行时必须由 `EV-CAND-ART-IDEMP-*` / `EV-CAND-ART-RELAY-*` 支撑 |

### 8.5 跨状态一致性门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 状态名漂移 | 未发现 | 只引用正式状态族 |
| phase 越界 | 未发现 | P1/P2 durable/real-like concurrency 不写入 P0 pass |
| 非法转换缺证据 | 未发现设计层缺口 | 正式执行需 `EV-CAND-ART-STATE-*` |
| 副作用断言缺失 | 未发现 | UoW、outbox、result、report、no-write 均覆盖 |
| 幂等 / 并发裁决冲突 | 未发现 | duplicate replay 与 version conflict 口径一致 |
| relay / outbox payload 现查现造 | 未发现 | 只允 stored snapshot 发布 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_08_state_tx_consistency.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“状态与一致性验收表”“状态 / 事务闭环矩阵”“一致性失败裁决表”“状态 / 事务验收项停审记录”和“跨状态一致性门禁审计表”小节,了解状态机、事务和一致性验收如何从详细设计状态矩阵、函数流、测试证据和红线收敛。

正式 `06-验收标准.md` §8 应回填:

- 状态机、事务与一致性验收覆盖 `AC-ART-033~041`。
- 状态名必须使用 `03-详细设计.md` 正式 enum / state family,不得使用口语状态、测试状态或后续 phase 状态。
- accepted command 的 truth、trace/audit/history、outbox payload snapshot、projection stale 和 stored result 必须同一 UoW 原子提交。
- Query 必须 no-write;consumer / job / report / handoff / export 只能写 snapshot、receipt、marker、report 或 derived state,不得修复 core truth。
- duplicate replay 必须使用 stored result / receipt / report;commit unknown 必须先重建结果,不得盲目重跑 accepted mutation。
- optimistic version 必须有正式来源;cursor、page token 或 ad hoc version 不能作为写路径 version。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 真实实现是否为每个 existing-state write 暴露 version 来源 | 影响 AC-ART-039 | 本 Step 要求正式证据;若实现缺口则阻断验收 |
| `release-main-smoke` 是否包含 UoW / outbox / result 场景级断言 | 影响 AC-ART-035 的证据强度 | Step 10 继续审计 evidence index 和 suite artifact |
| 是否拆分更细 state EV | 影响 evidence 粒度 | 当前使用 `EV-CAND-ART-STATE-*`;如测试方案新增正式 EV,Step 15 可引用 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 状态和一致性门禁可裁决 | 通过 | 见 §8.1 / §8.2 |
| 状态 / 事务验收项已停审 | 通过 | 见 §8.4 |
| 跨状态一致性门禁审计没有 unresolved 冲突 | 通过 | 见 §8.5 |
| 可进入 Step 9 | 通过 | 下一步定义非功能验收门禁 |
