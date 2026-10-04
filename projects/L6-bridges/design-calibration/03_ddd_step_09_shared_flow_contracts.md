# L6-bridges 03 Step9：共享处理流契约

## 1. G0问题、诊断、取舍与草稿范围

问题：如何在不扩展19入口/23业务port的条件下，完成DTO到原对象、begin到reservation到seal、seed到actual stored result、两事务到原op恢复的闭环？来源：Step6 Application§5及Domain Dedup/Audit/Handoff卡；Step7 ports§1/6~8、callables§10.1；Step8 shared/各族完整构造表；正式02§8.1。本文段落是每流可引用的**内联步骤**，不是新增helper函数、service、port或请求。

诊断：`QualifiedLocalMutationPlan`包含claim后的完整候选，不能在begin之前要求它已完成；`SafeOriginalResultRef`包含actual payload/store basis，不能在stage之前制造。Step7规定stage_result immutable、begin不接plan、seal接完整plan，足以断开循环；各flow仍必须列出自己的read、guard、factory、stage与外呼点。历史总success/outbox模板不能承接这些阶段。

| 方案 | 采用 / 不采用及原因 |
|---|---|
| 原UoW三阶段：preflight/expected -> begin/reserve/候选 -> stage/seal/actual commit | 采用；所有外部qualification在事务外，claim候选不要求提前actual commit |
| 提前构造Committed/Accepted ref或把stage成功当commit | 不采用；会伪造driver/owner/platform/consumer事实 |
| key+完整typed meaning读取原result，current过滤、原非终态只合法same-op继续 | 采用；不能用“查无result”重执行，也不能用初次local接管proof冒充业务终态 |
| 同key每阶段覆盖stored result或换operation/key逃避immutable条件 | 不采用；原key/meaning/op与历史结果必须保持；后续阶段写原mutable record，不改旧proof |
| actual安全审计、正式规则下的条件canonical；无新outbox/projection/run | 采用；Observability producer准入未立仍阻相应positive |

## 2. 伪代码记法及前置字段来源

所有Rust块是函数体设计片段，不是可编译源码；不宣称通过borrow checker。`?`仅用于**尚未begin、尚未可能IO**的pure/preflight失败；持有tx或越过effect之后必须穷尽处理并保留original，不能由`?`把未知缩成普通错误。具体字段一次性移交/短借，表中同名变量是原已定义类型，不暗示所有carrier可Clone/Copy。省略的只是已登记字段绑定/穷尽分类正文，不是未知方法。

| 共用变量 / 原类型 | 唯一来源与禁止 |
|---|---|
| actor / ActorRef、authority / SafeAuthorityRef、trace / TrustedTraceRef | 原trusted C context、registered E consumer或trusted J context；去显示名但不改变身份；不从wire/external_id/PAT推授权 |
| read / BridgeLocalReadContext | 先正式subject/scope资格；C existing/结果读取由SafeReadQualificationPort，绑定读取再BindingQualificationPort核；C01初建没有existing subject，使用qualify_draft已核配置basis与actual host authority的受权BridgeLocalReadPurpose::Command读，driver重核namespace/purpose/window，不假装已经存在subject；E由原source/owner current，J由ConfigQualificationPort::qualify_maintenance_read；purpose/window/namespace严格一致 |
| namespace_scope / DedupNamespaceScope、meaning / BodyFreeOperationMeaningRef | 固定六namespace、已解析scope、具名操作族全部stable字段/版本/条件；原factory及qualify_meaning；不加trace/time/正文hash，缺codec NotEstablished |
| original / OriginalOperationEffectRef | 已存在dedup/subject优先；确无记录时才UoW技术Operation ID形成尚未执行关联；original不等mutation ID/trace/event ID |
| mutation / LocalMutationRef、audit_ref、result_id及首建subject refs | LocalUnitOfWorkPort::allocate_id，purpose逐原BridgeLocalIdPurpose；LocalRefToken及具名ref原factory；首建ID不入meaning。每独立本地阶段有自己的mutation，业务original/effect不换 |
| expected / ExpectedLocalRevisionSet | 完整committed baseline的typed subject/revision；Absent只实际插入，Present只原row；config/generation/cursor/lane轴另核；read-set竞态在same-driver stage/commit重新比较 |
| material / BodyFreeMutationMaterial | 原四字段subjects/basis/stage_reason/schema；当前正式safe policy与注册schema，stage是拟持久化的真实本地变化，commit前不宣称已发生；不含正文、secret、敏感审批或可还原派生 |
| observation / MutationObservationRequirement | SafeObservationPort::qualify_requirement实际返回；无规则不默认audit-only，Mandatory/OptionalQualified的canonical/admission/current缺一拒绝 |
| dedup retention / QualifiedRetentionWindowRef、handoff current | 正式当前policy/producer资格中的原窗口与purpose；不是通用TTL/default；缺字段对应positive blocked，不从timer构造 |

