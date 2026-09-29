# Step 6. 关键对象轮廓

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 6。

- [x] 读取项目 ledger、02 flow、Step 4~5、正式 01 §6/§9/§10。
- [x] 回答对象正式化、类型、字段、行为、状态与排除边界问题。
- [x] 按 CP1→CP6 从候选池逐项展开并停审。
- [x] 反查 Step 8 处理流与 Step 9 状态机预期主语。
- [x] 完成跨对象、跨组成部分和历史污染审计。

## 2. 本步输入与问题回答

输入为 Step 5 的 26 个必展候选、六 CP capability、正式 01 的 Archive-owned 数据和多轴一致性语义。问题回答如下：

1. 进入本步的是具有本地身份、状态、不变量、不可变历史或正式 reference 责任的对象；外部 contract DTO、port、repository、service 和 provider 原始响应不进入。
2. 每个对象只拥有 Archive 范围内的 request/job、binding/capture、bundle/manifest、assessment、placement/execution 或 restore/handoff truth；所有外部业务事实只保存 typed ref 与适用语境。
3. 字段只给概要类型槽位；不定义序列化、数据库列、完整 Rust 签名、算法、密钥、provider schema 或 owner schema。
4. 状态轴必须分开：job、capture、closure、integrity、compatibility、placement、retrieval、lifecycle action、restore item、handoff 与 compensation 不互相推导。
5. Step 8/9 预计使用的所有正式状态主语均来自本步；辅助上下文、结果 DTO 和 enum 留为字段/接口类型，并在 §10 登记。

## 3. 当前文档诊断与取舍

旧 02 的 `ArchivedSnapshot`、`ArchiveIndex`、`RetentionClass`、`LegalHold`、单一 Restore/Replay 结果把外部 truth、查询表面、治理 policy 与执行状态混为对象。当前不继承这些主语：snapshot 由 source binding/material ref 表达；index 降为只读组合；治理只保存 `GovernanceDecisionRef`；恢复按 request/plan/item/handoff/outcome/compensation 分层。

对象数量选择 26：继续压缩会把独立状态轴藏进万能对象；继续扩张则会把 port、DTO、字段值或实现 helper 误作领域主体。

## 4. 对象候选池筛选说明

| CP | 正式关键对象 | 仅字段 / 边界类型 | Step 7 或 03 承接 |
|---|---|---|---|
| CP1 | ArchiveRequest、DeclaredArchiveScope、ArchiveJob、ArchiveJobStageRecord | ActorRef、AuthorityRef、DecisionRef、IdempotencyKey、OperationRequestRef | ArchiveRequestService、ArchiveStorePort、command DTO |
| CP2 | ArchiveSourceBinding、CaptureAttempt、CaptureCoverage、SourceCaptureFinding | SourceAuthorityRef、SourceVersionRef、SnapshotFenceRef、ArchivedMaterialRef | SourceCaptureService、SourceExportPort、owner response DTO |
| CP3 | ArchiveBundle、BundleManifest、ManifestEntry、ManifestClosure、ClosureFinding | MaterialLocatorRef、ManifestRevisionId、EntryDigestRef | BundleAssemblyService、manifest store、serialization schema |
| CP4 | VerificationAssessment、CompatibilityAssessment、VerificationFinding | DigestRef、SignatureRef、KeyRef、SchemaVersionRef、CapabilityRef | BundleVerificationService、IntegrityCapabilityPort、provider response |
| CP5 | ArchivePlacement、GovernanceDecisionRef、LifecycleExecution、ExternalActionRecord | StorageLocationRef、StorageTierRef、ExternalCommitRef | Placement/Lifecycle services、storage/decision ports |
| CP6 | RestoreRequest、RestorePlan、RestoreItem、RestoreHandoff、HandoffOutcome、CompensationRecord | RestoreReceiverRef、RestoreMaterialRef、ReceiverCommitRef | RestoreService、RestoreReceiverPort、owner response DTO |

所有表中的 external ref 只证明“有一条可追溯关系”，不证明内容真实、授权有效、外部提交完成或对应合同 ready。

## 5. CP1 请求与作业协调

### 5.1 ArchiveRequest

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP1 请求与作业协调 |
| 对象类型 | domain aggregate |
| 主要责任 | 固定一次归档申请的声明、依据、幂等语境与受理结果。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `request_id` | `ArchiveRequestId` | 本地稳定身份。 |
| `scope` | `DeclaredArchiveScope` | 冻结申请方声明的目标与切片。 |
| `requested_by` | `ActorRef` | 可追溯主体引用，不复制 identity truth。 |
| `authority_ref` | `AuthorityRef` | 指向正式受理依据；不自行批准。 |
| `idempotency_key` | `IdempotencyKey` | 同一调用者命名空间内的去重键。 |
| `input_digest` | `SafeInputDigest` | 检出同键不同输入；不是 Bundle digest。 |
| `admission` | `RequestAdmissionState` | Accepted/Rejected/Blocked。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Accepted` | 本地受理，可创建或关联作业；不表示业务批准。 |
| `Rejected` | 明确不满足本地受理条件，终局且可读回。 |
| `Blocked` | 权限、owner 决定或必要合同无法证明，fail-closed。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches(SafeInputDigest input_digest)` | 判定幂等重放是否同输入。 |
| `operation_ref()` | 生成仅指向本地请求的引用。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `admit(ArchiveRequestId request_id, DeclaredArchiveScope scope, ActorRef actor, AuthorityRef authority_ref, IdempotencyKey idempotency_key, SafeInputDigest input_digest)` | 在正式依据可证明时建立 Accepted 请求。 |
| `block(ArchiveRequestId request_id, DeclaredArchiveScope scope, RequestBlockBasis basis, IdempotencyKey idempotency_key, SafeInputDigest input_digest)` | 缺必要前提时建立可核对的阻塞结果。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不从项目状态或 governance material 自行推导批准。 | Archive 只消费正式决定。 |
| 不把幂等命中解释为归档完成。 | 命中只复用已存受理/结果。 |

