## Step 5. 主要组成部分、职责与边界

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 5
- 回填章节：`projects/L0-sdk/02-概要设计.md` §5 主要组成部分、职责与边界

### 2. 本步输入

- Step 4 已收敛的代码主体框架映射：
  - `projects/L0-sdk/design-calibration/02_hld_step_04_code_subject_framework.md` §7.1 ~ §7.4
- Step 3 已收敛的结构性约束：
  - `projects/L0-sdk/design-calibration/02_hld_step_03_constraints.md` §7.1 ~ §7.3
- 架构设计已收稳的职责边界、数据边界和关键交互：
  - `projects/L0-sdk/01-架构设计.md` §4 / §8 / §9 / §10 / §13

### 3. SOP 问题回答

1. 当前概要设计层面，本仓应被划分为哪些主要组成部分？

   回答：本仓划分为七个主要组成部分：官方客户端语义核心、上游契约消费与派生视图、平台能力访问与正式边界适配、事件客户端视图、横切默认行为、package candidate 与验证证据、文档兼容与演进。它们来自 Step 4 的架构机制映射，不是语言目录、代码分层或运行容器。

2. 每个主要组成部分分别承担什么职责？

   回答：官方客户端语义核心负责 SDK 共同语义和三语言概念一致；上游契约消费负责消费 core / bus / formal API 并形成派生视图；平台能力访问负责服务 client 视图和 formal / fake 边界适配；事件客户端视图负责 bus 语义下的发布 / 订阅 client 体验；横切默认行为负责 error / trace / redaction / credential protection；candidate 验证负责本地 package candidate、smoke 和证据链；文档兼容负责 quickstart、docstring、示例、compatibility、deprecated 和迁移口径。

3. 每个主要组成部分明确不承担什么职责？

   回答：七个组成部分都不重新定义 `L0-core` / `L0-bus` truth，不拥有服务端业务事实，不执行 auth / governance，不保存禁止正文，不把公共发布或完整生态增强写入当前 P0。每个部分还需要守住局部边界：语义核心不被语言目录牵引，上游消费不生成第二契约，能力访问不成为 gateway，事件视图不成为 bus runtime，横切默认不被配置绕开，candidate 验证不等同公共发布，文档兼容不替代正式需求和验收。

4. 每个主要组成部分包含哪些代码主体 / 模块？

   回答：本步只列代码主体 / 模块的名称、类型、作用和后续展开位置。对象字段和函数留给 Step 6，接口分类留给 Step 7，处理流留给 Step 8，状态机留给 Step 9。

5. 这些代码主体 / 模块在本部分中只需要说明到什么粒度？

   回答：只说明“属于哪个组成部分、是什么类型、承担什么作用、后续在哪里展开”。不写 package layout、module path、完整 trait / class / interface、函数签名、DTO schema、生成器命令、测试 fixture 或发布脚本。

6. 哪些内容虽然相关，但必须由相邻部分或边界外能力承担？

   回答：共享契约 truth 由 `L0-core` 承担；事件传递 truth 由 `L0-bus` 承担；服务端业务事实由 L1/L2/L3/L4 formal APIs 背后的服务承担；身份认证和治理审批由安全入口、identity、gateway 或 governance 承担；UI / runtime 状态由 L5/L6 或 L2 runtime 承担；公共注册表运营、完整 MCP、REST / GraphQL gateway、REPL 和本地缓存需要后续重新裁剪。

7. 哪些职责如果不写清，后续最容易让概要设计滑进实现层或让不同部分串线？

   回答：最容易串线的是三语言目录与语义核心、raw binding 与派生视图、service client 与 server gateway、event client 与 bus runtime、redaction 配置与禁止正文边界、candidate evidence 与 public registry、docs example 与验收标准、compatibility decision 与上游版本 truth。本步必须把这些边界写清。

8. 每个主要组成部分分别包含哪些对象发现线索？

   回答：本步按 truth / state / policy / projection / reference / audit / history 维度建立候选池。候选池只用于 Step 6 正式化对象，不定义字段、成员函数或工厂函数。

