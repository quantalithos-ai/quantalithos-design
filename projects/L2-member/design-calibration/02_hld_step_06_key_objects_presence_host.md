# Step 6 附录 CP01. Presence and Host Collaboration 对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 对应 capability: `02_hld_step_05_components_boundary.md` §7
> 状态: completed / pass / stop_review
> 本文件只定义概要对象骨架,不定义 schema、repository、transport 或实现。

## A1. `StartupAdmission`

| 项 | 内容 |
|---|---|
| 所属部分 | CP01 Presence and Host Collaboration |
| 对象类型 | decision record / local truth |
| 主要责任 | 记录某个项目型启动语境是否被 member 本地受理,并固定 subject、identity anchor 与来源依据。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `admission_id` | `StartupAdmissionId` | 本地受理决定标识。 |
| `subject_ref` | `ProjectMemberRef` | 当前唯一支持的执行主语。 |
| `identity_anchor_ref` | `GlobalMemberRef` | 与执行主语关联的全局身份锚。 |
| `startup_context_ref` | `StartupContextRef` | 回指正式启动语境,不保存正文。 |
| `credential_ref` | `Optional<CredentialRef>` | 可验证凭据引用;exact shape pending。 |
| `disposition` | `StartupAdmissionDisposition` | accepted / rejected / blocked。 |
| `source_refs` | `List<TypedRef>` | Work / Identity / credential / host 来源依据。 |
| `reason_category` | `SafeReasonCategory` | body-free 决定理由。 |

| 状态 | 作用 |
|---|---|
| `accepted` | subject、anchor、startup 与 credential 前置均可验证,允许建立 local presence。 |
| `rejected` | 输入无效、scope 冲突或不支持的主语,本次决定终止。 |
| `blocked` | 必要 owner / contract / source 不可判定,不得降级放行。 |

| 成员函数 | 作用 |
|---|---|
| `permits_presence()` | 仅 accepted 时允许创建 `MemberPresence`。 |
| `matches_subject(ProjectMemberRef subject_ref, GlobalMemberRef identity_anchor_ref)` | 检查双锚是否与决定一致。 |
| `is_terminal()` | 判断本次 admission 已 accepted / rejected,还是保持 blocked。 |

| 工厂函数 | 作用 |
|---|---|
| `decide(ProjectMemberRef subject_ref, GlobalMemberRef identity_anchor_ref, StartupContextRef startup_context_ref, Optional<CredentialRef> credential_ref, SourceResolutionSet resolutions, PresenceAdmissionPolicy policy)` | 从已解析来源形成 source-anchored 本地 admission。 |

| 禁止事项 | 说明 |
|---|---|
| 不得以 GlobalMember / Workspace view 代替执行主语 | 当前正向语义只支持 ProjectMemberRef。 |
| 不得保存 credential / startup 正文 | 只保存 typed refs、处置和安全理由。 |
| 不得把 blocked 写成 accepted | 开放合同或 unknown 必须 fail closed。 |

## A2. `MemberPresence`

| 项 | 内容 |
|---|---|
| 所属部分 | CP01 Presence and Host Collaboration |
| 对象类型 | aggregate / local state truth |
| 主要责任 | 表达一个已受理项目型成员实例在 member 边界内的显式在场状态,不等于 process liveness 或 host health。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `presence_id` | `MemberPresenceId` | 本地在场标识。 |
| `admission_ref` | `StartupAdmissionId` | 回指 accepted 启动受理事实。 |
| `subject_ref` | `ProjectMemberRef` | 在场归属的执行主语。 |
| `identity_anchor_ref` | `GlobalMemberRef` | 关联身份锚。 |
| `status` | `MemberPresenceStatus` | starting / ready / degraded / draining / terminated / unknown。 |
| `revision` | `PresenceRevision` | 显式变化序号,支撑 late / duplicate 判断。 |
| `reason_category` | `Optional<SafeReasonCategory>` | 当前非正常状态的 body-free 解释。 |

| 状态 | 作用 |
|---|---|
| `starting` | admission 已成立,本地在场仍在准备。 |
| `ready` | member 本地前置满足;不表示 host healthy 或 Runtime ready。 |
| `degraded` | 部分协作依赖不可用,本地在场仍可解释。 |
| `draining` | 已显式停止接收新交互并准备终止。 |
| `terminated` | 本地在场显式终止;历史仍保留。 |
| `unknown` | 无法证明当前本地状态,不得自动升级或降为 terminated。 |

