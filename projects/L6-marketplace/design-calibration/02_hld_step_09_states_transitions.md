# 02 Step 9：状态定义与状态流转

## 1. Step状态

开工：用户已确认01并授权全部02；Step 9 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：U1→U2→U3→U4→U5→U6→U7逐部分小循环，前一部分pass才允许下一部分。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_08_processing_flows.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 本仓有哪些影响主线成立的正式状态？

答：状态主语只选Step6有state且Step8驱动/读取的本地carrier：publisher/source/app/review/version/distributionintent/attempt/impact/notice/operation/work/recovery/snapshot/projection。

2. 每个状态的含义是什么，是否可以进入正常主线？

答：每carrier独立意义，不存在全局Approved/Installed/Done；外部outcome引用不是localstate。

3. 哪些接口、事件或动作会触发状态迁移？

答：所有transition绑定Step7已定义command/job和Step8flow，domain成员触发+typed输入来源/revision保存。

4. 哪些迁移明确允许，哪些迁移明确禁止？

答：用全对全矩阵：允许guard动作显式，未列转换Reject，self只幂等保持/有据同姿态更新不重跑effect；终态不能复活。

5. 状态变化如何影响 outbox、projection、下游感知或只读供给？

答：localcommit→durable派生责任→scope安全投影；withdraw限制新受理及未许可派发，已许可unknown进入影响；eventoutbox当前无。

6. 每个状态属于哪个主要组成部分或关键对象？

答：按唯一carrier所属U，U5通过U3唯一versionwriter，U6operation/work状态不是业务成功。

7. 状态触发接口和处理流是否已经在 Step 7 / Step 8 定义？

答：逐transition反查既有API/flow与成员；恢复另attempt需要原intentknown-not-committed+当前gate，不能同对象复活terminal。

8. 是否存在同名 / 近义状态跨组成部分语义冲突？

答：Qualified/Fresh仅当地snapshot/read或核验结果；MatchedDecision不是approved；Confirmeddistribution/notice只formal结果关联；Completedrecovery仅localreport。

9. 每个主要组成部分的状态集合完成后是否通过停审？

答：每U先状态筛选/意义/trigger取舍，后矩阵/图/来源/传播/回填自检，七U完成跨状态审计。

## 4. 当前文档问题诊断

Step6卡片中state集合需筛除immutable refs/DTO/policy/UI；Step8新attempt与旧attempt terminal必须区别。ReviewHandoff缺Dispatching状态，持久workclaim/原reviewintent负责可能已外发判断，pending不代表可以盲send。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| state集合 | Step6枚举轮廓 | 14carrier全pair矩阵/guard/trigger/副作用 | 禁止未声明迁移 |
| 初始/失败条件 | Draft/Blocked字段有强制关联缺口 | Optional依据+safe draft_spec+failure/dispatch来源回修 | 真正可表达初始/缺口状态 |
| 重试 | terminal旧attempt易复活 | 新attempt同intent；notice有据同intent重试 | 避免重发副作用 |
| 传播 | localstate变化 | durable责任→qualifiedresult/shadow/lateimpact | 不造event与外部truth |

## 6. 设计取舍

选14个本地carrier全矩阵，不引入GlobalState。withdrawn/terminated/released/confirmedattempt终态不原地复活；需要retry另attempt或相同noticeintent有据begin，必须区分。Reject vs nonchangingduplicate明确，不新增状态/API。

## 7. 结构化中间产物

### 状态主语筛选

十四个state carrier分族：U1 publisher/sourceverification、U2 application/reviewhandoff、U3 marketversion、U4 distributionintent/attempt、U5 impact/notice、U6 operation/work/recovery、U7 qualifiedsnapshot/readprojection。外部Gov/receiver/Identity/finance truth状态不进入localmatrix。pure ref/basis/immutablebinding/audit/result/policy/readview排除，理由在§6卡片与各部分附录。ReadSurfaceKind为Query的安全结果映射，不新增持久业务状态机。

初始factory不可直接给后续未核验成功。SourceVerification Pending/Blocked允许缺正式sourcebinding/outcome，但Qualified需完整safequalified依据；Application Draft持久safe draft_spec，basis/review可缺，Submitted必须同UoW补齐固定PublicationBasis与ReviewHandoff；Review/Notice失败unknown保存安全failure/dispatch回指。所有condition字段已回修§6，并同步§7/8 Draft输出。

#### PublisherRelation 状态定义

owner=U1；carrier=PublisherRelation.state。初始=Bound；终态=Released。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Bound | 本地关联有效，后续当前授权仍复核 | 只允许下表本地动作 | 不推外部成功/授权 |
| Released | 本地关联解除，不反写主体truth | 仅历史/终态读取 | 不推外部成功/授权 |

| 从/到 | Bound | Released |
|---|---|---|
| Bound | S | A |
| Released | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Bound | Released | ReleasePublisherRelation / release(AuthorityDispositionInput input) | 正式解除authority，load relation revision | 保存relation、audit/result及依赖verification失效责任 |

#### 状态流转图

