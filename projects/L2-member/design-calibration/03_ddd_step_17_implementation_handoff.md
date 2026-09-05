# Step 17. 收口详细设计到实施计划的承接清单

> 项目：L2-member
> 对应 SOP：standards/document/详细设计讨论流程_SOP.md Step 17
> 对应书写规范：standards/document/详细设计书写规范.md §5.16
> 中间产物规范：standards/document/设计文档讨论中间产物规范.md §5.10
> 粒度 / 格式参考：projects/L1-governance/design-calibration/03_ddd_step_17_implementation_handoff.md。仅借鉴承接、复核和停审结构，不继承 Governance 的领域对象、事件、outbox、物理存储或实施结论。
> 回填目标：未来正式 projects/L2-member/03-详细设计.md §16。
> 状态：completed / pass_with_upstream_and_design_blockers / stop_review

本文件是详细设计到实施计划的校准中间产物，不是实现移交通过结论。不得据此创建实现仓、写代码、修改兄弟项目、生成测试或验收证据，亦不得提交 commit。

## 1. Step 状态

| 项 | 记录 |
|---|---|
| 当前 Step | Step 17：收口详细设计到实施计划的承接清单 |
| 前序门禁 | Step 1～16 均已形成独立中间产物并停审；Step 16 只规划验证切口，未执行验证 |
| 当前目标 | 将唯一真相源、实施前阅读、字段 / 协议 / 状态预复核、命名纪律和未闭合项整理为后续 07-实施计划.md 的可引用输入 |
| 当前范围 | 只写承接和跨文档预复核；不定义 phase、commit boundary、排期、任务拆分、代码批次、测试编号或验收编号 |
| 正式正文 | formal_03_write_allowed = false；旧 03-详细设计.md 仍仅为 historical material，本 Step 不修改 |
| 实现 / 提交 | implementation_repo_write_allowed = false；不创建 /home/aris/Projects/quantalithos-member，不写代码，不修改 sibling，不提交 |
| 停审方式 | 完成本文件、两层台账同步和静态自检后停在 Step 17；不创建 Step 18 文件 |

## 2. 本步目标、边界与使用规则

- 07-实施计划.md 只能引用正式 03 及本 calibration 链，不复制字段表、DTO 表、状态矩阵或函数级 flow，避免第二真相源。
- 24 个 outbound semantic candidate 在 L2M-UP-005 关闭前不是 Event；本 Step 不生成 event carrier、payload、source、subject、schema、route、topic、publisher、outbox 或 delivery 结论。
- Query 永远 no-write；matching duplicate 只能回放完整且匹配的 typed stored carrier；Unknown 是副作用栅栏，不得盲重试或升级为成功。
- runtime、event、ref、adapter、fake、persistence 关系继续分类，不得改写成 package dependency。
- 涉及测试、验收、证据、报告、artifact、verdict、signoff 或 readiness 的列只写“后续 05/06/07”，不写执行事实。

## 3. 本步输入

| 输入 | 状态 | 使用上限 |
|---|---|---|
| 03_ddd_step_01_upstream_boundary.md | completed | 固定新版 00/01/02 为输入；旧 03 只作污染诊断 |
| 03_ddd_step_02_scope.md | completed | 固定 CP01～CP07、P0、非范围和 owner |
| 03_ddd_step_03_constraints.md | completed | 固定 planned Rust、源码语言、git 和依赖分类 |
| 03_ddd_step_04_file_layout.md | completed | 固定 planned workspace、七个 library crate、无已锁定 binary |
| 03_ddd_step_05_module_contracts.md | completed | 固定七模块职责和 inward 依赖方向 |
| 03_ddd_step_06_object_contracts.md | completed | 固定 34 个 HLD 对象、support carrier、字段、factory、集合和 owner |
| 03_ddd_step_07_trait_port_adapter_contracts.md | completed | 固定 Store / resolver / handoff / technical Port、UoW、version 和 replay |
| 03_ddd_step_08_protocol_contracts.md | completed | 固定 10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job |
| 03_ddd_step_09_function_flows.md | completed | 固定 named service、UoW 顺序、local-first 和异常分支 |
| 03_ddd_step_10_state_matrix.md | completed | 固定 28 个状态主语、正式名称、合法 / reserved 边 |
| 03_ddd_step_11_persistence_transaction_consistency.md | completed | 固定逻辑 Store、append / successor、CAS、replay 和 fake parity |
| 03_ddd_step_12_error_recovery.md | completed | 固定错误层级、保守恢复、缺 carrier 和 commit-unknown |
| 03_ddd_step_13_concurrency_idempotency.md | completed | 固定 digest、relation、duplicate、conflict、re-entry 和 unknown fence |
| 03_ddd_step_14_configuration_external_bindings.md | completed | 固定 raw config 归属、validated ref、binding 类别和 unavailable 处理 |
| 03_ddd_step_15_observability_audit.md | completed | 固定 safe log / metric / trace / audit 和 redaction 边界 |
| 03_ddd_step_16_test_cuts.md | completed | 只提供后续 05/06/07 的 planned test cuts，不代表测试已执行 |
| standards/document/实施计划书写规范.md；实施计划讨论流程_SOP.md | 已读取 | 固定后续 07 的职责和 phase / commit 审计边界 |
| standards/coding/rust.md；目录组织规范；projects/README.md §8.2 | 已由 Step 3/4 承接 | 固定实施前编码、仓库、命名和提交检查 |

## 4. 分批写入记录

| 批次 | 内容 | 状态 |
|---:|---|---|
| 17.1 | Step 状态、目标 / 非目标、输入和 SOP 十二问 | completed |
| 17.2 | 目标仓基线、实施承接、阅读清单和检查清单 | completed |
| 17.3 | 真相源、字段、Command / Consumer / Job、Query、状态和 public carrier 复核 | completed |
| 17.4 | phase 预复核、命名 / 冲突审计、正反例、待确认项、回填草稿和停审门禁 | completed |

## 5. SOP 问题回答

