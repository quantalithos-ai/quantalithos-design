# L4-observability 05-测试方案 Step 05：建立需求追溯与覆盖矩阵

## Step 状态

| 字段 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `05-测试方案.md` |
| step | `05 / 建立需求追溯与覆盖矩阵` |
| mode | `full-restart` |
| status | `completed_current_design_record` |
| gate_status | `pass_with_affected_open` |
| next_allowed_action | `start_current_05_step_06` |
| formal_document_write | `not_allowed_until_step_15` |
| source_baseline | current `00-需求文档.md` through `04-配置设计.md`; current Step 03~04 |
| test_execution | `not_run` |
| evidence | `planned_only`; candidate IDs are not real aliases |
| commit | not required; no commit requested |

本文件替换了原有约 80 行的通用占位稿。旧文件只作为 `historical_material`，不沿用其按功能摘要压缩的覆盖表。
本 Step 以需求 ID 和测试切口双向可查为目标，并把 exact protocol、正式 state owner、UoW、redaction、
no-write、配置和跨仓边界落到后续可执行用例的候选入口。

## 1. 本步输入

| 输入 | 使用结论 |
|---|---|
| `standards/document/测试方案讨论流程_SOP.md` Step 05 | 固定双向矩阵、P0 覆盖、孤儿审计和停审门禁 |
| `standards/document/测试方案书写规范.md` §三、§四 | 固定正式 §5 的矩阵表达、TC/EV 编号和校准来源 |
| `standards/document/设计文档讨论中间产物规范.md` | 固定 full-restart、先思考后写入、Step 独立和三层台账 |
| current `00-需求文档.md` §7~§16 | `C/FR/BR/DO/NFR/AC/VF` 全量需求基线 |
| current `01-架构设计.md` §4~§13 | ownership、依赖方向、运行边界和 no-write 架构红线 |
| current `02-概要设计.md` §4~§12 | 组成部分、协议族、处理流和状态轮廓 |
| current `03-详细设计.md` §5~§17 | exact object/port/protocol/flow/state/UoW/error/config/telemetry/test cut |
| current `04-配置设计.md` §6~§13 | `LocalTest`、`IntegrationLike`、`RuntimeLike`、13-stage assembly、redline、历史绑定 |
| current Step 03~04 | 七模块、60 exact protocol、27 formal state owner、九层测试策略 |
| L1-governance / L1-artifact reference | 只参考矩阵和证据粒度，不继承业务语义或编号 |

## 2. SOP 问题回答

### 2.1 每个 P0 需求对应什么设计和验证输入

每个核心 `FR-OBS-*` 都至少映射到一个能力闭环、一个业务规则族、一个数据归属族、一个详细设计契约和一个
候选用例族。`NFR-OBS-*`、`AC-OBS-*` 和 `VF-OBS-*` 不能只映射到“核心流程”，而要分别落到安全、降级、
可追溯、幂等、事务、配置、依赖、证据和 no-write 的具体切口。

### 2.2 哪些场景必须自动化

以下场景为 P0 自动化候选：禁止正文扫描、serialization 前 redaction、Query strict no-write、accepted UoW
原子性、duplicate/conflict/replay、CAS/version/fence、outbox snapshot、配置 fail-fast、only-core 依赖、
report provenance 和 VETO redline。不能在当前阶段以手工检查替代这些场景；若受 affected 或 target reality 阻塞，
只能标 `blocked/conditional`，不能标 `pass`。

### 2.3 如何编号证据

本 Step 只预留 `TC-OBS-*` 和 `EV-CAND-OBS-*` 设计 ID。真实执行时必须由具体 `<run_id>` 生成 raw artifact 和
report；Step 13 再固定路径映射。不得在设计阶段创建 `EV-OBS-*` 真实 alias、run、verdict 或 signoff。

### 2.4 哪些项目暂未覆盖

I05 canonical payload/schema 和 producer binding、J06 H13 positive replay truth、UoW/recovery/external phase、
Consumer completion、Job report ref、secondary public type owner 等已有 affected 仍未闭合。测试方案可以覆盖其
fail-closed、manual、zero-write 和 no-fabrication 分支，但不能反推缺失 owner 或把 controlled path 解释为正向完成。

## 3. 当前文档问题诊断

| 材料 | 历史问题 | 当前处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 用功能摘要和旧编号替代 exact protocol/flow/state；部分内容声明了过早的通过口径 | Step 15 前不作为正文；全部章节重新装配 |
| 旧 Step 05~15 草稿 | 结构相同、内容泛化，未消费当前 60 协议、27 状态和 affected | 删除后逐 Step 重建；未到当前 Step 的文件均是 historical material |
| 旧 `06/07` | 需求编号、profile、phase、boundary 与 current `00~04` 不一致 | 后续各自 full-restart；不作为本步下游输入 |
| README / 旧产品栈 | 含 Grafana、TimescaleDB、P95、旧事件数量等实现假设 | `historical_material`；只保留风险线索 |
| `03` affected register | 部分协议和 owner 仍开放 | 原样传播为 `blocked/conditional`，不在测试方案关闭 |
| L1 参考项目 | 粒度较细，但业务 truth 不同 | 仅借鉴“功能项 -> 契约 -> TC -> EV -> 验收”的表达方式 |