```text
Bound --[ReleasePublisherRelation]--> Released
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- 新的Bind建立新relation不把旧Released复活；Bound仍要求每次当前授权，不是human Verified。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### SourceVerification 状态定义

owner=U1；carrier=SourceVerification.state。初始=Pending；终态=Invalidated。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Pending | 待本次核验，不供新positive | 只允许下表本地动作 | 不推外部成功/授权 |
| Qualified | 本次固定输入合格，非永久授权 | 只允许下表本地动作 | 不推外部成功/授权 |
| Blocked | 缺失/不支持/冲突/失败安全缺口 | 只允许下表本地动作 | 不推外部成功/授权 |
| Invalidated | 旧核验不再可用；新核验另建记录 | 仅历史/终态读取 | 不推外部成功/授权 |

| 从/到 | Pending | Qualified | Blocked | Invalidated |
|---|---|---|---|---|
| Pending | S | A | A | A |
| Qualified | R | S | R | A |
| Blocked | R | R | S | A |
| Invalidated | R | R | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Pending | Qualified | VerifyPublicationSource / record(QualificationOutcomeInput outcome) | SourceGatePolicy全部正式binding/材料/authority匹配；outcome来自qualifiedport | 固定SourceBinding/MaterialReference+localaudit/result |
| Pending | Blocked | VerifyPublicationSource / record(QualificationOutcomeInput outcome) | 正式缺口/unsupported/missing/conflict，safeoutcome可回指 | 保存Blocked与gap，禁止positive |
| Pending | Invalidated | ReleasePublisherRelation / invalidate(SourceInvalidationInput input) | 关联relation释放的正式局部失效依据 | audit+本地资格不再使用 |
| Qualified | Invalidated | ReleasePublisherRelation / invalidate(SourceInvalidationInput input) | 关联relation已释放且依赖映射typed | audit+失效责任 |
| Blocked | Invalidated | ReleasePublisherRelation / invalidate(SourceInvalidationInput input) | 旧过程依赖releasedrelation | 保留旧gap/history |

#### 状态流转图

```text
Pending --[VerifyPublicationSource]--> Qualified
Pending --[VerifyPublicationSource]--> Blocked
Pending --[ReleasePublisherRelation]--> Invalidated
Qualified --[ReleasePublisherRelation]--> Invalidated
Blocked --[ReleasePublisherRelation]--> Invalidated
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- Pending可在一次Verify UoW内完成，查询不会补Qualified；新核验创建新记录，不让Blocked旧依据原地变合格。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### PublicationApplication 状态定义

owner=U2；carrier=PublicationApplication.state。初始=Draft；终态=Terminated。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Draft | 允许改草稿输入 | 只允许下表本地动作 | 不推外部成功/授权 |
| Submitted | 固定申请基线，等待独立handoff/决定 | 只允许下表本地动作 | 不推外部成功/授权 |
| Terminated | 本地申请终止，不复活 | 仅历史/终态读取 | 不推外部成功/授权 |

| 从/到 | Draft | Submitted | Terminated |
|---|---|---|---|
| Draft | S | A | A |
| Submitted | R | S | A |
| Terminated | R | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Draft | Submitted | SubmitPublicationApplication / submit(QualifiedPublicationInput input) | 当前source/publisher/material，固定basis与scope；Draft revision | basis+review PendingDispatch+work+audit/result同UoW |
| Draft | Terminated | TerminatePublicationApplication / terminate(ApplicationTerminationInput input) | 正式终止authority | audit/result，不删草稿依据 |
| Submitted | Terminated | TerminatePublicationApplication / terminate(ApplicationTerminationInput input) | 正式终止authority与当前reviewinspection | 保留已有外部交接及unknown对账责任 |

#### 状态流转图

