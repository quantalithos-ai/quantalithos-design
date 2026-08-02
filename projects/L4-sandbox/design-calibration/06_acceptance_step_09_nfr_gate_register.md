# Step 9 分件 A. 六类非功能逐维门禁登记

> 父Step: `06_acceptance_step_09_nonfunctional.md`
> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 9
> 正式来源: `00-需求文档.md` §13~§14;`03-详细设计.md` §10~§15;`04-配置设计.md` §8~§14;`05-测试方案.md` §9~§14
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_10
> 事实成熟度: `PassDesign`;0 target repo,0 fixed run,0 runtime EV,真实验收仍为`NotEntered`

---

## 1. 登记口径

- `NFCHK-SBX-001~036`是Step 9检查索引,不是新canonical AC,不得写入需求或runtime evidence的`ac_refs`代替`AC-SBX-036~041`。
- 每个canonical AC必须同时满足其6个applicable检查;不得平均、抽样、waive或用另一NFR绿色结果补偿。
- 表内TC range只为设计可读性。机器evidence item必须展开完整`TC-SBX-*`、`PER-SBX-*`、`CUT-SBX-*`和assertion code数组。
- 表内`PER-SBX-004~007`、`ESLOT-SBX-003~006 /014`、`VF-SBX-007/008`等紧凑写法按同一正式前缀逐项展开;`MC-04 /14`表示MAIN-CONTRACT来源中的`SUITE-SBX-004 /014`,`MS / OPS / Q / P1`同理。这些都是文档缩写,不是新ID。
- `ESLOT-SBX-*`是planned slot。只有真实case raw、suite report、check和digest闭合后才能生成`EV-SBX-*`;本文件不分配alias。
- P0-C、P0-Q、conditional三种成熟度正交:P0-C失败直接失败;P0-Q缺失保持Blocked;conditional未激活保持NotRunConditional。

### 1.1 Source与路径缩写

| 缩写 | Fixed source | 固定环境 / profile | 典型路径 |
|---|---|---|---|
| `MC` | MAIN-CONTRACT | SBX-ENV-02 / SBX-PROFILE-02 | `reports/runs/<main_contract_run_id>/suites/<suite_id>.md` |
| `MS` | MAIN-SEAM | SBX-ENV-03 / SBX-PROFILE-03 | `reports/runs/<main_seam_run_id>/suites/<suite_id>.md` |
| `OPS` | OPS | SBX-ENV-04 / SBX-PROFILE-04 | `reports/runs/<ops_run_id>/suites/<suite_id>.md` |
| `Q` | P0Q | SBX-ENV-05 / SBX-PROFILE-05 | `reports/runs/<p0q_run_id>/suites/SUITE-SBX-013.md` |
| `P1` | Conditional | SBX-ENV-06 / SBX-PROFILE-06 | `reports/runs/<conditional_run_id>/suites/SUITE-SBX-015.md` |
| `REL` | RELEASE aggregation | SBX-ENV-02 / SBX-PROFILE-02聚合器 | `reports/runs/<release_run_id>/evidence-index.md` |

每项最终定位链固定为`REL evidence index -> source evidence detail -> source suite report -> case JSON / check JSON -> digest`。`REL`只聚合,不凭聚合器环境产生P0证明效力。

---

## 2. AC-SBX-036 性能与结构有界性

