# Step 2. 明确测试目标、范围和非范围

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 2
> 书写规范: `standards/document/测试方案书写规范.md` §5.2
> 回填章节: `05-测试方案.md` §2 本次测试目标与范围
> 生成日期: 2026-07-12
> 状态: reviewed_passed_to_step_3
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 只定义本轮测试要证明什么、覆盖什么、不覆盖什么,并固定P0 / P1 / P2、接缝、残余风险和veto范围。`SCP-SBX-*`仅是范围项ID,不是测试切口、TC、suite、evidence或执行结果。本步不修改旧正式`05`,不创建真实测试或实施事实。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 1并允许进入Step 2 | 是。用户在Step 1停审后连续回复“继续”,本次只放行Step 2。 |
| 项目级台账是否允许进入Step 2 | 是。原恢复点为Step 1 `pass_wait_review`;用户明确确认后解除门禁。 |
| 文档级flow是否允许进入Step 2 | 是。Step 1输入边界已完成,正式`00~04`权威顺序和historical隔离无未决冲突。 |
| 是否读取Step 2标准 | 是。已读取测试方案SOP Step 2和书写规范§5.2,范围必须绑定需求 /设计 /风险,非范围必须说明原因与风险归属。 |
| 是否读取直接输入 | 是。已读取Step 1、正式`00~04`、`03_ddd_step_16_test_cuts.md`和`04` TSH / FDT / AHG / EHR承接。 |
| 是否参考L1粒度 | 是。已读取L1-governance / L1-artifact Step 2,只参考结构与深度,不继承领域结论。 |
| 当前状态 | 测试目标、优先级、范围 /非范围、接缝、profile成熟度和veto关联已收稳;用户已确认并传递至Step 3。 |
| 停审方式 | Step 2停审已由用户确认解除;当前审查门禁位于Step 3。 |
| 是否发现阻塞本Step的上游blocker | 否。正式契约足以定义范围。真实backend / provider / dedicated environment缺失会阻塞P0真实隔离资格执行与最终核心通过,但不阻塞当前范围设计。 |

---

## 2. 本步目标与非范围

本Step必须回答:

1. 哪些证明共同构成`L4-sandbox`核心受控执行隔离闭环通过。
2. 哪些范围必须作为P0,哪些只能作为P1接缝或P2演进。
3. 为什么真实隔离backend资格不能被fake / simulation替代,也不能因配置层标记P1而变成可选测试。
4. 哪些相邻仓和外部能力只测ref / snapshot / safe summary / event / handoff / adapter接缝。
5. 哪些非范围仍有残余风险,由哪个后续文档、profile或owner关闭。
6. VF-SBX-001~010与VETO-CFG-01~16如何进入测试范围,且不可用风险接受绕过。
7. TSH / FDT / AHG / EHR在当前范围中是什么成熟度,避免把planned handoff伪造成case或evidence。

本Step不定义:

- 逐对象 /逐协议测试切口;留给Step 3。
- unit / contract / service / integration / E2E分层;留给Step 4。
- 需求到用例候选 / evidence requirement覆盖矩阵;留给Step 5。
- TC编号、步骤、输入、断言和预期副作用;留给Step 6。
- fixture、builder、seed、真实secret替代和清理数据;留给Step 7。
- 环境拓扑、产品、profile实例、backend安装或真实资格;留给Step 8。
- suite、脚本、CI job、命令、gate、artifact / report路径;留给Step 9。
- 性能阈值、压力模型、安全扫描实现和恢复演练细节;留给Step 10。
- 缺陷、复验、进出准则、证据归档、回归和最终验收裁决;留给Step 11~14和新版`06`。
- 正式`05-测试方案.md`;只允许Step 15装配。
- 真实run_id、TC / EV执行记录、pass / fail、资格签署、risk acceptance、release或migration事实。

---

## 3. 本步输入

| 输入 | 状态 | 本Step用途 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | reviewed_passed_to_step_2 | 固定权威顺序、historical隔离、测试方案职责和后置blocker |
| `00-需求文档.md` §4 / §7~§10 / §13~§15 | current reviewed baseline | 固定C-SBX-1~5、FR-SBX-001~018 / E01~E06、BR-SBX-001~033、AC-SBX-001~041、VF-SBX-001~010、NFR和非目标 |
| `01-架构设计.md` §3~§15 | current architecture baseline | 固定truth ownership、coherent boundary、no weak fallback、capture / handoff、cleanup / redline、依赖裁剪与产品中立 |
| `02-概要设计.md` §5~§11 | current formal baseline | 固定六个组成部分、关键对象、接口骨架、flow family、六组状态和异常边界 |
| `03-详细设计.md` §2 / §5~§15 / §17 | current direct baseline | 固定七模块、对象 / port、10 Command、13 Query、9 Consumer、13 Event、10 Job、状态、事务、错误、幂等、配置、观测和最小切口 |
| `03_ddd_step_16_test_cuts.md` | current explanatory input | 固定模块 /协议 /状态 /一致性 /错误 /配置 /观测最小测试入口;不直接创建TC |
| `04-配置设计.md` §2 / §6 / §8~§14 | current direct baseline | 固定P0 / P1 / P2配置成熟度、PROFILE-01~07、101项 /40组 /44域、sensitive、加载 /变更 /失效和veto |
| `04_config_step_12_downstream_handoff.md` | current explanatory input | 固定TSH-01~20、FDT-01~30、AHG-01~19、EHR-01~20及planned成熟度 |
| 旧`README/05/06` | historical material only | 后置识别旧对象、TC、host runtime、Docker / gVisor、cleanup disabled、旧环境 /阈值污染 |
| L1-governance / L1-artifact Step 2 | granularity reference | 参考目标表、范围表、接缝、非范围、veto和影响判定结构 |

---

## 4. Step内执行记录

| 序号 | 动作 | 状态 | 产物 /门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、`05` flow和Step 1 | done | 用户确认只放行Step 2 |
| 2 | 校准`04`完成状态中的陈旧恢复点文字 | done | 仅状态文字;未改设计契约 |
| 3 | 读取SOP Step 2与书写规范§5.2 | done | 固定目标 /范围 /非范围与风险归属要求 |
| 4 | 读取正式需求 /设计 /配置范围和L1参考 | done | 形成P0 / P1 / P2候选及接缝边界 |
| 5 | 识别真实隔离证明与fake证明不可替代关系 | done | P0拆为P0-C contract gate与P0-Q qualification gate |
| 6 | 回答SOP问题并形成结构化范围产物 | done | 未提前抽取测试切口或创建TC / EV |
| 7 | 完成上游影响、回填草稿和进入条件 | done | 无当前上游回写;真实资格blocker保持开放 |
| 8 | 更新Step 1、flow和项目台账 | done | 三方曾同步到Step 2审查点;用户确认后已传递至Step 3 |

---

## 5. SOP问题回答

