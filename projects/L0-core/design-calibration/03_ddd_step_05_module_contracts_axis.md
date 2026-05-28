# Step 5. 定义模块实现契约主轴

> 本版本是 L0-core 详细设计校准的 Step 5 中间产物。
> 本步确认正式详细设计第 5 章应按哪些实现模块展开。
> 本步只收稳模块主轴、职责、暴露内容、依赖方向和归属映射,不展开对象字段、trait 方法全集、协议 schema 或函数级处理流。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 5
- 回填章节: `projects/L0-core/03-详细设计.md` §5 模块实现契约

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 4 实现单元与文件布局 | 已确认 workspace 多 crate 架构:`contracts` / `domain` / `application` / `infra` / `cli` / `jobs` | 作为模块主轴的代码落点 |
| `02-概要设计.md` §4 | 代码主体框架:外部接缝、应用服务、领域模型、port、adapter、后台处理 | 作为模块分层依据 |
| `02-概要设计.md` §5 | 6 个业务主要组成部分 + 技术支撑集合 | 作为每个模块对应业务主线的依据 |
| `01-架构设计.md` §8 | 依赖方向与层间约束 | 作为允许依赖 / 禁止依赖判断依据 |
| Step 3 实现约束 | domain 不依赖基础设施,外部 I/O 通过 port,不实现 auth / bus runtime / sdk | 作为模块边界红线 |

已确认结论:

```text
详细设计第 5 章按实现模块展开,不是按业务组成部分、对象全集或文件全集展开。
业务组成部分描述“做什么”,实现模块描述“代码如何安放和依赖”。
一个业务组成部分会跨多个实现模块;一个实现模块也会支撑多个业务组成部分。
```

依赖的前序 Step:

```text
Step 1 已确认概要设计输入边界。
Step 2 已确认本轮 P0 实现范围和非范围。
Step 3 已确认编码、runtime、仓库、提交和安全边界约束。
Step 4 已确认 workspace 多 crate 架构和文件布局。
```

---

## 3. SOP 问题回答

### 3.1 本仓详细设计应该拆成哪些实现模块?

回答:

建议把正式详细设计第 5 章拆成 15 个实现模块。它们不是业务主要组成部分的平铺,而是 Step 4 文件布局中真正需要承载对象、trait、adapter、入口或资产约束的实现模块。

| 模块 | 所属实现单元 | 模块类型 | 为什么需要单独成模块 |
|---|---|---|---|
| `contract_source_assets` | `contract-source/` | asset module | 承载结构化契约源码真相,不能混入 Rust domain 对象或快照输出 |
| `release_snapshot_assets` | `release-snapshots/` | asset module | 承载只读发布快照,必须与源码真相分离 |
| `contracts` | `core_contracts` | protocol module | 对外共享 DTO / event / job / receipt / error,下游和入口都要复用 |
| `domain_definition` | `core_domain` | domain module | 维护 `ContractDefinition`、scope、version、lifecycle、evolution 真相 |
| `domain_packages` | `core_domain` | domain module | 维护六个领域契约包,避免领域包散落到业务仓 |
| `domain_release` | `core_domain` | domain module | 维护发布基线、兼容状态和发布策略 |
| `domain_snapshot` | `core_domain` | domain module | 维护发布快照和下游消费引用的领域语义 |
| `domain_reference_projection` | `core_domain` | domain module | 维护外部引用、标准映射、事件目录引用、只读模型和追溯投影语义 |
| `domain_fact` | `core_domain` | domain module | 维护契约变化可感知事实记录 |
| `domain_policies` | `core_domain` | domain policy module | 维护范围、边界、引用校验和 fingerprint 策略 |
| `application_services` | `core_application` | application module | 编排命令、发布、兼容、快照、追溯、事实和运维用例 |
| `application_ports` | `core_application` | port module | 定义 repository、audit、outbox、gate、resolver、publisher、clock、id、unit of work 端口 |
| `infra_adapters` | `core_infra` | adapter module | 实现 source / snapshot / projection / outbox / toolchain / external adapter |
| `cli_entry` | `core_cli` | entry module | 承载同步入口适配,不等于在线 API 服务 |
| `jobs` | `core_jobs` | job module | 承载后台校验、快照、索引、fingerprint、事实发布和 outbox relay |

