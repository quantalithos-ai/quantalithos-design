# L4-sandbox 验收标准 Step 11 一票否决项

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 11
> 书写规范: `standards/document/验收标准书写规范.md` §5.11
> 回填章节: `projects/L4-sandbox/06-验收标准.md` §11
> 创建日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_12
> 当前成熟度: design_only;未执行验收,未生成runtime evidence,未评估任何VETO
> 配套分件: `06_acceptance_step_11_veto_traceability_register.md`;`06_acceptance_step_11_veto_review_register.md`

---

## 1. Step状态与输入审计

| 项目 | 当前结论 |
|---|---|
| 用户是否确认Step 10并允许进入Step 11 | 是。Step 10三件产物均为`completed_reviewed_passed_to_step_11`。 |
| 是否读取当前标准 | 是。已读取验收SOP Step 11、书写规范§5.11、讨论中间产物规范和真相源闭环 /可落码性标准。 |
| 是否读取正式上游 | 是。已读取正式`00`§14.2、正式`04`§14.7、正式`05`§5 /§10 /§11 /§13。 |
| 是否读取当前验收输入 | 是。已读取Step 2范围、Step 6红线、Step 9 NFR、Step 10 evidence / report三件产物。 |
| 是否读取粒度参考 | 是。已读取L1-governance与L1-artifact的验收Step 11;只参考结构,未继承领域编号、旧路径或结论。 |
| 旧正式`06`如何处理 | historical_material。旧对象、旧三红线、空checkbox、风险接受、结论和签署均不继承。 |
| 是否发现上游语义冲突 | 未发现阻塞本Step的冲突。10个VF、16个VETO-CFG与16个RL存在语义重叠,本Step负责规范化合并。 |
| 正式`06`是否修改 | 否。正式文档只能在Step 15装配。 |

### 1.1 本Step输入闭集

| 输入集合 | 数量 | 本Step用途 | 不得误用 |
|---|---:|---|---|
| `VF-SBX-001~010` | 10 | 需求级一票否决来源 | 不按10项机械复制,不改写需求语义 |
| `VETO-CFG-01~16` | 16 | 配置、安全、truth和演进硬红线来源 | 不继续作为验收最终编号体系 |
| `RL-SBX-001~016` | 16 | 数据、架构、边界与职责检查索引 | RL不是新需求AC或runtime evidence ID |
| `AC-SBX-001~041`适用集合 | 41 | 定位受影响验收项和总体传播 | VETO不能替代逐AC裁决 |
| `NFCHK-SBX-013~036`适用集合 | 24 | 安全、追溯、一致性、观测检查切口 | NFCHK不是正式AC或VETO |
| 正式测试`S`级规则 | 1套 | 固定不可降级、复验和证据保留边界 | `Failed / Blocked`不自动等于S级或VETO命中 |
| `ESLOT-SBX-001~021`与九项VC | 21 + 9 | 固定未来证据来源和完整性检查 | planned slot / control不冒充runtime EV |

---

## 2. 本步目标与职责边界

本Step只完成以下事项:

1. 把重叠的VF、VETO-CFG、RL和S级硬红线收口为唯一`VETO-SBX-001~017`索引。
2. 为每个VETO固定红线来源、可执行触发谓词、exact TC / assertion方向、planned slot、raw / check、fixed report和触发后裁决。
3. 明确`Triggered`与证据不足导致的`Blocked`不同,防止环境缺失或检查故障被伪判为红线命中。
4. 固定`reports/acceptance/veto-checklist.md`的验收本地disposition与不可默认通过规则。
5. 固定任一有效VETO命中后的总体不通过、S级处置、证据保留和新packet复验路径。

本Step不执行以下事项:

- 不运行suite、check、P0-Q probe或验收。
- 不创建`run_id`、`EV-SBX-*`实例、defect、risk acceptance、review或签署。
- 不把缺失的目标仓、环境、candidate、provider、raw、report或review解释成VETO已命中。
- 不定义Step 12缺陷矩阵、Step 13风险接受实例或Step 14最终签署。
- 不把tools semantic execution、runtime agent loop或member lifecycle orchestration纳入Sandbox职责。

