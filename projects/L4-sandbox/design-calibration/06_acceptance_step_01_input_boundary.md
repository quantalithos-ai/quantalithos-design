# Step 1. 确认验收输入边界

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 1
> 书写规范: `standards/document/验收标准书写规范.md`
> 回填章节: `06-验收标准.md` §1 与上游文档的关系声明
> 生成日期: 2026-07-13
> 状态: completed_reviewed_passed_to_step_2_with_step_3_path_writeback
> 所属流程: `06_acceptance_calibration_flow.md`
> 本Step口径: 只固定验收输入、权威顺序、证据成熟度、消费边界和后续基线待固定项;不定义具体验收项、不分配runtime EV、不填写测试结果、缺陷状态、风险接受、结论或签署,不修改旧正式`06`。

---

## 1. Step状态与Step内计划

| 检查项 | 结论 |
|---|---|
| 用户是否确认正式`05` | 是。用户明确回复“同意”;`05` Step 15、flow和项目台账已转`passed_to_06`。 |
| 项目 /文档 /Step门禁 | 通过。项目级允许进入`06`;`06_acceptance_calibration_flow.md`已先于本文件创建;本轮只允许Step 1。 |
| 是否读取通用标准 | 是。已读取设计文档编写通则、中间产物规范、真相源闭环标准、全局依赖裁剪规则。 |
| 是否读取验收阶段标准 | 是。已读取验收标准讨论流程SOP和验收标准书写规范。 |
| 是否读取正式输入 | 是。已复核正式`00~05`,重点覆盖AC / VF / NFR、架构边界、对象 /协议 /状态 /错误、PROFILE、测试进出 /证据 /回归 /风险。 |
| 是否读取关键handoff | 是。已复核`04` Step 12和`05` Step 13~15及证据schema / residual分件。 |
| 旧正式`06`定位 | historical material。十章旧结构、旧对象、泛化证据、无来源阈值、空checkbox、风险接受和签署占位均不得继承。 |
| 是否发现阻塞本Step的上游blocker | 否。正式`00~05`足以定义验收输入边界;真实交付、执行、证据和资格缺口阻塞实际验收,不阻塞Step 1设计。 |
| 当前状态 | Step 1全部小阶段和自检已完成;用户已明确确认并放行Step 2。 |

### 1.1 Step内计划

| 计划项 | 状态 | 可审查产物 /完成门禁 |
|---|---|---|
| 读取输入与恢复状态 | done | §2~§3;三层门禁、正式输入和historical material定位明确 |
| 回答SOP问题 | done | §4;五个问题逐项回答且未写执行事实 |
| 诊断旧正式`06` | done | §5;旧主语、结构、证据、阈值和签署污染已隔离 |
| 完成裁决取舍 | done | §6~§7;权威顺序、证据身份和正式装配时机明确 |
| 形成结构化中间产物 | done | §8;输入映射、必须 /不再回答、成熟度、待固定基线、blocker和上游影响闭合 |
| 形成§1回填草稿 | done | §10;只摘录已推导结论,不修改正式`06` |
| 自检并停审 | done | §11~§13;gate=`pass_wait_review`,下一步仅允许用户审查 |

### 1.2 模块级门禁

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| M1 权威输入与职责边界 | done | done | done | done | done | pass | pass | 由M2接续 |
| M2 evidence成熟度与消费边界 | done | done | done | done | done | pass | pass | 由M3接续 |
| M3 交付 / run /环境 /数据待固定基线 | done | done | done | done | done | pass | pass | 由M4接续 |
| M4 historical material、blocker与上游影响 | done | done | done | done | done | pass | pass_wait_review | 停审等待用户确认;不得进入Step 2 |

---

## 2. 本步目标与边界

本Step确认新版`06-验收标准.md`承接哪些需求、设计、配置、测试、证据和交付输入,并把“已有设计事实”“planned验证契约”“未来runtime证据”“实际验收结论”分层。这样后续门禁只能消费已固定来源,不会把设计表、ESLOT、静态Markdown或空checkbox伪装为验收证据。

本Step必须回答:

- 本轮验收依据哪些正式需求和设计,各自提供什么裁决输入。
- `05`中的TC、suite、ESLOT、raw artifact、report、runtime EV与acceptance draft分别处于什么成熟度。
- 哪些交付版本、source revision、环境、profile、config、数据、run和报告身份必须在后续Step固定。
- 哪些问题属于测试方案、实施计划、部署运维或相邻仓,验收标准不再回答。
- 当前是否有阻塞验收标准设计的上游缺口,以及哪些缺口只阻塞真实验收。

本Step不得回答:

- 不定义Step 5以后逐条正式验收项、通过条件、失败条件或裁决影响。
- 不决定`AC-SBX-*`需求验收编号与未来裁决项编号如何并存。
- 不固定真实implementation commit、`run_id`、config digest、环境实例或数据实例。
- 不分配`EV-SBX-*`,不创建raw / report / acceptance handoff文件。
- 不判断通过 /有条件通过 /不通过,不接受RR-SBX风险,不填写签署角色姓名。
- 不创建正式`07`、implementation ledger或planned boundary skeleton。

---

## 3. 本步输入

### 3.1 标准与流程输入