### 3.2 每个模块对应概要设计中的哪个主要组成部分或代码主体?

回答:

| 模块 | 对应概要设计主要组成部分 | 对应代码主体 |
|---|---|---|
| `contract_source_assets` | 契约真相与领域契约组织 | 结构化契约源码承载 |
| `release_snapshot_assets` | 快照派生与下游消费 | 发布快照承载 |
| `contracts` | 契约变更承接、引用追溯查询、后台校验与事实输出 | Command / Query / Outbound Event / Operations Job / View / Receipt DTO |
| `domain_definition` | 契约真相与领域契约组织 | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractEvolutionRecord` |
| `domain_packages` | 契约真相与领域契约组织 | 六个 `ContractPackage` |
| `domain_release` | 兼容性门禁与发布基线 | `ContractReleaseBaseline`、`CompatibilityStatus`、`ReleasePolicy` |
| `domain_snapshot` | 快照派生与下游消费 | `ContractReleaseSnapshot`、`DownstreamConsumptionRef` |
| `domain_reference_projection` | 引用索引与追溯查询 | `ExternalReference`、`StandardMappingIndex`、`EventCatalogReference`、`ContractReadModel`、`ContractTraceProjection`、`CompatibilityTraceIndex` |
| `domain_fact` | 后台校验与事实输出 | `ContractFactRecord` |
| `domain_policies` | 契约变更承接、兼容性门禁、引用边界 | `ScopePolicy`、`BoundaryGuard`、`DefinitionUseBoundaryGuard`、`ReferenceValidationPolicy`、`FingerprintPolicy` |
| `application_services` | 6 个业务主要组成部分的编排层 | `ContractChangeService`、`ContractReleaseService`、`ContractCompatibilityService`、`ContractSnapshotService`、`ContractTraceService`、`ContractFactService`、`ContractOperationsService` |
| `application_ports` | 技术承载与外部适配支撑主体集合 | repository / audit / outbox / gate / resolver / publisher / clock / id / unit of work port |
| `infra_adapters` | 技术承载与外部适配支撑主体集合 | source store、snapshot store、projection store、outbox store、toolchain、external adapters |
| `cli_entry` | 外部接缝与输入收口、引用查询、运维触发 | `ContractCommandApi`、`ContractQueryApi`、`ContractOperationsTrigger` |
| `jobs` | 后台校验与事实输出 | operations jobs、`OutboxRelayWorker` |

### 3.3 每个模块对外暴露什么?

回答:

| 模块 | 对外暴露 |
|---|---|
| `contract_source_assets` | 契约源码目录结构、source ref、package source ref |
| `release_snapshot_assets` | 发布快照目录结构、snapshot ref |
| `contracts` | Command / Query / Event / Job / View / Receipt / Error DTO |
| `domain_definition` | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractEvolutionRecord` |
| `domain_packages` | 六个 `ContractPackage` 类型和 package validation 入口 |
| `domain_release` | `ContractReleaseBaseline`、`CompatibilityStatus`、`ReleasePolicy` |
| `domain_snapshot` | `ContractReleaseSnapshot`、`DownstreamConsumptionRef` |
| `domain_reference_projection` | `ExternalReference`、标准映射、事件目录引用、只读模型和追溯投影类型 |
| `domain_fact` | `ContractFactRecord` |
| `domain_policies` | scope / boundary / reference validation / fingerprint policy 函数 |
| `application_services` | command / query / release / snapshot / trace / fact / operations 用例函数 |
| `application_ports` | port trait 定义 |
| `infra_adapters` | port 实现和 wiring helper |
| `cli_entry` | CLI command / query / operations trigger entry |
| `jobs` | job binary entry 和 job runner |

### 3.4 每个模块允许依赖哪些模块,禁止依赖哪些模块?

回答:

