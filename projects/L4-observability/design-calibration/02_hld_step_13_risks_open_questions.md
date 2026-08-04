# L4-observability 02-概要设计 Step 13 · 设计风险与待确认事项

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 13
> 回填章节: `02-概要设计.md` §13 设计风险与待确认事项
> 生成日期: 2026-07-09
> 状态: 已完成,等待用户确认后进入 Step 14

---

## 1. 本步目标

在 Step 04 ~ Step 12 已经收稳代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、异常边界、配置影响轮廓和详细设计承接清单后,显式收纳当前概要设计层仍未闭环的设计风险与待确认事项。

本步只收纳会影响概要设计成立性、详细设计继续展开或后续实现门禁的未闭环项。不写 backlog、待办事项、开发排期、实施任务、配置项清单、完整测试用例全集、真实 `run_id`、真实 evidence alias、验收签署、真实测试结果或实现 commit。已经进入 Step 12 详细设计承接清单的稳定输入,不在本步重新包装成待确认。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 13 | 已读取 | 约束本步只输出设计风险清单、设计待确认事项清单和当前未闭环项说明。 |
| `standards/document/概要设计书写规范.md` 4.13 | 已读取 | 约束风险表和待确认表格式,并禁止任务、roadmap、风险矩阵和已稳定输入回退。 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体、实现分层和已关闭的组成部分拆分问题。 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 10 个主要组成部分、职责边界和已关闭的对象发现问题。 |
| `02_hld_step_06_key_objects.md` 及对象附录 | 已完成 | 提供关键对象主语、对象归属和仍需详细设计细化的对象承载问题。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command / Query / Consumer / Event / Job 骨架和接口命名 / 拆分挂起项。 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供处理流、函数参数骨架和 read audit / publication state 等挂起项。 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供状态族、允许 / 禁止迁移和状态承载 / 命名挂起项。 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供 restricted / redacted / not-visible / dead-letter / handoff error 等异常挂起项。 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 提供配置影响轮廓、禁止配置化边界和配置值 / 产品选型挂起项。 |
| `02_hld_step_12_detailed_design_handoff.md` | 已完成 | 提供 Step 13 预计收纳主题、稳定输入和概要设计回退规则。 |
| `projects/L4-observability/00-需求文档.md` §15 | 当前正式需求基线 | 提供需求层风险、待确认事项、当前不阻塞项和后续一旦发生即阻塞项。 |
| `projects/L4-observability/01-架构设计.md` | 当前正式架构基线 | 提供架构层 truth ownership、body-free、产品中立、依赖裁剪和真实 evidence 边界。 |
| `projects/L1-governance/design-calibration/02_hld_step_13_risks_open_questions.md` | 已读取 | 作为概要层风险 / 待确认拆分、阻塞判断和回填草稿粒度参考。 |
| `projects/L1-artifact/design-calibration/02_hld_step_13_risks_open_questions.md` | 已读取 | 作为历史材料污染、外部正文、handoff 和实现前阻塞口径粒度参考。 |
| 旧 `02_hld_step_13_risks_open_questions.md` | 已读取 | 仅作 historical material,识别其结构过短、风险 / 待确认混写和旧自动门禁问题。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 13 标准、Step 04~12、旧 Step 13、正式 `00/01` 和 L1 参考 | done | 本文件 §2 |
| 回答 SOP 问题,区分风险与待确认事项 | done | 本文件 §4 |
| 诊断旧材料与前序挂起项 | done | 本文件 §5 |
| 输出设计取舍 | done | 本文件 §6 |
| 输出设计风险清单 | done | 本文件 §7 |
| 输出设计待确认事项清单 | done | 本文件 §8 |
| 标注已由前序 Step 关闭、不再挂起的事项 | done | 本文件 §9 |
| 说明不阻塞 Step 14 与进入实现前会阻塞的事项 | done | 本文件 §10 |
| 排除任务层事项并形成回填草稿、自检和门禁 | done | 本文件 §11~§14 |

