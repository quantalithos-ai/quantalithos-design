# L0-sdk 05 测试方案 Step 3:抽取测试对象与测试切口

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §3 测试对象与测试切口
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 3 |
| 主题 | 抽取测试对象与测试切口 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_03_test_objects_slices.md` |

本步从概要设计和详细设计抽取必须验证的对象、接口、状态机、事务、一致性、错误、并发、配置和观测切口。具体测试分层留给 Step 4，追溯矩阵留给 Step 5，用例 ID 和执行步骤留给 Step 6。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `05_test_plan_step_01_input_boundary.md` | 继承新版 `00~04` 为测试真相源 |
| `05_test_plan_step_02_scope.md` | 继承 P0 / P1 / P2、非范围和一票否决口径 |
| `02-概要设计.md` §5~§11 | 抽取主要组成部分、关键对象、API / 接口骨架、处理流、状态、异常和配置影响 |
| `03-详细设计.md` §5~§15 | 抽取模块、对象、trait / port / adapter、协议、函数流、状态矩阵、事务、错误、幂等、配置、观测和最小测试切口 |
| `04-配置设计.md` §12 | 抽取配置进入测试方案的 profile、source priority、JSON schema、cross-field、sensitive、fail-fast 和 evidence 场景 |

## 3. SOP 问题回答

### 3.1 哪些 domain object / value object / policy 必须单测?

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| `SdkSemanticBaseline` / `ClientCapabilityModel` / `CrossLanguageConceptMap` | `03` §5.3 / §6.1 | supported language、capability support、concept drift、upstream ref 约束 | 三语言语义漂移或能力被错误暴露 | domain unit |
| `DerivedBindingView` / `LanguageBindingView` / `UpstreamVersionRef` / `SnapshotFreshnessState` | `03` §5.3 / §9 | source ref、digest、freshness、stale / unsupported / unknown 门禁 | stale view 支撑 candidate | domain unit |
| `ServiceClientView` / `ServiceCapabilityRef` / `CapabilitySupportState` | `03` §5.3 / §9 | supported / fake-only / pending / unsupported 判断 | fake-only 被当作 production supported | domain unit |
| `BusEventClientView` / `EventSemanticMapping` | `03` §5.3 / §6.1 | SDK event mapping 对齐 bus semantic，不生成 delivery truth | SDK 重定义 bus runtime truth | domain unit |
| `ErrorMappingPolicy` / `TracePropagationPolicy` | `03` §5.3 / §15.1 | 错误形状、trace 必填字段、跨语言一致 | 三语言错误 / trace 表达漂移 | policy unit |
| `RedactionPolicy` / `CredentialProtectionPolicy` / `BoundaryGuard` | `03` §5.3 / §11 / §14 | raw body、plain secret、fake success、unredacted evidence 拒绝 | 敏感泄露或 fake 污染 production | policy unit |
| `PackageCandidate` / `LanguageArtifact` / `PackageCandidateStatus` | `03` §5.3 / §9 | candidate 生成、artifact attach、verified / stable 门禁 | 未验证 candidate 进入 `Stable` | domain unit |
| `VerificationEvidence` / `EvidenceResult` / `EvidenceRedactionStatus` | `03` §5.3 / §9 / §15.1 | result 与 redaction 分离，failed / skipped 不支撑 stable | `Redacted` 被误当 `Passed` | domain unit |
| `CompatibilityDecision` / `DeprecatedApiRecord` / `MigrationGuideRef` | `03` §5.3 / §9 | breaking、requires migration、deprecated lifecycle、migration ref | breaking change 静默稳定化或 API 静默移除 | domain unit |

### 3.2 哪些 application service 必须做 service test?

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| `SdkSemanticBaselineService` | `03` §5.5 / §8.1 | 更新 baseline、capability projection、outbox、idempotency 顺序 | baseline 更新不一致或事件缺失 | application service |
| `ContractConsumptionService` | `03` §5.5 / §8.1 | 消费 source snapshot、刷新 view、mark stale、保存 version refs | 上游变化未阻断 candidate | application service |
| `ServiceClientAssemblyService` | `03` §5.5 / §8.3 | runtime boundary call、policy guard、fake marker、无 truth 写入 | service call 反写 SDK truth | application service |
| `EventClientAssemblyService` | `03` §5.5 / §8.3 | event mapping、bus boundary、payload ref-only、无 delivery truth | SDK 补造 bus publication / delivery | application service |
| `PackageCandidateService` | `03` §5.5 / §8.1 | fresh gate、candidate create、artifact metadata、outbox | stale 或 fake-only 能力生成 stable 候选 | application service |
| `CandidateValidationService` | `03` §5.5 / §8.1 | smoke / docs / boundary evidence、candidate advance、projection | failed / unredacted evidence 被接受 | application service |
| `CompatibilityGovernanceService` | `03` §5.5 / §8.1 | compatibility decision、deprecated API、migration ref | breaking 或缺 migration ref 未阻断 | application service |
| `QueryService` | `03` §5.5 / §8.4 | 只读 query、pagination、consistency marker、不触发 rebuild | Query 写 truth 或自动修复状态 | service read test |

### 3.3 哪些 repository / adapter / worker 必须做集成测试?

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| `UnitOfWork` + repositories | `03` §5.4 / §10 | expected version、unique key、idempotency、rollback | 并发覆盖 truth 或重复写入 | integration |
| projection ports | `03` §10 / §12 | required projection 同事务、rebuild 不反写真相 | read model 覆盖 truth | integration |
| `SdkOutboxPort` / outbox publisher | `03` §10 / §12 | append 与 truth 同事务、publish retry 同 event id | 事件重复或 truth 与 outbox 不一致 | integration |
| source adapters | `03` §13 | core / bus / formal snapshot ref、source unavailable、digest mismatch | 复制上游 truth 或 stale 未标记 | adapter integration |
| runtime boundary adapters | `03` §13 / §15.2 | formal API、fake endpoint、bus event boundary 错误映射 | raw body 泄露或 fake marker 缺失 | adapter integration |
| runner adapters | `03` §13 / §15.4 | generator、builder、smoke、docs、compatibility、boundary verifier result | runner 失败被误记为 passed | job integration |
| artifact / report store | `03` §15.4 / `04` §12 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、digest / ref | 证据不可追溯或路径错误 | integration |
| `ConfigLoader` / `ConfigValidator` / `SdkRuntimeBuilder` | `03` §13 / `04` §12 | defaults / JSON / env、strict schema、cross-field、raw secret、forbidden toggle | 配置绕过安全和状态门禁 | config integration |

### 3.4 哪些 Command / Query / Event / Job 必须做协议和流程测试?

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| Command API 全集 | `03` §7.2 / §8.1 | `UpdateSdkSemanticBaseline`、`RefreshDerivedBindingView`、`InvokeServiceCapability`、`PublishBusEvent`、`RecordCompatibilityDecision`、`DeprecateSdkApi` | DTO 字段缺失、幂等冲突、状态副作用错误 | protocol + flow |
| Query API 全集 | `03` §7.2 / §8.4 | 12 个 query 只读、not found、stale marker、pagination | 查询触发状态迁移或写 projection | protocol + read flow |
| Inbound Event Consumer | `03` §7.2 / §8.1 | core / bus / formal / validation event 消费、duplicate event、missing source ref | 重复消费或错误来源污染状态 | protocol + flow |
| Outbound Event | `03` §7.2 / §10 / §12 | schema、topic、CloudEvent metadata、forbidden body、retry | outbox 事件泄露正文或重复发布 | contract + integration |
| Operations Job | `03` §7.2 / §8.1 / §15.4 | freshness、candidate、build、smoke、docs、compatibility、boundary、projection | job 直接调用 adapter 或失败不留证 | job flow |
| Rust client / CLI / job entry | `03` §4 / §7.1 / §15.4 | DTO parse、metadata、exit code、job summary、artifact output | entry 发明新错误或绕过 service | entry integration |

### 3.5 哪些状态机、事务、一致性、幂等和恢复行为必须单列切口?

| 切口 | 来源章节 | 必须验证 |
|---|---|---|
| 状态机转换 | `03` §9 | `SnapshotFreshnessState`、`CapabilitySupportState`、`PackageCandidateStatus`、`EvidenceResult`、`EvidenceRedactionStatus`、`CompatibilityDecisionState`、`DeprecatedApiLifecycleState` 的允许和禁止迁移 |
| Candidate gate | `03` §9.3 / §9.4 | `Fresh` + passed evidence + redacted + compatible / migration ref 才可进入 `Stable` |
| 事务边界 | `03` §10.3 | truth、projection、outbox、idempotency 同事务; outbox publish 失败不回滚 truth |
| 一致性策略 | `03` §10.4 | source snapshot 只作输入、artifact body 与 truth metadata 分离、runtime boundary 不写 truth |
| 幂等和重入 | `03` §12 | same key same digest replay、same key different digest conflict、duplicate event skip、job item 去重 |
| 并发控制 | `03` §12 | expected version conflict、candidate 多 job 并发、projection rebuild 不覆盖新 view |
| 错误与恢复 | `03` §11 | validation、not found、conflict、boundary violation、dependency、internal 映射和恢复动作 |
| 可观测与审计 | `03` §14 | logs / metrics / audit / diagnostic 只含 ref、status、marker 和 safe summary |

### 3.6 哪些字段缺失、DTO 构造失败或引用混同必须作为负向测试切口?

| 负向切口 | 来源章节 | 必须断言 |
|---|---|---|
| `CommandMetadata.request.idempotency_key` 缺失或复用冲突 | `03` §7.3 / §12 | 返回 `Validation` 或 `Conflict`，不写 truth |
| inbound event 缺 `event_id`、`source_ref` 或幂等字段 | `03` §7.3 / §12 | 拒绝消费，不写 view / evidence |
| source ref、snapshot ref、digest 不匹配 | `03` §7.4 / §11 | 返回 `Dependency` / `Validation`，不保存派生视图 |
| payload body、request body、response body 直接进入 DTO / evidence | `03` §7.4 / §11 / §14 | 返回 `BoundaryViolation`，不调用 boundary 或不写 evidence |
| fake marker 缺失或 fake success 当 production success | `03` §11 / `04` §11 | `BoundaryGuard` 拒绝，candidate 不得 stable |
| migration required 但缺 `MigrationGuideRef` | `03` §7.4 / §11 | 返回 `Validation`，不写 compatibility decision |
| `Skipped` evidence、`Unredacted` evidence 或 failed runner result 支撑 stable | `03` §9 / §15 | gate 拒绝，candidate 不得进入 `Verified` / `Stable` |
| config unknown key、重复 key、非法 enum、raw secret、disable redaction | `04` §12 | fail-fast / fail-closed，不构造 runtime |
| `artifact_root` / `report_root` 带项目名层级或越界路径 | `03` §15.4 / `04` §12 | 配置校验失败或报告生成失败 |

### 3.7 哪些状态名必须以详细设计正式 enum variant 为准?

| 状态 enum | 正式状态值 | 测试断言禁止使用 |
|---|---|---|
| `SnapshotFreshnessState` | `Fresh`、`PendingRefresh`、`Stale`、`Unsupported`、`Unknown` | fresh ok、outdated |
| `CapabilitySupportState` | `Supported`、`FakeOnly`、`Pending`、`Unsupported` | production-ready、fake passed |
| `PackageCandidateStatus` | `Draft`、`NotVerified`、`Verified`、`Stable`、`Rejected`、`Superseded` | `Built`、published、release-ready、概要层 `Failed` 作为正式状态 |
| `EvidenceResult` | `NotVerified`、`Passed`、`Failed`、`Skipped` | redacted passed、success without evidence |
| `EvidenceRedactionStatus` | `Unredacted`、`Redacted` | passed-by-redaction |
| `CompatibilityDecisionState` | `PendingEvidence`、`Compatible`、`RequiresMigration`、`Breaking`、`Rejected` | ok、minor、major |
| `DeprecatedApiLifecycleState` | `Announced`、`Deprecated`、`PendingRemoval`、`Removed`、`Superseded` | hidden removed、silent removal |

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 仍按旧对象列测试，没有覆盖 `03` §15 的模块、接口、状态、幂等、配置和脚本最小切口 |
| 新版 `02-概要设计.md` | 能提供测试对象来源，但部分状态表达仍是概要层口径，测试断言必须落到 `03` 正式 enum |
| 新版 `03-详细设计.md` | 已足够抽取 P0 测试对象与切口，尤其 §15 已给出最小验证清单 |
| 新版 `04-配置设计.md` | 已足够抽取配置测试对象，特别是 profile、strict JSON、sensitive boundary、fail-fast 和 artifacts / reports 路径 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 测试对象来源 | 旧 `ProtoRefLock`、binding artifact、wrapper、subscription、release manifest | `03` 的 domain object、service、port、adapter、protocol、state、config、observability 和 script 契约 |
| 测试切口组织 | 按旧功能链粗略罗列 | 按对象、service、adapter、protocol、状态、事务、幂等、配置、观测分组 |
| 状态断言 | 混用口语状态和旧状态 | 固定使用 `03` §9 正式 enum variant |
| 负向测试 | 主要是 ref mismatch、redaction miss、partial release | 覆盖字段缺失、DTO 构造失败、引用混同、raw body、fake marker、config forbidden、query 写 truth |
| 脚本 / 证据 | 路径待定 | 承接 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 redaction check |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否按技术层级直接列 unit / integration / e2e | 不这样做 | Step 3 先按设计对象和风险切口抽取，分层由 Step 4 决定 |
| 是否把所有 `Ref` 类型都单独列为测试对象 | 不全部单列 | 只对承担不变量的 `UpstreamVersionRef`、`ServiceCapabilityRef`、`MigrationGuideRef` 单列；普通 ref 作为字段切口 |
| 是否将 Python / TypeScript package surface 当作 domain truth | 不当作 truth | 它们是 package surface，测试其 smoke 和一致性，但不让它们定义第二套对象 |
| 是否以概要状态为测试断言 | 不采用 | 测试断言以 `03` 正式 enum 为准，概要层差异进入风险说明 |
| 是否在本步生成用例 ID | 不生成 | Step 6 才把切口落成可执行用例 |

## 7. 结构化中间产物

### 7.1 测试对象与测试切口总表

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| Domain objects and policies | `03` §5.3 / §6.1 / §9 | 对象不变量、状态门禁、policy guard | 核心语义或安全边界失效 | unit |
| Application services | `03` §5.5 / §8 / §10 | 编排顺序、UoW、idempotency、projection、outbox | 状态副作用和事务不一致 | service |
| Repositories and projections | `03` §10 / §12 | version、unique key、read model rebuild | 并发覆盖或 query 读错 | integration |
| Source / boundary / runner adapters | `03` §13 / §15 | source failure、fake marker、runner result、artifact ref | 外部依赖失败被伪装成功 | integration |
| Protocols and DTOs | `03` §7 / §8 | schema roundtrip、metadata、missing fields、error mapping | DTO 缺口导致实现脑补字段 | contract |
| State machines | `03` §9 | allowed / forbidden transitions、candidate gate | 非法状态进入主线 | unit + service |
| Config loader / validator / builder | `04` §12 / `03` §13 | profile、strict JSON、cross-field、raw secret、forbidden toggles | 配置绕过设计红线 | config integration |
| Observability and evidence output | `03` §14 / §15.4 | logs、metrics、audit、artifacts、reports、redaction scan | 证据不可验收或泄露正文 | integration + gate |
| Client / CLI / job entries | `03` §4 / §7 / §15.4 | Rust client、CLI command、job binary、exit code、receipt | 入口绕过 service 或发明错误 | integration |

### 7.2 Step 4 分层输入清单

| 风险类型 | Step 4 需要决定的测试层 |
|---|---|
| object invariant / enum transition | unit |
| service orchestration / UoW / idempotency | service |
| repository / adapter / artifact / report / config | integration |
| protocol schema / DTO / event / job input | contract |
| language package / docs / smoke / candidate gate | smoke / release gate |
| redaction / forbidden body / fake marker | unit + integration + CI gate |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §3 时摘录。

```markdown
## 3. 测试对象与测试切口

