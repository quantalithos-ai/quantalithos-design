# Step 6. 关键对象轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 6
> 回填章节: `02-概要设计.md` §6 关键对象轮廓
> 生成日期: 2026-06-05
> 状态: 已完成

---

## 1. 本步目标

从 Step 5 的对象候选池中筛出概要设计必须点名的关键对象,并给出对象类型、所属组成部分、关键字段骨架、状态候选、成员函数骨架、工厂函数骨架和禁止事项。

本步不写完整 Rust struct、完整 enum、DTO schema、repository trait、数据库表、索引、事件 payload 或事务细节。字段和函数只停在概要设计骨架层,后续 `03-详细设计.md` 必须在此基础上收敛正式对象契约。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成 | 提供 truth / snapshot / reference / derived / forbidden body 归类门禁 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体骨架和实现分层 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供对象候选池和主要组成部分归属 |
| `00-需求文档.md` §10 / §11 | 已完成 | 提供业务规则、数据归属和审计红线 |
| `01-架构设计.md` §8 / §9 / §10 | 已完成 | 提供依赖方向、一致性和通信分层 |

---

## 3. 对象候选池筛选说明

### 3.1 正式进入 Step 6 的关键对象

| 对象类别 | 正式关键对象 | 展开位置 |
|---|---|---|
| Truth / State | `RuntimeProcessShape`、`ProcessProfile`、`ProcessInstance`、`Activity`、`Token`、`Gateway`、`WaitingGate`、`PauseContext`、`ProcessCheckpoint`、`RecoveryAttempt`、`ProcessStageState`、`ProcessTimeboxBinding`、`DerivedProcessViewState`、`ReferenceResolutionState` | `02_hld_step_06_key_objects_truth_execution.md`、`02_hld_step_06_key_objects_gate_recovery_timing.md` |
| Policy / Guard | `ProcessTruthPolicy`、`ShapeDefinitionPolicy`、`ProfileTailoringPolicy`、`InstanceProgressionPolicy`、`ActivityFeedbackPolicy`、`GatewayRoutingPolicy`、`WaitingGatePolicy`、`RecoveryContinuityPolicy`、`ProcessRhythmPolicy`、`ReadVisibilityPolicy`、`DerivedProcessViewPolicy` | `02_hld_step_06_key_objects_policies.md` |
| Projection / Read model | `ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary`、`ActivityStatusView`、`ReconciliationReport` | `02_hld_step_06_key_objects_projections.md` |
| Reference / Snapshot | `MethodDefinitionSnapshot`、`WorkContextSnapshot`、`ActorCapabilitySnapshot`、`GovernanceDecisionRef`、`RuntimeFeedbackRef`、`ConversationContextRef`、`TraceHandoffRef` | `02_hld_step_06_key_objects_references_audit.md` |
| Audit / History / Outbox | `ProcessTraceRecord`、`ProcessAuditTrail`、`ProcessOutboxRecord`、`ProfileChangeRecord`、`ActivityProgressionRecord`、`WaitingGateChangeRecord`、`RecoveryHistoryRecord` | `02_hld_step_06_key_objects_references_audit.md` |

### 3.2 不作为关键对象展开的名称

| 名称类别 | 示例 | 处理口径 |
|---|---|---|
| API / DTO / request / result | start instance request、resume gate request、process read model response | 留给 Step 7 和详细设计 |
| Repository / port / adapter | `ProcessInstanceRepository`、`MethodDefinitionPort`、`ProcessOutboxRepository` | 留给 Step 7 接口骨架和详细设计 |
| Inbound / job / trigger | command intake、event intake、projection rebuild job、recovery maintenance job | 留给 Step 7 / Step 8 / operations 设计 |
| 数据库 / 投影实现 | table、index、materialized view、search backend、state store product | 不进入概要对象轮廓 |
| 外部正文对象 | ProcessTemplateDef 正文、WorkItem 正文、decision 正文、runtime log、archive package | 只允许引用、摘要或快照,不得成为 Process truth |

---

## 4. 关键对象与主要组成部分分布