## 4. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 以功能需求为唯一主轴 | 不采用 | 会丢失 60 个 exact protocol、27 个状态和跨 phase 风险 |
| 以测试切口为唯一主轴 | 不采用 | 需求、规则和验收无法反向审计，容易产生孤儿需求 |
| 双向矩阵：需求主表 + 切口反表 | 采用 | 同时支持验收追溯和实现者按切口落码 |
| 把所有外围增强列为 P0 | 不采用 | `FR-OBS-E01~E06` 只验证不污染核心边界，不阻塞核心闭环 |
| 为 affected 临时创造 schema/owner/default | 不采用 | 会制造第二真相源，且违反设计闭环标准 |
| 用 `EV-CAND-OBS-*` 作为设计期证据 | 采用 | 保留稳定映射，同时明确不是执行结果或真实 alias |

## 5. 覆盖状态和编号规则

| 状态 | 含义 | 允许的后续动作 |
|---|---|---|
| `covered_planned` | 已有设计契约、测试切口、候选 TC 和候选 EV，尚未执行 | Step 06~14 继续细化 |
| `covered_conditional` | 设计能覆盖 fail-closed 或受限分支，但正向路径受 affected 限制 | 保留 blocker，不能声明完成 |
| `blocked_upstream` | 缺少上游 canonical schema/binding/owner，无法定义正向断言 | 等上游闭合；只设计拒绝路径 |
| `risk_candidate` | 当前需求有方向，但没有冻结可量化阈值或真实 target | 进入 Step 10/14 残余风险 |
| `not_in_scope` | 明确属于外围增强或本轮非范围 | 保留边界检查，不生成核心通过条件 |

候选用例编号按测试切口稳定分配：`TC-OBS-<CUT>-<三位序号>`；候选证据按同一切口分配：
`EV-CAND-OBS-<CUT>-<三位序号>`。编号只表示设计对象，不表示已创建文件、执行 run 或通过 verdict。

## 6. 需求主追溯矩阵：能力、功能、规则、设计契约、测试和证据

下表是正式 §5 的主矩阵。为避免把数十个同质规则压缩成不可审计摘要，规则和数据范围使用连续编号时同时标出
其语义族；Step 06 必须把每个范围展开到具体用例断言。