> 校准来源：
> - `design-calibration/05_test_plan_step_03_test_objects_slices.md`

本轮测试对象从 `02-概要设计.md` 的主要组成部分、关键对象、接口、处理流、状态和配置影响抽取，并以 `03-详细设计.md` 的模块、对象、trait / port / adapter、协议、函数流、状态矩阵、事务、错误、幂等、配置、观测和最小测试切口作为可断言真相源。状态断言必须使用 `03` §9 正式 enum variant。

P0 测试切口覆盖 domain object / value object / policy、application service、repository / projection / outbox、source / boundary / runner adapter、Command / Query / Event / Job protocol、状态机、事务一致性、幂等与并发、配置 loader / validator / builder、观测审计和 artifacts / reports 证据输出。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| `02` 中出现的概要层 `PackageCandidateStatus=Failed` 是否进入测试断言 | 不进入,测试以 `03` 的正式 `Rejected` / `Superseded` 等 enum 为准 | SOP 要求字段、状态和协议名优先使用详细设计正式名称 |
| 是否需要后续回写 `02` 以消除状态名称漂移 | 是,但不阻塞测试方案继续 | 现在 `03` 已能作为测试真相源;正式一致性可在后续文档清理中处理 |
| Python / TypeScript package surface 是否单独做 domain unit test | 不做 domain unit,做 package smoke 和 surface consistency | package surface 不拥有 SDK truth |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 domain object / policy 切口明确 | 已满足 |
| P0 application service 切口明确 | 已满足 |
| repository / adapter / worker 切口明确 | 已满足 |
| Command / Query / Event / Job 切口明确 | 已满足 |
| 状态机、事务、幂等和错误恢复切口明确 | 已满足 |
| 负向字段、DTO 和引用混同切口明确 | 已满足 |
| 正式状态名口径明确 | 已满足 |

Step 4 可以在本文件被确认后开始,主题是制定测试策略与分层。