---

## 4. SOP 问题回答

### 4.1 当前概要设计层已经明确构成风险、但尚未闭环的问题有哪些?

当前风险不在于 Step 04 ~ Step 12 没有收稳,而在于后续详细设计、配置设计、测试方案、验收标准或实施计划若误用未定事项,会打穿已经收稳的观察面边界。主要风险包括:

- 观察材料、safe signal、audit projection、diagnostic summary、metric / log / trace、report handoff 或 evidence index input 被误写成业务 source truth、Governance truth、Artifact truth、Identity truth、runtime execution truth、archive truth 或外部产品 truth。
- raw body、secret、credential、payload body、source audit body、evidence body、artifact body、identity body、governance decision body、runtime body、provider response body 或 archive package body 通过 schema、DTO、event、store、query、export 或 handoff 进入本仓。
- report handoff、authenticity hint、evidence index input 或设计阶段材料静态填写真正 `run_id`、真实 evidence alias、passed evidence、final verdict、signoff 或验收结论。
- Query、diagnostic、projection、report assembly、rebuild、replay、retention、handoff、external export 或 outbox publication 反写、修复、回滚或补造外部 truth。
- 外部 APM、OTel、Prometheus、Grafana、TimescaleDB、对象存储、dashboard、alert、GRC 或 external audit 产品被升级为核心闭环、当前硬前置、配置 truth 或 observation truth source。
- 旧 P95 / P99 / SLA、冷存期限、hash chain 分片、事件数量、审计覆盖率或旧 implementation boundary 被写成当前概要稳定结论、测试硬指标或验收硬线。
- redaction-first、body-free、not-visible、restricted、degraded、placeholder、gap、retention hold、active reference protection、outbox dead-letter 和 no-write guard 被配置或实现细节弱化。
- 后续实现因为 `03/04/05/06/07` 缺口而自行补 schema、字段、状态、port、产品选型、容量数字、测试 evidence 或 implementation boundary。

### 4.2 当前还有哪些问题尚未形成定论,只能作为待确认事项挂起?

当前仍需挂起的问题集中在详细设计落点、配置 / 产品选择、测试 / 验收量化和实施移交:

- `SafeSignal` 是否在详细设计中拆成 log / metric / trace 三套 command / query / value object。
- `ExternalAuditExportPreparation` 是否保留 state object 主语,并在详细设计中额外拆 projection / view wrapper。
- `PrepareExternalAuditExport` Command 与 Job 是否改名区分。
- `ConsumeSourceAuditMaterial` 是否按 Governance / Artifact / Runtime / Sandbox source family 拆分 consumer。
- `OutboxPublicationState` 是否独立对象化,以及 dead-letter / retry / payload /人工处置结构如何定义。
- `DiagnosticFreshnessState` 落在 `DiagnosticSummary`、`DiagnosticView` 还是独立 freshness marker。
- `ReadAccessRecord` 是由 Query 同步写入、由审计侧异步生成,还是采用 stored result / outbox 派生。
- redaction、evidence、retention、consumer、publisher、handoff、export、adapter、job、read 配置对象如何拆分。
- DB、queue、object store、search、APM、OTel、Prometheus、Grafana、TimescaleDB、dashboard、alert、GRC、external audit 等产品是否进入正式配置 / 实施基线或 ADR。
- P95 / P99 / SLO、容量、retention days、freshness threshold、batch size、parallelism、retry class、hash / digest / canonicalization 算法是否升级为正式测试 / 验收或配置约束。
- report handoff、evidence index input、redaction report、authenticity hint 和 external audit export 的正式交接格式。
- high-risk 配置变更是否需要治理审批、operator approval、独立配置治理或真实运行证据链。
- `07-实施计划.md` 完成时如何创建 implementation ledger 和 planned boundary skeleton。

### 4.3 这些未闭环项分别会影响哪些主要部分、对象、接口、处理流、状态机或配置影响轮廓?

