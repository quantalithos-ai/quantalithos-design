# 04 配置设计 Step 4 · 定义配置分类与禁止配置化边界

> 子项目: `L1-identity`
> 目标文档: `04-配置设计.md`
> SOP Step: Step 4 定义配置分类与禁止配置化边界
> 状态: 已写入;等待用户审核

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 4 定义配置分类与禁止配置化边界 |
| 当前状态 | 已写入;等待用户审核 |
| 输入基线 | Step 1 输入边界;Step 2 scope;Step 3 control plane;新版正式 `03-详细设计.md` §5~§15 |
| 输出文件 | `projects/L1-identity/design-calibration/04_config_step_04_categories_boundaries.md` |
| 停审方式 | 本 Step 完成后暂停,审核通过后进入 Step 5 sources / priority / conflicts |

本 Step 在 Step 3 配置控制面基础上,定义 `L1-identity` 的配置类别、更新时机和禁止配置化边界。

本 Step 只回答:

- 当前系统有哪些配置类别。
- 哪些配置只能启动读取,哪些只能随 job run 冻结,哪些只允许 entry-local 生效。
- P0 是否允许 hot runtime update。
- 哪些安全、审计、事务、一致性、依赖裁剪和领域规则禁止配置化。
- 禁止配置化项如需改变应走什么设计流程。
- 每个配置域适用哪些类别,哪些类别明确不适用。

