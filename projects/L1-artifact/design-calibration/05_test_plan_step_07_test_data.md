# Step 7. 设计测试数据

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 7
> 回填章节: `05-测试方案.md` §7 测试数据设计

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 设计测试数据 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 6 用例矩阵;`03` DTO / flow / 状态机 / 持久化 / 错误 / 并发;`04` profile / config / redaction |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_07_test_data.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 8 |

## 2. 本步目标

把 Step 6 的 P0 用例矩阵落成可重复、可隔离、可清理、可留证的测试数据基线。

本 Step 只回答:

- 哪些 truth、support、view、report、mirror、relay、handoff、idempotency、config 和 redaction 数据集必须存在。
- 哪些负向、边界、并发、恢复数据必须单独隔离,不能混进 happy-path fixture。
- 数据如何按 `test_run_ref`、truth anchor、operation namespace、event dedup key、job run 和 external ref 隔离。
- 哪些外部依赖一律使用 fake / controlled / disabled,不允许真实 sibling repo 或真实外部产品。
- Step 6 的每类 `TC-ART-*` 是否都能回指稳定的数据集来源。

本 Step 不定义 fixture 文件路径、builder 函数名、seed 代码、真实数据库清理脚本、CI suite 名称、artifact 输出目录或正式 evidence ID。这些留给实现仓测试代码、Step 8 环境矩阵、Step 9 自动化门禁和 Step 13 证据归档继续收口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 `TC-ART-*` 用例矩阵、前置条件和断言主轴 |
| `03_ddd_step_06_object_contracts.md` | 正式输入 | 提供 truth/support/view/report/ref/state carrier 和 body-free 边界 |
| `03_ddd_step_08_protocol_contracts.md` | 正式输入 | 提供 16 Command、13 Query、6 Consumer、8 Event、6 Job 和 relay worker facade DTO |
| `03_ddd_step_09_function_flows.md` | 正式输入 | 提供 accepted / rejected / duplicate / degraded / partial failure 前置数据需求 |
| `03_ddd_step_10_state_matrix.md` | 正式输入 | 提供合法 / 非法状态组合和 terminal guard fixture 需求 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 正式输入 | 提供 version、UoW、stored result、relay payload snapshot、projection/reference/handoff 持久化数据需求 |
| `03_ddd_step_12_error_recovery.md` | 正式输入 | 提供 invalid request、unsupported schema、commit unknown、missing stored result、rollback / relay / handoff failure 数据需求 |
| `03_ddd_step_13_concurrency_idempotency.md` | 正式输入 | 提供 idempotency key/digest、duplicate replay、same key conflict、projection / reference / relay race 数据需求 |
| `04-配置设计.md` | 正式输入 | 提供四个 P0 profile、strict JSON、source priority、redaction、runtime builder fail-fast 和 replay 规则 |
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供 `local-dev` / `ci-test` / `integration-like` / `operations-replay` 的测试环境锚点 |
| `04_config_step_12_downstream_handoff.md` | 已完成 | 提供 config / replay / redaction / digest / rollback 测试承接口径 |
| `projects/L1-governance/design-calibration/05_test_plan_step_07_test_data.md` | 已读取 | 只作为 Step 7 粒度框架参考,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些基础数据必须存在? | 必须有 run namespace、actor/scope/consumer/target、definition refs、intake/submission/resolution、fact/content context、version candidate/history、lineage、baseline/membership、review/responsibility、automation input、consumable/backref、summary/read/preview/report/reconciliation、external resolution/mirror、trace / audit / change / relay / handoff / report / idempotency 基础数据集。 |
| 哪些负向、异常、并发和恢复数据必须单独构造? | 必须单列 missing metadata、unsupported schema、forbidden body、invalid selector、pending reference、policy reject、same key different digest、stored result missing、commit unknown、relay enqueue rollback、publisher retryable/permanent、projection race、reference unresolved/failed、handoff target disabled、strict JSON 非法、redaction leak 和 dependency violation。 |
| 数据如何隔离不同测试运行? | 以 `test_run_ref` 为最高隔离键,再按 `artifact_truth_anchor_ref`、`consumer_scope_ref`、`adjacent_consumer_ref`、`operation_namespace + idempotency_key`、`event_dedup_key`、`job_run_id`、`derived_view_ref`、`external_reference_ref` 二级分区。 |
| 数据如何清理? | P0 默认使用 run-scoped fake / in-memory store reset。durable-like future suite 才允许 run-scoped cleanup 或 transaction rollback。redaction leak corpus 必须完全隔离并在用后删除。 |
| 哪些外部依赖可以是真实产品? | P0 一律不使用真实 sibling repo、真实 DB/bus、真实 archive/observability/sync target 或真实 external content source。P0 只允许 fake / controlled / disabled / replay-backed 替身。 |
| 每个 P0 用例是否都能回指可重复生成的数据集? | 可以。§8.2 已把 `TC-ART-*` 映射到 truth/support/view/report/idempotency/config/fault 数据集。若实现时发现正式 DTO 或 state 不能稳定构造 fixture,必须回写 `03/04`,不得在测试侧私补 schema。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 用例矩阵 | 已有前置条件,但缺数据集和清理方式 | 本 Step 把前置条件落成可复用数据集 |
| `03` 详细设计 | 提供 truth / view / state / flow,但不直接给 fixture 组织方式 | 本 Step 定义按 Artifact 语义分组的数据基线 |
| `04` 配置设计 | 已给 profile / strict JSON / replay / redaction,但未映射到具体测试数据 | 本 Step 增加 config / replay / leak / dependency 数据集 |
| 旧 `05-测试方案.md` | 旧数据口径无法承接新版 external ref、relay payload snapshot、handoff、no-write/no-repair | 不继承旧数据表 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 基础 truth 数据 | 只散落在用例前置条件里 | 收束为 intake / fact / version / lineage / baseline / review / automation / consumption 数据集 | 减少重复造数 |
| 外部引用 / mirror / derived 数据 | 仅在 flow 中出现 | 收束为 resolution / mirror / projection / report / handoff 数据集 | 支撑 query、consumer、job 和 replay |
| 负向与恢复数据 | 只有异常名称 | 单列 invalid / duplicate / conflict / rollback / leak / dependency 数据集 | 防止 happy-path 遮蔽错误断言 |
| 配置和 redaction | 只有 Step 6 用例项 | 形成 profile/config/leak corpus 数据集 | 承接 `VF-ART-*` 和 `04` gate |