```text
Draft --[SubmitPublicationApplication]--> Submitted
Draft --[TerminatePublicationApplication]--> Terminated
Submitted --[TerminatePublicationApplication]--> Terminated
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- Revise只有Draft同姿态，Submitted到Draft/改输入全部R；Terminated新申请，不自动撤Gov决定。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### ReviewHandoff 状态定义

owner=U2；carrier=ReviewHandoff.state。初始=PendingDispatch；终态=无不可逆终态，仍必须有正式trigger。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| PendingDispatch | 待原意图交接 | 只允许下表本地动作 | 不推外部成功/授权 |
| WaitingDecision | 正式接收申请，非批准 | 只允许下表本地动作 | 不推外部成功/授权 |
| MatchedDecision | 匹配正式决定已关联，决定outcome仍需读取 | 只允许下表本地动作 | 不推外部成功/授权 |
| CommitUnknown | 交接结果未知，原意图probe | 只允许下表本地动作 | 不推外部成功/授权 |
| ContractBlocked | consumer/SDK合同或binding不具备 | 只允许下表本地动作 | 不推外部成功/授权 |
| Failed | 明确未接收失败，可据原意图安全重试 | 只允许下表本地动作 | 不推外部成功/授权 |

| 从/到 | PendingDispatch | WaitingDecision | MatchedDecision | CommitUnknown | ContractBlocked | Failed |
|---|---|---|---|---|---|---|
| PendingDispatch | S | A | R | A | A | A |
| WaitingDecision | R | S | A | R | R | R |
| MatchedDecision | R | R | S | R | R | R |
| CommitUnknown | R | A | A | S | R | A |
| ContractBlocked | R | A | R | A | S | R |
| Failed | R | A | R | A | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| PendingDispatch | WaitingDecision | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | 正式接收原handoff，fixedbasis且申请未终止 | 保存接收安全ref/audit/report |
| PendingDispatch | CommitUnknown | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | 许可已持久、timeout/crash可能提交；原intent | unknown+probe责任 |
| PendingDispatch | ContractBlocked | DispatchReviewHandoff / block(ContractGapInput gap) | 未外发、contract/SDK/sourcebinding缺失 | 安全gap+blockedwork |
| PendingDispatch | Failed | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | 正式证明未接收失败 | 失败ref/audit/report |
| Failed | WaitingDecision | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | 原intent已证明未接收、当前gate、再次正式接收 | 同intent新attempt历史，非新approval |
| Failed | CommitUnknown | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | 原intent安全再发后结果未知 | unknownprobe责任 |
| ContractBlocked | WaitingDecision | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | 正式contract资格补齐，证明未外发，当前gate | 原intent正式接收 |
| ContractBlocked | CommitUnknown | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | 补齐资格再发原intent，结果未知 | unknownprobe责任 |
| CommitUnknown | WaitingDecision | ReconcileReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | formalprobe原intent确认接收，binding匹配 | 原intent收敛+report |
| CommitUnknown | Failed | ReconcileReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | 正式probe证明未接收失败 | 保留原失败与安全retry依据 |
| WaitingDecision | MatchedDecision | RecordGovernanceDecision / record_decision(GovernanceDecisionBinding binding) | 正式Decision完整application/basis/scope绑定 | 保存决定ref/outcome，绝不自动Listed |
| CommitUnknown | MatchedDecision | RecordGovernanceDecision / record_decision(GovernanceDecisionBinding binding) | 正式query/probe决定证明匹配原申请 | unknown以正式依据收敛，不推approval |

#### 状态流转图

```text
PendingDispatch --[DispatchReviewHandoff]--> WaitingDecision
PendingDispatch --[DispatchReviewHandoff]--> CommitUnknown
PendingDispatch --[DispatchReviewHandoff]--> ContractBlocked
PendingDispatch --[DispatchReviewHandoff]--> Failed
Failed --[DispatchReviewHandoff]--> WaitingDecision
Failed --[DispatchReviewHandoff]--> CommitUnknown
ContractBlocked --[DispatchReviewHandoff]--> WaitingDecision
ContractBlocked --[DispatchReviewHandoff]--> CommitUnknown
CommitUnknown --[ReconcileReviewHandoff]--> WaitingDecision
CommitUnknown --[ReconcileReviewHandoff]--> Failed
WaitingDecision --[RecordGovernanceDecision]--> MatchedDecision
CommitUnknown --[RecordGovernanceDecision]--> MatchedDecision
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- MatchedDecision的决定可approved/rejected/其他，市场不生产outcome；失效/revoked查询和上架gate拒绝，不用本地状态假造Gov撤销。已终止申请可安全补记旧已产生结果但不能新dispatch或list。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### MarketVersion 状态定义

owner=U3；carrier=MarketVersion.state。初始=Staged；终态=Withdrawn。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Staged | 登记未上架，不可获取 | 只允许下表本地动作 | 不推外部成功/授权 |
| Listed | 本地可上架姿态，获取仍当前gate | 只允许下表本地动作 | 不推外部成功/授权 |
| Restricted | 本地禁新获取，恢复需新有效依据显式list | 只允许下表本地动作 | 不推外部成功/授权 |
| Withdrawn | 本次marketversion处置终态；重发新marketversion/申请 | 仅历史/终态读取 | 不推外部成功/授权 |

| 从/到 | Staged | Listed | Restricted | Withdrawn |
|---|---|---|---|---|
| Staged | S | A | A | A |
| Listed | R | S | A | A |
| Restricted | R | A | S | A |
| Withdrawn | R | R | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Staged | Listed | ListMarketVersion / list(VersionAdmissionInput input) | currentapproved与固定application/source/material/scope全匹配；currentgate+versionrevision | 版本+decisionbinding+audit/result+projection责任 |
| Restricted | Listed | ListMarketVersion / list(VersionAdmissionInput input) | 新有效正式依据/当前qualification；explicitintent，旧approved不可自复活 | 新处置历史+audit/result |
| Staged | Restricted | RestrictMarketVersion / restrict(VersionRestrictionInput input) | 正式处置/资格缺口依据；sameversionserialization | disposition+PartialImpact+impactwork/audit/result |
| Listed | Restricted | RestrictMarketVersion / restrict(VersionRestrictionInput input) | 正式失效或资格不能证明；不是外部撤销推断 | 局部禁新获取，durableknownimpact |
| Staged | Withdrawn | WithdrawMarketVersion / withdraw(VersionWithdrawalInput input) | 正式撤回authority，同versionserialization | immutable处置+impactwork/audit/result |
| Listed | Withdrawn | WithdrawMarketVersion / withdraw(VersionWithdrawalInput input) | 正式撤回authority，同versionserialization | 停新受理/未许可派发，影响known/unknown |
| Restricted | Withdrawn | WithdrawMarketVersion / withdraw(VersionWithdrawalInput input) | 正式撤回依据，不等待通知/外部audit | 同局部原子承诺 |

