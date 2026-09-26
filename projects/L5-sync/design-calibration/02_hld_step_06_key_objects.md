# Step 6. 关键对象轮廓

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；Step 5 五部分及跨部分审计已通过。
- `gate_status=pass_with_upstream_blockers`；CP1→CP5 共 29 个对象与跨对象审计已完成，`SYNC-UP-001~010` 保持开放。
- 字段与函数均为概要层 typed skeleton；不代表代码、物理 metadata schema、完整签名或实现已存在。

### Step 内计划

1. 回读 Step 5 候选池、capability 来源与筛选门禁。
2. 区分正式对象与 service/port/repository/adapter/entry/DTO/字段类型。
3. 逐 CP 为每个正式对象写基本信息、字段、状态、成员函数、工厂函数和禁止事项。
4. 每完成一个 CP 做对象正式化停审；全部完成后做跨对象/跨部分审计。
5. 反查 Step 8 处理流与 Step 9 状态主语，形成正式 §6 回填草稿。

## 2. 本步输入

| 输入 | 采用内容 |
|---|---|
| Step 5 §7~9 | 五部分 capability、对象候选池、筛选门禁与接缝 |
| Step 4 §7 | service/domain/port/persistence/adapter 代码主体关系 |
| Step 3 §7 | ownership、no-write、non-overwrite、transition、handoff 与 provenance 硬约束 |
| 正式 00 §11、正式 01 §9 | Sync-owned local truth、owner refs/snapshots 与 forbidden body |
| 概要 SOP/规范 Step/§6 | 单对象六段、类型化字段/参数、逐部分停审和反查要求 |

## 3. SOP 问题回答

1. **哪些对象必须点名？** 对本地 operation、selection/access、binding/metadata/cursor/mapping/observation、materialization plan/run、conflict/recovery、candidate/handoff/provenance/status 有独立结构责任的对象必须点名。
2. **候选如何筛选？** 29 个候选全部具有独立 truth/state/policy/projection/reference 责任，正式进入本步；Step 5 的 revalidation/history/access/status slices 合并进主对象，不另造对象。
3. **哪些名称不作为对象？** Entry、Application Service、Port、Repository、UnitOfWork、Adapter、command/query DTO、trigger 和单纯 ID/ref/enum/set 类型不作为本节对象。
4. **对象属于哪里？** 每个对象唯一归 CP1~CP5；共享使用不改变主责归属。
5. **字段粒度？** 只列维持 identity、ownership、invariant、状态和跨部分关联所需的关键逻辑字段；不锁存储列、JSON 名或 provider payload。
6. **状态粒度？** 给出对象自身概要状态；Step 9 再收稳迁移、触发和传播，不把多个轴合成单一 `success`。
7. **函数粒度？** 只写表达不变量的成员/工厂函数名和 typed parameters，不写返回类型、泛型、错误枚举或实现体。

## 4. 当前文档问题诊断

旧 02 的 `SyncTask`、`ObjectMapping`、`Conflict` 等对象服务于跨端任务与 fanout，不能承载当前 source/working-copy 分离、metadata generation、dirty protection、unknown probe 和 Governance handoff 分层。draft 候选提供了线索，但混用尚未核验的状态和 metadata 字段；必须从 Step 5 capability 重新正式化。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 一个 `SyncTask` 聚合跨端与业务状态 | 多个有唯一归属的 local objects 分离 operation、apply、recovery、handoff |
| Git/source/cursor/review 状态混轴 | 每个轴由独立对象或字段类型表达，Step 9 再定义传播 |
| provider DTO/metadata JSON 容易成为 domain model | 只保留本地语义类型；ports/adapters/物理 schema 后置 |
| 冲突与恢复只是错误/重试 | 形成 Conflict/Checkpoint/ManualResolution/Probe 四个可审计对象 |

## 6. 设计取舍

- 采用较多小而明确的对象，换取 truth owner、状态轴和 recovery/handoff 语义不混淆；不以“减少类型”为由复建上帝对象。
- Policy 独立成节，因为它们跨多个对象保护不可配置化门禁；policy 没有持久生命周期，Step 9 不为其造状态机。
- Projection/view 对象独立成节以固定 query no-write 与 degraded surface；它们不是 truth，也没有 mutation 行为。
- `MetadataManifest` 只定义逻辑 metadata 主题/引用，不锁 `.qs-sync/metadata.json`、文件数量、serialization 或 migration implementation。

## 7. 对象候选池筛选与分布

### 7.1 筛选结果

| 候选类别 | 处理 | 理由 |
|---|---|---|
| 29 个 truth/state/policy/view/reference 候选 | 全部独立展开 | 均可回指 Step 5 capability 且承担不可替代结构责任 |
| access/status/conflict/recovery 局部 slice | 合并入 `SyncStatusView` | 只是同一 query view 的组成，不应形成第二 truth |
| revalidation/metadata transition/run history | 由 `SyncOperation`、`MetadataManifest`、`MaterializationRun`、`ProvenanceRecord` 关联 | 避免无边界泛化 `AuditLog` |
| ID/ref/enum/set/digest/fingerprint 类型 | 作为字段类型 | 没有独立行为或生命周期，03 再定义二级类型 |
| Entry/Service/Port/Repository/Adapter/UoW | 不作为 domain object | 属代码主体或接缝，在 Step 7/12 展开 |

### 7.2 对象分布

| 部分 | 正式对象 |
|---|---|
| CP1 | `SyncOperation`、`SyncSelection`、`AccessEvaluation`、`OperationEligibilityPolicy`、`ExternalOwnerSnapshot` |
| CP2 | `WorkingCopyBinding`、`MetadataManifest`、`CursorState`、`MappingSet`、`WorkingCopyObservation`、`WorkingCopySafetyPolicy`、`MetadataIntegrityPolicy` |
| CP3 | `MaterializationPlan`、`SourceDelta`、`PathChangeSet`、`MaterializationRun`、`MaterializationSafetyPolicy` |
| CP4 | `ConflictRecord`、`RecoveryCheckpoint`、`ManualResolution`、`ProbeRecord`、`RecoverySafetyPolicy` |
| CP5 | `ReviewCandidate`、`HandoffAttempt`、`ProvenanceRecord`、`CandidateEligibilityPolicy`、`HandoffResultPolicy`、`LayeredHandoffStatus`、`SyncStatusView` |

## 8. CP1 Selection & Access 对象

### 8.1 `SyncOperation`

#### 8.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP1；local aggregate / correlation anchor |
| 结构责任 | 表达一次显式 mutation/maintenance 的本地阶段和关联；query 只使用瞬时 read context，不持久化本对象 |
| capability 来源 | Step 5 CP1“创建操作语境”、CP4/CP5 的恢复与 handoff 关联 |
| ownership | L5-sync local truth；不是平台 job、Project/Review lifecycle |

#### 8.1.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `operation_id` | `SyncOperationId` | 本地稳定标识；由 ID provider 创建 |
| `operation_kind` | `SyncOperationKind` | Clone/Pull/PushReview/MetadataMaintenance/Recovery 等显式意图 |
| `selection_ref` | `SyncSelectionRef` | 回指固定选择，不内嵌 owner truth |
| `state` | `SyncOperationState` | 本地 operation 状态轴 |
| `correlation_ref` | `CorrelationRef` | 跨 service/diagnostics 的低敏关联 |
| `active_checkpoint_ref` | `Optional<RecoveryCheckpointRef>` | 当前可恢复点；不证明外部完成 |
| `started_at` | `ObservedAt` | 本地观测时间，不作 owner version |
| `last_transition_ref` | `OperationTransitionRef` | 回链最近显式迁移/provenance |

#### 8.1.3 状态集合

| 状态 | 含义 |
|---|---|
| `Planned` | 显式语境已建立，尚未完成门禁 |
| `Validating` | 正在执行本地/owner 前置检查 |
| `Ready` | 当前门禁通过，可进入明确下一阶段 |
| `Running` | 正在执行受控 local 或 external step |
| `NeedsAction` | 冲突、unknown、unsupported 或 blocker 需 probe/manual |
| `Completed` | 本地 operation 已以已知结果结束；不代表 Review accepted |
| `Cancelled` | 用户显式取消本地续行，历史保留 |
| `FailedKnown` | 已知安全失败，未把 unknown 伪装成失败 |

#### 8.1.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `begin_validation` | `AccessEvaluationRef evaluation_ref` | 进入校验并关联检查 |
| `mark_ready` | `EligibilityProofRef proof_ref` | 仅在 policy 允许时标记 Ready |
| `begin_stage` | `OperationStage stage`、`RecoveryCheckpointRef checkpoint_ref` | 进入明确执行阶段 |
| `require_action` | `NeedsActionReason reason`、`ConflictRecordRef conflict_ref` | 暂停并暴露人工/探测需求 |
| `complete_local_result` | `LocalOperationResultRef result_ref` | 记录已知本地终局，不升格外部 truth |
| `cancel` | `ActorRef actor_ref`、`CancellationReason reason` | 显式取消，保留 provenance |

#### 8.1.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `plan_mutation` | `SyncOperationId operation_id`、`SyncOperationKind operation_kind`、`SyncSelectionRef selection_ref`、`CorrelationRef correlation_ref`、`ObservedAt started_at` | 创建可持久化 mutation/maintenance operation |

#### 8.1.6 禁止事项

- 禁止把 operation `Completed` 解释为 Artifact/Baseline/Review accepted/readiness。
- 禁止为 `status` query 持久化 operation、推进 state 或创建 checkpoint。
- 禁止从本对象推断权限、source authority 或外部副作用结果。

### 8.2 `SyncSelection`

#### 8.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP1；immutable value object |
| 结构责任 | 固定一次操作明确选择的 principal/project/version/source/target/operation |
| capability 来源 | Step 5 CP1“建立显式选择” |
| ownership | 本地选择语境；引用外部 owner，不复制实体 |

#### 8.2.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `principal_ref` | `PrincipalRef` | 明确调用主体；来自正式认证语境 |
| `project_ref` | `ProjectRef` | 明确项目；不得由目录推断 |
| `version_ref` | `VersionRef` | 明确版本语境；不得使用隐式 latest |
| `source_ref` | `MaterialSourceRef` | 明确来源候选；authority 仍由 owner 核验 |
| `target_ref` | `LocalTargetRef` | 明确本地目标，规范化由 fs boundary 完成 |
| `operation_kind` | `SyncOperationKind` | 明确当前动作，用于 owner allowed-action 检查 |

#### 8.2.3 状态集合

无独立生命周期；对象要么通过完整性校验成为 immutable selection，要么不创建。外部资格由 `AccessEvaluation` 表达。

#### 8.2.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `matches_binding` | `WorkingCopyBinding binding` | 比较显式选择与既有 binding，不静默重绑 |
| `same_context_as` | `SyncSelection other_selection` | 判断幂等/恢复上下文是否等价 |
| `assert_explicit` | `SelectionRequirementSet requirements` | 验证必需 refs 均明确且无 implicit marker |

#### 8.2.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `from_explicit_refs` | `PrincipalRef principal_ref`、`ProjectRef project_ref`、`VersionRef version_ref`、`MaterialSourceRef source_ref`、`LocalTargetRef target_ref`、`SyncOperationKind operation_kind` | 在不猜测默认值的前提下创建 selection |

