# Step 14. 定义回归策略与残余风险

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 14
> 书写规范: `standards/document/测试方案书写规范.md` §5.14
> 回填章节: `05-测试方案.md` §14 回归策略与残余风险
> 生成日期: 2026-07-13
> 状态: reviewed_passed_to_step_15
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 定义设计 /实现 /配置 /测试 /证据变化如何选择并升级回归,以及非P0未覆盖项如何进入有owner、有期限来源、有重开触发的残余风险。本文不执行测试,不创建run / EV /报告 /缺陷 /风险接受实例,不裁决release或验收。

---

## 1. Step状态与Step内计划

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 13并允许进入Step 14 | 是。用户明确回复“同意呀”;本次只放行Step 14。 |
| flow /项目台账是否允许进入 | 是。Step 13原为`pass_wait_review`,本次转为`passed_to_step_14`。 |
| 是否读取当前标准 | 是。已读取测试SOP Step 14、书写规范§5.14及中间产物规范的固定十段结构 / Step内计划要求。 |
| 是否读取前序输入 | 是。已复核Step 2 /3 /6 /8~13、正式`00~04`风险边界、L1-governance / L1-artifact Step 14、L1-identity / work引用及L2 tools / runtime / member-service消费边界。 |
| 上游设计缺口与处理 | `SBX-TEST-REGRESSION-META-001`已通过Step 13 /9 metadata writeback关闭。正式`00~04`未发现需回写的新冲突。 |
| 当前状态 | M1~M4、Step 13 /9 metadata回写、回填草稿与自检全部完成;用户已确认并传递至Step 15。 |
| 停审边界 | 本Step完成后等待用户审查;未经确认不得进入Step 15或修改正式`05-测试方案.md`。 |

### 1.1 Step内计划

| 序号 | 计划项 | 状态 | 产物位置 /下一动作 |
|---:|---|---|---|
| 1 | 读取输入和前序结论 | done | §2及上表 |
| 2 | SOP问题回答 | done | §3 |
| 3 | 当前材料 /旧文档诊断 | done | §4 |
| 4 | 设计取舍 | done | §6 |
| 5 | 结构化中间产物 | done | 主件§7 + residual分件 |
| 6 | 复杂度判断 /是否拆模块或附录 | done | M3拆为`05_test_plan_step_14_residual_risk_register.md`;其余保留主件 |
| 7 | 回填草稿 | done | §8,只摘录M1~M4结论 |
| 8 | 自检与进入下一步条件 | done | §10;等待用户审查,未进入Step 15 |

### 1.2 结构化模块执行顺序

| 模块 | 内容 | 当前状态 | 模块门禁 |
|---|---|---|---|
| M1 trigger | 变更类型到TC / suite / check / gate | done | §7.1~§7.3覆盖Sandbox全部P0边界且不混入consumer语义 |
| M2 scope | targeted / family / suite / P0-C / P0-Q / release升级算法 | done | §7.4~§7.7双轴选择、固定集合、失效和停审可判定 |
| M3 residual | conditional / P1 / P2风险、不可接受项、接受角色 /重开触发 | done | 分件8项residual、8类不可接受项及下游转交通过停审 |
| M4 handoff | Step 13 metadata回写、`06/07/09`转交、停审 /跨风险审计 | done | §7.9~§7.12;metadata blocker已关闭,无unresolved上游冲突 |

## 2. 本步输入与事实边界

| 输入 | 已确认事实 | 本Step用途 |
|---|---|---|
| Step 2 /3 /6 | 38个CUT / CBC、254条TC、P0-C 237 / P0-Q 13 / conditional 4 | 回归选择只能回指正式CUT / TC,不得临时发明case |
| Step 8 | ENV-01~07 / PROFILE-01~07及fake / controlled / candidate-real / real-like成熟度 | 防止低成熟度环境替代P0-Q或release |
| Step 9 | 16 suite、7 gate、17 planned脚本和选择性执行边界 | 回归最小集与gate升级的直接执行契约 |
| Step 10 | 六类NFR、结构有界P0与量化conditional分层 | 确定专项变更和无正式阈值风险 |
| Step 11 | S / A / B、L-R1~L-R5、复验、证据失效与风险接受 | 回归不得弱化缺陷复验或把blocker变residual |
| Step 12 | P0-C / P0-Q / release进入退出、250条P0与4条conditional | 定义全量集合和不得补偿规则 |
| Step 13 + schema | 21 slot、fixed-run artifact / report / runtime EV / review / retention | 每次回归如何留证及旧证据何时失效 |
| 正式`00~04` | C / FR / BR / AC / VF、七模块、协议 /状态 /错误 /配置 /红线 | 识别语义变化、scope reopen和不可接受项 |
| L1 identity / work | 未形成新的Sandbox-owned suite;共享identity / work变化只能经正式carrier进入 | 由RT-002 /003 /018承接shared ref / context / consumer变化,不接管上游业务语义 |
| L2 tools / runtime / member-service | 消费Sandbox隔离 / launch /反馈边界,各自拥有工具语义、agent loop和member lifecycle | 定义consumer contract回归,禁止把其领域编排并入Sandbox |
| 旧README /旧`05/06` | historical material only | 旧Docker / gVisor、旧TC /环境 /数字不得成为回归阈值 |