风险表和待确认表均在“影响”列标明影响范围。凡是会改变 Step 04~11 已收稳主语、职责、对象、接口、处理流、状态机、异常边界或配置影响轮廓的项,后续不能在 `03-详细设计.md` 中暗改,必须按 Step 12 回退规则先回概要设计或更上游 `00/01` 修正。

### 4.4 哪些问题若不先收纳,后续详细设计会被误导?

最容易误导详细设计的是“看起来像默认方案、但没有被当前概要层定稿”的内容:

- 旧 README / 旧正式文档中的具名产品、旧性能数字、冷存期限、hash chain、事件数量和旧 implementation boundary。
- `SafeSignal`、external audit export、source audit consumer、outbox publication、diagnostic freshness 和 read access 的落码拆分方式。
- 具体 event schema、DTO 字段、store 表、Config key、retry / batch / freshness / retention 值。
- report handoff、evidence index input 和 authenticity hint 的交接格式。
- 外围 dashboard、alert、GRC、management report、external audit 产品绑定。

这些事项如果不挂起,详细设计可能把它们当作已经批准的概要输入。

### 4.5 哪些内容只是任务或优化项,不应被包装成设计风险或待确认事项?

以下内容不进入本步:

- 文档润色、章节排序、交叉引用、术语统一。
- crate / module / file / trait / struct 最终命名本身。
- 测试用例逐条编写、fixture、mock 数据、CI 脚本、报告样式和证据目录。
- 普通重构、排期、提交拆分、人员分工、开发任务和 issue 拆解。
- 已经明确交给 `03-详细设计.md` 展开的字段、DTO、状态矩阵、repository trait、port trait、event payload、job report 和 transaction boundary。

---

## 5. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 13 | 只有短表和泛化结论,没有按概要 Step 04~12 的稳定输入重建风险 / 待确认边界 | 全量替换为当前 Step 13 产物。 |
| 旧 Step 13 | 将 log / metric / trace / audit schema 当成结构化中间产物,但没有列真正的风险表和待确认表 | 改为按书写规范 4.13 输出设计风险表和待确认事项表。 |
| 旧 Step 13 | gate 使用旧自动装配门禁,违背当前“一 Step 一确认”纪律 | 改为 `wait_user_confirmation_before_step_14`。 |
| 旧正式 `02-概要设计.md` | 风险、待确认、产品候选、旧指标和实现缺口混杂 | 当前只保留概要层风险和待确认事项,不承认旧正文为真相源。 |
| Step 04~06 前序挂起项 | 部分已被后续 Step 收口,若继续挂起会制造假未闭环 | 本步单列“已关闭、不再挂起”清单。 |
| Step 07~11 前序挂起项 | 多数属于详细设计、配置设计或测试 / 验收需要继续闭口的事项 | 本步作为待确认事项挂起,并给出当前保守口径。 |
| Step 12 承接清单 | 已稳定输入若被重新挂起,会让 `03-详细设计.md` 失去入口 | 本步不重复挂起 Step 12 已确认的主语和职责。 |
| 历史材料 | TimescaleDB、Grafana、Prometheus、OTel、P95、冷存、hash chain、事件数量容易被误当成当前基线 | 作为风险或待确认保守处理,不得直接升级为概要真相源。 |

---

## 6. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否复制需求 / 架构风险全文 | 不复制全文 | Step 13 只收纳仍直接影响概要设计成立性和下游展开的风险。 |
| 是否把 Step 12 已承接给 `03` 的 exact contract 再写成待确认 | 不再重复挂起 | 字段、DTO、状态矩阵、port、repository、event payload 和 job report 是详细设计任务,不是概要未收稳。 |
| 是否把产品选型未定写成阻塞风险 | 不直接阻塞 | 产品未定本身可接受;只有产品反向定义 truth 或成为硬前置时才构成风险。 |
| 是否把旧性能数字写成候选待确认 | 是 | 旧数字可能影响测试 / 验收,但缺当前负载模型和证据,不能写成硬指标。 |
| 是否把对象 / 接口命名拆分写成待确认 | 是,但只作为详细设计落点 | 命名拆分可影响可落码性,但不能改变 `SafeSignal`、export、consumer、publication 和 freshness 的概要主语。 |
| 是否阻塞进入 Step 14 | 不阻塞 | 当前风险均有保守处理口径,待确认事项不推翻 Step 04~12 的稳定主线。 |

