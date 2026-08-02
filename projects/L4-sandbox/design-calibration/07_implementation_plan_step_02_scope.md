# L4-sandbox 实施计划 Step 2 明确实施目标、范围和非范围

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 2
> 书写规范: `standards/document/实施计划书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 回填章节: `07-实施计划.md` §2 实施目标与范围
> 创建日期: 2026-07-16
> 状态: completed_reviewed_passed_to_step_3
> 本Step口径: 固定本轮实现必须交付的最小可验证Sandbox闭环、明确P0-C / P0-Q与P1 / P2边界。本Step不设计phase或commit boundary,不选择具体隔离后端产品,不创建正式`07`、implementation ledger、planned boundary skeleton或任何实现 /测试 /验收事实。

---

## 1. Step状态与三层开工门禁

| 门禁层 | 检查结果 | 裁决 |
|---|---|---|
| 项目级台账 | 恢复点为`07 / Step 1 / pending_user_review`;用户已明确同意Step 1结论并放行Step 2。 | passed_for_step_2 |
| 文档级flow | `07_implementation_plan_calibration_flow.md`已定义Step 2为输入边界确认后的唯一下一步。 | passed_for_step_2 |
| Step级输入 | Step 1已收口正式`00~06`、historical reference和实现移交blocker;本Step已读取SOP Step 2及正式`00/03/05/06`范围。 | passed_for_scope |
| 正式文档写入 | 本Step只形成§2回填草稿;正式`07`仍由Step 13装配。 | forbidden_in_step_2 |
| 下游Step | 用户已放行Step 3且Step 3当前已完成待审;Step 4~13仍无放行。 | passed_to_step_3 |

当前恢复点:

```text
current_document = `07-实施计划.md`
current_step = Step 2 `明确实施目标、范围和非范围`
current_module = `implementation_scope_reviewed`
gate_status = passed_to_step_3
next_allowed_action = 已由`07_implementation_plan_step_03_prerequisites_reading.md`承接
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
```

---

## 2. 本步目标与输入

本Step必须使后续phase / commit boundary只能在一个固定范围内拆分,不能在实施阶段自然膨胀或缩水。需要收稳:

1. 本轮最小可交付结果是什么,以及为什么不能退化为“能启动命令”的smoke。
2. 哪些需求、详细设计实现单元、协议、配置、测试和验收门禁必须落地。
3. P0-C和P0-Q如何同时进入本轮范围,且彼此不可替代。
4. 哪些P1 / P2、相邻仓truth、产品能力和执行期事实明确不在本轮范围。

| 输入 | 本Step消费内容 |
|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 权威顺序、historical reference、handoff blocker和闭环预判 |
| `00-需求文档.md` | C-SBX-1~5、FR-SBX-001~018、FR-SBX-E01~E06、BR-SBX-001~033、AC-SBX-001~041、VF-SBX-001~010和NFR |
| `01-架构设计.md` | execution isolation truth、依赖 /数据所有权、运行承载和产品中立红线 |
| `03-详细设计.md` | 七crate、六个实现主轴、55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38 typed error、UoW /幂等 /并发 /配置 /观测实现契约 |
| `04-配置设计.md` | PROFILE-01~07、P0-C / P0-Q composition、adapter binding、I001~I101、hard guard和future absence |
| `05-测试方案.md` | 237 P0-C +13 P0-Q +4 conditional、16 suite、7 gate、17 planned脚本和evidence生成契约 |
| `06-验收标准.md` | ASCP-SBX-001~024、P0双轴、17 VETO、entry / exit、evidence和范围升级规则 |

---

## 3. SOP问题回答

| SOP问题 | 本Step回答 |
|---|---|
| 本轮实施的最小可交付结果是什么? | 在`quantalithos-sandbox`形成产品中立、可编译、可测试、可按P0-C / P0-Q裁决的execution isolation truth center:从正式语境受理、coherent boundary和policy fail-closed,到真实candidate内launch / capture,再到failure、lease、cleanup / reaper、redline和安全handoff闭环。只做fake contract或命令smoke不构成最小交付。 |
| 哪些需求编号必须覆盖? | C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、核心NFR、AC-SBX-001~023及026~041、VF-SBX-001~010必须进入P0实现与门禁。FR-SBX-E01~E06和AC-SBX-024 /025只保留absence / no-pollution / DesignReopen约束,默认不实现增强能力。 |
| 哪些详细设计章节必须落地? | 正式`03` §3~§16全部实施契约都必须被后续phase / boundary承接:工程约束、workspace /模块、对象、port、55协议 / flow、30个owner-level state machines /31个canonical enum entries /39个shared declarations、持久化 /事务、38 error、幂等 /并发、配置binding、观测 /审计、测试切口和handoff。不得只选择happy path章节。 |
| 哪些验收项必须在本轮可判定? | ASCP-SBX-001~021全部必须具备可执行判定路径。P0-C 237条和P0-Q 13条均是总体P0硬前提;17个VETO必须有预防和检测路径。ASCP-022仅在PROFILE-06显式激活时升级;ASCP-023~024默认inactive / DesignReopen。 |
| 哪些能力明确不在本轮实施? | tools semantic execution、runtime agent loop / recover、member lifecycle orchestration、Artifact / Observability / Policy truth、生产拓扑、capacity / DR / hard SLO、多宿主 /多集群、advanced operator / replay / preview / analytics及未激活PROFILE-06 /07能力。 |
| 是否存在P1 / P2容易误做进P0? | 是。最易混淆的是把PROFILE-06 durable /联合E2E、PROFILE-07 production、FR-SBX-E01~E06产品增强做成P0;反向误差则是把PROFILE-05真实candidate资格错当P1。PROFILE-05 / P0-Q必须纳入P0,但具体产品和真实结果不能预造。 |

---

## 4. 当前文档与范围问题诊断

| 位置 | 范围风险 | 本Step处理 |
|---|---|---|
| `00`核心闭环与外围增强 | FR-SBX-E01~E06若与核心read / safety support混写,会把P2产品能力带入P0或误删必要支撑面。 | P0保留最小projection / comparison / reconciliation / degraded surface;高级产品体验保持P2。 |
| `03` abstract backend | 只实现non-executing fake会满足部分P0-C但永久阻塞P0-Q。 | P0明确包含一个经正式选择的concrete candidate binding及其launch / inspect / capture / terminate / release能力。 |
| `04` PROFILE-01~07 | profile定义可能被误读为全部都要激活。 | P01~P05进入P0实现;P06 conditional;P07 inactive。P05不能由P01~04替代。 |
| `05` 16 suite / 7 gate / 17脚本 | planned契约可能被缩成少量unit test,或被误写成已执行。 | 本轮实现全部planned automation surface;实际run、EV和结果仍由执行期形成。 |
| `06` ASCP-001~024 | “P0-Q当前Blocked”可能被误读为不实施,或“P1不补P0”被误读为必须实现P1。 | P0-Q实现路径mandatory;P1/P2只保留诚实inactive / selected-run / reopen行为。 |
| 相邻仓未就绪 | 可能把tools / runtime / member业务代码复制进Sandbox以完成E2E。 | P0只实现formal seam、body-free carrier及fake / controlled adapter;不复制相邻仓truth。 |
| 具体产品未选 | 可能在Step 2硬写Docker / gVisor等,或完全回避candidate。 | 固定“必须有一个concrete candidate”而不指定产品;选择与资格前置由Step 3 / 8 / 9及ADR承接。 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 最小交付 | 分散为核心能力、七模块、测试与验收条目 | 固定为五段受控执行纵切 +全横切门禁 + P0-Q真实candidate路径 | 防止退化为执行器smoke |
| P0证明 | 可能只实施P0-C fake / simulation | P0-C与P0-Q均进入本轮,分别验证且不可替代 | 对齐250条P0和RELEASE四source |
| backend范围 | abstract port与产品选择之间不够明确 | abstract contract、fake / controlled adapters和至少一个concrete candidate binding均需承接;产品名后置 | 保持产品中立且可验收 |
| read / derived面 | 可能全部视为外围增强 | 最小query / projection / derived marker / comparison / reconciliation为P0支撑;rich UX / analytics为P2 | 保持55协议闭集和no-write / degraded门禁 |
| automation | planned suite / script可能被留到测试阶段补做 | 全部正式测试 / gate / report / check入口属于本轮代码交付 | 证据producer必须随功能落地 |
| P1 / P2 | 未激活能力可能被实施者顺手实现 | 用显式非范围和DesignReopen触发阻断自然膨胀 | 保持当前送验主语诚实 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只实现contracts + fake backend | 快速形成P0-C多数测试 | 无法证明真实四维隔离、lifecycle和cleanup,P0永远Blocked | 不采用 |
| 在Step 2直接指定某个backend产品 | 便于立即排任务 | 缺ADR / capability核查,会把产品反写domain truth | 不采用 |
| P0要求一个产品中立契约下的concrete candidate binding | 同时保持抽象边界和P0-Q可执行性 | 具体产品必须在受影响boundary前正式选择 | 采用 |
| 把全部derived / comparison能力排除 | 范围更小 | 破坏13 Query、projection维护、degraded和reconciliation契约 | 不采用 |
| P0只实现最小derived read support,高级体验后置 | 保持协议闭集且不实现外围产品 | 需在Step 6逐boundary区分最小面与增强面 | 采用 |
| 只实现功能测试,报告 / evidence脚本后补 | 初期代码少 | 无法形成阶段门禁和验收可判定链 | 不采用 |
| 实现全部planned producer / gate surface但不预造结果 | 可执行、可审计且成熟度诚实 | phase拆分工作量较大 | 采用 |

---

## 7. 结构化中间产物

### 7.1 最小可交付结果定义

`MDR-SBX-P0`必须同时满足:

```text
统一受理与environment identity
  -> 四维coherent boundary裁定与真实candidate落实
  -> 给定policy下launch / high-risk fail-closed
  -> run / capture / material + observability handoff
  -> failure / control / lease / cleanup / reaper / redline收束
  -> query / projection / relay / audit / evidence可验证支撑