## 3. 函数级调用图：共享mutation内联顺序

```text
[Specific execute or consume]
  | query qualified committed rows and original key/result
  | call current owner qualifications and observation preflight
  | pure build expected set and candidate identities
  v
[LocalUnitOfWorkPort]
  | tx begin with mutation original expected observation read
  | tx reserve handoff or one-use or lane claim when required
  v
[Specific Domain factory or transition]
  | pure candidate plus actual reservation identity
  v
[Typed Repository and SafeTraceRepository]
  | stage business candidate and dedup
  | append audit and conditional handoff
  | stage original result seed
  v
[QualifiedLocalMutationPlan and LocalUnitOfWorkPort]
  | call validate_before_commit
  | call seal_plan then tx commit or rollback
  v
[Actual committed read and result mapper]
  | query original result and current visible slice
  | external call only after committed claim and final current check
```

关键说明：

- begin的输入不包含尚未取得的claim；final plan在reserve和全部候选之后形成。
- 网络、private/secret解析、foreign current资格不在local tx持有期间；tx只same-driver baseline/技术reservation/具名stage。
- actual commit proof是继续IO的必要条件；读row、plan factory或stage receipt都不能替它。

## 4. 原键、结果与重入（每flow先执行）

```rust
// [ContinuityRepository.find_dedup(QualifiedIdempotencyKey key, BridgeLocalReadSession session, BridgeCallControl control)]
let dedup_row = continuity.find_dedup(&key, &session, control).await?;
// [SafeTraceRepository.find_result_for_key(QualifiedIdempotencyKey key, BodyFreeOperationMeaningRef meaning, BridgeLocalReadSession session, BridgeCallControl control)]
let stored = trace_repo.find_result_for_key(&key, &meaning, &session, control).await?;
// [StoredResultReusePolicy.decide(Option<&DedupRecord> dedup, Option<&SafeOriginalResultRef> stored, BodyFreeOperationMeaningRef meaning, Option<&CurrentReadQualification> disclosure, SafeInstant now)]
let reuse = reuse_policy.decide(dedup, stored.as_ref(), &meaning, disclosure, now)?;
match reuse {
    StoredResultReuseDecision::FreshReservationAllowed => { /* 只开放后续local接管；不授IO。 */ }
    StoredResultReuseDecision::Visible(view) => { /* 终态复用；非终态按原record阶段再分支。 */ }
    StoredResultReuseDecision::OriginalPending(original) => { /* 无新效果；保原operation，按该族恢复合同。 */ }
    StoredResultReuseDecision::NotDisclosed(reason) => { /* 零hidden ref/count输出。 */ }
    StoredResultReuseDecision::Conflict(reason)
    | StoredResultReuseDecision::Expired(reason)
    | StoredResultReuseDecision::Unavailable(reason) => { /* 安全停；不换key/op。 */ }
}
```

`dedup`是已读取row的`value()`借用，不用shape getter构造fresh行；`disclosure`来自actual current qualification。当前主语不许披露时不调用policy输出可见view；source验签和mandatory raw边界仍在E01/E03查重前完成。loaded stored ref须actual get/find返回、same key/meaning/original/kind；same key不同meaning有限Conflict，不返回winner ref。