---

## 3. SOP八问回答

| SOP问题 | 本项目回答 |
|---|---|
| 1. 哪些失败直接导致不通过 | 核心闭环 /双轴被替代、非受控执行冒充正式成功、四维边界partial、policy fail-open、truth ownership或领域编排越界、敏感材料泄漏、partial generation、unsupported安全削弱、下游truth升格、formal audit断裂、source truth rollback、第二writer、duplicate重算、cleanup先删、containment失守、非法依赖、证据伪造 /状态篡改。 |
| 2. 来源是什么 | 正式`VF-SBX-001~010`、`VETO-CFG-01~16`、`RL-SBX-001~016`、正式AC /详细设计不变量、正式`05` S级和Step 10 evidence integrity门禁。 |
| 3. 如何检查 | 逐项使用exact TC / assertion、固定source suite raw、runtime evidence tuple、validation check raw、fixed report和VETO checklist交叉确认;不得只看suite总状态或人工描述。 |
| 4. 是否允许风险接受 | 全部不允许。VETO不能被条件通过、P1 / P2补偿、A级 / B级降级、兼容窗口或人工口头确认覆盖。 |
| 5. 是否覆盖所有P0红线 | 是。10 /10 VF、16 /16 VETO-CFG、16 /16 RL的映射见追溯与review分件。 |
| 6. 能否回指来源、证据和report | 可以。逐VETO闭环见`06_acceptance_step_11_veto_traceability_register.md`。 |
| 7. 是否逐项停审 | 已完成17 /17设计停审,但没有runtime评估或用户审查结论。见review分件。 |
| 8. 是否仍有孤儿、重复、风险冲突或不可执行检查 | 未发现设计层unresolved项。重叠已按“静态ownership / runtime writer”“材料泄漏 / truth升格”“证据缺失 /证据伪造”等边界拆开。 |

---

## 4. 编号合并与裁决原则

### 4.1 唯一编号规则

- 正式验收只使用`VETO-SBX-001~017`作为最终否决索引。
- `VF-SBX-*`、`VETO-CFG-*`和`RL-SBX-*`继续作为正式来源引用,不得删除、改号或互相替代。
- 一个VETO可以承接多个来源;一个来源也可以被多个正交VETO覆盖。必须指定primary trigger,避免同一finding生成多个互不关联的S级缺陷。
- 表中TC range只为设计可读性。未来machine evidence和checklist必须展开每个完整`TC-SBX-*`、`AC-SBX-*`、`VF-SBX-*`、`VETO-CFG-*`和`RL-SBX-*`。

### 4.2 触发成立的最低条件

一个VETO只有同时满足以下条件才可记为`Triggered`:

1. 固定RELEASE及适用source run identity有效,没有跨revision、generation、candidate或profile拼接。
2. 至少一个有效raw case / check对该VETO的trigger predicate给出肯定finding,且finding能回指exact assertion、input identity和digest。
3. suite / check report原样保留该finding,没有把`Failed / Blocked / InfraFailed`改写为`Passed / Skipped / N/A`。
4. evidence detail和RELEASE evidence index可回指raw / report pair;独立review没有未解决的真实性争议。

以下事实本身不构成`Triggered`:

- 目标实现仓、environment、candidate backend、provider、lab或P0-Q identity尚未形成。
- planned ESLOT没有runtime实例,或者required report / review尚不存在。
- check脚本无法启动、scanner崩溃、dependency graph无法生成、report generator失败。
- suite / gate为`Blocked`、`InfraFailed`或只有泛化`Failed`,但没有有效finding证明具体红线谓词。
- redaction未执行、dependency graph缺失或pairing缺失。它们阻断裁决;只有确认泄漏、非法依赖或伪造行为才触发对应VETO。

### 4.3 `Triggered`与`Blocked`传播