| 检查索引 | 指标 /设计契约 | Exact TC / PER | Planned slot / source | 通过条件 | 失败条件 /裁决 |
|---|---|---|---|---|---|
| `NFCHK-SBX-001` | 核心前置闭集;外围inspect / preview / trend / comparison / multi-host不是C-SBX-1~5前置 | `TC-SBX-COND-004`;适用`TC-SBX-CMD-001~020`;PER-SBX-004~007 | ESLOT-SBX-003~006 /014;MC-04 /14 | optional port调用`=0`;核心产生正式成功或正式失败surface,不无限等待 | optional缺失阻断核心或产生伪成功 -> AC-SBX-036 Failed |
| `NFCHK-SBX-002` | Query只访问显式selector / page,不全仓scan且永不write | `TC-SBX-QRY-001~026`;`TC-SBX-COND-004`;PER-SBX-010 /019 /023 | ESLOT-SBX-007 /014;MC-04 /14 | visited refs属于selection;write / repair calls `=0`;page cursor类型正确 | 无界scan、拼ref、query write / repair -> AC-SBX-036 Failed |
| `NFCHK-SBX-003` | Job batch只处理显式selection并逐item对账 | `TC-SBX-JOB-001~012`;`TC-SBX-COND-004`;PER-SBX-013 /019 /030 | ESLOT-SBX-007 /013 /014;MC-06 /14;OPS-12 /14 | visited为selection子集;counts / refs / cursor一致;partial不重跑整批 | 隐式扩scope、伪全成功、整批重放副作用 -> AC-SBX-036 Failed |
| `NFCHK-SBX-004` | retry / duplicate / race调用与副作用有界 | `TC-SBX-TXN-007~014`;`TC-SBX-RACE-001~019`;`TC-SBX-COND-004`;PER-SBX-024 /025 | ESLOT-SBX-010 /011 /014;MC-07 /09 /14;OPS补强 | single winner;duplicate owner / port calls `=0`;loser正式返回 | 第二次owner副作用、双winner、偶现压测替代deterministic断言 -> AC-SBX-036 /040 Failed |
| `NFCHK-SBX-005` | generation / apply / rollback / drift只处理显式generation与scope | `TC-SBX-CFG-024~028`;`TC-SBX-COND-004`;PER-SBX-030 | ESLOT-SBX-014;MC-03 /14;OPS-12 /14 | builder / publish调用有界;失败保留history;不循环fallback / auto-repair | 无界重试、history覆盖、自动truth rewrite -> AC-SBX-036 /040 Failed |
| `NFCHK-SBX-006` | 每个结构case记录phase duration / count / call count并解释等待归因;数字与量化SLO分离 | `TC-SBX-COND-004`;conditional `TC-SBX-COND-005`;PER-SBX-030 /037 /038 | ESLOT-SBX-014;conditional ESLOT-SBX-020 /021;MC-14;P1-15 | P0 sample可回指case;每段等待绑定phase、count、result及typed dependency / timeout disposition,未归因间隙`=0`;当前不按duration值判fail | sample /归因缺失 -> Failed;把历史数字判pass / fail -> evidence invalid;未激活量化保持NotRunConditional |

---

## 3. AC-SBX-037 可用性与Fail-Closed

| 检查索引 | 故障面 /设计契约 | Exact TC / PER | Planned slot / source | 通过条件 | 失败条件 /裁决 |
|---|---|---|---|---|---|
| `NFCHK-SBX-007` | context / identity / ref missing、conflict、unavailable不补造语境 | `TC-SBX-CMD-001/002`;`TC-SBX-CNS-005/006`;`TC-SBX-ERR-014/015`;PER-SBX-003 /011 /026 | ESLOT-SBX-002 /008 /012;MC-02 /04 /05 /10;MS-05 /10 | Pending / Rejected / Unresolved / Delayed等正式surface;launch`=0` | 匿名 /默认语境继续或source body入仓 -> AC-SBX-037 /038 Failed |
| `NFCHK-SBX-008` | capability / backend stale、partial、unsupported、unavailable不形成weak boundary | `TC-SBX-CMD-003/004`;`TC-SBX-ERR-006/007/027`;`TC-SBX-CONF-001~006`;PER-SBX-004 /015 /026 /034 | ESLOT-SBX-003 /012 /017;MC-02 /04 /10;Q-13 | boundary非Coherent;0 host / fake fallback;Q真实probe按packet裁决 | partial success / weak fallback -> Failed;Q未执行 -> Blocked |
| `NFCHK-SBX-009` | policy / authorization missing、stale、conflict、unsupported、unknown高风险必须fail-closed | `TC-SBX-CMD-005/006/008`;`TC-SBX-ERR-005`;`TC-SBX-CFG-018`;PER-SBX-005 /016 /026 /028 | ESLOT-SBX-004 /012 /013;MC-02 /04 /10 | decision不为Accepted;backend / launch call`=0`;新summary用新decision | permissive fallback /本地allowlist /旧decision重开 -> AC-SBX-037 /038 Failed |
| `NFCHK-SBX-010` | capture / handoff / relay dependency失败不回滚source且不伪交接 | `TC-SBX-CMD-009~012`;`TC-SBX-CNS-013~022`;`TC-SBX-EVT-015`;`TC-SBX-ERR-035~038`;PER-SBX-006 /011 /017 /020 /026 | ESLOT-SBX-005 /008 /009 /012;MC-04~06 /10;MS-05 /08 /10;OPS补强 | capture Partial / Failed;target progress Retryable / Failed;relay Retryable / Failed / DeadLetter诚实;capture / source truth保留 | material DeadLetter、伪Delivered、ack无receipt、同attempt重送、publish failure回滚source -> AC-SBX-037 /039 /040 Failed |
| `NFCHK-SBX-011` | Query / projection / maintenance dependency失败只产生read / report owner状态 | `TC-SBX-QRY-017~024`;`TC-SBX-JOB-008~012`;`TC-SBX-ERR-019/020/025/026/034`;PER-SBX-008 /010 /013 /019 /026 | ESLOT-SBX-007 /012;MC-04 /06 /10;OPS-12 | Query Degraded / Missing且write`=0`;Job honest PartialFailed / Degraded;可重放stored report | query repair、job改core truth、缺report仍Succeeded -> AC-SBX-037 /040 Failed |
| `NFCHK-SBX-012` | lifecycle / telemetry / harness不可用必须区分产品surface与执行前置 | `TC-SBX-CMD-013~020`;`TC-SBX-JOB-005~007`;`TC-SBX-CFG-015/022`;`TC-SBX-CONF-007~010`;PER-SBX-007 /018 /032 /035 | ESLOT-SBX-006 /015 /018;MC / OPS / Q | optional telemetry只可qualified Degraded;formal audit / guard保持;candidate前置缺失Q为Blocked且0 launch | telemetry关闭audit / guard,或环境缺失被写negative pass -> AC-SBX-037 /041 Failed或Q Blocked |

