# L2-member-images 02 概要 Step 13: 设计风险与待确认事项

> 创建日期: 2026-08-24
> 状态: `completed_pass`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 13 章
> 当前限制: 正式旧 `02` 仍未读取；未创建 Step 14 文件；三个 Layer 3 并行项目的进行中内容只作 pending 线索，不构成双方合同

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 4~12 已通过的代码主体、组成部分、对象、接口、流程、状态、异常、配置影响与 03 承接结论；正式 00 / 01 的开放条件 |
| 规范 | 已读取概要设计 SOP Step 13 与书写规范 §4.13；风险与待确认必须分表，禁止任务化和假挂起 |
| 用户并行口径 | `L2-member-images`、`L2-member-service`、`L2-member` 由三个 agent 并行讨论；本项目只按单 agent 串行执行，项目间依赖未共同闭合时先占位说明 |
| 本步目标 | 收纳仍会影响概要主线成立性的设计风险，以及缺少 owner / scope / product authority 的待确认事项，明确进入 03 的保守上限 |
| 本步禁止 | 把稳定的 03 承接清单重新写成待确认；把 sibling 进行中字段写成 exact contract；写 backlog、方案、排期、实现、测试或 readiness |

## 1. Step 内计划与门禁

| 阶段 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 问题回答 | 风险、待确认、影响面、误导点与排除项逐项回答 | `done` | 五个 SOP 问题均有明确回答 |
| 诊断 | 识别“稳定结构”“已知设计风险”“缺 authority 待确认”混写风险 | `done` | 三类内容可互斥归类 |
| 设计取舍 | 确定风险合并维度与 MI-UP / Q 保留粒度 | `done` | 不丢 ID，不把外部问题直接搬成上游风险页 |
| 结构化 | 设计风险表、待确认事项表、03 推进上限 | `done` | 全部 MI-UP / Q 可追溯且未伪关闭 |
| 回填与自检 | 正式第 13 章候选、排除审计、Step 门禁 | `done` | 满足 §4.13 且不提前进入 Step 14 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些问题已构成概要设计风险？ | Exact owner contracts 可能漂移、分阶段事实可能被压成单一 ready、外部引用 / 结果可能失真、未知副作用可能被误判成功、投影可能被当成 truth，以及 pending scope / product 可能被提前激活。这些风险都直接影响五个主要部分、接口流或状态轴的成立性。 |
| 2. 哪些只能作为待确认挂起？ | `MI-UP-001~009` 与 `Q-MI-001~004` 仍缺双方停审合同、正式 owner authority、范围裁决或产品 / policy 决策；当前不能写成 exact schema、active capability 或 positive outcome。 |
| 3. 分别影响什么？ | 影响 DefinitionAssembly 的来源 / pin / seed，BuildCandidate 的 event / adapter outcome，Qualification 的 gate / Artifact handoff，SupplyEntry 的 consumer contract，以及 ReferenceDerived 的 ref / freshness / reconciliation；也影响 03 的 schema、port、状态和错误展开上限。 |
| 4. 哪些若不收纳会误导 03？ | 若不显式保留 exact seam 与 staged-decision 风险，03 可能私造外部 DTO、把 adapter success 当领域成功、将 Artifact / Member Service 状态并入 availability，或用 projection / config 补齐缺失 truth。 |
| 5. 哪些不属于本步？ | 完整字段、接口 payload、错误码、技术产品、配置键、测试任务、实现顺序、排期、性能数字和一般优化项不属于本步；Step 12 已稳定的对象 / 接口 / 流也不作为待确认重复列出。 |

## 3. 当前材料诊断

| 现象 | 若不修正的后果 | 本步处置 |
|---|---|---|
| MI-UP / Q 同时散落在约束、接口、异常和承接表 | 容易遗漏某个 ID，或把局部 neutral seam 误当开放项已关闭 | 在待确认表逐项保留全部 ID，并只引用已稳定的保守上限 |
| 三个 Layer 3 项目并行讨论 | 进行中文档可能相互引用后形成循环“自证” | 只消费已停审 owner / direction；exact sibling dependency 保持 pending placeholder，等待双方正式校准 |
| 多个 pending 会共同影响同一结构风险 | 逐项复制上游问题会把第 13 章写成 dependency 清单 | 风险表按本仓概要失真模式合并；待确认表按 owner-controlled ID 保留 |
| Step 12 已列出 03 展开方向 | 再把它们列为待确认会让稳定主语退化 | 稳定主语不回退；仅限制受 pending 影响的 positive schema / success lane |
| Fail-closed 已在前文形成控制 | 可能误称风险已完全关闭，或误称整个 03 不可进入 | 记为“当前有保守控制但风险仍开放”；允许 neutral / negative 详细设计，阻塞受影响 positive expansion |

