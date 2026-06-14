# Step 8. 定义状态机、事务与一致性验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 8
> 回填章节: `06-验收标准.md` §8 状态机、事务与一致性验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 定义状态机、事务与一致性验收 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~7 已审核通过;新版 `03` state matrix / transaction / idempotency、`05` consistency / idempotency / recovery evidence |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_08_state_tx_consistency.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 9 |

## 2. 本步目标

把正式状态矩阵、函数级事务顺序、持久化一致性、幂等重放、并发控制和 fake / durable parity 转成可裁决的验收门禁。

本 Step 只定义状态、事务与一致性验收:

- formal state enum / state value 的合法迁移、非法迁移和 owner 边界。
- command / consumer / callback / job 的 same-UoW 原子提交和 rollback 断言。
- query no-write、job no-repair、outbox / handoff failure isolation。
- stored command result、consumer / callback receipt、job report duplicate replay。
- optimistic version、truth cursor、projection cursor、reference bundle version、idempotency key 和 request digest 的分离。
- fake / durable adapter 在 version、unique、append、cursor、stored replay、projection lookup、reference bundle、outbox/handoff state、entry facade 上的等价语义。

错误恢复 public mapping 留 Step 12;风险接受留 Step 13;证据完整性留 Step 10;VETO 最终裁决留 Step 11。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_06_boundary_gate.md` | 已审核通过 | 提供 query no-write、job no-repair、body-free、P0 redline |
| `06_acceptance_step_07_interface_sync_gate.md` | 已审核通过 | 提供 command/query/event/job surface 与 replay surface |
| `03_ddd_step_09_function_flows.md` | 已审核通过 | 提供 write path order、query no-write、stored replay、outbox/handoff/job flow |
| `03_ddd_step_10_state_matrix.md` | 已审核通过 | 提供正式状态机 inventory、terminal/reopen、forbidden transition、version/cursor/key separation |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已审核通过 | 提供 UoW、expected_version、same-UoW replay writes、eventual consistency、fake/durable parity |
| `03_ddd_step_13_concurrency_idempotency.md` | 已审核通过 | 提供 concurrency resource、key/digest、duplicate / in-flight / commit unknown / reentry 规则 |
| `05-测试方案.md` §6 / §10 / §13 | 正式输入 | 提供 `TC-ID-STATE-*`、`TC-ID-IDEMP-*`、fault / recovery cases、formal `EV-ID-*` 和 report path |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些合法状态迁移必须通过? | 业务 truth、source/reference、read/visibility、projection/reference/report、outbox/handoff、idempotency/stored result/job report、runtime/entry 技术状态均必须按 `03` Step 10 正式 state owner 和 allowed transition 成立。 |
| 哪些非法迁移必须拒绝? | query write、job truth repair、Published 当 downstream consumed、Delivered without receipt、duplicate rerun、stored replay missing 后重算、entry pre-dispatch 写 business result、adapter fake success、opaque ref 推断状态、body persistence 均必须失败。 |
| 哪些事务必须原子提交? | command accepted、consumer accepted、callback accepted、job mutation path 必须按 Step 9/11 顺序在同一 UoW 中保存 truth/marker、trace/audit/outbox/stale、stored result/receipt/report 和 idempotency complete。 |
| 哪些幂等和并发行为必须成立? | same key / same digest replay stored surface;different digest conflict;stored missing / wrong kind 不重跑;commit unknown retry 先查 idempotency/stored/truth;version conflict 不覆盖;terminal retry guard 成立。 |
| 失败时如何判定不通过? | P0 状态 / 事务 / 幂等门禁失败导致不通过;若同时触发 implicit create、job repair truth、dependency loop、forbidden body 或 duplicate rerun mutation,在 Step 11 升级一票否决裁决。 |
| 是否存在旧状态名或后续 phase 状态被写入本轮? | 本 Step 仅使用 `03` Step 10 state inventory 和 formal state kind;不写旧 API / job / projection 名,不引入后续 product adapter 状态。 |
| 每个验收项能否回指状态矩阵、触发 flow、测试用例、证据 ID 和 report path? | 本 Step 在闭环表中为 `AC-STATE-*`、`AC-TX-*`、`AC-IDEM-*`、`AC-CONC-*` 绑定状态 / 事务契约、触发 flow、TC、EV、report path 和裁决影响。 |
| 每个状态 / 事务验收项完成后是否停审? | 本 Step 为所有验收项建立停审记录。 |
| 是否存在状态名漂移、phase 越界、非法转换缺证据或副作用断言缺失? | 初步审计结论为无 unresolved 冲突。public error mapping、证据完整性和一票否决由后续 Step 再审。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 状态与事务按旧对象和旧 job 口径写,且缺 stored replay / cursor / fake parity | 新版使用 `03` Step 10/11/13 formal state / transaction / idempotency 口径 |
| `03` Step 10 | 状态矩阵内容很大 | 本 Step 不复刻矩阵,只抽验收裁决门禁和闭环证据 |
| `03` Step 11 | 持久化语义与状态矩阵相互依赖 | 本 Step 用 transaction / consistency gates 串联 state owner、UoW、version 和 replay |
| `03` Step 13 | 幂等矩阵包含 error mapping / in-flight priority | 本 Step 只验 replay no-rerun 和 key/digest 分离;public mapping 留 Step 12 |
| `05` §10 | NFR 中也覆盖 consistency / recovery | 本 Step 只抽 P0 状态事务一致性;性能 / 可用性 sample 留 Step 9 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 状态验收 | 旧草案按历史 lifecycle / projection 表达 | 新版按 formal state owner 与 forbidden transition 表达 | 防止状态名漂移 |
| 事务验收 | 旧草案泛写事务一致 | 新版按 command / consumer / callback / job / query path 明确副作用断言 | 可复验 |
| 幂等验收 | 旧草案只看 key replay | 新版要求 stored result / receipt / report replay,missing no recompute | 阻止 duplicate rerun |
| 并发验收 | 旧草案缺 version/cursor/key 分离 | 新版显式验 optimistic version、cursor、key、digest 不互换 | 避免 1:1 落码 blocker |
| fake parity | 旧草案未验 fake/durable 同构 | 新版把 fake private map、default success、direct entry bypass 写成失败条件 | 保证证据可信 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否把每个状态 enum variant 逐行写入验收标准 | A. 是;B. 用 owner / family 门禁聚合,细节回指 `03` Step 10 | 采用 B。验收章保持裁决粒度。 |
| 是否把 public error mapping 写入本 Step | A. 写入;B. 只验 invalid transition / conflict / replay failure 不产生副作用,public mapping 留 Step 12 | 采用 B。符合设计分工。 |
| 是否把 nightly extended fault 全部作为 P0 必过 | A. 是;B. P0 使用 core suite,extended 留非阻断或后续风险 | 采用 B。验收不扩大 `05` 既定 P0 边界。 |
| 是否把 fake 测试专用直连 store 视为可接受 | A. 可接受;B. 不可接受 | 采用 B。fake 必须经同一 facade / port surface。 |

## 8. 结构化中间产物

### 8.1 状态与一致性验收表

| 验收项 ID | 主题 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| `AC-STATE-001` | business truth and source state legality | `IdentityAnchorState`、`GlobalLifecycleState`、role/source、career、memory state 只由正式 command / consumer / callback owner 推进;非法转换 rejected / conflict 且无 accepted side effect | 状态名漂移;query/job 推进 business truth;terminal member ref 被释放或复用;source unavailable 被默认写成 active summary | `EV-ID-STATE-001`;`EV-ID-CMD-001`;`EV-ID-CONSUMER-001` |
| `AC-STATE-002` | read / projection / reference / report state boundary | read surface 只表达 visible/redacted/not-visible/degraded/stale/missing/empty;projection/reference/report 由 accepted stale marker 或 maintenance job 推进;reconciliation report-only | query rebuild / refresh / report generation;projection/reference/report 修 core truth;source version 当 optimistic version | `EV-ID-QUERY-001`;`EV-ID-STATE-001`;`EV-ID-JOB-001` |
| `AC-STATE-003` | outbox / handoff propagation state boundary | `Published` 只代表 outbound boundary;`Delivered` 必须有 formal attempt + receipt;only `RetryableFailed` 可由 retry job 选择;terminal state 不直接 reopen | Published 当 downstream consumed;HTTP 2xx / request sent / adapter ok 标记 Delivered;retry terminal Failed / Cancelled / Delivered / SkippedByPolicy | `EV-ID-OUTBOX-001`;`EV-ID-JOB-001`;`EV-ID-IDEMP-001` |
| `AC-TX-001` | command accepted same-UoW atomicity | accepted command 同一 UoW 完成 reserve、versioned load/save、truth cursor、trace/audit/outbox/projection stale、effect/stored result、idempotency complete、commit | accepted side effect outside UoW;stored result 缺失仍 complete;outbox/stale/save failure 后 truth 可见;version conflict 覆盖 | `EV-ID-CMD-001`;`EV-ID-IDEMP-001` |
| `AC-TX-002` | consumer / callback receipt transaction | accepted consumer/callback 同一 UoW 完成 envelope validation、versioned target/reference save、marker cursor、trace/outbox/stale、typed receipt envelope、stored shell、complete | unsupported schema parse unsafe payload;receipt 未存却 complete;callback delivered without receipt;duplicate callback 重写 state | `EV-ID-CONSUMER-001`;`EV-ID-IDEMP-001` |
| `AC-TX-003` | operations job mutation and report transaction | job 经 application service reserve,只更新 projection/reference/report/outbox/handoff/report surface;保存 replayable item refs 后 complete;partial / failed 保留 safe issue refs | job runner 直连 store;job 修 core truth;report 缺 item refs;duplicate job 重扫 pending/stale/retryable store | `EV-ID-JOB-001`;`EV-ID-IDEMP-001` |
| `AC-TX-004` | query no-write transaction boundary | query 不开启写 UoW、不 reserve idempotency、不保存 stored result、不 append trace/audit、不 mutate projection/reference/report/outbox/handoff | query missing/stale 时创建 truth、rebuild view、refresh resolver、mark fresh、publish/deliver/retry 或写 audit | `EV-ID-QUERY-001`;`EV-ID-STATE-001` |
| `AC-IDEM-001` | stored replay for command / consumer / callback / job | same key / same digest duplicate 只 replay stored command result、typed receipt 或 job report;duplicate 不重跑 mutation/resolver/publisher/handoff/job body | duplicate reload current truth 拼 response;stored missing 后重算;consumer/callback 重 parse payload;job duplicate relist store | `EV-ID-IDEMP-001`;`EV-ID-CMD-001`;`EV-ID-CONSUMER-001`;`EV-ID-JOB-001` |
| `AC-IDEM-002` | idempotency key / digest separation | command、consumer/callback、job key 来自正式 metadata/envelope/job request;digest 只含 stable body-free material;不同 channel / operation namespace 隔离 | 用 timestamp、cursor、job_run_ref、source version、route string 或 raw body hash 充当 key/digest;同 key不同 digest 覆盖原 result | `EV-ID-IDEMP-001`;`EV-ID-CONTRACT-001` |
| `AC-IDEM-003` | commit unknown / stored missing recovery no-rerun | commit unknown retry 先查 idempotency / stored surface / truth before action;stored missing / wrong kind 暴露 error/degraded surface,不得重跑 | blind second write;operator retry 创建第二 truth/outbox/receipt/report;stored missing 被 current truth reconstruction 掩盖 | `EV-ID-IDEMP-001`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` |
| `AC-CONC-001` | optimistic version and cursor separation | mutable updates 使用 loaded `IdentityVersion`;truth cursor、projection cursor、reference expected version、source version、job cursor、page cursor、idempotency key 各自来源清晰 | source version / timestamp / page cursor / idempotency key 当 expected_version 或 projection cursor;stale update 覆盖 newer state | `EV-ID-IDEMP-001`;`EV-ID-JOB-001` |
| `AC-CONC-002` | projection / reference eventual consistency and race guard | accepted stale marker 与 projection dependency index 同 UoW;rebuild race 保留 newer state;reference refresh 使用 same bundle version,失败保留 last good snapshot | query 构造 view ref;fake 扫字符串补 lookup;older rebuild 覆盖 newer view;resolver failure 删除 last good snapshot | `EV-ID-JOB-001`;`EV-ID-IDEMP-001`;`EV-ID-QUERY-001` |
| `AC-CONC-003` | fake / durable parity for consistency | fake 与 durable 在 version、unique、append ordering、cursor visibility、stored replay、projection lookup、reference bundle、outbox/handoff state、entry facade、body-free guard 上等价 | fake 私有 map、默认 success、direct store entry、rolled-back cursor visible、fake delivered/published、raw-body side store | `EV-ID-IDEMP-001`;`EV-ID-CONTRACT-001`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` |

### 8.2 状态 / 事务 / 证据闭环表

| 验收项 ID | 状态机 / 事务契约 | 触发 flow | 测试用例 | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|---|
| `AC-STATE-001` | `IdentityAnchorState`;`GlobalLifecycleState`;`RoleCapabilitySummaryStateKind`;`CareerRecordStateKind`;`MemoryReferenceStateKind`;Step 10 trigger owner / terminal audit | `EstablishGlobalMemberFlow`;`UpdateGlobalLifecycleStateFlow`;role/career/memory command and consumer flows | `TC-ID-DOMAIN-*`;`TC-ID-STATE-*`;`TC-ID-CMD-001~012`;`TC-ID-CONSUMER-001~005` | `EV-ID-STATE-001`;`EV-ID-CMD-001`;`EV-ID-CONSUMER-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 状态非法 accepted 导致不通过;ref reuse / high-risk missing basis 进入 Step 11 |
| `AC-STATE-002` | `IdentityReadDispositionKind`;`ProjectionStateKind`;`ReferenceResolutionStateKind`;`ReconciliationReportStateKind`;query no-write / report-only | all query flows;`RebuildIdentityProjectionFlow`;`RefreshExternalReferenceStateFlow`;`RunIdentityReconciliationFlow` | `TC-ID-QUERY-003~015`;`TC-ID-STATE-001`;`TC-ID-JOB-001~003`;`TC-ID-JOB-008` | `EV-ID-QUERY-001`;`EV-ID-STATE-001`;`EV-ID-JOB-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | query write / job repair truth 进入 Step 11 |
| `AC-STATE-003` | `OutboxStateKind`;`HandoffStateKind`;Published / Delivered / terminal retry guard | `PublishIdentityOutboxFlow`;`DeliverTraceHandoffFlow`;`RetryIdentityPropagationFailuresFlow`;`HandleTraceHandoffResultFlow` | `TC-ID-OUTBOX-009~010`;`TC-ID-JOB-004~005`;`TC-ID-STATE-002`;`TC-ID-IDEMP-010` | `EV-ID-OUTBOX-001`;`EV-ID-JOB-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` | fake delivered / terminal retry 导致不通过 |
| `AC-TX-001` | command accepted UoW order from Step 9 / Step 11 | 6 command flows | `TC-ID-CMD-013~015`;`TC-ID-IDEMP-006~007` | `EV-ID-CMD-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` | accepted transaction partial commit 导致不通过 |
| `AC-TX-002` | consumer/callback receipt same-UoW transaction | 5 consumer/callback flows | `TC-ID-CONSUMER-001~006`;`TC-ID-IDEMP-003`;`TC-ID-IDEMP-010` | `EV-ID-CONSUMER-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` | missing receipt replay 或 callback body persistence 导致不通过 |
| `AC-TX-003` | job mutation path and replayable report transaction | 6 operations job flows | `TC-ID-JOB-001~008`;`TC-ID-IDEMP-004` | `EV-ID-JOB-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | no report replay / job repair truth 导致不通过 |
| `AC-TX-004` | query no-write transaction boundary | 14 query flows | `TC-ID-QUERY-001~015`;`TC-ID-STATE-001` | `EV-ID-QUERY-001`;`EV-ID-STATE-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | query write 进入 Step 11 |
| `AC-IDEM-001` | stored replay source by family | command / consumer / callback / job duplicate paths | `TC-ID-CMD-013`;`TC-ID-IDEMP-002~004`;`TC-ID-JOB-006` | `EV-ID-IDEMP-001`;`EV-ID-CMD-001`;`EV-ID-CONSUMER-001`;`EV-ID-JOB-001` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | duplicate rerun mutation 导致不通过或 Step 11 |
| `AC-IDEM-002` | key / digest namespace and stable body-free digest | command metadata;inbound envelope;job request | `TC-ID-IDEMP-001`;`TC-ID-CMD-014`;`TC-ID-CONTRACT-002` | `EV-ID-IDEMP-001`;`EV-ID-CONTRACT-001` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | key/digest source 漂移阻断验收 |
| `AC-IDEM-003` | commit unknown / stored missing no-rerun | command / consumer / job retry paths | `TC-ID-IDEMP-002`;`TC-ID-IDEMP-005`;`TC-ID-IDEMP-011` | `EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | blind retry / recompute result 导致不通过 |
| `AC-CONC-001` | version / cursor / key separation | all mutable save / job cursor / reference refresh paths | `TC-ID-CMD-015`;`TC-ID-JOB-002`;`TC-ID-IDEMP-008~009` | `EV-ID-IDEMP-001`;`EV-ID-JOB-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | stale overwrite 或 cursor 混用导致不通过 |
| `AC-CONC-002` | projection / reference eventual consistency | accepted stale marker;projection rebuild;reference refresh | `TC-ID-QUERY-006`;`TC-ID-JOB-001~002`;`TC-ID-IDEMP-008~009` | `EV-ID-QUERY-001`;`EV-ID-JOB-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | private lookup / last good snapshot loss 导致不通过 |
| `AC-CONC-003` | fake / durable consistency parity | fake runtime / controlled adapter paths | `TC-ID-IDEMP-*`;`TC-ID-CONTRACT-*`;affected job / query cases | `EV-ID-IDEMP-001`;`EV-ID-CONTRACT-001` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | fake-only success 或 direct store test 阻断证据可信度 |

