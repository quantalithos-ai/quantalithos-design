# Step 6 附录 CP05. Interaction Trace 对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 对应 capability: `02_hld_step_05_components_boundary.md` §11
> 状态: completed / pass / stop_review
> 本文件只定义 member 的 body-free trace link、correlation gap、observation material 与本地提交尝试;源业务事实、完整日志、metric backend、evidence、archive 与 observed truth 均外置。

## C1. `InteractionTraceEntry`

| 项 | 内容 |
|---|---|
| 所属部分 | CP05 Interaction Trace |
| 对象类型 | immutable trace link / local truth |
| 主要责任 | 以同一 subject、purpose 与 correlation 将 CP01~04 已提交本地事实及必要外部来源引用连接为 body-free 交互轨迹。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `trace_entry_id` | `InteractionTraceEntryId` | 本地追溯条目标识。 |
| `subject_ref` | `ProjectMemberRef` | 交互所属项目型执行主语。 |
| `fact_ref` | `MemberCommittedFactRef` | 被追溯的 CP01~04 已提交事实引用。 |
| `fact_kind` | `MemberFactKind` | presence / scope / screening / runtime_delivery / outbound / publication 等低基数类别。 |
| `source_refs` | `List<TypedRef>` | 解释该事实所需的最小来源引用。 |
| `predecessor_refs` | `List<InteractionTraceEntryId>` | 同一关联链中的既有 trace links。 |
| `purpose` | `InteractionPurpose` | 交互用途的安全分类。 |
| `correlation` | `MemberCorrelation` | 贯穿入站、Runtime 与出站的关联锚点。 |
| `recorded_at` | `Timestamp` | 本地 link 提交时点。 |

该 entry 创建后不可变;它只证明“member 已记录该关联”,不证明来源正文、外部投递、observed 或 evidence verdict。

| 成员函数 | 作用 |
|---|---|
| `matches_fact(MemberCommittedFactRef fact_ref)` | 检查 entry 是否回指目标本地事实。 |
| `belongs_to(ProjectMemberRef subject_ref, MemberCorrelation correlation)` | 检查主体和关联语境一致。 |
| `is_body_free()` | 验证只含 typed refs、时间和低基数分类。 |

| 工厂函数 | 作用 |
|---|---|
| `append(MemberCommittedFactRef fact_ref, ProjectMemberRef subject_ref, MemberFactKind fact_kind, List<TypedRef> source_refs, List<InteractionTraceEntryId> predecessor_refs, InteractionPurpose purpose, MemberCorrelation correlation, TraceMaterialPolicy policy)` | 从已提交 source fact 形成 immutable body-free link。 |

| 禁止事项 | 说明 |
|---|---|
| 不复制 source fact / event body | trace 只保存引用和安全分类。 |
| 不把 entry 当 central event truth 或 complete log | 各业务事实仍由 CP01~04 拥有。 |
| trace append 失败不回滚 source fact | 失败必须转为独立 gap。 |

## C2. `InteractionGap`

| 项 | 内容 |
|---|---|
| 所属部分 | CP05 Interaction Trace |
| 对象类型 | correlation gap record / local truth |
| 主要责任 | 显式表达预期交互关联与当前可证明引用之间的缺失、冲突、阻塞或未知。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `gap_id` | `InteractionGapId` | 本地关联缺口标识。 |
| `subject_ref` | `ProjectMemberRef` | 缺口所属主语。 |
| `expected_ref_kind` | `MemberFactKind` | 预期关联的事实类别。 |
| `actual_refs` | `List<TypedRef>` | 当前可证明的最小引用集合。 |
| `category` | `InteractionGapCategory` | missing_ref / correlation_conflict / trace_append_failed / source_unresolved / ordering_unknown。 |
| `status` | `InteractionGapStatus` | open / blocked / resolution_pending / resolved / unknown / superseded。 |
| `safe_reason` | `SafeReasonCategory` | 不含正文的原因类别。 |
| `correlation` | `MemberCorrelation` | 缺口所在交互语境。 |
| `resolution_ref` | `Optional<GapResolutionRef>` | 闭合缺口的正式 / 本地 resolution 引用。 |
| `opened_at` | `Timestamp` | 缺口建立时点。 |
| `resolved_at` | `Optional<Timestamp>` | 有正式依据时的本地关闭时点。 |

| 状态 | 作用 |
|---|---|
| `open` | 关联不完整且尚未开始正式 resolution。 |
| `blocked` | 所需 owner / seam 未闭口或不可用。 |
| `resolution_pending` | 已发起对账,尚无结果。 |
| `resolved` | 已通过可引用依据闭合,不改写旧 source / trace。 |
| `unknown` | 无法判断缺口影响,只允许保守暴露。 |
| `superseded` | 后继 gap 已承接处理,当前历史保留。 |

