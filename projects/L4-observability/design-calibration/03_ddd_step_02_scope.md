# L4-observability 03-详细设计 Step 02 · 明确本轮实现范围和非范围

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 02
> 回填章节: `03-详细设计.md` §2 本次详细设计目标与范围
> 当前模式: full-restart
> 当前门禁: Step 02 完成后停审,等待用户确认后才进入 Step 03

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 02 `明确本轮实现范围和非范围` |
| 输出文件 | `design-calibration/03_ddd_step_02_scope.md` |
| flow 文件 | `design-calibration/03_ddd_calibration_flow.md` |
| Step 状态 | done |
| 正式回填状态 | blocked_until_step_19 |
| gate_status | pass |
| next_allowed_action | wait_user_confirmation_before_step_03 |

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 02 | 已读取 | 约束本步只输出设计目标表和非范围表,不得写排期或开发任务拆分 |
| `standards/document/详细设计书写规范.md` 5.2 | 已读取 | 约束目标必须是实现契约目标,交付结果必须能转为代码文件、类型、函数、schema、测试或实现检查项 |
| `design-calibration/03_ddd_step_01_upstream_boundary.md` | 已完成 | 提供上游关系、本文不再回答、本文必须回答和输入不足风险 |
| `projects/L4-observability/02-概要设计.md` §2 | 当前正式概要范围 | 提供 `02` 交付给 `03` 的代码主体、组成部分、对象、接口、flow、状态和配置影响轮廓 |
| `projects/L4-observability/02-概要设计.md` §12 | 当前详细设计承接清单 | 提供 `03` 必须继续展开的对象、接口、flow、状态、事务、错误、配置和测试方向 |
| `projects/L4-observability/02-概要设计.md` §13 | 当前概要风险与待确认事项 | 提供本步需要后移或保守处理的产品、指标、对象落点、交接格式和 implementation boundary 问题 |
| `02_hld_step_12_detailed_design_handoff.md` | 当前概要承接产物 | 作为本步范围拆分的主输入 |
| `02_hld_step_13_risks_open_questions.md` | 当前概要风险产物 | 用于区分本轮详细设计范围、后续文档范围和后续版本范围 |
| 旧 `03_ddd_step_02_scope.md` | historical material | 旧文件只有短 schema 摘要,不得作为当前范围来源 |
| `projects/L1-governance/design-calibration/03_ddd_step_02_scope.md` | 已读取 | 作为目标表、覆盖范围、非范围和实现者可完成范围的粒度参考 |
| `projects/L1-artifact/design-calibration/03_ddd_step_02_scope.md` | 已读取 | 作为“当前轮覆盖核心闭环和必要接缝,下游文档后移”的粒度参考 |

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 02 标准、书写规范、Step 01、正式 `02` §2 / §12 / §13 和 L1 参考 | done | 本文件 §2 |
| 回答 SOP Step 02 五个问题 | done | 本文件 §4 |
| 诊断旧 Step 02 与范围漂移风险 | done | 本文件 §5 |
| 输出改动前后对比和设计取舍 | done | 本文件 §6~§7 |
| 输出设计目标表、覆盖范围表、非范围表和实现者可完成范围 | done | 本文件 §8 |
| 形成正式 §2 回填草稿 | done | 本文件 §9 |
| 完成自检、flow / 台账同步和 Step 03 门禁 | done | 本文件 §10~§11 |

## 4. SOP 问题回答

### 4.1 本轮详细设计必须覆盖哪些模块?

本轮 `03-详细设计.md` 必须覆盖当前正式 `02` 已收稳的核心可落码闭环和必要接缝。详细设计的模块划分仍将在 Step 04 / Step 05 正式确定,但本步先锁定范围:后续模块必须完整覆盖 10 个业务主要组成部分,并落到实现分层。

必须覆盖的业务主轴:

- `Observation Intake and Safety`
- `Correlation and Safe Signal`
- `Audit Projection and Body-free Evidence Linkage`
- `Report Handoff and Authenticity`
- `Retention, Replay and No-write Guard`
- `Read Query and Diagnostic Consumption`
- `Gap and Degraded Expression`
- `Peripheral Consumption and Export`
- `Product-neutral Adapter and Reference Support`
- `Derived Maintenance and Replay Coordination`

