## Step 9. 状态机与状态流转

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 9
- 回填章节：`02-概要设计.md` §9 状态定义与状态流转

### 2. 本步输入

- `02_hld_step_06_key_objects.md`
- `02_hld_step_07_api_interface_skeleton.md`
- `02_hld_step_08_processing_flows.md`
- `00-需求文档.md` 中 SDK 语义一致、官方客户端、验证证据、兼容演进相关需求
- `01-架构设计.md` 中本仓只拥有 SDK 本地视图、candidate、evidence、compatibility 和 deprecated 记录的边界

### 3. SOP 问题回答

1. 本仓有哪些影响主线成立的正式状态？

   回答：正式状态集中在六类主语：`SnapshotFreshnessState`、`CapabilitySupportState`、`PackageCandidateStatus`、`VerificationEvidence` 的 result / redaction marker、`CompatibilityDecision`、`DeprecatedApiRecord`。其中 `SnapshotFreshnessState` 决定上游派生视图是否可用于 candidate；`CapabilitySupportState` 决定能力是否可暴露为正式 SDK 能力；`PackageCandidateStatus` 决定本地 candidate 是否可进入稳定基线判断；`VerificationEvidence` 决定验证证据是否支撑或阻塞 candidate；`CompatibilityDecision` 决定 candidate 是否被兼容治理阻塞；`DeprecatedApiRecord` 决定 API 演进与迁移可见性。

2. 每个状态的含义是什么，是否可以进入正常主线？

   回答：`Fresh`、`Supported`、`Verified`、`Passed`、`Compatible` 和 `Announced / Deprecated` 在满足上下文条件时可以进入正常主线；`PendingRefresh`、`Pending`、`NotVerified`、`PendingEvidence` 是等待补齐证据或上游确认的中间状态；`Stale`、`Unsupported`、`FakeOnly`、`Failed`、`Breaking`、`Rejected`、`Removed` 是阻断或终止类状态；`Unknown` 和 `Skipped` 只能作为显式不确定或裁剪结果，不能伪装为通过。

3. 哪些接口、事件或动作会触发状态迁移？

   回答：`RefreshDerivedBindingView`、`ConsumeCoreContractChanged / ConsumeBusSemanticChanged / ConsumeFormalApiChanged` 触发 freshness 状态；`GeneratePackageCandidate` 创建 candidate；`ConsumeValidationRunFinished`、`RunCrossLanguageSmoke`、`ValidateDocsExamples`、`VerifyBoundaryPolicies` 产生 evidence 并推进 candidate；`CheckCompatibility` 和 `RecordCompatibilityDecision` 产生 compatibility decision 并决定 candidate 是否可 stable；`DeprecateSdkApi` 推进 deprecated lifecycle。

4. 哪些迁移明确允许，哪些迁移明确禁止？

   回答：允许迁移必须由对应对象函数或处理流触发，例如 `SnapshotFreshnessState.mark_pending(...)`、`PackageCandidate.mark_verified(...)`、`CompatibilityDecision.pending_evidence(...)`、`DeprecatedApiRecord.schedule_removal(...)`。明确禁止把 stale / unsupported / unknown 视图直接作为 verified candidate 依据；禁止把 fake only 或 skipped evidence 当作 passed；禁止把 breaking / rejected compatibility 的 candidate 提升为 stable；禁止静默从 deprecated 直接 removed 而没有 pending removal 或 migration ref。