```

完成语义:

- `contracts/domain/application/infra/api/worker/jobs`七crate及正式入口可编译并遵守依赖方向。
- C-SBX-1~5和FR-SBX-001~018都有至少一个正式协议 / flow、状态、持久化、错误和测试承接。
- P0-C与P0-Q分别可运行;缺candidate或lab只能诚实`Blocked`,不能把交付范围改写为“不需要P0-Q”。
- formal audit、stored replay、no-write、no-repair、no source rollback、all-carrier redaction和evidence integrity成立。
- tools / runtime / member-service等未就绪时可用controlled seam验证,但不能宣称联合E2E或复制其truth。

### 7.2 实施目标表

| 目标ID | 实施目标 | 正式来源 | 完成判定 |
|---|---|---|---|
| IMPL-SBX-01 | 建立统一受理、environment identity与责任链 | C-SBX-1;FR-001~003;ASCP-001 | context / identity / refs在launch前闭合;missing / conflict拒绝;无旁路formal success |
| IMPL-SBX-02 | 建立四维coherent boundary和产品中立backend边界 | C-SBX-2;FR-004~006;ASCP-002 /003 | P0-C裁定与P0-Q固定candidate真实落实分别可测;任一unsupported整体拒绝 |
| IMPL-SBX-03 | 建立policy消费、launch enforcement与fail-closed | C-SBX-3;FR-007~010;ASCP-004 | 只消费body-free summary;missing / stale / conflict / unauthorized时0 launch |
| IMPL-SBX-04 | 建立run、capture、候选材料与observability handoff | C-SBX-4;FR-011~014;ASCP-005 | capture状态诚实;receipt不升格;handoff / publish失败不回滚source truth |
| IMPL-SBX-05 | 建立failure / control、lease、cleanup / reaper和redline收束 | C-SBX-5;FR-015~018;ASCP-006~008 | typed failure;guard先于破坏动作;orphan不脱管;containment不由普通receipt解除 |
| IMPL-SBX-06 | 建立完整协议、一致性与可维护读写支撑 | `03`§5~§13;ASCP-009~014 | 55协议、30 owner machines /31 canonical enum entries /39 shared declarations、38 error、UoW、stored replay、19 race、query no-write和job no-repair可测 |
| IMPL-SBX-07 | 建立配置、安全材料、依赖与unsupported absence | `04`;ASCP-015~019 | P01~P05、I001~I101、same-generation、redaction、仅core-contracts compile和future surface reject成立 |
| IMPL-SBX-08 | 建立测试、报告、evidence和验收可判定路径 | `05`;ASCP-020~021;VETO-001~017 | 254 TC contract、16 suite、7 gate、17脚本及21 ESLOT producer路径可执行;不静态制造结果 |

### 7.3 核心实施范围表

| 范围纵切 | 必须落地的实现面 | 需求 /验收覆盖 | 本轮地位 |
|---|---|---|---|
| Intake / identity | context、environment identity、resolution、统一command entry、reference intake、status / audit read | FR-001~003;AC-001 /006~008 /026;ASCP-001 | P0-C mandatory |
| Boundary / capability | requirement、resource / filesystem / network / process carrier、coherence guard、capability summary、handle / lease | FR-004~006;AC-002 /009~011 /027;ASCP-002 | P0-C mandatory |
| Candidate conformance | concrete `IsolationBackendPort` binding、immutable candidate identity、launch / inspect / capture / terminate / release、13 CONF harness | ASCP-003;AC-027 /038;PROFILE-05 | P0-Q mandatory |
| Policy / launch | applicability snapshot、execution / high-risk decision、freshness / conflict、fail-closed、start run | FR-007~010;AC-003 /012~015 /028;ASCP-004 | P0-C +适用P0-Q |
| Run / capture / handoff | run lifecycle、capture complete / partial / failed、body-free material refs、artifact / obs handoff、relay | FR-011~014;AC-004 /016~019 /029;ASCP-005 | P0-C + P0-Q capture |
| Failure / control | 38 typed error、classification、timeout / kill / cancel / resource / backend / capture outcomes、stored control | FR-015 /017;AC-020 /022 /037~041;ASCP-006 | P0-C + P0-Q failure |
| Lease / cleanup / reaper | lease expiry、orphan inspect、cleanup guard、release outcome、reaper selection / per-item UoW | FR-018;AC-005 /023 /030 /038~041;ASCP-007 | P0-C + P0-Q lifecycle |
| Redline / investigation | detection、containment、safe investigation handoff、blocked cleanup、explicit release guard | FR-016 /017;AC-005 /021 /030 /038~041;ASCP-008 | P0-C +适用P0-Q |
| Reference / projection / derived support | body-free reference state、13 Query view / page / marker、minimal comparison / derived state、rebuild / reconciliation、no-write / no-auto-fix | `03`§6~§9;ASCP-010 /014 /018 /021 | P0-C support |
| Relay / audit / evidence | committed payload、source cursor、formal audit same-UoW、safe hook、raw / report writer和validation checks | AC-031~035 /039 /041;ASCP-012 /020 | P0-C +适用P0-Q |

### 7.4 实现单元与协议范围

| 类别 | 本轮完整范围 | 数量 /边界 |
|---|---|---|
| Workspace | `contracts/domain/application/infra/api/worker/jobs` | 7 crate;只有`core-contracts`可作sibling compile dependency |
| Command | 正式`03`全部Command request / result / service flow | 10 /10 |
| Query | 正式view / page / marker、visibility / missing / degraded、zero write | 13 /13 |
| Inbound Consumer | envelope、trusted source、schema、dedup、receipt、quarantine / delayed | 9 /9 |
| Outbound Event | committed payload snapshot、source cursor、relay retry / dead-letter、no rollback | 13 /13 |
| Operations Job | selection、per-item UoW、partial report、stored replay、no core repair | 10 /10 |
| State / error | owner exact enum、合法 /非法迁移、typed mapping和public redaction | 30 owner machines;31 canonical enum entries;39 shared declarations;38 typed error |
| Consistency | version / expected version、canonical digest、stored result / receipt / report、transaction、race | 14事务 /重放;19 deterministic race |
| Config | strict source、complete generation、profile composition、adapter registry、sensitive material | PROFILE-01~05为P0;I001~I101;40组 /44域 |
| Entry / runtime shells | sync API、inbound / relay / fulfillment worker、operations job runner、runtime builder | 只装配application;不得直写truth或直访backend |

### 7.5 测试与验收可判定范围

| 范围 | 本轮必须实现 | 不表示 |
|---|---|---|
| P0-C | 237条主用例、MAIN-CONTRACT / MAIN-SEAM / OPS producer及required checks | 当前已Passed |
| P0-Q | 13条CONF、固定candidate identity、redaction、capture、lifecycle、cleanup / redline与GATE-SBX-P0Q | candidate已选、lab已存在或资格已通过 |
| Scope guard | SUITE-016和future surface absence / DesignReopen检测 | P2能力已实现 |
| Conditional | SUITE-015 / GATE-SBX-P1诚实返回selected / NotRunConditional路径 | PROFILE-06已激活或qualified |
| Automation | 16 suite、7 gate、17 planned脚本、28数据集builder和九schema writer / validator | 任何脚本已经执行 |
| Evidence | 21 ESLOT到raw / report / index / pairing / review draft的producer路径 | runtime `EV-SBX-*` alias或验收结论存在 |
| Acceptance | ASCP-001~021、17 VETO、defect / risk / final handoff输入可由固定报告消费 | 风险已接受、结论已形成或已签署 |

### 7.6 明确非范围表

| 非范围项 | 正式归属 /地位 | 本轮只保留 | 触发处理 |
|---|---|---|---|
| ToolDefinition / ToolPolicy / semantic invocation / ToolInvocationResult | `L2-tools` | typed request refs、launch requirements和Sandbox outcome seam | 要求Sandbox解释工具语义则DesignReopen |
| ExecutionInstance、agent loop、checkpoint / recover、result backflow | `L2-runtime` | runtime context ref、run / failure / control / capture feedback | 要求Sandbox推进runtime状态则DesignReopen |
| MemberExecutionHost、SandboxBinding、session / worker / health / recycle | `L2-member-service` | host / caller safe ref与Sandbox outcome | 要求Sandbox编排member lifecycle则DesignReopen |
| Identity / Work / Runner正文与生命周期 | 对应L1 / L5仓 | body-free refs、resolution / freshness和fail-closed | 外部正文入仓或第二writer立即阻断 |
| Artifact / formal evidence / archive truth | `L1-artifact` / archive | candidate material ref、digest、handoff fact / receipt | receipt或candidate升格truth触发VETO |
| Observability store / query / retention / alert truth | `L4-observability` | safe hook、material ref、handoff / backpressure状态 | telemetry替代formal audit触发VETO |
| Policy DSL、allowlist、approval / waiver / capability truth | governance / policy owner | body-free snapshot / decision summary与freshness | Sandbox生成policy truth触发VETO |
| PROFILE-06 durable / real-like联合E2E | P1 conditional | adapter / selected-run兼容面和`NotRunConditional` | 正式激活时升级mandatory并固定composition |
| PROFILE-07 production、capacity、DR、hard SLO、fleet soak | P2 inactive | absence / DesignReopen guard | 任一production claim先回写`00~07` |
| 多后端风险选择、多宿主 /多集群调度 | FR-E01 / E04 / E05,P2 | 单candidate contract与minimal capability comparison | 声明交付先DesignReopen |
| advanced replay / inspect / operator console | FR-E02,P2 | stored replay、audit query、control / safety基础面 | 不得在P0添加operator truth或UI flow |
| rich preview / analysis / long-term trend product | FR-E03 / E06,P2 | minimal body-free derived marker / comparison / reconciliation | 不得阻塞capture或成为第二truth |
| 具体DB / bus / OTel / secret / scheduler产品和production topology | ADR /实施准备 /运维 | port、adapter registry、fake / controlled binding;candidate backend例外需正式选择 | 受影响boundary前转前置或blocker |
| 真实commit、run、config digest、EV、测试结果、验收结论 /签署 | implementation / execution fact | 字段、路径、生成与消费门禁 | 只能由真实执行写入 |

### 7.7 P1 / P2防误入与P0反向漏项表

| 容易误判的能力 | 正确地位 | 防误入 /防漏规则 |
|---|---|---|
| PROFILE-05 candidate backend | P0-Q mandatory | 不能后移为P1;必须实现concrete binding和资格harness,但产品 /结果不得预造 |
| PROFILE-06 durable store / real bus /联合E2E | P1 conditional | P0只保证port、fake / controlled seam和selected-run入口;未激活不执行 |
| PROFILE-07 / production ready | P2 inactive | 只实现absence guard;任何active claim触发全链DesignReopen |
| Backend capability comparison query | P0-C minimal read support | 只比较body-free正式summary并可degraded;不实现多后端选型引擎或policy simulation |
| Derived inspect / preview / trend state | P0-C minimal protocol support | 保持55协议、no-write和rebuild契约;不实现rich preview / analytics产品 |
| Replay | P0包含idempotent stored replay | 不等于advanced business replay / operator workflow;duplicate不得重跑owner mutation |
| Rollback / drift | P0包含immutable request / history / honesty contract | physical rollout / rollback / fleet drift是P1,不能把配置状态写成物理成功 |
| Observability | P0包含safe hook和formal audit | 不实现telemetry store / dashboard / alert truth,metric不能替代audit |
| Artifact handoff | P0包含candidate capture和handoff fact | 不实现Artifact formalization、baseline或evidence truth |

### 7.8 双向覆盖审计

| 审计轴 | 覆盖结论 | 防漏检查 |
|---|---|---|
| C-SBX-1~5 -> IMPL目标 | 5 /5映射到IMPL-SBX-01~05 | 无核心节点仅由外围能力支撑 |
| FR-SBX-001~018 ->纵切 | 18 /18由Intake、Boundary、Policy、Capture、Safety五组覆盖 | 无FR仅留在文档不进入代码 /测试 |
| FR-SBX-E01~E06 | 6 /6进入明确非范围与reopen guard | 未误升级为P0,必要minimal support有独立边界 |
| ASCP-SBX-001~021 | 21 /21进入实施 /测试 /验收可判定范围 | P0-Q适用项未标N/A或被P0-C替代 |
| ASCP-SBX-022~024 | P1 / P2地位明确 | 未激活不补P0;claim触发mandatory或DesignReopen |
| Protocol闭集 | 10 +13 +9 +13 +10 =55 | 无协议族被“以后补” |
| State / error / consistency | 30 owner machines /31 canonical enum entries /39 shared declarations、38 error、14事务 /重放、19 race | 无只实现happy path的缩减 |
| Test / evidence | 254 TC contract、16 suite、7 gate、17脚本、21 ESLOT | planned不冒充implemented / executed |
| VF / VETO | VF-SBX-001~010和VETO-SBX-001~017均进入scope / gate | 无安全红线进入风险接受或P1延期 |

---

## 8. 复杂度与分批判断

本Step只固定范围闭集,不拆phase或boundary。五个核心能力、横切支撑、P0-Q和P1 / P2防误入可在一个Step文件内审查。后续Step 4必须把本范围转成具体交付物,Step 5按可验证纵切设计phase,Step 6再逐boundary做可落码与经验复核;不得直接按本表一行一commit。

---

## 9. 正式章节回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“最小可交付结果定义”“实施目标表”“核心实施范围表”“明确非范围表”“P1 / P2防误入与P0反向漏项表”和“双向覆盖审计”,了解本轮为何同时包含P0-C与P0-Q,又不把外围产品能力带入P0。

正式`07-实施计划.md` §2应收口为:

本轮实施目标是在`quantalithos-sandbox`建立可编译、可测试、可由P0-C与P0-Q分别裁决的execution isolation truth center。范围覆盖C-SBX-1~5和FR-SBX-001~018:统一受理与environment identity、resource / filesystem / network / process coherent boundary、给定policy下的launch enforcement、run / capture / handoff、failure / control、lease / cleanup / reaper和redline containment,以及支持这些能力的55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38 typed error、事务 /幂等 /并发、配置、观测、审计和evidence producer。

P0实现同时覆盖PROFILE-01~04的contract / seam / simulation路径与PROFILE-05固定candidate的真实backend conformance路径。一个正式选择的concrete candidate binding和13条P0-Q资格用例属于总体P0硬前提,不能由fake、controlled seam或PROFILE-06替代;本章不预先指定产品、环境实例或资格结果。

PROFILE-06 durable / real-like /联合E2E默认P1 conditional,PROFILE-07 production / capacity / DR和FR-SBX-E01~E06外围增强默认P2 / inactive。最小projection、body-free comparison、derived marker和reconciliation是P0协议支撑面,但advanced replay / operator、rich preview / analytics、多后端选择、多宿主调度和生产运营能力不在本轮范围。tools semantic execution、runtime agent loop、member lifecycle、Artifact / Observability / Policy truth始终属于相邻仓。

本轮还必须实现正式`05/06`要求的测试、gate、report、check和acceptance draft生成路径,使ASCP-SBX-001~021及17个VETO可判定。任何implementation commit、`run_id`、runtime EV、测试结果、风险接受、验收结论或签署只能由未来真实执行产生。

---

## 10. 待确认事项与blocker

| 待确认事项 | 影响 | 当前处理 | 最迟关闭位置 |
|---|---|---|---|
| concrete candidate backend及其capability / lifecycle / capture / release契约选择 | P0-Q实现与资格 | 保持产品中立但列为P0 mandatory | Step 3前置登记;Step 8依赖准备;受影响phase开工前 |
| dedicated P0-Q environment / provider / material identity | 13 CONF执行 | 当前不伪造,只实现manifest / validation contract | Step 8;P0-Q boundary执行前 |
| P0最小derived support与P2 rich enhancement的文件 / task切口 | 防止外围增强混入 | 本Step固定语义边界 | Step 4 / Step 6 |
| 17 planned脚本与功能代码的阶段归属 | 防止证据工具最后补做 | 全部属于本轮交付 | Step 4 / Step 5 / Step 7 |
| 目标仓创建和design baseline | 所有实施开工 | 沿用Step 1 handoff blocker | Step 3;首phase前 |

当前没有阻塞Step 3讨论的上游设计blocker。candidate产品、目标实现仓和design baseline仍阻塞受影响实现boundary,但不能据此把P0-Q移出范围。真实环境、run、evidence和验收结论继续属于执行期事实。

---

## 11. 自检与停审

| 自检项 | 结果 |
|---|---|
| 是否定义最小可交付结果而非对象 /文件清单 | 通过 |
| 是否覆盖C-SBX-1~5和FR-SBX-001~018 | 通过,5 /5与18 /18 |
| 是否保持P0-C / P0-Q双轴且不可替代 | 通过 |
| 是否把PROFILE-05误归P1 | 否;明确为P0-Q mandatory |
| 是否防止PROFILE-06 /07和FR-E01~E06误入P0 | 通过 |
| 是否保持55协议、30 owner machines /31 canonical enum entries /39 shared declarations、38 error和自动化闭集 | 通过 |
| 是否保持tools / runtime / member / artifact / obs / policy非职责 | 通过 |
| 是否选择或伪造具体backend产品 /结果 | 否 |
| 是否提前设计phase / commit boundary | 否 |
| 是否在用户确认前提前创建正式`07`、Step 3、ledger或skeleton | 否;Step 3仅在确认后创建,其余仍不存在 |

本Step已完成停审并经用户确认。后续只允许由`07_implementation_plan_step_03_prerequisites_reading.md`承接;仍不得写正式`07`,不得创建implementation ledger或planned boundary skeleton。

---

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 最小可交付结果明确 | passed | 五段纵切 +横切支撑 + P0-Q candidate路径 |
| 本轮实施范围可追溯 | passed | 需求、详细设计、测试和验收四层双向覆盖 |
| 非范围明确 | passed | 相邻仓truth、P1 / P2、产品 /运维和执行事实均显式排除 |
| P1 / P2防误入明确 | passed | P05 mandatory,P06 conditional,P07 /增强inactive |
| 未提前拆phase / boundary | passed | 留给Step 5 / 6 |
| 用户确认Step 2 | passed | 用户已明确同意,Step 3获放行 |

```text
step_2_result = completed_reviewed_passed_to_step_3
implementation_scope = MDR-SBX-P0
p0_contract_axis = mandatory
p0_qualification_axis = mandatory
p1_scope = conditional_not_activated
p2_scope = inactive_design_reopen_if_claimed
allow_step_3_discussion = yes
allow_implementation_handoff = no
commit_required = no
```