当前事实边界:

- 所有suite、脚本、环境实例、run、artifact、EV、报告和risk acceptance均未形成,本文只能定义planned contract。
- 目标实现仓、ENV-05 candidate / capability / provider / lab缺失是执行blocker,不是可接受残余风险。
- PROFILE-06保持conditional unqualified,PROFILE-07保持inactive / design-reopen;二者不得补偿250条P0。
- `tools semantic execution`、`runtime agent loop`、`member lifecycle orchestration`是consumer owner语义,本Step只验证Sandbox输入 /输出协议与责任边界。

## 3. SOP问题回答

| SOP问题 | 回答 |
|---|---|
| 哪些变更触发最小回归 | 每项变化先映射正式C / FR / BR / AC / VF、模块 /协议 /状态 /错误 / FDT、CUT / PER / EHR,再运行全部受影响TC参数、owner suite、相邻副作用suite及适用check。changed-path只能扩大候选,不能缩小该下限。 |
| 哪些变更触发全量回归 | VF / VETO / S级相关变化,shared carrier / public protocol、core truth /状态、UoW /幂等 /race、四维边界、policy fail-closed、cleanup / redline、配置generation、redaction /依赖、gate / evidence integrity变化均至少升级P0-C全量;影响candidate identity /真实边界或形成release candidate时还必须新跑完整P0-Q并重新聚合release。 |
| 哪些风险暂不覆盖 | 仅正式conditional / P1 / P2范围:PROFILE-06 real-like与physical rollout、无产品 / workload / baseline的量化性能、PROFILE-07 production / peripheral / hot surface、跨仓完整E2E、长期soak / fleet-scale以及数值retention /物理介质。 |
| 谁接受残余风险 | 本文只指定责任角色和`pending_for_06`状态,不伪造姓名或签署。B级 / conditional风险由风险owner提出,测试负责人核证据边界,验收负责人在新版`06`裁决;安全 /架构 /运维角色按风险共同确认。 |
| 哪些风险必须转入验收标准 | P1 selected-run激活条件、量化阈值 / workload、production scope reopen、跨仓集成门禁、retention策略、风险接受角色 /期限 /失效条件以及P0-Q / evidence veto均须由新版`06`收口。 |

## 4. 当前材料与旧文档问题诊断

| 位置 | 具体缺口 /冲突 | 本Step处理 |
|---|---|---|
| Step 9 §4 / §9 | 已有suite触发词和gate选择性执行,但未形成跨设计 /配置 /测试 /证据变化的统一最小集算法 | M1建立精确change-to-suite / check矩阵,M2固定升级规则 |
| Step 11 §8 | 已有缺陷修复复验矩阵,但不能覆盖无缺陷的schema、profile、consumer和report变更 | 复用L-R层级并扩展非缺陷变更,不重定义缺陷等级 |
| Step 12 §7~§9 | 退出准则固定250条P0,但“全量回归”尚未区分P0-C、P0-Q与release固定run聚合 | M2建立三个不可互替的全量口径 |
| Step 13 `meta/context.json` | 只有gate / env / profile / suite identity,无法记录为何选择这组回归 | 登记`SBX-TEST-REGRESSION-META-001`,M4回写run intent / scope / change refs |
| Step 10 /正式`04`风险 | conditional量化、P06 / P07、rollout / alert / retention等开放项分散 | M3只汇总当前正式未覆盖风险,不把执行blocker包装成接受项 |
| L2 consumer材料 | tools / runtime / member-service仍可能按旧边界假设Sandbox拥有工具语义、agent loop或host lifecycle | consumer contract变化触发协议 / scope gate;语义越界直接design-reopen |
| 旧README /旧`05/06` | 旧后端、旧性能数字、旧环境和空checkbox可能回流成回归基线 | 继续historical隔离,不得作为最小集、阈值或已通过事实 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 回归触发 | suite各自触发词 + 缺陷复验 | 正式变更面到TC / suite / check / gate矩阵 | `07`可直接转成changed-surface gate |
| 全量口径 | 泛称gate / release | P0-C、P0-Q、release三层固定集合 | 防止fake / simulation或旧qualification替代 |
| 选择依据 | expected suite manifest有digest但无变更原因 | context记录run intent / scope / change refs | 回归证据可机器审计 |
| residual | 分散的conditional / profile / ops开放项 | 风险、影响、缓解、owner、期限来源、重开触发、下游关闭位置统一 | 新版`06`可直接裁决 |
| blocker | 可能与residual混写 | target repo / ENV-05 / S / A / design-reopen单列不可接受 | 不伪造risk acceptance或P0 pass |
| consumer边界 | 上游文档仅描述协作 | contract regression + scope-reopen并存 | 既验证接缝,又不收编相邻领域语义 |

