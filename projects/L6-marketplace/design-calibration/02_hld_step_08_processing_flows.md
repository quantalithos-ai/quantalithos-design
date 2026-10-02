# 02 Step 8：关键处理流 / 重要函数数据流

## 1. Step状态

开工：用户已确认01并授权全部02；Step 8 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：U1→U2→U3→U4→U5→U6→U7逐部分小循环，前一部分pass才允许下一部分。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_07_api_interface_skeleton.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 每个关键 Command 的写路径如何从入口进入 application service、domain object、repository / outbox？

答：入口当前actor/scope→canonical operation与幂等→typed读取/正式precheck→domain→本地UoW重查revision与guard→变化/audit/result/必要work同commit；外部owner调用不在SQL事务内。

2. 每个关键 Query 如何从入口读取 projection 或只读视图？

答：resolver-first当前scope，typed合法read来源与freshness裁剪→view；count/suggest/分页同scope。未知scope不读敏感数据。

3. 每个关键 Inbound Event 如何解析、幂等、转成本地索引或本地记录？

答：当前0activeconsumer，不画假payload处理流；未来必须独立envelope/schema/authority/dedup并只能写qualifiedshadow/受控local记录，重开Step7。

4. 每个关键 Operations Job 如何基于已持久化事实做发布、重建或对账？

答：持久claim/fence与dispatch许可→原intent外部调用或probe→matching result本地事务→完整report/audit/result/work；projection安全影子替换。

5. 处理流中点名的关键函数调用，其参数分别是什么类型？

答：每命令沿Step7 typed骨架调Step6 domain方法；lookup/save/get typed实参03完整展开，本步不写完整Rust返回签名。

6. 哪些处理步骤必须在概要设计点名，哪些完整函数调用链应留给详细设计？

答：必须点名duplicate完整原结果、同版本撤回竞争、intent-before-effect、unknown probe/无probe等待；完整内部调用链留03。

7. 哪些 P0 Command、改写本地状态的 Inbound Event、影响一致性的 Operations Job 必须画独立处理流？

答：实际清单全部21个P0command与12个reliability/maintenancejob独立diagram，不使用一张总pipeline代替。

8. 哪些 Query 可以只走通用读路径，哪些 Query 必须画独立处理流？

答：当前所有query都有scope/安全结果或freshness分支，全部分别画独立diagram，通用read只作不变量说明。

9. 每个处理流属于哪个主要组成部分,承接哪个接口,使用哪些关键对象？

答：每flow标题是Step7exact API，按所属U写附录，作用对象在Step6，跨U接缝只typed共享材料/同local边界。

10. 是否存在接口没有处理流口径、处理流点名对象未定义、处理流跨组成部分但接缝未说明？

答：逐接口coverage，jobrecordoutcome复用受控命令相同domain，不能复制规则；直接写外部truth/outbox不存在。

11. 每个主要组成部分的处理流完成后是否通过停审？

答：七U flow先思考后独立图与notes，再回填/coverage停审；跨部分检查关键gate/结果与lateimpact。

## 4. 当前文档问题诊断

Step7接口表不能表达两段短local事务与外部调用顺序；若持数据库锁跨owner等待或先外部效果后意图，会破坏01ADR005。duplicate不能重新查source资格后重跑domain；但当前读取/重放授权仍必须成立。Step7counts用实际清单核对，答案中的口述数量待结构化纠正。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 流程 | 接口摘要 | 49独立图及三notes、coverage与副作用inventory | 非总pipeline替代 |
| 幂等 | sameintent原结果 | 当前披露授权后typed原结果，业务precheck在新intent路径 | 防重复重跑 |
| 外部效果 | 耐久责任 | claim/许可短事务、external outside、matching结果短事务 | 不跨owner事务 |
| 撤回 | 同version序列化 | 受理与派发许可的明确边界、late增量 | 不承诺瞬时全球取消 |

## 6. 设计取舍

采用原意图短事务claim/许可、外部调用、短事务结果保存；重复同意图当前披露授权后重放原完整结果，不重新domain。选择所有query独立画图，拒绝通用总flow掩盖scope/cursor/fallback差异。