必须覆盖的实现主轴:

- inbound / operations entry:
  同步 command entry、异步 material consumer、projection maintenance、reference refresh、gap scan、rollup rebuild、outbox publish、handoff / export preparation job。
- application service:
  `ObservationIntakeService`、`CorrelationSignalService`、`AuditEvidenceService`、`ReportHandoffService`、`RetentionReplayGuardService`、`ObservationReadQueryService`、`DiagnosticViewService`、`GapVisibilityService`、`PeripheralConsumptionService`、`DerivedMaintenanceService`。
- domain model / policy:
  observation-owned fact、safe signal、audit projection、body-free evidence linkage、handoff marker、retention marker、gap / degraded、reference snapshot、no-write violation 和 policy / guard。
- contracts / protocol surface:
  Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 的 DTO、receipt、view、event payload、job report、metadata、idempotency 和 error surface。
- ports / persistence / projection / outbox / handoff:
  truth store、projection store、read model store、reference snapshot store、handoff outbox store、history / audit record store、external reference port 和 product-neutral adapter port。
- configuration binding、observability / audit hook、test cut、implementation handoff:
  只定义代码引用、绑定点、最小测试切口和实施承接输入,不替代 `04~07`。

### 4.2 本轮必须定义哪些对象、接口、事件、job 和状态机?

本轮必须把概要设计第 6~9 章已经点名的主语全部展开为可落码契约,但不新增概要主语。

必须定义的对象族:

- truth / signal / audit:
  `ObservationReceipt`、`SafetyDisposition`、`CorrelationContext`、`SafeSignal`、`SignalRollupWindow`、`AuditProjection`、`EvidenceLinkage`。
- truth guard / consumption:
  `ReportHandoffRecord`、`AuthenticityHint`、`HandoffReadinessState`、`RetentionMarker`、`ActiveReferenceProtection`、`ReplayScope`、`NoWriteViolation`、`ReadVisibilityState`、`DiagnosticSummary`、`DiagnosticScope`、`GapState`、`DegradedOutputState`、`PeripheralDeliveryState`、`ExternalAuditExportPreparation`。
- policy / invariant / guard:
  intake admission、safety disposition、safe signal、body-free linkage、evidence visibility、handoff readiness、authenticity hint、retention protection、replay boundary、no-write guard、read visibility、gap classification、degraded output、peripheral export、reference freshness、adapter boundary、derived maintenance、replay coordination 等 policy。
- projection / read model:
  intake status、safe signal projection、signal rollup、audit timeline、evidence index input、observation read model、diagnostic view、gap status、dashboard / alert export view、reference snapshot view、rebuild progress view。
- reference / boundary / context:
  observation source ref、runtime / sandbox signal ref、governance / artifact / evidence reference、report consumer ref、protected observation ref、diagnostic request context、gap source ref、peripheral consumer ref、subject observation reference、archive report handoff ref、maintenance target ref。
- audit / history / record:
  intake decision、correlation link、audit append、handoff lifecycle、retention change、no-write violation、read access、gap transition、peripheral delivery、reference refresh、projection maintenance、gap scan、replay execution records。

必须定义的接口与协议族:

- Command:
  `SubmitObservationMaterial`、`RecordSafetyDisposition`、`BindCorrelationContext`、`RecordSafeSignal`、`AppendAuditProjection`、`LinkBodyFreeEvidence`、`PrepareReportHandoff`、`EvaluateAuthenticityHint`、`SetRetentionMarker`、`ProtectActiveReference`、`DefineReplayScope`、`RecordNoWriteViolation`、`RecordGapState`、`PrepareExternalAuditExport`、`RegisterReferenceSnapshot`、`UpdateReferenceSnapshotState`。
- Query:
  `GetObservationReceipt`、`GetIntakeStatus`、`GetSafeSignal`、`GetSignalRollup`、`GetAuditTimeline`、`GetEvidenceIndexInput`、`GetReportHandoff`、`GetRetentionProtection`、`GetObservationReadModel`、`GetDiagnosticView`、`GetGapStatus`、`GetPeripheralExportView`、`GetReferenceSnapshotView`、`GetRebuildProgress`。
