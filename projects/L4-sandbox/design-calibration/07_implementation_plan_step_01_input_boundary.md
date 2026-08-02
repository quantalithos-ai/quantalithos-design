# L4-sandbox 实施计划 Step 1 确认实施输入边界

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 1
> 书写规范: `standards/document/实施计划书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 回填章节: `07-实施计划.md` §1 与上游文档的关系声明
> 创建日期: 2026-07-16
> 状态: completed_reviewed_passed_to_step_2
> 本Step口径: 只确认实施计划输入是否足以进入Step 2,不定义实施范围、phase、commit boundary、测试门禁、implementation ledger或planned boundary skeleton,也不创建正式`07-实施计划.md`。

---

## 1. Step状态与三层开工门禁

| 门禁层 | 检查结果 | 裁决 |
|---|---|---|
| 项目级台账 | `project_execution_ledger.md`原恢复点为`06 / Step 15 / pending_user_review`;用户随后明确“继续”,允许将已审查正式`06`作为`07`直接上游。 | passed_for_07_step_1 |
| 文档级flow | `06_acceptance_calibration_flow.md`已收口为`completed_reviewed_for_07_start`;`07_implementation_plan_calibration_flow.md`已先于本文件创建,且Step 1是唯一允许执行的Step。 | passed_for_step_1 |
| Step级输入 | 正式`00~06`均存在并已审查;实施计划SOP、书写规范、代码实施台账规范、可落码性标准、依赖裁剪规则和详细设计Step 17实施承接均已读取。 | passed_for_input_boundary |
| 正式文档写入 | Step 1只形成回填草稿,正式`07`必须等待Step 13从已确认Step 1~12装配。 | forbidden_in_step_1 |
| 实现侧写入 | 目标实现仓不存在;本Step也禁止创建实现代码、实现commit、runtime evidence、implementation ledger或boundary skeleton。 | forbidden_in_step_1 |

当前恢复点:

```text
current_document = `07-实施计划.md`
current_step = Step 1 `确认实施输入边界`
current_module = `implementation_input_boundary_reviewed`
gate_status = passed_to_step_2
next_allowed_action = 本Step已收口;由`07_implementation_plan_step_02_scope.md`接续
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
```

---

## 2. 本步目标与输入

本Step回答三个不同层次的问题:

1. 当前正式设计链是否足以继续讨论实施目标与范围。
2. 哪些输入只能作historical / granularity reference,不能成为Sandbox实现真相源。
3. 哪些缺口不阻塞Step 2,但必须在正式移交实现前关闭。

### 2.1 正式设计输入

| 输入 | 当前状态 | 本Step用途 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | 正式需求已审查 | 固定C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、AC-SBX-001~041、VF-SBX-001~010、NFR、P0 / P1 / P2和非目标 |
| `projects/L4-sandbox/01-架构设计.md` | 正式架构已审查 | 固定execution isolation truth、职责 /数据所有权 /依赖方向、coherent boundary、fail-closed、capture、cleanup / reaper和redline |
| `projects/L4-sandbox/02-概要设计.md` | 正式概要已审查 | 固定六个主要组成部分、关键对象、接口骨架、处理流、状态主题、异常和配置影响 |
| `projects/L4-sandbox/03-详细设计.md` | 正式详细设计已审查 | 固定Rust workspace、七模块、对象 / port、55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38 typed error、flow、事务、幂等、并发、观测和测试切口 |
| `projects/L4-sandbox/04-配置设计.md` | 正式配置设计已审查 | 固定PROFILE-01~07、I001~I101、40配置组、D01~D44、source / generation / sensitive material / adapter binding和hard guard |
| `projects/L4-sandbox/05-测试方案.md` | 正式测试设计已审查 | 固定254 TC、38 CUT / CBC / PER、28 DS、7 ENV / PROFILE、16 suite、7 gate、17 planned脚本、21 ESLOT、九schema和回归规则 |
| `projects/L4-sandbox/06-验收标准.md` | 正式验收设计已审查 | 固定P0-C / P0-Q、功能 /架构 /协议 /状态 / NFR / evidence门禁、17 VETO、缺陷 /风险 /最终裁决契约;不提供runtime结果 |

### 2.2 解释性输入与规范输入

| 输入 | 当前状态 | 本Step用途 |
|---|---|---|
| `design-calibration/03_ddd_step_17_implementation_handoff.md` | 已完成并已被正式`03`承接 | 提供字段、DTO / Event / Job、Query view、状态、命名、phase / commit boundary预复核和实施前阅读索引 |
| `design-calibration/03_ddd_step_19_formal_document_assembly.md` | 已审查 | 证明正式`03`由当前Step链装配,旧`03`不再是实现入口 |
| `design-calibration/04_config_step_15_formal_document_assembly.md` | 已审查 | 证明正式`04`由配置Step链装配,planned配置与真实运行配置事实分离 |
| `design-calibration/05_test_plan_step_15_formal_document_assembly.md` | 已审查 | 证明正式`05`由测试Step链装配,无测试执行或runtime evidence事实 |
| `design-calibration/06_acceptance_step_15_formal_document_assembly.md` | 已审查并放行到`07` | 证明正式`06`设计装配完成;验收过程仍为`NotEntered` |
| `standards/document/实施计划讨论流程_SOP.md` | 已读取 | 固定Step 1~13顺序、逐Step停审、phase / boundary停审和正式装配条件 |
| `standards/document/实施计划书写规范.md` | 已读取 | 固定正式13章、阶段化可验证增量、提交纪律、永久记忆种子和移交前闭环审计 |
| `standards/document/代码实施台账与门禁规范.md` | 已读取 | 固定项目级ledger、boundary ledger、Commit Gate、Handoff Gate和planned skeleton预创建 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读取 | 固定字段、DTO、ref identity、状态、metadata、UoW、projection、artifact、evidence、phase boundary和经验复核口径 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 固定`L4-sandbox`职责和compile / runtime / event依赖分类 |

### 2.3 上游参考成熟度

| 参考 | 磁盘事实 | 本Step定位 | 禁止继承 |
|---|---|---|---|
| `projects/L2-tools/00~06` | 缺`04-配置设计.md`;现有文件为旧Draft /空checkbox口径 | historical seam reference;只用于确认tools拥有tool definition / policy / semantic result | 旧对象、Python / SDK、三态executor、产品、阈值、空验收结果和“sandbox执行tools语义” |
| `projects/L2-runtime/00~06` | 缺`04-配置设计.md`;现有文件为旧Draft /空checkbox口径 | historical seam reference;只用于确认runtime拥有agent loop、step推进、recover / backflow | runtime execution truth、agent loop、checkpoint / recover状态和旧验收结果不得进入Sandbox |
| `projects/L2-member-service/00~06` | 缺`04-配置设计.md`;现有文件为旧Draft /空checkbox口径 | historical seam reference;只用于确认member-service拥有host / session / worker lifecycle orchestration | host truth、member lifecycle、bind / restart / recycle和旧产品假设不得进入Sandbox |
| `projects/L1-identity/00~07` | 完整正式链 | implementation granularity reference | identity领域对象、协议、phase和boundary ID |
| `projects/L1-work/00~07` | 完整正式链 | implementation granularity reference | work领域对象、协议、phase和boundary ID |
| `projects/L1-governance` / `projects/L1-artifact`的`07`校准产物 | 已存在 | Step文件结构、输入风险分类、boundary / ledger粒度参考 | governance / artifact领域真相、TC、AC、EV或实现状态 |

L2三仓材料不完整且未按当前full-restart标准校准,因此不能作为Sandbox的权威“上游依赖基线”。它们的缺失不阻塞`07`设计讨论;未来真实接缝只能以Sandbox正式port / adapter / event / handoff契约和已确认的相邻仓正式契约为准。若二者出现冲突,必须登记cross-repo blocker,不能由实现者选边。

---

## 3. SOP问题回答

| SOP问题 | 本Step回答 |
|---|---|
| 当前仓是否具备完整`00/01/02/03/05/06`文档? | 是,并且正式`04-配置设计.md`也已具备。正式`07`尚不存在,符合从Step 1开始逐步生成的预期。 |
| 哪些版本是本轮实施计划基线? | 使用当前工作区内已审查的正式`00~06`及其对应校准链。当前Git HEAD是`edf2f8ca20cad08fbab76aa26cd74f50fb2e54f6`,但新版L4-sandbox设计链尚未由新的commit固定;因此HEAD只能记录为检查时仓库状态,不是可移交baseline。 |
| 详细设计是否足以支持1:1实现? | 足以进入phase / boundary设计讨论。正式`03`及Step 5~17已定义模块、对象字段、port、协议、55 flow、状态、持久化、错误、幂等、配置和观测。但`07`尚未定义具体boundary,所以不能宣称所有boundary已1:1可落码。 |
| 测试方案和验收标准是否足以定义阶段门禁? | 足以进入后续讨论。`05`提供TC、suite、gate、environment / profile、planned evidence和报告schema;`06`提供AC、VETO、缺陷、风险和最终裁决契约。Step 7仍必须逐phase / boundary绑定,不能只引用整份文档。 |
| 是否存在阻塞Step 2的上游冲突? | 未发现。验收阶段发现的状态名、evidence producer和固定路径冲突已回写owner文档并通过总审计。L2参考材料不完整被隔离为historical reference,不与当前Sandbox正式链竞争权威。 |
| 字段、DTO、状态和phase boundary是否闭环? | 字段、DTO / Event / Job、Query response、状态和命名已在详细设计Step 17预复核;phase / commit boundary尚不存在,只能判定“允许进入设计”,不能判定“已完成boundary闭环”。Step 5~6必须逐项重做。 |
| `05/06`是否使用详细设计正式字段、状态、接口和证据名称? | 当前静态审计通过:55协议、30个owner-level state machines、31个Step 10 canonical status enum entries、39个Step 6 shared status declarations和38 typed error与正式`03`闭集一致;`05/06`使用21 ESLOT、九schema及正式报告入口。planned ESLOT仍不是runtime EV。 |
| 哪些缺口阻塞实施计划,哪些可记录为风险继续? | 当前无缺口阻塞Step 2。阻塞正式移交实现的缺口包括design commit baseline未固定、目标实现仓不存在、phase / boundary闭环与经验复核未完成、implementation ledger / planned skeleton未创建。真实环境、candidate、run和evidence属于执行期缺口。 |

---

## 4. 当前文档与historical material问题诊断

| 位置 | 问题 | 影响 | 本Step处理 |
|---|---|---|---|
| `projects/L4-sandbox/07-实施计划.md` | 文件尚不存在 | 尚无合法phase、commit boundary或实现移交入口 | 保持不存在;Step 13才装配 |
| `design-calibration/07_*` | 原无flow和Step链 | 实施计划讨论不可恢复、不可追溯 | 已先建flow,本文件建立Step 1恢复点 |
| 设计Git baseline | 新版`00~06`、`04`和calibration链尚在工作区 | 实现agent无法仅靠当前HEAD复现设计输入 | 登记为handoff blocker;未经用户要求不commit |
| 目标实现仓 | `/home/aris/Projects/quantalithos-sandbox`不存在 | 无法执行仓库precheck或落码 | 登记为首个boundary前blocker;由Step 3 / 5决定准备方式 |
| 相邻实现仓 | tools / runtime / member-service实现仓不存在;`quantalithos-core`存在 | 无法做真实接缝或联合编译 | 非core相邻仓只走port / adapter / event / handoff / fake;不得转为path dependency |
| L2设计参考 | 三仓缺正式`04`,其余为旧Draft /空checkbox | 容易把旧职责、产品、阈值和伪结果写入Sandbox计划 | 仅作historical seam reference |
| boundary级闭环 | 目前只有详细设计Step 17预复核,无正式boundary | 无法判断某对象 / DTO /测试是否被错误后置 | Step 5~6由设计者逐phase / boundary审计 |
| 实施台账 | implementation ledger和boundary skeleton不存在 | 当前不能授权实现agent开工 | Step 6设计schema和矩阵;Step 13同步预创建全部文件 |
| runtime evidence | 无implementation commit、run、config digest、EV或签署 | 不能声称实现、测试或验收通过 | 明确为未来执行事实,不得预填 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| `06 -> 07`切换 | `06 / Step 15 / pending_user_review` | `06`已审查收口;`07 / Step 1 / pending_user_review` | 记录用户“继续”只放行设计文档切换 |
| 实施计划入口 | 无`07` flow和Step文件 | 新建flow和Step 1中间产物 | 满足中间产物先于正式文档 |
| 输入权威顺序 | 正式链、旧README、L2参考和标准散落 | 正式`00~06`为owner;校准产物解释;标准约束;L2仅historical reference | 防止旧材料与正式设计竞争真相源 |
| 缺口表达 | 目标仓、baseline、boundary和runtime缺口可能混写 | 分为Step blocker、handoff blocker、affected-boundary blocker和execution gap | 让后续暂停点与关闭责任明确 |
| 可落码结论 | 详细设计Step 17有整体预复核 | 明确“允许进入Step 2”不等于“允许直接实现” | 避免把预复核误作实现授权 |
| 台账责任 | implementation ledger可能留给实现agent | 固定Step 6设计、Step 13预创建全部planned skeleton | 避免实现阶段反复回设计侧补boundary |

---

## 6. 设计取舍

| 议题 | 可选方案 | 采用结论 | 理由 |
|---|---|---|---|
| 是否直接创建正式`07` | A. 立即写完整计划;B. 按Step 1~13推进 | 采用B | A跳过输入、范围、phase、boundary和台账审计 |
| 当前未固定commit是否阻塞Step 2 | A. 立即阻塞;B. 作为handoff blocker | 采用B | 设计讨论仍可继续,但实现移交必须有可复现baseline |
| 目标实现仓不存在如何处理 | A. 本Step创建;B. Step 3 / 5定义前置或首boundary | 采用B | 本任务只做设计文档,且仓库创建属于实施准备决策 |
| L2旧Draft如何使用 | A. 作为上游契约;B. historical seam reference | 采用B | 缺`04`且存在旧对象、空checkbox和未校准结论,不能覆盖Sandbox正式链 |
| 是否在Step 1宣布1:1可落码 | A. 整体宣布通过;B. 只作预判,逐boundary复核 | 采用B | phase / commit boundary尚未定义,整体结论无法约束先后依赖 |
| 是否现在创建ledger / skeleton | A. 先建空文件;B. Step 6定schema,Step 13一次性创建 | 采用B | 过早创建没有合法boundary ID,也会被误读为开工授权 |
| 是否画实施关系图 | A. 本Step画phase图;B. 暂不画 | 采用B | Step 1只确认输入,phase依赖图应由Step 5基于已确认范围生成 |

---

## 7. 结构化中间产物

### 7.1 实施输入边界表

| 输入层 | 权威输入 | 本计划可以承接 | 本计划不得重定义 | 状态 /风险 |
|---|---|---|---|---|
| 需求 | 正式`00` | 实施目标覆盖、需求ID、P0 / P1 / P2和非范围 | 新用户故事、需求优先级、Sandbox外职责 | 可用 |
| 架构 | 正式`01` | 阶段顺序、truth ownership、依赖分类、运行单元和红线 | 新仓边界、共享数据库、非core编译依赖、backend产品硬选型 | 可用 |
| 概要 | 正式`02` | 主要组成部分、对象轮廓、接口骨架、处理流和状态主题 | 新组成部分、旧五段对象主线或用对象清单替代功能增量 | 可用 |
| 详细 | 正式`03` + Step 5~17 | workspace / module / object / port / protocol / flow / state / UoW / error / idempotency / observability的实施顺序 | 新字段、trait、DTO、状态、错误、事务顺序或旁路surface | 可进入讨论;逐boundary待复核 |
| 配置 | 正式`04` | profile、source、validation、generation、sensitive material和adapter binding准备顺序 | 通过配置弱化coherent boundary、redline、fail-closed或truth ownership | 可用;真实binding待实现 |
| 测试 | 正式`05` | 每阶段关联TC / suite / gate / artifact / planned evidence和失败传播 | 新TC结果、静态EV、任意缩减P0-C / P0-Q | 可用;无执行事实 |
| 验收 | 正式`06` | 每阶段关联AC / VETO、缺陷 /风险 /裁决前置 | 重新定义通过条件、预填结论 /签署或把设计确认当验收通过 | 可用;过程`NotEntered` |
| 实施治理 | 实施计划 /台账 /可落码性标准 | phase、boundary、allowed scope、required checks、ledger、Commit / Handoff Gate | 跳过经验复核、让实现者现场补设计、提前激活未来boundary | 标准可用;具体矩阵待Step 5~6 |

### 7.2 Sandbox责任边界预检查

| 能力 | Sandbox本轮拥有 | 只消费 /输出接缝 | 禁止混入 |
|---|---|---|---|
| execution environment identity | context、environment identity、责任refs及受理状态 | identity / work / runtime safe refs | identity正文和runtime execution truth |
| resource / fs / network / process boundary | requirement、capability decision、coherent boundary及真实落实结果 | backend capability / lifecycle port | tool scope、business authorization或host lifecycle |
| launch policy | body-free decision summary消费、freshness / conflict检查和fail-closed enforcement | policy / governance safe summary | policy DSL、approval lifecycle、tool semantic policy |
| run / capture / handoff | controlled run、capture fact、material refs、handoff fact和receipt marker | artifact / observability handoff adapter | Artifact truth、telemetry store truth或ToolInvocationResult truth |
| failure / control | sandbox typed failure、control fact和public safe surface | runtime / tools / member-service反馈 | agent loop恢复、tool semantic retry或member orchestration |
| lease / cleanup / reaper | lease、orphan inspection、cleanup guard、release和reaper行为 | backend / investigation summary | host recycle、member session lifecycle或外部case lifecycle |
| security redline | detection、containment、investigation handoff guard和不可弱化规则 | security / policy safe ref与receipt | 外部调查truth、risk acceptance越权或自动解除containment |
| observability hooks | safe structured material、audit trace、marker和backpressure / outage行为 | L4-observability接收面 | telemetry存储、查询、保留和alert truth |

### 7.3 缺失输入风险表

| 风险ID | 缺失 /冲突 | 分类 | 阻塞范围 | 当前处理 | 关闭条件 |
|---|---|---|---|---|---|
| SBX-IMP-RISK-BASELINE-001 | 新版设计链未固定为新commit baseline | handoff blocker | 正式移交实现 | 继续Step 2~13,不自行commit | 用户确认设计链后固定可复现commit并记录真实hash |
| SBX-IMP-RISK-REPO-001 | 目标实现仓不存在 | first-boundary blocker | 首个仓库 / workspace boundary | Step 3 / 5决定创建策略 | 真实目录、git仓库和precheck完成;不得预造结果 |
| SBX-IMP-RISK-SIBLING-001 | tools / runtime / member-service实现仓不存在 | affected-boundary blocker | 需要真实接缝的boundary | 使用formal port / adapter / event / handoff / fake | 相邻仓就绪或当前boundary明确只验证接缝契约 |
| SBX-IMP-RISK-L2-DOC-001 | L2三仓缺`04`且其余材料是旧Draft | historical reference gap | 不阻塞Sandbox Step 2;可能阻塞未来联合接缝 | 不作为权威输入 | 相邻仓形成正式契约并完成cross-repo兼容审计 |
| SBX-IMP-RISK-PHASE-001 | phase / commit boundary未定义 | handoff blocker | 逐boundary开工 | Step 5~6设计并停审 | 跨phase / boundary审计无unresolved |
| SBX-IMP-RISK-CLOSURE-001 | boundary级字段 / DTO /状态 /证据 /经验复核未完成 | handoff blocker | 每个受影响boundary | 由设计者逐boundary复核 | 每项为passed / not_applicable或显式blocked,不得留给实现者 |
| SBX-IMP-RISK-LEDGER-001 | implementation ledger / skeleton不存在 | handoff blocker | 任何实现开工 | Step 6定义,Step 13预创建 | 项目级ledger与Boundary Gate Matrix全部文件存在且状态合法 |
| SBX-IMP-RISK-EXEC-001 | suite / script / CI / ENV / candidate不存在 | execution gap | 测试执行和资格 | Step 7 / 8写成门禁 | 真实环境和producer存在,只记录实际结果 |
| SBX-IMP-RISK-EVIDENCE-001 | 无run / config digest / runtime EV / review / signoff | acceptance blocker | runtime验收裁决 | 保持`NotEntered / absent_not_adjudicated` | 固定run按`05/06`生成并验证,不得由设计文档关闭 |

### 7.4 可落码闭环预判表

| 闭环复核项 | 正式来源 | 当前预判 | 尚不能证明 | 后续强制动作 |
|---|---|---|---|---|
| 字段与构造来源 | `03`对象契约;Step 6 / 9 / 17 | 预复核通过 | 每个boundary只使用当期可得字段 | Step 6逐boundary反查request / metadata / lookup / generator / config来源 |
| DTO / Event / Job构造 | `03`协议;Step 8 / 9 / 17 | 10 Command、9 Consumer、13 Event、10 Job整体映射已预审 | 是否被错误拆到后续boundary | Step 6核对public二级类型、receipt / report和stored replay同boundary可用 |
| Query response / view | `03`Query协议;Step 7 / 8 / 9 / 11 / 17 | 13 Query的view / page / marker已预审 | projection index、missing / degraded helper是否在当期可用 | Step 6核对no-write、public ref、lookup port和affected view identity |
| 状态闭环 | `03`状态矩阵;`05/06` | 30 owner machines /31 canonical enum entries /39 shared declarations exact-name静态一致 | 当前boundary是否同时具备触发函数、错误和测试 | Step 6逐boundary核对合法 /禁止迁移和cross-state guard |
| error / recovery | `03`Step 12;`05/06` | 38 typed error exact-name静态一致 | adapter / public mapping是否在当期完整 | Step 6 / 7核对typed reject、rollback、degraded、retry / dead-letter和redaction |
| metadata / idempotency | `03`Step 8 / 9 / 13 | canonical digest、stored replay和metadata authority已设计 | key / digest / stored result类型是否被后置 | Step 6逐mutation / consumer / job核对reserve -> effect -> store -> commit顺序 |
| repository / version / UoW | `03`Step 7 / 9 / 11 | logical store、expected version、cursor和UoW已设计 | fake / durable与当期repository surface是否同步 | Step 6逐写路径核对single writer、rollback visibility、commit unknown |
| outbox / relay | `03`Step 6~15 | committed payload / source cursor和no source rollback已设计 | payload builder、record schema、publisher是否同boundary | Step 6 / 7核对accepted UoW、publish retry和evidence producer |
| projection / read model | `03`Step 6~16 | stable ref、stale / rebuild / query边界已预审 | 某truth是否没有公开view却被要求mark stale | Step 6核对affected view、index lookup、rebuild plan和query no repair |
| config / external binding | `03`Step 14;正式`04` | source、generation、profile、adapter availability和hard guard已设计 | 真实backend / transport / store产品与实例 | Step 8按boundary绑定profile和unavailable / disabled / fake口径 |
| test / evidence | 正式`05/06` | TC / suite / gate / ESLOT / AC / VETO可映射 | producer代码、run identity和runtime EV存在 | Step 7逐boundary定义required checks和planned output;执行后才写结果 |
| artifact / observability handoff | `03/04/05/06` | body-free material ref、handoff / receipt和safe hook已设计 | Artifact / Observability下游实现就绪 | Step 6~8只验证Sandbox source truth与接缝,不接管目标truth |
| phase / commit boundary | 尚待`07` Step 5~6 | 未完成 | 先后依赖、独立review / test / rollback和经验复核 | 未完成前禁止直接移交实现 |

### 7.5 权威顺序与冲突处理

```text
normative standards
  -> 当前正式 00 / 01 / 02 / 03 / 04 / 05 / 06 的各自真相域
  -> 对应 design-calibration 产物用于解释和逐项反查
  -> 07 只定义实施顺序与门禁
  -> implementation ledger只记录未来实际执行状态
