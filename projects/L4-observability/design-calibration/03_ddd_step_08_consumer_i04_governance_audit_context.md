# L4-observability 03-详细设计 Step 08 - S08-E Consumer I04 `ConsumeGovernanceAuditContext`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 当前模式: full-restart / affected-only rebuild
> 当前批次: S08-E Consumer I04 §17（final stop review；完成后停审）
> 回填目标: `03-详细设计.md` §7；正式文档只允许在 Step 19 重新装配

## 1. Step 开工确认与当前状态

| 项目 | 记录 |
|---|---|
| Step | Step 08 `定义 API / Command / Query / Event / Job 协议契约` |
| 协议族 / 编号 | Inbound Event Consumer / I04 of 9 |
| 逻辑协议 | `ConsumeGovernanceAuditContext` |
| 输出文件 | `design-calibration/03_ddd_step_08_consumer_i04_governance_audit_context.md` |
| 已读取通用规范 | yes；通则、中间产物规范、真相源闭环标准、依赖裁剪规则 |
| 已读取文档类型规范 | yes；详细设计 SOP Step 08、详细设计书写规范 §5.6/§5.7 |
| 已读取前序输入 | yes；current `project_execution_ledger.md`、`03_ddd_calibration_flow.md`、I03 final stop review、Step 06 I04 concrete-input use-site/三个候选字段/六个control fields、Step 07 exact callable与resolver/port surface、S08 shared Consumer carrier |
| 上游专项读取 | yes；L1-governance current HLD、Step 08 outbound envelope、十三个event kind/payload/version/topic registry及面向Observability的边界声明 |
| 当前模式 | full-restart / affected-only rebuild |
| 模块骨架 | done；本文件只覆盖 I04，不覆盖 I05~I09、Outbound Event、Job 或 Step 09 |
| 思考记录 | done for §1~§17；§17只汇总§1~§16已建立的authority、schema/input、truth/UoW/result、telemetry/audit、affected与handoff结论，不新增owner、协议字段、runtime branch或closure claim |
| 写入记录 | 已写入 §1~§17；I04形成可独立计数的`defined_with_affected_open`协议记录。11项专属与8项shared/cross-protocol affected保持原状态；current slot仍未激活，Step09 flow、实现与验证均未进入 |
| 自检状态 | `defined_with_affected_open`；I04独立设计记录完成但不是无条件complete或implementation-ready，canonical payload、finite producer binding、完整input、唯一durable landing、最小依赖切片、shared completion/recovery surface及exact action mapper仍由具名affected承接 |
| gate status | `Step08_S08-E_I04_defined_with_affected_open_waiting_user_before_I05` |
| 正式 `03` | frozen；本批不回填 |
| 当前提交 | 不需要；用户未要求提交 |

I04 的本地目标边界是：接收经认证的 Governance 协作事件，把其中允许的
body-free evidence/reference observation 转换为 Observability 自有的观测与审计
投影输入。它不拥有 Governance context、gate、decision、policy、control、review、
compliance conclusion、nonconformity、trace 或 derived view truth，也不允许通过
消费结果反写这些 truth。

当前只能安全确认以下既有定位，不能据此反推尚未存在的上游协议：

| 定位项 | current 已有事实 | 本节限制 |
|---|---|---|
| logical binding | `InboundEvent / ConsumeGovernanceAuditContext` |
| expected producer family | `ObservationProducerFamily::Governance`；只表示受认证协作 namespace，不证明事件内容正确 |
| local payload use-site | `ObservationInboundEventEnvelope<GovernanceAuditContextPayload>`；仅为 Observability use-site，不是上游 canonical declaration |
| local application input use-site | `ConsumeGovernanceAuditContextInput`，当前摘要列出`governance_evidence_ref`、`digest_summary`、`visibility`及六个shared control fields；本节不确认其wire schema或authority |
| exact assembler | `ObservationInboundInputAssembler::consume_governance_audit_context` |
| exact service | `ObservationInboundEventService::consume_governance_audit_context` |
| Step 09 reservation | `ConsumeGovernanceAuditContextFlow`；本节不展开函数级flow |
| local truth boundary | body-free evidence/reference observation surface；不拥有或修改 Governance business truth |

### 1.1 本批禁止事项

- 不读取或写入 I04 §2以后内容、I05~I09、S08-F/G、Step 09~19、正式`03`、任何`04`文件或实现代码。
- 不把 L1-governance 的十三个具体 outbound event 合并为一个虚构的`GovernanceAuditContextPayload`，也不自行选择其中任意事件作为I04唯一producer event。
- 不从十三个事件payload做字段并集、按名称相似度拼装`governance_evidence_ref`，或创建未由producer注册的兼容event/schema。
- 不让 Governance producer直接构造完整`GovernanceArtifactEvidenceReference`；该对象含Observability本地生成identity、snapshot state reference、local state及gap/visibility reason，外部producer无此authority。
- 不把`digest_summary`与reference内部可选digest默认为同一authority，也不在§1裁定保留、删除或覆盖关系。
- 不把`VisibilitySurface`直接当作Governance business truth或最终read authorization；其inbound authority与narrowing规则留待后续逐字段审查。
- 不保存 Governance event/body、decision/policy/control/review/conclusion/nonconformity/trace/view body，不伪造真实evidence alias、verdict、signoff、run id、测试结果或验收签署。
- 不因上游契约缺失而使用ref prefix、event name、route、timestamp、digest、visibility或error text推导业务truth、source event binding或本地reference identity。

### 1.2 开工冲突与 affected 登记

| ID | 状态 | §1发现 | 必须由谁关闭 | 当前禁止替代 |
|---|---|---|---|---|
| `S08-E-I04-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | L1-governance current材料未声明`GovernanceAuditContextPayload`的canonical owner、wire schema、encoder或schema/discriminator registration；该名称只出现在Observability use-site | L1-governance或明确的跨项目contracts owner提供唯一payload声明与兼容注册；Observability随后只消费该owner | 从本地三个候选字段反推wire payload、创建同名alias或接受结构相似body |
| `S08-E-I04-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | L1-governance实际声明十三个具体outbound event，但没有有限映射说明哪些event进入I04、如何转换、如何绑定schema/version与source identity | L1-governance提供有限event-to-I04 binding/adapter contract，或正式裁定I04拆分为具体consumer；缺失时I04 admission必须fail closed | 把十三事件全部订阅、任选一个、按名字或字段并集映射，或由Observability自行制造aggregate event |
| `S08-E-I04-REFERENCE-AUTHORITY-01` | `open_internal_affected` | `GovernanceArtifactEvidenceReference`含本地`boundary_ref_id`、`reference_snapshot_state_ref`、state及gap/visibility reason；外部Governance producer不能合法构造完整本地对象 | Step 06/07修订I04 boundary DTO与assembler relation：上游只给最小body-free source refs，Observability在授权lookup/factory中构造或解析本地reference | 直接反序列化完整本地对象、信任producer提交的local refs/state/reason、临时mint或按digest/ref prefix绑定 |

这三项不阻止记录I04开工，但阻止进入“schema已定义”或“协议可实现”状态。
其中前两项是本轮新发现的上游内部 blocker；第三项是本仓Step 06/07需要修订的
authority affected。现有I03与项目级blocker保持原状态，没有被本节关闭。

`digest_summary`的唯一语义来源及其与reference内optional digest的关系、
`VisibilitySurface`是否允许作为inbound producer observation以及如何收窄，当前只登记为
§2必须回答的问题；在读取字段owner与上游event payload前不提前分配额外affected ID。

### 1.3 §1 历史停审与读取边界

本节完成后立即停审。当前协议计数保持`33/60 defined_with_affected_open`，Query
`14/14`、Consumer `3/9`，`0/60`无条件complete；I04在该历史checkpoint仍为
`in_progress_S01`。

用户确认后，§2只允许读取并形成“本批输入与权威关系”：

1. `详细设计讨论流程_SOP.md` Step 08与`详细设计书写规范.md` §5.6/§5.7中关于Consumer输入、字段来源和上游契约的要求。
2. current Step 06的I04 concrete input/control-field owner、`GovernanceArtifactEvidenceReference`、`DigestSummary`、`VisibilitySurface`对象卡与factory/use-site。
3. current Step 07的I04 assembler/service及可用resolver/repository/dependency surface，不展开Step 09 flow。
4. L1-governance十三个outbound event的canonical payload/source/version registry及面向Observability的subscriber声明，只判断authority与冲突，不拼装新schema。

该历史恢复点为：

```text
Step08_S08-E_I04_S01_recorded_with_affected_open_waiting_user_before_I04_S02
```

该门禁已由用户确认解除，并由下方§2 current checkpoint承接；不得再用本段
`before_I04_S02`状态覆盖§2完成后的恢复点。

## 2. 本批输入与权威关系

### 2.1 实际读取的输入

| 顺序 | 输入 | 本批实际消费内容 | 权威限制 |
|---:|---|---|---|
| 1 | `详细设计讨论流程_SOP.md` Step 08 | 逐协议回答、Inbound envelope/receipt字段级schema、字段来源与目标对象映射、缺失处理和逐批停审 | §2只确定输入authority；不提前回答SOP 23问或写函数级flow |
| 2 | `详细设计书写规范.md` §5.6/§5.7 | Consumer必须分别定义公共envelope与typed payload；payload不得复制header；每个字段必须回指domain、system-derived或upstream contract owner | use-site、trait参数或类型名不能代替canonical schema/owner |
| 3 | `设计真相源闭环与可落码性标准.md`及依赖裁剪规则 | external ref provenance、actor authority、body-free boundary、owner唯一性与不反写source truth | authority缺失必须fail closed；不通过跨仓源码依赖或本地alias补洞 |
| 4 | Step 06 `contracts_carriers`对象卡 | `GovernanceArtifactEvidenceReference`的本地identity/snapshot/state/reason字段；`DigestSummary`的body-free material语义；`VisibilitySurface`的public output语义与factory矩阵 | 三个类型均由Observability owner定义；外部producer只有在明确字段级contract授权时才能提供其允许的输入部分 |
| 5 | Step 06 `application_input_assembly_r06_8a` | I04 application input use-site的三个业务字段、六个Consumer control fields及matching assembler；assembler同步且I/O-free | family row不是concrete struct、constructor或字段accessor证明，也不提供外部event到本地字段的转换owner |
| 6 | Step 07 trait/port/adapter契约 | `consume_governance_audit_context` assembler/service签名，以及现有reference/safe-summary resolver与repository surface | callable只证明调用槽存在；签名不拥有payload schema，也没有I04专属digest/visibility转换依赖 |
| 7 | Step 08 shared Consumer carrier | `ObservationInboundEventEnvelope<T>` header、header-before-payload校验、trusted actor来源、schema/version与source-event identity规则 | shared carrier不授权把Governance outbound envelope字段按相似名称直接转换为本地header/control fields |
| 8 | L1-governance current HLD | Governance拥有治理追溯事实与交接材料；Observability拥有物理观测/审计投影；接收方不得反向定义Governance truth | HLD只固定方向和truth边界，不定义I04 wire payload或event adapter |
| 9 | L1-governance Step 08 outbound registry | 十三个独立v1 event、typed payload、stored outbound envelope、topic key及source cursor；其中HLD明确面向Observability的候选为`NonconformityChanged`与`GovernanceTraceAvailable` | 两个候选payload形状不同，且均不提供I04三个本地候选字段；不能自行合并、任选或做字段并集 |

本批没有读取I05~I09、S08-F/G、Step 09、任何`04`文件或实现代码。冻结的正式
`03`与旧README只保留为historical material，不参与覆盖上述current owner。

### 2.2 分域权威关系

#### 2.2.1 Owner 与转换边界

| 分域 | 唯一拥有的事实 / schema | 可交给I04的最小信息 | 明确不拥有 |
|---|---|---|---|
| L1-governance | 十三个event kind、各自typed payload、`GovernanceEventSchemaVersion`、stored outbound envelope、source cursor/topic binding及Governance truth refs/state | 只有被有限subscriber/binding contract明确选择的event metadata与body-free refs；当前尚未形成该contract | Observability `consumer_name`、dedup identity、本地reference identity/snapshot/state、local digest profile、public visibility result |
| 跨项目event binding / adapter owner | producer event到consumer slot的有限映射；event identity、schema/version、source/version、occurred-at/dedup所需metadata的无损转换 | 经认证并通过注册的`ObservationInboundEventEnvelope<...>` | 任意合并十三事件、解释Governance业务状态、制造不存在的aggregate payload |
| Observability `contracts` | shared inbound envelope、`GovernanceArtifactEvidenceReference`、`DigestSummary`、`VisibilitySurface`及public wire/result vocabulary | 只暴露已由canonical upstream contract或本地factory合法构造的typed值 | Governance event/payload定义与Governance truth正确性 |
| Observability application input assembly | matching operation、六个control fields、本地request digest/context及concrete input原子构造 | 从validated envelope和已授权本地转换结果形成`ConsumeGovernanceAuditContextInput` | I/O lookup、source truth、任意payload容错、transport action和业务默认值 |
| Observability resolver/repository/policy | 本地reference snapshot、gap/visibility decision、safe-summary或linkage relation的least-authority读取/构造 | service阶段可使用的typed lookup/decision；必须由I04专属dependency surface明确授予 | 修改Governance truth、读取Governance正文、让assembler隐式访问repository |
| Step 07 callable surface | assembler/service方法名、输入输出边界与调用方向 | 仅证明I04存在matching application slot | payload schema、字段authority、event adapter或缺失值默认规则 |

当前不存在一个owner同时负责“Governance具体event -> I04 canonical payload ->
Observability concrete input”的完整转换链。该空缺由既有
`S08-E-I04-PAYLOAD-SCHEMA-01`与
`S08-E-I04-PRODUCER-EVENT-BINDING-01`承接；I04不能在本仓把两层缺口合并为一个
临时adapter。

#### 2.2.2 Governance outbound 与 I04 header 不可按名映射

| Governance outbound字段/事实 | I04候选位置 | §2裁定 |
|---|---|---|
| `event_kind` + typed `payload` | consumer slot + typed payload | 必须有有限event-to-I04 registration；不能以event name相似度选decoder |
| `event_version` | `schema_version` | 两者属于不同owner/type；只有binding contract可做显式兼容映射，不能直接cast或默认`V1` |
| `outbox_ref` | `source_event_ref`候选 | 语义可能相关但当前无正式映射；不得把outbox identity、topic或trace当source-event identity |
| `subject_ref` / payload refs | `source_ref`或最小external ref候选 | 必须按具体event定义typed relation；不得由ref prefix或通用`ExternalObjectRef`擦除类型后接受 |
| `source_cursor` | `source_version_ref`候选 | cursor与source version明确不同；无typed adapter/comparator时不得转换、排序或以时间替代 |
| `trace_ref` / `core_trace_id` | `trace_ref`候选 | 只能由shared trace contract规定无损映射；不能合并两个trace identity或从payload重建 |
| `topic_key` | transport locator | 仅用于publisher/config binding；不得进入payload、request digest、source identity或business truth |
| 未声明的dedup/occurred-at/actor | `dedup_key`、`occurred_at`、trusted `actor_ref` | 必须由认证entry/binding明确提供；不得从outbox ref、cursor、trace、arrival time或payload actor-like字段推导 |

`NonconformityChangedPayload`只携带nonconformity/context/state、可选action/
verification ref和source cursor；`GovernanceTraceAvailablePayload`只携带trace subject/ref/
kind、可选handoff marker/source cursor。二者既不是同一schema，也都没有
`GovernanceArtifactEvidenceReference`、`DigestSummary`或`VisibilitySurface`。因此本批
没有关闭任何上游blocker，也没有把这两个event裁定为I04的并集producer。

#### 2.2.3 I04候选字段的authority裁定

| I04候选字段 | current owner事实 | 合法来源要求 | 当前结论 / 禁止替代 |
|---|---|---|---|
| `governance_evidence_ref: GovernanceArtifactEvidenceReference` | Observability本地对象；包含local `boundary_ref_id`、snapshot state ref、state、gap/visibility reason及可选digest | 上游只能给canonical最小body-free family/ref/digest observation；本地service经授权lookup/factory生成或解析完整reference | `S08-E-I04-REFERENCE-AUTHORITY-01`保持开放；不得直接反序列化producer提交的完整对象、临时mint本地ref或信任其state/reason |
| `digest_summary: DigestSummary` | Observability `contracts::refs`的语义摘要；只允许canonical body-free material、stored public snapshot、structured outcome或external intent material | 必须选择且唯一声明：消费上游canonical digest，或由本地canonicalizer按固定profile/字段顺序从最小body-free refs生成；并定义其与reference内optional digest的相等/缺失/冲突规则 | 新增`S08-E-I04-DIGEST-AUTHORITY-01`；不得hash Governance payload/body、event bytes、topic、timestamp或refs的debug/string形式，也不得默认复制reference内optional digest |
| `visibility: VisibilitySurface` | Observability public response surface；对象卡明确由domain/application assembler lossless映射，query caller不可传入 | 必须由本地policy/decision与真实gap/degraded source生成；若producer需要表达自身可见性，只能使用另一个上游owned observation type并由本地规则收窄 | 新增`S08-E-I04-VISIBILITY-AUTHORITY-01`；不得接收producer构造的本地surface、默认`Visible`、用缺失表示visible或把Governance state当read authorization |

#### 2.2.4 六个Consumer control fields

| control field | authority | 当前构造规则 | §2结论 |
|---|---|---|---|
| `context` | application-private `ObservationOperationContextFactory::for_inbound_event` | matching assembler使用固定operation、trusted actor、validated producer/source-event、dedup、request digest与trace一次性构造 | producer/payload不得提交或修改；concrete I04 input尚缺exact字段/constructor/accessor证明 |
| `request_digest_candidates` | application-private canonicalizer | 对validated header与canonical typed payload按唯一profile一次生成，write digest必须与context一致 | payload schema/binding未闭合前无法形成合法候选；不得hashraw envelope或使用Governance digest代替request digest |
| `source_ref` | validated shared envelope，经有限producer/source binding认证 | 保留source identity，不从payload ref、subject、topic或actor推导 | Governance outbound到本地source的映射仍由producer-event binding blocker承接 |
| `source_version_ref` | validated shared envelope中的optional typed source version | 出现时producer/source必须与envelope逐字段一致；只由typed relation比较 | Governance `source_cursor`不得直接cast；无mapping时fail closed |
| `schema_version` | registered I04 consumer schema slot | header先校验，unknown/unsupported时不decode payload、不reserve | Governance event version只有经显式adapter才可映射；不得取current default |
| `occurred_at` | authenticated event binding提供的event occurrence observation | 仅作观测时间，不参与source-version排序、identity或digest material | Governance outbound current envelope未提供该字段；不得用arrival/local clock/source cursor替代 |

Step 06只声明六个字段“物理重复于每个Consumer input”，Step 07只暴露matching
assembler/service方法；当前没有可定位的`ConsumeGovernanceAuditContextInput`完整struct、
`from_assembled(...)`参数表及crate-private读取面。因此新增
`S08-E-I04-CONTROL-FIELD-SOURCE-01=open_internal_affected`。该项只审计validated
envelope到local concrete input的传播；它不替代跨项目event binding blocker。

#### 2.2.5 §2 affected增量与停审

| ID | 状态 | 本批发现 | 关闭条件 | 当前禁止替代 |
|---|---|---|---|---|
| `S08-E-I04-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | 六个control fields只有family-level清单与构造规则，没有I04 concrete struct/constructor/accessor的完整传播证明 | Step 06/07补齐exact private fields、`from_assembled`参数与validation/accessor，并静态证明entry/service不能重构或覆盖字段 | generic map、entry-side context/digest构造、payload字段回填header或service按需猜值 |
| `S08-E-I04-DIGEST-AUTHORITY-01` | `open_internal_affected` | 两个面向Observability的Governance候选event/payload均不提供I04语义digest；本地也没有I04专属canonical material/profile及与reference optional digest的关系 | 唯一owner选择upstream canonical digest或local canonicalizer路径，固定material/profile/order、absence/conflict与single-computation规则 | raw body/event bytes/debug string hash、timestamp/topic hash、复制optional digest或空digest |
| `S08-E-I04-VISIBILITY-AUTHORITY-01` | `open_internal_affected` | `VisibilitySurface`是Observability response mapping，但I04 input row把它列为producer-facing required field；assembler无I/O，当前也无I04专属policy dependency | Step 06/07移除producer-owned local surface或引入独立upstream observation DTO，并由service的最小policy/gap dependency lossless生成本地surface | producer提交local surface、默认Visible/Restricted、absence-as-visible、state/event-name推导授权 |

§1既有三项affected继续开放，本批新增三项本仓affected；没有发现新的外部上游
blocker，也没有关闭`S08-E-I04-PAYLOAD-SCHEMA-01`或
`S08-E-I04-PRODUCER-EVENT-BINDING-01`。当前协议计数保持
`33/60 defined_with_affected_open`，Query `14/14`、Consumer `3/9`、`0/60`无条件
complete；I04状态为`in_progress_S01-S02_with_affected_open`，仍不计入defined。

本节完成后立即停审。用户确认后，下一步只允许进入I04 §3，读取Step 08 SOP的
23问、shared Consumer carrier、§1~§2 authority裁定与既有I04 use-site，逐问形成
I04回答；不得进入payload schema、函数级flow、I05~I09、S08-F/G或Step 09。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S02_recorded_with_affected_open_waiting_user_before_I04_S03
```

该门禁已由用户确认解除，并由下方§3 current checkpoint承接；不得再用本段
`before_I04_S03`状态覆盖§3完成后的恢复点。

## 3. Step 08 SOP 23 问回答

本节只负责把 Step 08 的 23 个问题逐项落到 I04。回答分为三类：已经由
§1~§2和shared Consumer契约固定的边界、当前明确不适用于Inbound Consumer的
Query问题，以及必须由既有affected或后续I04小节继续闭合的问题。目标态回答不等于
canonical schema、函数级flow或实现已经存在。

| # | SOP 问题 | I04 当前回答 | disposition / 依据 |
|---:|---|---|---|
| 1 | 本轮需要定义哪些 API / Command / Query / Event / Job？ | 本轮只定义Inbound Event Consumer `ConsumeGovernanceAuditContext`；不展开I05~I09、Outbound Event、Operations Job或其他协议。 | `recorded`；协议库存与本文件边界一致。 |
| 2 | 这些协议应按哪个协议族或所属模块分批定义？ | 归属S08-E Inbound Event Consumer；调用链限定为authenticated worker entry -> matching inbound assembler -> `ObservationInboundEventService`。不另建admin/internal副本。 | `recorded`；shared family binding与Step07 exact callable可定位。 |
| 3 | 每个协议的调用方、处理方、传输方式是什么？ | producer侧调用方是经认证的Governance协作事件binding/adapter，不是Observability对Governance代码的直接调用；worker exact callback调用assembler，application service处理concrete input。具体Governance event到I04的选择仍未定义。 | `affected_open`；`S08-E-I04-PRODUCER-EVENT-BINDING-01`。 |
| 4 | 外部接口使用 HTTP、RPC、event bus 还是其他方式？ | 使用typed asynchronous event delivery/completion的逻辑边界；topic、endpoint、credential、subscription locator与transport产品归entry/config binding，不进入I04 payload或identity。Governance现有topic registry不自动构成I04 subscription。 | `recorded_with_binding_open`；不猜产品，event registration仍受producer-binding affected约束。 |
| 5 | 请求、响应、事件或 job 输入输出 schema 是什么？ | 入口目标是shared `ObservationInboundEventEnvelope<GovernanceAuditContextPayload>`，输出目标是shared `ObservationConsumerResult`再映射stored/ephemeral Consumer receipt；但`GovernanceAuditContextPayload`只有Observability use-site，没有canonical declaration、encoder或schema registration，本节不得反推字段。 | `affected_open`；`S08-E-I04-PAYLOAD-SCHEMA-01`，shared result/receipt只作目标surface。 |
| 6 | 每个输入契约会构造或影响哪些 Domain 对象？ | I04只允许构造或影响Observability自有的body-free governance evidence/reference observation及其本地projection/result关系；不得构造或改变Governance context、gate、decision、policy、control、review、conclusion、nonconformity或trace truth。完整`GovernanceArtifactEvidenceReference`必须由本地授权lookup/factory形成，不能直接来自producer。 | `affected_open`；目标边界已固定，exact local construction由`S08-E-I04-REFERENCE-AUTHORITY-01`及后续对象映射小节闭合。 |
| 7 | 目标对象的必填字段是否全部能从输入、派生、查表或系统生成中获得？ | 否。六个Consumer control fields尚缺I04 concrete struct/constructor/accessor传播证明；完整local reference、semantic digest和local visibility也没有合法完整来源链。缺口关闭前不能构造accepted input。 | `affected_open`；control-field、reference、digest、visibility四项本仓affected。 |
| 8 | 哪些字段名相近但语义不同，不得混同？ | Governance `event_version`不等于I04 `schema_version`，`source_cursor`不等于`source_version_ref`，`outbox_ref`不自动等于`source_event_ref`，producer trace不自动等于local `trace_ref`；Governance digest、I04 semantic digest、request digest互不替代；Governance state/visibility observation不等于local `VisibilitySurface`；upstream ref不等于完整local evidence reference；arrival time不等于`occurred_at`。 | `recorded`；§2.2.2~§2.2.4，禁止按名称cast或fallback。 |
| 9 | 字段缺失时是 reject、derive、lookup、retry、dead-letter 还是暂停处理？ | missing/malformed required header在payload解析前reject；unknown/unsupported schema不decode、不reserve；缺canonical event binding或payload owner时fail closed；local reference/digest/visibility只允许经具名owner derive/lookup。暂态lookup、retry与dead-letter只能由后续typed error/recovery/action矩阵裁定，不能用默认值或通配action。 | `target_recorded_detail_pending`；现有六项I04 affected保持开放，§12~§13再闭合错误与action。 |
| 10 | 当前协议族完成后，每个 DTO / Event / Job 是否能回指 Step 6 对象、Step 7 port 和 Step 9 处理流？ | I04 use-site可回指Step06 input/object owner、Step07 matching assembler/service和唯一`ConsumeGovernanceAuditContextFlow` reservation；但payload owner、event binding、local construction与结果传播未闭合，因此当前不能判pass。 | `affected_open`；不是protocol-to-flow闭环完成声明。 |
| 11 | Query 的 response view、page、projection marker 是否有字段级 schema？ | `not_applicable`；I04不是Query，不定义view/page/projection marker。Consumer receipt不能冒充Query response。 | `not_applicable_by_family`。 |
| 12 | Query 的 empty、not visible、stale、failed、rebuilding、disabled、missing state 对外 surface 是什么？ | `not_applicable`；这些Query presence/read-state问题不由I04定义。I04的Consumer outcome/receipt分支在问题18及后续结果小节处理。 | `not_applicable_by_family`。 |
| 13 | Query response 中 read model / projection / cursor 的 id/ref 如何生成，repository key 是什么？ | `not_applicable`；I04不生成Query read-model identity或page cursor。`source_event_ref`、local reference identity与idempotency identity保持独立，不能被当作repository/page key。 | `not_applicable_by_family`。 |
| 14 | Query response 字段引用的 enum / ref 是否归属到 contracts shared，或是否写明 domain 到 view 的正式映射？ | `not_applicable`于Query response；I04自身public enum/ref/helper的owner问题由问题17审查，不能借本题跳过。 | `not_applicable_by_family`。 |
| 15 | Query / repository 使用的 page helper 是否有 schema、归属和 public page DTO 映射？ | `not_applicable`；I04没有page request、cursor或page DTO。 | `not_applicable_by_family`。 |
| 16 | HLD `*Query`、DDD `*Request`、Rust DTO 名称是否存在收敛映射？ | `not_applicable`于Query命名；I04仅保留`InboundEvent / ConsumeGovernanceAuditContext`到matching payload use-site、input、assembler、service和flow reservation的有限命名链。 | `not_applicable_by_family`；有限I04命名链尚受payload owner affected约束。 |
| 17 | Command result、event payload、consumer envelope / receipt、job report中引用的enum / ref / helper是否都有schema和归属？ | shared Consumer envelope/receipt、operation、producer、source-event与public error surface已有owner；I04 payload没有canonical owner，完整local reference不能由producer构造，digest与visibility authority未闭合。因此I04目前不满足本问。 | `affected_open`；六项I04 affected与shared Consumer result/outbox等既有affected继续承接。 |
| 18 | Inbound consumer 的 envelope、receipt、duplicate、quarantine、delayed、no-op marker 是否有字段级 schema？ | shared carrier已固定header-before-payload、stored/ephemeral receipt及outcome presence规则；duplicate只能是`Replayed` access overlay，不新增`Duplicate` outcome；不得创建无owner的`QuarantineRef`。I04-specific payload、stored result映射、quarantine/delayed/no-op reachability和C-05 action仍未逐分支定义。 | `target_recorded_detail_pending`；不把shared carrier误报为I04 totality。 |
| 19 | 每个 command / event / job 的 actor 是 participant、system、integration 还是 trusted source actor？是否必须在participant / visibility scope中？ | I04 effective actor是C-03 authenticated worker delivery提供的trusted source actor，不来自payload，也不因Governance subject/author/ref而变成participant。该actor只用于local operation/idempotency/audit attribution，不授予Governance或read visibility authority。 | `recorded`；exact actor kind token仍复用C-03 owner，不新建I04 actor enum。 |
| 20 | 如果存在 trusted source actor 例外，适用的 source kind、actor kind、入口协议和不可绕过的 gate 是否写清？ | 例外仅适用于static I04 slot、authenticated Governance producer family、registered concrete event/schema/source binding和matching worker callback；必须依次通过consumer、producer、source-event/source、version/schema、dedup/trace/time header gate后才可组装input。任何payload actor-like字段、topic、ref或Governance state都不能绕过。 | `target_recorded_binding_open`；event/schema registration仍由两项上游affected约束。 |
| 21 | 每个协议失败时映射成什么错误？ | 需要有限映射protocol/header、unsupported schema、producer/event binding、payload decode/authority、reference relation/lookup、digest/visibility mapping、idempotency、domain/UoW/commit错误；public surface不得携带Governance body、policy/decision文本、provider error或credential。exact precedence、recovery class与C-05 action留后续I04错误小节。 | `target_recorded_detail_pending`；本节不伪造完整error matrix。 |
| 22 | 哪些协议需要幂等键或审计记录？ | I04需要logical `(operation, trusted actor, dedup_key)`与secondary `(consumer, authenticated producer, source_event_ref)`边界及canonical request digest；replay只返回原stored surface。只有真实accepted的Observability本地变化才可形成其owner授权的durable audit/projection记录，不得把消费动作写成Governance audit truth或伪造evidence。exact record/UoW仍待后续小节。 | `target_recorded_detail_pending`；control/digest authority与shared idempotency/UoW affected保持开放。 |
| 23 | 所有协议族完成后，是否仍有public DTO缺schema、跨协议命名漂移、二级类型未归属或protocol-to-flow断裂？ | 当前不能判定完成。I04仍有六项专属affected且尚未形成完整协议记录；I05~I09、S08-F/G和60协议cross-protocol audit均未完成。 | `open`；计数保持`33/60 defined_with_affected_open`，I04不计入defined。 |

### 3.1 回答闭合度与 affected 路由

| 问题组 | 本节结论 | 后续唯一承接 |
|---|---|---|
| 1~4 scope / family / caller / transport | 协议边界与product-neutral async方向已记录；具体Governance event binding仍开放 | §4 finite binding；`S08-E-I04-PRODUCER-EVENT-BINDING-01` |
| 5~10 schema / target / source / missing / handoff | 只形成目标态和fail-closed条件，不能判schema或构造闭合 | §5~§10；六项I04 affected，不新增临时owner |
| 11~16 Query-only surface | 六问逐项`not_applicable_by_family`，没有用Consumer receipt替代Query contract | 无I04后续定义；Step08跨协议审计只核对未遗漏 |
| 17~18 public secondary types / Consumer carrier | shared carrier可复用，但I04-specific payload/result/reachability未闭合 | §6、§11~§13；payload与shared result/action affected |
| 19~20 actor / trusted-source exception | trusted actor来源与不可绕过gate的目标态已固定 | §4~§7传播exact binding与header来源 |
| 21~22 error / idempotency / audit | 分类边界已列出，exact precedence、record、UoW、recovery/action仍待逐节 | §8、§10~§14；不在§3发明record或mapper |
| 23 cross-protocol closure | 明确保持open | I04 §17后仍只计单协议；S08-G最终总审计 |

§3没有发现新的外部上游blocker，也没有关闭任何既有affected。两项
`open_upstream_internal`和四项`open_internal_affected`保持原状态；问题18、21、22
还消费shared Consumer result/outbox/quarantine/indeterminate、UoW与Step09既有affected，
但本节没有把“尚未进入后续分析”误登记为新的owner缺口。

### 3.2 Historical §3 stop review 与下一读取边界

| 检查项 | 结论 |
|---|---|
| 是否逐项回答Step08 SOP 23问 | pass at question-routing level；23项均有I04回答与disposition，Query专属11~16逐项标记not applicable |
| 是否把目标态误报为canonical schema或implementation-ready | no；5~10、17~18、21~22均明确保留affected或detail pending |
| Governance truth与Observability projection边界 | pass；没有把Governance decision/policy/control/review/conclusion/nonconformity/trace或event body变成本地truth |
| actor、identity、digest、visibility是否保持分离 | pass at target level；exact传播仍由既有affected承接 |
| 是否发现新的上游blocker或本仓owner gap | no；六项I04 affected原样保持，没有新增或关闭 |
| 当前协议计数 | 保持`33/60 defined_with_affected_open`；Query `14/14`；Consumer `3/9`；`0/60`无条件complete；I04为`in_progress_S01-S03` |
| 正式文档、实现、测试、evidence、run_id和验收签署 | 均未生成或声称；正式`03`继续frozen，验证为`not_run_not_claimed` |
| 下一动作 | 立即停审；用户确认后只进入I04 §4，读取shared finite binding、§1~§3 authority/问题裁定、Step06/07 exact use-site/callable及Governance event registry，只定义truth boundary和exact logical binding |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S03_recorded_with_affected_open_waiting_user_before_I04_S04
```

未经用户明确确认，不得进入I04 §4；不得读取或写入I05~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §3 的历史停审记录；§4 已由下方 current checkpoint 承接，不得再把
`before_I04_S04`当作当前恢复点。

## 4. Truth boundary and exact logical binding

本节只回答两个问题：I04能够承接哪一种Observability-owned observation，以及该
协议在本仓的有限逻辑绑定是什么。它不定义`GovernanceAuditContextPayload`字段、
decoder、具体输入构造、函数级处理流、UoW、receipt/result、C-05 action或Step 09
实现细节。所有“target”或“reservation”表述都不等于上游schema已经注册。

### 4.1 Owned and non-owned truth

| boundary | I04 §4 rule |
|---|---|
| producer namespace | `ObservationProducerFamily::Governance`只表示经认证的Governance协作来源命名空间；它不是Governance context、decision或evidence正确性的证明，也不授予本地写入权限。 |
| admitted observation | I04最多承接经过注册和redaction约束的body-free evidence/reference observation：typed reference、允许的digest/linkage observation与有限visibility/gap observation。Governance正文、decision文本和trace正文不进入本地输入。 |
| local owned truth | Observability自有的evidence/reference observation、其本地reference snapshot/state/relation、canonical digest summary（仅在唯一authority闭合后）、local visibility/gap projection、Consumer idempotency/result/receipt以及由本地对象变化授权的audit/projection marker。它们描述观测侧状态，不描述Governance业务状态。 |
| evidence linkage | I04可以保存或关联一个Observability-owned evidence/reference link，用于后续审计可追溯性；该link不是Governance evidence attestation、结论、nonconformity或decision，也不能凭link反推上游事实已经存在或被验证。完整`GovernanceArtifactEvidenceReference`仍须由本地授权factory/lookup形成，不能由producer直接构造。 |
| retention marker | retention/protection marker若由后续本地生命周期契约产生，只能指向已授权的Observability observation/reference；I04不创建Governance retention policy、保留期限、删除决定或合规证明，也不把transport replay/dead-letter状态当作retention truth。 |
| report handoff | report handoff只能消费已提交的本地observation/reference与明确的handoff contract；I04不生成报告结论、验收签署、review verdict或external delivery acceptance，也不直接回写报告域。缺少下游handoff owner时保持no-write。 |
| non-owned Governance truth | Governance context、gate、decision、policy、control、review、conclusion、compliance/nonconformity、Governance trace、actor/credential/membership及其正文均不属于I04；任何同名字段或状态都不能成为本地truth source。 |
| identity and correlation | C-03 authenticated worker提供的trusted actor只用于本地operation、idempotency和audit attribution；`trace_ref`、`source_event_ref`、`source_ref`、`source_version_ref`、`dedup_key`与Governance actor/subject各自保持独立语义，不能互相替代。 |
| write direction | 合法方向只有`Governance producer -> typed inbound binding -> Observability local observation`。I04没有对Governance context、gate、decision、policy、control、review、conclusion、nonconformity或trace truth的反写、回调更新或补偿写路径。 |
| redaction and diagnostics | raw Governance body、provider credential、policy/decision文本、trace正文和不可公开的actor material不得进入payload、request digest、log、metric label、trace attribute、receipt、outbox、dead-letter或本地持久化；缺少body-free contract时拒绝 admission。 |

上述边界意味着一个本地`Accepted`（若后续结果契约允许该结果）只能表示
Observability侧某个accepted UoW/receipt已经成立，不能表示Governance event已经
被验证、Governance decision已经生效或下游报告已经交付。`Governance` producer
namespace、source ref、event name和payload中的actor-like字段都不能扩大I04的
truth ownership。

### 4.2 Finite logical binding

下表是当前本仓可定位的唯一I04逻辑绑定。`payload use-site`与`application input
use-site`只是当前Step 06/07的引用槽；由于canonical payload owner和具体event
binding仍缺失，表中不能把它们解释为已sealed的wire contract。

| binding item | exact current target | status / restriction |
|---|---|---|
| protocol family | `InboundEvent` / Consumer | 只归入S08-E，不创建admin/internal或另一个Governance副本 |
| logical binding | `InboundEvent / ConsumeGovernanceAuditContext` | 唯一逻辑协议名；不按topic、handler、event name或job name建立别名 |
| public name | `ObservationInboundConsumerName::ConsumeGovernanceAuditContext` | 必须由finite static name table映射；unknown/name-family mismatch在UoW前拒绝 |
| internal operation | `ObservationInboundConsumerOperation::ConsumeGovernanceAuditContext` | 只允许匹配该variant；不得由自由字符串、topic或payload字段派生 |
| stable discriminator | `0x0304` | 取current inbound operation table的I04稳定值；它只固定本地operation identity，不替代上游wire schema/discriminator registration |
| required producer family | `ObservationProducerFamily::Governance` | 是认证协作namespace约束；不是对具体Governance event已完成注册的声明 |
| payload use-site | `ObservationInboundEventEnvelope<GovernanceAuditContextPayload>` | 当前只有Observability use-site；`S08-E-I04-PAYLOAD-SCHEMA-01`开放，不能反推字段、encoder或decoder |
| application input use-site | `ConsumeGovernanceAuditContextInput` | 只作为Step 06/07 matching input槽位；六个control fields及三个候选业务字段的具体传播仍受affected约束 |
| exact assembler | `ObservationInboundInputAssembler::consume_governance_audit_context` | 唯一matching assembler；本节不赋予其I/O、resolver、clock、ID或transport action能力 |
| exact application service | `ObservationInboundEventService::consume_governance_audit_context` | 唯一matching service façade；本节不提前定义其对象构造、UoW或结果分支 |
| unique Step 09 reservation | `ConsumeGovernanceAuditContextFlow` | 仅保留一个后续flow名和回指槽；不在Step 08 §4展开函数级调用图 |
| transport boundary | typed asynchronous delivery/completion | topic、endpoint、credential、subscription和locator归entry/config binding；不进入I04 payload、operation identity或business truth |
| secondary identity | `(consumer, authenticated producer_family, source_event_ref)` | 只在consumer/producer/source-event binding完整验证后成立；不得用outbox ref、topic、cursor或payload id替代 `source_event_ref` |
| logical idempotency | `(operation, trusted actor, dedup_key)` | `dedup_key`是delivery metadata；不得用source event、trace、timestamp、digest或Governance subject替代 |
| correlation relation | `trace_ref`, `source_event_ref`, `source_ref`, `source_version_ref`, `occurred_at`, `dedup_key`各自独立 | 任何同名或可转换-looking字段必须经typed adapter；不能把correlation id升级为business relation或source version |
| completion direction | local `ObservationConsumerResult` -> worker C-05 mapper -> private transport registrar | transport completion不反写Governance truth；result/receipt/action的字段和分支留待后续I04小节 |

这个绑定表闭合的是“协议名称和入口槽位的唯一性”，不是“payload可解码和
协议可实现性”。尤其是`ObservationProducerFamily::Governance`已经能够作为本地
静态operation约束，但当前没有任何一个具体Governance outbound event因此自动成为
I04的合法producer event。

### 4.3 Candidate event admission is fail-closed

L1-governance当前明确存在多个具体outbound event。已知与Observability语义最接近
的候选为`NonconformityChanged`与`GovernanceTraceAvailable`；两者payload、truth
owner和redaction边界不同，均不能被合并成一个I04输入。当前I04不承认任何一个
candidate已完成绑定，规则如下：

| candidate / situation | current admission rule | forbidden shortcut |
|---|---|---|
| `NonconformityChanged` | 只有在上游或明确的跨项目binding owner发布有限event-to-I04 mapping、canonical payload/schema、source identity/version与body-free adapter后，才可能进入I04候选；当前必须fail closed | 把nonconformity body、state、action或verification ref直接填入local evidence reference、digest或visibility |
| `GovernanceTraceAvailable` | 同样必须有独立的有限binding和typed payload contract；trace可用不等于Observability已拥有Governance trace truth，也不自动满足I04 evidence/ref字段 | 把trace subject/ref/kind、handoff marker或source cursor按名称cast成I04 reference、source version或trace identity |
| 其余Governance outbound event | 未经明确registration不得订阅、decode或映射到I04；event kind数量不构成I04 payload union | 全订阅、按namespace通配、按字段相似度选择decoder、把13个event做字段并集 |
| unknown/unregistered event | 在payload decode、digest、reservation和UoW之前拒绝；不产生partial input、accepted receipt或local reference | 用默认I04 schema、current version、event name fallback或compatibility alias继续处理 |
| missing canonical payload owner | 即使收到结构上相似的body-free字段，也不能承认其为`GovernanceAuditContextPayload`；保持`S08-E-I04-PAYLOAD-SCHEMA-01`开放并fail closed | 在Observability创建同名payload、复制上游字段、接受generic map/raw bytes或测试fixture shape |
| missing local authority | 缺少reference/digest/visibility的唯一owner时，不mint local identity、不默认digest、不把缺失当Visible/Accepted；保持相应affected开放 | ref prefix推导、debug/string hash、复制optional digest、absence-as-visible或Governance state推导read authorization |

因此，当前I04的有限producer结论是：producer family已固定为`Governance`，
concrete producer event集合为“尚未注册”，而不是“两个候选事件均已接入”。任何
未来adapter都必须先通过consumer name、producer family、schema/version、source
event/source version、redaction和body-free gate，之后才可进入具体payload/field
审查；不能在I04内部用聚合事件补齐上游缺口。

### 4.4 §4 stop review 与下一读取边界

| 检查项 | 结论 |
|---|---|
| §4范围是否受控 | pass；只写truth boundary、finite logical binding和candidate fail-closed，不进入payload schema、具体input constructor、函数级flow、UoW、result或C-05 action |
| Observability与Governance truth是否分离 | pass；I04只承接body-free observation/reference projection，不拥有或反写Governance context、gate、decision、policy、control、review、conclusion、nonconformity、trace或report verdict truth |
| evidence linkage、retention marker、report handoff边界 | pass at ownership level；只能关联Observability-owned observation并等待后续明确handoff/lifecycle contract，不创建Governance retention、报告结论或外部交付事实 |
| exact logical binding | pass at local target/use-site level；`InboundEvent / ConsumeGovernanceAuditContext`、public/internal name、`0x0304`、Governance producer family、matching assembler/service和唯一`ConsumeGovernanceAuditContextFlow`均已定位 |
| concrete producer event是否已绑定 | no；`NonconformityChanged`、`GovernanceTraceAvailable`及其他Governance event均遵守fail-closed；`S08-E-I04-PRODUCER-EVENT-BINDING-01`继续开放 |
| payload是否已成为canonical schema | no；`GovernanceAuditContextPayload`仍只有Observability use-site，`S08-E-I04-PAYLOAD-SCHEMA-01`继续开放 |
| six control fields与local reference/digest/visibility是否闭合 | no；`S08-E-I04-CONTROL-FIELD-SOURCE-01`、`S08-E-I04-REFERENCE-AUTHORITY-01`、`S08-E-I04-DIGEST-AUTHORITY-01`、`S08-E-I04-VISIBILITY-AUTHORITY-01`原样开放 |
| 是否新增或关闭blocker/affected | no；§4没有新增或关闭项，既有两个`open_upstream_internal`与四个`open_internal_affected`保持不变 |
| 当前协议计数 | 保持`33/60 defined_with_affected_open`；Query `14/14`；Consumer `3/9`；`0/60`无条件complete；I04为`in_progress_S01-S04_with_affected_open`，不计入defined |
| 正式文档、实现、测试、evidence、run_id和验收签署 | 均未生成或声称；正式`03`继续frozen，验证为`not_run_not_claimed` |
| 下一动作 | 立即停审；用户确认后只进入I04 §5，读取Step07 matching assembler/service签名、shared worker callback与typed completion边界，定义exact call chain和callable signatures；不进入payload schema、concrete input、I05~I09、S08-F/G或Step09 |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S04_recorded_with_affected_open_waiting_user_before_I04_S05
```

未经用户明确确认，不得进入I04 §5；不得读取或写入I05~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §4 的历史停审记录；§5 已由下方 current checkpoint 承接，不得再把
`before_I04_S05`当作当前恢复点。

## 5. Exact call chain and callable signatures

本节只把 §4 的唯一逻辑绑定落到 current Step 06/07 已存在的 technical callback、
matching assembler 和 application service seam。它说明哪个 owner 可以调用哪个函数、
参数如何跨层移动以及 completion 由谁执行；不定义 payload 字段、concrete input 字段、
constructor/accessor、domain object、reservation、UoW、result branch、error precedence 或
C-05 action matrix。下文中的 target chain 只有在六项 I04 affected 及相关 shared
Consumer affected 按各自 owner 关闭后才可实现，不能据此声称 I04 已可注册运行。

### 5.1 Startup registration chain

I04 callback 不是按 topic、event name 或 payload shape 动态发现的。worker composition
root 只能构造一个实现 shared `InboundConsumerHandler` 的 exact I04 handler instance，
并把它放入 `InboundConsumerHandlerCatalog::consume_governance_audit_context` 具名 slot。
startup 的有限调用关系为：

```text
validated locator-free Consumer registrations
  -> worker constructs the exact I04 InboundConsumerHandler instance
  -> InboundConsumerHandlerCatalog::from_slots(... I04 slot ...)
  -> InboundConsumerRegistrar::register_all(catalog)
  -> registrar preflight catalog.matches_registrations(registrations)
  -> registrar prepare-all private slots
  -> authoritative operation / producer / schema / private-slot totality check
  -> registrar arm-all
  -> one opaque RegisteredInboundConsumerSet or one RuntimeAssemblyError
```

| startup boundary | exact owner / rule | forbidden shortcut |
|---|---|---|
| I04 handler construction | `worker::consumers` composition root；handler `operation()` 必须恒为 `ObservationInboundConsumerOperation::ConsumeGovernanceAuditContext` | generic handler、free-text operation、topic-to-handler lookup、default/fallback handler |
| I04 catalog slot | infra-owned finite C-06 catalog 的 `consume_governance_audit_context` slot；required producer family 恒为 `Governance` | dynamic map、把 I04 handler 放进其他 slot、一个 handler 兼容多个 operation |
| registration metadata | infra validated registration 是 operation/producer/schema 的唯一 startup source；catalog 不复制 producer/schema truth | 从 payload、handler name、topic 或 Governance event name 推导 registration |
| totality | registrar先用crate-private `matches_registrations`做catalog/registration preflight，再在prepared private slots上验证operation/producer/schema/config identity；enabled registration exact one matching `Some`，disabled operation exact `None` | worker直接调用crate-private predicate、用`enabled_count`代替逐slot检查、允许partial catalog |
| activation | registrar 必须完成 prepare-all -> totality -> arm-all；成功前不触发 callback、不暴露 partial handle | 逐个 arm 后再检查、失败时保留已激活 callback |
| current I04 gate | canonical payload owner 与 concrete Governance event binding 尚未闭合，因此当前设计记录不能把 I04 registration 声称为可 arm | 用候选 event、默认 schema、结构相似 fixture 或 namespace wildcard 补注册 |

`register_all` 只建立 process-local callback ownership，不消费一条 Governance event，
不构造 application input，也不创建 observation、receipt、evidence linkage、retention
marker 或 report handoff。opaque registered set 只证明本地 callback group 已完整激活，
不证明 Governance truth、payload authenticity 或 external delivery acceptance。

### 5.2 Per-delivery worker-to-application chain

在 startup totality 已成立且上游 payload/binding affected 已关闭的目标态，一条 I04
delivery 只能沿以下链路移动：

```text
authenticated Governance delivery
  -> select the validated static I04 registration and catalog slot
  -> construct one move-only InboundConsumerDelivery
  -> exact I04 InboundConsumerHandler::handle
  -> require exact operation / producer / schema / source-event binding
  -> consume the bounded InboundEnvelopeFrame exactly once
  -> header-before-payload validation
  -> decode only the registered GovernanceAuditContextPayload schema
  -> ObservationInboundInputAssembler::consume_governance_audit_context
  -> move one ConsumeGovernanceAuditContextInput into
     ObservationInboundEventService::consume_governance_audit_context
  -> await ApplicationServiceFuture<ObservationConsumerResult>
  -> exact worker result / receipt / recovery / action mapper
  -> construct one InboundConsumerCompletion
  -> private InboundConsumerRegistrar transport action execution
```

该链是 protocol callable chain，不是 Step 09 `ConsumeGovernanceAuditContextFlow` 的
函数级业务处理流。尤其是 service 内部的 reference lookup/factory、reservation、domain
transition、record/outbox staging、save order、commit certainty 和 replay branch 均未在
本节展开或裁定。

| phase | input -> output | owner and capability boundary | fail-closed point |
|---|---|---|---|
| static dispatch | validated registration + private transport callback -> one C-03 delivery | infra registrar 选择 exact I04 slot，只复制 registration-owned operation/producer、validated schema、trusted actor 和一次性 frame | slot/operation/producer/schema mismatch 时不调用 handler |
| handler admission | `InboundConsumerDelivery` -> consumed frame + safe metadata | exact worker handler 按值取得 delivery；不得 clone frame、保留 raw body 或调用 Governance repository | payload owner/event binding 未注册、header malformed 或 source relation不成立时，不 decode typed payload、不调用 assembler |
| typed decode | one bounded frame -> `ObservationInboundEventEnvelope<GovernanceAuditContextPayload>` target | decoder 只能由 finite I04 schema registration 选择；不得尝试第二 decoder、generic map 或字段并集 | 两项上游 affected 未关闭时没有合法 decoder admission，必须停在此边界 |
| input assembly | trusted `ActorSafeRef` + typed envelope -> `Result<ConsumeGovernanceAuditContextInput, ApplicationError>` | matching assembler 同步、I/O-free；可私有调用 canonicalizer/context factory，但不得得到 repository、clock、ID mint 或 transport capability | assembly error 不调用 service；六个 control fields、reference/digest/visibility authority 未闭合时不得伪造 accepted input |
| application call | concrete input by value -> future of `ObservationConsumerResult` | matching service 是唯一 application facade；worker 不拆 input、不重组 context、不直接调用 domain/repository/UoW | 只有 assembler `Ok(input)` 才能调用；本节不定义 service 内部 branch |
| worker mapping | application result，或 service 前已分类 failure -> typed receipt/recovery/action target | exact I04 worker mapper 负责有限、pure/total、no-wildcard 的 result/receipt/action 选择；C-05 constructor 只包装已选动作 | 不从 outcome token、error text、Governance state 或 transport redelivery count推导默认 action |
| completion execution | one C-05 completion -> private transport action | registrar 只执行已选 `Acknowledge/Retry/DeadLetter`，不得重分类 receipt 或替换 action | shared indeterminate-completion gap 未关闭时不得为 unknown commit 随机选择 terminal completion |

worker 不调用 Governance service/repository，不创建或修改 Governance context、gate、
decision、policy、control、review、conclusion、nonconformity 或 trace；它也不把 raw frame、
payload body、policy/decision text、credential 或 provider error 交给 log、metric label、trace
attribute、receipt、dead letter 或 application service。application result 和 C-05 completion
均只描述 Observability local processing，不形成对上游或报告域的反写。

### 5.3 Exact shared callback and registrar signatures

I04 不创建专属 callback trait。它只能使用 Step 07 已定义的 shared object-safe seam：

```rust
pub type InboundConsumerHandlerFuture<'a> = Pin<
    Box<dyn Future<Output = InboundConsumerCompletion> + Send + 'a>,
>;

pub trait InboundConsumerHandler: Send + Sync {
    fn operation(&self) -> ObservationInboundConsumerOperation;

    fn handle<'a>(
        &'a self,
        delivery: InboundConsumerDelivery,
    ) -> InboundConsumerHandlerFuture<'a>;
}
```

对 I04 instance，`operation()` 的唯一合法返回值是
`ObservationInboundConsumerOperation::ConsumeGovernanceAuditContext`。该方法只参与
catalog totality，不授权调用、不选择配置、不替代 C-03 内的 operation，也不能返回
producer、schema、topic 或 concrete Governance event。`handle` 的调用方只能是已经
成功 arm 的 private registrar callback；entry、application、domain 或上游 producer
都不能直接调用它。

startup registrar 的 exact shared surface 为：

```rust
pub type RegistrationFuture<'a, T> = Pin<
    Box<dyn Future<Output = Result<T, RuntimeAssemblyError>> + Send + 'a>,
>;

pub trait InboundConsumerRegistrar: Send + Sync {
    fn registrations(&self) -> &[ValidatedInboundConsumerRegistration];

    fn register_all<'a>(
        &'a self,
        handlers: InboundConsumerHandlerCatalog,
    ) -> RegistrationFuture<'a, Box<dyn RegisteredInboundConsumerSet>>;
}
```

`registrations()` 只暴露 locator-free safe metadata；不暴露 transport client、credential、
actor mapper、callback 或 mutable registration state。`register_all` 按值取得完整 catalog
并原子激活；它不是 per-delivery application callable。transport action execution 保持
registrar-private，因此本节不发明 `ack/retry/dead_letter` port 或公开 locator 参数。

### 5.4 Exact I04 assembler and service signatures

Step 07 已给出 I04 唯一 matching assembler：

```rust
pub trait ObservationInboundInputAssembler: Send + Sync {
    fn consume_governance_audit_context(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<GovernanceAuditContextPayload>,
    ) -> Result<ConsumeGovernanceAuditContextInput, ApplicationError>;
}
```

参数关系固定如下：

| parameter / return | exact source or target | capability restriction |
|---|---|---|
| `actor_ref` | C-03 trusted inbound actor projection，经 handler 按值传入 | 不从 payload、Governance subject/author、trace、ref 或 topic 构造；不授予业务或 read visibility authority |
| typed `envelope` | exact I04 decoder 在 header-before-payload gate 后形成 | use-site 不等于 canonical payload owner；两项上游 affected 未关闭时不得调用此方法 |
| `Ok(input)` | one complete `ConsumeGovernanceAuditContextInput` moved to matching service | 不能返回 partial input；具体字段、constructor/accessor 与 provenance 留 §6~§7及 control-field affected |
| `Err(ApplicationError)` | assembly/validation failure，交 exact worker error/result mapper | 不调用 service，不创建 reservation/UoW/receipt truth，不把 error text用作 action policy |

assembler 是同步且 I/O-free 的唯一原子组装点。它不得执行 reference repository lookup、
mint `GovernanceArtifactEvidenceReference` local identity、读取 local visibility、调用 clock、
执行 transport action，或把完整 local reference/visibility 当作 producer-supplied truth。
现有 reference/control-field/digest/visibility affected 因此保持开放；签名存在不能证明
input 已可合法构造。

Step 07 已给出 I04 唯一 matching application service：

```rust
pub trait ObservationInboundEventService: Send + Sync {
    fn consume_governance_audit_context<'a>(
        &'a self,
        input: ConsumeGovernanceAuditContextInput,
    ) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
}
```

service 只按值消费 matching concrete input，不接收 raw bytes、generic Consumer enum、
caller-selected operation/action、Governance repository handle、transport locator 或 actor
override。其 future 输出 `ObservationConsumerResult`，不是 transport completion；worker
必须经后续 I04 exact mapper 才能构造 C-05。service 内部如何解析 local reference、处理
idempotency/UoW 和形成 result 留给 §8~§14及 Step 09，不能由本节调用链反推。

### 5.5 Callable ownership and negative capability matrix

| component | may call / consume | must not receive or call |
|---|---|---|
| infra registrar | validated registrations、finite catalog、C-03 construction、shared handler `handle`、已选 C-05 execution | payload DTO字段、assembler/service、domain/repository/UoW、Governance truth writer、result reclassification |
| exact I04 worker handler | one C-03、one exact decoder、matching assembler/service、one exact result/action mapper | raw locator/credential、dynamic handler map、Governance repository/service、local repository直接访问、generic/default action |
| input assembler | trusted actor + typed I04 envelope、private canonicalizer/context factory | I/O、clock、ID mint、repository/UoW、transport client、完整 producer-owned local reference/visibility |
| inbound event service | one `ConsumeGovernanceAuditContextInput` by value、Step07明确授予的 application/domain ports | raw frame、payload decoder、transport completion/action、Governance write capability、report delivery acceptance capability |
| exact worker mapper | typed application result/error classification、existing receipt surface、explicit recovery/action policy | raw body、error string heuristic、wildcard/default branch、current-state repository reread |
| C-05 + registrar private action | one already-selected action and receipt | outcome-to-action inference、local truth rollback、raw-body dead-letter archive、Governance/report truth write |

该矩阵继续落实 §4 的单向边界：producer 提供的 body-free observation 只能经注册
binding 进入 Observability local processing；任何一层都没有能力把 completion、receipt、
correlation id、evidence link、retention marker 或 report handoff 解释成 Governance truth。

### 5.6 §5 stop review and next reading boundary

| check | conclusion |
|---|---|
| §5 scope | pass_with_affected_open；只记录 startup/per-delivery callable chain、shared handler/registrar签名、matching assembler/service签名与owner/capability边界 |
| signature source | pass；全部 public/shared callable 均逐字回指 current Step 07；没有创建 I04-specific trait、handler type、registrar method、receipt 或 completion variant |
| chain totality | target chain已唯一；registration -> C-03 -> handler -> typed decode -> assembler -> service -> exact mapper -> C-05 -> private registrar无旁路，但受现有affected约束，不能声称runtime-ready |
| payload/input越界 | no；未定义`GovernanceAuditContextPayload`字段、concrete input字段、constructor/accessor或field provenance |
| flow/UoW/result/action越界 | no；未展开reservation、domain transition、record/outbox、save order、commit、result/error branch或C-05 action matrix |
| truth/no-write | pass；worker/infra/application各层均无Governance truth反写或report acceptance能力，raw body不进入diagnostics/receipt/dead letter |
| I04专属affected | 六项原样保持开放：2项`open_upstream_internal`、4项`open_internal_affected`；§5没有新增或关闭 |
| shared Consumer affected | result/outbox/quarantine/indeterminate/action/UoW等既有shared/cross-protocol项保持开放；本节没有把C-05签名误报为全分支可完成 |
| 新增上游blocker | no；`S08-E-I04-PAYLOAD-SCHEMA-01`与`S08-E-I04-PRODUCER-EVENT-BINDING-01`继续开放 |
| 当前协议计数 | 保持`33/60 defined_with_affected_open`；Query `14/14`；Consumer `3/9`；`0/60`无条件complete；I04为`in_progress_S01-S05_with_affected_open`，不计入defined |
| 正式/实现/测试/evidence | formal`03`保持frozen；代码、测试、compile/runtime evidence、commit、run_id、evidence alias与签署均`not_run_not_claimed` |
| 下一动作 | 立即停审；用户确认后只进入I04 §6，读取shared Consumer envelope/header authority、L1-governance canonical event/payload registry、§1~§5 affected与Step06/07 payload/input use-site，审查shared envelope和I04 typed payload boundary；缺owner时继续fail closed，不伪造字段 |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S05_recorded_with_affected_open_waiting_user_before_I04_S06
```

未经用户明确确认，不得进入I04 §6；不得读取或写入I04后续小节、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §5 的历史停审记录；§6 已由下方 current checkpoint 承接，不得再把
`before_I04_S06`当作当前恢复点。

## 6. Shared envelope and I04 typed payload admission

### 6.1 Shared header authority and validation order

I04 复用 S08-B 唯一的 `ObservationInboundEventEnvelope<T>`，不创建 Governance
专属 envelope、header alias 或兼容字段。其字段集合固定为：

```text
consumer_name
source_event_ref
source_ref
source_version_ref
producer_family
schema_version
dedup_key
occurred_at
trace_ref
payload
```

shared header 与 I04 payload 的 authority 必须物理分离。header 字段不得从 payload
补齐，payload 也不得重复提交 header identity、producer、schema、dedup、occurred-at、
trace 或 trusted actor：

| envelope field | canonical owner / admission source | I04 exact check | forbidden derivation or fallback |
|---|---|---|---|
| `consumer_name` | authenticated static Consumer registration与C-03中registration-owned operation | 必须精确等于`ConsumeGovernanceAuditContext`对应的有限consumer name | event kind、topic、handler type name、payload discriminator或default Consumer |
| `source_event_ref` | 经认证binding提供的上游event body-free稳定identity；本地只按`SourceEventRef`解析 | 必填、语法有效、与当前registered producer-event binding一致；不得等同delivery attempt | Governance `outbox_ref`、topic、offset、cursor、trace、dedup key或本地mint identity |
| `source_ref` | 经认证binding提供的typed source identity | producer/source family与具体event binding逐项一致 | Governance union `subject_ref`直接cast、payload任意ref、ref prefix、topic或actor |
| `source_version_ref` | 经认证binding可选提供的typed source version | `Some`时其producer和source必须与envelope精确一致；本地只验证关系，不排序 | `source_cursor`、event/schema version、row version、occurred-at、arrival order或offset |
| `producer_family` | authenticated static registration | 必须精确为`ObservationProducerFamily::Governance`且与slot一致 | payload producer字段、topic namespace、credential label或source-ref前缀 |
| `schema_version` | I04有限schema/discriminator registration | 必须先命中exact I04 registration，才可选择唯一decoder | Governance `event_version`直接cast、current/latest默认、decoder trial或payload sniffing |
| `dedup_key` | authenticated event binding的Consumer逻辑幂等identity | 必填并按shared typed规则校验；本节不定义request digest或reservation | `outbox_ref`、source event、cursor、trace、delivery attempt、arrival timestamp或payload hash |
| `occurred_at` | authenticated event binding提供并规范化的event occurrence observation | 必填、typed且只作为观察时间；不提供source ordering或truth version | local clock、arrival time、source cursor、event version、outbox creation time或retry time |
| `trace_ref` | shared correlation contract经binding无损选择的可选body-free ref | `Some`时按typed correlation校验并保持原角色；`None`不补值 | Governance `trace_ref`与`core_trace_id`任选、合并、互转，或从payload/outbox生成 |
| `payload` | exact I04 schema registration选择的canonical typed decoder | 只在全部header gate通过后解码一次 | generic map、serde value、第二decoder、字段并集、unknown-field容错或header字段补写 |

I04 每次 delivery 的 admission 顺序固定如下；顺序本身是安全边界，不能由 adapter、
worker 或 assembler 重排：

1. registrar 根据已认证且已通过 startup totality 的 static catalog 选择唯一 I04 slot；
   未命中时不得构造 generic/default handler 调用。
2. exact I04 handler 按值消费一份 bounded frame，并先读取 shared header；此时不解释
   payload bytes，也不调用assembler、service、canonicalizer、repository或UoW。
3. 逐个解析并校验全部 typed header fields，包括必填性、wrapper语法、optional
   framing和字段角色；任何 malformed header 立即在 typed decode 前 fail closed。
4. 要求 exact consumer name、`producer_family == Governance`，并与 authenticated
   static slot 中的 operation/producer逐项相等。
5. 要求该 concrete Governance producer event、I04 consumer、normalized source
   relation与schema/discriminator已经形成有限registration。该attestation由binding owner
   持有，不通过在本地envelope新增`event_kind`字段来伪造。
6. `source_version_ref`为`Some`时，校验其producer/source与envelope精确一致；不得把
   Governance cursor按字符串、数值或时间比较为本地source version。
7. 只有前六步全部通过，才按registration选择唯一
   `GovernanceAuditContextPayload` decoder；不得尝试另一Governance payload、通用enum、
   generic map或字段兼容fallback。
8. decoder成功后才形成
   `ObservationInboundEventEnvelope<GovernanceAuditContextPayload>` use-site值，并把
   C-03携带的trusted `actor_ref`作为独立参数交给matching assembler。
9. `actor_ref`不得进入或来自envelope/payload；它只证明当前调用上下文的可信actor
   projection，不证明Governance业务结论、payload内容、visibility或source truth正确。

| admission failure | last permissible observation | forbidden side effect before later result mapping |
|---|---|---|
| static slot、consumer或producer不匹配 | registration-safe operation/family metadata | 不消费为另一Consumer，不尝试generic handler，不decode payload |
| header malformed或缺必填字段 | redacted field class与finite validation code | 不hash raw frame，不reserve dedup，不调用assembler/service，不保存payload |
| concrete producer-event binding不存在 | authenticated family与safe source-event presence（若已合法解析） | 不把任意Governance event升级为I04，不自行制造adapter或aggregate event |
| schema未注册/不支持 | validated header与unsupported schema classification | 不尝试current/latest/第二decoder，不从payload形状推断schema |
| source/source-version relation不成立 | typed mismatch classification | 不按cursor/time/ref string排序或覆盖source identity |
| canonical typed decode失败 | registered schema与redacted decode classification | 不传partial DTO，不记录raw bytes/field value，不进入digest/reservation/UoW |

本节只固定 admission boundary。上述 failure 最终如何映射
`ObservationConsumerResult`、receipt、recovery 与 C-05 action 留待 I04 后续结果/error/action
小节；§6 不以“fail closed”替代具体 action matrix。

### 6.2 Governance outbound-to-I04 header non-mapping matrix

L1-governance current canonical outbound envelope 是：

```text
event_kind
event_version
outbox_ref
subject_ref
source_cursor
trace_ref
core_trace_id
topic_key
payload
```

该 envelope 属于 Governance publisher/storage truth，不是
`ObservationInboundEventEnvelope<T>` 的同构前身。两个结构字段名相似也不能证明类型、
authority、生命周期或wire语义相同：

| Governance outbound field | tempting I04 target | current diagnosis | future binding obligation; absent now |
|---|---|---|---|
| `event_kind` | `consumer_name`或payload discriminator | event kind标识十三个具体Governance event；I04 consumer name标识本地operation，二者不是同一enum | 明确有限`event_kind -> I04 slot + payload decoder`关系；不能按名称、topic或payload形状选择 |
| `event_version` | `schema_version` | Governance event schema版本与I04 normalized payload schema属于不同owner/type | adapter owner给出逐event显式兼容表与拒绝规则；不能直接cast或默认`V1` |
| `outbox_ref` | `source_event_ref` | outbox storage/publication identity不自动等于跨项目source-event identity | owner声明无损、稳定、body-free identity映射及重放不变性；当前未授权该映射 |
| `subject_ref` | `source_ref` | `GovernanceOutboxSubjectRef`是多类Governance subject union；本地source ref还有producer/source relation | 每个被选择event给出typed subject-to-source relation；不能擦除union tag、取payload第一个ref或按prefix转换 |
| `source_cursor` | `source_version_ref` | Governance truth cursor不是Observability source version，且不授权本地比较或排序 | typed adapter/comparator与same-source规则；当前不得cast、stringify或用其补dedup/occurred-at |
| `trace_ref` | `trace_ref` | Governance trace record identity不自动等于shared correlation ref | shared trace contract必须指定是否以及如何无损映射；不能只因字段同名就转换 |
| `core_trace_id` | `trace_ref` | distributed trace id与Governance trace record、Observability correlation ref是三个角色 | binding必须唯一选择合法correlation source并保留角色；不得与Governance `trace_ref`任选、拼接或互相fallback |
| `topic_key` | consumer/source/schema selector | topic key只是topic-neutral routing locator | 只可由配置/runtime binding消费；不得进入envelope body、request digest、source identity或业务truth |
| outbound envelope未提供dedup字段 | `dedup_key` | 没有Consumer逻辑幂等authority | binding owner必须声明稳定dedup material/identity；不得复用outbox/source/cursor/trace或delivery attempt |
| outbound envelope未提供occurred-at字段 | `occurred_at` | 没有event occurrence observation authority | producer/binding owner必须声明canonical occurrence source和规范化规则；不得使用arrival/local clock/cursor |
| outbound envelope未提供trusted actor | assembler `actor_ref` | producer envelope actor与本地认证调用actor是不同authority，当前前者也不存在 | C-03继续独立提供trusted actor projection；不得从subject、trace、payload或credential label构造 |

因此“Governance outbound event可序列化”不等于“I04 header可构造”。当前缺口完整落在
`S08-E-I04-PRODUCER-EVENT-BINDING-01`：它同时要求具体event选择、header无损映射、
schema/discriminator与source relation闭合。§6不为同一缺口新增第二个header-adapter affected，
也不允许Observability在缺失owner时自行承担该跨项目authority。

### 6.3 I04 typed payload use-site boundary

current Step 06/07 只能证明下面的 application callable use-site 存在：

```rust
// Use-site only; no canonical upstream declaration currently exists.
ObservationInboundEventEnvelope<GovernanceAuditContextPayload>
```

本节不得把该type parameter展开为一个本仓新`struct`。当前材料没有提供
`GovernanceAuditContextPayload`的canonical declaration、wire字段、factory、encoder、
schema/discriminator registration或producer-side compatibility contract；类型名出现在
trait签名和Step06 family row中不构成公开协议owner。

| required canonical surface | current evidence | admission consequence |
|---|---|---|
| unique payload owner and module | L1-governance current材料没有同名声明；Observability只有use-site | 不得在本仓声明同名DTO、type alias、untagged enum或compat wrapper |
| finite field schema and optionality | 未找到字段级wire schema、required/optional规则或unknown-field策略 | 不能从Step06 application input摘要反推payload字段，也不能接受generic map |
| producer-side factory / encoder | 未找到从accepted Governance truth或stored outbound snapshot构造该payload的owner | 不能证明payload可从哪个event truth合法产生，不能由consumer重建 |
| event kind + schema/discriminator registration | 十三个具体event各有自己的kind/payload；没有I04 normalized registration | header通过前没有合法decoder，不能按payload形状、topic或event名称猜测 |
| source/event/version relation | Governance envelope有outbox/subject/cursor，但没有到I04 source-event/source-version的typed mapping | 即便payload bytes看似可解码，也必须在payload decode前拒绝 |
| compatibility and retirement policy | 没有producer/consumer版本矩阵、upgrade/downgrade或unknown variant规则 | 不能把current/latest当默认，也不能多decoder试探 |

Step 06 I04 row 中的三个候选业务字段属于 Observability application-input 诊断材料，
不能反向升级为 producer wire schema：

| Step 06 candidate | why it is not an admissible payload field now | authority-preserving closure direction |
|---|---|---|
| `governance_evidence_ref: GovernanceArtifactEvidenceReference` | 该完整本地对象含`boundary_ref_id`、reference snapshot state ref、local state及gap/visibility reason；Governance producer没有mint、lookup或state authority | 上游未来最多声明最小body-free typed refs/observations；Observability在后续受限resolver/factory中构造或解析本地reference |
| `digest_summary: DigestSummary` | local semantic digest的material/profile/order及与reference内optional digest关系尚无唯一owner；它也不是request digest | 上游若拥有canonical digest须显式声明typed digest contract；否则由本地canonicalizer基于获授权的最小材料生成，二者不能同时默认 |
| `visibility: VisibilitySurface` | 这是Observability public response/read disclosure surface，不是Governance producer input或业务truth | 从producer-facing input删除或替换为上游自有observation，再由本地policy/gap mapper收窄；不得默认`Visible` |

未来合法的 I04 payload 只能由上游或明确的跨项目 contracts owner 发布：它必须是
body-free、event-specific、字段最小且逐字段有producer authority，不重复shared header，
不携带Governance正文、decision/policy/control/review/conclusion body，不让producer提交
Observability local identity/state/gap/visibility/result，也不能通过宽松string/ref union擦除类型。
在owner正式声明之前，本节不替其命名字段，因为“猜一个看起来合理的最小DTO”仍会创建
第二truth/schema owner。

### 6.4 Candidate payload incompatibility

L1-governance HLD/Step 08 中面向 Observability 方向最接近的两个候选仍是两个独立事件，
不是同一个 I04 payload 的两个可互换来源。

| candidate event / payload | canonical payload fields | owned meaning | why it cannot satisfy I04 use-site |
|---|---|---|---|
| `NonconformityChanged / NonconformityChangedPayload` | `nonconformity_ref`、`context_ref`、`nonconformity_state`、optional `active_action_ref`、optional `verification_ref`、`source_cursor` | Governance nonconformity/action/verification truth change observation | 没有canonical I04 payload declaration、header mapping、local reference construction authority、semantic digest或local visibility；state也不得被解释为Observability result/authorization |
| `GovernanceTraceAvailable / GovernanceTraceAvailablePayload` | `subject_ref`、`trace_ref`、`trace_kind`、optional `handoff_marker_ref`、optional `source_cursor` | Governance trace availability/handoff marker observation | schema、subject union和lifecycle不同；trace/handoff refs不能冒充governance evidence ref、semantic digest、source-event identity或report acceptance |

两者之间不能采用以下“兼容”策略：

1. **字段并集**：把nonconformity、context、action、verification、trace、handoff与cursor
   放入一个大量optional字段的本地DTO，会抹掉event kind与必填关系，并创建不存在的
   aggregate truth/schema owner。
2. **字段交集**：二者没有足以表达I04目标语义的共同canonical body；即使都出现某种
   source cursor，其optional性、event relation与source-version角色也不同，不能据此接受。
3. **任选一个**：HLD subscriber方向不等于concrete binding。Observability无权把
   `NonconformityChanged`或`GovernanceTraceAvailable`单方面指定为I04唯一producer event。
4. **多decoder试探**：先尝试nonconformity payload、失败再尝试trace payload，会让bytes
   形状决定event/schema，绕过header-before-payload与finite registration。
5. **generic enum / map**：把十三个Governance event装进untagged enum、JSON map或
   `serde_value`后在assembler分支，只是把缺失的canonical binding推迟到application层。
6. **业务字段推断**：不得从state、trace kind、handoff marker、ref prefix或字段是否存在
   推导evidence linkage、visibility、retention、report readiness、verdict或source truth。

其余十一个 Governance outbound event 同样没有被注册为 I04 source。它们各自拥有独立
event kind、payload和truth lifecycle；§6没有逐个“排除后选剩余项”，而是要求上游提供
positive finite binding。没有positive registration时，全部保持not admitted。

### 6.5 Upstream declaration diagnosis

| expected upstream / cross-project declaration | current observation | status / affected | exact closure required before admission |
|---|---|---|---|
| canonical `GovernanceAuditContextPayload` owner、module与wire schema | L1-governance current outbound registry只有十三个具体payload；同名类型仅存在于Observability use-site | `S08-E-I04-PAYLOAD-SCHEMA-01=open_upstream_internal` | owner发布唯一声明、字段authority/optionality、body-free限制、encoder/factory、schema/discriminator与compatibility规则 |
| finite Governance event -> I04 binding | 没有声明哪些具体event进入I04，也没有拆分consumer的正式裁定 | `S08-E-I04-PRODUCER-EVENT-BINDING-01=open_upstream_internal` | 列出positive event set或正式拆分I04；逐event固定payload adapter、unsupported event行为且禁止catch-all |
| Governance outbound -> shared header adapter | outbound与I04 envelope字段不等价，并缺dedup、occurred-at、trusted actor authority | 由`S08-E-I04-PRODUCER-EVENT-BINDING-01`承接，不新增重复ID | 逐字段定义source-event/source/source-version/schema/dedup/occurred-at/correlation来源、类型转换、缺失与重放稳定性 |
| producer-side payload construction proof | 没有accepted Governance truth/outbox snapshot到同名payload的factory/encoder | 由payload schema与event binding两项共同承接 | 每个允许event证明payload只来自accepted immutable source，不由consumer或publisher重读current truth拼装 |
| Observability local reference/digest/visibility construction | Step06 input候选混合producer observation与local result authority | 四项既有`open_internal_affected`保持开放 | 上游最小DTO确定后，Step06/07再定义local resolver/factory、digest owner/profile及visibility local mapper；不得反向污染wire payload |

上游关闭包至少要同时回答“哪个具体事件、哪个schema、哪些body-free字段、如何构造
shared header、如何编码、版本如何匹配、缺失如何拒绝”。只补一个同名空struct、文档alias、
topic订阅行或`V1`常量均不能关闭 blocker。若上游最终裁定两个候选事件语义必须分别处理，
则应正式拆分consumer/binding并回到S08 inventory修订，而不是保留I04名称后在内部猜分支。

§6没有发现新的独立canonical owner gap：header adapter缺失是producer-event binding的组成
部分，三个local候选字段的authority已分别由reference/digest/visibility affected承接。
因此不新增affected ID，也不关闭六项既有affected。

### 6.6 §6 stop review and next reading boundary

| check | conclusion |
|---|---|
| §6 scope | `pass_with_affected_open`；只覆盖shared header authority/顺序、Governance outbound不可直接映射、typed payload use-site、candidate incompatibility与upstream diagnosis |
| shared envelope | pass at target-contract level；十个字段、逐字段authority和header-before-payload顺序已固定，未创建I04专属envelope或复制header字段 |
| concrete header construction | not closed；Governance outbound到I04 source-event/source/version/schema/dedup/occurred-at/correlation仍缺有限binding，必须在decode前fail closed |
| typed payload schema | not closed；只保留`ObservationInboundEventEnvelope<GovernanceAuditContextPayload>` use-site，没有虚构Rust struct、wire字段、factory、encoder或compatibility |
| candidate events | not admitted；`NonconformityChanged`与`GovernanceTraceAvailable`不能合并、取交集、任选、多decoder试探或generic map接收；其余event也无positive registration |
| trusted actor / truth boundary | pass；actor只来自C-03独立可信投影；payload/header均不授权反写Governance truth、创建报告结论或提交local visibility |
| I04专属affected | 六项原样保持开放：2项`open_upstream_internal`、4项`open_internal_affected`；§6没有新增或关闭affected |
| 新增上游blocker | no；继续为`S08-E-I04-PAYLOAD-SCHEMA-01`与`S08-E-I04-PRODUCER-EVENT-BINDING-01` |
| 当前协议计数 | 保持`33/60 defined_with_affected_open`；Query `14/14`；Consumer `3/9`；`0/60`无条件complete；I04为`in_progress_S01-S06_with_affected_open`，不计入defined |
| 未进入内容 | concrete input字段、constructor/accessor、cross-field validation、digest construction、reference lookup/factory、visibility mapper、reservation/UoW、result/error/action及Step09 flow均未定义 |
| 正式/实现/测试/evidence | formal`03`保持frozen；代码、测试、compile/runtime evidence、commit、run_id、evidence alias与签署均`not_run_not_claimed` |
| 下一动作 | 立即停审；用户确认后只进入I04 §7，读取Step06 I04 concrete input与三个候选业务字段、六个control fields，Step07 assembler及可用resolver/factory/port，§6 canonical payload缺口与I03 §7粒度模板，审查application input shape、constructor/accessor和逐字段provenance；缺失owner继续affected-open |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S06_recorded_with_affected_open_waiting_user_before_I04_S07
```

未经用户明确确认，不得进入I04 §7；不得读取或写入I04后续小节、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §6 的历史 checkpoint；current 状态由下方 I04 §7 stop review 承接。

## 7. Concrete input shape and field provenance

### 7.1 Concrete input authority and current constructability

`ConsumeGovernanceAuditContextInput` 的目标角色是 application 内部、process-local、
按值移动的 matching service input。它只能由
`ObservationInboundInputAssembler::consume_governance_audit_context` 一次性构造，
再由 `ObservationInboundEventService::consume_governance_audit_context` 按值消费；
它不是 wire DTO、Governance event、持久化 row、resolver response、replay payload、
transport completion、evidence alias 或 report handoff。

Step 06 已经固定每个 Consumer input 物理重复六个 control fields：

```rust
// Required field prefix only; this is not a complete Rust declaration.
context: ObservationOperationContext,
request_digest_candidates: RequestDigestCandidates,
source_ref: ObservationSourceRef,
source_version_ref: Option<ObservationSourceVersionRef>,
schema_version: SchemaVersion,
occurred_at: ObservedAt,
```

本节不能把该 field prefix 发布为只有六个字段的完整
`ConsumeGovernanceAuditContextInput`。I04 必须携带 owner-approved 的
operation-specific body-free observation；当前上游既没有可命名的 canonical payload
字段集合，也没有 concrete event binding。若把未闭合的业务字段直接删除并返回一个
control-only input，会让任意通过 header 的 Governance event 看起来具有相同 I04 语义，
等价于绕过 §6 的 payload blocker。

当前 constructability 裁定如下：

| constructability question | current answer | consequence |
|---|---|---|
| 六个 control fields 的类型与排列是否可定位 | yes；来自 Step 06 Consumer family contract | 可固定 target field prefix 和跨字段不变量，但尚不能单独构成 I04 input |
| canonical I04 operation-specific field set 是否可命名 | no；`GovernanceAuditContextPayload` 只有 use-site | 不发布完整 struct、完整 constructor 或 `into_parts` 签名 |
| matching assembler 是否可从 current Governance event 构造 header | no；event-to-I04 binding 缺失 | 在 typed payload decode 和 input construction 前 fail closed |
| assembler 是否可构造完整本地 evidence reference | no；assembler 无 I/O/ID mint，producer 无本地 identity/state authority | 当前 `governance_evidence_ref` 从 input target 删除，等待最小 upstream DTO 与 local relation owner |
| semantic digest 是否可形成 | no；owner/profile/material/order 未裁定 | 不接受 required/optional `DigestSummary` 参数，也不生成 request candidates |
| local visibility 是否可形成 | no；它依赖 local policy/gap/result authority | 从 producer-facing input 删除，不允许默认值 |
| current I04 input 是否 implementation-ready | no | `ConsumeGovernanceAuditContextInput` 继续仅作为 Step 06/07 callable use-site；不得创建可实例化占位类型 |

这里的“删除”是对 Step 06 当前候选 input row 的 authority 修正，不是宣称最终 I04
没有业务字段。最终 operation-specific fields 必须由上游 payload 与 finite event binding
先给出最小、body-free、逐字段有 authority 的 schema，再由本仓审查哪些字段可以直接进入
application input，哪些只能作为 service-side lookup/factory selector。

### 7.2 Six Consumer control fields

六个 control fields 均属于 Observability application input，但其原始 authority 分散在
static registration、C-03 trusted delivery、validated envelope 和 application-private
canonicalizer/context factory。它们不能由一个 generic header map、payload fallback 或
service-side reconstruction 代替。

| input field | authoritative source | exact construction / validation | forbidden substitution | current status |
|---|---|---|---|---|
| `context` | matching assembler 内的 crate-private `ObservationOperationContextFactory::for_inbound_event` | 使用 fixed I04 operation、C-03 trusted actor、validated dedup key、write-profile request digest、`ObservationInboundEventIdentity(I04, Governance, source_event_ref)` 与 optional trace 一次构造 | entry-created context、payload actor、route/topic string、Governance subject/state、post-construction setter | target owner closed；I04 construction blocked by binding/payload/digest |
| `request_digest_candidates` | crate-private `ObservationDigestCanonicalizer::request_candidates` | 只在 exact event/header/schema/payload 全部验证后，对唯一 I04 canonical material 生成一次；context 只复制其 write digest | raw envelope/event bytes、Governance semantic digest、topic/offset、debug/serde hash、current-profile-only candidate | owner known；I04 material/profile unresolved |
| `source_ref` | finite Governance-event-to-I04 binding 产出的 validated shared header | 保留完整 `ObservationSourceRef`，并与 producer/event/source-version registration 逐项验证 | outbound `subject_ref` cast、payload任意ref、reference external ref、topic、actor或ref prefix | type known；concrete binding open |
| `source_version_ref` | binding owner 可选产出的 typed shared header | `Some` 时 nested producer/source 必须精确等于 `Governance` 和当前 `source_ref`；token 保持 opaque | Governance `source_cursor`、event/schema version、occurred-at、offset、row version或local clock | type known；mapping/comparator open |
| `schema_version` | exact I04 producer-event/schema/discriminator registration | header-before-payload 阶段命中唯一 supported schema 后无损复制；constructor 只接受该 exact slot 已验证的值 | Governance event version cast、`V1`/latest/default、payload sniffing或第二decoder | type known；registration open |
| `occurred_at` | authenticated binding 提供并规范化的 event occurrence observation | typed validation 后原样保留；不参与 source-version 排序、request digest 或 local transition time | arrival/delivery/retry time、local `ClockPort::now()`、cursor、outbox creation time或schema version | type known；Governance source authority open |

以下 header/context 值不再作为独立 input fields 重复：

| non-repeated value | lossless location | why it is not repeated | forbidden replacement |
|---|---|---|---|
| `consumer_name` / operation | static slot plus `context.operation_name()` | exact I04 operation 已由 route/body binding 与 context 持有 | free string、handler type name、payload discriminator |
| `source_event_ref` | `context.inbound_event_identity()` | Consumer secondary identity 已持有 exact event ref | dedup key、outbox ref、message id、offset或payload ref |
| `producer_family` | static I04 map plus inbound event identity | 必须为 `Governance`，重复字段会产生可漂移 authority | payload producer、topic namespace、source family cast |
| `dedup_key` | `context.idempotency_key` / logical operation scope | 与 request digest 分离并用于 atomic reservation | source event、trace、cursor、digest或arrival time |
| `actor_ref` | `context.actor_ref` | 只来自 C-03 trusted delivery，payload 无提交权 | Governance subject、credential label、producer family或process identity |
| `trace_ref` | `context.trace_ref` | optional correlation metadata 原样复制 | Governance trace record、`core_trace_id`任选/拼接、source event或business causation |

`ObservationProducerFamily::Governance` 只证明当前 delivery 处于已认证 producer
namespace。它不证明 payload 内容正确、Governance decision 有效、evidence 真实、reference
已解析、visibility 可公开或本地 UoW 可接受。

### 7.3 Candidate business-field diagnosis

Step 06 I04 row 当前列出的三个 business fields 混合了 producer observation、
Observability local reference state、semantic digest 与 response disclosure authority。
逐字段裁定如下：

| Step 06 candidate | canonical object facts | I04 input disposition | exact closure needed | forbidden shortcut |
|---|---|---|---|---|
| `governance_evidence_ref: GovernanceArtifactEvidenceReference` | 完整对象包含本地生成的 `boundary_ref_id`、`reference_snapshot_state_ref`、local state、optional gap/visibility reason 及 optional digest | **从 current producer-facing concrete input target 删除**；未来 input 只可携带上游 owner 发布的最小 typed selector/observation，完整 local reference 必须在 service-side authorized relation 中 load/create/refresh | upstream schema给出 family + body-free safe ref 等最小字段；Step06/07补 `ReferenceSubjectRef` mapping、sole-row lookup、ID/factory authority、missing/ambiguous规则和fake/durable parity | 直接反序列化完整对象、信任 producer local refs/state/reason、临时mint、按ref prefix/digest绑定 |
| `digest_summary: DigestSummary` | `DigestSummary` 是本仓 body-free semantic digest type，不是 request digest；reference 内部已另有 `Option<DigestSummary>` | **当前不进入 constructor**；最终只能选择 upstream-owned canonical digest 或 local canonicalizer 两条路径之一，并明确 required/optional；不能先保留 required 字段等待实现猜 owner | 固定 digest purpose、profile、material、field order、encoder、single-computation owner，以及 incoming/reference digest 的 absent/equal/conflict矩阵 | hash raw Governance body/event、复制 request digest、复制 reference optional digest、empty/default digest或双 owner择优 |
| `visibility: VisibilitySurface` | public read/diagnostic/handoff/export response surface；`kind/gap/degraded`来自 local domain/application policy 与真实 persisted gap | **从 I04 input 删除**；若 producer 需要表达自身可见性，只能声明另一个 upstream-owned typed observation，service 再由 local policy 收窄为 `VisibilitySurface` | Step06/07移除错误 input use-site；后续 local result/view mapper按 policy decision、gap与degraded source生成，不把它作为 event truth | producer提交本地 surface、默认 `Visible`/`Restricted`、absence-as-visible、按Governance state/event name推导authorization |

current Step 07 依赖面不能补齐上述三项：

1. `GovernanceArtifactEvidenceResolver::resolve_governance_artifact_evidence` 的输入已经是
   完整 `GovernanceArtifactEvidenceReference`，其 `EvidenceSafeSummary` 还会复制同一
   `boundary_ref_id/reference_family/external_safe_ref`。它只能 refresh/assess 一个已存在的
   local reference，不能从 producer DTO 创建该 reference。
2. `ReferenceMaintenanceRepository::find_current_snapshot_by_subject` 需要完整
   `ReferenceSubjectRef`。current payload 没有 owner-approved 的
   `Governance payload -> ReferenceSubjectRef` mapper；assembler 也禁止调用 repository。
3. `GovernanceArtifactEvidenceReference::from_external_ref` 还需要本地 boundary identity
   和 snapshot ref。current `IdGeneratorPort` 没有
   `new_governance_artifact_evidence_reference_id`，也没有 I04 first-create/uniqueness path；
   该缺口由既有 `S08-E-I04-REFERENCE-AUTHORITY-01` 承接，不新增重复 affected ID。
4. `VisibilitySurface` 的 factory 只接受 local decision/gap/degraded source；assembler 是
   synchronous、I/O-free，且没有 visibility policy/repository dependency，因此无法在 input
   assembly 阶段合法产生该值。

### 7.4 Constructor and accessor boundary

Step 06 的 family rule 要求每个 concrete input 只有一个 crate-private atomic constructor。
I04 的最终 constructor 形状必须满足下列模板，但 comment 位置必须先由 canonical payload
owner 与本仓 authority review 替换为有限、具名、typed 参数；当前不得把该模板落成可编译
占位实现：

```rust
impl ConsumeGovernanceAuditContextInput {
    // Target shape only; not a current callable signature.
    pub(crate) fn from_assembled(
        context: ObservationOperationContext,
        request_digest_candidates: RequestDigestCandidates,
        source_ref: ObservationSourceRef,
        source_version_ref: Option<ObservationSourceVersionRef>,
        schema_version: SchemaVersion,
        occurred_at: ObservedAt,
        /* exact owner-approved I04 operation fields */
    ) -> Result<Self, ApplicationError>;
}
```

在 operation fields 可命名之前，禁止用 `T`、`impl Trait`、`serde_json::Value`、map、
untagged enum、`Vec<(String, String)>`、generic reference 或 optional-field bag 填补 comment。
也禁止只实现六字段 constructor；那会把“上游 schema 缺失”误写为“合法空 payload”。

最终 `from_assembled` 必须在零 I/O 条件下重新校验：

1. `context.operation_name()` 精确为 I04 Consumer operation。
2. `context.inbound_event_identity()` 必须为 `Some`，且 consumer、producer 分别精确为
   I04 与 `Governance`；source event 不得为空或由 dedup/transport identity替代。
3. `context.request_digest()` 必须与
   `request_digest_candidates.write_digest()` 精确一致；constructor 不重新编码、不切换
   profile，也不接受 caller-supplied digest。
4. `source_version_ref` 为 `Some` 时，其 producer/source 必须与 `Governance` 和
   `source_ref` 逐字段一致；constructor 不比较 cursor/time/string 大小。
5. `schema_version` 必须已经由 exact I04 producer-event registration 验证；constructor
   不做 current/latest fallback 或尝试另一个 payload decoder。
6. 所有 owner-approved operation fields 必须已通过 canonical typed validation 与必要的
   non-I/O cross-field checks；不接受完整 producer-constructed local reference、local
   visibility、raw body、actor、credential、locator或业务结论。

字段保持 private。entry 只能看到 matching assembler 返回的 opaque concrete input，不能
取得 accessor；matching service implementation 才能使用 crate-private读取面。最终读取面
必须遵循：

| accessor category | required form | reason / restriction |
|---|---|---|
| control borrows | `context()`、`source_ref()`、`source_version_ref()`、`schema_version()`、`occurred_at()` 的 crate-private immutable selectors | 只读且保持typed role；无setter、无string/raw view |
| digest transfer | 一个 exact consuming decomposition 在 service 内把 `RequestDigestCandidates` 移交 atomic reservation | candidates 不 Clone、不持久化、不暴露给entry；borrow-only accessor不能替代后续按值transfer |
| operation fields | 在 canonical field set 确定后，由同一个 exact consuming decomposition 一次移出 | 不创建generic payload accessor或第二business carrier |
| public surface | none | 不实现public getters、serde、`Default`、generic `From/Into`、cross-operation conversion或回转wire DTO |

因为 consuming decomposition 必须在 Rust 返回类型中逐项列出 operation fields，当前也不能
发布完整 `into_parts(self)` 签名。关闭
`S08-E-I04-CONTROL-FIELD-SOURCE-01` 时，Step 06/07 必须同时给出完整 struct、
`from_assembled` 与唯一 consuming decomposition；只补六个 borrow getter 不能关闭该项。

### 7.5 Field provenance and cross-field validation matrix

| observed condition | last valid stage | input construction result | required classification boundary | forbidden recovery |
|---|---|---|---|---|
| concrete Governance event -> I04 binding absent | authenticated static producer family | no input；不选择decoder | producer-event binding / registration failure | 全订阅、任选event、按topic或payload形状路由 |
| canonical payload declaration/registration absent | validated header fields only | no typed envelope、no input | unsupported/unregistered schema boundary | 本仓声明同名DTO、generic map或多decoder试探 |
| source-event/source/schema/dedup/occurred-at mapping缺任一项 | Governance outbound envelope | no shared I04 header、no input | binding failure before payload decode | outbox/cursor/arrival/trace字段互相补位 |
| producer不是`Governance`或slot/consumer不匹配 | static slot/header gate | no input | typed operation/producer mismatch | 改投其他Consumer、payload override或string compare |
| `source_version_ref`与producer/source不一致 | validated header relation | no input | typed consistency rejection | cursor/time/row-version排序后选择一方 |
| payload提交完整`GovernanceArtifactEvidenceReference` | typed decode schema boundary | reject schema/authority violation；no input | body-free/reference authority failure | 丢弃local字段后暗中接受、临时mint或resolver补齐 |
| payload提交`VisibilitySurface` | typed decode schema boundary | reject local-surface authority violation；no input | invalid payload/authority boundary | default/narrow后继续、absence-as-visible |
| semantic digest owner/profile/material未确定 | operation-field validation | no request candidates、no context、no input | digest authority affected / fail closed | hash raw event、复制request/reference digest或empty digest |
| incoming semantic digest与loaded reference digest均存在且不同 | service-side relation gate after a future valid input | no accepted relation mutation | typed reference conflict | last-write-wins、任选、重算后覆盖 |
| context operation/event producer不匹配 | atomic constructor | constructor error；no partial input | application invariant failure | setter、rebuild context或更换event identity |
| context digest与write candidate不匹配 | atomic constructor | constructor error；no partial input | application digest invariant failure | 重新hash、选另一个candidate或覆盖context |
| 六个control fields均合法但operation field set仍不可命名 | constructor boundary | no constructor call；I04仍不可构造 | affected-open design gate | 构造control-only input或placeholder payload |
| assembler试图调用resolver/repository/clock/id generator | assembly boundary | implementation contract violation；no input | application boundary failure | 把I/O包装成validator或从current truth补字段 |

其中“loaded reference digest”只描述未来 service-side relation gate，不授权 §7 调用
repository、resolver或执行 state transition。reservation、UoW、domain mutation、stored result、
receipt、error recovery与C-05 action均留在后续小节；本节只证明哪些数据可以进入 input，
以及何时必须在 input 之前停止。

### 7.6 §7 stop review

| check | conclusion |
|---|---|
| §7 scope | `pass_with_affected_open`；只覆盖application concrete input constructability、六个control fields、三个候选业务字段、constructor/accessor与cross-field fail-closed matrix |
| complete Rust input | intentionally not declared；只有六字段target prefix可定位，canonical operation fields仍不可命名，control-only struct会绕过payload gate |
| control fields | target source、角色、非重复值与constructor invariants已逐项固定；concrete binding/material/accessor传播仍由既有affected承接 |
| `governance_evidence_ref` | 从producer-facing input target删除；完整local reference必须经未来最小upstream DTO与service-side authorized relation构造/解析 |
| `digest_summary` | 当前不进入constructor；等待唯一upstream-or-local owner、profile/material/order及与reference optional digest的冲突矩阵 |
| `visibility` | 从I04 input删除；只允许后续local policy/gap/result mapper生成response surface |
| Step07 dependency sufficiency | insufficient for construction；resolver需要完整local ref，repository需要未映射subject，ID generator/factory first-create path未闭合，assembler本身禁止I/O |
| affected / blocker | 六项I04专属affected原样开放：2项`open_upstream_internal`、4项`open_internal_affected`；§7没有新增或关闭ID |
| 当前协议计数 | 保持`33/60 defined_with_affected_open`；Query `14/14`；Consumer `3/9`；`0/60`无条件complete；I04为`in_progress_S01-S07_with_affected_open`，不计入defined |
| 未进入内容 | canonical digest字段顺序与identity/correlation、redaction、reservation/UoW、domain transition、result/error/receipt/action、Step09 flow及I04 §8以后均未定义 |
| 正式/实现/测试/evidence | formal`03`保持frozen；代码、测试、compile/runtime evidence、commit、run_id、evidence alias与签署均`not_run_not_claimed` |
| 新增上游blocker | no；继续为payload schema与producer-event binding两项，reference first-create缺口归既有reference authority affected，不新增重复ID |
| 下一动作 | 立即停审；用户确认后只进入I04 §8，先读current Step06 digest canonicalizer/context/idempotency owner、I03 §8粒度模板、I04 §6~§7的payload/input fail-closed结论，审查canonical request digest、logical/secondary identity与correlation；不得进入§9或后续内容 |
| 当前提交 | 不需要；用户未要求提交 |

该段已降为 §7 historical checkpoint；current 状态由下方 §8 stop review 承接。

当前恢复点为：

```text
Step08_S08-E_I04_S01-S07_recorded_with_affected_open_waiting_user_before_I04_S08
```

未经用户明确确认，不得进入I04 §8；不得读取或写入I04 §9以后、I05~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

## 8. Canonical request digest, identity and correlation

本节只处理 I04 的 request digest material、幂等与事件身份分层、以及 correlation
metadata 的边界。它不重新定义 Governance 业务事实、不创建新的 `DigestSummary`
owner，也不把未注册的 `GovernanceAuditContextPayload` 变成可解码协议。由于 §6 已确认
I04 canonical payload 与 concrete producer-event binding 尚不存在，本节采用“固定公共
frame、未决业务payload、缺失即 fail closed”的设计状态；未决部分不会被旧正式文档或
Step 06 use-site 的三字段表隐式补齐。

### 8.1 Canonical material authority and current constructability

#### 8.1.1 Authority split

I04 需要同时维护三种容易被混淆的 material。它们可以在同一 admission chain 中出现，
但不是同一 value type、同一 owner 或同一 equality relation：

| material | current owner | purpose | current I04 disposition |
|---|---|---|---|
| `RequestDigest` / `RequestDigestCandidates` | `application::digest::ObservationDigestCanonicalizer`，kind=`DigestMaterialKind::InboundConsumerRequest` | 对经过完整 header/payload/redaction admission 的 inbound request 做幂等与 replay identity | 只在完整I04 payload segment可命名后生成；当前保持未构造 |
| `DigestSummary` | `contracts::refs` carrier + 其声明的语义material owner | 表示一个已授权的 body-free semantic material、reference或immutable surface的摘要 | 不能转换为`RequestDigest`；I04旧`digest_summary`候选当前不进入producer-facing input |
| supplied / upstream digest | 只能由明确的上游字段级contract授权 | 作为待验证的外部语义声明或payload member | 不能成为本地request digest的第二owner；缺authority或冲突时拒绝/保持未决 |

`contracts::refs`只承载 `RequestDigest`、`DigestSummary` 等 typed carrier，不拥有
I04 canonical material 的字段顺序、frame writer 或 hash algorithm。canonical material、
profile 与 candidate 生成仍唯一归 `application::digest`。I04 service 不能通过复制、转换、
字符串化或比较内部hex值来跨越 `RequestDigest` 与 `DigestSummary` 的边界。

#### 8.1.2 Target frame, not a current wire declaration

Step 06 的 v1 framing 仍是唯一可复用的公共 framing：顶层成员顺序为
`profile`、`kind`、`value`；I04 的 kind token 固定为 `inbound_consumer_request`。
下面只展示本节可以安全固定的 target shape；`payload` 标记为 unresolved 并不是可实现的
placeholder，也不是允许 generic map 解码的授权：

```text
{"profile":1,"kind":"inbound_consumer_request","value":{
  "operation":"consume_governance_audit_context",
  "actor_ref":<trusted ActorSafeRef>,
  "producer_family":"governance",
  "source_event_ref":<typed SourceEventRef>,
  "source_ref":<typed ObservationSourceRef>,
  "source_version_ref":<explicit absent/present ObservationSourceVersionRef>,
  "schema_version":<registered I04 consumer SchemaVersion>,
  "payload":<unresolved owner-approved body-free I04 payload>
}}
```

该 frame 是 canonicalizer 的设计目标，不是对当前 wire payload 的声明。尤其要注意：

1. `schema_version` 是 I04 consumer slot 的 registered schema version，不等于
   Governance outbound event version；两者只有经过显式 binding contract 才能建立关系。
2. `source_event_ref` 是 secondary delivery identity 的一部分，不能被 `dedup_key`、
   `outbox_ref`、topic、offset 或 payload 内任意 ref 代替。
3. `source_version_ref` 必须保留显式 absent/present；没有 comparator 时不能进行本地排序，
   但它仍是已验证 request material 的一部分。
4. `actor_ref` 只来自 C-03 trusted delivery；payload、Governance subject 或 transport
   peer 没有覆盖权。
5. `payload` 未通过 canonical owner、finite producer binding 和 body-free validation
   前，整个 frame 不产生 digest candidate，也不创建 reservation。

#### 8.1.3 Current constructability matrix

| gate | current finding | allowed consequence | forbidden consequence |
|---|---|---|---|
| kind/operation owner | 可定位；`DigestMaterialKind::InboundConsumerRequest`与I04 operation token均有唯一target | 固定frame prefix与canonicalizer入口 | 用route、handler名、Rust ordinal或display text取代operation |
| shared prefix types | operation、trusted actor、producer family、source event、source、optional source version、schema version均可定位 | 固定字段顺序、typed validation与排除规则 | 从Governance outbound字段按名称cast，或用arrival/transport事实补值 |
| I04 payload declaration | 只有`GovernanceAuditContextPayload` use-site，没有canonical wire/schema/encoder/registration | 保持unresolved，admission fail closed | 复用`governance_evidence_ref; digest_summary; visibility`旧行，或创建同名本地DTO |
| producer-event binding | 十三个Governance outbound event没有到I04的有限binding/adapter | 不选择decoder、不生成candidate | 全订阅、任选事件、字段并集或aggregate event |
| semantic digest field | `DigestSummary` authority与request material/order是两个问题 | 分别登记两个affected，禁止类型转换 | 以业务摘要代替request digest或从reference optional digest复制 |
| request candidate generation | 只有在所有typed payload/redaction gates通过后才允许一次生成 | `RequestDigestCandidates` opaque transfer到reservation lane | raw envelope/body/debug/transport hash、各层重复计算 |

当前结论是 `not_constructible_with_fixed_prefix`，而不是“空payload合法”。缺少
operation-specific segment 时，assembler 必须在 typed payload admission 前停止；六个
control fields 不能单独构成 I04 input 或 digest material。

### 8.2 Fixed included prefix and unresolved payload segment

#### 8.2.1 Included prefix and order

以下顺序继承 Step 06 inbound Consumer material 的公共规则，并针对 I04 固定为唯一
target order。`payload` 是第 8 个成员，但其内部顺序当前不可声明：

| ordinal | member | inclusion | source and validation |
|---:|---|:---:|---|
| 1 | `operation` | yes | `consume_governance_audit_context` stable token from the finite operation map |
| 2 | `actor_ref` | yes | C-03 trusted `ActorSafeRef` and its owner encoder; never payload-derived |
| 3 | `producer_family` | yes | authenticated static/binding value exactly `Governance` |
| 4 | `source_event_ref` | yes | independently validated typed source-event reference; also secondary identity |
| 5 | `source_ref` | yes | validated typed source boundary; preserve complete wrapper and type discriminator |
| 6 | `source_version_ref` | yes, explicit absent/present | optional typed relation bound to exact `Governance` + `source_ref`; no local ordering |
| 7 | `schema_version` | yes | exact registered I04 schema slot; not a default/latest fallback |
| 8 | `payload` | target yes, internal order unresolved | only the canonical upstream payload owner may define members and encoder |

The prefix is not a second envelope. It is the typed value consumed by the sole
`ObservationDigestCanonicalizer`; the shared inbound envelope remains the source of validated
fields, and the digest material writer must not reread raw transport bytes.

#### 8.2.2 Operation-specific payload is intentionally unresolved

The old Step 06 row and the `REQ-I-04` fixture listed
`governance_evidence_ref; digest_summary; visibility`. §7 already rejected that shape for the
producer-facing input. §8 makes the digest consequence explicit:

| old candidate | current digest disposition | reason |
|---|---|---|
| `governance_evidence_ref` | not admitted as a current payload member | complete object contains Observability-local identity, snapshot state and gap/visibility reason; Governance producer cannot construct it |
| `digest_summary` | not admitted as a substitute for request material | semantic digest owner, purpose, profile/material relation and optional-reference conflict rule remain unresolved; `DigestSummary` is not `RequestDigest` |
| `visibility` | not admitted as producer-owned material | `VisibilitySurface` is a local response/policy surface, not Governance event truth; assembler has no policy/I/O authority |

This does not decide that the final I04 payload has no operation-specific members. The final
payload may contain a smaller upstream-owned body-free reference/observation DTO, or a formally
registered adapter may expose a finite typed projection. Either route must provide, before this
section can become implementation-ready:

1. one canonical declaration and wire grammar;
2. one finite producer-event-to-I04 binding, including source/event/schema/version mapping;
3. one redaction and unknown-field policy that excludes Governance body, decision and control
   truth;
4. one fixed nested field order and Option/presence grammar for the digest profile;
5. one exact mapping from validated payload fields to the future concrete I04 input or to a
   service-side authorized local relation.

Until all five are available, `payload` remains unresolved and no profile-specific candidate is
valid. A compatible-looking JSON object, a typed alias in `contracts`, or a decoder selected by
event name does not satisfy this gate.

#### 8.2.3 Canonical encoding rules inherited from Step 06

Once the owner-approved payload exists, the material writer must use the existing v1 rules:

| rule | I04 requirement |
|---|---|
| top-level frame | exact `profile=1`, `kind=inbound_consumer_request`, then `value` |
| member order | fixed writer order; never reflection, arbitrary map iteration or `Debug` output |
| typed ref | owner/type discriminator plus validated opaque value; inner string alone is insufficient |
| `Option<T>` | explicit absent/present tag; absent, null, empty and default remain distinct |
| enum | owner-defined stable token or tagged value; no numeric ordinal/display alias |
| bounded value | bounded canonical writer; raw event/body/provider bytes are forbidden |
| digest output | lowercase hexadecimal wrapper in `RequestDigest`; no conversion to `DigestSummary` |
| candidate generation | calculate readable profile candidates once after all admission gates; pass opaque candidates onward |

Changing the prefix order, payload member set, nested order or presence rule is a profile
compatibility change and requires the existing digest profile review. It cannot be silently changed
inside I04 or by a transport adapter.

### 8.3 Excluded material and digest redlines

The following exclusion set is fixed even though some values are available at runtime. Exclusion
means they cannot influence I04 request identity; it does not mean the value can be silently
discarded from every other owner surface.

| excluded material | independent authority | why it cannot enter request digest |
|---|---|---|
| `dedup_key` | `ObservationIdempotencyScope` | logical idempotency key, not semantic request material |
| `occurred_at` | producer event metadata | observation time is not source-version order, local mutation time or payload meaning |
| `trace_ref` and any `core_trace_id` | correlation/trace owner | correlation is not request identity; the two trace vocabularies cannot be concatenated or selected by convenience |
| delivery id, message id, topic, partition, offset, attempt, ack state and retry time | transport/worker layer | transport facts change across redelivery while the admitted event meaning may remain the same |
| supplied `RequestDigest` or any transport-provided digest | canonicalizer | self-inclusion is circular; supplied value is verified against the local candidate and then is not material |
| `DigestSummary` used only as a carrier or reference optional digest | semantic digest owner | value-type and material-purpose boundary; it cannot be copied into request digest |
| generated local boundary/reference/snapshot/H10/result/outbox/quarantine refs | respective local owners | local effects must not change replay identity of the inbound request |
| repository row version, committed cursor, UoW ref, reservation ref, claim/fence/lease | persistence/coordination owners | coordination metadata is not producer semantic input |
| Governance decision, policy, gate, control, review, conclusion, nonconformity, trace body or raw event body | L1-governance and redaction boundary | Observability is observation/audit projection only and cannot hash or retain forbidden truth |
| safe-summary body, provider response, resolver diagnostics, error text, raw labels and stack data | safe-summary/resolver/error owners | a typed safe ref does not grant body access; diagnostics are not stable semantic material |
| local current snapshot lookup/result and computed `VisibilitySurface` | local reference/policy/result owners | digest must be reproducible from admitted input, not from mutable current truth or response mapping |

The exclusion set applies before canonicalization. An error, quarantine, retry or dead-letter
branch may not first serialize, truncate or hash forbidden material and then claim it was redacted.
If a header or payload gate fails, the allowed result is an ephemeral typed rejection/dependency
surface with no request digest and no reservation. A safe `source_event_ref` may be retained only
where the owning rejection carrier explicitly permits it.

### 8.4 Logical, secondary, source and future local identities

#### 8.4.1 Identity relation set

I04 has several independent identities. Only the first two participate in the idempotency
reservation boundary; none may be collapsed into one opaque string:

```text
logical idempotency scope:
  (ConsumeGovernanceAuditContext, effective ActorSafeRef, dedup_key)

secondary delivery identity:
  (ConsumeGovernanceAuditContext, Governance, source_event_ref)

source stream identity:
  (Governance, source_ref)

optional source-version relation:
  (Governance, source_ref, source_version_ref)

future operation/reference identity:
  owner-approved body-free payload reference(s), if and only if the upstream contract defines it

future local observation identity:
  Observability-generated boundary/reference/snapshot/result/outbox refs, created only by their
  local owners after admission; never an inbound identity
```

| identity | authority | request digest relation | forbidden substitution |
|---|---|---|---|
| logical scope | trusted operation context + `dedup_key` | excluded from digest; used to locate reservation scope | source event, trace, digest, arrival time or payload ref |
| secondary event identity | validated I04/`Governance` binding + `source_event_ref` | included in digest; established atomically with logical reservation | dedup key, outbox ref, message id, offset or topic |
| source stream | validated `source_ref` and producer family | included as prefix relation | subject/evidence ref, event id or local snapshot |
| source version | typed optional source-version relation | included with explicit Option tag; no local comparison implied | `schema_version`, cursor, occurred-at, row version or freshness |
| payload/reference identity | future canonical upstream payload owner | included only as typed payload member after registration | ref prefix, debug text, semantic similarity or current lookup |
| local reference/snapshot identity | Observability local factory/repository owner | excluded from request digest unless a future owner explicitly declares an immutable input reference as payload material | producer-supplied local id, temporary mint or digest-derived id |

The logical scope and secondary event identity must be established in the same atomic reservation
operation and must point to the same reservation row. I04 must never create a new logical row and
then attach a secondary identity as an alias. A missing or conflicting secondary identity is a
typed admission/consistency condition, not permission to omit the event identity.

#### 8.4.2 Request digest and business digest are separate relations

The following equal-looking cases remain distinct:

| comparison | current rule |
|---|---|
| `RequestDigest` vs `DigestSummary` with identical profile/hex bytes | not comparable as interchangeable values; no conversion or copy |
| request prefix with a future semantic payload digest member | nested semantic digest may be included only under the upstream payload contract; it does not become the outer request digest |
| reference optional digest vs request digest | no equality shortcut; service-side reference relation must use the declared semantic digest owner and its own conflict matrix |
| generated local reference id vs source event id | never equal by prefix, suffix or derivation; each remains owner-scoped |
| same semantic reference with a different event identity | not automatically replay; requires explicit source/version/equivalence proof in a later service flow |

This section therefore closes only the type and identity separation. It does not close
`S08-E-I04-DIGEST-AUTHORITY-01`, which still owns the unresolved semantic digest question.

### 8.5 Identity and digest conflict matrix

The matrix below fixes the admission consequence and the no-write boundary. It does not introduce
new public outcome variants or preselect the later C-05 action mapper; those remain downstream
contracts. “No mutation” includes no local reference mint, no snapshot transition, no H10/evidence
append, no outbox append and no result completion.

| observed relation | required classification at this boundary | digest / identity check | allowed side effect |
|---|---|---|---|
| first delivery; no matching logical or secondary reservation | eligible candidate only if payload and all material gates pass | generate one `RequestDigestCandidates`; reserve both identities atomically later | no effect before reservation/UoW gate |
| same logical scope, same current-profile candidate and same secondary identity, stored result compatible | replay candidate | compare retained row profile using the matching candidate; do not recanonicalize from current truth | read exact stored surface later; no new mutation |
| same logical scope and identity, reservation still in flight | in-flight candidate | same scope/event identity and compatible candidate | typed delayed/in-flight surface later; no second writer |
| same logical scope but different request digest | logical idempotency conflict | compare candidate for retained profile; no winner selection | no mutation |
| same secondary event identity but different digest or operation/producer binding | secondary identity conflict | exact `(consumer, producer, source_event_ref)` must remain stable | no alias row and no mutation |
| same dedup key with a different `source_event_ref` | logical/secondary mismatch | dedup is scope only; event ref remains independently required | fail closed; no mutation |
| same source stream/version with different payload material | source/version consistency conflict | source/version relation cannot be resolved by timestamp or arrival order | no overwrite and no mutation |
| source-version present but producer/source differs from `Governance`/`source_ref` | header consistency rejection | reject before payload digest | no digest, reservation or mutation |
| source-version absent and no-version policy is not explicitly registered | unsupported binding/dependency condition | preserve explicit absent; do not synthesize a token | no digest, reservation or mutation |
| supplied digest differs from the local write candidate | supplied-digest mismatch | compare only after local typed canonicalization; never trust supplied value | no reservation or mutation |
| incoming semantic `DigestSummary` differs from a future reference optional digest | semantic reference conflict | do not compare it as `RequestDigest`; use future semantic owner’s typed matrix | no accepted relation mutation; later mapper decides surface |
| local generated reference/result/outbox differs while admitted input is unchanged | not an input conflict | local effects are excluded from material | preserve owner-local lifecycle; never recalculate request digest |
| payload/owner/order unresolved | ownerless protocol boundary | no valid canonical material exists | fail closed before candidate/reservation |

The exact public receipt/result spelling for these branches is deliberately not decided in §8.
What is fixed is the invariant that no branch may select a winner, mint a replacement identity,
or rebuild a request from current truth merely to avoid a conflict.

### 8.6 Correlation separation

Correlation metadata is useful for joining logs, metrics, traces and audit projections, but it is
not a second authority for identity, digest, source truth or visibility. The following table is the
I04 separation contract:

| value | authoritative source | allowed I04 use | cannot replace |
|---|---|---|---|
| effective `ActorSafeRef` | C-03 trusted worker delivery | operation context, logical scope and least-authority audit metadata | Governance subject, producer family, dedup key, source event or trace |
| `trace_ref` | validated shared inbound metadata | optional correlation context and safe telemetry/audit linkage | actor authority, request digest, source event, source version or business relation |
| `core_trace_id` if present in an upstream envelope | its own registered trace owner | only through an explicit typed binding to the shared trace field | silently concatenated/selected trace identity or source event |
| `source_event_ref` | authenticated I04 producer binding | secondary delivery identity and safe event correlation | dedup key, source stream, subject/reference identity or trace |
| `source_ref` | shared source boundary contract | source stream/object relation | event id, subject, snapshot or current lookup |
| `source_version_ref` | typed producer/source version relation | opaque version metadata and digest prefix | freshness, occurred time, cursor, row version or trace |
| `dedup_key` | delivery/idempotency metadata | logical reservation scope | digest, source event, trace or semantic payload identity |
| `occurred_at` | producer event occurrence metadata | source-time metadata where a later owner explicitly retains it | local clock, version order, retry time or digest material |
| local snapshot/reference/result refs | Observability local owners | post-admission linkage and safe returned markers | producer identity, source event, trace or request digest |

Correlation rules:

1. An absent `trace_ref` remains explicit absence; I04 must not synthesize one from
   `source_event_ref`, `dedup_key`, actor or current clock.
2. A malformed or unregistered trace value fails at the shared typed header gate. It must not be
   replaced with another trace vocabulary or downgraded into a string label.
3. If `trace_ref` and an upstream `core_trace_id` are both present, their relation requires a
   declared typed adapter. I04 does not concatenate, prefer or hash them by local convention.
4. Correlation values may be copied to an owner-approved safe telemetry/audit marker only after
   redaction and public-surface checks; they never grant permission to persist Governance body or
   decision material.
5. `trace_ref`, `occurred_at`, transport attempt and local result refs are all excluded from the
   request digest even when they are retained by another owner.

### 8.7 Affected and closure review

#### 8.7.1 Current I04 affected register

§8 preserves the two upstream blockers and the four existing local affected. It adds one
independent local affected for request-digest field order/material propagation. The new ID is not
merged into semantic digest authority because those questions have different owners and closure
proofs.

| ID | status | §8 finding | closure required | forbidden shortcut |
|---|---|---|---|---|
| `S08-E-I04-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | canonical `GovernanceAuditContextPayload`、wire grammar、encoder与registration不存在 | L1-governance或明确跨项目contracts owner提供唯一声明与兼容注册 | 本地alias、generic map或use-site反推 |
| `S08-E-I04-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | 十三个Governance outbound event到I04的有限binding、source/event/schema映射不存在 | 上游提供finite binding/adapter，或正式拆分Consumer | 全订阅、任选、字段并集或aggregate event |
| `S08-E-I04-REFERENCE-AUTHORITY-01` | `open_internal_affected` | 完整本地reference含Observability identity/state/reason，producer无权构造 | Step06/07收敛最小upstream DTO与本地factory/relation | 反序列化完整local reference或临时mint |
| `S08-E-I04-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | 六个control fields尚无I04 concrete struct/constructor/accessor传播证明 | Step06/07补齐exact input与唯一consuming decomposition | control-only input、generic map或entry/service重构 |
| `S08-E-I04-DIGEST-AUTHORITY-01` | `open_internal_affected` | `DigestSummary` semantic owner、profile/material与reference optional digest关系未闭合 | 唯一裁定upstream semantic digest或local semantic canonicalizer及冲突矩阵 | 把`DigestSummary`复制成`RequestDigest`或双owner择优 |
| `S08-E-I04-VISIBILITY-AUTHORITY-01` | `open_internal_affected` | local `VisibilitySurface`被错误放入producer-facing input，local policy/gap mapper缺失 | Step06/07/后续local mapper提供lossless policy/gap source | producer提交、默认Visible或从Governance state推导 |
| `S08-E-I04-DIGEST-ORDER-01` | `open_internal_affected` | I04 request material的公共prefix、未决payload segment、固定排除集与一次candidate传播尚未由assembler/reservation/replay共同消费 | Step06/07/Step09传播本节唯一frame/order/exclusion；assembler只生成一次opaque candidates，reservation/replay按retained profile比较 | raw envelope hash、各层重算、把dedup/trace/time/local effect加入digest，或沿用旧三字段顺序 |

#### 8.7.2 Why the new affected is independent

`S08-E-I04-DIGEST-AUTHORITY-01`回答的是“业务语义摘要由谁拥有、它与 reference
optional digest 如何比较”；`S08-E-I04-DIGEST-ORDER-01`回答的是“外层 inbound request
如何按固定字段顺序形成 `RequestDigestCandidates`，哪些字段必须排除，以及各阶段是否
共同消费同一组 candidates”。前者即使关闭，也不能自动证明后者已经传播到 assembler、
reservation repository 和 replay probe；反之亦然。因此合并这两个 ID 会掩盖闭环缺口，
本节明确分开登记。

#### 8.7.3 Closure checklist

| check | current conclusion |
|---|---|
| public frame owner | fixed at Step 06 `application::digest`; no new I04 canonicalizer |
| fixed prefix | operation/actor/producer/source-event/source/source-version/schema order recorded |
| payload segment | unresolved; no valid candidate can be generated |
| excluded set | dedup/occurred/trace/transport/supplied digest/local effects/body explicitly excluded |
| logical scope | `(I04 operation, effective actor, dedup_key)` and separate from digest |
| secondary identity | `(I04 consumer, Governance, source_event_ref)` and same reservation row as logical scope |
| source/version | typed relation retained; no comparator or timestamp substitute |
| semantic digest | separate from request digest; existing authority affected remains open |
| correlation | trace/actor/event/source/version/time remain distinct; no fallback conversion |
| redaction | forbidden body/truth cannot be serialized or hashed on any failure path |
| implementation/test/evidence | design-only; no implementation, test, run, evidence alias or acceptance claim |

§8 没有关闭任何 affected，也没有增加新的上游 blocker。新 ID 是本仓 internal affected；
两个 L1-governance `open_upstream_internal` blocker 与其余四项 local affected 继续开放。

### 8.8 §8 historical stop review

| 检查项 | 结论 |
|---|---|
| §8 scope | `pass_with_affected_open`；只覆盖request digest frame、included/excluded material、identity分层、conflict boundary与correlation separation |
| canonical frame | `DigestMaterialKind::InboundConsumerRequest`、v1 framing与I04公共prefix已固定；operation-specific payload segment仍unresolved |
| old Step 06 I04 row | 明确降为historical conflict；`governance_evidence_ref`、`digest_summary`、`visibility`不能直接进入current producer-facing material |
| RequestDigest / DigestSummary | authority、purpose、value type严格分离；不转换、不复制、不互相替代 |
| logical / secondary identity | logical scope使用`dedup_key`且排除于digest；secondary identity使用`source_event_ref`且进入digest；两者必须同一reservation boundary |
| source/version/correlation | source event、source ref、optional source version、actor、trace、occurred-at各自保留typed role；无按名cast、fallback或隐式合并 |
| exclusion/redaction | raw body、Governance truth、transport facts、supplied digest与local effects均不得参与canonicalization或错误分支hash |
| affected | 既有六项保持开放；新增`S08-E-I04-DIGEST-ORDER-01=open_internal_affected`；无affected关闭、无新上游blocker |
| 当前协议计数 | 保持`33/60 defined_with_affected_open`；Query `14/14`；Consumer `3/9`；`0/60`无条件complete；I04仍不计入defined |
| 未进入内容 | reservation/UoW、domain transition、result/error/receipt/action、redaction runtime flow、Step09函数级flow及I04 §9以后均未定义 |
| formal/implementation/test/evidence | formal `03` frozen；代码、测试、compile/runtime evidence、commit、run_id、evidence alias与签署均`not_run_not_claimed` |
| 当前恢复点 | `Step08_S08-E_I04_S01-S08_recorded_with_affected_open_waiting_user_before_I04_S09` |
| 下一动作 | 立即停审；用户明确确认后才进入I04 §9，只读取并处理下一小节规定的输入，不得顺带进入§10、I05~I09、S08-F/G、Step09或formal回填 |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S08_recorded_with_affected_open_waiting_user_before_I04_S09
```

未经用户明确确认，不得进入 I04 §9；不得读取或写入 I04 §10 以后、I05~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段已降为 §8 historical checkpoint；current 状态由下方 §9 stop review 承接。

## 9. Redaction and body-free admission

本节把 I04 的 redaction-first 与 body-free 边界收敛为字段级 admission contract。它只
定义 decoder、assembler 和公共错误投影必须遵守的允许材料、校验顺序与失败分类，不定义
§10 的 reservation/UoW、本地 reference mutation、stored result、receipt 或 C-05 action。
`body-free` 不是“先接收 Governance 正文再隐藏”，而是 I04 从 transport-to-contracts
边界开始就不接纳、缓存、hash、截断、base64、持久化或转发任何可恢复的 Governance
decision/policy/control/review/conclusion/nonconformity/trace/evidence body。

由于 `GovernanceAuditContextPayload` owner 与 finite producer-event binding 仍缺失，本节
只能固定 shared header allowlist、未来 payload owner 必须满足的 negative schema、以及
ownerless 时的 fail-closed 行为。它不为 payload 猜字段，也不把旧 Step 06 三字段行变成
redaction 后即可接受的 schema。

### 9.1 Allowed material surface

| material 类别 | 当前允许内容 | 允许用途 | 明确不代表 |
|---|---|---|---|
| trusted delivery metadata | C-03 `ActorSafeRef`、固定 I04 operation、`ObservationProducerFamily::Governance`、validated source-event/source/optional-version/schema/dedup/occurred-at/optional-trace | header admission、operation context、logical/secondary identity、safe correlation | Governance actor、治理结论、payload真实性、transport ack或source acceptance |
| registered body-free payload | 未来 canonical owner 明确列出的 event-specific typed refs、finite enum/marker与显式 presence；当前为 ownerless，实际允许集合为空 | owner-approved payload admission与后续 exact local relation input | Governance aggregate/body、local reference/state、visibility、evidence linkage、retention或report truth |
| process-local digest material | 通过全部 header/payload/redaction gate 后一次生成的 `RequestDigestCandidates` | reservation/replay admission；只按 opaque carrier 传播 | raw frame hash、`DigestSummary`、transport digest或业务真实性证明 |
| local safe relation output | future service-side resolver/factory 产出的 body-free local reference/summary relation | 只供后续 local policy/UoW 判断；不得回填 wire payload | producer input、Governance truth、source mutation或外部验收 |
| public safe error context | finite operation/schema/error code、owner允许的已验证 typed safe refs、已有 reason/gap ref | ephemeral rejection、safe log/metric/span投影 | payload值、error文本、完整digest、topic/offset、credential或stack |
| local committed markers | 仅在后续 owner-approved UoW known-committed 后形成的 result/reference/history/outbox refs | 后续 stored receipt/result surface | source truth、Governance accepted、report signoff或真实 evidence alias |

在 canonical payload owner 发布 positive allowlist 前，I04 不存在“字段名看起来 body-free
所以接受”的分支。`nonconformity_ref`、`context_ref`、`trace_ref`、`handoff_marker_ref`等
Governance typed ref 也只能在具体 event-to-I04 binding 明确其角色后进入 payload；typed ref
本身不授予 I04 解引用正文或把它转换为 local reference 的权限。

### 9.2 Shared field admission and redaction matrix

| field / material | canonical source | admission / redaction rule | missing or invalid behavior | allowed downstream use |
|---|---|---|---|---|
| `actor_ref` | C-03 trusted worker context | 先于 payload 校验；不得来自 Governance payload、subject、credential或transport peer | missing/untrusted为authority rejection；payload不解码 | operation context与logical scope；safe surface仅在owner允许时引用 |
| `consumer_name` | static I04 registration | exact `ConsumeGovernanceAuditContext`；不得接受route、event name或default Consumer | mismatch为protocol rejection；不选择其他decoder | finite operation/error/metric dimension |
| `producer_family` | authenticated registration | exact `Governance`并与slot一致；payload不能覆盖 | unknown/mismatch为unsupported/rejected；不尝试其他family | secondary/source relation与finite safe metadata |
| `source_event_ref` | registered event binding | valid `SourceEventRef`且与concrete binding一致；不是outbox/delivery/offset identity | missing/malformed时可返回不含该ref的ephemeral rejection；不得mint | secondary identity、request digest及owner-approved safe receipt field |
| `source_ref` | registered source binding | complete typed source relation；不得由Governance subject union、payload ref或topic cast | missing/mismatch拒绝；payload不能补值 | request material与后续 authorized local relation |
| `source_version_ref` | optional registered binding | `Some`必须与Governance/source exact match；`None`显式保留；本节不排序 | malformed/mismatch拒绝；incomparable fail closed；不用cursor/time/row version补值 | request material中的typed optional relation |
| `schema_version` | finite I04 schema catalog | exact registration先于payload decode；Governance event version不可直接cast | unknown/ownerless为`UnsupportedSchemaVersion`安全面；无decode/digest | protocol surface与stored metadata，仅在owner明确时保留 |
| `dedup_key` | authenticated binding | valid logical key；与source event、trace、time分离且排除于request digest | malformed拒绝；不得从payload/hash/outbox生成 | logical reservation key；§9不执行reservation |
| `occurred_at` | registered occurrence mapping | typed observation time；不是source order、state version或local commit time | missing/malformed拒绝；不用arrival/local clock补值 | owner允许的source metadata；不进入request digest |
| `trace_ref` | explicit shared correlation binding | typed Option且角色保持不变；Governance trace record与core trace id无显式adapter时均不能转换 | malformed拒绝；absent保持absent；不得任选或拼接候选 | safe correlation only；不作identity、causation或truth |
| future payload fields | canonical payload owner + finite event binding | exact known fields、known order、duplicate拒绝、unknown拒绝、body-free type与cross-field relation全部通过 | ownerless/missing/unknown/duplicate/forbidden/mismatch均整条拒绝；无partial DTO | 只进入future typed payload/material/local relation路径 |
| `request_digest_candidates` | `ObservationDigestCanonicalizer` | 全部header/payload/redaction gate后生成一次；禁止读取raw frame/body/debug | canonicalization失败时无input/reservation/UoW | process-local opaque candidate carrier |
| generated local refs/state/visibility | respective Observability owners | admission阶段不得生成来补 incoming 字段；不得反向进入payload或digest | incoming 缺失时仍拒绝；不mint placeholder | 仅后续authorized local branch可生成或映射 |

`governance_evidence_ref`、`digest_summary`、`visibility`继续遵守 §7~§8 的 authority
裁定：完整 local reference 与 local visibility 不在 producer-facing input；semantic
`DigestSummary` owner 未闭合且不能替代 request digest。把这三个值先标记“redacted”并不会
改变其 owner，也不会使旧 input row 合法。

### 9.3 Ordered redaction-first admission gates

顺序是协议安全边界。前一阶段失败后不得继续解析后一阶段，也不得为了生成错误详情而
重新序列化 raw frame。所有阶段通过前，不存在 complete application input、digest candidate、
reservation 或 writer UoW。

| order | gate | exact obligation | failure ceiling |
|---:|---|---|---|
| 1 | bounded frame and static slot | exact I04 handler、frame size/bounds、no generic/default dispatch | finite protocol failure；不解释payload、不调assembler/service |
| 2 | trusted actor | C-03 actor存在、typed且适用于当前slot | authority rejection；payload保持opaque且不记录 |
| 3 | shared header shape | 十个shared字段的required/optional framing、typed wrapper与bounds有效 | malformed rejection；只保留finite field class/code |
| 4 | operation/producer equality | consumer name、operation与`Governance` static registration逐项一致 | rejected/unsupported；不改投其他Consumer |
| 5 | finite event/header binding | concrete Governance event到source-event/source/version/schema/dedup/time/trace关系已注册 | owner/dependency fail closed；不按字段名或topic构造adapter |
| 6 | schema/discriminator registration | exact I04 schema/version命中唯一decoder | `UnsupportedSchema`/safe error；不尝试latest、第二decoder或payload sniffing |
| 7 | payload owner availability | canonical declaration、encoder/decoder、positive field allowlist与compatibility存在 | ownerless fail closed；当前I04在此停止，不创建local alias |
| 8 | exact body-free decode | reject unknown/duplicate fields、raw body、unsafe nested value、header重复字段与noncanonical encoding | `BodyFreeBoundaryViolation`或finite invalid request；无partial payload/hash/debug dump |
| 9 | payload cross-field authority | 每个field由具体event拥有，typed relation与presence组合成立，producer无local authority字段 | typed relation/authority rejection；不drop字段后继续 |
| 10 | canonical material assembly | 只把validated header与owner-approved payload按§8固定frame/order组装 | encoding failure；不保存material bytes、不fallback旧三字段顺序 |
| 11 | request candidate generation | canonicalizer一次生成所有readable profile candidates | typed application error；无reservation/UoW，不hash raw transport |
| 12 | private input construction | six control fields与完整operation fields原子一致；constructor再次校验identity/schema/material | constructor rejection；禁止control-only input或caller mutation |
| 13 | handoff to future local admission | matching service按值消费input；§10才可讨论reservation/relation/UoW | §9不宣称任何durable result、receipt或transport action |

stage 5 的 missing binding、stage 7 的 ownerless payload、stage 8 的 malformed/forbidden body
是三个不同分类。一个结构相似的 JSON object 不能把 ownerless 变成 malformed；一个有效
Governance outbound payload 也不能绕过缺失的 I04 binding。当前生产材料必然在 stage 5
或 stage 7 fail closed，不能生成 request digest candidate。

### 9.4 Forbidden Governance and unsafe material matrix

| forbidden material | detection boundary | safe classification | durable/public consequence | forbidden shortcut |
|---|---|---|---|---|
| Governance decision、gate、policy、control、review、conclusion、nonconformity/action/verification body | producer adapter或payload decode | body-free boundary/invalid request | no input/digest/result/outbox/audit body；不得进入dead-letter payload | 从state/text推导local visibility、linkage、retention或report readiness |
| Governance trace body、audit/evidence body、report/handoff body | adapter/decoder/resolver | body-free boundary violation | raw content永不进入I04 storage/public surface | 只保存hash、摘要、截断/base64或“safe copy” |
| raw envelope/payload bytes、generic map、unknown/duplicate field value | frame/decoder | invalid envelope/request或body-free violation | no partial DTO、no retry payload、no diagnostic dump | 宽松serde、drop unknown后继续、hash bytes做dedup |
| producer-supplied local `GovernanceArtifactEvidenceReference`、snapshot state、gap/visibility/result | input assembly | authority/reference rejection | no local truth mutation；不保留producer local-looking value | 相同inner ref、prefix或digest即视为local object |
| unowned `DigestSummary`、reference optional digest或supplied request digest | payload/canonicalizer boundary | owner/digest mismatch | 不进入request material、error detail或receipt | 复制hex、择优、转换value type或空digest默认 |
| topic、endpoint、partition、offset、delivery attempt、ack/retry state、credential/config secret | worker/infra boundary | transport material excluded | 只能留在transport owner自己的redacted diagnostics；application/public均不可见 | 当source-event/dedup/trace/version或safe reason |
| provider/resolver body、safe-summary正文、raw labels、unbounded reason | resolver/diagnostic boundary | dependency/body-free rejection | 仅保留canonical safe ref、finite assessment/reason；无正文 | 解引用safe ref后写receipt/audit/log |
| stack trace、exception/SQL/provider text、debug/display dump | error/telemetry projection | safe diagnostic suppression/failure | 只映射finite error code与已存在safe refs | 把message截断、hash或放metric label |
| current local reference/snapshot row、repository cursor/version、local clock | service/replay boundary | consistency/dependency failure | 不修补payload，不重建digest，不覆盖source relation | current-row fallback、first-row-wins或arrival ordering |
| real run id、evidence alias、verdict、signoff、external acceptance | any I04 surface | forbidden authority claim | never generated or recorded by this protocol | 用local result/outbox/receipt暗示外部成功 |

I04 不创建 `QuarantineRef` 来保存 forbidden material。若后续 owner 明确提供一个已提交、
body-free 的 quarantine/safety marker，public surface最多引用该 marker与finite safe error；
缺少合法 owner时保持ephemeral rejection或no-completion affected。Worker选择 Retry、DeadLetter
或 Acknowledge 不能要求 application 回传 raw payload，也不能由 error severity反向制造marker。

### 9.5 Safe diagnostics, receipt, audit and outbox ceiling

#### 9.5.1 Safe diagnostics

允许出现在 log、metric label、span annotation 与 public error 的信息限于 finite
operation/consumer/producer/schema/phase/error code、bounded counts、已验证且owner允许披露的
typed safe refs、optional trace correlation、已有 reason/gap ref 和 commit certainty class。
`ObservationProtocolErrorSurface` 是唯一公共低基数错误目标；`ProtocolError`、
`ApplicationError`、provider exception或decoder文本均不得按 `Debug`/`Display` 外泄。

以下内容不得进入诊断面：payload/envelope bytes、field value/path string、Governance ref的
未验证字符串、decision/control/review/trace/evidence正文、digest expected/actual值、dedup key、
topic/offset、credential、endpoint、stack/SQL/provider message、真实run id、evidence alias、
verdict或signoff。即使 telemetry sink、fake adapter 或 test fixture提出该字段，也不能绕过。

#### 9.5.2 Receipt and durable surface ceiling

| branch class | currently allowed public material | explicitly forbidden | §9 durable status |
|---|---|---|---|
| pre-header/actor rejection | finite operation/error；`source_event_ref`仅在已合法解析且shared receipt允许时出现 | payload、raw header、untrusted ref、transport detail | ephemeral only；no digest/reservation/write |
| unsupported schema / ownerless payload | finite `UnsupportedSchemaVersion`或dependency/invalid-request safe error、validated safe header refs | payload sniff、unknown bytes、fabricated result/ref | ephemeral/no-completion；exact mapper留后续 |
| forbidden/malformed payload | `BodyFreeBoundaryViolation`或finite invalid request；仅已验证header metadata | offending field/value/body/hash、quarantine alias、retry payload | no accepted write；owner-approved body-free terminal marker尚未证明 |
| delayed dependency | finite dependency code、safe source/event/trace refs及recovery class | resolver/provider response、default local reference/visibility | only shared owner-approved surface；不得伪装Accepted |
| future accepted | committed stored result/receipt及owner-generated body-free refs | Governance truth/body、transport ack、external acceptance | 仅后续same-UoW known-commit设计可达；§9不定义 |
| replay | original validated stored surface + `Replayed` access overlay | re-decode body、current truth rebuild、fresh refs | 不重跑mutation/outbox/audit；后续小节闭合 |

#### 9.5.3 Local audit and outbox ceiling

pre-admission rejection、missing binding、ownerless payload、unsupported schema、forbidden body、
unknown/duplicate field与canonicalization failure均不得追加“accepted Governance audit”或成功
outbox。若安全 owner 允许记录 body-free blocked/quarantined marker，该 marker 的创建与同一
UoW/result/receipt关系必须由后续小节证明，不能由 §9 的拒绝分类自动推导。

未来 accepted I04 outbox 也只能从 known-committed Observability-owned local transition 的
immutable typed snapshot形成；publisher不得回读 current Governance truth或要求保存原payload。
本协议任何 public `Accepted` 只可能表示本地 observation/audit projection 已提交，不表示
Governance conclusion正确、evidence真实、report已交接、consumer已ack或外部验收通过。

### 9.6 Failure classification matrix

| condition | safe classification target | input / digest / reservation | local durable write | forbidden fallback |
|---|---|---|---|---|
| missing/untrusted actor | `ActorNotAllowed`或finite invalid request | payload不解码；none | none | payload actor、process identity、credential label |
| missing/malformed required header | `MissingRequiredField` / invalid request/reference | header-before-payload；none | none | route/topic/payload/current config补值 |
| wrong Consumer/producer | invalid request/unsupported finite surface | no alternate decoder；none | none | catch-all Consumer或跨family fallback |
| no finite Governance event binding | dependency/owner rejection；fail closed | no payload decode/digest/reservation | none | 全订阅、任选event、字段并集或topic推断 |
| unknown/unsupported I04 schema | `UnsupportedSchemaVersion` / `UnsupportedSchema` | no decode/digest/reservation | none | current/latest、第二decoder或event version cast |
| ownerless canonical payload | dependency/invalid-request safe surface；fail closed | no local DTO/input/digest/reservation | none | 在Observability声明同名payload或generic map |
| unknown/duplicate/forbidden payload field | `BodyFreeBoundaryViolation`或finite invalid request | no partial payload/hash/digest/reservation | none，除非未来已有合法body-free terminal marker | drop/truncate/hash/base64后继续 |
| source/version/event relation mismatch | invalid reference/consistency surface | no candidate/reservation | none | cursor/time/row version/ref prefix替代 |
| explicit optional field absent | 只有owner schema明确optional才保留`None` | 可按owner-approved grammar继续；不得补值 | no claim from absence | empty ref、default enum或current lookup |
| required operation field missing | missing field/invalid request | no complete input/digest/reservation | none | control-only input或local placeholder |
| canonical request material encoding fails | finite application invalid/consistency error | no candidate/reservation | none | hash raw frame、旧三字段order或新dedup key |
| safe diagnostic mapping lacks total case | entry failure / affected stop | no fabricated public error or completion | none | generic internal message、Retry默认或string reason |
| forbidden material already persisted elsewhere | consistency/manual-intervention class；正文仍不披露 | I04不得读取、复制或重新投递 | no cleanup/overwrite from I04 | 读取后redact、自动删除或DeadLetter正文 |

`None`、missing、malformed、ownerless、unsupported、unavailable、relation mismatch 与 forbidden
body 保持不同语义。特别是 ownerless payload 不能归类为 `UnsupportedSchema` 后尝试其他
decoder；explicit optional absence也不能变成local default、current lookup或`Visible`。

### 9.7 Affected and closure review

| review item | current conclusion | affected / blocker |
|---|---|---|
| shared header allowlist | fields、authority、validation和diagnostic ceiling已固定 | concrete source/event/schema mapping仍由`S08-E-I04-PRODUCER-EVENT-BINDING-01`承接 |
| payload positive allowlist | 当前无法声明；ownerless时actual accepted payload set为空 | `S08-E-I04-PAYLOAD-SCHEMA-01`保持`open_upstream_internal` |
| local reference/digest/visibility | producer无local authority，旧三字段不能通过redaction获得合法性 | reference/digest/visibility三项既有affected保持开放 |
| redaction order | header/binding/schema/owner/body-free/material/input顺序已固定 | 新增`S08-E-I04-REDACTION-PROPAGATION-01=open_internal_affected` |
| propagation proof | decoder、canonicalizer、input constructor、public error/receipt、telemetry与dead-letter必须消费同一allowlist/exclusion ceiling | Step06/07/Step09/Step15/Step16须给出exact mapper、forbidden-call scan与test cut；本节不声称runtime proof |
| safe error owner | 复用`ObservationProtocolErrorSurface`及既有finite code，不新建I04 error enum | exact per-condition mapper与recovery/action仍留后续 result/error/action小节 |
| quarantine / dead-letter | no raw-body carrier；不mint `QuarantineRef`，不由error severity选择action | shared quarantine/indeterminate/action affected保持开放 |
| durable audit/outbox | pre-admission zero accepted write；future accepted只允许known-committed local snapshot | UoW/result/outbox关系尚未进入，shared affected保持开放 |
| new upstream blocker | none；仍是payload schema与producer-event binding两项 | new ID only tracks local propagation, not a new schema owner |
| implementation/test/evidence | design-only；未运行实现、测试、scan或runtime evidence | `not_run_not_claimed` |

`S08-E-I04-REDACTION-PROPAGATION-01` 与既有 affected 相互独立：payload schema回答“哪些
字段存在且由谁拥有”，digest order回答“哪些 admitted 字段按何顺序进入 request material”，
新 ID 回答“同一 allowlist/exclusion 是否在 decode、input、error/receipt、telemetry、persistence
和dead-letter各出口都不可绕过”。即使前两项关闭，也不能自动证明错误/诊断/重试路径没有
泄露；反之，只有negative redaction规则也不能凭空提供payload schema。

### 9.8 §9 stop review

| check | conclusion |
|---|---|
| §9 scope | `pass_with_affected_open`；只覆盖redaction-first admission、allowed/forbidden material、field/gate order、safe diagnostics与failure classification |
| accepted payload | current actual set为空；canonical owner与finite binding缺失时在decode/digest/reservation前fail closed，不接受generic map或旧三字段row |
| body-free invariant | Governance/raw/provider body不得进入input、digest、log、metric、trace、error、receipt、audit、outbox、persistence、retry或dead-letter；hash/truncate/base64不构成redaction |
| missing semantics | absent、missing、malformed、ownerless、unsupported、unavailable、mismatch和forbidden保持不同分类；不得默认、lookup或fallback |
| public error | 复用finite `ObservationProtocolErrorSurface`；不传播Protocol/Application/provider文本，不发明I04错误enum |
| affected | 既有七项I04 affected保持开放；新增`S08-E-I04-REDACTION-PROPAGATION-01=open_internal_affected`；无关闭项、无新上游blocker |
| current protocol count | 保持`33/60 defined_with_affected_open`；Query `14/14`；Consumer `3/9`；`0/60`无条件complete；I04仍不计入defined |
| not entered | reservation/UoW、local transition、stored result、receipt reachability、error recovery、C-05 action与Step09 function flow均未定义 |
| formal/implementation/test/evidence | formal`03` frozen；代码、测试、compile/runtime evidence、commit、run_id、evidence alias与签署均`not_run_not_claimed` |
| current checkpoint | `Step08_S08-E_I04_S01-S09_recorded_with_affected_open_waiting_user_before_I04_S10` |
| next action | 立即停审；用户确认后只进入I04 §10，先读current Step06/07 I04 relation/repository/UoW owner、I03 §10粒度模板与I04 §7~§9；不得进入§11或后续批次 |
| current commit | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S09_recorded_with_affected_open_waiting_user_before_I04_S10
```

未经用户明确确认，不得进入 I04 §10；不得读取或写入 I04 §11 以后、I05~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该恢复点现为 §9 的历史 checkpoint；current 状态由下方 §10 stop review 承接。

## 10. Local UoW and durable landing boundary

本节只回答 I04 在“本地写什么、由谁写、如何保持原子性”上的当前可达边界与未来
最小骨架，不定义新的 Governance payload、local aggregate、history family、cursor namespace、
stored result、outbound event 或 transport action。当前 canonical payload 与 finite producer-event
binding 均不存在，因此 §9 得出的 actual accepted payload set 为空；对应地，I04 当前实际可达
的 accepted write set 也为空。

这不是把 I04 定义成永久 zero-write Consumer。它表示在 durable landing 的唯一 owner 和
operation-specific accepted branch 尚未闭合前，设计必须停在 admission failure，不能把 HLD、
冻结正式 `03` 或 Step 07 repository 的“可用能力”拼成一条未经授权的 writer path。

### 10.1 Current reachable write set is empty

当前 delivery 最远只能完成 shared header 的安全校验和有限错误分类；它不能越过
event binding、schema owner、typed payload decode、complete input 与 request digest gate。
因此下表中的 durable operation 均不可达：

| phase / local material | current reachability | exact reason | required current behavior |
|---|---|---|---|
| finite Governance event -> I04 binding | no | `S08-E-I04-PRODUCER-EVENT-BINDING-01`开放 | 在typed payload decode前fail closed；不任选十三个event |
| canonical `GovernanceAuditContextPayload` decode | no | `S08-E-I04-PAYLOAD-SCHEMA-01`开放 | 不使用generic map、旧三字段row或结构相似payload |
| complete `ConsumeGovernanceAuditContextInput` | no | operation fields及六个control fields尚未共同闭合 | 不发布control-only input，不调用matching service |
| canonical `RequestDigestCandidates` | no | operation-specific payload segment与一次传播证明缺失 | 不hash raw body、header子集、旧fixture或debug bytes |
| `ObservationUnitOfWorkManager::begin` | no current writer call | service没有complete input，不能进入writer lane | pre-admission失败保持zero-UoW；若外围错误地预开handle也必须零stage回滚 |
| `ObservationIdempotencyRepository::reserve` | no | 无完整scope + inbound identity + digest candidates | 不建立placeholder reservation或只按dedup key占位 |
| local relation/version lookup | no authorized target | primary object和exact repository relation未选定 | 不查询后按“第一条存在记录”决定落点 |
| primary local mutation | no | 无owner-authorized accepted transition | 不创建/更新projection、linkage、snapshot或gap |
| cursor allocation | no | commit class只能从actual accepted primary writes派生 | 不分配Observation或Reference cursor |
| H-family record | no | 无accepted transition与record-family唯一映射 | 不mint H3/H8/H10或generic audit record ref |
| stored result / completed reservation | no | 无accepted local result，且reservation不可达 | 不保存空success、durable rejection或completion pointer |
| accepted receipt / outbox / C-05 action | no | local commit不存在且result/action mapper尚未闭合 | 不返回Accepted，不append outbox，不选Acknowledge/Retry/DeadLetter |

允许的当前输出只可能是 body-free、finite、ephemeral 的 protocol/dependency failure surface，且
仍须遵守 §9 的 safe diagnostic ceiling。它不是 accepted audit event、durable rejection、
quarantine body、evidence record或Governance处理结论。没有 durable row 也不能被描述成“已忽略”
或“已成功 no-op”；当前唯一结论是 writer admission 不可构造。

### 10.2 Durable-target source conflict and authority

现有材料只给出候选域，没有给出 I04 唯一 durable landing：

| source | current statement | usable authority | §10 disposition |
|---|---|---|---|
| formal `02-概要设计.md` / current HLD interface skeleton | I04可形成`GovernanceArtifactEvidenceReference`、`ReferenceSnapshotState`和audit stale marker，横跨audit/evidence与reference-support域 | 说明高层职责与no-Governance-write边界，不是operation-specific transition/repository mapping | `affected_input`；不得任选reference或audit lane |
| Step 06 `ObservationInboundEventService` ownership table | I04/I05共同落在body-free audit/evidence linkage与visibility/gap surface | 说明service允许依赖的能力族，不说明I04具体primary、branch或record | `affected_input`；family grouping不能授权writer |
| Step 06 F2 operation writer registry | governance Consumer只在accepted H3 linkage/projection branch或accepted H10 snapshot branch可写对应record | 只定义“若已存在该accepted branch”的record gate | conditional capability；不能反向制造accepted branch |
| Step 07 `AuditEvidenceRepository` | 提供projection/linkage lookup、stage与H3 append | exact callable capability | method存在不等于I04获准调用 |
| Step 07 `ReferenceMaintenanceRepository` | 提供snapshot lookup/stage与H10 append | exact callable capability | method存在不等于I04获准调用 |
| frozen formal `03-详细设计.md` | 曾列“boundary snapshot / audit or reference native record / gap”等可选落点 | 旧正式内容已被冻结，且该行本身存在多选歧义 | `historical_material`；不得作为current selector |

`GovernanceArtifactEvidenceReference` 是 body-free boundary value，不因名字含`EvidenceReference`
就自动成为 repository primary；`ReferenceSnapshotState` 的存在也不证明本次 Governance event
具有 subject、freshness decision、safe summary provenance和snapshot transition authority。类似地，
“visibility/gap surface”不等于本次必须创建`GapState`，HLD中的audit stale marker也不等于H3。

本节新增：

```text
S08-E-I04-DURABLE-LANDING-01=open_internal_affected
```

该 affected 必须由 Step 06/07 affected repair 与后续 Step 09 flow 共同关闭，并且一次性给出：

1. 唯一 primary local object，以及每个有限 accepted/no-op/deferred branch 的transition；
2. exact repository lookup/stage method、semantic relation key、missing/duplicate/mismatch precedence与expected version来源；
3. 对每个accepted mutation的H-family映射，或显式、owner-authorized的`explicit_no_record`；
4. 从actual primary footprint派生的`ObservationCommitClass`与唯一cursor namespace；
5. accepted、no-op、deferred、rejected分支是否允许stored result和reservation completion；
6. result中的changed refs、record refs、gap/reference/linkage refs和可选outbox refs的唯一来源；
7. optional outbound event的committed source、typed encoder与same-UoW outbox relation，或明确无outbox。

它与`S08-E-I04-REFERENCE-AUTHORITY-01`不同：后者解决最小上游refs如何合法形成完整本地
reference；新ID解决完整input通过后究竟修改哪个本地对象、调用哪个repository、写哪个record、
使用哪个cursor和返回哪些changed refs。即使reference构造闭合，也不能自动选择snapshot、linkage、
projection或gap作为primary。

### 10.3 Future reservation and writer admission

只有 payload schema、finite event binding、complete private input、request digest candidate传播和
durable landing mapping均闭合后，I04 future writer 才允许使用 shared atomic admission surface。
逻辑顺序如下：

1. matching assembler完成§6~§9的header、binding、schema、redaction、field authority与digest gate；
2. matching service获得不可再重构的complete private input；
3. `ObservationUnitOfWorkManager::begin()`建立一个fresh local UoW；
4. `ObservationIdempotencyRepository::reserve(...)`在同一UoW内原子绑定logical scope与
   `ObservationInboundEventIdentity`，并接收完整`RequestDigestCandidates`；
5. 只有`ObservationIdempotencyReserveOutcome::Acquired`进入operation-specific landing；
6. `Replay`、`Conflict`、`InFlight`均离开writer lane，不加载/修改primary，不分配cursor，
   不构造record/outbox或新stored result；incoming UoW按shared owner规则回滚；
7. `Replay`只能通过原reservation指向的`StoredObservationResultRef`调用
   `ObservationStoredResultRepository::get_result`，不能从current local truth重建；
8. exact landing mapper再执行唯一relation lookup、transition、stage、record/follower plan；
9. 任一owner、relation、version、branch或result surface仍不完整时，回滚整个UoW，不把
   `Acquired`解释为业务Accepted。

reservation只证明本次logical/event identity获得writer admission，不证明 Governance event
有效、不证明local transition已发生，也不选择 evidence/reference/gap lane。不得在reserve前按
current repository状态猜digest，或在reserve后把`Acquired`直接映射为receipt outcome。

### 10.4 Target-neutral one-UoW skeleton

在 durable landing owner 闭合后，I04 accepted writer 必须遵守以下共同骨架；方括号表示必须由
`S08-E-I04-DURABLE-LANDING-01`填入的operation-specific owner，而不是留给实现者的自由选择：

```text
validated complete I04 input
  -> begin one fresh ObservationUnitOfWork
  -> atomically reserve logical scope + inbound event identity
  -> Replay / Conflict / InFlight leave the new writer lane
  -> [resolve exact primary relation and committed repository version]
  -> [obtain owner-authorized finite decision and apply exact local transition]
  -> [stage the exact primary post-state with expected version]
  -> derive commit class from actual accepted primary footprint
  -> assign at most one cursor required by that commit class
  -> [assemble and append only the explicitly mapped H-family record, or proven no-record]
  -> [stage one registered outbox record/payload pair, or an explicit empty outbox set]
  -> construct and save the exact StoredObservationResult
  -> mark the same reservation Completed with that result_ref
  -> commit the one UoW
  -> return the committed local result to the later worker action mapper
```

Shared callable ownership与I04未决部分必须保持分离：

| concern | existing exact callable / owner | I04 current authority |
|---|---|---|
| UoW lifecycle | `ObservationUnitOfWorkManager::{begin, commit, rollback}` | future shared use only；当前writer不可达 |
| one cursor | `ObservationUnitOfWork::{assign_observation_cursor, assign_reference_cursor}` | 不得调用，直到actual primary footprint唯一导出commit class |
| atomic admission | `ObservationIdempotencyRepository::{reserve, mark_completed}` | future shared use only；不得以dedup-only reservation降级 |
| immutable replay | `ObservationStoredResultRepository::{save_result, get_result}` | result schema/branch映射后才能save；Replay只get exact ref |
| audit/evidence capability | `AuditEvidenceRepository`的typed lookup/stage/H3 append方法 | capability visible，I04 operation-specific调用未授权 |
| reference capability | `ReferenceMaintenanceRepository`的typed lookup/stage/H10 append方法 | capability visible，I04 operation-specific调用未授权 |
| primary/record assembly | Step 06 `ObservationRecordAssemblyPlan`与operation writer registry | 只消费已独立确定的accepted footprint；不能替I04选择landing |
| outbox follower | shared typed immutable snapshot + same-UoW append owner | I04没有registered outbound source时必须为空，不得发明event |

一个UoW只允许一次成功cursor allocator call。若future landing是reference-only snapshot mutation且
全部record obligation为H10，才可能导出Reference class；只要存在任一observation-owned primary，
整个mixed UoW必须是Observation class，H10也使用同一个Observation cursor。没有primary mutation
时F2必须拒绝record/follower-only work，不能靠audit、outbox或result反向升级成accepted commit。

### 10.5 Forbidden primary, record and cursor inference

| tempting inference | why it is invalid now | required decision before any call |
|---|---|---|
| `GovernanceArtifactEvidenceReference` -> create/update `EvidenceLinkage` | boundary value不是linkage identity、projection relation、purpose、consumer scope或P4/P5 decision | 唯一linkage relation、transition、expected version与H3 mapping |
| Governance event -> append H3 | H3需要accepted projection/linkage branch及same-UoW post-state；event arrival不是audit append proof | exact accepted input + post-state + record obligation |
| HLD mentions`ReferenceSnapshotState` -> stage snapshot | 缺subject relation、existing/new identity、freshness action、safe summary/source version与CAS semantics | exact snapshot lookup/create branch、decision与H10 mapping |
| reference-looking payload -> append H10 | H10只记录真实snapshot mutation；`PreserveCurrent`、unresolved或reference decode本身无H10 | accepted snapshot transition/create proof |
| visibility/not-visible -> create `GapState` or H8 | local visibility与gap lifecycle有独立policy、identity、relation和transition owner | exact gap owner、P12/H8 accepted branch与repository mapping |
| audit/reference capability both available -> choose by first row found | repository availability不构成operation dispatch，且会造成fake/durable与data-order差异 | finite operation-specific landing map and duplicate/mismatch precedence |
| no record mapping -> write generic audit marker | H-family是有限typed records，无generic append；record不能补偿owner gap | explicit mapped family or owner-approved`explicit_no_record` |
| choose Observation cursor because Consumer is an observation | cursor由actual primary family决定，不由protocol family/name决定 | independently derived `ObservationCommitClass` |
| choose Reference cursor because input is a reference | mixed or observation-owned mutation必须使用Observation class；input type不决定namespace | complete primary footprint |
| allocate both cursors and let repositories use their own | 违反one-UoW one-cursor invariant并制造双重提交顺序 | exactly one derived class and allocator call |

`explicit_no_record`也不是默认分支。它必须由operation-specific owner明确说明哪一个accepted primary
transition不产生H-family obligation，并仍满足primary、result、completion和commit关系。当前没有该
裁定，因此不得把“映射不清”改写为“允许无record提交”。

### 10.6 Stored result, completion and outbox boundary

当前 reachable write set为空，所以不存在I04 stored result、completed reservation、accepted receipt
或outbox。未来accepted branch只有在primary和record/follower inventory完整后，才能形成以下关系：

| material | required source | same-UoW / ordering rule | forbidden substitute |
|---|---|---|---|
| changed refs | exact accepted post-state和explicit gap/linkage/reference transition | 在result assembly前冻结，不能commit后reload | current rows、input refs、record refs互相代替 |
| history refs | 本次实际materialized且已stage的mapped H records | 与primary使用同一cursor/UoW；no-record时显式空 | “expected record”或新mint但未append的ref |
| outbox refs | separately registered I04-compatible committed source与typed encoder | pair在result前同UoW stage；无owner时显式空 | event name猜测、current truth重建或publisher后查找 |
| stored result | body-free immutable I04 local result，绑定operation/actor/digest/reservation及exact refs | `save_result`必须在`mark_completed`前成功 | empty success、Governance outcome、transport receipt |
| completed reservation | 同一`ObservationIdempotencyReservation` + exact stored result ref | `mark_completed`后仍须同一UoW commit | `Reserved + result_ref`中间态、另一个UoW补写 |
| public receipt / access overlay | committed stored result经后续exact result mapper形成 | known commit后才能报告fresh；Replay保留original stored outcome | current primary/outbox重构、把Replay写回stored bytes |

outbox不是每个accepted Consumer的默认必需项。只有S08-F存在匹配event、明确committed source、
deterministic typed encoder和same-UoW pair mapping时才允许stage；否则`outbox_refs=[]`是显式结果，
不是实现遗漏。反之，若owner将某accepted branch的outbox定义为mandatory，append/encode失败必须
回滚primary、record、result和reservation completion，不能降为best effort。

### 10.7 Commit, rollback and exact probe matrix

下表描述future writer的原子性要求，不声称I04当前可进入这些分支：

| failure / branch point | writes that may exist in open UoW | required visible durable result | permitted continuation |
|---|---|---|---|
| current binding/schema/payload/input/digest gate fails | none；不得begin writer UoW | none | ephemeral finite failure only；no transport action selected here |
| `begin` fails | none | none | shared application failure；不得reserve或return accepted |
| `reserve` returns Replay | reservation read/compare only | only original previously committed set | rollback incoming handle；`get_result(exact result_ref)`；no new effects |
| `reserve` returns Conflict/InFlight | no accepted mutation | no new row from this attempt | rollback incoming handle；preserve finite conflict/delayed classification |
| durable landing still unowned or relation missing/ambiguous/mismatched | acquired reservation may be staged | none after rollback | design/consistency/dependency failure；no default target or completion |
| owner-approved no-op/deferred branch lacks stored result authorization | reservation only | none after rollback | do not convert to Accepted or durable empty result |
| primary transition/stage or expected-version check fails | reservation and possibly local candidates staged | none after rollback | no cursor/record/result/completion visible |
| cursor allocation or mapped record assembly/append fails | primary candidate may be staged | none after rollback；allocator may leave only an invisible nonreused gap | no alternate family/cursor or record omission |
| mandatory outbox staging fails | primary/record candidates may be staged | none after rollback | no best-effort event or success without refs |
| `save_result` fails | primary/record/outbox candidates may be staged | none after rollback | do not call`mark_completed` |
| `mark_completed` fails | result may be staged | none after rollback | do not commit a reserved/result intermediate state |
| commit is known not committed | all candidates discarded | none | only owner-defined known-no-write recovery; no fresh receipt |
| commit is known successful | exact planned set atomically visible | primary + mapped record/followers + result + completed reservation | return validated local result to later mapper; no Governance truth claim |
| commit outcome or rollback outcome is unknown | visibility is unknown | unknown; neither success nor absence may be asserted | no C-05 completion under current carrier; exact probe or indeterminate stop |

允许的commit probe只能读取idempotency/result owner，并使用完整稳定关系
`(operation, trusted_actor, dedup_key, source_event_ref, request_digest)`验证同一个reservation和
stored-result pointer。它不得从current EvidenceLinkage、AuditProjection、ReferenceSnapshotState、
GapState、H3/H8/H10、outbox或到达顺序推断commit。

| exact probe result | I04 continuation |
|---|---|
| completed reservation + exact immutable result validates | 返回原stored surface的Replay access；不重跑transition、record或outbox |
| no committed reservation is proven | 仅在probe owner明确给出known absence时进入known-no-write分类；是否retry留给后续flow policy |
| matching reservation remains in flight | delayed/in-flight surface；不启动第二writer |
| result pointer missing/mismatched或result relation无效 | typed consistency defect；不得从current truth补建result |
| `Unknown` / probe unsupported | 保持indeterminate；当前不得构造`InboundConsumerCompletion`或选择terminal action |

### 10.8 Fake and durable semantic parity

§10只定义conformance目标，不声称fake或durable adapter已实现、测试或通过。两类adapter必须对
同一输入给出相同的branch classification与visible-set语义：

| semantic surface | fake / controlled obligation | durable adapter obligation | parity redline |
|---|---|---|---|
| current zero-write reachability | ownerless payload/binding在service前停止，global maps不变 | 不开启writer transaction或产生reservation/audit row | fake不得因方便接受旧三字段input |
| atomic logical + event reservation | 同一critical section执行唯一关系与digest compare | unique constraints / transaction原子绑定两类identity | 两次独立reserve、event alias row或dedup-only key |
| exact target relation | enforce complete semantic key、zero/one/many及version | bounded unique lookup + committed version/CAS | first-row-wins、unordered scan、error-as-absence |
| primary transition | 只调用owner-authorized finite branch并保留same candidate | 同一transaction stage exact post-state | direct map mutation、repository-side hidden domain transition |
| one cursor | 第二次或跨namespace调用必失败；rollback gap不可见且不复用 | allocator和transaction共同强制同一规则 | fake重用数字或durable为每表分配cursor |
| typed record parity | 只有mapped family，记录借用same post-state/cursor | typed append method；无generic bytes append | fake省略mandatory record或durable触发器暗写 |
| UoW visibility | commit前所有staged facts对committed reads不可见 | one atomic transaction/equivalent boundary | partial visibility、result先于primary可见 |
| failure injection | 每个stage/result/completion/commit点可验证whole-set rollback | adapter conformance覆盖同等失败点 | fake只测happy path或durable partial commit |
| replay/probe | exact reservation pointer读取immutable result | committed relation lookup，不重建current truth | fake直接缓存last result、durable查current rows |
| unknown outcome | 显式indeterminate且无completion/action | provider ambiguity保留，不自动当rollback/success | fake将unknown强制映射Retry或Accepted |

### 10.9 Branch and transport boundary

| branch | local mutation / durable result | §10 conclusion | deferred owner |
|---|---|---|---|
| current ownerless payload或missing finite binding | none | pre-admission zero-write failure | later protocol error/action mapping |
| unsupported/malformed/forbidden payload | none | finite分类，不尝试第二decoder或raw quarantine | later error/recovery section |
| future `Replay` | none new；read exact original result | preserve original durable outcome and refs | exact result/receipt mapper |
| future `Conflict` / `InFlight` | none new | no completed reservation and no guessed action | exact Consumer action policy |
| future acquired但durable landing仍不完整 | rollback all | affected stop；不能“先存reference以后补record” | Step06/07 repair + Step09 flow |
| future owner-authorized no-op/deferred | only if exact result owner explicitly permits it | must remain distinct fromAccepted mutation and rejection | result/outcome matrix |
| future accepted primary mutation | one atomic planned set | known commit后才可返回local committed result | result/receipt + C-05 mapper |
| commit/probe unknown | unknown | no valid completion/action under current carrier | shared indeterminate affected |

transport acknowledgement、retry与dead-letter属于 C-05 后置mapper和private registrar，不属于local
UoW。local known commit也不自动等于`Acknowledge`；transport failure不能回滚或改写已提交的local
projection/reference/gap。相反，pre-admission failure也不能只凭“错误严重”自动`DeadLetter`。
§10不选择任何C-05 action，并继续禁止I04反写Governance decision、policy、control、review、
nonconformity、trace、report conclusion或其lifecycle。

### 10.10 Affected and closure review

| affected / blocker | §10 status | exact remaining question |
|---|---|---|
| `S08-E-I04-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | canonical payload fields/encoder/registration是什么 |
| `S08-E-I04-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | 哪些有限Governance event通过何种adapter进入I04 |
| `S08-E-I04-REFERENCE-AUTHORITY-01` | `open_internal_affected` | 最小上游refs如何形成完整local reference |
| `S08-E-I04-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | 六个control fields如何一次构造并传播到service |
| `S08-E-I04-DIGEST-AUTHORITY-01` | `open_internal_affected` | semantic digest由谁、按何profile/material/order生成 |
| `S08-E-I04-VISIBILITY-AUTHORITY-01` | `open_internal_affected` | local visibility/gap由哪个policy/result mapper产生 |
| `S08-E-I04-DIGEST-ORDER-01` | `open_internal_affected` | request candidates如何按唯一frame一次生成并贯穿reserve/probe |
| `S08-E-I04-REDACTION-PROPAGATION-01` | `open_internal_affected` | allowlist/exclusion ceiling如何覆盖全部出口且无旁路 |
| `S08-E-I04-DURABLE-LANDING-01` | `open_internal_affected` | 唯一primary/repository/relation/version/transition/record/commit-class/result/outbox映射是什么 |

新增 durable-landing ID 不替代前八项，也不是新的上游 blocker。I04现在共有九项专属affected：
两项`open_upstream_internal`和七项`open_internal_affected`。当前没有关闭项，没有发现第三项
Governance上游 blocker；shared Consumer outbox、quarantine、indeterminate completion、UoW传播及
Step09 handoff affected继续保持原状态。

### 10.11 §10 stop review

| check | conclusion |
|---|---|
| §10 scope | `pass_with_affected_open`；只覆盖当前zero-write reachability、durable-target冲突、future reservation/UoW骨架、record/cursor禁止推断、result-before-complete、commit/probe与parity |
| current accepted/write set | payload set与write set均为空；无digest candidate、reservation、UoW、primary mutation、cursor、H record、stored result、completion、accepted receipt/outbox/action |
| durable landing | 未选择EvidenceLinkage、AuditProjection、ReferenceSnapshotState、GapState、H3、H8、H10或cursor namespace；新增`S08-E-I04-DURABLE-LANDING-01`承接唯一映射 |
| atomic future skeleton | 已固定one UoW、atomic reservation、actual-primary-derived commit class、at-most-one cursor、typed record/explicit-no-record、result-before-complete和whole-set commit/rollback |
| Governance truth boundary | pass；任何future local commit仍只表示Observability-owned body-free observation/audit projection，不表示或反写Governance truth、signoff或验收 |
| affected / blocker | 九项I04 affected全部开放；仍为2项upstream + 7项local；无新上游blocker、无关闭项 |
| current protocol count | 保持`33/60 defined_with_affected_open`；Query `14/14`；Consumer `3/9`；`0/60`无条件complete；I04仍不计入defined |
| not entered | operation-specific result/receipt matrix、error/recovery、C-05 action、Step09 function flow与I04 §11以后均未定义 |
| formal/implementation/test/evidence | formal`03` frozen；代码、测试、compile/runtime evidence、commit、run_id、evidence alias与签署均`not_run_not_claimed` |
| current checkpoint | `Step08_S08-E_I04_S01-S10_recorded_with_affected_open_waiting_user_before_I04_S11` |
| next action | 立即停审；用户确认后只进入I04 §11，先读取current Step06/07 result/receipt owner、I03对应粒度模板与I04 §8~§10；不得进入§12或后续批次 |
| current commit | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S10_recorded_with_affected_open_waiting_user_before_I04_S11
```

未经用户明确确认，不得进入 I04 §11；不得读取或写入 I04 §12 以后、I05~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该恢复点为 §10 的历史 checkpoint；current 状态由下方 §11 stop review 承接。

## 11. Stored result reachability, exact replay and Consumer receipt

本节只闭合 I04 的 application result 到 shared Consumer receipt 的形状、来源和 replay
关系。它不重新定义 `StoredObservationResult`、`ObservationConsumerResult`、
`ObservationStoredConsumerReceipt`、`ObservationConsumerReceipt` 或
`ObservationProtocolResultAccess`，也不选择 C-05 action。§6~§10 已证明 current
canonical payload、finite producer-event binding、完整 private input 和 request digest
candidates 都不可构造，因此本节必须把 current zero-stored-result 与 future owner-complete
result path 分开，不能用 future schema 掩盖当前不可达事实。

### 11.1 Authority, scope and current reachability

| concern | canonical owner | I04 use-site rule | forbidden substitute |
|---|---|---|---|
| application stored result | Step 06 `StoredObservationResult`、`StoredObservationReplaySurface`、`BodyFreeSerializedResult` | 只有 exact reservation、operation、actor、request digest、kind/schema/bytes/digest 全部验证后，才能作为 Consumer result source | current reference/audit/gap row、Governance event body、outbox record或新建空 result |
| exact result lookup | Step 07 `ObservationStoredResultRepository::get_result(&StoredObservationResultRef)` | 只按 reservation 返回的 internal pointer 读取一个 immutable result | public result ref、source event ref、H record ref、prefix scan或first-row-wins |
| application carrier | Step 06 `ObservationConsumerResult` | 只表示已经存在且验证完成的 durable Consumer result；current pre-admission failure不能构造该 carrier | `Err`转空 `Ok`、伪造result ref、用`Rejected/NoOp`冒充零写入 |
| public stored receipt | S08-B `ObservationStoredConsumerReceipt` + `ObservationConsumerReceipt::Stored` | exact decode stored bytes并逐字段lossless映射；stored/public shape不读current truth补值 | generic map、current repository join、按outcome猜refs |
| public ephemeral receipt | S08-B `ObservationConsumerReceipt::Ephemeral` | 只由worker typed mapper对无stored result的有限失败构造；只允许shared matrix中的`Delayed/Rejected/UnsupportedSchema` | application stored carrier、空stored receipt、accepted/no-op/quarantined/dead-lettered ephemeral |
| invocation access | Step 06 `ObservationResultAccess` -> S08-B `ObservationProtocolResultAccess` | `FreshlyCommitted`与`Replayed`只包装validated stored inner surface | durable `Duplicate` outcome、把access写入stored bytes/digest |
| transport action | exact I04 worker mapper + C-05 private registrar | 本节不选择action；receipt成立也不自动等于ack/retry/dead-letter | outcome-only switch、error string、default/wildcard branch |

Current I04 reachability is finite:

```text
static I04 slot and shared header may be inspected
  -> canonical producer-event binding is absent
  -> canonical payload decoder/material is absent
  -> complete private input cannot be built
  -> RequestDigestCandidates cannot be generated
  -> atomic reserve is not called
  -> no Acquired/Replay/Conflict/InFlight outcome exists for this invocation
  -> no StoredObservationResult or ObservationConsumerResult exists
  -> no Stored/FreshlyCommitted or Stored/Replayed public receipt exists
  -> only a body-free typed failure may reach the later worker mapper
```

因此 current I04 不仅不能 fresh commit，也不能“跳过payload直接replay”。没有同一 canonical
input/digest candidate，就无法验证 incoming request 与既有 reservation/result 是否兼容；即使存储中
碰巧存在旧 I04 result，也不得因 operation name 或 source-event ref 看似相同而公开。若worker后续
对 current failure 暴露 public surface，其上限只能是 shared `Ephemeral` shape 或无completion的
typed failure；exact outcome、recovery和action precedence留给 §12~§13。

### 11.2 Future exact replay lookup and rehydration sequence

以下序列只在九项 I04 affected 已按owner顺序闭合、matching assembler确实生成完整 input 与同一组
digest candidates 后才可达。它是 target contract，不声称 current runtime 已存在。

```text
validated complete I04 input and one RequestDigestCandidates set
  -> derive exact logical scope and I04/Governance/source-event identity
  -> atomic reserve(scope, event identity, the same candidates)
  -> Replay(idempotency_ref, stored_result_ref)
  -> rollback/discard the incoming writer UoW with zero new durable effect
  -> load the exact reservation relation by logical scope and inbound event identity
  -> require both lookups to identify the same Completed reservation
  -> get_result(exact StoredObservationResultRef)
  -> StoredObservationResult::try_rehydrate and validate_replay_for
  -> replay_surface.verify_integrity
  -> require ConsumerReceipt kind and retained I04 schema decoder
  -> exact-decode ObservationStoredConsumerReceipt
  -> validate I04 consumer/source/outcome/ref/error presence matrix
  -> map the immutable inner receipt without loss
  -> add only result_access = Replayed
  -> return; do not execute the I04 writer or any current-truth lookup
```

| order | required relation/check | failure class | allowed continuation |
|---:|---|---|---|
| 1 | `Replay` returns typed non-empty `idempotency_ref` and `StoredObservationResultRef` | reservation/result-pointer invariant failure | no receipt；do not run writer |
| 2 | exact logical scope and `(I04, Governance, source_event_ref)` each resolve to the same reservation | missing/duplicate/cross-index consistency defect | no alias row、no first-completer choice |
| 3 | reservation is `Completed` and its stored pointer equals the outcome pointer | completed-result relation defect | no current-truth reconstruction |
| 4 | `get_result(pointer)` returns exactly one immutable row | missing/duplicate stored result | consistency failure；not ephemeral rejection/delay |
| 5 | result idempotency, operation, actor and request digest match reservation and validated incoming context | cross-reservation/cross-operation/cross-actor/digest mismatch | do not expose old result；do not rerun I04 |
| 6 | replay kind is exactly `ConsumerReceipt`, disposition is compatible and retained schema has the exact I04 decoder | wrong family/disposition/schema or ownerless decoder | no Command/Job decoder、no latest-schema fallback |
| 7 | bounded bytes, canonical framing and stored surface digest validate exactly | corrupt/truncated/noncanonical/digest mismatch | no repair、reserialize、log or return bytes |
| 8 | decoded consumer equals `ConsumeGovernanceAuditContext` and stored source event equals the validated incoming event identity | cross-consumer/source mismatch | no route/name cast、no incoming overwrite |
| 9 | all collection ordering, duplicate rejection and outcome/error/dead-letter presence checks pass | malformed Consumer receipt | no current linkage/snapshot/gap/outbox fill-in |
| 10 | outer access is assigned only after steps 1~9 pass | mapper ordering defect | no speculative `Replayed` surface |

`load_by_scope`与`load_by_inbound_event`是同一reservation的交叉验证，不是两个可择优truth source。
任一路径missing、返回不同row、不同state或不同result pointer都属于consistency defect。Future retained
digest profile migration也只能使用`RequestDigestCandidates` owner的兼容规则；不得在result mapper内
重算raw payload hash、挑选任意candidate或把business `DigestSummary`转换为`RequestDigest`。

### 11.3 Fresh commit and replay access overlay

| invocation branch | current reachability | inner surface source | access overlay | invocation write set |
|---|---|---|---|---|
| current ownerless/unbound I04 delivery | reachable only as pre-admission typed failure | none | none | empty |
| future accepted writer, whole UoW known committed | conditional on all nine I04 affected and exact durable landing closure | staged exact Consumer receipt bytes from the same accepted UoW | `FreshlyCommitted` | exactly the §10 owner-authorized committed set |
| future compatible completed duplicate | conditional on full input/digest compatibility and §11.2 validation | exact immutable result selected by original reservation pointer | `Replayed` | empty for this invocation |
| future owner-authorized durable `NoOp` or negative receipt | not currently authorized | exact owner-defined stored surface | fresh after known commit；replay after exact lookup | only the named durable owner set；never an accepted-primary substitute |
| known pre-writer failure | reachable after a finite typed mapper exists | no stored inner surface | none；`Ephemeral` only | empty |
| commit/probe still unknown | possible only in a future writer path | no validated current response surface | neither fresh nor replay | unknown；no completion may assert either state |

Fresh 与 replay 必须公开同一个 immutable inner receipt。`result_access`不进入
`BodyFreeSerializedResult`、stored digest、reservation row或inner `outcome`。Fresh不能仅凭
`save_result`返回成功成立，必须证明result、reservation completion和完整local UoW均known committed；
Replay不能仅凭reservation存在成立，必须完成 §11.2 全部关系和integrity检查。Replay保留original
stored outcome，即使该outcome是owner-authorized `Rejected/Quarantined/DeadLettered/NoOp`，也不新增
`Duplicate` durable/public outcome。

### 11.4 Receipt field provenance and presence matrix

Public assembler只接收validated stored result/decoded inner surface，或worker已完成typed分类的
ephemeral input。它不得查询repository补字段。I04-specific规则如下：

| public field | exact source | stored rule | ephemeral/current rule | forbidden fallback |
|---|---|---|---|---|
| `consumer_name` | static I04 registration + retained receipt | 必须精确为`ConsumeGovernanceAuditContext`并与result operation一致 | static expected slot；不从payload推导 | Governance event name、topic、route、handler type |
| `source_event_ref` | fresh时validated shared header；replay时original stored receipt | required且必须与reservation secondary identity相等；replay不覆盖 | missing/malformed header rejection可None；其余shared ephemeral branch要求Some | Governance outbox ref、cursor、message id、dedup key、new local ref |
| `outcome` | exact stored disposition + S08-B total receipt factory | replay保留original值；future branch必须由真实durable fact支持 | 只能是shared允许的`Delayed/Rejected/UnsupportedSchema`，exact choice留§12 | C-05 action、Governance status/decision、error severity、duplicate marker |
| `result_ref` | `StoredObservationResult.public_result_ref` and decoded stored surface | every stored receipt required；两处必须相等 | structurally absent | internal `StoredObservationResultRef`、repository PK、evidence alias、outbox ref |
| `changed_refs` | future accepted UoW的exact Observability-owned post-state refs | canonical、duplicate-free；negative/no-op按owner matrix | structurally absent | current linkage/snapshot diff、Governance subject/state、result disposition |
| `outbox_refs` | exact stored receipt field/validated stored accessor | original canonical set，包含explicit empty；replay不新增 | structurally absent | current outbox scan、publisher state、event-name inference、默认empty掩盖缺字段 |
| `gap_refs` | same future UoW中owner-authorized local gap relation | original canonical set；presence不由visibility字符串推导 | structurally absent | current gap table、Governance nonconformity、error code/count |
| `dead_letter_ref` | committed local dead-letter marker relation | only co-present with exact stored terminal surface；ordinary accepted/no-op absent | structurally absent | transport action、broker locator、raw archive或临时mint |
| `error` | stored finite `ObservationProtocolErrorSurface` or validated ephemeral mapper | outcome matrix要求时Some，否则None；replay逐字段保留 | every exposed ephemeral receipt requires safe error | Governance/provider text、payload、stack、SQL/transport detail、empty placeholder |
| `result_access` | current invocation after complete validation | exactly fresh or replay；never stored in inner bytes | absent by shape | durable outcome、`Duplicate` variant、boolean success |

`changed_refs`、`gap_refs`或`outbox_refs`出现只证明原I04 accepted/negative owner提交了对应的
Observability-local body-free relation，不证明Governance decision正确、evidence真实、审计结论成立、
report已签署或external delivery成功。`result_ref`同样只是公开的body-free result identity，不是
database locator、真实evidence alias或可恢复Governance body的承诺。

### 11.5 Stored versus ephemeral surface closure

| condition | current/future status | application return boundary | public surface ceiling | prohibited claim |
|---|---|---|---|---|
| current missing canonical producer-event binding or payload owner | current direct | typed protocol/application failure；no `ObservationConsumerResult` | optional `Ephemeral` only after exact mapper；otherwise no completion | stored rejection/no-op、result ref、accepted receipt |
| current unsupported/malformed/forbidden input after safe header validation | current conditional on finite header classification | typed failure；no reservation/result | `Ephemeral` only with shared allowed outcome/error/source presence | raw quarantine、empty Stored、default dead-letter |
| future accepted local projection mutation known committed | future owner-conditional | validated `ObservationConsumerResult` | `Stored/FreshlyCommitted` | Governance truth accepted、transport acknowledged |
| future compatible completed duplicate | future owner-conditional | exact replayed application result | `Stored/Replayed` preserving original inner surface | new no-op/duplicate result、new refs、writer rerun |
| future formal durable rejection/quarantine/dead-letter/no-op | future owner-conditional, not authorized by current I04 | validated stored result only after named owner commit | exact `Stored/FreshlyCommitted` or later `Stored/Replayed` | durable fact inferred from error severity or desired action |
| future `InFlight` / dependency failure known before writer | future mapper-conditional | typed no-write failure | possible `Ephemeral/Delayed` only under total recovery mapping | result pointer、accepted mutation、generic retry permission |
| future `Conflict` | future mapper-conditional | typed conflict；old winner is not this request's result | no old stored surface as current success | expose winner receipt、alias reservation、second writer |
| completed reservation with missing/corrupt result | future consistency path | consistency/indeterminate failure | no stored or ephemeral success receipt | current-row reconstruction、downgrade to rejected/delayed |
| commit/rollback/probe unknown | future indeterminate path | no legal current application completion | none under current C-05 carrier | assume committed/not committed、select terminal action |

Stored 与 Ephemeral 是互斥的 algebraic shapes，不允许构造一个空集合、空public ref或默认error的
`Stored`来模拟ephemeral，也不允许给`Ephemeral`附加result/change/outbox/gap/dead-letter字段。当前
I04 的zero-write事实来自admission不可成立，不等于一个durable `NoOp`；future `Replay`来自原result
访问，也不等于重新执行得到的`NoOp`。

### 11.6 Reservation outcome and result-access matrix

| reservation/admission state | exact evidence required | I04 result behavior | this invocation durable effect | receipt boundary |
|---|---|---|---|---|
| current pre-reservation stop | missing canonical binding/payload/input/digest candidate | do not call reserve | none | typed failure；stored surface impossible |
| future `Acquired` | no matching logical/secondary reservation and complete input/candidates | enter §10 future writer only | owner-authorized set only | no receipt before whole-set known commit |
| future `Replay` | completed same scope/event + compatible retained digest + exact result pointer | execute §11.2 only | none | validated `Stored/Replayed` |
| future `InFlight` | reserved same scope/event + compatible candidate | do not enter writer or result lookup as completed | none | no stored receipt；later mapper owns delayed/no-completion |
| future `Conflict` | digest, logical/secondary identity, operation, actor or producer relation conflicts | preserve existing row；do not expose it as this result | none | typed conflict；no alias/winner receipt |
| completed without pointer | `Completed` plus `stored_result_ref=None` | consistency defect | none | no receipt/action |
| pointer target missing/duplicated | exact repository lookup not exactly one | consistency defect | none | no current-truth fallback |
| pointer result wrong operation/actor/event/digest | `validate_replay_for` or I04 relation check fails | consistency defect | none | no surface leakage |
| pointer surface wrong kind/schema/bytes/digest/presence | exact rehydrate/decode fails | consistency/compatibility defect | none | no alternate decoder/repair |

`Conflict`不授权读取winner receipt，`InFlight`不等于`Replay`，`Replay`不创建新durable outcome。
任何future probe只有在证明同一reservation已Completed且返回同一exact result pointer后，才可进入
§11.2；probe返回Unknown/Unsupported时继续走shared indeterminate boundary，不能任选一行。

### 11.7 Missing, corrupt and redaction handling

| defect | body-free diagnostic ceiling | forbidden response or repair |
|---|---|---|
| completed reservation缺result pointer | finite completed-result consistency category | empty stored receipt、rerunI04、把reservation改回Reserved |
| pointer target missing/duplicate | finite persistence consistency category | global scan、first-row-wins、mint alias |
| reservation/result operation、actor、scope或digest不一致 | finite replay-relation category | expose old receipt、overwriterow、convert business digest |
| wrong result kind/disposition或retained schema无decoder | finite stored-surface compatibility category | Command/Job decoder、try-latest、schema upgrade on read |
| bytes empty/oversized/malformed/noncanonical | finite stored-surface integrity category | print、truncate、hash for diagnostics、repair或reserialize |
| bytes digest mismatch | finite stored-surface integrity category | trust one side、从current DTO重算、warning后继续 |
| receipt consumer/source/ref/error presence非法 | finite Consumer-surface consistency category | 从current linkage/reference snapshot/gap/outbox补字段 |
| unowned quarantine/dead-letter material | existing affected/owner-gap category | 新建`QuarantineRef`、保存raw payload或transport locator |

Diagnostic、log、metric、trace、public error和dead-letter metadata最多携带finite operation/consumer/
producer/schema/phase/error code、bounded count及已授权typed safe refs。不得输出stored bytes、Governance
payload/decision/policy/control/review/conclusion/nonconformity/trace/report body、provider response、
repository exception、digest hex或raw transport metadata。对forbidden body做hash、截断、base64、
debug/display或重新序列化仍是泄漏，不是redaction。

### 11.8 Completion eligibility without C-05 action selection

本节把“是否有合法receipt”与“worker选择哪个transport action”分开。后者必须等待 §12 typed
error/recovery和 §13 exact action matrix；本节不因某个outcome看似成功或失败而预选动作。

| validated condition | legal receipt status | C-05 status in §11 | local truth constraint |
|---|---|---|---|
| current ownerless/unbound pre-admission failure | no stored receipt；ephemeral only after total typed mapper | not selected | zero write；不得伪造durable rejection/gap/audit |
| future exact stored replay | stored receipt legal only after §11.2 complete | not selected | original result/reservation/refs unchanged |
| future fresh accepted/no-op/negative with known whole commit | stored receipt legal only from exact committed surface | not selected | transport cannot create、rollback或改写local fact |
| future known no-write dependency/in-flight branch | no stored receipt；ephemeral eligibility depends on recovery mapper | not selected | no result pointer或accepted fact |
| missing/corrupt completed result | no legal receipt | no action | no downgrade/rebuild/rerun |
| commit/rollback/probe unknown | no legal receipt under current carrier | no action；shared indeterminate affected | no committed/not-committed assertion |
| transport call fails after a future known local commit | original stored receipt remains authoritative | failure handled after mapper/registrar boundary | no rollback、new result或writer rerun |

`S08-CONSUMER-INDETERMINATE-COMPLETION-01`继续约束unknown分支；
`S08-CONSUMER-QUARANTINE-REF-01`继续禁止I04临时定义quarantine owner；
`S08-CONSUMER-OUTBOX-SURFACE-01`继续要求stored/public outbox refs lossless。I04 §11不增加
pending completion、action enum、quarantine ref或generic worker policy。

### 11.9 Lossless relation and no-current-truth reconstruction redline

Future public stored I04 receipt必须满足下列单向关系：

```text
completed reservation for exact I04 logical + secondary identity
  -> reservation.stored_result_ref == stored_result.result_ref
  -> stored_result.idempotency/operation/actor/request_digest validate
  -> replay_surface.kind == ConsumerReceipt
  -> retained schema + exact bytes + digest validate
  -> decoded receipt.consumer_name == ConsumeGovernanceAuditContext
  -> decoded receipt.source_event_ref == reservation event identity
  -> decoded receipt.result_ref == stored_result.public_result_ref
  -> original outcome/changed/outbox/gap/dead-letter/error are returned unchanged
  -> only invocation-level result_access differs between fresh and replay
```

下列行为一律是 invariant failure，不是recovery shortcut：

- 以 public result ref、source event ref、outbox ref、H3/H8/H10 ref、snapshot ref或gap ref替代 internal stored-result pointer；
- 从 current `EvidenceLinkage`、`AuditProjection`、`ReferenceSnapshotState`、`GapState`、H record或outbox row重建缺失receipt字段；
- 重新读取 Governance current decision/policy/control/review/nonconformity/trace/report truth来判断原result；
- 重新解析当前schema、重新执行payload adapter、reference resolver、visibility mapper、primary transition或record factory；
- 为duplicate增加新的changed/gap/outbox/dead-letter/error/trace/cursor/ref，或重排original canonical集合；
- 将`Replayed`写入stored bytes、替换original outcome，或把duplicate映射为durable/public `Duplicate`；
- 把corrupt/missing completed result降级为ephemeral rejection/delay，以便worker获得一个terminal action；
- 由application result/receipt assembler调用broker registrar，或由transport action反向制造local marker/result。

即使future receipt包含evidence/reference-looking refs，它也只证明一个Observability-owned immutable
protocol surface已经提交并可重放；它不证明evidence内容真实、Governance业务结论成立、retention
义务完成、report handoff已送达或验收签署存在。

### 11.10 Affected and closure review

| affected / question | §11 conclusion | status after §11 |
|---|---|---|
| `S08-E-I04-PAYLOAD-SCHEMA-01` | current无canonical payload，故不能生成input/digest、reserve、fresh或replay result | `open_upstream_internal` |
| `S08-E-I04-PRODUCER-EVENT-BINDING-01` | current无finite event binding，不能仅凭source ref查旧result | `open_upstream_internal` |
| `S08-E-I04-REFERENCE-AUTHORITY-01` | receipt refs不得由Governance producer或current lookup补造 | `open_internal_affected` |
| `S08-E-I04-CONTROL-FIELD-SOURCE-01` | exact input/context缺失阻断reservation/result compatibility | `open_internal_affected` |
| `S08-E-I04-DIGEST-AUTHORITY-01` | business digest不能替代request digest或result integrity digest | `open_internal_affected` |
| `S08-E-I04-VISIBILITY-AUTHORITY-01` | result/gap/error presence不能由producer visibility或默认Visible推导 | `open_internal_affected` |
| `S08-E-I04-DIGEST-ORDER-01` | same candidates必须贯穿assembler/reserve/replay/probe；current不可构造 | `open_internal_affected` |
| `S08-E-I04-REDACTION-PROPAGATION-01` | stored/ephemeral receipt、replay diagnostics与dead-letter仍须消费同一body-free ceiling | `open_internal_affected` |
| `S08-E-I04-DURABLE-LANDING-01` | future stored outcome、changed/gap/outbox/dead-letter refs只能来自尚未选定的exact durable landing | `open_internal_affected` |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | public `outbox_refs`必须来自validated stored surface，不能current scan或默认empty | `open_internal_affected` |
| `S08-CONSUMER-QUARANTINE-REF-01` | public receipt不暴露ownerless `QuarantineRef`；I04不mint替代类型 | `open_internal_affected` |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | missing/corrupt/unknown result无合法terminal completion | `open_internal_affected` |
| `S08-RESULT-ACCESS-LAYER-01` | shared owner已固定outer fresh/replay overlay；I04只做use-site传播 | `resolved_in_S08-B_step06_affected_open` |
| `R06-F-AFFECT-UOW-01` | result-before-complete与whole-set commit certainty仍需Step09/11/13/16传播 | `step07_surface_closed_downstream_open` |

本节不新增 I04-specific result/receipt affected。原因是：current I04没有合法stored branch；future
operation-specific outcome与refs已由`S08-E-I04-DURABLE-LANDING-01`承接，shared public/application
carrier的lossless缺口已由outbox/quarantine/indeterminate/result-access affected承接。此时再创建一个
泛化“result缺口”ID只会重复owner问题。若 §12~§13 发现I04 exact error或action mapper无法由现有
affected表达，应在对应小节按具体signature/presence缺口登记，而不是在§11预造ID。

没有发现新的上游 blocker，也没有关闭任何既有 affected。I04仍为两项upstream + 七项local
专属affected，shared/cross-protocol affected保持原状态。

### 11.11 §11 stop review

| check | conclusion |
|---|---|
| §11 scope | `pass_with_affected_open`；只覆盖current result reachability、future exact lookup/replay、fresh/replay overlay、receipt field/presence、stored/ephemeral互斥、损坏/redaction与no-current-truth reconstruction |
| current stored result / receipt | zero；无digest candidates/reservation/result，不能返回`ObservationConsumerResult`、`Stored/FreshlyCommitted`或`Stored/Replayed` |
| future replay | 必须由exact reservation pointer进入，逐项验证scope/event、state/pointer、operation/actor/digest、kind/schema/bytes/digest与Consumer presence；本次零写入 |
| public/internal result identity | internal `StoredObservationResultRef`只用于repository lookup；public `BodyFreeRef`只作stored receipt identity，不可互换 |
| stored/ephemeral shape | mutually exclusive；current failure最多进入typed ephemeral/no-completion，不能伪造stored rejected/no-op/empty success |
| Governance truth boundary | pass；receipt/result只表达Observability local protocol fact，不反写或证明Governance truth、evidence、retention、report handoff或signoff |
| C-05 action | 未选择；必须等待§12 typed recovery与§13 exact action matrix，unknown/missing/corrupt result当前无action |
| affected / blocker | 九项I04专属affected全部开放；shared outbox/quarantine/indeterminate与UoW传播保持开放；无新上游blocker、无新result ID、无关闭项 |
| current protocol count | 保持`33/60 defined_with_affected_open`；Query `14/14`；Consumer `3/9`；`0/60`无条件complete；I04仍不计入defined |
| formal/implementation/test/evidence | formal`03` frozen；代码、测试、compile/runtime evidence、commit、run_id、evidence alias与签署均`not_run_not_claimed` |
| current checkpoint | `Step08_S08-E_I04_S01-S11_recorded_with_affected_open_waiting_user_before_I04_S12` |
| next action | 立即停审；用户确认后只进入I04 §12，先读取current Step06/07 error/recovery owner、I03 §12粒度模板与I04 §9~§11；不得进入§13或后续批次 |
| current commit | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S11_recorded_with_affected_open_waiting_user_before_I04_S12
```

未经用户明确确认，不得进入 I04 §12；不得读取或写入 I04 §13 以后、I05~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

## 12. I04 protocol error mapping, exception branches and recovery handoff

本节只处理 I04 `ConsumeGovernanceAuditContext` 的错误映射、异常分支和恢复交接。
这里的“§12”是 I04 独立中间产物的小节，不等于全局详细设计 Step 12。
Current `ProtocolError`、`DomainError` 和 `ApplicationError` 分别由 Step 06 的
`contracts::errors`、`domain::errors` 和 `application::errors` 唯一拥有；public error
继续使用 S08-B 的 `ObservationProtocolErrorCode` / `ObservationProtocolErrorSurface`。
本节不复制 enum，不创建 generic Consumer disposition，也不把 application error 直接
转换成 broker action。

I04 与 I03 的关键差异是 current I04 尚无 canonical producer-event binding、payload、
完整 input、request digest candidates 或唯一 durable landing。因此本节必须先区分：

1. **结构性设计 / 注册缺口**：当前 owner 或 finite binding 根本不存在，I04 slot 不应激活，
   也不能产生看似正常的 `UnsupportedSchema`、`Delayed` 或 `Retry` receipt。
2. **未来合法 slot 的单次投递错误**：只有 owner、binding、schema 和 decoder 全部已闭合后，
   某个具体 delivery 才能进入有限 protocol/application error mapping。

把第一类错误伪装成第二类，会令 worker 对一个无法通过重试修复的设计缺口无限重投，或在没有
canonical payload 的情况下错误地 dead-letter 原始 Governance body。两类分支在下文始终分开。

### 12.1 Authority, scope and mapping order

#### 12.1.1 Error and recovery authority

| concern | current authority | I04 use | prohibited fallback |
|---|---|---|---|
| envelope / typed ref validation | Step 06 `contracts::errors::ProtocolError` | static slot、header、typed reference、schema token和route/body一致性 | generic invalid string、provider code或payload字段名判断 |
| domain invariant / policy input | Step 06 current `domain::errors::DomainError` 20-variant enum | exact relation、body-free、reference、visibility/gap和state invariant | 已淘汰的`PolicyRejected`/`ReadNotAllowed`、expected negative当error |
| application / port / transaction | Step 06 `application::errors::ApplicationError` | digest、idempotency、repository、CAS、UoW、stored result与commit certainty | raw adapter exception、SQL code、message parsing或I04私有enum |
| public projection | S08-B `ObservationProtocolErrorSurface` | finite code、已有safe reason/gap ref、recovery-derived bool | raw error、临时mint reason/evidence/gap ref |
| transport execution | C-05 + worker exact mapper | validated result/receipt与commit proof具备后才选择action | application返回action、outcome-only wildcard或default `Retry` |
| recovery posture | S08-B前向引用的八类词表；唯一声明与total mapper尚待后序Step 12重审 | 本节只记录I04 target mapping | 把冻结的后序文件反向当current owner，或在I04复制enum |

已存在的 `03_ddd_step_12_error_recovery.md` §8.2 包含八类
`ObservationRecoveryClass` 声明，但该文件是在 Step 08 per-protocol repair 之前形成的后序产物，
当前只能作为 `historical_material / downstream repair input`。Step 06 没有该 enum 的 current
声明，S08-B 又只做了前向引用。因此登记 shared affected
`S08-RECOVERY-CLASS-OWNER-01`：后序 Step 12 必须确认唯一 module owner、八类 finite enum、
`ApplicationError` total mapping、public `retryable` 派生函数和 no-wildcard tests。本节沿用八个
候选名称以固定 I04 target posture，但不声称该 owner 已可实现。

#### 12.1.2 Fixed mapping order

```text
composition-root I04 slot closure
  -> authenticated worker binding and static I04 selection
  -> shared envelope and typed-reference validation
  -> finite Governance event binding and registered schema selection
  -> redaction-first canonical payload decode
  -> I04 relation / visibility / digest authority checks
  -> complete private input and one request-digest candidate set
  -> atomic idempotency admission
  -> exact durable target / domain decision / UoW
  -> stored result / reservation completion / commit certainty
  -> public receipt or typed error projection
  -> exact worker C-05 mapper
  -> transport action execution
```

The order is strict:

1. Composition root 只有在两个 upstream blocker 与所需 local constructor / mapper 均已闭合时，
   才能把 I04 callback 放入可激活 registry。注册缺口是 activation failure，不是 delivery outcome。
2. Static slot、authenticated actor binding 和 shared header 必须在 payload decode 前验证。
3. Finite producer-event binding 必须先选中唯一 canonical payload/schema；不得尝试十三个候选 decoder。
4. Body-free decode、reference relation、visibility provenance 和 semantic digest authority 全部通过后，
   application 才能形成完整 input 和一次 `RequestDigestCandidates`。
5. 只有完整 input 才能 reserve；只有 fresh reservation 才能进入 exact durable target writer。
6. Result 必须先于 reservation completion 保存；commit certainty 未知时不得构造 terminal receipt。
7. Worker 只消费 validated receipt/error/recovery mapping；registrar 只执行已选择的 action。

任何早期错误都不得由后续层重分类。例如，ownerless payload 不是“临时 repository 不可用”，
missing persisted result 不是“unsupported schema”，transport ack 失败也不能反向改写 committed local
receipt。Expected typed visibility restriction、gap classification 或 policy block 是正常 decision，只有
basis / relation / invariant 损坏才进入 `DomainError`。

### 12.2 I04 internal error inventory

下表是 I04 use-site 清单。`owner variant` 只引用 current Step 06 owner；`structural affected`
行不产生 runtime variant。Future exact mapper 不得加入 wildcard arm，也不得通过错误文本选择分支。

| detection point | owner variant / classification | exact I04 trigger | local side-effect rule | target recovery posture |
|---|---|---|---|---|
| I04 activation closure | structural affected | canonical payload、finite event binding、required local mapper任一未闭合 | 不注册可调用I04 slot；无delivery receipt、reservation或transport action | design correction；不是runtime recovery class |
| static slot/body selection | `ProtocolError::RouteBodyMismatch` | registrar slot不是I04或concrete body type不匹配 | 不解析payload，不构造input/digest | `RetryAfterInputChange` |
| authenticated binding / envelope | `ProtocolError::InvalidEnvelope` | trusted actor binding或required envelope structure缺失/冲突 | 不进入payload decoder或writer | `RetryAfterInputChange` |
| required typed refs | `EmptyReference`、`MalformedReference`、`WrongReferenceOwner`或`IncompatibleReferenceKind` | source-event/source/version/dedup等typed ref非法 | 只保留允许的safe header诊断；无accepted write | `RetryAfterInputChange` |
| producer-event binding | structural affected | current十三个Governance event没有finite event-to-I04 mapping | fail activation；不得逐个试解码或任选事件 | design correction；不是`DependencyUnavailable` |
| registered but unsupported schema | `ProtocolError::UnsupportedSchemaVersion`或`ApplicationError::UnsupportedSchemaVersion` | future registry已存在，但delivery version不在该event binding的supported set | 不decode、不digest、不reserve | `DoNotRetrySameInput` |
| canonical payload owner | structural affected | current `GovernanceAuditContextPayload`只有Observability use-site、无producer owner/encoder/registration | fail activation；不得构造local substitute | design correction；不是`UnsupportedSchemaVersion` |
| malformed / duplicate payload field | `ProtocolError::InvalidEnvelope`或`ApplicationError::InvalidRequest` | future canonical decoder确认required/unknown/duplicate/tag/encoding错误 | 丢弃partial DTO；不得hash offending material | `RetryAfterInputChange` |
| forbidden Governance body | `ApplicationError::Domain(DomainError::BodyFreeBoundaryViolation)` | raw decision/policy/control/review/conclusion/nonconformity/trace/report body或unsafe nested material越界 | raw material不进入input、digest、marker、result、telemetry或dead letter | `RetryAfterInputChange`；若已持久化则`ManualIntervention` |
| effective actor authority | `ProtocolError::InvalidEnvelope`；只有未来exact typed authority owner才能映射public actor denial | trusted actor缺失/不属于activated binding，或payload试图覆盖actor | 不decode业务字段，不创建actor替代值 | missing=`RetryAfterInputChange`；deterministic denial=`DoNotRetrySameInput` |
| local reference authority | `ApplicationError::Domain(DomainError::ReferenceBoundaryViolation)`、`ReferenceConflict`或`RelationMismatch(...)` | producer提交local identity/state/reason，或最小upstream ref无法唯一绑定local relation | 不mint/选择任意local reference，不进入writer | input defect=`RetryAfterInputChange`；persisted conflict=`ManualIntervention` |
| semantic digest authority | `InvalidRequest`、`SuppliedDigestMismatch`、`DigestMaterialEncodingFailed`或persisted digest variants，按future owner精确选择 | semantic digest缺失/冲突、被误作request digest，或canonical bytes无法形成 | reserve前失败；不得采用caller digest或raw serde fallback | input mismatch=`DoNotRetrySameInput`；deterministic/persisted defect=`ManualIntervention` |
| visibility / gap provenance | `DomainError::RelationMismatch(...)`、`GapInvariantViolation`或normal typed visibility decision | producer visibility越权、local policy input不完整/错绑，或persisted visibility/gap矩阵损坏 | normal restriction不当error；relation损坏不写local projection/result | state/input change或`ManualIntervention`，按exact cause |
| complete request digest | `DigestMaterialEncodingFailed`或persisted digest variants | common prefix或future payload segment无法canonicalize，或retained profile/material不一致 | 无candidate则不reserve；已持久化冲突不重算 | `ManualIntervention` |
| idempotency conflict | `ApplicationError::IdempotencyConflict` | same logical/event scope对应different retained-profile request digest | 保留winning reservation/result；不暴露其receipt作为本次result | `DoNotRetrySameInput` |
| idempotency in flight | `ApplicationError::IdempotencyInFlight` | exact matching reservation仍为Reserved且无completed result | 不启动第二writer、不mint alias reservation | `RetryAfterStateChange` |
| durable landing authority | structural affected | current没有唯一primary/relation/version/transition/record/no-record mapping | 不begin writer，不把repository capability当selector | design correction；不是repository outage |
| future target missing / relation absent | `OwnedStateNotFound`或`DomainError::MissingRequiredReference`，仅在landing owner闭合后可用 | exact required local target/relation经typed lookup确认不存在 | 不以另一aggregate或新identity隐藏absence | `RetryAfterStateChange`或`RetryAfterInputChange`，按owner语义 |
| future relation conflict | `DomainError::RelationMismatch(...)`、`ReferenceConflict`或`PersistenceInvariantViolation` | target、scope、subject、version、decision、visibility或record relation不一致 | rollback/discard；不选first/newest row | persisted corruption=`ManualIntervention` |
| optimistic write conflict | `ApplicationError::OptimisticConflict` | exact selected primary的expected version被并发winner改变 | whole-set rollback；旧version失效 | `RetryAfterReload` |
| temporary repository/resolver failure | `RepositoryUnavailable`、`ReferenceUnavailable`或`ResolverUnavailable` | owner已闭合且某次typed dependency调用临时不可用 | 不补造reference、visibility、digest或accepted fact | `RetryAfterDependencyRecovery` |
| serialization / result assembly | `SerializationFailed`、`RecordAssemblyInvariantViolation(...)`或`PersistenceInvariantViolation` | canonical result/record bytes或cross-field invariant无法成立 | commit前whole-set rollback；不降级空result | `ManualIntervention` for deterministic defect |
| outbox / stored-result invariant | `OutboxInvariantViolation`、`OutboxPayloadMissing/Corrupt`、`CompletedReservationResultMissing`或`StoredResultKindMismatch` | same-UoW follower不完整，或completed reservation的immutable result损坏 | 无public stored receipt；不得current-truth重建 | `ManualIntervention` |
| known commit abort | `ApplicationError::CommitFailed` | backend明确证明整个UoW未提交 | 不返回stored/fresh receipt，不mark completed | 仅在no-write proof后`RetryAfterDependencyRecovery` |
| commit outcome unknown | `ApplicationError::CommitOutcomeUnknown` | commit调用无法证明成功或失败 | 不返回terminal receipt/action；只做exact reservation/result probe | `ProbeBeforeRetry` |
| rollback outcome unknown | `ApplicationError::RollbackFailed` | rollback后visibility无法证明 | 不声称no-write，不重启mutation | `ProbeBeforeRetry`或`ManualIntervention` |
| post-commit acknowledgement | `WorkerError::AckFailed` | local commit和receipt已知，broker ack执行失败 | 保留committed result；后续delivery只exact replay | transport-owned probe/replay；不重跑application |
| post-commit dead-letter handoff | `WorkerError::DeadLetterFailed` | local terminal marker/result已知，dead-letter调用失败 | 保留local marker/result；不保存raw body或再造marker | transport-owned probe/replay；不重跑application |

`ApplicationError::ReferenceUnavailable` 只适用于 owner 已存在而某次 resolver/repository 调用临时失败；
不能承载“canonical payload/reference mapper 尚未设计”。同理，`UnsupportedSchemaVersion` 只适用于
一个已注册 schema family 收到 unsupported version，不能承载“根本没有 payload owner 或 event
binding”。这两个区分是 I04 防止错误重试的硬门禁。

I04 当前没有 `RetryFinalizeOnly` application branch。I04 不拥有外部业务 effect，也不能把 broker
ack/dead-letter execution 当作 local application finalize。若后续 shared worker 对 transport action
定义恢复，它仍由 worker/registrar owner处理，不得重写 I04 stored receipt 或重复 local mutation。

### 12.3 Public error projection for I04

`ObservationProtocolErrorSurface` 只能在 owner variant、public code、safe ref presence 和 recovery
target 全部可证明后构造。Current structural affected 不进入 public projection；composition root 应在
暴露 callback 前失败。若部署错误仍把未闭合 slot 暴露给 transport，必须返回 entry/runtime failure
并停止该 slot，不能伪造一个可 ack/retry/dead-letter 的 I04 receipt。

| I04 condition | internal source | public code / outcome target | ref and error presence | recovery target / target `retryable` |
|---|---|---|---|---|
| missing/malformed shared header | exact `ProtocolError` | `MissingRequiredField`或`InvalidReference`; `Ephemeral/Rejected` | source event仅在已安全decode时Some；error required；无result refs | `RetryAfterInputChange` / false |
| wrong static producer/operation/body binding | `RouteBodyMismatch` / `InvalidEnvelope` | `InvalidRequest`; `Ephemeral/Rejected` | 不读取payload；error required | `RetryAfterInputChange` / false |
| future registered unsupported version | `UnsupportedSchemaVersion` | `UnsupportedSchemaVersion`; `Ephemeral/UnsupportedSchema` | validated source event required；无payload/result refs | `DoNotRetrySameInput` / false |
| current ownerless payload or event binding | structural affected | **no public I04 code or receipt** | no legal result/error carrier for terminal completion | activation blocked；no runtime bool |
| malformed canonical payload | `InvalidRequest` / protocol validation | `InvalidRequest`; `Ephemeral/Rejected` | error required；不得带partial fields/hash | `RetryAfterInputChange` / false |
| forbidden body crossing | `DomainError::BodyFreeBoundaryViolation` | `BodyFreeBoundaryViolation`; normally `Ephemeral/Rejected` | raw body absent；只有owner已有safe reason时可Some | `RetryAfterInputChange` / false |
| actor binding absent | `InvalidEnvelope` | `MissingRequiredField`; `Ephemeral/Rejected` | 不暴露actor detail/profile/role | `RetryAfterInputChange` / false |
| future exact typed actor denial | future authority decision owner | `ActorNotAllowed`; expected rejection | 只保留owner-provided safe reason；无raw policy | `DoNotRetrySameInput` / false |
| upstream/local reference malformed or cross-owner | typed protocol/domain reference error | `InvalidReference`; `Ephemeral/Rejected` | 不mint local ref或result | `RetryAfterInputChange` / false |
| persisted reference/visibility/gap relation corrupt | domain/persistence invariant | `ConsistencyFailure`; no accepted receipt | safe operations context only；不得补current refs | `ManualIntervention` / false |
| valid restricted/not-visible policy result | typed normal decision | not automatically an error；future durable/result mapper decides exact stored outcome | only committed owner refs | not classified until durable landing/result owner closes |
| idempotency digest conflict | `IdempotencyConflict` | `IdempotencyConflict`; ephemeral rejection | winning result不可作为本次result；error required | `DoNotRetrySameInput` / false |
| exact reservation still in flight | `IdempotencyInFlight` | `DependencyUnavailable`; `Ephemeral/Delayed` | source event Some；no result/change/outbox/gap refs | `RetryAfterStateChange` / false |
| proven temporary typed dependency outage | repository/reference/resolver unavailable | `DependencyUnavailable`; `Ephemeral/Delayed` only before accepted write | no synthetic local truth/ref | `RetryAfterDependencyRecovery` / true |
| optimistic conflict | `OptimisticConflict` | `VersionConflict`; no accepted receipt | no winning state/result disclosure | `RetryAfterReload` / true |
| deterministic canonicalization/result invariant | digest/serialization/persistence invariant | `ConsistencyFailure`; no accepted receipt | no raw bytes/digest detail | `ManualIntervention` / false |
| completed reservation result missing/corrupt | result consistency variants | `ConsistencyFailure`; no stored or synthetic ephemeral success | no invented result ref；safe error only | `ManualIntervention` / false |
| known whole-UoW commit abort | `CommitFailed` with no-write proof | `DependencyUnavailable`; no stored receipt | all accepted refs absent | `RetryAfterDependencyRecovery` / true |
| commit/rollback remains unknown | `CommitOutcomeUnknown` / `RollbackFailed` | `CommitOutcomeUnknown`; current carrier has no legal terminal receipt | no speculative refs/outcome/action | `ProbeBeforeRetry` / false |
| exact completed replay | no error | original `Stored/Replayed` receipt | original inner outcome/refs/error unchanged | no handler retry；worker replay policy only |

上表的 `retryable` 是 `S08-RECOVERY-CLASS-OWNER-01` 关闭后的目标派生值，不是 current
可落码声明。按 S08-B forward contract，只有 `RetryAfterReload`、
`RetryAfterDependencyRecovery` 和 `RetryFinalizeOnly` 为 true；其余五类为 false。
在唯一 recovery owner 与 total mapper 未闭合前，entry 不得手写 bool 或根据 `Delayed`、error
severity、provider code推断 true。

Public code 是安全语义投影，不是一对一 internal enum serialization。`ReferenceUnavailable` 只有
在临时 dependency failure 时映射 `DependencyUnavailable`；persisted reference relation 丢失或损坏
映射 `ConsistencyFailure`。Valid visibility restriction 是正常 typed outcome，不得因为 public code
列表存在 `NotVisible` 就绕过 I04 durable/result owner自行选择 receipt outcome。

### 12.4 Exception branch and write-visibility matrix

下表的 “no write” 指无 I04 reservation、primary mutation、H-family record、cursor、stored result、
reservation completion、accepted outbox或local terminal marker变为可见。Current I04在结构性 owner
闭合前甚至不应暴露 callback；future 行只固定合法 slot 的异常语义。

| branch | detection point | staged local facts | required handling | durable audit / marker rule | worker handoff |
|---|---|---|---|---|---|
| owner/binding closure failure | composition root | none | fail I04 activation；不订阅或暂停该slot | 不写“unsupported”或gap marker来掩盖设计缺口 | no C-05 completion |
| static route/body mismatch | registrar / entry | none | reject before payload decode | no accepted audit/outbox | no default action |
| malformed required header/ref | envelope validator | none | typed ephemeral rejection only when slot itself合法 | no local result/marker | exact producer policy later |
| registered unsupported schema | schema gate | none | do not decode another candidate schema | no stale/fresh/accepted marker | no generic retry/dead-letter |
| malformed canonical payload | exact decoder | none | discard partial DTO；do not hash/debug offending field | no accepted audit or result | exact policy later |
| forbidden/raw Governance body | body-free gate | none；raw material never staged | reject；只有未来owner授权的body-free quarantine lane可另行提交 | raw body/hash/base64/debug不得进入marker/dead letter | no severity-based action |
| reference/digest/visibility authority failure | assembler relation gates | none | fail closed；不使用old three-field row/default/current lookup | no local reference/projection/gap/result | input/state/manual classification |
| digest canonicalization failure | canonicalizer before reserve | none | typed error；不得mint新key或采用semantic digest代替 | no event/accepted audit | no action |
| completed exact replay | reservation + exact result lookup | incoming writer absent/discarded | validate immutable pointer/bytes/digest/receipt then return original surface | no second primary/record/outbox/gap/audit | replay policy may ack current delivery |
| idempotency conflict | atomic reserve | no admitted writer | preserve winner；do not expose old receipt | no new marker/event | no old-result action |
| idempotency in flight | atomic reserve | no admitted writer | return typed delay only under legal slot | no second reservation/completion | retry only after exact policy |
| selected target absent/relation invalid | future typed lookup | no accepted transition | rollback/discard；do not switch aggregate or mint replacement | no record/outbox/result | input/state/manual classification |
| valid restricted visibility decision | future policy decision | depends on selected exact branch | consume only through durable/result owner；normal negative is not exception | only explicitly owned body-free local fact | action unresolved until exact result |
| domain invariant rejects mutation | domain member/policy | candidates may be in memory | rollback whole writer UoW | normal typed negative marker only if exact owner says durable | exact public mapper |
| optimistic conflict | primary save | staged primary/record/followers/result candidates | rollback；reload winner before new attempt | no partial record/outbox/result | reload eligibility only |
| record/outbox/result staging failure | UoW staging | earlier accepted candidates staged | rollback whole set；no record-first or result-less commit | no partial follower | dependency/manual by exact variant |
| reservation completion failure | mark-completed stage | primary/record/result staged | rollback whole set；never expose FreshlyCommitted | no dangling completed row | no action |
| known commit abort | UoW commit | all facts staged, none proven committed | return known no-write error after backend proof | no compensating success event | later retry only after dependency recovery |
| commit/rollback unknown | UoW manager / exact probe | visibility unknown | no receipt/action；continue exact identity/result probe | no speculative committed/rolled-back marker | current C-05 no legal completion |
| commit known, ack fails | transport registrar | full local result committed | preserve exact result；map `AckFailed` | no duplicate primary/record/outbox/result | later delivery exact replay |
| terminal marker known, dead-letter fails | transport registrar | local terminal fact committed | preserve marker/result；do not re-run handler | no raw payload or second marker | transport recovery/probe |

No exception branch may use current `EvidenceLinkage`、`AuditProjection`、
`ReferenceSnapshotState`、`GapState`、H record、outbox row 或 Governance current truth 来填补
缺失 result/error字段。唯一允许的 post-commit reads 是 owning repository 的 exact reservation、
stored-result、marker和commit probe relations。

### 12.5 Recovery-class handoff for I04

下列是 I04 对八类候选 posture 的完整目标映射。该表是
`S08-RECOVERY-CLASS-OWNER-01` 的 use-site requirement，不是第二个 enum declaration。
Recovery class 只描述下一次安全动作的前置条件，不定义重试次数、backoff、broker action、
operator runbook或transport exit code。

| recovery class | I04 examples | next owner / allowed action | target public bool | hard prohibition |
|---|---|---|---:|---|
| `DoNotRetrySameInput` | registered unsupported schema、different-digest conflict、deterministic typed actor denial | producer/caller必须改变schema/logical input，或正式状态发生变化 | false | 原payload/key原样循环、把winning receipt暴露给conflict |
| `RetryAfterInputChange` | malformed header/ref/payload、forbidden body、producer提交local identity、missing trusted binding | 修正typed input后形成新的合法attempt | false | default/ref cast、hash后继续、静默删除required field |
| `RetryAfterStateChange` | matching reservation in flight、合法target尚未建立、formal policy/reference relation未到可消费状态 | 等待owner state变化后重新做完整admission | false | timer-only blind loop、第二writer、伪造Accepted |
| `RetryAfterReload` | future exact primary CAS conflict | whole-set rollback，reload canonical `Versioned<T>`并重评全部relation/policy | true | 复用旧expected version或只重做save尾段 |
| `RetryAfterDependencyRecovery` | owner已存在时的temporary repository/resolver/UoW outage、known no-write commit abort | dependency恢复后从完整admission重新开始 | true | 把unavailable解释为NotVisible/NoOp/Accepted，或补造provider result |
| `RetryFinalizeOnly` | current I04无application-owned case | I04 mapper不得选择；external delivery/finalize由其自身owner处理 | true only where another owner proves it | 重做I04 local mutation、broker ack或dead-letter当application finalize |
| `ProbeBeforeRetry` | commit/rollback unknown、post-commit transport certainty未知 | 先probe exact reservation/result/marker/transport identity，再分流replay、proven no-write或manual | false | probe前选择Acknowledge/Retry/DeadLetter或重跑handler |
| `ManualIntervention` | completed result缺失/损坏、persisted forbidden body、broken relation/index、deterministic canonicalization/invariant failure | operations/design owner修复或正式分类；automation fail closed | false | 从current truth重建immutable surface或伪装普通rejection |

Current canonical owner / event binding / durable landing 缺失不进入上述 runtime table；它们在 activation
阶段由设计与装配 owner 修正。特别是，不能把它们标成 `RetryAfterDependencyRecovery`，因为等待
repository恢复不会产生 canonical payload；也不能标成 `ManualIntervention` 的 public receipt，
因为当前连合法 I04 delivery surface 都不存在。

### 12.6 C-05 completion eligibility boundary

Application assembler/service 返回 typed input/result/error，不返回
`InboundConsumerCompletion::{Acknowledge, Retry, DeadLetter}`。Future worker exact mapper必须同时消费：

```text
slot_activation_proof
  + commit_certainty
  + receipt branch (Stored / Ephemeral)
  + immutable inner outcome and result_access
  + typed ref/error presence
  + recovery-class mapping
  + exact I04 transport policy
```

| validated condition | C-05 eligibility | required proof | current status |
|---|---|---|---|
| structural payload/event/landing owner gap | none；handler slot不得激活 | closure evidence absent by definition | blocked by existing I04 affected；no receipt |
| `Stored/FreshlyCommitted` accepted or authorized no-op | acknowledgement may be eligible | exact selected UoW committed，stored receipt revalidated | future only；durable landing unresolved |
| `Stored/Replayed` original outcome | current duplicate may be acknowledged under replay policy | exact reservation pointer、bytes/digest/presence validation；no rerun | future only；shared result access retained |
| stored durable rejected/quarantined/dead-lettered | ack或dead-letter只能由explicit I04 policy选择 | committed result/error/marker co-presence | exact action matrix留§13及后续flow审查 |
| ephemeral delayed + proven dependency recovery class | retry may be eligible after policy/bounds | no accepted write、owner已闭合、temporary cause proven | no immediate loop；not a structural gap |
| ephemeral rejected / unsupported schema | no generic action follows from outcome | exact producer/schema policy | no default ack/dead-letter |
| completed result missing/corrupt | no terminal receipt/action | consistency defect is the result | shared indeterminate boundary remains open |
| commit/rollback unknown after probe | no C-05 action with current carrier | certainty still absent | `S08-CONSUMER-INDETERMINATE-COMPLETION-01` |
| action execution fails after known commit | do not rerun I04 handler | stable receipt/result relation | worker/registrar recovery only |

本节固定 eligibility 和 prohibition，不选择 I04 每个 outcome 的 exact terminal action。§13在获得用户
确认后才可审查 concurrency/idempotency/reentry 与 action prerequisites；若届时 current Step06/07
仍没有一个 pure、total、no-wildcard I04 mapper seam，再登记 I04-specific action affected。本节不提前
创建泛化 action ID，也不关闭 shared indeterminate affected。

### 12.7 Consistency-defect catalog

以下缺陷不是普通 producer 输入错误，不能通过重新投递 I04 自动修复。Pre-activation owner gap 与
committed consistency defect仍保持不同：前者阻止slot激活，后者说明一个本应完整的durable relation
已经损坏。

| defect | detection | required result | forbidden repair |
|---|---|---|---|
| registry声称I04 active但缺canonical event/payload owner | composition-root closure audit | activation failure；surface affected visible to operations | 把任意Governance event当I04或返回UnsupportedSchema receipt |
| registered event/schema与finite I04 binding不一致 | static catalog validation | activation failure；no subscription exposure | first-match、wildcard event、十三decoder trial |
| completed reservation无internal result pointer | reservation relation | `CompletedReservationResultMissing` / consistency failure | 返回ephemeral rejection或重跑mutation |
| result pointer解析为zero/multiple rows | exact result repository | persistence invariant / manual | first/newest/global scan或mint alias |
| result kind/schema/operation不匹配 | stored-result validator | `StoredResultKindMismatch` / consistency failure | 用Command/Job decoder或current schema重新编码 |
| stored bytes超界、noncanonical或digest mismatch | immutable surface verifier | integrity consistency failure；bytes undisclosed | print、truncate、rehash raw bytes或current serializer修补 |
| reservation/result scope、event、actor或request digest不一致 | cross-relation validator | consistency failure；no old receipt exposure | 覆盖reservation或把它当duplicate |
| stored receipt outcome/ref/error co-presence非法 | Consumer receipt factory | consistency failure；no public receipt | current linkage/gap/outbox查询补字段 |
| persisted result含forbidden Governance body/material | redaction/integrity scan | body-free boundary + manual containment | hash/base64/truncate后继续使用 |
| selected primary relation为zero/multiple/foreign row | future exact repository | relation/persistence consistency failure | 任选一行、切换aggregate、mint replacement |
| persisted visibility/gap provenance丢失 | local policy/result validation | consistency failure；no default Visible/NotVisible | 从producer visibility或current gap猜测 |
| mark-completed可见但result尚不可见 | reservation/result atomic relation | consistency failure；probe/manual | 重跑handler或把reservation改回Reserved |
| committed primary缺mandatory mapped record/outbox/result relation | selected landing validator | persistence invariant / manual | 从current primary重建immutable follower |
| rollback failure或probe unsupported | UoW/probe owner | unknown visibility；no completion | 声称no-write并Retry |

安全诊断只允许携带 finite operation、error/defect kind、stage 和已经授权的 body-free refs。不得携带
Governance payload、stored bytes、expected/actual digest、provider body、SQL/driver text、stack、topic、
partition、offset、credential、endpoint或从current truth重建的解释文本。

### 12.8 Audit, marker and telemetry boundary

Error handling 不创建第二套 audit truth，也不把 telemetry 当成 commit proof。

| situation | allowed durable write | prohibited write / claim |
|---|---|---|
| structural owner/binding closure failure | none in I04 domain；只允许既有runtime/config owner报告activation failure | fake unsupported-schema receipt、gap、dead-letter marker或accepted audit |
| pre-admission header/schema/payload rejection | none | primary、H record、stored result、fresh marker、normal outbox |
| forbidden body detection | 只有未来已有owner且body-free的quarantine/gap/terminal marker lane | raw body、hash/body snippet、临时`QuarantineRef`或normal accepted event |
| temporary dependency / in-flight | none，除非exact owner已明确拥有独立availability/gap fact | synthetic reference、visibility、retry counter或accepted result |
| accepted local transition | selected primary、mapped record/authorized no-record、stored result、completion和registered outbox在一个UoW | Governance decision/policy/control/review/conclusion truth或external acceptance |
| formal durable negative | 只允许selected durable landing/result owner定义的body-free fact | error mapper自行mint marker/ref |
| commit unknown / persistence corruption | no speculative compensating event | committed/rolled-back声明、current-truth rebuilt receipt |
| ack/dead-letter failure after local commit | preserve committed local facts；no new I04 mutation | duplicate primary/record/outbox/result或source/business truth rewrite |

Runtime log/metric/trace 可以在后续 protocol observability小节记录 finite operation、stage、error kind、
recovery target和safe correlation。§12不定义字段名、metric名、label cardinality、span层级、阈值、
告警、runbook或evidence alias。任何 telemetry 丢失都不能改变 protocol result；任何 telemetry 存在也
不能证明 UoW committed、Governance evidence真实、retention obligation完成、report handoff送达或验收
签署存在。

### 12.9 I04 §12 affected and closure review

| affected / question | §12 conclusion | status after §12 |
|---|---|---|
| `S08-E-I04-PAYLOAD-SCHEMA-01` | ownerless payload是activation blocker，不映射UnsupportedSchema或temporary dependency | `open_upstream_internal` |
| `S08-E-I04-PRODUCER-EVENT-BINDING-01` | 缺finite binding时slot不激活，不trial decode十三event | `open_upstream_internal` |
| `S08-E-I04-REFERENCE-AUTHORITY-01` | producer/local reference越权映射typed reference/domain error；不mint替代ref | `open_internal_affected` |
| `S08-E-I04-CONTROL-FIELD-SOURCE-01` | complete input之前的control-field failure不reserve；trusted actor不能payload fallback | `open_internal_affected` |
| `S08-E-I04-DIGEST-AUTHORITY-01` | semantic digest、request digest和result integrity digest保持三种authority | `open_internal_affected` |
| `S08-E-I04-VISIBILITY-AUTHORITY-01` | normal restriction与relation corruption分离；I04不从producer visibility选择public outcome | `open_internal_affected` |
| `S08-E-I04-DIGEST-ORDER-01` | no candidate means no reserve；conflict/integrity branches禁止old three-field digest | `open_internal_affected` |
| `S08-E-I04-REDACTION-PROPAGATION-01` | error/recovery/dead-letter同样受body-free ceiling约束 | `open_internal_affected` |
| `S08-E-I04-DURABLE-LANDING-01` | structural landing gap不伪装RepositoryUnavailable；future exact writer错误矩阵已预留 | `open_internal_affected` |
| `S08-RECOVERY-CLASS-OWNER-01` | Step06无current enum owner，S08-B仅前向引用，冻结后序Step12不可反向授权；需后序重审唯一owner和total mapper | `open_internal_affected`（shared / downstream Step12 owner） |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | consistency/error mapper不得current outbox scan补receipt | `open_internal_affected` |
| `S08-CONSUMER-QUARANTINE-REF-01` | error branch不新增或暴露ownerless `QuarantineRef` | `open_internal_affected` |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | unknown commit/result无terminal C-05 shape | `open_internal_affected` |
| `S08-RESULT-ACCESS-LAYER-01` | replay仍只改outer access；error mapping不创建Duplicate outcome | `resolved_in_S08-B_step06_affected_open` |
| `R06-F-AFFECT-UOW-01` | known failure whole-set rollback、result-before-complete、unknown probe规则继续下游传播 | `step07_surface_closed_downstream_open` |

本节新增一个 **shared internal affected** `S08-RECOVERY-CLASS-OWNER-01`，没有新增 I04-specific
error enum、generic error affected或第三个 upstream blocker。九项 I04 专属 affected全部保持原状态。
Current error families可用既有 owner逐分支表达；缺口在跨协议 recovery enum/total mapper的唯一
声明，不应复制为每个Consumer的私有类型。

本节也不新增 I04-specific action affected：§12只固定C-05 eligibility/prohibition，exact action matrix
属于经用户确认后的§13及后续flow handoff审查。若届时不存在具名pure/total mapper，再按具体signature
登记，不能在本节预造泛化ID。

没有发现新的上游 blocker。Existing L1-governance payload和event-binding两项保持开放；新增项是
本仓后序owner affected。Protocol count保持`33/60 defined_with_affected_open`，Query `14/14`、
Consumer `3/9`，`0/60` unconditional complete；I04仍不计入defined。

### 12.10 §12 stop review

| check | conclusion |
|---|---|
| authorized scope | `pass_with_affected_open`；只进入I04 §12，未读取/写入§13以后、I05~I09、S08-F/G、Step09、formal或实现代码 |
| structural vs runtime | pass；owner/event/landing gap阻止activation，不伪装UnsupportedSchema、DependencyUnavailable、Manual receipt或Retry |
| current error owners | pass；复用current `ProtocolError`、20-variant `DomainError`、`ApplicationError`、public error surface和worker errors；未恢复淘汰variant或复制enum |
| internal/public mapping | header、schema、payload、body-free、reference/digest/visibility、idempotency、CAS、dependency、UoW、result、commit/rollback和transport分支均有finite target |
| write visibility | pre-admission零写；known pre-commit failure whole-set rollback；post-commit action failure不回滚；unknown commit无completion |
| recovery authority | 新增`S08-RECOVERY-CLASS-OWNER-01`；八类名称只作target vocabulary，后序Step12须重审唯一owner/total mapping/public bool |
| `RetryFinalizeOnly` | current I04无合法application branch；不用于ack、dead-letter、resolver或commit retry |
| C-05 boundary | application不返回action；structural/missing/corrupt/unknown无terminal action；exact I04 matrix未提前选择 |
| consistency / reconstruction | pass；禁止从current Governance/local truth、H record、outbox、gap或resolver重建result/error/receipt |
| truth / redaction | pass；error/recovery只表达Observability protocol/operations posture，不拥有Governance truth，不泄漏body/digest/provider/transport material |
| affected / blocker | I04 2 upstream + 7 local保持开放；新增1 shared local downstream-owner affected；无新增上游blocker、无关闭项 |
| current protocol count | 保持`33/60 defined_with_affected_open`；Query `14/14`；Consumer `3/9`；`0/60`无条件complete；I04为`in_progress_S01-S12` |
| formal / implementation / evidence | formal`03` frozen；代码、测试、compile/runtime evidence、commit、run_id、evidence alias与签署均`not_run_not_claimed` |
| next action | 立即停审；用户确认后只进入I04 §13，先读取current concurrency/idempotency/reentry owner、I03 §13粒度模板和I04 §10~§12；不得进入§14或后续批次 |
| current commit | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S12_recorded_with_affected_open_waiting_user_before_I04_S13
```

未经用户明确确认，不得进入 I04 §13；不得读取或写入 I04 §14 以后、I05~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段为 §12 的历史 checkpoint；current 状态由下方 §13 stop review 承接。

## 13. I04 concurrency, idempotency and reentry protection

本节只处理 `ConsumeGovernanceAuditContext` 的并发资源、幂等身份、重复投递、重入、
commit-unknown probe 与 C-05 action selection prerequisite。它复用 Step 06 的
`ObservationOperationContext`、`ObservationIdempotencyScope`、
`ObservationInboundEventIdentity`、`ObservationIdempotencyReservation`、
`ObservationIdempotencyReserveOutcome`、`RequestDigestCandidates`、
`StoredObservationResult`，以及 Step 07 的 reservation、stored-result 和 UoW ports；
不创建第二套 key、digest、result、duplicate state、transport action 或 Governance truth。

§6~§8 已证明 current I04 没有 canonical payload、finite producer-event binding、完整
application input 或可计算的 digest candidate，§10 又证明 durable landing 未裁定。因此
本节必须把两类结论分开：**current runtime 没有合法 reservation/writer lane**；下面的
并发和幂等矩阵是上述 owner 全部闭合后的 future implementation contract。Target-neutral
contract 不授权从 HLD 候选、repository capability 或冻结 formal `03` 猜测 primary、H-family、
cursor namespace 或 source-version ordering。

### 13.1 输入、范围与设计红线

| 输入 | 本节实际消费 | 不得越界的 authority |
|---|---|---|
| 详细设计 SOP Step 13 / 书写规范 §5.12 | 并发场景表、幂等键表、重入保护表，以及重复事件处理和planned verification cut | 不把设计矩阵写成测试已运行或adapter已存在 |
| Step 06 operation/idempotency objects | operation、effective actor、logical scope、Consumer secondary identity、reservation lifecycle和reserve outcome | I04不重定义字段、factory、state或增加`Duplicate` durable state |
| Step 06 digest/result owners | §8 fixed prefix、unresolved payload segment、opaque candidates和immutable stored result relation | 不hash raw body，不用`DigestSummary`替代`RequestDigest`，不从current truth重建result |
| Step 07 `ObservationIdempotencyRepository` | `reserve`、`load_by_scope`、`load_by_inbound_event`、`mark_completed` | logical row与event identity必须在一个atomic reserve中建立，禁止事后补alias |
| Step 07 `ObservationStoredResultRepository` | `save_result`、`get_result` | result先于completion staging；Replay只按exact pointer读取 |
| Step 07 `ObservationUnitOfWork*` | one-UoW staged invisibility、commit/rollback certainty和future target CAS承载 | transaction ref不是durable truth；unknown不得猜成commit或rollback |
| I04 §8~§12 | current digest不可构造、zero-write landing、exact replay、error/recovery与C-05 eligibility | structural gap不映射成runtime receipt；application不选择transport action |
| I03 §13粒度模板 | key layers、reserve outcome、CAS独立性、reentry、parity与Step09 handoff的表达深度 | 不复制I03的snapshot、H10、ReferenceCursor、freshness或Identity producer语义 |

本节不定义数据库DDL、锁级别、broker retry次数、delivery timeout、配置值、真实topic、
Governance event adapter、任何H-family、cursor namespace、repository产品、测试结果、run id或
evidence alias。未来实现可以选择满足契约的锁/事务机制，但不能让机制选择改变本文的
原子双键、result-before-complete、exact replay和unknown-commit语义。

### 13.2 Current reachability 与并发资源清单

#### 13.2.1 Current zero-reservation proof

| reservation prerequisite | current I04 finding | first prohibited operation | current consequence |
|---|---|---|---|
| registered canonical payload | 只有Observability use-site，无owner/wire/encoder/registration | typed payload decode或兼容map decode | slot activation fail closed；无application call |
| finite Governance event binding | 十三个outbound event没有到I04的有限event/schema/source/version映射 | 从event name、topic或字段相似度选择I04 | 无合法`ObservationInboundEventIdentity` |
| complete concrete input | 六个control fields不足以构成input；旧三个业务字段authority不成立 | 构造control-only input或在service补字段 | 无合法`ObservationOperationContext`交付给service |
| complete canonical material | 公共prefix已固定，operation-specific payload segment unresolved | 生成空payload candidate、hash raw frame或复制`DigestSummary` | 无`RequestDigestCandidates` |
| atomic reservation input | scope、secondary identity与candidate set必须同时完整 | `reserve`、`load_by_scope`或`load_by_inbound_event`探测“是否可能已处理” | 无`IdempotencyRef`、无reservation row |
| durable landing | primary/relation/version/transition/record/cursor/result mapping未裁定 | read/stage任一候选repository或先写generic audit row | 无accepted writer、无primary CAS、无stored result |
| terminal action input | 无合法receipt/result，structural gap不属于delivery outcome | 构造`Rejected`/`UnsupportedSchema` receipt或默认`Retry` | 无C-05 completion；slot不得暴露 |

因此 current reachable set 精确为：activation/config owner可报告I04 slot未闭合，但I04 domain/
application path创建的 reservation、primary、record、outbox、stored result、completion和transport
action全部为零。这里的“零”不是运行测试结论，而是由缺失输入owner导出的设计可达性结论。

#### 13.2.2 Future target-neutral concurrent resources

| resource | stable identity / relation | canonical owner | concurrency control | I04 constraint |
|---|---|---|---|---|
| logical reservation | `(ConsumeGovernanceAuditContext, effective ActorSafeRef, dedup_key)` | `ObservationIdempotencyRepository` | durable logical uniqueness；`Reserved -> Completed` | 相同scope不同digest不得覆盖winner |
| Consumer secondary identity | `(ConsumeGovernanceAuditContext, Governance, source_event_ref)` | `ObservationIdempotencyRepository` | 与logical relation同一次atomic reserve建立 | 同一event不能换actor/key成为第二writer；禁止late alias |
| retained request digest | existing reservation所声明profile对应的candidate | Step06 digest owner + idempotency store | immutable profile-aware comparison | retained profile无candidate时是`PersistedDigestProfileUnreadable`，不得fallback |
| future primary relation | owner-approved operation target + exact committed version/relation | `S08-E-I04-DURABLE-LANDING-01`关闭后选定的唯一domain/repository owner | expected-version CAS或该owner明确的create-if-absent guard | reservation与primary guard相互独立；本节不命名target/version type |
| mapped record / outbox set | only the selected transition's owner-approved immutable relations | selected record/outbox owners | same-UoW append/uniqueness | 未裁定前集合为空；不得默认H3/H8/H10或outbox |
| stored result | `StoredObservationResultRef -> IdempotencyRef` exact relation | `ObservationStoredResultRepository` | immutable append and exact pointer validation | `save_result`必须先于`mark_completed` |
| UoW | one process-local consumed handle | `ObservationUnitOfWorkManager` | staged invisibility、one commit/rollback outcome | known failure whole-set rollback；unknown只probe |
| worker completion | one validated receipt + one exact I04 mapper decision | worker C-05 owner | after commit certainty/result validation | registrar只执行，不重分类、不反写local truth |

Governance decision、policy、control、review、conclusion、nonconformity、trace、raw event body、
transport offset/ack state和business evidence truth都不是I04可锁定或CAS的资源。对这些事实加本地
lock、reservation或retry不能把它们转化为Observability-owned truth。

#### 13.2.3 Target-neutral ordering invariant

Future owner closure 后，唯一允许的顺序是：

```text
activated finite I04 slot
  -> trusted header and static Governance binding admission
  -> canonical typed payload + body-free/redaction validation
  -> complete concrete input and one RequestDigestCandidates set
  -> begin one UoW
  -> atomic logical + secondary reservation
  -> branch Replay / Conflict / InFlight, or continue only on Acquired
  -> read exact owner-selected primary relation and committed version
  -> run the owner-selected transition/explicit-no-write decision once
  -> stage the owner-approved primary CAS/create and only its mapped followers
  -> stage immutable StoredObservationResult
  -> mark the same reservation Completed
  -> commit once
  -> validate result/receipt and call the exact I04 C-05 mapper once
```

The sequence intentionally contains no concrete snapshot、H3/H8/H10、cursor or source-version
comparator. Those names become legal only if `S08-E-I04-DURABLE-LANDING-01` and the upstream
event binding jointly select them. `Replay`、`Conflict` and `InFlight` exit before any primary read,
resolver, transition, local ref mint, record/outbox stage or result creation.

### 13.3 Logical/secondary key 与 digest matrix

#### 13.3.1 Key layers

| layer | canonical key/material | source | uniqueness/comparison semantics | explicitly excluded |
|---|---|---|---|---|
| logical scope | `(ObservationInboundConsumerOperation::ConsumeGovernanceAuditContext, effective ActorSafeRef, dedup_key)` | static operation + C-03 trusted actor + validated envelope key | primary idempotency lookup; same key with changed material is Conflict | source event、trace、occurred_at、transport attempt |
| secondary event identity | `(ConsumeGovernanceAuditContext, ObservationProducerFamily::Governance, source_event_ref)` | finite registered binding + validated header | second unique identity in the same reserve; prevents key swapping | actor、dedup key、topic/offset、local result ref |
| request material | §8 fixed prefix + future owner-approved body-free payload segment | sole canonicalizer after complete admission | semantic equality material with fixed order/presence tags | dedup、trace/time/transport、local effects、Governance body |
| retained candidates | matching value from opaque `RequestDigestCandidates` | canonicalizer computes all readable candidates once | repository compares the profile retained by the existing row | adapter-generated digest、current-profile-only fallback |
| replay relation | reservation operation/actor/key/event/digest + exact result pointer | idempotency and stored-result repositories | all members must agree before Replay | current primary/record/outbox reconstruction |

The logical and secondary keys solve different attacks and cannot be concatenated into one free-text
key. `source_event_ref` remains in semantic request material but outside logical scope; `dedup_key`
remains in logical scope but outside request digest. Both identities are supplied to one `reserve`
call, so an adapter cannot insert the logical row first and attach or repair an event alias later.

#### 13.3.2 Digest admission and profile rules

`ObservationDigestCanonicalizer::request_candidates` may be called exactly once only after all
header、binding、schema、typed payload、unknown-field、body-free and field-authority gates pass.
Current I04 cannot reach that call because §8 payload material is unresolved. Future candidates must
retain the §8 order:

```text
operation
-> effective actor_ref
-> producer_family
-> source_event_ref
-> source_ref
-> explicit source_version_ref option
-> schema_version
-> owner-approved operation payload members in their registered order
```

`RequestDigestCandidates` is passed opaquely to `reserve`; worker、service and infra may not choose a
single digest and rehash it. Existing reservation profile controls which supplied candidate is read.
If that profile has no supplied readable candidate, the operation fails as
`PersistedDigestProfileUnreadable`; it is neither an `IdempotencyConflict` nor permission to compare
the current write profile.

#### 13.3.3 Atomic reserve result matrix

| logical relation | secondary relation | retained digest/result relation | exact outcome | writer permission |
|---|---|---|---|---|
| absent | absent | complete valid candidate set | `Acquired(reservation)` | exactly one future writer |
| present `Reserved`, exact same reservation | present, exact same reservation | equal candidate | `InFlight` | none |
| present `Completed`, exact same reservation | present, exact same reservation | equal candidate + valid result pointer | `Replay` | none; exact result read only |
| present | missing or bound to another event/reservation | equal or different | `Conflict` or canonical consistency failure | none; no alias creation |
| missing | present | any | secondary conflict/consistency failure | none; do not insert logical row |
| present | present but cross-index refs disagree | any | consistency failure, not ordinary duplicate | none; no first-row choice |
| present | exact identity | different digest | `Conflict` | none; winner result not disclosed |
| present | exact identity | retained profile has no candidate | `PersistedDigestProfileUnreadable` error | none; no fallback or Conflict |
| `Completed` | exact identity | pointer missing/wrong kind/schema/actor/event/digest | consistency failure | none; no Replay and no reconstruction |

`Conflict` may carry the existing internal winner `idempotency_ref` required by the Step06 outcome,
but public I04 error/receipt mapping must not expose winner receipt、result、refs or stored bytes.
`Replay` is valid only after the original pointer and immutable relation pass exact validation.

### 13.4 Concurrency scenario matrix

| scenario | contended resource | atomic guard / winner rule | required I04 behavior | planned verification cut |
|---|---|---|---|---|
| same delivery processed in parallel | logical + secondary identities | one atomic `reserve`; at most one `Acquired` | loser is `InFlight` or later exact `Replay`; no second service writer | barrier two callers at reserve and assert one writer |
| same logical key/digest, different source event | logical relation versus foreign secondary identity | complete relation check precedes outcome | Conflict/consistency; no winner receipt and no new event alias | table row with same scope and changed event |
| same event, different actor or dedup key | secondary uniqueness versus new logical relation | existing event identity blocks second reservation | Conflict/consistency; no key migration | table rows varying actor and key independently |
| same logical/event identities, different digest | retained digest comparison | existing row wins immutably | Conflict and zero primary/result writes | retained-profile mismatch row |
| same identities/digest, first completed | completed reservation + result pointer | exact relation validation | `Stored/Replayed`; inner outcome/refs/error unchanged | byte-equal stored inner surface replay |
| same identities/digest, first still reserved | reservation lifecycle | existing writer keeps permission | `InFlight`; no recursive wait or handler rerun | controlled first-writer pause |
| completed reservation with missing/corrupt result | reservation/result consistency | exact pointer validation fails | no receipt/action; manual/probe recovery only | missing, wrong-kind and digest mismatch rows |
| two different admitted operations target one future primary | owner-selected primary version/relation | each may reserve, but only exact target CAS/create guard can win compatible mutation | stale writer ends in conflict/owner decision; no reload-and-save | injected stale expected-version once target exists |
| two attempts stage result/completion | result-ref/reservation relation | one immutable result + completion CAS in same UoW | duplicate stage fails whole set; no visible partial pair | fail `save_result` and `mark_completed` independently |
| commit outcome unknown then redelivery | original stable identities | exact scope/event/result probe only | replay, known no-write recovery, in-flight or no completion | unknown-commit matrix; never change key |
| post-commit action attempted twice | committed receipt + transport delivery | stable stored relation; action has no domain write authority | repeat probe/replay/action handling without local mutation | injected ack/dead-letter failure after commit |
| Query reads during future I04 commit | committed projection boundary | Query remains outside reservation/UoW | old or new complete committed view only; no staged row | concurrent committed-read boundary |
| current ownerless slot receives delivery | activation catalog | slot absent because prerequisites fail startup | no I04 callback, receipt, reservation or C-05 action | static activation completeness check |

The last column defines later Step16 cuts only. No test, fake, durable adapter or runtime behavior is
claimed to exist or to have passed in this step.

#### 13.4.1 Reservation and future primary CAS are independent guards

1. `Acquired` proves only operation/event writer admission; it does not prove a Governance-to-local
   relation, target existence, transition legality or expected version.
2. A future primary CAS/create success cannot create a second stored result; result and completion
   must still bind the same acquired reservation in the same UoW.
3. A record/outbox append cannot prove the primary or result committed; the single UoW commit must
   cover the complete selected set.
4. A stale target CAS cannot be repaired inside the same delivery by reloading and reapplying the
   transition. The writer ends with the canonical conflict/recovery branch.
5. Until the durable target owner is selected, no implementation may substitute a generic row lock,
   source-version token, event arrival order, timestamp or cursor for the missing primary guard.

### 13.5 Replay、Conflict、InFlight 与重入

#### 13.5.1 Outcome precedence

The atomic repository must validate both indexes and their complete relation before classifying the
incoming request. The explanatory precedence is:

```text
cross-index corruption / foreign relation
  -> Conflict or canonical consistency failure
retained profile cannot be compared
  -> PersistedDigestProfileUnreadable
same complete identity + digest + Completed + valid result pointer
  -> Replay
same complete identity + digest + Reserved
  -> InFlight
neither identity exists
  -> Acquired
```

This order does not add a new `ObservationIdempotencyReserveOutcome` variant. It prevents a corrupt
completed row from being downgraded to `InFlight`, a profile error from being reported as Conflict,
or one matching index from hiding a mismatch in the other.

#### 13.5.2 Duplicate and redelivery behavior

| reentry source | admission path | application writer body | returned surface | local write |
|---|---|---|---|---|
| exact at-least-once redelivery after known commit | `Replay` + exact `get_result` | never entered | original `ObservationStoredConsumerReceipt` with outer `Replayed` access | none |
| worker timeout after known commit | same keys/candidates | no primary/resolver/transition call | exact replay or current in-flight classification | none |
| parallel retry before first commit | `InFlight` | no wait-and-recursively-run | eligible delayed/in-flight surface only after exact mapper closure | none |
| same key with changed canonical payload | `Conflict` | not entered | typed conflict rejection; no winner surface | none |
| same event with changed actor/key | secondary relation conflict | not entered | conflict/consistency; no alias | none |
| completed result relation damaged | exact pointer probe | no reconstruction | consistency/no-completion path | none |
| redelivery after ack/dead-letter execution failure | exact stored relation | no application rerun | original stored receipt; transport owner retries/probes action | none |

`ObservationProtocolResultAccess::Replayed` is invocation metadata only. It cannot modify the stored
inner outcome、source event、result ref、changed/outbox/gap/dead-letter refs、safe error、digest or
stored bytes. Delivery attempt、new trace or retry time cannot mint a new public result identity.

#### 13.5.3 Reentry protection table

| reentry point | protected relation | required guard | allowed recovery posture |
|---|---|---|---|
| before candidate/reserve | static operation、trusted actor、finite event binding、typed payload | assembler and canonicalizer gates | reject/disable before UoW; no reservation probe as discovery |
| after `Acquired`, before target read | reservation/scope/event/digest | one private reservation in one UoW | failure rolls back; no retry inside handler |
| after future target read | exact target relation + committed expected version | selected owner transition consumes that exact pre-state | relation/CAS failure ends writer; no reload loop |
| after target/follower staging | same transition proof and staged refs | result assembler copies staged refs only | any failure rolls back complete set |
| after result staging, before completion | result ref + same reservation | only `mark_completed` closes reservation | completion failure rolls back; no visible result/completed split |
| after commit, before C-05 | committed result/receipt + commit certainty | exact I04 mapper receives validated branch once | transport action only; no domain mutation |
| commit/rollback unknown | original logical + secondary identities and digest profile | exact committed-read probe | replay/known-no-write/in-flight or typed no-completion |

I04 has no recursive “retry current service function” branch. A legitimate redelivery re-enters at
the worker boundary with the original operation、actor、dedup key、source event and canonical material.
It cannot reuse a consumed UoW、reservation value、generated ref or staged transition, and cannot call
a domain transition directly.

### 13.6 Commit-unknown and post-commit reentry

The only safe probe identity is the original complete relation:

```text
(ConsumeGovernanceAuditContext,
 effective actor,
 dedup_key,
 Governance,
 source_event_ref,
 retained-profile request digest)
```

The exact probe sequence is fixed and uses only current Step07 read ports:

```text
commit or rollback outcome unknown
  -> do not mint a new key, reservation, primary, record, result or outbox ref
  -> do not rerun assembler/service/transition or invoke a different durable target
  -> load committed reservation by the original ObservationIdempotencyScope
  -> load committed reservation by the original ObservationInboundEventIdentity
  -> require both paths to resolve to the same reservation and retained digest/profile
  -> if Completed, load only its exact StoredObservationResult pointer
  -> validate operation/actor/event/digest/result kind/schema/body-free relation
  -> classify Replay, Reserved/InFlight, proven no-write, consistency defect or indeterminate
  -> only a terminal validated branch may enter the exact I04 action mapper
```

| probe finding | permitted behavior | prohibited behavior |
|---|---|---|
| both indexes identify Completed + exact result validates | return original stored surface with `Replayed`; then exact mapper may select replay action | create another result, rerun handler or change inner outcome |
| both indexes identify same Reserved row | in-flight/delayed recovery according to exact policy | assume commit failure, wait recursively or acquire another writer |
| both indexes absent and adapter proves no durable write | use only the owner-defined known-no-write recovery path | infer no-write from one missing read or eventual-consistency timeout |
| scope/event indexes disagree | consistency/manual recovery; no completion | choose one index, repair alias in I04 or attach event to a new row |
| result missing/wrong kind/schema/digest/relation | consistency/manual recovery; no completion | reconstruct from current primary、record、outbox or Governance truth |
| retained profile unreadable | canonical profile error; no fallback | compare current profile or map to Conflict |
| probe unsupported or still unknown | no legal C-05 completion | default `Retry`、`Acknowledge` or `DeadLetter` |

The last row remains blocked by `S08-CONSUMER-INDETERMINATE-COMPLETION-01`; §13 does not invent
a pending carrier. After a known local commit, ack or dead-letter execution failure is different:
the immutable result remains committed, no rollback is attempted, and later delivery uses exact replay.
Transport recovery may retry/probe its own action but cannot reopen the application writer lane.

### 13.7 Target-neutral accepted writer and no-write rules

After all owner gaps close, one `Acquired` branch must obey these rules:

1. `reserve` is the first durable admission decision; a primary lookup cannot decide whether this
   logical operation is new.
2. The selected durable owner must provide one exact target relation, committed version and finite
   decision before mutation. Missing/ambiguous relation cannot be converted to create by convenience.
3. A target transition/explicit-no-write decision is evaluated once against the exact pre-state;
   a stale writer does not reload and retry within the delivery.
4. Only the selected transition's primary, records and optional outbox pair may be staged. An
   explicit-no-record/no-outbox branch allocates none; no generic audit follower is mandatory.
5. Result assembly copies only refs and safe facts already produced by that same staged decision;
   it never queries current state to fill a receipt.
6. `save_result` precedes `mark_completed` in the same UoW. Neither operation may be committed alone.
7. Commit occurs once. Known failure rolls back the whole staged set; unknown outcome enters §13.6.
8. Replay、Conflict、InFlight、structural gap、consistency defect and unknown never execute the
   accepted writer sequence a second time in the same delivery.

| branch | primary/record/outbox | stored result/completion | resolver/transition | C-05 eligibility |
|---|---|---|---|---|
| current structural affected | none | none | none | none; slot inactive |
| malformed/unsupported pre-admission | none | none | none | only after a legal ephemeral receipt and exact policy; current ownerless schema is not this branch |
| `Replay` | none | read exact original only | none | yes only after exact receipt validation |
| `Conflict` | none | none for incoming request | none | only after exact ephemeral error/policy mapping; winner hidden |
| `InFlight` | none | none | none | conditional delayed handling; no default Retry |
| `Acquired` known failure | rolled back whole set | none visible | at most the failed single attempt | only known-no-write policy, never stored success |
| `Acquired` known commit | exact selected set | exact immutable result + Completed | once | eligible after result/receipt validation |
| commit/probe unknown | no speculative compensation | no claimed terminal surface | no rerun | none under current carrier |
| post-commit action failure | preserve committed set | preserve exact stored result | none | transport-owned failure/replay only |

### 13.8 C-05 action prerequisites and `ACTION-MATRIX` affected

Step07 requires an exact worker mapper to return one
`InboundConsumerCompletion::{Acknowledge, Retry, DeadLetter}` and forbids wildcard/default action,
but it does not define a named I04 pure/total mapper seam. §12 fixed eligibility and recovery targets;
the following matrix makes the remaining gap explicit without choosing policy from outcome alone.

| validated I04 input to mapper | target / prohibition | mandatory proof before selection | current status |
|---|---|---|---|
| any `Stored/Replayed` exact original receipt | target `Acknowledge` for this duplicate delivery | exact result pointer, byte-stable inner surface, committed original relation | shared target known; named I04 mapper missing |
| `Stored/FreshlyCommitted/Accepted` | target `Acknowledge` | known commit, no error, exact refs/result relation | target known; durable branch itself affected |
| owner-authorized `Stored/FreshlyCommitted/NoOp` | target `Acknowledge` | durable no-change fact/result and exact policy | conditional; owner/mapper open |
| owner-authorized stored `DeadLettered` | target `DeadLetter` only | local body-free dead-letter fact/result known committed | conditional; action cannot create marker |
| owner-authorized stored `Quarantined` | no default terminal action | exact isolation fact/result, recovery class and I04 policy | open; outcome alone insufficient |
| stored or ephemeral `Rejected` / idempotency conflict | no generic action | commit certainty, exact error/ref presence and recovery class | open; winner/result not exposed |
| ephemeral `UnsupportedSchema` | no default action | registered schema family plus exact correction/drop policy | open; ownerless payload is not this branch |
| ephemeral `Delayed` / `InFlight` with retry-eligible class | `Retry` may be selected | proven no accepted write, bounded transport policy, same stable identities | open; no recursive handler retry |
| delayed branch whose class forbids retry | no `Retry` | exact input-change/manual/state policy and legal alternative | open; no wildcard fallback |
| consistency defect or corrupt/missing completed result | no C-05 action | valid receipt is absent | fail closed/manual or probe owner |
| commit/probe still unknown | no C-05 action | uncertainty itself blocks terminal selection | shared indeterminate affected |
| action execution failure after known commit | typed worker error; do not reclassify receipt | original stored relation remains committed | later delivery exact replay only |

登记 `S08-E-I04-ACTION-MATRIX-01=open_internal_affected`。关闭条件必须同时满足：

1. Step06/07提供一个I04具名、可定位、pure、total、no-wildcard mapper seam。
2. Mapper输入至少覆盖slot activation proof、commit certainty、`Stored/Ephemeral` branch、
   inner outcome、`FreshlyCommitted/Replayed` access、refs/error presence、recovery class和exact
   I04 transport policy；不得从error text或一个`retryable` bool反推action。
3. 每个上表分支返回一个明确C-05 variant，或在shared carrier修复后返回typed no-completion；
   consistency/unknown不得被默认映射。
4. Step09 `ConsumeGovernanceAuditContextFlow`只在result/receipt验证和必要probe之后调用该mapper
   一次，registrar随后只执行所选action。
5. Step16以表驱动cut覆盖fresh、replay、NoOp、negative、ephemeral、Conflict、InFlight、
   consistency、unknown和post-commit action failure，并证明实现没有wildcard/default arm；
   本节不声称这些测试已创建或运行。

This affected differs from `S08-CONSUMER-INDETERMINATE-COMPLETION-01`: the new item covers the
total known-result action mapping for I04, while the shared item covers the missing return shape when
commit probe remains unknown. It also differs from `S08-RECOVERY-CLASS-OWNER-01`, which owns the
cross-protocol recovery vocabulary and total error-to-recovery mapping.

### 13.9 Fake、controlled 与 durable parity

| contract surface | fake obligation | controlled/failure-injection obligation | durable obligation | parity violation |
|---|---|---|---|---|
| logical + secondary uniqueness | classify both identities in one staged atomic decision | inject logical-only, event-only and cross-index mismatch | enforce both unique relations transactionally | logical insert followed by alias attach |
| digest profile comparison | retain row profile and all supplied candidates | inject unreadable retained profile and mismatch | compare exact persisted profile without fallback | current-write-digest-only comparison |
| reservation lifecycle | only `Reserved -> Completed`; outcomes remain ephemeral | inject all four outcomes without state mutation | completion CAS with exact result relation | persist Replay/Conflict/InFlight as state |
| future primary guard | model only the owner-selected exact relation/version | inject stale/duplicate/missing relation after landing closes | enforce selected CAS/create predicate in same UoW | generic last-write-wins or guessed target |
| result-before-complete | reject completion unless exact result staged | fail save and completion independently | transaction/constraint keeps pair atomic | visible completed row with missing result |
| staged visibility | committed reads cannot see staged reservation/primary/result | fail each stage and assert no partial committed set | transaction isolation and relation constraints | global fake mutation before commit |
| commit ambiguity | distinguish known failure from unknown | inject unknown, divergent indexes and unsupported probe | map driver ambiguity without guessing | unknown converted to success/absence |
| exact replay | load immutable bytes by original pointer | inject wrong kind/schema/digest/ref | exact pointer lookup and body-free validation | rerun service or reconstruct current truth |
| redaction | apply §9 allowlist to fixture/debug/error surfaces | inject forbidden body in every exit | same body-free persistence/diagnostic ceiling | hash/truncate/base64/debug body leakage |
| I04 action mapper | same finite table and no wildcard | inject every branch including action failure | exact result/probe input; registrar cannot reclassify | generic Consumer default action |

No adapter or test is asserted to exist or pass. This table is a later implementation and Step16
parity obligation; current structural owner gaps still prevent invoking any I04 reservation adapter.

### 13.10 Step 09 handoff

I04 hands exactly one named flow to Step09: `ConsumeGovernanceAuditContextFlow`. The flow remains
target-neutral until its upstream payload/binding and durable landing affected items close. Step09 may
not create a generic Consumer flow or invent a repository callable to make the skeleton look complete.

```text
validated finite I04 delivery
  -> matching I04 assembler produces complete input and candidates
  -> begin one UoW
  -> atomic reserve(logical scope, secondary event identity, candidates)
  -> Replay / Conflict / InFlight terminal branch
  -> Acquired: exact selected-primary relation/version read
  -> one selected decision and CAS/create with owner-approved followers
  -> save exact StoredObservationResult
  -> mark reservation Completed
  -> commit once or enter exact probe
  -> validate Stored/Ephemeral receipt
  -> invoke exact I04 C-05 mapper once
  -> registrar executes action without reclassification
```

| flow seam | current Step07 source | §13 handoff | unresolved condition |
|---|---|---|---|
| input assembly | `ObservationInboundInputAssembler::consume_governance_audit_context` | sole context/input/candidate construction entry | payload, event binding, control fields and digest affected |
| application call | `ObservationInboundEventService::consume_governance_audit_context` | sole I04 service method | complete input and durable landing unavailable |
| UoW lifecycle | `ObservationUnitOfWorkManager::begin/commit/rollback` | one handle; known/unknown outcomes distinct | exact write set pending landing |
| atomic admission | `ObservationIdempotencyRepository::reserve` | logical and secondary identity established together | current candidates unavailable |
| exact probe | `load_by_scope` + `load_by_inbound_event` | both indexes must identify same reservation | no first-row/fallback path |
| future primary read/write | no legal I04-specific selection yet | Step09 must cite one exact existing/repaired port after landing closure | `S08-E-I04-DURABLE-LANDING-01` |
| optional record/outbox staging | only the selected landing's registered owners | explicit set or explicit empty set | no H-family/outbox inference in §13 |
| result persistence/replay | `ObservationStoredResultRepository::save_result/get_result` | immutable exact surface; no current-truth reconstruction | operation-specific result refs depend on landing |
| reservation completion | `ObservationIdempotencyRepository::mark_completed` | only after result staging in same UoW | no split commit |
| C-05 mapping | Step07 requires exact worker mapping but has no named I04 seam | once after receipt/probe | `S08-E-I04-ACTION-MATRIX-01` + shared recovery/indeterminate items |

This is a handoff contract, not a Step09 implementation. Any missing callable, return surface or owner
must remain an affected item; Step09 cannot close it by introducing a local helper without reopening
Step06/07 ownership.

### 13.11 Affected and closure review

| affected / question | §13 conclusion | status after §13 |
|---|---|---|
| `S08-E-I04-PAYLOAD-SCHEMA-01` | current candidate/reservation/writer不可达；不以空payload进入reserve | `open_upstream_internal` |
| `S08-E-I04-PRODUCER-EVENT-BINDING-01` | secondary identity必须来自finite binding；不trial decode或按event name绑定 | `open_upstream_internal` |
| `S08-E-I04-REFERENCE-AUTHORITY-01` | future target/ref只能由selected local owner构造；producer不能提交local state/ref | `open_internal_affected` |
| `S08-E-I04-CONTROL-FIELD-SOURCE-01` | complete private input是candidate/reserve前置；control-only input禁止 | `open_internal_affected` |
| `S08-E-I04-DIGEST-AUTHORITY-01` | semantic digest、request digest、result integrity保持独立authority | `open_internal_affected` |
| `S08-E-I04-VISIBILITY-AUTHORITY-01` | visibility不进入producer-owned key/material，也不决定action | `open_internal_affected` |
| `S08-E-I04-DIGEST-ORDER-01` | fixed prefix、future payload order、一次candidate和retained-profile comparison已传播到§13 | `open_internal_affected` until Step06/07/09 propagation |
| `S08-E-I04-REDACTION-PROPAGATION-01` | reserve/replay/probe/action/parity全部受同一body-free ceiling约束 | `open_internal_affected` |
| `S08-E-I04-DURABLE-LANDING-01` | reservation与future primary CAS分离；§13拒绝猜primary/H-family/cursor/source ordering | `open_internal_affected` |
| `S08-E-I04-ACTION-MATRIX-01` | 新增；known-result与ephemeral branches缺具名pure/total/no-wildcard I04 mapper | `open_internal_affected` |
| `S08-RECOVERY-CLASS-OWNER-01` | exact mapper必须消费唯一recovery owner，不能由I04复制enum | `open_internal_affected` shared |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | probe仍unknown无合法C-05 completion；不默认Retry | `open_internal_affected` shared |
| `S08-CONSUMER-OUTBOX-SURFACE-01` / `S08-CONSUMER-QUARANTINE-REF-01` | result/replay/action不得current lookup补outbox或mint ownerless quarantine ref | `open_internal_affected` shared |
| `S08-RESULT-ACCESS-LAYER-01` | replay只改变outer access，inner stored surface保持原值 | `resolved_in_S08-B_step06_affected_open` |
| `R06-F-AFFECT-UOW-01` | atomic reserve、future target guard、result-before-complete和unknown probe继续后序传播 | `step07_surface_closed_downstream_open` |
| `03-RPR-S09-PER-FLOW` | target-neutral single-flow handoff已记录，函数级展开仍未开始 | `open` |

I04-specific affected 由九项增至十项：两项上游内部blocker和八项本仓internal affected。
本节新增的只有 `S08-E-I04-ACTION-MATRIX-01`，没有新增上游 blocker，也没有关闭既有项。
Protocol count保持`33/60 defined_with_affected_open`、Query `14/14`、Consumer `3/9`、
`0/60` unconditional complete；I04仍不计入defined。

### 13.12 §13 stop review

| check | conclusion |
|---|---|
| authorized scope | `pass_with_affected_open`；只进入I04 §13，未读取/写入§14以后、I05~I09、S08-F/G、Step09、formal或实现代码 |
| current reachability | pass；canonical payload/binding/input/candidates缺失使reserve、writer、stored result和C-05全部不可达，未伪造runtime rejection |
| concurrency resources | logical reservation、secondary identity、retained digest、future primary guard、followers、stored result、UoW和action均有owner/未决边界 |
| idempotency key | exact logical和secondary keys固定，并要求在一个atomic `reserve`中建立；dedup/event/digest不互相替代 |
| outcome matrix | `Acquired/Replay/Conflict/InFlight`、profile unreadable和cross-index corruption均有独立行为；只有Acquired可写 |
| primary concurrency | reservation与future target CAS是两个guard；未选择snapshot、H3/H8/H10、cursor namespace或source ordering |
| replay/reentry | exact pointer only；无recursive retry、winner exposure、late alias、current-truth reconstruction或post-commit writer reopen |
| commit unknown | 只按原scope+event identity做双索引probe；仍unknown无C-05 completion，shared affected保持开放 |
| C-05 mapper | 新增`S08-E-I04-ACTION-MATRIX-01`，关闭条件覆盖activation、certainty、branch/outcome/access、refs/error、recovery、policy、Step09 once-only和Step16 no-wildcard |
| adapter parity | fake/controlled/durable矩阵已记录为planned contract；未声称adapter/test存在或通过 |
| Step09 handoff | 唯一`ConsumeGovernanceAuditContextFlow` target-neutral skeleton可回指current ports；缺失landing/action seam仍登记affected |
| truth/redaction | 不拥有或反写Governance truth；key/digest/probe/replay/action均禁止raw body与unsafe diagnostics |
| affected/blocker | I04 2 upstream + 8 local = 10项专属affected；另有shared affected；无新上游blocker、无关闭项 |
| current protocol count | 保持`33/60 defined_with_affected_open`；Query `14/14`；Consumer `3/9`；`0/60`无条件complete；I04为`in_progress_S01-S13` |
| formal/implementation/evidence | formal`03` frozen；代码、测试、compile/runtime evidence、commit、run_id、evidence alias和签署均`not_run_not_claimed` |
| next action | 立即停审；用户确认后只进入I04 §14，先读取current protocol observability/audit owner、I03 §14粒度模板与I04 §9~§13；不得进入§15或后续批次 |
| current commit | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S13_recorded_with_affected_open_waiting_user_before_I04_S14
```

未经用户明确确认，不得进入I04 §14；不得读取或写入I04 §15以后、I05~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该恢复点现为 §13 的历史 checkpoint；current 状态由下方 §14 stop review 承接。

## 14. I04 protocol observability, audit projection and safety boundary

本节只把 `ConsumeGovernanceAuditContext` 在 §§1~§13 已经固定的 activation、admission、
redaction、reservation、future local writer、stored result、error、reentry 和 C-05 边界，
收敛为协议级 runtime telemetry 与 durable audit 契约。它不修复 canonical payload、
Governance event binding、完整 input 或 durable landing，也不把冻结的全局 Step 15 当作
已经实现的 telemetry facade。所有 log、metric、span 和 durable record 只描述
Observability 自有处理事实；不能成为 Governance decision、control、review、conclusion、
nonconformity、evidence authenticity、report delivery 或外部验收的第二 truth source。

本协议必须区分两个互斥世界：

1. **Current world**：两个上游 blocker 与本地 input/landing affected 未关闭，I04 slot
   不具备合法 activation 条件。只有 config/runtime assembly owner 可以报告“该 slot
   未形成可激活 binding”这一 process-level 事实；没有合法 delivery，因此没有
   Consumer received、schema rejected、reservation、receipt、worker action、accepted metric
   或 durable audit。
2. **Future world**：只有 payload owner、finite event binding、redaction/input/digest 和
   exact durable landing 全部闭合后，一个真实 delivery 才能进入下文 delivery telemetry。
   Future 合同用于约束后续实现，不表示 slot、adapter、sink、dashboard 或测试当前存在。

### 14.1 Scope, truth owner and current reachability

#### 14.1.1 Observable surfaces and owners

| 关注面 | Current I04 可记录内容 | Future 合法 delivery 可记录或改变内容 | 唯一 owner / 落点 | I04 明确不拥有 |
|---|---|---|---|---|
| runtime assembly log | finite slot、assembly stage、typed activation/config failure class；不含假想 envelope | 同样的 startup/registration health | runtime builder、config validator、worker registrar 的 telemetry cut | payload、event occurrence、delivery、Governance truth |
| delivery log | none；slot 未激活 | 已确定的 phase、typed result/error/recovery、safe bounded count | worker/application/infra telemetry facade；out-of-band | durable truth、broker truth、Governance body |
| runtime metric | `config_validation` / `runtime_assembly` / telemetry suppression 类 process fact；不得计 inbound delivery | finite Consumer、idempotency、UoW、repository、replay 和 worker action计数/耗时 | Step 15 finite metric owner | retry policy、commit proof、evidence、retention、report truth |
| runtime span | runtime assembly/registration span；不得建立假想 `observability.consumer` span | trusted `trace_ref` 传播和真实调用父子关系 | runtime tracing backend；无 durable span row | actor、event identity、digest、source order、commit proof |
| local operation truth | none | exact owner-selected local transition或explicit durable no-op；landing尚未裁定 | `S08-E-I04-DURABLE-LANDING-01` 关闭后唯一 owner | Governance context/gate/decision/policy/control/review/conclusion |
| native history / audit | none | 仅 selected local transition 的 canonical native record，或 owner 明确的 no-record | 同一 selected owner/UoW；当前不命名 H-family | generic `GovernanceContextObserved` ledger、Governance audit history |
| stored Consumer result | none | known-committed accepted/no-op/owner-backed negative的immutable result；Replay只读原结果 | `ObservationStoredResultRepository` + result owner | current-truth reconstruction、telemetry-only duplicate |
| idempotency completion | none | logical + secondary reservation到exact result pointer的完成关系 | `ObservationIdempotencyRepository` | event alias后补、metric-derived replay |
| authorized outbox | none | 仅 selected owner 明确授权且在同一 accepted UoW 冻结的body-free snapshot | existing outbox owner；具体mapping仍affected | current Governance truth重建、telemetry snapshot |
| evidence linkage | none | I04不自动创建或更新；只能由后续正式 evidence owner flow 消费已提交 body-free input | `EvidenceLinkage` / `AuditEvidenceRepository` owner | evidence body、alias、authenticity/verdict、linkage lifecycle |
| retention marker / protection | none | I04不自动创建、修改、延长或删除 | `RetentionMarker` / `ActiveReferenceProtectionRef` owner | retention policy、days、cleanup authorization |
| report handoff | none | I04不 prepare、deliver、finalize 或反馈 report | `ReportHandoffRecord` / report owner | report verdict、real run id、signoff、external delivery truth |
| no-write / gap fact | none | 只有 selected landing/policy 明确授权的 native fact 才可能写；telemetry不能触发 | matching canonical owner，当前未选择 | 用日志制造 violation/gap，或用 gap 代替 Governance failure |

`Accepted` 这个词在 future I04 中最多表示：一个 owner-approved、Observability-owned
local write set 和 exact stored-result/completion relation 已知提交。它绝不表示 Governance
审核通过、治理结论正确、证据真实、报告已交接、消息已 ack 或外部验收成功。Current world
连这个本地语义也不可达。

#### 14.1.2 Current zero-delivery proof

| 必要前置 | Current 状态 | 因此不可合法声称的观测 |
|---|---|---|
| finite Governance event -> I04 binding | missing | event received、matched event、delivery attempt、schema rejection |
| canonical `GovernanceAuditContextPayload` + registration | missing | payload decoded、payload invalid、body accepted、unsupported current schema |
| complete private input + one digest candidate set | missing | input assembled、digest prepared、reservation attempted |
| exact durable landing / transition / record mapping | missing | local change staged、native audit appended、accepted/no-op result |
| exact result + C-05 mapper | missing | receipt returned、ack/retry/dead-letter selected或执行 |

Composition root 必须在 callback exposure 之前发现这些缺口。若 current config 要求启用 I04，
runtime owner只能输出 finite assembly/activation error；若 current config 不要求该 slot，是否允许
disabled posture由后序配置 owner裁定。本节不预判“整个worker失败”或“slot静默禁用”，但两种
posture都不得暴露一个会在delivery时临时猜payload的callback，也不得用收到的消息来证明配置缺口。

### 14.2 Runtime telemetry, local durable truth and downstream projection

I04 使用严格三层分离。Current world 只可触达 Layer A 的 startup 子面；future 合法
delivery 才可能触达 Layer A delivery 子面和 Layer B。Layer C 永远由后续 owner 独立触发。

| 层 | 内容 | 合法触发 | 失败语义 | 禁止替代 |
|---|---|---|---|---|
| Layer A0: activation telemetry | config validation、runtime assembly、finite registration/activation result | binding catalog与runtime construction检查 | sink失败只影响process telemetry；不得递归回灌 | 不代表delivery、receipt或business rejection |
| Layer A1: delivery telemetry | structured log、counter/histogram、runtime span | future slot已激活且真实调用到达对应cut | sink失败不改变typed protocol/result/action；禁止handler重入 | 不替代reservation、result、native history或commit proof |
| Layer B: local durable truth | atomic reservation、selected local transition/record、stored result、completion、authorized outbox | owner-approved write set + known UoW commit | mandatory write失败whole-set rollback；unknown保持indeterminate | 不由log/metric/span补写、推断或重建 |
| Layer C: downstream projection/handoff | evidence linkage/index、retention/protection、report handoff、query/maintenance projection | 各自正式flow消费已提交body-free refs/relation | relation缺失或不唯一则fail closed | I04不得旁路创建，不消费runtime telemetry拼装material |

Future accepted telemetry顺序只能是：

```text
activated finite I04 slot
  -> validated header / registered binding / canonical payload
  -> complete input and one digest candidate set
  -> reservation outcome
  -> exact selected local relation and owner decision
  -> selected primary/native record/outbox + stored result + completion staged
  -> one known UoW commit
  -> accepted log / metric / consumer span end
  -> exact C-05 mapper and transport action outside local truth
```

以下逆向边全部禁止：

```text
runtime accepted signal -X-> commit certainty
span success             -X-> local transition or Governance acceptance
metric sample            -X-> retry / idempotency / retention / evidence
sink acknowledgement     -X-> outbox publication or report delivery
I04 receipt              -X-> evidence linkage / retention marker / report handoff
```

Replay、Conflict、InFlight、pre-admission rejection、known rollback、consistency defect、
commit unknown 和 post-commit action failure可有各自 finite Layer A1 signal，但不能使用
fresh accepted/native-audit措辞。Telemetry emitted或failed都不能改变§§11~§13的result、
reentry或C-05 eligibility。

### 14.3 Correlation and trace propagation

#### 14.3.1 Field authority and semantic separation

| 字段 / context | canonical 来源 | I04 允许用途 | 不得承担的语义 |
|---|---|---|---|
| current activation trace | runtime builder/host既有process-local tracing context | 关联一次真实assembly/registration检查 | inbound `trace_ref`、Governance event发生、actor或delivery proof |
| inbound `trace_ref` | future已验证shared envelope metadata | 进入既有 `ObservationOperationContext`；作为真实Consumer span的trusted parent/correlation metadata | actor、event identity、dedup、digest、source order、commit proof |
| local root span context | future envelope `trace_ref=None`时由telemetry facade process-locally建立 | 只连接本次runtime spans | 回填input、reservation、stored result、outbox、correlation durable truth |
| `CausationRef` | 仅canonical correlation input/object owner | owner已提供时lossless传播 | 从span parent、trace字符串、route、timestamp推导 |
| `CorrelationContextRef` | 已提交本地correlation owner relation | exact selected landing schema明确需要时只引用 | 因有trace而mint；证明Governance因果、evidence或commit |
| `source_event_ref` | future finite Governance binding映射后的validated header | secondary inbound identity、reservation/result relation | trace、dedup、broker offset、Governance object ref |
| `dedup_key` | trusted delivery metadata | logical idempotency scope | span id、event identity、attempt或digest |
| `actor_ref` | authenticated C-05/worker boundary | effective operation context与authorization scope | payload actor、producer、process identity、trace owner |

Current world没有合法 inbound envelope，所以不得为了“关联 activation failure”生成或保存
`source_event_ref`、`dedup_key`、`actor_ref`或假想 inbound `trace_ref`。Activation telemetry只可使用
host/runtime已有process context和finite slot metadata。

#### 14.3.2 Future parent-child cuts

Future I04只复用 Step 15 已有span family，不为本协议制造新的durable span object：

```text
trusted worker / inbound span (optional parent)
  -> observability.consumer
       -> observability.idempotency          (reserve / complete)
       -> observability.repository           (selected exact reads/writes only)
       -> observability.uow                  (Acquired writer only)
       -> observability.repository           (stored result / selected native landing)
       -> observability.consumer rehydrate   (Replay path as consumer phase, not a new span kind)
  -> worker C-05 action boundary             (outside I04 application truth)
```

`observability.consumer`只能在header与static slot匹配后开始。Missing finite binding或ownerless
payload在current world由assembly拒绝，不能建立这个span；future runtime中真正的per-delivery
unsupported/malformed分支才可结束为`invalid`。Repository/UoW span必须对应真实调用，不能为了
dashboard完整性创建零时长“skipped success”span。

| Span end class | 前置typed fact | 合法status语义 | 禁止映射 |
|---|---|---|---|
| `invalid` | future real delivery的header/schema/body-free validation失败 | pre-write invalid | current owner gap、Governance rejected |
| `rejected` | future typed policy/domain rejection且known no write | local protocol rejection | Governance conclusion/nonconformity truth |
| `duplicate_replayed` | exact stored result完整校验成功 | no new mutation | current lookup重建或新duplicate row |
| `accepted` | exact Layer B set known committed | local observation accepted | span exporter成功、ack成功或Governance accepted |
| `indeterminate` | commit/probe仍unknown | terminal certainty unavailable | accepted/rejected猜测或default Retry |
| `error/manual_intervention` | consistency defect / corrupt result / relation mismatch | local processing defect | raw exception text或source truth判断 |

### 14.4 Redaction and channel allowlist

#### 14.4.1 Current and future channel matrix

| material | activation log/span | future delivery log | metric label | future span attribute | I04 durable surface |
|---|---|---|---|---|---|
| finite `operation=ConsumeGovernanceAuditContext`, `operation_family=consumer` | allow | allow | allow | allow | owner schema已有字段时 |
| finite `assembly_stage`, `phase`, `result_kind`, `error_kind`, `recovery_class` | allow | allow | allow only Step15 finite label | allow | existing result/history field only |
| `producer_family=Governance` | static expected family only；不得暗示收到event | allow after real binding | allow | allow | envelope/result owner已有字段时 |
| supported schema version/discriminator | deny before canonical registration | allow after registered decode | finite version class only if canonical label exists；不得动态值 | restricted | canonical envelope/result only |
| `trace_ref` / local span id | process context only，不输出inbound ref | restricted safe field | deny | propagated context only | selected owner schema明确允许时 |
| actor/source/event/reference/result/outbox/gap/issue refs | deny by default | only row-specific approved safe ref | deny all refs | restricted at approved cut | only exact canonical owner relation |
| dedup/idempotency key、digest/candidates/profile | deny | deny | deny | deny | reservation owner内部only |
| body-free semantic digest / reference optional digest | deny | deny | deny | deny | selected canonical owner existing field only |
| duration / bounded count / changed-count | allow | allow | metric value；only finite bounded labels | allow | existing result count field only |
| raw Governance event/payload/decision/control/review/trace/audit/evidence/report body | deny | deny | deny | deny | deny |
| topic/partition/offset/route/endpoint/credential/config secret | deny | deny | deny | deny | deny |
| exception/SQL/provider text、stack、Debug/Display dump | deny | deny | deny | deny | deny |
| real run_id、evidence alias、verdict、signoff、external acceptance | deny | deny | deny | deny | deny |

`source_event_ref`能够作为future reservation/result的canonical relation，不代表它可进入日志或
span；“body-free”也不等于“可公开”。Metric label在所有情况下禁止任何ref、key、digest、
version instance、token、cursor和free text。

#### 14.4.2 Allowlist-before-serialization order

每个 I04 runtime signal必须遵守同一顺序：

1. 先从typed activation/result/error/context选择固定字段，不接收generic map。
2. 校验 signal cut真实可达；current activation failure不能选择delivery-only字段。
3. 对每个字段执行owner、visibility、body-free和channel allowlist检查。
4. 只序列化通过检查的有限值；禁止先序列化input/envelope/error再删字段。
5. 未列入白名单、owner不明或redaction失败时抑制字段或整条signal；若existing owner可用，
   仅增加process-local non-recursive suppression counter。
6. 禁止以hash、digest、base64、截断、掩码后Debug或“safe message”绕过forbidden-body规则。
7. Sink失败只更新已有sink-failure health path；不得调用own Command/Consumer/Job、创建gap、
   no-write violation、audit record、outbox或retry本次operation。

本顺序由既有 `S08-E-I04-REDACTION-PROPAGATION-01` 承接跨decoder、input、error/receipt、
telemetry、persistence与dead-letter传播；本节不为同一缺口重复创建telemetry mapper ID。

### 14.5 Structured log cuts

#### 14.5.1 Current activation-only logs

| 位置 | level | 允许字段 | 必须表达 | 严禁声称 |
|---|---|---|---|---|
| config/runtime validation reaches I04 slot | `debug` | `operation`, `operation_family=consumer`, `assembly_stage`, finite config/slot result | static slot正在被校验 | envelope received、producer contacted |
| payload owner / event binding prerequisite missing | `error` | `operation`, `assembly_stage`, finite `error_kind`, safe `issue_ref?` | activation prerequisite absent；由config/runtime owner报告 | unsupported delivery、payload invalid、Retry |
| worker catalog cannot expose complete enabled set | `error` | `assembly_stage`, finite registration/result/error kind | no partial callback surface | eight slots armed plus I04 failed，除非current registrar contract明确提供该事实 |
| current I04 remains unexposed | no per-delivery log | none | absence由startup结果解释 | fabricated received/rejected/dead-letter event |
| telemetry field/sink/recursion guard | no same-sink recursive log | fixed suppression/sink counter only | telemetry自身有限失败 | business operation failed |

Current activation日志不得带`producer_family`以暗示实际producer调用；若static catalog字段需要
标识expected family，只能使用固定catalog metadata，并明确它不是observed producer。不得记录任何
Governance event name，因为finite event set本身仍是upstream blocker。

#### 14.5.2 Future delivery logs

下表只有在future activation prerequisites全部关闭后才适用：

| 位置 | level | 允许字段 | 观测目的与硬约束 |
|---|---|---|---|
| static I04 slot selected | `debug` | `operation`, `operation_family=consumer`, `phase=entry`, `producer_family`, `trace_ref?` | 证明真实delivery进入matching slot；不记录envelope/event ref/payload |
| header or binding rejected | `warn` / `error` | `operation`, `phase=validate`, finite `error_kind`, `issue_ref?` | 区分header与registered finite binding failure；不trial decode其他event |
| schema/body-free validation rejected | `warn` | `operation`, `producer_family`, `phase=validate`, `error_kind`, `issue_ref?` | 只输出typed类别；不输出字段名/value/body/hash |
| complete input assembled | `debug` | `operation`, `phase=validate`, `result_kind=validated`, `trace_ref?` | 证明private input完整；不输出reference/digest/visibilitymaterial |
| digest candidates constructed | `debug` | `operation`, `phase=validate`, `result_kind=prepared` | 证明single canonicalization；不输出candidate/profile/key |
| reservation acquired | `debug` | `operation`, `phase=reserve`, `result_kind=acquired` | 仅表示writer资格候选，不表示local change或commit |
| reservation replay | `info` | `operation`, `phase=reserve`, `result_kind=replay`, approved `result_ref?` | 进入exact immutable rehydrate；不重跑writer |
| reservation conflict / in-flight | `warn` | `operation`, `phase=reserve`, finite `result_kind`, `recovery_class?`, `issue_ref?` | 不泄漏winner、logical/event key或digest |
| selected local relation/decision | `debug` / `warn` | `operation`, `phase=load` or `transition`, finite result/error/recovery | 只描述owner-selected finite decision；landing未闭合前不得实现此cut |
| selected local set staged | `debug` | `operation`, `phase=persist`, `result_kind=staged`, finite `resource_family` | 不命名ownerless H-family；不提前写accepted |
| stored result staged | `debug` | `operation`, `phase=persist`, `result_kind=stored`, approved `result_ref?` | 证明result-before-complete调用顺序；仍未证明commit |
| reservation completion staged | `debug` | `operation`, `phase=complete`, `result_kind=completed` | 只描述staged completion；commit前禁止accepted |
| known UoW commit | `info` | `operation`, `phase=commit`, `result_kind=accepted` or owner-approved no-op, bounded counts, `duration_ms` | 仅在whole set已知提交后；accepted只指local observation |
| known rollback / pre-commit failure | `warn` | `operation`, `phase=rollback`, `result_kind=rejected`, finite error/recovery | 明确无partial selected set/result/completion；不追加generic audit |
| commit/probe unknown | `error` | `operation`, `phase=commit`, `result_kind=indeterminate`, recovery, `issue_ref?` | 不输出accepted/rejected certainty，不选择default action |
| replay result validated | `info` | `operation`, `phase=rehydrate`, `result_kind=replayed`, approved `result_ref?`, `duration_ms` | original result only；不创建refs/history/outbox |
| completed result missing/corrupt | `error` | `operation`, `phase=rehydrate`, finite defect/recovery, `issue_ref?` | consistency defect；不打印bytes或current-truth rebuild |
| C-05 action execution | `debug` / `warn` | `operation`, `phase=ack`, finite action/result/error, approved `result_ref?` | transport truth在local commit之外；失败不重开writer |
| telemetry emission suppressed/failed | no same-sink recursive log | finite process-local counter | 原typed branch保持不变 |

### 14.6 Trace/span cut table and telemetry failure isolation

| Span cut | Reachability | Start | Required finite attributes | End | Explicitly absent |
|---|---|---|---|---|---|
| `observability.runtime.assembly` | current + future startup | runtime builder开始读取validated source | `assembly_stage` | complete runtime或typed assembly error | inbound refs、Governance event、delivery result |
| registration/activation child of host runtime span | only if current runtime owner has this cut | finite catalog totality/arm开始 | static slot/result class | exposed complete set或typed failure | payload/body、receipt/action |
| `observability.consumer` | future only | matching header/static slot通过，payload decode前 | `operation`, `producer_family` | typed receipt或pre-write error/indeterminate | current structural activation failure |
| `observability.idempotency` reserve | future complete input only | atomic reserve调用前 | `operation_family=consumer`, `phase=reserve` | Acquired/Replay/Conflict/InFlight/error | key、digest、event ref |
| `observability.repository` read | future only | exact owner-selected read前 | finite repository family / read class | typed result/error | raw row/provider details |
| `observability.uow` | future Acquired writer only | one UoW begin前 | `operation_family=consumer`, finite phase | commit/rollback/indeterminate | Replay/Conflict/InFlight path |
| `observability.repository` write | future owner-selected write only | exact stage/save/complete call前 | finite repository family / operation class | staged/typed error | skipped fake-success span |
| replay rehydrate phase in consumer span | future Replay only | exact stored-result pointer lookup前 | `phase=rehydrate` | validated replay或consistency defect | resolver/transition/UoW span |
| worker transport action cut | future valid mapper output only | C-05 registrar执行selected action前 | finite action/phase | transport result/error | local commit rollback或new result |

Telemetry backend retention、span export、sampling与flush均属于host/deployment runtime，不等价于
`RetentionMarker`，也不进入I04 stored result。Span exporter或metric sink失败不得：

1. 更改 Consumer typed result、public receipt或recovery class；
2. 把known commit降级为business failure，或把unknown升级为accepted；
3. 再次调用assembler/service/reservation/selected writer/C-05 mapper；
4. 创建audit/evidence/gap/no-write/outbox/report/retention durable fact；
5. 触发同sink nested log/span形成自观测递归。

### 14.7 Metric contracts and low-cardinality binding

本节只复用冻结 Step 15 已声明的 metric name 与有限 label vocabulary，不创建 I04-specific
metric backend、dashboard、alert、bucket、sampling 或 retention 配置。Current world 与 future
delivery 的打点面必须分开，否则 startup design gap 会被错误统计为业务流量。

| Metric | Current world | Future legal cut | Required labels | Forbidden claim |
|---|---|---|---|---|
| `observability_config_validation_total` | allow；只有真实config candidate validation | 同current | `validation_stage`,`result_kind` | I04 delivery被rejected |
| `observability_runtime_assembly_total` | allow；builder完成或typed error后 | 同current | `assembly_stage`,`result_kind`,`error_kind` | worker收到Governance event |
| `observability_inbound_event_total` | **deny**；没有合法receipt | receipt完整形成后一次 | `operation`,`producer_family`,`result_kind` | current slot gap、attempt count、commit without receipt |
| `observability_inbound_event_duration_ms` | **deny** | real envelope到typed receipt / eligible terminal surface | `operation`,`result_kind` | startup duration或commit unknown有receipt |
| `observability_inbound_schema_rejected_total` | **deny**；ownerless schema不是runtime rejection | future registered slot对真实delivery判定unsupported/malformed后 | `operation`,`producer_family`,`rejection_kind` | missing canonical owner被包装为unsupported delivery |
| `observability_idempotency_total` | **deny**；reserve不可达 | 每个真实reserve/complete/replay/conflict/in-flight判定 | `operation_family=consumer`,`result_kind` | no-reserve path、event identity或digest value |
| `observability_stored_replay_defect_total` | **deny** | exact replay pointer校验发现finite defect后 | `operation_family=consumer`,`defect_kind` | current lookup探测或body corruption detail |
| `observability_uow_total` | **deny** | real begin/commit/rollback返回后 | `operation_family=consumer`,`phase`,`result_kind` | zero-UoW branch、skipped success |
| `observability_uow_duration_ms` | **deny** | future one real UoW boundary | `operation_family=consumer`,`result_kind` | replay/conflict/in-flight duration当UoW |
| `observability_repository_operation_total` / `_duration_ms` | **deny** for I04 current delivery | future每次真实selected repository call | canonical finite repository family/class/result | guessed landing family或raw key/ref |
| `observability_concurrency_conflict_total` | **deny** | reserve或future primary guard返回typed conflict后 | finite `resource_family`,`conflict_kind` | winner identity/digest或Governance conflict |
| `observability_worker_delivery_total` | **deny**；无C-05 action | registrar完成真实selected action后 | `delivery_phase`,`result_kind` | local result accepted、broker exactly-once |
| `observability_runtime_telemetry_suppressed_total` | allow when existing process telemetry owner is active | allow | `signal_kind`,`reason_kind` | business rejection或durable redaction fact |
| `observability_runtime_telemetry_sink_failure_total` | allow when sink call actually fails | allow | `signal_kind`,`sink_result` | Consumer failed、commit failed或Retry required |

#### 14.7.1 I04 finite label mapping

| Label | Allowed I04 values / source | Forbidden source |
|---|---|---|
| `operation` | canonical finite `ConsumeGovernanceAuditContext` | event name、route、topic、payload discriminator string |
| `operation_family` | `consumer` or runtime family at startup metric | guessed adapter/producer family |
| `producer_family` | future validated static family `governance` | payload field、topic、endpoint、actor |
| `result_kind` | existing finite activation/protocol/idempotency/UoW/action result at the exact cut | error text、Governance state、presence of refs |
| `error_kind` / `rejection_kind` / `defect_kind` | typed finite mapper after exact classification | field name/value、provider/SQL exception、HTTP code body |
| `resource_family` | only selected current owner family after landing closure | `audit/evidence/reference/gap` chosen from old candidate list |
| `delivery_phase` | finite ack/dead-letter phase returned by exact mapper/registrar | broker topic、attempt number、retry delay |
| `reason_kind` | redaction / forbidden-field / recursion / sink-failure finite class | free-text reason、Governance conclusion |

任何 actor、source、event、reference、result、issue、gap、outbox、evidence、handoff、retention
等具体 ref，任何 trace、dedup/key、digest/profile、cursor/version/token，任何 endpoint/topic/route、
tenant、credential、动态event name或free text，都不得成为metric label。`unknown`只允许是finite
mapper的显式类别；不得把原始动态值放进label再称为unknown fallback。

#### 14.7.2 Metric semantic assertions

1. `accepted` 只在future exact Layer B commit已知成功且receipt已形成后计入；不由span status、
   sink ack或worker ack触发。
2. `duplicate_replayed` 只在原stored surface完整校验后计入；不代表新的local change/audit。
3. `conflict` / `in_flight` 是incoming admission outcome，不是Governance domain conflict。
4. `indeterminate` 不得同时计入accepted或rejected terminal bucket。
5. Current activation error不得增加任何 inbound/schema/idempotency/UoW/repository/action metric。
6. Telemetry sink failure counter只表示signal emission失败；不驱动retry、dead-letter或result mapping。

### 14.8 Future local durable landing and UoW audit boundary

#### 14.8.1 Current landing remains unselected

§10 已证明 HLD、Step 06 family定位与冻结 formal `03` 提供了 audit/evidence/reference/gap
多个候选，却没有唯一 primary、relation/version、transition、record、cursor、result refs 或
outbox mapping。因此 §14 不得为了“补全审计”选择 `AuditProjection`、`EvidenceLinkage`、
`ReferenceSnapshotState`、`GapState`、H3、H8、H10或任何 repository method。

| Question | Current conclusion | Telemetry consequence | Durable consequence |
|---|---|---|---|
| primary aggregate / relation是什么 | unresolved | 不得输出selected target/ref/family | no primary read/write |
| mutation还是durable no-op | unresolved | 不得输出accepted/no-op metric | no result/completion |
| mandatory native record是什么 | unresolved | 不得输出`record_kind`或audit-appended log | no H-family append |
| 是否分配cursor | unresolved | 不得输出cursor kind/count | no cursor allocation |
| 是否生成outbox | unresolved | 不得输出outbox count/ref | no snapshot/stage |
| stored result refs来自何处 | unresolved | 不得fabricate receipt/result ref | no stored result |

`S08-E-I04-DURABLE-LANDING-01` 是这些问题的唯一 affected owner。Telemetry契约不能
关闭它，generic audit row也不能成为临时landing。

#### 14.8.2 Future accepted UoW contract

Landing关闭后，future实现必须把一个accepted branch约束为下列target-neutral sequence：

```text
atomic reserve acquired
  -> exact selected primary relation/version read
  -> one owner decision: transition | create | explicit durable no-op | typed negative
  -> stage only the selected primary/followers
  -> append exactly the owner-mandated native record, or explicit no-record
  -> freeze only owner-authorized outbox snapshot, or explicit empty set
  -> stage exact StoredObservationResult
  -> mark reservation Completed
  -> commit one UoW once
  -> emit accepted/no-op runtime telemetry
```

| Branch | Primary/native record/outbox | Stored result/completion | Runtime audit wording | Forbidden fallback |
|---|---|---|---|---|
| current structural affected | none | none | activation error only | delivery rejected/audit event |
| future real mutation | selected exact set | same-UoW exact result + completion | accepted after known commit | generic H record、second audit transaction |
| future explicit durable no-op | none or owner-declared no-change follower set | owner-backed exact result + completion | no-op after known commit | treating current zero-write as no-op |
| future owner-backed durable negative | exact canonical negative fact only when owner exists | exact stored negative + completion | finite negative after known commit | generic rejection audit/gap/quarantine |
| pre-UoW invalid / unsupported | none | ephemeral/no-completion as applicable | invalid/rejected telemetry only | durable audit/result/outbox |
| Replay | none | read original only | replay wording | second native record/outbox |
| Conflict / InFlight | none | none for incoming request | conflict/in-flight wording | winner exposure or new key |
| known failure before commit | whole staged set rollback | none visible | rollback/failure | compensation audit transaction |
| commit/probe unknown | no speculative compensation | no terminal surface | indeterminate | accepted/rejected audit |
| post-commit C-05 failure | preserve original committed set | preserve original result | transport failure | reopen UoW/writer |

Mandatory native record failure, result save failure or completion stage failure is a Layer B failure and
must rollback the whole accepted set. Runtime telemetry failure is Layer A and must not rollback Layer B.
No code path may invert those semantics.

#### 14.8.3 Durable metadata and redaction ceiling

Future selected primary/record/result may store only fields already owned by their canonical schema and
produced by the same typed decision. The following rules apply regardless of selected landing:

1. `trace_ref` is optional correlation metadata only when the selected owner schema already has that field;
   it cannot prove actor/event/digest/commit/Governance truth.
2. `actor_ref` may appear only where the native owner requires an authenticated local actor; it never enters
   log/metric/span and is not copied from payload.
3. `source_event_ref` and source metadata may be retained only in the reservation/result/native relation
   explicitly defined by the landing; they do not create Governance history ownership.
4. Semantic digest may be stored only in an existing canonical field after
   `S08-E-I04-DIGEST-AUTHORITY-01` closes; request digest candidates remain idempotency-private.
5. Raw Governance body、trace/audit/evidence/report content、transport locator、provider error、real
   run id、evidence alias、verdict、signoff和external acceptance永不进入任何landing。

### 14.9 Protocol observability and audit coverage closure

#### 14.9.1 Public protocol surface coverage

| Surface | Current status | §14 coverage | Remaining affected |
|---|---|---|---|
| logical operation / static slot | known | activation-only log/metric/span边界已固定 | finite event binding仍open |
| shared envelope/header | target known, current delivery absent | future trace/source/event/dedup channel restrictions已固定 | binding/control field propagation |
| canonical payload | absent | current no-delivery/no-schema-rejection；future redaction gate已固定 | payload schema + redaction propagation |
| complete private input / digest | absent | no input/digest telemetry in current；future single-cut no-value exposure | control/digest authority/order |
| reservation / reentry | future contract only | four outcomes、exact replay、unknown telemetry已覆盖 | upstream prerequisites + UoW propagation |
| local primary/native audit | unselected | target-neutral one-UoW/no-generic-audit规则已固定 | durable landing |
| result / receipt | current absent | stored/ephemeral/replay/corrupt/unknown telemetry presence已覆盖 | outbox/quarantine/indeterminate surfaces |
| error / recovery | finite targets recorded | safe log/span/metric categories，no raw text | recovery owner |
| C-05 action | current absent | future action cut在known result/probe后，transport truth隔离 | action matrix + indeterminate carrier |
| downstream evidence/retention/handoff | non-owner | all branches zero automatic write | minimal capability isolation affected below |

#### 14.9.2 Field lineage to observation channels

| Field class | Runtime channel | Durable channel | Forbidden transformation |
|---|---|---|---|
| operation/family/phase | finite log/metric/span | existing owner enum/field only | route/topic/private handler name |
| actor | denied from telemetry | existing native audit field if required | payload/process/trace fallback |
| source/event/version | refs denied by default；finite family/version class only | reservation/result/selected relation only | topic/offset/time/local cursor cast |
| trace | propagated span context/restricted safe log | existing optional metadata only | causation/context/evidence/commit proof |
| dedup/request digest | no telemetry value | idempotency-private only | event identity/business digest |
| semantic digest/reference | no telemetry value | selected canonical owner field only | raw body hash、optional digest copy、ref prefix relation |
| visibility/gap | finite result class only | selected local policy/gap owner only | producer field、Governance state、telemetry-derived |
| result/native/outbox refs | approved safe log only at explicit row | exact stored/public relation after commit | current lookup、mint for logging、metric label |
| error/recovery | finite category only | owner-backed stored negative field only | exception text、generic audit reason |

#### 14.9.3 Branch totality and closure graph

```text
current config/runtime owner
  -> finite I04 activation check
  -> current: typed activation failure + Layer A0 telemetry only

future upstream payload/binding closure
  -> registered static I04 slot
  -> exact admission/redaction/input/digest
  -> atomic reservation
  -> selected local owner decision [durable landing affected]
  -> one UoW + exact stored result/completion
  -> finite runtime telemetry
  -> exact C-05 mapper [affected]

runtime telemetry
  -X-> reservation / selected local truth / result / worker action
  -X-> Governance truth / evidence / retention / report handoff

I04 stored result / native refs
  -X-> automatic evidence linkage / retention marker / report handoff
```

所有正向边都必须由current canonical owner提供typed value/proof；开放边不能由telemetry、旧文档、
repository capability或runtime观察补造。本节没有产生可执行slot或实现证据。

#### 14.9.4 Coverage affected register

| Affected / blocker | 对 §14 coverage 的影响 | Required closure | Current state |
|---|---|---|---|
| `S08-E-I04-PAYLOAD-SCHEMA-01` | current没有delivery payload/log/metric/span schema cut | upstream canonical declaration、wire/encoder/registration | `open_upstream_internal` |
| `S08-E-I04-PRODUCER-EVENT-BINDING-01` | current不能声称event received、source/event mapping或schema rejection | finite event set + exact adapter/header mapping | `open_upstream_internal` |
| `S08-E-I04-REFERENCE-AUTHORITY-01` | local ref/native metadata无法从producer安全形成 | minimal upstream refs + local authorized factory/relation | `open_internal_affected` |
| `S08-E-I04-CONTROL-FIELD-SOURCE-01` | complete input/actor/context/digest cut不可达 | exact private fields/constructor/accessors | `open_internal_affected` |
| `S08-E-I04-DIGEST-AUTHORITY-01` | semantic digest不能进入durable metadata或result | one owner/profile/material/conflict rule | `open_internal_affected` |
| `S08-E-I04-VISIBILITY-AUTHORITY-01` | telemetry/result不能从producer或default得出visibility/gap | local policy/gap mapper | `open_internal_affected` |
| `S08-E-I04-DIGEST-ORDER-01` | digest prepared/reserve/replay cuts尚无共同candidate proof | Step06/07/09 single candidate propagation | `open_internal_affected` |
| `S08-E-I04-REDACTION-PROPAGATION-01` | channel allowlist与no-body ceiling尚未有exact mapper/scan/test proof | single-source mapper + Step09/15/16 propagation | `open_internal_affected` |
| `S08-E-I04-DURABLE-LANDING-01` | accepted/native audit/resource labels/result refs均不能具名 | exact primary/relation/record/UoW/result/outbox mapping | `open_internal_affected` |
| `S08-E-I04-ACTION-MATRIX-01` | worker action log/metric/span只能作为future cut，current不可达 | named pure/total mapper + once-only call | `open_internal_affected` |
| `S08-E-I04-DOWNSTREAM-WRITE-CAPABILITY-01` | textual zero-write已固定，但wide dependency bundle仍暴露evidence/retention/handoff writers | minimal I04 dependency view/delegate + Step09 call audit + Step16 forbidden-call proof | `open_internal_affected` |
| shared recovery/outbox/quarantine/indeterminate/UoW items | typed recovery/result/action/atomicity仍有shared carrier和传播缺口 | existing shared closure owners | unchanged/open |
| `03-RPR-S09-PER-FLOW` | §14只有protocol handoff，不是函数级埋点实现 | one named I04 flow逐调用传播 | `open` |

本节新增 `S08-E-I04-DOWNSTREAM-WRITE-CAPABILITY-01=open_internal_affected`，因为 current
`ObservationInboundEventDependencies` 同时暴露 `AuditEvidenceRepository`、
`ReportHandoffRepository` 与 `RetentionGuardRepository`。仅靠文字规定 I04 zero-write，不能在
实现边界证明该consumer没有H3/H4/H5或同类下游写能力。关闭条件是：Step06/07提供I04 concrete
delegate或private minimal dependency view，只保留reservation、selected landing所需的exact local
repository、stored result/UoW及明确授权outbox；Step09逐call审计无evidence/retention/handoff写口；
Step16规划compile-time dependency cut和forbidden-call scan。本节不复制repository trait，也不把
这些downstream repository纳入I04 UoW。

No telemetry-specific affected ID is added. Exact field/channel propagation is already owned by
`S08-E-I04-REDACTION-PROPAGATION-01`; metric/span names are existing frozen Step15 vocabulary, not a
new canonical facade or business port.

### 14.10 Evidence linkage, retention marker and report handoff non-owner boundary

#### 14.10.1 Permission matrix

| Downstream truth | Canonical owner | Current I04 permission | Future I04 direct permission | Legal later handoff | Forbidden shortcut |
|---|---|---|---|---|---|
| evidence linkage / evidence index input | evidence/audit owner via formal evidence flow | none | none | committed body-free selected local refs may become an input to the separate owner | receipt/native record直接变linkage、mint alias、authenticity verdict |
| retention marker / active protection | retention/guard owner via formal retention flow | none | none | separate policy/flow may evaluate committed local refs | schema/visibility/result/telemetry自动延长保留 |
| report handoff / external audit package | report/handoff owner via formal prepare/delivery flow | none | none | separate flow may consume committed projection/linkage/gap material | I04 prepare/deliver/finalize、real run id/signoff |
| gap / no-write violation | matching gap/no-write owner | none | only if selected landing explicitly is that canonical operation, which current design has not established | separate formal flow with owner proof | dependency/telemetry failure自动创建gap/violation |

#### 14.10.2 Branch-level zero-write totality

| I04 branch | Evidence linkage | Retention/protection | Report handoff | Other downstream write |
|---|---|---|---|---|
| current activation/design gap | none | none | none | none |
| future invalid/unsupported/forbidden payload | none | none | none | no generic rejection audit |
| Replay | none | none | none | no second native history/outbox |
| Conflict / InFlight | none | none | none | no winner-derived write |
| local relation/policy rejection | none unless that exact owner defines a committed negative in selected landing | none | none | no hidden second UoW |
| future accepted mutation/no-op | none directly | none directly | none directly | only selected local landing/result/outbox set |
| known rollback | none | none | none | whole staged set absent |
| commit/probe unknown | none | none | none | no compensation/cleanup marker |
| post-commit C-05 failure | none | none | none | original local result preserved only |
| telemetry sink/redaction failure | none | none | none | process-local suppression/health only |

I04 public receipt、native record ref、trace、metric sample、dashboard screenshot、telemetry sink
receipt或worker ack都不是 evidence。Telemetry backend retention不受本仓 `RetentionMarker` 自动控制，
本仓marker也不能配置backend retention。Report consumer或GRC反馈必须通过其正式Consumer/flow更新
local handoff/delivery state，不能直接反写Governance truth或I04 selected primary。

### 14.11 Full result-branch closure matrix

#### 14.11.1 Reachability classes and precedence

判定顺序固定为：

```text
activation prerequisites
  -> real delivery and header/binding/schema/body-free admission
  -> complete input/digest
  -> reservation result
  -> selected local relation/decision
  -> staged write/result/completion
  -> commit certainty / exact probe
  -> stored or ephemeral public surface
  -> exact C-05 mapper
  -> transport action result
  -> telemetry mapping from the already determined fact
```

Telemetry永远是最后的映射消费者，不能改变前序precedence。

#### 14.11.2 Total branch matrix

| Branch | Current/Future reachability | Public/result surface | Local durable truth | Runtime telemetry | C-05 / downstream boundary |
|---|---|---|---|---|---|
| slot prerequisite missing | current direct | no delivery receipt/completion | none | activation/config finite error only | no C-05；no evidence/retention/handoff |
| future header/binding invalid | future only | typed ephemeral/no-completion per shared carrier | none | invalid/rejected delivery telemetry | action only after exact mapper; no downstream write |
| future schema unsupported/malformed/body-free violation | future only | typed ephemeral surface if legal | none | schema/body-free finite telemetry | no raw dead-letter body/marker mint |
| complete input/digest failure | future only | typed safe error/no-completion | none | validate failure | no reserve/UoW/action default |
| `Replay` valid | future only | exact original Stored + `Replayed` overlay | no new write | replay log/metric/span | mapper may Acknowledge only after validation; zero downstream write |
| `Conflict` | future only | safe ephemeral conflict if owner permits | none for incoming request | conflict telemetry | no winner surface/default action/downstream write |
| `InFlight` | future only | delayed/no-completion per policy | none | in-flight telemetry | Retry only with exact policy; no recursive handler retry |
| selected relation missing/ambiguous/corrupt | future only | typed error/no-completion | none | finite consistency/dependency telemetry | no first-row/default landing/downstream write |
| owner-approved durable no-op | future conditional | exact Stored NoOp after known commit | owner-backed no-change result/completion; native record only if owner mandates | no-op commit telemetry | exact mapper; zero automatic evidence/retention/handoff |
| owner-approved accepted mutation | future conditional | exact Stored Accepted after known commit | selected primary/native record/outbox/result/completion one UoW | accepted only after commit | exact mapper; downstream only via later formal flow |
| owner-backed durable negative | future conditional | exact Stored negative after known commit | selected canonical negative only | finite committed-negative telemetry | exact mapper; no generic audit/marker |
| known pre-commit failure/rollback | future only | no fresh stored success | whole staged set absent | rollback/error telemetry | known-no-write policy only; no downstream write |
| commit known but result relation corrupt on read | future only | no valid receipt | committed relation treated consistency defect | defect telemetry only | no C-05 until repaired/probed by owner; no reconstruction |
| commit/probe unknown | future only | no terminal receipt under current carrier | unknown; no compensation | indeterminate only | no terminal action/downstream write |
| known commit + C-05 action failure | future only | original stored result remains | original set unchanged | transport action failure telemetry | later redelivery exact replay only |
| telemetry emission rejected/failed | current or future | original activation/result surface unchanged | unchanged | suppression/health counter only | no retry/reentry/downstream write |

#### 14.11.3 Deterministic implementation assertions

1. Current tests/fixtures不得调用I04 handler来模拟owner gap；activation validation必须在callback
   exposure前失败或采用配置owner明确的disabled posture。
2. Current world中所有 delivery、schema rejection、reservation、UoW、accepted、receipt和C-05
   metric/log/span计数均应为零；本节不声称已运行该验证。
3. Future每个runtime signal必须从typed branch映射，且只能读取该branch白名单字段。
4. `accepted` / durable no-op signal必须晚于known commit；`completed` stage log不等于accepted。
5. Replay只消费exact stored result；不调用selected landing resolver/transition/UoW，也不创建第二audit。
6. Commit unknown、missing/corrupt completed result均无合法terminal C-05 action，不得用telemetry结果补certainty。
7. Evidence、retention和handoff在所有结果行保持zero direct write；wide dependency bundle须由
   `S08-E-I04-DOWNSTREAM-WRITE-CAPABILITY-01`收窄。
8. Telemetry sink failure不得影响result/action；C-05 action failure不得影响known local commit。
9. No branch may name H3/H8/H10/cursor/source ordering before durable landing closes.
10. Logs/metrics/spans/tests不得包含 raw/hash/truncated/base64/debug Governance material、real run id、
    evidence alias、verdict、signoff或external acceptance。

### 14.12 §14 stop review

| Check | Conclusion |
|---|---|
| authorized scope | `pass_with_affected_open`；只进入I04 §14，未读取/写入§15以后、I05~I09、S08-F/G、Step09、formal或实现代码 |
| current observability reachability | 只有真实config/runtime assembly/activation telemetry可达；no delivery/receipt/reservation/UoW/accepted/audit/action signal，未伪造runtime event |
| truth layering | Layer A0/A1、Layer B和Layer C严格分离；telemetry不证明commit，不创建第二audit truth，不驱动result/action/downstream write |
| trace/correlation | inbound `trace_ref`只在future真实envelope中传播；current activation只用process context；trace不承担actor/event/digest/order/commit/Governance truth |
| redaction | 复用§9 allowlist-first ceiling；metric label禁止任何ref/key/digest/body；hash/truncate/base64/debug无逃逸 |
| logs/spans/metrics | current与future切口分开，复用Step15 finite vocabulary；没有预造I04 telemetry facade、dashboard、alert、bucket或测试结果 |
| durable audit | current zero-write；future只允许selected canonical landing的native record或explicit no-record，未选择snapshot/H3/H8/H10/cursor/repository |
| branch closure | activation、invalid、Replay、Conflict、InFlight、relation error、no-op、accepted、durable negative、rollback、corrupt、unknown、post-commit action和telemetry failure全部有限 |
| downstream non-owner | evidence linkage、retention/protection、report handoff全部结果分支zero direct write；receipt/telemetry/ack不是evidence或handoff proof |
| new affected | 新增`S08-E-I04-DOWNSTREAM-WRITE-CAPABILITY-01=open_internal_affected`，承接wide inbound dependency bundle对H3/H4/H5等写能力的结构性暴露；无telemetry重复ID |
| affected/blocker | I04专属affected现为2 upstream + 9 local = 11项；没有新增上游blocker、没有关闭项；shared recovery/outbox/quarantine/indeterminate/UoW保持开放 |
| current protocol count | 保持`33/60 defined_with_affected_open`；Query `14/14`；Consumer `3/9`；`0/60`无条件complete；I04为`in_progress_S01-S14` |
| formal/implementation/evidence | formal`03` frozen；代码、测试、compile/runtime evidence、commit、run_id、evidence alias与签署均`not_run_not_claimed` |
| next action | 立即停审；用户确认后只进入I04 §15，先读取I03 §15 affected-register粒度、I04 §§1~§14全部affected及shared register；不得进入§16或后续批次 |
| current commit | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S14_recorded_with_affected_open_waiting_user_before_I04_S15
```

未经用户明确确认，不得进入I04 §15；不得读取或写入I04 §16以后、I05~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

## 15. Affected register and closure dependency order

### 15.1 登记与关闭规则

1. `open_upstream_internal` 表示 canonical owner 必须由 L1-governance 或明确的跨项目
   contracts owner 提供。L4-observability 只能声明 use-site、fail-closed posture 与兼容要求，
   不能复制 payload、event 或 encoder owner。
2. `open_internal_affected` 表示责任位于本项目既有 Step 06/07/08/09/16 边界，但 exact
   field、signature、relation、mapper、UoW 或 capability slice 尚未完整传播。增加一个类型名、
   trait method 或说明文字不构成关闭。
3. 每项专属 affected 只有在 canonical owner、I04 全部 use-site、absence/error 行为、
   durable/telemetry 出口及后续静态验证切口均能回指时才可关闭。若依赖上游项，必须先取得
   上游 owner 产物，再复审本地映射；不得以“计划补齐”或 fixture shape 标记 resolved。
4. Shared/cross-protocol affected 只能由其共享 owner 关闭。I04 只登记消费约束与禁止项，
   不能因本协议矩阵完整就改变共享项状态。
5. 各 ID 保持单一问题域。后续若发现无法由现有 ID 承接的独立 owner/schema/signature
   缺口，必须新增 ID 并说明不重叠关系；不得把新责任静默塞入某一旧行。
6. 本节不激活 I04 slot，不增加协议完成计数，也不声称代码、测试、compile/runtime evidence、
   commit、run id、evidence alias 或签署存在。Current delivery、reservation、writer、result 与
   C-05 action 仍不可达。

### 15.2 I04 protocol-specific affected

| ID | status | affected question | closure required | forbidden shortcut |
|---|---|---|---|---|
| `S08-E-I04-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | `GovernanceAuditContextPayload`只有Observability use-site；L1-governance没有唯一声明、字段authority/optionality、wire grammar、encoder或schema/discriminator registration | 上游owner发布唯一body-free payload，固定有限字段及类型/顺序、presence、unknown-field/version兼容、factory/encoder与注册项；I04只消费该声明并对未注册版本fail closed | 从Step06三个候选字段反推DTO、在本仓声明同名alias、接受generic map/结构相似body或由fixture定义schema |
| `S08-E-I04-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | 十三个Governance outbound event与I04之间没有有限positive set，也没有逐event payload/header/source identity转换契约 | 上游明确有限event set或正式拆分I04；逐event固定payload adapter、consumer/schema registration、source/event/version/dedup/occurred-at/trusted actor/trace映射、重放稳定性及unsupported行为 | 全订阅十三event、任选一个、按名字/topic/字段并集试探、让Observability制造aggregate event或把outbound envelope直接cast成shared header |
| `S08-E-I04-REFERENCE-AUTHORITY-01` | `open_internal_affected` | 完整`GovernanceArtifactEvidenceReference`含Observability本地identity、snapshot state ref、state和gap/visibility reason，producer与I/O-free assembler均无权构造 | 在payload/binding闭合后，Step06定义最小upstream body-free selector/observation与`ReferenceSubjectRef`映射；Step07提供bounded sole-row relation或授权first-create factory、ID/uniqueness authority、missing/duplicate/mismatch行为及fake/controlled/durable parity | 直接反序列化完整local reference、信任producer state/reason、ref-prefix/digest cast、first-row-wins、临时mint或从Governance current truth补齐 |
| `S08-E-I04-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | 六个shared control fields只有family-level target；I04完整operation fields、concrete struct、atomic constructor与唯一consuming decomposition尚不可命名 | 等payload/binding与digest material确定后，Step06/07一次性给出private complete input、`from_assembled`、全部cross-field validation、matching assembler调用和service-only `into_parts`；六字段与operation fields必须来自同一次validated assembly | 发布control-only input、optional field bag、generic payload、entry/service重构context/digest/header、setter/default或第二business carrier |
| `S08-E-I04-DIGEST-AUTHORITY-01` | `open_internal_affected` | I04 semantic `DigestSummary`由upstream提供还是本地canonicalizer生成未裁定；purpose/profile/material及与reference optional digest的absence/equal/conflict关系缺失 | 选择唯一semantic digest owner，固定body-free material、profile/version、编码与字段顺序、required/optional规则、single-computation路径和incoming/reference冲突矩阵；与request/result integrity digest保持typed分离 | hash raw payload/event bytes/debug/string、复制request digest或reference optional digest、空digest、双owner择优或按transport/time生成 |
| `S08-E-I04-VISIBILITY-AUTHORITY-01` | `open_internal_affected` | `VisibilitySurface`是本地response disclosure surface，却被历史input row当作producer field；local policy/gap/degraded source与precedence未闭合 | Step06/07移除producer-owned local surface；若上游确需visibility observation，使用独立upstream type，并由本地policy decision、persisted gap/degraded source与finite mapper收窄为public surface | producer提交`VisibilitySurface`、默认Visible/Restricted、absence-as-visible、按Governance state/event名或telemetry推导authorization |
| `S08-E-I04-DIGEST-ORDER-01` | `open_internal_affected` | §8固定公共request frame、presence规则与排除集，但payload segment仍依赖上游schema，且assembler/reservation/replay/probe未共同消费一次生成的candidate set | payload确定后冻结完整`inbound_consumer_request`字段顺序；Step06 canonicalizer只生成一次opaque candidates，Step07/09按值传播到context、atomic reserve、retained-profile compare、replay与exact probe | 沿用旧三字段顺序、hash raw envelope、各层重算、只保留winner digest，或把dedup/trace/time/topic/local effect加入material |
| `S08-E-I04-REDACTION-PROPAGATION-01` | `open_internal_affected` | §9已定义allowlist-first ceiling，但decoder、canonicalizer、input、error/receipt、telemetry、persistence、outbox/dead-letter尚无同源传播证明 | 建立一个owner-backed positive allowlist/exclusion source并传播所有I04入口与出口；Step09逐调用保持body-free，Step16规划field/channel矩阵、forbidden-field scan与negative fixture cut，不在本节声称已运行 | blacklist-only、raw/hash/truncated/base64/debug body、provider/transport text、real run id/evidence alias，或让log/dead-letter走第二serializer |
| `S08-E-I04-DURABLE-LANDING-01` | `open_internal_affected` | HLD、Step06与历史formal材料给出audit/evidence/reference/gap多候选，尚无唯一primary、relation/version/transition、record/cursor、result/outbox映射 | 在reference/visibility authority闭合后，唯一指定operation primary与repository method、pre-state/expected version、finite decision/transition或durable no-op、native H-family或explicit no-record、commit class/cursor、stored result refs与authorized outbox；reservation至completion保持one UoW并定义adapter parity | 按repository capability任选EvidenceLinkage/AuditProjection/ReferenceSnapshotState/GapState、H3/H8/H10或cursor，record-first、split commit、generic audit或把zero-write当durable NoOp |
| `S08-E-I04-ACTION-MATRIX-01` | `open_internal_affected` | §12~§14固定了eligibility/prohibition和全branch target，但没有I04具名pure、total、no-wildcard C-05 mapper | 在shared result/recovery/indeterminate carriers稳定后，mapper输入覆盖activation、commit certainty、Stored/Ephemeral、inner outcome/access、refs/error presence、recovery class与exact policy；Step09在receipt/probe后single call，Step16规划逐行/no-wildcard验证 | generic Consumer policy、default arm、error string/outcome-only映射、receipt/probe前选action、registrar二次分类或unknown默认Retry/Acknowledge/DeadLetter |
| `S08-E-I04-DOWNSTREAM-WRITE-CAPABILITY-01` | `open_internal_affected` | shared `ObservationInboundEventDependencies`仍物理暴露evidence、retention和handoff writer，§14文字zero-write不能证明I04无调用能力 | durable landing确定后，Step06/07提供I04 private minimal dependency view/delegate，只暴露reservation、selected landing、stored result/UoW及明确授权outbox；Step09逐call审计，Step16规划compile-time dependency cut和forbidden-call scan | 保留wide bundle仅靠review约束、复制repository trait、注入generic downstream/audit writer，或把H3/H4/H5及同类writer纳入I04 UoW |

以上十一项是 I04 的完整专属集合：两项为 `open_upstream_internal`，九项为
`open_internal_affected`。本节没有发现需要新增 ID 的独立 owner/schema/signature 缺口，
也没有任何项具备关闭所需的上游声明、本地传播和后续验证回指。

### 15.3 Closure dependency order

| order | prerequisite set | unlocks | still does not close |
|---:|---|---|---|
| 1 | upstream payload schema + finite producer-event binding | exact typed decode、shared header mapping、operation payload material与actual accepted event set可成立 | 本地完整input、semantic/request digest、reference或任何writer |
| 2 | control-field propagation + semantic digest authority + request digest order + redaction propagation | complete body-free input、single candidate set、admission/error/telemetry/persistence共同ceiling可成立 | local reference relation、visibility decision、durable landing与stored success |
| 3 | reference authority + visibility authority + unique durable landing | exact local relation/decision、primary guard、native record或no-record、result/outbox来源及one-UoW target可回指 | dependency shape隔离、shared completion/recovery或transport action |
| 4 | I04 minimal downstream capability view | zero evidence/retention/handoff write可由type boundary与后续call audit承接 | shared stored-result surface、commit-unknown completion或C-05 mapper |
| 5 | shared outbox/quarantine/result-access/recovery/indeterminate carriers + I04 exact action mapper | known result、replay、known failure与unknown completion边界可逐行映射 | Step09函数级flow、Step16静态验证或I04最终defined状态 |

该顺序是依赖图，不是批量关闭授权。每一层都必须先修改其 canonical owner 产物，
再回到 I04 复核所有 use-site；前层完成不会自动关闭后层，§15本身也不能替代任何 owner patch。

### 15.4 Shared and cross-protocol affected consumed by I04

| ID | current status | I04 dependency | closure owner / required handoff | I04 forbidden claim |
|---|---|---|---|---|
| `S08-CONSUMER-OUTBOX-SURFACE-01` | `open_internal_affected` | 若selected landing授权outbox，fresh/replay stored receipt必须无损取得同一UoW的exact `outbox_refs` | Step06 shared application/stored-result owner补validated field/accessor并传播全部Consumer；I04只消费该surface | 查询current outbox、按event kind重建、默认empty掩盖缺失或因I04表格完整称shared项已关闭 |
| `S08-CONSUMER-QUARANTINE-REF-01` | `open_internal_affected` | Step06 shared material仍引用无canonical owner的`QuarantineRef`；I04 public receipt与error branch不得暴露或新建它 | Shared owner删除悬空字段或回指已有body-free marker owner，并审计全部Consumer use-site | I04创建wrapper/mint规则、泄露raw quarantine material或仅凭error/recovery class声称Quarantined |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | `open_internal_affected` | commit/probe仍unknown时没有合法receipt或terminal C-05 completion shape | Step06/07 shared handler/completion owner提供typed no-completion carrier或收紧return contract；各Consumer mapper随后复核 | 猜测committed/not committed、伪造ephemeral receipt，或默认Retry/Acknowledge/DeadLetter |
| `S08-RECOVERY-CLASS-OWNER-01` | `open_internal_affected` | I04 exact action mapper需要唯一finite recovery class及`ApplicationError` total mapping | 后序Step12重审唯一enum owner、八类finite posture、public `retryable`派生和no-wildcard验证；I04只消费owner结果 | 在I04复制enum、由error text/severity推导、让recovery class证明commit或直接等同C-05 action |
| `S08-SOURCE-EVENT-REF-OWNER-01` | `resolved_in_S08-B_step06_affected_open` | I04 shared header、secondary identity、reservation与receipt都消费唯一typed `SourceEventRef` | Step06历史use-site回指S08-B contracts owner并删除重复/模糊声明；I04保持原类型无损传播 | 把I04字段当新owner、本仓mint上游event identity，或与dedup/trace/source/local event/locator互换 |
| `S08-RESULT-ACCESS-LAYER-01` | `resolved_in_S08-B_step06_affected_open` | I04 Replay只增加invocation-level `Replayed` overlay，inner stored outcome/refs/bytes保持不变 | Step06历史duplicate/disposition表述继续回指S08-B唯一access owner | 新建`Duplicate` outcome、改写inner receipt或把replay当fresh commit/native audit |
| `R06-F-AFFECT-UOW-01` | `step07_surface_closed_downstream_open` | atomic reservation、selected primary guard、result-before-complete、one commit与unknown probe必须跨Step一致 | Step09/11/13/15/16逐处传播并执行cross-step audit；I04 §10~§15只提供约束回指 | 因本节给出顺序就宣称UoW全局关闭，或允许record-first、split commit、partial visibility/compensation marker |
| `03-RPR-S09-PER-FLOW` | `open` | 当前只有唯一`ConsumeGovernanceAuditContextFlow` handoff；尚无函数级call/order/error/transaction/action产物 | Step09在用户确认后建立该具名flow并逐调用承接I04全部closed/open边界 | 在Step08提前展开完整flow、套generic Consumer模板或把protocol handoff算作Step09完成 |

`R06.6-F2-H13-UPSTREAM=open_controlled` 仍是项目级 blocker，但它约束 scope-only replay
record，不是 I04 的 direct dependency。本节不复制该 blocker，也不把它计入十一项专属或
八项shared/cross-protocol affected。

### 15.5 §15 stop review

| 检查项 | 结论 |
|---|---|
| 用户授权范围 | pass；本批只进入I04 §15，读取I03 §15粒度、I04 §§1~§14 affected与shared register；未读取/写入§16以后、I05~I09、S08-F/G、Step09、formal或实现代码 |
| protocol-specific register | `pass_with_affected_open`；11/11逐项登记status、question、closure required与forbidden shortcut，2项upstream、9项internal |
| register completeness | pass at design-record level；§1~§14出现的I04 owner/schema/signature/capability缺口均可回指现有ID，没有隐藏项或合并项 |
| dependency order | pass；五层顺序保持upstream schema/binding先于input/digest/redaction，再到reference/visibility/landing、capability与shared result/recovery/action |
| shared/cross-protocol separation | pass；8项保持原owner与状态，I04未越权关闭；project-level H13 blocker保持非direct dependency |
| affected closure | none；本节没有canonical owner patch、上游交付或验证证据，11项专属与8项shared/cross-protocol均保持既有状态 |
| upstream blocker | no new blocker；`S08-E-I04-PAYLOAD-SCHEMA-01`与`S08-E-I04-PRODUCER-EVENT-BINDING-01`继续`open_upstream_internal` |
| truth / non-owner boundary | pass；关闭图不授权I04拥有或反写Governance truth、evidence linkage、retention/protection、report handoff、verdict、signoff或external acceptance |
| current protocol count | 保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer `3/9`、`0/60`无条件complete；I04为`in_progress_S01-S15`，仍不计入defined |
| formal/implementation/test/evidence | formal`03` frozen；代码、测试、compile/runtime evidence、commit、run id、evidence alias与签署均`not_run_not_claimed` |
| next action | 立即停审；用户确认后只进入I04 §16 static closure checklist，先读取I03 §16 checklist粒度、I04 §§1~§15与current Step08 SOP问题覆盖；不得进入§17或后续批次 |
| current commit | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S15_recorded_with_affected_open_waiting_user_before_I04_S16
```

未经用户明确确认，不得进入I04 §16；不得读取或写入I04 §17以后、I05~I09、S08-F/G、
Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

## 16. I04 static closure checklist

本节只复核 §1~§15 已形成的 I04 协议记录是否自洽、可追溯且不存在未登记缺口，
不新增 schema、object、port、record、mapper、action 或 flow。检查通过只表示目标契约、
fail-closed 行为和 affected owner 在设计记录层可定位；它不表示上游 owner 已交付、
affected 已关闭、I04 slot 可激活、Step 09 flow 已完成或实现与测试已经存在。

### 16.1 结论词与判定规则

| result | 严格含义 | 不得解释为 |
|---|---|---|
| `pass` | 当前 owner、有限关系或禁止边界在已读取设计真相源中可直接回指 | 代码或runtime行为已验证 |
| `pass_at_design_record_level` | I04的有限目标、分支、precedence和引用已闭合，后续具名Step仍未展开 | 后续flow、repository、配置、adapter或测试已完成 |
| `pass_with_affected_open` | I04已给出唯一目标与fail-closed行为，但canonical owner/signature/carrier/capability仍由§15 affected承接 | affected已缓解、slot可激活或实现者可以自行补齐 |
| `deferred_to_named_step` | 当前协议已给出唯一handoff，函数级展开归既定后续Step | 可以跳过handoff、创建local helper或复用generic模板 |
| `not_applicable_by_family` | Step08问题只适用于Query等其他协议族，且I04已明确相邻Consumer责任 | 可以省略Consumer对应surface |
| `not_run_not_claimed` | 仅登记未来验证义务，没有代码、test、scan、runtime evidence或验收事实 | pass、failed或已有evidence |

任何带 `affected_open` 的检查都不能在 §17 改写成无条件 complete。检查项数量、
表格覆盖和设计记录一致性不能替代 §15 逐项要求的 canonical owner closure；planned
compile-time cut、forbidden-call scan、negative fixture 或 no-wildcard test 也不得写成已运行。

### 16.2 Protocol surface, authority and schema checklist

| check | result | evidence boundary |
|---|---|---|
| 只定义一个Inbound Consumer、一个exact public/internal operation、`0x0304` discriminator和一个required Governance producer family | `pass_at_design_record_level` | §§3, 4.2；不按topic/event/handler建立别名 |
| authenticated producer binding、worker callback、matching assembler、application service与transport completion方向唯一 | `pass_at_design_record_level` | §§4.2, 5.1~5.3 |
| transport类别是typed asynchronous delivery/completion；topic、credential、subscription与locator仍归entry/config owner | `pass_at_design_record_level` | §§3问题3~4, 4.2, 5.1 |
| current activation prerequisites明确不满足，composition root不得arm I04 slot或用runtime rejection模拟设计缺口 | `pass_with_affected_open` | §§4.3, 5.1, 12.1, 14.1；payload/binding affected |
| shared envelope/header与I04 typed payload分层，payload不得复制actor/event/source/dedup/time/trace header authority | `pass_with_affected_open` | §§6.1~6.5, 15.2 |
| `GovernanceAuditContextPayload` canonical declaration、field schema、encoder和registration缺口未被Observability use-site冒充关闭 | `pass_with_affected_open` | §§1.2, 6.2~6.4, 15.2；`S08-E-I04-PAYLOAD-SCHEMA-01` |
| 十三个Governance outbound event没有被全订阅、任选、合并或按字段相似度映射；current accepted event set为空 | `pass_with_affected_open` | §§2.2, 4.3, 6.3~6.4, 15.2；`S08-E-I04-PRODUCER-EVENT-BINDING-01` |
| consumer、producer、source/event、schema/version和body-free gate先于payload decode、digest、reservation及local lookup | `pass_at_design_record_level` | §§5.2, 6.1, 7.5, 9.1~9.3 |
| exact assembler/service只消费typed delivery与concrete input目标，不暴露raw body、generic map、transport action或entry-owned repository | `pass_at_design_record_level` | §§5.2~5.4, 7.1, 7.4 |
| 六个control fields有target authority与cross-field invariant，但control-only input被禁止且完整constructor仍不可发布 | `pass_with_affected_open` | §§7.1~7.5, 15.2；`S08-E-I04-CONTROL-FIELD-SOURCE-01` |
| application result、Stored/Ephemeral receipt与FreshlyCommitted/Replayed access各回指shared owner，不创建I04 result/access enum | `pass_with_affected_open` | §§5.3, 11.1~11.6, 15.4 |
| public secondary enum/ref/helper没有通过string、alias或domain-only type补造；悬空shared surface保持affected | `pass_with_affected_open` | §§6~7, 11.4~11.10, 15.4 |
| effective actor只来自C-03 authenticated worker delivery，payload/producer/subject/ref均不能成为actor | `pass` | §§4.1, 5.2, 7.2, 8.6, 12.1 |
| trusted Governance producer例外不绕过schema、body-free、digest、source isolation、idempotency、relation、visibility或state gate | `pass_with_affected_open` | §§4.3, 6.1, 7.5, 9.1, 13.2；finite binding仍开放 |
| Query view/page/marker、empty/read visibility/page helper与`*Query`命名问题逐项判定不适用，没有用receipt冒充Query surface | `not_applicable_by_family` | §3问题11~16；I04为Inbound Event Consumer |

### 16.3 Field construction, identity, admission and redaction checklist

| check | result | evidence boundary |
|---|---|---|
| future operation fields必须来自upstream owner发布的最小body-free payload；当前不存在可实例化placeholder字段集 | `pass_with_affected_open` | §§6.2~6.4, 7.1, 15.2 |
| 完整`GovernanceArtifactEvidenceReference`只能由本地authorized relation/factory形成，producer与I/O-free assembler均无构造authority | `pass_with_affected_open` | §§2.2.3, 7.3~7.5, 10.2, 15.2 |
| `DigestSummary` semantic digest、request digest candidates与stored-result integrity digest为三种不同authority | `pass_with_affected_open` | §§2.2.3, 7.3, 8.1~8.5, 11.8, 15.2 |
| `VisibilitySurface`只来自local policy/gap/degraded source，不作为producer field、Governance truth或default authorization | `pass_with_affected_open` | §§2.2.3, 7.3, 10.2, 14.4, 15.2 |
| missing binding、ownerless schema、malformed header、unknown version、forbidden body、missing relation与dependency failure保持不同分类 | `pass_at_design_record_level` | §§4.3, 6.1, 7.5, 9.6, 12.2~12.4 |
| actor、consumer、producer、source event、source、source version、dedup、trace、semantic digest、request digest与local ref保持不同typed角色 | `pass` | §§2.2.2~2.2.4, 7.2, 8.4~8.6 |
| source version只保留typed relation，不回退到event/schema version、cursor、occurred-at、offset、row version或clock | `pass_with_affected_open` | §§6.1, 7.2, 8.4, 13.2；exact binding/source relation仍开放 |
| request digest公共frame、logical prefix、presence/exclusion规则与single candidate set已固定；payload segment仍等待canonical schema | `pass_with_affected_open` | §§8.1~8.3, 13.4, 15.2；`S08-E-I04-DIGEST-ORDER-01` |
| dedup、trace、occurred-at、topic/locator、raw bytes、Governance body与local effects不进入request digest material | `pass_at_design_record_level` | §§8.3, 9.4, 13.4 |
| logical `(operation, actor, dedup)`与secondary `(operation, Governance, source_event)`身份同时校验且不得互换 | `pass_at_design_record_level` | §§8.4, 13.2~13.5 |
| allowlist-before-serialization覆盖decode、canonicalize、input、error/receipt、telemetry、persistence、outbox与dead-letter目标 | `pass_with_affected_open` | §§9.1~9.7, 14.4, 15.2；传播/scan尚未执行 |
| raw/hash/truncated/base64/debug Governance material、provider/credential/transport text与real evidence/run material均无redaction逃逸 | `pass_at_design_record_level` | §§9.4~9.5, 12.3, 14.4~14.7 |
| safe diagnostics只允许finite operation/family/phase/result/error/recovery与明确批准的body-free ref，不暴露高基数敏感label | `pass_at_design_record_level` | §§9.5, 12.3, 14.5~14.7 |

### 16.4 Local truth, UoW, result, recovery and concurrency checklist

| check | result | evidence boundary |
|---|---|---|
| current payload/binding/input/candidates不可构造，因此delivery admission、reservation、writer、stored result与C-05 action均不可达 | `pass_with_affected_open` | §§4.3, 7.1, 10.1, 13.1, 14.1 |
| I04最多拥有Observability body-free observation/reference、selected local landing、idempotency/result/receipt及owner-authorized native record | `pass_with_affected_open` | §§4.1, 10.2~10.4, 14.8；landing仍未选择 |
| Governance context、gate、decision、policy、control、review、conclusion、nonconformity、trace及actor truth始终不可写 | `pass` | §§1, 4.1, 10.2, 14.10 |
| idempotency reservation与future selected primary CAS/create是两个独立guard，只有Acquired可进入writer | `pass_with_affected_open` | §§10.3, 13.2~13.5；primary owner仍开放 |
| unique durable primary/relation/version/transition、native record/no-record、cursor、result refs与outbox尚未被repository capability猜定 | `pass_with_affected_open` | §§10.2~10.4, 13.3, 14.8, 15.2；`S08-E-I04-DURABLE-LANDING-01` |
| future accepted顺序固定为atomic reserve -> selected guard/decision -> primary/followers -> result -> completion -> one commit/certainty | `pass_with_affected_open` | §§10.3~10.6, 13.3, 13.9, 15.4；cross-Step UoW仍开放 |
| result必须在`mark_completed`前同UoW staging，返回Stored前必须有known commit；split commit与partial visibility禁止 | `pass_with_affected_open` | §§10.5, 11.2, 13.6, 14.8 |
| Stored与Ephemeral shape互斥，current zero-write不等于durable NoOp，也不允许伪造stored rejection/empty success | `pass_at_design_record_level` | §§10.1, 11.4~11.5, 14.11 |
| compatible Replay只按original pointer校验并返回immutable stored inner surface加`Replayed` overlay，不重跑landing/outbox/audit | `pass_with_affected_open` | §§11.2~11.3, 13.5~13.7, 14.11 |
| `changed/outbox/gap/dead-letter/error` presence只能来自exact stored surface，不查询current Governance/local truth补值 | `pass_with_affected_open` | §§11.4, 11.8~11.10, 15.4；shared outbox/quarantine仍开放 |
| known pre-commit failure whole-set rollback；known post-commit transport failure保留original result且不重开application writer | `pass_at_design_record_level` | §§10.5, 12.4, 13.7, 14.11 |
| commit/probe unknown不猜winner、不补偿/清理marker、不构造terminal receipt/action且不递归重试 | `pass_with_affected_open` | §§10.5, 11.7, 12.4~12.6, 13.6, 15.4 |
| protocol/domain/application/worker error有单向finite mapping；结构性owner gap不伪装runtime unsupported/dependency error | `pass_at_design_record_level` | §§12.1~12.5 |
| recovery class与C-05 action保持不同owner；application result不携带Ack/Retry/DeadLetter | `pass_with_affected_open` | §§12.5~12.7, 13.9, 15.2~15.4 |
| exact I04 action mapper必须pure/total/no-wildcard且只在receipt/probe后调用一次；当前未定义default action | `pass_with_affected_open` | §§13.9~13.12, 14.11, 15.2 |
| Conflict、InFlight、Replay、primary guard、commit probe与post-commit redelivery具有固定precedence，不暴露winner或mint新identity | `pass_at_design_record_level` | §§13.2~13.7, 14.11 |
| fake、controlled与durable adapter承担相同atomicity、uniqueness、result-before-complete、probe、rollback与redaction语义 | `pass_at_design_record_level` | §§10.6, 13.8；adapter tests未运行 |

### 16.5 Telemetry, durable audit and downstream non-owner checklist

| check | result | evidence boundary |
|---|---|---|
| current只允许真实config/runtime assembly/activation telemetry；没有虚构delivery、schema reject、reservation、receipt或accepted signal | `pass_at_design_record_level` | §§14.1, 14.5~14.7 |
| activation/delivery telemetry、local durable truth与downstream projection分层，telemetry不拥有result、commit certainty或business truth | `pass_at_design_record_level` | §§14.1~14.2 |
| inbound trace只在future合法delivery中传播，current activation用process context；trace不替代actor/event/digest/order/commit proof | `pass_at_design_record_level` | §§8.6, 14.3 |
| log/span/metric只消费已确定typed branch，finite labels不含ref/key/digest/body/error text等高基数或敏感材料 | `pass_at_design_record_level` | §§14.4~14.7 |
| accepted/no-op durable signal晚于known commit；completed-stage telemetry不证明accepted，sink failure不改变result/action | `pass_at_design_record_level` | §§14.5~14.8, 14.11 |
| local native audit只能跟随selected canonical landing或explicit no-record；当前未选择H3/H8/H10/cursor/repository | `pass_with_affected_open` | §§14.8~14.9, 15.2；durable landing开放 |
| evidence linkage、retention/protection与report handoff由各自owner独立读取、验证、决策和提交 | `pass_at_design_record_level` | §§14.2, 14.10 |
| activation、invalid、Replay、Conflict、InFlight、accepted/no-op/negative、rollback、unknown与sink failure均保持downstream zero direct write | `pass_at_design_record_level` | §§14.10~14.11 |
| receipt、native record ref、trace、metric、dashboard、telemetry receipt与worker ack均不是evidence、retention或handoff proof | `pass` | §14.10 |
| wide dependency bundle仍暴露evidence/retention/handoff writer，文字zero-write没有被误报为compile-time capability closure | `pass_with_affected_open` | §§14.9~14.10, 15.2；`S08-E-I04-DOWNSTREAM-WRITE-CAPABILITY-01` |
| generic audit、gap/no-write marker、retention fallback或handoff fallback不能补造missing local proof | `pass` | §§10.2, 12.4, 14.8~14.11 |

### 16.6 Step 08 SOP question coverage checklist

| SOP question group | result | I04 evidence / remaining boundary |
|---|---|---|
| 1~4 inventory、family、caller/handler与transport | `pass_at_design_record_level` | §§3~5；concrete producer event由binding affected保持fail closed |
| 5~10 schema、target object、field source、near-name、missing behavior与Step06/07/09 traceability | `pass_with_affected_open` | §§6~10, 15.2；payload/input/reference/digest/visibility/landing未闭合 |
| 11~16 Query view/page/marker/helper/naming | `not_applicable_by_family` | §3逐问回答；Consumer receipt未冒充Query response |
| 17 public secondary type owner | `pass_with_affected_open` | §§6, 11, 15.2~15.4；payload与shared result/helper传播开放 |
| 18 Consumer envelope/receipt/replay/quarantine/delayed/no-op surface | `pass_with_affected_open` | §§6, 11, 13~15；shared quarantine/indeterminate与exact action仍开放 |
| 19~20 actor authority与trusted-source exception | `pass_with_affected_open` | §§4~9；C-03 trusted actor边界明确，finite Governance binding仍开放 |
| 21 error mapping | `pass_at_design_record_level` | §12；current finite owners可回指，shared recovery owner仍affected |
| 22 idempotency与audit | `pass_with_affected_open` | §§8, 10, 13~15；keys/precedence已固定，landing/UoW/record owner开放 |
| 23 cross-protocol closure | `deferred_to_named_step` | I04局部无未登记gap；I05~I09、S08-F/G与Step08总审计仍未开始，不能由本节代替 |

### 16.7 Affected, flow handoff and evidence-claim checklist

| check | result | evidence boundary |
|---|---|---|
| 11项I04专属affected均有唯一ID、status、question、closure required与forbidden shortcut | `pass_with_affected_open` | §15.2 |
| 2项upstream与9项internal状态未被本检查表关闭、降级、合并或扩写成第二责任域 | `pass_with_affected_open` | §§15.1~15.3 |
| 8项shared/cross-protocol事项保持原owner/status，I04局部检查没有声明shared closure | `pass_with_affected_open` | §15.4 |
| payload/binding -> input/digest/redaction -> reference/visibility/landing -> capability -> result/recovery/action顺序无反向补造 | `pass_with_affected_open` | §15.3 |
| §1~§15发现的schema、owner、signature、carrier、landing、capability与flow缺口均可回指§15 | `pass_with_affected_open` | §§14.9, 14.12, 15；no new gap found |
| Step09 handoff只有`ConsumeGovernanceAuditContextFlow`，callable、reservation、target-neutral order与open seams均可定位 | `deferred_to_named_step` | §§4.2, 5.2, 13.9, 15.4；`03-RPR-S09-PER-FLOW` |
| I04 §16没有进入函数级flow、repository实现、config locator或项目Step16测试切口设计 | `pass` | 本节scope；后续Step保持冻结 |
| `R06.6-F2-H13-UPSTREAM`保持项目级scope-only replay blocker，不是I04 direct dependency | `pass` | §§15.4~15.5 |
| I05~I09、Outbound Event、Job与Step08跨协议总审计没有被I04 checklist代替 | `pass` | §3问题23；current inventory |
| 代码、测试、compile-time dependency cut、forbidden-call/field scan、no-wildcard test、runtime evidence、commit、run_id、evidence alias和验收签署 | `not_run_not_claimed` | design-only artifact |

### 16.8 §16 stop review

| 检查项 | 结论 |
|---|---|
| 是否按protocol/schema、field/admission、truth/UoW/result、telemetry/audit及affected/handoff分域完成静态检查 | `pass_with_affected_open`；所有结论均有§1~§15回指，没有新增设计owner或实现surface |
| Step08 SOP适用于Inbound Consumer的signature、schema、field source、target construction、error、idempotency、actor、receipt、audit和flow handoff是否覆盖 | pass at design-record level；23问均有分组回指，Query-only问题明确`not_applicable_by_family`而非遗漏 |
| 是否存在未登记的I04 canonical owner/schema/signature/carrier/landing/capability缺口 | no new gap found；11项I04专属与8项shared/cross-protocol affected承接全部已知缺口 |
| 是否发现新的上游blocker | no；两个L1-governance direct gaps继续`open_upstream_internal`；项目级H13 blocker仍非I04 direct dependency |
| 是否误关affected或声称slot/runtime/测试事实 | no；所有开放项保持原状态，current slot仍未激活，验证均为planned/not run |
| truth与downstream non-owner边界是否保持 | pass；I04不拥有或反写Governance truth，所有分支对evidence/retention/handoff保持zero direct write |
| current protocol count | 保持`33/60 defined_with_affected_open`；Query `14/14`、Consumer `3/9`、`0/60`无条件complete；I04仍为`in_progress_S01-S16`且不计入defined |
| 本批写入状态 | `S08-E-I04_S01-S16_recorded_with_affected_open`；§16完成，I04 §17与其他协议仍未完成 |
| formal/implementation/test/evidence | formal`03` frozen；代码、测试、scan、runtime evidence、commit、run id、evidence alias与签署均`not_run_not_claimed` |
| next action | 立即停审；用户确认后只进入I04 §17 final stop review，读取I03 §17结构、I04 §§1~§16、current inventory与计数；不得进入I05或后续批次 |
| current commit | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I04_S01-S16_recorded_with_affected_open_waiting_user_before_I04_S17
```

未经用户明确确认，不得进入I04 §17；不得读取或写入I05~I09、S08-F/G、Step09~19、
正式`03`、任何`04`文件或实现代码。当前不需要提交。

该恢复点现为 §16 historical checkpoint；用户已经确认进入 §17，current 状态由下方
final stop review 承接。

## 17. I04 final stop review

| item | conclusion |
|---|---|
| current document / Step | `03-详细设计.md` calibration, Step 08, S08-E Consumer I04 |
| logical protocol | `ConsumeGovernanceAuditContext`; Inbound Event Consumer I04 of 9 |
| protocol status | `defined_with_affected_open`; not unconditional complete and not implementation-ready in isolation |
| independent I04 artifact | complete for this review batch: authority, exact logical binding, callable chain, shared envelope and payload use-site, concrete-input constructability, digest/identity/correlation, redaction-first admission, target-neutral UoW, result/receipt, error/recovery, concurrency/reentry, telemetry/audit, downstream non-owner boundary, affected register and static checklist are recorded |
| public binding and activation | exact I04 operation/discriminator, Governance producer family, matching assembler/service and typed completion boundary are fixed; the runtime slot remains disabled until the canonical payload and finite producer-event binding exist |
| upstream payload / producer-event binding | fail-closed target and forbidden inference rules are fixed; canonical payload declaration/registration and the finite positive event mapping remain two `open_upstream_internal` records |
| concrete input and field authority | six shared control-field targets and operation-field authority decisions are recorded; a complete private input remains non-constructible until payload, reference, semantic digest and visibility owners are closed |
| body-free and redaction boundary | pass at design-record level; Governance decision, gate, policy, control, review, conclusion, nonconformity, evidence/report body and raw transport material cannot enter input, digest, diagnostics, receipt, telemetry, persistence, outbox, retry or dead-letter surfaces |
| digest / identity / correlation | request-digest prefix, exclusions, logical and secondary identities, semantic-digest separation and trace/correlation separation are fixed; operation payload order and single candidate propagation remain affected |
| truth ownership | I04 may eventually write only the selected Observability-owned observation/audit projection; it never owns or writes Governance truth, and current writer reachability is zero |
| durable landing and UoW | one-reservation/one-primary/result-before-complete target order is fixed, but no repository, relation/version transition, H-family or explicit no-record, cursor, result-ref or outbox mapping is selected; the unique landing remains affected |
| result / receipt / replay | current result reachability is zero; future Stored/Ephemeral separation, exact reservation-pointer replay and `Replayed` outer access overlay are fixed without reconstructing from current truth |
| error / recovery / C-05 | structural activation gaps are not runtime receipts; finite error and recovery handoff is recorded, application does not own transport action, and exact no-wildcard I04 action mapping plus commit-unknown completion remain affected |
| concurrency / reentry | atomic logical and source-event identities, retained-profile comparison, four reserve outcomes, independent primary guard, exact replay and same-key unknown-commit probe rules are recorded |
| telemetry | current signals are activation-only; future delivery telemetry is body-free and low-cardinality, and telemetry success or failure cannot prove or alter truth, commit, result or transport action |
| durable audit | no current durable audit is reachable; a future accepted branch may emit only the native record authorized by the selected primary landing, or an explicitly authorized no-record result |
| evidence / retention / report handoff boundary | pass at design-record level; all branches are zero direct write to evidence linkage, retention/protection and report handoff owners, while the wide-dependency capability gap remains affected |
| protocol-specific affected | 11 remain open: 2 `open_upstream_internal` and 9 `open_internal_affected`; all are listed in §15.2 and none is closed by this review |
| shared / cross-protocol affected | 8 retain their existing owner and status as listed in §15.4; I04 does not convert a local target matrix into shared closure |
| unregistered gap audit | pass; §16 found no additional canonical owner/schema/signature/carrier/landing/capability gap |
| exactly one Step 09 handoff | pass at handoff-record level; `ConsumeGovernanceAuditContextFlow` only, while `03-RPR-S09-PER-FLOW` remains open |
| external/project blocker | no new blocker; the two L1-governance direct gaps remain open, and `R06.6-F2-H13-UPSTREAM=open_controlled` remains outside I04 direct dependency |
| protocol count after this stop | `34/60 defined_with_affected_open`; Query `14/14`; Consumer `4/9`; `0/60` unconditional complete |
| formal document | unchanged and frozen; no reassembly before Step 19 |
| implementation / test / evidence | not run; no implementation commit, compile-time cut, forbidden scan, no-wildcard test, runtime evidence, run id, evidence alias, test result or acceptance signature created |
| next allowed action | stop and wait for explicit user confirmation; after confirmation read only I05-required current Step 06/07 owner, shared Consumer carrier and I05 upstream material |
| current recovery point | `Step08_S08-E_I04_defined_with_affected_open_waiting_user_before_I05` |
| submission | not needed; user did not request a commit |

This stop is a gate. I04 is now countable as an independently defined protocol
with affected open, but none of its affected records is closed and its runtime
slot remains disabled. Do not enter I05~I09, S08-F/G, Step 09~19, formal `03`,
any `04` file or implementation code until the user explicitly confirms the
next batch.
