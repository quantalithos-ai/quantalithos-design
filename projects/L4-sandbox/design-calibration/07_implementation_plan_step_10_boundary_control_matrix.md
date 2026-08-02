# L4-sandbox Step 10 Boundary 暂停与恢复控制矩阵

> 主件: `07_implementation_plan_step_10_rollback_pause_change_control.md`
> 上游: Step 5 `HDO-SBX-00` / `PH-01~14` / `PH-QP`;Step 6 `CB-SBX-01A~14C`;Step 7~9门禁、依赖与风险
> 当前成熟度: design_only;表中Gate、状态和证据均是未来实施约束,不是已执行事实

---

## 1. 使用规则

1. 本矩阵为Step 10分件,不创建implementation ledger或boundary skeleton;Step 13装配时才把每行控制规则写入对应planned skeleton。
2. 项目实现全程只允许一个current boundary。当前boundary暂停时,后序boundary保持`planned / wait_until_current`,不得以“依赖无关”为由并行开工。
3. 每行的“恢复Gate”是恢复后必须首先重跑的最早Gate,不是唯一Gate;从该点到Commit / Handoff的后续适用Gate均须重新证明。
4. 台账路由只有三类:`blocked / wait_design`、`blocked / handoff`且reason=`dependency_wait`、`blocked / fix_gate_failure`。
5. 未提交撤销只作用于current boundary的授权path / hunk。已提交缺陷优先forward-fix;revert需要明确授权及跨boundary / evidence影响审计。
6. 表中“保留”均要求同时保留current HEAD、design baseline、initial / current worktree、blocker、已执行命令和resource disposition;不再逐行重复。

### 1.1 控制代码

| 代码 | 含义 | 台账路由 |
|---|---|---|
| `D` | 正式设计字段 /语义 /owner /scope缺失或冲突 | `blocked / wait_design` |
| `X` | repo /外部tool /candidate /lab /授权等现实依赖缺失 | reason=`dependency_wait`;`blocked / handoff` |
| `F` | 当前allowed scope内实现、fixture、harness或Gate失败 | `blocked / fix_gate_failure` |
| `S` | 安全红线、truth rewrite、泄漏、guard绕过 | 按根因`D`或`F`;不得risk acceptance |
| `I` | generation、run、source、RELEASE、acceptance身份 /资格失效 | 暂停消费;按失效登记表传播 |

---

## 2. HDO与Phase级控制

### 2.1 `HDO-SBX-00`实现前控制

| 触发 | 必须动作 | 保留 /影响 | 恢复条件 |
|---|---|---|---|
| 正式`07`、项目implementation ledger、32件planned skeleton任一缺失或不一致 | `D`;停止所有实现仓动作 | Step 1~12审查状态、Boundary Gate Matrix、缺失文件清单 | Step 13同步创建并完成32 /32一致性审计 |
| design baseline尚未形成真实可复现commit | `D`;项目ledger保持blocked | 当前设计HEAD、dirty文件和用户未提交决定 | 用户决定并固定真实baseline,不得用当前HEAD假装包含工作区 |
| 不止一个current或未来boundary不是planned | `D`;撤销错误授权,不改代码 | 项目 /boundary ledger状态快照 | 恰好一个current;其余`planned / wait_until_current` |
| skeleton缺required reads /scope /checks /control字段 | `D`;不得由实现agent现场补 | 受影响boundary和Step 6~10来源 | 设计仓补齐并重新审查HDO |

HDO不是实现commit。HDO失败不得通过创建目标仓、scratch代码、假hash或预填pass来“推进”。

### 2.2 14个Phase暂停 /恢复矩阵

