# Step 6 附录 CP04. Outbound Boundary 对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 对应 capability: `02_hld_step_05_components_boundary.md` §10
> 状态: completed / pass / stop_review
> 本文件只定义 member 的出站决定、body-free 材料、提交尝试与缺口;Runtime outcome、Bus delivery / retry / route、Conversation fact、downstream accepted / observed 均为外部 truth。

## C1. `OutboundDecision`

| 项 | 内容 |
|---|---|
| 所属部分 | CP04 Outbound Boundary |
| 对象类型 | decision record / local truth |
| 主要责任 | 判断一条已承接的 Runtime committed safe material 是否可向某个正式边界以指定目的和安全形态出站。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `outbound_decision_id` | `OutboundDecisionId` | 本地出站决定标识。 |
| `reception_ref` | `RuntimeMaterialReceptionId` | 只锚定 CP03 已 accepted 的 reception。 |
| `runtime_material_ref` | `RuntimeSafeHandoffMaterialRef` | 回链 Runtime committed safe material truth。 |
| `subject_ref` | `ProjectMemberRef` | 出站行为归属的项目型执行主语。 |
| `target_ref` | `Optional<OutboundTargetRef>` | 已解析的正式目标;未闭口时为空。 |
| `purpose` | `InteractionPurpose` | 出站用途的安全分类。 |
| `target_resolution_ref` | `ExternalContextResolutionId` | 目标 / seam 的 neutral resolution 依据。 |
| `disposition` | `OutboundDisposition` | eligible / rejected / blocked / pending。 |
| `correlation` | `MemberCorrelation` | 关联 Runtime reception、material、attempt 与 trace。 |

| 状态 | 作用 |
|---|---|
| `eligible` | committed source、target、purpose 与 body gate 均已满足,允许生成材料。 |
| `rejected` | source、purpose、target 或材料类别已知不合法。 |
| `blocked` | 正式 publication seam / route / source family 不可证明或存在冲突。 |
| `pending` | 等待必要 external resolution,不得形成可提交材料。 |

| 成员函数 | 作用 |
|---|---|
| `permits_material_creation()` | 仅 eligible 且 target resolution 可用时返回 true。 |
| `matches_reception(RuntimeMaterialReception reception)` | 检查 Runtime material、subject 与 correlation 一致。 |
| `is_fail_closed()` | 判断 rejected / blocked / pending 是否禁止正向出站。 |

| 工厂函数 | 作用 |
|---|---|
| `decide(RuntimeMaterialReception reception, InteractionPurpose purpose, ExternalContextResolution target_resolution, OutboundMaterialPolicy policy)` | 从 accepted reception 和正式 resolution 形成本地出站决定。 |

| 禁止事项 | 说明 |
|---|---|
| 不修改 Runtime material 语义 | member 只能决定是否及如何安全出站。 |
| eligible 不等于 material created / submitted / delivered | 五层状态必须保持分离。 |
| route pending 时不猜测默认目标 | `L2M-UP-004/005` 未闭口必须 blocked / pending。 |

## C2. `MemberOutboundMaterial`

| 项 | 内容 |
|---|---|
| 所属部分 | CP04 Outbound Boundary |
| 对象类型 | immutable body-free handoff material / local truth |
| 主要责任 | 固定 member 向正式外部边界提交的最小引用集合、用途、目标与安全裁剪信息。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `material_id` | `MemberOutboundMaterialId` | member 出站材料标识。 |
| `decision_ref` | `OutboundDecisionId` | 唯一来源出站决定。 |
| `runtime_material_ref` | `RuntimeSafeHandoffMaterialRef` | Runtime committed safe material 锚点。 |
| `runtime_outcome_ref` | `RuntimeOutcomeRef` | 来源 outcome 正式引用。 |
| `target_ref` | `OutboundTargetRef` | 已解析的正式目标。 |
| `purpose` | `InteractionPurpose` | 出站用途。 |
| `allowed_refs` | `List<TypedRef>` | 经 gate 允许交接的最小 typed refs。 |
| `redaction_profile_ref` | `RedactionProfileRef` | 正式安全裁剪依据引用。 |
| `material_digest` | `Digest` | 对允许字段集合的完整性关联。 |
| `correlation` | `MemberCorrelation` | 回链 reception / decision / publication。 |

该对象创建后不可变,无可迁移业务状态;是否已提交、投递或被下游接受由独立对象或外部引用表达。

| 成员函数 | 作用 |
|---|---|
| `is_body_free()` | 验证材料只含允许 metadata / typed refs,不含禁止正文。 |
| `matches_decision(OutboundDecision outbound_decision)` | 检查 source、target、purpose 与 correlation 一致。 |
| `supports_replay_context()` | 判断是否具备稳定 digest、idempotency 与 correlation 语境;不直接授权重放。 |

