# L0-sdk 05 测试方案 Step 6:设计测试场景与用例矩阵

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §6 测试场景与用例设计
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 6 |
| 主题 | 设计测试场景与用例矩阵 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_06_cases.md` |

本步把 Step 5 的 `TS-SDK-*` 场景落成可执行、可断言、可留证的 `TC-SDK-*` 用例矩阵。测试数据构造留给 Step 7，环境与配置矩阵留给 Step 8，自动化命令和 CI 门禁留给 Step 9。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `05_test_plan_step_05_traceability_matrix.md` | 沿用 `TS-SDK-*`、`TC-SDK-*` 和 `EV-SDK-*` 编号 |
| `05_test_plan_step_03_test_objects_slices.md` | 继承对象、接口、状态机、负向字段和正式 enum 名称 |
| `05_test_plan_step_04_strategy_layers.md` | 继承 unit / service / integration / contract / gate 分层和阻断策略 |
| `03-详细设计.md` §7~§15 | 作为协议、函数流、状态矩阵、事务、错误、幂等、观测和脚本契约真相源 |
| `04-配置设计.md` §6~§12 | 作为配置、profile、敏感配置、失效模式和证据路径真相源 |

## 3. SOP 问题回答

### 3.1 每个 P0 正向主线怎么执行?

| 场景 | 正向主线 |
|---|---|
| `TS-SDK-001` | 读取 core / bus / formal snapshot，执行 `RefreshDerivedBindingView`，形成 `SnapshotFreshnessState::Fresh` 和 derived / language views |
| `TS-SDK-002` | 执行 `UpdateSdkSemanticBaseline`，校验三语言概念映射和 package surface 形状一致 |
| `TS-SDK-003` | 通过 formal API 或 fake boundary 执行 `InvokeServiceCapability`，返回 result ref / diagnostic ref 且不写 SDK truth |
| `TS-SDK-004` | 通过 `PublishBusEvent` 和 event client view 校验 bus semantic mapping，不生成 bus runtime truth |
| `TS-SDK-005` | 在三语言调用中验证 `SdkProtocolError` 映射和 `TraceContextRef` 传播 |
| `TS-SDK-006` | 执行 policy guard、config validation 和 redaction check，确保 forbidden body / raw secret 为 0 |
| `TS-SDK-007` | 执行 `GeneratePackageCandidate`、`BuildLanguagePackages`，产出本地 candidate 和 artifact digest |
| `TS-SDK-008` | 执行 `ValidateDocsExamples`，证明 quickstart / docstring / examples 可运行 |
| `TS-SDK-009` | 执行 `RunCrossLanguageSmoke`，形成 `EvidenceResult::Passed` + `EvidenceRedactionStatus::Redacted` |
| `TS-SDK-010` | 执行 `CheckCompatibility` 和 `DeprecateSdkApi`，形成 compatible / migration / deprecated 证据 |

### 3.2 每个关键反向和边界场景如何触发?

| 反向 / 边界 | 触发方式 | 预期错误 / 状态 |
|---|---|---|
| source unavailable / digest mismatch | 使用不可读 source ref 或不匹配 digest | `SdkProtocolError::Dependency` / `Validation`，不保存 view |
| 三语言概念漂移 | Rust / Python / TypeScript surface 缺字段或语义不同 | semantic consistency test failed |
| unsupported / fake-only capability | `CapabilitySupportState::Unsupported` 或 `FakeOnly` 调用 stable gate | `CandidateGateRejected` / fake marker retained |
| payload body 直接进入 event DTO | 使用 raw payload body 而非 payload ref / digest | `SdkProtocolError::BoundaryViolation` |
| raw secret / credential value | config、DTO、log、evidence 或 report 中注入 secret value | fail-fast / redaction gate failed |
| evidence failed / skipped / unredacted | runner 返回失败、跳过或未脱敏证据 | `EvidenceGateRejected` |
| missing migration ref | `CompatibilityDecisionState::RequiresMigration` 缺 `MigrationGuideRef` | `SdkProtocolError::Validation` |

### 3.3 每个状态非法迁移如何断言?

| 非法迁移 | 断言 |
|---|---|
| `Stale / Unsupported / Unknown -> candidate generation` | 返回 `CandidateGateRejected`，不创建或不推进 `PackageCandidate` |
| `FakeOnly -> Stable` | 返回 `FakeOnlyCapabilityCannotStabilize`，candidate 保持非 `Stable` |
| `Skipped -> Passed` | `EvidenceResult` 不允许由 skipped 推断 passed |
| `Unredacted -> Verified` | 返回 `EvidenceGateRejected` |
| `Breaking / Rejected -> Stable` | 返回 `CompatibilityGateRejected` |
| `Announced -> Removed` | 返回 `InvalidStateTransition` |
| Query / projection rebuild -> truth mutation | repository truth 写入次数为 0 |

### 3.4 每个事务回滚和副作用如何验证?

| 场景 | 回滚 / 副作用断言 |
|---|---|
| write flow outbox append failure | truth、projection、idempotency 均回滚 |
| repository expected version conflict | 返回 `SdkProtocolError::Conflict`，旧 truth 不被覆盖 |
| same idempotency key + different digest | 返回 `Conflict`，不执行 domain mutation |
| runtime boundary failure | 返回 boundary error / diagnostic ref，不写 SDK truth |
| outbox publish failure | truth 不回滚，outbox 保持 pending / retryable |
| artifact truth metadata failure | artifact body 可成为 orphan，但 candidate truth 不可见 |

### 3.5 每个恢复场景如何复现?

| 恢复场景 | 复现方式 | 期望 |
|---|---|---|
| dependency unavailable | source / runner / boundary adapter 注入 unavailable | 修复依赖后用同一业务输入重新执行 |
| command replay | same idempotency key + same digest 重放 | 返回既有 receipt / result ref |
| event duplicate | 同一 `event_id + source_ref` 消费两次 | 第二次 skip 或返回 prior result |
| outbox retry | publish 成功但 mark published 失败后重跑 | 使用同一 event id，最终只标记一次 |
| projection rebuild | 删除 projection 后执行 `RebuildSdkProjections` | read model 恢复，truth 不变 |

### 3.6 每个用例预期结果引用了哪些正式字段、状态、错误或事件?

本步用例只引用 `03-详细设计.md` 的正式名称：`SnapshotFreshnessState`、`CapabilitySupportState`、`PackageCandidateStatus`、`EvidenceResult`、`EvidenceRedactionStatus`、`CompatibilityDecisionState`、`DeprecatedApiLifecycleState`、`SdkProtocolError`、`SdkOutboxEvent` 和对应 outbound event 名称。

### 3.7 是否存在把后续 phase 状态或证据提前写入当前用例的问题?

不存在。当前用例不要求 public registry publish，不把 `Stable` 等同公共发布，不把 fake success 当 production supported，不把 `Built` 当 `PackageCandidateStatus`，不把 redaction 当 validation passed。

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 旧用例围绕 GenerateBindings / wrapper / subscription / release manifest，不能承接新版 P0 场景 |
| `03-详细设计.md` §15 | 已给出测试切口，但未形成完整用例 ID、输入 / 操作、预期结果和证据映射 |
| 本 Step | 补齐用例矩阵，但不提前定义 fixture、环境 profile 和自动化命令细节 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 用例编号 | 旧 `TC-001` 直接绑定旧对象 | 使用 `TC-SDK-*` 编号族承接 Step 5 |
| 用例粒度 | 粗略“执行接口看成功” | 每条包含前置条件、输入 / 操作、预期结果、断言点和证据 |
| 状态断言 | 旧口语状态 / 旧对象状态 | 使用 `03` 正式 enum 和 `SdkProtocolError` |
| 证据映射 | release manifest / descriptor 粗粒度 | `EV-SDK-*` 证据族 |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否把每个细分负向场景都展开成独立用例 | 只展开 P0 高风险项 | 细粒度字段组合留给 Step 7 数据矩阵和实现阶段参数化 |
| 是否在用例中写具体 JSON fixture | 不写 | Step 7 专门设计测试数据 |
| 是否写 CI 命令 | 不写 | Step 9 专门设计自动化与 CI 门禁 |
| 是否把 public registry 作为用例 | 不写 P0 用例 | public registry 是 P1/P2 非范围 |

## 7. 结构化中间产物

### 7.1 测试场景表

| 场景 ID | 场景 | 主要需求 | 主测试层 | 证据 ID |
|---|---|---|---|---|
| `TS-SDK-001` | 上游 truth consumption 与 derived view 一致性 | F-001 | contract / service / integration | `EV-SDK-CONTRACT-001` |
| `TS-SDK-002` | 三语言 semantic baseline 与 package surface 一致性 | F-002 | unit / contract / smoke | `EV-SDK-SEMANTIC-001` |
| `TS-SDK-003` | formal API / fake boundary 最小 service capability 接入 | F-003 | service / integration / smoke | `EV-SDK-BOUNDARY-001` |
| `TS-SDK-004` | bus event client view 与 event semantic mapping | F-004 | unit / service / contract | `EV-SDK-EVENT-001` |
| `TS-SDK-005` | error mapping 与 trace propagation 一致性 | F-005 | unit / contract / smoke | `EV-SDK-TRACE-001` |
| `TS-SDK-006` | redaction、credential protection 与 forbidden body guard | F-006 | unit / integration / gate | `EV-SDK-SECURITY-001` |
| `TS-SDK-007` | local package candidate 生成、安装与验证 | F-007 | service / integration / gate | `EV-SDK-CANDIDATE-001` |
| `TS-SDK-008` | quickstart、docstring 与 docs example 可运行 | F-008 | integration / docs gate | `EV-SDK-DOCS-001` |
| `TS-SDK-009` | cross-language smoke 与 evidence 记录 | F-009 | smoke / evidence gate | `EV-SDK-SMOKE-001` |
| `TS-SDK-010` | compatibility decision、deprecated lifecycle 与 migration ref | F-010 | unit / service / gate | `EV-SDK-COMPAT-001` |

### 7.2 用例矩阵

| 用例 ID | 场景 | 优先级 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 |
|---|---|---|---|---|---|---|---|
| `TC-SDK-CONTRACT-001` | 上游 snapshot 正常派生 | P0 | core / bus / formal snapshot 可读 | `RefreshDerivedBindingView` | view refreshed | `SnapshotFreshnessState::Fresh`；derived / language view 保存 | contract + service |
| `TC-SDK-CONTRACT-002` | source 失败或 digest mismatch | P0 | source ref 不可读或 digest 错 | `RefreshDerivedBindingView` | 操作失败且不写 view | `SdkProtocolError::Dependency` / `Validation`；truth 写入 0 | service |
| `TC-SDK-CONTRACT-003` | upstream changed 标记 stale | P0 | 已有 fresh view | consume core / bus / formal changed event | affected views stale | `SnapshotFreshnessState::Stale`；outbox append | service + integration |
| `TC-SDK-SEMANTIC-001` | baseline 三语言一致 | P0 | Rust / Python / TypeScript 均启用 | `UpdateSdkSemanticBaseline` | baseline committed | language set 完整；`SdkSemanticBaselineChangedEvent` | unit + service |
| `TC-SDK-SEMANTIC-002` | concept drift 被拒绝 | P0 | language surface 存在漂移 | concept map validation | validation failed | drift marker / semantic error；不写 baseline | unit |
| `TC-SDK-SEMANTIC-003` | package surface 不定义第二 truth | P0 | language package surface 可生成 | surface contract compare | compare passed | surface shape 对齐 semantic baseline | contract |
| `TC-SDK-BOUNDARY-001` | service capability 最小调用 | P0 | capability `Supported` 或 explicit fake | `InvokeServiceCapability` | 返回 result ref / diagnostic ref | SDK truth 写入 0；trace retained | service + integration |
| `TC-SDK-BOUNDARY-002` | unsupported capability 被拒绝 | P0 | `CapabilitySupportState::Unsupported` | `InvokeServiceCapability` | 调用被拒绝 | `SdkProtocolError::Validation` / `BoundaryViolation` | service |
| `TC-SDK-BOUNDARY-003` | fake success 不污染 production | P0 | fake boundary active | fake capability call | fake marker retained | `CapabilitySupportState::FakeOnly` 不支撑 `Stable` | integration |
| `TC-SDK-EVENT-001` | event semantic mapping 正常 | P0 | bus semantic ref 可用 | `PublishBusEvent` | boundary 返回 publish ref | mapping 对齐；不生成 bus delivery truth | service + contract |
| `TC-SDK-EVENT-002` | raw payload body 被拒绝 | P0 | DTO 传 raw body | `PublishBusEvent` | 拒绝 publish | `SdkProtocolError::BoundaryViolation` | contract |
| `TC-SDK-EVENT-003` | mapping missing | P0 | event mapping 不存在 | `PublishBusEvent` | 操作失败 | `SdkProtocolError::NotFound`；bus boundary 未调用 | service |
| `TC-SDK-TRACE-001` | error mapping 一致 | P0 | 三语言错误样本一致 | error mapping test | error envelope 一致 | `SdkProtocolError` 分类一致 | unit + contract |
| `TC-SDK-TRACE-002` | trace propagation | P0 | trace context 存在或缺失 | client call / job run | trace 可传播或补齐 | `TraceContextRef` 存在且不含正文 | integration |
| `TC-SDK-TRACE-003` | trace / error 不泄露正文 | P0 | 错误包含敏感样本 | error / trace output | 输出已脱敏 | forbidden body scan 为 0 | gate |
| `TC-SDK-SECURITY-001` | raw secret 配置拒绝 | P0 | config 中有 raw secret | config load / validate | fail-fast | runtime 未构造 | config integration |
| `TC-SDK-SECURITY-002` | disable redaction 拒绝 | P0 | config 关闭 redaction | config validate | fail-fast | `BoundaryViolation` / config error | config integration |
| `TC-SDK-SECURITY-003` | unredacted evidence 拒绝 | P0 | runner 返回 unredacted evidence | consume validation result | 不写 evidence | `EvidenceRedactionStatus::Unredacted` 阻断 | service |
| `TC-SDK-SECURITY-004` | artifacts / reports 安全扫描 | P0 | artifacts / reports 已生成 | redaction check | scan passed | raw body / secret count = 0 | CI gate |
| `TC-SDK-CANDIDATE-001` | generate candidate | P0 | views `Fresh`，capabilities 合法 | `GeneratePackageCandidate` | candidate `Draft` | `PackageCandidateStatus::Draft`；outbox append | service |
| `TC-SDK-CANDIDATE-002` | build language packages | P0 | candidate `Draft` | `BuildLanguagePackages` | artifact metadata attached | artifact ref / digest saved；`Built` 不是状态 | integration |
| `TC-SDK-CANDIDATE-003` | non-fresh blocks candidate | P0 | view `Stale` / `Unknown` | `GeneratePackageCandidate` | gate rejected | `CandidateGateRejected` | service |
| `TC-SDK-CANDIDATE-004` | local stable 不发布 public registry | P0 | candidate verified | local candidate gate | candidate 可进入 `Stable` | no public publish side effect | gate |
| `TC-SDK-DOCS-001` | quickstart runs | P0 | local package candidate 可安装 | run quickstart | docs evidence passed | `EvidenceResult::Passed` | docs gate |
| `TC-SDK-DOCS-002` | docs example 与 client 行为一致 | P0 | examples 可执行 | `ValidateDocsExamples` | evidence recorded | docs evidence redacted | integration |
| `TC-SDK-DOCS-003` | docs failure blocks stable | P0 | example 失败 | docs runner | failed evidence | candidate 不进 `Stable` | gate |
| `TC-SDK-SMOKE-001` | cross-language smoke passed | P0 | 三语言 package 可安装 | `RunCrossLanguageSmoke` | smoke passed | `EvidenceResult::Passed` + `Redacted` | smoke |
| `TC-SDK-SMOKE-002` | smoke skipped not passed | P0 | runner skipped | consume validation result | evidence skipped | `EvidenceResult::Skipped` 不支撑 verified | service |
| `TC-SDK-SMOKE-003` | evidence recorded with refs only | P0 | runner result safe | record evidence | evidence saved | artifact ref / digest, no body | integration |
| `TC-SDK-SMOKE-004` | missing public registry not blocking | P0 | registry unavailable | local smoke | smoke still runnable | candidate validation 不依赖 registry | smoke |
| `TC-SDK-COMPAT-001` | compatible decision | P0 | candidate verified | `CheckCompatibility` | compatible recorded | `CompatibilityDecisionState::Compatible` | service |
| `TC-SDK-COMPAT-002` | migration required | P0 | compatible with migration | `CheckCompatibility` with migration ref | decision recorded | `RequiresMigration` + `MigrationGuideRef` | service |
| `TC-SDK-COMPAT-003` | missing migration ref rejected | P0 | requires migration but no ref | `CheckCompatibility` | validation failed | `SdkProtocolError::Validation` | service |
| `TC-SDK-COMPAT-004` | deprecated lifecycle | P0 | API exists | `DeprecateSdkApi` | lifecycle changes legally | `Announced -> Deprecated -> PendingRemoval`；no silent removed | unit + service |

### 7.3 用例断言与证据矩阵

| 测试用例族 | 设计契约 | 字段 / 状态断言 | 负向条件 | 证据 ID |
|---|---|---|---|---|
| `TC-SDK-CONTRACT-*` | `03` §7 / §8 / §9 | `SnapshotFreshnessState::Fresh / Stale`、source ref、digest | source unavailable、digest mismatch | `EV-SDK-CONTRACT-001` |
| `TC-SDK-SEMANTIC-*` | `03` §5 / §6 | language set、concept map、baseline version | concept drift、surface shape drift | `EV-SDK-SEMANTIC-001` |
| `TC-SDK-BOUNDARY-*` | `03` §8 / §11 / §13 | `CapabilitySupportState`、diagnostic ref、no truth write | unsupported、fake marker missing | `EV-SDK-BOUNDARY-001` |
| `TC-SDK-EVENT-*` | `03` §7 / §8 / §13 | event mapping、payload ref、bus semantic ref | raw payload body、mapping missing | `EV-SDK-EVENT-001` |
| `TC-SDK-TRACE-*` | `03` §11 / §14 | `SdkProtocolError`、`TraceContextRef` | missing trace、body in error | `EV-SDK-TRACE-001` |
| `TC-SDK-SECURITY-*` | `03` §11 / §14；`04` §8 / §11 | raw secret rejected、redaction on | disabled redaction、unredacted evidence | `EV-SDK-SECURITY-001` |
| `TC-SDK-CANDIDATE-*` | `03` §8 / §9 / §10 | `Draft / NotVerified / Verified / Stable` | stale view、public publish side effect | `EV-SDK-CANDIDATE-001` |
| `TC-SDK-DOCS-*` | `03` §15 | docs evidence result / redaction | docs runner failed | `EV-SDK-DOCS-001` |
| `TC-SDK-SMOKE-*` | `03` §15 | `EvidenceResult::Passed` + `EvidenceRedactionStatus::Redacted` | skipped / failed / registry unavailable | `EV-SDK-SMOKE-001` |
| `TC-SDK-COMPAT-*` | `03` §9 / §11 | `Compatible / RequiresMigration / Breaking / Rejected`、migration ref | missing migration ref、silent removal | `EV-SDK-COMPAT-001` |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §6 时摘录。

```markdown
## 6. 测试场景与用例设计