## 7. 测试数据设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否用真实 sibling repo 数据 | A. 使用真实 sibling;B. 只使用 formal refs / safe summaries / mirror snapshot fake | 采用 B。P0 只验证 Artifact seam,不验证外部产品 |
| 负向数据是否与 happy-path 混用 | A. 混用;B. 单独 negative dataset | 采用 B。需要明确触发错误和隔离 cleanup |
| 是否现在固定 fixture 文件路径 | A. 当前固定;B. 只固定数据集和构造规则 | 采用 B。路径留给实现仓和 Step 9 |
| replay / handoff 是否并入普通 job 数据 | A. 并入;B. 单独 handoff/report dataset | 采用 B。它们有独立 no-truth-repair 和 duplicate replay 语义 |
| 是否允许用 query 现查现造缺失数据 | A. 允许动态补;B. 不允许,缺失就是 degraded / consistency defect fixture | 采用 B。必须坚持 query no-write 和 missing-no-recompute 红线 |

## 8. 结构化中间产物

### 8.1 测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| `DS-ART-RUN-001` run namespace | 全部测试最高隔离壳 | 生成 `test_run_ref`、固定 clock / id 段、tenant-like namespace | `test_run_ref` | reset run namespace | 全部 `TC-ART-*` |
| `DS-ART-ACTOR-001` actor / scope / target | command metadata、query visibility、consumer scope、handoff target | builder 生成 actor、consumer scope、`AdjacentConsumerRef`、capability summary refs | `test_run_ref` + actor/scope | run namespace drop | `TC-ART-CONTRACT-*`;`TC-ART-CMD-*`;`TC-ART-QUERY-*`;`TC-ART-JOB-*` |
| `DS-ART-INTAKE-001` ready intake chain | `RegisterArtifactIntake`、fact establish、candidate create 正向前置 | 构造 `ArtifactIntakeContext(Resolved)`、`ArtifactSubmissionRecord(Accepted)`、input resolution audit refs | intake/source ref | run namespace drop | `TC-ART-CMD-001~004`;`TC-ART-STATE-*` |
| `DS-ART-INTAKE-NEG-001` pending/rejected intake | `PendingReference`、`Rejected`、`Transferred`、missing source 负向前置 | 构造 pending/rejected intake 与 rejected submission 组合 | intake/source ref + negative tag | run namespace drop | `TC-ART-CMD-001~003`;`TC-ART-CONTRACT-002`;`TC-ART-IDEMP-004` |
| `DS-ART-FACT-001` fact and content context | fact truth、content context、truth anchor 主线 | 构造 `ArtifactFact(Established)`、`ArtifactContentFactContext(Linked/Verified/Unavailable)`、fact change refs | truth anchor ref | run namespace drop | `TC-ART-CMD-002~005`;`TC-ART-QUERY-001/003/009`;`TC-ART-OUTBOX-001` |
| `DS-ART-VERSION-001` version history | candidate / published / superseded / frozen / retired history | 构造 candidate、formal version、fact current pointer、submission linkage | fact/version refs | run namespace drop | `TC-ART-CMD-003~006`;`TC-ART-QUERY-002/003`;`TC-ART-OUTBOX-002` |
| `DS-ART-LINEAGE-001` lineage relations | source / supersedes / depends-on / impacts 与状态转换 | 构造 `ArtifactLineageLink(PendingBasis/Established/Rejected/Retired)` | lineage ref + version endpoints | run namespace drop | `TC-ART-CMD-006~007`;`TC-ART-QUERY-004`;`TC-ART-OUTBOX-003` |
| `DS-ART-BASELINE-001` baseline and membership | baseline candidate / frozen / superseded 与 ordered membership | 构造 baseline、membership `Selected/Frozen/Removed`、review linkage | baseline scope/ref | run namespace drop | `TC-ART-CMD-008~010`;`TC-ART-QUERY-005`;`TC-ART-OUTBOX-004` |
| `DS-ART-REVIEW-001` review and responsibility | review anchor、responsibility assignment 主线与边界 | 构造 `ArtifactReviewAnchor(Draft/Ready/PendingResponsibility/Closed/Invalid)` 和 assignment state 组合 | review anchor ref | run namespace drop | `TC-ART-CMD-011~012`;`TC-ART-QUERY-006`;`TC-ART-OUTBOX-005` |
| `DS-ART-AUTOMATION-001` automation input | automation candidate register/accept path | 构造 `AutomationArtifactInput(Received/Accepted/PendingReview/Rejected/Superseded)` | automation input/source ref | run namespace drop | `TC-ART-CMD-013~014`;`TC-ART-CONSUMER-005` |
| `DS-ART-CONSUME-001` consumable/read surface | consumable ref、backref、traceability、read surface | 构造 `ConsumableArtifactReference(Ready/Restricted/Stale/Unavailable)`、`ArtifactConsumptionBackref(Recorded/Explained/Stale/Retired)`、`ArtifactReadSurfaceView` | consumable ref + consumer scope | run namespace drop | `TC-ART-CMD-015~016`;`TC-ART-QUERY-007/008`;`TC-ART-OUTBOX-006/007` |
| `DS-ART-PROTOCOL-001` valid DTO set | command/query/event/job DTO roundtrip | 使用 formal DTO builder 生成 canonical request/response/envelope/report | DTO family + schema version | 无持久化清理 | `TC-ART-CONTRACT-001`;全部 handler 套件 |
| `DS-ART-PROTOCOL-NEG-001` invalid DTO/envelope | 缺 metadata、unsupported schema、selector conflict、invalid page | 基于 valid DTO 做字段缺失 / 版本 / selector 变体 | case id | 无持久化清理 | `TC-ART-CONTRACT-002~004`;`TC-ART-QUERY-007/013`;`TC-ART-JOB-*` |
| `DS-ART-EXTREF-001` resolved external refs | work/process/governance/method/content/automation safe snapshot | fake resolver 只返回 ref、summary ref、digest、source version、safe marker | external ref + reference kind | reset fake resolver | `TC-ART-CONSUMER-001~006`;`TC-ART-CMD-001/013`;`TC-ART-QUERY-013` |
| `DS-ART-EXTREF-NEG-001` unresolved/forbidden external refs | unresolved、waiting、failed、digest mismatch、forbidden body | fake resolver 返回 unresolved/failed,或 isolated forbidden-body payload | external ref + negative tag | reset fake resolver;delete isolated body fixture | `TC-ART-CONSUMER-*`;`TC-ART-CONTRACT-003`;`TC-ART-REDACTION-*` |
| `DS-ART-MIRROR-001` mirror and refresh | local mirror snapshot、refresh record、last-good snapshot | 构造 body-free `ArtifactLocalMirrorSnapshot` 和 refresh record 序列 | external ref + snapshot ref | run namespace drop | `TC-ART-CONSUMER-006`;`TC-ART-QUERY-013`;`TC-ART-JOB-002` |
| `DS-ART-PROJECTION-001` summary/read/preview/report/reconciliation | summary view、read surface、preview/report、derived freshness 主线与 stale/degraded | 构造 fact/version/baseline/review summaries、preview/report/reconciliation view 与 `ArtifactDerivedFreshnessState` | view ref + derived kind | run namespace drop | `TC-ART-QUERY-001~012`;`TC-ART-JOB-001/003`;`TC-ART-OUTBOX-008` |
| `DS-ART-OUTBOX-001` relay payload snapshots | 8 个 outbound event 的 stored payload snapshot 和 pending relay | 构造 relay item + immutable payload snapshot + publication state | relay item ref + version | run namespace drop | `TC-ART-OUTBOX-001~008`;`TC-ART-RELAY-001`;`TC-ART-IDEMP-005` |
| `DS-ART-HANDOFF-001` handoff records/material | archive / observability / sync handoff record、body-free material、target state | 构造 `ArtifactHandoffRecord`、prepared material、truth anchors、consumer scopes、target disabled case | handoff record ref + target ref | run namespace drop | `TC-ART-JOB-004~006`;`TC-ART-QUERY-008`;`TC-ART-RELAY-001` |
| `DS-ART-REPORT-001` stored result / job / reconciliation report | command result、worker receipt、job report、reconciliation report replay | 构造 stored accepted/rejected result、receipt、job report、reconciliation clean/gap/failed report | result/job/report ref | run namespace drop | `TC-ART-IDEMP-001~004`;`TC-ART-JOB-001~006`;`TC-ART-QUERY-011/012` |
| `DS-ART-IDEMP-001` idempotency records | duplicate replay、digest conflict、in-flight reservation、missing result | 构造 reserved/completed/conflict idempotency rows + canonical digests | operation namespace + idempotency key | run namespace drop | `TC-ART-IDEMP-001~004`;`TC-ART-CONTRACT-004` |
| `DS-ART-FAULT-001` repository/UoW faults | version conflict、commit unknown、rollback failure、missing payload snapshot | fake repository / UoW / result store fault profile | fault case id | reset fake fault profile | `TC-ART-IDEMP-002/004/005/007`;`TC-ART-JOB-*` |
| `DS-ART-PUBLISHER-001` publish/handoff faults | relay retryable/permanent、handoff disabled/retryable/permanent | fake publisher / handoff adapter fault profile | adapter slot + fault case | reset fake adapter | `TC-ART-OUTBOX-*`;`TC-ART-RELAY-001`;`TC-ART-JOB-004~006` |
| `DS-ART-CONFIG-001` valid P0 profiles | `local-dev` / `ci-test` / `integration-like` / `operations-replay` 装配 | profile-specific config fixtures + deterministic refs | profile ref + config digest | 无持久化清理 | `TC-ART-CONFIG-001`;Step 8 承接 |
| `DS-ART-CONFIG-NEG-001` invalid config variants | strict JSON、high-priority invalid、boundary override、topic completeness、replay root 缺失 | 从 valid config 变异出非法 case | config case id | 无持久化清理 | `TC-ART-CONFIG-002~004` |
| `DS-ART-REDACTION-001` safe output corpus | 日志 / 指标 / 审计 / report / relay snapshot 正向 redaction 检查 | 采集代表性 command/consumer/job/query 运行输出 | run ref + output kind | delete run artifacts | `TC-ART-REDACTION-001~002` |
| `DS-ART-REDACTION-NEG-001` leak corpus | dummy body/secret/full ref 泄漏扫描 | 构造完全隔离的 dummy leak artifact | leak case id | delete isolated fixture | `TC-ART-REDACTION-*` |
| `DS-ART-ARCH-001` dependency metadata | sibling dependency boundary 检查 | manifest/dependency graph fixture 或生成元数据 | graph digest | 无持久化清理 | `TC-ART-ARCH-001` |