| SOP 问题 | 本项目回答 |
|---|---|
| 哪些实现契约已经足够进入实施计划？ | Step 1～16 已形成范围、七模块、34 对象、Port、10/16/14/24/5 协议、flow、28 状态、逻辑持久化、错误、幂等、配置、观测和验证切口，足以被 07 引用；正式移交仍须等 Step 19 装配正式 03，并完成正式 04/05/06/07 |
| 实施者需要先阅读哪些材料？ | 见 §7；必须从正式 00/01/02、Step 1～19 calibration、正式 03、后续 04/05/06/07、Rust / 目录 / 实施计划规范和项目台账恢复，不能从对话、旧 README 或旧 03 开工 |
| 提交规范、git 用户、Rust 编码规范和注释规范是否列入？ | 已列入。未来实现仓项目级 git user.name 必须为 quantalithos-labs，git user.email 必须为 quantalithos.ai@gmail.com；commit 标题使用英文 type(scope): subject；标识符、rustdoc、普通注释和测试名默认英文。这里不表示仓库已经创建或配置 |
| 每个 Domain 必填字段是否能回指合法来源？ | §8.2 对 34 个对象逐项列出字段族、factory / 派生入口、禁止推断和缺失口径；精确 struct / enum 以 Step 6 object card 为唯一来源。L2M-DDD-003～007 与 scope_supersede_gap 仍未闭合，不能交给实现者补造 |
| 每个 Command / Event / Job 是否能构造目标对象？ | §8.3 覆盖 10 Command、14 Consumer、5 Job；24 outbound candidate 没有 Event 构造权，固定为 Blocked(L2M-UP-005)。缺失统一进入 reject / blocked / waiting / unknown / conflict，不从 current truth 重建 |
| 每个 Query 的 response / view / page / marker 是否闭合？ | §8.4 覆盖 16 Query 的 response、read source、surface、public ref / cursor；全部 no-write，不 reserve、refresh、rebuild、reconcile 或写 audit / result / projection |
| 状态、flow、测试和验收是否使用同一名称？ | §8.5 以 Step 10 的 28 个正式状态主语为唯一来源；Step 8 disposition、Step 9 trigger 和后续 05/06/07 必须复用这些名称，不得导入旧口语 alias |
| 当前 phase / commit boundary 是否依赖后续事项？ | 本 Step 不定义 phase 或 commit。§8.7 只给后续 07 的预复核规则：每个 boundary 必须基于届时正式 03/05/06/07，不能引用后续 boundary 才定义的类型、Port、状态、结果或证据 |
| 是否存在旧名、口语名或别名漂移？ | 有。旧 03 的 MemberRuntimePersona、ExposedCapability、ExecutionActorBinding、MemberVisibleSummary 主线以及 CloudEvents、AG-UI、UDS、launch token 等均为 historical material；§8.8 给出唯一新口径 |
| 哪些内容仍待确认、不得进入实施？ | L2M-UP-001～008、L2M-DDD-001～007、scope_supersede_gap、正式 03 装配、04/07 缺失、05/06 新基线复核和物理 Store / UoW 选择，见 §10 |
| 实施计划如何引用本文而不重复本文？ | 07 把本文件和正式 03 的章节作为阅读门禁、boundary input、暂停条件和回流入口；不复制 schema、flow、状态矩阵或测试表 |
| 本文是否给 07 的交付实现前审计提供输入？ | 是。§8 提供真相源、字段、输入构造、Query response、状态、二级传递类型、命名和 phase-boundary 预复核索引；07 仍须按届时正式 03/05/06/07 重做审计，本 Step 不是实施结论 |

## 6. 目标实现基线与实施承接

### 6.1 目标仓、语言和依赖

| 项 | 当前设计基线 | 不得误读为 |
|---|---|---|
| 目标实现仓 | /home/aris/Projects/quantalithos-member；当前不存在，见 L2M-DDD-001 | 已创建、已初始化或可写 |
| 语言 / edition | planned Rust 2024；最低兼容 Core 当前 rust-version 1.93 | 本机、CI 或目标仓工具链已验证 |
| workspace | planned contracts、domain、application、infra、api、worker、jobs 七个 library crate | 七个业务 CP 或七个进程 / binary |
| package / crate | member-<role> / member_<role>；无已锁定 binary | L2-member 或 l2_member 可进入代码标识符；transport / process topology 已确定 |
| 唯一 planned sibling Cargo dependency | core-contracts = { path = "../quantalithos-core/crates/contracts" } | member-specific Core event schema、route 或其它 sibling path dependency 已获准 |
| runtime / event / ref / adapter / fake | host、Runtime、Bus、image、identity、policy、Tool / Method、conversation、artifact、observability 等通过 Port、Consumer、typed ref、blocked seam 或 test-only fake | Cargo dependency、外部 positive outcome 或 source-owner truth |
| git / source convention | 实施前核验项目级 git user、英文 type(scope): subject、英文标识符 / rustdoc / 注释 / 测试名 | 当前设计仓或不存在的实现仓已经配置 / 提交 |

### 6.2 实施承接清单

| 承接项 | 唯一已定义位置 | 后续 07 如何使用 |
|---|---|---|
| 上游输入与历史材料纪律 | Step 1、project_execution_ledger.md | 只承接新版 00/01/02 和允许引用的上游材料；旧 README / 旧正式链只用于污染审计 |
| P0 范围与非范围 | Step 2、正式 00/01/02 | 保持 CP01～CP07 member-local / support / derived-read 边界，不实现外部 truth |
| 语言、仓库、依赖 | Step 3、4、14 | 每个未来 boundary 前检查 Rust、workspace、唯一 Core path 和依赖分类 |
| 七模块和方向 | Step 5 | 用 crate 表达 contracts → domain → application；infra 实现 Port；api / worker / jobs 只作入口和逻辑作业 |
| 对象、字段、factory、集合 | Step 6 | object card 是唯一 schema；ID、ref、time、resolution、reason、correlation、collection 按既定来源构造 |
| Port / Store / UoW / adapter | Step 7 | application 定义抽象，infra 实现；Store version、source version、watermark、cursor 不混用 |
| Command / Query / Consumer / Job | Step 8 | 按有限 typed body / result / receipt / report 和 selected-input source map 实现，不用 generic dispatch |
| 函数级处理流 | Step 9 | Non-Query 顺序为 validate → digest → reserve → local work → full typed carrier → complete → commit；Query 永远 no-write |
| 状态机 | Step 10 | 只调用已定义 factory / helper；repository 只保存 successor，不充当 state trigger |
| 持久化、一致性、replay | Step 11 | immutable append 与 versioned successor 分开；duplicate 读取完整 carrier，不从 current truth 重建 |
| 错误与恢复 | Step 12 | 区分 reject、blocked、waiting、unknown、conflict、missing carrier、commit unknown |
| 并发与幂等 | Step 13 | 使用 exact channel / operation / source / digest / result relation；Unknown inspect-first |
| 配置与外部绑定 | Step 14 | raw config 只在 infra；validated ref / blocked seam 不改变 owner、body-free、Query no-write 或 state invariant |
| 观测与审计 | Step 15 | 只记录 safe ref、有限 category 和 local outcome，不把 telemetry 当外部 truth |
| 后续验证入口 | Step 16 | 由 05/06/07 展开切口和门禁；本 Step 不补写 case、结果或证据 |

## 7. 实施前置阅读与检查

### 7.1 实施前置阅读清单