| 功能需求 | 能力 / 规则 / 数据输入 | 详细设计契约 | 测试切口 | 候选 TC | 自动化候选 | 候选 EV | 覆盖状态 |
|---|---|---|---|---|---|---|---|
| `FR-OBS-001` | `C-OBS-1`; `BR-OBS-001~003,005`; `DO-OBS-001~004` | `03` §7.2 C01 `SubmitObservationMaterial`; §8 Command accepted flow; §9 `ObservationReceiptState` / `SafetyDispositionState`; §14 intake/redaction schema | `CUT-INGEST-ADMISSION` | `TC-OBS-ING-001~004` | contract + service + redaction | `EV-CAND-OBS-ING-001~004` | `covered_planned` |
| `FR-OBS-002` | `C-OBS-1`; `BR-OBS-001,004,006,010`; `DO-OBS-003,005,006` | `03` §7 shared metadata/correlation; C03 `BindCorrelationContext`; §14 `CorrelationContext`; §12 scoped digest | `CUT-CORRELATION-SOURCE` | `TC-OBS-COR-001~003` | contract + domain + service | `EV-CAND-OBS-COR-001~003` | `covered_planned` |
| `FR-OBS-003` | `C-OBS-1`; `BR-OBS-002,003,005,012`; `DO-OBS-002,004,007` | C02 `RecordSafetyDisposition`; §9 `SafetyDispositionState`; §11 redaction/error mapping; §14 serialization boundary | `CUT-REDACTION-SAFETY` | `TC-OBS-RED-001~004` | contract + static + service | `EV-CAND-OBS-RED-001~004` | `covered_planned` |
| `FR-OBS-004` | `C-OBS-2`; `BR-OBS-007,009,010`; `DO-OBS-009,011,013` | C05 `AppendAuditProjection`; Q05 `GetAuditTimeline`; E04 `AuditProjectionAppended`; `AuditProjectionState`; §10 append-only UoW | `CUT-AUDIT-PROJECTION` | `TC-OBS-AUD-001~004` | domain + service + repository + integration | `EV-CAND-OBS-AUD-001~004` | `covered_planned` |
| `FR-OBS-005` | `C-OBS-2`; `BR-OBS-008~010`; `DO-OBS-010,012,014` | C06 `LinkBodyFreeEvidence`; Q06 `GetEvidenceIndexInput`; E05 `EvidenceLinkageChanged`; `EvidenceLinkageState`; §14 body-free schema | `CUT-EVIDENCE-BODY-FREE` | `TC-OBS-EVD-001~004` | contract + redaction + service | `EV-CAND-OBS-EVD-001~004` | `covered_planned` |
| `FR-OBS-006` | `C-OBS-3`; `BR-OBS-011,012,014`; `DO-OBS-015~020` | C04 `RecordSafeSignal`; Q03/Q04/Q09/Q10; E03 `SafeSignalRecorded`; `SafeSignalState`, `SignalRollupState`; §14 log/metric/trace schema | `CUT-SIGNAL-PROJECTION` | `TC-OBS-SIG-001~006` | contract + service + static + integration | `EV-CAND-OBS-SIG-001~006` | `covered_planned` |
| `FR-OBS-007` | `C-OBS-3/4`; `BR-OBS-009,013,019`; `DO-OBS-018,021,024` | Q09/Q10/Q11 response surfaces; `GapLifecycleState`, `DegradedOutputKind`, `DiagnosticFreshnessState`; §11 degraded mapping | `CUT-DEGRADED-VISIBILITY` | `TC-OBS-DEG-001~005` | service + query contract | `EV-CAND-OBS-DEG-001~005` | `covered_planned` |
| `FR-OBS-008` | `C-OBS-4`; `BR-OBS-013,015,023`; `DO-OBS-021,031` | Q01~Q14 exact Query contracts; §8 Query read-only flow; `ObservationQueryOperation`; §15 query no-write cut | `CUT-QUERY-NOWRITE` | `TC-OBS-QRY-001~004` | service + static + entry | `EV-CAND-OBS-QRY-001~004` | `covered_planned` |
| `FR-OBS-009` | `C-OBS-4`; `BR-OBS-014~016,023`; `DO-OBS-022,031` | Q10 `GetDiagnosticView`; C12 `RecordNoWriteViolation`; `NoWriteViolationState`; §14 recursion/no-write | `CUT-DIAGNOSTIC-GUARD` | `TC-OBS-DIA-001~004` | service + static + integration | `EV-CAND-OBS-DIA-001~004` | `covered_planned` |
| `FR-OBS-010` | `C-OBS-4`; `BR-OBS-017~019`; `DO-OBS-023,024,026` | C07 `PrepareReportHandoff`; Q07; E06 `ReportHandoffChanged`; J07; `ReportHandoffState` / readiness | `CUT-REPORT-HANDOFF` | `TC-OBS-RPT-001~005` | service + adapter + integration | `EV-CAND-OBS-RPT-001~005` | `covered_conditional` |
| `FR-OBS-011` | `C-OBS-4`; `BR-OBS-017~019`; `DO-OBS-025,027` | C08 `EvaluateAuthenticityHint`; `AuthenticityHintState`; §14 report/evidence provenance | `CUT-EVIDENCE-AUTHENTICITY` | `TC-OBS-AUT-001~003` | contract + static + report audit | `EV-CAND-OBS-AUT-001~003` | `covered_planned` |
| `FR-OBS-012` | `C-OBS-5`; `BR-OBS-020,021`; `DO-OBS-028,029,033,034` | C09/C10; Q08; E07 `RetentionMarkerChanged`; `RetentionMarkerState` / `ActiveReferenceProtectionState`; §10 retention CAS | `CUT-RETENTION-PROTECTION` | `TC-OBS-RET-001~005` | domain + repository + integration | `EV-CAND-OBS-RET-001~005` | `covered_planned` |
| `FR-OBS-013` | `C-OBS-5`; `BR-OBS-022,023`; `DO-OBS-030~032,034` | C11/C13; Q11/Q14; J02/J03/J05/J06/J09; `ProjectionMaintenanceStateKind`, `ReplayCoordinationKind`; §8/§10 no-write | `CUT-REBUILD-REPLAY-NOWRITE` | `TC-OBS-REB-001~006` | service + integration + static | `EV-CAND-OBS-REB-001~006` | `covered_conditional` |
| `FR-OBS-E01~E06` | `BR-OBS-014,017,023,025,026`; `NFR-OBS-022~024` | Product-neutral read/report/export seams; no external product truth owner | `CUT-PERIPHERAL-BOUNDARY` | `TC-OBS-EXT-001~003` | static + adapter contract | `EV-CAND-OBS-EXT-001~003` | `not_in_scope` |

## 7. 规则与数据归属覆盖矩阵

### 7.1 规则族到测试切口