| 成员函数 | 作用 |
|---|---|
| `transition_to(MemberPresenceStatus target_status, PresenceTransitionReason reason)` | 按允许迁移形成新 revision。 |
| `can_accept_inbound()` | 判断当前 local presence 是否允许进入入站主线。 |
| `matches_subject(ProjectMemberRef subject_ref, GlobalMemberRef identity_anchor_ref)` | 防止同一 presence 关联冲突双锚。 |
| `is_terminal()` | 判断是否已显式 terminated。 |

| 工厂函数 | 作用 |
|---|---|
| `start_from(StartupAdmission admission, PresenceStartContext start_context)` | 仅从 accepted admission 建立 starting presence。 |

| 禁止事项 | 说明 |
|---|---|
| 不得由 heartbeat 缺失或 process signal 隐式改写 | 状态变化必须由显式 member command / fact 触发。 |
| 不得表达 host health / session / registry | 这些状态归 member-service。 |
| 不得从 unknown 自动迁移 ready / terminated | 必须先获得正式 resolution。 |

## A3. `HostCollaborationMaterial`

| 项 | 内容 |
|---|---|
| 所属部分 | CP01 Presence and Host Collaboration |
| 对象类型 | immutable handoff material |
| 主要责任 | 从 local presence 形成 registration request、liveness signal 或 status report 的最小 body-free 材料。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `material_id` | `HostCollaborationMaterialId` | 本地材料标识。 |
| `presence_ref` | `MemberPresenceId` | 回指来源在场事实。 |
| `kind` | `HostCollaborationKind` | registration_request / liveness_signal / status_report。 |
| `subject_ref` | `ProjectMemberRef` | 材料归属主语。 |
| `purpose` | `InteractionPurpose` | host 协作用途的安全分类。 |
| `presence_revision` | `PresenceRevision` | 形成材料时的本地 revision。 |
| `safe_status_category` | `SafeStatusCategory` | 不含正文的状态摘要。 |
| `correlation` | `MemberCorrelation` | 关联启动、在场与后续 attempt。 |

该对象形成后不可原地改变,因此无独立可变状态集合。

| 成员函数 | 作用 |
|---|---|
| `is_body_free()` | 验证材料不含 credential、session、正文或 secret。 |
| `matches_presence(MemberPresence presence)` | 检查 subject 与 revision 是否来自给定 presence。 |

| 工厂函数 | 作用 |
|---|---|
| `prepare(MemberPresence presence, HostCollaborationKind kind, InteractionPurpose purpose, SafeStatusCategory safe_status_category)` | 从 committed local presence 生成最小材料。 |

| 禁止事项 | 说明 |
|---|---|
| 不得携带 credential / host session 正文 | 只允许 typed ref 与安全分类。 |
| 不得声明 host 已接受或成员健康 | 材料只是 member 本地输出候选。 |
| 不得作为容器控制命令 | lifecycle orchestration 归 host owner。 |

## A4. `HostCollaborationAttempt`

| 项 | 内容 |
|---|---|
| 所属部分 | CP01 Presence and Host Collaboration |
| 对象类型 | append-only attempt record |
| 主要责任 | 记录一份 host collaboration material 的本地准备、提交、阻塞、未知与正式反馈关联。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `attempt_id` | `HostCollaborationAttemptId` | 本地尝试标识。 |
| `material_ref` | `HostCollaborationMaterialId` | 被提交的不可变材料。 |
| `host_boundary_ref` | `HostBoundaryRef` | transport-neutral 正式 host seam。 |
| `status` | `HostCollaborationAttemptStatus` | 当前本地尝试姿态。 |
| `attempted_at` | `Optional<Timestamp>` | 调用 host seam 的本地时点。 |
| `submission_ref` | `Optional<HostSubmissionRef>` | seam invocation 的正式 / 本地 carrier 引用。 |
| `feedback_ref` | `Optional<HostFeedbackRef>` | 正式 host feedback 引用,不复制其 truth。 |
| `reason_category` | `Optional<SafeReasonCategory>` | blocked / unknown / local failure 安全理由。 |
| `idempotency_key` | `IdempotencyKey` | 重复提交分类锚点。 |