| 文档 / 材料 | 阅读目的 |
|---|---|
| projects/L2-member/design-calibration/project_execution_ledger.md | 恢复项目级状态、授权边界、blocker 和 next action |
| projects/L2-member/00-需求文档.md、01-架构设计.md、02-概要设计.md | 恢复需求、owner、数据归属、CP01～CP07、接口骨架和非范围 |
| projects/L2-member/design-calibration/03_ddd_calibration_flow.md 与 Step 1～19 文件 | 追溯正式 03 的装配来源及字段 / Port / flow / state 原始约束 |
| Step 19 后的 projects/L2-member/03-详细设计.md | 作为正式详细设计入口；Step 19 前旧 03 不得作为代码依据 |
| 后续正式 04-配置设计.md、05-测试方案.md、06-验收标准.md、07-实施计划.md | 恢复配置、验证、验收及 phase / commit boundary；当前不能假设其已完成 |
| standards/coding/rust.md | Rust 标识符、rustdoc、普通注释、测试命名与已发布编码规则 |
| standards/document/子项目目录与代码文件组织规范.md | 实现仓、workspace、package、crate、binary、tests 等布局 |
| standards/document/实施计划书写规范.md、实施计划讨论流程_SOP.md | 后续 07 的 phase、commit、暂停和提交纪律 |
| standards/document/设计真相源闭环与可落码性标准.md | 每个 boundary 前复核字段、DTO、state、Port、projection、phase 和回流规则 |
| projects/README.md §1.1 / §8.2 | design / implementation 仓边界、git user 和英文 commit message |

### 7.2 实施前检查清单

| 检查项 | 必须满足 | 未满足时处理 |
|---|---|---|
| 正式设计基线 | Step 19 装配后的正式 03 与 calibration source 一致 | 回到拥有真相源的 Step 修复，不按旧 03 或对话补造 |
| 下游文档链 | 正式 04/05/06/07 已按串行 SOP 完成相应设计 | 不开始实现；继续设计阶段 |
| 目标实现仓 | 在获授权的实现动作中核验 /home/aris/Projects/quantalithos-member | 保持 L2M-DDD-001；本 Step 不创建 |
| workspace / naming | 七个 planned crate、member-<role> / member_<role>、无未经裁决 binary | 暂停并回查 Step 4 / 5 |
| compile dependency | 只有 core-contracts 既定 local path；其它关系保持 runtime / event / ref / adapter / fake | 删除错误 package 假设并回查 Step 3 / 14 |
| source / code convention | git user、英文 commit 标题、英文源码 / rustdoc / 注释 / 测试名符合约束 | 在获授权的实现仓内修正后再进提交门禁 |
| blocker resolution | 当前 boundary 所需 UP / DDD / scope 项有正式闭合来源 | 标记 blocked / wait_design；不得用 fake、字符串、默认值或 local adapter 绕过 |
| phase / commit gate | 07 已给出正式 allowed scope、forbidden scope、前序依赖和回流入口 | 不自行定义或跳过 boundary |

## 8. 跨文档一致性预复核

### 8.1 真相源表

| 设计事实 | 唯一真相源 | 后续消费者 | 冲突处理 |
|---|---|---|---|
| 输入边界、历史材料、upstream blocker | Step 1、project_execution_ledger.md | Step 19、04/05/06/07 | 与旧 README / 旧 03 冲突时以当前 calibration 和正式上游为准 |
| 范围、非范围、CP01～CP07 owner | Step 2、正式 00/01/02 | 正式 03、07、05、06 | 不扩大到 Runtime、host、image、Tool、conversation 或外部 truth |
| Rust、目标仓、package、dependency category | Step 3、4、14 | workspace、04、07 | 冲突时暂停，不引入第二 path dependency |
| 模块职责与方向 | Step 5 | workspace / implementation boundary | Cargo 反向依赖或 CP-per-crate 回开 Step 4 / 5 |
| 34 对象、字段、factory、集合、owner | Step 6 | domain / application / 05/06/07 | 缺字段或私造 carrier 回 Step 6 |
| Port、Store、UoW、version、adapter parity | Step 7 | application / infra / entry / 07 | 不得由 adapter / fake 改写 application abstraction |
| public protocol、selector、replay carrier | Step 8 | contracts / api / worker / jobs | DTO 与 flow 不一致回 Step 8 / 9 |
| 调用顺序、异常和 side-effect fence | Step 9 | application / entry / 07 | 不调换 reserve、carrier、complete、commit |
| 状态名称、合法边、reserved 边 | Step 10 | domain / 05/06/07 | 不存在 helper 时拒绝并回流设计 |
| persistence、error、concurrency | Step 11～13 | application / infra / 05/06/07 | 保留 append、version、no-write、exact replay、Unknown fence |
| config、observability、验证入口 | Step 14～16 | 04/05/06/07 | 细节在各自下游展开，不在本表脑补 |

### 8.2 字段闭环表（34 个 HLD 对象）

精确 struct / enum 字段、optional 规则和 Rustdoc 以 Step 6 object card 为唯一来源。本表只确认必填字段族可回指到 entry、Port、factory 或已提交 local record；后续验证栏只指向 05/06/07。

