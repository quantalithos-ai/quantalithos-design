# Step9 U2 状态小循环

## 筛选、问题、诊断与取舍

Review没有全局Approved；pending/claimed可能已外发必须probe，Job对Failed/ContractBlocked只已证明未提交才原意图再发。

计划：carrier筛选→状态意义→trigger来源→全矩阵/diagram→传播→回填/停审；矩阵尚未落盘。

## 结构化状态与回填

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

## 排除与停审

本部分pure refs/basis/outcomebinding/policy/view无独立生命周期；只读ReadSurfaceKind是query结果分支，不是后台可写business machine。类别/metadata的revision变更不是新lifecycle。stateenum随carrier唯一拥有，不新增外部truth state。每A有Step7/8trigger和Step6成员/typed来源，R穷举非法pair；正式§9摘录。U2 internal stop_review/pass。