| 情形 | VETO disposition | 总体影响 |
|---|---|---|
| 有效证据确认trigger predicate为真 | `Triggered` | 当前验收总体结论只能“不通过”;进入S级、containment / preserve和新packet复验路径 |
| 证据、环境、identity、check、report或review不足以判定predicate | `Blocked` | 不得声明通过 /有条件通过,也不得写成VETO命中;补齐前DecisionReady为否 |
| 有效证据覆盖全部适用分支并确认predicate为假 | `NotTriggered` | 仅表示该VETO在当前固定packet未命中,不代表对应AC或总体通过 |
| 尚未开始评估 | `NotEvaluated` | 当前设计阶段所有17项的真实状态 |
| 独立review对证据identity、finding或predicate存在未决冲突 | `Disputed` | 按阻断处理;不得用争议覆盖已经确认且不可变的Triggered记录 |

---

## 5. VETO checklist契约

### 5.1 固定入口与字段

唯一验收入口固定为`reports/acceptance/veto-checklist.md`。该文件必须绑定同一fixed RELEASE及有序`MAIN-CONTRACT -> MAIN-SEAM -> OPS -> P0Q`四source,并逐项至少包含:

| 字段 | 必填语义 | 禁止表达 |
|---|---|---|
| release / source identity | release run ref、四source role / run / ENV / PROFILE / revision / config digest | `latest`、CI URL或分支名作为唯一identity |
| `veto_id` / predicate version | exact `VETO-SBX-*`与本设计来源版本 | 只写自由文本红线 |
| source refs | exact VF / VETO-CFG / RL / AC / NFCHK | 只写“安全问题”或“见测试” |
| evidence refs | `(run_id,evidence_id,artifact_digest)`及exact TC / assertion | ESLOT、Markdown行号或静态EV alias冒充实例 |
| raw / check / report refs | path + digest + status,包含必需validation control | 只贴截图、日志片段或suite总绿 |
| defect / containment refs | Triggered时S级defect和现场保留 /containment引用 | 缺defect时把Triggered降级 |
| review refs | reviewer / agent review version与争议处置 | generator自审或review回写raw |
| disposition / reason | 五值闭集及stable reason code / safe说明 | 默认Passed、空checkbox、`N/A`吞并 |

### 5.2 验收本地disposition

`NotEvaluated / Blocked / NotTriggered / Triggered / Disputed`只属于VETO checklist裁决层,不是测试状态、领域状态、缺陷状态或新增Rust enum。底层`Passed / Failed / Blocked / InfraFailed / NotRunConditional`必须原样保留。

同一checklist revision内禁止覆盖历史disposition。补证、修复或争议解决必须形成新review version;原`Triggered`packet保持不可变,后续只能由新fixed source run和新RELEASE证明修复后的新packet未命中。

---

## 6. 一票否决项闭集

