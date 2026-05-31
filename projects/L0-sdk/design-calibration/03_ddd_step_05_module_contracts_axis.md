# Step 5. 定义模块实现契约主轴

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 5
- 回填章节：`projects/L0-sdk/03-详细设计.md` §5 模块实现契约

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_04_units_file_layout.md` | 已确认 workspace 多 crate + 三语言 package 目录：`contracts` / `domain` / `application` / `infra` / `client` / `cli` / `jobs` / `packages` | 作为模块主轴的代码落点 |
| `projects/L0-sdk/02-概要设计.md` §4 | Inbound / Operations、Application Services、Domain Model / Policies、Ports / Projection / Artifact / Adapter 分层 | 作为模块分层依据 |
| `projects/L0-sdk/02-概要设计.md` §5 | 七个主要组成部分、职责与对象发现维度 | 作为模块对应业务主线的依据 |
| `projects/L0-sdk/02-概要设计.md` §6~§9 | 关键对象、接口骨架、处理流和状态主语 | 作为对象、接口、handler、job 的归属依据 |
| `projects/L0-sdk/01-架构设计.md` §8 | 依赖方向、编译期依赖、运行期依赖、事件协作依赖和禁止依赖 | 约束模块依赖方向 |
| Step 3 实现约束 | Rust 契约、真实源码英文、path dependency、安全边界和运行期依赖裁剪 | 作为模块暴露和禁止事项输入 |

已确认结论：

```text
详细设计第 5 章按实现职责模块展开,不是按七个主要组成部分、对象全集或语言目录展开。
七个主要组成部分描述 SDK 做什么;实现模块描述代码如何安放、暴露和依赖。
一个主要组成部分会跨多个实现模块;一个实现模块也会支撑多个主要组成部分。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认本轮 P0 实现范围和非范围。
Step 3 已确认编码、runtime、仓库、提交和安全边界约束。
Step 4 已确认 workspace 多 crate、三语言 package 目录和文件布局。
```

---

## 3. SOP 问题回答

### 3.1 本仓详细设计应该拆成哪些实现模块？

回答：

建议把正式详细设计第 5 章拆成 16 个实现职责模块。模块数量多于 crate 数量，是为了避免把所有 domain 对象、policy、candidate、evidence 和 compatibility 都堆进一个 `domain` 大节。

| 模块 | 所属实现单元 | 模块类型 | 为什么需要单独成模块 |
|---|---|---|---|
| `contracts` | `crates/contracts` | protocol module | 承载 Command / Query / Event / Job / View / Receipt / Error DTO，跨入口复用 |
| `domain_semantic` | `crates/domain` | domain module | 承载共同语义基线、能力模型和跨语言概念一致性 |
| `domain_upstream_view` | `crates/domain` | domain projection module | 承载 core / bus / formal API 派生视图、语言视图、上游版本引用和 freshness |
| `domain_service_client` | `crates/domain` | domain view module | 承载服务能力 client view、formal API / fake boundary 的可暴露能力判断 |
| `domain_event_client` | `crates/domain` | domain view module | 承载 `L0-bus` 事件客户端视图和事件语义映射 |
| `domain_boundary_policy` | `crates/domain` | domain policy module | 承载 error mapping、trace、redaction、credential protection 和 boundary guard |
| `domain_package_candidate` | `crates/domain` | domain state module | 承载本地 package candidate、language artifact 和 candidate 状态 |
| `domain_evidence` | `crates/domain` | evidence module | 承载 smoke、docs、boundary、compatibility 等验证证据 |
| `domain_compatibility_evolution` | `crates/domain` | domain decision module | 承载 compatibility decision、deprecated API 和 migration guide reference |
| `application_services` | `crates/application` | application module | 编排 command、consumer、job、query、candidate、evidence 和 compatibility 用例 |
| `application_ports` | `crates/application` | port module | 定义 repository、source、boundary、generator、runner、artifact、outbox、clock、id、unit of work 端口 |
| `infra_adapters` | `crates/infra` | adapter module | 实现 port、config、runtime builder、repository、source、boundary、runner、artifact 和 projection |
| `rust_client_facade` | `crates/client` | public client module | 承载 Rust developer-facing SDK client surface，不是 server gateway |
| `language_package_surface` | `packages/python` / `packages/typescript` | language package module | 承载 Python / TypeScript package surface，不拥有 SDK truth |
| `cli_entry` | `crates/cli` | entry module | 承载本地维护命令入口 |
| `jobs` | `crates/jobs` | job module | 承载一次性 operations job binary 和 job runner helper |

`tests`、`scripts`、`artifacts`、`reports` 是验证和交付支撑目录，不作为 §5 的业务实现模块进入主轴。

### 3.2 每个模块对应概要设计中的哪个主要组成部分或代码主体？

回答：

模块和概要设计主要组成部分不是一一对应关系。主要组成部分表达官方客户端能力主线，模块表达代码职责和依赖方向。

| 概要设计主要组成部分 | 涉及模块 |
|---|---|
| 官方客户端语义核心 | `domain_semantic`、`application_services`、`application_ports`、`infra_adapters`、`rust_client_facade`、`language_package_surface` |
| 上游契约消费与派生视图 | `contracts`、`domain_upstream_view`、`application_services`、`application_ports`、`infra_adapters`、`jobs` |
| 平台能力访问与正式边界适配 | `contracts`、`domain_service_client`、`domain_boundary_policy`、`application_services`、`application_ports`、`infra_adapters`、`rust_client_facade`、`language_package_surface` |
| 事件客户端视图 | `contracts`、`domain_event_client`、`domain_boundary_policy`、`application_services`、`application_ports`、`infra_adapters`、`rust_client_facade`、`language_package_surface` |
| 横切默认行为 | `domain_boundary_policy`、`application_services`、`application_ports`、`infra_adapters`、`rust_client_facade`、`language_package_surface` |
| package candidate 与验证证据 | `contracts`、`domain_package_candidate`、`domain_evidence`、`application_services`、`application_ports`、`infra_adapters`、`jobs` |
| 文档、兼容与演进 | `contracts`、`domain_compatibility_evolution`、`domain_evidence`、`application_services`、`application_ports`、`infra_adapters`、`jobs`、`language_package_surface` |

### 3.3 每个模块对外暴露什么？

回答：

| 模块 | 对外暴露 |
|---|---|
| `contracts` | Command / Query / Event / Job / View / Receipt / protocol error DTO |
| `domain_semantic` | `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap` 和 semantic error |
| `domain_upstream_view` | `DerivedBindingView`、`LanguageBindingView`、`UpstreamVersionRef`、`SnapshotFreshnessState` |
| `domain_service_client` | `ServiceClientView`、`ServiceCapabilityRef`、`CapabilitySupportState` |
| `domain_event_client` | `BusEventClientView`、`EventSemanticMapping` |
| `domain_boundary_policy` | error / trace / redaction / credential policy 和 `BoundaryGuard` |
| `domain_package_candidate` | `PackageCandidate`、language artifact、candidate status |
| `domain_evidence` | `VerificationEvidence`、evidence result、redaction marker、artifact ref |
| `domain_compatibility_evolution` | `CompatibilityDecision`、`DeprecatedApiRecord`、`MigrationGuideRef` |
| `application_services` | application service、query service、event consumer service、job orchestration function |
| `application_ports` | repository、source、boundary、generator、runner、artifact、projection、outbox、clock、id、unit of work trait |
| `infra_adapters` | adapter implementations、runtime builder、config loader / validator、in-memory default path |
| `rust_client_facade` | Rust SDK public client、service client、event client、capability query entry、public error mapping |
| `language_package_surface` | Python / TypeScript public client surface、errors、context、typed exports |
| `cli_entry` | `sdk` binary command entry |
| `jobs` | job runner helper 和 operation binary entry |

### 3.4 每个模块允许依赖哪些模块，禁止依赖哪些模块？

回答：

| 模块 | 允许依赖 | 禁止依赖 |
|---|---|---|
| `contracts` | `core-contracts`、`bus-contracts`、基础序列化 / 时间 / id 类型库 | `domain_*`、`application_*`、`infra_adapters`、`rust_client_facade`、`cli_entry`、`jobs`、语言包 |
| `domain_semantic` | `contracts`、同 crate 纯 domain value object | `application_*`、`infra_adapters`、entry、jobs、Python / TypeScript、外部 I/O |
| `domain_upstream_view` | `contracts`、`domain_semantic`、`core-contracts`、`bus-contracts` | `application_*`、`infra_adapters`、service repos、filesystem、runner |
| `domain_service_client` | `contracts`、`domain_semantic`、`domain_upstream_view`、`domain_boundary_policy` | formal API client 实现、fake endpoint 实现、service 仓源码 |
| `domain_event_client` | `contracts`、`domain_semantic`、`domain_upstream_view`、`domain_boundary_policy`、`bus-contracts` | bus runtime、broker SDK、delivery / retry truth |
| `domain_boundary_policy` | `contracts`、`domain_semantic` 中必要 value object | auth / governance 实现、gateway、secret store、日志正文存储 |
| `domain_package_candidate` | `contracts`、`domain_semantic`、`domain_upstream_view`、`domain_service_client`、`domain_event_client`、`domain_evidence` | package builder 实现、public registry、runner 实现 |
| `domain_evidence` | `contracts`、`domain_boundary_policy`、`domain_package_candidate` 中必要 value object | raw request / response / payload / secret 正文、runner 实现 |
| `domain_compatibility_evolution` | `contracts`、`domain_semantic`、`domain_package_candidate`、`domain_evidence` | ADR 写入实现、public registry、docs runner 实现 |
| `application_services` | `contracts`、所有 `domain_*` 模块、`application_ports` | concrete infra adapter、service 仓源码、public registry SDK |
| `application_ports` | `contracts`、所有 `domain_*` 模块 | `infra_adapters`、entry、jobs、具体外部 SDK |
| `infra_adapters` | `contracts`、所有 `domain_*` 模块、`application_services`、`application_ports`、外部 adapter 依赖 | 被 domain / application 反向依赖；直接拥有 SDK truth |
| `rust_client_facade` | `contracts`、`application_services`、`infra_adapters` runtime builder、`domain_boundary_policy` public value | `cli_entry`、`jobs`、Python / TypeScript package、server gateway |
| `language_package_surface` | 生成 / curated package artifact、公共 schema、typed client surface | Rust domain truth 直接复制、服务仓源码、bus runtime、auth / governance |
| `cli_entry` | `contracts`、`application_services`、`infra_adapters` runtime builder | domain rule 实现、auth / governance、public registry publish |
| `jobs` | `contracts`、`application_services`、`infra_adapters` runtime builder | 绕过 application 改写真相、直接发布 public registry、直接调用服务仓源码 |

### 3.5 哪些对象、trait、handler、repository 应归属于哪个模块？

回答：

| 类别 | 归属模块 | 说明 |
|---|---|---|
| Command / Query / Event / Job / View / Receipt DTO | `contracts` | Step 8 继续定义协议契约 |
| 共同语义、能力模型、跨语言概念 | `domain_semantic` | Step 6 继续定义对象实现契约 |
| 上游版本引用、派生视图、freshness | `domain_upstream_view` | Step 6 / Step 10 继续展开 |
| 服务能力引用和服务 client view | `domain_service_client` | Step 6 / Step 10 继续展开 |
| 事件 client view 和 event semantic mapping | `domain_event_client` | Step 6 继续展开 |
| error / trace / redaction / credential / boundary guard | `domain_boundary_policy` | Step 6 / Step 12 / Step 15 继续展开 |
| candidate、language artifact、candidate status | `domain_package_candidate` | Step 6 / Step 10 继续展开 |
| evidence、evidence result、redaction marker | `domain_evidence` | Step 6 / Step 10 / Step 15 继续展开 |
| compatibility decision、deprecated record、migration guide ref | `domain_compatibility_evolution` | Step 6 / Step 10 继续展开 |
| application service 和 query service | `application_services` | Step 9 继续定义函数级处理流 |
| port trait、repository trait、UnitOfWork trait | `application_ports` | Step 7 继续定义 trait / port 契约 |
| repository implementation、source adapter、runner adapter、config、projection | `infra_adapters` | Step 7 / Step 11 / Step 14 继续展开 |
| Rust SDK public client | `rust_client_facade` | Step 8 / Step 9 继续展开 public surface 与处理流 |
| Python / TypeScript package public surface | `language_package_surface` | Step 8 / Step 9 / Step 16 继续展开 package artifact 和 smoke |
| CLI handler | `cli_entry` | Step 8 / Step 9 继续展开 |
| operations job binary | `jobs` | Step 8 / Step 9 继续展开 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 按 binding / wrapper / middleware / subscription / release 旧主题组织 | 与新版 official client access、candidate evidence 和 compatibility 主线不一致 |
| 旧版 `03-详细设计.md` | 单 crate `src/*` 模块没有明确 package / crate / language package 边界 | 实现者无法按 Step 4 创建 workspace 结构 |
| Step 4 文件布局 | 已有 crate / file tree，但尚未说明正式第 5 章按哪些模块展开 | Step 6~9 可能把对象、trait、协议和处理流再次堆到全局章节 |
| `02-概要设计.md` §5 | 七个主要组成部分是能力主线，不是代码模块主轴 | 若照抄为模块，会导致 port / adapter / DTO / candidate / evidence 横切混写 |
| `02-概要设计.md` §6 | 关键对象已经分布清楚，但尚未绑定到详细设计模块 | Step 6 会缺少对象归属规则 |
| 三语言产物 | 容易按 Rust / Python / TypeScript 三个目录作为模块主轴 | 会让语言表达反向定义 SDK truth，违背 cross-language semantic baseline |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 模块主轴 | binding / wrapper / release 或 crate 粗分 | 16 个实现职责模块 | 支撑按模块展开对象、trait、协议和处理流 |
| 业务组成部分与模块关系 | 容易一一对应 | 明确七个主要组成部分横跨多个模块 | 避免按业务主线拆 crate 造成循环和重复 |
| domain 展开方式 | 一个 `domain` 大节 | 拆成 semantic、upstream view、service client、event client、boundary policy、candidate、evidence、compatibility evolution | 避免 Step 6 变成对象全集堆叠 |
| 语言包位置 | 可能作为三套 truth | `language_package_surface` 只承载 public package surface | 保护共同语义核心 |
| Rust SDK 入口 | 可能误写成 server API | `rust_client_facade` 表达 developer-facing client surface | 避免 SDK 滑向 server gateway |
| 依赖方向 | 旧文不清楚 | 用允许 / 禁止依赖表和模块图固定 | 防止 domain 依赖 infra、jobs 绕过 application |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按七个主要组成部分写第 5 章 | 业务阅读直观 | 每个组成部分都会跨 contracts / domain / application / infra / client / jobs，文件落点不清 | 不采用 |
| 方案 B：只按 Step 4 的 crate 写第 5 章 | 与 workspace 一致，篇幅较短 | `domain` 和 `application` 过大，Step 6~9 会重新堆叠 | 不采用 |
| 方案 C：按实现职责模块写第 5 章，crate 内继续拆 domain / service / port / adapter / package surface | 既保留依赖方向，又能给对象和 trait 找到准确落点 | 模块数量较多，需要正式文档控制篇幅 | 采用 |
| 方案 D：按 Rust / Python / TypeScript 语言目录写第 5 章 | 三语言产物直观 | 会让语言目录拥有平台语义 truth | 不采用 |

推荐方案：方案 C。

原因：

- 详细设计的目标是指导实现，不是重复概要设计的主要组成部分。
- SDK 的主要风险在于三语言 drift、SDK truth 被语言包或 public release 反向定义、domain 过大和边界滑向 gateway。
- 按实现职责模块展开，能让后续 Step 6~9 在同一主轴上继续细化。

---

## 7. 结构化中间产物

### 7.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` | 定义跨入口和跨 package 可复用协议结构 | Command / Query / Event / Job / View / Receipt / Error DTO | `core-contracts`、`bus-contracts` |
| `domain_semantic` | `crates/domain` | 维护 SDK 共同语义、能力模型和跨语言概念一致性 | semantic baseline、capability model、concept map | `contracts` |
| `domain_upstream_view` | `crates/domain` | 维护上游派生视图、语言视图、版本引用和 freshness | derived view、language view、upstream ref、freshness state | `contracts`、`domain_semantic`、上游 contract refs |
| `domain_service_client` | `crates/domain` | 维护服务能力 client view 和 formal / fake boundary 可用性 | service client view、capability ref、support state | `domain_semantic`、`domain_upstream_view`、`domain_boundary_policy` |
| `domain_event_client` | `crates/domain` | 维护 `L0-bus` 事件客户端视图和 semantic mapping | event client view、event semantic mapping | `domain_semantic`、`domain_upstream_view`、`domain_boundary_policy` |
| `domain_boundary_policy` | `crates/domain` | 维护 error、trace、redaction、credential 和 fake boundary 底线 | policies、boundary guard、policy errors | `contracts`、`domain_semantic` |
| `domain_package_candidate` | `crates/domain` | 维护本地 package candidate 和 language artifact 状态 | package candidate、language artifact、candidate status | semantic / view / evidence 模块 |
| `domain_evidence` | `crates/domain` | 维护验证证据、脱敏状态和 artifact 引用 | verification evidence、result、redaction marker | `domain_boundary_policy`、`domain_package_candidate` |
| `domain_compatibility_evolution` | `crates/domain` | 维护兼容判断、deprecated 生命周期和 migration 引用 | compatibility decision、deprecated record、migration guide ref | semantic / candidate / evidence 模块 |
| `application_services` | `crates/application` | 编排 P0 use case、事务、幂等、outbox、query 和 job | application service、query service、consumer service | `contracts`、所有 `domain_*`、`application_ports` |
| `application_ports` | `crates/application` | 定义外部依赖端口和 repository 边界 | port trait、repository trait、unit of work trait | `contracts`、所有 `domain_*` |
| `infra_adapters` | `crates/infra` | 实现 port、repository、config、runtime builder、adapter 和 projection | adapter types、runtime builder、config types | `application_*`、`domain_*`、`contracts` |
| `rust_client_facade` | `crates/client` | 承载 Rust developer-facing SDK client surface | Rust SDK client、service client、event client | `contracts`、`application_services`、`infra_adapters` |
| `language_package_surface` | `packages/python` / `packages/typescript` | 承载 Python / TypeScript public package surface | Python / TypeScript client、errors、context、exports | generated / curated package artifacts |
| `cli_entry` | `crates/cli` | 承载本地维护命令入口 | `sdk` binary、CLI command handlers | `contracts`、`application_services`、`infra_adapters` |
| `jobs` | `crates/jobs` | 承载一次性 operations job | job runner、operation binaries | `contracts`、`application_services`、`infra_adapters` |

### 7.2 模块职责表

| 模块 | 所属实现单元 | 对应概要设计主要组成部分 | 主要责任 | 对外暴露 | 允许依赖 | 禁止依赖 |
|---|---|---|---|---|---|---|
| `contracts` | `crates/contracts` | API / 接口骨架 | 定义跨模块共享协议对象 | DTO / error / receipt | `core-contracts`、`bus-contracts`、基础 value 类型 | domain / application / infra / entry / jobs / language package |
| `domain_semantic` | `crates/domain` | 官方客户端语义核心 | 维护共同语义和三语言概念一致 | semantic types | `contracts`、纯 value object | application / infra / runner / language package |
| `domain_upstream_view` | `crates/domain` | 上游契约消费与派生视图 | 维护派生视图、语言视图、版本引用和 freshness | view / ref / state types | `contracts`、`domain_semantic`、上游 contract refs | source adapter / filesystem / service repo |
| `domain_service_client` | `crates/domain` | 平台能力访问与正式边界适配 | 维护服务 client view 和 support 判断 | service view / ref / state types | `domain_semantic`、`domain_upstream_view`、`domain_boundary_policy` | formal API implementation / service repo |
| `domain_event_client` | `crates/domain` | 事件客户端视图 | 维护 bus event client view 和 mapping | event view / mapping types | `domain_semantic`、`domain_upstream_view`、`domain_boundary_policy`、`bus-contracts` | bus runtime / broker SDK |
| `domain_boundary_policy` | `crates/domain` | 横切默认行为 | 维护安全、trace、错误和 fake boundary 底线 | policy / guard types | `contracts`、`domain_semantic` | auth / governance / secret store / log body store |
| `domain_package_candidate` | `crates/domain` | package candidate 与验证证据 | 维护 candidate 和 language artifact 状态 | candidate types | semantic / view / evidence value | builder implementation / public registry |
| `domain_evidence` | `crates/domain` | package candidate 与验证证据 | 维护验证证据和安全引用条件 | evidence types | `domain_boundary_policy`、candidate value | raw body / secret / runner implementation |
| `domain_compatibility_evolution` | `crates/domain` | 文档、兼容与演进 | 维护兼容决策、deprecated 和 migration 引用 | compatibility / deprecated / migration types | semantic / candidate / evidence value | docs runner implementation / ADR writer / registry |
| `application_services` | `crates/application` | 七个主要组成部分的编排层 | 编排 use case、事务、幂等、event、evidence 和 query | service functions | `contracts`、`domain_*`、`application_ports` | concrete infra adapter / service repo |
| `application_ports` | `crates/application` | Ports / Projection / Artifact / Adapter | 定义外部依赖端口 | port trait | `contracts`、`domain_*` | infra / entry / jobs / external SDK |
| `infra_adapters` | `crates/infra` | 技术承载与外部适配 | 实现 port、config、repository、runner、projection 和 wiring | adapter / config / builder | `application_*`、`domain_*`、`contracts` | 被 domain / application 反向依赖 |
| `rust_client_facade` | `crates/client` | 平台能力访问与事件客户端视图 | 提供 Rust developer-facing SDK surface | Rust client API | `contracts`、`application_services`、`infra_adapters` | CLI / jobs / language package / server gateway |
| `language_package_surface` | `packages/python` / `packages/typescript` | package candidate 与验证证据、文档示例 | 提供 Python / TypeScript public surface | package exports | generated / curated artifact | owning SDK truth / service repo / bus runtime |
| `cli_entry` | `crates/cli` | Inbound / Operations | 将本地维护命令转入 application | CLI entry | `contracts`、`application_services`、`infra_adapters` | domain rule / auth / registry publish |
| `jobs` | `crates/jobs` | Operations Job | 运行 freshness、candidate、package、smoke、docs、compatibility、boundary 和 projection job | job binaries | `contracts`、`application_services`、`infra_adapters` | 绕过 application 改写真相 |

### 7.3 模块依赖图

#### 模块依赖图: L0-sdk 模块实现主轴

```text
[rust_client_facade] -- call --> [application_services]
[cli_entry]          -- call --> [application_services]
[jobs]               -- call --> [application_services]

[application_services] -- use port --> [application_ports]
[infra_adapters]       -- impl port --> [application_ports]

[application_services] -- use --> [domain_semantic]
[application_services] -- use --> [domain_upstream_view]
[application_services] -- use --> [domain_service_client]
[application_services] -- use --> [domain_event_client]
[application_services] -- use --> [domain_boundary_policy]
[application_services] -- use --> [domain_package_candidate]
[application_services] -- use --> [domain_evidence]
[application_services] -- use --> [domain_compatibility_evolution]

[domain_upstream_view]           -- use --> [domain_semantic]
[domain_service_client]          -- use --> [domain_semantic]
[domain_service_client]          -- use --> [domain_upstream_view]
[domain_service_client]          -- use --> [domain_boundary_policy]
[domain_event_client]            -- use --> [domain_semantic]
[domain_event_client]            -- use --> [domain_upstream_view]
[domain_event_client]            -- use --> [domain_boundary_policy]
[domain_package_candidate]       -- use --> [domain_semantic]
[domain_package_candidate]       -- use --> [domain_upstream_view]
[domain_package_candidate]       -- use --> [domain_service_client]
[domain_package_candidate]       -- use --> [domain_event_client]
[domain_package_candidate]       -- use --> [domain_evidence]
[domain_evidence]                -- use --> [domain_boundary_policy]
[domain_compatibility_evolution] -- use --> [domain_semantic]
[domain_compatibility_evolution] -- use --> [domain_package_candidate]
[domain_compatibility_evolution] -- use --> [domain_evidence]

[contracts] -- shared dto --> [application_services]
[contracts] -- shared dto --> [application_ports]
[contracts] -- shared dto --> [infra_adapters]
[contracts] -- shared dto --> [rust_client_facade]
[contracts] -- shared dto --> [cli_entry]
[contracts] -- shared dto --> [jobs]

[infra_adapters] -- build artifacts --> [language_package_surface]
[jobs]           -- verify packages --> [language_package_surface]
```

关键说明：

- 图表达模块级依赖方向，不表达函数级调用链。
- `domain_*` 模块不得依赖 `application_services`、`application_ports`、`infra_adapters`、entry、jobs 或语言包。
- `application_ports` 定义外部依赖，`infra_adapters` 实现外部依赖，入口模块通过 runtime builder 使用实现。
- `language_package_surface` 是 package surface，不是 SDK truth；它由 artifacts 和 candidate evidence 约束。
- `rust_client_facade` 是 SDK public client，不是 server API / gateway。

### 7.4 代码主体归属映射

| 代码主体 | 类型 | 归属模块 | 后续展开 Step |
|---|---|---|---|
| `UpdateSdkSemanticBaseline` / `RefreshDerivedBindingView` / `InvokeServiceCapability` / `PublishBusEvent` / `RecordCompatibilityDecision` / `DeprecateSdkApi` | Command DTO | `contracts` | Step 8 |
| `GetSdkCapabilitySummary` / `GetSnapshotFreshness` / `GetServiceClientView` / `GetEventClientView` / `GetVerificationEvidence` | Query DTO | `contracts` | Step 8 |
| `ConsumeCoreContractChanged` / `ConsumeBusSemanticChanged` / `ConsumeFormalApiChanged` / `ConsumeValidationRunFinished` | Consumer DTO / handler input | `contracts` / `application_services` | Step 8 / Step 9 |
| `SdkSemanticBaselineChangedEvent` / `PackageCandidateGeneratedEvent` / `VerificationEvidenceRecordedEvent` / `CompatibilityDecisionRecordedEvent` | Outbound Event DTO | `contracts` | Step 8 |
| `CheckUpstreamFreshness` / `GeneratePackageCandidate` / `BuildLanguagePackages` / `RunCrossLanguageSmoke` / `ValidateDocsExamples` / `CheckCompatibility` / `VerifyBoundaryPolicies` / `RebuildSdkProjections` | Job DTO / runner | `contracts` / `jobs` | Step 8 / Step 9 |
| `SdkSemanticBaseline` / `ClientCapabilityModel` / `CrossLanguageConceptMap` | Domain object | `domain_semantic` | Step 6 |
| `DerivedBindingView` / `LanguageBindingView` / `UpstreamVersionRef` / `SnapshotFreshnessState` | Domain view / state | `domain_upstream_view` | Step 6 / Step 10 |
| `ServiceClientView` / `ServiceCapabilityRef` / `CapabilitySupportState` | Domain view / state | `domain_service_client` | Step 6 / Step 10 |
| `BusEventClientView` / `EventSemanticMapping` | Domain view / value object | `domain_event_client` | Step 6 |
| `ErrorMappingPolicy` / `TracePropagationPolicy` / `RedactionPolicy` / `CredentialProtectionPolicy` / `BoundaryGuard` | Domain policy | `domain_boundary_policy` | Step 6 / Step 12 / Step 15 |
| `PackageCandidate` / `LanguageArtifact` / `PackageCandidateStatus` | Domain truth / state | `domain_package_candidate` | Step 6 / Step 10 |
| `VerificationEvidence` / `EvidenceResult` / `EvidenceRedactionStatus` | Evidence object / state | `domain_evidence` | Step 6 / Step 10 |
| `CompatibilityDecision` / `DeprecatedApiRecord` / `MigrationGuideRef` | Decision / record / ref | `domain_compatibility_evolution` | Step 6 / Step 10 |
| `SdkSemanticBaselineService` / `ContractConsumptionService` / `ServiceClientAssemblyService` / `EventClientAssemblyService` | Application service | `application_services` | Step 9 |
| `PackageCandidateService` / `CandidateValidationService` / `CompatibilityGovernanceService` / `DocsExampleValidationService` / `QueryService` | Application service | `application_services` | Step 9 |
| source / boundary / generator / runner / artifact / repository / outbox / clock / id / unit of work trait | Port trait | `application_ports` | Step 7 |
| repository implementation / source adapter / formal API adapter / fake adapter / bus adapter / runner adapter / package builder / projection / config | Adapter implementation | `infra_adapters` | Step 7 / Step 11 / Step 14 |
| `SdkClientEntry` / `ServiceClientEntry` / `EventClientEntry` / `CapabilityQueryEntry` | Rust client entry | `rust_client_facade` | Step 8 / Step 9 |
| Python / TypeScript client, service client, event client, errors, context | Language package surface | `language_package_surface` | Step 8 / Step 9 / Step 16 |
| `sdk` command handlers | CLI handler | `cli_entry` | Step 8 / Step 9 |
| operation job binary | Job implementation | `jobs` | Step 8 / Step 9 |

### 7.5 正式文档模块小节骨架

正式 `03` 的 §5 应按以下固定结构展开每个模块。本 Step 只收稳主轴；`对象实现契约`、`Trait / Port / Adapter 契约`、`关键函数`、`错误类型`、`测试切口`分别由 Step 6~16 回填。

```text
### 5.x <module> 模块
#### 5.x.1 模块职责
#### 5.x.2 文件与代码主体映射
#### 5.x.3 对象实现契约
#### 5.x.4 Trait / Port / Adapter 契约
#### 5.x.5 模块内关键函数
#### 5.x.6 模块错误类型
#### 5.x.7 模块测试切口
```

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §5 应从本文件摘录并收敛为以下结构：

```md
## 5. 模块实现契约

> 校准来源：
> - `design-calibration/03_ddd_step_05_module_contracts_axis.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/03_ddd_step_05_module_contracts_axis.md` 的“模块总览表”“模块职责表”“模块依赖图”“代码主体归属映射”和“待确认事项”小节，了解正式第 5 章为什么按实现职责模块展开。

本章按实现职责模块展开，不按七个主要组成部分、对象全集或 Rust / Python / TypeScript 语言目录展开。七个主要组成部分描述 `L0-sdk` 做什么；实现模块描述代码如何安放、暴露和依赖。

### 5.1 模块总览

从 `design-calibration/03_ddd_step_05_module_contracts_axis.md` §7.1 摘录。

### 5.2 模块依赖图

从 `design-calibration/03_ddd_step_05_module_contracts_axis.md` §7.3 摘录。

### 5.3~5.18 各模块实现契约

从 `design-calibration/03_ddd_step_05_module_contracts_axis.md` §7.2 的各模块职责表创建正式小节。
对象、trait、函数、错误和测试切口由 Step 6~16 回填。

### 5.19 代码主体归属映射

从 `design-calibration/03_ddd_step_05_module_contracts_axis.md` §7.4 摘录。
```

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 第 5 章按什么主轴展开 | A. 七个主要组成部分；B. Step 4 crate；C. 实现职责模块 | 推荐 C | C 既能承接 workspace 依赖方向，又能给对象、port、handler、adapter、语言包 surface 找到准确落点 |
| 是否拆分 `domain` 为多个模块 | A. 不拆；B. 按对象类型拆；C. 按职责拆成 semantic / upstream / client view / policy / candidate / evidence / evolution | 推荐 C | `domain` 对象过多，按职责拆能支撑 Step 6 按模块展开 |
| 是否把 Python / TypeScript 作为模块主轴 | A. 作为 truth 模块；B. 作为 package surface 模块；C. 不进入第 5 章 | 推荐 B | 它们是 P0 产物和 smoke 对象，但不能拥有 SDK truth |
| `rust_client_facade` 是否等同 `api` 模块 | A. 等同；B. 不等同，单独命名为 client facade；C. 只用 CLI 暴露 | 推荐 B | SDK 是 developer-facing client，不是 server API / gateway |
| `jobs` 是否允许直接改写 repository | A. 允许；B. 禁止，必须通过 application services；C. 后续再定 | 推荐 B | operations job 不能绕过 use case、审计、outbox 和事务边界 |

当前无阻塞进入 Step 6 的待确认事项。上述推荐方案作为本轮自动选择的设计口径，若后续 Step 发现对象、接口或状态无法落位，再回退本 Step 修正。

---

## 10. 进入下一步条件

```text
模块主轴已经稳定。
每个对象、trait、handler、repository、adapter、client surface、language package surface 和 job 都能找到归属模块。
可以进入 Step 6,逐模块定义对象实现契约。
```
