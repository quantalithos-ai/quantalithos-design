# Step 6. 关键对象轮廓

## 1. Step 状态与计划

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 6 / 关键对象轮廓 |
| 状态 | `completed` |
| 当前模块 | `objects:self_reviewed` |
| gate_status | `pass` |
| next_allowed_action | `read_and_start_step_07` |
| 正式正文写入 | `blocked_until_step_14` |

### 1.1 Step 内计划

- [x] 读取项目台账、02 flow、Step 5、概要 SOP Step 6 和书写规范 §4.6。
- [x] 从 Step 5 对象发现线索筛选正式对象、字段类型、接口/port 和详细设计实现项。
- [x] 校准 Context and explicit selection 对象组。
- [x] 校准 Material acquisition and qualification 对象组。
- [x] 校准 Run intent and lifecycle 对象组。
- [x] 校准 Resource, cleanup and recovery protection 对象组。
- [x] 校准 Preview, diagnosis and handoff 对象组。
- [x] 校准 Entry and presentation composition 对象组。
- [x] 完成 Step 8/9 反查、跨对象审计、回填草稿和台账同步。

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 5 组成部分/capability/对象候选池 | 唯一对象发现入口；不得临场增加无来源对象。 |
| Step 4 代码主体框架 | 区分 domain/projection/reference 与 service/port/adapter。 |
| Step 3 约束 | 约束字段禁区、ownership、多轴状态、no-write、保护和证据边界。 |
| 正式 01 §9～10 | 校验 local truth、snapshot/ref、observation 和 consistency 来源。 |

## 3. SOP 问题回答

1. 需要独立展开的是未来会成为 aggregate/entity/value object/guard/projection/context object 的稳定主语；没有它们，Step 8/9 会重新发明状态承载者。
2. 17 个对象从六部分候选池进入正式化；每个对象回指一个 capability 和唯一主要归属。
3. service、facade、job、port、repository、DTO、page presenter、external ref 类型和 raw response 不作为本章领域对象；它们分别留 Step 7、03 或作为字段类型。
4. 字段只保留 ownership/source binding、状态来源、保护和后续处理流必须使用的骨架；完整 schema、序列化和数据库列留给 03。
5. 函数只保留能表达对象责任与不变量的骨架，参数必须带概要类型；不写返回类型、语言语法或实现。

## 4. 当前文档问题诊断与取舍

| 问题 | 取舍 |
|---|---|
| 用一个 `RunnerRun` 保存全部状态 | 不采用；selection、acquisition、intent、owner projection、cleanup、diagnostic 分对象/分轴。 |
| 每个 safe ref 都做独立领域对象 | 不采用；稳定 ref 作为 typed field，完整共享类型留 03。 |
| 把所有 view 拆成大量对象 | 只保留会被接口/流程/状态反复引用的 view；secondary posture 纳入 `RunnerReadModel`。 |
| required port 返回对象当 domain truth | 不采用；owner response 只经 adapter 转为 safe snapshot/ref，未闭合合同保持 blocked。 |
| 将历史日志/telemetry 建成 audit record | 不采用；本地追踪只标 non-authoritative，正式 evidence 在 Observability。 |

## 5. 对象候选池筛选说明

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `RunnerContextRef` | Context / Reference | 正式关键对象 | 所有副作用需要可信语境绑定，但不复制身份/项目正文。 |
| `ReleaseSelection` | Selection / Truth | 正式关键对象 | Runner-owned 显式选择聚合。 |
| `SelectionGeneration` | Selection / Value | 正式关键对象 | 防止选择切换后旧资格/意图静默复用。 |
| `AcquisitionTask` | Acquisition / State | 正式关键对象 | 长时取得有独立状态与恢复语义。 |
| `MaterialCacheEntry` | Material / Truth-State | 正式关键对象 | 本地材料绑定、quarantine、保护和晋级主语。 |
| `IntegrityPosture` | Qualification / State | 正式关键对象 | 传输与验证必须分轴。 |
| `RunIntent` | Lifecycle / Truth | 正式关键对象 | Runner-owned 请求意图，不是 execution truth。 |
| `ControlIntent` | Lifecycle / Truth | 正式关键对象 | start/stop/cancel/cleanup 意图与结果必须分离。 |
| `OwnerRunProjection` | Lifecycle / Projection | 正式关键对象 | 正式 owner 状态的带来源组合面。 |
| `ResourceObservation` | Resource / Observation | 正式关键对象 | local probe 与 owner allocation 分离。 |
| `ProtectionGuard` | Cleanup / Guard | 正式关键对象 | lease/capture/handoff/retention/orphan 保护必须一等表达。 |
| `RecoveryCase` | Recovery / State | 正式关键对象 | unknown/reconcile/manual-review 需要稳定承载。 |
| `OutputPreview` | Preview / Projection | 正式关键对象 | bounded/redacted/source-attributed 输出面。 |
| `FailureDiagnosis` | Diagnosis / Local record | 正式关键对象 | 分类、影响和 next-step，不升级 verdict。 |
| `HandoffPosture` | Handoff / State | 正式关键对象 | 交接意图/receipt 与 evidence 分离。 |
| `RunnerReadModel` | Entry / Read model | 正式关键对象 | 多入口共享的安全组合视图。 |
| `ConnectivityView` | Entry / Projection | 正式关键对象 | 连接状态不能覆盖业务状态。 |
| `SelectionPostureView`、`QualificationPostureView`、`ExecutionPostureView`、`CleanupPostureView` | Secondary views | 合并为 `RunnerReadModel` 的 typed sections | 避免将纯展示分段误作独立 truth；03 可定义传递类型。 |
| `ReleaseRef`、`AuthorityRef`、`LeaseRef`、`OutputRef` 等 | Safe refs | 仅作为字段类型 | Ownership 在相邻 owner；03 收稳 shared typed ref。 |
| Services / Jobs / Ports / Repositories / DTO / Page presenters | Implementation/API | 留 Step 7 或 03 | 不是领域对象；不得在本章伪造对象状态。 |

