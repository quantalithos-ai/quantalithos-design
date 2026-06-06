# Step 10. 异常与边界场景轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 10
> 回填章节: `02-概要设计.md` §10 异常与边界场景
> 生成日期: 2026-06-05
> 状态: 已完成

---

## 1. 本步目标

点名 `L1-process` 必须在概要设计层先讲清楚的异常路径与边界场景,说明它们如何影响主要组成部分、接口、处理流和状态机。

本步不写完整错误码表、重试参数、补偿脚本、事务隔离、repository 约束、恢复脚本或具体 adapter 失败实现。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 command / query / consumer / job 的正常处理流 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供异常必须落入的状态集合 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供正文排除、边界不可越过和失败显式约束 |
| `00_req_step_10_business_rules_boundaries.md` | 已完成 | 提供业务规则、禁止行为和显式变化要求 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供强一致、最终一致、引用有效性和挂起口径 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步、异步、后台边界和失败降级方式 |

---

## 3. 异常与边界场景表

| 场景 | 应落在哪个部分处理 | 影响的处理流 / 状态 | 当前概要口径 |
|---|---|---|---|
| Command 缺少 actor / metadata / idempotency key 或重复 key 冲突 | Command intake / application service | 所有 command 写路径 | 缺失直接拒绝;同 key 同 digest 返回既有 result;同 key 不同 digest 进入 conflict,不得进入 truth 写路径 |
| Method definition 来源不可解析、版本过期或不是 process shape 来源 | Runtime shape management / external context mirror support | `SyncRuntimeProcessShape`;`RuntimeShapeState`;`ReferenceResolutionState` | 标记 `Unresolved` / `Stale` / `Invalid`,不得自造 runtime shape 或保存 definition body |
| Active / Retired runtime shape 被用于普通 profile adoption | Profile adoption management / `ShapeDefinitionPolicy` | `AdoptProcessProfile`;`ProcessProfileState` | Stale 需要显式接受或重新同步;Retired / Invalid 不得成为普通采用来源 |
| profile tailoring 试图移除强制 gate 或高风险过程规矩且无正式依据 | Profile adoption management / governance seam | `UpdateProcessProfileTailoring`;`ProcessProfileState` | 拒绝或挂起;不得由 Process 自行发明治理结论 |
| project / work context 不存在、不可见或与 profile 不匹配 | Profile / instance command service / work context snapshot | `AdoptProcessProfile`;`StartProcessInstance`;`ReferenceResolutionState` | 返回拒绝、unresolved 或 not visible;不得创建孤儿 ProcessProfile / ProcessInstance |
| 外部 work timebox / iteration 变化与本地 binding 不一致 | Process timing and rhythm / external context mirror support | `BindProcessTimebox`;`UpdateProcessStageState`;`TimeboxBindingState` | 标记 `Stale` / `Invalid`;不得迁移 Work Iteration truth 或静默改变承诺范围 |
| ProcessInstance 不在可推进状态 | Process execution management / `InstanceProgressionPolicy` | `AdvanceProcessActivity`;`OpenWaitingGate`;`ResumeWaitingGate`;`ProcessInstanceState` | 明确拒绝或保持原状态;不得从终态普通回到 Running |
| Activity / Token / Gateway 当前位点与 expected position 不一致 | Process execution management / progression policy | `AdvanceProcessActivity`;`ActivityState`;`TokenState`;`GatewayRoutingState` | 拒绝或标记冲突;不得产生第二当前位置或重复 progression record |
| runtime feedback 未解析、重复、乱序或不匹配当前 Activity | Event consumer + Activity feedback policy | `ConsumeRuntimeActivityFeedback`;`RecordActivityFeedback`;`ActivityState`;`ReferenceResolutionState` | consumer 只能写 pending / unresolved marker;正式绑定和完成必须走 command / policy |
| runtime feedback 携带 execution log、tool call 或 reasoning body | Inbound event consumer / source adapter | runtime feedback consumer | 拒绝正文入仓或只保留 ref / digest / summary;不得保存 runtime 正文 |
| governance decision 不存在、不可见、不是恢复依据或与 gate requirement 不匹配 | Gate coordination / governance seam | `ConsumeGovernanceDecisionChanged`;`ResumeWaitingGate`;`WaitingGateState` | consumer 只能标记依据可用或 unresolved;resume command 不满足时拒绝并保持 Waiting |
| WaitingGate 已恢复、取消或过期后再次 resume | Gate coordination / `WaitingGatePolicy` | `ResumeWaitingGate`;`WaitingGateState` | 返回不可迁移或 existing result;不得重复推进 Token |
| checkpoint 已过期、无效、被 supersede 或不属于同一 ProcessInstance | Checkpoint and recovery / `RecoveryContinuityPolicy` | `StartRecoveryAttempt`;`RecoveryAttemptState`;`CheckpointState` | 拒绝或保持 recovery pending / failed;不得从 checkpoint 创建第二份 ProcessInstance |
| RecoveryAttempt 失败、重复或依据不足 | Checkpoint and recovery / recovery maintenance | `CompleteRecoveryAttempt`;`MaintainRecoveryAttempts`;`RecoveryAttemptState` | 记录 failed / abandoned / pending marker;不得覆盖 checkpoint truth 或跳过同一实例连续性 |
| Query 无权限、引用不可见、projection stale 或 read model disabled | Query handler / ReadVisibilityPolicy / derived view | 所有 query;`DerivedProcessViewState`;`ReferenceResolutionState` | 返回 not visible、stale、degraded、unavailable 或 missing surface;不得触发 truth 写入 |
| Inbound event duplicate、乱序、source version regression 或来源不可识别 | Event intake / dedup / external context mirror support | 所有 consumer | dedup 后忽略或返回 existing receipt;乱序挂起或拒绝回退;不得产生重复 Process truth |
| 外部快照刷新失败或来源短暂不可用 | External context mirror support / refresh job | `RefreshExternalContextSnapshots`;`ReferenceResolutionState` | 保留旧快照并标记 `Stale` / `Unavailable` / `Unresolved`;不得补写外部 truth |
| projection rebuild 失败或 truth / projection 漂移 | Derived maintenance and reconciliation | `RebuildProcessProjections`;`RunProcessReconciliation`;`DerivedProcessViewState` | 派生进入 `Failed` / `Stale`;对账报告暴露漂移,不得修业务 truth |
| outbox 发布失败或下游不可达 | Process truth core / publish job | `PublishProcessOutbox`;`OutboxPublicationState` | outbox 进入 `RetryPending` / `Failed`;已成立 Process truth 不回滚 |
| trace handoff / archive handoff 失败 | Process consumption and traceability / handoff job | `PrepareProcessTraceHandoff`;`PrepareProcessArchiveHandoff`;`TraceHandoffState` | 记录 `Failed` / retryable marker;不得保存 observability / archive 正文,不得回滚 Process truth |
| 关键 truth 变化无法生成 trace / audit / outbox intent | Process truth core | 所有核心写路径 | 写路径不得成功完成;可追溯和传播意图是核心成立条件 |
| 配置或运维触发试图绕过同步 / 异步 / 后台分工 | Runtime assembly / operations guard | job / maintenance entry | 拒绝或不启用该入口;配置不得让维护任务反写真相 |