### 8.3 状态 / 事务验收项停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `AC-STATE-001` | state names、owner、trigger flow、TC / EV | 通过 | public error mapping 留 Step 12 |
| `AC-STATE-002` | read / projection / reference / report no-write / no-repair | 通过 | evidence completeness 留 Step 10 |
| `AC-STATE-003` | outbox / handoff terminal and receipt guard | 通过 | retry schedule 留配置 / 后续实施 |
| `AC-TX-001` | command same-UoW and rollback side effect | 通过 | durable isolation implementation 不在验收正文展开 |
| `AC-TX-002` | consumer / callback receipt transaction | 通过 | outcome priority 留 Step 12 |
| `AC-TX-003` | job report transaction and no truth repair | 通过 | report artifact completeness 留 Step 10 |
| `AC-TX-004` | query zero-write boundary | 通过 | write-audit evidence 完整性留 Step 10 |
| `AC-IDEM-001` | stored replay source by family | 通过 | stored missing public wording 留 Step 12 |
| `AC-IDEM-002` | key / digest namespace and body-free material | 通过 | digest algorithm binding 留配置 / Step 13 residual |
| `AC-IDEM-003` | commit unknown / stored missing no rerun | 通过 | manual recovery wording 留 Step 12 |
| `AC-CONC-001` | version/cursor/key separation | 通过 | DDL/index detail 不进入验收正文 |
| `AC-CONC-002` | projection/reference race and eventual consistency | 通过 | extended race suite 是否必跑留 Step 9/13 |
| `AC-CONC-003` | fake/durable parity | 通过 | fake evidence completeness 留 Step 10 |