| SOP问题 | 本Step回答 |
|---|---|
| P0必须通过哪些测试才能证明主链成立 | 必须同时证明C-SBX-1~5:正式语境 / identity与统一入口;真实隔离四维边界可落实且无host / weak fallback;给定policy fail-closed;run / capture / handoff分层;failure / control / lease / cleanup / reaper / redline保守收束。还必须覆盖所有当前协议族、状态 /事务 /幂等、query no-write、consumer / relay no-rollback、job no-repair、配置hard guard、formal audit和redaction。 |
| P1 / P2是否只做边界验证或延后 | P1验证PROFILE-06 durable / real-like组合、真实provider /平台和物理rollout接缝,不得替代P0。P2保留PROFILE-07、生产容量 /硬SLO、多后端 /多宿主增强和FR-SBX-E01~E06完整能力。当前unsupported的remote / admin / reload / LKG / hot不是可直接测试的P2能力,其“无current surface且声明被拒绝”反而是P0负向范围。 |
| 哪些下游能力只测接缝 | tools、runtime、member-service、identity、work、policy / governance / capability、artifact、observability、runner / console、archive / investigation以及backend / provider产品只测sandbox消费或产出的body-free ref / snapshot / safe summary / event / handoff / adapter结果;不测试其内部状态机、正文、UI、agent loop或生命周期。 |
| 哪些非范围有残余风险 | 未选candidate backend和专用环境导致P0-Q当前不可执行;未选provider和平台anti-leak导致真实material资格不可执行;未选durable store / bus / target / scheduler导致P1不可执行;未形成生产负载模型导致P2容量结论不存在;完整跨仓E2E差异留给P1 /后续集成。 |
| 哪些范围项是一票否决相关 | VF-SBX-001~010全部进入P0。VETO-CFG-01~16也全部至少进入P0负向范围:包括real workload no-fake、四维boundary整体拒绝、policy fail-closed、raw leak、atomic generation、audit不可替代、no-rollback、cleanup / redline guard、no-write / no-repair、stored replay、truth分层、unsupported surface和领域裁剪。 |

关键结论:

- `L4-sandbox`与一般truth仓不同,真实隔离有效性是核心产品命题。fake / in-memory / simulation只能证明契约和失败语义,不能证明resource / filesystem / network / process限制真实成立。
- 因此测试P0包含两个不可互相替代的子门禁:`P0-C`证明contract / invariant / deterministic parity,`P0-Q`证明candidate real backend的bounded conformance。二者仍都属于P0,不是新增优先级。
- `04`把PROFILE-05标为配置P1,表达的是配置成熟度 /引入阶段;本Step把其四维conformance标为测试`P0-Q`,表达的是核心验收风险。两个轴含义不同,不构成上游冲突。
- P0-C可以先设计和实现;P0-Q前置未闭合时只能标记blocked / not run,不得把P0-C通过写成“sandbox核心通过”或“真实隔离合格”。

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本Step处理 |
|---|---|---|
| 旧`05`测试目标 | 围绕旧对象、五条旧主线和TC-001~012,无法证明新版C-SBX-1~5 | 不继承;按正式`00~04`重建五节点目标 |
| 旧`05`隔离范围 | host runtime、Docker / gVisor和旧环境被写成既成测试条件 | 降级historical;产品保持开放,但真实四维conformance不得降为可选 |
| 旧`05`cleanup口径 | 存在cleanup disabled等旧路径,会绕过guard / evidence / redline | P0必须验证guard-first、missing blocked和no force-clean |
| `03` §15 | 给出最小切口但未固定测试优先级和真实资格含义 | 本Step收束为P0-C / P0-Q / P1 / P2范围 |
| `04` profile优先级 | PROFILE-01~04是P0 designed test,PROFILE-05 / 06是P1 unqualified | 明确配置成熟度不等于测试风险;P05四维资格是核心通过的P0-Q |
| `04` TSH / FDT / AHG / EHR | planned handoff可能被误写为case、gate结果或evidence | 只做范围映射;后续Step 3~13逐层展开,当前不分配TC / EV |
| 旧性能数字 | Docker / gVisor时延和旧可用率可能回流为硬门禁 | 保持候选;Step 10基于正式负载模型决定,当前不写阈值 |
| 目标实现与执行事实 | 实现仓、suite、产品、环境、run和evidence尚未形成 | 不阻塞范围设计;明确阻塞P0-Q / P1执行和任何通过声明 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 核心目标 | 旧对象和少量happy path | C-SBX-1~5、18核心FR、33 BR、41 AC、10 VF与当前设计闭环 | 对齐正式需求 |
| P0口径 | 容易把P0 fake profile当作完整隔离证明 | P0-C与P0-Q双门禁;真实四维conformance不可被fake替代 | sandbox核心价值是实际运行隔离 |
| P1 / P2 | 旧dev / test / staging与产品名混杂 | P1为durable / real-like / provider / rollout接缝,P2为生产与外围增强 | 保持产品中立和成熟度诚实 |
| 协议范围 | 旧TC未覆盖当前协议 /状态 /job | 10 Command、13 Query、9 Consumer、13 Event、10 Job全部进入P0最小范围 | 防止只测Command happy path |
| 配置范围 | 旧环境flag与cleanup disabled | I001~I101、40组、44域、TSH / FDT和VETO-CFG进入当前范围 | 对齐正式`04` |
| 下游边界 | 容易测试相邻仓内部语义 | 只测ref / snapshot / safe summary / event / handoff / adapter接缝 | 保护truth ownership |
| 结果成熟度 | 旧checkbox / evidence方向可能被误当已执行 | 当前只有designed scope;无case、run、evidence或通过结论 | 防止伪造 |

---

## 8. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| P0是否只覆盖deterministic fake | A. fake通过即核心通过;B. contract与real conformance双门禁 | 采用B。fake无法证明宿主隔离、四维限制或no weak fallback真实成立。 |
| PROFILE-05是否因配置层是P1而只做可选测试 | A. 可选P1;B. 四维资格作为P0-Q | 采用B。VF-SBX-002/003使其成为真实核心通过的硬前置。 |
| 是否当前锁定backend产品 | A. 锁定旧Docker / gVisor;B. 保持candidate-neutral conformance contract | 采用B。测试目标固定能力与否决条件,产品由ADR / `07/09`绑定。 |
| 是否要求所有相邻仓完整E2E作为P0 | A. 要求;B. P0测sandbox接缝,P1验证real-like组合 | 采用B。相邻仓内部truth不是sandbox测试对象。 |
| 是否把配置change / rollback / drift全部后移P1 | A. 全部后移;B. contract / simulation P0,物理carrier / rollout drill P1 | 采用B。history immutability和truth honesty是P0,真实fleet事实依赖后置产品。 |
| 是否把unsupported能力列为P2功能测试 | A. 列入P2;B. 当前只测不存在 /拒绝,功能进入前重开设计 | 采用B。不能为不存在的public surface发明case。 |
| 是否继承旧阈值 | A. 继承;B. 只保留正式零容忍,其他数字后置 | 采用B。无负载模型和真实产品时不能伪造硬SLO。 |

---

## 9. 结构化中间产物

### 9.1 P0 / P1 / P2优先级口径

| 优先级 | 定义 | 必须输出 /状态语义 | 不可替代关系 |
|---|---|---|---|
| P0-C | 证明正式协议、对象、状态、事务、幂等、配置、失败和安全不变量在deterministic contract / fake / simulation面可执行、可断言 | 后续必须形成可执行切口、负向断言、自动化候选和planned evidence requirement | 不能证明真实backend隔离资格 |
| P0-Q | 证明candidate real backend在dedicated environment内可落实resource / filesystem / network / process coherent boundary、lifecycle / capture / release和no-host-fallback | 前置未闭合时状态只能blocked / not run;闭合后按backend + capability + profile独立资格 | 不能由P0-C、seam smoke、设计表或单次run替代 |
| P0整体 | P0-C与所有适用P0-Q均通过,并且VF-SBX / VETO-CFG无命中 | 才可交给`06`裁决核心测试证据是否充分 | P1 / P2通过不能补偿P0失败 |
| P1 | 证明PROFILE-06 durable / real-like组合、真实provider /平台、跨仓接缝和物理change / rollout不改变P0语义 | integration / staging-like接缝、parity、outage、rollout / rollback / drift evidence requirement | 不得把real-like组合写成production资格 |
| P2 | 证明未来production-like、容量 /硬SLO、多后端 /多宿主和外围增强不削弱核心边界 | future trigger、残余风险和设计重开条件 | 当前inactive / unsupported能力不得伪装为已测试 |

