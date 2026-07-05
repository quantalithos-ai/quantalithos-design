# Step 4. 定义配置分类与禁止配置化边界

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 4
> 回填章节: `04-配置设计.md` §4 配置分类与禁止配置化边界

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 定义配置分类与禁止配置化边界 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1 输入边界;Step 2 范围;Step 3 配置控制面;新版 `00/01/02/03`;详细设计 Step 14 配置绑定 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_04_categories_boundaries.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 5 |

## 2. 本步目标

本 Step 在 Step 3 的配置控制面基础上,定义 `L1-artifact` 的配置类别、更新边界和禁止配置化边界。

本 Step 只回答:

- 当前系统有哪些配置类别。
- 哪些配置类别允许 startup 读取、job-run-start 冻结或 entry-local 生效。
- P0 是否允许热更新。
- 哪些安全、审计、事务、一致性和领域规则禁止配置化。
- 禁止配置化项如需改变应走什么设计流程。
- 每个配置域适用哪些配置类别,哪些类别明确不适用。
- 每个禁止配置化项是否回指上游架构红线或详细设计不变量。

本 Step 不定义具体 key 名、JSON schema、环境变量名、默认数值、secret provider、profile 矩阵、配置加载函数、部署命令、产品选型或正式配置文件样例。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已完成 | 提供配置控制面、配置域 / 功能模块和跨控制面审计结果 |
| `03-详细设计.md` §3 / §5 / §8 / §9 / §10 / §11 / §12 / §13 / §14 | 已完成 | 提供依赖裁剪、模块边界、event / job flow、状态、事务、错误、幂等、配置绑定和 observability 不变量 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 config section、禁止配置化边界、topic binding 和 runtime builder 绑定顺序 |
| `02-概要设计.md` §11 / §13 | 已完成 | 提供配置影响轮廓和禁止配置化边界 |
| `01-架构设计.md` §3 / §4 / §5 / §13 | 已完成 | 提供数据所有权、外部正文排除、派生不反写和依赖裁剪红线 |
| `00-需求文档.md` §2 / §4 / §10~§14 | 已完成 | 提供 Artifact truth 边界、安全和验收红线 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前系统有哪些启动配置、运行时配置、策略配置、敏感配置、调试配置? | 分类为 static design boundary、startup runtime config、job-run-start config、entry-local parameters、policy-like technical knobs、sensitive ref config、diagnostic / redaction config、test fixture / deterministic config、feature / peripheral enablement。static design boundary 不是可配置项,只用于声明不可被配置覆盖的设计不变量。 |
| 哪些配置允许热更新? | P0 不允许核心 hot update。配置变化通过 process restart、new worker loop build 或 new job run 生效。允许的 entry-local 参数只影响当前入口 / 当前 job,不改变全局 runtime。若未来需要 hot reload,必须新增 `03` runtime contract、validation、rollback 和 audit 规则。 |
| 哪些配置只能冷更新或启动读取? | store binding、adapter availability、source resolver / publisher / handoff binding、topic map、boundary limits、redaction deny list、idempotency retention、clock / id adapter、feature peripheral enablement 都必须 startup validate 后冻结。 |
| 哪些安全、审计、事务、一致性或领域规则禁止配置化? | Artifact truth 归属、外部正文排除、formal-only version / lineage / baseline 锚点、baseline 只冻结正式 version、automation candidate-only、command metadata / idempotency、accepted trace / audit / relay / stored result、query no-write、projection / reconciliation / handoff 不反写真相、outbox payload snapshot 来源、expected version / UoW ordering、duplicate replay、visibility / restricted / degraded guard、非 core Cargo dependency 裁剪都禁止配置化。 |
| 禁止配置化项如需改变应走什么流程? | 不能通过配置文件、env、profile 或 feature flag 改变。必须回到对应正式设计:需求 / 架构 / 概要 / 详细设计中修改 truth boundary、对象契约、flow、状态矩阵、事务或协议,再同步配置设计、测试方案、验收标准和实施计划。 |
| 每个配置域下哪些配置类别适用,哪些类别明确不适用? | 本 Step 按 Step 3 配置域逐项标注适用类别。store / adapter / topic / redaction / clock/id 属 startup;job batch / timeout / retry 属 job-run-start;command/query local args 属 entry-local;truth / state / transaction / visibility / outbox source / duplicate replay 不适用任何配置类别。 |
| 每个禁止配置化项是否回指架构红线或详细设计不变量? | 已在禁止配置化项表中回指 `00/01/02/03` 的数据所有权、正文排除、依赖裁剪、flow、状态、事务、幂等、query no-write、job no-truth-repair 和 observability redaction 边界。 |
| 每个配置域分类边界完成后是否通过停审? | 已通过。每个配置域都有适用类别、不适用类别、禁止项和更新边界。当前未发现需要新增 `03` 代码契约。 |
| 所有分类完成后,是否存在同一行为在不同配置域分类不一致或禁止项遗漏? | 已完成跨分类审计。`retry / timeout / batch` 归 technical knobs,不进入 domain policy;`feature enablement` 只控制外围 relay / handoff / derived event,不改变 accepted truth;`test fixture` 只用于 local / CI,不进入 production-like profile。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 3 配置域表 | 已列允许 / 禁止能力,但未按配置类别和更新时机分类 | 本 Step 建立配置分类表和配置域分类边界 |
| `03` §13 / Step 14 | 已列核心禁止项,但未说明如果要改变应走什么流程 | 本 Step 增加禁止项变更流程 |
| `03_ddd_step_14` config section | 已有 config section,但 startup / job-run-start / entry-local / sensitive / diagnostic 边界未分层 | 本 Step 将其分类,不改变代码绑定 |
| `02` 配置影响轮廓 | 只说明配置不得越界 | 本 Step 细化为逐项禁止表和停审表 |
| 后续 Step 5~8 | 尚未定义优先级、secret、具体 key 和加载校验 | 本 Step 保留这些内容给后续,不提前展开 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置类别 | 只有控制面 / 配置域 | 明确 startup、job-run-start、entry-local、technical knobs、sensitive refs、diagnostic、test fixture、feature enablement | 支撑 Step 5 来源优先级和 Step 7 配置项 |
| 热更新口径 | 未正式分类 | P0 无核心 hot update;restart 或 new job run 生效 | 避免实现侧私造 reload / hot path |
| 禁止配置化项 | 只在 `02/03` 摘要列出 | 逐项列禁止原因、来源和变更流程 | 防止配置绕过领域不变量 |
| 配置域分类边界 | Step 3 只列允许 / 禁止能力 | 每个配置域标明适用类别和不适用类别 | 支撑后续逐域配置项小循环 |
| 详细设计影响 | Step 3 已判定无新增契约 | 本 Step 继续判定无回写;若未来 hot reload / new config field 改 `03` 则阻塞 | 保持 `04` 不静默修改代码契约 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否支持 P0 hot reload | A. 支持 runtime hot reload;B. 不支持核心 hot reload | 采用 B。当前 `03` 没有 reload / rollback / last-known-good runtime contract |
| policy-like technical knobs 是否等同 Artifact domain policy | A. 等同;B. 明确只指 retry / timeout / retention / batch 等技术参数 | 采用 B。Artifact domain policy、formal-only、baseline freeze 不是配置项 |
| feature flags 是否可改变核心语义 | A. 可打开 / 关闭核心 command 行为;B. 只控制外围 relay / handoff / derived event | 采用 B。feature flag 不得改变 accepted truth |
| test fixture 是否可作为生产 override | A. 可复用;B. 仅 local / CI / deterministic test | 采用 B。测试 override 不得进入 production-like profile |
| 禁止项变化是否走配置审批 | A. 配置审批即可;B. 必须走正式设计变更 | 采用 B。禁止项本质是需求 / 架构 / 详细设计不变量 |

