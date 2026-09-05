# Step 9 附录 CP01. Presence and Host Collaboration 状态机

> 主控文件: `02_hld_step_09_state_machine.md`
> 对应对象: Step 6 CP01 的 `StartupAdmission`、`MemberPresence`、`HostCollaborationAttempt`
> 对应接口 / 流: Step 7 CP01 与 Step 8 CP01
> 状态: completed / pass / stop_review

## 1. 状态归属、问题回答与边界

CP01 有三个正式状态主体：`StartupAdmissionDisposition`、`MemberPresenceStatus` 和 `HostCollaborationAttemptStatus`。`HostCollaborationMaterial` 是 immutable material，`PresenceAdmissionPolicy` 是 guard，二者均不形成可变业务状态。它们不能被压平为“member ready”或“host available”。

| 对象 / 状态类型 | 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|---|
| `StartupAdmissionDisposition` | `accepted` | 项目主语、身份锚、启动语境和必要验证可证明；允许建立本地 presence。 | 是，仅允许 `EstablishMemberPresence` | `AdmitMemberStartup` / Step 8 §2 |
| `StartupAdmissionDisposition` | `rejected` | 主语、scope 或输入已知不合法；本次 admission 终止。 | 否 | `AdmitMemberStartup` / Step 8 §2 |
| `StartupAdmissionDisposition` | `blocked` | 关键 source、credential 或 exact contract 不可证明；fail closed。 | 否，等待新的正式 basis 形成新决定 | `AdmitMemberStartup` / Step 8 §2 |
| `MemberPresenceStatus` | `starting` | accepted admission 已建立，本地 presence 尚在显式准备。 | 受限；不可把它当 host / Runtime ready | `EstablishMemberPresence` / Step 8 §3 |
| `MemberPresenceStatus` | `ready` | 本地 member 前置满足，可以按 scope 接受后续交互。 | 是；仅是 member local ready | `TransitionMemberPresence` / Step 8 §4 |
| `MemberPresenceStatus` | `degraded` | 可解释的本地协作降级；必须带 safe reason。 | 受限；后续 flow 仍按各自 guard 判断 | `TransitionMemberPresence` / Step 8 §4 |
| `MemberPresenceStatus` | `draining` | 已显式停止接收新交互，正在完成本地退出语义。 | 否，不能建立新的入站主线 | `TransitionMemberPresence` / Step 8 §4 |
| `MemberPresenceStatus` | `terminated` | 本地 presence 已显式终止，历史保留。 | 否，终态 | `TransitionMemberPresence` / Step 8 §4 |
| `MemberPresenceStatus` | `unknown` | 当前本地在场姿态无法证明；必须 fenced。 | 否，等待正式 local basis | `TransitionMemberPresence` / Step 8 §4 |
| `HostCollaborationAttemptStatus` | `prepared` | 本地 material 与 attempt 已提交，尚未调用 host seam。 | 是，仅可进入明确 continuation 评估 | `PrepareHostCollaboration` / Step 8 §5 |
| `HostCollaborationAttemptStatus` | `submitted` | 已调用 host seam；不表示 host accepted、session 或 health。 | 受限；等待 feedback / resolution | host continuation after Step 8 §5 |
| `HostCollaborationAttemptStatus` | `feedback_linked` | 已关联正式 host feedback ref；只表示 ref 可回链。 | 受限；不得解释为 external success | `HostFeedbackConsumer` / Step 8 §6 |
| `HostCollaborationAttemptStatus` | `blocked` | route、contract、前置或 local continuation 不成立，未形成正向调用。 | 否，等待新 basis / successor attempt | `PrepareHostCollaboration` / Step 8 §5 |
| `HostCollaborationAttemptStatus` | `unknown` | host side effect 无法确认；必须阻止盲重放。 | 否，等待 idempotency / resolution evidence | host continuation after Step 8 §5 |

关键判断：

- `StartupAdmission.accepted -> MemberPresence.starting` 是 local owner 链的显式跨对象资格关系，不是 host 受理或容器启动成功。
- `MemberPresence.ready` 只解锁 member 内部 allowed flow；它不能自动生成 `HostCollaborationAttempt.submitted`，也不能变成 host health / session / registry truth。
- `HostFeedbackConsumer` 只将 `submitted` attempt 追加为 `feedback_linked`；feedback 内容不会反向改写 `MemberPresence` 或 admission。

## 2. 状态流转图

#### CP01 状态流转图

