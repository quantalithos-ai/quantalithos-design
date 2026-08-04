# L4-observability 03-详细设计 Step 08 - S08-E Consumer I05 `ConsumeArtifactEvidenceContext`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 当前模式: full-restart / affected-only rebuild
> 当前批次: S08-E Consumer I05 §12（error mapping、exception branches 与 recovery handoff；完成后停审）
> 回填目标: `03-详细设计.md` §7；正式文档只允许在 Step 19 重新装配

## 1. Step 开工确认与当前状态

| 项目 | 记录 |
|---|---|
| Step | Step 08 `定义 API / Command / Query / Event / Job 协议契约` |
| 协议族 / 编号 | Inbound Event Consumer / I05 of 9 |
| 逻辑协议 | `ConsumeArtifactEvidenceContext` |
| operation discriminator | `0x0305`；只由 current finite inbound operation table 固定，不由 route、event name 或 payload 猜测 |
| expected producer | `ObservationProducerFamily::Artifact`；只表示受认证 Artifact 协作 namespace，不证明 Artifact truth 或事件内容正确 |
| local payload use-site | `ObservationInboundEventEnvelope<ArtifactEvidenceContextPayload>`；当前仅是 Observability use-site，不是已证明的上游 canonical declaration |
| current application input use-site | `ConsumeArtifactEvidenceContextInput`；业务字段为 `artifact_evidence_ref: GovernanceArtifactEvidenceReference`、`digest_summary: DigestSummary`、`evidence_purpose: EvidenceConsumerPurpose`、`visibility: VisibilitySurface`，另含 shared Consumer control fields |
| exact assembler callable | `ObservationInboundInputAssembler::consume_artifact_evidence_context(actor_ref: ActorSafeRef, envelope: ObservationInboundEventEnvelope<ArtifactEvidenceContextPayload>) -> Result<ConsumeArtifactEvidenceContextInput, ApplicationError>` |
| exact service callable | `ObservationInboundEventService::consume_artifact_evidence_context(input: ConsumeArtifactEvidenceContextInput) -> ApplicationServiceFuture<'a, ObservationConsumerResult>` |
| Step 09 reservation | `ConsumeArtifactEvidenceContextFlow`；本节只登记唯一 handoff，不展开函数级 flow |
| local target boundary | body-free evidence/linkage/reference observation candidate；可能涉及本地 linkage input marker、reference snapshot 或 audit/gap projection，但 primary landing 尚未在本节裁定 |
| 本文件状态 | `S08-E_I05_S01-S12_recorded_with_affected_open_waiting_user_before_I05_S13` |
| 协议状态 | `in_progress_S01-S12_with_affected_open`；I05 尚未计入 `defined` |
| 当前协议计数 | `34/60 defined_with_affected_open`；Query `14/14`；Consumer `4/9` 已形成记录；`0/60` 无条件 complete |
| 正式 `03` | frozen；本批不回填 |
| 实现 / 测试 / evidence | 未进入、未运行、未声称；不生成 commit、run_id、真实 evidence alias 或验收签署 |
| 当前提交 | 不需要；用户未要求提交 |

I05 的目标边界是：接收来自 Artifact 协作边界的、经过认证且可被允许的
body-free evidence/reference material，把它转换为 Observability 自有的观测、审计或
linkage 输入。I05 不拥有 Artifact fact、version、lineage、baseline、review、derived
view、trace record、artifact content、evidence body 或 Artifact truth anchor 的业务语义，
也不得通过消费结果反写 Artifact truth。Artifact producer 只能提供其自身拥有且被
显式 binding 授权的最小引用事实；Observability 的本地 identity、snapshot state、gap
和 visibility surface 不能由 producer 越权构造。

当前可以安全确认的协议定位如下，不能据此反推尚未存在的 I05 schema：

| 定位项 | current 已有事实 | 本节限制 |
|---|---|---|
| logical binding | `InboundEvent / ConsumeArtifactEvidenceContext` | 不是 transport topic、endpoint 或 schedule locator |
| producer family | `ObservationProducerFamily::Artifact` | 不是 Artifact truth 的授权证明，也不是具体 event kind |
| payload type | `ArtifactEvidenceContextPayload` 只出现在 Observability Step 06/07 use-site | 不把 use-site 当作 contracts canonical owner、wire encoder 或 registration |
| input fields | Step 06 row 列出四个 I05 业务字段 | 不在本节替换字段、补默认值或确定字段来源组合 |
| application seam | matching assembler -> matching inbound service | entry 不直接取得 repository、resolver、canonicalizer、UoW 或 Artifact adapter |
| local outcome | body-free linkage/reference observation candidate | 不等于 Artifact evidence truth、验收 evidence、verdict、signoff 或 report readiness |

### 1.1 本批实际读取与权威顺序

| 顺序 | 输入 | 本批消费内容 | 权威限制 |
|---:|---|---|---|
| 1 | `详细设计讨论流程_SOP.md` Step 08 与 `详细设计书写规范.md` §5.6/§5.7 | Consumer 的 envelope、payload、字段来源、receipt、错误、幂等和逐协议停审要求 | 不用冻结旧 Step 08 的 `done/pass` 或 route-neutral 占位替代逐协议记录 |
| 2 | `设计真相源闭环与可落码性标准.md`、依赖裁剪规则 | body-free、唯一 owner、external ref provenance、actor authority 与不反写 source truth 边界 | 缺 canonical owner 必须记录为 blocker/affected，不由本地 alias 补洞 |
| 3 | current Step 06 I05 input/object/use-site | 四个 I05 业务字段、六个 shared Consumer control fields 及其 matching input seam | Step 06 use-site 不能证明 wire payload 或 Artifact event adapter 已存在 |
| 4 | current Step 07 I05 assembler/service 与 shared Consumer carrier | exact callable、header-before-payload admission、trusted source/event/version 与 service 方向 | callable 只证明应用调用槽，不拥有上游 payload 或 producer binding |
| 5 | `projects/L1-artifact` current `00/01/02/03`、Step 08 calibration material | Artifact truth ownership、outbound event registry、候选 payload 的 typed fields 与 no-body 边界 | 不复制 Artifact truth、event type、route 或 local owner |
| 6 | current `03_ddd_calibration_flow.md`、`project_execution_ledger.md` 与 I04 final checkpoint | 当前恢复点、计数、停审纪律与历史材料处理 | I04 的 current 结论在本批降为 historical checkpoint；不改写其既有 affected |

### 1.2 Artifact 上游候选与冲突诊断

L1-artifact 当前确实存在多个 typed outbound payload，但没有检索到名为
`ArtifactEvidenceContextPayload` 的 canonical declaration、encoder/registration，或一条
唯一的 Artifact event 到 I05 的 binding。与 I05 语义最接近的两个已声明 payload 如下：

| Artifact current payload | 已声明字段 | 与 I05 的关系 | 当前裁定 |
|---|---|---|---|
| `ConsumableArtifactReferenceChangedPayload` | `consumable_ref: ConsumableArtifactReferenceRef`；`truth_anchor_ref: ArtifactTruthAnchorRef`；`reference_state: ConsumableArtifactReferenceState` | 提供 Artifact consumable/reference truth 的引用和状态，但没有 `DigestSummary`、`EvidenceConsumerPurpose` 或 Observability `VisibilitySurface` | 不能直接作为 I05 payload；不得把字段按名称转换为本地 `GovernanceArtifactEvidenceReference` |
| `ArtifactTraceAvailablePayload` | `trace_record_ref: ArtifactTraceRecordRef`；`truth_anchor_ref: ArtifactTruthAnchorRef`；`handoff_record_ref: Option<ArtifactHandoffRecordRef>`；`trace_state: ArtifactTraceState` | 提供 Artifact trace/handoff record 引用，但不是 evidence consumer context，也没有 I05 所需四字段 | 不能直接作为 I05 payload；不得把 trace/handoff readiness 当作 evidence purpose 或 visibility |
| 其他 Artifact fact/version/lineage/baseline/review/derived-view payload | 各自的 Artifact truth ref、state 或 freshness 字段 | 语义更远，不能通过订阅全部事件形成 aggregate | 保持不适用；不得用字段并集制造新 payload |

因此，当前不能安全证明以下任一关系：

```text
Artifact outbound event -> ArtifactEvidenceContextPayload
ArtifactEvidenceContextPayload -> four I05 business fields
Artifact producer -> local GovernanceArtifactEvidenceReference / DigestSummary / VisibilitySurface
```

I05 admission 在 canonical payload、schema/version registration 和有限 producer-event
binding 形成前必须 fail closed。不能任选一个候选 event、订阅所有候选 event、按 event
name 相似度选择 decoder、把多个 payload 做字段并集，或在 Observability 内创建一个
看似兼容的 aggregate event。

### 1.3 §1 发现的 blocker 与 affected

| ID | 状态 | §1 发现 | 必须由谁关闭 | 当前禁止替代 |
|---|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | 当前未找到 `ArtifactEvidenceContextPayload` 的 canonical owner、wire schema、encoder、schema/discriminator registration 或兼容版本声明；该名称只存在于 Observability use-site | L1-artifact 或明确的跨项目 contracts owner 提供唯一 payload、encoder、registration 与兼容规则；Observability 只能消费 | 从 `ConsumableArtifactReferenceChangedPayload`、`ArtifactTraceAvailablePayload` 或 Step 06 四字段反推 schema；创建同名 alias 或本地 canonical DTO |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | L1-artifact 已声明多个独立 outbound event，但没有有限说明哪些 event 进入 I05、如何转换 source/event/version identity、如何绑定 payload schema/version | L1-artifact 与跨项目 binding owner 提供有限 event-to-I05 adapter/registration，或正式裁定 I05 拆分为具体 Consumer | 全量订阅、任选一个 event、按字段/名称匹配、把多个 event 合并或由 Observability 制造 aggregate event |
| `S08-E-I05-REFERENCE-AUTHORITY-01` | `open_internal_affected` | Step 06 要求的 `GovernanceArtifactEvidenceReference` 含 Observability 本地 identity、snapshot state ref、state 及 gap/visibility reason；Artifact producer 的 `ArtifactTruthAnchorRef`、consumable ref 或 trace ref 不具备构造完整本地对象的 authority | Step 06/07 明确 Artifact 只提供最小 body-free source reference，Observability 通过授权 relation lookup/factory 构造或解析本地 reference，并写清缺失/冲突规则 | 直接反序列化 producer 提交的完整本地对象、信任 producer 的 local state/reason/visibility、临时 mint evidence alias 或按 ref prefix/digest 绑定 |

`digest_summary`、`evidence_purpose` 与 `visibility` 的唯一 authority、组合矩阵、
缺失处理和与 Artifact payload 的映射尚未在本节裁定；它们留到 I05 §2 的字段级
authority审查。这里不提前创建额外 affected，也不把本地 `VisibilitySurface` 当作
Artifact producer 字段。

### 1.4 本批禁止事项与停审边界

- 不读取或写入 I05 §2 以后、I06~I09、S08-F/G、Step 09~19、正式 `03`、任何 `04` 文件或实现代码。
- 不把两个 Artifact 候选 payload 或其他 Artifact event 合并为 `ArtifactEvidenceContextPayload`，不自行选择 producer event 或 transport binding。
- 不保存 Artifact content、evidence body、trace body、provider response、raw payload、credential、locator、topic、partition 或 debug dump。
- 不生成真实 evidence alias、Artifact verdict、acceptance/signoff、report readiness、external run id 或业务 truth；不让 I05 结果反写 Artifact truth。
- 不让 Artifact producer 构造 Observability 本地 `GovernanceArtifactEvidenceReference`、`DigestSummary`、`VisibilitySurface`、gap/reason 或 local snapshot state；不以缺失字段、ref prefix、时间、event name、digest、字符串或默认值补齐。
- 不伪造实现 commit、run_id、真实 evidence alias、测试结果、runtime evidence 或验收签署。

本节为 I05 §1 historical checkpoint；current 状态由下方 §2 承接。§1 只完成开工记录、
上游候选诊断与三项具名开放事项，没有定义 I05 payload 或字段构造规则。

## 2. I05 §2 字段级 authority 与构造闭环

本批只审查四个 I05 业务字段及其与 shared Consumer control fields 的构造关系。
本批不回答 Step 08 SOP 23 问的完整协议闭合，不定义 transport locator、C-05 action、
Step 09 函数级 flow 或 durable primary landing。所有“所需 closure”是实现前设计条件，
不是对尚不存在的上游声明、实现或验证的预报。

### 2.1 本批实际读取与权威顺序

| 顺序 | 输入 | 本批消费内容 | 不得反向覆盖 |
|---:|---|---|---|
| 1 | `详细设计讨论流程_SOP.md` Step 08、`详细设计书写规范.md` §5.7 | Consumer payload/input 字段来源、目标对象映射、缺失处理和 secondary public type 的字段级要求 | 不用类型名、family 表或旧 Step 08 总表替代 concrete schema |
| 2 | current Step 06 `contracts_carriers`、`domain_truth_signal_audit`、`policy_guard_records` | `GovernanceArtifactEvidenceReference`、`DigestSummary`、`EvidenceConsumerPurpose`、`EvidenceConsumerScope`、linkage candidate 与 visibility policy 的 owner 和不变量 | Step 08 不重新定义这些 domain/contracts 类型，不创建 alias 或第二 owner |
| 3 | current Step 06 `application_input_assembly_r06_8a`、`application_report_error_service` | I05 四字段、六个 Consumer control fields、`from_assembled` 规则、Inbound dependency bundle 和 shared result/service use-site | family-level row 不能证明 I05 专属 payload、resolver 或最小依赖切片已经存在 |
| 4 | current Step 07 `trait_port_adapter_contracts` | matching assembler/service 签名、`GovernanceArtifactEvidenceResolver`、`AuditEvidenceRepository::find_linkage_by_relation`、typed ID allowlist | callable 只证明调用槽和读取能力；不能把 resolver 或 repository 变成 payload/source owner |
| 5 | L1-artifact current outbound payload / event registry 与其 design-calibration material | Artifact 拥有的最小 reference/event 事实及候选 payload 形状 | 不把 Artifact truth、event type、schema registration 或 producer binding 复制到 Observability |
| 6 | I05 §1、Step 08 affected inventory、项目台账 | 上游 blocker、当前恢复点、historical material 隔离和停审纪律 | 不关闭 §1 affected，不把本批字段诊断写成上游交付或测试结果 |

### 2.2 分域 authority 与转换边界

| 分域 | 唯一拥有的事实 / 能力 | I05 可消费的最小信息 | 明确不拥有 |
|---|---|---|---|
| L1-artifact / 跨项目 binding owner | Artifact reference/event truth、其 typed payload、schema/version 与有限 producer-event binding | 经过认证且被注册允许的 body-free Artifact reference observation；具体字段须由 canonical binding 给出 | Observability 本地 reference identity、snapshot state、gap/reason、visibility、consumer purpose、linkage relation |
| Observability `contracts` | 本地 typed ref、`DigestSummary`、`EvidenceConsumerPurpose`、`EvidenceConsumerScope`、`VisibilitySurface` 与 shared envelope/result vocabulary | 已由 upstream contract 或本地 factory/policy 合法构造的 typed value | Artifact payload/schema、Artifact truth、外部正文、provider locator/credential |
| Observability domain / policy | `EvidenceLinkage` 的 relation/state、body-free policy validation、consumer-specific visibility decision | 由完整本地 boundary、projection、purpose、scope、digest 组成的候选关系 | external authenticity、verdict、acceptance、report signoff、source truth |
| application input assembly | header-before-payload validation、operation-specific concrete input、一次 request digest candidate 生成 | 从已注册 envelope 和已授权本地转换结果复制字段 | I/O lookup、resolver 调用、默认值、payload 容错或 downstream action |
| application service / resolver / repository | 本地 relation lookup、reference resolution、UoW/result/outbox 的 operation-specific subset | service 阶段的 typed read/write capability，待 I05 最小 dependency view 闭合 | producer schema、任意宽依赖越权、Artifact body 或下游 evidence/retention/handoff truth |

当前不存在一条已闭合的“Artifact outbound event -> I05 canonical payload -> 四个本地
业务字段 -> linkage relation”转换链。I05 §2 只记录每个字段的合法 authority 方向，
不以本地 use-site 补齐这条缺口。

### 2.3 四个 I05 业务字段的字段来源审查

| 输入字段 | current 类型 / use-site | 合法来源与目标使用 | 缺失 / 冲突行为 | 当前裁定 |
|---|---|---|---|---|
| `artifact_evidence_ref` | `GovernanceArtifactEvidenceReference`；Observability 本地完整 body-free reference | Artifact 只能提供 canonical 最小 family + external safe ref（以及明确允许的 source observation）；本地 service 通过授权 relation/factory 形成或解析完整 reference，再供 linkage/policy 使用 | 缺 upstream ref、family mismatch、snapshot relation 缺失或 duplicate row 时 fail closed；不得把 producer 对象直接反序列化为本地 reference，也不得静默 mint alias | `S08-E-I05-REFERENCE-AUTHORITY-01` 保持开放。`from_external_ref(id, family, safe_ref, snapshot_ref)` 需要本地 ID、snapshot 和本地 state authority；现有 `GovernanceArtifactEvidenceResolver` 只接受已完整的 reference，不能完成这一步 |
| `digest_summary` | `DigestSummary`；body-free semantic digest，不是 request digest | 必须由唯一 owner 选择 upstream canonical digest，或由本地 canonicalizer 对获授权的 body-free material 按固定 profile/material/order 生成；结果供 linkage candidate、relation consistency 和 replay comparison 使用 | absent、profile mismatch、reference 内 optional digest 与 incoming digest 不一致时不得复制、覆盖、置空或任选其一；不得 hash Artifact body、raw event、transport bytes、topic、timestamp 或 debug/string ref | `S08-E-I05-DIGEST-AUTHORITY-01` 新增并开放。Artifact 候选 payload 当前不携带该 digest，Step 06 也没有 I05 专属 semantic material/profile/conflict rule |
| `evidence_purpose` | `EvidenceConsumerPurpose`；四个有限变体：`AuditTraceability`、`DiagnosticExplanation`、`ReportHandoffInput`、`ExternalAuditPreparation` | 这是 Observability 下游消费意图，必须来自本地 operation/binding policy，或来自另一个明确 upstream-owned observation 后由本地 finite mapper 收窄；它进入 linkage 的语义关系和唯一键 | 未注册组合、family/purpose 不兼容或来源不可信时 reject；不能按 Artifact event name、state、consumer 产品名或缺失默认推导 | `S08-E-I05-PURPOSE-AUTHORITY-01` 新增并开放。Artifact producer 不应选择本地下游 purpose；当前 Step 06 producer-facing row 因此不能直接视为最终 wire/input schema |
| `visibility` | `VisibilitySurface`；Observability public response / disclosure surface | 只能由本地 policy decision、reference/linkage state、persisted gap/degraded source 和目标 consumer scope 生成；应在 service/result/view mapping 阶段形成 | policy source 缺失、scope 不兼容或 visibility decision 不完整时保持 not-visible/degraded 或返回 typed error，具体 action 后置；不得默认 `Visible`、以 absence 表示 visible 或把 Artifact state 当授权 | `S08-E-I05-VISIBILITY-AUTHORITY-01` 新增并开放。它不应作为 Artifact producer 直接提交的业务字段 |

四个字段不是同一层的输入：`artifact_evidence_ref` 是本地 reference object，
`digest_summary` 是 semantic integrity carrier，`evidence_purpose` 是本地消费意图，
`visibility` 是本地 disclosure surface。把四者全部放进一个 producer payload 会让
producer 越过本地 identity、policy 和 read-surface authority；当前必须按上述分层处理。

### 2.4 `GovernanceArtifactEvidenceReference` 的构造闭环

Step 06 对本地 reference 给出的 current 字段和 factory 为：

```rust
pub struct GovernanceArtifactEvidenceReference {
    pub boundary_ref_id: GovernanceArtifactEvidenceReferenceId,
    pub reference_family: GovernanceArtifactEvidenceFamily,
    pub external_safe_ref: ExternalObjectRef,
    pub digest_summary: Option<DigestSummary>,
    pub reference_snapshot_state_ref: ReferenceSnapshotStateRef,
    pub state: GovernanceArtifactEvidenceReferenceState,
    pub gap_ref: Option<GapStateRef>,
    pub visibility_reason: Option<EvidenceVisibilityReason>,
}

from_external_ref(
    id,
    family,
    external_safe_ref,
    reference_snapshot_state_ref,
) -> GovernanceArtifactEvidenceReference
```

I05 当前能证明的来源只有：

| 构造部分 | 所需 authority | 当前可定位能力 | 结论 |
|---|---|---|---|
| `boundary_ref_id` | Observability `IdGeneratorPort` 的专用 mint | `IdGeneratorPort` 有多种 observation ref 方法，但没有 `new_governance_artifact_evidence_reference_id` | 不能从 Artifact ref、digest 或 event id 转换；纳入既有 reference-authority affected 的 closure |
| `reference_family` + `external_safe_ref` | authenticated Artifact binding | I05 上游 canonical payload/binding 尚不存在 | 受 `PAYLOAD-SCHEMA` 与 `PRODUCER-EVENT-BINDING` 共同阻断 |
| `reference_snapshot_state_ref` + `state` | 本地 snapshot/relation factory 与 resolver | resolver 只解析完整 reference；没有 I05 source-ref -> local snapshot construction seam | 不能由 producer state、arrival time 或 source cursor 补齐 |
| `digest_summary` | 唯一 semantic digest owner | current reference 内 digest 是 `Option`，I05 incoming digest authority未闭合 | 由 `DIGEST-AUTHORITY` 处理；不得默认复制 optional field |
| `gap_ref` / `visibility_reason` | 本地 missing/visibility policy | Artifact producer无权提交本地 reason；I05 operation-specific policy dependency未闭合 | 只能由本地缺失/不可见决策产生，不能作为 producer payload 字段 |

因此 `GovernanceArtifactEvidenceResolver::resolve_governance_artifact_evidence` 的
当前签名只能用于“验证/解析一个已经存在的完整 local reference”，不能被写成
`ArtifactRef -> GovernanceArtifactEvidenceReference` 的隐含 factory。I05 在该 seam
闭合前不得创建 `Candidate` linkage、不得把 `ArtifactTruthAnchorRef` 直接 cast 成
`boundary_ref`，也不得把 resolver 的 `EvidenceSafeSummary` 当作完整 reference。

### 2.5 Shared Consumer control fields 的来源传播

Step 06 规定每个 Consumer concrete input 都物理包含以下六个字段；它们不是 I05
producer payload 的业务字段，也不能由 I05 四字段覆盖：

| control field | 唯一来源 | I05 传播规则 | 缺失 / 冲突处理 |
|---|---|---|---|
| `context: ObservationOperationContext` | application-private `for_inbound_event` factory | assembler 以固定 I05 operation、trusted actor、validated producer/source-event、dedup、trace 与一次生成的 digest candidates 构造 | 任何 operation/actor/event relation 不一致时在 input 前失败；producer 不得提交或改写 context |
| `request_digest_candidates: RequestDigestCandidates` | application canonicalizer | 对 validated shared header + canonical typed I05 payload 按唯一 `inbound_consumer_request` profile 只生成一次；context 使用同一候选集的正确 digest | canonical payload、field order 或 redaction ceiling 未闭合时不产生 candidate；不得 hash raw envelope/body 或各层重算 |
| `source_ref: ObservationSourceRef` | shared envelope + finite Artifact producer binding | 保留认证 source identity；不能从 `truth_anchor_ref`、subject、topic、actor 或 payload 字符串推导 | producer/source binding 未注册或 source drift 时 reject/quarantine 路由后置；不生成第二 event identity |
| `source_version_ref: Option<ObservationSourceVersionRef>` | shared envelope 的 typed source version | 若存在，必须与 Artifact producer/source binding逐字段一致；只用 typed same-stream relation 比较 | `source_cursor` 不得直接 cast；缺 comparator 时保留 fail-closed，不用 schema version、arrival time、row version替代 |
| `schema_version: SchemaVersion` | 已注册 I05 consumer slot | header 先验证，unsupported/unknown 时不 decode payload、不 reserve、不调用 service | Artifact `event_version` 只有显式 binding 才能映射；不得默认当前版本 |
| `occurred_at: ObservedAt` | authenticated event binding 的 occurrence observation | 仅作为事件发生时间传入 local observation；不参与 source ordering、identity 或 request digest | 不得用 arrival time、local clock、cursor 或 adapter response time替代 |

目前只有 family-level `from_assembled` 规则和 matching assembler/service 签名，尚未有
I05 concrete input 的完整 private field/accessor 传播证明。故新增：

`S08-E-I05-CONTROL-FIELD-SOURCE-01 = open_internal_affected`。

### 2.6 Artifact payload 到 I05 input 的可接受边界

当前 L1-artifact 候选只能作为冲突诊断材料，不能成为 I05 accepted payload：

| Artifact candidate | 可提供的最小事实 | 不能提供 / 不能映射 | I05 裁定 |
|---|---|---|---|
| `ConsumableArtifactReferenceChangedPayload` | `consumable_ref`、`truth_anchor_ref`、`reference_state` | 本地 `GovernanceArtifactEvidenceReference`、semantic digest、consumer purpose、`VisibilitySurface`、local gap/state reason | 只有在有限 binding 明确允许时，作为 source reference observation 的候选；当前不能直接 decode 为 I05 payload |
| `ArtifactTraceAvailablePayload` | `trace_record_ref`、`truth_anchor_ref`、可选 `handoff_record_ref`、`trace_state` | evidence linkage relation、purpose、digest、local visibility；trace availability 不等于 evidence context | 不适合作为 I05 payload；不得把 trace/handoff state 重命名为 I05 四字段 |
| 未找到的 `ArtifactEvidenceContextPayload` | 尚无 canonical declaration | owner、wire schema、encoder、registration、兼容版本和 event binding均缺失 | accepted payload set 继续为空；既有两个 upstream blocker 保持开放 |

合法的未来 admission 顺序只能是：

```text
registered producer/event binding
  -> validate shared envelope/header
  -> decode one canonical Artifact payload
  -> map only upstream-owned body-free fields
  -> local reference/digest/purpose/visibility authority checks
  -> construct I05 private input
```

在第一项和第二项形成前，不能用 field-name、event-name、ref prefix、digest 或 default
把候选材料拼接成输入。任何失败都必须在 reserve/UoW/service 之前停止；具体 receipt、
quarantine、retry/dead-letter action 留待后续 protocol/flow 小节，不在 §2 选择。

### 2.7 Linkage relation 的缺口

Step 06 的 `EvidenceLinkage::candidate(...)` 至少需要：

```text
EvidenceLinkageRef
+ AuditProjectionRef                  (projection_ref)
+ GovernanceArtifactEvidenceReference (boundary_ref)
+ EvidenceConsumerPurpose             (purpose)
+ DigestSummary                       (digest_summary)
```

Step 07 的 `find_linkage_by_relation(...)` 还要求：

```text
projection_ref + boundary_ref + purpose + consumer_scope
```

而 current `ConsumeArtifactEvidenceContextInput` 只有：

```text
artifact_evidence_ref + digest_summary + evidence_purpose + visibility
```

`visibility` 不是 `EvidenceConsumerScope`；`EvidenceConsumerScope` 还包含 typed
`ObservationConsumerRef`、`ConsumerScope` 和 purpose。当前 I05 input 既没有
`projection_ref`，也没有 `consumer_scope`，Step 07 也没有 I05-specific relation source
说明这两个值由哪个已授权 lookup 产生。因此不能证明 I05 能够：

1. 创建唯一的 `EvidenceLinkage::Candidate`；
2. 读取或重放同一 semantic relation；
3. 将 Artifact reference 与某个 audit projection、consumer scope 和 purpose 无损绑定；
4. 以 `VisibilitySurface` 代替 relation/policy 输入。

登记：

`S08-E-I05-LINKAGE-RELATION-SOURCE-01 = open_internal_affected`。

关闭条件是 Step 06/07 明确 I05 的最小 typed selector/lookup source，或修订 I05
concrete input 使其携带完整 relation 必需字段，并给出 missing/duplicate/version/
scope-mismatch 行为。禁止从 Artifact ref、purpose、event identity、当前第一条 projection
row 或产品名推导。

### 2.8 I05 dependency slice 的当前边界

Step 07 只声明 inbound service 消费 operation-specific dependency subset，但 current
`ObservationInboundEventDependencies` 是 wide bundle，包含多类 repository/resolver。
本批不把 wide bundle 当作 I05 owner，也不从其字段存在性选择 landing。I05 至少需要在
后续闭合以下最小能力类别：

| 能力类别 | 可能的最小用途 | 当前状态 |
|---|---|---|
| Artifact/reference resolver | 读取或验证 body-free reference relation，不返回正文 | `GovernanceArtifactEvidenceResolver` 只接受完整 local reference；source-to-local seam 未闭合 |
| linkage/projection relation read | 读取 sole relation、version 和 duplicate/missing 状态 | `find_linkage_by_relation` 需要 I05 当前未提供的 selector；未闭合 |
| local UoW / idempotency / stored result | 后续 accepted Consumer flow 的 shared carrier | shared Consumer affected 仍开放；本批不定义 writer 或 result action |
| evidence/retention/handoff writer | I05 明确不应直接拥有 | 必须从 I05 dependency view 排除；不得因 wide bundle 可见而调用 |

因此新增：

`S08-E-I05-DEPENDENCY-SLICE-01 = open_internal_affected`。

关闭要求是 I05-specific private delegate/dependency view、可逐项回指 Step 07 port 和
Step 09 flow，并能在静态边界上证明 I05 无 Artifact truth、evidence body、retention、
report handoff 或 external delivery writer。该 affected 不选择任何当前 landing，也不提前
关闭 shared downstream capability affected。

### 2.9 字段缺失与冲突矩阵

| 情形 | 必须停止的位置 | 允许的设计语义 | 禁止行为 |
|---|---|---|---|
| canonical payload/schema/event binding 缺失 | registration / typed decode 前 | 保持 slot disabled 或 fail closed；具体 transport completion 后置 | 任选候选 event、字段并集、默认 schema |
| upstream Artifact ref 缺失或 family mismatch | local input construction 前 | typed protocol/application error；若未来 owner明确支持 local Missing state，必须由本地 factory产生 | producer提交完整 local ref、mint alias、按 prefix/digest绑定 |
| snapshot/relation 缺失、duplicate 或 version mismatch | service relation admission 前 | typed missing/consistency boundary；不得把 absence 当 linked | 任取第一行、把 resolver error 当 absence、重建 current truth |
| semantic digest absent、profile mismatch 或冲突 | digest candidate / relation validation 前 | 等待唯一 digest authority；按明确矩阵 reject 或进入显式 gap，具体 action 后置 | 复制 optional reference digest、hash raw body、空值/默认值补齐 |
| purpose 未注册或与 family/scope 不兼容 | local policy validation 前 | typed policy rejection；不选择 C-05 action | 按 event name、产品名、visibility 或缺失默认 purpose |
| visibility policy/source 不可用 | local surface mapping 前 | not-visible/degraded 或 typed error，依赖 current owner 的有限映射 | 默认 `Visible`、把 Artifact state 当授权、把 `VisibilitySurface` 写回 Artifact |
| shared control field 与 envelope 不一致 | header/input assembly 前 | fail closed；不产生 reserve/UoW | payload 覆盖 header、arrival time/cursor 代替 source version |

### 2.10 §2 affected register

| ID | 状态 | 本批字段级发现 | 关闭条件 | 当前禁止替代 |
|---|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | I05 canonical payload、wire schema、encoder、registration、兼容版本仍无唯一 owner | L1-artifact 或跨项目 contracts owner 提供唯一声明与注册 | 从候选 payload 或 Step 06 row 反推、alias、aggregate |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | Artifact event 到 I05 slot 的有限映射和 source/schema/version relation 未闭合 | 上游与 binding owner 提供有限 adapter/registration，或正式拆分 Consumer | 全量订阅、任选 event、名称/字段匹配、合并事件 |
| `S08-E-I05-REFERENCE-AUTHORITY-01` | `open_internal_affected` | 完整 local reference 的 id、snapshot、state、gap/reason 不能由 producer 构造；resolver 不能从最小 source ref 直接完成 local construction | Step 06/07补齐本地 ID/factory/relation/absence/duplicate/version authority；`IdGeneratorPort`补专用 mint 或给出等价既有 owner | 直接反序列化、临时 mint、信任 producer state/reason、按 prefix/digest绑定 |
| `S08-E-I05-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | 六个 Consumer control fields 只有 family-level规则，缺 I05 concrete input 的完整构造/accessor传播 | 给出 I05 `from_assembled` 参数、private fields/accessors、header一致性和静态 least-authority proof | generic map、entry-side context/digest、payload覆盖header |
| `S08-E-I05-DIGEST-AUTHORITY-01` | `open_internal_affected` | Artifact候选无 semantic digest；本地 profile/material/order、optional digest conflict rule 未唯一化 | 选择 upstream canonical 或 local canonicalizer 单一路径并固定矩阵与single-computation | raw/body/transport hash、复制 optional digest、空/default digest、双 owner |
| `S08-E-I05-PURPOSE-AUTHORITY-01` | `open_internal_affected` | `EvidenceConsumerPurpose` 是本地下游意图，当前 producer-facing row 没有可信来源或 finite mapping | 由本地 operation/binding policy 或明确 upstream observation 经 total mapper产生；固定 family/purpose/scope组合 | producer任选 purpose、产品名/event name推导、缺失默认 |
| `S08-E-I05-VISIBILITY-AUTHORITY-01` | `open_internal_affected` | `VisibilitySurface` 是本地 response surface，却被列为 producer input；I05 policy/gap/degraded source未闭合 | 移出 producer payload并由本地 policy/result mapper生成；固定 not-visible/degraded precedence | producer提交 local surface、默认 Visible、absence-as-visible、Artifact state授权 |
| `S08-E-I05-LINKAGE-RELATION-SOURCE-01` | `open_internal_affected` | `candidate` / `find_linkage_by_relation` 需要 `projection_ref` 与 `consumer_scope`，I05 input 未提供且无 source | 明确 I05 minimal selector/lookup 或修订 concrete input，并定义 missing/duplicate/version/scope矩阵 | 用 visibility/purpose/ref prefix/第一行 projection 替代 |
| `S08-E-I05-DEPENDENCY-SLICE-01` | `open_internal_affected` | Step 07只有 operation-specific subset文字，没有 I05 concrete minimal dependency view；wide bundle暴露越权写能力 | 提供 I05 private dependency delegate，逐项回指 port/flow并排除 evidence/retention/handoff/external writer | 把 wide bundle 当 owner、复制trait、仅靠文字约束证明 no-write |

本批没有关闭任何 affected，也没有新增外部上游 blocker；I05 专属集合现为 9 项：
2 项 `open_upstream_internal`、7 项 `open_internal_affected`。项目级
`R06.6-F2-H13-UPSTREAM=open_controlled` 仍存在，但不是 I05 direct dependency。

### 2.11 §2 stop review

| 检查项 | 结论 |
|---|---|
| 用户授权范围 | `pass`；本批只进入 I05 §2，读取 Step 06/07、shared Consumer owner 与 Artifact 字段级材料；未读取/写入 §3以后、I06~I09、S08-F/G、Step 09、formal 或实现代码 |
| 四个业务字段 | `pass_with_affected_open`；字段语义、合法 authority、缺失/冲突边界已逐项记录，但没有把当前 use-site升级为最终 wire schema |
| shared control fields | `pass_with_affected_open`；六字段的 shared source 与 I05传播规则已记录，I05-specific constructor/accessor仍受 affected 阻断 |
| local reference / linkage | `pass_with_affected_open`；reference authority、projection/scope relation与ID/factory缺口已具名登记，未创建 alias、默认或第二 owner |
| truth / no-write | `pass` at design-record level；不拥有 Artifact truth/content/evidence body/verdict/signoff/report readiness，不反写 Artifact，不直接写 evidence/retention/handoff |
| 上游 blocker | `no new blocker`；既有 `S08-E-I05-PAYLOAD-SCHEMA-01` 与 `S08-E-I05-PRODUCER-EVENT-BINDING-01` 持续开放 |
| 当前协议计数 | 保持 `34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`；`0/60` 无条件 complete；I05 仍不计入 defined |
| implementation / test / evidence | `not_run_not_claimed`；未实现、未运行测试或 scan，不生成 commit、run_id、真实 evidence alias 或验收签署 |
| 下一动作 | 立即停审；用户确认后只进入 I05 §3，读取 Step 08 SOP 23 问、shared Consumer carrier 与 I05 §1~§2；不得越级进入 §4 或 I06~I09 |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I05_S01-S02_recorded_with_affected_open_waiting_user_before_I05_S03
```

未经用户明确确认不得进入 I05 §3；不得读取或写入 I05 §4以后、I06~I09、S08-F/G、
Step09~19、正式 `03`、任何 `04` 文件或实现代码。当前不需要提交。

该段为 I05 §2 historical checkpoint；current 状态由下方 §3 承接。

## 3. Step 08 SOP 23 问回答

本节只把 Step 08 的 23 个问题逐项落到 I05，不定义 canonical payload、transport
locator、durable landing、C-05 action 或 Step 09 函数级 flow。回答分为四类：已经由
§1~§2与 shared Consumer carrier 固定的边界、明确不适用于 Inbound Consumer 的 Query
问题、由 9 项既有 affected 继续承接的问题，以及必须在 I05 后续小节展开的细节。
完成问题路由不等于 I05 已经 `defined`、runtime slot 已启用或实现可以开始。

