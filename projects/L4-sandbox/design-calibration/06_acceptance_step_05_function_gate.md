# Step 5. 定义功能验收门禁

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 5
> 书写规范: `standards/document/验收标准书写规范.md` §5.5
> 回填章节: `06-验收标准.md` §5 功能验收门禁
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_6
> 所属流程: `06_acceptance_calibration_flow.md`
> 追溯分件: `06_acceptance_step_05_function_trace_register.md`
> 停审分件: `06_acceptance_step_05_function_review_register.md`
> 本Step口径: 将`C-SBX-1~5`、`FR-SBX-001~018`及canonical `AC-SBX-006~023`转成18个逐项可裁决的P0功能门禁,并闭环到正式设计、TC、planned ESLOT、future runtime EV / fixed report、通过 /失败条件与裁决影响。本文不执行验收,不创建EV /报告 /缺陷 /风险 /结论 /签署,不修改旧正式`06`,不进入Step 6。

---

## 1. Step状态与Step内计划

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 4 | 是。用户已明确回复“同意”;Step 4主件 /分件、flow和项目台账已转`passed_to_step_5`。 |
| 项目 /文档 /Step门禁 | 通过。当前只允许Step 5;正式`06`与Step 6仍禁止写入 /创建。 |
| 是否读取Step 5标准 | 是。已读取验收SOP Step 5和书写规范§5.5。 |
| 是否读取范围 /进入条件 | 是。已复核Step 2的AG / ASCP、Step 3四源 / RELEASE / evidence基线以及Step 4 AENT / APAUSE / AEXT。 |
| 是否读取功能来源 | 是。已复核正式`00` C / FR / BR / AC、`02`关键对象 / flow、`03`对象 /协议 /函数流 /错误、正式`05`覆盖 / TC / suite / ESLOT及测试Step 3 /5 /6 /13。 |
| 是否读取粒度参考 | 是。已读取L1-governance / L1-artifact验收Step 5;只参考逐项门禁、追溯、停审与跨功能审计结构,不继承其领域ID、EV或结论。 |
| 旧正式`06`定位 | historical material。旧`SandboxExecution / SandboxSession / CreateSession / AttachSession`主线、泛化API / DB / trace证据和空结论不得继承。 |
| 是否发现阻塞Step 5的上游冲突 | 否。18条核心FR均有canonical AC、正式flow、TC和planned producer;P0-Q执行缺失是runtime blocker,不是本Step设计断链。 |
| 当前真实验收状态 | `NotEntered`;目标仓、fixed source runs、RELEASE、raw / report、runtime EV和acceptance draft均不存在。 |
| 当前Step状态 | 主件、追溯分件、停审分件和机械 /语义自检已完成;用户已明确回复“同意”,Step 5审查通过并放行Step 6。 |

### 1.1 Step内计划

| 模块 | 内容 | 状态 | 完成门禁 |
|---|---|---|---|
| M1 范围 /编号 /phase边界 | 固定18项canonical AC和五组功能主题,裁剪Step 6~10职责 | done | 无平行AC、无后续门禁混入 |
| M2 功能门禁 | 为AC-SBX-006~023写通过 /失败 /证据来源 /裁决影响 | done | 18 /18可判定 |
| M3 逐项追溯 | 绑定设计对象 / flow、TC、ESLOT、future EV和fixed report | done | 18 /18无断链 |
| M4 单项停审 /跨功能审计 | 逐项审查正式来源、证据成熟度、条件与phase污染 | done | 无orphan、重复主证明或冲突裁决 |
| M5 回填草稿 /自检 /停审 | 形成正式§5草稿并更新两层台账 | done_reviewed | 用户已确认;`passed_to_step_6` |

### 1.2 模块级门禁

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|
| M1 范围 /编号 /phase边界 | done | done | done | done | pass | pass | 由M2接续 |
| M2 功能门禁 | done | done | done | done | pass | pass | 由M3接续 |
| M3 逐项追溯 | done | done | done | done | pass | pass | 由M4接续 |
| M4 停审 /跨功能审计 | done | done | done | done | pass | pass | 由M5接续 |
| M5 回填 /总审 | done | done | done | done | pass | passed_to_step_6 | 用户已确认;由Step 6接续 |

---

## 2. 本步目标与边界

### 2.1 本步必须完成

1. 以五个核心能力主题组织18条核心功能,但保持`FR-SBX-001~018 -> AC-SBX-006~023`一一对应,不因主题归并丢失失败定位。
2. 每个P0功能项同时具有正式需求 /设计来源、至少一个正向与一个负向TC、planned ESLOT、future runtime EV生成条件、fixed report入口、通过 /失败条件和裁决影响。
3. 对需要真实candidate证明的功能显式区分P0-C语义与P0-Q资格,不以fake、controlled seam、operations simulation或P1替代P0-Q。
4. 每项完成设计停审,再执行FR / AC / TC / slot / report双向覆盖、重复证据、裁决冲突、P1污染和路径断裂审计。
5. 形成正式`06` §5回填草稿,但只在Step 15装配正式文档。

### 2.2 本步不完成

