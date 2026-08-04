# L4-observability 03-详细设计 Step 16 · 测试切口与最小验证清单

> 对应正式文档章节: `03-详细设计.md` 第 15 章「测试切口与最小验证清单」
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 16
> 当前状态: M3 Step 16 已完成 affected-aware 测试切口校准；按用户本轮授权由 Step 17 继续消费
> 文件性质: 当前 full-restart 的 Step 16 中间产物,不是正式 `03-详细设计.md`,也不是测试执行报告

---

## 1. Step 状态

| 项 | 当前记录 |
|---|---|
| 当前文档 | `03-详细设计` |
| 当前 Step | Step 16「定义测试切口与最小验证清单」 |
| 当前模块 | `test-cuts` |
| 当前模式 | `full-restart` |
| 上游完成状态 | Step 01~15 已形成当前设计记录；Step 09~15 为 `completed_design_record_with_affected_open`，不表示 inherited affected 已关闭 |
| 当前输出 | 模块、接口、状态机、一致性/幂等、并发/重入、配置/运行时/观测安全和脚本契约的最小测试入口 |
| 正式文档状态 | `projects/L4-observability/03-详细设计.md` 仍是 historical material,本 Step 不修改 |
| 测试执行状态 | not_run；本文件不声称任何测试已执行或通过 |
| 当前 blocker | 未发现新的上游 blocker；`S08-E-I05-*`、`R06.6-F2-H13-UPSTREAM` 及其余 inherited affected 保持开放 |
| gate_status | `completed_design_record_with_affected_open` |
| next_allowed_action | `continue_M3_step_17_under_current_user_authorization` |

## 2. 本步目标与非目标

### 2.1 目标

本 Step 让实现者和后续 `05-测试方案.md` 能够从详细设计直接找到最小验证入口:

1. 七个 workspace module 各自至少需要哪些 contract、unit、service、adapter 或 entry test。
2. 16 Command、14 Query、9 Inbound Consumer、12 Outbound Event 和 9 Operations Job 各自至少一个正向与一个异常切口。
3. 27 个正式状态机以及 `ObservationJobPlanItemState` 技术协调状态如何验证合法、非法、terminal 和 reserved 路径。
4. accepted UoW、rollback、cursor、projection membership、outbox snapshot、stored replay、Query no-write 和 external split-phase 如何做 failure injection。
5. Command / Consumer / Job 的幂等、并发、claim / fence、commit unknown、external token / probe 和 fake / durable parity 如何验证。
6. config / runtime / adapter / telemetry / redaction / self-observation recursion 如何验证不越过 truth、安全和 no-write 边界。
7. 本仓需要交付的 gate、report 和 redaction checker 具有什么命令、输入、输出与失败语义。

### 2.2 非目标

本 Step 不定义:

- 完整测试用例集、测试优先级、测试人员、排期、环境拓扑、数据全集、fixture 文件内容或覆盖率阈值。
- 性能基线、负载规模、SLO、告警阈值、metric bucket、采样率、dashboard 或 runbook。
- CI provider、容器、数据库、broker、telemetry backend 或测试框架产品选型。
- `05` 中的 suite matrix、测试数据治理、缺陷流程、回归范围、真实 evidence 和 exit gate。
- `06` 中的验收签署、veto 决策、风险接受或 release verdict。
- 真实 `run_id`、真实 evidence alias、真实 artifact、真实报告、通过结论或验收签署。
- 新 object、state、port、DTO、store、配置 key、生产代码或脚本实现。

本 Step 只固定“测试必须从哪里进入、至少断言什么、建议用哪类测试”。后续测试方案可以扩展,不得删减本文件定义的边界断言。

## 3. 输入材料与采用方式

| 输入 | 本 Step 用途 |
|---|---|
| 详细设计 SOP Step 16 | 固定四类必选表、五个问题、每个关键协议正向/异常和状态合法/非法覆盖 |
| 详细设计书写规范 5.15 | 固定测试切口表和脚本契约表格式、artifact/report root与失败语义 |
| Step 04 文件布局 | 固定七个 crate、`tests/contract` / `domain` / `service` / `integration` / `support`落点和binary名称 |
| Step 05 模块契约 | 固定 `contracts/domain/application/infra/api/worker/jobs` 七模块的职责和测试 owner |
| Step 06 对象契约 | 固定 factory、policy、history、outbox、stored result、plan、intent、report、safe ref和forbidden body不变量 |
| Step 07 Port / Adapter 契约 | 固定 fake / durable conformance、spy/failpoint边界、repository / UoW / resolver / publisher / delivery语义 |
| Step 08 协议契约 | 固定16/14/9/12/9 canonical surface、metadata、DTO、receipt、outcome和public error |
| Step 09 函数级处理流 | 固定accepted Command、read-only Query、accepted Consumer、outbox publication与staged Job顺序 |
| Step 10 状态矩阵 | 固定27个正式状态机、合法/非法/terminal/reserved方向和cross-state side effects |
| Step 11 持久化与事务 | 固定logical store、CAS、cursor、same-UoW、immutable snapshot、projection index、handoff split transaction与Query no-write |
| Step 12 错误与恢复 | 固定typed error、public mapping、`ObservationRecoveryClass`、commit unknown、probe与manual intervention |
| Step 13 并发与幂等 | 固定actor/operation scope、stable digest、duplicate/in-flight、immutable plan、claim/fence、external token/probe及25个planned测试ID；affected保持开放 |
| Step 14 配置与外部绑定 | 固定builder顺序、catalog totality、historical binding、runtime error、fake/disabled/degraded与五类external phase |
| Step 15 观测与审计 | 固定log/metric/span/native audit、redaction、low-cardinality、self-recursion、retention/handoff/no-write测试handoff |
| L1-governance / L1-artifact / L1-identity Step 16 | 只参考分层、逐协议、逐状态机、脚本和停审粒度,不复制业务契约 |

### 3.1 真相源优先级

```text
当前正式 00 / 01 / 02
  > 当前 full-restart Step 01~15（含 M2 affected register）
  > 当前 Step 16 测试切口
  > 参考项目粒度
  > 旧 README / 旧正式 03 / 旧 Step 16 / 旧 04~07
```

测试不得通过 private fake map、日志文本、metric value、当前数据库偶然形态或旧对象名绕过正式契约。

## 4. 分批写入计划

| 批次 | 内容 | 状态 | 完成门禁 |
|---|---|---|---|
| 16.0 | 输入、SOP回答、historical material诊断、测试层次和harness边界 | done | 测试不替代设计或测试方案 |
| 16.1 | 七模块与16 Command切口 | done | 每个Command有正向/异常,shared replay/conflict单独覆盖 |
| 16.2 | 14 Query、9 Consumer、12 Outbound Event、9 Job切口 | done | 每个canonical surface有正向/异常 |
| 16.3 | 27状态机与Job item技术状态切口 | done | 每机合法/非法/terminal/reserved均有入口 |
| 16.4 | transaction、error、consistency、idempotency、concurrency、reentry | done | 保留Step 13的25个正式测试ID |
| 16.5 | config、runtime、adapter、observability、redaction、self-recursion | done | forbidden material与no-write可自动检查 |
| 16.6 | 脚本契约、cross-step closure、Step 17 handoff、回填草稿与门禁 | done | 本轮用户已授权完成M3；仅允许Step 17继续消费 |

## 5. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 每个模块至少需要哪些单元测试? | `contracts`验证typed ref / DTO / schema / redaction；`domain`验证factory / policy / state / history；`application`验证flow / UoW / idempotency / no-write；`infra`验证repository / adapter / builder / fake parity；`api/worker/jobs`验证entry只调façade且不直连truth。 |
| 每个接口至少需要哪些正向和异常测试? | 60个canonical protocol surface逐项给出positive和abnormal切口；duplicate/conflict/in-flight、unsupported、not-visible、partial、external unknown等shared分支另有cross-interface切口。 |
| 状态机合法和非法转换如何测试? | 27个正式状态机逐项选择至少一个合法转换和一个非法/terminal/reserved断言；同时断言非法路径无history/outbox/stale/result副作用。 |
| 事务、一致性、幂等和并发如何验证? | 使用spy ports、deterministic barrier、failpoint UoW、fake/durable conformance、provider probe stub和write-spy验证顺序、rollback、CAS、one-winner、stored replay、fence和finalize-only。 |
| 哪些细节留给测试方案? | exact fixture、数据矩阵、环境、suite owner、priority、coverage、CI并发、性能负载、evidence命名、缺陷流程、entry/exit和真实执行结果留给`05`。 |

## 6. Historical material 诊断

旧 Step 16 只有37行,不能作为当前测试入口。它引用的下列对象和结论全部废止:

| 旧内容 | 问题 | 当前处理 |
|---|---|---|
| `IngestObservationMaterialCommand` | 当前正式协议为16个Command,不存在该旧命令 | 删除并逐Command覆盖 |
| `RedactionDecision` | 当前safety/redaction由`SafetyDisposition`和boundary guard承接 | 删除旧对象测试 |
| `AuditEventProjection` / `AuditHashLink` | 与当前`AuditProjection` / `AuditAppendRecord`冲突,hash chain未闭口 | 删除 |
| `EvidenceLink` | 当前正式对象为`EvidenceLinkage`并含purpose / visibility / digest语义 | 替换 |
| `MetricPoint` / `NormalizedLogRecord` / `TraceSpanRecord` | 当前runtime telemetry不形成这些durable schema | 替换为Step 15 instrumentation / redaction测试 |
| `ProjectionRebuildReport` | 当前正式载体为maintenance state、progress、structured item outcome和Job report | 替换 |
| 旧 ING 系列候选编号 | 无当前定义来源,且旧文档把候选ID当既成测试 | 删除；只保留Step 13正式定义的25个ID |
| `evidence generation` | 容易静态生成或伪造真实evidence | 改为脚本命令契约,不声明任何artifact存在 |

旧稿中“当前无上游 blocker”的结论已经失效。M2 没有发现**新的**上游 blocker，但继承的 I05
payload / producer binding 与 J06 H13 owner 缺口仍然开放；它们不会阻塞本 Step 定义 fail-closed
测试入口，却会阻塞对应 positive runtime path。目标实现仓尚未发现，不阻塞 design record，仍会在
Step 17 / `07`成为 implementation kickoff 前置条件。

### 6.1 M2 affected 对 Step 16 的影响审计

| affected / blocker | 本 Step 必须保留的验证入口 | 当前可验证范围 | 禁止伪造的通过条件 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | unknown/unsupported schema 必须在 payload decode 和 write UoW 前 fail closed | header gate、zero-write、zero-ack-default、body-free telemetry | 自造 Artifact payload、decoder、fixture 或 accepted receipt |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | 缺 positive producer binding 时 I05 slot 不激活、不消费、不 ack、不写 | startup/static catalog rejection 与 disabled slot | 任选 Artifact event、全订阅或用字符串 producer 猜测 |
| `R06.6-F2-H13-UPSTREAM` | J06 只验证 controlled blocked/manual 与 no-source-write | scope/guard/claim rejection、blocked report surface | H13 execution record、source repaired、completed replay result |
| `R06-F-AFFECT-UOW-01` | accepted flow 固定 `stage owner/post-state + membership plan -> assign cursor -> construct/append cursor-bound history/outbox/stale -> result -> complete -> commit` | spy/failpoint 顺序、rollback、one-cursor | cursor 前构造 cursor-bound record，或 commit 后补 history/outbox |
| `S08-RECOVERY-CLASS-OWNER-01` | 所有 error 必须经唯一 total mapper；无 wildcard/default | exhaustive mapping、layer-preserving `ReservedTransition` | private mapper、message parsing、fallback retry |
| `R07-EXTERNAL-PHASE-LINK-01` | preparation/delivery/probe/finalize 使用同一 durable intent/token/binding relation | phase linkage、same-token probe、finalize-only | 合并 phase、换 token、换 current binding |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | retry accounting 区分 call attempt、probe 与 local finalize | deterministic attempt ledger / report assertions | 把 timeout 当 known failure 或声称 exactly-once |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | 只有协议显式授权的 accepted Consumer 才可 append typed snapshot | zero/one outbox 与 source UoW 原子性 | family 默认 event、current-truth payload rebuild |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | commit unknown 无 wildcard ack/retry/dead-letter | no-completion surface、probe-before-action | 根据 log/span/timeout选择 terminal transport action |
| `S08-JOB-REPORT-REF-OWNER-01` | report/result ref 必须来自唯一 typed mint / durable relation | missing-owner fail closed、no fabricated report | 临时 UUID、真实 run_id 或 evidence alias |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | public secondary carrier 必须做 owner/kind/schema exhaustive scan | wrong-kind reject 与 roundtrip | local alias、裸 String 或 domain-private type 泄漏 |
| `03-RPR-S09-PER-FLOW` | 60 张 exact-flow card 均须映射正向/异常入口，affected path 明确 blocked | `16+14+9+12+9=60` 去重覆盖 | shared family template 代替逐协议断言 |

本表中的 `current可验证` 只表示存在 planned test cut，不表示测试已实现或执行。affected 的关闭必须由
对应 owner 的正式设计和后续真实 gate 证明，不能由本 Step 的测试描述反向关闭。

## 7. 测试层次与最小 harness 契约

### 7.1 建议测试类型

| 类型 | 主要 owner | 适用内容 | 不可替代 |
|---|---|---|---|
| contract unit | `contracts` | typed ref、DTO、enum、serialization、schema、body-free field scan | application behavior |
| domain unit | `domain` | factory、policy、state transition、history factory、不变量 | repository / UoW atomicity |
| application service | `application` | flow order、idempotency、error mapping、no-write、port orchestration | durable adapter conformance |
| repository contract | `infra` + shared suite | unique、CAS、append-only、cursor、rollback visibility、scan order | service authorization |
| adapter contract | `infra` | resolver / publisher / handoff / export formal outcome和token/probe | external product end-to-end |
| handler / worker / runner | `api/worker/jobs` | parsing、route、dispatch、surface mapping、ack / exit semantics | application mutation logic |
| integration | cross-module | accepted UoW、outbox、projection、staged Job、split external finalize | production performance |
| static / schema scan | workspace / scripts | dependency、forbidden fields、metric labels、entry isolation | runtime behavioral assertions |
| property / golden vector | contracts/application | canonical digest、set ordering、outcome fold、stable token | actual external delivery |

### 7.2 Harness 能力

| Harness capability | 最小行为 | 红线 |
|---|---|---|
| deterministic clock / ID fake | 通过现有`ClockPort` / `IdGeneratorPort`给出可预测值 | 不把私有sequence当业务truth |
| repository write spy | 记录formal port method、顺序与参数family | 不读取private map替代public assertion |
| failpoint UoW | 在begin/stage/history/index/outbox/result/complete/commit/rollback注入typed failure / unknown | 不发明新的error variant |
| deterministic barrier | 控制parallel reserve、CAS、claim、finalize交错 | 不使用sleep证明并发顺序 |
| resolver / publisher / delivery stub | 返回Step 07/12 formal outcome、stable receipt、Unknown / Unsupported probe | 不返回raw provider body |
| telemetry recorder | 捕获structured fields、metric labels、span attributes和suppression counts | 不成为accepted audit或retry authority |
| fake/durable conformance runner | 对同一contract suite运行in-memory fake与durable adapter | 不允许fake额外成功路径 |

具体fixture类型、builder API和测试框架留给实现与`05`,但上述可观测能力必须存在,否则本Step的failure / concurrency切口无法执行。

## 8. 模块测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contracts_protocol_roundtrip` | Step 05 `contracts`;Step 08协议 | 16/14/9/12/9 name、metadata、request/response/receipt/report/error roundtrip保持required field和variant | contract unit |
| `contracts_typed_ref_owner_isolation` | Step 06 refs | receipt/signal/audit/evidence/handoff/retention/gap/outbox/report refs不可混用或降级为裸String | contract unit |
| `contracts_body_free_schema_scan` | Step 08 / 15 | public DTO、event、report、error不含raw body、secret、endpoint、provider response、真实run/evidence字段 | schema scan |
| `domain_factory_policy_invariants` | Step 06 | 所有owner factory和policy接受合法safe refs,拒绝missing/wrong-owner/body-bearing输入 | domain unit |
| `domain_state_and_history_pairing` | Step 10 | 合法transition返回对应native history；非法/terminal/reserved无状态与history副作用 | domain unit |
| `domain_no_external_dependency` | Step 03 / 05 | domain不读取config、repository、clock backend、telemetry sink或external adapter | static dependency scan |
| `application_command_consumer_uow_order` | Step 09 / 11 | reserve -> load -> transition -> stage owner/post-state与membership plan -> assign one cursor -> construct/append cursor-bound history/outbox/stale -> result/complete -> commit | application service |
| `application_query_no_write` | Step 09 / 11 | 14 Query对所有surface均零write port调用 | application service + write spies |
| `application_job_plan_item_finalize` | Step 09 / 13 | start/item/finalize分UoW,immutable plan、claim/fence、structured outcome和report fold成立 | application service |
| `application_typed_error_mapping` | Step 12 | Protocol/Domain/Application/Job error映射不解析message,保持recovery class | application unit |
| `infra_repository_conformance` | Step 07 / 11 / 13 | fake与durable在unique/CAS/append/cursor/reservation/claim/fence/rollback上等价 | shared repository contract |
| `infra_external_adapter_conformance` | Step 07 / 12 / 14 | resolver/publisher/handoff/export只返回formal outcome并遵守exact historical binding/token/probe | adapter contract |
| `infra_runtime_builder_totality` | Step 14 | builder按固定顺序全量装配或返回startup error,不泄漏partial runtime | runtime builder test |
| `infra_forbidden_material_boundary` | Step 14 / 15 | secret、endpoint、route、provider body只留infra-private边界,不进入service/log/report | integration + scan |
| `api_handler_facade_only` | Step 05 / 07 / 09 | API只做route/metadata/DTO/error mapping并调用façade,不直连repository/UoW/domain | handler test |
| `worker_consumer_publisher_boundary` | Step 05 / 09 | worker只做envelope/ack/loop mapping,不绕过consumer/publication service | worker test |
| `jobs_runner_facade_only` | Step 05 / 09 | one-shot runner只解析request、调用service、映射report/exit,不直连adapter/repository | runner test |
| `workspace_dependency_direction` | Step 03~05 / 14 | crate dependency方向正确,唯一cross-repo编译依赖为`core-contracts` | Cargo metadata/static check |