---

## 7. 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| 观察材料、safe signal、audit projection、diagnostic summary、metric / log / trace 或 report handoff 被误写成外部业务 truth | 影响 Step 03 约束、Step 05 主要组成部分、Step 06 truth / projection 对象、Step 08 处理流和 Step 09 状态机 | 本仓只拥有 observation side fact、audit projection、body-free linkage、marker、history、projection、handoff 和 no-write violation;外部 truth 只能以 safe ref / summary / marker / gap 协作。 |
| raw body、secret、credential、payload body、source audit body、runtime body、provider response body 或 archive package body 通过 schema / DTO / event / store / export 入仓 | 影响 intake、redaction、evidence linkage、read query、handoff、external export、persistence 和验收否决项 | 坚持 redaction-first 与 forbidden body 拒绝 / 隔离;任何正文入仓设计必须回退需求 / 架构 / 概要边界。 |
| evidence body、artifact body、identity body、governance decision body 或 source audit truth 正文被 `EvidenceLinkage` / `AuditProjection` / `ReportHandoffRecord` 接管 | 影响 `Audit Projection and Body-free Evidence Linkage`、`Report Handoff and Authenticity`、reference 对象和 handoff 流 | 只允许 body-free ref、digest / integrity hint、safe summary、visibility、gap 和 consumer purpose;正文归对应 truth owner。 |
| report handoff、evidence index input、authenticity hint 或设计阶段材料伪造真实 `run_id`、真实 evidence alias、passed evidence、final verdict 或 signoff | 影响 report handoff、acceptance handoff、测试方案、验收标准和实施 evidence discipline | 设计文档只写真实性提示和占位 / 缺口语义;真实证据、运行编号、验收结论和签署只能来自真实执行与验收阶段。 |
| Query、diagnostic、projection、report assembly、rebuild、replay、retention、handoff、external export 或 outbox publication 反写、修复、补造或回滚 source truth | 影响 Step 07 接口读写性质、Step 08 处理流、Step 09 状态传播、Step 10 异常边界和 Step 11 配置禁止线 | Query no-write、Consumer non-truth-write、Job no-source-repair、Replay observation-side-only;派生失败只表达 stale / degraded / failed / dead-lettered / blocked。 |
| Consumer 通过 source audit material 猜 schema、吸收 source body 或直接生成 Governance / Artifact / Runtime / Sandbox truth | 影响 inbound event consumer、source family、dedup、quarantine、reference snapshot 和 audit projection | Consumer 只写本仓 receipt、snapshot、marker、projection stale、history 或 handoff candidate;外部正式变化必须由对应 owner 负责。 |
| correlation id、trace id、span id、causation id 或 opaque business hint 被反推出业务 truth 或身份 / 制品 / 运行 truth | 影响 `CorrelationContext`、`SafeSignal`、trace schema、actor / subject ref 和 evidence ref | correlation 只提供观察关联语境;任何业务语义必须通过 typed ref / safe summary / source owner 语境显式承接。 |
| redaction / restricted / not-visible / missing / unavailable / degraded / placeholder / gap 语义被合并或弱化 | 影响 read query、diagnostic、evidence visibility、gap、handoff、export 和验收否决项 | 各语义必须保持可区分;not-visible 不等于 missing,placeholder 不等于 real evidence,degraded / blocked 不得伪装成功。 |
| retention marker、archive eligibility、active reference protection、cleanup、replay 或 rebuild 被写成可删除活动引用材料或修复外部 truth 的能力 | 影响 retention、archive handoff、replay coordination、no-write guard、operations job 和验收数据归属 | retention / replay 只作用 observation side;活动引用和 hold 未闭合时不得清理,archive package truth 不归本仓。 |
| outbox publish failure、handoff failure、external export failure 或 dead-lettered 被静默隐藏或回滚已提交 truth | 影响 outbox publication、handoff lifecycle、external audit export、operations visibility 和一致性边界 | 已提交 observation truth 不因传播失败回滚;失败必须形成 failed / retryable / dead-lettered / blocked surface 并运维可见。 |
| 配置绕过 actor、metadata、idempotency、redaction、body-free、visibility、retention、no-write、dead-letter 或 handoff non-signoff 门禁 | 影响 Step 11 配置影响、Domain Policy、状态机、异常边界和 negative tests | 配置只能影响运行承载、adapter、job、节奏、限流和降级;不能改写 domain invariant 或安全红线。 |
| 外部 APM、OTel、Prometheus、Grafana、TimescaleDB、object store、dashboard、alert、GRC 或 external audit 产品成为核心前置、truth source 或配置 truth | 影响产品中立适配、外部接缝、配置设计、测试方案和依赖裁剪 | 外部产品只作为 adapter / store / export / display 候选;产品状态、存储模型和配置不得定义 observation truth。 |
| 旧 P95 / P99 / SLA、冷存期限、hash chain 分片、事件数量、旧 evidence 路径或旧 implementation boundary 被直接升级为当前硬指标 | 影响性能 / 容量 / 留存 / 验收 / 实施计划和历史材料处理纪律 | 旧数字只作候选线索;是否升级必须经配置、测试、验收或实施计划重新闭口。 |
| 非 `L0-core` sibling repo 成为核心语义编译期依赖,或 `L0-bus` 主干 ack / retry / dead-letter / replay truth 被迁移到本仓 | 影响全局依赖裁剪、ports、adapter、consumer、publisher 和架构边界 | `L0-core` 是唯一编译期核心依赖;其他仓通过 ref、summary、event、port、handoff 或运行期协作。 |
| `03/04/05/06/07` 未闭口时实现侧自行补 schema、状态、port、配置、产品、测试 evidence 或 implementation boundary | 影响设计真相源闭环、可落码性和实现移交 | 缺 exact contract 必须回到对应设计文档闭口;不得由实现 agent 私自补设计主语或伪造 evidence。 |