## 6. 设计取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 所有变化是否全量 | 风险分层最小集,命中共享语义 /红线 /跨gate时升级 | 每次一律全量;或只按changed-path | 前者成本无界,后者会漏跨模块truth /安全影响 |
| 全量是否只有一种 | 分离P0-C / P0-Q / release | 把SUITE-013并入普通main;或只跑250 case不聚合证据 | candidate-real有独立identity /授权 /lab,release还需fixed-run checks |
| 最小回归是否抽样 | 全部受影响formal TC参数 + owner /相邻suite / checks | 同family任选代表case | 代表抽样无法证明55协议、30状态、38错误和19 race覆盖 |
| consumer变化如何处理 | 只验证Sandbox contract / disposition;语义越界design-reopen | 在Sandbox新增tools / loop / lifecycle E2E | 保持领域owner与初始重点边界 |
| 未覆盖项如何处置 | 仅B / conditional可进入residual,含角色 /触发 /下游裁决 | 把ENV-05缺失、S / A或P0 Blocked写成接受项 | 后者会绕过双门禁与安全红线 |
| report-only变化是否重跑产品case | raw schema / digest完整时可固定raw重生成并复核;否则重跑producer | 无条件重跑全部;或只改Markdown不检查 | 保留效率同时维持pairing / no-static真实性 |
| regression metadata放哪里 | 回写既有`meta/context.json` | 新建第十类machine artifact;或只写Markdown | 避免新增无必要schema,且让gate / report统一消费 |

结构化阶段必须保持上述取舍,不得在矩阵中引入低profile替代、静态EV、历史阈值或真实acceptance结论。

## 7. 结构化中间产物

### 7.1 M1引用与选择规则

- 表内`SUITE-001`统一展开为`SUITE-SBX-001`,TC family统一展开为`TC-SBX-<FAMILY>-*`;机器manifest必须保存逐个完整正式ID,不得保存range / wildcard。
- “全部受影响TC”指由Step 5 /6追溯得到的每个正式TC及其全部参数,不是测试负责人任选代表case。
- 最小回归集是下限:owner suite之外还必须加入副作用、失败、redaction、identity或scope所需相邻suite / check。
- “全量触发”列只说明最低升级方向;具体P0-C / P0-Q / release集合与决策顺序见M2。
- 责任人均为planned role owner,不是实际assignee、执行记录、risk acceptance或验收签署。

### 7.2 回归触发表

