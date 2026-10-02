# Step9 U3 目录/市场版本独立flow小循环

## 思考、诊断与取舍

本族从Step8完整typed请求逐入口推导读取/构造/guard/Tx/结果。先current披露与fulloriginalreplay，再fresh业务；SQLtx不跨externalowner调用。采用原typedcheckpoint/permission/probe/完整manifest，拒绝body复制、scan/ACK审批、取消覆盖lateeffect和不可见count泄漏。伪代码只设计，不宣称compile/run。

## 批次表

| flow | 协议 | 对象能力 | Tx / effect |
|---|---|---|---|
| CreateMarketplaceListingFlow | CreateMarketplaceListingRequest | MarketplaceListing.create / currentpublisher + categoryscope | 单accepted UoW |
| EditMarketplaceListingFlow | EditMarketplaceListingRequest | MarketplaceListing.edit / currentpublisher categoryscope | 单accepted UoW |
| MaintainMarketCategoryFlow | MaintainMarketCategoryRequest | Category.create/change / explicitvariant+parent ancestry+taxonomy authority | 单accepted UoW |
| RegisterMarketVersionFlow | RegisterMarketVersionRequest | MarketVersion.stage / exactsubmittedbasis/source | 单accepted UoW |
| ListMarketVersionFlow | ListMarketVersionRequest | VersionAdmissionPolicy.evaluate + MarketVersion.list / formalcurrentapproved fullbinding | 单accepted UoW |
| SearchMarketplaceCatalogFlow | SearchMarketplaceCatalogRequest | ProjectionStore.search_catalog / scope-first item/count/token | readonly，无写 |
| GetMarketplaceListingFlow | GetMarketplaceListingRequest | listing/version/source typedread，noncopiedbody | readonly，无写 |
| ListMarketVersionsFlow | ListMarketVersionsRequest | MarketStore.list_versions / page singlemeta | readonly，无写 |
| SelectMarketVersionFlow | SelectMarketVersionRequest | typedexactversion + read-only formalcurrent资格；无创建intent | readonly，无写 |
| ListMarketCategoriesFlow | ListMarketCategoriesRequest | MarketStore.list_categories / scope/parent current | readonly，无写 |

### CreateMarketplaceListingFlow

#### 入口与目标