| 规则范围 | 必须验证的断言 | 主要切口 | 候选 TC | 候选 EV | 状态 |
|---|---|---|---|---|---|
| `BR-OBS-001~006` | 来源、安全状态、关联语境存在；raw/body/secret 不入观察面；准入显式且不等同 source write | `CUT-INGEST-ADMISSION`, `CUT-CORRELATION-SOURCE`, `CUT-REDACTION-SAFETY` | `TC-OBS-ING-*`, `TC-OBS-COR-*`, `TC-OBS-RED-*` | `EV-CAND-OBS-ING-*`, `COR-*`, `RED-*` | `covered_planned` |
| `BR-OBS-007~010` | 审计投影只读；body-free linkage；缺口显式；来源/责任/消费目的可追溯 | `CUT-AUDIT-PROJECTION`, `CUT-EVIDENCE-BODY-FREE` | `TC-OBS-AUD-*`, `TC-OBS-EVD-*` | `EV-CAND-OBS-AUD-*`, `EVD-*` | `covered_planned` |
| `BR-OBS-011~014` | log/metric/trace 是观察面；禁止敏感材料；degraded/not-visible 显式；摘要不定义 truth | `CUT-SIGNAL-PROJECTION`, `CUT-DEGRADED-VISIBILITY` | `TC-OBS-SIG-*`, `TC-OBS-DEG-*` | `EV-CAND-OBS-SIG-*`, `DEG-*` | `covered_planned` |
| `BR-OBS-015~019` | Query/diagnostic/report 只读；不得控制执行；交接不生成 verdict；来源/脱敏/缺口可追溯 | `CUT-QUERY-NOWRITE`, `CUT-DIAGNOSTIC-GUARD`, `CUT-REPORT-HANDOFF`, `CUT-EVIDENCE-AUTHENTICITY` | `TC-OBS-QRY-*`, `DIA-*`, `RPT-*`, `AUT-*` | 对应 `EV-CAND-OBS-*` | `covered_conditional` |
| `BR-OBS-020~023` | active/held/reference conflict 不清理；变化显式；rebuild/replay 只影响派生面；source writer 集合为空 | `CUT-RETENTION-PROTECTION`, `CUT-REBUILD-REPLAY-NOWRITE` | `TC-OBS-RET-*`, `TC-OBS-REB-*` | `EV-CAND-OBS-RET-*`, `REB-*` | `covered_conditional` |
| `BR-OBS-024~026` | 不接管 bus 主干/相邻 truth；历史产品和硬指标不升级 | `CUT-DEPENDENCY-REDLINE`, `CUT-PERIPHERAL-BOUNDARY` | `TC-OBS-DEP-001~003`, `TC-OBS-EXT-*` | `EV-CAND-OBS-DEP-*`, `EXT-*` | `covered_planned` |

### 7.2 数据归属到测试切口

| 数据范围 | 归属断言 | 测试切口 | 状态 |
|---|---|---|---|
| `DO-OBS-001~004` | 本仓拥有准入、安全处置、来源语境和 redaction marker；状态变化显式 | `CUT-INGEST-ADMISSION`, `CUT-REDACTION-SAFETY` | `covered_planned` |
| `DO-OBS-005~006` | 只保存安全摘要和外部引用，不保存 owner 正文 | `CUT-CORRELATION-SOURCE`, `CUT-DEPENDENCY-REDLINE` | `covered_planned` |
| `DO-OBS-007~008` | raw body/secret/业务 payload 是禁止保存正文 | `CUT-REDACTION-SAFETY`, `CUT-EVIDENCE-BODY-FREE` | `covered_planned` |
| `DO-OBS-009~014` | audit projection、body-free linkage、gap 和安全摘要由本仓拥有；外部 evidence/artifact/governance/identity body 不入仓 | `CUT-AUDIT-PROJECTION`, `CUT-EVIDENCE-BODY-FREE` | `covered_planned` |
| `DO-OBS-015~020` | log/metric/trace 是安全观察事实/快照；raw log/prompt/provider/runtime body 不入仓 | `CUT-SIGNAL-PROJECTION` | `covered_planned` |
| `DO-OBS-021~027` | Query/diagnostic/report/handoff 是派生或本地交接事实；不生成 final verdict 或真实 evidence | `CUT-QUERY-NOWRITE`, `CUT-DIAGNOSTIC-GUARD`, `CUT-REPORT-HANDOFF`, `CUT-EVIDENCE-AUTHENTICITY` | `covered_conditional` |
| `DO-OBS-028~034` | retention/protection/replay/rebuild/no-write/外围影响只影响本仓观察面；不删除或修复外部 truth | `CUT-RETENTION-PROTECTION`, `CUT-REBUILD-REPLAY-NOWRITE` | `covered_conditional` |

## 8. NFR、AC、VF 到测试输入矩阵

### 8.1 NFR 矩阵