#### 状态流转图

```text
Staged --[ListMarketVersion]--> Listed
Restricted --[ListMarketVersion]--> Listed
Staged --[RestrictMarketVersion]--> Restricted
Listed --[RestrictMarketVersion]--> Restricted
Staged --[WithdrawMarketVersion]--> Withdrawn
Listed --[WithdrawMarketVersion]--> Withdrawn
Restricted --[WithdrawMarketVersion]--> Withdrawn
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- 唯一writer U3，U5调用同领域对象，不建第二versionstate；Withdrawn重发必须新marketversion/new审查语境；source恢复、通知retry、query不能Listed。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### DistributionIntent 状态定义

owner=U4；carrier=DistributionIntent.state。初始=Accepted；终态=Cancelled。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Accepted | 本地受理，有耐久交接责任，非installed | 只允许下表本地动作 | 不推外部成功/授权 |
| Cancelled | 本地不再启动新派发，既有external结果继续对账 | 仅历史/终态读取 | 不推外部成功/授权 |

| 从/到 | Accepted | Cancelled |
|---|---|---|
| Accepted | S | A |
| Cancelled | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Accepted | Cancelled | CancelDistribution / cancel(DistributionCancelInput input) | consumer/currentscope授权；typedattempt现状 | 保留旧externalresult/unknown对账，阻止未发新许可 |

#### 状态流转图

```text
Accepted --[CancelDistribution]--> Cancelled
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- Cancelled不是receiver取消，旧已发late结果仍可由RecordReceiverOutcome追加到attempt/relation。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### DistributionAttempt 状态定义

owner=U4；carrier=DistributionAttempt.state。初始=Prepared；终态=Confirmed/Failed/Blocked。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Prepared | 尚未派发，需当前gate | 只允许下表本地动作 | 不推外部成功/授权 |
| Dispatching | 已获局部dispatch许可，可能外部commit | 只允许下表本地动作 | 不推外部成功/授权 |
| Confirmed | 正式receiver outcome匹配，仅局部映射 | 仅历史/终态读取 | 不推外部成功/授权 |
| Failed | 正式证明未提交失败；重试需安全原意图依据 | 仅历史/终态读取 | 不推外部成功/授权 |
| CommitUnknown | 提交可能发生，禁止盲retry | 只允许下表本地动作 | 不推外部成功/授权 |
| Blocked | 派发前合同/资格不成立，不自恢复 | 仅历史/终态读取 | 不推外部成功/授权 |

| 从/到 | Prepared | Dispatching | Confirmed | Failed | CommitUnknown | Blocked |
|---|---|---|---|---|---|---|
| Prepared | S | A | R | R | R | A |
| Dispatching | R | S | A | A | A | R |
| Confirmed | R | R | S | R | R | R |
| Failed | R | R | R | S | R | R |
| CommitUnknown | R | R | A | A | S | R |
| Blocked | R | R | R | R | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Prepared | Dispatching | DispatchDistribution / begin(CurrentDispatchGateInput input) | 原intentAccepted、currentgate、sameversionserialize未撤回、claimfence | dispatch许可先持久，再externalcall |
| Prepared | Blocked | DispatchDistribution / block(ContractGapInput gap) | 合同缺口/已取消/撤回/资格不成立，尚未许可 | gap/audit/fullreport；不externaldispatch |
| Dispatching | Confirmed | RecordReceiverOutcome / settle(ReceiverOutcomeInput input) | formaloutcome原intent/version/consumer/receiver/scope全matching | receiverbinding+relationoutcome+lateimpact责任 |
| Dispatching | Failed | RecordReceiverOutcome / settle(ReceiverOutcomeInput input) | 正式证明未提交失败 | 安全failure+原report，旧attempt终态 |
| Dispatching | CommitUnknown | DispatchDistribution / settle(ReceiverOutcomeInput input) | 外部timeout/原许可后crash可能commit | unknown+reconcile责任 |
| CommitUnknown | Confirmed | RecordReceiverOutcome / settle(ReceiverOutcomeInput input) | formalprobe/正式结果matching提交 | 保存原outcome及撤回后lateimpactdelta |
| CommitUnknown | Failed | RecordReceiverOutcome / settle(ReceiverOutcomeInput input) | formalprobe证明未提交失败 | 旧attemptterminal，允许当前gate下原intent新attempt |

#### 状态流转图