## 9. 接口测试通用规则

### 9.1 Command 通用切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `command_positive_same_uow` | Step 09 / 11 | accepted owner/history/index/outbox/stale/result/idempotency同一UoW commit,accepted telemetry在commit后 | application service |
| `command_abnormal_no_partial_effect` | Step 12 | validation/domain/policy/CAS/persistence failure无partial owner/history/outbox/stale/result | failure injection |
| `command_duplicate_replay` | Step 13 | same scope/digest只replay exact stored result,不重跑resolver/domain/outbox | application service |
| `command_conflict_inflight` | Step 13 | different digest conflict和same digest Reserved in-flight不暴露旧body、不产生second writer | concurrency service |

### 9.2 Query 通用切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `query_visible_or_empty` | Step 08 / 09 | visible hit或visible empty使用exact surface,分页cursor不混同committed cursor | query handler |
| `query_not_visible_stale_missing` | Step 08 / 12 | not-visible、missing、stale、rebuilding、disabled、degraded严格区分 | query service |
| `query_zero_write` | Step 09 / 11 / 15 | 不begin write UoW、不reserve、不save、不mark stale、不refresh、不emit durable audit | write-spy integration |

### 9.3 Consumer 通用切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `consumer_positive_local_fact` | Step 08 / 09 / 11 | accepted只写local receipt/snapshot/projection input/native history/outbox/result | consumer service |
| `consumer_duplicate_or_older_no_write` | Step 13 | exact redelivery replay receipt；older/equal source version不回退state | consumer + comparator fake |
| `consumer_unsupported_no_parse` | Step 08 / 12 | unsupported schema在payload parse前返回,无marker/stale/outbox | worker + parse spy |

### 9.4 Outbound / Job 通用切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `outbound_snapshot_exact` | Step 08 / 11 / 14 | event/subject/schema/cursor/trace/binding/payload snapshot一一对应,accepted UoW失败则全部不可见 | outbox integration |
| `outbound_publish_stored_only` | Step 09 / 13 | publisher只读stored snapshot,不查current truth或current route | publisher spy |
| `job_terminal_duplicate_replay` | Step 09 / 13 | terminal duplicate零candidate scan/item/external call,只replaystored report | job service |
| `job_partial_and_blocked_explicit` | Step 08 / 12 / 13 | partial/failed/blocked的changed/failed/gap/progress refs可lossless解释,不伪造completed | job integration |

## 10. 16 Command 接口测试切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `SubmitObservationMaterial_positive` | Step 08/09 intake flow | safe source summary建立receipt/safety/decision,accepted commit产生exact event/result且不保存raw material | API + application |
| `SubmitObservationMaterial_abnormal` | Step 12 safety / dependency | forbidden body只形成body-free quarantine/reject；resolver unavailable为Delayed；无安全主线副作用 | API + failure injection |
| `RecordSafetyDisposition_positive` | Step 09 safety flow;Step 10 states | Pending处置转Safe或Redacted并原子推进eligible receipt、history/outbox | application service |
| `RecordSafetyDisposition_abnormal` | Step 10 terminal guards | missing receipt/summary、forbidden marker或对terminal处置重写返回typed error且rollback | domain + application |
| `BindCorrelationContext_positive` | Step 09 correlation flow | accepted/degraded-allowed receipt建立Unbound并以safe source/trace/causation refs转Bound或Partial | application service |
| `BindCorrelationContext_abnormal` | Step 10 correlation conflict | receipt/source owner不匹配、opaque ref冲突或Invalid context重绑被拒绝,不推导business identity | domain + application |
| `RecordSafeSignal_positive` | Step 09 signal flow | body-free summary + valid context形成Recorded signal,rollup/affected view按契约stale并append event | application service |
| `RecordSafeSignal_abnormal` | Step 10 / 15 signal safety | Invalid context、raw log/metric/trace body或suppressed terminal重录被拒绝,raw input不落库/telemetry | application + redaction scan |
| `AppendAuditProjection_positive` | Step 09 audit flow | body-free source audit/context/subject创建并append projection与`AuditAppendRecord`,handoff/timeline stale | application service |
| `AppendAuditProjection_abnormal` | Step 12 audit boundary | missing context/source audit、wrong subject owner或source audit body被拒绝,无generic audit ledger | application + scan |
| `LinkBodyFreeEvidence_positive` | Step 09 evidence flow | existing projection、boundary ref、purpose、digest summary通过policy后Linked并保存audit/outbox | application service |
| `LinkBodyFreeEvidence_abnormal` | Step 10 evidence states | evidence body转BodyBlocked或reject；projection missing / NotVisible / stale显式,不得伪造linked | domain + application |
| `PrepareReportHandoff_positive` | Step 09 handoff flow;Step 11 snapshot | full`EvidenceIndexInputView`逐项重读校验并immutable保存后创建Draft/Prepared handoff | application integration |
| `PrepareReportHandoff_abnormal` | Step 12 handoff guard | ref-only/mismatched input、open blocking gap、not-visible、retention/no-write block不保存可交付handoff | application failure injection |
| `EvaluateAuthenticityHint_positive` | Step 09 authenticity flow | body-free basis分别形成RealEvidenceLinked、PlaceholderDetected或Insufficient并关联handoff | domain + application |
| `EvaluateAuthenticityHint_abnormal` | Step 10 authenticity boundary | missing handoff/input、无origin却声明real、terminal hint改写被拒绝；不生成run/evidence alias | domain + application |
| `SetRetentionMarker_positive` | Step 09 retention flow | valid protected ref形成ActiveHold / ReleaseEligible / Conflict与change record,不执行delete | application service |
| `SetRetentionMarker_abnormal` | Step 10 retention guard | active protection下release、Released重开或直接source cleanup被拒绝,marker/history保持 | domain + repository fake |
| `ProtectActiveReference_positive` | Step 09 protection flow | consumer ref canonical unique,attach/expire/release按state与marker原子保存 | application service |
| `ProtectActiveReference_abnormal` | Step 10 protection guard | 有active consumers时release或protected ref mismatch形成Conflict/typed error,无source delete | domain + concurrency |
| `DefineReplayScope_positive` | Step 09 replay scope | non-empty observation/projection targets + allowed effect经no-write/retention guard转Approved | application service |
| `DefineReplayScope_abnormal` | Step 10 replay boundary | external/source truth target、empty scope或forbidden effect转Blocked/rejected并可记录local violation,不执行replay | application + adapter spies |
| `RecordNoWriteViolation_positive` | Step 09 violation flow | forbidden target尝试在调用前阻断,Detected->Blocked并原子保存violation record/outbox | application service |
| `RecordNoWriteViolation_abnormal` | Step 12 fail-closed | violation persistence失败仍不得调用forbidden adapter；Closed不得重开；不声称record已保存 | failure injection |
| `RecordGapState_positive` | Step 09 gap flow | open/ack/mitigate/close有typed reason和native record,close依赖真实local resolution | domain + application |
| `RecordGapState_abnormal` | Step 10 gap boundary | 无resolution basis关闭、wrong degraded ref、reserved suppress/unsuppress或Resolved reopen被拒绝 | domain unit |
| `PrepareExternalAuditExport_positive` | Step 09 export flow | body-free view/consumer/visibility通过后保存preparation/delivery marker,Command不做external call | application + adapter spy |
| `PrepareExternalAuditExport_abnormal` | Step 12 export guard | raw package/final conclusion、unsupported consumer、gap/retention/no-write block不产生Delivered或external truth | application + scan |
| `RegisterReferenceSnapshot_positive` | Step 09 reference flow | typed owner/source建立Pending并按formal resolver outcome保存Resolved/Unresolved/Unavailable/Invalid | application + resolver fake |
| `RegisterReferenceSnapshot_abnormal` | Step 12 reference boundary | external body、wrong producer/owner、duplicate ref different content或unsupported outcome被拒绝 | application + repository fake |
| `UpdateReferenceSnapshotState_positive` | Step 09 reference update | newer comparable source version和safe summary推进formal state,append refresh record并mark dependent views stale | application service |
| `UpdateReferenceSnapshotState_abnormal` | Step 13 ordering | older不回退,equal mismatch冲突,missing/uncomparable不按time猜winner,Invalid不in-place转Resolved | comparator + application |

