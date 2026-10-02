# 03 Step 13：并发、幂等与重入保护

## 1. Step状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review（文档）。已读详细SOP Step13/书写规范5.12、闭环metadata/原结果、Step12及前序key/cursor/fence。输出仅本Step与必要回修，不实现。Step19前正式03保持historical。

### Step内计划

| 项 | 状态 | 位置 |
|---|---|---|
| 读取/问题/诊断/取舍 | done | §2～6 |
| key/指纹单元 | done | §7.1～7.3 |
| 锁/重入/分页单元 | done | §7.4～7.6 |
| 草稿/审计/停审 | done | §8/10 |

## 2. 本步输入

[Step12](03_ddd_step_12_errors_recovery.md)的问题/Unknown诊断/恢复取舍，[Step11](03_ddd_step_11_persistence_transactions.md)事务帧与as-of，[Step6 fingerprint](03_ddd_step_06_shared_types.md)、[Step7 key/cursor](03_ddd_step_07_typed_ports.md)、[runner/checkpoint](03_ddd_step_07_application_callables.md)、[Step8协议](03_ddd_step_08_protocol_contracts.md)、[Step9](03_ddd_step_09_function_flows.md)、[Step10](03_ddd_step_10_state_matrix.md)。Core actor实际`crates/contracts/src/actor.rs`只读复核，字段actor/delegated_by/role_refs/request_origin已见；不把actor字段当human认证。

## 3. SOP问题回答

1. 哪些flow并发同资源？publisher release与所有正向路径；version List/Request/permission/Restrict/Withdraw；cancel与receiver结果；重复notice计划；Job claim/reconcile/late result；snapshot/projection rebuild；category parent更改防循环；相同operation key。局部写统一帧锁后typed资源锁/CAS，外部资格仍非原子。
2. 哪些可重复？21Commands+12Jobs；16Queries只读自然重入，无operationkey；0event不存在消费dedup。Job dispatch业务effect意图不随重试新Job key/fence改变。
3. key来源？Command仅Core meta.request.idempotency_key；Job仅context.request.idempotency_key。唯一(kind,正式scope,exact UTF8 key bytes)，不trim/casefold。fingerprint使用RFC8785+SHA256版本化算法，actor/delegation/scope+完整typed业务请求；不资产digest。
4. 重复返回？same key+same fingerprint+Completed currentdisclosure后完整原result；Reserved busy/原checkpoint恢复；different fingerprint冲突。绝不覆盖旧record/报告，replay不fresh business precheck。
5. 如何测试？固定canonical fixtures、相同key多入口/异intent、两种竞争顺序、每A/B故障点、旧fence late结果、scope/token换用、local与PG parity。测试只planned，不捏造digest/run。

## 4. 当前文档问题诊断

Step6 MarketIntentFingerprint已选RFC8785+SHA256，但未给typed callable、稳定variant/numeric/set映射。只Serde JSON hash可能因集合顺序、u64精度、显示名与role hint变化误判。Core actor原源码必须固定identity字段，不能把display_name当身份。Step7 RepositoryCursor只内部位置，public CorePageToken仍缺scope/filter/selector绑定codec。本步在已有intent_fingerprint/infra row codec文件闭口，不新增public API。

## 5. 改动前后对比

| 项 | 前 | 后 | 原因 |
|---|---|---|---|
| fingerprint | 规则概念 | finite typed projection、版本前缀、JCS、u64/set语义 | 稳定可计算、不可丢字段 |
| pagination | cursor位置 | exact method/filter/scope/currentdisclosure绑定 | 防跨scope和漏页 |
| retry | 语义散在flow | 局部race与remote intent区分 | 不借newkey双发 |

## 6. 设计取舍