9. 哪些候选对象必须进入 Step 6 独立成节展开？

   回答：`SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap`、`DerivedBindingView`、`LanguageBindingView`、`UpstreamVersionRef`、`SnapshotFreshnessState`、`ServiceClientView`、`ServiceCapabilityRef`、`BusEventClientView`、`EventSemanticMapping`、`ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`PackageCandidate`、`VerificationEvidence`、`CompatibilityDecision`、`DeprecatedApiRecord`、`MigrationGuideRef` 必须进入 Step 6 独立筛选和展开。

10. 哪些名称只是 API / repository / port / trigger / DTO / 字段类型，不应在 Step 6 被误写成领域对象？

   回答：`SdkClientEntry`、`ServiceClientEntry`、`EventClientEntry`、`CapabilityQueryEntry`、`GenerateCandidateTrigger`、`RunSmokeTrigger`、`ValidateDocsTrigger`、`CompatibilityCheckTrigger`、`CoreContractSourcePort`、`BusSemanticSourcePort`、`LanguageBindingGeneratorPort`、`PackageBuilderPort`、`SmokeRunnerPort`、`DocsExampleRunnerPort`、`EvidenceRepository`、`CandidateRepository`、`VersionRefRepository` 通常进入 Step 7 或详细设计，不作为 Step 6 的领域对象展开。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` §6 | 仍按 binding 生成、三语言 wrapper、事件订阅、文档发版等旧主题切分 | 无法承接新版官方语义、派生视图、adapter、evidence 和 compatibility 主线 |
| 旧 §6 | 语言目录、工具链、文档和 release 主题混在同一级 | 后续容易把目录结构或发布流程误当主要组成部分 |
| 旧全文 | 缺少对象发现维度表 | Step 6 容易只列对象名,无法判断哪些是 truth、state、policy、projection 或 reference |
| 旧全文 | 缺少每个组成部分的非职责 | 后续实现容易吸入 core truth、bus runtime、auth、UI、runtime 或 public registry 职责 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 切分依据 | binding / wrapper / event / docs / release | 官方语义、上游消费、能力访问、事件视图、横切默认、candidate 验证、文档兼容 | 对齐新版架构机制 |
| 主体层次 | 语言目录、实现模块和产品活动混杂 | 主要组成部分只表达概要设计层业务结构主语 | 避免滑入详细设计或实施计划 |
| 对象发现 | 缺少候选池维度 | 按 truth / state / policy / projection / reference / audit / history 建立对象发现入口 | 支撑 Step 6 对象正式化 |
| 边界表达 | 非职责散落 | 每个组成部分写明不承担什么和接缝 | 防止职责膨胀 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按 Rust / Python / TypeScript 三语言切分 | 容易映射到实现目录 | 会让语言表达压过共同语义,且提前进入目录设计 | 不采用 |
| 方案 B：按 binding / wrapper / docs / release 旧主题切分 | 可复用旧文档 | 无法承接 snapshot freshness、formal / fake adapter、candidate evidence 和 compatibility 主线 | 不采用 |
| 方案 C：按官方客户端接入层的业务结构切分主要组成部分,再在每部分内列代码主体和对象发现线索 | 同时表达业务结构、实现落点和对象候选池 | 文档较长,需要保持对象细节不提前展开 | 采用 |

### 7. 结构化中间产物