---

## 4. 异常影响图

#### 异常影响图

```text
+====================== Process exception boundary =================+
| command / query / inbound event / job                              |
|        |                                                           |
|        +-- boundary violation / invalid input --> reject / conflict |
|        |                                                           |
|        +-- external source missing / stale --> unresolved / stale   |
|        |                                                           |
|        +-- core truth accepted --> trace + audit + outbox + stale   |
|        |                                                           |
|        +-- derived / reference failure --> stale / failed marker    |
|        |                                                           |
|        +-- publish / handoff failure --> retry pending / failed     |
+===================================================================+
```

关键说明:

- 图表达异常应落到拒绝、冲突、pending、unresolved、stale、failed 或 retryable 状态,而不是被伪装成成功 truth。
- 核心 truth 只有在 domain policy、trace / audit 和 outbox intent 同步成立时才算写路径成功。
- 派生、引用、发布和 handoff 异常只影响消费、解释、传播或交接可见性,不得回滚或修正核心业务事实。
- 本图不表达错误码、重试参数、补偿脚本、事务隔离或 adapter 失败枚举。

---

## 5. 异常与状态关系

| 异常类型 | 允许落点状态 / surface | 不允许落点 |
|---|---|---|
| Command 输入缺失或幂等冲突 | rejected / conflict / existing result | 不允许产生新的 Process truth |
| method definition 不可用 | `ReferenceResolutionState::Unresolved` / `Unavailable`;`RuntimeShapeState::Stale` / `Invalid` | 不允许保存 method definition body 或自造 shape |
| profile / instance 前置条件不成立 | command rejected / original state retained | 不允许建立孤儿 profile / instance |
| 运行位点冲突 | command conflict / original `Activity`、`Token`、`Gateway` state retained | 不允许产生第二当前位置 |
| runtime feedback 未解析 | pending feedback marker;`ReferenceResolutionState::Unresolved` | 不允许直接 `Activity::Completed` |
| governance decision 不匹配 | `WaitingGateState::Waiting` retained;decision marker unresolved | 不允许自动 `Resumed` |
| checkpoint / recovery 不连续 | `RecoveryAttemptState::Failed` / `Abandoned`;checkpoint retained | 不允许创建第二份 ProcessInstance |
| Query 不可见或 projection stale | not visible / stale / degraded / unavailable view | 不允许写入或修复 truth |
| external snapshot refresh 失败 | `ReferenceResolutionState::Stale` / `Unavailable` | 不允许补写外部 truth |
| projection rebuild 失败 | `DerivedProcessViewState::Failed` / `Stale` | 不允许反写核心 truth |
| outbox publish 失败 | `OutboxPublicationState::RetryPending` / `Failed` | 不允许回滚已成立 truth |
| handoff 失败 | `TraceHandoffState::Failed` | 不允许保存外部正文或回滚 truth |

