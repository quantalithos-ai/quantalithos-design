# Step 2. 明确验收目标与范围

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 2
> 书写规范: `standards/document/验收标准书写规范.md`
> 回填章节: `06-验收标准.md` §2 验收目标与范围
> 生成日期: 2026-07-14
> 状态: completed_reviewed_passed_to_step_3
> 所属流程: `06_acceptance_calibration_flow.md`
> 本Step口径: 只定义本轮验收裁决目标、P0 / P1 / P2范围、P0-C / P0-Q不可替代关系、只验接缝能力、非范围影响、正式词汇约束和VETO候选;不固定送验基线、不生成逐条验收项、不填写runtime EV、结果、风险接受、结论或签署,不修改旧正式`06`。

---

## 1. Step状态与Step内计划

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 1 | 是。用户明确回复“同意”;Step 1、flow和项目台账已切换为`passed_to_step_2`。 |
| 项目 /文档 /Step门禁 | 通过。项目级和文档级均只允许Step 2;正式`06`仍禁止写入。 |
| 是否读取Step 2标准 | 是。已读取验收SOP Step 2和书写规范§5.2。 |
| 是否读取范围输入 | 是。已复核Step 1、正式`00`目标 /非目标 /功能 /AC /VF /风险、`01`职责 /依赖 /红线、`03`协议 /状态、`04`PROFILE /VETO和`05`范围 /进出 /residual。 |
| 是否读取粒度参考 | 是。已读取L1-governance、L1-artifact验收Step 2;只参考结构与粒度。 |
| 旧正式`06`定位 | historical material。旧五段主线、十章结构、泛化功能 /环境 /证据范围不进入当前结论。 |
| 是否发现阻塞本Step的上游blocker | 否。正式`00~05`对核心 /外围、双P0轴、接缝、非范围和否决来源已有稳定结论。 |
| 当前状态 | Step 2全部小阶段和自检已完成;用户已明确确认并放行Step 3。 |

### 1.1 Step内计划

| 计划项 | 状态 | 可审查产物 /完成门禁 |
|---|---|---|
| 恢复三层状态并读取输入 | done | §2~§3;Step 1放行和正式范围来源明确 |
| 回答SOP六问 | done | §4;核心目标、优先级、接缝、非范围、VETO和正式词汇逐项回答 |
| 诊断旧正式`06` | done | §5;旧主语、范围、环境、NFR和证据污染隔离 |
| 完成裁决取舍 | done | §6~§7;双P0轴、条件激活、unsupported重开和编号命名空间明确 |
| 形成结构化中间产物 | done | §8;目标、范围、Profile、接缝、非范围、VETO、正式词汇和风险范围 |
| 形成§2回填草稿 | done | §10只摘录已推导范围结论,未写正式`06` |
| 自检并停审 | done | §12~§13;gate=`pass_wait_review`,不得进入Step 3 |

### 1.2 模块级门禁

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| M1 核心目标与P0双轴 | done | done | done | done | done | pass | pass | 由M2接续 |
| M2 P1 / P2、Profile与升级规则 | done | done | done | done | done | pass | pass | 由M3接续 |
| M3 相邻仓接缝与非范围影响 | done | done | done | done | done | pass | pass | 由M4接续 |
| M4 VETO候选、词汇与编号边界 | done | done | done | done | done | pass | passed_to_step_3 | 用户已确认;由Step 3接续 |

---

## 2. 本步目标与边界

本Step把Step 1已经确认的输入转成一张可裁决范围图。它不回答“某条验收项是否通过”,而是先固定“哪些主题必须有裁决”“哪些能力只验Sandbox接缝”“哪些未覆盖项会阻断核心结论、影响目标阶段或只进入残余风险”。

本Step必须形成:

- 一条不会退化为“能跑命令”的核心验收目标。
- P0-C、P0-Q、P1和P2在验收结论中的地位及不可替代关系。
- 覆盖execution environment identity、四维coherent boundary、launch policy、capture、observability、failure、cleanup / reaper和redline的范围主表。
- 55协议、31个canonical状态enum entry /30个owner-level machine及关键字段 /owner语义必须使用正式名称的约束。
- 相邻仓与外部能力只验接缝的边界。
- 非范围缺失对核心P0、目标阶段、风险接受和设计重开的不同影响。
- VF-SBX-001~010、VETO-CFG-01~16与范围项的候选映射。

本Step不形成:

- 不固定design / implementation revision、ENV实例、config digest、DS manifest、`run_id`或fixed report。
- 不为Step 5~10提前生成逐条通过条件、失败条件和runtime evidence绑定。
- 不分配`EV-SBX-*`,不把ESLOT、AHG或EHR改名为真实证据。
- 不裁决RR-SBX-001~008是否接受,不填写接受人、期限或签署。
- 不选择backend、provider、store、bus、sink、alert或retention介质产品。
- 不创建正式`07`、implementation ledger或planned boundary skeleton。

---

## 3. 本步输入

| 输入 | 当前状态 | 本Step用途 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | reviewed | 提供权威输入、证据成熟度、必须 /不再回答问题和基线待固定项 |
| `00-需求文档.md` §2 / §4 / §7 / §9 | current reviewed | 提供Sandbox定位、目标 /非目标、C-SBX-1~5、FR-SBX-001~018和FR-SBX-E01~E06 |
| `00-需求文档.md` §13~§15 | current reviewed | 提供六类NFR、AC-SBX-001~041、VF-SBX-001~010、风险和后续触发 |
| `01-架构设计.md` §4 / §8 / §9 / §13 | current reviewed | 提供职责、依赖裁剪、数据所有权、coherent boundary、fail-closed、capture / handoff、cleanup / redline和派生no-write |
| `03-详细设计.md` §6~§12 | current reviewed | 提供55协议、30个owner-level state machine /31个canonical enum entry /39个shared status declaration、事务、幂等、并发和38 typed error正式词汇 |
| `04-配置设计.md` §6 / §12 / §14 | current reviewed | 提供PROFILE-01~07证明上限、AHG / EHR、VETO-CFG-01~16和激活风险 |
| `05-测试方案.md` §2~§3 | current reviewed | 提供P0-C / P0-Q / P1 / P2、SCP-SBX-001~036、相邻仓接缝和正式对象闭集 |
| `05-测试方案.md` §11~§14 | current reviewed | 提供S / A / B、250 P0退出、当前readiness、evidence和RR-SBX-001~008 |
| 旧`06-验收标准.md` | historical material | 只做范围污染诊断;不得继承旧主语、旧阈值或空结论 |
| L1-governance / L1-artifact验收Step 2 | granularity reference | 参考目标、范围、接缝、优先级、VETO和停审结构 |

---

## 4. SOP问题回答

| SOP问题 | 回答 |
|---|---|
| 本轮验收的核心裁决目标是什么? | 裁决某一固定送验交付是否真正形成`L4-sandbox`统一受控执行隔离基础:正式语境与execution environment identity成立;resource / filesystem / network / process形成同代coherent boundary;给定launch policy按fail-closed执行;run / capture / handoff与observability材料分层;failure、lease、cleanup / reaper和redline保守收束;且不吞并相邻仓truth。 |
| P0 / P1 / P2验收范围如何划分? | P0由正交的P0-C与P0-Q组成。P0-C裁决协议、对象、状态、事务、幂等、配置、失败、安全、接缝和证据完整性;P0-Q裁决固定candidate real backend在dedicated environment内真实落实四维边界、lifecycle / capture / release、cleanup / redline和no-host-fallback。P1默认覆盖PROFILE-06 real-like / durable组合、真实provider / sink / alert、跨仓联合与物理change / rollout;P2默认覆盖PROFILE-07、production、容量 /硬SLO / DR和FR-SBX-E01~E06外围增强。 |
| 哪些下游能力只验接缝? | tools、runtime、member-service、identity / work、policy / governance / capability、artifact / archive、observability、investigation、runner / console及isolation backend / provider均只验typed ref、body-free summary、protocol、adapter outcome、event / handoff marker、failure mapping和truth ownership边界;不验对方完整内部状态机、业务语义、产品UI或控制面。 |
| 哪些非范围会影响最终结论? | P0-C或P0-Q缺失不是可接受非范围,会使整体P0不可通过。未激活P1 / P2默认不补偿也不阻断核心P0,但必须在handoff中显式披露;若送验声明、目标阶段、合同或正式profile激活要求它们,对应项升级为本轮mandatory scope。当前unsupported surface一旦出现不进入风险接受,而是DesignReopen。 |
| 哪些范围项可能成为一票否决? | C-SBX-1~5断裂、宿主 /旁路 /匿名formal success、四维边界partial / silent degrade、policy fail-open、外部正文或raw secret入仓、capture / receipt升格下游truth、cleanup先删材料、orphan / redline脱管、第二truth writer / duplicate重算、关键追溯缺口,以及VETO-CFG-01~16覆盖的weak fallback、partial generation、audit替代、no-write / no-repair和unsupported伪成功。 |
| 哪些验收范围必须使用详细设计正式字段、状态或接口名? | 全部10 Command、13 Query、9 Consumer、13 Outbound Event、10 Operations Job;30个owner-level state machine的31个canonical status enum entry及owner内variant,并区分39个shared status declaration;38 typed error;`context_ref` / caller refs、`request_digest`、`expected_version` / repository version、truth / reference / page cursor、capture / handoff / downstream truth、profile / config generation / qualification identity等不可互换字段。 |

