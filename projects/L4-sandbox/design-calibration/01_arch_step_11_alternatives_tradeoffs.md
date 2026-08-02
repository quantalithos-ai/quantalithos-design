# Step 11. 备选方案与取舍

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 11
> 回填章节: `01-架构设计.md` §12 备选方案与取舍
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 11 | pass。用户已确认 Step 10 `关键技术选型`,可进入 Step 11。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `01_architecture_calibration_flow.md` 和 Step 2 / 3 / 6 / 7 / 8 / 9 / 10 中间产物。 |
| 是否已读取架构 SOP Step 11 与书写规范 §4.12 | pass。已读取备选方案、路径级比较、方案边界说明和轻量取舍对照表要求。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md`,重点校验 §12 接口依赖、§13 非功能、§14 验收和 §15 风险。 |
| 是否已参考 L1 粒度 | pass。已参考 `projects/L1-artifact/design-calibration/01_arch_step_11_alternatives_tradeoffs.md` 和 `projects/L1-governance/design-calibration/01_arch_step_11_alternatives_tradeoffs.md` 的路径级组织方式,不复制其结论。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` §9 / §10 / §11 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_11_alternatives_tradeoffs.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

把 `L4-sandbox` 当前主线架构方案与主要相邻替代路径放到同一判断框架下比较,说明为什么选择当前主线,为什么不采用其他路径,以及当前选择牺牲了什么、换来了什么。