| 输入 | 状态 | 本Step用途 |
|---|---|---|
| `standards/document/验收标准讨论流程_SOP.md` | current standard | 固定Step 1~15顺序、验收项裁决小循环和Step 1五个问题 |
| `standards/document/验收标准书写规范.md` | current standard | 固定正式15章主链、三值结论、证据引用和§1输出要求 |
| `standards/document/设计文档编写通则.md` | current standard | 约束文档职责、真相源层级和正式正文边界 |
| `standards/document/设计文档讨论中间产物规范.md` | current standard | 约束flow、Step产物、三层门禁、分批写入和正式回填前置 |
| `standards/document/设计真相源闭环与可落码性标准.md` | current standard | 约束验收项必须回指可落码设计、TC、证据和phase边界 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | current standard | 约束仅`L0-core`编译期依赖及跨仓runtime / event / handoff边界 |

### 3.2 正式项目输入

| 输入 | 当前状态 | 本Step消费内容 | 不得反推的内容 |
|---|---|---|---|
| `00-需求文档.md` | current reviewed baseline | C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、AC-SBX-001~041、VF-SBX-001~010、六类NFR和非范围 | 不由`06`新增需求、业务规则、零容忍项或外围增强优先级 |
| `01-架构设计.md` | current reviewed baseline | execution isolation truth、职责 /数据所有权、依赖裁剪、coherent boundary、fail-closed、capture / handoff、cleanup / reaper / redline | 不由`06`选择backend、store、bus、sink、policy产品或部署拓扑 |
| `02-概要设计.md` | current reviewed baseline | 六个主要组成部分、关键对象、接口骨架、处理流、六组状态主题、异常和配置影响 | 不由`06`新增组件、对象、flow或状态主语 |
| `03-详细设计.md` | current direct design source | 七模块、10 Command、13 Query、9 Consumer、13 Event、10 Job、31个canonical状态enum entry /30个owner-level machine /39个shared declaration、事务 /一致性、38 typed error、观测和38 CUT | 不由`06`新增字段、DTO、port、repository、error、state或transport binding |
| `04-配置设计.md` | current direct config source | PROFILE-01~07、I001~I101、40配置组、D01~D44、AHG-01~19、EHR-01~20、VETO-CFG-01~16和开放风险 | 不把AHG写成已通过AC,不把EHR写成EV,不宣称PROFILE-05+ qualified |
| `05-测试方案.md` | current reviewed test baseline | 254 TC、250 P0、38 CUT / CBC / PER、28 DS、7 ENV / PROFILE、16 suite、7 gate、17 planned脚本、21 ESLOT、九schema、20 RT、8 RR | 不重写用例 / suite / schema,不把planned或Blocked状态改写为测试结果 |

### 3.3 直接解释与历史输入

| 输入 | 定位 | 本Step用途 |
|---|---|---|
| `04_config_step_12_downstream_handoff.md` | current explanatory input | 提供AHG / EHR证据成熟度、profile资格、VETO候选和`04 -> 06`责任边界 |
| `05_test_plan_step_13_evidence.md`及schema分件 | current explanatory input | 提供ESLOT、runtime EV派生、fixed-run目录、九类schema、pairing / digest / review边界 |
| `05_test_plan_step_14_regression_risks.md`及residual分件 | current explanatory input | 提供证据失效、Release scope、RR-SBX-001~008、不可接受风险和下游owner |
| `05_test_plan_step_15_formal_document_assembly.md` | reviewed handoff | 证明正式`05`覆盖闭集已审查,同时确认无真实run / EV /结果 |
| 旧`06-验收标准.md` | historical material | 仅用于污染诊断和Step 15差异审计,不得成为当前结论来源 |
| L1-governance / L1-artifact验收flow与Step 1 | granularity reference | 参考输入映射、证据成熟度、待固定基线、historical / blocker和停审粒度 |

---

## 4. SOP问题回答

| SOP问题 | 回答 |
|---|---|
| 本轮验收依据哪些需求和设计? | 依据用户已确认的正式`00~05`。需求裁决入口是C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、AC-SBX-001~041、VF-SBX-001~010和六类NFR;可判定设计来源是`01`职责 /所有权 /红线、`02`组成 /flow /状态主题、`03`字段 /协议 /状态 /事务 /错误 /观测契约和`04`PROFILE /配置 /hard guard。 |
| 哪些测试证据会支撑验收裁决? | `05`定义的254 TC、250 P0、16 suite、7 gate、21 ESLOT和九类schema给出生产计划;只有固定run中合法raw / report pair、checks、digest、coverage、redaction、dependency和review均成立后,才允许派生`EV-SBX-*`供`06`消费。当前没有runtime EV。 |
| 哪些交付版本、环境和数据会成为基线? | Step 3后续必须固定送验实现revision、design / subject / core-contracts / harness refs、workspace状态摘要、PROFILE / ENV实例、config generation与digest、backend / provider / target identity、DS / fixture manifest、release `run_id`、suite / gate manifest和fixed report roots。当前只列必填类别,不填真实值。 |
| 哪些内容属于测试方案或实施计划,不应写进验收标准? | TC步骤、fixture builder、suite选择算法、gate / script实现、schema writer、implementation phase / commit boundary、开发排期、部署命令、产品选型、运维阈值和runbook不进入`06`;`06`只引用它们形成的固定契约或真实证据做裁决。 |
| 是否存在阻塞验收标准生成的上游缺口? | 不存在阻塞Step 1~2设计的上游缺口。目标仓、suite / script / CI、ENV实例、candidate backend、provider、dedicated lab、fixed run、runtime EV、defect disposition、retention物理策略和签署缺失会阻塞实际验收或相关后续门禁,但不得在设计阶段伪造。 |