| CP / 对象 | 必填字段族和来源 | 构造 / 派生入口 | 缺失安全口径 | 后续校验 |
|---|---|---|---|---|
| CP01 StartupAdmission | 双锚、startup context、credential ref、safe resolution、local ID / correlation；Command、ID / Clock、owner-safe source | AdmitMemberStartup → admission factory | 双锚 / credential / source 不可证明则 reject / blocked；不存 credential body | 后续 05/06/07 |
| CP01 MemberPresence | subject、accepted admission、start context、status、revision / correlation；admission Store + Command | EstablishMemberPresence 或合法 transition helper | admission 不成立、version 不匹配或第三主语则拒绝 | 后续 05/06/07 |
| CP01 HostCollaborationMaterial | presence、kind、purpose、safe status、ID / correlation；Command + committed presence | PrepareHostCollaboration material factory | 不从 host route、session、body、health 填充 | 后续 05/06/07 |
| CP01 HostCollaborationAttempt | material、boundary / resolution ref、attempt status、time、ID / correlation；material、resolver、Clock | host flow attempt factory / successor | host contract 未闭合只保留 blocked / waiting / unknown | 后续 05/06/07 |
| CP01 PresenceAdmissionPolicy | 双锚、startup / credential ref、safe resolution；纯 policy input | admission policy evaluation | 不读取 host lifecycle、secret 或 image state | 后续 05/06/07 |
| CP02 SubscriptionScopeDecision | subject、presence、typed scope、resolution、status、revision / correlation | Establish / ReplaceSubscriptionScope | scope / resolution 缺失 reject / blocked；Active → Superseded 受 scope gap 限制 | 后续 05/06/07 |
| CP02 InboundFactRecord | subject、authority / source refs、descriptor、inspection marker、intake disposition、ID / correlation | InboundFactConsumer | body / source / schema 不合格 reject / quarantine，不进 domain | 后续 05/06/07 |
| CP02 ScreeningDecision | inbound fact、rule resolution、safe reason、disposition、ID / correlation | inbound screening policy / factory | policy unknown / stale 不放行，不建本地 allowlist | 后续 05/06/07 |
| CP02 SubscriptionScopePolicy | scope、resolution、subject / presence precondition | establish / replace policy | 不从 display name、config 或 policy body 扩权 | 后续 05/06/07 |
| CP02 InboundScreeningPolicy | inspection marker、safe descriptor、rule resolution | inbound screening evaluation | 不读 / 留存 body；unknown 不解释为 permitted | 后续 05/06/07 |
| CP03 RuntimeDeliveryDecision | subject、screening、fact、Runtime boundary、resolution、disposition、ID / correlation | SubmitScreenedFactToRuntime decision factory | entry mapping 缺失则 local non-positive，不建 Runtime run | 后续 05/06/07 |
| CP03 RuntimeSubmissionAttempt | decision、boundary / material ref、attempt status、submission / unknown reason、time / correlation | submit flow 与合法 successor | Unknown 不盲重试或直接 link result | 后续 05/06/07 |
| CP03 RuntimeResultLink | attempt、owner-verified admission ref、classification、Runtime source、ID / correlation | LinkRuntimeAdmissionResult | 未验证 source / classification 则拒绝；不复制 outcome / plan body | 后续 05/06/07 |
| CP03 RuntimeMaterialReception | subject、safe material / outcome / source refs、digest / category、disposition、ID / correlation | RuntimeMaterialConsumer | source / body gate 失败不形成 reception | 后续 05/06/07 |
| CP03 RuntimeMediationPolicy | screening、boundary resolution、safe Runtime metadata | delivery evaluation | 不读 Runtime loop、context、plan、outcome 或 tool execution | 后续 05/06/07 |
| CP04 OutboundDecision | reception、target resolution、disposition、safe material precondition、ID / correlation | RuntimeMaterialReceptionConsumer | reception / target proof 缺失不 materialize 外部成功 | 后续 05/06/07 |
| CP04 MemberOutboundMaterial | decision、safe refs、redaction profile、digest、ID / correlation | outbound material factory | 不从 current truth / downstream body 补字段 | 后续 05/06/07 |
| CP04 PublicationAttempt | material、boundary / route resolution、attempt status、submission / gap refs、time / correlation | relay creation chain | L2M-DDD-004 未修复前不得自行补 prepared / gap 链 | 后续 05/06/07 |
| CP04 PublicationGap | local relation、reason、status、matching attempt / resolution refs、ID / correlation | formal gap factory / successor | 不新增 Unknown variant，也不从 new ref 凭空创建 | 后续 05/06/07 |
| CP04 OutboundMaterialPolicy | local decision、safe resolution、redaction / body-free guard | outbound material evaluation | 不产生 route、delivery 或 target acceptance truth | 后续 05/06/07 |
| CP05 InteractionTraceEntry | subject、purpose、committed predecessor / source refs、safe category、correlation、ID | MemberCommittedFactConsumer trace factory | 不复制 conversation、Runtime、Tool 或 full log body | 后续 05/06/07 |
| CP05 InteractionGap | trace relation、purpose、reason、status、successor / source refs、ID / correlation | trace gap factory / legal successor | 不用 Query、worker retry 或 fake 清除 gap | 后续 05/06/07 |
| CP05 ObservationMaterial | trace / safe source refs、safe digest / category、purpose、ID / correlation | observation material factory | 不存 observation backend / evidence body | 后续 05/06/07 |
| CP05 ObservationAttempt | material、boundary / resolution、status、submission / gap relation、time / correlation | observation relay flow / successor | L2M-DDD-005 未修复前不得私造 unknown-gap relation | 后续 05/06/07 |
| CP05 TraceMaterialPolicy | committed local refs、purpose、safe resolution | trace / observation evaluation | trace material 不解释为 observed / evidence truth | 后续 05/06/07 |
| CP06 ExternalContextSnapshot | owner typed source、context kind、scope、safe version / digest / category、ID / correlation | owner-specific resolver capture | 不存 owner body；无 stable proof 不假装 current | 后续 05/06/07 |
| CP06 ExternalContextResolution | snapshot、purpose、scope、status、safe summary / freshness、ID / correlation | resolve command / source update / refresh | 不变成 authorization、approval 或 health truth | 后续 05/06/07 |
| CP06 ExternalContextGap | source / purpose / scope、category、status、resolution relation、ID / correlation | gap factory / successor | L2M-DDD-006 未修复前不得直写 initial ResolutionPending | 后续 05/06/07 |
| CP06 MirrorResolutionPolicy | owner / kind / purpose / scope / freshness typed input | mirror evaluation | 不建立 generic resolver hub 或 owner-body cache | 后续 05/06/07 |
| CP07 MemberSummaryView | committed local facts、safe resolution、watermark / visibility、revision / ID | projection rebuild / append view | Query 不创建 / 修复 view，不从 external truth 反推 | 后续 05/06/07 |
| CP07 CapabilityOutletView | subject、safe capability refs、resolution / gap、projection state、revision / visibility | projection rebuild / outlet update | available ref 不等于 registry、authorization 或 invocation | 后续 05/06/07 |
| CP07 MemberProjectionState | projection kind、subject、status、watermark、reason / version | projection helper / successor | L2M-DDD-007 未修复前不得补 degraded / unknown / pseudo-version | 后续 05/06/07 |
| CP07 MemberDiagnosticView | committed local safe issue / ref、projection / visibility、revision / ID | projection rebuild / append view | 不泄露 raw error、config、secret、body 或 stack trace | 后续 05/06/07 |
| CP07 ReadProjectionPolicy | committed fact、resolution、visibility / freshness、projection state | query / rebuild read policy | 不让 Query 修复 source、gap 或 projection | 后续 05/06/07 |

### 8.3 Command / Consumer / Job 到 Domain 构造闭环

“完整”表示当前设计给出 DTO / source map、目标 local carrier、Port / factory 和 conservative missing branch；不代表物理实现存在，也不解除 blocker。

#### 10 Command