#### 8.2.6 禁止事项

- 禁止从 Git remote/branch、目录名、缓存、默认 profile 或 `latest` 补字段。
- 禁止把 `source_ref` 本身当成已授权或可 materialize 证明。
- 禁止在对象创建后静默替换任一 ref。

### 8.3 `AccessEvaluation`

#### 8.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP1；local evaluation entity |
| 结构责任 | 记录针对明确 selection/action 的有限 owner eligibility 评估及来源 |
| capability 来源 | Step 5 CP1“查询 eligibility”“mutation 前 revalidate” |
| ownership | 评估关联属 Sync；权限/项目姿态/来源可见性 truth 仍属 owner |

#### 8.3.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `evaluation_id` | `AccessEvaluationId` | 本地评估标识 |
| `selection_ref` | `SyncSelectionRef` | 绑定被评估语境 |
| `requested_action` | `SyncOperationKind` | 防止一次评估被挪作其他动作 |
| `outcome` | `EligibilityOutcome` | Eligible/Denied/Blocked/Unknown/Stale |
| `owner_snapshot_refs` | `ExternalOwnerSnapshotRefSet` | 评估所依据的正式 owner refs |
| `reason_set` | `EligibilityReasonSet` | 安全、可展示的拒绝/阻塞原因 |
| `evaluated_at` | `ObservedAt` | 本地评估时间 |
| `freshness_state` | `FreshnessState` | 明确是否可用于当前 mutation |

#### 8.3.3 状态集合

| 状态 | 含义 |
|---|---|
| `Eligible` | 当前 owner 结果明确允许所请求动作 |
| `Denied` | owner 明确拒绝，不产生危险副作用 |
| `Blocked` | 所需合同/输入/动作不支持或互相冲突 |
| `Unknown` | 无法得到权威结论，fail-closed |
| `Stale` | 曾有结论但已不能用于当前 mutation |

#### 8.3.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `is_eligible_for` | `SyncOperationKind operation_kind` | 仅对相同动作和 fresh 结论返回可进入 |
| `mark_stale` | `SnapshotInvalidationReason reason` | 使旧评估失效，不改 owner truth |
| `block` | `EligibilityBlockReason reason` | 记录合同/输入 blocker |
| `attach_owner_snapshot` | `ExternalOwnerSnapshotRef snapshot_ref` | 回链 owner 依据 |

#### 8.3.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `evaluate` | `AccessEvaluationId evaluation_id`、`SyncSelectionRef selection_ref`、`SyncOperationKind requested_action`、`OwnerEligibilityResultSet owner_results`、`OperationEligibilityPolicy policy`、`ObservedAt evaluated_at` | 由 typed owner results 形成本地评估 |

#### 8.3.6 禁止事项

- 禁止本地 default allow 或把缺少结果解释为 Eligible。
- 禁止跨 action、selection 或过期 snapshot 复用。
- 禁止把 reason/snapshot 存为 credential、raw body 或 owner entity 副本。

### 8.4 `OperationEligibilityPolicy`

#### 8.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP1；stateless domain policy |
| 结构责任 | 将所需 owner checks、freshness 和 hard blockers 组合为 fail-closed eligibility |
| capability 来源 | Step 5 CP1 所有 mutation 门禁 |
| ownership | Sync-local rule；不定义 owner authorization policy |

#### 8.4.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `required_check_set` | `OwnerCheckRequirementSet` | 每种 operation 必须取得哪些 owner 结果 |
| `staleness_rule` | `SnapshotFreshnessRule` | 判断 ref/snapshot 是否只能展示而不可授权 |
| `hard_blocker_set` | `EligibilityHardBlockerSet` | archived/revoked/conflict/unsupported 等不可绕过条件 |

#### 8.4.3 状态集合

无生命周期；policy 的规则版本由详细设计的配置/构建注入管理，但安全门禁不可运行时配置关闭。

#### 8.4.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `evaluate` | `SyncSelection selection`、`OwnerEligibilityResultSet owner_results`、`ObservedAt evaluation_time` | 生成 typed outcome，不补缺省允许 |
| `requires_revalidation` | `AccessEvaluation evaluation`、`SyncOperationStage target_stage` | 判断副作用前是否必须重查 |
| `reject_if_blocked` | `EligibilityOutcome outcome` | 强制 hard blocker 停止路径 |

#### 8.4.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `from_contract_requirements` | `OwnerCheckRequirementSet required_check_set`、`SnapshotFreshnessRule staleness_rule`、`EligibilityHardBlockerSet hard_blocker_set` | 由已审核设计规则构造 policy |

#### 8.4.6 禁止事项

- 禁止重新实现 Identity/Work/Governance 授权算法。
- 禁止以 cache age、网络错误或“开发模式”自动允许。
- 禁止配置关闭 archived/revoked/unknown fail-closed。

### 8.5 `ExternalOwnerSnapshot`

#### 8.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP1；reference/snapshot object，供五部分共享 |
| 结构责任 | 保存最小 owner ref、source/version、freshness、visibility 与安全状态摘要 |
| capability 来源 | Step 5 CP1 owner checks；各部分 owner ref 支撑 |
| ownership | snapshot 记录属 Sync；被引用 truth 属外部 owner |

#### 8.5.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `snapshot_id` | `ExternalOwnerSnapshotId` | 本地 snapshot 标识 |
| `owner_kind` | `ExternalOwnerKind` | Identity/Work/Artifact/Workspace/Governance/Archive/Observability |
| `subject_ref` | `ExternalSubjectRef` | 最小 typed external ref |
| `source_version_ref` | `OwnerVersionRef` | owner 提供的版本/水位引用；不可用则显式缺失 |
| `freshness_state` | `FreshnessState` | Fresh/Stale/Unknown/Invalidated |
| `visibility_state` | `ReferenceVisibilityState` | Visible/Restricted/Unavailable |
| `safe_state_summary` | `SafeOwnerStateSummary` | body-free 的有限 owner 结果 |
| `observed_at` | `ObservedAt` | 本地观察时间，不替代 owner version |

#### 8.5.3 状态集合

| 状态 | 含义 |
|---|---|
| `Fresh` | 在所属合同允许范围内可被当前检查使用 |
| `Stale` | 只能展示，不得授权危险副作用 |
| `Unknown` | 无法判断新鲜度或 owner 状态 |
| `Invalidated` | 已收到撤销/变更或与新结果冲突 |
| `Unavailable` | owner/ref 当前不可读取，保留历史关联 |

#### 8.5.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `is_usable_for_mutation` | `SyncOperationKind operation_kind`、`SnapshotFreshnessRule freshness_rule` | 判断是否可作为 evaluation 输入而非自行授权 |
| `invalidate` | `SnapshotInvalidationReason reason` | 标记失效并保留原 ref |
| `matches_subject` | `ExternalSubjectRef subject_ref` | 防止 snapshot 错绑 |
| `redacted_summary` | `RedactionPolicyRef redaction_policy_ref` | 生成有限展示摘要 |

#### 8.5.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `capture` | `ExternalOwnerSnapshotId snapshot_id`、`ExternalOwnerKind owner_kind`、`ExternalSubjectRef subject_ref`、`OwnerVersionRef source_version_ref`、`SafeOwnerStateSummary safe_state_summary`、`ReferenceVisibilityState visibility_state`、`ObservedAt observed_at` | 从正式 adapter result 捕获最小 snapshot |

#### 8.5.6 禁止事项

- 禁止保存外部正文、credential、raw response、evidence/report body。
- 禁止把 snapshot 当 permission truth、Artifact/Workspace/Gate/Archive 本体。
- 禁止因 owner 不可用而把旧 snapshot 自动恢复为 Fresh。

### 8.6 CP1 对象正式化停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 五个候选全部正式化；access slice/history 已归并，无悬空 |
| capability 来源 | 每对象均回指 selection/operation/check/revalidate/reference capability |
| 字段/函数粒度 | typed skeleton 完整；未写 provider schema 或实现签名 |
| ownership | operation/evaluation/snapshot relation 属本地；authorization/project/source truth 不转移 |
| Step 8/9 反查 | operation/access states 与 select/revalidate flow 已有明确主语 |
| blocker | `SYNC-UP-001/003` 保持开放，正向 adapter/action matrix 未伪造 |

## 9. CP2 Working Copy & Metadata 对象

### 9.1 `WorkingCopyBinding`

#### 9.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP2；local aggregate |
| 结构责任 | 将显式 project/version/source 与唯一 local target、generation 和 metadata/provenance 锚点关联 |
| capability 来源 | Step 5 CP2 initialize binding、load/validate、rebind |
| ownership | L5-sync local truth；不等于 Workspace projection 或 Git remote |

#### 9.1.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `binding_id` | `WorkingCopyBindingId` | 本地稳定标识 |
| `selection_ref` | `SyncSelectionRef` | 显式外部语境 |
| `target_ref` | `CanonicalLocalTargetRef` | 规范化本地目标，物理路径不作为外部身份 |
| `generation` | `MetadataGeneration` | 区分重绑/迁移后的本地世代 |
| `state` | `WorkingCopyBindingState` | binding 生命周期轴 |
| `metadata_manifest_ref` | `MetadataManifestRef` | 指向受控逻辑 metadata |
| `provenance_root_ref` | `ProvenanceRecordRef` | 回链最初/当前受保护来源关系 |
| `last_observation_ref` | `Optional<WorkingCopyObservationRef>` | 最近本地观察，不自动刷新 |

#### 9.1.3 状态集合

| 状态 | 含义 |
|---|---|
| `Initializing` | 正在建立新 binding，尚不可用于 apply |
| `Bound` | generation、manifest、selection 与 target 一致 |
| `Restricted` | 仍可只读观察，但 mutation 因 posture/integrity/safety 受限 |
| `NeedsMigration` | metadata 逻辑版本需显式迁移 |
| `NeedsRebind` | 现有关系不能安全自动沿用，需显式决定 |
| `Invalidated` | source/target/generation relation 已失效，历史保留 |

#### 9.1.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `assert_matches` | `SyncSelection selection`、`CanonicalLocalTargetRef target_ref` | 防止静默换 source/target |
| `attach_observation` | `WorkingCopyObservationRef observation_ref` | 关联一次只读 local observation |
| `restrict` | `BindingRestrictionReason reason` | 收紧 mutation，不删除 relation |
| `require_migration` | `MetadataSchemaRef target_schema_ref` | 标记显式 migration 需求 |
| `invalidate` | `BindingInvalidationReason reason` | 失效当前 generation 并保留 provenance |

#### 9.1.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `initialize` | `WorkingCopyBindingId binding_id`、`SyncSelectionRef selection_ref`、`CanonicalLocalTargetRef target_ref`、`MetadataGeneration generation`、`MetadataManifestRef metadata_manifest_ref`、`ProvenanceRecordRef provenance_root_ref` | 在安全 target 与显式 selection 上建立 binding |
| `rebind_explicitly` | `WorkingCopyBinding prior_binding`、`SyncSelectionRef new_selection_ref`、`MetadataGeneration new_generation`、`ProvenanceRecordRef transition_provenance_ref` | 创建新 generation，不原地伪造旧来源 |

#### 9.1.6 禁止事项