### 5.2 DeclaredArchiveScope

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP1 请求与作业协调 |
| 对象类型 | value object / invariant |
| 主要责任 | 表达申请方声明的项目范围、切片选择和排除项，不替代各 source 的实际 coverage。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `project_ref` | `ProjectRef` | 指向 owning domain 的项目身份。 |
| `requested_slices` | `ArchiveSliceSelectorSet` | 声明希望纳入的 source/material 类别。 |
| `explicit_exclusions` | `ArchiveSliceExclusionSet` | 保留显式不纳入原因。 |
| `scope_version` | `ScopeDeclarationVersion` | 绑定本次请求的范围修订。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `requires(SourceClass source_class)` | 判断声明是否要求相应 source；不判断 source 是否存在。 |
| `validate_shape()` | 检查声明内部自洽，不执行业务授权。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `declare(ProjectRef project_ref, ArchiveSliceSelectorSet requested_slices, ArchiveSliceExclusionSet exclusions, ScopeDeclarationVersion version)` | 从受理输入构造不可变范围。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不固定 identity/conversation/work/process/governance/artifact/workspace/observability 全部必选。 | 是否需要由正式请求与 owner 合同共同决定。 |
| 不把 workspace projection 当 canonical slice。 | 它只能是明确标注的辅助来源。 |

### 5.3 ArchiveJob

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP1 请求与作业协调 |
| 对象类型 | domain aggregate |
| 主要责任 | 协调一次 archive 或 restore 作业的本地阶段和聚合姿态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `job_id` | `ArchiveJobId` | 本地作业身份。 |
| `request_ref` | `OperationRequestRef` | 指向 ArchiveRequest 或 RestoreRequest。 |
| `job_kind` | `ArchiveJobKind` | Archive/Restore；不混合两条执行链。 |
| `current_stage` | `ArchiveJobStage` | 当前协调阶段。 |
| `aggregate_posture` | `JobAggregatePosture` | Running/Partial/Blocked/Failed/Completed；仅本仓口径。 |
| `job_version` | `ArchiveJobVersion` | 乐观并发与 worker fencing。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Queued` | 已提交本地作业，尚未开始。 |
| `Running` | 至少一个受控阶段正在推进。 |
| `Partial` | 局部结果已保存但声明闭环未完成。 |
| `Blocked` | 缺正式前提，保持可恢复检查点。 |
| `Failed` | 当前 attempt 失败；是否新建重试由显式操作决定。 |
| `Completed` | Archive-owned 终点均提交；不代表项目 archived/restored。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `advance(ArchiveJobStage next_stage, ArchiveJobVersion expected_version, StageBasis basis)` | 按允许顺序推进并追加阶段记录。 |
| `recompute(JobComponentPostureSet component_postures)` | 从各 CP 已持久化结果形成保守聚合姿态。 |
| `block(JobBlockBasis basis, ArchiveJobVersion expected_version)` | 保存阻塞依据，不丢弃局部成功。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `queue(ArchiveJobId job_id, OperationRequestRef request_ref, ArchiveJobKind kind)` | 为已受理请求建立唯一作业语境。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不以单一布尔 success 覆盖多轴结果。 | partial/unknown/blocked 必须可见。 |
| 不用 Completed 设置 owner 的 archived/restored 状态。 | 业务状态归 owning domain。 |

### 5.4 ArchiveJobStageRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP1 请求与作业协调 |
| 对象类型 | immutable history record |
| 主要责任 | 记录作业阶段迁移的前后状态、原因与关联事实。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `JobStageRecordId` | 历史记录身份。 |
| `job_id` | `ArchiveJobId` | 所属作业。 |
| `from_stage` | `OptionalArchiveJobStage` | 初始记录可为空。 |
| `to_stage` | `ArchiveJobStage` | 已提交的新阶段。 |
| `basis` | `StageBasis` | 关联本地结果或外部 ref。 |
| `recorded_at` | `RecordedAt` | 本地记录时间，不冒充外部发生时间。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `append(JobStageRecordId record_id, ArchiveJobId job_id, OptionalArchiveJobStage from_stage, ArchiveJobStage to_stage, StageBasis basis, RecordedAt recorded_at)` | 与阶段迁移同一局部事务追加不可变记录。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不原地修改或删除历史。 | current stage 不能覆盖迁移依据。 |

#### CP1 对象正式化停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 4/4 正式展开；service/port/DTO 已排除。 |
| capability 来源 | admission、幂等、stage coordination 均可反查 Step 5。 |
| 边界 | 受理与作业完成均未升格为业务批准或状态。 |

## 6. CP2 来源绑定与采集

### 6.1 ArchiveSourceBinding

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP2 来源绑定与采集 |
| 对象类型 | entity |
| 主要责任 | 固定某请求所需 source 的 authority、切片类别和期望采集语境。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `binding_id` | `SourceBindingId` | 本地绑定身份。 |
| `request_ref` | `ArchiveRequestRef` | 所属归档请求。 |
| `source_class` | `SourceClass` | canonical owner、workspace auxiliary 或 observability material 分类。 |
| `authority_ref` | `SourceAuthorityRef` | 指向 source-authority matrix 中的 owner。 |
| `slice_selector` | `OwnerSliceSelector` | 本地需要的范围槽位；exact schema 待 owner。 |
| `requiredness` | `SourceRequiredness` | Required/Conditional/Auxiliary。 |
| `binding_state` | `SourceBindingState` | Planned/Bound/Blocked/Retired。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Planned` | 从声明扩展，尚未证明正式接缝。 |
| `Bound` | authority 与所需合同语境可解析。 |
| `Blocked` | authority/合同/授权缺失或冲突。 |
| `Retired` | 被新 request/manifest revision 明确取代。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `bind(SourceAuthorityRef authority_ref, SourceContractRef contract_ref)` | 记录经核验的 source 接缝引用。 |
| `block(SourceBindingBlockBasis basis)` | fail-closed 并保留缺口。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `plan(SourceBindingId binding_id, ArchiveRequestRef request_ref, SourceClass source_class, OwnerSliceSelector selector, SourceRequiredness requiredness)` | 由冻结范围与 source-authority matrix 建立计划项。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不把 source_class 映射为 sibling package dependency。 | 实际关系为 runtime/ref/event/adapter。 |
| 不用 workspace/observability 弥补 canonical owner 缺口。 | auxiliary material 必须保留类别。 |