| 成员函数 | 作用 |
|---|---|
| `request_resolution(ResolutionRequestRef resolution_request_ref)` | 记录显式对账请求并进入 resolution_pending。 |
| `resolve(GapResolutionRef resolution_ref, Timestamp resolved_at)` | 追加正式 resolution,不补造缺失事实。 |
| `supersede(InteractionGap successor_gap)` | 关联后继 gap 并保留当前记录。 |
| `degrades_trace_read()` | 判断 Query / projection 是否必须返回 incomplete / degraded。 |

| 工厂函数 | 作用 |
|---|---|
| `open(ProjectMemberRef subject_ref, MemberFactKind expected_ref_kind, List<TypedRef> actual_refs, InteractionGapCategory category, SafeReasonCategory safe_reason, MemberCorrelation correlation, Timestamp opened_at)` | 从可证明现状建立 body-free gap。 |

| 禁止事项 | 说明 |
|---|---|
| 不猜测补齐 correlation | 缺引用保持 open / unknown。 |
| resolved 不等于来源事实被修复 | 只表示 gap 获得解释或后继关联。 |
| 不删除旧 gap | correction / late link 追加为新事实。 |

## C3. `ObservationMaterial`

| 项 | 内容 |
|---|---|
| 所属部分 | CP05 Interaction Trace |
| 对象类型 | immutable low-sensitive handoff material / local truth |
| 主要责任 | 从已提交 trace entries / gaps 形成最小必要、body-free、低基数、可关联的观测交接材料。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `observation_material_id` | `ObservationMaterialId` | 本地观测材料标识。 |
| `subject_ref` | `ProjectMemberRef` | 材料所属主语。 |
| `trace_refs` | `List<InteractionTraceEntryId>` | 允许交接的 trace links。 |
| `gap_refs` | `List<InteractionGapId>` | 需要显式暴露的安全 gap refs。 |
| `categories` | `Set<ObservationCategory>` | 状态 / 决定 / 失败 / gap 的低基数分类。 |
| `safe_dimensions` | `Map<SafeDimensionName, SafeDimensionValue>` | 受控低基数维度,不得放正文或任意标签。 |
| `redaction_profile_ref` | `RedactionProfileRef` | 正式裁剪依据引用。 |
| `material_digest` | `Digest` | 允许字段集合的完整性关联。 |
| `correlation` | `MemberCorrelation` | 回链 source facts 与 observation attempt。 |

该 material 创建后不可变,没有 delivered / observed 状态。

| 成员函数 | 作用 |
|---|---|
| `is_body_free()` | 验证材料不含正文、secret、hidden reasoning 或完整日志。 |
| `is_low_cardinality()` | 校验 categories / safe dimensions 满足受控 taxonomy。 |
| `matches_trace(List<InteractionTraceEntry> trace_entries, List<InteractionGap> gaps)` | 检查主体、refs 与 correlation 一致。 |

| 工厂函数 | 作用 |
|---|---|
| `create(ProjectMemberRef subject_ref, List<InteractionTraceEntry> trace_entries, List<InteractionGap> gaps, Set<ObservationCategory> categories, Map<SafeDimensionName, SafeDimensionValue> safe_dimensions, RedactionProfileRef redaction_profile_ref, TraceMaterialPolicy policy)` | 从 committed trace / gap 形成安全材料。 |

| 禁止事项 | 说明 |
|---|---|
| 不携带 complete log、raw event、model / tool body 或 secret | 观测便利不能突破 forbidden-body 边界。 |
| 不生成 evidence / verdict / report | 这些由正式 owner 和真实执行产生。 |
| material prepared 不等于 backend observed | 外部 ingest / storage / query truth 不归 member。 |

## C4. `ObservationAttempt`

| 项 | 内容 |
|---|---|
| 所属部分 | CP05 Interaction Trace |
| 对象类型 | append-only attempt record |
| 主要责任 | 记录 member 向正式 observation boundary 提交安全材料的准备、调用、阻塞、未知和反馈关联。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `attempt_id` | `ObservationAttemptId` | 本地观测提交尝试标识。 |
| `material_ref` | `ObservationMaterialId` | 被提交的 body-free observation material。 |
| `observation_boundary_ref` | `ObservationBoundaryRef` | transport-neutral 正式 seam。 |
| `status` | `ObservationAttemptStatus` | prepared / submitted / feedback_linked / blocked / unknown。 |
| `idempotency_key` | `IdempotencyKey` | duplicate / replay 分类锚点。 |
| `submission_ref` | `Optional<ObservationSubmissionRef>` | seam invocation 引用。 |
| `feedback_ref` | `Optional<ObservationFeedbackRef>` | 正式 backend / consumer 反馈引用。 |
| `safe_reason` | `Optional<SafeReasonCategory>` | blocked / unknown 的低敏原因。 |
| `attempted_at` | `Optional<Timestamp>` | 本地调用时点。 |

