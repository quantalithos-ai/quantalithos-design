# L6-bridges 03 Step8：条件Outbound O01协议

## 1. O问题边界与批次

主文件O问题/诊断/取舍已done。只HLD唯一`BridgeLocalDispositionRecordedEvent`，不是发送平台消息或第20个callable；本页不新增publisher job/outbox/repository。新声明唯一计划归属`crates/contracts/src/events.rs`；原schema/ref/state沿Step6。编码限制沿[共享协议](03_ddd_step_08_shared_protocol.md)，safe source/consumer边界沿[Inbound附录](03_ddd_step_08_inbound_protocols.md)。

| 协议 | 模块 / 目标 | 原依赖port | future flow承接 | 当前批次自检 |
|---|---|---|---|---|
| O01 BridgeLocalDispositionRecordedEvent | U6 actual audit/canonical与原handoff | SafeObservationPort、SafeTraceRepository、LocalUnitOfWorkPort | actual local mutation flow及RetrySafeHandoffJob；不是独立请求flow | pass |

## 2. O01独立协议

| 项 | 完整合同 |
|---|---|
| logical name | `bridge.v1.local-disposition-recorded`；logical source label，不声称topic/router/consumer已注册 |
| publisher | actual local mutation的唯一SafeAuditRecord producer；只有formal canonical/schema/admission current成立、同源actual commit后原mutation/J04才交接 |
| consumer / transport | 仅正式准入consumer及qualified SafeObservationPort adapter；当前Observability兼容未立，不能用Bus/SourceOwner/Governance冒名，HTTP/RPC/Bus产品未选 |
| exact existing send signature | `SafeObservationPort::handoff<'a>(&'a self, record: &'a SafeHandoffRecord, current: &'a CurrentSafeHandoffQualification, claim: &'a SafeHandoffClaimRef, committed: &'a CommittedLocalMutationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, ConsumerDispositionRef>`；Application原port调用，不创建public Event::publish API |
| actor / source | actual原producer技术source/受权scope；业务subjects/basis/stage材料另外受safe policy；source或topic名称不授consumer准入 |

```rust
/// O01真实local mutation的条件安全传播，不代表平台送达或验收证据。
pub struct BridgeLocalDispositionRecordedEvent {
    /// 唯一本地V1结构，不等canonical producer schema版本。
    version: BridgeProtocolVersion,
    /// 原正式event_id/source/scope/trace；重复移交保持原值。
    metadata: SafeEventMetadata,
    /// 原same mutation唯一immutable安全audit。
    source: SafeAuditRef,
    /// 实际canonical body-free材料指针，不能用日志/正文hash替代。
    material: CanonicalSafeMaterialRef,
    /// 正式producer/consumer准入，不由配置enable生成。
    admission: ProducerAdmissionRef,
    /// 已存在的原local交接定位，不生成第二handoff。
    handoff: SafeHandoffRef,
    /// 原consumer operation，重试不换。
    original: OriginalHandoffOperationRef,
    /// 实际canonical exact schema版本，不用bridge.v1替代。
    schema: SafeProducerSchemaRevision,
    /// 正式交接/保留窗口，不以本地time或token续期。
    retention: QualifiedRetentionWindowRef,
}
```

| 完整factory / 消费签名 | 中文Rustdoc |
|---|---|
| `pub fn from_parts(version: BridgeProtocolVersion, metadata: SafeEventMetadata, source: SafeAuditRef, material: CanonicalSafeMaterialRef, admission: ProducerAdmissionRef, handoff: SafeHandoffRef, original: OriginalHandoffOperationRef, schema: SafeProducerSchemaRevision, retention: QualifiedRetentionWindowRef) -> Result<Self, ContractViolation>` | /// 完整核九字段same source/namespace/schema/op/window结构；只shape、不授producer/current/commit资格，零IO。 |
| `pub fn into_parts(self) -> (BridgeProtocolVersion, SafeEventMetadata, SafeAuditRef, CanonicalSafeMaterialRef, ProducerAdmissionRef, SafeHandoffRef, OriginalHandoffOperationRef, SafeProducerSchemaRevision, QualifiedRetentionWindowRef)` | /// 原九字段交qualified consumer adapter，不能从current truth重建旧材料或换event identity。 |

wire exact九字段，无result/verdict、external message/body、raw errors、receipt success、job_run_id、自由topic/route、secret/URL、global delivery字段。CanonicalSafeMaterialRef和ProducerAdmissionRef原newtype完整SafeAuthorityRef schema/来源/current规则沿Step6，不是任意string；只authority pointer绝不含正文或可还原派生值。actual consumer兼容未核时不能序列化本event假称已accepted。

## 3. 字段来源与完整构造闭环

