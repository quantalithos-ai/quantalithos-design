# Step 8 附录 CP01. Presence and Host Collaboration 处理流

> 主控文件: `02_hld_step_08_processing_flows.md`
> 对应接口: Step 7 CP01 的 4 Commands、2 Queries、`HostFeedbackConsumer`
> 对应对象: Step 6 CP01 的 5 个对象
> 状态: completed / pass / stop_review

## 1. 本部分处理流选择与输入

CP01 的四个 Command 都会改变 member local truth 或形成不可变 handoff attempt，因此分别画独立处理流。`HostFeedbackConsumer` 会追加 feedback link，也单独画图。`GetHostCollaborationPosture` 包含 submitted / feedback-linked / unknown / gap 裁剪，单独画复杂 Query；`GetMemberPresence` 只读取 presence projection，复用 Step 8 主控 §3.2 通用读路径。

本部分只拥有 `StartupAdmission`、`MemberPresence`、`HostCollaborationMaterial`、`HostCollaborationAttempt` 和 `PresenceAdmissionPolicy` 的 member-side 语义。Work、Identity、credential、host registry / session / health、container lifecycle 和 process liveness 均通过 ref / port 留在外部 owner。

## 2. `AdmitMemberStartup` 处理流

```text
<AdmitMemberStartup Command>
  │
  ▼
<Presence Command Boundary>
  - 校验 ActorContext actor、CommandMetadata metadata、IdempotencyKey idempotency_key
  - 确认 ProjectMemberRef subject_ref 与 GlobalMemberRef identity_anchor_ref
  │
  ▼
<PresenceApplicationService>
  - 读取 ProjectMemberSourcePort / IdentityAnchorSourcePort 的 safe resolution
  - 读取 StartupCredentialVerifierPort 的 verification ref（若适用）
  - 调用 PresenceAdmissionPolicy.evaluate(ProjectMemberRef subject_ref, GlobalMemberRef identity_anchor_ref, StartupContextRef startup_context_ref, SourceResolutionSet resolutions)
  │
  ▼
<StartupAdmission>
  - 形成 accepted / rejected / blocked decision
  - 保留 typed source refs、safe reason 与 correlation,不保存 startup / credential body
  │
  ▼
<PresenceStore + semantic event candidate>
  - 在本地提交边界保存 StartupAdmission
  - accepted 只产生后续 EstablishMemberPresence 资格;不创建 host acceptance / session
  │
  ▼
<StartupAdmission Result>
  - 返回已提交 admission 或 blocked / rejected
```

关键设计点：

- `ProjectMemberRef` 是当前唯一正向执行主语；`GlobalMemberRef` 只作为身份锚，不替代项目主语。
- 任一必要 resolution 缺失、冲突、过期或未知时，`PresenceAdmissionPolicy` 只能形成 blocked / rejected，不能 fail open。
- 外部 source port 的调用结果不等于 member truth；本地只提交 admission decision 与安全引用。
- 详细设计继续展开 source resolution 的版本校验、事务隔离和协议错误映射。

## 3. `EstablishMemberPresence` 处理流

```text
<EstablishMemberPresence Command>
  │
  ▼
<Presence Command Boundary>
  - 校验 ActorContext actor、CommandMetadata metadata、IdempotencyKey idempotency_key
  - 读取 StartupAdmissionId admission_id 与 PresenceStartContext start_context
  │
  ▼
<PresenceApplicationService>
  - 加载 StartupAdmission admission
  - 检查 admission.permits_presence() 与 subject / identity 一致性
  - 调用 MemberPresence.start_from(StartupAdmission admission, PresenceStartContext start_context)
  │
  ▼
<MemberPresence + PresenceStore>
  - 以 starting 状态建立新 presence revision
  - 在本地提交边界保存 presence 与 `MemberPresenceChanged` candidate
  │
  ▼
<MemberPresence Result>
  - 返回 starting presence;不返回 host / process health
```

关键设计点：

- 只有 accepted `StartupAdmission` 能创建 presence；blocked admission 不能绕过进入 starting。
- presence 的 starting 是 member local state，不表示宿主已注册、容器已运行或 Runtime 已 ready。
- source admission 与 presence 在同一 local owner 链中关联，但不把外部 source body 复制进 presence。

## 4. `TransitionMemberPresence` 处理流

