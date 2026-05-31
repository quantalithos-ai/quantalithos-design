## Step 2. 明确本轮实现范围和非范围

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 2
- 回填章节：`projects/L0-sdk/03-详细设计.md` §2 本次详细设计目标与范围

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 已确认的上游关系映射、旧版 `03` 诊断和本文必须回答 / 不再回答范围 | 作为本步范围裁剪的直接输入 |
| `projects/L0-sdk/02-概要设计.md` §2 | 概要设计目标、范围和设计深度口径 | 防止详细设计回退成需求或架构讨论 |
| `projects/L0-sdk/02-概要设计.md` §4~§12 | 代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、配置影响和详细设计承接清单 | 裁剪本轮必须覆盖的模块、对象、接口、流程和状态机 |
| `projects/L0-sdk/02-概要设计.md` §13 | 设计风险与待确认事项 | 识别哪些内容只能保守推进或放入 Step 18 |
| `standards/document/详细设计书写规范.md` | 详细设计 18 章主链和实现契约粒度 | 限制本步目标必须是实现契约目标 |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物结构、逐 Step 纪律和正式文档追溯要求 | 作为本文件结构约束 |

已确认结论：

```text
本轮详细设计覆盖 L0-sdk 的 P0 可实现闭环:
semantic baseline -> upstream derived views -> service / event client views -> cross-cutting policies -> package candidate -> verification evidence -> compatibility / deprecated visibility。

本轮详细设计也必须覆盖支撑该闭环的文件布局、对象、trait、DTO、处理流、状态机、持久化、配置引用、审计、可观测性、测试切口和实施承接。

本轮不展开公共 registry 发布、全量 L1/L2/L3/L4 service client 覆盖、完整 MCP / REST / GraphQL / REPL、本地缓存 / 离线状态、auth provider / gateway / governance 或 UI / runtime 状态。
```

依赖的前序 Step：

```text
Step 1 已确认详细设计直接承接 00 / 01 / 02 v0.2.0,旧版 03 只作为问题诊断材料。
```

### 3. SOP 问题回答

1. 本轮详细设计必须覆盖哪些模块？

   回答：本轮必须覆盖两类模块：官方客户端 P0 主线模块和实现支撑模块。主线模块来自概要设计 §5 的七个主要组成部分；实现支撑模块来自概要设计 §4 的实现分层、§11 的配置影响和 §12 的详细设计承接清单。

2. 本轮必须定义哪些对象、接口、事件、job 和状态机？

   回答：必须定义 `02-概要设计.md` §6 / §7 / §9 / §12 已收稳的所有关键主语，包括 21 个关键对象、6 个 Command API、12 个 Query API、4 个 Inbound Event Consumer、7 个 Outbound Event、8 个 Operations Job，以及 `SnapshotFreshnessState`、`CapabilitySupportState`、`PackageCandidateStatus`、`VerificationEvidence` result / marker、`CompatibilityDecision`、`DeprecatedApiRecord` 等状态主语。

3. 哪些能力属于 P1 / 后续阶段，不应在本轮展开？

   回答：公共 registry 发布、release rollback、完整 MCP / REST / GraphQL gateway、REPL / playground、本地缓存 / 离线状态、全量服务能力覆盖、生产级 endpoint 矩阵、完整语言生态发布流水线、auth / identity / governance、UI / runtime state、服务端业务逻辑和 bus runtime truth 都不进入本轮详细设计。它们可以保留引用边界或扩展点，但不得写成 P0 必须实现的代码契约。

4. 哪些内容属于测试方案、实施计划、配置设计或运维手册？

   回答：详细设计只写实现契约和最小测试切口。完整测试矩阵、测试脚本、报告目录、验收证据、commit boundary、开发阶段、公共发布操作、配置 JSON 示例、环境变量说明、secret 挂载方式、生产部署拓扑和运维 playbook 分别交给 `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 或运维文档。

5. 实现者拿到本文后，应能完成哪些代码范围？

   回答：实现者拿到正式 `03-详细设计.md` 后，应能在目标实现仓完成 L0-sdk 的 P0 可运行代码骨架和可验证闭环：模块 / package 布局、SDK local truth 对象、派生视图、service / event client boundary、横切 policy、candidate / evidence、compatibility / deprecated、DTO / handler / job、repository / port / adapter、状态矩阵、配置绑定、审计和测试切口。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` §1 / §2 | 范围仍围绕 proto-ref、generated binding、wrapper、subscription helper、release orchestration | 会把新版 official client access layer 主线拉回旧 binding / release 口径 |