5. 状态变化如何影响 outbox、projection、下游感知或只读供给？

   回答：状态变化通过本仓 outbox 事件和 projection 传播给 automation、review、reports 或下游通知。`SdkSnapshotFreshnessChangedEvent` 表达上游变化对 derived / language view 可用性的影响；`SdkClientViewFreshnessChangedEvent` 表达上游变化对 service / event client view 可用性的影响；`PackageCandidateGeneratedEvent`、`VerificationEvidenceRecordedEvent`、`CompatibilityDecisionRecordedEvent`、`DeprecatedApiRecordedEvent` 表达 candidate、evidence、compatibility 和 deprecated 记录的本地 truth 变化。Query 只能读取 projection，不得反向改写状态。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` 状态章节 | 没有把 freshness、candidate、evidence、compatibility、deprecated lifecycle 作为独立状态主语收稳 | 详细设计会在对象契约、接口处理流和测试中各自发明状态 |
| Step 6 对象轮廓 | 已列出状态集合，但状态之间的迁移关系仍分散在对象小节 | 无法判断 `GeneratePackageCandidate`、验证 job 和 compatibility 之间的推进顺序 |
| Step 8 处理流 | 多个处理流提到状态影响，但缺少统一传播关系 | outbox、projection 和只读查询可能不知道消费哪个状态变化 |
| evidence 状态 | `Redacted` 与 `Passed / Failed / NotVerified / Skipped` 容易被误读为同一维度结果 | 详细设计可能把“已脱敏”误当成验证通过 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 状态组织方式 | 状态散落在对象和流程说明中 | 单独形成状态定义、迁移、禁止迁移和传播关系 | 概要设计需要支撑详细设计写状态矩阵 |
| candidate 判断 | candidate 只表达生成与验证结果 | 明确 Draft / NotVerified / Failed / Verified / Stable / Superseded 的推进关系 | 防止把本地 candidate 误认为公共发布 |
| evidence 判断 | evidence result 和 redaction 混在一起 | 明确 result 表达验证结论，redaction marker 表达证据安全发布条件 | 防止把 redacted 当作 passed |
| compatibility 判断 | 兼容结论只在处理流中出现 | 明确 Compatible / RequiresMigration / Breaking / PendingEvidence / Rejected 对 candidate 的影响 | 支撑 stable 判定和 migration 口径 |
| deprecated 演进 | deprecated 被视为文档提示 | 明确 Announced / Deprecated / PendingRemoval / Removed / Superseded 生命周期 | 防止静默移除和单语言不可见 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：不单独写状态机，只在对象小节保留状态集合 | 文件较短 | 状态迁移、禁止迁移和传播关系不清，详细设计容易重建 | 不采用 |
| 方案 B：把所有状态合并成一个全局 SDK lifecycle | 看起来统一 | freshness、candidate、evidence、compatibility、deprecated 语义不同，合并会制造错误迁移 | 不采用 |
| 方案 C：按状态主语分组，统一列状态含义、核心迁移、禁止迁移和传播关系 | 能保留对象边界，同时让详细设计有明确状态矩阵输入 | 文件较长，需要控制在概要粒度 | 采用 |

### 7. 结构化中间产物

#### 7.1 状态主语总表

| 状态主语 | 所属主要部分 | 是否正式状态机 | 主要作用 | 可进入正常主线的状态 |
|---|---|---|---|---|
| `SnapshotFreshnessState` | 上游契约消费与派生视图 | 是 | 判断派生视图和语言视图是否可用于 candidate | `Fresh` |
| `CapabilitySupportState` | 平台能力访问与正式边界适配 | 是，轻量状态 | 判断服务能力是否可正式暴露 | `Supported` |
| `PackageCandidateStatus` | package candidate 与验证证据 | 是 | 判断本地 package candidate 的验证和稳定化阶段 | `Verified` / `Stable` |
| `VerificationEvidence` result / marker | package candidate 与验证证据 | 是，证据状态 | 判断验证证据是否支撑 candidate | `Passed` 且满足 redaction |
| `CompatibilityDecision` | 文档、兼容与演进 | 是 | 判断 candidate 对现有语义基线是否兼容 | `Compatible` / `RequiresMigration` |
| `DeprecatedApiRecord` | 文档、兼容与演进 | 是 | 管理 API deprecated、迁移和移除生命周期 | `Announced` / `Deprecated` |

#### 7.2 状态定义表

| 状态主语 | 状态 | 含义 | 是否允许推进主线 |
|---|---|---|---|
| `SnapshotFreshnessState` | `Fresh` | 视图已对齐当前已知上游版本 | 是，可用于 candidate 生成 |
| `SnapshotFreshnessState` | `PendingRefresh` | 已发现上游变化，等待刷新或验证 | 否，等待刷新 |
| `SnapshotFreshnessState` | `Stale` | 视图落后于上游版本 | 否，阻止 verified / stable |
| `SnapshotFreshnessState` | `Unsupported` | 上游变化当前无法派生或不进入 SDK 范围 | 否，需显式裁剪 |
| `SnapshotFreshnessState` | `Unknown` | 无法确认上游版本或检查结果缺失 | 否，需补查 |
| `CapabilitySupportState` | `Supported` | 能力具备正式 API 且可进入 SDK candidate | 是 |
| `CapabilitySupportState` | `FakeOnly` | 只能通过 fake / fixture 验证 | 否，不得宣称生产可用 |
| `CapabilitySupportState` | `Pending` | 能力边界或上游契约尚未确认 | 否 |
| `CapabilitySupportState` | `Unsupported` | 能力明确不进入当前 SDK 范围 | 否 |
| `PackageCandidateStatus` | `Draft` | candidate 已创建但尚未完成验证 | 否 |
| `PackageCandidateStatus` | `NotVerified` | 存在未验证能力、fake only 能力或缺失证据 | 否 |
| `PackageCandidateStatus` | `Failed` | 验证失败 | 否，阻断 |
| `PackageCandidateStatus` | `Verified` | 通过当前 P0 验证 | 是，可进入兼容和稳定判断 |
| `PackageCandidateStatus` | `Stable` | 通过兼容、文档和验证门禁 | 是，作为本地稳定基线 |
| `PackageCandidateStatus` | `Superseded` | 被后续 candidate 替代 | 否，历史追溯 |
| `VerificationEvidence` | `Passed` | 验证项通过 | 是，可支撑 candidate |
| `VerificationEvidence` | `Failed` | 验证项失败 | 否，阻塞 candidate |
| `VerificationEvidence` | `NotVerified` | 验证项未执行或无结论 | 否 |
| `VerificationEvidence` | `Skipped` | 验证项因范围裁剪被显式跳过 | 否，不得当作 passed |
| `VerificationEvidence` | `Redacted` | 证据已脱敏，可被安全引用 | 只表示安全发布条件，不替代验证结果 |
| `CompatibilityDecision` | `Compatible` | 变化不破坏既有 SDK 使用方 | 是 |
| `CompatibilityDecision` | `RequiresMigration` | 变化需要使用方按迁移说明调整 | 是，但必须绑定 migration ref |
| `CompatibilityDecision` | `Breaking` | 构成 breaking change | 否，阻止静默 stable |
| `CompatibilityDecision` | `PendingEvidence` | 证据不足 | 否 |
| `CompatibilityDecision` | `Rejected` | 候选变化被兼容治理拒绝 | 否 |
| `DeprecatedApiRecord` | `Announced` | 已发布 deprecated 通知但仍可用 | 是，提醒迁移 |
| `DeprecatedApiRecord` | `Deprecated` | API 已正式 deprecated | 是，但应引导迁移 |
| `DeprecatedApiRecord` | `PendingRemoval` | API 已进入计划移除窗口 | 有条件，必须可见 |
| `DeprecatedApiRecord` | `Removed` | API 已从 SDK 中移除 | 否，不能再作为可用能力 |
| `DeprecatedApiRecord` | `Superseded` | 记录被新方案或新决策覆盖 | 否，历史追溯 |

#### 状态流转图: L0-sdk 核心状态推进

```text
[Upstream changed]
  | event
  v