---

## 6. 不在本步展开的内容

| 内容 | 后续归属 |
|---|---|
| 具体错误 enum、错误码、HTTP / RPC 映射和 message 文案 | `03-详细设计.md` / 协议契约 / 测试方案 |
| 幂等 key 格式、dedup storage、sequence cursor 和事务锁 | 详细设计 |
| 重试次数、退避、dead letter、consumer group 和调度参数 | 详细设计 / 配置设计 |
| repository 唯一约束、索引、隔离级别和 rollback 细节 | 详细设计 |
| 具体补偿脚本、恢复 job、运维 runbook 和证据文件格式 | 详细设计 / 测试方案 / 实施计划 |
| 鉴权矩阵、可见性策略字段和授权 adapter 实现 | 详细设计,并对齐 identity / conversation / governance 边界 |

---

## 7. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 过程模板 / profile / instance 叙事偏正常路径 | 异常时容易把来源过期、采用失败、实例冲突写成隐式成功 | 明确 reject / unresolved / stale / conflict 落点 |
| checkpoint 与 recovery 写得像通用恢复能力 | 容易恢复出第二份 Process truth | 明确 checkpoint 必须属于同一实例,recovery 不可分叉 |
| waiting gate 与治理决策关系不够硬 | 容易外部 decision 事件直接恢复 gate | 明确 event 只能标记依据,显式 resume 才能迁移 |
| runtime feedback 与 Activity 完成关系不够硬 | 容易 runtime event 直接完成 Activity | 明确 pending marker 和 command / policy 绑定边界 |
| projection / report / outbox / handoff 异常混在维护叙事 | 容易维护任务反写真相或回滚 truth | 明确辅助失败只影响消费、传播和交接状态 |

---

## 8. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §10 “异常与边界场景”引用本文件 §3 的异常与边界场景表。
- §10 摘录 §4 的异常影响图和 §5 的异常 / 状态关系表。
- §10 明确错误码、重试、事务、锁、补偿和运维实现后移详细设计、配置设计、测试方案和实施计划。

---

## 9. 进入下一步条件

- 已点名会打穿 Process truth、外部正文边界、等待恢复边界、runtime feedback 边界、派生只读边界和传播 / handoff 边界的关键异常。
- 已说明异常如何影响处理流、状态机和跨部分协作。
- 已区分核心 truth 异常、外部引用异常、派生异常、outbox / handoff 异常。
- 未展开完整错误码、重试参数、事务隔离或补偿实现。
- 可以进入 Step 11 “配置影响轮廓”。
