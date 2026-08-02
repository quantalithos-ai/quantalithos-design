# L4-sandbox 实施计划 Step 9 Spike、风险与待确认事项登记分件

> 主件: `07_implementation_plan_step_09_spikes_risks_open_questions.md`
> Phase / Boundary真相源: 已审查Step 5 / Step 6
> Gate / Dependency真相源: 已审查Step 7 / Step 8
> 上游风险真相源: 正式`01` §15 / §17、正式`03` §16~§17、正式`04` §12.13 / §14、正式`05` §11~§14、正式`06` §11~§14
> 创建日期: 2026-07-17
> 状态: completed_supporting_register
> 事实边界: 本登记只定义future closure contract。Spike未执行,风险未被接受,待确认项未关闭;不存在实现commit、run、evidence、测试结果、review、验收签署或真实风险接受。

---

## 1. 分类与使用规则

1. `Spike`只用于在正式boundary开工前消除技术可行性不确定性。它必须有最小实验、可审查输出、停止条件和最迟关闭boundary;不得替代该boundary的正式实现、Build / Test / Evidence Gate或提交。
2. `Risk`描述已经能确定的失败可能性。每项必须有probability、impact、trigger、owner、mitigation、fallback、升级条件和截止点。命中安全 / truth / evidence红线时fallback只能是停止、contain或回写设计,不能是降级放行。
3. `Open Question`只承接尚需外部owner决策的输入。每项必须有decision owner、所需决策、截止boundary与未确认时的默认安全处置;不得长期写“后续确认”。
4. 已由正式`03~06`闭合的旧架构待确认项不重新打开。产品选择、物理carrier、数值SLO等仅在进入exact current scope时转blocker或DesignReopen。
5. 本表ID是实施计划编排ID,不是正式测试、缺陷、evidence、ADR、risk-acceptance或runtime状态ID。

### 1.1 状态与动作词汇

| 情形 | future gate状态 | next_allowed_action | 禁止动作 |
|---|---|---|---|
| 正式owner契约缺失 /冲突 /需要新增surface | `blocked` | `wait_design` | 实现侧补字段、DTO、port、state、config、TC或gate |
| repo /tool /core /required harness等现实依赖缺失 | `blocked`;reason=`dependency_wait` | `handoff` | 复制shared type、跳过tool、伪造ready |
| P0-Q immutable identity任一缺失 | source `Blocked`;reason按根因 | 设计缺口`wait_design`;现实依赖`handoff` | probe /launch、candidate搜索、fake替代 |
| P1未正式激活 | `NotRunConditional` | 等future trigger | 计入P0、写Skipped /Passed |
| P07 /production /unsupported surface进入请求 | `blocked` | `DesignReopen` / `wait_design` | 在current boundary顺手实现 |
| S / A、VF / VETO、P0或evidence完整性风险 | `Failed` / `Blocked`按正式事实 | 修复、复验或设计回写 | risk acceptance、waiver、手工改状态 |

## 2. Spike登记

### 2.1 Spike共同门禁

- Spike branch / scratch输出不得合入正式boundary提交,除非该代码被纳入该boundary allowed scope并重新通过完整门禁。
- Spike不得创建正式EV alias、source Passed、RELEASE、acceptance verdict或risk acceptance。
- 最小实验一旦回答问题即停止;若结果要求新增public / config / domain surface,立即转`wait_design`,不得继续扩展实验。
- 输出只能登记future路径 /内容要求,不能预填不存在的命令结果、commit hash、run ID或review结论。

### 2.2 Spike表