- Inbound Event Consumer:
  bus observation material、source audit material、identity observation context、governance audit context、artifact evidence context、runtime signal summary、archive handoff feedback、report consumer feedback。
- Outbound Event:
  observation receipt changed、safe signal recorded、audit projection appended、evidence linkage changed、report handoff changed、no-write violation recorded、gap state changed、reference snapshot changed、peripheral delivery changed。
- Operations Job:
  publish observation outbox、rebuild observation read models、rebuild signal rollups、refresh reference snapshots、scan observation gaps、coordinate observation replay、prepare report handoff delivery、prepare external audit export、rebuild peripheral views。

必须定义的状态机范围:

- intake / safety admission
- correlation / safe signal / rollup
- audit projection / evidence linkage
- report handoff / authenticity
- retention / active protection
- replay / no-write guard
- read / diagnostic
- gap / degraded
- peripheral / export
- reference snapshot / adapter
- maintenance / publication

### 4.3 哪些能力属于 P1 / 后续阶段,不应在本轮展开?

以下内容不进入本轮 `03` 正文的完整实现契约。可以保留 adapter seam、reserved extension、风险或后续文档入口,但不得把它们写成当前必须落码的核心闭环:

- 产品专属 APM / OTel / Prometheus / Grafana / TimescaleDB / object store / search / alert / GRC / external audit 深度集成。
- 高级 dashboard、alert routing、management report、external audit / GRC 双向同步和供应商专属字段映射。
- 自动异常修复、自动 source truth repair、自动 remediation、自动 kill / retry / recovery 控制命令。
- raw log / metric / trace body、provider response body、source audit body、evidence body、artifact body、governance decision body、identity body、runtime body 或 archive package 的任何入仓模型。
- 生产容量、P95 / P99 / SLO、retention days、batch size、parallelism、retry number、freshness threshold、digest / canonicalization 算法和旧 hash chain 指标的正式锁定。
- 完整 dashboard / alert UI、运维 runbook、incident response、on-call process 和生产告警阈值。
- implementation ledger、planned boundary skeleton、phase / commit boundary 和提交顺序。

如果后续 Step 发现当前核心闭环必须依赖其中某项,不能在 `03` 中直接补成默认结论;必须回到对应上游文档或下游文档闭口。

### 4.4 哪些内容属于测试方案、实施计划、配置设计或运维手册?

详细设计只定义实现契约和最小验证入口,不替代下游文档:

- `04-配置设计.md`:
  完整配置项、配置 key、默认值、环境变量、secret、profile、产品参数、retention / retry / batch / freshness 数字、配置迁移、配置优先级和高风险配置变更治理。
- `05-测试方案.md`:
  完整测试矩阵、测试数据、fixture、自动化执行脚本、报告产物、证据目录、回归策略、覆盖率目标和测试运行计划。
- `06-验收标准.md`:
  验收 baseline、准入准出、验收 evidence、真实 run、真实 evidence alias、最终判定、signoff、发布门禁和一票否决执行口径。
- `07-实施计划.md`:
  phase / commit boundary、任务拆分、实现前阅读矩阵、提交门禁、执行顺序、回退说明、implementation ledger 和 planned boundary skeleton。
- 运维 / 部署 / ADR:
  部署拓扑、产品选型、容量规划、生产监控阈值、故障处置、on-call 流程、外部产品适配 ADR 和供应商协议。
- 相邻仓文档:
  Governance truth、Artifact / evidence body、Identity lifecycle、Runtime / Sandbox execution、Archive package、Console product behavior 和外部系统正文模型。

### 4.5 实现者拿到本文后,应能完成哪些代码范围?

实现者拿到正式 `03-详细设计.md` 后,应能直接在目标实现仓完成以下代码范围,不再自行猜 truth、字段、状态或 port:

- Rust workspace / crate / module / file skeleton。
- contracts DTO / view / event / job report / receipt / error / typed-ref carrier。
- domain aggregate / entity / value object / state enum / policy / guard / domain error。
- application command / query / consumer / job services 和函数级编排。
- repository / port / adapter / UoW / id generator / clock / config provider / external reference trait。
- fake repository / fake adapter / in-memory projection / minimal runner shell。
- persistence contract、history / audit / trace record、outbox、handoff marker、stored result 和 projection stale marker。
- query read model、diagnostic view、gap view、reference snapshot view、handoff / export preparation view。
- idempotency、dedup、expected version、duplicate replay、conflict handling、retry / dead-letter / quarantine surface。
- module unit tests、DTO roundtrip tests、state transition tests、port contract tests、service flow tests、consumer duplicate tests、query no-write tests 和 forbidden body negative tests 的最小入口。

实现者仍不应在 `03` 之外自行决定:

- 新增 / 删除主要组成部分、关键对象、接口类别、处理流族或状态族。
- 外部产品选型、生产参数、真实 evidence、implementation boundary 或相邻仓 truth schema。
- body 入仓、source truth repair、handoff signoff、query write、consumer truth write 或 job source repair 的例外。

## 5. 当前文档问题诊断

| 材料 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `03_ddd_step_02_scope.md` | 只有 81 行,重复旧 Step 01 的 log / metric / trace / audit schema 主线,没有输出设计目标表和非范围表 | 全量替换为当前 Step 02 范围产物 |
| 旧正式 `03-详细设计.md` | 正文薄,并且旧对象 / schema 主线无法承接当前正式 `02` 的 10 个组成部分、五类接口和 11 组状态族 | 继续作为 historical material,不作为范围来源 |
| 当前正式 `02` §12 | 已给出详细设计承接清单,但尚未转译为 `03` 自身的目标和非范围表 | 本步把承接清单转为详细设计目标、覆盖范围和实现者可完成范围 |
| 当前正式 `02` §13 | 风险、待确认和下游文档缺口混在同一节 | 本步区分 `03` 必须闭口、`04~07` 后移、ADR / 运维后移和后续版本能力 |
| 用户逐 Step 门禁 | 旧 Step 02 使用旧自动顺推口径 | 本步门禁改为 `wait_user_confirmation_before_step_03` |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 范围来源 | 旧 README / 旧 `03` / 旧 schema 可能混用 | 只以当前正式 `00/01/02`、Step 01 和 `02` Step 12 / 13 为范围来源 | 保持 truth source 顺序 |
| 详细设计目标 | 泛化为 observability 能力说明 | 明确为可落码的模块、对象、协议、flow、状态、事务、错误、幂等、配置绑定、观测审计和测试切口契约 | 对齐详细设计书写规范 |
| 非范围 | 未明确归属,容易越界写配置 / 测试 / 实施 | 明确交给 `04/05/06/07`、ADR、运维或相邻仓 | 防止 `03` 变成混合文档 |
| P1 / 后续能力 | 旧材料容易把产品、P95、冷存、hash chain、GRC 深集成写成当前实现 | 当前仅保留 adapter seam / risk / 后续文档入口 | 防止历史材料污染 |
| 实现者预期 | 实现侧仍需猜字段、状态、port 和 boundary | 正式 `03` 完成后应能直接落代码骨架、类型、服务、port、fake、测试入口 | 建立可落码门禁 |

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只覆盖 log / metric / trace / audit schema | 文档量小,贴近旧材料 | 会丢失 body-free evidence、report handoff、retention、no-write、gap、reference、outbox、maintenance 等当前核心闭环 | 不采用 |
| B. 覆盖当前 `02` 已收稳的核心闭环和必要接缝 | 可支撑后续实现,减少实现侧私补 schema / port / state 的风险 | 后续 Step 工作量大,需要严格逐步停审 | 采用 |
| C. 同时写完整配置、测试、验收、实施、运维和产品选型 | 看起来一次性完整 | 混淆文档职责,提前锁定下游证据、产品和 boundary | 不采用 |
| D. 把 P1 高级分析和深度外部产品集成都纳入当前详细设计 | 未来扩展看起来更充分 | 当前没有需求 / 架构 / 概要闭口,会放大 scope 并误导实现 | 不采用 |

## 8. 结构化中间产物

