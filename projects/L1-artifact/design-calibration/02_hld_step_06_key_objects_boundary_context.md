# Step 6 附录 A2. Boundary / Context 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件收 intake、review、automation 和 consumption 支撑对象。

---

## A8. `ArtifactIntakeContext`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact intake convergence` |
| 对象类型 | context object |
| 结构责任 | 表达人工、外部、工作、过程或治理侧材料进入 Artifact 主线前的统一收束语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `artifact_intake_context_id` | `ArtifactIntakeContextId` | 输入收束语境身份 |
| `source_ref` | `ArtifactContentSourceRef` | 进入本仓的主要内容来源 |
| `intake_kind` | `ArtifactIntakeKind` | 输入类别 |
| `intake_state` | `ArtifactIntakeState` | 输入收束生命周期 |
| `body_boundary_state` | `ArtifactBodyBoundaryState` | 外部正文边界是否已守住 |

| 状态 | 作用 |
|---|---|
| `Received` / `Resolved` / `PendingReference` / `Rejected` / `Transferred` | 已接收、已收束、等待引用、已拒绝和已移交主线 |

| 成员函数 | 作用 |
|---|---|
| `resolve_source(ArtifactContentSourceRef source_ref)` | 确认正式来源引用 |
| `mark_pending_reference(ExternalReferenceResolutionState resolution_state)` | 因外部引用未闭合进入等待 |
| `reject(ArtifactIntakeRejectReason reason, ActorContext actor)` | 拒绝越界或无效输入 |
| `transfer_to_truth_write(ActorContext actor)` | 移交给事实 / 版本 / 血缘写路径 |

| 工厂函数 | 作用 |
|---|---|
| `from_source(ArtifactIntakeKind intake_kind, ArtifactContentSourceRef source_ref)` | 从正式来源建立输入语境 |

| 禁止事项 | 说明 |
|---|---|
| 不直接形成核心 truth | intake 收束不等于 ArtifactFact 已成立 |
| 不保存外部正文 | 只能保存 source ref、summary 和边界状态 |

---

## A9. `ArtifactSubmissionRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact intake convergence` |
| 对象类型 | 实体 / submission history |
| 结构责任 | 表达一次具体提交、导入或收束尝试的结果和来源依据 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `artifact_submission_id` | `ArtifactSubmissionId` | 提交记录身份 |
| `intake_context_ref` | `ArtifactIntakeContextRef` | 所属输入收束语境 |
| `submitter_ref` | `ActorRef` | 发起提交的 actor 或系统主体 |
| `submission_state` | `ArtifactSubmissionState` | 提交记录状态 |
| `submission_source_ref` | `ArtifactContentSourceRef` | 对应来源引用 |

| 状态 | 作用 |
|---|---|
| `Received` / `Accepted` / `Rejected` / `Superseded` | 已接收、已接受、已拒绝和被新提交取代 |

| 成员函数 | 作用 |
|---|---|
| `accept(ActorContext actor)` | 标记该提交已被正式接纳 |
| `reject(ArtifactSubmissionRejectReason reason, ActorContext actor)` | 标记该提交被拒绝 |
| `supersede(ArtifactSubmissionRef next_submission_ref, ActorContext actor)` | 被后续提交取代 |

| 工厂函数 | 作用 |
|---|---|
| `record(ArtifactIntakeContextRef intake_context_ref, ActorRef submitter_ref, ArtifactContentSourceRef submission_source_ref)` | 为一次具体提交建立记录 |

| 禁止事项 | 说明 |
|---|---|
| 不替代审查结论 | 接受提交不等于完成 review |
| 不绕过版本化主线 | 提交记录不能直接成为 ArtifactVersion |

---

## A10. `ArtifactReviewAnchor`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact review and responsibility context` |
| 对象类型 | context object |
| 结构责任 | 把审查、负责、维护和协作理解锚定到同一 Artifact truth 上 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `artifact_review_anchor_id` | `ArtifactReviewAnchorId` | 审查锚点身份 |
| `truth_anchor_kind` | `ArtifactTruthAnchorKind` | 审查面对的是 fact、version 还是 baseline |
| `truth_anchor_ref` | `ArtifactTruthAnchorRef` | 被审查的正式 truth 锚点 |
| `review_state` | `ArtifactReviewState` | 审查锚点状态 |
| `review_reason` | `ArtifactReviewReason` | 触发审查或维护的原因 |