| Phase | 必须暂停的phase级触发 | 局部继续边界 | 恢复Gate /失效影响 |
|---|---|---|---|
| `PH-01` | HDO未过、目标仓 /git /Rust /core identity缺失、Cargo图出现非core sibling | 仅设计 /repo owner闭合前置;无代码 | HDO -> Activation -> Design -> Worktree;后序全保持planned |
| `PH-02` | shared carrier漂移、UoW /replay parity不闭合、RFC 8785或Shell规则缺失 | 已完成前序boundary不回退;停在exact `02B/C/D` | 最早受影响boundary Design或Activation;artifact schema变化使后序G1材料失效 |
| `PH-03` | source优先级 /40组 /101项 /44域冲突、partial /mixed generation、unsafe material | 03A parser与03B assembly按boundary分离;03B不得绕过03A | Design + config Test;published generation须new complete generation |
| `PH-04` | execution identity字段 /状态 /UoW /replay /audit /relay不原子 | 不等待Query /publisher;但不能用后序补闭环 | Design /Test;受影响stored result与targeted run以新记录重验 |
| `PH-05` | active identity缺失、四维coherent isolation被拆分、workspace requirement被忽略、handle /lease跨代、weak fallback、candidate结果被用于P0-C | candidate缺失不阻P0-C semantic path;不得形成P0-Q claim | Design /Test;generation或template变化传播P0-Q invalidation |
| `PH-06` | policy truth入sandbox、missing /stale /conflict仍launch、high-risk unauthorized、旧decision复用 | real policy source缺失不改P0-C fake资格 | Design /Test;任何non-allow launch为S级扩大复验 |
| `PH-07` | guard前launch、lease重算、capture正文入库、Partial升格、handoff失败回滚capture | capture与handoff按07B /07C分离;已成立capture truth不可回退 | 最早受影响boundary;run /capture /handoff raw与resource disposition保留 |
| `PH-08` | unknown=>success、cleanup早删、guard missing仍release、redline advisory、无resource disposition | containment /investigation优先;不得转去后序jobs补救 | Design /Test /Evidence;安全材料保留,cleanup只处置resource |
| `PH-09` | Query写truth /audit、finder缺失改scan、cursor /visibility混型、projection repair | 不等待PH-10;但10A不能在09B handoff前激活 | Design /Test + mechanical write=0;后序marker消费者受影响 |
| `PH-10` | consumer authority绕过、dedup /receipt混同、event payload重建、publish失败回滚source | 不回退PH-09;shared contract变化须同时失效09B /11+假设 | Design /Test /Evidence;stored payload和旧receipt immutable |
| `PH-11` | Job无report、duplicate重做owner call、selection无界、partial隐藏、reaper /reconciliation修core truth | 各job family按11A/B/C分离;安全job失败不由projection job掩盖 | Design /Test;stored job report与per-item disposition保留 |
| `PH-12` | 55协议 /30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations /38 error /237 TC inventory错、TXN /race不确定、fake parity /redaction失败 | candidate缺失不阻P0-C hardening;不得声称source Passed | Test /Evidence;MAIN /OPS source能力与真实source run分离 |
| `PH-13` | candidate packet任一identity缺失 /替换、13 CONF不完整、raw material泄漏、teardown无处置 | P0-C历史不受candidate缺失影响;PH-QP只可准备packet | Activation identity preflight;0 probe /launch;变化使P0-Q packet全失效 |
| `PH-14` | 四source缺失 /错序 /错baseline、schema /pairing /no-static失败、draft写verdict /签署 | P1 inactive可`NotRunConditional`;不得用其补P0 | 14A /14B /14C最早受影响Gate;新RELEASE和必要时新acceptance batch |

### 2.3 `PH-QP`正交准备控制

| 触发 | 允许 | 禁止 | 恢复 |
|---|---|---|---|
| candidate /provider /lab尚未选择 | 形成待决项、owner、ADR /manifest字段模板 | 搜索临时candidate、probe、launch、把fake当real | exact identity由owner批准后进入13A Activation |
| QP信息与P0-C contract冲突 | `D / wait_design`,回写拥有真相的`03/04/05` | 为适配产品私补enum / DTO /fallback | 新baseline后重审PH-05 /12与13A |
| QP现实依赖等待 | `X / handoff`,可继续严格串行P0-C current boundary | 第二current、提前实现13A /13B | 依赖packet完整且PH-12 Handoff已过 |

---

## 3. 32个Commit Boundary控制矩阵

### 3.1 PH-01~PH-04