## 4. 判定与取舍

### 4.1 判定规则

- 设计风险必须是已经识别的本仓概要失真模式，并直接影响主要部分、对象、接口、流程、状态或下游边界。
- 待确认事项必须缺少正式 owner、双方合同、范围或产品 / policy authority；缺失确认前必须有明确挂起方式。
- 已由 owner / invariant 收稳的事实不是待确认；外部实现状态、任务或运维问题也不是本概要风险。
- 同一 MI-UP / Q 可以成为某项风险的触发来源，但风险与待确认不因此合并为同一表。

### 4.2 方案比较

| 方案 | 收益 | 代价 / 风险 | 结论 |
|---|---|---|---|
| A. 直接把 MI-UP / Q 全部列为风险 | ID 完整 | 把“尚无定论”误写成“已知风险”，且重复上游 dependency 清单 | 不采用 |
| B. 风险按本仓失真模式合并，待确认按 MI-UP / Q 逐项保留 | 既能解释概要为何可能失效，又保留每个关闭 authority | 表格较长，但可直接约束 03 | 采用 |
| C. 只写“全部待上游确认” | 简短 | 没有影响面与挂起口径，无法防止 03 脑补 | 不采用 |

## 5. 设计风险清单

| ID / 风险 | 影响 | 当前处理口径 |
|---|---|---|
| `R-HLD-MI-001` 并行 owner / consumer exact contract 漂移 | `DefinitionAssembly` 的 mapping / component / seed carriers，`Qualification` 的 Artifact handoff，`SupplyEntry` 的 Member Service port，以及 03 的 DTO / mapper / compatibility | 只固定 owner、方向、typed ref 类别、neutral port、gap 与 fail-closed；三个并行项目的进行中内容不关闭 `MI-UP-001~007`，双方正式校准前不写 positive schema。 |
| `R-HLD-MI-002` 分阶段事实被压成单一 ready | `BuildCandidate`、`Qualification`、`SupplyEntry` 状态轴，以及 Artifact / consumer / container 边界；可能使 candidate 或 eligibility 被误当可实例化 / 已启动 | `intent/attempt/candidate`、eligibility、availability、Artifact handoff、consumer / container state 分开成立；跨阶段只接受明确 ref / committed fact / gap，任何 adapter ACK 不升级为后续成功。 |
| `R-HLD-MI-003` 外部 reference / safe conclusion 失真或过期 | `MappingSourceSnapshot`、component / seed refs、evidence / Artifact / consumer refs、reconciliation 与所有受影响新 decision lane | 只保存 owner identity、immutable ref、snapshot、validity、freshness 与 safe conclusion；missing / stale / conflict / unavailable 显式化并冻结受影响新 lane，不 fallback、复制正文或猜版本。 |
| `R-HLD-MI-004` 外部构建副作用未知时重复执行或伪造候选 | `BuildAttempt`、`BuildOutcomeConclusion`、`CandidateImage`、幂等 / correlation 流，以及 registry / builder adapters | handoff / timeout / callback 只形成 `pending/unknown/failed/blocked` 结论；必须证明 output ref、input snapshot 与 attempt 关联后才形成 candidate，unknown 通过 resolution 或新 attempt 语境恢复，禁止盲重试和推断 digest。 |
| `R-HLD-MI-005` Gate applicability 或 Artifact handoff 未闭口却产生正向资格 / 制品结论 | `GateEvaluation`、`EligibilityDecision`、`ArtifactHandoffRecord`、provenance 与供给前置；受 `Q-MI-004`、`MI-UP-007` 影响 | applicable gate 由正式 authority 决定，missing / failed / conflict / unknown 均不通过；image eligibility 与 Artifact formalization 分开，正式 handoff contract 缺失时只记录 pending / gap。 |
| `R-HLD-MI-006` Pinned entry 被误解为 Member Service / container readiness | `InstantiableEntry`、`ResolveInstantiableEntry`、consumer gap、availability history 与下游状态归属；受 `MI-UP-001` 影响 | 本仓只提供 immutable entry 或 unavailable / contract-gap；不声明 resolve confirmation、launch、health、session 或 container lifecycle 成功，consumer observed state 不反写 image availability。 |
| `R-HLD-MI-007` Projection / cache / manifest view 演化为第二 truth | `ImageDerivedReadModel`、catalog / manifest / trace / gap views、查询 freshness 与 rebuild 流 | 派生视图只读、可重建并显式 watermark / freshness；stale / rebuilding / unavailable 不隐藏，projection、cache 或 fake 不得参与核心写入判断。 |
| `R-HLD-MI-008` Pending scope / 产品通过接口或配置被提前激活 | Restricted / multi-arch / hardened base / outbound event，以及 builder / registry / evidence 产品绑定、接口集合和完成分母 | `Q-MI-001~003`、`MI-UP-008~009` 保持 conditional / future / absent authority；配置只能绑定已获准的 adapter / profile，不能创造 owner、scope、event authority 或 readiness。 |