本 Step 不定义具体 key 名、JSON schema、环境变量名、默认数值、secret provider、profile 矩阵、配置加载函数、部署命令、产品选型、测试编号或正式配置文件样例。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已审核通过 | 提供来源链、10 类控制面和配置域 / 功能模块表 |
| `03-详细设计.md` §5~§8 | 已完成 | 提供 module boundary、port family、protocol names 和 entry facade restriction |
| `03-详细设计.md` §9~§13 | 已完成 | 提供 function flow、state matrix、persistence / transaction、error / recovery、idempotency / stored replay 和 config binding |
| `03-详细设计.md` §14~§15 | 已完成 | 提供 observability / redaction 和 config/runtime/adapter test cut |
| `03_ddd_step_14_config_external_binding.md` | 已完成并已审核 | 提供 runtime builder order、config ownership、external dependency binding 和 forbidden config boundary |
| 新版 `00/01/02` | 新版输入 | 提供 no-auth、ref-only、外部正文排除、依赖裁剪和配置影响轮廓 |
| 旧 `04_config_step_04_categories_boundaries.md` | 历史诊断输入 | 只用于识别旧名漂移;不得作为本 Step 真相源 |
| `L1-governance` Step 4 calibration | 参考样式 | 只参考分类粒度和表格组织,不复用治理业务对象 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前系统有哪些启动配置、运行时配置、策略配置、敏感配置、调试配置? | 分类为 static design boundary、startup runtime config、job-run-start config、entry-local parameters、policy-like technical knobs、sensitive ref config、diagnostic / redaction config、test fixture / deterministic config、feature / peripheral enablement。static design boundary 不是配置项,只用于声明不可被配置覆盖的设计不变量。 |
| 哪些配置允许热更新? | P0 不允许核心 hot runtime update。配置变化通过 process restart 或 new job run 生效。entry-local 参数只影响当前入口 / 当前 job,不改变全局 runtime。未来若需要 hot reload,必须新增 `03` runtime contract、validation、rollback、audit 和 last-known-good 规则。 |
| 哪些配置只能冷更新或启动读取? | profile、store / UoW binding、adapter availability、source resolver / publisher / handoff binding、topic-neutral route binding、redline guard、audit / trace / metric sink、clock / id adapter、fixture source 和 boundary limits 均必须 startup validate 后冻结。 |
| 哪些配置只能 job-run-start 冻结? | operations job 的 batch、timeout、retry、parallelism、scope、target snapshot、report input/output refs 等只在 new job run 开始时冻结,并进入 job report / stored replay surface。job 运行中不得切换这些参数。 |
| 哪些配置只能 entry-local 生效? | route / binding selector、operation metadata、actor context marker、idempotency key、request digest、page cursor、job run identity、dry-run diagnostic selector 等只影响当前 entry。它们不得覆盖 startup store、adapter、redline、topic 或领域 scope。 |
| 哪些安全、审计、事务、一致性或领域规则禁止配置化? | identity truth ownership、`GlobalMember` explicit create、`GlobalLifecycleState` state matrix、`HighRiskLifecycleGuard` / `GovernanceBasisSummary` guard、RoleDefinition / CapabilityDefinition body exclusion、Project / WorkItem / ProjectMember truth exclusion、memory / artifact / archive body exclusion、command/consumer/job idempotency、stored replay、accepted same-UoW order、outbox accepted-only material、query no-write、projection/reference/reconciliation job no-truth-repair、handoff delivered receipt requirement、non-core dependency discipline、body-free/secret-free boundary 均禁止配置化。 |
| 禁止配置化项如需改变应走什么流程? | 不能通过配置文件、env、profile、feature flag、entry-local 参数或 fake adapter 改变。必须回到正式 `00/01/02/03` 修改需求、架构、对象契约、protocol、flow、state matrix、transaction 或 port surface,再同步 `04/05/06/07`。 |
| 每个配置域下哪些配置类别适用,哪些类别明确不适用? | 本 Step 按 Step 3 配置域逐项标注适用类别。store / adapter / topic / redline / clock-id 属 startup;job batch / timeout / retry 属 job-run-start;entry args 只影响当前入口;truth / state / transaction / audit / outbox source / stored replay 不适用任何配置类别。 |
| 所有分类完成后,是否存在同一行为在不同配置域分类不一致或禁止项遗漏? | 已完成跨分类审计。`retry / timeout / batch` 归 technical knobs,不进入 domain policy;`feature enablement` 只控制外围能力,不改变 accepted truth;`test fixture` 只用于 deterministic test / local-dev / ci-test,不进入 production-like 替代外部依赖。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 3 配置域表 | 已列允许 / 禁止能力,但未按配置类别和更新时机分类 | 本 Step 建立配置分类表、更新时机表和配置域分类边界 |
| 新版 `03` §13 | 已声明 config ownership 和 forbidden boundary,但不是正式 `04` 分类结构 | 本 Step 转换为 `04` 的分类与禁止配置化口径 |
| 新版 `03` §9~§13 | flow、state、transaction、idempotency 红线明确 | 本 Step 把这些红线列为 static design boundary,不得被配置覆盖 |
| 新版 `03` §14~§15 | observability/redaction 规则明确 | 本 Step 将其归入 diagnostic / redaction config,并禁止放宽输出边界 |
| 旧 Step 4 calibration | 含旧 lifecycle / external decision 口径和旧对象名 | 本 Step 全量替换为新版 `03` 名称和不变量 |
| 后续 Step 5~8 | 尚未定义来源优先级、具体配置项和 secret 规则 | 本 Step 保留这些内容给后续,不提前展开 |

## 5. 改动前后对比

| 项 | 改动前 | 本步后 | 原因 |
|---|---|---|---|
| 配置类别 | 只有 Step 3 控制面 / 配置域 | 明确 startup、job-run-start、entry-local、technical knobs、sensitive refs、diagnostic、test fixture、peripheral enablement | 支撑 Step 5 来源优先级和 Step 7 配置项 |
| hot update | 未正式分类 | P0 无核心 hot runtime update;restart 或 new job run 生效 | 避免实现侧私造 reload / rollback / adapter replacement |
| 禁止配置化项 | 分散在新版 `03` 多章 | 统一成禁止项表并写明变更流程 | 防止配置绕过领域不变量 |
| 配置域分类边界 | Step 3 只列允许 / 禁止能力 | 每个配置域标明适用类别和不适用类别 | 支撑后续逐域配置项小循环 |
| 旧口径处理 | 旧 Step 4 可误导下游 | 不继承旧名、旧 external decision、旧 job/port 口径 | 保持新版 `03` 为唯一上游 |
| 详细设计影响 | Step 3 判定无新增契约 | 本 Step 继续无回写;未来 hot reload / dynamic adapter replacement 需回写 `03` | 保持 `04` 不静默修改代码契约 |

