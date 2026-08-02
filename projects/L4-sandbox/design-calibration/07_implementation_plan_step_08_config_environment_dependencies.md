# L4-sandbox 实施计划 Step 8 定义配置、环境与外部依赖准备

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 8
> 书写规范: `standards/document/实施计划书写规范.md` §5.8
> 配置真相源: `projects/L4-sandbox/04-配置设计.md`
> 环境真相源: `projects/L4-sandbox/05-测试方案.md` §7~§9
> 回填章节: `07-实施计划.md` §8 配置、环境与外部依赖准备
> 创建日期: 2026-07-17
> 状态: completed_reviewed_passed_to_step_9
> 本Step口径: 将既有配置、environment / profile、fake / controlled / candidate、material、CI与外部依赖契约绑定到14个phase和32个commit boundary的开工门禁。本Step不重定义配置项、profile、adapter、port、环境、测试或验收语义,也不创建正式`07`、implementation ledger、boundary skeleton、目标仓代码、commit、真实环境实例、`run_id`、evidence、测试结果或签署。

---

## 1. Step状态与三层开工门禁

| 门禁层 | 检查结果 | 裁决 |
|---|---|---|
| 项目级台账 | 原恢复点为`07 / Step 7 / completed_pending_user_review`;用户已明确“同意”。 | passed_for_step_8 |
| 文档级flow | Step 1~7已依次审查传递;Step 8是唯一合法下一步。 | passed_for_step_8 |
| Step级输入 | 正式`01/03/04/05`与已审查Step 3 /5~7可共同给出依赖类型、配置、环境、phase、boundary和门禁。 | passed_for_dependency_planning |
| 正式文档写入 | 本Step只形成§8回填草稿;正式`07`只能由Step 13装配。 | forbidden_in_step_8 |
| ledger / skeleton实例 | Step 6已定义schema;实例仍只能在Step 13与正式`07`同步创建。 | forbidden_until_step_13 |
| runtime事实 | 当前无目标仓、CI binding、ENV实例、candidate、provider、lab、run、artifact、EV、结果或签署。 | absent_not_adjudicated |
| 下游Step | 用户已确认Step 8,Step 9获得一次性放行。 | passed_to_step_9 |

当前恢复点:

```text
current_document = `07-实施计划.md`
current_step = Step 8 `定义配置、环境与外部依赖准备`
current_module = `implementation_config_environment_dependencies_review`
gate_status = completed_reviewed_passed_to_step_9
next_allowed_action = 由Step 9承接;若风险审计发现依赖准备冲突则回退本Step
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
implementation_repo_exists = no
```

### 1.1 Step内计划

| 顺序 | 动作 | 状态 | 完成门禁 |
|---:|---|---|---|
| 1 | 回写Step 7审查通过,读取Step 8规范、正式`01/03/04/05`与已审查Step 3 /5~7。 | done | 唯一恢复点和权威owner明确 |
| 2 | 核验本地仓、Rust / Cargo、core、Shell与canonical JSON现实状态。 | done | 现实未就绪项不伪装ready |
| 3 | 固定依赖类型、environment / profile与fake / controlled / candidate边界。 | done | compile / runtime / event / handoff / test dependency不混层 |
| 4 | 完成配置、material和32 boundary反查分件。 | done | 40 /101 /44 /23与32 /32无orphan |
| 5 | 完成phase、CI、不可用处置、正式§8草稿和blocker裁决。 | done | 不把依赖失败留给实现者临场判断 |
| 6 | 自检并停在Step 8。 | done | 不进入Step 9 |

## 2. 本步目标、输入与权威边界

### 2.1 本步目标

1. 把外部仓、工具、运行依赖、事件协作、handoff、material和测试环境显式登记到exact phase / boundary。
2. 区分“实现当前能力所需”“执行某类测试所需”“形成source / RELEASE事实所需”和“未来P1 / P2资格所需”。
3. 固定fake / controlled / simulation的证明上限,确保P0-C不能冒充P0-Q。
4. 为每个依赖给出provider、检查方式、不可用状态和唯一恢复动作。
5. 保持`04`是配置字段真相源、`05`是环境 / gate真相源,实施计划只做编排。

### 2.2 输入表

| 输入 | 当前状态 | 本Step用途 | 不得改写 |
|---|---|---|---|
| 正式`01`§3~§10 | reviewed architecture | 运行单元、依赖方向、外部协作、fail-closed与职责红线 | 产品中立、唯一core编译依赖、非目标 |
| 正式`03`§3~§5 / §13 / §16 | reviewed detailed design | workspace、path dependency、raw owner、port / adapter绑定和precheck | crate、port、adapter、DTO与error surface |
| 正式`04`§3~§12 / §14 | reviewed config design | S00~S08、PROFILE-01~07、I001~I101、D01~D44、material、generation和失败规则 | key、type、default、source、profile、material class和failure semantics |
| 正式`05`§7~§9 / §13 | reviewed test design | 28 DS、ENV-01~07、suite / gate / CI、fixed artifact / report | environment、suite、gate、script、status和evidence schema |
| Step 3 | completed_reviewed | repo / tool / dependency现实核验与PRE-SBX-001~013 | 已登记前置的状态和最迟关闭点 |
| Step 5 | completed_reviewed | PH-01~14、PH-QP和phase依赖 | phase数量、顺序和目标 |
| Step 6 | completed_reviewed | 32 boundary、Activation Gate、required reads与scope | boundary数量、顺序、included / excluded scope |
| Step 7 | completed_reviewed | G0~G4、exact suite / gate / report / review和失败传播 | 门禁成熟度、source role和不得伪造事实 |