```text
<TransitionMemberPresence Command>
  │
  ▼
<Presence Command Boundary>
  - 校验 ActorContext actor、CommandMetadata metadata、IdempotencyKey idempotency_key
  - 携带 MemberPresenceId presence_id、ExpectedRevision expected_revision 与目标状态
  │
  ▼
<PresenceApplicationService>
  - 读取当前 MemberPresence current_presence
  - 检查 current_presence.matches_subject(ProjectMemberRef subject_ref, GlobalMemberRef identity_anchor_ref) 与 ExpectedRevision expected_revision
  - 调用 MemberPresence.transition_to(MemberPresenceStatus target_status, PresenceTransitionReason reason)
  │
  ▼
<MemberPresence + PresenceStore>
  - 追加新 presence revision 与 safe reason
  - 形成 `MemberPresenceChanged` candidate;不更新 host health
  │
  ▼
<MemberPresence Result>
  - 返回新 revision 或 conflict / blocked / unknown surface
```

关键设计点：

- expected revision 是本地并发与重复保护，不代表外部 host revision。
- unknown 不能自动迁移到 ready 或 terminated；需要新的可证明 local decision。
- draining / terminated 只影响 member 自己的入站接受姿态，不撤销已经存在的 host feedback 或外部 session truth。

## 5. `PrepareHostCollaboration` 处理流

```text
<PrepareHostCollaboration Command>
  │
  ▼
<Host Collaboration Command Boundary>
  - 校验 ActorContext actor、CommandMetadata metadata、IdempotencyKey idempotency_key
  - 读取 MemberPresenceId presence_id、HostCollaborationKind kind、InteractionPurpose purpose
  │
  ▼
<HostCollaborationService>
  - 加载 committed MemberPresence presence
  - 检查 presence.can_accept_inbound() / lifecycle 约束与安全状态类别
  - 调用 HostCollaborationMaterial.prepare(MemberPresence presence, HostCollaborationKind kind, InteractionPurpose purpose, SafeStatusCategory safe_status_category)
  - 调用 HostCollaborationAttempt.prepare(HostCollaborationMaterial material, HostBoundaryRef host_boundary_ref, IdempotencyKey idempotency_key)
  │
  ▼
<HostCollaborationMaterial + HostCollaborationAttempt + HostCollaborationStore>
  - 先提交 immutable material 与 prepared attempt
  - 由明确 continuation 再调用 HostCollaborationPort,不在此图内宣称 host accepted
  │
  ▼
<Preparation Result / HostCollaborationAttemptRecorded candidate>
```

关键设计点：

- material 只含 body-free safe status、purpose、presence revision 与 typed boundary ref。
- local commit 先于 external side effect；port 调用后的 submitted / blocked / unknown 更新必须形成新的本地 attempt revision。
- `HostCollaborationPort` 是 runtime seam，不是 package dependency；`L2M-UP-001` 未闭口时只能产生 blocked-aware result。
- 不把 registration、liveness signal 或 status report 变成容器 lifecycle command。

## 6. `HostFeedbackConsumer` 处理流

```text
<HostFeedbackConsumer>
  │
  ▼
<Host Feedback Consumer>
  - 校验 EventEnvelope envelope、SourceEventId source_event_id、SchemaVersion schema_version
  - 校验 DeduplicationKey deduplication_key、TraceContext trace_context 与 HostFeedbackRef feedback_ref
  - 以 HostCollaborationAttemptId attempt_id 定位本地 attempt
  │
  ▼
<HostCollaborationService>
  - 判定 duplicate / late / conflict / attributable feedback
  - 调用 HostCollaborationAttempt.link_feedback(HostFeedbackRef feedback_ref)
  │
  ▼
<HostCollaborationAttempt + HostCollaborationStore>
  - 只追加 feedback link / safe classification
  - 必要时形成 `HostCollaborationAttemptRecorded` / trace / projection candidate
  │
  ▼
<Consumer Receipt>
  - accepted link、duplicate、late、conflict 或 blocked receipt
```

关键设计点：

- feedback 只证明一个外部 ref 可关联，不把 feedback-linked 写成 host accepted、healthy、session established 或 container ready。
- raw host payload 不进入 application object、store、trace 或 event candidate。
- duplicate / late / conflict 不覆盖旧 attempt；无法证明来源或关联时 fail closed。
- exact event carrier 与 route 受 `L2M-UP-001/005` 阻塞，图中只冻结逻辑槽位。