### 6.2 CaptureAttempt

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP2 来源绑定与采集 |
| 对象类型 | history entity |
| 主要责任 | 记录一次绑定到确定 source/fence 的采集尝试及其局部结果。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `attempt_id` | `CaptureAttemptId` | 单次尝试身份。 |
| `binding_id` | `SourceBindingId` | 固定 source 绑定。 |
| `requested_fence` | `OptionalSnapshotFenceRef` | 请求的 owner fence；缺失可导致阻塞。 |
| `observed_version` | `OptionalSourceVersionRef` | owner 返回的版本引用。 |
| `material_refs` | `ArchivedMaterialRefSet` | owner-approved material/ref，不转移 truth。 |
| `coverage` | `CaptureCoverage` | 对本次输入的覆盖结论。 |
| `attempt_state` | `CaptureAttemptState` | Requested/InProgress/Settled/Blocked/Failed/Superseded。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Requested` | 本地已记录采集意图。 |
| `InProgress` | 正在调用/等待正式 source。 |
| `Settled` | 结果已持久化；coverage 可非 Complete。 |
| `Blocked` | 缺授权、fence、合同或安全材料。 |
| `Failed` | 当前尝试失败且无可采信结果。 |
| `Superseded` | 被新显式尝试取代。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `settle(ArchivedMaterialRefSet materials, SourceVersionRef version, CaptureCoverage coverage)` | 原子记录材料引用、版本和 coverage。 |
| `block(CaptureBlockBasis basis)` | 保存 blocker/finding，不猜测空集合。 |
| `supersede(CaptureAttemptId replacement_attempt_id)` | 阻止旧 worker 后续写入。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `start(CaptureAttemptId attempt_id, SourceBindingId binding_id, OptionalSnapshotFenceRef requested_fence)` | 对 Bound source 创建显式尝试。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| timeout 不等于 missing 或 empty。 | 未知结果保持 Blocked/Failed 与 finding。 |
| 不把事件缓存当 owner snapshot。 | event 只能提示重取或推进。 |

### 6.3 CaptureCoverage

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP2 来源绑定与采集 |
| 对象类型 | value object / assessment |
| 主要责任 | 表达某次 source 采集相对声明范围与 owner 证明的覆盖姿态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `posture` | `CaptureCoveragePosture` | Complete/Partial/Missing/Stale/Conflicting/Unknown。 |
| `declared_scope_ref` | `DeclaredScopeRef` | 绑定比较基准。 |
| `owner_coverage_ref` | `OptionalOwnerCoverageRef` | owner 正式 coverage 证明引用。 |
| `finding_refs` | `SourceCaptureFindingRefSet` | 解释非 Complete 结论。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Complete` | owner 证明覆盖声明范围。 |
| `Partial` | 只有已知子集。 |
| `Missing` | owner 明确证明所需材料不存在/未提供；不是 timeout。 |
| `Stale` | 材料版本不满足 fence。 |
| `Conflicting` | authority/version/coverage 证明相互冲突。 |
| `Unknown` | 无足够证明。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `assess(DeclaredScopeRef declared_scope_ref, OwnerCoverageEvidence evidence, SourceCaptureFindingRefSet findings)` | 只从正式 owner 证明形成结论。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不跨 owner 比较版本大小。 | 每个 source version/fence 独立。 |
| 不由材料数量推导 Complete。 | 必须有 coverage 语义。 |

### 6.4 SourceCaptureFinding

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP2 来源绑定与采集 |
| 对象类型 | immutable audit/history record |
| 主要责任 | 记录 source 采集中的缺失、过期、冲突、裁剪或未知事实。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `finding_id` | `SourceCaptureFindingId` | 本地 finding 身份。 |
| `attempt_id` | `CaptureAttemptId` | 绑定确定尝试。 |
| `kind` | `SourceCaptureFindingKind` | Partial/Missing/Stale/Conflicting/Redacted/Unknown。 |
| `subject_ref` | `SafeSourceSubjectRef` | 不泄露未授权正文的安全定位。 |
| `basis_ref` | `OptionalExternalEvidenceRef` | 可核对依据引用。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record(SourceCaptureFindingId finding_id, CaptureAttemptId attempt_id, SourceCaptureFindingKind kind, SafeSourceSubjectRef subject_ref, OptionalExternalEvidenceRef basis_ref)` | 记录已观察且允许保存的事实。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存 secret、原始 provider 响应或未授权正文。 | finding 也受最小披露边界。 |

#### CP2 对象正式化停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 4/4 正式展开；authority/material/fence 为 typed ref。 |
| capability 来源 | source plan、capture、coverage/reconcile 均有对象承接。 |
| 边界 | canonical/auxiliary 分类保持；AR-UP-001/006~008 继续阻塞正向合同。 |

## 7. CP3 Bundle 清单与闭包

### 7.1 ArchiveBundle

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP3 Bundle 清单与闭包 |
| 对象类型 | domain aggregate |
| 主要责任 | 拥有 Archive Bundle 身份、当前 manifest revision 和本仓封存姿态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `bundle_id` | `ArchiveBundleId` | Bundle 稳定身份。 |
| `archive_request_ref` | `ArchiveRequestRef` | 追溯归档声明。 |
| `current_manifest_ref` | `OptionalBundleManifestRef` | 当前固定 revision。 |
| `bundle_state` | `ArchiveBundleState` | Draft/Assembling/ClosureReady/Sealed/Blocked/Failed。 |
| `bundle_version` | `ArchiveBundleVersion` | 并发与 revision 切换语境。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Draft` | 已建立身份，尚未绑定 manifest。 |
| `Assembling` | 正在形成固定 manifest revision。 |
| `ClosureReady` | closure 为 Complete，仍需规定的 verification/placement 前提。 |
| `Sealed` | Archive-owned 封存前置满足；不代表业务归档状态。 |
| `Blocked` | 必要 source/verification/storage 前提不能证明。 |
| `Failed` | 当前组装/封存 attempt 失败。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `attach_manifest(BundleManifestRef manifest_ref, ArchiveBundleVersion expected_version)` | 绑定新的不可变 revision。 |
| `mark_closure_ready(ManifestClosure closure)` | 仅 Complete closure 可推进。 |
| `seal(BundleSealBasis seal_basis, ArchiveBundleVersion expected_version)` | 核对固定 manifest、完整性和 placement 前置后封存。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `draft(ArchiveBundleId bundle_id, ArchiveRequestRef request_ref)` | 为 Accepted archive request 建立 Bundle。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| Sealed 不等于项目 archived 或恢复可成功。 | 只描述 Archive-owned 包姿态。 |
| 不把 storage object 当 Bundle identity。 | provider/location 可变，Bundle 身份稳定。 |

### 7.2 BundleManifest

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP3 Bundle 清单与闭包 |
| 对象类型 | immutable entity / revision |
| 主要责任 | 固定某一 revision 的声明条目、实际条目和来源绑定关系。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `manifest_id` | `BundleManifestId` | manifest 身份。 |
| `bundle_id` | `ArchiveBundleId` | 所属 Bundle。 |
| `revision` | `ManifestRevisionId` | 不可变 revision。 |
| `declared_entries` | `ManifestEntrySet` | 应存在的条目集合。 |
| `actual_entries` | `ManifestEntrySet` | 已绑定材料/ref 条目集合。 |
| `closure` | `ManifestClosure` | 对该 revision 的闭包判断。 |
| `previous_revision_ref` | `OptionalBundleManifestRef` | 修订链；不覆盖旧 revision。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `entry(ManifestEntryId entry_id)` | 在固定 revision 中查找条目。 |
| `is_fixed()` | 确认集合不可继续原地追加。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `freeze(BundleManifestId manifest_id, ArchiveBundleId bundle_id, ManifestRevisionId revision, ManifestEntrySet declared_entries, ManifestEntrySet actual_entries, ManifestClosure closure, OptionalBundleManifestRef previous_ref)` | 从已持久化 source inventory 建立不可变 revision。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不原地修改已固定条目。 | 修正通过新 revision。 |
| 不定义 L1 对象 schema。 | entry 只保存 Archive 所需引用与分类。 |