| 方案 | 收益 | 风险 | 结论 |
|---|---|---|---|
| serde_json::to_string原对象直接hash | 少代码 | 非canonical、numeric精度/enum不稳定 | 拒绝 |
| sealed finite intent映射+RFC8785库+SHA256 | 所有业务字段可核查 | 固定fixtures和版本兼容要求 | 采用；库patch在实施lock阶段验证 |
| key等同业务intent | 简单 | 同key不同body误重放 | 拒绝 |
| exact key+fingerprint+原结果+currentdisclosure | 明确truth/授权 | 保留原record成本 | 采用，不默认过期删key |

## 7. 结构化中间产物

### 7.1 Key与original result

| 入口 | key来源 / 唯一性 | 幂等窗口 | duplicate处理 |
|---|---|---|---|
| 全21Commands | 只meta.request.idempotency_key；UK(kind,scope,exact key.as_str UTF8 bytes) | 无自动TTL/删除，Q-MP-01等待authority | fingerprint一致Completed完整原result；Reserved busy；不同冲突 |
| 全12Jobs | 只context.request.idempotency_key；同UK；work identity=context.fence.work_ref=body.work_ref | 同上；Work lease不是key TTL | 原完整族report；不重claim/dispatch/scan |
| 全16Queries | 无operation/幂等key要求 | not_applicable | readonly自然重入，不存context/audit/cache |
| 0activeevent | 无消费/producer | not_applicable | 不引入EventDedup/outbox |

key非空、符合Core validator与边界长度预算；不做trim/大小写/Unicode normalization。空格若Core允许就是不同key。PG以BYTEA或等效C-collation exact byte唯一，不能locale collation。operation_kind是现有finite enum，scope必须resolver正式输出。context保存原Actor/Command/Worker metadata，key索引是它的派生镜像，读回必须exact核对。

prepare：当前可信actor/scope/disclosure→计算fingerprint→RO find_by_key。Completed须load_result+原context+kind/schema一致，当前披露覆盖**全部**结果主体才原payload，否则整体NotVisible，不裁剪后声称原结果。fresh才外部业务precheck；reserve取得帧/key锁后再次find，输家不能分配ID/cursor。fresh同Tx写原context/Reserved。Command完成同Txfacts+audit+fullresult+requiredwork/plan+Completed；Job依A/B。缺原result不from currenttruth补齐。

### 7.2 精确意图指纹

归属`application/src/intent_fingerprint.rs`。planned依赖RFC8785兼容`serde_json_canonicalizer`与`sha2 0.10`，精确patch由实施lock/兼容验证，不宣称已安装。选择成熟库，不自行拼JSON/hash。RFC8785库须通过boundary golden/parity后方可使用。

```rust
mod sealed {
    /// Allows only this module's explicitly supported request types.
    pub trait Sealed {}
}

/// Restricts fingerprint bodies to the finite command and job request inventory.
pub trait CanonicalMarketIntent: sealed::Sealed {
    /// Returns the one operation selector assigned to this finite request type.
    fn operation_kind(&self) -> MarketOperationKind;
    /// Returns all validated business fields using the version-one canonical rules.
    /// # Errors
    /// Rejects malformed values, forbidden material, or an unsupported field shape.
    fn canonical_business_fields(&self) -> Result<serde_json::Value, MarketError>;
}

/// Fingerprints a typed local intent without generating owner or asset digests.
/// # Errors
/// Rejects a selector/body mismatch, invalid actor identity, or canonicalization failure.
pub fn intent_fingerprint<T: CanonicalMarketIntent>(
    kind: MarketOperationKind,
    actor: &core_contracts::actor::ActorContext,
    scope: &MarketScopeRef,
    body: &T,
) -> Result<MarketIntentFingerprint, MarketError>;
```

`sealed::Sealed`是application private module内marker，只有下面33DTO的显式impl，Query/任意Serialize/JSON无impl。不会形成第18个I/O Port。内部返回Value只来自这些typed DTO递归受限投影，拒绝客户任意JSON；入口仍完整typedbody。