#### 7.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 官方客户端语义核心 | 维护 SDK 共同语义、能力模型和三语言概念一致 | `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap`、`SdkSemanticBaselineService` | 不按语言目录拆 truth,不重写 core / bus / service truth |
| 上游契约消费与派生视图 | 消费 core / bus / formal API,形成派生视图、版本引用和快照新鲜度 | `ContractConsumptionService`、`CoreContractSnapshotService`、`BusSemanticSnapshotService`、`DerivedBindingView`、`UpstreamVersionRef`、`SnapshotFreshnessState` | 不制造第二契约 truth,不把服务仓源码作为依赖 |
| 平台能力访问与正式边界适配 | 组装服务 client 视图,通过 formal API / fake boundary 接入服务能力 | `SdkClientEntry`、`ServiceClientEntry`、`ServiceClientAssemblyService`、`FormalApiBoundaryAdapter`、`FakeBoundaryAdapter`、`ServiceClientView` | 不成为 server gateway,不拥有服务端业务事实 |
| 事件客户端视图 | 提供基于 `L0-bus` 语义的事件 client 入口和事件语义映射 | `EventClientEntry`、`EventClientAssemblyService`、`BusEventClientView`、`EventSemanticMapping` | 不实现 bus runtime,不重新定义 delivery / retry / replay truth |
| 横切默认行为 | 维护 error mapping、trace propagation、redaction、credential protection 和禁止正文边界 | `ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`BoundaryGuard` | 不执行 auth / governance,不允许配置绕开安全默认 |
| package candidate 与验证证据 | 生成本地 package candidate,运行 smoke / docs 验证并保留 evidence | `GenerateCandidateTrigger`、`RunSmokeTrigger`、`PackageCandidateService`、`CandidateValidationService`、`CrossLanguageSmokeJob`、`PackageCandidate`、`VerificationEvidence` | 不等同公共注册表发布,不伪造 verified / stable 结论 |
| 文档、兼容与演进 | 维护能力查询、示例验证、兼容判断、deprecated 和 migration 口径 | `CapabilityQueryEntry`、`ValidateDocsTrigger`、`CompatibilityCheckTrigger`、`DocsExampleValidationService`、`CompatibilityGovernanceService`、`CompatibilityDecision`、`DeprecatedApiRecord`、`MigrationGuideRef` | 不替代需求、验收或正式 ADR,不静默移除跨语言能力 |

#### 7.2 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| 官方客户端语义核心 | `SdkSemanticBaseline`、`ClientCapabilityModel` | 语义一致性规则 | `SdkCapabilityProjection` | `LanguageRuntimeRef` | semantic change history | `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap` |
| 上游契约消费与派生视图 | `DerivedBindingView`、`LanguageBindingView`、`SnapshotFreshnessState` | upstream truth boundary rule | contract / bus snapshot projection | `UpstreamVersionRef`、`CoreContractRef`、`TransportSemanticId` | snapshot refresh history | `DerivedBindingView`、`LanguageBindingView`、`UpstreamVersionRef`、`SnapshotFreshnessState` |
| 平台能力访问与正式边界适配 | `ServiceClientView` | formal boundary policy | service capability projection | `ServiceCapabilityRef`、`FakeBoundaryRef` | service client change history | `ServiceClientView`、`ServiceCapabilityRef` |
| 事件客户端视图 | `BusEventClientView`、event client state | event semantic consistency rule | event capability projection | `TransportSemanticId`、`EventBoundaryRef` | event client mapping history | `BusEventClientView`、`EventSemanticMapping` |
| 横切默认行为 | default behavior state | `ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`BoundaryGuard` | security / trace capability projection | credential material boundary | redaction / leakage audit | `ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`BoundaryGuard` |
| package candidate 与验证证据 | `PackageCandidate`、candidate status、`VerificationEvidence` | verification gate policy | `EvidenceProjection` | package artifact ref、runner ref | smoke / validation history | `PackageCandidate`、`VerificationEvidence` |
| 文档、兼容与演进 | `CompatibilityDecision`、`DeprecatedApiRecord` | `CompatibilityPolicy` | `CompatibilityProjection`、docs example projection | `MigrationGuideRef`、upstream version ref | compatibility / deprecated history | `CompatibilityDecision`、`DeprecatedApiRecord`、`MigrationGuideRef` |

#### 7.3 各部分交互总图

```text
+---------------------------------------------------------------+
| 1. 官方客户端语义核心                                         |
|    semantic baseline / capability model                       |
+---------------+-------------------------------+---------------+
                |                               |
                v                               v
+---------------+---------------+   +-----------+---------------+
| 2. 上游契约消费与派生视图   |   | 5. 横切默认行为             |
|    core / bus / API views    |   |    error / trace / redact   |
+---------------+---------------+   +-----------+---------------+
                |                               |
                v                               v
