# Step9 U3 状态小循环

## 筛选、问题、诊断与取舍

listing/category只有metadata revision不是独立lifecycle；版本状态决定可受理范围，Listed仍不使currentgate自动成功。

计划：carrier筛选→状态意义→trigger来源→全矩阵/diagram→传播→回填/停审；矩阵尚未落盘。

## 结构化状态与回填

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

## 排除与停审

本部分pure refs/basis/outcomebinding/policy/view无独立生命周期；只读ReadSurfaceKind是query结果分支，不是后台可写business machine。类别/metadata的revision变更不是新lifecycle。stateenum随carrier唯一拥有，不新增外部truth state。每A有Step7/8trigger和Step6成员/typed来源，R穷举非法pair；正式§9摘录。U3 internal stop_review/pass。