| NFR 范围 | 验证方法 | 设计切口 | 候选证据 | 状态 |
|---|---|---|---|---|
| `NFR-OBS-001~004` | 准入/处置延迟不硬化数值；依赖不可用显式 rejected/quarantined/degraded；redaction 和处置可追溯 | `CUT-INGEST-ADMISSION`, `CUT-REDACTION-SAFETY` | `EV-CAND-OBS-ING-*`, `RED-*` | `covered_planned` |
| `NFR-OBS-005~008` | body-free audit/evidence 读取；重复投影/关联唯一语义；缺口不静默 | `CUT-AUDIT-PROJECTION`, `CUT-EVIDENCE-BODY-FREE` | `EV-CAND-OBS-AUD-*`, `EVD-*` | `covered_planned` |
| `NFR-OBS-009~012` | safe signal、degraded/not-visible、缺失状态可观察；无 raw signal material | `CUT-SIGNAL-PROJECTION`, `CUT-DEGRADED-VISIBILITY` | `EV-CAND-OBS-SIG-*`, `DEG-*` | `covered_planned` |
| `NFR-OBS-013~016` | Query/diagnostic/report 在外部不可用时 blocked/degraded；严格 zero-write 和 handoff traceability | `CUT-QUERY-NOWRITE`, `CUT-DIAGNOSTIC-GUARD`, `CUT-REPORT-HANDOFF` | `EV-CAND-OBS-QRY-*`, `DIA-*`, `RPT-*` | `covered_conditional` |
| `NFR-OBS-017~020` | retention conflict、rebuild/replay no-write、violation 可观察、重复保护不分叉 | `CUT-RETENTION-PROTECTION`, `CUT-REBUILD-REPLAY-NOWRITE` | `EV-CAND-OBS-RET-*`, `REB-*` | `covered_conditional` |
| `NFR-OBS-021~024` | 全仓 truth/历史材料/外围产品边界静态审计；无来源指标保持 candidate | `CUT-DEPENDENCY-REDLINE`, `CUT-EVIDENCE-AUTHENTICITY`, `CUT-PERIPHERAL-BOUNDARY` | `EV-CAND-OBS-DEP-*`, `AUT-*`, `EXT-*` | `covered_planned` |

### 8.2 AC 矩阵

| AC 范围 | 主要验证切口 | 候选 TC | 候选 EV | 状态 |
|---|---|---|---|---|
| `AC-OBS-001` | `CUT-INGEST-ADMISSION`, `CUT-REDACTION-SAFETY`, `CUT-CORRELATION-SOURCE` | `TC-OBS-ING-*`, `COR-*`, `RED-*` | 对应候选族 | `covered_planned` |
| `AC-OBS-002` | `CUT-AUDIT-PROJECTION`, `CUT-EVIDENCE-BODY-FREE` | `TC-OBS-AUD-*`, `EVD-*` | `EV-CAND-OBS-AUD-*`, `EVD-*` | `covered_planned` |
| `AC-OBS-003` | `CUT-SIGNAL-PROJECTION`, `CUT-DEGRADED-VISIBILITY` | `TC-OBS-SIG-*`, `DEG-*` | `EV-CAND-OBS-SIG-*`, `DEG-*` | `covered_planned` |
| `AC-OBS-004` | `CUT-QUERY-NOWRITE`, `CUT-DIAGNOSTIC-GUARD`, `CUT-REPORT-HANDOFF`, `CUT-EVIDENCE-AUTHENTICITY` | `TC-OBS-QRY-*`, `DIA-*`, `RPT-*`, `AUT-*` | 对应候选族 | `covered_conditional` |
| `AC-OBS-005` | `CUT-RETENTION-PROTECTION`, `CUT-REBUILD-REPLAY-NOWRITE` | `TC-OBS-RET-*`, `REB-*` | 对应候选族 | `covered_conditional` |
| `AC-OBS-006~018` | 各 `FR-OBS-001~013` 主切口 | 见 §6 | 见 §6 | `covered_planned/conditional` |
| `AC-OBS-019~024` | 规则边界、依赖、历史材料和 no-write 静态/负向切口 | `TC-OBS-RED-*`, `AUD-*`, `DIA-*`, `DEP-*`, `EXT-*` | 对应候选族 | `covered_conditional` |
| `AC-OBS-025~028` | owner、snapshot、ref、forbidden body scan | `TC-OBS-OWN-001~004`, `EVD-*`, `RED-*` | `EV-CAND-OBS-OWN-*` 等 | `covered_planned` |
| `AC-OBS-029~031` | NFR evidence、历史材料和未冻结硬指标审计 | `TC-OBS-NFR-001~003`, `AUT-*`, `DEP-*` | `EV-CAND-OBS-NFR-*` | `covered_planned` |

### 8.3 VETO 矩阵