规范bytes：UTF8 literal `quantalithos-marketplace/intent/v1` + 单个0x00 + RFC8785 canonical JSON object。object恰含`operation`（MarketOperationKind现有variant的exact PascalCase名字）、`actor`（Core actor_id exact值、actor_kind=`human/ai_member/system/integration`）、`delegated_by`（相同identity字段或null）、`scope`（MarketScopeRef完整wrapper字段）、`business`（下表所有字段递归投影）。计算SHA256并小写64hex保存sha256，版本literal隐含本轮算法；变更必须保留v1解码与旧record重放，不直接重算旧key。

scalar字符串原UTF8，禁止trim/casefold/NFC/NFKC；bool仍bool；全部整数在fingerprint projection里转换为无前导零十进制**字符串**，避免RFC8785/IEEE754对u64精度损失（public协议仍其原数字类型）。Optional无值显式null；typed wrapper保留已定义字段；enum统一`{"tag":"ExactVariant","value":<payload-or-null>}`，未知tag失败，不依赖库默认Serde enum representation。metadata key/trace/requestid/timestamp、display_name、role hint、locale、lease/fence generation、当次resolver决定ref不进入fingerprint；actor/delegating identity与**业务body里所有字段**不得排除。Job业务body的work_ref与typed plan全量保留。

所有现有`*Set`别名按每元素canonical bytes字节序排序，重复元素按该类型validator拒绝，不默删。业务Vec默认保序；另明确unordered的Release.verification_refs、Verify.material_candidates及DraftPublicationSpec.material_candidates按同规则排序，MarketListingMetadata.tags按exact字符串排序；PlanImpactNotifications.targets保序，不能排序后丢每target责任。nested projection plan/snapshot/body里的sets仍递归同规则。kind/DTO对应不符InvalidInput。

### 7.3 33DTO业务字段完整投影表

下表字段全量参与，嵌套类型按Step6/8 schema全字段递归，没有allowlist遗漏或“其他字段实现时补”。

| DTO（Request后缀） | canonical business字段 |
|---|---|
| BindPublisherRelation | principal_candidate, requested_scope |
| ReleasePublisherRelation | relation_ref, expected_revision, verification_refs, reason_ref |
| VerifyPublicationSource | source_candidate, publisher_ref, material_candidates |
| CreatePublicationDraft | draft_spec |
| RevisePublicationDraft | application_ref, expected_revision, draft_spec |
| SubmitPublicationApplication | application_ref, expected_revision |
| TerminatePublicationApplication | application_ref, expected_revision, reason_ref |
| RecordGovernanceDecision | handoff_ref, decision_candidate |
| CreateMarketplaceListing | publisher_ref, metadata, category_refs |
| EditMarketplaceListing | listing_ref, expected_revision, metadata, category_refs |
| MaintainMarketCategory | intent（Create/Change完整载荷） |
| RegisterMarketVersion | listing_ref, application_ref |
| ListMarketVersion | version_ref, expected_revision |
| RequestDistribution | target完整version/consumer/receiver/scope |
| CancelDistribution | intent_ref, expected_revision, reason_ref |
| RecordReceiverOutcome | attempt_ref, outcome_candidate |
| RestrictMarketVersion | version_ref, expected_revision, reason_ref |
| WithdrawMarketVersion | version_ref, expected_revision, reason_ref |
| PlanImpactNotifications | impact_ref, targets完整有序候选 |
| RecordNoticeOutcome | notice_ref, outcome_candidate |
| RequestMarketRecovery | target_ref完整typed variant |
| DispatchReviewHandoff / ReconcileReviewHandoff | 各自handoff_ref, work_ref；不同selector |
| DispatchDistribution / ReconcileDistribution | 各自attempt_ref, work_ref；不同selector |
| EnumerateKnownImpact | disposition_ref, work_ref |
| DispatchNotice / ReconcileNotice | 各自notice_ref, work_ref；不同selector |
| RunMarketRecovery | recovery_ref, work_ref |
| DispatchObservation | audit_refs, work_ref |
| ReconcileObservation | work_ref |
| RefreshQualifiedReferences | snapshot_refs, work_ref |
| RebuildMarketReadProjection | projection_ref, work_ref, plan完整nonemptytyped source集合/upper |

