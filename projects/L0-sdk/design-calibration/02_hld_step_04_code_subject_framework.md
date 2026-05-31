## Step 4. 代码主体框架映射

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 4
- 回填章节：`projects/L0-sdk/02-概要设计.md` §4 代码主体框架总览

### 2. 本步输入

- Step 2 已收敛的本次概要设计目标与范围：
  - `projects/L0-sdk/design-calibration/02_hld_step_02_scope.md` §7.1 ~ §7.4
- Step 3 已收敛的结构性约束：
  - `projects/L0-sdk/design-calibration/02_hld_step_03_constraints.md` §7.1 ~ §7.3
- 架构设计中已收稳的主要语义上下文和运行承载：
  - `projects/L0-sdk/01-架构设计.md` §6 / §7 / §8 / §9 / §10 / §11
- 已确认边界：
  - 本步只建立“架构机制 -> 代码主体骨架”的映射。
  - 本步不写 crate / package / module / file tree。
  - 本步不写完整 trait、struct、字段、函数签名、协议 schema 或测试用例。

### 3. SOP 问题回答

1. 架构层已经收稳的模块，分别应落到哪些代码主体骨架上？

   回答：官方客户端语义核心应落到 `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap` 等共同语义主体；上游契约消费上下文应落到 `CoreContractSnapshotService`、`BusSemanticSnapshotService`、`UpstreamVersionRef`、`DerivedBindingView` 等派生视图主体；平台能力访问上下文应落到 `ServiceClientAssemblyService`、`FormalApiBoundaryAdapter`、`FakeBoundaryAdapter` 和 `ServiceClientView`；事件客户端视图应落到 `EventClientAssemblyService`、`BusEventClientView` 和 `EventSemanticMapping`；横切默认行为应落到 `ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`；candidate 与验证上下文应落到 `PackageCandidateService`、`CandidateValidationService`、`CrossLanguageSmokeJob`、`VerificationEvidence`；文档兼容演进应落到 `DocsExampleValidationService`、`CompatibilityGovernanceService`、`DeprecatedApiRecord` 和 `MigrationGuideRef`。

2. 哪些主体属于 Inbound / Operations，哪些属于 Application Services？

   回答：Inbound / Operations 在 SDK 仓不是线上服务入口，而是 public client entry、validation trigger 和 maintenance job 的概要主语。它包括 `SdkClientEntry`、`ServiceClientEntry`、`EventClientEntry`、`CapabilityQueryEntry`、`GenerateCandidateTrigger`、`RunSmokeTrigger`、`ValidateDocsTrigger`、`CompatibilityCheckTrigger`。Application Services 包括 `SdkSemanticBaselineService`、`ContractConsumptionService`、`ServiceClientAssemblyService`、`EventClientAssemblyService`、`CrossLanguageConsistencyService`、`PackageCandidateService`、`CandidateValidationService`、`CompatibilityGovernanceService`、`DocsExampleValidationService`。

3. 哪些主体属于 Domain Model，哪些属于 Ports / Persistence / Projection / Outbox？

   回答：Domain Model 包括 `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap`、`LanguageBindingView`、`DerivedBindingView`、`ServiceClientView`、`BusEventClientView`、`PackageCandidate`、`VerificationEvidence`、`CompatibilityDecision`、`DeprecatedApiRecord`、`UpstreamVersionRef`、`SnapshotFreshnessState`。Policies 包括 `ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`CompatibilityPolicy`、`BoundaryGuard`。Ports / Projection 包括 `CoreContractSourcePort`、`BusSemanticSourcePort`、`FormalApiBoundaryPort`、`FakeFixtureEndpointPort`、`LanguageBindingGeneratorPort`、`PackageBuilderPort`、`SmokeRunnerPort`、`DocsExampleRunnerPort`、`EvidenceRepository`、`CandidateRepository`、`VersionRefRepository`、`SdkCapabilityProjection`、`CompatibilityProjection`、`EvidenceProjection`。

4. 哪些名称必须在概要设计层先点名，否则详细设计会重新发明主语？

   回答：必须点名 `SdkSemanticBaseline`、`CrossLanguageConceptMap`、`ContractConsumptionService`、`DerivedBindingView`、`ServiceClientAssemblyService`、`FormalApiBoundaryAdapter`、`EventClientAssemblyService`、`BusEventClientView`、`ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`PackageCandidate`、`CandidateValidationService`、`VerificationEvidence`、`CompatibilityDecision`、`DeprecatedApiRecord`、`SnapshotFreshnessState`。这些名称会直接影响 Step 5~9 的组成部分、对象、接口、流程和状态机。

