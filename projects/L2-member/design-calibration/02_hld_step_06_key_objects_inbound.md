# Step 6 附录 CP02. Inbound Boundary 对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 对应 capability: `02_hld_step_05_components_boundary.md` §8
> 状态: completed / pass / stop_review
> 本文件只定义概要对象骨架;授权瞬时检查材料不得成为字段或持久对象。

## B1. `SubscriptionScopeDecision`

| 项 | 内容 |
|---|---|
| 所属部分 | CP02 Inbound Boundary |
| 对象类型 | decision record / local truth |
| 主要责任 | 固定某个 admitted subject 在特定来源语境下的 member 订阅范围决定。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `scope_decision_id` | `SubscriptionScopeDecisionId` | 本地范围决定标识。 |
| `presence_ref` | `MemberPresenceId` | 决定归属的在场实例。 |
| `subject_ref` | `ProjectMemberRef` | 订阅执行主语。 |
| `scope` | `MemberSubscriptionScope` | 可消费事实的受控范围。 |
| `source_refs` | `List<TypedRef>` | identity / role / policy 等正式来源引用。 |
| `status` | `SubscriptionScopeStatus` | active / superseded / rejected / blocked。 |
| `reason_category` | `SafeReasonCategory` | body-free 决定理由。 |
| `revision` | `SubscriptionScopeRevision` | 显式范围变化序号。 |

| 状态 | 作用 |
|---|---|
| `active` | 当前允许用于入站匹配的已成立范围。 |
| `superseded` | 已由新决定替代,只用于历史解释。 |
| `rejected` | 请求的范围无效或越界。 |
| `blocked` | 来源 missing / stale / conflict / unknown,不能正向建立。 |

| 成员函数 | 作用 |
|---|---|
| `covers(InboundFactDescriptor fact_descriptor)` | 判断事实描述是否落在当前范围,不读取正文。 |
| `can_screen()` | 仅 active 且来源仍满足必要条件时允许筛选。 |
| `is_current(SubscriptionScopeRevision current_revision)` | 判断是否是消费方声明的当前 revision。 |

| 工厂函数 | 作用 |
|---|---|
| `decide(MemberPresence presence, MemberSubscriptionScope proposed_scope, ExternalContextResolution source_resolution, SubscriptionScopePolicy policy)` | 从已验证 presence 与外部来源形成范围决定。 |

| 禁止事项 | 说明 |
|---|---|
| 不从 display name / 私有字符串猜范围 | 必须回指正式 subject / role / source。 |
| 不原地扩权 | 范围变化形成新 revision / decision。 |
| 不成为 Governance authorization | 它只表达 member 的订阅边界决定。 |

## B2. `InboundFactRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | CP02 Inbound Boundary |
| 对象类型 | immutable intake record / local truth |
| 主要责任 | 记录 member 看见一条可识别入站事实语境,只保留引用、来源、关联和瞬时检查标记。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `inbound_fact_id` | `InboundFactRecordId` | 本地入站记录标识。 |
| `source_event_ref` | `SourceEventRef` | 回指 Bus / source 事实,不保存 payload。 |
| `source_authority_ref` | `SourceAuthorityRef` | 声明事实来源 owner。 |
| `scope_decision_ref` | `SubscriptionScopeDecisionId` | 入站匹配所依据的范围决定。 |
| `intake_disposition` | `InboundIntakeDisposition` | accepted / duplicate / unsupported / blocked。 |
| `inspection_marker` | `TransientInspectionMarker` | 只证明发生过授权瞬时检查及其分类,不含正文。 |
| `correlation` | `MemberCorrelation` | 关联 subject、source 与后续 screening。 |
| `received_at` | `Timestamp` | member 本地承接时点。 |