## 7. `GetHostCollaborationPosture` 处理流

```text
<GetHostCollaborationPosture Query>
  │
  ▼
<Query Boundary>
  - 校验 ActorContext actor、QueryMetadata metadata、MemberPresenceId presence_id
  - 读取 ProjectionConsistencyHint consistency_hint
  │
  ▼
<HostCollaborationQueryService>
  - 读取 HostCollaborationMaterial、HostCollaborationAttempt 与 feedback refs
  - 分层 prepared / submitted / feedback-linked / blocked / unknown / gap
  - 不查询或推断 host registry、session、health、acceptance
  │
  ▼
<HostCollaborationPostureView Assembler>
  - 组装 body-free refs、safe reason、freshness 与 correlation
  │
  ▼
<Posture Result>
  - 返回 local posture 或 stale / unavailable / unknown surface
```

关键设计点：

- Query 只读取 local facts 和正式 feedback refs；不触发 host resolution、retry 或新 attempt。
- submitted、feedback-linked、accepted、healthy 是不同语义层，返回面必须保留差异。
- 具体分页、visibility、projection watermark 与错误映射留给 03。

## 8. 本部分接口与对象对应关系

| 接口 / 流 | 主要对象 | 外部接缝 | 本地提交 / 派生结果 |
|---|---|---|---|
| `AdmitMemberStartup` | `StartupAdmission`;`PresenceAdmissionPolicy` | Project / Identity / credential source ports | admission decision + semantic event candidate |
| `EstablishMemberPresence` | `StartupAdmission`;`MemberPresence` | none beyond refs | starting presence revision |
| `TransitionMemberPresence` | `MemberPresence` | none | new presence revision |
| `PrepareHostCollaboration` | `MemberPresence`;`HostCollaborationMaterial`;`HostCollaborationAttempt` | `HostCollaborationPort` continuation | immutable material + prepared / later attempt status |
| `HostFeedbackConsumer` | `HostCollaborationAttempt` | host event boundary | feedback link / gap classification |
| `GetMemberPresence` | `MemberPresence` | none | read surface only,通用 §3.2 |
| `GetHostCollaborationPosture` | material / attempt / feedback refs | none | posture view only |

## 9. 未展开接口与边界取舍

- `GetMemberPresence` 不单独画图，因为它只读取 presence store / safe projection，不包含裁剪、fallback 或隐式 refresh；其 actor、freshness 和 not-available 处理遵循主控 §3.2。
- `HostCollaborationPort` 不作为额外公共 Command；它是 `PrepareHostCollaboration` 之后的 inward runtime seam。具体同步 / 异步 carrier、ACK、重入和 side-effect resolution 留给 03，并受 `L2M-UP-001` 阻塞。
- CP01 没有独立 Operations Job；若后续宿主合同要求 durable continuation，必须先在需求 / 架构 / 接口门禁重新登记，不能在本步隐式添加 scheduler。

## 10. CP01 处理流停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 四个 Command 均有独立处理流 | pass | admission、presence establish、presence transition、host material / attempt 均单独成图。 |
| 改写本地状态的 Consumer 有独立处理流 | pass | `HostFeedbackConsumer` 只追加 feedback link / safe classification。 |
| 复杂 Query 有独立处理流 | pass | posture Query 显式区分 local attempt 层与 external truth。 |
| Step 6 对象引用完整 | pass | 5 个 CP01 对象均出现在对应 flow 或 query surface。 |
| 跨部分接缝清楚 | pass | source resolution 与 host boundary 通过 typed ref / port;不转移 owner。 |
| 本地提交与外部副作用分离 | pass | material / prepared attempt 先提交,port continuation 后续且 unknown fenced。 |
| 未继承兄弟未定合同 | pass | `L2M-UP-001/002/005/006` 只作为 blocked / pending seam。 |
| 未下沉到详细实现 | pass | 无协议字段全集、SQL、错误码、重试参数、实现调用链。 |

CP01 结论为 `completed / pass / stop_review`。下一允许动作是更新主控与台账到 `Step 8 / processing_flows:CP02`，然后创建 CP02 处理流附录。