---

## 5. 当前文档与historical material问题诊断

| 位置 /材料 | 当前问题 | 本Step处理 |
|---|---|---|
| 旧正式`06`整体结构 | 只有10章,不符合现行15章主链,也没有逐章校准来源 | 保持文件不变并标记historical material;Step 15 full-restart重建 |
| 旧正式`06` §1~§4 | 围绕CreateSession / AttachSession / ApplyIsolationPolicy / RunCommand / Output / Control旧主线,无法覆盖新版execution identity、55协议、并行状态、配置和资格边界 | 不继承;后续Step 2~8从正式`00~05`重建验收主语 |
| 旧正式`06`证据列 | 使用API响应、DB记录、trace、compare report、cleanup log等泛化描述,没有TC、ESLOT / EV、fixed run、raw / report pairing和digest | 后续Step 5~10必须闭环到正式设计、TC和真实fixed-run证据 |
| 旧正式`06`非功能表 | 写入`100%样本链`、`在阈值内`等无正式负载 /阈值来源表达 | 后续Step 9只承接需求零容忍与结构有界;量化项无基线时保持conditional /不可裁决 |
| 旧正式`06`缺陷 /风险表 | 旧S/A/B和风险行未绑定新版P0、VF / VETO、证据失效、接受主体 /期限 /动作 | 后续Step 11~13重建,当前不得视为已接受风险 |
| 旧正式`06`最终结论 | 存在空`[待评审结论]`和签署占位 | 不作为结论或签署;Step 14只定义口径,实际值必须来自真实验收 |
| 正式`05`证据 | 已定义planned slot和runtime EV生成规则,但P0-C为NotEvaluated、P0-Q为Blocked、P1为NotRunConditional | 保持真实成熟度,不把设计完整性误写为测试通过 |
| 正式`00~04` | 输入闭合且没有发现互相冲突到无法裁决的正式契约 | 作为新版`06`权威设计输入 |

---

## 6. 改动前后对比

| 维度 | 旧口径 | 本Step收稳后的口径 | 原因 |
|---|---|---|---|
| 验收输入 | 旧`02/03/05`与旧对象方向 | 用户确认的正式`00~05` + 精确handoff | 防止旧设计链覆盖current truth |
| 验收主体 | session / command / output / control五段旧主线 | execution identity、coherent boundary、policy、run / capture / handoff、failure / cleanup / redline及read-side边界 | 对齐新版设计主语和用户重点边界 |
| 证据身份 | API / DB / trace / report泛化描述 | TC + ESLOT planned identity -> fixed raw / report -> runtime EV -> acceptance packet | 支撑复验、审计和反伪造 |
| 基线 | test / staging等泛化环境 | immutable source refs + ENV / PROFILE + config digest + DS manifest + fixed release run | 防止跨版本 /跨profile拼接证据 |
| 结论 | 空checkbox和待评审占位 | 只在真实基线和有效证据齐全后按三值规则裁决 | 避免静态文档伪造通过 |
| 正式生成 | 在旧`06`上直接修补 | Step 1~14逐步确认,Step 15 full-restart装配 | 保证门禁来源和审查链可追溯 |

---

## 7. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 旧正式`06`处理 | 仅作historical material,Step 15全量重建 | 在旧十章上局部增补 | 主语、结构、证据和成熟度均已失配 |
| 是否纳入`04-配置设计.md` | 纳入正式验收输入 | 机械只读SOP列出的`00/01/02/03/05` | Sandbox安全与profile资格大量hard guard由`04`正式定义,忽略会造成验收缺口 |
| AHG / EHR定位 | 分别保持acceptance handoff requirement和evidence handoff requirement | 直接改名正式AC / EV | 它们只有设计 /planned成熟度,没有runtime identity和结果 |
| ESLOT / EV定位 | ESLOT只定义planned证据槽;真实链完整后才分配`EV-SBX-*` | 预留全部EV或用静态Markdown补齐 | 预留会把missing事实伪装成存在 |
| 验收项编号 | Step 1不决定;Step 2 /5必须保护`AC-SBX-001~041`需求编号并建立无歧义裁决项策略 | 现在重编号或覆盖需求AC | 当前问题只是输入边界,提前编号会越Step |
| 送验 / run基线 | Step 3定义schema与固定规则,实际验收时填写真实值 | 当前填placeholder commit / run_id | placeholder易被误消费为真实基线 |
| 相邻仓能力 | 只验Sandbox拥有的隔离语义和正式接缝 | 把tools semantics、runtime loop、member lifecycle纳入Sandbox总体通过 | 会扩大truth ownership并形成跨仓越权裁决 |
| 实施承接 | 正式`06`完成并经用户确认后才进入`07` | 当前提前创建ledger / boundaries | 违反文档切换门禁且会让实现边界缺少验收输入 |

---

## 8. 结构化中间产物

### 8.1 验收输入映射表