5. 哪些内容已经是代码目录、文件路径或框架实现，不应在本步展开？

   回答：Rust workspace / single crate 选择、Python package 目录、TypeScript package 目录、module path、文件名、完整 public SDK API 签名、HTTP / RPC / event schema、generator 产品选择、package manager、CI 命令、测试 fixture、reports / artifacts 字段、公共注册表发布流程都不进入本步。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` §5 | 继续画系统上下文图,重复架构设计 | 没有把架构语义转译为代码主体框架 |
| 旧 §6 | 主要组成部分偏 binding / wrapper / event / docs / release 的旧产品说明 | 没有把官方语义核心、派生视图、formal API / fake adapter、candidate evidence 和横切默认拆成可实现主体 |
| 旧全文 | 未区分业务主要组成部分和实现分层 | 容易把 `SdkClientEntry`、`PackageCandidateService`、`RedactionPolicy` 等不同层主语混在同一级 |
| 旧全文 | 缺少 stale / pending / unsupported / not verified 等状态主体入口 | 后续状态机容易只围绕 release 或 package 状态展开 |
| 旧全文 | 对 `L0-core` / `L0-bus` 的消费仍偏“生成 binding”和“订阅封装” | 容易遗漏上游版本引用、快照新鲜度和 bus semantic view 边界 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 主体来源 | 按 binding、wrapper、event、docs、release 旧主题组织 | 按官方语义、上游消费、能力访问、事件视图、横切默认、candidate 验证、文档兼容组织 | 对齐新版架构主线 |
| 架构到代码映射 | 重复系统上下文和产品说明 | 点名 entry、application service、domain object、policy、port、projection、job | 支撑详细设计继续展开 |
| 三语言表达 | 容易按 Rust / Python / TypeScript 平铺 | 先固定共同语义基线,再承接语言表达 | 防止语言目录取代平台语义 |
| 上游消费 | 偏 raw binding generation | 收敛为上游契约派生视图、版本引用和快照新鲜度 | 避免重新定义 core / bus truth |
| 验证承载 | 偏 release / CI 结果 | 收敛为 package candidate、validation service、smoke job、evidence projection | 对齐当前 P0 成立标准 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按 Rust / Python / TypeScript 三语言目录建框架 | 看起来接近实现 | 会让语言表达压过官方语义基线,也会提前进入目录设计 | 不采用 |
| 方案 B：按 binding / wrapper / docs / release 旧产品主题建框架 | 能复用旧文档内容 | 无法承接 formal API / fake adapter、evidence、snapshot freshness 和 compatibility 主线 | 不采用 |
| 方案 C：按架构语义机制建代码主体框架,再用实现分层视图安放入口、服务、对象、策略、端口和投影 | 既保留 SDK 业务主线,也能指导详细设计落代码主体 | 需要维护两张图和一组正式主语 | 采用 |

### 7. 结构化中间产物

#### 7.1 架构模块到代码主体映射图

```text
L0-sdk
|
+-- 1. 官方客户端语义核心
|   +-- SdkSemanticBaseline                 SDK 共同语义基线
|   +-- ClientCapabilityModel               官方 client 能力模型
|   +-- CrossLanguageConceptMap             三语言概念映射
|   +-- SdkSemanticBaselineService          维护共同语义和一致性
|
+-- 2. 上游契约消费与派生视图
|   +-- ContractConsumptionService          编排 core / bus / formal API 消费
|   +-- CoreContractSnapshotService         承接 L0-core 派生快照
|   +-- BusSemanticSnapshotService          承接 L0-bus 语义快照
|   +-- DerivedBindingView                  派生 binding 消费视图
|   +-- UpstreamVersionRef                  上游版本引用
|   +-- SnapshotFreshnessState              快照新鲜度状态
|
+-- 3. 平台能力访问与正式边界适配
|   +-- SdkClientEntry                      SDK public client 入口
|   +-- ServiceClientEntry                  服务能力 client 入口
|   +-- ServiceClientAssemblyService        组装服务 client 视图
|   +-- FormalApiBoundaryAdapter            formal API 边界适配
|   +-- FakeBoundaryAdapter                 fake / fixture 验证边界适配
|   +-- ServiceClientView                   服务 client 视图
|
+-- 4. 事件客户端视图
|   +-- EventClientEntry                    事件 client 入口
|   +-- EventClientAssemblyService          组装事件 client 视图
|   +-- BusEventClientView                  bus 语义事件 client 视图
|   +-- EventSemanticMapping                事件语义映射
|
+-- 5. 横切默认行为
|   +-- ErrorMappingPolicy                  错误映射默认策略
|   +-- TracePropagationPolicy              trace 传播默认策略
|   +-- RedactionPolicy                     redaction 默认策略
|   +-- CredentialProtectionPolicy          凭据材料保护策略
|   +-- BoundaryGuard                       禁止正文和越界能力保护
|
+-- 6. package candidate 与验证证据
|   +-- GenerateCandidateTrigger            candidate 生成触发
|   +-- RunSmokeTrigger                     smoke 验证触发
|   +-- PackageCandidateService             编排 package candidate
|   +-- CandidateValidationService          编排验证证据
|   +-- CrossLanguageSmokeJob               跨语言 smoke job
|   +-- PackageCandidate                    package candidate 真相对象
|   +-- VerificationEvidence                验证证据对象
|
+-- 7. 文档、兼容与演进
    +-- CapabilityQueryEntry                能力 / 版本查询入口
    +-- ValidateDocsTrigger                 文档示例验证触发
    +-- CompatibilityCheckTrigger           兼容检查触发
    +-- DocsExampleValidationService        示例验证编排
    +-- CompatibilityGovernanceService      兼容和 deprecated 编排
    +-- CompatibilityDecision               兼容判断对象
    +-- DeprecatedApiRecord                 deprecated 记录
    +-- MigrationGuideRef                   迁移说明引用