| VETO 范围 | 强制切口 | 候选 TC | 候选 EV | 处置 |
|---|---|---|---|---|
| `VF-OBS-001` | 五能力 release smoke 与跨切口审计 | `TC-OBS-REL-001~005` | `EV-CAND-OBS-REL-001~005` | P0 阻断 |
| `VF-OBS-002` | redaction-before-serialization / forbidden body scan | `TC-OBS-RED-001~004`, `TC-OBS-SIG-001~002` | `EV-CAND-OBS-RED-*`, `SIG-*` | P0 阻断 |
| `VF-OBS-003` | body-free evidence/schema and ownership scan | `TC-OBS-EVD-001~004`, `TC-OBS-OWN-001` | `EV-CAND-OBS-EVD-*`, `OWN-*` | P0 阻断 |
| `VF-OBS-004` | truth-role separation for audit/signal/summary/report | `TC-OBS-TRUTH-001~003` | `EV-CAND-OBS-TRUTH-*` | P0 阻断 |
| `VF-OBS-005` | query/job/rebuild/export writer capability and spy | `TC-OBS-NW-001~005` | `EV-CAND-OBS-NW-*` | P0 阻断 |
| `VF-OBS-006` | report provenance/static evidence audit | `TC-OBS-AUT-001~003`, `TC-OBS-RPT-004~005` | `EV-CAND-OBS-AUT-*`, `RPT-*` | P0 阻断 |
| `VF-OBS-007` | retention active/held/reference conflict | `TC-OBS-RET-001~005` | `EV-CAND-OBS-RET-*` | P0 阻断 |
| `VF-OBS-008` | dependency manifest and package boundary | `TC-OBS-DEP-001~003` | `EV-CAND-OBS-DEP-*` | P0 阻断 |
| `VF-OBS-009` | external product/product-neutral boundary scan | `TC-OBS-EXT-001~003` | `EV-CAND-OBS-EXT-*` | P0 boundary gate |
| `VF-OBS-010` | historical-material/reference scan | `TC-OBS-HIST-001~002` | `EV-CAND-OBS-HIST-*` | P0 design gate |

## 9. 测试切口反向矩阵

| 测试切口 | 设计契约 / 来源 | 需求与规则 | 状态 / 协议 | 后续候选 TC | 覆盖状态 |
|---|---|---|---|---|---|
| `CUT-INGEST-ADMISSION` | `03` §7.2/§8.2/§9.2/§14.2 | `FR-OBS-001`; `BR-OBS-001~005`; `AC-OBS-001,006,019` | C01; `ObservationReceiptState` / `SafetyDispositionState` | `TC-OBS-ING-001~004` | `covered_planned` |
| `CUT-CORRELATION-SOURCE` | C03; shared metadata; §14.5 | `FR-OBS-002`; `BR-OBS-001,004,006,010`; `AC-OBS-001,007` | `CorrelationContextState`; C03 | `TC-OBS-COR-001~003` | `covered_planned` |
| `CUT-REDACTION-SAFETY` | C02; §11.4/§14.7; `04` §8/§11 | `FR-OBS-003`; `BR-OBS-002,003,005,012`; `VF-OBS-002` | `SafetyDispositionState`; C02/I01~I09 affected lanes | `TC-OBS-RED-001~004` | `covered_planned` |
| `CUT-AUDIT-PROJECTION` | C05/Q05/E04; §10.2/§14.6 | `FR-OBS-004`; `BR-OBS-007,009,010`; `AC-OBS-002,009,020` | `AuditProjectionState`; C05/E04/I02 | `TC-OBS-AUD-001~004` | `covered_planned` |
| `CUT-EVIDENCE-BODY-FREE` | C06/Q06/E05; §5.1/§14.7 | `FR-OBS-005`; `BR-OBS-008~010`; `VF-OBS-003` | `EvidenceLinkageState`; C06/E05/I04/I05 | `TC-OBS-EVD-001~004` | `covered_conditional` for I04/I05 positive lanes |
| `CUT-SIGNAL-PROJECTION` | C04/Q03/Q04/Q09/Q10/E03; §14.3~§14.5 | `FR-OBS-006`; `BR-OBS-011,012,014`; `AC-OBS-003,011,021` | `SafeSignalState` / `SignalRollupState`; C04/E03/I03/I06/I07 | `TC-OBS-SIG-001~006` | `covered_planned` |
| `CUT-DEGRADED-VISIBILITY` | Q09~Q14; §9 read/maintenance; §11 mapping | `FR-OBS-007`; `BR-OBS-009,013,019`; `AC-OBS-012` | `GapLifecycleState`, `DegradedOutputKind`, `ReadVisibilityKind`, freshness states | `TC-OBS-DEG-001~005` | `covered_conditional` |
| `CUT-QUERY-NOWRITE` | Q01~Q14; §8.3; §12.11 | `FR-OBS-008`; `BR-OBS-015,023`; `VF-OBS-005` | all Query; no formal mutation state allowed | `TC-OBS-QRY-001~004` | `covered_planned` |
| `CUT-DIAGNOSTIC-GUARD` | Q10; C12/E08; §14.8~§14.9 | `FR-OBS-009`; `BR-OBS-014~016,023`; `AC-OBS-014,022` | `NoWriteViolationState`, `DiagnosticFreshnessState` | `TC-OBS-DIA-001~004` | `covered_planned` |
| `CUT-REPORT-HANDOFF` | C07/Q07/E06/J07; §8.7/§10.8/§14.9 | `FR-OBS-010`; `BR-OBS-017~019`; `VF-OBS-006` | `ReportHandoffState`, `HandoffReadinessState`; C07/E06/J07/I08/I09 | `TC-OBS-RPT-001~005` | `covered_conditional` |
| `CUT-EVIDENCE-AUTHENTICITY` | C08; §14.6/§14.9; report paths | `FR-OBS-011`; `BR-OBS-018,019`; `AC-OBS-016` | `AuthenticityHintState`; C08/J07/J08 | `TC-OBS-AUT-001~003` | `covered_planned` |
| `CUT-RETENTION-PROTECTION` | C09/C10/Q08/E07; §9.3/§10.8 | `FR-OBS-012`; `BR-OBS-020,021`; `VF-OBS-007` | `RetentionMarkerState`, `ActiveReferenceProtectionState` | `TC-OBS-RET-001~005` | `covered_planned` |
| `CUT-REBUILD-REPLAY-NOWRITE` | C11/C13/Q11/Q14/J02/J03/J05/J06/J09; §8.6/§10.7 | `FR-OBS-013`; `BR-OBS-022,023`; `AC-OBS-005,018` | `ReplayScopeState`, `ProjectionMaintenanceStateKind`, `ReplayCoordinationKind`, `RollupRebuildKind` | `TC-OBS-REB-001~006` | `covered_conditional` for J06 positive lane |
| `CUT-UOW-IDEMPOTENCY-RECOVERY` | §10~§13; §12.3~§12.9; exact flow cards | `NFR-OBS-008,018,023`; `AC-OBS-029` | `IdempotencyReservationState`, `OutboxPublicationState`, `JobReportState`, technical item state | `TC-OBS-UOW-001~008` | `covered_conditional` |
| `CUT-CONFIG-RUNTIME-REDLINE` | `04` §6~§13; `03` §13.8~§13.9 | `NFR-OBS-003,021,022`; `VF-OBS-008~009` | profile/availability/startup errors; no formal business state | `TC-OBS-CFG-001~006` | `covered_planned` |
| `CUT-DEPENDENCY-REDLINE` | `01` dependency graph; `03` §3/§5/§13; `00` BR/VF | `BR-OBS-024~026`; `VF-OBS-008~010` | module/entry capability boundary | `TC-OBS-DEP-001~003`, `TC-OBS-HIST-001~002` | `covered_planned` |

