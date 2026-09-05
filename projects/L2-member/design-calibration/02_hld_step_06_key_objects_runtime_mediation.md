# Step 6 附录 CP03. Runtime Mediation 对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 对应 capability: `02_hld_step_05_components_boundary.md` §9
> 状态: completed / pass / stop_review
> 本文件定义 member 侧 local truth;`RuntimeTriggerContext`、admission、run、outcome 与 handoff truth 均归 `L2-runtime`。

## C1. `RuntimeDeliveryDecision`

| 项 | 内容 |
|---|---|
| 所属部分 | CP03 Runtime Mediation |
| 对象类型 | decision record / local truth |
| 主要责任 | 判断一条 member screening fact 是否应以受控形态提交 Runtime entry,并固定来源、scope、purpose 与 mapping availability。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `delivery_decision_id` | `RuntimeDeliveryDecisionId` | 本地投递决定标识。 |
| `screening_decision_ref` | `ScreeningDecisionId` | 只从允许继续的 member screening 形成。 |
| `inbound_fact_ref` | `InboundFactRecordId` | 回指 body-free 入站事实记录。 |
| `subject_ref` | `ProjectMemberRef` | Runtime trigger 归属主语。 |
| `runtime_boundary_ref` | `RuntimeBoundaryRef` | 目标正式 Runtime entry seam。 |
| `entry_contract_ref` | `Optional<RuntimeEntryContractRef>` | 已闭口时引用正式 mapping;未闭口为空并 blocked。 |
| `disposition` | `RuntimeDeliveryDisposition` | eligible / rejected / blocked / pending。 |
| `correlation` | `MemberCorrelation` | 关联入站、screening、submission 与 Runtime result。 |

| 状态 | 作用 |
|---|---|
| `eligible` | local prerequisites 与 formal mapping 足以创建 submission attempt。 |
| `rejected` | screening、subject、scope 或 material shape 已知不合法。 |
| `blocked` | entry contract / Runtime boundary 不可用或冲突。 |
| `pending` | 等待 source resolution,不得提交。 |

| 成员函数 | 作用 |
|---|---|
| `permits_submission()` | 仅 eligible 且 contract ref 可用时允许创建 attempt。 |
| `matches_screening(ScreeningDecision screening_decision)` | 检查 fact / subject / correlation 一致。 |
| `is_fail_closed()` | 判断 rejected / blocked / pending 是否禁止调用 Runtime。 |

| 工厂函数 | 作用 |
|---|---|
| `decide(ScreeningDecision screening_decision, InboundFactRecord inbound_fact, RuntimeBoundaryRef runtime_boundary_ref, ExternalContextResolution contract_resolution, RuntimeMediationPolicy policy)` | 形成本地 controlled-delivery 决定;不自行构造 Runtime truth。 |

| 禁止事项 | 说明 |
|---|---|
| 不把 screening passed 写成 Runtime accepted | 两个 owner 的决定必须分开。 |
| 不在 mapping pending 时私造 trigger schema | `L2M-UP-003` 未闭口只允许 blocked。 |
| 不携带 raw body | 只使用 fact / scope / source refs 和受控安全语境。 |

## C2. `RuntimeSubmissionAttempt`

| 项 | 内容 |
|---|---|
| 所属部分 | CP03 Runtime Mediation |
| 对象类型 | append-only attempt record |
| 主要责任 | 记录 member 对 Runtime entry seam 的本地准备、提交、阻塞、未知与结果关联。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `attempt_id` | `RuntimeSubmissionAttemptId` | 本地提交尝试标识。 |
| `delivery_decision_ref` | `RuntimeDeliveryDecisionId` | 被执行的 local decision。 |
| `runtime_boundary_ref` | `RuntimeBoundaryRef` | 被调用的正式 seam。 |
| `status` | `RuntimeSubmissionAttemptStatus` | prepared / submitted / result_linked / blocked / unknown。 |
| `idempotency_key` | `IdempotencyKey` | Runtime entry 重复分类锚点。 |
| `submission_ref` | `Optional<RuntimeSubmissionRef>` | member 调用 seam 的本地 / formal carrier 引用。 |
| `result_link_ref` | `Optional<RuntimeResultLinkId>` | 关联后续 Runtime result link。 |
| `attempted_at` | `Optional<Timestamp>` | 本地调用时点。 |

