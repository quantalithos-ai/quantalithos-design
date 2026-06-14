# Step 7. 定义接口、事件与跨仓同步验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 7
> 回填章节: `06-验收标准.md` §7 接口、事件与跨仓同步验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 定义接口、事件与跨仓同步验收 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~6 已审核通过;新版 `00` 接口 / 依赖边界、`03` Step 7/8/9 protocol / port / flow、`05` interface / event / job evidence |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_07_interface_sync_gate.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 8 |

## 2. 本步目标

把 Command、Query、Inbound Event / Callback、Outbound Event、Operations Job 和跨仓依赖接缝转成可裁决的接口同步验收门禁。

本 Step 只定义接口、事件和跨仓同步验收:

- 6 个 Command 的 request / result / stored replay surface。
- 14 个 Query 的 visibility-first、read-only 和 degraded / missing / not-visible surface。
- 5 个 Inbound Event / Callback 的 envelope、schema version、receipt replay 和 no implicit create。
- 10 个 canonical Outbound Event material 的 accepted-only、payload marker 和 publish/replay surface。
- 6 个 Operations Job 的 job request / report / duplicate replay / recovery surface。
- 编译期、运行期、事件协作依赖的不同验收证据方式。

状态迁移、事务原子性和幂等矩阵细节留到 Step 8;证据完整性和 report audit 留到 Step 10;VETO 最终裁决留到 Step 11。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_05_function_gate.md` | 已审核通过 | 提供 `AC-FUNC-*` 功能能力与接口族关系 |
| `06_acceptance_step_06_boundary_gate.md` | 已审核通过 | 提供 no-write、no-repair、body-free、dependency boundary 红线 |
| `00-需求文档.md` §12 | 正式输入 | 提供 `IF-ID-001~009` 与 `DEP-ID-001~007` |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 正式输入 | 提供 `L1-identity` 编译期 / 运行期 / 事件协作依赖分类 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已审核通过 | 提供 port / adapter / facade / fake parity 接缝边界 |
| `03_ddd_step_08_protocol_contracts.md` | 已审核通过 | 提供 6 Command、14 Query、5 Consumer / Callback、10 Outbound Event、6 Job protocol surface |
| `03_ddd_step_09_function_flows.md` | 已审核通过 | 提供逐接口 flow、duplicate replay、query no-write、publish / handoff / job recovery 规则 |
| `05-测试方案.md` §6 / §9 / §13 | 正式输入 | 提供 `TC-ID-*`、blocking suite、formal `EV-ID-*` 和 report path |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 Command / Query 如何验收? | Command 以 `IdentityCommandRequest<T>` / `IdentityCommandOutcome<T>`、stored command result、accepted side effect 和 duplicate replay 为验收面;Query 以 `IdentityQueryRequest<T>` / `IdentityQuerySurface`、visibility-first、stable lookup 和 zero-write audit 为验收面。 |
| 每个 P0 Event 如何证明可消费 / 可重放? | Inbound event / callback 必须通过 `IdentityInboundEventEnvelope<T>`、schema version、source event ref、idempotency key、typed receipt 和 stored receipt replay 证明;Outbound event 必须通过 saved outbox record、payload marker、topic key、accepted source 和 publish/replay job report 证明。 |
| 每个 P0 Job 如何证明幂等和恢复? | Operations job 必须从 `IdentityJobRequest<T>` 进入 application facade,保存 `IdentityJobReportSurface` / `IdentityJobRunReport`,duplicate 只 replay stored report,partial / failed / retryable branch 保留 safe issue refs。 |
| 跨仓同步成功标准是什么? | P0 只要求本仓正式接缝成立:compile dependency 只到 core contracts;runtime seam 通过 resolver / adapter / availability surface;event seam 通过 body-free outbound material、publisher outcome、receipt / report / replay evidence。不得要求下游仓完整业务实现。 |
| 下游未就绪时如何验接缝? | 使用 fake / controlled / disabled adapter 与 formal failure / degraded / unavailable surface。下游未就绪不阻断 P0,但 adapter disabled 后不得伪造 success,也不得把 selected-run unavailable 写成 P0 pass。 |
| 跨仓验收项属于什么依赖类型? | `L0-core` 属编译期依赖;`L0-bus` 属事件协作依赖;method/work/lifecycle-basis/memory/archive/observability 等相邻能力属运行期 / 事件协作依赖,只通过 port、event、adapter、receipt、report 验接缝。 |
| 每类依赖应使用什么证据? | 编译期依赖用 `dependency-boundary` / `EV-ID-ARCH-001`;运行期依赖用 service / worker / job suite 和 fake / controlled adapter evidence;事件协作用 outbox / consumer / operations replay evidence。 |
| 每个验收项是否回指正式协议字段、状态名和测试证据? | 本 Step 用 `AC-SYNC-*` 聚合正式 protocol family,并在闭环表中给出 flow / protocol、TC、EV、report path 和裁决影响。 |
| 每个接口 / event / job 是否有固定 surface、测试用例、证据和 report path? | Command、Query、Consumer / Callback、Outbound、Job、dependency seam 均绑定正式 surface、TC family、formal EV 和 `reports/runs/<run_id>/...` path。 |
| 下游未就绪时裁决如何处理? | P0 fake / controlled / disabled seam 通过且 no fake success 时可通过;真实 product / selected-run 不可用只进入 Step 13 residual,不得覆盖 P0 evidence。 |
| 每个接口 / 事件验收项是否停审? | 本 Step 为 `AC-SYNC-001~008` 建立停审记录。 |
| 是否存在依赖类型误判、下游完整实现误要求、证据缺失或协议名漂移? | 初步审计结论为无 unresolved 冲突。状态 / 事务 / evidence completeness 将在 Step 8 / Step 10 再审。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 使用旧 Command / Query / Event / Operations 名称和旧验收对象 | 新版全部改用 `03` Step 8/9 正式 protocol / flow 名称 |
| `00` §12 | 只定义能力接口和依赖类型,不定义 API / DTO | 本 Step 只把能力接口映射到正式 protocol family,不反向修改需求层 |
| `03` Step 8 | protocol 数量多,若全量复制会膨胀 | 本 Step 聚合成 `AC-SYNC-*`,但闭环表保留正式 protocol family |
| `03` Step 9 | flow 细节覆盖事务 / 状态 / 幂等 | 本 Step 只验接口 surface 和跨仓接缝;事务状态留 Step 8 |
| `05` §13 | formal EV 是 suite 级 evidence | 本 Step 使用 suite-level formal EV,不使用候选 EV 名 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 接口验收粒度 | 旧草案按历史 API / Event / Job 分散 | 新版按 Command、Query、Consumer / Callback、Outbound、Job 和 dependency seam 聚合 | 对齐 `03` protocol family |
| 跨仓同步 | 旧草案容易要求 mock/stub 或下游完整行为 | 新版按编译期 / 运行期 / 事件协作分别裁决 | 符合 SOP Step 7 |
| Event 验收 | 旧草案只看 event log | 新版区分 inbound receipt replay、outbound accepted material 和 publish boundary | 支撑 duplicate / replay 裁决 |
| Job 验收 | 旧草案只看 job 可执行 | 新版要求 job request / report / stored replay / partial failure / no repair | 支撑恢复语义 |
| 证据引用 | 旧草案泛写 trace / log / DB | 新版绑定 formal `EV-ID-*` 和 fixed report path | 可复验 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否把 41 个协议面逐个写成验收项 | A. 逐个;B. 聚合为接口族门禁并在闭环表列协议范围 | 采用 B。正式验收章保持可裁决,细节回指 `03` Step 8/9。 |
| 是否要求下游仓真实实现可消费 | A. 要求;B. 只要求本仓正式 seam、fake / controlled / replay evidence | 采用 B。P0 不验下游完整实现。 |
| 是否把 job 幂等矩阵放入本 Step | A. 放入;B. 本 Step 只验 job surface 和 report replay,矩阵留 Step 8 | 采用 B。避免与状态 / 事务一致性门禁混杂。 |
| 是否把 topic / route 物理名写死 | A. 写死 broker route;B. 使用 Step 8 `topic_key` / `schema_version` marker,产品绑定留配置 | 采用 B。P0 验 protocol marker 和 topic binding,不验真实 broker 产品。 |

## 8. 结构化中间产物

### 8.1 接口 / 事件 / 同步验收表

| 验收项 ID | 接口 / 事件 / 下游 | 全局依赖类型 | 协作方式 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| `AC-SYNC-001` | Command protocol and command entry | 同步写入能力边界 | `IdentityCommandRequest<T>` -> application facade -> `IdentityCommandOutcome<T>` / stored result | 6 个 Command 均使用正式 request/result surface;accepted / rejected / duplicate / conflict 均有 stored surface;entry 不直连 repository | 使用未定义 DTO 字段;entry 绕过 application;duplicate 重跑 mutation;command accepted 缺 stored result | `EV-ID-CMD-001`;`EV-ID-IDEMP-001`;`reports/runs/<run_id>/suites/service-flow-fast.md` |
| `AC-SYNC-002` | Query protocol and read surface | 同步查询能力边界 | `IdentityQueryRequest<T>` -> visibility resolver -> truth/view/report read -> `IdentityQuerySurface` | 14 个 Query 均 visibility-first;missing / empty / not-visible / degraded / stale / rebuilding 有正式 surface;write-audit 为零 | query 创建 truth、reserve idempotency、append trace/audit、rebuild projection、refresh reference 或 publish / deliver | `EV-ID-QUERY-001`;`reports/runs/<run_id>/suites/service-flow-fast.md` |
| `AC-SYNC-003` | Inbound Event / Callback consumer surface | 运行期 / 事件协作依赖 | `IdentityInboundEventEnvelope<T>` + typed payload + `IdentityConsumerReceipt` | 5 个 Consumer / Callback 校验 envelope、schema version、source event ref、idempotency key;accepted / duplicate / delayed / quarantined / rejected / noop receipt 可 replay | unsupported schema 仍 parse payload;missing target 隐式创建 truth;duplicate 不读 stored receipt;保存外部正文或 raw callback body | `EV-ID-CONSUMER-001`;`EV-ID-IDEMP-001`;`reports/runs/<run_id>/suites/entry-worker-job.md` |
| `AC-SYNC-004` | Outbound event material and publish boundary | 事件协作依赖 | accepted fact -> `IdentityOutboxRecord` + payload marker -> `PublishIdentityOutboxFlow` | 10 个 canonical outbound material 均来自 accepted command / consumer / callback;payload body-free;publisher 只用 saved outbox + payload marker + topic binding;Published 不等于 downstream consumed | rejected/query/retry-only path 生成 accepted event;publisher 回读 current truth 重构 payload;payload 含外部 body / secret;publish failure 回滚 accepted truth | `EV-ID-OUTBOX-001`;`EV-ID-JOB-001`;`reports/runs/<run_id>/suites/operations-replay-core.md` |
| `AC-SYNC-005` | Operations Job protocol and recovery surface | 后台维护能力边界 | `IdentityJobRequest<T>` -> application job service -> `IdentityJobResponse<T>` / report replay | 6 个 Job 均经 application facade;job report 含 item refs、counts、issue refs;duplicate replay stored report;partial / failed / retryable branch 可复核;job 不修 business truth | job runner 直连 store / publisher / handoff;duplicate 重扫 repository;report 只返回 bool / raw log;job 修 identity 或相邻 truth | `EV-ID-JOB-001`;`EV-ID-IDEMP-001`;`reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` |
| `AC-SYNC-006` | Handoff / receipt seam | 运行期 / 事件协作依赖 | `PrepareTraceHandoff` / `DeliverTraceHandoff` / `HandleTraceHandoffResult` | handoff prepare 只创建 pending intent;delivery 只用 safe material;Delivered 必须有 formal attempt + receipt marker;callback duplicate replay stored callback receipt | command 直接 delivery;HTTP 2xx / request sent / job log success 推进 delivered;保存 archive package、target private path、receipt body 或 adapter raw response | `EV-ID-CMD-001`;`EV-ID-CONSUMER-001`;`EV-ID-JOB-001`;`reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` |
| `AC-SYNC-007` | Cross-repo dependency seam | 编译期 / 运行期 / 事件协作依赖 | core contracts compile;resolver / adapter;event / receipt / report | 编译期只允许 core contracts;method/work/lifecycle-basis/memory/archive/observability 通过 resolver、event、adapter、receipt、report 协作;disabled / unavailable 有 formal surface | 非 core sibling business compile dependency;共享数据库事务;fake/disabled adapter 伪造 success;下游未就绪被写成 P0 pass | `EV-ID-ARCH-001`;`EV-ID-CONFIG-001`;`EV-ID-CONSUMER-001`;`reports/runs/<run_id>/dependency-boundary.md` |
| `AC-SYNC-008` | Protocol name / schema / topic marker stability | public protocol contract | `Identity*Name`, schema version, topic key, route / job catalog marker | public DTO roundtrip 保留 name、schema version、metadata、payload marker、topic key、result / receipt / report refs;handler / worker / job catalog 与 `03` protocol inventory 一致 | 协议名漂移;topic marker 缺失或 fallback;handler 以字符串猜 operation channel;public DTO 暴露 domain-only / application-local type | `EV-ID-CONTRACT-001`;`EV-ID-OUTBOX-001`;`reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` |

### 8.2 正式协议 / 测试 / 证据闭环表

| 验收项 ID | 正式协议 / topic / job | 测试用例 | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|
| `AC-SYNC-001` | `EstablishGlobalMember`;`UpdateGlobalLifecycleState`;`MaintainRoleCapabilitySummary`;`AppendCareerRecord`;`MaintainMemoryReference`;`PrepareTraceHandoff` | `TC-ID-CMD-001~015`;`TC-ID-IDEMP-*` | `EV-ID-CMD-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` | Command surface 失败导致不通过;ref reuse / high-risk basis / duplicate rerun 进入 Step 11 |
| `AC-SYNC-002` | `GetGlobalMemberAnchor`;`GetGlobalLifecycleSummary`;`GetRoleCapabilitySummary`;`ListCareerRecords`;`ListMemoryReferences`;`ReadMemberSummary`;`ReadIdentityTrace`;`ReadAuditTrail`;`GetProjectionState`;`GetReferenceResolutionState`;`ReadReconciliationReport`;`ListPendingIdentityOutbox`;`GetIdentityOutboxState`;`GetTraceHandoffState` | `TC-ID-QUERY-001~015` | `EV-ID-QUERY-001` | `reports/runs/<run_id>/suites/service-flow-fast.md` | Query write 或 visibility leak 导致不通过;implicit create 进入 Step 11 |
| `AC-SYNC-003` | `HandleRoleCapabilitySourceChanged`;`HandleWorkParticipationAccepted`;`HandleMemoryReferenceSourceStateChanged`;`HandleArchiveHandoffResult`;`HandleTraceHandoffResult` | `TC-ID-CONSUMER-001~006`;`TC-ID-IDEMP-*` | `EV-ID-CONSUMER-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` | Consumer/callback receipt replay 缺失或隐式创建导致不通过 |
| `AC-SYNC-004` | `GlobalMemberEstablished`;`IdentityAnchorChanged`;`GlobalLifecycleChanged`;`GlobalMemberAvailabilityChanged`;`RoleCapabilitySummaryChanged`;`RoleCapabilitySourceStateChanged`;`CareerRecordAppended`;`CareerCorrectionAppended`;`MemoryReferenceChanged`;`MemoryArchiveHandoffStateChanged`;`PublishIdentityOutbox` | `TC-ID-OUTBOX-001~010`;`TC-ID-JOB-*` | `EV-ID-OUTBOX-001`;`EV-ID-JOB-001` | `reports/runs/<run_id>/suites/operations-replay-core.md` | Accepted-only / body-free / publish boundary 失败导致不通过 |
| `AC-SYNC-005` | `RebuildIdentityProjection`;`RefreshExternalReferenceState`;`RunIdentityReconciliation`;`PublishIdentityOutbox`;`DeliverTraceHandoff`;`RetryIdentityPropagationFailures` | `TC-ID-JOB-001~008`;`TC-ID-IDEMP-*` | `EV-ID-JOB-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | Job runner bypass、no report replay 或 truth repair 导致不通过 |
| `AC-SYNC-006` | `PrepareTraceHandoff`;`DeliverTraceHandoff`;`HandleTraceHandoffResult`;`MemoryArchiveHandoffStateChanged` | `TC-ID-CMD-011~012`;`TC-ID-CONSUMER-005`;`TC-ID-JOB-004~005` | `EV-ID-CMD-001`;`EV-ID-CONSUMER-001`;`EV-ID-JOB-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | Delivered marker 缺 formal receipt 或保存 body 导致不通过 |
| `AC-SYNC-007` | `DEP-ID-001~007`;application ports;adapter availability;dependency boundary | `TC-ID-ARCH-001`;`TC-ID-CONFIG-*`;`TC-ID-CONSUMER-*`;`TC-ID-JOB-*` | `EV-ID-ARCH-001`;`EV-ID-CONFIG-001`;`EV-ID-CONSUMER-001`;`EV-ID-JOB-001` | `reports/runs/<run_id>/dependency-boundary.md`;`reports/runs/<run_id>/suites/config-redline.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | compile dependency loop 进入 Step 11;runtime fake success 导致不通过 |
| `AC-SYNC-008` | shared protocol helper、schema version、topic key、route / job catalog marker | `TC-ID-CONTRACT-001~004`;`TC-ID-OUTBOX-*`;`TC-ID-JOB-*` | `EV-ID-CONTRACT-001`;`EV-ID-OUTBOX-001`;`EV-ID-JOB-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 协议名 / schema / marker 漂移导致不通过或阻断正式证据 |

### 8.3 跨仓依赖类型与验收方式映射表

| 依赖编号 | 对方 / 能力 | 依赖类型 | P0 验收方式 | 不要求 |
|---|---|---|---|---|
| `DEP-ID-001` | `L0-core` shared refs / actor / trace / metadata | 编译期依赖 | contract compile、DTO roundtrip、dependency-boundary report | 不要求相邻业务仓源码依赖 |
| `DEP-ID-002` | `L0-bus` identity change collaboration | 事件协作依赖 | outbox payload marker、topic key binding、publish outcome、replay report | 不要求真实 broker 产品或下游已消费 |
| `DEP-ID-003` | method source for role / capability | 运行期 / 事件协作依赖 | resolver / source event envelope、safe summary、source state、receipt replay | 不保存 role / capability definition body |
| `DEP-ID-004` | work participation source | 运行期 / 事件协作依赖 | work source marker、career append idempotency、consumer receipt | 不拥有 Project / WorkItem / ProjectMember truth |
| `DEP-ID-005` | high-risk lifecycle basis | 运行期 / 事件协作依赖 | basis resolver / basis ref unavailable branch、command rejection / degraded surface | 不接管外部 decision truth |
| `DEP-ID-006` | memory / archive reference migration | 运行期 / 事件协作依赖 | memory / archive refs、handoff target / receipt marker、callback receipt | 不保存 memory body、archive package、receipt body |
| `DEP-ID-007` | observability / audit handoff | 运行期 / 事件协作依赖 | safe trace / audit / report / handoff marker、body-free evidence | 不把 log / metric 当业务 audit truth |

### 8.4 接口 / 事件验收项停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `AC-SYNC-001` | Command protocol、flow、TC / EV、duplicate replay | 通过 | 事务原子性细节留 Step 8 |
| `AC-SYNC-002` | Query protocol、visibility、no-write、TC / EV | 通过 | field-level redaction 留 Step 10 |
| `AC-SYNC-003` | Consumer / callback envelope、receipt replay、no-create | 通过 | outcome priority 细节留 Step 8 / Step 12 |
| `AC-SYNC-004` | Outbound accepted material、topic marker、publish boundary | 通过 | durable payload snapshot 细节非本 Step |
| `AC-SYNC-005` | Job request / report / duplicate replay / recovery | 通过 | job state matrix 和 idempotency matrix 留 Step 8 |
| `AC-SYNC-006` | Handoff prepare / delivery / callback receipt | 通过 | target config / schedule 留配置与后续实施 |
| `AC-SYNC-007` | compile / runtime / event dependency classification | 通过 | selected-run residual 留 Step 13 |
| `AC-SYNC-008` | protocol name、schema version、topic / route / job marker | 通过 | route physical binding 不进入 P0 |

### 8.5 跨接口同步门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否覆盖 6 个 Command | 通过 | `AC-SYNC-001` |
| 是否覆盖 14 个 Query | 通过 | `AC-SYNC-002` |
| 是否覆盖 5 个 Consumer / Callback | 通过 | `AC-SYNC-003` |
| 是否覆盖 10 个 Outbound Event material | 通过 | `AC-SYNC-004` |
| 是否覆盖 6 个 Operations Job | 通过 | `AC-SYNC-005` |
| 是否覆盖 handoff / receipt seam | 通过 | `AC-SYNC-006` |
| 是否区分编译期、运行期、事件协作依赖 | 通过 | `AC-SYNC-007` |
| 是否误要求下游完整实现 | 通过 | 只验本仓 formal seam 和 fake / controlled evidence |
| 是否存在协议名 / schema / topic marker 漂移 | 通过 | `AC-SYNC-008` |
| 是否提前替代 Step 8 / Step 10 / Step 11 | 通过 | 状态事务、证据完整性和 VETO 留后续 Step |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 接口、事件与跨仓同步验收足够进入 Step 8 | 否 | interface / event / dependency seam 闭合 | 无需回写 |
| `00` 需求层能力接口未定义 DTO 是合理边界 | 否 | Step 7 只消费正式 `03` protocol | 无需回写 |
| 若 Step 8 发现 job / consumer outcome state 无法裁决 | 是 | 状态 / 事务缺口 | Step 8 暂停并回对应设计 Step |
| 若 Step 10 发现 formal EV 缺 artifact/report pairing | 是 | 证据门禁缺口 | Step 10 阻断 |
| 若 Step 11 确认 implicit create、dependency loop 或 forbidden body | 是 | 一票否决影响 | Step 11 / Step 14 不得通过 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_07_interface_sync_gate.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“接口 / 事件 / 同步验收表”“正式协议 / 测试 / 证据闭环表”“跨仓依赖类型与验收方式映射表”“接口 / 事件验收项停审记录”和“跨接口同步门禁审计表”小节,了解接口、事件和跨仓同步验收如何从正式 protocol、flow、依赖裁剪和测试证据收敛。

正式 `06-验收标准.md` §7 应回填:

- 接口、事件与跨仓同步验收按 `AC-SYNC-001~008` 组织。
- 每个验收项必须给出正式 protocol / event / job surface、依赖类型、协作方式、通过条件、失败条件、TC、EV、report path 和裁决影响。
- Command、Query、Consumer / Callback、Outbound Event、Operations Job、handoff / receipt 和 cross-repo dependency seam 分别裁决。
- P0 只验本仓正式 seam、fake / controlled / replay evidence 和 dependency boundary;不得要求下游完整实现、真实 product adapter 或 production-like route。
- 本章不裁决状态矩阵、事务原子性、证据完整性和 VETO 最终结论。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 8 是否需要把 `AC-SYNC-003` consumer outcome priority 细化为状态 / 事务验收项 | 影响 delayed / quarantined / noop / rejected 裁决 | Step 8 处理 |
| Step 8 是否需要把 job duplicate replay 与 job result kind 拆成独立 `AC-IDEM-*` | 影响一致性验收粒度 | Step 8 处理 |
| Step 10 是否所有 protocol / event / job suite 都有 artifact/report pairing | 影响本 Step 可裁决性 | Step 10 处理 |
| Step 13 如何记录真实下游 selected-run unavailable | 影响有条件通过 / residual 风险 | Step 13 处理 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 接口 / 事件 / 同步验收表完成 | 通过 | 见 §8.1 |
| 每个验收项有正式 protocol / TC / EV / report path | 通过 | 见 §8.2 |
| 跨仓依赖类型与验收方式已区分 | 通过 | 见 §8.3 |
| 接口 / 事件验收项已停审 | 通过 | 见 §8.4 |
| 跨接口同步门禁审计无 unresolved 冲突 | 通过 | 见 §8.5 |
| 未提前替代 Step 8~11 | 通过 | 状态、证据和 VETO 留后续 Step |
| 可进入 Step 8 | 通过 | 用户已确认,进入 Step 8: 定义状态机、事务与一致性验收 |
