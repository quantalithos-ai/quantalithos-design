# 03 Step 10：定义状态机与转换矩阵

## 1. Step状态

2026-10-01；full-restart / single-agent；用户授权Step5～10。completed / selfcheck_done / stop_review，正式03仍historical_material。

### Step内计划

| 单元 | 状态 |
|---|---|
| P1读取输入 | done |
| P2问题回答 | done |
| P3诊断 | done |
| P4取舍 | done |
| P5逐单元结构化 | done |
| P6复杂度与跨单元审计 | done |
| P7候选草稿 | done |
| P8自检与停审 | done |

## 2. 本步输入

当前00/01/02，前序Step的问题、诊断、取舍及未闭合资格；详细设计SOP Step10、书写规范对应章节、通则/中间产物/闭环标准；Governance对应Step适用契约组织。不继承其业务truth或运行证据。

## 3. SOP问题回答

1. Step 6 / Step 9 中哪些对象、marker、helper 或 entry result 是候选状态主语？

答：候选来自43对象、runtime/helper、protocol/view/report与adapter返回；以独立持久生命周期+Step6 enum+Step9推进为筛选条件。

2. 哪些候选对象应排除在 Step 10 状态矩阵外,因为它们只是 ref、value object、DTO wrapper、外部 truth、cache / lock / retry counter 或无独立生命周期的 marker？

答：排除immutable refs/bindings/basis/audit/results/DTO/checkpoint/manifest、SQL锁/leasecounter、UI async状态，以及外部Governance/Identity/资产/receivertruth。ReadSurface等只有限分类，不造生命周期。

3. 当前仓有哪些正式状态机？

答：14个：PublisherRelation、SourceVerification、PublicationApplication、ReviewHandoff、MarketVersion、DistributionIntent、DistributionAttempt、ImpactRecord、NoticeIntent、OperationRecord、DeferredWork、RecoveryIntent、QualifiedReferenceSnapshot、ReadProjection。

4. 每个状态机属于 business truth、source/reference、read/visibility、projection/report、outbox/handoff、idempotency/stored replay/job report 或 runtime/entry 哪一类状态族？

答：七U逐族：本地business、source/reference、reviewhandoff、distribution/notice、idempotency/recoverywork、projection。外部approval/readiness不进入本地stateenum。

5. 每个状态机归属于哪个模块和哪个 Step 6 状态 enum？

答：七U独立附录逐carrier指向Step6实际state字段与唯一contracts states枚举，不复制owner同名state。

6. 每个状态机的状态集合是什么？

答：完全从Step6 enum和当前02矩阵取值；同名Confirmed/Completed只在所属对象解释。14carrier共状态对逐个覆盖。

7. 哪些函数会触发状态转换,这些函数能否回指 Step 6 对象函数或 Step 9 flow？

答：每A转移绑定Step6完整factory/member签名与Step9独立flow；负向Receiver/Notice由Job处理，Record命令仅Confirmed；Claimed self仅Reconcile probe-only。

8. 每个转换的前置条件、副作用和错误是什么？

答：逐转移guard列字段、repository完整读取、formalport/policy输出、版本/fence/CAS/sourcecursor；无body/scan/ACK自批准。

9. 非法转换应该返回什么错误，是否写审计？

答：DomainError::IllegalTransition映射ErrorCode::IllegalTransition，mutation全部rollback，无accepted audit/result；实际Job拒发有typedgap时按合法block分支记录报告，不伪造成功。

10. 每个状态机完成后,状态名、触发函数、前置条件、非法转换和副作用是否通过停审？

答：每carrier enum/state/trigger/guard/error/effect/test独立停审；S同state不等盲发，factory不在pair集合但独立审计。

11. 所有状态机完成后,是否存在同名 / 近义状态语义冲突、触发函数缺失、测试 / 验收口径漂移或 phase reserved 状态被当前 boundary 调用？

答：最终交叉审计publisher-release、version-permission、cancel-lateoutcome、unknownprobe、impactcursor、snapshot/projection不复活版本；0reserved当前state、0新增GlobalState。

## 4. 当前文档问题诊断

概要A/S/R只给方向，Step9揭示负向正式结果实际由Job而非候选录入命令推进、publisher锁先于version、双源impact必须联合cursor以及checkpoint/manifest无独立state。本步必须逐pair将自然语言guard落到完整schema/port/function；不能照Governance创建本仓没有的outbox/runtime状态机。

## 5. 改动前后对比

