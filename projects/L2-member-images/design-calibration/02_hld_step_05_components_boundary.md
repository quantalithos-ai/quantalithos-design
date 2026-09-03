# L2-member-images 02 概要 Step 5: 主要组成部分、职责与边界

> 创建日期: 2026-08-24
> 状态: `completed_pass`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 5 章
> 当前限制: 正式旧 `02` 仍未读取；未创建 Step 6 文件；本文件不展开对象字段、函数签名、完整接口或详细流程

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 4 的五组代码主体与实现分层、Step 3 的 HLC-MI-001~023、正式 01 的 BC / LS 与数据 / 依赖 / 交互边界 |
| 规范 | 已读取概要设计 SOP Step 5 与书写规范 §4.5；参考 L1-governance 的“业务部分 + 责任层正交”粒度 |
| 本步目标 | 收稳主要组成部分、职责 / 非职责、能力、代码主体、接缝和 Step 6 对象候选池 |
| 本步禁止 | 把实现层当业务部分；写关键对象字段 / 函数；把 API / repository / DTO 当领域对象；复制外部正文或 pending positive contract |
| 串行门禁 | Step 5 完成后才能创建 Step 6；用户已授权连续完成 02，但仍保持文件按 Step 单独落盘 |

## 1. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓应划分哪些主要组成部分？ | 五个：镜像定义与装配基线、构建意图与候选形成、provenance 与资格、供给可用性与实例化入口、外部引用与派生维护。前四个承载核心阶段事实，第五个承载受控影子与派生维护。 |
| 每部分承担什么 / 不承担什么？ | 各部分只拥有自己的阶段性 local truth；Role / component / seed / Artifact / consumer / container 等外部 truth 仍由相邻 owner 持有，且不因装配、回调或查询而转移。 |
| 每部分完成哪些 capability？ | 分别覆盖 definition / baseline、intent / attempt / candidate、digest / provenance / gate / eligibility、availability / rollback / entry / gap、ref validity / snapshot / trace / projection / reconciliation。 |
| 输入输出与状态影响如何表达？ | 只写概要层对象族、阶段结果和受控接缝；完整 payload、事务和状态编码留给 03。每个能力明确本地写入、外部协作和 pending 结果。 |
| 代码主体到什么粒度？ | 点名 coordinator、domain subject、port、repository / projection role；不写目录、类层级、完整签名或物理部署。 |
| 哪些相关能力必须排除？ | Runtime loop、member 主体、tool execution、mapping truth、Artifact 正文、container lifecycle、Sandbox、governance approval、observability backend、marketplace / product 均不成为本仓部分。 |

## 2. 主要组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| `DefinitionAssembly` 镜像定义与装配基线 | 形成 image family / variant / persona assembly identity、完整 pinned baseline、revision / derivation 关系 | `DefinitionAssemblyCoordinator`、`ImageFamilyDefinition`、`ImageVariantDefinition`、`AssemblyBaseline`、`VariantRevision` | 不定义 RoleDefinition / mapping truth，不拥有 component / seed 正文、live state 或 build outcome |
| `BuildCandidate` 构建意图与候选形成 | 形成 build intent、attempt、immutable input snapshot，并把外部 outcome 转为 candidate / failed / blocked / unknown 语境 | `BuildIntentCoordinator`、`BuildIntent`、`BuildAttempt`、`BuildInputSnapshot`、`CandidateImage`、`BuilderPort` | 不拥有 scheduler / builder / registry job truth，不把 handoff ACK 或 registry presence 当 candidate |
| `Qualification` Provenance 与资格 | 绑定 digest / provenance，消费 applicable gate safe conclusion，形成 image eligibility 或保守阻断 | `QualificationCoordinator`、`ProvenanceBinding`、`GateEvaluation`、`EligibilityDecision`、`EvidenceConclusionPort` | 不拥有 evidence / policy / Artifact 正文、漏洞或签名真相，不把 eligibility 当 availability 或 consumer ready |
| `SupplyEntry` 供给可用性与实例化入口 | 管理 availability history、publish / replace / rollback / retire 与 immutable pinned entry / consumer gap | `AvailabilityCoordinator`、`AvailabilityTransition`、`InstantiableEntry`、`ConsumerHandoffGap`、`MemberServiceSupplyPort` | 不创建容器、不判定 launch / health / upgrade，不拥有 ArtifactVersion / lineage / consumer truth |
| `ReferenceDerived` 外部引用与派生维护 | 校验 ref / snapshot / safe conclusion / gap，维护 trace、catalog、manifest、history / gap view 与重建 / 对账 | `ReferenceIntakeCoordinator`、`ExternalReferenceSnapshot`、`ContractGap`、`ImageTraceRecord`、`ProjectionRebuilder` | 不创建核心 positive truth，不保存外部正文，不让 projection / cache / fake 反写正式状态 |

