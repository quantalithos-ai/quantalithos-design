# Step 10. 定义状态机与转换矩阵

> 本文件是 `projects/L0-sdk/03-详细设计.md` 的 Step 10 中间产物。
> 本步只收稳 Step 6 已定义状态 enum 的状态集合、状态转换图、转换矩阵、非法转换处理和状态副作用。
> 本步不新增 enum variant，不把 Step 9 中的过程口语升级为正式状态，不定义持久化表或错误码全集。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填，本文件不替代正式详细设计。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 10
- 回填章节：`projects/L0-sdk/03-详细设计.md` §9 状态机与转换矩阵

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已定义 `SnapshotFreshnessState`、`CapabilitySupportState`、`PackageCandidateStatus`、`EvidenceResult`、`EvidenceRedactionStatus`、`CompatibilityDecisionState`、`DeprecatedApiLifecycleState` | 作为状态名和状态集合真相源 |
| `03_ddd_step_09_function_flows.md` §7.7.2 | 已汇总哪些处理流触发哪些状态主语 | 作为状态转换触发来源 |
| `projects/L0-sdk/02-概要设计.md` §9 | 已定义概要状态主语和禁止迁移口径 | 作为上游设计边界 |
| `standards/document/详细设计讨论流程_SOP.md` Step 10 | 要求状态集合表、状态转换图、状态转换矩阵和非法转换处理表 | 作为本步输出结构依据 |
| `standards/document/详细设计书写规范.md` §5.9 | 要求状态名与 enum variant 一致、触发函数可回指对象函数或处理流 | 作为本步格式依据 |

已确认结论：

```text
本步只使用 Step 6 的正式 enum variant。
Step 9 中的 built / artifacts attached / pending 等过程口语不能升级为正式状态。
状态转换触发函数必须回指 Step 6 对象函数或 Step 9 处理流。
Query、runtime boundary 和 outbound event publish 不改写 SDK truth 状态。
```

---

## 3. SOP 问题回答

### 3.1 当前仓有哪些正式状态机？

| 状态机 / 状态集合 | 状态 enum | 拥有对象 | 是否正式状态机 | 说明 |
|---|---|---|---|---|
| 派生视图 freshness | `SnapshotFreshnessState` | `DerivedBindingView` / `LanguageBindingView` | 是 | 判断派生视图能否支撑 candidate |
| 能力支持状态 | `CapabilitySupportState` | `ServiceCapabilityRef` / `ServiceClientView` | 是，轻量状态机 | 判断能力是否可作为正式 SDK 能力暴露 |
| Package candidate 生命周期 | `PackageCandidateStatus` | `PackageCandidate` | 是 | 管理本地 candidate 从草稿到稳定或被替代 |
| Evidence result | `EvidenceResult` | `VerificationEvidence` | 是，结果状态集合 | 表达验证项是否通过，不表达 redaction |
| Evidence redaction | `EvidenceRedactionStatus` | `VerificationEvidence` | 是，安全状态集合 | 表达 evidence 是否可安全引用 |
| Compatibility decision | `CompatibilityDecisionState` | `CompatibilityDecision` | 是 | 判断 candidate 是否可进入 stable 门禁 |
| Deprecated API 生命周期 | `DeprecatedApiLifecycleState` | `DeprecatedApiRecord` | 是 | 管理 API deprecated、移除和替代 |

### 3.2 每个状态机的状态集合是什么？

状态集合在 §7.2~§7.8 分别展开。状态名严格使用 Step 6 enum variant：

```text
SnapshotFreshnessState:
  Fresh / PendingRefresh / Stale / Unsupported / Unknown

CapabilitySupportState:
  Supported / FakeOnly / Pending / Unsupported

PackageCandidateStatus:
  Draft / NotVerified / Failed / Verified / Stable / Superseded

EvidenceResult:
  Passed / Failed / NotVerified / Skipped

EvidenceRedactionStatus:
  Redacted / Unredacted

CompatibilityDecisionState:
  Compatible / RequiresMigration / Breaking / PendingEvidence / Rejected

DeprecatedApiLifecycleState:
  Announced / Deprecated / PendingRemoval / Removed / Superseded
```

### 3.3 哪些函数会触发状态转换？

