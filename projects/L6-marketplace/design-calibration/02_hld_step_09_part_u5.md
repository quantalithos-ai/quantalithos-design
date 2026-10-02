# Step9 U5 状态小循环

## 筛选、问题、诊断与取舍

影响维护不是全安装用户truth；通知失效/unknown不重开市场版本。SharedU3versionstate已定义，不重复在U5造enum。

计划：carrier筛选→状态意义→trigger来源→全矩阵/diagram→传播→回填/停审；矩阵尚未落盘。

## 结构化状态与回填

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

## 排除与停审

本部分pure refs/basis/outcomebinding/policy/view无独立生命周期；只读ReadSurfaceKind是query结果分支，不是后台可写business machine。类别/metadata的revision变更不是新lifecycle。stateenum随carrier唯一拥有，不新增外部truth state。每A有Step7/8trigger和Step6成员/typed来源，R穷举非法pair；正式§9摘录。U5 internal stop_review/pass。