### 8.2 按测试切口组织的数据前置映射表

| 测试切口 | 用例 ID | 数据集 | fixture / builder / seed | fake / stub / real-like | 清理方式 |
|---|---|---|---|---|---|
| contracts / protocol / metadata | `TC-ART-CONTRACT-001~004` | `DS-ART-PROTOCOL-001`;`DS-ART-PROTOCOL-NEG-001`;`DS-ART-IDEMP-001` | canonical DTO builder + invalid envelope mutator + stored result seeds | fake idempotency/result store | no persistent cleanup / run drop |
| domain / state | `TC-ART-STATE-001~003` | `DS-ART-INTAKE-001/NEG-001`;`DS-ART-FACT-001`;`DS-ART-VERSION-001`;`DS-ART-LINEAGE-001`;`DS-ART-BASELINE-001`;`DS-ART-REVIEW-001`;`DS-ART-AUTOMATION-001`;`DS-ART-CONSUME-001` | state-specific builders for legal / illegal / terminal variants | none | run namespace drop |
| intake/fact/version commands | `TC-ART-CMD-001~005` | `DS-ART-ACTOR-001`;`DS-ART-INTAKE-001/NEG-001`;`DS-ART-FACT-001`;`DS-ART-VERSION-001`;`DS-ART-EXTREF-001/NEG-001`;`DS-ART-IDEMP-001` | command DTO builders + truth/support seeds + duplicate records | fake resolver/UoW | run drop / reset fault |
| lineage/baseline commands | `TC-ART-CMD-006~010` | `DS-ART-ACTOR-001`;`DS-ART-VERSION-001`;`DS-ART-LINEAGE-001`;`DS-ART-BASELINE-001`;`DS-ART-IDEMP-001` | lineage/baseline builders with unique/member order variants | fake repositories | run namespace drop |
| review/automation/consumption commands | `TC-ART-CMD-011~016` | `DS-ART-ACTOR-001`;`DS-ART-REVIEW-001`;`DS-ART-AUTOMATION-001`;`DS-ART-CONSUME-001`;`DS-ART-EXTREF-001`;`DS-ART-IDEMP-001` | review/automation/consumption builders | fake resolver/UoW | run drop |
| core truth queries | `TC-ART-QUERY-001~006` | `DS-ART-FACT-001`;`DS-ART-VERSION-001`;`DS-ART-LINEAGE-001`;`DS-ART-BASELINE-001`;`DS-ART-REVIEW-001`;`DS-ART-PROJECTION-001` | query seeds for hit/missing/degraded/empty page | fake read repo + write-audit | run drop / reset audit |
| read/search/derived queries | `TC-ART-QUERY-007~013` | `DS-ART-CONSUME-001`;`DS-ART-PROJECTION-001`;`DS-ART-MIRROR-001`;`DS-ART-EXTREF-001/NEG-001`;`DS-ART-REPORT-001`;`DS-ART-FAULT-001` | selector branch seeds + degraded/stale/report fixtures | fake visibility/read repos | run drop / reset audit |
| inbound consumers | `TC-ART-CONSUMER-001~006` | `DS-ART-PROTOCOL-001`;`DS-ART-EXTREF-001/NEG-001`;`DS-ART-MIRROR-001`;`DS-ART-IDEMP-001`;`DS-ART-PROJECTION-001` | inbound envelope builders + resolver outcomes + receipt seeds | fake resolver/receipt store | run drop / reset fake |
| outbound / relay | `TC-ART-OUTBOX-001~008`;`TC-ART-RELAY-001` | `DS-ART-OUTBOX-001`;`DS-ART-PUBLISHER-001`;`DS-ART-FAULT-001` | payload snapshot seeds + pending relay items + publish fault profile | fake publisher | run drop / reset adapter |
| public jobs / handoff | `TC-ART-JOB-001~006` | `DS-ART-PROJECTION-001`;`DS-ART-MIRROR-001`;`DS-ART-HANDOFF-001`;`DS-ART-REPORT-001`;`DS-ART-IDEMP-001`;`DS-ART-PUBLISHER-001` | job input builders + stored report + failed ref seeds | fake resolver/handoff/export | run drop / reset adapter |
| idempotency / recovery | `TC-ART-IDEMP-001~007` | `DS-ART-IDEMP-001`;`DS-ART-REPORT-001`;`DS-ART-OUTBOX-001`;`DS-ART-FAULT-001`;`DS-ART-PROJECTION-001`;`DS-ART-MIRROR-001` | duplicate/conflict/commit-unknown/rollback/no-write/no-repair seeds | fake idempotency/UoW/result/write-audit | run drop / reset audit/fault |
| config / redaction / dependency | `TC-ART-CONFIG-001~004`;`TC-ART-REDACTION-001~002`;`TC-ART-ARCH-001` | `DS-ART-CONFIG-001`;`DS-ART-CONFIG-NEG-001`;`DS-ART-REDACTION-001`;`DS-ART-REDACTION-NEG-001`;`DS-ART-ARCH-001` | config/leak/dependency fixtures | parser/builder/redaction checker | no persistent cleanup / delete isolated leak fixture |