## 3. 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| `DefinitionAssembly` | `ImageFamilyDefinition`、`ImageVariantDefinition`、`AssemblyBaseline`、`VariantRevision` | `AssemblyCompletenessGuard`、`PinIntegrityGuard` | `AssemblyDerivationView` | `MappingSourceSnapshot`、`ComponentPinSet`、`SeedPlacementBinding` | `DefinitionRevisionHistory` 语义由 revision / trace 承载 | family、variant、baseline、revision、mapping snapshot、pin set、seed binding、guards |
| `BuildCandidate` | `BuildIntent`、`BuildAttempt`、`CandidateImage` | `BuildInputGuard`、`CandidateFormationGuard` | `BuildTraceView` | `BuildInputSnapshot`、`BuildOutcomeConclusion`、builder / registry refs | attempt / outcome history | intent、attempt、input snapshot、candidate、outcome conclusion |
| `Qualification` | `ProvenanceBinding`、`GateEvaluation`、`EligibilityDecision` | `ProvenanceCompletenessGuard`、`ApplicableGateGuard` | `ProvenanceLookupView`、`EligibilityView` | `EvidenceConclusionRef`、`ArtifactHandoffRecord` | evaluation history、qualification trace | provenance、gate evaluation、eligibility、evidence ref、Artifact handoff |
| `SupplyEntry` | `AvailabilityTransition`、`InstantiableEntry`、`ConsumerHandoffGap` | `EntryPinGuard`、`AvailabilityTransitionGuard` | `AvailableVariantCatalogView`、`ImageManifestView` | `RegistryImageRef`、`ArtifactConsumableRef`、member-service supply seam | availability / rollback / retire history | availability transition、entry、consumer gap |
| `ReferenceDerived` | `ExternalReferenceSnapshot`、`ContractGap`、`ProjectionFreshness` | `ReferenceValidityGuard`、`ProjectionReadOnlyGuard` | `ImageTraceView`、`GapSummaryView`、maintenance view | source-specific ref / snapshot / safe conclusion | `ImageTraceRecord`、reconciliation record | snapshot、gap、trace、freshness、derived views |

## 4. 各部分交互总图

```text
+======================================================================+
|              L2-member-images 主要组成部分交互总图                  |
+======================================================================+
| DefinitionAssembly                                                  |
|   [mapping/component/seed refs]                                     |
|          | complete pinned baseline                                 |
|          v                                                          |
| BuildCandidate --[builder/registry adapter outcome]--> Candidate     |
|          | candidate + immutable provenance input                    |
|          v                                                          |
| Qualification --[evidence / Artifact boundary]--> Eligibility        |
|          | eligible candidate                                        |
|          v                                                          |
| SupplyEntry --[pinned entry / gap]--> L2-member-service              |
|          | availability / rollback history                           |
|          v                                                          |
| ReferenceDerived <---- ref / snapshot / safe conclusion ---- all    |
|          | read-only trace / catalog / gap / freshness                |
|          +---------------------- no reverse write -------------------+
+======================================================================+
```

关键说明：

- 箭头表示结构上的前置关系或受控交接，不表示一次运行时调用链；各阶段仍可产生 pending、failed、blocked 或 unknown。
- `ReferenceDerived` 横切支撑所有部分，但不能从 projection、cache、对账或 fake 反写核心 truth。
- Artifact handoff、consumer confirmation 和 container lifecycle 位于边界外；图中只保留 ref / gap 交接。
- 当前没有 outbound event 主线；条件型 inbound event 只能在验证 authority 后形成 BuildIntent。