- 不把truth ownership、外部正文、依赖裁剪和架构红线展开为本Step门禁;它们由Step 6裁决。
- 不逐项裁决55协议、9 Consumer、13 Event、10 Job及跨仓同步;它们由Step 7裁决。
- 不展开31 canonical enum entry /30 owner-level machine、事务、幂等、stored replay、19 race和一致性;它们由Step 8裁决。
- 不定义六类NFR、结构有界或数值阈值;它们由Step 9裁决。
- 不把pairing、digest、redaction、no-static、review完整性本身升格为功能项;它们由Step 10裁决。
- 不正式编号VETO、决定缺陷 /复验、接受风险或形成最终三值结论;它们分别由Step 11~14裁决。
- 不把tools semantic execution、runtime agent loop、member lifecycle orchestration、Artifact truth、observability store或policy truth混入Sandbox功能通过条件。
- 不创建真实run、runtime EV、report、acceptance record、实现代码、implementation ledger或planned boundary skeleton。

### 2.3 功能主题与canonical验收项

| 功能主题 | 核心能力 | 核心FR | canonical功能验收项 | 主要设计flow |
|---|---|---|---|---|
| 受控受理与execution identity | C-SBX-1 | FR-SBX-001~003 | AC-SBX-006~008 | `OpenControlledExecutionContextFlow` |
| coherent隔离边界 | C-SBX-2 | FR-SBX-004~006 | AC-SBX-009~011 | `EstablishExecutionBoundaryFlow`;`StartControlledExecutionRunFlow`适用 |
| launch policy与fail-closed | C-SBX-3 | FR-SBX-007~010 | AC-SBX-012~015 | `EvaluatePolicyExecutionFlow`;`StartControlledExecutionRunFlow` |
| run / capture / handoff | C-SBX-4 | FR-SBX-011~014 | AC-SBX-016~019 | `StartControlledExecutionRunFlow`;`RecordCaptureResultFlow`;`OpenMaterialHandoffFlow` |
| failure / control / cleanup / redline | C-SBX-5 | FR-SBX-015~018 | AC-SBX-020~023 | `SubmitSandboxControlFlow`;`ClassifySandboxFailureFlow`;`EvaluateCleanupReadinessFlow`;`RecordRedlineContainmentFlow` |

主题只是阅读分组,不是验收项、scope ID、TC、EV或总体结论。功能裁决的稳定ID只使用正式需求中的`AC-SBX-006~023`。

---

## 3. 本步输入与读取结论

| 输入 | 当前状态 | 本Step用途 |
|---|---|---|
| 验收SOP Step 5 /书写规范§5.5 | current | 提供八问、两张必备表、单项停审和跨功能审计门禁 |
| Step 2范围 | reviewed | 提供AG-SBX-01~05、ASCP-SBX-001~008、P0-C / P0-Q和P1 / P2证明上限 |
| Step 3基线主件 /登记分件 | reviewed | 提供四源role、RELEASE、fixed path、planned slot与runtime EV成熟度边界 |
| Step 4主件 /暂停恢复分件 | reviewed | 提供FormalEntryReady、当前`NotEntered`、暂停 /失效和退出传播规则 |
| 正式`00` §7 /§9 /§10 /§14 /§16 | reviewed requirements baseline | 提供C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、AC-SBX-006~023及反向追溯 |
| 正式`02` §5~§10 | reviewed HLD baseline | 提供六个组成部分、关键对象、接口骨架、主流程和异常边界 |
| 正式`03` §5~§8 /§11及其明确链接的`03_ddd_step_12_error_recovery.md` | reviewed detailed baseline + exact taxonomy source | 提供对象 / port /协议正式名、10 Command flow、38个typed error和恢复语义;正式§11是摘要,exact error全集按其校准来源读取 |
| 正式`05` §5 /§6 /§9 /§13 | reviewed planned test baseline | 提供CUT / PER、254 TC、16 suite、四源gate、21 ESLOT及fixed artifact / report路径 |
| 测试Step 5 /6及分件 | reviewed explanatory source | 提供逐FR CUT / PER、具体TC前置 /操作 /断言和P0-Q blocked成熟度 |
| 测试Step 13主件 /schema分件 | reviewed explanatory source | 提供slot producer、future EV生成条件、raw / report pairing和evidence index schema |
| 旧正式`06` | historical material | 只用于识别旧主语、泛化证据和空结论污染;不作为门禁来源 |

读取结论:

- `FR-SBX-001~018`与`AC-SBX-006~023`已经一一对应,无需创建平行`AC-SBX-FUNC-*`实例。
- 10个正式Command flow覆盖功能主线;Query / Consumer / Event / Job为读取、接缝和维护补强,不得反向成为第二业务truth writer。
- `TC-SBX-CMD-001~020`提供十个主flow的正负场景;状态、错误、consumer / event / job、qualification TC提供必要补强。
- `ESLOT-SBX-*`是planned catalog。只有真实case JSON、suite `report.json`、logs和validation checks齐全后,才可生成runtime `EV-SBX-<FAMILY>-<NNN>`。
- 当前P0-Q、fixed reports和runtime EV不存在,因此本Step只能完成设计门禁,不能填写任何功能项实际通过 /失败。

---