### 8.3 数据构造规则

| 规则 | 正式口径 |
|---|---|
| deterministic ids | 所有 builder 按 `test_run_ref` 分配 deterministic ref/id,断言中不得依赖 wall-clock 随机值 |
| fixed clock | time-sensitive state、trace、report、handoff、replay 数据使用 fixed fake clock |
| canonical digest | idempotency / dedup / job digest 必须使用 Step 13 已定义的 canonical input,排除 trace id、attempt、request id 等 volatile metadata |
| body-free only | P0 正向数据只能包含 formal refs、safe summary refs、digest、source version 和 state marker;raw body 只允许出现在 isolated negative corpus |
| versioned mutations | 所有 existing state update fixture 必须带正式 `ArtifactRepositoryVersion`;cursor、timestamp、page token 不能充当 optimistic version |
| stored replay symmetry | duplicate replay fixture 必须同时准备 idempotency row 和 matching stored result / receipt / report;不得只 seed 其一 |
| no derived-as-truth | summary/read/preview/report/reconciliation 只作为 query / job / replay 数据,不得在 truth command fixture 中反推真相 |
| no query repair | query fixture 可以准备 stale/missing/degraded state,但不得准备“query 自动修复”隐含 side effect |
| no real sibling dependency | external refs、archive target、observability target、sync target 全部通过 fake / controlled / disabled carrier 构造 |