权威优先级固定为: 正式`01/03/04/05` -> 已审查Step 3 /5~7 -> 本Step编排。若本Step需要新增配置key、profile、ENV、port、adapter mode、status或测试编号,必须`wait_design`回到owner文档,不得在实施计划内补口。

### 2.3 现实核验表

| 对象 | 检查方式 | 2026-07-17当前事实 | 本Step裁决 |
|---|---|---|---|
| 目标仓 | 目录检查`/home/aris/Projects/quantalithos-sandbox` | missing | 不阻塞Step 8设计;阻塞`CB-SBX-01A` Activation |
| `quantalithos-core` | repo、`crates/contracts/Cargo.toml`、workspace manifest | exists;core workspace声明edition 2024 / rust-version 1.93 | 仅说明现实兼容输入;exact revision / worktree仍须handoff固定 |
| tools / runtime / member-service实现仓 | `/home/aris/Projects/quantalithos-{tools,runtime,member-service}` | missing | 不阻塞P0-C;只允许port / event / handoff / fake,禁止Cargo path依赖 |
| Rust / Cargo / rustfmt | version命令 | 均为1.93.0 toolchain | 工具存在不等于目标仓Build Gate已执行 |
| `jq` / `sha256sum` | executable lookup | exists | 不能替代RFC 8785 writer / verifier选择与fixture |
| Shell lint | `shellcheck` lookup | missing | 阻塞`CB-SBX-02D` Activation,除非先批准等价项目规则 /工具 |
| CI provider / binding | 目标仓workflow和credential-safe binding | target repo missing,未形成 | 不阻塞script实现;阻塞“已接入CI”与真实source执行声明 |
| candidate / provider / lab | ADR、manifest与环境实例 | 未形成 | 阻塞`CB-SBX-13A/13B`;必须0 launch |

本表不把设计仓当前HEAD、core当前内容或本机命令输出转写为future implementation evidence。真实baseline、revision、worktree和命令结果只能在对应implementation ledger中记录。

## 3. SOP 9项问题回答

1. **哪些外部服务或仓是实施前置依赖。** 唯一sibling编译期依赖是`/home/aris/Projects/quantalithos-core/crates/contracts`。目标实现仓、design baseline、Rust兼容值是首个boundary前置。context / policy / capability、backend、store、event、handoff、observability、provider和CI是按boundary激活的运行期或执行环境依赖,不是全局Cargo前置。
2. **哪些依赖只在特定阶段需要。** canonical JSON只从02C需要;Shell规则从02D需要;strict config / material descriptor从03A /03B需要;controlled seam从04B~12B按能力使用;candidate / provider / lab仅13A /13B需要;release source与CI binding仅在真实14A~14C执行事实形成时需要。
3. **哪些配置必须在本地或CI准备。** 本地 / CI只按正式`04`准备S01~S03与允许的S05 / S06、PROFILE-01 /02、semantic fake store、fixed clock / id、safe output和fixed artifact / report roots。S04真实material、candidate和production credential禁止进入ENV-01 /02。
4. **是否允许fake / mock。** PROFILE-01 /02允许non-executing deterministic fake;PROFILE-03允许controlled seam;PROFILE-04允许simulation。它们必须保持UoW、version、replay、failure、redaction、no-write / no-repair / no-rollback语义。PROFILE-05~07禁止以S06 fixture或fake替代required real binding。
5. **外部依赖不可用如何处理。** 设计输入缺失映射`blocked / wait_design`;repo /编译期依赖 /外部tool /lab等现实依赖缺失记`dependency_wait`原因并映射`blocked / handoff`;当前allowed scope内可修复的toolchain / harness / gate失败映射`blocked / fix_gate_failure`;P0-C required fake / harness缺失为boundary失败;主动注入的Unavailable只有命中预期formal branch时该case可通过;P0-Q identity缺失为`Blocked`且0 launch;PROFILE-06缺组合为`NotRunConditional`;PROFILE-07任何激活触发DesignReopen。
6. **哪些依赖由其他团队或仓提供。** core提供shared contract;identity / work / policy owner提供body-free refs / summary;bus提供event transport;artifact / observability / investigation owner提供handoff target;backend / security / operations提供candidate、provider、lab和resource disposition。Sandbox只实现port / adapter消费与owning fact,不接管其truth。
7. **已实现仓是否存在。** 当前core存在;目标Sandbox、tools、runtime、member-service实现仓不存在。存在性不授权编译依赖,缺失也不允许复制其领域语义进Sandbox。
8. **哪些是编译期依赖及path写法。** 只有`core-contracts = { path = "../quantalithos-core/crates/contracts" }`,与正式`03`一致。exact revision必须在HDO /01A固定;private git tag / rev只可作为未来切换方案。
9. **哪些是运行期 /事件协作依赖。** context / policy / capability resolver、isolation / capture / release backend、store、bus、consumer / publisher、handoff target、observability sink、provider及tools / runtime / member调用方均通过port、adapter、event、typed ref / summary、handoff或fake协作,不得成为Cargo path dependency。

## 4. 当前材料问题诊断

