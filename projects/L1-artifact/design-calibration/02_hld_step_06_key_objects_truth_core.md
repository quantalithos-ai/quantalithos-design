# Step 6 附录 A1. Truth Core 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义完整对象契约。

---

## A1. `ArtifactFact`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact fact management` |
| 对象类型 | 聚合 / truth anchor |
| 结构责任 | 表达平台内正式制品事实入口,为 version、lineage、baseline、review 和 consumption 提供统一真相锚点 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `artifact_fact_id` | `ArtifactFactId` | 正式制品事实身份 |
| `definition_ref` | `ArtifactDefinitionRef` | 回指定义来源或 artifact kind 语境 |
| `fact_state` | `ArtifactFactState` | 表达该事实是否已成立、挂起或关闭 |
| `content_context_ref` | `ArtifactContentFactContextRef` | 对应内容事实语境 |
| `current_version_ref` | `Option<ArtifactVersionRef>` | 当前正式版本锚点 |
| `intake_context_ref` | `ArtifactIntakeContextRef` | 形成该事实的输入收束语境 |

| 状态 | 作用 |
|---|---|
| `PendingIntake` / `Established` / `Suspended` / `Closed` | 等待收束、正式成立、临时挂起和已关闭 |

| 成员函数 | 作用 |
|---|---|
| `establish(ArtifactContentFactContext content_context, ActorContext actor)` | 把已收束输入建立为正式事实 |
| `bind_current_version(ArtifactVersionRef version_ref, ActorContext actor)` | 关联当前正式版本 |
| `suspend(ArtifactFactSuspendReason reason, ActorContext actor)` | 在关键依据失效时挂起事实 |
| `close(ArtifactFactCloseReason reason, ActorContext actor)` | 关闭不再继续演化的事实主语 |

| 工厂函数 | 作用 |
|---|---|
| `from_intake(ArtifactIntakeContext intake_context, ArtifactDefinitionRef definition_ref)` | 从输入收束语境建立事实主语 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有外部正文生命周期 | 只拥有内容事实语境,不拥有 Git / URL / object store 正文 |
| 不让派生材料替代 truth | preview、report、archive 和 observability 材料不能成为事实来源 |

---

## A2. `ArtifactContentFactContext`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact fact management` |
| 对象类型 | context object |
| 结构责任 | 表达 Artifact truth 所依附的内容事实语境,并把正文引用、可达性和内容边界与正式 truth 分开 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `content_context_id` | `ArtifactContentFactContextId` | 内容语境身份 |
| `content_source_ref` | `ArtifactContentSourceRef` | 正文来源引用 |
| `content_state` | `ArtifactContentFactState` | 内容语境可达 / 不可达 / 已验证状态 |
| `source_digest` | `Option<SourceDigest>` | 来源摘要或完整性线索 |
| `availability_state` | `ContentAvailabilityState` | 正文当前可用性 |

| 状态 | 作用 |
|---|---|
| `Linked` / `Verified` / `Unavailable` / `PendingCheck` | 已关联、已验证、不可用和待校验 |

| 成员函数 | 作用 |
|---|---|
| `verify_source(SourceDigest source_digest)` | 记录来源已被验证 |
| `mark_pending_check(ContentCheckReason reason)` | 标记仍待验证或刷新 |
| `mark_unavailable(ContentUnavailableReason reason)` | 标记正文暂不可达 |

| 工厂函数 | 作用 |
|---|---|
| `from_source(ArtifactContentSourceRef content_source_ref)` | 从正式内容来源引用形成内容语境 |

| 禁止事项 | 说明 |
|---|---|
| 不保存正文副本 | 只保存引用、摘要和可用性语义 |
| 不替代 ArtifactFact | 内容语境不能单独代表正式事实 |

---

## A3. `ArtifactVersion`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact version management` |
| 对象类型 | 实体 / version truth |
| 结构责任 | 表达围绕同一 ArtifactFact 的稳定正式版本,承接发布、替代、历史追溯和 baseline 冻结语义 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `artifact_version_id` | `ArtifactVersionId` | 正式版本身份 |
| `artifact_fact_ref` | `ArtifactFactRef` | 所属事实主语 |
| `version_state` | `ArtifactVersionState` | 版本生命周期 |
| `content_context_ref` | `ArtifactContentFactContextRef` | 本版本对应的内容事实语境 |
| `supersedes_version_ref` | `Option<ArtifactVersionRef>` | 被该版本替代的旧版本 |
| `published_marker` | `ArtifactPublishedMarker` | 版本正式发布锚点 |