+---------------+---------------+   +-----------+---------------+
| 3. 平台能力访问与边界适配   |   | 4. 事件客户端视图           |
|    service client / adapter  |   |    bus event client view     |
+---------------+---------------+   +-----------+---------------+
                |                               |
                +---------------+---------------+
                                v
+-------------------------------+-------------------------------+
| 6. package candidate 与验证证据                                |
|    candidate / smoke / evidence                                |
+-------------------------------+-------------------------------+
                                |
                                v
+-------------------------------+-------------------------------+
| 7. 文档、兼容与演进                                            |
|    docs examples / compatibility / deprecated / migration       |
+---------------------------------------------------------------+
```

关键说明：

- 该图表达主要组成部分之间的概要级协作关系,不表达协议字段、函数调用链、目录结构或详细时序。
- 官方客户端语义核心是中心约束,上游派生视图、能力访问、事件视图和横切默认都必须服从它。
- package candidate 与验证证据用于证明前五个部分在当前 P0 成立,不是公共注册表发布流程。
- 文档兼容与演进消费验证证据和版本引用,并反向约束语义核心的变更边界。

#### 7.4 官方客户端语义核心

##### 本部分职责

- 维护 SDK 共同语义基线、官方 client 能力模型和三语言概念映射。
- 判断语言 idiomatic 表达是否仍保持同一平台含义。
- 为上游消费、能力访问、事件视图、横切默认和兼容治理提供共同主语。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `SdkSemanticBaseline` | domain truth object | 表达 SDK 共同语义基线 | Step 6 / Step 9 |
| `ClientCapabilityModel` | domain value object | 表达官方 client 能力范围 | Step 6 |
| `CrossLanguageConceptMap` | domain value object | 维护三语言概念映射 | Step 6 |
| `SdkSemanticBaselineService` | application service | 编排语义基线变更和一致性检查 | Step 8 / 详细设计 |
| `SdkCapabilityProjection` | projection | 提供能力查询视图 | Step 6 / Step 7 |

##### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth | `SdkSemanticBaseline`、`ClientCapabilityModel` | 独立成节 |
| projection | `SdkCapabilityProjection` | Step 6 筛选是否独立展开 |
| reference | `LanguageRuntimeRef` | 可作为引用对象或字段类型筛选 |
| history | semantic change history | 作为 history record 候选 |

##### 本部分不承担什么

- 不按 Rust / Python / TypeScript 目录分别拥有三套平台语义。
- 不重新定义 `L0-core`、`L0-bus` 或 formal API truth。
- 不决定具体生成器、package manager 或文件结构。

##### 与其他部分的接缝

- 向所有其他组成部分提供共同语义基线。
- 接收文档兼容与演进部分的兼容反馈,但不让单一语言反馈直接改写平台语义。

#### 7.5 上游契约消费与派生视图

##### 本部分职责

- 消费 `L0-core`、`L0-bus` 和 formal API 的稳定 truth。
- 形成派生 binding 视图、语言 binding 视图、上游版本引用和快照新鲜度状态。
- 在上游变化时显式表达 stale / pending / unsupported / not verified。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ContractConsumptionService` | application service | 编排上游契约消费 | Step 8 |
| `CoreContractSnapshotService` | application service | 承接 core 派生快照 | Step 8 |
| `BusSemanticSnapshotService` | application service | 承接 bus 语义快照 | Step 8 |
| `DerivedBindingView` | projection / value object | 表达派生 binding 视图 | Step 6 |
| `LanguageBindingView` | projection / value object | 表达语言级 binding 视图 | Step 6 |
| `UpstreamVersionRef` | reference object | 记录上游版本引用 | Step 6 |
| `SnapshotFreshnessState` | state enum / value object | 表达快照新鲜度 | Step 6 / Step 9 |

##### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| state | `SnapshotFreshnessState` | 独立成节 |
| projection | `DerivedBindingView`、`LanguageBindingView` | 独立成节 |
| reference | `UpstreamVersionRef`、`CoreContractRef`、`TransportSemanticId` | `UpstreamVersionRef` 独立成节,其余筛选 |
| history | snapshot refresh history | 作为 history record 候选 |