| ID | 位置 | 问题 | 本Step处理 |
|---|---|---|---|
| DIAG-SBX-08-01 | Step 3 /现实前置 | 前置项已有清单,但尚未逐boundary绑定Activation Gate。 | 在boundary分件32 /32绑定关闭点和不可用动作。 |
| DIAG-SBX-08-02 | 正式`04` | 101项、44域、40组和material表粒度高,直接复制会形成第二配置真相源。 | 只登记owner range、消费boundary和检查;字段语义继续回指`04`。 |
| DIAG-SBX-08-03 | 正式`05` | 七环境已有证明上限,但尚未与phase / source role的准备时机汇合。 | 固定ENV / PROFILE / source role并完成14 phase映射。 |
| DIAG-SBX-08-04 | P0-C / P0-Q | fake、controlled、simulation和candidate容易被写成可互换adapter mode。 | 固定PROFILE-05不得接受S06、host或低profile替代。 |
| DIAG-SBX-08-05 | CI / evidence | script capability、CI provider binding、source run和RELEASE事实成熟度容易混用。 | 分离本地fixture、CI binding、fixed source execution与acceptance消费。 |
| DIAG-SBX-08-06 | 上游动态状态 | 正式`04/05/06`中的`07`下游状态仍停在旧缺失或Step 7待审口径。 | 记为动态状态冲突;只允许受控回写进度,不得改配置 /测试 /验收契约。 |

没有发现要求回写正式`01/03/04/05`契约才能完成Step 8的冲突。`DIAG-SBX-08-06`只涉及下游进度,不是schema、ENV、suite或acceptance owner冲突。

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 关注点 | Step 8前 | Step 8后 |
|---|---|---|
| 依赖 | 分散在架构、详细、配置、测试和前置清单 | 按compile / runtime / event / handoff / material / tool / environment分类并绑定boundary |
| profile | 有七profile资格,无实施准备顺序 | 每个ENV / PROFILE有phase、source role、前置和不可用状态 |
| fake | 有设计上限,实现时仍可能被临场泛化 | fake / controlled / simulation / candidate四类逐seam固定 |
| 配置 | 40 /101 /44 /23有下游方向 | 有完整实施owner与boundary反查,且不复制字段真相 |
| CI | 有17 planned script | 区分script fixture、CI binding、fixed source和RELEASE四种成熟度 |
| 不可用 | 多处定义 | 统一映射为fail-fast / formal negative / wait_design / dependency_wait原因 + handoff / fix_gate_failure / Blocked / NotRunConditional / DesignReopen |

### 5.2 设计取舍

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| 将相邻仓作为Cargo path dependency | 调用直接 | 违反唯一core编译边界并引入领域耦合 | 不采用 |
| P0-C等待真实bus / backend / provider | 表面更接近生产 | 产品未选且把可重复契约验证绑定现实环境 | 不采用 |
| P0-C使用semantic fake / controlled seam | 可重复、可注入失败 | 不能证明真实隔离 /生命周期 | 采用,证明上限写入门禁 |
| PROFILE-05缺输入时降级PROFILE-03 /04 | 可继续跑部分case | 形成资格替换和伪P0-Q | 禁止 |
| CI未绑定时禁止实现script | 避免无workflow脚本 | 会把纯本地可验证的编排能力不必要后置 | 不采用;允许fixture实现,禁止声称CI已接入 |
| 在Step 8选Docker / gVisor / provider | 可立即给出产品参数 | 越过ADR、安全和qualification边界 | 不采用;作为13A Activation前置 |

## 6. 结构化中间产物入口

| 产物 | 文件 | 内容 | 状态 |
|---|---|---|---|
| 主件 | 本文件 | SOP、依赖、ENV / PROFILE、fake边界、phase、CI、失败与§8草稿 | completed_pending_review |
| 配置 / material反查 | `07_implementation_plan_step_08_config_material_audit.md` | S00~S08、40组 /101项、44域、10 material class、23 slot mapping | completed_supporting_register |
| boundary准备反查 | `07_implementation_plan_step_08_boundary_readiness_matrix.md` | 32 /32 boundary的配置、环境、依赖、检查和不可用处置 | completed_supporting_register |

三个文件共同构成Step 8中间产物。正式§8只保留执行所需摘要与精确入口,不得把两个分件压缩为“按需准备依赖”。

### 6.1 依赖类型与不可混层规则

| 类型 | 当前唯一合法形态 | 检查 | 禁止 |
|---|---|---|---|
| compile | `core-contracts` local path | Cargo metadata / graph + source import | 其他sibling path、复制shared type、vendored私有副本 |
| runtime | port + concrete / fake adapter | constructor registry、availability、typed outcome | SDK response / raw error成为domain truth |
| event | formal Consumer / Event + publisher adapter | schema、source、route、receipt、stored payload | Cargo依赖、raw topic拼接、失败回滚source |
| handoff | body-free refs + target adapter / receipt | target identity、class、no rollback / no promotion | receipt成为Artifact / observability / investigation truth |
| material | validated opaque ref -> S04 -> adapter-local bounded lease | descriptor、class、consumer、expiry / revoke / release和safe audit | raw config / env / argv、跨consumer共享、输出full ref |
| tool | Rust / Cargo / formatter / Shell / canonical library | exact version / rule / fixture at Activation | 命令存在即宣称Build / canonical通过 |
| environment | ENV + PROFILE + immutable run / generation identity | eligibility packet和source role | 从环境名推导产品、低profile替代高profile |

### 6.2 外部依赖准备总表