| Trigger ID /变更类型 | 正式影响面 | 最小回归集 | 全量 /重开触发条件 | 责任人 |
|---|---|---|---|---|
| RT-SBX-001 需求 /架构 / AC / VF | C / FR / BR / AC / VF、owner /依赖 /非范围 | 影响追溯得到的全部TC;owner suite;SUITE-003 /016适用;TC coverage | P0语义或任一VF变化升级P0-C;新增public /领域surface先design-reopen | 设计负责人 +测试负责人 |
| RT-SBX-002 shared carrier / protocol / metadata / digest / typed ref | CUT-001/002/009~013/023/029/031/032 | SUITE-001 /011 +受影响004~006 /010;protocol inventory / TC coverage | public schema、digest或55协议语义变化升级P0-C;release subject变化不得沿用旧结果 | contracts owner |
| RT-SBX-003 execution environment identity / intake / context / reference | CUT-003/014及identity相关state / error | SUITE-001 /002 /004 /010 /011;blocked propagation | formal identity、ownership或intake fail-closed变化升级P0-C;涉及qualification identity再加P0-Q | application owner +contracts owner |
| RT-SBX-004 resource / filesystem / network / process coherent boundary | CUT-004/015/034/036 | SUITE-002 /004 /010 /013;identity / redaction / cleanup checks | 四维任一语义、capability或substitution变化必须完整P0-Q;release候选升级release | boundary owner +security owner |
| RT-SBX-005 policy / authorization / high-risk launch / tool-runtime launch binding | CUT-005/016及launch deny / zero-call断言 | SUITE-002 /004 /010;涉及candidate加013;redaction / blocked checks | policy fail-closed、source / freshness或launch owner变化升级P0-C;真实路径再P0-Q | policy integration owner +security owner |
| RT-SBX-006 launch / run / capture / handoff与owner truth | CUT-006/009~013/017/020/029/032/035 | SUITE-002 /004~006 /010 /012;candidate路径加013;pairing / redaction | run truth、capture / handoff no-rollback或downstream ownership变化升级P0-C;真实lifecycle变化升级release | application owner +worker / jobs owner |
| RT-SBX-007 failure classification / control / typed error / recovery | CUT-007/018/026及38 error producers | SUITE-002 /004~006 /010 /012;受影响ERR全部参数;blocked propagation | error闭集、safe surface、stop-new-use或recovery truth变化升级P0-C;backend outcome变化再P0-Q | domain / application owner |
| RT-SBX-008 cleanup / lease / reaper / orphan / redline | CUT-007/008/018/019/025/030/035 | SUITE-002 /004 /006 /009 /010 /012 /013适用;cleanup / blocked / redaction | guard、release-call、containment、investigation或真实资源生命周期变化升级release | safety owner +operations owner |
| RT-SBX-009 query / projection / reconciliation / no-write | CUT-008/010/019/021/031 | SUITE-004 /006 /008 /010 /012;QRY / JOB / ERR适用;write-audit | read owner、degraded、rebuild / repair或zero-write语义变化升级P0-C | application / jobs owner |
| RT-SBX-010 event / relay / replay / UoW / idempotency / race | CUT-011/012/020/022~025 | SUITE-005 /007~010 /012;CNS / EVT / TXN / RACE / ERR适用;pairing / cleanup | commit / rollback、duplicate、stored result、winner或no-rollback变化升级P0-C + OPS;命中truth红线升级release | application / infra / worker owner |
| RT-SBX-011 config source / profile / material / builder / change | CUT-027~030/037/038;FDT / EHR | SUITE-003 /008 /010 /012 /014;profile适用时013 /015 /016;dependency / redaction | P01~04或generation语义变化升级P0-C;P05 identity变化P0-Q + release;P06 conditional;P07 /新source先reopen | config owner +runtime builder owner |
| RT-SBX-012 observability hook / formal audit / redaction / safe carrier | CUT-012/029/032/035;AC-035/039/041 | SUITE-001 /003 /005 /006 /010 /012;material /candidate适用加013;redaction check | forbidden边界、audit ownership、all-carrier scan或safe surface变化升级P0-C;真实material变化再P0-Q / release | observability +audit +security owner |
| RT-SBX-013 dependency / workspace / registry / unsupported scope | CUT-031/033/038 | SUITE-003 /011 /016;dependency / protocol / TC coverage | 新sibling compile依赖、新public / config / remote / hot surface先回写`00~04`;修复后P0-C | architecture owner +contracts owner |
| RT-SBX-014 dataset / fixture / fake parity / scheduler / fault / harness | Step 7 data、TC参数、L1~L6 harness | 受影响suite全量;shared helper加SUITE-008~010 /014适用;相关checks | fake / UoW / scanner / scheduler共享语义变化升级受影响gate;旧harness结果失效;fake不得替P0-Q | test harness owner |
| RT-SBX-015 suite manifest / gate / status propagation / coverage | 254 TC主归属、16 suite、7 gate | 受影响suite + TC / protocol / blocked / pairing checks | P0分母、主归属、Blocked分类或MAIN / OPS范围变化升级P0-C;release聚合变化升级release | test tooling +release owner |
| RT-SBX-016 artifact / report / evidence schema或generator | Step 13 schema、ESLOT、runtime EV、acceptance draft | 兼容raw可固定run重生成;pairing / no-static / redaction / blocked checks;不兼容则重跑producer | item / digest / source-run / acceptance引用或evidence有效性变化升级release | report / evidence tooling owner |
| RT-SBX-017 candidate backend / capability / template / provider / lab | CUT-034~036;P0-Q identity packet | SUITE-013完整13 TC + identity / redaction / cleanup,不得拼接旧case | 任一subject / candidate / profile / generation / capability / template / env / provider变化均完整P0-Q;送验再release | backend qualification owner +security owner |
| RT-SBX-018 L2 tools / runtime / member-service consumer contract | shared input / launch / disposition / feedback接缝 | SUITE-001 /004 /005 /010 /011 /016 + consumer owner的contract tests;不得计作Sandbox P0替代 | shared schema变化升级P0-C;要求tools semantics / agent loop / member lifecycle进入Sandbox则design-reopen | cross-project integration owner |
| RT-SBX-019 S / A / B缺陷修复 | Step 11等级与原失败追溯 | S按L-R5;A至少原TC + family + suite / gate;B按conditional范围;全部保留failed / fixed run | S、VF / VETO、跨gate或release后发现升级release;A不得以risk acceptance跳过 | defect owner +测试负责人 |
| RT-SBX-020 纯文档 /模板文案 | 不改变formal ID、语义、path、schema、阈值或状态 | traceability review;若只改Markdown且raw兼容,按RT-016重生成 / pairing | 一旦影响正式语义、机器path / schema或验收引用,转对应RT而非免测 | 文档负责人 +测试负责人 |

### 7.3 M1重点边界反查与模块停审

| 必须保持的Sandbox边界 | Trigger承接 | M1结论 |
|---|---|---|
| execution environment identity | RT-003 /017 | contract identity与qualification packet分层,旧identity不可复用 |
| resource / filesystem / network / process | RT-004 | 四维coherent set整体回归,不逐维fallback |
| tool / runtime launch policy | RT-005 /018 | 只回归binding / disposition,不接管工具语义或agent loop |
| execution / artifact capture / handoff | RT-006 | capture fact、downstream refs与owner truth不混层 |
| observability hooks / formal audit / redaction | RT-012 | telemetry不替代audit,all-carrier redaction变化升级 |
| failure classification / recovery | RT-007 | 38 error closed set与stop-new-use / no truth rewrite保持 |
| cleanup / lease / reaper / redline | RT-008 | guard-first、honest disposition、containment不可降级 |
| UoW / replay / idempotency / race | RT-010 | 三通道、duplicate、winner / loser和no rollback共同回归 |
| config / profile / activation | RT-011 | P05 / P06 / P07成熟度和重开规则不互替 |
| dependency / consumer responsibility | RT-013 /018 | 非core sibling和领域越界均先reopen,不靠测试兼容 |
| test / report / evidence integrity | RT-014~016 /019 | harness与raw / report变化均有失效和升级入口 |

