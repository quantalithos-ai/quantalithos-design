# L2-member-images 03 详细设计 Step 5：定义模块实现契约主轴

> 创建日期：2026-08-25  
> 状态：`in_progress`  
> 文档模式：`full-restart`  
> 回填位置：正式 `03-详细设计.md` 第 5 章、第 6 章与第 16 章（当前仅形成草稿，禁止装配正式 03）  
> 前置：`03_ddd_step_01_upstream_boundary.md` 至 `03_ddd_step_04_file_layout.md` 已通过。  
> 当前授权：本 Step 是本轮最后允许的 Step；完成自检后必须停审，未经用户再次明确确认不得创建 Step 6。

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 直接输入 | Step 4 的 planned workspace / file layout；02 §4~§12 的五个业务主体、对象、接口、流程、状态和详细设计承接；01 §8~§10 的向内依赖、数据 owner 与 interaction boundary。 |
| 规范输入 | `详细设计讨论流程_SOP.md` Step 5、`详细设计书写规范.md` §5.5、`设计真相源闭环与可落码性标准.md`。 |
| 本步目标 | 确定“业务 capability 切片 × 技术实现模块”的双轴主线，使后续对象、port、协议、flow、state、transaction、error 与 test 都能找到唯一主归属。 |
| 本步产出上限 | 只确定模块职责、允许 / 禁止依赖、暴露面、对象 / port / handler / repository 的归属和 Step 6~17 承接。字段、完整函数签名、trait 方法、DTO schema、处理流、状态矩阵、DDL 和测试 case 仍留给后续 Step。 |
| 本步禁止 | 不把五业务主体拆成五个 crate/service；不把 `contracts` 写成 Member Service 或外部 Rust public contract；不定义 pending external DTO / route / topic；不读取旧正式 `03-详细设计.md`；不创建实现仓、代码、Cargo、测试、evidence 或 commit。 |

## 1. Step 内计划与模块级门禁

| 子阶段 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 双轴识别 | §2、§5.1~§5.3 | `done` | 五个业务 capability 与七个技术模块不混写，且每个 capability 有主 owner。 |
| 归属分配 | §5.4~§5.6 | `done` | 02 的 formal objects、coordinator、port、repository、entry 与 projection 均有唯一主要归属。 |
| 依赖收敛 | §5.7~§5.8 | `done` | 向内依赖、external seam、禁止反向依赖和无 outbound event 现状一致。 |
| Step 6 准备 | §5.9 | `done` | 对象批次与 non-core closure / defer 判断明确，但没有提前创建 Step 6 文件或对象卡。 |
| 回填与自检 | §6、§8 | `done` | 本 Step 实施契约主轴可回填；文档级门禁将因用户停点转为 blocked。 |