规则:

- 表中P0-C / P0-Q是P0内部审查标签,正式优先级仍为P0。
- P0-Q按candidate backend、capability profile、四维boundary template和dedicated environment绑定,不得跨backend或跨profile继承。
- 需要真实material的P0-Q还必须满足provider / principal / lease / anti-leak资格;不需要真实material的conformance workload不得因此被无关provider阻塞。
- PROFILE-06必须先消费相同backend的P0-Q资格,再单独证明durable / bus / handoff / scheduler / sink组合;资格不自动传递。
- PROFILE-07当前inactive。任何active / ready / production测试要求先回正式`00~04`,不是直接在本测试方案增加P2 case。

### 9.2 测试目标表

| 目标ID | 测试目标 | 正式来源 | P0完成判定 |
|---|---|---|---|
| TG-SBX-01 | 证明受控执行语境、execution environment identity和跨调用方唯一入口成立 | C-SBX-1;FR-SBX-001~003;BR-SBX-001~005;AC-SBX-001/006~008/026 | 必需ref / snapshot闭合;missing / conflict显式拒绝;无匿名、旁路或调用方补造语义 |
| TG-SBX-02 | 证明真实隔离环境和coherent boundary成立 | C-SBX-2;FR-SBX-004~006;BR-SBX-006~010;AC-SBX-002/009~011/027;VF-002/003 | P0-C证明裁定契约,P0-Q证明四维限制真实落实;任一unsupported整体拒绝 |
| TG-SBX-03 | 证明给定policy内执行和fail-closed成立 | C-SBX-3;FR-SBX-007~010;BR-SBX-011~017;AC-SBX-003/012~015/028;VF-004 | missing / stale / conflicted / unsupported / unauthorized均不放行,且sandbox不拥有policy truth |
| TG-SBX-04 | 证明run、capture与handoff分层成立 | C-SBX-4;FR-SBX-011~014;BR-SBX-018~024;AC-SBX-004/016~019/029;VF-006 | capture truth保留;candidate / receipt不升格;下游失败不伪成功或回滚source |
| TG-SBX-05 | 证明failure / control / lease / cleanup / reaper / redline闭环成立 | C-SBX-5;FR-SBX-015~018;BR-SBX-025~033;AC-SBX-005/020~023/030;VF-007/008 | 分类稳定、guard先于删除、orphan保守收束、redline contained且无advisory / force-clean |
| TG-SBX-06 | 证明全协议、状态、事务、并发和stored replay可验证 | `03` §7~§12 / §15 | 五类协议均有正负最小入口;非法转换、rollback visibility、duplicate replay和race guard可断言 |
| TG-SBX-07 | 证明read / consumer / relay / job / recovery不会形成第二truth writer | `03` §8~§12;VF-SBX-009;VETO-CFG-08/11/12 | query零写、consumer / relay no-rollback、job no-repair、stored result不重算 |
| TG-SBX-08 | 证明配置从source到generation的安全闭环成立 | `04` §3~§11;TSH-01~18;FDT-01~30 | strict source / schema / cross-field / sensitive / complete generation / recovery负向范围全部有后续可执行去向 |
| TG-SBX-09 | 证明formal audit、safe observability与全carrier redaction成立 | AC-SBX-039/041;`03` §14;`04` SEC / ALC;VETO-CFG-05/07 | accepted mutation与audit同UoW;telemetry不替代audit;raw body / secret /高基数ref零泄露 |
| TG-SBX-10 | 证明依赖裁剪、产品中立和领域非职责成立 | AC-SBX-031~035;`01`依赖边界;TSH-20;VETO-CFG-04/13/16 | 仅`core-contracts`可编译期依赖;tools / runtime / member / downstream truth不进入sandbox |
| TG-SBX-11 | 证明所有验收否决命题有测试范围和未来证据生产去向 | VF-SBX-001~010;AHG-01~19;EHR-01~20 | 每项映射到P0范围;planned handoff不被误写为已通过或真实evidence |