| Boundary /目标 | 主要暂停触发 | 必须保留 /不得撤销 | 路由与恢复Gate |
|---|---|---|---|
| `CB-SBX-01A` workspace | HDO、target repo策略、git identity、Rust /core revision、only-core graph任一缺失;用户文件冲突 | 初始目录 /git status、core path /revision、用户文件清单 | `D`或`X`;HDO /Activation -> Design -> Worktree;不得创建业务代码 |
| `CB-SBX-02A` typed carrier | shared ref /metadata /status /error与core冲突,字段 /constructor不完整 | core exact type来源、roundtrip /negative fixture、已通过01A | `D`回`03`;实现错误`F`;Design -> Build /Test |
| `CB-SBX-02B` persistence kernel | UoW staged write /rollback /version /idempotency /stored replay语义不唯一或fake parity失败 | rollback visibility、owner call /write set、stored result fixture | 语义`D`;当前fake实现`F`;Design或Test;不以map /sleep替代 |
| `CB-SBX-02C` canonical writer | RFC 8785方案缺失,canonical /self-digest /path fixture失败,schema owner冲突 | 原artifact bytes、verifier finding、fixture corpus | tool缺失`X`;schema`D`;writer bug`F`;Activation /Design /Evidence后新run |
| `CB-SBX-02D` minimal scripts | Shell规则 /lint未批准,safe nonzero /raw preservation失败,脚本越权生成pass | stdout /stderr safe fixture、exit status、原raw、规则版本 | rule /tool`X`;contract`D`;script bug`F`;Activation /Build /Evidence |
| `CB-SBX-03A` strict config | unknown /invalid被fallback、40 /101 /44 manifest漂移、source winner不唯一 | candidate corpus、safe validation issue、expected manifest | `D`回`04`;parser bug`F`;Design /Test;invalid发布0 handle |
| `CB-SBX-03B` generation assembly | material越界、mixed adapter /identity、partial generation、P01~05 eligibility错 | complete candidate ref、redacted marker、builder input /zero publication finding | `D`或`F`;Design /Test;任何修复生成新complete generation |
| `CB-SBX-04A` identity contract | intake /execution identity字段、状态、错误、audit /relay carrier不闭合 | contract fixture、state transition和正式字段来源 | `D`回`03`;实现`F`;Design /Test |
| `CB-SBX-04B` intake vertical | UoW顺序、resolver failure、stored replay、audit /relay /stale marker不原子 | failed transaction raw、write set、stored result、idempotency record | `D`或`F`;Design /Test;不得等待Query /publisher补事务 |

### 3.2 PH-05~PH-08

| Boundary /目标 | 主要暂停触发 | 必须保留 /不得撤销 | 路由与恢复Gate |
|---|---|---|---|
| `CB-SBX-05A` boundary contract | active identity缺失,resource /filesystem /network /process任一维或workspace requirement缺字段、状态冲突、handle /lease跨代 | active identity、四维隔离 + workspace requirement、decision /handle /lease refs、状态fixture | `D`;Design /Test;不得partial DTO或local fallback |
| `CB-SBX-05B` boundary vertical | capability /backend seam缺失、unsupported仍partial handle、I065 consumption或UoW错误 | capability outcome、call budget、generation /template /lease identity | external seam`X`;实现`F`;语义`D`;Activation /Design /Test |
| `CB-SBX-06A` policy contract | policy正文 /allowlist入仓、authorization /high-risk状态或错误缺口 | body-free ref /summary、decision fixture、truth owner来源 | `D`;Design /Test;不得本地创建policy truth |
| `CB-SBX-06B` policy vertical | missing /stale /conflict /unsupported仍backend call,旧decision复用 | backend call trace=0预期、decision ref、failure raw | contract`D`;实现`F`;Test;任何非允许launch触发S级复验 |
| `CB-SBX-07A` run launch | exact boundary /handle /lease /Accepted policy未校验,guard前launch | launch call trace、exact refs、run truth、resource handle disposition | `D/F/S`;Design /Test /Evidence;不得用cleanup抹run事实 |
| `CB-SBX-07B` capture | raw output进入truth /log,capture Partial /Failed升格,body-free ref不闭合 | capture fact、status、digest /safe refs、raw受控位置 | `D/F/S`;Design /Evidence;泄漏时隔离并扩大载体复验 |
| `CB-SBX-07C` handoff | receipt升格external truth,delivery失败回滚capture,material /target不合格 | capture truth、handoff attempt /receipt、stored replay | external target`X`;契约`D`;实现`F`;Design /Test /Evidence |
| `CB-SBX-08A` control /failure | unknown被映射success、control /failure state冲突、错误丢失 | original run /capture truth、classification raw、control call trace | `D/F`;Design /Test;不得由runtime agent loop补语义 |
| `CB-SBX-08B` cleanup /redline | guard /investigation /lease缺失仍release,early delete,force cleanup,containment解除 | product truth、handoff /investigation refs、resource /cleanup /redline disposition | `D/F/S`;Design /Test /Evidence;non-Allowed release=0 |