- 禁止根据当前目录、Git remote/branch 或 cache 自动创建/重绑。
- 禁止把 binding 当 Workspace projection、Artifact 或 source authority。
- 禁止在 provenance 缺失、metadata 不完整或 target 不安全时进入 Bound。

### 9.2 `MetadataManifest`

#### 9.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP2；local aggregate / logical metadata root |
| 结构责任 | 定义 `.qs-sync` 中受控逻辑主题、schema/generation/integrity 与各 local record refs |
| capability 来源 | Step 5 CP2 initialize/load/validate/migrate/repair |
| ownership | L5-sync local metadata truth；物理布局 pending |

#### 9.2.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `manifest_id` | `MetadataManifestId` | 逻辑 manifest 标识 |
| `schema_ref` | `MetadataSchemaRef` | 逻辑 schema/version ref，不锁 serialization |
| `generation` | `MetadataGeneration` | 与 binding 世代一致 |
| `integrity_state` | `MetadataIntegrityState` | Valid/NeedsMigration/Corrupt/Unknown |
| `binding_ref` | `WorkingCopyBindingRef` | 防止 metadata 被搬用到其他 target/source |
| `cursor_state_ref` | `Optional<CursorStateRef>` | local cursor 主题引用 |
| `mapping_set_ref` | `Optional<MappingSetRef>` | local mapping 主题引用 |
| `active_operation_refs` | `SyncOperationRefSet` | 可恢复 operation/attempt 引用集合 |
| `protected_provenance_refs` | `ProvenanceRecordRefSet` | 不可静默删除的 provenance roots |
| `last_transition_ref` | `MetadataTransitionRef` | init/migrate/repair/rebind 关联 |

#### 9.2.3 状态集合

| 状态 | 含义 |
|---|---|
| `Valid` | 逻辑 schema/generation/integrity 可用于当前 binding |
| `NeedsMigration` | 只能显式迁移，不可自动写新格式 |
| `Corrupt` | 完整性检查失败，禁止危险 mutation |
| `Unknown` | 无法证明完整性或 schema 支持 |
| `ReadOnlyProtected` | 可读取历史/provenance，但不可修改当前 local truth |

#### 9.2.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `validate_for_binding` | `WorkingCopyBindingRef binding_ref`、`MetadataIntegrityPolicy policy` | 校验 schema/generation/refs |
| `attach_cursor_state` | `CursorStateRef cursor_state_ref` | 更新逻辑引用，需 UoW 保障 |
| `attach_mapping_set` | `MappingSetRef mapping_set_ref` | 更新 mapping 引用 |
| `protect_provenance` | `ProvenanceRecordRef provenance_ref` | 增加不可静默删除 root |
| `mark_corrupt` | `MetadataIntegrityFailure failure` | 显式记录损坏，不自动修复 |
| `record_transition` | `MetadataTransitionRef transition_ref` | 关联显式 init/migrate/repair/rebind |

#### 9.2.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `initialize_logical_manifest` | `MetadataManifestId manifest_id`、`MetadataSchemaRef schema_ref`、`MetadataGeneration generation`、`WorkingCopyBindingRef binding_ref`、`ProvenanceRecordRef root_provenance_ref` | 创建逻辑 metadata root |
| `migrate_generation` | `MetadataManifest prior_manifest`、`MetadataSchemaRef target_schema_ref`、`MetadataGeneration new_generation`、`MetadataTransitionRef transition_ref` | 保留旧来源关联并产生新 generation |

#### 9.2.6 禁止事项

- 禁止锁定单文件、JSON 字段、数据库表或永久删除语义。
- 禁止 query/status 隐式初始化、迁移、修复或清理 manifest。
- 禁止保存 secret、raw body/output、外部 evidence/report 正文。
- 禁止完整性未知时假定 Valid 或重造 provenance refs。

### 9.3 `CursorState`

#### 9.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP2；local state entity |
| 结构责任 | 分离记录 source observed waterline、local applied cursor、continuity/gap 和 generation |
| capability 来源 | Step 5 CP2 maintain cursor/mapping；CP3 compare/finalize |
| ownership | local applied progress 属 Sync；source cursor semantics 属 owner contract |

#### 9.3.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `cursor_state_id` | `CursorStateId` | 本地实体标识 |
| `binding_ref` | `WorkingCopyBindingRef` | 限定 working copy |
| `generation` | `MetadataGeneration` | 防止跨 generation 复用 |
| `source_observed_cursor_ref` | `Optional<SourceCursorRef>` | owner 提供/观察的水位 |
| `local_applied_cursor_ref` | `Optional<SourceCursorRef>` | 已证明安全落地的来源水位 |
| `continuity_state` | `CursorContinuityState` | Unset/Continuous/Gap/Unknown/Unsupported |
| `comparator_ref` | `Optional<ComparatorContractRef>` | 回链比较规则，不复制算法 |
| `last_run_ref` | `Optional<MaterializationRunRef>` | 产生当前 local cursor 的 run |

#### 9.3.3 状态集合

| 状态 | 含义 |
|---|---|
| `Unset` | 尚无已应用水位 |
| `Continuous` | 由正式 comparator 证明当前 source/local 可接续 |
| `Gap` | 检测到缺口，禁止增量推进 |
| `Unknown` | 无法证明连续性 |
| `Unsupported` | 当前 source/adapter 没有安全 cursor/comparator 合同 |

#### 9.3.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `observe_source_cursor` | `SourceCursorRef source_cursor_ref`、`ComparatorContractRef comparator_ref` | 记录观察，不推进 local applied |
| `mark_gap` | `CursorGapReason reason` | 阻断增量路径 |
| `finalize_applied_cursor` | `SourceCursorRef applied_cursor_ref`、`MaterializationRunRef run_ref`、`MetadataGeneration generation` | 仅在 proven apply + same generation 时推进 |
| `invalidate_for_generation` | `MetadataGeneration new_generation` | 禁止旧 cursor 被静默复用 |

#### 9.3.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `initialize_unset` | `CursorStateId cursor_state_id`、`WorkingCopyBindingRef binding_ref`、`MetadataGeneration generation` | 创建未应用水位状态 |

#### 9.3.6 禁止事项

- 禁止以 Git HEAD/commit、时间戳、收到顺序或 `+1` 推断 source cursor。
- 禁止 apply partial/unknown 时推进 local applied cursor。
- 禁止把 source observed 与 local applied 合并成单一“current version”。

### 9.4 `MappingSet`

#### 9.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP2；local entity / mapping collection |
| 结构责任 | 保存 owner source item/version 与本地受控 path/object ref 的可回链映射及 generation |
| capability 来源 | Step 5 CP2 maintain mapping；CP3 path plan/finalize |
| ownership | L5-sync local mapping truth；不成为 Artifact lineage 或 Git remote map |

#### 9.4.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `mapping_set_id` | `MappingSetId` | 映射集合标识 |
| `binding_ref` | `WorkingCopyBindingRef` | 限定 working copy |
| `generation` | `MetadataGeneration` | 限定世代 |
| `entry_set` | `SourceLocalMappingEntrySet` | typed source→local mapping entries |
| `mapping_version_ref` | `MappingVersionRef` | local logical revision |
| `integrity_state` | `MappingIntegrityState` | Valid/Conflict/Unknown |
| `last_run_ref` | `Optional<MaterializationRunRef>` | 最近提交映射的 run |

#### 9.4.3 状态集合

| 状态 | 含义 |
|---|---|
| `Valid` | entries 与 binding generation 一致且路径可解释 |
| `Conflict` | source/local entries 重叠、重命名/删除关系冲突 |
| `Unknown` | 无法证明完整性/兼容性 |
| `Invalidated` | generation/source contract 变化，旧集合不可继续使用 |

#### 9.4.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `resolve_local_target` | `SourceItemRef source_item_ref` | 查找已知映射，不猜默认路径 |
| `validate_change_set` | `PathChangeSet path_change_set`、`WorkingCopySafetyPolicy safety_policy` | 检测重叠/rename/delete/path 冲突 |
| `apply_committed_changes` | `MappingChangeSet mapping_change_set`、`MaterializationRunRef run_ref` | 仅在 UoW finalize 中更新 |
| `invalidate` | `MappingInvalidationReason reason` | 失效而不伪造替代映射 |

#### 9.4.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `initialize_empty` | `MappingSetId mapping_set_id`、`WorkingCopyBindingRef binding_ref`、`MetadataGeneration generation`、`MappingVersionRef mapping_version_ref` | 为新 binding 建空 mapping set |

#### 9.4.6 禁止事项

- 禁止把路径/branch/commit 映射当 Artifact lineage/Baseline。
- 禁止未知 rename/delete 关系时自动选择目标或覆盖。
- 禁止跨 binding/generation 复用 entries。

### 9.5 `WorkingCopyObservation`

#### 9.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP2；immutable observation/value object |
| 结构责任 | body-free 描述某时刻 target 的 Git/fs/path/tool 状态与 fingerprints |
| capability 来源 | Step 5 CP2 inspect/observe working copy |
| ownership | 观察记录属 Sync；Git/filesystem 实际状态仍由本地环境/用户控制 |

#### 9.5.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `observation_id` | `WorkingCopyObservationId` | 本地观察标识 |
| `target_ref` | `CanonicalLocalTargetRef` | 被观察目标 |
| `git_head_ref` | `Optional<GitObjectRef>` | Git local observation；不等于 platform version |
| `working_tree_state` | `WorkingTreeState` | Clean/Dirty/Untracked/Conflicted/Unknown |
| `path_safety_state` | `PathSafetyState` | Safe/Unsafe/Unknown |
| `lock_state` | `LocalLockState` | Acquired/Unavailable/NotRequested/Unknown |
| `tool_capability_set` | `LocalToolCapabilitySet` | 白名单能力/unsupported，不是任意命令 |
| `content_fingerprint_ref` | `Optional<ContentFingerprintRef>` | freeze/drift 检测的 bounded digest |
| `observed_at` | `ObservedAt` | 观察时间 |

#### 9.5.3 状态集合

对象本身 immutable；关键状态轴为 `working_tree_state`、`path_safety_state`、`lock_state`，不得压缩成单一 ready/failed。

#### 9.5.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `is_safe_for_plan` | `SyncOperationKind operation_kind`、`WorkingCopySafetyPolicy safety_policy` | 判断能否构造 plan，不自行执行写入 |
| `matches_fingerprint` | `ContentFingerprintRef fingerprint_ref` | 检测 freeze/plan drift |
| `supports_capability` | `LocalToolCapability capability` | 返回明确 supported/unsupported/unknown |

#### 9.5.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `capture` | `WorkingCopyObservationId observation_id`、`CanonicalLocalTargetRef target_ref`、`GitObservationResult git_result`、`FilesystemObservationResult filesystem_result`、`LocalToolCapabilitySet tool_capability_set`、`ObservedAt observed_at` | 从白名单 adapters 生成 bounded observation |

#### 9.5.6 禁止事项

- 禁止保存 raw stdout/stderr、secret、文件正文或无界目录清单。
- 禁止把 Clean 解释为 access/source eligibility 或 Review readiness。
- 禁止 status 捕获观察时隐式加锁、修复或修改 working tree。

### 9.6 `WorkingCopySafetyPolicy`