## 5. `DefinitionAssembly` 镜像定义与装配基线

### 5.1 本部分职责

负责把外部 Role / mapping 来源和静态 component、extras、base、template / seed 引用组合为本仓可判断的 image family / variant / persona assembly 定义，形成完整 pinned `AssemblyBaseline`、`VariantRevision` 与 derivation 关系。它是装配语义 owner，不是任何输入正文 owner。

### 5.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 建立 / 修订 image variant 定义 | variant identity、已验证 mapping snapshot、受控 actor / command context | `ImageVariantDefinition` revision candidate | local definition history；缺来源则 blocked / unresolved | Step 6 对象、Step 7 Command |
| 组装静态 baseline | component / extras / base / seed refs 与 placement | `AssemblyBaseline` 或 baseline gap | incomplete / conflict 不形成 buildable revision | Step 6 对象、Step 8 flow |
| 校验 pin 与静态 / live 边界 | source bindings、pin set、seed placement | guard conclusion | secret / live body / mutable selector 拒绝 | Step 6 guard、Step 10 异常 |
| 形成 variant revision / derivation | 前一 revision、baseline、变更语境 | `VariantRevision` 与 derivation relation | append / supersede，不覆盖历史 | Step 6、Step 9 |

### 5.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `DefinitionAssemblyCoordinator` | Application Service | 编排定义修订、baseline 校验和 revision 写入 | Step 7 / 8 |
| `ImageFamilyDefinition` / `ImageVariantDefinition` | Domain subjects | 表达本仓 image identity 与 variant 归属 | Step 6 |
| `AssemblyBaseline` / `VariantRevision` | Domain subjects | 表达完整静态输入与派生版本 | Step 6 / 9 |
| `MappingReferencePort`、`ComponentReferencePort`、`SeedReferencePort` | Ports | 获取 ref / snapshot / safe conclusion，不暴露正文 | Step 7 / 03 |
| `DefinitionTruthRepositoryPort` | Persistence port | 保存本仓 definition / revision truth | Step 8 / 03 |

### 5.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ImageFamilyDefinition`、`ImageVariantDefinition`、`AssemblyBaseline`、`VariantRevision` | 全部独立展开；字段只保留 identity、来源、pin、placement、revision 骨架 |
| Policy / Invariant | `AssemblyCompletenessGuard`、`PinIntegrityGuard` | 独立作为 policy / guard 对象，说明禁止 partial positive |
| Projection / Read model | `AssemblyDerivationView` | 若仅为查询视图，按 projection 对象展开；不得反写 baseline |
| Reference / Boundary | `MappingSourceSnapshot`、`ComponentPinSet`、`SeedPlacementBinding` | 只表达 ref / snapshot / placement，不复制正文 |
| Audit / History | `DefinitionRevisionHistory`（由 revision / trace 承载） | 不另造第二 truth；Step 6 说明历史承载关系 |

### 5.5 本部分不承担什么

- 不定义 RoleDefinition、Role -> variant mapping 或方法资产正文。
- 不拥有 member / runtime / tools release、seed semantic body、secret、live memory、workspace live content。
- 不启动构建、不判断 candidate / eligibility / availability，不解析 registry 或 container 状态。
- 不因某个 source adapter 返回成功而自动形成 resolved revision。

### 5.6 与其他部分的接缝

`DefinitionAssembly` 向 `BuildCandidate` 提供完整 `VariantRevision` 或明确 baseline gap；向 `ReferenceDerived` 请求来源 validity / gap；不直接调用 builder、registry 或 Member Service。MI-UP-002/003/006 未闭口时只产生 pending / blocked / unavailable。

### 5.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | `pass` | 覆盖定义、baseline、pin、revision |
| 候选对象是否有功能来源 | `pass` | 每个候选均来自 definition / assembly 能力 |
| 接缝是否清楚 | `pass` | 只经 reference ports，与 build / supply 分域 |
| 禁止事项是否清楚 | `pass` | 外部正文、live state、mapping owner 和 build outcome 已排除 |
| 是否越界 | `pass` | 未承接相邻 owner truth 或物理实现 |

## 6. `BuildCandidate` 构建意图与候选形成

### 6.1 本部分职责