---

## 4. AC-SBX-038 安全与隔离红线

| 检查索引 | 红线 /设计契约 | Exact TC / PER | Planned slot / source | 通过条件 | 失败条件 /裁决 |
|---|---|---|---|---|---|
| `NFCHK-SBX-013` | formal entry、责任链与candidate substitution;host / caller-local / anonymous不得冒充sandbox | `TC-SBX-CMD-001~004/007/008`;`TC-SBX-CFG-010`;`TC-SBX-CONF-011/012`;`TC-SBX-ARCH-001`;PER-SBX-003 /004 /031 /036 | ESLOT-SBX-002 /003 /016 /019;MC-03 /04;Q-13 | formal run / handle仅来自完整entry + fixed packet;非法路径launch`=0` | 任一宿主 /旁路 /匿名formal成功 -> AC-SBX-038 Failed,VF-SBX-002候选 |
| `NFCHK-SBX-014` | resource / filesystem / network / process四维同代coherent施加 | `TC-SBX-CMD-003/004`;`TC-SBX-ERR-006/007`;`TC-SBX-CONF-001~006`;PER-SBX-004 /015 /034 /036 | ESLOT-SBX-003 /012 /017 /019;MC语义;Q-13真实证明 | 任一维缺失整体拒绝;Q forbidden probe成功数`=0`;无host fallback | silent degrade、partial ignore或未验证继续 -> AC-SBX-038 Failed,VF-SBX-003候选 |
| `NFCHK-SBX-015` | policy / unauthorized egress / high-risk / escape-like动作不继续 | `TC-SBX-CMD-005/006/008`;`TC-SBX-ERR-005`;`TC-SBX-CONF-004/005/010`;PER-SBX-005 /016 /034 /035 | ESLOT-SBX-004 /012 /017 /018;MC-04 /10;Q-13 | 未授权动作成功数`=0`;non-Allowed时backend call`=0`;redline进入containment | 越权继续、unknown映射allow、probe逃逸 -> AC-SBX-038 Failed,VF-SBX-004候选 |
| `NFCHK-SBX-016` | external body / raw material / secret / stack不得进入任何carrier | `TC-SBX-CTR-006`;`TC-SBX-ERR-008/033`;`TC-SBX-CFG-009/012/013/030`;`TC-SBX-CONF-013`;PER-SBX-001 /026 /029 /032 /035 /036 | ESLOT-SBX-001 /012 /015 /018 /019;MC-01 /03 /10;Q-13 | synthetic marker泄漏`=0`;失败报告不回显matched正文;provider lease identity连续 | 任一泄漏或unsafe diagnostic -> AC-SBX-038 Failed,VF-SBX-005候选 |
| `NFCHK-SBX-017` | output / candidate / observability material不静默升格外部truth | `TC-SBX-CMD-009~012`;`TC-SBX-CNS-013~020`;`TC-SBX-JOB-004/007`;PER-SBX-006 /011 /013 /017 /018 | ESLOT-SBX-005 /006 /008;MC-04~06;MS-05;OPS-12 | 只保存sandbox fact / marker / body-free refs;downstream receipt不改capture / safety owner | 直接形成artifact / evidence / observability truth -> AC-SBX-038 Failed,VF-SBX-006候选 |
| `NFCHK-SBX-018` | cleanup先删、orphan脱管、redline advisory或普通receipt解除containment均禁止 | `TC-SBX-CMD-017~020`;`TC-SBX-JOB-005~007`;`TC-SBX-ERR-010/011`;`TC-SBX-CONF-009/010`;PER-SBX-007 /018 /026 /035 | ESLOT-SBX-006 /012 /018;MC-02 /04 /06 /10;OPS-12;Q-13 | non-Allowed release call`=0`;blocking refs保留;orphan / redline在托管收束内 | 提前删材料、托管外运行、advisory redline -> AC-SBX-038 Failed,VF-SBX-007/008候选 |