Runner prepare/reserve仅T:CanonicalMarketIntent，Fresh Gate读取结果不参与原client intent fingerprint；否则同body重放会因owner当前变化误冲突。fingerprint变化测试覆盖每业务字段、integer大值、null/enum、unordered sets、保序targets、delegate identity；trace/time/locale/display_name/roles/lease变化不得改变。同payload不同actor/delegate/scope必须不同，当前authority仍每次另核。

canonical单元停审：33write DTO覆盖，key/actor authority唯一，无Queryoperation或资产摘要重算；实际hash输出/fixture run不存在。

### 7.4 锁与分页单元开工

承接canonical。问题是资源序列化与cursor类型能否唯一区分每扫描行。诊断：旧RepositoryCursor.subject_ref只能MarketAuditSubjectRef，不能唯一表示多个同subject audit或同target不同work。采用独立repository position carrier，不把Work/Audit技术主键增加到domain审计主体enum。public token不作为授权签名；严格codec+current scope/filter/位置可见性验证。拒绝token携隐藏count/未经授权ref，或把内部scan after当public PageToken。

### 7.5 并发与重入矩阵

| 场景 | 冲突资源 | 控制方式 | 失败错误 / 恢复 | planned测试 |
|---|---|---|---|---|
| samekey fresh×2 | operation UK | 写帧→key lock→再find；仅赢家分配ID/cursor | 原结果/busy/conflict，不新intent | barrier并发ID/保存计数 |
| publisher release vs publish/list/request/dispatch | local publisher relation | publisher lock在version之前，reload Bound与预核验authority/revision一致 | CurrentGateDenied/VersionConflict | release先commit则positive拒绝；反序历史保留 |
| Restrict/Withdraw vs Request/permission | market version | 同lock_version/CAS，许可在A同frame提交 | 处置后不能新受理/许可；旧许可原intentprobe | 两种commit次序与late impact |
| cancel vs result | intent/attempt/version | cancel保留Unknown/Confirmed，B reload/fence；relation只formal attach | 不externalcancel，不丢late binding | Cancelled+Confirmed合法共存 |
| 计划重复notice | (impact,target,channel,scope) UK | key独立，但notice UK精确dedup；不重复work | load原notice或safe conflict | 每target只一个notice |
| worker claim×2 | work revision/fence | Pending claim CAS；generation递增、不回绕 | loserFenceMismatch/VersionConflict | winner唯一permission |
| lease过期 | 原work/checkpoint/permission | expired Claim仅Reconcile probe-only可新fence，不第二dispatch | waiting/formal notcommit后合法重试 | oldlease/newworker effect计数0 |
| B late vs newfence | 原attempt/result | 旧worker不覆盖；新授权Reconcile取formal原intent结果 | report/lateimpact保存，不抹历史 | wrongfence rejection+late续责 |
| retry分发 | 原external intent | terminalFailed/Blocked旧attempt保持；newattempt/newwork target，同intent | currentgate/notcommit证明，不能换intent | 所有attempt共享original receiver intent |
| projection rebuild×truth update | source highwater/state/CAS | A冻结typedplan；B current依赖cursor核对 | 源变动Stale，不Fresh | 高cursor中途注入 |
| snapshot refresh×refresh | snapshot UK/revision | source/scope matching+CAS | VersionConflict不以旧body覆盖新 | 多worker正/负返回乱序 |
| category Change×parent Change | taxonomy scope | 全局写帧下重读ancestors，不在外部read后仅CAS当前child | cycle/hiddenparent InvalidInput/NotVisible | A→B和B→A竞争 |
| impact多页/late关系 | owningimpact revision | 连续链单一nextafter+fixedupper+CAS；late新cursor显式Partial | 不乱序complete，不漏同frame subject | rollback中页/late高cursor |
| commitunknown | 原local transaction/key | 原key/result/checkpoint新read；再次取得frame锁可确认前Tx已终局 | 不能以一次空read宣布rollback | commit前后disconnect |