## 6. 逐组成部分对象正式化

## 6.1 Context and explicit selection

### 6.1.1 RunnerContextRef

| 项 | 内容 |
|---|---|
| 所属部分 | Context and explicit selection |
| 对象类型 | immutable context object |
| 主要责任 | 绑定已解析 actor/session/project/platform 安全引用及其来源限制。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `context_id` | `RunnerContextId` | 本地语境关联标识，不是身份 ID。 |
| `actor_ref` | `ActorRef` | 正式 actor 安全引用。 |
| `session_ref` | `SessionRef` | 当前 session 安全引用。 |
| `project_ref` | `OptionalProjectRef` | 可选项目语境，不推断 ProjectMember。 |
| `scope_ref` | `RunnerScopeRef` | 当前可适用 scope。 |
| `platform_ref` | `PlatformContextRef` | 端侧平台语境引用，不是资源 truth。 |
| `source_freshness` | `SourceFreshness` | 解析结果当前性。 |
| `visibility` | `VisibilityPosture` | current/restricted/partial/unavailable 等限制。 |

| 成员函数 | 作用 |
|---|---|
| `assert_usable(RunnerScopeRef scope_ref)` | 检查 scope、freshness、visibility 是否允许继续，不授予权限。 |
| `mark_stale(StaleReason reason)` | 产生新的 stale 语境姿态，触发后续冻结。 |

| 工厂函数 | 作用 |
|---|---|
| `from_resolution(ContextResolution resolution)` | 仅从正式 context resolver 的安全结果构造。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存身份/项目正文或 token/secret | 引用不转移 ownership。 |
| 不以本地角色或旧 session 推导 authority | Authority 由正式 owner 决定。 |

### 6.1.2 SelectionGeneration

| 项 | 内容 |
|---|---|
| 所属部分 | Context and explicit selection |
| 对象类型 | immutable value object |
| 主要责任 | 区分每次显式选择世代，阻止旧资格、cache 或请求跨选择复用。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `value` | `GenerationNumber` | 本地单调世代值。 |
| `cause` | `SelectionChangeCause` | initial/user_change/source_invalidation/context_change。 |
| `predecessor` | `OptionalGenerationNumber` | 回指前一世代，供失效与诊断。 |
| `created_at` | `Timestamp` | 本地生成时间，不代表 owner 版本时间。 |

| 成员函数 | 作用 |
|---|---|
| `is_successor_of(SelectionGeneration previous)` | 校验本地世代连续性。 |

| 工厂函数 | 作用 |
|---|---|
| `initial(SelectionChangeCause cause)` | 创建首个明确世代。 |
| `next(SelectionGeneration previous, SelectionChangeCause cause)` | 创建新世代；不得就地修改旧世代。 |

| 禁止事项 | 说明 |
|---|---|
| 不等于 Release version、digest 或 event cursor | 仅是 Runner local concurrency/invalidating boundary。 |

### 6.1.3 ReleaseSelection

| 项 | 内容 |
|---|---|
| 所属部分 | Context and explicit selection |
| 对象类型 | local aggregate |
| 主要责任 | 保存用户显式选择、不可变来源绑定、适用 scope 与失效姿态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `selection_id` | `RunnerSelectionId` | Runner 本地选择标识。 |
| `context_ref` | `RunnerContextRef` | 选择发生时的可信语境。 |
| `release_ref` | `ReleaseRef` | 显式不可变 Release 引用。 |
| `version_ref` | `ArtifactVersionRef` | 精确版本引用；禁止 latest。 |
| `scope_ref` | `RunnerScopeRef` | 适用范围绑定。 |
| `generation` | `SelectionGeneration` | 当前选择世代。 |
| `authority_ref` | `OptionalAuthorityRef` | 最近一次正式 authority 引用，不等于本地批准。 |
| `state` | `SelectionState` | selected/checking/current/stale/invalidated/blocked。 |

| 状态 | 作用 |
|---|---|
| `selected` | 已显式选择，尚未证明 authority current。 |
| `checking` | 正在读取正式 authority；不允许副作用。 |
| `current` | 正式 authority 当前且绑定一致，可进入材料准备。 |
| `stale` | freshness 不足，必须重验。 |
| `invalidated` | 撤销、过期、scope/source 变化或用户换选。 |
| `blocked` | 合同、可见性或冲突使资格不可证明。 |

| 成员函数 | 作用 |
|---|---|
| `bind_authority(AuthoritySnapshotRef authority_ref, SourceFreshness freshness)` | 绑定正式结论；不能自行生成 approval。 |
| `invalidate(SelectionInvalidation reason, SelectionGeneration next_generation)` | 失效当前选择并阻止旧意图继续。 |
| `assert_binding(ReleaseRef release_ref, ArtifactVersionRef version_ref, SelectionGeneration generation)` | 校验副作用输入与选择一致。 |

| 工厂函数 | 作用 |
|---|---|
| `select(RunnerContextRef context_ref, ReleaseRef release_ref, ArtifactVersionRef version_ref, RunnerScopeRef scope_ref, SelectionGeneration generation)` | 从显式用户选择建立本地聚合，初态仅 `selected`。 |

| 禁止事项 | 说明 |
|---|---|
| 禁止接受 latest/default branch/directory newest | 输入必须是 immutable ref/version。 |
| 禁止修改 Release 内容或生成 approval | 本对象只拥有本地选择。 |