## 6. 配置设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否支持 P0 hot reload | A. 支持 runtime hot reload;B. 不支持核心 hot reload | 采用 B。当前 `03` 没有 reload / rollback / last-known-good runtime contract |
| technical knobs 是否等同 identity domain policy | A. 等同;B. 只指 retry / timeout / retention / batch / page limit 等技术参数 | 采用 B。domain state matrix、guard 和 truth ownership 不是配置项 |
| peripheral enablement 是否可改变核心语义 | A. 可打开/关闭核心 command 行为;B. 只控制外围 export / diagnostic / optional integration | 采用 B。enablement 不得改变 accepted truth |
| test fixture 是否可作为 production-like 依赖替代 | A. 可以复用;B. 仅 deterministic test / local-dev / ci-test | 采用 B。fixture 不得伪造外部成功 |
| 禁止项变化是否走配置审批 | A. 配置审批即可;B. 必须走正式设计变更 | 采用 B。禁止项本质是需求 / 架构 / 详细设计不变量 |
| 是否把 entry-local 当作隐式覆盖来源 | A. entry-local 可覆盖全局配置;B. entry-local 只影响当前 dispatch | 采用 B。防止绕过 runtime builder 和 typed DTO |

## 7. 结构化中间产物

### 7.1 配置分类表

| 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| static design boundary | 非配置项,用于声明不可被配置覆盖的设计不变量 | truth ownership、state matrix、query no-write、job no-truth-repair | 不适用 | 若被当成配置项,会绕过需求 / 架构 / 详细设计 |
| startup runtime config | runtime 构造前读取并冻结的配置 | profile、store binding、adapter availability、topic-neutral route binding、redline guard | P0 不允许 | 启动后改变会破坏 adapter / store / UoW 一致性 |
| job-run-start config | 每次 job run 开始时冻结的运行参数 | batch size、timeout、retry、parallelism、scope、report refs | 不属于 hot update | job 中途改变会导致 report 和 duplicate replay 不可复核 |
| entry-local parameters | 只影响当前入口或当前请求 / job 的本地参数 | actor context marker、request digest、page cursor、run id、dry-run selector | 不属于 hot update | 如果覆盖全局配置或业务 scope,会绕过 typed DTO |
| policy-like technical knobs | 技术执行策略,不等同 identity domain policy | retry、retention、dedup window、page limit、timeout | startup 或 job-run-start 冻结 | 误用于改变 lifecycle、visibility、guard 或 state matrix |
| sensitive ref config | 普通配置只保存 ref,raw secret 由安全设施处理 | DSN ref、bus endpoint ref、credential ref、cert ref、sink ref | P0 不允许 raw secret hot update | raw secret 泄露到 config、log、audit、report 或 fixture |
| diagnostic / redaction config | 控制安全诊断输出和 forbidden field 扫描 | redaction deny list、metric label allowlist、safe diagnostic refs | P0 startup 冻结 | 诊断放宽会泄露 forbidden body 或 high-cardinality label |
| test fixture / deterministic config | 支撑 local / CI 可复现测试 | fake adapter、in-memory store、fixed clock、sequence id、fixture source | 仅测试 entry 生效 | 进入 production-like 会伪造外部成功 |
| feature / peripheral enablement | 控制外围能力是否启用 | optional diagnostic export、external contract smoke、non-core report emission | P0 startup 冻结 | 若控制核心 accepted path,会改变业务语义 |

### 7.2 更新时机边界表