M1自检通过:20类trigger覆盖38个CUT的owner变化、16 suite、7 gate、全部重点边界与consumer裁剪;未创建TC、suite、脚本、run或结果。下一模块只允许定义scope / escalation,不得改写上述责任边界。

### 7.4 M2回归范围与效力

| Scope | 最低执行集合 | 允许用途 | 不具备的效力 |
|---|---|---|---|
| `Targeted` | 全部直接受影响TC参数 +原负向fixture +直接check | 局部实现修复的快速反馈 | 不能单独关闭A / S、证明suite、P0-C或release |
| `Family` | 受影响protocol / state / error / owner family全部TC +相邻副作用断言 | shared DTO / enum / mapper / owner flow变化 | 不能以代表case代替完整family,不能证明未跑suite |
| `Suite` | 受影响suite完整manifest +适用check | fixture / repository / adapter / scheduler / scanner / shared helper变化 | 不能替代其他受影响suite或gate |
| `P0-C` | 新固定MAIN:SUITE-001~011 /014 +新固定OPS:SUITE-012及007~010 /014扩展 + SUITE-016 scope guard;237条P0-C及适用checks | deterministic core regression和P0-C资格 | 不证明candidate-real四维边界,不能替代P0-Q或release |
| `P0-Q` | 同一qualification packet下SUITE-013完整13条TC + identity / redaction / cleanup / blocked / pairing | 固定candidate / subject / PROFILE-05 / generation / capability / template / env / provider资格 | 不证明237条P0-C,不得由ENV-02~04 /06或历史packet替代 |
| `Release` | 同一design / subject / core / harness revision下的新固定MAIN-CONTRACT + MAIN-SEAM + OPS + P0Q四源,各自profile-specific config identity、250条P0、全部checks / reports / evidence index / acceptance draft | 送新版`06`裁决的唯一测试聚合 | 不等于验收通过;SUITE-015 / P1不能补偿 |
| `Conditional` | 只含已正式激活的SUITE-015参数;SUITE-016仍作为scope guard运行 | P1 real-like /量化候选或P2 scope观察 | NotRun / unavailable不影响P0,也不产生P0证据 |
| `DesignReopen` | 暂停相关测试,回写owner `00~04`并重开Step 2 /5~14 | 新public / config /领域surface或无唯一断言 | 不是可执行回归scope,不得用测试私有语义绕过 |

P0-C与P0-Q是两个正交资格轴,不是单一线性等级。一个change可只要求P0-C开发回归,也可只要求同identity P0-Q重资格;任何release candidate始终要求两轴均为同一送验基线的新有效结果。

### 7.5 M2选择与升级算法

```text
freeze immutable change set / design + subject + config refs
  -> map each change to formal IDs and RT-SBX-* rows
  -> union every directly affected TC parameter / suite / check
  -> expand negative, side-effect, error, race and owner-adjacent coverage
  -> apply old-result invalidation matrix
  -> evaluate design-reopen first
  -> derive P0-C scope and independent P0-Q-required flag
  -> if release intent: force complete P0-C + complete P0-Q + all evidence checks
  -> write exact selection identity before execution
  -> missing / extra-unreviewed / identity mismatch => Blocked, never silently shrink
```

| 决策规则 | 强制口径 |
|---|---|
| 多项change同时出现 | 对TC / suite / check取并集,scope只升级不取交集;最严格reopen / redline规则优先 |
| 影响无法映射formal ID | 不是“无测试影响”;转DesignReopen,先补上游追溯 |
| changed-path / ownership hint | 只能提供候选并扩大范围;不得删除RT表、manifest或traceability要求的项目 |
| shared contract / truth / state / UoW / config generation | 至少P0-C;若形成release subject则另跑完整P0-Q |
| candidate / capability / boundary template / provider identity | 完整P0-Q;任何字段变化使旧packet整体失效 |
| VF / VETO / S级 / evidence伪造 /跨gate缺陷 | 完整Release;先保留现场并关闭缺陷,不得接受为residual |
| A级缺陷 | 至少Family / Suite,按RT升级受影响gate;P0退出前必须关闭 |
| B级或conditional | 可Targeted / Conditional,但有scope升级条件时仍升级;不能改P0状态 |
| release intent | 不论此前Targeted / Family是否绿色,都重建固定MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q四源和全部送验证据 |
| 未经review的额外case | 可作为diagnostic补强,不得改变formal分母 /主归属 / pass聚合 |

### 7.6 既有结果与证据失效矩阵

