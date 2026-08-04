# L4-observability 06-验收标准 Step 02：明确验收目标与范围

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `02 / 明确验收目标与范围` |
| mode | `full-restart` |
| status | `completed_current_design_record_with_inherited_affected_open` |
| current_module | `acceptance_scope_priority_and_seams` |
| formal_document_write | `not_allowed_until_step_15` |
| acceptance_execution | `not_started`;本 Step 只定义未来裁决范围 |
| real artifact / report / evidence | `absent_by_design`;不得由 candidate linkage 推定存在 |
| new_upstream_blocker | `none` |
| inherited blocker / affected | 12 项保持开放，详见 §11 |
| gate_status | `pass_for_acceptance_scope_design` |
| next_allowed_action | `start_current_06_step_03` |
| commit | 不需要；用户未要求提交 |

本文件替换旧 Step 02 中间产物。旧 Step 02、旧正式 `06-验收标准.md`、README 和旧 `07` 只作为
`historical_material`，不提供 current 验收范围、优先级或裁决结论。

## Step 内计划

| 计划项 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取项目级 / 文档级恢复点 | 台账与 flow 恢复记录 | done | 当前唯一动作确认为 06 Step 02 |
| 读取 Step 02 SOP 与验收书写规范 | SOP 问题表、章节回填约束 | done | 本 Step 只定义目标与范围，不提前写基线或功能门禁 |
| 读取 current `00~05` 与 Step 01 | 范围输入索引 | done | AC/VF、核心闭环、协议、状态、证据和 affected 可定位 |
| 诊断旧范围材料 | historical material 表 | done | 旧 AC/VETO、旧 suite、旧产品和旧指标不进入 current truth |
| 回答六个 SOP 问题 | §2 问题回答 | done | 每个问题有可裁决回答和下游落点 |
| 形成 P0/P1/P2/Forbidden 范围矩阵 | §5 结构化中间产物 | done | 每项有正式主语、裁决目标、边界和结论影响 |
| 形成回填草稿与自检 | §9、§10 | done | 可供正式 `06` §2 装配；不产生真实验收结论 |

## 1. 本步输入与权威顺序

| 优先级 | 输入 | 本 Step 使用内容 | 权威边界 |
|---:|---|---|---|
| 1 | `standards/document/验收标准讨论流程_SOP.md` Step 02 | 验收目标、P0/P1/P2、接缝、非范围和 VF 影响问题 | 定义生成顺序，不提供项目事实 |
| 2 | `standards/document/验收标准书写规范.md` §二、§三、§四 | 验收与测试/实施边界、三值结论、正式章节结构 | 定义正式结果形式，不证明执行事实 |
| 3 | 通用设计标准、依赖裁剪规则和项目台账 | full-restart、truth ownership、编译期依赖裁剪、三层门禁 | 约束本 Step 的判断和恢复 |
| 4 | current `00-需求文档.md` | `C-OBS-1~5`、`FR/BR/DO/NFR`、`AC-OBS-001~031`、`VF-OBS-001~010` | 验收目标和红线第一来源 |
| 5 | current `01-架构设计.md`、`02-概要设计.md` | truth owner、七模块、依赖类型、核心/外围/边界外能力 | 定义验收对象的架构边界 |
| 6 | current `03-详细设计.md`、`04-配置设计.md` | exact protocol、state、flow、UoW、error、telemetry、profile 和 redline | 定义可使用的正式名称和接缝边界 |
| 7 | current `05-测试方案.md` | 16 cuts、60 protocols、27+1 states、99 TC、82 DS、9 suites、6 lanes、3 profiles、5 scripts | 提供未来证据生产合同，不提供测试结果 |
| 8 | Step 01 | 输入边界、canonical path、candidate/real evidence 分离、12 affected | 约束本 Step 的真实性和下游关系 |
| 9 | L1 governance / L1 artifact / L1 identity、L0 bus | 粒度、handoff、truth boundary 和依赖类型参考 | 不复制相邻仓业务主语或编号 |

验收标准只判断送验交付物是否满足已经定义的需求和设计边界；不重新发明需求、测试用例、实现任务或外部
产品选型。`07-实施计划.md` 是下游，不能反向定义本 Step 的范围。

## 2. SOP 问题回答

### 2.1 本轮验收的核心裁决目标是什么

本轮验收的核心目标不是证明某个日志平台、dashboard 或外部 APM 可用，而是判断
`L4-observability` 是否作为横切观测 / 审计投影基础成立：

1. 观测材料能以安全、可拒绝、可隔离、可关联的方式进入本仓观察语境。
2. 审计投影、body-free evidence linkage、log / metric / trace 和 correlation 能表达可追溯观察面，且不保存外部正文。
3. Query、diagnostic、report handoff、retention、rebuild、replay 和 export 只作用于本仓观察 / 派生面，不写入或修复业务 source truth。
4. exact protocol、formal state、UoW、幂等、CAS/cursor、claim/fence、typed error、配置装配和 redaction 红线可被未来真实证据裁决。
5. 真实证据、报告交接、留存标记和缺口状态保持可审计；设计期 candidate linkage、blocked 或 not-evaluated 不能伪装成通过。