## 7. 结构化中间产物

### 共同事务、幂等和读取边界

当前49个接口：21 Commands、16 Queries、12 worker-internal Jobs，全部独立处理流。数量以§7实际清单为准，不采用旧数量口述。

新command先当前actor/scope与typed意图，再短事务预占OperationRecord；同operation/scope/key/指纹Duplicate经当前披露授权typed get_result返回原完整public面，不重查资产资格后重跑domain。不同指纹Conflict；Reserved竞争Busy/待核对。新意图外部precheck在SQL事务外；最终短UoW再次读取revision、局部guard和versionserialization，原子保存accepted变化+safeaudit+完整原result+必要durablework。前置否决无domain accepted，安全拒绝结果可独立保存但不假造业务audit成功。

外部current资格只在正式合同的有效范围内可证明；owner不提供可消费有效性依据时positive blocked。本地锁不保证跨owner全局瞬时撤销。最终local commit未知按OperationRecord/result typed读取核对，不发第二意图。

Worker先短事务claim/fence；若原attempt/notice/审计交接已持久派发许可或旧claim可能外发，崩溃恢复进入原intent probe/unknown，而非claim过期自动重新send。派发前当前gate与版本处置同local序列化边界；已许可在撤回之前的交接属于可能外发影响集合，后续确认/unknown保持独立。结果保存拒绝旧fence覆盖；sameintent正式迟到结果仍通过匹配记录流安全收敛并增量影响。

Query全部resolver-first当前权限/披露→typed本地read/必要formal只读owner查询→可见交集与freshness→安全view，不reserve/appendaudit/refreshsnapshot/写业务或job。详细“没有 vs 不可见”只在允许的安全诊断scope内区分，对未授权主体统一安全不可用，count/suggest/history不泄漏存在性。

### 接口到独立图覆盖

| 接口 | 是否画独立处理流 | 原因 |
|---|---|---|
| BindPublisherRelation | 是 | P0领域写入/局部原子与重放；U1 |
| ReleasePublisherRelation | 是 | P0领域写入/局部原子与重放；U1 |
| VerifyPublicationSource | 是 | P0领域写入/局部原子与重放；U1 |
| GetSourceQualification | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U1 |
| CreatePublicationDraft | 是 | P0领域写入/局部原子与重放；U2 |
| RevisePublicationDraft | 是 | P0领域写入/局部原子与重放；U2 |
| SubmitPublicationApplication | 是 | P0领域写入/局部原子与重放；U2 |
| TerminatePublicationApplication | 是 | P0领域写入/局部原子与重放；U2 |
| RecordGovernanceDecision | 是 | P0领域写入/局部原子与重放；U2 |
| GetPublicationProgress | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U2 |
| DispatchReviewHandoff | 是 | 一致性/原意图副作用或派生维护；U2 |
| ReconcileReviewHandoff | 是 | 一致性/原意图副作用或派生维护；U2 |
| CreateMarketplaceListing | 是 | P0领域写入/局部原子与重放；U3 |
| EditMarketplaceListing | 是 | P0领域写入/局部原子与重放；U3 |
| MaintainMarketCategory | 是 | P0领域写入/局部原子与重放；U3 |
| RegisterMarketVersion | 是 | P0领域写入/局部原子与重放；U3 |
| ListMarketVersion | 是 | P0领域写入/局部原子与重放；U3 |
| SearchMarketplaceCatalog | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U3 |
| GetMarketplaceListing | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U3 |
| ListMarketVersions | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U3 |
| SelectMarketVersion | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U3 |
| ListMarketCategories | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U3 |
| RequestDistribution | 是 | P0领域写入/局部原子与重放；U4 |
| CancelDistribution | 是 | P0领域写入/局部原子与重放；U4 |
| RecordReceiverOutcome | 是 | P0领域写入/局部原子与重放；U4 |
| GetAcquisitionEligibility | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U4 |
| GetDistributionProgress | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U4 |
| DispatchDistribution | 是 | 一致性/原意图副作用或派生维护；U4 |
| ReconcileDistribution | 是 | 一致性/原意图副作用或派生维护；U4 |
| RestrictMarketVersion | 是 | P0领域写入/局部原子与重放；U5 |
| WithdrawMarketVersion | 是 | P0领域写入/局部原子与重放；U5 |
| PlanImpactNotifications | 是 | P0领域写入/局部原子与重放；U5 |
| RecordNoticeOutcome | 是 | P0领域写入/局部原子与重放；U5 |
| GetWithdrawalImpact | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U5 |
| GetNoticeProgress | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U5 |
| EnumerateKnownImpact | 是 | 一致性/原意图副作用或派生维护；U5 |
| DispatchNotice | 是 | 一致性/原意图副作用或派生维护；U5 |
| ReconcileNotice | 是 | 一致性/原意图副作用或派生维护；U5 |
| RequestMarketRecovery | 是 | P0领域写入/局部原子与重放；U6 |
| GetMarketAudit | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U6 |
| GetRecoveryProgress | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U6 |
| GetOperationResult | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U6 |
| RunMarketRecovery | 是 | 一致性/原意图副作用或派生维护；U6 |
| DispatchObservation | 是 | 一致性/原意图副作用或派生维护；U6 |
| ReconcileObservation | 是 | 一致性/原意图副作用或派生维护；U6 |
| GetReferenceFreshness | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U7 |
| GetProjectionFreshness | 是 | 当前scope/安全结果或freshness分支，不以通用read代替；U7 |
| RefreshQualifiedReferences | 是 | 一致性/原意图副作用或派生维护；U7 |
| RebuildMarketReadProjection | 是 | 一致性/原意图副作用或派生维护；U7 |