#### 6.1.4 本部分对象停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 三个候选均正式化；secondary selection view 归 RunnerReadModel。 |
| capability 来源 | context、显式选择、generation、authority posture 均有对象承接。 |
| ownership | 只拥有 local selection/context ref，不拥有 Release/Governance truth。 |
| 字段/函数深度 | 概要骨架；exact shared refs/schema 留 03 或 owner contract。 |

## 6.2 Material acquisition and qualification

### 6.2.1 AcquisitionTask

| 项 | 内容 |
|---|---|
| 所属部分 | Material acquisition and qualification |
| 对象类型 | local aggregate |
| 主要责任 | 承载一次与选择绑定的 locator 解析、传输进度、暂停/恢复和失败姿态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `task_id` | `AcquisitionTaskId` | 本地取得任务标识。 |
| `selection_binding` | `SelectionBinding` | release/version/scope/generation 不可变绑定。 |
| `locator_ref` | `OptionalLocatorRef` | 正式 locator 引用；不保存 secret URL 正文。 |
| `state` | `AcquisitionState` | absent/resolving/transferring/paused/complete/failed/cancelled。 |
| `progress` | `TransferProgress` | 有界进度与单位；不证明完整性。 |
| `material_handle` | `OptionalLocalMaterialHandle` | quarantine 材料抽象句柄。 |
| `failure` | `OptionalAcquisitionFailure` | redacted 失败分类。 |

| 状态 | 作用 |
|---|---|
| `absent` | 尚未取得。 |
| `resolving` | 正在取得正式 locator/约束。 |
| `transferring` | 正在传输，仍未验证。 |
| `paused` | 可恢复暂停，不等于失败。 |
| `complete` | 传输结束，材料仍须 quarantine/verify。 |
| `failed` | 取得失败，保留安全诊断。 |
| `cancelled` | 用户取消取得；不表示材料已清理。 |

| 成员函数 | 作用 |
|---|---|
| `record_progress(TransferProgress progress)` | 更新同一次取得的有界进度。 |
| `pause(AcquisitionPauseReason reason)` | 标记暂停，不伪造完成。 |
| `complete(LocalMaterialHandle material_handle)` | 只确认传输完成并交给 quarantine。 |
| `fail(AcquisitionFailure failure)` | 保存 redacted 失败姿态。 |

| 工厂函数 | 作用 |
|---|---|
| `start(SelectionBinding selection_binding, AcquisitionTaskId task_id)` | 以 qualified selection 前置创建任务；locator 尚未解析。 |

| 禁止事项 | 说明 |
|---|---|
| complete 不得推出 verified/qualified | 完整性由 `IntegrityPosture` 决定。 |
| 不保存 locator secret 或 raw transport response | 仅持 safe ref/handle。 |

### 6.2.2 MaterialCacheEntry

| 项 | 内容 |
|---|---|
| 所属部分 | Material acquisition and qualification |
| 对象类型 | local entity |
| 主要责任 | 记录本地材料与 immutable source/digest 的绑定、quarantine/qualified 状态和保护引用。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `cache_entry_id` | `CacheEntryId` | 本地 cache 记录标识。 |
| `source_binding` | `MaterialSourceBinding` | release/version/digest/generation 绑定。 |
| `storage_handle` | `LocalMaterialHandle` | 抽象路径/句柄，不暴露原始平台路径。 |
| `integrity_posture_ref` | `IntegrityPostureRef` | 最近验证结果引用。 |
| `state` | `MaterialCacheState` | quarantined/qualified/stale/invalid/evicted；仅表达材料资格/存在生命周期。 |
| `protection_refs` | `ProtectionRefSet` | lease/capture/handoff/retention/orphan 安全引用。 |
| `eviction_candidate` | `EvictionCandidatePosture` | local candidate/not_candidate/unknown；仅是候选观察，删除许可由 `ProtectionGuard` 裁决。 |
| `last_used_at` | `Timestamp` | 淘汰候选输入，不覆盖保护。 |

| 状态 | 作用 |
|---|---|
| `quarantined` | 已取得但未放行。 |
| `qualified` | 验证与当前 authority 均满足，可提交正式运行请求。 |
| `stale` | source/authority freshness 失效，需重验。 |
| `invalid` | digest/signature/platform/source 不匹配。 |
| `evicted` | 本地材料已释放；不改变 Artifact truth。 |

| 成员函数 | 作用 |
|---|---|
| `promote(IntegrityPosture posture, AuthoritySnapshotRef authority_ref)` | 同一 binding 且验证通过后晋级。 |
| `protect(ProtectionRef protection_ref)` | 增加活动保护。 |
| `release_protection(ProtectionRef protection_ref, OwnerConfirmationRef confirmation_ref)` | 仅凭正式解除依据移除保护。 |
| `mark_stale(StaleReason reason)` | 阻止旧材料继续用于新副作用。 |

| 工厂函数 | 作用 |
|---|---|
| `quarantine(MaterialSourceBinding source_binding, LocalMaterialHandle storage_handle)` | 取得完成后创建，初态不得为 qualified。 |

| 禁止事项 | 说明 |
|---|---|
| 不修改/重打包 Release 内容 | cache 只保存本地副本姿态。 |
| 不以磁盘压力绕过 active protection | 清理安全优先。 |

### 6.2.3 IntegrityPosture