**immutable结果与多阶段约束**：初始A可以保存`PreparedResultPayload::LocalMutation(A)`，actual commit才物化真实Local proof；它证明接管，不证明owner/platform/consumer终态。B对原record及dedup进行CAS，不能覆盖A的stored result。B的result_seed只能从actual A stored行用原result_id/original/kind/scope与`Known(原payload)`完整重建；`stage_result`只核同key/meaning/op的原记录并复用，不产生新结果行或更改payload。当前业务结果保在原record的具名result Slot/immutable receipt，response从完整当前snapshot提取，而非把A local proof转换成Accepted。若旧stored不可读/不匹配，B保真实foreign result及原mutation恢复责任，不填伪结果或绕unique。

Dedup首建固定Reserved+Missing；没有actual stored proof前不得调用`attach_result`。首commit已原子保存key/meaning/op与stored result，即使dedup Slot仍Missing，`find_result_for_key`是合法原读取面；不得仅凭Missing判断Fresh。已有真实stored结果的后续finalize可调用`attach_result(actual result, actual expected)`并stage；只有该Domain合法边才变ResultRecorded。业务非终态继续资格来自原record及正式合同，不来自Reserved/ResultRecorded标签，local A result不永久阻止原生命周期的J02/J03只读probe或J01/J04正式same-op继续。

## 5. 构造、封存与实际提交

受权expiry补口：J05本次plan/seed/audit/Job dedup的original一致；被维护目标Dedup保它自己的原business original，不替换成Job original。完整Qualification meaning(subject,expected,basis)+qualify_dedup_expiry实际proof+目标committed row/CAS构成唯一关联；seal只允许目标expire的state/local变化，禁止generic异op写/目标首建/删除重执行。完整expected同时含目标Present和Job独立reservation，proof/维护窗口在seal时仍current；缺关联或额外候选InvariantViolation，全部rollback，不把target expiry当business known/no-effect。

### 5.1 构造表

| 原factory / 参数全集 | 字段来源 / 安全出口 |
|---|---|
| DedupRecord::reserve七参 | UoW dedup ID、qualified namespace/key/meaning/original、Missing、正式retention；unique winner只实际driver。existing只rehydrate/get，不重新reserve覆盖 |
| SafeAuditRecord::from_mutation九参 | UoW audit_ref/mutation、原operation、material的subjects/stage_reason/basis/schema、原trace、完整material；same mutation唯一、local1、无Accepted未来事实 |
| PreparedStoredResultSeed::from_parts五参 | 首次actual技术result ID或原stored result_id、原original、固定C/E/J kind、LocalMutation或actual Known、原scope；无client指定result/commit basis |
| CurrentSafeHandoffQualification::from_parts八参 | 仅正式preflight成立的候选handoff/original/audit技术关联、actual canonical/schema/admission/retention/validity；新身份只是本地候选，不冒称existing committed或consumer准入新签发；source字段欠缺不造资格 |
| SafeHandoffRecord::from_canonical十一参 | 候选handoff ID、同audit、actual material/admission/schema/retention、原consumer operation、consumer Missing/claim Missing、上述完整current、actual now；缺producer contract不建Pending |
| QualifiedLocalMutationPlan::from_parts八参 | mutation/original、所有typed纯候选writes、完整expected、seed、audit、正式observation、条件Some(handoff)或正式audit-only None；audit/handoff不重复塞writes |

### 5.2 无claim的本地提交片段

以下以各flow已准备的`writes/expected/seed/audit/observation/handoff`为输入，具体业务stage见各流。该片段没有新的submit函数。