## 4. SOP问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 每个P0功能的通过条件是什么? | 对应canonical AC的正向、负向、拒绝 /降级和适用P0-Q分支全部满足;正式对象 /状态 /flow未被替代;required slot均形成同一fixed RELEASE可消费的有效runtime item。逐项见§8.3。 |
| 2. 每个P0功能的失败条件是什么? | 任一required正向不成立、负向被静默放行、正式状态 /owner被替代、P0-Q功能缺真实资格、或证据无法绑定同一RELEASE时失败 /不可判定。缺实现 /run /EV当前只表示NotEntered,不伪写产品Failed。 |
| 3. 证据来自哪些测试用例或报告? | 功能主证来自`TC-SBX-CMD-001~020`及适用CTR /STA /QRY /CNS /EVT /JOB /ERR /CONF TC;P0-C由MAIN-CONTRACT / MAIN-SEAM / OPS固定报告消费,P0-Q只由P0Q `SUITE-SBX-013`和QUAL slot消费。完整映射见追溯分件。 |
| 4. 哪些P1功能只做后置边界验收? | PROFILE-06 real-like resolver / durable store / bus / handoff / scheduler / sink、outage及physical change只在送验claim激活后成为mandatory;默认NotRunConditional,不得补偿P0。FR-SBX-E01~E06与PROFILE-07属于P2 / DesignReopen。 |
| 5. 哪些功能失败会导致总体不通过? | AC-SBX-006~023任一mandatory P0项不满足、Blocked、缺required evidence或争议未关闭,最终结论不得为“通过”或“有条件通过”;Step 11再判定是否同时构成VETO,Step 14负责唯一总体结论。 |
| 6. 每项能否回指需求 /设计、TC、证据ID和report path? | 能。需求 /设计 / TC / planned slot / future alias / fixed report /裁决影响逐项见追溯分件。planned slot和future alias均标明非实例。 |
| 7. 每项完成后是否通过停审? | 将逐项检查正式来源、正负TC、证据成熟度、条件可判定性、P0-Q不可替代和后续phase污染;记录见停审分件。 |
| 8. 是否存在P0缺门禁、证据重复或裁决冲突? | 当前抽取未发现;最终结论须在18项写入后通过跨功能审计确认。共享TC / slot只允许作为横切补强,每项仍有唯一FR / AC和功能主证。 |

---

## 5. 当前文档与historical material问题诊断

| 位置 /材料 | 问题 | 本Step处理 |
|---|---|---|
| 旧正式`06` §4 | 以`CreateSession / AttachSession / ApplyPolicy / RunCommand / CaptureOutput`等旧动作和`SandboxExecution / SandboxSession`为主语 | 全量弃用;改为canonical AC-SBX-006~023与当前10 Command flow |
| 旧正式`06`证据列 | 使用“API响应 / DB记录 / trace”等泛化证据,无TC、run、slot、raw / report pairing | 改为逐项TC、planned ESLOT、future runtime EV和fixed report路径 |
| 旧正式`06`结论列 | 使用空`[]`,没有通过 /失败条件或裁决传播 | 改为可判定条件;当前不勾选、不生成实例 |
| 旧正式`06`功能边界 | 把旧session / command / provider bridge叙事混入Sandbox | 明确不拥有tools semantics、runtime loop、member lifecycle和下游truth |
| 正式`00` canonical AC | 已有18个与FR一一对应的功能AC | 直接复用为功能验收项ID,避免第二编号真相源 |
| 正式`05` slot主引用 | AC / VF列是主要引用而非完整反向索引 | 逐项以TC -> CUT / PER -> slot producer为准;不把单个slot误称全部证明 |
| 当前执行事实 | 无目标仓、candidate、run、report或EV | 保持`NotEntered`;设计完成不等于功能通过 |

---

## 6. 改动前后对比

| 项 | 旧材料 /改动前 | 当前Step /改动后 | 原因 |
|---|---|---|---|
| 功能主语 | session / execution / command旧对象 | C-SBX-1~5、FR-SBX-001~018、当前domain对象与10 Command flow | 对齐current formal baseline |
| 验收项ID | 无稳定ID或旧表行 | AC-SBX-006~023一一对应FR | 保持需求到验收唯一truth |
| 通过条件 | “功能可用 /结果成功” | 正向 +负向 +owner /状态 +适用P0-Q +evidence全部满足 | 支持客观裁决 |
| 失败条件 | 泛化异常 | 明确silent allow、weak fallback、truth混层、guard绕过、证据缺失及资格缺口 | 支持失败定位与传播 |
| 证据 | API / DB / trace | TC + ESLOT + future EV + fixed suite / evidence report + raw回链 | 可复验、可审计 |
| 真实隔离 | controlled / fake结果可被误读 | P0-C只证明语义;P0-Q只认fixed candidate / PROFILE-05 | 防止低profile替代 |
| P1 / P2 | 易混入核心通过 | P1 claim激活后独立mandatory;P2 /外围先DesignReopen | 防止范围污染 |
| 当前结论 | 空checkbox容易被静态补齐 | 明确NotEntered /无运行期裁决 | 不伪造事实 |

---

## 7. 验收裁决取舍