| 模块 | 允许依赖 | 禁止依赖 |
|---|---|---|
| `contract_source_assets` | 无代码依赖;可被 infra 读取 | 禁止依赖 Rust crate、快照输出或下游仓 |
| `release_snapshot_assets` | 无代码依赖;可由 infra 写入、下游读取 | 禁止反向改写 `contract_source_assets` 或 domain 真相 |
| `contracts` | 可依赖基础序列化 / 时间 / id 类型库 | 禁止依赖 `application`、`domain`、`infra`、`cli`、`jobs` |
| `domain_definition` | `contracts` 中必要 value DTO、同 crate domain 模块 | 禁止依赖 `application`、`infra`、`cli`、`jobs`、外部 I/O |
| `domain_packages` | `domain_definition`、`domain_policies` 中纯规则 | 禁止依赖 `infra`、下游 L1 仓、业务实例正文 |
| `domain_release` | `domain_definition`、`domain_reference_projection`、`domain_policies` | 禁止依赖 `application`、`infra`、toolchain 执行结果本体 |
| `domain_snapshot` | `domain_release`、`domain_definition`、`domain_reference_projection` | 禁止让 snapshot 反向拥有 definition truth |
| `domain_reference_projection` | `domain_definition`、`domain_release`、`contracts` 中 view DTO 的值类型 | 禁止查询路径改写真相 |
| `domain_fact` | `domain_definition`、`domain_release`、`domain_snapshot` | 禁止直接发布到 `L0-bus` |
| `domain_policies` | domain value object 和纯函数依赖 | 禁止依赖 repository、toolchain、bus、filesystem、gateway |
| `application_services` | `contracts`、domain modules、`application_ports` | 禁止依赖具体 `infra_adapters` 和外部工具实现 |
| `application_ports` | `contracts`、domain modules | 禁止依赖 `infra_adapters`、`cli_entry`、`jobs` |
| `infra_adapters` | `contracts`、domain modules、`application_ports`、asset dirs | 禁止被 domain / application 反向依赖 |
| `cli_entry` | `contracts`、`application_services`、`infra_adapters` wiring | 禁止实现认证授权、bus runtime、domain 规则 |
| `jobs` | `contracts`、`application_services`、`infra_adapters` wiring | 禁止绕过 application service 直接改写真相 |

### 3.5 哪些对象、trait、handler、repository 应归属于哪个模块?

回答:

