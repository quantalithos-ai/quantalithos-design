# Step 6 附录 B3. Reference / Snapshot / Audit 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> Reference / snapshot 只保存引用或摘要;history / audit / outbox 不替代当前 truth。

`SourceWorkRef`、`ExternalEvidenceRef` 和 `MethodDefinitionSnapshot` 的字段表是详细设计的最小语义约束。详细设计必须对齐相邻仓正式 contracts,可以把 `ExternalSourceRef` 细化为对应 typed ref 或补充版本 / digest / captured_at 字段,但不得降级成裸字符串引用、删除摘要 / 验证 / 解析状态语义,也不得保存 conversation、runtime、artifact、governance、process 或 method-library 正文。

---

## B15. `SourceWorkRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Work decomposition / promote boundary` |
| 对象类型 | reference object |
| 结构责任 | 指向 conversation、runtime、artifact、process 或治理建议中的工作来源 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_kind` | `SourceWorkKind` | 来源类别 |
| `external_ref` | `ExternalSourceRef` | 外部稳定引用 |
| `source_digest` | `Option<SourceDigest>` | 来源摘要校验 |

| 成员函数 | 作用 |
|---|---|
| `is_promotable_source()` | 判断来源类型是否允许评估 |
| `same_source(SourceWorkRef other)` | 判断是否同源 |

| 工厂函数 | 作用 |
|---|---|
| `from_external(SourceWorkKind source_kind, ExternalSourceRef external_ref)` | 从外部引用形成来源 ref |

禁止事项:不得包含来源正文或执行计划正文。

---

## B16. `ExternalEvidenceRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Dependency / blocker coordination` |
| 对象类型 | reference object |
| 结构责任 | 指向 artifact / governance / archive 等外部依据 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `evidence_kind` | `EvidenceKind` | 依据类别 |
| `external_ref` | `ExternalSourceRef` | 外部依据引用 |
| `verified_state` | `EvidenceVerifiedState` | 依据是否已验证 |

| 成员函数 | 作用 |
|---|---|
| `is_acceptable_for_completion()` | 判断是否可作为完成依据 |
| `is_acceptable_for_resolution()` | 判断是否可作为解除依据 |

| 工厂函数 | 作用 |
|---|---|
| `from_verified(EvidenceKind evidence_kind, ExternalSourceRef external_ref)` | 从已验证依据形成引用 |

禁止事项:不得保存 artifact body、evidence body 或 governance decision 正文。

---

## B17. `MemberCapabilitySnapshot`

| 项 | 内容 |
|---|---|
| 所属部分 | `Project member responsibility` |
| 对象类型 | snapshot |
| 结构责任 | 保存成员可承担性和能力的本地摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `member_ref` | `GlobalMemberRef` | 来源成员 |
| `capability_refs` | `CapabilityRefSet` | 可承担能力引用 |
| `snapshot_state` | `ReferenceResolutionState` | 快照解析和过期状态 |

| 成员函数 | 作用 |
|---|---|
| `supports(ProjectResponsibilitySpec spec)` | 判断能力是否满足承担要求 |
| `mark_stale(ReferenceStaleReason reason)` | 标记快照过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_identity(GlobalMemberRef member_ref, CapabilityRefSet capability_refs)` | 从 identity 摘要形成快照 |

禁止事项:不得成为 GlobalMember truth 或 role truth。

---

## B18. `MethodDefinitionSnapshot`

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference / snapshot / projection support` |
| 对象类型 | snapshot |
| 结构责任 | 保存 method-library 定义目录级快照 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `definition_ref` | `MethodDefinitionRef` | 方法定义引用 |
| `definition_kind` | `MethodDefinitionKind` | task / product / process / view profile 类别 |
| `snapshot_state` | `ReferenceResolutionState` | 快照解析和过期状态 |

| 成员函数 | 作用 |
|---|---|
| `matches(FormalWorkIntent intent)` | 判断是否与正式工作意图匹配 |
| `mark_stale(ReferenceStaleReason reason)` | 标记快照过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_method_library(MethodDefinitionRef definition_ref, MethodDefinitionKind definition_kind)` | 从 method-library 摘要形成快照 |

禁止事项:不得保存 method-library 定义正文。

---

## B19. `WorkTraceRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Work consumption / trace` |
| 对象类型 | trace record |
| 结构责任 | 记录工作事实变化、来源、消费和交接的追溯线索 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `trace_id` | `WorkTraceId` | 追溯记录身份 |
| `subject_ref` | `WorkTraceSubjectRef` | 被追溯对象 |
| `trace_context` | `TraceContext` | L0-core trace 关联 |