```

关键说明：

- 该图表达架构机制如何落成概要设计层代码主体骨架,不是 Rust / Python / TypeScript 目录树。
- `1~7` 是后续 Step 5 的业务主要组成部分候选,其中每一部分都可能跨多个实现分层。
- `Entry` 和 `Trigger` 是入口 / 触发主体,不是领域真相对象。
- `FormalApiBoundaryAdapter`、`FakeBoundaryAdapter`、`CoreContractSnapshotService` 和 `BusSemanticSnapshotService` 表达边界,不代表具体协议、生成器或服务仓源码依赖已定案。

#### 7.2 实现分层视图

```text
调用方 / 验证任务 / 维护任务
  - product / runtime / automation / integration caller
  - package validation runner
  - docs example runner
  - compatibility checker
        |
        v
+--------------------------------------------------------------+
| Inbound / Operations                                         |
| - SdkClientEntry / ServiceClientEntry / EventClientEntry      |
| - CapabilityQueryEntry                                       |
| - GenerateCandidateTrigger / RunSmokeTrigger                 |
| - ValidateDocsTrigger / CompatibilityCheckTrigger            |
+-----------------------------+--------------------------------+
                              |
                              v
+--------------------------------------------------------------+
| Application Services                                         |
| - SdkSemanticBaselineService                                 |
| - ContractConsumptionService                                 |
| - ServiceClientAssemblyService                               |
| - EventClientAssemblyService                                 |
| - CrossLanguageConsistencyService                            |
| - PackageCandidateService / CandidateValidationService        |
| - CompatibilityGovernanceService                             |
| - DocsExampleValidationService                               |
+-----------------------------+--------------------------------+
                              |
                              v
+--------------------------------------------------------------+
| Domain Model / Policies                                      |
| - SdkSemanticBaseline / ClientCapabilityModel                |
| - CrossLanguageConceptMap / LanguageBindingView              |
| - DerivedBindingView / ServiceClientView / BusEventClientView|
| - PackageCandidate / VerificationEvidence                    |
| - CompatibilityDecision / DeprecatedApiRecord                |
| - UpstreamVersionRef / SnapshotFreshnessState                |
| - ErrorMappingPolicy / TracePropagationPolicy                |
| - RedactionPolicy / CredentialProtectionPolicy               |
| - CompatibilityPolicy / BoundaryGuard                        |
+-----------------------------+--------------------------------+
                              |
                              v