承接 nightly 和获准的 conditional input，创建带完整 immutable snapshot 的 `BuildIntent` / `BuildAttempt`，将外部执行结果转成候选形成关系或保守失败语境。它记录本仓对构建阶段的判断，不拥有后端 job / log / registry body。

### 6.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 接收 nightly / verified build request | revision ref、trigger context | `BuildIntent` | accepted / blocked / unavailable | Step 7 / 8 |
| 固化 build input snapshot | complete revision、pin refs、tool / runtime / member refs | `BuildInputSnapshot` | snapshot incomplete 时不 handoff | Step 6 / 8 |
| 创建和推进 build attempt | intent、snapshot、attempt identity | `BuildAttempt` | pending / failed / unknown / blocked | Step 6 / 9 |
| 归纳 external outcome | adapter outcome、immutable output ref、digest candidate | `CandidateImage` 或 failure / gap | handoff success 不自动形成 candidate | Step 7 / 8 / 10 |

### 6.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `BuildIntentCoordinator` | Application Service | 编排 trigger 校验、snapshot、attempt 与 outcome 归纳 | Step 7 / 8 |
| `BuildIntent` / `BuildAttempt` | Domain subjects | 表达构建意图与尝试历史 | Step 6 / 9 |
| `BuildInputSnapshot` / `CandidateImage` | Domain subjects | 固化输入语境与候选身份 | Step 6 |
| `BuilderPort` / `RegistryPort` | Ports | 产品中立地交接和解析外部结果 | Step 7 / 03 |
| `BuildOutcomeAdapter` | Adapter boundary | 将外部结果转为 safe conclusion / unknown / gap | Step 7 / 10 |
| `BuildTruthRepositoryPort` | Persistence port | 保存 intent / attempt / candidate relation | Step 8 / 03 |

### 6.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `BuildIntent`、`BuildAttempt`、`CandidateImage` | 独立展开，分开 intent、attempt、candidate，不建 pipeline ready |
| Policy / Invariant | `BuildInputGuard`、`CandidateFormationGuard` | 说明完整 snapshot、digest / output ref 与 outcome 验证条件 |
| Projection / Read model | `BuildTraceView` | 只读显示 intent / attempt / outcome 关系 |
| Reference / Boundary | `BuildInputSnapshot`、`BuildOutcomeConclusion`、builder / registry refs | 只承接来源和结果，不保存 job / log body |
| Audit / History | `BuildAttemptHistory` | 由 append attempt / outcome 关系承载，不能覆盖旧语境 |

### 6.5 本部分不承担什么

- 不决定 Role mapping、组件兼容性 owner、evidence gate、Artifact formalization 或 availability。
- 不把 scheduler accepted、builder success、registry presence、callback 或 transport ACK 直接升级为 candidate。
- 不保存外部 job、log、report、secret 或镜像正文。
- 不产生当前无 authority 的 outbound build / publish event。

### 6.6 与其他部分的接缝

只从 `DefinitionAssembly` 接受完整 revision；向 `Qualification` 提供 candidate 或明确失败 / unknown；向 `ReferenceDerived` 请求外部 ref validity。MI-UP-005 未闭口时 event consumer 只产生 unavailable / rejected，不形成 intent。

### 6.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | `pass` | trigger、snapshot、attempt、candidate 已分开 |
| 候选对象是否有功能来源 | `pass` | 均来自构建阶段能力 |
| 接缝是否清楚 | `pass` | builder / registry 只以 adapter / ref 进入 |
| 禁止事项是否清楚 | `pass` | 不拥有后端 truth、不产生 outbound event |
| 是否越界 | `pass` | eligibility / availability 留给后续部分 |

## 7. `Qualification` Provenance 与资格

### 7.1 本部分职责

将候选输出、完整输入快照和可验证 external conclusion 绑定为 `ProvenanceBinding`，按正式 authority 确定的 applicable gate 形成 `GateEvaluation` 与 `EligibilityDecision`。资格成立只表示镜像域 eligibility，不表示 Artifact、供给或消费成功。