---

## 8. 设计待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `SafeSignal` 是否在详细设计中拆成 log / metric / trace 三套 command、query、value object 或 adapter contract | `Correlation and Safe Signal`、Step 06 对象、Step 07 接口、Step 08 flow、Step 09 rollup 状态 | 当前概要层保持统一 `SafeSignal` 主语;详细设计可细分实现类型,但不得拆掉统一安全信号语义。 |
| `ExternalAuditExportPreparation` 是否继续作为 state object,还是额外拆出 projection / export view wrapper | `Peripheral Consumption and Export`、Step 06 对象、Step 09 peripheral / export 状态、handoff / export flow | 当前按 truth/state 承接 ready / blocked / retryable 语义;若需新增正式对象必须回退 Step 06,否则只在详细设计中拆 view wrapper。 |
| `PrepareExternalAuditExport` Command 与 Job 是否改名区分 | Step 07 Command / Operations Job、Step 08 peripheral / export flow、Step 10 handoff error mapping | 当前通过接口分类和上下文区分;详细设计可改为更明确的落码名,不能改变 no-truth / body-free / non-signoff 边界。 |
| `ConsumeSourceAuditMaterial` 是否按 Governance / Artifact / Runtime / Sandbox source family 拆成多个 consumer | Step 07 Consumer、Step 08 consumer flow、Step 10 unsupported schema / quarantine、Step 11 consumer config | 当前概要层保留统一入口和 source family;详细设计可拆 handler / adapter,但不能吸收 source audit body 或外部 truth。 |
| `OutboxPublicationState` 是否独立对象化,以及 failed / retryable / dead-lettered 的 stored result 结构 | Step 09 publication 状态、Step 10 outbox exception、Step 11 publisher config、Step 12 persistence / outbox contract | 当前作为 publication 状态族承接;详细设计决定对象化和 payload 结构,但 publish failure 不回滚 truth 且 dead-letter 必须可见。 |
| `DiagnosticFreshnessState` 落在 `DiagnosticSummary`、`DiagnosticView` 还是独立 freshness marker | read / diagnostic 对象、Step 09 freshness 状态、Step 10 degraded / stale response、Step 11 read config | 当前作为 read / diagnostic 状态族处理;详细设计选择字段承载,Query 仍保持 no-write。 |
| `ReadAccessRecord` 由 Query 同步写入、审计侧异步生成,还是由 stored result / outbox 派生 | read query flow、audit / history record、transaction boundary、privacy / visibility tests | 当前只要求读取可审计且不反写 source truth;详细设计定义写入时机和一致性边界。 |
| restricted / redacted / not-visible / unavailable / degraded 在 Query response 中的 exact 字段组合 | Query DTO、read visibility、diagnostic view、consumer-facing response、测试方案 | 当前概要层锁定语义差异;字段组合和 serialization 留给详细设计。 |
| duplicate consumer receipt、ignored old event、delayed unsupported event、quarantine receipt 的 stored result 结构 | Consumer envelope、dedup、state transition、operations visibility、negative tests | 当前只锁定不得重复写、不得倒退、不得猜 schema、不得保存正文。 |
| report handoff、evidence index input、redaction report、authenticity hint 和 external audit export 的正式交接格式 | report handoff、evidence linkage、external audit / GRC export、验收材料交接 | 当前按 body-free、缺口说明和不伪造真实证据处理;格式后移 `03/05/06/07`。 |
| `RedactionPolicyConfig`、`EvidencePolicyConfig`、`RetentionPolicyConfig`、`ConsumerConfig`、`PublisherConfig`、`HandoffConfig` 等是否拆成独立配置对象 | Step 11 配置影响、`03-详细设计.md` config contract、`04-配置设计.md` | 当前只锁定分类、owner 和禁止越界;字段、key、默认值和命名留给 `03/04`。 |
| freshness threshold、retention days、batch size、parallelism、retry class、dead-letter payload 和 handoff retry 如何配置 | `04-配置设计.md`、operations job、publisher / handoff、测试方案、验收标准 | 当前作为配置设计候选;不得削弱 redaction、body-free、no-write、active protection 或 dead-letter visibility。 |
| DB、queue、object store、search、APM、OTel、Prometheus、Grafana、TimescaleDB、dashboard、alert、GRC、external audit 产品是否进入正式基线或 ADR | 配置设计、技术选型、实施计划、容量验证、外部产品中立适配 | 当前只固定承载角色和产品中立边界,不锁产品;任何产品都不能成为 truth source。 |
| P95 / P99 / SLO、吞吐、容量、留存期限、hash / digest / canonicalization、chain gap 是否升级为正式测试 / 验收约束 | `05-测试方案.md`、`06-验收标准.md`、容量模型、安全 / 完整性验证 | 当前不把旧数字或旧算法写成硬指标;需后续负载模型、风险评估和验收证据支撑。 |
| high-risk 配置变更是否需要治理审批、operator approval、独立配置治理或真实运行 evidence | configuration audit、security、operations、acceptance evidence、implementation process | 当前只要求配置可审计且不可越界;真实审批、真实 evidence 和签署只能由后续真实流程产生。 |
| external audit / GRC / archive / report handoff 是否需要更深回链验证、双向集成或人工恢复流程 | handoff jobs、external export、archive / report handoff、验收 evidence、operations runbook | 当前只固定 handoff marker、blocked / failed / retryable surface 和 truth 不回滚规则。 |
| implementation ledger 和 planned boundary skeleton 如何在 `07-实施计划.md` 中重建 | 实施计划、实现移交、boundary audit、项目台账 | 当前旧 implementation ledger / boundaries 仍为 historical material;只有完成 `07` 时才能按新设计创建。 |

