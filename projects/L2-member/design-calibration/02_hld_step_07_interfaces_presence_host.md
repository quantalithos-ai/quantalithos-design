# Step 7 附录 CP01. Presence and Host Collaboration 接口

> 主控文件: `02_hld_step_07_api_interface_skeleton.md`
> 对应对象: Step 6 CP01 的 5 个对象
> 状态: completed / pass / stop_review

## 1. Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `AdmitMemberStartup` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ProjectMemberRef`;`GlobalMemberRef`;`StartupContextRef`;`Optional<CredentialRef>` | `StartupAdmission` | 解析双锚、startup / credential 来源并执行 `PresenceAdmissionPolicy` | accepted / rejected / blocked admission;不创建 host truth |
| `EstablishMemberPresence` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`StartupAdmissionId`;`PresenceStartContext` | `MemberPresence` | 仅从 accepted admission 建立 starting presence | 新 presence revision |
| `TransitionMemberPresence` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MemberPresenceId`;`MemberPresenceStatus`;`PresenceTransitionReason`;`ExpectedRevision` | `MemberPresence` | 校验允许迁移与 expected revision | 新 presence revision;不改 host health |
| `PrepareHostCollaboration` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MemberPresenceId`;`HostCollaborationKind`;`InteractionPurpose`;`SafeStatusCategory` | `HostCollaborationMaterial`;`HostCollaborationAttempt` | 从 committed presence 形成材料与 prepared attempt | immutable material + prepared attempt |

所有 Command 都要求 actor / metadata / idempotency。system-triggered liveness 也使用 system actor;接口不签发 credential、不控制容器、不创建 host acceptance / session / health。

## 2. Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetMemberPresence` | `ActorContext`;`QueryMetadata`;`ProjectMemberRef`;`ProjectionConsistencyHint` | `MemberPresenceReadSurface` | presence store / safe projection | no-write;显式 current / stale / unavailable,不触发 host resolution |
| `GetHostCollaborationPosture` | `ActorContext`;`QueryMetadata`;`MemberPresenceId` | `HostCollaborationPostureView` | materials、attempts、feedback refs | 只返回 local submitted / feedback-linked / gap;不声明 accepted / healthy |

## 3. Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `HostFeedbackConsumer` | 正式 host collaboration boundary | `EventEnvelope`;`SourceEventId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;`HostFeedbackRef`;`HostCollaborationAttemptId` | feedback link、duplicate / late / conflict 分类 | 只追加正式 ref;不复制 host payload,不改 presence / host truth |

exact envelope / feedback carrier 受 `L2M-UP-001/005` 阻塞;当前只冻结 source、dedup、trace 与 typed-ref 槽位。

## 4. Outbound Event 骨架

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `MemberStartupAdmissionRecorded` | committed `StartupAdmission` | Trace、Read Model、正式外部 consumer | 只含 admission ref、subject、disposition、correlation;不含 credential / startup body |
| `MemberPresenceChanged` | committed `MemberPresence` revision | Inbound、Trace、Read Model、host collaboration continuation | 传播 local presence revision;不表示 process / host health |
| `HostCollaborationAttemptRecorded` | committed `HostCollaborationAttempt` | Trace、Read Model、gap continuation | 传播 local attempt ref / status;submitted 不等于 host accepted |

上述名称冻结语义,不是已闭口 event type / source / subject / payload / topic。Carrier activation 继续 blocked by `L2M-UP-005`。

## 5. Operations Job 骨架

CP01 不新增独立 Operations Job。registration / signal / report 的提交由 `HostCollaborationService` 经 `HostCollaborationPort` 在明确用例中继续;若 03 因宿主合同确认需要 durable continuation,必须回开 Step 4 / 7,不能把隐式 scheduler 当作已收稳接口。

## 6. Inward Port / Persistence Interface

| Interface | 输入骨架 | 输出骨架 | 依赖类别 | 边界 / 当前状态 |
|---|---|---|---|---|
| `ProjectMemberSourcePort` | `ProjectMemberRef`;`ExternalContextScope` | `ExternalSourceSafeResult` | runtime(ref) | Work truth 外置;owner stable,carrier 后移 |
| `IdentityAnchorSourcePort` | `GlobalMemberRef`;`ExternalContextScope` | `ExternalSourceSafeResult` | runtime(ref) | Identity truth 外置 |
| `StartupCredentialVerifierPort` | `CredentialRef`;`StartupContextRef`;`ProjectMemberRef` | `CredentialVerificationResultRef` | runtime | `L2M-UP-006` blocked-aware;不签发 / 撤销凭据 |
| `HostCollaborationPort` | `HostCollaborationMaterial`;`IdempotencyKey`;`TraceContext` | `HostSubmissionRef` / blocked-aware result | runtime | `L2M-UP-001` exact direction / carrier pending;submitted only |
| `PresenceStore` | `StartupAdmission` / `MemberPresence`;`ExpectedRevision` | stored fact / conflict | persistence | 保存 CP01 local truth;transaction / schema 留 03 |
| `HostCollaborationStore` | material / attempt / feedback link refs | stored local records | persistence | 不保存 host payload / session / health truth |

## 7. Step 8 展开候选

| 接口 | 是否独立处理流 | 原因 |
|---|---|---|
| `AdmitMemberStartup` | 是 | P0 Command,涉及多 owner resolution 与 fail-closed。 |
| `EstablishMemberPresence` / `TransitionMemberPresence` | 是,可合并 presence lifecycle flow | P0 local state machine。 |
| `PrepareHostCollaboration` + `HostCollaborationPort` | 是 | local material / attempt 与 external submission 分层。 |
| `HostFeedbackConsumer` | 是 | 改写 feedback link,需 duplicate / late / conflict 处理。 |
| 两个 Query | 通用只读路径;posture Query 在 Step 8 标注 stale / external-truth 边界 | Query 不写。 |

## 8. CP01 接口停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 5 个对象能力有入口 / read / continuation | pass | admission、presence、material、attempt、feedback 均被承接。 |
| Command / Query / Consumer 分类 | pass | 读写无混淆,内部 policy method 未暴露。 |
| actor / metadata / idempotency / envelope | pass | 所需语境已显式。 |
| host owner 边界 | pass | acceptance / registry / session / health / lifecycle 均外置。 |
| 依赖分类 | pass | Core compile 候选未在本附录重复;host / refs / stores 类型真实。 |
| Step 8 可反查 | pass | P0 Commands、feedback Consumer 和 external continuation 均有候选。 |

CP01 结论为 `completed / pass / stop_review`。下一允许模块是 CP02 Inbound Boundary 接口正式化。