所有锁序：RW begin帧锁→operation key（多个原operation key按kind/scope/key bytes稳定序）→publisher→version→其余owning rows按typed PK。Counter锁已在begin取得，assign只改本Tx计数，不再晚取锁。Readonly不取任何写锁，不Clock/ID。external调用不持SQL；本地锁不授权跨owner服务。

重入：Completed原fullresult不可overwrite；Reserved原Job只按checkpoint恢复；每次fresh Job body与context工作ref相等且plan-selector属于Step8已列Dispatch→Reconcile pair。Dispatch不能当Reconcile；没有permission的初始Pending claim不伪造NotCommitted。`DispatchFence` generation/expires用于当前调用CAS，不是远端truth；旧fence expired并不能证明owner未提交。

### 7.6 typed扫描位置与public分页

RepositoryCursor采用下列application-owned位置主体，替换其原subject_ref字段类型，名称/port数量不变。schema定义同步到Step7。

```rust
/// Identifies a unique row position without becoming a domain audit subject.
pub enum RepositoryPositionSubject {
    /// Uses the exact local primary identity of a domain-owned subject.
    OwnedSubject(MarketAuditSubjectRef),
    /// Uses a distribution relation primary identity in impact scans.
    Relation(DistributionRelationRef),
    /// Distinguishes multiple work records for one business target.
    Work(DeferredWorkRef),
    /// Distinguishes multiple audit records for one business subject.
    Audit(MarketAuditRef),
    /// Identifies an immutable publication basis row.
    Basis(PublicationBasisRef),
    /// Identifies an immutable qualification outcome row.
    Qualification(QualificationOutcomeRef),
}
```

位置比较固定：source_sequence数值升序，variant exact ASCII tag字节序，payload的已定义typed ref canonical fields字节序（不是Rust enum Ord或DB locale）。复合upper/after用原ReadWindow，不把MarketSourceCursor摘要当续页位置。每scanner只接收其合法position族且row parent/version/scope在该selector内；跨window/错tag/不存在位置InvalidCursor。Impact联合流Relation与OwnedSubject(Attempt)保留两个族；work用Work，audit用Audit而非所有记录同subject。

public page codec归`infra/postgres/row_codec.rs`、shared binding纯逻辑归`application/intent_fingerprint.rs`，传输仅Core PageToken；下列privatecodec不新增HTTP字段。统一BASE64URL_NOPAD(RFC8785 JSON)。这是位置载体，不是auth credential；当前披露每次独立强制，客户篡改即使可计算checksum也不能获取未授权信息。

Step17补齐输入闭环：七个publicpagedport接收application `PageReadContext { actor: QueryEnvelope.actor原值, scope: ReadFacade.authorize当前输出, selector: 每Query固定MarketPageSelector }`；schema/七variant与唯一method映射见Step7。actor/delegate identity用于request_binding；SafeReadContext没有actor字段，禁止从disclosure_ref/HTTP/privatefake取。typedfilter/parent仍各方法原参数，selector与pagedmethod不符InvalidCursor。Step9七caller同步显式构造，current披露仍独立强制。

```rust
/// Stores a validated page position; it never grants read authority.
struct MarketPageFrame {
    /// Must equal the literal marketplace-page/v1.
    schema: String,
    /// Must equal the exact public Query name using this repository method.
    selector: String,
    /// Contains the current qualified local scope, not a parsed owner ref.
    scope_ref: MarketScopeRef,
    /// Contains the version-one digest of selector, typed filter and visibility constraints.
    request_binding: String,
    /// Fixes the committed local scan or projection source upper bound.
    upper: MarketSourceCursor,
    /// Points at the last actually returned visible row using its exact primary identity.
    after: RepositoryCursor,
}
```