### 7.3 ManifestEntry

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP3 Bundle 清单与闭包 |
| 对象类型 | value object |
| 主要责任 | 表达 manifest 中一个有来源、有类别、有 locator 的声明或实际成员。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `entry_id` | `ManifestEntryId` | revision 内稳定条目标识。 |
| `source_binding_ref` | `SourceBindingRef` | 指向 CP2 authority 语境。 |
| `material_class` | `ArchiveMaterialClass` | canonical snapshot、workspace projection、artifact ref 或 audit material 等。 |
| `locator_ref` | `MaterialLocatorRef` | 指向获准材料位置；不是 storage commit 证明。 |
| `source_version_ref` | `OptionalSourceVersionRef` | owner-specific version。 |
| `entry_digest_ref` | `OptionalDigestRef` | 只保存正式摘要引用；算法未闭合可空。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `same_identity(ManifestEntry other_entry)` | 按稳定条目身份比较，不比较 provider 地址文本。 |
| `belongs_to(SourceBindingRef binding_ref)` | 防止跨 source 混入。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_material(ManifestEntryId entry_id, SourceBindingRef binding_ref, ArchiveMaterialClass material_class, MaterialLocatorRef locator_ref, OptionalSourceVersionRef version_ref, OptionalDigestRef digest_ref)` | 只从 CP2 已批准材料/ref 构造。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不以 Artifact ref 冒充 Artifact 正文或血缘闭包。 | 内容边界由 L1-artifact 声明。 |
| 不以 workspace projection 冒充 L1 canonical truth。 | material_class 必须保留。 |

### 7.4 ManifestClosure

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP3 Bundle 清单与闭包 |
| 对象类型 | value object / invariant assessment |
| 主要责任 | 表达确定 manifest revision 的声明集合与实际集合是否闭合。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `posture` | `ManifestClosurePosture` | Complete/Incomplete/Overfull/Invalid/Unknown。 |
| `manifest_revision` | `ManifestRevisionId` | 绑定不可变输入。 |
| `finding_refs` | `ClosureFindingRefSet` | 解释差异。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Complete` | 声明与实际集合按当前规则完全匹配。 |
| `Incomplete` | 至少一个声明条目缺失。 |
| `Overfull` | 出现未声明或未获准条目。 |
| `Invalid` | 条目身份、来源或类别违反不变量。 |
| `Unknown` | 无法可靠比较。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `evaluate(ManifestRevisionId revision, ManifestEntrySet declared_entries, ManifestEntrySet actual_entries)` | 纯计算集合差异并生成 finding refs。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不用 digest/signature/storage 成功替代 closure。 | 三者是不同状态轴。 |
| Unknown 不可当 Complete。 | 缺证明时保持阻塞。 |

### 7.5 ClosureFinding

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP3 Bundle 清单与闭包 |
| 对象类型 | immutable history record |
| 主要责任 | 记录确定 manifest revision 的 missing/unexpected/invalid 差异。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `finding_id` | `ClosureFindingId` | 本地 finding 身份。 |
| `manifest_revision` | `ManifestRevisionId` | 固定比较输入。 |
| `kind` | `ClosureFindingKind` | Missing/Unexpected/Invalid/Unknown。 |
| `entry_ref` | `OptionalManifestEntryRef` | 安全定位相关条目。 |
| `basis` | `ClosureFindingBasis` | 可解释判断依据。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record(ClosureFindingId finding_id, ManifestRevisionId revision, ClosureFindingKind kind, OptionalManifestEntryRef entry_ref, ClosureFindingBasis basis)` | 与 closure 评估结果一同保存。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不自动抓取额外 source 来“修复”闭包。 | 修正必须回到显式 capture/new revision。 |

#### CP3 对象正式化停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 5/5 正式展开；locator/digest 仅为 ref。 |
| capability 来源 | assembly、revision、closure、read input 均有对象承接。 |
| 边界 | closure、integrity、placement、业务归档状态互不推导。 |

## 8. CP4 完整性与兼容评估

### 8.1 VerificationAssessment

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP4 完整性与兼容评估 |
| 对象类型 | assessment entity |
| 主要责任 | 记录确定 manifest/material revision 上一次完整性与签名验证尝试。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `assessment_id` | `VerificationAssessmentId` | 单次评估身份。 |
| `input_binding` | `VerificationInputBinding` | 固定 Bundle/manifest/material revision。 |
| `capability_ref` | `OptionalIntegrityCapabilityRef` | 指向正式能力与版本，不固化 provider。 |
| `digest_refs` | `DigestRefSet` | 正式摘要引用；无合同则保持空与 Unknown。 |
| `signature_refs` | `SignatureRefSet` | 正式签名引用；不含 secret/key material。 |
| `posture` | `VerificationPosture` | Pending/InProgress/Verified/IntegrityFailed/Unknown/Blocked。 |
| `finding_refs` | `VerificationFindingRefSet` | 关联失败/未知原因。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Pending` | 已固定输入，未执行。 |
| `InProgress` | 正在调用正式能力。 |
| `Verified` | 对该固定输入验证通过；不证明业务真实性。 |
| `IntegrityFailed` | 内容/摘要/签名验证明确失败。 |
| `Unknown` | 能力返回或反馈不足以判定。 |
| `Blocked` | 算法/key/capability/输入前置无法证明。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `settle(IntegrityCapabilityFeedback feedback)` | 映射正式能力反馈并追加 findings。 |
| `matches(VerificationInputBinding input_binding)` | 防止用旧 assessment 验证新 revision。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `begin(VerificationAssessmentId assessment_id, VerificationInputBinding input_binding, OptionalIntegrityCapabilityRef capability_ref)` | 为固定输入建立评估。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不私造 digest、signature、algorithm 或 key。 | AR-UP-004 未闭合时 Unknown/Blocked。 |
| 不覆盖历史 assessment。 | 新输入或重验创建新记录。 |