| 状态 | 作用 |
|---|---|
| `Candidate` / `Published` / `Superseded` / `Frozen` / `Retired` | 候选、正式发布、被替代、已进入冻结语境和退出主链 |

| 成员函数 | 作用 |
|---|---|
| `publish(ActorContext actor)` | 将候选版本提升为正式引用单位 |
| `supersede(ArtifactVersionRef next_version_ref, ActorContext actor)` | 被新版本正式替代 |
| `freeze_into(ArtifactBaselineRef baseline_ref)` | 标记已被基线冻结引用 |
| `retire(ArtifactVersionRetireReason reason, ActorContext actor)` | 在不再允许继续消费时退出主链 |

| 工厂函数 | 作用 |
|---|---|
| `from_candidate(ArtifactVersionCandidate candidate)` | 从候选修订生成正式版本骨架 |

| 禁止事项 | 说明 |
|---|---|
| 不允许被 current latest 替代 | 正式引用单位必须是 ArtifactVersion |
| 不允许缺少事实锚点 | 版本不能脱离 ArtifactFact 独立存在 |

---

## A4. `ArtifactVersionCandidate`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact version management` |
| 对象类型 | 实体 / candidate context |
| 结构责任 | 表达进入正式发布前的候选修订语境,区分“候选变化”与“已成立版本 truth” |

| 字段 | 类型 | 作用 |
|---|---|---|
| `candidate_id` | `ArtifactVersionCandidateId` | 候选修订身份 |
| `artifact_fact_ref` | `ArtifactFactRef` | 候选修订所属事实 |
| `candidate_state` | `ArtifactVersionCandidateState` | 候选修订生命周期 |
| `proposed_content_context_ref` | `ArtifactContentFactContextRef` | 候选内容语境 |
| `candidate_source_ref` | `ArtifactContentSourceRef` | 候选变化来源 |

| 状态 | 作用 |
|---|---|
| `Open` / `ReadyToPublish` / `Rejected` / `Superseded` | 已打开、可发布、已拒绝和被新候选替代 |

| 成员函数 | 作用 |
|---|---|
| `mark_ready(ActorContext actor)` | 标记候选已经满足发布前置 |
| `reject(ArtifactVersionRejectReason reason, ActorContext actor)` | 拒绝不合法候选修订 |
| `supersede_by(ArtifactVersionCandidateRef next_candidate_ref, ActorContext actor)` | 被新的候选修订替代 |

| 工厂函数 | 作用 |
|---|---|
| `from_intake(ArtifactFactRef artifact_fact_ref, ArtifactSubmissionRecord submission)` | 从已接受提交形成候选修订 |

| 禁止事项 | 说明 |
|---|---|
| 不等于正式版本 | 只有 `ArtifactVersion.publish()` 后才成为正式 truth |
| 不允许隐式覆盖现有版本 | 候选存在本身不改变 current version |

---

## A5. `ArtifactLineageLink`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact lineage management` |
| 对象类型 | 实体 / lineage truth |
| 结构责任 | 表达正式 ArtifactVersion 之间的来源、替代、依赖、影响和追溯关系 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `lineage_link_id` | `ArtifactLineageLinkId` | 血缘关系身份 |
| `source_version_ref` | `ArtifactVersionRef` | 来源版本 |
| `target_version_ref` | `ArtifactVersionRef` | 目标版本 |
| `relation_kind` | `ArtifactLineageRelationKind` | 来源 / 替代 / 依赖 / 影响关系类型 |
| `lineage_state` | `ArtifactLineageState` | 血缘关系是否已成立或被拒绝 |
| `basis_ref` | `ArtifactLineageBasisRef` | 关系依据摘要或线索引用 |

| 状态 | 作用 |
|---|---|
| `PendingBasis` / `Established` / `Rejected` / `Retired` | 等待依据、正式成立、已拒绝和不再作为当前关系 |