```text
Prepared --[DispatchDistribution]--> Dispatching
Prepared --[DispatchDistribution]--> Blocked
Dispatching --[RecordReceiverOutcome]--> Confirmed
Dispatching --[RecordReceiverOutcome]--> Failed
Dispatching --[DispatchDistribution]--> CommitUnknown
CommitUnknown --[RecordReceiverOutcome]--> Confirmed
CommitUnknown --[RecordReceiverOutcome]--> Failed
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- 旧Confirmed/Failed/Blocked attempt不能回Prepared；ReconcileDistribution确认未提交或Blocked未外发且currentgate后，DistributionAttempt.prepare创建新attempt，intent_ref不变。没有probe不能安全创建新attempt；重复matching结果只S不重复relation或通知。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### ImpactRecord 状态定义

owner=U5；carrier=ImpactRecord.coverage_kind。初始=Partial；终态=无不可逆终态，仍必须有正式trigger。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Partial | 已知范围枚举尚有本地cursor缺口 | 只允许下表本地动作 | 不推外部成功/授权 |
| KnownScopeComplete | 指定cursor内已知集合完整，late关系仍增量；非全安装覆盖 | 只允许下表本地动作 | 不推外部成功/授权 |

| 从/到 | Partial | KnownScopeComplete |
|---|---|---|
| Partial | S | A |
| KnownScopeComplete | A | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Partial | KnownScopeComplete | EnumerateKnownImpact / include(ImpactDeltaInput delta) | 固定disposition/sourcecursor范围内typed枚举完成，known/unknown集合去重 | 保存coveragecursor/audit/report，非全安装集合 |
| KnownScopeComplete | Partial | EnumerateKnownImpact / include(ImpactDeltaInput delta) | late relation或更高cursor形成新typed增量/缺口 | 增量影响与必要noticeplanning责任，不覆盖旧known集 |

#### 状态流转图

```text
Partial --[EnumerateKnownImpact]--> KnownScopeComplete
KnownScopeComplete --[EnumerateKnownImpact]--> Partial
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- KnownScopeComplete同姿态可纳入已知cursor内去重项；新late范围形成Partial再收束。RecordReceiverOutcome只schedule durable delta，Enumerate拥有ImpactRecord唯一writer。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### NoticeIntent 状态定义

owner=U5；carrier=NoticeIntent.state。初始=Prepared；终态=Confirmed。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Prepared | 通知计划成立，未发出 | 只允许下表本地动作 | 不推外部成功/授权 |
| Dispatching | 已持久发送许可，结果独立 | 只允许下表本地动作 | 不推外部成功/授权 |
| Confirmed | 匹配正式通道结果可查；是否送达由owner outcome说明 | 仅历史/终态读取 | 不推外部成功/授权 |
| Failed | 明确未提交失败，允许安全原意图重试 | 只允许下表本地动作 | 不推外部成功/授权 |
| CommitUnknown | 可能发送，不盲重试 | 只允许下表本地动作 | 不推外部成功/授权 |
| Blocked | 通道/目标/权限合同不具备 | 只允许下表本地动作 | 不推外部成功/授权 |

| 从/到 | Prepared | Dispatching | Confirmed | Failed | CommitUnknown | Blocked |
|---|---|---|---|---|---|---|
| Prepared | S | A | R | R | R | A |
| Dispatching | R | S | A | A | A | R |
| Confirmed | R | R | S | R | R | R |
| Failed | R | A | R | S | R | R |
| CommitUnknown | R | R | A | A | S | R |
| Blocked | R | A | R | R | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Prepared | Dispatching | DispatchNotice / begin(NoticeDispatchInput input) | 当前target/channelauthority+原intentfence，许可先持久 | 外部调用在SQL事务外 |
| Prepared | Blocked | DispatchNotice / block(ContractGapInput gap) | 未外发合同/权限不具备 | gap/audit/report，不复活version |
| Dispatching | Confirmed | RecordNoticeOutcome / settle(NoticeOutcomeInput input) | matching正式channel结果ref（不是ACK自填） | binding/audit/fullreport，送达意义owner说明 |
| Dispatching | Failed | RecordNoticeOutcome / settle(NoticeOutcomeInput input) | 正式已证明未提交失败 | 安全failure与同意图retry依据 |
| Dispatching | CommitUnknown | DispatchNotice / settle(NoticeOutcomeInput input) | 外部结果未知/许可后crash | unknown+原intentprobe责任 |
| CommitUnknown | Confirmed | RecordNoticeOutcome / settle(NoticeOutcomeInput input) | 原intentformalprobe matching结果 | 安全结果ref，非read/remediated |
| CommitUnknown | Failed | RecordNoticeOutcome / settle(NoticeOutcomeInput input) | formalprobe证明未提交失败 | 原failure，允许有据sameintent重试 |
| Failed | Dispatching | DispatchNotice / begin(NoticeDispatchInput input) | 明确未提交、currenttarget/channel、sameintent、新fence | 重试历史追加，不新notice意图 |
| Blocked | Dispatching | DispatchNotice / begin(NoticeDispatchInput input) | contract/authority补齐，typed证明未外发，同intent | 本地新许可后externaldispatch |

#### 状态流转图