| 状态主语 | 触发函数 / 处理流 |
|---|---|
| `SnapshotFreshnessState` | `RefreshDerivedBindingViewFlow`、`ConsumeCoreContractChangedFlow`、`ConsumeBusSemanticChangedFlow`、`ConsumeFormalApiChangedFlow`、`CheckUpstreamFreshnessFlow` |
| `CapabilitySupportState` | `RefreshDerivedBindingViewFlow`、`ServiceCapabilityRef.derive_support(...)`、`InvokeServiceCapabilityFlow` 只读校验 |
| `PackageCandidateStatus` | `GeneratePackageCandidateFlow`、`BuildLanguagePackagesFlow`、`RunCrossLanguageSmokeFlow`、`ValidateDocsExamplesFlow`、`VerifyBoundaryPoliciesFlow`、`CheckCompatibilityFlow` |
| `EvidenceResult` | `ConsumeValidationRunFinishedFlow`、`RunCrossLanguageSmokeFlow`、`ValidateDocsExamplesFlow`、`VerifyBoundaryPoliciesFlow` |
| `EvidenceRedactionStatus` | `VerificationEvidence::from_runner_result(...)`、`VerificationEvidence.assert_redacted()` |
| `CompatibilityDecisionState` | `RecordCompatibilityDecisionFlow`、`CheckCompatibilityFlow` |
| `DeprecatedApiLifecycleState` | `DeprecateSdkApiFlow`、`DeprecatedApiRecord.mark_deprecated(...)`、`schedule_removal(...)`、`mark_removed(...)` |

### 3.4 每个转换的前置条件、副作用和错误是什么？

回答：见 §7.2~§7.8 的转换矩阵。每个转换至少包含：

- From 状态必须匹配。
- 触发处理流必须已经完成 Step 8 DTO 校验和 Step 7 port lookup。
- 状态推进必须由 domain method 或 application service 调 domain object 完成。
- 非法迁移返回 `SdkDomainError::InvalidStateTransition` 或更具体错误。

### 3.5 非法转换应该返回什么错误，是否写审计？

| 非法类型 | 错误类型 | 是否写审计 / 事件 |
|---|---|---|
| 状态来源不匹配 | `SdkDomainError::InvalidStateTransition` | 写路径可写 conflict audit，不写成功 event |
| 终态 reopen | `SdkDomainError::TerminalStateReopenRejected` | 可写 conflict audit |
| fake / unredacted / failed evidence 试图支撑 stable | `SdkDomainError::CandidateGateRejected` | 必须写 gate failure evidence 或 audit |
| `RequiresMigration` 缺 migration ref | `SdkDomainError::MigrationGuideRequired` | 写 validation failure，不写 compatibility success event |
| removed API 重新启用 | `SdkDomainError::RemovedApiReopenRejected` | 可写 conflict audit |
| projection / query / runtime boundary 试图改状态 | `SdkDomainError::ReadOnlyFlowStateMutationRejected` | 必须写边界违规 audit |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| Step 9 | 出现 `built`、`artifacts attached` 等过程口语 | 容易被误写成 `PackageCandidateStatus::Built` | 本步明确它们是过程条件，不是 enum variant |
| Step 9 | `Pending` 可能被用于 freshness 口语 | 与正式 `PendingRefresh` 不一致 | 本步 freshness 只使用 `PendingRefresh` |
| Evidence | result 与 redaction 是两个维度 | 容易把 `Redacted` 当成 `Passed` | 本步拆开两张矩阵，并定义组合门禁 |
| Compatibility | `RequiresMigration` 需要 migration ref | 实现可能只写状态不校验引用 | 本步在矩阵中写前置条件 |
| Runtime boundary | `InvokeServiceCapability` / `PublishBusEvent` 有调用结果 | 可能误改 SDK truth 状态 | 本步明确两者不触发本地状态迁移 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 状态名 | 分散在 Step 6 enum 和 Step 9 流程口语中 | 全部收敛为 Step 6 enum variant | 防止测试 / 实现使用旧口语 |
| 状态图 | 只有对象允许来源 / 去向 | 每个状态主语都有 ASCII 图 | 支撑实现和 review |
| 状态矩阵 | 只在 enum 表中简写 | 每个转换写触发函数、前置条件、副作用和非法错误 | 支撑状态校验代码 |
| Candidate built | 可能被误解为正式状态 | 明确为 artifact attached 条件，不是状态 | 不新增 enum |
| Evidence | result / redaction 容易混合 | 分开状态集合和组合门禁 | redacted 不是 passed |
| Query / boundary | 可能隐式改状态 | 明确禁止状态副作用 | 保持 SDK truth 边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：根据 Step 9 新增 `Built`、`Validating` 等 candidate 状态 | 看起来贴近过程 | 暗改 Step 6 enum，扩大实现状态机 | 不采用 |
| 方案 B：只使用 Step 6 enum，把 built / validating 表达为过程条件或 evidence 集合 | 状态集合稳定，避免漂移 | 部分 job 需要读 evidence / artifact 条件判断 | 采用 |
| 方案 C：把 EvidenceResult 和 EvidenceRedactionStatus 合并 | 门禁判断短 | 会把 redacted 误读为 passed | 不采用 |
| 方案 D：把 Query stale 自动改成 Fresh | 用户体验简单 | Query 产生隐藏写副作用 | 不采用 |

推荐方案：方案 B，并保持 evidence result / redaction 双维度。

原因：

- Step 10 的职责是收稳现有状态机，不是重新设计对象模型。
- Candidate 是否可 stable 由 candidate status、evidence result、redaction status 和 compatibility decision 共同决定。
- query、runtime boundary 和 outbox publish 必须保持无 truth 状态副作用。

