# Step 6. 定义环境、部署 profile 与配置矩阵

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 6
> 书写规范: `standards/document/配置设计书写规范.md` §5.6
> 回填章节: `04-配置设计.md` §6 环境、部署 profile 与配置矩阵
> 生成日期: 2026-07-10
> 状态: reviewed_passed_to_step_7
> 所属流程: `04_config_calibration_flow.md`
> 本 Step 口径: 本步承接 Step 5 来源通道和架构部署边界,定义环境适用性、profile语义、真实workload执行资格、配置来源、部署角色、外部依赖 / adapter mode、敏感配置、测试 / 验收承接和D01~D44 profile差异。不得定义raw key / env名、默认数值、产品选型、部署命令、真实测试结果、run_id、evidence alias、验收签署、生产启用或commit boundary。

---

## 1. Step 开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 6 | 是。Step 5完成后的门禁检查期间,用户回复“继续”,视为审查确认并允许进入下一Step。 |
| 项目级台账是否允许进入 Step 6 | 是。Step 5中间产物、编号、表格、异常字符和提前产物检查已通过;用户确认后门禁满足。 |
| 文档级 flow 是否允许进入 Step 6 | 是。Step 5状态为`completed_wait_user_review`;本次用户确认后可进入。 |
| 是否已读取 Step 5 / Step 4 | 是。已承接S00~S08、4条source lane、C01~C27、D01~D44来源闭集、CAT-00~10和NCFG-01~24。 |
| 是否已读取 Step 6 SOP / 书写规范 | 是。必须至少明确local / CI / test / staging / prod适用性、来源、外部依赖、敏感配置和测试 / 验收差异。 |
| 是否已读取架构部署边界 | 是。正式`01` §7允许P0运行职责同部署,但要求同步入口、异步消费、执行承接、后台维护、state、backend和handoff边界语义分离。 |
| 是否复核旧下游材料 | 是。旧`05/06`的local / real-like host runtime、cleanup disabled、旧allowlist和旧对象只记录为historical material,不进入当前profile。 |
| 当前状态 | 已完成并经用户确认;已放行 Step 7 |
| 输出文件 | `projects/L4-sandbox/design-calibration/04_config_step_06_environment_profiles_matrix.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 7 |
| 是否发现阻塞本 Step 的上游 blocker | 否。真实backend产品、capability matrix、secure resolver、durable store / bus / targets尚未锁定,使P1 profile不能声明qualified / active,但不阻塞定义环境矩阵。 |

---

## 2. 本步目标

将“环境名称”转译成可审查的profile资格与能力组合,特别防止本地 / CI deterministic fake被误用为真实workload执行后端或生产就绪证明。

本 Step 只回答:

- local、CI、controlled test、backend conformance、staging和production当前分别是否适用。
- 哪些profile只验证contract / orchestration,哪些profile才允许candidate backend执行受控conformance workload。
- 每个profile使用哪些Step 5 source lane、哪些部署角色、哪些store / resolver / backend / event / handoff / observability mode。
- 每个profile如何处理opaque sensitive ref和S04 secure material。
- profile之间哪些差异必须进入`05`测试矩阵、`06`验收veto和`07`实施门禁。
- P1 profile在什么前提下才有资格启用,以及为什么当前不能声明staging / production已就绪。
- D01~D44在P0 contract、P1 conformance和deployment target中如何变化,哪些guard永远不变。

本 Step 不定义:

- backend、store、bus、scheduler、OTel、secret provider和handoff target的产品或供应商。
- seccomp / AppArmor / cap-drop / mount / network规则的物理清单和安装方式。
- raw profile字符串、JSON key、env var、默认数值、endpoint、topic、credential path和CLI flag;留给Step 7 / 8。
- 测试用例、CI job、真实conformance结果、验收阈值、evidence alias或资格签署。
- 生产拓扑、容量、发布、灰度、回滚、值班和runbook。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已完成并经用户确认 | 提供S00~S08、global / local / secure / fixture lane、冲突规则和real-like no-fake-fallback。 |
| `04_config_step_04_categories_boundaries.md` | 已完成并经用户确认 | 提供CAT-00~10、更新边界、NCFG-01~24和profile不得改变hard guard。 |
| `04_config_step_03_control_plane.md` | 已完成并经用户确认 | 提供11个控制面、44个配置域、P0 / P1 / P2定位和profile composition owner。 |
| `projects/L4-sandbox/01-架构设计.md` §7 / §11 / §13~§15 | 正式架构基线 | 提供运行承载角色、P0同部署许可、产品中立、no host-run、coherent boundary和P1演进条件。 |
| `projects/L4-sandbox/03-详细设计.md` §13 / §15~§17 | 正式直接上游 | 提供runtime profile ref、P0 fake / in-memory binding、entry边界、测试切口和产品风险。 |
| `03_ddd_step_14_config_external_binding.md` | 已完成详细设计中间产物 | 提供fake / real adapter、boundary / backend / lease / handoff / event / job binding及runtime builder顺序。 |
| `03_ddd_step_16_test_cuts.md` | 已完成详细设计中间产物 | 提供config、fake parity、negative boundary、integration和operations job测试方向,不提供结果。 |
| 旧`05-测试方案.md` / `06-验收标准.md` | historical_direction_input | 仅用于发现旧dev / test / staging命名污染;旧host runtime、cleanup disabled、allowlist和对象矩阵不得继承。 |
| `L1-governance` / `L1-artifact` Step 6 | 粒度参考 | 参考source / dependency / sensitive / test矩阵结构;Sandbox增加真实workload资格和backend conformance分层。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复Step 5并确认用户允许进入Step 6。 | done | Step 6是唯一允许动作。 |
| 2 | 读取Step 6标准、架构部署边界、详细设计profile / adapter输入和旧下游污染点。 | done | 固定environment / profile / adapter mode分层。 |
| 3 | 定义环境适用性和7个profile。 | done | 4个P0 contract / simulation profile,3个P1 conformance / deployment target。 |
| 4 | 固定真实workload资格与激活门禁。 | done | P0 fake不执行真实代码;backend-conformance是候选真实后端的最小前置。 |
| 5 | 建立source、部署角色、dependency / adapter、sensitive、test / acceptance矩阵。 | done | profile差异可交给`05/06/07`。 |
| 6 | 对D01~D44形成profile适用性批次。 | done | Step 7可按domain + profile落配置项。 |
| 7 | 完成profile停审、跨profile审计、historical conflict和`03`影响判定。 | done | 无具体`03`回写项;P1保持not qualified。 |
| 8 | 输出回填草稿和Step 7 handoff,更新三层状态。 | done | Step 6完成后停审,不创建Step 7文件。 |

---

## 5. SOP 问题回答

| SOP问题 | 本步回答 |
|---|---|
| local / CI / test / staging / prod分别是否适用 | local适用`SBX-PROFILE-01 local-contract`;PR / ordinary CI适用`02 ci-contract`;controlled integration test适用`03 integration-seam`;scheduled safety / operations test适用`04 operations-simulation`;dedicated backend lab适用P1 `05 backend-conformance`;staging仅在P1资格满足后适用`06 staging-like`;production当前无active profile,`07 production-like`只是inactive design target。 |
| 每个环境配置来源是什么 | 全部遵守Step 5。P0使用S01 / S02 / S03和受限S05;01~04可使用S06 fixture-owned slots,不得用S04真实material。05~07禁止S06,要求显式S02 / S03 binding并按需使用S04;S07 / S08 remote / admin source在所有profile均unsupported。 |
| 每个环境依赖哪些外部服务 | 01 / 02只依赖in-memory / deterministic fake且不得执行真实代码;03使用controlled adapter seams验证协议和失败映射;04使用simulated handles / state验证maintenance guard;05使用candidate real backend / capability / lifecycle / capture / release;06使用real-like durable / event / resolver / handoff / scheduler / observability接缝;07仅定义approved production target。 |
| 敏感配置如何处理 | 所有profile禁止raw secret / endpoint credential / topic credential进入ordinary config。01~04只使用fake / fixture refs,不调用真实S04 material。05~07仅允许S02 / S03选择opaque ref后由S04解析;material不得进入summary / log / audit / report。 |
| 哪些环境差异影响测试和验收 | P0 profile证明contract、determinism、failure mapping和guard simulation,不能证明真实隔离。05必须验证resource / filesystem / network / process四维可落实、no host-run、capture / release和negative escape-like cases。06承接real-like end-to-end、durable parity和外部依赖failure。07需要未来正式evidence和验收签署;当前不得声明通过。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step处理 |
|---|---|---|
| Step 2 P0 / P1 | 允许P0 deterministic fake,但尚未明确fake能否执行真实代码 | 明确01~04 real workload forbidden;fake只能模拟formal outcomes。 |
| Step 3 CP-11 | 只有local / test / staging / production-like候选 | 固定7个logical profile和环境适用性。 |
| Step 5 source lane | 已定义source,尚未按profile限制S04 / S06 | P0 contract仅S06,P1真实profile禁止S06并按需要求S04。 |
| 架构P0同部署 | 容易被误读为源码crate或单进程即安全边界 | profile保持7个运行角色语义,是否同部署不改变backend外部隔离要求。 |
| integration-like | 容易混合“接缝集成”和“真实隔离验证” | 拆为`integration-seam`与`backend-conformance`。 |
| staging / production | 产品和真实依赖未锁定,容易润色成已就绪 | 标记conditional / inactive,不声明active、qualified或accepted。 |
| 旧`05/06` | local / staging host runtime、cleanup disabled、旧allowlist回流风险 | 降级为historical conflict,明确禁止进入profile。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| P0 profile | local / test / integration方向 | 01~04分别承接local、CI、seam和operations simulation | 将测试目的与side effect资格分开。 |
| 真实隔离验证 | 隐含在future real backend | 独立`backend-conformance` profile | 防止fake evidence升级为真实隔离证明。 |
| staging / production | 候选方向 | staging conditional;production-like inactive target;prod当前不适用 | 不伪造部署 / 验收成熟度。 |
| fixture / secure source | 只在Step 5分lane | P0 contract允许S06禁S04;P1 real禁S06并按需用S04 | 防止fixture / secret跨环境污染。 |
| 运行职责 | 架构允许P0同部署 | 每个profile显式列entry / worker / execution / jobs / state / backend / handoff角色 | 保留未来拆分与失败归责。 |
| 测试承接 | profile差异未定位 | 每个profile给出test scope、acceptance eligibility和禁止证明事项 | 让`05/06`可直接展开。 |

---

## 8. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| local profile是否允许host process执行真实workload | A. 允许;B. 禁止 | 采用B。local只走non-executing deterministic fake;真实workload必须进入candidate backend conformance。 |
| ordinary CI是否运行candidate backend | A. 默认运行;B. 独立受控环境 | 采用B。backend conformance需要专用隔离宿主 / runner与安全前置,不能混入普通PR CI。 |
| integration profile是否同时证明backend安全 | A. 是;B. 分离seam与conformance | 采用B。协议接缝成功不能证明资源 / fs / network / process限制真实生效。 |
| operations simulation是否可释放真实backend handle | A. 可以;B. 仅simulated handles | 采用B。真实release只在conformance / staging-like由正式adapter执行。 |
| staging-like是否P0 must-pass | A. 是;B. P1 conditional | 采用B。真实产品、secret、scheduler和targets尚未锁定。 |
| production-like是否代表production active | A. 是;B. 仅inactive target | 采用B。当前没有实现、测试evidence、验收签署或runbook。 |
| profile是否等于adapter mode | A. 等于;B. 分离 | 采用B。一个profile按控制面混合store、resolver、backend、event、handoff和sink mode。 |

---

## 9. 结构化中间产物

### 9.1 Environment与Profile概念分离

| 概念 | 定义 | 示例 | 禁止误用 |
|---|---|---|---|
| environment | 承载某类profile的运行位置 / 安全语境,不是配置值 | developer workstation、PR CI、controlled integration、backend lab、staging、production | 不得从environment名字推导backend产品或guard。 |
| runtime profile | 将已定义配置域组合为validated snapshot的逻辑身份 | `SBX-PROFILE-02 ci-contract` | 不得重定义source priority、NCFG或protocol。 |
| adapter mode | 某一能力在profile内的绑定级别 | non-executing-fake、controlled-seam、candidate-real、real-like | 不得把单一mode推广为整个profile。 |
| eligibility | profile是否有资格在某environment启用的设计门禁 | backend-conformance通过后staging-like才可候选 | 不得伪造evidence / sign-off满足eligibility。 |
| deployment topology | 运行角色是否同进程 / 分开承载 | P0可同部署;P1可按风险拆分 | 不得把crate目录当容器或让同部署替代isolation backend。 |

### 9.2 Environment适用性表

下列表格中`PROFILE-xx`是`SBX-PROFILE-xx`的简写,只表示本配置设计中的逻辑profile,不是已存在的Rust enum、部署对象或验收状态。

| Environment ID / 环境 | 适用Profile | 当前适用性 | 真实workload | 说明 |
|---|---|---|---|---|
| SBX-ENV-01 developer workstation | PROFILE-01 | applicable_for_design_and_local_contract | 禁止 | 可运行API / worker / job contract shell,backend fake不得调用host process。 |
| SBX-ENV-02 ordinary PR / merge CI | PROFILE-02 | applicable_for_design_and_ci_contract | 禁止 | run-scoped deterministic fixture;不接真实secret和candidate backend。 |
| SBX-ENV-03 controlled integration test | PROFILE-03 | applicable_for_seam_validation | 禁止 | 验证resolver / event / handoff / sink接缝和failure mapping,不证明真实隔离。 |
| SBX-ENV-04 controlled operations simulation | PROFILE-04 | applicable_for_safety_workflow_simulation | 禁止 | 只操作simulated handle / state,验证lease / cleanup / redline / replay规则。 |
| SBX-ENV-05 dedicated backend conformance lab | PROFILE-05 | conditionally_applicable_after_binding | 仅受控conformance workload | 必须使用candidate real isolation backend和专用测试语境;当前不声明已具备。 |
| SBX-ENV-06 staging | PROFILE-06 | conditional_not_currently_qualified | 条件允许 | 需未来backend conformance、real-like dependencies、`05/06`门禁和实施准备。 |
| SBX-ENV-07 production | 无active profile;PROFILE-07仅目标 | not_currently_applicable | 禁止当前启用 | 产品、secure source、capacity、evidence、验收签署和runbook均未形成当前事实。 |

通用`dev`、`test`、`staging`、`prod`不得作为未定义语义的profile alias。Step 7若需要serialized profile value,必须映射到本步稳定Profile ID,不得复活旧`dev/test/staging`行为。

### 9.3 Profile总表

| Profile ID / 逻辑名称 | 优先级 | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|---|
| SBX-PROFILE-01 `local-contract` | P0 | 本地验证load / validate / builder、command / query / job contract和safe diagnostics | S01 + optional S02 / S03 + bounded S05 + S06 | in-memory / deterministic fake;real isolation backend disabled | fake / absent refs;禁止S04真实material | 可启动不等于可执行真实代码或验收通过。 |
| SBX-PROFILE-02 `ci-contract` | P0 | deterministic unit / contract / service / fake parity与negative config测试 | S01 + suite S02 + allowlisted CI S03 + S05 + required S06 | run-isolated in-memory / deterministic fake / failure injection | fake refs only;禁止S04 | 所有side effect受fixture控制;不证明real dependency。 |
| SBX-PROFILE-03 `integration-seam` | P0 | 验证consumer / publisher / resolver / handoff / diagnostic接缝和不可用映射 | S01 baseline + required S02 + controlled S03 + S05 + bounded S06 | controlled seam adapters;execution仍non-executing fake | fake / controlled opaque refs;不解析生产material | 不加sibling Cargo;不做backend安全证明。 |
| SBX-PROFILE-04 `operations-simulation` | P0 | 验证relay / retry、reference refresh、projection、reconciliation、lease / cleanup / redline guard | S01 baseline + required S02 + S03 + typed S05 + S06 simulation state | simulated handles / state / reports;no real release / target | fake / simulation refs;禁止raw historical body | 只能生成测试surface,不得修truth或操作真实backend。 |
| SBX-PROFILE-05 `backend-conformance` | P1 | 证明candidate backend可落实resource / fs / network / process边界及lifecycle / capture / release | S01 strict baseline + required S02 / S03 + S04 + typed S05;禁止S06 adapter override | candidate real capability / isolation / capture / release;controlled stores / handoffs | opaque refs经S04解析;不得使用production credential | 资格依赖未来测试evidence;当前仅定义profile。 |
| SBX-PROFILE-06 `staging-like` | P1 | real-like end-to-end、durable parity、event / handoff / scheduler / observability接缝 | S01 safe baseline + required S02 / S03 / S04 + restricted S05;禁止S06 | conformance-qualified backend + real-like store / bus / resolver / targets | raw material只由S04解析;opaque refs不输出 | conditional且not currently qualified;不阻塞P0。 |
| SBX-PROFILE-07 `production-like` | P1/P2 target | 定义未来production运行的完整安全组合和资格边界 | required S02 / S03 / S04 + tightly restricted S05;S01仅safe / disabled defaults;禁止S06~S08 | future approved backend / durable store / bus / resolver / targets / scheduler / sink | approved opaque refs -> S04;禁止ordinary raw value | inactive design target;不能用作当前部署、测试或验收结论。 |

### 9.4 Profile激活门禁与真实Workload资格

| Profile | 激活前置 | 允许的执行 | 必须拒绝 | 当前成熟度声明 |
|---|---|---|---|---|
| PROFILE-01 | config / fixture validation通过 | non-executing fake outcome only | 任意host / real workload launch | design_defined;未声明实现 / 测试通过 |
| PROFILE-02 | isolated fixture、fixed clock / id、negative guards完整配置 | deterministic non-executing fake | host process、真实secret、真实target | design_defined;未声明CI存在 |
| PROFILE-03 | controlled endpoints / refs、schema / route / target registry完整 | seam call / simulated outcome;无真实workload | candidate backend launch、raw body接缝 | design_defined;未声明integration通过 |
| PROFILE-04 | simulation state / handle / report refs和guard fixture完整 | simulated maintenance / replay | 真实release、真实cleanup删除、真实containment解除 | design_defined;未声明operations evidence |
| PROFILE-05 | candidate backend ref、capability profile、四维boundary、capture、release、secure refs和dedicated environment完整 | bounded conformance workload only | unsupported dimension、host fallback、fixture adapter替代candidate backend | conditionally_defined;not qualified |
| PROFILE-06 | PROFILE-05未来资格结果 + durable / bus / resolver / handoff / scheduler / sink完整 + `05/06`门禁 | controlled non-production workload | 缺binding时fallback、部分boundary、fake混入 | conditional;not currently qualified |
| PROFILE-07 | 正式实现、conformance、staging、security / acceptance evidence、签署、capacity和runbook全部未来满足 | future approved workload | 当前任何启用或以设计表替代资格证明 | inactive target;not applicable now |

本表只定义资格条件,不声明任何实现、test run、evidence、签署或profile已经满足前置。

### 9.5 Profile配置来源矩阵

| Profile | S01 defaults | S02 JSON | S03 env | S04 secure | S05 local input | S06 fixture | S07 / S08 |
|---|---|---|---|---|---|---|---|
| PROFILE-01 | required safe baseline | optional local overrides | optional allowlisted refs / selectors | forbidden | config / profile / diagnostic selector only | allowed for fixture-owned slots | forbidden |
| PROFILE-02 | required safe baseline | required per suite when defaults insufficient | CI allowlist only | forbidden | run selector / typed test input | required for deterministic cases | forbidden |
| PROFILE-03 | required safe baseline | required controlled seam registry | controlled allowlisted refs | forbidden;只使用fake / controlled refs | registered scenario / target selector | allowed for controlled outcomes | forbidden |
| PROFILE-04 | required safety baseline | required simulation profile | simulation refs only | forbidden | typed job / scope / batch under global ceiling | required simulated state / handles | forbidden |
| PROFILE-05 | strict / disabled baseline only | required candidate backend / boundary bindings | required allowlisted lab refs as needed | required whencandidate adapter需要material | typed conformance input within registry | forbidden as backend / capability replacement | forbidden |
| PROFILE-06 | safe / disabled baseline only | required complete real-like composition | required allowlisted staging refs | required forselected real-like adapters | restricted typed run / target selector | forbidden | forbidden |
| PROFILE-07 | safe / disabled baseline only | future required approved composition | future operations-controlled allowlist | future required approved resolver | tightly restricted typed operator input | forbidden | forbidden until NCFG-24 redesign |

来源约束:

- 所有profile继续使用S01 < S02 < S03,高层非法值不得回退。
- S04不是S03之上的global override,只解析已选opaque ref。
- S05不得切换backend family、放宽boundary、注入arbitrary target或改变cleanup / redline guard。
- S06不得出现在PROFILE-05~07,即使fixture值与真实binding相同也必须拒绝。
- PROFILE-07当前不允许被selector激活;表中future来源只表达重新打开设计后的目标边界。

### 9.6 Profile部署角色矩阵

正式部署角色来自架构§7,不是crate或容器数量。`co-located`只表示逻辑角色可在同一测试 / 服务进程承载,不表示isolation backend可在宿主直跑。

| Profile | 同步入口 | 异步消费 | 受控执行承接 | 后台维护 / 清理 | State承载 | Backend边界 | Handoff边界 |
|---|---|---|---|---|---|---|---|
| PROFILE-01 | local contract entry | disabled或fixture loop | non-executing fake | simulated / manual job | in-memory | disabled / fake only | fake / disabled |
| PROFILE-02 | test harness / handler tests | deterministic fixture loop | non-executing fake | deterministic job harness | run-isolated in-memory | fake only | fake with failure injection |
| PROFILE-03 | controlled entry harness | controlled consumer / relay seam | non-executing fake | controlled job seam | isolated test store | disabled forreal execution | controlled target seam |
| PROFILE-04 | typed operations job entry;query surface可选 | replay / feedback simulation | no launch;simulated lifecycle state only | primary role,all guards active | simulation / replay state | simulated handles only | simulated target / receipt |
| PROFILE-05 | restricted conformance driver through existing entry contract | candidate lifecycle signal可启用;ordinary bus可禁用 | candidate real backend,conformance workload only | real inspection / release paths under test guard | isolated conformance state | external candidate isolation boundary required | controlled evidence / capture target |
| PROFILE-06 | real-like controlled entry | real-like consumers / relay | conformance-qualified backend | scheduler-driven maintenance with guards | durable-like isolated staging state | external qualified backend | real-like material / observability / investigation targets |
| PROFILE-07 | future approved entry | future approved consumers | future approved backend | future approved scheduler / reaper | future production durable state | external approved isolation boundary | future approved targets |

### 9.7 Profile外部依赖与Adapter Mode矩阵

Adapter mode是配置设计词汇,不是当前实现enum。Step 7只能把它展开为现有adapter / store / profile refs和enablement项;若需要新增代码carrier,必须先回写`03`。

| Profile | Store / UoW | Context / policy / capability | Isolation / capture / release | Event transport | Handoff targets | Observability / diagnostics |
|---|---|---|---|---|---|---|
| PROFILE-01 | `in-memory-contract` | `deterministic-fake` | `non-executing-fake` / disabled | fake / disabled | fake / disabled | safe-local,strict redaction |
| PROFILE-02 | `run-isolated-in-memory` | deterministic fixture with failure injection | `non-executing-fake` | fake with asserted schema / route | fake receipt / failure injection | capture sink + forbidden-field assertions |
| PROFILE-03 | in-memory或durable-like test double | `controlled-seam` body-free summaries | execution fake;backend availability seam only | controlled consumer / publisher seam | controlled handoff / feedback seam | controlled safe sink seam |
| PROFILE-04 | simulation / replay state and stored reports | fixture / replay summaries | no launch;simulated inspect / handle / release outcomes | relay / receipt simulation | simulated target / feedback | safe report / diagnostic refs |
| PROFILE-05 | isolated conformance store;not production durable | strict fixture policy + candidate real capability source | `candidate-real` forlaunch / limits / capture / inspect / release | disabled或controlled evidence route | controlled non-production evidence target | required safe conformance sink / audit |
| PROFILE-06 | real-like durable + UoW parity | real-like body-free resolvers | conformance-qualified real-like backend | real-like bus / schema / route | real-like material / obs / investigation targets | real-like sink,strict redaction |
| PROFILE-07 | future approved durable | future approved sources | future approved backend | future approved transport | future approved targets | future approved sink + formal audit |

适配约束:

- `non-executing-fake`只能返回确定性adapter outcome,不得spawn宿主进程、访问未授权文件系统或网络。
- `controlled-seam`验证port / protocol / failure surface,不能作为coherent boundary证据。
- `candidate-real`只有在PROFILE-05 dedicated environment内执行bounded conformance workload,不能承载业务生产流量。
- durable-like test double不构成durable parity通过结论;真实parity需要后续测试evidence。
- profile内任一dependency缺失必须按Step 5处理,不得把整个profile降级为更弱mode。

### 9.8 Profile敏感配置矩阵

| Profile | 允许的敏感引用 | Raw material处理 | 禁止内容 | 不可用策略 |
|---|---|---|---|---|
| PROFILE-01 | fake / disabled ref | 不调用真实S04 | token、password、private key、raw endpoint / topic / path body | 需要真实material的能力保持disabled;不得fallback host / raw env |
| PROFILE-02 | fixture ref / fake credential marker | 不调用真实S04 | 任何真实credential、生产endpoint或historical raw body | fixture缺失test fail-fast |
| PROFILE-03 | controlled fake ref / registered target ref | 不调用真实S04 | production credential、arbitrary endpoint / target、external body | seam未注册则entry / loop / run reject |
| PROFILE-04 | simulation / replay ref | 不调用真实S04 | raw historical payload、真实release credential、investigation body | simulation ref缺失job reject / item failed,不操作真实资源 |
| PROFILE-05 | candidate backend / lab store / controlled target opaque refs | S04在dedicated environment解析非生产material | production credential、ordinary file / env raw value、material output | required material不可用则conformance startup / case fail-closed |
| PROFILE-06 | real-like store / bus / resolver / handoff / sink refs | S04解析受控非生产material | production secret、raw config material、secret echo | resolver不可用则profile不qualified / startup reject |
| PROFILE-07 | future approved opaque refs only | future approved S04 | 当前任何真实secret配置或启用 | 当前reject activation;未来需Step 8 / 10 / 13和验收闭环 |

所有profile的config identity、日志、audit、report、evidence candidate和public error均不得包含raw secret、raw endpoint、raw topic、provider response或credential ref原文。

### 9.9 Profile测试、验收与实施承接矩阵

| Profile | `05-测试方案.md`承接 | `06-验收标准.md`承接 | `07-实施计划.md`承接 | 当前不得声称 |
|---|---|---|---|---|
| PROFILE-01 | loader / builder smoke、entry mapping、no real launch | 不作为正式隔离验收证据 | local contract wiring / sample config | local可启动 = sandbox可执行 |
| PROFILE-02 | unit / contract / state / UoW / idempotency / redaction / negative config | P0自动化契约evidence候选 | deterministic fixtures / CI gate边界 | fake通过 = backend安全通过 |
| PROFILE-03 | consumer / publisher / resolver / handoff / sink contract与failure mapping | 接缝完整性evidence候选 | controlled adapters / schema / route / target setup | seam成功 = coherent boundary成立 |
| PROFILE-04 | lease / orphan / cleanup / redline / relay / replay / reconciliation simulation | safety flow / no-repair / no-release negative evidence候选 | operations job / report / simulation state setup | simulation = 真实资源已清理 |
| PROFILE-05 | backend capability、四维negative boundary、resource exceed、capture / inspect / release、no host fallback | backend conformance资格evidence候选;阈值由后续`06`定 | candidate backend adapter / dedicated environment / gate | 已有candidate、run_id、evidence或资格签署 |
| PROFILE-06 | durable parity、real-like E2E、dependency outage、scheduler / handoff / observability | release-candidate evidence候选 | staging composition / secrets / deployment precheck | staging已部署或已验收 |
| PROFILE-07 | future production validation / capacity / disaster / security | future production acceptance and sign-off | future rollout / runbook / rollback | production active、ready或accepted |

旧`05/06`不得直接作为以上矩阵的用例、evidence或签署来源;后续必须按当前`00~04` full-restart重建。

### 9.10 按配置域组织的Profile差异矩阵

表内`P01~P07`分别表示`SBX-PROFILE-01~07`。`P01/02`列用于contract类P0,`P03`用于controlled seam,`P04`用于operations simulation,`P05`用于candidate backend conformance,`P06/07`用于real-like / future deployment target。未写“启用”的能力默认不得因profile名称隐式开启。

#### 9.10.1 SBX-CP-01 启动装配与配置身份

| Domain | P01 / P02 | P03 | P04 | P05 | P06 / P07 | 跨Profile不变量 |
|---|---|---|---|---|---|---|
| D01 config source intake | P01 optional S02;P02 suite S02 / S06 | required controlled S02 | required simulation S02 | explicit candidate S02 / S03 | complete S02 / S03;P07 inactive | 仍由`infra/config.rs`唯一读取raw config;无overlay / reload。 |
| D02 runtime profile / config identity | 生成contract / run-scoped redacted identity | 生成seam identity | 生成simulation identity | 生成candidate / boundary identity | 生成real-like identity;P07仅目标 | 不含raw value;profile不能更改NCFG。 |
| D03 startup validation | strict validation + fixture scope检查 | strict binding / registry检查 | strict simulation handle / guard检查 | strict backend / capability / four-dimension检查 | complete dependency / secret / route检查 | 高层非法不fallback;hard guard失败不降级warning。 |
| D04 runtime builder / adapter registry | 只装配in-memory / non-executing fake | 装配controlled seam + fake execution | 装配simulation jobs / handles | 装配candidate backend,禁止fixture替代 | 装配qualified / approved refs | builder只消费validated refs且不创造truth。 |

#### 9.10.2 SBX-CP-02 入口与负载包络

| Domain | P01 / P02 | P03 | P04 | P05 | P06 / P07 | 跨Profile不变量 |
|---|---|---|---|---|---|---|
| D05 sync API envelope | deterministic body / page / timeout classes | controlled entry limits | query / job entry为主;sync API可选 | restricted conformance driver envelope | real-like strict envelope;P07 future | 不绕metadata、actor、policy、visibility、idempotency、redaction。 |
| D06 worker runtime envelope | disabled或fixture loop;CI deterministic | controlled consumer / relay loops | simulation feedback / relay loops | candidate lifecycle loop可选;ordinary bus可禁用 | real-like / future approved loops | loop只接validated handle,不得直读repo或raw config。 |
| D07 job runner envelope | manual / deterministic typed jobs | controlled adapter jobs | primary simulation job surface | bounded conformance jobs | scheduler-backed real-like / future jobs | typed spec和idempotency必需;S05受global ceiling约束。 |
| D08 feature assembly gate | 默认外围disabled,测试显式启用fixture能力 | 只启用被测seam | 只启用被测maintenance / relay | 只启用conformance所需外围能力 | 依赖完整后显式启用 | 不能关闭accepted、capture、audit、cleanup、redline或redaction。 |

#### 9.10.3 SBX-CP-03 存储、事务与重复回放

| Domain | P01 / P02 | P03 | P04 | P05 | P06 / P07 | 跨Profile不变量 |
|---|---|---|---|---|---|---|
| D09 truth / audit / UoW store | in-memory contract / run-isolated fake | isolated test or durable-like double | simulation state UoW | isolated conformance store | real-like durable / future approved | logical schema、expected version、cursor、audit atomicity一致。 |
| D10 projection / derived store | in-memory derived view | controlled seam projection | simulation / replay projection | conformance report projection only | real-like durable / future approved | query no-write、rebuild / derived no-truth-repair。 |
| D11 reference store | body-free fixture refs | controlled body-free summaries | replay / simulation refs | strict policy / capability fixture refs | real-like body-free store | external body和source truth不得入仓。 |
| D12 relay store | fake / asserted payload snapshot | controlled relay records | primary relay simulation | evidence event可controlled / disabled | real-like / future transport-backed | stored payload来源固定;publish failure不回滚source truth。 |
| D13 idempotency / stored surface store | deterministic duplicate / conflict cases | controlled receipt / replay | replay / recovery simulation | conformance run / job replay | durable parity / future approved | duplicate必须返回stored surface;retention不得破坏完整性。 |

#### 9.10.4 SBX-CP-04 外部语境、策略与能力摘要

| Domain | P01 / P02 | P03 | P04 | P05 | P06 / P07 | 跨Profile不变量 |
|---|---|---|---|---|---|---|
| D14 context reference source | deterministic body-free fixture | controlled resolver seam | simulation / replay summary | strict non-production context refs | real-like / future approved resolver | config不生成identity / work / runtime truth。 |
| D15 policy / authorization summary source | deterministic allow / deny / stale fixtures | controlled fail-closed seam | safety simulation summaries | strict conformance policy fixture / source | real-like / future approved source | policy / allowlist / approval truth外部拥有;missing / stale fail-closed。 |
| D16 backend capability source | deterministic capability fixture | controlled unavailable / stale seam | simulated capability / handle state | candidate real probe,核心输入 | qualified real-like / future approved probe | unsupported / stale不silent allow或fallback。 |

#### 9.10.5 SBX-CP-05 隔离边界与执行后端

| Domain | P01 / P02 | P03 | P04 | P05 | P06 / P07 | 跨Profile不变量 |
|---|---|---|---|---|---|---|
| D17 coherent boundary profile | strict fixture,仅验证decision contract | controlled validation seam | simulated guard / violation state | 对candidate backend真实验证四维enforcement | 只使用conformance-qualified / future approved profile | resource / fs / network / process整体成立,不能partial / best-effort。 |
| D18 isolation backend lifecycle | non-executing fake,real launch disabled | availability / error seam only | simulated handle / lifecycle only | candidate real launch / inspect / release | qualified real-like / future approved backend | P01~04禁真实代码;P05~07禁host-run / weak fallback。 |
| D19 execution capture | deterministic fake material refs | capture failure / partial seam | simulated capture / handoff state | candidate real bounded capture | real-like / future approved capture | process output不进truth / log;capture失败不伪success。 |
| D20 backend handle / lease consumption | fake handle refs only | controlled handle validation | simulated lease / handle | candidate real handle under conformance lease | qualified / future approved lease | handle不提供force release;cleanup / redline guard仍由CP-08拥有。 |

#### 9.10.6 SBX-CP-06 事件接入、发布与Relay

| Domain | P01 / P02 | P03 | P04 | P05 | P06 / P07 | 跨Profile不变量 |
|---|---|---|---|---|---|---|
| D21 inbound subscription / schema | disabled或fixture feed | controlled schema / quarantine seam | feedback / lifecycle simulation | candidate lifecycle source可选 | real-like / future approved subscriptions | schema / payload DTO不可配置;unsupported必须reject / quarantine。 |
| D22 event publisher adapter | fake / disabled | controlled publisher failure seam | fake / controlled relay simulation | controlled evidence publisher或disabled | real-like / future approved publisher | raw error不造domain state;publish failureno-rollback。 |
| D23 topic-neutral route binding | local asserted route map | controlled route completeness | simulation route map | conformance evidence routes only | complete real-like / future route map | route不改变event kind、schema、payload或cursor。 |
| D24 relay delivery / retry / dead-letter | deterministic retry cases | controlled delivery / DLQ seam | primary retry / dead-letter simulation | bounded evidence delivery | real-like / future approved delivery | duplicate不重建payload;DLQ不删source relay fact。 |

#### 9.10.7 SBX-CP-07 材料、观测与调查交接

| Domain | P01 / P02 | P03 | P04 | P05 | P06 / P07 | 跨Profile不变量 |
|---|---|---|---|---|---|---|
| D25 material handoff | fake / disabled | controlled target / receipt seam | simulated pending / retry / failed | controlled non-production evidence target | real-like / future approved target | receipt不升格artifact truth;failure不回滚run / capture。 |
| D26 observability material handoff | fake / disabled | controlled safe sink seam | simulated backpressure / feedback | required safe conformance target / sink | real-like / future approved target | 不保存observability ledger body,不替代formal audit。 |
| D27 investigation handoff | fake / disabled | controlled feedback seam | primary containment / investigation simulation | controlled security target fornegative cases | real-like / future approved target | ordinary receipt不能解除cleanup / redline guard。 |
| D28 handoff receipt / retry coordination | deterministic receipts | controlled retry / mismatch | primary retry / report simulation | bounded conformance retry | scheduler-backed / future approved | 保留failed fact且不修改source truth。 |

#### 9.10.8 SBX-CP-08 租约、清理、Reaper与Redline

| Domain | P01 / P02 | P03 | P04 | P05 | P06 / P07 | 跨Profile不变量 |
|---|---|---|---|---|---|---|
| D29 lease / orphan detection | deterministic fake lease / orphan | controlled lifecycle seam | primary simulated scan | candidate real inspection / orphan cases | scheduler / future approved inspection | expiry只触发guarded检查,不能直接delete / release。 |
| D30 cleanup guard evaluation | deterministic guard matrix | controlled dependency state | primary simulation,allblock reasons | candidate real handle,无破坏性cleanup越权 | real-like / future approved guarded cleanup | 无force-clean;missing evidence保持blocked。 |
| D31 backend release | fake outcome only | release failure seam | simulated release only | candidate real release under dedicated guard | qualified / future approved release | failure不得伪Released或切换弱backend。 |
| D32 redline containment / escalation | deterministic redline states | controlled target / feedback | primary containment simulation | negative conformance / escape-like containment | real-like / future approved escalation | containment不可disabled / advisory-only;release必须formal。 |

#### 9.10.9 SBX-CP-09 引用刷新、投影、派生与对账

| Domain | P01 / P02 | P03 | P04 | P05 | P06 / P07 | 跨Profile不变量 |
|---|---|---|---|---|---|---|
| D33 reference refresh | deterministic fixture refresh | controlled resolver refresh | primary replay / failed-item simulation | refresh candidate capability refs as needed | scheduled real-like / future | 只更新body-free reference state,不写core truth。 |
| D34 projection rebuild | deterministic rebuild | controlled store seam | primary stale / rebuild simulation | conformance report projection only | scheduled real-like / future | query不触发写,rebuild不修业务truth。 |
| D35 derived inspect / preview / trend | deterministic derived view | controlled comparison seam | primary simulation | backend comparison可作为conformance report | real-like / future derived surface | derived不成为truth或policy decision。 |
| D36 reconciliation report | deterministic findings | controlled dependency findings | primary no-auto-fix simulation | conformance finding report | real-like / future reporting | finding不升格accepted fact,不得自动repair。 |

#### 9.10.10 SBX-CP-10 可观测性、诊断与脱敏

| Domain | P01 / P02 | P03 | P04 | P05 | P06 / P07 | 跨Profile不变量 |
|---|---|---|---|---|---|---|
| D37 runtime log / metric | safe-local;CI断言forbidden fields | controlled safe sink seam | safe simulation logs / metrics | required conformance sink / diagnostics | real-like / future approved sink | sink / sampling exact carrier仍watch;不得输出raw / high-cardinality。 |
| D38 audit / trace hook | mandatory fake / in-memory formal audit | mandatory controlled persistence seam | mandatory formal safety audit | mandatory conformance audit | mandatory real-like / future audit | 任何profile不得disable accepted audit或用metric替代。 |
| D39 diagnostic issue | safe local / run-scoped diagnostic | controlled store / handoff | safe report / diagnostic refs | safe backend / boundary diagnostic refs | real-like / future approved surface | 只保存stable code、safe summary和refs。 |
| D40 redaction / safe output gate | strict;CI做negative assertion | strict,无debug relax | strict,raw historical body禁止 | strict,provider / backend response禁止 | strict,无profile例外 | local / test / conformance都不能放宽redaction。 |

#### 9.10.11 SBX-CP-11 环境与Deterministic Test Profile

| Domain | P01 / P02 | P03 | P04 | P05 | P06 / P07 | 跨Profile不变量 |
|---|---|---|---|---|---|---|
| D41 profile composition | exact P01 / P02 composition | exact P03 | exact P04 | exact P05 | exact P06;P07 inactive target | 只组合已定义domain,不重定义source priority / guard。 |
| D42 deterministic fixture / fake | allowed;P02通常required | bounded controlled fixture | required simulation fixture | prohibited asbackend / capability / secret replacement | prohibited | fake遵守state / transaction / replay / redaction parity。 |
| D43 real-like / production-like composition | not applicable | not applicable | not applicable | candidate-real composition subset | P06 real-like;P07 future approved | required binding缺失不得fallback fake / host-run。 |
| D44 future overlay / reload trigger | current non-config | current non-config | current non-config | current non-config | current non-config until redesign | 任何profile均不得启用S07 / S08 / reload / overlay。 |

### 9.11 Profile停审记录

| Profile | Source / dependency清楚 | 真实Workload资格清楚 | 敏感配置清楚 | 测试 / 验收承接清楚 | 结论 / 缺口 |
|---|---:|---:|---:|---:|---|
| PROFILE-01 local-contract | 是 | 是,禁止 | 是 | 是 | 通过;只证明local contract。 |
| PROFILE-02 ci-contract | 是 | 是,禁止 | 是 | 是 | 通过;只证明deterministic contract / negative behavior。 |
| PROFILE-03 integration-seam | 是 | 是,禁止 | 是 | 是 | 通过;接缝不等于backend安全。 |
| PROFILE-04 operations-simulation | 是 | 是,禁止 | 是 | 是 | 通过;simulation不操作真实资源。 |
| PROFILE-05 backend-conformance | 是 | 是,仅bounded conformance | 是 | 是 | 设计定义通过;资格未满足,当前无真实evidence。 |
| PROFILE-06 staging-like | 是 | 是,条件允许 | 是 | 是 | 设计定义通过;资格未满足,依赖P05未来资格和real-like binding。 |
| PROFILE-07 production-like | 目标边界清楚 | 当前禁止 | 目标边界清楚 | 未来承接清楚 | 目标边界通过;inactive target,不得当前激活。 |

### 9.12 跨Profile审计表

| 审计项 | 结论 | 修正 / owner口径 | unresolved缺口 |
|---|---|---|---|
| local / CI是否可执行真实workload | 否 | P01 / P02只允许non-executing fake | 无 |
| seam test是否被当作backend安全证明 | 否 | P03与P05分离 | 无 |
| operations simulation是否操作真实handle / cleanup | 否 | P04只使用simulation refs / handles | 无 |
| candidate backend是否可进入ordinary CI | 否 | P05需要dedicated conformance environment | 环境 /产品待`07`确认 |
| backend capability不足是否可换弱profile | 否 | P05~07全部no weak fallback | 无 |
| profile是否改变NCFG / source priority | 否 | P01~07复用CAT / NCFG / S01~S08 | 无 |
| S06是否污染candidate / staging / production | 否 | P05~07明确禁止S06 | 无 |
| S04真实material是否进入P0 contract profile | 否 | P01~04禁S04真实material | 无 |
| staging是否被声明P0 must-pass | 否 | P06为P1 conditional | 无 |
| production是否被声明active / ready | 否 | ENV-07当前not applicable;P07 inactive target | 无 |
| P0同部署是否混淆运行职责 | 否 | 角色矩阵保留entry / worker / execution / jobs / state / backend / handoff | 无 |
| profile是否锁定后端 / store / bus产品 | 否 | 仅mode与资格,保持product-neutral | 产品待`07` / ADR |
| D01~D44是否全覆盖 | 是 | §9.10每域恰有一行 | 无 |
| D37 carrier是否被profile矩阵伪造 | 否 | 仅定义safe sink mode,exact carrier留Step 7 | watch |
| secure resolver是否被假定已实现 | 否 | P05~07只定义资格;exact binding留Step 8前复核 | watch |
| D44 overlay / reload是否进入任一profile | 否 | 全profile current non-config | watch / P2 trigger |
| 是否需要回写`03` | 未发现 | profile使用opaque`SandboxRuntimeProfileRef`,不新增enum / port | watch项触发时先回写 |

### 9.13 Historical Material冲突记录

| Historical material | 冲突 | 当前处理 |
|---|---|---|
| 旧`05` dev `local host runtime` | 违反宿主直跑零容忍和P0 fake边界 | 不继承;P01明确real workload forbidden。 |
| 旧`05` staging `real-like host runtime` | 未证明coherent boundary且可能绕过candidate backend conformance | 不继承;P05独立conformance,P06仅conditional。 |
| 旧`05` `cleanup disabled by default` | 违反cleanup / reaper / redline核心安全闭环 | 不继承;所有profile保持guard,仅外围target可disabled。 |
| 旧`05/06` capability allowlist本地配置 | policy / allowlist truth不归sandbox | 不继承;profile只绑定body-free summary source且fail-closed。 |
| 旧`05/06`旧session / command / output对象矩阵 | 与当前`00~03`主语和协议不一致 | 不继承;后续`05/06`必须按当前profile和正式对象重建。 |
| 旧staging smoke / E2E门禁 | 无真实run、evidence或当前profile资格 | 只作historical direction;不得引用为当前通过结论。 |

### 9.14 对下游文档的影响总表

| 下游文档 | 从本 Step接收什么 | 本 Step不提供什么 |
|---|---|---|
| `04` Step 7 | ENV-01~07、PROFILE-01~07、source / adapter / domain profile矩阵和真实workload资格 | raw key、类型、默认数值、required item和JSON demo尚未定义。 |
| `04` Step 8 | P01~04禁真实S04、P05~07 opaque ref -> S04边界 | provider port / product、读取、轮换和审计尚未定义。 |
| `04` Step 9~11 | startup / loop / run冻结、profile activation reject和dependency unavailable方向 | loader函数、validation message、change / failure完整矩阵尚未定义。 |
| `05-测试方案.md` | contract / seam / simulation / conformance / staging分层和negative boundary矩阵 | 不提供TC编号、run_id、evidence或通过结论。 |
| `06-验收标准.md` | fake不可证明隔离、P05资格、P06 / P07 activation veto方向 | 不提供阈值、evidence alias、签署或risk acceptance。 |
| `07-实施计划.md` | profile wiring、dedicated conformance environment和staging / production precheck边界 | 不提供phase / commit、实现仓状态、implementation ledger或planned skeleton。 |
| 部署与运维手册 | P05~07需要外部backend / state / event / target / secret / sink角色 | 不提供产品、拓扑、命令、容量、发布或runbook。 |

---

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响`03` | 影响类型 | `03`回写位置 | 处理状态 |
|---|---:|---|---|---|
| 7个profile使用opaque`SandboxRuntimeProfileRef`组织既有binding | 否 | 配置矩阵语义 | 不适用 | 无回写 |
| P01~04使用non-executing fake且禁止真实workload | 否 | 强化no host-run和fake parity | 不适用 | 无回写 |
| P05独立为candidate backend conformance profile | 否 | 组合既有capability / backend / boundary / capture / release ports | 不适用 | 无回写 |
| P06 conditional,P07 inactive target | 否 | 范围 / 资格裁剪 | 不适用 | 无回写 |
| profile与adapter mode、environment和deployment role分离 | 否 | 配置语义澄清 | 不适用 | 无回写 |
| S04 secure resolver exact binding | 尚未 | Step 8前watch | 不适用 | watch_no_writeback |
| D37 sink / sampling exact carrier | 尚未 | Step 7 watch | 不适用 | watch_no_writeback |
| 未来profile需要runtime enum、dynamic replacement、overlay或reload | 是 | config / builder / flow / audit契约变化 | `03` §4 / §5 / §9 / §13 / §14及Step 14 / 15 | 触发时阻塞并先回写 |

本 Step当前没有`待回写`或`阻塞待确认`项。Step 7 / 8如果profile配置项无法由现有opaque refs和builder承载,必须先回写`03`。

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_06_environment_profiles_matrix.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Environment适用性表”“Profile总表”“Profile激活门禁与真实Workload资格”“配置来源矩阵”“部署角色矩阵”“外部依赖与Adapter Mode矩阵”“按配置域组织的Profile差异矩阵”和“跨Profile审计表”,了解contract环境与真实隔离资格为何分层。

正式`04-配置设计.md` §6应回填:

- environment、runtime profile、adapter mode、eligibility和deployment topology概念分离。
- ENV-01~07适用性与PROFILE-01~07总表。
- profile激活门禁和真实workload资格。
- source、部署角色、external dependency / adapter、sensitive配置矩阵。
- profile测试 / 验收 / 实施承接矩阵。
- D01~D44 profile差异矩阵、停审、跨profile审计和historical conflict。

回填要求:

- 不得把P01~04写成可执行真实workload或真实隔离证明。
- 不得把P05写成已有candidate backend / evidence / qualification。
- 不得把P06写成P0 must-pass或已部署staging。
- 不得把P07写成active production / ready / accepted。
- 不得复活host runtime、cleanup disabled、local allowlist truth或旧对象矩阵。
- 不得为profile名称新增`03`未定义的enum / port / dynamic branch。

---

## 12. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| serialized profile key / value是否直接使用logical name | 影响Step 7 JSON demo和compatibility | Step 7定义;若需要code enum先回写`03`。 |
| P01~04 non-executing fake exact contract | 影响实现是否可能意外spawn宿主process | Step 7列binding项,`05/06`转negative veto。 |
| candidate backend产品、dedicated environment和capability matrix | 影响P05可实施 / 可测试性 | 保持product-neutral;`07` / ADR确认,当前not qualified。 |
| four-dimension conformance case和通过阈值 | 影响P05资格与P06 activation | `05/06`定义,不在本步伪造。 |
| durable store / bus / resolver / targets / scheduler / sink产品 | 影响P06 / P07 | Step 13 / 14和`07`登记,当前不锁定。 |
| S04 secure resolver exact port / provider | 影响P05~07启动 | Step 8前复核,必要时先回写`03`。 |
| D37 sink / sampling exact carrier | 影响P01~07观测配置项 | Step 7复核。 |
| P0是否需要额外destructive cleanup lab | 可能影响真实cleanup / reaper安全验证 | 当前不新增profile;若P05不足,Step 14登记风险并交`05/07`裁决。 |

---

## 13. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| local / CI / test / staging / prod适用性已明确 | 通过 | 见ENV-01~07;prod当前不适用。 |
| P0 / P1 profile差异已定位 | 通过 | P01~04 P0,P05~06 P1,P07 target。 |
| profile配置来源已明确 | 通过 | 见§9.5。 |
| profile部署角色与外部依赖已明确 | 通过 | 见§9.6 / §9.7。 |
| 敏感配置处理已按profile标注 | 通过 | 见§9.8。 |
| 真实workload资格已明确 | 通过 | P01~04禁止,P05 bounded,P06 conditional,P07当前禁止。 |
| 测试 / 验收 / 实施承接已明确 | 通过 | 见§9.9。 |
| D01~D44 profile差异全覆盖 | 通过 | 见§9.10。 |
| profile停审与跨profile审计无unresolved冲突 | 通过 | 见§9.11 / §9.12。 |
| 对`03`影响判定已记录 | 通过 | 当前无具体回写;S04 / D37 / D44为watch。 |
| 可进入 Step 7 | 通过 | 用户已确认本Step;Step 7已按门禁创建并完成,当前等待Step 7审查。 |