| 更新时机 | 允许内容 | 禁止内容 | 生效规则 |
|---|---|---|---|
| static / design-time | 架构红线、truth boundary、protocol schema、state matrix、transaction ordering、dependency discipline | 作为 JSON / env / flag / profile 配置 | 只能通过正式设计变更和实现提交生效 |
| startup / cold update | profile、store、adapter、topic、redline、boundary limits、retention、clock/id、peripheral enablement | 启动后无审计替换核心 adapter / store / redline | 重新启动并重新 validate 后生效 |
| job-run-start | job batch、timeout、retry、parallelism、scope、target availability snapshot、report refs | job 运行中改变 mutation semantics、checkpoint 语义或 duplicate replay 口径 | new job run 冻结,写入 report / stored replay |
| entry-local | operation metadata、actor context marker、route/binding selector、page cursor、job run identity、dry-run diagnostic selector | 改写全局 config、truth scope、state transition、visibility、adapter binding | 只对当前入口有效 |
| hot runtime update | P0 无核心 hot update | store / adapter / topic / redline / idempotency / truth invariant hot change | 需要未来新增 `03` reload contract 后才可启用 |

### 7.3 禁止配置化项表

| 禁止配置化项 | 原因 | 设计来源 | 如需改变应走什么流程 |
|---|---|---|---|
| identity 内部登录 / token / session / credential 校验 | 入口安全属于上游 API layer;identity 只消费可信 actor context | `03` no-auth boundary, `ActorContext`, §13 | 修改入口安全架构和 `03` inbound contract |
| query / consumer 自动创建 `GlobalMember` | 成员创建必须通过显式 command 和 accepted transaction | `03` command/query flow, query no-write | 修改 protocol、flow、state matrix 和验收红线 |
| `GlobalMemberRef` 释放、复用或由配置生成 | ref identity 是 truth invariant,不是 profile 选项 | `IdentityAnchorState`, id/ref rules | 修改 object contract 和 id generation contract |
| `GlobalLifecycleState` 状态矩阵 | 状态机是 domain 不变量 | `03` Step 10 state matrix | 修改 domain object / state matrix 和测试 |
| 高风险 lifecycle guard / `GovernanceBasisSummary` 校验 | 高风险动作必须有正式 basis summary | `HighRiskLifecycleGuard`, governance basis resolver | 修改 lifecycle flow、resolver port 和验收 |
| RoleDefinition / CapabilityDefinition 正文进入 identity | method-library 拥有定义正文;identity 只保存 ref / safe summary / marker | `03` role/capability source contracts | 修改数据所有权和对象契约 |
| Project / WorkItem / ProjectMember truth 进入 identity | work 拥有项目和参与事实;identity 只维护 career record / safe marker | `03` career flow and ownership boundary | 修改 L1-work / identity 边界 |
| memory text / embedding / archive package body 进入 identity | memory/archive 拥有内容和归档包 | `03` memory reference / handoff contracts | 修改 memory/archive 边界 |
| artifact / evidence body 进入 identity | artifact/evidence 内容由外部系统拥有 | `03` artifact/evidence resolver boundary | 修改 artifact / capability evidence contract |
| raw request/event/job/config/source/adapter/receipt body 输出 | 防止泄露 forbidden material 和外部正文 | `03` §14 / §15 redaction | 修改 security / redaction design |
| raw secret 或 raw endpoint 泄露到 store/log/report | secret 只能以 ref / redacted marker 进入配置材料 | `03` §13 sensitive boundary | 修改 secret management design |
| command / consumer / callback / job idempotency requirement | 防止 duplicate mutation 和 commit unknown 无法恢复 | `03` §12 idempotency | 修改 protocol envelope、idempotency repository 和 flow |
| stored replay surface | duplicate replay 必须返回 stored public surface | `03` stored replay rules | 修改 stored result / receipt / job report contract |
| accepted same-UoW transaction order | truth、cursor、trace/audit、outbox、stale、stored result 必须同事务 | `03` §9 / §11 | 修改 transaction and persistence contract |
| repository expected_version / cursor source | concurrency source 不是配置值 | `03` version/cursor rules | 修改 repository port / cursor assigner |
| outbox publisher 创造业务事件 | publisher 不是业务决策点 | `03` outbound material and outbox flow | 修改 outbox event contract |
| outbox publish failure 回滚 accepted truth | 外部 transport 失败不能污染本地 accepted transaction | `03` error/recovery and outbox state | 修改 transaction / outbox design |
| event kind / public protocol schema / topic-neutral key | transport route 不改变 public event 语义 | `03` protocol contracts | 修改 contracts event schema 和 compatibility plan |
| query 写 truth、trace、audit、projection、reference、outbox 或 report | query 是 visibility-first read surface | `03` query flow and §15 tests | 修改 query protocol and flow |
| projection rebuild / reference refresh / reconciliation 修复 core truth | maintenance job 只维护 derived / reference / report material | `03` operations job rules | 修改 job flow 和 truth ownership |
| `HandoffState::Delivered` 无 formal attempt / receipt marker | delivery state 必须可追溯 | `03` handoff state matrix | 修改 handoff object and callback protocol |
| non-core sibling repo 作为 Cargo dependency | runtime/event/handoff 协作不得变成源码耦合 | `03` dependency discipline | 修改架构依赖裁剪 |
| fake / controlled / disabled adapter 默认成功 | fake 只能替代外部依赖,不能替代语义 | `03` fake/durable parity | 修改 fake adapter contract tests |