### 7.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 绑定候选 provenance | candidate、input snapshot、execution / output refs | `ProvenanceBinding` | 缺来源或 digest 不一致时 blocked | Step 6 / 8 |
| 收集 applicable gate conclusion | authority-driven gate set、evidence refs / safe conclusions | `GateEvaluation` | missing / failed / unknown 不默认通过 | Step 6 / 7 / 10 |
| 形成 image eligibility | candidate、provenance、gate evaluation | `EligibilityDecision` | eligible / ineligible / pending / blocked | Step 6 / 9 |
| 形成 Artifact handoff 语境 | eligible candidate、handoff contract status | `ArtifactHandoffRecord` 或 gap | MI-UP-007 未闭口时仅 gap / pending | Step 7 / 8 / 13 |

### 7.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `QualificationCoordinator` | Application Service | 编排 provenance、gate 和 eligibility 判断 | Step 7 / 8 |
| `ProvenanceBinding` / `GateEvaluation` / `EligibilityDecision` | Domain subjects | 表达资格阶段的本地 truth | Step 6 / 9 |
| `ProvenanceCompletenessGuard` / `ApplicableGateGuard` | Policy / guard | 防止无来源 digest、缺 gate 或 unknown 被通过 | Step 6 / 10 |
| `EvidenceConclusionPort` | Ref / adapter port | 消费 safe conclusion / evidence ref | Step 7 / 03 |
| `ArtifactHandoffPort` | Conditional port | 向 Artifact owner 交接或记录 gap | Step 7 / 13 |
| `QualificationTruthRepositoryPort` | Persistence port | 保存 evaluation / eligibility history | Step 8 / 03 |

### 7.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ProvenanceBinding`、`GateEvaluation`、`EligibilityDecision` | 独立展开，分开证据结论、适用性和 eligibility |
| Policy / Invariant | `ProvenanceCompletenessGuard`、`ApplicableGateGuard` | 明确 authority-driven、fail-closed 和不可绕过 |
| Projection / Read model | `ProvenanceLookupView`、`EligibilityView` | 只读；表达来源链和 freshness |
| Reference / Boundary | `EvidenceConclusionRef`、`ArtifactHandoffRecord` | 只持 ref / safe conclusion / gap，不复制 evidence / Artifact body |
| Audit / History | evaluation history / qualification trace | 通过 append evaluation 与 trace 关联，不覆盖旧结论 |

### 7.5 本部分不承担什么

- 不定义 governance approval、policy effective truth、BOM / scan / signature 正文或 ArtifactVersion / lineage。
- 不以 registry presence、adapter accepted、consumer confirmation 或 product readiness 替代 eligibility。
- 不在 Q-MI-004 未闭口时枚举 evidence kind / priority 或声明 evidence pass。

### 7.6 与其他部分的接缝

从 `BuildCandidate` 接收 candidate；向 `SupplyEntry` 只提供 eligible candidate 或明确资格 gap；与 `ReferenceDerived` 交换 safe conclusion / ref validity。MI-UP-007 未闭口时 Artifact 侧不返回本地 formal positive ref。

### 7.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | `pass` | provenance、gate、eligibility 分层 |
| 候选对象是否有功能来源 | `pass` | 每项都来自资格闭环 |
| 接缝是否清楚 | `pass` | evidence / Artifact 只经 ref / adapter |
| 禁止事项是否清楚 | `pass` | 不拥有外部正文与 approval truth |
| 是否越界 | `pass` | availability / consumer 留给 SupplyEntry |

## 8. `SupplyEntry` 供给可用性与实例化入口

### 8.1 本部分职责

在 eligible candidate 基础上形成 availability transition、publish / replace / rollback / retire history 和 immutable `InstantiableEntry`，向 Member Service 提供 pinned entry 或显式 contract gap。它不判断容器是否启动或健康。

### 8.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 形成 supply availability | eligible candidate、entry pin、transition context | `AvailabilityTransition` | 不完整或 conflict 时保持原状态并拒绝新 transition | Step 6 / 9 |
| 发布 / 替换实例化入口 | eligible candidate、immutable ref、consumer boundary | `InstantiableEntry` 或 gap | 不使用 mutable selector，不推导 launch success | Step 7 / 8 |
| rollback / retire | 已知历史 entry、transition reason | 新 transition / retired history | 不删除旧 candidate / digest / availability history | Step 8 / 9 / 10 |
| resolve pinned entry | variant identity、consumer context | entry view 或 unavailable / contract-gap | 不直接解析 Role mapping，不等待 container | Step 7 / 8 |