## 10. Inherited blocker / affected 处置矩阵

| ID | 当前状态 | 覆盖策略 | 可声明内容 | 禁止声明 |
|---|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | I05 decoder/header/schema negative lane | pre-parse fail-closed、zero-ack、zero-write、safe diagnostic | canonical payload、positive parse 或 producer schema 已成立 |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | exact binding missing/unsupported lane | slot disabled、typed unavailable、no local landing | 任意事件自动订阅、producer mapping 已完成 |
| `R06.6-F2-H13-UPSTREAM` | `open_controlled` | J06 blocked/manual/no-fabrication lane | approved-scope缺失时阻断；不创建 replay truth | positive H13 record、external replay success |
| `R06-F-AFFECT-UOW-01` | downstream open | accepted write-set/order and commit-unknown probes | one UoW/single cursor/order candidate | implementation atomicity已证明 |
| `S08-RECOVERY-CLASS-OWNER-01` | open affected | typed recovery branch candidate | exact branch required before execution | 自行创建 recovery enum/默认 retry |
| `R07-EXTERNAL-PHASE-LINK-01` | downstream open | prepare/call/finalize phase boundary | phase mismatch/unknown/manual | provider acceptance or exactly-once |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | downstream open | retry/finalize accounting negative lane | no blind retry/new token | retry success evidence |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | open affected | minimum consumer capability and outbox boundary | no downstream writer / snapshot-only check | consumer owns outbox policy |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | open affected | Unknown completion probe branch | no default ack/action | completion mapping closed |
| `S08-JOB-REPORT-REF-OWNER-01` | open affected | missing/wrong report ref fail-closed | report ref required and immutable relation | duplicate report owner invented |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | open affected | schema/owner static check | missing owner blocks positive lane | alias/wrapper as substitute |
| `03-RPR-S09-PER-FLOW` | open | exact-flow coverage audit | every protocol has reserved cut | family summary counts as flow proof |

## 11. 覆盖矩阵停审记录

| 覆盖项 | 设计依据是否明确 | TC/EV 是否预留 | 自动化是否判定 | phase/状态边界 | 结论 |
|---|---|---|---|---|---|
| 五个核心能力 `C-OBS-1~5` | yes | yes | yes | yes | `pass` |
| 核心功能 `FR-OBS-001~013` | yes | yes | yes | yes | `pass` |
| 外围增强 `FR-OBS-E01~E06` | yes | boundary only | static/adapter only | non-P0 | `pass_not_in_core_gate` |
| 规则 `BR-OBS-001~026` | yes, by rule family | yes | P0 forbidden rules automated | yes | `pass` |
| 数据 `DO-OBS-001~034` | yes, by ownership family | yes | schema/static/service | yes | `pass` |
| NFR `NFR-OBS-001~024` | yes | yes | threshold only where sourced | candidate metrics explicit | `pass_with_candidates` |
| AC `AC-OBS-001~031` | yes | yes | later 06 consumes candidate EV | no verdict here | `pass_planned` |
| VF `VF-OBS-001~010` | yes | yes | static/release redline | VETO remains blocking | `pass` |
| affected register | yes | conditional/blocked paths | no false pass | phase ownership preserved | `pass_with_affected_open` |