---

## 7. 结构化中间产物

### 7.1 状态机总览

| 状态主语 | 状态 enum | 拥有对象 | 主要触发流 | 是否影响 SDK truth |
|---|---|---|---|---|
| 派生视图 freshness | `SnapshotFreshnessState` | `DerivedBindingView` / `LanguageBindingView` | refresh、upstream consumer、freshness job | 是 |
| 能力支持状态 | `CapabilitySupportState` | `ServiceCapabilityRef` / `ServiceClientView` | refresh / formal API derivation | 是 |
| Package candidate 生命周期 | `PackageCandidateStatus` | `PackageCandidate` | candidate / build / validation / compatibility jobs | 是 |
| Evidence result | `EvidenceResult` | `VerificationEvidence` | runner / validation consumer | 是 |
| Evidence redaction | `EvidenceRedactionStatus` | `VerificationEvidence` | runner / policy verifier | 是 |
| Compatibility decision | `CompatibilityDecisionState` | `CompatibilityDecision` | compatibility command / job | 是 |
| Deprecated API 生命周期 | `DeprecatedApiLifecycleState` | `DeprecatedApiRecord` | deprecate command | 是 |

### 7.2 `SnapshotFreshnessState` 状态机

#### 7.2.1 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Fresh` | 已对齐当前已知上游版本，可用于 candidate | 否 | candidate generation、mark stale、mark pending refresh |
| `PendingRefresh` | 已发现上游变化，等待刷新或验证 | 否 | refresh view、mark unsupported、mark stale |
| `Stale` | 本地派生视图落后于上游版本 | 否 | refresh view、mark pending refresh |
| `Unsupported` | 上游变化无法派生或不进入 SDK 范围 | 否 | mark pending refresh after scope change |
| `Unknown` | 初始或无法确认上游版本 | 否 | check freshness、mark pending refresh、mark fresh、mark unsupported |

#### 7.2.2 状态转换图

```text
Unknown
  | CheckUpstreamFreshness / RefreshDerivedBindingView
  v
PendingRefresh
  | refresh succeeds
  v
Fresh

Fresh
  | ConsumeCoreContractChanged / ConsumeBusSemanticChanged / ConsumeFormalApiChanged
  v
PendingRefresh
  | source comparison confirms local view behind
  v
Stale
  | refresh succeeds
  v
Fresh

PendingRefresh
  | change out of SDK scope
  v
Unsupported
  | scope / source later supported
  v
PendingRefresh
```

关键说明：

- 只有 `Fresh` 可支撑 `GeneratePackageCandidateFlow`。
- `Unsupported` 是显式裁剪，不等于 `Fresh`。
- `Unknown` 和 `Stale` 都必须阻断 verified / stable。

#### 7.2.3 状态转换矩阵

| From | To | 触发函数 / 处理流 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `Unknown` | `PendingRefresh` | `CheckUpstreamFreshnessFlow` | source latest version 可读取但本地未确认 | 记录 pending refresh | `SdkDomainError::InvalidStateTransition` |
| `Unknown` | `Fresh` | `RefreshDerivedBindingViewFlow` | source snapshot 已读取并派生成功 | 保存 derived view / language view | `SdkDomainError::FreshnessCheckFailed` |
| `Unknown` | `Unsupported` | `RefreshDerivedBindingViewFlow` | 上游变化明确不进入 SDK 范围 | 保存 unsupported reason | `SdkDomainError::UnsupportedScopeMissingReason` |
| `Fresh` | `PendingRefresh` | upstream changed consumer | 新上游 ref 已消费 | 写 freshness changed event | `SdkDomainError::InvalidStateTransition` |
| `Fresh` | `Stale` | `CheckUpstreamFreshnessFlow` | latest ref 比本地 ref 更新 | 标记 candidate blocked | `SdkDomainError::InvalidStateTransition` |
| `PendingRefresh` | `Fresh` | `RefreshDerivedBindingViewFlow` | snapshot 派生成功、digest 匹配 | 保存 view / version ref / outbox | `SdkDomainError::SnapshotDerivationFailed` |
| `PendingRefresh` | `Stale` | `CheckUpstreamFreshnessFlow` | pending 时间或版本落后已确认 | 标记 stale reason | `SdkDomainError::InvalidStateTransition` |
| `PendingRefresh` | `Unsupported` | `RefreshDerivedBindingViewFlow` | source 在当前 SDK 范围外 | 保存 unsupported reason | `SdkDomainError::UnsupportedScopeMissingReason` |
| `Stale` | `PendingRefresh` | `RefreshDerivedBindingViewFlow` | 开始处理 stale view | 记录 refresh attempt | `SdkDomainError::InvalidStateTransition` |
| `Stale` | `Fresh` | `RefreshDerivedBindingViewFlow` | refresh 成功 | 保存 fresh view | `SdkDomainError::SnapshotDerivationFailed` |
| `Unsupported` | `PendingRefresh` | scope / source support changed | 原 unsupported reason 已失效 | 重新进入 refresh 等待 | `SdkDomainError::InvalidStateTransition` |