| 依赖项 | 类型 | 全局依赖类型 | 使用phase / boundary | 提供方 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|---|
| design baseline / HDO-SBX-00 | design input | implementation authorization | 全部;01A前 | design owner /用户 | 真实design commit、Step 13 ledger /32 skeleton | `wait_design`;不得创建目标仓 |
| `/home/aris/Projects/quantalithos-sandbox` | repo | target repository | PH-01 /01A+ | Sandbox implementation owner | repo root、local git、initial worktree | `dependency_wait`;台账`blocked / handoff`;01A不激活 |
| `quantalithos-core/crates/contracts` | repo / crate | compile | PH-01 /01A起 | L0-core | path、manifest、fixed revision /worktree、Cargo graph | 暂停;不得复制 / vendor |
| Rust 1.93-compatible toolchain | tool | build | PH-01起 | local /CI toolchain owner | fixed target baseline后version、fmt /clippy /check | 环境修复;Build Gate保持pending |
| RFC 8785实现 / verifier | library / tool | local test / evidence | PH-02 /02C;14B复用 | Sandbox test owner | canonical / noncanonical / self-digest fixtures | 无合格现实tool记`dependency_wait`并`blocked / handoff`;schema /算法契约冲突为`blocked / wait_design`;禁止弱替代 |
| Shell规则与lint | standard / tool | automation | PH-02 /02D;14A复用 | design /test tooling owner | approved rule、`bash -n`、lint /等价fixture | 02D不提交;不得标N/A |
| semantic store / UoW / replay fake | adapter | P0-C runtime test | 02B起 | Sandbox infra | parity、version、rollback、stored replay tests | required harness失败;不得fallback无事务map |
| context / policy / capability sources | adapter / event | runtime | 04B /05B /06B /11B /12B | external owner + Sandbox adapter | body-free fixture / controlled registry、freshness和failure mapping | fake缺失阻断P0-C;real缺失不改P0-C |
| isolation / capture / release carrier | adapter | runtime | 05B /07A~08B;13A /13B | backend owner + Sandbox adapter | P0-C non-executing /simulation parity;P0-Q immutable candidate packet | P0-C harness失败;P0-Q `Blocked` +0 launch |
| event transport / route | adapter / event | event collaboration | 10A /10B /11B /12B | bus owner + Sandbox adapter | closed schema / route map、publisher outcome、no rollback | P0-C fake失败;real transport缺失不冒充seam |
| material / obs / investigation targets | adapter / handoff | runtime /handoff | 07B /07C /08B /11B /11C /13B | downstream owners | registered target、material class、receipt与guard | formal failed / retryable / contained;不回滚source |
| secure material provider | service | runtime material | 03B descriptor;13A /13B activation | security /provider owner | provider、principal、native audit、descriptor与anti-leak资格 | 03B只测fake descriptor;13A `Blocked` |
| dedicated backend lab | environment | P0-Q execution | PH-13 /13A /13B | qualification /operations owner | ENV-05 topology、authorization、resource和teardown责任 | `Blocked`;0 probe / launch |
| CI provider / workflow binding | service /config | automation execution | 14A真实CI与source execution | CI owner | trigger、credential-safe binding、ENV /PROFILE /role参数 | 可测本地fixture;不得声称CI/source已运行 |
| fixed artifact / report roots | filesystem contract | test evidence | 02C /02D起;12B~14C完整 | target repo /test owner | 固定路径、write permission、pairing、no `latest` | script / gate失败;不得手写补洞 |
| retention物理carrier / TTL authority | operations dependency | runtime /evidence retention | future release /09;Step 9风险承接 | security /operations /records owner | carrier、authority、condition guard与实际策略 | 当前只执行condition guard;不得发明天数 |

### 6.3 Environment / Profile / Source Role准备矩阵

| ENV / PROFILE | 当前角色 | Source role / gate | 必需准备 | 允许证明 | 不可用 /禁止处理 |
|---|---|---|---|---|---|
| ENV-01 / PROFILE-01 `local-contract` | developer contract shell | 无release source role | S01 safe baseline;optional S02 /allowlisted S03;bounded S05 /S06;in-memory fake;non-executing backend | loader / validator /builder与local contract smoke | real launch必须reject;不可作为MAIN /P0Q source |
| ENV-02 / PROFILE-02 `ci-contract` | P0-C deterministic contract | `MAIN-CONTRACT`;PR适用 | suite S02、allowlisted CI S03、required S06、fixed clock /id、run-isolated semantic stores、safe artifact root | contract /domain /UoW /config /service /main P0-C | S04 /real secret /host launch禁止;缺fixture为Failed /InfraFailed,不得改role |
| ENV-03 / PROFILE-03 `integration-seam` | P0-C controlled seam | `MAIN-SEAM` | controlled S02 /S03、registered resolver /event /target /sink、isolated test store;execution fake | runtime /event /handoff failure mapping和adapter parity | 不证明coherent boundary;缺环境不是MAIN-CONTRACT替代理由 |
| ENV-04 / PROFILE-04 `operations-simulation` | P0-C safety /operations | `OPS` | simulation state /handle /lease /report、S06 controlled schedules、manual job entry、safe outputs | replay /cleanup /redline /maintenance guard和no-repair | 不证明真实release / cleanup;real destructive call必须为0 |
| ENV-05 / PROFILE-05 `backend-conformance` | mandatory P0-Q | `P0Q` | candidate ADR /revision、generation、capability、four-dimension template、provider /material、dedicated lab、controlled target、teardown owner | 同一packet的13 CONF候选资格 | 任一缺失`Blocked`;0 launch;禁止S06、host、P03 /P04或candidate替换 |
| ENV-06 / PROFILE-06 `staging-like` | P1 conditional | conditional `GATE-SBX-P1`,不进P0四source | qualified P05 + durable /bus /resolver /target /scheduler /sink完整组合 | selected real-like conditional结果 | 未正式激活`NotRunConditional`;fake混入reject;不得补P0 |
| ENV-07 / PROFILE-07 `production-like` | inactive future target | 无current role | 先DesignReopen正式`00~07`,未来完整产品 /security /capacity /runbook /acceptance | 当前只证明absence /activation reject | 任一当前启用或ready声明阻断并回设计 |

固定关系不得重映射:

```text
ENV-02 / PROFILE-02 -> MAIN-CONTRACT
ENV-03 / PROFILE-03 -> MAIN-SEAM
ENV-04 / PROFILE-04 -> OPS
ENV-05 / PROFILE-05 -> P0Q
ENV-06 / PROFILE-06 -> conditional P1
ENV-07 / PROFILE-07 -> inactive / future
```

`MAIN-CONTRACT`与`MAIN-SEAM`必须是不同run。RELEASE只按`MAIN-CONTRACT -> MAIN-SEAM -> OPS -> P0Q`消费同一baseline的fixed source refs;聚合器不得在缺source时换ENV、合并role或现场执行case。

### 6.4 Fake / Controlled / Candidate使用边界

| Seam | PROFILE-01 /02 | PROFILE-03 | PROFILE-04 | PROFILE-05 | PROFILE-06 /07 |
|---|---|---|---|---|---|
| store / UoW / replay | in-memory semantic fake;必须有version /rollback /stored replay | isolated controlled store /durable-like double | simulation /replay state | isolated conformance store,非production durable | qualified durable parity;P07 future |
| context / policy / capability | deterministic body-free fake + failure injection | controlled body-free source | fixture /replay summary | strict policy fixture + candidate-real capability | approved real-like /future source |
| isolation backend | non-executing fake;spawn /fs /network禁止 | execution仍fake,只测availability seam | simulated handles;no launch | candidate-real launch /inspect /capture /release | P05-qualified real-like /future approved |
| event transport | fake /disabled | controlled consumer /publisher /route | relay /receipt simulation | disabled或controlled evidence route | real-like /future approved bus |
| handoff target | fake receipt /failure injection | controlled target /feedback | simulated target /receipt | controlled non-production target | real-like /future approved target |
| material | S04 forbidden;synthetic marker | S04 forbidden;controlled opaque ref only | S04 forbidden;simulation ref | S04 qualified non-production material | qualified non-production /future approved material |
| scheduler /maintenance | deterministic job harness | controlled job seam | manual /simulated primary | qualification lifecycle only | real-like /future approved scheduler |

通用禁止项:

- fake不得省略optimistic version、UoW、idempotency、receipt、stored payload、status、redaction、resource disposition或call budget。
- controlled seam不得被记录为candidate conformance、真实产品可用性或coherent boundary证据。
- simulation不得执行真实release、删除、containment解除或credential访问。
- candidate-real只允许一个正式packet;缺失 /错配时0 launch,不得搜索“可用candidate”或fallback。
- 任一adapter mode若需要新代码enum /public carrier,先`wait_design`回写正式`03/04`;本Step中的mode词汇不是实现enum授权。

### 6.5 14个Phase准备矩阵

| Phase | 开工前必须准备 | 可后置 | Activation不可用处理 |
|---|---|---|---|
| PH-01 | HDO-SBX-00;真实design baseline;目标仓 /local git;target Rust baseline;core exact revision /worktree | runtime adapters、CI、candidate | 设计前置缺失为`wait_design`;现实依赖缺失记`dependency_wait`并`blocked / handoff`;01A保持planned |
| PH-02 | workspace可build;semantic fake kernel;fixed clock /id;canonical选择在02C前;Shell规则在02D前 | config registry、external seam | 02B fake失败阻断;02C /02D各自开放前置未关闭则不激活 |
| PH-03 | S01~S06、40组 /101项 /44域expected manifest;P01~05 eligibility;23 material descriptor;safe config corpus | real provider /candidate、P06 /P07 | parser /generation /material descriptor任一不闭合则03A /03B fail-fast |
| PH-04 | PROFILE-02 identity fixture、semantic stores、context resolver fake、audit /relay /replay binding | controlled real context source | 04B required fake不可构造则阻断;不匿名 /不自造context |
| PH-05 | active identity、four-dimension isolation + workspace requirement /template、capability fake、non-executing backend、I065 generation snapshot | candidate-real probe | 05B identity缺失或required dimension unsupported /stale /unavailable走formal reject;P0-Q仍NotEvaluated |
| PH-06 | policy body-free fake、strict high-risk profile、exact prior requirement ref | real policy source | missing /stale /conflict fail-closed且backend call=0 |
| PH-07 | persisted boundary /handle /lease、Accepted policy、backend /capture /handoff semantic adapters | real candidate /real target | guard失败0 launch;capture /handoff失败诚实记录且no rollback |
| PH-08 | control /failure fixtures、guard /investigation /release adapters、simulation handles | real teardown /investigation target | non-Allowed release=0;缺guard默认Blocked /Contained |
| PH-09 | projection /derived /reference /audit read stores、visibility fixture、bounded page | durable read store | query保持no-write;缺callable read不能scan storage或repair |
| PH-10 | 9-source fixture registry、closed schema /route map、relay store、publisher fake | real bus /topic provisioning | missing enabled binding fail-fast;duplicate /publish failure不改source |
| PH-11 | 10 job registry、typed scope /page、stored report、manual/simulated scheduler、adapter fakes | real scheduler /targets | job rejected /partial /failed;不得修core truth或伪调度 |
| PH-12 | ENV-02 /03 /04 harness能力、237 P0-C owner、all config /protocol manifests、MAIN /OPS writer能力 | real source execution /candidate | fake parity /role /manifest任一不闭合阻断12B;不写source Passed |
| PH-13 | PH-QP四包、ENV-05 /P05 immutable packet、candidate /provider /material /lab /teardown全部关闭 | P06 | 13A /13B保持`blocked_pre_implementation`;0 probe /launch |
| PH-14 | 17 script能力、CI参数契约、fixed roots、四source identity schema、21 slot /nine schema | real CI provider可在script fixture后绑定 | 可完成fixture编排;缺真实source保持RELEASE Blocked,不得手写补源 |