| 工厂函数 | 作用 |
|---|---|
| `create(OutboundDecision outbound_decision, RuntimeMaterialReception reception, List<TypedRef> allowed_refs, RedactionProfileRef redaction_profile_ref, OutboundMaterialPolicy policy)` | 仅从 eligible decision 创建 body-free member material。 |

| 禁止事项 | 说明 |
|---|---|
| 不复制 Runtime material body | member material 是最小 refs / metadata,不是 Runtime 输出副本。 |
| 不携带 event body、secret、hidden reasoning、provider response 或 tool receipt body | 任一出现即拒绝创建。 |
| 不把 material 当 Conversation fact / Artifact / report | 下游 truth 是否成立由对应 owner 决定。 |

## C3. `PublicationAttempt`

| 项 | 内容 |
|---|---|
| 所属部分 | CP04 Outbound Boundary |
| 对象类型 | append-only attempt record |
| 主要责任 | 记录 member 对正式 event / handoff publication seam 的准备、调用、反馈关联、阻塞和未知副作用。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `attempt_id` | `PublicationAttemptId` | 本地发布尝试标识。 |
| `material_ref` | `MemberOutboundMaterialId` | 被提交的 body-free member material。 |
| `target_ref` | `OutboundTargetRef` | 正式目标。 |
| `publication_boundary_ref` | `PublicationBoundaryRef` | transport-neutral 正式 seam。 |
| `status` | `PublicationAttemptStatus` | prepared / submitted / feedback_linked / blocked / unknown。 |
| `idempotency_key` | `IdempotencyKey` | 重复分类锚点。 |
| `submission_ref` | `Optional<PublicationSubmissionRef>` | seam invocation 的正式 / 本地 carrier 引用。 |
| `feedback_ref` | `Optional<DownstreamFeedbackRef>` | Bus / downstream 正式反馈引用。 |
| `gap_ref` | `Optional<PublicationGapId>` | 未闭合 publication gap。 |
| `attempted_at` | `Optional<Timestamp>` | 本地调用时点。 |

| 状态 | 作用 |
|---|---|
| `prepared` | 已从安全材料创建,尚未调用 publication seam。 |
| `submitted` | 已调用正式 seam,不表示 Bus delivered 或下游 accepted / observed。 |
| `feedback_linked` | 已追加关联正式反馈 ref,不改写出站决定。 |
| `blocked` | seam / route / precondition 不成立,没有正向调用。 |
| `unknown` | 无法确认调用副作用,必须建立 fence / gap。 |

| 成员函数 | 作用 |
|---|---|
| `mark_submitted(PublicationSubmissionRef submission_ref, Timestamp attempted_at)` | 记录 seam invocation,不宣称 delivery。 |
| `link_feedback(DownstreamFeedbackRef feedback_ref)` | 追加正式反馈引用并检查 attempt correlation。 |
| `open_gap(PublicationGap publication_gap)` | 将当前未闭合语义关联到独立 gap。 |
| `is_retry_safe(PublicationResolutionEvidence resolution_evidence)` | 只依据正式 resolution 与 idempotency 评估能否创建新 attempt。 |

| 工厂函数 | 作用 |
|---|---|
| `prepare(MemberOutboundMaterial material, PublicationBoundaryRef publication_boundary_ref, IdempotencyKey idempotency_key)` | 从安全 material 创建独立 prepared attempt。 |

| 禁止事项 | 说明 |
|---|---|
| submitted 不等于 delivered / observed / accepted | 外部状态只能由正式 owner ref 表达。 |
| unknown 不得自动 retry | 防止重复 publication / downstream side effect。 |
| feedback 不覆盖旧 attempt | duplicate / late / correction 形成新 link / trace fact。 |

## C4. `PublicationGap`

| 项 | 内容 |
|---|---|
| 所属部分 | CP04 Outbound Boundary |
| 对象类型 | gap record / local truth |
| 主要责任 | 显式表达出站决定或 publication attempt 与正式 route、delivery 或 downstream feedback 之间尚未闭合的差距。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `gap_id` | `PublicationGapId` | 本地缺口标识。 |
| `decision_ref` | `OutboundDecisionId` | 缺口所关联的本地决定。 |
| `attempt_ref` | `Optional<PublicationAttemptId>` | 已有尝试时回链;route 前置阻塞时可为空。 |
| `category` | `PublicationGapCategory` | route_unresolved / submission_unknown / delivery_failed / feedback_unresolved / contract_blocked。 |
| `status` | `PublicationGapStatus` | open / resolution_pending / resolved / superseded。 |
| `external_ref` | `Optional<DownstreamFeedbackRef>` | 用于解释 resolution 的正式外部引用。 |
| `safe_reason` | `SafeReasonCategory` | body-free 原因类别。 |
| `opened_at` | `Timestamp` | 缺口建立时点。 |
| `resolved_at` | `Optional<Timestamp>` | 有正式 resolution 时的本地关闭时点。 |