| # | SOP 问题 | I05 当前回答 | disposition / 依据 |
|---:|---|---|---|
| 1 | 本轮需要定义哪些 API / Command / Query / Event / Job？ | 本轮只定义 Inbound Event Consumer `ConsumeArtifactEvidenceContext`；不展开 I06~I09、Outbound Event、Operations Job 或其他协议。 | `recorded`；协议库存、`0x0305` 与本文件边界一致。 |
| 2 | 这些协议应按哪个协议族或所属模块分批定义？ | 归属 S08-E Inbound Event Consumer；调用链限定为 authenticated worker entry -> matching inbound assembler -> `ObservationInboundEventService`，不创建 admin/internal 副本或并行 Artifact consumer。 | `recorded`；shared family binding与 Step 07 exact callable 可定位。 |
| 3 | 每个协议的调用方、处理方、传输方式是什么？ | producer 侧调用方只能是经认证且被有限 registration 允许的 Artifact event binding/adapter；worker exact callback 调用 assembler，application service 处理 concrete input。当前没有哪一个 Artifact event 进入 I05 的唯一选择。 | `affected_open`；`S08-E-I05-PRODUCER-EVENT-BINDING-01`。 |
| 4 | 外部接口使用 HTTP、RPC、event bus 还是其他方式？ | 使用 typed asynchronous event delivery/completion 的逻辑边界；topic、subscription、credential、partition 与 transport 产品属于 entry/config binding，不进入 I05 payload、identity 或 digest。Artifact 的现有 event registry 不自动构成 I05 subscription。 | `recorded_with_binding_open`；不猜 transport，具体 event registration 仍开放。 |
| 5 | 请求、响应、事件或 job 输入输出 schema 是什么？ | 入口目标为 shared `ObservationInboundEventEnvelope<ArtifactEvidenceContextPayload>`，输出目标为 shared `ObservationConsumerResult` 再映射 stored/ephemeral Consumer receipt；但 `ArtifactEvidenceContextPayload` 没有 canonical declaration、encoder、registration 或兼容版本。Step 06 的四字段 use-site 不能反向充当 wire schema。 | `affected_open`；`S08-E-I05-PAYLOAD-SCHEMA-01`。 |
| 6 | 每个输入契约会构造或影响哪些 Domain 对象？ | I05 只允许构造或影响 Observability 自有的 body-free reference/linkage observation candidate及其本地结果关系；不得构造或修改 Artifact fact、version、lineage、baseline、review、derived view、trace、content、evidence body 或 truth anchor。完整 local reference 与 linkage relation必须由本地授权 owner形成。 | `affected_open`；目标边界已固定，exact construction 由 reference、linkage 与 dependency affected 承接。 |
| 7 | 目标对象的必填字段是否全部能从输入、派生、查表或系统生成中获得？ | 否。canonical payload/event binding、六个 control fields 的 concrete propagation、完整 local reference、semantic digest、purpose、visibility，以及 linkage 所需 `projection_ref` 与 `consumer_scope` 均未形成完整来源链。缺口关闭前不能构造 accepted I05 input。 | `affected_open`；9 项 I05 专属 affected 全部保持开放。 |
| 8 | 哪些字段名相近但语义不同，不得混同？ | Artifact `truth_anchor_ref`、`consumable_ref`、`trace_record_ref` 与完整 local `GovernanceArtifactEvidenceReference` 不等价；Artifact `reference_state`/`trace_state` 不等于 local snapshot state或 `VisibilitySurface`；`DigestSummary` 不等于 request digest；purpose、consumer scope 与 visibility 是三种独立语义；`handoff_record_ref` 不等于 linkage、report readiness 或验收 evidence；source event/version、schema version、local identity 与 occurred/arrival time均不得互换。 | `recorded`；§1.2、§2.3~§2.7，禁止名称 cast、prefix 推断或 default fallback。 |
| 9 | 字段缺失时是 reject、derive、lookup、retry、dead-letter 还是暂停处理？ | malformed/缺失 shared header 在 payload decode 前 fail closed；canonical payload或有限 binding缺失时 slot 保持 disabled；local reference、digest、purpose、visibility与relation字段只允许由具名 owner derive/lookup。暂态 lookup、retry、dead-letter 与 indeterminate completion 必须由后续 typed error/recovery/action matrix决定，不能默认。 | `target_recorded_detail_pending`；§2.9与既有 affected，当前不选择 transport action。 |
| 10 | 当前协议族完成后，每个 DTO / Event / Job 是否能回指 Step 6 对象、Step 7 port 和 Step 9 处理流？ | I05 use-site可回指 Step 06 input/object、Step 07 matching assembler/service以及唯一 `ConsumeArtifactEvidenceContextFlow` reservation；但 payload owner、event binding、local construction、least-authority dependency和result/action尚未闭合，因此当前不能判 pass。 | `affected_open`；只完成 handoff registration，不声称 protocol-to-flow closure。 |
| 11 | Query 的 response view、page、projection marker 是否有字段级 schema？ | `not_applicable`；I05 不是 Query，不定义 view、page 或 projection marker。Consumer receipt不得冒充 Query response。 | `not_applicable_by_family`。 |
| 12 | Query 的 empty、not visible、stale、failed、rebuilding、disabled、missing state 对外 surface 是什么？ | `not_applicable`；Query presence/read-state 不由 I05 定义。I05 的 disabled slot、Consumer outcome与 receipt 分支分别由 binding和后续 result/action 小节处理。 | `not_applicable_by_family`。 |
| 13 | Query response 中 read model / projection / cursor 的 id/ref 如何生成，repository key 是什么？ | `not_applicable`；I05 不生成 Query read-model identity或 page cursor。Artifact source ref、source event ref、local reference identity、linkage identity和 idempotency identity保持分离。 | `not_applicable_by_family`。 |
| 14 | Query response 字段引用的 enum / ref 是否归属到 contracts shared，或是否写明 domain 到 view 的正式映射？ | `not_applicable`于 Query response；I05 自身 payload、envelope、receipt、ref和 helper 的 owner仍由问题17审查，不能借本问跳过。 | `not_applicable_by_family`。 |
| 15 | Query / repository 使用的 page helper 是否有 schema、归属和 public page DTO 映射？ | `not_applicable`；I05没有 page request、cursor 或 public page DTO。Relation lookup 的唯一性问题不等于分页问题。 | `not_applicable_by_family`。 |
| 16 | HLD `*Query`、DDD `*Request`、Rust DTO 名称是否存在收敛映射？ | `not_applicable`于 Query命名；I05只保留 `InboundEvent / ConsumeArtifactEvidenceContext` 到 payload use-site、input、assembler、service和 flow reservation 的有限命名链。 | `not_applicable_by_family`；payload owner缺失仍由既有 affected约束。 |
| 17 | Command result、event payload、consumer envelope / receipt、job report中引用的 enum / ref / helper 是否都有 schema 和归属？ | shared Consumer envelope/receipt、operation、producer、source-event与 public error surface已有 owner；I05 payload没有 canonical owner，完整 local reference不能由 producer构造，digest/purpose/visibility/relation authority也未闭合。因此 I05 当前不满足本问。 | `affected_open`；9项I05 affected及shared Consumer result/outbox等既有affected继续承接。 |
| 18 | Inbound consumer 的 envelope、receipt、duplicate、quarantine、delayed、no-op marker 是否有字段级 schema？ | shared carrier已固定 header-before-payload、stored/ephemeral receipt及 outcome presence规则；duplicate只能是 `Replayed` access overlay，不新增 `Duplicate` outcome，也不得创建无 owner 的 `QuarantineRef`。I05-specific payload、stored result、quarantine/delayed/no-op reachability和 C-05 action仍未逐分支定义。 | `target_recorded_detail_pending`；shared carrier不能替代 I05 totality。 |
| 19 | 每个 command / event / job 的 actor 是 participant、system、integration 还是 trusted source actor？是否必须在 participant / visibility scope 中？ | I05 effective actor是 C-03 authenticated worker delivery提供的 trusted source actor，不来自 payload，也不因 Artifact author、reviewer、subject或 ref成为 participant。该 actor只用于 local operation/idempotency/audit attribution，不授予 Artifact truth或 visibility authority。 | `recorded`；复用 C-03 actor owner，不新建 I05 actor enum。 |
| 20 | 如果存在 trusted source actor 例外，适用的 source kind、actor kind、入口协议和不可绕过的 gate 是否写清？ | 例外只适用于 static I05 slot、authenticated Artifact producer family、registered concrete event/schema/source binding和 matching worker callback；必须依次通过 consumer、producer、source-event/source、version/schema、dedup/trace/time header gate后才可组装 input。payload actor-like字段、topic、ref、digest或 Artifact state均不能绕过。 | `target_recorded_binding_open`；event/schema registration仍由两项上游 affected约束。 |
| 21 | 每个协议失败时映射成什么错误？ | 需要有限映射 protocol/header、unsupported schema、producer/event binding、payload decode/authority、reference relation/lookup、digest/purpose/visibility policy、idempotency、domain/UoW/commit错误；public surface不得携带 Artifact body、truth state、provider error、credential或 locator。exact precedence、recovery class与 C-05 action留后续小节。 | `target_recorded_detail_pending`；本节不虚构完整 error matrix。 |
| 22 | 哪些协议需要幂等键或审计记录？ | I05需要 logical `(operation, trusted actor, dedup_key)` 与 secondary `(consumer, authenticated producer, source_event_ref)` 边界及 canonical request digest；replay只返回原 stored surface。只有真实 accepted 的 Observability-owned local change才可形成其 owner授权的 durable audit/projection记录，不得把消费动作写成 Artifact audit truth、真实 evidence或 signoff。exact landing/UoW仍待后续小节。 | `target_recorded_detail_pending`；control/digest、landing、shared idempotency/UoW affected保持开放。 |
| 23 | 所有协议族完成后，是否仍有 public DTO 缺 schema、跨协议命名漂移、二级类型未归属或 protocol-to-flow 断裂？ | 当前不能判定完成。I05仍有9项专属affected且尚未形成完整协议记录；I06~I09、S08-F/G和60协议 cross-protocol audit均未完成。 | `open`；计数保持 `34/60 defined_with_affected_open`，I05不计入 defined。 |

### 3.1 回答闭合度与 affected 路由

| 问题组 | 本节结论 | 后续唯一承接 |
|---|---|---|
| 1~4 scope / family / caller / transport | protocol边界与 product-neutral async方向已记录；具体 Artifact event binding仍开放 | §4 finite binding；`S08-E-I05-PRODUCER-EVENT-BINDING-01` |
| 5~10 schema / target / source / missing / handoff | 只形成目标态、fail-closed条件和 Step09 reservation，不能判 schema、input或对象构造闭合 | §5~§10；9项I05 affected，不新增临时 owner |
| 11~16 Query-only surface | 六问逐项 `not_applicable_by_family`，没有用 Consumer receipt或 relation lookup替代 Query contract | 无I05后续定义；Step08跨协议审计只核对未遗漏 |
| 17~18 public secondary types / Consumer carrier | shared carrier可复用，但 I05-specific payload/result/reachability未闭合 | §6、§11~§13；payload与shared result/action affected |
| 19~20 actor / trusted-source exception | trusted actor来源和不可绕过 gate的目标态已固定 | §4~§7传播 exact binding与header来源 |
| 21~22 error / idempotency / audit | 分类边界已列出，exact precedence、landing、UoW、recovery/action仍待逐节 | §8、§10~§14；不在§3发明 record或 mapper |
| 23 cross-protocol closure | 明确保持 open | I05 §17后仍只计单协议；S08-G最终总审计 |

§3没有发现新的外部上游 blocker或本仓 owner gap，也没有关闭任何既有 affected。
两项 `open_upstream_internal`、七项 `open_internal_affected`以及 shared Consumer
result/outbox/quarantine/indeterminate、recovery、UoW和 Step09 handoff事项保持原状态。
问题回答只是把现有缺口路由到唯一后续位置，不把“尚未进入后续分析”重复登记成新 ID。

### 3.2 §3 stop review 与下一读取边界

| 检查项 | 结论 |
|---|---|
| 用户授权范围 | `pass`；本批只读取 Step 08 SOP 23问、shared Consumer carrier与I05 §1~§2，未读取/写入§4以后、I06~I09、S08-F/G、Step09、formal或实现代码 |
| 是否逐项回答 Step 08 SOP 23问 | `pass at question-routing level`；23项均有I05回答与disposition，Query专属11~16逐项标记`not_applicable_by_family` |
| 是否把目标态误报为 canonical schema或implementation-ready | `no`；5~10、17~18、21~22均明确保留 affected或detail pending |
| Artifact truth与Observability projection边界 | `pass at design-record level`；没有把Artifact fact/version/lineage/content/evidence body/trace/verdict/signoff/report readiness变成本地business truth，也没有反写Artifact |
| actor、identity、digest、purpose、scope与visibility是否保持分离 | `pass at target level`；exact传播仍由9项既有affected承接 |
| affected / blocker | I05专属9项原样保持：2项`open_upstream_internal`、7项`open_internal_affected`；没有新增或关闭事项，也没有新增外部上游blocker |
| 当前协议计数 | 保持`34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`；`0/60`无条件complete；I05为`in_progress_S01-S03_with_affected_open`，不计入defined |
| formal / implementation / test / evidence | formal`03`继续frozen；实现、测试、scan、runtime evidence、commit、run_id、真实evidence alias与验收签署均`not_run_not_claimed` |
| 下一动作 | 立即停审；用户确认后只进入I05 §4，读取shared finite binding、I05 §1~§3、Step06/07 exact use-site/callable与Artifact event registry，只定义truth boundary和exact logical binding |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I05_S01-S03_recorded_with_affected_open_waiting_user_before_I05_S04
```

未经用户明确确认不得进入 I05 §4；不得读取或写入 I05 §5以后、I06~I09、S08-F/G、
Step09~19、正式 `03`、任何 `04` 文件或实现代码。当前不需要提交。

该段为 I05 §3 historical checkpoint；current 状态由下方 §4 承接。

## 4. Truth boundary、exact logical binding 与 Artifact event admission

本节只回答三件事：I05 最多可以承接哪一种 Observability-owned observation，I05 在
本仓的有限逻辑绑定是什么，以及 L1-artifact 当前 8 个 outbound event 是否已有一个
可以合法进入该绑定。它不定义 `ArtifactEvidenceContextPayload` 字段、event adapter、
具体 input constructor、函数级 flow、UoW、receipt/result 或 C-05 action。下文的
`target binding` 只表示本地必须满足的唯一关系，不表示上游 schema、encoder、decoder、
registration 或 runtime slot 已经存在。

### 4.1 本批读取与权威顺序

| 顺序 | 输入 | 本批采用的事实 | 不得反向覆盖 |
|---:|---|---|---|
| 1 | S08-B shared finite binding 与 inbound envelope | `InboundEvent` family、9 个有限 Consumer name、sealed payload relation、header-before-payload admission 与 no-fallback 规则 | shared structural relation 不能替代 I05 canonical payload 或 per-event registration |
| 2 | I05 §1~§3 | Artifact truth/no-write 边界、9 项 affected、字段 authority 缺口与 SOP 问题路由 | §4 不关闭字段/schema/result/UoW affected，不重复创建 owner |
| 3 | current Step 06 operation/input use-site | `0x0305`、`ConsumeArtifactEvidenceContextInput` 与 matching assembler use-site | use-site 名称不证明 payload declaration、constructor 或 implementation 已存在 |
| 4 | current Step 07 exact callable | 唯一 inbound assembler 与唯一 inbound service method | callable 只固定应用入口，不拥有 transport、payload、resolver、UoW 或 completion policy |
| 5 | L1-artifact current outbound event registry | 8 个 event kind、8 个 payload、committed-change map、topic-neutral key 与 primary-consumer direction | Artifact event/payload 不得被复制为 Observability contracts owner；primary-consumer 文本不等于 I05 binding |

### 4.2 Owned and non-owned truth

| boundary | I05 §4 rule |
|---|---|
| producer namespace | `ObservationProducerFamily::Artifact` 只表示经认证的 Artifact 协作来源命名空间。它不证明 event body、truth anchor、state、cursor 或 publication result 正确，也不授予 Observability 修改 Artifact truth 的权限。 |
| admitted observation | I05 最多承接一个由明确 owner 注册、经过 body-free/redaction gate 的 Artifact reference/change observation。只有 canonical event-to-I05 binding 明确允许的 source ref、state observation 和 semantic material可进入；Artifact body、trace body、handoff body和content不得进入。 |
| local owned truth | Observability 只拥有本地 observation/reference/linkage projection、其本地 identity/state/relation、经唯一 authority 形成的 digest/purpose/visibility、Consumer idempotency/result/receipt，以及由本地对象变化授权的 audit/gap marker。它们描述观测侧状态，不描述 Artifact 业务事实。 |
| Artifact truth | Artifact fact、version、lineage、baseline、review、consumable reference、trace、derived view、truth anchor、truth cursor、committed change、relay snapshot 与 publication lifecycle均由 L1-artifact 拥有；I05 不复制、不修正、不晋升、不回写。 |
| evidence/reference relation | I05 可以在后续契约允许时建立 Observability-owned body-free reference/linkage relation，但该 relation 不是 Artifact evidence、attestation、trace truth、consumption verdict 或 handoff acceptance。完整 `GovernanceArtifactEvidenceReference` 必须由本地授权 factory/lookup 形成，producer 不能直接提交。 |
| audit / metric / trace | I05 telemetry 只能证明本地 admission、处理尝试或已提交的 Observability result，不能证明 Artifact event 已验证、Artifact truth 已接受或下游 evidence/report 已生成。source ref、event ref 与 trace correlation不得成为业务结论。 |
| retention / report handoff | I05 不直接写 evidence、retention/protection、report handoff 或 external delivery truth。后续本地生命周期只能消费已提交的 Observability reference/linkage；不得因 Artifact handoff ref、trace state 或 primary consumer 列表自动创建下游事实。 |
| actor and identity | trusted actor 只来自 C-03 authenticated worker binding，用于本地 operation/idempotency/audit attribution。Artifact actor-like material、subject、truth anchor、topic key、source cursor、`source_event_ref`、`dedup_key` 与 `trace_ref` 各自保持独立，不能互换。 |
| write direction | 合法方向只有 `Artifact-owned event fact -> explicit typed binding -> Observability-owned projection`。I05 不提供到 Artifact repository、truth service、relay state、trace record、handoff record或derived view的反写、补偿写或状态确认路径。 |
| redaction ceiling | raw Artifact content、serialized relay payload、provider/transport body、credential、locator、topic、partition、actor profile、trace body和handoff body不得进入 input、digest、log、metric label、trace attribute、receipt、outbox、dead-letter或本地持久化。body-free contract不完整时必须停止 admission。 |

因此，未来 I05 的本地 `Accepted` 只能表示一个 Observability-owned UoW/result 已按
其 owner 契约提交；它不能表示 Artifact event 已被业务接受、Artifact truth 已改变、
trace 已验证、handoff 已交付、evidence 已成立或报告已签署。即使 Artifact registry
把 `observability` 列为 primary consumer，也不能扩大该 truth ownership。

### 4.3 Finite local target binding

S08-B 已关闭 family/name/body/operation 的 shared structural relation，但 I05 仍必须
独立证明 concrete payload implementation 和 producer-event registration。当前可定位的
唯一 I05 本地目标 binding 如下：

| binding item | exact current target | status / restriction |
|---|---|---|
| protocol family | `ObservationProtocolFamily::InboundEvent` | 只属于 S08-E Consumer，不创建 Command、Job、admin/internal 或另一个 Artifact Consumer 副本 |
| logical binding | `InboundEvent / ConsumeArtifactEvidenceContext` | 唯一逻辑协议名；不以 topic-neutral key、broker topic、handler、Artifact event name 或 handoff job 建立别名 |
| public consumer name | `ObservationInboundConsumerName::ConsumeArtifactEvidenceContext` | 必须来自 finite static name table；unknown、跨 family 或 alias name 在 payload decode 前失败 |
| internal operation | `ObservationInboundConsumerOperation::ConsumeArtifactEvidenceContext` | 只允许 matching variant；不得由 event name、payload字段、topic、source ref 或自由字符串推导 |
| stable discriminator | `0x0305` | 只固定 Observability 本地 operation identity；不是 Artifact event kind、schema version、source cursor或 transport discriminator |
| required producer family | `ObservationProducerFamily::Artifact` | 必须同时匹配 authenticated registration 与 payload associated constant；只固定 namespace，不证明 concrete event 已注册 |
| sealed payload target | `ArtifactEvidenceContextPayload: ObservationInboundPayload<CONSUMER = ConsumeArtifactEvidenceContext, PRODUCER = Artifact>` | 这是唯一允许的 target relation；当前没有 canonical declaration/implementation，`S08-E-I05-PAYLOAD-SCHEMA-01`保持开放，不在本仓创建 alias 或第二 DTO |
| envelope target | `ObservationInboundEventEnvelope<ArtifactEvidenceContextPayload>` | 仅为 Step 06/07 use-site；consumer、producer、source event/source、version、schema、dedup、trace与time header必须先于payload验证 |
| exact assembler | `ObservationInboundInputAssembler::consume_artifact_evidence_context(actor_ref, envelope) -> Result<ConsumeArtifactEvidenceContextInput, ApplicationError>` | 唯一 matching assembler use-site；当前 payload/input不可完整构造，不能调用 repository、resolver、ID generator、clock、UoW或transport registrar补齐 |
| exact application service | `ObservationInboundEventService::consume_artifact_evidence_context(input) -> ApplicationServiceFuture<'a, ObservationConsumerResult>` | 唯一 matching service façade；只在完整 input 构造后可达，本节不选择 landing、writer、result branch或action |
| unique Step 09 reservation | `ConsumeArtifactEvidenceContextFlow` | 只保留一个后续 flow 回指；本节不展开函数级调用、事务或异常恢复 |
| transport boundary | typed asynchronous delivery/completion | actual topic、subscription、credential、partition、offset、delivery mode与locator归 entry/config binding；均不进入 operation identity、payload 或 business truth |
| secondary identity | `(consumer, authenticated producer_family, source_event_ref)` | 只有 exact event/schema/source registration通过后成立；不得用 Artifact truth anchor、relay item、payload snapshot、source cursor、topic或offset替代 |
| logical idempotency | `(operation, trusted actor, dedup_key)` | `dedup_key`是独立 delivery metadata；不得用 source event、trace、timestamp、semantic digest或Artifact ref替代 |
| completion direction | local `ObservationConsumerResult` -> exact worker mapper -> C-05 private registrar | completion不反写 Artifact truth；result/receipt/action totality留后续小节，当前没有合法 Accepted path |
| current activation | disabled / fail closed | canonical payload与finite event-to-I05 binding缺失，static I05 slot不得激活；未知或未注册Artifact event不能进入assembler、reserve、UoW或receipt构造 |

这个表只闭合“本地唯一协议槽与未来 payload 必须满足的 sealed relation”。它不闭合
payload schema、producer encoder、event adapter、source/version转换、input字段构造或
handler totality。因此 `S08-ROUTE-BINDING-01` 继续是
`shared_binding_closed_per_protocol_totality_open`，I05 不能因本地 name/callable 存在而
计入 `defined`。

### 4.4 L1-artifact outbound event admission matrix

L1-artifact current registry 有 8 个一一对应 committed-change 的 outbound event。
`primary consumers` 只能证明上游分发意图：其中 `ArtifactLineageChanged` 与
`ArtifactTraceAvailable` 列出 `observability`，但 registry 没有把任一事件映射到
`ConsumeArtifactEvidenceContext`、`ArtifactEvidenceContextPayload` 或 Observability
header/schema。`ConsumableArtifactReferenceChanged` 虽然字段语义接近 reference，
registry 反而没有把 Observability 列为 primary consumer。当前逐项裁定如下：

| Artifact event / payload | registry signal | I05 current admission | forbidden shortcut |
|---|---|---|---|
| `ArtifactFactChanged` / `ArtifactFactChangedPayload` | primary consumers不含Observability；字段为fact/content-context/change kind | not registered for I05；不进入decode或adapter | 把fact/content context当evidence ref、purpose或audit projection |
| `ArtifactVersionChanged` / `ArtifactVersionChangedPayload` | primary consumers不含Observability；字段为version/fact/state | not registered for I05 | 把version state当local snapshot、visibility或source version；按version name自动订阅 |
| `ArtifactLineageChanged` / `ArtifactLineageChangedPayload` | primary consumers列出Observability；payload只有lineage/source-target version/relation kind | upstream recipient direction only；缺I05 consumer/schema/adapter/source mapping，当前fail closed | 把lineage relation直接当`EvidenceLinkage`，把source/target version当projection/scope，或因consumer列表直接路由I05 |
| `ArtifactBaselineChanged` / `ArtifactBaselineChangedPayload` | primary consumers不含Observability | not registered for I05 | 把baseline scope/state当consumer scope、purpose或visibility |
| `ArtifactReviewChanged` / `ArtifactReviewChangedPayload` | primary consumers不含Observability；subject甚至可能为空 | not registered for I05 | 把review/responsibility/state当evidence verdict、signoff、actor或truth anchor |
| `ConsumableArtifactReferenceChanged` / `ConsumableArtifactReferenceChangedPayload` | 字段语义接近reference，但primary consumers不含Observability | semantic candidate only；没有订阅意图与I05 binding，当前fail closed | 静默增加Observability订阅；把consumable/truth anchor/state直接cast成本地完整reference，或补齐digest/purpose/visibility |
| `ArtifactTraceAvailable` / `ArtifactTraceAvailablePayload` | primary consumers列出Observability；payload为trace/truth-anchor/optional handoff/state | recipient and semantic candidate only；没有I05 canonical payload或field adapter，当前fail closed | 把trace/handoff state当evidence、report readiness、visibility、consumer purpose或local trace truth |
| `ArtifactDerivedViewStateChanged` / `ArtifactDerivedViewStateChangedPayload` | primary consumers不含Observability；envelope subject无truth anchor | not registered for I05 | 从view kind/freshness推断truth anchor、projection ref、gap或visibility |
| unknown/new event or unsupported schema | current 8-event finite registry之外，或版本不受支持 | registration/payload decode前拒绝；不尝试其他payload variant | wildcard namespace订阅、`Other(String)`、current-version fallback、generic map或按字段相似度选择decoder |

`ArtifactLineageChanged` 和 `ArtifactTraceAvailable` 的 recipient direction 是本批新增读取到
的证据，但它们仍由既有 `S08-E-I05-PRODUCER-EVENT-BINDING-01` 承接，不构成新
blocker。该证据只把候选全集从“名称相近事件”收敛为“8 个 event 全量逐项审查，其中
2 个具有 Observability 分发意图”；它没有授权选择其中任一 event，也没有关闭
`S08-E-I05-PAYLOAD-SCHEMA-01`。

### 4.5 Future binding closure conditions

I05 slot 只有在同一份 current design truth 中同时满足以下条件后才可从 disabled 转为
可注册；缺任一项都不能让实现者自行选边：

1. L1-artifact 或明确的跨项目 contracts owner 给出唯一 canonical I05 payload、wire schema、encoder、schema/version compatibility 与 body-free/redaction contract；或者正式裁定拆分 I05 为具体 Consumer。
2. 给出有限的 Artifact event kind/name -> I05 consumer/payload adapter 表，明确允许集合和拒绝集合；`primary consumers`、topic-neutral key或字段相似度不能替代该表。
3. 对每个允许 event 给出 Artifact outbound envelope 到 Observability `source_event_ref`、`source_ref`、`source_version_ref`、`schema_version`、`occurred_at` 与 `trace_ref` 的 typed mapping、authority和缺失/冲突行为。
4. canonical payload 必须实现唯一 sealed relation，并由 static slot验证 `CONSUMER=ConsumeArtifactEvidenceContext` 与 `PRODUCER=Artifact`；不能有dynamic registry、alias、wildcard或fallback decoder。
5. payload 到本地 reference/digest/purpose/visibility、projection/scope selector和六个 control fields 的转换必须分别由§2登记的合法 owner闭合；producer不能构造本地 policy/state。
6. worker registration、authenticated producer family、source-event/source/version、schema、dedup、trace/time 与 payload gate必须按shared header-first顺序全部通过，之后才允许调用matching assembler。
7. I05 private dependency slice、durable landing或explicit no-record、result/recovery/action与Step09 flow必须在后续具名小节闭合；event binding本身不授权写入任何repository。

当前 7 项本仓 affected 均处于第 5~7 条的必要条件中，因此即使上游明天提供 payload
和 event adapter，I05 仍不会自动成为 runtime-ready 或 implementation-ready。

### 4.6 §4 stop review 与下一读取边界

| 检查项 | 结论 |
|---|---|
| §4范围是否受控 | `pass`；只写truth ownership、finite local target binding、8-event admission和future closure条件，未进入payload字段、concrete input constructor、flow、UoW、result或C-05 action |
| Artifact与Observability truth是否分离 | `pass at design-record level`；I05只承接body-free observation/reference projection，不拥有或反写Artifact fact/version/lineage/baseline/review/consumable/trace/derived-view/relay truth |
| evidence、retention、report handoff边界 | `pass at ownership level`；不创建真实evidence、retention policy、report verdict/signoff或external delivery fact，也不直接写下游owner |
| exact local binding | `pass at target/use-site level`；family、public/internal name、`0x0305`、Artifact producer family、sealed payload target、matching assembler/service与唯一flow reservation均已定位 |
| shared sealed relation是否已有I05 concrete implementation | `no`；canonical `ArtifactEvidenceContextPayload`仍不存在，slot保持disabled，不能把use-site当implementation |
| concrete Artifact event是否已绑定 | `no`；8个event均已逐项分类，`ArtifactLineageChanged`/`ArtifactTraceAvailable`仅有recipient direction，其他事件也不能按语义或名称自动接入 |
| affected / blocker | 9项I05专属affected原样开放：2项`open_upstream_internal`、7项`open_internal_affected`；本批没有新增或关闭项，也没有新增外部上游blocker |
| current reachability | payload decode、complete input、assembler invocation、service、reservation、writer、stored result、receipt与C-05 action全部不可达；没有把disabled slot伪装成runtime rejection结果 |
| 当前协议计数 | 保持`34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`；`0/60`无条件complete；I05为`in_progress_S01-S04_with_affected_open`，不计入defined |
| formal / implementation / test / evidence | formal`03`继续frozen；实现、测试、scan、runtime evidence、commit、run_id、真实evidence alias与验收签署均`not_run_not_claimed` |
| 下一动作 | 立即停审；用户确认后只进入I05 §5，读取Step07 matching assembler/service签名、shared worker callback/registration与typed completion边界，定义exact call chain和callable/capability boundary |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I05_S01-S04_recorded_with_affected_open_waiting_user_before_I05_S05
```

未经用户明确确认不得进入 I05 §5；不得读取或写入 I05 §6以后、I06~I09、S08-F/G、
Step09~19、正式 `03`、任何 `04` 文件或实现代码。当前不需要提交。

该段为 I05 §4 historical checkpoint；current 状态由下方 §5 承接。

## 5. Exact call chain 与 callable/capability boundary

本节只把 Step 07 已定义的 worker activation、finite handler registration、matching
assembler/service 和 C-05 completion carrier精确收敛到 I05。它不定义
`ArtifactEvidenceContextPayload`字段、`ConsumeArtifactEvidenceContextInput` constructor、
request digest material、repository/UoW、stored result、error/recovery或C-05 action矩阵，也不展开
`ConsumeArtifactEvidenceContextFlow`的Step 09函数级处理流。下文的per-delivery链是未来满足
全部activation前置条件后的唯一合法链，不表示当前I05 callback已经存在或可以接收delivery。

### 5.1 本批读取与权威顺序

| 顺序 | 输入 | 本批采用的事实 | 不得反向覆盖 |
|---:|---|---|---|
| 1 | I05 §1~§4 | Artifact truth/no-write边界、唯一I05 logical slot、9项affected及current disabled reachability | §5不能把target binding改写成已注册payload、可运行callback或implementation-ready协议 |
| 2 | Step 07 §§7.4~7.7 | inbound assembler为9-method worker-only synchronous facet；inbound service为9-method façade；matching I05 callable及result carrier已固定 | exact callable不拥有payload schema、event binding、input字段authority、transport action或durable landing |
| 3 | Step 07 §§8.3~8.6 | object-safe handler、prebuilt registrar、one-shot worker assignment、consuming activation与all-or-nothing registration边界 | infra callback/registrar不能成为application port、service locator或业务truth owner |
| 4 | Step 07 §10.1 | worker只取得validated entry、inbound façade、inbound assembler和registrar；构造9个finite optional slots并仅调用一次`register_all` | worker不得取得repository/UoW/resolver/publisher/raw config/transport locator，也不得恢复resident publication loop |
| 5 | shared Consumer carrier §6.9 | header-before-payload、receipt与C-05 action carrier分离、commit-indeterminate无合法completion | shared carrier不能替代I05-specific decoder、result/action totality或disabled-slot行为 |

该顺序意味着：§5可以固定“调用由谁发起并到哪里结束”，但不能用一条完整的箭头链掩盖
链中payload、input和result仍不可构造的事实。任何后续字段或UoW设计若要求entry绕过assembler、
让assembler执行I/O、让service重新接收public envelope，均与本节exact callable边界冲突，必须回到
对应affected修订，而不是增加旁路。

### 5.2 Startup registration 与 activation chain

Worker runtime的唯一启动路径为：

```text
build_worker(validated root)
  -> ObservationWorkerAssignment {
       worker_entry,
       inbound,
       inputs,
       registrar,
     }
  -> BuiltWorkerObservabilityRuntime::activate_with(worker activation)
  -> build exactly nine finite optional handler slots
  -> registrar.register_all(handler catalog) exactly once
       prepare_all
       -> totality_check
       -> arm_all
       -> return opaque RegisteredInboundConsumerSet
  -> expose one worker root only after register_all = Ok
```

| Startup stage | I05-specific obligation | Failure / disabled behavior |
|---|---|---|
| selected worker build | 同一builder invocation必须提供`ValidatedWorkerEntryConfig`、9-method inbound assembler、9-method inbound service façade与prebuilt registrar；不得从其他runtime或旧config拼装 | 任一required capability不完整时不产生worker assignment或partial runtime |
| safe registration inspection | enabled/disabled集合中I05只能使用finite `ConsumeArtifactEvidenceContext` operation、Artifact producer family、registered schema和同一private slot/config identity | current payload/event binding缺失时I05不得被列为enabled并配generic handler；若配置要求enabled，startup totality必须失败而非降级为wildcard |
| handler catalog construction | I05 handler若存在，其`operation()`必须恒等于`ObservationInboundConsumerOperation::ConsumeArtifactEvidenceContext`，并只捕获matching assembler/service与exact mapper capability | current I05保持optional slot disabled，不构造接收generic map/raw bytes的占位handler，不以其他Consumer handler填槽 |
| `register_all` | 只调用一次；同时核对enabled/disabled集合、operation、producer、schema、private slot与config identity | prepare/totality/arm任一步失败，registrar撤销并join本次全部registration；不返回partial count、active subset或recovery handle |
| callback exposure | 只有`register_all`完整返回`Ok`后，本组callback才可被transport触发 | I05 disabled时无I05 callback；activation失败时整个worker root暴露零callback，不形成Consumer receipt或C-05 completion |
| activated ownership | root只持有immutable entry handles与opaque registered set；opaque handle没有lookup/invoke/adapter/business result/evidence/signoff方法 | entry不能从opaque handle绕过registered callback调用application，也不能查询private locator或transport state |

“九个finite optional slots”不等于九个handler必须无条件存在。它要求slot universe固定、enabled
subset和handler catalog可做totality检查；disabled I05以“该slot未armed”表达，而不是通过一个会返回
`UnsupportedSchema`、`Rejected`或`NoOp`的伪handler表达。若未来I05被启用，必须先满足§4.5与
§5.6的全部条件，再参与同一次all-or-nothing registration。

### 5.3 Per-delivery exact call chain

I05未来可激活时，每次delivery只能走以下一条链：

```text
private registered Artifact slot
  -> C-03 InboundConsumerDelivery
  -> slot / handler / delivery operation equality gate
  -> exact I05 worker handler
  -> shared header-before-payload admission
  -> registered ArtifactEvidenceContextPayload decoder
  -> ObservationInboundEventEnvelope<ArtifactEvidenceContextPayload>
  -> ObservationInboundInputAssembler::consume_artifact_evidence_context
  -> ConsumeArtifactEvidenceContextInput
  -> ObservationInboundEventService::consume_artifact_evidence_context
  -> ObservationConsumerResult or typed ApplicationError
  -> exact I05 result/error/recovery/action mapper
  -> one legal C-05 InboundConsumerCompletion
  -> private registrar executes the already selected action