#### 7.2.4 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `Stale` / `PendingRefresh` / `Unknown` 支撑 candidate stable | 返回 `SdkDomainError::CandidateGateRejected` | 写 gate failure evidence |
| `Unsupported -> Fresh` 直接跳转 | 必须先进入 `PendingRefresh` 并完成 refresh | 可写 conflict audit |
| Query 将 stale 自动修成 fresh | 返回 `ReadOnlyFlowStateMutationRejected` | 必须写边界违规 audit |

### 7.3 `CapabilitySupportState` 状态机

#### 7.3.1 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Supported` | 能力具备正式 API，可进入 SDK candidate | 否 | use in candidate、downgrade to pending / unsupported |
| `FakeOnly` | 只能通过 fake / fixture 验证，不得宣称生产可用 | 否 | verify fake marker、promote to supported if formal API exists |
| `Pending` | 能力边界或上游契约尚未确认 | 否 | derive support、mark fake-only、mark unsupported |
| `Unsupported` | 能力明确不进入当前 SDK 范围 | 否 | re-open to pending / fake-only after scope change |

#### 7.3.2 状态转换图

```text
Pending
  | formal API confirmed
  v
Supported

Pending
  | only fake / fixture available
  v
FakeOnly
  | formal API later confirmed
  v
Supported

Pending
  | out of scope
  v
Unsupported
  | scope changes
  v
Pending
```

关键说明：

- `FakeOnly` 可以证明最小接入，但不能支撑 production supported。
- `Supported` 必须有 formal API 或等价正式边界引用。
- `InvokeServiceCapabilityFlow` 只读取和校验该状态，不负责写状态。

#### 7.3.3 状态转换矩阵

| From | To | 触发函数 / 处理流 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `Pending` | `Supported` | `ServiceCapabilityRef.derive_support(...)` / `RefreshDerivedBindingViewFlow` | formal API ref 可用且 boundary policy 通过 | capability 可进入 candidate | `SdkDomainError::FormalApiRefRequired` |
| `Pending` | `FakeOnly` | `ServiceCapabilityRef.derive_support(...)` | 只有 fake / fixture ref 可用 | 标记 fake-only，阻断 stable | `SdkDomainError::FakeBoundaryRefRequired` |
| `Pending` | `Unsupported` | `ServiceCapabilityRef.derive_support(...)` | 明确不在 SDK 范围 | 保存 unsupported reason | `SdkDomainError::UnsupportedScopeMissingReason` |
| `FakeOnly` | `Supported` | `RefreshDerivedBindingViewFlow` | formal API ref 后续可用 | 去除 fake-only 阻断 | `SdkDomainError::FormalApiRefRequired` |
| `FakeOnly` | `Unsupported` | `RefreshDerivedBindingViewFlow` | fake 能力不再进入 SDK 范围 | 保存 unsupported reason | `SdkDomainError::InvalidStateTransition` |
| `Supported` | `Pending` | upstream formal API changed | 支持状态需重新确认 | 阻断 candidate stable | `SdkDomainError::InvalidStateTransition` |
| `Supported` | `Unsupported` | scope decision changed | 能力被裁剪且有 reason | 从 exposed capability 移除 | `SdkDomainError::UnsupportedScopeMissingReason` |
| `Unsupported` | `Pending` | scope decision changed | 允许重新评估能力 | 等待 derive support | `SdkDomainError::InvalidStateTransition` |
| `Unsupported` | `FakeOnly` | scope decision changed + fake available | fake marker 可验证 | 进入 fake-only 验证 | `SdkDomainError::FakeBoundaryRefRequired` |

#### 7.3.4 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `FakeOnly` 被当成 `Supported` | 返回 `SdkDomainError::FakeOnlyCapabilityCannotStabilize` | 写 gate failure evidence |
| `Unsupported -> Supported` 直接跳转 | 必须先进入 `Pending` 或 `FakeOnly` 重新评估 | 可写 conflict audit |
| 没有 formal API ref 进入 `Supported` | 返回 `FormalApiRefRequired` | 写 validation failure |

### 7.4 `PackageCandidateStatus` 状态机

#### 7.4.1 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Draft` | candidate 已创建但尚未完成验证 | 否 | attach artifacts、run validation、mark not verified / failed / verified |
| `NotVerified` | 存在未验证能力、fake-only 能力或缺失证据 | 否 | run evidence jobs、mark verified / failed / superseded |
| `Failed` | candidate 验证失败 | 否 | supersede |
| `Verified` | 已通过当前 P0 验证 | 否 | compatibility gate、mark stable / not verified / failed / superseded |
| `Stable` | 已通过验证、兼容和文档门禁，成为本地稳定基线 | 否 | supersede |
| `Superseded` | 已被后续候选替代 | 是 | read only |

#### 7.4.2 状态转换图