本步只比较架构层路径级替代关系,不写产品横评、局部实现对比、愿望池、API / RPC / SDK 形态、event / topic / outbox / retry、数据库、对象存储、OTel、secrets、后端产品、安全 profile、配置 key、部署脚本、测试用例或实施 boundary。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_02_goals_constraints.md` | 已完成并经用户确认 | 承接受控执行隔离事实、coherent boundary、fail-closed、capture / handoff、cleanup / redline 和统一语义目标。 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成并经用户确认 | 承接 sandbox 做 / 不做、易混淆职责和边界红线,防止把边界外职责重新包装为有效备选方案。 |
| `01_arch_step_06_container_deployment.md` | 已完成并经用户确认 | 承接同步入口、异步控制消费、受控执行承接、后台维护清理、truth / material 状态承载和 isolation backend 边界。 |
| `01_arch_step_07_dependency_direction.md` | 已完成并经用户确认 | 承接核心语义、编排承接、外部接缝、本地影子 / 派生辅助、技术承载和 `L0-core` 唯一编译期依赖口径。 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成并经用户确认 | 承接 execution isolation truth、ref / summary / derived / forbidden body 分层和一致性口径。 |
| `01_arch_step_09_interactions_communication.md` | 已完成并经用户确认 | 承接同步 / 异步 / 后台三类路径分离和失败降级语义。 |
| `01_arch_step_10_technology_choices.md` | 已完成并经用户确认 | 承接机制级关键技术选型和当前不采用口径。 |
| `projects/L4-sandbox/00-需求文档.md` §12~§15 | 当前正式需求基线 | 校验接口依赖、NFR、验收、一票否决项、风险和待确认事项。 |
| 旧 `projects/L4-sandbox/README.md` | historical material | 诊断 Docker + gVisor、SandboxService、audit events、seccomp / AppArmor 和旧指标是否污染路径比较。 |
| 旧 `projects/L4-sandbox/01-架构设计.md` §9 / §10 / §11 | historical material | 诊断旧统一服务 + 多 backend、各调用方自实现、只 Docker、fallback、allowlist 和 audit sink 横评是否可继承。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 2 / 3 / 6 / 7 / 8 / 9 / 10、SOP Step 11 和书写规范 §4.12 | done | 本文件 §1、§3 |
| 读取正式 00 的接口、非功能、验收和风险段,并审计旧 README / 旧 `01` 的取舍污染点 | done | 本文件 §5、§6 |
| 回答主要可选方案、当前选择理由、被放弃方案优点、不采用原因和当前取舍 | done | 本文件 §5 |
| 输出当前主线方案、方案路径比较表、不进入比较方向、轻量取舍表和方案边界说明短文 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 11 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 这个仓有哪些主要可选架构方案?

当前主线方案是:

> 以独立 execution isolation truth 为核心,通过正式承接边界、execution environment identity、coherent boundary、抽象 isolation backend 承载契约、给定 policy 执行与 fail-closed、truth / ref / body-free summary / derived separation、核心强一致 + 外围最终一致、同步 / 异步 / 后台分离、capture / handoff 分层、稳定 failure / control 分类、lease / orphan / cleanup guard / reaper、redline containment、幂等顺序保护和 traceability / audit backref 构成运行隔离基础架构。

值得进入本章比较的相邻替代路径是:

| 替代路径 | 是否进入本章比较 | 判断 |
|---|---|---|
| 调用方自管 sandbox 逻辑路径 | 是 | 与统一 execution isolation truth 和跨调用方同一语义主线构成结构性替代。 |
| isolation backend 产品主导路径 | 是 | 与抽象 backend 承载契约和 coherent boundary 裁定主线构成替代。 |
| 统一协议 / 服务接口主导路径 | 是 | 与先固定 sandbox 语义、协议外形后置的主线构成替代。 |
| policy / allowlist gate 主导路径 | 是 | 与给定 policy 执行、policy truth 外部拥有的主线构成替代。 |
| observability / audit event 主导路径 | 是 | 与 sandbox truth / material 状态承载和 handoff fact 主线构成替代。 |
| 全同步执行生命周期路径 | 是 | 与同步受理裁定 + 后台执行生命周期 + 异步传播主线构成替代。 |
| 全异步事件化 sandbox 路径 | 是 | 与核心受理 / 身份 / 边界 / policy 必须即时成立或拒绝主线构成替代。 |
| availability / backend fallback 优先路径 | 是 | 与边界可落实性优先、不能 silent degrade 的主线构成替代。 |
| cleanup / reaper 运维私有路径 | 是 | 与 cleanup guard / reaper / redline containment 正式架构主线构成替代。 |
| 具体 Docker、gVisor、Firecracker、local_process、数据库、消息、OTel、seccomp / AppArmor、P95 数字 | 否 | 属于产品、配置、实现、测试或运营指标,不是本章路径级方案。 |
| sandbox 拥有 tools / runtime / member / artifact / observability / policy 正文 truth | 否 | 已被职责、数据和依赖边界排除,不再作为有效备选方案。 |

### 5.2 为什么当前选择这一种?

当前主线能同时满足五个硬目标:

1. `L4-sandbox` 拥有独立 execution isolation truth,不被调用方、后端、事件、观测、policy 来源或下游材料消费替代。
2. 真实执行开始前必须形成正式受理语境、execution environment identity、责任链、coherent boundary 和给定 policy 裁定。
3. resource / filesystem / network / process 边界由 sandbox 统一表达和裁定,后端能力不足时显式拒绝、等待或保守失败。
4. captured output、candidate material、observability material 和 handoff fact 分层交接,不静默升级为 Artifact、ToolResult、observability store 或 evidence truth。
5. timeout、deny、backend failure、capture failure、orphan、cleanup、reaper 和 redline 不作为调用方或 SRE 补偿脚本处理,而进入同一失败 / 控制 / 清理 / 安全收束链。

其它路径通常只优化某一面:更快实现、后端选择更直接、接口心智更统一、policy gate 更集中、观测展示更早、同步体验更简单、异步扩展更强、可用性看似更高或运维脚本更轻。但这些收益会牺牲 sandbox 最关键的边界一致性、truth ownership、fail-closed、材料分层、cleanup guard 和跨调用方同一语义。

### 5.3 被放弃方案的主要优点是什么?

| 被放弃方案 | 主要优点 |
|---|---|
| 调用方自管 sandbox 逻辑路径 | tools、runtime、member-service、runner 可就近实现,初期 adapter / 接缝成本低。 |
| isolation backend 产品主导路径 | 后端能力、配置、安全 profile 和部署想象直接,落地路径更像基础设施工程。 |
| 统一协议 / 服务接口主导路径 | 调用方心智统一,API / SDK 目录和复用方式更早显化。 |
| policy / allowlist gate 主导路径 | 网络、文件、进程等高风险边界控制看起来集中,策略放行路径直观。 |
| observability / audit event 主导路径 | 审计展示、告警、trace 和事件回放体验更早显化。 |
| 全同步执行生命周期路径 | 调用方即时感强,短链路结果更容易理解。 |
| 全异步事件化 sandbox 路径 | 入口压力低,执行、交接和下游消费更解耦。 |
| availability / backend fallback 优先路径 | 表面可用性更高,后端单点故障时看似可以继续服务。 |
| cleanup / reaper 运维私有路径 | 核心服务初期更轻,清理逻辑可由脚本或运行环境先兜底。 |

### 5.4 为什么即便有这些优点,当前仍不采用?

这些优点主要来自短期实现便利、接口显化、产品能力、操作体验或局部可用性,但 `L4-sandbox` 的首要问题不是“尽快跑起一个命令后端”,而是“守住可归责、可裁定、可捕获、可收束的运行隔离事实”。一旦选择调用方自管、后端产品主导、协议主导、policy gate 主导、事件审计主导、全同步或全异步主线,后续会很难恢复 execution environment identity、coherent boundary、policy fail-closed、capture / handoff 分层、cleanup guard、redline containment 和同一正式语义。backend fallback 与运维私有 cleanup 更危险,因为它们可能把弱隔离、宿主直跑、先删证据或 advisory-only redline 包装成可用性优化。

### 5.5 当前选择牺牲了什么,换来了什么?

| 当前方案牺牲 | 当前方案换来 |
|---|---|
| 初期接入路径更长,调用方必须经正式边界进入 | 调用方不会形成第二套 sandbox 入口、policy、capture 或 cleanup 语义。 |
| 后端产品不能直接成为主模型 | resource / filesystem / network / process boundary 由 sandbox coherent 裁定,不可 silent degrade。 |
| 协议、SDK、event、outbox 和 API 形态不能提前定稿 | 架构语义不被局部接口外形反向固定。 |
| policy 来源、allowlist、approval 和 capability 不能本地化为 sandbox truth | sandbox 只拥有执行裁定事实,不吞并治理或能力来源。 |
| 观测、审计和下游消费会有 handoff / pending / failed 状态 | observability store 和 bus event 不替代 sandbox truth。 |
| 后台维护、cleanup guard 和 redline containment 成为正式复杂度 | cleanup 不先删证据,孤儿环境不脱管,redline 不只是提示。 |
| fallback 空间被强约束 | 可用性不能以弱隔离、宿主直跑或边界放宽为代价。 |

---

## 6. 当前材料问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 README | 写“至少 Docker + gVisor 两种隔离后端”和 Firecracker / runc 等后端线索。 | 把产品组合误写成方案主线。 | 改为 `isolation backend 产品主导路径` 的历史替代,当前不采用。 |
| 旧 README / 旧 `01` | 写统一 `SandboxService`、RPC / SDK、runner / runtime 共用接口。 | 协议外形早于 Step 9 / 10 的语义收敛,会反向约束架构。 | 改为 `统一协议 / 服务接口主导路径` 的替代,当前不采用为主线。 |
| 旧 `01` §9 | 把 Docker + gVisor、deny-by-default、统一 SandboxService 分别写成 ADR 级选型。 | 单项技术和协议横评替代了路径级取舍。 | 本步按结构性方案路径重新比较。 |
| 旧 `01` §10 | 用“统一服务 + 多 backend / runtime-runner 各自实现 / 只 Docker”做简单矩阵。 | 粒度过粗,缺少 truth、依赖、数据、一致性、cleanup 和 redline 取舍。 | 扩展为 execution isolation truth 主线与相邻路径比较。 |
| 旧 `01` §11 | 写 backend fallback、audit backlog / replay、seccomp / AppArmor、旧 P95 / SLA。 | 混入横切、实现、配置、测试和运营指标。 | 只作为 historical contamination,不进入正式路径主表。 |
| 前序 Step | 已排除 tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store 和 policy definition truth。 | 不能把已排除事项重新包装为备选方案。 | 列入“不进入本章正式比较的方向”。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 方案主语 | 统一 SandboxService、多 backend、只 Docker、allowlist、audit event、fallback。 | 独立 execution isolation truth 主线与结构性替代路径。 | 对齐书写规范 §4.12 的路径级比较要求。 |
| 后端选择 | 产品组合被当成当前方案。 | 后端产品主导路径被比较但不采用,当前采用抽象 backend 承载契约。 | 后端能力不能反向定义 coherent boundary。 |
| 接口选择 | RPC / SDK / 统一服务被当成架构核心。 | 协议主导路径不采用,当前只固定同步 / 异步 / 后台语义。 | 协议外形后置到概要 / 详细设计。 |
| policy 选择 | allowlist lookup 和 deny-by-default 被写成主线。 | policy / allowlist gate 主导路径不采用,当前只执行给定 policy 并 fail closed。 | policy truth 不能进入 sandbox。 |
| 观测审计 | audit event / sink / backlog / replay 被写成事实链。 | observability / audit event 主导路径不采用,当前保留 material / handoff / backref。 | 观测和事件不能替代 truth store。 |
| cleanup / redline | 分散在运维或横切策略中。 | cleanup / reaper 运维私有路径不采用,当前纳入正式架构主线。 | 非 happy path 是 sandbox 核心闭环。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧统一服务 + 多 backend + audit event 矩阵 | 文字少,接近旧文档。 | 产品、协议、事件和可用性策略混在一起,无法承接新版 truth / cleanup / redline 边界。 | 不采用。 |
| 方案 B: 按结构性替代路径比较当前主线 | 能解释当前方案为什么成立,也能说明被放弃路径的真实代价。 | 表格较长,后续仍需 `02/03/04/07` 下沉对象、接口、配置和实施边界。 | 采用。 |
| 方案 C: 加入 Docker、gVisor、Firecracker、数据库、消息、OTel、seccomp / AppArmor 横评 | 实施想象更直接。 | 违反本章边界,会提前锁定产品和配置。 | 不采用。 |
| 方案 D: 把所有未来增强都列为备选方案 | 看起来完整。 | 会把愿望池、外围增强和正式取舍混在一起。 | 不采用。 |

### 8.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 当前是否以调用方自管隔离逻辑作为主线 | A. 是;B. 否,采用统一 execution isolation truth | B | 调用方自管会形成第二套 sandbox 语义。 | 本步采用 B。 |
| 当前是否以后端产品组合作为主线 | A. 是;B. 否,采用抽象 backend 承载契约和能力裁定 | B | 当前硬目标是边界可落实,不是某个产品组合。 | 本步采用 B。 |
| 当前是否以统一 RPC / SDK 作为主线 | A. 是;B. 否,只固定同步 / 异步 / 后台交互语义 | B | 协议外形后续再定,不能反向定义 truth。 | 本步采用 B。 |
| 当前是否以 audit event / observability sink 作为 truth 主线 | A. 是;B. 否,只保留 material handoff 和 backref | B | 观测消费不能替代 execution isolation truth。 | 本步采用 B。 |
| 当前是否允许 backend fallback 优先 | A. 是;B. 否,只有同等边界可落实才可后续讨论 | B | fallback 不能变成 silent degrade 或宿主直跑。 | 本步采用 B。 |

---

## 9. 结构化中间产物

### 9.1 当前主线方案

当前采用的主线方案是:

```text
独立 execution isolation truth 核心
  + 正式承接边界隔离外部执行请求
  + execution environment identity / responsibility chain
  + resource / filesystem / network / process coherent boundary
  + abstract isolation backend carrier contract
  + given launch / isolation policy execution + fail-closed
  + truth / external ref / body-free summary / derived separation
  + 核心强一致 + 外围最终一致 + ref validity + guard / containment priority
  + 同步受理 / 裁定 / 读取,异步传播 / handoff,后台执行生命周期 / cleanup / reaper
  + capture fact / candidate material / handoff fact 分层
  + stable failure classification / control fact 收束
  + lease / orphan / cleanup guard / reaper
  + redline containment / investigation handoff
  + idempotency / ordering / traceability / audit backref
  + read-only local shadow / derived auxiliary