| 字段 / 目标 | 唯一actual来源 -> 目标 | 缺失 / 禁止 |
|---|---|---|
| version | 当前local固定bridge.v1 | 不映射foreign/canonical版本，不支持fallback。 |
| metadata | 原formal producer注册source/schema/scope/event identity与原audit trace | event_id由formal唯一producer recipe固定，可能引用原audit/mutation/handoff身份但必须source contract明确；不另mint event record/随机ID，不以body hash/now产生；没有recipe则O01 blocked。 |
| source | 同actual mutation唯一SafeAuditRecord.audit_ref | 不从日志、receipt或未提交stage生成audit；same mutation唯一，local audit不是evidence。 |
| material / schema / admission / retention | 原SafeHandoffRecord的canonical_material_ref/producer_revision/producer_admission/retention_window，来源正式MutationObservationRequirement/current资格 | source/schema/admission/保留用途窗口任一未立不能建from_canonical或交接；consumer source版本不从opaque格式推。 |
| handoff / original | 原SafeHandoffRecord.handoff_ref及同consumer namespace原operation | original不等产生audit的local业务op，不与receipt/event ID混用；同source material/op唯一关系不能随J04换。 |
| SafeAuditRecord::from_mutation九入参 | audit ID/原mutation/op=UoW；subjects/basis/stage_reason/schema=完整BodyFreeMutationMaterial四字段；trace=原trusted调用 | material四字段分别真实受权subjects、safe basis、actual stage+finite reason、actual local producer schema；same UoW提交前无producer事实。 |
| SafeHandoffRecord::from_canonical十一入参 | handoff ID/原consumer op=原技术reservation；source audit、canonical、admission、retention、schema=正式规则/current；consumer/claim Slots初始Missing；current完整一致；now actual UoW | Pending/local1只完整current来源下构造，零IO。missing canonical不得填empty placeholder或随便引用audit。 |
| 同源actual commit | 原audit/业务变更/result/dedup及条件handoff/正式canonical联动由原UoW/commit proof保证 | stage/preflight不是commit；commit Unknown不发布，不以socket/broker ACK推进。网络不进入local tx。 |

`BodyFreeMutationMaterial`exact `{subjects: AuthorizedSafeSubjectRefSet,basis: SafeBasisRefSet,stage_reason: SafeStageReason,schema: SafeProducerSchemaRevision}`。原subject集合/依据/窗口获准才形成；没有正文、callback choice、token、secret、附件URL或内容、审批详情、raw header、stack、可还原hash/base64。safe审计与consumer材料是同一actual mutation来源，不能在handler/log adapter建第二producer。

## 4. mandatory、准入、幂等及失败

| 原MutationObservationRequirement / actual条件 | 允许行为 |
|---|---|
| Mandatory | schema/canonical/admission/current/同源提交责任完整才允许受保护效果；preflight只资格不造未来committed事实，最终actual材料/提交联动缺失阻效果。不能仅“audit已写”替代mandatory交接。 |
| OptionalQualified | 只有正式证明可选且canonical/current准入齐备才创建条件handoff，之后交接仍按原op/material；不能把缺资格自动归optional。 |
| OwnerPermitsAuditOnly | 正式owner明确当前不mandatory，只actual本地safe audit；不建O01、canonical、handoff或empty event。 |
| 无正式rule / producer map不接受Bridges | affected positive Blocked/Unavailable、runtime slot不激活；不能以local configure enable绕过。 |

幂等三轴：actual mutation -> 唯一audit；audit/schema/admission/原consumer op -> 原handoff；正式producer event recipe -> 原event identity。重交原metadata/material/source/schema/admission/handoff/original不变，current资格只重验窗口/用途不能变含义；不生成第二producer event/effect、message mapping或Job run。Consumer disposition只能actual原结果；E04消费原op，J04先只读权威结果再允许有界same-op重交。

| actual错误 / 结果 | 处理上限 |
|---|---|
| schema/source/准入/forbidden材料失败 | publish前有限Rejected/Blocked/Unavailable，零foreign IO；无raw dead-letter或日志证据。 |
| local commit unknown | 保original/phase，先same mutation权威恢复；不得发O01，也不得删Pending关系或新operation重建。 |
| transport ACK已知而consumer结果未知 | 原handoff Indeterminate；不apply ConsumerAccepted，不把ACK当NoEffect，原claim/material/op保留。 |
| actual known consumer结果 | 只原SafeHandoffRecord apply_consumer_result/local finalize；Accepted不是evidence/report/verdict/signoff/readiness。 |
| timeout/取消/NotFound/Unavailable | 不能证明未收；原subject manual/blocked/unknown，只有正式NoEffect+全部current/预算/窗口允许same-op恢复。 |

没有通用“HTTP200事件发布成功”或Bridges delivery成功标记；不新增公开event response。publisher的完整结果是原ConsumerDispositionRef，stage commit/ACK分别原合同处理。

## 5. O复杂度、草稿与停审

一个九字段typed声明，无新业务入口、port、outbox/run/entity；O01身份/来源与原audit/handoff对象、J04/E04闭环。未来正式03§7装配本独立协议，明确positive source/admission仍blocked；不是当前真实event producer或可调用foreign接口。

人工factory/identity/mandatory/current/同源commit/consumer ACK及no evidence边界检查pass，静态审计后才开放J。计划测试沿原safe trace/handoff/producer adapter和protocol_surface：commit前零publish、mandatory不足零effect、冒名producer拒绝、missing canonical不造object、同audit唯一event/op、receipt unknown保原identity、no raw/body/hash、audit-only无O01；全部planned，未执行。

静态组内停审pass：八文档71表/44围栏行、结构错误0，diff-check通过；只开放J。此pass只设计结构，不代表producer/consumer兼容或实际交接。