```

| 序号 | 调用边界 | 必须成立 | 不得发生 |
|---:|---|---|---|
| 1 | private slot -> C-03 | delivery来自已armed的I05 private slot，safe registration、actor policy和finite operation均匹配 | transport topic/locator、payload字段或producer自报actor选择operation |
| 2 | registrar/worker pre-callback gate | slot、handler `operation()`和C-03 operation逐项等于I05；mismatch在callback exposure前拒绝 | fallback到I01~I04/I06~I09、generic handler、自由字符串dispatch |
| 3 | header admission | 先验证consumer、authenticated Artifact producer、source event/source/version、schema、dedup、trace/time及registration relation | payload先解码；从payload补header；按event名称、字段相似度或current-version fallback选择decoder |
| 4 | exact payload decode | 只调用与注册event/schema绑定的`ArtifactEvidenceContextPayload` decoder，并形成完整typed envelope | generic map/raw bytes、candidate payload union、8个Artifact event任选/并集、unknown variant fallback |
| 5 | matching assembler | 同步按值接收trusted actor与typed envelope，完成exact body/nested type、canonical order、digest profile和family/context校验；成功时只返回一个完整concrete input | I/O、repository/resolver/UoW/external call、partial input、entry侧重构input、失败后继续调用service |
| 6 | matching service | 只按值消费`ConsumeArtifactEvidenceContextInput`，返回`ApplicationServiceFuture<ObservationConsumerResult>` | 重新接收public envelope/raw body；transport ack/dead-letter；source/Artifact truth write；由worker直接调用repository |
| 7 | exact worker mapper | 只消费该次typed result/error、commit certainty与后续I05 finite policy，形成一个合法receipt/action组合 | application result自己选择action、receipt factory选择action、wildcard/default/error-string retry、从current repository重构旧receipt |
| 8 | C-05 -> registrar | registrar只执行`Acknowledge`、`Retry`或`DeadLetter`中已选择的一种，不再分类 | registrar按outcome/error重新选择action、把C-05持久化为业务truth、ack前伪造local commit |
| 9 | transport action completion | ack/dead-letter执行失败只映射为entry-owned worker failure；若local result已提交则保持不变 | 回滚或重跑Observability truth、反写Artifact状态、把transport success当evidence/report acceptance |

Assembler失败时链在第5步终止：不得形成partial input、service调用、reservation、repository、
resolver、UoW或external adapter调用。Service返回之后也不能直接把
`ObservationConsumerResult`解释为C-05；exact mapper仍须在后续I05小节闭合result/recovery/action
totality。若commit probe后仍为indeterminate，current C-05三个terminal action均不合法，handler
不能默认返回`Retry`或任一占位completion；该shared接缝保持开放，不由§5伪造第四variant。

### 5.4 Exact callable signatures

本节不创建I05专属trait或第二组callback类型。I05只占用Step 07现有surface中的一个finite
method slot，签名逐字固定为：

```rust
fn consume_artifact_evidence_context(
    &self,
    actor_ref: ActorSafeRef,
    envelope: ObservationInboundEventEnvelope<ArtifactEvidenceContextPayload>,
) -> Result<ConsumeArtifactEvidenceContextInput, ApplicationError>;
```

```rust
fn consume_artifact_evidence_context<'a>(
    &'a self,
    input: ConsumeArtifactEvidenceContextInput,
) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
```

Shared worker callback与registration surface保持：

```rust
pub trait InboundConsumerHandler: Send + Sync {
    fn operation(&self) -> ObservationInboundConsumerOperation;

    fn handle<'a>(
        &'a self,
        delivery: InboundConsumerDelivery,
    ) -> InboundConsumerHandlerFuture<'a>;
}

pub trait InboundConsumerRegistrar: Send + Sync {
    fn registrations(&self) -> &[ValidatedInboundConsumerRegistration];

    fn register_all<'a>(
        &'a self,
        handlers: InboundConsumerHandlerCatalog,
    ) -> RegistrationFuture<'a, Box<dyn RegisteredInboundConsumerSet>>;
}
```

Worker activation只允许下列四个参数：

```rust
fn activate(
    self: Box<Self>,
    worker_entry: ValidatedWorkerEntryConfig,
    inbound: Arc<dyn ObservationInboundEventService>,
    inputs: Arc<dyn ObservationInboundInputAssembler>,
    registrar: Arc<dyn InboundConsumerRegistrar>,
) -> RuntimeActivationFuture<Self::ActivatedRoot>;
```

这些签名具有以下落码约束：assembler同步且不能把borrow逃逸到future；service按值取得完整input，
不能要求worker在异步阶段补字段；handler只返回C-05 completion，不把`WorkerError`暴露进infra trait；
registrar只接收完整finite catalog，不暴露单slot `register`、lookup或invoke。任何实现若需要额外
Artifact client、repository、resolver、UoW、transport handle或raw config参数进入worker
activation，即说明I05依赖或authority设计尚未闭合，不能扩签名绕过affected。

### 5.5 Allowed / forbidden capability matrix

| 边界 | 唯一允许的输入与调用 | 明确禁止的能力 | I05 current consequence |
|---|---|---|---|
| worker root activation | validated worker entry、inbound façade、inbound assembler、prebuilt registrar | truth-write/read/Job façade、Job registrar、repository/UoW/resolver/publisher/delivery、raw config、locator、credential | 只能装配finite callback，不能在entry补I05 schema、reference或policy |
| exact I05 handler | C-03 delivery；matching assembler/service；后续exact mapper | generic dispatch、raw archive、source fetch/repair、Artifact write、resident publication/projection loop | payload/binding缺失时不得构造handler占位或接收delivery |
| inbound assembler | trusted actor、typed I05 envelope；crate-private pure canonicalizer/context factory能力 | I/O、repository、resolver、ID/service locator、UoW、external adapter、transport action | 当前完整local reference/purpose/visibility/linkage若需lookup或缺material，assembler签名无法合法补齐，既有authority/dependency affected继续开放 |
| inbound service façade | 完整`ConsumeArtifactEvidenceContextInput`；内部I05所需least-authority application slice待后续闭合 | public envelope/raw bytes、transport ack/dead-letter、raw archive、source/Artifact truth write；entry直接取得内部ports | input未完整构造前service不可达；wide dependency bundle不能被callable存在所授权 |
| exact result/action mapper | typed application result/error、commit certainty、future finite I05 recovery policy | wildcard/default、字符串分类、receipt factory选action、将unknown commit映射为terminal action | result/action尚未定义，不能从shared outcome表直接推导I05 completion |
| private registrar | safe registration读取、complete handler catalog、已选择的C-05 action | application重新分类、business result查询、private slot/locator暴露、partial registration | disabled slot没有运行期结果；transport执行失败不改变local committed truth |
| Artifact producer side | 未来明确注册的body-free payload/event binding与typed header mapping | 构造Observability local identity/state/reason/purpose/visibility，调用local service/repository，接收反写确认 | 两项上游internal blocker未关闭，current I05 registration不可建立 |

本矩阵暴露出一个必须保持诚实的构造约束：matching assembler签名只有`actor_ref + typed
envelope`，且assembler禁止I/O；matching service又只接受已经完整的concrete input。因此本地完整
reference、purpose、visibility或linkage若需要持久化lookup，不能被悄悄塞进assembler，也不能留给
service“再补input”。该问题由既有`REFERENCE-AUTHORITY`、`PURPOSE-AUTHORITY`、
`VISIBILITY-AUTHORITY`、`LINKAGE-RELATION-SOURCE`和`DEPENDENCY-SLICE`事项共同承接；§5不重复
新增owner ID，也不选择最终是pure factory、prevalidated payload material还是service-side
candidate/lookup redesign。

### 5.6 Current disabled reachability 与 future activation条件

| Runtime point | Current I05 state | Exact implication |
|---|---|---|
| safe registration | 没有canonical payload及finite Artifact event-to-I05 binding | 不得形成enabled I05 registration；Artifact producer family单独不足以arm slot |
| handler catalog | I05 optional slot disabled | 不存在可被transport调用的I05 handler；其他Consumer handler不得代填 |
| C-03 delivery | unreachable for I05 | broker收到相似Artifact event也不能伪装成I05 delivery；是否被其他owner处理不在本节裁定 |
| header/payload gate | unreachable | 不产生I05 `UnsupportedSchema`、`Rejected`或其他ephemeral receipt作为disabled结果 |
| assembler/service | unreachable | 不构造partial/control-only input，不调用application、repository、resolver或UoW |
| result/receipt/C-05 | unreachable | 不产生`ObservationConsumerResult`、receipt、ack/retry/dead-letter或transport evidence |
| startup with I05 required enabled | cannot satisfy totality | 必须通过既有startup failure surface拒绝activation；不得静默disable、安装generic decoder或报告partial success |

I05只有在以下条件同时成立后才可参与一次正常`register_all`：

1. 两项上游internal blocker闭合，形成唯一canonical payload、有限Artifact event/schema binding、encoder/decoder和typed header mapping。
2. payload与six control fields能够经header-first gate进入exact envelope，且完整I05 input可在不违反同步/no-I/O assembler签名的前提下构造；必要时先修订Step 06/07 owner与callable设计，而不是在worker补字段。
3. local reference、digest、purpose、visibility、linkage relation和least-authority dependency slice均有唯一owner、合法来源与冲突行为，producer不能提交local truth。
4. I05-specific result/error/recovery、stored/ephemeral receipt presence、commit certainty与C-05 action形成finite total mapper；probe后indeterminate有合法的no-completion处理边界。
5. validated registration、handler operation、producer、schema、private slot与config identity通过同一totality check，且prepare/arm失败能够revoke/join全部本次registration。
6. Step 09唯一`ConsumeArtifactEvidenceContextFlow`能够回指同一assembler/service/mapper链，且没有Artifact truth、evidence、retention、report handoff或external delivery反写旁路。

§5没有关闭上述任何条件。两项`open_upstream_internal`和七项`open_internal_affected`原样
保持；shared Consumer result/outbox/quarantine/indeterminate、recovery与Step09 handoff事项也不因
call chain清晰而自动关闭。

### 5.7 §5 stop review 与下一读取边界

| 检查项 | 结论 |
|---|---|
| 用户授权范围 | `pass`；用户已确认进入§5，本批只读取Step07 matching assembler/service、worker callback/registration/activation、least-authority worker与shared C-05边界；未读取/写入§6以后、I06~I09、S08-F/G、Step09、formal或实现代码 |
| startup registration | `pass at design-record level`；worker四项assignment、9个finite optional slots、single `register_all`、prepare/totality/arm及failure revoke/join已精确回指 |
| per-delivery exact chain | `pass at target level`；C-03 -> header-first -> exact decoder -> matching assembler -> matching service -> exact mapper -> C-05 -> registrar为唯一合法路径，无generic/default旁路 |
| callable signatures | `pass`；assembler、service、handler、registrar与worker activation均复用Step07 exact surface，没有新增trait、DTO、completion variant或transport port |
| capability boundary | `pass_with_affected_open`；entry/assembler/service/mapper/registrar的allowed/forbidden能力已逐项固定；完整input构造与least-authority service slice仍由既有affected承接 |
| current activation / reachability | I05 slot保持disabled；callback、delivery、decode、assembler、service、result、receipt和C-05均不可达，不伪造`UnsupportedSchema`或其他disabled-slot结果 |
| truth / no-write | `pass at design-record level`；callable存在不授权Artifact truth、evidence、retention、report handoff或external delivery写入，transport completion也不构成业务接受证明 |
| affected / blocker | 9项I05专属affected原样开放：2项`open_upstream_internal`、7项`open_internal_affected`；没有新增或关闭事项，也没有新增外部上游blocker |
| 当前协议计数 | 保持`34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`；`0/60`无条件complete；I05为`in_progress_S01-S05_with_affected_open`，不计入defined |
| formal / implementation / test / evidence | formal`03`继续frozen；实现、测试、scan、runtime evidence、commit、run_id、真实evidence alias与验收签署均`not_run_not_claimed` |
| 下一动作 | 立即停审；用户确认后只进入I05 §6，读取shared Consumer envelope/header schema、I05 §1~§5、Step06 I05 use-site及L1-artifact outbound envelope/event schema证据，只定义header authority、validation order与typed payload boundary |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I05_S01-S05_recorded_with_affected_open_waiting_user_before_I05_S06
```

未经用户明确确认不得进入 I05 §6；不得读取或写入 I05 §7以后、I06~I09、S08-F/G、
Step09~19、正式 `03`、任何 `04` 文件或实现代码。当前不需要提交。

该段为 I05 §5 historical checkpoint；current 状态由下方 §6 承接。

## 6. Header authority、validation order 与 typed payload boundary

本节只定义 I05 对 shared `ObservationInboundEventEnvelope<T>` 的字段权威、
header-before-payload admission 顺序、L1-artifact outbound envelope 到 I05 header 的
non-mapping，以及 `ArtifactEvidenceContextPayload` 的 current use-site 边界。它不定义
payload 业务字段、`ConsumeArtifactEvidenceContextInput` 的完整 struct / constructor / accessor、
request digest material、repository / UoW、result / error / action matrix 或 Step 09 函数级 flow。
下文 admission 是 future enabled slot 必须满足的目标契约；current I05 slot 仍然 disabled，
没有 runtime delivery、decode、receipt 或 transport action。

### 6.1 本批读取与权威顺序

| 顺序 | 输入 | 本批采用的事实 | 不得反向覆盖 |
|---:|---|---|---|
| 1 | `详细设计讨论流程_SOP.md` Step 08；`详细设计书写规范.md` §5.7 | Inbound Consumer 必须分开定义 shared envelope 与 typed payload；字段须回指上游 contract、系统派生或目标对象，缺失行为必须明确 | 不用 logical type name、topic、subscriber direction 或旧 formal 表格代替 concrete schema / binding |
| 2 | shared protocol carrier §6.9 | 十字段 generic envelope、`SourceEventRef` owner、header-first 顺序、source-version relation、trusted actor 外置和 exact decoder 约束 | I05 不复制 envelope、header wrapper、receipt 或 actor 字段，不创建兼容 alias |
| 3 | I05 §1~§5 | Artifact truth / no-write 边界、唯一 I05 operation、九项 affected、exact call chain 与 current disabled reachability | §6 不把目标 call chain 写成当前 callback、payload、input 或 action 已存在 |
| 4 | current Step 06 I05 use-site | `ObservationInboundEventEnvelope<ArtifactEvidenceContextPayload>`、六个 Consumer control fields及 matching input row | use-site 不能证明 payload owner、wire fields、encoder、event binding 或 complete input constructability |
| 5 | L1-artifact Step 08 outbound envelope、八个 payload、committed-change map 与 topic-neutral registry | Artifact 拥有的 event kind/name/version、relay/snapshot、subject/cursor/trace、typed payload及其 truth lifecycle | 不把 Artifact outbound type直接 cast 为 Observability inbound type，不复制 Artifact truth owner |
| 6 | affected inventory、calibration flow 与项目台账 | 当前 blocker、计数、historical/current checkpoint 和单小节停审纪律 | 不关闭 affected，不生成 formal、实现、测试、runtime evidence 或验收事实 |

权威顺序先回答“谁可以提供某字段”，再回答“何时允许解析该字段”。任何字段即使在
Artifact outbound envelope 中存在同名或近似值，也必须先有 positive finite binding 和逐字段
typed mapping，才能进入 I05 shared header；wire bytes、字段相似度或 primary consumer 文本都不能
倒置该顺序。

### 6.2 Shared header 字段 authority

I05 只复用 S08-B 的唯一 generic envelope，字段集合固定为：

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

九个 header / correlation 字段、typed payload 与 C-03 trusted actor 必须保持三个物理分离的
authority 区域。payload 不得补 header，header 不得携带本地业务结果，actor 不得由任一 wire
字段自报：

| envelope field | canonical admission source | I05 exact check | forbidden derivation / fallback |
|---|---|---|---|
| `consumer_name` | startup totality 已验证的 static I05 slot 与 registration-owned operation | 必须精确等于 `ObservationInboundConsumerName::ConsumeArtifactEvidenceContext` 和 `T::CONSUMER` | Artifact `event_kind` / `event_name`、topic key、payload type name、handler name或default Consumer |
| `source_event_ref` | authenticated Artifact event binding 提供的上游 event 稳定 body-free identity；本地只按 canonical `SourceEventRef` wrapper解析 | 必填、语法有效、与当前 finite producer-event registration 同属一条 binding；不是 delivery attempt | `relay_item_ref`、`payload_snapshot_ref`、topic、cursor、trace、dedup、offset或本地 ID mint |
| `source_ref` | finite binding 规范化出的 typed Artifact source identity | producer、具体 event 与 source relation 必须逐项匹配 registration | outbound `subject_ref`直接 cast、payload中的任意 Artifact ref、truth anchor、ref prefix、topic或 actor |
| `source_version_ref` | binding owner 可选提供的 typed same-source version | `Some` 时 nested producer 与 source 必须分别等于 Artifact 和当前 `source_ref`；本节不定义大小比较 | `ArtifactTruthCursor`、payload内 `ArtifactVersionRef`、event/schema version、时间、offset、row version或arrival order |
| `producer_family` | authenticated static registration，不来自 producer 自报 payload | 必须精确为 `ObservationProducerFamily::Artifact`、等于 `T::PRODUCER` 且与 I05 slot一致 | topic namespace、credential label、source-ref前缀、event name或payload字段 |
| `schema_version` | I05 positive producer-event binding 中的有限 payload schema / discriminator registration | 必须在 payload decode 前命中当前 event 对应的唯一 supported I05 schema | `ArtifactEventSchemaVersion`直接 cast、current/latest/V1 default、多decoder试探或payload sniffing |
| `dedup_key` | binding owner声明的稳定 Consumer logical idempotency identity | 必填且只保留 dedup 角色；本节不定义 reservation key 或 request digest | relay/snapshot/source event/cursor/trace、delivery attempt、payload hash、arrival time或随机生成值 |
| `occurred_at` | authenticated binding 提供并按 shared contract 规范化的 event occurrence observation | 必填 typed value；只表达观察到的上游发生时间，不提供 source ordering 或 truth version | local clock、delivery/retry time、relay publication time、cursor、schema version或outbox append time |
| `trace_ref` | binding 按唯一 shared correlation contract 无损提供的可选 body-free ref | `Some` 时保持 `TraceCorrelationRef` 角色；`None` 不补值，也不授权 producer / actor | Artifact `core_trace_id`自动 cast、trace record ref、source event、dedup或多个候选拼接 / fallback |
| `payload` | exact event + schema registration 选择的唯一 canonical `ArtifactEvidenceContextPayload` decoder | 只在全部 header gate 通过后解码一次，并满足 `T::CONSUMER` / `T::PRODUCER` | 八个 Artifact payload任选或并集、generic map、raw bytes、untagged enum、第二decoder或header字段重复提交 |

`ActorSafeRef` 不属于 envelope。它只来自 C-03 authenticated worker binding，并作为 matching
assembler 的独立参数传入；payload/header 中的 actor、tenant、role、credential、consumer scope
或 producer identity 即使存在也不生效。Authenticated Artifact family 只证明调用来自已注册
namespace，不证明 payload 内容、Artifact truth、evidence真实性、local visibility或linkage可接受。

### 6.3 固定 validation order 与 failure ceiling

Future I05 slot 只有在两项上游 blocker 及 startup totality 前置条件关闭后，才允许按以下
顺序处理一份 bounded delivery；adapter、worker、decoder 和 assembler 均不得重排：

1. Registrar 依据已认证、已通过 totality 的 finite catalog 选择唯一 I05 private slot；未命中或
   slot disabled 时不构造 callback，也不产生一个伪 runtime result。
2. Exact I05 handler 校验 slot、handler operation 和 C-03 operation 三者相等；此时不读取
   payload bytes，不按 Artifact event name、topic或字段形状重新选择 Consumer。
3. 解析 header framing 及 producer、source-event、source、optional source-version、schema、
   dedup、occurred-at、optional trace；malformed / missing required field 在 payload decode 前停止。
4. 校验 `consumer_name == T::CONSUMER == ConsumeArtifactEvidenceContext`、
   `producer_family == T::PRODUCER == Artifact`，并与 authenticated static registration逐项相等。
5. 要求具体 Artifact event、I05 operation、normalized source relation、payload schema / discriminator
   已存在 positive finite binding；没有 positive row 时不得用 subscriber direction 或候选排除法接入。
6. `source_version_ref=Some` 时校验其 producer/source 与 envelope 精确相等；不把 Artifact cursor、
   payload version ref、时间或字符串顺序解释为 same-source comparator。
7. 校验当前 binding 支持该 `schema_version`，只选择一个 exact
   `ArtifactEvidenceContextPayload` decoder；unknown / unsupported schema 不尝试 current/latest、
   第二 payload、generic enum 或 compatibility fallback。
8. Decoder 必须完整成功后，才调用 `ObservationInboundEventEnvelope::try_new` 形成一个 typed
   envelope；partial payload、unknown-field bag、raw body或 producer 自报 actor 均不得进入该值。
9. 只有 typed envelope 完整成立，handler 才把 C-03 trusted `actor_ref` 与 envelope 一并交给
   `ObservationInboundInputAssembler::consume_artifact_evidence_context`；assembler失败后不得调用
   service、canonical reservation、repository、resolver或UoW。

| failure point | last permissible observation | before later result/action mapping, explicitly forbidden |
|---|---|---|
| slot / operation / producer mismatch | finite registration-safe operation / family code | fallback到其他Consumer、generic handler、payload decode或application调用 |
| malformed / missing header | redacted field class 与 finite validation code | raw frame hash、payload保存、dedup reservation、assembler/service调用或ref值日志 |
| positive producer-event binding缺失 | 已认证 family 与已安全解析的header presence | 自建adapter、全订阅八事件、按event名称/recipient方向接入或构造aggregate payload |
| source / source-version relation不成立 | typed mismatch classification | cursor/time/string比较、覆盖source、改用payload ref或产生第二event identity |
| schema未注册或不支持 | validated header 与 unsupported schema classification | decode payload、尝试另一schema/decoder、reserve、local write或current-version fallback |
| canonical typed decode失败 | registered event/schema 与 redacted decode class | partial DTO、generic map、raw bytes/body/error value持久化或进入digest/UoW |

本节不选择上述 failure 的 `ObservationConsumerResult`、stored / ephemeral receipt、recovery class
或 C-05 action。特别是 current I05 slot disabled 时根本没有 delivery，不能用
`UnsupportedSchema`、`Rejected` 或 `NoOp` 模拟 disabled；future slot 已合法 enabled 后，某个
已解析 header 的 unsupported schema 分支如何映射 receipt/action，仍须由后续 I05 result/error/action
小节形成 exact total matrix。

### 6.4 Artifact outbound envelope 到 I05 header 的 non-mapping

L1-artifact current outbound envelope 是 Artifact publisher/storage contract：

```text
event_kind
event_name
schema_version
relay_item_ref
payload_snapshot_ref
subject_ref
source_cursor
core_trace_id
topic_key
payload
```

它不是 `ObservationInboundEventEnvelope<T>` 的同构前身。以下表只记录 current 不可直接映射，
不预先决定 future adapter 必须选择哪个 Artifact 字段：

| Artifact outbound field / absence | tempting I05 target | current diagnosis | future binding obligation; absent now |
|---|---|---|---|
| `event_kind` / `event_name` | `consumer_name`或payload discriminator | 标识八个 Artifact truth-change event；I05 name 标识 Observability operation，枚举与生命周期不同 | positive finite `event kind + name -> I05 slot + exact payload adapter`；不得按名称或recipient文本选择 |
| `schema_version: ArtifactEventSchemaVersion` | `schema_version: SchemaVersion` | producer event wire version与normalized I05 payload schema由不同owner声明 | 逐event兼容表、typed conversion和unsupported规则；不得cast、string copy或默认V1/current |
| `relay_item_ref` | `source_event_ref` | relay queue item是publication lifecycle identity，不自动等于跨项目source event identity | owner证明稳定、body-free、重放不变且无损的event identity映射；当前不能假定相等 |
| `payload_snapshot_ref` | `source_event_ref`或`source_ref` | 指向immutable serialized outbound snapshot，不是业务source或Consumer event identity | 只能作为producer内部snapshot lineage；若binding需引用必须另行声明typed role，不能泄漏storage identity |
| `subject_ref: Option<ArtifactTruthAnchorRef>` | `source_ref` | optional Artifact truth-anchor union不是Observability source identity；Review/DerivedView还可能为None | 每个 admitted event 给出保留union tag的 subject-to-source规则及None行为；不得取payload第一个ref补值 |
| `source_cursor: ArtifactTruthCursor` | `source_version_ref` | accepted truth cursor不是 shared producer/source-qualified version | owner提供 typed same-source mapping/comparator及缺失规则；不得stringify、按数值/时间比较或当dedup |
| `core_trace_id: TraceId` | `trace_ref` | distributed trace id与 `TraceCorrelationRef` 是不同 public type / role | correlation contract显式声明无损映射、redaction和None规则；不得因“都是trace”而cast |
| `topic_key` | consumer / producer / source / schema selector | topic-neutral routing key仍是locator，不是协议truth或identity | 只由private config/runtime binding消费；不得进入payload、digest、source identity或业务判断 |
| outbound envelope无dedup字段 | `dedup_key` | current producer contract没有声明I05 logical idempotency identity | binding owner给出stable material、retry/replay invariance与collision边界；不得复用relay/source/cursor/trace |
| outbound envelope无occurred-at字段 | `occurred_at` | current envelope没有canonical occurrence observation | producer/binding owner声明唯一source和规范化规则；不得使用publish/arrival/local clock或cursor |
| outbound envelope无producer family字段 | `producer_family` | Artifact namespace由authenticated registration拥有，不应信任wire自报 | registration固定为Artifact并与concrete event binding相等；不得从topic或type name推导 |
| outbound envelope无trusted actor字段 | assembler `actor_ref` | wire producer与本地authenticated actor是两个authority | C-03继续独立提供 actor projection；不得从subject、payload、trace或credential label构造 |

八个 outbound payload 中的字段同样不补 shared header。例如
`ArtifactLineageChangedPayload.source_version_ref: ArtifactVersionRef` 是 Artifact lineage 的
业务版本节点，不是 `ObservationSourceVersionRef`；`ArtifactTraceAvailablePayload.trace_record_ref`
不是 `TraceCorrelationRef`；`truth_anchor_ref`、`consumable_ref`、`relay_item_ref` 和
`payload_snapshot_ref` 也都不能成为 `SourceEventRef`。这些禁止项保持 typed role，不通过
`BodyFreeRef`、string、digest或prefix擦除差异。

上述 adapter 缺口是 `S08-E-I05-PRODUCER-EVENT-BINDING-01` 的组成部分，不新增同义
header-mapping affected。关闭该 blocker 必须同时给出 positive event set、逐event payload
adapter、十字段中所需 header 来源、类型转换、缺失 / 冲突行为、重放稳定性和版本兼容；只新增
topic subscription、recipient row、同名 type alias 或一个默认 schema 常量均不够。

### 6.5 Typed payload use-site 与 current blocker

current Step 06/07 只能证明下面的 application callable use-site 存在：

```rust
// Use-site only; no canonical upstream declaration currently exists.
ObservationInboundEventEnvelope<ArtifactEvidenceContextPayload>
```

当前未找到 `ArtifactEvidenceContextPayload` 的 canonical module / owner、Rust struct、wire fields、
required / optional / unknown-field规则、producer factory、encoder、schema/discriminator registration、
event compatibility matrix或retirement policy。因此 §6 不在 Observability 本仓创建同名 DTO、alias、
compat wrapper、untagged enum或generic field bag。

| required canonical surface | current evidence | admission consequence / closure owner |
|---|---|---|
| unique payload owner and module | 名称只出现在 Observability use-site；L1-artifact只声明八个具体 outbound payload | `S08-E-I05-PAYLOAD-SCHEMA-01`保持`open_upstream_internal`；不得本地反向定义owner |
| finite field schema and authority | 没有可回指producer truth的I05-specific字段集合 | 不能从Step06四个application字段、两个相近payload或八事件字段并集反推wire schema |
| producer factory / encoder | 没有accepted committed change / immutable snapshot到该payload的唯一构造入口 | Consumer、publisher或adapter不得重读current truth拼装；owner必须证明body-free immutable source |
| event + schema registration | 八事件各有独立payload，但没有任何positive event-to-I05 row | decode前fail closed；由`S08-E-I05-PRODUCER-EVENT-BINDING-01`关闭，不多decoder试探 |
| compatibility / unknown handling | 没有版本矩阵、upgrade/downgrade、unknown variant或retirement规则 | 不接受current/latest fallback、宽松unknown fields、string enum或catch-all payload |
| payload-to-input propagation | Step06只有family row和六control fields；concrete constructor/accessor未闭合 | 由`S08-E-I05-CONTROL-FIELD-SOURCE-01`继续承接；留到§7审查，不在§6伪造complete input |

Step 06 的四个业务字段也不能直接升级为 producer payload：

| Step 06 I05 candidate | why it is not a current wire field | authority-preserving direction |
|---|---|---|
| `artifact_evidence_ref: GovernanceArtifactEvidenceReference` | 完整local object含Observability identity、snapshot state、state、gap/visibility reason；Artifact无构造authority | future payload最多提供owner-approved最小 Artifact typed observation；本地reference由后续合法factory/relation形成 |
| `digest_summary: DigestSummary` | semantic material/profile/order及incoming-vs-local owner仍未闭合，不是shared request digest | 上游canonical digest或本地canonicalizer必须唯一选择，并定义absence/conflict；不得hash raw body/event |
| `evidence_purpose: EvidenceConsumerPurpose` | 是Observability下游消费意图，不是Artifact truth或event事实 | 由本地finite operation/binding policy产生或由明确上游 observation经typed mapper收窄；不得按event name默认 |
| `visibility: VisibilitySurface` | 是本地disclosure/result surface，依赖policy、gap与degraded state | 在service/result/view mapping阶段由本地authority产生；producer不得提交，absence不得解释为Visible |

Future canonical payload 必须 body-free、event-specific、字段最小且逐字段由 Artifact 或明确的
cross-project contracts owner合法拥有；它不能重复 shared header，不能携带 artifact/evidence body、
content、credential、locator、raw trace、verdict、signoff、report readiness，也不能让producer提交
Observability local identity、state、gap、purpose、visibility、result或真实 evidence alias。

### 6.6 Affected routing 与 current reachability

| evidence gap | existing owner | §6 disposition |
|---|---|---|
| canonical typed payload、field authority、encoder与compatibility缺失 | `S08-E-I05-PAYLOAD-SCHEMA-01` | 保持`open_upstream_internal`；没有创建local DTO或alias |
| positive event set、outbound-to-header adapter、schema/source/correlation/dedup/time mapping缺失 | `S08-E-I05-PRODUCER-EVENT-BINDING-01` | 保持`open_upstream_internal`；header mapping不另建重复ID |
| shared header到I05 concrete input六control fields的constructor/accessor传播未闭合 | `S08-E-I05-CONTROL-FIELD-SOURCE-01` | 保持`open_internal_affected`；§7再做input constructability审查 |
| local reference、digest、purpose、visibility、linkage relation与service capability仍未闭合 | 其余六项I05 local affected | 状态不变；§6不提前定义业务字段、lookup、UoW或result |

因此 I05 九项专属 affected 仍为两项 `open_upstream_internal` 与七项
`open_internal_affected`，没有新增或关闭项，也没有发现第三个独立上游 blocker。Current slot仍
disabled：callback、C-03、header gate、payload decoder、typed envelope、assembler、service、
reservation、result、receipt与C-05都不可达；不存在可记录为runtime schema rejection的真实调用。

### 6.7 §6 stop review 与下一读取边界

| 检查项 | 结论 |
|---|---|
| 用户授权范围 | `pass`；用户已确认进入§6，本批只读取shared Consumer envelope/header、I05 §1~§5、Step06 I05 use-site及L1-artifact outbound envelope / payload / registry；未读取或写入§7以后、I06~I09、S08-F/G、Step09、formal或实现代码 |
| shared header authority | `pass at target-contract level`；十个envelope字段、C-03 actor外置、逐字段authority与forbidden fallback已固定，没有复制I05专属envelope或wrapper |
| validation order | `pass at target-contract level`；static slot -> operation/header -> positive binding -> source/version -> supported schema -> exact decoder -> typed envelope -> matching assembler顺序已固定 |
| Artifact outbound mapping | `not closed / fail closed`；outbound envelope不是I05 shared envelope，relay/snapshot/subject/cursor/trace/topic及缺失dedup/time/actor均不能直接映射 |
| typed payload | `not closed`；只保留`ArtifactEvidenceContextPayload` use-site，没有虚构struct、fields、factory、encoder、registration或compatibility |
| current activation / reachability | I05 slot保持disabled；没有delivery、decode、assembler、service、result、receipt或C-05，不用`UnsupportedSchema`、`Rejected`或`NoOp`伪造disabled结果 |
| truth / no-write | `pass at design-record level`；header/payload contract不授权Artifact truth、evidence body、local visibility、retention、report handoff或external delivery写入，I05不反写Artifact truth |
| affected / blocker | 九项I05 affected原样开放：2项`open_upstream_internal`、7项`open_internal_affected`；没有新增或关闭项，没有新增上游blocker |
| 当前协议计数 | 保持`34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`；`0/60`无条件complete；I05为`in_progress_S01-S06_with_affected_open`，不计入defined |
| formal / implementation / test / evidence | formal`03`继续frozen；实现、测试、scan、runtime evidence、commit、run_id、真实evidence alias与验收签署均`not_run_not_claimed` |
| 下一动作 | 立即停审；用户确认后只进入I05 §7，读取Step06 I05 concrete input / 六control fields、Step07 matching assembler及reference / resolver / policy capability、§6 payload与binding缺口和I04 §7粒度模板，只审查input constructability、field provenance与constructor/accessor boundary |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I05_S01-S06_recorded_with_affected_open_waiting_user_before_I05_S07
```

未经用户明确确认不得进入 I05 §7；不得读取或写入 I05 §8以后、I06~I09、S08-F/G、
Step09~19、正式 `03`、任何 `04` 文件或实现代码。当前不需要提交。

该段为 I05 §6 historical checkpoint；current 状态由下方 §7 承接。

## 7. Concrete input shape、field provenance 与 constructor/accessor boundary

本节只审查 `ConsumeArtifactEvidenceContextInput` 的 application 内部构造资格、六个 shared
Consumer control fields、四个 Step 06 候选业务字段及其 authority 分层。它不定义 Step 09
函数流、reservation、UoW、stored result、receipt、recovery 或 C-05 action，也不修改
`ObservationInboundEventEnvelope<T>`、`ArtifactEvidenceContextPayload` 的 owner。所有当前
无法闭合的字段都保持 affected-open；不以 control-only struct、generic map 或默认值伪造完整
input。

### 7.1 本批读取与审查问题

| 顺序 | 输入 | 本节使用方式 | 不得反向覆盖 |
|---:|---|---|---|
| 1 | `详细设计讨论流程_SOP.md` Step 08、`详细设计书写规范.md` §5.7 | 检查 Consumer input 是否有独立 schema、字段来源、构造入口、错误边界与二级类型闭口 | 不用 family-level 总表宣称 concrete input 已完成 |
| 2 | Step 06 `application_input_assembly_r06_8a.md` | 承接 Consumer 六字段、`from_assembled` 规则、I05 matching assembler 和现有 input use-site | Step 08 不自行新增第二个 input owner 或改写 Step 06 family contract |
| 3 | Step 07 `trait_port_adapter_contracts.md` | 检查 matching assembler/service、resolver、relation repository 的实际输入和 least-authority 边界 | callable/port 存在不等于字段可构造或 producer binding 已存在 |
| 4 | I05 §1~§6 与 affected inventory | 承接 Artifact truth boundary、typed payload 缺口、header validation 顺序和九项 affected | 不把历史 checkpoint 的候选字段、`done/pass` 或 disabled slot 当作 current contract |
| 5 | I04 §7 | 只作为逐字段 input constructability、constructor/accessor 和 stop review 的粒度参考 | 不复制 Governance truth、类型或事件绑定 |

本节实际需要回答以下问题：

1. `ConsumeArtifactEvidenceContextInput` 是否已经有可实例化的完整字段集合？
2. 六个 control fields 是否分别能回指唯一 authority，并能从 header/context 无损传播到 input？
3. `artifact_evidence_ref`、`digest_summary`、`evidence_purpose`、`visibility` 是否处于
   同一输入层，还是混入了本地 reference、policy 和 response surface？
4. `from_assembled`、private field、service accessor 和 consuming decomposition 的边界是否
   足以阻止 entry、producer 或 resolver 越权构造 input？
5. 任一字段缺失、漂移或 authority 冲突时，最晚在哪个阶段停止，且是否在 service/UoW 前
   保持 zero mutation？

### 7.2 Concrete input authority 与当前可构造性

`ConsumeArtifactEvidenceContextInput` 的目标角色仍是 application 内部、process-local、按值
移动的 matching service input。合法路径只有：

```text
C-03 authenticated worker binding
  -> finite I05 slot / header validation
  -> one canonical typed payload decode
  -> matching ObservationInboundInputAssembler
  -> ConsumeArtifactEvidenceContextInput
  -> matching ObservationInboundEventService