| 否决项ID | 一票否决项 | 否决原因 | 核心证据 /检查方式 |
|---|---|---|---|
| `VETO-SBX-001` | `C-SBX-1~5`任一核心节点被删除、绕过或替代,或P0-C / P0-Q任一mandatory轴被另一profile /轴冒充满足 | 受控执行隔离闭环或release双轴不成立 | 核心CMD / state / safety TC、P0Q qualification、四source `gate-results.md`与RELEASE evidence index |
| `VETO-SBX-002` | host、caller-local、bypass、anonymous、fake或fixture执行被声明为formal sandbox success | 正式entry、environment identity与隔离载体边界失效 | `NFCHK-SBX-013`;CMD / CFG / CONF / ARCH exact TC;SUITE-004 /013;qualification identity check |
| `VETO-SBX-003` | resource / filesystem / network / process任一维unsupported、ignored、跨代或未验证仍launch / partial success | coherent boundary被拆散,sandbox无法证明隔离 | `NFCHK-SBX-014`;CMD-003/004、CONF-001~006等;SUITE-004 /013与P0Q forbidden probes |
| `VETO-SBX-004` | policy / authorization missing、stale、conflict、unsupported、unparseable或unauthorized高风险动作仍执行 | fail-closed失效,策略执行裁定不可信 | `NFCHK-SBX-009/015`;CMD-005/006/008、ERR-005、CFG-018、CONF适用TC |
| `VETO-SBX-005` | Sandbox拥有 /定义外部truth正文或领域编排,包括identity / work / tool semantic、runtime agent loop / recovery、member lifecycle、artifact / observability / policy truth | execution isolation truth ownership和项目裁剪边界被反转 | RL ownership / ref checks、CTR / ARCH / protocol / scope-absence TC、dependency与protocol report |
| `VETO-SBX-006` | raw secret、credential、external / provider body、process output、stack或full sensitive ref进入任一truth / DTO / config / workload / audit / report / log / metric / event / handoff carrier | 安全、body-free与相邻仓truth边界失效 | `NFCHK-SBX-016/036`;redaction raw check与`redaction-check.md`;negative synthetic marker TC |
| `VETO-SBX-007` | invalid / required-failure / partial / mixed config generation发布任一可用handle,或标记Ready / Degraded供entry使用 | atomic generation与hard guard被绕过 | CFG-005/011/014/016等;SUITE-003 /008;generation raw / report与pairing check |
| `VETO-SBX-008` | unsupported S07 / S08 / reload / LKG / hot等声明被silent ignore / fallback,或deprecated / compatibility窗口允许安全削弱继续成功 | unsupported能力或红线被伪装成兼容成功 | CFG-007/008/029、ARCH-002、COND-003;SUITE-003 /016;scope-absence / config report |
| `VETO-SBX-009` | capture、candidate、handoff receipt、usage / audit / telemetry material被升格为formal artifact、baseline、evidence或observability truth | 下游正式truth owner和材料分层失效 | `NFCHK-SBX-017`;CMD-009~012、CNS-013~020、JOB-004/007;handoff / write-audit evidence |
| `VETO-SBX-010` | accepted truth缺formal audit,telemetry / provider audit / log替代formal audit,或关键accept / reject / boundary / policy / handoff / failure / control / redline链不可重建 | 正式问责和验收追溯链断裂 | `NFCHK-SBX-019~024/036`;AUDIT slot、UoW TC、evidence index与report-audit |
| `VETO-SBX-011` | relay / handoff / publish失败回滚source truth / capture,或绕过stored payload按当前truth重建payload | no-rollback、历史事实与重放确定性失效 | `NFCHK-SBX-010/021/030/032`;CNS / EVT / JOB / RACE relay TC;RELAY slot |
| `VETO-SBX-012` | caller、backend、query、projection、job或reconciliation成为第二truth writer,或形成第二套execution / policy / control正式语义 | 单一truth、query no-write和maintenance no-repair失效 | `NFCHK-SBX-025/030/035`;QRY-001~026、JOB-008~012、ARCH-003;write-audit raw |
| `VETO-SBX-013` | duplicate、stored result、receipt或report因missing / retention / migration被重算,重跑owner mutation或产生第二次副作用 | 幂等、历史结果和single-winner失效 | `NFCHK-SBX-027~029`;TXN-007~014、CNS-003/004、JOB-011、RACE;REPLAY / CONSISTENCY slot |
| `VETO-SBX-014` | cleanup / reaper在handoff、audit、evidence、investigation或guard未Allowed时删除 /释放,或存在force-clean / fake Released | 先删证据并破坏安全交接与复验能力 | `NFCHK-SBX-018/022/033`;CMD-017~020、JOB-005~007、CFG-022、CONF-009;cleanup check |
| `VETO-SBX-015` | lease expiry、orphan或redline事件在托管恢复外继续运行,redline仅advisory,或普通receipt / migration自动解除containment | failure classification、lease / reaper与redline containment失效 | CMD-013~020、JOB-005~007、CONF-007/009/010;SAFETY / QUAL-LIFECYCLE slot与cleanup disposition |
| `VETO-SBX-016` | 引入非`core-contracts` sibling compile dependency,或模块方向 /entry boundary越界形成反向依赖、直访repository / backend或第二business trait | 全局依赖裁剪与七模块职责边界失效 | ARCH-001/003、CTR-003、CFG-014/017适用;dependency raw check与`dependency-boundary.md` |
| `VETO-SBX-017` | 静态JSON / Markdown /手写表制造EV、report、pass或签署,篡改底层状态 / identity / digest,隐藏Blocked / Failed,或造成不可恢复的evidence integrity失真 | 验收输入不真实,任何通过结论均无效 | VC-SBX-003~009、ECA-SBX-001~021;`report-audit.md`、`gate-results.md`、evidence index和独立review |