[SnapshotFreshnessState]
  | PendingRefresh / Stale / Unsupported / Unknown
  | refresh
  v
[Fresh]
  | enables GeneratePackageCandidate
  v
[PackageCandidate: Draft]
  | attach evidence
  v
[NotVerified]
  | Passed evidence + redacted + boundary ok
  v
[Verified]
  | compatibility decision
  v
[Stable]

[Failed evidence]
  | blocks
  v
[PackageCandidate: Failed]

[Breaking / Rejected]
  | blocks
  v
[PackageCandidate: NotVerified or Failed]
```

关键说明：
- 本图表达 freshness、candidate、evidence 和 compatibility 对主线的推进关系。
- `Stable` 仍然只是 SDK 本地稳定基线，不等于公共 registry 发布。
- `Redacted` 是 evidence 安全发布条件，不是验证通过状态。
- 图不表达 repository、事务、错误码或 runner 命令。

#### 状态流转图: DeprecatedApiRecord 生命周期

```text
[Announced]
  | mark_deprecated
  v
[Deprecated]
  | schedule_removal
  v
[PendingRemoval]
  | mark_removed
  v
[Removed]

[Announced] / [Deprecated] / [PendingRemoval]
  | supersede
  v
[Superseded]
```

关键说明：
- deprecated 生命周期独立于 candidate 状态机，但会影响 compatibility、migration guide 和查询视图。
- `Removed` 前必须存在可追溯的 deprecated 记录和 migration ref。
- `Superseded` 表达记录被更新决策覆盖，不代表 API 继续可用。

#### 7.3 允许迁移清单

| 状态主语 | 允许迁移 | 触发接口 / 动作 | 概要口径 |
|---|---|---|---|
| `SnapshotFreshnessState` | `Unknown -> PendingRefresh` | `Consume*Changed` / `CheckUpstreamFreshness` | 发现上游版本变化但尚未刷新 |
| `SnapshotFreshnessState` | `PendingRefresh -> Fresh` | `RefreshDerivedBindingView` | 派生视图已对齐最新上游引用 |
| `SnapshotFreshnessState` | `Fresh -> PendingRefresh` | `Consume*Changed` | 新上游变化使当前视图等待刷新 |
| `SnapshotFreshnessState` | `Fresh -> Stale` | `CheckUpstreamFreshness` | 检查发现当前视图落后 |
| `SnapshotFreshnessState` | `PendingRefresh -> Unsupported` | refresh 判断不支持 | 上游变化不进入当前 SDK 范围 |
| `CapabilitySupportState` | `Pending -> Supported` | formal API 和边界确认 | 能力可正式暴露 |
| `CapabilitySupportState` | `Pending -> FakeOnly` | fake boundary 判断 | 只能通过 fake / fixture 验证 |
| `CapabilitySupportState` | `Pending -> Unsupported` | 范围裁剪 | 当前 SDK 不支持 |
| `PackageCandidateStatus` | `Draft -> NotVerified` | `GeneratePackageCandidate` 后检查证据不足 | candidate 存在但证据不足 |
| `PackageCandidateStatus` | `Draft / NotVerified -> Failed` | failed evidence | 关键验证失败 |
| `PackageCandidateStatus` | `NotVerified -> Verified` | passed evidence 且已脱敏 | P0 验证通过 |
| `PackageCandidateStatus` | `Verified -> Stable` | compatible 或 requires migration 且满足门禁 | 本地稳定基线成立 |
| `PackageCandidateStatus` | `Draft / NotVerified / Verified / Stable -> Superseded` | 新 candidate 替代 | 保留历史追溯 |
| `VerificationEvidence` | `NotVerified -> Passed` | smoke / docs / boundary 验证通过 | 可支撑 candidate |
| `VerificationEvidence` | `NotVerified -> Failed` | 验证失败 | 阻塞 candidate |
| `VerificationEvidence` | `Passed / Failed / NotVerified / Skipped -> Redacted` | redaction policy | 证据可被安全引用 |
| `CompatibilityDecision` | `PendingEvidence -> Compatible` | evidence 足够且无破坏变化 | 不阻塞 stable |
| `CompatibilityDecision` | `PendingEvidence -> RequiresMigration` | 变化需要迁移说明 | 必须绑定 migration ref |
| `CompatibilityDecision` | `PendingEvidence -> Breaking / Rejected` | 兼容治理阻断 | 阻止静默 stable |
| `DeprecatedApiRecord` | `Announced -> Deprecated` | `DeprecateSdkApi` | 正式 deprecated |
| `DeprecatedApiRecord` | `Deprecated -> PendingRemoval` | removal plan | 进入移除窗口 |
| `DeprecatedApiRecord` | `PendingRemoval -> Removed` | removal 生效 | API 不再可用 |
| `DeprecatedApiRecord` | `Announced / Deprecated / PendingRemoval -> Superseded` | 新记录覆盖 | 旧记录停止推进 |

#### 7.4 禁止迁移清单

| 禁止迁移 | 禁止原因 | 应如何处理 |
|---|---|---|
| `Stale / Unsupported / Unknown -> Verified candidate` | 不可用视图不能支撑 verified candidate | 先刷新、裁剪或补证据 |
| `FakeOnly -> Supported` 无 formal API 依据 | fake / fixture 不能伪装生产能力 | 等 formal API 和边界确认 |
| `Skipped -> Passed` | 跳过验证不是验证通过 | 保持 skipped 并进入风险 / 裁剪说明 |
| `Redacted -> Passed` | redaction 只表达证据安全，不表达验证结果 | 同时检查 result |
| `Failed -> Verified / Stable` | 失败证据阻断 candidate | 新 candidate 或修复后重新验证 |
| `Breaking / Rejected -> Stable` | 兼容治理阻断静默稳定化 | 生成 migration / ADR / 新 candidate |
| `Announced -> Removed` | 静默移除破坏迁移可见性 | 必须经过 deprecated 和 pending removal |
| Query 触发任何状态迁移 | 查询必须只读 | 改用 command、event consumer 或 job |
| projection rebuild 改写 truth 状态 | rebuild 只重建只读视图 | 从 truth 重放 projection |

#### 状态传播关系图: L0-sdk 状态到事件与查询视图

```text
[State change in SDK truth]
  | append
  v