### 7.4 按配置域组织的分类边界表

| 配置域 | 适用配置类别 | 不适用类别 | 禁止配置化项 | 原因 |
|---|---|---|---|---|
| profile selector | startup runtime;entry-local selector;test fixture | hot update;domain policy | truth ownership、state matrix、accepted semantics | profile 只选择运行形态和 adapter 组合 |
| runtime config shell / assembly validation | startup runtime;diagnostic | sensitive raw config;business scope config | raw secret、raw config body、adapter health == business success | config shell 只表达 validated refs / issues |
| adapter availability registry | startup runtime;feature enablement | domain state config | business errors、visibility、idempotency、state matrix | availability 只表达依赖表面 |
| core truth store binding | startup runtime;sensitive ref | hot update;domain policy | schema、expected_version、UoW ordering | store 只承载 truth,不改变 truth |
| append-only / trace / audit store binding | startup runtime;sensitive ref;diagnostic | disable audit config | business audit chain、raw body output | audit / trace 是正式业务材料 |
| projection/read store binding | startup runtime;job-run-start rebuild knobs | query-time repair config | query no-write、view ref ad hoc construction | projection 是 derived read model |
| reference/report store binding | startup runtime;job-run-start refresh/reconcile knobs | external body / auto-repair config | external body exclusion、report-only maintenance | refresh/reconcile 不创建业务事实 |
| outbox store / payload marker binding | startup runtime;publisher job knobs | payload reconstruction config | outbox accepted-only source、publish rollback | publisher 只读 stored outbox material |
| idempotency/result/report replay store | startup runtime;technical knobs | disable replay config | stored replay、commit unknown recovery | duplicate replay 是协议不变量 |
| trusted actor context input | startup boundary;entry-local metadata | auth implementation config | no-auth、actor presence、traceability | identity 只消费可信上下文 |
| operation metadata / request digest input | entry-local;startup validation rule | optional accepted metadata config | idempotency key、stable digest、channel source | 写路径必须可重放和审计 |
| role/capability source resolver | startup runtime;test fixture;technical knobs | external body config | RoleDefinition body、source truth ownership | identity 只保存 ref / safe marker |
| work source resolver / career consumer | startup runtime;technical dedup knobs;P1 feature | external mutation config | ProjectMember truth、career overwrite | career 是 append/correction record |
| memory/archive resolver and handoff | startup runtime;sensitive ref;P1 feature | content cache config | memory body、archive package、fake delivered | identity 只保存 ref / state / receipt marker |
| governance basis resolver | startup runtime;sensitive ref;P1 feature | guard bypass config | high-risk guard、governance policy body | basis validity 来自 resolver outcome |
| artifact/evidence ref resolver | startup runtime;sensitive ref;P1 feature | body storage config | artifact/evidence body | 只校验 ref / safe summary marker |
| bus publisher adapter | startup runtime;job-run retry knobs;sensitive ref | event schema config | event kind、payload DTO、published == consumed | publisher 不定义业务事件 |
| topic-neutral route binding | startup runtime;sensitive ref | event semantics config | topic key / schema version | topic 只映射 transport route |
| operations job runner binding | job-run-start;technical knobs;diagnostic | core mutation config | job no-truth-repair、duplicate no-rerun | job 只维护 marker / derived state / report |
| trace handoff adapter | startup runtime;sensitive ref;job-run-start target snapshot | accepted truth config | handoff no-truth-repair、delivered receipt | handoff 是外围交接 |
| propagation retry adapter | job-run-start;technical knobs | terminal reopen config | terminal retry guard、stored job replay | retry 不能重开终态或重跑 mutation |
| redaction/safe diagnostics | startup runtime;diagnostic | hot relax config | forbidden body、raw secret、high-cardinality labels | 安全输出必须启动前校验 |
| deterministic clock/id | startup runtime;test fixture | production-like override | handler/domain id synthesis、timestamp as cursor/version | id/time 由 port 注入 |
| fixture source | test fixture / deterministic | production-like source | fake semantic shortcut、private fixture map | fixture 只能走正式 port shape |