## 8. 结构化中间产物

### 8.1 配置分类表

| 配置类别 | 说明 | 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|---|
| static design boundary | 非配置项,用于声明不可被配置覆盖的设计不变量 | truth ownership、正文排除、formal-only 锚点、query no-write | 不适用 | 若被当成配置项,会绕过需求 / 架构红线 |
| startup runtime config | runtime 构造前读取并冻结的配置 | profile、store binding、adapter availability、topic map、redaction deny list | P0 不允许 | 启动后改变会破坏 adapter / store / UoW 一致性 |
| job-run-start config | 每次 job run 开始时冻结的运行参数 | batch size、parallelism、timeout、retry / backoff、target availability snapshot | 不属于 hot update;只随新 job run 生效 | job 中途改变会导致 report 不可复核 |
| entry-local parameters | 只影响当前入口或当前请求 / job 的本地参数 | config source selector、profile selector、job request source、dry-run diagnostic mode | 不属于 hot update;只影响当前 entry | 如果覆盖全局配置或业务 scope,会绕过 typed DTO |
| policy-like technical knobs | 技术执行策略,不等同 Artifact domain policy | retry、retention、dedup window、page limit、timeout | P0 startup 或 job-run-start 冻结 | 误用于改变 formal-only / baseline / visibility 规则 |
| sensitive ref config | 普通配置只保存 ref,raw secret 由安全设施处理 | credential ref、endpoint ref、secret provider ref、handoff destination ref | P0 不允许 raw secret hot update | raw secret / endpoint body 泄露到 config、log、audit 或 report |
| diagnostic / redaction config | 控制安全诊断输出和 forbidden field 扫描 | safe diagnostic refs、redaction deny list、metric label allowlist | P0 startup 冻结 | 诊断放宽会泄露 forbidden body 或高基数字段 |
| test fixture / deterministic config | 支撑 local / CI 可复现测试 | fake adapter、in-memory store、fixed clock、sequence id、fixture source | 仅测试 entry 生效 | 进入 production-like profile 会伪造外部成功 |
| feature / peripheral enablement | 控制外围能力是否启用 | trace available event emission、derived view event emission、archive / sync handoff enabled | P0 startup 冻结 | 若控制核心 accepted path,会改变业务语义 |