| 项 | 内容 |
|---|---|
| 所属部分 | Material acquisition and qualification |
| 对象类型 | local verification record / state object |
| 主要责任 | 记录 owner-provided manifest/digest/signature policy 下的本地验证与平台资格姿态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `posture_id` | `IntegrityPostureId` | 本地验证记录标识。 |
| `source_binding` | `MaterialSourceBinding` | 被验证材料的 immutable 绑定。 |
| `manifest_ref` | `ManifestRef` | 正式 manifest 引用。 |
| `digest_result` | `DigestCheckResult` | 期望与实际内容验证结果，不锁算法。 |
| `signature_result` | `SignatureCheckResult` | 正式 policy 下的签名结果。 |
| `platform_result` | `PlatformCompatibilityResult` | 端侧兼容姿态，不授予 Sandbox policy。 |
| `authority_freshness` | `SourceFreshness` | 启动前 authority 当前性。 |
| `state` | `IntegrityState` | pending/verifying/verified/invalid/stale/blocked。 |

| 状态 | 作用 |
|---|---|
| `pending` | 缺少必要 owner 输入或尚未开始。 |
| `verifying` | 正在验证，不能提交运行。 |
| `verified` | 所有必要检查通过且来源当前。 |
| `invalid` | 内容、签名或平台不匹配。 |
| `stale` | authority/manifest/source freshness 变化。 |
| `blocked` | 合同或可见性不足，无法判断。 |

| 成员函数 | 作用 |
|---|---|
| `record_results(DigestCheckResult digest, SignatureCheckResult signature, PlatformCompatibilityResult platform)` | 组合各检查结果，但不生成 approval。 |
| `assert_qualified(MaterialSourceBinding binding, SourceFreshness freshness)` | 验证同一 source binding 和当前性。 |
| `invalidate(IntegrityInvalidation reason)` | 在 source/authority 变化后禁止复用。 |

| 工厂函数 | 作用 |
|---|---|
| `begin(MaterialSourceBinding source_binding, ManifestRef manifest_ref)` | 从正式 manifest ref 建立 pending posture。 |

| 禁止事项 | 说明 |
|---|---|
| 不自选算法、签名 policy 或补齐缺失 manifest | 这些来自 owner 合同。 |
| verified 不等于 approved/running | 仅表示本地材料验证姿态。 |

#### 6.2.4 本部分对象停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | 三个候选均正式化；progress/qualification secondary views 归 RunnerReadModel。 |
| capability 来源 | 取得、quarantine/cache、完整性与晋级均有独立对象。 |
| 状态边界 | transfer complete、verified、qualified、protection/releasability 未压平；删除资格归 `ProtectionGuard`。 |
| Blocker | `RUN-UP-001/002/008` 继续限制 locator/manifest/policy exact schema 和正向 adapter。 |

## 6.3 Run intent and lifecycle

### 6.3.1 RunIntent

| 项 | 内容 |
|---|---|
| 所属部分 | Run intent and lifecycle |
| 对象类型 | local aggregate |
| 主要责任 | 保存一次与选择、材料和语境绑定的正式运行请求意图及提交姿态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `run_intent_id` | `RunIntentId` | Runner 本地意图标识。 |
| `context_ref` | `RunnerContextRef` | 请求 actor/session/scope 语境。 |
| `selection_binding` | `SelectionBinding` | immutable Release/version/generation。 |
| `material_binding` | `QualifiedMaterialBinding` | qualified cache/digest/posture 引用。 |
| `request_metadata` | `RunnerCommandMetadata` | correlation/idempotency/issued-at 骨架。 |
| `sandbox_request_ref` | `OptionalSandboxRequestRef` | owner 接收后的 safe ref。 |
| `state` | `RunIntentState` | draft/submitting/accepted/rejected/unknown/invalidated。 |

| 状态 | 作用 |
|---|---|
| `draft` | 本地意图已建立，尚未发出。 |
| `submitting` | 正在提交，结果未知前不得重发。 |
| `accepted` | owner 已接收；不表示 boundary/running。 |
| `rejected` | owner 明确拒绝。 |
| `unknown` | 提交结果不可确认，必须 reconcile。 |
| `invalidated` | selection/material/context 绑定已失效。 |

| 成员函数 | 作用 |
|---|---|
| `mark_submitting(RunnerCommandMetadata metadata)` | 固定幂等/correlation 语境，进入提交中。 |
| `record_receipt(SandboxRequestRef request_ref, OwnerReceiptPosture receipt)` | 只记录 owner receipt，不能标记 running。 |
| `mark_unknown(UnknownReason reason)` | 冻结自动重放，要求对账。 |
| `invalidate(BindingMismatch mismatch)` | 阻止失效意图继续推进。 |

| 工厂函数 | 作用 |
|---|---|
| `create(RunnerContextRef context_ref, SelectionBinding selection_binding, QualifiedMaterialBinding material_binding, RunnerCommandMetadata metadata)` | 仅在显式选择与 qualified material 一致时建立。 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 Sandbox boundary、lease 或 execution outcome | 这些只能以 owner ref/projection 进入。 |
| accepted 不得推导 running | Receipt 与 execution 分轴。 |

### 6.3.2 ControlIntent

| 项 | 内容 |
|---|---|
| 所属部分 | Run intent and lifecycle |
| 对象类型 | local entity |
| 主要责任 | 承载 start/stop/cancel/cleanup 等用户控制意图、预期 owner 版本和结果姿态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `control_intent_id` | `ControlIntentId` | 本地控制意图标识。 |
| `run_intent_id` | `RunIntentId` | 所属运行意图。 |
| `kind` | `ControlIntentKind` | start/stop/cancel/cleanup_request。 |
| `expected_owner_basis` | `OwnerStateBasis` | 预期 request/run/lease epoch 骨架。 |
| `metadata` | `RunnerCommandMetadata` | 幂等与 correlation。 |
| `state` | `ControlIntentState` | pending/accepted/confirmed/rejected/unknown/conflict。 |
| `owner_result_ref` | `OptionalControlResultRef` | 正式控制结果引用。 |

