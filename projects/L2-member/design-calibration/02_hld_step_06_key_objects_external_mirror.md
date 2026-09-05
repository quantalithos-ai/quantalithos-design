# Step 6 附录 CP06. External Context Mirror 对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 对应 capability: `02_hld_step_05_components_boundary.md` §12
> 状态: completed / pass / stop_review
> 本文件只定义 member 对外部 ref / safe snapshot 的中性消费状态;Work、Identity、Governance、Runtime、Tools、Method、host、Bus 与下游业务 truth 仍由各 owner 持有。

## C1. `ExternalContextSnapshot`

| 项 | 内容 |
|---|---|
| 所属部分 | CP06 External Context Mirror |
| 对象类型 | immutable point-in-time support fact |
| 主要责任 | 固定 member 在某一时点从正式 owner seam 获得的 body-free 来源引用、版本、scope、digest 与安全分类。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `snapshot_id` | `ExternalContextSnapshotId` | 本地快照标识。 |
| `source_ref` | `TypedRef` | 外部 truth 正式引用。 |
| `source_owner` | `ExternalOwnerRef` | 解析该引用的正式 owner。 |
| `context_kind` | `ExternalContextKind` | subject / identity / policy / host / runtime / tool / method / route / downstream 等受控类别。 |
| `source_version` | `Optional<SourceVersion>` | owner 提供的版本锚点。 |
| `source_digest` | `Optional<Digest>` | owner safe material 的完整性关联。 |
| `scope` | `ExternalContextScope` | 此快照适用的 subject / purpose / boundary 范围。 |
| `safe_categories` | `Set<ExternalContextCategory>` | consumer 所需的低敏、受控分类。 |
| `freshness_basis` | `FreshnessBasis` | event version / owner timestamp / resolution receipt 等新鲜度依据。 |
| `captured_at` | `Timestamp` | 本地捕获时点。 |

该 snapshot 创建后不可变;refresh 必须创建新 snapshot,不能原地覆盖。它不是外部对象副本,也不表达 authorization、health、acceptance 或 availability。

| 成员函数 | 作用 |
|---|---|
| `matches_scope(ExternalContextScope required_scope)` | 判断 snapshot 的声明 scope 是否覆盖消费请求。 |
| `matches_source(TypedRef source_ref, ExternalOwnerRef source_owner)` | 检查引用与 owner 一致。 |
| `is_body_free()` | 验证只含 ref、版本、digest 与受控类别。 |

| 工厂函数 | 作用 |
|---|---|
| `capture(TypedRef source_ref, ExternalOwnerRef source_owner, ExternalContextKind context_kind, Optional<SourceVersion> source_version, Optional<Digest> source_digest, ExternalContextScope scope, Set<ExternalContextCategory> safe_categories, FreshnessBasis freshness_basis, Timestamp captured_at, MirrorResolutionPolicy policy)` | 从 owner-specific safe response 形成 point-in-time support fact。 |

| 禁止事项 | 说明 |
|---|---|
| 不复制 credential、policy、definition、Runtime、host 或 registry body | Mirror 只保存 member 所需最小安全分类。 |
| 不把 snapshot 当 current truth | 是否可用必须经独立 resolution 判断。 |
| 不以 refresh 覆盖历史 | 新来源状态形成新 snapshot。 |

## C2. `ExternalContextResolution`

| 项 | 内容 |
|---|---|
| 所属部分 | CP06 External Context Mirror |
| 对象类型 | neutral resolution record / support truth |
| 主要责任 | 针对特定 consumer purpose 与 scope,判断某个 external ref / snapshot 当前是否足以参与 member 本地 policy。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `resolution_id` | `ExternalContextResolutionId` | 本地解析结论标识。 |
| `source_ref` | `TypedRef` | 被解析的外部正式引用。 |
| `snapshot_ref` | `Optional<ExternalContextSnapshotId>` | 本次判断所使用的 point-in-time snapshot。 |
| `consumer_purpose` | `ExternalConsumerPurpose` | startup / screening / runtime_entry / outbound / observation / projection 等用途。 |
| `required_scope` | `ExternalContextScope` | consumer 声明的必要范围。 |
| `status` | `ExternalContextResolutionStatus` | resolved / stale / conflict / unresolved / unavailable / unknown。 |
| `safe_reason` | `Optional<SafeReasonCategory>` | 非 resolved 状态的安全原因。 |
| `source_version` | `Optional<SourceVersion>` | 结论所锚定的来源版本。 |
| `resolved_at` | `Timestamp` | 本地形成结论时点。 |