| Command | 目标对象 / carrier | 构造链 | 缺失 / 冲突处理 |
|---|---|---|---|
| AdmitMemberStartup | StartupAdmission + typed result / rejection | body → 双锚 / credential source → admission policy / factory → same-UoW carrier | invalid anchor / credential / source → reject / blocked |
| EstablishMemberPresence | MemberPresence | accepted admission read → presence factory → versioned save / carrier | missing / non-accepted admission → reject |
| TransitionMemberPresence | MemberPresence successor | same-Store Versioned<T> → named transition helper → successor save | illegal state / version conflict → reject / conflict |
| PrepareHostCollaboration | HostCollaborationMaterial + HostCollaborationAttempt | committed presence → material / attempt factory → local save | host contract absent → blocked / waiting / unknown |
| EstablishSubscriptionScope | SubscriptionScopeDecision | presence + CP06 resolution → scope policy / factory → append / result | missing resolution / invalid scope → reject / blocked |
| ReplaceSubscriptionScope | scope successor | decision version + CP06 resolution → replacement chain | scope_supersede_gap；不得自造 supersede helper |
| SubmitScreenedFactToRuntime | RuntimeDeliveryDecision + RuntimeSubmissionAttempt | screening + inbound fact + boundary resolution → decision / attempt factories | L2M-UP-003/004 → local non-positive；不建 Runtime run |
| LinkRuntimeAdmissionResult | RuntimeResultLink | versioned attempt + verified admission ref → link factory | unknown / source mismatch → reject / waiting |
| ResolveExternalContext | snapshot + resolution or gap | typed source / owner / purpose / scope → owner resolver → mirror append | unavailable / stale / conflict → gap / blocked / waiting |
| RequestExternalContextRefresh | refresh relation + ExternalContextGap | explicit source / purpose / scope → request relation / lawful gap path | L2M-DDD-006；不得绕过 factory |

#### 14 Consumer

| Consumer | 目标对象 / carrier | 构造链 | 缺失 / 冲突处理 |
|---|---|---|---|
| HostFeedbackConsumer | feedback link / late classification receipt | verified source + local attempt → Host service → typed receipt | missing relation → rejected / blocked；不改 host health |
| InboundFactConsumer | InboundFactRecord + ScreeningDecision receipt | source / inspection marker → inbound policy / factory → receipt | body / schema / rule defect → reject / unsupported / blocked |
| RuntimeMaterialConsumer | RuntimeMaterialReception receipt | safe Runtime refs / metadata → reception factory → receipt | no formal source mapping → blocked / waiting |
| DeliveryFeedbackConsumer | publication successor / gap receipt | feedback ref + attempt → legal successor | mismatch / unknown → conservative receipt；不 claim delivery |
| ObservationFeedbackConsumer | observation successor / gap receipt | feedback ref + attempt → legal successor | mismatch / unknown → conservative receipt；不 claim observed |
| SubjectIdentityContextUpdateConsumer | CP06 snapshot / resolution / gap receipt | owner source → Identity resolver → mirror append | third subject / stale source → reject / gap |
| PolicyContextUpdateConsumer | CP06 policy resolution / gap receipt | owner source → Governance safe resolver → mirror append | L2M-UP-007 → blocked / waiting；不存 policy body |
| RuntimeBoundaryContextUpdateConsumer | CP06 Runtime mapping resolution / gap receipt | boundary + entry contract refs → Runtime resolver → mirror append | L2M-UP-003/004 → blocked / waiting |
| CapabilityContextUpdateConsumer | CP06 capability resolution / gap receipt | safe Tool / binding / Method refs → owner resolver → mirror append | absent / unknown ref → gap；不建 registry |
| HostRouteContextUpdateConsumer | CP06 host-route resolution / gap receipt | host boundary / route ref → host resolver → mirror append | L2M-UP-001/005 → blocked；不建 route truth |
| RuntimeMaterialReceptionConsumer | OutboundDecision / material / continuation receipt | committed reception + target resolution → outbound factory chain | invalid reception / target → reject / blocked；L2M-DDD-004 保留 |
| MemberCommittedFactConsumer | InteractionTraceEntry / gap receipt | committed fact + ordered predecessors → trace factory | missing proof / relation → blocked / waiting；不扫描任意 Store |
| MemberProjectionUpdateConsumer | projection-state successor receipt | committed fact + target watermark → affected-state read → legal successor | missing source / version conflict → conservative receipt |
| CapabilityOutletSourceUpdateConsumer | outlet projection-state successor receipt | CP06 resolution / gap + safe refs → affected-state read → legal successor | absent proof → not-available / blocked；不产生 invocation |

#### 5 Operations Job

| Job | 目标对象 / carrier | 构造链 | 缺失 / 冲突处理 |
|---|---|---|---|
| PublicationRelay | PublicationAttempt / PublicationGap + MemberJobReport | finite refs → local Store → route / handoff Port → legal successor / report | L2M-DDD-004 或 external unknown → 不自造路径、不盲重试 |
| ObservationRelay | ObservationAttempt / InteractionGap + MemberJobReport | finite refs → Store → boundary Port → legal successor / report | L2M-DDD-005 → 不造 unknown-gap relation |
| ExternalContextRefresh | snapshot / resolution / gap + MemberJobReport | existing relation → owner resolver / dispatch → immutable fact or legal gap successor | L2M-DDD-006 → 不写 unsupported initial state |
| MemberProjectionRebuild | immutable views / projection-state successor + MemberJobReport | committed facts + resolutions + watermark → policy → append / successor | L2M-DDD-007 → 不用 pseudo-version |
| GapReconciliation | read-side projection successor + MemberJobReport | finite local gaps / committed successors → affected-state lookup → legal stale / conservative successor | 不修复 CP04 / CP05 / CP06 source gap |

| 输入族 | 特别约束 |
|---|---|
| 24 outbound semantic candidates | 只有语义名称，没有可构造 Event / publisher / outbox carrier；固定 Blocked(L2M-UP-005)，重开 Step 8 / 9 / 14 后才能讨论 |

所有非 Query fresh path 都必须在同一 channel / operation / digest / result-kind relation 中保存完整 typed carrier；L2M-DDD-003 表明 Consumer source / context / receipt 构造仍需 targeted repair，不得用窄 source identity、默认 authority / schema 或 fake map 填补。

### 8.4 Query response / view 闭环表（16）