| 项 | 前 | 后 |
|---|---|---|
| 契约深度 | 前序概念骨架 | 本Step按模块/对象/入口独立展开，类型、来源与失败边界可追溯 |
| 外部资格 | retained pending | 不因文档深化变为ready；受影响positive仍blocked |

## 6. 设计取舍

沿用14个本地carrier，不增全局state；七U分批、每carrier先筛选/思考后结构化，全部n*n组合写A/S/R与condition/test refs。Immutable与有限read/error/disposition分类只筛选映射，不硬造生命周期。先原typedcurrent资格、事务/fence和fullreport约束，再状态转换；本Step结束停在授权边界。

## 7. 结构化中间产物

### 候选主语全量筛选

| 候选 | 实际authority | 进入状态机 | 原因 / state族 |
|---|---|---|---|
| PublisherRelation | Step6 PublisherRelationState / U1 | 是 | business / publisher relation |
| SourceVerification | Step6 SourceVerificationState / U1 | 是 | source/reference qualification |
| PublicationApplication | Step6 PublicationApplicationState / U2 | 是 | business / publication |
| ReviewHandoff | Step6 ReviewHandoffState / U2 | 是 | handoff propagation / review |
| MarketVersion | Step6 MarketVersionState / U3 | 是 | business / catalog admission |
| DistributionIntent | Step6 DistributionIntentState / U4 | 是 | business / distribution intent |
| DistributionAttempt | Step6 DistributionAttemptState / U4 | 是 | dispatch / receiver result |
| ImpactRecord | Step6 ImpactCoverageKind / U5 | 是 | business / known impact coverage |
| NoticeIntent | Step6 NoticeIntentState / U5 | 是 | handoff propagation / notice |
| OperationRecord | Step6 OperationRecordState / U6 | 是 | idempotency / full stored replay |
| DeferredWork | Step6 DeferredWorkState / U6 | 是 | durable responsibility / technical fence |
| RecoveryIntent | Step6 RecoveryIntentState / U6 | 是 | recovery / local progress |
| QualifiedReferenceSnapshot | Step6 ReferenceSnapshotState / U7 | 是 | source/reference snapshot |
| ReadProjection | Step6 ReadProjectionState / U7 | 是 | projection/read maintenance |
| SourceBinding/MaterialReference/PublicationBasis/TypedOwnerReference | contracts immutable组合值 | 否 | ownerref/version/digest/visibility，仅可引用，不新资产生命周期 |
| GovernanceDecisionBinding/ReceiverOutcomeBinding/NoticeOutcomeBinding/ObservationOutcomeBinding | contracts immutable正式结果关联 | 否 | externaltruth结果ref，不复制approval/installed/delivery/evidence |
| MarketplaceListing/Category/DistributionRelation/WithdrawalDisposition | 本地metadata/immutablefact或关联，无独立stateenum | 否 | 字段edit或attach/CAS，不人为Draft/Active/Deleted |
| OperationContext/CoreContextRecord/StoredOperationResult/MarketAuditRecord | 原metadata/immutable result/audit | 否 | Reserved/Completed由OperationRecord唯一拥有 |
| JobCheckpoint/DeferredPlan/ReservedOperation/DispatchPermission/DispatchFence | 原计划/获胜IDs/许可/技术fence | 否 | 生命周期由OperationRecord与DeferredWork承接，不凭generation或ACK造state |
| ReadSurfaceKind/ReadSurface/ReadMarker/ReplayDisposition/JobItemOutcome | 有限read/replay/report分类 | 否 | 各次返回的有限分类，不持久独立lifecycle；Ready不是资格ready |
| CommitDisposition/ExternalEffectInspectionInput/ReviewDispatchOutcomeInput/ReceiverOutcomeInput/NoticeOutcomeInput | typed事务/正式probe分类 | 否 | Unknown/Confirmed等输入值仅由其owningcarrier消费，非新状态机 |
| AdapterBindingDisposition/UowMode/HTTP envelope/error/UI async surface | runtime/entry技术分类 | 否 | plannedbound configuration or transientstate，不建立持久GlobalState |
| PageInfo/RepositoryCursor/ProjectionBuildItem/manifest | 分页/完整构建清单 | 否 | 固定cursor与完整来源约束，不修business truth |
| Owner Governance/Identity/Artifact/Method/Hub/MemberImage/Receiver/Billing | 外部authority | 否 | 只消费正式ref，Billing当前无owner为future/blocker |

### 状态族与分批停审