> 校准来源：
> - `design-calibration/05_test_plan_step_06_cases.md`

本章按 `TS-SDK-*` 场景和 `TC-SDK-*` 用例编号组织 P0 测试。每个用例必须包含前置条件、输入 / 操作、预期结果、断言点、自动化候选和证据 ID。预期结果和断言点必须使用 `03-详细设计.md` 的正式字段、状态、错误和事件名称。

当前用例矩阵覆盖上游 truth consumption、三语言 semantic baseline、formal / fake boundary、bus event client view、error / trace、redaction / credential protection、package candidate、docs example、cross-language smoke、compatibility / deprecated 十条 P0 场景。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| 是否在 Step 6 固化 fixture 名称 | 不固化 | fixture 属于 Step 7 测试数据设计 |
| 是否在 Step 6 固化 CI 命令 | 不固化 | 自动化命令属于 Step 9 |
| 是否需要为 P1/P2 写用例 | 不写 P0 用例,只在后续风险和专项中承接 | Step 2 已确认 P1/P2 不阻断当前闭环 |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 正向主线已落成用例 | 已满足 |
| 关键反向和边界场景已落成用例 | 已满足 |
| 状态非法迁移已有断言 | 已满足 |
| 事务回滚和副作用已有验证口径 | 已满足 |
| 恢复场景已有复现方式 | 已满足 |
| 用例均引用正式字段、状态、错误或事件 | 已满足 |
| 未提前引入 public registry 或后续 phase 状态 | 已满足 |

Step 7 可以在本文件被确认后开始,主题是设计测试数据。