| 状态 | 作用 |
|---|---|
| `open` | 当前没有足够正式依据闭合缺口。 |
| `resolution_pending` | 已发起正式查询 / 对账,结果尚未成立。 |
| `resolved` | 已取得可引用的外部 resolution;不回滚决定或旧 attempt。 |
| `superseded` | 新 gap / attempt 已承接后续处理,旧记录仍保留。 |

| 成员函数 | 作用 |
|---|---|
| `request_resolution(ResolutionRequestRef resolution_request_ref)` | 标记进入显式对账,不猜测结果。 |
| `resolve(DownstreamFeedbackRef feedback_ref, Timestamp resolved_at)` | 以正式反馈 ref 关闭本地 gap。 |
| `supersede(PublicationGap successor_gap)` | 关联后继 gap,保留当前历史。 |
| `blocks_new_attempt(PublicationResolutionEvidence resolution_evidence)` | unknown side effect 未解析时阻止新 attempt。 |

| 工厂函数 | 作用 |
|---|---|
| `open(OutboundDecision outbound_decision, Optional<PublicationAttempt> attempt, PublicationGapCategory category, SafeReasonCategory safe_reason, Timestamp opened_at)` | 为 route、submission 或 feedback 未闭合建立显式 gap。 |

| 禁止事项 | 说明 |
|---|---|
| gap resolved 不等于 publication success | 只表示本地未知被正式信息闭合。 |
| delivery failure 不回滚 decision / material | local truth first。 |
| 不用覆盖 / 删除方式“修复”历史 | 后续处理形成新 attempt、link 或 successor gap。 |

## C5. `OutboundMaterialPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | CP04 Outbound Boundary |
| 对象类型 | domain policy / safety guard |
| 主要责任 | 保护 committed source、target、purpose、body-free、最小引用、正式 seam 与 unknown-side-effect 边界。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_requirement` | `CommittedSourceRequirement` | 只接受 CP03 已验证的 Runtime committed material。 |
| `target_requirement` | `FormalTargetRequirement` | 目标和 seam 必须由正式 resolution 证明。 |
| `purpose_requirement` | `InteractionPurposeRequirement` | 用途必须受支持且与目标匹配。 |
| `body_boundary` | `ForbiddenBodyBoundary` | 禁止 raw body、secret、hidden reasoning 等材料。 |
| `reference_minimization_rule` | `ReferenceMinimizationRule` | 只允许当前 purpose 所需 typed refs。 |
| `unknown_handling` | `UnknownHandlingMode` | unknown submission / feedback 必须 fenced。 |

该 policy 无业务生命周期状态。

| 成员函数 | 作用 |
|---|---|
| `evaluate_decision(RuntimeMaterialReception reception, InteractionPurpose purpose, ExternalContextResolution target_resolution)` | 判断 eligible / rejected / blocked / pending。 |
| `validate_material(List<TypedRef> allowed_refs, RedactionProfileRef redaction_profile_ref, ForbiddenBodyInspection inspection)` | 校验最小引用与 body-free 条件。 |
| `evaluate_attempt(MemberOutboundMaterial material, ExternalContextResolution publication_resolution)` | 判断正式 seam 是否可调用。 |
| `requires_fence(PublicationAttempt attempt, Optional<PublicationGap> gap)` | 判断 unknown side effect 是否禁止新 attempt。 |

| 工厂函数 | 作用 |
|---|---|
| `formal_body_free_only()` | 创建只允许 committed source、正式 target / seam 与 body-free material 的 policy。 |

| 禁止事项 | 说明 |
|---|---|
| 不定义 Bus route / retry / DLQ 或 downstream acceptance | 这些属于外部 owner 与后续 exact contract。 |
| 不允许配置绕过 source / body / target / purpose gate | 这些是架构 invariant。 |
| 不把 external feedback 变成本地重裁决输入 | feedback 只关联 attempt / gap / trace。 |

## 6. CP04 对象正式化停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 的 5 个候选全部处理 | pass | 5/5 独立成节。 |
| decision / material / attempt / gap 分层 | pass | 无单一 outbound success 对象。 |
| Runtime / Bus / downstream truth 无复制 | pass | committed source 与 external feedback 只作正式 ref。 |
| body-free 与最小引用 gate 完整 | pass | 禁止正文、secret、hidden reasoning 和 provider / tool body。 |
| route pending / unknown side effect 显式 | pass | blocked / pending / gap / fence,无默认 route 或盲重放。 |
| Step 8 / 9 可反查 | pass | decision、publication、feedback / gap 路径和状态均可展开。 |

CP04 结论为 `completed / pass / stop_review`。下一允许模块是 CP05 Interaction Trace 对象正式化。