### 7.5 分类边界停审记录

| 配置域 / 禁止项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| profile / runtime | 类别、更新时机、禁止项是否清楚 | 通过 | P0 无核心 hot update |
| store / transaction | 是否把 store 选择与 truth schema 分离 | 通过 | 产品选择留 Step 7 / 13 / 14 |
| adapter binding | disabled / degraded 是否不改业务语义 | 通过 | 只影响 dependency surface |
| topic / publisher | topic 是否只做 transport route | 通过 | event schema 不可配置 |
| jobs / operations | job knobs 是否不改变 mutation 语义 | 通过 | scope / report 由 typed job input 承载 |
| sensitive refs | raw secret 是否仍被排除 | 通过 | Step 8 继续展开存储 / 轮换 / 审计 |
| diagnostic / redaction | 诊断是否不能放宽 forbidden body | 通过 | deny list / safe refs 由 Step 8 / 9 继续定义 |
| test fixture | fake 是否不跳过正式状态 | 通过 | Step 6 / 7 需保持 local / CI profile 限定 |
| peripheral enablement | enablement 是否只控制外围能力 | 通过 | 不允许关闭核心 accepted flow |
| forbidden boundaries | 是否回指上游不变量 | 通过 | 后续正式 `04` 必须保留禁止表 |

### 7.6 跨分类 / 禁止项审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在 P0 hot runtime update | 无 | P0 仅 startup / job-run-start / entry-local |
| 是否把 identity domain rule 当作配置 | 无 | technical knobs 仅指 retry / retention / timeout / batch 等技术参数 |
| 是否把 feature / peripheral enablement 用于核心语义 | 无 | enablement 只控制外围 export / diagnostic / optional integration |
| 是否把 test override 带入 production-like | 无 | test fixture 仅 deterministic test / local-dev / ci-test |
| 是否遗漏 Step 3 配置域 | 无 | Step 3 配置域均进入 §7.4 |
| 是否遗漏 `03` 禁止配置化边界 | 无 | `03` §5~§15 的 ownership、dependency、state、transaction、idempotency、redaction 红线已进入 §7.3 |
| 是否存在分类互相冲突 | 无 | startup / job-run-start / entry-local 边界已区分 |
| 是否需要回写 `03` | 未发现 | 当前只分类既有绑定点,不新增 runtime reload、config schema 或 port |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 不支持核心 hot runtime update,配置通过 startup / new job run / entry-local 生效 | 否 | 承接当前 `03` 未定义 reload contract | 不适用 | 无回写 |
| static design boundary 不是配置项,只能通过正式设计变更改变 | 否 | 重申上游不变量 | 不适用 | 无回写 |
| policy-like technical knobs 不等同 identity domain policy | 否 | 分类澄清 | 不适用 | 无回写 |
| feature / peripheral enablement 只控制外围能力,不改变 accepted truth | 否 | 范围澄清 | 不适用 | 无回写 |
| entry-local 参数不得覆盖 startup runtime binding | 否 | 承接 entry facade restriction | 不适用 | 无回写 |
| 若未来需要 hot reload、dynamic adapter replacement 或配置改变 core flow | 是 | runtime contract / builder / flow 变更 | `03` module / flow / runtime assembly 章节 | 阻塞待确认 |

