# Step9 U4 状态小循环

## 筛选、问题、诊断与取舍

分发intent/attempt/result分轴；旧attempt终态意味着需新attempt不新intent，取消不会抹外部结果。

计划：carrier筛选→状态意义→trigger来源→全矩阵/diagram→传播→回填/停审；矩阵尚未落盘。

## 结构化状态与回填

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

## 排除与停审

本部分pure refs/basis/outcomebinding/policy/view无独立生命周期；只读ReadSurfaceKind是query结果分支，不是后台可写business machine。类别/metadata的revision变更不是新lifecycle。stateenum随carrier唯一拥有，不新增外部truth state。每A有Step7/8trigger和Step6成员/typed来源，R穷举非法pair；正式§9摘录。U4 internal stop_review/pass。