+--------------------------------------------------------------+
| Ports / Projection / Artifact / Adapter                      |
| - CoreContractSourcePort / BusSemanticSourcePort             |
| - FormalApiBoundaryPort / FakeFixtureEndpointPort            |
| - LanguageBindingGeneratorPort / PackageBuilderPort          |
| - SmokeRunnerPort / DocsExampleRunnerPort                    |
| - EvidenceRepository / CandidateRepository                   |
| - VersionRefRepository / PackageArtifactStorePort            |
| - SdkCapabilityProjection / CompatibilityProjection          |
| - EvidenceProjection / DocsExampleProjection                 |
+--------------------------------------------------------------+
```

关键说明：

- 分层图表达代码职责如何安放,不表达部署拓扑、package layout、module path 或完整调用链。
- Inbound / Operations 在 SDK 仓表示 public client entry、validation trigger 和 maintenance job,不是线上服务 gateway。
- Application Services 负责编排 SDK 用例、版本引用、candidate 验证和跨语言一致性,不承载上游 truth。
- Domain Model / Policies 承载 SDK 自身 truth、快照状态、兼容状态和横切默认规则,不依赖具体生成器、协议或 public registry。
- Ports / Projection / Artifact / Adapter 承接上游来源、fake / fixture、构建验证、证据存储和只读投影边界。

#### 7.3 业务主要组成部分与实现分层关系说明

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 从架构机制转译而来的功能结构主语,回答 `L0-sdk` 在官方客户端接入层中“做什么”。 |
| 实现分层 | Inbound / Operations、Application Services、Domain Model / Policies、Ports / Projection / Artifact / Adapter,回答代码如何安放这些主体。 |
| 二者关系 | 一个业务主要组成部分通常跨多个实现层。例如“package candidate 与验证证据”会同时包含 trigger、application service、domain object、runner port、repository 和 projection。 |
| 不应混用 | `ServiceClientEntry`、`PackageCandidateService`、`RedactionPolicy` 是代码主体;“平台能力访问与正式边界适配”“横切默认行为”才是概要设计层的业务主要组成部分候选。 |

#### 7.4 关键判断

| 判断项 | 结论 |
|---|---|
| 哪些名称是业务主要组成部分 | 官方客户端语义核心、上游契约消费与派生视图、平台能力访问与正式边界适配、事件客户端视图、横切默认行为、package candidate 与验证证据、文档兼容与演进。 |
| 哪些名称只是实现分层 | Inbound / Operations、Application Services、Domain Model / Policies、Ports / Projection / Artifact / Adapter。 |
| 为什么二者不能混用 | 主要组成部分用于组织业务结构和职责边界;实现分层用于安放代码责任。同一组成部分会跨多个实现层,不能把某个 service、port 或 policy 当成完整业务部分。 |
| 哪些内容不进入本步 | 目录树、文件路径、完整 public API 签名、协议 schema、生成器选择、package manager、CI 命令、测试 fixture、reports / artifacts 字段和公共注册表流程。 |

### 8. 回填草稿

正式 `02-概要设计.md` §4 “代码主体框架总览”直接摘录并润色本文件：

- §7.1 “架构模块到代码主体映射图”
- §7.2 “实现分层视图”
- §7.3 “业务主要组成部分与实现分层关系说明”
- §7.4 “关键判断”

不在本 Step 重复粘贴完整正式章节正文。Step 14 生成正式文档时,再统一补充校准来源、延伸阅读、正式文档语气和交叉引用。

### 9. 待确认事项

- 无阻塞进入 Step 5 的待确认事项。
- 具体 package layout、语言目录、生成器、协议、artifact 格式和 runner 实现继续后移,不得在 Step 4 定案。

### 10. 进入下一步条件

- 已明确架构模块如何映射为代码主体骨架。
- 已明确业务主要组成部分与实现分层的关系。
- 已产出架构模块到代码主体映射图和实现分层视图。
- 未提前下沉到代码目录、文件路径或完整实现定义。
- 已足以进入 Step 5 “主要组成部分、职责与边界”。