| 议题 | 候选 | 取舍与理由 |
|---|---|---|
| 是否新建`AC-SBX-FUNC-*` | A. 新建18个平行ID;B. 复用AC-SBX-006~023 | 采用B。canonical AC已与18条FR一一对应,新ID只会增加映射层和同义漂移。 |
| 是否把5个核心能力各压成1项 | A. 5项;B. 18项 | 采用B。主题可聚合阅读,但FR级失败定位、TC /证据和缺陷反查必须保留。 |
| 是否将全部横切TC塞入每项 | A. 全量重复;B. 功能主证 +必要补强,后续Step加严 | 采用B。Step 5证明功能成立;协议 /一致性 /NFR /证据完整性由Step 7~10独立裁决。 |
| P0-Q是否只作为主题级总门禁 | A. 只写全局一句;B. 标到实际依赖真实行为的功能项 | 采用B。AC-SBX-009~011、013~014、016~018、020~023等必须诚实标注适用P0-Q,同时保留主题级不可替代规则。 |
| shared slot是否可单独证明多个功能 | A. 可以;B. 必须按item中的TC refs和断言切片消费 | 采用B。共享slot不等于一条suite绿色可替代18项逐条review。 |
| missing runtime evidence如何写 | A. 功能Failed;B. 当前NotEntered /未来item不可判定 | 采用B。当前没有真实acceptance batch,缺执行事实不能伪装成产品失败实例。 |
| 功能失败是否允许风险接受 | A. 可有条件通过;B. mandatory P0不得风险接受 | 采用B。P0功能缺口阻断通过与有条件通过;Step 13只处理允许范围内的B / conditional residual。 |
| 是否把VF直接写入功能结论 | A. 本Step判VETO;B. 记录候选影响,由Step 11统一编号裁决 | 采用B。避免功能门禁与一票否决双owner。 |

---

## 8. 结构化中间产物

### 8.1 功能门禁共同裁决规则

| 规则ID | 规则 | 失败传播 |
|---|---|---|
| FGR-SBX-01 | `AC-SBX-006~023`均为mandatory P0功能项;每项必须独立评估,不得只以五个主题或一条smoke汇总通过。 | 任一项Failed / Blocked / InfraFailed / missing / disputed,总体不得通过或有条件通过。 |
| FGR-SBX-02 | P0-C必须消费MAIN-CONTRACT主结果、MAIN-SEAM适用补强和OPS适用simulation;PR、diagnostic或单一suite绿色不能替代。 | source或required TC缺失使关联项不可判定并阻断。 |
| FGR-SBX-03 | 标记`P0-C + P0-Q`的功能必须同时有P0-C正式语义与P0Q fixed candidate真实行为;P0-Q只认PROFILE-05 / SUITE-SBX-013及资格identity。 | P0Q Blocked /缺identity /被host、fake、fixture、P1替代时关联项不得通过。 |
| FGR-SBX-04 | planned `ESLOT-SBX-*`只描述expected producer。实际裁决只能消费同一fixed RELEASE中的runtime item,alias模式为`EV-SBX-<FAMILY>-<NNN>`。 | 无合法raw / report pair、validation checks或runtime item时不可判定;不得静态补EV。 |
| FGR-SBX-05 | 每个runtime item必须按`tc_refs`和断言切片支撑具体AC;同一slot被多项引用不表示suite级Passed自动证明所有项。 | TC / assertion / AC反查缺失时关联项失败或暂停review。 |
| FGR-SBX-06 | 通过要求正向、必需负向和owner边界同时成立。expected reject / fail-closed / partial / retryable是合法功能结果,不得被误判为产品失败。 | 负向被silent allow、错误状态被归一success或owner truth被改写时功能失败。 |
| FGR-SBX-07 | 失败实例必须绑定正式TC、状态 /错误、raw / report和safe failure ref;当前没有执行事实时只记录`NotEntered`,不生成Failed实例。 | 静态结论、无raw失败或仅自然语言缺陷不能形成正式裁决。 |
| FGR-SBX-08 | Step 6~10的红线、协议、一致性、NFR和evidence门禁可以加严同一功能项,但不得改变本Step的FR / AC语义或把后续通过替代功能主证。 | 后续发现契约断链时触发DesignReopen;不得在`06`补造语义。 |

### 8.2 功能验收门禁表

证据来源列使用紧凑ID和future alias模式便于审查;逐项正式全名、producer、fixed report和raw路径见追溯分件。所有`EV-SBX-*`均为未来模式,不是当前证据实例。