```rust
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun = uow.begin(&mutation, &original, &expected, &observation, &read, control).await;
let mut tx = match begun {
    Ok(tx) => tx,
    Err(_) => {
        // 保原mutation/original/phase；没有tx可rollback，也不继续stage或外呼。
        // 由各flow原有限结果出口返回；已有原operation的取消/未知不得缩为普通早退错误。
        return Err(BridgePortError::Indeterminate { original, phase: BridgeCallPhase::LocalStage });
    }
};
// 业务typed stage、dedup stage及条件handoff stage在各流逐名列出；任一失败走下方rollback分支。
// [SafeTraceRepository.append_audit(SafeAuditRecord audit, LocalRevisionCondition absent, BridgeLocalTransaction tx, BridgeCallControl control)]
let audit_stage = trace_repo.append_audit(&audit, LocalRevisionCondition::Absent, &mut tx, control).await;
// [SafeTraceRepository.stage_result(PreparedStoredResultSeed seed, QualifiedIdempotencyKey key, BodyFreeOperationMeaningRef meaning, BridgeLocalTransaction tx, BridgeCallControl control)]
let result_stage = trace_repo.stage_result(&seed, &key, &meaning, &mut tx, control).await;
// [QualifiedLocalMutationPlan.from_parts(LocalMutationRef mutation, OriginalOperationEffectRef original, Vec<PreparedLocalChange> writes, ExpectedLocalRevisionSet expected, PreparedStoredResultSeed seed, SafeAuditRecord audit, MutationObservationRequirement observation, Option<SafeHandoffRecord> handoff)]
let plan = QualifiedLocalMutationPlan::from_parts(mutation, original, writes, expected, seed, audit, observation, handoff);
// [QualifiedLocalMutationPlan.validate_before_commit(SafeInstant now)]
let guard = plan.validate_before_commit(now);
// [LocalUnitOfWorkPort.seal_plan(QualifiedLocalMutationPlan plan, BridgeLocalTransaction tx, BridgeCallControl control)]
let sealed = uow.seal_plan(&plan, &mut tx, control).await;
// 仅全部业务stage、audit_stage、result_stage、factory、guard、sealed均成功才commit。
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual = uow.commit(tx, control).await;
```

代码按顺序检查每个Result：一旦失败立即停止后续stage/seal/commit，不在错误之后仍调用函数。它是data-flow伪代码而非用未unwrap的Result调用方法；选定错误分支后消费唯一tx，不能再次commit。tx内外clock域一致，now仅技术provider实际值，不能caller/requested_at代替。seal须核stage set与plan全集相同、unique/版本/同op/current规则，零多余写、零遗漏。

### 5.3 失败、rollback与commit返回

```rust
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let rollback = uow.rollback(tx, control).await;
match rollback {
    Ok(LocalCommitDisposition::RolledBack(proof)) => { /* 只声明原mutation未提交；无外部无效果推断。 */ }
    Ok(LocalCommitDisposition::Indeterminate(mutation)) => { /* 保原mutation+original，零外呼。 */ }
    Ok(LocalCommitDisposition::Committed(committed)) => { /* 不能报rollback；核原mutation权威结果。 */ }
    Err(_) => { /* 保原mutation未知；不解析raw error，不换mutation重新apply。 */ }
}
```

| actual结果 / 错误 | 下一动作与输出上限 |
|---|---|
| Committed | proof原mutation/original/完整revisions/source匹配才可读同key actual result、更新可见slice或继续最后current核验；不是外部成功 |
| RolledBack | 仅原未提交proof，释放候选但保原identity以该族合同处理；外部已known结果仍不能当作被撤销 |
| Indeterminate / commit或rollback Err | 完整原mutation/original/phase retained；只有原权威只读查询/J02，禁止新begin重放原变化或external IO |
| compare_expected Conflict / unique semantic/effect/one-use/rate loser | 有限冲突，rollback须actual proof；可受权重读actual winner并同义复用，不执行第二effect或泄漏winner |
| InvalidInput/Denied/Stale/NotEstablished/Unsupported/Unavailable preflight | finite拒绝/blocked/不可见，无fake audit/dedup；post-effect不缩成普通Unavailable |
| cancellation/timeout/drop | pre-effect可Cancelled；一旦有原operation或越commit/foreign dispatch则原known结果或Indeterminate(original,phase)；无NoIo/NoEffect推断 |