| 状态 | 作用 |
|---|---|
| `accepted` | 来源 / scope / envelope 可识别,允许进入 screening。 |
| `duplicate` | 已识别重复 source fact,不创建第二主线。 |
| `unsupported` | contract / version / fact kind 不在当前正式范围。 |
| `blocked` | 来源或安全前置不可判定,不进入正向筛选。 |

| 成员函数 | 作用 |
|---|---|
| `can_screen()` | 仅 accepted 允许形成新的 screening decision。 |
| `matches_scope(SubscriptionScopeDecision scope_decision)` | 检查 scope ref / subject / source 一致。 |
| `is_body_free()` | 确认记录无 raw payload、secret 或 hidden material。 |

| 工厂函数 | 作用 |
|---|---|
| `record(SourceEventRef source_event_ref, SourceAuthorityRef source_authority_ref, SubscriptionScopeDecision scope_decision, TransientInspectionMarker inspection_marker, MemberCorrelation correlation)` | 从已校验 envelope 与瞬时检查结果形成 body-free intake record。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存或透明转发 raw body | 瞬时检查不是持久化例外。 |
| 不把 Bus delivery 写成本地 intake success | 只记录 member 本地承接语境。 |
| duplicate 不得创建第二事实主线 | 只形成幂等分类 / trace link。 |

## B3. `ScreeningDecision`

| 项 | 内容 |
|---|---|
| 所属部分 | CP02 Inbound Boundary |
| 对象类型 | decision record / local truth |
| 主要责任 | 对一条 accepted inbound fact 形成 passed / degraded / blocked / pending 的 source-anchored member 预筛结论。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `screening_decision_id` | `ScreeningDecisionId` | 本地筛选决定标识。 |
| `inbound_fact_ref` | `InboundFactRecordId` | 被筛选的 body-free 入站记录。 |
| `scope_decision_ref` | `SubscriptionScopeDecisionId` | 决定所依据的订阅范围。 |
| `rule_resolution_ref` | `ExternalContextResolutionId` | 外部 rule / policy 来源的中立解析。 |
| `disposition` | `ScreeningDisposition` | passed / degraded / blocked / pending。 |
| `reason_category` | `SafeReasonCategory` | 不包含规则正文的理由分类。 |
| `source_refs` | `List<TypedRef>` | 可追溯依据引用。 |
| `correlation` | `MemberCorrelation` | 关联入站与后续 Runtime delivery。 |

| 状态 | 作用 |
|---|---|
| `passed` | member 预筛允许按受控语境进入 Runtime delivery 判断。 |
| `degraded` | 仅允许按明确收窄语境继续,不等于默认放行。 |
| `blocked` | 已知违反边界或正式来源要求,不得提交 Runtime。 |
| `pending` | 规则来源或必要判断未闭合,等待 resolution,不得正向提交。 |

| 成员函数 | 作用 |
|---|---|
| `permits_runtime_delivery()` | 仅 passed 或具备明确受控降级语义时允许下一步评估。 |
| `is_fail_closed()` | 判断 blocked / pending 是否禁止继续。 |
| `matches_fact(InboundFactRecord inbound_fact)` | 检查 source / scope / correlation 一致。 |

| 工厂函数 | 作用 |
|---|---|
| `decide(InboundFactRecord inbound_fact, SubscriptionScopeDecision scope_decision, ExternalContextResolution rule_resolution, ScreeningInputSummary inspection_summary, InboundScreeningPolicy policy)` | 从 body-free 记录、瞬时检查摘要和正式来源解析形成预筛结论。 |

| 禁止事项 | 说明 |
|---|---|
| 不等于 Policy / Approval decision | Governance 仍是 policy truth owner。 |
| 不等于 Runtime admission | Runtime 是否受理由 Runtime 决定。 |
| 不保存规则 / 事件正文 | 只保留 source refs 与安全分类。 |