| 状态 | 作用 |
|---|---|
| `prepared` | attempt 已从 eligible decision 创建,尚未调用 seam。 |
| `submitted` | 已调用 Runtime entry,不表示 accepted 或 run created。 |
| `result_linked` | 已关联正式 Runtime result ref。 |
| `blocked` | mapping / boundary / local precondition 不成立,未正向提交。 |
| `unknown` | 无法确认提交副作用,禁止盲重放。 |

| 成员函数 | 作用 |
|---|---|
| `mark_submitted(RuntimeSubmissionRef submission_ref, Timestamp attempted_at)` | 记录本地 seam invocation。 |
| `link_result(RuntimeResultLink result_link)` | 关联 Runtime 正式结果引用。 |
| `mark_unknown(UnknownReason reason)` | 建立 unknown fence。 |
| `is_retry_safe(RuntimeResolutionEvidence resolution_evidence)` | 根据正式 resolution / idempotency 判断是否可评估新 attempt。 |

| 工厂函数 | 作用 |
|---|---|
| `prepare(RuntimeDeliveryDecision delivery_decision, IdempotencyKey idempotency_key)` | 仅从 eligible decision 建立 prepared attempt。 |

| 禁止事项 | 说明 |
|---|---|
| submitted 不等于 Runtime accepted | acceptance 只经 `RuntimeResultLink` 引用。 |
| unknown 不得自动 retry | 防止重复 run / side effect。 |
| 新 attempt 不覆盖旧记录 | 每次提交有独立 idempotency / correlation。 |

## C3. `RuntimeResultLink`

| 项 | 内容 |
|---|---|
| 所属部分 | CP03 Runtime Mediation |
| 对象类型 | immutable external-result link / local truth |
| 主要责任 | 把一次 member submission attempt 与 Runtime admission / blocked result 的正式引用及安全分类关联起来。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `result_link_id` | `RuntimeResultLinkId` | 本地关联标识。 |
| `attempt_ref` | `RuntimeSubmissionAttemptId` | 对应 member submission attempt。 |
| `runtime_result_ref` | `RuntimeAdmissionDecisionRef` | Runtime 正式 admission / result 引用。 |
| `classification` | `RuntimeResultClassification` | accepted / rejected / waiting / blocked / unknown。 |
| `source_ref` | `RuntimeSourceRef` | 证明结果来自正式 Runtime boundary。 |
| `correlation` | `MemberCorrelation` | 关联 inbound -> screening -> attempt -> result。 |
| `linked_at` | `Timestamp` | 本地关联时点。 |

该 link 形成后不可变;classification 表达所引用 external result 的安全类别,不是 member 可迁移生命周期。

| 成员函数 | 作用 |
|---|---|
| `matches_attempt(RuntimeSubmissionAttempt attempt)` | 检查 submission / correlation 一致。 |
| `runtime_accepted()` | 仅当正式引用分类为 accepted 时返回 true,仍不表示 run completed。 |
| `is_late(RuntimeSubmissionAttempt attempt)` | 判断结果是否晚于当前 active correlation。 |

| 工厂函数 | 作用 |
|---|---|
| `link(RuntimeSubmissionAttempt attempt, RuntimeAdmissionDecisionRef runtime_result_ref, RuntimeResultClassification classification, RuntimeSourceRef source_ref)` | 形成 body-free external-result link。 |

| 禁止事项 | 说明 |
|---|---|
| 不复制 RuntimeAdmissionDecision 字段 / truth | 只保存正式 ref 与 member 所需安全分类。 |
| accepted 不等于 run / outcome / completion | Runtime 后续状态完全外置。 |
| late / duplicate 不得逆写既有 attempt | 形成新 link / trace marker。 |

## C4. `RuntimeMaterialReception`

| 项 | 内容 |
|---|---|
| 所属部分 | CP03 Runtime Mediation |
| 对象类型 | reception record / local truth |
| 主要责任 | 记录 member 对 Runtime committed `SafeHandoffMaterial` 正式引用的校验、承接和重复 / 迟到分类。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `reception_id` | `RuntimeMaterialReceptionId` | 本地承接标识。 |
| `runtime_material_ref` | `RuntimeSafeHandoffMaterialRef` | Runtime committed safe material 引用。 |
| `runtime_outcome_ref` | `RuntimeOutcomeRef` | 材料所锚定的 Runtime local outcome。 |
| `source_ref` | `RuntimeSourceRef` | 正式 producer / boundary 来源。 |
| `disposition` | `RuntimeMaterialReceptionDisposition` | accepted / rejected / duplicate / late / blocked / unknown。 |
| `material_digest` | `Digest` | 无正文的完整性关联。 |
| `correlation` | `MemberCorrelation` | 关联 Runtime source 与后续 outbound。 |
| `received_at` | `Timestamp` | member 本地承接时点。 |