### 8.4 数据隔离与清理规则

| 数据类型 | 隔离键 | 清理方式 | 注意事项 |
|---|---|---|---|
| truth / support / view / report / relay / handoff / idempotency stores | `test_run_ref` + object/ref namespace | run namespace reset | 不允许跨 case 共享全局单例状态 |
| command / event / job duplicate 数据 | `operation_namespace + key/dedup_key/job_key` | run namespace reset | 同 raw key 在不同 operation 下必须隔离 |
| fake resolver / publisher / handoff / fault profile | adapter slot + case id | reset fake profile | failure injection 不能泄漏到 happy-path |
| config fixtures | profile or config case id | no persistent cleanup | 非法 config 不得写回 shared defaults |
| leak corpus | leak case id | delete isolated fixture | 只允许 dummy secret/body/ref,禁止真实敏感材料 |
| future durable-like suite | `test_run_ref` + schema namespace | run-scoped cleanup or rollback | 非 P0;进入前需在 Step 14 记录额外规则 |

### 8.5 测试数据停审记录

| 测试切口 / 数据集 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `DS-ART-RUN-001` | 是否提供全局 run 隔离 | 通过 | 具体 run id 生成留实现仓 |
| truth/support datasets | 是否覆盖 intake/fact/version/lineage/baseline/review/automation/consumption 主线与状态分支 | 通过 | builder 名称留实现仓 |
| protocol datasets | 是否覆盖 DTO roundtrip、missing metadata、unsupported schema、selector conflict | 通过 | handler 层 helper 名称留 Step 9 |
| external/mirror datasets | 是否覆盖 resolved/unresolved/failed/body forbidden/last-good snapshot | 通过 | forbidden body 继续隔离保存 |
| projection/report datasets | 是否覆盖 hit/stale/degraded/report replay/no rebuild | 通过 | write-audit helper 留 Step 9 |
| outbox/handoff datasets | 是否覆盖 stored payload snapshot、publish failure、prepared material、target disabled | 通过 | 具体 report artifact 路径留 Step 13 |
| idempotency/fault datasets | 是否覆盖 duplicate replay、same-key conflict、commit unknown、rollback failure、missing stored result | 通过 | fake UoW API 名称留实现仓 |
| config/redaction/dependency datasets | 是否覆盖四个 P0 profile、strict JSON、no fallback、leak scan、dependency boundary | 通过 | suite 名称留 Step 9 |