request_binding规范：SHA256(UTF8 `quantalithos-marketplace/page-binding/v1` +0x00+JCS `{selector, scope, actor_identity, delegated_identity, business_filter, source_constraints}`)，integer与enum规则同7.2，排除PageToken/limit/trace/locale与易变resolver decision ref。不存在授权source_constraints时不构造token。绑定token里的upper<=实际已提交高水位，after必须属于合法行/匹配当前filter/scope、after<=upper；不能以token传入scope取代当前scope。

排序均为固定`(row.source_sequence,position tag,typed PK)`升序，搜索结果不承诺相关性排序。row cursor来自实际safe来源frame；catalog view frame为其plan依赖中的最大source frame。count谓词与items一致，只当前可见集合，next token仅最后返回可见项。可见性收缩导致原lastrow不可见或binding变化时InvalidCursor（对外InvalidInput，无存在性明细）并重启分页；源/索引highwater改变不能继续旧索引页，Degraded Stale/重启，不伪空成功。内部fixedupper需要时用Step11 as-of Row历史，不增加Query writer。

| Query族 | selector与filter绑定 | 位置族 |
|---|---|---|
| SearchMarketplaceCatalog | exact Query+CatalogSearchInput全部字段 | OwnedSubject(Listing) |
| GetMarketplaceListing / ListMarketVersions | 各selector+listing_ref；前者history、后者versions | OwnedSubject(Version) |
| ListMarketCategories | selector+CategoryReadInput.parent_ref | OwnedSubject(Category) |
| GetDistributionProgress | selector+intent_ref | OwnedSubject(Attempt) |
| GetWithdrawalImpact | selector+disposition_ref及resolved impact；实际notice paged chunk | OwnedSubject(Notice) |
| GetMarketAudit | selector+完整subject_ref | Audit |
| 其余9个详情/资格Query | 无paged collection则next_token=None | 不生成位置，不偷偷加scan |

page/index/codec错误皆PortError::InvalidCursor或IntegrityFailure，fake同tag/binding/as-of/order；不能私有map推position。public codec实现限实际paged子面；GetWithdrawalImpact按Step9实际page_notices_by_impact只Notice，此Query关系/unknown sets是已保存ImpactRecord完整字段，经current披露裁剪，不另造relation分页协议。

### 7.7 跨单元审计

33write intents、49协议与0event库存不变；新增sealed纯digest callable与position codec，非business object/状态/port。Step7 runner generic必须约束CanonicalMarketIntent；旧subject cursor无法表达work/audit的问题已本步闭合并回源。fingerprint/assetdigest、revision/sourcecursor、publictoken/internalposition、localfence/remoteintent四组严格分离。测试入口见Step16承接；当前没有运行或生成真实digest。

## 8. 回填草稿

正式§12使用7.1 key/result表、7.2～7.3版本化canonical规则与33DTO映射、7.5资源竞争/重入表、7.6 cursor/publictoken schema和合法selector表。pure callable和有限position类型同时回到Step7，不在正式装配新增规则。

## 9. 待确认事项

Q-MP-01容量/锁预算/幂等保留authority；owner原intent支持/probe依MP-UP保留。没有生产吞吐、fingerprint输出或用户支付事实。

## 10. 进入下一步条件

key来源、33write DTO canonical覆盖、原fullresult、锁序/remote intent分离、fence、唯一Row position/publictoken与fake parity完成文档自检；必要Step6/7回修已落盘。允许下一阅读SOP Step14/规范5.13、RuntimeConfig/AdapterBinding与实际Core/SDK manifests。尚无编译、hash fixture输出、PG race执行或资格关闭。