| 成员函数 | 作用 |
|---|---|
| `establish(ArtifactLineageBasisRef basis_ref, ActorContext actor)` | 正式建立血缘关系 |
| `reject(ArtifactLineageRejectReason reason, ActorContext actor)` | 拒绝无效或越界的关系 |
| `retire(ArtifactLineageRetireReason reason)` | 使该关系退出当前有效视图 |

| 工厂函数 | 作用 |
|---|---|
| `connect_versions(ArtifactVersionRef source_version_ref, ArtifactVersionRef target_version_ref, ArtifactLineageRelationKind relation_kind)` | 从两个正式版本建立血缘关系骨架 |

| 禁止事项 | 说明 |
|---|---|
| 不允许 trace / tool result 直接成为 truth | runtime 线索必须先经正式边界收束 |
| 不允许脱离正式版本锚点 | lineage 必须绑定正式 ArtifactVersion |

---

## A6. `ArtifactBaseline`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact baseline management` |
| 对象类型 | 聚合 / baseline truth |
| 结构责任 | 表达一组正式 ArtifactVersion 进入受控冻结集合的事实,并支撑历史回溯与跨仓消费 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `artifact_baseline_id` | `ArtifactBaselineId` | 基线身份 |
| `baseline_scope_ref` | `ArtifactBaselineScopeRef` | 基线范围或语境 |
| `baseline_state` | `ArtifactBaselineState` | 基线生命周期 |
| `membership_refs` | `ArtifactBaselineMembershipRefSet` | 冻结成员集合 |
| `freeze_context_ref` | `ArtifactReviewAnchorRef` | 冻结时依赖的审查 / 责任语境 |

| 状态 | 作用 |
|---|---|
| `Candidate` / `Frozen` / `Superseded` / `Retired` | 候选集合、正式冻结、被新基线替代和退出主链 |

| 成员函数 | 作用 |
|---|---|
| `freeze(ActorContext actor)` | 把成员集合正式冻结为 baseline truth |
| `supersede(ArtifactBaselineRef next_baseline_ref, ActorContext actor)` | 被新基线替代 |
| `retire(ArtifactBaselineRetireReason reason, ActorContext actor)` | 关闭不再继续消费的基线 |

| 工厂函数 | 作用 |
|---|---|
| `from_members(ArtifactBaselineScopeRef baseline_scope_ref, ArtifactBaselineMembershipRefSet membership_refs)` | 从受控版本集合形成候选基线 |

| 禁止事项 | 说明 |
|---|---|
| 不允许由当前版本动态解析 | baseline 必须冻结明确的 ArtifactVersion 集合 |
| 不允许被发布说明 / 裁决替代 | 外部清单和说明不能直接成为 baseline truth |

---

## A7. `ArtifactBaselineMembership`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact baseline management` |
| 对象类型 | 实体 / membership truth |
| 结构责任 | 表达某个 ArtifactVersion 以何种方式进入特定 ArtifactBaseline 的冻结成员集合 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `baseline_membership_id` | `ArtifactBaselineMembershipId` | 成员关系身份 |
| `artifact_baseline_ref` | `ArtifactBaselineRef` | 所属基线 |
| `artifact_version_ref` | `ArtifactVersionRef` | 被冻结的正式版本 |
| `membership_state` | `ArtifactBaselineMembershipState` | 成员是否已选定 / 已冻结 / 已移除 |
| `membership_reason` | `ArtifactBaselineMembershipReason` | 进入基线的依据说明 |

| 状态 | 作用 |
|---|---|
| `Selected` / `Frozen` / `Removed` | 已选入、已冻结和已移出候选集合 |

| 成员函数 | 作用 |
|---|---|
| `freeze_member()` | 把该成员锁定到正式冻结集合 |
| `remove(ArtifactBaselineMembershipRemoveReason reason, ActorContext actor)` | 在冻结前从候选集合移除 |

| 工厂函数 | 作用 |
|---|---|
| `attach_version(ArtifactBaselineRef artifact_baseline_ref, ArtifactVersionRef artifact_version_ref, ArtifactBaselineMembershipReason membership_reason)` | 把正式版本挂入候选基线 |

| 禁止事项 | 说明 |
|---|---|
| 不允许引用非正式版本 | 成员必须绑定正式 ArtifactVersion |
| 不允许冻结后静默漂移 | 基线成员不能在消费时再解析 current version |