```text
Draft
  | artifacts attached but evidence incomplete
  v
NotVerified
  | all required evidence Passed + Redacted
  v
Verified
  | compatibility Compatible / RequiresMigration with migration ref
  v
Stable
  | newer candidate selected
  v
Superseded

Draft
  | validation failed
  v
Failed
  | newer candidate selected
  v
Superseded

Verified
  | upstream becomes stale / evidence invalidated
  v
NotVerified

Verified
  | later validation failed
  v
Failed
```

关键说明：

- `Built` 不是正式状态；构建完成只表现为 artifact refs 已附加，通常使 `Draft -> NotVerified`。
- `Stable` 不等于 public registry publish。
- `Superseded` 是终态，不得 reopen。

#### 7.4.3 状态转换矩阵

| From | To | 触发函数 / 处理流 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `New` | `Draft` | `PackageCandidate::create_candidate(...)` / `GeneratePackageCandidateFlow` | freshness 为 `Fresh`；language set 完整 | 创建 candidate | `SdkDomainError::CandidateGateRejected` |
| `Draft` | `NotVerified` | `BuildLanguagePackagesFlow` | artifacts attached，但 evidence 不完整或含 fake-only 能力 | 保存 artifact refs | `SdkDomainError::InvalidStateTransition` |
| `Draft` | `Verified` | validation jobs | 所有必需 evidence `Passed` 且 `Redacted` | candidate 可进入 compatibility gate | `SdkDomainError::EvidenceGateRejected` |
| `Draft` | `Failed` | validation jobs | 任一 required evidence `Failed` | 保存 failed evidence | `SdkDomainError::InvalidStateTransition` |
| `Draft` | `Superseded` | supersede operation / newer candidate | 有替代 candidate ref | 标记历史候选 | `SdkDomainError::SupersedeRefRequired` |
| `NotVerified` | `Verified` | validation jobs | 所有 required evidence `Passed` 且 `Redacted` | candidate 可进入 compatibility gate | `SdkDomainError::EvidenceGateRejected` |
| `NotVerified` | `Failed` | validation jobs | required evidence failed | 保存 failed reason | `SdkDomainError::InvalidStateTransition` |
| `NotVerified` | `Superseded` | supersede operation / newer candidate | 有替代 candidate ref | 标记历史候选 | `SdkDomainError::SupersedeRefRequired` |
| `Verified` | `Stable` | `CheckCompatibilityFlow` | compatibility `Compatible` 或 `RequiresMigration` 且 migration ref 存在；docs evidence passed | 形成本地 stable baseline | `SdkDomainError::CompatibilityGateRejected` |
| `Verified` | `NotVerified` | upstream changed consumer / evidence invalidation | freshness 不再 `Fresh` 或 evidence 被判无效 | 阻断 stable | `SdkDomainError::InvalidStateTransition` |
| `Verified` | `Failed` | validation rerun | required evidence failed | 保存 failed reason | `SdkDomainError::InvalidStateTransition` |
| `Verified` | `Superseded` | supersede operation / newer candidate | 有替代 candidate ref | 标记历史候选 | `SdkDomainError::SupersedeRefRequired` |
| `Failed` | `Superseded` | supersede operation / newer candidate | 有替代 candidate ref | 标记历史候选 | `SdkDomainError::SupersedeRefRequired` |
| `Stable` | `Superseded` | newer stable candidate selected | 有替代 stable candidate ref | 当前 stable 进入历史 | `SdkDomainError::SupersedeRefRequired` |

#### 7.4.4 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `NotVerified` / `Failed` 直接进入 `Stable` | 返回 `CandidateGateRejected` | 必须写 gate failure evidence |
| `Draft` 因 artifact attached 进入 `Built` | 禁止；`Built` 不是 enum variant，应保持 `Draft` 或进入 `NotVerified` | 写实现复核问题 |
| `Superseded -> *` | 返回 `TerminalStateReopenRejected` | 可写 conflict audit |
| `Stable` 被 public registry publish 反向决定 | 禁止；public publish 不在 P0 状态机内 | 写边界违规 audit |

### 7.5 `EvidenceResult` 与 `EvidenceRedactionStatus` 状态集合

#### 7.5.1 `EvidenceResult` 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `NotVerified` | 验证项尚未执行或无结论 | 否 | run validation、skip by scope |
| `Passed` | 验证项通过 | 否 | rerun may fail |
| `Failed` | 验证项失败 | 是 | read only、supersede by new evidence item |
| `Skipped` | 验证项因范围裁剪被跳过 | 是 | read only |

#### 7.5.2 `EvidenceResult` 状态转换图

```text
NotVerified
  | runner passed
  v
Passed
  | rerun failed
  v
Failed

NotVerified
  | runner failed
  v
Failed

NotVerified
  | scope explicitly skipped
  v
Skipped
```

#### 7.5.3 `EvidenceResult` 转换矩阵