| 验收项 | 功能 /场景 | 优先级 /证明轴 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|
| AC-SBX-006 | 受控执行请求语境接入 | P0-C | `OpenControlledExecutionContext`在真实执行前以body-free metadata / refs形成`ControlledExecutionContext`,accepted / rejected均有正式受理结果;duplicate只回放stored result。 | 先执行后补语境;required ref缺失 / resolver conflict / forbidden body仍Accepted;日志 /缓存或旁路建立formal context;duplicate重做副作用。 | CMD-001/002;CTR-003;TXN-007/010/011;ESLOT-002/008/010;future EV INTAKE / PROTOCOL / REPLAY。 |
| AC-SBX-007 | execution environment identity与责任链绑定 | P0-C | accepted context同时形成`ExecutionEnvironmentIdentity`及可回链actor / scope / responsibility / source refs;unresolved /越scope /异族ref不产生launchable identity。 | 匿名或不可归责identity Active;actor / member / work正文入仓;错误ref family被接受;context与identity分裂或事后补造。 | CMD-001/002;CTR-002;STA-001~003;ERR-014/015;ESLOT-002/008;future EV INTAKE / PROTOCOL。 |
| AC-SBX-008 | 跨调用方统一受控执行入口 | P0-C + P0-Q anti-substitution | API / trusted consumer / job等入口均通过同一metadata、idempotency、authority与formal command边界;Runner / tools / automation无host / local / direct-repository success路径。 | 任一调用方拥有第二套formal入口、绕service / guard写truth或host直跑被宣称sandbox success;P0Q identity允许错误candidate / host / fake替代。 | CTR-003/004;CMD-001/002;CNS-017/018;ARCH-003;CONF-011/012;ESLOT-002/008/016/019。 |
| AC-SBX-009 | 正式隔离环境建立 | P0-C + P0-Q | P0-C形成`BoundaryEstablishmentDecision`,`CoherentBoundary`,`IsolationEnvironmentHandle`,`LeaseRecord`;P0-Q同一fixed candidate实际建立并启动正式环境,无host fallback。 | partial / unavailable / stale capability仍Coherent或产生Active handle;裸跑后补记隔离;P0-Q缺失、Blocked或被低profile替代。 | CMD-003/004/007/008;STA-004~009;CONF-001/006/011/012;ESLOT-003/008/011/017/019。 |
| AC-SBX-010 | resource / filesystem / network / process统一边界限制 | P0-C + P0-Q | 四维requirement、capability、decision、handle、profile / generation与environment identity同代;P0-Q逐维allowed / forbidden / limit probe均符合声明。 | 任一维缺失、跨代、ignored或silent degrade仍launch;只证明其中一维;forbidden resource / path / network / process动作在candidate上成功。 | CMD-003/004;STA-004~007;CFG-005/010~018适用;CONF-001~005;ESLOT-003/013/017/019。 |
| AC-SBX-011 | 限制可落实性校验与整体拒绝 | P0-C + P0-Q | stale / unsupported / unavailable / incomplete / unverified capability使整体Pending / Rejected / Failed且0 bounded launch;P0-Q intentionally partial candidate同样被拒绝。 | weak fallback、partial handle、technical Degraded授权或default allow;unsupported candidate仍执行;失败被N/A / skipped掩盖。 | CMD-004/008;ERR-006/007/027/029/030;CONF-006/011/012;ESLOT-003/004/012/013/017/019。 |
| AC-SBX-012 | 启动前launch / isolation policy语境承接 | P0-C | `PolicyApplicabilitySnapshot`、policy / authorization refs和high-risk markers在run前形成;只保存body-free summary;missing / stale / conflicted保持非Accepted。 | 无正式policy语境仍launch;把DSL / approval正文写入Sandbox;从caller kind或technical config推断allow;query / consumer直接改既有decision为Accepted。 | CMD-005/006/008;CNS-007/008;STA-010~012;ERR-005/008;ESLOT-004/008/015。 |
| AC-SBX-013 | 给定策略内执行与高风险动作阻断 | P0-C + P0-Q | 仅`PolicyExecutionDecisionStatus::Accepted`且每个高风险动作`Allowed`时调用`IsolationBackendPort`一次;越权boundary expansion /外联 /敏感动作在P0-Q中不成功并形成安全结果。 | policy非Accepted或action Pending / Blocked / Unsupported仍backend launch;unauthorized probe成功;run拥有tool semantic或agent-loop truth。 | CMD-005~008;STA-011/012;ERR-005;CONF-004/005/007/010;ESLOT-004/005/011/017~019。 |
| AC-SBX-014 | policy缺失 /冲突 /不支持时保守拒绝 | P0-C +适用P0-Q | missing / stale / conflicted / unsupported / unsafe policy、authorization缺失或adapter unavailable均显式Rejected / Pending / FailClosed,backend调用为0;新summary只能产生新evaluation。 | permissive fallback、best-effort launch、technical Degraded授权、旧Accepted decision跨snapshot复用或低profile把Blocked写N/A。 | CMD-006/008;CNS-008;STA-010~012;ERR-005/027~030;CONF-006/012;ESLOT-004/012/013/019。 |
| AC-SBX-015 | 跨调用方统一策略执行口径 | P0-C | API / consumer / job入口使用同一policy snapshot / request digest / authority / stored replay与safe failure语义;trusted source不绕schema / guard。 | Runner / tools / automation按来源获得第二套allow / error语义;duplicate重新评估policy;consumer直接launch;不同channel同key不同digest不冲突。 | CTR-004;CMD-005/006/008;CNS-007/008/017/018;TXN-007~012;ESLOT-004/008/010。 |
| AC-SBX-016 | 执行输出统一捕获 | P0-C + P0-Q | `CaptureCollectionPort::collect_capture`返回body-free candidate;unknown只`inspect_capture`同一correlation;`CaptureFact::record(...)`创建即定格Complete / Partial / Failed / Unavailable且不可变;P0-Q对stdout / stderr / exit / file digest / diagnostic marker真实capture / inspect。 | capture fact出现Pending;unknown重新collect;complete但refs缺失;partial / failed原地改Complete;raw output进入carrier;材料被提前删除。 | CMD-007~010;QRY-007/008;STA-013/014;CONF-007/008/013;ESLOT-005/008/015/018/019。 |
| AC-SBX-017 | 候选材料安全收口 | P0-C + P0-Q | capture与`HandoffFact`分owner;opening提交fixed target plan +完整Pending progress set且delivery calls=0;每target先commit Attempting再单次deliver,unknown只inspect同attempt;aggregate机械派生;P0-Q验证真实材料生命周期。 | material使用DeadLetter;opening外呼;跳过Attempting;同attempt重送;unknown猜终态;aggregate手写;handoff失败删除 /改写capture或伪造Delivered。 | CMD-009~012;CNS-013/014;EVT-005/006;STA-014/015/031;ERR-009/037/038;CONF-008/013;ESLOT-005/008/015/018/019。 |
| AC-SBX-018 | 观测与审计材料分层交接 | P0-C +适用P0-Q | usage / trace / audit / observability material分别保留来源与safe refs;formal audit随accepted truth提交;observability material通过同一fixed target delivery交接;ordinary hook仅post-return / post-inspection、body-free、低基数、失败隔离。 | telemetry替代formal audit;另建generic observability delivery port;hook前置阻断主流程;observability store状态被Sandbox拥有;raw telemetry泄漏。 | CMD-009~012;CNS-015/016;EVT-005/006;QRY-025/026适用;CONF-008/013;ESLOT-005/007~009/015/018/019。 |
| AC-SBX-019 | 跨调用方统一结果回收链 | P0-C +适用P0-Q | API / consumer / event / job消费同一Capture / Handoff facts与stored result;handoff只更新matching attempt;publisher只消费committed frozen relay bundle + exact attempt且success=`Published`;duplicate exact重放。 | 第二capture / handoff truth;从latest truth重建payload;同attempt重复publish / deliver;duplicate重做;downstream feedback反写source。 | CMD-009~012;CNS-013~016/021/022;EVT-004~006/015;JOB-001/004;STA-024/031;ESLOT-005/008~010/018/019。 |
| AC-SBX-020 | 失败分类与原因归并 | P0-C + P0-Q | known source形成`FailureClassificationStatus::Classified`与正式`SandboxFailureKind`;unknown / mismatch保持Pending / Unknown;38 typed errors有safe surface;P0-Q backend / timeout / exceed / capture failure可分类。 | unknown被映射success;错误压成无owner字符串;raw backend detail泄漏;classification改写run / capture truth;真实失败无法归入正式kind。 | CMD-013~016;STA-016;ERR-001~038适用;CONF-002/005/007/008;ESLOT-006~008/012/018/019。 |
| AC-SBX-021 | 安全红线保守收束 | P0-C + P0-Q | `RecordRedlineContainment`形成Detected -> Contained / HandoffPending,同步阻断launch / cleanup / release并保留investigation refs;P0-Q redline probe得到同样保守结果。 | advisory-only、直接Released、handoff失败解除containment、越权继续运行或cleanup先行;P0-Q真实probe未执行 /被fake替代。 | CMD-019/020;CNS-019/020;STA-019;ERR-011;CONF-010/012/013;ESLOT-006~008/015/018/019。 |
| AC-SBX-022 | 非happy path材料留痕 | P0-C + P0-Q | deny / timeout / kill / cancel / replay / cleanup / reaper / redline均形成owner正确的`ControlFact`、failure / guard / relay / job report和safe audit;duplicate / conflict不造第二truth。 | 控制动作无正式记录;日志替代audit;retry / replay改写source;partial report隐藏;材料在review / investigation前删除;P0-Q disposition缺失。 | CMD-013~020;CNS-017~022;EVT-007~010/015;JOB-001/005~007;CONF-007~010;ESLOT-006~010/015/018/019。 |
| AC-SBX-023 | lease到期与orphan环境保守回收 | P0-C + P0-Q | expiry先stop-new-use并形成orphan / recovery事实;`CleanupGuard`非Allowed时release=0;reaper按item诚实报告;P0-Q真实inspect、single release attempt、材料 /调查保留和teardown闭合。 | expired / orphan在托管外继续;reaper绕guard;release失败写Released;cleanup重写runtime / member / artifact truth;活跃 /孤儿资源无disposition。 | CMD-017/018;CNS-011/012/019/020;STA-007~009/018;JOB-005/006;CONF-009/011/012;ESLOT-006~008/011/013/018/019。 |