| 变化 /发现 | 可保留内容 | 必须失效 /重做 |
|---|---|---|
| product code、shared contract、truth / state / error / UoW语义 | 旧run仅作historical comparison | 受影响TC / suite Passed与EV不再证明新subject;按M1新run |
| fixture、fake parity、assertion、scheduler、fault injector、harness | 原raw保留供调查 | 全部受影响参数 / suite旧结果对新harness失效 |
| suite manifest / P0分母 / expected TC变化 | 旧raw中仍存在的case可作诊断 | coverage / gate / index失效;只有完整覆盖新manifest才可重新聚合 |
| config generation / profile / source /dependency binding | 旧组合结果保留 | 新组合对应gate重跑;禁止跨generation拼接 |
| P0-Q八类qualification identity任一变化 | 旧packet immutable保留 | 整个SUITE-013 packet与EV失效,完整重跑且0 case复用 |
| redaction deny catalog / scanner变化 | digest可验证的immutable artifact可供重扫 | 旧redaction结论失效;carrier缺失 /不可重扫时重跑producer |
| report template / generator但raw schema兼容 | 产品raw / case status可保留 | reports / index / acceptance draft失效;固定raw重生成并复跑pairing / no-static |
| artifact / evidence schema或digest规则不兼容 | 旧artifact保留作historical | 无法按新schema验证时重跑producer;不得手工转写补证据 |
| gate / blocked propagation / release aggregation | source raw按identity可保留 | gate summary、release index与acceptance draft失效;重新聚合并复核全部checks |
| defect重开、redline调查或evidence source失效 | 原failed / passed材料均保留 | 相关EV标记invalidated / superseded,新版`06`停止消费旧通过结论 |
| 纯文案且formal IDs /语义 /path /schema /digest不变 | raw、report事实和EV source可保留 | 只需文档traceability review;不得借“文案”掩盖机器契约变化 |

### 7.7 M2模块停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| Targeted是否可能冒充P0退出 | 否 | §7.4明确效力上限 |
| P0-C / P0-Q是否互相替代 | 否 | 双轴模型与固定集合 |
| release是否绑定同一送验基线 | 是（设计） | 新MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q四源 + fixed refs,当前无实例 |
| qualification是否可拼历史case | 否 | §7.5 / §7.6整包失效 |
| scope不明是否默认少跑 | 否 | DesignReopen / union / Blocked规则 |
| 旧证据是否会被覆盖 | 否 | immutable + invalidated / superseded |
| conditional是否补偿P0 | 否 | Conditional效力上限 |

M2自检通过:回归选择已从单一“最小 /全量”拆为可判定的开发scope、P0-C轴、P0-Q轴和release聚合,并闭合变化后的证据失效。下一模块只允许汇总当前正式conditional / P1 / P2风险,不得把执行blocker、S / A或design-reopen列为可接受项。

### 7.8 M3残余风险分件承接

完整M3结构化产物位于`05_test_plan_step_14_residual_risk_register.md`。拆分原因是风险表需要同时保存正式来源、未覆盖原因、影响、缓解、risk owner、acceptance role /状态、期限来源 /重开触发和下游关闭位置;压入主件会降低审查可读性。分件属于当前Step,不是未来Step或正式验收记录。

M3已闭合:

1. `RR-SBX-001~008`仅覆盖PROFILE-06 /07、量化候选、跨仓E2E、长期lifecycle / fleet、physical rollout、真实alert / sink、真实material anti-leak和数值retention /介质。
2. 每项均为`pending_for_06`,有risk owner、acceptance role、condition-based期限来源、重开触发和`06/07/09`关闭位置;没有姓名、日期或签署。
3. target repo / suite / ENV-05缺失、S / A、VF / VETO、P0 gate失败、design-reopen、真实material anti-leak未满足等均单列不可接受,未伪装成residual。
4. 新版`06`负责裁决是否接受及适用release;`07/09`只实现 /运行物理策略,不能自行接受风险。

M3自检通过;M4必须先回写Step 13 regression metadata并关闭`SBX-TEST-REGRESSION-META-001`,再完成跨回归 /风险审计与正式§14回填草稿。

### 7.9 M4 Run Metadata、Gate与证据效力

Step 14已将`SbxRunIntent`,`SbxRunScope`,`trigger_refs[]`,`change_refs[]`回写Step 13 `meta/context.json`,并将writer输入回写Step 9。Diagnostic不属于七个正式gate,因此其context / suite report省略`gate_id`;其他intent必须携带合法gate。该修正不新增schema文件、suite、gate或脚本。

| Run用途 | intent / scope | Gate /环境 | 必需归档与效力 |
|---|---|---|---|
| diagnostic | Diagnostic / Diagnostic | 无正式gate;ENV-01 / PROFILE-01 | context +适用raw / report;不得生成P0 EV或退出效力 |
| PR /局部回归 | Regression或DefectRetest / Targeted / Family / Suite | GATE-SBX-PR或MAIN;ENV-02 /03适用 | exact trigger / change / suites;只具§7.4声明效力 |
| P0-C全量 | Regression / P0C | GATE-SBX-MAIN的MAIN-CONTRACT + MAIN-SEAM、GATE-SBX-OPS,并运行PR / scope guard | 237 P0-C、controlled seam补强、checks和fixed三源P0-C reports;不证明P0-Q |
| P0-Q资格 | Qualification或Regression / P0Q | GATE-SBX-P0Q;ENV-05 / PROFILE-05 | SUITE-013完整packet、identity / cleanup / redaction;不证明P0-C |
| release聚合 | ReleaseAggregation / Release | GATE-SBX-RELEASE;聚合器SBX-ENV-02 / SBX-PROFILE-02 | 按序fixed MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q refs、250 P0、all checks / reports / evidence / draft;聚合器身份无证明效力,只交新版`06` |
| P1 selected | Conditional / Conditional | GATE-SBX-P1;ENV-06 / PROFILE-06 | 仅激活SUITE-015;NotRunConditional不影响P0 |
| scope检查 /重开 | Regression / Suite | GATE-SBX-SCOPE-REOPEN;SUITE-003 /016 static | absence可归档;命中新surface后停止并回写设计,不得继续测试兼容 |