#### 9.6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP2；stateless domain policy |
| 结构责任 | 对 dirty/untracked/path/symlink/lock/tool capability 实施 non-overwrite 门禁 |
| capability 来源 | Step 5 CP2 inspect/init；CP3 validate/apply |
| ownership | Sync safety rule，不定义 Git 用户策略或 remote policy |

#### 9.6.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `protected_change_set` | `ProtectedLocalChangeKindSet` | dirty/untracked/conflicted 等不得覆盖类别 |
| `path_guard_rule` | `PathGuardRule` | canonical root/symlink/escape 等安全判断 |
| `required_capability_set` | `LocalToolCapabilitySet` | 对各 operation 所需白名单能力 |

#### 9.6.3 状态集合

无生命周期；判断结果使用 Safe/Conflict/Blocked/Unknown，不允许 Unknown 退化为 Safe。

#### 9.6.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `evaluate_target` | `WorkingCopyObservation observation`、`SyncOperationKind operation_kind` | 评估本地目标是否可进入相应阶段 |
| `validate_path_change_set` | `PathChangeSet path_change_set`、`MappingSet mapping_set` | 识别覆盖/越界/重叠风险 |
| `requires_manual_resolution` | `WorkingCopyObservation observation` | dirty/unknown 等返回显式人工需求 |

#### 9.6.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `strict_default` | `ProtectedLocalChangeKindSet protected_change_set`、`PathGuardRule path_guard_rule`、`LocalToolCapabilitySet required_capability_set` | 构建不可放宽的安全 policy |

#### 9.6.6 禁止事项

- 禁止提供自动 stash/merge/rebase/push/overwrite 作为“解决”策略。
- 禁止通过配置允许 path escape、unknown capability 或 dirty overwrite。
- 禁止把 tool exit success 当文件状态安全证明。

### 9.7 `MetadataIntegrityPolicy`

#### 9.7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP2；stateless domain policy |
| 结构责任 | 校验 manifest schema support、generation/binding refs、protected provenance 和 local record closure |
| capability 来源 | Step 5 CP2 load/validate/migrate/repair |
| ownership | Sync metadata rule；物理 storage integrity mechanism 留 03 |

#### 9.7.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `supported_schema_rule` | `MetadataSchemaSupportRule` | 判断 logical schema supported/migration required |
| `reference_closure_rule` | `MetadataReferenceClosureRule` | 防止 dangling/mismatched refs |
| `provenance_protection_rule` | `ProvenanceProtectionRule` | 防止 migration/repair 丢失来源链 |

#### 9.7.3 状态集合

无生命周期；输出 Valid/NeedsMigration/Corrupt/Unknown/ReadOnlyProtected。

#### 9.7.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `evaluate` | `MetadataManifest manifest`、`WorkingCopyBinding binding`、`MetadataRecordSummarySet record_summaries` | 生成 typed integrity result |
| `validate_migration` | `MetadataManifest prior_manifest`、`MetadataManifest candidate_manifest` | 验证 generation 与 provenance continuity |
| `protect_against_rebind` | `WorkingCopyBinding binding`、`SyncSelection new_selection` | 阻止静默换 source/target |

#### 9.7.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `from_schema_contract` | `MetadataSchemaSupportRule supported_schema_rule`、`MetadataReferenceClosureRule reference_closure_rule`、`ProvenanceProtectionRule provenance_protection_rule` | 从已审核逻辑合同构建 policy |

#### 9.7.6 禁止事项

- 禁止遇到 unknown/corrupt 时自动重建“看似有效”的 provenance。
- 禁止以删除损坏记录或回退旧缓存伪造 integrity success。
- 禁止在 query/status 中执行 repair/migration。

### 9.8 CP2 对象正式化停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 七个候选全部正式化；transition history 归 manifest/provenance |
| capability 来源 | bind/manifest/cursor/mapping/observe/safety/integrity 全覆盖 |
| 逻辑 schema | 字段为 logical topics/refs，未锁文件/JSON/数据库 |
| ownership | local truth 与 Workspace/Git/source truth 分离 |
| Step 8/9 反查 | binding/manifest/cursor/mapping states 与 clone/pull/maintenance 已有主语 |
| blocker | `SYNC-UP-006/007/010` 保持开放，物理迁移与完整 Git/path contract 未伪造 |

## 10. CP3 Source Materialization 对象

### 10.1 `MaterializationPlan`

#### 10.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP3；local aggregate / immutable execution plan |
| 结构责任 | 固定一次 materialization 的 source/local preconditions、delta、path changes、generation 与 cursor target |
| capability 来源 | Step 5 CP3 build/validate plan |
| ownership | L5-sync local plan；不拥有 source material truth |

#### 10.1.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `plan_id` | `MaterializationPlanId` | 本地 plan 标识 |
| `operation_ref` | `SyncOperationRef` | 关联显式 clone/pull/recovery operation |
| `binding_ref` | `WorkingCopyBindingRef` | 锁定 target relation |
| `binding_generation` | `MetadataGeneration` | 防止跨 generation apply |
| `access_evaluation_ref` | `AccessEvaluationRef` | 构造时资格依据，执行前仍可要求 revalidate |
| `source_delta_ref` | `SourceDeltaRef` | 明确 source input |
| `path_change_set_ref` | `PathChangeSetRef` | 明确受影响路径与 mapping changes |
| `precondition_fingerprint_ref` | `ContentFingerprintRef` | 防止 plan 后 local drift |
| `target_cursor_ref` | `Optional<SourceCursorRef>` | 成功后可 finalize 的水位 |
| `state` | `MaterializationPlanState` | Draft/Validated/Invalidated/Consumed |

#### 10.1.3 状态集合

| 状态 | 含义 |
|---|---|
| `Draft` | source/path/preconditions 已组合但未完成全部 safety checks |
| `Validated` | 当前 access/binding/observation/comparator/path checks 通过 |
| `Invalidated` | 任一 precondition drift、posture change 或 conflict 使 plan 不可执行 |
| `Consumed` | 已用于一次明确 run；重试须依据 checkpoint/新观察判断 |

#### 10.1.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `validate` | `AccessEvaluation access_evaluation`、`WorkingCopyObservation observation`、`MaterializationSafetyPolicy safety_policy` | 验证并转为 Validated |
| `matches_generation` | `MetadataGeneration generation` | 防止旧 plan 写新 generation |
| `matches_observation` | `WorkingCopyObservation observation` | 用 fingerprint 检测 drift |
| `invalidate` | `MaterializationInvalidationReason reason` | 失效而不自动重算/执行 |
| `consume` | `MaterializationRunRef run_ref` | 关联唯一执行 attempt |

#### 10.1.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `draft` | `MaterializationPlanId plan_id`、`SyncOperationRef operation_ref`、`WorkingCopyBindingRef binding_ref`、`MetadataGeneration binding_generation`、`AccessEvaluationRef access_evaluation_ref`、`SourceDeltaRef source_delta_ref`、`PathChangeSetRef path_change_set_ref`、`ContentFingerprintRef precondition_fingerprint_ref`、`Optional<SourceCursorRef> target_cursor_ref` | 从已解析输入创建 immutable draft |

#### 10.1.6 禁止事项

- 禁止在缺 source authority/comparator/mapping 或 dirty/path unknown 时 Validated。
- 禁止 plan 自动执行、自动 rebase/merge 或修改 metadata。
- 禁止跨 selection/binding/generation/observation 复用。

### 10.2 `SourceDelta`

#### 10.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP3；immutable source input value object |
| 结构责任 | 表达正式 source port 返回的全量/增量/no-op/gap 输入摘要和连续性依据 |
| capability 来源 | Step 5 CP3 resolve/compare source |
| ownership | 本地消费对象；source/Artifact/Workspace truth 仍属 owner |

#### 10.2.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `source_delta_id` | `SourceDeltaId` | 本地消费标识 |
| `source_ref` | `MaterialSourceRef` | 正式来源引用 |
| `from_cursor_ref` | `Optional<SourceCursorRef>` | local applied 起点 |
| `to_cursor_ref` | `SourceCursorRef` | owner 目标水位 |
| `delta_kind` | `SourceDeltaKind` | Full/Incremental/NoOp/Gap/Unsupported |
| `source_item_change_set` | `SourceItemChangeSet` | body-free item change descriptors/locators |
| `comparator_ref` | `ComparatorContractRef` | 连续性/次序 authority |
| `continuity_proof_ref` | `Optional<ContinuityProofRef>` | owner-provided/verifiable接续依据 |
| `source_digest_ref` | `SourceDigestRef` | 有界完整性引用，不等于 Artifact body |

#### 10.2.3 状态集合

对象 immutable；`delta_kind` 同时表达可执行与受阻类别，Gap/Unsupported 不得作为空增量继续。

#### 10.2.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `is_continuous_from` | `CursorState cursor_state` | 使用 comparator/proof 判断接续，不能自行排序 |
| `requires_full_materialization` | `CursorState cursor_state` | 根据正式语义判断 full，不用缺口猜测 |
| `assert_supported` | `SourceCapabilitySet capability_set` | 明确 unsupported/blocked |

#### 10.2.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `from_owner_result` | `SourceDeltaId source_delta_id`、`MaterialSourceRef source_ref`、`OwnerSourceDeltaResult owner_result`、`ComparatorContractRef comparator_ref` | 将正式 port result 转为本地有限语义 |

#### 10.2.6 禁止事项

- 禁止保存 owner/source 正文、内部 schema 或 raw response。
- 禁止以时间戳、数组顺序、Git commit 或 guessed `latest` 生成 delta。
- 禁止把 Gap/Unsupported/Unknown 转成 NoOp 或 Full 成功。

### 10.3 `PathChangeSet`

#### 10.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP3；immutable value object |
| 结构责任 | 表达 materialization 对 local paths 的 create/update/delete/rename intent、mapping 变化与保护判断输入 |
| capability 来源 | Step 5 CP3 validate path change set |
| ownership | local plan input；不等于实际 filesystem outcome |

#### 10.3.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `path_change_set_id` | `PathChangeSetId` | 计划标识 |
| `root_target_ref` | `CanonicalLocalTargetRef` | 所有变化限定根目录 |
| `change_entries` | `PathChangeEntrySet` | typed create/update/delete/rename entries |
| `mapping_change_set` | `MappingChangeSet` | 成功后拟更新 mapping |
| `affected_path_fingerprint_set` | `PathFingerprintSet` | drift/non-overwrite 检测 |
| `safety_state` | `PathChangeSafetyState` | Draft/Safe/Conflict/Blocked/Unknown |
| `conflict_hint_set` | `ConflictHintSet` | 交 CP4 正式分类的线索 |

#### 10.3.3 状态集合

| 状态 | 含义 |
|---|---|
| `Draft` | 变化已映射，尚未做全部 local checks |
| `Safe` | 当前 observation/mapping/path policy 证明可 apply |
| `Conflict` | 与 dirty/untracked/mapping/rename/delete 等冲突 |
| `Blocked` | 工具/path capability 不支持或 contract 缺失 |
| `Unknown` | 无法证明路径安全 |