| 状态 | 作用 |
|---|---|
| `accepted` | source、correlation、body-free / committed 条件成立,允许 outbound 评估。 |
| `rejected` | material 不安全、来源无效或语义不支持。 |
| `duplicate` | 已承接同一正式 material,不创建第二 outbound 主线。 |
| `late` | 对应旧 correlation,只追加关联,不覆盖当前决定。 |
| `blocked` | source family / contract 未闭口,不得正向承接。 |
| `unknown` | 无法证明完整性或 committed status,不得继续。 |

| 成员函数 | 作用 |
|---|---|
| `permits_outbound_evaluation()` | 仅 accepted 允许进入 CP04。 |
| `matches_outcome(RuntimeOutcomeRef runtime_outcome_ref)` | 检查 formal outcome anchor 一致。 |
| `is_body_free()` | 验证本地记录与被允许 carrier 的安全条件。 |

| 工厂函数 | 作用 |
|---|---|
| `receive(RuntimeSafeHandoffMaterialRef runtime_material_ref, RuntimeOutcomeRef runtime_outcome_ref, RuntimeSourceRef source_ref, RuntimeMaterialMetadata material_metadata, RuntimeMediationPolicy policy)` | 从正式 Runtime source 形成本地 reception 分类。 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有或修改 Runtime outcome / material | 只保存正式 refs、digest 与 disposition。 |
| 不接收模型正文、hidden reasoning、tool receipt body | 不合格材料必须 rejected。 |
| accepted 不等于 outbound / publication | CP04 仍需独立决定。 |

## C5. `RuntimeMediationPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | CP03 Runtime Mediation |
| 对象类型 | domain policy / boundary guard |
| 主要责任 | 保护 screening-to-entry 和 committed-material-to-outbound 两条 member / Runtime seam 的来源、body、mapping、幂等与 unknown 边界。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `entry_mapping_requirement` | `RuntimeEntryMappingRequirement` | exact formal mapping 必须可引用。 |
| `material_source_requirement` | `RuntimeMaterialSourceRequirement` | committed producer / source family 必须可验证。 |
| `body_boundary` | `ForbiddenBodyBoundary` | 禁止 raw / hidden / secret material。 |
| `unknown_handling` | `UnknownHandlingMode` | unknown submission / reception 必须 fenced。 |
| `ordering_rule` | `RuntimeMediationOrderingRule` | duplicate / late / out-of-order 只追加分类。 |

该 policy 无业务生命周期状态。

| 成员函数 | 作用 |
|---|---|
| `evaluate_delivery(ScreeningDecision screening_decision, ExternalContextResolution contract_resolution)` | 判断 delivery eligible / rejected / blocked / pending。 |
| `evaluate_reception(RuntimeMaterialMetadata material_metadata, RuntimeSourceRef source_ref, CorrelationState correlation_state)` | 判断 material reception disposition。 |
| `requires_fence(RuntimeSubmissionAttempt attempt)` | 判断 unknown side effect 是否阻止新提交。 |

| 工厂函数 | 作用 |
|---|---|
| `formal_seam_only()` | 创建只接受正式 Runtime boundary、fail-closed 的 mediation policy。 |

| 禁止事项 | 说明 |
|---|---|
| 不定义 Runtime trigger / material schema | exact contract 归正式上游闭口。 |
| 不代答 Runtime rejection / unavailable | member 只记录 local state。 |
| 不允许配置绕过 mapping / source / body gate | 这些是架构 invariant。 |

## 6. CP03 对象正式化停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 的 5 个候选全部处理 | pass | 5/5 独立成节。 |
| local decision / attempt / external link / reception 分层 | pass | 没有单一 `RuntimeDeliverySuccess`。 |
| Runtime truth 无复制 | pass | trigger / admission / outcome / material 仅作 ref / metadata。 |
| exact mapping / source family 保持 pending | pass | `L2M-UP-003/004` 对应 blocked 状态。 |
| duplicate / late / unknown 语义齐全 | pass | append link + fence,无盲重放。 |
| Step 8 / 9 可反查 | pass | 两条 Runtime seam 所需对象均已定义。 |

CP03 结论为 `completed / pass / stop_review`。下一允许模块是 CP04 Outbound Boundary 对象正式化。