| 状态 | 作用 |
|---|---|
| `Draft` / `Ready` / `PendingResponsibility` / `Closed` / `Invalid` | 草稿、可审查、待责任闭口、已关闭和无效 |

| 成员函数 | 作用 |
|---|---|
| `mark_ready(ActorContext actor)` | 标记锚点已经具备正式审查条件 |
| `wait_responsibility(ArtifactResponsibilityAssignment assignment)` | 因责任未闭合进入等待 |
| `close(ArtifactReviewCloseReason reason, ActorContext actor)` | 在审查结束后关闭锚点 |
| `invalidate(ArtifactReviewInvalidReason reason, ActorContext actor)` | 标记锚点不再可用 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth_anchor(ArtifactTruthAnchorKind truth_anchor_kind, ArtifactTruthAnchorRef truth_anchor_ref, ArtifactReviewReason review_reason)` | 从正式 truth 锚点建立审查语境 |

| 禁止事项 | 说明 |
|---|---|
| 不让 view state 代替审查锚点 | workspace / console / report 不能替代正式 review anchor |
| 不脱离正式 truth | 审查必须绑定 ArtifactFact / Version / Baseline |

---

## A11. `ArtifactResponsibilityAssignment`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact review and responsibility context` |
| 对象类型 | 实体 / responsibility context |
| 结构责任 | 表达某个审查锚点对应的责任承担、维护接手和解释语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `artifact_responsibility_assignment_id` | `ArtifactResponsibilityAssignmentId` | 责任分配身份 |
| `review_anchor_ref` | `ArtifactReviewAnchorRef` | 所属审查锚点 |
| `responsible_party_ref` | `ActorRef` | 当前负责方 |
| `assignment_state` | `ArtifactResponsibilityAssignmentState` | 责任分配状态 |
| `basis_ref` | `ArtifactResponsibilityBasisRef` | 责任分配依据 |

| 状态 | 作用 |
|---|---|
| `Pending` / `Assigned` / `Accepted` / `Released` / `Invalid` | 待分配、已分配、已接受、已释放和无效 |

| 成员函数 | 作用 |
|---|---|
| `assign(ActorRef responsible_party_ref, ActorContext actor)` | 分配责任承担方 |
| `accept(ActorContext actor)` | 责任方接受承担 |
| `release(ArtifactResponsibilityReleaseReason reason, ActorContext actor)` | 释放当前责任 |
| `invalidate(ArtifactResponsibilityInvalidReason reason, ActorContext actor)` | 标记责任语境无效 |

| 工厂函数 | 作用 |
|---|---|
| `from_review_anchor(ArtifactReviewAnchorRef review_anchor_ref, ArtifactResponsibilityBasisRef basis_ref)` | 从审查锚点创建责任分配语境 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 identity truth | 只消费 actor / role 语境,不保存成员生命周期 |
| 不替代 governance 审批 truth | 它只解释 Artifact 侧责任承担 |

---

## A12. `AutomationArtifactInput`

| 项 | 内容 |
|---|---|
| 所属部分 | `Automation output control boundary` |
| 对象类型 | 实体 / automation boundary input |
| 结构责任 | 表达 runtime / capability / tool 产出以候选输入方式进入 Artifact 主线的边界语义 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `automation_artifact_input_id` | `AutomationArtifactInputId` | 自动化输入身份 |
| `automation_source_ref` | `AutomationSourceRef` | 自动化来源引用 |
| `candidate_kind` | `AutomationArtifactCandidateKind` | 候选变化类别 |
| `input_state` | `AutomationArtifactInputState` | 自动化输入状态 |
| `derived_from_ref` | `ArtifactTruthAnchorRef` | 该输入源自的正式 truth 锚点 |

| 状态 | 作用 |
|---|---|
| `Received` / `Accepted` / `PendingReview` / `Rejected` / `Superseded` | 已接收、已接受、待审查、已拒绝和被新输入替代 |