| 来源文档 /输入 | 验收输入 | 本文后续如何裁决 | 主要Step |
|---|---|---|---|
| `00-需求文档.md` §2 / §7 / §9 / §10 | Sandbox定位、C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033 | 转为核心功能范围、边界门禁和不可越权裁决;不验tools semantics、runtime loop或member lifecycle正文 | Step 2 /5 /6 |
| `00-需求文档.md` §13 | 性能、可用性、安全、审计 /追溯、幂等 /一致性、可观测性六类NFR;零容忍与候选阈值分层 | 零容忍项形成P0门禁;无正式负载 /阈值来源的量化项保持conditional或不可裁决 | Step 9 |
| `00-需求文档.md` §14 | AC-SBX-001~041和VF-SBX-001~010 | AC作为需求验收来源,VF作为一票否决必审输入;后续裁决项不得覆盖原编号语义 | Step 5~11 |
| `01-架构设计.md` §4 / §8 / §9 | execution isolation truth、职责边界、依赖方向、数据所有权、一致性 | 转为truth ownership、外部正文、唯一sibling compile dependency和no-second-truth门禁 | Step 6 /7 /8 |
| `01-架构设计.md` §7 / §10 / §13 | 同步 /异步 /后台职责、coherent boundary、fail-closed、capture / handoff、cleanup / reaper / redline、只读派生 | 转为运行边界、交接、failure / lifecycle、安全红线和no-write / no-repair裁决 | Step 5~10 |
| `02-概要设计.md` §4~§10 | 六个主要组成部分、关键对象、五类接口、关键flow、六组状态主题和异常 | 用于组织验收主题,并确保核心 /生命周期 /read-side分层不被压成单线状态 | Step 5~8 |
| `03-详细设计.md` §6~§8 | 对象 / port索引、10 Command、13 Query、9 Consumer、13 Event、10 Job | 作为逐P0验收项的正式协议与字段来源,跨仓只验transport-neutral接缝 | Step 5 /7 |
| `03-详细设计.md` §9~§14 | 31 canonical enum entry /30 owner-level machine /39 shared declaration、transaction /一致性、38 typed error、幂等 /并发、配置绑定、观测 /审计 | 作为状态、事务、错误恢复、配置和证据门禁的可判定设计契约 | Step 6 /8 /9 /10 |
| `03-详细设计.md` §15 | 38个测试切口 | 通过正式`05`的CUT / CBC / PER / TC闭环进入验收,不直接把设计检查当测试证据 | Step 5~10 |
| `04-配置设计.md` §6~§12 | PROFILE-01~07、I001~I101、配置来源 /generation /sensitive /change /failure、AHG-01~19、EHR-01~20 | 转为profile证明上限、配置hard gate、evidence class和VETO候选;不得宣称P05+已qualified | Step 3 /6 /9~11 |
| `04-配置设计.md` §14 | VETO-CFG-01~16、RSK / OQ、下游关闭门禁 | 与VF和测试不可接受项合并审计,但正式VETO编号及风险接受边界由后续Step定义 | Step 11 /13 |
| `05-测试方案.md` §3~§6 | 38 CUT / CBC / PER、55协议、31 STA、38错误、254 TC | 为每个验收项提供TC来源、断言闭集和覆盖分母;`06`不重复设计用例 | Step 5~10 |
| `05-测试方案.md` §7~§10 | 28 DS、7 ENV / PROFILE、16 suite、7 gate、17 planned scripts和六类NFR方法 | 固定验收证据的生产条件和证明上限;脚本 /环境不存在时保持Blocked / NotEvaluated | Step 3 /4 /9 /10 |
| `05-测试方案.md` §11~§12 | S / A / B、复验、进入 /退出、250 P0和当前readiness | 转为验收进入 /退出、缺陷、复验和放行影响;当前未满足实际进入条件 | Step 4 /12 |
| `05-测试方案.md` §13 | 21 ESLOT、九类schema、fixed-run目录、runtime EV派生、acceptance draft和review | 只消费真实fixed run中通过真实性门禁的EV / reports;planned slot与draft不能作为裁决结果 | Step 3 /10 |
| `05-测试方案.md` §14 | 20 RT、证据失效、Release scope、RR-SBX-001~008和不可接受项 | 转为基线变更、缺陷复验、残余风险、风险接受和禁止放行规则 | Step 3 /12 /13 |

### 8.2 用户重点边界承接表

| 用户重点边界 | 权威输入 | 验收输入形态 | 不得混入的相邻职责 |
|---|---|---|---|
| execution environment identity | `00` C-SBX-1 / AC-001 /006~008;`03` context / identity对象与协议;`04` config identity | 身份、责任链、profile / generation / source refs和fixed-run identity一致性 | identity / member / work / runtime正文和生命周期 |
| resource limits | `00` C-SBX-2;`01` coherent boundary;`03` boundary requirement / decision;`04` boundary配置 | resource与FS / network / process共同成立,不可单独放宽或猜测后端能力 | tools配额语义、finance cost truth、后端产品自身策略 |
| filesystem / network / process boundary | `00` AC-002 /009~011 /027 /038;VF-003;`03/04/05`负向契约 | 四维P0-C契约证据 + 独立P0-Q candidate-real conformance证据 | 低profile seam / fake结果替代真实边界资格 |
| tool / runtime launch policy | `00` C-SBX-3;`01` policy外部truth;`03` policy decision;`04` policy source / hard guard | 只消费body-free policy / authorization摘要,missing / conflict / unsupported必须fail-closed | ToolDefinition / ToolPolicy语义执行、runtime agent loop / recover |
| artifact capture | `00` C-SBX-4;`01` capture / handoff分层;`03` CaptureFact / HandoffFact;`05` EXECUTION / AUDIT slot | capture truth、候选材料、handoff receipt和下游formal truth分层证据 | Artifact正文、baseline、formal evidence truth或入库决策 |
| observability hooks | `00` FR-013;`01` observability material边界;`03` log / metric / audit;`04` safe signal;`05` AUDIT slot | safe hook、durable business audit、redaction和handoff状态分别验证 | observability store、retention、alert truth和provider audit冒充business audit |
| failure classification | `00` FR-015;`03` 38错误与FailureClassification;`05` ERROR / SAFETY slot | typed failure、unknown / pending、恢复和public safe mapping可判定 | runtime business failure / recover或member host failure truth |
| cleanup / lease / reaper | `00` FR-018 / VF-007~008;`03` Lease / Orphan / CleanupGuard;`04` guard-first;`05` SAFETY / P0-Q lifecycle | stop-new-use、evidence / investigation guard、orphan inspection、诚实release状态 | 强制cleanup绕guard、运维脚本伪造释放、runtime replay |
| security redlines | `00` FR-016 / VF;`01` containment;`03` RedlineContainment;`04` VETO-CFG;`05`专项 / slot | detected -> contained -> investigation handoff,未闭合不得解除guard | advisory-only告警、自动解除、风险接受绕过containment |