### 8.2 CompatibilityAssessment

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP4 完整性与兼容评估 |
| 对象类型 | assessment entity |
| 主要责任 | 判断固定 manifest 中的 schema/version 对指定 reader/receiver context 是否可支持。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `assessment_id` | `CompatibilityAssessmentId` | 单次兼容评估身份。 |
| `manifest_revision` | `ManifestRevisionId` | 固定评估输入。 |
| `schema_version_refs` | `SchemaVersionRefSet` | 各 owner schema/version 引用。 |
| `target_context` | `CompatibilityTargetContext` | Verify/Read/RestoreReceiver 目标语境。 |
| `posture` | `CompatibilityPosture` | Supported/Unsupported/Unknown/Conflicting。 |
| `finding_refs` | `VerificationFindingRefSet` | 关联缺口与冲突。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Supported` | 对指定目标语境有正式兼容证明。 |
| `Unsupported` | 明确不受支持。 |
| `Unknown` | 版本/reader/receiver 合同不足。 |
| `Conflicting` | 多方声明互相冲突。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `applies_to(CompatibilityTargetContext target_context)` | 防止把读取兼容结论复用于恢复 receiver。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `assess(CompatibilityAssessmentId assessment_id, ManifestRevisionId revision, SchemaVersionRefSet schema_refs, CompatibilityTargetContext target_context, CompatibilityCapabilityFeedback feedback)` | 从正式版本/能力反馈形成结论。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不自动迁移 schema 或猜测向后兼容。 | 转换策略由 owner/正式兼容合同提供。 |
| Unsupported/Unknown 不可乐观进入 restore。 | 必须阻塞相关 item。 |

### 8.3 VerificationFinding

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP4 完整性与兼容评估 |
| 对象类型 | immutable audit/history record |
| 主要责任 | 记录完整性或兼容评估的失败、未知、冲突及其安全依据。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `finding_id` | `VerificationFindingId` | 本地 finding 身份。 |
| `assessment_ref` | `AssessmentRef` | 指向 verification 或 compatibility assessment。 |
| `kind` | `VerificationFindingKind` | IntegrityMismatch/SignatureInvalid/KeyUnavailable/UnsupportedVersion/Conflicting/Unknown。 |
| `subject_ref` | `SafeVerificationSubjectRef` | 安全定位，不泄露 secret/material。 |
| `basis_ref` | `OptionalCapabilityEvidenceRef` | 指向正式反馈依据。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record(VerificationFindingId finding_id, AssessmentRef assessment_ref, VerificationFindingKind kind, SafeVerificationSubjectRef subject_ref, OptionalCapabilityEvidenceRef basis_ref)` | 保存允许披露的验证事实。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存 key/secret 或完整 provider 响应。 | 仅保存安全引用与分类。 |

#### CP4 对象正式化停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 3/3 正式展开；算法、key、schema/provider 为外部 ref/capability。 |
| capability 来源 | integrity、compatibility、verification read 均有对象承接。 |
| 边界 | integrity 与 compatibility 两轴分离；AR-UP-004 保持 fail-closed。 |

## 9. CP5 存储与生命周期执行

### 9.1 ArchivePlacement

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP5 存储与生命周期执行 |
| 对象类型 | domain entity |
| 主要责任 | 记录 Bundle revision 的外部存储意图、位置绑定、提交与取回姿态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `placement_id` | `ArchivePlacementId` | 本地 placement 身份。 |
| `bundle_revision_ref` | `BundleRevisionRef` | 固定被承载内容。 |
| `location_ref` | `OptionalStorageLocationRef` | 外部位置引用，不包含 secret。 |
| `tier_ref` | `OptionalStorageTierRef` | 外部冷热层引用；不内建供应商枚举。 |
| `placement_state` | `PlacementState` | IntentRecorded/Dispatched/Committed/CommitUnknown/Blocked/Failed。 |
| `retrieval_state` | `RetrievalState` | Unknown/NotRequested/Requested/Retrievable/Unavailable/Failed。 |
| `external_commit_ref` | `OptionalExternalCommitRef` | 外部明确提交证明引用。 |

#### 状态集合

| 状态轴 | 状态 | 作用 |
|---|---|---|
| placement | `IntentRecorded` / `Dispatched` | 意图已保存 / 已发送，均不表示提交。 |
| placement | `Committed` | 有正式 commit 反馈。 |
| placement | `CommitUnknown` | 外部可能已提交，必须先 probe/reconcile。 |
| placement | `Blocked` / `Failed` | 前置不足 / 当前 attempt 明确失败。 |
| retrieval | `Unknown` / `NotRequested` | 未证明 / 尚未申请。 |
| retrieval | `Requested` / `Retrievable` | 已申请 / 有当前可取回证明。 |
| retrieval | `Unavailable` / `Failed` | 明确不可用 / 当前取回 attempt 失败。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_dispatched(ExternalActionRecordRef action_ref)` | 记录已发送，不越级为 Committed。 |
| `settle(StorageCommitFeedback feedback)` | 映射 committed/failed/unknown。 |
| `record_retrieval(StorageRetrievalFeedback feedback)` | 独立更新 retrieval 轴。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `intend(ArchivePlacementId placement_id, BundleRevisionRef bundle_revision_ref, StorageIntent intent)` | 在外部调用前持久化唯一意图。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| timeout 后不盲写重试或伪造 location/digest。 | CommitUnknown 必须先核对。 |
| 不把 location/tier 当 provider truth 副本。 | 只保存正式 ref 与本地姿态。 |

### 9.2 GovernanceDecisionRef

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP5 存储与生命周期执行 |
| 对象类型 | reference object |
| 主要责任 | 绑定一次 retention/hold/delete/risk 决定的 owner、版本、适用范围和有效性引用。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `decision_id` | `ExternalDecisionId` | owner 决定身份。 |
| `owner_ref` | `GovernanceOwnerRef` | 正式 owning domain。 |
| `decision_kind` | `GovernanceDecisionKind` | Retain/Hold/ReleaseHold/DeleteAuthorize/RiskAccept 等引用分类。 |
| `decision_version` | `ExternalDecisionVersion` | 适用版本；比较规则归 owner。 |
| `scope_ref` | `GovernanceDecisionScopeRef` | 指向适用 Bundle/项目/材料范围。 |
| `validity_ref` | `DecisionValidityRef` | 指向当前有效性证明。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `applies_to(BundleRevisionRef bundle_revision_ref)` | 依据 owner 提供的适用性语义核对引用范围。 |
| `same_version(GovernanceDecisionRef other_ref)` | 避免用旧决定覆盖新决定。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `bind(ExternalDecisionEnvelope decision)` | 只从正式 governance/owner 决定构造。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不包含 policy 规则、默认期限、hold 推理或删除批准逻辑。 | Archive 不拥有治理 truth。 |
| 缺 validity/scope 证明时不可构造 eligible。 | 保持 fail-closed。 |

### 9.3 LifecycleExecution

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP5 存储与生命周期执行 |
| 对象类型 | domain entity / execution record |
| 主要责任 | 记录某正式治理决定对应的存储迁移、保留或删除动作执行姿态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `execution_id` | `LifecycleExecutionId` | 本地执行身份。 |
| `bundle_revision_ref` | `BundleRevisionRef` | 固定动作目标。 |
| `decision_ref` | `GovernanceDecisionRef` | 唯一正式治理依据。 |
| `action_kind` | `LifecycleActionKind` | Retain/TierTransition/Delete 等执行分类。 |
| `execution_state` | `LifecycleExecutionState` | Eligible/IntentRecorded/Dispatched/Acknowledged/Committed/CommitUnknown/Blocked/Failed/Compensated。 |
| `external_action_refs` | `ExternalActionRecordRefSet` | 追溯各次外部意图和反馈。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Eligible` | 已核对正式决定适用性；尚无外部动作。 |
| `IntentRecorded` | 外部副作用意图已本地提交。 |
| `Dispatched` | 已发送，结果未知。 |
| `Acknowledged` | 对端受理，不等于动作提交。 |
| `Committed` | 有明确外部完成证明。 |
| `CommitUnknown` | 外部可能完成，需核对。 |
| `Blocked` | hold、决定冲突、过期或前置不足。 |
| `Failed` | 明确失败。 |
| `Compensated` | 获准补偿已完成；不抹除原执行。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `record_intent(ExternalActionRecord action_record)` | 先落本地意图再允许调用。 |
| `apply_feedback(ExternalActionFeedback feedback)` | 保守映射 ack/commit/failure/unknown。 |
| `reconcile(ExternalActionProbeResult probe_result)` | 对 CommitUnknown 核对，避免盲重放。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `eligible(LifecycleExecutionId execution_id, BundleRevisionRef bundle_revision_ref, GovernanceDecisionRef decision_ref, LifecycleActionKind action_kind)` | 在 decision 适用且无更新冲突/hold 时建立执行语境。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不自行选择期限、解除 hold、授权删除或接受风险。 | 只能执行 owner 决定。 |
| Acknowledged 不等于 Committed。 | 外部状态分层记录。 |