#### 10.3.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `evaluate_safety` | `WorkingCopyObservation observation`、`MappingSet mapping_set`、`WorkingCopySafetyPolicy safety_policy` | 计算 typed safety state |
| `affected_paths` | `PathSelectionScope scope` | 返回 bounded typed path refs，不读取正文 |
| `matches_current_fingerprints` | `WorkingCopyObservation observation` | 执行前检查 drift |
| `mark_conflict` | `ConflictHintSet conflict_hint_set` | 形成 CP4 输入，不自动解决 |

#### 10.3.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `derive` | `PathChangeSetId path_change_set_id`、`CanonicalLocalTargetRef root_target_ref`、`SourceDelta source_delta`、`MappingSet mapping_set`、`PathMappingRule path_mapping_rule` | 将 source changes 映射为 local intent |

#### 10.3.6 禁止事项

- 禁止 path escape、危险 symlink follow、隐式覆盖或以“force”绕过 safety。
- 禁止把 intent 当实际写入结果或 cursor advancement。
- 禁止自动决定 rename/delete 冲突。

### 10.4 `MaterializationRun`

#### 10.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP3；local execution entity/history record |
| 结构责任 | 记录一次已准备 plan 的本地 apply attempt、分段 outcome、checkpoint 与 finalize 资格 |
| capability 来源 | Step 5 CP3 apply/finalize/resume |
| ownership | L5-sync local execution truth；不证明 source/Artifact/Review 成功 |

#### 10.4.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `run_id` | `MaterializationRunId` | 本地 run 标识，不伪造平台 run id |
| `plan_ref` | `MaterializationPlanRef` | 唯一 plan |
| `state` | `MaterializationRunState` | apply 本地状态轴 |
| `applied_segment_refs` | `AppliedSegmentRefSet` | 已知完成的 bounded local segments |
| `checkpoint_ref` | `Optional<RecoveryCheckpointRef>` | partial/unknown 的恢复锚点 |
| `result_fingerprint_ref` | `Optional<ContentFingerprintRef>` | 已知结果摘要 |
| `failure_summary` | `Optional<SafeFailureSummary>` | redacted failure，不含 raw output |
| `finalized_cursor_ref` | `Optional<SourceCursorRef>` | 仅 finalize 后记录 |

#### 10.4.3 状态集合

| 状态 | 含义 |
|---|---|
| `Prepared` | plan 已验证，尚未开始 apply |
| `Applying` | 正在执行受控 local changes |
| `AppliedPendingFinalize` | local apply 已知完成，cursor/mapping 尚未原子 finalize |
| `Finalized` | local result 与 cursor/mapping/provenance 已关联提交 |
| `Partial` | 部分 local steps 已知完成，需 checkpoint/recovery |
| `OutcomeUnknown` | 无法证明本地结果，禁止 cursor advance |
| `Blocked` | 门禁/能力阻断，未继续 apply |
| `FailedKnown` | 已知失败并保留安全现场 |

#### 10.4.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `begin_apply` | `WorkingCopyObservation observation` | 再核 preconditions 后进入 Applying |
| `record_segment` | `AppliedSegmentRef segment_ref`、`ContentFingerprintRef fingerprint_ref` | 记录已知 local progress |
| `mark_applied_pending_finalize` | `ContentFingerprintRef result_fingerprint_ref` | 允许后续 UoW finalize |
| `finalize` | `SourceCursorRef applied_cursor_ref`、`MappingVersionRef mapping_version_ref`、`ProvenanceRecordRef provenance_ref` | 关联 local atomic visibility |
| `checkpoint_partial` | `RecoveryCheckpointRef checkpoint_ref`、`SafeFailureSummary failure_summary` | 保留 partial，不伪造回滚 |
| `mark_outcome_unknown` | `RecoveryCheckpointRef checkpoint_ref`、`UnknownOutcomeReason reason` | 进入 recovery，cursor 不推进 |

#### 10.4.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `prepare` | `MaterializationRunId run_id`、`MaterializationPlanRef plan_ref`、`RecoveryCheckpointRef initial_checkpoint_ref` | 在执行前持久化 run/checkpoint |

#### 10.4.6 禁止事项

- 禁止 Partial/OutcomeUnknown/AppliedPendingFinalize 显示为 Finalized。
- 禁止用 Git commit、process exit 0 或文件存在推断完整成功。
- 禁止 raw stdout/stderr、正文或 credential 入 failure summary。

### 10.5 `MaterializationSafetyPolicy`

#### 10.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP3；stateless domain policy |
| 结构责任 | 联合 access、source continuity、binding generation、working-copy safety、mapping/path 与 conflict preconditions |
| capability 来源 | Step 5 CP3 plan/validate/apply/finalize |
| ownership | Sync local safety rule；不定义 source comparator/owner policy |

#### 10.5.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `required_precondition_set` | `MaterializationPreconditionSet` | 必须同时满足的 checks |
| `continuity_requirement` | `CursorContinuityRequirement` | Full/Incremental 对 continuity 要求 |
| `drift_rule` | `LocalDriftRule` | plan/freeze 后变化即失效 |
| `finalization_rule` | `LocalFinalizationRule` | cursor/mapping/provenance 可见性条件 |

#### 10.5.3 状态集合

无生命周期；输出 Safe/Conflict/Blocked/Unknown/Invalidated。

#### 10.5.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `validate_plan` | `MaterializationPlan plan`、`AccessEvaluation access_evaluation`、`CursorState cursor_state`、`WorkingCopyObservation observation`、`MappingSet mapping_set` | 联合验证，不自行补 owner 结论 |
| `validate_before_apply` | `MaterializationPlan plan`、`WorkingCopyObservation current_observation` | 检测 generation/fingerprint/access drift |
| `can_finalize` | `MaterializationRun run`、`MetadataGeneration current_generation` | 只有 proven local result 可 finalize |

#### 10.5.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `strict` | `MaterializationPreconditionSet required_precondition_set`、`CursorContinuityRequirement continuity_requirement`、`LocalDriftRule drift_rule`、`LocalFinalizationRule finalization_rule` | 构造不可由便利配置放宽的 policy |

#### 10.5.6 禁止事项

- 禁止在任一 required precondition Unknown 时返回 Safe。
- 禁止用 full materialization 自动规避 dirty/path/source authority 缺口。
- 禁止在 policy 内执行 I/O、owner query 或自动冲突决策。

### 10.6 CP3 对象正式化停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 五个候选全部正式化；source locator/cursor refs 保持字段类型 |
| capability 来源 | resolve/compare/plan/path/apply/finalize/resume 全覆盖 |
| plan/outcome 分离 | `MaterializationPlan`、`PathChangeSet` 与 `MaterializationRun` 明确分开 |
| ownership | source input 是外部 ref；local plan/run 才是本仓 truth |
| Step 8/9 反查 | clone/pull flow 与 plan/run/cursor 状态主语齐全 |
| blocker | `SYNC-UP-002/007/008/010` 保持开放，正向 comparator/mapping/tool 合同未伪造 |

## 11. CP4 Conflict & Recovery 对象

### 11.1 `ConflictRecord`

#### 11.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP4；local entity / protected history |
| 结构责任 | 将 access/source/cursor/mapping/path/dirty/metadata/apply/handoff 冲突记录为可解释本地事实 |
| capability 来源 | Step 5 CP4 classify conflict |
| ownership | L5-sync local conflict truth；不等于 Git merge conflict 或 owner dispute truth |

#### 11.1.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `conflict_id` | `ConflictRecordId` | 本地冲突标识 |
| `operation_ref` | `SyncOperationRef` | 受影响 operation |
| `conflict_kind` | `SyncConflictKind` | Access/Posture/SourceGap/Mapping/Dirty/Path/Metadata/Apply/Handoff 等 |
| `state` | `ConflictState` | Open/AwaitingDecision/ResolutionRecorded/Superseded/Closed |
| `affected_ref_set` | `AffectedSyncRefSet` | bounded paths/source/mapping/attempt refs |
| `basis_summary` | `ConflictBasisSummary` | body-free 检测依据 |
| `checkpoint_ref` | `Optional<RecoveryCheckpointRef>` | 可恢复关联 |
| `manual_resolution_ref` | `Optional<ManualResolutionRef>` | 显式决定关联 |
| `detected_at` | `ObservedAt` | 本地检测时间 |

#### 11.1.3 状态集合

| 状态 | 含义 |
|---|---|
| `Open` | 已检测且阻断受影响路径 |
| `AwaitingDecision` | 需要用户/owner 显式决定 |
| `ResolutionRecorded` | 已记录意图，尚需重新验证/执行 |
| `Superseded` | 新检测取代旧冲突，旧记录保留 |
| `Closed` | 受影响路径已以已知安全结果收束；不删除历史 |

#### 11.1.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `await_decision` | `ManualDecisionKindSet allowed_decisions` | 明确可选人工方向，不代替决定 |
| `record_resolution` | `ManualResolutionRef manual_resolution_ref` | 关联显式意图，仍不自动执行 |
| `supersede` | `ConflictRecordRef replacement_conflict_ref` | 保留历史并指向新记录 |
| `close` | `ConflictCloseReason close_reason`、`LocalOperationResultRef result_ref` | 只在安全收束后关闭 |

#### 11.1.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `detect` | `ConflictRecordId conflict_id`、`SyncOperationRef operation_ref`、`SyncConflictKind conflict_kind`、`AffectedSyncRefSet affected_ref_set`、`ConflictBasisSummary basis_summary`、`Optional<RecoveryCheckpointRef> checkpoint_ref`、`ObservedAt detected_at` | 从 typed detection facts 创建记录 |

#### 11.1.6 禁止事项

- 禁止用自由错误字符串替代 kind/affected refs/basis/checkpoint。
- 禁止自动选 ours/theirs、merge/rebase/stash/overwrite 或删除记录。
- 禁止把“无 Git merge conflict”解释为无 Sync conflict 或 Review accepted。

### 11.2 `RecoveryCheckpoint`

#### 11.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP4；local state entity |
| 结构责任 | 固定可恢复阶段、输入指纹、已知完成步骤与下一安全动作 |
| capability 来源 | Step 5 CP4 capture checkpoint/evaluate resume |
| ownership | L5-sync local recovery truth；不等于远端 transaction commit |

#### 11.2.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `checkpoint_id` | `RecoveryCheckpointId` | 本地 checkpoint 标识 |
| `operation_ref` | `SyncOperationRef` | 所属 operation |
| `stage` | `RecoveryStage` | Selection/Binding/Plan/Apply/Finalize/HandoffCall/HandoffProbe |
| `state` | `RecoveryCheckpointState` | Captured/Resumable/Invalidated/ProbeRequired/Completed |
| `input_fingerprint_ref` | `RecoveryInputFingerprintRef` | binding/source/local/attempt inputs 摘要 |
| `completed_step_set` | `CompletedLocalStepSet` | 已知完成的安全 local steps |
| `next_action` | `RecoveryNextAction` | Revalidate/Replan/ResumeLocal/Probe/Manual/Stop |
| `related_attempt_ref` | `Optional<ExternalAttemptRef>` | handoff 等外部副作用关联 |
| `captured_at` | `ObservedAt` | 本地捕获时间 |

#### 11.2.3 状态集合