### 8.4 跨状态一致性门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否覆盖 business truth 状态 | 通过 | `AC-STATE-001` |
| 是否覆盖 read / projection / reference / report 状态 | 通过 | `AC-STATE-002` |
| 是否覆盖 outbox / handoff propagation 状态 | 通过 | `AC-STATE-003` |
| 是否覆盖 command / consumer / callback / job transaction order | 通过 | `AC-TX-001~003` |
| 是否覆盖 query no-write transaction boundary | 通过 | `AC-TX-004` |
| 是否覆盖 stored replay / duplicate no-rerun | 通过 | `AC-IDEM-001~003` |
| 是否覆盖 optimistic version、cursor、key、digest 分离 | 通过 | `AC-CONC-001` |
| 是否覆盖 eventual consistency and race guard | 通过 | `AC-CONC-002` |
| 是否覆盖 fake/durable parity | 通过 | `AC-CONC-003` |
| 是否存在状态名漂移或旧状态名 | 通过 | 全部回指 `03` Step 10 |
| 是否提前替代 Step 10 / 11 / 12 / 13 | 通过 | 本 Step 只定义验收裁决,不新增状态/port/schema |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 状态机、事务与一致性验收足够进入 Step 9 | 否 | state / tx / idem gate 闭合 | 无需回写 |
| `05` 中 nightly / extended fault injection 不全部作为 P0 必过 | 否 | P0 vs extended evidence 边界 | Step 9/13 可再确认 residual |
| 若 Step 10 发现 artifact/report pairing 缺失 | 是 | 证据门禁缺口 | Step 10 阻断 |
| 若 Step 11 确认 query write、job repair truth、duplicate rerun mutation | 是 | 一票否决影响 | Step 11 / Step 14 不得通过 |
| 若 Step 12 需要新增 public error / stored result kind | 是 | 设计闭环缺口 | 回对应 `03` Step 修正 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_08_state_tx_consistency.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“状态与一致性验收表”“状态 / 事务 / 证据闭环表”“状态 / 事务验收项停审记录”和“跨状态一致性门禁审计表”小节,了解状态、事务、幂等和一致性验收如何从正式状态矩阵、function flow、persistence consistency 和测试证据收敛。