### 9.4 ExternalActionRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP5 存储与生命周期执行 |
| 对象类型 | immutable external-effect history record |
| 主要责任 | 记录对 storage/lifecycle 能力的一次有幂等语境的外部动作意图与反馈。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `action_id` | `ExternalActionId` | 本地唯一动作身份。 |
| `target_ref` | `ExternalActionTargetRef` | 指向 placement 或 lifecycle execution。 |
| `idempotency_key` | `ExternalIdempotencyKey` | 对端幂等语境。 |
| `intent_digest` | `SafeInputDigest` | 同键异输入冲突检测。 |
| `attempt_no` | `ExternalAttemptNumber` | 明确尝试序号。 |
| `posture` | `ExternalActionPosture` | IntentRecorded/Dispatched/Acknowledged/Committed/CommitUnknown/Failed。 |
| `feedback_ref` | `OptionalExternalFeedbackRef` | 可核对的外部反馈引用。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches(SafeInputDigest intent_digest)` | 防止同 key 不同效果。 |
| `settle(ExternalActionFeedback feedback)` | 保存保守结果而非推测。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_intent(ExternalActionId action_id, ExternalActionTargetRef target_ref, ExternalIdempotencyKey idempotency_key, SafeInputDigest intent_digest, ExternalAttemptNumber attempt_no)` | 在副作用前创建不可变意图。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不复用同 key 执行不同 target/input。 | 冲突必须显式失败。 |
| 不把 retry 次数或时间参数固化在对象语义中。 | 参数留 04，机制留 03。 |

#### CP5 对象正式化停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 4/4 正式展开；storage/tier/commit 仅为 ref。 |
| capability 来源 | placement/retrieval、eligibility、lifecycle execution/reconcile 均有承接。 |
| 边界 | decision 与 execution、ack 与 commit 分离；AR-UP-003/005 继续开放。 |

## 10. CP6 恢复计划与交接

### 10.1 RestoreRequest

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP6 恢复计划与交接 |
| 对象类型 | domain aggregate |
| 主要责任 | 固定一次恢复申请的 Bundle、目标 owner、依据和幂等语境。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `request_id` | `RestoreRequestId` | 本地恢复申请身份。 |
| `bundle_ref` | `ArchiveBundleRef` | 指向待恢复 Bundle。 |
| `target_owners` | `RestoreTargetOwnerSet` | 显式目标 owner；不暗含全域。 |
| `requested_by` | `ActorRef` | 可追溯主体引用。 |
| `authority_ref` | `RestoreAuthorityRef` | 正式恢复申请/批准依据。 |
| `idempotency_key` | `IdempotencyKey` | 受理去重。 |
| `input_digest` | `SafeInputDigest` | 同键异输入冲突检测。 |
| `admission` | `RequestAdmissionState` | Accepted/Rejected/Blocked。 |

#### 状态集合

与 ArchiveRequest 共享 admission 值语义；`Accepted` 只允许形成 RestorePlan，不授予 owner 写权。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches(SafeInputDigest input_digest)` | 幂等输入核对。 |
| `targets(RestoreOwnerRef owner_ref)` | 判断显式 owner 范围。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `admit(RestoreRequestId request_id, ArchiveBundleRef bundle_ref, RestoreTargetOwnerSet owners, ActorRef actor, RestoreAuthorityRef authority_ref, IdempotencyKey idempotency_key, SafeInputDigest input_digest)` | 在申请与 Bundle 最小前提可证明时受理。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不把 RestoreRequest 当跨域写权限。 | 每个 owner receiver 仍独立授权/提交。 |

### 10.2 RestorePlan

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP6 恢复计划与交接 |
| 对象类型 | domain aggregate / immutable revision |
| 主要责任 | 固定一次恢复的 per-owner item、输入 revision 与聚合执行姿态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `plan_id` | `RestorePlanId` | 恢复计划身份。 |
| `request_ref` | `RestoreRequestRef` | 所属申请。 |
| `bundle_revision_ref` | `BundleRevisionRef` | 固定恢复输入。 |
| `plan_revision` | `RestorePlanRevision` | 不可变计划修订。 |
| `item_refs` | `RestoreItemRefSet` | per-owner 恢复项。 |
| `plan_state` | `RestorePlanState` | Draft/Ready/Blocked/InProgress/Partial/HandoffComplete/Failed/Superseded。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Draft` | 正在枚举 item 与前置。 |
| `Ready` | 所需 item/material/receiver 前置可开始 handoff。 |
| `Blocked` | integrity/compatibility/retrieval/authority/receiver 不足。 |
| `InProgress` | 至少一个 item 正在 handoff/reconcile。 |
| `Partial` | item 结果混合或有未完成项。 |
| `HandoffComplete` | 所有必需 item 已有确定 receiver outcome；不等于业务 restored。 |
| `Failed` | 当前计划无法完成。 |
| `Superseded` | 被新 revision 取代。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `freeze(RestoreItemRefSet item_refs, RestorePlanRevision plan_revision)` | 固定 per-owner item，不原地增删。 |
| `recompute(RestoreItemPostureSet item_postures)` | 保守聚合，不吞 partial/unknown。 |
| `supersede(RestorePlanRef replacement_plan_ref)` | 终止旧 revision 后续派发。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `draft(RestorePlanId plan_id, RestoreRequestRef request_ref, BundleRevisionRef bundle_revision_ref)` | 为 Accepted 恢复请求建立计划。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不把多 owner handoff 包装成单一跨域事务。 | 每个 item/outcome 独立。 |
| HandoffComplete 不等于 owning domains restored。 | 业务状态由 owner 决定。 |