### 8.2 更新时机边界表

| 更新时机 | 允许内容 | 禁止内容 | 生效规则 |
|---|---|---|---|
| static / design-time | 架构红线、truth boundary、protocol schema、state matrix、transaction ordering | 作为 JSON / env / flag 配置 | 只能通过正式设计变更和实现提交生效 |
| startup / cold update | profile、store、adapter、topic、redaction、boundary、retention、clock/id、feature peripheral enablement | 启动后无审计替换核心 adapter / store | 重新启动并重新 validate 后生效 |
| job-run-start | job batch、timeout、retry、parallelism、target availability snapshot、report ref | job 运行中改变 scope / mutation semantics | 新 job run 冻结,写入 report / receipt |
| entry-local | config source selector、profile selector、job request source、output root、dry-run diagnostic selection | 改写全局 config、truth scope、state transition、actor visibility、job metadata | 只对当前入口有效 |
| hot runtime update | P0 无核心 hot update | store / adapter / topic / redaction / idempotency / truth invariant hot change | 需要未来新增 `03` reload contract 后才可启用 |

### 8.3 禁止配置化项表

| 禁止配置化项 | 原因 | 设计来源 | 如需改变应走什么流程 |
|---|---|---|---|
| Artifact truth 归属 | 防止 work / process / governance / runtime / archive / observability 反向定义 Artifact 事实 | `00` 数据归属;`01` 数据所有权;`03` §12 | 修改 `00/01/02/03` truth boundary,再同步测试 / 验收 / 实施 |
| 外部正文排除 | 防止保存 method、runtime、archive、observability、sync 或外部内容正文 | `00` 禁止保存正文;`03` forbidden field | 修改需求和详细对象契约,不得由配置放宽 |
| formal-only version / lineage / baseline 锚点 | 防止 current latest、trace、report 或外部集合替代正式锚点 | `02` 核心对象;`03` 状态矩阵 | 修改概要 / 详细对象和状态设计 |
| baseline 只冻结正式 version | 防止候选、自动化临时产物或外部状态进入 baseline | `02` 配置红线;`03` baseline flow / state | 修改业务规则、flow 和状态矩阵 |
| automation candidate-only boundary | 防止 runtime / capability 输出直接变成 Artifact truth | `02` 配置红线;`03` automation boundary | 修改 automation flow、对象契约和测试 |
| domain state matrix | 防止 profile 改变合法迁移 | `03` §10 状态矩阵 | 修改 Step 10 状态矩阵和 domain tests |
| actor / metadata / visibility guard | 防止配置绕过授权、责任和可见性 | `03` command/query flow | 修改安全 / visibility 设计和测试 |
| command metadata / idempotency requirement | 防止 accepted mutation 无法 replay 或恢复 commit unknown | `03` §7 / §13 | 修改协议 envelope、idempotency repository 和 flow |
| accepted trace / audit / relay / stored result | 防止 accepted truth 无法追溯、传播或 duplicate replay | `03` §9 / §11 / §15 | 修改 accepted flow、持久化和观测契约 |
| outbox payload snapshot 来源 | 防止 publisher 从 current truth 临时重构 payload | `03` §8 / §11 / Step 14 | 修改 outbox record / payload contract |
| repository expected_version / UoW ordering | 防止配置关闭 optimistic concurrency 或事务顺序 | `03` §11 | 修改 repository contract 和 consistency tests |
| query no-write | 防止 query 修复 projection、reference、truth、outbox 或 report | `02` query 边界;`03` query flow | 修改 query protocol 和 flow |
| projection / reconciliation no-truth-repair | 防止后台维护成为隐式 command | `02` derived maintenance;`03` jobs | 修改 job flow 和 truth ownership |
| handoff / archive / sync no-truth-repair | 防止下游接收状态定义 Artifact truth | `01` handoff 边界;`03` jobs | 修改 handoff / export object contract |
| duplicate replay stored surface | 防止 duplicate key 重新运行 mutation | `03` §13 | 修改 idempotency / result surface 和 tests |
| non-core Cargo dependency discipline | 防止 L1 / L2 / L3 / L4 仓源码依赖形成耦合 | `01` 依赖方向;`03` §3 | 修改架构依赖裁剪和 workspace policy |
| raw secret / raw endpoint / raw payload output | 防止敏感材料进入配置、日志、审计、报告或 artifacts | `00` 安全;`03` §14 / §15 | 修改 security / redaction design,不得只改配置 |
| event kind / protocol schema / topic-neutral key | 防止 transport topic 改变 public event 语义 | `03` §8 / Step 14 | 修改 contracts event schema 和 compatibility plan |
| fake adapter semantic shortcut | 防止 fake 跳过正式 version、state、receipt、outbox 或 marker | `03` infra contract | 修改 fake adapter tests 和 service flow |