### 8.3 单项通过 /失败判定算法

对每个`AC-SBX-006~023`,reviewer必须按以下顺序裁决,不得直接从suite总状态抄结论:

```text
canonical FR / AC applicable
  -> formal design objects / flow names still match fixed design baseline
  -> required positive and negative TC refs are present in expected manifest
  -> required P0-C source-run case results and suite reports are valid
  -> if P0-Q applies, fixed candidate qualification TC / identity are valid
  -> planned slots have runtime items with exact tc_refs / ac_refs
  -> raw / report / digest / validation pairing is valid
  -> all item-specific pass predicates true and no failure predicate true
  -> independent item review records Pass / Fail / Disputed / NotEvaluated
```

关键说明:

- 上述`Pass / Fail / Disputed / NotEvaluated`是未来单项review disposition,不是Sandbox业务状态或test artifact enum;本Step不创建实例。
- required negative TC预期得到Rejected / Blocked / FailClosed / Partial等合法surface时,只有断言与副作用边界符合设计才算测试Passed。
- 共享suite / slot只提供证据容器;item review必须核对exact `tc_refs`,`ac_refs`,assertions和raw artifact refs。
- 任一baseline identity或evidence失效按Step 4转Paused /新batch,不得只修改单项结论继续签署。

### 8.4 P1 / P2与外围功能后置边界