正式 `06-验收标准.md` §8 应回填:

- 状态机、事务与一致性验收按 `AC-STATE-*`、`AC-TX-*`、`AC-IDEM-*`、`AC-CONC-*` 组织。
- 每个验收项必须绑定正式 state / transaction / idempotency 契约、触发 flow、TC、EV、report path 和裁决影响。
- 非法状态迁移、query write、job truth repair、Published / Delivered 越界、duplicate rerun、stored replay missing 后重算、version/cursor/key 混用和 fake private success 都是 P0 阻断条件。
- 本章不新增状态名、port、schema、public error mapping 或 config binding。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 9 是否需要把 consistency / recovery 作为 NFR sample 另列 | 影响非功能验收粒度 | Step 9 处理 |
| Step 10 是否所有 `EV-ID-IDEMP-*` / `EV-ID-JOB-*` 证据都有 artifact/report pairing | 影响本 Step 可裁决性 | Step 10 处理 |
| Step 11 是否将 query write、job repair truth、duplicate rerun mutation 绑定 VETO | 影响最终结论 | Step 11 裁决 |
| Step 12 public error mapping 是否需要回写本 Step | 影响缺陷分级和复验 | 如新增 schema/variant 则暂停回写 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 状态与一致性验收表完成 | 通过 | 见 §8.1 |
| 每个验收项有状态 / 事务契约、flow、TC、EV、report path | 通过 | 见 §8.2 |
| 状态 / 事务验收项已停审 | 通过 | 见 §8.3 |
| 跨状态一致性审计无 unresolved 冲突 | 通过 | 见 §8.4 |
| 未提前替代 Step 9~13 | 通过 | 非功能、证据、VETO、public error 和风险留后续 Step |
| 可进入 Step 9 | 通过 | 用户已确认,进入 Step 9: 定义非功能验收门禁 |