```

该方案的核心判断是:sandbox 必须先拥有一套独立、可归责、可裁定、可收束的运行隔离事实,再通过正式接缝与调用方、policy 来源、后端、artifact、observability、runtime、runner 和 bus 协作。后端、协议、事件、观测、fallback、cleanup 脚本和外围增强都不能反向定义这套事实。

### 9.2 方案路径比较表

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 独立 execution isolation truth + 正式边界协作主线 | 在多调用方、多后端、多下游材料消费中保持受控执行隔离事实统一、可归责、可裁定、可收束。 | 同时保护 execution identity、coherent boundary、policy fail-closed、capture / handoff、cleanup guard、redline containment 和跨调用方同一语义。 | 增加正式承接、状态表达、后台维护、handoff、幂等、追溯和下沉设计成本。 | 采用 | 这是当前主线方案,最符合 Step 2~10 已收敛约束。 |
| 调用方自管 sandbox 逻辑路径 | 让 tools、runtime、member-service、runner 各自就近承接隔离执行。 | 初期接入短,调用方可按自身流程优化。 | 会形成多套受理、policy、capture、failure、cleanup 和 redline 语义,难以对账。 | 不采用 | 调用方只能作为消费者或协作方进入正式边界。 |
| isolation backend 产品主导路径 | 直接围绕后端能力、后端配置和后端生命周期组织 sandbox。 | 承载实现直观,基础设施团队容易理解。 | 后端产品会反向定义 boundary,后端能力不足时容易 fallback、弱隔离或 silent degrade。 | 不采用 | 后端必须服从抽象承载契约和 coherent boundary 裁定。 |
| 统一协议 / 服务接口主导路径 | 通过统一 RPC / SDK / API 外形保证调用方复用。 | 接口目录清晰,调用心智统一。 | 协议外形会早于 truth、数据和交互语义定稿,后续难以表达异步、后台和 handoff 边界。 | 不采用 | 当前只固定统一 sandbox 语义,协议外形后置。 |
| policy / allowlist gate 主导路径 | 用集中 policy gate 组织网络、文件、进程和高风险动作放行。 | 安全控制入口看起来集中,deny-by-default 表达直观。 | allowlist、approval、capability 或 policy DSL 可能被 sandbox 接管,policy truth 边界被打穿。 | 不采用 | sandbox 只拥有给定 policy 下的执行裁定和 fail-closed fact。 |
| observability / audit event 主导路径 | 用审计事件、trace、metric 和 event stream 串起执行全链路。 | 展示、告警、追溯和排障体验更早显化。 | 事件或观测存储会靠近 truth center,传播失败可能被误解为 truth 丢失或成功。 | 不采用 | observability 只消费 material;truth / material 状态承载仍归 sandbox。 |
| 全同步执行生命周期路径 | 从受理到执行、capture、handoff、cleanup 都在同步边界内完成。 | 调用方即时感强,短链路语义简单。 | 长时执行、下游交接、cleanup guard 和 redline 调查会阻塞入口或被伪同步成功。 | 不采用 | 同步只用于受理、裁定、读取和控制意图,生命周期可后台承接。 |
| 全异步事件化 sandbox 路径 | 通过事件解耦入口、执行、结果交接和控制。 | 入口压力低,吞吐和跨边界传播空间大。 | 受理、身份、边界、policy 和高风险控制缺少即时成立 / 拒绝口径。 | 不采用 | 核心裁定必须有同步收口,已成立事实再异步传播。 |
| availability / backend fallback 优先路径 | 以后端切换和 fallback 最大化执行可用性。 | 后端故障时表面服务连续性更强。 | fallback 若未证明同等边界,会导致弱隔离、宿主直跑、policy 绕过或 silent degrade。 | 不采用 | 可用性不能越过边界可落实性和 fail-closed。 |
| cleanup / reaper 运维私有路径 | 把清理、孤儿回收和安全处理交给 SRE 脚本或后端环境兜底。 | 核心链路短,初期实现轻。 | cleanup 先删证据、孤儿环境托管外运行和 redline advisory-only 风险无法被架构收束。 | 不采用 | cleanup guard、reaper 和 redline containment 是正式后台维护主线。 |
| 派生 / inspect / preview / trend first 路径 | 优先建设调查、预览、承载比较和容量趋势能力。 | 运维体验和调试体验更早显化。 | 派生读模型可能反写核心 truth,也可能把外围增强变成核心通过前提。 | 不采用 | 这些能力只能作为只读派生辅助,不反写真相。 |

### 9.3 不进入本章正式比较的方向

| 方向 | 不进入比较的原因 | 正确处理 |
|---|---|---|
| Sandbox 拥有 ToolDefinition、ToolPolicy、ToolInvocationResult 或 tools semantic execution | 已被职责边界和数据所有权排除。 | `L2-tools` 拥有工具语义,sandbox 只提供隔离执行材料。 |
| Sandbox 拥有 ExecutionInstance、agent loop、recover 或 runtime result truth | 已被职责边界和依赖裁剪排除。 | `L2-runtime` 消费 sandbox failure / capture / control 材料。 |
| Sandbox 拥有 MemberExecutionHost、SandboxBinding 或 host lifecycle | 已被职责边界排除。 | `L2-member-service` 拥有宿主装配 truth。 |
| Sandbox 拥有 Artifact、baseline、formal evidence 或 observability store truth | 已被数据所有权排除。 | sandbox 只拥有 capture fact、candidate material 和 handoff fact。 |
| Sandbox 拥有 policy definition、approval、allowlist、capability 或 policy DSL | 已被 policy 边界排除。 | 外部 policy sources 提供给定 policy / authorization,sandbox 形成执行裁定。 |
| 宿主直跑、`local_process` 或低隔离路径作为正式生产后端 | 违反宿主直跑和边界 silent degrade 零容忍。 | 只能作为受限 fake / fixture 或历史污染诊断,不得成为正式路径。 |
| 具体数据库、消息、对象存储、OTel、secrets、GRC、seccomp / AppArmor / cap drop、P95 / SLA | 产品、配置、测试或运营层选择,不是路径级替代。 | 后续 `03/04/05/06/07` 或 ADR 再收敛。 |
| event name、topic、outbox、backlog、replay、retry、API path、DTO、handler、adapter | 局部实现机制,不改变本章主线结构判断。 | 后续概要 / 详细 / 测试 / 实施阶段处理。 |

### 9.4 轻量取舍对照表

| 当前方案得到 | 当前方案失去 |
|---|---|
| 独立 execution isolation truth 和清晰 truth owner | 调用方就地实现的短期便利。 |
| resource / filesystem / network / process coherent boundary | 后端产品直接定义边界的快速实现心智。 |
| 给定 policy 执行与 fail-closed | sandbox 内建 allowlist / policy DSL / approval 的集中感。 |
| capture / candidate / handoff 分层 | 结果直接成为 artifact / tool / observability truth 的短链路。 |
| 同步 / 异步 / 后台职责分离 | 全同步即时完成或全异步彻底解耦的单一模型。 |
| cleanup guard / reaper / redline containment | 运维私有脚本带来的核心链路轻量。 |
| 幂等、顺序、traceability 和 audit backref | 需要显式维护 failed / pending / retryable / containment 状态。 |
| 边界可落实性优先 | fallback 带来的表面高可用。 |

### 9.5 方案边界说明短文

本章只比较会改变 `L4-sandbox` 主线结构的相邻替代路径,不比较产品、框架、协议、数据库、消息、后端配置、安全 profile、指标或实现目录。tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store、policy definition truth、host-run / local_process 等已被前序 Step 排除的事项,不再包装为有效备选方案。旧 Docker/gVisor、SandboxService、allowlist lookup、audit event、backend fallback 和旧 P95/SLA 只作为 historical material 诊断输入,不直接继承为当前取舍结论。当前方案的核心取舍是牺牲短期直接性、产品主导心智和表面可用性,换取执行隔离真相、边界一致性、fail-closed、安全捕获、清理守卫和长期演进空间。

---

## 10. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §12 “备选方案与取舍”直接摘录并整理本文件 §9.1、§9.2、§9.3、§9.4 和 §9.5。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 11. 待确认事项

### 11.1 待确认项处理建议

| 待确认项 | 推荐处理 | 当前状态 |
|---|---|---|
| 具体 isolation backend 产品组合是否进入当前架构主线 | 保持“抽象 backend 承载契约 + 能力裁定”口径,产品组合后移 `04/07`。 | 本步已收敛,不阻塞 Step 12。 |
| 调用方是否必须同一协议外形 | 保持“同一 sandbox 语义,协议后置”口径,后续 `02/03` 再细化。 | 本步已收敛,不阻塞 Step 12。 |
| policy / authorization 来源矩阵如何定义 | 保持外部 policy sources 接缝,后续概要 / 详细设计细化来源矩阵。 | 本步已收敛,不阻塞 Step 12。 |
| backend fallback 是否可作为可用性策略 | 当前不采用为主线;后续只有能证明同等边界可落实时才可讨论受控选择。 | 本步已收敛,不阻塞 Step 12。 |
| cleanup / reaper 是否独立部署 | 本步只要求正式后台维护边界;是否独立部署后续 `07` 形成 implementation boundary。 | 本步已收敛,不阻塞 Step 12。 |

### 11.2 本 Step 未确认事项

本步不新增阻塞 Step 12 的上游 blocker。具体产品、协议、配置、状态机、事件机制、测试指标和 implementation boundary 均按文档顺序后移,不得在 Step 11 伪定稿。

---

## 12. 自检与进入下一步条件

| 自检项 | 结论 |
|---|---|
| 已明确当前架构主线方案 | pass。见 §9.1。 |
| 已明确哪些相邻替代路径值得比较 | pass。见 §5.1 和 §9.2。 |
| 已说明每条路径解决的问题、主要收益和主要代价 / 约束 | pass。见 §9.2。 |
| 已给出当前采用 / 不采用的正式结论 | pass。当前主线采用,其他路径不采用。 |
| 未把产品、协议、配置、指标或局部实现变体写成正式备选方案 | pass。产品 / 协议 / 配置 / 指标已列入不进入比较方向。 |
| 未把前文已排除的边界外事项重新包装为有效备选方案 | pass。见 §9.3。 |
| 是否允许进入 Step 12 | 本步完成后需等待用户审查确认;确认后才能进入 Step 12 `横切关注点`。 |