### 8.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳实现组织边界 | 将 10 个业务主要组成部分和实现分层落成当前仓的 module / crate / file / entry / service / store / port 边界 | 实现者可创建 workspace / crate / module / file skeleton,并知道每个模块职责与非职责 |
| 收稳对象契约 | 将概要对象族展开为 exact Rust-facing struct / enum / value object / state / policy / record / error | 实现者可定义 domain、contracts 和 persistence-facing 类型,不自行选择字段和状态 |
| 收稳协议契约 | 将 Command / Query / Consumer / Outbound Event / Job 骨架展开为 DTO、receipt、view、event payload、job report、metadata、idempotency 和 error surface | 实现者可实现 entry handler、consumer handler、job handler 和 contracts crate |
| 收稳处理流与事务 | 将 10 组处理流展开为函数级调用链、validation、load、domain transition、save order、outbox / history / projection stale / stored result 副作用 | 实现者可实现 application service、UoW、repository 调用和 fake infra |
| 收稳状态矩阵 | 将 11 组状态族落为正式 enum、variant、允许 / 禁止迁移、触发函数、非法迁移错误和测试断言 | 实现者可实现 state guard、transition helper 和 state tests |
| 收稳持久化与一致性 | 定义 truth / projection / read model / reference snapshot / history / audit / outbox / handoff store 的 trait、版本、事务和一致性边界 | 实现者可实现 repository trait、fake store、stored result 和 projection rebuild source |
| 收稳错误、并发与幂等 | 定义 error taxonomy、duplicate replay、request digest、dedup key、expected version、conflict、retry、quarantine、dead-letter 和 degraded surface | 实现者可实现 service guard、idempotency store、consumer dedup 和 operations failure surface |
| 收稳配置引用与外部绑定 | 定义代码需要读取的 config carrier、adapter binding、job / consumer / publisher / handoff config 类型和禁止配置化红线 | `04-配置设计.md` 可在不改代码契约的前提下补完整 key、默认值和 profile |
| 收稳观测与审计埋点 | 定义本仓自身 log / metric / trace hook、audit record、handoff marker、evidence linkage marker 和 no-write violation observability | 实现者可实现观测 hook、audit append、trace propagation 和 report handoff marker |
| 收稳测试与实施承接输入 | 给出模块、协议、状态、事务、错误、幂等、配置和 no-write 红线的最小验证切口,并整理给 `07` 的承接输入 | `05/06/07` 可继续扩展为完整测试、验收和实施计划 |

### 8.2 本轮覆盖范围表

| 范围 | 必须覆盖的设计内容 | 后续 Step |
|---|---|---|
| 实现约束与编码规范 | Rust-facing 注释、错误、trait、async / sync、workspace、依赖裁剪、提交和恢复纪律 | Step 03 |
| 实现单元与文件布局 | crate / module / file / binary / entry / service / domain / ports / infra / tests 布局 | Step 04 |
| 模块实现契约 | 10 个业务主要组成部分如何映射为实现模块、能力、对象、service、port、错误和测试切口 | Step 05 |
| 对象实现契约 | truth / signal / audit、guard / consumption、policy、projection、reference、history / record 对象字段、函数、状态和不变量 | Step 06 |
| Trait / Port / Adapter 契约 | repository、UoW、id / clock、external reference、projection、outbox、handoff、config、fake adapter 等 trait | Step 07 |
| 协议契约 | Command、Query、Consumer、Outbound Event、Operations Job 的 DTO、receipt、view、event payload、job report 和 error mapping | Step 08 |
| 函数级处理流 | intake / safety、correlation、audit / evidence、handoff、retention、read / diagnostic、gap、peripheral、reference、maintenance flow | Step 09 |
| 状态机与转换矩阵 | 11 组状态族、状态主语筛选、允许 / 禁止迁移、状态传播和测试断言 | Step 10 |
| 持久化、事务与一致性 | repository shape、versioned read / save、history / outbox / stored result、projection stale、eventual consistency | Step 11 |
| 错误模型与恢复 | validation、not visible、body blocked、rejected、quarantined、conflict、stale、retryable、dead-letter、degraded、blocked | Step 12 |
| 并发、幂等与重入 | command idempotency、consumer dedup、job idempotency、expected version、duplicate replay、conflict 和 retry cut | Step 13 |
| 配置引用与外部依赖绑定 | RuntimeConfig、adapter / consumer / publisher / job / handoff config carrier、config error、产品中立绑定 | Step 14 |
| 可观测性与审计埋点 | 本仓自身 log / metric / trace hook、audit append、no-write violation、evidence linkage marker、handoff marker | Step 15 |
| 测试切口 | unit、contract、service、integration、state matrix、query no-write、forbidden body、consumer duplicate、job failure、config negative | Step 16 |
| 实施承接 | 详细设计到 `07` 的阅读矩阵、闭环复核输入、剩余风险和 implementation handoff 条件 | Step 17 |
| 风险收口 | 未关闭问题、后移事项、上游回退项、实现前 blocker | Step 18 |