### 3.3 PH-09~PH-12

| Boundary /目标 | 主要暂停触发 | 必须保留 /不得撤销 | 路由与恢复Gate |
|---|---|---|---|
| `CB-SBX-09A` query contract | 13 view /access /page /cursor /projection字段缺失或visibility混型 | query /view fixture、cursor family、access source | `D`;Design /Test;不得用storage scan补finder |
| `CB-SBX-09B` query vertical | write UoW /audit append /repair、unbounded scan、stale /degraded误报 | mechanical write set=0、read source /page trace、failed query raw | `D/F`;Test;Handoff前10A不得激活 |
| `CB-SBX-10A` consumers | source authority、schema、dedup /receipt /marker不闭合,duplicate重做owner call | inbound envelope、receipt、dedup key、owner-call trace | `D/F`;Design /Test;旧receipt immutable |
| `CB-SBX-10B` events /relay | event payload从current state重建,publish failure回滚source,dead-letter丢历史 | source tx、stored payload、relay status、publish attempt | `D/F`;Design /Test /Evidence;source truth no rollback |
| `CB-SBX-11A` job kernel | typed input /selection /per-item UoW /report /stored replay缺口 | selection snapshot、per-item result、job report、duplicate trace | `D/F`;Design /Test;failed /partial也必须有report |
| `CB-SBX-11B` relay /refresh jobs | job重写source、refresh正文入仓、handoff retry改变capture | source /stored payload、old refs、per-item disposition | `D/F`;Design /Test;no-repair /no-rollback |
| `CB-SBX-11C` safety /projection jobs | reaper绕guard、cleanup伪Released、projection /reconciliation修core truth | lease /orphan /guard、resource disposition、rebuild /compare report | `D/F/S`;Design /Test /Evidence;安全与read-side truth分离 |
| `CB-SBX-12A` inventory | 55协议 /30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations /38错误 /237 P0-C owner missing /duplicate /换义 | canonical inventories、差异清单、正式编号来源 | `D`若设计冲突;generator `F`;Design /Test;不得删项凑数 |
| `CB-SBX-12B` hardening | 14 TXN /19 race未闭合,fake parity /redaction /dependency /pairing失败,source role混用 | deterministic schedule、failed raw、source capability manifest | `D/F/S`;Test /Evidence;真实source结果仍不得预填 |

### 3.4 PH-13~PH-14

| Boundary /目标 | 主要暂停触发 | 必须保留 /不得撤销 | 路由与恢复Gate |
|---|---|---|---|
| `CB-SBX-13A` candidate identity | ADR /revision /P05 /ENV-05 /generation /template /capability /provider /material /lab任一缺失或candidate替换 | immutable packet、preflight finding、0-call assertion | design identity`D`;现实依赖`X`;Activation preflight;probe /launch=0 |
| `CB-SBX-13B` CONF harness | 13 CONF不完整、identity漂移、raw leak、product /lab disposition混写、teardown失败 | qualification raw、probe /launch trace、product disposition、resource /teardown disposition | harness `F`;contract`D`;lab`X`;Test /Evidence;新candidate全量新run |
| `CB-SBX-14A` gate orchestration | trigger /role /顺序错误、Blocked传播丢失、P1补P0、任一check被跳过 | gate invocation、四source context /digest、check raw | `D/F`;Test /Evidence;旧RELEASE不可继续消费 |
| `CB-SBX-14B` evidence materialization | 九schema /digest /path /pairing失败、21 slot missing /orphan、静态EV | 原raw /report、verifier finding、slot inventory | schema`D`;writer`F`;Evidence;修复后新run /新RELEASE |
| `CB-SBX-14C` acceptance draft | draft预填verdict /risk accepted /review /signature,RELEASE /四source refs不固定,路径漂移 | generated draft、input digest、no-static /redaction finding | `D/F`;Evidence /Commit;generator只能输出待审材料 |