| 状态 | 作用 |
|---|---|
| `pending` | 本地已表达意图，结果未确认。 |
| `accepted` | owner 已受理，不等于效果完成。 |
| `confirmed` | 正式 owner result 确认控制效果。 |
| `rejected` | owner 明确拒绝。 |
| `unknown` | 结果不可确认，禁止自动重放。 |
| `conflict` | expected owner basis 不匹配。 |

| 成员函数 | 作用 |
|---|---|
| `record_owner_result(ControlResultRef result_ref, OwnerControlPosture posture)` | 记录正式结果及状态，不推断资源释放。 |
| `mark_conflict(OwnerStateBasis actual_basis)` | 暴露版本/lease 冲突并冻结。 |
| `requires_reconcile()` | 判断 unknown/conflict 是否必须进入恢复流程。 |

| 工厂函数 | 作用 |
|---|---|
| `request(ControlIntentKind kind, RunIntentId run_intent_id, OwnerStateBasis expected_owner_basis, RunnerCommandMetadata metadata)` | 创建单一幂等控制意图。 |

| 禁止事项 | 说明 |
|---|---|
| 不实现 retry/replay policy | 重发策略须在 03 明确且 unknown 默认冻结。 |
| confirmed stop 不自动等于 cleaned | Cleanup 是独立 owner/protection 轴。 |

### 6.3.3 OwnerRunProjection

| 项 | 内容 |
|---|---|
| 所属部分 | Run intent and lifecycle |
| 对象类型 | read projection |
| 主要责任 | 组合 Sandbox/Runtime owner-safe request、boundary、execution、control 和结果引用及 freshness。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `run_intent_id` | `RunIntentId` | 回指本地意图。 |
| `sandbox_request_ref` | `OptionalSandboxRequestRef` | 正式请求引用。 |
| `boundary_ref` | `OptionalBoundaryRef` | 正式边界引用。 |
| `runtime_run_ref` | `OptionalRuntimeRunRef` | 正式执行引用。 |
| `request_posture` | `OwnerRequestPosture` | accepted/pending/rejected/unknown。 |
| `execution_posture` | `OwnerExecutionPosture` | not_started/starting/running/stopping/terminal/unknown。 |
| `control_posture` | `OwnerControlPosture` | 正式控制结果姿态。 |
| `result_refs` | `OwnerResultRefSet` | owner-safe 结果引用集合。 |
| `freshness` | `SourceFreshness` | projection 当前性。 |
| `visibility` | `VisibilityPosture` | partial/restricted/unavailable 等限制。 |

| 成员函数 | 作用 |
|---|---|
| `apply_owner_snapshot(OwnerRunSnapshot snapshot)` | 仅应用正式安全快照，保持各状态轴独立。 |
| `mark_stale(StaleReason reason)` | 暴露旧投影，不回退/改写 owner 状态。 |
| `can_display_running()` | 只有正式 execution posture 支撑时返回真。 |

| 工厂函数 | 作用 |
|---|---|
| `empty(RunIntentId run_intent_id)` | 建立尚无 owner ref 的投影，不能默认 pending/running。 |

| 禁止事项 | 说明 |
|---|---|
| 不从 PID、端口、toast 或本地日志推导 owner posture | Local observation 不是 execution truth。 |
| 不在 query 时刷新或修复 owner | Projection 读取 no-write。 |

#### 6.3.4 本部分对象停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | intent、control、owner projection 三对象均正式化。 |
| capability 来源 | request/control intent 与 lifecycle 展示有独立承载。 |
| 状态边界 | accepted/running/terminal/control/cleanup 未压平。 |
| Blocker | `RUN-UP-003/004/007/008` 限制 exact request/status/control/reconcile 合同。 |

## 6.4 Resource, cleanup and recovery protection

### 6.4.1 ResourceObservation

| 项 | 内容 |
|---|---|
| 所属部分 | Resource, cleanup and recovery protection |
| 对象类型 | local observation value/entity |
| 主要责任 | 保存有 freshness 的端口、路径、磁盘、进程和平台能力观察及冲突影响。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `observation_id` | `ResourceObservationId` | 本地观察标识。 |
| `resource_key` | `ResourceKey` | 脱敏资源键或哈希引用。 |
| `kind` | `ResourceKind` | port/path/disk/process/platform_capability。 |
| `posture` | `LocalResourcePosture` | available/conflict/unknown/unavailable。 |
| `observed_at` | `Timestamp` | 观察时间。 |
| `freshness` | `LocalFreshness` | 本地短时有效性。 |
| `impact` | `ResourceImpact` | 对 preflight/运行/cleanup 的影响。 |

| 成员函数 | 作用 |
|---|---|
| `is_current(ClockSnapshot clock)` | 判断观察是否仍可用于提示，不授予 allocation。 |
| `conflicts_with(OwnerAllocationSnapshot allocation)` | 形成双视图冲突，不覆盖 owner。 |

| 工厂函数 | 作用 |
|---|---|
| `from_probe(ResourceProbeResult result)` | 从平台 adapter 的安全结果构造。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 secret path/body 或任意进程详情 | 只保留最小安全观察。 |
| available 不等于 reserved/leased | 本地 probe 不拥有 allocation。 |

### 6.4.2 ProtectionGuard