| Query | response / page carrier | 唯一 read source | non-positive surface 和 public ref / cursor 规则 |
|---|---|---|---|
| GetMemberPresence | MemberQueryResponse<MemberPresenceReadSurface> | PresenceStore / safe projection | NotVisible、NotReady、stale、unavailable；subject 来自 request，revision 不等于 Store version |
| GetHostCollaborationPosture | MemberPagedQueryResponse<HostCollaborationPostureView> | HostCollaborationStore | empty / not-visible / pending / stale / unavailable；cursor opaque |
| GetCurrentSubscriptionScope | MemberQueryResponse<SubscriptionScopeReadSurface> | SubscriptionScopeStore | 无合法 scope 是 NotAvailable，不是 empty |
| GetScreeningDisposition | MemberQueryResponse<ScreeningDecisionReadSurface> | InboundStore + safe trace marker | not-visible / source pending / rule stale / unavailable；不 materialize body |
| GetRuntimeMediationPosture | MemberQueryResponse<RuntimeMediationReadSurface> | RuntimeMediationStore | not-visible / result pending / mapping stale / unavailable |
| GetRuntimeMaterialReception | MemberQueryResponse<RuntimeMaterialReceptionReadSurface> | RuntimeMediationStore | not-visible / reception pending / source stale / unavailable |
| GetOutboundDecision | MemberQueryResponse<OutboundDecisionReadSurface> | OutboundStore | not-visible / target pending / stale / unavailable；无 downstream conclusion |
| GetPublicationPosture | MemberPagedQueryResponse<PublicationPostureView> | Outbound / continuation Store | empty / not-visible / pending / stale / unavailable；attempt / gap ref 仅 local |
| GetInteractionTrace | MemberPagedQueryResponse<InteractionTraceEntry> | InteractionTraceStore | empty / not-visible / pending / stale / unavailable；不含外部 log body |
| ListInteractionGaps | MemberPagedQueryResponse<InteractionGap> | InteractionTraceStore | empty / not-visible / pending / stale / unavailable；filter 只用正式 status / purpose |
| GetObservationPosture | MemberPagedQueryResponse<ObservationPostureView> | InteractionTraceStore | empty / not-visible / material pending / feedback stale / unavailable；不 claim observed / evidence |
| GetExternalContextResolution | MemberQueryResponse<ExternalContextResolutionReadSurface> | ExternalContextMirrorStore | not-visible / resolution pending / source stale / unavailable；按 typed source / purpose / scope 选择 |
| ListExternalContextGaps | MemberPagedQueryResponse<ExternalContextGap> | ExternalContextMirrorStore | empty / not-visible / projection pending / stale / unavailable；不扫描 owner source |
| GetMemberSummary | MemberQueryResponse<MemberSummaryView> | ProjectionStore + visibility basis | NotReady / degraded / stale / unavailable；view revision / watermark 不等于 Store version |
| GetCapabilityOutlet | MemberQueryResponse<CapabilityOutletView> | ProjectionStore + committed CP06 safe refs | not-visible / pending / stale / gap / unavailable / empty；available ref 不授权 invocation |
| GetMemberDiagnostics | MemberQueryResponse<MemberDiagnosticView> | ProjectionStore + safe trace / mirror refs | empty 仅在明确可见时允许；pending / degraded / stale / unavailable 分离 |

16 个 Query 全部只调用 named read Port / policy mapper：不生成 digest、不 reserve、不读取或保存 stored result、不 append trace / audit、不调用 resolver / handoff、不 refresh、不 rebuild、不 reconcile。

### 8.5 状态闭环表（28 个状态主语）

| 状态主语 | 正式来源与实现入口 | 开放项 / 禁止扩展 |
|---|---|---|
| StartupAdmissionDisposition | Step 10 §9.1；admission factory | 不原地升级为 positive admission |
| MemberPresenceStatus | Step 10 §9.2；transition helper + expected Store version | heartbeat / host health / Query 不能触发 |
| HostCollaborationAttemptStatus | Step 10 §9.3；attempt factory / feedback successor | local attempt 不等于 host accepted |
| SubscriptionScopeStatus | Step 10 §10.1；establish / replace helper | Active → Superseded 保留 scope_supersede_gap |
| InboundIntakeDisposition | Step 10 §10.2；inbound fact factory | raw body / Query 不 reclassify |
| ScreeningDisposition | Step 10 §10.3；screening policy / factory | unknown policy 不变 permitted |
| RuntimeDeliveryDisposition | Step 10 §11.1；decision factory | eligibility 不等于 Runtime execution / acceptance |
| RuntimeSubmissionAttemptStatus | Step 10 §11.2；attempt successor | Unknown 不盲重试或 link result |
| RuntimeMaterialReceptionDisposition | Step 10 §11.3；reception factory | Query 不 reclassify；不存 Runtime body |
| OutboundDisposition | Step 10 §12.1；outbound decision factory | eligible 不等于 material / publication success |
| PublicationAttemptStatus | Step 10 §12.2；legal attempt successor | L2M-DDD-004 阻塞 prepared / unknown chain |
| PublicationGapStatus | Step 10 §12.3；formal gap helper | 无 Unknown variant，不得直写字段 |
| InteractionGapStatus | Step 10 §13.1；trace gap helper | 不擦除 history 或修 source gap |
| ObservationAttemptStatus | Step 10 §13.2；attempt helper | L2M-DDD-005 阻塞 unknown-gap invocation |
| ExternalContextResolutionStatus | Step 10 §14.1；immutable resolution factory | 不产生 foreign authorization / health transition |
| ExternalContextGapStatus | Step 10 §14.2；gap helper | L2M-DDD-006 阻塞 initial ResolutionPending shortcut |
| MemberProjectionStatus | Step 10 §15.1；projection helper / successor | L2M-DDD-007 阻塞 degraded / unknown / pseudo-version |
| MemberIdempotencyState | Step 10 §16.1；reservation / completion relation | Query 不 reserve；缺 carrier 不 rerun |
| MemberAdapterAvailabilityState | Step 10 §16.2；availability marker / degradation helper | 无 implicit recovery / external health inference |
| MemberRuntimeBuildState | Step 10 §16.3；infra builder | local assembly 不证明 container / image / host |
| BlockedSeamDisposition | Step 10 §16.4；blocked seam factory | 不 implicit dispatch / retry / ready |
| MemberApiHandlerDisposition | Step 10 §17.1；entry result factory | Query 不造 command result或写 local state |
| MemberConsumerEntryState | Step 10 §17.2；worker entry factory | non-ready 不 dispatch；不 bypass body gate |
| MemberWorkerRegistrationState | Step 10 §17.3；finite logical Consumer registration | 不是 listener / route / subscription lifecycle |
| MemberConsumerItemDisposition | Step 10 §17.4；typed receipt result factory | 不 claim broker ack、external success 或 rerun |
| MemberJobEntryState | Step 10 §17.5；five-kind entry factory | 不暗示 scheduler / process |
| MemberJobRunDisposition | Step 10 §17.6；typed result / report relation | 不 claim delivery / observation / source-current |
| MemberJobRegistrationState | Step 10 §17.7；finite logical registration | 不是 scheduled / running / retried lifecycle |

### 8.6 Public protocol 二级传递类型闭环