## 6. 设计待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `MI-UP-001` Member Service exact manifest / variant / ref / qualification / confirmation contract | `MemberServiceSupplyPort`、`ResolveInstantiableEntry`、`InstantiableEntry`、`ConsumerHandoffGap` 与 consumer reconciliation | 等待双方正式文档共同校准；当前只提供 pinned entry 方向或 unavailable / contract-gap，不声明 resolve、launch、health 或 confirmation 成功。 |
| `MI-UP-002` Member component release shape 与 compatibility owner contract | `ComponentPinSet`、`AssemblyBaseline`、revision completeness 与 component reference adapter | 只接受正式 pinned release ref 和 safe compatibility context；exact shape / report / readiness 缺失时 baseline incomplete / blocked。 |
| `MI-UP-003` Method Library Role -> variant 的 body-free query / snapshot surface | `MappingSourceSnapshot`、mapping reference port、definition / revision 流与 dependency classification | 固定 mapping owner、runtime + ref、source validity 与 no fallback；不复制 mapping body，不定义 positive query schema。 |
| `MI-UP-004` Core image-specific shared contract 的正式接受范围 | Compile whitelist、Command / Event 公共 carrier、ref / error shared type 边界 | 仅使用已正式认定 Core contract；其余保持仓内私有语义，不建立 shadow shared schema。 |
| `MI-UP-005` Inbound build event authority、family、schema 与 source contract | Conditional event consumer、event-to-intent 流、idempotency / correlation 与 error mapping | Event lane 保持 unavailable / rejected；nightly 主线不取消；unknown event arrival 不产生 intent 或 candidate。 |
| `MI-UP-006` Policy / memory / workspace seed 的 semantic owner、template ref 与 placement contract | `SeedPlacementBinding`、baseline completeness、static / live guard 与 seed adapter | 只承接 owner-neutral pinned template ref / static placement；semantic body、secret 与 live state 外置，缺 owner contract 时 baseline incomplete。 |
| `MI-UP-007` Artifact image handoff 条件、schema 与正式 consumable ref | `ArtifactHandoffPort`、`ArtifactHandoffRecord`、eligibility-to-handoff 流与 reconciliation | 只表达 candidate handoff intent / record / gap；不自造 ArtifactVersion、lineage、formal ref 或 handoff success。 |
| `MI-UP-008` Hardened base 的 current scope 与 Sandbox / base authority | Variant derivation、base ref、qualification 与完成分母 | 保持 future-only，不创建 current object、接口、状态或资格条件；即使未来启用也不拥有 Sandbox policy / backend。 |
| `MI-UP-009` Outbound build / publish event 的 authority、family 与 schema | Outbound Event 接口分类、availability transition 后续交互与 delivery history | 当前明确无 outbound event capability；availability 不等于 notification，正式 authority 出现后需重开 Step 7~9。 |
| `Q-MI-001` Restricted / read-only variant 是否进入当前 scope | Variant identity、derivation、gate applicability 与 Role / governance boundary | 保持 conditional，不枚举 Role、不改变 governance truth、不进入当前核心能力或完成分母。 |
| `Q-MI-002` Multi-architecture 是否成为 active variant identity dimension | `ImageVariantDefinition`、`BuildInputSnapshot`、candidate / entry identity 与 availability query | 当前只保留单一受控 dimension 和平台中立接口；不预设 architecture enum、覆盖率或完成率。 |
| `Q-MI-003` Builder / registry / evidence backend 的具体产品与部署绑定 | Ports / adapters、配置影响轮廓、external outcome mapping 与 04 输入 | 保持 product-neutral adapter / carrier；产品、供应商、endpoint、credential ref 与部署形态在正式 authority 后由 04 承接。 |
| `Q-MI-004` BOM / scan / signature 等 applicable evidence inventory 与 gate priority | `ApplicableGateGuard`、`GateEvaluation`、eligibility 与 provenance query | 只要求 authority-driven applicable gate 不可绕过；不枚举 kind / priority，不声明 evidence、pass、digest、report 或 readiness 事实。 |