## 11. 14 Query 接口测试切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `GetObservationReceipt_positive` | Step 08/09 | visible exact receipt返回state/safe refs/surface,无write | query handler |
| `GetObservationReceipt_abnormal` | Step 12 | missing与not-visible区分；repository defect返回typed error且不建placeholder | query + write spies |
| `GetIntakeStatus_positive` | Step 08/09 | receipt/safety/decision组合状态一致,accepted/rejected/quarantined/degraded可解释 | query service |
| `GetIntakeStatus_abnormal` | Step 11 consistency | dangling disposition/decision ref fail closed,不在线修复或补默认status | query consistency test |
| `GetSafeSignal_positive` | Step 08/09 | visible Recorded/Stale/Suppressed safe signal surface正确,body-free | query handler |
| `GetSafeSignal_abnormal` | Step 15 redaction | missing/not-visible/forbidden summary body不泄漏,不重跑resolver或record signal | query + scan |
| `GetSignalRollup_positive` | Step 08/09 | Pending/Fresh/Stale/Rebuilding/Failed与window/count/cursor surface一致 | query handler |
| `GetSignalRollup_abnormal` | Step 10 no repair | RequireFresh遇Stale返回exact surface,不seal/rebuild/读取raw metric或trace | query + write spies |
| `GetAuditTimeline_positive` | Step 08/09 | canonical subject分页、append order和restricted entry映射正确 | query handler |
| `GetAuditTimeline_abnormal` | Step 12 visibility | not-visible entry省略/受限且empty有效；无read audit append | query + audit write spy |
| `GetEvidenceIndexInput_positive` | Step 09 / 11 | linkage/projection/gap refs canonical sorted unique,visibility与scope完整 | query service |
| `GetEvidenceIndexInput_abnormal` | Step 11 handoff input | missing linkage显式gap/not-visible,Query仅preview且绝不save immutable handoff input | query + repository spy |
| `GetReportHandoff_positive` | Step 08/09 | exact handoff/readiness/authenticity/input refs和delivery state可见 | query handler |
| `GetReportHandoff_abnormal` | Step 12 | missing、blocked、degraded、stale和consistency mismatch显式,不prepare/deliver | query + write spies |
| `GetRetentionProtection_positive` | Step 08/09 | marker/protection/consumer refs与hold/conflict/release-candidate surface一致 | query service |
| `GetRetentionProtection_abnormal` | Step 10 | dangling protection或state/ref mismatch为consistency error,不释放marker或delete | query consistency |
| `GetObservationReadModel_positive` | Step 08/09 | canonical scope命中Fresh或允许stale body,source refs和freshness marker一致 | query handler |
| `GetObservationReadModel_abnormal` | Step 11 projection | missing/index/composite mismatch、RequireFresh stale返回exact surface,不触发rebuild | query + projection spy |
| `GetDiagnosticView_positive` | Step 09/11 | diagnostic scope/view/summary/freshness/progress/binding完整组合读取 | query service |
| `GetDiagnosticView_abnormal` | Step 12 consistency | scope/view/summary mismatch或Rebuilding progress missing fail closed,无drop/rebuild/placeholder | query consistency |
| `GetGapStatus_positive` | Step 08/09 | Open/Acknowledged/Resolved及degraded refs按source/scope返回 | query handler |
| `GetGapStatus_abnormal` | Step 10 gap semantics | Suppressed不等Resolved,not-visible不等missing,Query不ack/close gap | query + write spies |
| `GetPeripheralExportView_positive` | Step 08/09 | body-free view、delivery、availability和visibility surface正确 | query handler |
| `GetPeripheralExportView_abnormal` | Step 12/15 | disabled/not-visible/stale/blocked不调用export adapter,不返回package/provider body | query + adapter spy |
| `GetReferenceSnapshotView_positive` | Step 08/09 | Resolved/Stale/Unresolved/Unavailable/Invalid与safe summary/source version surface正确 | query handler |
| `GetReferenceSnapshotView_abnormal` | Step 11 | snapshot/sidecar/source mismatch为consistency error,不refresh或复制external body | query consistency |
| `GetRebuildProgress_positive` | Step 08/09 | progress ref、maintenance target、plan/report/binding scope一致并返回exact state | query handler |
| `GetRebuildProgress_abnormal` | Step 12 | progress missing或target/report/binding mismatch fail closed,不start/finalize Job | query consistency |

## 12. 9 Inbound Consumer 接口测试切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `ConsumeBusObservationMaterial_positive` | Step 08/09 | valid envelope + safe summary提交receipt/safety/decision/result/outbox,ack在commit后 | worker + application |
| `ConsumeBusObservationMaterial_abnormal` | Step 12/13 | raw body quarantine、unsupported不parse、duplicate replay、resolver unavailable delayed均无second effect | worker failure injection |
| `ConsumeSourceAuditMaterial_positive` | Step 09 | valid source audit ref/context形成projection/audit record和local outbox | consumer service |
| `ConsumeSourceAuditMaterial_abnormal` | Step 12 | missing correlation产生formal gap/delayed；source audit body被拒绝；older version不写 | consumer + scan |
| `ConsumeIdentityObservationContext_positive` | Step 09 | identity safe ref/context形成reference snapshot/refresh record,不接管identity truth | consumer service |
| `ConsumeIdentityObservationContext_abnormal` | Step 13 | wrong producer/owner、unsupported、older/equal mismatch或identity body不写local state | consumer + comparator |
| `ConsumeGovernanceAuditContext_positive` | Step 09 | governance body-free boundary/context保存reference/evidence input或gap with exact visibility | consumer service |
| `ConsumeGovernanceAuditContext_abnormal` | Step 12 | governance decision body、not-visible误作missing、unavailable误作not-found均被阻断 | consumer + resolver fake |
| `ConsumeArtifactEvidenceContext_positive_reserved` | Step 08/09 affected | 只定义未来 positive gate：canonical payload schema、exact producer binding、complete typed input、唯一 durable landing 与 result owner 全部关闭后，才允许形成 local body-free linkage/reference snapshot | blocked planned contract；当前不得执行为 pass |
| `ConsumeArtifactEvidenceContext_abnormal_current` | Step 08/12/15 | payload schema或producer binding缺失时slot不激活；unknown schema在decode/write前fail closed；artifact/evidence body拒绝且不生成real evidence alias | consumer activation + parse/write/ack spies |
| `ConsumeRuntimeSignalSummary_positive` | Step 09 | safe runtime summary关联context/signal/reference,partial correlation显式gap | consumer service |
| `ConsumeRuntimeSignalSummary_abnormal` | Step 15 | raw log/metric/trace/runtime execution body被拒绝,summary不裁决execution success | consumer + scan |
| `ConsumeSandboxSignalSummary_positive` | Step 09 | safe summary推进safety/signal或formal no-op/reference snapshot | consumer service |
| `ConsumeSandboxSignalSummary_abnormal` | Step 12 | unsafe body quarantine,missing receipt不伪造receipt,duplicate不重写signal | consumer + spy ports |
| `ConsumeArchiveHandoffFeedback_positive` | Step 09 | matching handoff/preparation/receipt推进local lifecycle并append native record | consumer service |
| `ConsumeArchiveHandoffFeedback_abnormal` | Step 12/13 | raw receipt body、token/binding mismatch、older feedback或absence不证明Delivered/Failed | consumer + token fake |
| `ConsumeReportConsumerFeedback_positive` | Step 09 | matching peripheral delivery feedback推进local state/report refs | consumer service |
| `ConsumeReportConsumerFeedback_abnormal` | Step 12 | unknown consumer、receipt mismatch、disabled channel或absence不反写audit/consumer truth | consumer + adapter fake |

## 13. 12 Outbound Event 接口测试切口