```

它不是 wire DTO、Artifact outbound envelope、持久化 row、resolver response、transport receipt、
evidence alias、report handoff 或 Artifact truth。entry 不能直接构造它；producer 不能提交其
本地 state、identity、gap/reason 或 visibility；assembler 不能调用 repository、resolver、clock、
ID generator 或任何外部 adapter。

Step 06 的 Consumer family contract 给出以下六个物理字段前缀：

```rust
context: ObservationOperationContext,
request_digest_candidates: RequestDigestCandidates,
source_ref: ObservationSourceRef,
source_version_ref: Option<ObservationSourceVersionRef>,
schema_version: SchemaVersion,
occurred_at: ObservedAt,
```

这六个字段只能作为目标前缀，不能在当前状态单独组成合法 I05 input。当前 constructability
矩阵如下：

| 问题 | current answer | 设计后果 |
|---|---|---|
| 六个 control fields 的类型和 family 位置 | 可定位；来自 Step 06 Consumer family contract | 可固定角色、来源和 invariant；不能据此发布完整 I05 struct |
| canonical `ArtifactEvidenceContextPayload` 字段集合 | 不可定位；目前只有 use-site | 不发布完整 operation-field schema、wire-to-input mapper 或可调用完整 constructor |
| Artifact event 到 I05 的 positive binding | 不存在 | header 或 payload 在绑定前 fail closed；不选择候选 event |
| `artifact_evidence_ref` 的本地完整对象构造 | 不可证明；producer没有本地 identity/snapshot/state authority，resolver只接收完整 local ref | 不把 producer ref 直接当作 local reference；不在 assembler 临时 mint |
| `digest_summary` 的唯一 semantic authority | 不存在；候选 Artifact payload没有该字段，profile/material/order未闭合 | 不生成 digest candidate，不复制 reference 的 optional digest，不使用默认 digest |
| `evidence_purpose` 的可信来源 | 不存在；它是本地下游消费意图 | 不由 event name、Artifact state、产品名或缺失值推导 |
| `visibility` 的输入资格 | 不成立；它是本地 response/disclosure surface | 不进入 producer-facing payload 或当前 constructor；由后续 local policy/result mapper 产生 |
| linkage 必需的 `projection_ref` 与 `consumer_scope` | current input use-site 没有，Step 07 没有 I05-specific source | 不能证明唯一 linkage candidate、relation lookup 或 replay relation；保持 affected |
| 当前 I05 input 是否 implementation-ready | 否 | 保留 typed use-site 和目标边界，但不声明完整 struct、factory 或 accessor API |

“不发布”不是删除最终业务语义。它表示当前上游 schema、binding、local reference factory 和
relation selector 尚未同时成立；若只创建一个六字段 input，会把任何合法 header 误认为拥有
I05 evidence context，绕过 §6 的 payload gate。

### 7.3 六个 Consumer control fields 的 authority 与传播

`ActorSafeRef` 不计入这六个物理字段。它由 C-03 authenticated worker binding 独立提供，进入
`ObservationOperationContext` 的 trusted actor projection；payload/header 中的 actor、tenant、
credential、role 或 producer self-claim 均无效。

| input field | 唯一 authority | I05 exact propagation | constructor-time invariant | 禁止替代 |
|---|---|---|---|---|
| `context` | application-private `ObservationOperationContextFactory::for_inbound_event` | 由 fixed I05 operation、trusted actor、validated dedup、source event identity、producer/source relation、optional trace 与同一 digest candidate 一次构造 | operation 必须是 `ConsumeArtifactEvidenceContext`；event identity 的 consumer/producer/source 必须精确匹配 I05/Artifact/header | entry-side context、payload actor、topic、route string、Artifact subject/state、post-build setter |
| `request_digest_candidates` | application-private `ObservationDigestCanonicalizer::request_candidates` | 仅在 header、canonical payload、redaction ceiling 和 I05 material 全部闭合后计算一次；`context` 复制同一候选集的 write digest | `context.request_digest() == candidates.write_digest()`；不得在 constructor 重编码或切换 profile | raw envelope/body hash、transport offset、debug/serde hash、重复计算、空/default digest |
| `source_ref` | shared envelope 的 typed source relation 加有限 Artifact producer binding | 无损复制已认证的 `ObservationSourceRef`，不把 source event、subject 或 truth anchor 混为 source ref | producer/source relation 必须属于 I05 positive binding；source drift 在 input 前拒绝 | `truth_anchor_ref` cast、subject、topic、actor、字符串前缀或 payload 任意 ref |
| `source_version_ref` | shared envelope 的 typed optional source-version relation | `Some` 时保留 producer/source-qualified typed value，并与 `source_ref` 逐字段核对 | producer 与 source 必须和 envelope 精确一致；不在 constructor 比较 cursor/time/string 顺序 | Artifact truth cursor、schema version、arrival time、row version、offset |
| `schema_version` | I05 finite schema/discriminator registration | header-first 阶段命中一个 supported schema 后原样传递；未注册或不支持时不解码 payload | 只能是 exact registered I05 slot value；不由 payload sniff 或 latest fallback 选择 | `ArtifactEventSchemaVersion` cast、`V1`/current 默认、第二 decoder、宽松 unknown field |
| `occurred_at` | authenticated Artifact binding 提供的 event occurrence observation | typed 校验后原样传入 local observation；不参与 source ordering、request digest 或 state transition time | 值必须来自绑定的 occurrence source；缺失或冲突时不构造 input | arrival/delivery/retry time、local clock、cursor、outbox append time、adapter response time |

六个字段之间必须保持以下关系：`context` 只持有同一 delivery 的 operation/event/actor/correlation
身份；`request_digest_candidates` 是请求幂等材料，不是 Artifact semantic digest；`source_version_ref`
只表达同一 producer/source 的可选版本关系；`occurred_at` 只表达 observation time。任何字段
都不能由另一个字段的字符串、时间或 digest 角色推导。

### 7.4 四个业务字段的 provenance 与输入层处置

Step 06 当前 row 列出的四个字段不在同一 authority 层。逐项裁定如下：

| candidate field | current role | 合法 future source | current input disposition | 缺失/冲突行为 |
|---|---|---|---|---|
| `artifact_evidence_ref: GovernanceArtifactEvidenceReference` | Observability 本地完整 body-free reference，含 local ID、snapshot state、state、gap/reason 等 | Artifact 只能提供 canonical 最小 family + external safe ref 或其他明确授权的 source observation；本地 service/factory/relation 才能形成完整 reference | **不可作为当前 producer-facing complete field**；保留为目标语义，等待 local construction seam；不由 assembler 通过 I/O 补齐 | upstream ref 缺失、family mismatch、snapshot missing、duplicate 或 version drift 时 fail closed；不得反序列化 producer 的完整 local object、临时 mint alias 或按 prefix/digest 绑定 |
| `digest_summary: DigestSummary` | body-free semantic digest；与 `request_digest_candidates` 完全不同 | 只能选择一个 upstream canonical digest owner，或一个 local canonicalizer 对授权 body-free material 按固定 profile/material/order 生成 | **当前不进入可实例化 constructor**；直到 semantic authority、absence/conflict 矩阵和 single-computation owner 闭合 | absent、profile mismatch、与 reference optional digest 冲突时不复制、覆盖、置空或任选；不 hash body/raw event/transport |
| `evidence_purpose: EvidenceConsumerPurpose` | Observability 下游消费意图，进入 linkage relation/identity | 本地 finite operation/binding policy，或明确 upstream-owned observation 经 total typed mapper 收窄 | **不接受 producer 自选值**；只有明确 mapper/policy 后才能进入 input或 service-side derived context | 未注册组合、family/purpose/scope 不兼容或来源不可信时 typed reject；不按 event name、state、产品名或缺失默认 |
| `visibility: VisibilitySurface` | 本地 response/disclosure surface，依赖 policy、gap/degraded 和 target scope | local visibility policy/result/view mapper；必要 source 是 committed local decision/gap/scope | **移出当前 inbound input target**；不作为 Artifact payload 字段或 assembler 参数 | policy/source 不完整时保持 not-visible/degraded 或 typed error；不得默认 `Visible`、absence-as-visible 或以 Artifact state 授权 |

特别地，`visibility` 不是 `EvidenceConsumerScope`。`EvidenceConsumerScope` 是 relation lookup
所需的 typed consumer/scope/purpose 输入，而 current I05 row 没有 `projection_ref` 或
`consumer_scope`。因此不能以 `visibility` 代替 scope，也不能从第一条 projection、产品名、
purpose 或 Artifact ref 推导 scope。

### 7.5 Local reference、digest 与 linkage 的构造闭环

当前 `GovernanceArtifactEvidenceReference` 的目标字段和 factory 需要本地 authority：

```text
boundary_ref_id
+ reference_family
+ external_safe_ref
+ reference_snapshot_state_ref
+ local state / gap / visibility-reason
```

`GovernanceArtifactEvidenceResolver::resolve_governance_artifact_evidence` 的现有 callable 只
解析一个已经完整的 local reference；它不是 `ArtifactSourceRef -> GovernanceArtifactEvidenceReference`
factory。`ReferenceMaintenanceRepository::find_current_snapshot_by_subject` 又要求完整的
typed subject selector，当前没有 approved payload-to-subject mapper。assembler 是同步、I/O-free
的，因此不能通过 resolver、repository、ID generator 或 clock 在 `from_assembled` 前临时补齐。

Step 06 的 `EvidenceLinkage::candidate(...)` 至少要求：

```text
EvidenceLinkageRef
+ AuditProjectionRef
+ GovernanceArtifactEvidenceReference
+ EvidenceConsumerPurpose
+ DigestSummary
```

Step 07 的 `find_linkage_by_relation(...)` 还要求：

```text
projection_ref + boundary_ref + purpose + consumer_scope
```

当前 I05 use-site 只有 `artifact_evidence_ref + digest_summary + evidence_purpose + visibility`，
无法证明创建唯一 candidate、读取 sole relation、重放同一 semantic relation 或完成 scope
一致性检查。`BodyFreeLinkagePolicy` 只能验证已加载的 typed relation 是否满足 body-free invariant，
不负责产生 reference、projection、scope 或 public visibility decision。

因此 §7 不选择 primary landing、relation factory、UoW 或 result。必须由后续设计补齐：

| closure surface | 当前缺口 | 关闭条件 | 禁止 shortcut |
|---|---|---|---|
| local reference | ID/snapshot/state/reason owner 与 source-to-local mapping缺失 | Step 06/07 给出唯一 factory/lookup、missing/duplicate/version 矩阵和 fake/durable parity | producer完整反序列化、临时 mint、resolver隐式建对象 |
| semantic digest | profile/material/order、optional digest conflict与单一计算点缺失 | upstream canonical 或 local canonicalizer 二选一，并固定 absence/equal/conflict | raw/body/transport hash、复制 optional 值、双 owner |
| purpose | finite operation/binding policy 到 purpose 的 total map 缺失 | 给出 family/purpose/scope compatibility table 与不兼容错误 | producer任选、event-name推导、缺失默认 |
| linkage relation | `projection_ref`、`consumer_scope` 的 typed source 缺失 | 给出最小 selector/lookup 或修订 concrete input，并固定 sole-row/duplicate/version/scope行为 | visibility/ref prefix/第一行 projection/产品名替代 |
| dependency slice | wide inbound bundle 暴露多域写能力 | I05 private delegate 逐项回指 Step 07 port/Step 09 flow，并静态排除 evidence/retention/handoff/external writers | 把 wide bundle 当 owner、复制 trait、只靠文字 no-write |

### 7.6 Constructor 与 accessor boundary

Step 06 的通用规则要求每个 concrete input 只有一个由
`application::input_assembly` 调用的 crate-private atomic constructor。I05 当前只能记录
目标形状，不能把未命名的 operation fields 写成可编译占位：

```rust
impl ConsumeArtifactEvidenceContextInput {
    // Target shape only; not a current complete callable signature.
    pub(crate) fn from_assembled(
        context: ObservationOperationContext,
        request_digest_candidates: RequestDigestCandidates,
        source_ref: ObservationSourceRef,
        source_version_ref: Option<ObservationSourceVersionRef>,
        schema_version: SchemaVersion,
        occurred_at: ObservedAt,
        /* exact owner-approved operation fields remain unresolved */
    ) -> Result<Self, ApplicationError>;
}
```

该目标形状的硬约束是：

1. 只能由 matching assembler 在 typed envelope 和全部 header gate 通过后调用；entry、producer、
   resolver、repository、config 或 external adapter 无权调用。
2. 必须一次接收全部 family fields 与全部已闭合的 operation fields；不能先构造 control-only
   input，再通过 setter、`Option`、map 或第二次转换补业务字段。
3. 在零 I/O 条件下重校验 `context.operation_name()`、consumer/producer/source event identity、
   `context.request_digest() == request_digest_candidates.write_digest()`、optional source-version
   relation 和 exact schema registration marker。
4. 不重新编码、不切换 digest profile、不尝试第二 decoder、不从 header/payload 互相覆盖字段，
   不接受 raw body、credential、locator、actor self-claim、Artifact verdict 或本地 report/evidence
   alias。
5. 返回 `Err(ApplicationError)` 时不产生 reservation、UoW、local write、stored result、receipt
   或 C-05 action；当前 disabled slot 根本不调用该 constructor。

字段必须保持 private。当前不发布 public getter、`Default`、wire `Serialize/Deserialize`、跨操作
`From/Into` 或用于 retry 的 `Clone`。未来 service 只能获得 crate-private immutable borrows 或
一次 consuming decomposition：

| accessor category | target boundary | reason |
|---|---|---|
| control borrow | `context()`、`source_ref()`、`source_version_ref()`、`schema_version()`、`occurred_at()` 的 crate-private immutable selector | 保持 typed role；entry 不可读取/改写；不暴露 string/raw view |
| digest transfer | service 内一次按值移交 `RequestDigestCandidates` 的 consuming decomposition | candidates 不 Clone、不持久化、不由 entry 选择；borrow-only accessor 不能替代 atomic reservation 的按值转移 |
| operation-field transfer | canonical field set 闭合后，在同一 consuming decomposition 中逐项移出 | 防止第二 business carrier、generic payload accessor 或 service-side重构 |
| public surface | none | input 不是 public protocol、truth、receipt、evidence alias 或 response view |

由于 consuming decomposition 必须在返回类型中列出每个 operation field，当前不能发布完整
`into_parts(self)` 签名。只补六个 borrow getter 不能关闭
`S08-E-I05-CONTROL-FIELD-SOURCE-01`。

### 7.7 Field provenance 与 cross-field fail-closed matrix

| observed condition | 最晚合法阶段 | I05 input 结果 | 必须保留的边界 | 禁止恢复 |
|---|---|---|---|---|
| canonical payload、schema 或 positive event binding 缺失 | registration / typed decode 前 | 不构造 typed envelope 或 input；slot disabled/fail closed | upstream protocol gap | 任选 event、字段并集、默认 schema、generic map |
| producer/source/operation 不匹配 | static slot/header gate | 不调用 decoder、assembler 或 service | typed operation/producer mismatch | 改投其他 Consumer、payload override、字符串相似度路由 |
| source-version 与 producer/source 不一致 | validated header relation | 不构造 input | same-stream typed consistency | cursor/time/row-version 排序后选一方 |
| required control field 缺失或被 payload 覆盖 | header/input assembly 前 | no input、zero mutation | header authority failure | arrival time/cursor/topic/actor 补位 |
| Artifact ref 缺失、family mismatch或本地 reference authority 未闭合 | operation-field validation / local relation admission前 | 不形成完整 local reference；不进入 accepted service input | reference-authority affected | producer完整 local object、临时 alias、resolver隐式 factory |
| semantic digest absent、profile mismatch或冲突 | digest candidate / relation validation前 | 不生成 request candidates，不构造 input | semantic-vs-request digest separation | raw hash、复制 optional digest、空/default digest、任选一份 |
| purpose 未注册或 family/scope 不兼容 | local policy mapping前 | 不构造 accepted input | finite purpose policy | event name、Artifact state、产品名或缺失默认 |
| visibility source/policy 不完整 | local result/policy mapping前 | 不把 visibility 写入 inbound input；保持 not-visible/degraded 或 typed error | local disclosure authority | 默认 Visible、absence-as-visible、Artifact state授权 |
| `projection_ref` 或 `consumer_scope` 缺失 | linkage relation lookup前 | 不创建唯一 linkage candidate 或 sole relation | relation selector affected | visibility/purpose/ref prefix/第一行 projection替代 |
| context operation/event/producer不匹配 | atomic constructor | `Err(ApplicationError)`，无 partial input | application invariant | setter、rebuild context、更换 event identity |
| context digest 与 write candidate 不一致 | atomic constructor | `Err(ApplicationError)`，无 reservation/UoW | digest invariant | 重新 hash、选其他 candidate、覆盖 context |
| assembler尝试 resolver/repository/clock/ID generator | assembly boundary | 设计契约违规；不生成 input | application least-authority | 把 I/O 包成 validator 或从 current truth 补字段 |

所有上述失败发生在 reservation、UoW、stored result、receipt、C-05 completion 和任何 source
truth interaction 之前。具体 error/recovery/action 仍后置，不在 §7 选择公共 result variant。

### 7.8 §7 affected register 与 closure order

| ID | 状态 | §7 current finding | 关闭所需证据 | 当前禁止替代 |
|---|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | canonical payload、wire fields、encoder、registration 与 compatibility 仍缺失 | L1-artifact 或跨项目 contracts owner 的唯一声明与版本矩阵 | 本仓 DTO、alias、aggregate 或 fallback decoder |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | Artifact event 到 I05 的 finite adapter 与 source/header mapping 未闭合 | positive event set、typed adapter、source/version/dedup/time mapping | 全量订阅、任选 event、名称/字段匹配 |
| `S08-E-I05-REFERENCE-AUTHORITY-01` | `open_internal_affected` | local reference ID/snapshot/state/reason 与 source-to-local factory 未闭合 | 唯一 factory/lookup、absence/duplicate/version 与 fake/durable parity | producer反序列化、临时 mint、prefix/digest绑定 |
| `S08-E-I05-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | 六字段只有 family-level target，缺 I05 complete constructor/accessor proof | 完整 private struct、`from_assembled`、consuming decomposition、header一致性审计 | control-only struct、generic map、entry-side重构 |
| `S08-E-I05-DIGEST-AUTHORITY-01` | `open_internal_affected` | semantic digest owner/profile/material/order与冲突矩阵未唯一化 | upstream/local single owner 与 single-computation proof | raw/body/transport hash、复制 optional digest、双 owner |
| `S08-E-I05-PURPOSE-AUTHORITY-01` | `open_internal_affected` | purpose 没有可信 finite mapper 和 scope compatibility | total typed mapper、family/purpose/scope matrix | producer任选、event-name推导、缺失默认 |
| `S08-E-I05-VISIBILITY-AUTHORITY-01` | `open_internal_affected` | visibility 被错误放入 producer-facing row，local policy source未闭合 | local policy/result mapper 与 not-visible/degraded precedence | producer提交、默认 Visible、Artifact state授权 |
| `S08-E-I05-LINKAGE-RELATION-SOURCE-01` | `open_internal_affected` | `projection_ref`、`consumer_scope` 无 I05 typed source | 最小 selector/lookup、sole-row与duplicate/version/scope矩阵 | visibility/purpose/ref prefix/第一行 projection |
| `S08-E-I05-DEPENDENCY-SLICE-01` | `open_internal_affected` | wide bundle 与 I05 least-authority subset 未形成可审计 private view | I05 private delegate，逐项回指 Step 07/09，静态排除下游 writers | wide bundle owner、复制 trait、文字-only no-write |

closure order 必须是：

```text
upstream payload/schema + producer binding
  -> six control-field concrete propagation
  -> local reference / digest / purpose authority
  -> projection + consumer-scope relation selector
  -> I05 private dependency slice
  -> complete input constructor/accessor
```

任一上游层未闭合，后层不能用实现猜测补齐；本节没有关闭任何 affected，也没有产生新的
外部上游 blocker。

### 7.9 §7 stop review 与下一读取边界

| 检查项 | 结论 |
|---|---|
| 用户授权范围 | `pass`；本批只读取 Step 06 I05 input/family contract、Step 07 matching callable与reference/relation capability、I05 §6 payload boundary及I04 §7粒度模板；未读取或写入I05 §8以后、I06~I09、S08-F/G、Step09、formal或实现代码 |
| concrete input | `not_closed`；六字段前缀可定位，但 canonical operation fields、payload binding与relation selector未闭合；不发布control-only或placeholder struct |
| six control fields | `pass_at_target_contract_level_with_affected_open`；authority、传播、constructor invariant与forbidden substitution已逐项固定，完整I05 accessor proof仍由`S08-E-I05-CONTROL-FIELD-SOURCE-01`承接 |
| four business fields | `not_closed`；reference/digest/purpose/visibility不在同一输入层；visibility移出producer-facing input，其他字段等待各自authority closure |
| linkage relation | `not_closed`；`projection_ref`与`consumer_scope`缺typed source，不能证明candidate/sole lookup/replay relation |
| constructor/accessor | `target_shape_recorded`；只有crate-private atomic constructor目标形状和immutable/consuming边界，未发布完整签名或public getter |
| assembler capability | `pass_at_boundary_level`；assembler保持同步、I/O-free、只返回完整input或error，不调用resolver/repository/clock/ID generator |
| current reachability | I05 slot仍disabled；没有合法 payload decode、complete input、assembler/service、reservation、result、receipt或C-05 runtime branch，不伪造disabled result |
| truth / no-write | `pass_at_design-record_level`；I05不拥有或反写Artifact truth，不持有body/content/credential/locator/verdict/signoff/report readiness/evidence alias |
| affected / blocker | 九项I05 affected原样开放：2项`open_upstream_internal`、7项`open_internal_affected`；本节没有新增或关闭项，没有新的上游 blocker |
| 当前协议计数 | 保持`34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`；`0/60`无条件complete；I05为`in_progress_S01-S07_with_affected_open`，不计入defined |
| formal / implementation / test / evidence | formal`03`继续frozen；实现、测试、scan、runtime evidence、commit、run_id、真实evidence alias与验收签署均`not_run_not_claimed` |
| 下一动作 | 立即停审；用户确认后只进入I05 §8，读取Step08协议结果/identity与digest相关标准、I04 §8粒度参考和当前I05 §1~§7，只审查semantic/request digest、identity分层与correlation boundary |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I05_S01-S07_recorded_with_affected_open_waiting_user_before_I05_S08
```

未经用户明确确认不得进入 I05 §8；不得读取或写入 I05 §9以后、I06~I09、S08-F/G、
Step09~19、正式 `03`、任何 `04` 文件或实现代码。当前不需要提交。

该段为 I05 §7 historical checkpoint；current 状态由下方 §8 承接。

## 8. Historical semantic/request digest、identity layering 与 correlation boundary

本节只审查 I05 的 request digest material、幂等与事件身份分层，以及 correlation metadata 的
来源、传播和禁止替代。它不把 Artifact semantic digest 当作 request digest，不创建第二个
canonicalizer，也不把当前 `ArtifactEvidenceContextPayload` use-site升级为已存在的 wire schema。
由于 §6~§7 已确认 canonical payload、finite Artifact event binding 和完整 input 仍未闭合，本节
固定公共 frame、排除集、identity 关系与 fail-closed 边界；未决 payload segment 不以默认字段、
空对象或候选 payload 拼接补齐。

### 8.1 本批读取与审查问题

| 顺序 | 输入 | 本节使用方式 | 不得反向覆盖 |
|---:|---|---|---|
| 1 | `详细设计讨论流程_SOP.md` Step 08、`详细设计书写规范.md` §5.6/§5.7 | 检查 Consumer request digest、identity、二级类型、actor、幂等与 correlation 是否逐字段可回指 | 不用 family-level row 或旧 formal summary 替代 I05 concrete record |
| 2 | Step 06 `application::digest`、operation context 与 idempotency owner | 承接 `DigestMaterialKind::InboundConsumerRequest`、v1 frame、`RequestDigestCandidates`、logical scope 与 inbound event identity | Step 08 不复制 digest value type、canonicalizer 或 reservation owner |
| 3 | Step 07 I05 assembler/service 与 atomic reservation port | 确认 candidate 只生成一次、context 只复制 write digest、service 按值移交 candidate | 不让 entry、infra adapter 或 replay path 重算 material |
| 4 | I05 §1~§7、I04 §8 粒度参考 | 复用公共结构、字段分层与 conflict/no-write 写法，替换为 Artifact producer 语义 | 不复制 Governance truth、event 名或上游字段 |
| 5 | L1-artifact outbound envelope、payload registry 与当前 blocker | 判断 Artifact event/source/schema/correlation 是否具备 I05 digest 所需的 positive binding | 不从 `relay_item_ref`、`payload_snapshot_ref`、`core_trace_id` 或 cursor 猜 I05 identity |
| 6 | `project_execution_ledger.md`、affected inventory、calibration flow | 维护当前恢复点、affected 分类和停审纪律 | 不关闭 affected，不写正式 `03`、实现、测试或 evidence 事实 |

本节必须回答：

1. I05 request digest 的唯一 owner、material kind、公共字段顺序和未决 payload segment 是什么？
2. 哪些值进入 request digest，哪些值必须排除，即使运行时可见？
3. `RequestDigest`、`DigestSummary`、Artifact optional digest 与 local reference identity 是否保持
   类型和 owner 隔离？
4. logical idempotency scope、secondary source-event identity、source/version relation 和未来
   local identity 是否能分别构造、比较与 fail closed？
5. `trace_ref`、Artifact `core_trace_id`、actor、dedup、occurred-at 与 source event 的来源和
   correlation 关系是否唯一，缺失/冲突时是否不做 fallback？
6. candidate 生成、reservation/replay 比较和后续 service 是否消费同一组 opaque candidates，
   且不产生第二次 hash 或从 current truth 重建？

### 8.2 Canonical material authority 与当前可构造性

I05 需要同时保持以下三类 material 的独立 owner 和 equality boundary：

| material | current owner | purpose | I05 current disposition |
|---|---|---|---|
| `RequestDigest` / `RequestDigestCandidates` | `application::digest::ObservationDigestCanonicalizer`；kind=`DigestMaterialKind::InboundConsumerRequest` | 对已通过 I05 header、payload、binding 与 redaction gate 的 inbound request 形成幂等/replay identity | 只在 canonical payload segment 和 positive Artifact binding闭合后生成；当前不构造 |
| `DigestSummary` | `contracts::refs` value carrier + 明确的 semantic-material owner | 表示 body-free evidence/reference/linkage material 的语义摘要 | 不得转换、复制或比较hex后代替 `RequestDigest`；既有 `S08-E-I05-DIGEST-AUTHORITY-01`继续承接 |
| Artifact/upstream semantic digest | 只能由 Artifact 或明确跨项目 contracts owner声明 | 证明上游拥有的 semantic material，若未来被 payload显式携带则作为独立 typed member | 当前候选 payload没有该字段和 owner；不能成为本地 request digest 第二owner |

`contracts::refs` 只拥有 typed digest carriers，不拥有 I05 material 的字段顺序、frame writer 或
hash algorithm。I05 只能调用 Step 06 的 application-private canonicalizer；不能在 assembler、
service、infra adapter、repository fake 或 replay probe 中复制 SHA-256、重编码 JSON、解析 raw
transport bytes 或从当前 reference state 重建 material。

### 8.3 Fixed request frame 与未决 payload segment

Step 06 v1 frame 是当前唯一可复用的公共 framing；I05 只固定可以由现有 owner 证明的字段：

```text
{"profile":1,"kind":"inbound_consumer_request","value":{
  "operation":"consume_artifact_evidence_context",
  "actor_ref":<trusted ActorSafeRef>,
  "producer_family":"artifact",
  "source_event_ref":<typed SourceEventRef>,
  "source_ref":<typed ObservationSourceRef>,
  "source_version_ref":<explicit absent/present ObservationSourceVersionRef>,
  "schema_version":<registered I05 consumer SchemaVersion>,
  "payload":<unresolved owner-approved body-free I05 payload>
}}
```

该 frame 是 canonicalizer 的设计目标，不是当前 wire schema。其固定规则为：

| ordinal | member | inclusion | source / validation |
|---:|---|:---:|---|
| 1 | `operation` | yes | finite I05 operation map 的稳定 token；不由 route、event name 或 Rust type name推导 |
| 2 | `actor_ref` | yes | C-03 authenticated worker 提供的 `ActorSafeRef`；payload/header无覆盖权 |
| 3 | `producer_family` | yes | authenticated static binding 的 `Artifact`；不信任 producer 自报 |
| 4 | `source_event_ref` | yes | positive Artifact-event binding 提供的稳定 typed event identity；同时属于 secondary identity |
| 5 | `source_ref` | yes | binding 提供的 typed source boundary；保留完整 wrapper/type discriminator |
| 6 | `source_version_ref` | yes，显式 absent/present | 与 `Artifact` 和当前 `source_ref` 绑定的 optional typed relation；不暗含本地排序 |
| 7 | `schema_version` | yes | exact registered I05 consumer schema slot；不使用 latest/V1/default fallback |
| 8 | `payload` | target yes，内部顺序 unresolved | 只有 canonical upstream owner 可定义字段、Option grammar 和 encoder |

`dedup_key`、`trace_ref`、`occurred_at` 属于 shared envelope/control 或 correlation metadata，但
不进入本 frame 的 semantic request material；它们仍可被各自 owner 保留和验证。`payload` 未完成
canonical owner、finite event binding、redaction 和字段映射前，整个 frame 不生成 digest candidate，
不进入 reservation/UoW。

### 8.4 Included / excluded material 与 digest redlines

| material | request digest disposition | authority / reason |
|---|---|---|
| operation、trusted actor、producer family、source event、source、source-version、schema | include，按 §8.3 固定顺序 | 它们共同界定被哪个 Consumer、哪个 producer、哪个 source/version/schema 观察 |
| future canonical Artifact payload fields | include only after exact owner/binding/schema registration | 不允许由 I05 application 字段、字段并集或 event name反推 |
| `dedup_key` | exclude | logical reservation scope，不是 semantic request material |
| `occurred_at` | exclude | observation time，不是 source ordering、payload meaning 或 local transition time |
| `trace_ref`、Artifact `core_trace_id` 与 transport correlation | exclude | correlation metadata，不是 request identity；两种 trace type 不能便利转换 |
| delivery/message/topic/partition/offset/attempt/ack/retry time | exclude | transport facts会随重投改变，不应改变同一 admitted event 的 request identity |
| supplied `RequestDigest` 或 upstream digest carrier | exclude from its own canonicalization | 防止自包含和第二 owner；只允许按明确 contract做一致性验证 |
| `DigestSummary`、reference optional digest | exclude as outer request digest | semantic digest与request digest不是同一类型或用途；不得复制、空补或任选 |
| local reference/snapshot/linkage/result/outbox/quarantine/reservation/UoW refs | exclude | local effects和coordination identity不能改变 inbound request replay identity |
| Artifact body/content/lineage/review/verdict/signoff、raw payload、provider response、diagnostics | forbidden before canonicalization | Observability只承载body-free observation/audit projection，不拥有或反写Artifact truth |

排除集在 canonicalization 之前生效。失败、quarantine、retry 或 dead-letter 分支不得先序列化、
截断或 hash 禁止材料再声称“已 redacted”。header、binding、schema 或 payload gate 失败时，允许
的结果是安全的 typed rejection/dependency classification，不生成 request digest、不 reserve、
不 mint local reference、不得写入 local truth。

### 8.5 Logical / secondary / source / local identity 分层

I05 的 identity 关系必须保持独立，不能折叠成一个 opaque string：

```text
logical idempotency scope:
  (ConsumeArtifactEvidenceContext, effective ActorSafeRef, dedup_key)

secondary delivery identity:
  (ConsumeArtifactEvidenceContext, Artifact, source_event_ref)

source stream identity:
  (Artifact, source_ref)

optional source-version relation:
  (Artifact, source_ref, source_version_ref)

future payload/reference identity:
  owner-approved body-free Artifact payload reference(s), only if explicitly registered

future local Observability identity:
  local reference/snapshot/linkage/result/outbox refs created by their own owners after admission
```

| identity | authority | request digest relation | forbidden substitution |
|---|---|---|---|
| logical scope | trusted I05 operation context + `dedup_key` | excluded from digest；用于 atomic reservation scope | source event、trace、digest、arrival time或payload ref |
| secondary event identity | positive Artifact binding + `source_event_ref` | included in digest；与 logical scope 在同一 reservation boundary 建立 | dedup、relay/payload snapshot ref、message id、offset或topic |
| source stream | validated `source_ref` + authenticated Artifact family | included as typed source relation | subject/truth anchor、event id、local snapshot或current lookup |
| source version | typed optional `source_version_ref` | explicit Option tag included；不暗含 comparator | schema version、Artifact cursor、occurred-at、row version或freshness |
| payload/reference identity | future canonical payload owner | only as typed payload member after registration | ref prefix、debug text、semantic similarity或当前 lookup |
| local reference/snapshot identity | Observability local factory/repository owner | excluded unless a future owner explicitly declares an immutable inbound reference member | producer-supplied local id、temporary mint或digest-derived id |

logical scope 与 secondary identity 必须由同一 atomic reservation decision 同时检查并指向同一
reservation row；不得先创建 logical row，再把 source event 作为 alias 附加。secondary identity
缺失或冲突是 typed admission/consistency failure，不是省略 event identity 的理由。

### 8.6 RequestDigest、DigestSummary 与 Artifact semantic digest 的分离

| comparison | current rule |
|---|---|
| `RequestDigest` vs `DigestSummary` 即使 profile/hex 相同 | 仍不可互换、转换或仅按 bytes 判等 |
| future payload nested semantic digest vs outer request digest | nested digest只有在 upstream payload contract明确列出时才进入 payload；不替代 outer request digest |
| Artifact optional digest vs local `DigestSummary` | 不能复制、覆盖或 last-write-wins；必须由 semantic owner提供 absent/equal/conflict矩阵 |
| same source/reference with different event identity | 不自动视为 replay；需后续 flow 的 source/version/equivalence proof |
| generated local ref vs source event ref | 永不按 prefix、suffix、digest或字符串推导相等；各自 owner-scoped |

本节固定 type/role separation，但不关闭 `S08-E-I05-DIGEST-AUTHORITY-01`。该 affected 仍需
选择唯一 upstream canonical 或 local canonicalizer，并闭合 profile、material、order、absence、
conflict 与 single-computation 规则。

### 8.7 Identity / digest conflict 与 zero-mutation matrix

| observed relation | classification | required check | allowed side effect |
|---|---|---|---|
| no matching logical/secondary reservation | eligible candidate only after all payload/material gates | generate one opaque candidates value; reservation later checks both identities | no mutation before reservation/UoW |
| same logical scope + same retained-profile candidate + same secondary identity + compatible stored result | replay candidate | compare retained row with matching candidate；不从 current truth重算 | later exact stored-surface read only |
| same scope/identity with reservation in flight | in-flight/deferred candidate | compare candidate and both identities | no second writer or alias row |
| same logical scope with different candidate | logical idempotency conflict | use retained profile candidate；不选择 winner | no mutation |
| same secondary event identity with different candidate or operation/producer | secondary identity conflict | exact `(consumer, producer, source_event_ref)` stability | no alias and no mutation |
| same dedup key with a different source event | logical/secondary mismatch | dedup is scope only; source event remains mandatory | fail closed |
| source-version present but producer/source differs | header consistency rejection | reject before payload decode/digest | no digest/reservation/mutation |
| source-version absent without explicit binding policy | unsupported dependency | preserve absent; do not synthesize token | no digest/reservation/mutation |
| supplied digest differs from local candidate | supplied-digest mismatch | compare only after typed local canonicalization | no reservation/mutation |
| incoming semantic digest conflicts with future local reference digest | semantic reference conflict | use future semantic owner matrix; never compare as RequestDigest | no accepted relation mutation |
| payload/schema/binding/order unresolved | ownerless protocol boundary | no valid canonical material | fail closed before candidates/reservation |

§8 不决定 public receipt/result/error/action 的最终 variant；只固定任何冲突不得选 winner、mint
replacement identity、用 arrival/time/current truth 重建 request 或产生 partial success。

### 8.8 Correlation boundary

| value | authoritative source | allowed I05 use | cannot replace |
|---|---|---|---|
| effective `ActorSafeRef` | C-03 authenticated worker binding | operation context、logical scope、safe audit/telemetry metadata | Artifact subject、producer family、dedup、source event或trace |
| `trace_ref` | shared inbound metadata 经 positive Artifact binding 无损提供的 `TraceCorrelationRef` | optional correlation context、safe log/metric/span/audit linkage | actor authority、request digest、source event/version或business relation |
| Artifact `core_trace_id` | Artifact own trace owner | 只有显式 typed adapter成立时才可映射到 `trace_ref` | 直接 cast、拼接、择优或替代 source event |
| `source_event_ref` | authenticated Artifact event binding | secondary identity、safe event correlation | dedup、source stream、local ref或trace |
| `source_ref` | shared source boundary contract | source stream/object relation | event id、subject、snapshot或current lookup |
| `source_version_ref` | typed same-source Artifact relation | opaque version metadata、request prefix | freshness、occurred-at、cursor、row version或trace |
| `dedup_key` | delivery/idempotency metadata | logical reservation scope | digest、source event、trace或semantic payload identity |
| `occurred_at` | authenticated Artifact occurrence source | optional source-time observation | local clock、version order、retry time或digest |
| local reference/snapshot/result refs | Observability local owners | post-admission linkage and safe returned markers | producer identity、source event、trace或request digest |

Correlation rules：

1. `trace_ref=None` 保持显式缺失；不得从 `source_event_ref`、`dedup_key`、actor 或 local clock 生成。
2. malformed/unregistered trace value 在 shared typed header gate 失败；不得降级为 string label 或换用另一 trace type。
3. `trace_ref` 与 Artifact `core_trace_id` 同时出现时，必须有 declared typed adapter；I05 不自行拼接、择优或 hash 两者。
4. correlation value 只有在 redaction 和 public-surface policy 通过后，才能复制到 safe telemetry/audit marker；它不授权保存 Artifact body、decision 或 signoff。
5. `trace_ref`、`occurred_at`、transport attempt 和 local result refs 均排除于 outer request digest，即使其他 owner保留它们。

### 8.9 §8 affected routing 与 closure order

| affected / blocker | §8 finding | current disposition |
|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | operation-specific payload segment、wire grammar、encoder与compatibility仍缺失 | `open_upstream_internal`；不生成 candidates |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | source-event/source/version/schema/dedup/time/trace mapping与positive event set仍缺失 | `open_upstream_internal`；不选择 Artifact event |
| `S08-E-I05-DIGEST-AUTHORITY-01` | semantic digest owner/profile/material/order与reference optional digest关系未闭合 | `open_internal_affected`；不把 semantic digest当 request digest |
| `S08-E-I05-CONTROL-FIELD-SOURCE-01` | outer frame字段虽有 target order，完整 concrete propagation/accessor仍未证明 | `open_internal_affected`；§8只记录消费约束，不发布constructor |
| `S08-E-I05-REFERENCE-AUTHORITY-01` | local reference identity/state/reason仍不能由 producer构造 | `open_internal_affected`；local refs排除于request material |
| `S08-E-I05-LINKAGE-RELATION-SOURCE-01` | projection/scope relation source未闭合 | `open_internal_affected`；不得由 correlation/ref prefix替代 |
| `S08-E-I05-DEPENDENCY-SLICE-01` | candidate/service/replay所需 least-authority read/dependency view仍缺失 | `open_internal_affected`；不得让 correlation metadata赋权 |
| `S08-E-I05-PURPOSE-AUTHORITY-01` | purpose与scope policy mapping未闭合 | `open_internal_affected`；purpose不进入当前 guessed payload |
| `S08-E-I05-VISIBILITY-AUTHORITY-01` | visibility是local response surface，不是digest/payload authority | `open_internal_affected`；不得默认 Visible |
| `S08-E-I05-DIGEST-ORDER-01` | outer frame的字段顺序、排除集、一次 candidate传播尚未贯通 assembler/reservation/replay | `open_internal_affected`；本批新增，独立于 semantic digest owner |

closure order 固定为：

```text
canonical Artifact payload + finite producer binding
  -> shared header/source/correlation mapping
  -> semantic digest authority and local reference relation
  -> fixed request frame/order propagation
  -> one opaque RequestDigestCandidates through reservation/replay
  -> complete input constructor and later service flow