##### 本部分不承担什么

- 不生成第二套 proto、DTO、ErrorCode、TraceContext 或 CloudEvents truth。
- 不源码依赖 L1/L2/L3/L4 服务仓。
- 不把 fake / fixture 结果写成生产服务 truth。

##### 与其他部分的接缝

- 向平台能力访问和事件客户端视图提供可追溯上游版本的派生视图。
- 向 candidate 验证输出快照状态和上游版本引用。

#### 7.6 平台能力访问与正式边界适配

##### 本部分职责

- 组装服务能力 client 视图。
- 通过 formal API / fake boundary 接入服务能力。
- 为下游调用方提供同步请求 / 响应类能力访问边界。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `SdkClientEntry` | inbound entry | SDK public client 入口 | Step 7 |
| `ServiceClientEntry` | inbound entry | 服务能力 client 入口 | Step 7 |
| `ServiceClientAssemblyService` | application service | 组装服务 client 视图 | Step 8 |
| `FormalApiBoundaryAdapter` | adapter | formal API 边界适配 | Step 7 / 详细设计 |
| `FakeBoundaryAdapter` | adapter | fake / fixture 验证边界适配 | Step 7 / 详细设计 |
| `ServiceClientView` | domain / projection object | 表达服务 client 视图 | Step 6 |
| `ServiceCapabilityRef` | reference object | 表达服务能力引用 | Step 6 |

##### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth / view | `ServiceClientView` | 独立成节 |
| policy | formal boundary policy | Step 6 筛选 |
| reference | `ServiceCapabilityRef`、`FakeBoundaryRef` | `ServiceCapabilityRef` 独立成节 |
| history | service client change history | 可作为 history record 候选 |

##### 本部分不承担什么

- 不成为 server gateway 或 facade。
- 不拥有服务端业务事实、领域规则或跨服务事务。
- 不保存生产请求 / 响应正文。

##### 与其他部分的接缝

- 消费官方语义核心和上游派生视图。
- 使用横切默认行为保护错误、trace、redaction 和凭据材料。
- 将可运行能力交给 candidate 验证部分证明。

#### 7.7 事件客户端视图

##### 本部分职责

- 组装 `L0-bus` 语义下的事件 client 视图。
- 为发布、订阅、结果感知和失败感知提供 SDK 级入口。
- 保持 event client 与 bus runtime truth 的边界。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `EventClientEntry` | inbound entry | 事件 client 入口 | Step 7 |
| `EventClientAssemblyService` | application service | 组装事件 client 视图 | Step 8 |
| `BusEventClientView` | domain / projection object | 表达 bus 语义事件 client 视图 | Step 6 |
| `EventSemanticMapping` | value object | 映射 SDK 事件表达与 bus 语义 | Step 6 |

##### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth / view | `BusEventClientView` | 独立成节 |
| policy | event semantic consistency rule | Step 6 筛选 |
| projection | event capability projection | 可作为 projection 候选 |
| reference | `TransportSemanticId`、`EventBoundaryRef` | 筛选为引用对象或字段类型 |
| history | event client mapping history | 可作为 history record 候选 |

##### 本部分不承担什么

- 不实现 bus delivery、retry、DLQ、replay 或 tap truth。
- 不保存事件 payload 正文。
- 不绕过 `L0-bus` 定义自己的 transport semantic。

##### 与其他部分的接缝

- 消费上游契约消费部分提供的 bus semantic snapshot。
- 使用横切默认行为处理错误、trace 和 redaction。
- 进入 candidate 验证和文档示例验证。

#### 7.8 横切默认行为

##### 本部分职责