| 类型 | 归属模块 | 代表对象 / 代码主体 |
|---|---|---|
| Command / Query / Event / Job DTO | `contracts` | `CreateContractDraft`、`PublishContractBaseline`、`GetContractDefinition`、`ContractBaselinePublished`、`ValidateContractChangeJobInput` |
| 核心定义对象 | `domain_definition` | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractEvolutionRecord` |
| 领域契约包 | `domain_packages` | `IdentityContractPackage`、`ConversationContractPackage`、`WorkContractPackage`、`ProcessContractPackage`、`GovernanceContractPackage`、`ArtifactContractPackage` |
| 发布与兼容对象 | `domain_release` | `ContractReleaseBaseline`、`CompatibilityStatus`、`ReleasePolicy` |
| 快照与消费引用 | `domain_snapshot` | `ContractReleaseSnapshot`、`DownstreamConsumptionRef` |
| 引用与追溯对象 | `domain_reference_projection` | `ExternalReference`、`StandardMappingIndex`、`EventCatalogReference`、`ContractReadModel`、`ContractTraceProjection`、`CompatibilityTraceIndex` |
| 事实记录 | `domain_fact` | `ContractFactRecord` |
| 领域策略 | `domain_policies` | `ScopePolicy`、`BoundaryGuard`、`DefinitionUseBoundaryGuard`、`ReferenceValidationPolicy`、`FingerprintPolicy` |
| 用例服务 | `application_services` | `ContractChangeService`、`ContractReleaseService`、`ContractCompatibilityService`、`ContractSnapshotService`、`ContractTraceService`、`ContractFactService`、`ContractOperationsService` |
| port trait | `application_ports` | `ContractDefinitionRepository`、`ContractBaselineRepository`、`SnapshotRepository`、`ReferenceRepository`、`AuditLogPort`、`OutboxPort`、`EventPublisherPort` |
| repository / adapter 实现 | `infra_adapters` | filesystem source store、snapshot store、projection store、outbox store、toolchain runner、gate / reference / blob / event adapter |
| entry handler | `cli_entry` | `ContractCommandApi`、`ContractQueryApi`、`ContractOperationsTrigger` |
| job runner | `jobs` | `ValidateContractChangeJob`、`DeriveReleaseSnapshotJob`、`RebuildContractIndexJob`、`RecalculateFingerprintJob`、`PublishContractFactJob`、`OutboxRelayWorker` |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 按 shared primitive、ID / Ref / DTO 展开,不是按新版模块实现契约展开 | 无法承接新版 L0-core 契约来源主线 |
| Step 4 文件布局 | 已有 crate / file tree,但尚未说明正式第 5 章按哪些模块展开 | Step 6~8 可能把对象、trait、API 再次堆到全局章节 |
| `02-概要设计.md` §5 | 6 个业务主要组成部分是业务主线,不是代码模块主轴 | 若照抄为模块,会导致每个业务主线跨层混写 |
| `02-概要设计.md` §4 | 实现分层已经明确,但未落成详细设计模块职责表 | 需要补充允许依赖、禁止依赖和归属映射 |
| 后续 Step 风险 | 若模块主轴不收稳,对象、port、handler、repository 归属会反复漂移 | 影响 1:1 实现和 review |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 模块主轴 | 旧文以 primitive 类型或对象清单为主轴 | 以实现职责模块为主轴 | 符合新版详细设计规范 |
| 业务组成部分与模块关系 | 容易一一对应 | 明确业务组成部分跨多个实现模块 | 避免业务主线和代码分层混写 |
| 对象归属 | 未稳定 | 每类对象、trait、handler、adapter 都有归属模块 | 支撑 Step 6 / 7 / 8 展开 |
| 依赖方向 | 旧文主要靠文字提醒 | 用模块依赖图和允许 / 禁止依赖表固定 | 防止 domain 依赖 infra、jobs 绕过 application |
| 资产目录 | `contract-source` / `release-snapshots` 只是目录 | 作为 asset module 进入模块主轴 | 保护契约源码真相与只读快照边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按 6 个业务主要组成部分写第 5 章 | 业务阅读直观 | 每个组成部分都会跨 contracts / domain / application / infra / cli / jobs,实现者难以落文件 | 不采用 |
| 方案 B: 按 Step 4 的 6 个 crate 写第 5 章 | 依赖方向清楚 | `domain` crate 内对象太多,无法支撑逐模块对象契约 | 不采用 |
| 方案 C: 按实现职责模块写第 5 章,crate 内继续拆 domain / service / port / adapter 模块 | 既保留依赖方向,又能给对象和 trait 找到准确落点 | 模块数量比 crate 多,需要控制正式文档篇幅 | 采用 |
| 方案 D: 继续按对象类型全局展开 | 写作简单 | 与新版详细设计“模块实现契约”为主轴冲突 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `contract_source_assets` | `contract-source/` | 承载结构化契约源码真相 | source ref / package source ref | 无代码依赖 |
| `release_snapshot_assets` | `release-snapshots/` | 承载只读发布快照 | snapshot ref | `contract_source_assets` 的派生结果 |
| `contracts` | `core_contracts` | 定义对外协议 DTO | Command / Query / Event / Job / View / Receipt / Error DTO | 基础 id / time / metadata value |
| `domain_definition` | `core_domain` | 维护契约定义真相 | definition / scope / version / lifecycle / evolution types | `contracts` 中必要 value |
| `domain_packages` | `core_domain` | 维护六个领域契约包 | six package types | `domain_definition`、`domain_policies` |
| `domain_release` | `core_domain` | 维护发布基线与兼容状态 | release baseline / compatibility / release policy | `domain_definition`、`domain_reference_projection`、`domain_policies` |
| `domain_snapshot` | `core_domain` | 维护发布快照与消费引用 | release snapshot / downstream ref | `domain_release`、`domain_definition` |
| `domain_reference_projection` | `core_domain` | 维护引用、索引、只读模型和追溯投影 | external reference / read model / trace projection | `domain_definition`、`domain_release` |
| `domain_fact` | `core_domain` | 维护可感知事实记录 | fact record | `domain_definition`、`domain_release`、`domain_snapshot` |
| `domain_policies` | `core_domain` | 维护纯领域规则 | scope / boundary / reference / fingerprint policy | domain value object |
| `application_services` | `core_application` | 编排 P0 用例和事务边界 | change / release / compatibility / snapshot / trace / fact / operations service | `contracts`、domain modules、`application_ports` |
| `application_ports` | `core_application` | 定义外部依赖端口 | repository / audit / outbox / gate / resolver / publisher / clock / id / unit of work trait | `contracts`、domain modules |
| `infra_adapters` | `core_infra` | 实现 port 和工具链适配 | source / snapshot / projection / outbox / external adapter | `application_ports`、domain modules、asset dirs |
| `cli_entry` | `core_cli` | 同步入口适配 | command / query / operations trigger entry | `contracts`、`application_services`、`infra_adapters` |
| `jobs` | `core_jobs` | 后台 job 和 outbox relay | job binaries / job runner / relay worker | `contracts`、`application_services`、`infra_adapters` |

### 7.2 模块职责表

| 模块 | 所属实现单元 | 对应概要设计主要组成部分 | 主要责任 | 对外暴露 | 允许依赖 | 禁止依赖 |
|---|---|---|---|---|---|---|
| `contract_source_assets` | `contract-source/` | 契约真相与领域契约组织 | 保存结构化契约源码真相 | source ref | 无代码依赖 | Rust crate、快照输出、下游仓 |
| `release_snapshot_assets` | `release-snapshots/` | 快照派生与下游消费 | 保存只读发布快照 | snapshot ref | 可由 infra 写入 | 反向改写源码真相 |
| `contracts` | `core_contracts` | 外部接缝 / 查询 / 事实输出 | 定义跨模块共享协议对象 | DTO / error / receipt | 基础 value 类型 | application / domain / infra |
| `domain_definition` | `core_domain` | 契约真相与领域契约组织 | 维护 definition 真相和生命周期 | definition types | `contracts`、同 crate domain 模块 | application / infra / cli / jobs |
| `domain_packages` | `core_domain` | 契约真相与领域契约组织 | 维护领域契约包语义 | package types | `domain_definition`、`domain_policies` | 下游业务仓、业务实例正文 |
| `domain_release` | `core_domain` | 兼容性门禁与发布基线 | 维护发布基线、兼容状态和发布规则 | release types | `domain_definition`、`domain_reference_projection`、`domain_policies` | infra / toolchain 执行结果本体 |
| `domain_snapshot` | `core_domain` | 快照派生与下游消费 | 维护发布快照和消费引用语义 | snapshot types | `domain_release`、`domain_definition` | 让 snapshot 拥有 truth |
| `domain_reference_projection` | `core_domain` | 引用索引与追溯查询 | 维护引用、标准映射、事件目录、只读模型和追溯投影语义 | reference / projection types | `domain_definition`、`domain_release` | 查询路径改写真相 |
| `domain_fact` | `core_domain` | 后台校验与事实输出 | 维护可感知事实记录 | fact record | `domain_definition`、`domain_release`、`domain_snapshot` | 直接发布 bus event |
| `domain_policies` | `core_domain` | 输入收口 / 门禁 / 引用边界 | 维护纯领域规则 | policy functions | domain value object | repository / filesystem / bus / gateway |
| `application_services` | `core_application` | 6 个业务组成部分编排 | 编排 use case、事务、审计、outbox 和恢复口径 | service functions | `contracts`、domain modules、`application_ports` | concrete infra adapter |
| `application_ports` | `core_application` | 技术承载与外部适配 | 定义外部依赖端口 | port trait | `contracts`、domain modules | infra / cli / jobs |
| `infra_adapters` | `core_infra` | 技术承载与外部适配 | 实现 port 和工具链适配 | adapter types / wiring helpers | `application_ports`、domain modules、asset dirs | 被 domain / application 反向依赖 |
| `cli_entry` | `core_cli` | 输入收口 / 查询 / 运维触发 | 将同步入口请求转给 application | command / query / operations CLI entry | `contracts`、`application_services`、`infra_adapters` | auth、domain rule、bus runtime |
| `jobs` | `core_jobs` | 后台校验与事实输出 | 运行后台 job 和 outbox relay | job runner / binary | `contracts`、`application_services`、`infra_adapters` | 绕过 application 直接改写真相 |

### 7.3 模块依赖图

#### 模块依赖图: L0-core 模块实现主轴

```text
[cli_entry] -- call --> [application_services]
[jobs]      -- call --> [application_services]