| 项 | 内容 |
|---|---|
| 所属部分 | Resource, cleanup and recovery protection |
| 对象类型 | domain guard |
| 主要责任 | 汇总 lease/capture/handoff/retention/orphan 保护，裁决本地材料是否允许释放。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `guard_id` | `ProtectionGuardId` | 本地 guard 标识。 |
| `subject` | `ProtectedSubjectRef` | cache/运行目录/诊断材料引用。 |
| `lease_posture` | `OwnerLeasePosture` | 正式 lease 安全姿态。 |
| `capture_posture` | `CaptureProtectionPosture` | capture 是否完成/受保护。 |
| `handoff_posture` | `HandoffProtectionPosture` | handoff 是否允许释放。 |
| `retention_posture` | `RetentionProtectionPosture` | owner retention 限制。 |
| `orphan_posture` | `OrphanProtectionPosture` | orphan 调查/接管姿态。 |
| `state` | `ProtectionState` | protected/releasable/blocked/unknown。 |

| 状态 | 作用 |
|---|---|
| `protected` | 至少一项活动保护，禁止释放。 |
| `releasable` | 所有必要 owner 依据确认可释放。 |
| `blocked` | 明确阻止清理。 |
| `unknown` | 任一必要依据缺失，保守保护。 |

| 成员函数 | 作用 |
|---|---|
| `evaluate(ProtectionInputs inputs)` | 按全量必要来源保守裁决，不允许缺失默认通过。 |
| `assert_releasable(OwnerCleanupBasis cleanup_basis)` | 校验当前 guard 与 owner cleanup basis 一致。 |

| 工厂函数 | 作用 |
|---|---|
| `protect(ProtectedSubjectRef subject, ProtectionInputs inputs)` | 首次形成 guard；默认 unknown/protected 而非 releasable。 |

| 禁止事项 | 说明 |
|---|---|
| 不以磁盘压力、用户点击或 stop ACK 绕过保护 | 释放需要正式依据。 |

### 6.4.3 RecoveryCase

| 项 | 内容 |
|---|---|
| 所属部分 | Resource, cleanup and recovery protection |
| 对象类型 | local aggregate / recovery state |
| 主要责任 | 承载断线、休眠、重启、source/generation/lease mismatch 后的冻结、对账与 manual-review。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `recovery_case_id` | `RecoveryCaseId` | 本地恢复案例标识。 |
| `subject_refs` | `RecoverySubjectRefSet` | 受影响 selection/run/control/cache refs。 |
| `trigger` | `RecoveryTrigger` | disconnect/suspend/restart/session_expired/source_mismatch/lease_change/gap。 |
| `local_cursor` | `RecoveryCursor` | 本地安全读取进度；不等 owner cursor。 |
| `expected_basis` | `RecoveryExpectedBasis` | generation/source/digest/lease 等预期。 |
| `state` | `RecoveryState` | frozen/querying/reconciled/conflict/manual_review/closed。 |
| `resolution_refs` | `OwnerResolutionRefSet` | 正式只读对账依据。 |

| 状态 | 作用 |
|---|---|
| `frozen` | 危险副作用暂停。 |
| `querying` | 只读获取 owner current state。 |
| `reconciled` | 可证明一致，本地 view 已收敛。 |
| `conflict` | owner/local basis 冲突，仍冻结。 |
| `manual_review` | 无法自动证明，需要人工判断。 |
| `closed` | 已安全收束；不表示 owner 运行成功。 |

| 成员函数 | 作用 |
|---|---|
| `record_snapshot(OwnerRecoverySnapshot snapshot)` | 应用只读 owner 依据。 |
| `reconcile(RecoveryExpectedBasis expected, OwnerRecoverySnapshot actual)` | 只收敛可证明状态，不重放操作。 |
| `require_manual_review(ReconcileFailure reason)` | 标记无法证明的冲突。 |

| 工厂函数 | 作用 |
|---|---|
| `freeze(RecoveryTrigger trigger, RecoverySubjectRefSet subject_refs, RecoveryExpectedBasis expected_basis)` | 进入恢复时立即冻结副作用。 |

| 禁止事项 | 说明 |
|---|---|
| 不推进 owner cursor、不修复 owner truth、不自动 replay | 恢复是 query/reconcile，不是补偿执行器。 |

#### 6.4.4 本部分对象停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | resource observation、guard、recovery 三对象均正式化。 |
| capability 来源 | preflight、保护/cleanup、断线对账均有承载。 |
| 双视图 | local observation 与 owner allocation/lease/cleanup 明确分离。 |
| Blocker | `RUN-UP-003/007/008` 继续限制资源/cleanup exact 合同。 |

## 6.5 Preview, diagnosis and handoff

### 6.5.1 OutputPreview

| 项 | 内容 |
|---|---|
| 所属部分 | Preview, diagnosis and handoff |
| 对象类型 | read projection |
| 主要责任 | 表达带来源、freshness、visibility 和裁剪信息的安全输出预览。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `preview_id` | `OutputPreviewId` | 本地 view 标识。 |
| `source_refs` | `OutputSourceRefSet` | Sandbox/Runtime/Artifact/Observability 安全引用。 |
| `content` | `RedactedBoundedContent` | 已裁剪/脱敏内容，不是 raw body。 |
| `visibility` | `VisibilityPosture` | full/partial/restricted/blocked/unavailable。 |
| `freshness` | `SourceFreshness` | 来源当前性。 |
| `truncation` | `TruncationPosture` | 是否及为何裁剪。 |

| 成员函数 | 作用 |
|---|---|
| `assert_safe(RedactionPolicyRef policy_ref)` | 确认内容已按正式安全边界处理。 |
| `mark_stale(StaleReason reason)` | 暴露旧预览而不刷新/修复 owner。 |

| 工厂函数 | 作用 |
|---|---|
| `compose(SafeOutputMaterial material, RedactionResult redaction, SourceFreshness freshness)` | 仅从 owner-safe material 和 redaction 结果构造。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 raw stdout/stderr、secret 或 Artifact 正文 | Preview 只承载允许摘要。 |
| 不解释为 evidence/report/result truth | 仍是 Runner view。 |