| 能力 /范围 | 默认地位 | 当前功能门禁影响 | 激活 /声明后的处理 |
|---|---|---|---|
| PROFILE-06 durable store / real-like resolver / bus / handoff / scheduler / sink | P1 conditional | 未声明时`NotRunConditional`,不补偿也不阻断当前P0功能 | 送验claim包含时升级ASCP-SBX-022为mandatory,固定独立P1 run与适用ESLOT-020;缺证阻断该claim |
| real-like outage、physical rollout / rollback / drift / TOCTOU drill | P1 conditional | simulation只证明P0 contract / guard,不宣称physical能力 | claim或合同触发时补正式产品 /环境 /动作前置并执行selected run;不得复用OPS simulation冒充 |
| FR-SBX-E01风险分层承载 / E04多宿主调度 / E05比较模拟 | P2 conditional /外围 | 未实现不影响AC-SBX-006~023;不得改变coherent boundary和policy truth | 声明current交付时先DesignReopen,回写`00~05`,再裁决AC-SBX-024及不污染核心 |
| FR-SBX-E02高级replay / inspect / operator、E03预览分析、E06趋势 | P2 conditional /外围 | 未实现不影响核心control / capture / observability material功能 | 声明current交付时先DesignReopen,不得让UI /分析结果替代truth / evidence |
| PROFILE-07 production / capacity / DR / hard SLO / fleet soak | P2 inactive | 当前不得写ready / accepted / production-like | 任一production claim先重开需求、架构、详细 /配置 /测试 /验收范围,不能直接风险接受 |
| unsupported remote / admin / reload / LKG / hot swap / immediate callback | current unsupported | 不属于功能happy path;输入或surface必须诚实拒绝 /不存在 | 新增要求触发`SBX-ACC-DESIGN-REOPEN-001`,不得在Step 5补造成功语义 |

### 8.5 功能门禁到范围 /证据双向摘要

| 功能主题 | AC数量 | P0-C主slot | 适用P0-Q slot | 主要source role | 设计停审 |
|---|---:|---|---|---|---|
| 受控受理与identity | 3 | 001 /002 /008 /010 /016适用 | 019仅anti-substitution适用 | MAIN-CONTRACT;MAIN-SEAM适用;P0Q适用 | 3 /3 PassDesign |
| coherent边界 | 3 | 003 /008 /011~013适用 | 017 /019 | MAIN-CONTRACT;MAIN-SEAM适用;P0Q | 3 /3 PassDesign |
| policy / launch | 4 | 004 /005 /008 /010~013 /015适用 | 017~019适用 | MAIN-CONTRACT;MAIN-SEAM;P0Q适用 | 4 /4 PassDesign |
| run / capture / handoff | 4 | 005 /007~010 /012 /015适用 | 018 /019 | MAIN-CONTRACT;MAIN-SEAM;OPS适用;P0Q | 4 /4 PassDesign |
| failure / cleanup / redline | 4 | 003 /006~013 /015适用 | 017~019适用 | MAIN-CONTRACT;MAIN-SEAM适用;OPS;P0Q | 4 /4 PassDesign |

上述slot是主题级反查摘要,不能替代追溯分件的逐项TC / AC / source映射。ESLOT-SBX-001~019仍由RELEASE完整expected catalog统一检查;本表只说明功能项主要消费关系,不裁剪其他Step拥有的P0 slot。

---

## 9. 复杂度与分批判断

| 检查项 | 结论 |
|---|---|
| 是否属于复杂Step | 是。18个功能AC跨5主题、10 Command flow、横切协议 /状态 /错误及P0-C / P0-Q双轴。 |
| 是否需要拆分 | 是。主件保留门禁 /裁决;追溯分件展开需求 /设计 / TC / slot / report;停审分件保存逐项与跨功能审计。 |
| 单文件是否超过500行 | 否。三文件均保持在强制拆分线内。 |
| 是否修改正式`06` | 否。只形成§5回填草稿。 |
| 是否创建Step 6或未来中间产物 | 否。 |
| 是否创建实现 /证据产物 | 否。无run、EV、report、review、风险、implementation ledger或boundary skeleton。 |

---

## 10. 正式`06` §5回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_05_function_gate.md`
> - `design-calibration/06_acceptance_step_05_function_trace_register.md`
> - `design-calibration/06_acceptance_step_05_function_review_register.md`
>
> 延伸阅读:
> - 建议继续阅读上述主件的“功能验收门禁表”“P1 / P2与外围功能后置边界”,追溯分件的“需求与设计契约追溯矩阵”“TC、planned evidence与report追溯矩阵”,以及停审分件的“逐项停审记录”“跨功能门禁裁决审计”,了解功能门禁如何从canonical FR / AC、正式flow和planned evidence收敛。

正式§5应保留下列裁决结论:

1. 功能门禁使用canonical `AC-SBX-006~023`,与`FR-SBX-001~018`一一对应;五个核心能力只作主题聚合,不替代逐项裁决。
2. 每项必须同时消费正式设计对象 / flow、正向与关键负向TC、planned slot派生的有效runtime item、fixed source reports和RELEASE evidence index;planned slot本身不构成证据。
3. P0-C由MAIN-CONTRACT主体、MAIN-SEAM适用接缝和OPS适用simulation证明;真实四维、launch、capture、failure、cleanup / redline等适用能力必须同时由P0Q fixed candidate证明。
4. `AC-SBX-006~023`任一mandatory项不满足、Blocked、缺required evidence或争议未关闭,最终结论不得为“通过”或“有条件通过”。是否命中一票否决由§11统一裁决。
5. expected Rejected / Pending / FailClosed / Partial / Retryable等是合法业务surface;只有TC断言、owner边界或副作用不符合正式设计时才是测试 /验收失败。
6. PROFILE-06未声明时保持NotRunConditional;P1 / P2、PROFILE-07、FR-SBX-E01~E06和unsupported surface不得补偿P0,声明current交付时按范围规则升级或DesignReopen。
7. 当前无target implementation、fixed run、runtime EV或acceptance batch,实际过程状态仍为`NotEntered`;正式§5不得预填任何项的Pass / Fail。