| 状态 | 作用 |
|---|---|
| `prepared` | 本地 attempt 已建立,尚未调用 host seam。 |
| `submitted` | 已调用正式 seam,不表示 host accepted。 |
| `feedback_linked` | 已关联正式反馈 ref,不解释为 health / session。 |
| `blocked` | contract、route 或前置不成立,未形成正向提交。 |
| `unknown` | 无法确认本次提交副作用,必须 fenced。 |

| 成员函数 | 作用 |
|---|---|
| `mark_submitted(HostSubmissionRef submission_ref, Timestamp attempted_at)` | 记录本地调用 seam 的事实。 |
| `link_feedback(HostFeedbackRef feedback_ref)` | 追加正式反馈关联。 |
| `mark_unknown(UnknownReason reason)` | 建立 unknown-side-effect fence。 |
| `is_retry_safe(HostResolutionEvidence resolution_evidence)` | 仅未提交或有正式幂等 / resolution 依据时允许后续评估。 |

| 工厂函数 | 作用 |
|---|---|
| `prepare(HostCollaborationMaterial material, HostBoundaryRef host_boundary_ref, IdempotencyKey idempotency_key)` | 从不可变材料和正式 seam 创建 prepared attempt。 |

| 禁止事项 | 说明 |
|---|---|
| submitted 不等于 accepted / healthy | external verdict 只能由 host ref 表达。 |
| unknown 不得自动 retry | 防止重复不可逆副作用。 |
| 新尝试不得覆盖旧尝试 | 每次 attempt 形成新记录。 |

## A5. `PresenceAdmissionPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | CP01 Presence and Host Collaboration |
| 对象类型 | domain policy / guard |
| 主要责任 | 判断 subject、identity anchor、startup 与 credential resolution 是否足以形成 accepted admission。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `supported_subject_kind` | `ExecutionSubjectKind` | 当前固定 project_member。 |
| `required_resolution_kinds` | `Set<SourceResolutionKind>` | accepted 必须具备的正式来源类别。 |
| `unknown_handling` | `UnknownHandlingMode` | 固定 fail_closed。 |
| `association_rule` | `SubjectAnchorAssociationRule` | 要求 ProjectMember / GlobalMember 关联唯一且 scope 一致。 |

该 policy 无业务生命周期状态。

| 成员函数 | 作用 |
|---|---|
| `evaluate(ProjectMemberRef subject_ref, GlobalMemberRef identity_anchor_ref, StartupContextRef startup_context_ref, SourceResolutionSet resolutions)` | 形成 admission disposition 所需的结构化判断。 |
| `rejects_non_project(ExecutionSubjectRef subject_ref)` | 拒绝未定义的非项目型主语。 |
| `requires_fail_closed(SourceResolutionSet resolutions)` | 判断 missing / stale / conflict / unknown 是否必须 blocked。 |

| 工厂函数 | 作用 |
|---|---|
| `project_scoped()` | 创建当前正式 project-scoped admission policy。 |

| 禁止事项 | 说明 |
|---|---|
| 不签发 / 撤销 credential | 只消费 verification resolution。 |
| 不读取 host health 或 Runtime state | admission 不由外部运行状态代答。 |
| 不允许配置放开 non-project / unknown | 主体与 fail-closed 是不可配置化 invariant。 |

## 6. CP01 对象正式化停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 的 5 个候选全部处理 | pass | 5/5 独立成节,无新增隐式对象。 |
| 每个对象有 capability 来源 | pass | admission、presence、host material、attempt、guard 完整对应 §7 capability。 |
| subject / identity / host truth 未被复制 | pass | external facts 只以 typed ref / resolution 出现。 |
| 字段有类型、函数参数有类型 | pass | 未写完整 signature / schema。 |
| 状态未压平 | pass | presence 与 host attempt 分开,submitted != accepted / healthy。 |
| Step 8 / 9 可反查 | pass | flow / state 所需 CP01 对象已齐。 |

CP01 结论为 `completed / pass / stop_review`。下一允许模块是 CP02 Inbound Boundary 对象正式化。