phase矩阵不改变Step 5顺序。PH-QP可在01A后并行做材料准备,但不允许形成第二个active implementation boundary,也不允许在13A前生成真实qualification结果。

### 6.6 CI、Material与Artifact准备层级

| 层级 | 首次owner | 所需输入 | 可形成 | 不可形成 |
|---|---|---|---|---|
| script contract fixture | 02D;14A收口 | CLI参数、status、synthetic raw、Shell rule /lint | local deterministic fixture result | CI接入、source role Passed、run evidence |
| schema / digest fixture | 02C;14B收口 | RFC 8785实现、sha256规则、path /self-digest fixture | writer /reader capability | 真实`run_id`、EV alias、source result |
| CI binding | 14A现实前置 | provider、workflow、trigger、credential-safe ENV /PROFILE /role注入 | 可触发正式script | 已执行或通过,除非未来真实run |
| fixed source execution | future runtime | exact baseline、ENV /PROFILE /role、immutable config /candidate identity | raw + paired report和真实status | acceptance verdict、source改写 |
| RELEASE aggregation | future runtime | 四source固定顺序 /identity /digest | RELEASE raw /report status | 缺源时case补跑、status修正、`latest`选择 |
| acceptance draft | 14C capability;future fixed RELEASE | 同一RELEASE与四source refs | 四份draft和review入口 | verdict、risk acceptance、review、signature |

Material准备必须额外满足:

1. ordinary config只保存validated opaque ref;S04不参与S01 < S02 < S03普通覆盖。
2. 23个material-capable item slot按consumer独立解析与lease,即使provider marker相同也不默认共享。
3. P01~P04不调用真实S04;P05 /P06使用非生产material且必须有provider /principal /native audit /anti-leak资格。
4. raw material不得进入config identity、summary、DTO、truth /projection /relay /replay store、audit、artifact、report、diagnostic或workload fixture。
5. unavailable /wrong class /expired /revoked必须按owner fail-fast /fail-closed /contained;不得fallback raw env、file、fake或旧material。

### 6.7 不可用处置判定算法

```text
for each boundary activation dependency:
  if required design contract is missing or changed:
    gate_status = blocked
    next_allowed_action = wait_design

  else if compile dependency, tool, target repo or required P0 harness is unavailable:
    gate_status = blocked
    blocker_reason = dependency_wait
    next_allowed_action = handoff

  else if dependency unavailability is an explicit negative test input:
    execute only the formal expected branch
    pass only when status, side effects, call budget and report match the TC

  else if ENV-05 identity or candidate/provider/lab input is incomplete:
    source_status = Blocked
    require probe_calls = 0 and launch_calls = 0

  else if ENV-06 composition is not formally activated or complete:
    source_status = NotRunConditional

  else if ENV-07 or S07/S08/reload/hot/admin surface is requested:
    gate_status = blocked
    next_allowed_action = wait_design
    require DesignReopen

  never map missing, Blocked, InfraFailed or NotRunConditional to Passed / Skipped / N/A
```

### 6.8 Security redlines for dependency preparation

| Redline | 机械检查 /review | 失败动作 |
|---|---|---|
| 非core sibling编译依赖 | Cargo graph + source imports | dependency check Failed;boundary不提交 |
| host process / weak backend fallback | adapter call trace + profile identity | implementation /qualification Failed;0 further launch |
| raw secret / endpoint /topic /body输出 | all-carrier redaction scan | preserve safe finding;阻断commit /source |
| fake进入P05+ | profile /source lane /fixture registry | profile reject;P0Q Blocked |
| tools semantics /runtime loop /member lifecycle入Sandbox | scope /dependency /protocol review | `wait_design`;移除越界实现 |
| receipt /telemetry升格downstream truth | DTO /store /report source review | boundary失败;回到owner contract |
| cleanup /release早于guard /handoff /investigation | call budget /state /resource disposition | release=0;Blocked /Contained |
| CI /script预填pass、run或EV | no-static + pairing checks | artifact invalid;不得提交 /聚合 |

## 7. 正式`07` §8回填草稿

以下内容只作为Step 13装配输入。正式§8应保留本节摘要表,并以两个Step 8分件作为逐配置 /逐boundary校准入口;不得复制正式`04`字段定义或把planned检查改成已完成事实。

### 7.1 配置与环境准备原则

- 唯一允许的sibling编译依赖是`core-contracts`;其他仓和产品只通过port、adapter、event、typed ref /summary、handoff或fake协作。
- runtime只消费同一complete generation的validated refs /handles;raw config只由`infra/config.rs`读取,application /domain /contracts不读取env /file /secret。
- PROFILE-01~04分别用于local contract、CI contract、controlled seam和operations simulation;不得证明真实isolation backend。
- PROFILE-05 /ENV-05是P0-Q唯一candidate-real资格环境;缺任一identity输入必须`Blocked`且0 launch。
- PROFILE-06保持conditional,PROFILE-07保持inactive;S07 /S08 /reload /LKG /hot surface命中即DesignReopen。
- sensitive material只能沿validated opaque ref -> S04 -> exact consumer bounded lease流动,不进入任何正式carrier /artifact /report。

### 7.2 实施前置依赖摘要