### 8.6 跨数据隔离 / 清理审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Step 6 的每类 `TC-ART-*` 是否都有数据集来源 | 通过 | 见 §8.2 |
| 是否存在人工临时造数依赖 | 通过 | 数据都来自 fixture / builder / seed 规则 |
| negative 数据是否与 happy-path 隔离 | 通过 | invalid / conflict / forbidden body / leak / fault / dependency 均单独隔离 |
| 外部依赖替身是否明确 | 通过 | P0 只用 fake / controlled / disabled / replay-backed |
| 清理方式是否明确 | 通过 | run reset、fake reset、isolated fixture delete |
| 是否有 query write 或 job repair 的隐含 fixture | 无 | stale/degraded fixture 只用于读断言 |
| 是否有 raw body / secret 进入共享语料风险 | 无 | leak corpus 独立且用后删除 |

## 9. 对上游设计的影响判定

| 数据结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 当前 P0 用例均可映射稳定数据集 | 否 | 测试数据细化 | 无需回写 |
| P0 外部依赖全部使用 fake / controlled / disabled | 否 | 与 `01/03/04` 一致 | 无需回写 |
| duplicate replay / missing result / payload snapshot / handoff material 均需要对称 fixture | 否 | 承接 Step 11/12/13 | 无需回写 |
| 若实现阶段发现某正式 DTO / state 无法稳定构造 fixture | 是 | 可验证性缺口 | 回写 `03/04` 或记录阻塞 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_07_test_data.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“测试数据集表”“按测试切口组织的数据前置映射表”“数据构造规则”“数据隔离与清理规则”和“跨数据隔离 / 清理审计表”小节。