[application_services] -- use port --> [application_ports]
[infra_adapters]       -- impl port --> [application_ports]

[application_services] -- use --> [domain_definition]
[application_services] -- use --> [domain_packages]
[application_services] -- use --> [domain_release]
[application_services] -- use --> [domain_snapshot]
[application_services] -- use --> [domain_reference_projection]
[application_services] -- use --> [domain_fact]
[application_services] -- use --> [domain_policies]

[domain_packages]             -- use --> [domain_definition]
[domain_release]              -- use --> [domain_definition]
[domain_release]              -- use --> [domain_reference_projection]
[domain_snapshot]             -- use --> [domain_release]
[domain_snapshot]             -- use --> [domain_definition]
[domain_reference_projection] -- use --> [domain_definition]
[domain_reference_projection] -- use --> [domain_release]
[domain_fact]                 -- use --> [domain_definition]
[domain_fact]                 -- use --> [domain_release]
[domain_fact]                 -- use --> [domain_snapshot]
[domain_policies]             -- pure rules --> [domain_definition]

[infra_adapters] -- read source --> [contract_source_assets]
[infra_adapters] -- write snapshot --> [release_snapshot_assets]

[contracts] -- shared dto --> [cli_entry]
[contracts] -- shared dto --> [jobs]
[contracts] -- shared dto --> [application_services]
[contracts] -- shared dto --> [application_ports]
[contracts] -- shared dto --> [infra_adapters]
```

关键说明:

- 图表达模块级依赖方向,不表达函数级调用链。
- `infra_adapters` 只实现 `application_ports`,不能被 domain 或 application 反向依赖。
- `contract_source_assets` 和 `release_snapshot_assets` 是资产承载模块,不是 Rust domain 对象。
- `cli_entry` 和 `jobs` 都必须通过 `application_services` 修改真相。
- `contracts` 只提供共享 DTO,不能依赖 domain / application / infra。

### 7.4 代码主体归属映射

| 代码主体 | 类型 | 归属模块 | 后续展开 Step |
|---|---|---|---|
| `CreateContractDraft` / `UpdateContractDraft` / `SubmitContractForReview` / `PublishContractBaseline` / `UpdateContractLifecycle` | Command DTO | `contracts` | Step 8 |
| `GetContractDefinition` / `ListContractDefinitions` / `TraceContractEvolution` / `GetCompatibilityTrace` | Query DTO | `contracts` | Step 8 |
| `ContractDraftChanged` / `ContractBaselinePublished` / `ContractSnapshotReady` / `ContractFactPublished` | Outbound Event DTO | `contracts` | Step 8 |
| `ValidateContractChangeJob` / `DeriveReleaseSnapshotJob` / `RebuildContractIndexJob` / `RecalculateFingerprintJob` / `PublishContractFactJob` | Job DTO / runner | `contracts` / `jobs` | Step 8 / Step 9 |
| `ContractDefinition` / `ContractScope` / `ContractVersion` / `ContractLifecycle` / `ContractEvolutionRecord` | Domain object | `domain_definition` | Step 6 |
| 六个 `ContractPackage` | Domain object | `domain_packages` | Step 6 |
| `ContractReleaseBaseline` / `CompatibilityStatus` / `ReleasePolicy` | Domain object / policy | `domain_release` | Step 6 / Step 10 |
| `ContractReleaseSnapshot` / `DownstreamConsumptionRef` | Domain object | `domain_snapshot` | Step 6 |
| `ExternalReference` / `StandardMappingIndex` / `EventCatalogReference` / `ContractReadModel` / `ContractTraceProjection` / `CompatibilityTraceIndex` | Domain read / reference object | `domain_reference_projection` | Step 6 |
| `ContractFactRecord` | Domain object | `domain_fact` | Step 6 |
| `ScopePolicy` / `BoundaryGuard` / `DefinitionUseBoundaryGuard` / `ReferenceValidationPolicy` / `FingerprintPolicy` | Domain policy | `domain_policies` | Step 6 / Step 10 |
| `ContractChangeService` / `ContractReleaseService` / `ContractCompatibilityService` / `ContractSnapshotService` / `ContractTraceService` / `ContractFactService` / `ContractOperationsService` | Application service | `application_services` | Step 6 / Step 9 |
| repository / audit / outbox / gate / resolver / blob / publisher / clock / id / unit of work trait | Port trait | `application_ports` | Step 7 |
| filesystem source store / snapshot store / projection store / outbox store / toolchain / external adapter | Adapter implementation | `infra_adapters` | Step 7 / Step 11 |
| `ContractCommandApi` / `ContractQueryApi` / `ContractOperationsTrigger` | Entry handler | `cli_entry` | Step 8 / Step 9 |
| operations job implementation / outbox relay worker | Job implementation | `jobs` | Step 8 / Step 9 |

---

## 8. 回填草稿

可直接回填到正式 `03-详细设计.md` §5 的草稿结构:

```md
## 5. 模块实现契约