### 10.3 RestoreItem

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP6 恢复计划与交接 |
| 对象类型 | domain entity |
| 主要责任 | 承载一个 owner/slice 的材料准备、兼容性与 handoff 状态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `item_id` | `RestoreItemId` | 计划内稳定身份。 |
| `plan_id` | `RestorePlanId` | 所属计划。 |
| `target_owner_ref` | `RestoreOwnerRef` | 唯一 owning domain。 |
| `source_entry_refs` | `ManifestEntryRefSet` | 只取该 owner 获准条目。 |
| `material_ref` | `OptionalRestoreMaterialRef` | 最小恢复材料引用。 |
| `receiver_ref` | `OptionalRestoreReceiverRef` | 正式 receiver 合同引用。 |
| `item_state` | `RestoreItemState` | Planned/Blocked/MaterialReady/HandoffPending/InProgress/Succeeded/Rejected/Failed/CommitUnknown/CompensationPending/Compensated。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Planned` | 已枚举 owner/slice。 |
| `Blocked` | integrity/compatibility/retrieval/authority/receiver 前置不足。 |
| `MaterialReady` | owner-specific 最小材料已固定。 |
| `HandoffPending` / `InProgress` | 意图待派发 / 已派发。 |
| `Succeeded` | receiver 明确返回该 item 的成功 outcome；不代表业务状态。 |
| `Rejected` / `Failed` | receiver 明确拒绝 / 当前尝试失败。 |
| `CommitUnknown` | 对端副作用可能发生，必须核对。 |
| `CompensationPending` / `Compensated` | 已批准补偿待执行 / 已完成。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `bind_material(RestoreMaterialRef material_ref, RestoreEligibilityBasis basis)` | 只在固定输入通过前置时绑定材料。 |
| `attach_handoff(RestoreHandoffRef handoff_ref)` | 关联唯一当前 handoff。 |
| `apply_outcome(HandoffOutcome outcome)` | 映射明确/未知结果，不推导 owner business truth。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `plan(RestoreItemId item_id, RestorePlanId plan_id, RestoreOwnerRef owner_ref, ManifestEntryRefSet source_entries)` | 从固定 manifest 与显式 target owner 建立 item。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不把一个 owner 的结果传播成其他 owner 成功。 | per-owner 独立。 |
| unsupported/integrity-failed/missing/stale/conflicting 不可进入 MaterialReady。 | 保持安全阻塞。 |

### 10.4 RestoreHandoff

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP6 恢复计划与交接 |
| 对象类型 | external-effect entity |
| 主要责任 | 记录一次 owner-specific receiver handoff 的意图、幂等语境和外部反馈姿态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `handoff_id` | `RestoreHandoffId` | 本地 handoff 身份。 |
| `item_id` | `RestoreItemId` | 唯一恢复项。 |
| `receiver_ref` | `RestoreReceiverRef` | 正式 owner receiver。 |
| `material_ref` | `RestoreMaterialRef` | 固定最小材料。 |
| `idempotency_key` | `ReceiverIdempotencyKey` | 对端去重语境。 |
| `input_digest` | `SafeInputDigest` | 同键异材料冲突检测；非 Bundle digest。 |
| `handoff_state` | `RestoreHandoffState` | IntentRecorded/Dispatched/Acknowledged/Succeeded/Rejected/Failed/CommitUnknown/ReconcileRequired。 |
| `latest_outcome_ref` | `OptionalHandoffOutcomeRef` | 最近外部反馈，不覆盖历史。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `IntentRecorded` | 外部调用前意图已本地提交。 |
| `Dispatched` | 已发送，尚无确定反馈。 |
| `Acknowledged` | 对端受理，不等于提交。 |
| `Succeeded` | receiver 正式反馈本次 handoff 成功。 |
| `Rejected` / `Failed` | 对端拒绝 / 当前尝试失败。 |
| `CommitUnknown` | 外部可能提交但反馈不确定。 |
| `ReconcileRequired` | 必须 probe/人工核对后才能 retry/compensate。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches(SafeInputDigest input_digest)` | 保护 receiver 幂等边界。 |
| `apply(HandoffOutcome outcome)` | 保守映射 receiver feedback。 |
| `require_reconcile(CommitUnknownBasis basis)` | 阻止盲重放。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_intent(RestoreHandoffId handoff_id, RestoreItemId item_id, RestoreReceiverRef receiver_ref, RestoreMaterialRef material_ref, ReceiverIdempotencyKey idempotency_key, SafeInputDigest input_digest)` | 在 receiver 调用前保存。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不直写 owner 数据库或共享事务。 | 只能经正式 receiver port。 |
| 不把 ACK、timeout 或事件送达当 commit。 | 结果必须来自正式 receiver 语义。 |

### 10.5 HandoffOutcome

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP6 恢复计划与交接 |
| 对象类型 | immutable external-feedback record |
| 主要责任 | 保存 receiver 对确定 handoff 的 accepted/committed/rejected/conflicting/unknown 反馈。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `outcome_id` | `HandoffOutcomeId` | 本地反馈记录身份。 |
| `handoff_id` | `RestoreHandoffId` | 固定意图。 |
| `receiver_outcome` | `ReceiverOutcomePosture` | Acknowledged/Succeeded/Rejected/Failed/Conflicting/CommitUnknown。 |
| `receiver_commit_ref` | `OptionalReceiverCommitRef` | 明确提交时的 owner 引用。 |
| `feedback_ref` | `ExternalFeedbackRef` | 原始反馈的安全引用。 |
| `observed_at` | `RecordedAt` | Archive 观察时间。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `observe(HandoffOutcomeId outcome_id, RestoreHandoffId handoff_id, ReceiverFeedback feedback, RecordedAt observed_at)` | 对正式 receiver feedback 做安全映射。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不代表 owner 当前业务 truth，也不代发 owner 事件。 | 它只是 Archive 的 handoff 观察记录。 |

### 10.6 CompensationRecord

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CP6 恢复计划与交接 |
| 对象类型 | external-effect history entity |
| 主要责任 | 记录针对确定 handoff 的获准补偿或人工处置姿态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `compensation_id` | `CompensationRecordId` | 本地补偿记录身份。 |
| `handoff_ref` | `RestoreHandoffRef` | 所针对的外部意图。 |
| `authority_ref` | `CompensationAuthorityRef` | 正式批准依据；Archive 不自行生成。 |
| `action` | `CompensationAction` | RetryAfterProbe/Cancel/Reverse/ManualHandoff 等合同分类。 |
| `state` | `CompensationState` | Planned/InProgress/Completed/Failed/CommitUnknown/Blocked。 |
| `outcome_ref` | `OptionalExternalFeedbackRef` | 补偿反馈引用。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `Planned` | 有正式 authority 的处置计划。 |
| `InProgress` | 正在执行。 |
| `Completed` | 补偿边界明确完成；不抹除原 handoff。 |
| `Failed` | 明确失败。 |
| `CommitUnknown` | 补偿副作用不确定，需核对。 |
| `Blocked` | 缺 authority/receiver capability/安全前置。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply_feedback(CompensationFeedback feedback)` | 保守保存补偿结果。 |
| `require_reconcile(CommitUnknownBasis basis)` | 保持未知并阻止盲重试。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `plan(CompensationRecordId compensation_id, RestoreHandoffRef handoff_ref, CompensationAuthorityRef authority_ref, CompensationAction action)` | 仅从正式处置决定建立。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不因局部失败自动决定反向写 owner。 | 补偿也必须走正式边界与授权。 |
| 不用补偿完成伪装原 handoff 从未发生。 | 两份历史均保留。 |