结果出口使用`SafeReadQualificationPort::qualify_subject / qualify_local_read / revalidate`、具名repo的完整committed snapshot及`LocalViewProjector::project`；actual now在资格/host可用期限内。没有读取资格不能造Indeterminate(view)，只允许有限不披露结果，原unknown由宿主/原记录保留。Query在自己的四flow不进入本节mutation片段。

## 6. 条件O01与逐流side-effect inventory

所有**实际发生的本地mutation**有唯一SafeAuditRecord、typed stored result及原dedup/阶段关联；没有local变化的duplicate/no-op/rejected/Query不补audit。固定原trace是材料字段，不新增TraceRecord、history trail、outbox、持久view、stale projection、job run/report/evidence。Observability§7.4九行static map无Bridges，SourceAudit explicit family不含Bridges，当前positive O01/J04/E04不可激活。

| observation实际分支 | audit / handoff / event |
|---|---|
| OwnerPermitsAuditOnly | 唯一本地安全audit，handoff=None，零O01；必须actual owner rule，不是fallback |
| Mandatory / OptionalQualified | 全部current成立且与same-UoW canonical联动时，唯一audit+原canonical候选handoff；commit前零交接，claim/最后current后才原SafeObservationPort::handoff；缺一先阻对应positive |
| 无rule、producer/schema/recipe不兼容 | 不构造fake canonical/event或借其他producer；Blocked/Unavailable，保实际原op，BR-UP-006不关闭 |

O01九字段factory只shape，由Infra正式source mapper从已提交audit/handoff及原producer metadata recipe组装；没有独立请求flow。mutation直接交接和J04共用原record/current/claim/committed proof与same consumer operation约束，详J04；不能同时无claim各发一次。

受权R5：原handoff生命周期E04/J04/J02 Consumer/J05 Handoff须调用SafeObservationPort.qualify_nonrecursive，正式规则Qualified才用MutationObservationRequirement::NonRecursiveResultOnly。local audit/原seed/原record+关联CAS仍同UoW，但handoff=None、零新canonical/O01；validate/seal必须拒绝夹带新producer。rule必须正式同source/original/subjects/current，不能把OwnerPermitsAuditOnly或Mandatory转成该variant。Observability当前无Bridges注册/rule时NotEstablished，保实际原结果，不凭此设计seam宣准入。

## 7. G0草稿、自检与下一步

未来正式03§8.1承接本页§2~6，具体十九flow取各族附录。复杂度：只复用既有schema/方法，内联段不形成新API；同keyimmutable阶段proof与mutable业务record明确分开。尚未执行Rust编译/测试，未生成任何运行材料。

| 停审项 | 人工设计自检 / 来源 |
|---|---|
| begin/reserve/plan循环 | pass；Step7 ports§8先begin登记，claim后final plan，seal全等 |
| result/commit循环 | pass；PreparedResultPayload/actual driver物化，commit前无fake result；首Slot Missing合法，读取不能当fresh |
| 多阶段重入 | pass；旧stored immutable，不覆写或换key/op；原阶段snapshot决定终态/合法继续 |
| actor/scope/current/secret方向 | pass；trusted context/resolver-first、network不持tx、private不入writes/result/audit |
| O01及事实上限 | pass；条件传播，缺准入blocked，零新outbox/run/owner truth/运行证据 |

G0设计审查通过只开放C01；三层推进记录见主文件。各C/E/J仍须逐流审计自己的字段与调用，不把本页pass当19条flow已完成。

## 8. O批次：条件O01的实际附着点与停审

来源：Step8 Outbound§2~4九字段协议、Step6 audit/handoff/G0 plan、Step7 SafeObservation/SafeTrace/commit，以及本轮实际复核Observability03§7.4。问题/诊断：O01不是第20个request或platform outbound；如果每个result-finalize又生成新O01，会出现递归交接。采用formal mutation observation规则和原J04唯一claim通路，不采用新publisher/outbox、consumer回执新producer或“缺准入自动audit-only”。