| 依赖项 | 类型 | 使用阶段 | 提供方 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|
| design baseline + HDO-SBX-00 | design /authorization | 01A前 | design owner /用户 | 真实commit、项目ledger、32件planned skeleton | `wait_design`;禁止创建 /修改目标仓 |
| target Sandbox repo | repo | PH-01+ | implementation owner | repo root、local git、worktree | 01A `dependency_wait`;台账`blocked / handoff` |
| `core-contracts` | compile repo/crate | PH-01+ | L0-core | exact revision /worktree、Cargo graph /imports | 暂停;不得复制 /vendor |
| Rust / Cargo toolchain | tool | PH-01+ | local /CI owner | fixed baseline后version、fmt /check /clippy | Build Gate pending |
| RFC 8785 writer /verifier | tool /library | 02C;14B | test tooling owner | canonical /self-digest /path fixtures | 02C不激活 |
| Shell rule /lint | standard /tool | 02D;14A~14C | design /test owner | approved rule、syntax、lint /equivalent fixtures | script boundary不提交 |
| semantic fake /controlled adapters | runtime test | 02B~12B | Sandbox infra | UoW /replay /failure /redaction parity | required P0-C harness失败 |
| candidate /provider /lab | runtime /material /environment | 13A /13B | backend /security /operations | immutable P05 /ENV-05 packet和0-launch preflight | P0-Q `Blocked`;0 probe /launch |
| CI provider binding | service /config | 14A真实执行 | CI owner | trigger、credential-safe ENV /PROFILE /role binding | 可测fixture;禁止声称CI /source已运行 |
| fixed artifact /report roots | filesystem contract | 02C+;12B~14C | test owner | fixed path、pairing、digest、no `latest` | gate /report失败 |

### 7.3 Environment / Profile固定角色

| ENV / Profile | 用途 | 正式source role | 证明上限 | 不可用处理 |
|---|---|---|---|---|
| ENV-01 /PROFILE-01 | local contract | none | loader /builder /entry smoke | real launch reject |
| ENV-02 /PROFILE-02 | deterministic P0-C | MAIN-CONTRACT | contract /domain /service /config | fixture缺失失败;不得证明backend |
| ENV-03 /PROFILE-03 | controlled seam | MAIN-SEAM | port /protocol /failure mapping | 不得证明coherent boundary |
| ENV-04 /PROFILE-04 | operations simulation | OPS | safety /replay /maintenance semantics | no real destructive call |
| ENV-05 /PROFILE-05 | candidate conformance | P0Q | exact packet 13 CONF候选资格 | missing `Blocked` +0 launch |
| ENV-06 /PROFILE-06 | selected real-like | P1 conditional | activated composition only | `NotRunConditional` |
| ENV-07 /PROFILE-07 | future production target | none current | current absence only | activation -> DesignReopen |

### 7.4 逐项实施准备入口

| 准备集合 | 正式真相源 | Step 8实施入口 | Step 13 skeleton写入要求 |
|---|---|---|---|
| S00~S08 /40组 /I001~I101 /D01~D44 | 正式`04`§3~§9 | `07_implementation_plan_step_08_config_material_audit.md` | exact ranges、first owner、affected boundary、failure action |
| 10 material class /23 material-capable item | 正式`04`§8 | 同上§5 | class /consumer /profile /provider prerequisite,禁止raw值 |
| ENV-01~07 /Profile /dependency | 正式`05`§8 | 本文件§6.2~§6.6 | environment identity、proof ceiling、source role |
| 32 commit boundary | Step 6 /7 | `07_implementation_plan_step_08_boundary_readiness_matrix.md` | config refs、ENV /adapter、dependency checks、unavailable disposition |

### 7.5 Phase前置与失败传播

每个boundary必须在Activation Gate逐项检查其配置、environment、adapter、tool和外部依赖。设计契约缺失走`blocked / wait_design`;repo /外部tool /lab等现实依赖缺失记`dependency_wait`原因并走`blocked / handoff`;当前allowed scope内可修复的required P0 harness /环境门禁失败走`blocked / fix_gate_failure`;预期故障注入只有在formal status、side effect和call budget全部匹配时case才可通过;P0-Q identity缺失保持`Blocked`;P1未激活保持`NotRunConditional`;任何unsupported production /dynamic surface触发DesignReopen。不得把这些状态映射为`Skipped`、`N/A`或`Passed`。

## 8. 开放前置、Blocker与上游影响

### 8.1 开放但不阻塞Step 8设计停审的现实前置

| 前置 / blocker | Exact boundary / gate | 当前状态 | Owner /检查 | 未关闭时处理 |
|---|---|---|---|---|
| 可复现design commit baseline与HDO-SBX-00 | HDO /01A Activation | open_before_handoff | 用户 /design owner;真实commit + ledger /skeleton | `wait_design`;目标仓不改动 |
| 目标仓、local git、edition /rust-version | 01A Activation | open_before_bootstrap | implementation /design owner;repo /manifest回读 | 01A blocked |
| core exact revision /worktree /compatibility | 01A Design /Build | open_before_first_cargo | L0-core +implementation owner | Cargo boundary blocked |
| RFC 8785实现 /verifier | 02C Activation | open_before_schema_writer | test tooling;canonical fixtures | 02C blocked |
| Shell规则与lint /等价检查 | 02D Activation | open_before_script | design /test tooling;rule +fixture | 02D blocked |
| candidate ADR /revision /capability /template | 13A Activation | open_before_p0q | backend /design owner;immutable manifest | 13A /13B Blocked +0 launch |
| provider /principal /material /native audit | 13A Activation | open_before_p0q_material | security /provider owner | P05 unqualified;无S04 real resolve |
| dedicated lab /authorization /teardown责任 | 13B Activation | open_before_probe | qualification /operations owner | 不执行CONF |
| CI provider /workflow binding | future source execution /14A | open_before_ci_binding | CI owner;trigger /credential-safe args | 只测local fixture;无CI claim |
| retention物理carrier /TTL authority | future release /Step 9 /09 | open_conditional | records /security /operations | condition guard only;不发明期限 |
| PROFILE-06 complete composition | GATE-SBX-P1 | inactive_conditional | P1 owner;P05 qualification +full bindings | `NotRunConditional`;不补P0 |
| PROFILE-07 production前置 | DesignReopen | inactive_future | product /security /operations /acceptance | current activation reject |