| 状态 | 作用 |
|---|---|
| `resolved` | ref、owner、scope、freshness 与 purpose 一致;只表示可供 consumer policy 继续判断。 |
| `stale` | snapshot 已过期或落后,不得作为 current 输入。 |
| `conflict` | owner、version、scope 或多个来源互相冲突。 |
| `unresolved` | 未找到足够正式来源或 mapping。 |
| `unavailable` | 正式 resolver / owner seam 当前不可用。 |
| `unknown` | 无法证明 freshness 或来源完整性。 |

| 成员函数 | 作用 |
|---|---|
| `usable_for(ExternalConsumerPurpose consumer_purpose, ExternalContextScope required_scope)` | 仅 resolved 且 purpose / scope 匹配时返回 true。 |
| `requires_fail_closed()` | stale / conflict / unresolved / unavailable / unknown 均要求 consumer 保守处理。 |
| `is_authorization_result()` | 始终返回 false;防止调用方把 neutral resolution 当业务裁决。 |

| 工厂函数 | 作用 |
|---|---|
| `resolve(TypedRef source_ref, Optional<ExternalContextSnapshot> snapshot, ExternalConsumerPurpose consumer_purpose, ExternalContextScope required_scope, SourceFreshnessEvidence freshness_evidence, MirrorResolutionPolicy policy)` | 形成 consumer-specific 中性 resolution。 |

| 禁止事项 | 说明 |
|---|---|
| resolved 不等于 authorized / healthy / accepted / available | 业务含义仍由 source owner 与调用方 domain policy 判断。 |
| 不把 last-known snapshot 自动升级为 resolved | stale / unknown 必须显式。 |
| 不跨 consumer purpose 复用结论 | 每个 purpose / scope 独立评估。 |

## C3. `ExternalContextGap`

| 项 | 内容 |
|---|---|
| 所属部分 | CP06 External Context Mirror |
| 对象类型 | source-resolution gap record / support truth |
| 主要责任 | 显式记录 consumer 所需外部来源与当前 ref / snapshot / resolution 之间的缺失、冲突或不可用。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `gap_id` | `ExternalContextGapId` | 本地来源缺口标识。 |
| `source_ref` | `Optional<TypedRef>` | 已知时记录目标外部引用。 |
| `context_kind` | `ExternalContextKind` | 缺口涉及的来源类别。 |
| `consumer_purpose` | `ExternalConsumerPurpose` | 被影响的 member 消费用途。 |
| `required_scope` | `ExternalContextScope` | 预期的适用范围。 |
| `resolution_ref` | `Optional<ExternalContextResolutionId>` | 已有 neutral resolution 引用。 |
| `category` | `ExternalContextGapCategory` | source_missing / contract_pending / stale / conflict / owner_unavailable / mapping_unknown。 |
| `status` | `ExternalContextGapStatus` | open / blocked / resolution_pending / resolved / unknown / superseded。 |
| `safe_reason` | `SafeReasonCategory` | body-free 原因分类。 |
| `opened_at` | `Timestamp` | 缺口建立时点。 |
| `resolved_at` | `Optional<Timestamp>` | 获得新 resolution 时的本地关闭时点。 |

| 状态 | 作用 |
|---|---|
| `open` | 来源不满足 consumer 要求,尚未开始 refresh / resolution。 |
| `blocked` | exact contract / owner seam 未闭口,当前不能正向解析。 |
| `resolution_pending` | refresh / resolve 已发起,结果未形成。 |
| `resolved` | 新 neutral resolution 已建立;仍需 consumer policy 判断。 |
| `unknown` | resolution side effect 或来源状态无法确认。 |
| `superseded` | 后继 gap / resolution 已承接处理,旧记录保留。 |

| 成员函数 | 作用 |
|---|---|
| `request_refresh(ExternalRefreshRequestRef refresh_request_ref)` | 记录受控刷新请求并进入 resolution_pending。 |
| `resolve(ExternalContextResolution resolution, Timestamp resolved_at)` | 关联新 resolution,不改写旧 snapshot。 |
| `supersede(ExternalContextGap successor_gap)` | 关联后继 gap 并保留当前历史。 |
| `blocks_consumer(ExternalConsumerPurpose consumer_purpose)` | 判断受影响 consumer 是否必须 blocked / degraded / pending。 |