---

## 5. 当前文档与historical material问题诊断

| 位置 /材料 | 当前问题 | 本Step处理 |
|---|---|---|
| 旧正式`06` §1~§4 | 围绕CreateSession / AttachSession / ApplyIsolationPolicy / RunCommand / Output / Control旧对象,无法覆盖新版identity、coherent boundary、55协议、状态、配置和evidence | 全部降级historical;按正式`00~05`重建验收范围 |
| 旧正式`06`验收范围 | 功能 /非功能 /三红线简单分组,没有P0-C / P0-Q不可替代关系 | P0拆成两个正交必要证明轴,但仍保持单一P0优先级 |
| 旧正式`06`环境范围 | test / staging泛化,未说明fake、simulation、candidate-real和production证明上限 | 使用PROFILE-01~07正式成熟度,不把低profile结果升格 |
| 旧正式`06`非功能范围 | 旧100%、阈值内和benchmark表达没有正式负载 /产品 /基线来源 | 零容忍与结构有界进入P0;量化阈值保持P1 / P2 conditional |
| 旧正式`06`下游范围 | artifact、observability、runtime和provider容易被当作Sandbox内部验收主体 | 只验接缝和no-ownership-transfer;完整内部truth回各自owner |
| 旧正式`06`风险范围 | 多集群、provider bridge、大输出被预填接受方向,无激活和失效规则 | 使用RR-SBX-001~008作为Step 13输入,本Step只决定默认范围和升级触发 |
| 正式`05` | 测试范围已稳定,但测试优先级 /状态不能直接等同验收结论 | 本Step把证明范围转成裁决范围,仍由Step 3~14固定基线和结论规则 |

---

## 6. 改动前后对比

| 维度 | 旧口径 | 本Step收稳后的口径 | 原因 |
|---|---|---|---|
| 核心裁决 | 会话、命令、输出能否工作 | 完整受控执行隔离闭环与truth ownership是否成立 | 对齐C-SBX-1~5和用户重点边界 |
| P0 | 泛化功能 /安全 | P0-C contract / invariant + P0-Q real boundary qualification双轴 | fake / simulation不能证明真实隔离 |
| P1 / P2 | test / staging /后续增强混写 | P1 real-like / physical integration;P2 production / hard SLO / peripheral;均有激活升级规则 | 防止默认阻塞或伪造ready |
| 协议 /状态 | 旧对象与口语状态 | 55正式协议、31 canonical enum entry /30 owner-level machine /39 shared declaration、38 typed error及owner词汇 | 保证后续验收项可落码 /可复验 |
| 下游能力 | 容易要求完整跨仓E2E | 只验Sandbox接缝、failure surface和no truth ownership | 保持仓级裁决边界 |
| 非范围 | 简单列“后续处理” | 区分不影响核心、影响目标阶段、必须披露、DesignReopen和不可接受缺口 | 支撑三值结论而不模糊化 |
| VETO | 旧安全 /治理口语门禁 | VF-SBX和VETO-CFG双来源候选,Step 11统一裁决但不合并来源编号 | 保持需求与配置真相源 |

---

## 7. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| P0-Q是否可作为P1 | 保持P0-Q为核心P0必要轴 | 因PROFILE-05配置成熟度为P1而把真实边界资格降为P1 | 配置引入阶段与验收核心风险是不同轴;Sandbox必须证明真实隔离 |
| P0-C能否替代P0-Q | 不能;二者正交且整体P0必须分别闭合 | fake / controlled / simulation绿色即核心通过 | 低profile只能证明契约语义,不能证明四维边界实际生效 |
| P1 / P2是否永不影响结论 | 默认不阻断核心P0,但正式声明 /激活后升级为mandatory scope | 永久忽略;或全部作为当前P0前置 | 前者允许过度声明,后者在无产品 /基线时伪造范围 |
| unsupported surface如何处理 | P0负向验证当前不存在 /声明拒绝;出现即DesignReopen | 当P2 future或普通residual接受 | remote / reload / hot等会改变public contract、状态和安全语义 |
| 相邻仓完整E2E | Sandbox只验接缝;联合验收要求出现时激活P1范围 | 默认验所有相邻仓内部主线 | 避免Sandbox验收越权拥有tools / runtime / member等truth |
| 量化性能 | P0裁决结构有界和零容忍;硬SLO需正式workload / baseline后激活 | 继承旧Docker / gVisor /白名单数字 | 旧数字无当前产品、负载和误差来源 |
| 需求AC与验收项编号 | `AC-SBX-001~041`保持canonical需求锚点;细分项只用类别化子命名空间并回指canonical AC | 复用同号改变语义;或重编号覆盖需求AC | 防止两份同名不同义的验收真相源 |
| VF与VETO-CFG编号 | 保留两套来源编号;Step 11再分配`VETO-SBX-*`裁决索引并保持双向映射 | 现在合并 /重编号或提前写结论 | 本Step只确定范围候选,不越级定义最终否决表 |

---

## 8. 结构化中间产物

### 8.1 验收目标

| 目标ID | 验收目标 | 正式来源 | 本轮裁决焦点 |
|---|---|---|---|
| AG-SBX-01 | 证明统一受理、execution environment identity和责任链成立 | C-SBX-1;FR-SBX-001~003;AC-SBX-001 /006~008 /026 | 正式入口唯一;必需actor / context / responsibility refs闭合;missing / conflict显式拒绝;无匿名 /旁路formal success |
| AG-SBX-02 | 证明coherent boundary裁定与真实落实成立 | C-SBX-2;FR-SBX-004~006;AC-SBX-002 /009~011 /027;VF-SBX-002 /003 | P0-C证明裁定与拒绝语义;P0-Q证明resource / filesystem / network / process真实同代落实;任一unsupported整体拒绝 |
| AG-SBX-03 | 证明给定launch / isolation policy执行与fail-closed成立 | C-SBX-3;FR-SBX-007~010;AC-SBX-003 /012~015 /028;VF-SBX-004 | 只消费body-free policy / authorization summary;missing / stale / conflict / unsupported / unauthorized均不launch;不反向拥有policy truth |
| AG-SBX-04 | 证明run、capture、material / observability handoff分层成立 | C-SBX-4;FR-SBX-011~014;AC-SBX-004 /016~019 /029;VF-SBX-006 | capture truth独立保留;candidate / receipt不升格;handoff失败不回滚source或伪造下游accepted truth |
| AG-SBX-05 | 证明failure、control、lease、cleanup / reaper和redline保守收束成立 | C-SBX-5;FR-SBX-015~018;AC-SBX-005 /020~023 /030;VF-SBX-007 /008 | typed failure稳定;duplicate control收束;stop-new-use;guard先于破坏动作;orphan托管恢复;redline contained且不可advisory / auto-release |
| AG-SBX-06 | 证明全协议、状态、事务、幂等、并发和stored replay可裁决 | `03` §7~§12;AC-SBX-031 /040;VF-SBX-009 | 55协议逐项存在;31 canonical enum entry按30 owner-level machine合法迁移;accepted UoW、version、digest、duplicate、commit unknown、19 race和no second writer成立 |
| AG-SBX-07 | 证明配置、profile、sensitive material和generation安全闭环成立 | `04` §3~§11;AHG-01~19;VETO-CFG-01~16 | strict source / schema / composition;complete same-generation;no raw output;hard guard不被degraded / change / rollback / migration放宽 |
| AG-SBX-08 | 证明formal audit、safe observability、redaction与证据真实性成立 | AC-SBX-035 /039 /041;`03` §14;`04` SEC / ALC;`05` §13 | accepted truth与formal audit同UoW;safe hook与durable audit分层;raw / secret零泄漏;fixed raw / report / digest / review不可静态伪造 |
| AG-SBX-09 | 证明依赖裁剪、产品中立和相邻仓非职责成立 | AC-SBX-031~035;`01` §4 /§8 /§9;VETO-CFG-04 /13 /16 | 仅`core-contracts`为sibling compile dependency;外部正文不入仓;tools / runtime / member / artifact / observability / policy truth不归Sandbox |
| AG-SBX-10 | 证明P0-C与P0-Q双轴均有有效固定证据,且VF / VETO无命中 | `05` §2 /§12 /§13;250条P0;VF-SBX;VETO-CFG | 237 P0-C和13 P0-Q分别闭合;Blocked / Failed / missing不能被P1/P2、重跑或静态报告补偿 |
| AG-SBX-11 | 诚实限定未激活的P1 / P2、外围增强和运营资格 | FR-SBX-E01~E06;PROFILE-06 /07;RR-SBX-001~008 | 不把未送验能力写成通过;一旦送验声明或正式激活条件触发,先升级范围或DesignReopen再裁决 |

核心裁决目标可压缩为:

```text
fixed delivery identity
  -> P0-C proves formal sandbox semantics and invariants
  -> P0-Q proves the fixed candidate enforces real four-dimensional isolation
  -> fixed evidence proves both axes without substitution or fabrication
  -> VF / VETO audit proves no safety or truth redline is hit
  -> only then may the delivery enter the overall acceptance decision
```