```

任一上游层未闭合，后层不得用 raw hash、default、current lookup、字符串推断或 adapter 私有 map 补齐。

### 8.10 §8 stop review 与下一读取边界

| 检查项 | 结论 |
|---|---|
| 用户授权范围 | `pass`；本批只读取 Step08 digest/identity/correlation 标准、I05 §1~§7、I04 §8粒度参考、Step06/07相关 owner与Artifact上游材料；未读取或写入I05 §9以后、I06~I09、S08-F/G、Step09、formal或实现代码 |
| canonical frame | `pass_at_target_contract_level`；`inbound_consumer_request` v1公共frame、I05字段顺序、排除集已固定；payload segment仍unresolved |
| RequestDigest / DigestSummary | `pass_at_role_separation`；不转换、不复制、不让Artifact semantic digest成为outer request digest |
| logical / secondary identity | `pass_at_target_contract_level`；logical `(I05, actor, dedup_key)`与secondary `(I05, Artifact, source_event_ref)`独立且必须同一reservation boundary |
| source/version/correlation | `pass_with_affected_open`；typed roles、trace/core-trace adapter和缺失/conflict fail-closed已固定，具体 Artifact mapping仍由producer binding affected承接 |
| candidate propagation | `not_closed`；只有一条application canonicalizer路径和single-computation规则已固定，因payload/binding/material缺失当前不生成candidate |
| redaction/no-write | `pass_at_design-record_level`；禁止body/raw/diagnostic/current-truth hash，gate失败不产生digest/reservation/local write |
| affected / blocker | 10项I05专属 affected 全部开放：2项`open_upstream_internal`、8项`open_internal_affected`；新增`S08-E-I05-DIGEST-ORDER-01`，没有关闭任何项，没有新增上游 blocker |
| 当前协议计数 | 保持`34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`；`0/60`无条件complete；I05为`in_progress_S01-S08_with_affected_open`，不计入defined |
| current reachability | I05 slot继续disabled/fail closed；完整payload、input、assembler、service、reservation、result、receipt、C-05均不可达 |
| formal/implementation/test/evidence | formal `03`继续frozen；实现、测试、scan、runtime evidence、commit、run_id、真实evidence alias与验收签署均`not_run_not_claimed` |
| 下一动作 | 立即停审；用户确认后只进入I05 §9，读取对应SOP/result/error/idempotency/receipt材料与I05 §1~§8，只审查 result/receipt/error/action reachability，不进入I06或Step09 |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I05_S01-S08_recorded_with_affected_open_waiting_user_before_I05_S09
```

该段为 I05 §8 historical checkpoint；current 状态由下方 §9 承接。未经用户明确确认不得进入
I05 §10；不得读取或写入 I05 §10以后、I06~I09、S08-F/G、Step09~19、正式 `03`、任何 `04`
文件或实现代码。当前不需要提交。

## 9. Result、receipt、error、replay 与 C-05 action reachability

本节只审查 `ConsumeArtifactEvidenceContext` 的 application result、stored/ephemeral receipt、
error projection、idempotency replay 以及 transport completion 的可达性和边界。它不重新声明
shared result/receipt/error/action 类型，不选择 I05 的 durable landing，也不展开 Step 09 的
函数级 UoW 流程。所有 future 条目都是实现约束，不代表 current runtime、adapter、测试或
transport 已存在。

### 9.1 本批读取与权威顺序

| 顺序 | 输入 | 本节使用方式 | 不得反向覆盖 |
|---:|---|---|---|
| 1 | `详细设计讨论流程_SOP.md` Step 08、`详细设计书写规范.md` §5.7/§5.11/§5.12 | 检查 Consumer result、receipt、error、幂等、重放和 completion 是否具备字段级闭环 | 不用 family-level receipt 表或旧 formal 摘要替代 I05 分支 |
| 2 | Step 06 stored-result、error、UoW 与 operation-result owner | 复用 `ObservationConsumerResult`、`StoredObservationResult`、`OperationResultDisposition`、`ApplicationError` 和 exact result pointer 语义 | Step 08 不复制 enum、重写 result owner 或把 transport action 放入 application result |
| 3 | Step 07 reservation、stored-result repository、worker callback/registrar 与 C-05 边界 | 固定 exact replay、known commit、unknown probe 和 action execution 的单向调用关系 | 不让 worker 从 current truth 补 receipt，不让 registrar 重新分类 result |
| 4 | S08-B shared Consumer carrier 与 I04 §§11~§13 粒度参考 | 复用 `ObservationStoredConsumerReceipt`、`ObservationConsumerReceipt`、`ObservationProtocolResultAccess`、`ObservationProtocolErrorSurface` 与 `InboundConsumerCompletion` 的 owner/形状 | 不复制 I04 的业务 truth、错误 enum 或 action policy |
| 5 | I05 §§1~§8、Artifact 上游 blocker 与 affected inventory | 把 current payload/binding 缺失、body-free ceiling、digest/identity boundary传播到 result/replay/action | 不把 structural owner gap 伪装成 runtime `UnsupportedSchema`、`Rejected`、`Delayed` 或 `Retry` |

### 9.2 Shared owner 复用与结果语义红线

I05 不新增同名或近义的 result、receipt、error、access 或 completion 类型。下表是本协议的
唯一使用关系：

| surface | 唯一 owner / carrier | I05 使用规则 | 禁止替代 |
|---|---|---|---|
| application result | `ObservationConsumerResult` | 只表示已完成校验、具有明确 local result relation 的 application fact；不表示 transport 已完成 | `bool`、裸 `BodyFreeRef`、`OperationResultDisposition` 单独返回或 action enum |
| stored inner result | `StoredObservationResult` + `StoredObservationReplaySurface` | fresh 与 replay 都必须来自同一 immutable stored surface；result integrity 在公开前验证 | current linkage/reference/gap/outbox row、重新编码的当前 DTO |
| result disposition | `OperationResultDisposition` | 只表达已存储的 application fact，如 `Accepted`、`Rejected`、`Quarantined`、`NoOp` 或 `Blocked` | `Duplicate`、`Acknowledge`、`Retry`、`DeadLetter` 或 `retryable` |
| public stored receipt | `ObservationStoredConsumerReceipt` + `ObservationConsumerReceipt::Stored` | exact stored bytes 解码后 lossless 映射；所有 ref/error presence 由 stored surface 支持 | generic map、empty Stored、按 outcome 猜字段 |
| public ephemeral receipt | `ObservationConsumerReceipt::Ephemeral` | 只用于无 stored result 的有限、已完成 typed mapper 分支；Stored/Ephemeral 互斥 | 用 ephemeral 携带 result ref、changed/outbox/gap/dead-letter refs |
| invocation access | `ObservationProtocolResultAccess` | `FreshlyCommitted` / `Replayed` 是 invocation-level overlay，不写入 inner result | durable `Duplicate` outcome、重写原 disposition |
| protocol/application error | `ObservationProtocolErrorSurface` / `ApplicationError` | 复用唯一 owner 的 finite variant 和 safe projection；raw detail 永不跨边界 | I05 私有 error enum、provider text、stack、digest hex |
| transport completion | `InboundConsumerCompletion::{Acknowledge, Retry, DeadLetter}` | 只由 exact I05 worker mapper 在 receipt/probe 后产生；registrar 只执行 | application 返回 action、registrar 二次分类、wildcard/default action |

`OperationResultDisposition` 仅是已提交 local application fact。它不证明 Artifact truth、evidence
真实性、retention、report handoff、消息确认或外部验收。`Replayed` 也只是本次 invocation 的
访问方式，不是新的 durable disposition。

### 9.3 Current reachability proof

当前 I05 的可达性必须保持有限且可证明：

```text
static I05 slot / activation catalog inspection
  -> canonical Artifact producer-event binding is absent
  -> canonical payload schema/decoder is absent
  -> complete input and one RequestDigestCandidates set cannot be formed
  -> reservation is not called
  -> no Acquired / Replay / Conflict / InFlight result exists
  -> no ObservationConsumerResult or StoredObservationResult exists
  -> no Stored/FreshlyCommitted or Stored/Replayed receipt exists
  -> no I05 C-05 mapper or transport completion is reachable
```

因此 current I05 不能跳过 payload/binding 直接 probe 或 replay。即使某个存储中碰巧存在疑似
I05 result，也没有同一 canonical input、source event binding、actor、digest 和 schema relation
来证明它属于本次 delivery；不得因 operation name、Artifact ref、dedup key 或当前 local rows
相似而公开它。slot disabled/fail closed 也不等于一次 runtime `Rejected` 或 `UnsupportedSchema`
delivery，不能产生 receipt、dead-letter marker 或 completion。

### 9.4 Result 与 receipt field provenance

I05 只消费 shared stored surface 或已完成的 typed ephemeral mapper。response assembler、worker
registrar 和 error projector 都不得回查 current truth 补字段。

| 字段 / surface | 唯一来源 | Stored 规则 | Ephemeral / current 规则 | 禁止 fallback |
|---|---|---|---|---|
| `consumer_name` | static I05 registration 与 retained receipt | 必须精确为 `ConsumeArtifactEvidenceContext`，并与 operation 一致 | 只能使用已激活 slot 的静态期望值 | Artifact event name、topic、route、handler type |
| `source_event_ref` | positive Artifact binding 后的 validated header；replay 使用原 stored value | 必须与 secondary identity 完全相等，replay 不覆盖 | malformed/missing header 只能在合法 slot 的 finite error surface 中按 shared presence 规则处理 | dedup、message id、offset、relay ref、local result ref |
| `result_ref` | `StoredObservationResult.public_result_ref` 与 decoded stored receipt | Stored 必须存在且两处相等 | Ephemeral 结构性缺失 | internal repository pointer、evidence alias、outbox ref |
| `outcome` / `disposition` | exact stored `OperationResultDisposition` | replay 保留原值，不新增 duplicate outcome | 仅使用 shared 允许的 ephemeral outcome，不能由 I05 自行扩展 | C-05 action、Artifact state、error severity |
| `changed_refs` | 同一 future accepted UoW 的 Observability-owned post-state | canonical、duplicate-free；negative/no-op 按 owner matrix 为空 | Ephemeral 结构性缺失 | current snapshot diff、Artifact version、current query |
| `outbox_refs` | exact stored receipt field或validated accessor | 显式 empty 也必须由 stored surface 表示；replay 不新增 | Ephemeral 结构性缺失 | current outbox scan、publisher state、默认 empty |
| `gap_refs` | 同一 future UoW 的 owner-authorized local relation | 保留原 canonical 集合 | Ephemeral 结构性缺失 | `VisibilitySurface`、Artifact nonconformity、error code/count |
| `dead_letter_ref` | committed local dead-letter marker relation | 只能与 exact stored terminal surface共现 | Ephemeral 结构性缺失 | transport action、broker locator、raw archive、临时 mint |
| `error` | stored `ObservationProtocolErrorSurface` 或 validated ephemeral mapper | presence/absence 按 outcome matrix 固定，replay逐字段保留 | 对外暴露的 Ephemeral 必须有 safe error | provider text、payload、stack、SQL/transport detail、空占位 |
| `result_access` | 当前 invocation 在全部关系校验后生成 | 只允许 `FreshlyCommitted` 或 `Replayed` overlay | current no-result branch无 access | durable duplicate、boolean success、arrival attempt |

这些字段只表达 Observability-owned body-free protocol fact。即使 receipt 含有 evidence-looking
reference，也不证明 Artifact content、lineage、review、verdict、signoff 或 report 已成立。

### 9.5 Stored / Ephemeral 与 FreshlyCommitted / Replayed 的互斥关系

| 条件 | application 边界 | public surface | 本次写集合 | 禁止解释 |
|---|---|---|---|---|
| current ownerless payload/binding | typed structural failure；不构造 `ObservationConsumerResult` | 无 completion；只有后续 exact mapper 才可能产生合法 Ephemeral | empty | stored rejection、NoOp 或默认 Retry |
| future pre-writer malformed/unsupported input | `ApplicationError` 或 validated protocol failure | shared 允许的 `Ephemeral/Rejected` 或 `Ephemeral/UnsupportedSchema`，具体分支待 owner mapper | empty | result ref、local rejection fact、raw quarantine |
| future known temporary dependency / InFlight | typed failure with proven recovery posture | `Ephemeral/Delayed` 仅在 total recovery mapper允许时 | empty | generic retry permission、accepted mutation |
| future accepted local fact, whole UoW known committed | validated `ObservationConsumerResult` | `Stored/FreshlyCommitted` | exactly selected owner-authorized set | Artifact truth accepted、transport acknowledged |
| future compatible completed duplicate | exact original stored result | `Stored/Replayed`，inner surface unchanged | empty for this invocation | new Duplicate outcome、new refs、writer rerun |
| future owner-authorized durable negative/no-op | exact committed stored result | `Stored/FreshlyCommitted` 或 later `Stored/Replayed` | only named durable owner set | error severity inferred durable fact |
| completed reservation with missing/corrupt result | consistency failure | no legal Stored or Ephemeral success receipt | empty | current-row reconstruction、downgrade to Delayed |
| commit/rollback/probe unknown | no legal completion under current carrier | no receipt/action | unknown | assume committed/not committed、choose terminal action |

`Stored` 与 `Ephemeral` 是互斥 algebraic shapes；不能用空 `result_ref` 或默认 error 构造 Stored，
也不能给 Ephemeral 附加 result/change/outbox/gap/dead-letter 字段。`FreshlyCommitted` 需要同一
UoW 的 known commit；`Replayed` 需要原 reservation 的 exact pointer 和完整 integrity 校验。

### 9.6 Fresh result 与 exact replay rehydration

future path 的共同前置条件是：canonical payload、positive Artifact binding、complete input、
redaction gate 和 single `RequestDigestCandidates` 已闭合。之后的 result/replay 关系固定为：

```text
validated I05 input + one opaque RequestDigestCandidates
  -> atomic reserve(logical scope, secondary event identity, candidates)
  -> Acquired: selected local owner stages result in the same UoW
  -> mark_completed only after result staging
  -> one known commit
  -> exact decode of stored ConsumerReceipt
  -> add result_access = FreshlyCommitted

  or

  -> Replay(original reservation ref, exact StoredObservationResultRef)
  -> discard incoming writer set with zero new effect
  -> load by logical scope and by secondary event identity
  -> require same Completed reservation and same stored-result pointer
  -> get_result(pointer)
  -> validate operation, actor, source event, digest, kind, schema, bytes, refs and error presence
  -> exact-decode ObservationStoredConsumerReceipt
  -> add result_access = Replayed
```

| replay check | 失败分类 | 允许行为 |
|---|---|---|
| logical 与 secondary lookup 缺失、重复或指向不同 row | consistency defect | 不选 first row、不建 alias、不返回 receipt |
| reservation 非 `Completed` 或 pointer 不一致 | reservation/result relation defect | 不从 current truth 重建，不运行 writer |
| stored result 缺失、重复、wrong kind/schema | stored-surface consistency/compatibility failure | 不换 Command/Job decoder、不 fallback latest schema |
| operation、actor、source event、request digest 不一致 | cross-scope/replay mismatch | 不公开旧 receipt，不覆盖 incoming identity |
| bytes empty、oversized、noncanonical 或 digest mismatch | stored integrity failure | 不打印、不修复、不重新序列化、不降级为普通 rejection |
| consumer name、refs、error presence 不符合 I05 matrix | receipt surface defect | 不查询 current linkage/outbox/gap 补值 |
| 所有检查通过 | exact replay | 只加 `Replayed` overlay，不新增 durable outcome |

`load_by_scope` 与 `load_by_inbound_event` 是同一 reservation 的交叉验证，不是可择优的两个
truth source。Replay 不重跑 assembler、service、domain transition、resolver、writer、outbox 或
current truth lookup；post-commit transport failure 也不回滚原 result。

### 9.7 Error owner、结构性缺口与 runtime branch

结构性 owner gap 必须在 activation/assembly 阶段处理，不能被映射成一次合法 delivery 的 runtime
outcome。只有 slot 已合法激活且输入已通过相应 gate，下面的 runtime mapping 才可能进入 worker
mapper：

| 检测阶段 | shared internal owner / variant | safe public projection target | result/action ceiling |
|---|---|---|---|
| canonical payload owner或positive Artifact binding缺失 | design/activation affected；不是 runtime `ApplicationError` | assembly issue / slot not activatable | no receipt、no completion；不伪装 `UnsupportedSchema` |
| static operation/body/required header不匹配 | `ProtocolError::RouteBodyMismatch` / `InvalidEnvelope` | `InvalidRequest` 或 shared invalid envelope surface | no reserve；具体 action不得默认 |
| registered schema 不支持 | `ProtocolError::UnsupportedSchemaVersion` 或 `ApplicationError::UnsupportedSchemaVersion` | `UnsupportedSchema` | future Ephemeral only after exact schema policy；不由 owner gap触发 |
| typed payload malformed/unknown/duplicate/forbidden | `ApplicationError::InvalidRequest` 或 domain boundary variant | safe `Rejected`/invalid surface，具体由 mapper决定 | no partial DTO/hash/write；不保存 raw body |
| local reference / linkage / purpose authority unresolved | existing `ApplicationError::InvalidRequest` / `Domain(...)` / relation-specific owner error | typed structural failure | no result/ref/action；不得默认 visible |
| same logical/secondary identity with different candidates | `ApplicationError::IdempotencyConflict` | safe conflict/rejection surface | no winner receipt、no alias、no second writer |
| same identity currently reserved | `ApplicationError::IdempotencyInFlight` | `Delayed` only if shared recovery mapping permits | no recursive handler retry |
| owner exists but dependency call temporarily unavailable | `RepositoryUnavailable` / `ReferenceUnavailable` / `ResolverUnavailable` | `DependencyUnavailable` / `Delayed` only with proven temporary class | no synthetic ref/result/accepted fact |
| known whole-UoW abort | `CommitFailed` | dependency/temporary failure only after no-write proof | no Stored; no terminal action inferred |
| commit/rollback outcome unknown | `CommitOutcomeUnknown` / `RollbackFailed` | no legal terminal receipt under current carrier | exact probe only; no `Acknowledge`/`Retry`/`DeadLetter` |
| completed reservation pointer missing or result corrupt | `CompletedReservationResultMissing` / `StoredResultKindMismatch` / persisted consistency variant | consistency/manual surface | no Ephemeral downgrade、no current-truth reconstruction |
| action call fails after known commit | worker/registrar transport error, outside application result | preserve original stored receipt and typed worker failure | no writer rerun；later exact replay/probe |

`ApplicationError` 继续由 `application::errors` 唯一拥有；`ObservationProtocolErrorSurface` 只能
携带 finite code、safe reason/ref presence 和 owner-derived recovery projection。不得携带 Artifact body、
provider response、stack、SQL/transport locator、digest hex、raw trace 或业务结论。`ObservationRecoveryClass`
及 public `retryable` 仍只按 shared owner 的 target vocabulary使用；I05 不复制 enum，也不从
`Delayed`、错误文本或 severity 推导 action。

### 9.8 Idempotency / replay relation matrix

I05 继续使用 §8 的两层 identity，并要求一次 `reserve` 同时检查：

```text
logical scope   = (ConsumeArtifactEvidenceContext, effective ActorSafeRef, dedup_key)
secondary key   = (ConsumeArtifactEvidenceContext, Artifact, source_event_ref)
request material = one canonical inbound_consumer_request frame + owner-approved payload
```

| logical relation | secondary relation | retained candidate/result | classification | I05 write permission |
|---|---|---|---|---|
| absent | absent | complete candidate set | `Acquired` | one future writer only |
| exact same reservation, `Reserved` | exact same reservation | compatible candidate | `InFlight` | none |
| exact same reservation, `Completed` | exact same reservation | compatible candidate + valid pointer | `Replay` | none; exact read only |
| present | missing/foreign/cross-index mismatch | any | consistency or `Conflict` | none; no alias |
| same identity | same identity | different candidate | `Conflict` | none; winner not disclosed |
| same dedup | different source event | any | logical/secondary mismatch | none |
| source/version/producer binding differs | any | any | header/binding rejection | no digest/reserve/write |
| retained profile unreadable or pointer invalid | exact identity | unreadable/corrupt | consistency/manual | no fallback profile or current truth |

`RequestDigest`、`DigestSummary`、Artifact semantic digest、source event identity和local result
identity不能按相同 bytes、prefix、字符串或 arrival order 判等。Replay 的 candidate 必须是原
canonicalizer 生成并由 reservation 记录的 opaque value；assembler、service、repository fake 和
replay probe 不得各自重算。

### 9.9 C-05 action eligibility matrix

`InboundConsumerCompletion` 是唯一 transport action carrier。下面只写 I05 的 proof 和 policy
边界，不把 outcome 简化为 action：

| validated branch | action target | 选择前必须证明 | 当前处置 |
|---|---|---|---|
| structural payload/binding/activation gap | none | 这是设计/assembly缺口，不是合法 delivery | slot保持 disabled；不构造 completion |
| `Stored/FreshlyCommitted/Accepted` | `Acknowledge` 可具备资格 | exact selected UoW known committed、stored receipt完整、无error | future policy；当前不可达 |
| `Stored/Replayed` 且原 receipt完整 | `Acknowledge` 可具备资格 | original pointer、bytes/digest、scope/event与presence全部验证 | future I05 policy；不重跑 handler |
| owner-authorized `Stored/FreshlyCommitted/NoOp` | `Acknowledge` 可具备资格 | durable no-change fact、result与policy明确 | future policy；不得由空 changed_refs推导 |
| owner-authorized stored `DeadLettered` | `DeadLetter` 仅在明确 policy下可选 | local terminal marker/result同一 known commit，dead-letter ref完整 | action matrix affected；不由 action 创建 marker |
| owner-authorized stored `Quarantined` | no default action | isolation fact、safe ref、recovery class和I05 policy完整 | action matrix affected |
| stored/ephemeral `Rejected` 或 conflict | no generic action | exact error/ref presence、recovery和I05 policy | 不公开 winner，不 wildcard |
| `UnsupportedSchema` | no default action | registered schema set和producer correction/drop policy | owner policy未闭合 |
| `Ephemeral/Delayed` 或 `InFlight` 且 recovery允许重试 | `Retry` 可具备资格 | proven no accepted write、temporary cause、bounded policy、stable identity | 不在 handler 内递归重试 |
| delayed/recovery 禁止重试 | none 或 policy-defined nonterminal shape | exact state/input/manual policy | 不 fallback `Retry` |
| missing/corrupt completed result | none | valid receipt absent本身就是 consistency defect | probe/manual；不 terminal |
| commit/rollback/probe unknown | none | certainty 尚未建立 | shared indeterminate affected；不猜 action |
| action execution fails after known commit | no application reclassification | original stored relation仍 committed | registrar/transport recovery；later exact replay |

receipt 成立不自动等于 `Acknowledge`；known local commit也不自动等于 transport success。相反，
pre-admission failure不因错误严重而自动 `DeadLetter`。所有 terminal action 必须在 receipt/probe
完成后由 I05 具名 mapper 一次性选择。

### 9.10 I05 exact mapper seam 与调用纪律

当前 shared worker contract 只有 generic capability，尚无一个可定位的 I05 pure/total/no-wildcard
mapper seam。设计目标是补充一个仅供 `ConsumeArtifactEvidenceContextFlow` 使用的具名 mapper，名称和
参数必须在 Step 06/07 owner 修订中最终确定；本节不把目标签名伪装成现有代码。

该 mapper 必须同时消费以下维度，而不能只接收 `OperationResultDisposition` 或 `retryable`：

1. slot activation 是否为 matching I05 且具备正向 Artifact binding；
2. commit/rollback/probe certainty；
3. `Stored` 与 `Ephemeral` 的互斥 branch；
4. inner outcome/disposition 与 `FreshlyCommitted` / `Replayed` access；
5. `result_ref`、changed/outbox/gap/dead-letter refs 和 error 的 presence/完整性；
6. shared recovery owner 给出的 recovery class；
7. I05 operation-specific completion policy。

调用顺序必须是：

```text
validated delivery
  -> exact I05 assembler/service
  -> result or typed error
  -> known commit / exact replay probe
  -> stored/ephemeral receipt validation
  -> one named I05 mapper call
  -> one C-05 completion
  -> private registrar executes selected action only
```

mapper 必须 pure、total、显式覆盖所有已登记 branch，不得有 wildcard/default arm，不得读取
current Artifact/Observability truth，不得调用 repository、resolver、broker 或 dead-letter writer。
registrar 只能执行已选 variant；action 失败不回调 mapper 重新改变 application result。

### 9.11 Redaction、no-write 与 post-commit reentry

I05 result、receipt、error、telemetry 和 dead-letter metadata 共享 §8 的 body-free ceiling：

- 不携带 Artifact body/content/lineage/review/verdict/signoff、provider response 或 raw transport material；
- 不携带 request digest hex、semantic digest bytes、stack、SQL/driver detail、topic/partition/offset；
- 不对禁止材料做 hash、截断、base64、debug/display 或重新序列化后再输出；
- result/receipt/action 只复制已经通过 redaction 和 public-surface policy 的 typed safe ref；
- current owner gap、missing result、unknown probe 和 disabled slot 不产生 local result、gap、outbox、
  quarantine 或 dead-letter marker。

known post-commit action failure 只能保留原 stored result，并由 transport owner做 probe/replay；不
回滚已提交 local observation fact，不重开 writer，不生成 replacement result。commit/probe unknown
则不得声称 no-write 或 committed，直到 exact reservation/result probe给出明确关系；当前 shared
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`仍保持开放。

### 9.12 I05 affected register 与 closure order

本节新增两项 I05 专属 affected；共享项不重复登记：

| affected | 状态 | §9 发现 | 关闭条件 | 禁止 shortcut |
|---|---|---|---|---|
| `S08-E-I05-RESULT-SURFACE-01` | `open_internal_affected` | I05 operation-specific result、outcome、refs、error presence 尚未绑定到唯一 lossless result/receipt mapper | Step06/07提供唯一 result surface owner、stored accessor、I05 field/presence matrix，并证明 fresh/replay同一 immutable inner surface；Step09只消费不补字段 | generic disposition、empty Stored、current rows 补 refs、从 Artifact truth重建 |
| `S08-E-I05-ACTION-MATRIX-01` | `open_internal_affected` | 缺少 I05 具名 pure/total/no-wildcard C-05 mapper，known result、ephemeral、unknown、replay 与 post-commit action failure尚未全分支闭合 | mapper覆盖 activation、certainty、Stored/Ephemeral、outcome/access、refs/error、recovery和I05 policy；Step09 receipt/probe后只调用一次；Step16表驱动/no-wildcard验证 | generic Consumer policy、default Retry、outcome-only switch、registrar重新分类、unknown terminal action |

I05 当前完整专属集合为 12 项：2 项 `open_upstream_internal`（payload schema、producer event
binding）和 10 项 `open_internal_affected`（reference、control fields、semantic digest、digest
order、purpose、visibility、linkage、dependency、result surface、action matrix）。既有
`S08-CONSUMER-OUTBOX-SURFACE-01`、`S08-CONSUMER-QUARANTINE-REF-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-RECOVERY-CLASS-OWNER-01`、
`S08-RESULT-ACCESS-LAYER-01` 与 `R06-F-AFFECT-UOW-01` 继续按 shared/downstream owner 传播，
不在 I05 重复登记。

closure order 固定为：

```text
payload schema + positive Artifact binding
  -> complete input + canonical candidate
  -> exact durable landing/UoW and stored result surface
  -> error/recovery total mapping
  -> I05 pure/total action mapper
  -> Step09 one-call flow and Step16 no-wildcard verification
```

### 9.13 §9 stop review 与下一读取边界

| 检查项 | 结论 |
|---|---|
| 用户授权范围 | `pass`；只读取 I05 §9 所需 SOP、Step06/07 shared result/error/UoW/replay owner、S08-B carrier、I04 §§11~§13 粒度参考与 I05 §1~§8；未进入 I05 §10、I06~I09、S08-F/G、Step09、formal 或实现代码 |
| owner reuse | `pass`；未创建新的 result、receipt、error、recovery、access 或 completion owner；application result 与 transport action分离 |
| current reachability | `pass_with_affected_open`；I05 slot、payload、input、candidate、reservation、writer、stored result、receipt 与 C-05 均不可达，未伪造 runtime outcome |
| Stored/Ephemeral | `pass_at_target_contract_level`；两者互斥；Stored必须有 exact stored surface，Ephemeral不得携带 durable refs |
| fresh/replay | `pass_with_affected_open`；FreshlyCommitted要求同一UoW known commit，Replayed要求原 reservation pointer和完整 integrity/presence校验，不重跑 handler |
| error boundary | `pass_with_affected_open`；结构性 owner gap不伪装 runtime error；public error复用 finite safe owner，不泄露 raw/body/digest |
| idempotency/replay | `pass_with_affected_open`；logical/secondary双identity、single candidates、cross-index exact probe已固定，current truth reconstruction禁止 |
| C-05 action | `not_closed`；`InboundConsumerCompletion`仍只能由具名 I05 mapper在receipt/probe后选择；新增 `S08-E-I05-ACTION-MATRIX-01` |
| affected / blocker | 12项 I05 专属 affected 全部开放：2项上游、10项本仓；新增 `S08-E-I05-RESULT-SURFACE-01` 与 `S08-E-I05-ACTION-MATRIX-01`；没有关闭项，没有新的上游 blocker |
| 当前协议计数 | 保持 `34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`；`0/60` 无条件 complete；I05 仍不计入 defined |
| truth boundary | `pass_at_design-record_level`；result、receipt、error、action、telemetry均不拥有或反写 Artifact truth、evidence body、retention、report handoff或external delivery |
| formal / implementation / test / evidence | formal `03` 继续 frozen；实现、测试、scan、runtime evidence、commit、run_id、真实 evidence alias 与验收签署均 `not_run_not_claimed` |
| 下一动作 | 立即停审；用户确认后只读取并进入 I05 §10，审查 durable landing、UoW/save order、commit/probe 与 result persistence handoff；不得进入 I06~I09、S08-F/G、Step09或formal回填 |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I05_S01-S09_recorded_with_affected_open_waiting_user_before_I05_S10
```

未经用户明确确认不得进入 I05 §10；不得读取或写入 I05 §11以后、I06~I09、S08-F/G、
Step09~19、正式 `03`、任何 `04` 文件或实现代码。当前不需要提交。

该段为 I05 §9 historical checkpoint；current 状态由下方 §10 承接。

## 10. Local UoW、durable landing 与 result persistence handoff

本节只审查 `ConsumeArtifactEvidenceContext` 在通过完整 admission 后的本地持久化边界、
Unit of Work 顺序、reservation/result 关系、commit/rollback/probe 语义与 fake/durable
一致性要求。它不创建新的 payload、reference、linkage、result、receipt、error、record、
cursor 或 completion owner；所有 shared 类型继续复用 Step 06/07 已登记的唯一 owner。

当前 I05 仍处于 canonical Artifact payload、positive producer-event binding、local
reference/digest/purpose/linkage authority 未闭合的状态。因此本节首先给出 current
zero-write 结论，再给出未来 owner 闭合后的 target-neutral UoW skeleton。方括号中的
operation-specific 项必须由 Step 06/07 affected repair 与 Step 09 共同补齐，不能被实现端
从候选 repository、类型名称或历史正式文档自行选择。

### 10.1 Current reachable write set is empty

I05 delivery 的合法前置链仍是：

```text
trusted worker binding
  -> finite I05 slot and header validation
  -> positive Artifact event binding
  -> canonical payload schema and decoder
  -> complete I05 input and local authority checks
  -> one canonical RequestDigestCandidates value
  -> reservation / writer lane
```

当前链条在 positive binding、canonical payload、完整 local input 和 candidate gate 之前停止。
因此 `ObservationUnitOfWorkManager::begin`、idempotency reserve、primary lookup、local
transition、cursor allocation、record append、stored-result save、reservation completion、
outbox append 和 C-05 completion 均不可达。

| phase / local material | current reachability | exact reason | required behavior |
|---|---|---|---|
| Artifact event -> I05 finite binding | `no` | `S08-E-I05-PRODUCER-EVENT-BINDING-01` remains open | 不任选 event、不全量订阅、不按名称相似度解码 |
| `ArtifactEvidenceContextPayload` decode | `no` | `S08-E-I05-PAYLOAD-SCHEMA-01` remains open | 不把 Observability use-site 当 canonical schema |
| complete `ConsumeArtifactEvidenceContextInput` | `no` | local reference、semantic digest、purpose、linkage selector 尚未闭合 | 不发布 control-only input，不以默认值补字段 |
| `RequestDigestCandidates` | `no` | operation payload segment 与 single-computation source 未闭合 | 不 hash raw body、transport bytes、debug material 或旧 fixture |
| `ObservationUnitOfWorkManager::begin` | `no current writer call` | service 尚无 complete input | pre-admission failure 保持 zero mutation；误开的空 handle 也必须 rollback |
| idempotency reserve | `no` | logical scope、secondary event identity 与 candidate 未同时可证明 | 不创建 placeholder reservation 或 dedup-only row |
| candidate primary lookup | `no authorized target` | `projection_ref`、`consumer_scope` 与完整 relation key 未提供 | 不扫描、first-row-wins 或按 ref prefix 选 landing |
| local primary transition | `no` | `EvidenceLinkage`、`ReferenceSnapshotState`、audit/projection/gap 均未获 I05 专属授权 | 不从 capability 存在性反推 writer 权限 |
| cursor / H-family record | `no` | accepted primary footprint 与 record mapping 未确定 | 不 mint generic record、双 cursor 或空 transition record |
| stored result / completed reservation | `no` | 没有 accepted local fact 或 known commit | 不保存空 success、`Reserved + result_ref` 中间态或 durable rejection |
| outbox / receipt / C-05 action | `no` | no committed result；action mapper 也未闭合 | 不 append outbox，不选择 `Acknowledge`、`Retry` 或 `DeadLetter` |

当前允许的输出最多是 body-free、finite、ephemeral 的结构性或依赖失败 surface。它不是
I05 accepted audit fact、durable no-op、quarantine、evidence record、Artifact verdict 或
transport completion。没有 durable row 时，不得把“未写入”描述为业务层 `Ignored` 或已提交的
`NoOp`；当前语义是 writer admission 不可构造。

### 10.2 Durable landing 的候选 authority 与冲突处理

当前材料暴露了多个可调用能力，但没有证明 I05 的唯一 primary。候选能力的存在不构成
operation dispatch：

| candidate / source | current fact | why it is insufficient as I05 primary | current disposition |
|---|---|---|---|
| `EvidenceLinkage` / `AuditProjection` | Step 06 定义 body-free linkage 与 audit/projection vocabulary | I05 当前没有完整 `projection_ref`、`consumer_scope`、purpose relation、transition 与 expected version | candidate only；不得直接 stage |
| `AuditEvidenceRepository::find_linkage_by_relation` | Step 07 提供 typed relation lookup | callable 要求完整 relation key；不能从 `artifact_evidence_ref`、visibility 或第一条 row 补 selector | capability input；不授权 I05 landing |
| `ReferenceSnapshotState` / `ReferenceMaintenanceRepository` | shared reference maintenance 能力存在 | I05 没有 approved subject mapper、snapshot transition decision 或 H10 obligation | candidate only；不得把 reference-looking payload 当 refresh |
| local `GapState` / visibility surface | gap/degraded/read visibility 是 Observability 自有概念 | visibility 不等于 gap transition；异常或缺失也不能自动创建 durable gap | response/policy candidate；不作为默认 primary |
| frozen formal `03` 与旧 HLD 多选描述 | 历史文本列出 boundary snapshot、audit/linkage、gap 等可能落点 | 旧文本含多选和 owner 冲突，且未给 I05 relation/version/save order | `historical_material`；不作 selector |