---

## 5. AC-SBX-039 审计与可追溯

| 检查索引 | 追溯主题 /设计契约 | Exact TC / PER | Planned slot / source | 通过条件 | 失败条件 /裁决 |
|---|---|---|---|---|---|
| `NFCHK-SBX-019` | 受理 /拒绝 /归责 /来源引用可回链 | `TC-SBX-CMD-001/002`;`TC-SBX-STA-001~003`;`TC-SBX-QRY-025/026`;PER-SBX-003 /014 /023 /032 | ESLOT-SBX-002 /015;MC-02 /04 | context / identity /actor /source refs、reason和cursor可定位;restricted不泄漏 | formal execution无法解释发起语境或拒绝原因 -> AC-SBX-039 Failed |
| `NFCHK-SBX-020` | boundary / capability / policy decision可回链 | `TC-SBX-CMD-003~006/008`;`TC-SBX-STA-004~012`;`TC-SBX-EVT-001~003`;PER-SBX-004 /005 /015 /016 /032 | ESLOT-SBX-003 /004 /015;MC-02 /04 /05 | decision ref、summary ref、from /to status、reason、trace关联完整 | 只有log或adapter raw,无formal owner trace -> AC-SBX-039 Failed |
| `NFCHK-SBX-021` | run / capture / handoff与下游marker可回链 | `TC-SBX-CMD-007~012`;`TC-SBX-STA-013~015`;`TC-SBX-CNS-013~020`;`TC-SBX-EVT-004~006`;PER-SBX-006 /017 /032 | ESLOT-SBX-005 /008 /015;MC-02 /04 /05;MS-05 | run / capture / handoff refs、状态、source cursor、receipt / report refs完整 | 无法解释产生、交给谁或失败位置 -> AC-SBX-039 Failed |
| `NFCHK-SBX-022` | failure / control / cleanup / redline可回链且保留因果 | `TC-SBX-CMD-013~020`;`TC-SBX-STA-016~019`;`TC-SBX-JOB-005~007`;PER-SBX-007 /018 /032 /035 | ESLOT-SBX-006 /015 /018;MC-02 /04 /06;OPS-12;Q-13 | 原失败、后续动作、guard / investigation / disposition refs连续 | 覆盖原失败、丢blocking ref或强制cleanup改truth -> AC-SBX-039 Failed |
| `NFCHK-SBX-023` | accepted UoW、protocol / relay / job trace与不确定恢复可回链 | `TC-SBX-TXN-001~006/011`;`TC-SBX-EVT-001~015`;`TC-SBX-QRY-025/026`;PER-SBX-012 /022 /023 /032 | ESLOT-SBX-009 /011 /015;MC-05 /07 /11;MS补强;OPS补强 | truth / audit / relay / result / cursor适用同UoW;unknown / rollback failure有safe disposition | truth缺audit / result / relay、unknown盲重试、只有telemetry -> AC-SBX-039 Failed |
| `NFCHK-SBX-024` | source run / evidence回链不丢exact TC、assertion、raw / report与digest | `TC-SBX-CTR-003~006`;以上各producer exact TC;PER-SBX-001 /002 /029 /032 /036适用 | ESLOT-SBX-001 /015 /019及各domain slot;REL +四源 | fixed source role / run / digest、case / suite / evidence identity连续;validation control全绿 | 缺pairing / digest / source或静态补证 -> AC不可裁决且Step 10 evidence gate失败 |

---

## 6. AC-SBX-040 幂等与一致性