| 成员函数 | 作用 |
|---|---|
| `relates_to(WorkTraceSubjectRef subject_ref)` | 判断是否属于某对象 |
| `prepare_handoff(ArchiveHandoffRef archive_ref)` | 形成归档交接意图 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth_change(WorkTruthChange change, TraceContext trace_context)` | 从已成立变化形成追溯记录 |

禁止事项:不得包含外部正文或替代业务对象当前状态。

---

## B20. `WorkAuditTrail`

| 项 | 内容 |
|---|---|
| 所属部分 | `Work truth core` |
| 对象类型 | audit trail |
| 结构责任 | 汇聚关键变化的审计链路 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `audit_trail_id` | `WorkAuditTrailId` | 审计链身份 |
| `subject_ref` | `WorkAuditSubjectRef` | 审计对象 |
| `record_refs` | `WorkTraceRecordRefSet` | 关联追溯记录 |

| 成员函数 | 作用 |
|---|---|
| `append(WorkTraceRecord record)` | 追加追溯记录引用 |
| `has_gap()` | 判断审计链是否存在缺口 |

| 工厂函数 | 作用 |
|---|---|
| `start_for_subject(WorkAuditSubjectRef subject_ref)` | 为对象建立审计链 |

禁止事项:不得用审计链替代 truth repository。

---

## B21. `WorkOutboxRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Work truth core` |
| 对象类型 | outbox record |
| 结构责任 | 表达已成立 Work 事实需要传播或交接 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `outbox_id` | `WorkOutboxId` | outbox 记录身份 |
| `event_kind` | `WorkOutboxEventKind` | 变化类别 |
| `publication_state` | `OutboxPublicationState` | 传播状态 |

| 状态 | 作用 |
|---|---|
| `Pending` / `Published` / `Failed` | 待发布、已发布和失败 |

| 成员函数 | 作用 |
|---|---|
| `mark_published(OutboxPublicationRef publication_ref)` | 记录发布成功 |
| `mark_failed(OutboxFailureReason reason)` | 记录发布失败 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth_change(WorkTruthChange change)` | 从已成立 truth 变化形成 outbox |

禁止事项:不得由 outbox 决定 truth 是否成立。

---

## B22. `PromoteDecisionRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Work decomposition / promote boundary` |
| 对象类型 | decision history |
| 结构责任 | 记录 promote 判断的理由、actor 和结果引用 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `decision_id` | `PromoteDecisionId` | 判断记录身份 |
| `source_ref` | `SourceWorkRef` | 被判断来源 |
| `result_ref` | `PromoteResultRef` | 对应结果 |

| 成员函数 | 作用 |
|---|---|
| `is_acceptance()` | 判断是否接受 |
| `is_rejection()` | 判断是否拒绝 |

| 工厂函数 | 作用 |
|---|---|
| `from_result(PromoteResult result, ActorRef actor)` | 从 promote 结果形成判断记录 |

禁止事项:不得修改已成立 PromoteResult。

---

## B23. `DependencyChangeRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Dependency / blocker coordination` |
| 对象类型 | history record |
| 结构责任 | 记录 dependency / blocker 的建立、解除和影响变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `change_id` | `DependencyChangeId` | 变化记录身份 |
| `relation_ref` | `DependencyOrBlockerRef` | 变化对象 |
| `change_reason` | `DependencyChangeReason` | 变化原因 |

| 成员函数 | 作用 |
|---|---|
| `relates_to(FormalWorkRef work_ref)` | 判断是否影响某正式工作 |
| `requires_trace()` | 判断是否需要追溯交接 |

| 工厂函数 | 作用 |
|---|---|
| `from_dependency_change(WorkDependency dependency, DependencyChangeReason reason)` | 从依赖变化形成记录 |

禁止事项:不得用 history record 替代当前 dependency / blocker truth。

---

## B24. `IterationChangeRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Iteration commitment` |
| 对象类型 | history record |
| 结构责任 | 记录 Iteration 和承诺集合变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `change_id` | `IterationChangeId` | 变化记录身份 |
| `iteration_ref` | `IterationRef` | 所属 Iteration |
| `changed_work_refs` | `FormalWorkRefSet` | 受影响正式工作 |

| 成员函数 | 作用 |
|---|---|
| `includes(FormalWorkRef work_ref)` | 判断变化是否影响工作 |
| `is_commitment_change()` | 判断是否属于承诺范围变化 |

| 工厂函数 | 作用 |
|---|---|
| `from_commitment(Iteration iteration, IterationCommitment commitment, ActorRef actor)` | 从承诺变化形成记录 |

禁止事项:不得把 IterationChangeRecord 当成 Iteration 当前承诺集合。
