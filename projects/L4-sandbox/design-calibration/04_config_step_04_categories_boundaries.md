# Step 4. 定义配置分类与禁止配置化边界

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 4
> 书写规范: `standards/document/配置设计书写规范.md` §5.4
> 回填章节: `04-配置设计.md` §4 配置分类与禁止配置化边界
> 生成日期: 2026-07-10
> 状态: reviewed_passed_to_step_5
> 所属流程: `04_config_calibration_flow.md`
> 本 Step 口径: 本步承接 Step 3 的 11 个控制面和 44 个配置域,定义配置类别、更新时机、禁止配置化项、逐域分类边界和跨分类审计。不得定义最终来源优先级、raw key、默认数值、环境矩阵、secret provider、加载函数、热更新实现、部署命令、产品选型、代码、测试结果、run_id、evidence alias、验收签署或 commit boundary。

---

## 1. Step 开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 4 | 是。Step 3 审查点后用户回复“同意”。 |
| 项目级台账是否允许进入 Step 4 | 是。原恢复点为 `04` Step 3 `pass_wait_review`;用户确认后门禁满足。 |
| 文档级 flow 是否允许进入 Step 4 | 是。`04_config_calibration_flow.md` 原记录 Step 4 `blocked_by_step_3`;用户确认后可进入。 |
| 是否已读取 Step 3 | 是。已复核唯一 raw config owner、validated assembly、11 个控制面、44 个配置域、CP-10 / CP-11 watch 和跨控制面审计。 |
| 是否已读取 Step 4 SOP / 书写规范 | 是。必须输出配置分类表、禁止配置化项表、逐域分类边界、停审记录和跨分类 / 禁止项审计。 |
| 是否已读取直接上游 | 是。重点复读正式 `03` §13 / §14、`03_ddd_step_14_config_external_binding.md` §8~§11 和 `03_ddd_step_15_observability_audit.md` redaction / audit 边界。 |
| 当前状态 | 已完成并经用户确认;已传递至 Step 5 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_04_categories_boundaries.md` |
| 停审方式 | 用户已完成本 Step 审查并确认进入 Step 5;Step 5 已独立完成并进入新的停审点 |
| 是否发现阻塞本 Step 的上游 blocker | 否。CP-10 exact sink carrier 和 CP-11 P2 overlay / reload 仍是后续 watch,不影响本步分类;当前不触发 `03` 回写。 |

---

## 2. 本步目标

在不改变 Step 3 owner 和详细设计契约的前提下,为所有配置域建立可执行的分类与更新边界,并把领域、安全、审计、事务和一致性不变量转译为不可被普通配置覆盖的 redline。

本 Step 只回答:

- 当前系统有哪些 startup、entry-local、worker / job-run-start、technical knob、sensitive ref、diagnostic / redaction、test fixture、feature 和 profile 配置类别。
- 哪些内容只能 cold update、new worker loop 或 new job run 生效,哪些只是当前 entry 的 typed selector。
- P0 是否存在核心 hot update,以及未来引入 reload 时必须回写哪些设计。
- 哪些 execution isolation truth、安全、审计、事务、一致性、幂等、handoff、cleanup 和 redline 规则禁止配置化。
- 禁止配置化项如需改变,必须回到哪一层正式设计和哪些下游文档。
- Step 3 的 44 个配置域分别适用哪些类别、明确不适用哪些类别、受哪些禁止项约束。
- 是否存在 P1 污染 P0、fake 污染 real-like、debug 放宽安全、feature 关闭核心闭环或分类 owner 冲突。

本 Step 不定义:

- code / JSON / env / secret / entry / fixture 的最终覆盖优先级与冲突规则;留给 Step 5。
- local / test / integration / staging / production-like 的逐项 profile 矩阵;留给 Step 6。
- raw key、类型、默认值、单位、必填性、secret 级别、validation message 和失败策略全集;留给 Step 7~11。
- runtime hot reload、last-known-good、动态 adapter replacement、tenant / region overlay 或 config center 实现。
- backend、store、bus、OTel、scheduler、secret provider 的产品选择和部署操作。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已完成并经用户确认 | 提供 11 个控制面、44 个配置域、允许 / 禁止能力、owner、`03` watch 和跨域审计。 |
| `projects/L4-sandbox/00-需求文档.md` §10~§14 | 正式需求基线 | 提供 coherent boundary、fail-closed、truth ownership、cleanup / redline、审计和验收否决项。 |
| `projects/L4-sandbox/01-架构设计.md` §9 / §11 / §13 / §15 | 正式架构基线 | 提供数据分层、依赖裁剪、no weak fallback、capture / handoff、no-rollback、派生不反写和配置不可越界。 |
| `projects/L4-sandbox/02-概要设计.md` §8~§11 | 正式概要基线 | 提供处理流、状态、异常和允许 / 禁止配置化轮廓。 |
| `projects/L4-sandbox/03-详细设计.md` §9~§14 | 正式直接上游 | 提供 flow、状态、事务、错误、幂等、配置 binding、audit 和 redaction 不变量。 |
| `03_ddd_step_14_config_external_binding.md` | 已完成详细设计中间产物 | 提供 raw config reader、config section、代码 binding、禁止配置化项、entry / worker / job 和 runtime builder 边界。 |
| `03_ddd_step_15_observability_audit.md` | 已完成详细设计中间产物 | 提供 audit 不可替代、safe log / metric、forbidden observability field 和 redaction 边界。 |
| `L1-governance` / `L1-artifact` Step 4 | 粒度参考 | 参考配置类别、更新边界、逐域停审和禁止项变更流程,不复制业务 truth 或配置项。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、配置 flow 和 Step 3。 | done | 确认用户已允许进入 Step 4。 |
| 2 | 读取 Step 4 SOP、书写规范 §5.4 和正式 `03` 状态 / 事务 / 配置 / 观测边界。 | done | 固定分类、更新时机、禁止项、逐域停审和跨分类审计为必出。 |
| 3 | 建立配置类别和更新时机模型。 | done | 10 类可配置类别 + 1 类 design boundary;P0 无核心 hot update。 |
| 4 | 从 `00/01/02/03` 提炼可判定的禁止配置化项。 | done | 每项含稳定 ID、原因、设计来源和正式变更流程。 |
| 5 | 对 D01~D44 逐域映射适用 / 不适用类别、更新边界和禁止项。 | done | 44 个配置域无遗漏,每域形成停审结论。 |
| 6 | 审计 hot / cold、P0 / P1、fake / real-like、feature / hard guard、diagnostic / redaction 和跨域 owner。 | done | 无 unresolved 分类冲突或具体 `03` 回写项。 |
| 7 | 输出回填草稿和 Step 5 handoff,更新三层状态。 | done | Step 4 完成后停审,不创建 Step 5 文件。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 当前系统有哪些启动配置、运行时配置、策略配置、敏感配置、调试配置 | 定义 `SBX-CAT-01~10`:startup assembly、safety boundary、entry-local typed selector、worker / job-run snapshot、technical operating knobs、sensitive ref、observability / diagnostic / redaction、deterministic fixture、peripheral feature enablement、environment / profile composition。另设 `SBX-CAT-00` static design boundary,它不是配置项。 |
| 哪些配置允许热更新 | P0 不允许任何核心 runtime hot update。entry-local selector 只影响当前启动入口,worker / job 参数只对新 loop / run 冻结生效,都不属于修改已装配 runtime snapshot 的 hot update。 |
| 哪些配置只能冷更新或启动读取 | source / profile、store、adapter、route、subscription、boundary、lease、policy source、capture、handoff、redaction、audit hook、feature gate 和 profile composition 必须 startup validate 后冻结;worker / job batch、parallelism、timeout、retry、cadence、scope 在新 loop / run 开始时冻结。 |
| 哪些安全、审计、事务、一致性或领域规则禁止配置化 | §9.3 定义 24 项禁止边界,覆盖 isolation truth、accepted 前置、environment identity、coherent boundary、no host-run、policy fail-closed、state / failure、UoW / audit / relay、idempotency replay、query no-write、consumer / job no-repair、protocol schema、capture / handoff、no-rollback、cleanup / redline、redaction、依赖裁剪、fake parity 和 feature scope。 |
| 禁止配置化项如需改变应走什么流程 | 普通配置审批、env override、profile、feature flag 或 emergency flag 均无权改变。必须先修改对应 `00/01/02/03` 正式契约并重新执行受影响 calibration Step,再同步 `04/05/06/07`;涉及产品取舍可补 ADR,但 ADR 不能绕过需求 / 架构红线。 |
| 每个配置域下哪些配置类别适用,哪些类别明确不适用 | §9.4 对 D01~D44 逐项给出适用类别、生效边界、不适用类别和禁止项。D44 当前只作为 `SBX-CAT-00` 演进触发,不是 P0 / P1 可加载配置。 |
| 每个禁止配置化项是否回指架构红线或详细设计不变量 | 是。§9.3 每项回指正式 `00/01/02/03` 或 Step 14 / 15 的具体边界族。 |
| 每个配置域分类边界完成后是否通过停审 | 是。44 个域均已确认分类、更新边界和禁止项;§9.5 按 11 个控制面汇总停审。 |
| 是否存在分类不一致或禁止项遗漏 | §9.6 已审计。当前无 unresolved 冲突;CP-10 exact carrier 和 CP-11 P2 reload 继续作为 watch,未被伪装为现有配置。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 3 配置域表 | 已写允许 / 禁止能力,但尚未统一配置类别和生效时机 | 建立稳定 category ID 和更新边界,逐域映射。 |
| `03` §13.2 / Step 14 config sections | 同时包含 startup binding、entry envelope、job knob、sensitive target 和 feature flag | 按语义分类,不改变字段或 constructor。 |
| P0 runtime 口径 | 未显式裁决 hot update,可能诱导实现侧增加 watcher / reload branch | 明确 P0 runtime snapshot 启动冻结,无核心 hot update。 |
| policy / boundary profile | “policy-like knob”可能被误解为本地 policy / allowlist truth | 只允许 freshness、timeout、retry、retention、batch 等技术 knob;policy truth 和 coherent guard 禁止配置化。 |
| feature / debug / test | 可能被用于关闭安全闭环、放宽 redaction 或把 fake 带入 real-like | 明确 feature 只控制外围能力,debug 不放宽安全,test fixture 不进入 real-like。 |
| retention / cadence | 数值可配置容易被误写成 cleanup 放行或 replay 删除语义 | 数值属于 technical knob,但 guard、对账和完整性前置不可配置。 |
| CP-10 / CP-11 watch | exact sink carrier 与 future reload 尚未锁定 | 保留 watch;不新增现有配置类别或 `03` carrier。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置类别 | 11 个控制面 / 44 个域,未统一类别 | 10 类可配置类别 + 1 类 static design boundary | 支撑 Step 5~7 一致引用。 |
| 更新时机 | 只有 source / profile / job 等零散线索 | startup、worker-loop-start、job-run-start、entry-local、design-time 五类;P0 hot runtime 为空 | 防止私造 reload。 |
| 禁止项 | 分散在 Step 3 和 `00/01/02/03` | 24 项稳定禁止边界,含变更流程 | 让 validation / test / acceptance 可承接。 |
| 配置域分类 | Step 3 只给允许 / 禁止能力 | D01~D44 全部给出适用类别、不适用类别、生效边界和禁止项 | 防止 Step 7 临时决定语义。 |
| P0 / P1 隔离 | product-neutral / fake / real-like 仅按 scope 区分 | 明确 P1 只能替换承载,不得污染 P0 guard;fake 不可成为正式执行 fallback | 保持 no weak fallback。 |
| `03` 影响 | Step 3 无回写,有两个 watch | 本 Step 仍无具体回写;watch 保持到 Step 7 / Step 13 | 不静默添加 carrier。 |

---

## 8. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| P0 是否支持核心 hot reload | A. 支持;B. startup snapshot 冻结 | 采用 B。当前 `03` 没有 reload、snapshot swap、in-flight consistency、rollback 或 last-known-good 契约。 |
| entry-local 参数是否属于 hot update | A. 属于;B. 只影响当前 entry / run | 采用 B。entry-local 不修改已装配 runtime config,也不得覆盖 typed DTO / global guard。 |
| policy-like knob 是否可改变 policy truth | A. 可以;B. 仅技术执行参数 | 采用 B。policy / allowlist / approval / high-risk taxonomy 由上游 owner 决定。 |
| boundary profile 是否可省略不支持维度 | A. 允许 best-effort;B. coherent or reject | 采用 B。resource / filesystem / network / process 必须整体可落实。 |
| feature flag 是否可关闭安全主链 | A. 可以;B. 只控制外围注册 / 传播 / 派生 | 采用 B。accepted、capture、audit、idempotency、cleanup、redline 和 redaction不由feature关闭。 |
| debug / local 是否可放宽 redaction / isolation | A. 可以;B. 与正式 guard 同语义 | 采用 B。调试只改变 safe diagnostic detail class,不开放 raw body或host-run。 |
| test fake 是否可作 real-like fallback | A. 可以;B. 仅 deterministic contract fixture | 采用 B。真实 backend缺失时拒绝,不得silent fallback。 |
| 禁止项变化是否只走配置审批 | A. 是;B. 正式设计变更 | 采用 B。配置审批不能修改 truth、状态、事务、安全或依赖红线。 |

---

## 9. 结构化中间产物

### 9.1 配置分类表

| Category ID | 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|---|
| SBX-CAT-00 | static design boundary | 非配置项;声明任何 source / profile / flag 都不能覆盖的正式不变量 | truth ownership、state / flow、coherent guard、no-write、no-rollback | 不适用 | 被伪装为配置后会绕过正式设计。 |
| SBX-CAT-01 | startup assembly / binding config | `infra/config.rs` 校验并由 runtime builder 冻结的 source、store、adapter、route和registry binding | profile ref、store ref、adapter ref、subscription / route binding | P0 不允许 | 运行中替换会破坏 UoW、adapter availability 和 in-flight 一致性。 |
| SBX-CAT-02 | startup safety / boundary config | 启动时校验并冻结的边界、安全和保守收束 profile / ref | boundary / limit、lease、cleanup guard、redline、high-risk profile | P0 不允许 | 错配可能放宽隔离、提前删除证据或解除 containment。 |
| SBX-CAT-03 | entry-local typed selector | 只选择当前 process / entry / job input 的 typed local 参数 | config path、profile selector、diagnostics mode、typed job input ref | 不属于 hot update | 若覆盖 global config或业务 scope,会绕过 validation / DTO。 |
| SBX-CAT-04 | worker-loop / job-run snapshot | 新 worker loop 或 job run 开始时冻结的执行包络 | batch、parallelism、timeout、retry class、scope、target availability snapshot | 仅新 loop / run 生效 | 中途变化会使 receipt / report 不可复核。 |
| SBX-CAT-05 | technical operating knobs | 只改变承载节奏、容量和 freshness / retention surface 的技术参数 | page / body limit、freshness、retention、retry、cadence、sampling class | startup 或新 run 冻结 | 被误用为领域 policy、cleanup release 或 replay semantic。 |
| SBX-CAT-06 | sensitive reference binding | 普通配置只保存 opaque ref;raw secret / credential 由安全设施解析 | credential ref、endpoint ref、target ref、transport binding ref | P0 不允许 raw value hot update | raw value 进入 config identity、log、audit、report 或 artifact。 |
| SBX-CAT-07 | observability / diagnostic / redaction config | 控制 safe sink seam、低基数标签、diagnostic surface 和 redaction profile | sink ref、sampling class、diagnostic retention class、deny list ref | P0 startup 冻结 | debug / sampling / sink 配置泄露 raw body或替代正式audit。 |
| SBX-CAT-08 | deterministic test fixture config | 仅供 local / CI contract test 的 fake、in-memory、fixed clock / id 和 failure injection | fake resolver、fake backend、fixture profile、deterministic clock | 仅测试 entry 生效 | 进入 real-like会伪造执行、事务、状态或外部成功。 |
| SBX-CAT-09 | peripheral feature enablement | 只控制外围 consumer、relay、derived / reconciliation 或handoff注册 | outbound / derived / reconciliation enablement | P0 startup 冻结 | 用于关闭核心 audit、capture、cleanup或redline。 |
| SBX-CAT-10 | environment / profile composition | 将 CAT-01~09 已定义语义组合成环境 profile,不重定义域语义 | local / test / integration / staging / production-like composition | P0 startup 冻结 | profile override hard guard、source priority或把fake带入real-like。 |

### 9.2 更新时机边界表

| 更新时机 | 允许内容 | 禁止内容 | 生效规则 |
|---|---|---|---|
| design-time | 修改需求、架构、协议、状态、事务、安全或依赖设计 | 作为 JSON / env / flag / profile 值加载 | 走正式设计变更、校准、实现和下游文档同步。 |
| startup / cold update | CAT-01 / 02 / 05 / 06 / 07 / 09 / 10 的 validated runtime snapshot | 启动后替换 store、adapter、route、boundary、redaction、audit hook或guard | process restart并完整validate后生效;invalid即拒绝启动 / 关闭相关entry。 |
| worker-loop-start | consumer / relay / fulfillment loop的batch、parallelism、retry、subscription snapshot | loop运行中改变schema、dedup、source authority或core semantics | 仅新loop实例生效;旧loop保持原validated snapshot。 |
| job-run-start | typed job spec、batch、parallelism、timeout、retry、scope和target availability snapshot | run中改变idempotency identity、mutation semantics、cleanup / redline guard | 新run冻结,结果通过既有report / receipt surface可复核。 |
| entry-local | config path、profile selector、diagnostics mode、typed input ref | 覆盖validated global值、改变actor / policy / visibility / idempotency或业务scope | 只影响当前入口;必须先转为typed selector再交给config owner / runtime handle。 |
| hot runtime update | 当前P0无允许项 | runtime snapshot swap、dynamic adapter replacement、tenant / region overlay、redaction relax、guard change | 未来需要时先回写 `03` reload / validation / rollback / audit / in-flight contract,再重新执行 `04`。 |

### 9.3 禁止配置化项表

| ID | 禁止配置化项 | 原因 | 设计来源 | 如需改变应走什么流程 |
|---|---|---|---|---|
| SBX-NCFG-01 | execution isolation truth ownership及外部truth边界 | sandbox只拥有execution isolation truth,不得吞并policy / runtime / member / tool / artifact / observability truth | `00` §11;`01` §9 / §11;`03` §13.5 | 修改`00/01/02/03` truth boundary并同步全链;配置审批无效。 |
| SBX-NCFG-02 | `ControlledExecutionContext::Accepted`及metadata / actor / responsibility / typed ref前置 | 防止entry、profile或worker绕过正式受理 | `00` §10;`03` §9 / §13.5 | 修改protocol、flow、state和acceptance gate。 |
| SBX-NCFG-03 | execution environment identity的来源、责任链和正式绑定语义 | config只绑定输入ref,不能生成identity / work / member / runtime truth | `00` C-SBX-1;`01` context / ownership;`03` flow / audit | 修改需求、对象、command flow和audit schema。 |
| SBX-NCFG-04 | resource / filesystem / network / process coherent boundary | 任一维度silent degrade都会破坏隔离成立条件 | `00` BR-SBX-006~010;`01` §13 / §15;`03` §13.5 | 修改需求 / 架构boundary和详细guard;必须重做安全测试 / 验收。 |
| SBX-NCFG-05 | host-run、弱隔离或unsupported backend fallback为formal success | 正式执行不得逃逸到宿主或弱后端 | `00` AC / veto;`01` no weak fallback;Step 14 §11 | 修改核心架构与验收红线;普通profile不可放宽。 |
| SBX-NCFG-06 | policy fail-closed、high-risk block及allowlist / approval truth外部归属 | missing / stale / conflicted / unsupported / unauthorized不得放行 | `00` BR-SBX-011~017;`01` policy boundary;`03` §13.5 | 修改policy契约、decision flow和上游owner;同步`05/06` negative gate。 |
| SBX-NCFG-07 | tools semantic execution、runtime agent loop、member lifecycle和runner product truth边界 | 防止sandbox成为相邻仓总控或第二真相源 | `00` §6 / §11 / §12;`01` scope / dependency | 修改全局依赖与项目边界,不得由adapter ref改变。 |
| SBX-NCFG-08 | domain state matrix、failure taxonomy和adapter outcome映射 | config或raw error string不能创造 / 改名正式状态 | `02` §9 / §10;`03` §10 / §12 | 修改state、error、flow和protocol mapping。 |
| SBX-NCFG-09 | UoW ordering、expected version、cursor、audit / relay / stored result原子性 | 防止partial visible、commit后补trace或publisher重建事实 | `03` §9 / §11 / §14 | 修改repository / UoW / flow契约并重做一致性测试。 |
| SBX-NCFG-10 | idempotency key族、request digest、duplicate stored replay和完整性guard | duplicate不得重跑;retention不得删除未对账surface | `03` §12 / §13;Step 14 §11 | 修改protocol、idempotency / result store和replay tests。 |
| SBX-NCFG-11 | Query no-write及query不得触发repair | 读取不能写truth、projection、reference、relay、audit或report | `02` query边界;`03` §9 / §11 / §14 | 修改query contract / flow,并显式评审是否应成为command / job。 |
| SBX-NCFG-12 | consumer / projection / derived / reconciliation / job no core truth repair | 后台入口不得绕过command gate成为隐式mutation | `02` §8~§10;`03` §9 / §13.5 | 修改entry taxonomy、service flow和truth ownership。 |
| SBX-NCFG-13 | event kind、schema、payload DTO、topic-neutral key、source cursor和receipt语义 | transport route只承载正式协议,不能重定义协议 | `03` §8 / §11;Step 14 §13 / §14 | 修改contracts、compatibility和event flow,再同步route配置。 |
| SBX-NCFG-14 | capture fact、candidate material、observability material、handoff fact与下游truth分层 | capture / delivery / receipt不等于artifact或observability正式truth | `00` C-SBX-4;`01` data ownership;`03` §9 / §14 | 修改需求 / 架构data layering和handoff protocol。 |
| SBX-NCFG-15 | relay publish / handoff failure no-rollback | 外围交付失败不能反写已提交source truth | `01` consistency;`03` §9 / §11 / §13.5 | 修改transaction / handoff / relay flow和恢复语义。 |
| SBX-NCFG-16 | lease / cleanup / reaper必须经过handoff / evidence / investigation / redline guard | 防止先删证据、误释放风险环境或到期即删除 | `00` BR-SBX-025~033;`01` cleanup redline;`03` §10 / §13.5 | 修改安全架构、guard matrix、state / flow及验收veto。 |
| SBX-NCFG-17 | redline containment不得disabled、advisory-only或由普通receipt自动解除 | 安全红线必须保守收束和显式调查 / release | `00` C-SBX-5;`01` §13 / §15;`03` §10 / §13.5 | 修改security lifecycle、investigation / release contract和`06` veto。 |
| SBX-NCFG-18 | accepted audit / trace、formal marker和source cursor链不可关闭或由log / metric替代 | 保证关键变化同UoW追溯且rollback不可见 | `00` audit NFR;`03` §11 / §14;Step 15 §11 / §12 | 修改audit object、UoW、flow和acceptance evidence要求。 |
| SBX-NCFG-19 | external body、raw config / secret / endpoint / topic、SDK response、process output、stack、SQL / HTTP body进入domain / log / audit / report | 保护body-free、敏感信息和跨仓truth边界 | `00` security / ownership;`03` §13 / §14;Step 15 §9.1 / §14 | 修改security / redaction设计并同步测试 / 验收;debug flag不可放宽。 |
| SBX-NCFG-20 | raw config唯一owner和application / domain / contracts不读runtime config | 防止配置解析渗入业务层或entry绕过validation | `03` §13.1;Step 14 §8 | 修改module / builder contract后重走`03`和`04`;不得临时读env。 |
| SBX-NCFG-21 | 仅`core-contracts`可编译期依赖,其他sibling / backend走runtime / event / handoff / fake | 保护全局依赖裁剪和L4隔离边界 | 全局依赖规则;`01` dependency;`03` §13.4 | 修改全局依赖规则和架构ADR;config不能生成Cargo dependency。 |
| SBX-NCFG-22 | fake / in-memory与durable / real-like遵守同一state、transaction、replay、redaction语义 | 防止测试成功掩盖正式路径失败或fake成为fallback | `03` §11~§16;Step 3 P0 / P1 | 修改adapter contract和parity tests;real-like不得silent降级。 |
| SBX-NCFG-23 | feature gate只控制外围注册,不得关闭accepted、capture、audit、idempotency、cleanup、redline或redaction | 防止bool开关改变核心成功和安全语义 | `01` config redline;`03` §13;Step 14 §10 / §11 | 修改需求 / 架构scope和service registration contract。 |
| SBX-NCFG-24 | P0 tenant / region overlay、runtime reload、dynamic adapter replacement和in-flight snapshot切换 | 当前`03`没有carrier、rollback、audit和一致性契约 | Step 2 P2;Step 3 D44;`03` §13 | 先回写`03` config snapshot / builder / flow / audit,再重开`04` Step 3~14。 |

### 9.4 按配置域组织的分类边界表

适用类别是闭集:只有“适用配置类别”列出的类别可在 Step 7 继续展开。未列类别默认不适用;“明确不适用”列额外标出最容易误混入的类别或更新方式。表内 `CAT-xx` / `NCFG-xx` 分别是 `SBX-CAT-xx` / `SBX-NCFG-xx` 的简写。`SBX-CAT-00` 只表示 design boundary,不能生成 raw key。

#### 9.4.1 SBX-CP-01 启动装配与配置身份

| Domain ID / 配置域 | 适用配置类别 | 生效边界 | 明确不适用 | 禁止项 / 原因 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D01 config source intake | CAT-01 / 03 / 08 / 10 | entry selector确定source后,只在startup loader生效 | CAT-04 / 09;hot runtime | NCFG-20 / 24:raw owner唯一,不得私造reload source | 通过 |
| SBX-CFG-D02 runtime profile / config identity | CAT-01 / 07 / 10 | startup生成redacted identity并冻结 | CAT-04 / 09;raw sensitive value | NCFG-19 / 20 / 24:identity不得含raw config / secret或动态切换 | 通过 |
| SBX-CFG-D03 startup validation | CAT-01 / 02 / 07 | builder前一次完整validation | CAT-03 / 04 / 09;warning-only bypass | NCFG-04 / 05 / 06 / 16 / 17 / 23:hard guard invalid必须拒绝 | 通过 |
| SBX-CFG-D04 runtime builder / adapter registry | CAT-01 / 09 / 10 | startup按validated refs装配并冻结 | CAT-03 / 04;dynamic replacement | NCFG-01 / 20 / 23 / 24:builder不创造truth或reload branch | 通过 |

#### 9.4.2 SBX-CP-02 入口与负载包络

| Domain ID / 配置域 | 适用配置类别 | 生效边界 | 明确不适用 | 禁止项 / 原因 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D05 sync API envelope | CAT-01 / 03 / 05 / 07 | body / page / timeout startup冻结;diagnostics selector仅当前entry | CAT-02 / 04 / 09;authorization override | NCFG-02 / 06 / 10 / 11 / 19:limit只能拒绝 / 截断,不能绕过guard | 通过 |
| SBX-CFG-D06 worker runtime envelope | CAT-01 / 04 / 09 / 10 | 新worker loop开始时冻结validated snapshot | CAT-03业务scope;hot runtime | NCFG-12 / 20 / 23:worker不直读repo、不创造core success | 通过 |
| SBX-CFG-D07 job runner envelope | CAT-03 / 04 / 05 / 10 | typed job input进入新run时冻结 | CAT-01动态全局覆盖 / 09核心mutation | NCFG-10 / 12:raw flag不替代job spec / idempotency,job不repair truth | 通过 |
| SBX-CFG-D08 feature assembly gate | CAT-01 / 09 / 10 | startup依赖完整后注册外围能力 | CAT-02 / 03 / 04;core feature disable | NCFG-23:不能关闭accepted / capture / audit / cleanup / redline / redaction | 通过 |

#### 9.4.3 SBX-CP-03 存储、事务与重复回放

| Domain ID / 配置域 | 适用配置类别 | 生效边界 | 明确不适用 | 禁止项 / 原因 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D09 truth / audit / UoW store | CAT-01 / 06 / 08 / 10 | startup选择同契约store / UoW并冻结 | CAT-03 / 04 / 09;hot swap | NCFG-01 / 09 / 18 / 22:承载不改变truth、原子性或audit | 通过 |
| SBX-CFG-D10 projection / derived store | CAT-01 / 06 / 08 / 10 | startup选择store;rebuild参数归D34 | CAT-03 / 09;query repair | NCFG-09 / 11 / 12 / 22:read / derived store不反写core truth | 通过 |
| SBX-CFG-D11 reference store | CAT-01 / 06 / 08 / 10 | startup选择body-free snapshot store | CAT-03 / 09;external body storage | NCFG-01 / 07 / 19 / 22:只保存ref / summary / freshness | 通过 |
| SBX-CFG-D12 relay store | CAT-01 / 06 / 08 / 10 | startup选择relay / payload snapshot store | CAT-03 / 09;payload reconstruction | NCFG-09 / 13 / 15 / 22:stored payload来源和no-rollback固定 | 通过 |
| SBX-CFG-D13 idempotency / stored surface store | CAT-01 / 05 / 06 / 08 / 10 | store startup冻结;retention按validated snapshot | CAT-03 / 09;disable replay | NCFG-10 / 22:duplicate必须返回stored surface且保持parity | 通过 |

#### 9.4.4 SBX-CP-04 外部语境、策略与能力摘要

| Domain ID / 配置域 | 适用配置类别 | 生效边界 | 明确不适用 | 禁止项 / 原因 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D14 context reference source | CAT-01 / 05 / 06 / 08 / 10 | startup绑定resolver;freshness snapshot在operation使用 | CAT-03业务truth / 09 | NCFG-01 / 03 / 07 / 19:source只返回body-free context refs / summaries | 通过 |
| SBX-CFG-D15 policy / authorization summary source | CAT-01 / 02 / 05 / 06 / 08 / 10 | startup绑定source / high-risk profile并冻结 | CAT-03 / 09;local policy truth | NCFG-06 / 07 / 19:policy truth外部拥有,missing / stale仍fail-closed | 通过 |
| SBX-CFG-D16 backend capability source | CAT-01 / 02 / 05 / 06 / 08 / 10 | startup绑定probe / fixture;freshness按validated snapshot | CAT-03 / 09;weak fallback | NCFG-04 / 05 / 08:capability不可支持时拒绝,不造domain state | 通过 |

#### 9.4.5 SBX-CP-05 隔离边界与执行后端

| Domain ID / 配置域 | 适用配置类别 | 生效边界 | 明确不适用 | 禁止项 / 原因 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D17 coherent boundary profile | CAT-02 / 05 / 08 / 10 | startup校验四维profile / template并冻结 | CAT-03 / 07 / 09;partial hot relax | NCFG-04 / 05 / 24:四维coherent,不支持即拒绝 | 通过 |
| SBX-CFG-D18 isolation backend lifecycle | CAT-01 / 02 / 06 / 08 / 10 | startup选择合规adapter,launch消费冻结binding | CAT-03 / 04 / 09;dynamic fallback | NCFG-04 / 05 / 08 / 22:无host-run / weak fallback,adapter outcome固定 | 通过 |
| SBX-CFG-D19 execution capture | CAT-01 / 02 / 05 / 06 / 08 / 10 | startup绑定adapter / material class;run内保持snapshot | CAT-03 / 09;raw output logging | NCFG-14 / 19 / 22:capture分层且失败不得伪成功 | 通过 |
| SBX-CFG-D20 backend handle / lease consumption | CAT-02 / 05 / 10 | 每次boundary establishment由generation-scoped backend adapter消费startup冻结的lease profile并保存有界window;run只校验持久化lease | CAT-01第二owner / 03 / 09;run重算window;force release | NCFG-16 / 17:lease owner仍在安全收束控制面,不得绕guard | 通过 |

#### 9.4.6 SBX-CP-06 事件接入、发布与 relay

| Domain ID / 配置域 | 适用配置类别 | 生效边界 | 明确不适用 | 禁止项 / 原因 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D21 inbound subscription / schema | CAT-01 / 04 / 05 / 06 / 08 / 09 / 10 | subscription startup绑定;新loop冻结batch / schema allowlist | CAT-03业务payload;schema hot accept | NCFG-02 / 12 / 13 / 19:transport不改DTO,unsupported须reject / quarantine | 通过 |
| SBX-CFG-D22 event publisher adapter | CAT-01 / 06 / 08 / 10 | startup绑定publisher并冻结 | CAT-03 / 09;error-to-state config | NCFG-08 / 13 / 15 / 22:publisher不定义event或回滚truth | 通过 |
| SBX-CFG-D23 topic-neutral route binding | CAT-01 / 06 / 08 / 10 | startup校验formal kind到transport route映射 | CAT-03 / 04 / 09;event semantics | NCFG-13 / 19:raw topic不进domain,route不改schema / cursor | 通过 |
| SBX-CFG-D24 relay delivery / retry / dead-letter | CAT-04 / 05 / 06 / 10 | 新relay loop / job run冻结batch、retry和target | CAT-03 / 09;source truth rollback | NCFG-10 / 13 / 15:duplicate不重建payload,DLQ不删source fact | 通过 |

#### 9.4.7 SBX-CP-07 材料、观测与调查交接

| Domain ID / 配置域 | 适用配置类别 | 生效边界 | 明确不适用 | 禁止项 / 原因 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D25 material handoff | CAT-01 / 04 / 05 / 06 / 08 / 10 | target startup绑定;新retry run冻结policy | CAT-03 / 09;artifact truth config | NCFG-14 / 15 / 19:receipt不升格truth,handoff失败不回滚capture | 通过 |
| SBX-CFG-D26 observability material handoff | CAT-01 / 04 / 05 / 06 / 07 / 08 / 09 / 10 | target / safe material startup绑定;new run冻结 | CAT-03;observability store truth | NCFG-14 / 15 / 19:只交接safe refs,不保存ledger body | 通过 |
| SBX-CFG-D27 investigation handoff | CAT-01 / 02 / 04 / 05 / 06 / 08 / 10 | target startup绑定;new maintenance run冻结 | CAT-03 / 09;ordinary receipt release | NCFG-16 / 17 / 19:receipt不能自动解除cleanup / containment | 通过 |
| SBX-CFG-D28 handoff receipt / retry coordination | CAT-04 / 05 / 10 | 新retry job冻结pending / retry snapshot | CAT-01第二target owner / 03 / 09 | NCFG-14 / 15 / 16:保留failed fact且不修改source truth | 通过 |

#### 9.4.8 SBX-CP-08 租约、清理、reaper 与 redline

| Domain ID / 配置域 | 适用配置类别 | 生效边界 | 明确不适用 | 禁止项 / 原因 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D29 lease / orphan detection | CAT-02 / 04 / 05 / 06 / 08 / 10 | profile startup冻结;新scan run冻结cadence / batch | CAT-03 / 09;expiry-delete | NCFG-16 / 17:到期只触发保守检查,不直接删除 / 释放 | 通过 |
| SBX-CFG-D30 cleanup guard evaluation | CAT-02 / 04 / 05 / 10 | guard profile startup冻结;new job冻结cadence / batch | CAT-03 / 09;force-clean | NCFG-16 / 17:handoff / audit / investigation / redline guard不可绕 | 通过 |
| SBX-CFG-D31 backend release | CAT-01 / 02 / 04 / 05 / 06 / 08 / 10 | release adapter startup绑定;new run冻结retry | CAT-03 / 09;weak release fallback | NCFG-05 / 08 / 16 / 17 / 22:失败不得伪Released或绕guard | 通过 |
| SBX-CFG-D32 redline containment / escalation | CAT-02 / 04 / 05 / 06 / 10 | containment规则startup冻结;new maintenance run冻结target snapshot | CAT-03 / 09;disable / advisory | NCFG-16 / 17 / 23:containment不可关闭,release必须formal | 通过 |

#### 9.4.9 SBX-CP-09 引用刷新、投影、派生与对账

| Domain ID / 配置域 | 适用配置类别 | 生效边界 | 明确不适用 | 禁止项 / 原因 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D33 reference refresh | CAT-04 / 05 / 06 / 08 / 10 | 新refresh run冻结scope / batch / freshness | CAT-01 resolver第二owner / 03 / 09;truth repair | NCFG-01 / 07 / 12 / 19:只更新body-free reference state | 通过 |
| SBX-CFG-D34 projection rebuild | CAT-04 / 05 / 08 / 10 | 新rebuild run冻结scope / batch / store handle | CAT-03 / 09;query-triggered repair | NCFG-11 / 12:rebuild只替换view,不修core truth | 通过 |
| SBX-CFG-D35 derived inspect / preview / trend | CAT-04 / 05 / 08 / 09 / 10 | 新derived run冻结comparison scope / batch | CAT-02 / 03;formal decision config | NCFG-01 / 06 / 12 / 14:derived不成为truth或policy decision | 通过 |
| SBX-CFG-D36 reconciliation report | CAT-04 / 05 / 08 / 09 / 10 | 新reconciliation run冻结scope / batch | CAT-02 / 03;auto-fix | NCFG-01 / 12:只形成finding / report,不自动repair | 通过 |

#### 9.4.10 SBX-CP-10 可观测性、诊断与脱敏

| Domain ID / 配置域 | 适用配置类别 | 生效边界 | 明确不适用 | 禁止项 / 原因 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D37 runtime log / metric | CAT-01 / 05 / 06 / 07 / 10 | sink / level / sampling / label policy startup冻结 | CAT-03 / 09;hot raw-debug | NCFG-18 / 19:log / metric不替代audit且禁止raw / high-cardinality | 通过;exact carrier继续watch |
| SBX-CFG-D38 audit / trace hook | CAT-01 / 06 / 07 / 10 | audit adapter / route startup校验并冻结 | CAT-03 / 05 / 09;disable formal audit | NCFG-09 / 18 / 19 / 23:accepted audit同UoW且不可关闭 | 通过 |
| SBX-CFG-D39 diagnostic issue | CAT-01 / 05 / 06 / 07 / 10 | safe store / handoff / retention class startup冻结 | CAT-03 raw detail / 09 | NCFG-18 / 19:只保存stable code、safe summary和refs | 通过 |
| SBX-CFG-D40 redaction / safe output gate | CAT-02 / 07 / 10 | redaction profile / deny list startup校验并冻结 | CAT-03 / 08 / 09;debug relax | NCFG-19 / 23:local / test / feature均不能关闭redaction | 通过 |

#### 9.4.11 SBX-CP-11 环境与 deterministic test profile

| Domain ID / 配置域 | 适用配置类别 | 生效边界 | 明确不适用 | 禁止项 / 原因 | 停审 |
|---|---|---|---|---|---|
| SBX-CFG-D41 profile composition | CAT-01 / 10 | startup组合既有domain snapshot | CAT-03 / 04 / 09第二语义;hot overlay | NCFG-04 / 05 / 06 / 23 / 24:profile不改hard guard / source semantics | 通过 |
| SBX-CFG-D42 deterministic fixture / fake | CAT-08 / 10 | 仅test entry startup / new run生效 | CAT-06生产secret / 09;real-like fallback | NCFG-05 / 22:fake遵守正式语义且不得进入real-like | 通过 |
| SBX-CFG-D43 real-like / production-like composition | CAT-01 / 02 / 06 / 07 / 09 / 10 | startup完整validate真实binding后冻结 | CAT-08 fallback / 03;dynamic replacement | NCFG-04 / 05 / 19 / 22 / 23:缺binding拒绝,不得降级fake / host-run | 通过 |
| SBX-CFG-D44 future overlay / reload trigger | CAT-00,仅演进触发记录 | design-time;当前不进入loader / builder | CAT-01~10作为当前P0 / P1配置 | NCFG-24:先回写`03`并重开配置设计 | 通过;current non-config |

### 9.5 分类边界停审记录

| 控制面 / 配置域范围 | 类别适用性 | 更新边界 | 禁止项可执行性 | `03` 影响 | 结论 / 缺口 |
|---|---:|---:|---:|---|---|
| SBX-CP-01 / D01~D04 | 是 | startup / entry selector清楚 | 是 | 无回写 | 通过;raw owner、validation和builder冻结。 |
| SBX-CP-02 / D05~D08 | 是 | startup / loop / run / entry分离 | 是 | 无回写 | 通过;entry和feature不绕核心guard。 |
| SBX-CP-03 / D09~D13 | 是 | store startup冻结 | 是 | 无回写 | 通过;schema / UoW / replay不配置化。 |
| SBX-CP-04 / D14~D16 | 是 | source startup冻结 | 是 | 无回写 | 通过;external truth与technical freshness分离。 |
| SBX-CP-05 / D17~D20 | 是 | safety / backend startup冻结 | 是 | 无回写 | 通过;coherent boundary且无weak fallback。 |
| SBX-CP-06 / D21~D24 | 是 | startup route + new loop / run | 是 | 无回写 | 通过;transport不改protocol / source truth。 |
| SBX-CP-07 / D25~D28 | 是 | startup target + new retry run | 是 | 无回写 | 通过;handoff分层和no-rollback保持。 |
| SBX-CP-08 / D29~D32 | 是 | startup guard + new maintenance run | 是 | 无回写 | 通过;cadence不等于release authority。 |
| SBX-CP-09 / D33~D36 | 是 | new job run冻结 | 是 | 无回写 | 通过;read-side / job no-repair保持。 |
| SBX-CP-10 / D37~D40 | 是 | startup冻结 | 是 | watch_no_writeback | 通过;D37 exact carrier留Step 7复核。 |
| SBX-CP-11 / D41~D44 | 是 | startup composition / design-time trigger | 是 | watch_no_writeback | 通过;D44不进入当前loader。 |

### 9.6 跨分类 / 禁止项审计表

| 审计项 | 结论 | 修正 / owner口径 | unresolved 缺口 |
|---|---|---|---|
| 44个配置域是否全部进入分类 | 是 | D01~D44各出现一次,适用类别为闭集 | 无 |
| 是否存在P0核心hot update | 否 | CAT-01 / 02 / 05 / 06 / 07 / 09 / 10均startup冻结;CAT-04只对新loop / run | 无 |
| entry-local是否被误当global override | 否 | CAT-03只选择当前entry / typed input,不覆盖validated runtime | 无 |
| technical knob是否被误当domain / policy truth | 否 | CAT-05只控制limit / freshness / retention / retry / cadence / sampling | 无 |
| safety profile是否允许partial / best-effort | 否 | CAT-02受NCFG-04~06 / 16 / 17约束,invalid即拒绝 | 无 |
| debug / diagnostics是否放宽redaction | 否 | CAT-07只能选择safe surface,NCFG-19不可覆盖 | 无 |
| feature是否关闭核心闭环 | 否 | CAT-09只注册外围consumer / relay / derived / reconciliation / handoff | 无 |
| fake是否进入real-like或成为fallback | 否 | CAT-08仅test;D43缺真实binding拒绝 | 无 |
| P1产品配置是否污染P0语义 | 否 | P1只能替换合规承载,继续受相同NCFG边界和parity约束 | 无 |
| sensitive ref是否与raw secret混写 | 否 | CAT-06只保存opaque ref;raw value留Step 8安全设施 | 无,待Step 8展开 |
| retention / cadence是否变成cleanup / replay语义 | 否 | CAT-05受NCFG-10 / 16 / 17约束,数字不能越过完整性 / guard | 无 |
| audit / log / metric分类是否混层 | 否 | D38 formal audit不可关闭;D37 / D39只提供safe observability / diagnostic | 无 |
| 同一行为是否有多个分类owner | 无冲突 | target binding归CAT-01 / 06,run参数归CAT-04 / 05,profile只组合 | 无 |
| `03`禁止边界是否遗漏 | 未发现 | §9.3覆盖`03` §13.5及Step 14 §11 / Step 15 redaction / audit | 无 |
| D37 exact carrier | 保留watch | Step 7若现有summary / builder无法承载,先回写`03` | 当前不阻塞 |
| D44 overlay / reload | current non-config | 仅NCFG-24演进触发,不进入P0 / P1 | 当前不阻塞 |

### 9.7 用户重点边界到分类 / 禁止项追溯

| 重点边界 | 允许配置类别 | 固定禁止项 | 分类结论 |
|---|---|---|---|
| execution environment identity | CAT-01 / 02 / 06 / 10 | NCFG-01 / 02 / 03 | 只能绑定正式ref和责任语境,不能生成外部truth。 |
| resource limits | CAT-02 / 05 / 08 / 10 | NCFG-04 / 05 | template可选,四维coherence不可放宽。 |
| filesystem boundary | CAT-02 / 05 / 08 / 10 | NCFG-04 / 05 / 19 | profile不能通过local / debug放宽或泄露path / content。 |
| network boundary | CAT-02 / 05 / 06 / 10 | NCFG-04 / 06 / 19 | enforcement binding可选,allowlist truth不在sandbox。 |
| process boundary | CAT-02 / 05 / 08 / 10 | NCFG-04 / 05 | process / privilege要求不支持即拒绝,无host-run。 |
| tool / runtime launch policy | CAT-01 / 02 / 05 / 06 / 10 | NCFG-06 / 07 | 只配置summary source / freshness,不拥有semantic execution。 |
| artifact capture | CAT-01 / 02 / 05 / 06 / 08 / 10 | NCFG-14 / 15 / 19 | capture / handoff / artifact truth保持分层。 |
| observability hooks | CAT-01 / 05 / 06 / 07 / 10 | NCFG-18 / 19 | sink / sampling可配置,formal audit和redaction不可关闭。 |
| failure classification | CAT-01 / 02 / 05 / 07 / 08 / 10 | NCFG-08 / 18 / 19 | adapter surface可绑定,状态taxonomy不可配置。 |
| cleanup / lease / reaper | CAT-02 / 04 / 05 / 06 / 10 | NCFG-16 / 17 | cadence / target可配置,guard / release authority不可配置。 |
| security redlines | CAT-02 / 04 / 06 / 07 / 10 | NCFG-16 / 17 / 19 / 23 | containment、调查、redaction不可disabled / advisory-only。 |

### 9.8 对下游文档的影响总表

| 下游文档 | 从本 Step 接收什么 | 本 Step 不提供什么 |
|---|---|---|
| `04` Step 5 | category closed set、更新边界、CAT-03 entry-local和CAT-06 sensitive ref分类 | source优先级、覆盖和冲突策略尚未定义。 |
| `04` Step 6 | CAT-08 test、CAT-10 profile、P0 / P1隔离和D44 current non-config | 环境矩阵和真实binding组合尚未定义。 |
| `04` Step 7 | D01~D44适用类别、NCFG-01~24和生效边界 | raw key、类型、默认、必填和exact carrier尚未定义。 |
| `04` Step 8~11 | sensitive ref、startup freeze、no hot update和禁止项 | secret读取 / 轮换、loader、change、failure细节尚未定义。 |
| `05-测试方案.md` | invalid hard guard、fake / real parity、hot reload absent、feature / debug negative cuts | 不提供测试用例、run_id、evidence或通过结论。 |
| `06-验收标准.md` | NCFG边界可转为veto,尤其host-run、silent degrade、cleanup / redline、redaction | 不提供验收阈值、evidence alias、risk acceptance或签署。 |
| `07-实施计划.md` | startup freeze、entry / loop / run边界、config owner和`03` watch | 不提供phase / commit boundary、implementation ledger或planned skeleton。 |
| 部署与运维手册 | 哪些值cold update、哪些run-start、哪些是sensitive ref | 不提供部署命令、真实值、证书 / secret操作或runbook。 |

---

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 10类可配置类别和1类static design boundary只分类既有D01~D44 | 否 | 配置语义组织 | 不适用 | 无回写 |
| P0 runtime snapshot startup冻结,无核心hot update | 否 | 承接当前`03`没有reload contract | 不适用 | 无回写 |
| worker / job参数只在new loop / run开始时冻结 | 否 | 承接typed worker / job input和runtime handle | 不适用 | 无回写 |
| NCFG-01~23重申正式truth / state / transaction / safety / audit / dependency边界 | 否 | 上游不变量转译 | 不适用 | 无回写 |
| D37 exact sink / sampling carrier尚未裁决 | 否 | Step 7 watch | 不适用 | watch_no_writeback |
| D44 overlay / reload为current non-config | 否 | P2演进触发 | 不适用 | watch_no_writeback |
| 未来若启用reload / overlay / dynamic adapter replacement | 是 | config snapshot、builder、flow、rollback、audit、in-flight consistency变化 | `03` §4 / §5 / §9 / §11 / §13 / §14及Step 14 / 15 | 触发时阻塞并先回写 |

本 Step 当前没有 `待回写` 或 `阻塞待确认` 项。Step 7 若现有 `SandboxRuntimeConfigSummary`、builder或adapter ref无法承载P0配置项,必须先回写 `03`。

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_04_categories_boundaries.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置分类表”“更新时机边界表”“禁止配置化项表”“按配置域组织的分类边界表”“分类边界停审记录”和“跨分类 / 禁止项审计表”小节,了解配置类别和不可配置红线如何从 Step 3 控制面收敛。

正式 `04-配置设计.md` §4 应回填:

- 10类可配置类别和1类static design boundary。
- startup / worker-loop-start / job-run-start / entry-local / design-time更新边界。
- NCFG-01~24禁止配置化项及正式变更流程。
- D01~D44逐域分类边界表。
- 分类边界停审和跨分类 / 禁止项审计。
- 用户重点边界到分类 / 禁止项追溯。

回填要求:

- 不得把entry-local或new job run写成核心hot update。
- 不得把static design boundary生成raw key、env var或feature flag。
- 不得把policy-like technical knob写成policy / allowlist / approval truth。
- 不得让local / debug / test / fake / P1 profile放宽NCFG边界。
- 不得在正式§4新增Step 4未分类的配置域或改变Step 3 owner。

---

## 12. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| D37 log / metric / audit / diagnostic sink与sampling exact carrier | 可能影响runtime summary / builder / adapter ref | Step 7前复核;若需新carrier先回写`03`。 |
| P1真实backend / store / bus / OTel / scheduler / secret provider产品 | 影响CAT-01 / 06 / 07 / 10具体项 | Step 6~8 / 14保持product-neutral或登记待确认。 |
| retention / retry / cadence / batch / parallelism具体数字 | 影响CAT-04 / 05及capacity | Step 6 / 7 / 11收敛;不得用无依据数字改变guard。 |
| runtime hot reload / last-known-good是否进入未来路线 | 影响snapshot、rollback、audit和in-flight一致性 | 当前NCFG-24禁止;Step 13记录重新打开条件。 |
| tenant / region / workload overlay | 影响profile ownership和scope carrier | 当前P2、D44 current non-config;进入前回写`03`。 |
| NCFG边界如何进入测试 / 验收veto | 影响`05/06` negative matrix | Step 12交接;本步不伪造用例或证据。 |

---

## 13. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置类别已定义 | 通过 | 见§9.1,10类可配置类别 + 1类design boundary。 |
| 更新时机和P0 hot update口径已明确 | 通过 | 见§9.2;P0无核心hot update。 |
| 禁止配置化项已列出并回指设计来源 | 通过 | 见§9.3,NCFG-01~24。 |
| 每个配置域适用 / 不适用类别已明确 | 通过 | 见§9.4,D01~D44全覆盖。 |
| 分类边界已停审 | 通过 | 见§9.5。 |
| 跨分类 / 禁止项审计无unresolved冲突 | 通过 | 见§9.6。 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无具体回写;D37 / D44为watch。 |
| 可进入 Step 5 | 已通过 | 用户已确认本 Step;Step 5 `定义配置来源、优先级与冲突处理` 已独立完成并等待审查。 |