| Spike ID | 触发 /问题 | 影响Phase / Boundary | 最小实验 | 必需输出 | Owner | 最迟关闭 | 未闭合 /失败处置 |
|---|---|---|---|---|---|---|---|
| `SP-SBX-IMP-001` | HDO后仍无法确认七crate workspace、Rust baseline和only-core Cargo图能同时成立 | PH-01 / `CB-SBX-01A` | 在目标仓初始化前做manifest / path /package名称dry-run;只验证bootstrap shape | bootstrap decision note、workspace member清单、core path /revision compatibility checklist、用户文件保护清单 | design owner + repo owner + core owner | `01A` Activation Gate前 | 设计shape冲突`wait_design`;repo /core缺失记`dependency_wait`并`handoff`;不得创建业务代码 |
| `SP-SBX-IMP-002` | `core-contracts` exact shared carrier /kind与正式`03`引用无法1:1解析 | PH-01~02 / `01A`,`02A` | 对exact core revision做type /kind /package surface spot-check | shared-type mapping、缺失 /兼容差异清单、采用或上游修复决定 | core owner + contracts owner | `01A` Design Gate前;最迟`02A` Activation前 | 缺type不得local stub;回L0或`03/07`修正并固定新baseline |
| `SP-SBX-IMP-003` | RFC 8785库 /verifier选择未知,不能证明canonical bytes、自digest和path规则 | PH-02 / `02C`;PH-14 / `14B`复用 | 候选实现对canonical /noncanonical /self-digest /path fixtures做bounded comparison | 选择记录、fixture corpus、byte-for-byte与negative结果格式、复用约束 | evidence tooling owner + test owner | `02C` Activation Gate前 | 无合格现实选择记`dependency_wait`并`handoff`;schema冲突回写owner并`wait_design`;不得以`jq` /`sha256sum`存在替代 |
| `SP-SBX-IMP-004` | 无专用Shell标准且本机无`shellcheck`,17入口的syntax /lint /safe failure门槛未知 | PH-02 / `02D`;PH-14 / `14A~14C` | 对最小脚本fixture比较approved lint工具或等价项目规则 | 审查后的Shell规则、工具 /版本或等价检查、positive /negative fixture及nonzero约束 | design owner + test automation owner | `02D` Activation Gate前 | 未批准记`dependency_wait`并`handoff`;script boundary不得开工 /提交 |
| `SP-SBX-IMP-005` | 40组 /101项 /44域、23 material descriptor及P01~05 constructor graph可能在runtime assembly出现循环或partial publication | PH-03 / `03A`,`03B` | 使用synthetic expected manifest和constructor fixture做complete generation assembly dry-run | constructor dependency graph、missing /cycle /mixed-generation negative清单、0-publication断言方案 | config owner + runtime assembly owner | `03A` Design Gate前;最迟`03B` Activation前 | 需要新key /mode /carrier则`wait_design`;不得补implicit default /partial generation |
| `SP-SBX-IMP-006` | context -> boundary -> policy -> run的exact ref /lease /version读取可能仍有source-map缺口 | PH-04~07 / `04B`,`05B`,`06B`,`07A` | 按四条Command纵切做纸面 /compile closure spot-check,验证factory输入、repository exact reads、UoW和call budget | closure checklist、exact source matrix、缺口patch list或“无缺口”review记录 | application owner + design owner | 各受影响boundary Design Gate前,首轮最迟`04B`前 | 缺字段 /port /state立即`wait_design`;不得scan latest、重算lease或从ref字符串推断 |
| `SP-SBX-IMP-007` | fake /controlled adapter可能无法同时保留version、rollback、stored replay、failure、redaction与call-budget parity | PH-02~12 / `02B`首次,`12B`收口 | 为store、resolver、backend、capture、handoff、publisher各选一条positive + negative parity fixture | parity checklist、fault fixture列表、owner-call /write-set断言和差异处理 | infra fake owner + test owner | `02B` Test Gate前建立kernel;每个adapter boundary提交前扩展;`12B`全量关闭 | 外部required fake不可得记`dependency_wait`并`handoff`;当前scope实现失败`fix_gate_failure`;语义差异`wait_design`,不得简化map /sleep替代 |
| `SP-SBX-IMP-008` | cleanup /reaper /redline race无法确定guard-first、release call budget和resource disposition是否可deterministic验证 | PH-08 / `08B`;PH-11 / `11C`;PH-12 / `12B` | 用simulation handle /lease和deterministic scheduler执行guard /expiry /containment交错fixture | race schedule、expected winner /state /call budget、resource disposition matrix、调查材料保留断言 | safety owner + test owner | `08B` Design / Test Gate前;`12B`全量关闭 | 无唯一断言`wait_design`;non-Allowed release必须0,不得用真实delete探索 |
| `SP-SBX-IMP-009` | 13 Query的finder /visibility /stale /page source可能缺exact callable read surface | PH-09 / `09A`,`09B` | 逐Query从request ref到view /marker /cursor做source-map和compile-level port spot-check | 13 /13 source matrix、finder /index checklist、empty /degraded fixture清单、write-audit计划 | query owner + projection owner | `09A` Design Gate前 | 缺finder /source`wait_design`;不得storage scan、string guess、refresh或repair |
| `SP-SBX-IMP-010` | 9 Consumer和13 Event可能无法从committed source定位receipt、affected marker与stored payload snapshot | PH-10 / `10A`,`10B` | 每族选normal /duplicate /publish-failure路径核对source transaction与snapshot | 9-consumer mapping、13-event payload source matrix、dedup /receipt /relay fixture清单 | consumer owner + relay owner | `10A` /`10B`各自Design Gate前 | 缺snapshot /source identity`wait_design`;publisher不得从current truth重建 |
| `SP-SBX-IMP-011` | 10 Job的selection、per-item UoW、partial report和duplicate stored replay可能无法共存且保持no-repair | PH-11 / `11A~11C` | shared job kernel对duplicate、partial、failed与no-write/no-repair做bounded dry-run | stored report mapping、selection/page matrix、per-item UoW /owner-call断言、job family fixture清单 | operations job owner + test owner | `11A` Design Gate前;`11C`提交前全量关闭 | 缺report /scope source`wait_design`;duplicate不得重跑owner mutation |
| `SP-SBX-IMP-012` | P0-C source writer可能混淆MAIN-CONTRACT、MAIN-SEAM与OPS role或用targeted结果补source | PH-12 / `12B`;PH-14 / `14A` | 对synthetic run contexts做role separation /missing-source /blocked propagation dry-run | role identity matrix、three-source writer fixture、merge /substitution negative清单 | test automation owner + evidence owner | `12B` Evidence Gate前 | role无法区分`wait_design`;不得产生真实source run /Passed |
| `SP-SBX-IMP-013` | 单一candidate、provider、lab、material和四维template能否组成不可替换P05 packet未知 | PH-QP / PH-13 / `13A` | 只对immutable identity schema和0-launch preflight做paper /fixture validation;不probe candidate | candidate packet manifest、identity digest输入、missing /mismatch /substitution negative cases、owner签责入口 | backend owner + security owner + qualification owner | `13A` Activation Gate前 | 任一输入缺失保持`Blocked`;probe /launch=0;需要新adapter/public surface则`wait_design` |
| `SP-SBX-IMP-014` | CONF harness可能不能在失败后同时保留product truth、lab teardown与cleanup disposition | PH-13 / `13B` | 在simulation fixture上演练preflight abort、partial probe、containment和双disposition报告结构 | lifecycle state /call-budget表、product vs lab disposition mapping、failure preservation checklist | qualification owner + safety /operations owner | `13B` Design Gate前 | 无唯一处置`wait_design`;真实lab未授权记`dependency_wait`并`handoff`;不得用teardown改写product truth |
| `SP-SBX-IMP-015` | gate /report /evidence generator可能从静态表或缺pair输入制造EV、Passed或验收结论 | PH-14 / `14A~14C` | 用synthetic Passed /Failed /Blocked /missing /digest mismatch corpus做report-generation audit | no-static negative fixture、raw/report pairing audit、EV allocation denial、draft-only review checklist | evidence owner + test owner + acceptance generator owner | `14A` Design Gate前;`14C`提交前全量关闭 | 任一静态补事实路径为blocker;回`05/06/07`,不得手写修报告 |