下表每个positive切口共享exact stored snapshot断言,每个abnormal切口共享“serialization / binding / outbox append失败则accepted owner UoW整体rollback；publish不得从current truth重建”断言。

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `ObservationReceiptChanged_positive` | Step 08/09 | payload只来自committed receipt/intake record,subject/cursor/binding一一对应 | payload builder + outbox |
| `ObservationReceiptChanged_abnormal` | Step 11 | staged/rollback receipt或owner mismatch不能产生snapshot；publish failure不改receipt | failure injection |
| `SafetyDispositionChanged_positive` | Step 08/09 | committed disposition与linked receipt state映射exact body-free payload | payload contract |
| `SafetyDispositionChanged_abnormal` | Step 15 | unsafe body/summary不得进入payload/log；binding missing回滚owner UoW | redaction + outbox |
| `SafeSignalRecorded_positive` | Step 08/09 | Recorded signal/context/summary refs形成snapshot,不含raw signal | payload contract |
| `SafeSignalRecorded_abnormal` | Step 10 | Candidate/Suppressed或raw log/metric/trace不能产生normal recorded event | application + scan |
| `AuditProjectionAppended_positive` | Step 08/09 | committed projection/source-audit ref/append state映射,不复制audit body | payload contract |
| `AuditProjectionAppended_abnormal` | Step 12 | rejected/restricted未满足event gate或source audit body不append normal event | application + scan |
| `EvidenceLinkageChanged_positive` | Step 08/09 | linkage/projection/boundary/purpose/state映射body-free snapshot | payload contract |
| `EvidenceLinkageChanged_abnormal` | Step 10 | Candidate/body-bearing input不伪造Linked event；digest不进入telemetry label | application + metric scan |
| `ReportHandoffChanged_positive` | Step 08/09 | handoff/readiness/input/hint/lifecycle refs映射,Delivered仍不含verdict | payload contract |
| `ReportHandoffChanged_abnormal` | Step 12 | adapter return但local finalize未commit不产生Delivered snapshot | external finalize injection |
| `RetentionMarkerChanged_positive` | Step 08/09 | marker/protection/state change映射,无cleanup指令 | payload contract |
| `RetentionMarkerChanged_abnormal` | Step 10 | active protection conflict或reserved Released不产生release/delete event | domain + outbox |
| `NoWriteViolationRecorded_positive` | Step 08/09 | committed violation/target/state/record refs映射且forbidden call未执行 | application + adapter spy |
| `NoWriteViolationRecorded_abnormal` | Step 12 | marker persistence失败不宣称event committed,但original forbidden write仍blocked | failure injection |
| `GapStateChanged_positive` | Step 08/09 | gap/source/kind/state/transition refs映射,Resolved不声明source repaired | payload contract |
| `GapStateChanged_abnormal` | Step 10 | reserved suppress/reopen或无basis close不产生normal changed event | domain + outbox |
| `ReferenceSnapshotChanged_positive` | Step 08/09 | committed snapshot/source/resolution safe refs映射,tagged reference cursor正确 | payload contract |
| `ReferenceSnapshotChanged_abnormal` | Step 13 | older/equal mismatch或external body不产生new snapshot event | consumer + outbox |
| `DerivedProjectionChanged_positive` | Step 08/09 | committed derived view/freshness/progress refs来自fenced item UoW | job integration |
| `DerivedProjectionChanged_abnormal` | Step 11/13 | partial/capture-fence failure不发布Fresh或partial bundle event | projection failure injection |
| `PeripheralDeliveryChanged_positive` | Step 08/09 | committed preparation/delivery/receipt refs映射,不含package/provider body | payload contract |
| `PeripheralDeliveryChanged_abnormal` | Step 12 | external success但local finalize unknown不声明Delivered event | external probe integration |

## 14. 9 Operations Job 接口测试切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `PublishObservationOutbox_positive` | Step 09/13 | only Pending/RetryableFailed plan items,stable publication token,exact binding/snapshot,local Published finalize/report | job + publisher stub |
| `PublishObservationOutbox_abnormal` | Step 12/13 | payload corrupt dead-letter；external unknown先probe；Unsupported不blind republish；truth不回滚 | failure injection |
| `RebuildObservationReadModels_positive` | Step 09/11 | immutable scopes捕获、per-item read fence、read model+diagnostic atomic replace、target Fresh finalize | job integration |
| `RebuildObservationReadModels_abnormal` | Step 11/13 | source/membership revision变化或assembly failure保留old bundle并记录failed item/report | projection failure injection |
| `RebuildSignalRollups_positive` | Step 09/10 | 只读stored Recorded SafeSignal至fixed cursor,seal rollup Fresh并完成report | job integration |
| `RebuildSignalRollups_abnormal` | Step 10/12 | raw metric/trace读取、incomplete cursor、scope mismatch或item failure不得mark Fresh | job + source spies |
| `RefreshReferenceSnapshots_positive` | Step 09/13 | immutable target items、formal resolver outcome、新source version/safe summary、fenced save/report | job + resolver fake |
| `RefreshReferenceSnapshots_abnormal` | Step 12 | unavailable/unresolved/invalid显式；external body、stale fence或subject mismatch不写Resolved | failure injection |
| `ScanObservationGaps_positive` | Step 09/10 | fixed target scan创建/ack/close有basis gap并更新status/progress/report | job integration |
| `ScanObservationGaps_abnormal` | Step 10/12 | 无safe resolution不close,source truth missing不补造,accounting失败停止调度 | failure injection |
| `CoordinateObservationReplay_positive_reserved` | Step 09/10 affected | 只定义未来 positive gate：H13 owner/execution record/result正式关闭后，Approved scope只能执行observation-side derived effect并产生owner-backed report | blocked planned contract；当前不得声称完成 |
| `CoordinateObservationReplay_controlled_current` | Step 09/10/12 | H13开放、external/source repair target、active hold或no-write失败均转controlled Blocked/manual；zero forbidden adapter call、zero source write、zero fabricated execution result | job + adapter/write spies |
| `PrepareReportHandoffDelivery_positive` | Step 09/13/14 | prepare intent先commit,prepare/deliver同historical binding,receipt后local finalize/report | job + handoff stub |
| `PrepareReportHandoffDelivery_abnormal` | Step 12/13 | Unknown/Unsupported停止；target rotation不改token；finalize failure只finalize/probe不redeliver | external phase injection |
| `PrepareExternalAuditExportJob_positive` | Step 08 public Job `PrepareExternalAuditExport` / Step 09 delivery flow | body-free preparation/view/consumer refs,prepare/deliver intent与receipt,local delivery/report commit | job + export stub |
| `PrepareExternalAuditExportJob_abnormal` | Step 12/14 | unavailable/blocked/unknown、binding/package mismatch不换target、不重建package、不声明external audit truth | failure injection |
| `RebuildPeripheralViews_positive` | Step 09/11 | fixed safe sources生成product-neutral view/progress,versioned replace后emit derived event/report | job integration |
| `RebuildPeripheralViews_abnormal` | Step 12/15 | source revision、visibility/retention/no-write或assembly failure保留old view,不反写core truth | projection + write spies |

## 15. 状态机测试切口表