### 8.3 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、业务规则、数据归属、验收目标和 veto 项重写 | `00-需求文档.md` |
| 系统上下文、限界上下文、依赖方向、技术方案取舍、数据所有权和一致性策略重写 | `01-架构设计.md` |
| 新增 / 删除 10 个主要组成部分、关键对象主语、五类接口、10 组处理流或 11 组状态族 | 回退 `02-概要设计.md` 对应 Step |
| 完整配置手册、配置 key、默认值、环境变量、secret、profile、产品参数、retention / retry / batch / freshness 数字和迁移矩阵 | `04-配置设计.md` |
| 完整测试矩阵、测试数据、fixture、自动化脚本、报告产物、证据目录、回归策略和覆盖率目标 | `05-测试方案.md` |
| 验收 baseline、准入准出、真实 evidence、真实 run id、真实 evidence alias、最终判定、signoff 和发布门禁 | `06-验收标准.md` |
| phase / commit boundary、任务拆分、提交说明、回退计划、implementation ledger 和 planned boundary skeleton | `07-实施计划.md` |
| 部署拓扑、生产告警、容量规划、on-call runbook、故障处置和运行手册 | 运维 / 部署文档 |
| OTel、Prometheus、Grafana、TimescaleDB、object store、search、alert sink、GRC、external audit 等产品最终选型与供应商专属协议 | ADR / `04-配置设计.md` / `07-实施计划.md` |
| Governance truth、Artifact / evidence body、Identity lifecycle、Runtime / Sandbox execution、Archive package、Console product behavior 和外部系统正文模型 | 对应相邻仓设计文档或外部系统契约 |
| 高级 dashboard、复杂 alert routing、自动 remediation、外部 GRC 双向同步、预测分析和供应商深度集成 | 后续版本 / 产品增强 / ADR |

### 8.4 实现者拿到正式 `03` 后应能完成的代码范围

| 代码范围 | 应具备的设计输入 |
|---|---|
| Rust workspace / crate / module / file skeleton | Step 03 / Step 04 |
| contracts DTO / view / event / job report / receipt / error / typed-ref carrier | Step 06 / Step 08 / Step 12 |
| domain aggregate / entity / value object / state enum / policy / guard / domain error | Step 06 / Step 10 / Step 12 |
| application command / query / consumer / job services | Step 07 / Step 08 / Step 09 / Step 13 |
| ports repository / external reference / projection / outbox / handoff / config / UoW / clock / id trait | Step 07 / Step 11 / Step 14 |
| fake repository / fake adapter / in-memory read model / minimal runner shell | Step 07 / Step 11 / Step 14 |
| persistence contract、history / audit / trace record、stored result、outbox、handoff marker、projection stale marker | Step 06 / Step 09 / Step 11 / Step 15 |
| query read model、diagnostic view、gap view、reference snapshot view、handoff / export preparation view | Step 06 / Step 08 / Step 09 / Step 11 |
| idempotency、dedup、expected version、duplicate replay、conflict handling、retry / dead-letter / quarantine surface | Step 08 / Step 12 / Step 13 |
| unit / contract / service / integration test shell | Step 16 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解本轮详细设计覆盖范围、非范围和下游文档边界。

### 9.1 正式 §2 摘要草稿

本轮详细设计目标是把当前正式 `02-概要设计.md` 已经收稳的 `L4-observability` 代码主体框架、10 个主要组成部分、关键对象、Command / Query / Consumer / Outbound Event / Operations Job 骨架、关键处理流、状态族、异常边界和配置影响轮廓,展开为目标实现仓可以 1:1 落码的实现契约。