## 9. 回填草稿

正式 `04-配置设计.md` §4 可回填:

```md
## 4. 配置分类与禁止配置化边界

> 校准来源:
> - `design-calibration/04_config_step_04_categories_boundaries.md`

`L1-identity` 的配置类别分为 startup runtime config、job-run-start config、entry-local parameters、policy-like technical knobs、sensitive ref config、diagnostic / redaction config、test fixture / deterministic config 和 feature / peripheral enablement。static design boundary 不是配置项,只用于声明不可被配置覆盖的设计不变量。

P0 不支持核心 hot runtime update。store、adapter、topic-neutral route、redline、clock / id 和 audit sink 等配置必须启动校验后冻结;job batch、timeout、retry、parallelism 和 scope 在 new job run 开始时冻结;entry-local 参数只影响当前入口。

identity truth ownership、`GlobalMember` explicit create、`GlobalLifecycleState` 状态矩阵、`HighRiskLifecycleGuard` / `GovernanceBasisSummary` 校验、RoleDefinition / CapabilityDefinition body exclusion、ProjectMember truth exclusion、memory / artifact / archive body exclusion、事务同成同败、idempotency、stored replay、outbox accepted-only material、query no-write、job no-truth-repair、handoff delivered receipt requirement、non-core dependency discipline 和 body-free/secret-free boundary 均禁止配置化。任何此类边界变化必须先回写正式设计,不得通过 profile、env、feature flag、entry-local 参数或 fake adapter 绕过。
```

## 10. 待确认事项

| 编号 | 待确认事项 | 影响 | 当前处理 |
|---|---|---|---|
| ID-CONFIG-Q11 | 是否未来需要 hot reload / last-known-good config | 影响 runtime builder、validator、audit 和 rollback contract | P0 不支持;Step 13 / 14 作为演进风险 |
| ID-CONFIG-Q12 | production-like profile 是否允许 dynamic adapter replacement | 影响 adapter registry、UoW 和 in-flight job 语义 | P0 不支持;后续需要 `03` 回写 |
| ID-CONFIG-Q13 | feature / peripheral enablement 的最终默认值 | 影响 optional diagnostics / external contract smoke | Step 7 配置项清单定义 |
| ID-CONFIG-Q14 | sensitive ref 与 raw secret provider 的边界 | 影响 Step 8 密钥管理 | Step 8 正式定义 |
| ID-CONFIG-Q15 | 禁止配置化项是否进入验收 veto | 影响 `06-验收标准.md` 回归 | Step 12 给下游承接输入 |

## 11. 进入下一步条件

- 配置类别已定义。
- 更新时机和 P0 hot runtime update 口径已明确。
- 禁止配置化项已列出并回指设计来源。
- 每个配置域适用 / 不适用类别已明确。
- 分类边界已停审。
- 跨分类 / 禁止项审计没有 unresolved 冲突。
- 对 `03-详细设计.md` 的影响判定已记录,当前无必须回写项。
- 未提前定义配置 key、env var、默认值、schema、secret provider、profile 矩阵、测试编号或实施 boundary。

下一步进入 Step 5:定义配置来源、优先级与冲突处理。