---

## 9. 已由前序 Step 关闭、不再挂起的事项

| 事项 | 来源 | 当前结论 |
|---|---|---|
| 主要组成部分是否保持 10 个 | Step 04 / Step 05 | 已由 Step 05 收稳为 10 个主要组成部分;后续若改变需回退 Step 05。 |
| `引用 / 快照 / 交接支撑` 是否独立成组成部分 | Step 04 / Step 05 | 已纳入 `Product-neutral Adapter and Reference Support` 与 handoff / reference 接缝,不再作为 Step 13 待确认。 |
| `ObservationReceipt` 与 `SafetyDisposition` 是否分开 | Step 05 / Step 06 | 已作为分开的正式对象承接,可在详细设计中确定聚合边界。 |
| `ExternalAuditExportPreparation` 是否进入关键对象池 | Step 05 / Step 06 | 已进入关键对象池并按 state object 承接,Step 13 只挂其详细设计落点。 |
| 旧 Step 文件是否需要立即删除 | Step 04~12 | 当前不删除,统一作为 historical material / historical_material_replaced 处理。 |
| 外围 dashboard / alert / external audit / GRC 是否进入核心接口主线 | Step 07 / Step 12 | 当前统一由 peripheral export / handoff / view 承接,不把产品化消费面写成核心 truth。 |
| `SignalRollupState` 与 `RollupRebuildStateKind` 是否合并 | Step 09 | 当前保持区分:前者面向读侧 freshness,后者面向维护 job execution。 |
| `Prepared` / `Delivered` 在 handoff、peripheral、external export 中是否统一为同一 truth | Step 09 | 当前统一语义但按对象区分,交付成功不得误写成 truth 成立或验收通过。 |