| protocol surface | outer carrier | 必须闭合的二级类型 | 归属 / 来源 | 缺失、duplicate、retry 红线 |
|---|---|---|---|---|
| Command input | MemberCommandRequest<T> | MemberCommandName、MemberSubjectAnchor、ActorContext、CommandMetadata、10 typed body | contracts；Step 8 §4～5 | name / body / 双锚 mismatch reject；不 generic dispatch |
| Command outcome | MemberCommandOutcome<T> | MemberWriteDisposition、MemberCommandAccepted<T>、MemberCommandRejection、MemberProtocolIssue、MemberOperationResultRef | contracts；Step 8 §4～5、§12 | duplicate 只 replay full typed carrier |
| Query input / response | MemberQueryRequest<T>、MemberQueryResponse<T>、MemberPagedQueryResponse<T> | MemberQueryName、subject、MemberVisibilitySurface、MemberPageRequest / MemberPage<T>、filters、16 views | contracts；Step 8 §4、§6 | 无 idempotency / digest / stored result；no write-through repair |
| external Consumer | MemberExternalConsumerEnvelope<T> | MemberConsumerName、MemberConsumerSource、DeduplicationKey、TraceId、10 typed inputs | contracts；Step 8 §7 | schema / source / body gate fail closed；L2M-DDD-003 open |
| committed-fact Consumer | MemberCommittedFactConsumerEnvelope<T> | finite name / source family、dedup / trace、4 typed inputs | contracts；Step 8 §7 | external 与 committed source 不可互换 |
| Consumer receipt | MemberConsumerReceipt | MemberConsumerDisposition、MemberConsumerReceiptDetail、safe issues、result ref | contracts；Step 8 §7、§12 | missing / wrong relation 不得重建 |
| logical Job | MemberJobRequest<T>、MemberJobApplicationResult | MemberJobMetadata、MemberOperationsJobKind、5 typed inputs、MemberJobRunDisposition、MemberJobReport | contracts；Step 8 §9、§12 | invocation ref 不是 scheduler run；duplicate 只 replay report |
| replay / relation | MemberStoredReplay + relation expectation | channel、operation、digest、result kind / ref、carrier-specific identity | application + contracts；Step 7/8/13 | mismatch / missing 是 consistency defect，不 retry / reconstruction |
| canonical digest | MemberCanonicalDigestInput | finite Command / Consumer / Job variants，stable refs / scope / version / watermark / cursor | application；Step 8 §11、Step 13 | 排除 body、secret、generated ID、time、route、run identity；Query 无 digest |
| outbound candidate | none by design | 只有 24 semantic names，无 secondary carrier | Step 8 §8；L2M-UP-005 | 固定 Blocked，不得 local alias 升格为 public Event |

### 8.7 Phase / commit boundary 预复核

本 Step 不定义具体 phase 或 commit。后续 07 必须把下表转为每个正式 boundary 的门禁；在此之前不得“先实现再补设计”。

| 预复核项 | 当前结论 | 07 必须补充 | 后续校验 |
|---|---|---|---|
| boundary identity | 未定义 | 唯一 ID、allowed / forbidden scope、前序依赖、设计回流入口 | 后续 05/06/07 |
| field / factory closure | 34 对象可回指；L2M-DDD-003～007 与 scope gap 未闭合 | 列出 boundary 涉及对象 / field / factory；遇未闭合项标 blocked / wait_design | 后续 05/06/07 |
| protocol / Port closure | 10/16/14/5 有 typed contract；24 candidate blocked | 只允许前置正式 carrier / Port，不带入后续 adapter / event / route | 后续 05/06/07 |
| state closure | 28 状态主语和 reserved edge 已命名 | 只调用已有 helper；reserved edge 先回流 | 后续 05/06/07 |
| persistence / replay | logical UoW、version、full carrier replay 已定义；物理 Store 未选 | 确定 Store / UoW authority；fake 不得成为 durable semantics | 后续 05/06/07 |
| external seam | host / Runtime / Core event / credential / policy / image 仍 open | 明确所需 upstream contract；缺少则不安排 positive integration | 后续 05/06/07 |
| validation / acceptance mapping | Step 16 只有切口，不产生结论 | 引用届时正式 05/06，不预写编号、结果或交付判断 | 后续 05/06/07 |

### 8.8 命名一致性、冲突与修正

| 名称 / 冲突 | 当前正式口径 | 禁止或待修正口径 | 处理方式 |
|---|---|---|---|
| 正向执行主语 | ProjectMemberRef + GlobalMemberRef，封装为 MemberSubjectAnchor | 单独 GlobalMemberRef、未定义 third / personal subject | L2M-UP-008 关闭前 fail closed |
| 实现仓 / crate | quantalithos-member、member-<role>、member_<role> | L2-member / l2_member 进入 package、crate、module、type、function、test | Step 4 / 5 为唯一来源 |
| 业务对象主线 | StartupAdmission、MemberPresence、scope、screening、Runtime / outbound / trace / mirror / projection objects | historical MemberRuntimePersona、ExposedCapability、ExecutionActorBinding、MemberVisibleSummary | Step 19 只能从 Step 5～16 装配 |
| protocol counts | 10 Command、16 Query、14 Consumer（10 external + 4 committed-fact）、24 blocked candidate、5 Job | 24 candidate 计为 Event、generic Consumer、增设 Job | Step 8 inventory 为唯一分母 |
| Query surface | MemberQueryResponse / MemberPagedQueryResponse + MemberVisibilitySurface | generic error 混淆 not-visible、not-ready、stale、degraded、unavailable、empty | Step 8 / 9 为准 |
| duplicate result | typed command carrier、MemberConsumerReceipt、MemberJobReport | current truth、shell、surface ref、fake map、error text | Step 7 / 8 / 11 / 13 为准 |
| Consumer source | full MemberConsumerSource；entry identity 不能替代 receipt source | 用窄 source identity 默认填 authority / schema / detail，或互换 source family | L2M-DDD-003 targeted repair |
| CP04～07 helper | 只用 Step 6 / 10 已存在 factory / transition helper | 直写 state、new_gap_ref、不存在 variant、pseudo-version | L2M-DDD-004～007 |
| historical transport / physical | transport-neutral logical entry / seam | CloudEvents、AG-UI、UDS、launch token、fixed port、supervisord、route / topic / ack lifecycle | 仅 historical material；需正式 authority 才能重开 |

## 9. 正反例

### 9.1 正确承接

实施计划中的一个 boundary 只引用：

- 目标：RuntimeSubmissionAttempt 的 local successor；
- schema / factory：正式 03 对象章节和 Step 6；
- Port / UoW：Step 7、Step 11；
- flow：Step 9 SubmitScreenedFactToRuntimeFlow；
- state：Step 10 RuntimeSubmissionAttemptStatus；
- 约束：Unknown 不重试，Runtime entry contract 未闭合则保守返回。

这样 07 只建立引用和门禁，不复制 schema；local attempt 仍与 Runtime execution / outcome 分离；缺失合同可以回流到命名 blocker。

### 9.2 错误承接

~~~text
实现 Runtime 交付后，如果没有 entry schema，就用 UDS + launch token 发送当前 screening 内容；成功即更新为 Runtime accepted。
~~~

错误原因：UDS、launch token、accepted 都不是当前正式 contract；该写法泄露 body，越过 L2M-UP-003/004/006，并把 member-local attempt 写成外部 truth。