| 旧版 `03-详细设计.md` §2 | 内容采集流程没有区分本轮实现范围、P1 后续能力和其他文档范围 | 实现者容易把公共发包、完整工具链、配置说明、测试矩阵都混进详细设计 |
| 旧版对象范围 | ProtoRefLock、BusContractRef、GeneratedBindingArtifact、RustSdkClient 等旧对象作为主线 | 与新版 `SdkSemanticBaseline`、`DerivedBindingView`、`PackageCandidate`、`VerificationEvidence` 等对象不一致 |
| 旧版流程范围 | codegen -> wrapper、client request、example -> smoke -> release | 缺少上游 freshness、formal API / fake boundary、candidate evidence、compatibility / deprecated 等新主线 |
| 当前 `02-概要设计.md` | 已给出承接清单，但没有替代详细设计范围表 | 需要本 Step 把承接清单转成正式详细设计范围 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 本轮主线 | binding / wrapper / subscription / release | semantic baseline -> derived views -> service / event views -> policies -> candidate / evidence -> compatibility | 对齐新版需求、架构和概要设计 |
| 范围表达 | 以旧对象和粗略采集流程表达 | 以模块、对象、接口、事件、job、状态机和横切契约表达 | 支撑后续 1:1 实现 |
| P1 能力 | 散落或隐含 | 显式列出后续能力和本轮处理口径 | 防止实现阶段范围膨胀 |
| 文档边界 | 详细设计混入配置、测试、实施和发布内容 | 详细设计只写实现契约，其他文档各自承接 | 保持文档职责清晰 |
| 实现者交付 | 不清楚拿到 `03` 后能写到什么程度 | 明确应能完成 P0 可运行代码骨架和可验证闭环 | 满足“按详细设计 1:1 还原实现”的要求 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只覆盖最小三语言 package wrapper | 文档短，接近旧草案 | 会遗漏 semantic baseline、freshness、candidate、evidence、compatibility 和安全边界 | 不采用 |
| 方案 B：覆盖 P0 official client access 闭环和必要横切契约，P1 只保留扩展边界 | 能支撑可运行闭环，又不会把公共发包、全量覆盖和运维专项提前写死 | 需要 Step 6~15 比较细地展开 | 采用 |
| 方案 C：一次覆盖完整服务生态、公共发布、REST / GraphQL / MCP / REPL、本地缓存和运维 | 看似完整 | 范围过大，且多个上游决策未稳定，会拖慢核心闭环实现 | 不采用 |

推荐方案：方案 B。

原因：

- `L0-sdk` 是基础接入层，P0 必须形成可验证闭环，不能只写 wrapper 或只写代码生成。
- 公共发包、全量服务覆盖、REST / GraphQL / MCP / REPL 和本地缓存需要更多需求裁剪与架构输入，放入本轮会污染详细设计。
- 方案 B 能让另一个 agent 先完成可编译、可测试、可运行的默认路径，同时为后续生态增强保留正确接缝。

### 7. 结构化中间产物

#### 7.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 定义 P0 official client access 实现契约 | 覆盖 semantic baseline、derived view、service / event client view、cross-cutting policy、candidate evidence 和 compatibility | 实现者可以按模块完成 command、consumer、job、query、policy 和 evidence 路径 |
| 定义对象和状态实现契约 | 把概要设计 §6 / §9 的对象和状态补成 Rust 类型、字段、函数和状态矩阵 | 实现者可以创建 domain model、value object、record、policy 和 enum |
| 定义端口和适配边界 | 把 source port、formal API / fake adapter、bus boundary、runner、builder、repository 等补成 trait | 实现者可以实现默认 adapter、test double 和替换边界 |
| 定义函数级处理流 | 把概要设计 §8 的处理流展开到 handler -> service -> domain / policy -> repository / port -> event / result | 实现者可以还原关键函数调用链、事务边界和失败分支 |
| 定义横切契约 | 覆盖错误、幂等、并发、配置引用、审计、可观测性和测试切口 | 实现者不用临时发明错误模型、锁、配置加载、审计和测试结构 |
| 定义实施承接边界 | 把详细设计可实现内容交给实施计划继续拆分 | 实施计划可以按功能边界和依赖顺序组织开发 |

#### 7.2 本轮范围表

| 范围 | 必须展开到的深度 |
|---|---|
| 实现单元与文件布局 | crate / module / package / file / binary / test 目录级别，具体由 Step 4 定义 |
| 模块实现契约 | 每个主要模块的职责、对象、trait、service、handler、repository、error、测试切口 |
| 对象实现契约 | struct / enum / value object / policy 的字段、类型、函数签名、Rustdoc 注释和禁止事项 |
| 协议实现契约 | Command / Query / Consumer / Event / Job 的 DTO、response、schema、handler、错误映射 |
| 函数级处理流 | 逐接口说明对象.函数(Type 参数名) 调用、事务、幂等、audit、event 和失败分支 |
| 状态机 | 状态枚举、允许迁移、禁止迁移、状态守卫、非法迁移错误和状态测试 |
| 持久化与一致性 | repository、unit of work、transaction ordering、outbox、projection、candidate / evidence 一致性 |
| 配置实现契约 | RuntimeConfig、ConfigLoader、ConfigValidator、builder 注入和禁止配置化校验 |
| 可观测性与测试切口 | audit、trace、metric、log、report evidence、contract test 和 negative test |