| 批次 | 状态机数 | pairs | 附录 | 当前状态 |
|---|---|---|---|---|
| U1 来源/发布责任 | 2 | 20 | [独立矩阵](03_ddd_step_10_part_u1.md) | 单机停审与跨机audit完成（文档），外部资格不关闭 |
| U2 申请/正式审核交接 | 2 | 45 | [独立矩阵](03_ddd_step_10_part_u2.md) | 单机停审与跨机audit完成（文档），外部资格不关闭 |
| U3 目录/市场版本 | 1 | 16 | [独立矩阵](03_ddd_step_10_part_u3.md) | 单机停审与跨机audit完成（文档），外部资格不关闭 |
| U4 受控分发 | 2 | 40 | [独立矩阵](03_ddd_step_10_part_u4.md) | 单机停审与跨机audit完成（文档），外部资格不关闭 |
| U5 撤回/影响/通知 | 2 | 40 | [独立矩阵](03_ddd_step_10_part_u5.md) | 单机停审与跨机audit完成（文档），外部资格不关闭 |
| U6 审计/恢复 | 3 | 36 | [独立矩阵](03_ddd_step_10_part_u6.md) | 单机停审与跨机audit完成（文档），外部资格不关闭 |
| U7 引用/snapshot/索引 | 2 | 25 | [独立矩阵](03_ddd_step_10_part_u7.md) | 单机停审与跨机audit完成（文档），外部资格不关闭 |

实际静态核对：14carrier、222全量pair、73个明确A转移（含Claimed→Claimed probe-only），与Step6/当前02分类一致。每carrier独立enum/状态语义/factory/ASCII/完整signature/条件来源/n*n表/非法错误/逐ST plannedtest，不新增outbox/jobreport或runtime独立生命周期。

### 本步明确语义与前序回修

- RecordReceiverOutcome/RecordNoticeOutcome的候选Command仅录入Confirmed；Dispatch/Reconcile Job承担KnownNotCommitted/Unknown，因此矩阵负向trigger回指实际Job，不照搬概要旧触发名。
- GovernancePort.probe_review补完整ReviewProbeResult：inspection + optional formaldispatchoutcome + optional currentdecision；只有inspectionproof不能造dispatch_outcome_ref，缺正式receipt/决定保持Unknown并等待。
- Restricted→Listed“新有效正式依据”是本次明确List intent下的formal当前source/material/publisher/Governance有效性依据，不要求或允许本仓伪造owner版本/决定。缓存旧批准不能自恢复，当前formal同决定仍有效也必须被owner正式确认适用。
- publisher锁先于version锁，localRelease与positive许可同序列化点；外部资格有效性仍依赖正式consumercontract，并不宣称跨owner分布式原子。
- Qualified/Blocked SourceVerification是核验结论，不能同record重新核验，仍允许矩阵明确Invalidated；新核验新verificationref。Snapshot Qualified是可刷新切片，二者不能同义。
- 本地Rejected请求不写accepted业务audit/fullresult/work；合法Jobblocked/unknown分支保留真实安全报告，不把失败请求当事实成功。



### 跨状态机命名、触发与副作用审计