| 主要组成部分 | 关键对象 |
|---|---|
| `Process truth core` | `ProcessTruthPolicy`、`ProcessAuditTrail`、`ProcessOutboxRecord` |
| `Runtime shape management` | `RuntimeProcessShape`、`ShapeDefinitionPolicy`、`MethodDefinitionSnapshot` |
| `Profile adoption management` | `ProcessProfile`、`ProfileTailoringPolicy`、`ProfileChangeRecord` |
| `Process execution management` | `ProcessInstance`、`Activity`、`Token`、`Gateway`、`InstanceProgressionPolicy`、`ActivityFeedbackPolicy`、`GatewayRoutingPolicy`、`ActivityStatusView`、`ActivityProgressionRecord` |
| `Gate coordination` | `WaitingGate`、`PauseContext`、`WaitingGatePolicy`、`GovernanceDecisionRef`、`WaitingGateChangeRecord` |
| `Checkpoint and recovery` | `ProcessCheckpoint`、`RecoveryAttempt`、`RecoveryContinuityPolicy`、`RecoveryHistoryRecord` |
| `Process timing and rhythm` | `ProcessStageState`、`ProcessTimeboxBinding`、`ProcessRhythmPolicy` |
| `Process consumption and traceability` | `ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary`、`ReadVisibilityPolicy`、`TraceHandoffRef`、`ProcessTraceRecord` |
| `Derived maintenance and reconciliation` | `DerivedProcessViewState`、`DerivedProcessViewPolicy`、`ReconciliationReport` |
| `External context mirror support` | `ReferenceResolutionState`、`WorkContextSnapshot`、`ActorCapabilitySnapshot`、`RuntimeFeedbackRef`、`ConversationContextRef` |

---

## 5. 对象展开文件

本步对象数量较多。为满足“每个关键对象独立成节”和“中间产物可维护”的要求,本步拆成主控文件和五个对象附录:

| 文件 | 内容 |
|---|---|
| `02_hld_step_06_key_objects.md` | 筛选说明、对象分布、反查清单、回填口径 |
| `02_hld_step_06_key_objects_truth_execution.md` | RuntimeProcessShape、ProcessProfile、ProcessInstance、Activity、Token、Gateway 骨架 |
| `02_hld_step_06_key_objects_gate_recovery_timing.md` | WaitingGate、PauseContext、ProcessCheckpoint、RecoveryAttempt、ProcessStageState、ProcessTimeboxBinding、DerivedProcessViewState、ReferenceResolutionState 骨架 |
| `02_hld_step_06_key_objects_policies.md` | policy / guard 对象骨架 |
| `02_hld_step_06_key_objects_projections.md` | projection / read model / report 对象骨架 |
| `02_hld_step_06_key_objects_references_audit.md` | reference、snapshot、audit、history、outbox 对象骨架 |

六个文件共同构成 Step 6 的完整产物。正式 `02-概要设计.md` 后续只摘录主表和必要对象摘要,不把全部附录机械粘贴。

---

## 6. Step 8 / Step 9 反查清单

### 6.1 关键处理流反查

| 预计处理流 | 必须能反查到的对象 |
|---|---|
| runtime shape 同步 / 重建 | `RuntimeProcessShape`、`ShapeDefinitionPolicy`、`MethodDefinitionSnapshot`、`ProcessOutboxRecord` |
| profile adopt / switch | `ProcessProfile`、`ProfileTailoringPolicy`、`ProfileChangeRecord`、`ProcessAuditTrail` |
| process instance start / pause / resume / close | `ProcessInstance`、`InstanceProgressionPolicy`、`ProcessTraceRecord`、`ProcessOutboxRecord` |
| Activity feedback / progression | `Activity`、`Token`、`Gateway`、`ActivityFeedbackPolicy`、`GatewayRoutingPolicy`、`ActivityProgressionRecord` |
| waiting gate 建立 / resume | `WaitingGate`、`PauseContext`、`WaitingGatePolicy`、`GovernanceDecisionRef`、`WaitingGateChangeRecord` |
| checkpoint / recovery | `ProcessCheckpoint`、`RecoveryAttempt`、`RecoveryContinuityPolicy`、`RecoveryHistoryRecord` |
| process timing / rhythm 维护 | `ProcessStageState`、`ProcessTimeboxBinding`、`ProcessRhythmPolicy`、`WorkContextSnapshot` |
| 授权查询 / timeline / summary | `ProcessReadModel`、`ProcessTimelineView`、`ProcessProgressSummary`、`ReadVisibilityPolicy` |
| trace / observability / archive handoff | `ProcessTraceRecord`、`TraceHandoffRef`、`ProcessAuditTrail`、`ProcessOutboxRecord` |
| projection rebuild / reconciliation | `DerivedProcessViewState`、`DerivedProcessViewPolicy`、`ReconciliationReport`、`ReferenceResolutionState` |
| 外部上下文快照刷新 | `ReferenceResolutionState`、`MethodDefinitionSnapshot`、`WorkContextSnapshot`、`ActorCapabilitySnapshot`、`RuntimeFeedbackRef`、`ConversationContextRef` |