本文覆盖 module / file 布局、对象字段、函数签名、DTO schema、trait / port / adapter、函数级 flow、状态矩阵、持久化、事务、错误、幂等、配置引用、观测与审计埋点、测试切口和实施承接。本文不重写需求、架构或概要设计主语,不替代配置设计、测试方案、验收标准、实施计划、运维手册、ADR 或相邻仓设计。

### 9.2 正式 §2 设计目标表草稿

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳实现组织边界 | 将 10 个业务主要组成部分和实现分层落成当前仓的 module / crate / file / entry / service / store / port 边界 | workspace / crate / module / file skeleton 和模块职责 |
| 收稳对象契约 | 将概要对象族展开为 exact Rust-facing 类型、状态、policy、record 和 error | domain、contracts 和 persistence-facing 类型 |
| 收稳协议契约 | 将五类接口骨架展开为 DTO、receipt、view、event payload、job report、metadata、idempotency 和 error surface | entry handler、consumer handler、job handler 和 contracts crate |
| 收稳处理流与事务 | 将处理流展开为函数级调用链、save order、outbox / history / projection stale / stored result 副作用 | application service、UoW 和 repository 调用 |
| 收稳状态矩阵 | 将状态族落为 enum、variant、迁移矩阵、触发函数、非法迁移错误和测试断言 | state guard、transition helper 和 state tests |
| 收稳配置、观测、测试与实施承接 | 定义配置引用、观测 / 审计埋点、最小测试切口和 `07` 承接输入 | `04/05/06/07` 可继续展开而不改 `03` truth |

### 9.3 正式 §2 非范围表草稿

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、业务规则、数据归属、验收目标和 veto 项重写 | `00-需求文档.md` |
| 系统上下文、限界上下文、依赖方向、技术方案取舍、数据所有权和一致性策略重写 | `01-架构设计.md` |
| 新增 / 删除主要组成部分、关键对象主语、接口、处理流或状态族 | 回退 `02-概要设计.md` 对应 Step |
| 完整配置手册、配置 key、默认值、环境变量、secret、profile、产品参数和迁移矩阵 | `04-配置设计.md` |
| 完整测试矩阵、测试数据、自动化脚本、报告产物、证据目录和回归策略 | `05-测试方案.md` |
| 验收 baseline、真实 evidence、最终判定、signoff 和发布门禁 | `06-验收标准.md` |
| phase / commit boundary、任务拆分、提交说明、回退计划、implementation ledger 和 planned boundary skeleton | `07-实施计划.md` |
| 部署拓扑、生产告警、容量规划、on-call runbook 和运行手册 | 运维 / 部署文档 |
| 产品最终选型、供应商专属协议和深度外部产品集成 | ADR / `04-配置设计.md` / `07-实施计划.md` |
| 相邻仓 truth 或外部正文模型 | 对应相邻仓设计文档或外部系统契约 |

## 10. 自检

| 检查项 | 结果 |
|---|---|
| 是否读取 Step 02 SOP、书写规范 5.2、Step 01、正式 `02` §2 / §12 / §13 | pass |
| 是否输出设计目标表 | pass |
| 是否输出非范围表 | pass |
| 是否说明本轮必须覆盖哪些模块 / 对象 / 接口 / job / 状态机 | pass |
| 是否区分 P1 / 后续阶段、配置、测试、验收、实施、运维和 ADR | pass |
| 是否避免写排期、开发任务拆分或 implementation boundary | pass |
| 是否避免修改正式 `03-详细设计.md` | pass |
| 是否继续禁止伪造实现 commit、真实 run id、真实 evidence alias、验收签署或测试结果 | pass |
| 是否需要回退 `02` | no |

## 11. 门禁

| 门禁 | 状态 | 说明 |
|---|---|---|
| Step 02 范围门禁 | pass | 本轮详细设计覆盖范围、非范围和实现者可完成代码范围已经明确。 |
| 正式文档回填门禁 | blocked_until_step_19 | 本步不改正式 `03-详细设计.md`。 |
| 下一步门禁 | wait_user_confirmation_before_step_03 | 用户确认后才能进入 Step 03。 |
| 上游 blocker | none | 未发现阻塞 Step 03 的上游 blocker。 |