回归run的`evidence-index.json`仍按Step 13 gate-specific expected slots投影。Targeted / Family / Suite只为实际expected slot生成item,不得伪装完整P0 index;Release固定ESLOT-SBX-001~019,conditional slot 020 /021不补偿。

### 7.10 M4下游承接表

| 下游 | 直接输入 | 必须形成 | 禁止形成 |
|---|---|---|---|
| 新版`06-验收标准.md` | Release scope、RR-SBX-001~008、不可接受项、evidence invalidation | 适用release、risk authority / condition expiry、P0-Q / evidence veto与裁决矩阵 | 从planned表推断pass、accepted或签署 |
| `07-实施计划.md` | RT-SBX-001~020、scope算法、context字段、suite / check / gate集合 | changed-surface selector、gate writer / report boundary、precheck、implementation ledger与planned skeleton | 实现前伪造repo /产品 / env / run / commit |
| `09-部署与运维手册.md` | RR-005~008、retention guard、OPS / P0Q identity | soak / reaper、rollout / rollback / drift、alert / runbook、介质 / TTL物理策略 | 越过condition guard删除artifact或改写产品truth |
| consumer projects | RT-018、shared protocol / disposition、scope redline | tools / runtime / member-service自有contract与integration tests | 把工具语义、agent loop、member lifecycle移入Sandbox |
| future `00~04` reopen | RT-001 /011 /013 /018和RR-003触发 | 先更新正式scope / object / protocol / config,再重开Step 2 /5~14 | 测试私有字段、状态、error、config或兼容路径 |

### 7.11 M4回归停审与跨风险审计

| 审计项 | 结论 | 依据 /当前事实 |
|---|---|---|
| 20类change是否都有最小集 / owner /升级条件 | 通过 | §7.2 RT-SBX-001~020 |
| 38个CUT是否有trigger入口 | 通过 | RT-002~013覆盖CUT-SBX-001~038 |
| 16 suite /7 gate是否可被回归选择 | 通过 | §7.2、§7.4、§7.9完整引用 |
| 237 P0-C /13 P0-Q /250 P0 /4 conditional是否混算 | 否 | 双轴 + Release / Conditional效力分离 |
| execution identity与四维边界是否必须真实重资格 | 是（设计） | RT-003 /004 /017;当前ENV-05仍Blocked |
| launch / capture / observability / failure / cleanup / redline是否可漏回归 | 否 | RT-005~008 /012和M1反查 |
| tools / runtime / member领域语义是否混入 | 否 | RT-018只验证consumer接缝,越界即reopen |
| 旧Passed / EV是否会跨identity继续消费 | 否 | §7.6 invalidation / supersede |
| regression选择依据是否可机器归档 | 是（设计） | Step 13 /9 writeback完成;当前无run实例 |
| residual是否有无owner /无触发项 | 否 | 分件8 /8有角色和condition expiry |
| blocker / S / A / VF / VETO是否被risk acceptance | 否 | 分件§6全部不可接受 |
| 是否使用历史数字 / backend或静态EV | 否 | historical隔离;当前0结果 /0 alias |
| 是否存在unresolved上游设计冲突 | 否 | metadata gap已`resolved_by_step_14_writeback` |

### 7.12 M4复杂度与总停审结论

主件保留trigger / scope / handoff主链,110行分件保留多维残余风险登记;无需继续拆分。`SBX-TEST-REGRESSION-001`已解析为`resolved_for_test_step_14`,`SBX-TEST-REGRESSION-META-001`已回写关闭。当前执行blocker和下游待确认仍按声明范围开放,但不阻塞Step 14设计完成。

## 8. 正式`05` §14回填草稿

### 14.1 回归策略

Sandbox回归采用风险分层选择。每项change必须先映射正式需求 /设计 / CUT / TC,执行全部受影响参数、owner suite、相邻副作用suite和适用check;changed-path只能扩大候选。正式§14应完整装配§7.2 RT-SBX-001~020回归触发表,不得压缩为“相关测试”。

回归范围分为Targeted、Family、Suite、P0-C、P0-Q、Release、Conditional和DesignReopen。P0-C与P0-Q是正交资格轴:前者固定MAIN-CONTRACT + MAIN-SEAM + OPS及237条P0-C和controlled seam补强,后者固定ENV-05 qualification packet与13条P0-Q;Release必须聚合同一送验基线的新四源、250条P0和全部证据检查,但仍不等于验收通过。