| 状态 | 含义 |
|---|---|
| `Captured` | 已保存中断点，尚未评估当前可恢复性 |
| `Resumable` | 只对已验证的 local-safe next action 可续行 |
| `Invalidated` | input/generation/access/observation 漂移，必须重建路径 |
| `ProbeRequired` | 存在可能外部副作用，必须先正式 probe |
| `Completed` | checkpoint 已由新已知结果收束，历史保留 |

#### 11.2.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `evaluate_resume` | `RecoveryCurrentContext current_context`、`RecoverySafetyPolicy safety_policy` | 决定 Resumable/Invalidated/ProbeRequired |
| `require_probe` | `ExternalAttemptRef related_attempt_ref` | 外部 unknown 时禁止 local replay |
| `invalidate` | `RecoveryInvalidationReason reason` | 记录漂移/合同缺口 |
| `complete` | `LocalOperationResultRef result_ref` | 用已知结果关闭 checkpoint |

#### 11.2.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `capture` | `RecoveryCheckpointId checkpoint_id`、`SyncOperationRef operation_ref`、`RecoveryStage stage`、`RecoveryInputFingerprintRef input_fingerprint_ref`、`CompletedLocalStepSet completed_step_set`、`RecoveryNextAction next_action`、`Optional<ExternalAttemptRef> related_attempt_ref`、`ObservedAt captured_at` | 在副作用前/阶段边界持久化恢复点 |

#### 11.2.6 禁止事项

- 禁止 checkpoint 自身证明文件、cursor、handoff 或 owner 状态已成功。
- 禁止输入 fingerprint 不匹配时原地续行。
- 禁止用进程重启、timeout 或 retry count 推断 external failure/success。

### 11.3 `ManualResolution`

#### 11.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP4；local intent/history entity |
| 结构责任 | 记录用户对特定冲突的明确决定、作用范围和后续所需重验证，不直接执行变更 |
| capability 来源 | Step 5 CP4 record manual resolution |
| ownership | 本地用户意图；不等于 owner/Governance Decision |

#### 11.3.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `resolution_id` | `ManualResolutionId` | 本地意图标识 |
| `conflict_ref` | `ConflictRecordRef` | 只能作用于明确冲突 |
| `actor_ref` | `ActorRef` | 明确作出决定的人/受控主体 |
| `decision_kind` | `ManualResolutionKind` | Abort/Replan/Rebind/KeepLocal/ApplySource/Probe/SeekOwner 等受限语义 |
| `scope` | `ManualResolutionScope` | 明确受影响 paths/refs，不全局默认 |
| `state` | `ManualResolutionState` | Recorded/Validated/Applied/Superseded/Rejected |
| `required_revalidation_set` | `RevalidationRequirementSet` | 执行前仍必须核验的门禁 |
| `recorded_at` | `ObservedAt` | 本地记录时间 |

#### 11.3.3 状态集合

| 状态 | 含义 |
|---|---|
| `Recorded` | 用户意图已记录，尚未证明可执行 |
| `Validated` | 当前门禁允许产生明确新 operation/plan |
| `Applied` | 相应本地动作以已知结果完成；不是外部 verdict |
| `Superseded` | 用户新决定替代旧意图，历史保留 |
| `Rejected` | 决定越界、失效或当前不安全，未执行 |

#### 11.3.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `validate` | `ConflictRecord conflict_record`、`RecoveryCurrentContext current_context`、`RecoverySafetyPolicy safety_policy` | 校验 scope/actor/current gates |
| `mark_applied` | `LocalOperationResultRef result_ref` | 关联已知本地结果 |
| `supersede` | `ManualResolutionRef replacement_resolution_ref` | 保留意图历史 |
| `reject` | `ManualResolutionRejectReason reason` | 拒绝自动/越界/陈旧意图 |

#### 11.3.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `record` | `ManualResolutionId resolution_id`、`ConflictRecordRef conflict_ref`、`ActorRef actor_ref`、`ManualResolutionKind decision_kind`、`ManualResolutionScope scope`、`RevalidationRequirementSet required_revalidation_set`、`ObservedAt recorded_at` | 创建显式本地意图 |

#### 11.3.6 禁止事项

- 禁止工具/后台 job 自动创建冒充用户决定。
- 禁止把 KeepLocal/ApplySource 直接实现为强制覆盖；仍需 plan、安全校验和新 operation。
- 禁止把本对象当 Review/owner 决策。

### 11.4 `ProbeRecord`

#### 11.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP4；local probe entity/history |
| 结构责任 | 记录针对已持久化外部 attempt 的正式只读 probe 请求、结果与语义置信边界 |
| capability 来源 | Step 5 CP4 prepare/probe unknown outcome |
| ownership | probe relation 属 Sync；被探测 side-effect/decision truth 属外部 owner |

#### 11.4.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `probe_id` | `ProbeRecordId` | 本地 probe 标识 |
| `attempt_ref` | `ExternalAttemptRef` | 唯一被探测 attempt |
| `probe_kind` | `RecoveryProbeKind` | HandoffReceipt/ExternalObject/DecisionRef 等正式能力类别 |
| `state` | `ProbeRecordState` | Prepared/InFlight/ResolvedKnown/StillUnknown/Unsupported/FailedKnown |
| `idempotency_context_ref` | `IdempotencyContextRef` | 与原 call 关联，不自行证明等价 |
| `safe_result_summary` | `Optional<SafeProbeResultSummary>` | body-free probe result |
| `external_result_ref` | `Optional<ExternalResultRef>` | 正式结果引用 |
| `observed_at` | `Optional<ObservedAt>` | 结果观察时间 |

#### 11.4.3 状态集合

| 状态 | 含义 |
|---|---|
| `Prepared` | probe intent 已持久化 |
| `InFlight` | probe 调用已发出，未得已知结果 |
| `ResolvedKnown` | owner 明确返回可解释结果/ref |
| `StillUnknown` | 仍不能判断原副作用 outcome |
| `Unsupported` | owner 无正式 probe capability |
| `FailedKnown` | probe 明确失败，但原 attempt 未必失败 |

#### 11.4.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `begin` | `ProbeInvocationRef invocation_ref` | 进入 InFlight |
| `resolve` | `SafeProbeResultSummary safe_result_summary`、`ExternalResultRef external_result_ref`、`ObservedAt observed_at` | 记录正式 known result |
| `remain_unknown` | `UnknownOutcomeReason reason` | 保持 unknown，不触发 blind retry |
| `mark_unsupported` | `UnsupportedCapabilityReason reason` | 进入 manual/blocked path |

#### 11.4.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `prepare` | `ProbeRecordId probe_id`、`ExternalAttemptRef attempt_ref`、`RecoveryProbeKind probe_kind`、`IdempotencyContextRef idempotency_context_ref` | 为明确 attempt 创建 probe intent |

#### 11.4.6 禁止事项

- 禁止无 prior attempt 进行“猜测性 probe”或查询任意外部对象。
- 禁止把 telemetry/log/HTTP timeout 当 formal probe result。
- 禁止 ResolvedKnown 自动解释为 Review accepted；由 CP5 policy 分层。

### 11.5 `RecoverySafetyPolicy`

#### 11.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP4；stateless domain policy |
| 结构责任 | 区分可重入 local-safe step、必须 replan/revalidate、external probe 和 manual-only 路径 |
| capability 来源 | Step 5 CP4 evaluate resume/probe/abandon |
| ownership | Sync recovery rule；不定义外部 idempotency guarantee |

#### 11.5.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `local_reentry_rule` | `LocalReentryRule` | 哪些已知 local steps 可重入 |
| `external_side_effect_rule` | `ExternalSideEffectRecoveryRule` | 有可能副作用时必须 probe/manual |
| `fingerprint_match_rule` | `RecoveryFingerprintMatchRule` | binding/source/local/attempt 等价要求 |
| `protected_history_rule` | `ProtectedRecoveryHistoryRule` | cancel/retry 不删 conflict/provenance |

#### 11.5.3 状态集合

无生命周期；输出 ResumeLocal/Revalidate/Replan/ProbeRequired/Manual/Stop。

#### 11.5.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `classify_next_action` | `RecoveryCheckpoint checkpoint`、`RecoveryCurrentContext current_context` | 计算安全下一动作 |
| `allows_local_reentry` | `RecoveryStage stage`、`CompletedLocalStepSet completed_steps` | 仅允许明示 local-safe 重入 |
| `requires_probe` | `Optional<ExternalAttemptRef> external_attempt_ref`、`ExternalOutcomeState outcome_state` | 防止 unknown 外部副作用重放 |
| `validate_manual_resolution` | `ManualResolution manual_resolution`、`ConflictRecord conflict_record` | 确认 scope 与 hard gates |

#### 11.5.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `strict` | `LocalReentryRule local_reentry_rule`、`ExternalSideEffectRecoveryRule external_side_effect_rule`、`RecoveryFingerprintMatchRule fingerprint_match_rule`、`ProtectedRecoveryHistoryRule protected_history_rule` | 构造 no-blind-replay policy |

#### 11.5.6 禁止事项

- 禁止 timeout、次数、process restart 或用户“再试一次”本身成为等价证明。
- 禁止绕过原 CP1/CP2/CP3/CP5 门禁直接 resume。
- 禁止配置允许 blind retry 或历史删除。

### 11.6 CP4 对象正式化停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 五个候选全部正式化；通用 AuditLog 未引入 |
| capability 来源 | conflict/checkpoint/manual/resume/probe/cancel/read 全覆盖 |
| error→object | 冲突、checkpoint、decision、probe 均非字符串/布尔替代 |
| ownership | local recovery 与 external transaction/decision 分离 |
| Step 8/9 反查 | resolve/resume/probe flows 及 conflict/checkpoint/probe states 齐全 |
| blocker | `SYNC-UP-004/005/010` 保持开放，精确 probe/idempotency/manual contract 未伪造 |

## 12. CP5 Review Handoff & Provenance 对象

### 12.1 `ReviewCandidate`

#### 12.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP5；local aggregate / frozen candidate |
| 结构责任 | 将 source/binding generation、local observation、path scope 和 digest 冻结为可交接候选 |
| capability 来源 | Step 5 CP5 inspect/freeze candidate |
| ownership | L5-sync local candidate truth；不等于 Artifact/Baseline/Review input accepted |

#### 12.1.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `candidate_id` | `ReviewCandidateId` | 本地 candidate 标识 |
| `operation_ref` | `SyncOperationRef` | push-review operation |
| `binding_ref` | `WorkingCopyBindingRef` | 所属 working copy |
| `binding_generation` | `MetadataGeneration` | freeze 世代 |
| `source_ref` | `MaterialSourceRef` | 回链来源语境 |
| `local_observation_ref` | `WorkingCopyObservationRef` | freeze 时 local observation |
| `candidate_digest_ref` | `CandidateDigestRef` | bounded content/path digest |
| `included_path_scope` | `CandidatePathScope` | 明确候选范围 |
| `state` | `ReviewCandidateState` | Inspecting/Eligible/Frozen/Invalidated/HandedOff |
| `eligibility_evaluation_ref` | `CandidateEligibilityEvaluationRef` | 回链 hard gates 结果 |

#### 12.1.3 状态集合