每行同时固定一个合法与一个非法/terminal/reserved入口。非法路径除返回指定typed error外,还必须断言owner、history、outbox、stale marker和stored result均无accepted副作用。

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `state_observation_receipt` | `ObservationReceiptState` | legal Received->Accepted/Rejected/Quarantined/Degraded；Rejected/Superseded不重开,当前supersede返回ReservedTransition | domain unit |
| `state_safety_disposition` | `SafetyDispositionState` | legal Pending->Safe/Redacted/Rejected/Quarantined；Safe/Redacted/Rejected terminal不互转 | domain unit |
| `state_correlation_context` | `CorrelationContextState` | legal Unbound/Partial->Bound及Bound->Partial；Invalid terminal,conflicting refs不bind | domain unit |
| `state_safe_signal` | `SafeSignalState` | legal Candidate/Stale->Recorded、Recorded->Stale、nonterminal->Suppressed；Suppressed不恢复 | domain unit |
| `state_audit_projection` | `AuditProjectionState` | legal Pending/Restricted->Appended、Appended->Restricted、attach_gap保态；Suppressed reserved/terminal | domain unit |
| `state_evidence_linkage` | `EvidenceLinkageState` | legal Candidate->Linked/BodyBlocked/NotVisible、Linked<->Stale/NotVisible；BodyBlocked不恢复 | domain unit |
| `state_report_handoff` | `ReportHandoffState` | legal Draft/Failed->Prepared->Delivered与Prepared->Failed；Draft不能直达Delivered,Delivered/Cancelled不重开 | domain unit |
| `state_handoff_readiness` | `HandoffReadinessState` | policy可得Ready/Blocked/Degraded/PendingEvidence；blocking gap不能Ready,Query reevaluation不持久化 | policy + application |
| `state_authenticity_hint` | `AuthenticityHintState` | Unassessed/Insufficient->RealEvidenceLinked/PlaceholderDetected；terminal hint不互改,real需body-free origin | domain unit |
| `state_retention_marker` | `RetentionMarkerState` | legal hold/release-candidate/conflict和archive hint保态；Released reserved且不等source delete | domain unit |
| `state_active_reference_protection` | `ActiveReferenceProtectionState` | attach->Protected、Protected->Expired/Conflicted、empty guard->Released；有consumer不能release | domain unit |
| `state_replay_scope` | `ReplayScopeState` | Defined->Approved->Completed或Blocked/Cancelled；external target拒绝,terminal需new scope | domain unit |
| `state_no_write_violation` | `NoWriteViolationState` | Detected->Blocked/Escalated->Closed；Closed不重开且forbidden adapter始终未调用 | domain + spy |
| `state_gap_lifecycle` | `GapLifecycleState` | Open->Acknowledged->Resolved与mitigate保态；无basis close、reserved suppress/unsuppress、Resolved reopen拒绝 | domain unit |
| `state_degraded_output` | `DegradedOutputKind` | None->Active/Blocked；Active/Blocked恢复需new policy-evaluated replacement,Query不in-place reset | policy + application |
| `state_signal_rollup` | `SignalRollupState` | Pending/Fresh/Stale/Failed->Rebuilding->Fresh或Failed；incomplete seal与raw source拒绝 | domain + job |
| `state_read_visibility` | `ReadVisibilityKind` | Visible/Restricted/NotVisible/Blocked按request context独立评估；not-visible不等missing且无persistent transition | policy + query |
| `state_diagnostic_freshness` | `DiagnosticFreshnessState` | assembler产生Fresh/Partial/Unavailable,accepted change标Stale,maintenance replacement恢复；Query不修 | domain + projection |
| `state_reference_snapshot` | `ReferenceSnapshotStateKind` | noninvalid可formal refresh到Resolved/Unresolved/Unavailable/Invalid；Invalid terminal,Resolved必须safe summary | domain + resolver |
| `state_projection_maintenance` | `ProjectionMaintenanceStateKind` | Fresh/Failed->Stale->Rebuilding->Fresh/Failed；Fresh不能直接Rebuilding,Query不能start | domain + job |
| `state_replay_coordination` | `ReplayCoordinationKind` | Pending->Coordinating->Completed/Failed或Blocked；terminal execution不重开,scope coupling成立 | domain + job |
| `state_rollup_rebuild` | `RollupRebuildKind` | Pending->Running->Completed/Failed；reserved Cancelled拒绝,current terminal不回Running | domain + job |
| `state_peripheral_delivery` | `PeripheralDeliveryKind` | Pending/Failed/Blocked->Prepared->Delivered/Failed；Delivered terminal,reserved cancel拒绝 | domain + external stub |
| `state_export_preparation` | `ExportPreparationState` | Draft/Failed/Blocked->Prepared->Delivered/Failed或Blocked；Delivered不重开,无final conclusion field | domain + external stub |
| `state_outbox_publication` | `OutboxPublicationState` | Pending->Published/Failed/DeadLettered、Failed->Published/Failed/DeadLettered；Published/DeadLettered terminal,无Failed->Pending | repository + publisher |
| `state_idempotency_reservation` | `IdempotencyReservationState` | empty->Reserved->Completed；incoming Replay/Conflict/InFlight不改old row,Completed不回Reserved | repository contract |
| `state_job_report` | `JobReportState` | Draft->五种terminal outcome且fold完整；terminal不二次finalize,duplicate只replay | job report unit |
| `state_job_plan_item` | `ObservationJobPlanItemState` | Planned->Running->structured terminal；仅FailedRetryable在Draft report+fresh fence下重入,sealed plan不变 | job repository + barrier |

## 16. 事务、持久化、错误与一致性测试切口

### 16.1 Accepted UoW 与 rollback

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `uow_accepted_order` | Step 09/11 affected | stage owner/post-state与membership plan后分配唯一cursor，再以该cursor构造/append history、outbox snapshot和stale marker，随后result/complete，最后commit | application + UoW spy |
| `uow_fail_before_cursor` | Step 11 | owner/post-state stage或membership planning任一点失败rollback；不得先构造/append cursor-bound history/outbox/stale，无cursor-visible row、result或completed reservation | failpoint UoW |
| `uow_fail_after_cursor_before_commit` | Step 11 | index/outbox/stale/result/complete任一点失败全部不可见,cursor gap可存在但不复用 | failpoint UoW |
| `uow_commit_known_failure` | Step 12 | confirmed abort返回dependency failure,不返回Accepted,可在新attempt重走完整guard | UoW fake |
| `uow_commit_unknown` | Step 12/13 | 返回indeterminate并probeexact reservation/result；不blind retry或new key | ambiguity simulation |
| `uow_rollback_unknown` | Step 12 | fail closed/manual,不声称accepted/rejected certainty | UoW fake |
| `history_mandatory_atomicity` | Step 11/15 | native history/audit write失败rollbackowner；runtime telemetry sink失败不回滚committed owner | service + telemetry fake |

### 16.2 Logical store / projection consistency

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `repository_expected_version_unique` | Step 07/11 | stale expected version零写,canonical unique loser不覆盖winner,append-only无update/delete | repository contract |
| `cursor_namespace_separation` | Step 11 | observation/reference/page/outbox cursor不可比较或替换,同UoW只有一个tagged committed cursor | contract + repository |
| `projection_exact_membership_replace` | Step 11 | planner读old+new relation,added/retained/removed scope全部advance,empty set为full withdrawal且保留stable source time | projection integration |
| `projection_first_target_binding` | Step 11 | first aggregate target在同UoW初始化,member/target positions read-your-writes且无zero fabrication | projection integration |
| `projection_capture_replace_fence` | Step 11/13 | capture后source/member/target revision变化使replace rollback,oldcomplete bundle保留 | barrier integration |
| `diagnostic_composite_integrity` | Step 11/12 | scope/view/summary/freshness/progress/binding任一missing/mismatch fail closed | query integration |
| `evidence_index_preview_to_snapshot` | Step 09/11 | Query preview不写；Command逐项重读校验并先immutable save input再save handoff | service + repository spies |
| `outbox_record_snapshot_pair` | Step 11/14 | record/event/subject/cursor/snapshot/binding完全匹配,缺失/corrupt不从current owner重建 | outbox contract |
| `external_intent_plan_landing` | Step 11/13/14 | plan/config snapshot/intent/token/binding/material identity对应,process restart后从durable source恢复 | job repository integration |

### 16.3 Error / recovery

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `error_protocol_before_uow` | Step 12 | route/body/ref/page/envelope错误不begin UoW、不解析unsupported payload | entry test |
| `error_domain_reject_rollback` | Step 12 | invalid state/policy/body boundary返回exact code,无generic message parsing和accepted side effects | domain + service |
| `error_dependency_family_mapping` | Step 12/14 | same unavailable outcome按Command/Consumer/Query/Job映射Delayed/error/surface/report,不伪造NotFound | adapter fake |
| `error_commit_external_indeterminate` | Step 12/13 | commit/external unknown均保持indeterminate,按exact token/state probe | failure injection |
| `error_manual_consistency_defect` | Step 12 | missing stored result/payload/index/sidecar/report为ManualIntervention,不silent repair | repository corruption fixture |
| `error_finalize_only` | Step 12/13 | external success+local known failure只重试local finalize,无第二external call | external stub + failpoint |
| `error_no_write_persistence_failure` | Step 12 | violation marker失败仍阻断forbidden write,返回typed failure且不伪造audit/event | service + spies |
| `error_reserved_transition_layering` | Step 10/12 | domain state guard返回`DomainError::ReservedTransition`，application protocol/phase guard返回`ApplicationError::ReservedTransition`；两层exhaustive mapping不得合并或fallback | domain/application exhaustive mapping |

## 17. 并发、幂等与重入测试切口