逐项完整来源、TC、slot、suite、raw / check和report path见追溯分件。上表没有任何runtime disposition;当前17项全部是`NotEvaluated`。

---

## 7. 逐项trigger predicate与缺失传播

| VETO | `Triggered`的肯定谓词 | 只能`Blocked` /不可裁决的情形 |
|---|---|---|
| 001 | 有效证据确认核心节点被省略 /替代仍汇总通过,或P0轴被非同轴结果替代 | P0-Q环境 / packet缺失,或任一核心slot尚无实例 |
| 002 | 正式success的execution carrier被证实为host / local / bypass / anonymous / fake / fixture | qualification identity或carrier proof缺失 |
| 003 | 有效launch中至少一维未落实 /被忽略 /跨代,或forbidden probe成功 | probe未执行、candidate不可用或capability evidence缺失 |
| 004 | 非Allowed policy / authorization情形出现backend / launch /高风险动作成功 | policy source、snapshot或test harness缺失导致未执行 |
| 005 | schema / writer / dependency /行为证实Sandbox持有外部truth或实现外部领域生命周期 | 只缺schema inventory、protocol report或dependency graph |
| 006 | raw check确认任一禁止材料进入扫描根或public carrier | redaction未执行、scanner故障或扫描根 / digest不完整 |
| 007 | invalid / mixed / incomplete generation存在entry可见handle或正式Ready / Degraded可用状态 | builder / publication suite未执行或raw pair缺失 |
| 008 | unsupported声明返回成功 / fallback当前snapshot,或安全削弱在兼容窗口生效 | future surface未激活且正式保持absent / reject |
| 009 | receipt / candidate / telemetry直接创建或覆盖下游formal truth | handoff target未形成或相应TC未执行 |
| 010 | accepted mutation被证实没有formal audit /关键因果ref,或仅靠log / telemetry重建 | audit / trace evidence尚未生成或report不可读 |
| 011 | failure路径确认source truth回滚或payload从当前truth重建后发布 | relay / handoff producer未执行或stored payload evidence缺失 |
| 012 | write-audit确认query / job等写core truth,或同一signal按caller / backend分叉 | write-audit / selector / protocol evidence缺失 |
| 013 | duplicate命中后再次调用owner / backend / selection或重算stored result / report | duplicate / replay TC或stored result fixture未执行 |
| 014 | guard非Allowed / blocking ref存在时仍执行delete / release或伪造Released | cleanup disposition / guard input缺失或check故障 |
| 015 | lease / orphan / redline在containment外继续,或非formal control解除containment | lifecycle / lab / candidate缺失导致真实路径未执行 |
| 016 | manifest / graph或module check确认非法compile edge /反向模块调用 | target repo / manifest / graph尚不存在或check无法运行 |
| 017 | raw / report diff确认静态造证、状态 / identity / digest篡改或故意隐藏阻断状态 | 普通missing pair、report generator故障、review缺失或可恢复schema错误 |

---

## 8. 总体裁决、处置与复验

### 8.1 决策表

| 17项disposition聚合 | VETO维度结论 | 总体结论上限 |
|---|---|---|
| 任一`Triggered` | VETO命中 | 只能“不通过”;禁止“有条件通过” |
| 无Triggered,但存在`Blocked / Disputed / NotEvaluated` | VETO未完成裁决 | 不得进入最终通过判断;DecisionReady为否 |
| 17项全部`NotTriggered` | VETO维度满足 | 仅允许继续结合AC、缺陷、风险、review和签署裁决;不自动通过 |

### 8.2 Triggered后的固定路径