### 8.4 按配置域组织的分类边界表

| 配置域 | 适用配置类别 | 不适用类别 | 禁止配置化项 | 原因 |
|---|---|---|---|---|
| runtime profile selection | startup runtime config;entry-local profile selector;test fixture config | hot runtime update;domain policy config | truth ownership、state matrix、core accepted semantics | profile 只选择 adapter / store 组合 |
| runtime config identity | startup runtime config;diagnostic config | sensitive raw config;business scope config | raw secret、raw URL、raw topic、external body | config identity 只保存 redacted ref / digest |
| adapter availability registry | startup runtime config;feature enablement | domain state config | formal-only anchor、truth lifecycle | availability 只影响 dependency surface |
| truth store binding | startup runtime config;sensitive ref config | hot update;domain policy config | truth schema、expected_version、UoW ordering | store 只承载 truth,不改变 truth |
| projection store binding | startup runtime config;job-run-start rebuild knobs | query-time repair config | query no-write、projection no-truth-repair | projection 是 derived view |
| reference / mirror store binding | startup runtime config;job-run-start refresh knobs | external body config | external body exclusion、formal anchor auto-accept | snapshot 只保存 ref / summary / state |
| relay store binding | startup runtime config;publisher job knobs | payload reconstruction config | outbox snapshot source、publish failure rollback | publisher 只读 stored payload |
| idempotency / result store binding | startup runtime config;policy-like technical knobs | disable replay config | idempotency key、stored replay、commit unknown recovery | duplicate replay 是协议不变量 |
| source resolver family binding | startup runtime config;sensitive ref config;test fixture config | non-core Cargo dependency config | sibling body import、source truth ownership | resolver 只返回 body-free snapshot |
| inbound consumer binding | startup runtime config;policy-like dedup window | command emulation config | consumer 不写核心 truth、schema version guard | consumer 只写 snapshot / marker / receipt |
| publisher adapter binding | startup runtime config;job-run-start retry knobs | event schema config | event kind、payload DTO、source identity | publisher 不定义 event schema |
| transport topic binding | startup runtime config;sensitive ref config | event semantics config | topic-neutral key、schema version | topic 只映射 transport route |
| job runner binding | job-run-start config;policy-like technical knobs | core mutation config | job no-truth-repair、duplicate stored report | job 只维护 marker / report / derived state |
| projection rebuild binding | job-run-start config | truth repair config | projection 不反写真相 | rebuild replace view only |
| reference refresh binding | job-run-start config;source resolver binding | external body / auto-decision config | body exclusion、formal anchor boundary | refresh 不创建 truth |
| reconciliation binding | job-run-start config;diagnostic config | auto-fix truth config | reconciliation no-truth-repair | report issue,不改 truth |
| archive handoff binding | startup runtime config;sensitive ref config;job-run-start target snapshot | accepted truth config | archive package body、truth dependency on archive success | archive 失败不回滚 truth |
| observability handoff binding | startup runtime config;sensitive ref config;job-run-start target snapshot | accepted truth config | observability body、handoff no-truth-repair | handoff 是外围交接 |
| sync handoff binding | startup runtime config;sensitive ref config;job-run-start target snapshot | truth replication config | sync private copy truth | sync 只消费正式 surface |
| redaction / safe output binding | startup runtime config;diagnostic config | hot relax config | forbidden body、raw secret、高基数字段 | 安全输出必须启动前校验 |
| boundary limits | startup runtime config;entry-local read constraints where allowed | authorization override config | actor、metadata、visibility、idempotency guard | limits 只能拒绝或截断 |
| clock / id adapter binding | startup runtime config;test fixture config | handler / domain id synthesis config | id source、time source、DB default time | id/time 由 port 注入 |
| test fake profile binding | test fixture / deterministic config | production-like override | fake semantic shortcut、state / version skip | fake 必须遵守正式语义 |
| environment profile binding | startup runtime config;profile matrix | domain invariant config | truth、state、transaction、dependency discipline | profile 表达环境差异,不改领域语义 |