> 校准来源:
> - `design-calibration/03_ddd_step_05_module_contracts_axis.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/03_ddd_step_05_module_contracts_axis.md` 的“模块总览表”“模块职责表”“模块依赖图”“代码主体归属映射”和“待确认事项”小节,了解正式第 5 章为什么按实现职责模块展开。

本章按实现职责模块展开,不按 6 个业务主要组成部分或对象全集展开。业务组成部分描述 `L0-core` 做什么;实现模块描述代码如何安放、暴露和依赖。

### 5.1 模块总览

<使用 Step 5 §7.1 模块总览表>

### 5.2 模块依赖图

<使用 Step 5 §7.3 模块依赖图>

### 5.3 contract_source_assets 模块
#### 5.3.1 模块职责
#### 5.3.2 文件与代码主体映射
#### 5.3.3 对象实现契约
#### 5.3.4 Trait / Port / Adapter 契约
#### 5.3.5 模块内关键函数
#### 5.3.6 模块错误类型
#### 5.3.7 模块测试切口

### 5.4 release_snapshot_assets 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.5 contracts 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.6 domain_definition 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.7 domain_packages 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.8 domain_release 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.9 domain_snapshot 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.10 domain_reference_projection 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.11 domain_fact 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.12 domain_policies 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.13 application_services 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.14 application_ports 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.15 infra_adapters 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.16 cli_entry 模块
<按 5.3.1~5.3.7 固定结构展开>