`pub async fn create_marketplace_listing(&self, request: CommandEnvelope<CreateMarketplaceListingRequest>) -> Result<ExecutionResult<MarketplaceListingResult>, MarketError>`；planned catalog_version/create_marketplace_listing.rs。目标：MarketplaceListing.create / currentpublisher + categoryscope。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API create_marketplace_listing typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[MarketplaceListing factory/member + typed guard]
  | save 目录壳+metadata/category关联，不自动Listed
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed MarketplaceListingResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Publisher(request.body.publisher_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::CreateMarketplaceListing, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Listing(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: CreateMarketplaceListingRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let publisher_row = support.require(store.load_publisher(&mut reads, body.publisher_ref.clone()).await?)?;
for reference in &body.category_refs { support.require(store.load_category(&mut reads, reference.clone()).await?)?; }
Ok((publisher_row,))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (publisher_row,) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let authority = publisher_port.current_authority(publisher_row.value.clone(), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Listing(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.push(support.basis(SafeBasisKind::Publisher, authority.authority_ref.token.clone())?);
    let window = support.bounded_window(reserved.cursor, None)?;
    // [UnitOfWork.lock_publisher(Tx tx, PublisherRelationRef publisher_ref)]
    uow.lock_publisher(&mut tx, body.publisher_ref.clone()).await?;
    let current_publisher = support.require(store.load_publisher(&mut tx, body.publisher_ref.clone()).await?)?;
    support.assert_binding(current_publisher.value.state == PublisherRelationState::Bound)?;
    // Current formal authority must match this exact reloaded relation; local Release uses same lock.
    // [MarketplaceListing factory/member; typed owner input construction]
    let listing = MarketplaceListing::create(ListingCreationInput { listing_ref: ids.new_marketplace_listing_ref(), publisher_ref: body.publisher_ref.clone(), metadata: body.metadata.clone(), category_refs: body.category_refs.clone() })?;
    let saved = store.save_listing(&mut tx, listing.clone(), ExpectedMarketRevision::MustNotExist).await?;
    let subject = MarketAuditSubjectRef::Listing(listing.listing_ref.clone());
    // [FlowSupport.queue_projections(tx, reserved, subject, current scope)]
    works.extend(support.queue_projections(&mut tx, &reserved, subject.clone(), prepared.scope.read_context.clone()).await?);
    // [FlowSupport.audit / receipt: stable reserved IDs, complete safe refs]
    let audit = support.audit(&reserved, subject, bases.clone())?;
    // Freeze the accepted audit handoff before constructing the complete original receipt.
    works.push(support.schedule(
        &reserved, None,
        MarketWorkTargetRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketEffectIntentRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketOperationKind::DispatchObservation, prepared.scope.read_context.scope_ref.clone(),
        None, None, vec![audit.audit_ref.clone()],
    )?);
    let receipt = support.receipt(&reserved, works.iter().map(|w|w.work.work_ref.clone()).collect(), bases);
    let result = MarketplaceListingResult { receipt, listing_ref: listing.listing_ref, metadata: listing.metadata, category_refs: listing.category_refs, revision: saved.revision };
    Ok((MarketResultSurface::Listing(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Listing(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | CreateMarketplaceListingRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let authority = publisher_port.current_authority(publisher_row.value.clone(), prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | 目录壳+metadata/category关联，不自动Listed |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整MarketplaceListingResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned create_marketplace_listing: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“目录壳+metadata/category关联，不自动Listed”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### EditMarketplaceListingFlow

#### 入口与目标

`pub async fn edit_marketplace_listing(&self, request: CommandEnvelope<EditMarketplaceListingRequest>) -> Result<ExecutionResult<MarketplaceListingResult>, MarketError>`；planned catalog_version/edit_marketplace_listing.rs。目标：MarketplaceListing.edit / currentpublisher categoryscope。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API edit_marketplace_listing typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[MarketplaceListing factory/member + typed guard]
  | save 仅marketmetadata/categoryrevision，无ownerbody
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed MarketplaceListingResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Listing(request.body.listing_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::EditMarketplaceListing, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Listing(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: EditMarketplaceListingRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let listing_row = support.require(store.load_listing(&mut reads, body.listing_ref.clone()).await?)?;
let publisher_row = support.require(store.load_publisher(&mut reads, listing_row.value.publisher_ref.clone()).await?)?;
Ok((listing_row, publisher_row))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (listing_row, publisher_row) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let authority = publisher_port.current_authority(publisher_row.value.clone(), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Listing(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.push(support.basis(SafeBasisKind::Publisher, authority.authority_ref.token.clone())?);
    let window = support.bounded_window(reserved.cursor, None)?;
    // [UnitOfWork.lock_publisher(Tx tx, PublisherRelationRef publisher_ref)]
    uow.lock_publisher(&mut tx, listing_row.value.publisher_ref.clone()).await?;
    let current_publisher = support.require(store.load_publisher(&mut tx, listing_row.value.publisher_ref.clone()).await?)?;
    support.assert_binding(current_publisher.value.state == PublisherRelationState::Bound)?;
    // Current formal authority must match this exact reloaded relation; local Release uses same lock.
    // [MarketplaceListing factory/member; typed owner input construction]
    let loaded = support.require(store.load_listing(&mut tx, body.listing_ref.clone()).await?)?;
    support.expect_revision(loaded.revision, body.expected_revision)?;
    for reference in &body.category_refs { support.require(store.load_category(&mut tx, reference.clone()).await?)?; }
    let mut listing = loaded.value;
    listing.edit(ListingMetadataInput { metadata: body.metadata.clone(), category_refs: body.category_refs.clone() })?;
    let saved = store.save_listing(&mut tx, listing.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
    let subject = MarketAuditSubjectRef::Listing(listing.listing_ref.clone());
    // [FlowSupport.queue_projections(tx, reserved, subject, current scope)]
    works.extend(support.queue_projections(&mut tx, &reserved, subject.clone(), prepared.scope.read_context.clone()).await?);
    // [FlowSupport.audit / receipt: stable reserved IDs, complete safe refs]
    let audit = support.audit(&reserved, subject, bases.clone())?;
    // Freeze the accepted audit handoff before constructing the complete original receipt.
    works.push(support.schedule(
        &reserved, None,
        MarketWorkTargetRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketEffectIntentRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketOperationKind::DispatchObservation, prepared.scope.read_context.scope_ref.clone(),
        None, None, vec![audit.audit_ref.clone()],
    )?);
    let receipt = support.receipt(&reserved, works.iter().map(|w|w.work.work_ref.clone()).collect(), bases);
    let result = MarketplaceListingResult { receipt, listing_ref: listing.listing_ref, metadata: listing.metadata, category_refs: listing.category_refs, revision: saved.revision };
    Ok((MarketResultSurface::Listing(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Listing(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | EditMarketplaceListingRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let authority = publisher_port.current_authority(publisher_row.value.clone(), prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | 仅marketmetadata/categoryrevision，无ownerbody |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整MarketplaceListingResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned edit_marketplace_listing: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“仅marketmetadata/categoryrevision，无ownerbody”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### MaintainMarketCategoryFlow

#### 入口与目标

`pub async fn maintain_market_category(&self, request: CommandEnvelope<MaintainMarketCategoryRequest>) -> Result<ExecutionResult<CategoryResult>, MarketError>`；planned catalog_version/maintain_market_category.rs。目标：Category.create/change / explicitvariant+parent ancestry+taxonomy authority。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API maintain_market_category typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[Category factory/member + typed guard]
  | save 显式create/change；taxonomyparent cycle/scope验证；无sourcekind truth
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed CategoryResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = match &request.body.intent { CategoryMaintenanceCandidate::Create(c) => Some(c.requested_scope.clone()), CategoryMaintenanceCandidate::Change(_) => None };
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = match &request.body.intent {
    CategoryMaintenanceCandidate::Create(c) => c.parent_ref.clone().map(MarketAuditSubjectRef::Category).into_iter().collect(),
    CategoryMaintenanceCandidate::Change(c) => vec![MarketAuditSubjectRef::Category(c.category_ref.clone())],
};
let start = commands.prepare(request, MarketOperationKind::MaintainMarketCategory, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Category(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: MaintainMarketCategoryRequest = prepared.body.clone();
// No fresh local business reads are needed; no extra readonly transaction is opened.

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let taxonomy_bases = publisher_port.authorize_taxonomy(prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Category(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.extend(taxonomy_bases.clone());
    let window = support.bounded_window(reserved.cursor, None)?;
    // [Category factory/member; typed owner input construction]
    let (category, saved) = match body.intent {
        CategoryMaintenanceCandidate::Create(candidate) => {
            if let Some(parent) = candidate.parent_ref.clone() { store.category_ancestors(&mut tx, parent, prepared.scope.read_context.clone()).await?; }
            let value = Category::create(CategoryCreationInput { category_ref: ids.new_category_ref(), label: candidate.label, parent_ref: candidate.parent_ref, scope_ref: prepared.scope.read_context.scope_ref.clone() })?;
            let saved = store.save_category(&mut tx, value.clone(), ExpectedMarketRevision::MustNotExist).await?;
            (value, saved)
        },
        CategoryMaintenanceCandidate::Change(candidate) => {
            let loaded = support.require(store.load_category(&mut tx, candidate.category_ref.clone()).await?)?;
            support.expect_revision(loaded.revision, candidate.expected_revision)?;
            let ancestors = match candidate.parent_ref.clone() { Some(parent) => store.category_ancestors(&mut tx, parent, prepared.scope.read_context.clone()).await?, None => vec![] };
            support.assert_binding(candidate.parent_ref.as_ref() != Some(&candidate.category_ref) && !ancestors.contains(&candidate.category_ref))?;
            let mut value = loaded.value;
            value.change(CategoryChangeInput { label: candidate.label, parent_ref: candidate.parent_ref })?;
            let saved = store.save_category(&mut tx, value.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
            (value, saved)
        },
    };
    let subject = MarketAuditSubjectRef::Category(category.category_ref.clone());
    // [FlowSupport.queue_projections(tx, reserved, subject, current scope)]
    works.extend(support.queue_projections(&mut tx, &reserved, subject.clone(), prepared.scope.read_context.clone()).await?);
    // [FlowSupport.audit / receipt: stable reserved IDs, complete safe refs]
    let audit = support.audit(&reserved, subject, bases.clone())?;
    // Freeze the accepted audit handoff before constructing the complete original receipt.
    works.push(support.schedule(
        &reserved, None,
        MarketWorkTargetRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketEffectIntentRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketOperationKind::DispatchObservation, prepared.scope.read_context.scope_ref.clone(),
        None, None, vec![audit.audit_ref.clone()],
    )?);
    let receipt = support.receipt(&reserved, works.iter().map(|w|w.work.work_ref.clone()).collect(), bases);
    let result = CategoryResult { receipt, category_ref: category.category_ref, label: category.label, parent_ref: category.parent_ref, revision: saved.revision };
    Ok((MarketResultSurface::Category(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Category(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | MaintainMarketCategoryRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let taxonomy_bases = publisher_port.authorize_taxonomy(prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | 显式create/change；taxonomyparent cycle/scope验证；无sourcekind truth |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整CategoryResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned maintain_market_category: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“显式create/change；taxonomyparent cycle/scope验证；无sourcekind truth”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### RegisterMarketVersionFlow

#### 入口与目标

`pub async fn register_market_version(&self, request: CommandEnvelope<RegisterMarketVersionRequest>) -> Result<ExecutionResult<MarketVersionResult>, MarketError>`；planned catalog_version/register_market_version.rs。目标：MarketVersion.stage / exactsubmittedbasis/source。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API register_market_version typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[MarketVersion factory/member + typed guard]
  | save Staged exact immutableownerbinding；marketVersion不是ownerVersion
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed MarketVersionResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Listing(request.body.listing_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::RegisterMarketVersion, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Version(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: RegisterMarketVersionRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let listing_row = support.require(store.load_listing(&mut reads, body.listing_ref.clone()).await?)?;
let application_row = support.require(store.load_application(&mut reads, body.application_ref.clone()).await?)?;
let basis = support.require(store.load_basis(&mut reads, support.require(application_row.value.basis_ref.clone())?).await?)?;
let publisher_row = support.require(store.load_publisher(&mut reads, listing_row.value.publisher_ref.clone()).await?)?;
Ok((listing_row, application_row, basis, publisher_row))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (listing_row, application_row, basis, publisher_row) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let authority = publisher_port.current_authority(publisher_row.value.clone(), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Version(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.push(support.basis(SafeBasisKind::Publisher, authority.authority_ref.token.clone())?);
    let window = support.bounded_window(reserved.cursor, None)?;
    // [UnitOfWork.lock_publisher(Tx tx, PublisherRelationRef publisher_ref)]
    uow.lock_publisher(&mut tx, basis.publisher_ref.clone()).await?;
    let current_publisher = support.require(store.load_publisher(&mut tx, basis.publisher_ref.clone()).await?)?;
    support.assert_binding(current_publisher.value.state == PublisherRelationState::Bound)?;
    // Current formal authority must match this exact reloaded relation; local Release uses same lock.
    // [MarketVersion factory/member; typed owner input construction]
    let listing_now = support.require(store.load_listing(&mut tx, body.listing_ref.clone()).await?)?;
    let app_now = support.require(store.load_application(&mut tx, body.application_ref.clone()).await?)?;
    support.assert_binding(app_now.value.state == PublicationApplicationState::Submitted && app_now.value.basis_ref == Some(basis.basis_ref.clone()) && listing_now.value.publisher_ref == basis.publisher_ref)?;
    let version = MarketVersion::stage(MarketVersionCreationInput { version_ref: ids.new_market_version_ref(), listing_ref: body.listing_ref.clone(), source_binding: basis.source, application_ref: body.application_ref.clone() })?;
    let saved = store.save_version(&mut tx, version.clone(), ExpectedMarketRevision::MustNotExist).await?;
    let subject = MarketAuditSubjectRef::Version(version.version_ref.clone());
    // [FlowSupport.queue_projections(tx, reserved, subject, current scope)]
    works.extend(support.queue_projections(&mut tx, &reserved, subject.clone(), prepared.scope.read_context.clone()).await?);
    // [FlowSupport.audit / receipt: stable reserved IDs, complete safe refs]
    let audit = support.audit(&reserved, subject, bases.clone())?;
    // Freeze the accepted audit handoff before constructing the complete original receipt.
    works.push(support.schedule(
        &reserved, None,
        MarketWorkTargetRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketEffectIntentRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketOperationKind::DispatchObservation, prepared.scope.read_context.scope_ref.clone(),
        None, None, vec![audit.audit_ref.clone()],
    )?);
    let receipt = support.receipt(&reserved, works.iter().map(|w|w.work.work_ref.clone()).collect(), bases);
    let result = MarketVersionResult { receipt, version_ref: version.version_ref, listing_ref: version.listing_ref, source_binding: version.source_binding, application_ref: version.application_ref, state: version.state, decision_binding: version.decision_binding, disposition_ref: version.disposition_ref, revision: saved.revision };
    Ok((MarketResultSurface::Version(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Version(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | RegisterMarketVersionRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let authority = publisher_port.current_authority(publisher_row.value.clone(), prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | Staged exact immutableownerbinding；marketVersion不是ownerVersion |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整MarketVersionResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned register_market_version: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“Staged exact immutableownerbinding；marketVersion不是ownerVersion”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### ListMarketVersionFlow

#### 入口与目标

`pub async fn list_market_version(&self, request: CommandEnvelope<ListMarketVersionRequest>) -> Result<ExecutionResult<MarketVersionResult>, MarketError>`；planned catalog_version/list_market_version.rs。目标：VersionAdmissionPolicy.evaluate + MarketVersion.list / formalcurrentapproved fullbinding。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API list_market_version typedRequest]
  | call CommandRunner.prepare(current scope -> fullresult replay)
  v
[fresh readonly local facts -> external formal prechecks; no write Tx]
  | tx begin ReadWrite -> reserve under operation-key lock
  v
[MarketVersion factory/member + typed guard]
  | save currentformalapproved fullbinding后Listed；Restricted可explicit新依据，Withdrawn拒绝
  v
[work/plan + audit + StoredResult + Operation.complete]
  | commit -> KnownCommitted / Unknown-key-resolution
  v
[original typed MarketVersionResult]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [CommandRunner.prepare(CommandEnvelope request, MarketOperationKind kind, typed subjects, candidates, requested_scope)]
let subjects = vec![MarketAuditSubjectRef::Version(request.body.version_ref.clone())];
let start = commands.prepare(request, MarketOperationKind::ListMarketVersion, subjects, source_candidates, requested_scope).await?;
let prepared = match start {
    CommandStart::Fresh(p) => p,
    CommandStart::Replayed(stored) => return match stored.safe_result { MarketResultSurface::Version(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }), _ => Err(support.error(ErrorCode::IntegrityFailure)) },
};
let body: ListMarketVersionRequest = prepared.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut reads = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let version_row = support.require(store.load_version(&mut reads, body.version_ref.clone()).await?)?;
let application_row = support.require(store.load_application(&mut reads, version_row.value.application_ref.clone()).await?)?;
let basis = support.require(store.load_basis(&mut reads, support.require(application_row.value.basis_ref.clone())?).await?)?;
let publisher_row = support.require(store.load_publisher(&mut reads, basis.publisher_ref.clone()).await?)?;
Ok((version_row, application_row, basis, publisher_row))
}.await;
// [UnitOfWork.rollback(readonly tx)]
uow.rollback(reads).await?;
let (version_row, application_row, basis, publisher_row) = local_read?;

// [formal owner ports / FreshGate.publication or admission; outside SQL tx]
let q = gates.admission(version_row.value.clone(), basis.clone(), publisher_row.value.clone(), prepared.scope.read_context.clone()).await?;
// [UnitOfWork.begin(UowMode::ReadWrite)]
let mut tx = uow.begin(UowMode::ReadWrite).await?;
// [CommandRunner.reserve(tx, prepared): lock key -> replay race / fresh ids]
let reserved = match commands.reserve(&mut tx, &prepared).await {
    Ok(ReservationOutcome::Fresh(r)) => r,
    Ok(ReservationOutcome::Replayed(stored)) => {
        uow.rollback(tx).await?;
        return match stored.safe_result {
            MarketResultSurface::Version(value) => Ok(ExecutionResult { value, disposition: ReplayDisposition::OriginalReplayed }),
            _ => Err(support.error(ErrorCode::IntegrityFailure)),
        };
    },
    Err(error) => { uow.rollback(tx).await?; return Err(error); },
};
let outcome = async {
    let mut works: Vec<PlannedResponsibility> = vec![];
    let mut bases: SafeBasisReferenceSet = prepared.scope.authority_basis.clone();
    bases.push(support.basis(SafeBasisKind::Publisher, q.current.publisher.authority_ref.token.clone())?);
    bases.push(support.basis(SafeBasisKind::Source, q.current.source.eligibility_ref.token.clone())?);
    for material in &q.current.materials { bases.push(support.basis(SafeBasisKind::Material, material.material_ref.token.clone())?); }
    bases.push(support.basis(SafeBasisKind::Decision, q.decision_binding.decision_ref.token.clone())?);
    let window = support.bounded_window(reserved.cursor, None)?;
    // [UnitOfWork.lock_publisher(Tx tx, PublisherRelationRef publisher_ref)]
    uow.lock_publisher(&mut tx, basis.publisher_ref.clone()).await?;
    let current_publisher = support.require(store.load_publisher(&mut tx, basis.publisher_ref.clone()).await?)?;
    support.assert_binding(current_publisher.value.state == PublisherRelationState::Bound)?;
    // Current formal authority must match this exact reloaded relation; local Release uses same lock.
    // [MarketVersion factory/member; typed owner input construction]
    uow.lock_version(&mut tx, body.version_ref.clone()).await?;
    let loaded = support.require(store.load_version(&mut tx, body.version_ref.clone()).await?)?;
    support.expect_revision(loaded.revision, body.expected_revision)?;
    support.assert_allowed(VersionAdmissionPolicy::new(q.requirements)?.evaluate(loaded.value.clone(), basis, q.decision_binding.clone(), q.current.clone())?)?;
    let mut version = loaded.value;
    version.list(VersionAdmissionInput { decision_binding: q.decision_binding, current: q.current })?;
    let saved = store.save_version(&mut tx, version.clone(), ExpectedMarketRevision::Exact(loaded.revision)).await?;
    let subject = MarketAuditSubjectRef::Version(version.version_ref.clone());
    // [FlowSupport.queue_projections(tx, reserved, subject, current scope)]
    works.extend(support.queue_projections(&mut tx, &reserved, subject.clone(), prepared.scope.read_context.clone()).await?);
    // [FlowSupport.audit / receipt: stable reserved IDs, complete safe refs]
    let audit = support.audit(&reserved, subject, bases.clone())?;
    // Freeze the accepted audit handoff before constructing the complete original receipt.
    works.push(support.schedule(
        &reserved, None,
        MarketWorkTargetRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketEffectIntentRef::Observation(reserved.operation.value.operation_ref.clone()),
        MarketOperationKind::DispatchObservation, prepared.scope.read_context.scope_ref.clone(),
        None, None, vec![audit.audit_ref.clone()],
    )?);
    let receipt = support.receipt(&reserved, works.iter().map(|w|w.work.work_ref.clone()).collect(), bases);
    let result = MarketVersionResult { receipt, version_ref: version.version_ref, listing_ref: version.listing_ref, source_binding: version.source_binding, application_ref: version.application_ref, state: version.state, decision_binding: version.decision_binding, disposition_ref: version.disposition_ref, revision: saved.revision };
    Ok((MarketResultSurface::Version(result), audit, works))
}.await;
match outcome {
    Err(error) => { uow.rollback(tx).await?; Err(error) },
    Ok((surface, audit, works)) => {
        // [CommandRunner.finish: work+plan -> audit -> complete original result -> operation -> commit]
        let execution = commands.finish(tx, reserved, surface, audit, works).await?;
        support.public_result(execution, |s| match s { MarketResultSurface::Version(v) => Ok(v), _ => Err(support.error(ErrorCode::IntegrityFailure)) })
    },
}
```

#### 输入构造与条件来源

| 符号 / 参数 | 唯一来源 | missing / binding / 保持规则 |
|---|---|---|
| body | ListMarketVersionRequest完整schema | HLD Qualified输入只是内侧构造，不信client approved/verified |
| source_candidates/requested_scope | 本DTO source_candidate或draft_spec.source_candidate/target.scope_ref、Bind requested_scope；无该字段时empty/None | 正式ScopeResolver.resolve重新裁剪，不从opaqueparse；taxonomyCreate明确requested_scope |
| readonly本体 | 上述load返回完整Versioned或immutablebasis | Missing拒绝；mutablefresh在writeTx重读、CAS和fixedbasis/subject相等 |
| formal qualified变量 | let q = gates.admission(version_row.value.clone(), basis.clone(), publisher_row.value, prepared.scope.read_context.clone()).await?; | fields逐schema full复制；consumer_contract取不到blocked，不自造true |
| bases | currentScope.authority_basis + 当次formal source/material/Gov/receiver/disposition/notice safe refs | 同kind typedtoken通过FlowSupport.basis复制；缺正式proof不形成allow/approval |
| window | reserved.cursor固定upper+validatedbatchlimit | 只durable内部scan，不是Querypage；需要所有页时durablecontinuation，不首page冒全量 |
| result/receipt | above完整familyliteral，IDs/revision取actualstaged save/readback | originalfulltyped result同Tx，replay不再生成/更新 |

#### Tx、状态与副作用inventory

| 项 | 本flow边界 |
|---|---|
| accepted局部变化 | currentformalapproved fullbinding后Listed；Restricted可explicit新依据，Withdrawn拒绝 |
| 同UoW必写 | typed owningfacts + qualification/disposition sidecar（如适用）+ Corecontext + audit + 完整MarketVersionResult + Operation Completed + 必要work/plan |
| external effect | 无Command直接dispatch；fresh external调用仅formalread/qualification，业务write effect由durableJob |
| projection | 只安排必要typed derivedwork；不命令伪改Fresh；read发现cursor落后degraded，Rebuild正式推进 |
| failure | malformed/notvisible/diffintent/缺ref/不匹配/非法state/CAS→safe错误与全部rollback；commitUnknown key-read正式resolve，不blind freshretry |
| replay | 当前authority/disclosure先核；同key+fingerprint读原完整payload，不业务precheck/ID/Clock/method/save/dispatch |

#### 测试切口与停审

planned list_market_version: freshaccepted、samekeyoriginalreplay（副作用0）、changedintentconflict、scopehide、missing/unsafe/candidatewrongkind、每save后故障rollback、CASrace，以及“currentformalapproved fullbinding后Listed；Restricted可explicit新依据，Withdrawn拒绝”特有状态/binding/竞态。文档小循环检查DTO、完整method/port调用、result与副作用；不造测试run/evidence。下一flow仅在本flow规则已列后展开。


### SearchMarketplaceCatalogFlow

#### 入口与目标

`pub async fn search_marketplace_catalog(&self, request: QueryEnvelope<SearchMarketplaceCatalogRequest>) -> Result<ReadSurface<CatalogReadView>, MarketError>`；planned catalog_version/search_marketplace_catalog.rs。目标：ProjectionStore.search_catalog / scope-first item/count/token。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API search_marketplace_catalog QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble CatalogReadView; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![], source_candidates, requested_scope).await?;
let body: SearchMarketplaceCatalogRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let outcome = async {
let cursor = uow.current_cursor(&mut tx).await?;
let identity = ProjectionIdentity { kind: MarketProjectionKind::Catalog, scope_ref: scope.scope_ref.clone() };
let source_cursor = projections.source_cursor(&mut tx, identity.clone()).await?;
let projection = support.require(projections.find_projection(&mut tx, identity).await?)?;
let projection_surface = match projection.projection.value.state {
    ReadProjectionState::Fresh if projection.projection.value.source_cursor == source_cursor => ReadSurfaceKind::Ready,
    ReadProjectionState::Fresh | ReadProjectionState::Stale => ReadSurfaceKind::Stale,
    ReadProjectionState::Rebuilding => ReadSurfaceKind::Rebuilding,
    ReadProjectionState::Unavailable => ReadSurfaceKind::Unavailable,
};
if projection_surface != ReadSurfaceKind::Ready {
    return Ok(reads.degrade(ReadMarker { surface: projection_surface,
        projection_ref: Some(projection.projection.value.projection_ref),
        source_cursor: Some(projection.projection.value.source_cursor), failure_ref: None }));
}
let page = projections.search_catalog(&mut tx, body.filter.clone(), PageReadContext { actor: request.actor.clone(), scope: scope.clone(), selector: MarketPageSelector::SearchMarketplaceCatalog }, support.require(request.meta.page.clone())?).await?;
// [ReadFacade.ready(items, PageInfo, ReadMarker); no writes]
let marker = support.ready_marker(Some(projection.projection.value.projection_ref.clone()), source_cursor);
let surface = reads.ready(page.items, page.info, marker)?;
Ok(surface)
}.await;
// [UnitOfWork.rollback(Tx readonly_tx)]
uow.rollback(tx).await?;
match outcome { Ok(surface) => Ok(surface), Err(error) => reads.map_read_error(error) }
```

#### 读取、构造与失败来源

Catalog投影manifest+currentSource visibility；metadataescapedsubstring/pg_trgm，scope过滤先count/token/suggest；旧index非truth。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。


### GetMarketplaceListingFlow

#### 入口与目标

`pub async fn get_marketplace_listing(&self, request: QueryEnvelope<GetMarketplaceListingRequest>) -> Result<ReadSurface<CatalogReadView>, MarketError>`；planned catalog_version/get_marketplace_listing.rs。目标：listing/version/source typedread，noncopiedbody。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API get_marketplace_listing QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble CatalogReadView; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Listing(request.body.listing_ref.clone())], source_candidates, requested_scope).await?;
let body: GetMarketplaceListingRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let outcome = async {
let cursor = uow.current_cursor(&mut tx).await?;
let listing = support.require(store.load_listing(&mut tx, body.listing_ref.clone()).await?)?.value;
let versions = store.page_listed_versions(&mut tx, listing.listing_ref.clone(), PageReadContext { actor: request.actor.clone(), scope: scope.clone(), selector: MarketPageSelector::GetMarketplaceListing }, support.require(request.meta.page.clone())?).await?;
let qualified_visible_summary = None; // owner summary不是detail必填；只在typedqualifiedsnapshot存在且current可见才Some。
let view = CatalogReadView::assemble(CatalogReadInput { listing_ref: listing.listing_ref, version_refs: versions.items.into_iter().map(|v|v.value.version_ref).collect(), safe_metadata: MarketCatalogSafeMetadata { metadata: listing.metadata, source_summary: qualified_visible_summary }, read_context: scope.clone(), status: ReadSurfaceKind::Ready })?;
// [ReadFacade.ready(items, PageInfo, ReadMarker); no writes]
let marker = support.ready_marker(None, cursor);
let surface = reads.ready(vec![view], versions.info, marker)?;
Ok(surface)
}.await;
// [UnitOfWork.rollback(Tx readonly_tx)]
uow.rollback(tx).await?;
match outcome { Ok(surface) => Ok(surface), Err(error) => reads.map_read_error(error) }
```

#### 读取、构造与失败来源

typedlisting+same scope versions/owner qualifiedsummary；不可只首page称完整versionlist，应明确由ListMarketVersions取得full页；Coremeta.page显式控制version_refs当前页，page.info.next_token提示后续，不首page冒全量。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。


### ListMarketVersionsFlow

#### 入口与目标

`pub async fn list_market_versions(&self, request: QueryEnvelope<ListMarketVersionsRequest>) -> Result<ReadSurface<MarketVersionReadItem>, MarketError>`；planned catalog_version/list_market_versions.rs。目标：MarketStore.list_versions / page singlemeta。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API list_market_versions QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble MarketVersionReadItem; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Listing(request.body.listing_ref.clone())], source_candidates, requested_scope).await?;
let body: ListMarketVersionsRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let outcome = async {
let cursor = uow.current_cursor(&mut tx).await?;
let page = store.list_versions(&mut tx, body.listing_ref.clone(), PageReadContext { actor: request.actor.clone(), scope: scope.clone(), selector: MarketPageSelector::ListMarketVersions }, support.require(request.meta.page.clone())?).await?;
let items = page.items.into_iter().map(|v|support.version_item(v.value)).collect();
// [ReadFacade.ready(items, PageInfo, ReadMarker); no writes]
let marker = support.ready_marker(None, cursor);
let surface = reads.ready(items, page.info, marker)?;
Ok(surface)
}.await;
// [UnitOfWork.rollback(Tx readonly_tx)]
uow.rollback(tx).await?;
match outcome { Ok(surface) => Ok(surface), Err(error) => reads.map_read_error(error) }
```

#### 读取、构造与失败来源

same scope MarketVersion fulltypedbody→逐字段safeitem；不选ownerlatest。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。


### SelectMarketVersionFlow

#### 入口与目标

`pub async fn select_market_version(&self, request: QueryEnvelope<SelectMarketVersionRequest>) -> Result<ReadSurface<SelectedVersionView>, MarketError>`；planned catalog_version/select_market_version.rs。目标：typedexactversion + read-only formalcurrent资格；无创建intent。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API select_market_version QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble SelectedVersionView; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![MarketAuditSubjectRef::Version(request.body.version_ref.clone())], source_candidates, requested_scope).await?;
let body: SelectMarketVersionRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let local_read = async {
let cursor = uow.current_cursor(&mut tx).await?;
let version = support.require(store.load_version(&mut tx, body.version_ref.clone()).await?)?.value;
let application = support.require(store.load_application(&mut tx, version.application_ref.clone()).await?)?.value;
let basis = support.require(store.load_basis(&mut tx, support.require(application.basis_ref)?).await?)?;
let publisher = support.require(store.load_publisher(&mut tx, basis.publisher_ref.clone()).await?)?.value;
Ok((cursor, version, basis, publisher))
}.await;
uow.rollback(tx).await?;
let (cursor, version, basis, publisher) = match local_read { Ok(v) => v, Err(error) => return reads.map_read_error(error) };
let fixed_basis = basis.clone();
let qualification = gates.admission(version.clone(), basis, publisher, scope.clone()).await;
let (gate_allows, formal_gate_basis, current_gap) = match qualification {
    Ok(q) => { let gate = VersionAdmissionPolicy::new(q.requirements)?.evaluate(version.clone(), fixed_basis.clone(), q.decision_binding, q.current)?; (version.state == MarketVersionState::Listed && gate.allowed, gate.basis_refs, gate.failure) },
    Err(error) => (false, vec![], Some(SafeFailureRef { code: error.code, reason_ref: error.reason_ref })),
};

let value = SelectedVersionView { version: support.version_item(version), eligible: gate_allows, basis_refs: formal_gate_basis, failure_ref: current_gap };
// [ReadFacade.ready(items, PageInfo, ReadMarker); no writes]
let marker = support.ready_marker(None, cursor);
let surface = reads.ready(vec![value], reads.detail_info(cursor), marker)?;
// Readonly transaction was already closed before owner reads.
Ok(surface)
```

#### 读取、构造与失败来源

exactlocalversion+formalcurrentSource/publisher/material/Govread；gate_allows仅formalmatchingcurrentapproved+Listed，缺口eligiblefalse或typeddegraded不newintent。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。


### ListMarketCategoriesFlow

#### 入口与目标

`pub async fn list_market_categories(&self, request: QueryEnvelope<ListMarketCategoriesRequest>) -> Result<ReadSurface<CategoryReadItem>, MarketError>`；planned catalog_version/list_market_categories.rs。目标：MarketStore.list_categories / scope/parent current。只允许Step6方法、Step7 typedports/[application callables](03_ddd_step_07_application_callables.md)，不能调用未定义业务builder。

#### 函数级ASCII调用图

```text
[API list_market_categories QueryEnvelope]
  | call ReadFacade.authorize -> formal current scope/disclosure
  v
[ReadOnly Tx -> exact typed source pair / readonly formalowner read]
  | assemble CategoryReadItem; never save/reserve/dispatch/refresh
  v
[Ready / Empty / NotVisible / Missing / Degraded]
```

#### Rust风格伪代码

```rust
let source_candidates: Vec<SourceVerificationTarget> = vec![];
let requested_scope: Option<MarketScopeRef> = None;
// [ReadFacade.authorize(QueryEnvelope, typed subjects, source candidates, requested_scope)]
let scope = reads.authorize(&request, vec![], source_candidates, requested_scope).await?;
let body: ListMarketCategoriesRequest = request.body.clone();
// [UnitOfWork.begin(UowMode::ReadOnly)]
let mut tx = uow.begin(UowMode::ReadOnly).await?;
let outcome = async {
let cursor = uow.current_cursor(&mut tx).await?;
let page = store.list_categories(&mut tx, body.filter.clone(), PageReadContext { actor: request.actor.clone(), scope: scope.clone(), selector: MarketPageSelector::ListMarketCategories }, support.require(request.meta.page.clone())?).await?;
let items = page.items.into_iter().map(|v|CategoryReadItem { category_ref: v.value.category_ref, label: v.value.label, parent_ref: v.value.parent_ref, revision: v.revision }).collect();
// [ReadFacade.ready(items, PageInfo, ReadMarker); no writes]
let marker = support.ready_marker(None, cursor);
let surface = reads.ready(items, page.info, marker)?;
Ok(surface)
}.await;
// [UnitOfWork.rollback(Tx readonly_tx)]
uow.rollback(tx).await?;
match outcome { Ok(surface) => Ok(surface), Err(error) => reads.map_read_error(error) }
```

#### 读取、构造与失败来源

typedtaxonomy sameformal scope，parent scope核验，无隐藏listingcount。所有free symbol是明确typedsource映射而不是builder占位：source_candidates/requested_scope按本Request字段或empty/None；state与readmodel字段逐原值copy；qualified_visible_summary只QualifiedSnapshotMaterial::Source且当前可见，缺可选摘要None不证明合格；typed_notice_read_items/attempt_snapshots按已声明纯函数逐字段copy；formal_saved_observation_binding从AuditStore.get_observation_binding读取；current_gap来自formal错误safe code，不生成owner扫描/支付结果。

ownerqualification分支gate_allows/formal_gate_basis/current_gap从当前正式结果及纯policyevaluate确定，Listed与未撤回/currentapproved/receiver必需。body.field缺失reject；scope不可证明NotVisible（不带ref/count/cursor）；typedsourceMissing只authorizedMissing；Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled走Degraded，no-query-write/no-cache-refresh。每个earlyreturn/error位于显式async Result作用域，退出后readonly rollback一次；formalprecheck先关闭本地读取事务再调用owner，不二次consume handle。

#### Tx与副作用 / 测试

localWrite/ID/Clock/operationreserve/audit/work/ownerwrite/event均0；只有当前formalread与typedReadonly访问。列表/详情/版本/数量/分页同currentvisibility交集，下一token只当前可见item的boundedCorepage；historychunk不冒称全量。测试：visible/empty/NotVisible/authorizedmissing、错误不echo、wrongscope/filtertoken、state/bodypair缺失、stale/rebuilding/unsupported、locale不改refs/key、Query全部writer计数0。单flow停审：typedDTO/source/model/marker与no-write边界已列，外部资格blocked不变。