| From | To | 触发函数 / 处理流 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `NotVerified` | `Passed` | validation jobs / `ConsumeValidationRunFinishedFlow` | runner result passed | evidence 可参与 candidate gate | `SdkDomainError::EvidenceResultInvalid` |
| `NotVerified` | `Failed` | validation jobs / `ConsumeValidationRunFinishedFlow` | runner result failed | candidate gate blocked | `SdkDomainError::EvidenceResultInvalid` |
| `NotVerified` | `Skipped` | scope decision | validation out of P0 scope and reason present | 明确裁剪，不支撑 passed | `SdkDomainError::SkippedEvidenceReasonRequired` |
| `Passed` | `Failed` | validation rerun | rerun failed and supersedes previous check | candidate may fall back to failed / not verified | `SdkDomainError::EvidenceResultInvalid` |

#### 7.5.4 `EvidenceRedactionStatus` 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Unredacted` | 证据尚未脱敏或脱敏失败 | 否 | redact evidence |
| `Redacted` | 证据已脱敏，可被安全引用 | 是 | read only |

#### 7.5.5 `EvidenceRedactionStatus` 状态转换图

```text
Unredacted
  | redaction succeeds
  v
Redacted
```

#### 7.5.6 `EvidenceRedactionStatus` 转换矩阵

| From | To | 触发函数 / 处理流 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `Unredacted` | `Redacted` | `VerificationEvidence.assert_redacted()` / boundary verifier | raw body / secret 已移除，只保留 ref / digest | evidence 可安全引用 | `SdkDomainError::EvidenceRedactionFailed` |

#### 7.5.7 Evidence 组合门禁

| `EvidenceResult` | `EvidenceRedactionStatus` | 是否可支撑 candidate `Verified` / `Stable` | 说明 |
|---|---|---|---|
| `Passed` | `Redacted` | 是 | 唯一可支撑门禁的组合 |
| `Passed` | `Unredacted` | 否 | 通过但不安全引用 |
| `Failed` | 任意 | 否 | 失败阻断 |
| `NotVerified` | 任意 | 否 | 无结论阻断 |
| `Skipped` | 任意 | 否 | 显式裁剪不能当作通过 |

#### 7.5.8 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `Skipped` 当作 `Passed` | 返回 `EvidenceGateRejected` | 写 gate failure evidence |
| `Redacted` 当作验证通过 | 返回 `EvidenceGateRejected` | 写 gate failure evidence |
| `Failed -> Passed` 改写同一 evidence | 禁止；必须创建新的 evidence item | 可写 conflict audit |

### 7.6 `CompatibilityDecisionState` 状态机

#### 7.6.1 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `PendingEvidence` | 兼容性证据不足 | 否 | run compatibility check、record decision |
| `Compatible` | 不破坏既有 SDK 使用方 | 否 | allow stable、later reject / breaking if new evidence appears |
| `RequiresMigration` | 需要使用方按迁移说明调整 | 否 | allow stable only with migration ref |
| `Breaking` | 构成 breaking change | 是 | read only / supersede by new decision item |
| `Rejected` | 候选变化被兼容治理拒绝 | 是 | read only / supersede by new decision item |

#### 7.6.2 状态转换图

```text
PendingEvidence
  | evidence sufficient and no break
  v
Compatible

PendingEvidence
  | evidence sufficient and migration needed
  v
RequiresMigration

PendingEvidence
  | breaking detected
  v
Breaking

PendingEvidence
  | governance rejected
  v
Rejected

Compatible
  | later breaking evidence
  v
Breaking

Compatible / RequiresMigration
  | governance rejected
  v
Rejected
```

#### 7.6.3 状态转换矩阵

| From | To | 触发函数 / 处理流 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `PendingEvidence` | `Compatible` | `CompatibilityDecision::record(...)` / `CheckCompatibilityFlow` | required evidence passed + redacted；no breaking change | candidate 可进入 stable gate | `SdkDomainError::EvidenceGateRejected` |
| `PendingEvidence` | `RequiresMigration` | `CompatibilityDecision::record(...)` / `CheckCompatibilityFlow` | evidence sufficient；migration ref present | candidate 可有条件 stable | `SdkDomainError::MigrationGuideRequired` |
| `PendingEvidence` | `Breaking` | `CompatibilityDecision::record(...)` / `CheckCompatibilityFlow` | breaking detected | candidate stable blocked | `SdkDomainError::InvalidStateTransition` |
| `PendingEvidence` | `Rejected` | `CompatibilityDecision::record(...)` | governance reject reason present | candidate stable blocked | `SdkDomainError::RejectReasonRequired` |
| `Compatible` | `Breaking` | compatibility rerun | later evidence shows breaking | candidate may lose stable eligibility | `SdkDomainError::InvalidStateTransition` |
| `Compatible` | `Rejected` | governance decision | reject reason present | candidate stable blocked | `SdkDomainError::RejectReasonRequired` |
| `RequiresMigration` | `Breaking` | compatibility rerun | later evidence shows breaking | migration path insufficient | `SdkDomainError::InvalidStateTransition` |
| `RequiresMigration` | `Rejected` | governance decision | reject reason present | candidate stable blocked | `SdkDomainError::RejectReasonRequired` |