- 维护 error mapping、trace propagation、redaction 和 credential protection 默认策略。
- 阻止业务正文、事件 payload、生产请求响应、观测正文和凭据正文进入 SDK truth 或证据正文。
- 为 service client、event client、candidate 验证和 docs examples 提供统一横切边界。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ErrorMappingPolicy` | policy | 错误映射默认规则 | Step 6 / Step 8 |
| `TracePropagationPolicy` | policy | trace 传播默认规则 | Step 6 / Step 8 |
| `RedactionPolicy` | policy | redaction 默认规则 | Step 6 / Step 8 |
| `CredentialProtectionPolicy` | policy | 凭据材料保护规则 | Step 6 / Step 8 |
| `BoundaryGuard` | policy / guard | 禁止正文和越界能力保护 | Step 6 / Step 10 |

##### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| policy | `ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`BoundaryGuard` | 独立成节或策略对象组中逐项展开 |
| state | default behavior state | Step 6 / Step 9 筛选 |
| projection | security / trace capability projection | 可作为 read model 候选 |
| audit | redaction / leakage audit | 可作为 audit record 候选 |

##### 本部分不承担什么

- 不执行登录认证、权限裁决、治理审批或身份生命周期。
- 不允许配置关闭禁止正文边界。
- 不替代 observability 产品或 secret manager。

##### 与其他部分的接缝

- 被平台能力访问、事件客户端、candidate 验证和文档示例共同调用。
- 向异常与边界场景提供 credential leakage、forbidden body、missing trace 等判断入口。

#### 7.9 package candidate 与验证证据

##### 本部分职责

- 生成和管理本地 package candidate。
- 编排跨语言 smoke、docs example runner 和验证证据收集。
- 判断 candidate 是否可标记 not verified、failed、verified 或 stable。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `GenerateCandidateTrigger` | operations trigger | 触发 candidate 生成 | Step 7 / Step 8 |
| `RunSmokeTrigger` | operations trigger | 触发 smoke 验证 | Step 7 / Step 8 |
| `PackageCandidateService` | application service | 编排 package candidate | Step 8 |
| `CandidateValidationService` | application service | 编排验证证据 | Step 8 |
| `CrossLanguageSmokeJob` | operations job | 执行跨语言 smoke | Step 7 / Step 8 |
| `PackageCandidate` | domain truth object | 表达 candidate 真相 | Step 6 / Step 9 |
| `VerificationEvidence` | audit / evidence object | 表达验证证据 | Step 6 |

##### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth / state | `PackageCandidate`、candidate status | 独立成节 |
| policy | verification gate policy | Step 6 筛选 |
| projection | `EvidenceProjection` | Step 6 筛选 |
| reference | package artifact ref、runner ref | 可作为 reference object 候选 |
| audit / history | smoke / validation history、`VerificationEvidence` | `VerificationEvidence` 独立成节 |

##### 本部分不承担什么

- 不等同公共注册表正式发布。
- 不用 fake / fixture 结果伪装生产服务覆盖。
- 不在证据正文中保存业务正文、请求响应正文或凭据正文。

##### 与其他部分的接缝

- 消费上游派生视图、service client、event client 和横切默认行为。
- 向文档兼容与演进部分输出可复核证据。

#### 7.10 文档、兼容与演进

##### 本部分职责

- 提供 SDK 能力与版本读取视图。
- 验证 quickstart、docstring 和跨语言示例是否与 candidate 一致。
- 形成 compatibility decision、deprecated record 和 migration guide reference。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `CapabilityQueryEntry` | query entry | 读取 SDK 能力、版本和兼容信息 | Step 7 |
| `ValidateDocsTrigger` | operations trigger | 触发文档示例验证 | Step 7 / Step 8 |
| `CompatibilityCheckTrigger` | operations trigger | 触发兼容检查 | Step 7 / Step 8 |
| `DocsExampleValidationService` | application service | 编排示例验证 | Step 8 |
| `CompatibilityGovernanceService` | application service | 编排兼容和 deprecated 判断 | Step 8 |
| `CompatibilityDecision` | domain decision object | 表达兼容判断 | Step 6 / Step 9 |
| `DeprecatedApiRecord` | domain record | 表达 deprecated 过渡记录 | Step 6 / Step 9 |
| `MigrationGuideRef` | reference object | 引用迁移说明 | Step 6 |