| 状态 | 作用 |
|---|---|
| `prepared` | 安全材料已就绪,尚未调用 observation seam。 |
| `submitted` | 已调用正式 seam,不表示 delivered / ingested / observed。 |
| `feedback_linked` | 已关联正式 feedback ref,不改写 trace / source fact。 |
| `blocked` | producer / route / contract 未闭口或安全门禁失败。 |
| `unknown` | 无法确认调用副作用,禁止盲目重放。 |

| 成员函数 | 作用 |
|---|---|
| `mark_submitted(ObservationSubmissionRef submission_ref, Timestamp attempted_at)` | 记录 seam invocation。 |
| `link_feedback(ObservationFeedbackRef feedback_ref)` | 追加正式反馈引用并检查 correlation。 |
| `mark_unknown(SafeReasonCategory safe_reason)` | 建立 unknown fence。 |
| `is_retry_safe(ObservationResolutionEvidence resolution_evidence)` | 依据正式 resolution 与 idempotency 评估新 attempt。 |

| 工厂函数 | 作用 |
|---|---|
| `prepare(ObservationMaterial material, ObservationBoundaryRef observation_boundary_ref, IdempotencyKey idempotency_key)` | 创建独立 prepared attempt。 |

| 禁止事项 | 说明 |
|---|---|
| submitted / feedback-linked 不等于 observed | observed truth 只来自正式观测 owner。 |
| 交接失败不回滚 source / trace / material | 只记录本地失败和 gap。 |
| 后续 attempt 不覆盖旧 attempt | 每次调用为独立追加事实。 |

## C5. `TraceMaterialPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | CP05 Interaction Trace |
| 对象类型 | domain policy / trace and material guard |
| 主要责任 | 保护 committed-source-only、body-free、最小引用、低敏、低基数、correlation 与 observation seam 边界。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_requirement` | `CommittedMemberFactRequirement` | 只追溯 CP01~04 已提交本地事实。 |
| `reference_minimization_rule` | `ReferenceMinimizationRule` | 只保存解释链所需 refs。 |
| `body_boundary` | `ForbiddenBodyBoundary` | 禁止正文、secret、hidden reasoning、完整日志。 |
| `cardinality_rule` | `ObservationCardinalityRule` | category / dimension 必须来自低基数 taxonomy。 |
| `correlation_rule` | `TraceCorrelationRule` | subject、purpose、source 与前后 links 必须可校验。 |
| `unknown_handling` | `UnknownHandlingMode` | 未闭口 route / side effect 必须 blocked / fenced。 |

该 policy 无业务生命周期状态。

| 成员函数 | 作用 |
|---|---|
| `validate_trace_source(MemberCommittedFactRef fact_ref, List<TypedRef> source_refs)` | 判断 source 是否已提交且 refs 足够、最小。 |
| `validate_correlation(ProjectMemberRef subject_ref, InteractionPurpose purpose, MemberCorrelation correlation, List<InteractionTraceEntry> predecessors)` | 校验同一交互链的主体与关联一致性。 |
| `validate_observation(Set<ObservationCategory> categories, Map<SafeDimensionName, SafeDimensionValue> safe_dimensions, ForbiddenBodyInspection inspection)` | 执行低敏、低基数、body-free gate。 |
| `evaluate_handoff(ObservationMaterial material, ExternalContextResolution observation_resolution)` | 判断 observation seam 是否可调用。 |

| 工厂函数 | 作用 |
|---|---|
| `minimal_low_sensitive_only()` | 创建 committed refs only、body-free、低基数且 fail-closed 的 policy。 |

| 禁止事项 | 说明 |
|---|---|
| 不定义 observability backend schema / retention / query | 本仓只形成安全材料和 attempt。 |
| 不允许配置放宽 body / cardinality / source gate | 它们是架构 invariant。 |
| 不用 trace / observation 结果重裁 source fact | trace 与观测都是后置关联。 |

## 6. CP05 对象正式化停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 的 5 个候选全部处理 | pass | 5/5 独立成节。 |
| source fact / trace / gap 分层 | pass | trace 只追加 refs,失败不回滚来源。 |
| material / attempt / observed 分层 | pass | 不声明 backend ingest、delivery 或 observed。 |
| body-free / low-sensitive / low-cardinality gate 完整 | pass | complete log、正文、secret、evidence 均排除。 |
| incomplete / late / unknown 显式 | pass | gap、feedback link 与 fence 均追加处理。 |
| Step 8 / 9 可反查 | pass | trace append、gap resolution、material / attempt 路径均可展开。 |

CP05 结论为 `completed / pass / stop_review`。下一允许模块是 CP06 External Context Mirror 对象正式化。