| 工厂函数 | 作用 |
|---|---|
| `open(Optional<TypedRef> source_ref, ExternalContextKind context_kind, ExternalConsumerPurpose consumer_purpose, ExternalContextScope required_scope, Optional<ExternalContextResolution> resolution, ExternalContextGapCategory category, SafeReasonCategory safe_reason, Timestamp opened_at)` | 从缺失 / 冲突 / 不可用事实建立 gap。 |

| 禁止事项 | 说明 |
|---|---|
| 不以默认值补造 source truth | 无正式来源保持 open / blocked / unknown。 |
| gap resolved 不授权业务动作 | consumer 仍必须执行自身 policy。 |
| refresh 失败不删除既有 snapshot | 旧记录保留并显式 stale / gap。 |

## C4. `MirrorResolutionPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | CP06 External Context Mirror |
| 对象类型 | domain policy / anti-corruption guard |
| 主要责任 | 保护 owner-specific source、scope、freshness、version / conflict、body-free 与 consumer-purpose 中立性。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `owner_requirement` | `FormalOwnerRequirement` | ref 只能由其正式 owner resolver 解释。 |
| `scope_rule` | `ExternalScopeRule` | snapshot / resolution 不得越过声明 scope。 |
| `freshness_rule` | `ExternalFreshnessRule` | freshness 必须有版本、时间或正式 receipt 依据。 |
| `conflict_rule` | `SourceConflictRule` | 冲突来源不得静默择一。 |
| `body_boundary` | `ForbiddenBodyBoundary` | 禁止外部正文、secret、definition body 进入 Mirror。 |
| `purpose_isolation_rule` | `ConsumerPurposeIsolationRule` | resolution 只能服务声明 purpose。 |

该 policy 无业务生命周期状态。

| 成员函数 | 作用 |
|---|---|
| `validate_snapshot(TypedRef source_ref, ExternalOwnerRef source_owner, ExternalContextScope scope, Set<ExternalContextCategory> safe_categories, ForbiddenBodyInspection inspection)` | 校验来源、范围、安全分类与 body-free 条件。 |
| `evaluate_freshness(ExternalContextSnapshot snapshot, SourceFreshnessEvidence freshness_evidence)` | 返回 current / stale / conflict / unknown 的中性判断。 |
| `evaluate_resolution(Optional<ExternalContextSnapshot> snapshot, ExternalConsumerPurpose consumer_purpose, ExternalContextScope required_scope, SourceFreshnessEvidence freshness_evidence)` | 形成 neutral resolution status。 |
| `requires_new_snapshot(ExternalContextSnapshot existing_snapshot, SourceChangeEvidence source_change_evidence)` | 判断 refresh 是否必须追加新 snapshot。 |

| 工厂函数 | 作用 |
|---|---|
| `owner_specific_fail_closed()` | 创建 owner-specific、body-free、purpose-isolated 且 fail-closed 的 resolution policy。 |

| 禁止事项 | 说明 |
|---|---|
| 不实现 generic registry / hub / arbitrary adapter | resolver 必须按正式 owner port 分开。 |
| 不产生 authorization / health / acceptance / availability truth | Mirror 只回答 ref / snapshot 的消费充分性。 |
| 不允许配置把 stale / conflict / unknown 当 resolved | freshness 与中立性是架构 invariant。 |

## 5. CP06 对象正式化停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 的 4 个候选全部处理 | pass | 4/4 独立成节。 |
| snapshot / resolution / gap 分层 | pass | refresh 追加新事实,无静默覆盖。 |
| external truth 无复制 | pass | 只保存 typed ref、版本、digest、scope 与受控分类。 |
| neutral resolution 语义明确 | pass | resolved 不等于授权、健康、受理或可用。 |
| owner-specific / fail-closed 边界完整 | pass | 无 generic hub,开放 contract 形成 blocked / gap。 |
| Step 8 / 9 可反查 | pass | capture、resolve、refresh、gap 与 consumer degradation 均可展开。 |

CP06 结论为 `completed / pass / stop_review`。下一允许模块是 CP07 Member Read Model 对象正式化。