```text
Prepared --[DispatchNotice]--> Dispatching
Prepared --[DispatchNotice]--> Blocked
Dispatching --[RecordNoticeOutcome]--> Confirmed
Dispatching --[RecordNoticeOutcome]--> Failed
Dispatching --[DispatchNotice]--> CommitUnknown
CommitUnknown --[RecordNoticeOutcome]--> Confirmed
CommitUnknown --[RecordNoticeOutcome]--> Failed
Failed --[DispatchNotice]--> Dispatching
Blocked --[DispatchNotice]--> Dispatching
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- Confirmed只formal通道结果已关联，不能把状态名翻译已送达。unknown不经Failed formalbasis不能直接Dispatching；通知所有状态与撤回生效无反向依赖。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### OperationRecord 状态定义

owner=U6；carrier=OperationRecord.state。初始=Reserved；终态=Completed。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Reserved | 本地预占未完成，竞争返回in-progress/reconcile | 只允许下表本地动作 | 不推外部成功/授权 |
| Completed | 原结果已保存，可typed重放，禁止重跑domain | 仅历史/终态读取 | 不推外部成功/授权 |

| 从/到 | Reserved | Completed |
|---|---|---|
| Reserved | S | A |
| Completed | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Reserved | Completed | 全部Command/Job flow / complete(StoredOperationResult result) | 原operation/scope/key/intent一致、complete原public安全result可读；sameUoW | domain或局部report+audit+result+requiredwork原子 |

#### 状态流转图

```text
Reserved --[全部Command/Job flow]--> Completed
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- Completed duplicate只typed保存原result读取；缺result/错kind完整性失败，不重跑domain。Reserved过期不能猜success，核对localcommit/原intent。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### DeferredWork 状态定义

owner=U6；carrier=DeferredWork.state。初始=Pending；终态=Settled。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Pending | 耐久责任未claim | 只允许下表本地动作 | 不推外部成功/授权 |
| Claimed | 已有worker/fence，进程崩溃不代表effect失败 | 只允许下表本地动作 | 不推外部成功/授权 |
| Settled | 本地结果/report持久化完成，非外部全局成功 | 仅历史/终态读取 | 不推外部成功/授权 |
| Blocked | 合同/unknown/人工依据阻塞；有据原意图恢复 | 只允许下表本地动作 | 不推外部成功/授权 |

| 从/到 | Pending | Claimed | Settled | Blocked |
|---|---|---|---|---|
| Pending | S | A | R | A |
| Claimed | R | A | A | A |
| Settled | R | R | S | R |
| Blocked | R | A | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Pending | Claimed | 各Dispatch/Reconcile/Refresh/Rebuild/Recovery Job / claim(WorkClaimInput input) | 当前worker正式范围、typed原target/intent、CASfence | 持久claim，不证明externalaccepted |
| Pending | Blocked | 各对应Job / block(ContractGapInput gap) | 缺contract/plan/权限，未派发 | 安全gap/fullreport |
| Claimed | Settled | 各对应Job / settle(WorkSettlementInput input) | 完整itemreport/result已存，无悬空本work责任；externalunknown若有后继责任必须已durable承接 | localsettlement，不外部全局成功 |
| Claimed | Blocked | 各对应Job / block(ContractGapInput gap) | externalunknown/probe缺失/typed来源缺口 | 保留原intent与对账责任，无自动retry |
| Blocked | Claimed | RunMarketRecovery及所属Job / claim(WorkClaimInput input) | 正式恢复依据/currentgate；原dispatch可能发生先probe，只有明确未发才send | 同intent新fence/追加历史 |
| Claimed | Claimed | 所属Reconcile Job / claim(WorkClaimInput input) | 旧lease失效且typedinspection决定probe-only；禁止第二dispatch许可 | CAS新claim只核对原effect |

#### 状态流转图

```text
Pending --[各Dispatch/Reconcile/Refresh/Rebuild/Recovery Job]--> Claimed
Pending --[各对应Job]--> Blocked
Claimed --[各对应Job]--> Settled
Claimed --[各对应Job]--> Blocked
Blocked --[RunMarketRecovery及所属Job]--> Claimed
Claimed --[所属Reconcile Job]--> Claimed
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- 工作state是local responsibility，Settled不代表externaldelivered。无正式contract启用时Blocked，不把worker技术lease过期当可重发。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### RecoveryIntent 状态定义

owner=U6；carrier=RecoveryIntent.state。初始=Requested；终态=Completed。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Requested | 恢复请求局部受理 | 只允许下表本地动作 | 不推外部成功/授权 |
| Running | 按原intent或qualified重建计划执行 | 只允许下表本地动作 | 不推外部成功/授权 |
| Completed | 本次本地report成立，不宣称业务恢复/ready | 仅历史/终态读取 | 不推外部成功/授权 |
| Blocked | 无probe/authority/typed输入，不盲修复 | 只允许下表本地动作 | 不推外部成功/授权 |

| 从/到 | Requested | Running | Completed | Blocked |
|---|---|---|---|---|
| Requested | S | A | R | A |
| Running | R | S | A | A |
| Completed | R | R | S | R |
| Blocked | R | A | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Requested | Running | RunMarketRecovery / begin(QualifiedRecoveryInput input) | currentoperatorauthority+typed目标/原intent检查 | localprogress/audit/report |
| Requested | Blocked | RunMarketRecovery / record(RecoveryOutcomeInput input) | 无qualifiedtyped输入/权限/probe正式basis | safegap/fullreport |
| Running | Completed | RunMarketRecovery / record(RecoveryOutcomeInput input) | 本次逐itemreport完整、local职责成立，不能压平unknown | reportref/audit/result，非业务ready |
| Running | Blocked | RunMarketRecovery / record(RecoveryOutcomeInput input) | 无probe/manualbasis或恢复结果无法证明 | 保留旧目标与缺口，不修owner |
| Blocked | Running | RunMarketRecovery / begin(QualifiedRecoveryInput input) | 正式依据补齐，仍原intent/currentgate | 追加恢复历史，原unknown先probe |

#### 状态流转图

```text
Requested --[RunMarketRecovery]--> Running
Requested --[RunMarketRecovery]--> Blocked
Running --[RunMarketRecovery]--> Completed
Running --[RunMarketRecovery]--> Blocked
Blocked --[RunMarketRecovery]--> Running
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- Completed不能原地重新Running；新恢复语境另RequestMarketRecovery。Completed的本次report可包含明确不可实现项，不能当核心业务success；未承接unknown责任保持Blocked。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### QualifiedReferenceSnapshot 状态定义