### 6.5.2 FailureDiagnosis

| 项 | 内容 |
|---|---|
| 所属部分 | Preview, diagnosis and handoff |
| 对象类型 | local diagnostic record |
| 主要责任 | 将 owner/local failure 安全映射为来源、影响、分类和下一步，不猜测终态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `diagnosis_id` | `FailureDiagnosisId` | 本地诊断标识。 |
| `subject_refs` | `DiagnosticSubjectRefSet` | 选择、取得、请求、执行、cleanup 等引用。 |
| `source_failures` | `SafeFailureRefSet` | 正式或本地安全失败引用。 |
| `classification` | `FailureClass` | authority/material/resource/request/execution/control/cleanup/connectivity/handoff。 |
| `impact` | `FailureImpact` | 对当前主线和用户动作的影响。 |
| `next_step` | `SafeNextStep` | retry-read/reselect/reverify/reconcile/manual-review/contact-owner 等。 |
| `freshness` | `SourceFreshness` | 诊断依据当前性。 |

| 成员函数 | 作用 |
|---|---|
| `classify(FailureSignals signals)` | 按来源区分失败，不压成 generic error。 |
| `mark_uncertain(UncertaintyReason reason)` | 无足够依据时保留 unknown，不输出 verdict。 |

| 工厂函数 | 作用 |
|---|---|
| `diagnose(DiagnosticSubjectRefSet subjects, FailureSignals signals, RedactionResult redaction)` | 只从安全信号建立本地诊断。 |

| 禁止事项 | 说明 |
|---|---|
| 不修改 source failure 或生成最终 verdict/signoff | 诊断只解释当前可见事实。 |
| 不建议自动 replay unknown side effect | 下一步必须服从恢复保护。 |

### 6.5.3 HandoffPosture

| 项 | 内容 |
|---|---|
| 所属部分 | Preview, diagnosis and handoff |
| 对象类型 | local handoff state object |
| 主要责任 | 跟踪 redacted diagnostic/refs 的交接意图、receipt 和可见性，不迁移证据 ownership。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `handoff_id` | `DiagnosticHandoffId` | 本地 handoff 标识。 |
| `diagnosis_ref` | `FailureDiagnosisRef` | 被交接的本地安全诊断。 |
| `material_refs` | `SafeHandoffMaterialRefSet` | 允许交接的 refs/summary。 |
| `target_ref` | `HandoffTargetRef` | 正式 Observability/Archive 等目标引用。 |
| `state` | `HandoffState` | draft/pending/accepted/blocked/delivered/failed/unknown。 |
| `receipt_ref` | `OptionalHandoffReceiptRef` | 正式 receipt 引用。 |
| `visibility` | `VisibilityPosture` | 交接结果可见性。 |

| 状态 | 作用 |
|---|---|
| `draft` | 本地准备，尚未提交。 |
| `pending` | 已提交，等待 owner receipt。 |
| `accepted` | owner 接收，不等于 evidence/report。 |
| `blocked` | 合同/权限/可见性阻断。 |
| `delivered` | 正式交接 receipt 确认送达；不等 verdict。 |
| `failed` | owner 明确失败。 |
| `unknown` | 结果不可确认，需只读对账。 |

| 成员函数 | 作用 |
|---|---|
| `submit(HandoffCommandMetadata metadata)` | 固定 correlation/idempotency，进入 pending。 |
| `record_receipt(HandoffReceiptRef receipt_ref, OwnerHandoffPosture posture)` | 记录正式 receipt，不创建 evidence。 |
| `mark_unknown(UnknownReason reason)` | 冻结自动重发，交给 reconcile。 |

| 工厂函数 | 作用 |
|---|---|
| `prepare(FailureDiagnosisRef diagnosis_ref, SafeHandoffMaterialRefSet material_refs, HandoffTargetRef target_ref)` | 仅使用 redacted/allowed refs 建立 draft。 |

| 禁止事项 | 说明 |
|---|---|
| accepted/delivered 不得解释为 evidence/verdict/signoff | Handoff 只证明交接姿态。 |
| 不保存原始日志/输出正文 | 材料始终为 safe refs/summary。 |

#### 6.5.4 本部分对象停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | preview、diagnosis、handoff 三对象均正式化。 |
| capability 来源 | 安全预览、失败解释、交接各自承载。 |
| evidence 边界 | local record/receipt 明确非 evidence/report/verdict。 |
| Blocker | `RUN-UP-005/006/008` 限制 diagnostic/handoff/archive exact surface。 |

## 6.6 Entry and presentation composition

### 6.6.1 RunnerReadModel

| 项 | 内容 |
|---|---|
| 所属部分 | Entry and presentation composition |
| 对象类型 | composite read model |
| 主要责任 | 为逻辑页面、CLI 和产品调用方组合六部分的安全、多轴、带来源视图。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `context` | `RunnerContextView` | 当前语境及限制。 |
| `selection` | `SelectionPostureSection` | 显式选择与 authority 姿态。 |
| `material` | `MaterialPostureSection` | 取得、验证、cache 和保护姿态。 |
| `run` | `RunPostureSection` | intent/request/execution/control 独立轴。 |
| `resource_cleanup` | `ResourceCleanupSection` | local probe、owner lease/cleanup 和保护。 |
| `preview_diagnosis` | `PreviewDiagnosisSection` | 安全预览、诊断和 handoff。 |
| `connectivity` | `ConnectivityView` | 连接与恢复姿态。 |
| `source_attribution` | `SourceAttributionSet` | 各 section 的 owner/source/freshness/visibility。 |