`GovernanceArtifactEvidenceReference` 不是 `EvidenceLinkage` 的 identity，也不是
`ReferenceSnapshotState` 的 subject selector。`GovernanceArtifactEvidenceResolver` 只能在
输入已经是完整本地 reference 时进行受限解析，不能把 Artifact truth anchor、consumable ref
或 trace ref 变成本地 reference。相同地，repository 方法名包含 `stage` 或 `append`，也不能
证明 I05 获得了调用该方法的业务授权。

本节新增一个明确的本地 affected：

```text
S08-E-I05-DURABLE-LANDING-01 = open_internal_affected
```

该 affected 必须一次性闭合以下内容后，I05 才能离开 current zero-write 状态：

1. 唯一 primary local object，以及 accepted、no-op、deferred、rejected 的有限分支。
2. exact semantic relation key、lookup/stage 方法、missing/duplicate/mismatch precedence。
3. expected version 的唯一来源、create-if-absent 规则与 same-UoW CAS 边界。
4. 每个 accepted local mutation 对应的 H-family record，或 owner 明确的 `explicit_no_record`。
5. actual primary footprint 到 `ObservationCommitClass` 和 cursor allocator 的映射。
6. result 中 changed/linkage/reference/gap/record/outbox refs 的逐字段来源。
7. 是否存在 outbound event；若存在，必须有 committed source、typed encoder 与 same-UoW pair。

它与 `S08-E-I05-LINKAGE-RELATION-SOURCE-01` 不同：后者回答如何获得完整 linkage relation；
本项回答 relation 已闭合后究竟由哪个 primary、哪个 transition、哪个 repository、哪个
record/cursor 和哪个 stored result surface 承接。即使 relation lookup 将来闭合，也不能自动
选择 linkage、snapshot、audit、projection 或 gap 作为 primary。

### 10.3 Future reservation 与 writer admission 顺序

只有 payload schema、positive Artifact binding、complete input、canonical candidate 和
`S08-E-I05-DURABLE-LANDING-01` 全部满足后，future I05 writer 才能进入 shared atomic
admission。顺序固定为：

1. matching assembler 完成 header、binding、schema、redaction、field authority 与 digest gate。
2. matching service 收到不可再重构的 complete `ConsumeArtifactEvidenceContextInput`。
3. service 调用 `ObservationUnitOfWorkManager::begin()`，建立一个 fresh local UoW。
4. 在同一 UoW 内调用 `ObservationIdempotencyRepository::reserve(...)`，同时绑定 logical
   scope、`ObservationInboundEventIdentity` 与完整 `RequestDigestCandidates`。
5. 只有 `ObservationIdempotencyReserveOutcome::Acquired` 进入 operation-specific landing。
6. `Replay`、`Conflict`、`InFlight` 离开 writer lane，不加载或修改 primary，不分配 cursor，
   不创建 record、outbox 或新的 stored result；incoming UoW 按 shared owner 规则 rollback。
7. `Replay` 只使用原 reservation 的 exact `StoredObservationResultRef` 调用
   `ObservationStoredResultRepository::get_result`，不能从 current linkage、snapshot、gap
   或 Artifact truth 重建结果。
8. Acquired 分支才执行 I05 专属 relation lookup、owner transition、stage、record/follower
   plan 和 result assembly。
9. 任一 owner、relation、version、branch、result field 或 outbox obligation 未闭合时，整批
   rollback；`Acquired` 不得直接映射为 application Accepted 或 transport action。

reservation 只证明本次 logical/event identity 获得 writer admission，不证明 Artifact truth
有效、不证明本地 transition 已发生，也不决定 C-05 action。reserve 前不得按 current row 猜
digest；reserve 后不得把 reservation outcome 当作业务结果。

### 10.4 Target-neutral one-UoW skeleton

在 `S08-E-I05-DURABLE-LANDING-01` 关闭前，下面的骨架是唯一允许的 future shape；方括号
内容是必须由后续 owner repair 填入的 operation-specific 契约，不是实现端的自由选择：

```text
validated complete I05 input
  -> begin one fresh ObservationUnitOfWork
  -> reserve logical scope + inbound event identity + digest candidates atomically
  -> Replay / Conflict / InFlight leave the new writer lane
  -> [resolve exact I05 primary relation and committed Versioned<T>]
  -> [obtain owner-authorized finite decision]
  -> [stage exact primary post-state with its expected version]
  -> derive ObservationCommitClass from actual accepted primary footprint
  -> assign exactly one required cursor, or reject a record-only footprint
  -> [assemble and append only the mapped H-family records]
  -> [stage mapped projection/stale followers, if explicitly authorized]
  -> [stage a registered immutable outbox pair, or an explicit empty set]
  -> construct the exact body-free StoredObservationResult
  -> save_result(result, uow)
  -> mark_completed(reservation, result_ref, uow)
  -> commit(uow)
  -> return the validated local result to the later I05 result/action mapper
```

该骨架承接 Step 06/07 的 shared order，而不是重新定义一个 I05 transaction abstraction：

| concern | current shared owner / callable | I05 use rule |
|---|---|---|
| UoW lifecycle | `ObservationUnitOfWorkManager::{begin, commit, rollback}` | 只能由 matching service orchestration 使用；assembler、entry、resolver 不得取得 manager |
| atomic admission | `ObservationIdempotencyRepository::{reserve, mark_completed}` | `reserve` 必须同时接收 logical scope、Consumer secondary identity 和 single candidate set；`mark_completed` 必须晚于 `save_result` |
| immutable replay | `ObservationStoredResultRepository::{save_result, get_result}` | fresh/replay 共享同一 immutable stored surface；replay 只按原 pointer `get_result` |
| primary relation | Step 07 operation-specific repository | 当前没有 I05 专属授权；不得从四个候选域能力任选 primary |
| version/CAS | matching `Versioned<T>` + exact `stage_*` method | expected version 必须来自同一 committed relation read；不得使用 caller version、row count 或 current reload |
| record append | `ObservationRecordAssemblyPlan` + matching typed H-family append method | 只有 accepted primary obligation 才能 append；无 generic record bytes 或“先 append 后补 cursor” |
| cursor | `ObservationCommitClass::{Observation, Reference}` owner | 由 actual primary footprint 唯一推导；一个 UoW 只能调用一个 cursor allocator |
| outbox follower | typed immutable snapshot + `ObservationOutboxRepository::append` | 只有明确 I05 outbound source 才能 stage；没有 source 时必须是显式 empty，不是 publisher 后查找 |
| transport completion | I05 exact mapper -> `InboundConsumerCompletion` | 不属于 UoW；必须在 known commit、replay 或 exact probe 后调用一次 |

如果 future landing 是 reference-only snapshot mutation 且所有 record obligation 都是 H10，才
可能使用 `Reference` cursor；只要存在任一 Observability observation primary，整个 UoW 必须是
`Observation` class，H10 也复用同一个 cursor。I05 不得因为 Consumer 名称、输入字段含
evidence 或 repository 名称而直接选择 cursor namespace。

### 10.5 Primary、record 与 cursor 的禁止推导

| tempting inference | why it is invalid | required closure before any call |
|---|---|---|
| `GovernanceArtifactEvidenceReference` -> create/update `EvidenceLinkage` | reference 不是 linkage identity、projection、purpose、scope 或 transition | 唯一 relation key、primary owner、CAS 与 accepted branch |
| Artifact event -> append H3 | event arrival 不是 accepted audit/projection transition，也不提供 H3 post-state | exact local transition、same-UoW post-state 与 H3 obligation |
| reference-looking payload -> stage snapshot / append H10 | 没有 subject mapper、freshness decision 或 actual snapshot mutation | snapshot selector、create/update branch、H10 mapping |
| visibility/degraded -> create GapState / H8 | response disclosure 与 gap lifecycle 是不同 truth/identity | gap owner、P12 decision、accepted transition 与 record mapping |
| both repositories exist -> choose first row | capability availability does not define operation dispatch | finite I05 landing map and duplicate/mismatch precedence |
| no record mapping -> append generic audit marker | H-family 是 finite typed records；generic marker 会制造第二 owner | mapped family 或 explicit owner-approved `explicit_no_record` |
| Consumer family -> Observation cursor | cursor namespace follows actual primary footprint, not protocol family | complete accepted primary inventory |
| reference field -> Reference cursor | mixed observation writes cannot be downgraded to reference class | complete primary/record/follower footprint |
| allocate both cursors and let repositories choose | creates two commit orders and violates one-cursor invariant | exactly one derived class and allocator call |

`explicit_no_record` 也不是 owner 缺失时的默认值。它必须明确哪个 accepted primary transition
没有 H-family obligation，并仍然给出 result、completion、cursor 和 rollback 关系。当前 I05
没有该授权，因此不能把“尚未决定”写成“无 record”。

### 10.6 Save order 与 result/outbox relation

I05 future accepted branch 的 staging order 固定为以下逻辑顺序；每一步 `Ok` 只表示材料已
进入仍未提交的 UoW，不表示 durable commit 或 transport success：

1. 完成 relation read、policy decision、expected version 与 accepted primary post-state 的
   in-memory validation；不得在此阶段重新读取 current truth 来补字段。
2. 调用唯一 primary `stage_*`，保留同一 `Versioned<T>` 的 expected version 与 post-state。
3. 根据实际 primary footprint 形成 `ObservationCommitClass`，并调用对应 cursor allocator
   **一次**；cursor 来源必须是 UoW/store，不得来自 source version、row version、timestamp、
   page cursor、id generator 或 trace id。
4. 用同一 post-state 与 committed cursor materialize 已登记的 H-family record；再按静态
   dispatcher 调用对应 typed append method。记录不能先于 cursor append，也不能在 append 后
   重新 mint identity。
5. 若存在已授权的 projection membership/stale follower，使用预先冻结的 follower plan 调用
   matching stage 方法；不得通过 query、current scan 或 resolver refresh 生成 follower 集合。
6. 若存在 I05 专属 outbound source，使用 immutable typed snapshot seed 生成 outbox record /
   payload pair，并调用 `ObservationOutboxRepository::append`；不存在时保留显式 empty set。
7. 从本次已验证的 local post-state、record refs、follower refs、outbox refs、safe error/
   reason refs 组装完整 body-free `StoredObservationResult`。不得从 current rows、Artifact body、
   publisher state 或 receipt action 补 refs。
8. 先调用 `ObservationStoredResultRepository::save_result(result, uow)`，成功后才调用
   `ObservationIdempotencyRepository::mark_completed(reservation, result_ref, uow)`。
9. 只有全部 staging 成功，才调用 `ObservationUnitOfWorkManager::commit(uow)`；commit 返回
   known success 后，才向后置 I05 mapper提供 `FreshlyCommitted` access overlay。

`StoredObservationResult` 与 reservation completion 是同一 UoW 的 follower pair：不得提交
`Reserved + result_ref` 中间状态，不得先 complete 再 save result，也不得在第二个 UoW 中补写
result。result 中的 `changed_refs`、`record_refs`、`outbox_refs`、`gap_refs` 和 `error` presence
必须由同一 operation-specific result mapper预先闭合；空集合只有在 owner matrix 明确表示
“本次没有该类 accepted material”时才合法，不能由查询为空或 append 未执行临时解释。

outbox 不是 Consumer 的默认副作用。只有 S08-F 或其他明确 owner 提供 I05-compatible event
source、schema/version、typed encoder 和同一 cursor/UoW relation 后，才允许把 pair 放入写集。
若该 owner 将 outbox 声明为 mandatory，encode/append failure 必须令 primary、record、result
和 reservation completion 全部 rollback；不能把 outbox 降为 best effort 后继续返回 Stored。

### 10.7 Commit、rollback 与 exact probe matrix

下表是 future I05 writer 的设计契约，不表示当前 I05 已能进入这些分支：

| failure / branch point | open UoW 中可能存在的材料 | required visible durable result | permitted continuation |
|---|---|---|---|
| binding/schema/payload/input/digest gate fails | none；不进入 writer lane | none | body-free finite failure；不选 C-05 action |
| `begin` fails | none | none | application failure；不 reserve、不返回 accepted |
| `reserve` -> `Replay` | 仅 incoming reservation read/compare | 只读原先已提交集合 | rollback incoming handle；按 exact pointer `get_result` |
| `reserve` -> `Conflict` / `InFlight` | no accepted primary | 本次不产生新 row | rollback；保留 finite conflict/delayed classification |
| landing owner/relation missing、duplicate 或 mismatch | reservation 可能已 staged | rollback 后 none | consistency/design/dependency failure；不选择默认 target |
| primary lookup/version/transition/stage fails | reservation 和局部 candidate 可能 staged | rollback 后 none | 不分配 cursor、不 append record、不 save result |
| cursor allocation 或 record append fails | primary candidate 可能 staged | rollback 后 none；不可见 cursor gap不得复用 | 不换 family、namespace 或省略 record |
| mandatory follower/outbox stage fails | primary/record candidate 可能 staged | rollback 后 none | 不降级 best-effort、不返回 Stored |
| `save_result` fails | local candidates 可能 staged | rollback 后 none | 不调用 `mark_completed` |
| `mark_completed` fails | result 可能 staged | rollback 后 none | 不提交 `Reserved + result_ref` 中间态 |
| commit known not committed | candidates discarded | none | 只有 owner 证明 known-no-write 时才可进入该分类 |
| commit known successful | exact planned set visible atomically | primary + mapped records/followers + result + Completed reservation | 向后置 mapper 返回 validated local result |
| commit outcome unknown | visibility unknown | unknown；不得宣称成功或无写入 | exact probe；当前 carrier 不允许 completion |
| rollback outcome unknown | visibility unknown | unknown；不得宣称 rollback | exact probe；保持 indeterminate |

Step 07 的 UoW 规则要求：一个 handle 只能成功分配一次 cursor；第二次或跨 namespace 分配
必须失败，已分配但 rollback 的 cursor 允许留下不可见单调间隙但不得复用；外部网络调用不得在
UoW 持有期间发生。I05 不得把这些 technical 规则缩减成“数据库事务成功/失败”两态。

commit/probe 只能使用 reservation/result owner 的稳定关系：

```text
(operation, trusted actor, dedup key, Artifact producer, source event ref, request digest)
  -> exact reservation row
  -> exact StoredObservationResultRef
  -> immutable stored result
```

probe 不得从 `EvidenceLinkage`、`ReferenceSnapshotState`、`AuditProjection`、`GapState`、
H-family record、outbox 当前状态、消息到达顺序或 `result_ref` 字符串前缀推断提交事实。

| exact probe result | I05 continuation |
|---|---|
| Completed reservation + exact immutable result validates | 返回原 stored surface 的 `Replayed` overlay；不重跑 transition、record 或 outbox |
| no committed reservation is proven | 只有 shared owner 明确证明 known absence 时才可标记 known-no-write；是否 retry 留给后续 flow policy |
| matching reservation remains `Reserved` / in-flight | delayed/in-flight surface；不启动第二 writer |
| result pointer missing、wrong kind、relation mismatch 或 bytes corrupt | typed consistency/manual surface；不得从 current truth 补 result |
| probe unsupported / timeout / ambiguous | 保持 indeterminate；不构造 `ObservationConsumerReceipt` completion，不选择 terminal action |

### 10.8 Result persistence handoff

I05 不创建新的 result 或 receipt schema。未来 accepted branch 只把已经闭合的 operation-specific
material 交给 shared `StoredObservationResult` / `ObservationStoredConsumerReceipt` owner：

| stored surface field | required source | I05 rule |
|---|---|---|
| `result_ref` / `public_result_ref` | Step 07 typed result identities and stored-result factory | independent validated ref；不由 idempotency ref、digest、Artifact alias 或 DB locator 派生 |
| operation / actor / request digest | immutable operation context and reservation | must equal reservation and incoming validated identity；replay preserves original values |
| disposition / outcome | exact I05 result mapper | must be compatible with shared result kind；不把 `Replay`、`Acknowledge` 或 `Retry` 写成 inner disposition |
| changed/linkage/reference/gap refs | same-UoW accepted post-state and explicit owner relations | lossless, duplicate-free, body-free; no current-row reconstruction |
| record refs | actually staged typed H-family records | empty only when explicit `no_record` owner mapping exists |
| outbox refs | same-UoW registered outbox pair | explicit empty when no I05 event source; never lookup after commit |
| error / reason | finite safe `ApplicationError` / protocol error mapper | no provider text, body, digest bytes, stack, SQL or transport locator |
| stored/replay surface | immutable body-free encoded surface with retained schema/digest | `save_result` before `mark_completed`; replay validates exact bytes/schema/digest |

`ObservationConsumerResult` is the application result for the current invocation; it is not itself a
durable row and does not replace `StoredObservationResult`. `ObservationConsumerReceipt::Stored`
must decode the exact stored surface and may add only the invocation-level `FreshlyCommitted` or
`Replayed` access overlay. It must not fill missing refs from current linkage, snapshot, gap, outbox
or Artifact state. `Ephemeral` is allowed only for a separately authorized no-result branch and may
not carry `result_ref`、changed refs、record refs、outbox refs、gap refs or dead-letter refs.

The typed save/get handoff required before Step 09 is therefore:

```text
Acquired reservation
  -> exact I05 accepted local result and body-free surface
  -> StoredObservationResult::try_new(...)
  -> ObservationStoredResultRepository::save_result(result, uow)
  -> ObservationIdempotencyRepository::mark_completed(reservation, result_ref, uow)
  -> one known commit
  -> ObservationStoredResultRepository::get_result(result_ref) for replay only
```

Missing or corrupt stored result is a consistency defect. It cannot be downgraded to Ephemeral,
reconstructed from current truth, replaced by a new result identity, or converted into an ordinary
`Rejected` delivery. A duplicate same-digest invocation returns the original stored surface; it does
not rerun I05 relation lookup or create a second local observation.

### 10.9 Fake / durable semantic parity

§10 只记录 conformance target，未声称 fake 或 durable adapter 已实现、编译或通过测试。两者
必须对同一 typed input 保持相同的 visible-set、classification 和 rollback 语义：

| semantic surface | fake obligation | durable obligation | parity redline |
|---|---|---|---|
| pre-admission zero-write | ownerless payload/binding 停在 service 前，maps 不变 | 不产生 reservation、primary、record、result 或 outbox row | fake 不得为方便接受旧三字段 input |
| logical + secondary reserve | 一个临界区完成 identity/digest compare | unique constraints / transaction 原子绑定两类 identity | 两次独立 reserve、event alias 或 dedup-only key |
| target relation | exact zero/one/many 与 mismatch 语义 | bounded unique lookup + committed version/CAS | first-row-wins、scan、error-as-absence |
| primary transition | 仅执行 owner-approved finite branch | 同一 transaction stage exact post-state | private map 直接改 truth |
| cursor | 第二次或跨 namespace call fail；rollback gap 不可见且不复用 | allocator 与 transaction 强制同一规则 | fake 重用数字或 durable 每表一个 cursor |
| record/result order | append 只接受 cursor-bound typed record；result 在 record/follower 后 | same-UoW visibility；result 与 completion 原子 | result 先可见、generic bytes append、partial commit |
| outbox | registered pair 才可见；empty set 显式 | immutable snapshot/pair 与 primary 同一 boundary | publisher 后查 current truth 重建 refs |
| replay/probe | exact pointer 读 immutable stored surface | committed relation lookup，不重建 current truth | last-result cache 或 current-row拼装 |
| unknown outcome | explicit indeterminate、无 receipt/action | provider ambiguity 保留为 unknown | 自动映射 rollback、Accepted 或 Retry |

### 10.10 I05 §10 affected 与 closure order

| affected / shared dependency | 状态 | §10 结论 | 关闭条件 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | canonical payload/schema/encoder/registration 仍缺失，writer lane 不可达 | L1-artifact 或 contracts owner 提供唯一注册 payload 与兼容规则 |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | finite event-to-I05 binding 与 source/event/version adapter 仍缺失 | 上游提供有限 binding，或正式拆分 I05 |
| `S08-E-I05-REFERENCE-AUTHORITY-01` | `open_internal_affected` | local reference authority 未闭合 | source-to-local factory/relation、missing/duplicate/version 矩阵 |
| `S08-E-I05-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | exact input constructor/accessor 未发布 | Step06/07 提供 concrete fields、factory 与 validation |
| `S08-E-I05-DIGEST-AUTHORITY-01` | `open_internal_affected` | semantic digest owner/profile/material 未闭合 | upstream canonical 或 local canonicalizer 二选一 |
| `S08-E-I05-DIGEST-ORDER-01` | `open_internal_affected` | assembler/reserve/replay single candidate propagation 未证明 | 固定 frame/order/exclusion，并只生成一次 candidate |
| `S08-E-I05-PURPOSE-AUTHORITY-01` | `open_internal_affected` | purpose 与 scope compatibility 未闭合 | finite local/upstream mapper 和冲突矩阵 |
| `S08-E-I05-VISIBILITY-AUTHORITY-01` | `open_internal_affected` | local visibility/result source 未闭合 | policy/gap/degraded mapper；不进入 producer payload |
| `S08-E-I05-LINKAGE-RELATION-SOURCE-01` | `open_internal_affected` | projection/scope relation key 未闭合 | typed selector、sole lookup、version/mismatch规则 |
| `S08-E-I05-DEPENDENCY-SLICE-01` | `open_internal_affected` | least-authority I05 delegate 未闭合 | 类型层排除 evidence/retention/handoff/external writers |
| `S08-E-I05-RESULT-SURFACE-01` | `open_internal_affected` | operation-specific result refs/presence mapper 未闭合 | immutable stored surface 与 fresh/replay lossless mapping |
| `S08-E-I05-ACTION-MATRIX-01` | `open_internal_affected` | exact C-05 mapper 未闭合 | receipt/probe 后 pure/total/no-wildcard single call |
| `S08-E-I05-DURABLE-LANDING-01` | `open_internal_affected` | primary/relation/version/record/cursor/result/outbox mapping 未闭合 | 一次性给出唯一 landing 与完整 save/rollback/probe relation |
| `R06-F-AFFECT-UOW-01` | `downstream_open` | Step 07 shared UoW 规则尚须在 Step09/11/13/16 传播 | 后续跨 flow/persistence/concurrency/test 审计 |

I05 §10 的 closure order 固定为：

```text
payload schema + positive producer binding
  -> complete input + semantic/request digest candidate
  -> unique primary/relation/version/transition
  -> one-UoW cursor/record/follower plan
  -> stored-result save before reservation completion
  -> known commit or exact probe
  -> result/receipt validation
  -> I05 action mapper in Step09
```

任何一步未闭合，都只能停在 affected/open 或 current zero-write，不得由后一步反向补洞。

### 10.11 §10 stop review 与下一读取边界

| 检查项 | 结论 |
|---|---|
| 用户授权范围 | `pass`；本批只读取 I05 §10 所需 SOP、Step06/07 UoW/result/repository owner、I05 §1~§9 与 I04 §10 粒度参考；未进入 I05 §11、I06~I09、S08-F/G、Step09、formal 或实现代码 |
| current durable reachability | `pass_with_affected_open`；由于 payload/binding/input/landing 未闭合，当前 accepted write set 为空；不伪造 reservation、primary、record、result、receipt 或 action |
| landing authority | `not_closed`；EvidenceLinkage、snapshot、audit/projection、gap 仍为候选能力；新增 `S08-E-I05-DURABLE-LANDING-01`，不任选 primary |
| UoW/save order | `pass_at_target-contract_level`；单一 UoW、单一 cursor、primary -> record/follower/outbox -> result -> completion -> commit 顺序已固定；assembler/entry/resolver 无 UoW 权限 |
| rollback / probe | `pass_with_affected_open`；所有 pre-commit failure whole-set rollback；commit/rollback/probe unknown 保持 indeterminate，不生成 completion/action |
| result persistence | `pass_with_affected_open`；复用 typed `save_result` / `get_result` 与 `mark_completed`；Stored/Ephemeral、FreshlyCommitted/Replayed 不互相替代，missing/corrupt 不从 current truth 重建 |
| fake/durable parity | `pass_at_design-record_level`；已列出 reserve、CAS、cursor、record/result order、outbox、replay、unknown 的 parity target；未运行 adapter/test |
| truth / no-write | `pass_at_design-record_level`；I05 不拥有或反写 Artifact truth、evidence body、retention、report handoff 或 external delivery |
| affected / blocker | I05 专属 13 项全部开放：2 项 `open_upstream_internal`、11 项 `open_internal_affected`；本批新增 `S08-E-I05-DURABLE-LANDING-01`，无关闭项、无新的上游 blocker |
| current protocol count | 保持 `34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`；`0/60` 无条件 complete；I05 为 `in_progress_S01-S10_with_affected_open`，不计入 defined |
| formal / implementation / test / evidence | formal `03` 继续 frozen；实现、测试、scan、runtime evidence、commit、run_id、真实 evidence alias 与验收签署均 `not_run_not_claimed` |
| 下一动作 | 立即停审；用户确认后只进入 I05 §11，审查 stored result reachability、exact replay、receipt surface 与 completion eligibility；不得进入 I05 §12、I06~I09、S08-F/G、Step09 或 formal 回填 |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I05_S01-S10_recorded_with_affected_open_waiting_user_before_I05_S11
```

现在必须停审。未经用户明确确认不得进入 I05 §11；不得读取或写入 I05 §12以后、I06~I09、
S08-F/G、Step09~19、正式 `03`、任何 `04` 文件或实现代码；当前不需要提交。

该段为 I05 §10 historical checkpoint；current 状态由下方 §11 承接。

## 11. Historical stored result reachability、exact replay、receipt surface 与 completion eligibility

本节只审查 I05 application result 如何从同一 reservation / UoW 到达 immutable stored
surface，如何按原始 pointer 做 exact replay，如何映射到 shared Consumer receipt，以及何时
具备向后置 C-05 mapper 交付 completion 输入的资格。本节不选择 I05 的 durable landing、
不创建新的 result / receipt / error / replay / action 类型，也不把 current disabled slot
伪装成 runtime rejection。

§10 已固定 future writer 的顺序为 `save_result -> mark_completed -> commit`，但这只说明
持久化 handoff 的顺序，不等于当前已有 stored result。I05 的 canonical payload、positive
Artifact event binding、完整 input、candidate 和唯一 landing 仍未闭合，因此本节必须严格
区分 current zero reachability 与 future owner-complete target contract。

### 11.1 Owner、surface 分层与 current reachability

| concern | canonical owner | I05 use-site rule | forbidden substitute |
|---|---|---|---|
| immutable application result | Step 06 `StoredObservationResult` / `StoredObservationReplaySurface` / `BodyFreeSerializedResult` | 只有 exact reservation、operation、actor、request digest、kind、schema、bytes 和 digest 全部通过校验后才能消费 | `EvidenceLinkage`、snapshot、audit/projection、gap 当前行、Artifact event body 或新建空 result |
| internal result pointer | Step 06 / Step 07 `StoredObservationResultRef` | 只由 completed reservation 提供给 `ObservationStoredResultRepository::get_result` | public `BodyFreeRef`、source event ref、record ref、outbox ref、字符串前缀扫描 |
| application invocation result | shared `ObservationConsumerResult` | 只表示已完成 typed result handoff；不能把 pre-admission `Err` 转成空 `Ok` | `Rejected` / `NoOp` 冒充 zero-write，或伪造 result ref |
| public stored receipt | S08-B `ObservationStoredConsumerReceipt` + `ObservationConsumerReceipt::Stored` | exact decode immutable stored bytes，并按 I05 presence matrix 无损映射 | generic map、current repository join、按 outcome 猜 refs |
| public ephemeral receipt | S08-B `ObservationConsumerReceipt::Ephemeral` | 只由具名 worker mapper为有限无 stored-result 分支构造；不得携带 durable refs | empty Stored、Accepted/NoOp/Quarantined 的 ephemeral 伪造 |
| invocation access | shared `ObservationProtocolResultAccess` | `FreshlyCommitted` 或 `Replayed` 只描述本次访问路径，不写入 inner stored surface | 新增 `Duplicate` durable outcome、改写 original outcome |
| transport completion | I05 exact worker mapper -> C-05 private registrar | 本节只定义 eligibility；不选择 `Acknowledge`、`Retry` 或 `DeadLetter` | receipt factory 选 action、registrar 二次分类、wildcard/default |

当前 I05 的实际可达链在 canonical binding 之前停止：

```text
static I05 slot inspection
  -> no positive Artifact event binding
  -> no canonical ArtifactEvidenceContextPayload decoder
  -> no complete ConsumeArtifactEvidenceContextInput
  -> no RequestDigestCandidates
  -> no atomic reservation
  -> no Acquired / Replay / Conflict / InFlight result
  -> no StoredObservationResult or ObservationConsumerResult
  -> no Stored/FreshlyCommitted or Stored/Replayed receipt
  -> no C-05 completion
```

因此 current I05 同时不能 fresh commit，也不能跳过 payload 直接 replay。即使存储中偶然
存在看似相同的 result，也没有足够的 canonical input、I05 producer binding 和 candidate
来证明 incoming request 与该 result 属于同一 operation / actor / event identity。当前
slot 保持 `disabled / fail closed`；不产生 `UnsupportedSchema`、`Rejected`、`Delayed` 或
任何其他 runtime receipt 作为 disabled 的替代描述。

### 11.2 Future fresh handoff 与 exact replay sequence

以下两条序列都是 future target contract，只在 §4~§10 的 affected 按 owner 顺序闭合后
才可达。它们共享同一 immutable inner receipt，不共享第二套 result 或 replay schema。

Fresh accepted path：

```text
validated I05 envelope + canonical payload + complete input
  -> one RequestDigestCandidates value
  -> begin one I05 UoW
  -> reserve logical scope + I05/Artifact/source-event identity
  -> Acquired
  -> exact I05 landing / record / follower / outbox staging
  -> construct StoredObservationResult(kind = ConsumerReceipt)
  -> save_result(result, uow)
  -> mark_completed(reservation, result_ref, uow)
  -> commit(uow) returns known success
  -> decode exact ObservationStoredConsumerReceipt
  -> validate I05 presence matrix
  -> add result_access = FreshlyCommitted
  -> pass typed receipt to the later I05 action mapper
```

Replay path：

```text
validated complete I05 input + the same candidate set
  -> derive exact logical scope and (I05, Artifact, source_event_ref) identity
  -> atomic reserve(scope, event identity, candidates)
  -> Replay(idempotency_ref, stored_result_ref)
  -> rollback / discard incoming writer UoW with no new durable effect
  -> cross-check logical and secondary indexes point to one reservation
  -> require reservation = Completed and pointer = stored_result_ref
  -> get_result(exact StoredObservationResultRef)
  -> StoredObservationResult::try_rehydrate(...)
  -> validate_replay_for(reservation, incoming_context)
  -> replay_surface.verify_integrity()
  -> require result_kind = ConsumerReceipt and retained I05 decoder
  -> exact-decode ObservationStoredConsumerReceipt
  -> validate I05 consumer/source/outcome/ref/error presence matrix
  -> return immutable inner surface unchanged
  -> add result_access = Replayed
  -> pass typed receipt to the later I05 action mapper
```

Replay never calls the I05 assembler again, does not rerun relation lookup, does not allocate a
cursor, does not append a record or outbox, and does not read current Artifact or Observability
truth to repair the stored surface. The `Replayed` overlay belongs only to the current invocation;
it is not part of `BodyFreeSerializedResult`, stored digest, reservation row or inner outcome.

### 11.3 Exact replay validation order and integrity rules

The following order is part of the replay contract. A later check cannot compensate for an earlier
missing relation, and a failed check cannot fall back to another decoder or another repository.

| order | required check | defect classification | prohibited continuation |
|---:|---|---|---|
| 1 | `Replay` contains non-empty typed `idempotency_ref` and `StoredObservationResultRef` | reservation/result-pointer invariant defect | no receipt, no writer rerun |
| 2 | logical scope and `(ConsumeArtifactEvidenceContext, Artifact, source_event_ref)` resolve to the same reservation | missing, duplicate or cross-index consistency defect | no alias row, no first-row choice |
| 3 | reservation state is `Completed` and its pointer equals the returned result pointer | completed-result relation defect | no current-row reconstruction |
| 4 | `get_result(pointer)` returns exactly one immutable result | missing or duplicate stored result | no Ephemeral downgrade, no latest-result lookup |
| 5 | result operation, actor, idempotency ref and request digest equal reservation and validated incoming context | cross-operation / cross-actor / digest mismatch | do not expose old surface, do not overwrite incoming identity |
| 6 | `result_kind` is exactly `ConsumerReceipt`, and retained schema has the exact I05 decoder | family/schema compatibility defect | no Command/Job decoder, no implicit schema upgrade |
| 7 | bounded bytes, canonical framing and stored digest verify exactly | truncation, noncanonical bytes or digest mismatch | no repair, reserialize, logging or return of raw bytes |
| 8 | decoded `consumer_name` is `ConsumeArtifactEvidenceContext` and stored `source_event_ref` equals the validated secondary identity | cross-consumer/source mismatch | no event-name cast, no incoming-value overwrite |
| 9 | outcome, collection ordering, duplicate rejection and error/dead-letter co-presence satisfy shared matrix and I05 policy | malformed receipt surface | no current linkage/gap/outbox fill-in |
| 10 | `result_access = Replayed` is assigned only after checks 1~9 pass | access-order defect | no speculative replay receipt |

The two reservation lookups are cross-checks, not alternative truth sources. A missing row, two
different rows, a state mismatch or different result pointer is a consistency defect. Digest
compatibility must use the single `RequestDigestCandidates` owner; the replay mapper never hashes
raw envelope bytes, Artifact payload, current rows or public receipt fields.

### 11.4 Fresh / replay access overlay and stored / ephemeral separation

| invocation branch | inner surface | access overlay | durable effect for this invocation | I05 status |
|---|---|---|---|---|
| current disabled/unbound delivery | none | none | none | current reachable only as design-level disabled state; no runtime receipt |
| future accepted UoW with known commit | exact stored Consumer receipt from that UoW | `FreshlyCommitted` | the one owner-authorized I05 set | conditional target |
| future compatible completed duplicate | exact original immutable stored receipt | `Replayed` | none | conditional target |
| future owner-authorized durable negative/no-op | exact committed stored receipt | fresh or replay according to access path | only named owner set | not currently authorized |
| future typed pre-writer failure with no stored result | none | none | none | `Ephemeral` may be constructed only by later exact mapper if shared matrix permits |
| commit / rollback / probe unknown | no validated surface | neither | unknown | no receipt and no completion |

`Stored` and `Ephemeral` are shape-level alternatives. A Stored receipt requires a validated
immutable inner surface and known commit (or an exact replay of one); it always has a public
`result_ref` and the stored fields required by the shared schema. An Ephemeral receipt has no
`result_ref`, changed refs, record refs, outbox refs, gap refs or dead-letter ref. It may carry only
the finite safe error and the fields allowed by the shared absence matrix.

An application `ObservationConsumerResult` is not itself a durable row. `save_result` success
before commit is not `FreshlyCommitted`; a reservation that merely exists is not `Replayed`.
The access overlay is assigned only after known commit or exact immutable rehydration.

### 11.5 I05 receipt field provenance and presence matrix

The public receipt mapper consumes either a validated stored result or a separately classified
ephemeral input. It never queries current repositories to fill a missing field.

| public field | stored source | I05 rule | ephemeral / missing rule | forbidden fallback |
|---|---|---|---|---|
| `consumer_name` | static I05 registration and retained receipt | exactly `ConsumeArtifactEvidenceContext`; must equal operation discriminator `0x0305` | static expected name only after a valid I05 slot; not derived from payload | Artifact event name, topic, route or handler type |
| `source_event_ref` | validated shared envelope on fresh path; original stored surface on replay | required and equal to secondary reservation identity; replay never replaces it | `None` only for the shared missing/malformed source-event rejection shape; other eligible ephemeral branches require `Some` | dedup key, message id, offset, relay ref or new local ref |
| `outcome` | exact stored `ObservationConsumerOutcome` | replay preserves original value; fresh value must be supported by the committed local fact | only the shared finite ephemeral subset; exact I05 mapping remains later affected work | Artifact state, transport action, error severity or event name |
| `result_ref` | stored `StoredObservationResult.public_result_ref` mapped to public `BodyFreeRef` | required for every Stored receipt; internal pointer is never exposed | structurally absent | internal repository pointer, evidence alias, outbox ref |
| `changed_refs` | same-UoW accepted I05 local post-state and authorized relation refs | lossless, canonical and duplicate-free; empty only when the operation matrix says no changed local ref | structurally absent | current linkage/snapshot diff or Artifact state |
| `outbox_refs` | exact stored receipt field / validated stored accessor | explicit empty is a stored value; replay preserves it byte-for-byte | structurally absent | post-commit publisher scan, event-name inference or default empty |
| `gap_refs` | same-UoW owner-authorized local gap relation | presence and order come from stored surface; visibility text cannot create one | structurally absent | current gap table, Artifact nonconformity or error count |
| `dead_letter_ref` | committed local dead-letter marker relation | only co-present with the exact stored terminal surface that authorizes it | structurally absent | broker locator, transport action or temporary marker |
| `error` | stored finite `ObservationProtocolErrorSurface`, or validated ephemeral mapper | stored presence is immutable; replay preserves exact safe projection | required only for the shared eligible ephemeral/error branch | provider text, body, stack, SQL, transport detail or placeholder |
| `result_access` | current invocation after all validation | exactly `FreshlyCommitted` or `Replayed`; never part of inner stored bytes | absent by shape | durable outcome, boolean success or `Duplicate` variant |