```text
StartupAdmission
  <new admission>
        │ AdmitMemberStartup
        ▼
  accepted / rejected / blocked
        │ accepted + EstablishMemberPresence
        ▼
MemberPresence
  starting
        │ TransitionMemberPresence
        ▼
  ready / degraded / draining / unknown
        │ explicit terminate
        ▼
  terminated

HostCollaborationAttempt
  prepared
        │ host continuation
        ▼
  submitted
        │ HostFeedbackConsumer
        ▼
  feedback_linked
```

关键说明：

- 图只表达 member local admission、presence 和 attempt 的状态方向；`rejected` / `blocked` admission 与 `blocked` / `unknown` attempt 的旁路在允许迁移清单中明确。
- `starting -> ready`、`degraded`、`draining`、`unknown` 都必须经 `TransitionMemberPresence` 与可证明的 `PresenceTransitionReason`，不由 heartbeat、process signal、host state 或时间流逝隐式触发。
- `submitted` 和 `feedback_linked` 不表达 host accepted、endpoint registry、session、health 或容器 lifecycle；这些仍是 `L2-member-service` 等外部 owner truth。
- 图不表达 enum、DB 列、transaction、exact IPC carrier、retry参数或 host feedback schema。

#### CP01 状态传播关系图

```text
<StartupAdmission / MemberPresence / HostAttempt revision>
        │
        ▼
<MemberStartupAdmissionRecorded / MemberPresenceChanged /
 HostCollaborationAttemptRecorded candidate>
        │
        ├─ <MemberCommittedFactConsumer> -> <InteractionTraceEntry / InteractionGap>
        │
        ├─ <MemberProjectionUpdateConsumer> -> <MemberProjectionState.stale>
        │
        └─ <GetMemberPresence / GetHostCollaborationPosture>
             -> <body-free local posture>
```

关键说明：

- CP01 committed fact 的传播只形成本仓 trace、projection stale marker 和 body-free read surface；exact event carrier / route 仍受 `L2M-UP-005` 阻塞。
- `HostFeedbackConsumer` 的 feedback link 也只能进入 local attempt history、trace 和 projection；它不改变 admission、presence 或 host truth。
- Query 不触发 host continuation、retry、resolution 或状态迁移；projection stale 不反写 CP01 source fact。

## 3. 允许的核心迁移

| 对象 | 允许迁移 | 触发动作 / 前置 | 本地结果与边界 |
|---|---|---|---|
| `StartupAdmission` | `<new> -> accepted` | `AdmitMemberStartup`，全部 subject / anchor / startup / credential resolution 可验证 | 追加 accepted decision；仅授予建立 presence 的资格。 |
| `StartupAdmission` | `<new> -> rejected` | `AdmitMemberStartup`，主语、scope 或输入已知不合法 | 追加 rejected decision；不建立 presence。 |
| `StartupAdmission` | `<new> -> blocked` | `AdmitMemberStartup`，source missing / stale / conflict / unknown 或 `L2M-UP-006/008` 未闭口 | 追加 blocked decision；不默认放行。 |
| `StartupAdmission` | `blocked -> accepted / rejected` | 新的显式 `AdmitMemberStartup` command 和正式 resolution basis | 形成新的 admission decision / correlation；不原地覆盖旧 blocked 记录。 |
| `MemberPresence` | `<new> -> starting` | `EstablishMemberPresence`，引用 accepted admission | 建立初始 presence revision。 |
| `MemberPresence` | `starting -> ready` | `TransitionMemberPresence`，本地前置可证明 | 追加 ready revision；不表示 host / Runtime ready。 |
| `MemberPresence` | `starting / ready / degraded -> degraded` | `TransitionMemberPresence`，显式可解释的 local collaboration degradation | 追加 safe reason；仍不把 host unavailable 直接写成 terminated。 |
| `MemberPresence` | `starting / ready / degraded -> draining` | `TransitionMemberPresence`，显式退出 / 停止入站意图 | 追加 draining revision，并停止建立新的入站主线。 |
| `MemberPresence` | `starting / ready / degraded / draining -> unknown` | `TransitionMemberPresence`，本地状态完整性无法证明 | 追加 unknown fence；不盲目恢复。 |
| `MemberPresence` | `starting / ready / degraded / draining -> terminated` | `TransitionMemberPresence`，显式终止 basis | 追加 terminal revision；不撤销外部 feedback 历史。 |
| `MemberPresence` | `unknown -> starting / ready / degraded / draining / terminated` | 新 `TransitionMemberPresence` command，具有可回链的正式 local basis | 形成新 revision；不得自动升级。 |
| `HostCollaborationAttempt` | `<new> -> prepared` | `PrepareHostCollaboration`，从 committed presence 形成 immutable material | material 与 prepared attempt 先本地提交。 |
| `HostCollaborationAttempt` | `prepared -> submitted` | 明确 host continuation 返回 `HostSubmissionRef` | 追加 submitted revision；不宣称 host accepted。 |
| `HostCollaborationAttempt` | `submitted -> feedback_linked` | `HostFeedbackConsumer` 验证 source / correlation 后关联 `HostFeedbackRef` | 追加 feedback link；不改 presence。 |
| `HostCollaborationAttempt` | `prepared -> blocked` | seam / route / precondition 可证明不成立 | 记录 blocked attempt；未来恢复形成新 attempt。 |
| `HostCollaborationAttempt` | `prepared / submitted -> unknown` | side effect 未知或提交结果不可证明 | 追加 unknown fence；禁用盲重放。 |

