# L3-method-library 02 概要 Step 7: API / 接口骨架

> 创建日期: 2026-06-16
> 状态: completed_formal_backfilled
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-method-library/02-概要设计.md`
> 本轮口径: Step 7 已按 `R1` 全量重审并在 `R1.45` 记录正式 §7 回填;本文原 5.x 完成态、旧正式 §7、旧 Step 8/9 和历史 DDD 仅作为 historical material。

---

> 当前有效结论以 `R1.24`~`R1.45` 为准。本文原 `1`~`6` 章和 `5.x` 完成态保留为 historical material,仅用于后置差异审计和污染检查。

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 7 API / 接口骨架 |
| 输出文件 | `design-calibration/02_hld_step_07_api_interface_skeleton.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取前序 Step | yes:`design-calibration/02_hld_step_05_components_boundary.md`;`design-calibration/02_hld_step_06_key_objects.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 7;`概要设计书写规范.md` 4.7 |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md` |
| 旧材料处理 | 本文件既有 5.x 完成态、正式 §7 旧正文、旧 Step 8/9 和历史 DDD 均只能作为 historical material 和后置差异审计输入 |
| 进入条件 | pass:Step 6 `8.45` 已关闭 |
| next_allowed_action | Step 7 已完成;等待用户确认后进入 Step 8 `开工与必读文档:先思考`;不得直接写 Step 8 正文,不得沿用旧正式 §8。 |

---

## 1. 必读文档

| 文档 | 读取重点 | 对 Step 7 的约束 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 7 | Command / Query / Inbound Event / Outbound Event / Operations Job 分类、应问问题、停审要求。 | 必须按主要组成部分标注接口归属,说明接口承接的关键对象或对象能力。 |
| `standards/document/概要设计书写规范.md` 4.7 | 接口分类说明、Command / Query / Event / Job 表格式、输入输出骨架写法。 | 输入骨架写对象骨架名;不写 HTTP path、完整 JSON / proto schema、topic 字段全集或错误码。 |
| `standards/document/设计文档讨论中间产物规范.md` | Step 级先搭框架、模块级先思考后写入、台账恢复纪律。 | Step 7 必须先搭整体模块,再逐模块写接口骨架;单次写入行数不等于文件总长度上限。 |
| `projects/L3-method-library/00-需求文档.md` | 功能需求、接口 / 依赖边界、验收和禁止事项。 | 接口必须服务定义、目录、正式化、消费、追溯、一致性、外部摘要、维护和外围增强,不得迁入下游 truth。 |
| `projects/L3-method-library/01-架构设计.md` | 系统上下文、限界上下文、数据所有权、交互通信和依赖方向。 | 编译期 / 运行期 / 事件协作边界必须清楚;外部正文、交易履约和运行状态不得入仓。 |
| `design-calibration/02_hld_step_05_components_boundary.md` | Step 7 承接规则、应用服务线索、read model / typed ref / boundary 线索。 | 接口按定义、正式化、消费、追溯、关系分发、外部摘要、维护和外围组织分组,不得按 repository / handler / 旧模块分组。 |
| `design-calibration/02_hld_step_06_key_objects.md` | 关键对象、typed ref、policy / guard、task / view、反查和旧材料污染审计。 | 接口参数和返回必须优先使用 Step 6 对象 / ref / summary / material;不得私造 DTO 字段绕过对象轮廓。 |

---

## 2. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块搭建。 |
| 整体模块搭建 | done | Step 7 文件框架、模块顺序、候选接口池 | pass | 进入“接口分类与候选池:先思考”。 |
| 接口分类与候选池:先思考 | done | Command / Query / Event / Job 分类判断 | pass | 进入“接口分类与候选池:再写入”。 |
| 接口分类与候选池:再写入 | done | 接口候选池和分类说明 | pass | 进入“方法资产定义与目录接口:先思考”。 |
| 方法资产定义与目录接口:先思考 | done | 本组成部分接口判断 | pass | 进入“方法资产定义与目录接口:再写入”。 |
| 方法资产定义与目录接口:再写入 | done | Command / Query 骨架和停审 | pass | 进入“正式化与版本接口:先思考”。 |
| 正式化与版本接口:先思考 | done | 本组成部分接口判断 | pass | 进入“正式化与版本接口:再写入”。 |
| 正式化与版本接口:再写入 | done | Command / Query / Inbound 可能性和停审 | pass | 进入“受控消费接口:先思考”。 |
| 受控消费接口:先思考 | done | 本组成部分接口判断 | pass | 进入“受控消费接口:再写入”。 |
| 受控消费接口:再写入 | done | Query / boundary command 骨架和停审 | pass | 进入“追溯与一致性保护接口:先思考”。 |
| 追溯与一致性保护接口:先思考 | done | 本组成部分接口判断 | pass | 进入“追溯与一致性保护接口:再写入”。 |
| 追溯与一致性保护接口:再写入 | done | Query / report / protection command 骨架和停审 | pass | 进入“关系与分发语义接口:先思考”。 |
| 关系与分发语义接口:先思考 | done | 本组成部分接口判断 | pass | 进入“关系与分发语义接口:再写入”。 |
| 关系与分发语义接口:再写入 | done | Command / Query / outbound 可能性和停审 | pass | 进入“外部摘要与引用接口:先思考”。 |
| 外部摘要与引用接口:先思考 | done | 本组成部分接口判断 | pass | 进入“外部摘要与引用接口:再写入”。 |
| 外部摘要与引用接口:再写入 | done | Command / Query / inbound 可能性和停审 | pass | 进入“后台维护与收敛接口:先思考”。 |
| 后台维护与收敛接口:先思考 | done | Operations Job 判断 | pass | 进入“后台维护与收敛接口:再写入”。 |
| 后台维护与收敛接口:再写入 | done | Operations Job / Query 骨架和停审 | pass | 进入“外围包与方法集组织接口:先思考”。 |
| 外围包与方法集组织接口:先思考 | done | 外围增强接口判断 | pass | 进入“外围包与方法集组织接口:再写入”。 |
| 外围包与方法集组织接口:再写入 | done | Command / Query 骨架和停审 | pass | 进入“跨接口一致性审计”。 |
| 跨接口一致性审计 | done | 分类、命名、对象承接和边界审计 | pass | 进入“旧材料差异审计”。 |
| 旧材料差异审计 | done | 旧 Step 7 / 旧概要接口污染检查 | pass | 进入“自检与停审”。 |
| 自检与停审 | done | Step 7 完成门禁和 flow / 台账更新依据 | pass | 进入正式 §7 回填记录。 |
| 正式 §7 回填记录 | done | `R1.45` 正式 §7 回填范围、检查和后续风险 | pass | Step 7 已完成;下一步进入 Step 8 开工与必读文档:先思考。 |

---

## 3. 整体模块骨架

| 模块组 | 本 Step 要做 | 本 Step 不做 |
|---|---|---|
| 接口分类 | 区分 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job,并说明每类是否适用。 | 不按 HTTP path、RPC 方法、repository、handler、worker 或旧模块名分类。 |
| 输入输出骨架 | 写输入骨架、输出骨架、主要处理摘要、写入结果、读取来源和边界。 | 不写完整 JSON / proto schema、字段全集、错误码、HTTP status、topic 字段全集或回调参数全集。 |
| 逐组成部分小循环 | 按 Step 5 的 8 个组成部分逐个判断接口,每部分完成后停审。 | 不一次性生成全仓接口全集后再补归属。 |
| 对象承接 | 每个接口必须回指 Step 6 对象、typed ref、summary、material、policy、guard、task 或 view。 | 不私造 DTO 字段绕过 Step 6 对象轮廓。 |
| 事件协作 | 判断是否需要 inbound / outbound 事件协作边界,仅写概要级 event / consumer 骨架。 | 不继承旧 outbox 机制,不写 topic 命名规则全集、payload schema 或 relay 实现。 |
| 维护入口 | 判断哪些动作属于 Operations Job,并说明其不改写核心 truth。 | 不写 job 调度、worker loop、retry 策略、锁、队列或运维脚本。 |
| 后置差异审计 | 当前接口骨架形成后再审计旧接口污染。 | 不让旧 `CreateMethodContentDraft` / `PublishMethodContent` 等接口名参与当前候选池推导。 |

---

## 4. Step 6 对象到接口候选池接收

| 组成部分 | Step 6 对象 / 能力 | Step 7 初始接口候选方向 |
|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`MethodAssetCatalogView` | 定义建立 / 调整 Command;目录登记 / 读取 Query;definition ref lookup。 |
| 正式化与版本 | `FormalMethodAssetVersion`;`FormalizationBasisSummary`;`FormalizationState`;`FormalizationEligibilityRule` | 正式化判断 Command;正式版本建立 / 变更 Command;正式版本读取 Query;外部依据或治理摘要承接。 |
| 受控消费 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | 消费材料读取 Query;消费边界判断 Query 或 guard-facing Command;下游消费语境接口。 |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail`;`TraceSubjectRef` | trace / audit Query;消费影响摘要接收或读取;一致性保护判断 Command / Query。 |
| 关系与分发语义 | `MethodAssetRelation`;`MethodAssetDistributionRef`;`RelationIntegrityRule` | 关系建立 / 调整 Command;关系读取 Query;分发语义 ref 读取 / 维护。 |
| 外部摘要与引用 | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule` | 外部摘要承接 Command;外部引用读取 Query;forbidden body guard-facing 接口。 |
| 后台维护与收敛 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView` | read material refresh job;trace material refresh job;consistency recovery job;maintenance progress Query。 |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageRef` | package / set 创建调整 Command;package / set 读取 Query;外围发现支撑 Query。 |

---

## 5. 模块执行记录

### 5.1 接口分类与候选池:先思考

问题回答:

- 当前 Step 7 的接口分类必须从 Step 5 的 8 个组成部分和 Step 6 的对象 / ref / summary / material / task 推导,不能恢复旧 `MethodContent` command、旧 publish API、旧 snapshot / outbox / fingerprint 接口。
- Command 只用于改写本仓正式 truth、正式边界或外围 truth。凡是只读取、判断、过滤、查找或返回派生材料的入口,不能因为“会触发 guard”就写成 Command。
- Query 只读取 projection、read material、summary、ref 或 availability view。若 query 需要 actor / consumer context,也仍是 Query,不得在读取路径修复 truth 或补写 material。
- Inbound Event Consumer 只在外部系统已经拥有正式事件事实、且本仓只接收 body-free summary / ref / impact hint 时成立。它不是旧同步机制,也不是把外部正文搬进本仓的入口。
- Outbound Event 只表达本仓正式事实变化后需要通知下游的概要级事件边界。是否有 outbox、topic、relay、payload 字段和投递策略留给详细设计,本 Step 只判断事件是否有业务必要性。
- Operations Job 只用于 read material refresh、trace material refresh、consistency recovery 等维护收敛动作。它不得绕过正式化、版本、消费边界或关系完整性去修核心 truth。

诊断:

- 本仓确实需要 Command 和 Query。定义、目录、正式化、版本、关系、外部摘要和外围组织都存在本地 truth 或边界写入;目录、版本、消费材料、追溯、关系、外部摘要、维护进度和外围组织也都需要正式读取入口。
- Inbound Event Consumer 需要谨慎保留。当前 00 / 01 指向治理、标准、ADR、artifact / archive、下游消费影响等外部来源,但 Step 5 / Step 6 也反复禁止外部正文和下游运行 truth 入仓。因此 inbound 只能作为“接收摘要 / 引用 / 影响线索”的候选,不能泛化成同步通道。
- Outbound Event 不能从旧 outbox 机制继承,但本仓正式版本、消费材料可用性、关系 / 分发语义和外围组织变化会影响下游消费方,所以需要保留概要级 outbound event 候选,后续再由详细设计决定可靠投递机制。
- Operations Job 是必要分类。Step 6 已独立展开 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask` 和 `MaintenanceProgressView`,如果 Step 7 不把它们落到 job 骨架,Step 8 / Step 9 的维护收敛会悬空。
- `guard-facing Command` 需要收窄。消费边界、一致性保护、正文禁止和包组成规则可以出现在 Command 处理摘要里,但 guard 本身不应变成外部 API;只有当它产生正式决策或写入边界对象时,才进入 Command 候选。

取舍:

- Command 输入骨架后续默认判断 `ActorContext`、`CommandMetadata` 和幂等信息;具体字段名、协议载体和错误码留给详细设计。
- Query 输入骨架后续默认判断读取方语境,尤其是 `ConsumptionContextRef`、`CatalogScopeRef`、`TraceSubjectRef`、`MarketplaceContextRef` 等 typed ref;是否统一叫 `ActorContext` 只在概要层说明,不写协议 schema。
- Inbound Event Consumer 后续只保留三类候选来源:外部依据摘要 / 引用到达、artifact / archive ref 可用性变化、下游消费影响摘要到达。若某来源不能提供 body-free summary / typed ref,必须降级为“非接口,待外部先形成摘要”。
- Outbound Event 后续只保留面向下游消费和外围生态的事实变化候选,不表达内部 application service 调用、repository 写入或 maintenance progress tick。
- Operations Job 后续按 Step 6 的 task 对象展开,输入以 task / scope / run ref 表达,输出以 refreshed material / recovery summary / progress view 表达,不写 worker loop。

复杂度 / 越界检查:

- 本模块只确定分类口径和候选池筛选原则,没有写完整接口全集。
- 未写 HTTP path、RPC 方法、JSON / proto schema、event payload 字段、topic、repository / port 方法、worker 调度或数据库表。
- 未把旧 `CreateMethodContentDraft`、`PublishMethodContent`、旧 outbox、旧 snapshot 或旧 fingerprint 作为接口来源。
- 下一模块只允许把上述判断写成接口分类说明和候选池总览,不得直接进入逐组成部分接口骨架。

### 5.2 接口分类与候选池:再写入

#### 5.2.1 接口分类说明

| 接口类别 | 本仓是否适用 | 判定口径 | 输入骨架共性 | 输出骨架共性 | 禁止事项 |
|---|---|---|---|---|---|
| Command API | 适用 | 改写本仓 truth、正式边界、支撑 summary / ref 或外围 truth。 | 对象 / ref / summary 输入;需要判断 `ActorContext`、`CommandMetadata`、幂等信息。 | accepted / rejected 结果、被写入对象 ref、必要的 summary。 | 不写读取接口;不绕过正式化、版本和消费边界;不保存外部正文。 |
| Query API | 适用 | 读取 catalog、version、consumption material、trace、relation、external summary、maintenance progress 或 peripheral view。 | 读取方语境、scope / subject / context typed ref;需要判断读取授权或消费语境。 | view、summary、material、availability 或 progress。 | 不在 query 中 repair truth、刷新 material、补写外部摘要或创建对象。 |
| Inbound Event Consumer | 有条件适用 | 外部正式事实已经成立,本仓只接收 body-free summary / ref / impact hint。 | 来源事件 envelope、event id、幂等键、typed external ref / summary。 | accepted / ignored / rejected consumer result,或转入本仓 command 语义。 | 不继承旧同步机制;不接收 raw body、artifact 正文、治理执行正文或下游运行状态。 |
| Outbound Event | 有条件适用 | 本仓正式事实变化需要通知下游消费方或外围生态。 | 由本仓 command / job 结果产生,只含 fact ref / summary ref。 | 概要级 fact-changed / material-available / relation-changed 事件。 | 不写 topic、payload 字段全集、relay、outbox 实现或投递策略。 |
| Operations Job | 适用 | 维护 read material、trace material、引用有效性和一致性恢复。 | task / scope / run ref,以及必要的 maintenance context。 | refreshed material ref、recovery summary、progress view。 | 不创建或修复核心 truth;不绕过正式化和消费保护;不写调度和重试实现。 |

#### 5.2.2 接口候选池总览

| 组成部分 | Command 候选方向 | Query 候选方向 | Event / Job 候选方向 | 下一步展开重点 |
|---|---|---|---|---|
| 方法资产定义与目录 | 建立 / 调整 `MethodAssetDefinition`;登记 / 调整 `MethodAssetCatalogEntry`。 | 读取 `MethodAssetCatalogView`;按 `MethodAssetDefinitionRef` 查定义摘要;按 `CatalogScopeRef` 查目录。 | 可产生 definition / catalog changed outbound event 候选;不接收外部正文事件。 | 区分定义 truth 写入、目录语义写入和 catalog read。 |
| 正式化与版本 | 执行正式化判断;建立 `FormalMethodAssetVersion`;记录 `FormalizationBasisSummary` 使用结果。 | 读取正式版本、正式化状态和 basis summary。 | 可接收外部 basis summary 到达事件;可产生 formal version established outbound event。 | 明确正式化 command 与外部摘要承接的边界。 |
| 受控消费 | 必要时记录消费边界决策或生成消费材料,但 guard 本身不单独外露。 | 读取 `MethodAssetConsumptionMaterial`;读取 `MethodAssetAvailabilityView`;判断下游消费语境。 | 可产生 consumption material available / unavailable outbound event。 | 保持 Definition vs Use,避免 query 反写 truth。 |
| 追溯与一致性保护 | 记录消费影响摘要;执行一致性保护决策;追加 body-free audit / trace 线索。 | 读取 `MethodAssetTraceMaterial`;读取 `ConsumptionImpactSummary`;读取 `MethodAssetAuditTrail`。 | 可接收下游 impact summary;可产生 protection required / trace material changed event 候选。 | 区分 impact summary 接收、trace read 和 protection command。 |
| 关系与分发语义 | 建立 / 调整 `MethodAssetRelation`;维护 `MethodAssetDistributionRef`。 | 读取关系视图、分发语义和 relation integrity 结果。 | 可产生 relation / distribution changed outbound event。 | 防止关系接口变成 marketplace 交易或安装履约。 |
| 外部摘要与引用 | 接收 / 更新 `ExternalSourceSummary`;登记 `ExternalSourceRef` / `ArtifactArchiveRef`;执行正文禁止 guard。 | 读取外部摘要、外部 ref 和 acceptance state。 | 可接收 body-free external summary / archive ref event。 | 明确只接收摘要 / 引用,不接收正文。 |
| 后台维护与收敛 | 无业务 Command;维护动作归入 Operations Job。 | 读取 `MaintenanceProgressView` 和维护结果摘要。 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`。 | job 只刷新材料和收敛状态,不得修核心 truth。 |
| 外围包与方法集组织 | 建立 / 调整 `MethodPackage`;组装 / 调整 `MethodSetAssembly`。 | 读取 package / set view;按 `MarketplaceContextRef` 支撑外围发现。 | 可产生 package / method set changed outbound event;外围不可用不影响核心。 | 标注外围增强,不作为核心闭环前置。 |

停审记录:

- 功能是否清楚: pass。五类接口适用性已按本仓对象和组成部分判断。
- 接缝是否清楚: pass。Command / Query / Inbound / Outbound / Job 的边界和禁止事项已经分开。
- 对象承接是否清楚: pass。候选接口均可回指 Step 6 对象、typed ref、summary、material、task 或 view。
- 是否越界: pass。未写协议、字段全集、topic、port、repository、worker、DDL 或旧同步机制。
- 下一步: 进入“方法资产定义与目录接口:先思考”,只展开该组成部分的接口判断。

### 5.3 方法资产定义与目录接口:先思考

问题回答:

- 本组成部分需要正式暴露定义 truth 写入、目录语义写入和目录读取三类入口。它们分别承接 `MethodAssetDefinition`、`MethodAssetCatalogEntry` 和 `MethodAssetCatalogView`。
- 定义建立 / 调整属于 Command,因为会改写本仓拥有的定义 truth。目录登记 / 重分类也属于 Command,因为 `MethodAssetCatalogEntry` 是目录语义对象,不是单纯索引。
- 目录浏览、definition ref lookup 和 catalog view 读取属于 Query。它们读取 `MethodAssetCatalogView` 或 definition summary,不得在读取路径中创建目录项、修复视图或补写定义。
- 本组成部分暂不需要 Inbound Event Consumer。外部标准、ADR、artifact 或治理依据不能直接进入定义正文;它们应先通过“外部摘要与引用”形成 summary / ref,再被正式化或追溯使用。
- 本组成部分可以产生概要级 outbound event 候选,但只表达 definition / catalog fact changed,不承诺 outbox、topic 或 payload schema。

诊断:

- 若把目录登记写成 Query 或 projection refresh,后续 Step 8 会把目录语义误放进读取材料维护流,导致 catalog truth 不稳。
- 若把 `MethodAssetDefinitionRef` lookup 写成任意字符串解析,后续正式化、消费、关系和追溯会缺少稳定 typed ref 来源。
- 定义调整不能直接产生正式版本变化结论。正式版本含义必须交给“正式化与版本”,否则定义层会越过版本稳定边界。
- `MethodAssetCatalogView` 的刷新不应在本组成部分作为外部 Command 暴露;读取材料刷新属于后台维护与收敛或后续处理流内部派生。

取舍:

- Command 候选保留四个:建立定义、调整定义、登记目录项、重分类目录项。它们覆盖 Step 6 definition / catalog 对象,但不展开字段全集。
- Query 候选保留四个:获取定义摘要、解析 definition ref、列出目录视图、获取目录项视图。它们足以支撑后续正式化输入、消费发现和目录浏览。
- Outbound event 只保留为候选:定义变更、目录变更。是否真的需要发布、发布给谁、如何可靠投递,留给 Step 8 / 03。
- 本组成部分不定义 Operations Job;目录视图刷新由后台维护与收敛统一处理。

复杂度 / 越界检查:

- 未写 HTTP path、RPC 名、完整 DTO、错误码、数据库索引或 repository 方法。
- 未把 `MethodAssetCatalogView` 写成第二 truth。
- 未把外部正文、旧 P0 类型、文件路径或 marketplace listing id 当作定义输入。
- 下一模块只允许写本组成部分接口骨架表和停审记录。

### 5.4 方法资产定义与目录接口:再写入

#### 5.4.1 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| EstablishMethodAssetDefinition | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDefinitionSummary`;可选目录语境。 | `MethodAssetDefinitionRef`;定义 accepted summary。 | 建立本仓拥有的 `MethodAssetDefinition`,并形成稳定 typed ref。 | 不接收外部正文;不恢复旧 `MethodContent` payload;不裁决正式版本。 |
| AdjustMethodAssetDefinition | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDefinitionRef`;`DefinitionAdjustmentSummary`。 | 调整后的 `MethodAssetDefinitionRef`;definition change summary。 | 对已有定义 truth 记录显式调整线索,供追溯和后续正式化判断使用。 | 不直接改写正式版本;不把调整历史写成 raw audit log。 |
| RegisterMethodAssetCatalogEntry | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDefinitionRef`;`CatalogScopeRef`。 | `MethodAssetCatalogEntryRef`;catalog accepted summary。 | 为定义锚点建立目录项和适用语境。 | 不把目录视图当 truth;不把 UI 分类或搜索索引写成目录语义。 |
| ReclassifyMethodAssetCatalogEntry | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetCatalogEntryRef`;`CatalogScopeRef`。 | `MethodAssetCatalogEntryRef`;catalog change summary。 | 调整目录项适用语境,保留目录语义变更线索。 | 不触发正式化通过;不修复读取材料。 |

#### 5.4.2 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMethodAssetDefinitionSummary | `ActorContext`;`MethodAssetDefinitionRef`。 | `MethodAssetDefinitionSummary`;definition state hint。 | `MethodAssetDefinition` 或其安全读取材料。 | 不返回外部正文、artifact 正文或旧 P0 payload。 |
| ResolveMethodAssetDefinitionRef | `ActorContext`;definition identity query;可选 `CatalogScopeRef`。 | `MethodAssetDefinitionRef`;resolution summary。 | definition identity index / catalog association。 | 不从 route param、文件路径或 marketplace id 拼接 typed ref。 |
| ListMethodAssetCatalog | `ActorContext`;`CatalogScopeRef`;page / filter summary。 | `MethodAssetCatalogView` page。 | `MethodAssetCatalogView` 派生读取材料。 | 不在查询中登记目录项或刷新 projection。 |
| GetMethodAssetCatalogEntryView | `ActorContext`;`MethodAssetCatalogEntryRef`。 | 单项 `MethodAssetCatalogView` / catalog entry summary。 | catalog entry 读取材料。 | 不把 catalog view 作为目录 truth 写回。 |

#### 5.4.3 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| MethodAssetDefinitionChanged | definition establish / adjust accepted | 正式化、追溯、消费材料维护、外围发现 | 只表达 definition fact changed 和 typed ref,不携带定义正文全集。 |
| MethodAssetCatalogChanged | catalog register / reclassify accepted | 目录读取、消费发现、外围 package / set | 只表达 catalog fact changed 和 scope ref,不承诺 topic / payload schema。 |

停审记录:

- 功能是否清楚: pass。definition truth、catalog truth 和 catalog read 三类入口已分开。
- 读写类别是否正确: pass。写 truth 的入口为 Command,读取 view / summary 的入口为 Query,事件仅作为候选。
- 对象承接是否清楚: pass。接口均承接 `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`MethodAssetDefinitionRef`、`MethodAssetCatalogView` 或 `CatalogScopeRef`。
- 禁止事项是否清楚: pass。未引入外部正文、旧 `MethodContent`、目录第二 truth、projection repair 或 marketplace 交易。
- 下一步: 进入“正式化与版本接口:先思考”。

### 5.5 正式化与版本接口:先思考

问题回答:

- 本组成部分需要正式暴露正式化判断、正式版本建立、版本语义变化记录和依据摘要使用四类入口。它们承接 `FormalMethodAssetVersion`、`FormalizationBasisSummary`、`FormalizationState` 和 `FormalizationEligibilityRule`。
- 正式化判断和正式版本建立属于 Command,因为它们改变方法资产能否作为正式消费依据。版本语义变化也属于 Command,因为它会影响既有正式版本边界和后续消费。
- 正式版本读取、正式化状态读取和 basis summary 读取属于 Query。它们只能读取版本、状态和依据摘要,不得在读取路径中激活正式版本。
- Inbound Event Consumer 可以作为候选存在,但只接收“外部依据摘要 / 引用已形成”的 body-free 信号;外部正文、治理裁决正文、artifact 正文仍必须被外部摘要与引用边界挡住。
- Outbound Event 可以作为候选存在,用于通知下游正式版本成立、正式化被拒绝或版本被替代,但本 Step 不定义 topic、payload 或可靠投递机制。

诊断:

- 若没有正式化 Command,后续受控消费只能从 definition 或 catalog 隐式推断可消费性,会破坏“未正式化资产不得作为正式消费依据”的规则。
- 若把 `FormalizationBasisSummary` 接收直接写成本组成部分的正文输入,会绕过“外部摘要与引用”的 no external body 边界。
- `FormalizationEligibilityRule` 是 guard / policy 输入,不应作为独立外部 API 暴露;它应在正式化 Command 的处理摘要中被使用。
- 正式版本状态读取可以支持 console / SDK / 下游消费判断,但它不能触发状态迁移或创建正式版本。

取舍:

- Command 候选保留四个:评估正式化资格、建立正式版本、记录版本语义变化、停用 / 退出正式版本。
- Query 候选保留四个:获取正式版本、获取正式化状态、列出可消费正式版本、读取正式化依据摘要。
- Inbound 候选只保留 `FormalizationBasisSummaryAccepted` 一类边界信号;如果未来外部系统不能提供 summary/ref,该候选必须移除或前置到外部摘要与引用。
- Outbound 候选保留正式版本成立、正式化拒绝、正式版本替代三类事实变化,供受控消费、追溯和外围发现使用。

复杂度 / 越界检查:

- 未写版本号算法、hash、fingerprint、schema version、状态迁移矩阵或 eligibility 规则细节。
- 未写治理审批、policy enforce、artifact 生命周期或外部正文承接。
- 未把读取、引用、同步或下游运行使用写成正式化触发条件。
- 下一模块只允许写本组成部分接口骨架表和停审记录。

### 5.6 正式化与版本接口:再写入

#### 5.6.1 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| EvaluateMethodAssetFormalization | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDefinitionRef`;`MethodAssetCatalogEntryRef`;`FormalizationBasisSummaryRef`。 | `FormalizationState`;eligibility decision summary。 | 使用 `FormalizationEligibilityRule` 判断定义、目录和依据摘要是否满足正式化前提。 | 不执行治理系统;不保存外部正文;资格通过不等于自动发布到下游。 |
| EstablishFormalMethodAssetVersion | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDefinitionRef`;`FormalizationBasisSummaryRef`;`FormalizationState`。 | `FormalMethodAssetVersionRef`;formal version accepted summary。 | 为已满足资格的方法资产建立正式版本边界和稳定引用。 | 不改写定义 truth;不由 query 或引用隐式触发。 |
| RecordFormalVersionSemanticChange | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`FormalMethodAssetVersionRef`;`VersionChangeReasonRef`。 | previous / current formal version refs;version change summary。 | 显式记录影响正式含义的版本语义变化,并为追溯和消费影响提供线索。 | 不在本接口解释下游影响;不使用旧 fingerprint 作为版本语义。 |
| RetireFormalMethodAssetVersion | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`FormalMethodAssetVersionRef`;`FormalizationReasonRef`。 | `FormalizationState`;retirement summary。 | 让正式版本退出新消费语境,并保留历史可追溯性。 | 不删除历史版本;不破坏既有消费材料的追溯。 |

#### 5.6.2 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetFormalMethodAssetVersion | `ActorContext`;`FormalMethodAssetVersionRef`。 | `FormalMethodAssetVersion` summary / view。 | 正式版本 truth 或安全读取材料。 | 不返回定义正文全集、basis 正文或 artifact 正文。 |
| GetFormalizationState | `ActorContext`;`MethodAssetDefinitionRef`;可选 `FormalMethodAssetVersionRef`。 | `FormalizationState`;state reason summary。 | formalization state 读取材料。 | 不触发状态迁移或正式版本创建。 |
| ListConsumableFormalVersions | `ActorContext`;`CatalogScopeRef`;page / filter summary。 | formal version view page;availability hint。 | formal version read material。 | 不替代受控消费的消费边界判断。 |
| GetFormalizationBasisSummary | `ActorContext`;`FormalizationBasisSummaryRef`。 | body-free `FormalizationBasisSummary`。 | basis summary store / read material。 | 不返回治理裁决正文、标准全文、ADR 全文或 artifact 正文。 |

#### 5.6.3 Inbound Event Consumer 候选

| Consumer | 来源事件 | 输入骨架 | 输出结果 | 边界 |
|---|---|---|---|---|
| ConsumeFormalizationBasisSummaryAccepted | 外部摘要与引用已接受 basis summary | event envelope;event id;幂等键;`FormalizationBasisSummaryRef`;`ExternalSourceRefSet`。 | accepted / ignored / rejected consumer result;可进入 formalization command。 | 只接收 body-free summary/ref;不接收外部正文或治理执行正文。 |

#### 5.6.4 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| FormalMethodAssetVersionEstablished | formal version establish accepted | 受控消费、追溯、关系分发、外围发现 | 表达正式版本可作为消费依据,只携带 formal version ref / definition ref。 |
| MethodAssetFormalizationRejected | formalization evaluation rejected | 定义目录、追溯、维护进度 | 表达正式化被拒绝和安全原因引用,不携带外部正文。 |
| FormalMethodAssetVersionSuperseded | version semantic change accepted | 受控消费、一致性保护、追溯 | 表达旧版本被替代,供后续影响摘要和保护策略使用。 |

停审记录:

- 功能是否清楚: pass。正式化判断、正式版本、版本语义变化和依据摘要读取已分开。
- 读写类别是否正确: pass。影响正式消费依据的入口为 Command,读取版本 / 状态 / basis 的入口为 Query,外部摘要到达仅作为 Inbound 候选。
- 对象承接是否清楚: pass。接口均承接 `FormalMethodAssetVersion`、`FormalizationBasisSummary`、`FormalizationState`、`FormalizationEligibilityRule` 或相关 typed ref。
- 禁止事项是否清楚: pass。未引入外部正文、治理执行、隐式正式化、旧 fingerprint 或下游运行状态。
- 下一步: 进入“受控消费接口:先思考”。

### 5.7 受控消费接口:先思考

问题回答:

- 本组成部分需要暴露消费资格判断、消费材料准备 / 读取、可用性读取和消费边界说明四类入口。它们承接 `MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary` 和 `DefinitionUseBoundaryGuard`。
- 准备消费材料可以是 Command,因为它可能形成或更新本仓拥有的正式消费材料边界。但它不能创建正式版本,也不能复制定义 truth 到下游私有对象。
- 消费材料读取、可用性读取和消费边界读取属于 Query。它们可能需要 `ConsumptionContextRef`,但仍只能读取材料和 boundary,不能修复材料或改写 truth。
- `DefinitionUseBoundaryGuard` 不作为独立外部 API 暴露。它应在消费材料准备和边界判断中被调用,并在违反时输出安全 rejection / violation ref。
- 受控消费可以产生 outbound event 候选,通知下游消费材料可用、不可用或被阻断,但不表达下游是否实际执行、安装、运行或渲染。

诊断:

- 若消费材料只作为 Query 即时拼装,会让下游每次读取都隐式重建正式材料,不利于后续追溯和一致性保护。
- 若把消费边界写成权限矩阵或鉴权 API,会越过概要层并混淆身份 / 安全职责。概要层只表达 Definition vs Use 语义边界。
- `MethodAssetAvailabilityView` 必须保持 read model 身份。可用性读取不等于正式版本成立,也不等于下游消费成功。
- 下游消费影响摘要不属于本组成部分的写接口;影响摘要接收和解释应交给“追溯与一致性保护”。

取舍:

- Command 候选保留两个:准备正式消费材料、记录消费边界阻断。二者都只围绕本仓消费材料和边界,不写下游 truth。
- Query 候选保留四个:获取消费材料、读取可用性、查询消费边界、校验 Definition vs Use 读取结果。
- Outbound event 候选保留消费材料可用和消费材料阻断两类事实变化。
- 本组成部分不定义 Inbound Event Consumer 和 Operations Job;材料刷新由后台维护与收敛处理,下游影响摘要由追溯一致性处理。

复杂度 / 越界检查:

- 未写鉴权实现、权限矩阵、token、role、policy engine 或下游运行状态。
- 未把 query 写成 material repair,未让消费材料创建正式版本。
- 未保存外部正文、artifact 正文、下游请求正文或 marketplace 履约信息。
- 下一模块只允许写本组成部分接口骨架表和停审记录。

### 5.8 受控消费接口:再写入

#### 5.8.1 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| PrepareMethodAssetConsumptionMaterial | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`FormalMethodAssetVersionRef`;`ConsumptionContextRef`;`DownstreamConsumptionBoundaryRef`。 | `MethodAssetConsumptionMaterialRef`;consumption material summary。 | 基于正式版本和消费语境准备只读消费材料,并执行 Definition vs Use guard。 | 不创建正式版本;不复制定义 truth;不保存下游运行状态。 |
| RecordConsumptionBoundaryBlock | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`FormalMethodAssetVersionRef`;`ConsumptionContextRef`;`DefinitionUseViolationRef`。 | boundary block summary;可选 `MethodAssetAvailabilityViewRef`。 | 记录当前消费语境被边界阻断的安全线索,供可用性读取和追溯使用。 | 不执行下游动作;不把违规请求正文写入本仓。 |

#### 5.8.2 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMethodAssetConsumptionMaterial | `ActorContext`;`MethodAssetConsumptionMaterialRef`;`ConsumptionContextRef`。 | `MethodAssetConsumptionMaterial`;boundary summary。 | consumption material read material。 | 不返回定义正文全集、外部正文或下游私有副本。 |
| ResolveConsumptionMaterialForVersion | `ActorContext`;`FormalMethodAssetVersionRef`;`ConsumptionContextRef`。 | `MethodAssetConsumptionMaterialRef`;availability hint。 | formal version 与 consumption material 关联读取材料。 | 不在查询中创建材料或刷新材料。 |
| GetMethodAssetAvailability | `ActorContext`;`FormalMethodAssetVersionRef`;`ConsumptionContextRef`。 | `MethodAssetAvailabilityView`。 | availability view。 | 可用性 view 不等于正式版本 truth 或下游执行状态。 |
| GetDownstreamConsumptionBoundary | `ActorContext`;`ConsumptionContextRef`;可选 `FormalMethodAssetVersionRef`。 | `DownstreamConsumptionBoundary`;allowed use summary。 | consumption boundary material。 | 不返回鉴权矩阵、token、role 或 policy engine 细节。 |

#### 5.8.3 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| MethodAssetConsumptionMaterialAvailable | consumption material prepare accepted | process / identity / runtime / member-images 等下游消费方 | 表达正式消费材料可读,只携带 material ref、formal version ref 和 context ref。 |
| MethodAssetConsumptionMaterialBlocked | boundary block recorded | 下游消费方、追溯一致性、维护进度 | 表达特定消费语境被边界阻断,不携带下游请求正文。 |

停审记录:

- 功能是否清楚: pass。消费材料准备、消费材料读取、可用性读取和消费边界读取已分开。
- 读写类别是否正确: pass。材料准备 / 阻断记录为 Command,材料 / 可用性 / boundary 读取为 Query。
- 对象承接是否清楚: pass。接口均承接 `MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`、`DefinitionUseBoundaryGuard` 或相关 typed ref。
- 禁止事项是否清楚: pass。未引入下游运行 truth、鉴权实现、隐式正式化、query repair、外部正文或 marketplace 履约。
- 下一步: 进入“追溯与一致性保护接口:先思考”。

### 5.9 追溯与一致性保护接口:先思考

问题回答:

- 本组成部分需要暴露追溯材料组织 / 读取、消费影响摘要接收 / 读取、一致性保护判断和审计线索读取四类入口。
- 组织追溯材料、接收消费影响摘要、执行一致性保护判断属于 Command 或 command-facing 边界,因为它们会形成本仓持有的 body-free trace / impact / protection 语义材料。
- trace、impact、audit 和 protection 状态读取属于 Query,只能读取 `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy` 和 `MethodAssetAuditTrail`。
- Inbound Event Consumer 可以作为候选存在,但仅用于接收下游已经形成的 body-free `ConsumptionImpactSummary` 或外部 evidence marker;不得接收下游运行状态正文、raw log 或证据正文。
- Operations Job 不在本组成部分定义。trace material refresh、impact refresh 和 recovery 收敛应交给“后台维护与收敛”。

诊断:

- 如果 trace material 只在 query 中即时拼装,后续审计、影响承接和一致性保护会缺少稳定材料引用。
- 如果 impact summary 直接扫描下游系统,本仓会拥有 process / identity / runtime 等下游运行 truth,违反当前边界。
- `ConsistencyProtectionPolicy` 需要有显式判断入口,否则版本变化或消费边界变化只能靠后台 job 发现,无法在业务流中阻断静默破坏。
- audit trail 只能组织 body-free 线索;若在接口层写 raw audit payload 或 evidence JSON,会提前掉入详细设计和证据 schema。

取舍:

- Command 候选保留四个:准备追溯材料、接收消费影响摘要、评估一致性保护、记录审计线索。
- Query 候选保留四个:读取追溯材料、读取影响摘要、读取一致性保护状态、读取审计线索。
- Inbound 候选保留下游消费影响摘要到达和 evidence marker 到达两类;二者都必须 body-free。
- Outbound 候选保留 trace material changed、impact summary accepted、protection required 三类事实变化。

复杂度 / 越界检查:

- 未写 audit schema、evidence JSON、raw log、telemetry、trace id 流或恢复算法。
- 未保存下游运行 truth、外部正文、artifact 正文、archive 包或证据正文。
- 未把 trace / audit / impact 写成第二 definition truth、第二 formal version truth 或第二 consumption material truth。
- 下一模块只允许写本组成部分接口骨架表和停审记录。

### 5.10 追溯与一致性保护接口:再写入

#### 5.10.1 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| PrepareMethodAssetTraceMaterial | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`TraceSubjectRef`;相关 definition / formal version / consumption material ref。 | `MethodAssetTraceMaterialRef`;trace material summary。 | 组织 body-free 追溯材料,连接正式版本、消费语境、依据摘要和证据 marker。 | 不保存外部正文、证据正文或 raw log;不替代来源 truth。 |
| AcceptConsumptionImpactSummary | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ConsumptionImpactSourceRef`;`ConsumptionImpactSummary`。 | `ConsumptionImpactSummaryRef`;impact accepted summary。 | 接收或记录下游 / 内部变化形成的消费影响摘要。 | 不扫描下游内部状态;不保存下游运行正文。 |
| EvaluateConsistencyProtection | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`TraceSubjectRef`;`ConsumptionImpactSummaryRef`。 | `ConsistencyProtectionPolicyRef`;protection decision summary。 | 根据影响摘要判断是否需要阻断、待承接、确认或恢复。 | 不执行恢复算法;不把非正式定义转成正式版本。 |
| RecordMethodAssetAuditTrailEntry | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`TraceSubjectRef`;trace / impact / evidence marker refs。 | `MethodAssetAuditTrailRef`;audit entry summary。 | 追加 body-free 审计线索,服务追溯和验收解释。 | 不保存 raw audit log、请求正文、响应正文或证据正文。 |

#### 5.10.2 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMethodAssetTraceMaterial | `ActorContext`;`TraceSubjectRef`;可选 material ref。 | `MethodAssetTraceMaterial` / trace summary。 | trace material read material。 | 不返回证据正文、外部正文或 raw log。 |
| ListConsumptionImpactSummaries | `ActorContext`;`TraceSubjectRef`;page / filter summary。 | `ConsumptionImpactSummary` page。 | impact summary read material。 | 不扫描下游运行状态;unknown 必须显式返回。 |
| GetConsistencyProtectionStatus | `ActorContext`;`TraceSubjectRef`;可选 `ConsumptionContextRef`。 | protection state / required action summary。 | consistency protection policy / read material。 | 不执行恢复或确认动作。 |
| GetMethodAssetAuditTrail | `ActorContext`;`TraceSubjectRef`;page / filter summary。 | `MethodAssetAuditTrail` summary page。 | audit trail read material。 | 不返回 raw audit log、telemetry 或证据文件。 |

#### 5.10.3 Inbound Event Consumer 候选

| Consumer | 来源事件 | 输入骨架 | 输出结果 | 边界 |
|---|---|---|---|---|
| ConsumeDownstreamConsumptionImpactSummary | 下游已形成 body-free impact summary | event envelope;event id;幂等键;`ConsumptionImpactSummary`;`ConsumptionImpactSourceRef`。 | accepted / ignored / rejected consumer result;impact summary ref。 | 只接收影响摘要和 typed ref,不接收下游运行正文。 |
| ConsumeEvidenceMarkerAvailable | 外部 evidence marker / lineage ref 已形成 | event envelope;event id;幂等键;`MethodAssetEvidenceMarkerRef`;`TraceSubjectRef`。 | accepted / ignored / rejected consumer result;audit / trace linkage summary。 | 只接收 marker/ref,不接收证据正文或 archive 包。 |

#### 5.10.4 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| MethodAssetTraceMaterialChanged | trace material prepared / updated | 审计、维护、console / SDK 读取 | 表达追溯材料变化,只携带 trace material ref / subject ref。 |
| ConsumptionImpactSummaryAccepted | impact summary accepted | 一致性保护、维护收敛、下游协调 | 表达影响摘要已承接,不携带下游运行正文。 |
| ConsistencyProtectionRequired | protection evaluation requires action | 维护收敛、受控消费、追溯审计 | 表达需要阻断、待承接或恢复的保护动作类别。 |

停审记录:

- 功能是否清楚: pass。trace、impact、protection 和 audit 四条接口线已分开。
- 读写类别是否正确: pass。材料组织 / 摘要接收 / 保护判断 / 审计追加为 Command,读取为 Query,外部到达为 Inbound 候选。
- 对象承接是否清楚: pass。接口均承接 `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy`、`MethodAssetAuditTrail`、`TraceSubjectRef` 或相关 typed ref。
- 禁止事项是否清楚: pass。未引入 raw log、telemetry、证据正文、外部正文、下游运行 truth、恢复算法或 audit table schema。
- 下一步: 进入“关系与分发语义接口:先思考”。

### 5.11 关系与分发语义接口:先思考

问题回答:

- 本组成部分需要暴露关系建立 / 调整、分发语义引用建立 / 调整、关系完整性判断和关系 / 分发读取四类入口。
- 关系建立、关系调整、分发语义引用建立属于 Command,因为它们改写本仓拥有的 relation truth 或分发边界 ref。
- 关系读取、分发语义读取和关系完整性读取属于 Query。它们只读取 relation view / distribution read material,不得在读取中修复关系或创建分发 ref。
- 本组成部分不需要 Inbound Event Consumer。外部依据或 marketplace 生态上下文必须先通过“外部摘要与引用”形成 summary/ref,不能直接变成关系输入正文。
- 本组成部分可以产生 relation / distribution changed outbound event 候选,供受控消费、追溯一致性和外围组织刷新材料。

诊断:

- 若 relation 与 definition 合并,定义 truth 会直接承载图结构,后续外围组织和消费语境会反向污染核心定义。
- 若 distribution ref 与 package / marketplace 合并,分发语义会被交易、安装或履约事实污染。
- `RelationIntegrityRule` 不应作为外部 API 暴露,但必须在关系建立 / 调整和分发引用建立时被显式使用。
- 关系读取不能执行图算法或推荐排序;概要层只表达正式关系和分发语义读取。

取舍:

- Command 候选保留四个:建立关系、调整关系、建立分发语义引用、停用 / 限定分发语义引用。
- Query 候选保留四个:读取关系、列出关系、读取分发语义、检查关系完整性状态。
- Outbound event 候选保留关系变化和分发语义变化两类。
- 本组成部分不定义 Operations Job;关系 / 分发读取材料刷新归入后台维护。

复杂度 / 越界检查:

- 未写图算法、推荐算法、搜索索引、运行依赖图、调用图或 UI 分类。
- 未写 marketplace listing、订单、购买、结算、安装、履约或授权交易事实。
- 未写 event topic、payload 字段全集、repository、数据库索引或分发渠道协议。
- 下一模块只允许写本组成部分接口骨架表和停审记录。

### 5.12 关系与分发语义接口:再写入

#### 5.12.1 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| ProposeMethodAssetRelation | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDefinitionRef`;`RelatedMethodAssetRef`;relation context summary。 | `MethodAssetRelationRef`;relation proposed summary。 | 基于 typed ref 建立方法资产关系候选,等待完整性判断。 | 不从 free-form id、URL 或 marketplace id 拼接关系端点。 |
| ActivateMethodAssetRelation | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetRelationRef`;`RelationIntegrityRuleRef`。 | `MethodAssetRelationRef`;relation active summary。 | 通过完整性判断后激活关系语义。 | 不创建或修改 definition truth;不表达运行依赖图。 |
| EstablishMethodAssetDistributionRef | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDefinitionRef` 或 `FormalMethodAssetVersionRef`;`DistributionContextRef`。 | `MethodAssetDistributionRef`;distribution summary。 | 为定义或正式版本建立分发语义引用。 | 不表示 marketplace listing、安装履约或 package 正文。 |
| LimitOrRetireMethodAssetDistributionRef | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDistributionRef`;`DistributionBoundaryReasonRef`。 | `MethodAssetDistributionRef`;distribution boundary summary。 | 限定或退出指定分发语义引用。 | 不删除历史引用;不影响核心定义或正式版本 truth。 |

#### 5.12.2 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMethodAssetRelation | `ActorContext`;`MethodAssetRelationRef`。 | `MethodAssetRelation` summary / view。 | relation truth 或 relation read material。 | 不返回图算法结果、推荐分数或运行依赖。 |
| ListMethodAssetRelations | `ActorContext`;`MethodAssetDefinitionRef`;可选 `DistributionContextRef`;page / filter summary。 | relation view page。 | relation read material。 | 不在查询中创建、激活或修复关系。 |
| GetMethodAssetDistributionRef | `ActorContext`;`MethodAssetDistributionRef`。 | distribution ref summary。 | distribution read material。 | 不返回 marketplace 交易、安装或履约状态。 |
| CheckRelationIntegrity | `ActorContext`;`MethodAssetRelationRef`;可选 `RelationIntegrityRuleRef`。 | relation integrity summary。 | relation integrity read material。 | 只读取完整性判断结果;不执行关系修复。 |

#### 5.12.3 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| MethodAssetRelationChanged | relation propose / activate / retire accepted | 受控消费、追溯一致性、外围组织、维护收敛 | 表达关系语义变化,只携带 relation ref 和端点 ref。 |
| MethodAssetDistributionChanged | distribution ref establish / limit / retire accepted | 受控消费、外围发现、维护收敛 | 表达分发语义变化,不携带 marketplace 交易或安装履约正文。 |

停审记录:

- 功能是否清楚: pass。relation truth、distribution ref、integrity guard 和读取接口已分开。
- 读写类别是否正确: pass。关系 / 分发改写为 Command,关系 / 分发 / 完整性读取为 Query,事件仅作为候选。
- 对象承接是否清楚: pass。接口均承接 `MethodAssetRelation`、`MethodAssetDistributionRef`、`RelationIntegrityRule`、`RelatedMethodAssetRef` 或 `DistributionContextRef`。
- 禁止事项是否清楚: pass。未引入 marketplace 交易、安装履约、图算法、推荐结果、运行依赖图、外部正文或下游运行 truth。
- 下一步: 进入“外部摘要与引用接口:先思考”。

### 5.13 外部摘要与引用接口:先思考

问题回答:

- 本组成部分需要暴露外部来源摘要接收、外部来源 ref 登记、artifact / archive ref 登记、正文边界拒绝和外部摘要 / ref 读取入口。
- 接收 `ExternalSourceSummary`、登记 `ExternalSourceRef`、登记 `ArtifactArchiveRef` 属于 Command,因为它们会形成本仓可用的外部摘要 / 引用边界材料。
- 读取外部摘要、读取外部 ref、读取 artifact / archive ref、读取 acceptance state 属于 Query,不得在读取路径中拉取或复制外部正文。
- Inbound Event Consumer 可以作为候选存在,但只接收外部系统或外部摘要服务已经形成的 body-free summary / ref / marker;不得接收标准全文、ADR 正文、artifact 正文、archive 包或 evidence 文件正文。
- Outbound Event 可以作为候选存在,用于通知正式化、追溯、关系分发和外围组织某个外部摘要 / ref 已被接受、拒绝或变 stale。

诊断:

- 如果外部 summary/ref 不通过本组成部分统一承接,正式化、追溯和外围组织会各自私造 ref 和 body boundary,后续很容易出现 schema / mapper 缺口。
- `ExternalBodyBoundaryRule` 不应作为用户可直接调用的“内容审查 API”,但所有外部摘要接收和 artifact ref 登记都必须显式经过它。
- Query 不能访问外部系统补正文,否则会把外部可用性、对象存储或网页抓取混入本仓读取语义。
- Inbound 候选需要以 event envelope / idempotency 表达,但 topic、payload 字段和重试策略必须留给详细设计。

取舍:

- Command 候选保留四个:接受外部来源摘要、登记外部来源 ref、登记 artifact / archive ref、拒绝外部正文材料。
- Query 候选保留四个:读取外部来源摘要、解析外部来源 ref、读取 artifact / archive ref、列出外部依据承接状态。
- Inbound 候选保留外部安全摘要到达和 artifact marker 到达两类。
- Outbound 候选保留外部摘要 accepted / rejected / stale 三类事实变化。

复杂度 / 越界检查:

- 未写外部 API、回调协议、summary schema、ref key 规则、artifact schema、evidence JSON 或 adapter。
- 未保存治理执行正文、标准全文、ADR 正文、artifact 正文、archive 包、证据正文、marketplace 交易履约或外部 API payload。
- 未让外部正文引用、artifact、marketplace、console / SDK 或对象存储成为核心闭环前置。
- 下一模块只允许写本组成部分接口骨架表和停审记录。

### 5.14 外部摘要与引用接口:再写入

#### 5.14.1 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| AcceptExternalSourceSummary | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ExternalSourceRef`;`ExternalSafeSummaryMarker`;可选 basis context。 | `ExternalSourceSummaryRef`;acceptance state summary。 | 接收 body-free 外部安全摘要,并通过 `ExternalBodyBoundaryRule` 检查入仓边界。 | 不保存标准全文、治理正文、artifact 正文或外部 payload。 |
| RegisterExternalSourceRef | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ExternalSourceKind`;`ExternalSourceNamespaceRef`;可选 `GovernanceBasisRef`。 | `ExternalSourceRef`;source ref summary。 | 建立外部来源 typed ref,供正式化、追溯、关系和外围组织使用。 | 不从 free-form URL、文件路径或外部 id 私造正式 ref。 |
| RegisterArtifactArchiveRef | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ExternalSourceRef`;`ArtifactArchiveMaterialMarker`。 | `ArtifactArchiveRef`;archive ref summary。 | 登记 artifact / archive 的安全引用边界。 | 不保存 artifact 正文、archive 包、对象存储路径或 signed URL。 |
| RejectExternalBodyMaterial | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ExternalBodyMaterialRef`;`ExternalBodyBoundaryRuleRef`。 | boundary rejection summary。 | 显式拒绝外部正文或履约正文入仓,并保留安全原因引用。 | 不执行内容审查;不保存被拒绝正文。 |

#### 5.14.2 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetExternalSourceSummary | `ActorContext`;`ExternalSourceSummaryRef`。 | body-free `ExternalSourceSummary`。 | external summary read material。 | 不返回外部正文、标准全文或 artifact 内容。 |
| ResolveExternalSourceRef | `ActorContext`;external source identity query。 | `ExternalSourceRef`;resolution summary。 | external source ref material。 | 不从 URL、文件路径或外部 id 直接拼接 ref。 |
| GetArtifactArchiveRef | `ActorContext`;`ArtifactArchiveRef`。 | artifact / archive ref summary。 | artifact archive ref material。 | 不返回 archive 包、对象存储内容或证据文件。 |
| ListExternalBasisAcceptanceStates | `ActorContext`;source / basis filter summary;page summary。 | external basis acceptance state page。 | external summary / acceptance read material。 | 不拉取外部系统补正文或状态。 |

#### 5.14.3 Inbound Event Consumer 候选

| Consumer | 来源事件 | 输入骨架 | 输出结果 | 边界 |
|---|---|---|---|---|
| ConsumeExternalSafeSummaryAvailable | 外部摘要服务或治理侧已形成 safe summary | event envelope;event id;幂等键;`ExternalSourceRef`;`ExternalSafeSummaryMarker`。 | accepted / ignored / rejected consumer result;external summary ref。 | 只接收 safe summary marker/ref,不接收正文。 |
| ConsumeArtifactArchiveMarkerAvailable | artifact / archive marker 已形成 | event envelope;event id;幂等键;`ExternalSourceRef`;`ArtifactArchiveMaterialMarker`。 | accepted / ignored / rejected consumer result;artifact archive ref。 | 只接收 marker/ref,不接收 artifact / archive payload。 |

#### 5.14.4 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| ExternalSourceSummaryAccepted | external summary accepted | 正式化、追溯、关系分发、外围组织 | 表达外部安全摘要可用,只携带 summary ref / source ref。 |
| ExternalSourceSummaryRejected | external body boundary rejected | 正式化、追溯、维护进度 | 表达外部依据被拒绝和安全原因引用。 |
| ExternalSourceSummaryStale | external summary marked stale | 正式化、追溯、维护收敛 | 表达外部摘要可能过期,不触发正文复制。 |

停审记录:

- 功能是否清楚: pass。external summary、source ref、artifact archive ref 和 body boundary 已分开。
- 读写类别是否正确: pass。summary/ref 登记为 Command,summary/ref/state 读取为 Query,外部到达为 Inbound 候选。
- 对象承接是否清楚: pass。接口均承接 `ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef`、`ExternalBodyBoundaryRule` 或相关 typed ref / marker。
- 禁止事项是否清楚: pass。未引入外部正文、artifact 正文、archive 包、evidence 文件、外部 API payload、marketplace 交易履约或 adapter 细节。
- 下一步: 进入“后台维护与收敛接口:先思考”。

### 5.15 后台维护与收敛接口:先思考

问题回答:

- 本组成部分不暴露业务 Command。读取材料刷新、追溯材料刷新和一致性恢复应归类为 Operations Job,因为它们维护派生材料和收敛状态,不改写核心 truth。
- 本组成部分需要维护进度 Query,用于读取 `MaintenanceProgressView`、任务状态摘要、待承接 / 待恢复 / 显式不可用线索。
- `ReadMaterialRefreshTask` 对应 read material refresh job;`TraceMaterialRefreshTask` 对应 trace / audit / impact material refresh job;`ConsistencyRecoveryTask` 对应 consistency recovery job。
- Job 输入应使用 `MaintenanceRunRef`、`RefreshScopeRef`、task ref 和 subject ref,不得使用 worker id、queue id、cron 名或 free-form scope 字符串。
- Job 输出只允许 refreshed material ref、recovery summary、progress view 或 body-free issue ref,不得输出 raw diagnostic、外部正文、下游状态或 worker log。

诊断:

- 如果把 refresh / recovery 写成业务 Command,维护路径就可能绕过正式化、消费边界或外部正文边界修核心对象。
- 如果只写 worker / job 名而不承接 Step 6 task 对象,Step 8 会掉进实现调度细节,缺少正式任务语义。
- `MaintenanceProgressView` 必须作为 Query 输出,否则验收和运维只能依赖 raw log 或实现私有状态判断维护是否收敛。
- Operations Job 可以产生 progress / material changed event 候选,但不定义调度、重试、锁、queue、topic、outbox 或 report schema。

取舍:

- Operations Job 候选保留三个:刷新读取材料、刷新追溯材料、执行一致性恢复收敛。
- Query 候选保留三个:读取维护进度、读取维护任务摘要、列出待承接 / 待恢复 issue。
- Outbound event 候选保留 maintenance progress changed、read material refreshed、recovery required / resolved。
- 不定义 Inbound Event Consumer;维护触发来源在 Step 8 处理流中再连接 fact changed / stale / unavailable 等线索。

复杂度 / 越界检查:

- 未写 job 调度、worker loop、queue/topic/outbox、retry policy、锁策略、数据库表、raw diagnostic 或 report schema。
- 未通过维护路径改写 definition、formal version、consumption boundary、relation 或 external summary truth。
- 未补外部正文、artifact 正文、archive 包、下游运行状态、治理执行正文或 marketplace 交易。
- 下一模块只允许写本组成部分 Operations Job / Query 骨架表和停审记录。

### 5.16 后台维护与收敛接口:再写入

#### 5.16.1 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| RefreshMethodAssetReadMaterials | `ReadMaterialRefreshTask`;`MaintenanceRunRef`;`RefreshScopeRef`;source subject refs。 | refreshed read material refs;`MaintenanceProgressView`;body-free issue refs。 | 只刷新 catalog、formal version、consumption、availability、relation、distribution、external summary 等读取材料;不改核心 truth。 |
| RefreshMethodAssetTraceMaterials | `TraceMaterialRefreshTask`;`MaintenanceRunRef`;`TraceSubjectRefSet`;trace / audit / impact refs。 | refreshed trace / audit / impact material refs;progress summary。 | 不保存 raw log、telemetry、evidence 正文或外部正文;不创建未授权 trace truth。 |
| RunMethodAssetConsistencyRecovery | `ConsistencyRecoveryTask`;`MaintenanceRunRef`;`RefreshScopeRef`;impact / protection refs。 | recovery summary;pending acknowledgement refs;`MaintenanceProgressView`。 | 不重做正式化裁决;不绕过消费边界;不复制外部正文;不修核心 truth。 |

#### 5.16.2 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMaintenanceProgress | `ActorContext`;`MaintenanceRunRef` 或 `RefreshScopeRef`。 | `MaintenanceProgressView`。 | maintenance progress read model。 | 不返回 worker log、stack trace、adapter payload 或 raw diagnostic。 |
| GetMaintenanceTaskSummary | `ActorContext`;maintenance task ref;task kind summary。 | task state summary;safe issue refs。 | refresh / recovery task read material。 | 不把 task state 当业务 truth。 |
| ListPendingMaintenanceIssues | `ActorContext`;`RefreshScopeRef`;page / filter summary。 | pending acknowledgement / unavailable / failed issue page。 | maintenance progress / issue read material。 | 不执行恢复或确认动作。 |

#### 5.16.3 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| MethodAssetReadMaterialRefreshed | read material refresh converged | query readers、受控消费、外围读取、验收材料 | 表达读取材料已收敛,不表示核心 truth 被修改。 |
| MethodAssetTraceMaterialRefreshed | trace material refresh converged | 追溯审计、维护进度、验收材料 | 表达追溯 / 审计 / impact material 已收敛。 |
| MethodAssetRecoveryAttentionRequired | recovery pending / blocked / failed | operations、追溯一致性、验收材料 | 表达恢复需要承接或被边界阻断,不携带 raw diagnostic。 |

停审记录:

- 功能是否清楚: pass。read material refresh、trace material refresh、consistency recovery 和 maintenance progress 读取已分开。
- 类别是否正确: pass。维护动作归类为 Operations Job,维护进度和任务摘要归类为 Query,没有新增业务 Command。
- 对象承接是否清楚: pass。接口均承接 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceProgressView`、`MaintenanceRunRef` 或 `RefreshScopeRef`。
- 禁止事项是否清楚: pass。未引入 worker 实现、调度、重试、queue/topic/outbox、raw diagnostic、核心 truth repair 或外部正文补齐。
- 下一步: 进入“外围包与方法集组织接口:先思考”。

### 5.17 外围包与方法集组织接口:先思考

问题回答:

- 本组成部分需要暴露方法资产包建立 / 调整、组织级方法集组装 / 调整、包 / 方法集读取和外围发现读取入口。
- package / method set 建立和调整属于 Command,因为它们改写外围组织语义。但它们是外围 truth / peripheral aggregate,不作为核心闭环前置。
- package / method set 读取、外围发现读取和组成规则读取属于 Query。它们只能读取外围 view / read material,不得创建核心 definition、formal version、consumption material 或 relation。
- 本组成部分不需要 Inbound Event Consumer。marketplace / ecosystem 上下文必须先通过外部摘要与引用形成 summary/ref,不能直接进入 package / method set 正文。
- 本组成部分可以产生 package / method set changed outbound event 候选,供外围读取、维护刷新和追溯审计使用;核心闭环不依赖这些事件成立。

诊断:

- 如果 package / set 接口写得过强,外围增强会变成核心定义、正式化或受控消费前置,违反 Step 5 边界。
- 如果 package 接口承接 marketplace listing 或安装包正文,本仓会越过 `L6-marketplace` 和 artifact / archive 边界。
- `PackageCompositionRule` 不应单独作为外部 API 暴露,但 package / set 建立和调整必须使用它检查成员引用、正式化边界和分发上下文。
- 外围读取不可用只能影响外围材料或外围可用性,不得让核心定义、正式版本或消费材料失效。

取舍:

- Command 候选保留四个:建立 package、调整 package、建立 method set assembly、调整 method set assembly。
- Query 候选保留四个:读取 package、列出 package、读取 method set、按 marketplace / ecosystem context 读取外围发现材料。
- Outbound event 候选保留 package changed、method set changed、peripheral material unavailable 三类。
- 不定义 Operations Job;外围材料刷新由后台维护与收敛统一处理。

复杂度 / 越界检查:

- 未写 marketplace listing schema、交易状态、安装状态、package payload、method set schema、UI 会话或组织级配置正文。
- 未让 package / set 接口改写 definition、formal version、consumption boundary、relation 或 external summary truth。
- 未写 event topic、payload 字段全集、repository、database table、package storage 或 adapter。
- 下一模块只允许写本组成部分接口骨架表和停审记录。

### 5.18 外围包与方法集组织接口:再写入

#### 5.18.1 Command API 骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| CreateMethodPackage | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodPackageRef`;`MethodAssetDefinitionRefSet`;可选 `DistributionContextRef`。 | `MethodPackageRef`;package accepted summary。 | 围绕已成立或允许引用的核心方法资产建立外围包组织语义。 | 不创建 definition truth;不表示 marketplace listing 或安装包正文。 |
| AdjustMethodPackage | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodPackageRef`;member / context adjustment summary。 | `MethodPackageRef`;package change summary。 | 调整包成员或外围上下文,并执行 `PackageCompositionRule`。 | 不绕过正式化、消费边界或关系完整性。 |
| CreateMethodSetAssembly | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodSetAssemblyRef`;`MethodPackageRefSet`;可选 member definition refs。 | `MethodSetAssemblyRef`;assembly accepted summary。 | 建立组织级方法集组装语义。 | 不保存 UI / console 状态;不覆盖核心定义或正式版本。 |
| AdjustMethodSetAssembly | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodSetAssemblyRef`;assembly adjustment summary。 | `MethodSetAssemblyRef`;assembly change summary。 | 调整方法集成员、包引用或组织上下文。 | 不写组织级运行配置正文;不成为核心闭环前置。 |

#### 5.18.2 Query API 骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMethodPackage | `ActorContext`;`MethodPackageRef`。 | `MethodPackage` summary / view。 | package read material。 | 不返回 package payload、artifact 包或 marketplace 履约状态。 |
| ListMethodPackages | `ActorContext`;可选 `DistributionContextRef` / `MarketplaceContextRef`;page / filter summary。 | package view page。 | package read material。 | 不在查询中创建或修复 package。 |
| GetMethodSetAssembly | `ActorContext`;`MethodSetAssemblyRef`。 | `MethodSetAssembly` summary / view。 | method set assembly read material。 | 不返回 UI 会话、组织配置正文或运行状态。 |
| DiscoverPeripheralMethodAssets | `ActorContext`;`MarketplaceContextRef` 或 ecosystem context ref;page / filter summary。 | package / method set discovery summary。 | peripheral discovery read material。 | 不表示交易、购买、安装、结算或授权履约。 |

#### 5.18.3 Outbound Event 候选

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| MethodPackageChanged | package create / adjust accepted | 外围发现、追溯审计、维护收敛 | 表达外围包组织语义变化,不影响核心闭环成立。 |
| MethodSetAssemblyChanged | assembly create / adjust accepted | 外围发现、追溯审计、维护收敛 | 表达组织级方法集变化,不覆盖核心定义或正式版本。 |
| PeripheralMethodOrganizationUnavailable | package / set peripheral material unavailable | console / SDK、维护进度、外围发现 | 表达外围材料不可用,核心定义、正式化和消费边界仍成立。 |

停审记录:

- 功能是否清楚: pass。package、method set、peripheral discovery 和 composition guard 已分开。
- 读写类别是否正确: pass。外围组织改写为 Command,外围读取为 Query,事件仅作为候选。
- 对象承接是否清楚: pass。接口均承接 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、`MethodPackageRef`、`MarketplaceContextRef` 或相关 typed ref。
- 禁止事项是否清楚: pass。未引入 marketplace 交易履约、安装包正文、artifact/archive 正文、UI 私有状态、核心前置化或核心 truth 改写。
- 下一步: 进入“跨接口一致性审计”。

### 5.19 跨接口一致性审计

问题回答:

- Command / Query / Inbound Event / Outbound Event / Operations Job 五类接口均已按适用性出现。Command 只改写本仓 truth、边界材料、summary/ref 或外围组织语义;Query 只读取 view / summary / material / progress;Operations Job 只维护派生材料和收敛状态。
- 每个接口均能回指 Step 6 对象、typed ref、summary、material、policy、guard、task 或 view;没有依赖旧 `MethodContent`、旧 outbox、旧 snapshot、旧 fingerprint 或私造 DTO 字段。
- 事件候选均保持概要级 fact changed / material changed / summary accepted 语义,未写 topic、payload 字段全集、relay、outbox、投递保证或重试策略。
- Inbound Event Consumer 只出现在外部摘要、正式化依据、impact summary、evidence marker 等 body-free 来源;没有把外部正文、artifact 正文、下游运行状态或 marketplace 履约当作 inbound payload。
- Operations Job 只出现在后台维护与收敛;没有把 refresh / recovery 写成业务 Command,也没有让 job 修复核心 truth。

#### 5.19.1 分类一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| Command 是否只改写真相或正式边界 | pass | definition、formal version、consumption material、trace / impact / protection、relation、external summary、package / set 分别承接对应对象;maintenance 未写业务 Command。 |
| Query 是否只读取 | pass | catalog、formalization、consumption、trace、relation、external、maintenance、peripheral Query 均读取 material / view / summary / progress,未写 repair。 |
| Inbound 是否 body-free | pass | 仅保留 basis summary、impact summary、evidence marker、external summary / artifact marker 等候选,均禁止正文。 |
| Outbound 是否概要级 | pass | 仅表达 changed / accepted / stale / refreshed / unavailable 等事实候选,未写 topic / payload / relay。 |
| Operations Job 是否仅维护收敛 | pass | read refresh、trace refresh、consistency recovery 不改核心 truth,只输出 material / progress / issue refs。 |

#### 5.19.2 对象承接一致性审计

| 组成部分 | 接口主语是否回指 Step 6 对象 | 风险检查 | 结果 |
|---|---|---|---|
| 方法资产定义与目录 | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetDefinitionRef`;`MethodAssetCatalogView` | 未使用旧 `MethodContent` 或路径字符串作为定义输入。 | pass |
| 正式化与版本 | `FormalMethodAssetVersion`;`FormalizationBasisSummary`;`FormalizationState`;`FormalizationEligibilityRule` | 未让 query、引用或下游使用隐式触发正式化。 | pass |
| 受控消费 | `MethodAssetConsumptionMaterial`;`MethodAssetAvailabilityView`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | 未把鉴权矩阵或下游运行 truth 写入接口。 | pass |
| 追溯与一致性保护 | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail`;`TraceSubjectRef` | 未保存 raw log、evidence 正文或下游状态。 | pass |
| 关系与分发语义 | `MethodAssetRelation`;`MethodAssetDistributionRef`;`RelationIntegrityRule` | 未写 marketplace 交易、图算法或运行依赖图。 | pass |
| 外部摘要与引用 | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule` | 未保存外部正文、artifact 正文或 archive 包。 | pass |
| 后台维护与收敛 | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView` | 未写 worker 实现、调度或核心 truth repair。 | pass |
| 外围包与方法集组织 | `MethodPackage`;`MethodSetAssembly`;`PackageCompositionRule`;`MethodPackageRef` | 未把外围组织写成核心前置或 marketplace 履约。 | pass |

#### 5.19.3 边界一致性审计

| 边界 | 需要保持的规则 | 当前接口是否满足 | 说明 |
|---|---|---|---|
| no external body | 外部正文、标准全文、artifact 正文、archive 包、证据正文不得进入输入 / 输出。 | pass | 外部、正式化、追溯、消费和 package 接口均只使用 summary / marker / ref。 |
| Definition vs Use | 下游只能读取 / 引用 / 消费,不得创建、修改或替代定义 truth。 | pass | 受控消费接口有 boundary / guard,下游 impact 只以 summary 入仓。 |
| query 不修 truth | Query 不创建对象、不刷新材料、不修 projection。 | pass | 刷新统一归入 Operations Job。 |
| 维护不修核心 truth | job 只收敛派生材料、progress 和 issue。 | pass | recovery 明确不重做正式化裁决、不绕过消费边界。 |
| 外围不阻塞核心 | package / set 不作为核心闭环成立前置。 | pass | 外围接口只改外围组织语义,外围不可用只影响外围材料。 |
| marketplace 边界 | 交易、安装、履约、listing 正文不属于本仓接口。 | pass | relation、external、package 接口均禁止 marketplace 履约事实入仓。 |

停审记录:

- 分类是否一致: pass。Command、Query、Inbound、Outbound、Operations Job 分类没有 unresolved 冲突。
- 命名是否一致: pass。接口名围绕 Step 6 对象和业务能力命名,未恢复旧 `CreateMethodContentDraft` / `PublishMethodContent`。
- 对象承接是否一致: pass。每个接口均有 Step 6 对象或 typed ref 承接。
- 边界是否一致: pass。no external body、Definition vs Use、query 不修 truth、维护不修 truth、外围隔离均成立。
- 下一步: 进入“旧材料差异审计”。

### 5.20 旧材料差异审计

问题回答:

- 旧正式 `02-概要设计.md`、旧 `02_hld_step_08_processing_flows.md` 和历史 `03_ddd_*` 仍大量使用 `MethodContent`、`CreateMethodContentDraft`、`PublishMethodContent`、snapshot、fingerprint、outbox、P0/P1 发布同步主线。
- 当前 Step 7 没有把这些历史接口作为候选池来源,只在开工口径、分类思考、跨接口审计和禁止事项中把它们作为“不得恢复”的历史污染项。
- 当前 Step 7 的接口主语全部来自本轮 Step 5 / Step 6: `MethodAssetDefinition`、`FormalMethodAssetVersion`、`MethodAssetConsumptionMaterial`、`MethodAssetTraceMaterial`、`MethodAssetRelation`、`ExternalSourceSummary`、maintenance task、`MethodPackage` / `MethodSetAssembly`。
- 历史 outbox / snapshot / fingerprint / object storage / PostgreSQL / worker / relay 机制没有进入当前接口骨架。当前只保留概要级 outbound event 候选和 Operations Job 语义,具体可靠投递或调度机制留给后续重新闭口。

#### 5.20.1 历史接口污染检查

| 历史材料 / 旧主语 | 历史含义 | 当前 Step 7 处理 | 结果 |
|---|---|---|---|
| `CreateMethodContentDraft` / `UpdateMethodContentDraft` | 旧 draft content 写路径 | 不恢复。当前以 `EstablishMethodAssetDefinition` / `AdjustMethodAssetDefinition` 表达定义 truth 写入。 | pass |
| `PublishMethodContent` / `SupersedeMethodContent` | 旧 publish + version + fingerprint + snapshot + outbox 主链 | 不恢复。当前拆成正式化、正式版本、版本语义变化、追溯和维护材料。 | pass |
| `MethodContent` / 旧七类 P0 payload | 旧统一内容聚合 | 不作为接口输入 / 输出。当前使用 `MethodAssetDefinition` 与 typed ref。 | pass |
| `DefinitionSnapshot` / snapshot export | 旧同步制品和导出接口 | 不恢复。当前消费材料、read material 和 trace material 按对象重新推导。 | pass |
| `CanonicalFingerprint` / fingerprint changed | 旧版本和漂移识别机制 | 不恢复为 Step 7 接口。当前只使用 `VersionSemanticsMarker` / version change summary 的概要语义。 | pass |
| `OutboxEvent` / relay job | 旧可靠发布机制 | 不恢复。当前只点名 outbound event 候选,不写 outbox、relay、topic 或 payload schema。 | pass |
| P1 `MethodPlugin` / `MethodConfiguration` | 旧外围插件 / 配置路径 | 不恢复为核心接口。当前外围组织用 `MethodPackage`、`MethodSetAssembly` 和 `PackageCompositionRule` 表达。 | pass |
| object storage / PostgreSQL / repository / port | 历史实现承载 | 不进入概要接口骨架。后续若采用必须在 03 / 04 / 实施中重新闭口。 | pass |

#### 5.20.2 当前接口与旧材料映射差异

| 当前接口族 | 替代 / 废弃的旧方向 | 差异说明 |
|---|---|---|
| definition / catalog Command + Query | 旧 content draft / list content | 当前按定义 truth、目录语义和 typed ref 建模,不是旧 content payload CRUD。 |
| formalization / version Command + Query | 旧 publish / version / fingerprint | 当前区分正式化资格、正式版本边界和版本语义变化,不绑定 fingerprint 或 publish 机制。 |
| consumption material / availability Query | 旧 snapshot / sync package | 当前消费材料是受控读取边界,不是下游同步包或对象存储 payload。 |
| trace / impact / audit | 旧 audit / event / snapshot trace | 当前追溯材料使用 body-free summary / marker / ref,不聚合 raw event 或 snapshot 正文。 |
| relation / distribution | 旧关系校验或 marketplace 分发 | 当前关系是定义性关系和分发语义 ref,不进入交易 / 安装 / 履约。 |
| external summary / ref | 旧 artifact / governance / external body 直接引用 | 当前统一通过 body-free summary/ref 和正文禁止规则承接。 |
| maintenance jobs | 旧 outbox replay / fingerprint recalc / projection rebuild | 当前 job 只维护 read material、trace material 和 recovery progress,不改核心 truth。 |
| package / method set | 旧 P1 plugin / configuration | 当前作为外围组织语义,不阻塞核心闭环,不承载安装包或配置正文。 |

停审记录:

- 旧材料是否仅作后置审计: pass。旧材料没有参与当前接口候选池推导。
- 旧接口名是否回流: pass。当前正式候选未恢复旧 `CreateMethodContentDraft`、`PublishMethodContent`、`GetMethodContent` 等主线。
- 旧实现机制是否回流: pass。snapshot、fingerprint、outbox、relay、object storage、PostgreSQL 未成为当前接口骨架。
- 旧 P1 是否核心化: pass。plugin / configuration 未进入核心闭环;外围组织保持 package / method set 语义。
- 下一步: 进入“自检与停审”。

### 5.21 自检与停审

#### 5.21.1 Step 7 完成门禁

| 门禁项 | 结果 | 说明 |
|---|---|---|
| 是否按主要组成部分完成接口骨架 | pass | 8 个组成部分均已完成先思考、再写入和停审。 |
| 是否完成接口分类说明 | pass | Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 已给出适用性和禁止事项。 |
| 是否每个接口都有对象承接 | pass | 接口均回指 Step 6 对象、typed ref、summary、material、policy、guard、task 或 view。 |
| 是否避免协议 / 实现下沉 | pass | 未写 HTTP path、RPC、完整 JSON / proto schema、topic、payload、repository、port、DDL、worker loop。 |
| 是否完成跨接口一致性审计 | pass | 分类、命名、对象承接和边界审计无 unresolved 冲突。 |
| 是否完成旧材料差异审计 | pass | 旧 `MethodContent` / publish / snapshot / outbox / fingerprint / P1 plugin 等仅作为不得恢复项。 |
| 是否可支撑 Step 8 | pass | P0 Command、关键 Query、Inbound 候选、Outbound 候选和 Operations Job 已足以进入关键处理流筛选。 |

#### 5.21.2 Step 8 承接提示

| Step 8 需要承接 | 来源接口族 | 处理要求 |
|---|---|---|
| P0 Command 独立处理流 | definition / catalog;formalization / version;consumption material;trace / impact / protection;relation / distribution;external summary;package / set | 必须从当前接口骨架出发,不得恢复旧 MethodContent publish flow。 |
| Query 通用 / 特殊流筛选 | catalog、formal version、consumption、trace、relation、external、maintenance、peripheral Query | 简单读取可走通用读路径;含 unavailable / stale / boundary 的 Query 需考虑独立处理流。 |
| Inbound Event Consumer 流 | basis summary accepted、impact summary、evidence marker、external safe summary、artifact marker | 只处理 body-free summary / marker / ref;不得接收正文。 |
| Outbound Event 处理流 | changed / accepted / stale / refreshed / unavailable 候选 | 只定义业务产生来源和消费者;可靠投递机制若需要后续重新闭口。 |
| Operations Job 流 | read material refresh;trace material refresh;consistency recovery | job 不改核心 truth,只刷新材料、收敛 progress、输出 body-free issue refs。 |

最终停审:

```text
Step 7 API / 接口骨架完成。
下一步进入 Step 8 关键处理流 / 重要函数数据流开工。
Step 8 必须先列必读文档,再搭整体模块框架,然后按接口族逐模块先思考、后写入。
不得恢复旧 `MethodContent` / publish / snapshot / outbox / fingerprint 处理流。
```

---

## 6. 当前停审

| 检查项 | 当前状态 | 说明 |
|---|---|---|
| 是否已先读取恢复点 | pass | 已读取项目台账、文档 flow、Step 5 和 Step 6 完成门禁。 |
| 是否已搭建 Step 7 框架 | pass | 已建立 Step 内计划、整体模块骨架和对象到接口候选池接收表。 |
| 是否已完成接口分类与候选池 | pass | 已形成 Command / Query / Inbound Event / Outbound Event / Operations Job 分类说明和候选池总览。 |
| 是否已完成方法资产定义与目录接口 | pass | 已写入 definition / catalog Command、Query 和 outbound event 候选。 |
| 是否已完成正式化与版本接口 | pass | 已写入 formalization / formal version Command、Query、Inbound 和 outbound event 候选。 |
| 是否已完成受控消费接口 | pass | 已写入 consumption material / availability / boundary Command、Query 和 outbound event 候选。 |
| 是否已完成追溯与一致性保护接口 | pass | 已写入 trace / impact / protection / audit Command、Query、Inbound 和 outbound event 候选。 |
| 是否已完成关系与分发语义接口 | pass | 已写入 relation / distribution Command、Query 和 outbound event 候选。 |
| 是否已完成外部摘要与引用接口 | pass | 已写入 external summary / ref / body boundary Command、Query、Inbound 和 outbound event 候选。 |
| 是否已完成后台维护与收敛接口 | pass | 已写入 read refresh / trace refresh / recovery Operations Job、progress Query 和 outbound event 候选。 |
| 是否已完成外围包与方法集组织接口 | pass | 已写入 package / method set / peripheral discovery Command、Query 和 outbound event 候选。 |
| 是否已完成跨接口一致性审计 | pass | 分类、对象承接、事件 / job 边界和禁止事项审计无 unresolved 冲突。 |
| 是否已完成旧材料差异审计 | pass | 旧 `MethodContent` / publish / snapshot / outbox / fingerprint / P1 plugin 等未回流为当前接口主语。 |
| 是否已完成 Step 7 自检 | pass | Step 7 完成门禁通过,可进入 Step 8 开工。 |
| 是否提前修改正式 `02-概要设计.md` | no | 正式文档只在 Step 14 装配。 |
| 是否使用旧材料反推当前结论 | no | 旧材料仅用于后置差异审计和污染检查。 |

当前停审:

```text
Step 7 API / 接口骨架已完成。
下一步只允许进入 Step 8 关键处理流 / 重要函数数据流开工。
不得直接修改正式 `02-概要设计.md`;正式文档只在 Step 14 装配。
```

---

## R1. Step 7 重审开工

### R1.1 开工与必读文档:先思考

#### R1.1.1 问题回答

- 当前进入的是 Step 7 API / 接口骨架重审,不是沿用本文件既有完成态。
- 重审第一来源是已完成的 Step 5 组成部分和 Step 6 关键对象,尤其是 Step 6 `8.45` 对正式 §6 resolved、正式 §7~§9 open 的裁决。
- 本文件既有 `5.x` 内容、正式 `02-概要设计.md` §7、旧 Step 8 / Step 9 和历史 DDD 只能作为 historical material,不得作为接口候选池第一来源。
- 本 Step 必须回答 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 五类接口是否成立,每个接口必须回指 Step 5 组成部分和 Step 6 对象 / ref / summary / material / policy / task / view。
- 下一批 `开工与必读文档:再写入` 只应重置 Step 7 文件框架、必读文档表、Step 内计划和历史材料边界,不得直接写接口骨架正文。

#### R1.1.2 必读文档裁决

| 顺序 | 文档 | 读取重点 | 对 Step 7 的约束 |
|---:|---|---|---|
| 1 | `design-calibration/project_execution_ledger.md` | 项目级恢复点和当前 next action。 | 确认当前只允许 Step 7 `开工与必读文档:先思考 / 再写入`,不得进入 Step 8/9。 |
| 2 | `design-calibration/02_hld_calibration_flow.md` | 文档级 Step 状态、Step 6 关闭记录和 Step 7 重审入口。 | Step 7 是 `ready_for_full_recheck`,既有 Step 7 文件不得视为 completed。 |
| 3 | `standards/document/概要设计讨论流程_SOP.md` Step 7 | Step 7 目标、输入、输出、11 个应问问题和停审要求。 | 必须按 Command / Query / Inbound Event / Outbound Event / Operations Job 分类,并逐组成部分停审。 |
| 4 | `standards/document/概要设计书写规范.md` 4.7 | 接口分类说明和五类表格式。 | 可以点名正式 API / Event / Job 名称,但不写 HTTP path、完整 schema、topic 字段或处理流图。 |
| 5 | `standards/document/设计文档讨论中间产物规范.md` | 先搭整体模块、逐模块先思考后写入、历史材料后置差异审计。 | 不能一次性把 Step 7 写成 300 行左右的完成稿;必须按主要组成部分小循环。 |
| 6 | `standards/document/设计真相源闭环与可落码性标准.md` | 防止接口缺对象来源、schema 来源、event 来源或 boundary 来源。 | 接口输入输出骨架必须能回指 Step 6 对象,不得让实现端自行补 DTO / port / event schema。 |
| 7 | `projects/L3-method-library/00-需求文档.md` | 功能需求、接口依赖、业务规则、验收口径。 | 接口必须服务定义、目录、正式化、受控消费、追溯、一致性、外部摘要、维护和外围组织。 |
| 8 | `projects/L3-method-library/01-架构设计.md` | 系统上下文、依赖方向、交互通信、数据所有权。 | 接口不得越过本仓 truth 边界;外部正文、交易履约和下游运行 truth 不入仓。 |
| 9 | `design-calibration/02_hld_step_05_components_boundary.md` | 8 个组成部分、职责、边界和 Step 7 承接入口。 | Step 7 接口必须按这 8 个组成部分组织,不得按 repository / handler / 旧模块分组。 |
| 10 | `design-calibration/02_hld_step_06_key_objects.md` | Step 6 对象类别、对象家族、typed ref、view/material、policy/guard/task 和 `8.45` 裁决。 | 每个接口输入输出必须优先使用 Step 6 对象、typed ref、summary、material、view 或 boundary。 |
| 11 | 5 个 Step 6 对象附录 | 对象卡片的字段骨架、状态候选、成员 / 工厂函数骨架和禁止事项。 | 接口骨架不能私造附录外对象;若发现接口需要新对象,必须回 Step 6 补口。 |
| 12 | 本文件既有 5.x 内容和正式 §7 旧正文 | 历史接口名、旧污染和遗漏检查。 | 只能在新接口候选池形成后做差异审计,不得作为第一来源。 |

#### R1.1.3 诊断

- 既有 Step 7 文件显示为 completed,但这是 Step 6 完全重写之前的完成态;它虽然已经尝试禁用旧 `MethodContent` / publish / snapshot / outbox / fingerprint 接口族,但无法自动证明它承接了最新 Step 6 五个对象附录和正式 §6 回填后的对象分层。
- 正式 `02-概要设计.md` §7 仍大量保留旧 `CreateMethodContentDraft`、`PublishMethodContent`、`GetMethodContent`、`ExportDefinitionSnapshot`、fingerprint、outbox 等接口主线,所以正式 §7 必须重写,不能局部修补。
- Step 7 的合理粒度应参考 Step 6 的做法:先搭整体框架,再按接口分类 / 候选池、8 个组成部分、跨接口审计、旧材料差异审计、正式 §7 回填草稿、自检停审推进。
- Step 7 不能只写一张全仓接口总表。若不逐组成部分停审,后续 Step 8 很容易在处理流中发现接口无人承接、对象能力没有入口、Command / Query 混用、Inbound / Outbound event 来源不闭合等问题。

#### R1.1.4 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| 是否删除既有 5.x 内容 | no_now | 旧内容可作为 historical material,当前先追加 R1 重审段,避免大范围删除造成恢复困难。 |
| 是否直接重写正式 §7 | no | 需要先形成 Step 7 新中间产物、审计和回填草稿。 |
| 是否直接写接口候选池 | no | 当前模块只做开工和必读文档思考;下一批先重置框架。 |
| 是否沿用既有接口分类结论 | no | 既有结论必须在 R1 后置差异审计中复核,不能直接承认为当前 truth。 |
| 是否进入 Step 8 | no | Step 8 依赖 Step 7 新接口骨架闭合。 |

#### R1.1.5 下一写入批次结构

| 模块 | 要写入的内容 | 预期结论 |
|---|---|---|
| Step 7 文件头重置 | 标记 full_recheck,说明既有内容 historical。 | pass |
| 必读文档表 | 写当前重审必读文档和用途。 | pass |
| Step 内计划 | 按接口分类、8 个组成部分、审计、回填草稿、自检拆分。 | pass |
| 当前有效框架 | 定义接口分类、逐组成部分小循环、对象承接和禁止事项。 | pass |
| 历史材料边界 | 明确既有 5.x、正式 §7、旧 Step 8/9、DDD 只作后置审计。 | pass |

#### R1.1.6 下一写入批次边界

- 只允许进入 Step 7 `开工与必读文档:再写入`。
- 不写任何具体 Command / Query / Event / Job 表。
- 不改正式 `02-概要设计.md` §7。
- 不删除既有 5.x 历史内容。
- 不进入 Step 8 / Step 9。
- 若下一批发现 Step 6 对象承接不足,必须停在 Step 7 开工阶段并回到 Step 6 补口,不得在 Step 7 私造对象。

#### R1.1.7 自检

| 检查项 | 结论 |
|---|---|
| 是否按项目台账进入 Step 7 | pass |
| 是否读取 Step 7 SOP / 书写规范 | pass |
| 是否把既有 Step 7 完成态降级为 historical material | pass |
| 是否直接写接口骨架正文 | no |
| 是否进入 Step 8/9 | no |

next_allowed_action: 等待用户确认后进入 Step 7 `开工与必读文档:再写入`;不得写接口骨架正文,不得改正式 §7,不得进入 Step 8/9。

### R1.2 开工与必读文档:再写入

#### R1.2.1 当前有效开工结论

| 项目 | 当前结论 |
|---|---|
| Step | Step 7 API / 接口骨架 |
| 当前模式 | full_recheck |
| 第一来源 | 当前 `00-需求文档.md`;当前 `01-架构设计.md`;Step 5 `0R` 组成部分;Step 6 `8.45` 和五个对象附录。 |
| 历史材料 | 本文件原 `1`~`6` 章和 `5.x` 完成态、正式 §7 旧正文、旧 Step 8/9、历史 DDD。 |
| 当前禁止动作 | 不直接沿用既有 Step 7 完成态;不写具体接口表;不改正式 §7;不进入 Step 8/9。 |
| 当前下一动作 | Step 7 `接口分类与候选池:先思考`。 |

#### R1.2.2 必读文档表

| 顺序 | 文档 | 读取重点 | 对 Step 7 的约束 |
|---:|---|---|---|
| 1 | `design-calibration/project_execution_ledger.md` | 项目级恢复点和当前 next action。 | 必须按台账从 Step 7 重审恢复,不得跳到旧完成态或 Step 8。 |
| 2 | `design-calibration/02_hld_calibration_flow.md` | 文档级 Step 状态、Step 6 completed 和 Step 7 当前模块。 | Step 7 只允许从 `接口分类与候选池:先思考` 开始推进。 |
| 3 | `standards/document/概要设计讨论流程_SOP.md` Step 7 | Step 7 目标、输入、输出、应问问题和完成门禁。 | 必须区分 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job。 |
| 4 | `standards/document/概要设计书写规范.md` 4.7 | 接口分类说明、五类接口表格式和禁止下沉内容。 | 输入输出写概要骨架,不写 HTTP path、完整 schema、topic 字段、错误码或处理流图。 |
| 5 | `standards/document/设计文档讨论中间产物规范.md` | 先搭整体模块、逐模块先思考后写入和历史材料后置审计。 | Step 7 必须按主要组成部分小循环推进,不能一次性生成全仓完成稿。 |
| 6 | `standards/document/设计真相源闭环与可落码性标准.md` | 防止接口缺对象来源、event 来源、schema 来源或边界来源。 | 接口输入输出必须可追溯到 Step 6 对象 / ref / summary / material / view / policy / task。 |
| 7 | `projects/L3-method-library/00-需求文档.md` | 功能需求、接口依赖、业务规则和验收口径。 | 接口能力必须服务本仓需求,不得迁入下游运行 truth。 |
| 8 | `projects/L3-method-library/01-架构设计.md` | 系统上下文、依赖方向、交互通信、数据所有权。 | 外部正文、交易履约、安装和下游运行状态不得通过接口进入本仓 truth。 |
| 9 | `design-calibration/02_hld_step_05_components_boundary.md` | 八个组成部分、职责边界和 Step 7 承接入口。 | Step 7 接口必须按八个组成部分组织。 |
| 10 | `design-calibration/02_hld_step_06_key_objects.md` | Step 6 对象类别、`8.45` 裁决、Step 7 承接要求。 | 接口候选必须优先回指 Step 6 对象家族,不得私造对象。 |
| 11 | 5 个 Step 6 对象附录 | 对象卡片、字段骨架、状态候选、成员 / 工厂函数骨架和禁止事项。 | 若接口需要附录外对象或状态,必须回 Step 6 补口。 |
| 12 | `projects/L1-governance/design-calibration/02_hld_step_07_api_interface_skeleton.md` | L1-governance Step 7 的章节组织、SOP 问题回答、五类接口表、映射、诊断、取舍和回填草稿顺序。 | 只参考框架深度和组织方式,不得复制 governance 领域语义、接口名、对象名或事件名。 |
| 13 | 本文件原 `1`~`6` 章和正式 §7 旧正文 | 历史接口名、旧污染和遗漏检查。 | 只在新候选池形成后后置审计,不得作为第一来源。 |

#### R1.2.3 Step 内计划

| 顺序 | 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---:|---|---|---|---|---|
| 1 | 开工与必读文档:先思考 | done | `R1.1` 已完成重审开工思考。 | pass | 进入开工与必读文档:再写入。 |
| 2 | 开工与必读文档:再写入 | done | `R1.2` 写入当前有效框架、必读文档、Step 内计划和历史材料边界。 | pass | 进入接口分类与候选池:先思考。 |
| 3 | 接口分类与候选池:先思考 | pending | 判断五类接口是否适用、候选池筛选原则和旧接口禁入边界。 | wait_user_confirm | 等待用户确认。 |
| 4 | 接口分类与候选池:再写入 | pending | 写接口分类说明、候选池总览和逐组成部分展开顺序。 | blocked_by_previous | 待上一步完成。 |
| 5 | L1-governance 框架对齐:先思考 | done | `R1.5` 已对照 L1-governance Step 7 的章节顺序和粒度,裁决 L3 Step 7 最终框架和后续小循环方式。 | pass | 进入 L1-governance 框架对齐:再写入。 |
| 6 | L1-governance 框架对齐:再写入 | done | `R1.6` 已写入 L3 Step 7 采用的正式框架顺序、补读文档规则、小循环产物合并方式和不复制语义说明。 | pass | 进入方法资产定义与目录接口:先思考。 |
| 7 | 八个组成部分接口小循环 | in_progress | `R1.8` 已完成第一个组成部分“方法资产定义与目录接口:再写入”。 | pass | 进入正式化与版本接口:先思考。 |
| 8 | 接口到主要组成部分映射 | pending | 参考 L1-governance 的映射章节,汇总接口族与八个组成部分的承接关系。 | blocked_by_component_batches | 待八个组成部分完成。 |
| 9 | 当前文档问题诊断与设计取舍 | pending | 诊断正式 §7 和既有 5.x 的污染、缺口、可复用框架与禁止沿用项。 | blocked_by_mapping | 待映射完成。 |
| 10 | 跨接口一致性审计 | pending | 审计分类、命名、对象承接、读写边界和 Step 8 承接。 | blocked_by_diagnosis | 待诊断与取舍完成。 |
| 11 | 旧材料差异审计 | pending | 审计旧 `MethodContent` / publish / snapshot / outbox / fingerprint 接口主线是否回流。 | blocked_by_cross_audit | 待跨接口审计完成。 |
| 12 | 正式 §7 回填草稿 | pending | 形成正式 `02-概要设计.md` §7 的摘要化回填草稿。 | blocked_by_audit | 待旧材料差异审计完成。 |
| 13 | 自检与停审 | pending | 完成 Step 7 中间产物门禁、正式回填门禁和下一动作裁决。 | blocked_by_backfill_draft | 待回填草稿完成。 |

#### R1.2.4 当前有效框架

| 框架项 | 当前规则 |
|---|---|
| 分类主轴 | Command API、Query API、Inbound Event Consumer、Outbound Event、Operations Job。 |
| 分组主轴 | Step 5 的八个组成部分。 |
| 参考框架 | 参考 L1-governance Step 7 的章节顺序:目标、输入、SOP 问题回答、分类说明、五类接口表、接口到组成部分映射、问题诊断、设计取舍、回填草稿、进入下一步条件。 |
| 对象承接 | 每个接口必须回指 Step 6 对象、typed ref、summary、material、view、policy、guard、task 或 history/audit/lineage。 |
| 输入骨架 | 写对象骨架名,并显式判断是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`、event id 或 envelope。 |
| 输出骨架 | 写 result、view、material、summary、event 或 job result 的概要名,不写完整 schema。 |
| 边界表达 | 写读写性质、来源、写入结果、读取来源和禁止事项,不写处理流。 |
| 停审方式 | 每个组成部分写完后停审,最后做跨接口一致性审计。 |

#### R1.2.5 历史材料边界

| 材料 | 当前用途 | 禁止事项 |
|---|---|---|
| 本文件原 `1`~`6` 章和 `5.x` 记录 | 后置差异审计、旧接口污染检查、可能遗漏项检查。 | 不作为当前接口候选池第一来源;不视为本轮已完成。 |
| 正式 `02-概要设计.md` §7 | 旧接口主线污染检查和正式回填替换范围确认。 | 不保留旧 `CreateMethodContentDraft` / `PublishMethodContent` / snapshot / fingerprint / outbox 主线。 |
| 旧 Step 8 / Step 9 | 后续处理流和状态污染检查。 | 不反推当前接口、状态或事件来源。 |
| 历史 DDD | 详细设计阶段差异审计。 | 不反推概要接口骨架。 |
| L1-governance Step 7 | 框架深度、章节顺序和表格组织参考。 | 不复制 governance 领域语义、接口名、对象名、事件名或上下游关系。 |

#### R1.2.6 本批未做事项

| 事项 | 结论 |
|---|---|
| 写具体 Command / Query / Event / Job 表 | no |
| 修改正式 `02-概要设计.md` §7 | no |
| 删除旧 `5.x` 历史内容 | no |
| 进入八个组成部分接口小循环 | no |
| 进入 Step 8 / Step 9 | no |

#### R1.2.7 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成 Step 7 重审框架 | pass |
| 是否列出必读文档 | pass |
| 是否明确历史材料边界 | pass |
| 是否直接写接口骨架正文 | no |
| 是否允许进入接口分类与候选池:先思考 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `接口分类与候选池:先思考`;不得直接写接口骨架正文,不得改正式 §7,不得进入 Step 8/9。

### R1.3 接口分类与候选池:先思考

#### R1.3.1 问题回答

- 本模块只思考接口分类和候选池筛选原则,不写具体 Command / Query / Event / Job 表。
- L1-governance 的 Step 7 可参考之处是章节组织:先回答 SOP 问题,再给接口分类说明,然后按五类接口表展开,最后补接口到组成部分映射、问题诊断、设计取舍、回填草稿和进入下一步条件。
- L3-method-library 不能复制 L1-governance 的治理对象、接口名、事件名、消费者和外部上下游。L3 的接口候选必须从 Step 5 八个组成部分和 Step 6 对象家族重新推导。
- 五类接口在 L3 中都可能成立:
  - Command API: 用于定义、目录、正式化、版本、关系、外部摘要、维护边界和外围组织的显式写入。
  - Query API: 用于目录、正式版本、消费材料、可用性、追溯、影响、关系、外部摘要、维护进度和外围视图的只读读取。
  - Inbound Event Consumer: 仅用于接收外部 body-free summary / ref / marker,不得把外部正文、下游运行 truth 或 marketplace 履约带入本仓。
  - Outbound Event: 仅用于传播本仓已成立事实、材料可用性变化、关系 / 分发语义变化、维护状态或外围组织变化,不绑定旧 outbox 机制。
  - Operations Job: 仅用于 read material refresh、trace material refresh、consistency recovery 等基于已持久化事实的维护收敛动作,不作为业务 command 或 truth repair。
- 候选池必须先按接口类别收口,再进入八个组成部分小循环。否则后续接口表容易变成对象清单、服务清单或旧 API 清单。

#### R1.3.2 诊断

- 当前正式 §7 仍是旧 `MethodContent` / publish / snapshot / fingerprint / outbox 主线,不适合作为候选池来源。
- 本文件原 5.x 已包含一轮接口候选,但它是 Step 6 最终重写前形成的材料,只能作为后置差异审计。若直接沿用,会跳过 Step 6 新增对象附录、`MethodAssetConsumptionReadMaterial` 合并口径和正式 §6 对象分层。
- L1-governance 的 Step 7 没有采用“每个组成部分先思考 / 再写入”的过程记录,但其正式结构完整:目标、输入、SOP 问题回答、分类说明、Command、Query、Inbound、Outbound、Operations、映射、诊断、取舍、回填草稿、进入下一步条件。L3 应采用这个最终结构,同时保留当前 SOP 要求的小循环执行记录。
- 当前需要先形成候选池筛选规则,再决定哪些接口进入后续骨架表。候选池不应提前裁定所有接口名称,但应明确每类接口的成立条件和禁止项。

#### R1.3.3 分类适用性初判

| 接口类别 | L3 是否适用 | 成立条件 | 禁止事项 |
|---|---|---|---|
| Command API | yes | 显式改写本仓 truth、正式版本、关系、外部摘要接受记录、维护任务意图或外围组织对象。 | 不把 guard helper、repository、port、handler、worker 或旧 publish API 当作 Command。 |
| Query API | yes | 读取 catalog view、formal version view、consumption material、availability view、trace / impact / relation / external summary / maintenance / peripheral view。 | 不在 Query 中修复 truth、刷新 material、生成正式版本或写入审计。 |
| Inbound Event Consumer | conditional_yes | 外部系统提供 body-free summary / typed ref / marker,本仓只更新 external summary、basis acceptance、impact hint、freshness marker 或 pending review marker。 | 不接收外部正文、标准全文、artifact body、下游运行 truth、marketplace 履约事实。 |
| Outbound Event | conditional_yes | 本仓已提交事实、正式版本、消费材料可用性、关系 / 分发语义、维护状态或外围组织变化需要通知下游。 | 不恢复旧 `OutboxEvent` 对象、topic schema、relay / dead letter 机制或 fingerprint changed 事件。 |
| Operations Job | yes | 基于已持久化事实刷新 read material / trace material 或推动 consistency recovery。 | 不作为业务 command,不直接修 core truth,不写 worker loop、scheduler、queue、retry、lock。 |

#### R1.3.4 候选池筛选原则

| 筛选问题 | 进入候选池 | 不进入候选池 |
|---|---|---|
| 是否有 Step 5 组成部分来源 | 有明确组成部分和职责边界。 | 无组成部分来源,或只是实现层组件。 |
| 是否有 Step 6 对象承接 | 能回指对象、typed ref、summary、material、view、policy、guard、task、history / audit / lineage。 | 只能回指字符串、URL、route param、repository、port、DTO 或外部正文。 |
| 是否属于正式入口 | 是显式用例入口、事件消费入口、事件输出边界或运维任务入口。 | 是 application service helper、domain method、mapper、projection builder、repository 方法或 worker 内部函数。 |
| 是否明确读写性质 | 能归入 Command、Query、Inbound、Outbound 或 Operations。 | 同时读写不清、Query 隐式写、Consumer 直接改 core truth、Job 静默修业务 truth。 |
| 是否符合概要深度 | 能写输入骨架、输出骨架、读取来源 / 写入结果 / 边界。 | 需要完整 protocol schema、payload 字段全集、错误码、事务、DDL、队列和部署参数才能说清。 |

#### R1.3.5 候选池分组草案

| 分组 | 候选方向 | 后续展开 |
|---|---|---|
| 方法资产定义与目录 | definition / catalog 的 Command、Query、可能的 changed event。 | 八个组成部分小循环。 |
| 正式化与版本 | formalization / formal version 的 Command、Query、basis inbound、version changed event。 | 八个组成部分小循环。 |
| 受控消费 | consumption material / availability / boundary 的 Query、必要 Command、availability changed event。 | 八个组成部分小循环。 |
| 追溯与一致性保护 | trace / impact / audit / consistency 的 Query、summary inbound、protection Command、trace available event。 | 八个组成部分小循环。 |
| 关系与分发语义 | relation / distribution 的 Command、Query、relation changed event。 | 八个组成部分小循环。 |
| 外部摘要与引用 | external summary / ref / body boundary 的 Command、Query、inbound summary accepted。 | 八个组成部分小循环。 |
| 后台维护与收敛 | read refresh、trace refresh、consistency recovery Job、progress Query、maintenance status event。 | 八个组成部分小循环。 |
| 外围包与方法集组织 | package / method set / composition 的 Command、Query、peripheral changed event。 | 八个组成部分小循环。 |

#### R1.3.6 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| 是否沿用 L1-governance 的五类接口表 | yes_as_structure | 五类接口表是通用概要骨架,适合 L3。 |
| 是否沿用 L1-governance 的接口名和对象名 | no | 领域语义不同,L3 必须从 method asset 对象推导。 |
| 是否在候选池阶段写完整接口表 | no | 当前是先思考,下一批才写分类说明和候选池总览。 |
| 是否把 Outbound Event 等同旧 outbox | no | Event 是业务输出边界,outbox / relay 是后续详细或实现机制。 |
| 是否把 Operations Job 写成业务 Command | no | Job 只基于已持久化事实做维护收敛。 |

#### R1.3.7 下一写入批次结构

| 模块 | 要写入的内容 | 预期结论 |
|---|---|---|
| SOP 问题回答摘要 | 回答五类接口、上下文、对象承接和边界问题。 | pass |
| 接口分类说明 | 参考 L1-governance §4,写 L3 五类接口的读写性质、主要用途、上下文和禁止事项。 | pass |
| 候选池总览 | 按八个组成部分列出候选方向,不写完整接口表。 | pass |
| 旧接口禁入表 | 明确旧 `CreateMethodContentDraft` / `PublishMethodContent` / snapshot / fingerprint / outbox 等不进入候选池。 | pass |
| 下一模块裁决 | 判断是否进入 L1-governance 框架对齐或直接进入组成部分小循环。 | pass |

#### R1.3.8 下一写入批次边界

- 只允许进入 Step 7 `接口分类与候选池:再写入`。
- 只写分类说明、候选池总览、禁入表和下一模块裁决。
- 不写完整 Command / Query / Inbound / Outbound / Operations 表。
- 不写接口字段全集、HTTP path、topic、payload schema、repository / port 方法、处理流、状态迁移或配置项。
- 不改正式 `02-概要设计.md` §7。
- 不进入八个组成部分接口小循环、Step 8 或 Step 9。

#### R1.3.9 自检

| 检查项 | 结论 |
|---|---|
| 是否参考 L1-governance 框架 | pass |
| 是否复制 L1-governance 领域语义 | no |
| 是否完成五类接口适用性初判 | pass |
| 是否直接写具体接口表 | no |
| 是否允许进入接口分类与候选池:再写入 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `接口分类与候选池:再写入`;只写分类说明、候选池总览、旧接口禁入表和下一模块裁决,不得写完整接口表,不得改正式 §7,不得进入 Step 8/9。

### R1.4 接口分类与候选池:再写入

#### R1.4.1 SOP 问题回答摘要

| SOP 问题 | 当前回答 |
|---|---|
| 哪些接口属于 Command | 显式改写本仓 truth、正式版本、关系、外部摘要接受记录、维护任务意图或外围组织对象的入口才属于 Command。 |
| 哪些接口属于 Query | 只读取 catalog、formal version、consumption material、availability、trace、impact、relation、external summary、maintenance progress、peripheral view 的入口属于 Query。 |
| 哪些外部事实通过 Inbound Consumer 进入 | 只有 body-free summary、typed ref、marker、basis accepted、impact hint、freshness marker 或 pending review marker 可以进入。 |
| 哪些事实通过 Outbound Event 对外传播 | 仅传播本仓已提交事实、正式版本、消费材料可用性、关系 / 分发语义、维护状态或外围组织变化。 |
| 哪些动作属于 Operations Job | read material refresh、trace material refresh、consistency recovery 等基于已持久化事实的维护收敛动作。 |
| Command 是否需要上下文 | yes:必须显式判断 `ActorContext`、`CommandMetadata` 和 `IdempotencyKey`。 |
| Query 是否需要上下文 | yes:必须显式判断 `ActorContext` 或等价读取方 context。 |
| Event Consumer 是否需要 envelope / idempotency | yes:必须显式判断来源 envelope、source event id、source ref、schema / version、dedup key 或 trace context。 |
| 每个接口如何归属 | 后续必须回指 Step 5 八个组成部分和 Step 6 对象 / 对象能力。 |
| 是否存在混淆风险 | yes:旧 publish / snapshot / fingerprint / outbox、guard helper、repository、worker、mapper 都可能误入接口候选池,必须禁入。 |

#### R1.4.2 接口分类说明

| 接口类别 | 读写性质 | 主要用途 | 必须判断的上下文 | 不得做什么 |
|---|---|---|---|---|
| Command API | 显式写入本仓 truth / truth candidate / 正式边界 / 外围组织 | 定义、目录、正式化、版本、关系、外部摘要接受、外围包与方法集组织的正式变化 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;必要时 basis / reason / source ref | 不把 Query、guard helper、repository、port、handler、worker、旧 publish API 当作 Command。 |
| Query API | 只读 | 读取 view、read material、summary、typed ref 解析结果、availability、trace、impact、maintenance progress、peripheral view | `ActorContext` 或读取方 context;必要时 page / consistency hint / scope ref | 不写 truth、不刷新 material、不创建正式版本、不修复 projection、不写 audit。 |
| Inbound Event Consumer | 接收外部已成立事实的 body-free 投影 / 引用 / marker | 承接治理依据、artifact/archive ref、下游消费影响线索、外部来源摘要或 freshness marker | source envelope;source event id;source ref;schema / version;dedup key;trace context | 不接收外部正文、标准全文、artifact body、下游运行 truth、marketplace 履约事实。 |
| Outbound Event | 传播本仓已成立事实或维护状态 | 通知正式版本、消费材料可用性、关系 / 分发语义、外部摘要接受、维护状态或外围组织变化 | event ref;source truth / material / task ref;trace context;consumer boundary | 不恢复旧 `OutboxEvent` 对象、topic schema、relay、dead letter 或 fingerprint changed 事件。 |
| Operations Job | 后台维护 / 派生 / 收敛 | 刷新 read material、刷新 trace material、推动 consistency recovery、维护 progress / freshness | job metadata;operator / system actor;run ref;scope ref;idempotency key | 不作为业务 Command,不静默修 core truth,不写 worker loop、scheduler、queue、retry、lock。 |

#### R1.4.3 候选池总览

| 组成部分 | Command 候选方向 | Query 候选方向 | Inbound 候选方向 | Outbound 候选方向 | Job 候选方向 |
|---|---|---|---|---|---|
| 方法资产定义与目录 | definition 建立 / 调整;catalog entry 登记 / 调整 | definition / catalog 读取;definition ref lookup | 一般不直接接收外部事实;外部定义来源先进入 external summary | definition / catalog changed | 无,除非后续材料刷新需要回指目录 view |
| 正式化与版本 | formalization 判断;formal version 建立 / 变更 | formal version view;formalization state / basis summary 读取 | governance basis / external basis accepted summary | formal version changed;formalization state changed | 无直接 job;由维护层刷新派生材料 |
| 受控消费 | consumption material publish / withdraw / boundary decision 的显式入口候选 | consumption material;availability view;downstream boundary check | 下游消费影响 hint 仅进入 impact / trace 相关 summary | availability changed;consumption material changed | read material refresh |
| 追溯与一致性保护 | impact summary accepted;consistency protection decision 候选 | trace material;trace view;impact view;audit trail / lineage 读取 | consumption impact summary;external evidence marker | trace available;impact changed;protection marker changed | trace material refresh;consistency recovery |
| 关系与分发语义 | relation 建立 / 调整;distribution context 调整 | relation view;distribution read material | 外部关系 hint 需先成为 safe summary / ref | relation changed;distribution context changed | read material refresh 可能覆盖派生 view |
| 外部摘要与引用 | external summary accept / reject;artifact archive ref register;external body boundary decision | external summary view;external ref validity view | external source summary accepted;artifact/archive marker | external summary accepted;external ref validity changed | external ref validity refresh 仅作为后续候选,不直接修 truth |
| 后台维护与收敛 | 一般不作为业务 Command;只允许显式创建 / 请求 maintenance task intent | maintenance progress view;freshness / recovery progress 读取 | stale marker / refresh requested marker 仅作为任务触发线索 | maintenance status changed;material refreshed;recovery progressed | read material refresh;trace material refresh;consistency recovery |
| 外围包与方法集组织 | method package create / adjust;method set assembly create / adjust;composition rule decision | package view;method set assembly view;marketplace context ref 读取 | marketplace context summary 只作为边界 ref,不接收履约事实 | package changed;method set assembly changed | peripheral view refresh 如后续需要再闭口 |

#### R1.4.4 旧接口禁入表

| 旧接口 / 机制 | 禁入原因 | 当前替代口径 |
|---|---|---|
| `CreateMethodContentDraft` / `UpdateMethodContentDraft` | 旧 `MethodContent` draft 主线已禁入。 | 按 `MethodAssetDefinition` / `MethodAssetCatalogEntry` 重新推导定义与目录 Command。 |
| `PublishMethodContent` / `SupersedeMethodContent` | 旧 publish 生命周期不等同当前 formalization / formal version。 | 按 `FormalizationState`、`FormalMethodAssetVersion`、basis summary 推导正式化和版本 Command。 |
| `GetMethodContent` / `ListMethodContents` | 旧 content read model 不承接当前 view/material 分层。 | 按 catalog、formal version、consumption material、trace / relation / external views 推导 Query。 |
| `ExportDefinitionSnapshot` / snapshot | 旧 snapshot 供给机制已禁入。 | 按 `MethodAssetConsumptionMaterial`、read material、trace material 和 external ref 重新讨论供给边界。 |
| `CompareFingerprint` / fingerprint changed | 旧 fingerprint 漂移机制已禁入。 | 版本语义、freshness、lineage 和 consistency marker 后续按当前对象推导。 |
| `OutboxEvent` / relay / dead letter | 旧可靠投递实现机制不是概要接口对象。 | 只保留 Outbound Event 业务边界;投递机制后续详细设计再闭口。 |
| repository / port / handler / mapper / worker | 属于详细设计或实现层。 | Step 7 只写正式入口和业务边界。 |
| marketplace listing / install / fulfillment | 属于外围生态或 `L6-marketplace` 范围。 | L3 只保留 `MarketplaceContextRef` 和 package / method set 外围组织语义。 |

#### R1.4.5 下一模块裁决

| 选项 | 裁决 | 理由 |
|---|---|---|
| 直接进入八个组成部分接口小循环 | no_now | 用户要求参考 L1-governance 框架,需要先对齐章节顺序和粒度,避免后续接口表过浅。 |
| 先进入 L1-governance 框架对齐 | yes | R1.2 已把 L1-governance Step 7 设为参考框架,R1.4 候选池闭合后应先裁决 L3 最终章节框架。 |
| 修改正式 §7 | no | 正式回填需要等新 Step 7 中间产物、审计和回填草稿完成。 |
| 写完整五类接口表 | no | 当前只完成候选池,完整表应在框架对齐和小循环之后逐步写入。 |

#### R1.4.6 本批未做事项

| 事项 | 结论 |
|---|---|
| 写完整 Command API 表 | no |
| 写完整 Query API 表 | no |
| 写完整 Inbound / Outbound / Operations 表 | no |
| 进入八个组成部分接口小循环 | no |
| 修改正式 `02-概要设计.md` §7 | no |
| 进入 Step 8 / Step 9 | no |

#### R1.4.7 停审记录

| 检查项 | 结论 |
|---|---|
| 是否完成接口分类说明 | pass |
| 是否完成候选池总览 | pass |
| 是否完成旧接口禁入表 | pass |
| 是否保持 L1-governance 只作框架参考 | pass |
| 是否允许进入 L1-governance 框架对齐:先思考 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `L1-governance 框架对齐:先思考`;不得写完整接口表,不得改正式 §7,不得进入 Step 8/9。

### R1.5 L1-governance 框架对齐:先思考

#### R1.5.1 问题回答

- 当前模块不是写完整接口表,而是先把 L3 Step 7 的最终章节骨架对齐到 L1-governance 的成熟框架,避免后续八个组成部分各写各的,最后无法汇总成正式 §7。
- L1-governance Step 7 可参考的是“框架深度和输出顺序”:目标、输入、SOP 问题回答、接口分类说明、Command / Query / Inbound / Outbound / Operations 五类表、接口到组成部分映射、当前文档问题诊断、设计取舍、回填草稿、进入下一步条件。
- L3 不能复制 L1-governance 的治理语义。治理里的 Gate、Decision、Approval、Policy、Control、Nonconformity、外部 GRC、GovernanceOutbox 等对象、接口名、事件名和消费者都不得进入 L3。
- L3 的 Step 7 应采用“双层产物”:
  - 执行层:继续按八个组成部分逐模块先思考、再写入,每个模块产出该组成部分的 Command / Query / Inbound / Outbound / Operations 候选和停审。
  - 汇总层:八个组成部分完成后,再按五类接口汇总成 L1-governance 风格的五张正式骨架表,并补接口到组成部分映射。
- 不能反过来先写五张全仓总表。若先写总表,容易把接口写成浅层清单,并跳过组成部分内部的对象承接、读写性质、事件来源和 job 边界判断。
- 需要补读 L1-governance Step 7 本身,并按需补读 L1-governance Step 5 / Step 6 的框架形态,但只用于理解“组成部分到对象到接口”的组织方式,不得拿治理领域内容来填 L3。

#### R1.5.2 与 L1-governance Step 7 的框架对照

| L1-governance Step 7 章节 | L3 是否采用 | L3 调整方式 |
|---|---|---|
| 本步目标 | yes | 写 L3 的 Step 7 目标:从 Step 5 / Step 6 推导接口骨架,支撑 Step 8 处理流。 |
| 本步输入 | yes | 输入必须加入 L3 Step 5、Step 6 主文件、5 个 Step 6 对象附录和正式 §6 回填状态。 |
| SOP 问题回答 | yes | 继续回答 Command、Query、Inbound、Outbound、Operations、上下文、幂等和 envelope 问题。 |
| 接口分类说明 | yes | 已在 `R1.4` 初步写入,后续 `R1.6` 需要把它固定为最终框架中的公共章节。 |
| Command API 骨架表 | yes_after_batches | 不立即写全仓表;先由八个组成部分小循环产出,再汇总为全仓 Command 表。 |
| Query API 骨架表 | yes_after_batches | 不立即写全仓表;先按组成部分判定读取来源和边界,再汇总。 |
| Inbound Event Consumer 骨架表 | conditional_yes_after_batches | 只接收 body-free summary / ref / marker;先在相关组成部分判断是否成立。 |
| Outbound Event 骨架表 | conditional_yes_after_batches | 只表达本仓事实或材料变化边界;不写 outbox / topic / relay。 |
| Operations Job 骨架表 | yes_after_batches | 主要来自后台维护与收敛,但其他组成部分可提出 job 触发线索。 |
| 接口到主要组成部分映射 | yes | 八个组成部分完成后必须汇总,作为 Step 8 处理流入口索引。 |
| 当前文档问题诊断 | yes | 诊断正式 §7 和旧 5.x 是否有旧主线污染、深度不足或缺接口类别。 |
| 设计取舍 | yes | 固定“不复制治理语义”“先小循环再总表”“事件不等于 outbox”“job 不修 truth”等裁决。 |
| 回填草稿 | yes | 只形成正式 §7 草稿,不在本模块改正式 `02-概要设计.md`。 |
| 进入下一步条件 | yes | Step 7 自检通过后才允许进入 Step 8,不得依赖旧 completed 记录。 |

#### R1.5.3 L3 Step 7 最终框架裁决

| 顺序 | 最终章节 / 模块 | 目的 | 与当前 R1 的关系 |
|---:|---|---|---|
| 1 | 本步目标 | 定义 Step 7 只做接口骨架,不下沉协议 / port / repository。 | `R1.6` 写入框架章节。 |
| 2 | 本步输入 / 必读文档 | 固定 L3 输入和 L1-governance 参考材料边界。 | 承接 `R1.2` 和本模块补读裁决。 |
| 3 | SOP 问题回答 | 回答五类接口、上下文、幂等、event envelope 和对象归属问题。 | 承接 `R1.4` 摘要,后续可扩写。 |
| 4 | 接口分类说明 | 给出 Command / Query / Inbound / Outbound / Operations 的 L3 读写性质和禁区。 | 已有 `R1.4`,后续在总表前固化。 |
| 5 | 八个组成部分接口小循环 | 每个组成部分先思考、再写入,生成局部接口候选和停审。 | 下一大段执行主体。 |
| 6 | Command API 骨架总表 | 汇总所有会写本仓 truth / 边界 / 外围组织的接口。 | 八个小循环后生成,不提前写。 |
| 7 | Query API 骨架总表 | 汇总所有读取 view / material / summary / progress 的接口。 | 八个小循环后生成。 |
| 8 | Inbound Event Consumer 骨架总表 | 汇总 body-free 外部 summary / ref / marker 的消费入口。 | 八个小循环后生成。 |
| 9 | Outbound Event 骨架总表 | 汇总本仓事实、材料、关系、维护和外围变化的输出边界。 | 八个小循环后生成。 |
| 10 | Operations Job 骨架总表 | 汇总 read material refresh、trace material refresh、consistency recovery 等维护入口。 | 八个小循环后生成。 |
| 11 | 接口到主要组成部分映射 | 给 Step 8 提供接口族到组成部分的反查表。 | 总表后生成。 |
| 12 | 当前文档问题诊断 | 诊断正式 §7 和旧历史材料污染。 | 映射后生成。 |
| 13 | 设计取舍 | 固定关键取舍和后续详细设计边界。 | 诊断后生成。 |
| 14 | 跨接口一致性审计 | 审计分类、对象承接、上下文、事件来源、job 边界和 Step 8 可承接性。 | 取舍后生成。 |
| 15 | 旧材料差异审计 | 专门审计旧 `MethodContent` / publish / snapshot / fingerprint / outbox 是否回流。 | 跨接口审计后生成。 |
| 16 | 正式 §7 回填草稿 | 形成正式 `02-概要设计.md` §7 的可回填草稿。 | 审计后生成,仍不直接改正式文档。 |
| 17 | 自检与停审 | 决定是否允许正式 §7 回填或进入下一 Step。 | Step 7 末尾执行。 |

#### R1.5.4 小循环与总表合并方式

| 方案 | 裁决 | 原因 |
|---|---|---|
| 先写五类全仓总表,再回填组成部分 | no | 容易生成浅层 300 行式接口清单,并跳过每个组成部分的对象承接和边界判断。 |
| 只写八个组成部分,不写五类总表 | no | 正式 §7 和 Step 8 需要按 Command / Query / Event / Job 快速反查。 |
| 先八个组成部分小循环,后五类总表 | yes | 同时满足 SOP 的逐模块先思考 / 再写入和 L1-governance 的正式结构深度。 |
| 每个组成部分内同时判断五类接口 | yes | 可以提前发现某组成部分没有 Inbound、没有 Job 或只适合 Query 的情况。 |
| 每个组成部分写完立即改正式 §7 | no | 正式 §7 需要等全局审计和回填草稿完成后再统一回填。 |

#### R1.5.5 补读文档裁决

| 文档 | 是否补读 | 用途 | 禁止事项 |
|---|---|---|---|
| `projects/L1-governance/design-calibration/02_hld_step_07_api_interface_skeleton.md` | yes_required | 参考 Step 7 最终章节顺序、表格类型和深度。 | 不复制治理对象、接口名、事件名、消费者或外部上下游。 |
| `projects/L1-governance/design-calibration/02_hld_step_05_components_boundary.md` | optional_before_R1_6 | 只看“组成部分如何成为接口分组主轴”的框架。 | 不复制 Governance 组成部分名称或职责。 |
| `projects/L1-governance/design-calibration/02_hld_step_06_key_objects.md` | optional_before_component_batches | 只看“对象如何回指接口输入输出”的框架。 | 不复制 Governance 对象名、状态名或 trace / outbox 语义。 |
| L3 Step 5 / Step 6 主文件和附录 | yes_required | L3 接口候选的第一来源。 | 不得被 L1-governance 内容替代。 |
| 正式 `02-概要设计.md` §7 旧正文 | audit_only | 只在新接口框架形成后做污染检查。 | 不作为当前接口来源。 |

#### R1.5.6 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| L1-governance 是否作为模板 | yes_framework_only | 它提供成熟章节骨架,但领域语义完全不同。 |
| L3 是否需要比当前候选池更深 | yes | Step 5 往后是重点内容,不能停留在分类说明和总览。 |
| 八个组成部分是否保留为执行主线 | yes | 这是防止接口遗漏和对象承接不闭口的主要手段。 |
| 五类接口总表是否仍需要 | yes | 这是正式 §7 和 Step 8 的主要读写分类入口。 |
| 是否允许后续每批最多 300 行导致文件最终变短 | no | 100~300 行只是单次写入批次建议,不是最终文档长度上限。 |
| 是否允许提前进入 Step 8 | no | Step 8 必须等 Step 7 新接口骨架、映射、审计和回填草稿闭合。 |

#### R1.5.7 下一写入批次结构

| 模块 | 要写入的内容 | 预期结论 |
|---|---|---|
| L1-governance 框架对齐结论 | 固定 L3 采用 L1-governance 的目标、输入、SOP 回答、五类表、映射、诊断、取舍、回填草稿、进入条件结构。 | pass |
| L3 最终章节顺序 | 写入 Step 7 后续 17 段框架和执行顺序。 | pass |
| 小循环到总表合并规则 | 明确先八个组成部分、后五类总表。 | pass |
| 补读文档规则 | 写明 L1-governance Step 5 / Step 6 可选补读和禁止复制语义。 | pass |
| 下一模块裁决 | 进入八个组成部分接口小循环的第一个模块。 | pass |

#### R1.5.8 下一写入批次边界

- 只允许进入 Step 7 `L1-governance 框架对齐:再写入`。
- 不写完整 Command / Query / Inbound / Outbound / Operations 总表。
- 不进入第一个组成部分接口小循环,除非 `R1.6` 先写完并停审。
- 不修改正式 `02-概要设计.md` §7。
- 不进入 Step 8 / Step 9。
- 不复制 L1-governance 的领域语义、对象名、接口名、事件名、消费者或上下游。

#### R1.5.9 自检

| 检查项 | 结论 |
|---|---|
| 是否完成 L1-governance 框架对齐思考 | pass |
| 是否明确 L3 最终章节顺序 | pass |
| 是否明确先小循环后总表 | pass |
| 是否限定 L1-governance 只作框架参考 | pass |
| 是否写完整接口表 | no |
| 是否修改正式 §7 | no |
| 是否允许进入 L1-governance 框架对齐:再写入 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `L1-governance 框架对齐:再写入`;只写框架对齐结论、最终章节顺序、小循环到总表规则和补读文档规则,不得写完整接口表,不得改正式 §7,不得进入 Step 8/9。

### R1.6 L1-governance 框架对齐:再写入

#### R1.6.1 框架对齐结论

| 对齐项 | L3 Step 7 采用方式 | 说明 |
|---|---|---|
| 目标章节 | 采用 | Step 7 只定义 API / 接口骨架,不写协议、port、repository、处理流或状态机。 |
| 输入章节 | 采用并扩展 | 输入必须包含 L3 Step 5、Step 6 主文件、5 个 Step 6 对象附录和正式 §6 回填状态。 |
| SOP 问题回答 | 采用 | 必须覆盖 Command、Query、Inbound Consumer、Outbound Event、Operations Job、上下文、幂等和 event envelope。 |
| 接口分类说明 | 采用 | `R1.4` 的分类说明成为公共框架,后续在总表前复核。 |
| 五类接口表 | 采用但后置生成 | 不先写全仓总表;八个组成部分小循环闭合后再汇总。 |
| 接口到组成部分映射 | 采用 | 汇总表之后必须生成映射表,作为 Step 8 处理流入口索引。 |
| 当前文档问题诊断 | 采用 | 诊断正式 §7 和旧 5.x 完成态的污染、遗漏和粒度不足。 |
| 设计取舍 | 采用 | 固定事件不等于 outbox、job 不修 truth、L1-governance 只作框架参考等裁决。 |
| 回填草稿 | 采用 | 先形成正式 §7 草稿;正式文档回填必须等审计和停审通过。 |
| 进入下一步条件 | 采用 | Step 7 完成门禁通过后才允许进入 Step 8。 |

#### R1.6.2 L3 Step 7 后续执行顺序

| 顺序 | 模块 | 状态 | 产物 | 下一动作 |
|---:|---|---|---|---|
| 1 | 本步目标 / 输入 / SOP 回答框架 | framework_fixed | 本模块固定,后续不单独扩写。 | 进入组成部分小循环。 |
| 2 | 方法资产定义与目录接口:先思考 | done | `R1.7` 已判断 definition / catalog 的 Command、Query、Event、Job 候选、对象承接和禁止事项。 | 进入再写入。 |
| 3 | 方法资产定义与目录接口:再写入 | done | `R1.8` 已写入该组成部分 Command / Query / Outbound Event 局部骨架和停审。 | 进入正式化与版本接口:先思考。 |
| 4 | 正式化与版本接口:先思考 | done | `R1.9` 已判断 formalization / formal version 的 Command、Query、Event、Job 候选、对象承接和禁止事项。 | 进入再写入。 |
| 5 | 正式化与版本接口:再写入 | done | `R1.10` 已写入该组成部分 Command / Query / Outbound Event 局部骨架和停审。 | 进入受控消费接口:先思考。 |
| 6 | 受控消费接口:先思考 | done | `R1.11` 已判断 consumption material / availability / boundary 的 Command、Query、Event、Job 候选、对象承接和禁止事项。 | 进入再写入。 |
| 7 | 受控消费接口:再写入 | done | `R1.12` 已写入该组成部分 Command / Query / Outbound Event 局部骨架和停审。 | 进入追溯与一致性保护接口:先思考。 |
| 8 | 追溯与一致性保护接口:先思考 | done | `R1.13` 已判断 trace / impact / audit / consistency 的 Command、Query、Event、Job 候选、对象承接和禁止事项。 | 进入再写入。 |
| 9 | 追溯与一致性保护接口:再写入 | done | `R1.14` 已写入该组成部分 Command / Query / Outbound Event 局部骨架和停审。 | 进入关系与分发语义接口:先思考。 |
| 10 | 关系与分发语义接口:先思考 | done | `R1.15` 已判断 relation / distribution 的 Command、Query、Event、Job 候选、对象承接和禁止事项。 | 进入再写入。 |
| 11 | 关系与分发语义接口:再写入 | done | `R1.16` 已写入该组成部分 Command / Query / Outbound Event 局部骨架和停审。 | 进入外部摘要与引用接口:先思考。 |
| 12 | 外部摘要与引用接口:先思考 | done | `R1.17` 已判断 external summary / ref / body boundary 的 Command、Query、Event、Job 候选、对象承接和禁止事项。 | 进入再写入。 |
| 13 | 外部摘要与引用接口:再写入 | done | `R1.18` 已写入该组成部分 Command / Query / bounded Inbound Consumer / Outbound Event 局部骨架和停审。 | 进入后台维护与收敛接口:先思考。 |
| 14 | 后台维护与收敛接口:先思考 | done | `R1.19` 已判断 maintenance request、Operations Job、Query、Event 候选、对象承接和禁止事项。 | 进入再写入。 |
| 15 | 后台维护与收敛接口:再写入 | done | `R1.20` 已写入该组成部分 bounded Command / Query / Operations Job / Outbound Event 局部骨架和停审。 | 进入外围包与方法集组织接口:先思考。 |
| 16 | 外围包与方法集组织接口:先思考 | done | `R1.21` 已判断 package / method set / peripheral discovery 的 Command、Query、Inbound、Outbound、Operations 候选、对象承接和禁止事项。 | 进入再写入。 |
| 17 | 外围包与方法集组织接口:再写入 | done | `R1.22` 已写入该组成部分 bounded Command / Query / Outbound Event 局部骨架和停审。 | 进入 Command API 骨架总表:先思考。 |
| 18 | Command API 骨架总表:先思考 | done | `R1.23` 已完成八个组成部分 Command 候选汇总口径、纳入规则、排除规则和下一写入结构。 | 进入再写入。 |
| 19 | Command API 骨架总表:再写入 | done | `R1.24` 已写入全仓 Command API 骨架总表和停审。 | 进入 Query API 骨架总表:先思考。 |
| 20 | Query API 骨架总表:先思考 | done | `R1.25` 已完成八个组成部分 Query 候选汇总口径、数量盘点、纳入规则、排除规则和下一写入结构。 | 进入再写入。 |
| 21 | Query API 骨架总表:再写入 | done | `R1.26` 已写入全仓 Query API 骨架总表和停审。 | 进入 Inbound Event Consumer 骨架总表:先思考。 |
| 22 | Inbound Event Consumer 骨架总表:先思考 | done | `R1.27` 已完成 body-free inbound consumer 汇总口径、候选盘点、纳入规则、排除规则和下一写入结构。 | 进入再写入。 |
| 23 | Inbound Event Consumer 骨架总表:再写入 | done | `R1.28` 已写入全仓 4 个 body-free Inbound Event Consumer 行和停审记录。 | 进入 Outbound Event 骨架总表:先思考。 |
| 24 | Outbound Event 骨架总表:先思考 | done | `R1.29` 已完成 Outbound Event 总表候选盘点、纳入规则、排除规则和下一写入结构。 | 进入再写入。 |
| 25 | Outbound Event 骨架总表:再写入 | done | `R1.30` 已写入全仓 34 个 Outbound Event 行和停审记录。 | 进入 Operations Job 骨架总表:先思考。 |
| 26 | Operations Job 骨架总表:先思考 | done | `R1.31` 已完成 Operations Job 总表候选盘点、纳入规则、排除规则和下一写入结构。 | 进入再写入。 |
| 27 | Operations Job 骨架总表:再写入 | done | `R1.32` 已写入全仓 8 个 Operations Job 行和停审记录。 | 进入接口到主要组成部分映射:先思考。 |
| 28 | 接口到主要组成部分映射:先思考 | done | `R1.33` 已完成五类接口到八个组成部分映射的输入盘点、维度、规则、排除 / 降级和下一写入结构。 | 进入再写入。 |
| 29 | 接口到主要组成部分映射:再写入 | done | `R1.34` 已写入八个主要组成部分到 Command / Query / Inbound / Outbound / Operations 的反查映射表、使用说明和停审记录。 | 进入当前文档问题诊断与设计取舍:先思考。 |
| 30 | 当前文档问题诊断与设计取舍:先思考 | done | `R1.35` 已完成旧正式 §7、历史 5.x 和当前 R1 结论的诊断输入、维度、取舍规则、排除规则和下一写入结构。 | 进入再写入。 |
| 31 | 当前文档问题诊断与设计取舍:再写入 | done | `R1.36` 已写入诊断摘要、问题诊断与设计取舍表、历史 5.x 继承判断、正式 §7 后续处理口径和停审记录。 | 进入跨接口一致性审计:先思考。 |
| 32 | 跨接口一致性审计:先思考 | done | `R1.37` 已完成分类、对象承接、读写边界、事件来源、job 边界和 Step 8/9 风险的审计输入、维度、规则和下一写入结构。 | 进入再写入。 |
| 33 | 跨接口一致性审计:再写入 | done | `R1.38` 已写入审计摘要、分类一致性、Owner / 对象承接、读写边界、Event / Job 边界、Step 8/9 承接风险提示和停审记录。 | 进入旧材料差异审计:先思考。 |
| 34 | 旧材料差异审计:先思考 | done | `R1.39` 已完成旧正式 §7、历史 5.x、旧 Step 8/9 风险和当前 R1 结论之间的差异审计输入、污染族、规则、排除 / 降级和下一写入结构。 | 进入再写入。 |
| 35 | 旧材料差异审计:再写入 | done | `R1.40` 已写入差异审计摘要、旧正式 §7 污染检查表、历史 5.20 继承判断、旧 Step 8/9 承接风险、正式 §7 回填前置裁决和停审记录。 | 进入正式 §7 回填草稿:先思考。 |
| 36 | 正式 §7 回填草稿:先思考 | done | `R1.41` 已完成正式 §7 回填草稿的章节结构、来源映射、摘要化策略、表格裁剪规则、禁止事项和下一写入结构。 | 进入再写入。 |
| 37 | 正式 §7 回填草稿:再写入 | done | `R1.42` 已形成正式 `02-概要设计.md` §7 可回填草稿,覆盖接口分类、Command、Query、Inbound、Outbound、Operations Job 和边界红线。 | 进入自检与停审:先思考。 |
| 38 | 自检与停审:先思考 | done | `R1.43` 已完成 Step 7 完成门禁、正式 §7 草稿可回填性、旧材料禁入、Step 8/9 阻断和下一写入结构思考。 | 进入再写入。 |
| 39 | 自检与停审:再写入 | done | `R1.44` 已完成 Step 7 完成门禁自检、正式 §7 草稿可回填性检查、后续风险保留、停审裁决和 flow / 台账推进建议。 | Step 7 中间产物完成;等待用户决定是否正式回填 §7 或进入下一步。 |

#### R1.6.3 八个组成部分小循环规则

| 规则 | 具体要求 |
|---|---|
| 第一来源 | 每个组成部分必须先回读 L3 Step 5 对应职责边界和 Step 6 对象 / 附录对象。 |
| 思考模块 | 每个组成部分先回答是否有 Command、Query、Inbound、Outbound、Operations,并说明成立条件和禁区。 |
| 写入模块 | 再写局部接口骨架表,包括输入骨架、输出骨架、读写性质、对象承接、边界和停审记录。 |
| 不提前总表 | 小循环阶段不写全仓五类总表,只积累可汇总的局部接口。 |
| 不复制治理语义 | 可参考 L1-governance 的表格结构,不得复制 Gate / Decision / Policy / Control 等领域内容。 |
| 不下沉实现 | 不写 HTTP path、RPC method、完整 DTO schema、topic 字段、repository / port 函数、事务、DDL、worker loop 或配置项。 |
| 发现对象缺口 | 若接口需要 Step 6 未定义对象 / ref / summary / material / view / task,必须停审并回 Step 6 补口,不得在 Step 7 私造。 |

#### R1.6.4 小循环到五类总表合并规则

| 合并目标 | 来源 | 合并口径 |
|---|---|---|
| Command API 总表 | 八个组成部分的 Command 局部表 | 只纳入改写本仓 truth、正式边界、外部摘要接受记录、维护任务意图或外围组织对象的入口。 |
| Query API 总表 | 八个组成部分的 Query 局部表 | 只纳入读取 view、read material、summary、typed ref、availability、trace、impact、progress 或 peripheral view 的入口。 |
| Inbound Event Consumer 总表 | 八个组成部分的 Inbound 候选 | 只纳入外部已成立 body-free summary / typed ref / marker,不得纳入正文同步。 |
| Outbound Event 总表 | 八个组成部分的 Outbound 候选 | 只纳入本仓已成立事实、材料可用性、关系 / 分发语义、维护状态或外围组织变化。 |
| Operations Job 总表 | 八个组成部分的 Job 候选 | 只纳入 read material refresh、trace material refresh、consistency recovery、peripheral refresh 等维护收敛入口。 |
| 映射表 | 五类总表 | 每个接口必须回指至少一个 Step 5 组成部分和 Step 6 对象 / 对象能力。 |

#### R1.6.5 补读文档规则

| 场景 | 必读 / 可选文档 | 读取目的 |
|---|---|---|
| 每次恢复 Step 7 | `project_execution_ledger.md`;`02_hld_calibration_flow.md`;本文件 | 确认当前模块和禁止动作。 |
| 每个组成部分小循环开工 | `02_hld_step_05_components_boundary.md`;`02_hld_step_06_key_objects.md`;对应 Step 6 附录 | 确认职责边界、对象承接和禁止事项。 |
| 需要核对框架深度 | `projects/L1-governance/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 只参考章节顺序、表格类型和表达深度。 |
| 需要核对组成部分到对象的组织方式 | `projects/L1-governance/design-calibration/02_hld_step_05_components_boundary.md`;`projects/L1-governance/design-calibration/02_hld_step_06_key_objects.md` | 只参考“组成部分 -> 对象 -> 接口”的框架链路。 |
| 形成回填草稿前 | 正式 `02-概要设计.md` §7 旧正文 | 只做污染检查和替换范围确认。 |

#### R1.6.6 不复制语义清单

| 禁止复制来源 | 禁止复制内容 | L3 正确口径 |
|---|---|---|
| L1-governance Step 5 | Governance truth core、Gate、Decision、Approval、Policy、Control、Nonconformity 等组成部分 | 使用 L3 的方法资产定义、正式化、受控消费、追溯、关系、外部摘要、维护、外围组织八个组成部分。 |
| L1-governance Step 6 | GovernanceContext、GovernanceDecision、PolicyEffectiveFact、ControlApplicability、GovernanceOutboxRecord 等对象 | 使用 L3 Step 6 的 MethodAssetDefinition、FormalMethodAssetVersion、MethodAssetConsumptionMaterial、MethodAssetTraceMaterial、MethodAssetRelation 等对象。 |
| L1-governance Step 7 | `CreateGovernanceContext`、`RecordGovernanceDecision`、`PublishGovernanceOutbox` 等接口 / job 名 | 从 L3 对象和能力重新命名接口,不得照搬。 |
| L1-governance 外部协作 | process / work / artifact / runtime / external GRC 等治理消费者语义 | L3 只保留本仓真实依赖的 body-free summary / ref / marker 和下游消费边界。 |

#### R1.6.7 下一模块裁决

| 选项 | 裁决 | 理由 |
|---|---|---|
| 进入方法资产定义与目录接口:先思考 | yes | 框架已固定,应按 Step 5 八个组成部分顺序进入第一个小循环。 |
| 直接写方法资产定义与目录接口骨架 | no | 仍需先完成本组成部分的思考模块。 |
| 直接写五类总表 | no | 五类总表必须等八个组成部分小循环闭合后合并。 |
| 修改正式 §7 | no | 正式回填要等回填草稿和审计通过。 |
| 进入 Step 8 | no | Step 7 还未完成局部接口、总表、映射和审计。 |

#### R1.6.8 停审记录

| 检查项 | 结论 |
|---|---|
| 是否写入框架对齐结论 | pass |
| 是否固定 L3 Step 7 后续执行顺序 | pass |
| 是否明确先八个组成部分小循环、后五类总表 | pass |
| 是否明确补读文档和不复制语义规则 | pass |
| 是否写完整接口表 | no |
| 是否修改正式 §7 | no |
| 是否允许进入方法资产定义与目录接口:先思考 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `方法资产定义与目录接口:先思考`;只思考该组成部分的 Command / Query / Inbound / Outbound / Operations 候选、对象承接和禁止事项,不得写完整接口表总表,不得改正式 §7,不得进入 Step 8/9。

### R1.7 方法资产定义与目录接口:先思考

#### R1.7.1 问题回答

- 本模块只思考 `方法资产定义与目录` 这个组成部分的接口候选,不写完整接口骨架表,不写全仓 Command / Query / Event / Job 总表。
- 本组成部分的接口第一来源是 Step 5 `5.10` 和 Step 6 对象卡片:
  - core truth:`MethodAssetDefinition`;`MethodAssetCatalogEntry`。
  - typed ref / scope:`MethodAssetDefinitionRef`;`CatalogScopeRef`。
  - read model:`MethodAssetCatalogView`。
  - history:`MethodAssetDefinitionHistory`。
- 本组成部分需要 Command API。凡是建立定义 truth、调整定义语义、建立目录项、调整目录范围或退役目录项的入口,都属于写本仓 truth / catalog truth 的 Command 候选。
- 本组成部分需要 Query API。凡是读取 definition summary、解析 definition ref、读取 catalog entry / catalog view、按 catalog scope 列目录的入口,都属于 Query 候选。
- 本组成部分原则上不直接需要 Inbound Event Consumer。外部来源、标准、ADR、artifact 或治理依据必须先进入 `外部摘要与引用`,形成 body-free summary / ref 后,才能作为定义建立或调整的依据输入。
- 本组成部分可以提出 Outbound Event 候选。它们只表达 definition / catalog fact changed,用于后续正式化、消费材料、关系、追溯和外围材料刷新;本 Step 不写 outbox、topic、payload schema 或投递策略。
- 本组成部分不直接定义 Operations Job。目录 view 刷新、catalog read material 重建和 stale 收敛归入 `后台维护与收敛`;本组成部分最多提供 job 触发线索,不得把 job 写成业务 Command。

#### R1.7.2 对象承接判断

| Step 6 对象 / 能力 | 对 Step 7 的接口含义 | 当前判断 |
|---|---|---|
| `MethodAssetDefinition` | 必须有建立 / 调整 / 退役类 Command,以及定义摘要读取 Query。 | 进入本组成部分候选池。 |
| `MethodAssetCatalogEntry` | 必须有目录项登记 / 重分类 / 退役类 Command,以及目录项读取 Query。 | 进入本组成部分候选池。 |
| `MethodAssetDefinitionRef` | 所有正式化、消费、关系、追溯和外围接口都应通过该 typed ref 锚定定义。 | 作为输入 / 输出骨架核心 ref。 |
| `CatalogScopeRef` | 目录范围、适用语境和 catalog view 读取必须使用该 typed scope。 | 作为 catalog Command / Query 的核心 ref。 |
| `MethodAssetCatalogView` | 只读目录识别材料,用于 list / get / lookup 类 Query。 | 作为 Query 输出,不得成为 Command 写入对象。 |
| `MethodAssetDefinitionHistory` | 解释定义建立、调整、重分类或退役的 body-free 历史线索。 | 可由 Command 结果产生 history ref,但不作为外部 raw audit API。 |

#### R1.7.3 Command 候选判断

| 候选方向 | 是否进入后续写入 | 理由 | 禁止事项 |
|---|---|---|---|
| 建立方法资产定义 | yes | `MethodAssetDefinition` 是核心 truth,需要显式建立入口。 | 不接收外部正文、旧 P0 content payload、artifact 正文或下游运行状态。 |
| 调整方法资产定义 | yes | 定义语义调整需要显式依据和历史线索,不能由 query 或 view refresh 隐式发生。 | 不直接裁决正式版本语义变化;该判断属于正式化与版本。 |
| 退役方法资产定义 | yes_bounded | `DefinitionRetired` 是 Step 6 状态候选,需要可表达退出当前使用语境。 | 不删除历史引用,不破坏追溯。 |
| 登记目录项 | yes | `MethodAssetCatalogEntry` 是 catalog truth,不能让 catalog view 代替。 | 不把搜索索引、UI 分类或缓存写成目录 truth。 |
| 重分类 / 调整目录范围 | yes | `CatalogEntryScopeLimited` 和 `CatalogScopeRef` 需要显式调整入口。 | 不改变 definition truth,不表达正式消费可用性。 |
| 退役目录项 | yes_bounded | `CatalogEntryRetired` 需要显式退出当前目录语境。 | 不删除定义 truth,不影响历史 trace。 |
| 刷新 catalog view | no_as_command | view refresh 属于后台维护与收敛,不是业务 Command。 | 不把 projection repair 写成业务接口。 |
| 接收外部定义正文 | no | 外部内容必须先在外部摘要与引用形成 safe summary / ref。 | 不保存标准全文、ADR 正文、artifact 正文或网页正文。 |

#### R1.7.4 Query 候选判断

| 候选方向 | 是否进入后续写入 | 读取来源 | 禁止事项 |
|---|---|---|---|
| 获取定义摘要 | yes | `MethodAssetDefinition` 或安全读取材料。 | 不返回完整外部正文、artifact 正文或旧 P0 payload。 |
| 解析定义 ref | yes | definition identity / typed ref 索引。 | 不从 route param、URL、文件路径、marketplace id 或旧类型名拼接 ref。 |
| 获取目录项 | yes | `MethodAssetCatalogEntry` 或 catalog read material。 | 不在读取中创建或重分类目录项。 |
| 列出目录视图 | yes | `MethodAssetCatalogView`。 | 不刷新 view、不修复来源 truth、不暴露搜索实现。 |
| 按目录范围查询定义 | yes | `CatalogScopeRef` + catalog view / catalog material。 | 不把 scope 继承、权限算法或排序算法写入概要。 |
| 查询定义历史线索 | bounded_yes | `MethodAssetDefinitionHistory` 的 body-free summary。 | 不返回 raw audit log、event payload、diff 正文或外部正文。 |

#### R1.7.5 Event / Job 候选判断

| 类别 | 候选方向 | 当前裁决 | 理由 |
|---|---|---|---|
| Inbound Event Consumer | external definition summary available | no_for_this_component | 外部来源应先由 `外部摘要与引用` 处理,本组成部分只消费已接受的 summary / ref。 |
| Inbound Event Consumer | catalog scope changed from external system | no_for_this_component | catalog scope 是本仓目录语义边界,外部语境只能以 safe ref / summary 进入后再显式 Command。 |
| Outbound Event | definition changed | yes_candidate | 定义建立、调整、退役会影响正式化、消费、关系、追溯和外围材料。 |
| Outbound Event | catalog entry changed | yes_candidate | 目录登记、重分类、退役会影响 catalog view、消费发现和外围组织。 |
| Outbound Event | catalog view refreshed | no_here | view refresh event 若需要,应由后台维护与收敛统一裁决。 |
| Operations Job | rebuild catalog view | no_here | 维护入口归 `后台维护与收敛`;本组成部分不写 job 骨架。 |

#### R1.7.6 诊断

- 如果没有定义建立 / 调整 Command,后续正式化只能从 catalog view、外部 summary 或旧 content 名称反推定义,会破坏 Step 6 的 core truth 主语。
- 如果目录登记只作为 projection refresh,`MethodAssetCatalogEntry` 会被 `MethodAssetCatalogView` 取代,形成 read model 第二 truth。
- 如果 definition ref 允许由字符串、URL、route param 或 marketplace id 拼接,后续正式化、消费、关系、追溯都无法保证 stable subject。
- 如果定义调整直接触发正式版本替代,会把 `方法资产定义与目录` 和 `正式化与版本` 混在一起,导致未正式化定义被误用。
- 如果本组成部分直接接收外部正文,会绕过 `外部摘要与引用` 的 no external body 边界,并在详细设计阶段诱发 schema / mapper / evidence 缺口。

#### R1.7.7 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| 是否把 definition 与 catalog 拆成两个组成部分 | no | Step 5 已裁决二者共同构成方法资产定义起点,但接口写入时需分别列 Command / Query。 |
| 是否让 catalog view 参与 Command 写入 | no | catalog view 是 read model,不能成为第二 truth。 |
| 是否直接保留旧 `CreateMethodContentDraft` / `GetMethodContent` | no | 旧 `MethodContent` 主线已禁入,只能后置审计。 |
| 是否允许外部 summary 作为 Command 输入引用 | yes_bounded | 只能使用已被 `外部摘要与引用` 接受的 body-free summary / ref,不得接收正文。 |
| 是否本模块写 Operations Job | no | view refresh 和 material rebuild 归后台维护。 |

#### R1.7.8 下一写入批次结构

| 写入内容 | 要求 |
|---|---|
| Command API 局部骨架 | 写建立 / 调整 / 退役 definition,登记 / 重分类 / 退役 catalog entry 的输入骨架、输出骨架、处理摘要和边界。 |
| Query API 局部骨架 | 写定义摘要、definition ref 解析、目录项读取、目录视图列表、定义历史线索读取。 |
| Outbound Event 候选 | 只写 definition changed / catalog entry changed 的概要候选,不写 topic / payload / outbox。 |
| 本组成部分停审 | 检查对象承接、读写分类、no external body、read model 非 truth、Step 8 可承接性。 |

#### R1.7.9 下一写入批次边界

- 只允许进入 Step 7 `方法资产定义与目录接口:再写入`。
- 不写全仓 Command / Query / Inbound / Outbound / Operations 总表。
- 不写第二个组成部分 `正式化与版本接口:先思考`。
- 不改正式 `02-概要设计.md` §7。
- 不进入 Step 8 / Step 9。
- 不写 HTTP path、RPC method、完整 DTO schema、topic、payload、repository / port、事务、DDL、worker 或配置项。

#### R1.7.10 自检

| 检查项 | 结论 |
|---|---|
| 是否只处理一个组成部分 | pass |
| 是否完成 Command / Query / Event / Job 候选判断 | pass |
| 是否回指 Step 5 / Step 6 对象 | pass |
| 是否避免 catalog view 第二 truth | pass |
| 是否避免旧 `MethodContent` 主线 | pass |
| 是否写完整接口骨架表 | no |
| 是否允许进入方法资产定义与目录接口:再写入 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `方法资产定义与目录接口:再写入`;只写本组成部分的局部 Command / Query / Outbound Event 候选骨架和停审记录,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.8 方法资产定义与目录接口:再写入

#### R1.8.1 Command API 局部骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| EstablishMethodAssetDefinition | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetIdentityKey`;`MethodAssetDefinitionSummary`;可选已接受 `ExternalSourceSummaryRefSet`。 | `MethodAssetDefinitionRef`;definition accepted summary;可选 `MethodAssetDefinitionHistoryRef`。 | 建立本仓拥有的 `MethodAssetDefinition`,形成稳定定义锚点。 | 不接收外部正文、旧 P0 content payload、artifact 正文或下游运行状态;不裁决正式化结果。 |
| AdjustMethodAssetDefinition | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDefinitionRef`;`DefinitionAdjustmentSummary`;可选 `GovernanceBasisRef`。 | `MethodAssetDefinitionRef`;definition adjustment summary;`MethodAssetDefinitionHistoryRef`。 | 对既有定义 truth 记录显式调整线索,保留变化来源。 | 不直接替代正式版本;不由 catalog view 或 query 隐式调整定义。 |
| RetireMethodAssetDefinition | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDefinitionRef`;`DefinitionRetirementReasonRef`。 | `MethodAssetDefinitionRef`;definition retired summary;`MethodAssetDefinitionHistoryRef`。 | 将定义退出当前使用语境,保留历史引用和追溯线索。 | 不删除历史、trace 或已成立正式版本引用;不破坏消费材料追溯。 |
| RegisterMethodAssetCatalogEntry | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDefinitionRef`;`CatalogScopeRef`;`MethodAssetCatalogIdentity`;`CatalogApplicabilitySummary`。 | `MethodAssetCatalogEntryRef`;catalog entry accepted summary。 | 为已成立定义建立目录项、目录范围和适用语境。 | 不创建 definition truth;不写搜索索引、UI 分类、cache 或正式消费可用性。 |
| ReclassifyMethodAssetCatalogEntry | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetCatalogEntryRef`;`CatalogScopeRef`;`CatalogApplicabilitySummary`。 | `MethodAssetCatalogEntryRef`;catalog reclassification summary;可选 `MethodAssetDefinitionHistoryRef`。 | 显式调整目录项范围或适用语境。 | 不改变定义 truth;不表达正式化通过、消费可用或 marketplace 履约。 |
| RetireMethodAssetCatalogEntry | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetCatalogEntryRef`;`CatalogRetirementReasonRef`。 | `MethodAssetCatalogEntryRef`;catalog retired summary。 | 让目录项退出当前目录语境,保留可解释历史。 | 不删除定义 truth;不移除历史 trace;不让目录退役等同定义退役。 |

#### R1.8.2 Query API 局部骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMethodAssetDefinitionSummary | `ActorContext`;`QueryMetadata`;`MethodAssetDefinitionRef`。 | `MethodAssetDefinitionSummary`;definition state hint;safe source summary refs。 | `MethodAssetDefinition` 或安全读取材料。 | 不返回外部正文、artifact 正文、旧 P0 payload 或正式化裁决正文。 |
| ResolveMethodAssetDefinitionRef | `ActorContext`;`QueryMetadata`;definition identity query;可选 `CatalogScopeRef`。 | `MethodAssetDefinitionRef`;resolution summary。 | definition identity index / catalog association。 | 不从 route param、URL、文件路径、marketplace id 或旧类型名拼接 ref。 |
| GetMethodAssetCatalogEntry | `ActorContext`;`QueryMetadata`;`MethodAssetCatalogEntryRef`。 | catalog entry summary;`MethodAssetDefinitionRef`;`CatalogScopeRef`;applicability summary。 | `MethodAssetCatalogEntry` 或 catalog read material。 | 不在读取中创建、重分类、退役目录项;不返回搜索实现。 |
| ListMethodAssetCatalogView | `ActorContext`;`QueryMetadata`;`CatalogScopeRef`;page / filter summary。 | `MethodAssetCatalogView` page;freshness / unavailable hint。 | `MethodAssetCatalogView`。 | 不刷新 view;不修复来源 truth;不暴露索引结构、排序算法或缓存键。 |
| FindMethodAssetDefinitionsByCatalogScope | `ActorContext`;`QueryMetadata`;`CatalogScopeRef`;page / filter summary。 | `MethodAssetDefinitionRef` page;catalog summary page。 | catalog view / catalog read material。 | 不把 scope 继承、权限算法或推荐排序写入概要。 |
| ListMethodAssetDefinitionHistory | `ActorContext`;`QueryMetadata`;`MethodAssetDefinitionRef`;page / filter summary。 | body-free `MethodAssetDefinitionHistory` summary page。 | `MethodAssetDefinitionHistory`。 | 不返回 raw audit log、event payload、definition diff、外部正文或证据正文。 |

#### R1.8.3 Outbound Event 候选

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| MethodAssetDefinitionChanged | definition establish / adjust / retire accepted | `MethodAssetDefinitionRef`;change kind;definition history ref;trace context。 | 正式化与版本、受控消费、追溯与一致性保护、关系与分发语义、后台维护、外围组织。 | 只表达 definition fact changed;不携带定义正文、外部正文、payload schema 或投递策略。 |
| MethodAssetCatalogEntryChanged | catalog register / reclassify / retire accepted | `MethodAssetCatalogEntryRef`;`MethodAssetDefinitionRef`;`CatalogScopeRef`;change kind;trace context。 | catalog view 维护、受控消费发现、外围组织、追溯和维护收敛。 | 只表达 catalog fact changed;不等同 catalog view refreshed,不携带 topic、outbox 或搜索索引信息。 |

#### R1.8.4 本组成部分不定义的接口

| 不定义项 | 原因 | 后续承接 |
|---|---|---|
| Inbound external definition body consumer | 外部正文不得直接进入定义 truth。 | `外部摘要与引用` 先接收 body-free summary / ref,本组成部分 Command 只引用已接受 summary。 |
| CatalogViewRefreshJob | view refresh 是维护收敛动作,不是定义 / 目录业务 Command。 | `后台维护与收敛` 的 read material refresh job。 |
| FormalizeMethodAssetVersion | 正式化结果和正式版本边界不属于本组成部分。 | `正式化与版本`。 |
| PrepareConsumptionMaterial | 正式消费材料和可用性不属于定义 / 目录 truth。 | `受控消费`。 |
| MarketplaceListingCommand | listing、交易、安装、结算属于外围生态或 `L6-marketplace`。 | `外围包与方法集组织` 只保留非履约组织语义。 |

#### R1.8.5 本组成部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只处理方法资产定义与目录 | pass | 未进入正式化、消费、追溯、关系、外部摘要、维护或外围组织的接口写入。 |
| 是否写入局部 Command 骨架 | pass | 仅写 definition 和 catalog truth 相关 Command。 |
| 是否写入局部 Query 骨架 | pass | 仅写 definition、catalog entry、catalog view 和 definition history 读取。 |
| 是否写入 Outbound Event 候选 | pass | 仅写 changed fact 候选,未写 topic / payload / outbox。 |
| 是否避免 Inbound / Job 越界 | pass | 外部输入和 view refresh 分别后移到外部摘要与引用、后台维护与收敛。 |
| 是否承接 Step 6 对象 | pass | 接口输入 / 输出回指 `MethodAssetDefinition`、`MethodAssetCatalogEntry`、typed ref、catalog view 和 definition history。 |
| 是否避免 catalog view 第二 truth | pass | catalog view 只作为 Query 输出,没有 Command 写入。 |
| 是否避免旧 `MethodContent` 主线 | pass | 未恢复旧 draft / publish / get content 接口。 |
| 是否修改正式 §7 | no | 正式回填仍等待回填草稿和审计。 |
| 是否允许进入正式化与版本接口:先思考 | pass | 第一个组成部分局部骨架已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `正式化与版本接口:先思考`;只思考该组成部分的 Command / Query / Inbound / Outbound / Operations 候选、对象承接和禁止事项,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.9 正式化与版本接口:先思考

#### R1.9.1 问题回答

- 本模块只思考 `正式化与版本` 这个组成部分的接口候选,不写完整接口骨架表,不写全仓五类总表,不改正式 `02-概要设计.md` §7。
- 本组成部分的接口第一来源是 Step 5 `5.12` / `5.26.1` 和 Step 6 对象卡片:
  - core truth / state:`FormalMethodAssetVersion`;`FormalizationState`。
  - support summary / basis:`FormalizationBasisSummary`。
  - policy / invariant:`FormalizationEligibilityRule`。
  - typed ref / history:`GovernanceBasisRef`;`FormalizationHistory`。
- 本组成部分需要 Command API。凡是显式发起正式化判断、建立正式版本、表达版本语义变化、退役或替代正式版本、记录正式化状态裁决的入口,都属于写正式化 / 版本 truth 的 Command 候选。
- 本组成部分需要 Query API。凡是读取 formalization state、formal version summary、basis summary、eligibility result、formalization history 或按 definition / catalog 解析当前正式版本的入口,都属于 Query 候选。
- 本组成部分原则上不直接需要 Inbound Event Consumer。治理、标准、ADR、artifact 或 archive 输入必须先由 `外部摘要与引用` 形成 body-free summary / typed ref,本组成部分只引用已接受依据。
- 本组成部分可以提出 Outbound Event 候选。它们只表达 formalization decision / formal version changed / version retired 等已成立事实,供受控消费、追溯、一致性保护、关系分发和维护刷新感知。
- 本组成部分不直接定义 Operations Job。读取材料刷新、basis 可用性复核、trace material rebuild 和 consistency recovery 归 `后台维护与收敛`;维护路径不得创建、覆盖或修复正式版本 truth。

#### R1.9.2 对象承接判断

| Step 6 对象 / 能力 | 对 Step 7 的接口含义 | 当前判断 |
|---|---|---|
| `FormalMethodAssetVersion` | 必须有正式版本建立、显式版本变化、替代 / 退役类 Command,以及正式版本读取 Query。 | 进入本组成部分候选池。 |
| `FormalizationState` | 必须有正式化判断、阻断 / 挂起、正式化完成、状态读取类接口。 | 进入本组成部分候选池。 |
| `FormalizationBasisSummary` | 作为正式化判断输入和读取对象,但它的接收入口不在本组成部分直接消费外部正文。 | 作为 Command 输入 ref / Query 输出摘要。 |
| `FormalizationEligibilityRule` | 支撑资格评估和拒绝隐式正式化触发。 | 作为 Command 评估前置和 Query 诊断输出线索。 |
| `GovernanceBasisRef` | 只能作为已接受治理 / 标准 / ADR 依据引用。 | 作为 typed input / output ref,不得变成治理执行 API。 |
| `FormalizationHistory` | 解释正式化、版本变化、挂起、撤回或替代的 body-free 历史线索。 | 可由 Command 结果产生 history ref,可由 Query 读取摘要。 |

#### R1.9.3 Command 候选判断

| 候选方向 | 是否进入后续写入 | 理由 | 禁止事项 |
|---|---|---|---|
| 评估正式化资格 | yes | `FormalizationEligibilityRule` 需要显式入口判断 definition / catalog / basis 是否满足正式化前提。 | 不执行治理审批,不把读取、引用、同步、运行使用当作触发来源。 |
| 发起正式化判断 | yes | `FormalizationState` 需要由显式意图进入 pending / eligible / blocked / formalized 等状态线索。 | 不由 Query、cache hit、同步成功或下游消费隐式创建状态。 |
| 建立正式版本 | yes | `FormalMethodAssetVersion` 是正式消费前提,必须有明确建立入口。 | 不用 semver、hash、fingerprint、snapshot 或 schema version 替代正式版本边界。 |
| 表达版本语义变化 | yes | 已成立正式版本的语义变化必须显式,避免静默覆盖既有引用。 | 不覆盖原版本 truth,不删除历史引用,不把定义调整直接等同版本变化。 |
| 替代 / 退役正式版本 | yes_bounded | `supersedes_version_ref` 和 retired 状态需要可解释入口。 | 不破坏历史消费、trace、audit 或下游已持有的 typed ref。 |
| 接收正式化依据正文 | no | 外部依据必须先由 `外部摘要与引用` 转成 summary / ref。 | 不保存治理裁决正文、标准全文、ADR 正文、artifact 正文或 evidence 文件。 |
| 刷新正式版本读取材料 | no_as_command | read material refresh 是后台维护动作,不是业务 Command。 | 不让维护 job 修正或创建 formal version truth。 |

#### R1.9.4 Query 候选判断

| 候选方向 | 是否进入后续写入 | 读取来源 | 禁止事项 |
|---|---|---|---|
| 获取正式化状态 | yes | `FormalizationState` 或安全读取材料。 | 不在读取中推进状态,不触发 formalization。 |
| 获取正式版本摘要 | yes | `FormalMethodAssetVersion` 或正式版本读取材料。 | 不返回外部正文、版本算法细节、hash/fingerprint 或存储 snapshot。 |
| 按定义 / 目录解析当前正式版本 | yes | definition ref + catalog context + formal version truth / view。 | 不从 route param、旧 content id、marketplace id 或下游引用拼接 formal version ref。 |
| 读取正式化依据摘要 | yes_bounded | `FormalizationBasisSummary`。 | 不返回治理执行、标准全文、ADR 正文、artifact 正文或证据正文。 |
| 查询正式化资格诊断 | bounded_yes | `FormalizationEligibilityRule` 评估结果和安全原因引用。 | 不暴露完整规则矩阵、组织配置、审批流程或 policy enforce 细节。 |
| 查询正式化历史 | bounded_yes | `FormalizationHistory` / audit-safe history material。 | 不返回 raw audit log、event payload、状态迁移矩阵或外部正文。 |

#### R1.9.5 Event / Job 候选判断

| 类别 | 候选方向 | 当前裁决 | 理由 |
|---|---|---|---|
| Inbound Event Consumer | governance basis accepted | no_for_this_component | 治理 / 外部依据应先由 `外部摘要与引用` 接收并转为 body-free ref。 |
| Inbound Event Consumer | external standard / ADR changed | no_for_this_component | 外部材料变化不是直接正式化触发,只能成为已接受 basis summary 的输入。 |
| Outbound Event | formalization decision changed | yes_candidate | 正式化状态变化影响受控消费、追溯、关系和维护刷新。 |
| Outbound Event | formal version established | yes_candidate | 正式版本成立是消费材料生成和关系 / 分发判断的前提。 |
| Outbound Event | formal version superseded / retired | yes_candidate | 版本替代或退役需要通知追溯、一致性保护和消费材料收敛。 |
| Operations Job | rebuild formal version view | no_here | 读取材料刷新归后台维护与收敛。 |
| Operations Job | re-evaluate stale basis | no_here | basis 可用性复核和引用检查归外部摘要 / 维护收敛,不由本组成部分私自运行。 |

#### R1.9.6 诊断

- 如果没有显式正式化 Command,后续受控消费会被迫从读取命中、同步成功或下游引用反推正式化结果,违反“未正式化不得正式消费”。
- 如果正式版本建立和版本语义变化合并为一个覆盖更新接口,既有 formal version ref 的含义会被静默改写,追溯和一致性保护无法判断影响范围。
- 如果正式化依据直接由本组成部分接收外部正文,会绕过 `外部摘要与引用` 的 body-free 边界,并在详细设计阶段诱发 schema、mapper、evidence 存储缺口。
- 如果 eligibility 只作为配置或隐藏规则存在,正式化被拒绝、挂起或阻断时无法形成安全诊断输出,Step 9 状态机也会缺少状态原因来源。
- 如果 formalization history 被写成 raw audit 或 event log 查询,它会替代追溯与一致性保护的材料组织职责,并暴露外部执行细节。

#### R1.9.7 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| 是否把正式化资格评估写成独立 Command | yes | 它是进入正式化状态判断的显式前置,并能拒绝隐式触发来源。 |
| 是否把正式版本建立和版本语义变化拆开 | yes | 建立新正式版本与替代既有正式版本的影响不同,必须保留显式变化线索。 |
| 是否直接接收 governance / standard / ADR 正文 | no | 正文边界由 `外部摘要与引用` 统一处理,本组成部分只引用已接受 summary / ref。 |
| 是否定义 formal version view refresh job | no | 派生材料刷新属于后台维护,不能变成创建 / 修复正式版本的业务入口。 |
| 是否在本模块固定版本号算法 | no | 概要阶段只固定正式版本语义边界,不选择 semver、hash、fingerprint 或 snapshot 机制。 |
| 是否提供正式化历史读取 | yes_bounded | 只读 body-free history summary,不暴露 raw log、event payload、治理执行或外部正文。 |

#### R1.9.8 下一写入批次结构

| 写入内容 | 要求 |
|---|---|
| Command API 局部骨架 | 写资格评估、发起正式化、建立正式版本、表达版本变化、替代 / 退役正式版本的输入骨架、输出骨架、处理摘要和边界。 |
| Query API 局部骨架 | 写正式化状态、正式版本摘要、当前正式版本解析、依据摘要、eligibility 诊断和正式化历史读取。 |
| Outbound Event 候选 | 只写 formalization decision changed、formal version established、formal version changed / retired 等概要候选,不写 topic / payload / outbox。 |
| 本组成部分停审 | 检查显式触发、body-free basis、版本稳定边界、read material 非 truth、Step 8 / Step 9 可承接性。 |

#### R1.9.9 下一写入批次边界

- 只允许进入 Step 7 `正式化与版本接口:再写入`。
- 不写全仓 Command / Query / Inbound / Outbound / Operations 总表。
- 不写第三个组成部分 `受控消费接口:先思考`。
- 不改正式 `02-概要设计.md` §7。
- 不进入 Step 8 / Step 9。
- 不写 HTTP path、RPC method、完整 DTO schema、topic、payload、repository / port、事务、DDL、worker、配置项、版本号算法或状态迁移矩阵。

#### R1.9.10 自检

| 检查项 | 结论 |
|---|---|
| 是否只处理一个组成部分 | pass |
| 是否完成 Command / Query / Event / Job 候选判断 | pass |
| 是否回指 Step 5 / Step 6 对象 | pass |
| 是否避免隐式正式化 | pass |
| 是否避免外部正文和治理执行入仓 | pass |
| 是否避免版本算法 / fingerprint / snapshot 回流 | pass |
| 是否写完整接口骨架表 | no |
| 是否允许进入正式化与版本接口:再写入 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `正式化与版本接口:再写入`;只写本组成部分的局部 Command / Query / Outbound Event 候选骨架和停审记录,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.10 正式化与版本接口:再写入

#### R1.10.1 Command API 局部骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| EvaluateMethodAssetFormalizationEligibility | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDefinitionRef`;`MethodAssetCatalogEntryRef`;`FormalizationBasisSummaryRefSet`;`FormalizationEligibilityRuleRef`。 | eligibility decision summary;可选 `FormalizationStateRef`;安全 rejection reason ref。 | 显式评估定义、目录语境和依据摘要是否满足正式化前置条件。 | 不执行治理审批;不读取下游运行状态;不把 query、sync、cache hit 或 runtime use 当作触发。 |
| InitiateMethodAssetFormalization | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDefinitionRef`;`MethodAssetCatalogEntryRef`;`FormalizationTriggerSummary`;`FormalizationBasisSummaryRefSet`。 | `FormalizationStateRef`;formalization accepted / blocked summary;可选 `FormalizationHistoryRef`。 | 以显式意图让定义进入正式化判断,形成可追溯状态线索。 | 不创建正式版本;不接收外部正文、治理执行正文或 artifact 正文。 |
| EstablishFormalMethodAssetVersion | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`FormalizationStateRef`;`MethodAssetDefinitionRef`;`MethodAssetCatalogEntryRef`;`FormalVersionBoundarySummary`。 | `FormalMethodAssetVersionRef`;formal version established summary;`FormalizationHistoryRef`。 | 在正式化状态闭合后建立稳定正式版本边界。 | 不选择版本号算法;不使用 hash / fingerprint / snapshot 替代正式版本语义。 |
| RecordFormalVersionSemanticChange | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`FormalMethodAssetVersionRef`;`VersionSemanticChangeSummary`;可选 `GovernanceBasisRef`。 | next formal version candidate / ref summary;`FormalizationHistoryRef`。 | 显式记录既有正式版本语义变化,为后续替代或新版本建立提供依据。 | 不覆盖原 formal version truth;不删除历史引用;不把 definition adjustment 直接等同版本变化。 |
| SupersedeFormalMethodAssetVersion | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;previous `FormalMethodAssetVersionRef`;next `FormalMethodAssetVersionRef`;`VersionSupersessionReasonRef`。 | supersession summary;previous / next formal version refs;`FormalizationHistoryRef`。 | 用后续正式版本显式替代既有版本,保持引用和追溯可解释。 | 不让旧 ref 含义漂移;不重写下游已持有引用。 |
| RetireFormalMethodAssetVersion | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`FormalMethodAssetVersionRef`;`VersionRetirementReasonRef`。 | retired formal version summary;`FormalizationHistoryRef`。 | 让正式版本退出当前使用语境,保留历史和追溯线索。 | 不删除 formal version truth、消费历史、trace 或 audit 线索。 |

#### R1.10.2 Query API 局部骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetFormalizationState | `ActorContext`;`QueryMetadata`;`FormalizationStateRef` 或 `MethodAssetDefinitionRef` + `MethodAssetCatalogEntryRef`。 | formalization state summary;state reason summary;basis refs。 | `FormalizationState` 或安全读取材料。 | 不推进状态;不触发正式化;不返回治理执行正文。 |
| GetFormalMethodAssetVersionSummary | `ActorContext`;`QueryMetadata`;`FormalMethodAssetVersionRef`。 | formal version summary;definition ref;catalog entry ref;boundary summary;basis summary refs。 | `FormalMethodAssetVersion` 或正式版本读取材料。 | 不返回外部正文、版本算法细节、fingerprint、snapshot 或存储结构。 |
| ResolveCurrentFormalMethodAssetVersion | `ActorContext`;`QueryMetadata`;`MethodAssetDefinitionRef`;可选 `MethodAssetCatalogEntryRef` / `CatalogScopeRef`。 | current `FormalMethodAssetVersionRef`;resolution summary;freshness / unavailable hint。 | formal version truth / read material。 | 不从 route param、旧 content id、marketplace id 或下游引用拼接 ref。 |
| GetFormalizationBasisSummary | `ActorContext`;`QueryMetadata`;`FormalizationBasisSummaryRef`。 | basis summary;basis kind;external summary refs;governance basis refs;applicability summary。 | `FormalizationBasisSummary`。 | 不返回治理审批流、标准全文、ADR 正文、artifact 正文、archive 包或证据正文。 |
| GetFormalizationEligibilityDiagnostic | `ActorContext`;`QueryMetadata`;`MethodAssetDefinitionRef`;`MethodAssetCatalogEntryRef`;可选 `FormalizationBasisSummaryRefSet`。 | eligibility diagnostic summary;safe rejection / pending reason refs。 | `FormalizationEligibilityRule` 评估输出和状态原因。 | 不暴露完整规则矩阵、组织配置、policy enforce 细节或审批过程。 |
| ListFormalizationHistory | `ActorContext`;`QueryMetadata`;`MethodAssetDefinitionRef` 或 `FormalMethodAssetVersionRef`;page / filter summary。 | body-free formalization history summary page。 | `FormalizationHistory` / audit-safe history material。 | 不返回 raw audit log、event payload、状态迁移矩阵、治理执行或外部正文。 |

#### R1.10.3 Outbound Event 候选

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| MethodAssetFormalizationDecisionChanged | eligibility evaluation / formalization initiation accepted | `FormalizationStateRef`;`MethodAssetDefinitionRef`;decision kind;basis refs;trace context。 | 受控消费、追溯与一致性保护、关系与分发语义、后台维护。 | 只表达 formalization decision fact;不携带治理执行、审批过程或外部正文。 |
| FormalMethodAssetVersionEstablished | formal version establishment accepted | `FormalMethodAssetVersionRef`;`MethodAssetDefinitionRef`;`MethodAssetCatalogEntryRef`;boundary summary ref;trace context。 | 受控消费材料、关系 / 分发判断、追溯材料、外围组织、维护刷新。 | 不携带完整版本算法、payload schema、topic 或 outbox 策略。 |
| FormalMethodAssetVersionChanged | semantic change / supersession accepted | previous / next `FormalMethodAssetVersionRef`;change kind;history ref;trace context。 | 追溯与一致性保护、受控消费、关系分发、后台维护。 | 不覆盖旧版本含义;不声明下游影响已处理。 |
| FormalMethodAssetVersionRetired | formal version retirement accepted | `FormalMethodAssetVersionRef`;retirement reason ref;history ref;trace context。 | 受控消费、追溯与一致性保护、外围组织、维护刷新。 | 不删除历史引用,不强制下游状态迁移。 |

#### R1.10.4 本组成部分不定义的接口

| 不定义项 | 原因 | 后续承接 |
|---|---|---|
| Inbound governance / standard / ADR body consumer | 外部依据正文不得直接进入正式化与版本 truth。 | `外部摘要与引用` 先接收 body-free summary / ref。 |
| FormalVersionViewRefreshJob | 正式版本读取材料刷新是维护动作。 | `后台维护与收敛` 的 read material refresh job。 |
| ReEvaluateExternalBasisAvailabilityJob | basis 可用性复核和外部引用检查不应由正式化组件私自执行。 | `外部摘要与引用` 与 `后台维护与收敛`。 |
| PrepareMethodAssetConsumptionMaterial | 消费材料和可用性判断不属于 formal version truth。 | `受控消费`。 |
| ExplainFormalVersionConsumptionImpact | 下游影响归因和一致性保护不属于正式版本建立接口。 | `追溯与一致性保护`。 |
| RecalculateVersionFingerprint | 旧 fingerprint / snapshot 主线不作为正式版本语义来源。 | 后续若需要,只能作为维护一致性检查候选重新讨论。 |

#### R1.10.5 本组成部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只处理正式化与版本 | pass | 未进入受控消费、追溯、关系、外部摘要、维护或外围组织的接口写入。 |
| 是否写入局部 Command 骨架 | pass | 覆盖 eligibility、formalization、formal version establish、semantic change、supersede、retire。 |
| 是否写入局部 Query 骨架 | pass | 覆盖 state、version summary、current version resolve、basis summary、diagnostic 和 history。 |
| 是否写入 Outbound Event 候选 | pass | 只写已成立事实候选,未写 topic / payload / outbox。 |
| 是否避免 Inbound / Job 越界 | pass | 外部依据输入和读取材料刷新分别后移到外部摘要与引用、后台维护与收敛。 |
| 是否承接 Step 6 对象 | pass | 输入 / 输出回指 `FormalMethodAssetVersion`、`FormalizationState`、`FormalizationBasisSummary`、`FormalizationEligibilityRule`、`GovernanceBasisRef`、`FormalizationHistory`。 |
| 是否避免隐式正式化 | pass | 明确拒绝 query、sync、cache hit、runtime use 触发正式化或版本建立。 |
| 是否避免旧 publish / fingerprint / snapshot 主线 | pass | 未恢复旧 `PublishMethodContent`、fingerprint、snapshot 或旧 P0 content 接口。 |
| 是否修改正式 §7 | no | 正式回填仍等待回填草稿和审计。 |
| 是否允许进入受控消费接口:先思考 | pass | 第二个组成部分局部骨架已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `受控消费接口:先思考`;只思考该组成部分的 Command / Query / Inbound / Outbound / Operations 候选、对象承接和禁止事项,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.11 受控消费接口:先思考

#### R1.11.1 问题回答

- 本模块只思考 `受控消费` 这个组成部分的接口候选,不写完整接口骨架表,不写全仓五类总表,不改正式 `02-概要设计.md` §7。
- 本组成部分的接口第一来源是 Step 5 `5.14` / `5.26.1` 和 Step 6 对象卡片:
  - read material / boundary:`MethodAssetConsumptionMaterial`。
  - availability view:`MethodAssetAvailabilityView`。
  - boundary object:`DownstreamConsumptionBoundary`。
  - guard:`DefinitionUseBoundaryGuard`。
  - typed ref:`ConsumptionContextRef`。
- 本组成部分需要 Command API。凡是显式建立 / 调整消费边界、准备消费材料、标记消费材料 stale / blocked / unavailable、记录 Definition vs Use 越界线索的入口,都属于受控消费写入或边界裁决候选。
- 本组成部分需要 Query API。凡是读取消费材料、可用性视图、消费边界、消费语境和 guard 诊断的入口,都属于 Query 候选。
- 本组成部分原则上不直接需要 Inbound Event Consumer。正式版本变化、定义变化或关系分发变化先作为本仓已成立事实进入后续总表判断;小循环阶段不把外部下游运行事件写成受控消费 consumer。
- 本组成部分可以提出 Outbound Event 候选。它们只表达 consumption material prepared / availability changed / boundary changed / guard violation noticed 等本仓可解释事实。
- 本组成部分不直接定义 Operations Job。消费材料刷新、availability projection rebuild、stale 收敛和 recovery 归 `后台维护与收敛`;本组成部分只保留业务入口和读取边界。

#### R1.11.2 对象承接判断

| Step 6 对象 / 能力 | 对 Step 7 的接口含义 | 当前判断 |
|---|---|---|
| `MethodAssetConsumptionMaterial` | 必须有显式准备 / 阻断 / stale 标记类 Command,以及消费材料读取 Query。 | 进入本组成部分候选池。 |
| `MethodAssetAvailabilityView` | 必须有可用性读取 Query;其刷新和重建不作为业务 Command。 | 进入 Query 候选,Job 后移。 |
| `DownstreamConsumptionBoundary` | 必须有边界登记 / 调整 / 限制类 Command,以及边界读取 Query。 | 进入本组成部分候选池。 |
| `DefinitionUseBoundaryGuard` | 必须有 guard 诊断和越界线索记录,用于保护 Definition vs Use。 | 进入 Command / Query 候选池。 |
| `ConsumptionContextRef` | 所有消费材料、availability 和 boundary 都必须锚定 typed consumption context。 | 作为输入 / 输出骨架核心 ref。 |
| `FormalMethodAssetVersionRef` | 消费材料必须锚定正式版本,但不改变正式版本 truth。 | 作为前置输入 ref,不属于本组成部分 truth。 |

#### R1.11.3 Command 候选判断

| 候选方向 | 是否进入后续写入 | 理由 | 禁止事项 |
|---|---|---|---|
| 登记下游消费边界 | yes | `DownstreamConsumptionBoundary` 是 Definition vs Use 的边界对象,不能由下游私有约定替代。 | 不写成鉴权实现、权限矩阵、token scope 或 policy engine。 |
| 调整 / 限制消费边界 | yes | 消费语境、允许 use kind 或禁止 write kind 变化需要显式边界调整。 | 不修改正式版本 truth,不反写下游运行状态。 |
| 准备正式消费材料 | yes | `MethodAssetConsumptionMaterial` 需要显式入口从 formal version + boundary 派生只读材料。 | 不复制定义正文,不保存下游运行 truth,不触发正式化。 |
| 标记消费材料 stale / blocked / unavailable | yes_bounded | 来源正式版本、定义或边界变化时需要可解释状态线索。 | 不由此修复 formal version truth,不启动维护刷新算法。 |
| 记录 Definition vs Use 越界线索 | yes_bounded | `DefinitionUseBoundaryGuard` 需要承接下游反写、私有定义或越界使用的 body-free marker。 | 不保存原始请求正文、下游运行正文或证据正文。 |
| 接收下游运行状态 | no | 受控消费不拥有 process / identity / runtime / member-images 的运行 truth。 | 不写 consumer 直接同步执行实例、成员状态、runtime binding 或 image state。 |
| 刷新 availability view | no_as_command | availability refresh 是后台维护 / projection 收敛,不是业务 Command。 | 不把 projection repair 写成消费业务接口。 |

#### R1.11.4 Query 候选判断

| 候选方向 | 是否进入后续写入 | 读取来源 | 禁止事项 |
|---|---|---|---|
| 获取消费材料 | yes | `MethodAssetConsumptionMaterial`。 | 不返回定义正文、外部正文、下游运行状态或旧 snapshot 包。 |
| 查询消费材料可用性 | yes | `MethodAssetAvailabilityView`。 | 不刷新 view、不改变来源 truth、不把 cache hit 当正式消费成立。 |
| 解析消费语境 | yes | `ConsumptionContextRef` / boundary association。 | 不从下游字符串、route param、运行实例 id 或 UI session 拼接 context ref。 |
| 获取下游消费边界 | yes | `DownstreamConsumptionBoundary`。 | 不暴露鉴权实现、权限矩阵、token、组织配置或策略引擎细节。 |
| 获取 Definition vs Use guard 诊断 | bounded_yes | `DefinitionUseBoundaryGuard` 和安全 violation reason。 | 不返回原始请求正文、下游私有 payload、raw log 或证据正文。 |
| 列出某正式版本可消费语境 | bounded_yes | formal version ref + consumption boundary / availability view。 | 不让读取结果创建消费材料或扩大消费边界。 |

#### R1.11.5 Event / Job 候选判断

| 类别 | 候选方向 | 当前裁决 | 理由 |
|---|---|---|---|
| Inbound Event Consumer | downstream runtime used method asset | no | 下游运行使用不是本仓 truth,不能触发正式化或消费边界变化。 |
| Inbound Event Consumer | formal version established event | no_for_this_component_loop | 这是同仓组成部分间事实;是否需要内部 consumer 留到五类总表合并时判断。 |
| Inbound Event Consumer | external consumer scope changed | no_for_this_component | 外部 scope 应先形成 typed summary / ref,不能直接改消费边界。 |
| Outbound Event | consumption material prepared | yes_candidate | 消费材料准备会影响下游读取、追溯材料和维护刷新。 |
| Outbound Event | consumption availability changed | yes_candidate | 可用性变化需要被消费方、追溯和维护感知。 |
| Outbound Event | consumption boundary changed | yes_candidate | 边界变化影响材料可用性、关系 / 分发语境和一致性保护。 |
| Outbound Event | definition-use violation noticed | yes_candidate | 越界线索应供追溯和一致性保护承接。 |
| Operations Job | rebuild consumption material | no_here | 刷新 / 重建归后台维护与收敛。 |
| Operations Job | repair availability projection | no_here | projection repair 归后台维护与收敛。 |

#### R1.11.6 诊断

- 如果没有消费边界登记 / 调整入口,下游会用私有字符串、SDK 约定或运行状态解释消费语境,导致 `ConsumptionContextRef` 失效。
- 如果消费材料准备被写成读取副作用,Query 会变成隐式写入,同时可能让读取命中被误解为正式消费成立。
- 如果 availability view 可由业务 Command 直接刷新,它会被误当成正式版本或消费材料 truth,破坏 read model 非 truth 边界。
- 如果受控消费直接接收下游运行事件,本仓会开始保存 process、identity、runtime 或 member-images 的运行 truth,违反数据所有权。
- 如果 guard 诊断返回原始请求或证据正文,会绕过 body-free 追溯边界,并在详细设计阶段诱发 schema / evidence 存储缺口。

#### R1.11.7 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| 是否把消费边界作为 Command 管理对象 | yes | `DownstreamConsumptionBoundary` 是本仓控制下游消费语义的正式边界,不能只做配置或下游约定。 |
| 是否把消费材料准备作为业务 Command | yes_bounded | 它会形成可读取材料,但必须锚定 formal version + boundary,不得复制定义正文或触发正式化。 |
| 是否把 availability refresh 写成本组成部分 Command | no | 这是 projection / maintenance 收敛,不应混入业务消费接口。 |
| 是否需要读取消费语境解析接口 | yes | 后续下游消费方必须使用 typed context ref,不能用私有字符串。 |
| 是否直接接受下游运行状态事件 | no | 下游运行状态不归本仓,最多以后由追溯 / 外部摘要承接 body-free impact summary。 |
| 是否提供 Definition vs Use guard 诊断 | yes_bounded | 只输出安全 violation / reason ref,不暴露 raw request、payload 或证据正文。 |

#### R1.11.8 下一写入批次结构

| 写入内容 | 要求 |
|---|---|
| Command API 局部骨架 | 写消费边界登记 / 调整、消费材料准备、材料 stale / blocked / unavailable 标记、guard violation 记录。 |
| Query API 局部骨架 | 写消费材料读取、availability 查询、消费语境解析、消费边界读取、guard 诊断和可消费语境列表。 |
| Outbound Event 候选 | 只写 consumption material prepared、availability changed、boundary changed、definition-use violation noticed 概要候选,不写 topic / payload / outbox。 |
| 本组成部分停审 | 检查 formal version 只读前提、Definition vs Use、read model 非 truth、no downstream runtime truth、维护刷新后移。 |

#### R1.11.9 下一写入批次边界

- 只允许进入 Step 7 `受控消费接口:再写入`。
- 不写全仓 Command / Query / Inbound / Outbound / Operations 总表。
- 不写第四个组成部分 `追溯与一致性保护接口:先思考`。
- 不改正式 `02-概要设计.md` §7。
- 不进入 Step 8 / Step 9。
- 不写 HTTP path、RPC method、完整 DTO schema、topic、payload、repository / port、事务、DDL、worker、配置项、鉴权实现、权限矩阵或状态迁移矩阵。

#### R1.11.10 自检

| 检查项 | 结论 |
|---|---|
| 是否只处理一个组成部分 | pass |
| 是否完成 Command / Query / Event / Job 候选判断 | pass |
| 是否回指 Step 5 / Step 6 对象 | pass |
| 是否避免下游运行 truth 入仓 | pass |
| 是否避免读取副作用和隐式正式化 | pass |
| 是否避免 availability view 第二 truth | pass |
| 是否写完整接口骨架表 | no |
| 是否允许进入受控消费接口:再写入 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `受控消费接口:再写入`;只写本组成部分的局部 Command / Query / Outbound Event 候选骨架和停审记录,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.12 受控消费接口:再写入

#### R1.12.1 Command API 局部骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| RegisterDownstreamConsumptionBoundary | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ConsumptionContextRef`;`FormalVersionRequirement`;allowed use summary;forbidden write summary。 | `DownstreamConsumptionBoundaryRef`;boundary accepted summary。 | 为指定消费语境建立正式下游消费边界。 | 不写鉴权实现、权限矩阵、token scope、policy engine 或下游运行状态。 |
| AdjustDownstreamConsumptionBoundary | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`DownstreamConsumptionBoundaryRef`;boundary adjustment summary;`ConsumptionBoundaryReasonRef`。 | `DownstreamConsumptionBoundaryRef`;boundary adjusted summary。 | 显式调整消费语境、允许使用类别或禁止反写边界。 | 不修改 formal version truth;不反写 process / identity / runtime / member-images 状态。 |
| PrepareMethodAssetConsumptionMaterial | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`FormalMethodAssetVersionRef`;`MethodAssetDefinitionRef`;`ConsumptionContextRef`;`DownstreamConsumptionBoundaryRef`。 | `MethodAssetConsumptionMaterialRef`;material prepared summary;可选 availability hint。 | 从正式版本和消费边界派生只读正式消费材料。 | 不复制定义正文;不保存下游运行 truth;不触发正式化;不生成旧 snapshot 包。 |
| MarkMethodAssetConsumptionMaterialState | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetConsumptionMaterialRef`;state marker summary;safe reason ref。 | material state summary;可选 availability view hint。 | 标记材料 stale / blocked / unavailable 等可解释状态线索。 | 不修复来源 truth;不启动维护刷新算法;不扩大消费边界。 |
| RecordDefinitionUseBoundaryViolation | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`DefinitionUseBoundaryGuardRef`;`DefinitionUseViolationRef`;safe violation summary。 | guard violation accepted summary;可选 trace subject ref。 | 记录下游反写、私有定义或越界使用的 body-free 线索。 | 不保存原始请求正文、下游 payload、运行状态或证据正文。 |

#### R1.12.2 Query API 局部骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMethodAssetConsumptionMaterial | `ActorContext`;`QueryMetadata`;`MethodAssetConsumptionMaterialRef`。 | consumption material summary;formal version ref;definition ref;context ref;boundary ref。 | `MethodAssetConsumptionMaterial`。 | 不返回定义正文、外部正文、下游运行状态、旧 snapshot 包或授权矩阵。 |
| GetMethodAssetAvailabilityView | `ActorContext`;`QueryMetadata`;`FormalMethodAssetVersionRef`;`ConsumptionContextRef`。 | availability summary;state hint;source material ref;freshness / unavailable reason。 | `MethodAssetAvailabilityView`。 | 不刷新 view;不改变来源 truth;不把 cache hit 当正式消费成立。 |
| ResolveConsumptionContextRef | `ActorContext`;`QueryMetadata`;consumer kind;consumer scope ref;可选 boundary ref。 | `ConsumptionContextRef`;context resolution summary。 | `ConsumptionContextRef` / boundary association。 | 不从 route param、运行实例 id、UI session 或下游私有字符串拼接 context ref。 |
| GetDownstreamConsumptionBoundary | `ActorContext`;`QueryMetadata`;`DownstreamConsumptionBoundaryRef` 或 `ConsumptionContextRef`。 | boundary summary;formal version requirement;allowed use summary;forbidden write summary。 | `DownstreamConsumptionBoundary`。 | 不暴露鉴权实现、权限矩阵、token、组织配置或策略引擎细节。 |
| GetDefinitionUseBoundaryDiagnostic | `ActorContext`;`QueryMetadata`;`DefinitionUseBoundaryGuardRef` 或 material / context refs。 | guard diagnostic summary;safe violation / reason refs。 | `DefinitionUseBoundaryGuard` 和安全 violation summary。 | 不返回原始请求正文、下游私有 payload、raw log 或证据正文。 |
| ListConsumableContextsForFormalVersion | `ActorContext`;`QueryMetadata`;`FormalMethodAssetVersionRef`;page / filter summary。 | consumption context page;boundary refs;availability hints。 | consumption boundary / availability view。 | 不创建消费材料;不扩大消费边界;不声明下游已同步或已运行。 |

#### R1.12.3 Outbound Event 候选

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| MethodAssetConsumptionMaterialPrepared | consumption material preparation accepted | `MethodAssetConsumptionMaterialRef`;`FormalMethodAssetVersionRef`;`ConsumptionContextRef`;boundary ref;trace context。 | 下游消费方、追溯与一致性保护、后台维护、外围组织。 | 只表达材料已准备;不携带材料正文、定义正文、topic / payload schema 或投递策略。 |
| MethodAssetConsumptionAvailabilityChanged | material state marker / availability derivation changed | `FormalMethodAssetVersionRef`;`ConsumptionContextRef`;availability state hint;safe reason ref。 | 下游消费方、追溯与一致性保护、后台维护。 | 不等同下游同步成功;不改变 formal version truth。 |
| DownstreamConsumptionBoundaryChanged | boundary register / adjust accepted | `DownstreamConsumptionBoundaryRef`;`ConsumptionContextRef`;change kind;trace context。 | 受控消费读取、关系与分发语义、追溯与一致性保护、后台维护。 | 不携带权限矩阵、鉴权配置或下游状态。 |
| DefinitionUseBoundaryViolationNoticed | guard violation accepted | `DefinitionUseBoundaryGuardRef`;`DefinitionUseViolationRef`;safe reason ref;trace context。 | 追溯与一致性保护、后台维护、审计材料。 | 不携带原始请求、下游 payload、证据正文或 raw log。 |

#### R1.12.4 本组成部分不定义的接口

| 不定义项 | 原因 | 后续承接 |
|---|---|---|
| DownstreamRuntimeUsageConsumer | 下游运行使用不是本仓 truth,不能反向改变消费边界。 | 需要时由追溯 / 外部摘要承接 body-free impact summary。 |
| ConsumptionMaterialRefreshJob | 材料刷新和 stale 收敛是维护动作。 | `后台维护与收敛`。 |
| AvailabilityProjectionRepairJob | availability view repair 是 projection 维护。 | `后台维护与收敛`。 |
| ExplainConsumptionImpact | 影响解释和一致性保护不属于受控消费材料接口。 | `追溯与一致性保护`。 |
| AuthenticateConsumer | 登录、token、角色、权限矩阵不是概要受控消费语义。 | 详细设计 / 配置设计按统一安全口径处理。 |
| ReplicateDefinitionSnapshot | 消费材料不是定义正文副本或旧 snapshot。 | 禁止恢复旧 snapshot / content package 主线。 |

#### R1.12.5 本组成部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只处理受控消费 | pass | 未进入追溯、关系、外部摘要、维护或外围组织接口写入。 |
| 是否写入局部 Command 骨架 | pass | 覆盖 boundary register / adjust、material prepare、material state marker、guard violation record。 |
| 是否写入局部 Query 骨架 | pass | 覆盖 material、availability、context、boundary、guard diagnostic、consumable contexts。 |
| 是否写入 Outbound Event 候选 | pass | 只写已成立事实候选,未写 topic / payload / outbox。 |
| 是否避免 Inbound / Job 越界 | pass | 下游运行事件、材料刷新和 projection repair 均未作为本组成部分接口。 |
| 是否承接 Step 6 对象 | pass | 输入 / 输出回指 `MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`、`DefinitionUseBoundaryGuard`、`ConsumptionContextRef`。 |
| 是否避免下游运行 truth 入仓 | pass | 未保存 process、identity、runtime、member-images、UI 或 marketplace 运行状态。 |
| 是否避免读取副作用和隐式正式化 | pass | Query 不创建材料、不推进正式化、不扩大边界。 |
| 是否避免旧 snapshot / content package 主线 | pass | 未恢复 definition snapshot、sync package 或旧 P0 content 接口。 |
| 是否修改正式 §7 | no | 正式回填仍等待回填草稿和审计。 |
| 是否允许进入追溯与一致性保护接口:先思考 | pass | 第三个组成部分局部骨架已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `追溯与一致性保护接口:先思考`;只思考该组成部分的 Command / Query / Inbound / Outbound / Operations 候选、对象承接和禁止事项,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.13 追溯与一致性保护接口:先思考

#### R1.13.1 问题回答

- 本模块只思考 `追溯与一致性保护` 这个组成部分的接口候选,不写完整接口骨架表,不写全仓五类总表,不改正式 `02-概要设计.md` §7。
- 本组成部分的接口第一来源是 Step 5 `5.16` / `5.26.1` 和 Step 6 对象卡片:
  - trace material:`MethodAssetTraceMaterial`。
  - impact summary:`ConsumptionImpactSummary`。
  - policy / guard:`ConsistencyProtectionPolicy`。
  - audit / lineage:`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage`。
  - typed ref:`TraceSubjectRef`;`ConsumptionImpactSourceRef`。
- 本组成部分需要 Command API。凡是组织追溯材料、登记影响摘要、建立一致性保护判断、记录 safe audit / evidence lineage 的入口,都属于写追溯 / 影响 / 审计材料的 Command 候选。
- 本组成部分需要 Query API。凡是读取 trace material、impact summary、protection diagnostic、audit trail、evidence lineage、trace subject 的入口,都属于 Query 候选。
- 本组成部分原则上不直接需要 Inbound Event Consumer。下游影响或外部证据输入必须先成为 body-free summary / ref / marker;是否需要 consumer 留到五类总表合并,本小循环不接收 raw log、下游运行事件或证据正文。
- 本组成部分可以提出 Outbound Event 候选。它们只表达 trace material prepared、impact summary changed、protection decision changed、audit / lineage material changed 等本仓可解释事实。
- 本组成部分不直接定义 Operations Job。trace material refresh、impact material rebuild、audit view rebuild 和 consistency recovery 归 `后台维护与收敛`;本组成部分只定义业务语义入口和读取边界。

#### R1.13.2 对象承接判断

| Step 6 对象 / 能力 | 对 Step 7 的接口含义 | 当前判断 |
|---|---|---|
| `MethodAssetTraceMaterial` | 必须有组织 / 标记 stale / incomplete 类 Command,以及追溯材料读取 Query。 | 进入本组成部分候选池。 |
| `ConsumptionImpactSummary` | 必须有影响摘要登记 / unknown / supersede 类 Command,以及影响摘要读取 Query。 | 进入本组成部分候选池。 |
| `ConsistencyProtectionPolicy` | 必须有保护判断 / unknown impact 待承接 / 显式变化保护类接口。 | 进入 Command / Query 候选池。 |
| `MethodAssetAuditTrail` | 必须有 safe audit material 组织和审计轨迹读取接口。 | 进入本组成部分候选池。 |
| `MethodAssetEvidenceLineage` | 作为 evidence refs 和 artifact refs 的 lineage 线索,可由 Command 关联、由 Query 读取。 | 进入 bounded 候选池。 |
| `TraceSubjectRef` | 所有 trace / audit / lineage 必须锚定稳定 subject。 | 作为输入 / 输出骨架核心 ref。 |
| `ConsumptionImpactSourceRef` | impact summary 必须回指正式影响来源,不得用 free-form 文本。 | 作为 impact 输入 / 输出核心 ref。 |

#### R1.13.3 Command 候选判断

| 候选方向 | 是否进入后续写入 | 理由 | 禁止事项 |
|---|---|---|---|
| 组织方法资产追溯材料 | yes | `MethodAssetTraceMaterial` 需要从正式版本、消费材料、关系或外部摘要形成 body-free trace material。 | 不保存 raw log、trace span、event payload、外部正文或证据正文。 |
| 标记追溯材料 stale / incomplete / unavailable | yes_bounded | 来源变化或线索缺失时需要可解释状态线索。 | 不修复 definition / formal version / consumption truth,不启动刷新 job。 |
| 登记消费影响摘要 | yes | `ConsumptionImpactSummary` 需要承接正式版本变化、边界变化或关系变化的影响线索。 | 不扫描下游运行状态,不保存下游 payload 或执行结果正文。 |
| 标记影响 unknown / pending downstream summary | yes_bounded | 影响不可判定时必须显式保留 unknown / pending,不能默认为无影响。 | 不阻塞已成立核心 truth,不要求同步等待所有下游。 |
| 建立一致性保护判断 | yes | `ConsistencyProtectionPolicy` 需要明确哪些版本变化和既有消费需要保护。 | 不定义恢复算法、告警规则、job 调度或重试策略。 |
| 组织 safe audit trail | yes_bounded | `MethodAssetAuditTrail` 需要把 history refs、trace subject 和 evidence lineage 串成安全审计材料。 | 不保存 raw audit log、report body、event body 或 telemetry。 |
| 关联 evidence lineage | yes_bounded | evidence refs / artifact archive refs 需要可追溯 lineage,但只能保存 ref / marker / digest。 | 不保存 artifact 包体、证据文件正文、验收报告正文或标准全文。 |
| 执行一致性恢复 | no_as_command | 恢复收敛是后台维护 / recovery 语义。 | 不在本组件写 recovery job、worker、调度或自动修复流程。 |

#### R1.13.4 Query 候选判断

| 候选方向 | 是否进入后续写入 | 读取来源 | 禁止事项 |
|---|---|---|---|
| 获取追溯材料 | yes | `MethodAssetTraceMaterial` / trace view。 | 不返回 raw log、event payload、外部正文、证据正文或 handler report body。 |
| 按追溯主体读取 trace | yes | `TraceSubjectRef` + trace material。 | 不从字符串、旧对象名、artifact path 或下游 id 反推 subject。 |
| 获取消费影响摘要 | yes | `ConsumptionImpactSummary` / impact view。 | 不返回下游运行状态、执行实例、成员状态、runtime binding 或 UI 状态。 |
| 查询一致性保护诊断 | yes | `ConsistencyProtectionPolicy` + impact summary + trace material。 | 不暴露恢复算法、告警规则、重试策略或 worker 状态。 |
| 获取 safe audit trail | bounded_yes | `MethodAssetAuditTrail`。 | 不返回 raw audit log、telemetry、metric、event payload 或 report body。 |
| 获取 evidence lineage | bounded_yes | `MethodAssetEvidenceLineage`。 | 不返回证据文件正文、artifact 包体、archive 内容或标准全文。 |
| 列出待承接影响 / unknown impact | bounded_yes | impact summary + consistency policy。 | 不把 unknown 自动解释为无影响,不扫描下游内部 truth。 |

#### R1.13.5 Event / Job 候选判断

| 类别 | 候选方向 | 当前裁决 | 理由 |
|---|---|---|---|
| Inbound Event Consumer | downstream impact summary accepted | no_for_this_component_loop | 下游摘要输入需要先闭合 body-free inbound 口径,留到五类总表合并判断。 |
| Inbound Event Consumer | raw audit / telemetry event | no | raw log、telemetry 和 observability 原始材料不是本仓业务 truth。 |
| Inbound Event Consumer | evidence artifact uploaded | no_for_this_component | artifact / archive 引用先由 `外部摘要与引用` 承接为 ref / lineage 输入。 |
| Outbound Event | trace material prepared / changed | yes_candidate | 追溯材料变化会影响审计读取、影响解释和维护刷新。 |
| Outbound Event | consumption impact summary changed | yes_candidate | 影响摘要变化需要被一致性保护、维护和下游消费方感知。 |
| Outbound Event | consistency protection decision changed | yes_candidate | 保护判断变化是正式消费一致性的关键事实。 |
| Outbound Event | audit / evidence lineage changed | yes_candidate | 审计材料和 lineage 变化需要被验收、维护或审计读取感知。 |
| Operations Job | rebuild trace material | no_here | 刷新 / 重建归后台维护与收敛。 |
| Operations Job | run consistency recovery | no_here | recovery task 归后台维护与收敛,本组件只给业务语义来源。 |

#### R1.13.6 诊断

- 如果 trace material 和 audit trail 不分,接口会把 raw audit log 当成业务追溯 truth,后续证据和验收材料边界会失控。
- 如果 impact summary 可以保存下游运行状态,本仓会越权拥有 process、identity、runtime 或 member-images 的内部 truth。
- 如果 unknown impact 被 Query 或 Command 自动折叠成 no impact,正式版本变化会静默破坏既有消费。
- 如果一致性保护 Command 直接执行 recovery,业务判断会和维护执行混在一起,Step 8 / Step 9 无法区分保护语义、恢复任务和维护进度。
- 如果 evidence lineage 接收证据正文或 artifact 包体,会绕过外部摘要与引用边界,详细设计会缺 schema / storage / retention 闭口。

#### R1.13.7 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| 是否把 trace material 组织作为 Command | yes | 它形成可读取的业务追溯材料,但必须 body-free 且不修复来源 truth。 |
| 是否把 impact summary 登记作为 Command | yes | 影响摘要是保护既有正式消费的输入,必须显式承接 unknown / pending。 |
| 是否把 consistency recovery 写成本组件 Job | no | recovery 属于后台维护与收敛;本组件只表达保护判断。 |
| 是否直接接收下游 raw impact event | no | 下游影响只能以正式 body-free summary / ref 进入,raw runtime event 不入仓。 |
| 是否提供 audit trail 读取 | yes_bounded | 只读 safe audit material,不暴露 raw log、event payload、report body。 |
| 是否提供 evidence lineage 读取 | yes_bounded | 只读 refs / marker / digest,不返回 evidence body 或 artifact content。 |

#### R1.13.8 下一写入批次结构

| 写入内容 | 要求 |
|---|---|
| Command API 局部骨架 | 写 trace material 组织 / 标记、impact summary 登记 / unknown、protection decision、safe audit trail、evidence lineage 关联。 |
| Query API 局部骨架 | 写 trace material、trace subject trace、impact summary、protection diagnostic、safe audit trail、evidence lineage、unknown impact 列表。 |
| Outbound Event 候选 | 只写 trace material changed、impact summary changed、protection decision changed、audit / lineage changed 概要候选。 |
| 本组成部分停审 | 检查 no raw log、no downstream runtime truth、unknown impact 不折叠、recovery 后移、evidence body 禁止。 |

#### R1.13.9 下一写入批次边界

- 只允许进入 Step 7 `追溯与一致性保护接口:再写入`。
- 不写全仓 Command / Query / Inbound / Outbound / Operations 总表。
- 不写第五个组成部分 `关系与分发语义接口:先思考`。
- 不改正式 `02-概要设计.md` §7。
- 不进入 Step 8 / Step 9。
- 不写 HTTP path、RPC method、完整 DTO schema、topic、payload、repository / port、事务、DDL、worker、配置项、drift 算法、恢复算法、告警规则、证据 JSON 或审计表。

#### R1.13.10 自检

| 检查项 | 结论 |
|---|---|
| 是否只处理一个组成部分 | pass |
| 是否完成 Command / Query / Event / Job 候选判断 | pass |
| 是否回指 Step 5 / Step 6 对象 | pass |
| 是否避免 raw log / telemetry 入仓 | pass |
| 是否避免下游运行 truth 入仓 | pass |
| 是否避免 recovery / maintenance 越界 | pass |
| 是否写完整接口骨架表 | no |
| 是否允许进入追溯与一致性保护接口:再写入 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `追溯与一致性保护接口:再写入`;只写本组成部分的局部 Command / Query / Outbound Event 候选骨架和停审记录,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.14 追溯与一致性保护接口:再写入

#### R1.14.1 Command API 局部骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| OrganizeMethodAssetTraceMaterial | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`TraceSubjectRef`;可选 `FormalMethodAssetVersionRef`;可选 `MethodAssetConsumptionMaterialRef`;basis / external summary refs。 | `MethodAssetTraceMaterialRef`;trace material organized summary。 | 从正式版本、消费材料、关系或外部摘要组织 body-free 追溯材料。 | 不保存 raw log、trace span、event payload、外部正文、证据正文或 report body。 |
| MarkMethodAssetTraceMaterialState | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetTraceMaterialRef`;trace material state marker;safe reason ref。 | trace material state summary。 | 标记 trace material stale / incomplete / unavailable 等可解释线索。 | 不修复 definition / formal version / relation / consumption truth,不启动刷新 job。 |
| RegisterConsumptionImpactSummary | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ConsumptionImpactSourceRef`;`MethodAssetDefinitionRef`;可选 `FormalMethodAssetVersionRef`;`ConsumptionContextRefSet`;impact summary。 | `ConsumptionImpactSummaryRef`;impact registered summary。 | 承接正式版本、边界、关系或外部依据变化造成的正式消费影响摘要。 | 不扫描下游运行状态;不保存下游 payload、执行结果正文或 UI 状态。 |
| MarkConsumptionImpactDisposition | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ConsumptionImpactSummaryRef`;impact disposition marker;safe reason ref。 | impact disposition summary。 | 标记 impact unknown / pending downstream summary / known / dismissed / superseded 等安全口径。 | 不把 unknown 折叠成 no impact;不要求同步等待所有下游。 |
| EstablishConsistencyProtectionDecision | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ConsistencyProtectionPolicyRef`;`FormalMethodAssetVersionRef`;可选 `ConsumptionImpactSummaryRef`;可选 `MethodAssetTraceMaterialRef`。 | protection decision summary;protected context refs;unknown impact reason ref。 | 建立正式版本变化和既有消费语境的一致性保护判断。 | 不定义恢复算法、告警规则、worker、重试或维护进度。 |
| OrganizeMethodAssetAuditTrail | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`TraceSubjectRef`;audit scope ref;history refs;evidence lineage refs。 | `MethodAssetAuditTrailRef`;safe audit trail summary。 | 将 history refs、trace subject 和 lineage 组织成 safe audit material。 | 不保存 raw audit log、telemetry、metric、event payload、report body 或证据正文。 |
| LinkMethodAssetEvidenceLineage | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`TraceSubjectRef`;external source refs;artifact archive refs;可选 digest refs。 | `MethodAssetEvidenceLineageRef`;lineage linked summary。 | 串联正式版本、外部来源和 artifact/archive refs 的 evidence lineage。 | 不保存 artifact 包体、archive 内容、证据文件正文、验收报告正文或标准全文。 |

#### R1.14.2 Query API 局部骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMethodAssetTraceMaterial | `ActorContext`;`QueryMetadata`;`MethodAssetTraceMaterialRef`。 | trace material summary;trace subject ref;formal version ref;consumption material ref;external summary refs。 | `MethodAssetTraceMaterial` / trace view。 | 不返回 raw log、event payload、外部正文、证据正文、handler report body 或刷新状态细节。 |
| GetTraceBySubject | `ActorContext`;`QueryMetadata`;`TraceSubjectRef`;page / filter summary。 | trace material summary page;safe lineage hints。 | `TraceSubjectRef` + trace material。 | 不从字符串、旧对象名、artifact path 或下游 id 反推 subject。 |
| GetConsumptionImpactSummary | `ActorContext`;`QueryMetadata`;`ConsumptionImpactSummaryRef`。 | impact summary;impact source ref;affected definition / version / context refs;disposition。 | `ConsumptionImpactSummary` / impact view。 | 不返回下游运行状态、执行实例、成员状态、runtime binding、UI 状态或同步结果正文。 |
| ListPendingConsumptionImpacts | `ActorContext`;`QueryMetadata`;`FormalMethodAssetVersionRef` 或 `ConsumptionContextRef`;page / filter summary。 | pending / unknown impact summary page。 | impact summary + consistency policy。 | 不把 unknown 自动解释为无影响;不扫描下游内部 truth。 |
| GetConsistencyProtectionDiagnostic | `ActorContext`;`QueryMetadata`;`ConsistencyProtectionPolicyRef` 或 `FormalMethodAssetVersionRef`;可选 context refs。 | protection diagnostic summary;protected contexts;unknown impact reason refs。 | `ConsistencyProtectionPolicy` + impact summary + trace material。 | 不暴露恢复算法、告警规则、重试策略、worker 状态或 maintenance run。 |
| GetMethodAssetAuditTrail | `ActorContext`;`QueryMetadata`;`MethodAssetAuditTrailRef` 或 `TraceSubjectRef`;page / scope summary。 | safe audit trail summary;history refs;evidence lineage refs。 | `MethodAssetAuditTrail`。 | 不返回 raw audit log、telemetry、metric、event payload、outbox body 或 report body。 |
| GetMethodAssetEvidenceLineage | `ActorContext`;`QueryMetadata`;`MethodAssetEvidenceLineageRef` 或 `TraceSubjectRef`。 | evidence lineage summary;external source refs;artifact archive refs;digest refs。 | `MethodAssetEvidenceLineage`。 | 不返回证据文件正文、artifact 包体、archive 内容、标准全文或验收报告正文。 |

#### R1.14.3 Outbound Event 候选

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| MethodAssetTraceMaterialChanged | trace material organized / state marked | `MethodAssetTraceMaterialRef`;`TraceSubjectRef`;change kind;safe reason ref;trace context。 | 审计读取、影响解释、后台维护、外围组织。 | 不携带 trace material 正文、raw log、topic / payload schema 或投递策略。 |
| ConsumptionImpactSummaryChanged | impact summary registered / disposition changed | `ConsumptionImpactSummaryRef`;`ConsumptionImpactSourceRef`;impact disposition;trace context。 | 一致性保护、后台维护、下游消费方、审计材料。 | 不携带下游运行状态、payload 或执行结果正文。 |
| ConsistencyProtectionDecisionChanged | protection decision established / changed | `ConsistencyProtectionPolicyRef`;`FormalMethodAssetVersionRef`;protected context refs;trace context。 | 受控消费、后台维护、审计材料。 | 不声明 recovery 已执行,不携带恢复计划或 worker 状态。 |
| MethodAssetAuditTrailChanged | audit trail organized / lineage attached | `MethodAssetAuditTrailRef`;`TraceSubjectRef`;audit scope ref;trace context。 | 审计读取、验收材料、后台维护。 | 不携带 raw audit log、report body 或 evidence body。 |
| MethodAssetEvidenceLineageChanged | evidence lineage linked / superseded | `MethodAssetEvidenceLineageRef`;`TraceSubjectRef`;external / artifact ref hints;trace context。 | 审计、验收、外部摘要、后台维护。 | 不携带 artifact 包体、archive 内容、证据正文或标准全文。 |

#### R1.14.4 本组成部分不定义的接口

| 不定义项 | 原因 | 后续承接 |
|---|---|---|
| DownstreamRawImpactEventConsumer | 下游运行事件不是本仓业务 truth。 | 需要时先形成 body-free downstream impact summary / ref。 |
| RawAuditLogIngest | raw log、telemetry、metric、trace span 不属于业务追溯材料。 | 观测 / 运维设计另行处理,不得进入概要 truth。 |
| EvidenceBodyUpload | 证据文件、artifact 包体、archive 内容不得直接进入本组件。 | `外部摘要与引用` 承接 refs / summaries。 |
| TraceMaterialRefreshJob | trace / impact / audit material 刷新是维护动作。 | `后台维护与收敛`。 |
| RunConsistencyRecovery | recovery task、worker、重试和恢复报告不是本组件业务 Command。 | `后台维护与收敛`。 |
| DriftDetectionAlgorithm | drift 状态机、告警规则和检测算法不属于 Step 7 概要接口骨架。 | Step 8 / Step 9 / 运维设计按需讨论。 |

#### R1.14.5 本组成部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只处理追溯与一致性保护 | pass | 未进入关系分发、外部摘要、维护或外围组织接口写入。 |
| 是否写入局部 Command 骨架 | pass | 覆盖 trace material、impact summary、protection decision、audit trail、evidence lineage。 |
| 是否写入局部 Query 骨架 | pass | 覆盖 trace、subject trace、impact、pending impact、protection diagnostic、audit trail、lineage。 |
| 是否写入 Outbound Event 候选 | pass | 只写已成立事实候选,未写 topic / payload / outbox。 |
| 是否避免 Inbound / Job 越界 | pass | raw impact、raw audit、evidence body、refresh job 和 recovery 均未作为本组成部分接口。 |
| 是否承接 Step 6 对象 | pass | 输入 / 输出回指 `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy`、`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage`、`TraceSubjectRef`、`ConsumptionImpactSourceRef`。 |
| 是否避免 raw log / telemetry 入仓 | pass | 只保留 safe summary / ref / marker。 |
| 是否避免下游运行 truth 入仓 | pass | impact summary 不保存 process、identity、runtime、member-images 或 UI 状态。 |
| 是否避免 recovery / maintenance 越界 | pass | recovery 和 material refresh 后移到后台维护与收敛。 |
| 是否修改正式 §7 | no | 正式回填仍等待回填草稿和审计。 |
| 是否允许进入关系与分发语义接口:先思考 | pass | 第四个组成部分局部骨架已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `关系与分发语义接口:先思考`;只思考该组成部分的 Command / Query / Inbound / Outbound / Operations 候选、对象承接和禁止事项,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.15 关系与分发语义接口:先思考

#### R1.15.1 问题回答

- 本模块只思考 `关系与分发语义` 这个组成部分的接口候选,不写完整接口骨架表,不写全仓五类总表,不改正式 `02-概要设计.md` §7。
- 本组成部分的接口第一来源是 Step 5 `5.18` / `5.26.1` 和 Step 6 对象卡片:
  - relation truth:`MethodAssetRelation`。
  - relation endpoint / distribution ref:`RelatedMethodAssetRef`;`MethodAssetDistributionRef`;`DistributionContextRef`。
  - policy / invariant:`RelationIntegrityRule`。
  - read model / material:`MethodAssetRelationView`;`DistributionReadMaterial`。
  - history / trace handoff:`RelationChangeHistory`;`TraceSubjectRef`。
- 本组成部分需要 Command API。凡是建立、调整、约束、退休关系,以及准备 / 调整分发语义 ref 或关系完整性判断的入口,都属于本组成部分 Command 候选。
- 本组成部分需要 Query API。凡是读取关系 truth、关系 view、关系完整性诊断、分发 ref、分发 context、分发 read material 的入口,都属于 Query 候选。
- 本组成部分原则上不直接需要 Inbound Event Consumer。外部关系线索、marketplace 语境或 artifact 线索必须先由 `外部摘要与引用` 形成 body-free summary / ref,本模块不接收 raw external event。
- 本组成部分可以提出 Outbound Event 候选。事件只表达 relation changed、distribution ref changed、relation integrity changed / failed 等本仓已成立事实。
- 本组成部分不直接定义 Operations Job。关系视图刷新、分发材料重建、关系完整性重扫和分发读材料收敛归 `后台维护与收敛`;本组成部分只定义业务语义入口和读取边界。

#### R1.15.2 对象承接判断

| Step 6 对象 / 能力 | 对 Step 7 的接口含义 | 当前判断 |
|---|---|---|
| `MethodAssetRelation` | 必须有 relation establish / adjust / constrain / retire 类 Command,以及 relation truth / relation view 读取 Query。 | 进入本组成部分候选池。 |
| `RelatedMethodAssetRef` | 关系端点必须使用 typed ref 或 definition / formal version ref 承接,不得用裸 asset id、URL、marketplace id。 | 作为 Command 输入和 Query 输出的端点骨架。 |
| `RelationIntegrityRule` | 关系建立和调整必须经过 endpoint / formalization / distribution boundary 完整性判断。 | 进入 Command guard 和 diagnostic Query 候选池。 |
| `MethodAssetDistributionRef` | 分发语义 ref 是可消费 / 外围可发现语义的稳定引用,需要维护和读取接口。 | 进入 Command / Query 候选池。 |
| `DistributionContextRef` | 分发语义必须锚定上下文,不能从 route param、listing id 或 UI 分类反推。 | 作为 distribution Command / Query 的核心 ref。 |
| `MethodAssetRelationView` | 关系读取需要派生 view,但 view 不创建或修改 relation truth。 | 进入 Query 候选池。 |
| `DistributionReadMaterial` | 分发读取材料服务受控消费和外围发现,但不表达交易 / 安装 / 履约。 | 进入 Query 候选池;刷新归后台维护。 |
| `RelationChangeHistory` | 关系 / 分发变化需要交给追溯一致性解释影响。 | 作为输出摘要 / trace handoff 线索,不作为独立 relation truth。 |

#### R1.15.3 Command 候选判断

| 候选方向 | 是否进入后续写入 | 理由 | 禁止事项 |
|---|---|---|---|
| 建立方法资产关系 | yes | `MethodAssetRelation` 需要从 source / target definition 或 formal version endpoint 建立定义性关系。 | 不从运行依赖图、推荐结果、搜索索引、UI 分类或 marketplace listing 生成关系 truth。 |
| 调整关系语义 / scope / endpoint | yes | 关系 scope、端点正式语境或 relation kind 变化需要显式 Command。 | 不静默覆盖旧关系,不绕过 `RelationIntegrityRule`。 |
| 约束关系到目录 / 正式版本 / 分发语境 | yes_bounded | `MethodAssetRelation` 支持 constrained relation,需要把约束显式化。 | 不把约束写成下游授权、安装状态或交易规则。 |
| 退休 / 替代关系 | yes | relation retired / superseded 影响消费、追溯和外围组织。 | 不删除历史引用,不把 relation history 当成当前 truth。 |
| 执行关系完整性判断 / 标记违规 | yes_bounded | `RelationIntegrityRule` 需要对端点存在、正式化边界、分发边界做安全判断。 | 不实现完整图算法、推荐算法、搜索排序或 policy engine。 |
| 准备 / 调整分发语义 ref | yes | `MethodAssetDistributionRef` 需要从 definition / package / context 形成稳定语义引用。 | 不表示 marketplace 上架、定价、订单、购买、安装、履约或同步成功。 |
| 标记分发语义 blocked / unavailable | yes_bounded | 分发边界或消费边界阻止输出时需要可解释 marker。 | 不修复消费材料、下游状态或外围 package truth。 |
| 刷新关系视图 / 分发材料 | no_as_command | 这是派生 read material 维护行为。 | 交给 `后台维护与收敛`,不得在业务 Command 中执行。 |

#### R1.15.4 Query 候选判断

| 候选方向 | 是否进入后续写入 | 读取来源 | 禁止事项 |
|---|---|---|---|
| 获取方法资产关系 | yes | `MethodAssetRelation` / relation view。 | 不返回目标定义正文、外部正文、marketplace 状态或运行依赖细节。 |
| 按 source / target / formal version 列出关系 | yes | relation truth + `MethodAssetRelationView`。 | 不执行推荐、相似度、搜索排序或图遍历算法。 |
| 获取关系完整性诊断 | yes | `RelationIntegrityRule` + relation endpoint refs。 | 不暴露 policy engine、完整规则矩阵、配置 profile 或运行依赖图。 |
| 获取关系变化摘要 | bounded_yes | `RelationChangeHistory` / trace handoff summary。 | 不返回 raw audit log、event payload、证据正文或外部标准正文。 |
| 解析分发语义 ref | yes | `MethodAssetDistributionRef`;`DistributionContextRef`。 | 不返回 marketplace listing、订单、安装包、履约状态或分发协议。 |
| 获取分发读取材料 | yes | `DistributionReadMaterial`。 | 不扩大受控消费授权,不返回下游同步结果、安装状态或 package 正文。 |
| 按分发上下文列出可读关系 / 材料 | yes_bounded | distribution context + relation view + distribution material。 | 不把 marketplace context 当作交易事实,不从 route param 或 external id 拼 ref。 |
| 查询关系图 traversal / 推荐 | no | 不是本仓概要接口职责。 | 推荐算法、搜索排序和图遍历不进入 Step 7 接口骨架。 |

#### R1.15.5 Event / Job 候选判断

| 类别 | 候选方向 | 当前裁决 | 理由 |
|---|---|---|---|
| Inbound Event Consumer | external relation hint received | no_for_this_component_loop | 外部线索必须先由 `外部摘要与引用` 转为 body-free summary / ref;本组件不直接接 raw event。 |
| Inbound Event Consumer | marketplace listing / install event | no | marketplace 交易、安装、履约不是本仓关系或分发 truth。 |
| Outbound Event | method asset relation changed | yes_candidate | 关系建立、调整、替代、退休会影响消费、追溯、外围组织和维护刷新。 |
| Outbound Event | relation integrity changed / failed | yes_candidate | 完整性违规或恢复是重要安全事实,需要被追溯和维护感知。 |
| Outbound Event | method asset distribution ref changed | yes_candidate | 分发语义 ref 变化会影响消费读取、外围发现和维护刷新。 |
| Outbound Event | distribution read material availability changed | yes_candidate_bounded | blocked / unavailable 变化可能影响消费和外围读取,但事件不携带材料正文。 |
| Operations Job | rebuild relation view | no_here | relation view 是派生读取材料,刷新归后台维护与收敛。 |
| Operations Job | rebuild distribution read material | no_here | material rebuild / stale convergence 是维护动作。 |
| Operations Job | graph traversal / recommendation refresh | no | 推荐 / 搜索 / traversal 不是本仓 Step 7 业务接口。 |

#### R1.15.6 诊断

- 如果 relation 接口允许接收裸 asset id、URL、marketplace id 或 route param,后续详细设计会缺少 typed ref 来源闭口,并把外部生态身份混入本仓 truth。
- 如果 distribution ref 被写成 marketplace listing 或安装包引用,本仓会越界拥有交易、安装、履约和 package 正文。
- 如果 relation view 或 distribution read material 可以反写关系,read model 会成为第二 truth,Step 8 / Step 9 无法解释关系成立和关系变更来源。
- 如果关系完整性判断被写成完整图算法或推荐算法,`RelationIntegrityRule` 会超出概要 policy 轮廓,并误导后续实现去构建图数据库或搜索排序系统。
- 如果关系 / 分发变化没有 outbound event 候选,受控消费、追溯一致性、外围组织和后台维护无法获知应重新解释影响或刷新读取材料。
- 如果所有分发读取都变成 Query,但没有 blocked / unavailable 的 Command 或 marker,消费边界和分发边界被阻止时无法形成可解释状态。

#### R1.15.7 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| 是否拆成关系接口和分发接口两个组成部分 | no_for_step7 | Step 5 已裁定二者作为一个 support 组成部分;Step 7 可在同一小循环内区分 relation / distribution 接口族。 |
| 是否提供 relation 建立 / 调整 Command | yes | relation 是本仓 support truth,不能只靠 read model 或外部摘要隐式产生。 |
| 是否提供 distribution ref 维护 Command | yes_bounded | distribution ref 是本仓可读语义引用,但不承担 marketplace / install / fulfillment。 |
| 是否提供关系完整性诊断 Query | yes | relation endpoint、formalization boundary 和 distribution boundary 需要可解释读取。 |
| 是否直接接收 external relation event | no | 外部线索先归 `外部摘要与引用`,本组件只消费 safe summary / ref。 |
| 是否把 relation view rebuild 写成本组件 Job | no | 刷新 / 重建归 `后台维护与收敛`,本组件只定义业务语义和读取面。 |

#### R1.15.8 下一写入批次结构

| 写入内容 | 要求 |
|---|---|
| Command API 局部骨架 | 写 relation establish / adjust / constrain / retire / supersede,relation integrity evaluate / mark,distribution ref prepare / adjust / block / retire。 |
| Query API 局部骨架 | 写 get relation、list relation by endpoint / formal version / context、relation integrity diagnostic、resolve distribution ref、get/list distribution read material。 |
| Outbound Event 候选 | 写 relation changed、relation integrity changed / failed、distribution ref changed、distribution material availability changed。 |
| 本组成部分不定义的接口 | 排除 marketplace listing / order / install / fulfillment、runtime dependency graph、recommendation/search、view rebuild job、external raw event consumer。 |
| 本组成部分停审 | 检查 typed ref 来源、read model 不反写、distribution 不越界、维护 job 后移、正式 §7 不修改。 |

#### R1.15.9 下一写入批次边界

- 只允许进入 Step 7 `关系与分发语义接口:再写入`。
- 不写全仓 Command / Query / Inbound / Outbound / Operations 总表。
- 不写第六个组成部分 `外部摘要与引用接口:先思考`。
- 不改正式 `02-概要设计.md` §7。
- 不进入 Step 8 / Step 9。
- 不写 HTTP path、RPC method、完整 DTO schema、topic、payload、repository / port、事务、DDL、worker、配置项、图遍历算法、推荐算法、搜索索引、marketplace 交易模型、安装履约流程或外部正文 schema。

#### R1.15.10 自检

| 检查项 | 结论 |
|---|---|
| 是否只处理一个组成部分 | pass |
| 是否完成 Command / Query / Event / Job 候选判断 | pass |
| 是否回指 Step 5 / Step 6 对象 | pass |
| 是否避免 marketplace 交易 / 安装 / 履约入仓 | pass |
| 是否避免运行依赖图 / 推荐 / 搜索越界 | pass |
| 是否避免 read model 反写 truth | pass |
| 是否写完整接口骨架表 | no |
| 是否允许进入关系与分发语义接口:再写入 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `关系与分发语义接口:再写入`;只写本组成部分的局部 Command / Query / Outbound Event 候选骨架和停审记录,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.16 关系与分发语义接口:再写入

#### R1.16.1 Command API 局部骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| EstablishMethodAssetRelation | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;source `MethodAssetDefinitionRef`;target `RelatedMethodAssetRef`;`MethodAssetRelationKind`;`CatalogScopeRef`;可选 formal version refs;basis summary refs。 | `MethodAssetRelationRef`;relation established summary;trace subject ref。 | 从稳定 definition / formal version endpoint 建立定义性关系,并保留 relation basis / trace 线索。 | 不从运行依赖图、推荐结果、搜索索引、UI 分类或 marketplace listing 生成关系 truth。 |
| AdjustMethodAssetRelation | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetRelationRef`;relation change summary;可选 scope / kind / endpoint refs。 | relation adjusted summary;relation change history ref。 | 显式调整关系语义、scope 或 endpoint 线索,并记录可追溯变化。 | 不静默覆盖旧关系;不绕过 relation integrity 判断;不修改 definition / formal version truth。 |
| ConstrainMethodAssetRelation | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetRelationRef`;`CatalogScopeRef`;可选 `FormalMethodAssetVersionRef`;可选 `DistributionContextRef`;safe reason ref。 | relation constrained summary。 | 将关系限制到目录、正式版本或分发语境,表达 constrained relation。 | 不把约束写成下游授权、安装状态、交易规则或 marketplace policy。 |
| SupersedeMethodAssetRelation | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;previous `MethodAssetRelationRef`;next relation candidate refs;change reason ref。 | supersession summary;previous / next relation refs。 | 用显式后续关系替代旧关系,保留历史引用和追溯线索。 | 不删除历史关系;不把 relation history 当成当前 relation truth。 |
| RetireMethodAssetRelation | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetRelationRef`;retirement reason ref。 | relation retired summary。 | 标记关系退出当前适用语境,同时保留历史和审计可追溯性。 | 不删除 relation;不级联删除消费材料、分发材料或外围组织对象。 |
| EvaluateRelationIntegrity | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetRelationRef`;`RelationIntegrityRuleRef`;endpoint / formalization / distribution refs。 | relation integrity diagnostic summary;optional violation reason ref。 | 判断 relation endpoint、正式化边界和分发边界是否满足完整性要求。 | 不实现完整图算法、推荐算法、搜索排序、policy engine 或外部正文解析。 |
| MarkRelationIntegrityViolation | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetRelationRef`;`RelationIntegrityViolationRef`;safe reason ref。 | violation marked summary。 | 标记关系完整性违规,供追溯、一致性保护和维护刷新使用。 | 不自动修复 relation truth、definition truth、formal version truth 或 distribution material。 |
| PrepareMethodAssetDistributionRef | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;source `MethodAssetDefinitionRef` 或 `MethodPackageRef`;`DistributionContextRef`;distribution kind;basis refs。 | `MethodAssetDistributionRef`;distribution prepared summary。 | 从正式来源和分发上下文建立稳定分发语义引用。 | 不表示 marketplace 上架、定价、订单、购买、安装、履约或同步成功。 |
| AdjustMethodAssetDistributionContext | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDistributionRef`;next `DistributionContextRef`;safe reason ref。 | distribution context adjusted summary。 | 调整分发语义适用上下文,让消费和外围发现读取可解释。 | 不扩大受控消费授权;不修改 package 正文、method set 正文或 marketplace 状态。 |
| MarkMethodAssetDistributionAvailability | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodAssetDistributionRef`;blocked / unavailable marker;safe reason ref。 | distribution availability summary。 | 标记分发语义 blocked / unavailable 等可解释状态。 | 不修复消费材料、下游状态、外围 package truth 或分发 read material。 |

#### R1.16.2 Query API 局部骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMethodAssetRelation | `ActorContext`;`QueryMetadata`;`MethodAssetRelationRef`。 | relation summary;source / target refs;relation kind;scope;distribution context hint;trace subject ref。 | `MethodAssetRelation` / `MethodAssetRelationView`。 | 不返回目标定义正文、外部正文、marketplace 状态、运行依赖细节或 relation history 全量正文。 |
| ListMethodAssetRelationsByEndpoint | `ActorContext`;`QueryMetadata`;source 或 target `MethodAssetDefinitionRef`;page / filter summary。 | relation summary page;endpoint refs;freshness hint。 | relation truth + `MethodAssetRelationView`。 | 不执行推荐、相似度、搜索排序、图遍历或 UI 分类聚合。 |
| ListMethodAssetRelationsByFormalVersion | `ActorContext`;`QueryMetadata`;`FormalMethodAssetVersionRef`;page / filter summary。 | relation summary page;formal version relation hints。 | relation truth + formal version endpoint refs。 | 不把读取触发正式化;不从版本号、hash、fingerprint 或 snapshot 反推关系。 |
| ListMethodAssetRelationsByDistributionContext | `ActorContext`;`QueryMetadata`;`DistributionContextRef`;page / filter summary。 | relation view summary page;distribution context coverage hints。 | `MethodAssetRelationView`;`DistributionReadMaterial`。 | 不把 marketplace context 当作交易事实;不从 route param、listing id 或 external id 拼 ref。 |
| GetRelationIntegrityDiagnostic | `ActorContext`;`QueryMetadata`;`MethodAssetRelationRef` 或 `RelationIntegrityRuleRef`。 | integrity diagnostic summary;violation reason refs;safe remediation hints。 | `RelationIntegrityRule` + relation endpoint refs。 | 不暴露完整规则矩阵、policy engine、配置 profile、运行依赖图或外部正文解析。 |
| GetRelationChangeSummary | `ActorContext`;`QueryMetadata`;`MethodAssetRelationRef`;page / scope summary。 | relation change summary page;trace handoff refs。 | `RelationChangeHistory` / trace handoff summary。 | 不返回 raw audit log、event payload、证据正文、外部标准正文或 report body。 |
| ResolveMethodAssetDistributionRef | `ActorContext`;`QueryMetadata`;`MethodAssetDistributionRef`。 | distribution ref summary;source definition / package ref;distribution context ref;availability marker。 | `MethodAssetDistributionRef`;`DistributionContextRef`。 | 不返回 marketplace listing、订单、安装包、履约状态、分发协议或外部 API payload。 |
| GetDistributionReadMaterial | `ActorContext`;`QueryMetadata`;`DistributionReadMaterialRef` 或 `MethodAssetDistributionRef`;可选 context refs。 | distribution material summary;relation refs;consumption context refs;availability marker。 | `DistributionReadMaterial`。 | 不扩大受控消费授权;不返回下游同步结果、安装状态、package 正文或 method set 正文。 |
| ListDistributionReadMaterialsByContext | `ActorContext`;`QueryMetadata`;`DistributionContextRef`;page / filter summary。 | distribution material summary page;relation coverage hints。 | `DistributionReadMaterial`;relation view。 | 不做 marketplace listing 浏览、搜索排序、推荐结果或交易可用性判断。 |

#### R1.16.3 Outbound Event 候选

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| MethodAssetRelationChanged | relation established / adjusted / constrained / superseded / retired | `MethodAssetRelationRef`;source / target refs;change kind;trace context。 | 受控消费、追溯与一致性保护、后台维护、外围组织。 | 不携带 relation 正文全集、定义正文、topic / payload schema 或投递策略。 |
| MethodAssetRelationIntegrityChanged | integrity evaluated / violation marked / violation cleared | `MethodAssetRelationRef`;`RelationIntegrityRuleRef`;integrity state hint;safe reason ref。 | 追溯一致性保护、后台维护、受控消费读取。 | 不携带规则矩阵、policy engine 配置、图算法结果或外部正文。 |
| MethodAssetDistributionRefChanged | distribution ref prepared / context adjusted / retired | `MethodAssetDistributionRef`;`DistributionContextRef`;change kind;trace context。 | 受控消费、外围包与方法集组织、后台维护、追溯材料。 | 不携带 marketplace listing、订单、安装、履约、同步包或分发协议。 |
| MethodAssetDistributionAvailabilityChanged | distribution availability marker changed | `MethodAssetDistributionRef`;availability marker;safe reason ref;trace context。 | 受控消费读取、外围发现、后台维护。 | 不声明下游已同步、已安装或可交易;不携带 material 正文。 |
| MethodAssetRelationReadMaterialInvalidated | relation or distribution source changed | relation / distribution refs;staleness reason ref;refresh hint。 | 后台维护与收敛、读取材料消费者。 | 只表达 invalidation hint;不执行刷新 job,不携带 projection storage 或 worker 参数。 |

#### R1.16.4 本组成部分不定义的接口

| 不定义项 | 原因 | 后续承接 |
|---|---|---|
| ExternalRelationHintConsumer | 外部线索不是 relation truth,必须先形成 body-free summary / ref。 | `外部摘要与引用`。 |
| MarketplaceListingCommand | 上架、定价、购买、订单、结算、安装和履约不是本仓职责。 | `L6-marketplace` 或外围生态仓。 |
| RuntimeDependencyGraphQuery | 运行依赖图、调用图、流程执行关系不属于方法资产定义性关系。 | 对应 runtime / process / observability 体系。 |
| RecommendationOrSearchQuery | 推荐、相似度、排序和搜索索引不是 relation truth。 | 搜索 / 推荐能力另行设计。 |
| RelationViewRefreshJob | relation view 是派生读取材料,刷新属于维护动作。 | `后台维护与收敛`。 |
| DistributionMaterialRebuildJob | distribution material rebuild / stale convergence 是维护动作。 | `后台维护与收敛`。 |
| DistributionProtocolApi | topic、payload、同步包、传输协议和投递策略不属于概要接口骨架。 | 详细设计或集成设计按需展开。 |
| RelationGraphTraversalAlgorithm | 图遍历、拓扑排序、路径查找和冲突搜索属于算法 / 实现层。 | 如需存在,后续作为实现细节或专门服务讨论。 |

#### R1.16.5 本组成部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只处理关系与分发语义 | pass | 未进入外部摘要、后台维护或外围组织接口写入。 |
| 是否写入局部 Command 骨架 | pass | 覆盖 relation establish / adjust / constrain / supersede / retire、integrity evaluate / violation、distribution ref prepare / adjust / availability。 |
| 是否写入局部 Query 骨架 | pass | 覆盖 relation get / list、integrity diagnostic、change summary、distribution resolve / material read。 |
| 是否写入 Outbound Event 候选 | pass | 只写已成立事实和 read material invalidation hint,未写 topic / payload / outbox。 |
| 是否避免 Inbound / Job 越界 | pass | external raw hint、marketplace event、view refresh job、distribution rebuild job 均未作为本组成部分接口。 |
| 是否承接 Step 6 对象 | pass | 输入 / 输出回指 `MethodAssetRelation`、`RelatedMethodAssetRef`、`RelationIntegrityRule`、`MethodAssetDistributionRef`、`DistributionContextRef`、`MethodAssetRelationView`、`DistributionReadMaterial`、`RelationChangeHistory`。 |
| 是否避免 marketplace 交易 / 安装 / 履约入仓 | pass | distribution ref 和 material 只表达语义引用与读取材料。 |
| 是否避免运行依赖图 / 推荐 / 搜索越界 | pass | traversal、recommendation、search index 均列入不定义项。 |
| 是否避免 read model 反写 truth | pass | relation view / distribution material 只读,刷新交给后台维护。 |
| 是否修改正式 §7 | no | 正式回填仍等待回填草稿和审计。 |
| 是否允许进入外部摘要与引用接口:先思考 | pass | 第五个组成部分局部骨架已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `外部摘要与引用接口:先思考`;只思考该组成部分的 Command / Query / Inbound / Outbound / Operations 候选、对象承接和禁止事项,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.17 外部摘要与引用接口:先思考

#### R1.17.1 问题回答

- 本模块只思考 `外部摘要与引用` 这个组成部分的接口候选,不写完整接口骨架表,不写全仓五类总表,不改正式 `02-概要设计.md` §7。
- 本组成部分的接口第一来源是 Step 5 `5.20` / `5.26.1` 和 Step 6 对象卡片:
  - support summary:`ExternalSourceSummary`。
  - body-free refs:`ExternalSourceRef`;`ArtifactArchiveRef`;`GovernanceBasisRef`。
  - guard / boundary:`ExternalBodyBoundaryRule`。
  - read view:`ExternalSourceSummaryView`。
  - history / lineage:`ExternalBasisAcceptanceHistory`;`MethodAssetEvidenceLineage`。
- 本组成部分需要 Command API。凡是接收外部安全摘要、登记 typed external ref、登记 artifact/archive ref、执行正文边界检查、接受 / 拒绝外部依据、标记外部摘要状态的入口,都属于本组成部分 Command 候选。
- 本组成部分需要 Query API。凡是读取外部摘要、解析外部来源 ref、读取 artifact/archive ref、读取正文边界诊断、读取外部依据承接历史、读取 external summary view 的入口,都属于 Query 候选。
- 本组成部分可以提出有限 Inbound Event Consumer 候选。只有外部系统或相邻仓已经提供 body-free summary / ref / digest / marker 时才可能成立;raw external document、artifact body、webhook payload、标准全文和证据正文不得作为 consumer 输入。
- 本组成部分可以提出 Outbound Event 候选。事件只表达 external summary accepted / rejected / changed、external ref registered、artifact ref registered、body boundary violation noticed 等本仓可解释事实。
- 本组成部分不直接定义 Operations Job。外部来源刷新、summary view rebuild、引用有效性复核、artifact ref stale convergence 归 `后台维护与收敛`;本组成部分只定义摘要 / 引用承接和读取边界。

#### R1.17.2 对象承接判断

| Step 6 对象 / 能力 | 对 Step 7 的接口含义 | 当前判断 |
|---|---|---|
| `ExternalSourceSummary` | 必须有 capture / accept / reject / unavailable / supersede 类 Command,以及 summary 读取 Query。 | 进入本组成部分候选池。 |
| `ExternalSourceRef` | 外部来源必须使用 typed ref,不得用 URL、file path、external id 或 route param 替代。 | 作为 Command 输入和 Query 输出的核心 ref。 |
| `ArtifactArchiveRef` | artifact / archive 只能以 body-free ref 和 digest 线索承接,不得保存包体。 | 进入 Command / Query 候选池。 |
| `GovernanceBasisRef` | 治理 / 标准 / ADR 依据可被引用,但不保存治理执行正文。 | 作为 external basis 输入 / 输出线索。 |
| `ExternalBodyBoundaryRule` | 所有 external summary / ref / artifact / lineage 输入必须经过正文禁止边界。 | 进入 Command guard 和 diagnostic Query 候选池。 |
| `ExternalSourceSummaryView` | 外部摘要读取需要派生 view,但 view 不保存外部正文且不替代 summary truth。 | 进入 Query 候选池。 |
| `ExternalBasisAcceptanceHistory` | 外部依据承接、更新、失效、挂起或拒绝需要可追溯历史线索。 | 作为 Query / audit handoff 候选。 |
| `MethodAssetEvidenceLineage` | 证据和 artifact 只能通过 lineage refs 被追溯使用。 | 作为输出线索,不作为正文入口。 |

#### R1.17.3 Command 候选判断

| 候选方向 | 是否进入后续写入 | 理由 | 禁止事项 |
|---|---|---|---|
| 接收外部安全摘要 | yes | `ExternalSourceSummary` 需要承接治理、标准、ADR、artifact 或 marketplace 生态来源的 safe summary。 | 不保存标准全文、ADR 正文、外部文档正文、artifact 包体、证据正文或外部 API payload。 |
| 注册外部来源 ref | yes | `ExternalSourceRef` 需要统一外部来源身份,防止各组件私造 URL / path / id。 | 不从 free-form URL、文件路径、route param 或 external id 直接拼 ref。 |
| 注册 artifact / archive ref | yes | `ArtifactArchiveRef` 为证据、模板、示例、制品或 archive 提供 body-free 锚点。 | 不保存文件内容、archive 包、证据正文、对象存储内容或生命周期状态。 |
| 执行正文边界检查 / 拒绝正文 | yes | `ExternalBodyBoundaryRule` 是防止外部正文进入 summary、trace、relation、package 的统一 guard。 | 不把拒绝逻辑写成外部内容审查、标准解释或 policy enforce 执行。 |
| 接受 / 挂起 / 拒绝外部依据 | yes_bounded | 外部摘要是否可被正式化、追溯或关系使用需要显式状态线索。 | 不执行治理审批、Gate、标准解释、外部系统权限判断或 artifact 生命周期管理。 |
| 标记外部摘要 unavailable / superseded | yes_bounded | 外部来源不可用或被后续摘要替代时需要可解释变化。 | 不删除历史摘要,不同步修改正式版本、关系或外围对象。 |
| 关联 evidence lineage | yes_bounded | artifact / archive refs 需要可被追溯和验收解释。 | 不保存证据文件正文、artifact 包体、验收报告正文或 archive 内容。 |
| 刷新外部来源 / 重建摘要 view | no_as_command | refresh / rebuild 属于维护收敛动作。 | 交给 `后台维护与收敛`,不得在业务 Command 中拉取外部正文。 |

#### R1.17.4 Query 候选判断

| 候选方向 | 是否进入后续写入 | 读取来源 | 禁止事项 |
|---|---|---|---|
| 获取外部来源摘要 | yes | `ExternalSourceSummary`;`ExternalSourceSummaryView`。 | 不返回外部正文、标准全文、ADR 正文、artifact 正文、archive 包体或外部 API payload。 |
| 按外部来源 ref 读取摘要 | yes | `ExternalSourceRef` + summary view。 | 不从 URL、path、external id 或 route param 反推来源。 |
| 解析外部来源 ref | yes | `ExternalSourceRef`。 | 不暴露外部系统认证、权限、内部生命周期或 provider payload。 |
| 获取 artifact / archive ref | yes | `ArtifactArchiveRef`。 | 不返回文件内容、archive 包、证据正文、对象存储路径或 retention policy。 |
| 查询正文边界诊断 | yes | `ExternalBodyBoundaryRule` + summary / ref inputs。 | 不返回被拒正文内容,不提供外部正文摘录。 |
| 获取 external summary view | yes | `ExternalSourceSummaryView`。 | view 不成为 summary truth,不携带外部正文或外部状态。 |
| 查询外部依据承接历史 | bounded_yes | `ExternalBasisAcceptanceHistory`。 | 不返回治理执行、审批过程、policy enforce、外部日志或 report body。 |
| 查询证据 lineage 线索 | bounded_yes | `MethodAssetEvidenceLineage` / artifact refs。 | 不返回证据文件正文、artifact 包体、archive 内容或验收报告正文。 |

#### R1.17.5 Event / Job 候选判断

| 类别 | 候选方向 | 当前裁决 | 理由 |
|---|---|---|---|
| Inbound Event Consumer | body-free external summary received | yes_candidate_bounded | 相邻仓或外部边界若已经提供 safe summary / ref / digest,可作为候选 consumer。 |
| Inbound Event Consumer | artifact archive ref registered externally | yes_candidate_bounded | 只接收 artifact/archive ref、digest、kind 和来源线索,不接收包体。 |
| Inbound Event Consumer | raw external document / webhook payload | no | raw 文档、网页、payload、标准全文、证据正文不得直接入仓。 |
| Inbound Event Consumer | governance decision body event | no | 治理执行和裁决正文不属于本仓;只能承接 governance basis ref / summary。 |
| Outbound Event | external source summary accepted / rejected / superseded | yes_candidate | 外部摘要状态变化会影响正式化、追溯、关系和外围组织。 |
| Outbound Event | external source ref registered / changed | yes_candidate | typed ref 变化会影响读取、trace、basis 和 maintenance refresh。 |
| Outbound Event | artifact archive ref registered / changed | yes_candidate | artifact / archive ref 变化会影响证据 lineage 和追溯材料。 |
| Outbound Event | external body boundary violation noticed | yes_candidate | 正文边界违规需要被审计、维护和上游修正感知。 |
| Operations Job | refresh external source summary | no_here | 外部刷新和 view rebuild 归后台维护与收敛。 |
| Operations Job | validate external reference availability | no_here | 引用有效性复核和 stale convergence 是维护动作。 |

#### R1.17.6 诊断

- 如果外部来源可以通过 URL、file path、route param 或 external id 直接进入接口,后续详细设计会缺 typed ref 生成闭口,并造成各组件私有引用规则。
- 如果 Command 接收 raw document、artifact body、archive 包或 webhook payload,`ExternalBodyBoundaryRule` 会失效,外部正文会渗入正式化、追溯、关系或外围组织。
- 如果 external summary view 能替代 `ExternalSourceSummary`,read model 会成为第二 truth,外部摘要状态和承接历史无法解释。
- 如果外部依据承接直接执行治理审批或标准解释,本仓会越界成为治理执行仓或标准解释器。
- 如果 artifact / archive ref 查询返回文件内容或对象存储路径,本仓会越界拥有 artifact 生命周期、存储策略和证据正文。
- 如果没有 bounded inbound candidate,相邻仓已形成的 body-free summary / ref 只能通过人工 Command 进入,事件协作边界会在后续详细设计中缺口;但该 candidate 必须严格排除 raw payload。

#### R1.17.7 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| 是否提供外部摘要接收 Command | yes | 外部摘要是本仓使用外部依据的统一入口,不能分散到正式化、追溯、关系或外围组织私有实现。 |
| 是否提供 external ref / artifact ref 注册 Command | yes | ref 生成和正文禁止边界必须统一,防止 URL / path / id 私造。 |
| 是否允许 bounded inbound consumer | yes_candidate_bounded | 只在输入已是 body-free summary / ref / digest / marker 时成立。 |
| 是否接收 raw external document | no | 违反外部正文禁止边界,也会诱发 storage / parser / retention schema 缺口。 |
| 是否提供正文边界诊断 Query | yes | 需要可解释拒绝原因,但不能返回被拒正文。 |
| 是否把外部刷新写成本组件 Job | no | refresh / availability recheck / view rebuild 归 `后台维护与收敛`。 |

#### R1.17.8 下一写入批次结构

| 写入内容 | 要求 |
|---|---|
| Command API 局部骨架 | 写 capture / accept / reject / unavailable / supersede external summary,register external source ref,register artifact archive ref,assert / reject external body boundary,link evidence lineage。 |
| Query API 局部骨架 | 写 get external summary、resolve external source ref、get artifact archive ref、body boundary diagnostic、external summary view、external basis history、evidence lineage hints。 |
| Inbound Event Consumer 候选 | 只写 body-free external summary/ref/digest/marker consumer 候选,明确 raw payload 禁止。 |
| Outbound Event 候选 | 写 external summary accepted / rejected / changed、external ref changed、artifact ref changed、body boundary violation noticed。 |
| 本组成部分不定义的接口 | 排除 raw document ingest、artifact upload body、external API proxy、governance workflow、standard parser、refresh job。 |
| 本组成部分停审 | 检查 no external body、typed ref 来源、view 不反写、bounded inbound、维护 job 后移、正式 §7 不修改。 |

#### R1.17.9 下一写入批次边界

- 只允许进入 Step 7 `外部摘要与引用接口:再写入`。
- 不写全仓 Command / Query / Inbound / Outbound / Operations 总表。
- 不写第七个组成部分 `后台维护与收敛接口:先思考`。
- 不改正式 `02-概要设计.md` §7。
- 不进入 Step 8 / Step 9。
- 不写 HTTP path、RPC method、完整 DTO schema、topic、payload、repository / port、事务、DDL、worker、配置项、外部 API 适配、URL 解析、parser、artifact schema、evidence JSON、对象存储路径、retention policy、治理流程或标准解释算法。

#### R1.17.10 自检

| 检查项 | 结论 |
|---|---|
| 是否只处理一个组成部分 | pass |
| 是否完成 Command / Query / Inbound / Outbound / Job 候选判断 | pass |
| 是否回指 Step 5 / Step 6 对象 | pass |
| 是否避免外部正文 / artifact 包体 / 证据正文入仓 | pass |
| 是否避免治理执行 / 标准解释越界 | pass |
| 是否避免 external view 反写 summary truth | pass |
| 是否写完整接口骨架表 | no |
| 是否允许进入外部摘要与引用接口:再写入 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `外部摘要与引用接口:再写入`;只写本组成部分的局部 Command / Query / Inbound Consumer / Outbound Event 候选骨架和停审记录,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.18 外部摘要与引用接口:再写入

#### R1.18.1 Command API 局部骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| CaptureExternalSourceSummary | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ExternalSourceRef`;`ExternalSafeSummary`;source kind;可选 `ArtifactArchiveRef`;可选 trace subject ref。 | `ExternalSourceSummaryRef`;summary captured summary;body-free marker。 | 从 typed external source ref 和安全摘要建立外部来源摘要。 | 不保存标准全文、ADR 正文、外部文档正文、artifact 包体、证据正文或外部 API payload。 |
| RegisterExternalSourceRef | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;external source kind;namespace ref;可选 source version ref;可选 digest ref。 | `ExternalSourceRef`;external source registered summary。 | 建立外部来源稳定 typed ref,供正式化、追溯、关系和外围组织引用。 | 不从 free-form URL、文件路径、route param 或 external id 直接拼 ref;不保存外部正文。 |
| RegisterArtifactArchiveRef | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;artifact kind;可选 `ExternalSourceRef`;可选 archive digest ref;retention context ref。 | `ArtifactArchiveRef`;artifact archive registered summary。 | 建立 artifact / archive 的 body-free 引用和摘要校验线索。 | 不保存文件内容、archive 包、证据正文、对象存储内容、存储路径或生命周期状态。 |
| AssertExternalBodyBoundary | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ExternalBodyBoundaryRuleRef`;candidate summary/ref/lineage refs。 | body boundary assertion summary;accepted / rejected marker;safe reason ref。 | 检查外部摘要、ref、artifact、lineage 是否违反正文禁止边界。 | 不返回被拒正文,不执行外部内容审查、标准解释或治理审批。 |
| RejectExternalBodyCandidate | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;external body candidate ref;`ExternalBodyBoundaryRuleRef`;violation reason ref。 | body rejection summary;violation ref。 | 显式拒绝外部正文、archive 包体、证据文件正文或 raw payload 入仓。 | 不保存被拒正文摘录、payload、文件内容或证据正文。 |
| AcceptExternalBasisSummary | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ExternalSourceSummaryRef`;可选 `GovernanceBasisRef`;acceptance reason ref。 | accepted external basis summary;history ref。 | 将已通过正文边界的外部摘要标记为可被本仓语义使用。 | 不执行治理裁决、Gate 流程、policy enforce 或标准解释。 |
| MarkExternalBasisDisposition | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ExternalSourceSummaryRef`;accepted / suspended / rejected / unavailable marker;safe reason ref。 | external basis disposition summary;history ref。 | 标记外部依据承接状态,解释可用、挂起、拒绝或不可用原因。 | 不同步修改正式版本、关系、追溯材料或外围对象。 |
| SupersedeExternalSourceSummary | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;previous `ExternalSourceSummaryRef`;next summary ref;supersession reason ref。 | external summary superseded summary。 | 用后续安全摘要替代旧摘要,保留历史和追溯线索。 | 不删除旧摘要,不复制外部正文,不重写已成立正式化结果。 |
| LinkExternalEvidenceLineage | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`TraceSubjectRef`;external source refs;artifact archive refs;可选 digest refs。 | `MethodAssetEvidenceLineageRef`;external lineage linked summary。 | 将 external ref 和 artifact/archive ref 串联为 body-free evidence lineage。 | 不保存证据文件正文、artifact 包体、验收报告正文或 archive 内容。 |

#### R1.18.2 Query API 局部骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetExternalSourceSummary | `ActorContext`;`QueryMetadata`;`ExternalSourceSummaryRef`。 | external safe summary;source ref;acceptance marker;body-free marker;optional artifact ref。 | `ExternalSourceSummary`;`ExternalSourceSummaryView`。 | 不返回外部正文、标准全文、ADR 正文、artifact 正文、archive 包体或外部 API payload。 |
| GetExternalSummaryBySourceRef | `ActorContext`;`QueryMetadata`;`ExternalSourceRef`;page / filter summary。 | external summary page;summary digest hints;acceptance markers。 | `ExternalSourceRef` + summary view。 | 不从 URL、path、external id 或 route param 反推来源。 |
| ResolveExternalSourceRef | `ActorContext`;`QueryMetadata`;`ExternalSourceRef`。 | external source ref summary;source kind;namespace ref;version hint;digest hint。 | `ExternalSourceRef`。 | 不暴露外部系统认证、权限、内部生命周期、provider payload 或正文地址。 |
| GetArtifactArchiveRef | `ActorContext`;`QueryMetadata`;`ArtifactArchiveRef`。 | artifact archive ref summary;artifact kind;external source ref;digest hint;retention context ref。 | `ArtifactArchiveRef`。 | 不返回文件内容、archive 包、证据正文、对象存储路径或 retention policy。 |
| GetExternalBodyBoundaryDiagnostic | `ActorContext`;`QueryMetadata`;`ExternalBodyBoundaryRuleRef`;candidate refs。 | body boundary diagnostic;accepted / rejected marker;safe reason refs。 | `ExternalBodyBoundaryRule` + summary / ref inputs。 | 不返回被拒正文内容、外部正文摘录、payload 或 evidence body。 |
| GetExternalSourceSummaryView | `ActorContext`;`QueryMetadata`;`ExternalSourceSummaryViewRef` 或 `ExternalSourceSummaryRef`。 | summary view;freshness marker;body-free marker;availability marker。 | `ExternalSourceSummaryView`。 | view 不成为 summary truth,不携带外部正文或外部系统状态。 |
| GetExternalBasisAcceptanceHistory | `ActorContext`;`QueryMetadata`;`ExternalSourceRef` 或 `GovernanceBasisRef`;page / scope summary。 | acceptance history summary page;digest hints;evidence lineage refs。 | `ExternalBasisAcceptanceHistory`。 | 不返回治理执行、审批过程、policy enforce、外部日志、report body 或正文。 |
| GetExternalEvidenceLineageHint | `ActorContext`;`QueryMetadata`;`TraceSubjectRef` 或 `MethodAssetEvidenceLineageRef`。 | evidence lineage summary;external source refs;artifact archive refs;digest refs。 | `MethodAssetEvidenceLineage` / artifact refs。 | 不返回证据文件正文、artifact 包体、archive 内容或验收报告正文。 |

#### R1.18.3 Inbound Event Consumer 候选

| Consumer | 输入骨架 | 处理摘要 | 边界 |
|---|---|---|---|
| ConsumeBodyFreeExternalSummaryAccepted | source system ref;`ExternalSourceRef`;safe summary ref/digest;body-free marker;trace context。 | 接收相邻仓或外部边界已形成的 body-free external summary,并进入本仓承接判断。 | 不接收 raw document、webhook payload、标准全文、ADR 正文、artifact body 或证据正文。 |
| ConsumeExternalSourceRefRegistered | source system ref;`ExternalSourceRef`;source kind;namespace ref;version hint;digest hint。 | 接收已形成的 typed external source ref 线索,用于后续 summary / basis 承接。 | 不把 URL、external id、file path 或 provider payload 当作正式 ref。 |
| ConsumeArtifactArchiveRefRegistered | source system ref;`ArtifactArchiveRef`;artifact kind;digest hint;optional external source ref。 | 接收 artifact/archive 的 body-free ref 和摘要校验线索。 | 不接收 archive 包、文件内容、对象存储内容、安装包或证据正文。 |
| ConsumeExternalBodyBoundaryViolation | source system ref;candidate ref;violation kind;safe reason ref;trace context。 | 接收正文边界违规线索,用于拒绝或审计材料。 | 不接收被拒正文、payload 摘录或外部文件内容。 |

#### R1.18.4 Outbound Event 候选

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| ExternalSourceSummaryChanged | summary captured / accepted / rejected / unavailable / superseded | `ExternalSourceSummaryRef`;`ExternalSourceRef`;change kind;acceptance marker;trace context。 | 正式化与版本、追溯与一致性保护、关系与分发语义、外围组织、后台维护。 | 不携带 external safe summary 正文全集、外部正文、topic / payload schema 或投递策略。 |
| ExternalSourceRefChanged | external source ref registered / version hint changed | `ExternalSourceRef`;source kind;version hint;digest hint;trace context。 | 正式化、追溯、关系、后台维护。 | 不携带 URL、外部正文、provider payload 或认证信息。 |
| ArtifactArchiveRefChanged | artifact archive ref registered / digest hint changed | `ArtifactArchiveRef`;artifact kind;digest hint;trace context。 | 追溯、证据 lineage、验收材料、后台维护。 | 不携带 artifact 包体、archive 内容、证据正文或存储路径。 |
| ExternalBodyBoundaryViolationNoticed | external body boundary assertion / rejection | candidate ref;violation kind;safe reason ref;trace context。 | 审计、追溯、后台维护、上游修正流程。 | 不携带被拒正文、payload、文件内容或证据正文。 |
| ExternalEvidenceLineageChanged | external evidence lineage linked / superseded | `MethodAssetEvidenceLineageRef`;external source refs;artifact refs;trace subject ref。 | 追溯、审计、验收、后台维护。 | 不携带 artifact 包体、archive 内容、证据正文或验收报告正文。 |

#### R1.18.5 本组成部分不定义的接口

| 不定义项 | 原因 | 后续承接 |
|---|---|---|
| RawExternalDocumentIngest | raw 文档、网页、标准全文、ADR 正文和 provider payload 不得入仓。 | 外部系统或相邻仓先转成 body-free summary / ref。 |
| ArtifactBodyUpload | artifact 文件、archive 包、证据文件和安装包正文不属于本仓 truth。 | artifact/archive 边界或外部存储系统。 |
| ExternalApiProxy | 本仓不代理外部 API,不拥有外部权限、认证、抓取或 provider 生命周期。 | 集成层或外部边界另行设计。 |
| GovernanceWorkflowCommand | 治理审批、裁决过程、policy enforce 和责任分派不属于本仓。 | L1-governance 或治理执行体系。 |
| StandardParserOrInterpreter | 标准解析、ADR 解释、文档抽取和内容审查不是本仓接口职责。 | 外部摘要生成边界或专门解释服务。 |
| ExternalSourceRefreshJob | 外部来源刷新、摘要 view rebuild 和引用可用性复核是维护动作。 | `后台维护与收敛`。 |
| EvidenceJsonSchema | 证据 JSON、artifact schema、验收报告 schema 不属于概要接口骨架。 | 测试方案、验收标准或详细设计按需展开。 |
| RetentionPolicyApi | 对象存储路径、保留策略、删除策略和归档生命周期不归本仓。 | artifact/archive 所属系统或运维设计。 |

#### R1.18.6 本组成部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只处理外部摘要与引用 | pass | 未进入后台维护、外围组织或全仓总表。 |
| 是否写入局部 Command 骨架 | pass | 覆盖 external summary capture / disposition、external ref、artifact ref、body boundary、evidence lineage。 |
| 是否写入局部 Query 骨架 | pass | 覆盖 external summary、source ref、artifact ref、body diagnostic、summary view、acceptance history、lineage hint。 |
| 是否写入 bounded Inbound Consumer 候选 | pass | 只接 body-free summary / ref / digest / marker,明确 raw payload 禁止。 |
| 是否写入 Outbound Event 候选 | pass | 只写外部摘要 / ref / artifact / boundary / lineage 事实候选,未写 topic / payload / outbox。 |
| 是否承接 Step 6 对象 | pass | 输入 / 输出回指 `ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef`、`GovernanceBasisRef`、`ExternalBodyBoundaryRule`、`ExternalSourceSummaryView`、`ExternalBasisAcceptanceHistory`、`MethodAssetEvidenceLineage`。 |
| 是否避免外部正文 / artifact 包体 / 证据正文入仓 | pass | 所有接口只使用 summary / ref / digest / marker / lineage。 |
| 是否避免治理执行 / 标准解释越界 | pass | governance workflow、standard parser、external API proxy 均列入不定义项。 |
| 是否避免 external view 反写 truth | pass | summary view 只读,刷新交给后台维护。 |
| 是否修改正式 §7 | no | 正式回填仍等待回填草稿和审计。 |
| 是否允许进入后台维护与收敛接口:先思考 | pass | 第六个组成部分局部骨架已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `后台维护与收敛接口:先思考`;只思考该组成部分的 Command / Query / Inbound / Outbound / Operations 候选、对象承接和禁止事项,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.19 后台维护与收敛接口:先思考

#### R1.19.1 问题回答

- 本模块只思考 `后台维护与收敛` 这个组成部分的接口候选,不写完整接口骨架表,不写全仓五类总表,不改正式 `02-概要设计.md` §7。
- 本组成部分的接口第一来源是 Step 5 `5.22` / `5.26.3` 和 Step 6 对象卡片:
  - operation task:`ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`。
  - recovery task:`ConsistencyRecoveryTask`。
  - maintenance refs:`MaintenanceRunRef`;`RefreshScopeRef`。
  - progress view:`MaintenanceProgressView`。
  - history:`MaintenanceRunHistory`。
- 本组成部分以 Operations Job 候选为主。凡是读取材料刷新、消费读取材料收敛、追溯材料刷新、外部引用有效性复核、一致性恢复收敛、外围材料刷新等,都属于 Operations Job 候选。
- 本组成部分需要 Query API。凡是读取维护进度、维护 run、refresh scope、任务摘要、恢复线索、维护历史和不可用 / 待收敛原因的入口,都属于 Query 候选。
- 本组成部分可以有极窄 Command API 候选,仅用于登记维护请求、挂起/取消维护请求或标记需要正式介入;这些 Command 不得创建、修改或修复业务 truth。
- 本组成部分原则上不直接需要 Inbound Event Consumer。上游 truth / summary / material changed 事件只作为触发维护范围的外部线索候选,是否落成 consumer 留到总表合并;本小循环不写 topic / payload / outbox。
- 本组成部分可以提出 Outbound Event 候选。事件只表达 maintenance requested、refresh converged / failed、recovery needed / suspended / converged、maintenance progress changed 等维护事实。

#### R1.19.2 对象承接判断

| Step 6 对象 / 能力 | 对 Step 7 的接口含义 | 当前判断 |
|---|---|---|
| `ReadMaterialRefreshTask` | 需要 Operations Job 候选来刷新目录、正式版本、消费、关系、分发、外部 summary view 和外围读取材料。 | 进入 Operations Job 候选池。 |
| `TraceMaterialRefreshTask` | 需要 Operations Job 候选来刷新 trace material、audit trail、evidence lineage、impact summary 读取材料。 | 进入 Operations Job 候选池。 |
| `ConsistencyRecoveryTask` | 需要 Operations Job / bounded Command 候选来承接可恢复异常、挂起、正式介入和收敛结果。 | 进入 Operations Job / Command 候选池。 |
| `MaintenanceRunRef` | 所有维护 run 必须用 typed ref 表达,不得用 worker id、job id、queue id、cron 名称替代。 | 作为输入 / 输出核心 ref。 |
| `RefreshScopeRef` | 所有刷新 / 恢复范围必须显式限定,不得用 free-form scope 字符串、query condition 或 cache key 代替。 | 作为 Operations Job 输入核心 ref。 |
| `MaintenanceProgressView` | 维护进度需要 Query 可见,但 view 不替代任务 truth、job 状态或 telemetry truth。 | 进入 Query 候选池。 |
| `MaintenanceRunHistory` | 维护运行来源、范围和结果需要审计 / 历史读取。 | 进入 bounded Query 候选池。 |

#### R1.19.3 Command 候选判断

| 候选方向 | 是否进入后续写入 | 理由 | 禁止事项 |
|---|---|---|---|
| 请求读取材料刷新 | yes_bounded | 需要显式登记维护请求和范围,但实际执行归 Operations Job。 | 不在 Command 中执行刷新,不修改 core truth,不写 worker / queue / retry。 |
| 请求追溯材料刷新 | yes_bounded | trace / audit / evidence / impact 材料可能需要人工或事件触发维护请求。 | 不保存 raw log、证据正文、report body 或 artifact 包体。 |
| 请求一致性恢复收敛 | yes_bounded | 可恢复异常需要形成 `ConsistencyRecoveryTask` 或维护运行语境。 | 不自动修复 definition、formal version、relation、external summary 或 package truth。 |
| 标记维护挂起 / 需要正式介入 | yes_bounded | 当外部依据缺失、下游摘要缺失或边界冲突时,需要显式挂起或升级。 | 不重做正式化裁决,不绕过消费边界,不复制外部正文补齐。 |
| 取消 / supersede 维护请求 | yes_bounded | 范围变化或后续 run 替代时需要停止旧请求的可见线索。 | 不删除历史,不隐藏失败,不改写已生成维护结果。 |
| 直接执行维护任务 | no_as_command | 执行属于 Operations Job。 | 不在业务 Command 中跑刷新、恢复、重建或扫描。 |

#### R1.19.4 Query 候选判断

| 候选方向 | 是否进入后续写入 | 读取来源 | 禁止事项 |
|---|---|---|---|
| 获取维护进度 | yes | `MaintenanceProgressView`。 | 不返回 worker 状态、queue 状态、raw log、telemetry body 或 report body。 |
| 按维护 run 读取进度 | yes | `MaintenanceRunRef` + progress view。 | 不把 maintenance run ref 等同 job id、worker id、scheduler id。 |
| 按 refresh scope 读取进度 | yes | `RefreshScopeRef` + progress view。 | 不暴露 query condition、batch cursor、cache key、lock 或 retry token。 |
| 获取读取材料刷新任务摘要 | yes | `ReadMaterialRefreshTask`;progress view。 | 不返回 projection storage、cache/index 实现或刷新算法。 |
| 获取追溯材料刷新任务摘要 | yes | `TraceMaterialRefreshTask`;progress view。 | 不返回 raw log、event payload、证据正文或 report body。 |
| 获取一致性恢复任务摘要 | yes | `ConsistencyRecoveryTask`;maintenance history。 | 不返回恢复脚本、自动修复策略、下游运行状态或正式化执行过程。 |
| 查询维护运行历史 | bounded_yes | `MaintenanceRunHistory`。 | 不返回 worker/job/queue/cron/lock/retry、raw log、metric、trace span。 |
| 列出待收敛 / 待恢复 / 显式不可用范围 | yes | task + progress view + refresh scope refs。 | 不把待收敛解释为 truth 未成立,不反向回滚核心对象。 |

#### R1.19.5 Operations Job 候选判断

| Job 候选方向 | 是否进入后续写入 | 来源对象 | 禁止事项 |
|---|---|---|---|
| 刷新目录 / 定义 / 正式版本读取材料 | yes | `ReadMaterialRefreshTask`;`RefreshScopeRef`。 | 不修改 definition truth、catalog truth、formal version truth。 |
| 刷新消费读取材料和 availability view | yes | `ReadMaterialRefreshTask`;consumption material refs。 | 不重新裁决消费边界,不扩大消费授权。 |
| 刷新关系 / 分发读取材料 | yes | `ReadMaterialRefreshTask`;relation / distribution refs。 | 不创建或修改 relation truth,不写 graph traversal / recommendation。 |
| 刷新外部摘要 view / 引用有效性线索 | yes | `ReadMaterialRefreshTask`;external refs。 | 不复制外部正文,不代理外部 API,不拥有 external lifecycle。 |
| 刷新追溯材料 / audit / evidence lineage / impact view | yes | `TraceMaterialRefreshTask`。 | 不保存 raw log、证据正文、artifact 包体、report body。 |
| 推进一致性恢复收敛 | yes | `ConsistencyRecoveryTask`。 | 不自动修复核心 truth,不重做正式化,不绕过消费或外部正文边界。 |
| 刷新外围 package / method set 读取材料 | yes_bounded | `ReadMaterialRefreshTask`;peripheral refs。 | 不让外围不可用影响核心闭环成立,不进入 marketplace 交易。 |
| 运行通用 worker / scheduler / retry loop | no | 不属于概要接口骨架。 | 不写 job runtime、queue、topic、cron、lock、retry、adapter 或 DDL。 |

#### R1.19.6 Event / Inbound 候选判断

| 类别 | 候选方向 | 当前裁决 | 理由 |
|---|---|---|---|
| Inbound Event Consumer | truth / summary / material changed triggers maintenance | no_for_this_component_loop | 可作为后续总表合并候选,本小循环不写 topic / payload / outbox。 |
| Inbound Event Consumer | raw worker / telemetry event | no | raw worker、telemetry、metric、trace span 不是业务接口输入。 |
| Outbound Event | maintenance requested | yes_candidate | 维护请求形成后,读取方和审计需要可见。 |
| Outbound Event | read material refresh converged / failed / unavailable | yes_candidate | 读取材料状态变化影响 Query 可见性。 |
| Outbound Event | trace material refresh partial / converged | yes_candidate | 追溯材料可用性影响审计和影响解释。 |
| Outbound Event | consistency recovery needed / suspended / converged | yes_candidate | 恢复状态变化需要被正式流程、审计和读取侧感知。 |
| Outbound Event | maintenance progress changed | yes_candidate | 维护进度变化可供观察和后续刷新协调。 |

#### R1.19.7 诊断

- 如果维护接口直接修改 definition、formal version、relation、external summary 或 package truth,后台维护会变成第二业务写面,破坏 Step 5 的核心边界。
- 如果 `MaintenanceRunRef` 用 worker id、job id、queue id 或 cron 名称替代,概要接口会提前绑定实现机制,后续详细设计无法自由选择调度和执行模型。
- 如果 `RefreshScopeRef` 用 free-form query condition、cache key 或 batch cursor 表达,刷新范围会缺 typed ref 闭口,实现端容易私造范围解析。
- 如果 Query 返回 raw log、telemetry、trace span 或 report body,维护进度 view 会越界成为 observability / report storage。
- 如果一致性恢复可以自动重做正式化、绕过消费边界或复制外部正文,恢复路径会绕过正式业务流程和正文禁止边界。
- 如果维护没有 Operations Job 候选,读取材料刷新和恢复收敛会被迫落在业务 Command 或 Query 里,形成同步修复和读路径写入风险。

#### R1.19.8 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| 是否把后台维护作为 Operations Job 为主的接口族 | yes | Step 5 已将其定位为 support-operation,核心是刷新 / 恢复 / 收敛。 |
| 是否保留维护请求 Command | yes_bounded | 只登记请求、范围和挂起 / 介入线索,不执行维护、不修 truth。 |
| 是否提供维护进度 Query | yes | 读取侧需要解释 pending / stale / recovery needed / unavailable。 |
| 是否定义 worker / queue / scheduler 接口 | no | 这是实现机制,不属于概要接口骨架。 |
| 是否允许维护修复 core truth | no | 维护只刷新派生材料和推进正式恢复流程,不得成为第二 truth 写面。 |
| 是否写 inbound trigger consumer | no_for_this_loop | 事件触发维护可在总表合并时判断,本组成部分先不写 consumer 骨架。 |

#### R1.19.9 下一写入批次结构

| 写入内容 | 要求 |
|---|---|
| Bounded Command API 局部骨架 | 写 request read refresh、request trace refresh、request consistency recovery、mark suspended / formal intervention、cancel / supersede maintenance request。 |
| Query API 局部骨架 | 写 maintenance progress、progress by run/scope、refresh task summary、recovery task summary、maintenance history、pending/recovery ranges。 |
| Operations Job 局部骨架 | 写 read material refresh、consumption availability refresh、relation/distribution material refresh、external reference refresh、trace material refresh、consistency recovery、peripheral material refresh。 |
| Outbound Event 候选 | 写 maintenance requested、refresh converged / failed / unavailable、trace refresh partial / converged、recovery needed / suspended / converged、progress changed。 |
| 本组成部分不定义的接口 | 排除 worker runtime、scheduler、queue、topic、retry、lock、DDL、raw telemetry、truth repair、external body补齐。 |
| 本组成部分停审 | 检查 no core truth repair、typed run/scope refs、Operations Job 不写实现、Query 不返回 logs、正式 §7 不修改。 |

#### R1.19.10 下一写入批次边界

- 只允许进入 Step 7 `后台维护与收敛接口:再写入`。
- 不写全仓 Command / Query / Inbound / Outbound / Operations 总表。
- 不写第八个组成部分 `外围包与方法集组织接口:先思考`。
- 不改正式 `02-概要设计.md` §7。
- 不进入 Step 8 / Step 9。
- 不写 HTTP path、RPC method、完整 DTO schema、topic、payload、repository / port、事务、DDL、worker、scheduler、queue、cron、retry、lock、adapter、cache/index/store、刷新算法、恢复脚本、状态迁移矩阵或观测指标 schema。

#### R1.19.11 自检

| 检查项 | 结论 |
|---|---|
| 是否只处理一个组成部分 | pass |
| 是否完成 Command / Query / Operations Job / Event 候选判断 | pass |
| 是否回指 Step 5 / Step 6 对象 | pass |
| 是否避免维护路径修复 core truth | pass |
| 是否避免 worker / scheduler / queue / retry 实现下沉 | pass |
| 是否避免 raw log / telemetry / report body 入仓 | pass |
| 是否写完整接口骨架表 | no |
| 是否允许进入后台维护与收敛接口:再写入 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `后台维护与收敛接口:再写入`;只写本组成部分的 bounded Command / Query / Operations Job / Outbound Event 候选骨架和停审记录,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.20 后台维护与收敛接口:再写入

#### R1.20.1 Bounded Command API 局部骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| RequestReadMaterialRefresh | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`RefreshScopeRef`;target material refs;request reason ref。 | `MaintenanceRunRef`;`ReadMaterialRefreshTaskRef`;request accepted summary。 | 登记读取材料刷新请求和刷新范围,供 Operations Job 后续执行。 | 不在 Command 中执行刷新;不修改 definition、catalog、formal version、relation、external summary 或 package truth。 |
| RequestTraceMaterialRefresh | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`RefreshScopeRef`;trace subject refs;可选 audit / evidence / impact refs。 | `MaintenanceRunRef`;`TraceMaterialRefreshTaskRef`;request accepted summary。 | 登记 trace、audit、evidence lineage、impact view 的刷新请求。 | 不保存 raw log、trace span、event payload、证据正文、report body 或 artifact 包体。 |
| RequestConsistencyRecovery | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`RefreshScopeRef`;recovery reason ref;affected subject refs;related material refs。 | `MaintenanceRunRef`;`ConsistencyRecoveryTaskRef`;recovery request summary。 | 登记可恢复异常的收敛请求和影响范围。 | 不自动修复 core truth,不重做正式化,不绕过受控消费或外部正文边界。 |
| MarkMaintenanceSuspended | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MaintenanceRunRef`;suspension reason ref;optional formal intervention ref。 | maintenance suspended summary。 | 标记维护或恢复因外部依据、下游摘要、边界冲突而挂起。 | 不隐藏失败,不复制外部正文补齐,不把挂起解释为 truth 不成立。 |
| RequireMaintenanceFormalIntervention | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ConsistencyRecoveryTaskRef`;formal intervention ref;safe reason ref。 | formal intervention required summary。 | 标记恢复无法由维护任务闭合,需要正式流程或人工介入。 | 不直接执行治理审批、正式化裁决、版本替代或消费边界修改。 |
| SupersedeMaintenanceRequest | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;previous `MaintenanceRunRef`;next `MaintenanceRunRef`;supersession reason ref。 | maintenance request superseded summary。 | 用后续维护运行替代旧维护请求,保留历史和可见线索。 | 不删除旧 run history,不改写已生成维护结果,不重放 worker 任务。 |

#### R1.20.2 Query API 局部骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMaintenanceProgress | `ActorContext`;`QueryMetadata`;`MaintenanceProgressViewRef`。 | progress summary;maintenance run ref;refresh scope ref;freshness / recovery markers。 | `MaintenanceProgressView`。 | 不返回 worker 状态、queue 状态、raw log、telemetry body、metric 或 report body。 |
| GetMaintenanceProgressByRun | `ActorContext`;`QueryMetadata`;`MaintenanceRunRef`。 | progress view summary;task refs;history hints。 | `MaintenanceRunRef` + `MaintenanceProgressView`。 | 不把 maintenance run ref 等同 job id、worker id、scheduler id 或 retry token。 |
| GetMaintenanceProgressByScope | `ActorContext`;`QueryMetadata`;`RefreshScopeRef`;page / filter summary。 | progress view page;pending / converged / unavailable ranges。 | `RefreshScopeRef` + progress view。 | 不暴露 query condition、batch cursor、cache key、lock 或 retry token。 |
| GetReadMaterialRefreshTaskSummary | `ActorContext`;`QueryMetadata`;`ReadMaterialRefreshTaskRef`。 | read refresh task summary;target material refs;progress marker。 | `ReadMaterialRefreshTask`;progress view。 | 不返回 projection storage、cache/index 实现、refresh algorithm 或 material body。 |
| GetTraceMaterialRefreshTaskSummary | `ActorContext`;`QueryMetadata`;`TraceMaterialRefreshTaskRef`。 | trace refresh task summary;trace subject refs;evidence lineage refs;progress marker。 | `TraceMaterialRefreshTask`;progress view。 | 不返回 raw log、event payload、证据正文、artifact 包体或 report body。 |
| GetConsistencyRecoveryTaskSummary | `ActorContext`;`QueryMetadata`;`ConsistencyRecoveryTaskRef`。 | recovery task summary;reason refs;affected subject refs;formal intervention hints。 | `ConsistencyRecoveryTask`;maintenance history。 | 不返回恢复脚本、自动修复策略、下游运行状态或正式化执行过程。 |
| GetMaintenanceRunHistory | `ActorContext`;`QueryMetadata`;`MaintenanceRunRef` 或 `RefreshScopeRef`;page / scope summary。 | maintenance history summary page;outcome markers;digest hints。 | `MaintenanceRunHistory`。 | 不返回 worker/job/queue/cron/lock/retry、raw log、metric、trace span 或 report body。 |
| ListPendingMaintenanceScopes | `ActorContext`;`QueryMetadata`;scope kind;page / filter summary。 | pending / stale / recovery needed / unavailable scope page。 | task + progress view + refresh scope refs。 | 不把待收敛解释为 truth 未成立,不回滚核心对象。 |

#### R1.20.3 Operations Job 局部骨架

| Operations Job | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| RefreshCatalogAndDefinitionReadMaterials | `MaintenanceRunRef`;`RefreshScopeRef`;definition / catalog truth refs;target material refs。 | refresh result summary;material freshness refs;progress marker。 | 从已成立 definition / catalog truth 刷新目录与定义读取材料。 | 不修改 definition truth、catalog truth、history truth;不写 cache/index/store 实现。 |
| RefreshFormalVersionReadMaterials | `MaintenanceRunRef`;`RefreshScopeRef`;formal version refs;target view/material refs。 | refresh result summary;freshness refs;progress marker。 | 刷新正式版本读取材料和可读摘要。 | 不改变正式化结果、版本 truth、basis summary 或状态迁移。 |
| RefreshConsumptionReadMaterials | `MaintenanceRunRef`;`RefreshScopeRef`;consumption material refs;availability view refs。 | consumption refresh summary;availability freshness markers。 | 刷新受控消费读取材料和 availability view。 | 不重新裁决消费边界,不扩大消费授权,不扫描下游运行状态。 |
| RefreshRelationDistributionMaterials | `MaintenanceRunRef`;`RefreshScopeRef`;relation refs;distribution refs;read material refs。 | relation / distribution refresh summary;staleness cleared marker。 | 刷新关系 view 和分发读取材料。 | 不创建或修改 relation truth,不执行图遍历、推荐、搜索排序。 |
| RefreshExternalSummaryReadMaterials | `MaintenanceRunRef`;`RefreshScopeRef`;external summary / ref / artifact refs。 | external summary refresh result;validity / freshness markers。 | 刷新外部摘要 view 和引用有效性线索。 | 不复制外部正文,不代理外部 API,不拥有 external source lifecycle。 |
| RefreshTraceAuditImpactMaterials | `MaintenanceRunRef`;`RefreshScopeRef`;trace subject refs;audit / evidence / impact refs。 | trace refresh result;partial / converged markers。 | 刷新追溯材料、审计线索、证据 lineage 和影响摘要读取材料。 | 不保存 raw log、证据正文、artifact 包体、archive 内容、report body。 |
| RunConsistencyRecoveryConvergence | `MaintenanceRunRef`;`ConsistencyRecoveryTaskRef`;recovery scope;related material refs。 | recovery convergence summary;converged / suspended / rejected marker。 | 推进读取材料缺失、引用失效、摘要不一致或传播滞后的恢复收敛。 | 不自动修复 core truth,不重做正式化,不绕过消费边界,不复制外部正文。 |
| RefreshPeripheralReadMaterials | `MaintenanceRunRef`;`RefreshScopeRef`;package / method set refs;peripheral view refs。 | peripheral refresh summary;availability markers。 | 刷新外围 package / method set 读取材料和可发现线索。 | 不让外围不可用影响核心闭环成立,不进入 marketplace 交易、安装或履约。 |

#### R1.20.4 Outbound Event 候选

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| MethodAssetMaintenanceRequested | bounded maintenance request accepted | `MaintenanceRunRef`;`RefreshScopeRef`;run kind;safe reason ref;trace context。 | 维护进度读取、审计、后台协调。 | 不携带 worker、queue、scheduler、retry、topic 或 payload schema。 |
| MethodAssetReadMaterialRefreshChanged | read refresh job result | `ReadMaterialRefreshTaskRef`;`MaintenanceRunRef`;refresh outcome;freshness refs。 | Query surfaces、受控消费、关系分发、外围读取。 | 不携带 material body、cache/index details 或 projection storage。 |
| MethodAssetTraceMaterialRefreshChanged | trace refresh job result | `TraceMaterialRefreshTaskRef`;trace subject refs;partial / converged marker。 | 追溯、审计、验收、影响解释。 | 不携带 raw log、event payload、证据正文、report body。 |
| MethodAssetConsistencyRecoveryChanged | recovery task result | `ConsistencyRecoveryTaskRef`;recovery outcome;formal intervention hint。 | 追溯一致性、维护读取、正式流程。 | 不声明 core truth 已被自动修复,不携带恢复脚本或下游运行状态。 |
| MethodAssetMaintenanceProgressChanged | progress view changed | `MaintenanceProgressViewRef`;`MaintenanceRunRef`;progress marker;safe reason ref。 | 维护进度 Query、审计、运维观测。 | 不携带 raw telemetry、metric body、trace span、worker state 或 report body。 |

#### R1.20.5 本组成部分不定义的接口

| 不定义项 | 原因 | 后续承接 |
|---|---|---|
| WorkerRuntimeApi | worker loop、worker id、runtime health 和执行线程不属于概要接口。 | 实施 / 运维设计。 |
| SchedulerOrCronApi | 调度频率、cron、queue、topic、lock、retry 是实现机制。 | 详细设计或运维配置。 |
| MaintenanceStorageApi | cache、index、store、projection table、DDL 和 adapter 不属于 Step 7。 | 详细设计 / 持久化设计。 |
| RawTelemetryIngest | telemetry、metric、trace span、raw log 不属于业务接口输入。 | 观测体系。 |
| TruthRepairCommand | 后台维护不能创建、修改、删除或修复 core truth。 | 正式业务 Command / 正式流程。 |
| ExternalBodyBackfill | 外部引用失效或摘要缺失时不得复制外部正文补齐。 | 外部摘要与引用边界。 |
| RecoveryScriptApi | 恢复脚本、自动修复策略和补偿实现不属于概要接口骨架。 | 详细设计按正式边界展开。 |
| DownstreamRuntimeScanJob | process、identity、runtime、member-images、UI 或 SDK 内部状态不得成为恢复输入。 | 对应下游系统自行负责。 |

#### R1.20.6 本组成部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只处理后台维护与收敛 | pass | 未进入外围包与方法集组织或全仓总表。 |
| 是否写入 bounded Command 骨架 | pass | 覆盖 read refresh、trace refresh、recovery request、suspend、formal intervention、supersede request。 |
| 是否写入 Query 骨架 | pass | 覆盖 progress、run/scope、refresh task、recovery task、history、pending scopes。 |
| 是否写入 Operations Job 骨架 | pass | 覆盖读取材料、消费材料、关系分发、外部摘要、追溯材料、一致性恢复、外围材料刷新。 |
| 是否写入 Outbound Event 候选 | pass | 只写维护请求、刷新结果、恢复结果、进度变化事实候选,未写 topic / payload / outbox。 |
| 是否承接 Step 6 对象 | pass | 输入 / 输出回指 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceRunRef`、`RefreshScopeRef`、`MaintenanceProgressView`、`MaintenanceRunHistory`。 |
| 是否避免维护路径修复 core truth | pass | 所有 job 均限定为派生材料刷新和恢复收敛。 |
| 是否避免 worker / scheduler / queue / retry 实现下沉 | pass | worker runtime、scheduler、queue、retry、lock、storage 均列入不定义项。 |
| 是否避免 raw log / telemetry / report body 入仓 | pass | 维护进度和历史只保留 body-free summary / marker。 |
| 是否修改正式 §7 | no | 正式回填仍等待回填草稿和审计。 |
| 是否允许进入外围包与方法集组织接口:先思考 | pass | 第七个组成部分局部骨架已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `外围包与方法集组织接口:先思考`;只思考该组成部分的 Command / Query / Inbound / Outbound / Operations 候选、对象承接和禁止事项,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.21 外围包与方法集组织接口:先思考

#### R1.21.1 问题回答

- 本模块只思考 `外围包与方法集组织` 这个组成部分的接口候选,不写完整接口骨架表,不写全仓五类总表,不改正式 `02-概要设计.md` §7。
- 本组成部分是 peripheral,只回答“已经成立或允许引用的方法资产如何被组织成方法资产包、组织级方法集和生态发现语境”,不回答核心定义、正式化、受控消费、追溯一致性如何成立。
- 本组成部分存在 bounded Command 候选。`MethodPackage` 和 `MethodSetAssembly` 是 peripheral truth candidate,因此建立、调整、退役、标记不可用和组成规则裁决需要可追溯写入口。
- 本组成部分存在 Query 候选。`MethodPackageView`、`MethodSetAssemblyView`、`PackageAssemblyHistory` 和 composition diagnostic 需要只读入口,供外围发现、采用评估和审计解释使用。
- 本组成部分原则上不需要直接 Inbound Event Consumer。marketplace / external ecosystem context 不能以原始事件或 listing / transaction 正文进入本组成部分;外部变化应先由 `外部摘要与引用` 承接为 body-free summary / ref,再由后台维护刷新外围读取材料。
- 本组成部分可以产生 Outbound Event 候选。事件只表达 package organization changed、method set assembly changed、composition result changed、peripheral view availability changed 等本仓外围事实或材料状态变化。
- 本组成部分不单独定义 Operations Job。外围 package / method set 读取材料刷新已经由 `后台维护与收敛` 的 `RefreshPeripheralReadMaterials` 承接;本模块只保留其 job 输入输出对象来源。

#### R1.21.2 对象承接判断

| Step 6 对象 / 能力 | 对 Step 7 的接口含义 | 当前判断 |
|---|---|---|
| `MethodPackage` | 有 peripheral truth candidate,需要建立、调整、退役和不可用标记的 bounded Command 候选。 | 进入 Command 候选池。 |
| `MethodSetAssembly` | 有组织级方法集组装 truth candidate,需要组装、调整、退役、stale / unavailable 标记的 bounded Command 候选。 | 进入 Command 候选池。 |
| `PackageCompositionRule` | 需要组成边界判断和 invalid composition 解释,但不写完整规则算法。 | 进入 Command / Query 候选池。 |
| `MethodPackageView` | 需要 package 只读发现和采用评估入口,但 view 不替代 package truth。 | 进入 Query 候选池。 |
| `MethodSetAssemblyView` | 需要 method set 只读组装视图和外围采用评估入口,但 view 不替代 assembly truth。 | 进入 Query 候选池。 |
| `MethodPackageRef` | 所有 package 接口必须使用 typed ref,不得使用 marketplace id、listing id、package file path 或 route param 替代。 | 作为输入 / 输出核心 ref。 |
| `MethodSetAssemblyRef` | 所有 method set 接口必须使用 typed ref,不得使用组织运行实例 id、UI preset id 或 SDK profile id 替代。 | 作为输入 / 输出核心 ref。 |
| `MarketplaceContextRef` | 只表达生态发现上下文引用,不得承接定价、订单、安装、履约或 listing body。 | 作为可选 boundary ref。 |
| `PackageAssemblyHistory` | package / method set 变化需要历史读取和审计解释。 | 进入 Query / Outbound 候选池。 |

#### R1.21.3 Command 候选判断

| 候选方向 | 是否进入后续写入 | 理由 | 禁止事项 |
|---|---|---|---|
| EstablishMethodPackage | yes_bounded | 建立围绕已成立核心资产和分发语义的外围 package organization truth。 | 不创建核心定义、不发布正式版本、不保存包体、不形成 marketplace listing。 |
| AdjustMethodPackageComposition | yes_bounded | package 成员、正式版本线索、distribution context 或 marketplace context 可发生外围调整。 | 不改写成员 asset truth、relation truth 或 consumption boundary。 |
| RetireMethodPackage | yes_bounded | package 组织语义需要退役而不删除历史。 | 不删除成员资产、不撤销正式版本、不改写 marketplace 外部状态。 |
| MarkMethodPackageUnavailable | yes_bounded | 成员引用、composition rule 或 ecosystem context 不可用时需要显式隔离。 | 不把外围不可用解释为核心闭环失效。 |
| AssembleMethodSet | yes_bounded | 组织级方法集可从 package refs 或 asset refs 建立外围组装语义。 | 不保存组织运行配置、UI 状态、SDK 本地状态或下游采用成功事实。 |
| AdjustMethodSetAssembly | yes_bounded | method set 的 package refs、member refs、adoption context 或 boundary refs 需要调整。 | 不扩大消费授权、不绕过正式消费材料、不替代正式版本。 |
| RetireMethodSetAssembly | yes_bounded | method set 组装可退役或 supersede。 | 不删除 package / asset truth,不隐藏历史。 |
| MarkMethodSetAssemblyStaleOrUnavailable | yes_bounded | 依赖 package、成员、消费边界或 composition rule 变化后需要外围复核。 | 不修复核心 truth,不自动刷新读取材料。 |
| EvaluatePackageComposition | bounded_yes | 组成规则结果可作为写前 / 写后可追溯裁决摘要。 | 不写完整算法、规则矩阵、policy engine 或配置。 |
| PublishMarketplaceListing / InstallPackage | no | 交易、上架、安装、履约不是本仓 truth。 | 不定义 listing、price、order、license、install、fulfillment command。 |

#### R1.21.4 Query 候选判断

| 候选方向 | 是否进入后续写入 | 读取来源 | 禁止事项 |
|---|---|---|---|
| GetMethodPackage | yes | `MethodPackage`;`MethodPackageRef`。 | 不返回 package body、artifact/archive body、listing body 或交易状态。 |
| ListMethodPackages | yes | package refs / package view summary。 | 不做 marketplace 排序、推荐、搜索 ranking 或商业筛选。 |
| GetMethodPackageView | yes | `MethodPackageView`。 | 不把 view 当 package truth,不返回核心定义正文。 |
| GetMethodPackageCompositionDiagnostic | yes | `PackageCompositionRule`;package refs;safe reason refs。 | 不暴露完整规则算法、配置矩阵或 policy engine 内部。 |
| GetMethodSetAssembly | yes | `MethodSetAssembly`;`MethodSetAssemblyRef`。 | 不返回组织运行配置、UI preset、SDK profile 或 AI override 实现。 |
| ListMethodSetAssemblies | yes | assembly refs / assembly view summary。 | 不表达组织采用成功事实或下游运行状态。 |
| GetMethodSetAssemblyView | yes | `MethodSetAssemblyView`。 | 不绕过 consumption boundary,不扩大正式消费授权。 |
| GetPeripheralDiscoveryContext | bounded_yes | `MarketplaceContextRef`;distribution context refs;body-free summary。 | 不返回 marketplace listing、价格、订单、安装或履约正文。 |
| GetPackageAssemblyHistory | yes | `PackageAssemblyHistory`。 | 不返回 package body、组织配置正文、marketplace transaction 或 raw log。 |

#### R1.21.5 Event / Inbound / Operations 候选判断

| 类别 | 候选方向 | 当前裁决 | 理由 |
|---|---|---|---|
| Inbound Event Consumer | marketplace listing / transaction changed | no | listing、交易、安装、履约属于边界外,不得由事件直接进入 package truth。 |
| Inbound Event Consumer | external ecosystem context changed | no_for_this_component_loop | 先由 `外部摘要与引用` 承接 body-free summary / ref,本模块不直接消费外部正文事件。 |
| Inbound Event Consumer | package / method set read material stale trigger | no_for_this_component_loop | 触发刷新归 `后台维护与收敛`,本模块不写 consumer / topic。 |
| Outbound Event | method package changed | yes_candidate | package organization truth 变化需要被外围读取、维护刷新和审计感知。 |
| Outbound Event | method set assembly changed | yes_candidate | method set 组装变化会影响采用评估和外围读取材料。 |
| Outbound Event | composition result changed | yes_candidate | 组成规则裁决变化需要解释 invalid / unavailable / ready。 |
| Outbound Event | peripheral view availability changed | yes_candidate | package / assembly view stale、invalid 或 unavailable 会影响外围发现。 |
| Operations Job | refresh peripheral read materials | no_direct_definition | 已由后台维护的 `RefreshPeripheralReadMaterials` 承接,本模块只提供 refs / view 来源。 |

#### R1.21.6 诊断

- 如果 package command 可以创建或修改 `MethodAssetDefinition`、`FormalMethodAssetVersion`、`MethodAssetRelation` 或 consumption material,外围组织会变成第二核心写面。
- 如果 method set assembly 可以表达组织运行配置、SDK preset、UI 匹配状态或 AI policy override,本仓会越界进入 console / SDK / runtime 配置域。
- 如果 `MarketplaceContextRef` 被 marketplace listing id、price、order、install id 或 fulfillment id 替代,外围发现引用会滑向交易履约 truth。
- 如果 package / method set Query 返回 artifact/archive/package body,Step 6 的 body-free 边界会被破坏。
- 如果外围不可用会阻塞核心定义、正式化、受控消费或追溯一致性,就违反 Step 5 对 peripheral 的隔离裁决。
- 如果本模块自行定义 refresh job 或 direct inbound consumer,会与后台维护和外部摘要两个已闭合组成部分重复,并诱发 topic / worker / adapter 下沉。

#### R1.21.7 取舍

| 事项 | 裁决 | 理由 |
|---|---|---|
| 是否保留 package / method set Command | yes_bounded | 二者是 peripheral truth candidate,需要正式写入口和历史。 |
| 是否提供 package / method set Query | yes | 外围发现、采用评估和审计解释需要只读入口。 |
| 是否直接消费 marketplace 事件 | no | marketplace 交易履约和 listing body 不属于本仓。 |
| 是否定义外围刷新 Job | no_direct_definition | 后台维护已承接 `RefreshPeripheralReadMaterials`。 |
| 是否输出外围变化事件 | yes_candidate | 外围变化需要驱动读取材料刷新和审计解释。 |
| 是否让外围组织成为核心前置 | no | Step 5 已明确 peripheral 不阻塞核心闭环。 |

#### R1.21.8 下一写入批次结构

| 写入内容 | 要求 |
|---|---|
| Bounded Command API 局部骨架 | 写 establish / adjust / retire / unavailable package,assemble / adjust / retire / stale-or-unavailable method set,evaluate composition。 |
| Query API 局部骨架 | 写 package、package view、composition diagnostic、method set、method set view、peripheral discovery context、assembly history。 |
| Outbound Event 候选 | 写 package changed、method set assembly changed、composition result changed、peripheral view availability changed。 |
| 本组成部分不定义的接口 | 排除 marketplace listing / transaction / install / fulfillment、package body、artifact body、org runtime config、UI / SDK / AI override。 |
| 本组成部分停审 | 检查 peripheral isolation、typed refs、body-free、no direct inbound、no direct job、正式 §7 不修改。 |

#### R1.21.9 下一写入批次边界

- 只允许进入 Step 7 `外围包与方法集组织接口:再写入`。
- 不写全仓 Command / Query / Inbound / Outbound / Operations 总表。
- 不进入 `Command API 骨架总表`。
- 不改正式 `02-概要设计.md` §7。
- 不进入 Step 8 / Step 9。
- 不写 HTTP path、RPC method、完整 DTO schema、topic、payload、repository / port、事务、DDL、worker、scheduler、queue、cron、retry、lock、adapter、marketplace listing、订单、安装、履约、artifact/archive/package body、组织运行配置、UI 状态、SDK profile 或 AI policy override。

#### R1.21.10 自检

| 检查项 | 结论 |
|---|---|
| 是否只处理外围包与方法集组织 | pass |
| 是否完成 Command / Query / Event / Inbound / Operations 候选判断 | pass |
| 是否回指 Step 5 / Step 6 对象 | pass |
| 是否标注 peripheral 不阻塞核心闭环 | pass |
| 是否避免 marketplace 交易 / 安装 / 履约越界 | pass |
| 是否避免 package body / artifact body 入仓 | pass |
| 是否避免组织运行配置 / UI / SDK / AI override 越界 | pass |
| 是否写完整接口骨架表 | no |
| 是否允许进入外围包与方法集组织接口:再写入 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `外围包与方法集组织接口:再写入`;只写本组成部分的 bounded Command / Query / Outbound Event 候选骨架和停审记录,不得写全仓五类总表,不得改正式 §7,不得进入 Step 8/9。

### R1.22 外围包与方法集组织接口:再写入

#### R1.22.1 Bounded Command API 局部骨架

| Command | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| EstablishMethodPackage | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodPackageRef`;package member refs;formal version refs;distribution context refs;`PackageCompositionRuleRef`;optional `MarketplaceContextRef`;reason ref。 | package accepted summary;`MethodPackageRef`;optional `PackageAssemblyHistoryRef`。 | 建立围绕已成立方法资产和分发语义的外围 package organization truth。 | 不创建核心定义,不发布正式版本,不保存 package / artifact / archive body,不形成 marketplace listing。 |
| AdjustMethodPackageComposition | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodPackageRef`;member change summary;version / distribution context refs;composition reason ref。 | package adjusted summary;composition result summary;history ref。 | 调整 package 成员、正式版本线索、分发语境或生态发现上下文。 | 不改写成员 asset truth、relation truth、consumption boundary 或外部 marketplace 状态。 |
| RetireMethodPackage | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodPackageRef`;retirement reason ref;replacement package ref optional。 | package retired summary;history ref。 | 将外围 package 组织语义退役或替代,保留历史线索。 | 不删除成员方法资产,不撤销正式版本,不隐藏旧 package 历史。 |
| MarkMethodPackageUnavailable | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodPackageRef`;unavailable reason ref;affected member / context refs。 | package unavailable summary;safe reason ref;history ref。 | 当成员引用、组成规则或生态上下文不可用时,显式隔离外围 package。 | 不把外围不可用解释为核心闭环失效,不自动修复成员 truth。 |
| AssembleMethodSet | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodSetAssemblyRef`;package refs;method asset refs;`ConsumptionContextRef`;optional consumption boundary refs;reason ref。 | assembly accepted summary;`MethodSetAssemblyRef`;history ref。 | 从 package refs 或 asset refs 建立组织级方法集组装语义。 | 不保存组织运行配置、UI 状态、SDK profile、AI override 或下游采用成功事实。 |
| AdjustMethodSetAssembly | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodSetAssemblyRef`;package / member change summary;adoption context refs;composition reason ref。 | assembly adjusted summary;composition result summary;history ref。 | 调整 method set 的 package、成员、采用语境或边界引用。 | 不扩大消费授权,不绕过正式消费材料,不替代正式版本或关系 truth。 |
| RetireMethodSetAssembly | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodSetAssemblyRef`;retirement reason ref;replacement assembly ref optional。 | assembly retired summary;history ref。 | 退役或替代组织级方法集组装语义。 | 不删除 package / asset truth,不隐藏历史,不修改组织运行状态。 |
| MarkMethodSetAssemblyStaleOrUnavailable | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MethodSetAssemblyRef`;stale / unavailable reason ref;affected package / asset / boundary refs。 | assembly stale / unavailable summary;history ref。 | 在依赖 package、成员、消费边界或 composition rule 变化后标记外围复核状态。 | 不修复核心 truth,不自动刷新读取材料,不直接触发 worker 实现。 |
| EvaluatePackageComposition | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;package or assembly ref;`PackageCompositionRuleRef`;candidate member refs;safe reason ref。 | composition evaluation summary;accepted / rejected marker;safe reason refs。 | 对 package 或 method set 组成边界做可追溯裁决摘要。 | 不写完整规则算法、规则矩阵、policy engine、配置项或执行脚本。 |

#### R1.22.2 Query API 局部骨架

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetMethodPackage | `ActorContext`;`QueryMetadata`;`MethodPackageRef`。 | package truth summary;member refs;distribution context refs;composition marker。 | `MethodPackage`。 | 不返回 package body、artifact/archive body、listing body、交易状态或核心定义正文。 |
| ListMethodPackages | `ActorContext`;`QueryMetadata`;scope / context filter summary;page。 | package summary page;availability markers。 | package refs + `MethodPackageView` summary。 | 不做 marketplace ranking、推荐、商业筛选、安装可用性判断。 |
| GetMethodPackageView | `ActorContext`;`QueryMetadata`;`MethodPackageViewRef` 或 `MethodPackageRef`。 | package view summary;member definition refs;formal version refs;freshness marker。 | `MethodPackageView`。 | view 只读可重建,不得替代 package truth 或核心定义读取材料。 |
| GetMethodPackageCompositionDiagnostic | `ActorContext`;`QueryMetadata`;`MethodPackageRef`;optional `PackageCompositionRuleRef`。 | composition diagnostic;invalid / unavailable reason refs。 | `PackageCompositionRule`;package refs;safe reason refs。 | 不暴露完整规则算法、配置矩阵或 policy engine 内部。 |
| GetMethodSetAssembly | `ActorContext`;`QueryMetadata`;`MethodSetAssemblyRef`。 | assembly truth summary;package refs;asset refs;adoption context refs。 | `MethodSetAssembly`。 | 不返回组织运行配置、UI preset、SDK profile、AI override 或下游采用结果。 |
| ListMethodSetAssemblies | `ActorContext`;`QueryMetadata`;adoption / context filter summary;page。 | assembly summary page;availability / stale markers。 | assembly refs + `MethodSetAssemblyView` summary。 | 不表达组织采用成功事实,不读取下游 runtime state。 |
| GetMethodSetAssemblyView | `ActorContext`;`QueryMetadata`;`MethodSetAssemblyViewRef` 或 `MethodSetAssemblyRef`。 | assembly view summary;package/member refs;composition marker;freshness marker。 | `MethodSetAssemblyView`。 | 不扩大 consumption boundary,不替代正式消费材料。 |
| GetPeripheralDiscoveryContext | `ActorContext`;`QueryMetadata`;`MarketplaceContextRef` 或 distribution context refs。 | body-free discovery context summary;package / assembly refs。 | `MarketplaceContextRef`;distribution context refs;external summary refs。 | 不返回 marketplace listing、价格、订单、安装、履约或外部正文。 |
| GetPackageAssemblyHistory | `ActorContext`;`QueryMetadata`;package / assembly ref;page。 | package assembly history summary page;change kind;safe reason refs。 | `PackageAssemblyHistory`。 | 不返回 package body、组织配置正文、marketplace transaction、raw log 或 event payload。 |

#### R1.22.3 Outbound Event 候选

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| MethodPackageChanged | package command accepted | `MethodPackageRef`;change kind;member / context refs;trace context。 | 外围读取材料刷新、审计、生态发现读取。 | 不携带 package body、artifact/archive body、listing、交易或安装信息。 |
| MethodSetAssemblyChanged | method set command accepted | `MethodSetAssemblyRef`;change kind;package / member refs;adoption context refs;trace context。 | 外围读取材料刷新、采用评估读取、审计。 | 不携带组织运行配置、UI / SDK 状态、AI override 或下游采用结果。 |
| PackageCompositionResultChanged | composition evaluation accepted | package or assembly ref;composition marker;safe reason refs;trace context。 | package / assembly view、维护刷新、审计解释。 | 不携带完整规则算法、规则矩阵或 policy engine 内部。 |
| PeripheralViewAvailabilityChanged | package / assembly view availability changed | view ref;availability / freshness marker;source refs;trace context。 | console / SDK 读取面、维护进度读取、审计。 | 派生可用性变化不代表核心 truth 改变,不携带 projection storage 细节。 |

#### R1.22.4 本组成部分不定义的接口

| 不定义项 | 原因 | 后续承接 |
|---|---|---|
| MarketplaceListingCommand | 上架、定价、订单、购买、订阅、结算、安装和履约不是本仓 truth。 | `L6-marketplace` 或边界外系统。 |
| PackageBodyUploadApi | package binary、archive body、artifact body 和外部 package storage 正文不得入仓。 | artifact / archive 边界或外部存储。 |
| OrganizationRuntimeConfigurationApi | 组织运行参数、console UI 状态、SDK profile 和下游采用成功事实不属于 method-library truth。 | console / SDK / runtime / 下游仓。 |
| AIPolicyOverrideApi | AI policy override、高级 ViewProfile 匹配和策略执行算法不属于本组成部分。 | 后续策略 / 配置专题或边界外系统。 |
| DirectMarketplaceConsumer | marketplace 原始事件和 transaction event 不直接进入外围 package truth。 | 先由外部摘要与引用形成 body-free ref / summary。 |
| PeripheralRefreshWorkerApi | 外围读取材料刷新归后台维护与收敛,不在本模块定义 worker / scheduler / queue。 | `RefreshPeripheralReadMaterials`。 |
| SearchRankingRecommendationApi | marketplace 搜索排序、推荐、商业筛选和安装可用性不是概要接口骨架。 | marketplace / discovery 系统。 |

#### R1.22.5 本组成部分停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只处理外围包与方法集组织 | pass | 未进入全仓五类总表或 Command 总表。 |
| 是否写入 bounded Command 骨架 | pass | 覆盖 package 建立 / 调整 / 退役 / 不可用、method set 组装 / 调整 / 退役 / stale-or-unavailable、composition evaluation。 |
| 是否写入 Query 骨架 | pass | 覆盖 package、package view、composition diagnostic、method set、method set view、peripheral discovery context、assembly history。 |
| 是否写入 Outbound Event 候选 | pass | 只写 package changed、assembly changed、composition result changed、peripheral view availability changed。 |
| 是否直接定义 Inbound Consumer | no | marketplace / ecosystem 变化先归外部摘要与引用,本模块不写直接 consumer。 |
| 是否直接定义 Operations Job | no | 外围刷新归后台维护 `RefreshPeripheralReadMaterials`。 |
| 是否承接 Step 6 对象 | pass | 输入 / 输出回指 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、`MethodPackageView`、`MethodSetAssemblyView`、`MethodPackageRef`、`MethodSetAssemblyRef`、`MarketplaceContextRef`、`PackageAssemblyHistory`。 |
| 是否保持 peripheral 不阻塞核心闭环 | pass | package / method set 不作为定义、正式化、消费或追溯成立前置。 |
| 是否避免 marketplace / package body / org runtime 越界 | pass | listing、交易、安装、履约、body、UI、SDK、AI override 均列入不定义项。 |
| 是否修改正式 §7 | no | 正式回填仍等待总表、映射、审计和草稿。 |
| 是否允许进入 Command API 骨架总表:先思考 | pass | 八个组成部分局部接口小循环已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `Command API 骨架总表:先思考`;只思考如何从八个组成部分局部骨架汇总 Command API 总表,不得直接写总表正文,不得改正式 §7,不得进入 Step 8/9。

### R1.23 Command API 骨架总表:先思考

#### R1.23.1 问题回答

- 本模块只思考如何从八个组成部分的局部 Command 骨架汇总全仓 Command API 总表,不直接写总表正文,不改正式 `02-概要设计.md` §7。
- Command 总表第一来源是 `R1.8.1`、`R1.10.1`、`R1.12.1`、`R1.14.1`、`R1.16.1`、`R1.18.1`、`R1.20.1`、`R1.22.1` 的局部 Command 表。
- Command 总表只纳入显式写本仓 truth、正式边界、外部摘要接受记录、维护任务意图或外围组织对象的入口。
- Command 总表不纳入 Query、Inbound Event Consumer、Outbound Event、Operations Job、guard helper、repository / port、handler、worker、scheduler、topic、DDL 或旧 publish API。
- 所有 Command 行必须保留 `ActorContext`、`CommandMetadata`、`IdempotencyKey` 作为输入骨架基础,并保留输出 ref / accepted summary / history ref / safe reason ref 的概要边界。
- Command 总表不重新发明接口名。若局部表已有名称和边界,总表只汇总;若发现重复或跨类混淆,只能在本模块标记为合并 / 排除候选,不能私自补新对象。

#### R1.23.2 候选数量盘点

| 组成部分 | 局部来源 | Command 候选数 | 当前处理 |
|---|---|---:|---|
| 方法资产定义与目录 | `R1.8.1` | 6 | 全部进入总表候选。 |
| 正式化与版本 | `R1.10.1` | 6 | 全部进入总表候选。 |
| 受控消费 | `R1.12.1` | 5 | 全部进入总表候选。 |
| 追溯与一致性保护 | `R1.14.1` | 7 | 全部进入总表候选。 |
| 关系与分发语义 | `R1.16.1` | 10 | 全部进入总表候选。 |
| 外部摘要与引用 | `R1.18.1` | 9 | 全部进入总表候选。 |
| 后台维护与收敛 | `R1.20.1` | 6 | 作为 bounded maintenance Command 进入总表候选,但必须标注不执行 Job。 |
| 外围包与方法集组织 | `R1.22.1` | 9 | 作为 peripheral Command 进入总表候选,但必须标注不阻塞核心闭环。 |
| 合计 | 八个局部 Command 表 | 58 | 下一写入批次按组成部分分组写入总表。 |

#### R1.23.3 纳入规则

| 规则 | 说明 |
|---|---|
| 显式写入 | 必须改写本仓拥有的 truth / truth candidate / boundary / accepted summary / maintenance request / peripheral organization。 |
| 上下文完整 | 输入骨架必须包含 `ActorContext`、`CommandMetadata`、`IdempotencyKey`。 |
| 对象可追溯 | 输入 / 输出必须回指 Step 6 对象、typed ref、summary、history、lineage、task 或 safe reason ref。 |
| 边界可见 | 每行必须保留“不得做什么”,避免 Command 下沉成正文同步、下游运行状态写入、worker 执行或交易履约。 |
| 分组汇总 | 总表按八个组成部分分组排序,不按 handler、repository、路由或旧模块排序。 |
| 局部名优先 | 优先保持局部骨架中的 Command 名,只在后续一致性审计发现命名冲突时再处理。 |

#### R1.23.4 排除 / 降级规则

| 排除对象 | 处理口径 | 原因 |
|---|---|---|
| Query / read model repair | 不进入 Command 总表 | 读取路径不得修复 truth 或刷新 material。 |
| Inbound Event Consumer | 留给 Inbound 总表 | 外部事件承接与 Command 写入语义不同。 |
| Outbound Event | 留给 Outbound 总表 | 事件是已成立事实输出,不是写入口。 |
| Operations Job | 留给 Job 总表 | Job 维护派生材料和收敛状态,不得伪装成业务 Command。 |
| Guard helper / policy helper | 只在产生正式 decision / marker / violation 记录时保留对应 Command | helper 本身不是外部 API。 |
| Repository / port / adapter | 不进入概要接口骨架 | 属于详细设计 / 实现层。 |
| HTTP / RPC / topic / payload schema | 不进入本模块 | 属于协议契约或详细设计。 |
| marketplace listing / install / fulfillment | 不进入 Command 总表 | 属于边界外系统,不是 method-library truth。 |
| 旧 `MethodContent` / publish / snapshot / fingerprint command | 不进入 Command 总表 | 与本轮 Step 5 / Step 6 新对象口径冲突。 |

#### R1.23.5 下一写入批次结构

| 写入内容 | 要求 |
|---|---|
| Command API 总表 | 按八个组成部分分组写 58 个 Command 行。 |
| 表格列 | 使用 `Command`、`主要组成部分`、`输入骨架`、`输出骨架`、`写入对象 / 意图`、`边界` 六列。 |
| Bounded 标注 | 后台维护 Command 标注 request / bounded;外围 Command 标注 peripheral。 |
| 不重复展开 | 不重复写完整 DTO schema、字段全集、错误码、状态机或处理流。 |
| 停审记录 | 检查数量、上下文、对象承接、边界、无 Query / Event / Job 混入、正式 §7 未修改。 |

#### R1.23.6 下一写入批次边界

- 只允许进入 Step 7 `Command API 骨架总表:再写入`。
- 不写 Query API 总表、Inbound Event Consumer 总表、Outbound Event 总表、Operations Job 总表。
- 不写接口到主要组成部分映射表。
- 不改正式 `02-概要设计.md` §7。
- 不进入 Step 8 / Step 9。
- 不写 HTTP path、RPC method、完整 DTO schema、topic、payload、repository / port、事务、DDL、worker、scheduler、queue、cron、retry、lock、adapter、handler 调用链、状态迁移矩阵或实现配置。

#### R1.23.7 自检

| 检查项 | 结论 |
|---|---|
| 是否只思考 Command API 总表汇总口径 | pass |
| 是否盘点八个组成部分局部 Command 来源 | pass |
| 是否明确候选总数 | pass:58 |
| 是否明确纳入 / 排除规则 | pass |
| 是否避免直接写总表正文 | pass |
| 是否避免 Query / Event / Job 混入 | pass |
| 是否修改正式 §7 | no |
| 是否允许进入 Command API 骨架总表:再写入 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `Command API 骨架总表:再写入`;只写全仓 Command API 骨架总表和停审记录,不得写 Query / Inbound / Outbound / Operations 总表,不得改正式 §7,不得进入 Step 8/9。

### R1.24 Command API 骨架总表:再写入

#### R1.24.1 Command API 骨架总表

| Command | 主要组成部分 | 输入骨架 | 输出骨架 | 写入对象 / 意图 | 边界 |
|---|---|---|---|---|---|
| EstablishMethodAssetDefinition | 方法资产定义与目录 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;identity key;definition summary;accepted external summary refs。 | `MethodAssetDefinitionRef`;definition accepted summary;history ref。 | 建立 `MethodAssetDefinition`。 | 不接收外部正文、旧 content payload、artifact 正文或下游运行状态。 |
| AdjustMethodAssetDefinition | 方法资产定义与目录 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;definition ref;adjustment summary;basis ref。 | definition ref;adjustment summary;history ref。 | 调整 definition truth。 | 不直接替代正式版本;不由 catalog view 或 query 隐式调整。 |
| RetireMethodAssetDefinition | 方法资产定义与目录 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;definition ref;retirement reason ref。 | definition ref;retired summary;history ref。 | 退役 definition 语义。 | 不删除历史、trace 或已成立 formal version refs。 |
| RegisterMethodAssetCatalogEntry | 方法资产定义与目录 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;definition ref;catalog scope ref;catalog identity;applicability summary。 | catalog entry ref;accepted summary。 | 建立目录项。 | 不创建 definition truth;不写搜索索引、UI 分类或消费可用性。 |
| ReclassifyMethodAssetCatalogEntry | 方法资产定义与目录 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;catalog entry ref;catalog scope ref;applicability summary。 | catalog entry ref;reclassification summary;history ref。 | 调整目录项范围。 | 不改变 definition truth;不表达正式化通过或 marketplace 履约。 |
| RetireMethodAssetCatalogEntry | 方法资产定义与目录 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;catalog entry ref;retirement reason ref。 | catalog entry ref;retired summary。 | 退役目录项。 | 不删除 definition truth;不让目录退役等同定义退役。 |
| EvaluateMethodAssetFormalizationEligibility | 正式化与版本 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;definition ref;catalog entry ref;basis summary refs;eligibility rule ref。 | eligibility decision summary;formalization state ref optional;rejection reason ref。 | 记录正式化资格判断。 | 不执行治理审批;不读取下游运行状态;不由 cache hit 触发。 |
| InitiateMethodAssetFormalization | 正式化与版本 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;definition ref;catalog entry ref;trigger summary;basis summary refs。 | formalization state ref;accepted / blocked summary;history ref。 | 发起正式化判断。 | 不创建正式版本;不接收外部正文、治理执行正文或 artifact 正文。 |
| EstablishFormalMethodAssetVersion | 正式化与版本 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;formalization state ref;definition ref;catalog entry ref;boundary summary。 | formal version ref;established summary;history ref。 | 建立正式版本。 | 不选择版本号算法;不以 hash / fingerprint / snapshot 替代版本语义。 |
| RecordFormalVersionSemanticChange | 正式化与版本 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;formal version ref;semantic change summary;basis ref。 | next version candidate / ref summary;history ref。 | 记录版本语义变化。 | 不覆盖原 formal version truth;不删除历史引用。 |
| SupersedeFormalMethodAssetVersion | 正式化与版本 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;previous formal version ref;next formal version ref;reason ref。 | supersession summary;previous / next refs;history ref。 | 显式替代正式版本。 | 不让旧 ref 含义漂移;不重写下游已持有引用。 |
| RetireFormalMethodAssetVersion | 正式化与版本 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;formal version ref;retirement reason ref。 | retired formal version summary;history ref。 | 退役正式版本。 | 不删除 formal version truth、消费历史、trace 或 audit。 |
| RegisterDownstreamConsumptionBoundary | 受控消费 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;consumption context ref;formal version requirement;allowed / forbidden use summary。 | downstream consumption boundary ref;accepted summary。 | 建立消费边界。 | 不写鉴权实现、权限矩阵、token scope、policy engine 或下游运行状态。 |
| AdjustDownstreamConsumptionBoundary | 受控消费 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;boundary ref;adjustment summary;reason ref。 | boundary ref;adjusted summary。 | 调整消费边界。 | 不修改 formal version truth;不反写下游仓状态。 |
| PrepareMethodAssetConsumptionMaterial | 受控消费 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;formal version ref;definition ref;context ref;boundary ref。 | consumption material ref;prepared summary;availability hint。 | 准备正式消费材料。 | 不复制定义正文;不保存下游运行 truth;不生成旧 snapshot 包。 |
| MarkMethodAssetConsumptionMaterialState | 受控消费 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;consumption material ref;state marker;safe reason ref。 | material state summary;availability hint。 | 标记消费材料状态。 | 不修复来源 truth;不启动刷新算法;不扩大消费边界。 |
| RecordDefinitionUseBoundaryViolation | 受控消费 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;guard ref;violation ref;safe violation summary。 | guard violation accepted summary;trace subject ref。 | 记录定义 / 使用越界线索。 | 不保存原始请求正文、下游 payload、运行状态或证据正文。 |
| OrganizeMethodAssetTraceMaterial | 追溯与一致性保护 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;trace subject ref;formal version / consumption material refs;basis refs。 | trace material ref;organized summary。 | 组织追溯材料。 | 不保存 raw log、trace span、event payload、外部正文、证据正文或 report body。 |
| MarkMethodAssetTraceMaterialState | 追溯与一致性保护 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;trace material ref;state marker;safe reason ref。 | trace material state summary。 | 标记追溯材料状态。 | 不修复 definition / version / relation / consumption truth,不启动刷新 job。 |
| RegisterConsumptionImpactSummary | 追溯与一致性保护 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;impact source ref;definition ref;formal version ref optional;context refs;impact summary。 | impact summary ref;registered summary。 | 登记消费影响摘要。 | 不扫描下游运行状态;不保存下游 payload、执行结果正文或 UI 状态。 |
| MarkConsumptionImpactDisposition | 追溯与一致性保护 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;impact summary ref;disposition marker;safe reason ref。 | impact disposition summary。 | 标记影响处置口径。 | 不把 unknown 折叠成 no impact;不同步等待所有下游。 |
| EstablishConsistencyProtectionDecision | 追溯与一致性保护 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;policy ref;formal version ref;impact / trace refs optional。 | protection decision summary;protected context refs;unknown reason ref。 | 建立一致性保护判断。 | 不定义恢复算法、告警规则、worker、重试或维护进度。 |
| OrganizeMethodAssetAuditTrail | 追溯与一致性保护 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;trace subject ref;audit scope ref;history refs;lineage refs。 | audit trail ref;safe audit summary。 | 组织安全审计材料。 | 不保存 raw audit log、telemetry、metric、event payload、report body 或证据正文。 |
| LinkMethodAssetEvidenceLineage | 追溯与一致性保护 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;trace subject ref;external source refs;artifact archive refs;digest refs optional。 | evidence lineage ref;linked summary。 | 关联证据 lineage。 | 不保存 artifact 包体、archive 内容、证据文件正文、验收报告正文或标准全文。 |
| EstablishMethodAssetRelation | 关系与分发语义 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;source definition ref;target related ref;relation kind;catalog scope;basis refs。 | relation ref;established summary;trace subject ref。 | 建立方法资产关系。 | 不从运行依赖图、推荐结果、搜索索引、UI 分类或 marketplace listing 生成关系 truth。 |
| AdjustMethodAssetRelation | 关系与分发语义 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;relation ref;change summary;scope / kind / endpoint refs optional。 | relation adjusted summary;history ref。 | 调整关系语义。 | 不静默覆盖旧关系;不绕过完整性判断;不修改 definition / version truth。 |
| ConstrainMethodAssetRelation | 关系与分发语义 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;relation ref;catalog scope;formal version / distribution context refs optional;reason ref。 | relation constrained summary。 | 约束关系适用语境。 | 不写成下游授权、安装状态、交易规则或 marketplace policy。 |
| SupersedeMethodAssetRelation | 关系与分发语义 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;previous relation ref;next relation candidate refs;reason ref。 | supersession summary;previous / next refs。 | 替代关系。 | 不删除历史关系;不把 relation history 当当前 truth。 |
| RetireMethodAssetRelation | 关系与分发语义 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;relation ref;retirement reason ref。 | relation retired summary。 | 退役关系。 | 不级联删除消费材料、分发材料或外围组织对象。 |
| EvaluateRelationIntegrity | 关系与分发语义 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;relation ref;integrity rule ref;endpoint / formalization / distribution refs。 | integrity diagnostic summary;violation reason ref optional。 | 评估关系完整性。 | 不实现完整图算法、推荐算法、搜索排序、policy engine 或外部正文解析。 |
| MarkRelationIntegrityViolation | 关系与分发语义 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;relation ref;violation ref;safe reason ref。 | violation marked summary。 | 标记关系完整性违规。 | 不自动修复 relation、definition、formal version 或 distribution material。 |
| PrepareMethodAssetDistributionRef | 关系与分发语义 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;source definition / package ref;distribution context ref;kind;basis refs。 | distribution ref;prepared summary。 | 建立分发语义引用。 | 不表示 marketplace 上架、定价、订单、安装、履约或同步成功。 |
| AdjustMethodAssetDistributionContext | 关系与分发语义 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;distribution ref;next context ref;reason ref。 | distribution context adjusted summary。 | 调整分发上下文。 | 不扩大消费授权;不修改 package 正文、method set 正文或 marketplace 状态。 |
| MarkMethodAssetDistributionAvailability | 关系与分发语义 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;distribution ref;blocked / unavailable marker;reason ref。 | distribution availability summary。 | 标记分发可用性。 | 不修复消费材料、下游状态、外围 package truth 或分发 read material。 |
| CaptureExternalSourceSummary | 外部摘要与引用 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;external source ref;safe summary;source kind;artifact archive ref optional。 | external source summary ref;captured summary;body-free marker。 | 捕获外部安全摘要。 | 不保存标准全文、ADR 正文、外部文档正文、artifact 包体、证据正文或 API payload。 |
| RegisterExternalSourceRef | 外部摘要与引用 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;source kind;namespace ref;version ref optional;digest ref optional。 | external source ref;registered summary。 | 登记外部来源 typed ref。 | 不从 free-form URL、文件路径、route param 或 external id 直接拼 ref。 |
| RegisterArtifactArchiveRef | 外部摘要与引用 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;artifact kind;external source ref optional;archive digest ref;retention context ref。 | artifact archive ref;registered summary。 | 登记 artifact / archive body-free ref。 | 不保存文件内容、archive 包、证据正文、对象存储内容、路径或生命周期状态。 |
| AssertExternalBodyBoundary | 外部摘要与引用 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;body boundary rule ref;candidate summary / ref / lineage refs。 | boundary assertion summary;accepted / rejected marker;reason ref。 | 判断正文禁止边界。 | 不返回被拒正文,不执行外部内容审查、标准解释或治理审批。 |
| RejectExternalBodyCandidate | 外部摘要与引用 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;external body candidate ref;boundary rule ref;violation reason ref。 | body rejection summary;violation ref。 | 拒绝外部正文候选。 | 不保存被拒正文摘录、payload、文件内容或证据正文。 |
| AcceptExternalBasisSummary | 外部摘要与引用 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;external summary ref;governance basis ref optional;reason ref。 | accepted basis summary;history ref。 | 标记外部摘要可用。 | 不执行治理裁决、Gate 流程、policy enforce 或标准解释。 |
| MarkExternalBasisDisposition | 外部摘要与引用 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;external summary ref;disposition marker;safe reason ref。 | basis disposition summary;history ref。 | 标记外部依据处置状态。 | 不同步修改正式版本、关系、追溯材料或外围对象。 |
| SupersedeExternalSourceSummary | 外部摘要与引用 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;previous summary ref;next summary ref;reason ref。 | external summary superseded summary。 | 替代外部安全摘要。 | 不删除旧摘要,不复制外部正文,不重写已成立正式化结果。 |
| LinkExternalEvidenceLineage | 外部摘要与引用 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;trace subject ref;external source refs;artifact archive refs;digest refs optional。 | evidence lineage ref;external lineage linked summary。 | 关联外部证据 lineage。 | 不保存证据文件正文、artifact 包体、验收报告正文或 archive 内容。 |
| RequestReadMaterialRefresh | 后台维护与收敛 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;refresh scope ref;target material refs;reason ref。 | maintenance run ref;read material refresh task ref;accepted summary。 | 登记读取材料刷新请求。 | 不在 Command 中执行刷新;不修改 core truth、external summary 或 package truth。 |
| RequestTraceMaterialRefresh | 后台维护与收敛 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;refresh scope ref;trace subject refs;audit / evidence / impact refs optional。 | maintenance run ref;trace material refresh task ref;accepted summary。 | 登记追溯材料刷新请求。 | 不保存 raw log、trace span、event payload、证据正文、report body 或 artifact 包体。 |
| RequestConsistencyRecovery | 后台维护与收敛 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;refresh scope ref;recovery reason ref;affected subject refs;related material refs。 | maintenance run ref;consistency recovery task ref;request summary。 | 登记一致性恢复收敛请求。 | 不自动修复 core truth,不重做正式化,不绕过消费或外部正文边界。 |
| MarkMaintenanceSuspended | 后台维护与收敛 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;maintenance run ref;suspension reason ref;formal intervention ref optional。 | maintenance suspended summary。 | 标记维护挂起。 | 不隐藏失败,不复制外部正文补齐,不把挂起解释为 truth 不成立。 |
| RequireMaintenanceFormalIntervention | 后台维护与收敛 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;recovery task ref;formal intervention ref;safe reason ref。 | formal intervention required summary。 | 标记需要正式介入。 | 不直接执行治理审批、正式化裁决、版本替代或消费边界修改。 |
| SupersedeMaintenanceRequest | 后台维护与收敛 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;previous maintenance run ref;next maintenance run ref;reason ref。 | maintenance request superseded summary。 | 替代维护请求。 | 不删除旧 run history,不改写已生成维护结果,不重放 worker 任务。 |
| EstablishMethodPackage | 外围包与方法集组织 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;package ref;member refs;version refs;distribution context refs;composition rule ref;marketplace context ref optional。 | package accepted summary;package ref;history ref。 | 建立外围 package organization truth。 | 不创建核心定义,不发布正式版本,不保存 package / artifact / archive body,不形成 listing。 |
| AdjustMethodPackageComposition | 外围包与方法集组织 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;package ref;member change summary;version / distribution refs;reason ref。 | package adjusted summary;composition result summary;history ref。 | 调整 package composition。 | 不改写成员 asset truth、relation truth、consumption boundary 或 marketplace 状态。 |
| RetireMethodPackage | 外围包与方法集组织 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;package ref;retirement reason ref;replacement package ref optional。 | package retired summary;history ref。 | 退役 package。 | 不删除成员方法资产,不撤销正式版本,不隐藏旧 package 历史。 |
| MarkMethodPackageUnavailable | 外围包与方法集组织 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;package ref;unavailable reason ref;affected member / context refs。 | package unavailable summary;safe reason ref;history ref。 | 隔离不可用 package。 | 不把外围不可用解释为核心闭环失效,不自动修复成员 truth。 |
| AssembleMethodSet | 外围包与方法集组织 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;assembly ref;package refs;asset refs;consumption context ref;boundary refs optional。 | assembly accepted summary;assembly ref;history ref。 | 建立组织级 method set assembly。 | 不保存组织运行配置、UI 状态、SDK profile、AI override 或采用成功事实。 |
| AdjustMethodSetAssembly | 外围包与方法集组织 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;assembly ref;package / member change summary;adoption context refs;reason ref。 | assembly adjusted summary;composition result summary;history ref。 | 调整 method set assembly。 | 不扩大消费授权,不绕过正式消费材料,不替代正式版本或关系 truth。 |
| RetireMethodSetAssembly | 外围包与方法集组织 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;assembly ref;retirement reason ref;replacement ref optional。 | assembly retired summary;history ref。 | 退役 method set assembly。 | 不删除 package / asset truth,不隐藏历史,不修改组织运行状态。 |
| MarkMethodSetAssemblyStaleOrUnavailable | 外围包与方法集组织 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;assembly ref;stale / unavailable reason ref;affected refs。 | assembly stale / unavailable summary;history ref。 | 标记 method set 待复核或不可用。 | 不修复核心 truth,不自动刷新读取材料,不直接触发 worker。 |
| EvaluatePackageComposition | 外围包与方法集组织 | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;package or assembly ref;composition rule ref;candidate member refs;reason ref。 | composition evaluation summary;accepted / rejected marker;reason refs。 | 裁决 package / method set 组成边界。 | 不写完整规则算法、规则矩阵、policy engine、配置项或执行脚本。 |

#### R1.24.2 本总表停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 Command API 总表 | pass | 未写 Query / Inbound / Outbound / Operations 总表。 |
| 是否覆盖八个组成部分 | pass | 八个组成部分均有 Command 行。 |
| 是否覆盖 58 个 Command 候选 | pass | 6 + 6 + 5 + 7 + 10 + 9 + 6 + 9 = 58。 |
| 是否保留 Command 上下文 | pass | 所有行均保留 `ActorContext`、`CommandMetadata`、`IdempotencyKey`。 |
| 是否回指 Step 6 对象或能力 | pass | 写入对象 / 意图均来自局部骨架和 Step 6 对象族。 |
| 是否避免 Query / Event / Job 混入 | pass | 只收录显式写入、请求登记、边界裁决或外围组织 command。 |
| 是否保持后台维护 bounded | pass | 维护 command 只登记请求 / 挂起 / 介入 / 替代,不执行 job。 |
| 是否保持外围 package peripheral | pass | 外围 command 不阻塞核心闭环,不承接 marketplace 交易履约。 |
| 是否修改正式 §7 | no | 正式回填仍等待 Query / Event / Job 总表、映射、审计和草稿。 |
| 是否允许进入 Query API 骨架总表:先思考 | pass | Command 总表已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `Query API 骨架总表:先思考`;只思考如何从八个组成部分局部骨架汇总 Query API 总表,不得直接写 Query 总表正文,不得改正式 §7,不得进入 Step 8/9。

### R1.25 Query API 骨架总表:先思考

#### R1.25.1 问题回答

- 本模块只思考如何从八个组成部分的局部 Query 骨架汇总全仓 Query API 总表,不直接写总表正文,不改正式 `02-概要设计.md` §7。
- Query 总表第一来源是 `R1.8.2`、`R1.10.2`、`R1.12.2`、`R1.14.2`、`R1.16.2`、`R1.18.2`、`R1.20.2`、`R1.22.2` 的局部 Query 表。
- Query 总表只纳入读取 truth summary、view、read material、typed ref、history、lineage、diagnostic、availability、freshness、progress 或 peripheral view 的入口。
- Query 总表不纳入 Command、Inbound Event Consumer、Outbound Event、Operations Job、刷新 / 修复动作、repository / port、handler、worker、scheduler、topic、DDL 或旧 snapshot API。
- 所有 Query 行必须保留 `ActorContext` 和 `QueryMetadata` 作为输入骨架基础,并保留读取来源和“不写 truth / 不刷新 / 不返回正文”的边界。
- Query 总表不重新发明接口名。若局部表已有名称和边界,总表只汇总;若发现读取路径写入、刷新或修复语义,必须标记为排除或等待后续一致性审计。

#### R1.25.2 候选数量盘点

| 组成部分 | 局部来源 | Query 候选数 | 当前处理 |
|---|---|---:|---|
| 方法资产定义与目录 | `R1.8.2` | 4 | 全部进入总表候选。 |
| 正式化与版本 | `R1.10.2` | 6 | 全部进入总表候选。 |
| 受控消费 | `R1.12.2` | 6 | 全部进入总表候选。 |
| 追溯与一致性保护 | `R1.14.2` | 7 | 全部进入总表候选。 |
| 关系与分发语义 | `R1.16.2` | 9 | 全部进入总表候选。 |
| 外部摘要与引用 | `R1.18.2` | 8 | 全部进入总表候选。 |
| 后台维护与收敛 | `R1.20.2` | 8 | 全部进入总表候选,但必须标注不返回 worker / queue / raw log。 |
| 外围包与方法集组织 | `R1.22.2` | 9 | 全部进入总表候选,但必须标注 peripheral / no marketplace transaction。 |
| 合计 | 八个局部 Query 表 | 57 | 下一写入批次按组成部分分组写入总表。 |

#### R1.25.3 纳入规则

| 规则 | 说明 |
|---|---|
| 只读性质 | 只能读取 truth summary、projection、read material、typed ref、history、diagnostic、availability、freshness、progress 或 peripheral view。 |
| 上下文完整 | 输入骨架必须包含 `ActorContext` 和 `QueryMetadata`。 |
| 来源明确 | 每行必须写明读取来源,且来源必须回指 Step 6 对象、typed ref、view、read material、history、lineage、task 或 summary。 |
| 边界可见 | 每行必须保留“不写 truth / 不刷新 / 不返回正文 / 不暴露实现”的边界。 |
| 分组汇总 | 总表按八个组成部分分组排序,不按 HTTP path、repository、handler 或旧模块排序。 |
| 局部名优先 | 优先保持局部骨架中的 Query 名,后续一致性审计再处理命名冲突。 |

#### R1.25.4 排除 / 降级规则

| 排除对象 | 处理口径 | 原因 |
|---|---|---|
| 写入或状态推进 | 不进入 Query 总表 | 写入必须走 Command 或 Operations Job。 |
| material refresh / repair | 留给 Operations Job 总表 | Query 不得刷新、修复或重建读取材料。 |
| Inbound Event Consumer | 留给 Inbound 总表 | 外部事实承接不是读取接口。 |
| Outbound Event | 留给 Outbound 总表 | 事件是已成立事实输出,不是查询入口。 |
| repository / port / adapter | 不进入概要接口骨架 | 属于详细设计 / 实现层。 |
| HTTP / RPC / topic / payload schema | 不进入本模块 | 属于协议契约或详细设计。 |
| raw log / telemetry / report body | 不进入 Query 总表 | 违反 body-free / safe summary 边界。 |
| marketplace listing / order / install / fulfillment | 不进入 Query 总表 | 属于边界外系统。 |
| 旧 snapshot / fingerprint / content body read API | 不进入 Query 总表 | 与本轮 Step 5 / Step 6 新对象口径冲突。 |

#### R1.25.5 数量核对说明

- 初始口径预计 55 个 Query,重新按局部表逐行核对后为 57 个:
  - 关系与分发语义包含 9 个 Query,不是 7 个。
  - 后台维护与收敛包含 8 个 Query。
  - 外部摘要与引用包含 8 个 Query。
- 下一写入批次必须以 57 行为目标;若写入时发现数量不符,必须停审并回查局部表,不得静默删减。

#### R1.25.6 下一写入批次结构

| 写入内容 | 要求 |
|---|---|
| Query API 总表 | 按八个组成部分分组写 57 个 Query 行。 |
| 表格列 | 使用 `Query`、`主要组成部分`、`输入骨架`、`输出骨架`、`读取来源`、`边界` 六列。 |
| 只读标注 | 后台维护 Query 标注 no worker / no raw log;外围 Query 标注 peripheral / no marketplace transaction。 |
| 不重复展开 | 不重复写完整 DTO schema、字段全集、错误码、状态机、处理流、刷新算法或持久化。 |
| 停审记录 | 检查数量、上下文、读取来源、只读边界、无 Command / Event / Job 混入、正式 §7 未修改。 |

#### R1.25.7 下一写入批次边界

- 只允许进入 Step 7 `Query API 骨架总表:再写入`。
- 不写 Inbound Event Consumer 总表、Outbound Event 总表、Operations Job 总表。
- 不写接口到主要组成部分映射表。
- 不改正式 `02-概要设计.md` §7。
- 不进入 Step 8 / Step 9。
- 不写 HTTP path、RPC method、完整 DTO schema、topic、payload、repository / port、事务、DDL、worker、scheduler、queue、cron、retry、lock、adapter、handler 调用链、状态迁移矩阵、刷新算法或实现配置。

#### R1.25.8 自检

| 检查项 | 结论 |
|---|---|
| 是否只思考 Query API 总表汇总口径 | pass |
| 是否盘点八个组成部分局部 Query 来源 | pass |
| 是否明确候选总数 | pass:57 |
| 是否明确纳入 / 排除规则 | pass |
| 是否避免直接写总表正文 | pass |
| 是否避免 Command / Event / Job 混入 | pass |
| 是否修改正式 §7 | no |
| 是否允许进入 Query API 骨架总表:再写入 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `Query API 骨架总表:再写入`;只写全仓 Query API 骨架总表和停审记录,不得写 Inbound / Outbound / Operations 总表,不得改正式 §7,不得进入 Step 8/9。

### R1.26 Query API 骨架总表:再写入

#### R1.26.1 Query API 骨架总表

| Query | 主要组成部分 | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|---|
| GetMethodAssetDefinitionSummary | 方法资产定义与目录 | `ActorContext`;`QueryMetadata`;definition ref。 | definition summary;state hint;safe source refs。 | `MethodAssetDefinition` 或安全读取材料。 | 不返回外部正文、artifact 正文、旧 P0 payload 或正式化裁决正文。 |
| ResolveMethodAssetDefinitionRef | 方法资产定义与目录 | `ActorContext`;`QueryMetadata`;definition identity query;catalog scope ref optional。 | definition ref;resolution summary。 | definition identity index / catalog association。 | 不从 route param、URL、文件路径、marketplace id 或旧类型名拼接 ref。 |
| GetMethodAssetCatalogEntry | 方法资产定义与目录 | `ActorContext`;`QueryMetadata`;catalog entry ref。 | catalog entry summary;definition ref;catalog scope ref;applicability summary。 | `MethodAssetCatalogEntry` 或 catalog read material。 | 不在读取中创建、重分类或退役目录项;不返回搜索实现。 |
| ListMethodAssetCatalogView | 方法资产定义与目录 | `ActorContext`;`QueryMetadata`;catalog scope ref;page / filter summary。 | catalog view page;freshness / unavailable hint。 | `MethodAssetCatalogView`。 | 不刷新 view;不修复来源 truth;不暴露索引结构、排序算法或缓存键。 |
| GetFormalizationState | 正式化与版本 | `ActorContext`;`QueryMetadata`;formalization state ref 或 definition + catalog entry ref。 | formalization state summary;state reason summary;basis refs。 | `FormalizationState` 或安全读取材料。 | 不推进状态;不触发正式化;不返回治理执行正文。 |
| GetFormalMethodAssetVersionSummary | 正式化与版本 | `ActorContext`;`QueryMetadata`;formal version ref。 | formal version summary;definition ref;catalog entry ref;boundary summary;basis refs。 | `FormalMethodAssetVersion` 或正式版本读取材料。 | 不返回外部正文、版本算法细节、fingerprint、snapshot 或存储结构。 |
| ResolveCurrentFormalMethodAssetVersion | 正式化与版本 | `ActorContext`;`QueryMetadata`;definition ref;catalog entry / scope ref optional。 | current formal version ref;resolution summary;freshness / unavailable hint。 | formal version truth / read material。 | 不从 route param、旧 content id、marketplace id 或下游引用拼接 ref。 |
| GetFormalizationBasisSummary | 正式化与版本 | `ActorContext`;`QueryMetadata`;basis summary ref。 | basis summary;basis kind;external summary refs;governance basis refs;applicability summary。 | `FormalizationBasisSummary`。 | 不返回治理审批流、标准全文、ADR 正文、artifact 正文、archive 包或证据正文。 |
| GetFormalizationEligibilityDiagnostic | 正式化与版本 | `ActorContext`;`QueryMetadata`;definition ref;catalog entry ref;basis summary refs optional。 | eligibility diagnostic summary;safe rejection / pending reason refs。 | `FormalizationEligibilityRule` 评估输出和状态原因。 | 不暴露完整规则矩阵、组织配置、policy enforce 细节或审批过程。 |
| ListFormalizationHistory | 正式化与版本 | `ActorContext`;`QueryMetadata`;definition ref 或 formal version ref;page / filter summary。 | body-free formalization history summary page。 | `FormalizationHistory` / audit-safe history material。 | 不返回 raw audit log、event payload、状态迁移矩阵、治理执行或外部正文。 |
| GetMethodAssetConsumptionMaterial | 受控消费 | `ActorContext`;`QueryMetadata`;consumption material ref。 | consumption material summary;formal version ref;definition ref;context ref;boundary ref。 | `MethodAssetConsumptionMaterial`。 | 不返回定义正文、外部正文、下游运行状态、旧 snapshot 包或授权矩阵。 |
| GetMethodAssetAvailabilityView | 受控消费 | `ActorContext`;`QueryMetadata`;formal version ref;consumption context ref。 | availability summary;state hint;source material ref;freshness / unavailable reason。 | `MethodAssetAvailabilityView`。 | 不刷新 view;不改变来源 truth;不把 cache hit 当正式消费成立。 |
| ResolveConsumptionContextRef | 受控消费 | `ActorContext`;`QueryMetadata`;consumer kind;consumer scope ref;boundary ref optional。 | consumption context ref;context resolution summary。 | `ConsumptionContextRef` / boundary association。 | 不从 route param、运行实例 id、UI session 或下游私有字符串拼接 context ref。 |
| GetDownstreamConsumptionBoundary | 受控消费 | `ActorContext`;`QueryMetadata`;boundary ref 或 consumption context ref。 | boundary summary;formal version requirement;allowed / forbidden use summary。 | `DownstreamConsumptionBoundary`。 | 不暴露鉴权实现、权限矩阵、token、组织配置或策略引擎细节。 |
| GetDefinitionUseBoundaryDiagnostic | 受控消费 | `ActorContext`;`QueryMetadata`;guard ref 或 material / context refs。 | guard diagnostic summary;safe violation / reason refs。 | `DefinitionUseBoundaryGuard` 和 safe violation summary。 | 不返回原始请求正文、下游私有 payload、raw log 或证据正文。 |
| ListConsumableContextsForFormalVersion | 受控消费 | `ActorContext`;`QueryMetadata`;formal version ref;page / filter summary。 | consumption context page;boundary refs;availability hints。 | consumption boundary / availability view。 | 不创建消费材料;不扩大消费边界;不声明下游已同步或已运行。 |
| GetMethodAssetTraceMaterial | 追溯与一致性保护 | `ActorContext`;`QueryMetadata`;trace material ref。 | trace material summary;trace subject ref;formal version ref;consumption material ref;external summary refs。 | `MethodAssetTraceMaterial` / trace view。 | 不返回 raw log、event payload、外部正文、证据正文、handler report body 或刷新状态细节。 |
| GetTraceBySubject | 追溯与一致性保护 | `ActorContext`;`QueryMetadata`;trace subject ref;page / filter summary。 | trace material summary page;safe lineage hints。 | `TraceSubjectRef` + trace material。 | 不从字符串、旧对象名、artifact path 或下游 id 反推 subject。 |
| GetConsumptionImpactSummary | 追溯与一致性保护 | `ActorContext`;`QueryMetadata`;impact summary ref。 | impact summary;impact source ref;affected definition / version / context refs;disposition。 | `ConsumptionImpactSummary` / impact view。 | 不返回下游运行状态、执行实例、成员状态、runtime binding、UI 状态或同步结果正文。 |
| ListPendingConsumptionImpacts | 追溯与一致性保护 | `ActorContext`;`QueryMetadata`;formal version ref 或 consumption context ref;page / filter summary。 | pending / unknown impact summary page。 | impact summary + consistency policy。 | 不把 unknown 自动解释为无影响;不扫描下游内部 truth。 |
| GetConsistencyProtectionDiagnostic | 追溯与一致性保护 | `ActorContext`;`QueryMetadata`;policy ref 或 formal version ref;context refs optional。 | protection diagnostic summary;protected contexts;unknown impact reason refs。 | `ConsistencyProtectionPolicy` + impact summary + trace material。 | 不暴露恢复算法、告警规则、重试策略、worker 状态或 maintenance run。 |
| GetMethodAssetAuditTrail | 追溯与一致性保护 | `ActorContext`;`QueryMetadata`;audit trail ref 或 trace subject ref;page / scope summary。 | safe audit trail summary;history refs;evidence lineage refs。 | `MethodAssetAuditTrail`。 | 不返回 raw audit log、telemetry、metric、event payload、outbox body 或 report body。 |
| GetMethodAssetEvidenceLineage | 追溯与一致性保护 | `ActorContext`;`QueryMetadata`;evidence lineage ref 或 trace subject ref。 | evidence lineage summary;external source refs;artifact archive refs;digest refs。 | `MethodAssetEvidenceLineage`。 | 不返回证据文件正文、artifact 包体、archive 内容、标准全文或验收报告正文。 |
| GetMethodAssetRelation | 关系与分发语义 | `ActorContext`;`QueryMetadata`;relation ref。 | relation summary;source / target refs;kind;scope;distribution hint;trace subject ref。 | `MethodAssetRelation` / `MethodAssetRelationView`。 | 不返回目标定义正文、外部正文、marketplace 状态、运行依赖细节或 relation history 全量正文。 |
| ListMethodAssetRelationsByEndpoint | 关系与分发语义 | `ActorContext`;`QueryMetadata`;source or target definition ref;page / filter summary。 | relation summary page;endpoint refs;freshness hint。 | relation truth + `MethodAssetRelationView`。 | 不执行推荐、相似度、搜索排序、图遍历或 UI 分类聚合。 |
| ListMethodAssetRelationsByFormalVersion | 关系与分发语义 | `ActorContext`;`QueryMetadata`;formal version ref;page / filter summary。 | relation summary page;formal version relation hints。 | relation truth + formal version endpoint refs。 | 不把读取触发正式化;不从版本号、hash、fingerprint 或 snapshot 反推关系。 |
| ListMethodAssetRelationsByDistributionContext | 关系与分发语义 | `ActorContext`;`QueryMetadata`;distribution context ref;page / filter summary。 | relation view summary page;distribution context coverage hints。 | `MethodAssetRelationView`;`DistributionReadMaterial`。 | 不把 marketplace context 当交易事实;不从 route param、listing id 或 external id 拼 ref。 |
| GetRelationIntegrityDiagnostic | 关系与分发语义 | `ActorContext`;`QueryMetadata`;relation ref 或 integrity rule ref。 | integrity diagnostic summary;violation reason refs;safe remediation hints。 | `RelationIntegrityRule` + relation endpoint refs。 | 不暴露完整规则矩阵、policy engine、配置 profile、运行依赖图或外部正文解析。 |
| GetRelationChangeSummary | 关系与分发语义 | `ActorContext`;`QueryMetadata`;relation ref;page / scope summary。 | relation change summary page;trace handoff refs。 | `RelationChangeHistory` / trace handoff summary。 | 不返回 raw audit log、event payload、证据正文、外部标准正文或 report body。 |
| ResolveMethodAssetDistributionRef | 关系与分发语义 | `ActorContext`;`QueryMetadata`;distribution ref。 | distribution ref summary;source definition / package ref;distribution context ref;availability marker。 | `MethodAssetDistributionRef`;`DistributionContextRef`。 | 不返回 marketplace listing、订单、安装包、履约状态、分发协议或外部 API payload。 |
| GetDistributionReadMaterial | 关系与分发语义 | `ActorContext`;`QueryMetadata`;distribution material ref 或 distribution ref;context refs optional。 | distribution material summary;relation refs;consumption context refs;availability marker。 | `DistributionReadMaterial`。 | 不扩大受控消费授权;不返回下游同步结果、安装状态、package 正文或 method set 正文。 |
| ListDistributionReadMaterialsByContext | 关系与分发语义 | `ActorContext`;`QueryMetadata`;distribution context ref;page / filter summary。 | distribution material summary page;relation coverage hints。 | `DistributionReadMaterial`;relation view。 | 不做 marketplace listing 浏览、搜索排序、推荐结果或交易可用性判断。 |
| GetExternalSourceSummary | 外部摘要与引用 | `ActorContext`;`QueryMetadata`;external summary ref。 | external safe summary;source ref;acceptance marker;body-free marker;artifact ref optional。 | `ExternalSourceSummary`;`ExternalSourceSummaryView`。 | 不返回外部正文、标准全文、ADR 正文、artifact 正文、archive 包体或 API payload。 |
| GetExternalSummaryBySourceRef | 外部摘要与引用 | `ActorContext`;`QueryMetadata`;external source ref;page / filter summary。 | external summary page;digest hints;acceptance markers。 | `ExternalSourceRef` + summary view。 | 不从 URL、path、external id 或 route param 反推来源。 |
| ResolveExternalSourceRef | 外部摘要与引用 | `ActorContext`;`QueryMetadata`;external source ref。 | external source ref summary;source kind;namespace ref;version hint;digest hint。 | `ExternalSourceRef`。 | 不暴露外部系统认证、权限、内部生命周期、provider payload 或正文地址。 |
| GetArtifactArchiveRef | 外部摘要与引用 | `ActorContext`;`QueryMetadata`;artifact archive ref。 | artifact archive ref summary;artifact kind;external source ref;digest hint;retention context ref。 | `ArtifactArchiveRef`。 | 不返回文件内容、archive 包、证据正文、对象存储路径或 retention policy。 |
| GetExternalBodyBoundaryDiagnostic | 外部摘要与引用 | `ActorContext`;`QueryMetadata`;body boundary rule ref;candidate refs。 | body boundary diagnostic;accepted / rejected marker;safe reason refs。 | `ExternalBodyBoundaryRule` + summary / ref inputs。 | 不返回被拒正文内容、外部正文摘录、payload 或 evidence body。 |
| GetExternalSourceSummaryView | 外部摘要与引用 | `ActorContext`;`QueryMetadata`;summary view ref 或 external summary ref。 | summary view;freshness marker;body-free marker;availability marker。 | `ExternalSourceSummaryView`。 | view 不成为 summary truth,不携带外部正文或外部系统状态。 |
| GetExternalBasisAcceptanceHistory | 外部摘要与引用 | `ActorContext`;`QueryMetadata`;external source ref 或 governance basis ref;page / scope summary。 | acceptance history summary page;digest hints;evidence lineage refs。 | `ExternalBasisAcceptanceHistory`。 | 不返回治理执行、审批过程、policy enforce、外部日志、report body 或正文。 |
| GetExternalEvidenceLineageHint | 外部摘要与引用 | `ActorContext`;`QueryMetadata`;trace subject ref 或 evidence lineage ref。 | evidence lineage summary;external source refs;artifact archive refs;digest refs。 | `MethodAssetEvidenceLineage` / artifact refs。 | 不返回证据文件正文、artifact 包体、archive 内容或验收报告正文。 |
| GetMaintenanceProgress | 后台维护与收敛 | `ActorContext`;`QueryMetadata`;maintenance progress view ref。 | progress summary;maintenance run ref;refresh scope ref;freshness / recovery markers。 | `MaintenanceProgressView`。 | 不返回 worker 状态、queue 状态、raw log、telemetry body、metric 或 report body。 |
| GetMaintenanceProgressByRun | 后台维护与收敛 | `ActorContext`;`QueryMetadata`;maintenance run ref。 | progress view summary;task refs;history hints。 | `MaintenanceRunRef` + `MaintenanceProgressView`。 | 不把 maintenance run ref 等同 job id、worker id、scheduler id 或 retry token。 |
| GetMaintenanceProgressByScope | 后台维护与收敛 | `ActorContext`;`QueryMetadata`;refresh scope ref;page / filter summary。 | progress view page;pending / converged / unavailable ranges。 | `RefreshScopeRef` + progress view。 | 不暴露 query condition、batch cursor、cache key、lock 或 retry token。 |
| GetReadMaterialRefreshTaskSummary | 后台维护与收敛 | `ActorContext`;`QueryMetadata`;read material refresh task ref。 | read refresh task summary;target material refs;progress marker。 | `ReadMaterialRefreshTask`;progress view。 | 不返回 projection storage、cache/index 实现、refresh algorithm 或 material body。 |
| GetTraceMaterialRefreshTaskSummary | 后台维护与收敛 | `ActorContext`;`QueryMetadata`;trace material refresh task ref。 | trace refresh task summary;trace subject refs;evidence lineage refs;progress marker。 | `TraceMaterialRefreshTask`;progress view。 | 不返回 raw log、event payload、证据正文、artifact 包体或 report body。 |
| GetConsistencyRecoveryTaskSummary | 后台维护与收敛 | `ActorContext`;`QueryMetadata`;consistency recovery task ref。 | recovery task summary;reason refs;affected subject refs;formal intervention hints。 | `ConsistencyRecoveryTask`;maintenance history。 | 不返回恢复脚本、自动修复策略、下游运行状态或正式化执行过程。 |
| GetMaintenanceRunHistory | 后台维护与收敛 | `ActorContext`;`QueryMetadata`;maintenance run ref 或 refresh scope ref;page / scope summary。 | maintenance history summary page;outcome markers;digest hints。 | `MaintenanceRunHistory`。 | 不返回 worker/job/queue/cron/lock/retry、raw log、metric、trace span 或 report body。 |
| ListPendingMaintenanceScopes | 后台维护与收敛 | `ActorContext`;`QueryMetadata`;scope kind;page / filter summary。 | pending / stale / recovery needed / unavailable scope page。 | task + progress view + refresh scope refs。 | 不把待收敛解释为 truth 未成立,不回滚核心对象。 |
| GetMethodPackage | 外围包与方法集组织 | `ActorContext`;`QueryMetadata`;method package ref。 | package truth summary;member refs;distribution context refs;composition marker。 | `MethodPackage`。 | 不返回 package body、artifact/archive body、listing body、交易状态或核心定义正文。 |
| ListMethodPackages | 外围包与方法集组织 | `ActorContext`;`QueryMetadata`;scope / context filter summary;page。 | package summary page;availability markers。 | package refs + `MethodPackageView` summary。 | 不做 marketplace ranking、推荐、商业筛选、安装可用性判断。 |
| GetMethodPackageView | 外围包与方法集组织 | `ActorContext`;`QueryMetadata`;package view ref 或 package ref。 | package view summary;member definition refs;formal version refs;freshness marker。 | `MethodPackageView`。 | view 只读可重建,不得替代 package truth 或核心定义读取材料。 |
| GetMethodPackageCompositionDiagnostic | 外围包与方法集组织 | `ActorContext`;`QueryMetadata`;package ref;composition rule ref optional。 | composition diagnostic;invalid / unavailable reason refs。 | `PackageCompositionRule`;package refs;safe reason refs。 | 不暴露完整规则算法、配置矩阵或 policy engine 内部。 |
| GetMethodSetAssembly | 外围包与方法集组织 | `ActorContext`;`QueryMetadata`;method set assembly ref。 | assembly truth summary;package refs;asset refs;adoption context refs。 | `MethodSetAssembly`。 | 不返回组织运行配置、UI preset、SDK profile、AI override 或下游采用结果。 |
| ListMethodSetAssemblies | 外围包与方法集组织 | `ActorContext`;`QueryMetadata`;adoption / context filter summary;page。 | assembly summary page;availability / stale markers。 | assembly refs + `MethodSetAssemblyView` summary。 | 不表达组织采用成功事实,不读取下游 runtime state。 |
| GetMethodSetAssemblyView | 外围包与方法集组织 | `ActorContext`;`QueryMetadata`;assembly view ref 或 assembly ref。 | assembly view summary;package/member refs;composition marker;freshness marker。 | `MethodSetAssemblyView`。 | 不扩大 consumption boundary,不替代正式消费材料。 |
| GetPeripheralDiscoveryContext | 外围包与方法集组织 | `ActorContext`;`QueryMetadata`;marketplace context ref 或 distribution context refs。 | body-free discovery context summary;package / assembly refs。 | `MarketplaceContextRef`;distribution context refs;external summary refs。 | 不返回 marketplace listing、价格、订单、安装、履约或外部正文。 |
| GetPackageAssemblyHistory | 外围包与方法集组织 | `ActorContext`;`QueryMetadata`;package / assembly ref;page。 | package assembly history summary page;change kind;safe reason refs。 | `PackageAssemblyHistory`。 | 不返回 package body、组织配置正文、marketplace transaction、raw log 或 event payload。 |

#### R1.26.2 本总表停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 Query API 总表 | pass | 未写 Inbound / Outbound / Operations 总表。 |
| 是否覆盖八个组成部分 | pass | 八个组成部分均有 Query 行。 |
| 是否覆盖 57 个 Query 候选 | pass | 4 + 6 + 6 + 7 + 9 + 8 + 8 + 9 = 57。 |
| 是否保留 Query 上下文 | pass | 所有行均保留 `ActorContext` 和 `QueryMetadata`。 |
| 是否回指 Step 6 读取来源 | pass | 读取来源均来自 truth、view、read material、typed ref、history、lineage、task 或 summary。 |
| 是否避免 Command / Event / Job 混入 | pass | 只收录只读入口,未写刷新、修复、发布、消费事件或 worker。 |
| 是否保持后台维护只读 | pass | 维护 Query 不返回 worker / queue / raw log / telemetry。 |
| 是否保持外围 package peripheral | pass | 外围 Query 不承接 marketplace listing / 交易 / 安装 / 履约。 |
| 是否修改正式 §7 | no | 正式回填仍等待 Inbound / Outbound / Job 总表、映射、审计和草稿。 |
| 是否允许进入 Inbound Event Consumer 骨架总表:先思考 | pass | Query 总表已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `Inbound Event Consumer 骨架总表:先思考`;只思考如何从八个组成部分局部骨架汇总 body-free Inbound Event Consumer 总表,不得直接写 Inbound 总表正文,不得改正式 §7,不得进入 Step 8/9。

### R1.27 Inbound Event Consumer 骨架总表:先思考

#### R1.27.1 问题回答

- 本模块只思考全仓 Inbound Event Consumer 总表的汇总口径,不写 Inbound 总表正文,不写 Outbound Event / Operations Job 总表,不改正式 `02-概要设计.md` §7。
- Inbound Event Consumer 只在外部系统或相邻仓已经形成正式 body-free fact 时成立。这里的 fact 只能是 safe summary、typed ref、digest hint、body boundary marker、trace context 或等价安全线索。
- Consumer 输入必须显式包含来源 envelope、source event id、source system ref、schema / version、dedup key 或 trace context 语义。缺少这些语义时,不能在概要层声明为可落入本仓的 consumer。
- 全仓候选不是把所有 `no_for_this_component_loop` 都转正。小循环里保留的下游 impact、maintenance trigger、external relation hint、marketplace context changed 等线索,若没有经过 `外部摘要与引用` 的 body-free 边界,本轮仍不进入 Inbound 总表。
- Inbound Consumer 不直接创建 definition、formal version、consumption boundary、relation、package、method set、maintenance task 或 read material。它最多把外部已成立的安全摘要 / ref / marker 承接为后续 Command、Query、Outbound 或 Job 的输入线索。
- 当前可纳入总表的候选集中在 `外部摘要与引用`。这是因为 Step 5 / Step 6 已把外部正文、artifact 包体、标准全文、ADR 正文、证据正文、下游运行 truth、marketplace 交易履约排除在本仓 truth 之外。

#### R1.27.2 候选数量盘点

| 来源组成部分 | 局部候选状态 | 可进入总表数量 | 当前裁决 |
|---|---:|---:|---|
| 方法资产定义与目录 | no_for_this_component | 0 | 外部定义线索必须先由 `外部摘要与引用` 形成 safe summary / ref,不能直接写 definition truth。 |
| 正式化与版本 | no_for_this_component | 0 | 治理依据、标准或 ADR 变化不能直接触发正式化;只能消费已接受的 basis summary / external ref。 |
| 受控消费 | no / no_for_this_component_loop | 0 | 下游运行使用不是本仓 truth;消费边界变化必须由 Command 显式成立。 |
| 追溯与一致性保护 | no_for_this_component_loop | 0 | 下游 impact summary 需要先闭合 body-free inbound 口径;本总表不直接接 raw downstream event。 |
| 关系与分发语义 | no_for_this_component_loop | 0 | 外部关系线索、marketplace 语境必须先成为 external summary / ref。 |
| 外部摘要与引用 | yes_candidate_bounded | 4 | 只有本组成部分已写明 body-free summary / ref / digest / marker consumer 候选。 |
| 后台维护与收敛 | no_for_this_component_loop | 0 | truth / summary / material changed 是维护触发线索,不是外部事实消费入口。 |
| 外围包与方法集组织 | no / no_for_this_component_loop | 0 | marketplace listing、transaction、install、fulfillment 不进入本仓;ecosystem context 先走 external summary / ref。 |

候选总数:4 个 Inbound Event Consumer。

#### R1.27.3 预计纳入总表的 Consumer

| Consumer | 来源依据 | 纳入理由 | 必须保留的输入语义 |
|---|---|---|---|
| ConsumeBodyFreeExternalSummaryAccepted | `R1.18.3` | 外部系统或相邻仓已形成 safe summary / digest / body-free marker,本仓只承接摘要可用线索。 | source system ref;source event id;schema / version;`ExternalSourceRef`;safe summary ref/digest;body-free marker;trace context;dedup key。 |
| ConsumeExternalSourceRefRegistered | `R1.18.3` | typed external source ref 已在外部边界成立,本仓可接收来源身份线索供后续 summary / basis 使用。 | source system ref;source event id;source kind;namespace ref;version hint;digest hint;trace context;dedup key。 |
| ConsumeArtifactArchiveRefRegistered | `R1.18.3` | artifact / archive 只能以 body-free ref 和 digest hint 承接,可用于 lineage 和后续验收解释。 | source system ref;source event id;`ArtifactArchiveRef`;artifact kind;digest hint;optional external source ref;trace context;dedup key。 |
| ConsumeExternalBodyBoundaryViolation | `R1.18.3` | 外部正文边界违规可以作为拒绝、审计或上游修正线索,但不携带被拒正文。 | source system ref;source event id;candidate ref;violation kind;safe reason ref;trace context;dedup key。 |

#### R1.27.4 纳入规则

| 规则 | 说明 |
|---|---|
| body-free first | 输入必须已经是 safe summary / typed ref / digest hint / marker;不允许 consumer 自行解析正文。 |
| external boundary owner clear | 来源必须是外部系统、相邻仓或外部摘要边界已成立事实;不能把本仓内部 Command 结果伪装成 inbound。 |
| idempotent envelope required | 必须能表达 source event id、source system ref、schema / version、dedup key 和 trace context。 |
| no direct core truth mutation | Consumer 不直接建立或修改 core truth;后续若要改 truth,必须转成显式 Command / material handling。 |
| Step 6 object anchored | 输出线索必须回指 `ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef`、`ExternalBodyBoundaryRule`、`MethodAssetEvidenceLineage` 等 Step 6 对象或 ref。 |

#### R1.27.5 排除 / 降级规则

| 排除项 | 裁决 | 理由 |
|---|---|---|
| raw external document / webhook payload | exclude | 会绕过 `ExternalBodyBoundaryRule`,把外部正文带入本仓。 |
| artifact/archive/evidence body uploaded | exclude | 本仓只拥有 `ArtifactArchiveRef` / lineage,不拥有文件、包体或证据正文。 |
| downstream runtime usage / execution event | exclude | 下游运行状态不是本仓 truth,不能反向改变消费边界或正式版本。 |
| governance decision body event | exclude | 治理执行和裁决过程不属于本仓;只能承接 basis ref / summary。 |
| marketplace listing / transaction / install event | exclude | 交易、安装、履约属于边界外;只能先形成 external summary / marketplace context ref。 |
| truth / material changed maintenance trigger | defer_to_job_or_outbound | 维护触发应由 Outbound Event / Operations Job 总表讨论,不是 Inbound 总表直接入口。 |
| external relation hint | defer_to_external_summary | 外部关系线索必须先转成 body-free external summary / ref,再由 relation Command 显式判断。 |

#### R1.27.6 下一写入批次结构

下一批 `R1.28 Inbound Event Consumer 骨架总表:再写入` 只写:

1. `Inbound Event Consumer 骨架总表`。
2. `本总表停审记录`。
3. `next_allowed_action` 推进到 `Outbound Event 骨架总表:先思考`。

#### R1.27.7 下一写入批次边界

- 写入 4 个 Inbound Consumer 行,不扩展成同步通道、topic schema、handler、repository、worker 或 outbox。
- 每行必须包含 Consumer、主要组成部分、来源事实、输入骨架、输出 / 处理结果、边界。
- 不写 Outbound Event 总表、Operations Job 总表、接口映射、诊断审计或正式 §7。
- 不把小循环中的 `no_for_this_component_loop` 默认转正;只有已经闭合为 body-free external summary / ref / marker 的候选才可写入。

#### R1.27.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写 Inbound 总表正文。 |
| 是否完成候选盘点 | pass | 八个组成部分均已盘点,候选总数为 4。 |
| 是否保留 body-free 边界 | pass | 纳入规则要求 safe summary / typed ref / digest / marker。 |
| 是否排除外部正文和下游运行 truth | pass | raw document、artifact body、downstream runtime event、marketplace transaction 均排除。 |
| 是否承接 L1-governance 框架但不复制语义 | pass | 只采用 envelope / idempotency / source ref / trace context 的框架。 |
| 是否修改正式 §7 | no | 正式回填仍等待五类总表、映射、审计和草稿。 |
| 是否允许进入 Inbound Event Consumer 骨架总表:再写入 | pass | 汇总口径已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `Inbound Event Consumer 骨架总表:再写入`;只写 4 个 body-free Inbound Event Consumer 总表行和停审记录,不得写 Outbound / Operations 总表,不得改正式 §7,不得进入 Step 8/9。

### R1.28 Inbound Event Consumer 骨架总表:再写入

#### R1.28.1 Inbound Event Consumer 骨架总表

| Consumer | 主要组成部分 | 来源事实 | 输入骨架 | 输出 / 处理结果 | 边界 |
|---|---|---|---|---|---|
| ConsumeBodyFreeExternalSummaryAccepted | 外部摘要与引用 | 外部系统或相邻仓已形成 body-free external summary accepted 事实。 | source envelope;source event id;source system ref;schema / version;dedup key;trace context;`ExternalSourceRef`;safe summary ref/digest;body-free marker。 | accepted / ignored / rejected consumer result;external summary accepted intake summary;后续可由显式 Command 承接为 `ExternalSourceSummary` 状态线索。 | 不接收 raw document、webhook payload、标准全文、ADR 正文、artifact body、证据正文或外部 API payload。 |
| ConsumeExternalSourceRefRegistered | 外部摘要与引用 | 外部边界已登记 typed external source ref。 | source envelope;source event id;source system ref;schema / version;dedup key;trace context;source kind;namespace ref;version hint;digest hint;`ExternalSourceRef`。 | accepted / ignored / rejected consumer result;external source ref intake summary;供后续 summary / basis / trace 使用。 | 不把 URL、external id、file path、route param、provider payload 或认证信息当作正式 ref。 |
| ConsumeArtifactArchiveRefRegistered | 外部摘要与引用 | 外部边界已登记 artifact / archive body-free ref。 | source envelope;source event id;source system ref;schema / version;dedup key;trace context;`ArtifactArchiveRef`;artifact kind;digest hint;optional `ExternalSourceRef`。 | accepted / ignored / rejected consumer result;artifact/archive ref intake summary;可作为 evidence lineage 和验收解释线索。 | 不接收 archive 包、文件内容、安装包、对象存储内容、证据正文、路径或 retention policy。 |
| ConsumeExternalBodyBoundaryViolation | 外部摘要与引用 | 外部边界已发现正文禁止边界违规。 | source envelope;source event id;source system ref;schema / version;dedup key;trace context;candidate ref;violation kind;safe reason ref。 | accepted / ignored / rejected consumer result;body boundary violation intake summary;可进入拒绝、审计或上游修正线索。 | 不接收被拒正文、payload 摘录、外部文件内容、标准正文、artifact body 或 evidence body。 |

#### R1.28.2 本总表停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 Inbound Event Consumer 总表 | pass | 未写 Outbound Event / Operations Job 总表。 |
| 是否覆盖 R1.27 裁定的 4 个候选 | pass | 4 个候选均来自 `外部摘要与引用` 的 bounded inbound consumer。 |
| 是否保留来源 envelope / 幂等语义 | pass | 每行均保留 source envelope、source event id、source system ref、schema / version、dedup key 和 trace context。 |
| 是否保持 body-free 输入 | pass | 输入只包含 safe summary、typed ref、digest hint、marker、candidate ref 或 safe reason ref。 |
| 是否避免直接写 core truth | pass | 输出均为 accepted / ignored / rejected consumer result 和 intake summary,不直接建立 definition、formal version、relation、package 或 maintenance task。 |
| 是否避免外部正文 / artifact 包体 / 下游运行 truth | pass | raw document、artifact body、证据正文、下游运行状态、marketplace transaction 均未纳入。 |
| 是否修改正式 §7 | no | 正式回填仍等待 Outbound / Job 总表、映射、审计和草稿。 |
| 是否允许进入 Outbound Event 骨架总表:先思考 | pass | Inbound 总表已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `Outbound Event 骨架总表:先思考`;只思考本仓已成立事实、维护状态和外围组织变化的输出事件汇总口径,不得直接写 Outbound 总表正文,不得写 Operations Job 总表,不得改正式 §7,不得进入 Step 8/9。

### R1.29 Outbound Event 骨架总表:先思考

#### R1.29.1 问题回答

- 本模块只思考全仓 Outbound Event 总表的汇总口径,不写 Outbound 总表正文,不写 Operations Job 总表,不改正式 `02-概要设计.md` §7。
- Outbound Event 只表达本仓已成立事实、业务材料状态、维护状态或外围组织变化。它不是 Command,不创建或修复 truth;也不是 Query,不承担读取返回。
- Outbound Event 输出骨架只保留 event 名、来源事实、ref / summary / marker / trace context、主要消费者和边界。概要阶段不得写 topic、payload 字段全集、outbox 表、relay、dead letter、投递策略或重试机制。
- 已成立事实必须回指 Step 6 对象或 ref,例如 definition、catalog、formalization、formal version、consumption material、relation、external summary、maintenance task、package / assembly、history / lineage 等。
- read material / view / progress 变化可以作为 bounded event,但必须明确它只代表派生材料或维护状态变化,不得被解释为 core truth 新成立。
- 本轮仍禁止恢复旧 `OutboxEvent`、`fingerprint changed`、snapshot publish、content package publish 等旧主线。若未来详细设计需要 outbox,也只能作为实现交付机制,不能反推概要接口语义。

#### R1.29.2 候选数量盘点

| 来源组成部分 | 局部 Outbound 候选 | 可进入总表数量 | 当前裁决 |
|---|---:|---:|---|
| 方法资产定义与目录 | `R1.8.3` | 2 | definition changed、catalog entry changed 进入总表。 |
| 正式化与版本 | `R1.10.3` | 4 | formalization decision、formal version established / changed / retired 进入总表。 |
| 受控消费 | `R1.12.3` | 4 | consumption material、availability、boundary、guard violation 进入总表。 |
| 追溯与一致性保护 | `R1.14.3` | 5 | trace material、impact summary、protection decision、audit trail、evidence lineage 进入总表。 |
| 关系与分发语义 | `R1.16.3` | 5 | relation、integrity、distribution ref、distribution availability、relation material invalidation 进入总表。 |
| 外部摘要与引用 | `R1.18.4` | 5 | external summary、source ref、artifact ref、body boundary violation、external evidence lineage 进入总表。 |
| 后台维护与收敛 | `R1.20.4` | 5 | maintenance requested、read refresh、trace refresh、recovery、progress changed 进入总表。 |
| 外围包与方法集组织 | `R1.22.3` | 4 | package、method set assembly、composition result、peripheral view availability 进入总表。 |

候选总数:34 个 Outbound Event。

#### R1.29.3 事件族分组

| 事件族 | 预计事件数 | 说明 |
|---|---:|---|
| Core asset / catalog facts | 2 | 定义和目录项变化,供正式化、消费、关系、追溯、维护和外围组织感知。 |
| Formalization / version facts | 4 | 正式化判断、正式版本成立、语义变化、替代和退役。 |
| Consumption / boundary facts | 4 | 消费材料、可用性、消费边界和定义使用越界线索。 |
| Trace / impact / audit facts | 5 | 追溯材料、影响摘要、一致性保护、安全审计和证据 lineage。 |
| Relation / distribution facts | 5 | 方法资产关系、完整性、分发引用、分发可用性和读取材料失效线索。 |
| External summary / ref facts | 5 | 外部摘要、外部 ref、artifact ref、正文边界违规和外部证据 lineage。 |
| Maintenance / convergence facts | 5 | 维护请求、读取材料刷新、追溯材料刷新、一致性恢复和进度变化。 |
| Peripheral organization facts | 4 | package、method set、组成裁决和外围 view 可用性。 |

#### R1.29.4 纳入规则

| 规则 | 说明 |
|---|---|
| committed fact only | 事件必须来自已接受 Command、已完成 Operations Job 结果或已成立的派生材料状态。 |
| ref / marker only | 输出只携带 typed refs、summary refs、safe reason refs、state / availability / freshness markers 和 trace context。 |
| component owner explicit | 每个事件必须标注主要组成部分,防止事件来源和消费方混淆。 |
| no delivery implementation | 不在概要层写 topic、outbox、relay、subscriber、dead letter、retry、partition key 或 payload schema。 |
| view event bounded | view / read material / progress 类事件必须写明“派生材料变化不等同 core truth 变化”。 |
| consumer boundary clear | 主要消费者只表达感知方,不表示编译依赖、同步调用或强制事务。 |

#### R1.29.5 排除 / 降级规则

| 排除项 | 裁决 | 理由 |
|---|---|---|
| raw body published event | exclude | Outbound 不携带定义正文、外部正文、artifact 包体、证据正文、report body 或 raw log。 |
| topic / payload schema / relay mechanics | exclude | 属于详细设计或实现交付机制,不是概要接口骨架。 |
| old OutboxEvent object | exclude | 本轮不恢复旧 `OutboxEvent` 主线;若未来需要 outbox,只能作为实现机制。 |
| fingerprint / snapshot changed event | exclude | 旧 fingerprint / snapshot 主线已被 Step 5 / Step 6 新对象口径替代。 |
| marketplace transaction event | exclude | listing、价格、订单、安装、履约不是本仓 truth。 |
| downstream runtime state changed event | exclude | 下游运行状态不归本仓拥有,只能通过 body-free impact summary 或 external summary 间接承接。 |
| internal helper / mapper / repository event | exclude | helper、mapper、repository、adapter 不属于对外接口骨架。 |

#### R1.29.6 下一写入批次结构

下一批 `R1.30 Outbound Event 骨架总表:再写入` 只写:

1. `Outbound Event 骨架总表`。
2. `本总表停审记录`。
3. `next_allowed_action` 推进到 `Operations Job 骨架总表:先思考`。

#### R1.29.7 下一写入批次边界

- 写入 34 个 Outbound Event 行,按八个事件族 / 主要组成部分组织。
- 每行必须包含 Event、主要组成部分、触发来源、输出骨架、主要消费者、边界。
- 不写 Operations Job 总表、接口映射、诊断审计、正式 §7 或 Step 8/9 内容。
- 不补充局部小循环没有确认的新事件名;只汇总 `R1.8`、`R1.10`、`R1.12`、`R1.14`、`R1.16`、`R1.18`、`R1.20`、`R1.22` 已出现候选。

#### R1.29.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写 Outbound 总表正文。 |
| 是否完成候选盘点 | pass | 八个组成部分均已盘点,候选总数为 34。 |
| 是否避免 delivery 实现下沉 | pass | topic、payload schema、outbox、relay、dead letter、retry 均排除。 |
| 是否保留 ref / marker / trace context 边界 | pass | 纳入规则明确只输出 typed refs、summary refs、markers 和 trace context。 |
| 是否避免旧主线污染 | pass | 旧 `OutboxEvent`、fingerprint、snapshot publish、content package publish 均排除。 |
| 是否修改正式 §7 | no | 正式回填仍等待 Outbound / Job 总表、映射、审计和草稿。 |
| 是否允许进入 Outbound Event 骨架总表:再写入 | pass | 汇总口径已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `Outbound Event 骨架总表:再写入`;只写 34 个 Outbound Event 总表行和停审记录,不得写 Operations Job 总表,不得改正式 §7,不得进入 Step 8/9。

### R1.30 Outbound Event 骨架总表:再写入

#### R1.30.1 Outbound Event 骨架总表

| Event | 主要组成部分 | 触发来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|---|
| MethodAssetDefinitionChanged | 方法资产定义与目录 | definition establish / adjust / retire accepted | `MethodAssetDefinitionRef`;change kind;definition history ref;trace context。 | 正式化与版本、受控消费、追溯与一致性保护、关系与分发语义、后台维护、外围组织。 | 只表达 definition fact changed;不携带定义正文、外部正文、payload schema 或投递策略。 |
| MethodAssetCatalogEntryChanged | 方法资产定义与目录 | catalog register / reclassify / retire accepted | `MethodAssetCatalogEntryRef`;`MethodAssetDefinitionRef`;`CatalogScopeRef`;change kind;trace context。 | catalog view 维护、受控消费发现、外围组织、追溯和维护收敛。 | 只表达 catalog fact changed;不等同 catalog view refreshed,不携带 topic、outbox 或搜索索引信息。 |
| MethodAssetFormalizationDecisionChanged | 正式化与版本 | eligibility evaluation / formalization initiation accepted | `FormalizationStateRef`;`MethodAssetDefinitionRef`;decision kind;basis refs;trace context。 | 受控消费、追溯与一致性保护、关系与分发语义、后台维护。 | 只表达 formalization decision fact;不携带治理执行、审批过程或外部正文。 |
| FormalMethodAssetVersionEstablished | 正式化与版本 | formal version establishment accepted | `FormalMethodAssetVersionRef`;`MethodAssetDefinitionRef`;`MethodAssetCatalogEntryRef`;boundary summary ref;trace context。 | 受控消费材料、关系 / 分发判断、追溯材料、外围组织、维护刷新。 | 不携带完整版本算法、payload schema、topic 或 outbox 策略。 |
| FormalMethodAssetVersionChanged | 正式化与版本 | semantic change / supersession accepted | previous / next `FormalMethodAssetVersionRef`;change kind;history ref;trace context。 | 追溯与一致性保护、受控消费、关系分发、后台维护。 | 不覆盖旧版本含义;不声明下游影响已处理。 |
| FormalMethodAssetVersionRetired | 正式化与版本 | formal version retirement accepted | `FormalMethodAssetVersionRef`;retirement reason ref;history ref;trace context。 | 受控消费、追溯与一致性保护、外围组织、维护刷新。 | 不删除历史引用,不强制下游状态迁移。 |
| MethodAssetConsumptionMaterialPrepared | 受控消费 | consumption material preparation accepted | `MethodAssetConsumptionMaterialRef`;`FormalMethodAssetVersionRef`;`ConsumptionContextRef`;boundary ref;trace context。 | 下游消费方、追溯与一致性保护、后台维护、外围组织。 | 只表达材料已准备;不携带材料正文、定义正文、topic / payload schema 或投递策略。 |
| MethodAssetConsumptionAvailabilityChanged | 受控消费 | material state marker / availability derivation changed | `FormalMethodAssetVersionRef`;`ConsumptionContextRef`;availability state hint;safe reason ref。 | 下游消费方、追溯与一致性保护、后台维护。 | 不等同下游同步成功;不改变 formal version truth。 |
| DownstreamConsumptionBoundaryChanged | 受控消费 | boundary register / adjust accepted | `DownstreamConsumptionBoundaryRef`;`ConsumptionContextRef`;change kind;trace context。 | 受控消费读取、关系与分发语义、追溯与一致性保护、后台维护。 | 不携带权限矩阵、鉴权配置或下游状态。 |
| DefinitionUseBoundaryViolationNoticed | 受控消费 | guard violation accepted | `DefinitionUseBoundaryGuardRef`;`DefinitionUseViolationRef`;safe reason ref;trace context。 | 追溯与一致性保护、后台维护、审计材料。 | 不携带原始请求、下游 payload、证据正文或 raw log。 |
| MethodAssetTraceMaterialChanged | 追溯与一致性保护 | trace material organized / state marked | `MethodAssetTraceMaterialRef`;`TraceSubjectRef`;change kind;safe reason ref;trace context。 | 审计读取、影响解释、后台维护、外围组织。 | 不携带 trace material 正文、raw log、topic / payload schema 或投递策略。 |
| ConsumptionImpactSummaryChanged | 追溯与一致性保护 | impact summary registered / disposition changed | `ConsumptionImpactSummaryRef`;`ConsumptionImpactSourceRef`;impact disposition;trace context。 | 一致性保护、后台维护、下游消费方、审计材料。 | 不携带下游运行状态、payload 或执行结果正文。 |
| ConsistencyProtectionDecisionChanged | 追溯与一致性保护 | protection decision established / changed | `ConsistencyProtectionPolicyRef`;`FormalMethodAssetVersionRef`;protected context refs;trace context。 | 受控消费、后台维护、审计材料。 | 不声明 recovery 已执行,不携带恢复计划或 worker 状态。 |
| MethodAssetAuditTrailChanged | 追溯与一致性保护 | audit trail organized / lineage attached | `MethodAssetAuditTrailRef`;`TraceSubjectRef`;audit scope ref;trace context。 | 审计读取、验收材料、后台维护。 | 不携带 raw audit log、report body 或 evidence body。 |
| MethodAssetEvidenceLineageChanged | 追溯与一致性保护 | evidence lineage linked / superseded | `MethodAssetEvidenceLineageRef`;`TraceSubjectRef`;external / artifact ref hints;trace context。 | 审计、验收、外部摘要、后台维护。 | 不携带 artifact 包体、archive 内容、证据正文或标准全文。 |
| MethodAssetRelationChanged | 关系与分发语义 | relation established / adjusted / constrained / superseded / retired | `MethodAssetRelationRef`;source / target refs;change kind;trace context。 | 受控消费、追溯与一致性保护、后台维护、外围组织。 | 不携带 relation 正文全集、定义正文、topic / payload schema 或投递策略。 |
| MethodAssetRelationIntegrityChanged | 关系与分发语义 | integrity evaluated / violation marked / violation cleared | `MethodAssetRelationRef`;`RelationIntegrityRuleRef`;integrity state hint;safe reason ref。 | 追溯一致性保护、后台维护、受控消费读取。 | 不携带规则矩阵、policy engine 配置、图算法结果或外部正文。 |
| MethodAssetDistributionRefChanged | 关系与分发语义 | distribution ref prepared / context adjusted / retired | `MethodAssetDistributionRef`;`DistributionContextRef`;change kind;trace context。 | 受控消费、外围包与方法集组织、后台维护、追溯材料。 | 不携带 marketplace listing、订单、安装、履约、同步包或分发协议。 |
| MethodAssetDistributionAvailabilityChanged | 关系与分发语义 | distribution availability marker changed | `MethodAssetDistributionRef`;availability marker;safe reason ref;trace context。 | 受控消费读取、外围发现、后台维护。 | 不声明下游已同步、已安装或可交易;不携带 material 正文。 |
| MethodAssetRelationReadMaterialInvalidated | 关系与分发语义 | relation or distribution source changed | relation / distribution refs;staleness reason ref;refresh hint。 | 后台维护与收敛、读取材料消费者。 | 只表达 invalidation hint;不执行刷新 job,不携带 projection storage 或 worker 参数。 |
| ExternalSourceSummaryChanged | 外部摘要与引用 | summary captured / accepted / rejected / unavailable / superseded | `ExternalSourceSummaryRef`;`ExternalSourceRef`;change kind;acceptance marker;trace context。 | 正式化与版本、追溯与一致性保护、关系与分发语义、外围组织、后台维护。 | 不携带 external safe summary 正文全集、外部正文、topic / payload schema 或投递策略。 |
| ExternalSourceRefChanged | 外部摘要与引用 | external source ref registered / version hint changed | `ExternalSourceRef`;source kind;version hint;digest hint;trace context。 | 正式化、追溯、关系、后台维护。 | 不携带 URL、外部正文、provider payload 或认证信息。 |
| ArtifactArchiveRefChanged | 外部摘要与引用 | artifact archive ref registered / digest hint changed | `ArtifactArchiveRef`;artifact kind;digest hint;trace context。 | 追溯、证据 lineage、验收材料、后台维护。 | 不携带 artifact 包体、archive 内容、证据正文或存储路径。 |
| ExternalBodyBoundaryViolationNoticed | 外部摘要与引用 | external body boundary assertion / rejection | candidate ref;violation kind;safe reason ref;trace context。 | 审计、追溯、后台维护、上游修正流程。 | 不携带被拒正文、payload、文件内容或证据正文。 |
| ExternalEvidenceLineageChanged | 外部摘要与引用 | external evidence lineage linked / superseded | `MethodAssetEvidenceLineageRef`;external source refs;artifact refs;trace subject ref。 | 追溯、审计、验收、后台维护。 | 不携带 artifact 包体、archive 内容、证据正文或验收报告正文。 |
| MethodAssetMaintenanceRequested | 后台维护与收敛 | bounded maintenance request accepted | `MaintenanceRunRef`;`RefreshScopeRef`;run kind;safe reason ref;trace context。 | 维护进度读取、审计、后台协调。 | 不携带 worker、queue、scheduler、retry、topic 或 payload schema。 |
| MethodAssetReadMaterialRefreshChanged | 后台维护与收敛 | read refresh job result | `ReadMaterialRefreshTaskRef`;`MaintenanceRunRef`;refresh outcome;freshness refs。 | Query surfaces、受控消费、关系分发、外围读取。 | 不携带 material body、cache/index details 或 projection storage。 |
| MethodAssetTraceMaterialRefreshChanged | 后台维护与收敛 | trace refresh job result | `TraceMaterialRefreshTaskRef`;trace subject refs;partial / converged marker。 | 追溯、审计、验收、影响解释。 | 不携带 raw log、event payload、证据正文、report body。 |
| MethodAssetConsistencyRecoveryChanged | 后台维护与收敛 | recovery task result | `ConsistencyRecoveryTaskRef`;recovery outcome;formal intervention hint。 | 追溯一致性、维护读取、正式流程。 | 不声明 core truth 已被自动修复,不携带恢复脚本或下游运行状态。 |
| MethodAssetMaintenanceProgressChanged | 后台维护与收敛 | progress view changed | `MaintenanceProgressViewRef`;`MaintenanceRunRef`;progress marker;safe reason ref。 | 维护进度 Query、审计、运维观测。 | 不携带 raw telemetry、metric body、trace span、worker state 或 report body。 |
| MethodPackageChanged | 外围包与方法集组织 | package command accepted | `MethodPackageRef`;change kind;member / context refs;trace context。 | 外围读取材料刷新、审计、生态发现读取。 | 不携带 package body、artifact/archive body、listing、交易或安装信息。 |
| MethodSetAssemblyChanged | 外围包与方法集组织 | method set command accepted | `MethodSetAssemblyRef`;change kind;package / member refs;adoption context refs;trace context。 | 外围读取材料刷新、采用评估读取、审计。 | 不携带组织运行配置、UI / SDK 状态、AI override 或下游采用结果。 |
| PackageCompositionResultChanged | 外围包与方法集组织 | composition evaluation accepted | package or assembly ref;composition marker;safe reason refs;trace context。 | package / assembly view、维护刷新、审计解释。 | 不携带完整规则算法、规则矩阵或 policy engine 内部。 |
| PeripheralViewAvailabilityChanged | 外围包与方法集组织 | package / assembly view availability changed | view ref;availability / freshness marker;source refs;trace context。 | console / SDK 读取面、维护进度读取、审计。 | 派生可用性变化不代表核心 truth 改变,不携带 projection storage 细节。 |

#### R1.30.2 本总表停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 Outbound Event 总表 | pass | 未写 Operations Job 总表、接口映射或正式 §7。 |
| 是否覆盖 R1.29 裁定的 34 个候选 | pass | 2 + 4 + 4 + 5 + 5 + 5 + 5 + 4 = 34。 |
| 是否覆盖八个组成部分 | pass | 八个组成部分均有事件行。 |
| 是否保持 ref / marker / trace context 输出 | pass | 输出骨架只保留 typed refs、summary refs、state / availability / freshness markers、safe reason refs 和 trace context。 |
| 是否避免 delivery 实现下沉 | pass | 未写 topic、payload schema、outbox、relay、dead letter、retry、partition key 或 subscriber。 |
| 是否避免正文 / 包体 / raw log 外泄 | pass | 所有事件边界均禁止正文、artifact 包体、证据正文、report body 或 raw log。 |
| 是否区分派生材料变化与 core truth 变化 | pass | read material、view、progress 类事件均标注为材料 / 维护状态变化。 |
| 是否避免旧主线污染 | pass | 未恢复旧 `OutboxEvent`、fingerprint、snapshot publish 或 content package publish。 |
| 是否允许进入 Operations Job 骨架总表:先思考 | pass | Outbound 总表已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `Operations Job 骨架总表:先思考`;只思考维护 / 派生 / 收敛 job 汇总口径,不得直接写 Operations Job 总表正文,不得改正式 §7,不得进入 Step 8/9。

### R1.31 Operations Job 骨架总表:先思考

#### R1.31.1 问题回答

- 本模块只思考全仓 Operations Job 总表的汇总口径,不写 Operations Job 总表正文,不写接口映射,不改正式 `02-概要设计.md` §7。
- Operations Job 只用于基于已持久化事实刷新 read material、trace/audit/impact material、外部摘要读取材料、外围读取材料,以及推进一致性恢复收敛。它不是业务 Command,不得创建、修改、删除或修复 core truth。
- Job 输入必须使用 `MaintenanceRunRef`、`RefreshScopeRef`、`ReadMaterialRefreshTaskRef`、`TraceMaterialRefreshTaskRef`、`ConsistencyRecoveryTaskRef` 和相关 subject/material refs,不得使用 worker id、queue id、cron 名称、retry token、free-form scope 或 cache key 替代。
- Job 输出只允许 refresh result summary、freshness marker、progress marker、partial/converged marker、recovery outcome 或 body-free issue/ref summary。不得输出 raw diagnostic、外部正文、artifact 包体、证据正文、下游运行状态、worker log 或 report body。
- 本轮 Operations Job 总表只汇总 `后台维护与收敛` 的 `R1.20.3` 8 个局部 job。其他组成部分的 job 线索都已裁定为 `no_here` 或 `no_direct_definition`,其维护能力已经归并到后台维护,不在总表中重复定义。
- 与 L1-governance 的参考框架不同,本仓当前不引入 outbox publish、external GRC export、archive handoff 这类治理特有 job。若后续需要交付 / 导出 / 投递机制,必须在详细设计或后续文档中重新闭口,不能反推当前概要总表。

#### R1.31.2 候选数量盘点

| 来源组成部分 | 局部 Job 裁决 | 可进入总表数量 | 当前裁决 |
|---|---:|---:|---|
| 方法资产定义与目录 | no_here | 0 | catalog / definition view refresh 归后台维护,不在本组件定义 job。 |
| 正式化与版本 | no_here | 0 | formal version view rebuild、stale basis re-evaluate 归后台维护 / 外部摘要,不在本组件定义 job。 |
| 受控消费 | no_here | 0 | consumption material rebuild、availability projection repair 归后台维护。 |
| 追溯与一致性保护 | no_here | 0 | trace material rebuild、consistency recovery 归后台维护。 |
| 关系与分发语义 | no_here / no | 0 | relation view、distribution material rebuild 归后台维护;graph traversal / recommendation 不进入本仓 Step 7。 |
| 外部摘要与引用 | no_here | 0 | external source refresh、reference availability check 归后台维护,不在本组件私自执行。 |
| 后台维护与收敛 | yes | 8 | `R1.20.3` 已给出 8 个 Operations Job 局部骨架,全部进入总表候选。 |
| 外围包与方法集组织 | no_direct_definition | 0 | peripheral read material refresh 已由后台维护 `RefreshPeripheralReadMaterials` 承接。 |

候选总数:8 个 Operations Job。

#### R1.31.3 预计纳入总表的 Job

| Operations Job | 来源依据 | 纳入理由 | 主要任务对象 |
|---|---|---|---|
| RefreshCatalogAndDefinitionReadMaterials | `R1.20.3` | definition / catalog truth 变化后需要刷新目录、定义读取材料和可见摘要。 | `ReadMaterialRefreshTask`;`MaintenanceRunRef`;`RefreshScopeRef`。 |
| RefreshFormalVersionReadMaterials | `R1.20.3` | formal version / formalization 变化后需要刷新正式版本读取材料。 | `ReadMaterialRefreshTask`;formal version refs;target view/material refs。 |
| RefreshConsumptionReadMaterials | `R1.20.3` | consumption material、availability view 和消费读取材料需要基于已成立事实收敛。 | `ReadMaterialRefreshTask`;consumption material refs;availability view refs。 |
| RefreshRelationDistributionMaterials | `R1.20.3` | relation view、distribution read material 和 staleness marker 需要维护刷新。 | `ReadMaterialRefreshTask`;relation refs;distribution refs;read material refs。 |
| RefreshExternalSummaryReadMaterials | `R1.20.3` | external summary view、external ref 可用性和 artifact ref 线索需要 body-free 复核。 | `ReadMaterialRefreshTask`;external summary / ref / artifact refs。 |
| RefreshTraceAuditImpactMaterials | `R1.20.3` | trace material、audit trail、evidence lineage、impact summary 读取材料需要刷新。 | `TraceMaterialRefreshTask`;trace subject refs;audit / evidence / impact refs。 |
| RunConsistencyRecoveryConvergence | `R1.20.3` | 可恢复异常、引用失效、摘要不一致、传播滞后需要正式收敛结果。 | `ConsistencyRecoveryTask`;`MaintenanceRunRef`;recovery scope;related material refs。 |
| RefreshPeripheralReadMaterials | `R1.20.3` | package / method set 读取材料和外围可发现线索需要统一维护刷新。 | `ReadMaterialRefreshTask`;package / method set refs;peripheral view refs。 |

#### R1.31.4 纳入规则

| 规则 | 说明 |
|---|---|
| task object anchored | 每个 job 必须回指 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask` 或 `ConsistencyRecoveryTask`。 |
| run / scope typed | 每个 job 必须包含 `MaintenanceRunRef` 和 `RefreshScopeRef` 或 recovery scope,不得使用 worker / queue / cron 替代。 |
| committed source only | job 只能读取已成立 truth、summary、material、view refs 或 history refs,不得从外部正文或下游运行状态扫描。 |
| derived output only | 输出只能是 refreshed material refs、freshness/progress markers、recovery summary 或 safe issue refs。 |
| no core truth repair | job 不得修改 definition、formal version、consumption boundary、relation、external summary、package 或 method set truth。 |
| no runtime mechanics | 概要层不写 worker loop、scheduler、queue、topic、lock、retry、adapter、cache/index/store 或 DDL。 |

#### R1.31.5 排除 / 降级规则

| 排除项 | 裁决 | 理由 |
|---|---|---|
| GenericWorkerLoop / Scheduler / Cron | exclude | 执行机制不属于概要接口骨架。 |
| PublishOutbox / Relay / DeadLetterJob | exclude_current_step | 本仓当前 Outbound 只定义事件边界,不恢复旧 outbox / relay 实现。 |
| TruthRepairJob | exclude | 维护不能成为第二业务写面,不能修 core truth。 |
| ExternalBodyBackfillJob | exclude | 外部摘要缺失或引用失效时不得复制正文补齐。 |
| DownstreamRuntimeScanJob | exclude | process、identity、runtime、UI、SDK 等下游运行状态不是本仓维护输入。 |
| SearchRankingRecommendationRefresh | exclude | 推荐、排序、图遍历和搜索刷新不属于本仓概要接口。 |
| Archive / Marketplace / GRC export job | defer | 当前 L3-method-library 概要未闭合这些交付边界;后续如需要必须另行讨论。 |

#### R1.31.6 下一写入批次结构

下一批 `R1.32 Operations Job 骨架总表:再写入` 只写:

1. `Operations Job 骨架总表`。
2. `本总表停审记录`。
3. `next_allowed_action` 推进到 `接口到主要组成部分映射:先思考`。

#### R1.31.7 下一写入批次边界

- 写入 8 个 Operations Job 行,全部来自 `R1.20.3`。
- 每行必须包含 Operations Job、主要组成部分、输入骨架、输出骨架、主要处理摘要、边界。
- 不写接口映射、诊断审计、正式 §7、Step 8/9、worker / queue / scheduler / retry / lock / DDL / adapter / cache 实现。
- 不补充 L1-governance 里的治理特有 export / handoff / outbox publish job。

#### R1.31.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写 Operations Job 总表正文。 |
| 是否完成候选盘点 | pass | 八个组成部分均已盘点,候选总数为 8。 |
| 是否只纳入后台维护与收敛 job | pass | 其他组件 job 线索均归并到后台维护,不重复定义。 |
| 是否保持 task / run / scope ref 边界 | pass | 纳入规则要求使用正式 task refs、`MaintenanceRunRef` 和 `RefreshScopeRef`。 |
| 是否避免维护修 core truth | pass | 明确排除 TruthRepairJob 和维护路径修改业务 truth。 |
| 是否避免实现机制下沉 | pass | worker、scheduler、queue、topic、lock、retry、DDL、adapter 均排除。 |
| 是否修改正式 §7 | no | 正式回填仍等待 Job 总表、映射、审计和草稿。 |
| 是否允许进入 Operations Job 骨架总表:再写入 | pass | 汇总口径已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `Operations Job 骨架总表:再写入`;只写 8 个 Operations Job 总表行和停审记录,不得改正式 §7,不得进入 Step 8/9。

### R1.32 Operations Job 骨架总表:再写入

#### R1.32.1 Operations Job 骨架总表

| Operations Job | 主要组成部分 | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|---|
| RefreshCatalogAndDefinitionReadMaterials | 后台维护与收敛 | `MaintenanceRunRef`;`RefreshScopeRef`;definition / catalog truth refs;target material refs。 | refresh result summary;material freshness refs;progress marker。 | 从已成立 definition / catalog truth 刷新目录与定义读取材料。 | 不修改 definition truth、catalog truth、history truth;不写 cache/index/store 实现。 |
| RefreshFormalVersionReadMaterials | 后台维护与收敛 | `MaintenanceRunRef`;`RefreshScopeRef`;formal version refs;target view/material refs。 | refresh result summary;freshness refs;progress marker。 | 刷新正式版本读取材料和可读摘要。 | 不改变正式化结果、版本 truth、basis summary 或状态迁移。 |
| RefreshConsumptionReadMaterials | 后台维护与收敛 | `MaintenanceRunRef`;`RefreshScopeRef`;consumption material refs;availability view refs。 | consumption refresh summary;availability freshness markers。 | 刷新受控消费读取材料和 availability view。 | 不重新裁决消费边界,不扩大消费授权,不扫描下游运行状态。 |
| RefreshRelationDistributionMaterials | 后台维护与收敛 | `MaintenanceRunRef`;`RefreshScopeRef`;relation refs;distribution refs;read material refs。 | relation / distribution refresh summary;staleness cleared marker。 | 刷新关系 view 和分发读取材料。 | 不创建或修改 relation truth,不执行图遍历、推荐、搜索排序。 |
| RefreshExternalSummaryReadMaterials | 后台维护与收敛 | `MaintenanceRunRef`;`RefreshScopeRef`;external summary / ref / artifact refs。 | external summary refresh result;validity / freshness markers。 | 刷新外部摘要 view 和引用有效性线索。 | 不复制外部正文,不代理外部 API,不拥有 external source lifecycle。 |
| RefreshTraceAuditImpactMaterials | 后台维护与收敛 | `MaintenanceRunRef`;`RefreshScopeRef`;trace subject refs;audit / evidence / impact refs。 | trace refresh result;partial / converged markers。 | 刷新追溯材料、审计线索、证据 lineage 和影响摘要读取材料。 | 不保存 raw log、证据正文、artifact 包体、archive 内容、report body。 |
| RunConsistencyRecoveryConvergence | 后台维护与收敛 | `MaintenanceRunRef`;`ConsistencyRecoveryTaskRef`;recovery scope;related material refs。 | recovery convergence summary;converged / suspended / rejected marker。 | 推进读取材料缺失、引用失效、摘要不一致或传播滞后的恢复收敛。 | 不自动修复 core truth,不重做正式化,不绕过消费边界,不复制外部正文。 |
| RefreshPeripheralReadMaterials | 后台维护与收敛 | `MaintenanceRunRef`;`RefreshScopeRef`;package / method set refs;peripheral view refs。 | peripheral refresh summary;availability markers。 | 刷新外围 package / method set 读取材料和可发现线索。 | 不让外围不可用影响核心闭环成立,不进入 marketplace 交易、安装或履约。 |

#### R1.32.2 本总表停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 Operations Job 总表 | pass | 未写接口映射、诊断审计、正式 §7 或 Step 8/9。 |
| 是否覆盖 R1.31 裁定的 8 个候选 | pass | 8 个候选均来自 `R1.20.3`。 |
| 是否只归属后台维护与收敛 | pass | 所有 job 的主要组成部分均为 `后台维护与收敛`,避免各组件重复定义维护入口。 |
| 是否保持 task / run / scope ref 边界 | pass | 每行均使用 `MaintenanceRunRef`、`RefreshScopeRef` 或正式 task ref / material ref。 |
| 是否避免维护修 core truth | pass | 每行边界均禁止修改核心 truth、正式化结果、消费边界、关系 truth、外部摘要 truth 或外围 truth。 |
| 是否避免正文 / raw log / 下游运行状态入仓 | pass | 外部正文、artifact 包体、证据正文、raw log、report body、下游运行状态均被禁止。 |
| 是否避免实现机制下沉 | pass | 未写 worker、scheduler、queue、topic、retry、lock、adapter、cache/index/store、DDL 或刷新算法。 |
| 是否避免 L1-governance 特有 job 污染 | pass | 未引入 outbox publish、external GRC export、archive handoff 等治理特有 job。 |
| 是否允许进入接口到主要组成部分映射:先思考 | pass | 五类总表已全部完成。 |

next_allowed_action: 等待用户确认后进入 Step 7 `接口到主要组成部分映射:先思考`;只思考 Command / Query / Inbound / Outbound / Operations 五类接口到八个组成部分的映射口径,不得直接写映射表正文,不得改正式 §7,不得进入 Step 8/9。

### R1.33 接口到主要组成部分映射:先思考

#### R1.33.1 问题回答

- 本模块只思考五类接口到八个主要组成部分的映射口径,不写最终映射表正文,不改正式 `02-概要设计.md` §7,不进入 Step 8/9。
- 映射表的用途是给 Step 8 处理流和后续一致性审计提供反查索引,不是重新定义主要组成部分、对象归属或接口命名。
- 映射输入只来自五类总表:`R1.24` Command、`R1.26` Query、`R1.28` Inbound Event Consumer、`R1.30` Outbound Event、`R1.32` Operations Job。
- 映射行必须沿用 Step 5 的八个主要组成部分,不得新增 technical component、repository、adapter、worker、outbox 或旧模块行。
- 参考 L1-governance 的 §10 只用于表格框架和反查目的;不得复制 governance 的 domain 组件、outbox publish、external GRC export、archive handoff 或治理特有语义。

#### R1.33.2 映射输入盘点

| 接口族 | 输入来源 | 总数 | 覆盖情况 | 当前判断 |
|---|---|---:|---|---|
| Command | `R1.24` | 58 | 八个组成部分均有 Command。 | 按写入 truth / boundary / accepted summary / maintenance intent / peripheral organization 的 owner 归属。 |
| Query | `R1.26` | 57 | 八个组成部分均有 Query。 | 按读取 view、read material、summary、typed ref、availability、trace、impact、progress 或 peripheral view 的 owner 归属。 |
| Inbound Event Consumer | `R1.28` | 4 | 仅外部摘要与引用。 | 只承接 body-free 外部摘要、外部 source ref、artifact ref 和 evidence lineage 事实。 |
| Outbound Event | `R1.30` | 34 | 八个组成部分均有 Outbound Event。 | 按事实变化来源 owner 归属,主要消费者只写在事件边界说明中。 |
| Operations Job | `R1.32` | 8 | 仅后台维护与收敛。 | 维护 / 派生 / 收敛 job 统一归后台维护,其他组成部分不重复定义 job。 |

| 主要组成部分 | Command 数 | Query 数 | Inbound Consumer 数 | Outbound Event 数 | Operations Job 数 | 初步判断 |
|---|---:|---:|---:|---:|---:|---|
| 方法资产定义与目录 | 6 | 4 | 0 | 2 | 0 | 定义 / 目录拥有写入口、读取面和事实事件,无直接 inbound / job。 |
| 正式化与版本 | 6 | 6 | 0 | 4 | 0 | 正式化和版本拥有写入口、读取面和版本事实事件,外部材料通过外部摘要边界进入。 |
| 受控消费 | 5 | 6 | 0 | 4 | 0 | 消费材料、边界和可用性拥有写读与事件,不直接消费外部事件。 |
| 追溯与一致性保护 | 7 | 7 | 0 | 5 | 0 | 追溯、影响、一致性保护和审计拥有写读与事件,维护动作归后台维护。 |
| 关系与分发语义 | 10 | 9 | 0 | 5 | 0 | 关系和分发拥有写读与事件,不把 marketplace / delivery job 纳入本组件。 |
| 外部摘要与引用 | 9 | 8 | 4 | 5 | 0 | 唯一 inbound owner,负责 body-free 外部摘要和引用事实的进入与对外事件。 |
| 后台维护与收敛 | 6 | 8 | 0 | 5 | 8 | 统一承接维护请求、进度读取、维护事件和 Operations Job。 |
| 外围包与方法集组织 | 9 | 9 | 0 | 4 | 0 | 包、方法集和外围读取增强拥有写读与事件,不进入交易、安装或履约。 |

#### R1.33.3 预计映射维度

| 维度 | 写入目的 | 约束 |
|---|---|---|
| 主要组成部分 | 固定八行反查入口。 | 名称必须与 Step 5 一致。 |
| Command | 列出该组成部分拥有的写入口。 | 只从 `R1.24` 摘取,不得新增或改名。 |
| Query | 列出该组成部分拥有的读取入口。 | 只从 `R1.26` 摘取,不得把 Query 写成 command-like action。 |
| Inbound Consumer | 列出该组成部分承接的外部事件消费入口。 | 当前只有外部摘要与引用有条目;其他行写 `-` 或明确无直接 consumer。 |
| Outbound Event | 列出该组成部分发布的事实变化事件。 | 只从 `R1.30` 摘取,不写 topic、payload schema、relay 或 outbox 实现。 |
| Operations Job | 列出该组成部分拥有的后台维护 job。 | 当前只有后台维护与收敛有条目;不得把刷新职责复制到各业务组件。 |
| 边界说明 | 解释为什么该行这样归属。 | 只写边界和反查说明,不写 Step 8 流程正文。 |

#### R1.33.4 映射规则

| 规则 | 说明 |
|---|---|
| owner first | 接口归属优先看写入 / 读取 / 事件来源 / job 任务对象的主要组成部分 owner。 |
| total table source only | 映射表只允许引用五类总表中已经确认的接口名。 |
| no duplicate ownership | 一个接口只在 owner 行出现一次;跨组件影响写入边界说明,不复制成多个 owner。 |
| inbound boundary narrow | Inbound 只归属外部摘要与引用,因为外部事实必须先通过 body-free external summary / ref boundary。 |
| job consolidation | Operations Job 只归后台维护与收敛,业务组件的刷新、恢复、对账线索不单独建 job owner。 |
| outbound by fact source | Outbound Event 按事实变化来源归属,不按主要消费者、订阅方或传输机制归属。 |
| step8 index only | 映射表为 Step 8 提供反查入口,不提前写处理流、事务边界、异常分支或状态迁移。 |

#### R1.33.5 排除 / 降级规则

| 排除 / 降级项 | 裁决 | 理由 |
|---|---|---|
| repository / adapter / mapper / worker 行 | exclude | 技术实现单元不属于主要组成部分映射。 |
| old `MethodContent` / publish / snapshot / fingerprint 主线 | exclude | 已被 Step 5 / Step 6 / Step 7 新口径替代,不得借映射表恢复。 |
| old `OutboxEvent` owner | exclude | 当前只定义 Outbound Event 边界,不恢复 outbox 实现主线。 |
| L1-governance 专属组件或 job | exclude | 只能参考框架深度,不能复制治理领域语义。 |
| HTTP path / RPC method / topic / payload schema | exclude | 属于详细设计或实现层,不进入概要接口映射。 |
| 下游运行状态 / marketplace 交易 / 安装履约 | exclude | 不属于本仓 truth 或接口 owner。 |
| 多组件消费者关系 | degrade_to_boundary_note | 消费者和影响方只写在边界说明,不造成重复归属。 |

#### R1.33.6 下一写入批次结构

下一批 `R1.34 接口到主要组成部分映射:再写入` 只写:

1. `接口到主要组成部分映射表`。
2. `映射表使用说明`。
3. `本模块停审记录`。
4. `next_allowed_action` 推进到 `当前文档问题诊断与设计取舍:先思考`。

#### R1.33.7 下一写入批次边界

- 写入 8 行映射表,每行对应一个 Step 5 主要组成部分。
- 列只使用 `主要组成部分 | Command | Query | Inbound Consumer | Outbound Event | Operations Job | 边界说明`。
- 每个接口名必须来自 `R1.24` / `R1.26` / `R1.28` / `R1.30` / `R1.32`,不得新增候选。
- 对无直接接口族的单元格写 `-` 或简短说明,不得为了填满表格创造接口。
- 不写正式 §7、不写当前文档问题诊断、不写跨接口一致性审计、不写旧材料差异审计、不进入 Step 8/9。

#### R1.33.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写最终映射表正文。 |
| 是否完成五类总表输入盘点 | pass | Command 58、Query 57、Inbound 4、Outbound 34、Operations Job 8 均已盘点。 |
| 是否覆盖八个组成部分 | pass | 八个组成部分均完成数量和归属初判。 |
| 是否避免新增接口 | pass | 下一写入规则限定只能引用五类总表接口名。 |
| 是否避免技术实现下沉 | pass | repository、adapter、mapper、worker、topic、payload schema、outbox 实现均排除。 |
| 是否避免 L1-governance 语义污染 | pass | 明确仅参考表格框架,不复制治理特有组件或 job。 |
| 是否修改正式 §7 | no | 正式回填仍等待映射、诊断、审计和草稿。 |
| 是否允许进入接口到主要组成部分映射:再写入 | pass | 映射口径已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `接口到主要组成部分映射:再写入`;只写八个主要组成部分的五类接口反查映射表和停审记录,不得改正式 §7,不得进入 Step 8/9。

### R1.34 接口到主要组成部分映射:再写入

#### R1.34.1 接口到主要组成部分映射表

| 主要组成部分 | Command | Query | Inbound Consumer | Outbound Event | Operations Job | 边界说明 |
|---|---|---|---|---|---|---|
| 方法资产定义与目录 | `EstablishMethodAssetDefinition`;`AdjustMethodAssetDefinition`;`RetireMethodAssetDefinition`;`RegisterMethodAssetCatalogEntry`;`ReclassifyMethodAssetCatalogEntry`;`RetireMethodAssetCatalogEntry` | `GetMethodAssetDefinitionSummary`;`ResolveMethodAssetDefinitionRef`;`GetMethodAssetCatalogEntry`;`ListMethodAssetCatalogView` | - | `MethodAssetDefinitionChanged`;`MethodAssetCatalogEntryChanged` | - | 本行负责 definition truth、catalog entry truth 和对应读取材料的入口索引;不直接承接外部事件,不定义刷新 job。 |
| 正式化与版本 | `EvaluateMethodAssetFormalizationEligibility`;`InitiateMethodAssetFormalization`;`EstablishFormalMethodAssetVersion`;`RecordFormalVersionSemanticChange`;`SupersedeFormalMethodAssetVersion`;`RetireFormalMethodAssetVersion` | `GetFormalizationState`;`GetFormalMethodAssetVersionSummary`;`ResolveCurrentFormalMethodAssetVersion`;`GetFormalizationBasisSummary`;`GetFormalizationEligibilityDiagnostic`;`ListFormalizationHistory` | - | `MethodAssetFormalizationDecisionChanged`;`FormalMethodAssetVersionEstablished`;`FormalMethodAssetVersionChanged`;`FormalMethodAssetVersionRetired` | - | 本行负责正式化判断、正式版本成立、替代和退役;外部依据必须先经过外部摘要与引用边界。 |
| 受控消费 | `RegisterDownstreamConsumptionBoundary`;`AdjustDownstreamConsumptionBoundary`;`PrepareMethodAssetConsumptionMaterial`;`MarkMethodAssetConsumptionMaterialState`;`RecordDefinitionUseBoundaryViolation` | `GetMethodAssetConsumptionMaterial`;`GetMethodAssetAvailabilityView`;`ResolveConsumptionContextRef`;`GetDownstreamConsumptionBoundary`;`GetDefinitionUseBoundaryDiagnostic`;`ListConsumableContextsForFormalVersion` | - | `MethodAssetConsumptionMaterialPrepared`;`MethodAssetConsumptionAvailabilityChanged`;`DownstreamConsumptionBoundaryChanged`;`DefinitionUseBoundaryViolationNoticed` | - | 本行负责 formal version 的受控消费材料、消费边界、可用性和越界线索;不接收下游运行状态或授权实现细节。 |
| 追溯与一致性保护 | `OrganizeMethodAssetTraceMaterial`;`MarkMethodAssetTraceMaterialState`;`RegisterConsumptionImpactSummary`;`MarkConsumptionImpactDisposition`;`EstablishConsistencyProtectionDecision`;`OrganizeMethodAssetAuditTrail`;`LinkMethodAssetEvidenceLineage` | `GetMethodAssetTraceMaterial`;`GetTraceBySubject`;`GetConsumptionImpactSummary`;`ListPendingConsumptionImpacts`;`GetConsistencyProtectionDiagnostic`;`GetMethodAssetAuditTrail`;`GetMethodAssetEvidenceLineage` | - | `MethodAssetTraceMaterialChanged`;`ConsumptionImpactSummaryChanged`;`ConsistencyProtectionDecisionChanged`;`MethodAssetAuditTrailChanged`;`MethodAssetEvidenceLineageChanged` | - | 本行负责 trace、impact、consistency protection、audit 和 evidence lineage;维护刷新和收敛动作归后台维护与收敛。 |
| 关系与分发语义 | `EstablishMethodAssetRelation`;`AdjustMethodAssetRelation`;`ConstrainMethodAssetRelation`;`SupersedeMethodAssetRelation`;`RetireMethodAssetRelation`;`EvaluateRelationIntegrity`;`MarkRelationIntegrityViolation`;`PrepareMethodAssetDistributionRef`;`AdjustMethodAssetDistributionContext`;`MarkMethodAssetDistributionAvailability` | `GetMethodAssetRelation`;`ListMethodAssetRelationsByEndpoint`;`ListMethodAssetRelationsByFormalVersion`;`ListMethodAssetRelationsByDistributionContext`;`GetRelationIntegrityDiagnostic`;`GetRelationChangeSummary`;`ResolveMethodAssetDistributionRef`;`GetDistributionReadMaterial`;`ListDistributionReadMaterialsByContext` | - | `MethodAssetRelationChanged`;`MethodAssetRelationIntegrityChanged`;`MethodAssetDistributionRefChanged`;`MethodAssetDistributionAvailabilityChanged`;`MethodAssetRelationReadMaterialInvalidated` | - | 本行负责 relation truth、integrity、distribution ref 和 distribution read material;不进入 marketplace 交易、安装、履约、推荐或图算法实现。 |
| 外部摘要与引用 | `CaptureExternalSourceSummary`;`RegisterExternalSourceRef`;`RegisterArtifactArchiveRef`;`AssertExternalBodyBoundary`;`RejectExternalBodyCandidate`;`AcceptExternalBasisSummary`;`MarkExternalBasisDisposition`;`SupersedeExternalSourceSummary`;`LinkExternalEvidenceLineage` | `GetExternalSourceSummary`;`GetExternalSummaryBySourceRef`;`ResolveExternalSourceRef`;`GetArtifactArchiveRef`;`GetExternalBodyBoundaryDiagnostic`;`GetExternalSourceSummaryView`;`GetExternalBasisAcceptanceHistory`;`GetExternalEvidenceLineageHint` | `ConsumeBodyFreeExternalSummaryAccepted`;`ConsumeExternalSourceRefRegistered`;`ConsumeArtifactArchiveRefRegistered`;`ConsumeExternalBodyBoundaryViolation` | `ExternalSourceSummaryChanged`;`ExternalSourceRefChanged`;`ArtifactArchiveRefChanged`;`ExternalBodyBoundaryViolationNoticed`;`ExternalEvidenceLineageChanged` | - | 本行是唯一 Inbound owner,只承接 body-free external summary / source ref / artifact ref / violation 事实;不得接收外部正文、artifact 包体或 provider payload。 |
| 后台维护与收敛 | `RequestReadMaterialRefresh`;`RequestTraceMaterialRefresh`;`RequestConsistencyRecovery`;`MarkMaintenanceSuspended`;`RequireMaintenanceFormalIntervention`;`SupersedeMaintenanceRequest` | `GetMaintenanceProgress`;`GetMaintenanceProgressByRun`;`GetMaintenanceProgressByScope`;`GetReadMaterialRefreshTaskSummary`;`GetTraceMaterialRefreshTaskSummary`;`GetConsistencyRecoveryTaskSummary`;`GetMaintenanceRunHistory`;`ListPendingMaintenanceScopes` | - | `MethodAssetMaintenanceRequested`;`MethodAssetReadMaterialRefreshChanged`;`MethodAssetTraceMaterialRefreshChanged`;`MethodAssetConsistencyRecoveryChanged`;`MethodAssetMaintenanceProgressChanged` | `RefreshCatalogAndDefinitionReadMaterials`;`RefreshFormalVersionReadMaterials`;`RefreshConsumptionReadMaterials`;`RefreshRelationDistributionMaterials`;`RefreshExternalSummaryReadMaterials`;`RefreshTraceAuditImpactMaterials`;`RunConsistencyRecoveryConvergence`;`RefreshPeripheralReadMaterials` | 本行统一承接维护请求、维护进度、派生读取材料刷新、追溯材料刷新和一致性恢复收敛;job 不修 core truth,不写 worker / queue / scheduler 实现。 |
| 外围包与方法集组织 | `EstablishMethodPackage`;`AdjustMethodPackageComposition`;`RetireMethodPackage`;`MarkMethodPackageUnavailable`;`AssembleMethodSet`;`AdjustMethodSetAssembly`;`RetireMethodSetAssembly`;`MarkMethodSetAssemblyStaleOrUnavailable`;`EvaluatePackageComposition` | `GetMethodPackage`;`ListMethodPackages`;`GetMethodPackageView`;`GetMethodPackageCompositionDiagnostic`;`GetMethodSetAssembly`;`ListMethodSetAssemblies`;`GetMethodSetAssemblyView`;`GetPeripheralDiscoveryContext`;`GetPackageAssemblyHistory` | - | `MethodPackageChanged`;`MethodSetAssemblyChanged`;`PackageCompositionResultChanged`;`PeripheralViewAvailabilityChanged` | - | 本行负责 package、method set、composition 和 peripheral view;不把外围不可用上升为核心闭环失败,不进入 marketplace listing、交易、安装或履约。 |

#### R1.34.2 映射表使用说明

| 使用场景 | 使用方式 | 禁止误读 |
|---|---|---|
| Step 8 处理流分组 | 先按主要组成部分找到接口族,再回到对应总表读取输入 / 输出骨架和边界。 | 不把本表当成完整流程、事务边界或异常分支清单。 |
| Step 9 状态来源反查 | 用 Command、Outbound Event、Operations Job 判断哪些对象可能产生状态线索。 | 不从 Query 或 Inbound intake summary 直接推导 core truth 状态。 |
| 详细设计承接 | 以本表确认 service / port / consumer / job 的 owner 候选。 | 不据此新增 repository、adapter、worker、topic、payload schema 或 DTO 字段全集。 |
| 旧材料污染检查 | 对照本表排除旧 `MethodContent`、snapshot、fingerprint、publish、old outbox 主线。 | 不把旧材料中未出现在五类总表的接口恢复为当前结论。 |

#### R1.34.3 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写映射表和使用说明 | pass | 未写当前文档问题诊断、跨接口一致性审计、旧材料差异审计或正式 §7。 |
| 是否覆盖八个主要组成部分 | pass | 八个 Step 5 主要组成部分均有一行。 |
| 是否只引用五类总表接口名 | pass | Command 来自 `R1.24`,Query 来自 `R1.26`,Inbound 来自 `R1.28`,Outbound 来自 `R1.30`,Operations Job 来自 `R1.32`。 |
| 是否保持 Inbound owner 窄边界 | pass | 只有外部摘要与引用拥有 Inbound Consumer。 |
| 是否保持 Operations Job 统一归属 | pass | 只有后台维护与收敛拥有 Operations Job。 |
| 是否避免重复归属 | pass | 每个接口只出现在一个 owner 行;跨组件影响只写入边界说明。 |
| 是否避免实现细节下沉 | pass | 未写 HTTP path、RPC、topic、payload schema、outbox、repository、adapter、worker、queue、scheduler、DDL。 |
| 是否修改正式 §7 | no | 正式回填仍等待诊断、审计、旧材料差异和草稿。 |
| 是否允许进入当前文档问题诊断与设计取舍:先思考 | pass | 映射表已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `当前文档问题诊断与设计取舍:先思考`;只思考旧正式 §7、旧 5.x 完成态和当前 Step 7 取舍审计口径,不得直接写诊断正文,不得改正式 §7,不得进入 Step 8/9。

### R1.35 当前文档问题诊断与设计取舍:先思考

#### R1.35.1 问题回答

- 本模块只思考“当前文档问题诊断与设计取舍”的写入口径,不写最终诊断表正文,不改正式 `02-概要设计.md` §7,不进入 Step 8/9。
- 诊断对象有三类:旧正式 `02-概要设计.md` §7、本文 historical 5.x 完成态、当前 R1.2~R1.34 新接口结论。
- 诊断目标不是再发明接口,而是说明为什么旧正式 §7 不能局部修补、哪些历史 5.x 判断可作为参考、哪些必须以 R1 新结论替换。
- 取舍必须围绕 Step 5 八个主要组成部分、Step 6 新对象、R1 五类接口总表和 R1.34 映射表展开,不得把旧 `MethodContent` / publish / snapshot / fingerprint / outbox 主线恢复为当前 truth。
- 本模块只形成下一写入批次的诊断框架;最终“问题 -> 影响 -> 当前取舍 -> 后续处理”表留到 `R1.36`。

#### R1.35.2 诊断输入盘点

| 输入 | 当前状态 | 诊断用途 | 使用边界 |
|---|---|---|---|
| 正式 `02-概要设计.md` §7 | historical / polluted | 识别旧接口主线、旧同步机制和旧 P1 混入点。 | 只作问题来源,不得反推当前接口。 |
| 本文件原 `1`~`6` 和 `5.x` | historical material | 识别早期已提出但需重审的分类、审计和禁止事项。 | 可保留框架启发,不得视为本轮完成态。 |
| `R1.24` Command 总表 | current source | 判断旧 Command 是否应替换为新 Command 族。 | 不新增 Command,只用于诊断对照。 |
| `R1.26` Query 总表 | current source | 判断旧 Query / snapshot / fingerprint read 是否应替换为新 Query 族。 | 不新增 Query,只用于诊断对照。 |
| `R1.28` Inbound 总表 | current source | 判断旧 governance gate consumer 是否被当前 inbound 边界替代。 | 当前 inbound 只归外部摘要与引用。 |
| `R1.30` Outbound 总表 | current source | 判断旧 outbox topic / publish event 是否被 current fact event 替代。 | 不写 topic、payload schema 或 relay 机制。 |
| `R1.32` Operations Job 总表 | current source | 判断旧 seed / replay / rebuild / recalculate 是否被当前维护 job 替代。 | job 不修 core truth,不恢复旧 outbox / fingerprint job。 |
| `R1.34` 映射表 | current source | 确认每个接口族的 owner 和反查入口。 | 只作为诊断分组索引,不写 Step 8 流程。 |

#### R1.35.3 预计诊断维度

| 维度 | 需要回答的问题 | 下一批写入方式 |
|---|---|---|
| 分类污染 | 旧 §7 是否仍按 MethodContent CRUD / publish / snapshot / outbox 分类。 | 写问题、影响和替换方向。 |
| 对象污染 | 旧接口输入输出是否仍使用 `MethodContent`、`DefinitionSnapshot`、`Fingerprint`、`OutboxEvent`。 | 写对应的新对象 / ref / summary / material 替代。 |
| 读写边界 | 旧 Query 是否混入 export / compare / trace aggregation,旧 Command 是否混入发布传播。 | 写 Command / Query / Event / Job 的新边界。 |
| Inbound 边界 | 旧 governance gate consumer 是否仍围绕 publish gate。 | 写当前 inbound 只承接 body-free external summary/ref/violation。 |
| Outbound 边界 | 旧 event 是否是 topic/payload/outbox 口径。 | 写当前 outbound 是 fact changed 边界,非可靠投递实现。 |
| Operations 边界 | 旧 job 是否围绕 seed/replay/outbox/fingerprint/snapshot。 | 写当前 job 只维护 read material、trace material、recovery 和 progress。 |
| P1 / 外围边界 | 旧 plugin / configuration 是否进入核心接口。 | 写当前外围为 MethodPackage / MethodSetAssembly,不阻塞核心闭环。 |
| 正式回填策略 | 正式 §7 是局部修补还是整体替换。 | 写取舍:整体替换旧 §7,但正式回填等待后续草稿模块。 |

#### R1.35.4 取舍规则

| 规则 | 说明 |
|---|---|
| current R1 wins | 与当前 R1.24~R1.34 冲突时,以 R1 新接口结论为准。 |
| formal old is audit input | 旧正式 §7 只能提供污染检查样本,不能作为当前接口来源。 |
| 5.x is historical only | 历史 5.x 中与 R1 一致的判断可记录为被继承的规则,但不能直接标为当前完成证据。 |
| no partial patch of formal §7 | 正式 §7 旧主线污染面过大,下一步只能裁定需要整体替换,不能按旧表局部增删。 |
| no new interface in diagnosis | 诊断模块不得新增 Command、Query、Consumer、Event 或 Job 名称。 |
| no step8 leakage | 不写处理流步骤、事务边界、异常分支、状态迁移或实现机制。 |

#### R1.35.5 排除 / 降级规则

| 排除 / 降级项 | 裁决 | 理由 |
|---|---|---|
| 直接把旧正式 §7 改成新正文 | exclude_current_module | 当前模块只思考诊断口径,正式回填需等待后续草稿模块。 |
| 直接写最终诊断表 | exclude_current_module | 下一批 `R1.36` 才写诊断与取舍正文。 |
| 以旧 `CreateMethodContentDraft` 等接口逐个映射新接口 | degrade_to_problem_family | 逐个旧接口映射会诱导保留旧结构;应按问题族和接口族诊断。 |
| 恢复 `GovernanceGateApprovedConsumer` | exclude | 当前 inbound owner 已收窄为外部摘要与引用,不围绕 publish gate。 |
| 恢复 topic / payload / outbox / relay | exclude | 当前 Step 7 只定义 Outbound Event 业务边界。 |
| 恢复 fingerprint / snapshot job | exclude | 当前维护 job 不使用 fingerprint / snapshot 作为主线。 |

#### R1.35.6 下一写入批次结构

下一批 `R1.36 当前文档问题诊断与设计取舍:再写入` 只写:

1. `诊断摘要`。
2. `问题诊断与设计取舍表`。
3. `历史 5.x 可继承 / 不继承判断`。
4. `正式 §7 后续处理口径`。
5. `本模块停审记录`。
6. `next_allowed_action` 推进到 `跨接口一致性审计:先思考`。

#### R1.35.7 下一写入批次边界

- 只写诊断和取舍,不得新增接口名。
- 只引用旧正式 §7、历史 5.x、R1.24 / R1.26 / R1.28 / R1.30 / R1.32 / R1.34。
- 不改正式 `02-概要设计.md`。
- 不写跨接口一致性审计正文,不写旧材料差异审计正文,不写正式 §7 回填草稿。
- 不进入 Step 8/9,不写处理流、状态机、配置或详细设计 schema。

#### R1.35.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写最终诊断表正文。 |
| 是否读取旧正式 §7 | pass | 已确认旧 §7 使用 MethodContent / publish / snapshot / fingerprint / outbox 主线。 |
| 是否读取历史 5.x | pass | 已确认 historical 5.x 只能作为参考和污染检查材料。 |
| 是否以 R1 当前结论为准 | pass | 诊断输入以 R1.24 / R1.26 / R1.28 / R1.30 / R1.32 / R1.34 为 current source。 |
| 是否避免新增接口 | pass | 本模块只定义诊断维度和下一写入结构。 |
| 是否修改正式 §7 | no | 正式回填仍等待后续草稿。 |
| 是否允许进入当前文档问题诊断与设计取舍:再写入 | pass | 诊断口径已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `当前文档问题诊断与设计取舍:再写入`;只写诊断摘要、问题诊断与设计取舍表、历史 5.x 继承判断、正式 §7 后续处理口径和停审记录,不得改正式 §7,不得进入 Step 8/9。

### R1.36 当前文档问题诊断与设计取舍:再写入

#### R1.36.1 诊断摘要

旧正式 `02-概要设计.md` §7 仍以 `MethodContent` 草稿 / 审核 / 发布生命周期为主线,并把 snapshot、fingerprint、outbox、governance gate consumer、P1 plugin / configuration 放在同一个接口章节内。该结构与本轮 Step 5 八个主要组成部分、Step 6 新对象和 R1.24~R1.34 五类接口总表不兼容。

当前 Step 7 的有效结论必须以 R1 新接口体系为准:Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 分别由 Step 6 对象、typed ref、summary、material、view、task 和 R1.34 owner 映射承接。旧正式 §7 后续应整体替换,不做局部补丁。

#### R1.36.2 问题诊断与设计取舍表

| 问题族 | 旧材料表现 | 影响 | 当前取舍 | 后续处理 |
|---|---|---|---|---|
| 分类主线污染 | 旧 §7 以 `CreateMethodContentDraft`、`PublishMethodContent`、`GetMethodContent`、`ExportDefinitionSnapshot`、`CompareFingerprint` 组织接口。 | 会把当前定义 / 目录、正式化、受控消费、追溯、关系、外部摘要、维护、外围组织重新压回旧 content lifecycle。 | 不继承旧分类;以 R1.24 / R1.26 / R1.28 / R1.30 / R1.32 五类总表为准。 | 正式 §7 回填时整体替换旧 7.1~7.6。 |
| 对象来源污染 | 旧接口输入输出使用 `MethodContent`、`DefinitionSnapshot`、`Fingerprint`、`OutboxEvent`、`MethodPlugin`、`MethodConfiguration`。 | 会绕开 Step 6 新对象和附录,导致后续 03 需要实现不存在的旧对象闭环。 | 不继承旧对象;接口只回指 Step 6 对象 / ref / summary / material / view / task。 | 跨接口一致性审计继续验证所有接口对象来源。 |
| Command 边界污染 | 旧 Command 把 draft、review、publish、deprecate、retire、supersede 作为核心写面。 | 会恢复旧发布治理,把正式化、版本、消费材料、关系和外部摘要混成一个 publish path。 | 旧 Command 全部废弃为当前接口来源;用 R1.24 中 58 个 Command 替代。 | 正式 §7 草稿必须按八个组成部分和 Command 总表组织。 |
| Query 边界污染 | 旧 Query 包含 snapshot export、fingerprint compare、trace aggregation 和 P1 read model。 | 会把同步制品、漂移判断和外围配置当作当前 Query owner。 | 旧 Query 不继承;用 R1.26 中 57 个 Query 替代,且 Query 不修 truth。 | 后续 Step 8 只筛选必要 Query 流,不恢复 snapshot / fingerprint 读取。 |
| Inbound 边界污染 | 旧 Inbound 只围绕 governance gate approved / rejected 支撑 publish。 | 会让正式化重新依赖 publish gate consumer,并扩大 governance 运行语义。 | 不继承旧 governance gate consumer;当前 Inbound 只归外部摘要与引用,承接 body-free external summary/ref/violation。 | 后续如需 governance basis,只能通过 body-free summary / ref 在详细设计闭口。 |
| Outbound 边界污染 | 旧 Outbound 写成 `method_library.content.published`、kind-specific published / retired、fingerprint changed,并绑定 outbox。 | 会把 topic / payload / outbox 机制提前写死,并恢复 fingerprint changed 事件。 | 不继承旧 event;用 R1.30 中 34 个 fact / material / maintenance / peripheral changed event 替代。 | 可靠投递机制若需要,后续 03/04 重新讨论,不得反推概要语义。 |
| Operations 边界污染 | 旧 Job 包含 seed、replay outbox、rebuild index、recalculate fingerprint、export snapshots、detect drift。 | 会让 job 修复旧同步链,并把 fingerprint / snapshot 作为维护主线。 | 不继承旧 job;用 R1.32 中 8 个后台维护 job 替代,只刷新 material、trace、recovery 和 progress。 | Step 8 job 流不得改 core truth,不得恢复 outbox replay / snapshot export。 |
| P1 / 外围混入 | 旧 §7 把 `PublishMethodPlugin`、`ActivateMethodConfiguration`、plugin/configuration event 与 P0 接口并列。 | 会让外围能力阻塞核心闭环,并把 marketplace / configuration 语义混入核心。 | 不继承旧 P1 接口;当前外围由 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule` 承接。 | 正式 §7 草稿将外围包与方法集组织作为独立组成部分,不进入交易履约。 |
| 正式回填策略 | 旧 §7 污染覆盖分类说明、Command、Query、Inbound、Outbound、Job。 | 局部修补会留下旧对象和旧处理流入口,后续 Step 8/9 仍会被污染。 | 裁定正式 §7 必须整体替换,但当前不直接改正式文档。 | 等正式 §7 回填草稿模块完成后再回填。 |

#### R1.36.3 历史 5.x 可继承 / 不继承判断

| 历史 5.x 内容 | 当前处理 | 说明 |
|---|---|---|
| Command / Query / Inbound / Outbound / Operations 五类分类框架 | 可继承为框架 | 分类框架与 SOP 一致,但接口集合必须以 R1 总表为准。 |
| 逐组成部分先思考、再写入和停审形式 | 可继承为流程 | 符合当前台账机制和分批纪律。 |
| 禁止旧 `MethodContent` / publish / snapshot / fingerprint / outbox 回流 | 可继承为红线 | 与 R1 新结论一致。 |
| 早期局部接口名和局部数量 | 不继承为当前结论 | R1.24~R1.32 已重新汇总并形成当前数量。 |
| 早期跨接口一致性审计 | 不直接继承 | 只能作为审计样式参考;当前还需基于 R1 总表重做。 |
| 早期旧材料差异审计 | 不直接继承 | 只能作为污染样本;后续需要基于 R1 新接口再做一次。 |
| 早期 Step 7 完成态 | 不继承 | 该完成态早于 Step 6 重写和正式 §6 回填后检查。 |

#### R1.36.4 正式 §7 后续处理口径

| 正式 §7 小节 | 后续处理 | 依据 |
|---|---|---|
| 7.1 接口分类说明 | 整体替换 | 使用 R1.2~R1.6 分类框架和 R1.24~R1.32 五类总表边界。 |
| 7.2 Command API 骨架表 | 整体替换 | 使用 R1.24 Command 总表,不保留旧 draft / publish Command。 |
| 7.3 Query API 骨架表 | 整体替换 | 使用 R1.26 Query 总表,不保留 snapshot / fingerprint Query。 |
| 7.4 Inbound Event Consumer 骨架表 | 整体替换 | 使用 R1.28 Inbound 总表,不保留 publish gate consumer。 |
| 7.5 Outbound Event 骨架表 | 整体替换 | 使用 R1.30 Outbound 总表,不写 topic / payload / outbox。 |
| 7.6 Operations Job 骨架表 | 整体替换 | 使用 R1.32 Operations Job 总表,不恢复 replay / recalculation / snapshot job。 |
| 7.7 接口边界红线 | 重写扩展 | 使用 R1.34 映射、R1.36 诊断和后续一致性审计。 |

#### R1.36.5 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写诊断与取舍 | pass | 未新增接口名,未写跨接口一致性审计、旧材料差异审计或正式 §7 草稿。 |
| 是否明确旧正式 §7 处理口径 | pass | 裁定整体替换,不做局部修补。 |
| 是否以 R1 当前结论为准 | pass | 取舍均回指 R1.24 / R1.26 / R1.28 / R1.30 / R1.32 / R1.34。 |
| 是否区分历史 5.x 的框架价值和结论风险 | pass | 可继承流程 / 红线,不继承旧完成态和旧接口集合。 |
| 是否避免正式文档写入 | pass | 未修改正式 `02-概要设计.md`。 |
| 是否避免 Step 8/9 泄漏 | pass | 未写处理流、状态机、事务边界、异常分支或 schema。 |
| 是否允许进入跨接口一致性审计:先思考 | pass | 诊断与取舍已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `跨接口一致性审计:先思考`;只思考分类、对象承接、读写边界、事件来源和 job 边界审计口径,不得直接写审计正文,不得改正式 §7,不得进入 Step 8/9。

### R1.37 跨接口一致性审计:先思考

#### R1.37.1 问题回答

- 本模块只思考跨接口一致性审计的口径,不写最终审计表正文,不改正式 `02-概要设计.md` §7,不进入 Step 8/9。
- 审计对象是当前 R1 的五类总表和映射表,不是旧正式 §7 或历史 5.x 完成态。
- 审计目标是确认 Command / Query / Inbound / Outbound / Operations 五类接口之间没有分类混用、对象来源缺口、读写边界冲突、事件来源不闭合或 job 越权。
- 审计结论必须服务后续 Step 8 / Step 9:Step 8 只能从审计通过的接口族筛选处理流,Step 9 只能从审计通过的对象 / event / job 线索推导状态来源。
- 本模块只形成审计框架;最终 audit 表、pass / risk / blocked 判断和停审记录留到 `R1.38`。

#### R1.37.2 审计输入盘点

| 输入 | 审计用途 | 当前边界 |
|---|---|---|
| `R1.24` Command API 总表 | 审计写入口是否只改写本仓 truth、boundary、summary/ref、maintenance request 或 peripheral organization。 | 不新增 Command,不审计旧 Command。 |
| `R1.26` Query API 总表 | 审计读取入口是否只读取 view / material / summary / ref / progress。 | 不让 Query 创建、刷新、修复或隐式改变状态。 |
| `R1.28` Inbound Event Consumer 总表 | 审计 inbound 是否只承接 body-free external summary/ref/violation。 | 不接收 governance publish gate、raw body、payload 或下游运行状态。 |
| `R1.30` Outbound Event 总表 | 审计 outbound 是否来自已成立 fact / material / maintenance / peripheral state。 | 不写 topic、payload schema、outbox、relay、subscriber 或 retry。 |
| `R1.32` Operations Job 总表 | 审计 job 是否只维护 read material、trace material、recovery 和 progress。 | 不修 core truth,不恢复 fingerprint / snapshot / outbox replay。 |
| `R1.34` 接口到主要组成部分映射 | 审计每个接口是否有唯一 owner。 | 不允许同一接口跨组件重复归属。 |
| `R1.36` 诊断与取舍 | 审计是否继续遵守整体替换旧 §7 和不恢复旧主线的裁决。 | 不把诊断中的旧材料再引入当前接口。 |

#### R1.37.3 预计审计维度

| 维度 | 需要审计的问题 | 下一批写入形式 |
|---|---|---|
| 分类一致性 | Command / Query / Inbound / Outbound / Job 是否互相混用。 | 分类一致性审计表。 |
| Owner 一致性 | 每个接口是否只归属一个 Step 5 主要组成部分。 | Owner / 映射一致性审计表。 |
| 对象承接一致性 | 每个接口是否能回指 Step 6 对象、typed ref、summary、material、view、task 或 boundary。 | 对象承接审计表。 |
| 读写边界一致性 | Query 是否只读,Command 是否显式写入,Inbound 是否只 intake,Outbound 是否只发布事实,Job 是否只维护。 | 读写边界审计表。 |
| Event 来源一致性 | Outbound 是否来自 accepted Command、成立材料状态或 completed job。 | Event 来源审计表。 |
| Job 边界一致性 | Operations Job 是否统一归后台维护,且不改 core truth。 | Job 边界审计表。 |
| body-free / no raw content | 外部正文、artifact 包体、证据正文、raw log、下游运行状态是否被排除。 | 外部正文边界审计表。 |
| Step 8/9 承接风险 | 当前接口是否足以支撑后续处理流和状态来源,是否有需后续重点审查的风险。 | Step 8 / Step 9 风险提示表。 |

#### R1.37.4 审计规则

| 规则 | 说明 |
|---|---|
| table source only | 审计只以 R1.24 / R1.26 / R1.28 / R1.30 / R1.32 / R1.34 为当前接口来源。 |
| no new API in audit | 审计不得新增接口名、event 名、job 名或对象名。 |
| owner unique | 每个接口只能有一个主要组成部分 owner;消费者、影响方或后续 flow 不改变 owner。 |
| command writes only | Command 必须是显式写入口或请求登记,不得承担读取 / 发布 / worker 执行职责。 |
| query reads only | Query 不创建、不刷新、不修复、不改变来源 truth。 |
| inbound intake only | Inbound Consumer 只产生 intake result 或线索,不得直接建立 core truth。 |
| outbound fact only | Outbound Event 只表达已成立事实或材料 / 维护状态变化,不表达投递机制。 |
| job derived only | Operations Job 只维护派生材料和收敛状态,不得修改 definition、formal version、relation、external summary 或 package truth。 |

#### R1.37.5 排除 / 降级规则

| 排除 / 降级项 | 裁决 | 理由 |
|---|---|---|
| 直接写最终审计表 | exclude_current_module | 下一批 `R1.38` 才写审计正文。 |
| 发现潜在风险时补接口 | exclude | 审计只能记录 risk / follow-up,不能在审计模块补接口。 |
| 把旧正式 §7 当审计输入来源 | exclude | 旧正式 §7 已在 R1.36 裁定为整体替换对象。 |
| Step 8 流程提前展开 | exclude | 当前只提示承接风险,不写流程步骤。 |
| Step 9 状态机提前展开 | exclude | 当前只提示状态来源风险,不写状态迁移。 |

#### R1.37.6 下一写入批次结构

下一批 `R1.38 跨接口一致性审计:再写入` 只写:

1. `审计摘要`。
2. `分类一致性审计表`。
3. `Owner / 对象承接一致性审计表`。
4. `读写边界一致性审计表`。
5. `Event / Job 边界一致性审计表`。
6. `Step 8 / Step 9 承接风险提示`。
7. `本模块停审记录`。
8. `next_allowed_action` 推进到 `旧材料差异审计:先思考`。

#### R1.37.7 下一写入批次边界

- 只写审计表和审计结论,不得新增接口。
- 不改正式 `02-概要设计.md`。
- 不写旧材料差异审计正文,不写正式 §7 回填草稿。
- 不进入 Step 8/9,不写处理流、状态机、异常分支、配置或详细设计 schema。
- 若发现风险,只能记录 `risk` / `follow_up`,不得在审计模块补口。

#### R1.37.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写最终审计表正文。 |
| 是否明确审计输入 | pass | 输入限定为 R1 五类总表、R1.34 映射和 R1.36 诊断取舍。 |
| 是否覆盖关键审计维度 | pass | 已覆盖分类、owner、对象承接、读写边界、event 来源、job 边界、body-free 和 Step 8/9 风险。 |
| 是否避免新增接口 | pass | 本模块只定义审计规则和下一写入结构。 |
| 是否修改正式 §7 | no | 正式回填仍等待后续草稿。 |
| 是否允许进入跨接口一致性审计:再写入 | pass | 审计口径已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `跨接口一致性审计:再写入`;只写审计摘要、分类一致性、Owner / 对象承接、读写边界、Event / Job 边界、Step 8 / Step 9 承接风险提示和停审记录,不得改正式 §7,不得进入 Step 8/9。

### R1.38 跨接口一致性审计:再写入

#### R1.38.1 审计摘要

本次审计只基于当前 R1 五类总表和 `R1.34` 映射表执行。审计结论是:Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 分类边界成立,八个主要组成部分均有唯一接口 owner,外部正文 / artifact body / raw log / 下游运行状态未回流,旧 `MethodContent` / publish / snapshot / fingerprint / old outbox 主线未被恢复为当前接口来源。

当前未发现阻断 Step 7 继续推进的 cross-interface blocker。后续 Step 8 / Step 9 仍需保留承接风险:处理流和状态来源必须从 R1 新接口、Step 6 新对象和本次审计通过的边界推导,不得回用旧正式 §7 或旧 Step 8/9 中的旧状态主语。

#### R1.38.2 分类一致性审计表

| 接口类别 | 当前数量 | 审计结论 | 依据 | 风险 / 后续 |
|---|---:|---|---|---|
| Command API | 58 | pass | `R1.24` 只收录显式写入、边界裁决、维护请求登记或外围组织 command。 | Step 8 写 Command flow 时不得把 maintenance request 写成 job 执行。 |
| Query API | 57 | pass | `R1.26` 只读取 truth summary、view、read material、typed ref、history、lineage、diagnostic、availability、freshness 或 progress。 | Step 8 不得让 Query 修复 truth、刷新 material 或补写摘要。 |
| Inbound Event Consumer | 4 | pass | `R1.28` 全部归外部摘要与引用,只承接 body-free external summary / source ref / artifact ref / violation。 | 后续不得恢复 governance publish gate consumer 或 raw webhook consumer。 |
| Outbound Event | 34 | pass | `R1.30` 只表达已成立事实、材料状态、维护状态或外围组织变化。 | 详细设计若需要 outbox,只能作为投递机制,不能改变概要 event 语义。 |
| Operations Job | 8 | pass | `R1.32` 全部归后台维护与收敛,只刷新派生材料、追溯材料、外围视图或执行一致性收敛。 | Step 8 / Step 9 不得让 job 改写 definition、formal version、relation、external summary 或 package truth。 |

#### R1.38.3 Owner / 对象承接一致性审计表

| 主要组成部分 | Owner 一致性 | 对象承接一致性 | 审计结论 |
|---|---|---|---|
| 方法资产定义与目录 | pass:Command / Query / Outbound 只归本行。 | 回指 `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`MethodAssetCatalogView` 和 typed refs。 | 无重复 owner,无外部正文或旧 content 主语。 |
| 正式化与版本 | pass:正式化和版本接口集中在本行。 | 回指 `FormalMethodAssetVersion`、`FormalizationBasisSummary`、`FormalizationState`、eligibility rule。 | 外部依据通过外部摘要边界进入,未直接接收治理正文。 |
| 受控消费 | pass:消费材料、消费边界和可用性接口集中在本行。 | 回指 `MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`、guard / violation refs。 | 未把下游运行状态、授权实现或 token scope 当本仓对象。 |
| 追溯与一致性保护 | pass:trace、impact、protection、audit、lineage 接口集中在本行。 | 回指 `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`ConsistencyProtectionPolicy`、`MethodAssetAuditTrail`、evidence lineage。 | 未保存 raw log、event payload、report body 或证据正文。 |
| 关系与分发语义 | pass:relation、integrity、distribution 接口集中在本行。 | 回指 `MethodAssetRelation`、`MethodAssetDistributionRef`、`RelationIntegrityRule`、distribution material。 | 未混入 marketplace 交易、推荐算法、安装或履约。 |
| 外部摘要与引用 | pass:唯一 Inbound owner。 | 回指 `ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef`、`ExternalBodyBoundaryRule`、external evidence lineage。 | body-free 边界成立,未引入 raw body。 |
| 后台维护与收敛 | pass:唯一 Operations Job owner。 | 回指 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceProgressView`、run / scope refs。 | 维护 job 不分散到业务组件,不修 core truth。 |
| 外围包与方法集组织 | pass:package、method set、composition、peripheral view 接口集中在本行。 | 回指 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule`、package / assembly view。 | 外围不可用不阻塞核心闭环,未进入交易 / 安装 / 履约。 |

#### R1.38.4 读写边界一致性审计表

| 边界 | 审计结论 | 说明 |
|---|---|---|
| Command 不承担读取接口 | pass | Command 总表写入对象 / 意图清楚,未把 catalog browse、trace read、progress read 或 package view read 写成 Command。 |
| Query 不改写 truth | pass | Query 总表均有读取来源和边界,明确不刷新 view、不修复来源 truth、不创建对象。 |
| Inbound 只做外部事实 intake | pass | 4 个 Consumer 输出为 accepted / ignored / rejected consumer result 和 intake summary,不直接建立核心对象。 |
| Outbound 不表达投递机制 | pass | 事件表只写 ref / summary / marker / trace context,未写 topic、payload schema、relay、subscriber、retry 或 outbox 表。 |
| Operations Job 不修 core truth | pass | 8 个 job 只面向 read material、trace/audit/impact material、recovery convergence、peripheral read material。 |
| body-free / safe summary 边界 | pass | 外部正文、artifact 包体、证据正文、raw log、report body、downstream runtime state 均被排除。 |
| Peripheral 不阻塞核心闭环 | pass | package / method set / composition 只作为外围组织和发现增强,不作为定义、正式化、消费或追溯成立前置。 |

#### R1.38.5 Event / Job 边界一致性审计表

| 审计项 | 结论 | 依据 | 后续约束 |
|---|---|---|---|
| Outbound Event 来源 | pass | 34 个 event 均来自 accepted command、已成立材料状态、维护结果或外围组织变化。 | Step 8 只能选代表性 event 触发点,不展开投递机制。 |
| Event 输出内容 | pass | 输出骨架限定为 typed ref、summary ref、safe reason ref、marker、trace context。 | 后续不得补 full payload、body、topic 字段全集或 retry policy。 |
| Maintenance Event 与 Job 区分 | pass | `MethodAssetMaintenanceRequested` 等事件表达事实变化;`Refresh*` / `RunConsistencyRecoveryConvergence` 表达 job。 | 不把 event 当 worker 调度 API,不把 job 完成当 core truth 成立。 |
| Operations Job owner | pass | 8 个 job 全部在后台维护与收敛。 | 业务组件若需要刷新,通过维护请求或事件线索承接,不得私设 job。 |
| Job 输入 / 输出对象 | pass | job 使用 `MaintenanceRunRef`、`RefreshScopeRef`、task refs、material refs、progress summary。 | Step 8 不写 worker loop、lock、queue、scheduler、cache/store 细节。 |
| 旧 outbox / snapshot / fingerprint | pass | 五类总表未恢复旧 outbox event、snapshot export、fingerprint changed / recalculate。 | 旧材料差异审计需继续专门检查正式旧 §7 是否仍有残留。 |

#### R1.38.6 Step 8 / Step 9 承接风险提示

| 后续 Step | 风险 | 当前处理口径 |
|---|---|---|
| Step 8 处理流 | 可能从旧正式 §7 恢复 `MethodContent` publish flow。 | 必须从 R1.24 / R1.26 / R1.28 / R1.30 / R1.32 中选代表性 flow,不得使用旧 publish 主线。 |
| Step 8 处理流 | 可能把 Query flow 写成 refresh / repair。 | Query flow 只读;刷新、收敛和恢复必须转到 Operations Job 或 bounded Command。 |
| Step 8 处理流 | 可能把 external summary consumer 直接写成 core truth mutation。 | Inbound flow 只形成 intake summary;改写本仓 truth 必须另走显式 Command。 |
| Step 9 状态机 | 可能继承旧 `MethodContentLifecycle`、`OutboxEventStatus`、snapshot / fingerprint 状态。 | 状态来源只能从 Step 6 新对象、R1 Command / Event / Job 线索推导。 |
| Step 9 状态机 | 可能把派生 view / progress 状态上升为 core truth 状态。 | view / material / progress 状态只能表达派生可用性、freshness、maintenance progress。 |
| 正式 §7 回填 | 可能局部修补旧 §7 造成旧接口残留。 | 后续草稿必须整体替换旧 §7,并保留五类总表和八个 owner 分组。 |

#### R1.38.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写跨接口审计正文 | pass | 未写旧材料差异审计、正式 §7 草稿、自检停审或 Step 8/9 正文。 |
| 是否以 R1 当前结论为唯一接口来源 | pass | 审计依据限定为 `R1.24` / `R1.26` / `R1.28` / `R1.30` / `R1.32` / `R1.34` / `R1.36`。 |
| 是否新增接口、event、job 或对象 | no | 只审计已存在总表和映射表。 |
| 是否确认分类一致性 | pass | Command、Query、Inbound、Outbound、Operations Job 五类边界未发现冲突。 |
| 是否确认 owner 唯一 | pass | 每个接口只归属一个 Step 5 主要组成部分。 |
| 是否确认读写边界 | pass | Query 不写、Command 不读、Inbound 不直接建 truth、Outbound 不写投递机制、Job 不修 core truth。 |
| 是否保留 Step 8/9 风险 | pass | 已列出后续必须防止旧 flow / state 主线回流的风险。 |
| 是否修改正式 §7 | no | 正式回填仍等待旧材料差异审计和 §7 草稿。 |
| 是否允许进入旧材料差异审计:先思考 | pass | 跨接口审计已闭合,下一步可先思考旧材料污染检查口径。 |

next_allowed_action: 等待用户确认后进入 Step 7 `旧材料差异审计:先思考`;只思考旧正式 §7、本文 historical 5.x 和旧 Step 7 中 `MethodContent` / publish / snapshot / fingerprint / old outbox / P1 plugin 污染检查口径,不得直接写差异审计正文,不得改正式 §7,不得进入 Step 8/9。

### R1.39 旧材料差异审计:先思考

#### R1.39.1 问题回答

- 本模块只思考旧材料差异审计的写入口径,不写最终差异审计表正文,不改正式 `02-概要设计.md` §7,不进入 Step 8/9。
- 差异审计对象是旧正式 `02-概要设计.md` §7、本文 historical `5.20`、旧 Step 8/9 中已经暴露的接口 / flow / state 主线,以及当前 R1.24~R1.38 的接口结论。
- 审计目标不是为旧接口找一一替代关系,而是确认哪些旧主线必须废弃、哪些框架性判断可以保留、哪些后续正式 §7 回填必须显式替换。
- 旧正式 §7 当前仍保留 `CreateMethodContentDraft`、`PublishMethodContent`、`GetMethodContent`、`ExportDefinitionSnapshot`、`CompareFingerprint`、`GovernanceGateApprovedConsumer`、`method_library.content.published`、`RecalculateFingerprint` 等旧接口族,这些只能作为污染样本。
- historical `5.20` 已经做过一次旧材料差异审计,但它早于本轮 R1 五类总表和 `R1.38` 跨接口审计完成;下一批只能参考其审计维度,不能直接继承其完成态。

#### R1.39.2 差异审计输入盘点

| 输入 | 当前状态 | 审计用途 | 使用边界 |
|---|---|---|---|
| 旧正式 `02-概要设计.md` §7.1~§7.7 | polluted / historical | 识别旧接口分类、旧 Command / Query / Consumer / Event / Job 主线。 | 只作为差异样本,不得反推当前接口。 |
| 旧正式 `02-概要设计.md` §8 / §9 相关引用 | polluted / downstream risk | 识别 `PublishMethodContent` flow、`MethodContentLifecycle`、`OutboxEventStatus` 对后续 Step 8/9 的污染风险。 | 当前只记录风险,不写 Step 8/9 处理方案。 |
| 本文件 historical `5.20` | historical audit sample | 提供旧污染族和检查样式参考。 | 不继承完成态;必须基于 R1.24~R1.38 重审。 |
| `R1.24` Command 总表 | current source | 判定旧 Command 是否废弃或被当前写入口族替代。 | 不新增 Command,不做一一旧新映射承诺。 |
| `R1.26` Query 总表 | current source | 判定旧 Query / snapshot / fingerprint read 是否废弃。 | Query 只读,不得恢复 export / compare / drift 主线。 |
| `R1.28` Inbound 总表 | current source | 判定旧 governance gate consumer 是否废弃。 | 当前 inbound 只承接 body-free external summary / ref / violation。 |
| `R1.30` Outbound 总表 | current source | 判定旧 topic / outbox / kind-specific published event 是否废弃。 | 不写 topic、payload schema、relay 或 old outbox。 |
| `R1.32` Operations Job 总表 | current source | 判定旧 seed / replay / rebuild / recalculate / snapshot job 是否废弃。 | job 不修 core truth,不恢复 fingerprint / snapshot / outbox replay。 |
| `R1.34` 映射表与 `R1.38` 审计 | current gate | 确认当前接口 owner 和边界已闭合。 | 差异审计不得推翻已通过的 R1 边界。 |

#### R1.39.3 预计污染族

| 污染族 | 旧材料表现 | 下一批审计方式 |
|---|---|---|
| 旧统一 content truth | `MethodContent`、7 类 P0 subtype、draft / review / publish / retire lifecycle。 | 写成废弃主线,当前由八个组成部分和 Step 6 对象族替换。 |
| 旧发布主链 | `PublishMethodContent` 同时做 gate、version、fingerprint、audit、outbox。 | 写成拆分废弃项,当前正式化、版本、trace、event、maintenance 分离。 |
| snapshot / export | `DefinitionSnapshot`、`ExportDefinitionSnapshot`、snapshot projection。 | 写成禁止恢复项,当前使用 consumption material、read material、artifact / archive ref 和 trace material。 |
| fingerprint / drift | `Fingerprint`、`CompareFingerprint`、`RecalculateFingerprint`、fingerprint changed event。 | 写成禁止恢复项,当前版本语义和 material freshness 不以 fingerprint 主导。 |
| old outbox / relay | `OutboxEvent`、relay、replay definition events、topic-like event。 | 写成机制污染项,当前只保留概要 outbound fact event。 |
| governance publish gate consumer | `GovernanceGateApprovedConsumer` / rejected consumer 支撑 publish。 | 写成旧 inbound 边界废弃项,当前 inbound 只归外部摘要与引用。 |
| P1 plugin / configuration | `PublishMethodPlugin`、`ActivateMethodConfiguration`、plugin/configuration event。 | 写成旧 P1 核心混入项,当前外围改用 package / method set / composition。 |
| implementation detail leakage | PostgreSQL、object storage、repository、port、worker、seed/rebuild/replay 机制。 | 写成概要层禁止下沉项,后续若需要必须在 03/04 重新闭口。 |

#### R1.39.4 审计规则

| 规则 | 说明 |
|---|---|
| current R1 wins | 旧材料与 R1.24~R1.38 冲突时,以当前 R1 结论为准。 |
| no one-to-one migration promise | 差异审计不承诺每个旧 API 都有直接新 API;只按污染族和当前接口族裁决。 |
| formal §7 replace, not patch | 旧正式 §7 污染覆盖全章,后续草稿必须整体替换,不能局部修补。 |
| old flow/state only as risk | 旧 Step 8/9 只能提示风险,不得在本模块写新处理流或状态机。 |
| no new current API | 差异审计不得新增 Command、Query、Consumer、Event、Job 或对象。 |
| no implementation detail | 不写 HTTP path、RPC、payload schema、topic、outbox 表、repository、worker、DDL、配置。 |

#### R1.39.5 排除 / 降级规则

| 排除 / 降级项 | 裁决 | 理由 |
|---|---|---|
| 直接写最终差异审计表 | exclude_current_module | 下一批 `R1.40` 才写最终差异审计正文。 |
| 直接修改正式 §7 | exclude_current_module | 正式回填必须等待旧材料审计和正式 §7 回填草稿。 |
| 把 historical `5.20` 标记为当前完成证据 | exclude | `5.20` 早于 R1 总表闭合,只能作为样式参考。 |
| 为旧 `PublishMethodContent` 设计兼容 flow | exclude | 当前 Step 7 已裁定旧 publish 主线不继承。 |
| 以旧 topic / payload 名称补当前 Event | exclude | 当前 outbound 只保留概要 fact event,不写交付机制。 |
| 将 P1 plugin / configuration 改名后回流核心 | exclude | 当前外围由 package / method set 组织承接,且不阻塞核心闭环。 |

#### R1.39.6 下一写入批次结构

下一批 `R1.40 旧材料差异审计:再写入` 只写:

1. `差异审计摘要`。
2. `旧正式 §7 污染检查表`。
3. `历史 5.20 可参考 / 不可继承判断`。
4. `旧 Step 8 / Step 9 承接风险表`。
5. `正式 §7 回填前置裁决`。
6. `本模块停审记录`。
7. `next_allowed_action` 推进到 `正式 §7 回填草稿:先思考`。

#### R1.39.7 下一写入批次边界

- 只写差异审计和裁决,不得新增接口。
- 不改正式 `02-概要设计.md`。
- 不写正式 §7 草稿正文,不写 Step 8 / Step 9 处理流或状态机。
- 旧材料只能作为污染样本和风险来源,不得作为当前接口来源。
- 若发现旧材料仍有当前 R1 未覆盖的真实需求,只能记录 follow-up,不得在差异审计模块补 API。

#### R1.39.8 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写最终差异审计表正文。 |
| 是否读取旧正式 §7 | pass | 已确认旧正式 §7 仍含 `MethodContent` / publish / snapshot / fingerprint / outbox / P1 plugin 主线。 |
| 是否读取 historical `5.20` | pass | 已确认其只能作为审计样式和污染族参考。 |
| 是否以当前 R1 为准 | pass | 下一批输入限定为 R1.24 / R1.26 / R1.28 / R1.30 / R1.32 / R1.34 / R1.38。 |
| 是否避免新增接口 | pass | 本模块只定义差异审计口径。 |
| 是否修改正式 §7 | no | 正式回填仍等待后续草稿。 |
| 是否允许进入旧材料差异审计:再写入 | pass | 差异审计口径已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `旧材料差异审计:再写入`;只写差异审计摘要、旧正式 §7 污染检查表、历史 5.20 可参考 / 不可继承判断、旧 Step 8/9 承接风险、正式 §7 回填前置裁决和停审记录,不得改正式 §7,不得进入 Step 8/9。

### R1.40 旧材料差异审计:再写入

#### R1.40.1 差异审计摘要

旧正式 `02-概要设计.md` §7 仍完整保留旧 `MethodContent` 生命周期接口体系,并把 publish、snapshot、fingerprint、outbox、governance gate consumer、P1 plugin / configuration 放在同一个 API / Event / Job 章节中。这与当前 R1.24~R1.38 已闭合的五类接口总表、八个主要组成部分 owner、body-free 外部摘要边界、Operations Job 统一归属和 no old outbox / snapshot / fingerprint 裁决不兼容。

本次差异审计结论是:旧正式 §7 不可局部修补,后续正式 §7 回填必须整体替换。historical `5.20` 可参考其“旧材料只作后置审计”的方向和污染族分类,但不可继承其完成态、接口数量、候选集合或 Step 7 已完成结论。

#### R1.40.2 旧正式 §7 污染检查表

| 旧正式 §7 位置 / 主语 | 旧材料表现 | 当前裁决 | 当前依据 |
|---|---|---|---|
| 7.1 接口分类说明 | Query 仍读取 snapshot / trace / projection;Outbound Event 必须通过 outbox 发布;Operations Job 包含 seed / replay / rebuild / recalculate。 | 整体替换。 | 当前分类以 R1.24 / R1.26 / R1.28 / R1.30 / R1.32 为准;outbox、snapshot、fingerprint 不再作为概要接口主线。 |
| 7.2 Command API | `CreateMethodContentDraft`、`UpdateMethodContentDraft`、`SubmitMethodContentForReview`、`PublishMethodContent`、`DeprecateMethodContent`、`RetireMethodContent`、`SupersedeMethodContent`。 | 废弃为当前接口来源。 | 当前 Command 总表 58 行按八个组成部分组织,不再以 `MethodContent` draft / publish lifecycle 组织。 |
| 7.2 P1 Command | `PublishMethodPlugin(P1)`、`ActivateMethodConfiguration(P1)` 与核心 Command 并列。 | 废弃旧 P1 写入口。 | 当前外围由 `MethodPackage`、`MethodSetAssembly`、`PackageCompositionRule` 承接,且不阻塞核心闭环。 |
| 7.3 Query API | `GetMethodContent`、`ListMethodContents`、`GetMethodContentVersion`、`ExportDefinitionSnapshot`、`CompareFingerprint`。 | 废弃旧 Query 主线。 | 当前 Query 总表 57 行只读 current truth summary、view、material、typed ref、history、lineage、progress 或 peripheral view。 |
| 7.3 P1 Query | `ListMethodPlugins(P1)`、`GetMethodConfiguration(P1)` 作为 P1 read model。 | 废弃旧 plugin / configuration read model。 | 当前外围读取使用 package / method set / composition / discovery 读取语义,不返回 marketplace 或 organization runtime 正文。 |
| 7.4 Inbound Consumer | `GovernanceGateApprovedConsumer` / `GovernanceGateRejectedConsumer` 支撑 publish gate。 | 废弃旧 inbound 边界。 | 当前 Inbound 总表仅 4 个,全部归外部摘要与引用,只承接 body-free external summary / source ref / artifact ref / violation。 |
| 7.5 Outbound Event | `method_library.content.published`、kind-specific published / retired、`fingerprint_changed`、P1 plugin / configuration event。 | 废弃旧 event 集合。 | 当前 Outbound 总表 34 行只表达已成立 fact / material / maintenance / peripheral changed,不写 topic、payload、outbox 或 fingerprint event。 |
| 7.6 Operations Job | `SeedInitialMethodAssets`、`RebuildDefinitionIndex`、`ReplayDefinitionEvents`、`RecalculateFingerprint`、`ExportAllSnapshots(P1)`、`DetectDefinitionDrift(P1)`。 | 废弃旧 job 集合。 | 当前 Operations Job 总表 8 行统一归后台维护与收敛,只刷新 read material、trace material、recovery progress 和 peripheral material。 |
| 7.7 接口边界红线 | 红线仍围绕 publish、outbox、snapshot、fingerprint、P1 后置展开。 | 重写扩展。 | 后续正式 §7 红线必须从 R1.34 owner 映射、R1.38 跨接口审计和当前差异审计重新生成。 |

#### R1.40.3 历史 5.20 可参考 / 不可继承判断

| historical `5.20` 内容 | 当前处理 | 说明 |
|---|---|---|
| 把旧正式 §7、旧 Step 8/9 和历史 DDD 作为后置审计对象 | 可参考 | 与本轮 full-restart 规则一致。 |
| 把 `MethodContent` / publish / snapshot / fingerprint / outbox / P1 plugin 作为污染族 | 可参考 | 与 R1.36 / R1.38 / R1.39 的红线一致。 |
| 用表格记录“历史材料 / 旧主语 -> 当前处理 -> 结果” | 可参考 | 下一步正式 §7 草稿也需要类似可追溯裁决。 |
| historical `5.20` 中的接口数量、候选集合和完成态 | 不继承 | 它早于 R1.24~R1.32 五类总表闭合,不能作为当前 Step 7 完成证据。 |
| historical `5.20` 中的“一步进入自检与停审”结论 | 不继承 | 当前仍需完成正式 §7 回填草稿和 Step 7 自检停审。 |
| historical `5.20` 中对 Step 8 可直接开工的判断 | 不继承 | Step 8 必须等待当前 R1 正式 §7 草稿和自检停审完成。 |

#### R1.40.4 旧 Step 8 / Step 9 承接风险表

| 后续位置 | 旧材料风险 | 当前裁决 | 后续约束 |
|---|---|---|---|
| 旧 Step 8 `PublishMethodContent` flow | 旧 flow 把 gate 校验、reference 校验、fingerprint、audit、outbox、lifecycle publish 合并为一条主链。 | 不继承。 | Step 8 只能从当前 Command / Query / Inbound / Outbound / Job 中筛选代表性处理流。 |
| 旧 Step 8 snapshot flow | `ExportDefinitionSnapshot` 从 `MethodContent` / version store 导出 snapshot。 | 不继承。 | 若需要供给 / recovery 语义,只能从 consumption material、read material、artifact archive ref、trace material 重新讨论。 |
| 旧 Step 8 operations flow | replay outbox、rebuild index、recalculate fingerprint。 | 不继承。 | Maintenance flow 只能围绕当前 8 个 Operations Job,且不修 core truth。 |
| 旧 Step 9 `MethodContent` 状态 | draft、in_review、published、deprecated、retired、superseded 等统一 lifecycle。 | 不继承。 | Step 9 状态 owner 必须来自 Step 6 新对象,例如 formalization、availability、acceptance、maintenance、peripheral 对象。 |
| 旧 Step 9 `OutboxEventStatus` | pending / published / failed / dead_letter 等传播状态。 | 不继承为当前概要状态主线。 | 若详细设计需要投递状态,后续只能作为交付机制重新闭口,不得反推概要 Event / Job 语义。 |
| 旧 P1 状态 | `MethodPlugin` / `MethodConfiguration` 状态与 P0 相邻。 | 不继承。 | 当前外围状态只能围绕 package / method set / composition / peripheral material,且不阻塞核心闭环。 |

#### R1.40.5 正式 §7 回填前置裁决

| 裁决项 | 结论 | 回填约束 |
|---|---|---|
| 回填方式 | 整体替换正式 §7。 | 不按旧 7.1~7.6 局部增删;必须使用当前 R1 草稿重写。 |
| 章节来源 | 只从 R1.24 / R1.26 / R1.28 / R1.30 / R1.32 / R1.34 / R1.38 / R1.40 生成。 | 不从旧正式 §7、historical 5.x 或旧 Step 8/9 反推接口。 |
| 接口分类 | 保留 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 五类。 | 分类说明必须写清每类适用性和禁止事项。 |
| 分组方式 | 按八个主要组成部分和五类总表组织。 | 不按 repository、handler、worker、HTTP route、旧 content kind 或 topic 分组。 |
| 正文深度 | 概要级输入 / 输出骨架、主要处理摘要、写入结果 / 读取来源 / 边界。 | 不写完整 DTO schema、字段全集、错误码、状态机、处理流、DDL、topic/payload、worker 或配置。 |
| 红线 | 明确禁止旧 `MethodContent` / publish / snapshot / fingerprint / outbox / P1 plugin 回流。 | 后续 Step 8 / Step 9 以此作为污染检查前置门禁。 |

#### R1.40.6 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写旧材料差异审计 | pass | 未写正式 §7 草稿、Step 8 流程或 Step 9 状态机。 |
| 是否覆盖旧正式 §7 | pass | 已覆盖 7.1 分类、7.2 Command、7.3 Query、7.4 Inbound、7.5 Outbound、7.6 Job、7.7 红线。 |
| 是否区分 historical `5.20` 的参考价值和完成态风险 | pass | 可参考审计方向和污染族,不继承接口集合、数量和完成态。 |
| 是否记录旧 Step 8/9 风险 | pass | 已记录 publish flow、snapshot flow、operations flow、MethodContent lifecycle、OutboxEventStatus 和 P1 状态风险。 |
| 是否以当前 R1 为准 | pass | 差异裁决回指当前五类总表、映射表和跨接口审计。 |
| 是否新增接口 | no | 未新增 Command、Query、Consumer、Event、Job 或对象。 |
| 是否修改正式 §7 | no | 正式回填仍等待下一步草稿模块。 |
| 是否允许进入正式 §7 回填草稿:先思考 | pass | 旧材料差异审计已闭合,可以思考正式 §7 草稿结构和回填边界。 |

next_allowed_action: 等待用户确认后进入 Step 7 `正式 §7 回填草稿:先思考`;只思考正式 §7 草稿结构、章节顺序、来源引用和回填边界,不得直接写正式 §7 草稿正文,不得改正式 `02-概要设计.md`,不得进入 Step 8/9。

### R1.41 正式 §7 回填草稿:先思考

#### R1.41.1 问题回答

- 本模块只思考正式 `02-概要设计.md` §7 回填草稿的结构和边界,不写最终草稿正文,不改正式 `02-概要设计.md`,不进入 Step 8/9。
- 正式 §7 必须整体替换旧内容,但本轮先在中间产物中形成可回填草稿;正式文档实际修改必须等待 `正式 §7 回填草稿:再写入` 完成并经后续自检。
- 草稿应保留正式文档现有 §7 的读者预期结构:7.1 分类说明、7.2 Command、7.3 Query、7.4 Inbound、7.5 Outbound、7.6 Operations Job、7.7 边界红线。
- 草稿来源只允许使用 `R1.24` / `R1.26` / `R1.28` / `R1.30` / `R1.32` 五类总表、`R1.34` 映射表、`R1.38` 跨接口审计、`R1.40` 差异审计。
- 草稿正文需要“概要化”,不能原样复制 58 + 57 + 4 + 34 + 8 的全部总表。正式 §7 应给出分类规则、代表性骨架、按主要组成部分分组的覆盖说明和边界红线;完整明细继续留在本 Step 中间产物。

#### R1.41.2 草稿章节结构裁决

| 正式 §7 小节 | 草稿目标 | 来源 | 写入策略 |
|---|---|---|---|
| 7.1 接口分类说明 | 说明五类接口的适用性、输入 / 输出共性和禁止事项。 | `R1.2`~`R1.6`;`R1.38` | 写摘要表,不写旧 MethodContent 分类。 |
| 7.2 Command API 骨架 | 给出 Command 分组和代表性写入口骨架。 | `R1.24`;`R1.34` | 按八个主要组成部分压缩成分组摘要,必要时列代表性 API。 |
| 7.3 Query API 骨架 | 给出 Query 分组、读取来源和只读边界。 | `R1.26`;`R1.34` | 按八个主要组成部分压缩成读取面摘要。 |
| 7.4 Inbound Event Consumer 骨架 | 给出 4 个 body-free inbound consumer。 | `R1.28`;`R1.34` | 可完整列 4 行,因为数量小且边界关键。 |
| 7.5 Outbound Event 骨架 | 给出 outbound fact event 事件族和边界。 | `R1.30`;`R1.38` | 按事件族摘要,不列 topic / payload / old outbox。 |
| 7.6 Operations Job 骨架 | 给出 8 个维护 job 和不修 truth 边界。 | `R1.32`;`R1.34` | 可完整列 8 行或按 job 族列摘要。 |
| 7.7 接口边界红线 | 汇总分类、读写、body-free、event/job、旧材料禁入红线。 | `R1.38`;`R1.40` | 写红线表,明确旧 §7 全部被替换。 |

#### R1.41.3 摘要化策略

| 内容类型 | 是否完整展开 | 理由 |
|---|---|---|
| Command 58 行 | no | 正式概要不应复制超长明细表;用组成部分分组和代表性接口说明,完整明细留在 `R1.24`。 |
| Query 57 行 | no | 用读取面、读取来源和只读边界总结;完整明细留在 `R1.26`。 |
| Inbound 4 行 | yes | 数量少,且 body-free 边界对后续实现关键。 |
| Outbound 34 行 | partial / event-family | 用事件族和代表性 event 说明;避免写成 topic / payload 清单。 |
| Operations Job 8 行 | yes_or_compact | 数量可控,且 job 不修 truth 的边界需要清楚。 |
| 接口到组成部分映射 | compact | 正式 §7 可写八行 owner 覆盖摘要,不用重复所有接口名。 |
| 红线与旧材料裁决 | yes | 必须阻断旧 §7、旧 Step 8/9 污染回流。 |

#### R1.41.4 回填草稿禁止事项

| 禁止项 | 说明 |
|---|---|
| 不写旧 `MethodContent` / publish 主线 | 不得出现 `CreateMethodContentDraft`、`PublishMethodContent` 作为当前 API 来源。 |
| 不写 snapshot / fingerprint API | 不得恢复 `ExportDefinitionSnapshot`、`CompareFingerprint`、`RecalculateFingerprint`。 |
| 不写 old outbox / topic / payload | Outbound 只写概要 fact event,不写 topic 名、payload 字段全集、relay、retry、dead letter、outbox 表。 |
| 不写 Step 8 flow | 不写处理步骤、事务边界、异常分支、调用链、UoW 或 sequence diagram。 |
| 不写 Step 9 state | 不写状态枚举、状态流转图或状态迁移矩阵。 |
| 不写详细设计 schema | 不写完整 DTO、字段全集、错误码、HTTP / RPC、repository / port、worker、DDL、配置。 |
| 不改正式文档 | 本模块和下一模块先写中间产物草稿;正式修改另等允许。 |

#### R1.41.5 下一写入批次结构

下一批 `R1.42 正式 §7 回填草稿:再写入` 只写中间产物中的正式 §7 草稿,结构如下:

1. `草稿使用说明`。
2. `§7.1 接口分类说明草稿`。
3. `§7.2 Command API 骨架草稿`。
4. `§7.3 Query API 骨架草稿`。
5. `§7.4 Inbound Event Consumer 骨架草稿`。
6. `§7.5 Outbound Event 骨架草稿`。
7. `§7.6 Operations Job 骨架草稿`。
8. `§7.7 接口边界红线草稿`。
9. `本模块停审记录`。
10. `next_allowed_action` 推进到 `自检与停审:先思考`。

#### R1.41.6 下一写入批次边界

- 只写“可回填草稿”,不得直接改正式 `02-概要设计.md`。
- 草稿必须包含校准来源提示,但正文不能新增 R1 中没有的接口或对象。
- Command / Query / Outbound 表必须摘要化,不得机械复制超长明细。
- Inbound / Operations Job 可完整列出,但仍只写概要骨架和边界。
- 若发现草稿需要新增接口或对象,必须停审并回到相应 R1 总表或 Step 6,不得在草稿模块补口。

#### R1.41.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写正式 §7 草稿正文。 |
| 是否保持正式 §7 章节骨架 | pass | 使用 7.1~7.7,但内容整体替换。 |
| 是否明确来源 | pass | 来源限定为五类总表、映射、跨接口审计和旧材料差异审计。 |
| 是否避免超长明细复制 | pass | Command / Query / Outbound 采用摘要化策略。 |
| 是否禁止旧材料回流 | pass | 明确禁止 `MethodContent` / publish / snapshot / fingerprint / outbox / P1 plugin。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未修改。 |
| 是否允许进入正式 §7 回填草稿:再写入 | pass | 草稿结构和边界已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `正式 §7 回填草稿:再写入`;只在中间产物写正式 §7 可回填草稿,不得直接修改正式 `02-概要设计.md`,不得进入 Step 8/9。

### R1.42 正式 §7 回填草稿:再写入

#### R1.42.1 草稿使用说明

以下内容是正式 `02-概要设计.md` §7 的可回填草稿,不是正式文档写入。正式回填前仍需经过 Step 7 自检与停审确认。

本草稿整体替换旧 §7,来源限定为 `R1.24` Command 总表、`R1.26` Query 总表、`R1.28` Inbound 总表、`R1.30` Outbound 总表、`R1.32` Operations Job 总表、`R1.34` 映射表、`R1.38` 跨接口审计和 `R1.40` 旧材料差异审计。旧 `MethodContent`、publish、snapshot、fingerprint、old outbox、P1 plugin / configuration 不作为当前接口来源。

#### R1.42.2 §7.1 接口分类说明草稿

| 接口类别 | 本仓适用性 | 输入 / 输出骨架 | 主要边界 |
|---|---|---|---|
| Command API | 适用。用于改写本仓拥有的 truth、正式边界、外部摘要接受记录、维护请求或外围组织对象。 | 输入以 `ActorContext`、`CommandMetadata`、`IdempotencyKey`、typed ref、summary ref 和 safe reason ref 为基础;输出 accepted / rejected summary、对象 ref、history / lineage ref。 | 不承担读取、不执行 worker、不保存外部正文、不恢复 `MethodContent` draft / publish 主线。 |
| Query API | 适用。用于读取 truth summary、view、read material、typed ref、history、lineage、diagnostic、availability、freshness、progress 或 peripheral view。 | 输入以 `ActorContext`、`QueryMetadata`、scope / subject / context typed ref 和 page / filter summary 为基础;输出 view、summary、material、diagnostic 或 progress。 | 不创建对象、不刷新 material、不修复 truth、不返回正文、raw log、payload 或实现细节。 |
| Inbound Event Consumer | 有条件适用。仅承接外部系统或相邻仓已成立的 body-free fact。 | 输入包含 source envelope、source event id、source system ref、schema / version、dedup key、trace context、typed external ref / summary / marker。 | 不接收 raw document、artifact body、治理执行正文、下游运行状态或 marketplace transaction。 |
| Outbound Event | 有条件适用。用于表达本仓已成立事实、材料状态、维护状态或外围组织变化。 | 输出只包含 typed ref、summary ref、safe reason ref、state / availability / freshness marker 和 trace context。 | 不写 topic、payload schema、outbox、relay、retry、subscriber 或投递保证。 |
| Operations Job | 适用。用于刷新派生读取材料、追溯材料、恢复收敛和外围读取材料。 | 输入以 `MaintenanceRunRef`、`RefreshScopeRef`、task ref、material ref 和 maintenance context 为基础;输出 refreshed material summary、recovery summary、progress view。 | 不修改 core truth、不重做正式化、不绕过消费边界、不复制外部正文、不写 worker / scheduler / queue 实现。 |

#### R1.42.3 §7.2 Command API 骨架草稿

Command API 按八个主要组成部分分组。完整 58 个 Command 见 `R1.24`;正式概要正文只保留分组、代表性接口和边界。

| 主要组成部分 | Command 覆盖 | 代表性 API | 写入对象 / 意图 | 边界 |
|---|---|---|---|---|
| 方法资产定义与目录 | 定义建立 / 调整 / 退役,目录登记 / 重分类 / 退役。 | `EstablishMethodAssetDefinition`;`AdjustMethodAssetDefinition`;`RegisterMethodAssetCatalogEntry`;`ReclassifyMethodAssetCatalogEntry`。 | 写入 `MethodAssetDefinition` 和 `MethodAssetCatalogEntry`。 | 不接收外部正文,不创建旧 content payload,不把目录读取视图当 truth。 |
| 正式化与版本 | 正式化资格判断、正式化启动、正式版本建立、语义变化、替代和退役。 | `EvaluateMethodAssetFormalizationEligibility`;`InitiateMethodAssetFormalization`;`EstablishFormalMethodAssetVersion`;`SupersedeFormalMethodAssetVersion`。 | 写入 `FormalizationState`、`FormalMethodAssetVersion` 和版本历史线索。 | 不执行治理审批正文,不以 snapshot / fingerprint 替代版本语义。 |
| 受控消费 | 消费边界登记 / 调整,消费材料准备 / 状态标记,使用越界记录。 | `RegisterDownstreamConsumptionBoundary`;`PrepareMethodAssetConsumptionMaterial`;`MarkMethodAssetConsumptionMaterialState`;`RecordDefinitionUseBoundaryViolation`。 | 写入 `DownstreamConsumptionBoundary`、`MethodAssetConsumptionMaterial` 和 safe violation summary。 | 不写鉴权实现、token scope、下游运行状态或旧 snapshot 包。 |
| 追溯与一致性保护 | trace material、impact summary、protection decision、audit trail 和 evidence lineage 组织。 | `OrganizeMethodAssetTraceMaterial`;`RegisterConsumptionImpactSummary`;`EstablishConsistencyProtectionDecision`;`LinkMethodAssetEvidenceLineage`。 | 写入 trace / impact / protection / audit / lineage summary。 | 不保存 raw log、event payload、证据正文、report body 或恢复算法。 |
| 关系与分发语义 | 关系建立 / 调整 / 约束 / 替代 / 退役,完整性评估,分发引用准备和可用性标记。 | `EstablishMethodAssetRelation`;`EvaluateRelationIntegrity`;`PrepareMethodAssetDistributionRef`;`MarkMethodAssetDistributionAvailability`。 | 写入 `MethodAssetRelation`、`RelationIntegrityRule` 结果和 `MethodAssetDistributionRef`。 | 不进入 marketplace 交易、安装、履约、推荐算法或运行依赖图。 |
| 外部摘要与引用 | 外部安全摘要捕获、typed ref 登记、artifact archive ref 登记、正文边界判断、外部 lineage 关联。 | `CaptureExternalSourceSummary`;`RegisterExternalSourceRef`;`RegisterArtifactArchiveRef`;`AssertExternalBodyBoundary`。 | 写入 `ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef` 和 boundary marker。 | 不保存标准全文、ADR 正文、artifact 包体、证据正文、provider payload。 |
| 后台维护与收敛 | 登记维护请求、挂起、正式介入和请求替代。 | `RequestReadMaterialRefresh`;`RequestTraceMaterialRefresh`;`RequestConsistencyRecovery`;`RequireMaintenanceFormalIntervention`。 | 写入 maintenance request / run / task 意图。 | Command 只登记请求,不执行 job,不修 core truth。 |
| 外围包与方法集组织 | package 建立 / 调整 / 退役 / 不可用,method set 组装 / 调整 / 退役,composition 裁决。 | `EstablishMethodPackage`;`AdjustMethodPackageComposition`;`AssembleMethodSet`;`EvaluatePackageComposition`。 | 写入 `MethodPackage`、`MethodSetAssembly` 和 composition summary。 | 不创建核心定义,不保存 package body,不进入 listing、交易、安装或履约。 |

#### R1.42.4 §7.3 Query API 骨架草稿

Query API 按读取面分组。完整 57 个 Query 见 `R1.26`;正式概要正文只保留读取来源、代表性接口和只读边界。

| 主要组成部分 | Query 覆盖 | 代表性 API | 读取来源 | 边界 |
|---|---|---|---|---|
| 方法资产定义与目录 | definition summary、definition ref resolution、catalog entry、catalog view。 | `GetMethodAssetDefinitionSummary`;`ResolveMethodAssetDefinitionRef`;`ListMethodAssetCatalogView`。 | `MethodAssetDefinition`、catalog association、`MethodAssetCatalogView`。 | 不返回正文,不创建或修复目录项。 |
| 正式化与版本 | formalization state、formal version summary、current version resolution、basis summary、eligibility diagnostic、history。 | `GetFormalizationState`;`GetFormalMethodAssetVersionSummary`;`ResolveCurrentFormalMethodAssetVersion`;`GetFormalizationEligibilityDiagnostic`。 | `FormalizationState`、`FormalMethodAssetVersion`、basis summary、history material。 | 不推进正式化,不返回治理执行正文、fingerprint 或 snapshot。 |
| 受控消费 | consumption material、availability view、context ref、boundary、guard diagnostic、consumable contexts。 | `GetMethodAssetConsumptionMaterial`;`GetMethodAssetAvailabilityView`;`GetDownstreamConsumptionBoundary`。 | `MethodAssetConsumptionMaterial`、`MethodAssetAvailabilityView`、`DownstreamConsumptionBoundary`。 | 不扩大消费边界,不读取下游运行 truth,不返回授权矩阵。 |
| 追溯与一致性保护 | trace material、subject trace、impact summary、pending impact、protection diagnostic、audit trail、evidence lineage。 | `GetMethodAssetTraceMaterial`;`GetTraceBySubject`;`GetConsistencyProtectionDiagnostic`;`GetMethodAssetEvidenceLineage`。 | trace / impact / protection / audit / lineage material。 | 不返回 raw log、event payload、证据正文或 report body。 |
| 关系与分发语义 | relation、endpoint relation list、formal version relation list、distribution context relation list、integrity diagnostic、distribution material。 | `GetMethodAssetRelation`;`ListMethodAssetRelationsByEndpoint`;`GetRelationIntegrityDiagnostic`;`GetDistributionReadMaterial`。 | relation truth、relation view、distribution read material。 | 不执行图算法、推荐、marketplace 交易或安装可用性判断。 |
| 外部摘要与引用 | external summary、source ref、artifact archive ref、body boundary diagnostic、summary view、basis acceptance history、lineage hint。 | `GetExternalSourceSummary`;`ResolveExternalSourceRef`;`GetArtifactArchiveRef`;`GetExternalBodyBoundaryDiagnostic`。 | `ExternalSourceSummary`、`ExternalSourceRef`、`ArtifactArchiveRef`、boundary rule。 | 不返回外部正文、artifact body、archive 包、provider payload 或认证信息。 |
| 后台维护与收敛 | maintenance progress、run / scope progress、task summary、run history、pending maintenance scopes。 | `GetMaintenanceProgress`;`GetReadMaterialRefreshTaskSummary`;`GetConsistencyRecoveryTaskSummary`;`ListPendingMaintenanceScopes`。 | `MaintenanceProgressView`、task refs、run history。 | 不返回 worker、queue、scheduler、lock、retry、raw log 或 metrics body。 |
| 外围包与方法集组织 | package、package view、composition diagnostic、method set assembly、assembly view、discovery context、history。 | `GetMethodPackage`;`GetMethodPackageView`;`GetMethodSetAssembly`;`GetPeripheralDiscoveryContext`。 | `MethodPackage`、`MethodPackageView`、`MethodSetAssemblyView`、context refs。 | 不返回 package body、marketplace listing、交易、安装、组织 runtime 配置或 UI 状态。 |

#### R1.42.5 §7.4 Inbound Event Consumer 骨架草稿

| Consumer | 主要组成部分 | 来源事实 | 输入骨架 | 输出 / 处理结果 | 边界 |
|---|---|---|---|---|---|
| `ConsumeBodyFreeExternalSummaryAccepted` | 外部摘要与引用 | 外部系统或相邻仓已形成 body-free external summary accepted 事实。 | source envelope;source event id;source system ref;schema / version;dedup key;trace context;`ExternalSourceRef`;safe summary ref/digest;body-free marker。 | accepted / ignored / rejected consumer result;external summary accepted intake summary。 | 不接收 raw document、webhook payload、标准全文、ADR 正文、artifact body、证据正文或外部 API payload。 |
| `ConsumeExternalSourceRefRegistered` | 外部摘要与引用 | 外部边界已登记 typed external source ref。 | source envelope;source event id;source system ref;schema / version;dedup key;trace context;source kind;namespace ref;version hint;digest hint;`ExternalSourceRef`。 | accepted / ignored / rejected consumer result;external source ref intake summary。 | 不把 URL、external id、file path、route param、provider payload 或认证信息当正式 ref。 |
| `ConsumeArtifactArchiveRefRegistered` | 外部摘要与引用 | 外部边界已登记 artifact / archive body-free ref。 | source envelope;source event id;source system ref;schema / version;dedup key;trace context;`ArtifactArchiveRef`;artifact kind;digest hint;optional `ExternalSourceRef`。 | accepted / ignored / rejected consumer result;artifact/archive ref intake summary。 | 不接收 archive 包、文件内容、安装包、对象存储内容、证据正文、路径或 retention policy。 |
| `ConsumeExternalBodyBoundaryViolation` | 外部摘要与引用 | 外部边界已发现正文禁止边界违规。 | source envelope;source event id;source system ref;schema / version;dedup key;trace context;candidate ref;violation kind;safe reason ref。 | accepted / ignored / rejected consumer result;body boundary violation intake summary。 | 不接收被拒正文、payload 摘录、外部文件内容、标准正文、artifact body 或 evidence body。 |

#### R1.42.6 §7.5 Outbound Event 骨架草稿

Outbound Event 只表达已成立事实或派生材料变化。完整 34 个 event 见 `R1.30`;正式概要正文按事件族摘要。

| 事件族 | 代表性 Event | 触发来源 | 主要消费者 | 边界 |
|---|---|---|---|---|
| 方法资产 / 目录事实 | `MethodAssetDefinitionChanged`;`MethodAssetCatalogEntryChanged`。 | definition / catalog command accepted。 | 正式化、消费、关系、追溯、维护、外围组织。 | 不携带定义正文、搜索索引、topic、payload 或 outbox。 |
| 正式化 / 版本事实 | `MethodAssetFormalizationDecisionChanged`;`FormalMethodAssetVersionEstablished`;`FormalMethodAssetVersionChanged`;`FormalMethodAssetVersionRetired`。 | formalization / formal version command accepted。 | 受控消费、追溯、关系、维护。 | 不携带治理执行正文、版本算法、fingerprint 或 snapshot。 |
| 消费 / 边界事实 | `MethodAssetConsumptionMaterialPrepared`;`MethodAssetConsumptionAvailabilityChanged`;`DownstreamConsumptionBoundaryChanged`;`DefinitionUseBoundaryViolationNoticed`。 | consumption material / boundary / guard command accepted。 | 下游消费方、追溯、维护。 | 不表达下游同步成功,不携带授权矩阵或原始请求。 |
| 追溯 / 影响 / 审计事实 | `MethodAssetTraceMaterialChanged`;`ConsumptionImpactSummaryChanged`;`ConsistencyProtectionDecisionChanged`;`MethodAssetAuditTrailChanged`;`MethodAssetEvidenceLineageChanged`。 | trace / impact / protection / audit / lineage command accepted。 | 审计、验收、维护、消费保护。 | 不携带 raw log、event payload、证据正文或 report body。 |
| 关系 / 分发事实 | `MethodAssetRelationChanged`;`MethodAssetRelationIntegrityChanged`;`MethodAssetDistributionRefChanged`;`MethodAssetDistributionAvailabilityChanged`;`MethodAssetRelationReadMaterialInvalidated`。 | relation / integrity / distribution command accepted 或 material invalidated。 | 消费、外围组织、维护、追溯。 | 不携带 marketplace listing、订单、安装、履约或图算法结果。 |
| 外部摘要 / 引用事实 | `ExternalSourceSummaryChanged`;`ExternalSourceRefChanged`;`ArtifactArchiveRefChanged`;`ExternalBodyBoundaryViolationNoticed`;`ExternalEvidenceLineageChanged`。 | external summary / ref / boundary command or intake accepted。 | 正式化、追溯、关系、外围组织、维护。 | 不携带外部正文、artifact body、archive 包或 provider payload。 |
| 维护 / 收敛事实 | `MethodAssetMaintenanceRequested`;`MethodAssetReadMaterialRefreshChanged`;`MethodAssetTraceMaterialRefreshChanged`;`MethodAssetConsistencyRecoveryChanged`;`MethodAssetMaintenanceProgressChanged`。 | maintenance request accepted 或 job result。 | 读取材料消费者、审计、维护进度读取。 | 不表示 core truth 改变,不携带 worker、queue、retry、lock 或 raw log。 |
| 外围组织事实 | `MethodPackageChanged`;`MethodSetAssemblyChanged`;`PackageCompositionResultChanged`;`PeripheralViewAvailabilityChanged`。 | package / method set / composition command accepted 或 peripheral view availability changed。 | 外围读取材料、生态发现、审计、维护。 | 不携带 package body、marketplace transaction、安装、履约或组织 runtime 状态。 |

#### R1.42.7 §7.6 Operations Job 骨架草稿

| Job | 输入骨架 | 输出骨架 | 主要处理摘要 | 边界 |
|---|---|---|---|---|
| `RefreshCatalogAndDefinitionReadMaterials` | `MaintenanceRunRef`;`RefreshScopeRef`;definition / catalog refs。 | refreshed catalog / definition read material summary;progress marker。 | 刷新 definition summary、catalog view 和相关读取材料。 | 不修改 definition truth、catalog truth 或外部正文。 |
| `RefreshFormalVersionReadMaterials` | `MaintenanceRunRef`;`RefreshScopeRef`;formalization / formal version refs。 | refreshed formal version material summary;availability / freshness marker。 | 刷新正式化状态、正式版本摘要和 basis 读取材料。 | 不重做正式化裁决,不生成新 formal version。 |
| `RefreshConsumptionReadMaterials` | `MaintenanceRunRef`;`RefreshScopeRef`;consumption material / boundary refs。 | refreshed consumption material / availability summary。 | 刷新消费材料、可用性 view 和消费上下文读取材料。 | 不扩大消费边界,不声明下游已同步或已运行。 |
| `RefreshRelationDistributionMaterials` | `MaintenanceRunRef`;`RefreshScopeRef`;relation / distribution refs。 | refreshed relation / distribution material summary。 | 刷新关系视图、分发读取材料和完整性摘要。 | 不修复 relation truth,不执行 marketplace / graph 算法。 |
| `RefreshExternalSummaryReadMaterials` | `MaintenanceRunRef`;`RefreshScopeRef`;external summary / ref / artifact refs。 | refreshed external summary view;body-free availability marker。 | 刷新外部摘要、外部 ref 和 artifact archive ref 读取材料。 | 不读取或复制外部正文、artifact 包体、证据正文。 |
| `RefreshTraceAuditImpactMaterials` | `MaintenanceRunRef`;`RefreshScopeRef`;trace / audit / impact / lineage refs。 | refreshed trace / audit / impact material summary。 | 刷新追溯、影响、审计和 lineage 读取材料。 | 不保存 raw log、event payload、report body 或 evidence body。 |
| `RunConsistencyRecoveryConvergence` | `MaintenanceRunRef`;`RefreshScopeRef`;recovery task refs;affected subject refs。 | recovery convergence summary;formal intervention marker optional。 | 对不一致、缺失或不可用材料执行收敛检查并输出安全摘要。 | 不自动修复 core truth,不重做正式化,不绕过消费边界。 |
| `RefreshPeripheralReadMaterials` | `MaintenanceRunRef`;`RefreshScopeRef`;package / method set / peripheral view refs。 | peripheral refresh summary;availability / freshness markers。 | 刷新 package、method set、composition 和 discovery 读取材料。 | 不让外围不可用影响核心闭环成立,不进入交易、安装或履约。 |

#### R1.42.8 §7.7 接口边界红线草稿

| 红线 | 说明 |
|---|---|
| 旧 `MethodContent` 主线禁入 | 当前 §7 不再使用 `CreateMethodContentDraft`、`PublishMethodContent`、`GetMethodContent` 等旧接口作为来源。 |
| publish / snapshot / fingerprint 禁入 | 不恢复 `ExportDefinitionSnapshot`、`CompareFingerprint`、`RecalculateFingerprint`、fingerprint changed event 或 snapshot export job。 |
| Outbound Event 不等于 outbox | 概要层只定义事实事件边界;topic、payload schema、outbox 表、relay、retry、dead letter 留待后续重新闭口。 |
| Query 不修 truth | 所有 Query 只读取 view、summary、material、typed ref、history、lineage 或 progress。 |
| Inbound 必须 body-free | Inbound Consumer 只承接 safe summary、typed ref、digest hint、marker、safe reason ref,不接收正文或 provider payload。 |
| Operations Job 不修 core truth | Job 只刷新派生材料和收敛状态,不改 definition、formal version、relation、external summary 或 package truth。 |
| Peripheral 不阻塞核心 | package、method set、composition、peripheral view 是外围组织语义,不作为定义、正式化、消费或追溯成立前置。 |
| 详细设计内容不得下沉 | 本章不写完整 DTO、字段全集、错误码、HTTP / RPC、repository / port、worker、DDL、配置或状态机。 |

#### R1.42.9 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只写中间产物草稿 | pass | 未直接修改正式 `02-概要设计.md`。 |
| 是否覆盖正式 §7.1~§7.7 | pass | 分类、Command、Query、Inbound、Outbound、Job、红线均有草稿。 |
| 是否来源可追溯 | pass | 草稿回指五类总表、映射表、跨接口审计和旧材料差异审计。 |
| 是否避免超长明细复制 | pass | Command、Query、Outbound 已摘要化;Inbound 和 Operations Job 因数量可控完整列出。 |
| 是否避免旧材料回流 | pass | 未恢复 `MethodContent`、publish、snapshot、fingerprint、old outbox、P1 plugin / configuration。 |
| 是否避免 Step 8/9 泄漏 | pass | 未写处理流、状态机、异常分支、事务边界或状态迁移。 |
| 是否避免详细设计下沉 | pass | 未写完整 DTO、字段全集、HTTP / RPC、topic / payload schema、repository、worker、DDL 或配置。 |
| 是否允许进入自检与停审:先思考 | pass | 正式 §7 可回填草稿已形成。 |

next_allowed_action: 等待用户确认后进入 Step 7 `自检与停审:先思考`;只思考 Step 7 完成门禁、正式 §7 草稿可回填性和是否允许进入自检写入,不得直接改正式 `02-概要设计.md`,不得进入 Step 8/9。

### R1.43 自检与停审:先思考

#### R1.43.1 问题回答

- 本模块只思考 Step 7 自检与停审的检查口径,不写最终停审结论,不改正式 `02-概要设计.md`,不进入 Step 8/9。
- 自检目标是判断 Step 7 是否已经完成 API / 接口骨架重审,是否具备后续正式 §7 回填条件,以及是否允许后续进入 Step 8 开工。
- 当前 `R1.42` 已形成正式 §7 可回填草稿,但正式文档尚未修改;因此本模块只能思考“草稿可回填性”和“停审条件”,不能把正式 §7 标记为已回填。
- Step 7 完成门禁应覆盖:五类接口总表完成、八个主要组成部分覆盖、接口 owner 唯一、读写边界清楚、旧材料差异审计完成、正式 §7 草稿完成、未下沉 Step 8/9 和详细设计。
- 下一批 `R1.44` 才写最终自检表、停审结论、flow / 台账推进建议和是否允许进入下一动作。

#### R1.43.2 自检输入盘点

| 输入 | 检查用途 | 当前状态 |
|---|---|---|
| `R1.24` Command 总表 | 检查 Command 覆盖和写入边界。 | completed:58 个 Command。 |
| `R1.26` Query 总表 | 检查 Query 覆盖和只读边界。 | completed:57 个 Query。 |
| `R1.28` Inbound 总表 | 检查 body-free inbound 边界。 | completed:4 个 Consumer。 |
| `R1.30` Outbound 总表 | 检查 fact event 边界。 | completed:34 个 Event。 |
| `R1.32` Operations Job 总表 | 检查 job 归属和不修 truth 边界。 | completed:8 个 Job。 |
| `R1.34` 映射表 | 检查八个主要组成部分 owner 和反查入口。 | completed:8 行映射。 |
| `R1.38` 跨接口审计 | 检查分类、owner、读写、event/job 一致性。 | completed:无 cross-interface blocker。 |
| `R1.40` 旧材料差异审计 | 检查旧正式 §7 和旧 Step 8/9 污染已裁决。 | completed:正式 §7 裁定整体替换。 |
| `R1.42` 正式 §7 草稿 | 检查草稿是否覆盖 7.1~7.7 且可追溯。 | completed:中间产物草稿已形成。 |

#### R1.43.3 预计完成门禁

| 门禁 | 通过条件 | 下一批写入方式 |
|---|---|---|
| 五类接口完成 | Command / Query / Inbound / Outbound / Operations Job 均有当前 R1 总表。 | 写 pass / fail 和引用。 |
| 主要组成部分覆盖 | Step 5 八个组成部分均在接口映射和草稿中出现。 | 写覆盖表或摘要。 |
| 对象承接完整 | 接口输入 / 输出回指 Step 6 对象、typed ref、summary、material、view、task 或 boundary。 | 写 pass / risk。 |
| 读写边界清楚 | Command 写、Query 读、Inbound intake、Outbound fact、Job derived。 | 写 pass / risk。 |
| 旧材料禁入 | `MethodContent` / publish / snapshot / fingerprint / outbox / P1 plugin 未作为当前接口来源。 | 写 pass / residual risk。 |
| 正式 §7 草稿可回填 | `R1.42` 覆盖 7.1~7.7,来源清楚,未新增 R1 外接口。 | 写 pass / action。 |
| 未提前修改正式文档 | 正式 `02-概要设计.md` 本轮仍未由 Step 7 草稿模块修改。 | 写 no / pass。 |
| 未进入 Step 8/9 | 未写处理流、状态机、异常分支、状态迁移。 | 写 pass。 |

#### R1.43.4 停审裁决候选

| 裁决项 | 候选结论 | 理由 |
|---|---|---|
| Step 7 中间产物是否完成 | likely_pass | `R1.24`~`R1.42` 已覆盖接口分类、局部循环、总表、映射、诊断、审计、差异和草稿。 |
| 正式 §7 是否已回填 | no | 目前只形成中间产物草稿,未修改正式 `02-概要设计.md`。 |
| 是否允许下一步直接进入 Step 8 | not_yet | 还需要 `R1.44` 最终停审确认,并按用户后续指令决定是否先正式回填 §7。 |
| 是否存在 Step 7 blocker | likely_no | 当前未发现分类、owner、对象承接或旧材料污染 blocker。 |
| 是否需要保留后续风险 | yes | Step 8/9 必须继续防止旧 publish flow、MethodContent lifecycle、OutboxEventStatus 回流。 |

#### R1.43.5 下一写入批次结构

下一批 `R1.44 自检与停审:再写入` 只写:

1. `Step 7 完成门禁自检表`。
2. `正式 §7 草稿可回填性检查`。
3. `旧材料与 Step 8/9 后续风险保留`。
4. `停审裁决`。
5. `flow / 台账推进建议`。
6. `next_allowed_action`。

#### R1.43.6 下一写入批次边界

- 不直接修改正式 `02-概要设计.md`。
- 不进入 Step 8 / Step 9。
- 不把正式 §7 标记为已回填,除非实际改正式文档并经用户确认;当前下一批只能裁定中间产物草稿完成。
- 若自检发现 R1 总表或草稿缺口,必须停在 Step 7 修复,不得推进。
- 若自检通过,下一步应等待用户决定:先正式回填 §7,或继续按流程进入下一 Step 的开工讨论。

#### R1.43.7 自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只做先思考 | pass | 未写最终停审表。 |
| 是否覆盖自检输入 | pass | 已列入五类总表、映射、跨接口审计、差异审计和正式 §7 草稿。 |
| 是否明确完成门禁 | pass | 已定义八类完成门禁。 |
| 是否明确正式文档尚未回填 | pass | 明确当前只判断草稿可回填性。 |
| 是否避免进入 Step 8/9 | pass | 未写处理流或状态机。 |
| 是否修改正式文档 | no | 正式 `02-概要设计.md` 未修改。 |
| 是否允许进入自检与停审:再写入 | pass | 自检口径已闭合。 |

next_allowed_action: 等待用户确认后进入 Step 7 `自检与停审:再写入`;只写 Step 7 完成门禁自检、正式 §7 草稿可回填性检查、后续风险保留、停审裁决和 flow / 台账推进建议,不得直接修改正式 `02-概要设计.md`,不得进入 Step 8/9。

### R1.44 自检与停审:再写入

#### R1.44.1 Step 7 完成门禁自检表

| 门禁 | 结论 | 依据 | 说明 |
|---|---|---|---|
| 五类接口完成 | pass | `R1.24`;`R1.26`;`R1.28`;`R1.30`;`R1.32` | 已形成 58 个 Command、57 个 Query、4 个 Inbound Consumer、34 个 Outbound Event、8 个 Operations Job。 |
| 八个主要组成部分覆盖 | pass | `R1.34`;`R1.42` | 方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发语义、外部摘要与引用、后台维护与收敛、外围包与方法集组织均已覆盖。 |
| 接口 owner 唯一 | pass | `R1.34`;`R1.38` | 每个接口只归属一个主要组成部分;Inbound 仅归外部摘要与引用,Operations Job 仅归后台维护与收敛。 |
| 对象承接完整 | pass | `R1.24`~`R1.32`;`R1.38` | 接口输入 / 输出均回指 Step 6 对象、typed ref、summary、material、view、task、history、lineage 或 boundary。 |
| 读写边界清楚 | pass | `R1.38`;`R1.42` | Command 写、Query 读、Inbound intake、Outbound fact、Operations Job derived 的边界成立。 |
| 旧材料差异审计完成 | pass | `R1.40` | 旧正式 §7、historical 5.20、旧 Step 8/9 风险已审计;正式 §7 裁定整体替换。 |
| 正式 §7 草稿完成 | pass | `R1.42` | 已形成覆盖 7.1~7.7 的可回填草稿,但尚未实际修改正式文档。 |
| 未下沉 Step 8/9 | pass | `R1.24`~`R1.42` | 未写处理流、事务边界、异常分支、状态机或状态迁移。 |
| 未下沉详细设计 / 实现 | pass | `R1.42` | 未写完整 DTO、字段全集、HTTP / RPC、repository / port、topic / payload schema、worker、DDL、配置。 |

#### R1.44.2 正式 §7 草稿可回填性检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 章节覆盖 | pass | `R1.42` 覆盖正式 §7.1~§7.7。 |
| 来源可追溯 | pass | 草稿来源限定为五类总表、映射表、跨接口审计和旧材料差异审计。 |
| 摘要化适度 | pass | Command、Query、Outbound 已摘要化;Inbound 和 Operations Job 因数量可控完整列出。 |
| 旧主线禁入 | pass | 草稿未恢复 `MethodContent`、publish、snapshot、fingerprint、old outbox、P1 plugin / configuration。 |
| 正式文档状态 | not_written | 当前只形成中间产物草稿;正式 `02-概要设计.md` 尚未由本模块回填。 |
| 回填前置动作 | wait_user_decision | 需要用户明确是否现在将 `R1.42` 草稿回填到正式 `02-概要设计.md`。 |

#### R1.44.3 旧材料与 Step 8/9 后续风险保留

| 风险 | 状态 | 后续要求 |
|---|---|---|
| 旧 `MethodContent` publish flow 回流 | open_risk_for_step8 | Step 8 必须从当前 R1 接口族筛选处理流,不得恢复旧 `PublishMethodContent` 主链。 |
| snapshot / fingerprint 作为处理流来源 | open_risk_for_step8 | Step 8 若讨论供给、恢复、刷新,必须从 consumption material、read material、trace material、artifact/archive ref 重新推导。 |
| old outbox / relay 作为事件实现默认 | open_risk_for_step8_or_03 | 概要只保留 outbound fact event;投递机制若需要,后续重新闭口。 |
| `MethodContentLifecycle` 状态回流 | open_risk_for_step9 | Step 9 状态 owner 必须来自 Step 6 新对象,不得沿用旧统一 lifecycle。 |
| `OutboxEventStatus` 状态回流 | open_risk_for_step9_or_03 | 若后续需要投递状态,只能作为交付机制另行讨论,不得反推概要状态主线。 |

#### R1.44.4 停审裁决

| 裁决项 | 结论 | 说明 |
|---|---|---|
| Step 7 中间产物是否完成 | completed | API / 接口骨架重审已完成到可停审状态。 |
| 正式 §7 是否已回填 | no | 当前只完成中间产物草稿 `R1.42`,未修改正式 `02-概要设计.md`。 |
| 是否存在 Step 7 blocker | no_blocker_for_current_step | 未发现分类、owner、对象承接、读写边界或旧材料污染 blocker。 |
| 是否允许正式 §7 回填 | ready_when_user_confirms | 可按 `R1.42` 草稿整体替换正式 §7,但需用户明确确认执行正式文档写入。 |
| 是否允许直接进入 Step 8 | not_before_user_decision | 建议先由用户决定是否回填正式 §7;若不回填,也必须在 flow / 台账中明确以 `R1.42` 作为 Step 8 输入基线。 |

#### R1.44.5 flow / 台账推进建议

| 文件 | 建议状态 | 建议 next_allowed_action |
|---|---|---|
| `02_hld_step_07_api_interface_skeleton.md` | Step 7 中间产物 completed | 等待用户决定:正式回填 §7 或进入 Step 8 开工。 |
| `02_hld_calibration_flow.md` | Step 7 intermediate_completed / wait_user_decision | 下一动作不自动进入 Step 8;等待用户确认正式回填或继续。 |
| `project_execution_ledger.md` | Step 7 intermediate_completed / wait_user_decision | 恢复点指向“等待用户决定正式 §7 回填或 Step 8 开工”。 |
| `02-概要设计.md` | formal §7 pending_rewrite | 不在本模块自动修改;后续若确认,按 `R1.42` 草稿整体替换 §7。 |

#### R1.44.6 next_allowed_action

```text
等待用户决定下一动作:
1. 若用户要求正式回填 §7,则按 R1.42 草稿整体替换 projects/L3-method-library/02-概要设计.md 的 §7,并同步 flow / 台账。
2. 若用户要求继续 Step 8,则必须先在 flow / 台账中明确 Step 8 的输入基线为 R1.42 草稿和 Step 7 completed intermediate,并不得使用旧正式 §7 作为输入。
3. 在用户明确前,不得直接修改正式 02-概要设计.md,不得进入 Step 8/9。
```

#### R1.44.7 本模块停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否完成最终自检表 | pass | 已写 Step 7 完成门禁自检。 |
| 是否判断正式 §7 草稿可回填 | pass | `R1.42` 可作为正式回填草稿,但尚未实际回填。 |
| 是否保留 Step 8/9 风险 | pass | 已保留 publish flow、snapshot/fingerprint、old outbox、MethodContentLifecycle、OutboxEventStatus 风险。 |
| 是否明确停审裁决 | pass | Step 7 中间产物 completed;下一步等待用户决定。 |
| 是否直接修改正式文档 | no | 未修改正式 `02-概要设计.md`。 |
| 是否进入 Step 8/9 | no | 未写 Step 8/9 内容。 |

next_allowed_action: 等待用户决定下一动作:正式回填 §7,或以 `R1.42` 为基线进入 Step 8 开工;在用户明确前不得直接修改正式 `02-概要设计.md`,不得进入 Step 8/9。

### R1.45 正式 §7 回填记录:再写入

#### R1.45.1 回填动作记录

| 项 | 记录 |
|---|---|
| 用户确认 | 已确认执行正式 §7 回填。 |
| 回填来源 | `R1.42 正式 §7 回填草稿:再写入`。 |
| 回填目标 | `projects/L3-method-library/02-概要设计.md` 的 `## 7. API / 接口骨架`。 |
| 回填范围 | 仅整体替换正式 `## 7` 到 `## 8` 之前的内容。 |
| 未修改范围 | 未修改正式 `## 8`、`## 9` 或后续章节。 |
| 回填方式 | 摘要化回填:保留接口分类、Command / Query 分组、Inbound Consumer、Outbound Event 事件族、Operations Job 和接口边界红线;完整接口明细仍以本文件 `R1.24`~`R1.32` 为准。 |

#### R1.45.2 回填后检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 正式 §7 是否已回填 | pass | 正式 `02-概要设计.md` 的 §7 已按 `R1.42` 草稿整体替换。 |
| 是否只修改 §7 | pass | 本次回填目标限定在 `## 7` 到 `## 8` 之前。 |
| 是否恢复旧接口主线 | pass | §7 正文接口骨架未恢复旧 `MethodContent` / publish / snapshot / fingerprint / outbox 主线;相关旧词只作为“不恢复 / 不返回 / 不携带 / 禁入”等边界语境出现。 |
| 是否下沉 Step 8/9 | pass | §7 未写处理流、事务边界、异常分支、状态机或状态迁移。 |
| 是否下沉详细设计 / 实现 | pass | §7 未写完整 DTO、字段全集、HTTP / RPC、repository / port、topic / payload schema、worker、DDL、配置。 |

#### R1.45.3 后续风险保留

| 风险 | 当前状态 | 后续要求 |
|---|---|---|
| 正式 §8 仍是旧材料 | open_for_step8 | Step 8 必须完全按当前 Step 5 / Step 6 / Step 7 重新讨论,不得沿用旧 §8 的 publish flow、snapshot、fingerprint 或 outbox 实现默认。 |
| 正式 §9 仍是旧材料 | open_for_step9 | Step 9 必须等 Step 8 闭合后,按新对象 owner 和状态来源重写或深度反查。 |
| historical Step 8 / Step 9 污染 | open_for_later_audit | 旧 Step 8 / Step 9 只能作为后置差异审计输入,不得作为当前处理流或状态机第一来源。 |

#### R1.45.4 本模块最终裁决

| 裁决项 | 结论 | 说明 |
|---|---|---|
| Step 7 中间产物 | completed | `R1.24`~`R1.44` 已闭合接口总表、映射、审计、草稿和停审。 |
| 正式 §7 | backfilled | 正式 §7 已按 `R1.42` 回填。 |
| Step 7 blocker | none | 当前 Step 7 无遗留 blocker。 |
| 下一步 | ready_for_step8_opening | 下一步只能进入 Step 8 `开工与必读文档:先思考`,不得直接写 Step 8 正文。 |

next_allowed_action: 等待用户确认后进入 Step 8 `开工与必读文档:先思考`;Step 8 必须以正式 §7 回填后文本、`R1.24`~`R1.45` 和 Step 5 / Step 6 当前结论为输入基线,不得沿用旧正式 §8 或 historical Step 8 作为第一来源。