### 8.5 分类边界停审记录

| 配置域 / 禁止项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| runtime / profile | 类别、更新时机、禁止项是否清楚 | 通过 | P0 无 hot update |
| store binding | 是否把 store 选择与 truth schema 分离 | 通过 | 产品选择留 Step 13 / 14 |
| adapter binding | disabled / degraded 是否不改业务语义 | 通过 | 只影响 dependency surface |
| topic / publisher | topic 是否只做 transport route | 通过 | event schema 不可配置 |
| jobs | job knobs 是否不改变 mutation 语义 | 通过 | scope / report 由 typed job DTO / report surface 承载 |
| sensitive refs | raw secret 是否仍被排除 | 通过 | Step 8 继续展开存储 / 轮换 / 审计 |
| diagnostic / redaction | 诊断是否不能放宽 forbidden body | 通过 | deny list / safe refs 由 Step 8 / 9 继续定义 |
| test fixture | fake 是否不跳过正式状态 | 通过 | Step 6 / 7 需保持 local / CI profile 限定 |
| feature enablement | feature 是否只控制外围能力 | 通过 | 不允许关闭核心 accepted flow |
| forbidden boundaries | 是否回指上游不变量 | 通过 | 后续正式 `04` 必须保留表格 |

### 8.6 跨分类 / 禁止项审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在 P0 hot update | 无 | P0 仅 startup / job-run-start / entry-local |
| 是否把 Artifact domain policy truth 当作配置 | 无 | policy-like knobs 仅指 retry / retention / timeout |
| 是否把 feature flag 用于核心语义 | 无 | feature 只控制外围 relay / handoff / derived event |
| 是否把 test override 带入 production-like | 无 | test fixture 仅 local / CI / deterministic |
| 是否遗漏 Step 3 配置域 | 无 | Step 3 配置域均进入 §8.4 |
| 是否遗漏 `03` 禁止配置化边界 | 无 | `03` §13 / Step 14 全部进入 §8.3 |
| 是否存在分类互相冲突 | 无 | startup / job-run-start / entry-local 边界已区分 |
| 是否需要回写 `03` | 未发现 | 当前只分类既有绑定点,不新增 runtime reload 或 config field |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 不支持核心 hot update,配置通过 startup / new job run / entry-local 生效 | 否 | 承接当前 `03` 未定义 reload contract | 不适用 | 无回写 |
| static design boundary 不是配置项,只能通过正式设计变更改变 | 否 | 重申上游不变量 | 不适用 | 无回写 |
| policy-like technical knobs 不等同 Artifact domain policy truth | 否 | 分类澄清 | 不适用 | 无回写 |
| feature enablement 只控制外围 relay / handoff / derived capability,不改变 accepted truth | 否 | 承接 Step 14 feature section | 不适用 | 无回写 |
| 若未来需要 hot reload、动态 adapter replacement 或配置改变 core flow | 是 | runtime contract / builder / flow 变更 | `03` §4 / §5 / §13 / Step 14 | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_04_categories_boundaries.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置分类表”“更新时机边界表”“禁止配置化项表”“按配置域组织的分类边界表”“分类边界停审记录”和“跨分类 / 禁止项审计表”小节,了解配置类别和禁止配置化边界如何从 Step 3 控制面收敛。