## 3. 风险登记

### 3.1 概率 /影响标尺

| 值 | 概率含义 | 影响含义 |
|---|---|---|
| L | 有明确设计和成熟机制,但仍需门禁复核 | 局部返工,不改变truth /安全 /release资格 |
| M | 现实输入未形成或跨多个owner,较可能触发等待 /返工 | 阻塞一个或多个boundary、source或复验集合 |
| H | 当前已知缺失或一旦发生即高事故半径 | 破坏核心truth /安全 /evidence,触发S级 / VETO / release阻断 |

### 3.2 风险表

| Risk ID | P / I | 风险与trigger | 影响Phase / Boundary | Owner | Mitigation | Fallback /升级条件 | 截止点 |
|---|---|---|---|---|---|---|---|
| `R-SBX-IMP-001` | H / H | 设计仓新版链未形成可复现baseline,HDO或32 skeleton缺失却启动实现 | HDO / PH-01 /全部boundary | design owner + project owner | Step 13同步生成正式`07`、ledger、32 skeleton;用户决定真实design commit baseline | 任一缺失`blocked / wait_design`;不得创建 /修改目标仓 | `01A` Activation前 |
| `R-SBX-IMP-002` | H / H | 目标仓、git identity、Rust baseline或core exact revision /compatibility未就绪 | PH-01 / `01A`;PH-02 /`02A` | repo owner + core owner | HDO precheck、exact revision /worktree与compatibility记录、Cargo graph检查 | repo/tool/core缺失记`dependency_wait`并`handoff`;contract冲突`wait_design`;禁止duplicate type | `01A` Activation / Design前 |
| `R-SBX-IMP-003` | M / H | boundary required reads /allowed scope与当前设计baseline漂移,实现者被迫补surface | 全PH /32 boundary | design owner + current boundary owner | 每boundary Design Gate复核Step 6 closure profile和Step 9风险集 | 任一schema /source缺口`wait_design`;固定新baseline后重跑gate | 每个boundary开工前 |
| `R-SBX-IMP-004` | M / H | 非core sibling或产品SDK进入compile graph,tools semantics /runtime loop /member lifecycle混入Sandbox | PH-01~14 / manifest与protocol变化boundary | architecture owner + implementation owner | dependency graph、scope absence、import /trait review | 命中VETO-SBX-005 /016;移除或DesignReopen,不可风险接受 | 每次manifest /public protocol变化;最终`14A` |
| `R-SBX-IMP-005` | M / H | fake /controlled /simulation省略UoW、version、replay、failure、redaction、call budget或执行host side effect | PH-02~12 / adapter boundaries | infra owner + test owner | `SP-007`,SUITE-008、fault /write /call trace | parity失败阻断当前boundary;fake不得升级证明P0-Q | 每个adapter boundary Test Gate;`12B`全量 |
| `R-SBX-IMP-006` | M / H | partial /mixed config generation、implicit default、forbidden source或raw material被发布 | PH-03+ / `03A`,`03B`及所有runtime slice | config owner + security owner | strict parse、complete generation、same-generation publication、all-carrier redaction | 命中S / VETO-SBX-006 /007;0 publication,回写设计或修实现 | `03A/03B`提交前;每次config变更 |
| `R-SBX-IMP-007` | M / H | execution context匿名 /自造,active identity缺失,四维boundary silent degrade,workspace requirement忽略,policy fail-open或run绕过exact handle /lease | PH-04~07 / `04B~07A` | application owner + safety owner | exact ref /version source、active identity + four-dimension isolation / workspace requirement coherent check、0-launch call budget | 命中VETO-SBX-001~004;contain / stop,不可fallback /接受 | 对应boundary Test Gate前 |
| `R-SBX-IMP-008` | M / H | raw output /secret /external body /full sensitive ref进入truth、audit、log、metric、relay、report或artifact | PH-03~14 / material /capture /evidence boundaries | security owner + all carrier owners | synthetic marker corpus、redaction check、body-free carrier review | 命中S / VETO-SBX-006;保留safe finding并阻断commit /source /release | 首次相关boundary起;`14B/14C`终审 |
| `R-SBX-IMP-009` | M / H | capture /handoff /receipt /telemetry升格下游truth,失败回滚source或cleanup提前删材料 | PH-07~11 / `07B`,`07C`,`08B`,`10B`,`11B/11C` | capture /handoff /safety owner | owner分层、stored fact、no-rollback、guard-first、resource disposition | VETO-SBX-009 /011 /014 /015;保持Failed /Contained /Blocked | 各boundary Handoff Gate前 |
| `R-SBX-IMP-010` | M / H | query、consumer、job、reconciliation或maintenance成为第二truth writer /修core truth | PH-09~11 / `09B`,`10A`,`11A~11C` | read /consumer /job owner | write-audit=0、receipt /report truth separation、no-repair fixtures | 命中VETO-SBX-012 /013;阻断并修实现或`wait_design` | 各boundary Test Gate前 |
| `R-SBX-IMP-011` | M / H | outbox /publisher从current truth重建payload,duplicate重算stored result /receipt /report或产生第二副作用 | PH-02,04~12 / replay /relay /job boundaries | persistence + relay + job owner | source-transaction snapshot、three-channel replay、owner-call count、deterministic race | VETO-SBX-011 /013;不可盲重试或手工修result | 首次owner boundary;`12B`全量 |
| `R-SBX-IMP-012` | H / H | candidate /provider /material /lab identity不完整却probe,或fake /P06 /host替代P05 | PH-QP / PH-13 / `13A`,`13B` | qualification + security + operations owner | immutable packet、0-launch preflight、anti-substitution、双disposition | source保持Blocked,probe /launch=0;命中VETO-SBX-002 /003 /006 /015 | `13A` Activation前;`13B`每次执行前 |
| `R-SBX-IMP-013` | M / H | CI /source /RELEASE层级混用,MAIN roles合并,missing /Blocked被吞或targeted结果冒充source | PH-12~14 / `12B`,`14A`,`14B` | test automation + evidence owner | role identity、fixed roots、blocked propagation、raw/report pairing | gate/source保持Failed /Blocked;不得Skipped /Passed /换ENV | `12B` Evidence Gate;`14B`提交前 |
| `R-SBX-IMP-014` | M / H | 静态JSON /Markdown、手写表或generator默认制造EV、pass、VETO disposition、risk acceptance、review或signature | PH-14 / `14A~14C` | evidence owner + acceptance owner | no-static check、runtime tuple、draft /review /adjudication分权 | VETO-SBX-017;artifact invalid,release /DecisionReady阻断;不可风险接受 | `14A~14C`每个Commit Gate |
| `R-SBX-IMP-015` | M / M | real CI binding、真实source run或acceptance process尚不存在,能力完成被误述为执行完成 | PH-14 / future execution | CI owner + release owner | 五级maturity分层,只声明fixture /writer /draft capability | 缺现实绑定保持open /Blocked;不生成run /EV /review | `14C` Handoff及future source execution前 |
| `R-SBX-IMP-016` | H / M | PROFILE-06未组成完整real-like环境或PROFILE-07被提前激活 | future P1 / P07 | product + architecture + security + operations owner | P06保持`NotRunConditional`;P07 activation reject | P06不得补P0;P07请求立即DesignReopen正式`00~07` | GATE-P1激活前 /任何P07请求时 |
| `R-SBX-IMP-017` | M / M | retention physical carrier /TTL、soak /fleet、alert route或rollout carrier未定被误写成qualified数值 /生产能力 | PH-08~14 current proof ceiling;future `09` | operations + compliance + acceptance owner | condition guard、structural boundedness、DisclosureOnly /RR路由 | 进入法规 /合同 /production claim即MandatoryBlocker或DesignReopen;不发明数值 | current release handoff披露;future claim前关闭 |
| `R-SBX-IMP-018` | M / H | 实施失败被错误改写为risk acceptance,open S /A、VETO、P0 Blocked或evidence缺口被放行 | PH-12~14 / acceptance handoff | test owner + acceptance authority | 正式`05` §11与`06` §13资格闭集;generator无接受权 | Prohibited / MandatoryBlocker;只允许修复 /复验 /补前置 | `14C` Handoff Gate及future DecisionReady前 |
| `R-SBX-IMP-019` | M / M | design / implementation /source /acceptance身份变化后沿用旧结果或旧risk record | 全PH;future execution | project owner + evidence owner | baseline /subject /config /candidate /run identity固定,变化触发失效与复验 | invalidated / superseded;按L-R1~L-R5新run,不得覆盖旧失败 | 每boundary开工及每次fixed run前 |
| `R-SBX-IMP-020` | L / H | historical README、旧Docker /gVisor、旧阈值 /路线或L2 Draft回流为current实现输入 | 全PH /所有Design Gate | design owner + reviewer | required reads只认current正式链;historical差异审计 | 命中即scope /Design Gate失败;删除污染实现或回写设计 | 每boundary Design /Scope Gate |