##### 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth / state | `CompatibilityDecision`、`DeprecatedApiRecord` | 独立成节 |
| policy | `CompatibilityPolicy` | Step 6 筛选 |
| projection | `CompatibilityProjection`、docs example projection | Step 6 筛选 |
| reference | `MigrationGuideRef`、upstream version ref | `MigrationGuideRef` 独立成节 |
| history | compatibility / deprecated history | 可作为 history record 候选 |

##### 本部分不承担什么

- 不替代需求文档、验收标准或正式 ADR。
- 不把单语言 deprecated 当成平台级 deprecated。
- 不静默移除 API 或只在文档中提示 breaking change。

##### 与其他部分的接缝

- 消费 package candidate、verification evidence 和 upstream version ref。
- 向官方客户端语义核心反馈兼容约束,但不能绕过正式变更流程改写语义。

#### 7.11 总体边界说明

- 主要组成部分是概要设计层业务结构主语,不是实现分层、目录、类或函数。
- `Inbound / Operations`、`Application Services`、`Domain Model / Policies`、`Ports / Projection / Artifact / Adapter` 是实现分层,不作为主要组成部分。
- API、trigger、port、repository、runner 和 adapter 可以在本章被列为代码主体,但通常不在 Step 6 当领域对象展开。
- 对象发现线索只建立候选池,不得在本章写字段骨架、成员函数或工厂函数。

#### 7.12 Step 6 展开门禁

| 门禁项 | 结论 |
|---|---|
| 必须独立筛选 truth / state 对象 | `SdkSemanticBaseline`、`ClientCapabilityModel`、`DerivedBindingView`、`LanguageBindingView`、`ServiceClientView`、`BusEventClientView`、`PackageCandidate`、`CompatibilityDecision`、`DeprecatedApiRecord` |
| 必须独立筛选 policy / guard | `ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`BoundaryGuard`、`CompatibilityPolicy` |
| 必须独立筛选 reference / evidence | `UpstreamVersionRef`、`ServiceCapabilityRef`、`MigrationGuideRef`、`VerificationEvidence` |
| 不应作为领域对象直接展开 | `Entry`、`Trigger`、`Port`、`Repository`、`Runner`、`Adapter`、DTO、schema、package layout |

#### 7.13 后续展开一致性检查结论

- Step 6 必须从本文件 §7.2 和各部分对象发现线索中筛选对象,不得另造对象体系。
- Step 7 的 API / 接口骨架必须覆盖本文件列出的 entry、trigger、port 和 query 主语。
- Step 8 的处理流必须至少覆盖上游契约消费、service client assembly、event client assembly、cross-language smoke、candidate validation、docs example validation 和 compatibility governance。
- Step 9 的状态机必须覆盖 snapshot freshness、candidate status、verification result、compatibility decision、deprecated lifecycle、unsupported / stale / pending 等状态。

### 8. 回填草稿

正式 `02-概要设计.md` §5 “主要组成部分、职责与边界”直接摘录并润色本文件：

- §7.1 “组成部分总表”
- §7.2 “对象发现维度表”
- §7.3 “各部分交互总图”
- §7.4 ~ §7.10 各主要组成部分小节
- §7.11 ~ §7.13 边界、门禁和一致性检查

不在本 Step 重复粘贴完整正式章节正文。Step 14 生成正式文档时,再统一补充校准来源、延伸阅读、正式文档语气和交叉引用。

### 9. 待确认事项

- 无阻塞进入 Step 6 的待确认事项。
- 具体 package layout、语言目录、完整 public API 签名、DTO schema、runner 实现和 artifact 字段继续后移,不得在 Step 5 定案。

### 10. 进入下一步条件

- 已明确本仓由七个主要组成部分构成。
- 已明确每个主要组成部分承担什么和不承担什么。
- 已列出每个主要组成部分包含的代码主体 / 模块,并标注后续展开位置。
- 已形成对象发现维度表和各组成部分对象发现线索。
- 对象字段、状态、成员函数和工厂函数细节仍保留给 Step 6 独立展开。