正式 `04-配置设计.md` §4 应回填:

- 配置分类表。
- 更新时机边界表。
- 禁止配置化项表。
- 按配置域组织的分类边界表。
- 分类边界停审记录。
- 跨分类 / 禁止项审计表。
- 对详细设计的影响判定。

回填要求:

- 不得写具体配置 key、env var、默认数值、secret provider 或部署命令。
- 不得把 hot update 写成 P0 能力。
- 不得把 Artifact domain policy、formal-only、state matrix 或 baseline freeze 当作配置项。
- 禁止配置化项必须保留“如需改变应走正式设计变更”的口径。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 是否未来需要 hot reload / last-known-good config | 影响 runtime builder、config validator、audit 和 rollback contract | P0 不支持;Step 13 / 14 作为演进风险 |
| production-like profile 是否允许 dynamic adapter replacement | 影响 adapter registry、UoW 和 in-flight job 语义 | P0 不支持;后续需要 ADR / `03` 回写 |
| feature flags 的最终默认值 | 影响 trace available / derived view / archive / sync handoff | Step 7 配置项清单定义 |
| sensitive ref 与 raw secret provider 的边界 | 影响 Step 8 密钥管理 | Step 8 正式定义 |
| 禁止配置化项是否需要进入验收 veto | 影响 `06-验收标准.md` | Step 12 给下游承接输入 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置类别已定义 | 通过 | 见 §8.1 |
| 更新时机和 P0 hot update 口径已明确 | 通过 | P0 无核心 hot update |
| 禁止配置化项已列出并回指设计来源 | 通过 | 见 §8.3 |
| 每个配置域适用 / 不适用类别已明确 | 通过 | 见 §8.4 |
| 分类边界已停审 | 通过 | 见 §8.5 |
| 跨分类 / 禁止项审计没有 unresolved 冲突 | 通过 | 见 §8.6 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 5 | 通过 | 下一步定义配置来源、优先级与冲突处理 |