总体结论只能在后续 Step 03~14 完成并具备真实送验输入后裁决；本 Step 的 `pass` 只表示范围设计通过。

### 2.2 P0/P1/P2 验收范围如何划分

| 等级 | 当前含义 | 验收处置 | 对总体结论的影响 |
|---|---|---|---|
| P0 | 核心观察闭环、truth/no-write、安全、exact public contract、formal state、UoW/幂等/恢复、配置红线和 VF 相关能力 | 必须有正式设计契约、exact TC、真实 run-scoped artifact/report/evidence 入口和可判定通过/失败条件；缺失或失败阻断 | P0 未成立只能 `不通过` 或 `blocked`，不能以 P1/P2 结果替代 |
| P1 | durable-like、real-like adapter、外部传输 / store / resolver / archive / consumer 等不改变本仓 truth 的真实接缝 | 只验 port、binding、failure mapping、no fallback、token / snapshot / handoff 边界；缺真实依赖保留 `conditional` / `blocked` / `not_evaluated` | 不得作为 P0 truth 成立的隐藏前置；若本轮明确承诺该接缝，缺失会阻断对应送验范围 |
| P2 | production-like profile、容量 / 硬 SLO、具名产品、复杂报表、dashboard / alert / APM / GRC / anomaly enhancement、长期生命周期优化 | 只记录触发条件、风险和后续验证入口；无 current workload / threshold / product binding 时不产生 `通过` | 不影响当前 P0 设计门禁；若被送验声明为本轮范围，必须先回写需求、设计、测试和验收基线 |
| Forbidden | raw body / secret / credential / evidence body、外部 truth ownership、query/job/rebuild/export 写 source truth、非法依赖、静态伪造 evidence 或旧材料越权 | 负向测试 / static check / write spy 直接阻断；不得风险接受、降级或用低保真环境替代 | 任一触发直接进入 `不通过`，并保留原始 finding |

### 2.3 哪些下游能力只验接缝

本仓不验相邻项目的完整业务生命周期，只验以下有限接缝：

| 接缝 | 本轮验收对象 | 允许的证据形态 | 明确不验 |
|---|---|---|---|
| `L0-bus` | 观察材料 tap / audit material 的 envelope、schema、source ref、版本、重复和失败边界 | typed event / safe ref / receipt / gap / no-ack evidence | bus 投递、ack、retry、dead-letter、replay 主干 truth |
| `L1-identity` | actor / subject safe ref、身份观察语境和不可用时的降级 | runtime/event seam、body-free identity ref、visibility/gap | Identity truth、成员生命周期和正文 |
| `L1-governance` | 治理审计语境、policy / gate 观察线索和报告交接输入 | audit ref、safe summary、event/handoff seam | Governance decision truth、审批正文和裁决生命周期 |
| `L1-artifact` | artifact / evidence safe ref、完整性线索、body-free linkage 和 consumer purpose | typed ref、digest、linkage、missing/blocked surface | artifact truth、evidence body、producer 内部存储和 H13 positive |
| `L2-runtime` | log / metric / trace 来源语境、correlation 和 safe runtime observation | redacted telemetry、typed source ref、degraded/gap surface | runtime execution truth、调度控制和运行器内部状态 |
| `L4-sandbox` | sandbox / environment 观察材料来源和隔离边界 | safe summary、availability、gap、handoff | sandbox truth、执行控制和隔离实现内部事实 |
| `L4-archive` | retention marker、active reference、archive eligibility 和长期交接准备 | marker、hold/reference state、body-free handoff | archive package、归档正文、删除执行和 archive truth |
| `L5-console` / `L0-sdk` / reporting consumer | 只读观察面、诊断摘要、report handoff 的消费契约 | view/ref/summary、visibility、redaction、not-visible/degraded | UI ownership、展示产品行为、最终报告或验收签署 |

接缝缺失只能按依赖类型表达 `blocked` 或 `not_evaluated`；不允许用 ISO fake、空结果、旧报告或本仓合成
source truth 代替真实接缝。

### 2.4 哪些非范围会影响最终结论

| 非范围 / 未建立项 | 当前归属 | 对最终结论的处理 |
|---|---|---|
| 目标实现仓、CI、真实 RuntimeLike、真实 artifact/report/evidence | 送验前置，不是 current 设计事实 | 当前只允许 `not_established` / `not_run`；不能写通过，也不能在本 Step 关闭 |
| I05 canonical payload / producer binding 正向路径 | inherited upstream affected | 保留 pre-parse fail-closed、no-ack、zero-write；positive path `blocked/conditional`，不能伪造 evidence |
| J06 H13 positive replay / Completed truth | controlled upstream affected | 只允许 controlled `Blocked/manual` 设计；不得把受控替身升级为完成事实 |
| accepted UoW、recovery class、external phase、consumer completion、job report ref、secondary owner、per-flow propagation | inherited/internal affected | 不阻止范围设计，但会阻断对应 P0 positive gate，必须在后续验收基线和缺陷/风险表中显式保留 |
| production-like、容量、P95/P99、SLA、retention 天数、hash chain 分片 | 无 current workload/threshold source | 作为 P2 candidate；不影响当前 P0 结论，除非用户先将其提升并回写全链路 |
| OTel、Prometheus、Grafana、TimescaleDB、对象存储、APM、GRC、dashboard、alert | 产品中立之外围候选 | 不作为 truth source、compile dependency 或 P0 hard prerequisite；被声明为本轮范围时必须重新基线 |
| 最终 verdict、evidence alias、signoff、上线批准和 implementation commit | 下游真实验收 / 实施阶段 | 本 Step 仅规定未来裁决输入，不产生任何真实身份或签署 |

