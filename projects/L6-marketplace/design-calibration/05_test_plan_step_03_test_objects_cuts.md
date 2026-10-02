# Step 3：抽取测试对象与测试切口

> 对应 SOP：测试方案讨论流程 Step 3
> 回填章节：`05-测试方案.md` §3

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 测试对象与测试切口 |
| 当前状态 | completed / stop_review |
| 输入 | 03 §§5～16、03 Step16、04 §§7～12 |
| 输出 | 对象/入口/状态/跨契约 P0 切口清单 |

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_02_scope.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7；编号/字段/归属可反查 |
| 复杂度判断 | done | 主控内按表/单元组织，不需新增业务附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，外部资格不关闭 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done是本Step内容事实，不是测试执行或用户/owner签核。

## 2. 本步输入与目标

读取Step2范围、03§5～15及Step16§7.1～7.5、03对象/协议/状态七U附录、04§7/9/11。输出：七U对象/49入口/14carrier/13 CUT的正式来源和设计侧独立停审；planned测试文件沿03 Step16，不创建文件。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些对象/policy单测？ | 全43对象及其Row/support carrier，factory/member/rehydrate；不是只选表中代表。 |
| 哪些service测试？ | 七U/49 flow，同17ports/146methods spy与fault，不借私有fake接口补读取。 |
| 哪些adapter/worker集成？ | PG unique/CAS/frame/as-of与八owner slot；Worker A/B/fence/shutdown；真实PG不能fake替代。 |
| 哪些C/Q/Event/Job？ | 21C/16Q/12J全覆盖；0activeEvent/consumer，不自造。 |
| 状态/事务/幂等恢复如何单列？ | CUT-02/04/05/06/08/09；14carrier 222 pair（73 A，其余S/R按正式矩阵），33 C/J canonical。 |
| 字段缺失/DTO/引用混同？ | 所有required缺失、option条件缺失、wrong typed kind/binding/revision/metadata；CUT-01/02/03/07。 |
| 状态名以什么为准？ | 03§9与Step10 enum，不写Verified/Unknown/Delivered作为本地state。 |
| 回指哪份truth source？ | 03§6索引的对象卡、Step8协议/Step9 flow、Step10矩阵；跨项回Step11～15和04。 |
| 孤儿P0契约？ | 本步13 CUT承接03 Step16全部模块/入口/状态/跨项/安全；Step6将补具体TC/data/EV。 |
| 切口是否独立停审？ | §7.5逐CUT记录，仅设计来源审查，不称测试passed或用户逐CUT签核。 |

## 4. 当前文档问题诊断

初稿只写“单独审查”而没有结果；carrier表写Unknown易和正式CommitUnknown漂移；对象简称Relation/Attempt可能被误当新增类型。现回指正式名和逐CUT来源。

## 5. 改动前后对比

| 项 | 前 | 后 | 理由 |
|---|---|---|---|
| 切口审查 | 只有要求 | 13个独立来源/风险/层级检查 | 可恢复审查结论 |
| state/factory | 模块泛称 | 14carrier全矩阵+43对象逐field/rehydrate | 防漏非法分支 |

## 6. 测试设计取舍

采用13跨契约切口+七U入口索引；不按页面功能代替领域、PG和恢复验证。复杂用例/数据/证据留后续独立Step，本步仅预留候选映射；不造第50入口或第15生命周期。

## 7. 结构化中间产物

### 7.1 测试对象总表

| U | 责任单元 | 对象重点 | 入口数 | 主要切口 |
|---|---|---|---:|---|
| U1 | source_responsibility | SourceBinding、MaterialReference、PublisherRelation、SourceVerification、SourceGatePolicy、SourceQualificationView | 4 | typed reference、publisher release、资格失败 |
| U2 | publication_review | PublicationBasis、PublicationApplication、ReviewHandoff、GovernanceDecisionBinding、ReviewBindingPolicy、ApplicationProgressView | 8 | fixed basis、handoff A/B、正式决定匹配 |
| U3 | catalog_version | MarketplaceListing、MarketVersion、Category、VersionAdmissionPolicy、CatalogReadView | 10 | listing/version state、category、search/select |
| U4 | distribution | DistributionIntent、DistributionRelation、DistributionAttempt、ReceiverOutcomeBinding、AcquisitionGatePolicy、DistributionReadView | 7 | current gate、receiver outcome、cancel/late |
| U5 | withdrawal_notice | WithdrawalDisposition、ImpactRecord、NoticeIntent、NoticeOutcomeBinding、WithdrawalImpactPolicy、ImpactNoticeView | 9 | restrict/withdraw、fixed upper、notice Unknown |
| U6 | audit_recovery | OperationContext、OperationRecord、StoredOperationResult、MarketAuditRecord、DeferredWork、RecoveryIntent、ObservationOutcomeBinding、RecoveryPolicy、AuditRecoveryView | 7 | canonical/replay、recovery、Observation ceiling |
| U7 | reference_read | TypedOwnerReference、QualifiedReferenceSnapshot、QualifiedReadContext、ReadProjection、ReadBoundaryPolicy | 4 | body-free refresh、manifest、freshness |