任一VF / VETO / S级、shared contract / truth / UoW、四维边界、policy fail-closed、cleanup / redline、generation、redaction / dependency或evidence integrity变化按§7.5升级。新public / config /领域surface或无formal断言来源直接DesignReopen。旧结果按§7.6保留但失效 / supersede,不得覆盖或跨identity拼接。

### 14.2 残余风险

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人 |
|---|---|---|---|---|
| RR-SBX-001 P06 real-like / durable parity | 产品composition未qualified | 不证明real-like / outage | P0双门禁 +条件激活SUITE-015 | acceptance owner,`pending_for_06` |
| RR-SBX-002 量化性能 /容量 /成本 | 无产品 / workload / baseline | 无数值SLO结论 | P0结构有界 +诊断trend | acceptance owner,`pending_for_06` |
| RR-SBX-003 P07 production / remote / hot | current scope inactive | 无production topology证明 | SUITE-016 absence +触发即reopen | acceptance owner,`pending_for_06`（scope decision） |
| RR-SBX-004 consumer跨仓完整E2E | consumer baseline未锁 | 可能集成漂移 | Sandbox contract + consumer-owned tests | system acceptance owner,`pending_for_06` |
| RR-SBX-005 long soak / fleet reaper | 无topology /时间 /容量基线 | 无长期资源证明 | deterministic + OPS simulation + P0-Q lifecycle | acceptance / operations owner,`pending_for_06` |
| RR-SBX-006 physical rollout / rollback / drift | carrier / runbook未形成 | 不证明fleet aligned / rollback | strict generation + simulation,不宣称成功 | acceptance owner,`pending_for_06` |
| RR-SBX-007 real alert / sink / response | 产品 /阈值 / route未定 | 不证明operator响应 | safe hook / audit / logical signal | acceptance owner,`pending_for_06` |
| RR-SBX-008 evidence TTL /介质 | 无权威数值策略 | 无长期保留证明 | Step 13 condition guard | acceptance owner,`pending_for_06` |

所有residual必须使用分件中的risk owner、condition-based expiry、重开触发和下游关闭位置。S / A、VF / VETO、P0 Failed / Blocked、identity / raw / report / digest缺失、design-reopen及真实material安全前置缺失均不可risk acceptance。

### 14.3 回归证据

每个run必须在`meta/context.json`保存intent / scope / trigger / change refs。回归输出继续使用Step 13固定run目录、status闭集、pairing / redaction / no-static和runtime evidence规则;Targeted结果不得伪装Release index,任何acceptance draft只供新版`06`审查。

## 9. 待确认事项与开放范围

| 项 | 当前状态 | 是否阻塞Step 14 /15设计 | 关闭位置 |
|---|---|---:|---|
| RR-SBX-001~008实际接受 /拒绝、assignee与适用release | pending_for_06 | 否 | 新版`06`,不得在本Step伪造 |
| P06 selected-run何时必跑 | conditional_unqualified | 否 | `06`定gate,`07/09`形成环境 / composition |
| performance / capacity / soak正式workload与阈值 | no_authoritative_baseline | 否 | `06/07/09`;形成时重开对应trigger |
| P07 production / remote / hot是否进入范围 | inactive_reopen_required | 否 | 先回`00~04`,再重开测试链 |
| target repo、suite / scripts / CI与ENV-02~05实例 | open_for_07_precheck / execution | 否,但阻塞真实测试与release | `07` precheck /实施 /环境形成 |
| ENV-05 candidate / provider / lab | open_for_p0q_execution | 否,但P0-Q / Release保持Blocked | P0-Q资格形成 |
| retention数值 /介质与ops runbook | open_for_07_09_physical_policy | 否 | `06`最低条件 + `07/09`物理策略 |

## 10. 自检与进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 固定十段结构与Step内计划完成 | 通过 | §1~§10;计划8 /8 done |
| SOP回归触发表已输出 | 通过 | §7.2,20类trigger |
| SOP残余风险表已输出 | 通过 | 分件§5 +回填草稿§14.2,8项 |
| 最小 /全量 /双门禁 /release可判定 | 通过 | §7.4~§7.5 |
| 风险均有角色或待确认项 | 通过 | 无伪造assignee /签署 |
| 不可接受项未被降级 | 通过 | 分件§6 |
| 可供`06/07/09`直接引用 | 通过 | §7.10及分件§7 |
| 上游设计缺口已关闭 | 通过 | metadata已回写Step 13 /9 |
| 正式`05-测试方案.md`保持未修改 | 通过 | 只允许Step 15装配 |
| 是否创建真实run / artifact / EV /结果 /risk acceptance | 否 | 全部planned only |
| 是否存在阻塞Step 15设计的unresolved blocker | 否 | 执行 /激活blocker按下游范围保留 |

当前状态为`reviewed_passed_to_step_15`。用户已确认Step 14;只放行Step 15正式装配,不得跨入`06-验收标准.md`。