### 8.2 动态状态冲突与受控回写

| Blocker ID | 冲突 | 处理 | 契约影响 |
|---|---|---|---|
| `SBX-IMP-DOWNSTREAM-STATUS-STEP8-001` | 正式`04`仍把`07`写为blocked /missing,正式`05/06`仍停在Step 7待审,与Step 8已完成待审的恢复点冲突。 | 只回写三份正式文档的下游进度 /变更记录及对应flow /项目台账。 | 不改配置key /profile /material、TC /ENV /suite /gate、AC /VETO或runtime事实。 |

### 8.3 Blocker裁决

- 没有发现必须回写正式`01/03/04/05`设计契约才能完成Step 8的上游blocker。
- 正式`04`的S00~S08、40 /101、44域、10 material class /23 item与正式`05`的七ENV /Profile可以同时映射到Step 5 /6 /7,无owner冲突。
- tools /runtime /member-service仓缺失不阻塞P0-C,也不允许把其semantic execution、agent loop或lifecycle编入Sandbox。
- 上表开放项只阻塞exact future boundary /execution,不阻塞Step 8设计审查;状态不得改写为ready。
- 若后续产品选择要求new SDK-facing public port、provider callback、hot swap、dynamic source或shared material cache,必须`wait_design`回写正式`03/04`,使本Step受影响部分失效。

## 9. 复杂度、经验复核与停审

### 9.1 分批与复杂度判断

Step 8按主件、配置 /material分件和boundary分件拆分。拆分理由是32 boundary +40 config group +44 domain +23 material item无法在单一主件中保持可审查粒度。分件均有明确主件入口,不形成第二真相源。

### 9.2 可落码性经验复核

| 复核项 | 结论 |
|---|---|
| 字段 /DTO /port是否留给实现者补 | 否;全部回指正式`03/04`,变更即wait_design |
| 配置source /profile /material是否可机械定位 | 是;S00~S08、40 /101、44 /23均有owner |
| 每个phase /boundary是否有准备判定 | 是;14 /14 +32 /32 |
| fake是否保持transaction /state /failure parity | 是;不得以简单map /host side effect替代 |
| P0-C /P0-Q是否可能混用 | 已阻断;P05 exact packet且S06 forbidden |
| 外部依赖失败是否留临场判断 | 否;每行有status /next action |
| evidence /CI成熟度是否混用 | 否;fixture /binding /source /RELEASE /acceptance五层分离 |
| safety cleanup /lease /redline是否被环境配置放宽 | 否;缺输入默认Blocked /Contained,release=0 |

### 9.3 自检

| 自检项 | 结果 |
|---|---|
| SOP问题 | 9 /9 answered |
| 外部依赖是否显式 | 是;compile /runtime /event /handoff /material /tool /environment分层 |
| repo path与Cargo引用 | 是;唯一`core-contracts` path与正式`03`一致 |
| ENV /PROFILE | 7 /7;source role固定 |
| Phase准备 | 14 /14 |
| Boundary准备 | 32 /32;均有检查与不可用动作 |
| Source lane | S00~S08 9 /9 |
| 配置覆盖 | 40 /40组;I001~I101 101 /101;D01~D44 44 /44 |
| Material覆盖 | 10 /10 class;23 /23 material-capable item |
| fake /controlled /candidate边界 | 已闭合;P05+无fixture /host fallback |
| CI /artifact /report | 能力与真实执行分离;固定路径 /role不变 |
| 阻塞Step 8的上游契约冲突 | 无 |
| 正式`07` /implementation ledger /skeleton | 未创建;留Step 13 |
| 代码 /commit /run /EV /结果 /review /签署 | 均未创建 |

### 9.4 进入Step 9条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 关键依赖有provider /检查 /失败处理 | passed_design | 无临场判断空项 |
| Phase与Step 5顺序一致 | passed_design | 14 /14,PH-QP仅准备支线 |
| Boundary与Step 6 /7一致 | passed_design | 32 /32,无跳步 /并行current |
| 配置 /material /环境无orphan | passed_design | 9 /40 /101 /44 /10 /23 /7全部闭合 |
| 上游契约无unresolved conflict | passed_design | 只有动态进度待受控回写 |
| 用户确认Step 8 | passed | 用户已明确“同意”,Step 9获得一次性放行 |

```text
step_8_result = completed_reviewed_passed_to_step_9
current_document = `07-实施计划.md`
current_step = Step 8 `定义配置、环境与外部依赖准备`
current_module = `implementation_config_environment_dependencies_review`
gate_status = completed_reviewed_passed_to_step_9
source_lane_count = 9_of_9
config_group_count = 40_of_40
config_item_count = 101_of_101
config_domain_count = 44_of_44
material_class_count = 10_of_10
material_item_count = 23_of_23
environment_profile_count = 7_of_7
phase_readiness_count = 14_of_14
boundary_readiness_count = 32_of_32
next_allowed_action = 由Step 9承接;若风险审计发现依赖准备冲突则回退本Step
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
real_environment_created = no
real_test_execution = not_started
real_evidence_created = no
allow_step_9_discussion = yes_one_step_authorized
commit_required = no
```