The presence of a reference-looking field proves only an Observability-owned body-free protocol
surface. It never proves Artifact evidence authenticity, Artifact business correctness, retention
protection, report handoff acceptance or external delivery success.

### 11.6 Outcome and receipt eligibility matrix

The matrix below records the boundary that the later I05 error/action review must consume. It does
not select a C-05 action and does not close the existing action affected.

| situation | stored surface eligible | receipt shape | completion eligibility | reason |
|---|---|---|---|---|
| accepted I05 local mutation, all refs/result fields staged, known commit | yes | `Stored/FreshlyCommitted` | eligible for later exact mapper review | immutable local result is complete |
| compatible completed duplicate with all replay checks passing | yes, original only | `Stored/Replayed` | eligible for later exact mapper review | no new write; original surface is intact |
| owner-approved durable no-op or negative result, if later authorized | conditional | `Stored/FreshlyCommitted` or `Stored/Replayed` | only after the exact stored surface is validated | no generic no-op inference |
| typed pre-writer dependency/in-flight branch with no stored result | no | eligible `Ephemeral` only if shared matrix and later I05 mapper permit | not decided here | no durable result exists |
| malformed/missing header before a valid I05 slot | no | no current I05 receipt; disabled slot remains fail closed | not eligible | structural activation gap is not runtime rejection |
| stored result pointer missing after Completed reservation | no valid surface | no Stored and no Ephemeral downgrade | not eligible | consistency defect |
| stored bytes corrupt, wrong kind/schema or digest mismatch | no valid surface | no Stored and no Ephemeral downgrade | not eligible | immutable surface integrity defect |
| commit or rollback probe unknown | unknown | no receipt | not eligible | cannot assert durable or no-write outcome |
| C-05 call fails after known commit | original Stored surface remains valid | no reclassification of receipt | action transport recovery only | local commit is not undone |

Receipt eligibility is not the same as action selection. Even a valid Stored receipt must first be
passed once to the future I05 pure/total/no-wildcard mapper. The mapper may only consume a typed
receipt, commit certainty and the later finite recovery policy; it may not inspect current truth or
reclassify the application result.

### 11.7 Missing / duplicate / corrupt result handling

The following cases are consistency defects, not ordinary business outcomes:

| defect | required classification | required behavior | forbidden repair |
|---|---|---|---|
| Completed reservation has no result pointer | reservation/result relation defect | stop before receipt and completion; emit only the later safe consistency surface | create a new result, use `None` as success, or query current truth |
| pointer resolves to zero rows | stored-result missing defect | no Stored, no Ephemeral downgrade, no action | latest-result lookup, current-row reconstruction |
| pointer resolves to multiple rows | stored-result uniqueness defect | stop; do not choose first row | first-row-wins or alias creation |
| result operation / actor / digest differs | cross-scope consistency defect | do not expose or overwrite the stored result | incoming identity substitution or replay under another actor |
| wrong `StoredObservationResultKind` | family mismatch | stop; do not use Command/Job decoder | decoder fallback or `UnsupportedSchema` disguise |
| retained schema unsupported | compatibility defect | stop; preserve absence of receipt | implicit migration or latest-schema decode |
| bytes malformed, truncated or digest mismatched | immutable surface corruption | stop; do not return raw bytes or reserialize | repair in mapper, trim, hash again or body logging |
| collection order/duplicate/presence invalid | receipt schema defect | stop before access overlay | sort away the defect, fill missing refs or default empty |

None of these defects authorizes I05 to write Artifact truth, evidence body, retention marker,
report handoff, external delivery state or a compensating local observation. A later recovery owner
may probe or manually repair the durable relation, but that is not an I05 replay shortcut.

### 11.8 Completion eligibility boundary

The only valid handoff direction is:

```text
validated I05 application result / exact replay surface
  -> I05 receipt validation
  -> I05 completion-eligibility input
  -> one later exact C-05 mapper call
  -> private registrar executes the selected action
```

The application service does not return a transport action, the receipt factory does not choose an
action, and the registrar does not inspect repository truth. A completion input is eligible only if
all applicable conditions below hold:

1. The I05 slot and producer/event binding were validly activated, or the invocation is an exact
   replay of an already valid stored I05 result.
2. The result is either a complete Stored surface with known commit or a shared-approved Ephemeral
   surface with a finite safe error; current disabled state and unknown probe do not qualify.
3. Stored result pointer, operation, actor, source event, request digest, schema, bytes, refs and
   error presence have passed the applicable matrix.
4. `FreshlyCommitted` or `Replayed` is assigned only once, after validation, and is not written
   into the inner result.
5. The later I05 action mapper receives a typed total input and is the sole place that may choose
   C-05 `Acknowledge`, `Retry` or `DeadLetter`; no default arm is permitted.

Completion is prohibited when commit certainty is unknown, a completed result is missing/corrupt,
the slot is disabled, the event binding is absent, or the mapper would need to inspect current
Artifact/Observability truth to fill a field. In those cases I05 must not manufacture a terminal
transport action merely to make the worker callback total.

### 11.9 No-current-truth reconstruction and body-free ceiling

Fresh and replay paths must preserve the same body-free ceiling established in §8~§10:

- no Artifact content, evidence body, trace body, provider response, credential, locator or raw
  transport bytes enter result, receipt, error, outbox, dead-letter or diagnostics;
- no request-digest bytes, semantic-digest bytes, stack, SQL detail, topic/partition/offset or
  debug dump enter a public surface;
- no missing `changed_refs`, `gap_refs`, `outbox_refs`, `error` or dead-letter ref is reconstructed
  from current tables, publisher state, visibility text or event arrival order;
- no replay calls current Artifact truth, current linkage, snapshot, projection, gap or outbox
  queries to regenerate the original inner surface;
- no `Replayed` overlay is persisted, hashed into the stored surface or converted into a new
  `Duplicate` outcome;
- no receipt, action, ack, retry or dead-letter signal is treated as evidence linkage, retention
  protection, report handoff or business-truth acceptance.

If the stored surface contains a safe typed reference, it remains an Observability-owned projection
reference. It is not permission to resolve or mutate the referenced Artifact truth.

### 11.10 Affected and closure review

No new I05-specific affected is created in §11. Existing gaps are sufficient to represent all
unresolved reachability:

| affected / shared dependency | §11 conclusion | status after §11 |
|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | no canonical payload means no valid fresh or replay admission | `open_upstream_internal` |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | source event alone cannot select an I05 result | `open_upstream_internal` |
| `S08-E-I05-REFERENCE-AUTHORITY-01` | receipt refs cannot be filled by Artifact producer or current lookup | `open_internal_affected` |
| `S08-E-I05-CONTROL-FIELD-SOURCE-01` | exact context is missing, so reservation/result compatibility is unprovable | `open_internal_affected` |
| `S08-E-I05-DIGEST-AUTHORITY-01` | semantic digest cannot replace request or stored-surface integrity digest | `open_internal_affected` |
| `S08-E-I05-DIGEST-ORDER-01` | one candidate set must reach reserve, save and replay unchanged | `open_internal_affected` |
| `S08-E-I05-PURPOSE-AUTHORITY-01` | purpose cannot be inferred from receipt outcome or Artifact event name | `open_internal_affected` |
| `S08-E-I05-VISIBILITY-AUTHORITY-01` | visibility cannot decide result/gap/error presence | `open_internal_affected` |
| `S08-E-I05-LINKAGE-RELATION-SOURCE-01` | linkage refs require an owner-backed relation, not current-row reconstruction | `open_internal_affected` |
| `S08-E-I05-DEPENDENCY-SLICE-01` | result access must not expose downstream writers | `open_internal_affected` |
| `S08-E-I05-RESULT-SURFACE-01` | I05 field/presence matrix still lacks a published lossless accessor | `open_internal_affected` |
| `S08-E-I05-ACTION-MATRIX-01` | completion mapper remains a later exact, total, no-wildcard seam | `open_internal_affected` |
| `S08-E-I05-DURABLE-LANDING-01` | no unique primary/result source has been authorized | `open_internal_affected` |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | stored outbox refs must come from the immutable surface | `open_internal_affected` |
| `S08-CONSUMER-QUARANTINE-REF-01` | I05 cannot mint or expose an ownerless quarantine ref | `open_internal_affected` |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | unknown commit or corrupt result has no legal terminal completion | `open_internal_affected` |
| `R06-F-AFFECT-UOW-01` | result/completion atomicity remains downstream propagation work | `downstream_open` |

The existing shared affected set, `R06.6-F2-H13-UPSTREAM=open_controlled`, and `03-RPR-S09-PER-FLOW`
remain unchanged. §11 adds no upstream blocker and closes no affected. I05 remains outside the
`defined` count.

### 11.11 §11 stop review and next reading boundary

| check | conclusion |
|---|---|
| user authorization | `pass`; only I05 §11 materials, Step 06/07 stored-result and receipt owners, S08-B carrier and I04 §11 granularity were used; no I05 §12, I06~I09, S08-F/G, Step09, formal or implementation material entered this batch |
| current result reachability | `pass_with_affected_open`; canonical payload/binding/input/candidate remain absent, so no reservation, stored result, receipt or C-05 completion is reachable |
| owner reuse | `pass`; no parallel result, receipt, error, replay, access or action type was created |
| fresh/replay contract | `pass_with_affected_open`; fresh requires known same-UoW commit, replay requires exact pointer, cross-index relation and full integrity/presence validation |
| Stored/Ephemeral | `pass_at_target_contract_level`; shapes are mutually exclusive, Stored keeps immutable refs, Ephemeral has no durable refs, and current disabled state creates neither runtime shape |
| receipt provenance | `pass_with_affected_open`; all ten shared fields have a source, presence rule and forbidden fallback; I05-specific result/ref authority remains affected |
| missing/corrupt result | `pass`; consistency defect only; no current-truth reconstruction, Ephemeral downgrade, new result identity or terminal action |
| completion eligibility | `not_closed`; only a later named I05 mapper may choose C-05 action after receipt/probe, and unknown/missing/corrupt/disabled branches are ineligible |
| truth / no-write | `pass_at_design-record_level`; result and receipt remain body-free Observability projections and do not own or write Artifact truth, evidence body, retention, report handoff or external delivery |
| affected / blocker | all 13 I05-specific affected remain open: 2 upstream and 11 internal; no new upstream blocker was found; shared Consumer affected remains open |
| protocol count | unchanged at `34/60 defined_with_affected_open`; Query `14/14`, Consumer `4/9`, `0/60` unconditional complete; I05 remains uncounted |
| formal / implementation / evidence | formal `03` remains frozen; no implementation, test, scan, runtime evidence, commit, run_id, evidence alias or acceptance signoff was run or claimed |
| next allowed action | stop immediately; after explicit user confirmation, read only I05 §12 error mapping, exception branches and recovery handoff; do not enter §13, I06~I09, S08-F/G, Step09 or formal assembly |
| current submission | not needed; user did not request a commit |

Current recovery point:

```text
Step08_S08-E_I05_S01-S11_recorded_with_affected_open_waiting_user_before_I05_S12
```

The review is stopped here. Without explicit confirmation, do not read or write I05 §12 and later,
I06~I09, S08-F/G, Step09~19, formal `03`, any `04` file or implementation code. Do not create a
commit.

The preceding §11 stop review is now a historical checkpoint. Current I05 status is owned by §12
below; no §11 conclusion is upgraded to runtime or implementation evidence.

## 12. I05 protocol error mapping, exception branches and recovery handoff

本节只处理 I05 `ConsumeArtifactEvidenceContext` 的 error mapping、异常分支和 recovery
handoff。这里的“§12”是 I05 独立中间产物的小节，不等于全局详细设计 Step 12。
`ProtocolError`、`DomainError` 和 `ApplicationError` 分别继续由 Step 06
`contracts::errors`、`domain::errors` 和 `application::errors` 唯一拥有；public error 继续使用
S08-B `ObservationProtocolErrorCode` / `ObservationProtocolErrorSurface`。本节不创建 I05 私有
error、recovery 或 action enum，也不把 application error 直接转换成 broker action。

I05 当前没有 canonical `ArtifactEvidenceContextPayload`、finite Artifact event binding、完整
input、request-digest candidates 或唯一 durable landing。因此所有错误必须先分成两类：

1. **结构性设计 / activation 缺口**：owner、schema 或 finite binding 根本不存在。I05 slot
   必须保持 disabled/fail closed，不产生 delivery receipt、recovery class 或 C-05 action。
2. **未来合法 slot 的单次 runtime delivery error**：只有 payload owner、event binding、decoder、
   input constructor 和 runtime registration 全部闭合后，一个具体 delivery 才能进入有限的
   protocol/domain/application error mapping。

Ownerless payload 或 binding 不是 `UnsupportedSchemaVersion`，也不是 temporary dependency
failure。把结构性缺口伪装成 `UnsupportedSchema`、`Delayed` 或 `Retry` 会令 worker 无限重投一个
无法由相同输入修复的设计问题，并可能把 Artifact raw body 错误送入 dead-letter。下文始终保持两类
分支隔离。

### 12.1 Authority, scope and mapping order

#### 12.1.1 Error, public projection and recovery authority

| concern | current authority | I05 use | prohibited fallback |
|---|---|---|---|
| envelope / typed ref validation | Step 06 `contracts::errors::ProtocolError` | static I05 slot、shared header、typed source/event/version ref、schema token和route/body一致性 | generic invalid string、Artifact event name、provider code或payload字段名判断 |
| domain invariant / policy input | Step 06 `domain::errors::DomainError` 20-variant enum | body-free、reference/linkage、purpose、visibility/gap和relation invariant | expected restricted/not-visible decision当error、I05 private domain error或文本classifier |
| application / port / transaction | Step 06 `application::errors::ApplicationError` | digest、idempotency、resolver/repository、CAS、UoW、stored result与commit certainty | raw adapter exception、SQL/driver code、message parsing或I05 error wrapper |
| public projection | S08-B `ObservationProtocolErrorSurface` | finite code、已有safe reason/gap ref和recovery-derived `retryable` | raw error、临时mint evidence/reason/gap ref、Artifact truth解释文本 |
| recovery posture | S08-B forward vocabulary；唯一 enum owner 与 total mapper 尚待后序全局 Step 12 重审 | 本节只登记 I05 target mapping | 在I05复制enum、从outcome/severity推断，或把冻结后序文件反向当current owner |
| transport action | C-05 `InboundConsumerCompletion` + I05 exact worker mapper | receipt/probe全部验证后一次性选择 `Acknowledge/Retry/DeadLetter` | application返回action、registrar重分类、wildcard/default `Retry` |
| transport execution failure | existing `WorkerError::AckFailed/DeadLetterFailed` | selected action执行失败后的worker-local error | 回滚local commit、重跑application、创建I05 transport error enum |

既有 `03_ddd_step_12_error_recovery.md` 中存在 `ObservationRecoveryClass` 声明，但它是
Step 08 per-protocol repair 之前形成的后序材料，当前只能作为 `historical_material / downstream
repair input`。Step 06 没有 current enum owner，S08-B 只有前向词表。因此 shared affected
`S08-RECOVERY-CLASS-OWNER-01` 保持开放：后序全局 Step 12 必须重审唯一 module owner、八类
finite posture、`ApplicationError` total mapper、public `retryable` 派生和 no-wildcard tests。
本节使用八个候选名称固定 I05 target requirement，不声称该 owner 已可实现。

#### 12.1.2 Fixed mapping order

```text
composition-root I05 activation closure
  -> authenticated worker binding and static I05 selection
  -> shared envelope/header and typed-reference validation
  -> finite Artifact event binding and registered schema selection
  -> redaction-first canonical payload decode
  -> I05 local reference / purpose / visibility / linkage authority checks
  -> one complete private input and one request-digest candidate set
  -> atomic logical + secondary identity admission
  -> exact durable target / domain decision / one UoW
  -> stored result / reservation completion / commit certainty
  -> public receipt or typed error projection
  -> exact I05 C-05 mapper
  -> transport action execution
```

该顺序不可交换：

1. Composition root 只有在两个 upstream blocker 与所需 local constructor/mapper 均闭合后，
   才能暴露 I05 callback。缺少 owner/binding 是 activation failure，不是 delivery outcome。
2. Static slot、authenticated actor binding 和 shared header 必须在 payload decode 前验证。
3. Finite Artifact event binding 必须选中唯一 canonical payload/schema；不得尝试八个 Artifact
   event decoder、做字段并集或按名称猜 payload。
4. Body-free decode、local reference/purpose/visibility/linkage authority 全部通过后，application
   才能形成完整 input，并只生成一次 `RequestDigestCandidates`。
5. 只有完整 input 才能 reserve；只有 `Acquired` 才能进入未来唯一 durable landing。
6. Stored result 必须先于 reservation completion 保存；known commit 之前不得构造
   `Stored/FreshlyCommitted`，commit/rollback unknown 不得构造 terminal receipt。
7. Public mapper只消费 typed owner variant与safe refs；I05 action mapper再消费 validated
   receipt、commit certainty、recovery posture和exact policy。Registrar只执行已选 action。

早期错误不得被后续层重新分类。Ownerless payload 不是 repository unavailable；missing/corrupt
stored result 不是 unsupported schema；post-commit ack failure也不能反向改写 committed local
receipt。Valid restricted/not-visible/degraded policy decision属于正常 typed decision，只有其
basis、relation或持久化不变量损坏时才进入 `DomainError` / consistency mapping。

### 12.2 I05 internal error inventory

下表列出 I05 use-site 必须覆盖的内部错误。`owner variant` 只引用 current Step 06 owner；标记为
`structural affected` 的行不产生 runtime error variant。Future mapper必须显式穷举，不得使用
wildcard arm、错误文本、provider status或 outcome-only switch。

| detection point | owner variant / classification | exact I05 trigger | local side-effect rule | target recovery posture |
|---|---|---|---|---|
| I05 activation closure | structural affected | canonical payload、finite Artifact event binding、required local constructor/mapper任一未闭合 | 不注册可调用I05 slot；无delivery receipt、reservation或transport action | design correction；不是runtime recovery class |
| static slot/body selection | `ProtocolError::RouteBodyMismatch` | selected operation不是I05或concrete payload type不匹配 | 不解析payload，不构造input/digest | `RetryAfterInputChange` |
| authenticated binding / envelope | `ProtocolError::InvalidEnvelope` | trusted actor/producer binding或required envelope structure缺失/冲突 | 不进入payload decoder、assembler或writer | `RetryAfterInputChange` |
| required typed refs | `EmptyReference`、`MalformedReference`、`WrongReferenceOwner`或`IncompatibleReferenceKind` | source-event/source/version/dedup/trace typed role非法 | 只保留允许的safe header stage；无accepted write | `RetryAfterInputChange` |
| source/version relation | `InvalidSourceVersion`或future exact application relation error | source-version不属于同producer/source，或payload试图覆盖header version | 不按occurred-at/cursor/schema/arrival order选winner | `RetryAfterInputChange` |
| producer-event binding | structural affected | current 8个Artifact outbound event均没有finite event-to-I05 mapping | fail activation；不得全量订阅、first-match或试解码 | design correction；不是dependency outage |
| registered but unsupported schema | `ProtocolError::UnsupportedSchemaVersion`或`ApplicationError::UnsupportedSchemaVersion` | future已注册I05 schema family收到不在supported set内的version | 不decode、不digest、不reserve | `DoNotRetrySameInput` |
| canonical payload owner | structural affected | `ArtifactEvidenceContextPayload`只有Observability use-site、无owner/encoder/registration | fail activation；不得创建本仓DTO/alias/aggregate | design correction；不是`UnsupportedSchemaVersion` |
| malformed canonical payload | `ProtocolError::InvalidEnvelope`或`ApplicationError::InvalidRequest` | future exact decoder确认required/unknown/duplicate/tag/encoding错误 | 丢弃partial DTO；不得hash、debug或保存offending material | `RetryAfterInputChange` |
| forbidden Artifact body | `ApplicationError::Domain(DomainError::BodyFreeBoundaryViolation)` | content、lineage body、review/verdict/signoff、provider response、credential/locator或unsafe nested material越界 | raw material不进入input、digest、result、marker、telemetry或dead-letter | pre-write=`RetryAfterInputChange`；若已持久化=`ManualIntervention` |
| effective actor authority | `ProtocolError::InvalidEnvelope`；future exact denial由owner mapper处理 | trusted actor缺失、不属于activated binding，或payload试图覆盖actor | 不从payload/tenant/role生成替代actor | missing=`RetryAfterInputChange`；deterministic denial=`DoNotRetrySameInput` |
| local reference authority | `ApplicationError::Domain(DomainError::ReferenceBoundaryViolation)`、`ReferenceConflict`或`RelationMismatch(...)` | producer提交完整local identity/state/reason，或source ref无法唯一绑定local reference | 不mint alias、不选first/newest relation、不进入writer | input defect=`RetryAfterInputChange`；persisted defect=`ManualIntervention` |
| Artifact semantic digest authority | `InvalidRequest`、`SuppliedDigestMismatch`、`DigestMaterialEncodingFailed`或persisted digest variants，按owner精确选择 | semantic digest缺失/冲突、profile/material错误，或被误作request digest | reserve前失败；不得raw hash、复制optional digest或空值补齐 | input mismatch=`DoNotRetrySameInput`；deterministic/persisted defect=`ManualIntervention` |
| complete request digest | `DigestMaterialEncodingFailed`或persisted digest variants | common frame或future payload segment无法canonicalize，或retained profile/material不一致 | 无candidate不reserve；已存冲突不重算 | `ManualIntervention` |
| purpose authority | `InvalidRequest`或exact `DomainError::RelationMismatch(...)` | producer选择本地purpose、purpose未注册，或family/purpose/scope不兼容 | 不默认purpose，不按event name/product推导 | caller/binding defect=`RetryAfterInputChange`；persisted relation=`ManualIntervention` |
| visibility/gap authority | normal typed decision，或`RelationMismatch(...)` / `GapInvariantViolation` | producer提交local visibility、policy input不完整/错绑，或persisted visibility/gap relation损坏 | normal restriction不当error；损坏分支不写local projection/result | state/input change或`ManualIntervention`，按exact cause |
| linkage selector/relation | `MissingRequiredReference`、`RelationMismatch(...)`、`ReferenceConflict`或`PersistenceInvariantViolation` | projection/consumer scope缺失，sole relation为zero/multiple/foreign/version mismatch | 不选第一行、不按ref prefix/digest绑定、不mint replacement | missing input/state=`RetryAfterInputChange`/`RetryAfterStateChange`；persisted corruption=`ManualIntervention` |
| idempotency conflict | `ApplicationError::IdempotencyConflict` | same logical/event scope对应different retained-profile request digest | 保留winning reservation/result；不把winner receipt作为本次result | `DoNotRetrySameInput` |
| idempotency in flight | `ApplicationError::IdempotencyInFlight` | exact matching reservation仍为`Reserved`且无completed result | 不启动第二writer、不mint alias reservation | `RetryAfterStateChange` |
| durable landing authority | structural affected | current没有唯一primary/relation/version/transition/record/no-record mapping | 不begin writer，不从repository capability任选landing | design correction；不是repository outage |
| future required target absent | `OwnedStateNotFound`或`DomainError::MissingRequiredReference`，仅在landing owner闭合后使用 | exact authorized target/relation经typed lookup确认不存在 | 不切换aggregate、不创建replacement identity | `RetryAfterStateChange`或`RetryAfterInputChange`，按owner语义 |
| future relation/invariant conflict | `RelationMismatch(...)`、`ReferenceConflict`、`HandoffInvariantViolation`或`PersistenceInvariantViolation` | selected target、scope、purpose、visibility、linkage、version或result relation不一致 | rollback/discard；不选first/newest/default | persisted defect=`ManualIntervention` |
| optimistic write conflict | `ApplicationError::OptimisticConflict` | future exact selected primary的expected version已被并发winner改变 | whole-set rollback；旧version不可复用 | `RetryAfterReload` |
| temporary typed dependency failure | `RepositoryUnavailable`、`ReferenceUnavailable`或`ResolverUnavailable` | owner已闭合且某次exact repository/resolver调用临时不可用 | 不补造reference、visibility、linkage、digest或accepted fact | `RetryAfterDependencyRecovery` |
| serialization / result assembly | `SerializationFailed`、`RecordAssemblyInvariantViolation(...)`或`PersistenceInvariantViolation` | canonical result/record bytes或cross-field invariant不能成立 | commit前whole-set rollback；不降级为空result/NoOp | deterministic defect=`ManualIntervention` |
| outbox / stored-result invariant | `OutboxInvariantViolation`、`OutboxPayloadMissing/Corrupt`、`CompletedReservationResultMissing`或`StoredResultKindMismatch` | same-UoW follower不完整，或completed reservation immutable result损坏 | 无public stored receipt；不得current-truth重建 | `ManualIntervention` |
| known whole-UoW commit abort | `ApplicationError::CommitFailed` | backend明确证明整个I05 UoW未提交 | 不返回stored/fresh receipt，不mark completed | 仅在no-write proof后`RetryAfterDependencyRecovery` |
| commit outcome unknown | `ApplicationError::CommitOutcomeUnknown` | commit调用无法证明成功或失败 | 不返回terminal receipt/action；只probe exact reservation/result relation | `ProbeBeforeRetry` |
| rollback outcome unknown | `ApplicationError::RollbackFailed` | rollback后write visibility无法证明 | 不声称no-write，不重启mutation | `ProbeBeforeRetry`或`ManualIntervention` |
| post-commit acknowledgement | `WorkerError::AckFailed` | local commit和receipt已知，broker ack执行失败 | 保留committed result；未来delivery只走exact replay | transport-owned probe/replay；不重跑application |
| post-commit dead-letter handoff | `WorkerError::DeadLetterFailed` | local terminal marker/result已知，dead-letter调用失败 | 保留local marker/result；不保存raw Artifact body、不再造marker | transport-owned probe/replay；不重跑application |

`ApplicationError::ReferenceUnavailable` 只适用于 owner 已存在而某次 resolver/repository call
临时失败，不能承载“source-to-local reference factory尚未设计”。同理，
`UnsupportedSchemaVersion` 只适用于已注册schema family收到不支持版本，不能承载“payload owner
或event binding不存在”。这两个区分是 I05 activation 与 retry safety 的硬门禁。

I05 没有 application-owned external finalize branch，不得选择 `RetryFinalizeOnly`。
`ExternalDeliveryFailed` / `ExternalFinalizeUnknown` 不是 I05 本地 evidence/linkage处理的合法错误；
broker ack/dead-letter execution也不是application finalize。Transport恢复由worker/registrar owner
处理，不能重写 I05 stored receipt 或重复local mutation。

### 12.3 Public error projection for I05

`ObservationProtocolErrorSurface` 只能在 exact owner variant、public code、safe ref presence 和
recovery target全部可证明后构造。Structural affected不进入public projection；composition root必须
在暴露callback前失败。若错误部署仍暴露未闭合slot，应停止该slot并返回runtime assembly failure，
不得伪造一个可ack/retry/dead-letter的I05 receipt。

| I05 condition | internal source | public code / outcome target | ref and error presence | recovery target / target `retryable` |
|---|---|---|---|---|
| missing/malformed shared header | exact `ProtocolError` | `MissingRequiredField`或`InvalidReference`; `Ephemeral/Rejected` | source event仅在已安全decode时Some；error required；无durable refs | `RetryAfterInputChange` / false |
| wrong static producer/operation/body binding | `RouteBodyMismatch` / `InvalidEnvelope` | `InvalidRequest`; `Ephemeral/Rejected` | 不读取payload；error required | `RetryAfterInputChange` / false |
| future registered unsupported version | `UnsupportedSchemaVersion` | `UnsupportedSchemaVersion`; `Ephemeral/UnsupportedSchema` | validated source event required；无payload/result refs | `DoNotRetrySameInput` / false |
| current ownerless payload/event binding | structural affected | **no public I05 code or receipt** | no legal runtime error/result carrier | activation blocked；no runtime bool |
| malformed canonical payload | `InvalidRequest` / protocol validation | `InvalidRequest`; `Ephemeral/Rejected` | error required；不得带partial field/hash | `RetryAfterInputChange` / false |
| forbidden Artifact body crossing | `DomainError::BodyFreeBoundaryViolation` | `BodyFreeBoundaryViolation`; normally `Ephemeral/Rejected` | raw body absent；只有owner已有safe reason时可Some | `RetryAfterInputChange` / false |
| actor binding absent | `InvalidEnvelope` | `MissingRequiredField`; `Ephemeral/Rejected` | 不暴露actor detail、role或credential | `RetryAfterInputChange` / false |
| future exact typed actor denial | future authority decision owner | `ActorNotAllowed`; expected rejection | owner-provided safe reason only | `DoNotRetrySameInput` / false |
| upstream/local reference malformed or cross-owner | typed protocol/domain reference error | `InvalidReference`; `Ephemeral/Rejected` | 不mint local ref、evidence alias或result | `RetryAfterInputChange` / false |
| purpose/scope input incompatibility | `InvalidRequest` / exact relation error | `InvalidRequest`或`PolicyRejected`; expected rejection | no result refs；safe reason only if pre-existing | `RetryAfterInputChange` / false |
| persisted reference/linkage/visibility/gap relation corrupt | domain/persistence invariant | `ConsistencyFailure`; no accepted receipt | safe operations context only；不得补current refs | `ManualIntervention` / false |
| valid restricted/not-visible/degraded policy result | typed normal decision | not automatically an error；future durable/result owner decides exact stored outcome | only committed owner refs | not classified until landing/result owner closes |
| idempotency digest conflict | `IdempotencyConflict` | `IdempotencyConflict`; ephemeral rejection | winning result不可作为本次result；error required | `DoNotRetrySameInput` / false |
| exact reservation still in flight | `IdempotencyInFlight` | `DependencyUnavailable`; `Ephemeral/Delayed` | source event Some；no result/change/outbox/gap refs | `RetryAfterStateChange` / false |
| proven temporary typed dependency outage | repository/reference/resolver unavailable | `DependencyUnavailable`; `Ephemeral/Delayed` only before accepted write | no synthetic local truth/ref | `RetryAfterDependencyRecovery` / true |
| optimistic conflict | `OptimisticConflict` | `VersionConflict`; no accepted receipt | no winning state/result disclosure | `RetryAfterReload` / true |
| deterministic canonicalization/result invariant | digest/serialization/persistence invariant | `ConsistencyFailure`; no accepted receipt | no raw bytes、digest detail或Artifact material | `ManualIntervention` / false |
| completed reservation result missing/corrupt | result consistency variants | `ConsistencyFailure`; no Stored or synthetic Ephemeral success | no invented result/ref；safe error only | `ManualIntervention` / false |
| known whole-UoW commit abort | `CommitFailed` with no-write proof | `DependencyUnavailable`; no stored receipt | all accepted refs absent | `RetryAfterDependencyRecovery` / true |
| commit/rollback remains unknown | `CommitOutcomeUnknown` / `RollbackFailed` | `CommitOutcomeUnknown`; current carrier has no legal terminal receipt | no speculative refs/outcome/action | `ProbeBeforeRetry` / false |
| exact completed replay | no error | original `Stored/Replayed` receipt | original inner outcome/refs/error unchanged | no handler retry；worker replay policy only |

表内 `retryable` 是 `S08-RECOVERY-CLASS-OWNER-01` 关闭后的目标派生值，不是current可落码
声明。按S08-B forward contract，只有 `RetryAfterReload`、`RetryAfterDependencyRecovery` 和
`RetryFinalizeOnly` 派生true；其余五类为false。I05没有`RetryFinalizeOnly`分支。唯一recovery
owner和total mapper闭合前，entry不得手写bool，也不得由`Delayed`、public code、severity、
provider status或transport policy反推。

Public code是安全语义投影，不是一对一internal enum serialization。Temporary
`ReferenceUnavailable`可以映射`DependencyUnavailable`；persisted relation丢失/损坏必须映射
`ConsistencyFailure`。Valid visibility restriction或gap classification是normal decision，不能因为
public code中存在`NotVisible` / `StaleProjection`就绕过I05 durable/result owner自行选择outcome。

### 12.4 Exception branch and write-visibility matrix

下表“no write”指无I05 reservation、primary mutation、H-family record、cursor、stored result、
reservation completion、accepted outbox或local terminal marker变为可见。Current I05在结构性owner
闭合前不应暴露callback；future行只固定合法slot的异常语义。

| branch | detection point | staged local facts | required handling | durable audit / marker rule | worker handoff |
|---|---|---|---|---|---|
| owner/binding closure failure | composition root | none | fail I05 activation；不订阅或暂停slot | 不写unsupported/gap/dead-letter marker掩盖设计缺口 | no C-05 completion |
| static route/body mismatch | registrar / entry | none | reject before payload decode | no accepted audit/outbox | no default action |
| malformed required header/ref | envelope validator | none | legal slot内才可形成typed ephemeral rejection | no local result/marker | exact I05 policy later |
| registered unsupported schema | schema gate | none | 不试其他Artifact schema/decoder | no accepted/stale/fresh marker | no generic retry/dead-letter |
| malformed canonical payload | exact decoder | none | discard partial DTO；不hash/debug offending fields | no accepted audit/result | exact policy later |
| forbidden/raw Artifact body | body-free gate | none；raw material永不stage | reject；只有owner授权的body-free local lane可另行提交 | raw/hash/base64/debug不得进入marker、telemetry或dead-letter | no severity-based action |
| reference/digest/purpose/visibility authority failure | assembler relation gates | none | fail closed；不使用default/current lookup/producer local field | no local reference/linkage/gap/result | input/state/manual classification |
| digest canonicalization failure | canonicalizer before reserve | none | typed error；不得mint new key或用semantic digest替代 | no accepted event/audit | no action |
| completed exact replay | reservation + exact result lookup | incoming writer absent/discarded | validate immutable pointer/bytes/digest/receipt then return original surface | no second primary/record/outbox/gap/audit | replay policy may ack current delivery |
| idempotency conflict | atomic reserve | no admitted writer | preserve winner；do not expose old receipt | no new marker/event | no winner-derived action |
| idempotency in flight | atomic reserve | no admitted writer | typed delay only under legal slot | no second reservation/completion | retry only after exact policy |
| selected target absent/relation invalid | future typed lookup | no accepted transition | rollback/discard；不切换aggregate或mint replacement | no record/outbox/result | input/state/manual classification |
| valid restricted/degraded decision | future policy decision | depends on exact owner branch | consume only through durable/result owner；normal negative不是exception | only explicitly owned body-free fact | unresolved until exact result |
| domain invariant rejects mutation | domain member/policy | candidates may exist only in memory | rollback whole writer UoW | normal negative marker only if exact owner says durable | exact public mapper |
| optimistic conflict | primary save | staged primary/record/follower/result candidates | rollback；new delivery must reload full canonical state | no partial record/outbox/result | reload eligibility only |
| record/outbox/result staging failure | UoW staging | earlier accepted candidates staged | rollback whole set；no result-less or follower-less commit | no partial follower/audit | dependency/manual by exact variant |
| reservation completion failure | mark-completed stage | primary/record/result staged | rollback whole set；never expose FreshlyCommitted | no dangling completed row | no action |
| known commit abort | UoW commit | all facts staged, none proven committed | return known no-write error only after backend proof | no compensating success event | later retry only after dependency recovery |
| commit/rollback unknown | UoW manager / exact probe | visibility unknown | no receipt/action；probe exact identities/result only | no speculative committed/rolled-back marker | current C-05 has no legal completion |
| commit known, ack fails | transport registrar | complete local result committed | preserve exact result；map `AckFailed` | no duplicate primary/record/outbox/result | later delivery exact replay |
| terminal marker known, dead-letter fails | transport registrar | local terminal fact committed | preserve marker/result；do not rerun handler | no raw Artifact body or second marker | transport recovery/probe |

任何异常分支都不得读取current `EvidenceLinkage`、reference snapshot、audit projection、gap row、
H record、outbox或Artifact truth来补缺失result/error字段。唯一允许的post-commit reads是owning
repository对exact reservation、stored-result、local marker和正式commit/transport probe relation的
读取；current并无transaction-status probe，不能用local memory、cursor gap或单行absence替代。

### 12.5 Recovery-class handoff for I05

下表是I05对八类候选posture的完整目标映射，是`S08-RECOVERY-CLASS-OWNER-01`的use-site
requirement，不是第二个enum声明。Recovery class只描述下一次安全动作的前置条件，不定义重试次数、
backoff、broker action、operator runbook或transport exit code。

| recovery class | I05 examples | next owner / allowed action | target public bool | hard prohibition |
|---|---|---|---:|---|
| `DoNotRetrySameInput` | registered unsupported schema、different-digest conflict、deterministic actor denial、immutable supplied digest mismatch | producer/caller改变schema/logical input，或由正式owner改变binding/state后形成新attempt | false | 原payload/key循环、把winner receipt暴露给conflict |
| `RetryAfterInputChange` | malformed header/ref/payload、forbidden body、producer提交local identity/visibility/purpose、missing trusted binding | 修正typed input后重新做完整admission | false | default/ref cast、hash后继续、静默删除required field |
| `RetryAfterStateChange` | matching reservation in flight、合法local relation/target尚未建立 | 等待owner state变化后重新做完整admission | false | timer-only blind loop、second writer、伪造Accepted/NoOp |
| `RetryAfterReload` | future exact primary/reference/linkage CAS conflict | whole-set rollback，reload canonical `Versioned<T>`并重评全部relation/policy | true | 复用旧expected version或只重做save尾段 |
| `RetryAfterDependencyRecovery` | owner已存在时的temporary repository/resolver/UoW outage、known no-write commit abort | dependency恢复后从完整admission重新开始 | true | 把unavailable当NotVisible/NoOp/Accepted，或补造resolver result |
| `RetryFinalizeOnly` | current I05无application-owned case | I05 mapper不得选择；external delivery/finalize由其自身owner处理 | true only where another owner proves it | 重做I05 local mutation、把broker ack/dead-letter当application finalize |
| `ProbeBeforeRetry` | commit/rollback unknown、known commit后的transport action certainty未知 | 先probe exact reservation/result/marker/transport identity，再分流replay、proven no-write或manual | false | probe前选择Acknowledge/Retry/DeadLetter或重跑handler |
| `ManualIntervention` | completed result缺失/损坏、persisted forbidden body、broken relation/index、deterministic invariant/canonicalization failure | operations/design owner修复或正式分类；automation fail closed | false | 从current truth重建immutable surface或伪装普通rejection |