| 审计关系 | 约束 / 已闭合设计结论 | planned切口 |
|---|---|---|
| Governance→Review→Version | MatchedDecision含正式rejected也合法，不等Approved；Version Listed另读currentdecision.approved/fullbasis；scan/signature/ACK不能关审核 | matched rejected不能Listed；validity替代/撤销当前否决 |
| Publisher Released→Verification/Admission | Released终态且与正向lock_publisher同序列化点；有限verification可Invalidated，其余历史Qualified不证明当下许可 | release与submit/request/dispatch相反锁顺序结果 |
| Version vs acquisition/dispatch | lock_publisher→lock_version；Listed是必要非充分条件，currentapproved/source/material/receiver全部正式；撤回终态 | 许可前withdraw禁发；许可后late结果+impact |
| Cancelled vs Attempt | Cancelled只intent终态，不能覆盖Confirmed/Unknown；旧attempt Failed/Blocked终态，有据恢复newattempt sameintent | 取消后保存正式lateConfirmed，禁止newpermission |
| Receiver Failed/Blocked vs Notice Failed/Blocked | receiver旧attempt终态新attempt；notice可formalnotcommit+currentgate sameintent新fence再Dispatching | 两类retry分离，S不盲发 |
| External Unknown vs localwork Settled | Unknown不证明NotCommitted；旧Claimedexpired onlyReconcile probe-only；只有实际durable successor或无danglingduty才Settled | no-probe Blocked，expiry第二send计数0 |
| Review probe typed完整面 | ReviewProbeResult区分inspection、optional正式dispatchoutcome、optionalcurrentdecision；有proof没ref不得造WaitingDecision/approval | inspectionOnly仍Unknown，wrongbasis拒绝 |
| Operation vs checkpoint/report | Reserved/Completed唯一生命周期；checkpoint是immutable原请求/预分配IDs/fence；fulloriginalreport缺少任何必要字段就等待，不projection猜 | crash-before/after A/B，diffintent，原reportitem遗漏 |
| Recovery local vs external | QualifiedRecoveryInput.inspection为Option；remote Some正式probe，local Snapshot/Projection/Impact None只安排原typedmaintenance；Recovery→Recovery不递归 | local no fakeproof，external unknown不能Completed |
| Impact completeness | KnownScopeComplete仅固定cursor本地known集合，联合typedscan；late高cursorinclude→Partial；所有适用disposition更新不能截断 | uniontie-break、合法空终页、late增量、预算rollback |
| Snapshot vs SourceVerification | snapshot Qualified可完整formalrefresh，不使Blockedverification同recordQualified；snapshot失败不复活Restricted/Withdrawn | body/type/validity错配，Unavailable→Stale拒绝 |
| Projection initializer/publish | ProjectionStore.source_cursor只typed依赖highwater（排除自己的维护audit/report），initialize是Stale（与Step6/HLD一致），空manifest不得Fresh；完整plan→Rebuilding→Fresh且views/state原子；源变化Stale | missingmanifest、重复viewkey、build期间更高cursor |
| Query helper | QualifiedReadContext只resolved scope/disclosure/sourceconstraints，Coreactor/QueryMetadata在入口唯一持有；无querycontextID/DBwrite | 所有Query writer/ID/Clock/audit计数0 |
| 同名Confirmed/Completed/Fresh | receiver正式结果、notice正式channel结果、work本地职责/operation原结果/projectioncursor各自语义，不等installed/delivered/evidence/readiness | UI EN/ZH只display，不改state/refs/key |
| 非法与safeerror | R→DomainError::IllegalTransition/已有ErrorCode；preacceptreject不写成功audit/result；actualJobBlocked按合法分支保存safegap/fullreport | 每222pair逐ST fixture成功/失败，tests未run |
| scope与read分类 | 返回Ready指本次读取成功，freshness详情可以显示Unavailable state；业务catalog stale不提供旧不安全body；当前items/count/token同披露交集 | hiddenref/count/token、page过滤先于分页 |
| future/reserved | 0当前phase reserved state；无GlobalState/outbox/Bus/Billing/Archive lane，不照搬Governance状态数量 | 编译/运行仍未发生；07ledger/skeleton未提前创建 |

### 游标分层与前序回填

UnitOfWork.assign_cursor为实际本地Txcommitframe提供全局单调序列，Job结果B不可复用初始claim A游标；lateimpact使用结果B游标。Impact coverage_cursor是固定枚举上界。ProjectionStore.source_cursor按typedidentity/明确business sourcepolicy取得依赖highwater，plan与publish复核同predicate，排除维护自写/lease/checkpoint；Catalog/Progress/Impact/Audit投影不因重建自身audit无限失效。上述是局部存取设计，不是owner commit证据。

### 复杂度与后续承接

七附录共14单机、222pairs、73A、独立condition/testrefs；部分carrier虽同名词汇仍不可混写。Step11以后需在获得授权时承接现有完整schema/port/Tx/状态规则，细化Postgres约束、错误/并发/配置/observability与测试，不能重新发明字段来源。这里不是提前创建Step11文件或实施计划/实现台账。


## 8. 候选正式草稿

候选正式§9：先状态主语筛选与排除表，按七U摘录14独立enum/状态含义/factory/ASCII/222pair矩阵/完整trigger/字段condition/错误/原结果与副作用/逐ST plannedtest，最后列跨状态机审计和游标分层。不得把phase/futureowner状态带入本地truth；正式03仍不装配。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01及受影响Hub/Images/Obs/SDK资格仍pending/blocked；本地候选不冒充owner确认。Billing/支付/订阅/分成/跨境均future/blocker，Archive无active lane。

## 10. 自检与下一门禁

已完成文档内部自检与stop_review：[实际静态记录](03_ddd_static_review_step_05_10.md)。14carrier/222pair/73A、49flow、17ports/146methods、完整schema镜像/构造/Markdown/本地链接均核对；外部资格仍blocked，没有编译/运行测试/证据或readiness。用户授权Step5～10已用尽，当前立即停止。Step11～19等待明确用户授权，不创建未来Step/implementation ledger，不修改正式03，不提交commit。