### 8.3 验收标准必须回答的问题

| 必须回答的问题 | 主要输入 | 后续Step |
|---|---|---|
| 本轮验收裁决哪些P0能力,哪些P1 / P2只在激活时适用? | `00`核心 /外围增强;`04/05` PROFILE与优先级 | Step 2 |
| 需求、设计、实现、共享契约、配置、环境、数据、run和证据的immutable基线是什么? | 正式`00~05`;`05` fixed-run schema | Step 3 |
| 什么条件下允许开始、暂停、恢复、结束或判定不可裁决? | `05` §11~§13;实际交付输入 | Step 4 |
| C-SBX-1~5与FR-SBX-001~018分别如何判定通过 /失败? | `00` AC;`03`协议 /flow;`05` TC / slot | Step 5 |
| execution isolation truth、四维边界、外部正文、配置hard guard和依赖裁剪如何判定? | `01/03/04`;VF / VETO-CFG | Step 6 |
| 55协议及跨仓runtime / event / handoff接缝如何判定,下游未就绪如何影响Sandbox结论? | `03`协议;`05` protocol TC;依赖裁剪标准 | Step 7 |
| 31 canonical enum entry /30 owner-level machine、事务、幂等、并发、重复回放、Query no-write和Job no-repair如何判定? | `03` §9~§12;`05` STA / TXN / RACE | Step 8 |
| 六类NFR、零容忍指标、结构有界和无来源量化阈值如何裁决? | `00` §13;`05` §10 / RR | Step 9 |
| planned ESLOT何时可形成runtime EV,raw / report / check / digest / review缺失如何传播? | `05` §13及schema | Step 10 |
| 哪些VF / VETO-CFG / evidence fraud / weak fallback命中后总体必须不通过? | `00` VF;`04` VETO-CFG;`05`不可接受项 | Step 11 |
| S / A / B缺陷、修复、复验、证据失效和放行如何影响结论? | `05` §11 / §14 | Step 12 |
| RR-SBX-001~008哪些可接受,由谁接受,动作 /期限 /失效条件是什么? | `05` §14;实际送验风险 | Step 13 |
| 通过 /有条件通过 /不通过如何计算、签署、归档和进入下一阶段? | Step 1~13 | Step 14 |

### 8.4 验收标准不再回答的问题

| 不再回答的问题 | 正确归属 | `06`只允许做什么 |
|---|---|---|
| 新增 /修改目标、用户故事、FR / BR / AC / VF或核心优先级 | `00-需求文档.md` | 发现缺口时登记blocker并回写`00` |
| 修改架构职责、truth ownership、依赖方向、数据归属或运行单元 | `01-架构设计.md` | 按既有红线裁决,冲突时回写`01` |
| 新增组件、关键对象、接口骨架、处理流或状态主题 | `02-概要设计.md` | 只引用现有概要结构组织验收主题 |
| 新增字段、DTO、port、repository、协议、状态、错误、事务或观测carrier | `03-详细设计.md` | 只引用可落码契约,不可判定时DesignReopen |
| 新增配置项、profile、source、secret slot、adapter binding、hard guard或activation语义 | `04-配置设计.md` | 验证配置契约是否成立,不得补配置设计 |
| 新增 /修改TC步骤、fixture、DS、suite、gate、script、schema、slot或回归选择算法 | `05-测试方案.md` /未来实现仓测试 | 只消费TC和真实证据;覆盖缺口回写`05` |
| 填写测试执行日志、case结果、缺陷处置或证据索引正文 | 实际测试run / defect tracker / reports | 只引用固定ID、路径、digest和review结论 |
| 拆分phase / commit boundary、任务排期、允许 /禁止代码范围和提交信息 | `07-实施计划.md` | 定义能否进入实施下一阶段的验收门禁 |
| 选择backend / store / bus / sink / provider产品、部署命令、告警阈值、retention介质或runbook | `07/09`及ADR /运维流程 | 把未闭合项判为blocker、conditional或风险,不代选产品 |
| ToolDefinition / ToolPolicy语义执行、runtime agent loop、member host lifecycle、Artifact / observability truth | 对应相邻仓 | 只验Sandbox正式接缝和“不越权拥有”红线 |

### 8.5 证据成熟度与消费边界