---

## 10. 当前设计层未闭环项说明

### 10.1 当前不阻塞进入 Step 14 的事项

以下事项当前不阻塞整理正式 `02-概要设计.md`:

- 产品选型和具体存储 / 消息 / 搜索 / APM / dashboard / GRC 产品未定。
- 旧 P95 / P99 / SLA、容量、retention days、hash / digest / canonicalization 和 chain gap 是否升级未定。
- `SafeSignal`、external audit export、source audit consumer、outbox publication、diagnostic freshness、read access 的详细设计落点未定。
- Query response 字段、consumer stored result、handoff receipt、dead-letter payload 和 config key / 默认值未定。
- high-risk 配置变更的治理审批、真实 evidence 生成和人工恢复流程未定。
- implementation ledger 和 planned boundary skeleton 尚未重建。

这些事项不会推翻 Step 04 ~ Step 12 已收稳的概要主线,只影响 `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 或 ADR。

### 10.2 进入实现前会阻塞的事项

以下事项若在进入实现前仍未闭合,会阻塞落码:

- `03-详细设计.md` 没有给出对象字段、DTO、状态矩阵、repository / port、event payload、job report、transaction boundary 和 error mapping。
- `04-配置设计.md` 没有给出 redaction / evidence / retention / consumer / publisher / handoff / export / adapter / job / read 配置项、校验规则和禁止越界负例。
- `05-测试方案.md` 没有覆盖 query no-write、consumer / job 不写 source truth、forbidden body、body-free evidence、not-visible / degraded、retention active protection、outbox / handoff failure 和 configuration negative gates。
- `06-验收标准.md` 没有保留 forbidden body、证据正文入仓、真实 evidence 伪造、外部产品 truth source、旧指标误升级和 implementation boundary 伪造的一票否决。
- `07-实施计划.md` 没有创建 implementation ledger 和全部 planned boundary skeleton,或要求实现 agent 自行补设计主语。
- 后续文档出现 raw body 入仓、外部 truth 接管、Query / Job / Consumer 反写 source truth、外部产品成为 truth source、真实 evidence 被伪造或旧材料直接恢复为当前基线。

### 10.3 风险与待确认处理规则

- 风险项必须在正式 `02-概要设计.md` 中保留为设计红线或保守处理口径。
- 待确认事项不得在 Step 14 正式装配时润色成已确认结论。
- 如果 Step 14 发现某个待确认事项实际会改变 Step 04 ~ Step 12 的稳定主语,必须回退对应 Step 修正。
- 如果 `03-详细设计.md` 需要改变风险项处理口径,应先回退到需求、架构或概要对应章节重新收口。

---

## 11. 不作为设计风险或待确认事项的内容

| 内容 | 不纳入原因 | 后续归属 |
|---|---|---|
| 文档润色、章节排序、交叉引用、术语统一 | 不改变概要设计主语或边界 | Step 14 |
| crate / module / file / trait / struct 最终命名 | 属于详细设计和实现组织 | `03-详细设计.md` / `07-实施计划.md` |
| 测试用例逐条编写、fixture、mock 数据 | 属于测试方案细化 | `05-测试方案.md` |
| CI、脚本、报告样式、evidence 目录 | 属于测试 / 验收 / 实施文档 | `05` / `06` / `07` |
| config key、默认值、env var、secret、endpoint、部署挂载 | 属于配置设计 | `04-配置设计.md` |
| 开发排期、人员分工、提交顺序、commit boundary | 属于实施计划 | `07-实施计划.md` |
| 已进入 Step 12 的对象、接口、处理流、状态、异常和配置稳定输入 | 已是详细设计承接清单,不是概要未闭环项 | `03-详细设计.md` |

---

## 12. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §13 引用本文件 §7 的设计风险清单。
- §13 引用本文件 §8 的设计待确认事项清单。
- §13 摘录本文件 §10 的当前设计层未闭环项说明。
- §13 保留“待确认事项不得在正式概要整理时润色成定论”的规则。
- §13 不重复写 Step 12 已承接给 `03-详细设计.md` 的字段、DTO、状态矩阵、port、repository、event payload、job report、transaction boundary 和测试矩阵细节。
- §13 明确:当前风险和待确认不阻塞 Step 14 正式装配,但进入实现前必须由 `03/04/05/06/07` 继续闭口。

---

## 13. 自检

| 检查项 | 结果 |
|---|---|
| 是否先读取 Step 13 SOP、书写规范、Step 04~12、正式 `00/01`、旧 Step 13 和 L1 参考粒度 | pass |
| 是否使用设计风险表和待确认事项表 | pass |
| 是否区分已知风险与尚未定论的待确认事项 | pass |
| 是否写清每项风险或待确认的影响范围 | pass |
| 是否为风险写出当前保守处理口径 | pass |
| 是否为待确认事项写出当前挂起口径 | pass |
| 是否避免把项目任务、待办事项、开发排期或普通优化写成风险 / 待确认 | pass |
| 是否避免把 Step 12 稳定输入重新挂起 | pass |
| 是否单列已由前序 Step 关闭、不再挂起的事项 | pass |
| 是否未复制需求 / 架构风险全文,而是筛选概要层仍相关项 | pass |
| 是否未伪造真实 run id、真实 evidence alias、验收签署、测试结果或 implementation evidence | pass |
| 是否未触碰正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 14 的上游 blocker | no |

---

## 14. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 13、概要书写规范 4.13、Step 04~12、新版 `00`、新版 `01` 和 L1 参考粒度重建 Step 13;旧 Step 13 已降级为 historical material;当前风险与待确认均有保守口径,不阻塞正式概要装配 | wait_user_confirmation_before_step_14 |