非范围本身不自动等于“通过”。如果某项被送验材料宣称为 P0/P1 范围，或其缺失导致 P0 truth、redaction、
no-write、evidence authenticity 或 dependency boundary 无法判断，则总体状态必须是 `blocked` 或 `不通过`。

### 2.5 哪些范围项可能成为一票否决

`VF-OBS-001~010` 是 current `00-需求文档.md` §14.3 的唯一红线来源。Step 02 只确定其范围归属，不重新定义
VF 内容；后续 Step 11 必须逐项建立证据和裁决。范围关联如下：

| VF | 范围归属 | 触发时的范围结论 |
|---|---|---|
| `VF-OBS-001` | 五条核心闭环及其代表性组合 | 任一核心闭环无法成立，整体 `不通过` |
| `VF-OBS-002` | redaction-before-serialization、telemetry / audit / report 输出安全 | raw body、secret、credential 或 full sensitive ref 进入观察面，整体 `不通过` |
| `VF-OBS-003` | body-free evidence / artifact / identity / governance / source-audit 边界 | 外部正文入仓或进入输出面，整体 `不通过` |
| `VF-OBS-004` | truth ownership、safe summary、telemetry / report wording | 观察面冒充任一外部 truth，整体 `不通过` |
| `VF-OBS-005` | Query、diagnostic、Consumer、Job、rebuild、replay、report/export no-write | source truth 写入、修复或控制命令成功，整体 `不通过` |
| `VF-OBS-006` | candidate evidence、report provenance、验收交接真实性 | 静态伪造 run / evidence / passed / verdict / signoff，整体 `不通过` |
| `VF-OBS-007` | retention、active / held / referenced protection、cleanup | 受保护材料被删除或保护语义被错误释放，整体 `不通过` |
| `VF-OBS-008` | dependency graph、package boundary、writer capability | 非 `L0-core` sibling 编译依赖或 Bus package dependency，整体 `不通过` |
| `VF-OBS-009` | product-neutral config / adapter / external consumer boundary | 外部产品成为 truth source 或当前硬前置，整体 `不通过` |
| `VF-OBS-010` | historical-material / README / old path / old metric audit | 历史材料被升级为 current hard acceptance，整体 `不通过` |

P1/P2 接缝不能削弱 VF；“外部依赖未建立”本身是 `blocked/not_evaluated`，而“依赖缺失时错误地补造成功、
写入 truth 或伪造 evidence”是 VF 触发。

### 2.6 哪些范围项必须使用详细设计正式字段、状态或接口名

验收范围不能使用“日志正常”“链路可用”“基本完成”等口语主语。凡是进入后续 P0 门禁的范围项，必须使用
`03-详细设计.md` 和 `04-配置设计.md` 的正式名称：

| 范围层 | 必须使用的正式名称 | 本 Step 的边界 |
|---|---|---|
| 核心协议 | 16 Command、14 Query、9 Inbound Consumer、12 Outbound Event、9 Operations Job 的 exact protocol name | Step 02 只固定 inventory 和优先级；逐协议通过/失败在 Step 07 |
| formal state | 27 个 formal state owner；另列 1 个 technical coordination state | Step 02 不新增 state，不把 technical state 当业务 truth；合法迁移在 Step 08 |
| observation schema | `NormalizedLogRecord`、`MetricPoint` / `MetricRollup`、`TraceSpanRecord`、`AuditEventProjection`、`RedactionDecision`、`CorrelationContext`、`EvidenceLink`、`RetentionMarker`、`ReportHandoffRecord` | Step 02 固定其验收主题；字段闭环在 Step 05~10 |
| safety / visibility | `Accepted` / `Rejected` / `Quarantined`、`Degraded`、`NotVisible`、`Gap`、`Blocked`、`NotEvaluated` 等 current surface 语义 | 不用自造 `success`、`healthy`、`done` 或默认空结果替代 |
| config/runtime | `LocalTest`、`IntegrationLike`、`RuntimeLike`；strict source priority；13-stage complete-or-error assembly；redline / availability | Step 02 不将 profile 当执行结果；环境和基线在 Step 03/04 |
| evidence / report | `EV-CAND-OBS-*` 仅为 planned linkage；未来真实证据必须有 `<run_id>`、raw artifact、suite report、report index、acceptance handoff | 不创建真实 alias、verdict 或 signoff |