| 层级 | 当前对象 | 当前成熟度 | `06`允许消费 | 禁止写法 |
|---|---|---|---|---|
| 设计契约 | 正式`00~04` | reviewed design baseline | 用作验收项设计来源与通过 /失败语义 | “设计表存在所以验收通过” |
| 测试设计 | 254 TC、38 CUT / CBC / PER、16 suite、7 gate | reviewed planned test baseline | 用作覆盖分母、producer和应有断言 | “TC已定义所以测试通过” |
| evidence requirement | AHG-01~19、EHR-01~20 | planned handoff requirement | 用作门禁主题和required evidence class | 把AHG直接写成Passed AC或把EHR改名EV |
| planned evidence identity | ESLOT-SBX-001~021 | planned slot;001~019 P0,017~019 Blocked,020~021 conditional | 用作未来runtime EV family、expected slot与missing判定 | 预建`EV-SBX-*`或把slot当真实证据 |
| runtime raw / report | `artifacts/test/<run_id>`与`reports/runs/<run_id>` | not created | 只有固定identity、schema、pairing、digest、coverage和check合法时消费 | 使用`latest`、project子层、静态JSON或手写Markdown |
| runtime evidence alias | `EV-SBX-<FAMILY>-<NNN>` | not assigned | 只在对应slot有真实raw / report pair和前置check后消费 | 为missing / Blocked slot预留alias |
| acceptance packet | `reports/acceptance/*.md`;`reports/review/*.md`固定入口 | not created | 文件正文绑定fixed release run、来源digest和review version,作为送验交接、veto、risk、issues和独立review入口 | draft等同裁决、签署或风险接受 |
| defect / residual disposition | S / A / B与RR-SBX-001~008 | designed taxonomy;无真实实例处置 | 只消费绑定fixed run和真实owner / action /期限的记录 | 预填accepted、closed或waived |
| 最终验收事实 | 三值结论与签署 | not started | 仅在Step 14规则和真实证据均满足后形成 | 当前填写通过、有条件通过、不通过或签名 |

证据消费链必须保持:

```text
reviewed design contract
  -> reviewed TC / suite / gate / ESLOT plan
     -> immutable delivery + ENV / PROFILE + config + data baseline
        -> fixed run raw / report / checks / digests
           -> runtime EV allocation and independent review
              -> acceptance item decision
                 -> overall three-value conclusion and sign-off
```

关键说明:

- 上游设计和测试计划决定“应该证明什么”,不能证明“已经发生什么”。
- runtime EV身份必须由真实run事实派生,不能由文件名、slot编号或手工报告预造。
- P0-C的deterministic证明与P0-Q的candidate-real证明相互独立,不得替代或跨packet拼接。
- acceptance draft只负责交接固定run材料,最终裁决仍由`06`规则和签署角色完成。

### 8.6 后续交付 / run /环境 /数据基线待固定项

| 待固定基线 | 必填内容 | 来源 /固定位置 | 缺失影响 | 后续Step |
|---|---|---|---|---|
| 设计基线 | design repository immutable revision;正式`00~06`一致性状态 | 送验说明 + source revisions | 不能证明验收规则对应哪个设计版本 | Step 3 |
| 实现基线 | subject repository revision、workspace dirty状态摘要、build identity | `meta/source-commits.json`及送验说明 | 不能识别送验对象或复验是否仍同一版本 | Step 3 |
| 共享契约基线 | `core-contracts` exact revision /等价immutable ref | `meta/source-commits.json` | 55协议和typed carrier可能跨版本漂移 | Step 3 /7 |
| 测试工具基线 | harness / suite / script / report generator revision | `meta/source-commits.json`;suite manifest | 结果无法绑定执行器与报告生成器版本 | Step 3 /10 |
| 配置基线 | PROFILE、ENV、config generation / identity / digest、source refs、feature / handoff状态 | `meta/config-digest.json`;context | 无法证明hard guard和同代完整性 | Step 3 /6 /9 |
| 环境基线 | ENV / PROFILE实例、backend / provider / target / store / bus / sink身份、安全与隔离作用域 | context + qualification result | 无法确定证明上限;P0-Q必须Blocked | Step 3 /9 /10 |
| 数据基线 | DS manifest、fixture / parameter IDs、seed / clock / namespace、forbidden body / secret规则 | context + suite reports | 覆盖分母、复现和隔离不可审计 | Step 3 /5 /10 |
| 运行基线 | release `run_id`、intent=`Release`、scope、trigger / change refs、gate / suite / expected TC / slot清单 | `meta/context.json` | 不得进行整体验收或跨run聚合 | Step 3 /4 /10 |
| 原始证据基线 | raw case、suite report、stdout / stderr、qualification、checks、evidence index及digests | `artifacts/test/<run_id>` | 缺任一required pair / check时对应项不可裁决 | Step 4 /10 |
| 报告基线 | summary、gate、coverage、protocol、PER、redaction、dependency、report audit和evidence details | `reports/runs/<run_id>` | 人 / Agent无法复核机器事实和覆盖 | Step 4 /10 |
| 验收交接基线 | handoff、veto checklist、risk acceptance、open issues、independent review | `reports/acceptance/*.md`;`reports/review/*.md`;文件内固定release run / digest / review version | 不得开始最终裁决或签署 | Step 4 /10~14 |
| 缺陷基线 | defect ID、severity、affected TC / EV、fix revision、retest run、disposition | defect record + fixed reports | 不能判断退出、复验或放行 | Step 4 /12 |
| 风险基线 | RR ID、影响、缓解、owner、acceptor、action、deadline / expiry、关闭证据 | risk acceptance report | 不得判有条件通过 | Step 13 /14 |