总计 43 个主要对象、49 个入口。测试对象不是实现文件；planned 路径和 03 的模块责任只能作为未来实施输入。

### 7.2 49 个入口库存（规范性）

| U | Command | Query | Job |
|---|---|---|---|
| U1 | `BindPublisherRelation`、`ReleasePublisherRelation`、`VerifyPublicationSource` | `GetSourceQualification` | - |
| U2 | `CreatePublicationDraft`、`RevisePublicationDraft`、`SubmitPublicationApplication`、`TerminatePublicationApplication`、`RecordGovernanceDecision` | `GetPublicationProgress` | `DispatchReviewHandoff`、`ReconcileReviewHandoff` |
| U3 | `CreateMarketplaceListing`、`EditMarketplaceListing`、`MaintainMarketCategory`、`RegisterMarketVersion`、`ListMarketVersion` | `SearchMarketplaceCatalog`、`GetMarketplaceListing`、`ListMarketVersions`、`SelectMarketVersion`、`ListMarketCategories` | - |
| U4 | `RequestDistribution`、`CancelDistribution`、`RecordReceiverOutcome` | `GetAcquisitionEligibility`、`GetDistributionProgress` | `DispatchDistribution`、`ReconcileDistribution` |
| U5 | `RestrictMarketVersion`、`WithdrawMarketVersion`、`PlanImpactNotifications`、`RecordNoticeOutcome` | `GetWithdrawalImpact`、`GetNoticeProgress` | `EnumerateKnownImpact`、`DispatchNotice`、`ReconcileNotice` |
| U6 | `RequestMarketRecovery` | `GetMarketAudit`、`GetRecoveryProgress`、`GetOperationResult` | `RunMarketRecovery`、`DispatchObservation`、`ReconcileObservation` |
| U7 | - | `GetReferenceFreshness`、`GetProjectionFreshness` | `RefreshQualifiedReferences`、`RebuildMarketReadProjection` |

每个入口必须同时有：有效输入、缺失/错类型、权限/scope、duplicate/replay、下游失败和安全错误断言。测试方案不重新写入口 schema；字段和错误回指 03 对应 U 附录。

### 7.3 14 个状态 carrier 切口

| carrier | 正向切口 | 负向/特殊切口 |
|---|---|---|
| `PublisherRelation` | Bound→Released | 释放后不能作为 current publisher |
| `SourceVerification` | 正式start/record/invalidate按矩阵形成Pending/Qualified/Blocked/Invalidated | 缺 digest/visibility/material 不得 Qualified |
| `PublicationApplication` | Draft→Submitted/Terminated | Submitted 不可替换 fixed basis |
| `ReviewHandoff` | PendingDispatch→WaitingDecision→MatchedDecision | ACK≠approval；CommitUnknown/ContractBlocked/Failed 有责任 |
| `MarketVersion` | Staged→Listed→Restricted/Withdrawn | Withdrawn terminal，不能 refresh 复活 |
| `DistributionIntent` | Accepted→Cancelled | Cancel 不抹 attempt/late result |
| `DistributionAttempt` | Prepared→Dispatching→Confirmed/Failed/CommitUnknown/Blocked（以guard为准） | 旧 fence 不能覆盖；timeout 不当作 not committed |
| `ImpactRecord` | Partial↔KnownScopeComplete（按 fixed upper） | late cursor 重新 Partial |
| `NoticeIntent` | Prepared→Dispatching→Confirmed/Failed/CommitUnknown/Blocked（以guard为准） | ACK 不等送达/已读 |
| `OperationRecord` | Reserved→Completed | 缺 full result 不能 Completed；异 fingerprint 冲突 |
| `DeferredWork` | Pending→Claimed→Settled/Blocked | 过期 claim 只能 probe/reconcile |
| `RecoveryIntent` | Requested→Running→Completed/Blocked | Recovery 递归和任意 SQL 修复拒绝 |
| `QualifiedReferenceSnapshot` | Qualified/Stale/Unavailable | 过期/不可见不造 safe_material |
| `ReadProjection` | Stale→Rebuilding→Fresh/Unavailable | 缺 manifest/body 不得 Fresh |

### 7.4 P0 跨契约切口