#### 7.3 必须覆盖的模块范围

| 模块范围 | 必须覆盖 | 不在本步提前决定 |
|---|---|---|
| 官方客户端语义核心 | semantic baseline、client capability model、cross-language concept map、baseline service | 具体 crate / 文件名由 Step 4 决定 |
| 上游契约消费与派生视图 | contract consumption service、core / bus / formal API source port、derived view、language view、freshness state | 具体 source adapter 和生成器选择由 Step 7 / Step 14 裁剪 |
| 平台能力访问与正式边界适配 | service client view、formal API boundary adapter、fake boundary adapter、runtime call / read DTO | 全量 L1/L2/L3/L4 client 覆盖不进入本轮 |
| 事件客户端视图 | bus event client view、event semantic mapping、publish / subscription boundary | 不实现 `L0-bus` runtime truth |
| 横切默认行为 | error mapping、trace propagation、redaction、credential protection、boundary guard | 不执行 auth / governance 决策 |
| package candidate 与验证证据 | candidate aggregate、language artifacts、smoke / docs / boundary evidence、runner port | 公共 registry 发布和 release rollback 后移 |
| 文档兼容与演进 | compatibility decision、deprecated record、migration guide ref、docs example validation | 完整文档站点和发布运营不进入本轮 |
| 实现支撑 | config、repository、outbox、projection、observability、audit、test slices | 配置填写说明、完整测试方案和实施计划后移 |

#### 7.4 必须定义的对象、接口、事件、job 和状态机