## 7. 当前设计层未闭环项与 03 推进上限

| 类别 | 是否阻塞进入 03 | 允许继续 | 禁止继续 |
|---|---|---|---|
| `R-HLD-MI-001~008` | 不整体阻塞；约束对应设计车道 | 展开本仓 invariant、neutral port、negative / gap result、history、freshness、unknown recovery 和 fake parity | 取消 guard、合并 truth、把 adapter / projection 当成功，或用 03 私有约定关闭风险 |
| `MI-UP-001~007` | 条件阻塞相应 exact positive lane | 设计 typed ref 类别、contract status、blocked / unavailable / gap、safe conclusion 与重开点 | Exact external DTO / route / topic / success mapping、外部 ref mint、compatibility / confirmation / handoff 成功 |
| `MI-UP-008~009` | 阻塞 current active expansion | 记录 current absence、future trigger 与回退 / 重开位置 | Hardened-base active structure、outbound event handler / delivery state 或 current acceptance |
| `Q-MI-001~004` | 条件阻塞范围 / 产品 / gate 细节 | 维持 conditional、product-neutral、authority-driven boundary | Active restricted / multi-arch dimension、产品绑定、gate inventory / priority 与 positive evidence claim |

当前概要可以在 product-neutral、fail-closed、gap-visible 的结构上收口；这不表示任何 positive integration 已准备就绪。进入 03 后若需要改变五个主要部分、关键对象、接口分类、状态轴或上述挂起上限，必须先退回 02，而不能由详细设计单方面补定义。

## 8. 非风险 / 非待确认排除审计

| 被排除内容 | 原因 | 正确去向 |
|---|---|---|
| 完整字段、serialization、repository / UoW、错误码、retry / timeout | 是详细设计展开内容，不是未决风险 | 正式 03 |
| 配置 key、source、default、profile、产品绑定 | 是配置契约；其中产品 authority 仍由 Q-MI-003 挂起 | 正式 04 |
| 测试 case、fixture、coverage、执行结果 | 是验证设计或真实执行证据，不是概要风险 | 正式 05 / 06 与真实执行 |
| 实施阶段、commit boundary、排期、负责人 | 是计划 / 项目管理内容 | 正式 07；当前不得伪造 |
| 已稳定的五个主要部分、对象、接口分类与状态轴 | 已在 Step 4~12 收稳，不应退化为待确认 | 正式 02 第 4~12 章 |
| 上游 / sibling 的实现、commit、run、test、evidence、readiness | 不构成本仓概要设计 authority | 不进入本概要 positive fact |

## 9. 回填草稿

正式第 13 章使用 §5 三列表和 §6 三列表，并保留 §7 的最小推进上限说明。§2~§4 与 §8 留在 calibration 作为判定与审计依据，不把过程诊断搬入正式正文。

## 10. 完成审计与下一步门禁

| 检查项 | 结果 |
|---|---|
| 风险与待确认是否分开 | `pass` |
| 风险是否均影响概要主线、对象、接口、流、状态或边界 | `pass` |
| MI-UP-001~009、Q-MI-001~004 是否全部保留且未伪关闭 | `pass` |
| 三个并行项目的进行中内容是否仅作 pending | `pass` |
| 是否说明进入 03 的条件阻塞上限 | `pass` |
| 是否排除任务、实现、测试、证据、readiness 与已稳定承接项 | `pass` |
| 是否仍未读取旧正式 02、未创建 Step 14 | `pass` |

`gate_status = pass_stop_review`。Step 13 已满足进入 Step 14 的内容门禁；下一动作是先更新 flow / project ledger，再读取 Step 14 SOP 与书写规范，之后才可创建 `02_hld_step_14_formal_document_assembly.md` 并开放旧正式 02 的后置历史污染审计。