## 4. 待确认事项登记

| OQ ID | 待决策输入 /影响 | Decision Owner | 所需输出 | 截止Phase / Boundary | 未确认默认处置 |
|---|---|---|---|---|---|
| `OQ-SBX-IMP-001` | 可复现design baseline与HDO授权 | user / project owner + design owner | 真实design commit ref、审查范围、HDO状态;不得由本Step伪造 | Step 13完成后、`01A` Activation前 | `wait_design`;不创建目标仓 /代码 |
| `OQ-SBX-IMP-002` | 目标仓创建方式、已有文件保护、git identity与首个current boundary | repo owner + user | repo bootstrap decision、initial status、local git config和唯一current授权 | `01A` Activation / Worktree Gate前 | `dependency_wait`;台账`blocked / handoff`;不得覆盖用户文件或自行commit |
| `OQ-SBX-IMP-003` | edition /rust-version与core exact revision /compatibility | design owner + core owner | target baseline值、core revision /worktree、compatibility decision | `01A` Design Gate前 | 设计冲突`wait_design`;现实依赖`dependency_wait` + `handoff`;不得复制core当前值作为默认 |
| `OQ-SBX-IMP-004` | RFC 8785 implementation /verifier | evidence tooling owner | 选定方案、fixture与维护owner | `02C` Activation前 | `dependency_wait`;台账`blocked / handoff`;02C不开始 |
| `OQ-SBX-IMP-005` | Shell规则与lint /等价检查 | design + test automation owner | approved rule、tool /version或等价检查、CI安装责任 | `02D` Activation前 | `dependency_wait`;台账`blocked / handoff`;脚本boundary不开始 |
| `OQ-SBX-IMP-006` | candidate backend产品、revision /SDK或process boundary与no-compile-leak ADR | architecture + backend owner | 真实ADR /decision ref、单一candidate、revision和责任边界 | PH-QP关闭;`13A` Activation前 | P0-Q `Blocked`;P0-C继续fake /controlled,无candidate claim |
| `OQ-SBX-IMP-007` | 四维capability /boundary template及network /fs /process /resource实际profile | security + backend owner | immutable template、unsupported semantics、probe /inspect /release能力矩阵 | `13A` Activation前;PH-05只核对抽象契约 | 13A Blocked;05B只证明P0-C语义,不得弱化 |
| `OQ-SBX-IMP-008` | provider /principal /material /native audit与swap /core dump /SDK memory /zeroization资格 | security + provider owner | qualified non-production binding、least privilege、native audit与anti-leak结论入口 | `13A` Activation前 | 不解析真实S04;P0-Q Blocked;不得raw env /file /fake fallback |
| `OQ-SBX-IMP-009` | dedicated lab、授权、emergency teardown、investigation和product disposition责任 | qualification + operations + security owner | ENV-05 identity、authorization、target /forbidden marker、双disposition owner | `13B` Activation前 | `dependency_wait`;台账`blocked / handoff`;0 probe /launch |
| `OQ-SBX-IMP-010` | CI provider /workflow binding与credential-safe invocation | CI owner + security owner | provider、trigger、workflow ref、role /ENV /PROFILE注入和credential boundary | future真实source执行前;不阻塞local `14A` fixture | 只可验证local script fixture;不得声明CI /source存在 |
| `OQ-SBX-IMP-011` | fixed source invocation authority、真实`run_id`分配与四source baseline | release owner + test owner | authorized invocation、run identity、subject /config /candidate refs和fixed roots | future MAIN /OPS /P0Q source启动前 | source不运行;不得由Step 9 /14预填run ID |
| `OQ-SBX-IMP-012` | acceptance draft review、VETO /defect /risk authority与签署角色的真实identity | acceptance authority | actual reviewer /acceptor /signer identity及authority source | future FormalEntry /DecisionReady前;`14C`只保留角色契约 | draft保持未reviewed;不得风险接受 /裁决 /签署 |
| `OQ-SBX-IMP-013` | retention physical carrier /TTL authority及法规 /合同条件 | records + compliance + security + operations owner | carrier、authority、适用条件、deadline /invalidation source | current handoff披露;权威义务形成后、相关release前 | 只执行condition-based guard;不得发明天数或删除放行 |
| `OQ-SBX-IMP-014` | PROFILE-06完整composition、workload /baseline /threshold与selected-run是否激活 | P1 owner + architecture /test /operations owner | formal activation、P05 qualification、全binding、workload和threshold source | GATE-SBX-P1激活前 | `NotRunConditional`;不补P0、不生成selected-run |
| `OQ-SBX-IMP-015` | PROFILE-07 /production是否进入范围 | product + architecture + security + operations + acceptance owner | 正式scope change与重建后的`00~07` | 任何P07 boundary /ready声明前 | activation reject;DesignReopen,当前无production claim |
| `OQ-SBX-IMP-016` | real store /bus /handoff target /scheduler /sink产品是否进入P1 /P2 composition | architecture + operations owner | product bindings、availability /parity和责任边界 | 只在real-like claim前;不阻塞P0-C | 保持opaque port + fake /controlled;不得添加compile dependency |
| `OQ-SBX-IMP-017` | long soak /fleet lease-orphan-reaper、alert route /response和physical rollout /rollback carrier | operations + safety + release owner | topology、workload、threshold、route、runbook和stop gate | future production /P06+ claim前 | current只证明deterministic /simulation和safe hooks;DisclosureOnly |
| `OQ-SBX-IMP-018` | Step 13 planned skeleton如何承接本Step exact风险项 | design owner | 32 skeleton的risk /spike /open-question refs与未关闭动作 | Step 13装配时 | 缺映射不得HDO或移交实现;不临场补boundary |

## 5. 关闭记录要求

### 5.1 Spike关闭记录最小字段

| 字段 | 要求 |
|---|---|
| identity | Spike ID、design baseline、影响boundary、owner、执行时间 |
| question / scope | 原问题、最小实验边界、明确排除的正式实现范围 |
| inputs | fixture /tool /candidate identity;不得使用`latest` |
| output | exact report /checklist /matrix /fixture path与digest;无runtime evidence冒充 |
| conclusion | `supports_planned_design` / `requires_design_writeback` / `dependency_wait`三类之一;第三类写台账时映射`blocked / handoff` |
| follow-up | 回写owner、受影响boundary、失效范围和复核入口 |

### 5.2 风险关闭 /转换要求

风险不能因“已知”自动关闭。只有trigger已消除且对应Design / Build / Test / Evidence / Handoff Gate有真实记录,才能在implementation ledger标closed。若风险转缺陷、VETO、blocker、DesignReopen或risk acceptance candidate,必须保留原ID和转换ref;本设计Step不创建这些实例。

### 5.3 Open Question关闭要求

关闭必须记录decision owner、真实decision ref、适用baseline、受影响boundary和invalidating trigger。口头对话、角色占位、planned ADR、placeholder issue或未签review不能作为关闭事实。