关键说明:

- 图中顺序表示裁决依赖,不是实现phase、运行时调用时序或测试执行脚本顺序。
- P0-C与P0-Q均属于P0;`C` / `Q`只是证明轴标签,不创建新的业务优先级。
- P1 / P2不得回填P0缺口;被送验声明激活后必须按其自身证据裁决。
- 当前无fixed delivery或runtime evidence,因此本图只定义未来裁决范围,不表示任何节点已通过。

### 8.2 优先级与结论地位

| 优先级 /证明轴 | 默认验收地位 | 必须裁决的内容 | 缺失 /失败对结论的影响 | 不可替代关系 |
|---|---|---|---|---|
| P0-C | 核心mandatory | 正式协议、对象、状态、事务、幂等、配置、failure、安全、接缝、NFR结构与evidence integrity | 任一适用项Failed / Blocked / missing使P0-C不成立;整体不得通过 | 不证明candidate backend真实隔离 |
| P0-Q | 核心mandatory | 固定candidate、capability、template、PROFILE-05、dedicated environment、provider适用身份下的四维隔离、lifecycle / capture / release、cleanup / redline和no substitution | 前置不全只能Blocked且0 launch;Failed / Blocked / missing使整体P0不成立 | 不由P0-C、PROFILE-06、seam、设计表或单次smoke替代 |
| P0整体 | 总体通过硬前提 | P0-C与P0-Q分别闭合;250条P0证据有效;VF / VETO无命中;无open S / A | 不满足时不得形成“通过”;具体三值传播由Step 12~14定义 | P1 / P2不能补偿 |
| P1默认 | conditional / residual | PROFILE-06 durable / real-like组合、真实provider / sink / alert、跨仓联合E2E、physical rollout / rollback / drift、soak等 | 未激活时不阻断核心P0,但必须披露为未证明范围;激活后缺失 /失败影响声明目标的放行 | 不等于production资格 |
| P2默认 | future / inactive | PROFILE-07、production topology、容量 /硬SLO / DR、多后端 /多宿主和FR-SBX-E01~E06外围增强 | 未声明时不参与核心结论;若送验宣称production /对应能力,当前必须DesignReopen而非直接有条件通过 | 不由P0 / P1自动推导 |

范围升级规则:

| 触发 | 原范围 | 升级结果 | 必需动作 |
|---|---|---|---|
| 送验说明宣称PROFILE-06、durable parity、real-like E2E或selected composition | P1 conditional | 当前送验mandatory scope | Step 3固定composition和run;Step 4要求证据;缺失不得宣称对应资格 |
| 送验说明宣称跨仓联合、真实sink / alert响应、physical rollout / rollback / drift或long soak | P1 conditional | 对应目标mandatory scope | 固定外部baseline、owner、证据和失败传播;不能只写residual |
| 合同 /法规 /审计要求固定数值SLO、retention TTL或介质 | P1 / P2 candidate | 当前送验mandatory scope | 先固定权威阈值、workload、误差或介质策略;无来源不得判通过 |
| 送验说明宣称PROFILE-07、production ready、容量 / DR或FR-SBX-E01~E06已交付 | P2 future | 当前设计不支持直接验收 | 先回写`00~04`,重开`05/06/07`;当前验收不得接受该声明 |
| 当前unsupported的S07 / S08 / reload / LKG / partial / hot / immediate callback surface实际出现 | negative P0 absence | DesignReopen blocker | 停止验收;回写`03/04/05`,不得按P2或风险接受处理 |

### 8.3 验收范围主表