owner=U7；carrier=QualifiedReferenceSnapshot.state。初始=Qualified；终态=无不可逆终态，仍必须有正式trigger。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Qualified | 本次影子来源匹配，仍需当前authority资格 | 只允许下表本地动作 | 不推外部成功/授权 |
| Stale | 旧影子明确陈旧，敏感/资格不据此放行 | 只允许下表本地动作 | 不推外部成功/授权 |
| Unavailable | 无安全有效读取材料，返回缺口 | 只允许下表本地动作 | 不推外部成功/授权 |

| 从/到 | Qualified | Stale | Unavailable |
|---|---|---|---|
| Qualified | S | A | A |
| Stale | A | S | A |
| Unavailable | A | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Qualified | Stale | RefreshQualifiedReferences / mark_stale(SourceRefreshFailureInput input) | 正式刷新失败仍有旧安全合法摘要；typedfailure不可吞 | 旧切片+failuregap/report，禁positive资格 |
| Qualified | Unavailable | RefreshQualifiedReferences / mark_unavailable(SourceRefreshFailureInput input) | 当前不可见/不支持/无合法安全材料 | 保守no disclosure，不改业务truth |
| Stale | Qualified | RefreshQualifiedReferences / refresh(QualifiedSnapshotInput input) | formalresolver输出本体/type/version/validity完整且current可见 | shadowtyped替换、audit/report及必要projection责任 |
| Stale | Unavailable | RefreshQualifiedReferences / mark_unavailable(SourceRefreshFailureInput input) | 无安全oldmaterial或失去可见性 | explicitgap/no disclosure |
| Unavailable | Qualified | RefreshQualifiedReferences / refresh(QualifiedSnapshotInput input) | 本次formalqualifiedmaterial完整，exactconsumer/scope匹配 | shadow更新，不复活Restrictedversion |

#### 状态流转图

```text
Qualified --[RefreshQualifiedReferences]--> Stale
Qualified --[RefreshQualifiedReferences]--> Unavailable
Stale --[RefreshQualifiedReferences]--> Qualified
Stale --[RefreshQualifiedReferences]--> Unavailable
Unavailable --[RefreshQualifiedReferences]--> Qualified
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- Qualified同姿态刷新也必须formal输入；Unavailable无安全body，禁止仅state成功填空snapshot；typed状态与本体成对读取。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### ReadProjection 状态定义

owner=U7；carrier=ReadProjection.state。初始=Stale；终态=无不可逆终态，仍必须有正式trigger。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Fresh | 声明cursor内的派生切片，可见性仍当前校验 | 只允许下表本地动作 | 不推外部成功/授权 |
| Stale | 落后来源，不变成授权 | 只允许下表本地动作 | 不推外部成功/授权 |
| Rebuilding | 独立重建工作中，不暴露半成品 | 只允许下表本地动作 | 不推外部成功/授权 |
| Unavailable | 当前无合法派生读取，only声明安全fallback | 只允许下表本地动作 | 不推外部成功/授权 |

| 从/到 | Fresh | Stale | Rebuilding | Unavailable |
|---|---|---|---|---|
| Fresh | S | A | A | A |
| Stale | R | S | A | A |
| Rebuilding | A | A | S | A |
| Unavailable | R | R | A | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Fresh | Stale | RebuildMarketReadProjection / mark_stale(ProjectionInvalidationInput input) | 正式committedsourcecursor比projection更新，typedtarget匹配 | 只派生marker，不写business |
| Fresh | Rebuilding | RebuildMarketReadProjection / begin_rebuild(ProjectionRebuildPlanInput input) | kind/scope/typedview keys非空、committedfacts+qualifiedsnapshots完整固定cursor | 持久维护语境/不暴露shadow |
| Stale | Rebuilding | RebuildMarketReadProjection / begin_rebuild(ProjectionRebuildPlanInput input) | 正式typedplan非空且sourcebound | 安全新shadow |
| Unavailable | Rebuilding | RebuildMarketReadProjection / begin_rebuild(ProjectionRebuildPlanInput input) | 新合法plan/currentreadscope具备 | 显式重建不业务恢复 |
| Rebuilding | Fresh | RebuildMarketReadProjection / publish(ProjectionBuildOutcomeInput input) | 完整安全shadow与固定cursor，revision/CAS匹配；无partial掩盖 | 原子替换typedviews+sourcecursor+report |
| Rebuilding | Stale | RebuildMarketReadProjection / mark_stale(ProjectionInvalidationInput input) | 构建期间新committedcursor变化，typedinvalidationsource | 不发布旧shadow为Fresh；后续新scopeplan |
| Rebuilding | Unavailable | RebuildMarketReadProjection / mark_unavailable(ProjectionBuildFailureInput input) | 缺材料/失败/错scope/无safeoutput | gap+完整逐itemreport |
| Fresh | Unavailable | RebuildMarketReadProjection / mark_unavailable(ProjectionBuildFailureInput input) | currentdisclosure/sourceplan不具备合法read | 不泄漏旧缓存 |
| Stale | Unavailable | RebuildMarketReadProjection / mark_unavailable(ProjectionBuildFailureInput input) | plan缺失/空来源或safeview无法构造 | explicitgap，不能旧index修truth |

#### 状态流转图

```text
Fresh --[RebuildMarketReadProjection]--> Stale
Fresh --[RebuildMarketReadProjection]--> Rebuilding
Stale --[RebuildMarketReadProjection]--> Rebuilding
Unavailable --[RebuildMarketReadProjection]--> Rebuilding
Rebuilding --[RebuildMarketReadProjection]--> Fresh
Rebuilding --[RebuildMarketReadProjection]--> Stale
Rebuilding --[RebuildMarketReadProjection]--> Unavailable
Fresh --[RebuildMarketReadProjection]--> Unavailable
Stale --[RebuildMarketReadProjection]--> Unavailable
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- Fresh只固定cursor内派生可读，currentvisibility另核验。Query no statewrite/refresh；snapshot/source变化只造成维护责任与安全读降级，not owner撤销事件。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。