### 8.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `AvailabilityCoordinator` | Application Service | 编排 publish / replace / rollback / retire | Step 7 / 8 |
| `AvailabilityTransition` / `InstantiableEntry` | Domain subjects | 表达供给事实和 pinned 消费入口 | Step 6 / 9 |
| `ConsumerHandoffGap` | Domain boundary subject | 表达 exact consumer contract 缺失或不可验证 | Step 6 / 10 |
| `EntryPinGuard` / `AvailabilityTransitionGuard` | Policy / guard | 防 mutable entry、越级 transition 与历史覆盖 | Step 6 / 10 |
| `MemberServiceSupplyPort` | External supply port | 向下游提供 entry / gap，不反向接收 container truth | Step 7 / 13 |
| `AvailabilityTruthRepositoryPort` | Persistence port | 保存 availability / transition history | Step 8 / 03 |

### 8.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `AvailabilityTransition`、`InstantiableEntry`、`ConsumerHandoffGap` | 独立展开，分开 availability、entry 与 consumer gap |
| Policy / Invariant | `EntryPinGuard`、`AvailabilityTransitionGuard` | 明确 immutable pin、eligible 前置、history append |
| Projection / Read model | `AvailableVariantCatalogView`、`ImageManifestView` | 只读；manifest 不能成为第二 truth |
| Reference / Boundary | `RegistryImageRef`、`ArtifactConsumableRef`、member-service supply seam | 只持正式 ref / gap；MI-UP-001/007 未闭口不造 ref |
| Audit / History | availability / rollback / retire history | 由 transition 追加承载，不覆盖旧入口 |

### 8.5 本部分不承担什么

- 不创建、启动、停止、升级或健康检查 container，不拥有 sandbox / runtime live state。
- 不把 image eligibility、registry presence、Artifact formalization 或 consumer confirmation 压成一个 ready 状态。
- 不自行决定下游升级、不定义 Member Service 的 host / session / lifecycle。

### 8.6 与其他部分的接缝

从 `Qualification` 接收 eligible candidate；通过 `MemberServiceSupplyPort` 提供 pinned entry / gap；通过 `ReferenceDerived` 获取 registry / Artifact / consumer ref validity。MI-UP-001 未闭口时 resolve 的 positive confirmation 保持 blocked / unavailable。

### 8.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | `pass` | availability、entry、rollback、retire、resolve 已分层 |
| 候选对象是否有功能来源 | `pass` | 均来自供给入口能力 |
| 接缝是否清楚 | `pass` | Member Service / Artifact 只以 ref / gap 交接 |
| 禁止事项是否清楚 | `pass` | container / health / upgrade 已排除 |
| 是否越界 | `pass` | 不拥有 Artifact 或 consumer truth |

## 9. `ReferenceDerived` 外部引用与派生维护

### 9.1 本部分职责

作为所有外部 boundary 的 anti-corruption / maintenance 责任线，接收和校验 ref、snapshot、safe conclusion、adapter outcome 与 gap，维护 trace、catalog、manifest、freshness 和 reconciliation view。它不创建任何核心 positive truth。

### 9.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 校验外部引用 / snapshot | ref identity、source status、freshness | `ExternalReferenceSnapshot` 或 `ContractGap` | stale / conflict / unavailable 显式保留 | Step 6 / 8 / 10 |
| 形成 source trace / gap explanation | 本仓 history、外部 safe conclusion、handoff status | `ImageTraceRecord`、gap view | 只读、可重建 | Step 6 / 9 |
| 重建派生目录与 manifest | formal truth、受控影子 | projections | stale / rebuilding / unavailable 可见 | Step 7 / 8 / 9 |
| 对账 pending handoff / ref | handoff records、owner-side updates | reconciliation conclusion | 不反写核心 truth；必要时形成新 decision 输入 | Step 8 / 10 / 13 |