#### 7.6.4 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `RequiresMigration` 无 migration ref | 返回 `MigrationGuideRequired` | 写 validation failure |
| `Breaking` / `Rejected` 进入 candidate `Stable` | 返回 `CompatibilityGateRejected` | 必须写 gate failure evidence |
| `Breaking -> Compatible` 改写同一 decision | 禁止；必须创建新 decision | 可写 conflict audit |

### 7.7 `DeprecatedApiLifecycleState` 状态机

#### 7.7.1 状态集合

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Announced` | 已发布 deprecated 通知但仍可用 | 否 | mark deprecated、supersede |
| `Deprecated` | API 已正式 deprecated | 否 | schedule removal、supersede |
| `PendingRemoval` | API 已进入计划移除窗口 | 否 | mark removed、supersede |
| `Removed` | API 已从 SDK 中移除 | 是 | read only |
| `Superseded` | 记录已被新方案或新决策覆盖 | 是 | read only |

#### 7.7.2 状态转换图

```text
Announced
  | mark_deprecated(migration_ref, now)
  v
Deprecated
  | schedule_removal(removal_plan, now)
  v
PendingRemoval
  | mark_removed(now)
  v
Removed

Announced / Deprecated / PendingRemoval
  | supersede(new_record_ref)
  v
Superseded
```

#### 7.7.3 状态转换矩阵

| From | To | 触发函数 / 处理流 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| `New` | `Announced` | `DeprecatedApiRecord::announce(...)` / `DeprecateSdkApiFlow` | api ref 存在；announcement reason present | 创建 deprecated record | `SdkDomainError::DeprecatedReasonRequired` |
| `Announced` | `Deprecated` | `mark_deprecated(MigrationGuideRef migration_ref, Timestamp now)` | migration ref present | API 标记 deprecated | `SdkDomainError::MigrationGuideRequired` |
| `Announced` | `Superseded` | supersede operation | replacement ref present | 历史记录归档 | `SdkDomainError::SupersedeRefRequired` |
| `Deprecated` | `PendingRemoval` | `schedule_removal(RemovalPlan removal_plan, Timestamp now)` | removal plan present | 进入移除窗口 | `SdkDomainError::RemovalPlanRequired` |
| `Deprecated` | `Superseded` | supersede operation | replacement ref present | 历史记录归档 | `SdkDomainError::SupersedeRefRequired` |
| `PendingRemoval` | `Removed` | `mark_removed(Timestamp now)` | removal window satisfied | API 不再可用 | `SdkDomainError::RemovalWindowNotSatisfied` |
| `PendingRemoval` | `Superseded` | supersede operation | replacement ref present | 历史记录归档 | `SdkDomainError::SupersedeRefRequired` |

#### 7.7.4 非法转换处理

| 非法转换 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|
| `Announced -> PendingRemoval` | 返回 `InvalidStateTransition`，必须先 `Deprecated` | 可写 conflict audit |
| `Announced -> Removed` / `Deprecated -> Removed` | 返回 `InvalidStateTransition` | 可写 conflict audit |
| `Removed -> *` | 返回 `RemovedApiReopenRejected` | 可写 conflict audit |
| `Superseded -> *` | 返回 `TerminalStateReopenRejected` | 可写 conflict audit |

### 7.8 跨状态门禁

| 门禁 | 必须满足 | 不满足时错误 |
|---|---|---|
| 生成 candidate | `SnapshotFreshnessState::Fresh`；required capabilities 不为 `Unsupported` | `CandidateGateRejected` |
| candidate 进入 `Verified` | required `EvidenceResult::Passed` 且 `EvidenceRedactionStatus::Redacted` | `EvidenceGateRejected` |
| candidate 进入 `Stable` | candidate `Verified`；compatibility `Compatible` 或 `RequiresMigration` + migration ref；docs evidence passed/redacted | `CompatibilityGateRejected` |
| fake-only 能力进入 stable | 不允许，除非后续变为 `Supported` | `FakeOnlyCapabilityCannotStabilize` |
| deprecated API removed | 必须经过 `Announced -> Deprecated -> PendingRemoval` | `InvalidStateTransition` |

### 7.9 Step 10 统一复核

#### 7.9.1 enum 覆盖复核

| Step 6 enum | 是否覆盖 | 说明 |
|---|---|---|
| `SnapshotFreshnessState` | 是 | §7.2 |
| `CapabilitySupportState` | 是 | §7.3 |
| `PackageCandidateStatus` | 是 | §7.4 |
| `EvidenceResult` | 是 | §7.5.1~§7.5.3 |
| `EvidenceRedactionStatus` | 是 | §7.5.4~§7.5.6 |
| `CompatibilityDecisionState` | 是 | §7.6 |
| `DeprecatedApiLifecycleState` | 是 | §7.7 |

#### 7.9.2 过程口语收敛复核

| 过程口语 | 正式处理 |
|---|---|
| `built` / `Built` | 不是 `PackageCandidateStatus`，只能表达 artifact 已附加；状态保持 `Draft` 或进入 `NotVerified` |
| `validating` / `Validated` | 不是正式状态，由 evidence 集合和 job 运行中状态表达 |
| `pending` freshness | 正式状态名是 `PendingRefresh` |
| `redacted passed` | 必须拆成 `EvidenceResult::Passed` + `EvidenceRedactionStatus::Redacted` |
| `public released` | 不在 P0 candidate 状态机内；`Stable` 不等于 public registry publish |

#### 7.9.3 禁止漂移复核

| 禁止漂移项 | 本 Step 固定口径 |
|---|---|
| 新增 enum variant | 禁止；必须回到 Step 6 |
| Query / projection rebuild 反写真相状态 | 禁止 |
| Runtime boundary 改写 SDK truth 状态 | 禁止 |
| FakeOnly 支撑 Stable | 禁止 |
| Skipped evidence 当作 Passed | 禁止 |
| Removed / Superseded reopen | 禁止 |
| Public registry publish 反向决定 Stable | 禁止 |

---

## 8. 回填草稿

正式 `projects/L0-sdk/03-详细设计.md` 回填时，§9 应按以下方式引用本文件：

| 正式章节 | 回填来源 | 回填方式 |
|---|---|---|
| §9.1 状态机总览 | 本文件 §7.1 | 摘录状态主语、enum、拥有对象和触发流 |
| §9.2 Freshness 状态机 | 本文件 §7.2 | 摘录状态集合、ASCII 图、矩阵和非法处理 |
| §9.3 Capability support 状态机 | 本文件 §7.3 | 摘录状态集合、ASCII 图、矩阵和非法处理 |
| §9.4 Candidate 状态机 | 本文件 §7.4 | 摘录状态集合、ASCII 图、矩阵和非法处理 |
| §9.5 Evidence 状态集合 | 本文件 §7.5 | 摘录 result / redaction 双矩阵和组合门禁 |
| §9.6 Compatibility 状态机 | 本文件 §7.6 | 摘录状态集合、ASCII 图、矩阵和非法处理 |
| §9.7 Deprecated API 生命周期 | 本文件 §7.7 | 摘录状态集合、ASCII 图、矩阵和非法处理 |
| §9.8 跨状态门禁 | 本文件 §7.8 | 摘录 candidate / evidence / compatibility / deprecated gate |
| §11 错误模型 | 本文件各非法转换错误 | 作为 Step 12 输入 |
| §15 测试切口 | 本文件非法转换和 gate | 作为 Step 16 输入 |

回填规则：

- 正式文档必须使用本文件中的状态名，不得继续使用 `built`、`validating`、`pending` freshness 等口语状态。
- 如果后续 Step 11 或 Step 12 发现某状态转换需要新增状态，必须回到 Step 6 重改 enum，再重跑本 Step。
- 测试方案、验收标准和实施计划必须使用本文件中的 enum variant 名称。

---

## 9. 待确认事项

| 待确认项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| candidate 是否新增 `Built` 状态 | A. 新增；B. 不新增，作为 artifact attached 条件 | 推荐 B | Step 6 enum 未定义 `Built`，新增会扩大状态机；artifact 条件足以支撑实现 |
| Evidence result 与 redaction 是否合并 | A. 合并；B. 拆分 | 推荐 B | `Redacted` 不等于 `Passed`，拆分可避免错误门禁 |
| Query 是否可自动刷新 stale view | A. 可以；B. 禁止，只返回 stale marker | 推荐 B | Query 不应有隐藏写副作用 |
| `Stable` 是否等同 public registry publish | A. 等同；B. 不等同 | 推荐 B | P0 不做 public registry 发布，`Stable` 只是本地稳定基线 |
| `Unsupported -> Supported` 是否允许直接跳 | A. 允许；B. 禁止，先进入 `Pending` / `FakeOnly` 重评估 | 推荐 B | 需要重新验证 scope、formal API 和 fake marker |

当前推荐方案已写入本 Step。若后续需要改变任一结论，必须回到 Step 6 / Step 9 同步修正。

---

## 10. 进入下一步条件

进入 Step 11 的条件：

- Step 6 的所有状态 enum 已全部覆盖。
- 每个状态机都有状态集合、ASCII 图、转换矩阵和非法转换处理。
- Step 9 中的过程口语已经收敛到正式 enum variant。
- 状态副作用和跨状态门禁已经足够支撑事务与一致性设计。

下一步：

```text
Step 11. 定义持久化、事务与一致性契约

重点问题:
1. 哪些状态对象由 SDK 本地 truth repository 持久化?
2. 哪些状态变化必须与 outbox / projection 在同一事务内完成?
3. 哪些 projection 只读状态不能反写真相?
4. 乐观锁、幂等锚点和 event publish 失败如何处理?
```