---

## 4. 跨Boundary影响与已验证阶段保护

| 变化发生点 | 最小受影响闭集 | 不自动回退 | 必须重验 /失效 |
|---|---|---|---|
| `02A` shared carrier | 所有消费该carrier的后序boundary | `01A` workspace | 编译 /protocol /schema /TC inventory;design baseline变化 |
| `02B` UoW /replay kernel | 所有command /consumer /job transaction boundary | `01A/02A`无关结构 | TXN /RACE /stored replay及source writers |
| `03A/03B` config /generation | 所有runtime assembly和依赖generation identity的run | 已成立历史candidate /generation记录 | new complete generation;P0-Q /source /RELEASE /batch按身份失效 |
| `05A/05B` boundary /lease | `06B~08B`,`11C`,`12B`,`13B~14C` | intake truth | coherent boundary、launch、cleanup、P0-Q全量相关门禁 |
| `07A~07C` run /capture /handoff | safety、jobs、source /evidence /acceptance | 已提交前序contract boundary | run相关new run;旧product truth不回滚 |
| `09A/09B` query surface | `10A` shared marker若变、`11B/C`,`12A/B`,`14A~C` | core command truth | query write=0、inventory、affected reports |
| `10A/10B` consumer /event | `11B`,`12A/B`,`14A~C` | source command truth | receipt /relay /event inventory与source reports |
| `11A~11C` jobs | `12A/B`,`14A~C`;安全变化还影响13B | core truth | report replay、cleanup、no-repair与source evidence |
| `12A/12B` inventory /hardening | `13A/B`,`14A~C` | PH-01~11已验证实现本身 | affected P0-C source runs、RELEASE、acceptance |
| `13A/13B` candidate /qualification | `14A~14C` | P0-C source事实 | P0-Q全packet、新RELEASE、新acceptance batch |
| `14A~14C` gate /evidence /draft | release packet /acceptance | source raw事实 | new aggregation /draft;不得改source status |

已提交前序boundary只有在其自身设计或实现确实受变化影响时才进入修复 /revert评估。单纯后序失败不构成回退前序的理由。

---

## 5. 覆盖审计与停审

| 审计项 | 结果 | 说明 |
|---|---|---|
| HDO覆盖 | 1 /1 | 正式`07`、ledger、32 skeleton、baseline、单current均有控制 |
| phase覆盖 | 14 /14 | `PH-01~14`逐项有pause /local continue /resume |
| QP支线覆盖 | 1 /1 | candidate准备不阻P0-C,但禁止并行implementation /probe |
| boundary覆盖 | 32 /32 | `01A`;`02A~D`;`03A~B`;`04A~B`;`05A~B`;`06A~B`;`07A~C`;`08A~B`;`09A~B`;`10A~B`;`11A~C`;`12A~B`;`13A~B`;`14A~C` |
| 合法台账路由 | passed_design | 只使用`wait_design / handoff / fix_gate_failure`;dependency为reason |
| 单current约束 | passed_design | 暂停不授权后序并行boundary |
| 已验证阶段保护 | passed_design | 当前未提交撤销、forward-fix、授权revert已分离 |
| 用户改动保护 | passed_design | 所有撤销前必须做initial /current worktree归属 |
| runtime事实 | absent_as_expected | 未生成commit、run、EV、测试或验收事实 |

本分件已完成,与Step 10主件共同等待用户审查。不得单独据此进入Step 11。