### 9.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ReferenceIntakeCoordinator` | Application / boundary service | 统一处理 ref / snapshot / safe conclusion / gap | Step 7 / 8 |
| `ExternalReferenceSnapshot` / `ContractGap` | Boundary subjects | 表达外部来源可用性与合同缺口 | Step 6 / 9 |
| `ImageTraceRecord` | Audit / history subject | 维护本仓关系可追溯链 | Step 6 / 8 |
| `ProjectionRebuilder` | Operations / projection service | 从正式 truth 重建只读视图 | Step 7 / 8 |
| `HandoffReconciler` | Operations / boundary service | 解释 Artifact / consumer handoff gap | Step 7 / 8 / 10 |
| `ProjectionRepositoryPort` | Read / projection port | 保存可重建视图与 freshness | Step 8 / 03 |

### 9.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ExternalReferenceSnapshot`、`ContractGap`、`ProjectionFreshness` | 只表达 boundary / projection 状态，不创建核心 positive truth |
| Policy / Invariant | `ReferenceValidityGuard`、`ProjectionReadOnlyGuard` | 明确 source validity、stale 和 no-writeback |
| Projection / Read model | `ImageTraceView`、`GapSummaryView`、`AvailableVariantCatalogView`、`ImageManifestView` | 独立列出来源、freshness 和可重建性质 |
| Reference / Boundary | mapping / component / seed / builder / registry / evidence / Artifact / consumer refs | 采用 source-specific typed ref 类别，不复制正文 |
| Audit / History | `ImageTraceRecord`、reconciliation record | trace 可追加；reconciliation 不替代 owner truth |

### 9.5 本部分不承担什么

- 不定义任何 BC-MI-01~04 的 positive decision，不将 snapshot / projection / cache 反写核心。
- 不保存 provider response、job log、policy body、Artifact body、container body 或 observed body。
- 不把 fake、adapter availability 或 projection freshness 当作领域成功。

### 9.6 与其他部分的接缝

向所有部分提供 ref validity、safe snapshot、safe conclusion、gap 与 derived read；接受各部分正式 truth 作为唯一投影来源。它是边界支撑而非第五个“ready”阶段。

### 9.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | `pass` | intake、trace、projection、reconcile 已分开 |
| 候选对象是否有功能来源 | `pass` | 均来自 LS / 横切能力 |
| 接缝是否清楚 | `pass` | 只读 / ref / gap 边界明确 |
| 禁止事项是否清楚 | `pass` | 无 positive truth、无 external body |
| 是否越界 | `pass` | 不取代四个核心 BC 或 owner |

## 10. 总体边界说明与 Step 6 展开门禁

五个主要组成部分按“阶段性 local truth + 横切 boundary / projection”组织，不能合并成单一 image lifecycle，也不能按 builder / registry / CI 步骤拆成脚本模块。Step 6 只能从本文件的对象发现维度和候选线索正式化对象；候选中的 API、repository、port、trigger、DTO、数据库表或外部 SDK 响应默认不成为关键领域对象。

## 11. 跨组成部分闭环审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 主要组成部分覆盖 BC-MI-01~05 | `pass` | 五个部分各有唯一语义 owner |
| definition -> candidate -> eligibility -> availability 顺序 | `pass` | 前置关系保留，未压成单状态 |
| LS-MI-01~04 有承接但不拥有 truth | `pass` | 归入 ReferenceDerived / projections |
| 每个代码主体有后续位置 | `pass` | Step 6~9 或 03 明确承接；无悬空主体 |
| 对象候选均有功能来源 | `pass` | 逐部分对象发现表已列出 |
| 外部 owner 与 pending seam 未越界 | `pass` | MI-UP / Q 仍只允许 gap / pending / future |
| 组成部分间职责重叠 | `none_found` | Qualification 与 Supply 的 eligibility / availability 分界明确 |
| 单一 ready 生命周期风险 | `closed_for_current_step` | 已明确五阶段与 consumer / Artifact 分域 |

## 12. 回填草稿与下一步门禁

正式第 5 章回填：总表、对象发现维度表、交互总图及五个部分的小节；不回填问题回答和每部分停审过程。Step 6 必须按组成部分逐个从候选池筛选并独立展开对象，不得把本节候选表当作最终字段定义。

`gate_status = pass_stop_review`。Step 5 足以支撑 Step 6；下一动作是读取 Step 5 与 Step 6 规范并创建 `02_hld_step_06_key_objects.md`。