| 成员函数 | 作用 |
|---|---|
| `accept(ActorContext actor)` | 允许进入正式收束链 |
| `send_to_review(ArtifactReviewAnchor review_anchor)` | 进入人工或责任审查 |
| `reject(AutomationArtifactRejectReason reason, ActorContext actor)` | 拒绝越界或无法解释的自动化输入 |
| `supersede(AutomationArtifactInputRef next_input_ref, ActorContext actor)` | 被新的自动化输入替代 |

| 工厂函数 | 作用 |
|---|---|
| `from_source(AutomationSourceRef automation_source_ref, AutomationArtifactCandidateKind candidate_kind)` | 从自动化来源形成候选输入 |

| 禁止事项 | 说明 |
|---|---|
| 不直接形成正式 truth | 自动化输入存在本身不自动创建 ArtifactFact / Version / Lineage |
| 不保存 runtime 正文 | 只保存来源引用和边界状态 |

---

## A13. `ConsumableArtifactReference`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact consumption and traceability` |
| 对象类型 | reference object / consumable anchor |
| 结构责任 | 向下游暴露稳定且可回指的 Artifact truth 引用单位 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `consumable_artifact_reference_id` | `ConsumableArtifactReferenceId` | 可消费引用身份 |
| `anchor_kind` | `ArtifactTruthAnchorKind` | 引用的是 fact、version、lineage 或 baseline |
| `anchor_ref` | `ArtifactTruthAnchorRef` | 实际 truth 锚点 |
| `reference_state` | `ConsumableArtifactReferenceState` | 引用是否可读、受限或过期 |
| `consumer_scope_ref` | `ArtifactConsumerScopeRef` | 该引用针对的消费范围 |

| 状态 | 作用 |
|---|---|
| `Ready` / `Restricted` / `Stale` / `Unavailable` | 可读、受限、过期和暂不可用 |

| 成员函数 | 作用 |
|---|---|
| `restrict(ArtifactReadRestrictionReason reason)` | 标记当前不可直接输出 |
| `mark_stale(ArtifactStaleReason reason)` | 标记该消费引用需要刷新 |
| `points_to(ArtifactTruthAnchorRef anchor_ref)` | 判断是否指向某个正式 truth 锚点 |

| 工厂函数 | 作用 |
|---|---|
| `from_anchor(ArtifactTruthAnchorKind anchor_kind, ArtifactTruthAnchorRef anchor_ref, ArtifactConsumerScopeRef consumer_scope_ref)` | 从正式 truth 锚点构造可消费引用 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有下游副本 | sync copy、workspace view、archive package 不是该对象本体 |
| 不绕过 visibility 约束 | 输出前仍需通过 read visibility 判断 |

---

## A14. `ArtifactConsumptionBackref`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact consumption and traceability` |
| 对象类型 | 实体 / backref truth |
| 结构责任 | 记录某次下游消费到底基于哪份 Artifact truth,并为审计回看提供正式回指 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `artifact_consumption_backref_id` | `ArtifactConsumptionBackrefId` | 消费回指身份 |
| `consumer_ref` | `AdjacentConsumerRef` | 消费方引用 |
| `consumable_ref` | `ConsumableArtifactReferenceRef` | 使用的可消费引用 |
| `consumption_reason` | `ArtifactConsumptionReason` | 这次消费的业务原因 |
| `backref_state` | `ArtifactConsumptionBackrefState` | 回指记录状态 |

| 状态 | 作用 |
|---|---|
| `Recorded` / `Explained` / `Stale` / `Retired` | 已记录、解释已闭合、所依赖内容已过期和退出当前消费链 |

| 成员函数 | 作用 |
|---|---|
| `mark_explained(ArtifactTraceRecord trace_record)` | 关联到正式追溯记录 |
| `mark_stale(ArtifactStaleReason reason)` | 标记其所基于 truth 已过期 |
| `retire(ArtifactConsumptionRetireReason reason, ActorContext actor)` | 使回指退出当前消费视图 |

| 工厂函数 | 作用 |
|---|---|
| `record(AdjacentConsumerRef consumer_ref, ConsumableArtifactReference consumable_ref, ArtifactConsumptionReason consumption_reason)` | 从消费行为建立正式回指 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 trace 记录 | backref 负责锚点,完整追溯由 `ArtifactTraceRecord` 承接 |
| 不改变核心 truth | 记录消费不能反写 ArtifactFact / Version / Baseline |
