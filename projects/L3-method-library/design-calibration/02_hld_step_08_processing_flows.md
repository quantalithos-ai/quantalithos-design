# L3-method-library 02 概要 Step 8: 关键处理流 / 重要函数数据流

> 创建日期: 2026-06-16
> 状态: in_progress
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-method-library/02-概要设计.md`
> 本轮口径: 从 Step 7 接口骨架、Step 6 关键对象和 Step 5 组成部分重新推导处理流;不恢复旧 `CreateMethodContentDraft` / `PublishMethodContent` / snapshot / outbox / fingerprint / P0-P1 发布同步处理流。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 8 关键处理流 / 重要函数数据流 |
| 输出文件 | `design-calibration/02_hld_step_08_processing_flows.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取前序 Step | yes:`design-calibration/02_hld_step_05_components_boundary.md`;`design-calibration/02_hld_step_06_key_objects.md`;`design-calibration/02_hld_step_07_api_interface_skeleton.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 8;`概要设计书写规范.md` 4.8 |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md` |
| 旧材料处理 | 旧 `02_hld_step_08_processing_flows.md` 已判定为 historical material 并重写;历史 `03_ddd_*` 只作后置差异审计 |
| 进入条件 | pass |
| next_allowed_action | 进入“接口到处理流候选池:先思考”,不得直接写完整处理流全集。 |

---

## 1. 必读文档

| 文档 | 读取重点 | 对 Step 8 的约束 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 8 | 通用处理流、关键接口处理流、P0 Command / Inbound / Job 独立处理流、Query 取舍和跨处理流审计。 | 必须从 Step 7 接口出发,按主要组成部分标注处理流归属;每个独立处理流使用 ASCII 图并写关键设计点。 |
| `standards/document/概要设计书写规范.md` 4.8 | 处理流 ASCII 图格式、函数调用参数格式、关键设计点格式、未展开处理流说明。 | 图中如点名函数调用,参数必须写成 `TypeName param_name`;不写完整 Rust 签名、SQL、错误码全集或 retry 参数。 |
| `standards/document/设计文档讨论中间产物规范.md` | Step 级先搭框架、模块级先思考后写入、长文档分批和旧材料后置审计。 | Step 8 必须先搭整体模块,再按接口族 / 组成部分小循环先思考、后写入。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 防止处理流缺对象、缺接口、缺状态 / port / schema 闭口后把实现端推入私补。 | 处理流只能使用 Step 5/6/7 已收稳主语;发现缺口时回退上游 Step,不得在处理流里发明对象或接口。 |
| `projects/L3-method-library/00-需求文档.md` | 核心能力、业务规则、接口依赖、数据所有权和验收方向。 | 处理流必须服务定义、目录、正式化、消费、追溯、一致性、外部摘要、维护和外围增强,不得迁入下游 truth。 |
| `projects/L3-method-library/01-架构设计.md` | 限界上下文、数据所有权、一致性、交互通信、后台维护和外围隔离。 | 处理流必须保持编译期 / 运行期 / 事件协作边界;外部正文、交易履约和下游运行状态不得入仓。 |
| `design-calibration/02_hld_step_05_components_boundary.md` | 8 个组成部分、接缝、Step 8 承接规则和禁止事项。 | 处理流按定义、正式化、消费、追溯、关系分发、外部摘要、维护、外围组织分组,不得按 repository / worker / 旧模块分组。 |
| `design-calibration/02_hld_step_06_key_objects.md` | 关键对象、typed ref、summary、material、policy、task、view 和旧材料污染审计。 | 处理流中点名的对象必须已在 Step 6 出现;不得把旧 `MethodContent`、snapshot、outbox、fingerprint 写回流程。 |
| `design-calibration/02_hld_step_07_api_interface_skeleton.md` | 当前正式接口骨架、接口分类、输入 / 输出骨架、跨接口审计和 Step 8 承接提示。 | Step 8 必须从当前接口族出发筛选独立处理流;未展开接口必须说明原因。 |

---

## 2. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块搭建。 |
| 整体模块搭建 | done | Step 8 文件框架、模块顺序、候选处理流接收表 | pass | 进入“接口到处理流候选池:先思考”。 |
| 接口到处理流候选池:先思考 | done | P0 Command / Query / Inbound / Outbound / Job 展开判断 | pass | 进入“接口到处理流候选池:再写入”。 |
| 接口到处理流候选池:再写入 | done | 处理流覆盖清单与独立处理流取舍 | pass | 进入“通用处理流骨架:先思考”。 |
| 通用处理流骨架:先思考 | done | 写路径 / 读路径 / inbound / job 通用图判断 | pass | 进入“通用处理流骨架:再写入”。 |
| 通用处理流骨架:再写入 | done | 通用处理流骨架和适用规则 | pass | 进入“方法资产定义与目录处理流:先思考”。 |
| 方法资产定义与目录处理流:先思考 | done | 本组成部分关键处理流判断 | pass | 进入“方法资产定义与目录处理流:再写入”。 |
| 方法资产定义与目录处理流:再写入 | done | definition / catalog 处理流和停审 | pass | 进入“正式化与版本处理流:先思考”。 |
| 正式化与版本处理流:先思考 | done | 本组成部分关键处理流判断 | pass | 进入“正式化与版本处理流:再写入”。 |
| 正式化与版本处理流:再写入 | done | formalization / version 处理流和停审 | pass | 进入“受控消费处理流:先思考”。 |
| 受控消费处理流:先思考 | done | 本组成部分关键处理流判断 | pass | 进入“受控消费处理流:再写入”。 |
| 受控消费处理流:再写入 | done | consumption / boundary 处理流和停审 | pass | 进入“追溯与一致性保护处理流:先思考”。 |
| 追溯与一致性保护处理流:先思考 | done | 本组成部分关键处理流判断 | pass | 进入“追溯与一致性保护处理流:再写入”。 |
| 追溯与一致性保护处理流:再写入 | done | trace / impact / protection / audit 处理流和停审 | pass | 进入“关系与分发语义处理流:先思考”。 |
| 关系与分发语义处理流:先思考 | done | 本组成部分关键处理流判断 | pass | 进入“关系与分发语义处理流:再写入”。 |
| 关系与分发语义处理流:再写入 | done | relation / distribution 处理流和停审 | pass | 进入“外部摘要与引用处理流:先思考”。 |
| 外部摘要与引用处理流:先思考 | done | 本组成部分关键处理流判断 | pass | 进入“外部摘要与引用处理流:再写入”。 |
| 外部摘要与引用处理流:再写入 | done | external summary / ref 处理流和停审 | pass | 进入“后台维护与收敛处理流:先思考”。 |
| 后台维护与收敛处理流:先思考 | done | Operations Job 处理流判断 | pass | 进入“后台维护与收敛处理流:再写入”。 |
| 后台维护与收敛处理流:再写入 | done | refresh / recovery job 处理流和停审 | pass | 进入“外围包与方法集组织处理流:先思考”。 |
| 外围包与方法集组织处理流:先思考 | done | 外围增强处理流判断 | pass | 进入“外围包与方法集组织处理流:再写入”。 |
| 外围包与方法集组织处理流:再写入 | done | package / method set 处理流和停审 | pass | 进入“跨处理流一致性审计”。 |
| 跨处理流一致性审计 | done | 接口覆盖、对象引用、接缝、事务粒度和未展开理由审计 | pass | 进入“旧材料差异审计”。 |
| 旧材料差异审计 | done | 旧 Step 8 / 历史 DDD 处理流污染检查 | pass | 进入“自检与停审”。 |
| 自检与停审 | done | Step 8 完成门禁和 flow / 台账更新依据 | pass | Step 8 完成;允许进入 Step 9。 |

---

## 3. 整体模块骨架

| 模块组 | 本 Step 要做 | 本 Step 不做 |
|---|---|---|
| 处理流候选筛选 | 从 Step 7 接口中判断哪些必须画独立处理流,哪些可以走通用读路径或通用事件 / job 路径。 | 不根据旧 Step 8 或历史 DDD 恢复处理流名称。 |
| 通用处理流 | 建立写路径、读路径、inbound consumer、operations job 的通用 ASCII 骨架和适用规则。 | 不写完整调用链脚本、错误码全集、retry 参数、SQL、DDL 或完整事务伪代码。 |
| 独立处理流 | 为关键 Command、会改写本地状态的 Inbound、影响一致性的 Job、含边界的 Query 画独立 ASCII 图。 | 不为所有简单 Query 机械画图;未展开接口必须说明原因。 |
| 逐组成部分小循环 | 按 Step 5 的 8 个组成部分依次完成处理流判断和停审。 | 不一次性生成全仓处理流全集后再补归属。 |
| 对象 / 接口承接 | 每个处理流必须回指 Step 6 对象和 Step 7 接口。 | 不在处理流里发明新对象、新接口、新状态或新 schema。 |
| 接缝与边界 | 点名跨部分接缝、事务内外大体边界、事件候选产生来源和 job 不改 truth 的边界。 | 不写 port trait、repository 签名、adapter、DB 表、topic、payload、worker loop 或 outbox relay 机制。 |
| 后置差异审计 | 当前处理流形成后再审计旧 `MethodContent` / publish / snapshot / outbox / fingerprint 污染。 | 不让旧材料参与当前处理流筛选和流程图推导。 |

---

## 4. Step 7 接口到处理流候选池接收

| 接口族 | Step 7 接口方向 | Step 8 初始处理流候选方向 |
|---|---|---|
| 方法资产定义与目录 Command | 建立 / 调整 definition;登记 / 重分类 catalog entry。 | P0 Command 独立处理流候选;必须保持 definition truth 与 catalog truth 分开。 |
| 方法资产定义与目录 Query | definition summary;definition ref resolution;catalog list / entry view。 | 简单读路径候选;`ResolveMethodAssetDefinitionRef` 需判断是否有 typed ref resolution 边界。 |
| 正式化与版本 Command | 评估正式化;建立正式版本;记录版本语义变化;退出正式版本。 | P0 Command 独立处理流候选;必须避免 query / 使用行为隐式正式化。 |
| 正式化与版本 Inbound | basis summary accepted。 | 会形成本地依据承接线索时需独立 inbound 处理流候选。 |
| 受控消费 Command / Query | 准备消费材料;记录边界阻断;消费材料 / availability / boundary 读取。 | 消费材料准备和阻断记录为独立处理流候选;读取按边界复杂度筛选。 |
| 追溯与一致性保护 Command / Inbound | 准备 trace;接收 impact;评估 protection;记录 audit;impact / evidence inbound。 | trace / impact / protection / audit 写路径和 inbound 均为独立处理流候选。 |
| 关系与分发语义 Command / Query | propose / activate relation;establish / retire distribution;relation / distribution read。 | relation / distribution 改写为独立处理流候选;读取按通用读路径优先。 |
| 外部摘要与引用 Command / Inbound | 接收 external summary;登记 source / archive ref;拒绝正文;safe summary / archive marker inbound。 | external summary / ref 写入和 inbound 均为独立处理流候选;必须守住 body-free。 |
| 后台维护与收敛 Job / Query | read refresh;trace refresh;recovery;maintenance progress read。 | 三个 Operations Job 必须画独立处理流;progress Query 走通用读路径或轻量独立说明。 |
| 外围包与方法集组织 Command / Query | create / adjust package;create / adjust method set;peripheral discovery read。 | 外围 Command 独立处理流候选;读取按通用读路径优先,并标注非核心前置。 |
| Outbound Event 候选 | changed / accepted / stale / refreshed / unavailable 等事实候选。 | Step 8 需判断是否画统一 outbound event production 说明;不写可靠投递机制。 |

---

## 5. 模块执行记录

### 5.1 接口到处理流候选池:先思考

问题回答:

- Step 8 的处理流候选池必须从 Step 7 的正式接口骨架出发,不能从旧 `MethodContent` / publish / snapshot / outbox / fingerprint 处理流恢复。
- Command 处理流优先独立展开。凡是改写 definition、catalog、formal version、consumption material、trace / impact / protection、relation、external summary、package / set 的接口,都需要进入覆盖清单;是否共用结构图必须在对应组成部分停审中说明。
- Query 处理流先区分简单读取和边界读取。简单读取 projection / material / summary 的 Query 可以走通用读路径;涉及 typed ref resolution、availability / unavailable、boundary / integrity、protection status、peripheral discovery 的 Query 需要在候选池中标为“可能独立展开”。
- Inbound Event Consumer 只要会形成本地 summary/ref/material/audit linkage,就必须候选独立处理流;输入必须保持 body-free,并保留 event envelope / event id / 幂等判断。
- Operations Job 三个入口都影响读取一致性或恢复收敛,必须画独立处理流。Job 不允许改 core truth,只刷新材料、推进 progress 或输出 body-free issue refs。
- Outbound Event 候选不在本轮直接展开可靠投递机制。Step 8 只需说明事件由哪些 command/job 结果产生,以及它们如何保持 fact-ref / summary-ref 级别;是否 outbox、topic、relay 留后续重新闭口。

诊断:

- 当前 Step 7 接口数量较多。如果所有 Query 都画独立图,Step 8 会变成重复读路径堆砌;如果只画 Command,又会漏掉 ref resolution、availability、protection、maintenance progress 等边界读路径。
- 当前核心业务链路的关键流应优先覆盖:定义 / 目录 -> 正式化 / 版本 -> 受控消费 -> 追溯 / 影响 / 保护。支撑与外围流需要在各自小循环中说明是否独立展开,不能被核心链路挤掉。
- Inbound 候选虽然数量不多,但风险高:外部 safe summary、artifact marker、impact summary、evidence marker 只要落到本仓 summary/ref,就涉及幂等和正文禁止边界。
- Operations Job 的三个入口是 Step 8 必画对象,否则 Step 9 的 maintenance state 和 Step 10 的恢复 / 不可用场景会缺少触发来源。

取舍:

- 覆盖清单采用四类结果:`独立处理流`、`通用写路径变体`、`通用读路径`、`统一事件产生说明`。其中 `通用写路径变体` 仍必须在组成部分小节写清接口名和差异点,不得静默省略。
- 核心 Command 原则上进入独立处理流。结构相同且只差对象名的外围调整类 Command,可在对应组成部分中使用同构图,但必须列明每个接口已覆盖。
- Query 默认走通用读路径;涉及 resolution、availability、integrity、protection、discovery 或 unavailable / stale 分支的 Query 进入“可能独立”候选,由对应组成部分最终裁决。
- Inbound Event Consumer 候选全部进入独立处理流,因为它们会在本仓形成安全摘要、影响摘要、证据 marker linkage 或 artifact ref。
- Outbound Event 先按统一事件产生说明处理,不进入 per-event relay flow。

复杂度 / 越界检查:

- 本模块只做处理流候选筛选,未画具体 ASCII 流程图。
- 未写完整函数调用链、repository / port 签名、SQL、错误码全集、retry 参数、topic、payload schema、outbox relay 或 worker loop。
- 未让旧 `MethodContent`、旧 publish、snapshot、fingerprint、outbox 或旧 P1 plugin / configuration 进入候选池。
- 下一模块只允许写候选池覆盖清单,不得直接进入具体处理流图。

### 5.2 接口到处理流候选池:再写入

#### 5.2.1 独立处理流候选总表

| 接口族 | 必须独立展开 | 可能独立 / 通用变体 | 默认不独立展开 | 说明 |
|---|---|---|---|---|
| 方法资产定义与目录 | `EstablishMethodAssetDefinition`;`AdjustMethodAssetDefinition`;`RegisterMethodAssetCatalogEntry`;`ReclassifyMethodAssetCatalogEntry` | `ResolveMethodAssetDefinitionRef` | `GetMethodAssetDefinitionSummary`;`ListMethodAssetCatalog`;`GetMethodAssetCatalogEntryView` | 写 definition / catalog truth 必须独立;普通 catalog read 可走通用读路径。 |
| 正式化与版本 | `EvaluateMethodAssetFormalization`;`EstablishFormalMethodAssetVersion`;`RecordFormalVersionSemanticChange`;`RetireFormalMethodAssetVersion`;`ConsumeFormalizationBasisSummaryAccepted` | `GetFormalizationState`;`ListConsumableFormalVersions` | `GetFormalMethodAssetVersion`;`GetFormalizationBasisSummary` | 正式化和版本变化必须独立;状态 / 可消费列表若含 unavailable 或 boundary 分支需独立。 |
| 受控消费 | `PrepareMethodAssetConsumptionMaterial`;`RecordConsumptionBoundaryBlock` | `ResolveConsumptionMaterialForVersion`;`GetMethodAssetAvailability`;`GetDownstreamConsumptionBoundary` | `GetMethodAssetConsumptionMaterial` | material 准备和阻断记录必须独立;availability / boundary 读取可能需要独立说明。 |
| 追溯与一致性保护 | `PrepareMethodAssetTraceMaterial`;`AcceptConsumptionImpactSummary`;`EvaluateConsistencyProtection`;`RecordMethodAssetAuditTrailEntry`;`ConsumeDownstreamConsumptionImpactSummary`;`ConsumeEvidenceMarkerAvailable` | `GetConsistencyProtectionStatus`;`ListConsumptionImpactSummaries` | `GetMethodAssetTraceMaterial`;`GetMethodAssetAuditTrail` | trace / impact / protection / audit 写路径和 inbound 全部独立;保护状态读取可能独立。 |
| 关系与分发语义 | `ProposeMethodAssetRelation`;`ActivateMethodAssetRelation`;`EstablishMethodAssetDistributionRef`;`LimitOrRetireMethodAssetDistributionRef` | `CheckRelationIntegrity` | `GetMethodAssetRelation`;`ListMethodAssetRelations`;`GetMethodAssetDistributionRef` | relation / distribution 写路径独立;完整性读取按是否有边界分支裁决。 |
| 外部摘要与引用 | `AcceptExternalSourceSummary`;`RegisterExternalSourceRef`;`RegisterArtifactArchiveRef`;`RejectExternalBodyMaterial`;`ConsumeExternalSafeSummaryAvailable`;`ConsumeArtifactArchiveMarkerAvailable` | `ResolveExternalSourceRef`;`ListExternalBasisAcceptanceStates` | `GetExternalSourceSummary`;`GetArtifactArchiveRef` | 外部 summary/ref 写入和 inbound 必须独立,严格 body-free。 |
| 后台维护与收敛 | `RefreshMethodAssetReadMaterials`;`RefreshMethodAssetTraceMaterials`;`RunMethodAssetConsistencyRecovery` | `GetMaintenanceProgress`;`ListPendingMaintenanceIssues` | `GetMaintenanceTaskSummary` | 三个 Job 必画;progress / issue 读取可能需轻量独立说明。 |
| 外围包与方法集组织 | `CreateMethodPackage`;`AdjustMethodPackage`;`CreateMethodSetAssembly`;`AdjustMethodSetAssembly` | `DiscoverPeripheralMethodAssets` | `GetMethodPackage`;`ListMethodPackages`;`GetMethodSetAssembly` | 外围 Command 独立但必须标注非核心前置;外围 discovery 若含 marketplace 边界需独立说明。 |
| Outbound Event 候选 | not_applicable | 统一事件产生说明 | per-event relay flow | 本 Step 不写 reliable delivery / outbox / topic / payload schema。 |

#### 5.2.2 通用路径使用规则

| 通用路径 | 可覆盖接口 | 不可覆盖接口 |
|---|---|---|
| 通用 Command 写路径 | 同一组成部分内结构完全相同、只差对象主语的调整类 Command,且不会改变不同状态族。 | 正式化、版本变化、消费材料准备、impact 接收、protection 判断、external summary 接收、recovery job。 |
| 通用 Query 读路径 | 简单按 typed ref / scope 读取 view、summary、material、progress。 | resolution、availability、boundary、integrity、protection、discovery、fallback、unavailable / stale 分支明显的 Query。 |
| 通用 Inbound Consumer 路径 | body-free summary / marker / ref 到达后,执行 envelope / idempotency / boundary check / local material linkage。 | 接收正文、payload、外部生命周期或下游运行 truth 的事件;这些不得进入本仓。 |
| 通用 Outbound Event 产生说明 | Command / Job accepted 后形成 fact-ref / summary-ref 级事件候选。 | outbox relay、topic、payload schema、投递重试、发布 checkpoint。 |
| 通用 Operations Job 路径 | task ref + run ref + scope ref 进入 maintenance service,刷新材料或收敛 progress。 | job 修改 definition、formal version、consumption boundary、relation 或 external summary truth。 |

停审记录:

- 接口是否都有处理流口径: pass。Step 7 接口已落到独立、可能独立、通用路径或统一事件说明。
- 关键 Command 是否覆盖: pass。核心 Command 和外围 Command 均进入独立 / 同构独立候选。
- Inbound / Job 是否覆盖: pass。Inbound 候选和三个 Operations Job 均进入独立处理流候选。
- Query 取舍是否清楚: pass。简单读路径与边界读路径已区分。
- 是否越界: pass。未写具体处理流图、port、repository、topic、payload、outbox、worker 或旧处理流。
- 下一步: 进入“通用处理流骨架:先思考”。

### 5.3 通用处理流骨架:先思考

问题回答:

- 通用骨架要解决的是“同类接口穿过入口、服务、对象和结果的大体路线”,不是替代后续每个 P0 Command / Inbound / Job 的独立处理流。
- 当前至少需要五类通用骨架:Command 写路径、Query 读路径、Inbound Event Consumer 路径、Operations Job 路径和 Outbound Event 候选产生路径。
- Command 写路径必须从接口输入进入 application service,再到 Step 6 已定义的 truth / policy / guard / material 对象,最后形成 accepted / rejected result、event candidate 或 refresh hint。它不能在图中下沉到 repository 签名、SQL、锁、retry 或完整事务伪代码。
- Query 读路径必须保持只读。它可以读取 projection / material / view / summary / ref,并在概要层点名 boundary / visibility / unavailable 判断,但不能在 query 中刷新材料、修复 truth 或创建 missing object。
- Inbound Event Consumer 通用骨架只承接 body-free summary / marker / ref。它必须先处理 envelope、event id 和幂等,再把安全摘要或引用落到本仓对象;不得把外部正文、artifact 正文或下游运行 truth 当作 payload。
- Operations Job 通用骨架必须从 task / scope / run ref 出发,基于已持久化事实刷新材料或收敛 progress。Job 不创建 definition / formal version / relation / external summary truth,也不绕过正式化和受控消费边界。
- Outbound Event 候选产生路径只说明哪些 accepted result 或 job convergence 会形成 fact-ref / summary-ref 级事件候选,不定义 outbox、topic、payload schema、relay、checkpoint 或投递可靠性。

诊断:

- 如果没有通用骨架,后续 8 个组成部分会重复写“入口 -> service -> object -> result”,并且容易在某个小节偷偷写出 repository / worker / outbox 实现。
- 如果通用骨架写得太具体,又会越过概要层,把详细设计的 port、transaction、idempotency store、event store 和 adapter 方案提前锁死。
- 当前风险最高的是 Query 和 Job。Query 很容易变成“读取时顺手修复 projection”;Job 很容易变成“后台自动修 core truth”。这两类必须在通用骨架里先画清禁止边界。
- Outbound Event 必须和旧 outbox 解耦。当前只能保留业务事实候选,不能恢复旧 Step 8 的 reliable relay 处理流。

取舍:

- 通用骨架使用 5 张 ASCII 处理流图。它们是后续独立处理流的模板,不是接口覆盖终点。
- Command 和外围 Command 后续仍要画独立或同构独立处理流;通用 Command 只提供读写边界和结果形态。
- 简单 Query 后续可只引用通用读路径;含 resolution、availability、boundary、integrity、protection、discovery、fallback 或 stale / unavailable 的 Query 仍要在组成部分中裁决是否独立展开。
- Inbound Event Consumer 和 Operations Job 后续必须独立画图。通用骨架只规定 envelope / idempotency / body-free / no truth repair 等共同纪律。
- Outbound Event 候选后续使用统一说明,不按每个 event 画 relay flow。

复杂度 / 越界检查:

- 本模块只固定通用路径和适用规则,未进入任何具体组成部分处理流。
- 图中只出现概要层主语:入口、application service、domain object / material / view、repository boundary、event candidate、result。
- 未写完整函数调用链、Rust 签名、SQL、DDL、错误码全集、retry 参数、topic、payload schema、worker loop 或旧 outbox。
- 下一模块只允许把这些通用骨架写入 Step 8,不得跳到方法资产定义与目录之外的具体处理流。

### 5.4 通用处理流骨架:再写入

#### 处理流图: 通用 Command 写路径

```text
<Command API>
  - 接收 ActorContext / CommandMetadata / IdempotencyKey / typed request summary
  │
  ▼
<Application Service>
  - 校验接口所属组成部分和 typed ref 边界
  - 装载必要 truth / policy / guard / material summary
  - 编排领域对象形成 accepted 或 rejected 结果
  │
  ▼
<Domain Object / Policy / Guard>
  - 改写本仓拥有的 truth、边界材料或外围组织语义
  - 产生 body-free summary / ref / event candidate / refresh hint
  │
  ▼
<Repository Boundary>
  - 保存当前组成部分拥有的 truth 或 material
  - 保留幂等 replay 所需的结果摘要
  │
  ▼
<Command Result / Event Candidate / Refresh Hint>
```

关键说明:

- 图表达 Command 写路径的共同结构:入口只携带 typed request summary,写入只落到本仓拥有的 truth、边界材料或外围组织语义。
- 图没有表达 repository trait、事务隔离级别、幂等表 schema、错误码、retry 或可靠投递机制。
- 最容易误解的边界是 guard / policy:它们可以参与 Command 判断,但不能成为绕过正式化、版本和受控消费的外部写入口。

#### 处理流图: 通用 Query 读路径

```text
<Query API>
  - 接收 reader context / scope ref / subject ref / typed lookup ref
  │
  ▼
<Query Application Service>
  - 判断读取语境和组成部分边界
  - 选择 projection / material / view / summary / ref 读取来源
  │
  ▼
<Read Material / Projection / View>
  - 返回已持久化或已派生的只读材料
  - 标注 stale / unavailable / boundary result 的概要语义
  │
  ▼
<Query Result>
  - 返回 view / summary / material / availability / progress
```

关键说明:

- 图表达 Query 只能读取已有 projection、material、view、summary 或 ref,不能创建、刷新或修复 truth。
- 图没有表达权限矩阵、分页 schema、缓存策略、projection rebuild 细节或 fallback 算法。
- 最容易误解的边界是 unavailable / stale:Query 可以报告这些状态,但刷新和恢复必须交给 Operations Job 或后续正式处理流。

#### 处理流图: 通用 Inbound Event Consumer 路径

```text
<Inbound Event Envelope>
  - 携带 event id / source ref / idempotency key / body-free marker
  │
  ▼
<Inbound Consumer>
  - 校验事件来源和幂等状态
  - 拒绝 raw body、artifact body、governance body 或 downstream runtime state
  │
  ▼
<Application Service>
  - 将 safe summary / marker / typed ref 归入本仓组成部分
  - 选择 accepted / ignored / rejected consumer result
  │
  ▼
<Summary / Ref / Material Linkage>
  - 保存 body-free summary、impact hint、evidence marker 或 archive ref linkage
  │
  ▼
<Consumer Result / Event Candidate / Maintenance Hint>
```

关键说明:

- 图表达 Inbound 只承接外部已经形成的安全摘要、marker 或 typed ref,并先处理 envelope 与幂等。
- 图没有表达 topic、payload 字段全集、消费重试、dead-letter、checkpoint 或外部系统 adapter。
- 最容易误解的边界是“事件到达不等于正文入仓”:正文类 payload 必须被拒绝或留在外部系统。

#### 处理流图: 通用 Operations Job 路径

```text
<Operations Job Request>
  - 携带 MaintenanceRunRef / task ref / scope ref / subject ref
  │
  ▼
<Maintenance Application Service>
  - 读取已持久化 truth、summary、material state 和 pending issue
  - 判断刷新读取材料、刷新追溯材料或一致性恢复路径
  │
  ▼
<Maintenance Task / Recovery Task>
  - 刷新派生材料或收敛 progress
  - 生成 body-free issue ref、unavailable summary 或 recovery summary
  │
  ▼
<Repository Boundary>
  - 保存 refreshed material / progress view / recovery result
  - 不修改 core business truth
  │
  ▼
<Job Report / Refreshed Material / Progress View>
```

关键说明:

- 图表达 Operations Job 只能基于已持久化事实刷新材料或收敛进度,不能创建或修复核心业务 truth。
- 图没有表达 worker loop、调度、锁、重试、队列、日志、report JSON schema 或运维脚本。
- 最容易误解的边界是 recovery:恢复可以产生 issue / summary / progress,但不能越过正式化、版本、消费边界或关系完整性直接改 truth。

#### 处理流图: 通用 Outbound Event 候选产生路径

```text
<Accepted Command / Accepted Inbound / Converged Job>
  - 形成 fact ref / summary ref / material ref / unavailable marker
  │
  ▼
<Application Service Event Candidate Collection>
  - 选择是否需要通知下游消费方或外围生态
  - 保持事件内容为 body-free ref / summary / marker
  │
  ▼
<Outbound Event Candidate>
  - 表达 changed / accepted / stale / refreshed / unavailable 等事实候选
  │
  ▼
<Downstream Handoff Boundary>
  - 交给后续详细设计裁决 reliable delivery / topic / payload
```

关键说明:

- 图表达 outbound event 只来自 accepted 写入、accepted inbound 或 job 收敛结果,且只能携带 ref / summary / marker 级事实。
- 图没有表达 outbox 表、relay、topic、payload schema、投递顺序、checkpoint 或 retry。
- 最容易误解的边界是事件候选不等于发布实现;当前 Step 8 只收业务产生来源。

#### 5.4.1 通用骨架适用规则

| 通用骨架 | 可直接引用的接口 | 仍需独立展开的接口 | 禁止事项 |
|---|---|---|---|
| Command 写路径 | 同一组成部分内结构同构、只差对象主语的调整类 Command。 | 全部 P0 Command;正式化 / 版本 / 消费材料 / impact / protection / external summary / package set 等关键写路径。 | 不把 guard 暴露成独立外部写 API;不在写路径保存外部正文。 |
| Query 读路径 | 简单读取 definition summary、catalog view、formal version、trace material、relation view、external summary、package view、maintenance progress。 | 含 resolution、availability、boundary、integrity、protection、discovery、fallback、stale / unavailable 分支的 Query。 | 不在 Query 中 repair truth、刷新 material、补写 summary 或触发正式化。 |
| Inbound Consumer 路径 | basis summary、impact summary、evidence marker、external safe summary、artifact marker 等 body-free 事件。 | 所有会改写本地 summary / ref / material linkage 的 Inbound Consumer。 | 不接收 raw body、artifact 正文、治理执行正文、下游运行状态或 marketplace 履约正文。 |
| Operations Job 路径 | read material refresh、trace material refresh、consistency recovery 的共同 envelope / run / progress 规则。 | `RefreshMethodAssetReadMaterials`;`RefreshMethodAssetTraceMaterials`;`RunMethodAssetConsistencyRecovery`。 | 不创建或修复 core truth;不写 worker / queue / retry / report schema。 |
| Outbound Event 候选路径 | changed / accepted / stale / refreshed / unavailable 事实候选的统一产生说明。 | 不按每个 event 画 relay flow;只在组成部分中点名业务产生来源。 | 不恢复旧 outbox / topic / payload / relay / checkpoint 机制。 |

停审记录:

- 通用骨架是否覆盖主要接口类别: pass。Command、Query、Inbound、Operations Job 和 Outbound Event 候选均已给出共同路径。
- 是否替代后续独立处理流: no。P0 Command、会改写本地状态的 Inbound 和影响一致性的 Operations Job 后续仍需独立展开。
- 是否使用 Step 6 / Step 7 已定义主语: pass。图中只使用已有对象类别、接口类别和维护 task / view / summary / ref 线索。
- 是否越界: pass。未写 port trait、repository 签名、SQL、DDL、topic、payload、worker、retry、outbox relay 或完整事务伪代码。
- 下一步: 进入“方法资产定义与目录处理流:先思考”。

### 5.5 方法资产定义与目录处理流:先思考

问题回答:

- 本组成部分的处理流要分开 definition truth、catalog truth 和 catalog read material。`MethodAssetDefinition` 是定义 truth;`MethodAssetCatalogEntry` 是目录语义 truth;`MethodAssetCatalogView` 只能作为派生读取材料。
- `EstablishMethodAssetDefinition`、`AdjustMethodAssetDefinition`、`RegisterMethodAssetCatalogEntry`、`ReclassifyMethodAssetCatalogEntry` 都是 P0 Command,必须独立覆盖。建立 / 调整 definition 与登记 / 重分类 catalog 的对象 owner 不同,不能压成一个“保存目录内容”流。
- `ResolveMethodAssetDefinitionRef` 虽然是 Query,但它承担 typed ref resolution 边界,需要独立处理流说明不能从 route param、文件路径、旧 P0 类型名、marketplace id 或自由字符串拼接 ref。
- `GetMethodAssetDefinitionSummary`、`ListMethodAssetCatalog`、`GetMethodAssetCatalogEntryView` 只读取已存在 summary / view,默认引用通用 Query 读路径,但必须标注不在读取时修复 catalog view 或补写目录项。
- 本组成部分没有 Inbound Event Consumer 和 Operations Job。外部依据到达走“外部摘要与引用”;读取材料刷新走“后台维护与收敛”。
- Outbound Event 在本组成部分只作为统一事件候选产生:definition changed 和 catalog changed。是否 outbox、topic、payload 或 relay 留后续详细设计。

诊断:

- 若把 definition establish 和 catalog register 合并,实现端容易把 catalog context 写成 definition 字段或把 catalog view 当成 truth。
- 若把 definition adjust 直接触发正式版本变化,就会越过 `正式化与版本` 的状态判断,破坏“定义存在不等于可正式消费”的边界。
- 若 resolution Query 没有独立说明,后续正式化、消费、关系、追溯都会倾向用字符串或外部 id 代替 `MethodAssetDefinitionRef`。
- 若普通 catalog Query 被写成“查不到就创建 / 刷新”,读取路径会反写 truth,也会让后台维护与收敛失去明确职责。

取舍:

- 本模块输出 5 张独立处理流图:4 个 P0 Command 和 1 个 typed ref resolution Query。
- 普通读取接口不画独立图,通过覆盖表回指通用 Query 读路径,并写清未展开理由。
- Catalog register / reclassify 可以共享同一类对象 owner,但仍分两张图,因为前者建立目录项,后者调整适用语境。
- 事件候选不画 per-event relay flow,只在停审表说明产生来源。

复杂度 / 越界检查:

- 本模块只使用 Step 6 / Step 7 已有主语,未新增对象、接口、状态或 schema。
- 未写 repository trait、事务隔离、数据库表、索引、完整 DTO、HTTP/RPC 路由、错误码全集或 outbox 机制。
- 未恢复旧 `MethodContent`、旧 content lifecycle、旧 publish、snapshot、fingerprint 或 P1 plugin/configuration。
- 下一模块只允许写本组成部分处理流图、覆盖表和停审记录。

### 5.6 方法资产定义与目录处理流:再写入

#### 5.6.1 处理流覆盖表

| 接口 | 处理流口径 | 使用对象 | 未展开 / 独立理由 |
|---|---|---|---|
| `EstablishMethodAssetDefinition` | 独立处理流 | `MethodAssetDefinition`;`MethodAssetDefinitionRef`;`MethodAssetCatalogEntry` optional linkage hint | P0 Command,建立 definition truth。 |
| `AdjustMethodAssetDefinition` | 独立处理流 | `MethodAssetDefinition`;`MethodAssetDefinitionRef`;`DefinitionAdjustmentSummary` | P0 Command,调整 definition truth,但不裁决正式版本。 |
| `RegisterMethodAssetCatalogEntry` | 独立处理流 | `MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`CatalogScopeRef` | P0 Command,建立 catalog truth。 |
| `ReclassifyMethodAssetCatalogEntry` | 独立处理流 | `MethodAssetCatalogEntry`;`CatalogScopeRef`;`MethodAssetCatalogView` refresh hint | P0 Command,调整目录适用语境。 |
| `ResolveMethodAssetDefinitionRef` | 独立处理流 | `MethodAssetDefinitionRef`;`MethodAssetDefinition`;`MethodAssetCatalogEntry` | Query 但承担 typed ref resolution 边界。 |
| `GetMethodAssetDefinitionSummary` | 通用 Query 读路径 | `MethodAssetDefinition`;definition summary | 简单读取,不得修复 truth。 |
| `ListMethodAssetCatalog` | 通用 Query 读路径 | `MethodAssetCatalogView`;`CatalogScopeRef` | 简单读取派生 view,不得登记目录项或刷新 view。 |
| `GetMethodAssetCatalogEntryView` | 通用 Query 读路径 | `MethodAssetCatalogView`;`MethodAssetCatalogEntry` | 简单读取单项 view,不得把 view 写回 truth。 |

#### EstablishMethodAssetDefinition 处理流

```text
<EstablishMethodAssetDefinition Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodAssetDefinitionSummary
  │
  ▼
<MethodAssetDefinitionService>
  - 校验定义语义已被本仓接受且不含外部正文
  - 形成 MethodAssetIdentityKey 与 definition 建立语境
  - 调用 MethodAssetDefinition.from_accepted_definition(MethodAssetIdentityKey identity_key, MethodAssetDefinitionSummary definition_summary)
  │
  ▼
<MethodAssetDefinition>
  - 建立 MethodAssetDefinitionRef
  - 固定 definition identity invariant 和 body-free definition summary
  - 可产生 catalog registration hint,但不把目录 view 写成 truth
  │
  ▼
<Repository Boundary>
  - 保存 definition truth 和幂等 replay 所需 accepted summary
  - 记录 read material refresh hint
  │
  ▼
<Definition Accepted Result / MethodAssetDefinitionChanged Candidate>
```

关键说明:

- 该流只建立本仓拥有的 definition truth,不表示正式化通过或可被正式消费。
- 可选目录语境只能形成后续 catalog registration 线索,不能把 `MethodAssetCatalogView` 当作写入对象。
- 详细设计继续展开 identity key 来源、幂等 replay、事务边界和 repository port。

#### AdjustMethodAssetDefinition 处理流

```text
<AdjustMethodAssetDefinition Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodAssetDefinitionRef / DefinitionAdjustmentSummary
  │
  ▼
<MethodAssetDefinitionService>
  - 按 MethodAssetDefinitionRef 装载 definition truth
  - 校验调整不携带外部正文、artifact 正文或下游运行状态
  - 调用 MethodAssetDefinition.from_definition_adjustment(MethodAssetDefinitionRef definition_ref, DefinitionAdjustmentSummary adjustment_summary)
  │
  ▼
<MethodAssetDefinition>
  - 记录 definition adjustment summary
  - 保持 MethodAssetDefinitionRef 稳定
  - 产生 formalization re-evaluation hint 和 trace hint
  │
  ▼
<Repository Boundary>
  - 保存 definition truth adjustment
  - 保存幂等 replay 所需 change summary
  │
  ▼
<Definition Adjusted Result / MethodAssetDefinitionChanged Candidate>
```

关键说明:

- 该流调整 definition truth,但不会直接建立、替换或退出正式版本。
- 调整结果可以提示正式化重评估和追溯材料刷新,但具体刷新由后续处理流或维护 job 承接。
- 详细设计继续展开 adjustment 分类、冲突检测和 replay surface。

#### RegisterMethodAssetCatalogEntry 处理流

```text
<RegisterMethodAssetCatalogEntry Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodAssetDefinitionRef / CatalogScopeRef
  │
  ▼
<MethodAssetCatalogService>
  - 校验 definition ref 指向本仓 definition truth
  - 校验 CatalogScopeRef 属于允许的目录语境
  - 调用 MethodAssetCatalogEntry.from_definition(MethodAssetDefinitionRef definition_ref, CatalogScopeRef catalog_scope_ref)
  │
  ▼
<MethodAssetCatalogEntry>
  - 建立 MethodAssetCatalogEntryRef
  - 绑定 definition ref 与 catalog scope
  - 产生 catalog view refresh hint
  │
  ▼
<Repository Boundary>
  - 保存 catalog entry truth
  - 保留 definition-catalog linkage summary
  │
  ▼
<Catalog Entry Accepted Result / MethodAssetCatalogChanged Candidate>
```

关键说明:

- 该流建立目录语义 truth,不是刷新目录读取视图。
- `CatalogScopeRef` 只表达目录范围 / 适用语境,不得被 UI 分类、搜索索引或 marketplace listing 替代。
- 详细设计继续展开 scope 校验来源、幂等 replay 和 view refresh 触发面。

#### ReclassifyMethodAssetCatalogEntry 处理流

```text
<ReclassifyMethodAssetCatalogEntry Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodAssetCatalogEntryRef / CatalogScopeRef
  │
  ▼
<MethodAssetCatalogService>
  - 装载 MethodAssetCatalogEntry
  - 校验新 CatalogScopeRef 不改变 definition ownership
  - 调用 MethodAssetCatalogEntry.from_reclassification(MethodAssetCatalogEntryRef catalog_entry_ref, CatalogScopeRef catalog_scope_ref)
  │
  ▼
<MethodAssetCatalogEntry>
  - 调整目录适用语境
  - 保持 source MethodAssetDefinitionRef 稳定
  - 产生 catalog view refresh hint
  │
  ▼
<Repository Boundary>
  - 保存 catalog entry reclassification
  - 保存幂等 replay 所需 catalog change summary
  │
  ▼
<Catalog Entry Reclassified Result / MethodAssetCatalogChanged Candidate>
```

关键说明:

- 该流只调整目录适用语境,不重新定义方法资产,也不触发正式版本变化。
- 目录项的 source definition ref 必须稳定;若需要迁移定义归属,应另行进入 definition / catalog 边界讨论。
- 详细设计继续展开重分类冲突、历史线索和读取材料刷新。

#### ResolveMethodAssetDefinitionRef 处理流

```text
<ResolveMethodAssetDefinitionRef Query>
  - ActorContext / definition identity query / optional CatalogScopeRef
  │
  ▼
<MethodAssetDefinitionQueryService>
  - 读取 definition identity index 与 catalog association
  - 校验候选 ref 来自 MethodAssetDefinition 或 MethodAssetCatalogEntry
  - 拒绝 route param、文件路径、旧 P0 类型名、marketplace id 或自由字符串拼接
  │
  ▼
<MethodAssetDefinitionRef Resolution>
  - 返回唯一 MethodAssetDefinitionRef 与 resolution summary
  - 对 missing / ambiguous / out-of-scope 返回安全读取结果
  │
  ▼
<Query Result>
  - definition ref resolution summary
```

关键说明:

- 该 Query 独立展开是因为它保护 typed ref 来源,不是因为它会写入 truth。
- resolution 只能读取已有 identity / catalog association,不能在查不到时创建 definition 或 catalog entry。
- 详细设计继续展开 missing / ambiguous / out-of-scope 的 public surface 和索引来源。

#### 5.6.2 普通 Query 与事件候选处理

| 项目 | 口径 |
|---|---|
| `GetMethodAssetDefinitionSummary` | 走通用 Query 读路径;读取 definition summary 和状态提示,不得返回外部正文或触发正式化。 |
| `ListMethodAssetCatalog` | 走通用 Query 读路径;读取 `MethodAssetCatalogView` page,projection stale / unavailable 只报告状态,刷新交给维护 job。 |
| `GetMethodAssetCatalogEntryView` | 走通用 Query 读路径;读取单项 catalog view 或 catalog summary,不得把 view 写回 catalog truth。 |
| `MethodAssetDefinitionChanged` | 由 definition establish / adjust accepted 产生候选,只携带 definition ref / summary ref。 |
| `MethodAssetCatalogChanged` | 由 catalog register / reclassify accepted 产生候选,只携带 catalog entry ref / scope ref。 |

停审记录:

- 接口是否都有处理流口径: pass。4 个 Command 独立展开,1 个 resolution Query 独立展开,3 个普通 Query 走通用读路径。
- 对象是否已在 Step 6 定义: pass。处理流只使用 `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`MethodAssetDefinitionRef`、`MethodAssetCatalogView`、`CatalogScopeRef` 和相关 summary / adjustment 主语。
- 跨部分接缝是否清楚: pass。正式化重评估、trace hint、catalog view refresh hint 和 event candidate 均只作为后续接缝,不在本部分落实现。
- 是否越层写完整实现: pass。未写 repository trait、事务隔离、SQL、DTO schema、worker、topic、payload、retry 或 outbox relay。
- 下一步: 进入“正式化与版本处理流:先思考”。

### 5.7 正式化与版本处理流:先思考

问题回答:

- 本组成部分的处理流必须把“正式化判断”和“正式版本建立”拆开。`EvaluateMethodAssetFormalization` 只产出 `FormalizationState` / eligibility decision summary;`EstablishFormalMethodAssetVersion` 才建立 `FormalMethodAssetVersion`。
- `RecordFormalVersionSemanticChange` 与 `RetireFormalMethodAssetVersion` 必须独立展开,因为它们影响既有消费和后续追溯,不能被视为普通 metadata update。
- `ConsumeFormalizationBasisSummaryAccepted` 是会改写本地 basis linkage / state hint 的 Inbound Event Consumer,必须独立处理,并且只能承接 body-free `FormalizationBasisSummaryRef` 和 `ExternalSourceRefSet`。
- `GetFormalMethodAssetVersion`、`GetFormalizationBasisSummary` 是普通读取,默认走通用 Query 读路径;`GetFormalizationState` 和 `ListConsumableFormalVersions` 可能包含状态 / availability 分支,本模块先以通用读路径 + 边界说明覆盖,后续 Step 9 再收状态迁移。
- 事件候选只表达正式版本建立、正式化拒绝、版本替代 / 退出等事实,不恢复旧 publish / outbox / fingerprint 流。

诊断:

- 如果 formalization evaluation 通过后自动建立版本,实现端会把状态判断、版本创建和依据承接绑死,后续 replay、审计和拒绝面都会不清。
- 如果 basis summary inbound 直接调用正式化命令,会把外部摘要到达等同于业务裁决,绕过 ActorContext / CommandMetadata / 显式正式化请求。
- 如果版本语义变化使用旧 fingerprint 或 hash 作为唯一依据,会把旧材料污染带回当前主线。当前只保留 `VersionSemanticsMarker` / `VersionChangeReasonRef` 等概要主语。
- 如果 retired / superseded 直接删除正式版本,既有消费材料和追溯会失去稳定历史锚点。

取舍:

- 输出 5 张独立图:正式化评估、正式版本建立、版本语义变化、正式版本退出、basis summary inbound。
- 普通正式版本 / basis summary 读取不画独立图,因为它们只读取 truth / summary / read material。
- `GetFormalizationState` 和 `ListConsumableFormalVersions` 暂不独立画图,但在覆盖表中标明必须只读状态 / read material,不得隐式创建或激活版本。
- `FormalizationEligibilityRule` 只作为 policy / guard 出现在处理流中,不单独暴露为外部 API。

复杂度 / 越界检查:

- 本模块只使用 `FormalMethodAssetVersion`、`FormalizationBasisSummary`、`FormalizationState`、`FormalizationEligibilityRule` 及前序 definition / catalog ref。
- 未写版本号算法、hash、fingerprint、schema version、完整状态迁移矩阵、治理审批实现、policy engine、artifact 生命周期或外部正文承接。
- 未把 query、引用、下游使用、同步或 basis event 到达写成正式化触发条件。
- 下一模块只允许写正式化与版本处理流图、覆盖表和停审记录。

### 5.8 正式化与版本处理流:再写入

#### 5.8.1 处理流覆盖表

| 接口 | 处理流口径 | 使用对象 | 未展开 / 独立理由 |
|---|---|---|---|
| `EvaluateMethodAssetFormalization` | 独立处理流 | `FormalizationEligibilityRule`;`FormalizationBasisSummary`;`FormalizationState`;definition / catalog refs | P0 Command,裁决正式化资格但不创建正式版本。 |
| `EstablishFormalMethodAssetVersion` | 独立处理流 | `FormalMethodAssetVersion`;`FormalizationState`;`FormalizationBasisSummary` | P0 Command,建立正式版本边界。 |
| `RecordFormalVersionSemanticChange` | 独立处理流 | `FormalMethodAssetVersion`;`VersionChangeReasonRef`;`FormalizationState` | P0 Command,影响既有正式版本语义和消费保护。 |
| `RetireFormalMethodAssetVersion` | 独立处理流 | `FormalMethodAssetVersion`;`FormalizationState`;`FormalizationReasonRef` | P0 Command,退出新消费语境但保留历史追溯。 |
| `ConsumeFormalizationBasisSummaryAccepted` | 独立处理流 | `FormalizationBasisSummary`;`FormalizationBasisSummaryRef`;`ExternalSourceRefSet` | Inbound Event Consumer,会形成本地 basis linkage / hint。 |
| `GetFormalMethodAssetVersion` | 通用 Query 读路径 | `FormalMethodAssetVersion` | 简单读取正式版本 summary / view。 |
| `GetFormalizationState` | 通用 Query 读路径 + 状态边界说明 | `FormalizationState` | 只读状态,不得触发迁移或创建版本;状态迁移留 Step 9。 |
| `ListConsumableFormalVersions` | 通用 Query 读路径 + availability 边界说明 | `FormalMethodAssetVersionView`;`FormalizationState` | 只读可消费版本列表,不得替代受控消费边界判断。 |
| `GetFormalizationBasisSummary` | 通用 Query 读路径 | `FormalizationBasisSummary` | 只读 body-free basis summary。 |

#### EvaluateMethodAssetFormalization 处理流

```text
<EvaluateMethodAssetFormalization Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodAssetDefinitionRef / MethodAssetCatalogEntryRef / FormalizationBasisSummaryRef
  │
  ▼
<MethodAssetFormalizationService>
  - 装载 definition anchor、catalog context 和 basis summary
  - 校验 basis summary body-free 且服务同一 definition ref
  - 调用 FormalizationEligibilityRule.evaluate_definition(MethodAssetDefinition definition)
  - 调用 FormalizationEligibilityRule.evaluate_catalog(MethodAssetCatalogEntry catalog_entry)
  - 调用 FormalizationEligibilityRule.evaluate_basis(FormalizationBasisSummary basis_summary)
  │
  ▼
<FormalizationState>
  - 形成 pending / formalized-ready / rejected 等 eligibility decision summary
  - 记录 FormalizationReasonRef 或 violation ref
  │
  ▼
<Repository Boundary>
  - 保存 formalization state decision
  - 保存幂等 replay 所需 eligibility result
  │
  ▼
<Formalization Evaluation Result / Accepted Or Rejected Event Candidate>
```

关键说明:

- 该流只判断正式化资格,不自动建立 `FormalMethodAssetVersion`。
- eligibility rule 只判断本仓正式使用语境,不执行治理系统、policy engine 或 artifact 检查。
- 详细设计继续展开状态词表、拒绝 public surface、幂等 replay 和事务边界。

#### EstablishFormalMethodAssetVersion 处理流

```text
<EstablishFormalMethodAssetVersion Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodAssetDefinitionRef / FormalizationBasisSummaryRef / FormalizationState
  │
  ▼
<MethodAssetVersionService>
  - 校验 FormalizationState 允许建立正式版本
  - 校验 definition ref 与 basis summary ref 仍然一致
  - 调用 FormalMethodAssetVersion.candidate_from_definition(MethodAssetDefinitionRef definition_ref, FormalizationBasisSummaryRef basis_summary_ref)
  - 调用 FormalMethodAssetVersion.activate(FormalMethodAssetVersionRef formal_version_ref, FormalizationState formalization_state)
  │
  ▼
<FormalMethodAssetVersion>
  - 建立正式版本稳定引用
  - 绑定 definition ref、catalog context 和 basis summary ref
  - 产生 consumption material refresh hint 和 trace hint
  │
  ▼
<Repository Boundary>
  - 保存 formal version truth 和 state linkage
  - 保存幂等 replay 所需 formal version accepted summary
  │
  ▼
<Formal Version Accepted Result / FormalMethodAssetVersionEstablished Candidate>
```

关键说明:

- 该流建立正式版本边界,但不改写 definition truth 或 catalog truth。
- 只有显式 Command 可建立正式版本;Query、引用、同步、下游使用和 inbound basis 到达都不能隐式触发。
- 详细设计继续展开 formal version ref 生成、状态绑定、重放结果和读取材料刷新。

#### RecordFormalVersionSemanticChange 处理流

```text
<RecordFormalVersionSemanticChange Command>
  - ActorContext / CommandMetadata / IdempotencyKey / FormalMethodAssetVersionRef / VersionChangeReasonRef
  │
  ▼
<MethodAssetVersionService>
  - 装载当前 FormalMethodAssetVersion
  - 校验语义变化是显式业务事实,不是旧 fingerprint / hash 漂移
  - 调用 FormalMethodAssetVersion.mark_superseded(VersionChangeReasonRef reason_ref)
  │
  ▼
<FormalMethodAssetVersion>
  - 标记旧版本被显式替代或需要新版本边界
  - 保留 previous / current formal version linkage
  - 产生 consumption impact hint 和 trace hint
  │
  ▼
<Repository Boundary>
  - 保存 version semantic change summary
  - 保留历史版本可追溯性
  │
  ▼
<Version Change Result / FormalMethodAssetVersionSuperseded Candidate>
```

关键说明:

- 该流表达版本语义变化,不使用旧 fingerprint、snapshot 或 publish 机制替代业务判断。
- 版本被替代不等于删除历史版本;既有消费和追溯仍需稳定引用。
- 详细设计继续展开新旧版本 linkage、影响摘要触发和一致性保护承接。

#### RetireFormalMethodAssetVersion 处理流

```text
<RetireFormalMethodAssetVersion Command>
  - ActorContext / CommandMetadata / IdempotencyKey / FormalMethodAssetVersionRef / FormalizationReasonRef
  │
  ▼
<MethodAssetVersionService>
  - 装载 FormalMethodAssetVersion 和 FormalizationState
  - 校验退出只影响新消费语境
  - 调用 FormalizationState.assert_can_transition_to(FormalizationStateKind next_state_kind)
  │
  ▼
<FormalMethodAssetVersion / FormalizationState>
  - 将正式版本标记为 retired
  - 保留历史引用和 reason ref
  - 产生 availability / trace / protection hint
  │
  ▼
<Repository Boundary>
  - 保存 retirement summary
  - 保存幂等 replay 所需 state result
  │
  ▼
<Retirement Result / Formal Version Retired Candidate>
```

关键说明:

- 该流让正式版本退出新消费语境,不删除历史版本或破坏既有消费材料追溯。
- 退出原因只能以 safe reason ref 表达,不携带外部正文、下游请求正文或治理执行正文。
- 详细设计继续展开状态迁移合法性、既有消费保护和 public result。

#### ConsumeFormalizationBasisSummaryAccepted 处理流

```text
<FormalizationBasisSummaryAccepted Inbound Event>
  - event envelope / event id / idempotency key / FormalizationBasisSummaryRef / ExternalSourceRefSet
  │
  ▼
<Formalization Basis Consumer>
  - 校验来源为外部摘要与引用边界
  - 校验事件只携带 body-free summary/ref
  - 校验幂等状态
  │
  ▼
<MethodAssetFormalizationService>
  - 装载 FormalizationBasisSummary
  - 调用 FormalizationBasisSummary.assert_body_free()
  - 记录 basis available hint,但不自动执行 formalization evaluation
  │
  ▼
<FormalizationBasisSummary Linkage>
  - 保存 basis accepted linkage 或 ignored / rejected result
  - 产生 formalization readiness hint
  │
  ▼
<Consumer Result / Formalization Readiness Event Candidate>
```

关键说明:

- 该流只承接外部安全摘要已可用的事实,不保存外部正文、治理执行正文或 artifact 正文。
- basis 到达不等于正式化通过,也不自动建立正式版本。
- 详细设计继续展开 consumer replay、来源校验、ignored / rejected public result 和 readiness hint。

#### 5.8.2 普通 Query 与事件候选处理

| 项目 | 口径 |
|---|---|
| `GetFormalMethodAssetVersion` | 走通用 Query 读路径;读取正式版本 summary / view,不得返回定义正文全集、basis 正文或 artifact 正文。 |
| `GetFormalizationState` | 走通用 Query 读路径;只读状态和 reason summary,不得触发状态迁移或正式版本创建。 |
| `ListConsumableFormalVersions` | 走通用 Query 读路径;读取可消费版本视图和 availability hint,但最终消费边界仍由受控消费判断。 |
| `GetFormalizationBasisSummary` | 走通用 Query 读路径;只返回 body-free `FormalizationBasisSummary`。 |
| `FormalMethodAssetVersionEstablished` | 由正式版本建立 accepted 产生候选,只携带 formal version ref / definition ref / summary ref。 |
| `MethodAssetFormalizationRejected` | 由正式化评估 rejected 产生候选,只携带 safe reason ref。 |
| `FormalMethodAssetVersionSuperseded` | 由版本语义变化 accepted 产生候选,供受控消费和一致性保护承接。 |

停审记录:

- 接口是否都有处理流口径: pass。4 个 Command 独立展开,1 个 Inbound 独立展开,4 个 Query 走通用读路径并标明边界。
- 对象是否已在 Step 6 定义: pass。处理流只使用 `FormalMethodAssetVersion`、`FormalizationBasisSummary`、`FormalizationState`、`FormalizationEligibilityRule` 和前序 typed refs。
- 跨部分接缝是否清楚: pass。definition / catalog 输入、external summary 输入、consumption refresh hint、trace hint 和 protection hint 均只作为接缝,不在本部分实现。
- 是否越层写完整实现: pass。未写版本算法、hash、fingerprint、状态迁移矩阵、repository trait、SQL、topic、payload、worker、retry 或 outbox relay。
- 下一步: 进入“受控消费处理流:先思考”。

### 5.9 受控消费处理流:先思考

问题回答:

- 本组成部分需要把“准备消费材料”和“读取消费材料”分开。`PrepareMethodAssetConsumptionMaterial` 是写路径,会形成或更新 `MethodAssetConsumptionMaterial`;`GetMethodAssetConsumptionMaterial` 只是读取已有材料。
- `RecordConsumptionBoundaryBlock` 必须独立展开,因为它会记录 Definition vs Use 越界或消费语境阻断,并可能影响 availability view 与追溯线索。
- `ResolveConsumptionMaterialForVersion` 虽然是 Query,但涉及 formal version -> consumption material 的关联解析和 availability hint,需要独立说明不能在查不到时创建材料。
- `GetMethodAssetAvailability` 与 `GetDownstreamConsumptionBoundary` 都包含边界 / 可用性判断,需要独立处理流说明它们只读 view / boundary,不执行鉴权实现、不触发下游动作。
- `GetMethodAssetConsumptionMaterial` 是简单 material 读取,默认引用通用 Query 读路径,但要明确不得返回定义正文全集、外部正文或下游私有副本。
- 本组成部分无 Inbound Event Consumer 和 Operations Job;下游影响摘要归追溯一致性,材料刷新归后台维护与收敛。

诊断:

- 如果消费材料在 Query 中即时创建,会把读取路径变成写路径,也会绕过幂等、边界阻断和追溯线索。
- 如果 availability view 被当成正式版本 truth,下游会把“可读 / 缓存命中 / projection ready”误解成“正式化成立”。
- 如果 boundary Query 返回权限矩阵或 token / role 细节,概要设计会越到 identity / auth / config 实现层,并污染受控消费的 Definition vs Use 语义。
- 如果记录 boundary block 保存下游请求正文,本仓会拥有下游运行 truth 或违规 payload,违背当前数据所有权边界。

取舍:

- 输出 5 张独立图:准备消费材料、记录边界阻断、解析版本对应消费材料、读取可用性、读取下游消费边界。
- `GetMethodAssetConsumptionMaterial` 不画独立图,走通用 Query 读路径。
- `DefinitionUseBoundaryGuard` 只在 Command / Query 中作为 guard 或 boundary 判断对象出现,不作为外部 API。
- 事件候选只表达 material available / blocked,不表达下游是否执行、安装、运行或渲染。

复杂度 / 越界检查:

- 本模块只使用 `MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`、`DefinitionUseBoundaryGuard` 和前序 formal version / definition refs。
- 未写鉴权矩阵、token、role、policy engine、下游执行状态、权限配置、完整状态迁移、repository trait、SQL、topic、payload 或 outbox。
- 未让消费材料创建正式版本,也未让下游消费结果反向决定 definition truth。
- 下一模块只允许写受控消费处理流图、覆盖表和停审记录。

### 5.10 受控消费处理流:再写入

#### 5.10.1 处理流覆盖表

| 接口 | 处理流口径 | 使用对象 | 未展开 / 独立理由 |
|---|---|---|---|
| `PrepareMethodAssetConsumptionMaterial` | 独立处理流 | `MethodAssetConsumptionMaterial`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard`;`FormalMethodAssetVersionRef` | P0 Command,准备正式消费材料。 |
| `RecordConsumptionBoundaryBlock` | 独立处理流 | `DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard`;`MethodAssetAvailabilityView`;`DefinitionUseViolationRef` | P0 Command,记录边界阻断和可用性线索。 |
| `ResolveConsumptionMaterialForVersion` | 独立处理流 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`FormalMethodAssetVersionRef`;`ConsumptionContextRef` | Query 但承担 version -> material resolution 和 unavailable 边界。 |
| `GetMethodAssetAvailability` | 独立处理流 | `MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary` | Query 含 availability / stale / unavailable 分支。 |
| `GetDownstreamConsumptionBoundary` | 独立处理流 | `DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | Query 含消费语境和 Definition vs Use 边界。 |
| `GetMethodAssetConsumptionMaterial` | 通用 Query 读路径 | `MethodAssetConsumptionMaterial` | 简单读取已有材料,不得修复或创建材料。 |

#### PrepareMethodAssetConsumptionMaterial 处理流

```text
<PrepareMethodAssetConsumptionMaterial Command>
  - ActorContext / CommandMetadata / IdempotencyKey / FormalMethodAssetVersionRef / ConsumptionContextRef / DownstreamConsumptionBoundaryRef
  │
  ▼
<MethodAssetConsumptionService>
  - 装载 FormalMethodAssetVersion 和 DownstreamConsumptionBoundary
  - 校验正式版本可作为消费依据
  - 调用 DefinitionUseBoundaryGuard.assert_boundary(DownstreamConsumptionBoundary boundary)
  - 调用 MethodAssetConsumptionMaterial.from_formal_version(FormalMethodAssetVersion formal_version, ConsumptionContextRef consumption_context_ref)
  │
  ▼
<MethodAssetConsumptionMaterial>
  - 绑定 formal version、definition ref、consumption context 和 boundary ref
  - 形成只读 consumption summary
  - 产生 availability view refresh hint 和 trace subject hint
  │
  ▼
<Repository Boundary>
  - 保存 consumption material 和幂等 replay 所需 accepted summary
  - 保留 material available event candidate
  │
  ▼
<Consumption Material Accepted Result / MethodAssetConsumptionMaterialAvailable Candidate>
```

关键说明:

- 该流只准备正式消费材料,不创建正式版本、不复制 definition truth、不执行下游动作。
- `DefinitionUseBoundaryGuard` 保护下游只能读取 / 引用 / 消费,不得反写或替代定义 truth。
- 详细设计继续展开材料 ref 生成、幂等 replay、boundary 失败 public surface 和刷新 hint。

#### RecordConsumptionBoundaryBlock 处理流

```text
<RecordConsumptionBoundaryBlock Command>
  - ActorContext / CommandMetadata / IdempotencyKey / FormalMethodAssetVersionRef / ConsumptionContextRef / DefinitionUseViolationRef
  │
  ▼
<MethodAssetConsumptionService>
  - 装载 formal version、consumption context 和 boundary
  - 调用 DefinitionUseBoundaryGuard.record_violation(DefinitionUseViolationRef violation_ref)
  - 调用 DownstreamConsumptionBoundary.assert_context_allowed(ConsumptionContextRef consumption_context_ref)
  │
  ▼
<DownstreamConsumptionBoundary / DefinitionUseBoundaryGuard>
  - 记录 boundary block summary
  - 形成 MethodAssetAvailabilityView blocked / not available hint
  - 产生 trace / consistency protection hint
  │
  ▼
<Repository Boundary>
  - 保存 boundary block summary 和幂等 replay 结果
  - 不保存下游违规请求正文
  │
  ▼
<Boundary Block Result / MethodAssetConsumptionMaterialBlocked Candidate>
```

关键说明:

- 该流记录安全阻断线索,不执行下游动作、不保存违规 payload、不修改正式版本 truth。
- boundary block 可影响 availability view 和追溯 / 一致性保护,但这些是后续接缝。
- 详细设计继续展开 violation taxonomy、safe reason ref 和 replay surface。

#### ResolveConsumptionMaterialForVersion 处理流

```text
<ResolveConsumptionMaterialForVersion Query>
  - ActorContext / FormalMethodAssetVersionRef / ConsumptionContextRef
  │
  ▼
<MethodAssetConsumptionQueryService>
  - 读取 formal version 与 consumption material association
  - 读取 MethodAssetAvailabilityView
  - 校验 consumption context 与 boundary summary
  │
  ▼
<Consumption Material Resolution>
  - 返回 MethodAssetConsumptionMaterialRef 和 availability hint
  - 对 missing / stale / unavailable 返回安全读取结果
  │
  ▼
<Query Result>
  - consumption material ref resolution summary
```

关键说明:

- 该 Query 保护 formal version 到 consumption material 的解析边界,不能在查不到时创建材料或刷新材料。
- availability hint 只是读取结果,不等于正式化结果或下游执行状态。
- 详细设计继续展开 missing / stale / unavailable public surface 和索引来源。

#### GetMethodAssetAvailability 处理流

```text
<GetMethodAssetAvailability Query>
  - ActorContext / FormalMethodAssetVersionRef / ConsumptionContextRef
  │
  ▼
<MethodAssetConsumptionQueryService>
  - 读取 MethodAssetAvailabilityView
  - 校验 view 派生自 formal version 和 consumption context
  - 读取 boundary summary 用于解释不可用原因
  │
  ▼
<MethodAssetAvailabilityView>
  - 返回 available / pending convergence / not available / stale / unavailable 读取状态
  - 不改变来源 formal version 或 consumption material
  │
  ▼
<Query Result>
  - availability view and safe reason summary
```

关键说明:

- 该流只读可用性视图,不把 projection ready、缓存命中或下游同步成功当作正式化成立。
- stale / unavailable 只能报告状态,刷新或恢复由后台维护与收敛承接。
- 详细设计继续展开状态 public surface、分页 / filter 和读取一致性。

#### GetDownstreamConsumptionBoundary 处理流

```text
<GetDownstreamConsumptionBoundary Query>
  - ActorContext / ConsumptionContextRef / optional FormalMethodAssetVersionRef
  │
  ▼
<MethodAssetConsumptionQueryService>
  - 读取 DownstreamConsumptionBoundary
  - 读取 DefinitionUseBoundaryGuard summary
  - 校验 optional formal version 是否满足 boundary requirement
  │
  ▼
<DownstreamConsumptionBoundary>
  - 返回 allowed use summary、forbidden write summary 和 reason ref
  - 不返回鉴权矩阵、token、role 或 policy engine 细节
  │
  ▼
<Query Result>
  - consumption boundary summary
```

关键说明:

- 该流说明消费边界,不执行访问控制实现、不创建权限决策、不触发下游动作。
- boundary 不能把非正式定义变成可消费正式材料。
- 详细设计继续展开 boundary summary shape、safe reason ref 和与身份 / 配置的协作边界。

#### 5.10.2 普通 Query 与事件候选处理

| 项目 | 口径 |
|---|---|
| `GetMethodAssetConsumptionMaterial` | 走通用 Query 读路径;只读取已有材料和 boundary summary,不得生成材料、刷新材料或返回定义正文全集。 |
| `MethodAssetConsumptionMaterialAvailable` | 由消费材料准备 accepted 产生候选,只携带 material ref、formal version ref 和 context ref。 |
| `MethodAssetConsumptionMaterialBlocked` | 由 boundary block recorded 产生候选,只携带 boundary ref、violation ref / reason ref 和 context ref。 |

停审记录:

- 接口是否都有处理流口径: pass。2 个 Command 独立展开,3 个边界 Query 独立展开,1 个普通 material Query 走通用读路径。
- 对象是否已在 Step 6 定义: pass。处理流只使用 `MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`、`DefinitionUseBoundaryGuard` 和相关 typed refs。
- 跨部分接缝是否清楚: pass。formal version 输入、availability refresh hint、trace subject hint、protection hint 和 event candidate 均只作为接缝,不在本部分实现。
- 是否越层写完整实现: pass。未写鉴权矩阵、token、role、policy engine、下游运行 truth、repository trait、SQL、topic、payload、worker、retry 或 outbox relay。
- 下一步: 进入“追溯与一致性保护处理流:先思考”。

### 5.11 追溯与一致性保护处理流:先思考

问题回答:

- 本组成部分的处理流要分开 trace、impact、protection 和 audit。`PrepareMethodAssetTraceMaterial` 组织追溯材料;`AcceptConsumptionImpactSummary` 承接影响摘要;`EvaluateConsistencyProtection` 判断保护动作;`RecordMethodAssetAuditTrailEntry` 追加 body-free 审计线索。
- `ConsumeDownstreamConsumptionImpactSummary` 与 `ConsumeEvidenceMarkerAvailable` 都会改写本地 summary / trace / audit linkage,必须独立展开,且只能接收 body-free summary / marker / ref。
- `GetConsistencyProtectionStatus` 虽然是 Query,但含 required action / pending acknowledgement / violated / resolved 等保护边界,需要独立处理流说明它只读 protection read material,不执行恢复。
- `GetMethodAssetTraceMaterial`、`ListConsumptionImpactSummaries`、`GetMethodAssetAuditTrail` 走通用 Query 读路径,但必须说明不返回 raw log、telemetry、证据正文、外部正文或下游运行状态。
- Operations Job 不在本组成部分定义。trace refresh、audit refresh、impact refresh 和 consistency recovery 由后台维护与收敛处理。

诊断:

- 如果 trace material 在 Query 中即时拼装,后续审计与 protection 读到的材料可能与正式写入不一致。
- 如果 impact summary 由本仓扫描下游生成,会把下游运行 truth 引入本仓;当前只能接收或记录 body-free impact summary。
- 如果 audit trail 直接保存 raw log 或 evidence JSON,后续测试证据 / 运维日志 / artifact 正文会污染领域对象。
- 如果 protection evaluation 执行恢复,会越过后台维护与收敛,并可能绕过正式化、版本和受控消费边界。

取舍:

- 输出 7 张独立图:4 个 Command、2 个 Inbound Event Consumer、1 个 protection status Query。
- 3 个普通读取 Query 走通用读路径。
- `TraceSubjectRef` 在每个 trace / audit / impact 处理流中作为主体边界出现,但不替代具体 definition / formal version / consumption material typed ref。
- 事件候选只表达 trace changed、impact accepted、protection required,不画可靠投递或 report schema。

复杂度 / 越界检查:

- 本模块只使用 `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy`、`MethodAssetAuditTrail`、`TraceSubjectRef` 和相关 typed refs。
- 未写 raw log、telemetry、audit table、evidence JSON、证据 schema、恢复算法、repository trait、SQL、topic、payload、worker、retry 或 outbox。
- 未把 trace、impact、audit 写成第二 definition truth、第二 formal version truth 或下游 runtime truth。
- 下一模块只允许写追溯与一致性保护处理流图、覆盖表和停审记录。

### 5.12 追溯与一致性保护处理流:再写入

#### 5.12.1 处理流覆盖表

| 接口 | 处理流口径 | 使用对象 | 未展开 / 独立理由 |
|---|---|---|---|
| `PrepareMethodAssetTraceMaterial` | 独立处理流 | `MethodAssetTraceMaterial`;`TraceSubjectRef`;formal version / consumption refs | P0 Command,组织 body-free 追溯材料。 |
| `AcceptConsumptionImpactSummary` | 独立处理流 | `ConsumptionImpactSummary`;`ConsumptionImpactSourceRef`;`TraceSubjectRef` | P0 Command,承接影响摘要。 |
| `EvaluateConsistencyProtection` | 独立处理流 | `ConsistencyProtectionPolicy`;`ConsumptionImpactSummary`;`TraceSubjectRef` | P0 Command,判断保护动作。 |
| `RecordMethodAssetAuditTrailEntry` | 独立处理流 | `MethodAssetAuditTrail`;`MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;evidence marker refs | P0 Command,追加 body-free audit linkage。 |
| `ConsumeDownstreamConsumptionImpactSummary` | 独立处理流 | `ConsumptionImpactSummary`;`ConsumptionImpactSourceRef` | Inbound,承接下游 body-free impact summary。 |
| `ConsumeEvidenceMarkerAvailable` | 独立处理流 | `MethodAssetAuditTrail`;`MethodAssetTraceMaterial`;`TraceSubjectRef`;evidence marker refs | Inbound,承接 evidence marker / lineage ref。 |
| `GetConsistencyProtectionStatus` | 独立处理流 | `ConsistencyProtectionPolicy`;`TraceSubjectRef`;`ConsumptionContextRef` | Query 含保护状态和 required action 边界。 |
| `GetMethodAssetTraceMaterial` | 通用 Query 读路径 | `MethodAssetTraceMaterial`;`TraceSubjectRef` | 简单读取追溯材料。 |
| `ListConsumptionImpactSummaries` | 通用 Query 读路径 | `ConsumptionImpactSummary`;`TraceSubjectRef` | 简单读取影响摘要 page,不得扫描下游。 |
| `GetMethodAssetAuditTrail` | 通用 Query 读路径 | `MethodAssetAuditTrail`;`TraceSubjectRef` | 简单读取 audit summary,不得返回 raw log。 |

#### PrepareMethodAssetTraceMaterial 处理流

```text
<PrepareMethodAssetTraceMaterial Command>
  - ActorContext / CommandMetadata / IdempotencyKey / TraceSubjectRef / definition-ref or formal-version-ref or consumption-material-ref
  │
  ▼
<MethodAssetTraceService>
  - 校验 TraceSubjectRef 来自正式 typed ref
  - 装载 formal version、consumption material、basis summary 或 relation summary
  - 调用 MethodAssetTraceMaterial.from_formal_version(FormalMethodAssetVersion formal_version, TraceSubjectRef trace_subject_ref)
  - 或调用 MethodAssetTraceMaterial.from_consumption_material(MethodAssetConsumptionMaterial consumption_material, TraceSubjectRef trace_subject_ref)
  │
  ▼
<MethodAssetTraceMaterial>
  - 组织 body-free trace material
  - 连接 basis refs、consumption context 和 evidence marker refs
  - 不复制来源 truth 正文
  │
  ▼
<Repository Boundary>
  - 保存 trace material 和幂等 replay 所需 trace summary
  - 保留 audit trail append hint
  │
  ▼
<Trace Material Result / MethodAssetTraceMaterialChanged Candidate>
```

关键说明:

- 该流组织追溯材料,不替代 definition、formal version、consumption material 或 relation truth。
- trace subject 必须来自正式 typed ref,不能从字符串、日志 id、artifact path 或下游 id 拼接。
- 详细设计继续展开主体类型、trace source 选择、replay surface 和 trace material refresh。

#### AcceptConsumptionImpactSummary 处理流

```text
<AcceptConsumptionImpactSummary Command>
  - ActorContext / CommandMetadata / IdempotencyKey / ConsumptionImpactSourceRef / ConsumptionImpactSummary
  │
  ▼
<MethodAssetConsistencyService>
  - 校验 impact summary body-free
  - 校验 impact source ref 指向正式变化来源
  - 调用 ConsumptionImpactSummary.assert_body_free()
  - 调用 ConsumptionImpactSummary.classify(ImpactClassificationRuleRef rule_ref)
  │
  ▼
<ConsumptionImpactSummary>
  - 记录 affected definition / formal version / consumption context refs
  - 标记 candidate / confirmed / unknown / dismissed 等摘要状态
  - 产生 protection evaluation hint
  │
  ▼
<Repository Boundary>
  - 保存 impact summary 和幂等 replay 所需 accepted summary
  - 不扫描或保存下游运行状态
  │
  ▼
<Impact Accepted Result / ConsumptionImpactSummaryAccepted Candidate>
```

关键说明:

- 该流承接影响摘要,不拥有下游运行 truth,也不把 unknown 写成 no impact。
- impact 分类只形成摘要状态,保护动作由 `EvaluateConsistencyProtection` 判断。
- 详细设计继续展开 impact source 类型、unknown public surface 和分类规则来源。

#### EvaluateConsistencyProtection 处理流

```text
<EvaluateConsistencyProtection Command>
  - ActorContext / CommandMetadata / IdempotencyKey / TraceSubjectRef / ConsumptionImpactSummaryRef
  │
  ▼
<MethodAssetConsistencyService>
  - 装载 impact summary 和相关 trace subject
  - 校验 impact summary 已被承接
  - 调用 ConsistencyProtectionPolicy.from_impact_summary(ConsumptionImpactSummary impact_summary)
  - 调用 ConsistencyProtectionPolicy.evaluate_impact(ConsumptionImpactSummary impact_summary)
  │
  ▼
<ConsistencyProtectionPolicy>
  - 形成 no action / acknowledgement required / protection violated / recovery required 等保护判断
  - 产生 recovery hint 或 pending acknowledgement hint
  │
  ▼
<Repository Boundary>
  - 保存 protection decision summary
  - 保存幂等 replay 所需 policy result
  │
  ▼
<Protection Decision Result / ConsistencyProtectionRequired Candidate>
```

关键说明:

- 该流判断保护动作,不执行恢复算法、不重新正式化、不绕过消费边界。
- protection required 只是后续维护或承接的输入,不是自动修复。
- 详细设计继续展开保护动作枚举、acknowledgement surface 和 recovery handoff。

#### RecordMethodAssetAuditTrailEntry 处理流

```text
<RecordMethodAssetAuditTrailEntry Command>
  - ActorContext / CommandMetadata / IdempotencyKey / TraceSubjectRef / trace refs / impact refs / evidence marker refs
  │
  ▼
<MethodAssetTraceService>
  - 装载或建立 MethodAssetAuditTrail for TraceSubjectRef
  - 校验输入全部是 body-free ref / marker / summary
  - 调用 MethodAssetAuditTrail.append_trace_material(MethodAssetTraceMaterialRef trace_material_ref)
  - 调用 MethodAssetAuditTrail.append_impact_summary(ConsumptionImpactSummaryRef impact_summary_ref)
  - 调用 MethodAssetAuditTrail.append_evidence_marker(MethodAssetEvidenceMarkerRef evidence_marker_ref)
  │
  ▼
<MethodAssetAuditTrail>
  - 追加 audit entry refs
  - 组织历史解释线索
  - 不保存 raw audit log、请求正文、响应正文或证据正文
  │
  ▼
<Repository Boundary>
  - 保存 audit trail summary 和幂等 replay 结果
  │
  ▼
<Audit Trail Entry Result / MethodAssetTraceMaterialChanged Candidate>
```

关键说明:

- 该流只追加 body-free 审计线索,不定义 audit table、保留周期或证据 schema。
- audit trail 不替代 trace material,也不保存 raw log / telemetry。
- 详细设计继续展开 trail create/load、entry ordering、sealed state 和 replay surface。

#### ConsumeDownstreamConsumptionImpactSummary 处理流

```text
<DownstreamConsumptionImpactSummary Inbound Event>
  - event envelope / event id / idempotency key / ConsumptionImpactSummary / ConsumptionImpactSourceRef
  │
  ▼
<Impact Summary Consumer>
  - 校验下游只提供 body-free impact summary
  - 校验 event source 和幂等状态
  - 拒绝下游运行正文、raw log、request body 或 execution state
  │
  ▼
<MethodAssetConsistencyService>
  - 调用 ConsumptionImpactSummary.assert_body_free()
  - 保存 impact accepted / ignored / rejected linkage
  - 产生 protection evaluation hint
  │
  ▼
<ConsumptionImpactSummary Linkage>
  - 形成 impact summary ref 和 safe accepted result
  │
  ▼
<Consumer Result / ConsumptionImpactSummaryAccepted Candidate>
```

关键说明:

- 该流只承接下游已经形成的安全影响摘要,不扫描下游系统。
- event payload 不能携带下游运行状态正文、证据正文或日志正文。
- 详细设计继续展开 consumer replay、source ref 校验和 rejected surface。

#### ConsumeEvidenceMarkerAvailable 处理流

```text
<EvidenceMarkerAvailable Inbound Event>
  - event envelope / event id / idempotency key / MethodAssetEvidenceMarkerRef / TraceSubjectRef
  │
  ▼
<Evidence Marker Consumer>
  - 校验 marker/ref 来源合法且 body-free
  - 校验 TraceSubjectRef 来自正式 typed ref
  - 校验幂等状态
  │
  ▼
<MethodAssetTraceService>
  - 将 evidence marker ref 连接到 trace material 或 audit trail
  - 不读取、不复制、不保存证据正文或 archive 包
  │
  ▼
<Trace / Audit Linkage>
  - 保存 evidence marker linkage summary
  - 产生 audit trail append hint
  │
  ▼
<Consumer Result / Trace Material Changed Candidate>
```

关键说明:

- 该流承接 evidence marker / lineage ref,不是证据文件入仓。
- marker 只能作为 trace / audit linkage,不能成为业务 truth 或 raw evidence store。
- 详细设计继续展开 marker 来源、lineage ref 校验和 ignored / rejected result。

#### GetConsistencyProtectionStatus 处理流

```text
<GetConsistencyProtectionStatus Query>
  - ActorContext / TraceSubjectRef / optional ConsumptionContextRef
  │
  ▼
<MethodAssetConsistencyQueryService>
  - 读取 ConsistencyProtectionPolicy read material
  - 读取关联 impact summary / trace subject summary
  - 校验 optional consumption context 是否在保护范围内
  │
  ▼
<ConsistencyProtectionPolicy>
  - 返回 active / pending acknowledgement / violated / resolved / retired 状态摘要
  - 返回 required action summary,但不执行恢复或确认
  │
  ▼
<Query Result>
  - protection status and safe action summary
```

关键说明:

- 该流只读保护状态,不执行 recovery、acknowledgement 或状态修复。
- required action 是后续维护或人工承接输入,不是本 Query 的副作用。
- 详细设计继续展开状态 public surface、action summary 和读取一致性。

#### 5.12.2 普通 Query 与事件候选处理

| 项目 | 口径 |
|---|---|
| `GetMethodAssetTraceMaterial` | 走通用 Query 读路径;只读取 trace material / summary,不得返回外部正文、证据正文、raw log。 |
| `ListConsumptionImpactSummaries` | 走通用 Query 读路径;只读取 impact summary page,不得扫描下游运行状态;unknown 必须显式返回。 |
| `GetMethodAssetAuditTrail` | 走通用 Query 读路径;只读取 audit trail summary,不得返回 telemetry、raw log、证据文件或请求 / 响应正文。 |
| `MethodAssetTraceMaterialChanged` | 由 trace prepare、audit append、evidence marker linkage 产生候选,只携带 trace material ref / subject ref。 |
| `ConsumptionImpactSummaryAccepted` | 由 impact command 或 inbound accepted 产生候选,只携带 impact summary ref / source ref。 |
| `ConsistencyProtectionRequired` | 由 protection evaluation 产生候选,只携带 protection policy ref / required action kind / safe reason ref。 |

停审记录:

- 接口是否都有处理流口径: pass。4 个 Command、2 个 Inbound 和 1 个 protection Query 独立展开,3 个普通 Query 走通用读路径。
- 对象是否已在 Step 6 定义: pass。处理流只使用 `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy`、`MethodAssetAuditTrail`、`TraceSubjectRef` 和相关 typed refs / marker refs。
- 跨部分接缝是否清楚: pass。formal version / consumption material 输入、downstream impact summary、evidence marker、maintenance recovery hint 和 event candidate 均只作为接缝。
- 是否越层写完整实现: pass。未写 audit schema、evidence schema、raw log、telemetry、恢复算法、repository trait、SQL、topic、payload、worker、retry 或 outbox relay。
- 下一步: 进入“关系与分发语义处理流:先思考”。

### 5.13 关系与分发语义处理流:先思考

问题回答:

- 本组成部分要把 relation truth 和 distribution ref 分开。`ProposeMethodAssetRelation` / `ActivateMethodAssetRelation` 改写 `MethodAssetRelation`;`EstablishMethodAssetDistributionRef` / `LimitOrRetireMethodAssetDistributionRef` 改写 `MethodAssetDistributionRef`。
- `CheckRelationIntegrity` 虽然是 Query,但涉及 relation endpoint、formalization boundary、distribution context 和 forbidden marketplace / runtime boundary,需要独立图说明它只读完整性材料,不修复关系。
- `GetMethodAssetRelation`、`ListMethodAssetRelations`、`GetMethodAssetDistributionRef` 是普通读取,走通用 Query 读路径,但必须明确不返回图算法、推荐结果、运行依赖或 marketplace 履约。
- 本组成部分无 Inbound Event Consumer 和 Operations Job。外部依据要先走外部摘要与引用,关系 / 分发读取材料刷新交给后台维护。
- Outbound Event 只产生 relation changed / distribution changed 候选,供受控消费、追溯一致性、外围组织和维护刷新承接。

诊断:

- 如果 relation 与 definition 合并,definition truth 会承载图结构和外围组织语义,后续变更影响边界会失控。
- 如果 distribution ref 与 package / marketplace 合并,分发语义会被 listing、交易、安装和履约事实污染。
- 如果 relation integrity 在 Command 中完全隐式,后续 Step 9 无法说明 relation proposed、active、scope limited、retired 等状态的触发来源。
- 如果 relation Query 执行图遍历 / 推荐排序,概要设计会越过当前支撑语义边界。

取舍:

- 输出 5 张独立图:提出关系、激活关系、建立分发引用、限定 / 退出分发引用、检查关系完整性。
- 普通 relation / distribution 读取不画独立图,通过覆盖表说明走通用读路径。
- `RelationIntegrityRule` 只作为 policy / invariant 使用,不暴露为外部 command API。
- 事件候选不画 per-event relay flow。

复杂度 / 越界检查:

- 本模块只使用 `MethodAssetRelation`、`MethodAssetDistributionRef`、`RelationIntegrityRule`、`RelatedMethodAssetRef`、`DistributionContextRef` 和前序 definition / formal version refs。
- 未写图算法、推荐算法、搜索索引、运行依赖图、调用图、marketplace listing、交易、安装履约、repository trait、SQL、topic、payload 或 outbox。
- 未把 relation view、distribution read material、UI 分类或 package 正文写成 relation truth。
- 下一模块只允许写关系与分发语义处理流图、覆盖表和停审记录。

### 5.14 关系与分发语义处理流:再写入

#### 5.14.1 处理流覆盖表

| 接口 | 处理流口径 | 使用对象 | 未展开 / 独立理由 |
|---|---|---|---|
| `ProposeMethodAssetRelation` | 独立处理流 | `MethodAssetRelation`;`MethodAssetDefinitionRef`;`RelatedMethodAssetRef` | P0 Command,建立 relation candidate truth。 |
| `ActivateMethodAssetRelation` | 独立处理流 | `MethodAssetRelation`;`RelationIntegrityRule`;`MethodAssetRelationRef` | P0 Command,完整性通过后激活关系语义。 |
| `EstablishMethodAssetDistributionRef` | 独立处理流 | `MethodAssetDistributionRef`;`MethodAssetDefinitionRef` 或 `FormalMethodAssetVersionRef`;`DistributionContextRef` | P0 Command,建立分发语义边界 ref。 |
| `LimitOrRetireMethodAssetDistributionRef` | 独立处理流 | `MethodAssetDistributionRef`;`DistributionBoundaryReasonRef` | P0 Command,限定或退出分发语义。 |
| `CheckRelationIntegrity` | 独立处理流 | `RelationIntegrityRule`;`MethodAssetRelation`;`MethodAssetDistributionRef` | Query 但含完整性和边界判断。 |
| `GetMethodAssetRelation` | 通用 Query 读路径 | `MethodAssetRelation` | 简单读取 relation summary / view。 |
| `ListMethodAssetRelations` | 通用 Query 读路径 | `MethodAssetRelation`;`MethodAssetDefinitionRef`;`DistributionContextRef` | 简单读取 relation page,不得创建或修复关系。 |
| `GetMethodAssetDistributionRef` | 通用 Query 读路径 | `MethodAssetDistributionRef` | 简单读取 distribution ref summary。 |

#### ProposeMethodAssetRelation 处理流

```text
<ProposeMethodAssetRelation Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodAssetDefinitionRef / RelatedMethodAssetRef / relation context summary
  │
  ▼
<MethodAssetRelationService>
  - 校验 source 和 target 都是正式 typed ref
  - 拒绝 free-form id、URL、marketplace id 或 runtime dependency id
  - 调用 MethodAssetRelation.propose(MethodAssetDefinitionRef source_asset_ref, RelatedMethodAssetRef target_asset_ref)
  │
  ▼
<MethodAssetRelation>
  - 建立 relation proposed 状态
  - 记录 relation kind 和 relation context
  - 产生 integrity check hint 和 trace hint
  │
  ▼
<Repository Boundary>
  - 保存 relation candidate truth 和幂等 replay summary
  │
  ▼
<Relation Proposed Result / MethodAssetRelationChanged Candidate>
```

关键说明:

- 该流只提出定义性关系候选,不创建或修改 definition truth。
- relation endpoint 必须来自 typed ref,不能用字符串、URL、marketplace listing 或 runtime dependency 替代。
- 详细设计继续展开 relation kind、端点校验和 replay surface。

#### ActivateMethodAssetRelation 处理流

```text
<ActivateMethodAssetRelation Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodAssetRelationRef / RelationIntegrityRuleRef
  │
  ▼
<MethodAssetRelationService>
  - 装载 MethodAssetRelation candidate
  - 装载 RelationIntegrityRule
  - 调用 MethodAssetRelation.assert_integrity(RelationIntegrityRule integrity_rule)
  - 调用 MethodAssetRelation.activate(MethodAssetRelationRef relation_ref, RelationIntegrityRuleRef integrity_rule_ref)
  │
  ▼
<MethodAssetRelation>
  - 标记 relation active 或 scope limited
  - 保留 integrity rule ref 和 trace subject ref
  - 产生 consumption / peripheral / trace refresh hint
  │
  ▼
<Repository Boundary>
  - 保存 relation active summary 和幂等 replay result
  │
  ▼
<Relation Activated Result / MethodAssetRelationChanged Candidate>
```

关键说明:

- 该流激活关系语义,不执行图算法、不生成推荐结果、不表达运行依赖。
- `RelationIntegrityRule` 是完整性判断输入,不是外部可直接写入的业务对象。
- 详细设计继续展开 proposed -> active 的状态迁移、scope limited surface 和读取材料刷新。

#### EstablishMethodAssetDistributionRef 处理流

```text
<EstablishMethodAssetDistributionRef Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodAssetDefinitionRef or FormalMethodAssetVersionRef / DistributionContextRef
  │
  ▼
<MethodAssetDistributionService>
  - 校验 definition 或 formal version ref 属于本仓方法资产边界
  - 校验 distribution context 不表示 marketplace 交易或安装履约
  - 调用 MethodAssetDistributionRef.for_definition(MethodAssetDefinitionRef definition_ref, DistributionContextRef distribution_context_ref)
  - 或调用 MethodAssetDistributionRef.for_formal_version(FormalMethodAssetVersionRef formal_version_ref, DistributionContextRef distribution_context_ref)
  │
  ▼
<MethodAssetDistributionRef>
  - 建立分发语义引用
  - 绑定 definition / formal version 与 distribution context
  - 产生 peripheral discovery hint 和 consumption context hint
  │
  ▼
<Repository Boundary>
  - 保存 distribution ref summary 和幂等 replay result
  │
  ▼
<Distribution Ref Result / MethodAssetDistributionChanged Candidate>
```

关键说明:

- 该流建立分发语义引用,不表示 marketplace listing、交易、安装包或履约状态。
- 分发引用不能让非正式定义或越界消费变成正式可用。
- 详细设计继续展开 definition / formal version 输入取舍、context 校验和 replay surface。

#### LimitOrRetireMethodAssetDistributionRef 处理流

```text
<LimitOrRetireMethodAssetDistributionRef Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodAssetDistributionRef / DistributionBoundaryReasonRef
  │
  ▼
<MethodAssetDistributionService>
  - 装载 MethodAssetDistributionRef
  - 校验限定或退出不删除历史引用
  - 调用 MethodAssetDistributionRef.scope_limited(MethodAssetDistributionRefValue distribution_ref, DistributionContextRef distribution_context_ref)
  │
  ▼
<MethodAssetDistributionRef>
  - 标记 scope limited / suspended / retired
  - 保留 boundary reason ref
  - 产生 consumption availability hint 和 peripheral refresh hint
  │
  ▼
<Repository Boundary>
  - 保存 distribution boundary summary 和幂等 replay result
  │
  ▼
<Distribution Boundary Result / MethodAssetDistributionChanged Candidate>
```

关键说明:

- 该流限定或退出分发语义,不删除历史引用,也不修改 definition / formal version truth。
- boundary reason 必须是 safe ref,不能携带 marketplace 交易正文或安装履约正文。
- 详细设计继续展开 scope limited / retired 状态、历史可解释性和 read material refresh。

#### CheckRelationIntegrity 处理流

```text
<CheckRelationIntegrity Query>
  - ActorContext / MethodAssetRelationRef / optional RelationIntegrityRuleRef
  │
  ▼
<MethodAssetRelationQueryService>
  - 读取 relation truth 或 relation read material
  - 读取 RelationIntegrityRule summary
  - 检查 endpoint、formalization boundary、distribution context 和 forbidden boundary
  │
  ▼
<RelationIntegrityRule>
  - 返回 integrity passed / pending / failed / unavailable summary
  - 不创建、激活、修复或删除 relation
  │
  ▼
<Query Result>
  - relation integrity summary and safe reason refs
```

关键说明:

- 该流读取完整性判断,不执行关系修复、不激活关系、不做图遍历或推荐排序。
- failed / unavailable 只能作为安全读取结果或后续维护线索,不能在 Query 中改写 truth。
- 详细设计继续展开完整性状态 public surface、rule selection 和 read model 来源。

#### 5.14.2 普通 Query 与事件候选处理

| 项目 | 口径 |
|---|---|
| `GetMethodAssetRelation` | 走通用 Query 读路径;读取 relation summary / view,不得返回图算法结果、推荐分数或运行依赖。 |
| `ListMethodAssetRelations` | 走通用 Query 读路径;读取 relation page,不得在查询中创建、激活或修复关系。 |
| `GetMethodAssetDistributionRef` | 走通用 Query 读路径;读取 distribution ref summary,不得返回 marketplace 交易、安装或履约状态。 |
| `MethodAssetRelationChanged` | 由 relation propose / activate / scope / retire accepted 产生候选,只携带 relation ref 和 endpoint refs。 |
| `MethodAssetDistributionChanged` | 由 distribution establish / limit / retire accepted 产生候选,只携带 distribution ref、definition / formal version ref 和 context ref。 |

停审记录:

- 接口是否都有处理流口径: pass。4 个 Command 和 1 个 integrity Query 独立展开,3 个普通 Query 走通用读路径。
- 对象是否已在 Step 6 定义: pass。处理流只使用 `MethodAssetRelation`、`MethodAssetDistributionRef`、`RelationIntegrityRule`、`RelatedMethodAssetRef`、`DistributionContextRef` 和前序 typed refs。
- 跨部分接缝是否清楚: pass。definition / formal version 输入、consumption context hint、peripheral discovery hint、trace hint 和 read material refresh hint 均只作为接缝。
- 是否越层写完整实现: pass。未写图算法、推荐算法、搜索索引、运行依赖图、marketplace 交易、安装履约、repository trait、SQL、topic、payload、worker、retry 或 outbox relay。
- 下一步: 进入“外部摘要与引用处理流:先思考”。

### 5.15 外部摘要与引用处理流:先思考

问题回答:

- 本组成部分必须把 summary、source ref、archive ref 和正文拒绝分开。`AcceptExternalSourceSummary` 写 `ExternalSourceSummary`;`RegisterExternalSourceRef` 写 `ExternalSourceRef`;`RegisterArtifactArchiveRef` 写 `ArtifactArchiveRef`;`RejectExternalBodyMaterial` 写 boundary rejection summary。
- `ConsumeExternalSafeSummaryAvailable` 和 `ConsumeArtifactArchiveMarkerAvailable` 都会把外部 body-free marker/ref 接入本仓对象,必须独立展开。
- `ResolveExternalSourceRef` 是 Query,但承担 typed external ref resolution 边界,需要独立说明不得从 URL、文件路径、外部 id 或 route param 拼接 ref。
- `GetExternalSourceSummary`、`GetArtifactArchiveRef`、`ListExternalBasisAcceptanceStates` 走通用 Query 读路径,但必须说明不能读取外部系统补正文或返回 artifact / archive payload。
- `ExternalBodyBoundaryRule` 不作为用户内容审查 API 暴露,但所有接收 / 登记 / inbound 路径都必须显式经过正文边界。

诊断:

- 如果 summary/ref 不统一归口,正式化、追溯、关系分发和外围组织会分别私造外部 ref 和正文边界。
- 如果 archive ref 保存对象存储路径、signed URL 或 archive 包,本仓会拥有外部生命周期和 artifact 正文。
- 如果 inbound safe summary 到达自动触发正式化或关系建立,外部事件会越过显式 Command 边界。
- 如果 external Query 拉取外部系统补正文,读取路径会引入外部可用性、网络调用和正文复制风险。

取舍:

- 输出 7 张独立图:4 个 Command、2 个 Inbound、1 个 external ref resolution Query。
- 普通 summary / archive / acceptance state 读取走通用 Query 读路径。
- 事件候选只表达 summary accepted / rejected / stale,不画 outbox / topic / relay。
- `GovernanceBasisRef` 只作为 typed ref 输入出现,不扩成治理执行对象。

复杂度 / 越界检查:

- 本模块只使用 `ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef`、`ExternalBodyBoundaryRule` 和相关 marker / typed refs。
- 未写外部 API、回调协议、summary schema、ref key 规则、artifact schema、evidence JSON、对象存储路径、signed URL、repository trait、SQL、topic、payload 或 outbox。
- 未保存治理执行正文、标准全文、ADR 正文、artifact 正文、archive 包、证据正文、marketplace 交易履约或外部 API payload。
- 下一模块只允许写外部摘要与引用处理流图、覆盖表和停审记录。

### 5.16 外部摘要与引用处理流:再写入

#### 5.16.1 处理流覆盖表

| 接口 | 处理流口径 | 使用对象 | 未展开 / 独立理由 |
|---|---|---|---|
| `AcceptExternalSourceSummary` | 独立处理流 | `ExternalSourceSummary`;`ExternalSourceRef`;`ExternalBodyBoundaryRule` | P0 Command,承接 body-free 外部摘要。 |
| `RegisterExternalSourceRef` | 独立处理流 | `ExternalSourceRef`;`ExternalBodyBoundaryRule`;`GovernanceBasisRef` optional | P0 Command,建立外部来源 typed ref。 |
| `RegisterArtifactArchiveRef` | 独立处理流 | `ArtifactArchiveRef`;`ExternalSourceRef`;`ExternalBodyBoundaryRule` | P0 Command,登记 artifact / archive 引用边界。 |
| `RejectExternalBodyMaterial` | 独立处理流 | `ExternalBodyBoundaryRule`;`ExternalBodyMaterialRef` | P0 Command,显式拒绝正文入仓。 |
| `ConsumeExternalSafeSummaryAvailable` | 独立处理流 | `ExternalSourceSummary`;`ExternalSourceRef`;`ExternalSafeSummaryMarker` | Inbound,承接外部 safe summary marker。 |
| `ConsumeArtifactArchiveMarkerAvailable` | 独立处理流 | `ArtifactArchiveRef`;`ExternalSourceRef`;`ArtifactArchiveMaterialMarker` | Inbound,承接 artifact / archive marker。 |
| `ResolveExternalSourceRef` | 独立处理流 | `ExternalSourceRef`;external identity material | Query 但承担 external source typed ref resolution。 |
| `GetExternalSourceSummary` | 通用 Query 读路径 | `ExternalSourceSummary` | 简单读取 body-free summary。 |
| `GetArtifactArchiveRef` | 通用 Query 读路径 | `ArtifactArchiveRef` | 简单读取 archive ref summary。 |
| `ListExternalBasisAcceptanceStates` | 通用 Query 读路径 | `ExternalSourceSummary`;acceptance state | 简单读取 acceptance state page。 |

#### AcceptExternalSourceSummary 处理流

```text
<AcceptExternalSourceSummary Command>
  - ActorContext / CommandMetadata / IdempotencyKey / ExternalSourceRef / ExternalSafeSummaryMarker / optional basis context
  │
  ▼
<ExternalBasisAcceptanceService>
  - 装载 ExternalSourceRef 和 ExternalBodyBoundaryRule
  - 调用 ExternalBodyBoundaryRule.assert_summary_only(ExternalSourceSummary summary)
  - 调用 ExternalSourceSummary.from_safe_summary(ExternalSourceRef source_ref, ExternalSafeSummaryMarker safe_summary_marker)
  │
  ▼
<ExternalSourceSummary>
  - 保存 body-free safe summary marker 和 acceptance state
  - 连接 formalization / trace / relation / peripheral basis refs
  - 不保存标准全文、ADR 正文、artifact 正文或外部 payload
  │
  ▼
<Repository Boundary>
  - 保存 external source summary 和幂等 replay result
  │
  ▼
<External Summary Accepted Result / ExternalSourceSummaryAccepted Candidate>
```

关键说明:

- 该流只承接安全摘要 marker/ref,不保存外部正文或治理执行正文。
- 外部 summary 可作为正式化、追溯、关系和外围组织依据线索,但不自动触发这些业务 Command。
- 详细设计继续展开 summary marker 来源、acceptance state 和 replay surface。

#### RegisterExternalSourceRef 处理流

```text
<RegisterExternalSourceRef Command>
  - ActorContext / CommandMetadata / IdempotencyKey / ExternalSourceKind / ExternalSourceNamespaceRef / optional GovernanceBasisRef
  │
  ▼
<ExternalBasisAcceptanceService>
  - 校验 source kind 和 namespace 属于正式来源边界
  - 校验输入不是 free-form URL、文件路径或外部 id
  - 调用 ExternalSourceRef.from_formal_source_key(ExternalSourceKind source_kind, ExternalSourceNamespaceRef source_namespace_ref)
  - 或调用 ExternalSourceRef.from_governance_basis(GovernanceBasisRef governance_basis_ref)
  │
  ▼
<ExternalSourceRef>
  - 建立 opaque external source typed ref
  - 固定 body boundary marker
  - 产生 external summary acceptance hint
  │
  ▼
<Repository Boundary>
  - 保存 external source ref summary 和幂等 replay result
  │
  ▼
<External Source Ref Result>
```

关键说明:

- 该流建立 typed ref 边界,不保存外部正文、URL payload 或外部生命周期。
- `GovernanceBasisRef` 只作为治理依据引用,不引入治理执行过程。
- 详细设计继续展开 formal source key、namespace 规则和 replay surface。

#### RegisterArtifactArchiveRef 处理流

```text
<RegisterArtifactArchiveRef Command>
  - ActorContext / CommandMetadata / IdempotencyKey / ExternalSourceRef / ArtifactArchiveMaterialMarker
  │
  ▼
<ExternalBasisAcceptanceService>
  - 装载 ExternalSourceRef 和 ExternalBodyBoundaryRule
  - 校验 marker 只指向 artifact / archive 安全引用
  - 调用 ArtifactArchiveRef.from_external_source(ExternalSourceRef source_ref, ArtifactArchiveMaterialMarker material_marker)
  │
  ▼
<ArtifactArchiveRef>
  - 建立 artifact / archive typed ref
  - 绑定 external source ref 和 material marker
  - 不保存对象存储路径、signed URL、archive 包或 artifact 正文
  │
  ▼
<Repository Boundary>
  - 保存 artifact archive ref summary 和幂等 replay result
  │
  ▼
<Artifact Archive Ref Result / ExternalSourceSummaryAccepted Candidate>
```

关键说明:

- 该流只登记 artifact / archive 引用边界,不拥有 artifact 生命周期或存储内容。
- archive ref 可以支撑 trace / evidence / formalization basis,但不能替代 evidence schema。
- 详细设计继续展开 marker 来源、archive kind 和 external adapter boundary。

#### RejectExternalBodyMaterial 处理流

```text
<RejectExternalBodyMaterial Command>
  - ActorContext / CommandMetadata / IdempotencyKey / ExternalBodyMaterialRef / ExternalBodyBoundaryRuleRef
  │
  ▼
<ExternalBasisAcceptanceService>
  - 装载 ExternalBodyBoundaryRule
  - 调用 ExternalBodyBoundaryRule.reject_external_body(ExternalBodyMaterialRef body_material_ref)
  │
  ▼
<ExternalBodyBoundaryRule>
  - 形成 boundary rejection summary
  - 记录 safe reason ref
  - 不保存被拒绝正文
  │
  ▼
<Repository Boundary>
  - 保存 rejection summary 和幂等 replay result
  │
  ▼
<Boundary Rejection Result / ExternalSourceSummaryRejected Candidate>
```

关键说明:

- 该流显式拒绝正文入仓,不是内容审查或外部文件扫描服务。
- rejection result 只保存 safe reason ref,不保存被拒绝正文、payload 或附件。
- 详细设计继续展开 body material ref 来源、rejection public surface 和 audit linkage。

#### ConsumeExternalSafeSummaryAvailable 处理流

```text
<ExternalSafeSummaryAvailable Inbound Event>
  - event envelope / event id / idempotency key / ExternalSourceRef / ExternalSafeSummaryMarker
  │
  ▼
<External Summary Consumer>
  - 校验事件来源和幂等状态
  - 校验 payload 只含 safe summary marker / ref
  - 拒绝标准全文、ADR 正文、治理正文或外部 API payload
  │
  ▼
<ExternalBasisAcceptanceService>
  - 调用 ExternalSourceSummary.from_safe_summary(ExternalSourceRef source_ref, ExternalSafeSummaryMarker safe_summary_marker)
  - 保存 accepted / ignored / rejected linkage
  │
  ▼
<ExternalSourceSummary Linkage>
  - 形成 external summary ref 和 readiness hint
  │
  ▼
<Consumer Result / ExternalSourceSummaryAccepted Candidate>
```

关键说明:

- 该流只承接外部安全摘要到达,不拉取外部正文,也不自动触发正式化。
- inbound envelope / idempotency 是必须边界,topic / payload schema / retry 留后续。
- 详细设计继续展开来源校验、ignored / rejected result 和 replay surface。

#### ConsumeArtifactArchiveMarkerAvailable 处理流

```text
<ArtifactArchiveMarkerAvailable Inbound Event>
  - event envelope / event id / idempotency key / ExternalSourceRef / ArtifactArchiveMaterialMarker
  │
  ▼
<Artifact Archive Marker Consumer>
  - 校验 marker/ref 来源合法且 body-free
  - 校验事件不携带 archive 包、artifact payload 或对象存储内容
  - 校验幂等状态
  │
  ▼
<ExternalBasisAcceptanceService>
  - 调用 ArtifactArchiveRef.from_external_source(ExternalSourceRef source_ref, ArtifactArchiveMaterialMarker material_marker)
  - 保存 artifact archive linkage
  │
  ▼
<ArtifactArchiveRef Linkage>
  - 形成 archive ref summary 和 trace / evidence hint
  │
  ▼
<Consumer Result / ExternalSourceSummaryAccepted Candidate>
```

关键说明:

- 该流承接 artifact / archive marker,不是 artifact 或 archive 入仓。
- marker 可以为 trace / evidence / formalization 提供线索,但正文和对象存储生命周期留在外部。
- 详细设计继续展开 marker 来源、lineage handoff 和 rejected result。

#### ResolveExternalSourceRef 处理流

```text
<ResolveExternalSourceRef Query>
  - ActorContext / external source identity query
  │
  ▼
<ExternalSourceQueryService>
  - 读取 external source identity material
  - 校验候选 ref 来自正式 ExternalSourceRef
  - 拒绝 URL、文件路径、外部 id、route param 或 marketplace listing id 拼接
  │
  ▼
<ExternalSourceRef Resolution>
  - 返回唯一 ExternalSourceRef 和 resolution summary
  - 对 missing / ambiguous / out-of-scope 返回安全读取结果
  │
  ▼
<Query Result>
  - external source ref resolution summary
```

关键说明:

- 该 Query 独立展开是因为它保护 external typed ref 来源,不是因为它写入 truth。
- resolution 不能访问外部系统补正文,也不能在查不到时登记新的 source ref。
- 详细设计继续展开 identity material、missing / ambiguous public surface 和索引来源。

#### 5.16.2 普通 Query 与事件候选处理

| 项目 | 口径 |
|---|---|
| `GetExternalSourceSummary` | 走通用 Query 读路径;只返回 body-free summary,不得返回外部正文、标准全文、artifact 内容或外部 API payload。 |
| `GetArtifactArchiveRef` | 走通用 Query 读路径;只返回 archive ref summary,不得返回 archive 包、对象存储内容、signed URL 或证据文件。 |
| `ListExternalBasisAcceptanceStates` | 走通用 Query 读路径;只读取 acceptance state page,不得拉取外部系统补正文或状态。 |
| `ExternalSourceSummaryAccepted` | 由 summary accepted 或 inbound accepted 产生候选,只携带 summary ref / source ref。 |
| `ExternalSourceSummaryRejected` | 由 body boundary rejected 产生候选,只携带 safe reason ref。 |
| `ExternalSourceSummaryStale` | 由 summary stale 标记或维护检查产生候选,不触发正文复制。 |

停审记录:

- 接口是否都有处理流口径: pass。4 个 Command、2 个 Inbound 和 1 个 ref resolution Query 独立展开,3 个普通 Query 走通用读路径。
- 对象是否已在 Step 6 定义: pass。处理流只使用 `ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef`、`ExternalBodyBoundaryRule` 和相关 marker / typed refs。
- 跨部分接缝是否清楚: pass。formalization basis、trace evidence、relation basis、peripheral context 和 maintenance stale check 均只作为接缝。
- 是否越层写完整实现: pass。未写外部 API、summary schema、ref key 规则、artifact schema、evidence JSON、对象存储路径、signed URL、repository trait、SQL、topic、payload、worker、retry 或 outbox relay。
- 下一步: 进入“后台维护与收敛处理流:先思考”。

### 5.17 后台维护与收敛处理流:先思考

问题回答:

- 本组成部分没有业务 Command。Step 8 需要展开的是 Operations Job 和维护读取 Query,不是给业务侧新增“手动修复 truth”的写入口。
- `RefreshMethodAssetReadMaterials` 必须独立展开,因为它承接 catalog、formal version、consumption、availability、relation、distribution、external summary 和外围 discovery 等读取材料刷新。它只能基于已有 truth / summary / material state 派生 refreshed material,不得创建 definition、formal version、relation 或 external source truth。
- `RefreshMethodAssetTraceMaterials` 必须独立展开,因为它承接 trace、audit、impact 和 evidence marker linkage 的读取材料收敛。它不得读取 raw log、telemetry、证据正文、artifact 正文或外部正文。
- `RunMethodAssetConsistencyRecovery` 必须独立展开,因为它承接 pending issue、unavailable、impact unknown、boundary blocked 和 protection required 的收敛语义。它可以形成 recovery summary、pending acknowledgement refs 或 unavailable issue refs,但不得重做正式化裁决、绕过消费边界或直接修改核心 truth。
- `GetMaintenanceProgress`、`GetMaintenanceTaskSummary`、`ListPendingMaintenanceIssues` 都是只读 Query。它们可以读取 `MaintenanceProgressView`、task summary 和 issue refs,但不能执行恢复、确认、刷新或 worker diagnostic 拉取。
- 本组成部分的事件候选只表达 refreshed / recovery required / unavailable / converged 等维护事实候选,不恢复旧 outbox、rebuild、snapshot、checkpoint 或 report schema。

诊断:

- 如果 refresh job 可以修改 core truth,后台维护会变成绕过业务 Command 的第二写入口,破坏 definition、formalization、consumption、relation 和 external summary 的 owner 边界。
- 如果 recovery job 自动重新正式化或重新建立消费材料,它会把一致性恢复变成业务裁决,并掩盖正式化失败、消费边界阻断和 impact unknown。
- 如果 progress Query 依赖 raw log、worker id、queue state 或 cron run,后续验收和运维会绑定实现私有状态,而不是 `MaintenanceProgressView`。
- 如果维护流恢复旧 snapshot / outbox / fingerprint 语义,当前 full-restart 的对象和接口结论会被历史材料污染。

取舍:

- 输出 6 张独立图:读取材料刷新 job、追溯材料刷新 job、一致性恢复 job、维护进度读取、维护任务摘要读取、待处理维护问题列表读取。
- 三个 Operations Job 共用通用 job envelope,但仍分别画图,因为刷新对象、边界风险和输出线索不同。
- `MaintenanceProgressView` 作为 Query 输出和 job 收敛结果出现,但它是 read model,不是 task truth 或业务 truth。
- 维护事件候选只在本模块列出产生来源,不定义 reliable delivery、topic、payload、outbox relay、run report JSON 或 gate artifact schema。

复杂度 / 越界检查:

- 本模块只使用 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceProgressView`、`MaintenanceRunRef`、`RefreshScopeRef` 和已有 material / summary / issue refs。
- 未写 worker loop、调度器、队列、锁、retry policy、report schema、artifact schema、raw diagnostic、日志格式、repository trait、SQL、topic、payload 或 outbox。
- 未让 maintenance job 创建、删除或修复 definition truth、formal version truth、consumption boundary truth、relation truth、distribution truth 或 external summary truth。
- 下一模块只允许写后台维护与收敛处理流图、覆盖表和停审记录。

### 5.18 后台维护与收敛处理流:再写入

#### 5.18.1 处理流覆盖表

| 接口 | 处理流口径 | 使用对象 | 未展开 / 独立理由 |
|---|---|---|---|
| `RefreshMethodAssetReadMaterials` | 独立处理流 | `ReadMaterialRefreshTask`;`MaintenanceProgressView`;`RefreshScopeRef` | Operations Job,刷新读取材料并推进 progress。 |
| `RefreshMethodAssetTraceMaterials` | 独立处理流 | `TraceMaterialRefreshTask`;`MaintenanceProgressView`;`TraceSubjectRefSet` | Operations Job,刷新追溯 / audit / impact 可读材料。 |
| `RunMethodAssetConsistencyRecovery` | 独立处理流 | `ConsistencyRecoveryTask`;`MaintenanceProgressView`;`MaintenanceIssueRefSet` | Operations Job,收敛 consistency issue 和 pending acknowledgement。 |
| `GetMaintenanceProgress` | 独立处理流 | `MaintenanceProgressView`;`MaintenanceRunRef`;`RefreshScopeRef` | Query,读取维护进度,不能执行 job。 |
| `GetMaintenanceTaskSummary` | 独立处理流 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask` | Query,读取 task summary,不能把 task state 当业务 truth。 |
| `ListPendingMaintenanceIssues` | 独立处理流 | `MaintenanceProgressView`;`MaintenanceIssueRefSet`;`RefreshScopeRef` | Query,读取待处理问题列表,不能确认或恢复。 |

#### RefreshMethodAssetReadMaterials 处理流

```text
<RefreshMethodAssetReadMaterials Operations Job>
  - MaintenanceRunRef / ReadMaterialRefreshTaskRef / RefreshScopeRef / source subject refs
  │
  ▼
<Maintenance Application Service>
  - 装载 ReadMaterialRefreshTask 和 refresh scope
  - 读取已有 definition、catalog、formal version、consumption、relation、distribution、external summary 或 peripheral material state
  - 校验任务目标只属于 read material kind set
  │
  ▼
<ReadMaterialRefreshTask>
  - 刷新 catalog / formal version / consumption / availability / relation / distribution / external summary / peripheral read material
  - 形成 refreshed material refs 或 unavailable issue refs
  - 调用 MaintenanceProgressView.refresh_from_tasks(MaintenanceTaskRefSet task_refs)
  │
  ▼
<Repository Boundary>
  - 保存 refreshed read material refs 和 progress view
  - 不创建、不删除、不修复 core business truth
  │
  ▼
<Job Result / MethodAssetReadMaterialRefreshed Candidate / MaintenanceProgressView>
```

关键说明:

- 该 job 只刷新派生读取材料,不建立 definition、formal version、consumption material、relation、distribution 或 external source truth。
- missing / stale / unavailable 只能形成 body-free issue ref 或 progress state,不能在 job 中反向补业务对象。
- 详细设计继续展开刷新目标枚举、任务 replay、并发和 repository port。

#### RefreshMethodAssetTraceMaterials 处理流

```text
<RefreshMethodAssetTraceMaterials Operations Job>
  - MaintenanceRunRef / TraceMaterialRefreshTaskRef / TraceSubjectRefSet / trace-audit-impact refs
  │
  ▼
<Maintenance Application Service>
  - 装载 TraceMaterialRefreshTask 和 trace subject refs
  - 读取已有 trace material、audit trail、impact summary 和 evidence marker linkage
  - 校验所有输入均为 body-free ref / marker / summary
  │
  ▼
<TraceMaterialRefreshTask>
  - 刷新 trace material view、audit readable linkage 和 impact summary read material
  - 对缺失 marker 或不完整 trace 标记 incomplete / unavailable issue
  - 推进 MaintenanceProgressView
  │
  ▼
<Repository Boundary>
  - 保存 refreshed trace / audit / impact material refs 和 progress view
  - 不保存 raw log、telemetry、evidence body、artifact body 或 external body
  │
  ▼
<Job Result / MethodAssetTraceMaterialRefreshed Candidate / MaintenanceProgressView>
```

关键说明:

- 该 job 收敛追溯读取材料,不创建新的 trace truth,也不追加业务审计正文。
- evidence、archive 和 artifact 只能以 marker / ref 参与刷新,不能被 job 读取正文。
- 详细设计继续展开 trace material 选择、incomplete surface 和 task replay。

#### RunMethodAssetConsistencyRecovery 处理流

```text
<RunMethodAssetConsistencyRecovery Operations Job>
  - MaintenanceRunRef / ConsistencyRecoveryTaskRef / RefreshScopeRef / impact-protection refs
  │
  ▼
<Maintenance Application Service>
  - 装载 ConsistencyRecoveryTask 和 recovery scope
  - 读取 pending issue、impact summary、protection status 和 boundary block summary
  - 校验 RecoverySafetyBoundaryRef 阻止越界恢复
  │
  ▼
<ConsistencyRecoveryTask>
  - 对可收敛 issue 形成 recovery summary
  - 对需要正式承接的 issue 形成 pending acknowledgement refs
  - 对边界阻断形成 RecoveryBlockedByBoundary 或 unavailable issue
  │
  ▼
<Repository Boundary>
  - 保存 recovery summary、issue refs 和 progress view
  - 不重做正式化、不创建消费材料、不绕过 boundary、不修改 core truth
  │
  ▼
<Job Result / MethodAssetRecoveryAttentionRequired Candidate / MaintenanceProgressView>
```

关键说明:

- 该 job 负责收敛一致性问题的可见状态,不替代正式业务 Command。
- recovery 可以标记 pending acknowledgement、blocked 或 converged,但不能直接改写业务 truth。
- 详细设计继续展开 recovery issue 分类、acknowledgement handoff、失败 surface 和 replay。

#### GetMaintenanceProgress 处理流

```text
<GetMaintenanceProgress Query>
  - ActorContext / MaintenanceRunRef or RefreshScopeRef
  │
  ▼
<Maintenance Query Service>
  - 读取 MaintenanceProgressView
  - 校验 run / scope 与读取语境匹配
  - 不访问 worker log、queue state、cron run 或 raw diagnostic
  │
  ▼
<MaintenanceProgressView>
  - 返回 pending / in progress / converged / unavailable / failed 等进度摘要
  - 返回 body-free issue refs 和 source cursor summary
  │
  ▼
<Query Result>
  - maintenance progress view
```

关键说明:

- 该 Query 只读维护进度,不能执行刷新、恢复、确认或重试。
- progress converged 只说明维护材料收敛,不等于正式化通过或消费可用。
- 详细设计继续展开读取权限、missing run surface 和 pagination / filter。

#### GetMaintenanceTaskSummary 处理流

```text
<GetMaintenanceTaskSummary Query>
  - ActorContext / maintenance task ref / task kind summary
  │
  ▼
<Maintenance Query Service>
  - 读取 ReadMaterialRefreshTask 或 TraceMaterialRefreshTask 或 ConsistencyRecoveryTask summary
  - 校验 task kind 与 task ref 类型一致
  - 不读取 adapter payload 或 worker execution body
  │
  ▼
<Maintenance Task Summary>
  - 返回 task state、scope ref、safe reason ref 和 issue refs
  - 明确 task state 不是业务 truth
  │
  ▼
<Query Result>
  - task summary and safe issue refs
```

关键说明:

- 该 Query 用于解释维护任务,不让 task state 替代业务对象状态。
- 失败原因只能是 safe reason / issue ref,不能返回 stack trace、raw log 或 adapter response。
- 详细设计继续展开 task ref union、public surface 和 replay 可见性。

#### ListPendingMaintenanceIssues 处理流

```text
<ListPendingMaintenanceIssues Query>
  - ActorContext / RefreshScopeRef / page and filter summary
  │
  ▼
<Maintenance Query Service>
  - 读取 MaintenanceProgressView 和 issue read material
  - 按 pending acknowledgement / unavailable / failed 等安全状态筛选
  - 不执行 acknowledgement、recovery 或 refresh
  │
  ▼
<MaintenanceIssue Page>
  - 返回 issue refs、safe reason refs、affected subject refs 和 task refs
  - 不返回 raw diagnostic 或外部正文
  │
  ▼
<Query Result>
  - pending maintenance issue page
```

关键说明:

- 该 Query 提供待处理维护问题列表,不执行确认、恢复、刷新或外部拉取。
- issue 必须保持 body-free,只能携带 ref、marker、safe reason 和 task linkage。
- 详细设计继续展开 issue 分类、filter / page surface 和验收证据承接。

#### 5.18.2 事件候选处理

| 项目 | 口径 |
|---|---|
| `MethodAssetReadMaterialRefreshed` | 由 read material refresh converged 产生候选,只携带 refreshed material refs、scope ref 和 run ref。 |
| `MethodAssetTraceMaterialRefreshed` | 由 trace material refresh converged 产生候选,只携带 trace / audit / impact material refs 和 subject refs。 |
| `MethodAssetRecoveryAttentionRequired` | 由 recovery pending / blocked / failed 产生候选,只携带 issue refs、safe reason refs 和 recovery scope ref。 |
| `MethodAssetMaintenanceUnavailable` | 由 refresh / recovery unavailable 产生候选,只携带 unavailable issue ref 和 affected scope ref。 |

停审记录:

- 接口是否都有处理流口径: pass。3 个 Operations Job 和 3 个 maintenance Query 均独立展开。
- 对象是否已在 Step 6 定义: pass。处理流只使用 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceProgressView`、`MaintenanceRunRef`、`RefreshScopeRef`、issue refs 和已有 material / summary refs。
- 跨部分接缝是否清楚: pass。definition / formalization / consumption / relation / external summary / peripheral material 只作为读取来源或刷新目标,不被 maintenance 改写。
- 是否越层写完整实现: pass。未写 worker、scheduler、queue、lock、retry、report JSON、artifact schema、raw diagnostic、repository trait、SQL、topic、payload 或 outbox relay。
- 下一步: 进入“外围包与方法集组织处理流:先思考”。

### 5.19 外围包与方法集组织处理流:先思考

问题回答:

- 本组成部分需要展开 `CreateMethodPackage`、`AdjustMethodPackage`、`CreateMethodSetAssembly`、`AdjustMethodSetAssembly` 四个外围 Command。它们改写外围组织 truth candidate,但不作为 definition、formal version、consumption material 或 trace consistency 的前置。
- `GetMethodPackage`、`ListMethodPackages`、`GetMethodSetAssembly` 是普通外围读取,原则上可走通用 Query 读路径,但本模块需要说明它们读取 package / set view 时不得返回 package payload、artifact 包、UI 会话或 marketplace 履约。
- `DiscoverPeripheralMethodAssets` 需要独立展开,因为它涉及 `MarketplaceContextRef` 或 ecosystem context 的外围发现边界。它只读取 peripheral discovery material,不表示交易、购买、安装、结算、授权履约或下游运行状态。
- `PackageCompositionRule` 必须在 package / set Command 中显式出现,用于校验成员 typed ref、正式化边界、分发上下文和 marketplace 边界;它不暴露成单独外部 API。
- 本组成部分没有 Inbound Event Consumer 和 Operations Job。marketplace / ecosystem 来源若需要进入本仓,必须先通过外部摘要与引用形成 safe summary / ref;外围读取材料刷新交给后台维护与收敛。
- 事件候选只表达 `MethodPackageChanged`、`MethodSetAssemblyChanged` 和 `PeripheralMethodOrganizationUnavailable`,不写 topic、payload、listing、交易或安装履约。

诊断:

- 如果 package / set 创建流允许直接创建 definition 或 formal version,外围增强会反向成为核心闭环前置。
- 如果 package / set 读取返回 artifact 包、installation package 或 marketplace listing payload,本仓会越过 external / artifact / marketplace 边界。
- 如果 discovery Query 被写成 marketplace 搜索 / 下单 / 安装入口,它会把外围发现和 L6 marketplace 履约混在一起。
- 如果 package unavailable 影响核心 consumption availability,外围材料故障会错误地让核心方法资产不可用。

取舍:

- 输出 5 张独立图:创建 package、调整 package、创建 method set assembly、调整 method set assembly、外围发现读取。
- 三个普通读取 Query 使用通用 Query 读路径,但在覆盖表和普通 Query 说明中标注 body-free、no payload、no fulfillment。
- Package / set changed 事件候选只作为外围组织变化事实;维护刷新和追溯审计可承接,核心闭环不依赖它们。
- 不恢复旧 P1 `MethodPlugin`、`MethodConfiguration`、`EffectiveContentSet` 或 plugin/configuration 发布流。

复杂度 / 越界检查:

- 本模块只使用 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、`MethodPackageRef`、`MarketplaceContextRef`、`DistributionContextRef` 和核心 typed refs。
- 未写 package schema、method set schema、marketplace listing schema、交易 / 安装 / 结算状态、artifact package、UI 会话、组织运行配置、repository trait、SQL、topic、payload 或 outbox。
- 未让 package / set 改写 definition、formal version、consumption boundary、relation、distribution 或 external summary truth。
- 下一模块只允许写外围包与方法集组织处理流图、覆盖表和停审记录。

### 5.20 外围包与方法集组织处理流:再写入

#### 5.20.1 处理流覆盖表

| 接口 | 处理流口径 | 使用对象 | 未展开 / 独立理由 |
|---|---|---|---|
| `CreateMethodPackage` | 独立处理流 | `MethodPackage`;`MethodPackageRef`;`PackageCompositionRule` | P0 peripheral Command,建立外围包组织语义。 |
| `AdjustMethodPackage` | 独立处理流 | `MethodPackage`;`PackageCompositionRule`;member / context adjustment summary | P0 peripheral Command,调整包成员或上下文。 |
| `CreateMethodSetAssembly` | 独立处理流 | `MethodSetAssembly`;`MethodPackageRefSet`;`PackageCompositionRule` | P0 peripheral Command,建立组织级方法集组装。 |
| `AdjustMethodSetAssembly` | 独立处理流 | `MethodSetAssembly`;`PackageCompositionRule`;assembly adjustment summary | P0 peripheral Command,调整方法集组装。 |
| `DiscoverPeripheralMethodAssets` | 独立处理流 | `MethodPackage`;`MethodSetAssembly`;`MarketplaceContextRef` | Query 含 marketplace / ecosystem 外围发现边界。 |
| `GetMethodPackage` | 通用 Query 读路径 | `MethodPackage`;package view | 简单读取外围 package view。 |
| `ListMethodPackages` | 通用 Query 读路径 | `MethodPackage`;`DistributionContextRef`;`MarketplaceContextRef` | 简单读取 package page,不得创建或修复 package。 |
| `GetMethodSetAssembly` | 通用 Query 读路径 | `MethodSetAssembly`;method set view | 简单读取方法集组装 view。 |

#### CreateMethodPackage 处理流

```text
<CreateMethodPackage Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodPackageRef / MethodAssetDefinitionRefSet / optional DistributionContextRef
  │
  ▼
<MethodPackageService>
  - 校验 MethodPackageRef 来自正式 package identity
  - 校验成员 definition / formal version / distribution refs 是正式 typed ref
  - 调用 PackageCompositionRule.evaluate_package(MethodPackage package)
  │
  ▼
<MethodPackage>
  - 建立 package draft 或 active 外围组织语义
  - 绑定 member refs、distribution context 和 composition rule ref
  - 产生 peripheral discovery refresh hint 和 trace hint
  │
  ▼
<Repository Boundary>
  - 保存 package peripheral truth candidate 和幂等 replay summary
  - 不创建 core definition、formal version、consumption material 或 marketplace listing
  │
  ▼
<Package Accepted Result / MethodPackageChanged Candidate>
```

关键说明:

- 该流建立外围包组织语义,不表示 marketplace listing、交易商品、安装包或 artifact package。
- package 成员只能引用已有核心 typed ref,不能在创建 package 时补建核心对象。
- 详细设计继续展开 package identity、composition failure surface、replay 和 peripheral read material。

#### AdjustMethodPackage 处理流

```text
<AdjustMethodPackage Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodPackageRef / member-context adjustment summary
  │
  ▼
<MethodPackageService>
  - 装载 MethodPackage
  - 校验调整不反写 core truth、不绕过 formalization / consumption / distribution boundary
  - 调用 MethodPackage.assert_composition(PackageCompositionRule composition_rule)
  │
  ▼
<MethodPackage>
  - 调整成员引用、分发上下文或外围状态
  - 对不可用外围材料标记 PackageUnavailable 或 scope limited
  - 产生 discovery refresh hint 和 audit / trace hint
  │
  ▼
<Repository Boundary>
  - 保存 package change summary 和幂等 replay result
  - 不保存 package payload、artifact 正文、listing payload 或 UI 状态
  │
  ▼
<Package Adjusted Result / MethodPackageChanged Candidate>
```

关键说明:

- 该流调整外围组织,不触发核心定义、正式版本、消费材料或 relation 的修改。
- package unavailable 只影响外围发现和外围可见性,不让核心资产不可用。
- 详细设计继续展开 adjustment 分类、composition rule 版本、history / trace linkage。

#### CreateMethodSetAssembly 处理流

```text
<CreateMethodSetAssembly Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodSetAssemblyRef / MethodPackageRefSet / optional member definition refs
  │
  ▼
<MethodSetAssemblyService>
  - 校验 package refs 和 member definition refs 均来自正式 typed ref
  - 校验 organization context 不携带 UI 会话或运行配置正文
  - 调用 PackageCompositionRule.evaluate_assembly(MethodSetAssembly assembly)
  │
  ▼
<MethodSetAssembly>
  - 建立 organization-level method set assembly
  - 绑定 package refs、member refs、organization context 和 composition rule ref
  - 产生 peripheral discovery refresh hint 和 trace hint
  │
  ▼
<Repository Boundary>
  - 保存 method set assembly peripheral truth candidate 和幂等 replay summary
  - 不覆盖 core definition、formal version 或 consumption boundary
  │
  ▼
<Method Set Accepted Result / MethodSetAssemblyChanged Candidate>
```

关键说明:

- 该流建立组织级方法集组装语义,不保存 UI / console 状态、组织运行配置正文或 marketplace 履约。
- method set 可以引用 package 和 definition,但不能替代正式版本或受控消费边界。
- 详细设计继续展开 organization context、成员校验、replay 和外围 view 刷新。

#### AdjustMethodSetAssembly 处理流

```text
<AdjustMethodSetAssembly Command>
  - ActorContext / CommandMetadata / IdempotencyKey / MethodSetAssemblyRef / assembly adjustment summary
  │
  ▼
<MethodSetAssemblyService>
  - 装载 MethodSetAssembly
  - 校验成员、package refs 和 organization context 调整仍满足外围边界
  - 调用 MethodSetAssembly.assert_composition(PackageCompositionRule composition_rule)
  │
  ▼
<MethodSetAssembly>
  - 调整 package refs、member refs 或组织语境
  - 对外围不可用标记 AssemblyUnavailable 或 scope limited
  - 产生 peripheral discovery refresh hint 和 trace hint
  │
  ▼
<Repository Boundary>
  - 保存 assembly change summary 和幂等 replay result
  - 不保存 UI 会话、组织配置正文、marketplace payload 或 runtime state
  │
  ▼
<Method Set Adjusted Result / MethodSetAssemblyChanged Candidate>
```

关键说明:

- 该流只调整方法集外围组装,不改变核心资产和消费边界。
- assembly unavailable 只影响外围读取和发现,核心闭环继续独立成立。
- 详细设计继续展开 adjustment 分类、scope limited surface、trace / audit linkage。

#### DiscoverPeripheralMethodAssets 处理流

```text
<DiscoverPeripheralMethodAssets Query>
  - ActorContext / MarketplaceContextRef or ecosystem context ref / page and filter summary
  │
  ▼
<Peripheral Discovery Query Service>
  - 读取 package / method set discovery read material
  - 校验 MarketplaceContextRef 只表达生态发现语境
  - 拒绝交易、购买、安装、结算、授权履约或 marketplace payload
  │
  ▼
<Peripheral Discovery Material>
  - 返回 package / method set discovery summary page
  - 标注 unavailable / stale / scope limited 等外围可见状态
  │
  ▼
<Query Result>
  - peripheral discovery summary page
```

关键说明:

- 该 Query 支撑外围发现,不执行 marketplace 搜索履约、交易、安装或授权。
- stale / unavailable 只影响外围 discovery material,刷新交给 maintenance job。
- 详细设计继续展开 marketplace context typed ref、filter / page surface 和 unavailable public surface。

#### 5.20.2 普通 Query 与事件候选处理

| 项目 | 口径 |
|---|---|
| `GetMethodPackage` | 走通用 Query 读路径;只读取 package summary / view,不得返回 package payload、artifact 包、listing payload 或安装状态。 |
| `ListMethodPackages` | 走通用 Query 读路径;按 distribution / marketplace context 读取 package page,不得在查询中创建或修复 package。 |
| `GetMethodSetAssembly` | 走通用 Query 读路径;只读取 method set assembly summary / view,不得返回 UI 会话、组织配置正文或 runtime state。 |
| `MethodPackageChanged` | 由 package create / adjust accepted 产生候选,只携带 package ref、member refs、context refs 和 safe change summary。 |
| `MethodSetAssemblyChanged` | 由 method set create / adjust accepted 产生候选,只携带 assembly ref、package refs、member refs 和 safe change summary。 |
| `PeripheralMethodOrganizationUnavailable` | 由 package / set unavailable 或 discovery unavailable 产生候选,只携带 affected package / assembly refs 和 safe reason ref。 |

停审记录:

- 接口是否都有处理流口径: pass。4 个外围 Command 和 1 个 discovery Query 独立展开,3 个普通 Query 走通用读路径。
- 对象是否已在 Step 6 定义: pass。处理流只使用 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、`MethodPackageRef`、`MarketplaceContextRef`、`DistributionContextRef` 和核心 typed refs。
- 跨部分接缝是否清楚: pass。definition / formal version / distribution 只作为成员引用或组成校验输入;外部生态先经 external summary / ref;外围材料刷新交给 maintenance。
- 是否越层写完整实现: pass。未写 marketplace listing schema、交易、安装、结算、artifact package、UI 会话、组织配置正文、repository trait、SQL、topic、payload 或 outbox relay。
- 下一步: 进入“跨处理流一致性审计”。

### 5.21 跨处理流一致性审计

问题回答:

- Step 7 的接口均已落到独立处理流、通用读路径、通用事件候选说明或明确未展开理由。核心 P0 Command、会形成本地材料的 Inbound、三个 Operations Job 均已独立展开。
- Step 6 的关键对象均在处理流中被按 owner 使用:definition / catalog、formal version、consumption material、trace / impact / protection、relation / distribution、external summary / ref、maintenance task / progress、package / set 各自没有越界改写。
- Query 处理流保持只读。少数边界 Query 独立展开是为了说明 resolution、availability、protection、integrity、maintenance progress 和 peripheral discovery 的只读边界,不是引入写入副作用。
- Inbound 处理流保持 body-free。所有 inbound 都先经过 envelope / idempotency / source boundary,并明确拒绝外部正文、artifact 正文、证据正文、下游运行状态和 marketplace 履约。
- Operations Job 只在后台维护与收敛出现。它们刷新派生材料、progress 和 issue refs,不修复 core truth,不重做正式化和消费裁决。

#### 5.21.1 接口覆盖审计

| 接口类别 | 覆盖结果 | 说明 |
|---|---|---|
| Definition / catalog Command | pass | establish / adjust definition,register / reclassify catalog 均独立展开。 |
| Definition / catalog Query | pass | typed ref resolution 独立展开;普通 definition / catalog read 走通用读路径。 |
| Formalization / version Command | pass | evaluation、version establish、semantic change、retire 均独立展开。 |
| Formalization inbound / Query | pass | basis summary inbound 独立展开;状态和版本读取走只读路径。 |
| Consumption Command / Query | pass | material prepare、boundary block、material resolution、availability、boundary 均独立展开;普通 material read 走通用读路径。 |
| Trace / impact / protection / audit | pass | trace、impact、protection、audit、impact inbound、evidence marker inbound、protection status 均独立展开。 |
| Relation / distribution | pass | relation propose / activate、distribution establish / limit、integrity check 均独立展开;普通读取走通用读路径。 |
| External summary / ref | pass | external summary/ref/archive/body rejection、external inbound 和 external ref resolution 均独立展开。 |
| Maintenance Job / Query | pass | 3 个 job 和 3 个 maintenance Query 均独立展开。 |
| Peripheral package / set | pass | 4 个 peripheral Command 和 discovery Query 独立展开;普通 package / set 读取走通用读路径。 |

#### 5.21.2 对象与 owner 审计

| 对象 owner | 处理流约束 | 审计结果 |
|---|---|---|
| `MethodAssetDefinition` | 只由 definition establish / adjust 改写。 | pass |
| `MethodAssetCatalogEntry` | 只由 catalog register / reclassify 改写;view 刷新不改 truth。 | pass |
| `FormalMethodAssetVersion` / `FormalizationState` | 只由 formalization / version Command 改写。 | pass |
| `MethodAssetConsumptionMaterial` / `DownstreamConsumptionBoundary` | 由 consumption material prepare / boundary block 改写,Query 不创建材料。 | pass |
| `MethodAssetTraceMaterial` / `ConsumptionImpactSummary` / `ConsistencyProtectionPolicy` / `MethodAssetAuditTrail` | 由 trace / impact / protection / audit / body-free inbound 改写或连接。 | pass |
| `MethodAssetRelation` / `MethodAssetDistributionRef` | relation 和 distribution flows 分开,package / marketplace 不改写它们。 | pass |
| `ExternalSourceSummary` / `ExternalSourceRef` / `ArtifactArchiveRef` | external flows 承接 summary/ref/marker,不保存正文。 | pass |
| `ReadMaterialRefreshTask` / `TraceMaterialRefreshTask` / `ConsistencyRecoveryTask` / `MaintenanceProgressView` | maintenance 只刷新材料、progress 和 issue refs。 | pass |
| `MethodPackage` / `MethodSetAssembly` / `PackageCompositionRule` | peripheral flows 不成为核心闭环前置。 | pass |

#### 5.21.3 接缝和副作用审计

| 接缝 | 允许的连接 | 禁止的连接 | 结果 |
|---|---|---|---|
| definition -> formalization | definition ref / catalog context / formalization hint。 | definition adjust 直接建立 formal version。 | pass |
| formal version -> consumption | formal version ref / availability hint。 | Query 或 list 隐式准备消费材料。 | pass |
| consumption -> trace / impact / protection | trace subject hint / material refs / boundary block summary。 | 下游运行状态反写 core truth。 | pass |
| relation / distribution -> peripheral | relation / distribution ref 作为 package / set 成员或 context。 | package / marketplace 改 relation truth。 | pass |
| external -> formalization / trace / peripheral | safe summary / source ref / archive marker。 | external body / artifact body / governance body 入仓。 | pass |
| maintenance -> all read material | refreshed material refs / progress / issue refs。 | maintenance job 修复核心 truth 或重做正式化。 | pass |
| outbound event candidates | fact-ref / summary-ref / marker-ref 级候选。 | topic / payload schema / relay / outbox / checkpoint。 | pass |

#### 5.21.4 未展开处理流审计

| 未独立展开项 | 处理口径 | 是否充分 |
|---|---|---|
| 普通 definition / catalog / version / trace / relation / external / package 读取 | 走通用 Query 读路径。 | pass |
| 普通 package / method set list / get | 走通用 Query 读路径,另行标注 no payload / no fulfillment。 | pass |
| Outbound event delivery | 只保留事件候选产生说明。 | pass |
| Worker / scheduler / queue / retry | 不属于概要 Step 8,后续实施或运维文档再闭口。 | pass |
| Repository / transaction / idempotency storage | 当前只表达 repository boundary 和 replay summary,详细设计再展开。 | pass |
| Error code / public protocol schema | 当前只写 safe result / reason / issue refs,详细设计和协议文档再展开。 | pass |

停审记录:

- 接口覆盖是否闭合: pass。Step 7 接口均有处理流口径。
- 对象 owner 是否漂移: pass。没有让 job、query、peripheral 或 external flow 改写核心 truth。
- 接缝是否可追溯: pass。跨部分连接均以 typed ref、summary、marker、hint 或 issue ref 表达。
- 是否越层补实现: pass。未写完整调用链、port trait、repository、SQL、topic、payload、worker、retry、report schema 或错误码全集。
- 下一步: 进入“旧材料差异审计”。

### 5.22 旧材料差异审计

审计输入:

- 旧 `projects/L3-method-library/design-calibration/02_hld_step_08_processing_flows.md` 的 HEAD 版本。
- 旧 `projects/L3-method-library/02-概要设计.md`。
- 历史 `projects/L3-method-library/design-calibration/03_ddd_step_*.md` 中与处理流相关的材料。

审计结论:

- 旧材料主线是 `MethodContent` draft / review / publish / supersede / retire,并配套 snapshot、outbox、fingerprint、projection rebuild、outbox relay 和 P1 plugin/configuration。该主线不再作为本轮 Step 8 的处理流来源。
- 当前 Step 8 主线已经改为本轮 Step 5/6/7 的方法资产定义、正式化与版本、受控消费、追溯一致性、关系分发、外部摘要、后台维护和外围组织。
- 旧 snapshot / outbox / fingerprint 只作为污染审计关键词出现,未进入当前处理流图、接口覆盖表或对象 owner 表。
- 旧 P1 `MethodPlugin` / `MethodConfiguration` / `EffectiveContentSet` 未恢复为核心处理流;当前外围增强由 `MethodPackage`、`MethodSetAssembly` 和 `PackageCompositionRule` 承接。

#### 5.22.1 旧处理流替换表

| 旧材料处理流 / 主语 | 当前处理口径 | 结果 |
|---|---|---|
| `CreateMethodContentDraft` / `UpdateMethodContentDraft` | 替换为 `EstablishMethodAssetDefinition` / `AdjustMethodAssetDefinition`。 | pass |
| `PublishMethodContent` / governance gate publish | 替换为 `EvaluateMethodAssetFormalization` 和 `EstablishFormalMethodAssetVersion` 的显式拆分。 | pass |
| `SupersedeMethodContent` / `RetireMethodContent` | 替换为 formal version semantic change / retire flow。 | pass |
| `DefinitionSnapshot` / snapshot export | 不恢复为当前 Step 8 主链;外部 archive 只用 `ArtifactArchiveRef` marker/ref。 | pass |
| `OutboxEvent` / outbox relay / replay | 不恢复为可靠投递机制;仅保留 outbound event candidate 产生说明。 | pass |
| `Fingerprint` / recalculate fingerprint | 不恢复为版本判断依据;版本语义变化用显式 reason / marker。 | pass |
| `RebuildDefinitionIndex` | 替换为 read material refresh / trace material refresh / maintenance progress。 | pass |
| `MethodPlugin` / `MethodConfiguration` / `EffectiveContentSet` | 替换为 peripheral package / method set 组织语义。 | pass |

#### 5.22.2 当前文件污染检查

| 关键词 / 旧概念 | 当前出现方式 | 是否污染 |
|---|---|---|
| `MethodContent` | 只在本轮口径、禁止事项、旧材料差异审计中出现。 | no |
| `publish` | 只在旧 publish 禁止恢复、formalization 不等于 publish 的说明中出现。 | no |
| `snapshot` | 只在禁止恢复旧 snapshot 或旧差异审计中出现。 | no |
| `outbox` | 只在禁止 topic / relay / reliable delivery / 旧 outbox 的说明中出现。 | no |
| `fingerprint` | 只在禁止旧 fingerprint / hash 作为版本依据的说明中出现。 | no |
| `MethodPlugin` / `MethodConfiguration` | 只在不恢复旧 P1 路径的说明中出现。 | no |

#### 5.22.3 后续承接提醒

| 后续 Step | 需要避免的旧材料污染 | 当前提醒 |
|---|---|---|
| Step 9 状态机 | 不恢复 MethodContent lifecycle、outbox state、snapshot state、fingerprint drift state。 | 状态词表必须从当前对象和处理流触发推导。 |
| Step 10 异常边界 | 不恢复 publish error、outbox relay error、snapshot export error 作为主线。 | 异常应按 formalization、consumption、external body、maintenance unavailable 等当前边界展开。 |
| Step 11 配置影响 | 不恢复 P1 plugin feature flag、fingerprint algorithm、outbox batch size 为当前主线。 | 只能识别当前 package/discovery、maintenance、external boundary 的配置影响轮廓。 |
| Step 12 详细设计承接 | 不把历史 DDD port / repository / outbox 直接回填。 | 详细设计必须从本轮 Step 5~11 重新推导。 |

停审记录:

- 是否完成后置审计: pass。已审计旧 Step 8、旧正式 02 和历史 DDD 处理流污染点。
- 是否让旧材料反推当前结论: no。旧材料只用于污染检查和替换表。
- 是否发现必须回滚当前 Step 8 的污染: no。当前处理流图未恢复旧 publish / snapshot / outbox / fingerprint / P1 plugin 主链。
- 下一步: 进入“自检与停审”。

### 5.23 自检与停审

#### 5.23.1 Step 8 完成门禁

| 门禁项 | 结果 | 说明 |
|---|---|---|
| 必读文档是否列出 | pass | 已列 SOP、书写规范、00、01、Step 5、Step 6、Step 7。 |
| 是否先搭整体模块 | pass | 已建立 Step 内计划、整体模块骨架和接口候选池。 |
| 是否逐模块先思考后写入 | pass | 8 个组成部分均按先思考、再写入推进。 |
| P0 Command 是否覆盖 | pass | 核心和外围 Command 均已独立展开或说明通用路径。 |
| Inbound 是否覆盖 | pass | 所有会形成本地 summary/ref/material linkage 的 inbound 均独立展开。 |
| Operations Job 是否覆盖 | pass | read material refresh、trace material refresh、consistency recovery 均独立展开。 |
| Query 取舍是否说明 | pass | 边界 Query 独立展开;普通 Query 使用通用读路径并说明原因。 |
| 对象是否来自 Step 6 | pass | 处理流只使用 Step 6 已收稳对象、typed ref、summary、policy、task 和 view。 |
| 接口是否来自 Step 7 | pass | 处理流覆盖当前 Step 7 接口骨架,未恢复旧接口。 |
| 是否避免详细设计下沉 | pass | 未写完整 Rust 签名、port trait、repository、SQL、topic、payload、worker、retry 或错误码全集。 |
| 旧材料审计是否完成 | pass | 已后置审计旧 MethodContent / publish / snapshot / outbox / fingerprint / P1 plugin 污染。 |

#### 5.23.2 Step 9 承接输入

| Step 9 需要承接的状态主题 | Step 8 触发来源 |
|---|---|
| definition / catalog 状态 | establish / adjust definition;register / reclassify catalog。 |
| formalization / formal version 状态 | evaluate formalization;establish / change / retire formal version;basis summary inbound。 |
| consumption / availability / boundary 状态 | prepare consumption material;record boundary block;availability read。 |
| trace / impact / protection / audit 状态 | prepare trace;accept impact;evaluate protection;record audit;inbound marker。 |
| relation / distribution 状态 | propose / activate relation;establish / limit / retire distribution;integrity check。 |
| external summary / ref 状态 | accept external summary;register refs;reject body;external inbound。 |
| maintenance task / progress 状态 | read refresh;trace refresh;recovery;progress / issue Query。 |
| package / method set peripheral 状态 | create / adjust package;create / adjust assembly;discovery unavailable。 |

#### 5.23.3 停审结论

| 项 | 结论 |
|---|---|
| Step 8 状态 | completed |
| gate_status | pass |
| blocker | none |
| next_allowed_action | 进入 `02_hld_step_09_state_machine.md` 的“必读文档读取 / 整体模块搭建”,不得跳到 Step 10 或正式 `02-概要设计.md` 装配。 |

---

## 6. 当前停审

| 检查项 | 当前状态 | 说明 |
|---|---|---|
| 是否已先读取恢复点 | pass | 已读取项目台账、文档 flow 和 Step 7 完成门禁。 |
| 是否已读取 Step 8 规范 | pass | 已读取 SOP Step 8 和书写规范 4.8。 |
| 是否已重写旧 Step 8 | pass | 旧 `MethodContent` / publish / snapshot / outbox / fingerprint 处理流已从当前文件移除。 |
| 是否已搭建 Step 8 框架 | pass | 已建立 Step 内计划、整体模块骨架和接口到处理流候选池接收表。 |
| 是否已完成接口到处理流候选池 | pass | 已形成独立 / 可能独立 / 通用路径 / 统一事件说明的覆盖清单。 |
| 是否已完成通用处理流骨架 | pass | 已形成 Command / Query / Inbound / Operations Job / Outbound Event 候选的通用处理流骨架。 |
| 是否已完成方法资产定义与目录处理流 | pass | 已完成 definition / catalog Command、typed ref resolution Query、普通 Query 取舍和事件候选说明。 |
| 是否已完成正式化与版本处理流 | pass | 已完成 formalization evaluation、formal version establish、semantic change、retire 和 basis inbound 处理流。 |
| 是否已完成受控消费处理流 | pass | 已完成 consumption material prepare、boundary block、material resolution、availability 和 boundary 处理流。 |
| 是否已完成追溯与一致性保护处理流 | pass | 已完成 trace、impact、protection、audit、impact inbound 和 evidence marker inbound 处理流。 |
| 是否已完成关系与分发语义处理流 | pass | 已完成 relation propose/activate、distribution establish/limit 和 relation integrity 处理流。 |
| 是否已完成外部摘要与引用处理流 | pass | 已完成 external summary/ref/archive/body boundary、external inbound 和 external ref resolution 处理流。 |
| 是否已完成后台维护与收敛处理流先思考 | pass | 已完成 refresh / recovery job 与 maintenance Query 的展开判断。 |
| 是否已完成后台维护与收敛处理流 | pass | 已完成 read material refresh、trace material refresh、consistency recovery、maintenance progress、task summary 和 pending issue 处理流。 |
| 是否已完成外围包与方法集组织处理流先思考 | pass | 已完成 package / set Command、peripheral discovery Query 和外围事件候选判断。 |
| 是否已完成外围包与方法集组织处理流 | pass | 已完成 package / set create / adjust、peripheral discovery、普通 Query 和事件候选说明。 |
| 是否已完成跨处理流一致性审计 | pass | 已完成接口覆盖、对象 owner、接缝副作用和未展开处理流审计。 |
| 是否已完成旧材料差异审计 | pass | 已确认旧 MethodContent / publish / snapshot / outbox / fingerprint / P1 plugin 主线未污染当前处理流。 |
| 是否已完成 Step 8 自检与停审 | pass | Step 8 完成门禁通过,已形成 Step 9 状态主题承接输入。 |
| 是否提前修改正式 `02-概要设计.md` | no | 正式文档只在 Step 14 装配。 |
| 是否使用旧材料反推当前结论 | no | 旧 Step 8 和历史 DDD 只作后置差异审计。 |

当前停审:

```text
Step 8 关键处理流 / 重要函数数据流已完成。
下一步只允许进入 Step 9 `02_hld_step_09_state_machine.md` 的必读文档读取和整体模块搭建。
不得直接跳到 Step 10 或正式 `02-概要设计.md` 装配。
```

---

## R1. Step 8 全量重审开工

### R1.1 开工与必读文档:先思考

#### R1.1.1 当前问题判断

- 当前项目级台账和文档级 flow 已把恢复点推进到 Step 8 `开工与必读文档:先思考`;因此现在允许启动 Step 8,但不允许直接写处理流正文。
- 本文件既有 5.x / 6.x 完成态早于正式 §7 的 `R1.45` 回填记录,只能作为 historical material 和后置差异审计输入,不能作为当前 Step 8 completed 结论继续使用。
- 正式 `02-概要设计.md` 的 §7 已回填,但正式 §8 仍是旧材料,仍含旧 `MethodContent` / publish / snapshot / outbox / fingerprint 主线风险。当前 Step 8 必须以 Step 5 / Step 6 / Step 7 当前结论为第一来源重新讨论。
- 现有 Step 8 historical 内容虽然已尝试转向新主线,但接口名、处理流族和 Step 7 `R1.24`~`R1.45` 的正式 §7 口径仍需重新对齐。例如 Step 8 旧段中出现的 `EvaluateMethodAssetFormalization`、`AcceptExternalSourceSummary`、`RefreshMethodAssetReadMaterials` 等名称,需要回到 Step 7 当前 Command / Inbound / Job 骨架核对,不能直接继承。
- 本轮 Step 8 的重点不是尽量多画流程图,而是先建立“哪些接口必须独立处理流、哪些走通用路径、哪些只做统一事件产生说明”的选择规则,再按八个主要组成部分逐模块先思考、后写入。

#### R1.1.2 必读文档初步清单

| 顺序 | 文档 | 读取重点 | 对 Step 8 的约束 |
|---:|---|---|---|
| 1 | `design-calibration/project_execution_ledger.md` | 项目级恢复点、当前 gate 和 next_allowed_action。 | 确认当前只允许 Step 8 `开工与必读文档:先思考`,不得进入 Step 9 或正式 §8 回填。 |
| 2 | `design-calibration/02_hld_calibration_flow.md` | 文档级 Step 状态、Step 7 回填记录、Step 8 开工门禁和 §8~§9 blocker。 | Step 8 必须从 `ready_for_opening` 开始,不得沿用既有 completed 记录。 |
| 3 | `standards/document/概要设计讨论流程_SOP.md` Step 8 | Step 8 目标、输入、输出、应问问题、独立处理流选择规则和停审要求。 | P0 Command、改写本地状态的 Inbound、影响一致性的 Operations Job 必须画独立处理流。 |
| 4 | `standards/document/概要设计书写规范.md` 4.8 | ASCII 图格式、关键设计点格式、函数参数类型骨架和禁止下沉内容。 | 图中点名函数调用时参数必须写 `TypeName param_name`;不得写完整签名、SQL、错误码、retry 或 topic/payload。 |
| 5 | `standards/document/设计文档讨论中间产物规范.md` | 模块级先思考后写入、长文档分批、台账恢复和历史材料后置审计。 | Step 8 不能一次性写完成稿;必须先搭整体模块,再逐模块先思考、后写入。 |
| 6 | `standards/document/设计真相源闭环与可落码性标准.md` | 防止处理流引入缺对象、缺接口、缺状态 / schema / port 来源的实现 blocker。 | 处理流只能使用 Step 5 / Step 6 / Step 7 已闭合主语;发现缺口时回退上游,不得在 Step 8 私造。 |
| 7 | `projects/L3-method-library/00-需求文档.md` | 核心能力闭环、业务规则、数据所有权、接口依赖和验收方向。 | 处理流必须服务定义、正式化、受控消费、追溯一致性、外部摘要、维护和外围隔离。 |
| 8 | `projects/L3-method-library/01-架构设计.md` | 职责边界、数据所有权、一致性策略、交互通信和后台维护边界。 | 不得把下游运行 truth、外部正文、marketplace 交易履约或 UI 状态写入本仓处理流。 |
| 9 | `design-calibration/02_hld_step_05_components_boundary.md` | 八个主要组成部分、capability、接缝和 Step 8 承接矩阵。 | 处理流必须按主要组成部分归属,不得按 repository、worker、adapter 或旧模块归属。 |
| 10 | `design-calibration/02_hld_step_06_key_objects.md` 及五个对象附录 | Step 6 对象、typed ref、summary、policy、guard、view、material、task、history、lineage。 | 每个处理流点名对象必须能在 Step 6 找到来源;不得恢复旧 `MethodContent` / snapshot / outbox / fingerprint。 |
| 11 | `design-calibration/02_hld_step_07_api_interface_skeleton.md` `R1.24`~`R1.45` | 当前接口总表、接口到组成部分映射、跨接口审计、正式 §7 回填记录。 | Step 8 必须从当前 Step 7 接口筛选处理流;接口名和边界不得沿用旧 Step 8。 |
| 12 | `projects/L3-method-library/02-概要设计.md` §7 / §8 | §7 当前正式接口骨架与 §8 旧材料污染边界。 | §7 可作为正式输入;§8 只能作为后置差异审计对象。 |
| 13 | `projects/L1-governance/design-calibration/02_hld_step_08_processing_flows.md` | 成熟 Step 8 的问题回答、覆盖选择、通用流、处理流族和自检结构。 | 只参考框架深度和章节顺序,不得复制 Governance 领域语义。 |
| 14 | 本文件既有 5.x / 6.x 内容 | 已有处理流候选、旧污染排除和名称漂移线索。 | 只能在新候选池形成后做差异审计,不得作为当前第一来源。 |

#### R1.1.3 Step 8 重审框架取舍

| 取舍点 | 当前判断 | 理由 |
|---|---|---|
| 是否整体重审 Step 8 | yes | 正式 §7 已回填,正式 §8 仍旧,且本文件旧完成态早于 `R1.45`。 |
| 是否直接删除既有 Step 8 内容 | no | 既有内容保留为 historical material,用于后置差异审计和命名漂移检查。 |
| 是否直接写正式 §8 | no | 必须先完成 Step 8 中间产物、审计、自检和正式 §8 回填草稿。 |
| 是否继承 L1-governance 语义 | no | 只参考框架,不复制 Governance 对象、接口或流程。 |
| 是否所有 Query 都画独立图 | no | 简单 read path 用通用读路径;含 resolution、availability、integrity、protection、fallback、stale / unavailable 的 Query 才进入独立候选。 |
| 是否每个 Command 都单独画图 | not_all_mechanical | P0 / 改写 truth / 改写 material 的 Command 必须覆盖;同构调整类可以共用流族,但必须列明覆盖接口和差异点。 |
| 是否展开 Outbound relay | no | Step 8 只说明事件候选产生来源;topic、payload、outbox、relay、retry、dead letter 留给后续重新闭口。 |

#### R1.1.4 下一批写入边界

下一批 `R1.2 开工与必读文档:再写入` 只允许写:

1. Step 8 文件头当前有效状态和 historical material 边界。
2. 必读文档表。
3. Step 内模块计划,至少包含:
   - 开工与必读文档
   - L1-governance 框架对齐
   - 接口到处理流候选池
   - 通用处理流骨架
   - 八个主要组成部分处理流小循环
   - 跨处理流一致性审计
   - 旧材料差异审计
   - 正式 §8 回填草稿
   - 自检与停审
4. 历史材料边界和当前禁止动作。
5. 本模块停审记录。

下一批不得写具体处理流图、不得写处理流覆盖总表正文、不得修改正式 `02-概要设计.md`,不得进入 Step 9。

#### R1.1.5 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否按台账进入 Step 8 | pass | 项目台账和 flow 均指向 Step 8 `开工与必读文档:先思考`。 |
| 是否识别旧 Step 8 完成态 | pass | 既有 5.x / 6.x 完成态降级为 historical material。 |
| 是否列出必读文档 | pass | 已列公共规范、本仓 00/01/Step 5/6/7、正式 §7/§8、L1-governance 框架和本文件历史内容。 |
| 是否只做先思考 | pass | 未写具体处理流图、覆盖总表正文或正式 §8。 |
| 是否进入 Step 9 | no | 当前仍停在 Step 8 开工。 |

next_allowed_action: 等待用户确认后进入 Step 8 `开工与必读文档:再写入`;只写当前有效文件头、必读文档表、Step 内模块计划和历史材料边界,不得写具体处理流图,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.2 开工与必读文档:再写入

#### R1.2.1 当前有效状态

| 项 | 记录 |
|---|---|
| Step | Step 8 关键处理流 / 重要函数数据流 |
| 当前状态 | full_recheck_opening |
| 当前有效恢复点 | Step 8 `L1-governance 框架对齐:先思考` |
| 第一来源 | 当前 Step 5 组成部分、Step 6 关键对象、Step 7 `R1.24`~`R1.45` 接口骨架和正式 §7。 |
| historical material | 本文件既有 5.x / 6.x 完成态、旧正式 §8、历史 `03_ddd_*`。 |
| 当前禁止动作 | 不直接写具体处理流图;不写处理流覆盖总表正文;不修改正式 `02-概要设计.md`;不进入 Step 9。 |

#### R1.2.2 必读文档表

| 顺序 | 文档 | 读取重点 | 对 Step 8 的约束 |
|---:|---|---|---|
| 1 | `design-calibration/project_execution_ledger.md` | 项目级恢复点、gate_status、next_allowed_action。 | 当前只能从 Step 8 开工恢复,不得直接沿用本文件旧 completed 结论。 |
| 2 | `design-calibration/02_hld_calibration_flow.md` | 文档级恢复点、Step 7 回填记录、Step 8 门禁、§8~§9 blocker。 | Step 8 必须按 R1 重审,不从旧正式 §8 反推。 |
| 3 | `standards/document/概要设计讨论流程_SOP.md` Step 8 | 通用处理流、处理流清单、关键接口 ASCII 图、未展开取舍、停审和跨处理流审计。 | P0 Command、改写本地状态的 Inbound、影响一致性的 Operations Job 必须画独立处理流。 |
| 4 | `standards/document/概要设计书写规范.md` 4.8 | ASCII 图格式、关键设计点、函数参数类型骨架和禁止下沉内容。 | 图中点名函数调用时参数必须写 `TypeName param_name`;不写完整 Rust 签名、SQL、错误码、retry、topic 或 payload。 |
| 5 | `standards/document/设计文档讨论中间产物规范.md` | 先搭整体模块、逐模块先思考后写入、历史材料后置审计、长文档分批。 | Step 8 不得一次性写完成稿;单次 patch 行数不等于文件总长度上限。 |
| 6 | `standards/document/设计真相源闭环与可落码性标准.md` | 避免处理流缺对象、缺接口、缺状态 / schema / port 来源而把缺口推给实现端。 | 处理流只能使用 Step 5 / Step 6 / Step 7 已闭合主语;缺口必须回退上游。 |
| 7 | `projects/L3-method-library/00-需求文档.md` | 核心能力闭环、功能需求、业务规则、数据所有权和接口依赖。 | 处理流必须守住定义、正式化、消费、追溯、一致性、外部摘要、维护和外围隔离。 |
| 8 | `projects/L3-method-library/01-架构设计.md` | 职责边界、限界上下文、数据所有权、一致性、交互通信和后台维护。 | 不得把下游运行 truth、外部正文、marketplace 交易履约或 UI 状态写入本仓处理流。 |
| 9 | `design-calibration/02_hld_step_05_components_boundary.md` | 八个主要组成部分、capability、对象发现和 Step 6~9 承接矩阵。 | 处理流必须按主要组成部分归属,不得按 repository、worker、adapter 或旧模块归属。 |
| 10 | `design-calibration/02_hld_step_06_key_objects.md` 及五个对象附录 | Step 6 对象、typed ref、summary、policy、guard、view、material、task、history、lineage。 | 每个处理流点名对象必须能在 Step 6 找到来源。 |
| 11 | `design-calibration/02_hld_step_07_api_interface_skeleton.md` `R1.24`~`R1.45` | 当前接口总表、接口到组成部分映射、跨接口审计、正式 §7 回填记录。 | Step 8 必须从当前接口筛选处理流;接口名和边界不得沿用旧 Step 8。 |
| 12 | `projects/L3-method-library/02-概要设计.md` §7 / §8 | §7 当前正式接口骨架与 §8 旧材料污染边界。 | §7 可作为正式输入;§8 只能作为后置差异审计对象。 |
| 13 | `projects/L1-governance/design-calibration/02_hld_step_08_processing_flows.md` | 成熟 Step 8 的目标 / 输入、SOP 问题回答、通用处理流、处理流族、映射表、诊断、取舍、回填草稿和进入下一步条件。 | 只学习框架深度和章节顺序,不得复制 Governance 领域语义。 |
| 14 | 本文件既有 5.x / 6.x 内容 | 已有处理流候选、旧污染排除和名称漂移线索。 | 只能在当前 R1 候选池形成后做差异审计,不得作为第一来源。 |

#### R1.2.3 Step 内模块计划

| 顺序 | 模块 | 当前状态 | 产物 | gate_status | next_allowed_action |
|---:|---|---|---|---|---|
| 1 | 开工与必读文档:先思考 | done | `R1.1` 当前问题判断、必读文档初步清单、重审框架取舍。 | pass | 进入再写入。 |
| 2 | 开工与必读文档:再写入 | done | `R1.2` 当前有效状态、必读文档表、Step 内模块计划、历史材料边界。 | pass | 进入 L1-governance 框架对齐:先思考。 |
| 3 | L1-governance 框架对齐:先思考 | pending | 学习 L1-governance Step 8 的章节顺序、覆盖策略和停审结构。 | wait_user_confirm | 等待用户确认。 |
| 4 | L1-governance 框架对齐:再写入 | pending | L3 Step 8 采用 / 不采用框架裁决和最终章节顺序。 | blocked_by_prior | 待先思考完成。 |
| 5 | 接口到处理流候选池:先思考 | pending | 从 Step 7 五类接口筛选独立处理流、通用路径和统一事件说明。 | blocked_by_framework | 待框架对齐完成。 |
| 6 | 接口到处理流候选池:再写入 | pending | 处理流覆盖候选表和未展开取舍初稿。 | blocked_by_prior | 待先思考完成。 |
| 7 | 通用处理流骨架:先思考 | pending | Command / Query / Inbound / Operations Job / Outbound Event 候选通用骨架判断。 | blocked_by_candidates | 待候选池完成。 |
| 8 | 通用处理流骨架:再写入 | pending | 通用处理流 ASCII 图、适用规则和禁止事项。 | blocked_by_prior | 待先思考完成。 |
| 9 | 八个主要组成部分处理流小循环 | pending | 每个组成部分先思考、再写入关键处理流和停审记录。 | blocked_by_generic_flows | 待通用骨架完成。 |
| 10 | 接口到处理流族映射:先思考 / 再写入 | pending | 以 L1-governance 样式生成 `接口组 -> 处理流族` 映射。 | blocked_by_component_flows | 待组成部分小循环完成。 |
| 11 | 当前文档问题诊断与设计取舍:先思考 / 再写入 | pending | 旧正式 §8 / historical Step 8 问题诊断、改动前后对比、取舍。 | blocked_by_mapping | 待映射完成。 |
| 12 | 跨处理流一致性审计:先思考 / 再写入 | pending | 接口覆盖、对象引用、跨部分接缝、事务边界粒度和未展开理由审计。 | blocked_by_diagnosis | 待诊断完成。 |
| 13 | 旧材料差异审计:先思考 / 再写入 | pending | 旧 `MethodContent` / publish / snapshot / outbox / fingerprint / P1 处理流污染检查。 | blocked_by_cross_audit | 待跨处理流审计完成。 |
| 14 | 正式 §8 回填草稿:先思考 / 再写入 | pending | 正式 §8 可回填草稿,不直接修改正式文档。 | blocked_by_diff_audit | 待差异审计完成。 |
| 15 | 自检与停审:先思考 / 再写入 | pending | Step 8 完成门禁、Step 9 承接输入、flow / 台账推进建议。 | blocked_by_backfill_draft | 待回填草稿完成。 |

#### R1.2.4 L1-governance 框架学习约束

| 可学习内容 | L3 处理方式 |
|---|---|
| `目标 / 输入 -> SOP 问题回答 -> 通用处理流 -> 关键处理流 -> 映射 -> 诊断 / 取舍 -> 回填草稿 -> 进入下一步条件` 的章节链 | 采用为 Step 8 R1 主框架。 |
| 按处理流族覆盖多个同构接口,避免机械重复图 | 采用,但 L3 处理流族必须从 Step 7 当前接口和八个组成部分推导。 |
| Query 简单读路径与复杂授权 / stale / fallback 路径分开 | 采用,换成 L3 的 typed ref resolution、availability、integrity、protection、discovery、stale / unavailable 边界。 |
| Consumer / Job 不直接改核心 truth 的红线 | 采用,换成 L3 的 body-free inbound、read material refresh、trace material refresh、consistency recovery 和 peripheral refresh。 |
| Governance 对象、接口、outbox、policy、dashboard、GRC 语义 | 不采用,不得复制到 L3。 |

#### R1.2.5 历史材料边界

| 材料 | 当前用途 | 禁止事项 |
|---|---|---|
| 本文件既有 5.x / 6.x 完成态 | 后置差异审计、命名漂移检查、遗漏检查。 | 不作为当前 Step 8 completed 结论;不直接继承处理流名。 |
| 正式 `02-概要设计.md` §8 | 旧材料污染检查。 | 不作为当前处理流正文来源,不得局部修补旧 §8。 |
| 历史 `03_ddd_*` | 后置详细设计差异审计。 | 不反推概要处理流、对象、状态或接口。 |
| L1-governance Step 8 | 框架深度参考。 | 不复制领域语义、对象名、接口名或 outbox / governance 机制。 |

#### R1.2.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成开工再写入 | pass | 已写当前有效状态、必读文档表、Step 内模块计划和历史材料边界。 |
| 是否把 L1-governance 学习纳入流程 | pass | 已设为独立模块,并明确只学习框架。 |
| 是否写具体处理流图 | no | 本模块未写任何具体处理流正文。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8 开工阶段。 |

next_allowed_action: 等待用户确认后进入 Step 8 `L1-governance 框架对齐:先思考`;只学习并裁决框架结构,不得写具体处理流图,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.3 L1-governance 框架对齐:先思考

#### R1.3.1 学习目标

本模块只学习 `projects/L1-governance/design-calibration/02_hld_step_08_processing_flows.md` 的文件组织、章节深度、覆盖策略和停审结构,不复制 Governance 的领域语义、对象名、接口名、outbox 机制或 GRC / dashboard / compliance 处理流。

L1-governance Step 8 对 L3 有价值的不是具体流程内容,而是它把 Step 8 拆成四层:

1. 先回答 SOP 问题,明确 Command / Query / Inbound / Job 的处理边界。
2. 再建立通用处理流骨架,作为后续独立处理流的共同约束。
3. 再用“处理流族”覆盖多个同构接口,避免逐接口机械重复。
4. 最后用映射、诊断、取舍、回填草稿和进入下一步条件收口。

#### R1.3.2 L1-governance 框架结构拆解

| L1-governance 章节 | 框架作用 | L3 是否学习 | L3 调整方向 |
|---|---|---|---|
| 本步目标 | 明确 Step 8 只讲处理流骨架,不写 DTO / trait / SQL / retry / 测试。 | yes | 改写为 L3 方法资产定义、正式化、消费、追溯、外部摘要、维护、外围组织的处理流目标。 |
| 本步输入 | 列 Step 5/6/7、00/01 作为处理流输入。 | yes | 增加正式 §7 回填和旧 §8 historical 边界。 |
| SOP 问题回答 | 在正文前先回答 Command、Query、Inbound、Job、函数参数、取舍问题。 | yes | 必须覆盖 L3 的 Inbound body-free、Outbound event candidate、Operations Job no core truth repair。 |
| 通用处理流骨架 | 先画通用 Command 和 Query,作为后续流族模板。 | partial | L3 需要扩展为 Command / Query / Inbound / Operations Job / Outbound Event candidate 五类通用骨架。 |
| 关键接口处理流 | 用处理流族覆盖多个同构接口。 | yes | L3 应按八个主要组成部分和接口族生成流族,避免机械逐接口重复。 |
| 接口到处理流族映射 | 说明每组接口由哪个处理流族覆盖。 | yes | L3 必须从 Step 7 `R1.24`~`R1.32` 和 `R1.34` 映射反推,不能继承旧 Step 8 名称。 |
| 当前文档问题诊断 | 诊断旧正式文档缺口和本轮处理方式。 | yes | L3 要诊断旧 §8 的 publish / snapshot / outbox / fingerprint 污染。 |
| 改动前后对比 | 对比旧文档和新处理流粒度。 | yes | L3 用于说明从旧 `MethodContent` publish 主线改为当前方法资产主线。 |
| 设计取舍 | 解释为何不机械逐接口画图、为何不让 consumer / job 修 truth。 | yes | L3 要补 Query 取舍、Outbound event 不展开 relay、peripheral 不阻塞核心。 |
| 回填草稿 | 给正式 §8 后续装配草稿方向。 | yes | L3 必须先在中间产物形成草稿,不得直接改正式 §8。 |
| 待确认事项 | 区分概要不阻塞项和详细设计待闭口项。 | yes | L3 要把 DTO、port、transaction、event payload、job report 等推给 03,但不能掩盖概要缺对象 / 接口问题。 |
| 进入下一步条件 | 给 Step 9 状态机进入条件。 | yes | L3 必须明确 Step 9 状态 owner 来自 Step 6 对象和 Step 8 触发来源。 |

#### R1.3.3 L3 必须调整的框架点

| 调整点 | 原因 | L3 处理 |
|---|---|---|
| 通用骨架不能只写 Command / Query | L3 Step 7 已正式包含 Inbound Consumer、Outbound Event 和 Operations Job。 | 通用骨架必须包含 Command 写路径、Query 只读路径、Inbound body-free intake、Operations Job derived refresh / recovery、Outbound Event candidate production。 |
| 处理流族不能按 L1 governance 业务族 | L3 的主要组成部分是方法资产定义、正式化、消费、追溯、关系、外部摘要、维护、外围组织。 | 处理流族必须从八个主要组成部分和 Step 7 接口映射生成。 |
| Outbound Event 不等于 outbox | 正式 §7 明确不写 topic、payload schema、outbox、relay、retry、subscriber 或投递保证。 | Step 8 只写事件候选产生说明,不画 per-event relay flow。 |
| Inbound 必须 body-free | L3 外部摘要 / archive / boundary 只能承接 safe summary、typed ref、digest hint、marker、safe reason ref。 | Inbound 处理流必须先画 envelope / idempotency / body-free guard / local summary-ref linkage。 |
| Operations Job 不修 core truth | L3 job 只刷新派生材料、追溯材料、恢复收敛和外围读取材料。 | Job 处理流必须显式禁止修改 definition、formal version、relation、external summary 或 package truth。 |
| Query 不能刷新 material | 正式 §7 的 Query 边界是只读。 | 复杂 Query 只处理 resolution / availability / integrity / protection / discovery / stale / unavailable surface,不得刷新或修复。 |

#### R1.3.4 L3 预期章节链

下一批 `再写入` 应把 L3 Step 8 R1 的后续章节链裁决为:

1. 本步目标与输入。
2. SOP 问题回答。
3. 通用处理流骨架。
4. 接口到处理流候选池。
5. 八个主要组成部分处理流小循环。
6. 接口到处理流族映射。
7. 当前文档问题诊断。
8. 改动前后对比。
9. 设计取舍。
10. 跨处理流一致性审计。
11. 旧材料差异审计。
12. 正式 §8 回填草稿。
13. 待确认事项。
14. 进入下一步条件 / 自检与停审。

该顺序相较 L1-governance 多了“接口到处理流候选池”“八个主要组成部分处理流小循环”“跨处理流一致性审计”“旧材料差异审计”,原因是 L3 当前处于 full-restart,且正式 §8 仍有旧主线污染。

#### R1.3.5 下一批写入边界

下一批 `R1.4 L1-governance 框架对齐:再写入` 只允许写:

1. 框架采用 / 调整 / 禁止复制裁决表。
2. L3 Step 8 最终章节顺序。
3. L3 处理流族生成规则。
4. 本模块停审记录。

下一批不得写具体处理流图、不得写接口覆盖总表正文、不得修改正式 `02-概要设计.md`,不得进入 Step 9。

#### R1.3.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否读取 L1-governance Step 8 | pass | 已读取目标 / 输入、SOP 问题、通用骨架、关键流族、映射、诊断、取舍、草稿和进入条件。 |
| 是否只学习框架 | pass | 未复制 Governance 领域对象、接口或处理流。 |
| 是否给出 L3 调整点 | pass | 已明确 L3 需要扩展 Inbound / Outbound / Job 通用骨架和八个组成部分小循环。 |
| 是否写具体处理流图 | no | 本模块未写 L3 具体处理流图。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |

next_allowed_action: 等待用户确认后进入 Step 8 `L1-governance 框架对齐:再写入`;只写框架采用 / 调整 / 禁止复制裁决、最终章节顺序和处理流族生成规则,不得写具体处理流图,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.4 L1-governance 框架对齐:再写入

#### R1.4.1 框架采用 / 调整 / 禁止复制裁决表

| 框架项 | 裁决 | L3 落地方式 | 禁止事项 |
|---|---|---|---|
| 本步目标与输入 | 采用 | Step 8 R1 正文开头必须先写目标与输入,输入回指 Step 5 / Step 6 / Step 7、00 / 01、正式 §7 和旧 §8 historical 边界。 | 不把旧正式 §8 或历史 DDD 作为第一来源。 |
| SOP 问题回答 | 采用并扩展 | 必须先回答 Command、Query、Inbound、Outbound、Operations Job、函数参数类型、未展开取舍和主要组成部分归属问题。 | 不跳过问题回答直接画处理流图。 |
| 通用处理流骨架 | 调整采用 | L3 必须输出五类通用骨架:Command 写路径、Query 只读路径、Inbound body-free intake、Operations Job derived refresh / recovery、Outbound Event candidate production。 | 不只写 Command / Query;不展开 outbox relay。 |
| 关键接口处理流 | 采用处理流族策略 | 按八个主要组成部分和接口族生成处理流族,同构接口共用图但必须列明覆盖范围和差异点。 | 不机械为每个接口画重复图;不复制 Governance 流族。 |
| 接口到处理流族映射 | 采用 | 从 Step 7 `R1.24`~`R1.32` 五类总表和 `R1.34` owner 映射生成。 | 不继承本文件旧 5.x 处理流名。 |
| 当前文档问题诊断 | 采用 | 诊断旧正式 §8 和 historical Step 8 的 `MethodContent` / publish / snapshot / outbox / fingerprint / P1 污染。 | 不把诊断写成处理流正文。 |
| 改动前后对比 | 采用 | 对比旧 publish / snapshot / outbox 主线与当前 MethodAsset / FormalVersion / ConsumptionMaterial / TraceMaterial / ExternalSummary / Maintenance 主线。 | 不把旧主线作为并存方案。 |
| 设计取舍 | 采用 | 解释 Query 取舍、同构 Command 共用流族、Inbound body-free、Operations Job no truth repair、Outbound 不展开 relay、Peripheral 不阻塞核心。 | 不以“节省篇幅”为理由漏掉关键接口口径。 |
| 回填草稿 | 采用 | 在中间产物形成正式 §8 可回填草稿;实际修改正式文档必须等待用户确认和自检。 | 不在本模块修改正式 `02-概要设计.md`。 |
| 待确认事项 / 进入下一步条件 | 采用 | 区分概要 blocker 与详细设计待闭口项;进入 Step 9 前必须给出状态触发来源。 | 不把概要缺对象、缺接口、缺状态来源伪装成 03 待办。 |

#### R1.4.2 L3 Step 8 最终章节顺序

| 顺序 | 章节 / 模块 | 目标产物 |
|---:|---|---|
| 1 | 本步目标与输入 | 固定 Step 8 目标、输入和禁止下沉范围。 |
| 2 | SOP 问题回答 | 回答 Command / Query / Inbound / Outbound / Job 如何处理、哪些必须独立图、哪些可通用。 |
| 3 | 接口到处理流候选池 | 从 Step 7 当前接口筛选独立处理流、通用路径、统一事件说明和不展开理由。 |
| 4 | 通用处理流骨架 | 写五类通用 ASCII 图和适用规则。 |
| 5 | 八个主要组成部分处理流小循环 | 每个组成部分先思考、再写入处理流族、覆盖接口和停审记录。 |
| 6 | 接口到处理流族映射 | 汇总 `接口组 -> 处理流族 -> 说明`。 |
| 7 | 当前文档问题诊断 | 诊断正式 §8 和 historical Step 8 的旧主线污染、命名漂移和遗漏。 |
| 8 | 改动前后对比 | 说明从旧处理流主线到当前主线的变化。 |
| 9 | 设计取舍 | 记录不逐接口机械画图、Query 通用路径、Outbound relay 后置、Job no truth repair 等取舍。 |
| 10 | 跨处理流一致性审计 | 审计接口覆盖、对象引用、跨部分接缝、事务边界粒度、未展开理由。 |
| 11 | 旧材料差异审计 | 后置审计旧 `MethodContent` / publish / snapshot / outbox / fingerprint / P1 污染。 |
| 12 | 正式 §8 回填草稿 | 形成可回填草稿,不直接修改正式文档。 |
| 13 | 待确认事项 | 区分概要 blocker 和详细设计待闭口项。 |
| 14 | 进入下一步条件 / 自检与停审 | 给出 Step 9 状态机承接输入、flow / 台账推进建议。 |

#### R1.4.3 处理流族生成规则

| 规则 | 内容 | 检查方式 |
|---|---|---|
| 来源规则 | 处理流族必须从 Step 7 当前接口、Step 6 对象和 Step 5 组成部分共同生成。 | 每个处理流族必须列接口来源、对象来源和组成部分 owner。 |
| Command 规则 | 改写 truth、formal boundary、material、summary、task 或 peripheral truth 的 Command 必须有独立或同构独立处理流。 | 覆盖表中不得出现无理由遗漏的 Command。 |
| Query 规则 | 简单读取 summary / view / material 可走通用读路径;含 resolution、availability、integrity、protection、discovery、stale / unavailable 的 Query 必须独立或轻量独立说明。 | 每个 Query 必须标注通用 / 独立 / 不展开理由。 |
| Inbound 规则 | 会形成本地 summary/ref/material/linkage 的 body-free Inbound 必须独立处理流。 | 每个 Inbound 必须经过 envelope、dedup、body-free guard、local linkage、result surface。 |
| Outbound 规则 | Outbound Event 只说明 candidate production,不定义 topic、payload schema、outbox、relay、retry 或 delivery state。 | 不允许出现 per-event relay flow。 |
| Job 规则 | 影响读取一致性、追溯材料、恢复收敛或外围读取材料的 Operations Job 必须独立处理流。 | Job 图必须显式写 no core truth repair。 |
| Peripheral 规则 | 外围 package / method set / discovery 处理流不得成为核心定义、正式化、消费或追溯的前置。 | 每个 peripheral flow 必须写 non-blocking core boundary。 |
| 函数参数规则 | 若处理流点名函数调用,参数必须写 `TypeName param_name`。 | 自检时抽查所有函数调用骨架。 |
| 下沉禁止规则 | 不写完整 DTO、port trait、repository signature、SQL / DDL、错误码全集、retry、topic、payload、worker loop。 | 跨处理流审计和自检时检查。 |

#### R1.4.4 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成框架裁决 | pass | 已写采用 / 调整 / 禁止复制裁决表。 |
| 是否给出最终章节顺序 | pass | 已固定 14 个后续章节 / 模块顺序。 |
| 是否给出处理流族生成规则 | pass | 已给出来源、Command、Query、Inbound、Outbound、Job、Peripheral、参数和下沉禁止规则。 |
| 是否写具体处理流图 | no | 本模块未写任何具体处理流图。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `接口到处理流候选池:先思考`;只思考如何从 Step 7 当前接口筛选独立处理流、通用路径、统一事件说明和不展开理由,不得直接写候选池正文,不得写具体处理流图,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.5 接口到处理流候选池:先思考

#### R1.5.1 问题回答

- 本模块只思考“接口到处理流候选池”的筛选口径,不直接写候选池正文,不画具体处理流图,不修改正式 `02-概要设计.md` §8。
- 候选池的第一来源是 Step 7 当前接口集合:`R1.24` 58 个 Command、`R1.26` 57 个 Query、`R1.28` 4 个 Inbound Consumer、`R1.30` 34 个 Outbound Event、`R1.32` 8 个 Operations Job,以及 `R1.34` 八个主要组成部分 owner 映射。
- 候选池不是逐接口机械画图清单。它要先把接口归入四类:独立处理流、通用路径、统一事件说明、不展开但需给理由。
- 独立处理流的判断依据是“是否改写本仓 truth / boundary / material / task / peripheral truth、是否承接 body-free 外部事实、是否影响读取一致性或恢复收敛、是否存在关键保护 / 可用性 / 不可用 / stale 分支”。
- 通用路径用于同构且无特殊分支的读取、标记和摘要化路径;但通用路径仍必须在后续候选池中说明覆盖哪些接口组,不能以“通用”作为遗漏理由。
- 统一事件说明只覆盖 Outbound Event candidate production。Step 8 可以说明事件候选从 accepted Command、completed Job 或派生材料状态变化产生,但不得展开 topic、payload schema、outbox、relay、retry 或 delivery state。
- 不展开项必须有正式理由,例如简单只读、同构 Command 已被某处理流族覆盖、事件只做 candidate production、外围发现不阻塞核心闭环、后续留给详细设计而非概要处理流。

#### R1.5.2 五类接口筛选口径

| 接口类别 | 当前来源 | 筛选到独立处理流的条件 | 可走通用路径的条件 | 不得做的事 |
|---|---|---|---|---|
| Command | `R1.24`;`R1.34` | 改写 definition、catalog、formalization、formal version、consumption material、boundary、trace、relation、external summary、maintenance request、package / assembly 等本仓拥有对象。 | 同一组成部分内只差 change kind / reason / marker 的 Command 可归入同构处理流族。 | 不把 Command 写成 worker 执行、event relay、query read path 或下游运行同步。 |
| Query | `R1.26`;`R1.34` | 含 typed ref resolution、availability、integrity diagnostic、protection diagnostic、discovery、freshness、unavailable、stale 或 boundary diagnostic 的 Query 需要独立或轻量独立说明。 | 简单 summary / view / material / history / lineage / progress 读取可走通用只读路径。 | 不在 Query 中刷新 material、修复 truth、补写摘要、创建对象或读取外部正文。 |
| Inbound Event Consumer | `R1.28`;`R1.34` | 4 个 body-free Consumer 均需要独立 intake 流或共享一个明确的 inbound intake 流族。 | envelope、dedup、body-free guard、local linkage、result surface 可共用一套通用骨架。 | 不接收 raw body、artifact 包体、下游运行状态,不直接创建 core truth。 |
| Outbound Event | `R1.30`;`R1.34` | 通常不画 per-event 独立流程;仅在源头处理流中说明 event candidate production。 | 34 个事件按事件族统一说明来源、输出边界和禁止下沉。 | 不写 topic、payload、outbox、relay、投递状态、subscriber 或 retry。 |
| Operations Job | `R1.32`;`R1.34` | 8 个 Job 均影响 read material、trace material、recovery convergence 或 peripheral material,需要独立或 job-family 处理流。 | 同属 read material refresh 的 job 可共用刷新骨架,但必须列差异点和 no core truth repair。 | 不修 definition / formal version / relation / external summary / package truth,不写 worker loop 或 scheduler。 |

#### R1.5.3 八个主要组成部分的候选池作用

| 主要组成部分 | 候选池作用 | 处理流筛选重点 |
|---|---|---|
| 方法资产定义与目录 | core asset / catalog 写读入口来源。 | definition / catalog Command 应进入独立或同构写流;catalog view Query 可走通用读或 freshness 轻量流。 |
| 正式化与版本 | formalization / formal version 关键闭环来源。 | 资格判断、正式化发起、正式版本建立 / 替代 / 退役应形成关键流族;basis 读取只读。 |
| 受控消费 | consumption material、boundary、availability 来源。 | consumption material 准备、boundary violation 和 availability 读取需要重点覆盖。 |
| 追溯与一致性保护 | trace、impact、protection、audit、lineage 来源。 | trace / impact / protection / audit 需要保护原始正文不入仓,复杂 Query 需独立说明。 |
| 关系与分发语义 | relation、distribution、integrity 来源。 | relation 写流和 integrity / distribution availability 分支需要进入候选池。 |
| 外部摘要与引用 | 唯一 Inbound owner 和 external summary/ref 来源。 | body-free intake、external body boundary、basis acceptance 是关键处理流候选。 |
| 后台维护与收敛 | 唯一 Operations Job owner。 | maintenance request 与 8 个 job flow 必须说明 no core truth repair。 |
| 外围包与方法集组织 | peripheral package / method set 来源。 | package / assembly 写流和 peripheral view 读取需说明 non-blocking core boundary。 |

#### R1.5.4 候选池四类裁决规则

| 裁决类别 | 定义 | 后续 R1.6 写法 |
|---|---|---|
| 独立处理流 | 必须在 Step 8 后续写独立或处理流族图的接口组。 | 写接口组、owner、来源接口、对象来源、为什么独立、预计处理流族。 |
| 通用路径 | 可由 Command / Query / Inbound / Job 通用骨架覆盖的接口组。 | 写适用通用骨架、覆盖接口组、差异点和不单独画图理由。 |
| 统一事件说明 | Outbound Event candidate production 统一说明。 | 写事件族、源头 Command / Job / material state、输出边界和不展开 relay 理由。 |
| 不展开但需理由 | 当前 Step 8 不画图,但必须解释为何不画。 | 写不展开理由,例如简单只读、同构覆盖、详细设计后置、非概要处理流。 |

#### R1.5.5 R1.6 候选池写入结构

下一批 `R1.6 接口到处理流候选池:再写入` 应只写候选池和未展开取舍,建议结构为:

1. `候选池写入说明`:说明候选池不等于最终处理流正文。
2. `五类接口筛选汇总表`:按 Command / Query / Inbound / Outbound / Operations Job 给出筛选结果数量和裁决类型。
3. `八个主要组成部分候选池表`:每行或每组只列接口组、owner、候选裁决、来源引用和理由。
4. `通用路径候选表`:列通用 Command / Query / Inbound / Job 骨架应覆盖的接口组。
5. `统一事件说明候选表`:列 Outbound Event 事件族和事件产生来源,不写 relay。
6. `不展开理由表`:列简单只读、同构覆盖、事件后置、详细设计后置或边界外原因。
7. `本模块停审记录`:确认未写具体流程图、未改正式 §8、未进入 Step 9。

#### R1.5.6 禁止动作和降级规则

| 项 | 裁决 | 理由 |
|---|---|---|
| 直接写具体 ASCII 处理流图 | exclude_current_module | 当前只做候选池先思考,图留给通用骨架和组成部分小循环。 |
| 直接列完整候选池正文 | exclude_current_module | 候选池正文留给 R1.6,本模块只定义筛选口径。 |
| 直接修改正式 §8 | exclude | 正式 §8 必须等中间产物、审计和回填草稿完成后再处理。 |
| 从旧正式 §8 继承 publish flow | exclude | 旧 `MethodContent` / publish / snapshot / outbox / fingerprint 主线已降级为 historical material。 |
| 把 Outbound Event 展开成 outbox 流 | exclude | 概要层只定义 event candidate production,不定义交付机制。 |
| 把 Query 写成 refresh / repair | exclude | Query 只读;刷新和恢复属于 Operations Job 或 bounded Command。 |
| 把 Operations Job 写成 truth repair | exclude | Job 只维护派生材料和收敛状态,不得修核心 truth。 |

#### R1.5.7 下一写入批次边界

下一批 `R1.6 接口到处理流候选池:再写入` 只允许写:

- 候选池写入说明。
- 五类接口筛选汇总表。
- 八个主要组成部分候选池表。
- 通用路径候选表。
- 统一事件说明候选表。
- 不展开理由表。
- 本模块停审记录。

下一批不得写具体处理流图,不得写函数调用骨架,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

#### R1.5.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写候选池正文、未画处理流图。 |
| 是否以 Step 7 当前接口为第一来源 | pass | 筛选口径只引用 `R1.24` / `R1.26` / `R1.28` / `R1.30` / `R1.32` / `R1.34` / `R1.45`。 |
| 是否覆盖五类接口 | pass | Command、Query、Inbound、Outbound、Operations Job 均有筛选规则。 |
| 是否覆盖八个主要组成部分 | pass | 已说明八个 owner 在候选池中的作用。 |
| 是否避免旧 §8 污染 | pass | 明确旧 publish / snapshot / outbox / fingerprint 不作为当前来源。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `接口到处理流候选池:再写入`;只写候选池筛选结果、通用路径候选、统一事件说明候选和不展开理由,不得写具体处理流图,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.6 接口到处理流候选池:再写入

#### R1.6.1 候选池写入说明

本模块只把 Step 7 当前接口筛选成处理流候选池,不写具体处理流图。后续 `通用处理流骨架` 才画五类通用路径,再由八个主要组成部分小循环写关键处理流族。

候选池采用四类裁决:

1. `独立处理流族`:后续必须写独立或同构处理流族。
2. `通用路径`:由通用 Command / Query / Inbound / Job 骨架覆盖。
3. `统一事件说明`:Outbound Event 只说明 candidate production,不画 relay。
4. `不展开但需理由`:当前 Step 8 不单独画图,但必须说明原因。

#### R1.6.2 五类接口筛选汇总表

| 接口类别 | 当前数量 | 主要裁决 | 覆盖方式 | 不展开边界 |
|---|---:|---|---|---|
| Command | 58 | 全部进入 `独立处理流族` 或同构写流族覆盖。 | 按八个主要组成部分组织,每个流族继承通用 Command 写路径。 | 不为每个 Command 机械画重复图;同构 adjust / retire / mark / link 类接口在流族中列差异点。 |
| Query | 57 | 27 个复杂读取进入轻量独立 / 重点说明候选,30 个简单读取走通用只读路径。 | typed ref resolution、availability、integrity、protection、discovery、freshness / unavailable 进入重点候选;summary / history / lineage / progress 简单读取走通用路径。 | Query 不刷新 material、不修 truth、不补写摘要、不读取外部正文。 |
| Inbound Event Consumer | 4 | 4 个 body-free Consumer 共用 `body-free inbound intake` 独立流族。 | envelope、dedup、body-free guard、local linkage、result surface 统一覆盖。 | 不直接创建 core truth,不接收 raw body / artifact body / downstream runtime state。 |
| Outbound Event | 34 | 全部进入 `统一事件说明`。 | 按 8 个事件族说明来源、输出边界和 no relay。 | 不画 per-event relay,不写 topic、payload schema、outbox、subscriber、retry 或 delivery state。 |
| Operations Job | 8 | 全部进入 `Operations Job 独立处理流族`。 | read material refresh、trace material refresh、consistency recovery、peripheral refresh 按 job family 覆盖。 | 不修 core truth,不写 worker loop、scheduler、queue、lock、retry 或 DDL。 |

#### R1.6.3 八个主要组成部分候选池表

| 主要组成部分 | 候选裁决 | 来源接口组 | 后续处理流族 | 理由 |
|---|---|---|---|---|
| 方法资产定义与目录 | `独立处理流族` + `通用读路径` + `统一事件说明` | definition / catalog Command;definition summary / catalog view Query;definition / catalog changed events。 | `MethodAssetDefinitionAndCatalogFlow`。 | definition / catalog 是核心 truth 起点;写流必须独立,简单读取可走通用 Query,事件只说明 fact changed。 |
| 正式化与版本 | `独立处理流族` + `轻量 Query 说明` + `统一事件说明` | eligibility / formalization / formal version Command;state / current version / diagnostic Query;formalization / version events。 | `FormalizationAndVersionFlow`。 | 正式化和版本决定可消费性,必须覆盖资格判断、建立、语义变化、替代和退役。 |
| 受控消费 | `独立处理流族` + `重点 Query 说明` + `统一事件说明` | boundary / consumption material / violation Command;availability / context / boundary diagnostic Query;consumption / boundary events。 | `ControlledConsumptionFlow`。 | consumption material、availability 和 definition-use guard 是下游消费安全边界,不能只靠通用读写。 |
| 追溯与一致性保护 | `独立处理流族` + `重点 Query 说明` + `统一事件说明` | trace / impact / protection / audit / lineage Command;trace / impact / protection diagnostic Query;trace / impact / audit events。 | `TraceConsistencyProtectionFlow`。 | trace、impact、protection、audit 和 lineage 需要同时守住 safe summary 与 no raw log / no body 边界。 |
| 关系与分发语义 | `独立处理流族` + `重点 Query 说明` + `统一事件说明` | relation / integrity / distribution Command;relation list / integrity / distribution Query;relation / distribution events。 | `RelationDistributionFlow`。 | relation truth、distribution ref 和 integrity 分支会影响消费和外围组织,需要独立说明。 |
| 外部摘要与引用 | `独立处理流族` + `Inbound intake 流族` + `统一事件说明` | external summary/ref/artifact/body boundary Command;4 个 Inbound Consumer;external summary/ref Query;external events。 | `ExternalSummaryReferenceFlow`。 | 本组成部分是唯一 Inbound owner,必须显式覆盖 body-free、dedup、boundary violation 和 local linkage。 |
| 后台维护与收敛 | `独立处理流族` + `Job 流族` + `通用进度读取` + `统一事件说明` | maintenance request Command;8 个 Operations Job;maintenance progress / task Query;maintenance events。 | `MaintenanceConvergenceFlow`。 | 维护请求与 Job 执行必须分开:Command 只登记请求,Job 只刷新派生材料和收敛状态。 |
| 外围包与方法集组织 | `独立处理流族` + `重点 Query 说明` + `统一事件说明` | package / method set / composition Command;package / assembly / discovery Query;peripheral events。 | `PeripheralPackageAssemblyFlow`。 | package / method set 是外围增强,需要说明 non-blocking core boundary,不得进入 marketplace 交易 / 安装 / 履约。 |

#### R1.6.4 通用路径候选表

| 通用路径候选 | 覆盖接口组 | 后续骨架要求 | 不单独画图理由 |
|---|---|---|---|
| 通用 Command 写路径 | 所有 Command 的 actor / metadata / idempotency / source ref / accepted-or-rejected shell。 | 后续只画一次通用 Command skeleton,各独立流族继承。 | 通用前置和结果壳同构,逐接口重复会稀释关键分支。 |
| 通用 Query 只读路径 | 30 个简单 summary / view / history / lineage / progress 读取。 | 后续只画一次 no-write / no-refresh / body-free read skeleton。 | 简单读取无独立状态推进,重点在只读边界。 |
| 通用 Inbound intake 路径 | 4 个 body-free Inbound Consumer。 | 后续画 envelope、dedup、schema/version、body-free guard、intake result。 | 四个 Consumer 的 intake 前置完全同构,差异留在输入 ref / marker。 |
| 通用 Job 执行边界 | 8 个 Operations Job 的 run / scope / task / progress 基线。 | 后续画 no core truth repair、source material load、derived material write、progress update。 | job 族共享执行边界,差异在 target material 与 recovery outcome。 |
| 通用 Outbound candidate production | 34 个 Outbound Event 的 ref / marker / trace context 输出。 | 后续只说明 source flow 产生 event candidate。 | Outbound 是事实边界,不是交付机制;per-event relay 不在概要层。 |

#### R1.6.5 统一事件说明候选表

| 事件族 | 数量 | 事件产生来源 | 后续说明方式 | 不展开 relay 理由 |
|---|---:|---|---|---|
| Core asset / catalog facts | 2 | definition / catalog accepted Command。 | 在 definition / catalog flow 末尾说明 fact changed candidate。 | relay、topic、payload 属详细设计或交付机制。 |
| Formalization / version facts | 4 | formalization decision、formal version establish / change / retire Command。 | 在 formalization flow 末尾说明 version fact candidate。 | 不把 event 当版本同步或下游状态迁移。 |
| Consumption / boundary facts | 4 | consumption material、availability、boundary、violation Command 或材料状态变化。 | 在 controlled consumption flow 中说明 availability / boundary candidate。 | 不声明下游已消费、已同步或已运行。 |
| Trace / impact / audit facts | 5 | trace / impact / protection / audit / lineage Command。 | 在 trace consistency flow 中说明 safe summary event candidate。 | 不输出 raw log、report body、evidence body。 |
| Relation / distribution facts | 5 | relation / integrity / distribution Command 或材料失效线索。 | 在 relation distribution flow 中说明 relation / distribution candidate。 | 不进入 marketplace 交易、推荐、安装或投递实现。 |
| External summary / ref facts | 5 | external summary/ref/artifact/body boundary Command 或 Inbound intake。 | 在 external summary flow 中说明 body-free candidate。 | 不携带外部正文、artifact 包体或 provider payload。 |
| Maintenance / convergence facts | 5 | maintenance request Command 或 Operations Job result。 | 在 maintenance flow 中说明 requested / changed / progress candidate。 | 不暴露 worker、queue、retry、lock 或 scheduler。 |
| Peripheral organization facts | 4 | package / method set / composition Command 或 peripheral view state。 | 在 peripheral flow 中说明 non-core peripheral candidate。 | 不表达 marketplace listing、order、install、fulfillment。 |

#### R1.6.6 不展开理由表

| 不展开对象 | 当前裁决 | 理由 |
|---|---|---|
| 58 个 Command 的逐接口完整图 | 不逐个画 | 按八个处理流族覆盖,同构 adjust / retire / mark / link 类接口只列差异点。 |
| 30 个简单 Query 的逐接口图 | 通用 Query 路径覆盖 | 简单读取只需说明 no write / no refresh / no body,不需要独立图。 |
| 34 个 Outbound Event 的 per-event relay | 统一事件说明 | 概要只定义 event candidate production,不定义 topic / payload / outbox / relay。 |
| worker / scheduler / queue / retry / lock | 不展开 | 属详细设计或实现机制,不是概要处理流。 |
| HTTP / RPC / DTO / port / repository / DDL | 不展开 | 属详细设计、协议契约或实现层。 |
| raw document / artifact body / report body / raw log | 不展开且禁止 | 与 body-free / safe summary 边界冲突。 |
| marketplace listing / transaction / install / fulfillment | 不展开且排除 | 不属于本仓 truth 或概要处理流范围。 |
| 旧 `MethodContent` publish / snapshot / fingerprint / outbox flow | 不继承 | 与当前 Step 5 / Step 6 / Step 7 新主线冲突,只作后置污染审计输入。 |

#### R1.6.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入候选池筛选结果 | pass | 已按五类接口、八个主要组成部分、通用路径、事件族和不展开理由写入。 |
| 是否避免具体处理流图 | pass | 未写 ASCII 流程图、函数调用骨架或事务步骤。 |
| 是否覆盖 Step 7 当前接口来源 | pass | 引用 `R1.24` / `R1.26` / `R1.28` / `R1.30` / `R1.32` / `R1.34` 的当前接口集合和 owner 映射。 |
| 是否保持 Outbound 只作事件候选 | pass | 34 个事件只进入统一事件说明,未写 relay / outbox / topic / payload。 |
| 是否保持 Query 只读 | pass | Query 被分为重点说明和通用只读,未引入 refresh / repair。 |
| 是否保持 Job 不修 core truth | pass | Job 候选明确只刷新派生材料和收敛状态。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `通用处理流骨架:先思考`;只思考 Command / Query / Inbound / Operations Job / Outbound Event candidate 五类通用骨架,不得写八个主要组成部分具体处理流图,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.7 通用处理流骨架:先思考

#### R1.7.1 问题回答

- 本模块只思考五类通用处理流骨架的写入口径,不直接写 ASCII 处理流图正文,不进入八个主要组成部分具体处理流。
- 通用骨架的作用是给后续处理流族提供共同约束:入口语境、typed ref、幂等、对象边界、只读 / 写入 / intake / job / event candidate 的分界,以及不得下沉的实现细节。
- 当前必须准备五类通用骨架:Command 写路径、Query 只读路径、Inbound body-free intake、Operations Job derived refresh / recovery、Outbound Event candidate production。
- 通用骨架不能替代后续八个主要组成部分处理流。R1.8 只负责画通用骨架;后续小循环仍需按 definition / catalog、formalization、consumption、trace、relation、external summary、maintenance、peripheral 分别讨论。
- 通用骨架要允许后续处理流族复用,但不能把对象字段、repository trait、transaction、SQL、错误码、retry、topic、payload、worker loop、scheduler 或 adapter 方案提前写死。
- 如果通用骨架发现需要 Step 6 对象或 Step 7 接口但当前没有,必须记录为上游缺口,不得在 Step 8 私自发明对象、port 或 DTO。

#### R1.7.2 五类通用骨架目标

| 通用骨架 | 目标 | 必须包含 | 必须禁止 |
|---|---|---|---|
| Command 写路径 | 约束所有写入口如何从 typed request 进入 application orchestration,再落到本仓拥有对象并形成 result / event candidate / refresh hint。 | actor / metadata / idempotency;typed ref 边界;load / decide / write / result;accepted / rejected surface。 | repository 签名、事务隔离、SQL、错误码全集、retry、worker 执行、event relay。 |
| Query 只读路径 | 约束读取入口只读取 summary / view / material / ref / diagnostic / progress。 | reader context;scope / subject / lookup ref;read source selection;not found / unavailable / stale / degraded surface。 | refresh、repair、create missing object、写 audit truth、读取 raw body、修 projection。 |
| Inbound body-free intake | 约束外部事实进入本仓时只承接 safe summary / typed ref / digest / marker。 | source envelope;source event id;schema/version;dedup;trace context;body-free guard;intake result。 | raw document、artifact body、provider payload、downstream runtime state、直接建 core truth。 |
| Operations Job derived refresh / recovery | 约束 job 从 run / scope / task ref 和已持久化事实出发,刷新派生材料或推进 recovery progress。 | maintenance run ref;refresh scope;task ref;source material refs;derived output;progress update;no core truth repair。 | 修改 definition / formal version / relation / external summary / package truth,worker loop、queue、lock、scheduler。 |
| Outbound Event candidate production | 约束事件只是 accepted result / completed job / material state 的 fact-ref candidate。 | source accepted result;typed refs;summary refs;marker;trace context;event family;handoff to later delivery design。 | topic、payload schema、outbox 表、relay、subscriber、partition key、dead letter、retry。 |

#### R1.7.3 图形写法约束

| 约束 | R1.8 写法 |
|---|---|
| 图数量 | 写 5 张 ASCII 骨架图,分别对应 Command / Query / Inbound / Job / Outbound candidate。 |
| 图节点粒度 | 节点使用概要层主语:API / Consumer / Job entry、Application Service、Domain Object / Policy / Guard、Read Material / View、Repository Boundary、Result / Event Candidate / Progress。 |
| 参数写法 | 如点名参数,只写 `TypeName param_name`;避免完整函数签名。 |
| 分支写法 | 只写概要分支:accepted / rejected、visible / unavailable / stale、accepted / ignored / rejected intake、converged / suspended / requires intervention。 |
| 说明写法 | 每张图后写关键说明、适用范围、禁止下沉内容和后续组成部分如何继承。 |
| 历史材料处理 | 不复制本文件 historical 5.x 的旧图,只用其作为旧主线污染检查样本。 |

#### R1.7.4 每类骨架的关键分支

| 骨架 | 关键分支 | 分支意义 |
|---|---|---|
| Command | duplicate replay / accepted / rejected / refresh hint / event candidate。 | 保持写路径幂等与结果可追溯,但不定义幂等存储 schema。 |
| Query | found / not found / unavailable / stale / redacted-safe / no-refresh。 | 防止 query 读取时修复 projection 或从 raw body 重建材料。 |
| Inbound | duplicate / unsupported schema / body-free pass / body-boundary violation / accepted intake / ignored / rejected。 | 防止外部事件把正文或下游状态直接带入本仓。 |
| Job | runnable / missing source material / partial refresh / converged / suspended / requires formal intervention。 | 防止 job 自动修 core truth,同时给维护进度和后续状态机留下来源。 |
| Outbound candidate | candidate produced / no candidate / delivery deferred. | 只表达事实候选产生,不承诺投递机制。 |

#### R1.7.5 R1.8 再写入结构

下一批 `R1.8 通用处理流骨架:再写入` 应只写:

1. `通用骨架写入说明`。
2. `通用 Command 写路径` ASCII 图和说明。
3. `通用 Query 只读路径` ASCII 图和说明。
4. `通用 Inbound body-free intake` ASCII 图和说明。
5. `通用 Operations Job derived refresh / recovery` ASCII 图和说明。
6. `通用 Outbound Event candidate production` ASCII 图和说明。
7. `通用骨架适用 / 不适用表`。
8. `本模块停审记录`。

#### R1.7.6 禁止动作和降级规则

| 项 | 裁决 | 理由 |
|---|---|---|
| 写八个主要组成部分具体处理流 | exclude_current_module | 组成部分小循环必须等通用骨架再写入后逐模块推进。 |
| 复制 historical 5.x 通用图 | exclude | 旧图早于当前 R1.24~R1.45,只能作为污染审计样本。 |
| 写 repository / port / DTO / SQL / DDL | exclude | 属详细设计或实现层,概要只保留边界。 |
| 写 outbox relay / topic / payload | exclude | Outbound 只保留 event candidate production。 |
| 写 worker loop / scheduler / retry / lock | exclude | Operations Job 只写概要 job boundary,不写运行机制。 |
| 让 Query 刷新 material | exclude | Query 只读,刷新属于 Operations Job。 |
| 让 Inbound 直接建 core truth | exclude | Inbound 只 intake safe summary / ref / marker,后续 truth 改写必须显式 Command。 |

#### R1.7.7 下一写入批次边界

下一批 `R1.8 通用处理流骨架:再写入` 只允许写五类通用骨架图、说明、适用规则和停审记录。

下一批不得写八个主要组成部分具体处理流,不得写接口到处理流族最终映射,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

#### R1.7.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写通用骨架图正文,只写图形口径和下一批结构。 |
| 是否覆盖五类通用骨架 | pass | Command、Query、Inbound、Operations Job、Outbound Event candidate 均已覆盖。 |
| 是否继承 R1.6 候选池 | pass | 五类骨架来自 R1.6 通用路径候选和事件说明候选。 |
| 是否避免 historical 5.x 回流 | pass | 明确不复制旧图,只作污染样本。 |
| 是否避免具体组成部分流程 | pass | 未进入八个主要组成部分小循环。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `通用处理流骨架:再写入`;只写五类通用骨架图、说明、适用规则和停审记录,不得写八个主要组成部分具体处理流图,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.8 通用处理流骨架:再写入

#### R1.8.1 通用骨架写入说明

本模块只写五类通用处理流骨架,作为后续八个主要组成部分处理流族的共同模板。通用骨架不替代组成部分处理流,也不承诺 repository、port、transaction、topic、payload、worker 或 scheduler 方案。

图中节点只使用概要层主语。若后续具体流族需要点名函数调用,必须另按 `TypeName param_name` 的形式写参数骨架;本模块不写完整函数签名。

#### R1.8.2 通用 Command 写路径

```text
<Command API>
  ActorContext / CommandMetadata / IdempotencyKey / typed request summary
        |
        v
<Application Service>
  - validate component owner and typed refs
  - check duplicate command replay boundary
  - load required truth / policy / guard / material summary
        |
        v
<Domain Object / Policy / Guard>
  - decide accepted or rejected result
  - write owned truth / boundary / material / peripheral truth
  - produce safe summary / history ref / lineage ref
        |
        v
<Repository Boundary>
  - persist owned object or material summary
  - persist replayable accepted / rejected summary boundary
        |
        v
<Command Result>
  accepted / rejected result
  optional event candidate
  optional refresh hint
```

关键说明:

- 适用于 58 个 Command 的共同写入骨架,后续八个处理流族继承这个入口和结果形态。
- Command 可以调用 policy / guard,但 guard 不成为绕过正式化、版本、消费边界或正文禁止规则的外部 API。
- event candidate 只是业务事实候选,不表示 outbox、topic、payload 或 relay 已经设计完成。
- refresh hint 只提示后续维护收敛,不在 Command 中执行 job。

禁止下沉:

- 不写 repository trait、transaction 伪代码、SQL / DDL、错误码全集、retry、worker、topic 或 payload schema。

#### R1.8.3 通用 Query 只读路径

```text
<Query API>
  ActorContext / QueryMetadata / scope ref / subject ref / typed lookup ref
        |
        v
<Query Application Service>
  - validate reader context and component boundary
  - select read source: summary / view / material / ref / diagnostic / progress
  - do not create, refresh, repair, or backfill
        |
        v
<Read Material / View / Summary>
  found / not found / unavailable / stale / redacted-safe surface
        |
        v
<Query Result>
  safe summary / view / material / diagnostic / progress
  optional freshness or unavailable marker
```

关键说明:

- 适用于简单 summary / view / history / lineage / progress 读取,也为复杂读取提供只读边界。
- 复杂 Query 如 resolution、availability、integrity、protection、discovery、freshness / unavailable 后续仍需在组成部分流族中重点说明。
- Query 可以返回 unavailable / stale / diagnostic surface,但不能在读取路径修复 projection、刷新 material 或创建缺失对象。
- Query 输出只能是 safe summary、typed ref、view、material、diagnostic 或 progress,不得返回 raw body、artifact body、raw log 或 report body。

禁止下沉:

- 不写 query condition、cache key、projection storage、repository method、HTTP / RPC shape、DTO 字段全集或错误码全集。

#### R1.8.4 通用 Inbound body-free intake

```text
<Inbound Event Consumer>
  source envelope / source event id / source system ref / schema version
  dedup key / trace context / safe summary or typed ref or marker
        |
        v
<Consumer Boundary>
  - validate source and schema version
  - check duplicate intake
  - enforce body-free boundary
        |
        v
<External Summary / Ref Intake>
  body-free pass -> local intake summary
  body boundary violation -> rejected-safe summary
  unsupported schema -> ignored or rejected result
        |
        v
<Consumer Result>
  accepted / ignored / rejected
  optional command handoff hint
  optional event candidate
```

关键说明:

- 适用于 4 个 Inbound Consumer,全部归外部摘要与引用 owner。
- Consumer 只承接 safe summary、typed ref、digest hint、body-free marker 或 safe reason ref。
- Consumer 结果可以提供后续显式 Command 的 handoff hint,但不能直接建立 definition、formal version、relation、package 或 maintenance task truth。
- body boundary violation 只能形成 safe rejection / violation summary,不得保存被拒正文。

禁止下沉:

- 不写 webhook payload、topic、subscriber、dead letter、provider authentication、handler 代码、payload schema 或 outbox 机制。

#### R1.8.5 通用 Operations Job derived refresh / recovery

```text
<Operations Job Entry>
  MaintenanceRunRef / RefreshScopeRef / task ref / target material refs
        |
        v
<Maintenance Application Service>
  - load task and progress boundary
  - load committed source truth / summary / material refs
  - confirm no core truth repair
        |
        v
<Derived Material / Recovery Work>
  refresh read material
  refresh trace / audit / impact material
  converge recovery progress
        |
        v
<Maintenance Result>
  refreshed material refs
  freshness / progress marker
  converged / suspended / requires formal intervention
  optional event candidate
```

关键说明:

- 适用于 8 个 Operations Job,全部归后台维护与收敛 owner。
- Job 读取已成立 truth、summary、material、view refs 或 history refs,只写派生材料、进度或恢复收敛结果。
- `requires formal intervention` 表示需要显式正式流程处理,不是 job 自动改写业务 truth。
- Job result 可以产生 maintenance / refresh / recovery event candidate,但不定义投递机制。

禁止下沉:

- 不写 worker loop、queue、scheduler、cron、lock、retry、cache/index/store 方案、SQL / DDL 或运行配置。

#### R1.8.6 通用 Outbound Event candidate production

```text
<Source Result>
  accepted command result
  completed job result
  derived material state changed
        |
        v
<Event Candidate Boundary>
  - select event family
  - copy typed refs / summary refs / safe reason refs / markers
  - attach trace context
        |
        v
<Outbound Event Candidate>
  fact changed / material changed / maintenance changed / peripheral changed
        |
        v
<Delivery Design Deferred>
  topic / payload schema / outbox / relay / subscriber / retry are not defined here
```

关键说明:

- 适用于 34 个 Outbound Event 的统一说明。
- 事件候选只表达本仓已成立事实、派生材料状态、维护状态或外围组织变化。
- 事件候选输出只包含 typed refs、summary refs、safe reason refs、state / availability / freshness markers 和 trace context。
- 投递可靠性、payload schema、topic、outbox、relay、subscriber、dead letter、retry 留给后续详细设计或交付机制讨论。

禁止下沉:

- 不写 topic 名、payload 字段全集、partition key、consumer list、relay state、delivery state、retry policy 或 outbox table。

#### R1.8.7 通用骨架适用 / 不适用表

| 通用骨架 | 适用 | 不适用 |
|---|---|---|
| Command 写路径 | 58 个 Command 的共同入口、幂等、对象写入和 result / event candidate / refresh hint。 | 逐接口字段全集、完整事务、worker 执行、外部事件消费。 |
| Query 只读路径 | 简单 summary / view / material / history / lineage / progress 读取;复杂 Query 的只读底线。 | material refresh、truth repair、missing object creation、raw body 读取。 |
| Inbound body-free intake | 4 个 external summary / source ref / artifact ref / body boundary violation Consumer。 | raw webhook、artifact upload、downstream runtime event、直接 core truth mutation。 |
| Operations Job derived refresh / recovery | 8 个 read material / trace material / recovery / peripheral refresh job。 | core truth repair、正式化重做、消费边界绕过、worker 调度机制。 |
| Outbound Event candidate production | 34 个 fact / material / maintenance / peripheral changed event candidate。 | topic / payload / outbox / relay / subscriber / retry / delivery state。 |

#### R1.8.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入五类通用骨架图 | pass | 已写 Command、Query、Inbound、Operations Job、Outbound Event candidate 五张 ASCII 骨架图。 |
| 是否避免八个组成部分具体处理流 | pass | 未进入 definition / catalog、formalization、consumption 等具体流族。 |
| 是否保持 Query 只读 | pass | Query 骨架明确禁止 create / refresh / repair / backfill。 |
| 是否保持 Inbound body-free | pass | Inbound 骨架明确只承接 safe summary / typed ref / digest / marker。 |
| 是否保持 Job 不修 core truth | pass | Job 骨架明确 only derived material / recovery progress。 |
| 是否保持 Outbound 不等于 relay | pass | Outbound 骨架明确 delivery design deferred。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `方法资产定义与目录处理流:先思考`;只思考本组成部分关键处理流族、覆盖接口和不展开理由,不得直接写处理流图正文,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.9 方法资产定义与目录处理流:先思考

#### R1.9.1 问题回答

- 本模块只思考 `方法资产定义与目录` 的处理流族,不直接写具体处理流图正文,不进入下一个组成部分。
- 本组成部分的当前接口来源是 Step 7 `R1.34`:6 个 Command、4 个 Query、2 个 Outbound Event,没有 Inbound Consumer 和 Operations Job。
- 核心对象来源是 Step 6 的 `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`MethodAssetDefinitionRef`、`MethodAssetCatalogView`、`CatalogScopeRef`。这些对象承载定义 truth、目录语义和目录读取形态,禁止恢复旧 `MethodContent` 总对象。
- 本组成部分必须区分 definition truth、catalog entry truth 和 catalog view。`MethodAssetCatalogView` 只能作为派生读取材料,不能反写 definition 或 catalog entry。
- 外部来源只能以 accepted external summary refs 进入 definition establish 的输入线索;不得在本流中接收外部正文、artifact body、标准全文、ADR 正文或旧 P0 content payload。
- 目录登记 / 重分类 / 退役是 catalog truth 写入,不是搜索索引、UI 分类、cache rebuild 或 query projection refresh。

#### R1.9.2 接口覆盖判断

| 接口组 | 当前接口 | 候选裁决 | 理由 |
|---|---|---|---|
| definition truth 写流 | `EstablishMethodAssetDefinition`;`AdjustMethodAssetDefinition`;`RetireMethodAssetDefinition` | 独立处理流族 | 定义是后续正式化、消费、关系、追溯和外围组织的根锚点,必须显式写入和形成 stable ref / history。 |
| catalog entry truth 写流 | `RegisterMethodAssetCatalogEntry`;`ReclassifyMethodAssetCatalogEntry`;`RetireMethodAssetCatalogEntry` | 独立处理流族 | catalog entry 是目录语义 truth,不能由 catalog view、搜索索引或 query 隐式产生。 |
| definition / catalog 读取 | `GetMethodAssetDefinitionSummary`;`ResolveMethodAssetDefinitionRef`;`GetMethodAssetCatalogEntry`;`ListMethodAssetCatalogView` | 通用 Query 路径 + 轻量说明 | 均为只读;其中 ref resolution 和 catalog view freshness / unavailable 需要在本组成部分写边界说明。 |
| definition / catalog events | `MethodAssetDefinitionChanged`;`MethodAssetCatalogEntryChanged` | 统一事件说明 | 只表达 fact changed candidate,不写 topic / payload / outbox / relay。 |
| Inbound / Job | 无 | 不展开 | 外部摘要先由外部摘要与引用承接;catalog view refresh 属后台维护与收敛,不在本组成部分定义 job。 |

#### R1.9.3 预计处理流族

| 处理流族 | 覆盖接口 | 主要对象 | 关键分支 | 后续 R1.10 写法 |
|---|---|---|---|---|
| `MethodAssetDefinitionWriteFlow` | `EstablishMethodAssetDefinition`;`AdjustMethodAssetDefinition`;`RetireMethodAssetDefinition` | `MethodAssetDefinition`;`MethodAssetDefinitionRef`;`MethodAssetDefinitionHistory` | accepted / rejected;duplicate replay;external summary refs safe;retired does not delete formal refs。 | 写一张同构 Command 流图,分支说明 establish / adjust / retire 差异。 |
| `MethodAssetCatalogEntryWriteFlow` | `RegisterMethodAssetCatalogEntry`;`ReclassifyMethodAssetCatalogEntry`;`RetireMethodAssetCatalogEntry` | `MethodAssetCatalogEntry`;`CatalogScopeRef`;`MethodAssetCatalogView` as read material only | accepted / rejected;definition ref required;view not truth;retired entry does not retire definition。 | 写一张 catalog truth 流图,强调 catalog view 只被 invalidated / refreshed later。 |
| `MethodAssetDefinitionCatalogReadFlow` | `GetMethodAssetDefinitionSummary`;`ResolveMethodAssetDefinitionRef`;`GetMethodAssetCatalogEntry`;`ListMethodAssetCatalogView` | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetCatalogView` | found / not found;unavailable / stale view;no refresh;no route-param ref synthesis。 | 写轻量只读说明,可复用通用 Query 图,不画四张重复图。 |
| `DefinitionCatalogEventCandidate` | `MethodAssetDefinitionChanged`;`MethodAssetCatalogEntryChanged` | typed refs;history ref;catalog scope ref;trace context | candidate produced / no candidate;delivery deferred。 | 写统一事件候选说明,不画 relay。 |

#### R1.9.4 不展开和后置项

| 项 | 当前裁决 | 理由 |
|---|---|---|
| 每个 definition / catalog Command 单独画图 | 不逐个画 | establish / adjust / retire 与 register / reclassify / retire 分别可由两个同构写流族覆盖。 |
| 四个 Query 分别画完整图 | 不逐个画 | 可复用通用 Query 只读路径,本组成部分只补 ref resolution 和 view freshness / unavailable 边界。 |
| catalog view refresh | 后置到后台维护与收敛 | view 是派生读取材料,刷新不属于 definition / catalog 业务 Command。 |
| 外部依据 / artifact 正文进入 definition | 排除 | 外部安全摘要由外部摘要与引用承接;本流只引用 accepted external summary refs。 |
| 正式化资格判断 | 后置到正式化与版本 | definition establish / adjust 不自动决定 formalization 或 formal version。 |
| 旧 `MethodContent` draft / publish flow | 排除 | 与当前对象和接口主线冲突,只作为旧材料差异审计样本。 |

#### R1.9.5 风险诊断

| 风险 | 影响 | R1.10 处理 |
|---|---|---|
| catalog view 被当成 catalog truth | 会让读取材料成为第二 truth。 | 在 catalog write flow 中明确只写 `MethodAssetCatalogEntry`,view 只产生 refresh hint / event candidate。 |
| definition adjust 直接替代 formal version | 会绕过正式化与版本边界。 | 在 definition write flow 中明确不改 `FormalMethodAssetVersion`。 |
| definition ref 从 route param / URL / path 拼接 | 会破坏 typed ref 边界。 | 在 read flow 中明确 `ResolveMethodAssetDefinitionRef` 只走正式 identity / catalog association。 |
| 外部正文进入 definition summary | 会突破 body-free 边界。 | 在 establish flow 中只允许 accepted external summary refs,不允许正文。 |

#### R1.9.6 下一写入批次结构

下一批 `R1.10 方法资产定义与目录处理流:再写入` 只写:

1. `本组成部分写入说明`。
2. `MethodAssetDefinitionWriteFlow` ASCII 图和关键说明。
3. `MethodAssetCatalogEntryWriteFlow` ASCII 图和关键说明。
4. `MethodAssetDefinitionCatalogReadFlow` 轻量读路径说明。
5. `DefinitionCatalogEventCandidate` 统一事件候选说明。
6. `接口覆盖 / 不展开理由表`。
7. `本模块停审记录`。

#### R1.9.7 下一写入批次边界

下一批不得写正式化与版本处理流,不得写 catalog refresh job 具体流程,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

#### R1.9.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写具体处理流图正文。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 6 个 Command、4 个 Query、2 个 Outbound Event。 |
| 是否区分 definition truth / catalog truth / catalog view | pass | 已明确 catalog view 不是第二 truth。 |
| 是否排除 Inbound / Job | pass | 本组成部分无 Inbound / Job;外部摘要和刷新 job 后置到对应 owner。 |
| 是否避免旧 `MethodContent` 回流 | pass | 明确旧 draft / publish flow 排除。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `方法资产定义与目录处理流:再写入`;只写本组成部分 definition write、catalog entry write、definition/catalog read 和 event candidate 处理流,不得写正式化与版本处理流,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.10 方法资产定义与目录处理流:再写入

#### R1.10.1 本组成部分写入说明

本模块只写 `方法资产定义与目录` 的处理流族。它覆盖 definition truth、catalog entry truth、definition / catalog 读取和 fact event candidate,不写正式化与版本、消费、追溯、关系、外部摘要 intake 或后台维护 job。

#### R1.10.2 MethodAssetDefinitionWriteFlow

```text
<Definition Command>
  EstablishMethodAssetDefinition
  AdjustMethodAssetDefinition
  RetireMethodAssetDefinition
        |
        v
<Definition Application Service>
  - validate ActorContext / CommandMetadata / IdempotencyKey
  - validate definition identity or MethodAssetDefinitionRef
  - accept only safe summary and accepted external summary refs
  - load existing MethodAssetDefinition when adjusting or retiring
        |
        v
<MethodAssetDefinition>
  establish -> create definition truth and stable MethodAssetDefinitionRef
  adjust    -> record body-free adjustment and history ref
  retire    -> mark definition retirement without deleting history
        |
        v
<Definition Write Boundary>
  - persist MethodAssetDefinition truth
  - persist MethodAssetDefinitionHistory summary
  - do not modify FormalMethodAssetVersion
        |
        v
<Definition Result>
  accepted / rejected definition summary
  MethodAssetDefinitionRef
  optional MethodAssetDefinitionChanged candidate
  optional read material refresh hint
```

关键说明:

- `EstablishMethodAssetDefinition` 是 definition truth 的入口,不能用旧 `MethodContent`、文件路径、URL、artifact body 或下游 method id 替代。
- `AdjustMethodAssetDefinition` 只调整 definition truth 和 body-free history,不直接替代正式版本。
- `RetireMethodAssetDefinition` 不删除历史、trace 或已成立 formal version refs。
- accepted external summary refs 只作为安全依据线索,外部正文由外部摘要与引用边界承接。

#### R1.10.3 MethodAssetCatalogEntryWriteFlow

```text
<Catalog Command>
  RegisterMethodAssetCatalogEntry
  ReclassifyMethodAssetCatalogEntry
  RetireMethodAssetCatalogEntry
        |
        v
<Catalog Application Service>
  - validate ActorContext / CommandMetadata / IdempotencyKey
  - validate MethodAssetDefinitionRef and CatalogScopeRef
  - load existing MethodAssetCatalogEntry when reclassifying or retiring
        |
        v
<MethodAssetCatalogEntry>
  register    -> create catalog entry truth for definition anchor
  reclassify  -> change catalog scope / applicability summary
  retire      -> retire catalog entry without retiring definition
        |
        v
<Catalog Write Boundary>
  - persist MethodAssetCatalogEntry truth
  - record catalog accepted / changed summary
  - mark MethodAssetCatalogView as stale by hint only
        |
        v
<Catalog Result>
  accepted / rejected catalog summary
  MethodAssetCatalogEntryRef
  optional MethodAssetCatalogEntryChanged candidate
  optional catalog view refresh hint
```

关键说明:

- catalog entry 是目录语义 truth,不是搜索索引、UI 分类、cache entry 或 read model。
- `MethodAssetCatalogView` 只允许作为派生读取材料,本流最多产生 refresh hint,不得把 view 反写成 truth。
- 目录项退役不等同于 definition 退役,也不删除正式版本、消费材料或追溯材料。

#### R1.10.4 MethodAssetDefinitionCatalogReadFlow

读取路径复用 `R1.8` 的通用 Query 只读骨架,本组成部分只补充 definition / catalog 专属边界。

| Query | 读取来源 | 关键分支 | 边界 |
|---|---|---|---|
| `GetMethodAssetDefinitionSummary` | `MethodAssetDefinition` 或安全读取材料。 | found / not found / unavailable。 | 不返回外部正文、artifact 正文、旧 P0 payload 或正式化裁决正文。 |
| `ResolveMethodAssetDefinitionRef` | definition identity index / catalog association。 | resolved / not found / ambiguous-safe。 | 不从 route param、URL、文件路径、marketplace id 或旧类型名拼接 ref。 |
| `GetMethodAssetCatalogEntry` | `MethodAssetCatalogEntry` 或 catalog read material。 | found / not found / unavailable。 | 不在读取中创建、重分类或退役目录项。 |
| `ListMethodAssetCatalogView` | `MethodAssetCatalogView` 派生读取材料。 | page found / stale / unavailable。 | 不刷新 view、不修复来源 truth、不暴露索引结构、排序算法或缓存键。 |

关键说明:

- 本读取流不创建 definition,不登记目录项,不刷新 catalog view。
- stale / unavailable 只能返回读取 surface 或 freshness hint,不能在 Query 内执行 refresh。
- ref resolution 必须保持 typed ref 边界,不能把路径、URL、外部 id 或 marketplace id 当作 definition ref。

#### R1.10.5 DefinitionCatalogEventCandidate

| Event candidate | 来源 | 输出骨架 | 边界 |
|---|---|---|---|
| `MethodAssetDefinitionChanged` | definition establish / adjust / retire accepted。 | `MethodAssetDefinitionRef`;change kind;definition history ref;trace context。 | 只表达 definition fact changed;不携带定义正文、外部正文、payload schema 或投递策略。 |
| `MethodAssetCatalogEntryChanged` | catalog register / reclassify / retire accepted。 | `MethodAssetCatalogEntryRef`;`MethodAssetDefinitionRef`;`CatalogScopeRef`;change kind;trace context。 | 只表达 catalog fact changed;不等同 catalog view refreshed,不携带 topic、outbox 或搜索索引信息。 |

事件候选仅说明业务事实变化可被后续感知。topic、payload schema、outbox、relay、subscriber、retry 和 delivery state 全部后置。

#### R1.10.6 接口覆盖 / 不展开理由表

| 对象 | 覆盖情况 | 说明 |
|---|---|---|
| 6 个 Command | covered | definition 3 个 Command 由 `MethodAssetDefinitionWriteFlow` 覆盖;catalog 3 个 Command 由 `MethodAssetCatalogEntryWriteFlow` 覆盖。 |
| 4 个 Query | covered_by_lightweight_read | 复用通用 Query 只读路径,本模块补充 ref resolution、catalog view stale / unavailable 和 no refresh 边界。 |
| 2 个 Outbound Event | covered_by_event_candidate | 只写事件候选产生,不写 delivery / outbox。 |
| Inbound Consumer | not_applicable | 本组成部分无 Inbound;外部事实先由外部摘要与引用承接。 |
| Operations Job | not_applicable | catalog view refresh 后置到后台维护与收敛,本组成部分不定义 job。 |
| 正式化与版本 | deferred | definition / catalog 变化可作为后续正式化输入,但本流不建立 formal version。 |

#### R1.10.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入本组成部分处理流 | pass | 已写 definition write、catalog entry write、definition/catalog read 和 event candidate。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 6 个 Command、4 个 Query、2 个 Outbound Event。 |
| 是否避免 catalog view 第二 truth | pass | catalog view 只作为派生读取材料,写流只产生 refresh hint。 |
| 是否避免正式化越界 | pass | definition write 明确不修改 `FormalMethodAssetVersion`。 |
| 是否避免外部正文入仓 | pass | definition establish 只允许 safe summary / accepted external summary refs。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `正式化与版本处理流:先思考`;只思考正式化与版本组成部分关键处理流族、覆盖接口和不展开理由,不得直接写处理流图正文,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.11 正式化与版本处理流:先思考

#### R1.11.1 问题回答

- 本模块只思考 `正式化与版本` 的处理流族,不直接写具体处理流图正文,不进入 `受控消费`。
- 当前有效接口来源必须以 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.34` 为准:6 个 Command、6 个 Query、4 个 Outbound Event,没有本组成部分 Inbound Consumer 和 Operations Job。
- 旧段落中曾出现的 formalization basis inbound consumer 不作为当前 R1 结论。本轮 Inbound 统一归 `外部摘要与引用`;正式化与版本只接收已经形成的 `FormalizationBasisSummary` / external summary refs,不接收外部正文或治理执行正文。
- 核心对象来源是 Step 6 的 `FormalMethodAssetVersion`、`FormalizationState`、`FormalizationBasisSummary`、`GovernanceBasisRef`、`FormalizationEligibilityRule` 和 `FormalizationHistory`。处理流必须分别承接版本 truth、状态 owner、basis summary 和资格 rule,不得混写。
- 正式版本不能由 Query、cache hit、同步成功、下游消费、definition adjustment 或 relation 引用隐式创建。必须由显式 Command 在 eligibility / formalization state 边界通过后建立。
- 版本语义变化不能用 hash、fingerprint、snapshot、schema version 或 semver 算法替代;这些旧主线只作历史污染审计样本。

#### R1.11.2 接口覆盖判断

| 接口组 | 当前接口 | 候选裁决 | 理由 |
|---|---|---|---|
| formalization eligibility / initiation | `EvaluateMethodAssetFormalizationEligibility`;`InitiateMethodAssetFormalization` | 独立处理流族 | eligibility rule、definition / catalog / basis 输入和 formalization state 是正式版本建立前置,必须显式覆盖。 |
| formal version lifecycle | `EstablishFormalMethodAssetVersion`;`RecordFormalVersionSemanticChange`;`SupersedeFormalMethodAssetVersion`;`RetireFormalMethodAssetVersion` | 独立处理流族 | formal version 是正式消费依据,建立、语义变化、替代和退役都影响下游消费与追溯。 |
| formalization / version 读取 | `GetFormalizationState`;`GetFormalMethodAssetVersionSummary`;`ResolveCurrentFormalMethodAssetVersion`;`GetFormalizationBasisSummary`;`GetFormalizationEligibilityDiagnostic`;`ListFormalizationHistory` | 通用 Query 路径 + 重点说明 | 均为只读;current version resolution、eligibility diagnostic、basis summary body-free 边界需要补充说明。 |
| formalization / version events | `MethodAssetFormalizationDecisionChanged`;`FormalMethodAssetVersionEstablished`;`FormalMethodAssetVersionChanged`;`FormalMethodAssetVersionRetired` | 统一事件说明 | 只表达 formalization / version fact candidate,不写 topic / payload / outbox / relay。 |
| Inbound / Job | 无 | 不展开 | basis / external fact intake 归外部摘要与引用;formal version read material refresh 归后台维护与收敛。 |

#### R1.11.3 预计处理流族

| 处理流族 | 覆盖接口 | 主要对象 | 关键分支 | 后续 R1.12 写法 |
|---|---|---|---|---|
| `FormalizationEligibilityFlow` | `EvaluateMethodAssetFormalizationEligibility`;`InitiateMethodAssetFormalization` | `FormalizationState`;`FormalizationBasisSummary`;`FormalizationEligibilityRule`;definition / catalog refs | eligible / blocked / rejected / pending;basis missing;external body not allowed;no auto version。 | 写一张 formalization 判断流图,区分 eligibility evaluation 与 initiation。 |
| `FormalMethodAssetVersionLifecycleFlow` | `EstablishFormalMethodAssetVersion`;`RecordFormalVersionSemanticChange`;`SupersedeFormalMethodAssetVersion`;`RetireFormalMethodAssetVersion` | `FormalMethodAssetVersion`;`FormalizationState`;`FormalizationHistory` | establish / change / supersede / retire;stable ref;old ref not rewritten;retire not delete history。 | 写一张版本生命周期流图,强调 stable ref 和 no fingerprint / snapshot。 |
| `FormalizationVersionReadFlow` | 6 个 Query | `FormalizationState`;`FormalMethodAssetVersion`;`FormalizationBasisSummary`;`FormalizationEligibilityRule`;`FormalizationHistory` | found / not found;unavailable / stale;current resolution;diagnostic safe reason;no state transition。 | 写轻量只读说明,复用通用 Query 图。 |
| `FormalizationVersionEventCandidate` | 4 个 Outbound Event | formalization state ref;formal version ref;history ref;basis refs;trace context | candidate produced / no candidate;delivery deferred。 | 写统一事件候选说明,不画 relay。 |

#### R1.11.4 不展开和后置项

| 项 | 当前裁决 | 理由 |
|---|---|---|
| formalization basis inbound consumer | 不在本组成部分展开 | 当前 R1 的 Inbound owner 只有外部摘要与引用;本组成部分只引用 body-free basis summary refs。 |
| 每个 formal version Command 单独画图 | 不逐个画 | establish / semantic change / supersede / retire 可由版本生命周期同构流覆盖。 |
| 六个 Query 分别画完整图 | 不逐个画 | 可复用通用 Query 只读路径,本组成部分补 current version resolution、diagnostic 和 basis body-free 边界。 |
| formal version read material refresh | 后置到后台维护与收敛 | 读取材料刷新不是正式化业务 Command。 |
| governance approval / policy execution | 排除 | 本仓不执行治理审批,只承接已形成的 body-free basis summary / ref。 |
| hash / fingerprint / snapshot 版本机制 | 排除 | 当前版本语义由 `FormalMethodAssetVersion` 和 history / basis ref 承接。 |

#### R1.11.5 风险诊断

| 风险 | 影响 | R1.12 处理 |
|---|---|---|
| eligibility evaluation 被当成 formal version established | 会让资格通过等同正式版本成立。 | 在 eligibility flow 中明确 eligible / accepted state 不自动创建 formal version。 |
| basis summary 接收绕过外部摘要边界 | 会把治理正文、标准全文或 artifact body 带入本仓。 | 只允许 `FormalizationBasisSummary` / external summary refs,不接收正文。 |
| formal version ref 被语义漂移 | 会破坏下游已持有引用和追溯。 | 在 lifecycle flow 中强调 supersede 产生 next ref,不重写旧 ref。 |
| Query 触发 current version resolution 后创建版本 | 会形成隐式写路径。 | Read flow 明确只读,not found / unavailable 不触发建立。 |
| formalization state 与 version truth 混写 | 会让状态词表替代版本 truth。 | R1.12 分别写 `FormalizationState` 和 `FormalMethodAssetVersion` 的职责。 |

#### R1.11.6 下一写入批次结构

下一批 `R1.12 正式化与版本处理流:再写入` 只写:

1. `本组成部分写入说明`。
2. `FormalizationEligibilityFlow` ASCII 图和关键说明。
3. `FormalMethodAssetVersionLifecycleFlow` ASCII 图和关键说明。
4. `FormalizationVersionReadFlow` 轻量读路径说明。
5. `FormalizationVersionEventCandidate` 统一事件候选说明。
6. `接口覆盖 / 不展开理由表`。
7. `本模块停审记录`。

#### R1.11.7 下一写入批次边界

下一批不得写受控消费处理流,不得写 formal version read material refresh job,不得恢复 inbound basis consumer,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

#### R1.11.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写具体处理流图正文。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 6 个 Command、6 个 Query、4 个 Outbound Event。 |
| 是否以当前 R1 接口为准 | pass | 未恢复旧段落中的 basis inbound consumer。 |
| 是否区分 version truth / formalization state / basis summary / eligibility rule | pass | 已列为不同处理流职责。 |
| 是否排除旧 fingerprint / snapshot / publish 主线 | pass | 明确不作为当前版本机制。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `正式化与版本处理流:再写入`;只写本组成部分 formalization eligibility、formal version lifecycle、formalization/version read 和 event candidate 处理流,不得写受控消费处理流,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.12 正式化与版本处理流:再写入

#### R1.12.1 本组成部分写入说明

本模块只写 `正式化与版本` 的处理流。它承接 Step 7 当前接口骨架中的 6 个 Command、6 个 Query 和 4 个 Outbound Event,并回指 Step 6 的 `FormalMethodAssetVersion`、`FormalizationState`、`FormalizationBasisSummary`、`GovernanceBasisRef`、`FormalizationEligibilityRule` 和 `FormalizationHistory`。

本模块不恢复旧段落中的 formalization basis inbound consumer。外部依据、治理依据、artifact 依据和标准依据必须先由 `外部摘要与引用` 形成 body-free summary / typed ref,正式化与版本只消费这些摘要引用。

#### R1.12.2 FormalizationEligibilityFlow

覆盖接口:

- `EvaluateMethodAssetFormalizationEligibility`
- `InitiateMethodAssetFormalization`

```text
<Formalization Eligibility Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - MethodAssetDefinitionRef
  - MethodAssetCatalogEntryRef
  - FormalizationBasisSummaryRefSet
  - FormalizationEligibilityRuleRef or FormalizationTriggerSummary
        |
        v
<Command Gate>
  - check actor / idempotency / command metadata
  - reject raw governance body / raw standard body / raw artifact body
        |
        v
<Load Formalization Inputs>
  - load MethodAssetDefinition safe summary
  - load MethodAssetCatalogEntry context summary
  - load FormalizationBasisSummary refs
  - load FormalizationEligibilityRule
        |
        v
<Evaluate Eligibility>
  - definition exists and is eligible for formalization?
  - catalog context allows formalization?
  - basis summaries available and applicable?
  - rule result safe to expose?
        |
        +--> blocked / rejected / pending
        |       |
        |       v
        |   <Record FormalizationState and safe reason>
        |
        +--> eligible / accepted
                |
                v
            <Record FormalizationState and history ref>
                |
                v
<Formalization Decision Result>
  - FormalizationStateRef optional
  - eligibility decision summary
  - safe rejection / pending reason ref
  - MethodAssetFormalizationDecisionChanged candidate
```

关键设计点:

- `EvaluateMethodAssetFormalizationEligibility` 可以产生资格判断和 safe reason,但不得创建 `FormalMethodAssetVersion`。
- `InitiateMethodAssetFormalization` 表达显式正式化意图,可以写入 `FormalizationState` / `FormalizationHistory` 线索,但仍不得直接建立正式版本。
- `FormalizationBasisSummaryRefSet` 只引用已经接受的依据摘要,不得携带治理审批正文、标准全文、ADR 正文、artifact 正文或 archive body。
- `FormalizationEligibilityRule` 只作为资格 guard / policy,不得在本流中扩展为完整治理审批执行。
- blocked / rejected / pending 都必须以 safe reason ref 或安全摘要表达,不得暴露完整规则矩阵、组织配置或 policy enforce 细节。

#### R1.12.3 FormalMethodAssetVersionLifecycleFlow

覆盖接口:

- `EstablishFormalMethodAssetVersion`
- `RecordFormalVersionSemanticChange`
- `SupersedeFormalMethodAssetVersion`
- `RetireFormalMethodAssetVersion`

```text
<Formal Version Lifecycle Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - FormalizationStateRef
  - MethodAssetDefinitionRef / MethodAssetCatalogEntryRef
  - FormalMethodAssetVersionRef previous or current
  - FormalVersionBoundarySummary / VersionSemanticChangeSummary / reason ref
        |
        v
<Command Gate>
  - check idempotency
  - check typed refs
  - reject hash / fingerprint / snapshot as version truth
        |
        v
<Load Current Formalization Context>
  - load FormalizationState
  - load MethodAssetDefinition summary
  - load MethodAssetCatalogEntry context
  - load FormalizationBasisSummary refs when required
  - load current FormalMethodAssetVersion when command targets existing version
        |
        v
<Apply Lifecycle Decision>
  - establish: create stable FormalMethodAssetVersionRef
  - semantic change: record change summary and next-version candidate line
  - supersede: bind previous ref to next ref without rewriting old ref
  - retire: mark version out of new consumption context without deleting history
        |
        v
<Persist Version Truth and History>
  - save FormalMethodAssetVersion state
  - save FormalizationState linkage when state changes
  - append FormalizationHistory / audit-safe line
        |
        v
<Lifecycle Accepted Result>
  - formal version ref(s)
  - history ref
  - boundary / change / retirement summary
  - formal version event candidate
```

关键设计点:

- `EstablishFormalMethodAssetVersion` 是建立正式版本边界的唯一写路径。Query、cache hit、read material refresh、definition adjustment、relation reference 和 downstream use 都不能隐式创建正式版本。
- `RecordFormalVersionSemanticChange` 记录语义变化线索,不覆盖原 `FormalMethodAssetVersion` truth,也不把 definition adjustment 直接等同为版本变化。
- `SupersedeFormalMethodAssetVersion` 必须显式连接 previous / next formal version refs。旧 ref 的含义不能漂移,下游已持有 ref 不能被重写。
- `RetireFormalMethodAssetVersion` 只让版本退出新消费语境,不得删除 formal version truth、消费历史、trace、audit 或 history ref。
- `FormalMethodAssetVersion` 负责版本 truth,`FormalizationState` 负责正式化状态 owner,`FormalizationHistory` 负责历史线索。三者不能互相替代。

#### R1.12.4 FormalizationVersionReadFlow

覆盖 Query:

| Query | 读取路径 | 输出边界 | 禁止事项 |
|---|---|---|---|
| `GetFormalizationState` | 按 `FormalizationStateRef` 或 definition + catalog context 读取状态 summary。 | state kind、safe state reason、basis refs。 | 不推进状态,不触发正式化,不返回治理执行正文。 |
| `GetFormalMethodAssetVersionSummary` | 按 `FormalMethodAssetVersionRef` 读取 formal version summary / read material。 | definition ref、catalog entry ref、boundary summary、basis refs。 | 不返回外部正文、版本算法细节、fingerprint、snapshot 或存储结构。 |
| `ResolveCurrentFormalMethodAssetVersion` | 按 definition ref + 可选 catalog context 解析当前 formal version ref。 | current formal version ref、resolution summary、freshness / unavailable hint。 | 不从 route param、旧 content id、marketplace id 或下游引用拼接 ref。 |
| `GetFormalizationBasisSummary` | 按 `FormalizationBasisSummaryRef` 读取 body-free basis summary。 | basis kind、external summary refs、governance basis refs、applicability summary。 | 不返回治理审批流、标准全文、ADR 正文、artifact 正文或证据正文。 |
| `GetFormalizationEligibilityDiagnostic` | 复用 eligibility rule 的安全诊断输出。 | eligibility diagnostic summary、safe rejection / pending reason refs。 | 不暴露完整规则矩阵、组织配置、policy enforce 细节或审批过程。 |
| `ListFormalizationHistory` | 按 definition ref 或 formal version ref 分页读取 body-free history。 | formalization history summary page。 | 不返回 raw audit log、event payload、状态迁移矩阵、治理执行或外部正文。 |

读取流通用骨架:

```text
<Formalization / Version Query>
  - ActorContext / QueryMetadata
  - typed selector ref
        |
        v
<Query Gate>
  - check actor visibility at overview level
  - validate typed selector
  - reject raw external body request
        |
        v
<Load Read Source>
  - formalization state / formal version truth / basis summary / history material
        |
        +--> found
        |       |
        |       v
        |   <Return safe summary>
        |
        +--> not found / unavailable / stale
                |
                v
            <Return safe absence or freshness hint>
```

关键设计点:

- 所有 Query 都是只读路径。not found、stale、unavailable 或 diagnostic result 不得创建 formalization state,也不得建立 formal version。
- current version resolution 只能返回 formal version ref / resolution summary,不能把旧 content id、marketplace id、外部 URL 或下游消费引用转换成 formal version ref。
- basis summary 读取必须保持 body-free。需要正文时应回到外部系统或后续详细设计中的受控引用机制,本仓不保存正文。
- history 读取只返回 audit-safe history material,不等同 raw audit log 或事件 payload。

#### R1.12.5 FormalizationVersionEventCandidate

| Event candidate | 来源 | 输出骨架 | 边界 |
|---|---|---|---|
| `MethodAssetFormalizationDecisionChanged` | eligibility evaluation / formalization initiation accepted。 | `FormalizationStateRef`;`MethodAssetDefinitionRef`;decision kind;basis refs;trace context。 | 只表达 formalization decision fact;不携带治理执行、审批过程、规则矩阵或外部正文。 |
| `FormalMethodAssetVersionEstablished` | formal version establishment accepted。 | `FormalMethodAssetVersionRef`;`MethodAssetDefinitionRef`;`MethodAssetCatalogEntryRef`;boundary summary ref;trace context。 | 只表达正式版本成立;不携带版本算法、payload schema、topic、outbox 或 relay 策略。 |
| `FormalMethodAssetVersionChanged` | semantic change / supersession accepted。 | previous / next `FormalMethodAssetVersionRef`;change kind;history ref;trace context。 | 只表达版本事实变化;不覆盖旧版本含义,不声明下游影响已处理。 |
| `FormalMethodAssetVersionRetired` | formal version retirement accepted。 | `FormalMethodAssetVersionRef`;retirement reason ref;history ref;trace context。 | 只表达退出新消费语境;不删除历史引用,不强制下游状态迁移。 |

事件候选只说明本仓业务事实已经变化。topic、payload schema、outbox、relay、subscriber、retry、delivery state、下游消费刷新和维护任务调度全部后置。

#### R1.12.6 接口覆盖 / 不展开理由表

| 对象 | 覆盖情况 | 说明 |
|---|---|---|
| 6 个 Command | covered | 2 个 formalization eligibility / initiation Command 由 `FormalizationEligibilityFlow` 覆盖;4 个 version lifecycle Command 由 `FormalMethodAssetVersionLifecycleFlow` 覆盖。 |
| 6 个 Query | covered_by_lightweight_read | 复用通用 Query 只读路径,本模块补 current version resolution、diagnostic、basis body-free 和 history safe read 边界。 |
| 4 个 Outbound Event | covered_by_event_candidate | 只写事件候选产生,不写 delivery / outbox / relay。 |
| Inbound Consumer | not_applicable | 当前 R1 本组成部分无 Inbound;basis / external fact intake 归 `外部摘要与引用`。 |
| Operations Job | not_applicable | formal version read material refresh、history repair 或 downstream impact convergence 后置到 `后台维护与收敛`。 |
| 受控消费 | deferred | formal version established 只是消费前提,不在本流准备消费材料或执行消费边界判断。 |

#### R1.12.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入本组成部分处理流 | pass | 已写 formalization eligibility、formal version lifecycle、formalization/version read 和 event candidate。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 6 个 Command、6 个 Query、4 个 Outbound Event。 |
| 是否以当前 R1 接口为准 | pass | 使用 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.34` 的当前接口名。 |
| 是否避免隐式正式化 | pass | Query、definition adjustment、cache、sync、downstream use 均不得创建 formal version。 |
| 是否保持 basis body-free | pass | 只允许 `FormalizationBasisSummary` / external summary refs,不接收正文。 |
| 是否避免旧版本机制污染 | pass | 明确排除 hash / fingerprint / snapshot / publish 作为版本 truth。 |
| 是否区分状态与版本 truth | pass | `FormalizationState`、`FormalMethodAssetVersion`、`FormalizationHistory` 分别承责。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `受控消费处理流:先思考`;只思考受控消费组成部分关键处理流族、覆盖接口和不展开理由,不得直接写处理流图正文,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.13 受控消费处理流:先思考

#### R1.13.1 问题回答

- 本模块只思考 `受控消费` 的处理流族,不直接写具体处理流图正文,不进入 `追溯与一致性保护`。
- 当前有效接口来源必须以 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.34` 为准:5 个 Command、6 个 Query、4 个 Outbound Event,没有本组成部分 Inbound Consumer 和 Operations Job。
- 核心对象来源是 Step 6 的 `MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`、`DefinitionUseBoundaryGuard` 和 `ConsumptionContextRef`。处理流必须分别承接消费材料、可用性读取、下游边界和 Definition vs Use guard,不得混写。
- 受控消费只能消费已经成立的 `FormalMethodAssetVersionRef`。它不能建立正式版本,不能修改 definition truth,不能把下游运行状态、授权实现或同步结果写成本仓 truth。
- 旧 snapshot / cache / package export / publish sync 主线不作为当前消费材料机制。消费材料是 body-free / summary-oriented 的 read material / boundary carrier,不是下游私有定义副本。

#### R1.13.2 接口覆盖判断

| 接口组 | 当前接口 | 候选裁决 | 理由 |
|---|---|---|---|
| consumption boundary | `RegisterDownstreamConsumptionBoundary`;`AdjustDownstreamConsumptionBoundary` | 独立处理流族 | 下游消费语境、allowed / forbidden use、formal version requirement 是消费材料前置边界,必须显式覆盖。 |
| consumption material / availability | `PrepareMethodAssetConsumptionMaterial`;`MarkMethodAssetConsumptionMaterialState` | 独立处理流族 | material prepared / stale / blocked / unavailable 影响下游读取,但不得修复来源 truth 或启动 refresh job。 |
| definition-use violation | `RecordDefinitionUseBoundaryViolation` | 独立处理流族或 material flow 分支 | 该接口记录越界线索,需要强调 body-free safe violation 和 trace handoff,但不保存原始请求或证据正文。 |
| consumption reads | `GetMethodAssetConsumptionMaterial`;`GetMethodAssetAvailabilityView`;`ResolveConsumptionContextRef`;`GetDownstreamConsumptionBoundary`;`GetDefinitionUseBoundaryDiagnostic`;`ListConsumableContextsForFormalVersion` | 通用 Query 路径 + 重点说明 | 均为只读;context ref resolution、availability stale / unavailable、guard diagnostic 和 no material creation 需要补充说明。 |
| consumption events | `MethodAssetConsumptionMaterialPrepared`;`MethodAssetConsumptionAvailabilityChanged`;`DownstreamConsumptionBoundaryChanged`;`DefinitionUseBoundaryViolationNoticed` | 统一事件说明 | 只表达 consumption / boundary fact candidate,不写 topic / payload / outbox / relay。 |
| Inbound / Job | 无 | 不展开 | 下游运行事实不入仓;消费材料刷新归后台维护与收敛,不由本组成部分 job 承接。 |

#### R1.13.3 预计处理流族

| 处理流族 | 覆盖接口 | 主要对象 | 关键分支 | 后续 R1.14 写法 |
|---|---|---|---|---|
| `DownstreamConsumptionBoundaryFlow` | `RegisterDownstreamConsumptionBoundary`;`AdjustDownstreamConsumptionBoundary` | `DownstreamConsumptionBoundary`;`ConsumptionContextRef`;formal version requirement;allowed / forbidden use summary | boundary active / limited / suspended / adjusted;invalid context;forbidden policy detail。 | 写一张 boundary register / adjust 流图,强调不写鉴权实现和下游运行 truth。 |
| `ConsumptionMaterialPreparationFlow` | `PrepareMethodAssetConsumptionMaterial`;`MarkMethodAssetConsumptionMaterialState` | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`FormalMethodAssetVersionRef`;`DownstreamConsumptionBoundary` | prepared / blocked / stale / unavailable;formal version missing;boundary mismatch;no snapshot。 | 写一张 material prepare / state marker 流图,强调只读材料和 no source truth repair。 |
| `DefinitionUseBoundaryViolationFlow` | `RecordDefinitionUseBoundaryViolation` | `DefinitionUseBoundaryGuard`;`DefinitionUseViolationRef`;safe violation summary;optional trace subject ref | violation accepted / rejected;raw payload refused;handoff to trace / audit。 | 写独立或短流图,强调 body-free 违规线索和不保存原始请求。 |
| `ConsumptionReadFlow` | 6 个 Query | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard`;`ConsumptionContextRef` | found / not found;stale / unavailable;diagnostic safe reason;no material creation。 | 写轻量只读说明,复用通用 Query 图。 |
| `ConsumptionEventCandidate` | 4 个 Outbound Event | material ref;formal version ref;context ref;boundary ref;violation ref;trace context | candidate produced / no candidate;delivery deferred。 | 写统一事件候选说明,不画 relay。 |

#### R1.13.4 不展开和后置项

| 项 | 当前裁决 | 理由 |
|---|---|---|
| 下游运行状态 intake | 不展开 | 本仓不接收 process / identity / runtime / member-images 的运行 truth。 |
| 鉴权实现 / token scope / role matrix | 排除 | `DownstreamConsumptionBoundary` 只表达消费边界摘要,不承接具体鉴权系统实现。 |
| 消费材料刷新 job | 后置到后台维护与收敛 | `MarkMethodAssetConsumptionMaterialState` 只能标记 stale / blocked / unavailable,不得执行 refresh。 |
| 每个 Query 单独画完整图 | 不逐个画 | 可复用通用 Query 只读路径,本组成部分补 context resolution、availability 和 diagnostic 边界。 |
| 下游同步 / package export / snapshot | 排除 | 当前消费材料不是旧 snapshot、cache、同步包或下游私有定义副本。 |
| trace / audit 详细组织 | 后置到追溯与一致性保护 | 本模块可产生 trace subject hint,但不组织完整 trace / audit material。 |

#### R1.13.5 风险诊断

| 风险 | 影响 | R1.14 处理 |
|---|---|---|
| formal version established 被当成自动可消费 | 会跳过消费边界和 Definition vs Use guard。 | boundary flow 中明确必须先有 downstream consumption boundary。 |
| material prepare 复制 definition truth | 会形成下游私有定义副本和第二 truth。 | material flow 中强调只读 summary / refs,不保存定义正文全集。 |
| availability view 被当成 truth | stale / unavailable 可能反向改写正式版本或定义。 | read / material flow 中明确 availability 只派生,不改来源 truth。 |
| guard violation 保存 raw payload | 会把下游请求、运行状态或证据正文带入本仓。 | violation flow 中只允许 safe violation summary / reason ref。 |
| Query 解析 context 时拼接字符串 | 会破坏 typed ref 边界。 | read flow 中明确 `ResolveConsumptionContextRef` 不从 route param、session、runtime id 拼接。 |

#### R1.13.6 下一写入批次结构

下一批 `R1.14 受控消费处理流:再写入` 只写:

1. `本组成部分写入说明`。
2. `DownstreamConsumptionBoundaryFlow` ASCII 图和关键说明。
3. `ConsumptionMaterialPreparationFlow` ASCII 图和关键说明。
4. `DefinitionUseBoundaryViolationFlow` ASCII 图和关键说明。
5. `ConsumptionReadFlow` 轻量读路径说明。
6. `ConsumptionEventCandidate` 统一事件候选说明。
7. `接口覆盖 / 不展开理由表`。
8. `本模块停审记录`。

#### R1.13.7 下一写入批次边界

下一批不得写追溯与一致性保护处理流,不得写消费材料 refresh job,不得写鉴权实现、token、policy engine、下游运行状态或 snapshot/export 机制,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

#### R1.13.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写具体处理流图正文。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 5 个 Command、6 个 Query、4 个 Outbound Event。 |
| 是否以当前 R1 接口为准 | pass | 未恢复旧 `ResolveConsumptionMaterialForVersion` / snapshot / publish sync 主线。 |
| 是否区分 material / availability / boundary / guard | pass | 已列为不同处理流职责。 |
| 是否排除下游运行 truth 和鉴权实现 | pass | 明确不接收运行状态、token scope、权限矩阵或 policy engine。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `受控消费处理流:再写入`;只写本组成部分 downstream boundary、consumption material / availability、definition-use violation、consumption read 和 event candidate 处理流,不得写追溯与一致性保护处理流,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.14 受控消费处理流:再写入

#### R1.14.1 本组成部分写入说明

本模块只写 `受控消费` 的处理流。它承接 Step 7 当前接口骨架中的 5 个 Command、6 个 Query 和 4 个 Outbound Event,并回指 Step 6 的 `MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`、`DefinitionUseBoundaryGuard` 和 `ConsumptionContextRef`。

本模块的核心边界是:正式版本存在不等于自动可消费;下游可消费必须经过 consumption context、downstream boundary 和 Definition vs Use guard。消费材料只能是受控读取材料,不能成为定义 truth 的副本、下游运行状态仓库或旧 snapshot / export 包。

#### R1.14.2 DownstreamConsumptionBoundaryFlow

覆盖接口:

- `RegisterDownstreamConsumptionBoundary`
- `AdjustDownstreamConsumptionBoundary`

```text
<Downstream Consumption Boundary Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - ConsumptionContextRef
  - DownstreamConsumptionBoundaryRef optional
  - FormalVersionRequirement
  - allowed use summary / forbidden write summary
  - boundary adjustment summary / reason ref
        |
        v
<Command Gate>
  - check actor / idempotency / command metadata
  - validate typed consumption context
  - reject token / role / policy engine detail
  - reject downstream runtime state
        |
        v
<Load Boundary Context>
  - load existing DownstreamConsumptionBoundary when adjusting
  - load formal version requirement summary
  - load safe context association
        |
        v
<Apply Boundary Decision>
  - register new active boundary
  - adjust allowed use / forbidden write summary
  - mark scope-limited / suspended / retired when reason says so
  - reject invalid context or raw policy detail
        |
        v
<Persist Boundary Summary>
  - save DownstreamConsumptionBoundary
  - keep ConsumptionContextRef stable
  - do not modify FormalMethodAssetVersion or MethodAssetDefinition
        |
        v
<Boundary Accepted Result>
  - DownstreamConsumptionBoundaryRef
  - boundary accepted / adjusted summary
  - DownstreamConsumptionBoundaryChanged candidate
```

关键设计点:

- boundary 是受控消费的前置边界,不是鉴权系统实现。它只记录消费语境、允许使用摘要、禁止反写摘要和 formal version requirement。
- `AdjustDownstreamConsumptionBoundary` 只能调整消费边界本身,不得修改 formal version truth、definition truth 或下游仓状态。
- `ConsumptionContextRef` 必须来自 typed context resolution,不得从 route param、UI session、运行实例 id 或下游私有字符串拼接。
- 权限矩阵、token scope、role、policy engine 细节和组织配置不进入本处理流。

#### R1.14.3 ConsumptionMaterialPreparationFlow

覆盖接口:

- `PrepareMethodAssetConsumptionMaterial`
- `MarkMethodAssetConsumptionMaterialState`

```text
<Consumption Material Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - FormalMethodAssetVersionRef
  - MethodAssetDefinitionRef
  - ConsumptionContextRef
  - DownstreamConsumptionBoundaryRef
  - MethodAssetConsumptionMaterialRef optional
  - state marker summary / safe reason ref optional
        |
        v
<Command Gate>
  - check idempotency and typed refs
  - reject raw definition body / external body / downstream state
  - reject snapshot / export package request
        |
        v
<Load Formal Consumption Inputs>
  - load FormalMethodAssetVersion summary
  - load MethodAssetDefinition safe summary
  - load DownstreamConsumptionBoundary
  - load DefinitionUseBoundaryGuard
        |
        v
<Guard and Material Decision>
  - formal version valid for context?
  - boundary allows this use?
  - guard prevents downstream write / private definition copy?
        |
        +--> blocked / unavailable
        |       |
        |       v
        |   <Record material state and availability hint>
        |
        +--> prepared
                |
                v
            <Create or update MethodAssetConsumptionMaterial>
                |
                v
<Persist Material and Availability Hint>
  - save MethodAssetConsumptionMaterial summary
  - update MethodAssetAvailabilityView hint when available
  - do not repair source truth or run refresh job
        |
        v
<Material Accepted Result>
  - MethodAssetConsumptionMaterialRef
  - material prepared / state summary
  - MethodAssetConsumptionMaterialPrepared candidate
  - MethodAssetConsumptionAvailabilityChanged candidate when state changed
```

关键设计点:

- `PrepareMethodAssetConsumptionMaterial` 只能从已成立 formal version、definition safe summary、consumption context 和 downstream boundary 派生只读消费材料。
- 消费材料不得复制定义正文全集、外部正文、artifact body、archive body 或下游运行 truth。
- `MarkMethodAssetConsumptionMaterialState` 只标记 stale / blocked / unavailable 等状态线索,不得修复来源 truth、扩大消费边界或启动刷新算法。
- availability hint / view 是派生读取线索。stale / unavailable 不能反向改写 formal version、definition 或 boundary。

#### R1.14.4 DefinitionUseBoundaryViolationFlow

覆盖接口:

- `RecordDefinitionUseBoundaryViolation`

```text
<Definition Use Boundary Violation Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - DefinitionUseBoundaryGuardRef
  - DefinitionUseViolationRef
  - safe violation summary
        |
        v
<Violation Gate>
  - validate guard ref and violation ref
  - reject original request body / downstream payload / raw log / evidence body
  - normalize to safe reason ref
        |
        v
<Load Guard Context>
  - load DefinitionUseBoundaryGuard
  - load related material / context refs when available
        |
        v
<Record Safe Violation Line>
  - accept body-free violation summary
  - produce optional TraceSubjectRef handoff hint
  - do not organize trace / audit material here
        |
        v
<Violation Accepted Result>
  - guard violation accepted summary
  - optional trace subject ref
  - DefinitionUseBoundaryViolationNoticed candidate
```

关键设计点:

- 本流只记录 Definition vs Use 越界的 body-free 线索,不保存原始请求、下游 payload、运行状态、raw log 或证据正文。
- 可产生 trace subject hint,但完整 trace、audit、impact 和 evidence lineage 组织属于后续 `追溯与一致性保护`。
- violation accepted 不等同于自动修复,也不等同于 boundary 调整或 material refresh。

#### R1.14.5 ConsumptionReadFlow

覆盖 Query:

| Query | 读取路径 | 输出边界 | 禁止事项 |
|---|---|---|---|
| `GetMethodAssetConsumptionMaterial` | 按 `MethodAssetConsumptionMaterialRef` 读取 consumption material summary。 | formal version ref、definition ref、context ref、boundary ref。 | 不返回定义正文、外部正文、下游运行状态、旧 snapshot 包或授权矩阵。 |
| `GetMethodAssetAvailabilityView` | 按 formal version ref + consumption context ref 读取 availability summary。 | state hint、source material ref、freshness / unavailable reason。 | 不刷新 view,不改变来源 truth,不把 cache hit 当正式消费成立。 |
| `ResolveConsumptionContextRef` | 按 consumer kind / scope safe selector 解析 typed context ref。 | `ConsumptionContextRef`;context resolution summary。 | 不从 route param、运行实例 id、UI session 或下游私有字符串拼接 context ref。 |
| `GetDownstreamConsumptionBoundary` | 按 boundary ref 或 context ref 读取 boundary summary。 | formal version requirement、allowed / forbidden use summary。 | 不暴露鉴权实现、权限矩阵、token、组织配置或策略引擎细节。 |
| `GetDefinitionUseBoundaryDiagnostic` | 按 guard ref 或 material / context refs 读取 safe diagnostic。 | guard diagnostic summary、safe violation / reason refs。 | 不返回原始请求正文、下游私有 payload、raw log 或证据正文。 |
| `ListConsumableContextsForFormalVersion` | 按 formal version ref 分页读取可消费 context / boundary summary。 | consumption context page、boundary refs、availability hints。 | 不创建消费材料,不扩大消费边界,不声明下游已同步或已运行。 |

读取流通用骨架:

```text
<Consumption Query>
  - ActorContext / QueryMetadata
  - typed selector ref or safe context selector
        |
        v
<Query Gate>
  - validate typed selector
  - check overview-level visibility
  - reject raw body / auth implementation / downstream state request
        |
        v
<Load Consumption Read Source>
  - consumption material / availability view / boundary / guard diagnostic
        |
        +--> found
        |       |
        |       v
        |   <Return safe consumption summary>
        |
        +--> not found / stale / unavailable
                |
                v
            <Return safe absence or freshness hint>
```

关键设计点:

- 所有 Query 都是只读路径。not found、stale、unavailable 或 diagnostic result 不得创建 consumption material、调整 boundary 或刷新 view。
- context ref resolution 是 typed ref 解析,不是从下游运行 id、session、URL、path 或 marketplace listing 拼接正式引用。
- guard diagnostic 只返回 safe reason / violation refs,不返回原始请求、raw log、证据正文或下游 payload。

#### R1.14.6 ConsumptionEventCandidate

| Event candidate | 来源 | 输出骨架 | 边界 |
|---|---|---|---|
| `MethodAssetConsumptionMaterialPrepared` | consumption material preparation accepted。 | `MethodAssetConsumptionMaterialRef`;`FormalMethodAssetVersionRef`;`ConsumptionContextRef`;boundary ref;trace context。 | 只表达材料已准备;不携带材料正文、定义正文、topic / payload schema 或投递策略。 |
| `MethodAssetConsumptionAvailabilityChanged` | material state marker / availability derivation changed。 | `FormalMethodAssetVersionRef`;`ConsumptionContextRef`;availability state hint;safe reason ref。 | 不等同下游同步成功,不改变 formal version truth。 |
| `DownstreamConsumptionBoundaryChanged` | boundary register / adjust accepted。 | `DownstreamConsumptionBoundaryRef`;`ConsumptionContextRef`;change kind;trace context。 | 不携带权限矩阵、鉴权配置、policy engine 细节或下游状态。 |
| `DefinitionUseBoundaryViolationNoticed` | guard violation accepted。 | `DefinitionUseBoundaryGuardRef`;`DefinitionUseViolationRef`;safe reason ref;trace context。 | 不携带原始请求、下游 payload、证据正文或 raw log。 |

事件候选只说明本仓消费边界或消费材料事实已经变化。topic、payload schema、outbox、relay、subscriber、retry、delivery state、下游同步状态和维护 job 调度全部后置。

#### R1.14.7 接口覆盖 / 不展开理由表

| 对象 | 覆盖情况 | 说明 |
|---|---|---|
| 5 个 Command | covered | 2 个 boundary Command 由 `DownstreamConsumptionBoundaryFlow` 覆盖;2 个 material / availability Command 由 `ConsumptionMaterialPreparationFlow` 覆盖;1 个 violation Command 由 `DefinitionUseBoundaryViolationFlow` 覆盖。 |
| 6 个 Query | covered_by_lightweight_read | 复用通用 Query 只读路径,本模块补 context ref resolution、availability stale / unavailable、boundary summary 和 guard diagnostic 边界。 |
| 4 个 Outbound Event | covered_by_event_candidate | 只写事件候选产生,不写 delivery / outbox / relay。 |
| Inbound Consumer | not_applicable | 本组成部分无 Inbound;下游运行事实不入仓。 |
| Operations Job | not_applicable | consumption material refresh / convergence 后置到 `后台维护与收敛`。 |
| 追溯与一致性保护 | deferred | violation / material 可产生 trace hint,但 trace、impact、audit、lineage 组织由后续组成部分处理。 |

#### R1.14.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入本组成部分处理流 | pass | 已写 boundary、material / availability、violation、read 和 event candidate。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 5 个 Command、6 个 Query、4 个 Outbound Event。 |
| 是否以当前 R1 接口为准 | pass | 使用 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.34` 的当前接口名。 |
| 是否避免隐式正式化 | pass | 消费边界和消费材料不得创建 formal version。 |
| 是否避免 definition truth 副本 | pass | material 只承载 summary / refs,不保存定义正文全集或 snapshot。 |
| 是否排除下游运行 truth 和鉴权实现 | pass | 明确不保存运行状态、token、role、权限矩阵或 policy engine 细节。 |
| 是否避免越界到追溯 | pass | violation 只产生 body-free 线索和 trace hint,不组织完整 trace / audit。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `追溯与一致性保护处理流:先思考`;只思考追溯与一致性保护组成部分关键处理流族、覆盖接口和不展开理由,不得直接写处理流图正文,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.15 追溯与一致性保护处理流:先思考

#### R1.15.1 问题回答

- 本模块只思考 `追溯与一致性保护` 的处理流族,不直接写具体处理流图正文,不进入 `关系与分发语义`。
- 当前有效接口来源必须以 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.34` 为准:7 个 Command、7 个 Query、5 个 Outbound Event,没有本组成部分 Inbound Consumer 和 Operations Job。
- 核心对象来源是 Step 6 的 `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy`、`MethodAssetAuditTrail`、`TraceSubjectRef`、`ConsumptionImpactSourceRef` 和 evidence lineage 线索。处理流必须分别承接 trace、impact、protection、audit / lineage,不得混写。
- 本组成部分只组织 body-free 追溯、影响、安全审计和保护判断。它不能保存 raw log、event payload、trace span、外部正文、artifact 包体、证据正文、report body 或下游运行 truth。
- 一致性保护不是自动恢复。恢复收敛、trace material refresh、audit / impact material refresh 和 recovery job 归 `后台维护与收敛`。

#### R1.15.2 接口覆盖判断

| 接口组 | 当前接口 | 候选裁决 | 理由 |
|---|---|---|---|
| trace material | `OrganizeMethodAssetTraceMaterial`;`MarkMethodAssetTraceMaterialState` | 独立处理流族 | trace subject、formal version / consumption material refs、basis refs 和 stale / incomplete / unavailable 线索是追溯主线。 |
| impact summary | `RegisterConsumptionImpactSummary`;`MarkConsumptionImpactDisposition` | 独立处理流族 | 影响登记、unknown / pending / dismissed / accepted 不能折叠为 trace 或 audit。 |
| consistency protection | `EstablishConsistencyProtectionDecision` | 独立处理流族 | protection decision 横跨 formal version、impact、trace 和 protected contexts,需要显式覆盖。 |
| audit / evidence lineage | `OrganizeMethodAssetAuditTrail`;`LinkMethodAssetEvidenceLineage` | 独立处理流族或合并处理流 | audit trail 和 evidence lineage 都是 body-free 审计材料,可用同一安全审计流族覆盖。 |
| trace / impact / audit reads | `GetMethodAssetTraceMaterial`;`GetTraceBySubject`;`GetConsumptionImpactSummary`;`ListPendingConsumptionImpacts`;`GetConsistencyProtectionDiagnostic`;`GetMethodAssetAuditTrail`;`GetMethodAssetEvidenceLineage` | 通用 Query 路径 + 重点说明 | 均为只读;trace subject resolution、unknown impact、diagnostic 和 body-free audit / evidence 边界需要补充说明。 |
| trace / impact / audit events | `MethodAssetTraceMaterialChanged`;`ConsumptionImpactSummaryChanged`;`ConsistencyProtectionDecisionChanged`;`MethodAssetAuditTrailChanged`;`MethodAssetEvidenceLineageChanged` | 统一事件说明 | 只表达 trace / impact / protection / audit / lineage fact candidate,不写 topic / payload / outbox / relay。 |
| Inbound / Job | 无 | 不展开 | 外部证据和下游影响必须先成为 body-free summary / ref;刷新和恢复收敛归后台维护与收敛。 |

#### R1.15.3 预计处理流族

| 处理流族 | 覆盖接口 | 主要对象 | 关键分支 | 后续 R1.16 写法 |
|---|---|---|---|---|
| `TraceMaterialOrganizationFlow` | `OrganizeMethodAssetTraceMaterial`;`MarkMethodAssetTraceMaterialState` | `MethodAssetTraceMaterial`;`TraceSubjectRef`;formal version / consumption material refs;basis refs | organized / stale / incomplete / unavailable;subject mismatch;raw log rejected。 | 写一张 trace organization / state marker 流图,强调 body-free 和不替代业务 truth。 |
| `ConsumptionImpactSummaryFlow` | `RegisterConsumptionImpactSummary`;`MarkConsumptionImpactDisposition` | `ConsumptionImpactSummary`;`ConsumptionImpactSourceRef`;affected definition / version / context refs | candidate / confirmed / unknown / dismissed / accepted;unknown not no impact。 | 写一张 impact register / disposition 流图,强调不扫描下游内部 truth。 |
| `ConsistencyProtectionDecisionFlow` | `EstablishConsistencyProtectionDecision` | `ConsistencyProtectionPolicy`;impact refs;trace refs;protected contexts | protected / pending / unknown / no-action;recovery deferred。 | 写一张 protection decision 流图,强调不执行恢复算法。 |
| `AuditEvidenceLineageFlow` | `OrganizeMethodAssetAuditTrail`;`LinkMethodAssetEvidenceLineage` | `MethodAssetAuditTrail`;evidence lineage refs;history refs;trace subject ref | audit organized / lineage linked / unsafe body rejected / missing marker。 | 写一张 safe audit / evidence lineage 流图,强调不保存证据正文或 raw audit log。 |
| `TraceImpactAuditReadFlow` | 7 个 Query | trace material;impact summary;protection diagnostic;audit trail;evidence lineage | found / not found;stale / unavailable;unknown impact;safe diagnostic。 | 写轻量只读说明,复用通用 Query 图。 |
| `TraceImpactAuditEventCandidate` | 5 个 Outbound Event | trace ref;impact ref;policy ref;audit ref;lineage ref;trace context | candidate produced / no candidate;delivery deferred。 | 写统一事件候选说明,不画 relay。 |

#### R1.15.4 不展开和后置项

| 项 | 当前裁决 | 理由 |
|---|---|---|
| raw log / telemetry / trace span | 排除 | 本组成部分只保存 body-free trace / audit material,不保存运行日志或遥测正文。 |
| 证据文件正文 / artifact 包体 / archive 内容 | 排除 | evidence lineage 只能保存 ref / marker / digest / safe summary,不得保存正文。 |
| 下游运行状态扫描 | 排除 | impact summary 只承接正式摘要和 ref,不读取 process / identity / runtime / member-images 内部 truth。 |
| consistency recovery job | 后置到后台维护与收敛 | protection decision 可指出 unknown / pending / protected,但不执行 recovery。 |
| 每个 Query 单独画完整图 | 不逐个画 | 可复用通用 Query 只读路径,本组成部分补 trace subject、unknown impact、safe audit 和 diagnostic 边界。 |
| relation integrity 处理流 | 后置到关系与分发语义 | 本模块可承接 relation 变化 trace,但不评估 relation integrity。 |

#### R1.15.5 风险诊断

| 风险 | 影响 | R1.16 处理 |
|---|---|---|
| trace material 被当成第二 truth | 会绕过 definition / formal version / consumption material 的 owner。 | trace flow 中明确只组织追溯线索,不替代业务 truth。 |
| unknown impact 被折叠成 no impact | 会静默破坏既有正式消费保护。 | impact flow 中明确 unknown / pending 必须显式保留。 |
| protection decision 被写成 recovery execution | 会把维护 / worker / 恢复算法塞进业务流。 | protection flow 中只写 decision / diagnostic,恢复后置。 |
| audit trail 保存 raw log | 会引入日志正文、event payload 或 report body。 | audit flow 中只允许 safe audit summary / history refs / lineage refs。 |
| evidence lineage 保存证据正文 | 会把外部证据、artifact 或标准正文带入本仓。 | lineage flow 中只允许 refs、markers、digest hints。 |

#### R1.15.6 下一写入批次结构

下一批 `R1.16 追溯与一致性保护处理流:再写入` 只写:

1. `本组成部分写入说明`。
2. `TraceMaterialOrganizationFlow` ASCII 图和关键说明。
3. `ConsumptionImpactSummaryFlow` ASCII 图和关键说明。
4. `ConsistencyProtectionDecisionFlow` ASCII 图和关键说明。
5. `AuditEvidenceLineageFlow` ASCII 图和关键说明。
6. `TraceImpactAuditReadFlow` 轻量读路径说明。
7. `TraceImpactAuditEventCandidate` 统一事件候选说明。
8. `接口覆盖 / 不展开理由表`。
9. `本模块停审记录`。

#### R1.15.7 下一写入批次边界

下一批不得写关系与分发语义处理流,不得写 recovery job、refresh job、worker、scheduler、retry、raw log、event payload、证据正文、artifact 包体、report body 或下游运行状态,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

#### R1.15.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写具体处理流图正文。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 7 个 Command、7 个 Query、5 个 Outbound Event。 |
| 是否以当前 R1 接口为准 | pass | 未恢复旧 raw audit / outbox / report body / recovery worker 主线。 |
| 是否区分 trace / impact / protection / audit-lineage | pass | 已列为不同处理流职责。 |
| 是否排除 raw log、证据正文和下游运行 truth | pass | 明确只保存 body-free summary / ref / marker / digest。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `追溯与一致性保护处理流:再写入`;只写本组成部分 trace material、impact summary、consistency protection、audit / evidence lineage、read 和 event candidate 处理流,不得写关系与分发语义处理流,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.16 追溯与一致性保护处理流:再写入

#### R1.16.1 本组成部分写入说明

本模块只写 `追溯与一致性保护` 的处理流。它承接 Step 7 当前接口骨架中的 7 个 Command、7 个 Query 和 5 个 Outbound Event,并回指 Step 6 的 `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy`、`MethodAssetAuditTrail`、`TraceSubjectRef`、`ConsumptionImpactSourceRef` 和 evidence lineage 线索。

本模块只组织 body-free trace、impact、protection、audit 和 lineage 材料。它不保存 raw log、trace span、event payload、证据正文、artifact 包体、archive 内容、report body 或下游运行 truth;恢复收敛和材料刷新后置到 `后台维护与收敛`。

#### R1.16.2 TraceMaterialOrganizationFlow

覆盖接口:

- `OrganizeMethodAssetTraceMaterial`
- `MarkMethodAssetTraceMaterialState`

```text
<Trace Material Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - TraceSubjectRef
  - FormalMethodAssetVersionRef optional
  - MethodAssetConsumptionMaterialRef optional
  - FormalizationBasisSummaryRefSet optional
  - MethodAssetTraceMaterialRef optional
  - state marker summary / safe reason ref optional
        |
        v
<Command Gate>
  - validate trace subject and typed refs
  - reject raw log / trace span / event payload
  - reject external body / evidence body / report body
        |
        v
<Load Trace Sources>
  - load formal version summary when present
  - load consumption material summary when present
  - load basis / external summary refs when present
  - load existing trace material when marking state
        |
        v
<Organize Trace Material>
  - bind trace subject
  - attach source refs and safe lineage hints
  - mark organized / stale / incomplete / unavailable
  - reject subject mismatch
        |
        v
<Persist Trace Material>
  - save MethodAssetTraceMaterial summary
  - do not modify definition / formal version / consumption truth
  - do not start refresh job
        |
        v
<Trace Material Result>
  - MethodAssetTraceMaterialRef
  - trace material state summary
  - MethodAssetTraceMaterialChanged candidate
```

关键设计点:

- trace material 只解释变化来源、正式语义锚点和消费语境线索,不得替代 definition truth、formal version truth、relation truth 或 consumption material truth。
- `TraceSubjectRef` 是稳定主体边界,不得从旧对象名、字符串、artifact path、下游 id 或 URL 推导。
- stale / incomplete / unavailable 只是追溯材料状态线索,不得修复来源 truth,也不得启动刷新或恢复 job。

#### R1.16.3 ConsumptionImpactSummaryFlow

覆盖接口:

- `RegisterConsumptionImpactSummary`
- `MarkConsumptionImpactDisposition`

```text
<Consumption Impact Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - ConsumptionImpactSourceRef
  - MethodAssetDefinitionRef
  - FormalMethodAssetVersionRef optional
  - ConsumptionContextRefSet
  - impact summary / disposition marker / safe reason ref
        |
        v
<Command Gate>
  - validate impact source and affected refs
  - reject downstream runtime state / payload / execution result
  - reject UI state / marketplace fulfillment / member state body
        |
        v
<Classify Impact Summary>
  - candidate / confirmed / unknown / dismissed / accepted
  - bind affected definition / version / context refs
  - keep unknown explicit when impact cannot be decided
        |
        v
<Persist Impact Summary>
  - save ConsumptionImpactSummary
  - connect to protection policy when applicable
  - do not scan downstream internal truth
        |
        v
<Impact Result>
  - ConsumptionImpactSummaryRef
  - impact disposition summary
  - ConsumptionImpactSummaryChanged candidate
```

关键设计点:

- `ConsumptionImpactSummary` 只承接影响摘要、影响来源 ref 和受影响上下文 refs,不读取或保存下游运行事实。
- unknown / pending 必须显式保留,不得被写成 no impact。
- impact summary 说明影响,不执行保护动作、不同步等待所有下游,也不启动 recovery。

#### R1.16.4 ConsistencyProtectionDecisionFlow

覆盖接口:

- `EstablishConsistencyProtectionDecision`

```text
<Consistency Protection Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - ConsistencyProtectionPolicyRef
  - FormalMethodAssetVersionRef
  - ConsumptionImpactSummaryRef optional
  - MethodAssetTraceMaterialRef optional
  - protected context refs optional
        |
        v
<Protection Gate>
  - validate policy and formal version refs
  - reject recovery script / worker state / retry config
  - reject maintenance run result as decision input
        |
        v
<Evaluate Protection Need>
  - existing formal consumption protected?
  - impact unknown or pending?
  - trace material incomplete?
  - no-action safe?
        |
        v
<Record Protection Decision>
  - protected / pending / unknown / no-action
  - safe reason refs
  - protected context refs
        |
        v
<Protection Result>
  - protection decision summary
  - unknown reason ref when applicable
  - ConsistencyProtectionDecisionChanged candidate
```

关键设计点:

- protection decision 只表达一致性保护判断,不执行恢复、刷新、告警、重试或 worker 调度。
- decision 可以指出 unknown / pending / protected,并给后台维护或正式介入留下线索,但不能绕过正式化、消费边界或外部正文边界。
- no-action 必须有 safe reason,不得因缺少影响材料而默认无影响。

#### R1.16.5 AuditEvidenceLineageFlow

覆盖接口:

- `OrganizeMethodAssetAuditTrail`
- `LinkMethodAssetEvidenceLineage`

```text
<Audit / Evidence Lineage Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - TraceSubjectRef
  - audit scope ref optional
  - history refs
  - external source refs / artifact archive refs
  - digest refs optional
        |
        v
<Safe Audit Gate>
  - validate trace subject and lineage refs
  - reject raw audit log / telemetry / metric / event body
  - reject artifact body / archive content / evidence file body / report body
        |
        v
<Organize Safe Audit Material>
  - bind trace subject
  - attach history refs and lineage refs
  - attach digest / marker hints only
  - mark unsafe body candidate rejected
        |
        v
<Persist Audit / Lineage Summary>
  - save MethodAssetAuditTrail summary
  - save or link evidence lineage summary
  - do not store evidence body
        |
        v
<Audit / Lineage Result>
  - MethodAssetAuditTrailRef or evidence lineage ref
  - safe audit / lineage summary
  - MethodAssetAuditTrailChanged candidate
  - MethodAssetEvidenceLineageChanged candidate when lineage changed
```

关键设计点:

- audit trail 组织 history refs、trace subject 和 lineage refs,不保存 raw audit log、telemetry、metric、event payload、outbox body 或 report body。
- evidence lineage 只保存 refs、markers、digest hints 和 safe summary,不得保存证据文件正文、artifact 包体、archive 内容、标准全文或验收报告正文。
- audit / lineage 材料是审计读取材料,不替代 trace material、impact summary 或业务 truth。

#### R1.16.6 TraceImpactAuditReadFlow

覆盖 Query:

| Query | 读取路径 | 输出边界 | 禁止事项 |
|---|---|---|---|
| `GetMethodAssetTraceMaterial` | 按 trace material ref 读取 trace summary。 | trace subject ref、formal version ref、consumption material ref、external summary refs。 | 不返回 raw log、event payload、外部正文、证据正文、handler report body 或刷新状态细节。 |
| `GetTraceBySubject` | 按 `TraceSubjectRef` 分页读取 trace material summary。 | trace material page、safe lineage hints。 | 不从字符串、旧对象名、artifact path 或下游 id 反推 subject。 |
| `GetConsumptionImpactSummary` | 按 impact summary ref 读取影响摘要。 | impact source ref、affected definition / version / context refs、disposition。 | 不返回下游运行状态、执行实例、成员状态、runtime binding、UI 状态或同步结果正文。 |
| `ListPendingConsumptionImpacts` | 按 formal version ref 或 consumption context ref 读取 pending / unknown impact page。 | pending / unknown impact summary page。 | 不把 unknown 自动解释为无影响;不扫描下游内部 truth。 |
| `GetConsistencyProtectionDiagnostic` | 按 policy ref 或 formal version ref 读取 protection diagnostic。 | protected contexts、unknown impact reason refs。 | 不暴露恢复算法、告警规则、重试策略、worker 状态或 maintenance run。 |
| `GetMethodAssetAuditTrail` | 按 audit trail ref 或 trace subject ref 读取 safe audit trail。 | history refs、evidence lineage refs、safe audit summary。 | 不返回 raw audit log、telemetry、metric、event payload、outbox body 或 report body。 |
| `GetMethodAssetEvidenceLineage` | 按 evidence lineage ref 或 trace subject ref 读取 lineage summary。 | external source refs、artifact archive refs、digest refs。 | 不返回证据文件正文、artifact 包体、archive 内容、标准全文或验收报告正文。 |

读取流通用骨架:

```text
<Trace / Impact / Audit Query>
  - ActorContext / QueryMetadata
  - typed selector ref
        |
        v
<Query Gate>
  - validate trace subject / impact / policy / audit / lineage selector
  - reject raw body and worker state request
        |
        v
<Load Safe Read Source>
  - trace material / impact summary / protection diagnostic / audit trail / lineage summary
        |
        +--> found
        |       |
        |       v
        |   <Return body-free summary>
        |
        +--> not found / stale / unavailable / unknown
                |
                v
            <Return safe absence, unknown, or freshness hint>
```

关键设计点:

- 所有 Query 都是只读路径,不得组织 trace material、登记 impact、建立 protection decision、刷新材料或执行 recovery。
- unknown impact 是正式读取结果,不能被查询层折叠为 no impact。
- audit / evidence 读取只返回 refs、markers、digest hints 和 safe summary,不返回正文。

#### R1.16.7 TraceImpactAuditEventCandidate

| Event candidate | 来源 | 输出骨架 | 边界 |
|---|---|---|---|
| `MethodAssetTraceMaterialChanged` | trace material organized / state marked。 | `MethodAssetTraceMaterialRef`;`TraceSubjectRef`;change kind;safe reason ref;trace context。 | 不携带 trace material 正文、raw log、topic / payload schema 或投递策略。 |
| `ConsumptionImpactSummaryChanged` | impact summary registered / disposition changed。 | `ConsumptionImpactSummaryRef`;`ConsumptionImpactSourceRef`;impact disposition;trace context。 | 不携带下游运行状态、payload 或执行结果正文。 |
| `ConsistencyProtectionDecisionChanged` | protection decision established / changed。 | `ConsistencyProtectionPolicyRef`;`FormalMethodAssetVersionRef`;protected context refs;trace context。 | 不声明 recovery 已执行,不携带恢复计划或 worker 状态。 |
| `MethodAssetAuditTrailChanged` | audit trail organized / lineage attached。 | `MethodAssetAuditTrailRef`;`TraceSubjectRef`;audit scope ref;trace context。 | 不携带 raw audit log、report body 或 evidence body。 |
| `MethodAssetEvidenceLineageChanged` | evidence lineage linked / superseded。 | evidence lineage ref;`TraceSubjectRef`;external / artifact ref hints;trace context。 | 不携带 artifact 包体、archive 内容、证据正文或标准全文。 |

事件候选只说明本仓 trace / impact / protection / audit / lineage 事实已经变化。topic、payload schema、outbox、relay、subscriber、retry、delivery state、maintenance job 调度和 recovery 结果全部后置。

#### R1.16.8 接口覆盖 / 不展开理由表

| 对象 | 覆盖情况 | 说明 |
|---|---|---|
| 7 个 Command | covered | trace 2 个 Command、impact 2 个 Command、protection 1 个 Command、audit / evidence 2 个 Command 均已覆盖。 |
| 7 个 Query | covered_by_lightweight_read | 复用通用 Query 只读路径,本模块补 trace subject、unknown impact、protection diagnostic、safe audit / lineage 边界。 |
| 5 个 Outbound Event | covered_by_event_candidate | 只写事件候选产生,不写 delivery / outbox / relay。 |
| Inbound Consumer | not_applicable | 本组成部分无 Inbound;外部证据和下游影响必须先成为 body-free summary / ref。 |
| Operations Job | not_applicable | trace refresh、impact material refresh 和 recovery convergence 后置到 `后台维护与收敛`。 |
| 关系与分发语义 | deferred | relation 变化可进入 trace,但 relation truth / integrity / distribution 处理流由后续组成部分处理。 |

#### R1.16.9 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入本组成部分处理流 | pass | 已写 trace material、impact summary、protection、audit / evidence lineage、read 和 event candidate。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 7 个 Command、7 个 Query、5 个 Outbound Event。 |
| 是否以当前 R1 接口为准 | pass | 使用 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.34` 的当前接口名。 |
| 是否避免 trace material 第二 truth | pass | trace 只组织线索,不替代 definition / formal version / consumption truth。 |
| 是否保留 unknown impact | pass | unknown / pending 不折叠为 no impact。 |
| 是否避免 recovery 越界 | pass | protection decision 不执行恢复、刷新或 worker 调度。 |
| 是否排除 raw log / 证据正文 / 下游运行 truth | pass | 只允许 body-free summary、refs、markers 和 digest hints。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `关系与分发语义处理流:先思考`;只思考关系与分发语义组成部分关键处理流族、覆盖接口和不展开理由,不得直接写处理流图正文,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.17 关系与分发语义处理流:先思考

#### R1.17.1 问题回答

- 本模块只思考 `关系与分发语义` 的处理流族,不直接写具体处理流图正文,不进入 `外部摘要与引用`。
- 当前有效接口来源必须以 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.34` 为准:10 个 Command、9 个 Query、5 个 Outbound Event,没有本组成部分 Inbound Consumer 和 Operations Job。
- 核心对象来源是 Step 6 的 `MethodAssetRelation`、`MethodAssetDistributionRef`、`RelationIntegrityRule`、`RelatedMethodAssetRef`、`DistributionContextRef` 和 relation / distribution read material 线索。处理流必须分别承接 relation truth、integrity、distribution ref、distribution availability 和 read material invalidation。
- 关系与分发语义不是运行依赖图、推荐图、搜索索引、UI 分类或 marketplace 交易。它只表达方法资产之间的正式语义关系和分发语义引用。
- relation view、distribution read material 和 material invalidation 是派生读取线索或维护提示,不得修 relation truth,不得执行 graph traversal、recommendation、marketplace listing 或 worker refresh。

#### R1.17.2 接口覆盖判断

| 接口组 | 当前接口 | 候选裁决 | 理由 |
|---|---|---|---|
| relation lifecycle | `EstablishMethodAssetRelation`;`AdjustMethodAssetRelation`;`ConstrainMethodAssetRelation`;`SupersedeMethodAssetRelation`;`RetireMethodAssetRelation` | 独立处理流族 | 关系有端点、语义、范围、替代和退役生命周期,必须显式覆盖。 |
| relation integrity | `EvaluateRelationIntegrity`;`MarkRelationIntegrityViolation` | 独立处理流族 | integrity rule 横跨端点、正式化、分发和外部边界,不能散落在 relation lifecycle 中。 |
| distribution ref / availability | `PrepareMethodAssetDistributionRef`;`AdjustMethodAssetDistributionContext`;`MarkMethodAssetDistributionAvailability` | 独立处理流族 | distribution ref 是分发语义边界,availability marker 不能等同 marketplace 或下游同步状态。 |
| relation / distribution reads | `GetMethodAssetRelation`;`ListMethodAssetRelationsByEndpoint`;`ListMethodAssetRelationsByFormalVersion`;`ListMethodAssetRelationsByDistributionContext`;`GetRelationIntegrityDiagnostic`;`GetRelationChangeSummary`;`ResolveMethodAssetDistributionRef`;`GetDistributionReadMaterial`;`ListDistributionReadMaterialsByContext` | 通用 Query 路径 + 重点说明 | 均为只读;endpoint / formal version / distribution context resolution、diagnostic、relation change summary 和 distribution material 边界需要补充说明。 |
| relation / distribution events | `MethodAssetRelationChanged`;`MethodAssetRelationIntegrityChanged`;`MethodAssetDistributionRefChanged`;`MethodAssetDistributionAvailabilityChanged`;`MethodAssetRelationReadMaterialInvalidated` | 统一事件说明 | 只表达 relation / integrity / distribution fact candidate 或 invalidation hint,不写 topic / payload / outbox / relay。 |
| Inbound / Job | 无 | 不展开 | 外部关系线索必须先成为 external summary / ref;relation view refresh 和 distribution material refresh 归后台维护与收敛。 |

#### R1.17.3 预计处理流族

| 处理流族 | 覆盖接口 | 主要对象 | 关键分支 | 后续 R1.18 写法 |
|---|---|---|---|---|
| `MethodAssetRelationLifecycleFlow` | `EstablishMethodAssetRelation`;`AdjustMethodAssetRelation`;`ConstrainMethodAssetRelation`;`SupersedeMethodAssetRelation`;`RetireMethodAssetRelation` | `MethodAssetRelation`;source / target refs;relation kind;distribution context;trace subject | established / adjusted / constrained / superseded / retired;endpoint invalid;scope limited。 | 写一张 relation lifecycle 流图,强调 relation truth 不等于运行依赖图或推荐图。 |
| `RelationIntegrityFlow` | `EvaluateRelationIntegrity`;`MarkRelationIntegrityViolation` | `RelationIntegrityRule`;relation endpoint refs;formalization refs;distribution refs | integrity pass / violation / unknown / marked;no auto repair。 | 写一张 integrity evaluation / violation marker 流图,强调不执行图算法或 policy engine。 |
| `DistributionReferenceFlow` | `PrepareMethodAssetDistributionRef`;`AdjustMethodAssetDistributionContext`;`MarkMethodAssetDistributionAvailability` | `MethodAssetDistributionRef`;`DistributionContextRef`;definition / formal version refs;availability marker | prepared / active / context adjusted / unavailable / blocked;marketplace boundary rejected。 | 写一张 distribution ref / availability 流图,强调不表示 listing、交易、安装或履约。 |
| `RelationDistributionReadFlow` | 9 个 Query | relation truth / relation view;distribution ref;distribution read material;integrity diagnostic | found / not found;stale / invalidated;diagnostic safe reason;no graph traversal。 | 写轻量只读说明,复用通用 Query 图。 |
| `RelationDistributionEventCandidate` | 5 个 Outbound Event | relation ref;integrity rule ref;distribution ref;availability marker;invalidation hint | candidate produced / invalidation hint / delivery deferred。 | 写统一事件候选说明,不画 relay 或 refresh job。 |

#### R1.17.4 不展开和后置项

| 项 | 当前裁决 | 理由 |
|---|---|---|
| 运行依赖图 / 调用图 / 图遍历算法 | 排除 | `MethodAssetRelation` 只表达定义性关系,不表达 runtime dependency。 |
| 推荐、相似度、搜索排序、UI 分类 | 排除 | 这些是发现 / 展示 / 算法结果,不得成为 relation truth。 |
| marketplace listing / 订单 / 安装 / 履约 | 排除 | `MethodAssetDistributionRef` 只表达分发语义引用,不承接交易和履约。 |
| relation view / distribution material refresh job | 后置到后台维护与收敛 | 本组成部分可产生 invalidation hint,但不执行 refresh。 |
| 每个 Query 单独画完整图 | 不逐个画 | 可复用通用 Query 只读路径,本组成部分补 endpoint、formal version、distribution context 和 diagnostic 边界。 |
| package / method set organization | 后置到外围包与方法集组织 | distribution ref 可被外围组织使用,但 package / method set truth 不在本组成部分建立。 |

#### R1.17.5 风险诊断

| 风险 | 影响 | R1.18 处理 |
|---|---|---|
| relation 被写成运行依赖图 | 会把 runtime / process / package 内部结构迁入本仓 truth。 | relation lifecycle 明确只使用 typed method asset refs 和 relation kind。 |
| integrity evaluation 被写成图算法或推荐算法 | 会越过概要边界并污染关系语义。 | integrity flow 只写 rule result / violation marker,不写算法实现。 |
| distribution ref 被写成 marketplace fact | 会把 listing、订单、安装履约带入 L3。 | distribution flow 明确拒绝 marketplace / installation / delivery facts。 |
| relation read 触发 material refresh | 会让 Query 产生副作用。 | read flow 明确只返回 stale / invalidation hint,刷新后置。 |
| relation change history 成为第二 truth | 会与追溯与审计对象冲突。 | read flow 只返回 trace handoff / summary,不创建独立 history truth。 |

#### R1.17.6 下一写入批次结构

下一批 `R1.18 关系与分发语义处理流:再写入` 只写:

1. `本组成部分写入说明`。
2. `MethodAssetRelationLifecycleFlow` ASCII 图和关键说明。
3. `RelationIntegrityFlow` ASCII 图和关键说明。
4. `DistributionReferenceFlow` ASCII 图和关键说明。
5. `RelationDistributionReadFlow` 轻量读路径说明。
6. `RelationDistributionEventCandidate` 统一事件候选说明。
7. `接口覆盖 / 不展开理由表`。
8. `本模块停审记录`。

#### R1.17.7 下一写入批次边界

下一批不得写外部摘要与引用处理流,不得写 graph traversal、recommendation、search ranking、marketplace listing、order、installation、fulfillment、package truth、method set truth、refresh job、worker 或 projection storage,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

#### R1.17.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写具体处理流图正文。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 10 个 Command、9 个 Query、5 个 Outbound Event。 |
| 是否以当前 R1 接口为准 | pass | 未恢复旧运行依赖图、推荐、搜索索引或 marketplace 主线。 |
| 是否区分 relation / integrity / distribution | pass | 已列为不同处理流职责。 |
| 是否排除 marketplace、安装履约和图算法 | pass | 明确仅表达关系 truth、分发语义引用和读取材料边界。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `关系与分发语义处理流:再写入`;只写本组成部分 relation lifecycle、relation integrity、distribution ref / availability、relation / distribution read 和 event candidate 处理流,不得写外部摘要与引用处理流,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.18 关系与分发语义处理流:再写入

#### R1.18.1 本组成部分写入说明

本模块只写 `关系与分发语义` 的关键处理流。它覆盖方法资产之间的正式关系 truth、关系完整性诊断、分发语义引用、分发可用性标记、关系 / 分发读取和事件候选。

本模块不写运行依赖图、调用图、推荐 / 相似度、搜索排序、UI 分类、marketplace listing、交易、安装、履约、package truth、method set truth、refresh job、worker、projection storage、topic、payload schema 或 outbox relay。

#### R1.18.2 MethodAssetRelationLifecycleFlow

覆盖接口:

- `EstablishMethodAssetRelation`
- `AdjustMethodAssetRelation`
- `ConstrainMethodAssetRelation`
- `SupersedeMethodAssetRelation`
- `RetireMethodAssetRelation`

```text
<Relation Lifecycle Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - source RelatedMethodAssetRef
  - target RelatedMethodAssetRef
  - relation kind / relation scope summary
  - optional DistributionContextRef / trace subject
        |
        v
<Relation Boundary Gate>
  - validate typed endpoint refs
  - validate relation kind and scope summary
  - reject runtime dependency / call graph / recommendation / UI category material
  - reject marketplace / installation / fulfillment facts
        |
        v
<Load Relation Truth>
  - find existing MethodAssetRelation when adjusting / constraining / superseding / retiring
  - load source / target availability hints only as boundary inputs
        |
        +--> establish
        |       |
        |       v
        |   <Create MethodAssetRelation>
        |
        +--> adjust / constrain
        |       |
        |       v
        |   <Update relation summary and constraints>
        |
        +--> supersede / retire
                |
                v
            <Close current relation lifecycle>
        |
        v
<Persist Relation Truth>
  - save MethodAssetRelation
  - append safe RelationChangeHistory hint
  - produce read material invalidation hint
        |
        v
<Relation Result>
  - MethodAssetRelationRef
  - relation lifecycle summary
  - MethodAssetRelationChanged candidate
  - MethodAssetRelationReadMaterialInvalidated candidate
```

关键设计点:

- `MethodAssetRelation` 只表达本仓认可的方法资产语义关系,不表达 runtime dependency、函数调用图、包依赖、推荐关系或 UI 分类。
- relation endpoint 必须是 typed `RelatedMethodAssetRef` / formal version / distribution context 等概要对象线索,不得从字符串、URL、marketplace listing id 或下游运行 id 拼接。
- constrain / supersede / retire 只改变关系 truth 的生命周期和约束摘要,不得修改 definition truth、formal version truth、consumption boundary 或 package / method set truth。
- relation change 可以产生 read material invalidation hint,但刷新动作后置到 `后台维护与收敛`。

#### R1.18.3 RelationIntegrityFlow

覆盖接口:

- `EvaluateRelationIntegrity`
- `MarkRelationIntegrityViolation`

```text
<Relation Integrity Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - MethodAssetRelationRef or endpoint relation selector
  - RelationIntegrityRuleRef / evaluation scope summary
  - safe reason refs
        |
        v
<Integrity Evaluation Gate>
  - load MethodAssetRelation and relation constraints
  - load formalization / distribution / consumption boundary hints required by rule
  - reject graph traversal algorithm / recommendation scoring / runtime dependency scan
        |
        v
<Evaluate RelationIntegrityRule>
  - relation consistent
  - relation violation detected
  - relation integrity unknown / pending
        |
        +--> pass
        |       |
        |       v
        |   <Record diagnostic pass summary>
        |
        +--> violation
        |       |
        |       v
        |   <Mark violation with safe reason ref>
        |
        +--> unknown / pending
                |
                v
            <Record unknown integrity disposition>
        |
        v
<Integrity Result>
  - RelationIntegrityRuleRef / diagnostic ref
  - integrity disposition summary
  - optional violation marker
  - MethodAssetRelationIntegrityChanged candidate
```

关键设计点:

- integrity evaluation 是规则级诊断,不是自动修复、图算法执行、recommendation engine 或 policy enforcement runtime。
- `MarkRelationIntegrityViolation` 只能标记安全 violation summary 和 reason ref,不得保存外部正文、运行日志、artifact 包体或下游状态正文。
- unknown / pending 是有效结果,不得被折叠为 pass。需要补材料时只能产生维护或正式介入线索。
- integrity 结果不得绕过正式化与版本、受控消费或外部摘要边界去直接改 truth。

#### R1.18.4 DistributionReferenceFlow

覆盖接口:

- `PrepareMethodAssetDistributionRef`
- `AdjustMethodAssetDistributionContext`
- `MarkMethodAssetDistributionAvailability`

```text
<Distribution Reference Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - MethodAssetDefinitionRef / FormalMethodAssetVersionRef
  - DistributionContextRef
  - distribution semantic summary
  - availability marker / safe reason refs
        |
        v
<Distribution Boundary Gate>
  - validate definition / formal version anchor
  - validate DistributionContextRef
  - reject marketplace listing / order / install / fulfillment / package body
  - reject provider payload / external artifact body
        |
        v
<Prepare or Adjust Distribution Ref>
  - prepare MethodAssetDistributionRef
  - adjust distribution context summary
  - mark available / unavailable / blocked / stale
        |
        v
<Persist Distribution Semantics>
  - save MethodAssetDistributionRef
  - save availability marker / context summary
  - produce distribution read material invalidation hint
        |
        v
<Distribution Result>
  - MethodAssetDistributionRef
  - distribution context summary
  - availability summary
  - MethodAssetDistributionRefChanged candidate
  - MethodAssetDistributionAvailabilityChanged candidate
```

关键设计点:

- `MethodAssetDistributionRef` 是分发语义引用,不是 marketplace listing、交易商品、安装包、下载地址、履约记录或 provider payload。
- availability marker 表示本仓对分发语义引用的安全可用性判断,不表示外部系统同步成功、订单状态或安装状态。
- distribution context 可以被关系、消费和外围组织引用,但不能反向创建 package truth、method set truth 或外部来源 truth。
- 分发读取材料的失效只产生 invalidation hint,刷新和修复由后台维护与收敛处理。

#### R1.18.5 RelationDistributionReadFlow

覆盖 Query:

| Query | 读取路径 | 输出边界 | 禁止事项 |
|---|---|---|---|
| `GetMethodAssetRelation` | 按 relation ref 读取 relation truth / safe view。 | relation endpoint refs、kind、scope、lifecycle summary。 | 不返回调用图、运行依赖、推荐分数、UI category 或 marketplace fact。 |
| `ListMethodAssetRelationsByEndpoint` | 按 typed endpoint ref 分页读取 relation view。 | relation page、safe relation summaries。 | 不从字符串、URL、external id 或下游 runtime id 反推 endpoint。 |
| `ListMethodAssetRelationsByFormalVersion` | 按 formal version ref 读取相关 relation view。 | formal version relation page。 | 不触发正式化、版本修复或关系重建。 |
| `ListMethodAssetRelationsByDistributionContext` | 按 distribution context 读取 relation / distribution view。 | context-scoped relation page。 | 不解释 marketplace listing、安装或履约状态。 |
| `GetRelationIntegrityDiagnostic` | 按 relation / rule ref 读取 integrity diagnostic。 | pass / violation / unknown / pending summary。 | 不执行修复、不运行图算法、不读取 raw evidence body。 |
| `GetRelationChangeSummary` | 按 relation ref 读取安全变更摘要。 | safe change history / trace refs。 | 不返回 raw audit log、event payload、external body 或 full history truth。 |
| `ResolveMethodAssetDistributionRef` | 按 typed selector 解析 distribution ref。 | distribution ref、context summary、availability marker。 | 不从 URL、listing id、package path 或 provider id 私造 ref。 |
| `GetDistributionReadMaterial` | 按 distribution ref 读取材料。 | body-free distribution material、freshness / availability hints。 | 不返回 artifact body、archive 包、安装包、下载地址或 provider payload。 |
| `ListDistributionReadMaterialsByContext` | 按 distribution context 分页读取材料。 | distribution material page。 | 不刷新材料、不扫描 marketplace、不补写 package / method set。 |

读取流通用骨架:

```text
<Relation / Distribution Query>
  - ActorContext / QueryMetadata
  - relation ref / endpoint ref / formal version ref / distribution context ref
        |
        v
<Query Boundary Gate>
  - validate typed selector
  - reject graph traversal / recommendation / marketplace / installation material request
        |
        v
<Load Relation or Distribution Read Source>
  - MethodAssetRelation / relation view
  - RelationIntegrityDiagnostic
  - MethodAssetDistributionRef / DistributionReadMaterial
        |
        +--> found
        |       |
        |       v
        |   <Return body-free relation / distribution summary>
        |
        +--> missing / stale / invalidated / unavailable
                |
                v
            <Return safe absence / freshness / unavailable hint>
```

关键设计点:

- 所有 Query 都是只读路径,不得建立关系、修复完整性、刷新读取材料或创建 distribution ref。
- relation change summary 只返回 safe refs、summary 和 trace handoff,不成为第二套 relation history truth。
- stale / invalidated 只表达读取材料状态,不得在 Query 中直接调用后台刷新。

#### R1.18.6 RelationDistributionEventCandidate

| Event candidate | 来源 | 输出骨架 | 边界 |
|---|---|---|---|
| `MethodAssetRelationChanged` | relation established / adjusted / constrained / superseded / retired。 | `MethodAssetRelationRef`;source / target refs;change kind;safe reason ref;trace context。 | 不携带调用图、推荐分数、UI category、runtime dependency 或 payload schema。 |
| `MethodAssetRelationIntegrityChanged` | integrity evaluated / violation marked / unknown disposition changed。 | relation ref;rule ref;integrity disposition;violation marker;trace context。 | 不携带算法细节、raw evidence、外部正文或自动修复结果。 |
| `MethodAssetDistributionRefChanged` | distribution ref prepared / context adjusted。 | `MethodAssetDistributionRef`;definition / formal version refs;context ref;change kind。 | 不携带 listing、订单、安装包、URL、provider payload 或 archive body。 |
| `MethodAssetDistributionAvailabilityChanged` | availability marked available / unavailable / blocked / stale。 | distribution ref;availability marker;safe reason ref;trace context。 | 不表示外部同步成功、安装成功、履约完成或交易状态。 |
| `MethodAssetRelationReadMaterialInvalidated` | relation / distribution truth changed or integrity disposition changed。 | affected relation / distribution refs;invalidation reason;refresh scope hint。 | 不执行 refresh,不声明 projection 已重建,不携带 worker / queue / retry 状态。 |

事件候选只说明本仓 relation / integrity / distribution 事实或读取材料失效线索已经变化。topic、payload schema、outbox、relay、subscriber、retry、delivery state、worker refresh 和 projection rebuild 全部后置。

#### R1.18.7 接口覆盖 / 不展开理由表

| 对象 | 覆盖情况 | 说明 |
|---|---|---|
| 10 个 Command | covered | relation lifecycle 5 个、integrity 2 个、distribution ref / availability 3 个均已覆盖。 |
| 9 个 Query | covered_by_lightweight_read | 复用通用 Query 只读路径,本模块补 endpoint、formal version、distribution context、diagnostic 和 availability 边界。 |
| 5 个 Outbound Event | covered_by_event_candidate | 只写事件候选产生和输出骨架,不写 delivery / outbox / relay。 |
| Inbound Consumer | not_applicable | 本组成部分无 Inbound;外部关系线索必须先进入外部摘要与引用形成 body-free summary / ref。 |
| Operations Job | not_applicable | relation / distribution read material refresh 后置到后台维护与收敛。 |
| 外部摘要与引用 | deferred | external summary / ref / body boundary 处理流由下一组成部分独立处理。 |
| 外围包与方法集组织 | deferred | package / method set 可引用 distribution ref,但外围组织 truth 由后续组成部分处理。 |

#### R1.18.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入本组成部分处理流 | pass | 已写 relation lifecycle、integrity、distribution ref / availability、read 和 event candidate。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 10 个 Command、9 个 Query、5 个 Outbound Event。 |
| 是否以当前 R1 接口为准 | pass | 使用 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.34` 的当前接口名。 |
| 是否避免运行依赖图 / 图算法污染 | pass | 明确 relation 不是 runtime dependency、call graph、recommendation 或 search ranking。 |
| 是否避免 marketplace / 安装履约污染 | pass | distribution ref 不表示 listing、order、install、fulfillment 或 provider payload。 |
| 是否避免 Query 副作用 | pass | 读取只返回 summary / hint,不创建 relation、不刷新 material、不修复 integrity。 |
| 是否避免后台维护越界 | pass | invalidation hint 不等于 refresh 已执行。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `外部摘要与引用处理流:先思考`;只思考外部摘要与引用组成部分关键处理流族、覆盖接口和不展开理由,不得直接写处理流图正文,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.19 外部摘要与引用处理流:先思考

#### R1.19.1 问题回答

- 本模块只思考 `外部摘要与引用` 的处理流族,不直接写具体处理流图正文,不进入 `后台维护与收敛`。
- 当前有效接口来源必须以 Step 7 `R1.24` / `R1.26` / `R1.28` / `R1.30` / `R1.34` 为准:9 个 Command、8 个 Query、4 个 Inbound Consumer、5 个 Outbound Event,没有本组成部分 Operations Job。
- 核心对象来源是 Step 6 的 `ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef`、`ExternalBodyBoundaryRule`、`ExternalSourceSummaryView`、`ExternalBasisAcceptanceHistory`、`MethodAssetEvidenceLineage` 和相关 typed ref / marker。处理流必须分别承接 external summary truth、external source ref、artifact archive ref、body boundary、external basis disposition、evidence lineage、inbound intake 和 read material。
- 外部摘要与引用是本仓唯一 Inbound owner。所有外部标准、ADR、治理依据、artifact、archive、证据、marketplace 生态线索和外部关系线索,都必须先在这里被收窄为 body-free summary / typed ref / digest hint / marker / safe reason ref。
- 本组成部分不是外部正文仓库、webhook payload 仓库、artifact store、标准解释器、治理审批执行器、provider adapter、marketplace 集成或证据文件管理系统。

#### R1.19.2 接口覆盖判断

| 接口组 | 当前接口 | 候选裁决 | 理由 |
|---|---|---|---|
| external summary lifecycle | `CaptureExternalSourceSummary`;`AcceptExternalBasisSummary`;`MarkExternalBasisDisposition`;`SupersedeExternalSourceSummary` | 独立处理流族 | summary 捕获、接受、处置和替代是外部依据进入本仓语义的核心写流,必须显式守住 body-free。 |
| external source / artifact ref | `RegisterExternalSourceRef`;`RegisterArtifactArchiveRef` | 独立处理流族 | external source 和 artifact / archive ref 是防止 URL、path、provider id、object storage 路径私补的 typed boundary。 |
| body boundary | `AssertExternalBodyBoundary`;`RejectExternalBodyCandidate` | 独立处理流族 | 正文禁止边界横跨正式化、追溯、关系、外围组织和维护刷新,不能埋在 summary 写流中。 |
| external evidence lineage | `LinkExternalEvidenceLineage` | 独立或与 audit-safe lineage 合并处理流 | lineage 只保存 external source refs、artifact refs、digest hints 和 trace subject,不得保存 evidence body。 |
| bounded inbound intake | `ConsumeBodyFreeExternalSummaryAccepted`;`ConsumeExternalSourceRefRegistered`;`ConsumeArtifactArchiveRefRegistered`;`ConsumeExternalBodyBoundaryViolation` | 独立 Inbound 流族 | 本组成部分是唯一 Inbound owner;必须覆盖 envelope、idempotency、schema/version、dedup 和 body-free guard。 |
| external summary / ref reads | 8 个 Query | 通用 Query 路径 + 重点说明 | 均为只读;summary by source、source ref resolution、archive ref、body diagnostic、acceptance history 和 evidence lineage hint 需要补边界。 |
| external events | 5 个 Outbound Event | 统一事件说明 | 只表达 external summary/ref/archive/body boundary/evidence lineage fact candidate,不写 topic / payload / outbox / relay。 |
| Operations Job | 无 | 不展开 | external summary read material refresh 和 reference availability check 归后台维护与收敛,本组成部分不定义 job。 |

#### R1.19.3 预计处理流族

| 处理流族 | 覆盖接口 | 主要对象 | 关键分支 | 后续 R1.20 写法 |
|---|---|---|---|---|
| `ExternalSourceSummaryLifecycleFlow` | `CaptureExternalSourceSummary`;`AcceptExternalBasisSummary`;`MarkExternalBasisDisposition`;`SupersedeExternalSourceSummary` | `ExternalSourceSummary`;`ExternalSourceSummaryView`;`ExternalBasisAcceptanceHistory`;`ExternalBodyBoundaryRule` | captured / accepted / rejected / unavailable / stale / superseded;body-free guard failed。 | 写一张 summary lifecycle 流图,强调只承接 safe summary / marker / ref。 |
| `ExternalSourceArtifactRefFlow` | `RegisterExternalSourceRef`;`RegisterArtifactArchiveRef` | `ExternalSourceRef`;`ArtifactArchiveRef`;digest hints;source kind / namespace refs | source ref registered / duplicate / invalid;archive ref registered / invalid / body candidate rejected。 | 写一张 source / archive ref 注册流图,强调 opaque typed ref 和 no URL/path/provider payload。 |
| `ExternalBodyBoundaryFlow` | `AssertExternalBodyBoundary`;`RejectExternalBodyCandidate`;`ConsumeExternalBodyBoundaryViolation` | `ExternalBodyBoundaryRule`;violation ref;safe reason ref;candidate refs | accepted body-free / violation noticed / candidate rejected / unsafe material ignored。 | 写一张正文边界判断 / 拒绝流图,强调不是内容审查或标准解释。 |
| `ExternalEvidenceLineageFlow` | `LinkExternalEvidenceLineage` | `MethodAssetEvidenceLineage`;`ExternalSourceRef`;`ArtifactArchiveRef`;trace subject;digest refs | lineage linked / superseded / unsafe evidence body rejected。 | 写一张外部证据 lineage 连接流图,与追溯审计保持 body-free 接缝。 |
| `ExternalInboundIntakeFlow` | 4 个 Inbound Consumer | source envelope;source event id;schema/version;dedup key;summary/ref/archive/violation marker | accepted / ignored duplicate / rejected unsafe / deferred。 | 写一张 bounded inbound intake 流图,强调唯一 Inbound owner 和不接 raw event body。 |
| `ExternalSummaryReferenceReadFlow` | 8 个 Query | external summary / ref / archive / diagnostic / history / lineage hint read material | found / missing / stale / unavailable / diagnostic safe reason。 | 写轻量只读说明,复用通用 Query 图。 |
| `ExternalSummaryReferenceEventCandidate` | 5 个 Outbound Event | summary ref;source ref;artifact ref;boundary violation;lineage ref | candidate produced / stale hint / delivery deferred。 | 写统一事件候选说明,不画 relay 或 refresh job。 |

#### R1.19.4 不展开和后置项

| 项 | 当前裁决 | 理由 |
|---|---|---|
| raw document / standard / ADR / governance正文 | 排除 | 本仓只保存 safe summary、typed ref、digest hint、marker 和 safe reason ref。 |
| webhook payload / provider payload / external API response | 排除 | Inbound 只能承接 body-free fact,不得把 provider payload 当本仓 schema。 |
| artifact body / archive package / evidence file / object storage path | 排除 | artifact 和 archive 只能通过 `ArtifactArchiveRef`、digest hint 和 lineage ref 表达。 |
| 外部内容审查 / 标准解释 / 治理审批执行 | 排除 | `ExternalBodyBoundaryRule` 只判断入仓边界,不替代治理系统或标准解释器。 |
| external source availability refresh / source polling | 后置到后台维护与收敛 | 本组成部分可标记 unavailable / stale,但不执行外部拉取、轮询或刷新。 |
| 每个 Query 单独画完整图 | 不逐个画 | 可复用通用 Query 只读路径,本组成部分补 source/ref/archive/diagnostic/history/lineage 边界。 |
| relation / formalization / package 直接引用外部正文 | 排除 | 其他组成部分只能引用已接受的 external summary/ref,不能直接接正文。 |

#### R1.19.5 风险诊断

| 风险 | 影响 | R1.20 处理 |
|---|---|---|
| external summary 被写成正文副本 | 会把外部知识库、标准全文或 artifact 内容迁入本仓 truth。 | summary lifecycle 明确只保存 body-free marker、safe summary ref、digest hint 和 typed refs。 |
| external ref 被写成 URL / path / provider id | 会让实现侧私补 ref 生成规则,破坏 typed boundary。 | source / archive ref flow 明确 ref 是 opaque typed ref,不从外部字符串拼接。 |
| body boundary 被写成内容审查服务 | 会把标准解释、治理审批或 policy enforce 迁入 L3。 | boundary flow 只做入仓边界判断和拒绝记录,不解释内容。 |
| inbound consumer 接收 raw payload | 会恢复旧 webhook / governance gate consumer 污染。 | inbound flow 必须先 envelope / idempotency / body-free guard,只接 marker/ref/digest。 |
| evidence lineage 保存证据正文 | 会污染追溯和验收材料边界。 | lineage flow 只连接 refs、digest hints 和 trace subject。 |
| Query 触发外部拉取或 refresh | 会让读取路径产生副作用并越过后台维护。 | read flow 只返回 stale / unavailable / diagnostic hint,刷新后置。 |

#### R1.19.6 下一写入批次结构

下一批 `R1.20 外部摘要与引用处理流:再写入` 只写:

1. `本组成部分写入说明`。
2. `ExternalSourceSummaryLifecycleFlow` ASCII 图和关键说明。
3. `ExternalSourceArtifactRefFlow` ASCII 图和关键说明。
4. `ExternalBodyBoundaryFlow` ASCII 图和关键说明。
5. `ExternalEvidenceLineageFlow` ASCII 图和关键说明。
6. `ExternalInboundIntakeFlow` ASCII 图和关键说明。
7. `ExternalSummaryReferenceReadFlow` 轻量读路径说明。
8. `ExternalSummaryReferenceEventCandidate` 统一事件候选说明。
9. `接口覆盖 / 不展开理由表`。
10. `本模块停审记录`。

#### R1.19.7 下一写入批次边界

下一批不得写后台维护与收敛处理流,不得写 external polling、provider adapter、source availability worker、artifact storage、archive retention、object storage path、webhook payload schema、外部内容审查、标准解释、治理审批执行、topic、outbox、relay、retry、正式 `02-概要设计.md` 或 Step 9。

#### R1.19.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写具体处理流图正文。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 9 个 Command、8 个 Query、4 个 Inbound Consumer、5 个 Outbound Event。 |
| 是否以当前 R1 接口为准 | pass | 使用 Step 7 `R1.24` / `R1.26` / `R1.28` / `R1.30` / `R1.34` 的当前接口名。 |
| 是否保持唯一 Inbound owner | pass | 只让外部摘要与引用承接 body-free inbound fact。 |
| 是否排除 raw body / artifact body / provider payload | pass | 明确只允许 summary、typed ref、digest hint、marker 和 safe reason ref。 |
| 是否避免后台维护越界 | pass | external refresh / polling 后置到后台维护与收敛。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `外部摘要与引用处理流:再写入`;只写本组成部分 external summary lifecycle、source / artifact ref、body boundary、evidence lineage、inbound intake、read 和 event candidate 处理流,不得写后台维护与收敛处理流,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.20 外部摘要与引用处理流:再写入

#### R1.20.1 本组成部分写入说明

本模块只写 `外部摘要与引用` 的关键处理流。它覆盖外部安全摘要生命周期、外部来源 ref、artifact / archive ref、正文禁止边界、外部证据 lineage、bounded inbound intake、外部摘要 / 引用读取和事件候选。

本模块是本仓唯一 Inbound owner。它只允许外部事实以 body-free summary、typed ref、digest hint、marker、safe reason ref 和 trace context 进入本仓,不得保存 raw document、standard / ADR 全文、governance 执行正文、webhook payload、provider payload、artifact body、archive 包、evidence file、object storage path、marketplace 交易或安装履约正文。

#### R1.20.2 ExternalSourceSummaryLifecycleFlow

覆盖接口:

- `CaptureExternalSourceSummary`
- `AcceptExternalBasisSummary`
- `MarkExternalBasisDisposition`
- `SupersedeExternalSourceSummary`

```text
<External Summary Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - ExternalSourceRef
  - ExternalSafeSummary marker / summary ref / digest hint
  - optional ArtifactArchiveRef / GovernanceBasisRef / trace subject
        |
        v
<External Body-Free Gate>
  - validate ExternalSourceRef
  - validate safe summary marker / digest hint
  - apply ExternalBodyBoundaryRule
  - reject raw document / standard text / ADR body / artifact body / provider payload
        |
        v
<Load ExternalSourceSummary>
  - new summary capture
  - existing summary accepted / disposition changed
  - previous summary superseded
        |
        +--> capture
        |       |
        |       v
        |   <Create body-free ExternalSourceSummary>
        |
        +--> accept / mark disposition
        |       |
        |       v
        |   <Update acceptance state and safe reason refs>
        |
        +--> supersede
                |
                v
            <Link previous and next summary refs>
        |
        v
<Persist External Summary>
  - save ExternalSourceSummary
  - append ExternalBasisAcceptanceHistory hint
  - produce summary view invalidation hint
        |
        v
<External Summary Result>
  - ExternalSourceSummaryRef
  - acceptance / disposition summary
  - ExternalSourceSummaryChanged candidate
```

关键设计点:

- `ExternalSourceSummary` 是外部依据的安全摘要和承接状态载体,不是外部正文副本、标准解释结果、治理审批记录或 artifact 元数据镜像。
- capture / accept / disposition / supersede 必须经过 `ExternalBodyBoundaryRule`,不能把 unsafe candidate 当 summary 保存。
- supersede 只建立摘要替代线索,不删除历史摘要,也不重写已经成立的 formal version、relation、trace 或 package truth。
- unavailable / stale / rejected 是合法处置结果,不得被读取或后续流程解释为“无外部依据”。

#### R1.20.3 ExternalSourceArtifactRefFlow

覆盖接口:

- `RegisterExternalSourceRef`
- `RegisterArtifactArchiveRef`

```text
<External Ref Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - external source kind / namespace ref / version hint / digest hint
  - artifact kind / archive digest hint / retention context ref
        |
        v
<Typed Ref Boundary Gate>
  - reject free-form URL / file path / route param / provider id as canonical ref
  - reject object storage path / signed URL / archive body / artifact body
  - validate source kind and archive marker are body-free
        |
        v
<Register Ref>
  - create or reuse ExternalSourceRef
  - create or reuse ArtifactArchiveRef
  - bind archive ref to external source ref when provided
        |
        v
<Persist Ref Boundary>
  - save opaque typed ref and digest hints
  - keep source lifecycle external
  - keep archive body outside this repository
        |
        v
<External Ref Result>
  - ExternalSourceRef and/or ArtifactArchiveRef
  - registration summary
  - ExternalSourceRefChanged or ArtifactArchiveRefChanged candidate
```

关键设计点:

- `ExternalSourceRef` 和 `ArtifactArchiveRef` 是 opaque typed boundary,不是 URL、文件路径、provider id、object storage path 或 external database key 的别名。
- artifact / archive 只以 ref、digest hint、kind 和 safe marker 表达,不保存包体、文件内容、证据正文或 retention policy 实现。
- source ref 注册不代表外部来源可用、可信或已被正式化使用;这些由 summary disposition、basis acceptance history 或后续读取材料解释。

#### R1.20.4 ExternalBodyBoundaryFlow

覆盖接口:

- `AssertExternalBodyBoundary`
- `RejectExternalBodyCandidate`
- `ConsumeExternalBodyBoundaryViolation`

```text
<Body Boundary Assertion>
  - ActorContext / CommandMetadata / IdempotencyKey
  - ExternalBodyBoundaryRuleRef
  - candidate summary / ref / lineage refs
  - safe reason refs
        |
        v
<Boundary Rule Evaluation>
  - assert summary-only / ref-only / marker-only material
  - reject raw external body, artifact body, evidence body, archive package
  - reject webhook payload and provider API response body
        |
        +--> body-free accepted
        |       |
        |       v
        |   <Return boundary assertion summary>
        |
        +--> violation noticed
        |       |
        |       v
        |   <Record safe violation summary>
        |
        +--> explicit rejection
                |
                v
            <Reject unsafe body candidate>
        |
        v
<Boundary Result>
  - boundary assertion / rejection summary
  - violation ref or safe reason ref
  - ExternalBodyBoundaryViolationNoticed candidate
```

关键设计点:

- `ExternalBodyBoundaryRule` 只判断外部材料能否以 summary/ref/marker 进入本仓,不是内容审查、标准解释、治理审批、policy enforce 或 malware scan。
- rejection 记录只能保存 violation kind、candidate ref 和 safe reason ref,不得保存被拒正文摘录、payload 片段、文件内容或证据正文。
- inbound violation fact 进入本仓后只能形成安全拒绝 / 审计 / 上游修正线索,不能把 violation payload 变成本仓 truth。

#### R1.20.5 ExternalEvidenceLineageFlow

覆盖接口:

- `LinkExternalEvidenceLineage`

```text
<External Evidence Lineage Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - TraceSubjectRef
  - ExternalSourceRef set
  - ArtifactArchiveRef set
  - digest refs / safe evidence marker refs
        |
        v
<Lineage Boundary Gate>
  - validate trace subject and external refs
  - validate artifact archive refs are body-free
  - reject evidence file body / archive body / report body
        |
        v
<Link Evidence Lineage>
  - attach external source refs
  - attach artifact archive refs
  - attach digest hints and safe marker refs
  - link to MethodAssetEvidenceLineage
        |
        v
<Persist Lineage Hint>
  - save evidence lineage summary
  - append audit / trace linkage hint
        |
        v
<Lineage Result>
  - MethodAssetEvidenceLineageRef
  - lineage summary
  - ExternalEvidenceLineageChanged candidate
```

关键设计点:

- 外部证据 lineage 只连接 refs、digest hints、trace subject 和 safe markers,不保存证据文件、artifact 包体、archive 内容或验收报告正文。
- lineage 与 `追溯与一致性保护` 的 audit / trace 接缝保持 body-free:本流提供外部依据线索,不替代 audit trail 或 trace material truth。
- 如果证据材料不满足正文边界,本流只能拒绝或挂起 lineage,不能尝试摘要化正文。

#### R1.20.6 ExternalInboundIntakeFlow

覆盖 Inbound Consumer:

- `ConsumeBodyFreeExternalSummaryAccepted`
- `ConsumeExternalSourceRefRegistered`
- `ConsumeArtifactArchiveRefRegistered`
- `ConsumeExternalBodyBoundaryViolation`

```text
<External Inbound Event>
  - source envelope
  - source event id / source system ref
  - schema / version
  - dedup key / trace context
  - body-free summary/ref/archive/violation marker
        |
        v
<Inbound Safety Gate>
  - verify envelope and schema version
  - check idempotency / duplicate event id
  - reject raw payload, raw document, artifact body, evidence body
        |
        +--> duplicate
        |       |
        |       v
        |   <Return ignored replay summary>
        |
        +--> unsafe
        |       |
        |       v
        |   <Return rejected intake summary>
        |
        +--> accepted body-free fact
                |
                v
            <Create intake summary and command handoff hint>
        |
        v
<Inbound Result>
  - accepted / ignored / rejected consumer result
  - external intake summary
  - optional ExternalSourceSummaryChanged / ExternalSourceRefChanged / ArtifactArchiveRefChanged / ExternalBodyBoundaryViolationNoticed candidate
```

关键设计点:

- Inbound consumer 不直接拥有完整业务裁决;它只把已成立的 body-free external fact 转成本仓 intake summary 或显式 Command handoff hint。
- 所有 inbound 分支都必须先处理 envelope、schema / version、source event id 和 dedup key,避免实现侧用 payload 内容自行判断重复。
- 本流不恢复旧 governance gate consumer、webhook consumer、raw artifact upload consumer 或 provider adapter。

#### R1.20.7 ExternalSummaryReferenceReadFlow

覆盖 Query:

| Query | 读取路径 | 输出边界 | 禁止事项 |
|---|---|---|---|
| `GetExternalSourceSummary` | 按 external summary ref 读取安全摘要。 | summary ref、source ref、acceptance marker、body-free marker、digest hints。 | 不返回外部正文、标准全文、ADR 正文、artifact body、archive 包或 provider payload。 |
| `GetExternalSummaryBySourceRef` | 按 `ExternalSourceRef` 分页读取 summary view。 | source-scoped summary page、disposition hints。 | 不从 URL、path、external id 或 route param 反推来源。 |
| `ResolveExternalSourceRef` | 按 typed selector 解析 external source ref。 | opaque source ref、source kind、namespace / version / digest hints。 | 不暴露认证信息、provider payload、正文地址或外部生命周期。 |
| `GetArtifactArchiveRef` | 按 archive ref 读取 artifact / archive 引用摘要。 | archive ref、artifact kind、source ref、digest hint。 | 不返回文件内容、archive 包、对象存储路径、signed URL 或 retention policy 实现。 |
| `GetExternalBodyBoundaryDiagnostic` | 按 rule / candidate refs 读取 boundary diagnostic。 | accepted / rejected marker、violation kind、safe reason refs。 | 不返回被拒正文、payload 摘录、标准正文或 evidence body。 |
| `GetExternalSourceSummaryView` | 按 summary view ref 或 summary ref 读取 view。 | body-free view、freshness / availability marker。 | view 不成为 summary truth,不触发外部刷新。 |
| `GetExternalBasisAcceptanceHistory` | 按 source / basis scope 读取 history。 | acceptance history summary page、digest hints、lineage refs。 | 不返回治理执行过程、审批流、policy enforce 结果、外部日志或 report body。 |
| `GetExternalEvidenceLineageHint` | 按 trace subject / lineage ref 读取外部 evidence hints。 | source refs、artifact refs、digest refs、safe lineage summary。 | 不返回证据文件正文、artifact 包体、archive 内容或验收报告正文。 |

读取流通用骨架:

```text
<External Summary / Ref Query>
  - ActorContext / QueryMetadata
  - external summary ref / source ref / artifact archive ref / boundary rule ref / trace subject ref
        |
        v
<External Query Boundary Gate>
  - validate typed selector
  - reject request for raw body, provider payload, artifact content or evidence body
        |
        v
<Load External Read Source>
  - ExternalSourceSummary / ExternalSourceSummaryView
  - ExternalSourceRef / ArtifactArchiveRef
  - ExternalBodyBoundaryRule diagnostic
  - ExternalBasisAcceptanceHistory / evidence lineage hint
        |
        +--> found
        |       |
        |       v
        |   <Return body-free external summary / ref output>
        |
        +--> missing / stale / unavailable / rejected
                |
                v
            <Return safe absence, disposition, freshness or diagnostic hint>
```

关键设计点:

- 所有 Query 都是只读路径,不得拉取外部系统、刷新 summary view、注册新 ref、摘要化正文或修复 lineage。
- stale / unavailable / rejected 是读取结果的一部分,不能被折叠为 not found。
- diagnostic 输出只包含 marker、violation kind 和 safe reason ref,不包含被拒材料内容。

#### R1.20.8 ExternalSummaryReferenceEventCandidate

| Event candidate | 来源 | 输出骨架 | 边界 |
|---|---|---|---|
| `ExternalSourceSummaryChanged` | summary captured / accepted / rejected / unavailable / stale / superseded。 | `ExternalSourceSummaryRef`;`ExternalSourceRef`;change kind;acceptance marker;trace context。 | 不携带 external safe summary 正文全集、外部正文、topic / payload schema 或投递策略。 |
| `ExternalSourceRefChanged` | source ref registered / version hint changed。 | `ExternalSourceRef`;source kind;namespace / version / digest hints;trace context。 | 不携带 URL、外部正文、provider payload、认证信息或正文地址。 |
| `ArtifactArchiveRefChanged` | artifact / archive ref registered or digest hint changed。 | `ArtifactArchiveRef`;artifact kind;digest hint;optional source ref;trace context。 | 不携带 artifact 包体、archive 内容、证据正文、存储路径或 retention policy。 |
| `ExternalBodyBoundaryViolationNoticed` | boundary assertion / explicit rejection / inbound violation accepted。 | candidate ref;violation kind;safe reason ref;trace context。 | 不携带被拒正文、payload、文件内容、证据正文或标准全文。 |
| `ExternalEvidenceLineageChanged` | external evidence lineage linked / superseded / rejected。 | `MethodAssetEvidenceLineageRef`;external source refs;artifact refs;trace subject ref;digest hints。 | 不携带 artifact 包体、archive 内容、证据正文或验收报告正文。 |

事件候选只说明 external summary/ref/archive/body boundary/lineage fact 已变化。topic、payload schema、outbox、relay、subscriber、retry、delivery state、external polling、source refresh 和 read material rebuild 全部后置。

#### R1.20.9 接口覆盖 / 不展开理由表

| 对象 | 覆盖情况 | 说明 |
|---|---|---|
| 9 个 Command | covered | summary lifecycle 4 个、source / archive ref 2 个、body boundary 2 个、evidence lineage 1 个均已覆盖。 |
| 8 个 Query | covered_by_lightweight_read | 复用通用 Query 只读路径,本模块补 source/ref/archive/diagnostic/history/lineage 边界。 |
| 4 个 Inbound Consumer | covered | 本组成部分是唯一 Inbound owner;已覆盖 envelope、idempotency、schema/version、dedup 和 body-free guard。 |
| 5 个 Outbound Event | covered_by_event_candidate | 只写事件候选产生,不写 delivery / outbox / relay。 |
| Operations Job | not_applicable | external polling、source availability refresh 和 external summary read material refresh 后置到后台维护与收敛。 |
| 后台维护与收敛 | deferred | 下一组成部分处理维护请求、refresh job 和 consistency recovery,本模块只产生 stale / unavailable / invalidation / diagnostic hint。 |

#### R1.20.10 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入本组成部分处理流 | pass | 已写 summary lifecycle、source / archive ref、body boundary、evidence lineage、inbound intake、read 和 event candidate。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 9 个 Command、8 个 Query、4 个 Inbound Consumer、5 个 Outbound Event。 |
| 是否以当前 R1 接口为准 | pass | 使用 Step 7 `R1.24` / `R1.26` / `R1.28` / `R1.30` / `R1.34` 的当前接口名。 |
| 是否保持唯一 Inbound owner | pass | 仅外部摘要与引用承接 body-free inbound fact。 |
| 是否排除 raw body / artifact body / provider payload | pass | 明确只允许 summary、typed ref、digest hint、marker、safe reason ref 和 trace context。 |
| 是否避免内容审查 / 标准解释 / 治理执行越界 | pass | boundary 只判断入仓边界,不解释或审批外部内容。 |
| 是否避免 Query 副作用 | pass | Query 不拉取外部系统、不注册 ref、不刷新 view、不摘要化正文。 |
| 是否避免后台维护越界 | pass | external polling / refresh 后置到后台维护与收敛。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `后台维护与收敛处理流:先思考`;只思考后台维护与收敛组成部分关键处理流族、覆盖接口和不展开理由,不得直接写处理流图正文,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.21 后台维护与收敛处理流:先思考

#### R1.21.1 问题回答

- 本模块只思考 `后台维护与收敛` 的处理流族,不直接写具体处理流图正文,不进入 `外围包与方法集组织`。
- 当前有效接口来源必须以 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.32` / `R1.34` 为准:6 个 Command、8 个 Query、5 个 Outbound Event、8 个 Operations Job,没有本组成部分 Inbound Consumer。
- 核心对象来源是 Step 6 的 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceProgressView`、`MaintenanceRunRef`、`RefreshScopeRef`、`MaintenanceRunHistory` 和相关 task / material refs。处理流必须分别承接维护请求登记、读取材料刷新、追溯材料刷新、一致性恢复收敛、维护进度读取和维护事件候选。
- 后台维护与收敛是 operation / support 组成部分,不是业务 Command 执行器。它不得创建、修改或修复 definition、catalog、formal version、consumption boundary、relation、external summary 或 peripheral organization truth。
- Operations Job 只基于已持久化事实刷新派生材料、trace / audit / impact materials、external summary view、peripheral view 和 recovery progress,不得写 worker loop、scheduler、queue、lock、retry、outbox replay、snapshot export 或 fingerprint recalculation。

#### R1.21.2 接口覆盖判断

| 接口组 | 当前接口 | 候选裁决 | 理由 |
|---|---|---|---|
| maintenance request / control | `RequestReadMaterialRefresh`;`RequestTraceMaterialRefresh`;`RequestConsistencyRecovery`;`MarkMaintenanceSuspended`;`RequireMaintenanceFormalIntervention`;`SupersedeMaintenanceRequest` | 独立处理流族 | Command 只登记维护意图、挂起、正式介入和替代,不执行 job,不修 core truth。 |
| read material refresh jobs | `RefreshCatalogAndDefinitionReadMaterials`;`RefreshFormalVersionReadMaterials`;`RefreshConsumptionReadMaterials`;`RefreshRelationDistributionMaterials`;`RefreshExternalSummaryReadMaterials`;`RefreshPeripheralReadMaterials` | 独立 Job 流族 | 这些 job 只刷新各组成部分 read material / view / availability marker,需要统一 no truth repair 边界。 |
| trace / audit / impact refresh job | `RefreshTraceAuditImpactMaterials` | 独立 Job 流族或 trace refresh 子流 | 追溯、审计、impact 和 lineage 材料有 body-free / no raw log / no evidence body 高风险,需要单独说明。 |
| consistency recovery convergence job | `RunConsistencyRecoveryConvergence` | 独立 Job 流族 | recovery 是收敛与正式介入线索,不得自动修复 truth、重做正式化、绕过消费边界或复制外部正文。 |
| maintenance progress reads | `GetMaintenanceProgress`;`GetMaintenanceProgressByRun`;`GetMaintenanceProgressByScope`;`GetReadMaterialRefreshTaskSummary`;`GetTraceMaterialRefreshTaskSummary`;`GetConsistencyRecoveryTaskSummary`;`GetMaintenanceRunHistory`;`ListPendingMaintenanceScopes` | 通用 Query 路径 + 重点说明 | 均为只读;progress、task summary、history 和 pending scopes 需要强调不暴露 worker/queue/raw log。 |
| maintenance events | `MethodAssetMaintenanceRequested`;`MethodAssetReadMaterialRefreshChanged`;`MethodAssetTraceMaterialRefreshChanged`;`MethodAssetConsistencyRecoveryChanged`;`MethodAssetMaintenanceProgressChanged` | 统一事件说明 | 只表达维护请求、刷新结果、恢复进度或 progress 变化,不写 topic / payload / outbox / relay。 |
| Inbound Consumer | 无 | 不展开 | 维护触发来自显式 Command、已持久化 fact changed / stale / unavailable / invalidation hints 或 job task,不直接消费外部 raw event。 |

#### R1.21.3 预计处理流族

| 处理流族 | 覆盖接口 | 主要对象 | 关键分支 | 后续 R1.22 写法 |
|---|---|---|---|---|
| `MaintenanceRequestControlFlow` | 6 个 Command | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceRunRef`;`RefreshScopeRef`;safe reason refs | requested / suspended / formal intervention required / superseded / rejected。 | 写一张维护请求与控制流图,强调 Command 只登记 task / progress 意图,不执行 job。 |
| `ReadMaterialRefreshJobFlow` | 6 个 read material refresh jobs | read material refs;`ReadMaterialRefreshTask`;`MaintenanceProgressView`;freshness markers | refreshed / partially refreshed / stale / unavailable / skipped by boundary。 | 写一张读材料刷新 job 流图,按覆盖范围列出 catalog、formal version、consumption、relation/distribution、external、peripheral。 |
| `TraceAuditImpactRefreshJobFlow` | `RefreshTraceAuditImpactMaterials` | `TraceMaterialRefreshTask`;trace / audit / impact / lineage refs | refreshed / partial / blocked by body boundary / unavailable。 | 写一张追溯材料刷新 job 流图,强调 no raw log、no evidence body、no report body。 |
| `ConsistencyRecoveryConvergenceFlow` | `RunConsistencyRecoveryConvergence` | `ConsistencyRecoveryTask`;`ConsistencyProtectionPolicy`;affected material refs;formal intervention marker | converged / pending acknowledgement / suspended / rejected / formal intervention required。 | 写一张 recovery convergence 流图,强调只输出收敛摘要和待承接线索。 |
| `MaintenanceProgressReadFlow` | 8 个 Query | `MaintenanceProgressView`;task summaries;run history;pending scope refs | found / unavailable / pending / failed / partial / stale。 | 写轻量只读说明,复用通用 Query 图。 |
| `MaintenanceEventCandidate` | 5 个 Outbound Event | maintenance task refs;run/scope refs;progress marker;refresh/recovery summary | candidate produced / delivery deferred。 | 写统一事件候选说明,不画 relay、worker 或调度。 |

#### R1.21.4 不展开和后置项

| 项 | 当前裁决 | 理由 |
|---|---|---|
| worker loop / scheduler / queue / lock / retry | 排除 | 这些是实现与运维细节,概要只写 task、run、scope 和 progress 语义。 |
| outbox replay / event relay / delivery retry | 排除 | 事件候选不等于投递机制;当前 job 不恢复旧 outbox 主线。 |
| snapshot export / fingerprint recalculation / index rebuild 主线 | 排除 | 本轮已废弃旧 MethodContent / snapshot / fingerprint 主线;刷新对象是当前 read material / view。 |
| 自动修复 core truth | 排除 | recovery 只能输出收敛摘要、pending acknowledgement、suspended / rejected 或正式介入线索。 |
| 重做正式化或扩大消费边界 | 排除 | 正式化和消费边界只能由对应业务 Command 处理,维护不得绕过。 |
| 复制外部正文、证据正文或 raw log | 排除 | trace / external refresh 均保持 body-free,不得补正文。 |
| 每个 refresh job 单独画完整图 | 不逐个画 | read material refresh jobs 同构,可用一张流图覆盖并列出范围差异。 |
| 维护进度成为业务 truth | 排除 | `MaintenanceProgressView` 是 body-free read model,不是业务事实源。 |

#### R1.21.5 风险诊断

| 风险 | 影响 | R1.22 处理 |
|---|---|---|
| maintenance Command 直接执行 job | 会把请求登记和后台执行混在一起,后续无法解释幂等、进度和挂起。 | request/control flow 明确只登记 task intent、suspend、formal intervention 和 supersede。 |
| refresh job 修改 core truth | 会绕过各业务组成部分 Command,破坏 truth owner。 | read refresh flow 每个分支都写 no truth repair。 |
| recovery 自动修复正式化 / 消费 / relation | 会绕过正式裁决和边界 guard。 | recovery flow 只输出 convergence summary、pending acknowledgement 或 formal intervention marker。 |
| progress read 依赖 raw log / worker state | 会把实现私有状态变成设计真相源。 | progress read flow 只读 `MaintenanceProgressView`、task summary 和 issue refs。 |
| trace refresh 保存 raw log / evidence body | 会污染追溯和证据 lineage 边界。 | trace refresh flow 明确只刷新 body-free material / refs / markers。 |
| maintenance event 被写成 worker 调度消息 | 会混淆业务 fact event 和实现调度机制。 | event candidate 只表达维护事实变化,不写 topic、payload、scheduler 或 relay。 |

#### R1.21.6 下一写入批次结构

下一批 `R1.22 后台维护与收敛处理流:再写入` 只写:

1. `本组成部分写入说明`。
2. `MaintenanceRequestControlFlow` ASCII 图和关键说明。
3. `ReadMaterialRefreshJobFlow` ASCII 图、覆盖 job 表和关键说明。
4. `TraceAuditImpactRefreshJobFlow` ASCII 图和关键说明。
5. `ConsistencyRecoveryConvergenceFlow` ASCII 图和关键说明。
6. `MaintenanceProgressReadFlow` 轻量读路径说明。
7. `MaintenanceEventCandidate` 统一事件候选说明。
8. `接口覆盖 / 不展开理由表`。
9. `本模块停审记录`。

#### R1.21.7 下一写入批次边界

下一批不得写外围包与方法集组织处理流,不得写 worker loop、scheduler、queue、lock、retry、outbox relay、snapshot export、fingerprint recalculation、index rebuild、DDL、adapter、observability metric schema、raw log、正式 `02-概要设计.md` 或 Step 9。

#### R1.21.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写具体处理流图正文。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 6 个 Command、8 个 Query、5 个 Outbound Event、8 个 Operations Job。 |
| 是否以当前 R1 接口为准 | pass | 使用 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.32` / `R1.34` 的当前接口名。 |
| 是否保持唯一 Operations Job owner | pass | 所有 job 均归后台维护与收敛,未复制到业务组件。 |
| 是否排除 worker / scheduler / queue / retry | pass | 当前只写 task、run、scope、progress 和 material 语义。 |
| 是否排除 core truth repair | pass | 明确 maintenance 不修改业务 truth、不重做正式化、不扩大消费边界。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `后台维护与收敛处理流:再写入`;只写本组成部分 maintenance request/control、read material refresh job、trace/audit/impact refresh job、consistency recovery convergence、progress read 和 event candidate 处理流,不得写外围包与方法集组织处理流,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.22 后台维护与收敛处理流:再写入

#### R1.22.1 本组成部分写入说明

本模块只写 `后台维护与收敛` 的关键处理流。它覆盖维护请求与控制、读取材料刷新、追溯 / 审计 / 影响材料刷新、一致性恢复收敛、维护进度读取和维护事件候选。

后台维护与收敛只操作 task、run、scope、progress、read material、trace material、recovery summary 和 body-free issue refs。它不得创建、修改或修复 core truth,不得重做正式化,不得扩大消费边界,不得修复 relation truth,不得替代 external summary truth,不得把外围组织变成核心闭环前置。

#### R1.22.2 MaintenanceRequestControlFlow

覆盖接口:

- `RequestReadMaterialRefresh`
- `RequestTraceMaterialRefresh`
- `RequestConsistencyRecovery`
- `MarkMaintenanceSuspended`
- `RequireMaintenanceFormalIntervention`
- `SupersedeMaintenanceRequest`

```text
<Maintenance Request Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - MaintenanceRunRef
  - RefreshScopeRef
  - task kind / safe reason refs
  - optional affected material refs
        |
        v
<Maintenance Request Gate>
  - validate run ref and refresh scope ref
  - validate requested task kind
  - reject worker id / queue id / cron name / free-form scope string
  - reject request to repair core truth or rerun business command
        |
        v
<Create or Update Maintenance Task Intent>
  - ReadMaterialRefreshTask requested
  - TraceMaterialRefreshTask requested
  - ConsistencyRecoveryTask requested
  - mark suspended / formal intervention required / superseded
        |
        v
<Persist Maintenance Control>
  - save task intent / control marker
  - update MaintenanceProgressView seed
  - append MaintenanceRunHistory hint
        |
        v
<Maintenance Request Result>
  - task ref / maintenance request summary
  - MaintenanceProgressView hint
  - MethodAssetMaintenanceRequested candidate
```

关键设计点:

- maintenance Command 只登记任务意图、挂起、正式介入或替代,不执行 job。
- `MaintenanceRunRef` 和 `RefreshScopeRef` 必须是 typed ref,不能用 worker id、queue id、cron 名称或 free-form scope 字符串替代。
- formal intervention marker 表示需要人工或正式流程承接,不是自动修复授权。

#### R1.22.3 ReadMaterialRefreshJobFlow

覆盖 Operations Job:

| Job | 刷新范围 | 输出 | 禁止事项 |
|---|---|---|---|
| `RefreshCatalogAndDefinitionReadMaterials` | definition summary、catalog view、definition ref resolution materials。 | refreshed definition / catalog read summary、freshness marker。 | 不修改 definition truth、catalog truth、外部摘要或搜索索引实现。 |
| `RefreshFormalVersionReadMaterials` | formalization state、formal version summary、basis summary read material。 | refreshed formal version read summary、availability marker。 | 不重做正式化、不生成新 formal version、不读取治理正文。 |
| `RefreshConsumptionReadMaterials` | consumption material、availability view、downstream boundary read material。 | refreshed consumption read summary、boundary freshness marker。 | 不扩大消费边界、不声明下游已同步或已运行。 |
| `RefreshRelationDistributionMaterials` | relation view、distribution read material、integrity diagnostic material。 | refreshed relation / distribution read summary。 | 不修复 relation truth、不执行 graph / recommendation / marketplace 算法。 |
| `RefreshExternalSummaryReadMaterials` | external summary view、source ref read material、artifact ref availability hint。 | refreshed external summary view、body-free availability marker。 | 不拉取或复制外部正文、artifact 包体、证据正文或 provider payload。 |
| `RefreshPeripheralReadMaterials` | package view、method set view、peripheral discovery read material。 | refreshed peripheral read summary、availability marker。 | 不让外围不可用影响核心闭环,不进入 marketplace 交易 / 安装 / 履约。 |

通用 job 流:

```text
<Read Material Refresh Job>
  - MaintenanceRunRef
  - ReadMaterialRefreshTaskRef
  - RefreshScopeRef
  - source truth / material refs
        |
        v
<Refresh Job Gate>
  - validate task and scope
  - load current source facts and material refs
  - reject core truth mutation request
  - reject worker / scheduler / queue / retry concerns
        |
        v
<Rebuild Derived Read Material>
  - compute body-free read material summary
  - mark freshness / stale / unavailable / partial
  - keep missing source as safe issue ref
        |
        v
<Persist Refresh Result>
  - save refreshed read material / view summary
  - update MaintenanceProgressView
        |
        v
<Read Material Refresh Result>
  - refreshed material refs
  - progress summary
  - MethodAssetReadMaterialRefreshChanged candidate
```

关键设计点:

- 读材料刷新只重建派生 view / material,不修改来源 truth。
- partial / stale / unavailable 是正式刷新结果,不得被 job 隐式修复。
- 每个 job 使用同一骨架,差异只在输入 material family 和输出 summary family,不写 per-job worker loop。

#### R1.22.4 TraceAuditImpactRefreshJobFlow

覆盖 Operations Job:

- `RefreshTraceAuditImpactMaterials`

```text
<Trace / Audit / Impact Refresh Job>
  - MaintenanceRunRef
  - TraceMaterialRefreshTaskRef
  - RefreshScopeRef
  - trace / audit / impact / lineage refs
        |
        v
<Trace Refresh Gate>
  - validate trace subject refs and material refs
  - load body-free trace / audit / impact sources
  - reject raw log / telemetry / event payload / report body / evidence body
        |
        v
<Refresh Trace Family Materials>
  - refresh MethodAssetTraceMaterial view
  - refresh audit / evidence lineage read hints
  - refresh ConsumptionImpactSummary read material
  - mark partial / unavailable / blocked by boundary
        |
        v
<Persist Trace Refresh Result>
  - save refreshed body-free trace / audit / impact summaries
  - update MaintenanceProgressView
        |
        v
<Trace Refresh Result>
  - refreshed trace / audit / impact material refs
  - progress summary
  - MethodAssetTraceMaterialRefreshChanged candidate
```

关键设计点:

- trace refresh 不能创建新的 trace truth,只能刷新已有 trace / audit / impact / lineage 的读取材料。
- raw log、telemetry、event payload、report body、artifact body、archive 内容和 evidence file body 均不得进入本仓。
- 被正文边界阻断时输出 safe issue ref 或 unavailable marker,不尝试复制正文补齐。

#### R1.22.5 ConsistencyRecoveryConvergenceFlow

覆盖 Operations Job:

- `RunConsistencyRecoveryConvergence`

```text
<Consistency Recovery Job>
  - MaintenanceRunRef
  - ConsistencyRecoveryTaskRef
  - RefreshScopeRef / recovery scope
  - impact / protection / material refs
        |
        v
<Recovery Safety Gate>
  - validate recovery scope
  - load ConsistencyProtectionPolicy and affected material refs
  - reject automatic core truth repair
  - reject formalization redo, consumption boundary bypass, external body copy
        |
        v
<Evaluate Recovery Convergence>
  - converged
  - pending acknowledgement
  - suspended by boundary
  - rejected as unsafe
  - formal intervention required
        |
        v
<Persist Recovery Progress>
  - save recovery convergence summary
  - update MaintenanceProgressView
  - attach safe issue / acknowledgement refs
        |
        v
<Recovery Result>
  - recovery summary
  - progress marker
  - MethodAssetConsistencyRecoveryChanged candidate
  - MethodAssetMaintenanceProgressChanged candidate when progress changed
```

关键设计点:

- recovery convergence 是收敛判断和进度记录,不是自动修复引擎。
- 需要改 core truth、重做正式化、调整消费边界、修复关系 truth 或复制外部正文时,只能输出 formal intervention / suspended / rejected 结果。
- pending acknowledgement 是正式状态,不能被实现端当作成功收敛。

#### R1.22.6 MaintenanceProgressReadFlow

覆盖 Query:

| Query | 读取路径 | 输出边界 | 禁止事项 |
|---|---|---|---|
| `GetMaintenanceProgress` | 按 run ref 或 scope ref 读取 progress view。 | progress state、task refs、issue refs、freshness marker。 | 不返回 worker log、queue state、lock、retry、stack trace 或 raw diagnostic。 |
| `GetMaintenanceProgressByRun` | 按 `MaintenanceRunRef` 读取 run progress page。 | run-scoped progress summaries。 | 不从 worker id 或 cron 名反推 run。 |
| `GetMaintenanceProgressByScope` | 按 `RefreshScopeRef` 读取 scope progress。 | scope progress summary、pending issue refs。 | 不执行 refresh 或 recovery。 |
| `GetReadMaterialRefreshTaskSummary` | 读取 read refresh task summary。 | task state、material refs、safe issue refs。 | 不返回 worker output、SQL、adapter response 或 cache internals。 |
| `GetTraceMaterialRefreshTaskSummary` | 读取 trace refresh task summary。 | trace task state、body-free issue refs。 | 不返回 raw log、evidence body、report body 或 telemetry。 |
| `GetConsistencyRecoveryTaskSummary` | 读取 recovery task summary。 | recovery disposition、pending acknowledgement refs、formal intervention marker。 | 不执行确认、不修 truth、不重做裁决。 |
| `GetMaintenanceRunHistory` | 读取维护运行历史线索。 | body-free run history summary、task refs、progress markers。 | 不返回 scheduler log、worker span、metrics body 或 raw incident report。 |
| `ListPendingMaintenanceScopes` | 分页读取 pending / unavailable / failed scopes。 | pending scope page、safe reason refs。 | 不自动启动 job、不确认 issue、不隐藏 unavailable。 |

读取流通用骨架:

```text
<Maintenance Query>
  - ActorContext / QueryMetadata
  - MaintenanceRunRef / RefreshScopeRef / task ref
        |
        v
<Progress Query Gate>
  - validate typed run / scope / task ref
  - reject worker, scheduler, queue, retry, raw log request
        |
        v
<Load Progress Read Source>
  - MaintenanceProgressView
  - task summary
  - run history / pending scope view
        |
        +--> found
        |       |
        |       v
        |   <Return body-free progress summary>
        |
        +--> missing / unavailable / stale
                |
                v
            <Return safe absence or unavailable hint>
```

关键设计点:

- maintenance Query 只读 progress / task / run history / pending scope material,不得触发 job。
- progress state 是 operation read model,不是业务 truth。
- failed / unavailable / pending 不得被折叠为 missing 或 success。

#### R1.22.7 MaintenanceEventCandidate

| Event candidate | 来源 | 输出骨架 | 边界 |
|---|---|---|---|
| `MethodAssetMaintenanceRequested` | maintenance request accepted / superseded / suspended / formal intervention required。 | task ref;run ref;scope ref;request kind;safe reason ref。 | 不携带 worker id、queue id、scheduler config、retry policy 或 raw log。 |
| `MethodAssetReadMaterialRefreshChanged` | read material refresh job progressed / partial / converged / unavailable。 | refresh task ref;affected material refs;freshness marker;progress context。 | 不表示 core truth 改变,不携带 rebuild algorithm 或 cache details。 |
| `MethodAssetTraceMaterialRefreshChanged` | trace / audit / impact refresh progressed / blocked / converged。 | trace refresh task ref;trace subject refs;body-free issue refs。 | 不携带 raw log、event payload、evidence body、report body 或 artifact body。 |
| `MethodAssetConsistencyRecoveryChanged` | recovery convergence progressed / suspended / rejected / intervention required。 | recovery task ref;disposition;pending acknowledgement refs;safe reason ref。 | 不表示自动修复已完成,不携带修复脚本或 truth mutation。 |
| `MethodAssetMaintenanceProgressChanged` | progress view updated。 | progress view ref;run ref;scope ref;progress state;issue refs。 | 不携带 worker state、metrics body、queue depth 或 retry state。 |

事件候选只说明维护请求、刷新进度、恢复收敛或 progress view 已变化。topic、payload schema、outbox、relay、subscriber、retry、worker scheduling、queue 和 lock 全部后置。

#### R1.22.8 接口覆盖 / 不展开理由表

| 对象 | 覆盖情况 | 说明 |
|---|---|---|
| 6 个 Command | covered | maintenance request/control 流已覆盖请求、挂起、正式介入和替代。 |
| 8 个 Operations Job | covered | 6 个 read material refresh job、1 个 trace/audit/impact refresh job、1 个 consistency recovery convergence job 均已覆盖。 |
| 8 个 Query | covered_by_lightweight_read | 复用通用 Query 只读路径,本模块补 progress、task summary、run history、pending scopes 边界。 |
| 5 个 Outbound Event | covered_by_event_candidate | 只写维护事件候选产生,不写 delivery / outbox / relay。 |
| Inbound Consumer | not_applicable | 本组成部分无 Inbound;维护触发来自显式维护请求、已持久化 fact changed / stale / invalidation hint 或 task。 |
| 外围包与方法集组织 | deferred | `RefreshPeripheralReadMaterials` 只刷新外围 read material;package / method set truth 由后续组成部分处理。 |

#### R1.22.9 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入本组成部分处理流 | pass | 已写 request/control、read material refresh、trace/audit/impact refresh、recovery convergence、progress read 和 event candidate。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 6 个 Command、8 个 Query、5 个 Outbound Event、8 个 Operations Job。 |
| 是否以当前 R1 接口为准 | pass | 使用 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.32` / `R1.34` 的当前接口名。 |
| 是否保持唯一 Operations Job owner | pass | 所有 job 均归后台维护与收敛,未复制到业务组件。 |
| 是否避免 core truth repair | pass | 明确维护不修改核心 truth、不重做正式化、不扩大消费边界、不修 relation truth。 |
| 是否排除 worker / scheduler / queue / retry | pass | 未写 worker loop、scheduler、queue、lock、retry、outbox relay 或 adapter 细节。 |
| 是否保持 body-free | pass | trace / external / progress 路径均禁止 raw log、provider payload、evidence body 和 report body。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `外围包与方法集组织处理流:先思考`;只思考外围包与方法集组织组成部分关键处理流族、覆盖接口和不展开理由,不得直接写处理流图正文,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.23 外围包与方法集组织处理流:先思考

#### R1.23.1 问题回答

- 本模块只思考 `外围包与方法集组织` 的处理流族,不直接写具体处理流图正文,不进入 `跨处理流一致性审计`。
- 当前有效接口来源必须以 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.34` 为准:9 个 Command、9 个 Query、4 个 Outbound Event,没有本组成部分 Inbound Consumer 和 Operations Job。
- 核心对象来源是 Step 6 的 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、`MethodPackageRef`、`MethodSetAssemblyRef`、`MarketplaceContextRef`、`MethodPackageView`、`MethodSetAssemblyView`、`PackageAssemblyHistory`。处理流必须分别承接 package lifecycle、method set assembly lifecycle、composition evaluation、peripheral discovery read 和 event candidate。
- 外围包与方法集组织是 peripheral enhancement,不阻塞核心闭环。definition、formal version、consumption material、trace consistency、relation truth 和 external summary 的成立都不得依赖 package / method set 成立。
- 本组成部分不是 marketplace listing、交易、购买、订阅、结算、安装、履约、package binary、artifact body、组织运行配置、UI preset、SDK profile 或 AI override 的 owner。

#### R1.23.2 接口覆盖判断

| 接口组 | 当前接口 | 候选裁决 | 理由 |
|---|---|---|---|
| package lifecycle | `EstablishMethodPackage`;`AdjustMethodPackageComposition`;`RetireMethodPackage`;`MarkMethodPackageUnavailable` | 独立处理流族 | package 是外围 organization truth candidate,建立、调整、退役和不可用隔离必须显式守住不反写核心 truth。 |
| method set assembly lifecycle | `AssembleMethodSet`;`AdjustMethodSetAssembly`;`RetireMethodSetAssembly`;`MarkMethodSetAssemblyStaleOrUnavailable` | 独立处理流族 | method set 表达组织级组装语义,不得升级为组织运行配置或正式消费授权。 |
| composition evaluation | `EvaluatePackageComposition` | 独立或嵌入 package / assembly 流的规则分支 | composition rule 横跨 package、set、正式化、分发、消费边界和 marketplace boundary,需要单独说明输出 summary。 |
| peripheral reads | 9 个 Query | 通用 Query 路径 + 重点说明 | 均为只读;package view、method set view、composition diagnostic、discovery context 和 history 边界需要补充。 |
| peripheral events | `MethodPackageChanged`;`MethodSetAssemblyChanged`;`PackageCompositionResultChanged`;`PeripheralViewAvailabilityChanged` | 统一事件说明 | 只表达外围组织或 view availability 事实候选,不写 topic / payload / outbox / relay。 |
| Inbound / Job | 无 | 不展开 | marketplace / ecosystem 原始事件先走外部摘要与引用;外围读取材料刷新由后台维护 `RefreshPeripheralReadMaterials` 承接。 |

#### R1.23.3 预计处理流族

| 处理流族 | 覆盖接口 | 主要对象 | 关键分支 | 后续 R1.24 写法 |
|---|---|---|---|---|
| `MethodPackageLifecycleFlow` | `EstablishMethodPackage`;`AdjustMethodPackageComposition`;`RetireMethodPackage`;`MarkMethodPackageUnavailable` | `MethodPackage`;`MethodPackageRef`;member refs;distribution context;marketplace context ref;package history | established / adjusted / retired / unavailable / composition rejected。 | 写一张 package lifecycle 流图,强调 package 不创建核心资产、不保存包体、不形成 listing。 |
| `MethodSetAssemblyLifecycleFlow` | `AssembleMethodSet`;`AdjustMethodSetAssembly`;`RetireMethodSetAssembly`;`MarkMethodSetAssemblyStaleOrUnavailable` | `MethodSetAssembly`;`MethodSetAssemblyRef`;package refs;asset refs;consumption/adoption context;assembly history | assembled / adjusted / retired / stale / unavailable / boundary rejected。 | 写一张 method set assembly 流图,强调不扩大消费授权、不保存组织运行配置。 |
| `PackageCompositionEvaluationFlow` | `EvaluatePackageComposition` | `PackageCompositionRule`;package / assembly refs;formal version refs;distribution context refs;safe reason refs | accepted / rejected / invalid / unavailable / boundary violation。 | 写一张 composition evaluation 流图,可被 package / assembly lifecycle 调用,但不写算法矩阵。 |
| `PeripheralReadFlow` | 9 个 Query | package truth/view;assembly truth/view;composition diagnostic;discovery context;history | found / missing / stale / unavailable / diagnostic safe reason。 | 写轻量只读说明,复用通用 Query 图。 |
| `PeripheralEventCandidate` | 4 个 Outbound Event | package ref;assembly ref;composition marker;view availability marker | candidate produced / invalidation hint / delivery deferred。 | 写统一事件候选说明,不画 relay 或 refresh job。 |

#### R1.23.4 不展开和后置项

| 项 | 当前裁决 | 理由 |
|---|---|---|
| marketplace listing / price / order / purchase / subscription / settlement | 排除 | 这些属于 marketplace 或外部生态交易履约,不是 L3 method library truth。 |
| install / fulfillment / package binary / archive body | 排除 | 本仓只表达外围组织语义和 refs,不保存安装包或包体。 |
| organization runtime config / UI preset / SDK profile / AI override | 排除 | method set assembly 不是组织运行配置或 UI 状态。 |
| package / method set 成为核心闭环前置 | 排除 | peripheral 不阻塞 definition、formalization、consumption、trace 和 relation 成立。 |
| marketplace 原始事件直接 Inbound | 排除 | 外部生态线索必须先由外部摘要与引用形成 body-free summary/ref。 |
| peripheral read material refresh job | 后置到后台维护与收敛 | `RefreshPeripheralReadMaterials` 已由后台维护承接,本组成部分只产生 view invalidation / availability hint。 |
| composition algorithm / full rule matrix | 后置到详细设计 | 概要只写 composition rule 的处理位置、输入输出和禁止事项。 |

#### R1.23.5 风险诊断

| 风险 | 影响 | R1.24 处理 |
|---|---|---|
| package lifecycle 被写成 marketplace listing | 会把交易、定价、安装、履约带入本仓。 | package flow 明确只表达外围组织 truth candidate,拒绝 listing / order / install。 |
| method set assembly 被写成组织运行配置 | 会把 UI、SDK、runtime adoption state 混入设计。 | assembly flow 只保存 package/member/adoption context refs 和 composition summary。 |
| composition evaluation 自动修核心 truth | 会绕过 definition、formalization、consumption boundary。 | composition flow 只输出 accepted / rejected / unavailable summary,不修成员 truth。 |
| peripheral unavailable 被解释为核心失败 | 会让外围增强阻塞核心闭环。 | unavailable 只隔离外围 package / set / view,不影响核心方法资产成立。 |
| discovery Query 做 marketplace ranking / recommendation | 会把搜索和商业排序混入 L3。 | read flow 只返回 body-free discovery refs,不做 ranking、交易或推荐。 |
| peripheral event 被写成 refresh worker trigger | 会混淆事件候选和后台维护。 | event candidate 只表达事实变化;刷新由后台维护处理。 |

#### R1.23.6 下一写入批次结构

下一批 `R1.24 外围包与方法集组织处理流:再写入` 只写:

1. `本组成部分写入说明`。
2. `MethodPackageLifecycleFlow` ASCII 图和关键说明。
3. `MethodSetAssemblyLifecycleFlow` ASCII 图和关键说明。
4. `PackageCompositionEvaluationFlow` ASCII 图和关键说明。
5. `PeripheralReadFlow` 轻量读路径说明。
6. `PeripheralEventCandidate` 统一事件候选说明。
7. `接口覆盖 / 不展开理由表`。
8. `本模块停审记录`。

#### R1.23.7 下一写入批次边界

下一批不得写跨处理流一致性审计,不得写 marketplace listing、交易、安装、履约、package body、archive body、organization runtime config、UI preset、SDK profile、AI override、peripheral refresh job、composition algorithm matrix、正式 `02-概要设计.md` 或 Step 9。

#### R1.23.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写具体处理流图正文。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 9 个 Command、9 个 Query、4 个 Outbound Event。 |
| 是否以当前 R1 接口为准 | pass | 使用 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.34` 的当前接口名。 |
| 是否保持 peripheral 边界 | pass | 明确 package / method set 不阻塞核心闭环。 |
| 是否排除 marketplace / 安装履约 | pass | 明确只保留 marketplace context ref 等边界引用,不进入交易履约。 |
| 是否避免刷新 job 越界 | pass | peripheral refresh 已后置到后台维护。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `外围包与方法集组织处理流:再写入`;只写本组成部分 package lifecycle、method set assembly lifecycle、composition evaluation、peripheral read 和 event candidate 处理流,不得写跨处理流一致性审计,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.24 外围包与方法集组织处理流:再写入

#### R1.24.1 本组成部分写入说明

本模块只写 `外围包与方法集组织` 的关键处理流。它覆盖 method package 生命周期、method set assembly 生命周期、composition evaluation、外围读取和外围事件候选。

外围包与方法集组织是 peripheral enhancement。它可以围绕已成立或允许引用的方法资产、正式版本、关系、分发语义和消费语境形成组织语义,但不得成为 definition、formalization、consumption、trace consistency、relation 或 external summary 成立的前置条件。

#### R1.24.2 MethodPackageLifecycleFlow

覆盖接口:

- `EstablishMethodPackage`
- `AdjustMethodPackageComposition`
- `RetireMethodPackage`
- `MarkMethodPackageUnavailable`

```text
<Method Package Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - MethodPackageRef
  - member method asset refs / formal version refs
  - DistributionContextRef / optional MarketplaceContextRef
  - PackageCompositionRuleRef / safe reason refs
        |
        v
<Package Boundary Gate>
  - validate package ref and member typed refs
  - validate package is peripheral and not core prerequisite
  - reject marketplace listing / order / install / fulfillment
  - reject package body / artifact body / archive body
        |
        v
<Load MethodPackage>
  - establish new package
  - adjust composition
  - retire package
  - mark unavailable
        |
        +--> establish / adjust
        |       |
        |       v
        |   <Evaluate PackageCompositionRule>
        |
        +--> retire
        |       |
        |       v
        |   <Close peripheral package lifecycle>
        |
        +--> unavailable
                |
                v
            <Isolate package without failing core loop>
        |
        v
<Persist Package Organization>
  - save MethodPackage peripheral truth candidate
  - append PackageAssemblyHistory hint
  - produce peripheral view invalidation hint
        |
        v
<Package Result>
  - MethodPackageRef
  - package lifecycle / composition summary
  - MethodPackageChanged candidate
  - PackageCompositionResultChanged candidate when evaluated
```

关键设计点:

- `MethodPackage` 表达外围包组织语义,不是 marketplace listing、安装包、artifact package、archive package 或交易商品。
- package establish / adjust 只能引用已成立或允许引用的 core refs,不得创建 definition truth、发布 formal version 或扩大 consumption boundary。
- unavailable 只隔离外围 package,不表示核心方法资产、正式版本、关系或追溯失败。

#### R1.24.3 MethodSetAssemblyLifecycleFlow

覆盖接口:

- `AssembleMethodSet`
- `AdjustMethodSetAssembly`
- `RetireMethodSetAssembly`
- `MarkMethodSetAssemblyStaleOrUnavailable`

```text
<Method Set Assembly Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - MethodSetAssemblyRef
  - MethodPackageRef set / method asset refs
  - adoption context / ConsumptionContextRef hints
  - PackageCompositionRuleRef / safe reason refs
        |
        v
<Assembly Boundary Gate>
  - validate assembly ref, package refs and member refs
  - validate consumption/adoption context refs
  - reject organization runtime config / UI preset / SDK profile / AI override
  - reject downstream adoption success or runtime state
        |
        v
<Load MethodSetAssembly>
  - assemble new method set
  - adjust package/member composition
  - retire assembly
  - mark stale or unavailable
        |
        v
<Evaluate Assembly Composition>
  - accepted
  - rejected by composition rule
  - stale due to member/package/context change
  - unavailable but core loop remains valid
        |
        v
<Persist Assembly Organization>
  - save MethodSetAssembly peripheral truth candidate
  - append PackageAssemblyHistory hint
  - produce assembly view invalidation hint
        |
        v
<Assembly Result>
  - MethodSetAssemblyRef
  - assembly lifecycle / composition summary
  - MethodSetAssemblyChanged candidate
  - PackageCompositionResultChanged candidate when evaluated
```

关键设计点:

- `MethodSetAssembly` 表达组织级方法集组装语义,不保存组织运行配置、UI 状态、SDK profile、AI override 或下游采用成功事实。
- method set 不能把非正式定义变成可消费正式版本,也不能扩大消费授权。
- stale / unavailable 是外围状态,不得升级为核心闭环失败。

#### R1.24.4 PackageCompositionEvaluationFlow

覆盖接口:

- `EvaluatePackageComposition`

```text
<Package Composition Evaluation>
  - ActorContext / CommandMetadata / IdempotencyKey
  - MethodPackageRef or MethodSetAssemblyRef
  - PackageCompositionRuleRef
  - candidate member refs / version refs / distribution context refs
  - safe reason refs
        |
        v
<Composition Boundary Gate>
  - validate package / assembly refs
  - validate member refs and formal version refs
  - validate distribution / marketplace context refs are boundary-only
  - reject marketplace transaction, install, fulfillment or listing body
        |
        v
<Evaluate PackageCompositionRule>
  - composition accepted
  - composition rejected
  - invalid member / boundary violation
  - unavailable context
        |
        v
<Composition Result>
  - composition marker
  - safe reason refs
  - affected package / assembly refs
  - PackageCompositionResultChanged candidate
```

关键设计点:

- composition evaluation 只输出 accepted / rejected / invalid / unavailable summary,不写完整规则算法、矩阵、policy engine 或配置项。
- composition rule 不修成员 truth、不创建 package truth、不扩大消费授权。
- `MarketplaceContextRef` 只表达生态发现上下文边界,不得承载 listing、price、order、install 或 fulfillment。

#### R1.24.5 PeripheralReadFlow

覆盖 Query:

| Query | 读取路径 | 输出边界 | 禁止事项 |
|---|---|---|---|
| `GetMethodPackage` | 按 package ref 读取 package truth summary。 | member refs、formal version refs、distribution context refs、composition marker。 | 不返回 package body、artifact/archive body、listing body、交易状态或核心定义正文。 |
| `ListMethodPackages` | 按 scope / context 分页读取 package summaries。 | package page、availability markers。 | 不做 marketplace ranking、推荐、商业筛选或安装可用性判断。 |
| `GetMethodPackageView` | 按 package view ref 或 package ref 读取 view。 | package view summary、member refs、freshness marker。 | view 不替代 package truth,不返回核心定义正文。 |
| `GetMethodPackageCompositionDiagnostic` | 按 package ref / rule ref 读取 composition diagnostic。 | composition marker、invalid / unavailable reason refs。 | 不暴露完整规则算法、配置矩阵或 policy engine 内部。 |
| `GetMethodSetAssembly` | 按 assembly ref 读取 assembly truth summary。 | package refs、asset refs、adoption context refs。 | 不返回组织运行配置、UI preset、SDK profile、AI override 或下游采用结果。 |
| `ListMethodSetAssemblies` | 按 adoption/context filter 分页读取 assemblies。 | assembly page、availability / stale markers。 | 不表达组织采用成功事实,不读取下游 runtime state。 |
| `GetMethodSetAssemblyView` | 按 assembly view ref 或 assembly ref 读取 view。 | assembly view summary、package/member refs、composition marker。 | 不扩大 consumption boundary,不替代正式消费材料。 |
| `GetPeripheralDiscoveryContext` | 按 marketplace/distribution context refs 读取 discovery context。 | body-free discovery context summary、package / assembly refs。 | 不返回 listing、价格、订单、安装、履约或外部正文。 |
| `GetPackageAssemblyHistory` | 按 package / assembly ref 分页读取 history。 | history page、change kind、safe reason refs。 | 不返回 package body、组织配置正文、marketplace transaction、raw log 或 event payload。 |

读取流通用骨架:

```text
<Peripheral Query>
  - ActorContext / QueryMetadata
  - MethodPackageRef / MethodSetAssemblyRef / view ref / MarketplaceContextRef
        |
        v
<Peripheral Query Gate>
  - validate typed package / assembly / context refs
  - reject marketplace transaction, install, package body or organization runtime request
        |
        v
<Load Peripheral Read Source>
  - MethodPackage / MethodPackageView
  - MethodSetAssembly / MethodSetAssemblyView
  - composition diagnostic / discovery context / history
        |
        +--> found
        |       |
        |       v
        |   <Return body-free peripheral summary>
        |
        +--> missing / stale / unavailable
                |
                v
            <Return safe absence, stale or unavailable hint>
```

关键设计点:

- peripheral Query 只读 package、assembly、view、diagnostic、discovery 和 history material,不得创建或修复 package / set。
- discovery context 只返回 body-free refs 和 safe summaries,不做 marketplace ranking、推荐、交易或安装可用性判断。
- view stale / unavailable 不影响核心方法资产闭环成立。

#### R1.24.6 PeripheralEventCandidate

| Event candidate | 来源 | 输出骨架 | 边界 |
|---|---|---|---|
| `MethodPackageChanged` | package established / adjusted / retired / unavailable。 | `MethodPackageRef`;change kind;member / context refs;trace context。 | 不携带 package body、artifact/archive body、listing、交易或安装信息。 |
| `MethodSetAssemblyChanged` | method set assembled / adjusted / retired / stale / unavailable。 | `MethodSetAssemblyRef`;change kind;package/member refs;adoption context refs。 | 不携带组织运行配置、UI / SDK 状态、AI override 或下游采用结果。 |
| `PackageCompositionResultChanged` | composition evaluated accepted / rejected / invalid / unavailable。 | package or assembly ref;composition marker;safe reason refs;trace context。 | 不携带完整规则算法、规则矩阵、policy engine 内部或配置项。 |
| `PeripheralViewAvailabilityChanged` | package / assembly view availability changed or invalidated。 | view ref;availability / freshness marker;source refs;trace context。 | 派生可用性变化不代表核心 truth 改变,不携带 projection storage 细节。 |

事件候选只说明外围 package、method set、composition 或 view availability 已变化。topic、payload schema、outbox、relay、subscriber、retry、peripheral refresh worker 和 marketplace integration 全部后置。

#### R1.24.7 接口覆盖 / 不展开理由表

| 对象 | 覆盖情况 | 说明 |
|---|---|---|
| 9 个 Command | covered | package lifecycle 4 个、method set lifecycle 4 个、composition evaluation 1 个均已覆盖。 |
| 9 个 Query | covered_by_lightweight_read | 复用通用 Query 只读路径,本模块补 package / assembly / composition / discovery / history 边界。 |
| 4 个 Outbound Event | covered_by_event_candidate | 只写事件候选产生,不写 delivery / outbox / relay。 |
| Inbound Consumer | not_applicable | 本组成部分无 Inbound;marketplace / ecosystem 原始事件先走外部摘要与引用。 |
| Operations Job | not_applicable | peripheral read material refresh 已由后台维护 `RefreshPeripheralReadMaterials` 承接。 |
| 核心闭环 | not_blocked_by_peripheral | package / set 不作为定义、正式化、消费、追溯、关系或外部摘要成立前置。 |

#### R1.24.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入本组成部分处理流 | pass | 已写 package lifecycle、method set assembly lifecycle、composition evaluation、peripheral read 和 event candidate。 |
| 是否覆盖本组成部分接口 | pass | 覆盖 9 个 Command、9 个 Query、4 个 Outbound Event。 |
| 是否以当前 R1 接口为准 | pass | 使用 Step 7 `R1.24` / `R1.26` / `R1.30` / `R1.34` 的当前接口名。 |
| 是否保持 peripheral 边界 | pass | 明确 package / method set 不阻塞核心闭环。 |
| 是否排除 marketplace / 安装履约 | pass | 未引入 listing、price、order、install、fulfillment 或 package body。 |
| 是否避免 Query 副作用 | pass | Query 不创建 package / set,不刷新 view,不做 marketplace ranking。 |
| 是否避免后台维护越界 | pass | peripheral refresh 后置到后台维护,本模块只产生 invalidation / availability hint。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `跨处理流一致性审计:先思考`;只思考八个组成部分处理流之间的接口覆盖、对象引用、接缝、事务粒度和未展开理由审计框架,不得直接写审计正文,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.25 跨处理流一致性审计:先思考

#### R1.25.1 问题回答

- 本模块只做审计框架设计,不直接写审计表结论。下一批再写接口覆盖、对象引用、跨组成部分接缝、事务 / 副作用粒度和未展开理由审计表。
- 审计第一来源是当前 Step 7 的五类接口总表和 Step 8 已写入的通用流、八个组成部分处理流。旧 `5.21` 跨处理流审计只能作为 historical shape reference,不得复制旧完成态。
- 审计目标不是新增处理流,而是检查 Step 8 已写入处理流是否足以承接 Step 7 接口、Step 6 对象和 Step 5 组成部分边界。
- 审计必须显式说明未展开项为什么不展开,避免后续 Step 9 / 03 误认为缺处理流。

#### R1.25.2 审计范围裁决

| 范围 | 是否纳入 | 理由 |
|---|---|---|
| Step 7 Command API 58 个 | yes | 每个 Command 必须被独立处理流、通用写入骨架、组成部分处理流或明确不适用理由覆盖。 |
| Step 7 Query API 57 个 | yes | Query 数量多,但必须确认均落入通用只读路径、组成部分读路径或明确未展开理由。 |
| Step 7 Inbound Event Consumer 4 个 | yes | 全部归外部摘要与引用,需要确认 inbound intake 只承接 body-free summary/ref/marker。 |
| Step 7 Outbound Event 34 个 | yes | 只审计事件候选产生来源,不审计 outbox、topic、relay 或投递保证。 |
| Step 7 Operations Job 8 个 | yes | 全部归后台维护与收敛,需要确认 job 只刷新派生材料和收敛状态。 |
| Step 6 关键对象 / ref / summary / material / view / task | yes | 审计处理流是否只引用已闭合对象,不得新增 truth、DTO、schema、port 或状态主语。 |
| 旧正式 §8 和 historical `5.x` | later | 本模块不做旧材料差异审计;旧材料差异后置到独立模块。 |
| Step 9 状态机 | no | 本模块只能生成 Step 9 状态来源输入,不得提前写状态机。 |

#### R1.25.3 预计审计维度

| 审计维度 | 检查问题 | 预期输出 |
|---|---|---|
| 接口覆盖 | 58 + 57 + 4 + 34 + 8 是否均有处理流承接或明确未展开理由。 | 五类接口覆盖表。 |
| 对象引用 | 每个处理流是否只使用 Step 6 已定义对象、typed ref、summary、material、view、task、policy 或 history。 | 对象引用审计表。 |
| 跨组成部分接缝 | 定义 / 目录、正式化、消费、追溯、关系分发、外部摘要、维护、外围组织之间是否按 Step 5 边界协作。 | 跨组成部分接缝审计表。 |
| 事务 / 副作用粒度 | Command、Query、Inbound、Outbound、Job 是否保持各自副作用边界。 | 事务与副作用粒度表。 |
| 未展开理由 | 未画独立图的 Query、Event、Job 机制、外部正文和外围履约是否有稳定理由。 | 未展开理由表。 |
| Step 9 承接 | 哪些状态来源需要交给 Step 9 重写或深度反查。 | Step 9 输入提示。 |

#### R1.25.4 高风险交叉点

| 高风险点 | 风险 | 审计处理 |
|---|---|---|
| Query 重复图过多 | 57 个 Query 若逐个画图会造成低价值重复,并诱导 Query 写入副作用。 | 审计 Query 是否落入通用只读路径或组成部分读路径,不要求逐 Query 画图。 |
| Inbound 与 Command 混淆 | 外部摘要 inbound 可能被误写成直接创建正式版本、关系或消费材料。 | 审计 inbound 只产生 intake result、pending review、summary/ref/marker 或线索。 |
| Outbound Event 与 outbox 混淆 | 事件候选可能被误扩成 topic、payload、relay、retry、dead letter。 | 审计只保留 fact / material / maintenance / peripheral changed 候选来源。 |
| Operations Job 修 core truth | 维护任务可能被误写成重做正式化、修复 definition 或改 relation truth。 | 审计 job 仅刷新 read material、trace material、progress 和 consistency recovery material。 |
| 外部摘要回流正文 | External summary / artifact 可能把 raw body、provider payload、evidence body 或 log body 带回本仓。 | 审计所有流只使用 body-free summary/ref/digest/marker。 |
| 外围组织阻塞核心闭环 | package / method set 可能被误当成正式化或消费前置。 | 审计 peripheral 不阻塞 definition -> formalization -> consumption 主链。 |
| 旧主语复活 | `MethodContent`、`DefinitionSnapshot`、`fingerprint`、`OutboxEvent` 可能在审计中被重新承认。 | 本模块直接列为禁止恢复项,差异审计后置。 |

#### R1.25.5 下一写入批次结构

下一批 `R1.26 跨处理流一致性审计:再写入` 只写:

1. 审计输入声明。
2. 五类接口覆盖审计表。
3. Step 6 对象引用审计表。
4. 跨组成部分接缝审计表。
5. 事务 / 副作用粒度审计表。
6. 未展开理由审计表。
7. Step 9 承接提示。
8. 本模块停审记录。

#### R1.25.6 下一写入批次边界

下一批不得写旧材料差异审计、正式 §8 回填草稿、Step 9 状态机、03 详细设计承接、outbox / topic / relay / worker / scheduler / queue / retry、marketplace listing / installation / fulfillment、raw external body、evidence body、logs、provider payload、旧 `MethodContent`、`DefinitionSnapshot`、`fingerprint` 或 `OutboxEvent`。

#### R1.25.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只定义审计范围、维度、风险和下一写入结构,未写审计结论表。 |
| 是否以当前 Step 7 接口为准 | pass | 审计范围使用 58 Command、57 Query、4 Inbound、34 Outbound、8 Operations Job。 |
| 是否承接 Step 5 / Step 6 / Step 8 | pass | 审计维度覆盖主要组成部分、对象引用和已写处理流。 |
| 是否避免旧材料反推 | pass | 旧 `5.21` 仅作为 historical shape reference,不继承结论。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `跨处理流一致性审计:再写入`;只写接口覆盖、对象引用、跨部分接缝、事务 / 副作用粒度和未展开理由审计表,不得写旧材料差异审计,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.26 跨处理流一致性审计:再写入

#### R1.26.1 审计输入声明

本模块只审计当前 R1 已写入的 Step 8 处理流,不新增接口、不新增对象、不重写旧材料。审计输入限定为:

| 输入 | 用途 |
|---|---|
| Step 7 `R1.24` Command 总表 | 校验 58 个 Command 是否被处理流覆盖。 |
| Step 7 `R1.26` Query 总表 | 校验 57 个 Query 是否落入只读路径或组成部分读流。 |
| Step 7 `R1.28` Inbound 总表 | 校验 4 个 Inbound Consumer 是否全部归外部摘要与引用。 |
| Step 7 `R1.30` Outbound 总表 | 校验 34 个 Outbound Event 是否仅作为事件候选。 |
| Step 7 `R1.32` Operations Job 总表 | 校验 8 个 Job 是否全部归后台维护与收敛。 |
| Step 7 `R1.34` 接口到组成部分映射 | 校验 owner 唯一性和跨组成部分接缝。 |
| Step 6 当前对象结论 | 校验处理流是否只引用已闭合对象 / ref / summary / material / view / task。 |
| Step 8 `R1.8`~`R1.24` | 校验通用流和八个组成部分处理流是否闭合。 |

#### R1.26.2 五类接口覆盖审计表

| 组成部分 | Command | Query | Inbound | Outbound | Job | 覆盖结论 |
|---|---:|---:|---:|---:|---:|---|
| 方法资产定义与目录 | 6 | 4 | 0 | 2 | 0 | `MethodAssetDefinitionWriteFlow`、`MethodAssetCatalogEntryWriteFlow`、definition/catalog read 和 event candidate 覆盖。 |
| 正式化与版本 | 6 | 6 | 0 | 4 | 0 | eligibility、formal version lifecycle、formalization/version read 和 event candidate 覆盖。 |
| 受控消费 | 5 | 6 | 0 | 4 | 0 | consumption boundary、material preparation、violation、read 和 event candidate 覆盖。 |
| 追溯与一致性保护 | 7 | 7 | 0 | 5 | 0 | trace、impact、protection、audit/evidence lineage、read 和 event candidate 覆盖。 |
| 关系与分发语义 | 10 | 9 | 0 | 5 | 0 | relation lifecycle、integrity、distribution ref、read 和 event candidate 覆盖。 |
| 外部摘要与引用 | 9 | 8 | 4 | 5 | 0 | external summary/ref/body boundary/lineage、唯一 inbound intake、read 和 event candidate 覆盖。 |
| 后台维护与收敛 | 6 | 8 | 0 | 5 | 8 | maintenance request/control、8 个 job、progress read 和 maintenance event candidate 覆盖。 |
| 外围包与方法集组织 | 9 | 9 | 0 | 4 | 0 | package lifecycle、method set assembly、composition、peripheral read 和 event candidate 覆盖。 |
| 合计 | 58 | 57 | 4 | 34 | 8 | 与 Step 7 五类接口总表一致。 |

审计结论:

- Command 覆盖 pass。每个 Command 都有组成部分 owner 和处理流族承接;没有恢复旧 draft / publish / snapshot command。
- Query 覆盖 pass。57 个 Query 均落入通用只读骨架或组成部分读流;没有 Query 创建 truth、刷新材料、修复一致性或拉取外部正文。
- Inbound 覆盖 pass。4 个 Inbound Consumer 全部归 `ExternalInboundIntakeFlow`,且只承接 body-free fact。
- Outbound 覆盖 pass。34 个 Outbound Event 只作为业务事实 / 材料 / 维护 / 外围变化候选;不写 topic、payload schema、outbox 或 relay。
- Operations Job 覆盖 pass。8 个 Job 全部归 `后台维护与收敛`,只刷新派生材料或推动收敛进度,不修 core truth。

#### R1.26.3 Step 6 对象引用审计表

| 对象族 | 被哪些处理流引用 | 审计结论 |
|---|---|---|
| Definition / Catalog | `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`MethodAssetCatalogView`、history summary。 | pass:只作为 definition / catalog truth 和派生读取材料;未恢复 `MethodContent`。 |
| Formalization / Version | `FormalizationState`、`FormalMethodAssetVersion`、`FormalizationBasisSummary`、`FormalizationHistory`。 | pass:状态、版本 truth 和历史线索分离;未用 hash / fingerprint / snapshot 替代版本。 |
| Consumption | `MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`、`DefinitionUseBoundaryGuard`、`ConsumptionContextRef`。 | pass:消费材料只承载 summary / refs;未复制 definition body 或下游 runtime truth。 |
| Trace / Impact / Audit | `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy`、`MethodAssetAuditTrail`、evidence lineage refs。 | pass:只组织 body-free trace、impact、audit 和 lineage;未保存 raw log / evidence body。 |
| Relation / Distribution | `MethodAssetRelation`、`RelationIntegrityRule`、`MethodAssetDistributionRef`、`DistributionReadMaterial`。 | pass:关系和分发语义不等于 runtime dependency、推荐、marketplace listing 或安装履约。 |
| External Summary / Ref | `ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef`、`ExternalBodyBoundaryRule`、`ExternalBasisAcceptanceHistory`。 | pass:唯一外部入口保持 summary/ref/marker/digest,不保存正文。 |
| Maintenance | `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceProgressView`、run / scope refs。 | pass:维护只操作 task/progress/material/issue refs;不改 core truth。 |
| Peripheral | `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、package / assembly view、peripheral discovery context。 | pass:外围组织不阻塞核心闭环,不表示交易、安装、履约或运行配置。 |

审计结论: 当前 Step 8 未引入 Step 6 之外的新 truth 主语、DTO schema、port、state owner 或持久化主语。后续 03 详细设计若发现字段 / port 缺口,应回写对应 Step 6 / Step 7,不得从 Step 8 私补。

#### R1.26.4 跨组成部分接缝审计表

| 接缝 | 正式方向 | 当前处理流承接 | 风险处置 |
|---|---|---|---|
| 定义 / 目录 -> 正式化 | definition 和 catalog summary 成为 formalization 输入。 | `MethodAssetDefinitionWriteFlow` 只产生 safe summary / refs;`FormalizationEligibilityFlow` 只消费这些输入。 | pass:definition adjustment 不直接建立 formal version。 |
| 正式化 -> 受控消费 | formal version 成为 consumption material 前提。 | `FormalMethodAssetVersionLifecycleFlow` 输出 formal version refs;`ConsumptionMaterialPreparationFlow` 受 boundary 和 guard 控制。 | pass:formal version 存在不等于自动可消费。 |
| 消费 -> 追溯 / 保护 | consumption material、violation 和 context refs 进入 trace / impact / protection。 | `DefinitionUseBoundaryViolationFlow` 只产生 trace hint;`TraceMaterialOrganizationFlow` 承接 body-free refs。 | pass:violation 不直接组织完整 audit 或 recovery。 |
| 追溯 / 保护 -> 关系 / 分发 | trace / impact / protection 作为 relation integrity 或 distribution 参考线索。 | `ConsistencyProtectionDecisionFlow` 不改 relation truth;`RelationIntegrityFlow` 只读取安全线索。 | pass:relation integrity 不绕过正式化或消费边界。 |
| 关系 / 分发 -> 外部摘要 | 外部依据只通过 summary/ref 支撑 relation / distribution 解释。 | `DistributionReferenceFlow` 不保存 provider payload;`ExternalSourceSummaryLifecycleFlow` 只提供 body-free summary。 | pass:外部摘要不回流正文。 |
| 外部摘要 -> 维护 | stale / unavailable / invalidation / diagnostic hint 可触发维护请求。 | `ExternalSummaryReferenceEventCandidate` 只产生候选;`MaintenanceRequestControlFlow` 接收正式维护请求。 | pass:inbound 不直接启动 worker 或 job。 |
| 维护 -> 八个 read material family | job 刷新派生读取材料和 progress。 | `ReadMaterialRefreshJobFlow`、`TraceAuditImpactRefreshJobFlow`、`ConsistencyRecoveryConvergenceFlow` 承接。 | pass:job 不修 definition、formal version、relation、external summary 或 package truth。 |
| 核心六部分 -> 外围组织 | package / set 引用已成立或允许引用的 core refs。 | `MethodPackageLifecycleFlow`、`MethodSetAssemblyLifecycleFlow`、`PackageCompositionEvaluationFlow` 承接。 | pass:peripheral 不成为核心闭环前置。 |

#### R1.26.5 事务 / 副作用粒度审计表

| 类别 | 允许副作用 | 禁止副作用 | 审计结论 |
|---|---|---|---|
| Command | 写本仓 truth、summary、boundary、history hint、maintenance request 或 peripheral organization。 | 拉外部正文、写下游 runtime、执行 worker、写 outbox delivery、绕过其他组成部分 owner。 | pass |
| Query | 只读 truth summary、view、material、diagnostic、history、progress 或 safe absence。 | 创建 truth、刷新 material、注册 ref、修复关系、启动 job、摘要化正文。 | pass |
| Inbound Consumer | 校验 envelope / schema / dedup,形成 body-free intake summary 或 handoff hint。 | 直接创建 formal version、relation、package、job run 或保存 raw payload。 | pass |
| Outbound Event Candidate | 标记已成立 fact / material / maintenance / peripheral changed 的候选输出。 | 定义 topic、payload schema、outbox、relay、subscriber、retry、delivery state。 | pass |
| Operations Job | 刷新派生 read material、trace/audit/impact material、recovery progress 和 peripheral material。 | 修 core truth、重做正式化、扩大消费边界、拉正文、改 relation truth、执行 marketplace 履约。 | pass |
| Maintenance Query | 读取 progress、task summary、run history 和 pending scope。 | 启动 job、确认 issue、隐藏 unavailable、返回 worker log / queue state。 | pass |

#### R1.26.6 未展开理由审计表

| 未展开项 | 不展开理由 | 后续承接 |
|---|---|---|
| 57 个 Query 逐个流程图 | 大量重复通用只读骨架;逐个画图会诱导 Query 副作用。 | 当前保留组成部分读流和只读边界;细化到 03 / 05。 |
| Outbound delivery / outbox / topic / relay | Step 8 只定义事件候选产生来源,投递机制不是概要处理流主线。 | 如需要,在 03 / 04 重新闭口。 |
| Worker / scheduler / queue / retry / lock | 属于实施 / 运维 / 详细设计机制,不是概要业务处理流。 | 后续实施计划或运维设计。 |
| Marketplace listing / order / install / fulfillment | 外围生态履约不属于本仓核心方法库 truth。 | 外围仓或未来设计单独讨论。 |
| Raw external body / artifact body / archive body / evidence body | 与 body-free 边界冲突,会污染 formalization、trace、audit 和 consumption。 | 只保留 typed ref、digest hint、marker、safe summary。 |
| Graph algorithm / recommendation / search ranking | 关系语义不等于运行依赖图或推荐系统。 | 若有需要,后续专门建模,不得反推当前 relation truth。 |
| Full policy / auth / role / token matrix | 概要层只表达 boundary summary 和 safe reason。 | 03 / 04 讨论 policy adapter 或配置。 |
| 旧 `MethodContent` / `DefinitionSnapshot` / `fingerprint` / `OutboxEvent` | 与当前 Step 5~7 主线冲突。 | 下一模块做旧材料差异审计,不得在当前审计中恢复。 |

#### R1.26.7 Step 9 承接提示

| Step 9 需要承接的状态来源 | 来源处理流 |
|---|---|
| definition / catalog lifecycle and stale view | `MethodAssetDefinitionWriteFlow`;`MethodAssetCatalogEntryWriteFlow`;maintenance read refresh。 |
| formalization and formal version lifecycle | `FormalizationEligibilityFlow`;`FormalMethodAssetVersionLifecycleFlow`。 |
| consumption material and availability state | `ConsumptionMaterialPreparationFlow`;`DownstreamConsumptionBoundaryFlow`。 |
| trace / impact / protection / audit / lineage material state | `TraceMaterialOrganizationFlow`;`ConsumptionImpactSummaryFlow`;`ConsistencyProtectionDecisionFlow`;`AuditEvidenceLineageFlow`。 |
| relation / integrity / distribution availability state | `MethodAssetRelationLifecycleFlow`;`RelationIntegrityFlow`;`DistributionReferenceFlow`。 |
| external summary / ref / body boundary / lineage disposition | `ExternalSourceSummaryLifecycleFlow`;`ExternalBodyBoundaryFlow`;`ExternalInboundIntakeFlow`。 |
| maintenance task / run / progress / recovery disposition | `MaintenanceRequestControlFlow`;`ReadMaterialRefreshJobFlow`;`ConsistencyRecoveryConvergenceFlow`;`MaintenanceProgressReadFlow`。 |
| package / method set / composition / peripheral view state | `MethodPackageLifecycleFlow`;`MethodSetAssemblyLifecycleFlow`;`PackageCompositionEvaluationFlow`;`PeripheralReadFlow`。 |

Step 9 重写时必须从上述状态来源重新组织,不得继承旧 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot export state、fingerprint drift state 或 worker queue state。

#### R1.26.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入跨处理流审计正文 | pass | 已写接口覆盖、对象引用、接缝、事务 / 副作用粒度、未展开理由和 Step 9 承接提示。 |
| 是否覆盖 Step 7 五类接口总数 | pass | 58 Command、57 Query、4 Inbound、34 Outbound、8 Job 总数闭合。 |
| 是否保持 Step 6 对象边界 | pass | 未新增 truth、DTO、schema、port、state owner 或持久化主语。 |
| 是否确认 Inbound owner | pass | Inbound 仅归外部摘要与引用。 |
| 是否确认 Operations Job owner | pass | Operations Job 仅归后台维护与收敛。 |
| 是否确认 Query 只读 | pass | Query 不创建、刷新、修复、拉取正文或启动 job。 |
| 是否写旧材料差异审计 | no | 旧材料差异审计后置到下一模块。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `旧材料差异审计:先思考`;只思考旧正式 §8、historical Step 8 和历史 DDD 处理流污染点的审计框架,不得直接写差异审计正文,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.27 旧材料差异审计:先思考

#### R1.27.1 问题回答

- 本模块只设计旧材料差异审计框架,不直接写替换表、污染结论或正式 §8 回填草稿。
- 旧材料只能作为污染检查输入,不得反推当前 Step 8 处理流名称、对象 owner、接口分类或状态来源。
- 当前 Step 8 的判定基线已经由 `R1.8`~`R1.26` 闭合:五类接口总数、八个组成部分处理流、对象引用、接缝和未展开理由均已完成审计。
- 下一批差异审计需要回答的是:旧正式 §8、historical Step 8 和历史 DDD 中哪些主线必须废弃、哪些只能改名后按当前对象重新讨论、哪些只是禁止项提醒。

#### R1.27.2 审计输入范围

| 输入材料 | 本轮用途 | 使用限制 |
|---|---|---|
| 旧正式 `02-概要设计.md` §8 | 识别旧 `MethodContent` publish / snapshot / outbox / fingerprint 处理流污染。 | 不继承处理流名称、图、接口或状态结论。 |
| 旧正式 `02-概要设计.md` §9 | 识别 Step 9 可能继承的旧状态主线。 | 本模块只记录 Step 9 风险提示,不写状态机。 |
| 本文件 historical `5.22` | 参考旧差异审计的表格形状和污染关键词。 | 不继承 completed 结论;必须按当前 R1 重新审计。 |
| 历史 `03_ddd_step_08_protocol_contracts.md` | 识别旧 API / event / job / outbox relay / snapshot protocol 污染。 | 不作为当前接口 contract 来源。 |
| 历史 `03_ddd_step_09_function_flows.md` | 识别旧函数级 publish / outbox / snapshot / replay / recalculation 流污染。 | 不作为当前处理流或详细设计 handoff 来源。 |
| 历史 `03_ddd_step_10_state_machine.md` | 识别旧 `MethodContentLifecycle` 和 `OutboxEventStatus` 状态污染。 | 不提前展开 Step 9。 |
| 当前 `R1.26` 跨处理流审计 | 作为差异审计判定基线。 | 旧材料与当前 R1 冲突时,以当前 R1 为准。 |

#### R1.27.3 预计审计维度

| 审计维度 | 检查问题 | 下一批输出 |
|---|---|---|
| 旧处理流主线 | 旧 `Create/Update/Submit/Publish/Deprecate/Retire/Supersede MethodContent` 是否应废弃或映射到当前组成部分。 | 旧处理流替换 / 废弃表。 |
| 旧同步机制 | `DefinitionSnapshot`、snapshot export、object storage payload、fingerprint、outbox relay 是否进入当前 Step 8。 | 旧同步机制污染表。 |
| 旧 inbound / governance gate | `GovernanceGateApprovedConsumer` / rejected consumer 是否与当前唯一 Inbound owner 冲突。 | Inbound 污染表。 |
| 旧 operations job | seed、replay outbox、rebuild index、recalculate fingerprint 是否与当前 8 个 maintenance job 冲突。 | Operations job 替换表。 |
| 旧 DDD 下沉 | 历史 03 是否把 port、repository、HTTP、DTO、payload、topic、worker loop 反推到概要。 | 详细设计材料禁入表。 |
| 后续 Step 风险 | §9 / Step 9 是否仍会继承旧 lifecycle、outbox status、fingerprint drift。 | Step 9 承接风险提示。 |

#### R1.27.4 高风险污染族

| 污染族 | 风险 | 下一批审计处理 |
|---|---|---|
| `MethodContent` 总对象 | 会覆盖当前八个组成部分和 Step 6 对象 owner。 | 标记为废弃旧 truth 主语,不得作为当前 §8 来源。 |
| publish 链 | 会把正式化、版本、治理依据、消费材料和事件传播混成一个路径。 | 拆到 formalization / version / external summary / event candidate 等当前流。 |
| snapshot / object payload | 会把下游同步制品和正文包体带回当前概要。 | 标记为旧同步机制,当前只允许 `ArtifactArchiveRef` / body-free refs。 |
| fingerprint | 会把版本语义、drift、事件和下游校验绑定到旧 hash 主线。 | 标记为旧机制,当前版本语义以 formal version / reason / marker 表达。 |
| `OutboxEvent` / relay | 会把事件候选扩成可靠投递机制和状态机。 | 标记为后续 03/04 重新闭口对象,不得作为 Step 8 主线。 |
| old governance gate inbound | 会与当前外部摘要与引用唯一 Inbound owner 冲突。 | 只保留 body-free external summary / basis ref 的当前入口。 |
| old operations job | 会让 job 修 core truth、重放 outbox 或复算 fingerprint。 | 替换为 read material refresh、trace refresh、recovery、progress。 |
| P1 plugin / configuration | 会把外围配置、插件和 marketplace 组织语义反推成核心闭环。 | 仅作为旧污染提醒,当前由 method package / method set peripheral 边界承接。 |

#### R1.27.5 下一写入批次结构

下一批 `R1.28 旧材料差异审计:再写入` 只写:

1. 审计输入声明。
2. 旧正式 §8 主线污染表。
3. 旧处理流替换 / 废弃表。
4. 历史 DDD Step 8/9/10 污染表。
5. 当前 Step 8 文件污染检查表。
6. 后续 Step 9 / Step 10 / Step 11 / 03 承接提醒。
7. 本模块停审记录。

#### R1.27.6 下一写入批次边界

下一批不得修改正式 `02-概要设计.md`,不得写正式 §8 回填草稿,不得进入 Step 9,不得把旧材料中的 HTTP、DTO、repository、port、SQL、topic、payload、outbox relay、worker、scheduler、queue、retry、dead letter、object storage、snapshot schema、fingerprint algorithm 或 P1 plugin / configuration 作为当前概要结论。

#### R1.27.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只定义旧材料差异审计范围、维度、风险和下一写入结构。 |
| 是否以当前 R1 为判定基线 | pass | 差异审计基线为 `R1.8`~`R1.26`,不继承旧 completed 结论。 |
| 是否识别旧材料输入 | pass | 已限定旧正式 §8 / §9、historical `5.22` 和历史 DDD 相关文件。 |
| 是否直接写差异审计正文 | no | 替换表和污染结论留给下一批。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `旧材料差异审计:再写入`;只写旧正式 §8、historical Step 8 和历史 DDD 处理流污染审计表,不得写正式 §8 回填草稿,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.28 旧材料差异审计:再写入

#### R1.28.1 审计输入声明

本模块只做旧材料污染审计,不修改正式 `02-概要设计.md`,不写正式 §8 回填草稿,不进入 Step 9。审计判定基线是当前 R1 Step 8:通用骨架、八个组成部分处理流、`R1.26` 跨处理流一致性审计和 Step 7 当前接口总表。

| 旧材料 | 审计重点 | 本轮判定规则 |
|---|---|---|
| 旧正式 §8 | `MethodContent` publish / snapshot / outbox / fingerprint / operations job 主线。 | 与当前八个组成部分处理流冲突时,旧材料废弃。 |
| 旧正式 §9 | `MethodContentLifecycle`、`OutboxEventStatus` 和 snapshot / fingerprint 状态线索。 | 只记录 Step 9 风险,不提前写状态机。 |
| historical `5.22` | 旧差异审计表格形状和污染关键词。 | 只作样式参考,不继承完成结论。 |
| 历史 DDD Step 8 / Step 9 / Step 10 | 旧 API、DTO、port、HTTP、topic、payload、outbox relay、函数流和状态矩阵下沉。 | 不能作为当前概要或后续 03 的直接来源。 |

#### R1.28.2 旧正式 §8 主线污染表

| 旧正式 §8 内容 | 污染点 | 当前处理口径 | 结论 |
|---|---|---|---|
| `8.1 通用写路径` | 写入 `MethodContent / AuditRecord / OutboxEvent`,把所有 Command 收束到旧总对象和 outbox。 | 当前 Command 按八个组成部分写各自 truth / summary / boundary / history hint;event 只保留 candidate。 | 废弃旧骨架。 |
| `8.2 通用读路径` | 以 `MethodContent` 和 projection/cache 为中心,缺少 body-free、typed ref、material family 和 boundary diagnostic 边界。 | 当前 Query 只读 Step 6 summary / view / material / diagnostic / progress,且不刷新、不修复、不拉正文。 | 重写为当前只读骨架。 |
| `8.3 处理流覆盖清单` | 旧接口集合为 draft / review / publish / snapshot / fingerprint / outbox replay。 | 当前覆盖 58 Command、57 Query、4 Inbound、34 Outbound、8 Job。 | 不继承旧清单。 |
| `PublishMethodContent` | 将治理 gate、publish、version、fingerprint、audit、outbox 放入同一主链。 | 拆为 formalization eligibility、formal version lifecycle、external basis summary、event candidate 和 maintenance refresh。 | 废弃旧 publish 主链。 |
| `Create/Update MethodContentDraft` | 以 draft 聚合和正文变更作为定义主线。 | 由 `MethodAssetDefinitionWriteFlow` / catalog flow 承接 definition / catalog truth;不恢复 draft lifecycle。 | 替换。 |
| `SubmitMethodContentForReview` | 以 review -> publish gate 作为正式化前置。 | 由 formalization initiation / eligibility 和 body-free basis summary 承接;不写治理审批执行。 | 替换。 |
| `Deprecate/Retire/Supersede MethodContent` | 以旧生命周期和 outbox event 传播状态表达版本变化。 | 由 formal version semantic change / supersede / retire、definition retire 和 relation / consumption / trace hints 分别承接。 | 替换并拆分。 |
| `GovernanceGateApproved/RejectedConsumer` | governance gate inbound 写本地 gate projection,与当前唯一 inbound owner 冲突。 | 外部事实只能进入 `ExternalInboundIntakeFlow`,形成 body-free summary / ref / marker / safe reason。 | 废弃旧 inbound。 |
| `ExportDefinitionSnapshot` | snapshot 绑定 version / fingerprint / lifecycle,并可能牵引 object storage payload。 | 当前不恢复 snapshot export;外部 artifact / archive 只用 `ArtifactArchiveRef`、digest hint 和 body-free lineage。 | 废弃旧同步制品。 |
| `ResolveViewProfile` | 以旧 ViewProfile published / fingerprint 为读取主线。 | 当前此类能力应落入 formal version / consumption / peripheral read 或后续独立对象,不得恢复旧 MethodContent read。 | 需按当前对象重议。 |
| `Operations 关键处理流` | seed、replay events、rebuild index、recalculate fingerprint 均围绕 MethodContent / OutboxEvent / Fingerprint。 | 当前 maintenance job 只刷新 read material、trace/audit/impact material、recovery progress 和 peripheral material。 | 废弃旧 job 主线。 |

#### R1.28.3 旧处理流替换 / 废弃表

| 旧处理流 / 旧主语 | 当前替代或处理 | 结果 |
|---|---|---|
| `CreateMethodContentDraft` | `EstablishMethodAssetDefinition`;必要 catalog 语义由 `RegisterMethodAssetCatalogEntry` 承接。 | replace |
| `UpdateMethodContentDraft` | `AdjustMethodAssetDefinition`;不保留 draft body edit 主线。 | replace |
| `SubmitMethodContentForReview` | `InitiateMethodAssetFormalization`;eligibility 和 basis summary 分离。 | replace |
| `PublishMethodContent` | `EvaluateMethodAssetFormalizationEligibility` + `EstablishFormalMethodAssetVersion` + event candidate。 | split_replace |
| `DeprecateMethodContent` | formal version retire / availability / consumption impact 由当前对象分担。 | split_replace |
| `RetireMethodContent` | `RetireFormalMethodAssetVersion`、definition retire、catalog retire 或 package retire 需按目标对象区分。 | split_replace |
| `SupersedeMethodContent` | `SupersedeFormalMethodAssetVersion` 或 relation / package / method set lifecycle 的显式 supersede。 | split_replace |
| `GovernanceGateApprovedConsumer` | `ConsumeBodyFreeExternalSummaryAccepted` 或 external basis accepted summary。 | replace |
| `GovernanceGateRejectedConsumer` | external summary disposition / body boundary rejection safe marker。 | replace |
| `ExportDefinitionSnapshot` | 不恢复;只允许 `ArtifactArchiveRef` / evidence lineage hint。 | deprecated |
| `CompareFingerprint` / `RecalculateFingerprint` | 不恢复 fingerprint 作为当前版本 / drift 主线。 | deprecated |
| `ReplayDefinitionEvents` / outbox relay | 不属于概要 Step 8;后续若需要可靠投递,按当前 event candidate 重新闭口。 | deferred_rewrite |
| `RebuildDefinitionIndex` | `RefreshCatalogAndDefinitionReadMaterials` 等 read material refresh job。 | replace |
| `SeedInitialMethodAssets` | 不作为当前 Step 8 主线;初始化如有需要,后续实施计划单独讨论,不得绕过当前 Command。 | deferred |
| `MethodPlugin` / `MethodConfiguration` / `EffectiveContentSet` | 当前由 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule` 的 peripheral boundary 承接。 | replace_as_peripheral |

#### R1.28.4 历史 DDD Step 8/9/10 污染表

| 历史 DDD 位置 | 污染类型 | 当前处理 |
|---|---|---|
| Step 8 protocol 总表 | 旧 HTTP / RPC / DTO / event topic / payload 字段以 `MethodContent` 为中心。 | 不作为当前接口 contract 来源;当前接口以 Step 7 `R1.24`~`R1.34` 为准。 |
| Step 8 command cards | `PublishMethodContentResponse` 包含 `fingerprint`、`snapshot_ref`、`outbox_event_id` 等旧字段。 | 不进入当前 Step 8;后续 03 必须从当前对象重新定义 DTO。 |
| Step 8 outbound event cards | `method_library.content.published`、kind-specific published、`fingerprint_changed` 与 outbox + L0-bus 绑定。 | 当前只保留 34 个 event candidate;topic / payload / outbox / relay 后续重议。 |
| Step 8 inbound / external cards | governance publish gate、object storage snapshot payload、bus publish result、downstream replay request 进入主协议。 | 当前 inbound 只有外部摘要与引用的 4 个 body-free consumer。 |
| Step 9 function flows | `PublishMethodContentFlow` 写 snapshot / outbox,`OutboxRelayService` 发布 topic,pseudocode 下沉。 | 不作为概要处理流;当前 Step 8 不写 repository / port / worker loop / pseudo Rust。 |
| Step 9 operations flows | `ReplayDefinitionEventsFlow`、`RecalculateFingerprintFlow`、`RebuildReadModelsFlow` 围绕 outbox / fingerprint / MethodContent。 | 替换为 current maintenance refresh / recovery / progress job family。 |
| Step 10 state matrix | `MethodContentLifecycle`、`OutboxEventStatus`、fingerprint drift 或 replay checkpoint 状态可能成为状态 owner。 | Step 9 重写时必须从当前 Step 6 对象和 R1.26 状态来源重新推导。 |

#### R1.28.5 当前 Step 8 文件污染检查表

| 检查项 | 结果 | 说明 |
|---|---|---|
| 当前 R1 有效处理流是否恢复旧 `MethodContent` truth | no | `MethodContent` 只作为禁止项、旧材料输入或差异审计关键词出现。 |
| 当前 R1 是否恢复 publish 主链 | no | 正式化与版本由 formalization / formal version lifecycle 承接。 |
| 当前 R1 是否恢复 `DefinitionSnapshot` / snapshot export | no | 外部 archive 只用 typed ref、digest hint、lineage marker。 |
| 当前 R1 是否恢复 fingerprint 版本机制 | no | 版本语义由 formal version、reason ref、marker 和 history 表达。 |
| 当前 R1 是否恢复 `OutboxEvent` / relay | no | Outbound 仅为 event candidate,可靠投递机制后置。 |
| 当前 R1 是否恢复 old governance gate consumer | no | Inbound 仅归外部摘要与引用。 |
| 当前 R1 是否恢复 old operations job | no | Operations Job 仅归后台维护与收敛,且不修 core truth。 |
| historical `5.x` 是否仍可作为当前完成态 | no | historical 内容只保留为旧材料;当前有效结论以 `R1.8`~`R1.28` 为准。 |

#### R1.28.6 后续承接提醒

| 后续位置 | 必须避免的旧污染 | 当前承接口径 |
|---|---|---|
| Step 9 状态机 | 不恢复 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot export state、fingerprint drift state。 | 从 `R1.26.7` 的状态来源表重写状态 owner 和流转。 |
| Step 10 异常边界 | 不恢复 publish error、outbox relay failure、snapshot export failure、fingerprint mismatch 为主线。 | 按 formalization、consumption、external body boundary、maintenance unavailable、peripheral unavailable 等当前边界展开。 |
| Step 11 配置影响 | 不恢复 outbox batch size、fingerprint algorithm、snapshot schema、P1 plugin flag 作为当前概要主线。 | 只识别当前 event delivery later、maintenance scope、external boundary、peripheral discovery 等配置影响轮廓。 |
| 正式 §8 回填草稿 | 不从旧正式 §8 复制标题或图。 | 必须从 R1 通用骨架、八个组成部分处理流、R1.26 审计和本差异审计生成摘要化草稿。 |
| 03 详细设计 | 不直接复用历史 DDD 的 HTTP、DTO、port、repository、topic、payload、outbox relay、pseudo Rust。 | 03 必须以本轮 Step 5~11 新结论重新推导。 |
| 04 配置设计 | 不用配置开关恢复 publish / outbox / snapshot / fingerprint 主链。 | 配置不得改变当前 truth owner、body-free、job 不修 truth 和 peripheral 非前置边界。 |

#### R1.28.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入旧材料差异审计正文 | pass | 已写旧正式 §8 污染表、旧处理流替换 / 废弃表、历史 DDD 污染表和后续承接提醒。 |
| 是否让旧材料反推当前结论 | no | 当前判定基线仍是 `R1.8`~`R1.26` 和 Step 7 当前接口。 |
| 是否确认旧 `MethodContent` / publish 主线废弃 | pass | 已明确旧主线不作为当前 §8 来源。 |
| 是否确认 snapshot / fingerprint / outbox 禁入当前 Step 8 | pass | 仅作为旧污染关键词或后续重新闭口提醒。 |
| 是否写正式 §8 回填草稿 | no | 回填草稿后置到下一模块。 |
| 是否修改正式 §8 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `正式 §8 回填草稿:先思考`;只思考正式 §8 回填草稿的章节结构、摘要化策略和来源映射,不得直接写回填草稿正文,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.29 正式 §8 回填草稿:先思考

#### R1.29.1 问题回答

- 本模块只思考正式 §8 回填草稿的结构和来源映射,不写可直接回填正文,也不修改正式 `02-概要设计.md`。
- 正式 §8 必须整体替换旧 `MethodContent` / publish / snapshot / outbox / fingerprint 主线,不能局部修补旧段落。
- 正式 §8 应摘要化。中间产物已经包含大量 ASCII 图和完整审计表,正式文档不应复制所有 R1.10~R1.24 的长图和每个 Query / Event 明细。
- 正式 §8 的读者目标是理解关键处理流主链、八个组成部分如何协作、哪些机制明确不在概要层展开,而不是获得详细设计函数签名、DTO、repository、topic 或 worker loop。

#### R1.29.2 回填草稿结构裁决

| 正式 §8 小节 | 是否采用 | 内容口径 | 来源 |
|---|---|---|---|
| `8.1 处理流输入与边界` | yes | 声明 Step 8 承接 Step 5/6/7 和正式 §7,旧 §8 只作差异审计。 | `R1.2`;`R1.4`;`R1.28` |
| `8.2 通用处理流骨架` | yes | 摘要写 Command / Query / Inbound / Operations Job / Outbound Event candidate 五类通用边界。 | `R1.8` |
| `8.3 八个组成部分关键处理流` | yes | 按八个组成部分列处理流族和边界摘要,不复制所有长图。 | `R1.10`~`R1.24` |
| `8.4 跨组成部分接缝与副作用边界` | yes | 摘要写 definition -> formalization -> consumption -> trace -> relation -> external -> maintenance -> peripheral 接缝。 | `R1.26` |
| `8.5 未展开处理流与后续承接` | yes | 说明 Query 重复图、outbound delivery、worker、schema、marketplace 履约等后置。 | `R1.25`;`R1.26`;`R1.28` |
| `8.6 Step 9 状态来源提示` | yes | 只列状态来源,不写状态机。 | `R1.26.7`;`R1.28.6` |
| 旧 `8.4 PublishMethodContent` 等小节 | no | 整体删除 / 替换为当前主线。 | `R1.28` |
| 旧 `8.7 Operations` outbox / fingerprint job | no | 不保留旧 job 结构。 | `R1.22`;`R1.28` |

#### R1.29.3 摘要化策略

| 内容类型 | 正式 §8 写法 | 留在中间产物 |
|---|---|---|
| ASCII 图 | 只保留五类通用骨架和少量代表性流向摘要;八个组成部分用表格列处理流族。 | 完整 R1.10~R1.24 长图。 |
| Command / Query / Inbound / Outbound / Job 数量 | 写总数和组成部分分布。 | 完整接口覆盖和每个组成部分停审表。 |
| Query 读取边界 | 按只读原则和复杂边界读取族说明。 | 每个组成部分 Query 表。 |
| Event candidate | 写事件候选不是 outbox / delivery。 | 每个组成部分 event candidate 表。 |
| Operations Job | 写 8 个 job family 和不修 core truth。 | R1.22 job 明细。 |
| 旧材料差异 | 写一句旧主线已废弃及引用差异审计。 | R1.28 详细污染表。 |
| Step 9 承接 | 写状态来源提示,不写状态定义。 | R1.26.7 详细来源表。 |

#### R1.29.4 来源映射

| 草稿部分 | 必须引用的中间产物 |
|---|---|
| 处理流输入与边界 | `R1.2`;`R1.4`;`R1.5`;`R1.6`;`R1.28` |
| 通用处理流骨架 | `R1.7`;`R1.8` |
| 方法资产定义与目录 | `R1.9`;`R1.10` |
| 正式化与版本 | `R1.11`;`R1.12` |
| 受控消费 | `R1.13`;`R1.14` |
| 追溯与一致性保护 | `R1.15`;`R1.16` |
| 关系与分发语义 | `R1.17`;`R1.18` |
| 外部摘要与引用 | `R1.19`;`R1.20` |
| 后台维护与收敛 | `R1.21`;`R1.22` |
| 外围包与方法集组织 | `R1.23`;`R1.24` |
| 跨组成部分接缝 / 未展开理由 / Step 9 承接 | `R1.25`;`R1.26`;`R1.28` |

#### R1.29.5 下一写入批次结构

下一批 `R1.30 正式 §8 回填草稿:再写入` 只写可回填草稿,建议结构:

1. `§8.1 处理流输入与边界草稿`。
2. `§8.2 通用处理流骨架草稿`。
3. `§8.3 八个组成部分关键处理流草稿`。
4. `§8.4 跨组成部分接缝与副作用边界草稿`。
5. `§8.5 未展开处理流与后续承接草稿`。
6. `§8.6 Step 9 状态来源提示草稿`。
7. `本模块停审记录`。

#### R1.29.6 下一写入批次边界

下一批不得修改正式 `02-概要设计.md`,不得进入 Step 9,不得复制旧正式 §8,不得写完整函数签名、HTTP、DTO、repository、port、SQL、topic、payload schema、outbox relay、worker、scheduler、queue、retry、dead letter、object storage、snapshot schema、fingerprint algorithm、marketplace listing / order / install / fulfillment 或 P1 plugin / configuration 细节。

#### R1.29.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只裁决正式 §8 草稿结构、摘要化策略和来源映射。 |
| 是否写正式 §8 回填草稿正文 | no | 草稿正文留给下一批。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否以当前 R1 为来源 | pass | 来源限定为 `R1.2`~`R1.28`,不复制旧正式 §8。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `正式 §8 回填草稿:再写入`;只写正式 §8 可回填草稿和本模块停审记录,不得修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.30 正式 §8 回填草稿:再写入

#### R1.30.1 回填说明

本草稿用于后续整体替换正式 `02-概要设计.md` 的 §8。它只依据当前 Step 8 R1 中间产物生成,不继承旧正式 §8 的 `MethodContent`、publish、snapshot、fingerprint、outbox、governance gate consumer 或旧 operations job 主线。

本草稿采用摘要化写法:正式正文只保留通用骨架、八个组成部分处理流族、关键接缝、副作用边界、未展开理由和 Step 9 状态来源提示。完整 ASCII 图、接口覆盖表、对象引用审计和旧材料差异审计继续保留在本中间产物。

#### R1.30.2 §8.1 处理流输入与边界草稿

本章处理流以本轮 Step 5 主要组成部分、Step 6 关键对象轮廓、Step 7 API / 接口骨架和正式 §7 为输入。旧 §8 中围绕 `MethodContent` draft / review / publish、`DefinitionSnapshot`、fingerprint、`OutboxEvent` 和 replay / rebuild / recalculation job 的处理流不作为当前来源。

当前处理流按八个主要组成部分组织:

| 组成部分 | 处理流职责 |
|---|---|
| 方法资产定义与目录 | 建立 / 调整 definition truth,登记 / 重分类 catalog entry,提供 definition / catalog 只读入口。 |
| 正式化与版本 | 评估正式化资格,建立正式版本,记录语义变化、替代和退役。 |
| 受控消费 | 登记消费边界,准备消费材料,记录 Definition vs Use 越界线索。 |
| 追溯与一致性保护 | 组织 trace material、impact summary、protection decision、audit trail 和 evidence lineage。 |
| 关系与分发语义 | 维护方法资产关系、关系完整性、分发语义引用和分发可用性。 |
| 外部摘要与引用 | 承接 body-free external summary / ref / artifact / boundary violation,是本仓唯一 Inbound owner。 |
| 后台维护与收敛 | 登记维护请求,刷新派生材料,推进恢复收敛和维护进度。 |
| 外围包与方法集组织 | 组织 method package、method set assembly、composition evaluation 和 peripheral read material。 |

处理流边界:

- Command 只改写本仓拥有的 truth、summary、boundary、history hint、maintenance request 或 peripheral organization。
- Query 只读取 summary、view、material、diagnostic、history、lineage、progress 或 safe absence,不得创建、刷新或修复。
- Inbound Consumer 只由外部摘要与引用承担,输入必须是 body-free summary/ref/marker/digest/safe reason。
- Outbound Event 在概要层仅表达 event candidate 的产生来源,不定义 topic、payload schema、outbox、relay、retry 或 subscriber。
- Operations Job 只属于后台维护与收敛,只刷新派生材料或推进恢复进度,不得修 core truth。

#### R1.30.3 §8.2 通用处理流骨架草稿

##### 8.2.1 Command 写路径骨架

```text
Command API
  |
  v
Application Service
  - validate ActorContext / CommandMetadata / IdempotencyKey
  - validate typed refs, summary refs and safe reason refs
  - reject raw external body, downstream runtime truth and implementation payload
  |
  v
Domain Object / Policy
  - apply component-owned decision
  - produce accepted / rejected summary
  - produce history / lineage / refresh hint when applicable
  |
  v
Write Boundary
  - persist component-owned truth or summary
  - do not write another component's truth
  - produce event candidate or maintenance hint only when needed
  |
  v
Command Result
```

Command 写路径不得通过 API handler 直接写 repository,不得把 Query、event delivery、worker 调度或外部正文处理混入同一事务。

##### 8.2.2 Query 只读路径骨架

```text
Query API
  |
  v
Query Service
  - validate typed selector
  - check overview-level visibility / boundary when applicable
  - reject raw body or implementation-detail request
  |
  v
Read Source
  - load truth summary, view, material, diagnostic, history or progress
  |
  +--> found
  |     |
  |     v
  |   return body-free safe summary
  |
  +--> not found / stale / unavailable / unknown
        |
        v
      return safe absence, freshness marker or diagnostic hint
```

Query 不创建对象、不刷新 view、不启动 maintenance job、不修复关系、不摘要化外部正文。

##### 8.2.3 Inbound / Event / Job 概要边界

| 类型 | 概要骨架 | 禁止事项 |
|---|---|---|
| Inbound Consumer | 校验 envelope、schema/version、source event id、dedup key 和 body-free marker,形成 intake summary 或 handoff hint。 | 不接收 raw payload,不直接创建 formal version、relation、package 或 job run。 |
| Outbound Event Candidate | 由 accepted command、材料状态变化、维护进度或外围组织变化产生 fact/ref/summary 级候选。 | 不定义 topic、payload schema、outbox、relay、retry、dead letter。 |
| Operations Job | 基于 task/run/scope refs 刷新派生材料或记录恢复收敛进度。 | 不修 core truth,不重做正式化,不扩大消费边界,不复制外部正文。 |

#### R1.30.4 §8.3 八个组成部分关键处理流草稿

| 组成部分 | 关键处理流族 | 覆盖接口 | 核心边界 |
|---|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinitionWriteFlow`;`MethodAssetCatalogEntryWriteFlow`;definition/catalog read;definition/catalog event candidate。 | 6 Command;4 Query;2 Outbound。 | definition truth 与 catalog truth 分开;catalog view 只是派生读取材料。 |
| 正式化与版本 | `FormalizationEligibilityFlow`;`FormalMethodAssetVersionLifecycleFlow`;formalization/version read;formalization/version event candidate。 | 6 Command;6 Query;4 Outbound。 | formalization state、formal version truth 和 history 分离;不以 publish / fingerprint / snapshot 建立版本。 |
| 受控消费 | `DownstreamConsumptionBoundaryFlow`;`ConsumptionMaterialPreparationFlow`;`DefinitionUseBoundaryViolationFlow`;consumption read;consumption event candidate。 | 5 Command;6 Query;4 Outbound。 | 正式版本存在不等于自动可消费;消费材料不复制定义正文或下游运行状态。 |
| 追溯与一致性保护 | `TraceMaterialOrganizationFlow`;`ConsumptionImpactSummaryFlow`;`ConsistencyProtectionDecisionFlow`;`AuditEvidenceLineageFlow`;trace/audit read;event candidate。 | 7 Command;7 Query;5 Outbound。 | trace、impact、audit 和 evidence lineage 全部 body-free;protection decision 不执行 recovery。 |
| 关系与分发语义 | `MethodAssetRelationLifecycleFlow`;`RelationIntegrityFlow`;`DistributionReferenceFlow`;relation/distribution read;event candidate。 | 10 Command;9 Query;5 Outbound。 | relation 不是 runtime dependency、call graph 或 recommendation;distribution ref 不是 marketplace listing 或 install record。 |
| 外部摘要与引用 | `ExternalSourceSummaryLifecycleFlow`;`ExternalSourceArtifactRefFlow`;`ExternalBodyBoundaryFlow`;`ExternalEvidenceLineageFlow`;`ExternalInboundIntakeFlow`;external read;event candidate。 | 9 Command;8 Query;4 Inbound;5 Outbound。 | 唯一 Inbound owner;只允许 summary/ref/digest/marker/safe reason 入仓。 |
| 后台维护与收敛 | `MaintenanceRequestControlFlow`;`ReadMaterialRefreshJobFlow`;`TraceAuditImpactRefreshJobFlow`;`ConsistencyRecoveryConvergenceFlow`;maintenance progress read;event candidate。 | 6 Command;8 Query;8 Job;5 Outbound。 | Job 只刷新派生材料和 progress,不修 definition、formal version、relation、external summary 或 package truth。 |
| 外围包与方法集组织 | `MethodPackageLifecycleFlow`;`MethodSetAssemblyLifecycleFlow`;`PackageCompositionEvaluationFlow`;peripheral read;event candidate。 | 9 Command;9 Query;4 Outbound。 | package / method set 是 peripheral enhancement,不成为核心闭环前置。 |

上述处理流合计覆盖 Step 7 当前接口:58 个 Command、57 个 Query、4 个 Inbound Consumer、34 个 Outbound Event 和 8 个 Operations Job。

#### R1.30.5 §8.4 跨组成部分接缝与副作用边界草稿

| 接缝 | 连接方式 | 禁止事项 |
|---|---|---|
| 定义 / 目录 -> 正式化 | definition ref、catalog context、safe basis summary refs。 | definition adjustment 直接建立 formal version。 |
| 正式化 -> 受控消费 | formal version ref、boundary requirement、availability hint。 | formal version 一成立就自动可消费。 |
| 受控消费 -> 追溯 / 保护 | consumption material refs、boundary violation summary、trace subject hint。 | 下游 runtime truth 回写本仓。 |
| 追溯 / 保护 -> 关系 / 分发 | trace / impact / protection diagnostic 作为安全线索。 | integrity flow 绕过正式化或消费边界改 truth。 |
| 关系 / 分发 -> 外部摘要 | distribution / relation 只引用 body-free external source summary 或 artifact ref。 | provider payload、archive body 或 listing body 入仓。 |
| 外部摘要 -> 维护 | stale / unavailable / invalidation / diagnostic hint 触发正式维护请求。 | inbound 直接启动 worker 或修改 core truth。 |
| 维护 -> 读取材料族 | job 刷新 read material、trace material、progress 和 recovery summary。 | job 修 definition、formal version、relation、external summary 或 package truth。 |
| 核心闭环 -> 外围组织 | package / set 引用已成立或允许引用的 core refs。 | peripheral unavailable 反向阻断 definition / formalization / consumption。 |

事务和副作用边界按类型划分:Command 写本组件事实,Query 只读,Inbound intake 只做 body-free 承接,Event 仅为候选,Job 只维护派生材料。任何需要可靠投递、worker 调度、retry、dead letter、adapter 或存储 schema 的内容都后置到详细设计、配置设计或实施计划。

#### R1.30.6 §8.5 未展开处理流与后续承接草稿

以下内容不在概要 Step 8 展开:

| 未展开项 | 原因 | 后续承接 |
|---|---|---|
| 每个 Query 的独立流程图 | 57 个 Query 大多共享只读骨架,逐个画图会重复并诱导副作用。 | 详细设计和测试方案按读取族展开。 |
| Outbound delivery / outbox / topic / relay | 当前只定义 event candidate 的业务来源。 | 若需要可靠投递,在 03 / 04 重新闭口。 |
| Worker / scheduler / queue / retry / lock | 属于运行机制或实施细节。 | 实施计划、运维设计或配置设计。 |
| HTTP / DTO / repository / port / SQL / protocol schema | 超出概要 Step 8 深度。 | 03 详细设计重新推导。 |
| Raw external body / artifact body / archive body / evidence body | 与 body-free 边界冲突。 | 只保留 typed ref、digest hint、marker、safe summary。 |
| Marketplace listing / order / install / fulfillment | 不属于本仓核心方法库 truth。 | 外围项目或后续专门设计。 |
| 旧 `MethodContent` / snapshot / fingerprint / `OutboxEvent` | 与当前 Step 5~7 主线冲突。 | 不作为当前 §8 来源。 |

#### R1.30.7 §8.6 Step 9 状态来源提示草稿

Step 9 状态机必须从当前对象和处理流触发来源重新推导,不得继承旧 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot export state、fingerprint drift state 或 worker queue state。

| 状态来源 | 来源处理流 |
|---|---|
| definition / catalog lifecycle and stale view | definition write、catalog entry write、read material refresh。 |
| formalization and formal version lifecycle | formalization eligibility、formal version lifecycle。 |
| consumption material and availability | consumption material preparation、downstream boundary。 |
| trace / impact / protection / audit / lineage material | trace material、impact summary、protection decision、audit / evidence lineage。 |
| relation / integrity / distribution availability | relation lifecycle、relation integrity、distribution reference。 |
| external summary / ref / body boundary / lineage disposition | external summary lifecycle、body boundary、external inbound intake。 |
| maintenance task / run / progress / recovery disposition | maintenance request/control、read material refresh job、recovery convergence、progress read。 |
| package / method set / composition / peripheral view | package lifecycle、method set assembly、composition evaluation、peripheral read。 |

#### R1.30.8 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否写入正式 §8 可回填草稿 | pass | 已形成 §8.1~§8.6 摘要化草稿。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否复制旧正式 §8 | no | 旧 `MethodContent` / publish / snapshot / outbox / fingerprint 主线未作为草稿来源。 |
| 是否避免过度明细 | pass | 未写 HTTP、DTO、repository、port、SQL、topic、payload、worker 或配置细节。 |
| 是否进入 Step 9 | no | 当前仍在 Step 8。 |

next_allowed_action: 等待用户确认后进入 Step 8 `自检与停审:先思考`;只思考 Step 8 完成门禁、正式 §8 是否可回填、Step 9 承接输入和 flow / 台账推进策略,不得直接修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.31 自检与停审:先思考

#### R1.31.1 本模块边界

本模块只思考 Step 8 自检与停审口径,不写最终停审结论,不修改正式 `02-概要设计.md`,不进入 Step 9。

本模块目标是判断下一批 `R1.32 自检与停审:再写入` 应如何检查:

1. Step 8 中间产物是否已经完成到可停审状态。
2. `R1.30` 的正式 §8 草稿是否具备回填条件。
3. Step 9 状态机重写 / 深度反查需要承接哪些输入。
4. flow / 项目台账应推进到“等待用户决定正式 §8 回填或进入 Step 9 开工”的哪种状态。

#### R1.31.2 自检输入盘点

| 输入 | 用途 | 当前判断 |
|---|---|---|
| `R1.1`~`R1.2` 开工与必读文档 | 检查 Step 8 启动基线和旧材料边界。 | 已完成,可作为门禁依据。 |
| `R1.3`~`R1.4` L1-governance 框架对齐 | 检查是否参考框架深度而未复制治理语义。 | 已完成,需在自检中确认未引入 governance 专属语义。 |
| `R1.5`~`R1.6` 接口到处理流候选池 | 检查 Step 7 的 58 Command、57 Query、4 Inbound、34 Outbound、8 Job 是否进入处理流候选。 | 已完成,需在最终自检中核对覆盖声明。 |
| `R1.7`~`R1.8` 通用处理流骨架 | 检查 Command / Query / Inbound / Outbound / Job 概要边界。 | 已完成,是正式 §8 草稿的骨架来源。 |
| `R1.9`~`R1.24` 八个组成部分处理流 | 检查每个组成部分是否先思考、再写入,且覆盖其接口族和对象承接。 | 已完成,应作为 Step 8 完成门禁主依据。 |
| `R1.25`~`R1.26` 跨处理流一致性审计 | 检查读写边界、对象承接、副作用边界和 Step 9 状态来源提示。 | 已完成,需转入停审表。 |
| `R1.27`~`R1.28` 旧材料差异审计 | 检查旧 `MethodContent`、publish、snapshot、fingerprint、outbox、旧 job 主线是否被排除。 | 已完成,正式 §8 回填前必须保留该红线。 |
| `R1.29`~`R1.30` 正式 §8 回填草稿 | 检查正式 §8 草稿是否覆盖 §8.1~§8.6 且没有下沉详细设计。 | 已完成草稿,但尚未修改正式文档。 |
| Step 7 `R1.45` 与正式 §7 | 检查接口基线是否已正式回填,Step 8 是否以新 §7 为输入。 | 已完成,Step 8 可引用正式 §7。 |
| Step 5 / Step 6 当前结论 | 检查八个组成部分和关键对象是否作为处理流第一来源。 | 已完成,应在自检中确认未回到旧对象主线。 |

#### R1.31.3 Step 8 完成门禁候选

下一批应写入以下完成门禁表:

| 门禁 | 应检查内容 | 预期结论 |
|---|---|---|
| 必读与开工基线完成 | 是否列明 Step 8 必读文档、输入基线、旧材料只作后置审计。 | 预计 pass。 |
| L1-governance 框架参考正确 | 是否只参考章节粒度、图表密度和收尾方式,未复制治理领域语义。 | 预计 pass。 |
| 接口候选池覆盖 | 是否承接 Step 7 当前 58 / 57 / 4 / 34 / 8 接口分类。 | 预计 pass。 |
| 通用骨架完整 | 是否覆盖 Command 写路径、Query 只读路径、Inbound / Event / Job 概要边界。 | 预计 pass。 |
| 八个组成部分逐个完成 | 是否每个组成部分均完成先思考、再写入和停审。 | 预计 pass。 |
| 跨处理流一致性完成 | 是否审计 owner、读写、副作用、事件候选、operations job 和 Step 9 状态来源。 | 预计 pass。 |
| 旧材料差异审计完成 | 是否排除旧 `MethodContent` / publish / snapshot / fingerprint / outbox / governance gate / 旧 job。 | 预计 pass。 |
| 正式 §8 草稿完成 | 是否形成可回填草稿,且来源只来自当前 R1 中间产物。 | 预计 pass。 |
| 未下沉详细设计 / 实现 | 是否未写完整 DTO、repository / port、SQL、topic、payload、worker、配置、测试。 | 预计 pass。 |
| 未进入 Step 9 | 是否只给状态来源提示,未写状态机、状态枚举或迁移表。 | 预计 pass。 |

#### R1.31.4 正式 §8 可回填性判断口径

正式 §8 回填应采用与 Step 7 类似的两段式裁决:

1. `R1.32` 只判断 `R1.30` 草稿是否可回填,并提出 flow / 台账推进建议。
2. 只有在用户明确确认后,才允许实际替换正式 `02-概要设计.md` 的 `## 8` 到 `## 9` 之间内容。

可回填性检查应覆盖:

| 检查项 | 判断标准 |
|---|---|
| 章节覆盖 | `R1.30` 已覆盖 §8.1~§8.6,能替换正式 §8 主体。 |
| 来源可追溯 | 每个草稿段落能回指 `R1.2`~`R1.28` 和 Step 7 / Step 5 / Step 6 当前结论。 |
| 摘要化适度 | 正式文档只保留处理流族、骨架、接缝和边界;完整审计留在中间产物。 |
| 旧主线禁入 | 不恢复旧正式 §8 的 publish、snapshot、fingerprint、outbox 或旧 operations job 主线。 |
| 详细设计隔离 | 不写协议 schema、port、repository、topic、payload、worker、scheduler、retry、storage 或配置。 |
| 正式文档状态 | 当前仍为 not_written;实际回填必须等用户确认。 |

#### R1.31.5 Step 9 承接判断口径

Step 9 不应直接继承旧状态机。下一批自检若通过,只应把 Step 9 推进到“可开工 / 待用户确认”,并要求 Step 9 重新讨论或深度反查。

Step 9 启动前应承接:

| 承接输入 | 来源 | Step 9 使用方式 |
|---|---|---|
| 八个主要组成部分 | Step 5 / Step 8 `R1.30.4` | 作为状态 owner 分组候选,不得新增旧 owner。 |
| 关键对象与对象能力 | Step 6 当前文件 | 推导状态所属对象、material / view / task / history 状态。 |
| 接口触发来源 | Step 7 `R1.45`;Step 8 `R1.5`~`R1.24` | 判断哪些 Command / Job / Inbound 会触发状态变化。 |
| 处理流状态来源提示 | Step 8 `R1.30.7` | 作为 Step 9 状态来源清单的起点。 |
| 旧材料差异审计 | Step 8 `R1.28` | 阻断旧 `MethodContentLifecycle`、`OutboxEventStatus` 等回流。 |

Step 9 下一步必须先执行 `开工与必读文档:先思考`,不得直接写状态表;如果发现 Step 8 草稿不足以支撑状态来源,应回到 Step 8 修补,不得在 Step 9 私补处理流。

#### R1.31.6 flow / 台账推进策略候选

若 `R1.32` 自检通过,建议状态如下:

| 文件 | 建议状态 | 建议 next_allowed_action |
|---|---|---|
| `02_hld_step_08_processing_flows.md` | Step 8 intermediate_completed | 等待用户决定:正式回填 §8,或进入 Step 9 开工。 |
| `02_hld_calibration_flow.md` | Step 8 intermediate_completed / wait_user_decision | 不自动进入 Step 9;等待用户确认正式 §8 回填或继续。 |
| `project_execution_ledger.md` | Step 8 intermediate_completed / wait_user_decision | 恢复点指向“等待用户决定正式 §8 回填或 Step 9 开工”。 |
| `02-概要设计.md` | formal §8 pending_rewrite | 不在 `R1.32` 自动修改;后续若确认,按 `R1.30` 草稿整体替换 §8。 |

#### R1.31.7 下一写入批次结构

下一批 `R1.32 自检与停审:再写入` 只写:

1. `Step 8 完成门禁自检表`。
2. `正式 §8 草稿可回填性检查`。
3. `Step 9 承接输入与后续风险保留`。
4. `停审裁决`。
5. `flow / 台账推进建议`。
6. `next_allowed_action`。
7. `本模块停审记录`。

#### R1.31.8 禁止事项

下一批不得直接修改正式 `02-概要设计.md`,不得进入 Step 9,不得写状态机定义、状态枚举、状态迁移表、异常分支全集、完整 DTO、repository / port、SQL、topic、payload schema、worker、scheduler、queue、retry、dead letter、配置或测试方案。

若自检发现 Step 8 中间产物缺口,必须停在 Step 8 修复,不得通过正式回填或 Step 9 补口。

#### R1.31.9 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 本模块只定义自检口径和下一写入结构。 |
| 是否写最终停审结论 | no | 最终 pass/fail 留给 `R1.32`。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未在本模块修改。 |
| 是否进入 Step 9 | no | 只定义 Step 9 承接判断口径。 |
| 是否允许进入自检与停审:再写入 | pass | 自检口径、可回填判断和 flow / 台账推进策略已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 8 `自检与停审:再写入`;只写 Step 8 完成门禁自检、正式 §8 草稿可回填性检查、Step 9 承接输入与后续风险保留、停审裁决和 flow / 台账推进建议,不得直接修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.32 自检与停审:再写入

#### R1.32.1 Step 8 完成门禁自检表

| 门禁 | 结论 | 依据 | 说明 |
|---|---|---|---|
| 必读与开工基线完成 | pass | `R1.1`;`R1.2` | 已列明 Step 8 必读文档、输入基线和旧材料只作后置审计的使用边界。 |
| L1-governance 框架参考正确 | pass | `R1.3`;`R1.4` | 仅参考处理流章节深度、收尾结构和审计方式,未复制 governance 领域语义。 |
| 接口候选池覆盖 | pass | `R1.5`;`R1.6`;Step 7 `R1.45` | 已承接 Step 7 当前 58 个 Command、57 个 Query、4 个 Inbound Consumer、34 个 Outbound Event 和 8 个 Operations Job。 |
| 通用骨架完整 | pass | `R1.7`;`R1.8` | 已形成 Command 写路径、Query 只读路径、Inbound / Outbound / Job 概要边界。 |
| 八个组成部分逐个完成 | pass | `R1.9`~`R1.24` | 八个主要组成部分均完成先思考、再写入和停审记录。 |
| 跨处理流一致性完成 | pass | `R1.25`;`R1.26` | 已审计 owner、读写边界、副作用边界、event candidate、operations job 和 Step 9 状态来源提示。 |
| 旧材料差异审计完成 | pass | `R1.27`;`R1.28` | 已排除旧 `MethodContent`、publish、`DefinitionSnapshot`、fingerprint、`OutboxEvent`、governance gate consumer 和旧 job 主线。 |
| 正式 §8 草稿完成 | pass | `R1.29`;`R1.30` | 已形成覆盖 §8.1~§8.6 的可回填草稿,来源限定为当前 Step 8 R1 中间产物。 |
| 未下沉详细设计 / 实现 | pass | `R1.7`~`R1.30` | 未写完整 DTO、repository / port、SQL、topic、payload、worker、scheduler、retry、storage、配置或测试方案。 |
| 未进入 Step 9 | pass | `R1.30`;`R1.31` | 仅给状态来源提示和承接口径,未写状态机、状态枚举或迁移表。 |

#### R1.32.2 正式 §8 草稿可回填性检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 章节覆盖 | pass | `R1.30` 已覆盖 §8.1 处理流输入与边界、§8.2 通用骨架、§8.3 八个组成部分、§8.4 接缝与副作用、§8.5 未展开项、§8.6 Step 9 状态来源提示。 |
| 来源可追溯 | pass | 草稿来源可回指 `R1.2`~`R1.28`、Step 7 `R1.45`、Step 5 / Step 6 当前结论。 |
| 摘要化适度 | pass | 正式草稿只保留处理流族、骨架、接缝、边界和承接提示;完整候选池、图、审计表留在中间产物。 |
| 旧主线禁入 | pass | 草稿未恢复旧 publish、snapshot、fingerprint、outbox、governance gate consumer 或旧 operations job 主线。 |
| 详细设计隔离 | pass | 草稿未写协议 schema、port、repository、topic、payload、worker、scheduler、retry、dead letter、storage、配置或测试切口。 |
| 正式文档状态 | not_written | 当前只完成中间产物草稿;正式 `02-概要设计.md` 的 §8 尚未由本模块回填。 |
| 回填前置动作 | wait_user_decision | 需要用户明确确认是否按 `R1.30` 草稿整体替换正式 §8。 |

#### R1.32.3 Step 9 承接输入与后续风险保留

| 承接 / 风险 | 状态 | 后续要求 |
|---|---|---|
| 八个主要组成部分作为状态 owner 候选 | ready_for_step9 | Step 9 必须从 Step 5 和 Step 8 `R1.30.4` 推导状态 owner,不得新增旧 `MethodContent` owner。 |
| Step 6 关键对象作为状态归属来源 | ready_for_step9 | Step 9 必须回指对象、material、view、task、history、lineage、boundary 或 progress,不得写无对象 owner 的状态。 |
| Step 7 接口触发来源 | ready_for_step9 | Step 9 必须按 Command / Inbound / Job / material refresh 判断状态触发来源,Query 仍保持只读。 |
| Step 8 状态来源提示 | ready_for_step9 | `R1.30.7` 可作为 Step 9 开工输入,但不能替代 Step 9 独立讨论。 |
| 旧 `MethodContentLifecycle` 回流 | open_risk_for_step9 | Step 9 必须重新讨论或深度反查,不得继承旧统一 lifecycle。 |
| 旧 `OutboxEventStatus` 回流 | open_risk_for_step9_or_03 | 概要 Step 9 不得把 delivery / outbox status 作为本仓业务状态主线。 |
| snapshot / fingerprint drift 状态回流 | open_risk_for_step9 | 若需要 freshness / drift,只能从当前 read material、external summary、maintenance progress 重新推导。 |
| worker queue / retry 状态回流 | open_risk_for_later_design | worker / scheduler / retry 属于后续详细设计、配置或实施计划,不得反推概要状态机。 |

#### R1.32.4 停审裁决

| 裁决项 | 结论 | 说明 |
|---|---|---|
| Step 8 中间产物是否完成 | completed | 关键处理流 / 重要函数数据流已按当前 Step 5 / Step 6 / Step 7 全量重审并完成自检。 |
| 正式 §8 是否已回填 | no | 当前只完成 `R1.30` 可回填草稿,未修改正式 `02-概要设计.md`。 |
| 是否存在 Step 8 blocker | no_blocker_for_current_step | 未发现处理流 owner、接口覆盖、读写边界、旧材料污染或详细设计下沉 blocker。 |
| 是否允许正式 §8 回填 | ready_when_user_confirms | 可按 `R1.30` 草稿整体替换正式 §8,但必须等待用户明确确认。 |
| 是否允许进入 Step 9 | ready_after_user_decision | 若用户选择继续 Step 9,下一动作只能是 Step 9 `开工与必读文档:先思考`,不得直接写状态表。 |

#### R1.32.5 flow / 台账推进建议

| 文件 | 建议状态 | 建议 next_allowed_action |
|---|---|---|
| `02_hld_step_08_processing_flows.md` | Step 8 intermediate_completed | 等待用户决定:正式回填 §8,或进入 Step 9 开工。 |
| `02_hld_calibration_flow.md` | Step 8 intermediate_completed / wait_user_decision | 不自动进入 Step 9;等待用户确认正式 §8 回填或继续。 |
| `project_execution_ledger.md` | Step 8 intermediate_completed / wait_user_decision | 恢复点指向“等待用户决定正式 §8 回填或 Step 9 开工”。 |
| `02-概要设计.md` | formal §8 pending_rewrite | 当前不修改;后续若用户确认,按 `R1.30` 草稿整体替换 §8。 |

#### R1.32.6 next_allowed_action

```text
等待用户决定下一动作:
1. 若用户要求正式回填 §8,则按 R1.30 草稿整体替换 projects/L3-method-library/02-概要设计.md 的 §8,并同步 flow / 台账。
2. 若用户要求继续 Step 9,则先进入 Step 9 `开工与必读文档:先思考`;不得直接写状态机正文或状态表。
3. 在用户明确前,不得直接修改正式 02-概要设计.md,不得进入 Step 9。
```

#### R1.32.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成最终自检表 | pass | 已写 Step 8 完成门禁自检。 |
| 是否判断正式 §8 草稿可回填 | pass | `R1.30` 可作为正式 §8 回填草稿,但尚未实际修改正式文档。 |
| 是否保留 Step 9 后续风险 | pass | 已保留旧 lifecycle、outbox status、snapshot / fingerprint drift 和 worker queue 风险。 |
| 是否明确停审裁决 | pass | Step 8 中间产物 completed;下一步等待用户决定。 |
| 是否直接修改正式文档 | no | 未修改正式 `02-概要设计.md`。 |
| 是否进入 Step 9 | no | 未写 Step 9 状态机内容。 |

next_allowed_action: 等待用户决定下一动作:正式回填 §8,或进入 Step 9 `开工与必读文档:先思考`;在用户明确前不得直接修改正式 `02-概要设计.md`,不得进入 Step 9。

### R1.33 正式 §8 回填记录:再写入

#### R1.33.1 回填动作记录

| 项 | 记录 |
|---|---|
| 用户确认 | 已确认执行正式 §8 回填。 |
| 回填来源 | `R1.30 正式 §8 回填草稿:再写入`。 |
| 回填目标 | `projects/L3-method-library/02-概要设计.md` 的 `## 8. 关键处理流 / 重要函数数据流`。 |
| 回填范围 | 仅整体替换正式 `## 8` 到 `## 9` 之前的内容。 |
| 未修改范围 | 未修改正式 `## 9` 或后续章节。 |
| 回填方式 | 摘要化回填:保留处理流输入与边界、通用处理流骨架、八个组成部分关键处理流、跨组成部分接缝、未展开处理流和 Step 9 状态来源提示;完整接口候选池、逐模块审计、旧材料差异审计仍以本文件 `R1.1`~`R1.32` 为准。 |

#### R1.33.2 回填后检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 正式 §8 是否已回填 | pass | 正式 `02-概要设计.md` 的 §8 已按 `R1.30` 草稿整体替换。 |
| 是否只修改 §8 | pass | 本次回填目标限定在 `## 8` 到 `## 9` 之前。 |
| 是否恢复旧处理流主线 | pass | §8 正文未恢复旧 `MethodContent` draft/review/publish、`DefinitionSnapshot`、fingerprint、`OutboxEvent`、governance gate consumer 或旧 operations job 主线。 |
| 是否下沉 Step 9 | pass | §8 只写状态来源提示,未写状态机、状态枚举或状态迁移表。 |
| 是否下沉详细设计 / 实现 | pass | §8 未写完整 DTO、字段全集、HTTP / RPC、repository / port、topic / payload schema、worker、DDL、配置或测试方案。 |

#### R1.33.3 后续风险保留

| 风险 | 当前状态 | 后续要求 |
|---|---|---|
| 正式 §9 仍是旧材料 | open_for_step9 | Step 9 必须按 Step 5 / Step 6 / Step 7 / Step 8 当前结论重新讨论或深度反查,不得继承旧状态主线。 |
| 旧 `MethodContentLifecycle` 回流 | open_for_step9 | Step 9 状态 owner 必须来自当前关键对象,不得恢复旧统一 lifecycle。 |
| 旧 `OutboxEventStatus` 回流 | open_for_step9_or_03 | 投递状态若需要,只能在后续详细设计 / 配置 / 实施中重新闭口,不得成为概要状态主线。 |
| snapshot / fingerprint / worker queue 状态回流 | open_for_step9 | Step 9 若讨论 freshness / drift / maintenance progress,必须从当前 read material、external summary、maintenance task/run/progress 重新推导。 |

#### R1.33.4 本模块最终裁决

| 裁决项 | 结论 | 说明 |
|---|---|---|
| Step 8 中间产物 | completed | `R1.1`~`R1.32` 已闭合处理流候选、通用骨架、八个组成部分、跨流审计、旧材料审计、草稿和自检。 |
| 正式 §8 | backfilled | 正式 §8 已按 `R1.30` 回填。 |
| Step 8 blocker | none | 当前 Step 8 无遗留 blocker。 |
| 下一步 | ready_for_step9_opening | 下一步只能进入 Step 9 `开工与必读文档:先思考`,不得直接写状态机正文或状态表。 |

next_allowed_action: 等待用户确认后进入 Step 9 `开工与必读文档:先思考`;Step 9 必须以正式 §8 回填后文本、`R1.1`~`R1.33`、Step 7 `R1.45`、Step 5 / Step 6 当前结论为输入基线,不得沿用旧正式 §9 或 historical Step 9 作为第一来源。