## 3. 当前文档问题诊断与历史冲突

| 材料 | 发现的冲突 | Current 处理 |
|---|---|---|
| 旧正式 `06-验收标准.md` | 旧 AC/VETO、旧报告路径和旧通过/签署语义不能与 current 31 AC / 10 VF、99 TC 和 canonical path 对齐 | 继续标记为 historical；Step 15 从 current Step 01~14 独立装配 |
| 旧 Step 02 | 只有高层目标短文，没有 SOP 要求的 P0/P1/P2、接缝、非范围和 VF 影响矩阵 | 删除后重建本文件，不继承旧结论 |
| `README.md` / 旧性能与产品栈 | 混入 P95/P99、SLA、TimescaleDB、Grafana、事件数量、冷存和实现假设 | 仅作为 `historical_material` 差异来源；当前不进入 P0 |
| current `05-测试方案.md` | 可执行测试设计很细，但 candidate linkage 不是 evidence，且测试方案不负责最终裁决 | 只消费其 exact inventory、planned paths 和状态语义，不把测试通过写入 06 |
| 旧 `07-实施计划.md` / boundary skeleton | 旧 phase、commit、run 或 boundary 可能与 current 03~05 冲突 | 完成正式 06 后 full-restart 07；本 Step 不使用其结论 |
| L1 参考文档 | 粒度可参考，但业务 truth、AC/VF、suite 和 evidence ID 不适用于本仓 | 只借鉴逐项闭环和裁决表结构 |

## 4. 验收裁决取舍

| 方案 | 决定 | 理由 |
|---|---|---|
| 只验五个核心能力，不展开协议 / 状态 / 红线 | 拒绝 | 无法判断 exact contract、UoW、redaction、no-write、依赖和证据真实性是否成立 |
| 把 99 个 `TC-OBS-*` 逐一当作验收项 | 拒绝 | TC 回答如何测试；验收主轴必须仍是 `AC-OBS-*` 和 `VF-OBS-*`，避免测试编号替代需求裁决 |
| 以 31 AC 为验收项主轴，并按范围关联 exact TC / DS / suite / report | 采用 | 保留需求 truth，同时确保每个门禁可落到未来真实证据 |
| 把 P1 真实接缝作为 P0 核心成立前置 | 拒绝 | 违反依赖裁剪和下游未就绪语义；P1 只能按承诺范围单独裁决 |
| 把 P2 产品、容量和历史指标写成当前硬验收 | 拒绝 | 没有 current workload、threshold 或产品绑定来源，且会触发 `VF-OBS-009/010` |
| 用 `EV-CAND-OBS-*`、静态表或旧 run 作为验收证据 | 拒绝 | 没有 raw artifact/report provenance，违反 `VF-OBS-006` |
| 将 inherited affected 直接判为实现失败或通过 | 拒绝 | 上游能力缺口与本仓 fail-closed 违反是不同事实，必须保持 `blocked/conditional` |
| 让 `07-实施计划.md` 补范围和验收门禁 | 拒绝 | 会反转文档权威顺序，并迫使实现 agent 补设计真相 |

## 5. 结构化中间产物：验收范围总表

下表是本 Step 的核心输出。`证据承接` 只记录未来证据应从哪里产生，不代表当前已有执行结果。

