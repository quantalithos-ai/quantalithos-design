# Step9 U6 状态小循环

## 筛选、问题、诊断与取舍

Operation replay/result/work与业务成功分轴。单一audit是immutable appendrecord；StoredOperationResult/OperationContext/ObservationBinding不state。Job技术claim的重入只有probe-only不blind dispatch。

计划：carrier筛选→状态意义→trigger来源→全矩阵/diagram→传播→回填/停审；矩阵尚未落盘。

## 结构化状态与回填

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
| Completed | 本次本地report成立，不宣称业务恢复/ready | 只允许下表本地动作 | 不推外部成功/授权 |
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

## 排除与停审

本部分pure refs/basis/outcomebinding/policy/view无独立生命周期；只读ReadSurfaceKind是query结果分支，不是后台可写business machine。类别/metadata的revision变更不是新lifecycle。stateenum随carrier唯一拥有，不新增外部truth state。每A有Step7/8trigger和Step6成员/typed来源，R穷举非法pair；正式§9摘录。U6 internal stop_review/pass。