## 12. 跨覆盖项审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 孤儿核心功能 | none found | `FR-OBS-001~013` 均有 design/TC/EV 入口 |
| 孤儿规则 | none at family level | `BR-OBS-001~026` 全部进入正向或负向切口 |
| 孤儿数据归属 | none at family level | `DO-OBS-001~034` 进入 owner/body-free/no-write 切口 |
| 孤儿 NFR | none | `NFR-OBS-001~024` 进入功能、专项或静态门禁；无来源数值保持 candidate |
| 孤儿 AC/VF | none | `AC-OBS-001~031`、`VF-OBS-001~010` 均有候选 TC/EV |
| 孤儿设计切口 | none in current Step 03 inventory | 16 个反向矩阵切口均映射需求或记录为 design-risk；禁止正文和 report provenance 分别由 canonical redaction/evidence 切口承接 |
| exact protocol 漏项 | pending exact-flow audit | 60 项必须在 Step 06 展开；本步只登记 family/protocol anchor |
| 重复证据 ID | none in planned namespace | Step 06/13 再做全量 collision scan |
| blocker 被误关闭 | no | 所有 inherited affected 仍 open/conditional |
| 真实执行结果 | none | `not_run`;未创建 artifact/report/evidence alias |

## 13. 回填草稿

正式 `05-测试方案.md` §5 应从本文件 §6~§9 回填，保留以下结论：

1. 需求主矩阵以 `FR-OBS-*` 为主轴，同时连接 `C/BR/DO/NFR/AC/VF`、详细设计契约、测试切口、候选 TC、自动化层级和候选 EV。
2. 反向矩阵以测试切口为主轴，保证实现者可以从切口回到正式需求、规则、数据归属和设计契约。
3. P0 覆盖状态只能是 `covered_planned`、`covered_conditional` 或 `blocked_upstream`；不得将候选 evidence 写成真实通过。
4. I05、J06 和受影响的 UoW、external phase、Consumer completion、Job report ref、secondary type owner 保持开放，并由后续 Step 继续传播。
5. 外围增强只做边界不污染检查，不成为当前核心通过条件。

## 14. 待确认事项

| ID | 待确认事项 | 当前处置 |
|---|---|---|
| `Q-05-TRACE-01` | I05 canonical payload/schema 和 producer binding 由上游何时提供 | 保持 `blocked_upstream`；不反推 schema |
| `Q-05-TRACE-02` | H13 replay scope mutation 的正式记录语义 | J06 仅 blocked/manual/no-fabrication |
| `Q-05-TRACE-03` | recovery class、external phase、Consumer completion、Job report ref、secondary type 的唯一 owner | 保持 affected；后续 Step 细化 gate，不创建 alias |
| `Q-05-TRACE-04` | 真实实现仓、真实环境和测试执行尚未建立 | 所有 TC/EV 为 planned/candidate；不生成 run |
| `Q-05-TRACE-05` | 性能量化阈值和外部产品 target 未冻结 | NFR 保留判断句和风险候选，不硬编码 P95/SLA |

## 15. 进入下一步条件

- [x] 主矩阵覆盖 `FR-OBS-001~013`、外围增强边界、`BR-OBS-001~026`、`DO-OBS-001~034`、`NFR-OBS-001~024`、`AC-OBS-001~031`、`VF-OBS-001~010`。
- [x] 每个核心需求都有详细设计契约、测试切口、候选 TC 和候选 EV 入口。
- [x] 需求到切口、切口到需求的双向查询路径已建立。
- [x] P0 负向、安全、no-write、依赖和证据真实性风险均有自动化候选。
- [x] inherited blocker/affected 未被关闭，blocked/conditional 语义保留。
- [x] 未写测试执行结果、真实 evidence、run_id、verdict、signoff 或 commit。
- [x] `git diff --check` 通过本文件局部检查。

## 16. 参考

- `standards/document/测试方案讨论流程_SOP.md` Step 05
- `standards/document/测试方案书写规范.md` §三~§四
- `standards/document/设计文档讨论中间产物规范.md`
- `projects/L4-observability/00-需求文档.md` §7~§16
- `projects/L4-observability/03-详细设计.md` §5~§17
- `projects/L4-observability/04-配置设计.md` §6~§13
- `projects/L4-observability/design-calibration/05_test_plan_step_03_test_objects_cuts.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_04_strategy_layers.md`
- `projects/L4-observability/design-calibration/03_ddd_step_09_exact_flow_cards.md`
- `projects/L4-observability/design-calibration/03_ddd_step_10_state_matrix.md`
- `projects/L4-observability/design-calibration/03_ddd_step_16_test_cuts.md`
- `projects/L4-observability/design-calibration/project_execution_ledger.md`