| 成员函数 | 作用 |
|---|---|
| `compose(RunnerReadSources sources)` | 纯读取组合各来源，不触发 refresh/repair/side effect。 |
| `redact_for(ActorContext actor, VisibilityContext visibility)` | 按正式可见性裁剪，不补齐缺失。 |

| 工厂函数 | 作用 |
|---|---|
| `unavailable(RunnerContextView context, UnavailableReason reason)` | 显式表示不可用，不返回误导性空成功。 |

| 禁止事项 | 说明 |
|---|---|
| 不持久化为第二 truth、不在 compose 中写入 | View 可重建且 query no-write。 |
| 不用单一 status/success 覆盖各轴 | 页面必须保留来源差异。 |

### 6.6.2 ConnectivityView

| 项 | 内容 |
|---|---|
| 所属部分 | Entry and presentation composition |
| 对象类型 | read projection |
| 主要责任 | 表达 online/degraded/offline/reconnecting/reconciling/manual-review 连接与恢复姿态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `state` | `ConnectivityState` | 当前连接/恢复显示状态。 |
| `observed_at` | `Timestamp` | 本地观察时间。 |
| `affected_sources` | `SourceOwnerSet` | 受影响 owner 集合。 |
| `recovery_case_ref` | `OptionalRecoveryCaseRef` | 关联恢复案例。 |
| `freshness` | `LocalFreshness` | 连接观察有效性。 |

| 状态 | 作用 |
|---|---|
| `online` | 当前连接可用；不证明业务状态 current。 |
| `degraded` | 部分 owner/能力受限。 |
| `offline` | 无法进行所需网络协作。 |
| `reconnecting` | 正在恢复连接，副作用仍冻结。 |
| `reconciling` | 正在只读对账。 |
| `manual_review` | 无法自动证明收敛。 |

| 成员函数 | 作用 |
|---|---|
| `with_recovery(RecoveryCaseRef recovery_case_ref, ConnectivityState state)` | 关联恢复姿态，不更改业务状态。 |
| `affects(SourceOwner source_owner)` | 判断某来源是否受连接限制。 |

| 工厂函数 | 作用 |
|---|---|
| `from_observation(ConnectivityObservation observation)` | 从平台/adapter 安全观察构造。 |

| 禁止事项 | 说明 |
|---|---|
| online 不等于 selection current、running 或 cleaned | 连接轴独立于业务轴。 |

#### 6.6.3 本部分对象停审

| 审查项 | 结论 |
|---|---|
| 候选处理 | `RunnerReadModel` 与 `ConnectivityView` 正式化；页面 presenter/service 留接口/03。 |
| capability 来源 | 多入口组合、连接与恢复展示均有对象。 |
| no-write | compose/redact 只读，不触发刷新或副作用。 |
| 技术中立 | 不绑定 Tauri/Electron/Web/CLI-only。 |

## 7. Step 8 / Step 9 对象反查清单

| 后续处理流 / 状态族 | 必须使用的对象 | 结果 |
|---|---|---|
| context + explicit selection | `RunnerContextRef`、`SelectionGeneration`、`ReleaseSelection` | defined |
| acquisition/cache/integrity | `AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture` | defined |
| run request/control/lifecycle | `RunIntent`、`ControlIntent`、`OwnerRunProjection` | defined |
| resource/preflight/cleanup/recovery | `ResourceObservation`、`ProtectionGuard`、`RecoveryCase` | defined |
| preview/diagnosis/handoff | `OutputPreview`、`FailureDiagnosis`、`HandoffPosture` | defined |
| read composition/connectivity | `RunnerReadModel`、`ConnectivityView` | defined |

## 8. 跨对象 / 跨组成部分一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 对象均有 capability 来源 | pass | 17 对象均回指 Step 5；无临场孤儿对象。 |
| ownership 唯一 | pass | local truth、owner projection、observation、guard、read model 分离。 |
| 状态不压平 | pass | selection/acquisition/integrity/request/control/execution/protection/recovery/handoff/connectivity 独立。 |
| safe refs | pass | typed refs 仅作字段类型，不复制 owner body/lifecycle。 |
| 函数参数类型 | pass | 所有成员/工厂函数参数均带概要类型。 |
| forbidden body | pass | 无 raw output、secret、policy/Release/Project 正文持久对象。 |
| Step 8/9 反查 | pass | 预计流程和状态族均有正式对象定义。 |
| blocker | pass | exact schema/client/algorithm/transport 仍由 `RUN-UP-001~008` 控制。 |

## 9. 回填草稿

正式 §6 先写候选池筛选摘要，再按六个组成部分分别列对象基本信息、关键字段、状态、函数和禁止事项。为了控制正式正文长度，可压缩重复的停审文字，但不得把多个未来代码主体合并成一张无独立责任的总表。

## 10. 待确认事项

- `SelectionBinding`、`MaterialSourceBinding`、各 typed refs 和 command metadata 的完整字段属于 03 shared vocabulary/协议合同，不在 02 展开。
- Owner enum/DTO 值只能在真实合同闭合后映射；当前名称表达 Runner 所需语义，不声明上游 exact schema。
- 本地 operation/history 是否独立持久对象、如何保留 retention，留给 03/04；不得升级为正式审计。

## 11. 进入下一步条件

- [x] 已从 Step 5 候选池筛选并逐组成部分正式化对象。
- [x] 每个对象独立说明责任、关键字段类型、必要状态、函数与禁止事项。
- [x] 每个组成部分完成对象停审，跨对象审计无 unresolved 冲突。
- [x] Step 8/9 预计使用的正式对象均已定义。
- [x] 未写完整 schema、Rust 签名、实现、数据库列或 raw owner DTO。

结论：`gate_status=pass`，允许进入 Step 7“API / 接口骨架”。