| 验收范围项 | 类型 | 优先级 | Current 需求主语 | 设计边界 / 正式入口 | 裁决目标 | 证据承接 | 非范围 / 影响 |
|---|---|---:|---|---|---|---|---|
| 安全观测材料入口与安全处置 | 核心闭环 `C-OBS-1` | P0 | `AC-OBS-001`、`AC-OBS-006~008`、`AC-OBS-019`、`AC-OBS-025~029` | `SubmitObservationMaterial`、`RecordSafetyDisposition`、`ObservationReceiptState`、`SafetyDispositionState`、`RedactionDecision` | 能区分 accepted / rejected / quarantined，表达 source / correlation / safety context，且 forbidden body 不入观察面 | current `05` 的 `TC-OBS-ING-*`、`TC-OBS-COR-*`、`TC-OBS-RED-*` family anchors；`S-OBS-SERVICE-FLOW`、`S-OBS-TELEMETRY-SAFETY`；未来同 run raw/report | 不验 source owner 内部生成；I05 等上游材料缺失保持 blocked，不补造 source truth |
| 审计投影与 body-free evidence linkage | 核心闭环 `C-OBS-2` | P0 | `AC-OBS-002`、`AC-OBS-009~010`、`AC-OBS-020`、`AC-OBS-025~029` | `AppendAuditProjection`、`LinkBodyFreeEvidence`、`AuditProjectionState`、`EvidenceLinkageState`、`EvidenceLink` | 只保存 ref / digest / purpose / visibility / gap / provenance，能追溯但不拥有 evidence/artifact/governance 正文 | current `05` 的 `TC-OBS-AUD-*`、`TC-OBS-EVD-*`、`TC-OBS-OWN-*` family anchors；`S-OBS-CONTRACT-DOMAIN`、`S-OBS-SERVICE-FLOW`、`S-OBS-STATIC-REDLINE` | 不验相邻仓正文生命周期；I05 positive linkage 受 inherited affected 条件化 |
| safe log / metric / trace 观察面 | 核心闭环 `C-OBS-3` | P0 | `AC-OBS-003`、`AC-OBS-011~012`、`AC-OBS-021`、`AC-OBS-025~029` | `RecordSafeSignal`、`NormalizedLogRecord`、`MetricPoint` / `MetricRollup`、`TraceSpanRecord`、`CorrelationContext`、`SafeSignalState` | schema、allowlist、redaction-before-serialization、correlation、degraded/gap 可解释；telemetry 不冒充 execution truth | current `05` 的 `TC-OBS-SIG-*`、`TC-OBS-DEG-*`、`TC-OBS-RED-*`、`TC-OBS-TRUTH-*` family anchors；`S-OBS-TELEMETRY-SAFETY` | 不验 OTel/Prometheus/Grafana/collector/backend 产品；外部 runtime truth 仍归 L2-runtime |
| 只读 Query、diagnostic 与 report handoff | 核心闭环 `C-OBS-4` | P0 | `AC-OBS-004`、`AC-OBS-013~016`、`AC-OBS-022`、`AC-OBS-025~029` | 14 Query、`PrepareReportHandoff`、`EvaluateAuthenticityHint`、`ReportHandoffRecord`、`DiagnosticFreshnessState`、`ReadVisibilityKind` | 只读消费安全观察面，显式表达 missing / hidden / stale / degraded / authenticity，交接不生成 verdict/signoff | current `05` 的 `TC-OBS-QRY-*`、`TC-OBS-DIA-*`、`TC-OBS-RPT-*`、`TC-OBS-AUT-*` family anchors；`S-OBS-SERVICE-FLOW`、`S-OBS-ENTRY-CAPABILITY`、`S-OBS-TELEMETRY-SAFETY`；`generate_reports.sh` provenance stage | 不验 UI、报表产品、最终验收或控制命令；Query 不触发 repair/rebuild/refresh |
| retention、active reference、rebuild/replay 与 no-write | 核心闭环 `C-OBS-5` | P0 | `AC-OBS-005`、`AC-OBS-017~018`、`AC-OBS-023`、`AC-OBS-025~029` | `SetRetentionMarker`、`ProtectActiveReference`、`DefineReplayScope`、`RecordNoWriteViolation`、`RetentionMarker`、`ReplayScopeState`、`NoWriteViolationState` | active/held/referenced material 受保护；派生面可受控重建；任何维护 / export / report 行为不写 source truth | current `05` 的 `TC-OBS-RET-*`、`TC-OBS-REB-*`、`TC-OBS-NW-*`、`TC-OBS-UOW-*` family anchors；`S-OBS-REPOSITORY-CONFORMANCE`、`S-OBS-RECOVERY-REPLAY`、`S-OBS-STATIC-REDLINE` | J06 positive 受 H13 affected；不验 archive package、source repair 或外部 recovery truth |
| 16 Command exact protocol | 协议边界 | P0 | `AC-OBS-006~018`、`AC-OBS-019~023` | `03` §7.2 exact names、§8 accepted/rejected side effects、§9 formal states | 16/16 protocol 的 request/result/error、owner、side effect 和 forbidden branch 均能进入后续功能/接口验收 | current `05` Step 06 的 `TC-OBS-ING-*`、`TC-OBS-COR-*`、`TC-OBS-AUD-*`、`TC-OBS-SIG-*`、`TC-OBS-EVD-*`、`TC-OBS-RPT-*`、`TC-OBS-AUT-*`、`TC-OBS-RET-*`、`TC-OBS-REB-*`、`TC-OBS-CFG-*` family anchors；各行仍回指其既有 primary suite（总计 9 个 current suite） | Step 02 不展开逐命令字段和执行顺序；Step 05/07/08 负责 |
| 14 Query exact protocol与 strict zero-write | 协议 / 红线 | P0 | `AC-OBS-004`、`AC-OBS-013~016`、`AC-OBS-022`、`VF-OBS-005` | `03` §7.3、§8.3、§14.9；正式 Query operation map | 14/14 Query 的 surface、visibility、freshness、gap、error 和 zero-write 可裁决 | current `05` 的 `TC-OBS-QRY-*`、`TC-OBS-DIA-*`、`TC-OBS-RPT-*`、`TC-OBS-NW-*` family anchors；`S-OBS-SERVICE-FLOW`、`S-OBS-ENTRY-CAPABILITY`、`S-OBS-STATIC-REDLINE` | 不允许 miss/stale 时隐式修复或改变 source truth；具体 mapper 后续定义 |
| 9 Inbound Consumer 接缝 | 协议接缝 | P0 | `AC-OBS-001~005`、`AC-OBS-019~024`、`VF-OBS-001~005` | envelope/schema/producer/header、pre-parse、dedup、ack-after-commit、local projection boundary | 只承接合法观察材料，unsupported/raw body 不 parse、不 ack、不写；accepted 后只写本地允许投影 | current `05` 的 `TC-OBS-ING-*`、`TC-OBS-EVD-*`、`TC-OBS-SIG-*`、`TC-OBS-AUD-*`、`TC-OBS-DEP-*` family anchors；`S-OBS-ENTRY-CAPABILITY`、`S-OBS-SERVICE-FLOW` | I05 positive schema/binding 未闭合；不验上游 event producer 完整生命周期 |
| 12 Outbound Event 与 immutable publication 接缝 | 协议接缝 | P0 | `AC-OBS-002~005`、`AC-OBS-015`、`VF-OBS-004~006` | stored immutable snapshot、outbox/publication token、redaction、failure marker、no current-truth rebuild | 发布只消费已提交本地 snapshot；失败只形成本地 marker，不回滚或重算 source truth | current `05` 的 `TC-OBS-AUD-*`、`TC-OBS-SIG-*`、`TC-OBS-RPT-*`、`TC-OBS-RET-*`、`TC-OBS-UOW-*` family anchors；`S-OBS-REPOSITORY-CONFORMANCE`、`S-OBS-RECOVERY-REPLAY` | 不验 L0-bus transport 主干、topic/vendor/credential；external phase affected 保持开放 |
| 9 Operations Job 与技术协调状态 | 维护协议 / 状态边界 | P0 | `AC-OBS-005`、`AC-OBS-018`、`AC-OBS-023`、`VF-OBS-005~007` | 9 Job exact names、immutable plan、claim/fence、item/report/finalize；1 technical coordination state 独立于 27 formal state owner | job 只写观察 / 派生 / marker / report；duplicate、partial、unknown 和 no-write 可解释 | current `05` 的 `TC-OBS-REB-*`、`TC-OBS-UOW-*`、`TC-OBS-RPT-*`、`TC-OBS-RET-*` family anchors；`S-OBS-RECOVERY-REPLAY`、`S-OBS-REPOSITORY-CONFORMANCE` | J06 仅 controlled blocked/manual；technical item state 不得成为业务 truth |
| 27 formal state owners 与 transition | 状态边界 | P0 | `AC-OBS-006~018`、`AC-OBS-019~023`、`VF-OBS-001/004/005/007` | `03` §9 exact enum/state owner、native history/result/outbox/stale side effects | 合法、非法、terminal、reserved、reopen/supersede 和副作用集合可判定；不以日志或 outcome 代替 state | current `05` Step 06 的 state-bearing exact rows（按 `TC-OBS-ING-*`、`TC-OBS-RED-*`、`TC-OBS-AUD-*`、`TC-OBS-EVD-*`、`TC-OBS-SIG-*`、`TC-OBS-DEG-*`、`TC-OBS-QRY-*`、`TC-OBS-DIA-*`、`TC-OBS-RPT-*`、`TC-OBS-AUT-*`、`TC-OBS-RET-*`、`TC-OBS-REB-*`、`TC-OBS-UOW-*`、`TC-OBS-CFG-*` 等 current family 展开）；`S-OBS-CONTRACT-DOMAIN`、`S-OBS-SERVICE-FLOW` | Step 02 不创建新 state；technical coordination state 只作执行协调事实 |
| UoW、幂等、CAS/cursor、recovery 与 external phase | 一致性边界 | P0 | `AC-OBS-005`、`AC-OBS-018`、`AC-OBS-029`、`VF-OBS-001/005~007` | `03` §10~§13：accepted effect set、rollback、commit unknown、reservation/digest、claim/fence、stored result | accepted 写集原子；duplicate 不二写；unknown 不盲 retry；rebuild/replay 不反写 truth；affected path 明确 | `TC-OBS-UOW-*`、`TC-OBS-REB-*`、`TC-OBS-RET-*`；repository/recovery suites | UoW/recovery/external phase affected 未关闭；不能以局部测试或 candidate evidence 宣布全链路成立 |
| 配置、profile 与 runtime assembly redline | 配置 / 安全边界 | P0 | `AC-OBS-019~024`、`AC-OBS-029~031`、`VF-OBS-002/008~010` | `04` profiles、strict source priority、13-stage complete-or-error、sensitive reference、availability、historical binding | 合法配置形成完整 runtime；任一阶段失败不暴露 partial runtime；禁止 secret/product/历史材料绕过 redline | `TC-OBS-CFG-*`、`TC-OBS-HIST-*`、`TC-OBS-DEP-*`；`S-OBS-CONFIG-REDLINE`、`S-OBS-STATIC-REDLINE` | 当前三 profile 是设计枚举，不表示三套环境已建立；不验具名产品配置 |
| telemetry / audit / evidence / retention / report provenance | 横切证据边界 | P0 | `AC-OBS-001~005`、`AC-OBS-015~017`、`AC-OBS-019~031`、`VF-OBS-002~007/010` | `03` §14；`05` §13；canonical `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | raw -> suite report -> candidate/real linkage -> acceptance handoff 可回指；failure/blocked/not_run 保留；不生成真实 verdict | `S-OBS-TELEMETRY-SAFETY`、各 TC exact primary suite、5 scripts；candidate `EV-CAND-OBS-*` 仅 planned | 本 Step 不固定 run/build/commit；真实 evidence 与验收裁决后置 |
| only-core compile dependency 与 truth ownership | 架构红线 | P0 / Forbidden | `AC-OBS-024`、`AC-OBS-030~031`、`VF-OBS-004/008~010` | `01` 依赖方向、`03` §3/§5/§16、全局裁剪规则 | 仅 `L0-core` compile edge；其他 sibling 仅 runtime/event/handoff；观察面不拥有外部 truth | `TC-OBS-DEP-*`、`TC-OBS-OWN-*`、`TC-OBS-TRUTH-*`、`TC-OBS-HIST-*`；`S-OBS-STATIC-REDLINE` | 依赖缺失可 blocked；越权 compile edge、truth writer 或历史升级直接 VF |

## 6. P1 / P2 / Forbidden 详细边界

### 6.1 P1 接缝裁决规则

P1 的验收目标是证明“接缝契约不会污染本仓 truth”，不是证明外部系统自身完整可用。P1 case 必须记录
依赖类型（compile/runtime/event/handoff/downstream）、source / consumer ref、binding / token、failure mapping、
可见性和 no-fallback 语义。缺少真实依赖时保持 `blocked`、`conditional` 或 `not_evaluated`，不能用 LocalTest
或 `IntegrationLike` 结果填充 `RuntimeLike` 结论。

### 6.2 P2 后置边界

P2 仅能形成 residual / trigger：

- 真实 production-like profile、容量、硬性能阈值、SLO/SLA 和长期 retention 期限；
- 具名 telemetry / storage / dashboard / alert / APM / GRC 产品绑定；
- 高级报表、异常检测、root-cause suggestion、DORA/EBM/ISO 适配和外部归档深度集成；
- console UI ownership、产品交互体验和 deployment rehearsal。

任何 P2 若被纳入送验范围，必须新增有来源的需求 / 设计 / 测试 / 环境 / evidence contract，并重新审查
`VF-OBS-009` 与 `VF-OBS-010`；本 Step 不把它们写成当前通过条件。

### 6.3 Forbidden 处理规则

Forbidden 不是“低优先级功能”，而是必须主动证明不会发生的负向边界。它覆盖：

1. raw body、secret、credential、provider / evidence / artifact / runtime body 和 full sensitive ref 进入任一观察或报告输出面。
2. audit / log / metric / trace / summary / handoff 冒充业务、治理、制品、身份、运行或归档 truth。
3. Query、diagnostic、Consumer、Job、rebuild、replay、report、export 或 sink 写 source truth、修复事实或下发控制。
4. active / held / referenced material 被误清理，或 retention marker 被外部 TTL / cleanup 结果替代。
5. 非 `L0-core` sibling 编译依赖、L0-bus package dependency、writer capability 越界。
6. 静态表、旧 run、`latest`、candidate linkage、手工 summary 生成真实 evidence、passed、verdict 或 signoff。
7. 历史 README / 正式文档 / 旧指标 / 旧路径成为 current hard acceptance。

这些边界的失败条件由 `VF-OBS-001~010` 和后续 Step 11 共同承接，不能风险接受或由 P1/P2 降级。

## 7. 范围与结论状态映射

| 情况 | 允许状态 | 总体裁决影响 | 禁止替代 |
|---|---|---|---|
| P0 设计契约、TC、数据和未来证据路径均已定义，但尚无真实执行 | `planned` / `not_run` | 当前只表示设计完成，不能形成验收结论 | 不得写 `通过` 或真实 EV |
| required P0 lane / dataset / script / upstream contract 缺失 | `blocked` | 对应范围不可裁决；正式验收不得判通过 | 不得用低等级 lane、空 artifact、旧 run 或人工表补齐 |
| P1 外部 seam 未建立但核心本仓边界可证明 | `conditional` / `not_evaluated` | 仅在明确送验范围与接受规则后决定；不自动升级为 P0 pass | 不得把接缝缺失写成外部成功 |
| P2 无 threshold / workload / product binding | `risk_candidate` / `not_in_scope` | 不影响当前 P0 设计；进入后续风险与触发项 | 不得从历史数字产生 hard pass/fail |
| VF 命中或 Forbidden 行为成功 | `failed` / `不通过` | 直接阻断整体验收，不允许风险接受 | 不得删除 finding、重命名为 residual 或用 summary 覆盖 |
| inherited affected 的 fail-closed 行为正确、positive path 未具备 | `blocked_upstream` / `conditional` | 记录上游影响，不把本仓设计误判为通过或缺陷 | 不得创建 canonical alias、fake positive 或 H13 Completed |

## 8. 改动前后对比

| 维度 | 旧材料 / 旧 Step 02 | Current Step 02 |
|---|---|---|
| 验收主轴 | 高层目标短文，无法逐项裁决 | 31 AC / 10 VF 主轴，按范围项闭合到设计与证据入口 |
| 优先级 | 未清楚区分 | P0、P1、P2、Forbidden 分开，明确总体结论影响 |
| 下游接缝 | 可能把外部能力视为本仓功能 | 只验 typed ref / snapshot / event / adapter / handoff 接缝，不验相邻 truth 生命周期 |
| 非范围 | 旧产品、性能和实现假设混入 | 明确 production-like、产品、容量、真实执行和签署后置 |
| 红线 | 旧 VETO / 模糊安全词 | 唯一 `VF-OBS-001~010`，逐项绑定范围和不通过影响 |
| 正式字段 | 口语能力描述 | exact Command / Query / Consumer / Event / Job、state、schema、profile 名称 |
| 真实性 | 文件存在可能被误读为已验收 | `planned/blocked/conditional/not_evaluated` 与真实验收三值严格分离 |

## 9. 正式 `06` §2 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“验收范围总表”“P1 / P2 / Forbidden 详细边界”“范围与结论状态映射”和“待确认事项”小节，了解本章验收范围如何从 current 需求、详细设计和测试证据边界收敛而来。

正式 `06-验收标准.md` §2 只承载以下结论：

1. 本轮验收以五条核心闭环为 P0 主线：安全观测材料入口、审计投影与 body-free evidence、safe log/metric/trace、只读 Query/diagnostic/report handoff、retention/rebuild/replay/no-write。
2. P0 同时覆盖 16 Command、14 Query、9 Inbound Consumer、12 Outbound Event、9 Operations Job、27 formal state owners + 1 technical coordination state、UoW/幂等/恢复、配置装配、telemetry / audit / evidence provenance 和 only-core dependency redline。
3. P1 只裁决真实 adapter / store / transport / resolver / archive / consumer 接缝；P2 的 production-like、容量、具名产品、复杂报表和高级外围增强不属于当前核心通过条件。
4. `VF-OBS-001~010` 与 Forbidden 边界是不可降级的阻断条件；任何 raw body、外部 truth ownership、source truth write、非法依赖、静态伪造证据或历史材料越权均导致不通过。
5. I05/H13、UoW/recovery、external phase、consumer completion、job report ref、secondary owner 和 per-flow propagation 等 inherited affected 只能保持 blocked/conditional，不得以设计期 candidate linkage 关闭。

## 10. 待确认事项与进入下一步条件

### 10.1 待确认事项

| ID | 内容 | 当前状态 | 影响 |
|---|---|---|---|
| `Q-06-02-01` | I05 payload / producer binding 和 J06 H13 positive 何时具备可执行上游契约 | inherited open | 对应 P0 Consumer / Job positive 只能 blocked/conditional |
| `Q-06-02-02` | accepted UoW、recovery class、external phase、consumer completion 和 report ref affected 何时完成 owner 闭合 | inherited / internal affected | 影响 P0 consistency / recovery / handoff 裁决 |
| `Q-06-02-03` | 是否将任何 P2 workload / hard threshold / product binding 提升为本轮送验范围 | not authorized | 未回写 00~05 前不产生当前硬门禁 |
| `Q-06-02-04` | 真实 target repo、CI、RuntimeLike、run/artifact/report/evidence 何时建立 | not established | Step 03/04 的真实基线与送验前置仍为空 |

### 10.2 Step 门禁自检

| 检查项 | 结论 |
|---|---|
| 六个 SOP 问题均有回答 | `pass` |
| P0/P1/P2/Forbidden 已明确分离 | `pass` |
| 每个核心范围项有 current AC / VF、正式设计边界和证据承接方向 | `pass_design` |
| 外部能力只按接缝裁决 | `pass` |
| 非范围及其对总体结论的影响已显式 | `pass` |
| exact protocol / state / schema / profile 名称未被口语替代 | `pass` |
| candidate linkage、planned、blocked、not_evaluated 未被写成真实通过 | `pass` |
| inherited affected 未被关闭或伪装为实现缺陷 | `pass` |
| 新上游 blocker | `none` |
| gate_status | `pass_for_acceptance_scope_design` |
| next_allowed_action | `start_current_06_step_03` |
| formal `06` 是否修改 | `no; Step 15 前禁止` |
| commit | 不需要；用户未要求提交 |

## 11. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 02
- `standards/document/验收标准书写规范.md` §二、§三、§四
- `standards/document/设计文档编写通则.md`
- `standards/document/设计文档讨论中间产物规范.md`
- `standards/document/设计真相源闭环与可落码性标准.md`
- `standards/document/全局项目依赖关系与裁剪规则.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_01_input_boundary.md`
- `projects/L4-observability/00-需求文档.md` §7、§12~§14
- `projects/L4-observability/01-架构设计.md` truth ownership / dependency boundary
- `projects/L4-observability/02-概要设计.md` component and capability boundary
- `projects/L4-observability/03-详细设计.md` §5~§14、§16~§17
- `projects/L4-observability/04-配置设计.md` profile / assembly / redline boundary
- `projects/L4-observability/05-测试方案.md` §2、§3、§6、§8~§14
- `projects/L1-governance/06-验收标准.md`、`projects/L1-artifact/06-验收标准.md`（粒度参考）