#### 状态传播图

```text
[Local command / job domain transition]
              |
              v
[One local UoW: changed carrier + audit + original result + required work]
              |
              +--> [U7 typed snapshots / derived shadow, eventual]
              |          |
              |          +--> [scope-safe query surface]
              |
              +--> [U6 durable claim / original external intent]
                         |
                         +--> [formal result / known-not-committed / unknown]
                                     |
                                     +--> [owning carrier + late-impact work]

[U3 Restricted / Withdrawn]
              |
              +--> [U4 new admission blocked; not-yet-permitted dispatch blocked]
              |
              +--> [U5 known / unknown / late relation enumeration]
                         |
                         +--> [notice responsibility, NOT uninstall or all users]
```

- 本地图表达变化后的责任传播，不是event family或跨owner事务。
- 当前0activecanonicalevent/outbox；外部结果只是qualified正式回指，不能使其他owner状态由市场改写。
- U7恢复只影子；通知/审计重试不从Withdrawn回Listed，source恢复亦不自动解除Restricted。

### 跨状态机审计

| 组合 | 一致性要求 | 非法组合处理 |
|---|---|---|
| Submitted + basis/review missing | 固定申请与sidecar同事务 | 完整性缺口，禁止交接/上架；query安全degraded |
| MatchedDecision + nonapproved/invalid binding | Review进度可查但不构成Listing准入 | List/Request/Dispatch新positive拒绝或blocked |
| Listed + currentowner/authority不明 | 局部state不自证获取资格 | 当前gate拒绝；正式局部限制命令可Restrict |
| Withdrawn + newRequest/未许可dispatch | 同versionserialization必须拒绝 | 不accepted/不新派发许可；既有externalunknown继续probe |
| Cancelled + Confirmed/CommitUnknown attempt | 两轴可以并存 | 不捏造外部cancel，lateformalresult保留并纳knownimpact |
| Completed Operation + missing/wrongresultkind | typed原完整result不可缺 | 完整性失败，不重跑domain造第二关系 |
| Settled work + dangling responsibility | 所有剩余unknown/派生责任应有后继durable承接 | 不能Settled，保存Blocked/责任缺口 |
| Fresh projection + unknowndisclosure | 当前resolver仍须证明可见交集 | 不暴露目录/计数/提示，不从fresh推资格 |

复杂度：七部分各自初始/终态/矩阵/trigger/typed参数/传播反查pass；14/14carrier与49接口闭环，无GlobalState和外部审批/安装/财务状态。完整schema/错误码/codec和SQL并发仍由03承接，不把本概要自检作为runtime证明。

## 8. 回填草稿

正式§9仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。14carrier/七部分全矩阵检查、状态与Step7/8trigger一致；条件字段回修不增scope。 外部资格不关闭，允许进入Step 10。

### 条件字段反查修复记录

发现并回修Step6：SourceVerification Pending/Blocked可缺source_binding/outcome；PublicationApplication Draft可缺formalbasis/review但需持久draft_spec；ReviewHandoff与NoticeIntent失败/unknown必须安全failure/dispatch回指。Step7/8 Draft结果已同步，Submitted仍严格固定qualifiedbasis，未新增authority/API。该反查使初始/失败态可表达，不宣称实现schema已完成。