[Outbox event]
  | publish
  v
[Automation / review / reports]

[State change in SDK truth]
  | project
  v
[Query projection]
  | read
  v
[GetSnapshotFreshness / GetPackageCandidateStatus / GetVerificationEvidence / GetCompatibilityDecision]
```

关键说明：
- outbox 用于传播状态变化事实，projection 用于只读查询。
- Query 不允许反向改写 freshness、candidate、evidence、compatibility 或 deprecated 状态。
- projection rebuild 只从 truth 重建视图，不产生新的状态迁移。

### 8. 回填草稿

本步回填 `02-概要设计.md` §9 时建议使用以下结构：

```text
## 9. 状态定义与状态流转
### 9.1 状态主语总表
### 9.2 状态定义表
### 9.3 核心状态流转图
### 9.4 允许迁移清单
### 9.5 禁止迁移清单
### 9.6 状态传播关系
```

回填时可引用本文件 `7.1` ~ `7.4` 的结构化中间产物，不需要重复保留 SOP 问题回答、问题诊断和设计取舍。

### 9. 待确认事项

- `VerificationEvidence` 在详细设计中是否拆成 `EvidenceResult` 与 `EvidenceRedactionStatus` 两个 enum，需要由 03 结合具体 Rust 类型决定；概要设计只约束 redaction 不替代 passed / failed 结果。
- `RequiresMigration` 是否允许 candidate 进入 `Stable`，取决于详细设计中 migration gate 的完整条件；概要设计当前只允许“有 migration ref 且门禁满足”。
- public registry 发布状态不属于 L0-sdk P0 状态机；如果后续引入 release 仓或 package registry 仓，应在对应仓单独设计发布状态机。

### 10. 进入下一步条件

- [x] 已明确 L0-sdk 存在正式状态机，并列出状态主语。
- [x] 已说明每个状态的含义和是否允许进入正常主线。
- [x] 已列出核心允许迁移与禁止迁移。
- [x] 已说明状态变化对 outbox、projection 和只读查询的传播关系。
- [x] 未下沉到状态机代码实现、错误码全集或数据库状态列定义。
