# L2-member-images 03 Step 5～9：参照 L1-governance 的粒度与格式校准

> 创建日期：2026-08-25  
> 状态：`completed_calibration_only`  
> 适用范围：`03-详细设计` Step 5～9 的中间产物与将来正式回填结构  
> 当前门禁：仍停在 `Step 5 / module_contracts / blocked`；本文不创建 Step 6～9，不装配正式 `03-详细设计.md`，也不解除任何用户确认门禁。

## 1. 校准结论与参照边界

用户要求 Step 5、6、7、8、9 参照 `L1-governance` 的粒度与格式。该要求被采纳为本项目详细设计的写作基线：继承其“逐模块、逐对象、逐接缝、逐协议、逐流程、逐批停审、最终跨项审计”的展开方法，不继承治理域的对象、协议、outbox、发布器、常驻 worker 或外部产品假设。

| 参照材料 | 本项目采用的内容 | 不可直接继承的内容 |
|---|---|---|
| `L1-governance/design-calibration/03_ddd_step_05_module_contracts.md` | 七技术模块主轴、模块独立职责卡、文件/对象/测试切口映射、业务组成部分与模块的交叉矩阵 | `Governance*` 领域对象、`core-contracts` 已激活依赖、outbox / publisher 线路。 |
| `L1-governance/design-calibration/03_ddd_step_06_object_contracts.md` | 先 shared vocabulary、再按模块与对象组分批；每个对象独立卡；字段来源、状态闭环与 Step 7 承接审计 | 治理对象字段、外部上下文正文、已确认的审计/报告实体。 |
| `L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | application 定义 port、infra 实现 port、按 repository / reference / idempotency / technical / external seam 分批、跨接缝审计 | publisher、archive、external GRC、outbox port 及其函数。 |
| `L1-governance/design-calibration/03_ddd_step_08_protocol_contracts.md` | 协议族批次表、每协议独立小节、DTO 构造闭环、二级公开类型审计、协议族停审 | 治理的 route/topic、事件 payload、outbound event 与 public contract。 |
| `L1-governance/design-calibration/03_ddd_step_09_function_flows.md` | 每接口独立 flow、ASCII 调用图、Rust 风格伪代码、事务/错误/状态/副作用/测试切口与跨 flow 审计 | accepted truth → outbox publish 模板；本仓目前无授权 outbound event。 |

适配红线：本项目只能把已停审的 `00/01/02` 与已正式闭口上游 owner 边界下沉为本仓实现契约。`L2-member`、`L2-member-service` 和所有未闭口上游仅能形成 typed ref、safe conclusion、`blocked` / `unavailable` / `gap` / future reopen point；不得因采用 L1-governance 的格式而补造对端 DTO、route、topic、digest、Artifact ref、consumer confirmation、build/publish result 或 readiness。

## 2. Step 5～9 的共同写作骨架

| 固定层次 | 必须包含的内容 | 停审要求 |
|---|---|---|
| 开工框架 | Step 状态、目标、已读输入、约束、可写上限、禁止事项 | 明确本 Step 不替后续 Step 预写字段、trait、DTO 或 flow。 |
| 分批计划 | 批次、覆盖范围、完成标准、状态；批次只控制写入节奏，不压缩必要细节 | 一个批次 / 模块 / 协议族 / flow 完成后先做局部停审。 |
| 可落码主体 | 按 Step 的正确粒度写模块、对象、port、协议或 flow；所有名称能回指前置 Step | 不以总清单替代独立主体卡片。 |
| 来源与边界 | 字段、状态、输入、外部 ref、错误和副作用的来源；owner、static/live、compile/runtime/event/ref/adapter/fake 分类 | 任何来源未闭口即显示为 pending/gap，不从名称或旧材料猜补。 |
| 跨项审计 | 重复命名、反向依赖、对象/port/protocol/flow 断链、状态和 phase boundary | 发现缺口必须回写正确的前置 Step 或列为 blocker，不能留给实现者自定。 |
| 回填与门禁 | 正式文档回填草稿、待确认事项、下一 Step 输入清单与进入条件 | 正式正文不回填过程批次和停审记录；用户门禁优先于 Step 自检通过。 |

## 3. Step 5 的对齐口径

Step 5 已采用七个技术模块与五个 capability 切片的双轴。为达到 `L1-governance` 的同等可审计粒度，Step 5 必须同时具备下表维度，而不是只有目录树或对象名单。

| `L1-governance` Step 5 维度 | L2-member-images 对应落点 | 当前处理 |
|---|---|---|
| 模块总览与依赖图 | 七模块总览、dependency/seam graph | 已在 Step 5 §5.1、§5.7 收稳。 |
| 每模块独立职责卡 | `contracts` 至 `jobs` 的职责、暴露、允许/禁止依赖、后续闭合点 | 本次补入 Step 5 §5.12。 |
| 文件与代码主体映射 | Step 4 的 planned file group 与每个模块的对象/port/entry落点 | 本次补入 Step 5 §5.13；Step 4 保持 exhaustive layout authority。 |
| 对象归属预告 | capability → domain object/guard → coordinator → Step 6～10 承接 | 已在 Step 5 §5.4、§5.5 收稳。 |
| 业务组成部分 × 模块矩阵 | 五 capability × 七技术模块 | 已在 Step 5 §5.2、§5.3 收稳。 |
| 模块测试切口预告 | 每模块的最小契约验证方向，不形成测试结果 | 本次补入 Step 5 §5.14。 |

## 4. Step 6：对象实现契约的计划粒度

Step 6 必须先建立文件骨架、写入批次状态表、模块执行顺序表和非 core 模块闭口/defer 决策；之后才可写对象卡片。对象卡片必须逐个包含 Rust 契约片段、字段类型/来源、成员函数签名、factory/静态函数、enum variant Rustdoc、状态来源/去向、不变量与禁止事项。不得把 02 的对象骨架或一个全仓大表当作完成。

| 批次 | 按模块/对象组的最小展开 | 本项目特别门禁 |
|---|---|---|
| 6.0 | Step 框架、shared vocabulary 盘点、执行顺序与写入门禁 | 先确认哪些 ref/type 能在本仓定义，不能 shadow Core 或 sibling truth。 |
| 6.1 | `contracts`：local typed id/ref、metadata、reason/disposition、safe view 的稳定 carrier | 不形成 Member Service、Artifact、Method Library、Runtime/Tools/Member 的 external public schema。 |
| 6.2 | `domain::definition` / `assembly` / guards：DefinitionAssembly 对象逐卡 | component/seed/mapping 只允许 ref、pin、placement、safe conclusion 或 gap。 |
| 6.3 | `domain::build` / guard：BuildCandidate 对象逐卡 | unknown、ACK、registry presence 与 candidate 必须分开；不选择 builder/registry 产品。 |
| 6.4 | `domain::qualification` / guard / history：Qualification 对象逐卡 | 不补 gate inventory、evidence body、Artifact formal ref 或 owner-side acceptance。 |
| 6.5 | `domain::supply` / guard / history：SupplyEntry 对象逐卡 | 不把 entry/availability 升级成 container、launch、health 或 consumer confirmation。 |
| 6.6 | `domain::reference` / guard / read model：ReferenceDerived 对象逐卡 | snapshot/gap/trace/freshness/read model 只读、可重建，不反写四条核心阶段 truth。 |
| 6.7 | `application` 的稳定 helper、operation context、UoW/idempotency/result carrier | 只闭合本仓稳定 carrier；具体 repository/external 方法留 Step 7。 |
| 6.8 | `infra` 的 adapter availability、blocked/fake/config/composition carrier | 不因 slot 存在而宣称 adapter、产品、运行环境或 readiness 存在。 |
| 6.9 | `api` / `worker` / `jobs` 的对象闭口决策与仅必要 local marker | route、topic、verified envelope、scheduler、run/report/evidence 细节按 Step 7～9 或后续 Step 承接。 |
| 6.10 | 高复用字段来源、对象组字段来源、状态闭环、Step 7 承接清单 | 每个未闭口 external field 都写 owner/blocker，不允许以 `TBD` 藏掉。 |

## 5. Step 7：Trait / Port / Adapter 的计划粒度

Step 7 必须逐模块而非先列一张无归属 port 总表。`application` 是 caller-owned repository/external/technical port 的定义处；`infra` 是其 concrete/blocked/fake 实现处；`contracts` 和 `domain` 不定义 infrastructure port；`api`、`worker`、`jobs` 只调用 application facade。

| 批次 | 需要逐项闭合的接缝 | 特别裁剪 |
|---|---|---|
| 7.0 | port 归属总览、shared application-local helper、写入门禁 | 不让 contracts 的 public carrier 依赖 domain-only type。 |
| 7.1 | technical port：Clock、ID、UnitOfWork、version/page/lease 等实际需要的 local helper | 只有 Step 6 已有对象能力或 Step 9 flow 需要时才定义，不能从 L1-governance 机械复制。 |
| 7.2 | Definition/Build/Qualification/Supply 的 truth/history repository 读取与写入面 | 每个 mutable save 的 expected version、UoW 与读取配对必须有来源。 |
| 7.3 | reference snapshot、projection/read model、trace、gap、idempotency/stored-result 等本仓需要的 port | projection/read model 不得变为 core truth write source；是否需要 durable trace/history store由 Step 6对象决定。 |
| 7.4 | Mapping/Component/Seed、Builder/Registry、Evidence/Artifact、Member Service supply 等 external seam port | 只返回/接收 body-free ref、safe conclusion、conservative outcome、gap 或 availability marker；不定义对端正向字段。 |
| 7.5 | infra adapter implementation matrix、blocked/fake parity、api/worker/jobs entry restrictions | 目前没有 PublisherPort、outbox port 或 outbound delivery port；不得为“格式完整”而创建。 |
| 7.6 | 模块停审、跨接缝闭环、Step 6 open-item closure、回填草稿 | 审计 reading surface、version 来源、public page/helper 归属、fake 不入 production composition。 |

## 6. Step 8：协议契约的计划粒度

Step 8 的 inventory 来自已停审 02 接口骨架；它用于安排逐协议审查，不预先宣布 transport、route、topic 或 external schema 已存在。

| 协议族 | 逐协议展开清单 | 当前边界 |
|---|---|---|
| Command（10） | `DefineImageVariant`、`CaptureAssemblyBaseline`、`ProposeVariantRevision`、`RequestBuildIntent`、`RecordBuildOutcome`、`EvaluateCandidateEligibility`、`RecordArtifactHandoff`、`PublishInstantiableEntry`、`TransitionAvailability`、`RollbackOrRetireEntry` | 每项独立 DTO/结果/字段来源闭环；外部 body 与 owner-side positive contract 保持 gap。 |
| Query（10） | `GetImageVariantDefinition`、`GetAssemblyDerivation`、`GetBuildTrace`、`GetProvenanceAndEligibility`、`ResolveInstantiableEntry`、`ListAvailableVariants`、`GetAvailabilityHistory`、`GetImageTrace`、`GetContractGaps`、`GetProjectionFreshness` | 每项独立 request/response view/page/freshness/gap surface；query 不写 truth。 |
| Inbound Event（2，conditional） | `ConsumeVerifiedBuildRequest`、`ConsumeVerifiedSourceRefresh` | `MI-UP-005` 未闭口前只能写 unavailable/rejected/blocked 口径与 reopen condition，不能发明 envelope、topic、verified payload 或 accepted receipt。 |
| Outbound Event（0） | 无 | `MI-UP-009` 未闭口；不创建 event DTO、outbox payload、publisher、delivery state 或 flow。 |
| Operations Job（6） | `RunNightlyBuildSweep`、`ReconcileBuildAttempts`、`ReevaluatePendingQualifications`、`RefreshExternalReferenceSnapshots`、`RebuildImageDerivedViews`、`ReconcileArtifactAndConsumerHandoffs` | 每项独立 input/output/status/idempotency contract；不生成 scheduler、run_id、report、evidence 或 execution fact。 |

每个协议小节必须沿用 L1-governance 的固定骨架：用途、函数签名/route/topic（若未获 authority则明确为未定义）、请求 schema、响应/event/job schema、字段→Domain 构造闭环、错误映射、幂等与审计要求。每一协议族结束后必须停审；最终还要审计公开二级类型、contracts/domain 依赖方向、名称映射、protocol-to-flow 覆盖和外部 body 边界。

## 7. Step 9：函数级处理流的计划粒度

Step 9 必须把 02 中合并表达的概要流拆回每个接口各一条独立 detailed flow。每条 flow 都要有入口与目标、ASCII 调用图、Rust 风格伪代码、事务边界、错误映射、状态与本仓允许的 history/trace/projection副作用、测试切口；其中每个对象方法、port 函数、DTO 和状态 enum 都必须回指 Step 6～8。不能从 L1-governance 复制 outbox/publish 路径。

| 批次 | 独立 flow | 共同红线 |
|---|---|---|
| 9.0 | command/query/conditional-consumer/job 的共享写作模板与 inventory | 模板只规定审查形状；实际 transaction、idempotency、history/trace/projection顺序必须由本仓 Step 6～8 契约决定。 |
| 9.1 | DefinitionAssembly 的 3 条 Command flow | mapping/component/seed 只经 approved ref/gap 接缝进入。 |
| 9.2 | BuildCandidate 的 2 条 Command flow | `accepted`、handoff、outcome、candidate、unknown 不合并；无授权 event 不触发 intent。 |
| 9.3 | Qualification 的 2 条 Command flow | eligibility、Artifact handoff、gate/evidence owner truth 分离。 |
| 9.4 | SupplyEntry 的 3 条 Command flow | local availability 不被写成 consumer/container success。 |
| 9.5 | 10 条 Query flow | 只读；empty/not-visible/stale/rebuilding/unavailable/gap 必须有可测试 surface。 |
| 9.6 | 2 条 conditional inbound consumer flow | 未闭口 authority 下只有拒绝/不可用/不写 truth 路径；若以后重开，accepted path 才能按 Step 8 已确认 envelope展开。 |
| 9.7 | 6 条 Operations Job flow | job 不修复 core truth，不假定 scheduler/product/run/evidence；未知或失败形成安全状态/缺口而非伪成功。 |
| 9.8 | 全部 flow 的 cross-flow audit | 检查 DTO→object→port→state→transaction/error/idempotency/test chain；明确无 outbound event flow 是设计结论，不是遗漏。 |

## 8. 通过条件与当前恢复点

| Step | 采用 L1-governance 粒度后的最低通过条件 |
|---:|---|
| 5 | 每个技术模块有独立责任卡、文件/对象/port/entry归属与测试切口预告；五 capability 与七模块的双轴不冲突。 |
| 6 | 每个对象可逐项落码，字段/函数/状态/来源闭合；non-core 闭口或 defer 显式；跨模块字段与状态审计完成。 |
| 7 | 每个接缝有 caller、implementation、读取面、写入/version/UoW 语义与边界；无反向依赖或无依据 port。 |
| 8 | 每个需要实现的协议有独立 schema/错误/幂等/对象构造闭环；没有把 pending external contract 写成 public surface。 |
| 9 | 每个已定义协议有独立可编码 flow；跨 flow 审计没有 unresolved chain，且 no-outbound boundary 保持一致。 |

当前恢复点不变：`03 / Step 5 / module_contracts / blocked / user_confirmation_required_for_step_6`。下一步仍必须等待用户明确确认后，才可创建 Step 6 文件并按本校准的 6.0 批次开始。