本表只固定未来必须具备的基线类别和固定入口,不表示任何实例已存在。正式路径不得使用`latest`,不得把设计仓静态文档或旧process存活状态当作实现 /运行基线。

### 8.7 Historical material与blocker记录

| ID | 类型 | 状态 | 冲突 /缺口 | 本Step处理 |
|---|---|---|---|---|
| SBX-ACC-STEP1-001 | input boundary gap | resolved_for_step_1_wait_review | 正式`00~05`、handoff、ESLOT / EV和送验基线原未形成统一验收输入地图 | §8.1~§8.6已完成输入、职责、成熟度与待固定基线闭环 |
| SBX-ACC-HIST-001 | historical material | contained | 旧`06`十章、旧对象、泛化证据、无来源阈值、空checkbox、风险接受与签署可能污染新版裁决 | 保持旧正式文件不变;Step 15全量替换,当前不继承任何结论 |
| SBX-ACC-EVIDENCE-001 | runtime evidence gap | open_for_runtime_evidence | 无raw / report / check / review和runtime EV | 不阻塞Step 1设计;阻塞实际验收项判定和总体结论 |
| SBX-ACC-DELIVERY-001 | delivery baseline gap | open_for_delivery_baseline | 无目标实现仓、送验revision、config digest或fixed release run | 不阻塞Step 1设计;Step 3 /4必须定义缺失传播 |
| SBX-ACC-EXECUTION-001 | implementation / execution gap | open_for_07_precheck_and_execution | suite、scripts、CI和ENV实例不存在 | 不阻塞Step 1设计;不得伪造进入条件已满足 |
| SBX-ACC-P0Q-001 | qualification gap | open_for_p0q_execution | candidate backend、provider、capability matrix和dedicated lab不存在 | P0-Q保持Blocked;P0-C和P1不可替代 |
| SBX-ACC-RETENTION-001 | physical policy gap | open_for_07_09_physical_policy | retention只有condition guard,无介质和数值策略 | Step 13判断风险 /条件;`07/09`后续落物理策略 |
| SBX-ACC-IMPLEMENT-001 | downstream document gap | blocked_by_formal_06 | 正式`07`及其implementation ledger / planned skeleton不存在 | 当前不得创建;正式`06`经用户确认后再进入`07` |

### 8.8 对上游设计的影响判定

| 上游文档 | 复核问题 | 结论 | 当前动作 |
|---|---|---|---|
| `00-需求文档.md` | C / FR / BR / AC / VF / NFR是否足以定义验收来源? | 足够;编号和零容忍边界明确 | 无回写 |
| `01-架构设计.md` | truth owner、职责、依赖、四维边界、policy、capture、cleanup / redline是否冲突? | 未发现冲突;架构红线可进入后续门禁 | 无回写 |
| `02-概要设计.md` | 组件、对象、flow、状态主题是否能组织验收范围? | 足够;不需要新增概要主语 | 无回写 |
| `03-详细设计.md` | 55协议、31 canonical enum entry /30 owner-level machine、事务 /错误 /观测是否有可判定来源? | 足够;后续必须逐项绑定TC和runtime证据 | 无回写 |
| `04-配置设计.md` | PROFILE、AHG / EHR、VETO-CFG和hard guard是否可消费且成熟度诚实? | 足够;AHG / EHR必须保持requirement而非结果 | 无回写 |
| `05-测试方案.md` | TC、进入 /退出、ESLOT、schema、fixed path、回归和RR是否能支撑验收? | 设计完整;执行事实为0且已明确Blocked / NotEvaluated | 无回写 |

当前判定:`no_upstream_writeback_required_for_step_1`。若后续Step发现某验收命题没有正式设计契约、TC、evidence producer或失败传播,必须把本判定转为`blocker_if_triggered`,暂停并回写对应上游Step。

---

## 9. 复杂度与分批判断

| 检查项 | 结论 |
|---|---|
| 是否属于复杂Step | 是。输入跨正式`00~05`、配置handoff、测试证据、historical material和未来交付基线。 |
| 是否需要拆分Step文件 | 否。当前只做输入边界,结构化表可在单文件内审查;未展开逐AC裁决。 |
| 是否修改正式`06` | 否。Step 15前禁止正式回填。 |
| 是否创建未来Step文件 | 否。仅flow总计划和当前Step 1文件存在。 |
| 是否创建实现 /证据产物 | 否。无implementation ledger、boundary skeleton、run目录、EV、报告或签署。 |

---

## 10. 正式§1回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP问题回答”“验收输入映射表”“证据成熟度与消费边界”“后续交付 / run /环境 /数据基线待固定项”和“Historical material与blocker记录”小节,了解本章输入边界如何收敛。

正式`06-验收标准.md` §1后续应回填以下收口结论:

1. 本验收标准承接用户已确认的正式`00-需求文档.md`至`05-测试方案.md`;需求提供C / FR / BR / AC / VF / NFR,设计提供职责、对象、协议、状态、事务、错误、配置和安全红线,测试方案提供TC、环境、suite、gate、evidence和回归契约。
2. 本文只裁决`L4-sandbox`拥有的execution environment identity、coherent resource / filesystem / network / process boundary、给定launch policy执行、capture / handoff、observability hooks、failure classification、lease / cleanup / reaper和security redline是否成立。
3. Tools semantic execution、runtime agent loop / recover、member lifecycle orchestration以及identity / work / artifact / observability / policy正文不属于Sandbox验收主体;本文只验其正式接缝和“不越权拥有”边界。
4. AHG-01~19、EHR-01~20和ESLOT-SBX-001~021只表示设计 /planned handoff;只有固定run的raw / report / checks / digests / review完整后才允许分配并消费`EV-SBX-*`。
5. 旧正式`06-验收标准.md`只作historical material。旧十章结构、旧对象、泛化证据、无来源阈值、空checkbox、风险接受和签署不得进入新版正式结论。
6. 送验实现revision、共享契约revision、ENV / PROFILE、config digest、数据manifest、release `run_id`、runtime EV、acceptance packet、缺陷和风险处置必须在Step 3及后续按真实事实固定;当前不填假值。
7. 验收标准回答什么条件下通过 /有条件通过 /不通过,不重新定义需求、设计、测试用例、实施任务、产品选型、部署命令或运维runbook。

本草稿不允许提前写入正式`06`;只有Step 1经用户确认并最终进入Step 15装配时才可作为§1输入。

---

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 | 最晚关闭点 |
|---|---|---|---|
| 正式验收裁决项编号如何与需求`AC-SBX-001~041`并存 | 影响Step 5以后稳定引用和证据映射 | 不在Step 1发明;建议保留需求AC原义并为裁决项采用不冲突的正式编号族 | Step 2 /5 |
| 送验实现仓和immutable source revisions | 影响验收基线与复验身份 | 当前缺失,不得填placeholder | Step 3 /实际送验前 |
| PROFILE-05 candidate packet和P0-Q环境 | 影响四维真实隔离、lifecycle和anti-substitution裁决 | 当前Blocked;不得由P0-C替代 | Step 3 /4 /实际验收前 |
| PROFILE-06 /07是否进入本轮范围 | 影响conditional / inactive门禁和RR-SBX-001 /003 | 当前按P1 conditional / P2 inactive处理,由Step 2正式裁剪 | Step 2 |
| fixed release run、runtime EV和independent review | 影响所有P0裁决和最终签署 | 当前不存在;Step 3 /4 /10定义必填和失败传播 | 实际验收前 |
| retention物理策略 | 影响RR-SBX-008、cleanup guard和长期归档 | 当前保持condition-based guard;不得伪造数值 | Step 13;`07/09`后续闭合 |
| acceptance packet固定文件是否全部由未来实现仓生成 | 影响Step 10 /13 /14 writer / owner | 当前只固定逻辑入口和no-static边界 | Step 10 /后续`07` |

上述待确认项不阻塞Step 1完成。任何一项在其最晚关闭点仍缺失时,必须按后续Step规则传播为Blocked、不可裁决或不通过,不得自动降级为可接受风险。

---

## 12. 自检与停审条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| Step 1五个SOP问题是否全部回答 | 通过 | §4逐项回答 |
| 验收输入映射是否覆盖正式`00~05` | 通过 | §8.1;每份正式文档均有裁决用途和后续Step |
| 用户重点九类边界是否覆盖 | 通过 | §8.2逐项承接identity、四维边界、policy、capture、observability、failure、cleanup / reaper和redline |
| 必须回答 /不再回答是否分离 | 通过 | §8.3 / §8.4 |
| AHG / EHR / ESLOT / EV成熟度是否分离 | 通过 | §8.5;无planned事实升格 |
| 交付 / run /环境 /数据基线是否列全 | 通过 | §8.6覆盖设计、实现、契约、工具、配置、环境、数据、运行、证据、报告、交接、缺陷和风险 |
| historical material是否隔离 | 通过 | §5 / §8.7;旧正式`06`未修改 |
| 上游blocker是否准确分层 | 通过 | 无阻塞Step 1设计的上游blocker;实际验收blocker已单列 |
| 对上游设计影响是否判定 | 通过 | §8.8=`no_upstream_writeback_required_for_step_1` |
| 是否伪造实现 /run /EV /结果 /签署 | 通过 | 全文只使用designed / planned / Blocked / not created等成熟度 |
| 是否越级进入未来Step或正式正文 | 通过 | 仅创建flow和Step 1;正式`06`未修改 |
| implementation ledger / planned skeleton是否提前创建 | 通过 | 均未创建;保留到正式`07`完成时 |

---

## 13. 进入下一步条件与当前恢复点

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收输入和权威顺序清楚 | 通过 | 正式`00~05`及解释输入已映射 |
| 验收必须回答 /不再回答的问题清楚 | 通过 | §8.3 / §8.4闭合 |
| 证据成熟度与消费边界清楚 | 通过 | AHG / EHR / ESLOT / runtime EV / packet /结论分层 |
| 后续基线待固定项清楚 | 通过 | §8.6闭合 |
| historical material与blocker清楚 | 通过 | 旧`06`contained;实际验收blocker保持开放 |
| Step 1用户审查 | 通过 | 用户已明确确认并放行Step 2 |

```text
current_document = `06-验收标准.md`
current_step = Step 1 `确认验收输入边界`
current_module = `completed_reviewed`
gate_status = passed_to_step_2
gate_reason = 正式00~05、handoff、evidence maturity、待固定基线、historical material、blocker与上游影响已闭合;正式06未修改且无伪造事实
next_allowed_action = 本Step已收口;由`06_acceptance_step_02_scope.md`接续
formal_document_write = prohibited_until_step_15
real_acceptance_execution = not_started
real_evidence_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```