```

冲突处理规则:

1. `07`不得通过改写实施顺序来覆盖需求、架构、对象、协议、状态、测试或验收owner。
2. 正式文档与其校准产物不一致时,暂停受影响Step / boundary并回写owner,不得由实现者选择较方便的一版。
3. L2历史参考与当前Sandbox正式链冲突时,历史参考退出;若未来相邻仓形成正式冲突,登记cross-repo blocker并联合校准。
4. planned脚本、ESLOT、ledger skeleton和boundary计划均不是实现、执行或evidence事实。
5. 任何需要新增字段、port、状态、TC或AC才能落码的boundary都必须回到上游设计,不能在`07`或代码中补造。

### 7.6 是否允许继续与移交

| 判定项 | 结论 | 理由 |
|---|---|---|
| 是否允许进入Step 2 | 已允许 | 正式输入完整,当前未发现阻塞实施范围讨论的未解Sandbox设计冲突,且用户已确认本Step |
| 是否允许创建Step 2文件 | 已允许 | 用户确认后只放行Step 2,不放行Step 3或正式`07` |
| 是否允许创建正式`07` | 不允许 | 必须完成并确认Step 1~12,由Step 13装配 |
| 是否允许直接移交实现 | 不允许 | design baseline、目标仓、phase / boundary闭环、经验复核和台账骨架均未关闭 |
| 是否允许创建implementation ledger / skeleton | 不允许 | boundary ID和schema尚未由Step 6确定;必须在Step 13与正式`07`同步创建 |
| 是否表示runtime验收通过 | 否 | `06`审查只放行设计文档;验收过程仍`NotEntered`,最终结论仍不存在 |

---

## 8. 复杂度与分批判断

本Step包含正式输入、解释性输入、historical参考、风险分类和闭环预判,单文件可维持一个审查单元,无需拆分登记分件。phase和commit boundary尚无合法输入,因此本Step不预建矩阵分件;后续Step 5~6若单件过长,必须按phase / boundary分批写入并保持统一总表。

---

## 9. 正式章节回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP问题回答”“实施输入边界表”“缺失输入风险表”“可落码闭环预判表”和“是否允许继续与移交”,了解输入为何足以制定计划但尚不足以直接开工。

正式`07-实施计划.md` §1应收口为:

本实施计划承接L4-sandbox当前已审查的正式`00-需求文档.md`至`06-验收标准.md`。需求和架构定义execution isolation truth、职责与红线;概要设计定义主要组成部分和处理主线;详细设计及其校准产物定义可落码对象、port、协议、flow、状态和一致性契约;配置设计定义运行输入与不可弱化边界;测试方案和验收标准定义阶段验证、证据和裁决门禁。实施计划只把这些设计组织为可验证phase和commit boundary,不得形成第二套字段、DTO、状态、配置、测试或验收真相源。

Sandbox实施范围必须持续闭合execution environment identity、resource limits、filesystem / network / process coherent boundary、launch policy enforcement、run / capture / handoff、observability hooks、failure / control、lease / cleanup / reaper和security redline。tools semantic execution、runtime agent loop / recovery、member lifecycle orchestration、Artifact truth、Observability truth和Policy truth只通过正式接缝协作,不得进入Sandbox所有权。

正式移交实现前必须固定可复现design commit baseline,确认或创建目标实现仓,完成逐phase / commit boundary的字段、DTO、ref、状态、UoW、projection、evidence与phase边界闭环及经验复核,并同步创建项目级implementation ledger和全部planned boundary skeleton。当前没有真实implementation commit、run、evidence、测试结果、验收结论或签署。

---

## 10. 待确认事项与blocker

| 待确认事项 | 影响 | 当前处理 | 最迟关闭位置 |
|---|---|---|---|
| 本Step输入边界是否可作为Step 2前提 | 决定是否开始定义实施目标 /范围 | 用户已确认,由Step 2承接 | 已关闭 |
| 目标实现仓由首个boundary创建还是开工前独立准备 | 影响前置条件和PH-01 allowed scope | 后续比较两种方案 | Step 3 / Step 5 |
| phase / commit boundary如何按可验证纵切划分 | 影响顺序、review、测试、回退和ledger | 尚未定义,不得预判ID | Step 5 / Step 6 |
| implementation ledger目录、schema和Boundary Gate Matrix | 影响实现agent恢复与门禁 | 依台账规范设计 | Step 6;Step 13创建 |
| 新design baseline何时固定 | 影响实现agent复现输入 | 未经明确要求不提交 | 正式实现handoff前 |
| L2相邻仓何时形成当前正式接缝契约 | 影响联合接缝boundary | 先按Sandbox port / fake边界推进 | 首个受影响boundary前 |

当前未发现阻塞Step 2的上游设计blocker。以下项目仍阻塞直接实现移交:可复现design baseline、目标实现仓、phase / commit boundary整体闭环与经验复核、implementation ledger和全部planned boundary skeleton。以下项目只可能由未来真实执行关闭:suite / scripts / CI、环境 / candidate、`run_id`、config digest、runtime EV、测试结果、验收结论和签署。

---

## 11. 自检与停审

| 自检项 | 结果 |
|---|---|
| 是否读取正式`00~06`和本Step对应标准 | 通过 |
| 是否区分正式owner、解释性校准产物与historical reference | 通过 |
| 是否回答SOP八个问题 | 通过 |
| 是否给出实施输入边界表和缺失输入风险表 | 通过 |
| 是否预判字段 / DTO /状态 /证据 / phase boundary闭环 | 通过 |
| 是否明确Step 2与直接实现移交是不同门禁 | 通过 |
| 是否保持tools / runtime / member-service与Sandbox职责分离 | 通过 |
| 是否未创建正式`07`、implementation ledger或boundary skeleton | 通过 |
| 是否未伪造commit、run、evidence、测试结果、风险接受或签署 | 通过 |
| 是否需要上游设计回写 | 当前不需要;后续逐boundary复核触发时再回写 |

本Step已完成停审并经用户确认。后续只允许由`07_implementation_plan_step_02_scope.md`承接;仍不得写正式`07-实施计划.md`,不得创建implementation ledger或planned boundary skeleton。

---

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 正式`00~06`输入完整且权威顺序明确 | passed | 当前正式链为owner,L2旧Draft只作historical reference |
| 缺失 /冲突已分类 | passed | 已区分Step blocker、handoff blocker、affected-boundary blocker和execution gap |
| 详细设计可进入实施计划讨论 | passed_with_boundary_review_required | 整体预复核通过,逐boundary复核尚未完成 |
| 测试和验收可用于后续阶段门禁 | passed_for_planning | planned evidence不等于runtime结果 |
| 正式`07`未提前创建 | passed | 留待Step 13 |
| implementation ledger / skeleton未提前创建 | passed | Step 6设计、Step 13创建 |
| 用户确认Step 1 | passed | 用户已明确同意,Step 2已获放行 |

```text
step_1_result = completed_reviewed_passed_to_step_2
allow_step_2_discussion = yes
allow_formal_07_assembly = no
allow_implementation_handoff = no
upstream_design_blocker_for_step_2 = none
handoff_blockers = design_baseline,target_repo,boundary_closure,experience_review,implementation_ledgers
commit_required = no
```