| 检查索引 | 一致性主题 /设计契约 | Exact TC / PER | Planned slot / source | 通过条件 | 失败条件 /裁决 |
|---|---|---|---|---|---|
| `NFCHK-SBX-025` | 不同caller / adapter / protocol保持同一execution / policy / control语义 | `TC-SBX-CTR-001~005`;`TC-SBX-CMD-001~020`;`TC-SBX-CNS-001~022`;`TC-SBX-JOB-001~012`;PER-SBX-001 /002 /009 /011 /013 /031 | ESLOT-SBX-001 /002 /008 /013;MC-01 /04~06 /08;MS补强 | fake / controlled seam与formal contract同错误、状态、side effect语义 | 按caller / backend切换第二语义 -> AC-SBX-040 Failed,VF-SBX-009候选 |
| `NFCHK-SBX-026` | accepted UoW全量可见 /不可见,query只见完整snapshot | `TC-SBX-TXN-001~006/013/014`;`TC-SBX-RACE-019`;PER-SBX-022 /023 /025 | ESLOT-SBX-011;MC-07 /09 | truth / audit / relay / stale / result / idempotency / cursor适用原子;rollback零半组 | 任一half group、query中间态或fake忽略事务 -> AC-SBX-040 Failed |
| `NFCHK-SBX-027` | Command / Consumer / Job same digest返回stored typed result | `TC-SBX-TXN-007~012`;`TC-SBX-CNS-003/004`;`TC-SBX-JOB-011`;PER-SBX-021 /024 | ESLOT-SBX-010;MC-02 /05~07 | duplicate resolver / backend / selection / owner mutation`=0`;different digest conflict | 重跑mutation、wrong kind强转、missing result重算 -> AC-SBX-040 Failed |
| `NFCHK-SBX-028` | commit unknown、rollback failure、expected version和unique create不盲覆盖 | `TC-SBX-TXN-003~005/013/014`;`TC-SBX-ERR-016/022~024`;PER-SBX-022 /023 /026 | ESLOT-SBX-011 /012;MC-07 /10 | unknown先查record / result / truth;loser VersionConflict;不宣称clean rollback | 换key盲写、overwrite / merge、伪回滚成功 -> AC-SBX-040 Failed |
| `NFCHK-SBX-029` | 19类race deterministic single winner + formal loser +零半状态 | `TC-SBX-RACE-001~019`;PER-SBX-025 | ESLOT-SBX-011;MC-09;OPS-09补强 | 每类双顺序;single winner;loser typed surface;owner group完整 | double winner、loser吞错、偶现压力绿色替代 -> AC-SBX-040 Failed |
| `NFCHK-SBX-030` | Query no-write、Job / reconciliation no-repair、relay / handoff no-rollback | `TC-SBX-QRY-001~026`;`TC-SBX-JOB-008~012`;`TC-SBX-ERR-009/019/020/035~038`;PER-SBX-008 /010 /012 /013 /019 /020 /026 | ESLOT-SBX-007 /009 /012;MC-04~06 /10;MS补强;OPS-12 | query writes`=0`;job只写owning marker / report;source truth稳定 | read修truth、maintenance修core、publish / delivery失败回滚source -> AC-SBX-040 Failed |

---

## 7. AC-SBX-041 可观测性