| 状态 | 含义 |
|---|---|
| `Inspecting` | 正在组合 access/binding/source/local/conflict facts |
| `Eligible` | 当前 facts 满足 freeze 条件，尚未冻结 |
| `Frozen` | digest/scope/generation/observation 固定，可 prepare attempt |
| `Invalidated` | dirty/drift/access/posture/generation/conflict 变化使候选失效 |
| `HandedOff` | 已关联至少一个正式 handoff attempt；不代表 accepted |

#### 12.1.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `evaluate_eligibility` | `CandidateEligibilityContext eligibility_context`、`CandidateEligibilityPolicy policy` | 形成 typed eligibility，不产生 verdict |
| `freeze` | `CandidateDigestRef candidate_digest_ref`、`CandidatePathScope included_path_scope`、`WorkingCopyObservationRef local_observation_ref` | 固定 candidate inputs |
| `validate_unchanged` | `WorkingCopyObservation current_observation`、`MetadataGeneration current_generation` | 检测 drift |
| `invalidate` | `CandidateInvalidationReason reason` | 失效旧 candidate，不修改 working copy |
| `attach_handoff` | `HandoffAttemptRef handoff_attempt_ref` | 关联 attempt，不推进 Governance decision |

#### 12.1.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `inspect` | `ReviewCandidateId candidate_id`、`SyncOperationRef operation_ref`、`WorkingCopyBindingRef binding_ref`、`MetadataGeneration binding_generation`、`MaterialSourceRef source_ref`、`CandidateEligibilityEvaluationRef eligibility_evaluation_ref` | 创建待冻结 candidate |

#### 12.1.6 禁止事项

- 禁止把 Git commit/tree、candidate digest 或 local clean 当 Artifact/Baseline。
- 禁止 candidate inputs 变化后复用 Frozen 状态。
- 禁止 candidate 自行创建 Gate、决定 accepted 或执行 Git push。

### 12.2 `HandoffAttempt`

#### 12.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP5；local aggregate / external-effect attempt |
| 结构责任 | 在 call 前持久化 candidate、Governance target、idempotency/correlation，并分层记录 transport/probe/external refs |
| capability 来源 | Step 5 CP5 prepare/call/probe/read |
| ownership | attempt/transport association 属 Sync；Gate/Decision truth 属 Governance |

#### 12.2.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `attempt_id` | `HandoffAttemptId` | 本地 attempt 标识 |
| `candidate_ref` | `ReviewCandidateRef` | 唯一 frozen candidate |
| `governance_target_ref` | `GovernanceHandoffTargetRef` | 正式 owner target/capability ref |
| `idempotency_context_ref` | `IdempotencyContextRef` | 与 owner contract 对齐的关联；不自行保证等价 |
| `state` | `HandoffAttemptState` | Prepared/Calling/TransportKnown/OutcomeUnknown/ProbeRequired/ExternalPending/TerminalKnown |
| `transport_outcome` | `Optional<TransportOutcome>` | ACK/known failure/timeout 分层记录 |
| `external_handoff_ref` | `Optional<ExternalHandoffRef>` | owner 返回的 safe ref |
| `probe_record_ref` | `Optional<ProbeRecordRef>` | unknown probe 关联 |
| `decision_snapshot_ref` | `Optional<ExternalOwnerSnapshotRef>` | Governance decision 的只读 snapshot |
| `prepared_at` | `ObservedAt` | call 前持久化时间 |

#### 12.2.3 状态集合

| 状态 | 含义 |
|---|---|
| `Prepared` | attempt 已持久化，尚未 call |
| `Calling` | 正式 handoff 调用已发出 |
| `TransportKnown` | transport 成败/ACK 已知，但不代表 Decision |
| `OutcomeUnknown` | 响应丢失/timeout，副作用结果未知 |
| `ProbeRequired` | 必须先正式 probe，禁止 blind retry |
| `ExternalPending` | 已有正式 handoff/Gate ref，Decision 仍由外部处理 |
| `TerminalKnown` | 外部正式状态已知并被安全引用；终局语义仍来自 owner |

#### 12.2.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `begin_call` | `HandoffInvocationRef invocation_ref` | 从 durable Prepared 进入 Calling |
| `record_transport` | `TransportOutcome transport_outcome`、`Optional<ExternalHandoffRef> external_handoff_ref` | 记录 transport，不升级 decision |
| `mark_outcome_unknown` | `UnknownOutcomeReason reason`、`RecoveryCheckpointRef checkpoint_ref` | 要求 probe/manual |
| `require_probe` | `ProbeRecordRef probe_record_ref` | 关联正式 probe |
| `attach_decision_snapshot` | `ExternalOwnerSnapshotRef decision_snapshot_ref` | 只读关联外部 decision |
| `finalize_known_external_state` | `ExternalHandoffStateRef external_state_ref` | 记录已知外部状态，不本地产生 verdict |

#### 12.2.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `prepare` | `HandoffAttemptId attempt_id`、`ReviewCandidateRef candidate_ref`、`GovernanceHandoffTargetRef governance_target_ref`、`IdempotencyContextRef idempotency_context_ref`、`ObservedAt prepared_at` | call 前创建 durable attempt |

#### 12.2.6 禁止事项

- 禁止 ACK/HTTP 200/remote object/transport success 设置 accepted/approved。
- 禁止 OutcomeUnknown 后直接创建新 attempt 重放同一副作用，除非正式合同证明等价。
- 禁止保存 raw request/response、credential、evidence/report body。

### 12.3 `ProvenanceRecord`

#### 12.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP5；local protected history/entity |
| 结构责任 | 以 body-free refs 回链 selection/source/binding/tool/operation/materialization/conflict/recovery/candidate/handoff 关系 |
| capability 来源 | Step 5 CP5 append provenance；所有部分提供 facts |
| ownership | 本地 provenance relation；不是 formal audit/evidence/report |

#### 12.3.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `provenance_id` | `ProvenanceRecordId` | 本地记录标识 |
| `relation_kind` | `ProvenanceRelationKind` | Bind/Materialize/Conflict/Recovery/Candidate/Handoff/Migration/Rebind |
| `subject_ref` | `LocalProvenanceSubjectRef` | 被关联的 local object |
| `source_ref_set` | `ProvenanceSourceRefSet` | owner/source/operation/tool/path refs |
| `parent_provenance_refs` | `ProvenanceRecordRefSet` | 形成不可伪造关系链 |
| `integrity_digest_ref` | `ProvenanceDigestRef` | bounded relation digest |
| `state` | `ProvenanceRecordState` | Active/Superseded/Protected/IntegrityUnknown |
| `recorded_at` | `ObservedAt` | 本地记录时间 |
| `redaction_marker` | `RedactionMarker` | 证明输出已按本地 policy 裁剪，不等于 formal evidence |

#### 12.3.3 状态集合

| 状态 | 含义 |
|---|---|
| `Active` | 当前 local relation 的有效锚点 |
| `Superseded` | 新 generation/relation 取代但旧记录保留 |
| `Protected` | 被 active binding/conflict/recovery/handoff 引用，禁止清理 |
| `IntegrityUnknown` | 链或 digest 无法验证，必须显式暴露缺口 |

#### 12.3.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `link_parent` | `ProvenanceRecordRef parent_provenance_ref` | 延续来源链，不覆写父记录 |
| `protect` | `ProvenanceProtectionReason reason` | 防止清理/迁移删除 |
| `supersede` | `ProvenanceRecordRef replacement_provenance_ref` | 保留历史并指向新 relation |
| `verify_integrity` | `ProvenanceProtectionRule protection_rule` | 验证 relation closure/digest |
| `mark_integrity_unknown` | `ProvenanceIntegrityGapReason reason` | 暴露缺口，不补造 refs |

#### 12.3.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `record_relation` | `ProvenanceRecordId provenance_id`、`ProvenanceRelationKind relation_kind`、`LocalProvenanceSubjectRef subject_ref`、`ProvenanceSourceRefSet source_ref_set`、`ProvenanceRecordRefSet parent_provenance_refs`、`ProvenanceDigestRef integrity_digest_ref`、`RedactionMarker redaction_marker`、`ObservedAt recorded_at` | 创建 body-free relation |

#### 12.3.6 禁止事项

- 禁止删除、伪造、回填不存在的 parent/source refs 或静默重绑。
- 禁止保存 owner/file/evidence/report 正文、credential 或 raw output。
- 禁止用 provenance record 冒充正式 evidence、audit verdict、signoff 或 readiness。

### 12.4 `CandidateEligibilityPolicy`

#### 12.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP5；stateless domain policy |
| 结构责任 | 联合 current access/posture、binding generation、source/cursor、local observation、conflict/recovery 判断 candidate 能否冻结/交接 |
| capability 来源 | Step 5 CP5 inspect/freeze |
| ownership | Sync local guard；不定义 Governance acceptance policy |

#### 12.4.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `required_candidate_check_set` | `CandidateCheckRequirementSet` | freeze/handoff 前必需 checks |
| `drift_rule` | `CandidateDriftRule` | generation/content/path/source/access 变化失效 |
| `conflict_clearance_rule` | `ConflictClearanceRule` | 哪些 open/unknown 状态绝对阻断 |

#### 12.4.3 状态集合

无生命周期；输出 Eligible/Blocked/NeedsAction/Unknown/Invalidated。

#### 12.4.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `evaluate` | `CandidateEligibilityContext eligibility_context` | 组合本地/owner typed facts |
| `validate_frozen_candidate` | `ReviewCandidate candidate`、`CandidateEligibilityContext current_context` | handoff 前检测 drift |
| `requires_new_candidate` | `ReviewCandidate candidate`、`CandidateInvalidationFactSet invalidation_facts` | 禁止复用旧 freeze |

#### 12.4.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `strict` | `CandidateCheckRequirementSet required_candidate_check_set`、`CandidateDriftRule drift_rule`、`ConflictClearanceRule conflict_clearance_rule` | 构造不可绕 Gate 的本地 guard |

#### 12.4.6 禁止事项

- 禁止以 clean Git tree、commit 存在、transport availability 替代 access/source/conflict checks。
- 禁止 archived/revoked/unknown/dirty/drift 时返回 Eligible。
- 禁止在 policy 内创建 Gate 或决定 Review outcome。

### 12.5 `HandoffResultPolicy`

#### 12.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP5；stateless domain policy |
| 结构责任 | 将 local candidate、attempt、transport、probe 和 external decision snapshot 组装为不升格语义的 layered result |
| capability 来源 | Step 5 CP5 call/probe/read/assemble status |
| ownership | 本地解释规则；Governance 仍定义外部状态含义 |

#### 12.5.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `result_layer_rule` | `HandoffResultLayerRule` | 固定 Local/Transport/Probe/ExternalDecision 层 |
| `elevation_prohibition_rule` | `ResultElevationProhibitionRule` | 禁止 ACK/HTTP/log/cache→accepted |
| `unknown_handling_rule` | `UnknownOutcomeHandlingRule` | unknown→probe/manual，不 blind retry |

#### 12.5.3 状态集合

无生命周期；输出各层 typed state，不输出泛化单一 success。

#### 12.5.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `assemble` | `ReviewCandidate candidate`、`Optional<HandoffAttempt> attempt`、`Optional<ProbeRecord> probe_record`、`Optional<ExternalOwnerSnapshot> decision_snapshot` | 生成 layered status |
| `classify_transport` | `TransportOutcome transport_outcome` | 保留 ACK/known failure/unknown 层 |
| `classify_external_decision` | `ExternalOwnerSnapshot decision_snapshot` | 只转述 owner state/ref，不本地推导 |
| `requires_probe` | `HandoffAttempt attempt` | unknown 时明确恢复姿态 |