`ASCP-SBX-*`只标识本Step的acceptance scope item,不是验收项、测试用例、evidence alias或结论ID。

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 正式来源 | 非范围 /说明 |
|---|---|---|---|---|---|
| ASCP-SBX-001 execution identity与统一受理 | core truth | P0-C | `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、resolution、actor / responsibility / caller refs、唯一入口和formal reject成立 | C-SBX-1;SCP-SBX-001;AC-SBX-001 /006~008 /026 | 不验identity / work / runtime / member正文与生命周期 |
| ASCP-SBX-002 coherent boundary裁定 | domain invariant | P0-C | resource / filesystem / network / process requirement、capability与decision组成同代整体;任一unsupported无partial allow | C-SBX-2;SCP-SBX-002;AC-SBX-002 /009~011 /027 | 不锁定backend产品,不把fake outcome当真实限制 |
| ASCP-SBX-003 candidate真实四维隔离资格 | qualification | P0-Q | 固定candidate在PROFILE-05 / dedicated lab真实阻断forbidden probe,落实resource limit且无host / fake / fixture替代 | SCP-SBX-003 /030;SUITE-SBX-013;ESLOT-SBX-017 /019 | 不证明staging / production /其他candidate或其他template |
| ASCP-SBX-004 policy适用与launch enforcement | security truth | P0-C +适用P0-Q | body-free policy / authorization summary、freshness、high-risk decision和fail-closed成立;真实launch无旁路 | C-SBX-3;SCP-SBX-004 /005;AC-SBX-003 /012~015 /028 | 不验policy DSL、approval、allowlist或tool semantic execution |
| ASCP-SBX-005 run、capture与handoff | execution / material truth | P0-C + P0-Q | 正式run状态、capture complete / partial / failed、candidate refs、handoff pending / delivered / failed / retryable分层且no rollback | C-SBX-4;SCP-SBX-006 /008;AC-SBX-004 /016~019 /029 | 不裁决Artifact、formal evidence或observability store最终truth |
| ASCP-SBX-006 failure与control | safety truth | P0-C + P0-Q | 38 typed error、FailureClassification、ControlFact、timeout / kill / resource exceed / backend / capture failure、duplicate / conflict和safe public surface成立 | C-SBX-5;SCP-SBX-006 /007 /020;AC-SBX-020 /022 /037~041 | 不推进runtime recover或member host failure truth |
| ASCP-SBX-007 lease / orphan / cleanup / reaper | lifecycle safety | P0-C + P0-Q | lease expiry stop-new-use、orphan inspected、CleanupGuard missing默认blocked、reaper不绕guard、release失败不伪Released | SCP-SBX-010 /011;AC-SBX-005 /023 /030 /038~041 | simulation只证明语义,真实资源处置由P0-Q证明 |
| ASCP-SBX-008 redline containment与调查交接 | security safety | P0-C +适用P0-Q | redline detected -> contained -> handoff marker;receipt不解除containment;未闭合调查时cleanup blocked | SCP-SBX-012;AC-SBX-005 /021 /030 /038~041 | 不验外部调查正文、case lifecycle或解除审批内部流程 |
| ASCP-SBX-009 Command协议族 | mutation protocol | P0-C | 10 Command逐项验证metadata、正式字段、accepted / rejected、idempotency、expected_version、UoW、audit与stored result | `03` §7.3;SCP-SBX-013;ESLOT-SBX-008 | 不抽样删除协议,不指定HTTP / RPC产品路由 |
| ASCP-SBX-010 Query协议族 | read protocol | P0-C | 13 Query逐项验证visibility、missing / stale / degraded / empty、page surface和zero write | `03` §7.4;SCP-SBX-014;ESLOT-SBX-007 /008 | Query不refresh / rebuild / retry / cleanup / append audit |
| ASCP-SBX-011 Inbound Consumer协议族 | event seam | P0-C | 9 Consumer逐项验证trusted source、schema / version、body-free payload、dedup、receipt和delayed / quarantined | `03` §7.5;SCP-SBX-015;ESLOT-SBX-008 | 不验来源仓完整事件生成逻辑 |
| ASCP-SBX-012 Outbound Event / relay协议族 | event seam | P0-C | 13 Event使用committed stored payload / source cursor;publish retry / failed / dead-letter不回滚source或重建payload | `03` §7.6;SCP-SBX-016;ESLOT-SBX-008 /009 | 不要求特定bus产品,不从current truth重建历史事件 |
| ASCP-SBX-013 Operations Job协议族 | maintenance seam | P0-C | 10 Job验证selection、per-item UoW、partial report、stored report replay、no core truth repair和诚实exit disposition | `03` §7.6;SCP-SBX-017;ESLOT-SBX-006~010适用 | 不把job当业务truth修复或隐藏partial failure |
| ASCP-SBX-014 状态、事务、幂等与并发 | consistency | P0-C | 30 status enum按owner合法 /非法 /terminal迁移;accepted UoW;rollback visibility;digest conflict;stored replay;19 race single winner | `03` §9~§12;SCP-SBX-018~020;ESLOT-SBX-010 /011 | 同名variant不跨owner合并;cursor不替代version |
| ASCP-SBX-015 配置source、schema与complete generation | config invariant | P0-C | S00~S08允许范围、I001~I101、40组 /44域、FC / XVAL / NCFG、strict source、invalid winner no fallback、same-generation atomic publish成立 | `04` §3~§11;SCP-SBX-022 /023 /027;ESLOT-SBX-013 | 不为remote / admin / reload / hot预造成功路径 |
| ASCP-SBX-016 sensitive material与all-carrier redaction | security config | P0-C +适用P0-Q / P1 | opaque ref、class / slot / consumer、lease / expiry / revoke / release和config / DTO / log / metric / audit / report / workload零raw泄漏 | `04` §8;SCP-SBX-024;ESLOT-SBX-015 /018 /019 | P0-C不证明真实provider /平台memory安全;适用真实资格单列 |
| ASCP-SBX-017 change / rollback / drift诚实性 | config evolution | P0-C contract + P1 physical | review / TOCTOU、immutable candidate、new rollback request、history保留、desired / observed不反写和effect-suspect冻结成立 | `04` §10 /§13;SCP-SBX-025 /026;ESLOT-SBX-014 /020 | fleet rollout、traffic / drain和physical rollback默认P1 conditional |
| ASCP-SBX-018 truth ownership与依赖裁剪 | architecture redline | P0-C | execution isolation truth独立;外部正文不入仓;仅`core-contracts`为sibling compile dependency;技术产品不定义domain truth | `01` §4 /§8 /§9;SCP-SBX-028;ESLOT-SBX-016 | 不验相邻仓内部truth,不选择技术产品 |
| ASCP-SBX-019 unsupported / undeclared surface honesty | negative contract | P0-C | S07 / S08 / reload / LKG / partial generation / hot swap / immediate callback / ordinary config hidden TTL无current surface且声明reject | SCP-SBX-033;EHR-19;ESLOT-SBX-016 /021 | surface出现即DesignReopen,不按已接受future处理 |
| ASCP-SBX-020 formal audit、observability与evidence integrity | evidence / observability | P0-C + P0-Q适用 | formal audit不可被log / metric / provider audit替代;safe hook完整;21 slot expected规则、raw / report / digest / pairing / no-static / review成立 | AC-SBX-039 /041;SCP-SBX-009 /024 /034;`05` §13 | 当前无runtime EV;本Step只确定mandatory范围 |
| ASCP-SBX-021 零容忍NFR与结构有界 | nonfunctional | P0 | host / bypass、四维放宽、policy fail-open、正文 /raw泄漏、证据先删、orphan脱管、追溯缺口成功数为0;核心path / query / retry / batch结构有界 | `00` §13;SCP-SBX-034 /035;SUITE-SBX-014 | 无正式workload时不写历史P95 / SLA /容量通过结论 |
| ASCP-SBX-022 PROFILE-06 real-like / durable /联合接缝 | integration target | P1 conditional | durable parity、real-like bus / resolver / handoff / scheduler / sink、dependency outage、联合E2E和selected composition证据 | PROFILE-06;SCP-SBX-021 /026 /031;RR-SBX-001 /004 /006 /007 | 默认不补偿P0;送验声明时升级mandatory |
| ASCP-SBX-023 PROFILE-07、production、capacity / DR / hard SLO | operations target | P2 inactive | 只记录未来production topology、capacity、hard SLO、fleet soak、DR、安全和运行资格触发 | PROFILE-07;SCP-SBX-032 /035;RR-SBX-002 /003 /005 | 当前不得宣称active / ready / accepted;送验声明触发DesignReopen |
| ASCP-SBX-024 FR-SBX-E01~E06外围增强 | future enhancement | P2 conditional | 多后端 /多宿主、advanced replay / inspect / operator、preview /分析、backend comparison / policy simulation和趋势不反向定义核心truth | FR-SBX-E01~E06;AC-SBX-024 /025;SCP-SBX-036 | 未实现不影响核心P0;进入current scope先重开上游设计 |

范围闭集规则:

- `ASCP-SBX-001~021`构成当前核心P0裁决范围,其中P0-Q适用部分不得被标记N/A、waived或由低profile替代。
- `ASCP-SBX-022`默认P1 conditional;任何送验声明命中其能力时,升级为该送验目标的mandatory scope。
- `ASCP-SBX-023~024`默认P2 / inactive;出现交付声明时必须先DesignReopen,不能直接写风险接受。
- `AC-SBX-024 /025`只约束外围增强若实现不得污染核心;外围增强未实现不影响当前C-SBX-1~5核心结论。
- 本表只定义范围和证明地位,不表示TC已执行、ESLOT已形成EV或任一范围项已有结论。

### 8.4 核心能力到范围闭环

| 核心能力 | 核心范围 | 横切范围 | 主要P0证明轴 | 缺失后果 |
|---|---|---|---|---|
| C-SBX-1受控执行语境识别与约束 | ASCP-001 /009~013 | ASCP-014 /018 /020 /021 | P0-C | 无formal intake / identity / responsibility或存在第二入口时P0失败,可触发VF-001 /002 /005 /009 /010 |
| C-SBX-2隔离环境边界建立与限制施加 | ASCP-002 /003 | ASCP-007 /014~016 /018~021 | P0-C + P0-Q | P0-C只证明裁定;P0-Q未闭合则真实隔离未证明,整体P0不得通过 |
| C-SBX-3给定策略内执行与fail-closed | ASCP-004 /009 /011 | ASCP-014~016 /018~021 | P0-C +真实launch P0-Q | policy缺失 /冲突 /不支持 /越权仍launch直接触发否决候选 |
| C-SBX-4输出与观测材料捕获和分层交接 | ASCP-005 /010~013 /016 /020 | ASCP-014 /018 /021 /022适用 | P0-C +capture real behavior P0-Q | capture / handoff / downstream truth混层或raw泄漏使P0失败 |
| C-SBX-5失败租约清理与安全红线收束 | ASCP-006~008 /013 | ASCP-014~017 /020 /021 /023适用 | P0-C +lifecycle P0-Q | guard绕过、orphan脱管、redline advisory或材料先删直接触发否决候选 |

### 8.5 Profile到验收范围与证明上限

| Profile | 验收范围地位 | 最多可支持的裁决 | 不能支持的裁决 | 升级 /阻塞规则 |
|---|---|---|---|---|
| PROFILE-01 `local-contract` | P0-C辅助 | loader / builder / entry mapping、safe diagnostic和real request reject | 真实代码执行、backend安全或隔离有效性 | real workload成功即否决候选;不能形成P0-Q EV |
| PROFILE-02 `ci-contract` | P0-C主体 | contract、domain state、UoW、idempotency、race、error、redaction、negative config和evidence writer契约 | backend真实边界、durable parity、platform anti-leak | 当前无环境实例时P0-C NotEvaluated,不是Passed |
| PROFILE-03 `integration-seam` | P0-C接缝补强 | consumer / publisher / resolver / handoff / sink协议、failure mapping和body-free seam | coherent boundary真实生效、完整跨仓E2E | 真实联合目标需升级ASCP-022 |
| PROFILE-04 `operations-simulation` | P0-C lifecycle补强 | lease / orphan / cleanup / redline / relay / replay / reconciliation guard和no-repair | 真实资源终止 /删除 / contained、fleet soak | 真实lifecycle仍由PROFILE-05 P0-Q证明 |
| PROFILE-05 `backend-conformance` | P0-Q主体 | 固定candidate + capability + template + environment的四维隔离、bounded lifecycle、capture / inspect / release、cleanup / redline和anti-substitution | staging、production、其他candidate / template或durable composition | 任一identity / provider / lab / guard前置缺失时Blocked且0 launch |
| PROFILE-06 `staging-like` | P1 conditional | 固定real-like composition的durable / bus / resolver / handoff / scheduler / sink接缝与outage / physical change候选 | production readiness、PROFILE-07或P0-Q替代 | 未声明时NotRunConditional;送验声明时ASCP-022升级mandatory |
| PROFILE-07 `production-like` | P2 inactive | 当前只支持absence / design-reopen裁决 | active、ready、accepted、production、capacity / DR | 任何激活或送验声明先DesignReopen,当前不能风险接受 |

### 8.6 正式协议、状态、错误与字段词汇范围

| 正式集合 | 数量 /来源 | 验收范围要求 | 禁止替代 |
|---|---|---|---|
| Command | 10;`03` §7.3 | 每个协议均进入ASCP-009,后续验收项必须使用正式名称、request / result字段、幂等和审计语义 | “执行接口”“控制接口”等泛化组名替代逐协议裁决 |
| Query | 13;`03` §7.4 | 每个协议均进入ASCP-010,必须使用正式View / surface和no-write语义 | 口语状态、query refresh / rebuild或用current truth补projection |
| Inbound Event Consumer | 9;`03` §7.5 | 每个协议均进入ASCP-011,必须使用正式envelope / payload、source authority、dedup和receipt disposition | 只验bus delivered或来源仓内部状态 |
| Outbound Event | 13;`03` §7.6 | 每个协议均进入ASCP-012,必须使用stored payload、source cursor和relay status | 从current truth重建payload或用topic名代替event contract |
| Operations Job | 10;`03` §7.6 | 每个协议均进入ASCP-013,必须使用typed input、selection、per-item result和stored report | scheduler成功代替job report,或job修core truth |
| 状态 | 30个owner-level state machine /31个canonical status enum entry /39个shared declaration;`03` §9 | 每个entry按owner验证合法 /非法 /terminal迁移和传播;概要状态组只作主题轮廓 | 将同名`Failed` / `Pending`跨owner合并,或用backend raw state替代domain state |
| 错误 | 38 typed error;`03` §11 | 每个错误必须有producer、typed mapping、safe public surface、副作用和恢复 /禁止恢复语义 | 只比error string、SDK body或process exit code |
| 字段身份 | `03` §7 /§10~§12 | `context_ref`与caller refs分离;request digest、idempotency / dedup / job key分离;expected_version、repository version、truth / reference / page cursor分离 | route / topic / timestamp拼digest,job_run_ref当幂等key,cursor当version |
| 材料 /配置身份 | `03/04/05` | capture、handoff receipt、downstream truth分离;profile、config generation、candidate / capability / template / environment / provider identity连续 | receipt升格truth,低profile或旧generation替代qualification |

后续Step 5~10若无法使用上述正式名称形成唯一通过 /失败语义,必须触发`SBX-ACC-DESIGN-REOPEN-001`,不能在验收文档中创造口语别名。

### 8.7 只验接缝的相邻仓 / 外部能力

| 相邻仓 /外部能力 | 本轮必须裁决的Sandbox接缝 | 不裁决内容 | 默认优先级 | 对结论的影响 |
|---|---|---|---|---|
| `L0-core` / `core-contracts` | shared ID、typed refs、metadata、public carrier和唯一sibling compile dependency边界 | `L0-core`内部实现与发布流程 | P0-C | exact contract或依赖边界失败使P0失败;不得用本地复制类型替代 |
| `L0-bus` | inbound / outbound schema、stored payload、source cursor、dedup、relay retry / failed / dead-letter和no rollback | bus产品内部调度、broker HA和运营控制面 | P0-C contract;real bus P1 | contract失败阻断P0;real bus未激活只披露,送验声明时升级P1 mandatory |
| `L2-tools` | tool / launch safe refs、统一入口、policy decision、sandbox failure / capture返回和no tools truth persisted | ToolDefinition、ToolPolicy、semantic execution、ToolInvocationResult / AuditEntry truth | P0-C contract;联合调用P1 | 接缝或truth ownership失败阻断P0;完整工具E2E默认不参与核心结论 |
| `L2-runtime` | runtime context ref、run / failure / control / capture material、状态反馈和no runtime truth persisted | agent loop、ExecutionInstance、checkpoint / recover、result backflow | P0-C contract;联合loop P1 | Sandbox接缝失败阻断P0;runtime内部主线不由本验收裁决 |
| `L2-member-service` | member / host safe ref、统一入口、sandbox outcome与no host lifecycle truth | MemberExecutionHost、SandboxBinding装配、session / worker / health lifecycle | P0-C contract;真实host装配P1 | host / binding truth进入Sandbox触发架构红线;完整装配由member-service验收 |
| `L1-identity` / `L1-work` | actor / responsibility / project / work refs、body-free summary及missing / stale / conflict / unavailable | identity / role / project / work / iteration正文与生命周期 | P0-C controlled seam;real resolver P1 | ref处理或正文边界失败阻断P0;来源仓内部生命周期不裁决 |
| governance / capability / policy owner | body-free policy / authorization / capability summary、freshness、conflict和fail-closed | policy DSL、approval、allowlist、capability truth和风险taxonomy定义 | P0-C;real source P1 | fail-open或Sandbox拥有policy truth触发否决候选;真实source未激活只披露 |
| `L1-artifact` / archive | candidate material ref、capture来源、handoff pending / delivered / failed / retryable、cleanup guard和no truth elevation | Artifact正文 / version / baseline /formal evidence、archive package / restore / retention truth | P0-C handoff;real target P1 | 分层或handoff marker失败阻断P0;下游最终接受不由Sandbox验收推断 |
| `L4-observability` | safe log / metric / diagnostic / audit material、handoff marker、redaction和formal audit不可替代 | physical store、trace query、retention、dashboard、alert truth | P0-C carrier;real sink / alert P1 | 泄漏或用telemetry替代formal audit触发否决;真实运营响应默认P1 |
| investigation / security response | redline handoff ref、pending / failed / acknowledged marker、cleanup guard和receipt不解除containment | 调查正文、case lifecycle、处置意见和解除审批内部流程 | P0-C contract;real target / runbook P1 | containment / guard接缝失败阻断P0;外部调查关闭不能由receipt推断 |
| runner / console /人工入口 | 统一受理、actor context、safe status / result / error mapping和旁路 /host执行拒绝 | CLI / UI流程、预览体验、operator state和产品可访问性 | P0-C入口;产品E2E P1 / P2 | 旁路formal success触发否决;UI体验不影响Sandbox核心结论 |
| isolation backend / secure provider | capability / outcome、fixed candidate qualification、lease、capture / inspect / release和safe failure mapping | 产品内部调度、SDK body、供应商控制面、商务和供应链语义 | backend P0-Q;provider /平台适用P0-Q或P1 | backend资格是核心P0;适用真实material前置缺失时P0-Q Blocked,不得转普通residual |

接缝裁决规则:

- “只验接缝”不等于只检查接口可调用。P0接缝仍必须覆盖正式字段、状态、错误、幂等、失败传播、redaction、truth ownership和no-write / no-rollback。
- controlled seam通过不证明真实产品可用;真实产品未被本轮声明时进入P1披露,被声明时升级为mandatory scope。
- 相邻仓未实现不能授权Sandbox保存对方正文、补造对方truth或形成第二套成功语义。
- isolation backend是例外的核心运行依赖:其内部产品语义仍不裁决,但固定candidate真实隔离资格必须由P0-Q证明。

### 8.8 非范围与最终结论影响

| 非范围 | 不裁决原因 | 默认影响类别 | 对最终结论的约束 | 归属 /关闭条件 |
|---|---|---|---|---|
| tools semantic execution、runtime agent loop、member lifecycle orchestration | 不属于Sandbox truth ownership | `NoCoreImpact` | 对方内部能力缺失不使Sandbox P0失败;但Sandbox越权拥有或接缝失败仍阻断P0 | 各相邻仓`05/06`;Sandbox只关闭ASCP-SBX-018及接缝项 |
| identity / work / artifact / observability / policy / investigation正文和生命周期 | 只允许ref / safe summary / marker | `VetoIfAbsorbed` | 未验正文不影响核心;正文入仓、receipt升格或外部状态反写则触发VF / VETO候选 | 对应truth owner;Sandbox关闭body-free / no ownership transfer |
| 目标实现仓、suite、CI、ENV-02~05实例和fixed run创建 | 属于`07`与真实执行,不属于验收设计 | `ActualAcceptanceBlocked` | 当前不得形成任何总体结论;该缺口不可作为有条件通过风险接受 | `07` precheck / implementation / execution关闭 |
| candidate backend、capability、provider适用身份和dedicated lab | P0-Q实际资格前置 | `CoreP0Blocked` | 任一缺失使P0-Q及整体P0保持Blocked;不能由P0-C、P1或风险接受补偿 | `07/09`准备 +固定P0-Q packet +真实evidence |
| 具体DB / bus / sink / alert / rollout产品 | 当前保持产品中立,除candidate backend外默认不是核心truth前置 | `DisclosureOrTargetStage` | 未声明时不阻断核心P0;若送验目标声明对应real-like /运营能力,升级ASCP-SBX-022 | ADR / `07/09` +激活后的P1证据 |
| 生产credential、生产数据、raw外部正文 | 安全边界明确禁止进入测试 /验收材料 | `ProhibitedInput` | 不以缺少生产材料为风险;一旦进入carrier / artifact / report即安全失败或否决候选 | synthetic / controlled non-production材料;redaction / security qualification |
| PROFILE-06 real-like / durable /联合E2E | 默认conditional且当前unqualified | `ResidualIfUndeclared` | 未声明时不阻断核心P0,但必须在handoff披露;送验声明时升级mandatory,缺证不得宣称该能力 | ASCP-SBX-022;Step 3 /13;RR-SBX-001 /004 /006 /007 |
| PROFILE-07 production、capacity / hard SLO / DR / fleet soak | 当前inactive且无正式production contract / workload / topology | `DesignReopenIfClaimed` | 未声明不参与核心结论;任何production-ready等声明都不能直接有条件通过,必须先DesignReopen | ASCP-SBX-023;RR-SBX-002 /003 /005 |
| FR-SBX-E01~E06外围增强 | 不构成C-SBX-1~5当前核心前置 | `DesignReopenIfClaimed` | 未实现不影响核心;若声明交付,先回写需求 /设计 /测试并验证不污染核心 | ASCP-SBX-024;AC-SBX-024 /025 |
| remote config、admin override、reload、LKG、partial generation、hot swap、immediate callback | 当前正式设计unsupported或无public carrier | `ImmediateDesignReopen` | 当前只验absence / declaration reject;实际surface出现即暂停验收,不得风险接受 | 回写`03/04/05`,再重开`06` |
| 历史Docker / gVisor启动、销毁、白名单开销和API可用率数字 | 无当前产品 / workload /测量 /误差来源 | `NotAnAcceptanceThreshold` | 不得用于通过 /失败或有条件通过;只可作future benchmark输入 | 正式SLO / workload形成后重开Step 2 /9 |
| evidence数值retention与物理介质 | 当前只有condition-based deletion guard | `ResidualCandidate` | 不影响当前证据真实性设计;实际法规 /合同 /目标阶段要求出现时升级mandatory;不得绕过cleanup /调查guard | RR-SBX-008;Step 13;`07/09`物理策略 |
| 实施phase、commit boundary、部署命令和runbook | 属于`07/09` | `NoCurrentScope` | 不进入验收正文任务安排;但实现 /运行必须满足`06`门禁后才能声明阶段完成 | 正式`07/09`;当前不得提前创建ledger / skeleton |

影响类别说明:

| 类别 | 含义 | 是否允许自动写入有条件通过 |
|---|---|---|
| `NoCoreImpact` | 不属于Sandbox主体,仅验正式接缝 | 否;无需风险接受,但必须避免越权声明 |
| `DisclosureOrTargetStage` / `ResidualIfUndeclared` | 默认不阻断核心,但影响特定目标阶段或送验声明 | 否;先由Step 13判断是否满足风险接受条件 |
| `CoreP0Blocked` / `ActualAcceptanceBlocked` | 核心证明或实际验收前置缺失 | 否;必须保持Blocked /不可裁决 |
| `VetoIfAbsorbed` / `ProhibitedInput` | 一旦发生即破坏truth /安全边界 | 否;进入Step 11否决审计 |
| `DesignReopenIfClaimed` / `ImmediateDesignReopen` | 当前设计不支持该声明或surface | 否;先回写上游并使既有范围 /证据失效 |
| `NotAnAcceptanceThreshold` | 缺权威来源,不能用作裁决阈值 | 否;形成正式来源后重新校准 |

### 8.9 VF-SBX-001~010范围映射

| VF | 主要范围项 | 否决候选方向 | 当前证明轴 |
|---|---|---|---|
| VF-SBX-001 | ASCP-SBX-001~021 | C-SBX-1~5任一核心节点无法成立,或P0-C / P0-Q任一必要轴被删除 /替代 | P0-C + P0-Q + evidence |
| VF-SBX-002 | ASCP-SBX-001 /003 /004 /018 /021 | 宿主直跑、caller local、旁路、匿名、低profile real workload被宣称formal sandbox success | P0-C negative + P0-Q substitution |
| VF-SBX-003 | ASCP-SBX-002 /003 /007 /015 /021 | resource / filesystem / network / process任一unsupported仍partial、silent ignore、unverified launch或fallback | P0-C decision + P0-Q real probes |
| VF-SBX-004 | ASCP-SBX-004 /015 /019 /021 | policy missing / stale / conflicted /unsupported /unauthorized仍launch或technical degraded授权高风险动作 | P0-C +适用P0-Q launch |
| VF-SBX-005 | ASCP-SBX-001 /004~006 /016 /018 /020 /021 | identity / work / tool / runtime / artifact / observability / policy / UI正文或raw外部材料进入truth / DTO / artifact / report | P0-C redaction +适用P0-Q anti-leak |
| VF-SBX-006 | ASCP-SBX-005 /012 /016 /018 /020 | capture、candidate、observability material或handoff receipt升格formal artifact / evidence / observability truth | P0-C truth separation |
| VF-SBX-007 | ASCP-SBX-005 /007 /008 /013 /020 /021 | cleanup / reaper在capture / audit / handoff / investigation材料安全交接前删除或fake release | P0-C guard + P0-Q lifecycle |
| VF-SBX-008 | ASCP-SBX-006~008 /013 /021 | lease expiry、orphan或redline在托管恢复外继续运行,containment advisory-only或receipt自动解除 | P0-C lifecycle + P0-Q real lifecycle |
| VF-SBX-009 | ASCP-SBX-006 /009~015 /017~020 | caller / backend / consumer / query / job / retry形成第二truth、duplicate重算、current truth重建历史结果 | P0-C consistency / no-write / no-repair |
| VF-SBX-010 | ASCP-SBX-001~020 | accept / reject / establish / policy / handoff / failure / control / redline缺safe audit、trace、fixed raw / report或不可变回链 | P0-C + P0-Q evidence integrity |

### 8.10 VETO-CFG-01~16范围映射

| VETO-CFG | 主要范围项 | 验收范围中的不可接受方向 | 默认证明轴 |
|---|---|---|---|
| VETO-CFG-01 | ASCP-SBX-001 /003 /019 | P01~04或host / fake / fixture承载真实workload并返回formal success | P0-C negative + P0-Q |
| VETO-CFG-02 | ASCP-SBX-002 /003 /015 | 四维boundary任一unsupported / mismatch仍partial allow或低层fallback | P0-C + P0-Q |
| VETO-CFG-03 | ASCP-SBX-004 /015 | policy缺失 /过期 /冲突 /不支持仍继续高风险动作 | P0-C +适用P0-Q |
| VETO-CFG-04 | ASCP-SBX-004 /015 /018 | Sandbox配置或保存policy、allowlist、approval、capability truth正文 | P0-C |
| VETO-CFG-05 | ASCP-SBX-016 /020 /021 | raw secret、credential、full sensitive ref、external body或process output进入任一carrier | P0-C +适用P0-Q |
| VETO-CFG-06 | ASCP-SBX-015 | invalid、required failure或mixed adapter set发布`Degraded` / `Ready`或partial handle | P0-C |
| VETO-CFG-07 | ASCP-SBX-009 /020 | accepted truth缺formal audit,由telemetry、provider audit或log替代 | P0-C |
| VETO-CFG-08 | ASCP-SBX-005 /011 /012 /017 | relay / handoff / publish失败回滚source truth或从current truth重建stored payload | P0-C |
| VETO-CFG-09 | ASCP-SBX-007 /013 /017 | cleanup / reaper / release绕handoff、investigation、lease或redline guard | P0-C + P0-Q |
| VETO-CFG-10 | ASCP-SBX-008 /017 | redline advisory-only、receipt解除containment或migration清除redline | P0-C +适用P0-Q |
| VETO-CFG-11 | ASCP-SBX-010 /013 /014 /017 | Query / projection / derived / reconciliation / job写或auto-repair core truth | P0-C |
| VETO-CFG-12 | ASCP-SBX-009~014 /017 | duplicate / stored result / receipt / report因retention或migration被重算 | P0-C |
| VETO-CFG-13 | ASCP-SBX-005 /016 /018 | capture / handoff receipt升格artifact或observability truth | P0-C |
| VETO-CFG-14 | ASCP-SBX-015 /019 | unsupported declaration被silent ignore、fallback current snapshot或伪装成功 | P0-C negative |
| VETO-CFG-15 | ASCP-SBX-008 /015~019 /021 | 安全削弱通过deprecated / compatibility window继续成功 | P0-C negative |
| VETO-CFG-16 | ASCP-SBX-004 /018 /019 /024 | 配置 /协议定义tools semantic execution、agent loop或member lifecycle | P0-C architecture |

本Step只确认上述项目必须进入Step 11否决审计,不分配`VETO-SBX-*`、不判定命中状态。VF和VETO-CFG编号保持各自正式来源,不得在本Step合并或改义。

### 8.11 RR-SBX-001~008范围归属

| Residual candidate | 默认范围地位 | 本Step范围结论 | 升级 /失效触发 | 后续裁决 |
|---|---|---|---|---|
| RR-SBX-001 PROFILE-06 durable / real-like未qualified | P1 conditional | ASCP-SBX-022;未声明时披露且不补偿P0 | release要求P06、composition锁定或送验声明对应能力 | Step 3固定基线;Step 13判断风险接受资格 |
| RR-SBX-002 无数值SLO / workload / capacity基线 | P1 / P2 | ASCP-SBX-021只裁决结构有界;ASCP-SBX-023承接量化future | 正式SLO、合同、workload manifest或capacity model形成 | Step 9重开阈值;Step 13不得伪造数字 |
| RR-SBX-003 PROFILE-07 / production / remote / hot inactive | P2 / DesignReopen | ASCP-SBX-023 /024与ASCP-SBX-019 negative absence | 任一production / P07 / remote / hot声明进入current scope | 回`00~05`,重开`06`;不可直接风险接受 |
| RR-SBX-004 consumer跨仓完整E2E未锁基线 | P1 conditional | ASCP-SBX-022;Sandbox P0只验正式接缝 | 联合验收要求、consumer release或shared carrier变化 | Step 3固定联合baseline;Step 13判断目标阶段影响 |
| RR-SBX-005 long soak / fleet lease-orphan-reaper未覆盖 | P1 / P2 | P0-C simulation + P0-Q bounded lifecycle仍mandatory;fleet soak归ASCP-SBX-023 | topology、soak窗口、fleet / resource SLO或production激活 | Step 9 /13裁决,`07/09`落runner / runbook |
| RR-SBX-006 physical rollout / rollback / drift / TOCTOU carrier缺失 | P1 conditional | ASCP-SBX-017 contract P0;physical carrier归ASCP-SBX-022 | P06+ rollout、software baseline或送验声明physical change | Step 3 /9 /13;不得把simulation写aligned |
| RR-SBX-007 real sink / alert / pager / response未资格 | P1 conditional | ASCP-SBX-020 safe hook P0;运营响应归ASCP-SBX-022 | profile /合同要求alert delivery或response SLO | Step 9 /13;`07/09`定产品 /阈值 / runbook |
| RR-SBX-008 evidence TTL /物理介质未定 | residual candidate | P0保持condition-based deletion guard;物理策略默认非核心范围 | 法规 /合同 /审计窗口 /介质或送验retention声明形成 | Step 13定最低接受条件;`07/09`定介质 /TTL |

所有RR当前仍为`pending_for_06`,无真实assignee、acceptor、日期、期限或签署。本Step的“默认范围地位”不是风险接受结论。

### 8.12 验收项编号与真相源边界

| 编号族 | 当前owner /语义 | 本Step规则 | 后续允许动作 |
|---|---|---|---|
| `AC-SBX-001~041` | 正式`00`需求验收条件 | 保持canonical,不得重编号、改义或被新验收项覆盖 | Step 5~10每条细分裁决项必须回指至少一个canonical AC |
| `ASCP-SBX-001~024` | 本Step验收范围索引 | 只标识scope,不是通过 /失败项或evidence | Step 3~14用于检查范围覆盖,不得出现在runtime EV status中冒充AC |
| future `AC-SBX-FUNC-*` / `ARCH-*` / `SYNC-*` / `STATE-*` / `TX-*` / `IDEMP-*` / `NFR-*` / `EV-*` | Step 5~10细分裁决候选命名空间 | 当前不创建实例;类别前缀避免与canonical需求AC冲突 | 只能在对应Step按小循环生成,并回指canonical AC /设计 /TC /evidence |
| `VF-SBX-001~010` | 正式`00`需求一票否决来源 | 保持canonical来源编号 | Step 11映射到正式否决裁决索引 |
| `VETO-CFG-01~16` | 正式`04`配置不可风险接受来源 | 保持配置来源编号,不与VF合并 | Step 11映射到正式否决裁决索引 |
| future `VETO-SBX-*` | Step 11总体否决裁决索引 | 当前不分配、不预填状态 | Step 11建立VF / VETO-CFG / TC / EV /总体结论双向映射 |
| `AHG-01~19`;`EHR-01~20`;`ESLOT-SBX-001~021` | handoff requirement / planned slot | 不属于验收项或runtime evidence | Step 5~10只作为来源 / expected slot;真实run合法后才形成EV |

编号纪律避免三类污染:需求AC与细分裁决项同号不同义、范围索引被当成结果、planned evidence被当成runtime EV。

### 8.13 Canonical需求范围反向审计

| Canonical需求集合 | 主要验收范围项 | 优先级 /证明轴 | 漏项结论 |
|---|---|---|---|
| C-SBX-1;FR-SBX-001~003;BR-SBX-001~005 | ASCP-SBX-001 /009~014 /018 /020 /021 | P0-C | 无漏项;统一入口、identity、责任链、协议、状态、审计和no second truth均已承接 |
| C-SBX-2;FR-SBX-004~006;BR-SBX-006~010 | ASCP-SBX-002 /003 /007 /014~016 /018 /020 /021 | P0-C + P0-Q | 无漏项;裁定契约与真实四维资格分轴承接 |
| C-SBX-3;FR-SBX-007~010;BR-SBX-011~017 | ASCP-SBX-004 /009 /011 /014~016 /018~021 | P0-C +适用P0-Q | 无漏项;policy外部truth、fail-closed、high-risk launch和跨调用方一致语义已承接 |
| C-SBX-4;FR-SBX-011~014;BR-SBX-018~024 | ASCP-SBX-005 /010~013 /016 /018 /020~022适用 | P0-C + capture / release P0-Q;real target P1 | 无漏项;capture、candidate、observability material、handoff和下游truth分层已承接 |
| C-SBX-5;FR-SBX-015~018;BR-SBX-025~033 | ASCP-SBX-006~008 /013~017 /020 /021 /023适用 | P0-C + lifecycle P0-Q;fleet P2 | 无漏项;failure、control、lease、orphan、cleanup、reaper、redline和材料留痕已承接 |
| AC-SBX-001~005 | ASCP-SBX-001~008 /020 /021 | P0-C + P0-Q | 五个核心闭环AC均有范围去向 |
| AC-SBX-006~023 | ASCP-SBX-001~008及协议 /一致性 /配置 /证据横切范围 | P0-C +适用P0-Q | 18个核心FR验收AC均有范围去向 |
| AC-SBX-024~025;FR-SBX-E01~E06 | ASCP-SBX-024,并回指ASCP-SBX-018 /019 /021防污染 | P2 conditional / DesignReopen | 外围增强未实现不影响核心;声明交付时必须重开并证明不改核心 |
| AC-SBX-026~030 | ASCP-SBX-001~008 /014~018 /020 /021 | P0-C +适用P0-Q | 五组规则 /边界AC均有范围去向 |
| AC-SBX-031 | ASCP-SBX-009~015 /018 /019 | P0-C | 接口类型、全协议和依赖裁剪已承接 |
| AC-SBX-032~035 | ASCP-SBX-001 /004~006 /016 /018 /020 /021 | P0-C +适用redaction P0-Q | truth、snapshot、refs和forbidden body边界均已承接 |
| AC-SBX-036 | ASCP-SBX-021 /023 | 结构有界P0;量化P1 / P2 | 无来源旧数字未进入硬门禁,数值范围保持条件触发 |
| AC-SBX-037~041 | ASCP-SBX-004~008 /014~021 | P0-C +适用P0-Q | 可用性、安全、审计、幂等 /一致性和可观测性均有范围去向 |
| VF-SBX-001~010 | ASCP-SBX-001~021 | P0否决候选 | §8.9逐项映射,无漏项 |

反向审计结论:

- 核心`C-SBX-1~5`、`FR-SBX-001~018`、`BR-SBX-001~033`和`AC-SBX-001~023 /026~041`均进入当前P0范围。
- `FR-SBX-E01~E06`和`AC-SBX-024 /025`进入P2 conditional / DesignReopen范围,没有被错误提升为当前核心前置。
- VF-SBX-001~010和VETO-CFG-01~16均进入后续Step 11候选审计,但当前未形成否决状态或总体结论。
- 测试范围SCP-SBX-001~036已被当前24个验收范围项按裁决主题归并;归并不删除任何协议、状态、TC、PER或evidence producer。

### 8.14 Historical material与blocker记录

| ID | 类型 | 状态 | 冲突 /缺口 | 本Step处理 |
|---|---|---|---|---|
| SBX-ACC-SCOPE-001 | scope gap | resolved_for_step_2_wait_review | 核心 /外围、P0-C / P0-Q、P1 / P2、Profile、接缝、非范围和VETO候选原未形成统一验收裁决范围 | §8.1~§8.13已完成目标、范围、升级、接缝、影响、否决和反向审计 |
| SBX-ACC-SCOPE-HIST-001 | historical material | contained | 旧`06`用旧对象、泛化功能 /环境 /NFR /风险范围替代新版隔离闭环 | 不继承;Step 15按当前范围full-restart |
| SBX-ACC-SCOPE-P0Q-001 | qualification blocker | open_for_p0q_execution | candidate、capability、provider、dedicated lab和PROFILE-05 packet不存在 | 不阻塞范围设计;阻塞P0-Q与整体P0实际通过,不得风险接受或低profile替代 |
| SBX-ACC-SCOPE-P1-001 | conditional scope | open_for_step_3_baseline_decision | PROFILE-06、联合E2E、physical change、real sink / alert和soak是否属于某次送验声明尚未固定 | Step 3读取送验目标后逐项决定是否升级mandatory;当前不伪造送验声明 |
| SBX-ACC-SCOPE-P2-001 | future scope | contained_by_design_reopen | PROFILE-07、production、hard SLO / DR和外围增强当前inactive /未设计为交付 | 未声明不影响核心;一旦声明必须DesignReopen,不能直接条件通过 |
| SBX-ACC-SCOPE-NUMBER-001 | identifier boundary | resolved_for_step_2 | 需求`AC-SBX-001~041`已占用,后续细分验收项若同号改义会产生第二真相源 | §8.12固定canonical AC、scope ID和future category namespace边界 |
| SBX-ACC-SCOPE-EVIDENCE-001 | evidence maturity | open_for_runtime_evidence | 当前无fixed run、runtime EV或acceptance packet | 不阻塞范围设计;ASCP只表示范围,不得写结果 |
| SBX-ACC-SCOPE-IMPLEMENT-001 | downstream document gap | blocked_by_formal_06 | 正式`07`、implementation ledger和planned boundary skeleton不存在 | 当前不得创建;完成正式`06`并经用户确认后再进入`07` |

### 8.15 对上游设计的影响判定

| 上游文档 | 本Step复核问题 | 判定 | 当前动作 |
|---|---|---|---|
| `00-需求文档.md` | 核心 /外围、目标 /非目标、AC / VF是否足以裁剪验收范围? | 足够;核心与外围界线、41 AC和10 VF明确 | 无回写 |
| `01-架构设计.md` | 职责、truth ownership、依赖、四维边界和接缝是否与范围冲突? | 未发现冲突;接缝只验Sandbox语义,backend资格仍是核心 | 无回写 |
| `02-概要设计.md` | 六个主要组成部分、flow和六组状态主题是否被范围遗漏? | 未遗漏;由ASCP-SBX-001~014覆盖,详细词汇以后续`03`为准 | 无回写 |
| `03-详细设计.md` | 55协议、31 canonical enum entry /30 owner-level machine /39 shared declaration、38错误和字段身份能否被范围完整承接? | 能;§8.3 /§8.6已全量纳入,未创建口语替代 | 无回写 |
| `04-配置设计.md` | PROFILE配置成熟度与P0-Q验收风险是否构成冲突? | 不冲突。PROFILE-05的配置引入阶段和真实隔离作为核心验收证明轴属于不同维度 | 无回写;在正式`06`解释双轴 |
| `05-测试方案.md` | P0-C / P0-Q、250 P0、P1 / P2、接缝、RR和当前Blocked状态是否被验收范围改变? | 未改变;只转译为裁决地位和送验声明升级规则 | 无回写 |

当前判定:`no_upstream_writeback_required_for_step_2`。若Step 3发现真实送验声明超出ASCP-SBX-001~024或要求unsupported / production surface,必须把该声明转为DesignReopen blocker,不能在Step 3私自扩范围。

---

## 9. 复杂度与分批判断

| 检查项 | 结论 |
|---|---|
| 是否属于复杂Step | 是。范围跨需求能力、架构truth、55协议、31 canonical状态entry /30 owner-level machine、配置Profile、测试双P0轴、相邻仓接缝、VETO和residual。 |
| 是否需要拆分Step文件 | 否。当前范围主表24项、接缝和映射仍可在单文件内形成一致审查入口。 |
| 是否生成逐条验收项 | 否。Step 5~10按主题小循环生成;本Step只固定范围和命名空间。 |
| 是否修改正式`06` | 否。Step 15前禁止正式回填。 |
| 是否创建未来Step文件 | 否。只创建当前`06_acceptance_step_02_scope.md`。 |
| 是否创建实现 /证据产物 | 否。无run、EV、报告、风险接受、implementation ledger或boundary skeleton。 |

---

## 10. 正式§2回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“验收目标”“优先级与结论地位”“验收范围主表”“只验接缝的相邻仓 /外部能力”“非范围与最终结论影响”“VF / VETO-CFG范围映射”和“Canonical需求范围反向审计”小节,了解验收目标与范围如何收敛。

正式`06-验收标准.md` §2后续应回填以下收口结论:

1. 本轮验收裁决固定送验交付是否形成完整的`L4-sandbox`受控执行隔离基础,而不是只裁决命令能否运行。
2. 当前核心P0由两个正交必要轴组成:P0-C证明正式协议、状态、事务、幂等、配置、失败、安全、接缝和证据不变量;P0-Q证明固定candidate在dedicated environment内真实落实resource / filesystem / network / process四维隔离、lifecycle / capture / release、cleanup / redline和no-host-fallback。两者缺一,整体P0不得通过。
3. P1默认覆盖PROFILE-06 real-like / durable组合、真实provider / sink / alert、跨仓联合E2E、physical change / rollout和soak;未被送验声明时只披露未证明范围,被声明时升级为当前送验mandatory scope。
4. P2默认覆盖PROFILE-07、production、capacity / hard SLO / DR、多后端 /多宿主和FR-SBX-E01~E06外围增强。当前若声明已交付这些能力,必须先DesignReopen,不得直接风险接受或有条件通过。
5. 当前P0范围覆盖execution identity、coherent boundary、policy enforcement、run / capture / handoff、observability、failure / control、lease / orphan / cleanup / reaper、redline、55协议、31 canonical状态entry /30 owner-level machine、38错误、配置generation、redaction、依赖和evidence integrity。
6. tools、runtime、member-service、identity / work、policy owner、artifact / archive、observability、investigation、runner / console及backend / provider只验Sandbox正式接缝、失败面和truth ownership边界;不裁决对方内部truth、产品UI或控制面。固定candidate真实隔离资格仍必须由P0-Q证明。
7. P0-C / P0-Q缺失、目标仓 / suite /环境 /fixed run缺失、VF / VETO命中和unsupported surface出现不能作为普通residual接受。未激活P1 / P2不得补偿P0,也不得被写成已通过。
8. `AC-SBX-001~041`保持需求canonical验收锚点;本Step的`ASCP-SBX-001~024`只表示范围。后续细分验收项必须使用不冲突的类别命名空间并回指canonical AC、正式设计、TC和runtime evidence。

本草稿不允许提前写入正式`06`;只有Step 2经用户确认并最终进入Step 15装配时才可作为§2输入。

---

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 | 最晚关闭点 |
|---|---|---|---|
| 某次送验是否声明PROFILE-06、durable / real-like、联合E2E、physical rollout、real sink / alert或soak | 决定ASCP-SBX-022哪些P1项升级mandatory | 当前无送验说明,保持conditional且必须披露 | Step 3验收基线 |
| 某次送验是否声明PROFILE-07、production、capacity / DR、remote / hot或外围增强 | 决定是否必须DesignReopen | 当前正式范围不支持此类声明;不得预先接受 | Step 3一旦发现立即阻塞并回写上游 |
| 真实material场景在P0-Q packet中是否适用 | 影响provider、platform anti-leak和ASCP-SBX-016的P0-Q证据 | 不适用必须由immutable qualification manifest预先固定,不能运行后N/A | Step 3 /4 |
| 跨仓联合验收的consumer revision集合 | 影响RR-SBX-004和P1 mandatory baseline | 当前只验Sandbox接缝,不填假revision | Step 3,仅在联合范围激活时 |
| 硬SLO、workload、误差和capacity阈值是否存在权威来源 | 影响ASCP-SBX-021 /023和Step 9 | 当前只有结构有界P0;历史数字不裁决 | Step 3 /9;无来源保持conditional |
| future细分验收项类别命名空间的完整清单 | 影响Step 5~10稳定编号 | 本Step只固定不得覆盖canonical AC;各Step按主题生成并在Step 15总审计 | Step 5~10 /15 |
| `VETO-SBX-*`最终数量与合并规则 | 影响Step 11总体否决索引 | 当前只保留10 VF +16 VETO-CFG来源映射,不提前合并 | Step 11 |

上述待确认项不阻塞Step 2范围设计。Step 3必须基于真实送验声明决定条件范围是否激活;没有真实送验说明时只能记录待固定,不得推测“本轮包含”或“本轮不包含”。

---

## 12. 自检与停审条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| SOP六问是否全部回答 | 通过 | §4逐项回答 |
| 核心裁决是否覆盖用户重点九类边界 | 通过 | AG-SBX-01~10及ASCP-SBX-001~021 |
| P0-C / P0-Q是否均为核心且不可替代 | 通过 | §8.1 /§8.2 /§8.5 |
| P1 / P2是否有明确证明上限和升级规则 | 通过 | §8.2 /§8.5;送验声明升级或DesignReopen |
| 验收范围主表是否绑定正式需求 /设计 /测试来源 | 通过 | §8.3共24项,每项给出正式来源和非范围 |
| 55协议、31 canonical状态entry /30 owner-level machine、38错误和字段身份是否进入范围 | 通过 | §8.6全量词汇约束 |
| 相邻仓是否只验接缝且不越权 | 通过 | §8.7;backend内部语义不裁决但candidate资格保留P0-Q |
| 非范围是否说明对最终结论的影响 | 通过 | §8.8六类影响口径,无“后续再说”泛化项 |
| VF-SBX-001~010是否完整映射 | 通过 | §8.9 10 /10 |
| VETO-CFG-01~16是否完整映射 | 通过 | §8.10 16 /16 |
| RR-SBX-001~008是否有范围归属且未伪造接受 | 通过 | §8.11 8 /8,全部仍`pending_for_06` |
| Canonical C / FR / BR / AC是否存在范围漏项 | 通过 | §8.13反向审计无漏项 |
| 需求AC与细分验收项编号是否避免冲突 | 通过 | §8.12固定canonical / scope / future category边界 |
| 是否发现需要回写上游的冲突 | 否 | §8.15=`no_upstream_writeback_required_for_step_2` |
| 是否伪造送验 /run /EV /结果 /风险接受 /签署 | 通过 | 全文只有范围、planned /Blocked /conditional语义 |
| 是否越级进入Step 3、正式正文或`07` | 通过 | 仅创建Step 2文件;正式`06`和未来ledger / skeleton未修改 |

---

## 13. 进入下一步条件与当前恢复点

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收核心目标可裁决 | 通过 | AG-SBX-01~11覆盖完整隔离闭环、证据和诚实范围 |
| P0 / P1 / P2边界清楚 | 通过 | 双P0轴、conditional和future规则明确 |
| 只验接缝能力清楚 | 通过 | §8.7覆盖核心相邻仓 /外部依赖 |
| 非范围对最终结论影响清楚 | 通过 | §8.8分类明确 |
| VETO候选与正式词汇范围清楚 | 通过 | §8.6 /§8.9 /§8.10 |
| Step 2用户审查 | 已确认 | 用户明确回复“同意”;允许进入Step 3 |

```text
current_document = `06-验收标准.md`
current_step = Step 2 `明确验收目标与范围`
current_module = `completed_reviewed`
gate_status = passed_to_step_3
gate_reason = 核心目标、P0-C / P0-Q、P1 / P2、24个范围项、Profile、55协议 /31 canonical状态entry /30 owner-level machine /39 shared declaration /38错误、接缝、非范围影响、VF / VETO和RR范围已闭合;无未解上游设计冲突
next_allowed_action = 本Step已收口;由`06_acceptance_step_03_baseline.md`接续
formal_document_write = prohibited_until_step_15
real_acceptance_execution = not_started
real_evidence_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```