### 9.3 Query 正确示例

~~~text
GetCapabilityOutlet 只读取 ProjectionStore 与已提交 CP06 safe ref，
返回 MemberQueryResponse<CapabilityOutletView> 的 visibility surface；
source / projection 不可用时返回既定 non-positive surface；
它不 reserve、不 refresh、不 rebuild，也不调用 Tool。
~~~

### 9.4 Phase boundary 错误示例

~~~text
第一笔提交先实现 Consumer，后面再决定 source / schema / receipt，
并在同一边界声称 24 个 member event 已可发布。
~~~

错误原因：L2M-DDD-003 与 L2M-UP-005 未闭合；boundary 依赖不存在的 carrier，并将 semantic candidate 误当 Event。正确处理是 blocked / wait_design。

## 10. 未进入实施的待确认项

| 项 | 当前影响 | 未确认前的处理 |
|---|---|---|
| L2M-UP-001 host registration / IPC / lifecycle / credential | CP01 host collaboration、feedback、entry binding | 只保留 typed ref / Port / blocked seam；不选 IPC、session、health 或 lifecycle |
| L2M-UP-002 image pinned release / manifest / entry compatibility | image supply、bootstrap / host assembly | 只持 ref / availability；不复制 image truth / build flow |
| L2M-UP-003 Runtime entry / trigger mapping | CP03 positive handoff | 无 Runtime run / client / trigger payload；blocked-aware Port only |
| L2M-UP-004 Runtime handoff / feedback / source family | Runtime material、outbound、observation | local attempt / gap / safe ref；不 claim delivered / observed |
| L2M-UP-005 member-specific event schema / route | 24 outbound semantic candidates | 不生成 event / envelope / publisher / outbox / route / topic / retry / delivery |
| L2M-UP-006 startup credential / identity anchor | admission / presence positive path | 双锚和 credential checks fail closed；不存 secret |
| L2M-UP-007 screening policy / taxonomy | inbound screening | 只消费 safe resolution；不建 local allowlist / default pass |
| L2M-UP-008 third execution subject | all positive member operations | 只接受 project member + global identity anchor |
| L2M-DDD-001 target repo absent | physical workspace / compile activity | 不在本 Step 创建实现仓 |
| L2M-DDD-002 physical Store / UoW / durability unselected | persistence / transaction implementation | 不选 DB / ORM / DDL / lock product |
| L2M-DDD-003 Consumer source / context / receipt gap | 14 Consumer exact replay / receipt | 不用默认 authority / schema / detail；先 targeted repair |
| L2M-DDD-004 CP04 prepared-attempt / gap chain | PublicationRelay positive / unknown path | 不制造 attempt / gap ref 或 selector path |
| L2M-DDD-005 CP05 observation unknown-gap relation | ObservationRelay unknown path | 不传 unsupported gap argument或 claim observation |
| L2M-DDD-006 CP06 refresh initial-gap helper mismatch | refresh Command / Job | 不创建 / 转换 unsupported ResolutionPending |
| L2M-DDD-007 CP07 helper / projection version mismatch | rebuild / reconciliation | 不用 store_version pseudo-version或 reserved transition |
| scope_supersede_gap | subscription replacement lifecycle | 不写 Active → Superseded，直到 domain helper 正式闭合 |
| formal 03 and downstream 04/05/06/07 | official implementation basis | 继续串行 design SOP；本 Step 不是 implementation start signal |

## 11. 正式 03 §16 回填草稿

> 校准来源：projects/L2-member/design-calibration/03_ddd_step_17_implementation_handoff.md。本段只供 Step 19 装配，本 Step 不修改正式 03。

### 16. 详细设计到实施计划的承接清单

正式 07-实施计划.md 必须以正式 03 为直接输入，并引用对应 design-calibration/03_ddd_step_*.md 作为字段级、Port 级、协议级、flow 级、状态级和配置级追溯入口；不得重复定义 34 个对象字段、10/16/14/24/5 协议、28 个状态主语或函数级 flow。

实施前必须：

1. 读取正式 00/01/02/03、03 calibration chain、Rust / 目录 / 实施计划 / 真相源规范和项目提交规范。
2. 在获授权的目标实现仓内核对 /home/aris/Projects/quantalithos-member、planned seven-crate workspace、唯一 Core path、git user、英文 commit 标题和英文源码 / rustdoc / 注释 / 测试名。
3. 保持 Query no-write、typed duplicate replay、Unknown side-effect fence、member-local truth 与 external truth 分离，以及 runtime / event / ref / adapter / fake 分类。
4. 触及 L2M-UP-001～008、L2M-DDD-001～007 或 scope_supersede_gap 时暂停并回流 owning design source；24 candidates 在 L2M-UP-005 关闭前不得物化。
5. 待正式 04/05/06/07 完成后，由 07 按 phase / commit boundary 复核正式 03/05/06/07；本节不替代该复核，也不声明 implementation start。

## 12. 完成门禁与停审结论

| 门禁 | 结论 | 依据 |
|---|---|---|
| Step 1～16 承接项可定位 | pass_for_design | §6.2、§8.1 回指唯一中间产物 |
| 实施前阅读与检查明确 | pass_for_design | §7 列出正式材料、规范、仓库、git、workspace、依赖和 boundary 检查 |
| 字段 / DTO / Consumer / Job 构造预复核 | pass_with_design_blockers | §8.2～§8.3 覆盖对象和协议分母，保留 L2M-DDD-003～007、scope gap |
| Query response / view 预复核 | pass_for_design | §8.4 覆盖 16 Query，保留 no-write 和 public carrier 规则 |
| 状态与二级 public carrier 预复核 | pass_with_design_blockers | §8.5～§8.6 覆盖 28 状态和二级类型，不闭合 reserved helper 或 event seam |
| phase / commit boundary 未越权 | pass_for_design | §8.7 不预写具体 phase / commit，只规定 07 输入和禁止项 |
| 命名 / historical pollution 审计 | pass_with_open_items | §8.8 记录唯一名称、旧名禁入和冲突修正 |
| 未进入实施事项明确 | pass_with_blockers | §10 保留全部 upstream / design / document-chain blocker |
| 正式 03、实现仓、代码、测试、证据、提交 | not_performed | 本 Step 未修改正式 03，未创建实现仓，未写代码、测试、artifact、report、evidence、verdict、signoff、readiness 或 commit |

Step 17 结论：completed / pass_with_upstream_and_design_blockers / stop_review。

当前应停止在 Step 17。下一动作只能是在用户既有授权有效且严格串行的前提下，读取 Step 18 SOP、书写规范、Step 17 和 L1-governance 同步材料后创建 Step 18 中间产物；正式 03 仍禁止修改，直到 Step 19 装配门禁。