### 9.3 范围 / 非范围主表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 /说明 |
|---|---|---|---|---|
| SCP-SBX-001 controlled execution intake / identity | core contract | P0-C | 验证`ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、resolution、actor / responsibility / refs、统一入口和拒绝条件 | 不验证identity、work、runtime或member正文与生命周期 |
| SCP-SBX-002 boundary requirement / decision / coherent set | domain invariant | P0-C | 验证resource / filesystem / network / process requirement同代裁定、backend capability unknown / unsupported和整体reject | fake只证明裁定与错误语义,不证明限制真实生效 |
| SCP-SBX-003 candidate backend four-dimension conformance | isolation qualification | P0-Q | 在dedicated environment验证四维限制真实落实、越界被阻断、unsupported无partial allow、无host / fake / weak fallback | 不锁定Docker / gVisor / Firecracker等产品;未选择candidate时保持blocked |
| SCP-SBX-004 policy applicability / execution decision | security contract | P0-C | 验证只消费body-free policy / authorization summary,missing / stale / conflicted / unsupported / unauthorized fail-closed | 不测试policy DSL、approval、allowlist或capability truth内部实现 |
| SCP-SBX-005 launch enforcement on qualified boundary | isolation qualification | P0-Q | 验证真实conformance workload只能在已建立boundary与给定policy decision下启动,拒绝旁路 / host launch | 不测试tools semantic command或runtime agent loop |
| SCP-SBX-006 run / failure / control lifecycle | core truth | P0-C | 验证run状态、stable failure classification、control conflict、duplicate replay和unknown-not-success | 不让runtime recover、business replay或raw SDK error决定sandbox truth |
| SCP-SBX-007 backend lifecycle / capture / inspect / release | isolation qualification | P0-Q | 验证candidate backend lifecycle、resource exceed / timeout / kill、capture、inspect、release结果与formal状态映射 | 单次smoke、进程退出或old process存活不构成资格 |
| SCP-SBX-008 capture fact / material handoff | truth and handoff | P0-C | 验证capture / handoff分层、candidate material body-free、pending / retryable / failed显式、source truth不回滚 | 不验证artifact formalization、archive package或下游正文质量 |
| SCP-SBX-009 observability material / formal audit | audit and observability | P0-C | 验证safe hook、低基数metric、formal audit同UoW、telemetry / provider audit不替代business audit | 不测试observability store、retention、dashboard或pager产品 |
| SCP-SBX-010 lease / orphan / cleanup / reaper | safety closure | P0-C | 用deterministic state验证expiry、orphan、guard-first、missing blocked、no force-clean、job no truth repair | simulation不证明真实资源已删除或真实host已收束 |
| SCP-SBX-011 destructive lifecycle safety | isolation qualification | P0-Q | 在受控lab验证真实inspect / terminate / release不越过handoff、investigation、lease和redline guard | 不在普通CI执行破坏性资源动作;lab未形成时保持blocked |
| SCP-SBX-012 redline containment / investigation handoff | security closure | P0-C / P0-Q | P0-C验证detected -> contained与不可advisory;适用P0-Q验证candidate backend红线信号到containment / stop-new-use接缝 | 不测试外部调查系统内部流程或用receipt自动解除containment |
| SCP-SBX-013 Command family | protocol | P0-C | 10 Command逐项具备accepted / formal reject或fail-closed / stored result、幂等冲突、版本冲突和rollback断言去向 | 不只测happy path,不发明新Command |
| SCP-SBX-014 Query family | protocol | P0-C | 13 Query逐项覆盖visible / empty / missing / stale / degraded / restricted及零写UoW | 不允许query refresh、rebuild、retry、release或append audit |
| SCP-SBX-015 Inbound Consumer family | protocol | P0-C | 9 Consumer逐项覆盖accepted / duplicate / delayed / quarantine、schema / source / forbidden-body和receipt | 不测试来源仓完整事件生成或内部状态机 |
| SCP-SBX-016 Outbound Event / relay family | protocol | P0-C | 13 Event验证payload来自committed stored snapshot、retry / dead-letter及publish failure no rollback | 不测试真实bus产品吞吐或下游完整消费语义 |
| SCP-SBX-017 Operations Job family | protocol | P0-C | 10 Job验证selection、per-item transaction、partial report、stored replay、no core truth repair | 不把job当业务修复入口或用job_run_ref代替幂等key |
| SCP-SBX-018 state machines / illegal transitions | state | P0-C | 六组状态主题覆盖合法 /非法转换、terminal guard、fail-closed、cleanup / redline guard和历史不可变 | 不以raw status string或adapter outcome跳过domain transition |
| SCP-SBX-019 persistence / UoW / rollback visibility | consistency | P0-C | fake / in-memory验证version、unique、transaction顺序、hidden staged writes、audit / relay / stale / stored result原子边界 | 不声称fake等于真实durable isolation或恢复 |
| SCP-SBX-020 idempotency / concurrency / stored replay | consistency | P0-C | 验证Command / Consumer / Job key、digest conflict、duplicate stored result / receipt / report、race和`DuplicateMissingResult`不重跑 | 不因retention、migration或实现便利重算历史结果 |
| SCP-SBX-021 durable store and transaction parity | product seam | P1 | 验证真实或real-like store在version / unique / rollback / page order / replay / append-only语义上与P0-C一致 | 不作为P0-C替代;产品未选时保持planned |
| SCP-SBX-022 config source / parser / item validation | config | P0-C | 覆盖S00~S08声明、S01 < S02 < S03、C01~C27、strict schema、I001~I101 type / range / required和no fallback / clamp | 不把默认值、第二文件或old process作为非法winner fallback |
| SCP-SBX-023 config composition / atomic generation | config | P0-C | 覆盖40组 /44域、FC-01~06、XVAL-01~36、required availability、same-generation set和发布0或完整 | invalid / mixed / partial generation不得标记`Degraded` / `Ready` |
| SCP-SBX-024 sensitive ref / material / no-output | security config | P0-C / conditional P0-Q | P0-C验证分类、S04时序、lease模型和全carrier redaction;使用真实material的P0-Q另验provider / platform no-output | 不保存真实secret、provider body或full sensitive ref到测试artifact |
| SCP-SBX-025 config change / review / rollback / drift contract | config governance | P0-C | 通过contract / simulation验证independent review、TOCTOU、完整candidate、new rollback request、history immutable和desired / observed honesty | 不声称真实fleet rollout、rollback或drift carrier已存在 |
| SCP-SBX-026 physical config rollout / provider rotation | operations seam | P1 | 验证真实carrier、provider audit、rollout / rollback / observation / alert接缝保持P0历史与fail-closed语义 | 不要求P1通过补偿P0 config invariant失败 |
| SCP-SBX-027 bounded degraded / recovery | resilience | P0-C | 仅read / maintenance / optional telemetry允许显式degraded;恢复生成new invocation / generation / request,不改accepted history | required dependency、hard guard、invalid candidate不可degraded allow |
| SCP-SBX-028 dependency graph / product neutrality | static boundary | P0-C | 目标仓形成后验证仅`core-contracts`为sibling compile dependency,其他均经runtime / event / handoff adapter | 当前目标仓缺失时只能planned / blocked,不得伪造manifest结果 |
| SCP-SBX-029 PROFILE-01~04 maturity guards | profile | P0-C | 验证non-executing fake、fixture isolation、controlled seam和operations simulation各自能力上限,真实workload一律拒绝 | P01~04启动 / case通过不等于真实隔离资格 |
| SCP-SBX-030 PROFILE-05 qualification | profile | P0-Q | 验证candidate backend、capability、四维boundary、capture / release、dedicated environment及适用secure refs的独立资格包 | 当前not qualified;不得生成run_id、签署或通过结论 |
| SCP-SBX-031 PROFILE-06 composition | profile | P1 | 在P05资格后验证durable / bus / resolver / handoff / scheduler / sink real-like组合和依赖故障 | 不从P05自动继承组合资格,不宣称staging已部署 |
| SCP-SBX-032 PROFILE-07 production target | profile evolution | P2 | 只记录未来production validation / capacity / disaster / security触发条件 | 当前inactive;任何启用测试先回写正式`00~04` |
| SCP-SBX-033 unsupported / undeclared surface absence | negative contract | P0-C | 验证S07 / S08 / reload / LKG / partial / hot / immediate callback / ordinary config隐含TTL无current surface且声明被拒绝 | 不为future能力预造API、状态、配置或case happy path |
| SCP-SBX-034 zero-tolerance NFR | nonfunctional redline | P0 | 验证宿主直跑、边界放宽、未授权外联、证据先删、正文入仓、orphan脱管和追溯缺口成功率为0 | 不继承旧时延 /可用率数字作为硬门禁 |
| SCP-SBX-035 structural performance and capacity safety | nonfunctional | P1 / P2 | P1验证关键路径不被optional依赖阻断;P2基于真实产品 /负载模型验证容量、硬SLO和成本 | 无负载模型时不写P95、吞吐或可用率通过结论 |
| SCP-SBX-036 FR-SBX-E01~E06 peripheral enhancements | future enhancement | P2 | 若进入范围,验证多后端 /调度 / inspect / preview /比较 /趋势不反向定义核心truth | 当前不作为核心通过前置;涉及new surface时先回上游设计 |

范围闭集规则:

- FR-SBX-001~018、BR-SBX-001~033、AC-SBX-001~023 / 026~041和VF-SBX-001~010均至少由一个P0范围项承接。
- AC-SBX-024 / 025与FR-SBX-E01~E06属于conditional P2;未实现不影响当前核心通过,一旦实现必须验证不改变核心语义。
- 10 Command、13 Query、9 Consumer、13 Event、10 Job必须全部进入Step 3对象 /切口抽取,不得以“同类覆盖”删除协议。
- TSH-01~20与FDT-01~30全部进入P0-C或适用P0-Q / P1范围,但当前仍不是case。
- P0-Q blocker不允许被标记为`passed`、`waived`或`not applicable`来完成整体P0;只能在正式范围被上游删除或资格证据形成后改变状态。

### 9.4 Profile到测试优先级与证明上限

| Profile | 测试优先级 | 当前可设计范围 | 通过时最多能证明 | 当前不能证明 |
|---|---|---|---|---|
| PROFILE-01 `local-contract` | P0-C | loader / builder、entry mapping、safe diagnostic、real request reject | 本地contract wiring与non-executing guard | 真实代码可隔离执行 |
| PROFILE-02 `ci-contract` | P0-C | unit / contract / state / UoW / idempotency / redaction / negative config | deterministic contract与fake parity | backend安全、durable parity或平台anti-leak |
| PROFILE-03 `integration-seam` | P0-C | consumer / publisher / resolver / handoff / sink接缝与failure mapping | body-free protocol与controlled seam正确 | coherent boundary真实生效 |
| PROFILE-04 `operations-simulation` | P0-C | lease / orphan / cleanup / redline / relay / replay / reconciliation simulation | guard / no-repair / history语义成立 | 真实资源已终止 /删除 / contained |
| PROFILE-05 `backend-conformance` | P0-Q | bounded real workload、四维negative boundary、resource exceed、capture / inspect / release、no host fallback | 指定candidate + capability + template + environment的资格候选证据 | staging、production、其他backend或其他template资格 |
| PROFILE-06 `staging-like` | P1 | durable parity、real-like E2E、dependency outage、scheduler / handoff / observability | 指定real-like composition的接缝候选证据 | production readiness或P07资格 |
| PROFILE-07 `production-like` | P2 target | 当前只定义设计重开与未来验证条件 | 无;当前不能执行或裁决 | active / ready / accepted / production |

### 9.5 只测接缝的相邻仓 / 外部能力

| 相邻仓 /能力 | 本轮测试内容 | 不测试内容 | 主要优先级 /残余风险 |
|---|---|---|---|
| `L2-tools` | tool / launch safe refs、统一入口、policy decision与sandbox failure / capture返回接缝 | ToolDefinition、ToolPolicy、semantic execution、ToolInvocationResult truth | P0-C contract;真实调用组合P1 |
| `L2-runtime` | runtime context ref、run / failure / control / capture material和no runtime truth persisted | agent loop、ExecutionInstance、checkpoint / recover、result backflow | P0-C contract;真实loop组合P1 |
| `L2-member-service` | member / host safe ref、统一入口与no host lifecycle truth | MemberExecutionHost、SandboxBinding、session / worker lifecycle | P0-C contract;真实host装配P1 |
| `L1-identity` / `L1-work` | actor / responsibility / project / work refs与missing / stale / conflict处理 | identity / role / project / work / iteration正文和生命周期 | P0-C fake / controlled seam;真实resolver P1 |
| policy / governance / capability owner | body-free policy / authorization / capability summary、freshness和fail-closed | policy DSL、approval、allowlist、capability truth或高风险taxonomy定义 | P0-C;真实source资格P1 |
| `L1-artifact` / archive | candidate material refs、handoff status、capture保留与no truth elevation | artifact body / version / baseline / evidence truth、archive package / restore | P0-C handoff;真实target P1 |
| `L4-observability` | safe log / metric / audit / diagnostic材料、handoff状态与redaction | physical store、trace query、retention、dashboard、alert truth | P0-C carrier;真实sink / alert P1 |
| investigation / security response | redline handoff ref、pending / failed / acknowledged marker和cleanup guard关系 | 调查正文、case lifecycle、解除审批内部流程 | P0-C contract;真实target / runbook P1 |
| runner / console /人工入口 | 统一受理入口、actor context、safe status / result / error映射 | CLI / UI流程、预览体验、operator state或旁路执行 | P0-C入口边界;真实产品E2E P1/P2 |
| isolation backend / secure provider | adapter capability / outcome、candidate conformance、lease和safe failure mapping | 产品内部调度、SDK body、供应商控制面和商务语义 | backend核心资格P0-Q;provider /平台扩展P1 |

### 9.6 非范围与残余风险归属

| 非范围 | 不进入当前测试范围的原因 | 残余风险 | 当前归属 /关闭条件 |
|---|---|---|---|
| 当前选择具体isolation backend产品 | 测试方案固定能力与否决契约,不做ADR或采购 /部署决策 | candidate未定使P0-Q无法执行,核心整体不能宣称通过 | ADR / `07/09`选择;Step 8绑定dedicated environment后执行P0-Q |
| 当前创建目标实现仓、测试代码、suite或CI | 违反只做设计仓文档和Step职责 | P0-C / P0-Q / P1均无法真实执行或产证 | `07` precheck与implementation boundary;Step 9只设计自动化契约 |
| 当前生成run_id、TC / EV真实记录、report或资格签署 | 尚无实现、执行环境和真实run | 任何通过 /失败 /资格声明都没有事实基础 | 真实测试执行 +新版`06`;当前只允许planned requirement |
| 生产credential、生产数据或真实外部正文 | 测试数据必须body-free且不得保存真实secret /正文 | 与真实生产平台差异需另行资格,但引入生产材料会造成泄漏 | Step 7 synthetic / controlled data;P05/P06仅受控非生产material;security qualification |
| 相邻仓完整内部状态机和业务E2E | sandbox只拥有execution isolation truth,不能代测tools / runtime / member / artifact等完整truth | fake / controlled seam与真实消费者可能存在集成差异 | P1 cross-repo integration;各相邻仓自己的`05/06` |
| backend / provider / store / bus / target内部产品语义 | 产品内部实现不是sandbox契约 | SDK、failure、recovery、isolation和routing存在产品差异 | P0-Q或P1 adapter qualification;ADR / vendor test / `07/09` |
| PROFILE-07当前生产验证 | PROFILE-07 inactive,正式生产contract /产品 /SLO /runbook不存在 | 无production readiness、capacity、DR和security结论 | P2 future;先回`00~04`,再重开`05~09` |
| remote config、admin override、reload、LKG、partial generation、hot swap、immediate callback的功能happy path | 当前正式设计明确unsupported或无public carrier | 未来需求会改变source / state / concurrency / audit / recovery | 当前P0只测无surface /声明reject;需求出现先回写`03/04` |
| FR-SBX-E01~E06完整外围增强 | 不构成当前核心闭环通过前置 | 多后端、调度、inspect / preview、比较和趋势能力未验证 | P2;进入current scope时重开需求 /设计 /测试 |
| Docker / gVisor启动、销毁和白名单开销旧数字 | historical候选且无当前产品 /负载模型 | 无法给出硬性能或容量结论 | Step 10 +新版`06/09`;基于真实模型重新定门禁 |
| 生产容量、硬SLO、成本和灾备 | 当前无published software / config baseline、workload mix或production profile | 性能、容量、可用性和恢复目标未被证明 | P2 capacity / operations;真实baseline后专项测试 |
| UI / CLI / operator console体验与可访问性 | 属于Runner / Console产品层 | 操作体验和显化可能不足 | 对应产品测试;只保留sandbox入口 /输出接缝 |
| artifact formalization、observability storage和security investigation最终裁决 | 分别由下游truth owner持有 | handoff成功不等于下游接受或最终调查关闭 | 下游仓`05/06`与真实handoff evidence |
| 最终验收裁决、risk acceptance和release决策 | `05`只生产测试证据,不拥有最终裁决 | 测试结果如何组合成接受 /拒绝尚未重建 | 新版`06`;VF / veto不得由一般risk acceptance绕过 |
| 真实config migration / compatibility drill | 当前current-no-migration且无首个published baseline | 首发后的rename / compatibility / rollback风险未验证 | 首个baseline后重开`04` MER和`05/06/07/09` |

非范围解释规则:

- “不在当前执行范围”不等于“从测试设计删除”。P0-Q、P1和P2仍保留明确目标、前置、blocked状态与关闭owner。
- 任何非范围不得被写成`passed`、`not applicable`或默认安全;只能是`not designed yet`、`blocked`、`inactive`或明确的future trigger。
- VF-SBX与VETO-CFG命中的行为不存在“产品未选所以不测”的豁免。contract负向先进入P0-C,真实隔离相关断言在P0-Q前置闭合后必须执行。

### 9.7 VF-SBX-001~010一票否决范围映射

| VF | P0范围承接 | 必须证明 | 当前不可接受的替代 |
|---|---|---|---|
| VF-SBX-001 | SCP-SBX-001~012;TG-SBX-01~05 | C-SBX-1~5五节点同时闭合,P0-C与适用P0-Q均有固定证据 | 只测Command happy path、只测fake或用P1 smoke补核心缺口 |
| VF-SBX-002 | SCP-SBX-001/003/005/029/030 | 匿名、旁路、caller-local、host / fake真实执行均不能成为formal sandbox success | local profile可启动、host process退出码或caller补记audit |
| VF-SBX-003 | SCP-SBX-002/003/005/007/030 | resource / filesystem / network / process四维同一coherent set真实成立;任一unsupported整体拒绝 | partial allow、best-effort、silent ignore、低层backend fallback |
| VF-SBX-004 | SCP-SBX-004/005/027 | policy missing / stale / conflict / unsupported / unauthorized均保持blocked / reject,不发起高风险动作 | technical `Degraded`、local allowlist或capability猜测授权launch |
| VF-SBX-005 | SCP-SBX-001/004/008/009/024/028 | identity / work / tools / runtime / artifact / observability / policy / UI正文不进truth、DTO、log、report或test artifact | 为调试 /测试方便保存raw body、SDK response或外部truth copy |
| VF-SBX-006 | SCP-SBX-008/009/015/016 | capture、candidate material、handoff receipt和observability material保持分层,只有下游owner可形成正式truth | receipt即artifact accepted、metric即audit、capture即evidence truth |
| VF-SBX-007 | SCP-SBX-010/011/012/017 | cleanup / reaper前显式满足capture / audit / handoff / investigation / redline guard,missing默认blocked | cleanup disabled绕过、force-clean、先删后补证据或模拟成功替代真实guard |
| VF-SBX-008 | SCP-SBX-006/007/010~012 | lease expiry、orphan和redline进入托管恢复 / containment,不得在外继续运行 | advisory event、普通receipt解除containment、unmanaged process继续运行 |
| VF-SBX-009 | SCP-SBX-006/013~021/025~027 | 同一execution / policy / control在caller、backend、consumer和retry下只有一套stored truth / result | duplicate重算、query / job修truth、backend状态覆盖domain状态、第二套caller语义 |
| VF-SBX-010 | SCP-SBX-001~020/022~030/034 | accept / reject / establish / policy / handoff / failure / control / redline均有safe trace和不可变回链 | log代替formal audit、raw error string推断、无法关联同一execution identity |

### 9.8 VETO-CFG-01~16测试范围映射

| Veto | 主要测试范围 | 优先级 | 必须进入后续测试的否决方向 |
|---|---|---|---|
| VETO-CFG-01 real workload no weak backend | SCP-SBX-003/005/029/030 | P0-C + P0-Q | P01~04真实request拒绝;P05 candidate不得host / fake / fixture fallback |
| VETO-CFG-02 coherent boundary no partial | SCP-SBX-002/003/022/023/030 | P0-C + P0-Q | 四维任一unsupported / mismatch时发布0或operation reject,无best-effort |
| VETO-CFG-03 policy fail-closed | SCP-SBX-004/005/022/027 | P0-C + P0-Q | missing / stale / conflict / unsupported policy不能被availability degraded放行 |
| VETO-CFG-04 external truth ownership | SCP-SBX-004/022/024/028 | P0-C | policy / allowlist / approval / capability正文配置和本地fallback被拒绝 |
| VETO-CFG-05 no raw leak | SCP-SBX-008/009/024/029/030 | P0-C + conditional P0-Q | ordinary source、DTO、workload、log、metric、audit、error、receipt、report和artifact全carrier无raw material /正文 |
| VETO-CFG-06 atomic generation | SCP-SBX-022/023/027 | P0-C | invalid / required failure / mixed identity发布0 handle,不得伪`Degraded` / `Ready` |
| VETO-CFG-07 formal audit mandatory | SCP-SBX-009/019/023 | P0-C | accepted truth与formal audit同UoW;telemetry / provider audit / log不可替代 |
| VETO-CFG-08 no source rollback | SCP-SBX-008/016/019/025/027 | P0-C | relay / handoff / publish失败只更新owning marker,不回滚truth或重建stored payload |
| VETO-CFG-09 cleanup / release guard | SCP-SBX-010/011/017/025 | P0-C + P0-Q | missing handoff / investigation / lease / redline保持blocked,无force-clean / fake Released |
| VETO-CFG-10 redline containment | SCP-SBX-012/025/027 | P0-C + applicable P0-Q | redline检测即contained;receipt / config / migration不能auto-release或advisory-only |
| VETO-CFG-11 no-write / no-repair | SCP-SBX-014/017/025/027 | P0-C | query、projection、derived、reconciliation和maintenance均不写 /修core truth |
| VETO-CFG-12 stored replay immutable | SCP-SBX-013/015/017/020/025/027 | P0-C | duplicate优先stored result / receipt / report;missing result阻塞而非重跑 |
| VETO-CFG-13 downstream truth separation | SCP-SBX-008/009/015/016 | P0-C | capture / handoff receipt只作fact / marker / body-free ref,不升格artifact / observability truth |
| VETO-CFG-14 unsupported surface honesty | SCP-SBX-022/023/033 | P0-C | S07 / S08 / reload / LKG / partial / hot声明直接reject,不silent ignore或沿用old snapshot |
| VETO-CFG-15 no safety weakening window | SCP-SBX-022~027/033 | P0-C | 安全削弱不进入deprecated兼容成功路径,必须立即拒绝并触发设计重开 |
| VETO-CFG-16 domain responsibility cut | SCP-SBX-004/028/033/036 | P0-C | 配置 /协议 /依赖图不定义tools semantic execution、agent loop或member lifecycle |

否决映射规则:

- VF-SBX是正式需求一票否决项,VETO-CFG是正式配置设计不可风险接受项;两者编号体系不合并,但测试范围必须同时覆盖。
- Step 5 / 6后续需要为每项建立至少一个可执行负向场景和断言去向;本Step不创建TC编号。
- P0-Q尚未可执行时,对应VETO仍为open blocker而非豁免。只有固定candidate、profile、environment和evidence identity后才可裁决。

### 9.9 TSH-01~20范围归类

| TSH范围组 | TSH ID | 测试优先级 | 范围承接 | 本Step结论 |
|---|---|---|---|---|
| source / parser / item validation | TSH-01~03 | P0-C | SCP-SBX-022 | strict source intent、closed schema、required / type / range / collection全部进入P0负向范围 |
| profile / forbidden config / composition | TSH-04~06 | P0-C + P0-Q资格边界 | SCP-SBX-023/029~033 | profile不得越级,NCFG / XVAL / hard guard不可silent ignore;P05资格单列 |
| sensitive / material lifecycle | TSH-07~08 | P0-C + conditional P0-Q / P1 | SCP-SBX-024/026/030/031 | no-output与时序是P0;真实provider /平台按适用资格执行 |
| load / freeze / scoped / generation | TSH-09~11 | P0-C | SCP-SBX-022/023/027/029 | pipeline、same-generation atomic publication与current unit isolation均为P0 |
| change / rollback / drift | TSH-12~14 | P0-C contract + P1 physical drill | SCP-SBX-025/026 | review / history / honesty是P0;真实carrier / fleet observation是P1 |
| hard dependency / degraded / recovery | TSH-15~17 | P0-C + applicable P0-Q | SCP-SBX-004~012/027 | fail-closed、no-write / no-repair、new unit recovery全部为P0 |
| safe signal / parity / dependency cut | TSH-18~20 | P0-C + P0-Q / P1 parity | SCP-SBX-009/019/021/028~031 | carrier安全与fake parity为P0;真实backend / durable parity按各自资格层级 |

### 9.10 FDT-01~30范围闭集

| FDT批次 | FDT ID | 主要范围 | 优先级结论 | 后续最低要求 |
|---|---|---|---|---|
| source / parse / required / unsupported | FDT-01~08 | SCP-SBX-022/023/033 | P0-C | 每项至少一个negative case候选;精确断言no fallback / no builder / no current surface |
| leak / profile / cross-field / provider | FDT-09~13 | SCP-SBX-024/029~031 | P0-C + conditional P0-Q / P1 | no-output与fake不升格为P0;真实provider生命周期按适用profile资格 |
| constructor / generation / scoped | FDT-14~17 | SCP-SBX-023/027/029 | P0-C | required failure发布0、optional degraded不削弱guard、current unit独立拒绝 |
| runtime dependency / read / consumer / handoff | FDT-18~21 | SCP-SBX-004~009/014~016/027 | P0-C + applicable P0-Q | policy fail-closed、query zero-write、quarantine、handoff no rollback |
| cleanup / maintenance / change | FDT-22~24 | SCP-SBX-010~012/017/025 | P0-C + applicable P0-Q | missing guard保持blocked、maintenance no repair、rejected change无activation |
| apply / rollback / drift | FDT-25~28 | SCP-SBX-025/026 | P0-C contract + P1 drill | history / mismatch / effect suspect / scope分类先P0;真实rollout evidence后置P1 |
| explicit expiry / safe carrier | FDT-29~30 | SCP-SBX-009/024/027/033 | P0-C | 无ordinary hidden TTL;safe字段和低基数标签完整 |

机械闭集结论:

- TSH-01~20均恰有一个范围组去向,无孤儿主题。
- FDT-01~30均恰有一个批次去向,无孤儿failure cut。
- 本表只证明范围去向,不证明存在case、suite、run、artifact、report或evidence。
- Step 3必须把这些范围转为具体对象 /切口;Step 5 / 6才允许分配测试场景与planned TC ID。

### 9.11 AHG / EHR成熟度与范围边界

| 集合 | 当前成熟度 | 本Step范围用途 | 本Step禁止动作 | 后续owner |
|---|---|---|---|---|
| AHG-01~19 | planned acceptance handoff | 反查P0 / P1范围是否包含strict config、qualification、no-output、generation、change、rollback、drift、fail-closed、no-truth-rewrite和dependency cut | 分配正式AC / VETO、填写pass / fail、风险接受或签署 | Step 5 / 12 / 13 +新版`06` |
| EHR-01~20 | planned evidence handoff | 确认每类范围未来需要producer、schema、redaction和固定identity | 创建EV alias、run_id、digest、artifact path、报告或真实结果 | Step 9 / 13 +真实执行 |
| TSH-01~20 | planned strategy handoff | 作为Step 3 / 4抽取对象与层级的完整输入 | 直接改名为suite / case或声称已覆盖 | Step 3 / 4 |
| FDT-01~30 | planned failure test cut | 作为Step 3 / 5 / 6负向切口与断言输入 | 用“集成测试覆盖”省略状态 /错误 /副作用断言 | Step 3 / 5 / 6 |

### 9.12 当前执行与资格blocker分层

| Blocker | 阻塞范围 | 不阻塞范围 | 当前状态 /动作 |
|---|---|---|---|
| 目标实现仓 / suite不存在 | P0-C / P0-Q / P1真实执行与evidence | Step 2~14测试设计 | `open_for_07_precheck`;不伪造manifest、case或结果 |
| candidate backend / capability / dedicated environment未选 | P0-Q执行与核心整体通过声明 | P0-C设计 /实现与负向contract测试设计 | `open_for_p0q_execution`;由ADR / `07/09`绑定后执行 |
| secure provider / principal / platform anti-leak未闭合 | 使用真实material的P0-Q及P1资格 | ref-only / synthetic P0-C与不需material的P0-Q | `open_for_material_qualification`;不得扩大为无关全局阻塞 |
| durable store / bus / target / scheduler / sink未选 | P1 PROFILE-06与物理change / rollout测试 | P0-C与backend P0-Q | `open_for_p1_execution`;禁止fake作为real-like通过证据 |
| 新版`06`未重建 | 最终接受 /拒绝、veto组合与资格签署 | `05`范围、切口、case和evidence schema设计 | `open_for_06_full_restart`;不预判裁决 |
| PROFILE-07 inactive | 所有production验证 / readiness / capacity签署 | P0 / P1设计与执行 | `inactive_reopen_required`;先回正式`00~04` |
| 真实software / config baseline不存在 | migration、compatibility、rollback release drill | current-no-migration contract / negative范围 | `open_for_future_release`;不伪造version / date / consumer |

---

## 10. 范围完整性审计

| 审计项 | 结果 | 结论 |
|---|---|---|
| C-SBX-1~5 | 5 / 5映射到TG-SBX-01~05与SCP-SBX-001~012 | 无核心能力孤儿 |
| FR-SBX-001~018 | 18 / 18按五节点映射到P0 | 无核心功能孤儿 |
| FR-SBX-E01~E06 | 6 / 6映射到SCP-SBX-036 P2 | 未误作当前核心前置 |
| BR-SBX-001~033 | 33 / 33按identity / boundary / policy / handoff / safety五组映射 | 后续Step 5需逐规则展开 |
| AC-SBX-001~041 | 核心与边界项进入P0;AC-024 / 025 conditional P2 | 未把验收命题写成结果 |
| VF-SBX-001~010 | 10 / 10逐项映射 | 全部P0且无risk acceptance豁免 |
| 七模块 | contracts / domain / application / infra / api / worker / jobs均由协议 /状态 /一致性范围承接 | Step 3需逐模块抽切口 |
| 五类协议 | 10 Command / 13 Query / 9 Consumer / 13 Event / 10 Job全部进入P0-C | 不允许按协议族抽样删除 |
| 六组状态 | identity、boundary、policy、run / handoff、safety、derived / relay / replay均进入SCP-SBX-018 | 无状态族孤儿 |
| 配置集合 | I001~I101、40组、D01~D44、S00~S08、PROFILE-01~07均有范围 | 字段级覆盖留给Step 5 / 6 |
| TSH / FDT | 20 / 20与30 / 30有范围去向 | 当前仍是planned handoff |
| AHG / EHR | 19 / 19与20 / 20保持planned maturity | 未创建正式门禁 / evidence事实 |
| VF与VETO | 10 VF与16 VETO分别保留编号并全部有P0去向 | 未错误合并编号体系 |
| 用户重点边界 | identity、resource、fs / network / process、launch policy、capture、observability、failure、cleanup / lease / reaper、redline均进入P0 | 无重点边界遗漏 |
| 非职责 | tools semantics、runtime loop、member lifecycle、artifact / observability truth均明确只测接缝 | 无领域范围膨胀 |
| 产品与成熟度 | P01~04不证明real isolation;P05 P0-Q blocked;P06 P1;P07 inactive | 无fake升格或资格伪造 |

审计结论: Step 2范围闭集完整,没有需要在当前回写正式`00~04`的矛盾。P0-Q的前置缺失是执行 blocker,不是设计缺口,也不是P0豁免。

---

## 11. 对上游设计的影响判定

| 测试范围结论 | 是否影响上游 | 影响类型 | 回写位置 | 处理状态 |
|---|---:|---|---|---|
| P0覆盖C-SBX-1~5、FR-SBX-001~018、VF-SBX-001~010和正式`03`最小切口 | 否 | 测试范围收束 | 不适用 | 无回写 |
| P0-C覆盖PROFILE-01~04的contract / fake / seam / simulation证明 | 否 | 承接`04` P0配置成熟度 | 不适用 | 无回写 |
| PROFILE-05四维conformance作为测试P0-Q,但配置成熟度仍是P1 | 否 | 不同分类轴:核心测试门禁 vs 配置引入成熟度 | 不适用 | 无回写;正式`04`的unqualified状态不变 |
| P0-Q前置未闭合时整体核心测试不得宣称通过 | 否 | 验收真实性约束 | 新版`06`后续裁决 | 无回写;当前只登记执行blocker |
| PROFILE-06 durable / real-like组合进入P1,PROFILE-07保持P2 inactive | 否 | 承接配置资格边界 | 不适用 | 无回写 |
| unsupported surface当前只测absence / reject | 否 | 承接`03/04`现有禁止边界 | 不适用 | 无回写 |
| FR-SBX-E01~E06保持P2 conditional | 否 | 承接需求外围增强 | 不适用 | 无回写 |
| 后续发现P0对象 /字段 /状态 /错误 /配置无法形成稳定断言 | 否（当前范围） | 可验证性触发器 | 对应`00/02/03/04`章节 | 触发时转blocker并先回写 |
| P0-Q执行发现formal capability声称与实际backend行为矛盾 | 否（当前范围） | backend资格失败;若协议不足则设计缺口 | 先失败该资格;仅在carrier /状态 /错误不足时回`03/04` | 触发时重新判定 |

当前无`待回写`或`阻塞待确认`的上游设计项。真实backend、provider、目标仓、产品和环境是后置执行 /资格 blocker,不阻塞Step 3继续设计。

---

## 12. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读本文件“优先级口径”“范围 /非范围主表”“Profile到测试优先级与证明上限”“VF / VETO映射”和“范围完整性审计”,确认P0-C / P0-Q不可替代关系及后置风险。

正式`05-测试方案.md` §2应回填:

1. 本轮测试目标是证明C-SBX-1~5完整受控执行隔离闭环、当前详细设计协议 /状态 /一致性、配置安全门禁和VF-SBX-001~010均成立。
2. P0内部区分P0-C contract / invariant门禁与P0-Q candidate backend conformance门禁;二者仍同属P0且不可互相替代。
3. P0-C覆盖PROFILE-01~04、全部五类协议、六组状态、UoW /幂等 /并发、source / schema / sensitive / atomic generation、query no-write、job no-repair、handoff no-rollback、cleanup / redline和redaction。
4. P0-Q按candidate backend + capability + coherent boundary template + dedicated environment绑定,验证真实四维限制、launch、lifecycle、capture / inspect / release和no host fallback;前置未闭合时核心整体不得宣称通过。
5. P1覆盖PROFILE-06 durable / real-like组合、真实provider /平台、跨仓接缝和物理change / rollout;P2覆盖PROFILE-07、容量 /硬SLO和FR-SBX-E01~E06外围增强。
6. tools、runtime、member-service、identity / work、policy owner、artifact、observability、runner、investigation和产品依赖只测sandbox接缝,不测试其完整内部实现。
7. 非范围均有残余风险和关闭owner;旧产品、旧TC、旧环境和旧性能数字不继承。
8. TSH / FDT / AHG / EHR保持planned handoff,本章不创建TC、EV、run_id、报告、通过结论或验收签署。

---

## 13. 待确认事项

| 待确认事项 | 当前状态 | 是否阻塞Step 3 | 后续owner /处理 |
|---|---|---:|---|
| candidate isolation backend与capability matrix何时选择 | open_for_p0q_execution | 否 | ADR / `07/09`;阻塞P0-Q执行与核心通过声明 |
| dedicated backend conformance environment何时形成 | open_for_p0q_execution | 否 | Step 8定义要求,`07/09`提供真实环境 |
| destructive cleanup / reaper / redline是否需要独立lab | open_for_environment_design | 否 | Step 8 / 10按风险决定;不足时重开profile设计 |
| secure provider / principal / platform anti-leak如何资格 | open_for_material_qualification | 否 | Step 8 / 10 + `07/09`;只阻塞使用真实material的范围 |
| durable store / bus / handoff / scheduler / sink产品 | open_for_p1_execution | 否 | ADR / `07/09`;P1 real-like组合前关闭 |
| P0-Q最终通过阈值和evidence identity | not_defined_yet | 否 | Step 5 / 10 / 12 / 13与新版`06`;当前不预分配 |
| 目标实现仓与shared type何时确认 | open_for_07_precheck | 否 | `07`首个precheck;阻塞真实suite /manifest执行 |
| 候选性能数字是否升级为硬门禁 | open_for_step_10 | 否 | Step 10基于产品、负载和风险模型判定 |
| PROFILE-07何时进入范围 | inactive_reopen_required | 否 | 先回正式`00~04`,再重开后续文档 |

---

## 14. 进入下一步条件

| 条件 | 结果 | 说明 |
|---|---|---|
| 用户已确认Step 1 | 通过 | 用户连续回复“继续”,本次只执行Step 2 |
| 测试目标明确 | 通过 | TG-SBX-01~11 |
| P0 / P1 / P2已收稳 | 通过 | P0-C / P0-Q不可替代,P1 / P2边界明确 |
| 范围 /非范围已绑定正式来源 | 通过 | SCP-SBX-001~036与§9.6 |
| 下游只测接缝边界明确 | 通过 | §9.5 |
| 非范围残余风险和owner明确 | 通过 | §9.6 / §13 |
| VF / VETO范围完整 | 通过 | 10 VF与16 VETO逐项映射 |
| TSH / FDT / AHG / EHR成熟度未伪造 | 通过 | §9.9~§9.11 |
| profile证明上限明确 | 通过 | P01~04 non-executing,P05 P0-Q blocked,P06 P1,P07 inactive |
| 当前上游影响已判定 | 通过 | 无当前待回写 |
| 正式`05`未修改且未创建TC / EV /结果 | 通过 | 本Step只创建范围中间产物 |
| 可进入Step 3 | `passed_to_step_3` | 用户已审查确认;Step 3已据此完成 |

```text
current_document = `05-测试方案.md`
current_step = Step 2 `明确测试目标、范围和非范围`
gate_status = passed_to_step_3
next_allowed_action = 已传递至Step 3;后续恢复读取`05_test_plan_step_03_test_objects_cuts.md`
formal_document_write = not_started_historical_file_untouched
real_test_execution = not_started
real_evidence_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```