### 6.2 状态机反查

| 状态主题 | Step 6 对象来源 |
|---|---|
| runtime shape lifecycle / validity | `RuntimeProcessShape` |
| profile lifecycle / adoption | `ProcessProfile` |
| instance lifecycle | `ProcessInstance` |
| activity lifecycle / feedback | `Activity` |
| token / gateway flow position | `Token`、`Gateway` |
| waiting gate / pause context | `WaitingGate`、`PauseContext` |
| checkpoint / recovery continuity | `ProcessCheckpoint`、`RecoveryAttempt` |
| timing / rhythm state | `ProcessStageState`、`ProcessTimeboxBinding` |
| derived freshness / rebuild | `DerivedProcessViewState` |
| reference resolution | `ReferenceResolutionState` |
| outbox publication / handoff | `ProcessOutboxRecord`、`ProcessTraceRecord` |

---

## 7. 本步设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否把 `ProcessInstanceRepository` 等接口当对象展开 | 不展开 | repository / port 属于 Step 7 和详细设计 |
| 是否把所有 ID / Ref 都独立成节 | 不展开 | 普通 ID / Ref 作为字段类型出现;只有带边界语义的 ref / snapshot 独立展开 |
| 是否把外部仓对象正文纳入 Process 对象 | 不纳入 | 只保存引用、摘要、快照和解析状态 |
| 是否把 projection 视为 truth | 不视为 truth | projection 只能只读、可重建、可过期 |
| 是否提前锁定完整状态矩阵 | 不锁定 | 本步只给状态候选与语义边界,正式迁移规则由 Step 9 和详细设计收敛 |

---

## 8. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| Template / Profile / Instance / Activity 作为教学解释散落出现 | 缺少对象类型、归属和禁止事项 | 改为逐对象骨架和主要组成部分回指 |
| planning / review / gate entry 作为节奏节点解释 | 容易暗示 Process 拥有 Work Iteration 或 Governance decision truth | 改为 `ProcessStageState`、`ProcessTimeboxBinding`、`WaitingGate` 和外部 ref 边界 |
| checkpoint / recovery 与 runtime checkpoint 混写 | 容易保存 runtime 微步或形成第二份过程真相 | 改为 `ProcessCheckpoint`、`RecoveryAttempt` 和 `RecoveryContinuityPolicy` |
| timeline / trace / summary 混入核心对象 | 派生结构可能成为第二 truth | 改为 read model / projection / trace record,明确只读或追溯 |
| 外部上下文对象直接进入 Process 叙事 | 容易打穿正文排除和依赖裁剪 | 改为 snapshot / reference / marker 对象 |

---

## 9. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §6 “关键对象轮廓”引用本文件 §3.1 的对象筛选表和 §4 的分布表。
- §6 对核心 truth 对象摘录 `RuntimeProcessShape`、`ProcessProfile`、`ProcessInstance`、`Activity`、`Token`、`Gateway`、`WaitingGate`、`PauseContext`、`ProcessCheckpoint`、`RecoveryAttempt`、`ProcessStageState`、`ProcessTimeboxBinding`。
- §6 对辅助对象摘录 policy、projection、reference、audit / outbox 的对象组摘要,详细骨架保留在 Step 6 附录文件。
- Step 8 和 Step 9 必须使用 §6 的反查清单,不能引入 Step 6 未点名的新正式对象。

---

## 10. 进入下一步条件

- 已从 Step 5 对象候选池完成对象正式化筛选。
- 已明确正式关键对象、字段类型骨架、状态候选、函数骨架、工厂骨架和禁止事项的承载文件。
- 已排除 API、repository、port、trigger、DTO、数据库表和外部正文对象。
- Step 8 / Step 9 预计使用的对象均可反查到 Step 6。
- 可以进入 Step 7 “API / 接口骨架”。