1. 原fixed run、raw、report、check、evidence tuple、checklist和review记录不可变保留。
2. 按正式`05`规则建立S级处置,阻断相关gate与RELEASE;涉及运行安全时停止新launch并保持containment。
3. 缺陷编号尚未建立时,checklist仍保持`Triggered`;“缺defect”是额外流程缺口,不是降级理由。
4. 修复后至少执行L-R5:新MAIN-CONTRACT、MAIN-SEAM、OPS、P0Q四source run与新RELEASE聚合;按适用项扩大family / suite / gate复验。
5. 新packet可形成新的`NotTriggered`,但不得把原packet的`Triggered`改写成未命中或删除原证据。

### 8.3 不可风险接受边界

- 17项全部禁止risk acceptance、waiver、conditional pass、deadline承诺或签署覆盖。
- `reports/acceptance/risk-acceptance.md`若引用任一`VETO-SBX-*`作为接受对象,该风险记录本身无效并阻断DecisionReady。
- P1 / P2、PROFILE-06 /07、旧run、旧candidate、其他backend或人工抽查不得补偿P0-C / P0-Q VETO缺口。
- 只有未来Step 13认定且不触及VETO / S / P0硬门禁的候选遗留项才可能进入风险接受。

---

## 9. 正式`06` §11回填草稿

Step 15装配时,正式§11必须包含以下内容,且不得预填实际状态:

1. 唯一否决项闭集为`VETO-SBX-001~017`,表项采用本文件§6。
2. 每项必须回指正式VF / VETO-CFG / RL / AC、exact TC / assertion、runtime evidence tuple、raw / check、fixed report和`reports/acceptance/veto-checklist.md`。
3. checklist disposition只使用`NotEvaluated / Blocked / NotTriggered / Triggered / Disputed`,并声明其不是测试 /领域状态enum。
4. 有效证据确认predicate才可`Triggered`;环境、identity、evidence、check、report或review缺失只能`Blocked`或`NotEvaluated`。
5. 任一`Triggered`锁定总体“不通过”;任何VETO均不得风险接受或条件放行。
6. 17项全部`NotTriggered`只关闭VETO维度,不得替代功能、NFR、缺陷、风险、review和签署裁决。
7. 当前正式装配只能写设计规则和未评估事实,不得写run_id、EV alias、命中、未命中、defect、risk acceptance或验收结论实例。

---

## 10. 当前Readiness、blocker与边界结论

| 项目 | 当前状态 | 对本Step的影响 |
|---|---|---|
| `SBX-ACC-VETO-001` | design resolved by本Step,待用户审查 | 三件产物完成后可停审;不代表runtime VETO已评估 |
| `SBX-ACC-EVIDENCE-001` | open_for_runtime_evidence | 21个slot无实例,所以17项当前均`NotEvaluated` |
| `SBX-ACC-DELIVERY-001` | open_for_delivery_baseline | 无目标仓 / revisions / config digest / fixed release run,阻塞真实checklist |
| `SBX-ACC-EXECUTION-001` | open_for_07_precheck_and_execution | 无真实suite / scripts / CI / ENV,阻塞执行 |
| `SBX-ACC-P0Q-001` | open_for_p0q_execution | P0-Q保持Blocked,不得被判为VETO已命中或由低profile替代 |
| `SBX-ACC-RETENTION-001` | open_for_07_09_physical_policy | 不阻塞VETO设计;物理策略不得绕过Triggered evidence保留 |
| `SBX-ACC-DESIGN-REOPEN-001` | blocker_if_triggered | 若未来predicate无法由正式契约唯一判定,先回写上游而非由`06`补语义 |

当前没有阻塞Step 11设计收口的未解上游blocker。开放项阻塞真实执行、evidence、VETO评估、风险裁决和签署,不授权伪造`NotTriggered`或缩减VETO闭集。

---

## 11. Step停审状态

```text
current_document = `06-验收标准.md`
current_step = Step 11 `定义一票否决项`
main_artifact = completed_reviewed_passed_to_step_12
runtime_veto_evaluated = no
veto_count = 17
current_runtime_disposition = all_not_evaluated
formal_document_modified = no
next_allowed_action = 用户已确认;由Step 12定义缺陷分级、复验与放行规则
commit_required = no
```