正式 `05-测试方案.md` §7 应回填:

- 测试数据必须按 run namespace、truth/support 主链、protocol DTO、external resolution/mirror、projection/report、relay/handoff、idempotency/fault、config/redaction/dependency metadata 分组。
- 每个 `TC-ART-*` 用例都必须回指稳定数据集,不得依赖人工临时造数。
- `test_run_ref` 是最高隔离键;truth anchor、consumer scope、operation namespace、event dedup key、job run 和 external ref 是二级隔离键。
- P0 只允许 fake / controlled / disabled / replay-backed 替身,不允许真实 sibling repo 或真实外部产品。
- forbidden body、same-key conflict、commit unknown、missing stored result、relay rollback、invalid config、redaction leak 和 dependency violation 必须使用单独负向数据集。
- 清理方式只能是 run reset、fake reset、isolated fixture delete 或 future durable run cleanup,不得依赖人工清理。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| fixture 目录和 builder 函数命名 | 影响实现仓测试结构 | 当前不固定,留 Step 9 / implementation handoff |
| write-audit helper 与 no-truth-repair audit helper 的技术形态 | 影响 Query / Job 自动化断言 | Step 9 固定 |
| dependency graph 从 manifest 生成还是 fixture graph | 影响 `TC-ART-ARCH-001` 自动化 | Step 9 固定 |
| future durable-like 清理策略 | 影响 P1/P2 回归 | Step 14 记录残余风险 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 用例的数据前置条件可满足 | 通过 | 见 §8.2 |
| 每类数据集均有隔离和清理规则 | 通过 | 见 §8.4 |
| 外部依赖替身边界明确 | 通过 | P0 仅用 fake / controlled / disabled / replay-backed |
| 不依赖 query repair / job repair / real sibling data | 通过 | 符合 `03/04` 和 Step 6 红线 |
| 可进入 Step 8 | 通过 | 下一步设计测试环境与配置矩阵;进入前等待用户审查 |