#### 12.5.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `strict` | `HandoffResultLayerRule result_layer_rule`、`ResultElevationProhibitionRule elevation_prohibition_rule`、`UnknownOutcomeHandlingRule unknown_handling_rule` | 构造结果分层 policy |

#### 12.5.6 禁止事项

- 禁止提供单一 `success=true` 覆盖所有层。
- 禁止从 ACK、HTTP 200、remote object、Git commit、日志或 telemetry 推断 decision。
- 禁止配置关闭 unknown/probe 分层。

### 12.6 `LayeredHandoffStatus`

#### 12.6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP5；immutable projection/view object |
| 结构责任 | 分层展示 candidate、attempt/transport、probe 和 Governance decision snapshot，不产生状态变化 |
| capability 来源 | Step 5 CP5 assemble layered status |
| ownership | 派生 view；不是 truth 或 verdict |

#### 12.6.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `candidate_state` | `ReviewCandidateStateView` | local freeze/invalidated/handoff relation |
| `attempt_state` | `Optional<HandoffAttemptStateView>` | local attempt layer |
| `transport_state` | `Optional<TransportOutcomeView>` | transport layer |
| `probe_state` | `Optional<ProbeRecordStateView>` | unknown/probe layer |
| `external_decision_state` | `Optional<ExternalDecisionStateView>` | owner snapshot layer |
| `blocker_set` | `HandoffBlockerSet` | missing contract/dirty/drift/posture 等 |
| `next_action_set` | `SafeNextActionSet` | Probe/Recheck/Reprepare/WaitOwner/Manual |
| `freshness_summary` | `FreshnessSummary` | 各 ref/snapshot 新鲜度，不隐藏 stale |

#### 12.6.3 状态集合

无独立状态机；字段分别来自 CP5 truth/CP4 probe/owner snapshot，禁止合成泛化 success。

#### 12.6.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `is_local_candidate_frozen` | 无 | 只回答 local layer |
| `requires_probe` | 无 | 根据 attempt/probe 层返回 |
| `external_decision_known` | 无 | 只检查正式 snapshot 存在且 fresh |
| `safe_summary` | `RedactionPolicyRef redaction_policy_ref` | 生成 body-free 输出 |

#### 12.6.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `assemble` | `ReviewCandidate candidate`、`Optional<HandoffAttempt> attempt`、`Optional<ProbeRecord> probe_record`、`Optional<ExternalOwnerSnapshot> decision_snapshot`、`HandoffResultPolicy result_policy` | 从已读 facts 构造 no-write view |

#### 12.6.6 禁止事项

- 禁止 view construction 触发 owner refresh、probe、metadata write 或 decision change。
- 禁止隐藏 stale/unknown/unsupported/blocker。
- 禁止将 transport/local 状态显示为 accepted/approved。

### 12.7 `SyncStatusView`

#### 12.7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属 / 类型 | CP5 read/status surface；immutable composite view |
| 结构责任 | 只读聚合 CP1~CP5 的 selection/access、binding/metadata、source/cursor、Git/fs、conflict/recovery、handoff/provenance slices |
| capability 来源 | Step 5 总 capability“status”及每部分 read slice |
| ownership | 派生 view；不成为第六 truth 部分 |

#### 12.7.2 关键字段骨架

| 字段 | 类型 | 作用 / 来源 |
|---|---|---|
| `selection_summary` | `SelectionSummaryView` | explicit refs 的安全摘要 |
| `access_summary` | `AccessEvaluationView` | current persisted evaluation/freshness |
| `binding_summary` | `WorkingCopyBindingView` | binding/generation/manifest integrity |
| `cursor_summary` | `CursorStateView` | source observed/local applied/continuity |
| `working_copy_summary` | `WorkingCopyObservationView` | Git/fs/path/tool axes |
| `materialization_summary` | `MaterializationStatusView` | plan/run/result layer |
| `conflict_recovery_summary` | `ConflictRecoveryStatusView` | open conflict/checkpoint/manual/probe |
| `handoff_summary` | `LayeredHandoffStatus` | local/transport/probe/decision layers |
| `provenance_summary` | `ProvenanceSummaryView` | integrity/refs，不含正文 |
| `degraded_reason_set` | `StatusDegradedReasonSet` | stale/unknown/unsupported/blocked 显式集合 |

#### 12.7.3 状态集合

无独立状态机；各 slice 保留原状态轴。顶层只允许 `CompleteRead`、`PartialRead`、`BlockedRead`、`UnavailableRead` 等读取完整性姿态，绝不表示同步成功。

#### 12.7.4 成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|
| `read_completeness` | 无 | 返回 view 读取完整性而非业务 success |
| `safe_next_actions` | 无 | 聚合显式 recheck/replan/probe/manual/wait actions |
| `redacted` | `RedactionPolicyRef redaction_policy_ref` | 生成受控 CLI/SDK output |
| `contains_blocker` | `SyncBlockerKind blocker_kind` | 只读检查 typed blocker |

#### 12.7.5 工厂函数骨架

| 工厂 | 参数 | 作用 |
|---|---|---|
| `assemble_from_persisted_slices` | `SelectionSummaryView selection_summary`、`AccessEvaluationView access_summary`、`WorkingCopyBindingView binding_summary`、`CursorStateView cursor_summary`、`WorkingCopyObservationView working_copy_summary`、`MaterializationStatusView materialization_summary`、`ConflictRecoveryStatusView conflict_recovery_summary`、`LayeredHandoffStatus handoff_summary`、`ProvenanceSummaryView provenance_summary`、`StatusDegradedReasonSet degraded_reason_set` | 无副作用组合 view |

#### 12.7.6 禁止事项

- 禁止 status assembly 触发 refresh、repair、migration、cursor advance、probe、handoff 或任何写入。
- 禁止把缺失/unknown slice 当空/clean/success。
- 禁止输出 credential、raw body/output、隐藏对象存在性或 formal evidence/report 正文。

### 12.8 CP5 对象正式化停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 七个候选全部正式化；Gate/Decision/diagnostic refs 保持字段类型/snapshot |
| capability 来源 | candidate/freeze/attempt/call/probe/read/status/provenance 全覆盖 |
| 结果分层 | candidate、attempt、transport、probe、decision/view 均分离 |
| ownership | local candidate/attempt/provenance 与 Governance/Artifact truth 分离 |
| Step 8/9 反查 | push-review/probe/status flows 与 candidate/attempt states 齐全 |
| blocker | `SYNC-UP-004/005` 保持开放，真实 handoff/probe/idempotency 未伪造 |

## 13. 跨对象 / 跨组成部分一致性审计

### 13.1 Step 8 / Step 9 反查清单

| 未来处理流 / 状态主题 | 已定义对象主语 | 结论 |
|---|---|---|
| explicit select/access/revalidate | `SyncOperation`、`SyncSelection`、`AccessEvaluation`、`ExternalOwnerSnapshot` | covered |
| clone/bind/metadata init | `WorkingCopyBinding`、`MetadataManifest`、`WorkingCopyObservation` | covered |
| pull/full/incremental plan/apply/finalize | `CursorState`、`MappingSet`、`MaterializationPlan`、`SourceDelta`、`PathChangeSet`、`MaterializationRun` | covered |
| conflict/manual decision/resume | `ConflictRecord`、`RecoveryCheckpoint`、`ManualResolution` | covered |
| unknown probe | `RecoveryCheckpoint`、`ProbeRecord`、`HandoffAttempt` | covered |
| push-review | `ReviewCandidate`、`HandoffAttempt`、`ProvenanceRecord` | covered |
| status | `SyncStatusView`、`LayeredHandoffStatus` + 各 truth/view source | covered / no-write |
| invalidation propagation | `ExternalOwnerSnapshot`、`AccessEvaluation`、`WorkingCopyBinding`、`MaterializationPlan`、`ReviewCandidate` | covered |

### 13.2 跨对象语义审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| identity / ownership | pass | 每个对象有唯一 CP；shared refs/views 不成为新 truth owner |
| `state` 混轴 | pass | operation/binding/metadata/cursor/worktree/plan/run/conflict/checkpoint/probe/candidate/attempt/provenance 分轴 |
| source/local/Git | pass | SourceDelta/CursorState/WorkingCopyObservation 明确分离 |
| plan/outcome | pass | MaterializationPlan/PathChangeSet 与 MaterializationRun 分离 |
| conflict/error | pass | ConflictRecord 是 typed local fact，不被 error string 取代 |
| intent/execution | pass | ManualResolution 是意图，需新 plan/operation 执行 |
| ACK/Decision | pass | HandoffAttempt 与 external decision snapshot / LayeredHandoffStatus 分离 |
| query no-write | pass | 两个 view 无 mutation；工厂只接受已读 slices |
| provenance/evidence | pass | ProvenanceRecord 只存 refs/digest/redaction marker，不是 formal evidence |
| forbidden body | pass | 所有对象禁止 raw bodies/secrets/output；safe summaries 有界 |
| blocker | pass_with_upstream_blockers | 未闭合合同只出现在 refs/results/states，不被虚构 schema 填补 |

### 13.3 对象数量与详细设计上限

29 个对象是概要层稳定主语集合，不等于 29 个 struct/table/file。03 可以在不改变 ownership、identity、state axes、fields semantics 和 behaviors 的前提下，将纯 value/policy/view 映射到语言类型或模块；若要合并/拆分导致主语或状态迁移改变，必须回退本 Step。所有字段二级类型、optional/set 具体表达、repository mapping、serialization 和 error type 留给 03/04。

## 14. 回填草稿

正式 §6 将保留 §7 的筛选说明，并按 CP1~CP5 为 29 个对象逐节摘录六段骨架；为避免正文误解，章节开头明确这是 planned typed skeleton，不是实现/物理 schema。正式正文同时保留 §13 反查与跨对象审计摘要。

延伸阅读入口指向本文件的“候选池筛选与分布”、各 CP“对象正式化停审”以及“Step 8 / Step 9 反查清单”。

## 15. 待确认事项

- `SYNC-UP-001~010` 继续开放，阻断字段二级类型、SDK/source/probe DTO、metadata 物理 schema 和 Git/path 精确行为定稿。
- `ExternalOwnerSnapshot` 的 owner-specific safe summary、`SourceDelta` 的 comparator/proof、`HandoffAttempt` 的 idempotency/external refs 必须在 owner 合同闭合后回流重审。

## 16. 进入下一步条件

- [x] Step 5 候选池逐项处理，无静默遗漏或服务/port 假冒对象。
- [x] 29 个正式对象均独立成节，包含基本信息、typed fields、状态、成员函数、工厂函数和禁止事项。
- [x] 所有函数参数使用 `TypeName param_name`；无完整签名、返回类型或实现体。
- [x] 五个组成部分分别停审，跨对象审计无 unresolved identity/state/ownership 冲突。
- [x] Step 8/9 预计使用的关键对象均已定义；query no-write、ACK/Decision、provenance/evidence 边界明确。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 7。此结论仅为文档静态自检。