#### CP6 对象正式化停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 6/6 正式展开；receiver/material/commit 为 typed ref。 |
| capability 来源 | plan、material、handoff、reconcile、compensation 均有承接。 |
| 边界 | per-owner 结果独立；Archive 不拥有 receiver commit/business restored。 |

## 11. 辅助类型、接口与实现细节排除登记

| 类别 | 名称 / 含义 | 不独立展开的原因与承接 |
|---|---|---|
| 本地 ID / version / ref | 各 `*Id`、`*Version`、`*Ref`、`*Revision` | 字段级身份和比较语境；03 定义编码、生成和比较。 |
| 外部输入槽位 | authority、owner coverage、fence、digest、signature、key、schema、storage、receiver、commit refs | 只描述所需正式证明；AR-UP-001~009 未闭合前无本地正向构造权。 |
| 状态 enum | RequestAdmissionState、ArchiveJobStage、各 posture/state | 已在所属对象状态表解释；Step 9 收稳迁移，不另造 aggregate。 |
| service / port / repository | Step 5 点名的 application services、source/storage/integrity/receiver/local store ports | Step 7 定接口骨架，03 定函数/trait/adapter；不是业务对象。 |
| command/query/event/job DTO | ActorContext、CommandMetadata、查询与 feedback envelope | 入口与传输骨架在 Step 7；不保存独立 truth。 |
| provider / owner response | SDK 原始响应、HTTP body、storage/KMS/receiver 原始错误 | adapter 负责安全翻译；不能进入 domain 或正式文档成为稳定 schema。 |
| read models | ArchiveBundleView、BundleVerificationView、JobStatusView 等 | 由关键对象只读组合；Step 7/8 定查询边界，不作为新 truth owner。 |

## 12. Step 8 / Step 9 反查清单

| 后续主题 | 必须使用的已定义对象 | 反查结论 |
|---|---|---|
| archive admission/job | ArchiveRequest、DeclaredArchiveScope、ArchiveJob、ArchiveJobStageRecord | 已定义 |
| source capture/reconcile | ArchiveSourceBinding、CaptureAttempt、CaptureCoverage、SourceCaptureFinding | 已定义 |
| manifest assembly/closure/seal | ArchiveBundle、BundleManifest、ManifestEntry、ManifestClosure、ClosureFinding | 已定义 |
| integrity/compatibility | VerificationAssessment、CompatibilityAssessment、VerificationFinding | 已定义 |
| placement/retrieval/lifecycle | ArchivePlacement、GovernanceDecisionRef、LifecycleExecution、ExternalActionRecord | 已定义 |
| restore plan/material/handoff | RestoreRequest、RestorePlan、RestoreItem、RestoreHandoff、HandoffOutcome、CompensationRecord | 已定义 |

## 13. 跨对象 / 跨组成部分一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 对象唯一归属 | pass | 26 个正式对象均只属于一个 CP；跨 CP 只通过 typed ref。 |
| 多轴状态 | pass | job/capture/closure/integrity/compatibility/placement/retrieval/lifecycle/restore/handoff 分离。 |
| 外部 authority | pass_with_blockers | 外部事实均为 ref/evidence slot；AR-UP-001~009 原样开放。 |
| 外部副作用 | pass | intent/dispatch/ack/commit/commit-unknown/reconcile 分离。 |
| 处理流 / 状态预备 | pass | Step 8/9 所需正式主语均已定义；不得在后续隐式新增。 |
| 依赖分类 | pass_with_blocker | 无 sibling/SDK/provider 领域对象；AR-ARCH-001 保持开放。 |
| 历史污染 | pass | ArchivedSnapshot/ArchiveIndex/RetentionClass/LegalHold/ReplayResult 均未继承。 |

## 14. 回填草稿、待确认与进入下一步条件

正式 §6 依次摘录候选筛选、26 个对象卡、辅助类型排除和后续反查；本文件中的恢复过程与逐 CP 停审不进入正式正文。

待确认仍为各 owner schema/fence/coverage、Artifact material 闭包、governance decision、digest/signature/key/schema evolution、storage 与 receiver 合同；本步只提供本地类型槽位，未把它们润色为事实。

六 CP 已按顺序停审，字段均有概要类型，函数参数均为 `TypeName param_name`，未来处理流/状态主语无悬空。`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 7。