### 8.1 函数级调用图：条件O01

```text
[C/E/J actual business-local mutation]
  | call qualify_requirement with original safe material
  +--> formal AuditOnly: append audit/result, handoff None, zero O01
  +--> formal Mandatory/OptionalQualified:
        tx stage business + audit + canonical-linked original handoff + result
        actual commit; no publication on Unknown
        [original handoff/current/claim -> J04 existing flow]
          call SafeObservationPort.handoff after claim actual commit
          [E04/J02/J04 result finalize]
            save original consumer outcome only, no recursive new O01
```

关键说明：

- O01只附着于actual local mutation的正式qualified observation分支，audit-only零event、commit未知零交接。
- J04与直接交接共享原claim；E04/J02/J04的consumer结果finalize不生成新producer，缺非递归规则则blocked。

| 原O01九字段 | 实际来源 / 不能替代 |
|---|---|
| version/metadata | bridge.v1；原注册producer recipe的event/source/scope/trace，身份固定不是random/time/body hash；缺recipe blocked |
| source/material/admission | actual committed唯一audit ref与原canonical/producer准入，不能copy Governance/SourceOwner label或log ref |
| handoff/original | actual原handoff及其consumer namespace原op，不等业务local op/mutation/event ID |
| schema/retention | 原canonical exact schema/正式保留窗口；bridge.v1/local timestamp不是schema或期限依据 |

```rust
// [BridgeLocalDispositionRecordedEvent.from_parts(BridgeProtocolVersion version, SafeEventMetadata metadata, SafeAuditRef source, CanonicalSafeMaterialRef material, ProducerAdmissionRef admission, SafeHandoffRef handoff, OriginalHandoffOperationRef original, SafeProducerSchemaRevision schema, QualifiedRetentionWindowRef retention)]
let event = /* only Infra registered mapper with actual committed/current inputs */ BridgeLocalDispositionRecordedEvent::from_parts(version, metadata, source, material, admission, handoff, original, schema, retention);
// This shape construction cannot grant publication/admission; current positive producer contract is absent.
// [SafeObservationPort.handoff(SafeHandoffRecord record, CurrentSafeHandoffQualification current, SafeHandoffClaimRef claim, CommittedLocalMutationRef committed, BridgeCallControl control)]
let outcome = /* only J04 exact actual-claim branch, not called from factory */ observation.handoff(&actual_record, &actual_current, &actual_claim, &committed_original_material, control).await;
```

事务/错误：condition record与业务mutation同源all-or-none；claim独立actual local阶段、consumer调用tx外；actual结果在原row CAS finalize。缺canonical/admission/schema/recipe/retention/source/current则原finite Blocked/Unavailable，zero factory/claim/handoff；Unknown保同material/op/claim，不能盲发或新签operation。E04/J04/J02 result-finalize若无正式非递归audit规则，先Blocked，不私自降级或建新producer。

当前限制：Observability九行static map无Bridges，SourceAudit explicit family仅Governance/Artifact/Runtime/Sandbox。因此O01/E04/J04相关positive不可激活；仅未来合同完整时才达上述条件路径，本文没有注册source、创建canonical、account/token/event或执行交接。runtime seam在adapter/config层重新核验，不由配置enable或pure factory绕过。

| 单O停审项 | 结论 / 缺口 |
|---|---|
| protocol/DTO/object/port | pass_fail_closed_design；唯一九字段、原audit/handoff/commit/claim与J04发送面，不新增request/callable |
| tx/state/error/side-effect | pass_design_only；actual commit与current先交接、original consumer op不换、result-only无递归producer；BR-UP-006保持blocked |
| 测试/phase/复杂度 | pass_design_only；原authorization/continuity/platform/local-commit/protocol边界target：commit前零send、wrong producer、missing canonical、audit-only零event、竞争claim/unknown/E04不递归；全部planned，下一J01 |