## B4. `SubscriptionScopePolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | CP02 Inbound Boundary |
| 对象类型 | domain policy / guard |
| 主要责任 | 判断提议订阅范围是否与 project subject、presence 和正式 identity / role 来源一致。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `subject_scope_rule` | `ProjectSubjectScopeRule` | 固定 project-scoped 边界。 |
| `required_source_kinds` | `Set<SourceResolutionKind>` | 范围决定所需正式来源类别。 |
| `scope_change_mode` | `ScopeChangeMode` | 固定 explicit_revision。 |
| `unknown_handling` | `UnknownHandlingMode` | 固定 fail_closed。 |

该 policy 无业务生命周期状态。

| 成员函数 | 作用 |
|---|---|
| `evaluate(MemberPresence presence, MemberSubscriptionScope proposed_scope, ExternalContextResolution source_resolution)` | 判断范围可否 active / rejected / blocked。 |
| `prevents_scope_expansion(SubscriptionScopeDecision current_scope, MemberSubscriptionScope proposed_scope)` | 检查无正式新来源的扩权。 |

| 工厂函数 | 作用 |
|---|---|
| `project_scoped()` | 创建当前 project-scoped / fail-closed scope policy。 |

| 禁止事项 | 说明 |
|---|---|
| 不读取私有 allowlist | 范围来源必须属于正式 owner。 |
| 不静默继承 stale source | stale / conflict 形成 blocked 新决定。 |
| 不允许配置改变 subject owner | project subject 是架构 invariant。 |

## B5. `InboundScreeningPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | CP02 Inbound Boundary |
| 对象类型 | domain policy / safety guard |
| 主要责任 | 将已验证 scope、rule resolution 与瞬时检查摘要转为四态 member screening,并保护正文边界。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `allowed_dispositions` | `Set<ScreeningDisposition>` | 固定四态输出集合。 |
| `source_requirement` | `ScreeningSourceRequirement` | 要求 rule source 可回链且 freshness 满足用途。 |
| `body_boundary` | `ForbiddenBodyBoundary` | 固定禁止持久化 / raw forwarding。 |
| `unknown_handling` | `UnknownHandlingMode` | unknown / conflict 只能 pending / blocked / explicit degraded。 |

该 policy 无业务生命周期状态。

| 成员函数 | 作用 |
|---|---|
| `evaluate(InboundFactRecord inbound_fact, SubscriptionScopeDecision scope_decision, ExternalContextResolution rule_resolution, ScreeningInputSummary inspection_summary)` | 形成四态处置判断。 |
| `rejects_persistence(InspectionMaterialDescriptor material_descriptor)` | 判断材料是否违反瞬时检查边界。 |
| `permits_degraded(ScreeningInputSummary inspection_summary, ExternalContextResolution rule_resolution)` | 仅在正式收窄规则明确时允许 degraded。 |

| 工厂函数 | 作用 |
|---|---|
| `fail_closed()` | 创建不含本地 allowlist 的正式 screening policy。 |

| 禁止事项 | 说明 |
|---|---|
| 不内置 allowlist / denylist / risk taxonomy | 这些定义必须来自正式 owner。 |
| 不做 LLM 推理或内容语义回答 | 只做受控边界筛选。 |
| 不允许 unknown 默认 passed | 未闭口必须保守处置。 |

## 6. CP02 对象正式化停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 的 5 个候选全部处理 | pass | 5/5 独立成节。 |
| capability 来源完整 | pass | scope、fact intake、screening 与两类 guard 均有来源。 |
| body 生命周期边界 | pass | raw body 不在任何字段;仅 `TransientInspectionMarker` / summary。 |
| screening / Policy / Runtime 状态分离 | pass | 四态只属于 member screening。 |
| 字段 / 函数粒度合规 | pass | 有类型,无完整 schema / implementation。 |
| Step 8 / 9 可反查 | pass | inbound 主流程与状态对象齐全。 |

CP02 结论为 `completed / pass / stop_review`。下一允许模块是 CP03 Runtime Mediation 对象正式化。