本节保留Step 13已经正式分配的25个ID。它们只是设计中的测试切口标识,不是已执行case、artifact、evidence或pass结果。

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `TC-OBS-IDEM-001` | Command parallel reserve | N个parallel same scope/digest只有one Acquired；其余InFlight或commit后Replay；domain/outbox一次 | application + deterministic barrier |
| `TC-OBS-IDEM-002` | digest conflict | same operation/actor/key不同digest返回Conflict,旧reservation/result不变且不进入domain | canonical digest + repository fake |
| `TC-OBS-IDEM-003` | actor/operation scope | same raw key在different actor/operation不串result,同actor仍重新授权 | repository + service |
| `TC-OBS-IDEM-004` | canonical digest | set/Option/enum canonical稳定；request time、trace、job execution、attempt、claim/fence不改变digest | property + golden vector |
| `TC-OBS-IDEM-RESULT-001` | stored replay compatibility | idempotency/operation/actor/digest/kind/schema/surface任一missing/mismatch fail closed且不重算 | result repository |
| `TC-OBS-EVENT-DEDUP-001` | consumer exact redelivery | replay stored receipt,零payload parse/resolver/state/outbox second effect | consumer + spy ports |
| `TC-OBS-EVENT-DEDUP-002` | source-event secondary unique | same event换dedup key仍定位原reservation；same digest replay/in-flight,different digest conflict/quarantine | repository concurrency |
| `TC-OBS-EVENT-DEDUP-003` | source version | newer先提交后older不回退；equal mismatch冲突；missing/uncomparable不按occurred_at判winner | comparator fake |
| `TC-OBS-JOB-IDEM-001` | Job start | terminal duplicate只replay report且零candidate read；nonterminal Active claim返回in-progress | job + spy repositories |
| `TC-OBS-JOB-IDEM-002` | immutable plan | resume不增删重排item、不改input、不用current config替换snapshot；material变化conflict | plan repository |
| `TC-OBS-JOB-IDEM-003` | claim/fence | global same work key只有one Active claim；reacquire token严格递增；stale commit为ExecutionFenceConflict | fake/durable concurrency |
| `TC-OBS-JOB-IDEM-004` | item/finalize | crash after item commit只resume remaining；outcome/report tamper拒绝；report等于canonical item fold | phase failure injection |
| `TC-OBS-COMMIT-UNKNOWN-001` | unknown commit | Command/Consumer不new key/blind mutation；reservation/result probe驱动Replay/InFlight/manual | UoW ambiguity |
| `TC-OBS-CONC-CAS-001` | mutable row CAS | stale expected version零写；reload后重跑全部guard | repository fake + durable |
| `TC-OBS-CONC-UNIQUE-001` | create-if-absent | parallel canonical create只有one owner；unique loser不伪装stored duplicate | repository concurrency |
| `TC-OBS-PROJ-FENCE-001` | projection fence | capture后source revision推进使replace rollback；newer stale watermark和old bundle保留 | projection integration |
| `TC-OBS-OUTBOX-DUAL-001` | dual publisher | two workers只有authoritative fence finalize；binding/payload/token一致；route rotation不重定向old event | outbox + barrier |
| `TC-OBS-OUTBOX-FINALIZE-001` | publish finalize | Published后local known failure只finalize；unknown先probe；Unsupported不republish | publisher + UoW failpoint |
| `TC-OBS-JOB-RESUME-001` | Job resume | Expired/Released claim不证明item rollback；probe equivalent terminal后Skip/finalize,否则fresh claim | job recovery integration |
| `TC-OBS-JOB-FINALIZE-001` | parallel finalizer | 只有one terminal report/result/complete；loser不编辑terminal report | job repository concurrency |
| `TC-OBS-CONC-RETENTION-001` | retention race | release read后new protection commit使release CAS/recheck失败；无source delete | domain + transaction |
| `TC-OBS-JOB-HANDOFF-001` | handoff phases | prepare/deliver intent先commit且binding一致；rotation不改token；Prepared/Delivered probe只finalize；Unknown停止 | handoff contract |
| `TC-OBS-JOB-EXPORT-001` | export phases | binding/package/view/material固定；local failure不重建package、不换target、不重复deliver | export contract |
| `TC-OBS-QUERY-NOWRITE-001` | 14 Query parallel | repeated/parallel Query无reservation/result/history/outbox/stale/refresh/rebuild/cursor写入 | query + write spies |
| `TC-OBS-FAKE-PARITY-001` | fake/durable parity | unique、reserve、rollback、CAS、claim/fence、probe classification在fake/durable一致 | shared conformance |

## 18. 配置、运行时、Adapter 与观测安全测试切口

### 18.1 Config / runtime / binding

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `config_owner_and_no_env_leak` | Step 14 | only infra loader/builder读raw source；contracts/domain/application不读env/secret/config file | static + builder |
| `config_validation_order` | Step 14 | parse/type/range/cross-field/redline/digest先于secret/store/adapter/service/entry assembly | runtime builder |
| `config_redline_not_switchable` | Step 14 | body-free、Query no-write、stored replay、same-UoW、fence、no-source-repair不可配置关闭 | config validation |
| `config_catalog_totality` | Step 14 | enabled Command/Consumer/Event/Job所需binding唯一完整；missing/duplicate/capability mismatch在startup或accepted gate失败 | builder + service |
| `config_store_capability_gate` | Step 14 | no atomic UoW/unique/CAS/fence capability返回StoreCompatibilityMismatch,无partial façade | runtime builder |
| `config_historical_binding_rotation` | Step 13/14 | new route仅影响new snapshot；old pending/intent/plan继续old binding,missing old binding manual不fallback | restart integration |
| `config_job_snapshot_resume` | Step 14 | accepted plan持久化完整JobExecutionConfigSnapshot；resume不读取current config替换 | job repository |
| `config_sensitive_ref_infra_only` | Step 14/15 | secret/credential/endpoint解析值不进入validated application slice、plan/log/report | redaction scan |
| `runtime_complete_or_error` | Step 14 | seven startup error variants映射safe issue ref,失败不泄漏partial runtime或business rejection | runtime builder |
| `runtime_assembled_not_success` | Step 14/15 | assembled只表示wiring ready,不表示adapter available、accepted、published、delivered或Fresh | runtime + entry |
| `adapter_disabled_degraded_unavailable` | Step 12/14 | 三类state保持不同surface,disabled不silent skip/fake success | adapter fake |
| `entry_slice_isolation` | Step 14 | API/worker/jobs只拿所需façade与validated slice,不能downcast取repository/adapter | static + constructor |

### 18.2 Logs、metrics、trace 与 native audit

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `log_cut_coverage` | Step 15 §10 | entry/Command/Query/Consumer/repository/UoW/Job/external/runtime关键结果产生固定template与allowlisted fields | instrumentation |
| `log_commit_timing` | Step 15 | Accepted/Published/Delivered只在local commit/finalize后；unknown为indeterminate | telemetry + failpoint |
| `log_no_raw_error_debug` | Step 15 | typed error只输出layer/kind/recovery/issue ref,不format source chain/stack/provider body | log scan |
| `metric_name_type_contract` | Step 15 §11 | declared counter/histogram/gauge在exact boundary更新,accepted count不提前 | instrumentation |
| `metric_low_cardinality` | Step 15 | labels仅finite operation/result/error/state/family/phase；无ref/key/digest/free text | metric label scan |
| `metric_gauge_snapshot_semantics` | Step 15 | outbox/projection absolute count和availability one-hot来自完整snapshot,不靠event delta猜truth | metric recorder |
| `trace_parent_context_propagation` | Step 15 §12 | trusted trace_ref传播；missing只建local span且不回填DTO/digest/durable context | trace recorder |
| `trace_status_after_typed_outcome` | Step 15 | span status由typed outcome映射；not-visible是semantic surface；unknown不记success/failure certainty | trace + failure injection |
| `audit_native_same_uow` | Step 11/15 | accepted native history/audit与owner同UoW；log/metric/span不替代durable audit | application service |
| `audit_rejected_duplicate_boundary` | Step 12/15 | ordinary reject/pre-UoW/duplicate/conflict/in-flight不追加accepted history/outbox/report item | service + spies |

### 18.3 Redaction、recursion、retention 与 report truth

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `redaction_before_serialization` | Step 15 | typed allowlist在serialization前执行；失败suppressed,无fallback debug dump | telemetry unit |
| `redaction_protocol_and_external_body` | Step 15 | request/event/log/metric/trace/evidence/config/provider/package/receipt body不进入四channel | generated canary scan |
| `redaction_no_hash_escape` | Step 15 | forbidden body/secret/token/source version/payload不能hash/base64后输出 | redaction scan |
| `redaction_metric_and_span_attributes` | Step 15 | metric无高基数,span/log只含明确允许safe refs,actor默认只在native audit | telemetry recorder |
| `self_observation_no_facade_call` | Step 15 §15 | telemetry facade/sink永不调用own Command/Consumer/Job/publication service | call graph + spy services |
| `self_observation_nested_suppressed` | Step 15 | emitter内部field/sink failure不创建nested log/span,只更新process-local suppression counter | telemetry fault injection |
| `self_observation_sink_failure_non_authoritative` | Step 15 | sink failure不回滚committed owner、不触发business retry/gap/violation/outbox | service + sink fake |
| `telemetry_not_safe_signal_loopback` | Step 15 | own runtime spans/logs不自动形成SafeSignal；current config无unbounded loopback route | integration + binding scan |
| `retention_backend_separation` | Step 15 | telemetry backend retention不创建/修改RetentionMarker；durable marker不配置backend days | integration + static |
| `handoff_not_evidence_or_signoff` | Step 08/15 | report/job refs不是real run/evidence alias；Delivered不等verdict/signoff | contract + service |
| `fake_private_material_not_truth` | Step 14/15 | private fake map/fixture/sequence/log/metric不能作为asserted business truth或输出 | shared fake suite |
| `dependency_no_non_core_sibling_path` | Step 03/14 | Cargo metadata中除core-contracts无sibling path依赖 | static dependency script |

## 19. 脚本契约表

本仓需要交付gate、report和安全检查脚本,因为Step 15要求forbidden material与metric label可自动扫描。下表只是未来实现命令契约,当前没有脚本、run、artifact或报告被声称存在。