| 检查索引 | 观测主题 /设计契约 | Exact TC / PER | Planned slot / source | 通过条件 | 失败条件 /裁决 |
|---|---|---|---|---|---|
| `NFCHK-SBX-031` | intake / boundary / policy开始、拒绝、失败与不支持可区分 | `TC-SBX-CMD-001~008`;`TC-SBX-ERR-005~007/014/015/027`;`TC-SBX-CFG-030`;PER-SBX-003~005 /026 /032 | ESLOT-SBX-002~004 /012 /015;MC-03 /04 /10 | safe log / metric / formal trace按owner存在,状态和reason可区分 | missing / stale / conflict / unsupported共用unknown成功surface -> AC-SBX-041 Failed |
| `NFCHK-SBX-032` | run / capture / handoff / relay结果与失败可区分 | `TC-SBX-CMD-007~012`;`TC-SBX-CNS-013~022`;`TC-SBX-EVT-004~015`;`TC-SBX-ERR-035~038`;PER-SBX-006 /011 /012 /017 /020 /032 | ESLOT-SBX-005 /008 /009 /012 /015;MC / MS | capture Complete / Partial / Failed / Unavailable,target Pending / Attempting / Delivered / Retryable / Failed,aggregate机械派生,relay Published / Retryable / Failed / DeadLetter及source refs有safe signal | capture / delivery / publish失败无surface、owner状态混写或被伪success -> AC-SBX-041 Failed |
| `NFCHK-SBX-033` | timeout / kill / resource limit / cleanup guard / orphan / redline可区分检测、收束、待处理 | `TC-SBX-CMD-013~020`;`TC-SBX-JOB-005~007`;`TC-SBX-ERR-010/011`;`TC-SBX-CONF-002/007/009/010`;PER-SBX-007 /018 /026 /035 | ESLOT-SBX-006 /012 /018;MC / OPS / Q | guard / containment / disposition / reason refs存在;真实probe适用时可定位 | 关键non-happy path盲区或托管状态不明 -> AC-SBX-041 Failed;Q缺失Blocked |
| `NFCHK-SBX-034` | config generation、adapter availability和dependency failure有safe surface | `TC-SBX-CFG-001~030`;`TC-SBX-STA-029/030`;`TC-SBX-ERR-028~030`;`TC-SBX-ARCH-001`;PER-SBX-027 /028 /031~033 | ESLOT-SBX-013 /015 /016;MC-02 /03 /08 /10 | StartupBlocked / Degraded / Unavailable与logical signal清晰;hard guard不放宽 | partial generation静默发布、availability授权allow或dependency错误无signal -> AC-SBX-041 Failed |
| `NFCHK-SBX-035` | Query / Consumer / Job / reconciliation观测不反写owner truth | `TC-SBX-QRY-001~026`;`TC-SBX-CNS-001~022`;`TC-SBX-JOB-001~012`;`TC-SBX-EVT-001~015`;PER-SBX-008~013 /019 /020 /032 | ESLOT-SBX-007~009 /015;MC / MS / OPS | view / receipt / report / relay status、counts、refs和safe reason完整 | 只靠free text、缺per-item状态、观测动作产生repair -> AC-SBX-041 Failed |
| `NFCHK-SBX-036` | 全carrier redaction、metric低基数和formal audit分层;optional sink降级不形成盲区 | `TC-SBX-CTR-006`;`TC-SBX-CFG-009/015/030`;`TC-SBX-ERR-001~038`适用;`TC-SBX-CONF-013`;PER-SBX-026 /029 /032 /035 /036 | ESLOT-SBX-012 /015 /018 /019;MC-01 /03 /10;Q-13 | secret / body / full ref / stack泄漏`=0`;metric无高基数;formal audit仍在 | unsafe carrier、telemetry替代audit、redaction scan失败 -> AC-SBX-041 /038 Failed |

---

## 8. 逐维独立停审

| Canonical AC | 检查范围 | 设计闭环 | 当前runtime disposition |
|---|---|---|---|
| AC-SBX-036 | NFCHK-SBX-001~006 | 6 /6有契约、TC、slot、source、通过 /失败和传播 | P0-C `NotEvaluated`;量化`NotRunConditional` |
| AC-SBX-037 | NFCHK-SBX-007~012 | 6 /6闭合;fail-closed与执行前置分层 | P0-C `NotEvaluated`;适用P0-Q `Blocked` |
| AC-SBX-038 | NFCHK-SBX-013~018 | 6 /6闭合;零容忍与VETO候选可定位 | P0-C `NotEvaluated`;P0-Q `Blocked` |
| AC-SBX-039 | NFCHK-SBX-019~024 | 6 /6闭合;Step 8 TX-AUDIT slice保留 | `NotEvaluated`;证据真实性待Step 10 |
| AC-SBX-040 | NFCHK-SBX-025~030 | 6 /6闭合;Step 8 CONSISTENCY slice保留 | `NotEvaluated` |
| AC-SBX-041 | NFCHK-SBX-031~036 | 6 /6闭合;safe observability与formal audit分层 | P0-C `NotEvaluated`;real probe `Blocked` |

36 /36项完成设计停审。0项创建新AC,0项分配runtime EV,0项把Blocked / NotRunConditional / planned path写成Passed。

---

## 9. 分件自检

| 检查项 | 结论 |
|---|---|
| NFCHK编号是否连续唯一 | 通过;001~036。 |
| 六个canonical AC是否各有6项 | 通过;6 x 6。 |
| 每项是否有正式TC / PER | 通过;range必须在runtime item展开。 |
| 每项是否有slot / source role / report入口 | 通过。 |
| 通过 /失败 /缺失传播是否可判定 | 通过。 |
| P0-C / P0-Q / conditional是否被混写 | 否。 |
| 是否用观测log替代formal audit | 否。 |
| 是否用meta-check静态制造EV | 否;NFCHK-SBX-024明确只控制可裁决性并留Step 10。 |
| 是否伪造运行事实 | 否;runtime仍为NotEntered / NotEvaluated / Blocked / NotRunConditional。 |