Current canonical payload、event binding、reference constructor和durable landing缺失不进入上述
runtime table；它们由设计、upstream和composition owner在activation前修正。尤其不能把它们标为
`RetryAfterDependencyRecovery`，因为等待repository恢复不会生成payload owner；也不能构造
`ManualIntervention` public receipt，因为当前没有合法I05 delivery surface。

### 12.6 C-05 completion eligibility boundary

Application assembler/service返回typed input/result/error，不返回
`InboundConsumerCompletion::{Acknowledge, Retry, DeadLetter}`。Future I05 exact worker mapper必须
同时消费：

```text
slot_activation_proof
  + commit_certainty
  + receipt branch (Stored / Ephemeral)
  + immutable inner outcome and result_access
  + typed ref/error presence
  + recovery-class mapping
  + exact I05 transport policy
```

| validated condition | C-05 eligibility | required proof | current status |
|---|---|---|---|
| structural payload/event/reference/landing owner gap | none；handler slot不得激活 | closure evidence absent by definition | blocked by existing I05 affected；no receipt |
| `Stored/FreshlyCommitted/Accepted` | acknowledgement may be eligible | exact selected UoW committed，stored receipt revalidated | future only；landing/result affected open |
| `Stored/Replayed` original outcome | duplicate delivery may be acknowledged under exact replay policy | exact pointer、bytes/digest/presence、logical/secondary relation；no rerun | future only；shared target known |
| owner-authorized durable `NoOp` / negative result | only exact I05 policy may choose action | committed result/error/marker co-presence | future only；cannot infer from empty changed refs |
| stored `DeadLettered` | dead-letter only when local terminal fact and policy require it | known commit、dead-letter ref、error/result presence | future only；action cannot create marker |
| ephemeral delayed + proven dependency recovery | retry may be eligible after bounded policy | no accepted write、owner已闭合、temporary cause proven | no immediate loop；not structural gap |
| ephemeral rejected / unsupported schema | no generic action follows from outcome | exact producer/schema/input policy | no default ack/dead-letter |
| completed result missing/corrupt | no terminal receipt/action | consistency defect means valid receipt is absent | shared indeterminate boundary open |
| commit/rollback unknown after available exact reads | no C-05 action with current carrier | certainty still absent | `S08-CONSUMER-INDETERMINATE-COMPLETION-01` |
| action execution fails after known commit | do not rerun I05 handler | stable stored receipt/result relation | `WorkerError` + transport recovery only |

本节固定eligibility和禁止项，不选择每个I05 outcome的exact terminal action。
`S08-E-I05-ACTION-MATRIX-01`继续要求一个I05具名、pure、total、no-wildcard mapper；
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`继续承接current C-05无法表示no-completion的shared
carrier gap。两者不能互相代替，也不能用默认`Retry`暂时绕过。

### 12.7 Consistency-defect catalog

下列缺陷不是普通producer input error，不能通过重新投递I05自动修复。Pre-activation owner gap与
committed consistency defect仍不同：前者阻止slot激活，后者说明本应完整的durable relation已损坏。

| defect | detection | required result | forbidden repair |
|---|---|---|---|
| registry声称I05 active但缺canonical event/payload owner | composition-root closure audit | activation failure；operations-visible assembly issue | 把任意Artifact event当I05或返回UnsupportedSchema receipt |
| registered event/schema与finite I05 binding不一致 | static catalog validation | activation failure；no subscription exposure | first-match、wildcard event、八decoder trial |
| completed reservation无internal result pointer | reservation relation | `CompletedReservationResultMissing` / consistency failure | ephemeral rejection、Delayed或重跑mutation |
| result pointer解析为zero/multiple rows | exact result repository | persistence invariant / manual | first/newest/global scan或mint alias |
| result kind/schema/operation不匹配 | stored-result validator | `StoredResultKindMismatch` / consistency failure | 用Command/Job decoder或current schema重编码 |
| stored bytes超界、noncanonical或digest mismatch | immutable surface verifier | integrity consistency failure；bytes undisclosed | print、truncate、rehash raw bytes或current serializer修补 |
| reservation/result scope、event、actor或request digest不一致 | cross-relation validator | consistency failure；no old receipt exposure | 覆盖reservation、alias event或把它当compatible duplicate |
| stored receipt outcome/ref/error co-presence非法 | Consumer receipt factory | consistency failure；no public receipt | current linkage/gap/outbox查询补字段 |
| persisted result/marker含forbidden Artifact body/material | redaction/integrity scan | body-free boundary + manual containment | hash/base64/truncate后继续使用 |
| local reference/linkage selector解析为zero/multiple/foreign row | future exact relation repository | relation/persistence consistency failure | 任选一行、按prefix/digest绑定、mint replacement |
| persisted purpose/visibility/gap provenance丢失或冲突 | local policy/result validation | consistency failure；no default purpose/Visible/NotVisible | 从Artifact state、event name或current gap猜测 |
| mark-completed可见但result尚不可见 | reservation/result atomic relation | consistency failure；probe/manual | 重跑handler或把reservation改回Reserved |
| committed primary缺mandatory mapped record/outbox/result relation | future selected landing validator | persistence invariant / manual | 从current primary重建immutable follower |
| rollback failure、transaction probe不存在或probe仍unknown | UoW/probe owner | unknown visibility；no completion | 声称no-write、默认Retry或用cursor gap推断 |

安全诊断只允许携带finite operation、error/defect kind、stage和已经授权的body-free refs。不得携带
Artifact payload/content/lineage/review/verdict、stored bytes、expected/actual digest、provider body、
SQL/driver text、stack、topic/partition/offset、credential、endpoint或从current truth重建的解释文本。

### 12.8 Audit, marker and telemetry boundary

Error handling不创建第二套audit truth，也不把telemetry当作commit、Artifact acceptance或evidence
proof。

| situation | allowed durable write / telemetry | prohibited write or claim |
|---|---|---|
| structural owner/binding gap | startup/runtime assembly issue using finite operation and affected ID | no I05 receipt、reservation、gap、dead-letter、evidence或audit result |
| malformed pre-admission input | body-free bounded telemetry after redaction gate | no raw body/hash/base64、local truth marker、stored rejection或Artifact feedback write |
| normal restricted/not-visible/degraded decision | only the exact owner-authorized local body-free result in its selected UoW | telemetry-derived visibility、gap、purpose或policy truth |
| accepted future local projection | exact selected primary/record/outbox/result set in one known commit | claim Artifact truth accepted、evidence generated、report ready或external handoff complete |
| exact replay | original immutable stored surface plus invocation-level replay telemetry | no second audit/event/outbox/gap/result identity and no replay-as-new-evidence |
| known rollback | bounded failure telemetry with no committed-success claim | compensating success/failure business event or fabricated no-write evidence |
| commit/rollback unknown | indeterminate stage telemetry and exact body-free probe context | speculative committed/rolled-back marker、terminal receipt或action |
| ack/dead-letter execution failure after commit | worker-local action-stage telemetry and existing stored relation | rollback local result、copy raw payload to dead-letter、mint replacement marker |
| consistency defect | finite defect kind and authorized operations correlation | immutable-surface rewrite、current-truth reconstruction、real evidence alias或acceptance signoff |

Log fields、metric labels、trace attributes与native audit event必须继续使用低基数finite kind和
redacted body-free context。`source_event_ref`、request digest、semantic digest、trace correlation、
stored-result pointer和Artifact refs不得明文进入log/label；需要关联时只使用既有授权opaque
correlation boundary。Telemetry不能成为business truth、commit proof、evidence alias、retention marker、
report handoff receipt或external delivery receipt，也不得反写Artifact truth。

### 12.9 I05 §12 affected and closure review

§12没有发现新的上游blocker，也没有关闭既有affected。I05专属13项仍为2项上游、11项本仓：

| affected | §12 disposition | closure owner / required evidence |
|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | open upstream；ownerless payload是activation failure，不是runtime schema error | L1-artifact或明确跨项目contracts owner提供schema/encoder/registration/compatibility |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | open upstream；8个Artifact event均不可被错误mapper自行admit | producer/binding owner提供finite positive/negative catalog和typed adapter |
| `S08-E-I05-REFERENCE-AUTHORITY-01` | open；reference error不能掩盖缺失factory | Step06/07固定source-to-local factory/lookup及absence/duplicate/conflict mapping |
| `S08-E-I05-CONTROL-FIELD-SOURCE-01` | open；header错误映射依赖完整private field/accessor relation | Step06/07补complete input constructor、immutable/consuming access和header parity |
| `S08-E-I05-DIGEST-AUTHORITY-01` | open；semantic/request/persisted integrity digest不得互相替代 | canonical owner、profile/material/order和conflict totality |
| `S08-E-I05-DIGEST-ORDER-01` | open；error/replay必须消费同一candidate set | assembler/reserve/save/replay传播唯一v1 frame与single computation |
| `S08-E-I05-PURPOSE-AUTHORITY-01` | open；purpose输入错误不得按event name/default修复 | local finite mapper和family/purpose/scope compatibility |
| `S08-E-I05-VISIBILITY-AUTHORITY-01` | open；normal restriction与persisted invariant必须可区分 | local policy/result mapper、gap/degraded precedence与source proof |
| `S08-E-I05-LINKAGE-RELATION-SOURCE-01` | open；missing/duplicate/foreign relation需exact typed mapping | minimal selector、bounded sole-row lookup及version/scope matrix |
| `S08-E-I05-DEPENDENCY-SLICE-01` | open；temporary dependency error只能来自least-authority callable | I05 private delegate逐项回指ports并静态排除downstream/external writers |
| `S08-E-I05-RESULT-SURFACE-01` | open；public consistency/receipt mapping需要lossless stored source | unique result owner、stored accessor和I05 field/presence total mapper |
| `S08-E-I05-ACTION-MATRIX-01` | open；本节固定eligibility/recovery input但未形成具名mapper | Step06/07具名pure/total/no-wildcard mapper；Step09一次调用；Step16 planned cuts |
| `S08-E-I05-DURABLE-LANDING-01` | open；landing缺失是design gap而非repository error | Step06/07/09选定唯一primary/no-record branch、one-UoW/save order和commit proof |

Shared `S08-RECOVERY-CLASS-OWNER-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-QUARANTINE-REF-01`、`S08-CONSUMER-INDETERMINATE-COMPLETION-01`和
`R06-F-AFFECT-UOW-01`保持原状态。`R06.6-F2-H13-UPSTREAM=open_controlled`不是I05直接blocker；
`03-RPR-S09-PER-FLOW`仍等待后续唯一`ConsumeArtifactEvidenceContextFlow`承接。

Closure order保持：

```text
canonical payload/schema + finite Artifact event binding
  -> complete input/reference/digest/purpose/visibility/linkage authority
  -> least-authority dependency slice + unique durable landing
  -> immutable result/receipt and known commit/replay proof
  -> shared recovery owner + ApplicationError total mapping
  -> I05 pure/total/no-wildcard action mapper
  -> Step09 exact flow + Step16 planned branch/absence/redaction cuts
```

当前slot仍disabled/fail closed，I05不计入`defined`。本节只形成error/recovery target contract，
不声称任何mapper、adapter、test、runtime path或transport behavior已经实现或运行。

### 12.10 §12 stop review and next reading boundary

| check | conclusion |
|---|---|
| user authorization | `pass`；只读取I05 §12所需current error owner、shared public carrier、C-05/worker boundary、commit-unknown contract、I04 §12粒度参考和I05 §1~§11；未进入§13、I06~I09、S08-F/G、Step09、formal或实现代码 |
| owner reuse | `pass`；复用`ProtocolError`、`DomainError`、`ApplicationError`、public error surface、C-05和existing worker errors；未创建I05 private error/recovery/action enum |
| structural/runtime split | `pass`；ownerless payload/binding/landing明确为activation failure，不映射UnsupportedSchema、Delayed、Retry或public receipt |
| internal/public mapping | `pass_at_target_contract_level`；detection、owner variant、write ceiling、public code/presence和recovery target已逐分支固定；current mapper仍未实现 |
| recovery owner | `affected_open`；八类target vocabulary及I05 use-site totality已固定，但唯一owner、`ApplicationError` total mapper、retryable派生和no-wildcard tests继续由`S08-RECOVERY-CLASS-OWNER-01`承接 |
| `RetryFinalizeOnly` | `not_applicable`；I05无application-owned external finalize，broker ack/dead-letter也不得冒充finalize |
| C-05 eligibility | `pass_with_affected_open`；known valid receipt才可进入exact mapper；unknown、missing/corrupt、disabled均无合法completion；action matrix与shared no-completion gap仍开放 |
| consistency / no reconstruction | `pass`；missing/corrupt stored result、broken relation、unknown transaction均不降级Ephemeral、不从current truth重建、不选择terminal action |
| audit / truth boundary | `pass_at_design-record_level`；error、receipt、telemetry和dead-letter保持body-free，不拥有或反写Artifact truth、evidence body、retention、report handoff或external delivery |
| affected / blocker | I05专属13项全部保持开放：2项upstream、11项internal；没有新增上游blocker、没有关闭项；shared affected保持原状态 |
| protocol count | 保持`34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`、`0/60`无条件complete；I05仍不计入defined |
| formal / implementation / evidence | formal `03`继续frozen；没有实现、测试、scan、runtime evidence、commit、run_id、真实evidence alias或验收签署被运行或声称 |
| next allowed action | 立即停审；用户确认后只进入I05 §13，读取concurrency、idempotency和reentry protection材料；不得进入§14、I06~I09、S08-F/G、Step09或formal assembly |
| current submission | not needed；用户未要求commit |

Current recovery point:

```text
Step08_S08-E_I05_S01-S12_recorded_with_affected_open_waiting_user_before_I05_S13
```

现在必须停审。未经用户明确确认不得进入I05 §13；不得读取或写入I05 §14以后、I06~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码。当前不需要提交。

该段是 I05 §12 的历史停审记录。用户随后授权一次性完成压缩阶段 M1，因此以下 §§13~17
在本轮形成 I05 的完整 Step 08 设计记录；这不表示 open owner、runtime activation、实现、
测试或 evidence 已完成。

## 13. I05 concurrency、idempotency 与 reentry protection

本节固定未来合法 I05 slot 的并发和重入契约。由于 canonical Artifact payload、有限 producer
event binding、完整 local input 与唯一 durable landing 仍未闭合，当前 reservation 数量和当前
accepted write set 都是零；本节不得被解释为 runtime reachability。

### 13.1 并发资源与唯一 owner

| 资源 | canonical owner | I05 key / guard | 禁止替代 |
|---|---|---|---|
| logical admission | `ObservationIdempotencyRepository` | `(ConsumeArtifactEvidenceContext, effective_actor_ref, dedup_key)` | source event、semantic digest、trace、offset、arrival time |
| secondary delivery identity | 同一次 atomic reservation | `(ConsumeArtifactEvidenceContext, Artifact, source_event_ref)` | dedup alias、delivery id、Artifact event name |
| retained request digest | 原 reservation | 一个 `RequestDigestCandidates` 集合及 retained profile | current profile、Artifact semantic digest、重新编码 payload |
| durable target guard | `S08-E-I05-DURABLE-LANDING-01`关闭后指定的 owner | exact target relation + repository version/CAS | reservation state、latest row、first linkage、cursor |
| result completion | stored-result 与 idempotency repository 的同一 UoW | exact `StoredObservationResultRef`，先 save 后 `Completed` | public result ref、receipt outcome、current-truth lookup |
| transport completion | I05 具名 C-05 mapper | validated receipt、commit certainty、recovery class、static policy | error text、outcome-only switch、wildcard `Retry` |

Logical admission 与 target concurrency 是两个独立 guard。reservation 只授权一次 writer
attempt，不证明 selected linkage/reference/projection/marker 仍处于读取版本；target CAS 也不能
替代 logical + secondary event 的原子 admission。

### 13.2 固定顺序与当前 zero-reservation proof

```text
activation proof
  -> authenticated finite Artifact event binding
  -> shared header validation
  -> exact typed payload decode and redaction gates
  -> complete private I05 input
  -> one canonical request-digest candidate set
  -> atomic reserve(logical scope, secondary event identity, candidates)
  -> Replay / Conflict / InFlight, or one Acquired writer
  -> exact future landing relation and version guard
  -> one target decision and one staged write set
  -> save exact stored result
  -> mark the same reservation Completed
  -> commit once, or probe by both original identities
  -> validate receipt and invoke the I05 mapper once
```

前四个箭头当前不可达。任何 caller 都不得用 control-only input、空 payload segment 或 synthetic
Artifact mapping 跳过这些门禁并进入 reserve。结构性 activation failure 不写入
`Conflict`、`InFlight`、`UnsupportedSchema`、`NoOp` 或 dead-letter fact。

### 13.3 Atomic reservation outcome matrix

| outcome | 必须证明 | 合法行为 | 禁止行为 |
|---|---|---|---|
| `Acquired` | 两个 identity 均不存在，且一次性创建了带 exact candidates 的 reservation | 进入一次 future target read/decision/UoW | 后补 secondary alias、修改 profile、在 delivery 内重试 transition |
| `Replay` | 两个 identity 指向同一 `Completed` row，stored-result relation 与 integrity 全通过 | 读取 exact stored pointer，返回 immutable receipt + `Replayed` access | 重跑 assembler/service、刷新 visibility、current-row 补 refs |
| `Conflict` | logical identity冲突，或两个 index 不一致 | 按精确原因进入 typed rejection/consistency/manual path | 暴露 winner、覆盖 digest、mint second key、把 event 绑到 winner |
| `InFlight` | 两个 identity 指向同一 compatible `Reserved` row | 在 future exact mapper 下做 bounded delayed 处理 | recursive polling、second writer、默认 `Retry`、持久化 generic delayed state |
| retained profile unreadable | row 存在但 canonical comparison 不可执行 | consistency/manual recovery，不完成 receipt | 只比较 current profile，或降级普通 conflict |

Logical 与 secondary identity 必须在一个 atomic decision 中建立。先插 logical row 再 best-effort
附加 source-event alias 会产生竞态，禁止采用。incoming event 不得替换原 actor、producer、source、
schema、payload、digest profile 或 stored result。

### 13.4 并发场景与重入矩阵

| 场景 | 获胜资源 | 结果 | 写入可见性 |
|---|---|---|---|
| 两个 delivery 使用相同 logical/event identity | first atomic reservation | 一个 writer；另一个 `InFlight` 或完成后的 exact `Replay` | 最多一个 accepted UoW |
| 同 logical、不同 source event、相同 candidate | existing logical row | 除非未来 binding 明确提供 alias，否则 conflict | 不产生第二写入 |
| 不同 logical、相同 source event | secondary event index | conflict/consistency defect，一个 upstream event 不得驱动两次 I05 | 不产生第二写入 |
| 相同 identity、不同 request digest | retained digest | conflict，不暴露 winner surface | 不变更 |
| semantic Artifact digest 不同 | canonical payload/relation invariant | input conflict 或 persisted consistency defect | 不产生新 writer |
| reservation 后 target version 改变 | future target CAS | optimistic conflict，整组 staged writes rollback | reservation 不可完成 |
| `save_result` staging 成功、completion 失败 | same UoW | rollback whole set | 不产生 orphan result |
| commit outcome unknown | original scope + event identity | 进入 exact dual-index probe | 不 speculative retry/补偿 |
| known commit 后 broker ack 失败 | worker/transport action owner | 保留 committed result，后续 exact replay | application writer 不重开 |

### 13.5 Exact replay 与 reentry guard

public receipt 组装前必须逐项证明：

1. 两个 original indexes 指向一个 reservation，且不存在 competing row；
2. 状态为 `Completed`，且恰有一个 stored-result pointer；
3. operation、actor、producer、source event、source/version、schema、retained request digest 一致；
4. result kind 为 Consumer receipt，schema、canonical bytes、integrity digest 均有效；
5. result surface 指名 I05 并重复原 source event；
6. outcome-specific changed/outbox/gap/dead-letter/error presence 通过 §11 matrix；
7. 所有 refs 保持 body-free，不需要 current Artifact 或 Observability lookup 补字段。

missing、duplicate 或 incompatible relation 都是 consistency defect。replay 不得调用 I05
assembler、resolver、policy、domain transition、cursor allocator、outbox encoder 或 current-truth
repository 修复旧 result。`Replayed` 只是 invocation access overlay，不存储、不进入原 digest。

### 13.6 Commit-unknown probe

```text
commit or rollback outcome unknown
  -> retain original logical scope, event identity and digest candidates
  -> load by logical scope
  -> load by inbound event identity
  -> require both reads to agree on one row or proven no-write
  -> Completed: validate exact stored pointer and surface
  -> Reserved: classify in-flight without opening another writer
  -> both absent only with adapter-level no-write proof: known-no-write path
  -> disagreement/corruption/unsupported probe: no terminal C-05 completion
```

Current Step 07 没有能覆盖所有 adapter 的 transaction-status probe。`S08-CONSUMER-INDETERMINATE-
COMPLETION-01` 保持开放；unknown 不得因为单次 read absent 或 timeout 被转成 `Retry`、
`Acknowledge`、`DeadLetter`、`Ephemeral` 或新 reservation。

### 13.7 Accepted writer 与 action prerequisite

只有 `Acquired` 可进入 future writer：选择一个 owner-approved landing，读取一个 exact
relation/version，执行一次 transition，只 staging 该 transition 的 primary/record/cursor/outbox/
result 集合，先保存 result、再完成 reservation、最后 commit 一次。只有 future landing owner
明确定义 durable no-change fact 时才可产生 stored `NoOp`；不能为了使 disabled slot total 而自行引入。

I05 action mapper 仍是 affected。其 typed input 至少包括 activation proof、commit certainty、
Stored/Ephemeral、inner outcome、Fresh/Replayed access、ref/error presence、recovery class 和
exact transport policy。known valid replay/committed accepted result 的目标是 `Acknowledge`；其余
分支必须有独立表项。consistency defect 与 commit/probe unknown 当前没有 terminal completion，
禁止 wildcard/default arm。

### 13.8 Fake / controlled / durable parity 与 Step 09 handoff

| surface | fake obligation | controlled failure obligation | durable obligation |
|---|---|---|---|
| atomic identities | 一次 decision 同时处理两个 key | logical-only、event-only、cross-index mismatch | transactional uniqueness/equality constraints |
| digest retention | 保留 profile 与 candidates | unreadable profile、mismatch | 不 fallback 到 current profile |
| target CAS | 只模拟未来 selected landing | stale relation/version | exact repository guard in same UoW |
| result-before-complete | 拒绝 split completion | 独立注入 save/completion failure | transaction/constraint 保持 pair atomic |
| commit ambiguity | 区分 known failure 与 unknown | 注入全部 dual-index probe outcome | 不从 timeout 推断 success/no-write |
| exact replay | immutable pointer only | wrong kind/schema/digest/ref | 不 rerun service/current truth reconstruction |
| redaction | body-free fixture/diagnostic | 每个 exit 注入 forbidden body | rows/log/dead-letter 均无 raw body |
| action mapping | 同一 finite table，无 wildcard | 覆盖每个 branch 与 post-commit action failure | registrar 只执行，不重分类 |

唯一 Step 09 handoff flow 名称为 `ConsumeArtifactEvidenceContextFlow`。它仍是 target-neutral、
activation-blocked 的 reserved name；Step 09 必须引用既有 assembler/service/UoW/idempotency/result
callable 与一个 repaired landing/action seam，不得在 Step 09 私自创建 owner。

### 13.9 §13 review

| check | conclusion |
|---|---|
| current reachability | zero reservation、zero accepted write；结构性缺口仍是 activation failure |
| keys/admission | logical 与 secondary identity distinct，并在同一 atomic reservation 建立 |
| writer guards | reservation 与 future target CAS independent；只有 `Acquired` 写入 |
| replay/reentry | exact pointer + immutable surface；无 recursive retry/current-truth repair |
| commit unknown | dual-index probe；仍 unknown 无 C-05 completion |
| action | `S08-E-I05-ACTION-MATRIX-01` 保持开放，不新增 action owner |
| affected | 13 个 I05-specific 与 shared Consumer/UoW affected 均保持开放；无新上游 blocker |

## 14. I05 observability、audit projection 与 safety boundary

本节只固定未来 activation/delivery 的可观测边界，不声称已有 log、metric、trace、audit、dashboard、
alert、test 或 runtime evidence。Telemetry 不是 Artifact truth、evidence storage 或 alternate receipt。

### 14.1 Channel owner 与当前可达性

| channel | owner | I05 allowed role | truth status |
|---|---|---|---|
| structured runtime log | emitting worker/application/infra module | activation/delivery diagnostics after allowlist projection | ephemeral diagnostic |
| metric | runtime instrumentation | finite low-cardinality branch/count/duration | aggregate operational signal |
| trace/span | entry/application/port boundary | causal timing with safe correlation | diagnostic relation, not business causation |
| local durable H-family record | future selected I05 landing owner | accepted body-free observation fact in same UoW | Observability-owned local truth |
| stored Consumer result/receipt | result owner | immutable processing/replay authority | not Artifact acceptance |
| outbound event | accepted local follower | body-free committed change | projection event, not Artifact event |

Current activation最多记录 bounded assembly failure（static Consumer name、safe stage、affected class）。
由于合法 delivery 不可达，当前不得为 synthetic event 发出 accepted/rejected/delayed counter、span、
receipt 或 audit fact。

### 14.2 Correlation 与 identity separation

| field | authority | allowed channel | prohibited use |
|---|---|---|---|
| `consumer_name` | static registry | finite log/metric/span label | free-text alias |
| producer family | authenticated binding | finite label/safe field | payload override |
| source event ref | validated header wrapper | redacted log/span link、stored receipt | metric label/raw string |
| logical idempotency scope | application | redacted internal trace only | public receipt/log value/Artifact identity |
| `trace_ref` | optional envelope header | safe parent/link | synthesize when absent/cast Artifact trace |
| request digest | application canonicalizer | equality/integrity check | hex in telemetry/error |
| Artifact semantic digest | future canonical payload | local relation validation | idempotency key/telemetry/evidence body |
| committed cursor | accepted UoW | local durable/outbound relation | source ordering/row version/broker offset |

`trace_ref=None` 保持缺失。任何 Artifact correlation carrier 只有在显式 typed adapter 存在时才可
映射，不能 concatenate、parse 或择优 unrelated trace identifiers。

### 14.3 Redaction-first allowlist

| material | log | metric label | span attribute | durable fact | dead-letter |
|---|---|---|---|---|---|
| Consumer/producer/schema class | finite token | finite token | finite token | owner schema允许时 | finite token |
| safe error/recovery class | allow | finite token | allow | stored result允许时 | allow |
| redacted ref/presence | presence/redacted token | presence bool | presence/redacted token | exact typed ref if owner permits | safe ref only |
| outcome/access/commit certainty | finite token | finite token | finite token | exact result/receipt | finite token |
| Artifact/evidence content/lineage/review/verdict | forbid | forbid | forbid | forbid | forbid |
| payload bytes/debug/serde/SQL/provider response | forbid | forbid | forbid | forbid | forbid |
| digest bytes/hex、credential、locator、topic/offset | forbid | forbid | forbid | no I05 transport field | forbid |

Allowlist 必须在 serialization 与 sampling 前执行。hash、truncate、base64 或 sampling 不会使被禁
材料安全。custom `Debug` 不得显示 inner token 或 payload bytes。

### 14.4 Structured log、trace、metric cuts

| cut | safe fields | forbidden |
|---|---|---|
| activation rejected | Consumer、static stage、affected class | payload/event body、secret/config、locator |
| delivery admitted | Consumer、producer、schema class、redacted event presence | payload、raw refs、digest |
| reservation classified | `Acquired/Replay/Conflict/InFlight`、profile status | idempotency key、candidate bytes、winner refs |
| local decision | finite outcome/write-set family counts | Artifact truth、policy body、SQL detail |
| commit classified | known success/failure/unknown | transaction/driver details |
| result validated | Stored/Ephemeral、Fresh/Replayed、outcome、safe error code | bytes、local result pointer |
| action executed | C-05 variant、execution failure class | broker locator、offset、dead-letter body |

Spans 只切 worker decode、assembler、reservation、selected decision、one UoW 和 transport action；
telemetry export failure 不改变 result、不重试 handler、不打开 writer、不重写 receipt。Metrics
只能使用 Consumer、producer、schema、admission、result/access、safe error、recovery、commit certainty
和 action 等有限 labels；refs、digest、actor、trace、source、target、reason text 不得作 labels。

### 14.5 Durable audit 与 downstream non-owner matrix

| target | permission | precondition | prohibition |
|---|---|---|---|
| selected future primary/record | conditional | owner/relation/transition/one-UoW closed | guessed linkage/snapshot/projection/gap owner |
| stored result/receipt | conditional | known commit or exact replay | synthetic success/current-truth reconstruction |
| evidence linkage | none currently | explicit durable-landing/linkage owner | Artifact body/alias mint/truth write |
| retention/protection marker | forbidden | none | receipt triggers hold/release |
| report handoff/readiness | forbidden | none | verdict/readiness/signoff projection |
| external delivery/export | forbidden | none | endpoint/credential/package/provider call |
| Artifact truth | always forbidden | none | lifecycle/content/lineage/review/evidence mutation |

该权限矩阵覆盖 accepted、rejected、delayed、conflict、in-flight、replay、unknown 和 consistency
defect 分支；telemetry/audit 需求不得给 no-write 分支增加 generic H-record 或 outbox。

### 14.6 New affected and §14 review

登记：

```text
S08-E-I05-DOWNSTREAM-WRITE-CAPABILITY-01=open_internal_affected
```

关闭条件是：Step 06/07 提供只暴露 selected landing/read/result/UoW 的 minimal dependency view，
Step 09 完成 forbidden-call audit，Step 16 提供 compile-time 或等价 static cut，证明 I05 不能调用
Artifact、retention、report-handoff、external-delivery 或 unrelated local writer。这是本仓 affected，
不是新的上游 blocker。

| check | conclusion |
|---|---|
| channel ownership | telemetry、durable local fact、receipt 是不同 owner |
| correlation | source/event/trace/idempotency/digest/cursor 不互换 |
| redaction | allowlist-before-serialization，raw Artifact/body everywhere forbidden |
| cardinality | 只允许 finite labels，不含 refs/digest/actor/trace/source |
| failure isolation | telemetry failure 不改变业务 result、writer 或 action |
| truth boundary | 不拥有 Artifact truth、retention、handoff、export 或 external delivery |
| affected | 新增一项 local dependency-capability affected；无新上游 blocker |

## 15. I05 affected register and closure order

### 15.1 I05-specific affected

| ID | status | unique closure owner | activation prerequisite |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | L1-artifact contracts/event owner | canonical body-free payload, schema/version, encoder/decoder and ownership declaration |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | L1-artifact event registry plus integration binding | finite event-to-I05 mapping and authenticated registration |
| `S08-E-I05-REFERENCE-AUTHORITY-01` | `open_internal_affected` | Step 06 reference/application owner | local reference factory, relation key and absence/duplicate mapping |
| `S08-E-I05-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | Step 06 exact input assembler | all shared control fields sourced from header/actor/canonicalizer; no payload override |
| `S08-E-I05-DIGEST-AUTHORITY-01` | `open_internal_affected` | Step 06 canonicalizer/payload relation owner | semantic, request and stored-result integrity digests remain distinct and total |
| `S08-E-I05-DIGEST-ORDER-01` | `open_internal_affected` | Step 06/07 assembler-to-reservation seam | one fixed frame and candidate set propagated to reserve, save and replay |
| `S08-E-I05-PURPOSE-AUTHORITY-01` | `open_internal_affected` | Step 06 policy/input owner | finite purpose source and family/purpose/scope compatibility matrix |
| `S08-E-I05-VISIBILITY-AUTHORITY-01` | `open_internal_affected` | Step 06 visibility policy owner | producer input and locally evaluated visibility remain separate |
| `S08-E-I05-LINKAGE-RELATION-SOURCE-01` | `open_internal_affected` | Step 06 relation/landing owner | exact relation lookup, key, version and no first/latest fallback |
| `S08-E-I05-DEPENDENCY-SLICE-01` | `open_internal_affected` | Step 06/07 inbound facade | least-authority dependency view with no downstream writers |
| `S08-E-I05-RESULT-SURFACE-01` | `open_internal_affected` | Step 06 result/response assembler | lossless I05 presence matrix and exact replay decoder |
| `S08-E-I05-ACTION-MATRIX-01` | `open_internal_affected` | Step 06/07 worker mapper seam | named pure/total/no-wildcard mapper and explicit branch table |
| `S08-E-I05-DURABLE-LANDING-01` | `open_internal_affected` | Step 06 domain/application owner | one primary/relation/version/transition/record/outbox/result write set |
| `S08-E-I05-DOWNSTREAM-WRITE-CAPABILITY-01` | `open_internal_affected` | Step 06/07 dependency composition | minimal view, forbidden-call audit and static validation cuts |

I05 now has 14 protocol-specific affected items: two upstream blockers and twelve local affected
items. The increase from thirteen occurred in §14; no item is closed merely by documenting a target
shape. Shared recovery, Consumer result/quarantine/indeterminate completion, UoW and Step 09 flow
dependencies remain separate and open.

### 15.2 Closure dependency order

```text
canonical Artifact payload/schema + finite event binding
  -> complete input/reference/digest/purpose/visibility/linkage authority
  -> least-authority dependency slice + unique durable landing
  -> immutable result/receipt + known commit/replay proof
  -> shared recovery owner + ApplicationError total mapping
  -> named I05 action mapper and indeterminate carrier
  -> Step09 exact flow
  -> Step11~13 persistence/CAS/probe/replay parity
  -> Step14 binding and activation
  -> Step16 planned static/behavior cuts
```

No later Step may silently close an upstream blocker by creating a local alias, trial decoder,
generic event subscription, inferred landing or default action. Closure updates the unique owner,
affected inventory and downstream flow references together.

## 16. I05 static closure checklist

| area | required proof | current result |
|---|---|---|
| identity | finite I05 name, Artifact producer, logical and secondary identities | pass at design level |
| payload | canonical body-free payload owner/schema/encoder | blocked upstream |
| binding | finite Artifact event-to-I05 registration | blocked upstream |
| fields | each future payload field maps to one private input field | affected |
| actor | effective actor comes from trusted worker binding | pass at boundary level |
| digest | semantic/request/result-integrity digests are separate | pass with affected propagation |
| redaction | raw Artifact/evidence body and unsafe diagnostics rejected before serialization | pass at contract level |
| target | one durable primary/relation/version/write set | affected |
| UoW | result before completion; accepted writes commit together | target fixed, propagation open |
| idempotency | logical and event identities atomically established | target fixed |
| replay | exact stored pointer and immutable bytes only | target fixed |
| error | activation gaps never masquerade as runtime outcomes | pass |
| recovery | shared total recovery owner and retryable derivation | shared affected |
| action | named total/no-wildcard mapper | affected |
| unknown | still-unknown probe has legal nonterminal handling | shared affected |
| telemetry | finite labels and allowlist-before-serialization | pass at design level |
| least authority | no Artifact/retention/handoff/export/unrelated writer access | affected |
| truth | no Artifact truth/evidence body ownership or backwrite | pass |
| flow | reserved `ConsumeArtifactEvidenceContextFlow` handoff | pass as Step 09 reservation |
| evidence | no implementation/test/runtime/commit evidence asserted | pass |

This checklist distinguishes a complete Step 08 record from a runtime-ready protocol. The former is
now achieved; the latter is explicitly not.

## 17. I05 final stop review

| check | final conclusion |
|---|---|
| protocol record | `defined_with_affected_open`; §§1~§16 cover binding, callables, carrier, field authority, digest, result, errors, concurrency, telemetry and closure |
| runtime activation | disabled/fail closed; canonical payload and finite event binding are absent |
| current writes | none; reservation, primary, record, result, receipt, outbox and C-05 are unreachable |
| upstream blocker | the two existing payload-schema and producer-event-binding blockers remain; no new upstream blocker |
| local affected | twelve open, including downstream-write capability |
| shared affected | recovery, result/quarantine/indeterminate completion, UoW and Step 09 flow remain open |
| truth boundary | Observability may own only a future body-free observation/audit projection; never Artifact truth, body, verdict, retention, signoff or external delivery |
| implementation/evidence | not implemented, tested or run; no commit, run_id, evidence alias or acceptance signature claimed |
| protocol count effect | Consumer becomes `5/9`; total becomes `35/60`; unconditional complete remains `0/60` |
| next M1 action | continue with I06; do not enter Step 09 |
| submission | not needed; user did not request a commit |

I05 is complete only as a Step 08 design record. Its runtime slot remains unavailable until the
declared owners close the activation blockers and affected items.