| 类型 | 本轮必须定义 |
|---|---|
| Domain / record / value object / policy | `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap`、`DerivedBindingView`、`LanguageBindingView`、`UpstreamVersionRef`、`SnapshotFreshnessState`、`ServiceClientView`、`ServiceCapabilityRef`、`BusEventClientView`、`EventSemanticMapping`、`ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`BoundaryGuard`、`PackageCandidate`、`VerificationEvidence`、`CompatibilityDecision`、`DeprecatedApiRecord`、`MigrationGuideRef` |
| Command API | `UpdateSdkSemanticBaseline`、`RefreshDerivedBindingView`、`InvokeServiceCapability`、`PublishBusEvent`、`RecordCompatibilityDecision`、`DeprecateSdkApi` |
| Query API | `GetSdkCapabilitySummary`、`GetUpstreamVersionRefs`、`GetSnapshotFreshness`、`GetServiceClientView`、`GetEventClientView`、`ReadServiceCapability`、`OpenEventSubscription`、`GetPackageCandidateStatus`、`GetVerificationEvidence`、`GetCompatibilityDecision`、`ListDeprecatedApis`、`GetMigrationGuideRef` |
| Inbound Event Consumer | `ConsumeCoreContractChanged`、`ConsumeBusSemanticChanged`、`ConsumeFormalApiChanged`、`ConsumeValidationRunFinished` |
| Outbound Event | `SdkSemanticBaselineChangedEvent`、`SdkSnapshotFreshnessChangedEvent`、`SdkClientViewFreshnessChangedEvent`、`PackageCandidateGeneratedEvent`、`VerificationEvidenceRecordedEvent`、`CompatibilityDecisionRecordedEvent`、`DeprecatedApiRecordedEvent` |
| Operations Job | `CheckUpstreamFreshness`、`GeneratePackageCandidate`、`BuildLanguagePackages`、`RunCrossLanguageSmoke`、`ValidateDocsExamples`、`CheckCompatibility`、`VerifyBoundaryPolicies`、`RebuildSdkProjections` |
| 状态主语 | `SnapshotFreshnessState`、`CapabilitySupportState`、`PackageCandidateStatus`、`VerificationEvidence` result / marker、`CompatibilityDecision`、`DeprecatedApiRecord` |
| Port / repository / adapter | source ports、formal API boundary port、fake fixture endpoint port、bus boundary port、language binding generator port、package builder port、smoke runner port、docs example runner port、evidence repository、candidate repository、version ref repository、projection repository、outbox publisher port |

#### 7.5 P1 / 后续能力表

| P1 / 后续能力 | 本轮处理口径 | 原因 |
|---|---|---|
| 公共 registry 发布、release rollback、跨生态发布运营 | 只保留 candidate / stable 本地基线和 artifact ref | 当前 P0 不以公共注册表为前置 |
| 全量 L1/L2/L3/L4 service client 覆盖 | 只定义 formal API / fake boundary 和 service capability view | 全量覆盖顺序仍需后续裁剪 |
| 完整 MCP / REST / GraphQL gateway | 不进入本轮实现契约 | 这些属于 gateway / protocol facade 或后续接入增强 |
| REPL / playground / 本地缓存 / 离线状态 | 不进入本轮实现契约 | 需求和架构已排出当前 P0 |
| auth provider / identity / governance | 只透传 actor / client call context / credential ref | SDK 不执行认证、授权或治理审批 |
| UI / runtime state | 不进入本轮实现契约 | UI 与 runtime 状态属于下游仓 |
| 生产服务 endpoint 矩阵 | 只定义 formal API / fake target adapter 边界 | 具体稳定服务目标由测试方案和验收标准确认 |
| 完整配置手册和部署环境矩阵 | 详细设计只定义配置类型和绑定点 | 填写说明交给 `04-配置说明.md` |

#### 7.6 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、业务规则、数据归属重新定义 | `00-需求文档.md` |
| 系统上下文、限界上下文、技术选型、部署拓扑重新取舍 | `01-架构设计.md` / 架构专项 |
| 主要组成部分、关键对象、接口名、处理流名、状态集合重新命名 | `02-概要设计.md` 对应 Step |
| `L0-core` 的 proto / DTO、ErrorCode、TraceContext、Metadata、CloudEvents schema 定义 | `projects/L0-core` |
| `L0-bus` 的 publication / delivery / retry / DLQ / replay / tap truth 实现 | `projects/L0-bus` |
| 完整配置 JSON 示例、默认值、配置项填写说明、环境变量说明 | `04-配置设计.md` |
| 完整测试矩阵、测试脚本、测试报告和证据归档格式 | `05-测试方案.md` |
| 验收项、验收人、验收证据和通过 / 不通过标准 | `06-验收标准.md` |
| 实施阶段、commit boundary、编码顺序、提交规范、报告产物 | `07-实施计划.md` |
| 生产部署拓扑、集群参数、备份恢复演练、日常运维 playbook | 运维手册 / 部署文档 |

#### 7.7 实现者可完成代码范围图

```text
Formal 03 implementation scope
|
+-- Project structure and module / package layout
+-- SDK local truth objects, value objects, records, policies and state enums
+-- Command / Query / Consumer / Job handlers and application services
+-- Repository / UnitOfWork / Port / Adapter traits
+-- Default verifiable adapters and test doubles
+-- Derived views, candidate, evidence, compatibility and deprecated records
+-- Persistence, transaction, idempotency, outbox and projection contracts
+-- Runtime config structs, loader, validator and builder injection
+-- Error model, recovery behavior, concurrency guard and observability markers
+-- Test slices required by 05-test-plan
```

关键说明：

- 图中范围是详细设计必须支持的代码范围，不是一次 commit 或一个 sprint 的拆分。
- production endpoint matrix、public registry release、gateway / REPL / local cache 等能力可以保留扩展边界，但不作为本轮 P0 实现目标。
- 正式 `03` 应足以让实现者完成可编译、可测试、可运行的默认路径，不依赖额外口头约定。

### 8. 回填草稿

正式 `03-详细设计.md` §2 “本次详细设计目标与范围”应摘录并整理：

- 本文件 `7.1` 设计目标表
- 本文件 `7.2` 本轮范围表
- 本文件 `7.3` 必须覆盖的模块范围
- 本文件 `7.4` 必须定义的对象、接口、事件、job 和状态机
- 本文件 `7.5` P1 / 后续能力表
- 本文件 `7.6` 非范围表

实现者可完成代码范围图可作为 §2 的范围说明图保留。

### 9. 待确认事项

- 无阻塞进入 Step 3 的待确认事项。
- P0 最小验证目标使用真实服务 endpoint 还是 fake / fixture target，继续交由 Step 16、测试方案和验收标准收口。
- `VerificationEvidence` 拆分、`RequiresMigration` stable 门禁、`RuntimeConfig` 拆分方式继续作为后续 Step 输入，不在 Step 2 写成稳定实现契约。

### 10. 进入下一步条件

- [x] 已明确本轮详细设计必须覆盖哪些模块。
- [x] 已明确本轮必须定义哪些对象、接口、事件、job 和状态机。
- [x] 已明确哪些能力属于 P1 / 后续阶段。
- [x] 已明确测试方案、实施计划、配置设计和运维文档的边界。
- [x] 已明确实现者拿到正式 `03` 后应能完成的代码范围。