## 4. 禁止迁移与状态红线

| 禁止迁移或行为 | 原因 |
|---|---|
| `StartupAdmission.blocked` 自动变为 `accepted` | 不可验证的 credential / subject / source 必须 fail closed；必须有新的 command 与正式 basis。 |
| `StartupAdmission.rejected` 原地修改为 `accepted` | 历史必须保留；如有新输入，创建新 admission decision。 |
| 非 `accepted` admission 建立 `MemberPresence.starting` | 防止绕过 subject / identity / credential 前置。 |
| `MemberPresence.unknown` 自动变为 `ready` 或 `terminated` | unknown 不是超时，而是状态完整性 fence。 |
| heartbeat 缺失、process signal、host health / session / registry 直接迁移 `MemberPresence` | 这些 truth 外置，且不得以外部观察覆盖本地 history。 |
| `MemberPresence.draining / terminated` 建立新的入站主线或自动恢复 ready | draining 已停止新交互；terminated 为本地终态，重新在场必须由新 admission / presence 链处理。 |
| `HostCollaborationAttempt.submitted` 直接等同 host accepted / session established / healthy | submitted 仅记录 member 侧 seam invocation。 |
| `HostCollaborationAttempt.feedback_linked` 反向把 `MemberPresence` 置为 ready / terminated | feedback 只追加 ref，不能替代本地 explicit transition。 |
| `HostCollaborationAttempt.unknown` 自动 retry 或回到 prepared | 必须等待正式 idempotency / resolution evidence，后续提交形成新 attempt。 |
| Query 改变 admission、presence、attempt 或触发 host continuation | Query no-write 是 Step 3 / Step 9 红线。 |

## 5. 状态触发覆盖与对象反查

| 状态主体 | Step 7 触发接口 | Step 8 处理流 | 传播 / 查询承接 | 审计结论 |
|---|---|---|---|---|
| `StartupAdmission` | `AdmitMemberStartup` | CP01 §2 admission flow | `MemberStartupAdmissionRecorded` candidate；Trace / Read Model | pass |
| `MemberPresence` | `EstablishMemberPresence`、`TransitionMemberPresence` | CP01 §3 / §4 presence flows | `MemberPresenceChanged` candidate；`GetMemberPresence`；Trace / Read Model | pass |
| `HostCollaborationMaterial` | `PrepareHostCollaboration` | CP01 §5 material / attempt flow | immutable input to attempt / posture Query | pass；无独立可变状态 |
| `HostCollaborationAttempt` | `PrepareHostCollaboration`、`HostFeedbackConsumer` | CP01 §5 / §6 | `HostCollaborationAttemptRecorded` candidate；`GetHostCollaborationPosture`；Trace / Read Model | pass |
| `PresenceAdmissionPolicy` | `AdmitMemberStartup` 内部 guard | CP01 §2 | 不生成独立 lifecycle | pass；无业务状态 |

## 6. CP01 状态停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属完整 | pass | CP01 所有可变状态都归 admission、presence 或 attempt；material / policy 未被误升格。 |
| 触发接口 / 流存在 | pass | 每个允许迁移都回指 Step 7 API / Consumer 或 Step 8 continuation。 |
| allowed / forbidden 清楚 | pass | admission、presence、attempt 三层均有允许路径和明确红线。 |
| 状态不压平 | pass | accepted、ready、submitted、feedback-linked 与 external acceptance / health 保持分层。 |
| 传播不过度 | pass | 只向 trace、projection stale、read surface 和 semantic event candidate 传播；不反写 source 或外部 truth。 |
| pending 诚实性 | pass | `L2M-UP-001/005/006/008` 只形成 blocked / unknown / pending seam，不声明 host integration 或 readiness。 |
| 未下沉到详细设计 | pass | 未定义 enum、schema、IPC、DB、retry实现、run_id、测试或证据。 |

CP01 结论为 `completed / pass / stop_review`。下一允许动作是更新 Step 9 主控与项目台账到 `state_machines:CP02_inbound`，然后创建 CP02 状态机附录；不得提前创建 CP03~CP07 或进入 Step 10。