正式§5的门禁表直接使用本文件§8.2六列,但Step 15装配时不得删除追溯分件入口或把future EV形式写成已有alias。

---

## 11. 上游影响、blocker与待确认事项

### 11.1 对上游正式文档的影响判定

| 上游 | 复核结果 | 是否回写 | 结论 |
|---|---|---:|---|
| 正式`00` | 18条FR与AC-SBX-006~023一一对应,规则和核心能力足以判定 | 否 | 无需求断链 |
| 正式`01/02` | 责任、六组成部分、对象 / flow和边界与需求一致 | 否 | 无架构 /概要冲突 |
| 正式`03` | 10 Command flow、对象、port、状态足以落测试断言;§11明确把exact 38-error taxonomy指向`03_ddd_step_12_error_recovery.md` | 否 | 摘要未穷举不构成契约缺失;无详细设计断链 |
| 正式`04` | PROFILE-05 /06 /07与P0-Q / P1 / P2证明上限一致 | 否 | 无配置成熟度冲突 |
| 正式`05` | 18 /18功能覆盖、254 TC、slot / producer / path可追溯 | 否 | slot主引用是摘要,已按TC链正确消费,无需改catalog |

当前判定:`no_upstream_writeback_required_for_acceptance_step_5`。

### 11.2 Blocker处理

| Blocker | 状态 | 阻塞什么 | 不阻塞什么 |
|---|---|---|---|
| SBX-ACC-FUNCTION-001 | resolved_reviewed_passed_to_step_6 | 原功能门禁 /追溯 /停审缺口已关闭,且用户已确认 | Step 6已获放行 |
| SBX-ACC-DELIVERY-001 | open_for_delivery_baseline | 真实功能验收进入与subject裁决 | 功能门禁设计 |
| SBX-ACC-EXECUTION-001 | open_for_07_precheck_and_execution | suite / script / CI与source reports | 功能门禁设计 |
| SBX-ACC-EVIDENCE-001 | open_for_runtime_evidence | runtime item、单项Pass / Fail与总体结论 | planned evidence消费规则 |
| SBX-ACC-P0Q-001 | open_for_p0q_execution | 双轴功能项及整体P0实际通过 | P0-Q谓词与不可替代规则设计 |
| SBX-ACC-DESIGN-REOPEN-001 | blocker_if_triggered | 新 /冲突 /不可判定surface | 当前18项设计收口 |

当前没有阻塞Step 5设计收口或未来Step 6设计的未解决上游blocker。开放执行项使实际状态保持`NotEntered`,不得删除功能项或写虚假结论。

### 11.3 待确认事项

| 待确认事项 | 当前处理 | 触发时动作 |
|---|---|---|
| 具体candidate / provider / dedicated lab | 当前不存在;P0-Q保持Blocked | `07/09`实现 /环境准备后固定qualification packet,不得由设计仓选择假值 |
| caller-kind参数清单在未来case manifest的展开 | 正式角色边界已知,实现期按entry adapter / trusted source逐项列出 | 若出现新正式caller surface,重开`03/05/06`相关Step |
| shared slot中primary / supplemental AC refs的运行期展开 | 以Step 13 schema和已审catalog为准 | generator若无法表达,先重开测试Step 13,不得手写evidence item |
| PROFILE-06是否属于某次送验claim | 当前无claim,保持NotRunConditional | Step 3未来batch固定claim;激活后升级mandatory并建立独立run |

---

## 12. 自检与停审门禁

| 自检项 | 当前结论 |
|---|---|
| SOP八问是否逐项回答 | 通过;8 /8 |
| C-SBX-1~5是否全部聚合 | 通过;5 /5 |
| FR-SBX-001~018是否全部有唯一门禁 | 通过;18 /18 |
| AC-SBX-006~023是否全部有通过 /失败 /证据 /影响 | 通过;18 /18 |
| 每项是否有正式设计、TC、slot、future EV form和report path | 通过;见追溯分件 |
| 每项是否完成设计停审 | 通过;18 /18 PassDesign,不等于runtime通过 |
| 跨功能审计是否有unresolved冲突 | 否;见停审分件FCA-SBX-001~020 |
| P0-Q是否被fake /低profile /P1替代 | 否 |
| P1 / P2 /外围是否污染P0 | 否 |
| Step 6~10职责是否保持 | 是 |
| 当前真实状态是否诚实 | `NotEntered`;0 run / EV / report / review /结论 |
| 是否修改正式`06`、创建Step 6或实现产物 | 否 |

本Step已完成机械自检并停审。用户已明确回复“同意”,本Step、flow和项目台账转`passed_to_step_6`;现在只允许读取验收SOP Step 6、书写规范§5.6及数据 /架构红线来源并创建Step 6中间产物。

Step 6完成并经用户确认前禁止进入Step 7、修改正式`06`、创建`07` / implementation ledger / boundary skeleton,或生成真实run、EV、risk acceptance、结论与签署。

| 恢复字段 | 当前值 |
|---|---|
| current / gate | `06-验收标准.md` Step 5;`completed_reviewed_passed_to_step_6`;`passed_to_step_6` |
| user review | 用户已明确回复“同意”;只记录设计Step放行,不表示runtime验收通过 |
| next | 读取Step 6标准与输入,创建数据边界与架构红线验收中间产物 |
| prohibited | 正式正文、Step 7、真实执行 / evidence、implementation ledger、boundary skeleton;`commit_required = no` |