#### BindPublisherRelation 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Formal publisher / organization / scope authority? ]
        |
        v
[ Missing -> blocked; qualified -> local Bound only ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：正式publisher/组织authority解析；SourceGatePolicy当前scope核验；PublisherRelation.bind(QualifiedPublisherInput input)。
- 归属/保存：U1；PublisherRelation + audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：非Identity登录/verified写入；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ReleasePublisherRelation 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Current authority + local relation revision? ]
        |
        v
[ Release + invalidate dependent qualifications; append history ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：typed读取relation+revision；正式解除authority核验；PublisherRelation.release(AuthorityDispositionInput input)；关联核验置Invalidated。
- 归属/保存：U1；PublisherRelation + source资格失效责任。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：解除不能删历史或改主体truth；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### VerifyPublicationSource 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Owner type / ref / version / digest / visibility + materials? ]
        |
        v
[ Missing or mismatch -> Blocked; formal match -> Qualified ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：SourceOwnerPort/MaterialAuthorityPort正式qualified读取；SourceGatePolicy.evaluate(SourceBinding source, PublisherRelation publisher, MaterialReferenceSet materials, CurrentAuthorityInput authority)；SourceVerification.start(SourceVerificationInput input)；record(QualificationOutcomeInput outcome)。
- 归属/保存：U1；SourceVerification + 固定SourceBinding/MaterialReference + audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：缺contract记录Blocked，拒绝假digest/签名；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetSourceQualification 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetSourceQualification read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：读取scope裁剪资格/材料缺口。
- 归属/保存：U1；SourceVerification + typed qualified snapshot。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：不refresh/自证有效；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### CreatePublicationDraft 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Publisher editing authority + body-free draft input ]
        |
        v
[ Create Draft, no review dispatch / market listing ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：publisher当前编辑授权；PublicationApplication.draft(DraftPublicationInput input)。
- 归属/保存：U2；PublicationApplication + 安全draft_spec候选。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：材料引用存在不自动Submitted；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RevisePublicationDraft 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Application is Draft? ]
        |
        v
[ No -> reject immutable submitted basis; yes -> new safe draft specification ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：读取application+revision，检查Draft；PublicationApplication.revise(DraftPublicationInput input)。
- 归属/保存：U2；Draft + 新安全draft_spec（尚非qualifiedbasis）。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：Submitted不原地换输入；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### SubmitPublicationApplication 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Current source / publisher / material gate? ]
        |
        v
[ Fixed PublicationBasis + Submitted + pending review in one UoW ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：重新核验U1当前来源责任材料；PublicationBasis.freeze(QualifiedPublicationInput input)；PublicationApplication.submit(QualifiedPublicationInput input)；ReviewHandoff.prepare(SubmittedApplicationInput input)。
- 归属/保存：U2；固定PublicationBasis + Submitted application + ReviewHandoff + work。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：缺publisher/material/source合同不提交；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### TerminatePublicationApplication 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Original review not yet sent / sent / commit-unknown? ]
        |
        v
[ Terminate local application; keep sent-unknown reconciliation ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：正式终止权限，读取当前review上下文；PublicationApplication.terminate(ApplicationTerminationInput input)。
- 归属/保存：U2；Terminated申请 + 原交接状态保留。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：已外发/unknown不假造外部取消；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RecordGovernanceDecision 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Formal exact application / basis / scope outcome? ]
        |
        v
[ Mismatch -> reject; match -> bind decision, never auto-list ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：GovernancePort取得正式决定与完整适用binding；ReviewBindingPolicy.evaluate(PublicationBasis basis, GovernanceDecisionBinding decision, CurrentDecisionInput current)；ReviewHandoff.record_decision(GovernanceDecisionBinding binding)。
- 归属/保存：U2；GovernanceDecisionBinding + ReviewHandoff + audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不把ACK/waived当approved，不自动上架；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetPublicationProgress 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetPublicationProgress read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：读取分轴进度与缺口。
- 归属/保存：U2；application/basis/review/decision safe refs。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：只读，不触发Govpoll/提交；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### DispatchReviewHandoff 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Typed original review + fixed basis + current application status ]
        |
        v
[ Prepared -> persist dispatch context -> formal Gov intake ]
        |
        v
[ Accepted -> WaitingDecision; timeout -> CommitUnknown; no contract -> blocked ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：claim持久责任/fence，重核验未终止及固定basis；正式Gov接收原handoff意图；ReviewHandoff.record_dispatch(ReviewDispatchOutcomeInput outcome)。
- 归属/保存：U2；review/work局部进度。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：timeout CommitUnknown，原intent不重建；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ReconcileReviewHandoff 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Original review intent -> formal probe / decision read ]
        |
        v
[ Matched outcome -> local record; no probe -> wait formal manual basis ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：按原handoff formalprobe/query，不重新提交；接收结果与决定分轴；qualified决定调用RecordGovernanceDecision同domain；unknown无probe保留人工依据/ContractBlocked。
- 归属/保存：U2；matched决定/局部交接进度/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：恢复不自造批准，不从querysummary推出outcome；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### CreateMarketplaceListing 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Publisher scope + market metadata only ]
        |
        v
[ Create listing shell; no market version automatically Listed ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：publisher/scope编辑授权；MarketplaceListing.create(ListingCreationInput input)。
- 归属/保存：U3；MarketplaceListing + audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：目录壳无可获取版本；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### EditMarketplaceListing 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Typed listing + category refs + current revision ]
        |
        v
[ Edit market metadata; keep immutable source / review bindings ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：typed读取listing与分类，核验scope；MarketplaceListing.edit(ListingMetadataInput input)。
- 归属/保存：U3；市场metadata/categoryrefs revision。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不能改变源绑定/审查材料；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### MaintainMarketCategory 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Explicit Create or Change? ]
        |
        v
[ Create -> new typed ID; Change -> existing revision; reject cycles ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：正式taxonomy维护权限，Create不复用已有ID，Change必须typed读取revision；Category.create(CategoryCreationInput input)或change(CategoryChangeInput input)。
- 归属/保存：U3；Category + audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不把市场分类当ownerenum；防父子循环；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RegisterMarketVersion 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Listing + application basis + exact owner version match? ]
        |
        v
[ Stage market version; no mutable selector / latest fallback ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：核验listing/申请固定basis/sourcebinding相同；MarketVersion.stage(MarketVersionCreationInput input)。
- 归属/保存：U3；Staged MarketVersion + audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不能静默换owner版本或直接Listed；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ListMarketVersion 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Formal current approved + exact binding + current source gate? ]
        |
        v
[ Version serialization: Staged / Restricted only; Withdrawn rejects ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：当前source/publisher/material/Govapproved全binding核验；同版本序列化，拒绝Withdrawn或stale revision；MarketVersion.list(VersionAdmissionInput input)。
- 归属/保存：U3；Listed版本 + immutabledecision关联 + audit/result/派生责任。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：Restricted恢复需新正式依据，Withdrawn重发需新version；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### SearchMarketplaceCatalog 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed SearchMarketplaceCatalog read source and freshness inspection ]
        |
        v
[ Authorized rows FIRST -> page / facets / total / suggestions ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：resolver-first；关键词/类型/分类/标签范围索引检索；先可见裁剪再count/suggest/page。
- 归属/保存：U3；U7 Catalog投影 + current scope/visibility。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：索引不足degraded，不泄漏隐藏数量；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetMarketplaceListing 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetMarketplaceListing read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：resolver-first详情裁剪。
- 归属/保存：U3；listing/marketversions+owner safe切片。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：禁止body/虚构评分预览；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ListMarketVersions 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed ListMarketVersions read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：scope安全history/versions分页。
- 归属/保存：U3；typed版本列表+safe binding。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：不把ownerlatest改市场绑定；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### SelectMarketVersion 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed SelectMarketVersion read source and freshness inspection ]
        |
        v
[ Exact version only: not available -> safe rejection, NO latest fallback ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：指定exact版本并检查当前可见/资格；不可用返回明确结果，不选latest。
- 归属/保存：U3；exact MarketVersion + current来源/决定读取。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：仅只读选择资格，不受理获取；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ListMarketCategories 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed ListMarketCategories read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：分类和计数同scope裁剪。
- 归属/保存：U3；Category+scope安全关联。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：不返隐藏listing总数；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RequestDistribution 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Exact version + consumer / receiver + current source / authority / approval? ]
        |
        v
[ Version serialization: reject restricted / withdrawn; accept one intent ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：resolver当前source/auth/Gov/receiver资格与exact版本；同版本序列化，AcquisitionGatePolicy.evaluate(MarketVersion version, CurrentQualificationInput current, AcquisitionTargetInput target)；DistributionIntent.accept(QualifiedAcquisitionInput input)；DistributionRelation.for_intent(AcceptedDistributionInput input)；DistributionAttempt.prepare(DistributionDispatchInput input)。
- 归属/保存：U4；DistributionIntent + Relation + PreparedAttempt + work/audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：withdrawal后不新accepted，free同gate；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### CancelDistribution 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Prepared vs Dispatching / Unknown / Confirmed attempt? ]
        |
        v
[ Cancel local intent; keep external result and unknown reconciliation ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：consumer当前授权+typed意图/attempt/fence；DistributionIntent.cancel(DistributionCancelInput input)。
- 归属/保存：U4；Cancelled intent + 原attempt/未知责任保留。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不伪造receiver rollback，既有结果对账；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RecordReceiverOutcome 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Original intent / version / consumer / receiver / scope match? ]
        |
        v
[ Save formal outcome; withdrawn version -> durable late-impact delta ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：receiver正式来源与intent/version/consumer/receiver/scope全binding；DistributionAttempt.settle(ReceiverOutcomeInput input)；DistributionRelation.attach(ReceiverOutcomeBinding binding)；若已撤回/限制，则增量knownimpact和notice待交接责任。
- 归属/保存：U4；attempt formalmapped result + relation outcome + 迟到影响责任。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：ACK非commit/installed/paid；错binding拒绝；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetAcquisitionEligibility 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetAcquisitionEligibility read source and freshness inspection ]
        |
        v
[ Current qualified owner / authority / Gov read: unknown is NOT eligible ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：当前read权限与qualification分轴；不可证明来源则blocked/unknown，不消费过期entitlement。
- 归属/保存：U4；当前正式资格+exact市场版本。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：不创建intent、免费不豁免、不造财务；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetDistributionProgress 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetDistributionProgress read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：scope内local与external分轴读取。
- 归属/保存：U4；intent/relation/attempt/receiverbinding。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：旧成功不绕权限，不探测/重试；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### DispatchDistribution 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Prepared original attempt + current acquisition gate ]
        |
        v
[ Version serialization: permission before effect; stale / withdrawn -> Blocked ]
        |
        v
[ Original receiver dispatch -> matching result / Failed / CommitUnknown ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：持久claim/fence；未派发同version边界再查nonwithdrawn与当前gate；DistributionAttempt.begin(CurrentDispatchGateInput input)；许可先持久；ReceiverPort按原intent/exactref交接；qualified结果经RecordReceiverOutcome同规则，timeoutunknown。
- 归属/保存：U4；attempt/work结果及安全item refs。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：已许可后外部瞬时撤销不保证；unknown不能盲发；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ReconcileDistribution 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Dispatching / CommitUnknown original attempt -> receiver probe ]
        |
        v
[ Matching commit -> record; unknown -> wait ]
        |
        v
[ Known-not-committed + current gate -> safe new attempt for SAME intent ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：ReceiverPort按原intent/probe检查binding；matching结果走RecordReceiverOutcome同domain；known-not-committed且当前gate成立才允许原intent安全新attempt；无probe等待正式人工依据。
- 归属/保存：U4；原attempt结果/knownimpact增量/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不猜installed，不由intentCancelled覆盖formal结果；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RestrictMarketVersion 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Formal disposition / current qualification gap basis? ]
        |
        v
[ Version serialization: restrict + local audit + impact work atomically ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：正式失效/未知资格或处置authority，不假造外部撤销；同version serialization，WithdrawalDisposition.record(QualifiedDispositionInput input)；MarketVersion.restrict(VersionRestrictionInput input)；ImpactRecord.start(ImpactEnumerationInput input)。
- 归属/保存：U5；WithdrawalDisposition + Restricted MarketVersion + PartialImpact + work/audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：通知/审计外部失败不恢复获取；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### WithdrawMarketVersion 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Formal withdrawal authority? ]
        |
        v
[ Version serialization: stop new admission + withdraw + impact work ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：正式撤回authority/处置理由；同version serialization，与U4受理/许可竞争；MarketVersion.withdraw(VersionWithdrawalInput input)；ImpactRecord.start(ImpactEnumerationInput input)。
- 归属/保存：U5；WithdrawalDisposition + Withdrawn MarketVersion + PartialImpact + work/audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：Withdrawn终态不回Listed；新发新version/newreview；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### PlanImpactNotifications 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Known / unknown impact + qualified target / channel? ]
        |
        v
[ Missing contract -> gap; valid plan -> deduplicated original notices ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：scope内knownrelation/unknown candidates固定关联；正式channel/target授权具备才生成可派发计划；NoticeIntent.prepare(QualifiedNoticePlanInput input)。
- 归属/保存：U5；去重NoticeIntent + work/audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：缺channel保留gap/blocked，不自造地址；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RecordNoticeOutcome 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Original notice / target / channel / scope match? ]
        |
        v
[ Save formal outcome; ACK is not delivery ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：正式通道来源，notice/target/channel/scope匹配；NoticeIntent.settle(NoticeOutcomeInput input)。
- 归属/保存：U5；NoticeOutcomeBinding + notice state/audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：ACK不送达/已读/已处置；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetWithdrawalImpact 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetWithdrawalImpact read source and freshness inspection ]
        |
        v
[ Known cursor coverage and unknown / late items stay separate ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：scope内knowncoverage与unknown/late分轴读取。
- 归属/保存：U5；disposition/impact+knownrelations。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：不声称全安装受影响集合；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetNoticeProgress 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetNoticeProgress read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：通道formal结果按scope裁剪。
- 归属/保存：U5；notice/outcomebinding/audit历史。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：读取不发通知；Confirmed不硬翻译Delivered；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### EnumerateKnownImpact 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Fixed disposition cursor -> typed known relations / unknown attempts ]
        |
        v
[ Append deduplicated delta; missing cursor -> Partial ]
        |
        v
[ Cursor complete -> KnownScopeComplete; late results keep incremental work ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：typed版本关系按稳定cursor读取，未知attempt保守候选；ImpactRecord.include(ImpactDeltaInput delta)；missing cursor保留Partial；late关系以新delta去重；仅声明cursor内KnownScopeComplete。
- 归属/保存：U5；ImpactRecord增量/coverage及notice planning责任。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不扫描外部全安装集合；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### DispatchNotice 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Persisted original notice + qualified target / channel ]
        |
        v
[ Persist permission -> original notice dispatch ]
        |
        v
[ Formal outcome vs ACK vs commit-unknown stay distinct ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：原意图claim/fence，当前channel/target权限；NoticeIntent.begin(NoticeDispatchInput input)后持久许可；NoticeChannelPort交接，formalmatching结果走RecordNoticeOutcome同规则，timeoutunknown。
- 归属/保存：U5；notice/work结果。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不以外部失败回滚撤回；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ReconcileNotice 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Original notice -> formal channel probe ]
        |
        v
[ Formal match -> record; known-not-committed -> same-intent safe retry ]
        |
        v
[ No probe / unresolved -> wait, never revive withdrawn version ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：原notice/channel formalprobe；匹配结果走RecordNoticeOutcome；known-not-committed才原意图安全重试；无probe保持CommitUnknown/Blocked等待人工依据。
- 归属/保存：U5；原notice outcome/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不得造通知成功/新意图盲发；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RequestMarketRecovery 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Current operator authority + finite typed original target? ]
        |
        v
[ Request local recovery; no owner truth / arbitrary SQL target ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：正式operator/system actor scope与恢复authority；RecoveryIntent.request(RecoveryRequestInput input)。
- 归属/保存：U6；Requested RecoveryIntent + durable work/audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不接收任意SQL/ownerref写目标；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetMarketAudit 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetMarketAudit read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：typed subject resolver-first，裁剪actor/basis/reason。
- 归属/保存：U6；append-only local audit+observation binding。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：rawlog/evidence禁止，不声明Obs已接纳；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetRecoveryProgress 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetRecoveryProgress read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：scope内逐item及blocked/unknown读取。
- 归属/保存：U6；recovery/work/stored report。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：不运行恢复、不ready推断；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetOperationResult 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetOperationResult read source and freshness inspection ]
        |
        v
[ Original typed result: missing / wrong kind -> integrity gap, NO reconstruction ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：当前读取authority与resultkind匹配；missing/错kind为完整性缺口，不现查truth重建。
- 归属/保存：U6；OperationRecord→StoredOperationResult typed完整原面。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：只读，不重新domain transition；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RunMarketRecovery 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Typed target inspection + current recovery authority ]
        |
        v
[ External unknown -> owning reconciliation; projection -> qualified rebuild ]
        |
        v
[ Store full per-item report; no basis / probe -> Blocked ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：authority/typed目标当前核验；RecoveryIntent.begin(QualifiedRecoveryInput input)；effectunknown调用所属Reconcile job；qualified派生调用U7rebuild；RecoveryIntent.record(RecoveryOutcomeInput input)；Blocked无probe/manualbasis。
- 归属/保存：U6；recovery state+typed逐项原report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不改外部truth/历史、不复活Withdrawn；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### DispatchObservation 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Fixed local audit set + formal producer admission / redaction / scope ]
        |
        v
[ Persist original intent -> qualified Obs handoff ]
        |
        v
[ Official outcome vs ACK / commit-unknown, local audit unchanged ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：正式produceradmission/安全材料/固定audit集+scope核验；intent-before-effect；ObservationPort原intent交接；formalreceipt与ACK分轴，unknown原intent对账。
- 归属/保存：U6；ObservationOutcomeBinding/local work/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：Archive没有activeexport/restore；no rawbody；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ReconcileObservation 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Original audit handoff -> formal probe / fixed material binding ]
        |
        v
[ Matching receipt -> reference; no probe -> blocked-unknown ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：formalproducer/原intent probe和固定audit set读取；matchingresult才保存ObservationOutcomeBinding；无probe保持unknown/Blocked。
- 归属/保存：U6；原external audit结果/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：local audit不等externaladmitted，不盲重发；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetReferenceFreshness 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetReferenceFreshness read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：formalreadscope再typed切片读取，missing/degraded分支。
- 归属/保存：U7；typed qualified snapshot/state/validity。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：state不能代替snapshot本体，不refresh；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetProjectionFreshness 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetProjectionFreshness read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：typedprojection identity与current披露检查。
- 归属/保存：U7；scope-bound ReadProjection/cursor/state。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：Fresh不代表业务ready；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RefreshQualifiedReferences 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Finite typed source / kind / consumer / scope plan ]
        |
        v
[ Formal READ resolver -> state + optional typed safe material ]
        |
        v
[ Qualified -> replace shadow; failure -> Stale or Unavailable, never truth repair ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：formalresolver逐source类型核验，不用ID推schema；QualifiedReferenceSnapshot.refresh(QualifiedSnapshotInput input)，失败保留旧合法切片+Stale或Unavailable；输出state+typed切片+逐itemgaprefs。
- 归属/保存：U7；qualifiedsnapshot shadow/state+audit/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不得自动解除Restricted或改申请/源truth；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RebuildMarketReadProjection 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Typed kind / scope / view identities + nonempty plan + fixed source cursor ]
        |
        v
[ Committed local facts + qualified owner snapshots -> safe new shadow ]
        |
        v
[ Missing input -> Unavailable; complete shadow -> atomic replace, not old-index repair ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：typed plan绑定projectionkind/scope与非空正式来源、固定cursor；ReadProjection.begin_rebuild(ProjectionRebuildPlanInput input)；从committedfacts+qualifiedsnapshots构造typedviews；ReadProjection.publish(ProjectionBuildOutcomeInput input)，缺材料Unavailable。
- 归属/保存：U7；ReadProjection安全shadow及state/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不从旧projection自建truth、不触发ownerwrite；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。


### accepted副作用责任inventory

| flow族 | 局部变化/结果 | 同UoW必要责任 | 明确不产生 |
|---|---|---|---|
| U1责任/核验 | 本地relation/verification与固定safe basis | audit+完整result，资格失效/读取维护责任按影响存在时schedule | 主体verified、签名/扫描资产truth |
| U2提交/终止/决定 | 固定basis/application/review关联 | submit的reviewwork；其他变化完整result/audit与相应进度派生责任 | approval、自动上架或外部取消 |
| U3目录/version | 市场metadata/taxonomy/处置 | audit/result、范围绑定projection维护责任 | ownerversion、Registry/assetbody |
| U4受理/结果 | intent/relation/attempt/formaloutcomeref | 受理dispatchwork；迟到结果impactdelta责任；audit/result | installed/paid |
| U5限制/撤回/通知 | version处置/disposition/impact/notice | 处置impactwork；通知dispatchwork；audit/result/派生责任 | 全球撤销、全安装集、送达/卸载 |
| U6恢复/审计交接 | recovery/report与正式receiptref | recoverywork；符合producer合同才audit交接责任；完整逐itemresult | Archive包/证据/外部success |
| U7refresh/rebuild | qualifiedsnapshot/shadow维护 | 安全maintenanceaudit、完整逐itemreport与必要projection责任 | 核心业务修改、无schemaoutbox |

不是每个变化都产生全部副作用；实际inventory由03逐flow核定，但表中已要求的audit/result/工作不能被配置关闭。未知外部结果保存局部unknown及对账责任；没有canonical事件合同所以当前没有eventoutbox写入。

复杂度：七部分实际独立flow附录02_hld_step_08_part_u1～u7均完成；49/49接口coverage、对象/guard/保存来源与crossU接缝反查无孤儿。

## 8. 回填草稿

正式§8仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。实际数量21/16/12；全部独立图，0event；全部用Step6/7既有名称，不新增状态。 外部资格不关闭，允许进入Step 9。