| 脚本 | 类型 | 参数 | 输入 | 输出 | 失败语义 |
|---|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--run-id` / `--artifact-root` / `--config-profile` | 源码、配置、test suites、formal fake profile | `artifacts/test/<run_id>` | 任一required suite/check非0则整体非0；保留failure summary,不得伪造pass artifact |
| `scripts/reports/generate_reports.sh` | report | `--run-id` / `--artifact-root` / `--report-root` | `artifacts/test/<run_id>` | `reports/runs/<run_id>` | artifact缺失/不完整/无法解析则非0并列出missing inputs；不得补默认success |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root` / `--report-root` | test artifacts + generated reports | `reports/runs/<run_id>/redaction-check.md` | 发现raw body、secret、credential、endpoint/topic/path、provider/package/receipt body、hash逃逸则非0 |
| `scripts/checks/check_metric_labels.sh` | check | `--artifact-root` / `--report-root` | captured metric descriptors / samples | `reports/runs/<run_id>/metric-label-check.md` | 未声明metric、label不在allowlist或出现ref/key/digest/free text则非0 |
| `scripts/checks/check_dependency_boundary.sh` | check | `--artifact-root` / `--report-root` | Cargo metadata / lockfile snapshot | `reports/runs/<run_id>/dependency-boundary-check.md` | 非`core-contracts` sibling path依赖、方向反转或未声明workspace member则非0 |

### 19.1 脚本规则

- `--artifact-root` 必须是与参数`--run-id`一致的`artifacts/test/<run_id>`。
- `--report-root` 的根固定为`reports/`,run输出固定落在`reports/runs/<run_id>`。
- script exit code是命令执行结果,不是验收signoff；report只汇总真实输入artifact。
- 任一checker不得编辑source、truth store、test artifact或输入report以“修复”失败。
- 不得从静态JSON、模板、设计文档或旧evidence路径生成passed结果。
- exact suite list、CI wiring、artifact schema、report正文、evidence alias和retention由`05/06/07`继续定义。

## 20. 前序闭环审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 七个模块是否都有测试入口 | `pass_with_affected_open` | §8逐module覆盖；owner gap不得由private fake补齐 |
| 16 Command是否逐项positive/abnormal | `pass_with_affected_open` | §10共32个切口；affected按对应owner保留 |
| 14 Query是否逐项positive/abnormal且no-write | `pass_with_affected_open` | §11共28个切口；全部no-write，carrier/visibility affected保留 |
| 9 Consumer是否逐项positive/abnormal/duplicate语义 | `pass_with_affected_open` | §12共18个切口；I05 positive为reserved gate，当前只允许activation fail-closed |
| 12 Outbound Event是否逐项snapshot/abnormal | `pass_with_affected_open` | §13共24个切口；producer schema/binding affected保留 |
| 9 Job是否逐项positive/abnormal/duplicate语义 | `pass_with_affected_open` | §14共18个切口；J06 positive为reserved gate，H13开放时只验证controlled path |
| 27正式状态机是否legal/illegal | `pass_with_affected_open` | §15逐状态机覆盖；secondary owner affected保留 |
| Job item技术状态是否覆盖 | pass | §15额外覆盖plan item/fence/seal |
| persistence/transaction/error是否有failure injection入口 | pass | §16覆盖UoW、store、projection、external finalize |
| Step 13的25个测试ID是否保留 | `pass_with_affected_open` | §17逐项保留且未声明执行；外部phase/report owner缺口不被测试ID关闭 |
| config/runtime/binding是否有入口 | pass | §18.1 |
| log/metric/trace/native audit是否有入口 | pass | §18.2 |
| redaction/self-recursion/retention/handoff truth是否有入口 | pass | §18.3 |
| 脚本契约是否输出 | pass | §19；无脚本或artifact伪造 |
| 是否越界替代测试方案 | pass | 未定义fixture全集、环境、优先级、coverage、真实evidence或exit gate |

## 21. Step 17 承接

收到用户确认进入Step 17后,实施承接清单必须至少引用以下测试边界:

| 承接主题 | Step 17需要使用 | 不得误写 |
|---|---|---|
| tests目录 | contract/domain/service/integration/support及七module owner | 当前已创建测试文件 |
| harness | clock/ID fake、write spy、failpoint UoW、barrier、external stub、telemetry recorder、conformance runner | 具体框架/fixture已实现 |
| protocol coverage | 16/14/9/12/9 positive + abnormal | tests已通过 |
| state coverage | 27 state + plan item legal/illegal/terminal/reserved | coverage百分比或执行结果 |
| consistency gates | UoW/index/outbox/result/plan/intent/report/no-write | 由log/metric替代formal assertion |
| concurrency IDs | Step 13/16的25个`TC-OBS-*` | evidence / run / pass状态 |
| safety checks | redaction、metric labels、dependency、self-recursion | checker已存在或已运行 |
| script paths | §19五个planned script contract | 真实artifact/report/evidence |
| implementation repo | 先确认或创建`/home/aris/Projects/quantalithos-observability` | 设计阶段已实现代码 |

## 22. 正式文档回填草稿

正式`03-详细设计.md`第15章在Step 19装配时建议采用:

```md
## 15. 测试切口与最小验证清单

### 15.1 测试层次与最小 harness
### 15.2 模块测试切口
### 15.3 Command / Query 接口切口
### 15.4 Inbound / Outbound / Job 接口切口
### 15.5 状态机测试切口
### 15.6 事务、一致性、错误与恢复切口
### 15.7 并发、幂等与重入切口
### 15.8 配置、运行时、观测与安全切口
### 15.9 脚本契约与后续承接
```

正式章节必须保留:

1. 七模块均有明确测试owner。
2. 60个协议surface逐项positive / abnormal。
3. 27个状态机和plan item逐项legal / illegal。
4. Query全surface zero-write。
5. accepted UoW与native audit原子,telemetry failure不回滚。
6. duplicate/in-flight/conflict/commit unknown不重跑副作用。
7. staged Job、claim/fence、external token/probe/finalize-only可failure-inject。
8. redaction、metric low-cardinality和self-recursion可自动检查。
9. 脚本路径只是planned contract,不表示真实run/evidence。

## 23. 待确认事项与 blocker

| 事项 | 当前处理 | 是否阻塞Step 16 |
|---|---|---|
| exact test framework / assertion library | 后移implementation / `05` | 否 |
| durable adapter / external sandbox availability | 后移integration environment | 否 |
| test data、fixture、priority、coverage、CI topology | 后移`05` | 否 |
| script实现与artifact schema | 后移Step 17 / `05/07` | 否 |
| performance / capacity / SLO数值 | 后移`05/06`,当前无来源硬指标 | 否 |
| target implementation repo当前未发现 | Step 17 / `07` implementation precondition | 否 |
| I05 payload schema / producer binding | 保持 `open_upstream_internal`；当前仅定义slot不激活和zero-write/ack-default切口 | 否，阻塞I05 positive runtime path，不阻塞本Step设计记录 |
| J06 H13 owner / execution record | 保持 `open_controlled`；当前仅定义Blocked/manual/no-source-write切口 | 否，阻塞J06 positive completion，不阻塞本Step设计记录 |
| 其余 inherited affected | 按§6.1继续传播到Step17/18/`05~07` | 否，阻塞对应owner/boundary的无条件实现声明 |

## 24. 最终自检

| 检查项 | 结论 |
|---|---|
| 是否读取Step 16 SOP / 5.15 / Step 05~15 | pass |
| 是否全量替换旧37行historical material | pass |
| 是否输出模块测试切口汇总表 | pass |
| 是否输出接口测试切口汇总表 | pass |
| 是否输出状态机测试切口表 | pass |
| 是否输出一致性/幂等测试切口表 | pass |
| 是否为每个Command/Query/Event/Job提供positive和abnormal | `pass_with_affected_open`；I05/J06 positive明确为reserved gate，不伪造可达性 |
| 是否覆盖27状态机legal/illegal/terminal/reserved | pass |
| 是否保留Step 13的25个正式测试ID | pass |
| 是否覆盖config/runtime/adapter/observability/redaction/self-recursion | pass |
| 是否输出脚本契约且未创建脚本 | pass |
| 是否避免伪造run/artifact/evidence/result/signoff | pass |
| 是否修改正式`03-详细设计.md` | no |
| 是否发现新的上游blocker | no；既有I05上游blocker与H13受控项保持开放 |

## 25. 门禁

| gate | 状态 | 说明 |
|---|---|---|
| Step 16输入门禁 | pass | SOP、书写规范、Step 05~15与参考粒度已读取 |
| Step 16内容门禁 | `pass_with_affected_open` | module/interface/state/consistency/idempotency/config/observability/script切口已形成；I05/J06与inherited affected使用blocked-path契约 |
| 新的上游blocker | none | 未发现新项；既有I05/H13及其余affected不得关闭 |
| 测试执行门禁 | not_run_by_design | 本文件只定义入口,不声称测试执行 |
| 正式文档门禁 | blocked_until_step_19 | 本Step不修改正式`03-详细设计.md` |
| Step切换门禁 | consumed_within_user_authorized_M3 | 用户已授权一次完成M3；仅允许Step 17继续消费，不得跳到Step 18或正式装配 |

当前恢复点:

```text
03-详细设计 / Step 16 测试切口与最小验证清单
gate_status = completed_design_record_with_affected_open
next_allowed_action = continue_M3_step_17_under_current_user_authorization
```