| 切口 ID | 最小断言 | 计划层级 | 停审要求 |
|---|---|---|---|
| CUT-MP-01 contract codec | 49 协议/结果/嵌套类型 round-trip；unknown tag/field 拒绝 | unit/contract | 单独审查 |
| CUT-MP-02 domain guards | factory/rehydrate、终态、73 合法/禁止 pair | unit/domain | 单独审查 |
| CUT-MP-03 flow ports | 49 flow 的 port 顺序、完整结果、失败回滚 | service | 单独审查 |
| CUT-MP-04 atomic write set | save/work/audit/result/complete 任一点失败全 rollback | PG/service | 单独审查 |
| CUT-MP-05 A/B/Unknown | A commit unknown 不派发；B 失败保留原责任；RO 缺失不证明 rollback | worker/PG | 单独审查 |
| CUT-MP-06 canonical/idempotency | 33 business DTO 字段变化影响 fingerprint；同意图原结果，不同意图冲突 | unit/service | 单独审查 |
| CUT-MP-07 page/current visibility | PageReadContext、selector/filter/upper/after 绑定；count/items/token 同谓词 | service/API | 单独审查 |
| CUT-MP-08 version/withdraw race | publisher/version/withdraw 与 permission 序列化；late result 追加责任 | PG/service | 单独审查 |
| CUT-MP-09 projection/search | 完整 manifest、同 kind highwater、literal search predicate parity、无 self-loop | PG/service | 单独审查 |
| CUT-MP-10 config boundary | 七字段、八 slot、四 profile、source conflict、production no-fake | config/entry | 单独审查 |
| CUT-MP-11 security/observation | redaction、finite labels、audit refs、21C+8J Observation 无递归 | unit/service | 单独审查 |
| CUT-MP-12 query/replay no-write | 16Q 与原结果 replay 零 ID/context/audit/work/effect | service/API | 单独审查 |
| CUT-MP-13 Web semantics | DTO shape、En/Zh 不改 key/ref/state、blocked/unknown/empty 可区分 | Web/browser | 单独审查 |

### 7.5 P0切口独立停审记录

| CUT | 具体来源 / 审查依据 | 风险和层级复核 | 文档结论 |
|---|---|---|---|
| CUT-MP-01 | 03§7、Step8七U/shared surface | required/unknown/二级类型codec须unit，无owner正文 | pass |
| CUT-MP-02 | 03§5/9、Step6/10七U | 43对象/14carrier全guard、S条件/R零写，不只happy path | pass |
| CUT-MP-03 | 03§8、Step7/9七U | 49flow port order/fullresult/fault须service，fake不补私有方法 | pass |
| CUT-MP-04 | 03§10、Step11§7.5/7.6 | write set失败与sameTx须fake+真实PG，后者planned | pass |
| CUT-MP-05 | 03§8.3/11、Step9 Job/Step12 | A未知/B新帧/原checkpoint须Worker/PG，不以RO missing为rollback | pass |
| CUT-MP-06 | 03§12、Step13§7.1～7.3 | 33DTO精度/actor/Set/原完整结果须unit+service | pass |
| CUT-MP-07 | 03§7.3/12.4、Step7 PageReadContext | 七paged current disclosure/count/token须service/API | pass |
| CUT-MP-08 | 03§10/12、Step13竞争矩阵 | release/withdraw/许可/cancel/late结果须PG，不能远端原子撤销 | pass |
| CUT-MP-09 | 03§10.3/10.4、Step11/13 | as-of/fullmanifest/中文literal无循环须PG/service | pass |
| CUT-MP-10 | 04§5～11、03§13 | strict六域/七字段/八slot/四profile须loader/entry | pass |
| CUT-MP-11 | 03§14、Step15逐flow inventory | refs-only/finite label/21C+8J O、无递归须捕获+事务 | pass |
| CUT-MP-12 | 03§8.4/12、Step16 | 全16Q/原replay零write/Clock/ID/effect须spy | pass |
| CUT-MP-13 | 03§5.7/15、04§7/9 | DTO/En-Zh/状态/按钮须Web，UI不自认证/审批 | pass |

跨切口来源审计：七模块、七U、49入口、14carrier、03 Step16§7.4全部22项和§7.5全部11项均落上述CUT；共享约束只定义一次，由对应TC参数化检查。正向owner资格和实际PG运行仍blocked/not-run，不计为孤儿本地设计。

## 8. 回填草稿

正式§3收录§7.1～7.4的对象/入口/切口与来源索引；独立停审过程留本文件§7.5。字段/state/error只沿03，不复制第二套schema。

## 9. 待确认事项与详细设计影响判定

旧 05 的安装/entitlement/rating 对象不在当前 43 对象库存，全部删除。测试不把 UI button、fake provider label 或 `Bound` 配置字段当作能力。测试切口引用 03 原有字段/错误/状态；若实现阶段发现缺失则回写 03，不在 05 添加临时 schema。

## 10. 进入下一步条件

正式 §3 应包含 U1～U7、49 入口、14 carrier、13 P0 CUT 和“测试对象不是外部 owner truth”的证明上限。进入 Step4 的条件：每个 P0 切口能回指 03/04，且未发现需要新增领域对象或状态。

上述来源审查满足；`gate_status=pass`，下一读SOP Step4/规范§5.4与本Step层级结论；无需commit。完整TC/data/EV闭环在Step6/7/13继续，当前不是运行证据。