### 5.17 jobs 模块
<按 5.3.1~5.3.7 固定结构展开>
```

---

## 9. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 第 5 章按什么主轴展开 | A. 按 6 个业务主要组成部分; B. 按 6 个 crate; C. 按实现职责模块 | C | C 既能承接 workspace 依赖方向,又能给对象、port、handler、adapter 找到准确落点 | 已自动确认采用 C |
| 是否把 `contract-source/` 和 `release-snapshots/` 纳入模块主轴 | A. 纳入; B. 不纳入; C. 只在持久化章节出现 | A | 它们是本仓契约源码真相和发布快照承载,需要在模块主轴中明确边界 | 已自动确认采用 A |
| 是否允许 `jobs` 直接调用 infra 改写真相 | A. 允许; B. 禁止,必须通过 application services; C. 后续再定 | B | 后台 job 不能绕过 use case、审计、outbox 和事务边界 | 已自动确认采用 B |

---

## 10. 进入下一步条件

- 已明确正式第 5 章按 15 个实现职责模块展开。
- 已明确每个模块所属实现单元、职责、对外暴露和依赖对象。
- 已明确模块允许依赖和禁止依赖。
- 已明确对象、trait、handler、repository、adapter、job 的归属模块。
- 可以进入 Step 6 “逐模块定义对象实现契约”。