| 模块 / 范围 | 问题回答 | 诊断 | 改动前后 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|---|
| `module_contracts` | done | done | done | done | done | done | done | `pass` | 停审，等待用户明确确认后才可创建 Step 6。 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 本仓详细设计应拆成哪些实现模块？ | 物理实现采用七个职责型模块：`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。业务上同时保持 `DefinitionAssembly`、`BuildCandidate`、`Qualification`、`SupplyEntry`、`ReferenceDerived` 五个 capability 切片。前者是 crate / file / dependency 主轴，后者是本仓阶段性 truth / capability 主轴；两者必须交叉映射而非互相取代。 |
| 2. 每个模块对应概要设计中的哪个主要组成部分或代码主体？ | `domain` 中的 `definition/assembly`、`build`、`qualification`、`supply`、`reference` 分别承接五切片的 local truth；`application` 中对应五个 coordinator service 承接 use case；`contracts` 承接 type carrier；`infra` 承接 repository / adapter / projection；`api`、`worker`、`jobs` 承接入口。`ReferenceDerived` 是横向 capability，不是可反向写 core 的技术层。 |
| 3. 每个模块对外暴露什么？ | `contracts` 暴露 workspace 内的 typed carrier；`domain` 仅向 `application` 暴露本仓对象、guard、transition 和 domain error；`application` 暴露 service facade、caller-owned port、UoW 和 idempotency 语义；`infra` 暴露 composition / adapter / fake；`api`、`worker`、`jobs` 暴露各自逻辑入口。没有模块可向 sibling 直接暴露未确认的 manifest、variant、release、event 或 evidence schema。 |
| 4. 每个模块允许依赖什么、禁止依赖什么？ | 允许方向为 `contracts -> domain -> application`，`infra` 实现 application-owned port，`api/worker/jobs` 仅做 entry wiring 并调用 application。Domain 不依赖 infra、config、SDK、transport、async runtime 或 sibling；application 不依赖 concrete adapter；entry 之间不互调。External relationship 只能从 infra / entry 经 approved port 进入，且按 compile/runtime/event/ref/adapter/fake 保持分类。 |
| 5. 哪些对象、trait、handler、repository 应归属于哪个模块？ | typed ID/ref/metadata/DTO/view/error 归 `contracts`；02 的 33 个 formal domain object / guard 归 `domain` 的五个 capability file group；coordinator、repository / external port trait、UoW、idempotency 和 query / consumer / job orchestration归 `application`；durable/fake repo、adapter、config、composition归 `infra`；command/query mapping归 `api`；verified conditional event intake归 `worker`；nightly / reconcile / refresh / rebuild runner归 `jobs`。完整对象与 trait 契约留给 Step 6/7。 |

## 3. 当前材料诊断

| 现象 | 若不先收稳模块主轴的后果 | 本 Step 处置 |
|---|---|---|
| Step 4 已有七个 workspace member，但尚未说明五业务主体如何横跨它们 | 后续可能按 crate 堆对象，或把一个 capability拆成多套相互冲突的 truth | 建立 capability × technical module 矩阵；每个阶段性 truth有唯一 domain file和对应 application coordinator。 |
| `ReferenceDerived` 同时服务所有阶段 | 容易将其变成万能 repository、cache 或第二 truth | 限定其为 ref/snapshot/gap/trace/freshness/projection 的 local semantic owner；只能从 committed local truth 构建，只能提供新的受控输入 / gap。 |
| 对外 consumer、Artifact、mapping、component、seed、event等合同尚未闭口 | `contracts` 或 `infra` 可能私造外部 DTO，或把 adapter outcome视为领域成功 | 规定 contracts 只承载本仓 private/neutral carrier；infra only converts outcome to conservative input；各 capability保留 blocker。 |
| api、worker、jobs 都出现在 planned layout | 容易把 logical entry误解为 active process、HTTP、broker、cron或出站 event | entry modules只做 input mapping / application call；worker conditional，jobs bounded；无 outbound event module。 |
| Step 5 是本轮停点 | 容易因“模块主轴已定”越过用户授权写对象卡或正式 03 | 只分配 Step 6~17 的承接点，完成后更新三层门禁为等待用户。 |

## 4. 改动前后对比与设计取舍

| 主题 | 改动前 / 未定状态 | 本 Step 结论 | 原因 |
|---|---|---|---|
| 模块主轴 | Step 4 有物理路径，02 有业务主体，二者尚未形成统一实施归属 | 采用业务 capability 与技术模块双轴；技术 crate是强依赖边界，capability是对象/流程主线 | 避免业务主体与 crate/service/database 机械一对一。 |
| Local truth owner | 02 有阶段对象，尚未映射 domain file | 五组阶段 truth分别落在 `domain::{definition,assembly}`、`build`、`qualification`、`supply`、`reference` | 保持 candidate/eligibility/availability/handoff/consumer 分离。 |
| coordinator / port owner | 02 列出 coordinator/port 骨架，未固定技术归属 | coordinator、port trait、UoW、idempotency都归 application；adapter/repository实现归 infra | 维持 dependency inversion，避免 domain或entry直接做 I/O。 |
| external carrier | 对端 schema pending | `contracts` 只存 local typed carrier，external exact content通过 opaque ref/safe conclusion/gap | 防止本仓替上游/兄弟仓补定义。 |
| entry | Command/Query/Event/Job 分类存在 | api/worker/jobs只有 logical/bounded entry；event current only inbound conditional，无 outbound | 不从设计骨架推导运行基础设施或 delivery事实。 |

| 方案 | 收益 | 风险 / 代价 | 结论 |
|---|---|---|---|
| A. 只按七个 crate 分配，忽略五个业务主体 | 结构简单 | 定义、构建、资格和供给的阶段 owner 易散落，难以审计 staged truth | 不采用。 |
| B. 只按五个业务主体拆 crate / service | capability 名称直观 | 每个主体需要 contracts/domain/application/infra/entry，造成反向依赖、重复 carrier或过早服务化 | 不采用。 |
| C. capability × technical module 双轴 | 既保留阶段真相 owner，又用 Cargo 边界限制依赖 | 需要矩阵与明确主归属 | 采用。 |
| D. 将 ReferenceDerived作为跨模块写入协调中心 | 减少表面调用 | 会使 projection/cache/ref shadow夺取 local truth | 不采用；它只读、可重建、gap-visible。 |

## 5. 结构化中间产物

### 5.1 技术模块总览

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 / 模块 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `member-images-contracts` | workspace 内 typed ID/ref、metadata、Command/Query、conditional inbound event、Job、view 与 safe protocol error carrier | workspace-internal carrier；不得作为未确认的 Member Service / Artifact / Method Library public schema | 仅 approved local serialization/error candidate；future formally approved Core carrier。 |
| `domain` | `crates/domain` / `member-images-domain` | 五 capability 的 local truth、state、guard、append/supersede history、read-only projection semantic marker和 `DomainError` | object constructor / transition / guard / domain error，仅供 application | `contracts`；future formally approved Core carrier；禁止任何 I/O module。 |
| `application` | `crates/application` / `member-images-application` | five coordinator use case、query/consumer/job orchestration、caller-owned port、UoW、idempotency、error mapping | service facade、port trait、UoW/idempotency contract、application error | `domain`、`contracts`；禁止 concrete infra。 |
| `infra` | `crates/infra` / `member-images-infra` | repository、projection / idempotency store、source/build/qualification/supply adapter、config binding、composition、blocked adapter与 fake | composition root、adapter/store/fake implementations、infra error | `application`、`domain`、`contracts`；禁止 business decision或 external truth ownership。 |
| `api` | `crates/api` / `member-images-api` | synchronous logical Command/Query input validation、facade call、safe result/error mapping | handler / mapper boundary | `application`、`contracts`、infra composition only；禁止 direct repository/domain mutation。 |
| `worker` | `crates/worker` / `member-images-worker` | conditional verified build/source-refresh event authority、dedup、receipt mapping和 application dispatch | conditional consumer boundary | `application`、`contracts`、infra composition only；禁止 broker/lifecycle truth或 direct write。 |
| `jobs` | `crates/jobs` / `member-images-jobs` | nightly sweep、attempt/qualification/reference/handoff reconciliation与 projection rebuild 的 bounded runner | typed job runner / action entry candidate | `application`、`contracts`、infra composition only；禁止 scheduler ownership、blind retry或 owner truth repair。 |

### 5.2 五个业务 capability 主归属表

| capability 切片 | Domain truth / policy 主归属 | Application 主归属 | Contracts / Infra / Entry 主要落点 | 关键不变量 |
|---|---|---|---|---|
| `DefinitionAssembly` | `domain::definition`、`domain::assembly`、`domain::guards`、`domain::history` | `definition_service` | `contracts::{ids_refs,commands,queries,views}`；`infra::{repositories,source_adapters}`；api command/query、worker source refresh、jobs reference refresh | Role/mapping、component、seed正文不进入；baseline只有完整 pinned static input 才可支持 revision。 |
| `BuildCandidate` | `domain::build`、`domain::guards`、`domain::states` | `build_service` | `contracts::{commands,inbound_events,jobs,views}`；`infra::{repositories,build_adapters}`；api、conditional worker build request、nightly/reconcile jobs | intent/attempt/snapshot/candidate分开；ACK/registry presence/unknown不能形成 candidate。 |
| `Qualification` | `domain::qualification`、`domain::guards`、`domain::history` | `qualification_service` | `contracts::{commands,queries,jobs,views}`；`infra::{repositories,qualification_adapters}`；api、reevaluate/reconcile jobs | provenance/gate/eligibility/Artifact handoff分开；missing/unknown gate fail closed。 |
| `SupplyEntry` | `domain::supply`、`domain::guards`、`domain::history` | `supply_service` | `contracts::{commands,queries,jobs,views}`；`infra::{repositories,supply_adapters}`；api resolve/query、handoff reconcile job | availability/entry/consumer gap分开；immutable pin；container/launch/health不写回。 |
| `ReferenceDerived` | `domain::reference`、`domain::guards`、`domain::history`、`domain::states` | `reference_service`、`query_service` | `contracts::{ids_refs,queries,inbound_events,jobs,views}`；`infra::{projection_store,source_adapters,fakes}`；worker refresh、jobs refresh/rebuild/reconcile | ref/snapshot/gap/trace/freshness可见；projection/cache/fake不反写 core truth。 |

### 5.3 Capability × technical module 交叉矩阵

| capability | contracts | domain | application | infra | api | worker | jobs |
|---|---|---|---|---|---|---|---|
| `DefinitionAssembly` | ref/metadata/command/query/view carrier | definition、assembly、guard、history | `DefinitionAssemblyCoordinator`与 definition service | definition/revision repo；mapping/component/seed safe-ref adapter | Define/Capture/Propose command与 read mapping | only conditional source-refresh mapping | refresh reference snapshot；reconcile definition-facing gaps。 |
| `BuildCandidate` | trigger/command/event/job/view carrier | intent、attempt、snapshot、outcome、candidate、guard | `BuildIntentCoordinator`与 build service | build truth repo；builder/registry conservative adapter | request/outcome command与 trace read mapping | only verified build-request mapping | nightly sweep；attempt reconciliation。 |
| `Qualification` | command/query/job/view carrier | provenance、gate、eligibility、handoff、guard | `QualificationCoordinator`与 qualification service | qualification repo；evidence/Artifact safe-conclusion adapter | eligibility/handoff command与 safe read mapping | none unless future verified source authority | reevaluate pending qualification；handoff reconciliation。 |
| `SupplyEntry` | command/query/job/view carrier | transition、entry、consumer gap、guard | `AvailabilityCoordinator`与 supply service | availability repo；consumer supply boundary adapter | publish/transition/resolve query mapping | no consumer lifecycle intake | reconcile image handoffs；availability read-model maintenance。 |
| `ReferenceDerived` | ref/freshness/gap/trace/view carrier | snapshot、gap、trace、freshness、read model、guard | `ReferenceIntakeCoordinator`、`ProjectionRebuilder`、reference/query service | projection store；source adapter；fake | trace/gap/freshness query mapping | conditional source-refresh intake only | refresh snapshots；rebuild views；reconcile gaps。 |

### 5.4 正式对象 / guard 主归属矩阵

> 本表只固定主归属和后续展开位置，不补字段、构造函数或状态表；这些必须在 Step 6 按模块逐对象完成。

| capability | `domain` 主文件 | Step 6 对象 / guard 组 | `application` 主服务 | 后续 port / flow / state 承接 |
|---|---|---|---|---|
| `DefinitionAssembly` | `definition.rs`、`assembly.rs`、`guards.rs` | `ImageFamilyDefinition`、`ImageVariantDefinition`、`AssemblyBaseline`、`VariantRevision`、`MappingSourceSnapshot`、`ComponentPinSet`、`SeedPlacementBinding`、`AssemblyCompletenessGuard`、`PinIntegrityGuard` | `DefinitionAssemblyCoordinator` / `definition_service.rs` | Step 7 mapping/component/seed/repository ports；Step 8 Define/Capture/Propose协议；Step 9 definition/revision flows；Step 10 definition/baseline/revision states。 |
| `BuildCandidate` | `build.rs`、`guards.rs`、`states.rs` | `BuildIntent`、`BuildAttempt`、`BuildInputSnapshot`、`BuildOutcomeConclusion`、`CandidateImage`、`CandidateFormationGuard` | `BuildIntentCoordinator` / `build_service.rs` | Step 7 builder/registry/repository ports；Step 8 Request/Record及 conditional consumer carrier；Step 9 intent/attempt/outcome flows；Step 10 intent/snapshot/attempt/candidate states。 |
| `Qualification` | `qualification.rs`、`guards.rs`、`history.rs` | `ProvenanceBinding`、`GateEvaluation`、`EligibilityDecision`、`ArtifactHandoffRecord`、`ProvenanceCompletenessGuard`、`ApplicableGateGuard` | `QualificationCoordinator` / `qualification_service.rs` | Step 7 evidence/Artifact/repository ports；Step 8 Evaluate/Record handoff carrier；Step 9 qualification flows；Step 10 provenance/gate/eligibility/handoff states。 |
| `SupplyEntry` | `supply.rs`、`guards.rs`、`history.rs` | `AvailabilityTransition`、`InstantiableEntry`、`ConsumerHandoffGap`、`EntryPinGuard`、`AvailabilityTransitionGuard` | `AvailabilityCoordinator` / `supply_service.rs` | Step 7 supply/repository ports；Step 8 Publish/Transition/Rollback/Resolve carrier；Step 9 supply flows；Step 10 transition/entry/consumer gap states。 |
| `ReferenceDerived` | `reference.rs`、`guards.rs`、`history.rs`、`states.rs` | `ExternalReferenceSnapshot`、`ContractGap`、`ProjectionFreshness`、`ImageTraceRecord`、`ImageDerivedReadModel`、`ReferenceValidityGuard`、`ProjectionReadOnlyGuard` | `ReferenceIntakeCoordinator`、`ProjectionRebuilder` / `reference_service.rs`、`query_service.rs` | Step 7 projection/repository/source ports；Step 8 refresh/rebuild/reconcile/query carrier；Step 9 maintenance flows；Step 10 reference/gap/projection states。 |

主归属判定：各对象只在对应 `domain` module 有一份正式定义；view/read model 仍属 domain semantic marker，但其可重建存储和 builder implementation 属于 infra/application。`ArtifactHandoffRecord` 与 `ConsumerHandoffGap` 是本仓的边界记录，不是 Artifact 或 consumer truth；它们因而仍在本仓 domain 中拥有局部状态和历史语义。

### 5.5 Coordinator、port、repository、entry 主归属

| 主体 | 主归属 | 责任 | 明确不承担 |
|---|---|---|---|
| `DefinitionAssemblyCoordinator` | `application::definition_service` | 编排 definition/baseline/revision command与 local UoW | 不读取 mapping/component/seed body，不直接实现 adapter。 |
| `BuildIntentCoordinator` | `application::build_service` | 编排 trigger、snapshot、attempt和 outcome→candidate local decision | 不拥有 scheduler/builder/registry job truth，不盲重试 unknown。 |
| `QualificationCoordinator` | `application::qualification_service` | 编排 provenance、gate、eligibility 与 handoff gap | 不定义 evidence/policy/Artifact truth或 gate inventory。 |
| `AvailabilityCoordinator` | `application::supply_service` | 编排 publish/replace/rollback/retire、entry resolve与 history transition | 不创建 container、不判断 launch/health/consumer confirmation。 |
| `ReferenceIntakeCoordinator` | `application::reference_service` | 将 owner ref/snapshot/safe conclusion 变成 local validity/gap input | 不把 shadow当 source truth或反写核心阶段。 |
| `ProjectionRebuilder` | `application::reference_service` + `jobs::runners` | 以 committed truth驱动 read-only rebuild / freshness | 不修复/改写 definition、candidate、eligibility或 availability。 |
| `MappingReferencePort`、`ComponentReferencePort`、`SeedReferencePort` | `application::ports::external` | 以 opaque ref/snapshot/safe conclusion提供 DefinitionAssembly输入 | 不暴露 owner body或产生 compatibility success。 |
| `BuilderPort`、`RegistryPort` | `application::ports::external` | 交接 build attempt、解析 conservative output/ref conclusion | 不把 adapter ACK/presence变成 candidate。 |
| `EvidenceConclusionPort`、`ArtifactHandoffPort` | `application::ports::external` | 读取 safe evidence conclusion，或执行条件 handoff/gap recording | 不定义 gate authority、ArtifactVersion或 formal ref。 |
| `MemberServiceSupplyPort` | `application::ports::external` | 按 future consumer boundary提供 pinned entry/gap seam | 不获取或写入 host/container/launch/health truth。 |
| `DefinitionTruthRepositoryPort`、`BuildTruthRepositoryPort`、`QualificationTruthRepositoryPort`、`AvailabilityTruthRepositoryPort` | `application::ports::repositories` | 保存本仓 truth/histories，并支持 optimistic/UoW语义 | 不存外部正文、live state、raw log/report。 |
| `ProjectionRepositoryPort` | `application::ports::repositories` | 保存/读取可重建 read model、watermark、freshness | 不作为 core decision write source。 |
| application ports 的 concrete implementations | `infra::{repositories,projection_store,*_adapters}` | 承接 store、fake和 product-neutral external mapping | 不重定义 domain policy、owner或正向 readiness。 |
| Command / Query handlers | `api::{command_handlers,query_handlers,mappers}` | decode/validate/map并调用 application facade | 不直接 repo write、domain construction或 transport产品选择。 |
| conditional consumer handlers | `worker::{inbound_event_consumer,source_refresh_consumer}` | authority/dedup/receipt检查后调用 application | 不认定未闭口事件为 verified、不直接写 truth。 |
| operations runners | `jobs::{runners,bin/*}` | 在持久化 scope上运行nightly/refresh/reconcile/rebuild | 不拥有 scheduler，不生成run/evidence/readiness。 |

### 5.6 模块对外暴露与禁止暴露矩阵

| 模块 | 可暴露给 workspace 内调用方 | 禁止暴露 / 形成 |
|---|---|---|
| `contracts` | typed local IDs/refs、metadata、local command/query/job/event carrier、safe view/error/disposition | Role/mapping body、component/seed body、consumer exact manifest、Artifact formal ref、raw backend payload或 vendor SDK type。 |
| `domain` | local constructors、guards、transitions、state/disposition、`DomainError` | repository/adapter/config implementation、external DTO/SDK、clock/runtime、global ready、owner truth。 |
| `application` | use-case facade、port trait、UoW、idempotency/result semantic | concrete DB/bus/HTTP/builder/registry/evidence client、entry-specific transport state。 |
| `infra` | composition root、approved adapter/store/fake implementations | new business rule、gate pass、candidate/eligibility/availability成功断言、external owner body。 |
| `api` | transport-neutral handler/mapping surface | public external route/schema、direct persistence/domain write、authorization product policy。 |
| `worker` | conditional consumer/receipt mapping | active event topic、broker ACK/delivery truth、outbound publication或 direct mutation。 |
| `jobs` | bounded runner/action candidate、safe status mapping | scheduler lifecycle、unbounded retry、run_id/report/evidence/signoff或 owner truth repair。 |

### 5.7 模块依赖图：L2-member-images 模块实现主轴

```text
                         external owner / product boundaries
                  [runtime][event][ref][adapter][fake]
                                      |
                                      | verified / safe / gap only
                                      v
 +-------------+   call    +-----------------+   pure call   +-------------+
 | api         | --------> | application     | ------------> | domain      |
 +-------------+           | coordinators    |               | truth/guard |
                           | ports/UoW       |               +-------------+
 +-------------+   call    +--------+--------+                     ^
 | worker      | ------------------|                              |
 +-------------+                  | implements                   | typed carrier
                                  v                               |
 +-------------+   call    +-----------------+                    |
 | jobs        | --------> | infra           | -------------------+
 +-------------+           | stores/adapters |
                           +--------+--------+
                                    |
                                    | rebuild/read-only
                                    v
                           +-----------------+
                           | derived views   |
                           | freshness/gaps  |
                           +-----------------+

 +-----------------+
 | contracts        | ---> typed carriers used by all permitted modules
 +-----------------+
```

关键说明：

- `contracts` 是 carrier 依赖，不拥有 truth；箭头不表示 external consumer已经能直接依赖它。
- external input先经 verified/safe/gap boundary进入 application/infra；它不能直接写 domain，也不能因 adapter ACK升级为阶段成功。
- derived views从 committed local truth rebuild；其 fresh/stale/unavailable状态不能反向写 domain。图不表示 HTTP、broker、container、scheduler或部署拓扑。
- api、worker、jobs彼此不互调；它们只能使用 application facade与受限的 infra composition，且当前没有 outbound event线路。

### 5.8 依赖 / seam 归属与禁止方向

| 关系 | 主模块承接 | 依赖分类 | 当前上限 |
|---|---|---|---|
| L0-core shared carrier | contracts/domain/application (conditional) | `compile` | `MI-UP-004`未闭口，零 active path dependency；不得 shadow。 |
| Method Library mapping | DefinitionAssembly + ReferenceDerived | `runtime + ref` | owner identity/snapshot/gap；`MI-UP-003`下无 exact query/body。 |
| Runtime/Tools/Member components | DefinitionAssembly + ReferenceDerived | `ref`（适用 runtime） | opaque pinned release ref / compatibility gap；`MI-UP-002`下不猜 shape。 |
| policy/memory/workspace seed | DefinitionAssembly + ReferenceDerived | `ref + adapter` | static template ref/placement/gap；`MI-UP-006`下不存 semantic/live body。 |
| builder/registry | BuildCandidate + ReferenceDerived | `adapter + ref` | conservative outcome/ref/unknown；`Q-MI-003`下不绑定产品。 |
| evidence/gate/Artifact | Qualification + ReferenceDerived | `ref + adapter` | safe conclusion、handoff record/gap；`MI-UP-007`/`Q-MI-004`下无 formal ref/gate inventory。 |
| Member Service supply | SupplyEntry + ReferenceDerived | `runtime + ref + adapter` | pinned entry direction/gap；`MI-UP-001`下无 manifest/confirmation/launch contract。 |
| inbound build/source event | worker + application | conditional `event` | `MI-UP-005`下 rejected/unavailable；arrival不产生 intent/candidate。 |
| outbound build/publish event | none | absent / future | `MI-UP-009`下不创建 carrier、outbox、publisher、delivery state或job。 |
| test fake | infra + test support | `fake` | only parity/fail-closed test seam；不可进入production composition/truth。 |

### 5.9 Step 6 批次与 non-core 对象闭口决策

> 以下是进入 Step 6 后的执行计划，不是提前产生对象实现契约。每批均须先完成 capability→对象映射、对象能力→字段/函数/状态映射和模块内停审。

| 顺序 | 模块 / 对象组 | Step 6 是否必须正式闭口 | 理由 | Step 7+ 承接 |
|---:|---|---|---|---|
| 1 | `contracts` shared vocabulary、typed ref、metadata、state/disposition marker | 是 | cross-module public carrier和所有后续 DTO/port/flow的基础；但不是 sibling external contract | Step 8 完整 carrier schema。 |
| 2 | `domain::definition` / `assembly` / guards | 是 | DefinitionAssembly truth、pin/placement和 revision事实是后续所有 build input的唯一主语 | Step 7 reference/repository port；Step 9 definition flow。 |
| 3 | `domain::build` / guard | 是 | intent/attempt/snapshot/outcome/candidate必须独立拥有字段与 unknown恢复语义 | Step 7 builder/registry/repository port；Step 9 build flow。 |
| 4 | `domain::qualification` / guard | 是 | provenance/gate/eligibility/handoff gap是供给前置，必须保持 owner/authority分离 | Step 7 evidence/Artifact/repository port；Step 9 qualification flow。 |
| 5 | `domain::supply` / guard | 是 | availability/entry/consumer gap与history是本仓唯一local supply truth | Step 7 consumer/repository port；Step 9 supply flow。 |
| 6 | `domain::reference` / guard / read model | 是 | snapshot/gap/trace/freshness和read-only决定外部未知如何安全进入/展示 | Step 7 projection/source port；Step 9 refresh/rebuild flow。 |
| 7 | `application` coordinators、UoW/idempotency result carrier | 是（稳定 carrier部分） | service并非单纯后置：UoW/idempotency、stored/local result和coordinator input/output是对象/flow的唯一承接面 | Step 7 port trait，Step 8/9完整 protocol/flow。 |
| 8 | `infra` adapter state / blocked/fake / config carrier | 是（本仓稳定 carrier部分） | adapter availability、blocked disposition、fake parity与composition slot若无对象归属会在后续步骤临时补造 | Step 7 adapter trait/implementation；Step 14 config binding。 |
| 9 | `api` handler request/result mapper对象 | defer | external route、public schema与auth product未定；只在 Step 8获得local carrier后闭口 | Step 8 protocol、Step 9 handler flow。 |
| 10 | `worker` receipt / dedup / consumer wrapper | defer except local marker | inbound event family/schema未定（`MI-UP-005`）；Step 6只保留 shared metadata/conditional marker，不造 verified envelope | Step 7 port、Step 8 event schema、Step 9 consumer flow。 |
| 11 | `jobs` lease/cursor/report objects | defer except local job metadata | detailed job policy、persistence和report schema需随 port/protocol/flow共同收敛；不得提前生成run/report事实 | Step 7 technical port、Step 8 job schema、Step 9 job flow。 |

### 5.10 模块停审记录

| 模块 / capability | 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|---|
| `contracts` | carrier仅本仓/neutral，未替外部定义 | `pass` | Step 6收 shared vocabulary；Step 8才形成协议 schema。 |
| DefinitionAssembly | truth、pin、revision、外部 body边界 | `pass` | `MI-UP-002/003/006`仅允许 ref/gap，Step 7再定义 port。 |
| BuildCandidate | intent/attempt/snapshot/candidate分层、unknown隔离 | `pass` | `MI-UP-005`/`Q-MI-003`阻塞event/product正向 lane。 |
| Qualification | provenance/gate/eligibility/handoff分层 | `pass` | `MI-UP-007`/`Q-MI-004`阻塞 Artifact formal/gate inventory。 |
| SupplyEntry | availability/entry/gap与consumer/container分层 | `pass` | `MI-UP-001`阻塞exact consumer confirmation。 |
| ReferenceDerived | snapshot/gap/trace/freshness只读边界 | `pass` | 不可成为万能truth/repository；Step 7/9继续收口。 |
| `application` / `infra` | stable carrier闭口判断 | `pass` | 具体对象卡从Step 6按批次开始；port/adapter function留Step 7。 |
| `api` / `worker` / `jobs` | entry与产品/contract pending隔离 | `pass` | deferred对象只能在正确后续Step形成，当前不得借入口设定协议。 |

### 5.11 Step 5 粒度 / 格式校准声明

> 用户要求 Step 5～9 参考 `L1-governance` 的粒度和格式。参照只适用于详细设计的展开与审计方法：逐模块职责卡、文件/对象映射、逐对象/port/协议/flow 的独立小节、分批停审和跨项闭环；不复制其治理域对象、outbox、publisher、常驻 worker、外部产品、已闭合协议或正向结果。完整的 Step 5～9 适配基线见 `03_ddd_step_05_to_09_governance_granularity_alignment.md`。

### 5.12 七个技术模块独立职责卡

#### `contracts` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/contracts` / `member-images-contracts`（planned）。 |
| 对应概要设计主体 | 所有五 capability 的跨模块 typed carrier；02 §7 的 local Command / Query / conditional inbound event / Job / view 骨架。 |
| 主要责任 | 定义只在本 workspace 内复用的 typed ID/ref、metadata、reason/disposition、safe view 与 protocol error carrier；不得承载 domain invariant。 |
| 对外暴露 | workspace-internal carrier；将来仅在 owner contract 正式闭合后才可另行评估外部 surface。 |
| 允许依赖 | approved local serialization/error candidate；future formally approved Core carrier。 |
| 禁止依赖 | `domain`、`application`、`infra`、`api`、`worker`、`jobs`、sibling Rust crate、external SDK/type/body。 |

#### `domain` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/domain` / `member-images-domain`（planned）。 |
| 对应概要设计主体 | `DefinitionAssembly`、`BuildCandidate`、`Qualification`、`SupplyEntry`、`ReferenceDerived` 的 local truth、state、guard、history。 |
| 主要责任 | 定义对象构造、transition、guard、append/supersede history、read-only projection semantic marker 与 `DomainError`。 |
| 对外暴露 | object constructor/transition/guard/state/domain error，仅供 `application` 调用。 |
| 允许依赖 | `contracts`；future formally approved Core carrier。 |
| 禁止依赖 | repository、adapter、config、HTTP/RPC/bus、async runtime、SDK、scheduler、sibling、live state 和 owner truth。 |

#### `application` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/application` / `member-images-application`（planned）。 |
| 对应概要设计主体 | 五 coordinator、read-only query、conditional consumer 与 bounded job orchestration。 |
| 主要责任 | 编排 use case、caller-owned port、UoW、idempotency、local result/error mapping；保持 domain 与 concrete I/O 的反转依赖。 |
| 对外暴露 | service facade、repository/external/technical port trait、UoW/idempotency/result semantic、application error。 |
| 允许依赖 | `contracts`、`domain`；future formally approved Core carrier。 |
| 禁止依赖 | concrete DB/bus/HTTP/builder/registry/evidence client、`infra`、entry transport state、external positive contract。 |

#### `infra` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/infra` / `member-images-infra`（planned）。 |
| 对应概要设计主体 | local truth/history/projection/idempotency store、source/build/qualification/supply seam、config binding、composition 与 fake。 |
| 主要责任 | 实现 application-owned port；将外部/产品结果转换为 conservative local input、safe conclusion 或 gap；提供 blocked/fake parity。 |
| 对外暴露 | composition root、adapter/store/fake implementation、infra error。 |
| 允许依赖 | `contracts`、`domain`、`application`。 |
| 禁止依赖 | business decision、gate pass、candidate/eligibility/availability success assertion、owner body、`api`/`worker`/`jobs` 反向依赖。 |

#### `api` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/api` / `member-images-api`（planned logical entry）。 |
| 对应概要设计主体 | Command / Query intake 与 safe result/error mapping。 |
| 主要责任 | decode、basic validation、local carrier mapping 与 application facade call。 |
| 对外暴露 | logical handler/mapper boundary。 |
| 允许依赖 | `contracts`、`application`、approved infra composition。 |
| 禁止依赖 | public route/schema assumption、direct repository/domain mutation、authorization product policy、`worker`/`jobs`。 |

#### `worker` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/worker` / `member-images-worker`（planned conditional entry）。 |
| 对应概要设计主体 | `ConsumeVerifiedBuildRequest` 与 `ConsumeVerifiedSourceRefresh` 的 future conditional intake。 |
| 主要责任 | 在 authority、identity、version、dedup 与 receipt contract 正式闭合后，映射条件事件至 application；当前以 unavailable/rejected/gap 边界为准。 |
| 对外暴露 | conditional consumer boundary。 |
| 允许依赖 | `contracts`、`application`、approved infra composition。 |
| 禁止依赖 | active topic/broker/process truth、direct truth write、outbound publication、`api`/`jobs`。 |

#### `jobs` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/jobs` / `member-images-jobs`（planned operations entry）。 |
| 对应概要设计主体 | nightly intent、attempt/qualification/reference/handoff reconciliation 与 projection rebuild。 |
| 主要责任 | 对已持久化本仓 truth 运行 bounded action；结果只能形成 local status/gap/freshness/下一判断输入。 |
| 对外暴露 | typed action runner candidate。 |
| 允许依赖 | `contracts`、`application`、approved infra composition。 |
| 禁止依赖 | scheduler lifecycle、blind retry、run_id/report/evidence/signoff fact、owner truth repair、`api`/`worker`。 |

### 5.13 文件与代码主体映射（Step 5 责任视图）

> 本表不替代 Step 4 的 planned file layout；其作用是让后续 Step 6～9 能按模块直接定位对象、port、protocol与 flow 的唯一主归属。

| 模块 | Step 4 文件组 | Step 6 对象主归属 | Step 7 接缝 / Step 8 协议 / Step 9 flow 主归属 |
|---|---|---|---|
| `contracts` | `ids_refs.rs`、`metadata.rs`、`commands.rs`、`queries.rs`、`inbound_events.rs`、`jobs.rs`、`views.rs`、`errors.rs` | local typed carrier、shared disposition/reason、safe view/error | Step 8 local protocol DTO/view/error；不得生成 outbound event carrier。 |
| `domain` | `vocabulary.rs`、`definition.rs`、`assembly.rs`、`build.rs`、`qualification.rs`、`supply.rs`、`reference.rs`、`guards.rs`、`history.rs`、`states.rs`、`errors.rs` | 五 capability truth/guard/state/history/read-only marker | Step 7 不定义 infrastructure port；Step 9 被 application 调用。 |
| `application` | `facade.rs`、五 capability service、`query_service.rs`、`consumer_service.rs`、`job_service.rs`、`ports/*`、`unit_of_work.rs`、`idempotency.rs`、`errors.rs` | coordinator、operation context、UoW/idempotency/result helper | Step 7 port definition；Step 8 handler-facing operation contract；Step 9 orchestration flow。 |
| `infra` | `config.rs`、`runtime_builder.rs`、`repositories.rs`、`projection_store.rs`、`idempotency_store.rs`、`*_adapters.rs`、`clock_id.rs`、`fakes.rs`、`errors.rs` | adapter availability/blocked/fake/config carrier | Step 7 port implementation matrix；Step 9 only through application-owned port。 |
| `api` | `command_handlers.rs`、`query_handlers.rs`、`mappers.rs`、`errors.rs` | Step 6 only stable local entry marker if required; otherwise defer | Step 8 command/query mapping; Step 9 synchronous entry flow；route/product pending。 |
| `worker` | `inbound_event_consumer.rs`、`source_refresh_consumer.rs`、`errors.rs` | Step 6 only conditional local marker; verified envelope/receipt deferred | Step 8 conditional inbound contract; Step 9 authority/dedup flow；`MI-UP-005` pending。 |
| `jobs` | `runners.rs`、`errors.rs`、`bin/*.rs` | Step 6 only stable local metadata if necessary; lease/cursor/report detail deferred | Step 8 job contract; Step 9 bounded job flow；scheduler/run/evidence pending。 |

### 5.14 模块测试切口预告

> 正式测试 case、fixture、报告与 verdict 留给 Step 16、05、06；下表仅锁定后续可验证的模块契约方向。

| 模块 | 预告测试切口 | 验证的边界 |
|---|---|---|
| `contracts` | typed ref/metadata/disposition roundtrip、body-free safe view | 不泄漏外部正文或 domain-only type。 |
| `domain` | factory、guard、合法/非法 transition、append/supersede、unknown/fail-closed | definition/build/qualification/supply/reference 不串状态。 |
| `application` | use-case orchestration、idempotency replay/conflict、UoW rollback、query no-write | port 调用与 local truth/derived boundary正确。 |
| `infra` | fake/durable parity、blocked adapter mapping、config validation、composition slot | adapter outcome 不升级为 positive truth。 |
| `api` | input validation、safe mapping、application error mapping | handler 不直接持久化或构造 domain truth。 |
| `worker` | unauthorized/unsupported/duplicate conditional intake | arrival/ACK 不形成 intent/candidate；未授权时不写 truth。 |
| `jobs` | bounded scan/reconcile/rebuild/re-evaluate input validation | job 不修复 core truth，不伪造 run/report/evidence。 |

## 6. 正式文档回填草稿（暂不写入）

### 6.1 第 5 章《模块实现契约》草稿

正式 03 第 5 章应以 §5.1 技术模块总览、§5.2 五 capability主归属、§5.4对象/guard归属、§5.5 coordinator/port/repository/entry归属、§5.7 模块依赖图和§5.8 seam分类为主。正文应表明：业务 capability 是阶段性 truth的主轴，workspace member 是编译依赖边界；二者正交。任何 external contract未闭合时，contracts / port / adapter只能提供本仓 typed ref、safe conclusion、blocked/unavailable/gap 和 future reopen point，不能创建对端 positive schema或成功语义。

### 6.2 第 6 章《全局对象 / Trait / API 索引》承接草稿

正式索引须等 Step 6~8 完成后，只汇总已在模块内定义的对象、trait、Command/Query/Event/Job。当前 §5.4~§5.5 仅提供将来索引的归属，不应被提前装配为完整 object/port/API index。

### 6.3 第 16 章《详细设计到实施计划的承接》草稿

07 必须按 module/capability 与 commit boundary引用已完成的对象、port、protocol、flow和state calibration；不得仅用本 Step 模块摘要代替字段、schema或函数级设计。目标实现仓和所有 future boundaries保持 planned/blocked，直到03~07完整停审。

## 7. 待确认事项

- `MI-UP-001~009`、`Q-MI-001~004` 继续按§5.8影响相应 port/protocol/flow；本 Step 没有关闭任何 blocker。
- `MI-UP-004` 未闭合前，`contracts`虽有 workspace carrier职责，但不应被误认为对外共享 crate或激活 Core path dependency。
- `MI-UP-005` 未闭合前，worker 的消费对象、receipt和process activation都必须 defer，且没有outbound event补偿。
- `Q-MI-003` 未闭合前，infra中只有 product-neutral adapter slot与blocked/fake parity，不选择实现产品。
- Step 6 前不得因目录已定就把所有 application/infra/api/worker/jobs对象机械列为现有实现；必须按§5.9逐批判断并写完整字段来源/状态闭环。

## 8. 完成审计与停审门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 技术模块与五业务 capability 均有独立主轴 | `pass` | 双轴矩阵、防止机械 service/crate 映射已完成。 |
| 02 的 33 个正式对象 / guard均有唯一 domain 主归属 | `pass` | §5.4 覆盖五组对象；字段/函数契约仍留Step 6。 |
| coordinator、port、repository、adapter、entry归属明确 | `pass` | application拥有call-side contract，infra实现，entry只调application。 |
| compile/runtime/event/ref/adapter/fake分类保持 | `pass` | no active sibling Cargo path；外部exact合同未伪造。 |
| ReferenceDerived未升级为第二truth | `pass` | projection/read-only/rebuild/gap边界明确。 |
| non-core module对象闭口 / defer决策明确 | `pass` | Step 6将先收stable carrier，route/event/job schema按正确Step后置。 |
| 无outbound event、无实现/测试/evidence/readiness事实 | `pass` | 没有创建实际代码、Cargo、运行、报告或证据。 |
| 用户授权停点已满足 | `pass` | 本 Step 结束后仅允许等待用户确认，禁止创建Step 6或正式03。 |

```text
step_status = completed
gate_status = blocked
gate_reason = user_requested_stop_after_step_05
next_allowed_action = wait_for_explicit_user_confirmation_before_creating_step_06
formal_03_write_allowed = false
old_formal_03_read_allowed = false
implementation_allowed = false
commit_required = false
```
