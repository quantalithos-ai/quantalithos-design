# Step 8 分件 B. 事务、重放、并发与逐项停审登记

> 父 Step: `06_acceptance_step_08_state_tx_consistency.md`
> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 8
> 正式来源: `03-详细设计.md` §10~§12;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md`;`05-测试方案.md` §6.3 /§9 /§10.4 /§13
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_9
> 事实成熟度: `PassDesign`;0 target repo,0 fixed run,0 runtime EV,真实验收仍为 `NotEntered`

---

## 1. 登记口径

- `TXCHK-SBX-001~014` 和 `RCHK-SBX-001~019` 是 Step 8 检查索引,不是新 canonical AC。正式裁决仍使用 `AC-SBX-032/039/040` 及受影响的 `AC-SBX-006~023`。
- 事务原子性必须检查 truth / marker、audit、relay、projection stale、stored result / receipt / report、idempotency status、cursor 的整组可见性,不能只看 API 返回值。
- Replay 必须分 Command / Consumer / Job 三个 channel;Query 不 reserve idempotency record,只重读 committed view。
- Race 必须由 deterministic barrier / scheduler 固定 interleaving;偶现压测绿色不是证据。每项必须同时证明 single winner、formal loser surface 和零半状态。
- `commit unknown` 和 rollback failure 不允许伪称已回滚或成功;后续只允许先通过同key的idempotency / stored result / truth / relay / marker重建结果。

### 1.1 证据与路径缩写

| 缩写 | 含义 | 固定入口 |
|---|---|---|
| `C11` | `ESLOT-SBX-011 CONSISTENCY` -> future `EV-SBX-CONSISTENCY-011` | TXN-001~006 /013~014,RACE-001~019主证;当前未分配 |
| `RP10` | `ESLOT-SBX-010 REPLAY` -> future `EV-SBX-REPLAY-010` | TXN-007~012主证;当前未分配 |
| `MC-07` | MAIN-CONTRACT / `SUITE-SBX-007` | `reports/runs/<main_contract_run_id>/suites/SUITE-SBX-007.md` |
| `MC-09` | MAIN-CONTRACT / `SUITE-SBX-009` | `reports/runs/<main_contract_run_id>/suites/SUITE-SBX-009.md` |
| `OPS-07/09` | OPS expanded `SUITE-SBX-007/009` | `reports/runs/<ops_run_id>/suites/SUITE-SBX-007.md`;`SUITE-SBX-009.md`;simulation只补强 |

Case raw 固定为 `artifacts/test/<source_run_id>/suites/<suite_id>/cases/<tc_id>/<parameter_id>.json`,suite raw 为同 suite 的 `report.json`,`stdout.log`,`stderr.log`。RELEASE item 必须通过 `reports/runs/<release_run_id>/evidence/<evidence_id>.md` 与 `evidence-index.md` 回指 exact source role / run / suite / TC / parameter / assertion code / digest。OPS 不得替代 MAIN-CONTRACT 主归属。

---

## 2. 14 个事务、可见性与重放验收项

| 检查索引 / TC | 触发与事务边界 | 通过条件 | 失败条件 | Canonical AC slice | Evidence |
|---|---|---|---|---|---|
| `TXCHK-SBX-001` / `TC-SBX-TXN-001` | accepted Command shared flow;begin -> reserve -> domain -> truth group -> audit / relay / stale -> stored result -> complete -> cursor -> commit | commit后truth组、audit、relay、stale、stored result、completed record和同一truth cursor全部可见;没有repository私有cursor | 任一组件缺失、cursor不一致或未commit已可见 | `AC-SBX-032 TX-OWNER-SLICE`;`AC-SBX-039 TX-AUDIT-SLICE`;`AC-SBX-040 CONSISTENCY-SLICE` | `C11`;`MC-07` |
| `TXCHK-SBX-002` / `TC-SBX-TXN-002` | 在begin / reserve / domain / truth save / audit / relay / stale / result / complete / cursor每个阶段分别注入失败 | 每个parameter均rollback;上述全部staged write及cursor对新UoW不可见;只返回typed safe failure | 任一故障点留下truth / audit / relay / result / completed record / cursor半组 | `AC-SBX-032 TX-OWNER-SLICE`;`AC-SBX-039 TX-AUDIT-SLICE`;`AC-SBX-040 CONSISTENCY-SLICE` | `C11`;`MC-07` |
| `TXCHK-SBX-003` / `TC-SBX-TXN-003` | commit返回confirmed failure或unknown | confirmed failure返回`TransactionCommitFailed`;未知不自动重试副作用,同key后续先查record / stored result / truth / relay | 盲目开新UoW重写;宣称已回滚;出现可判定半组 | `AC-SBX-039 RECOVERY-TRACE-SLICE`;`AC-SBX-040 COMMIT-UNKNOWN-SLICE` | `C11`;`MC-07` |
| `TXCHK-SBX-004` / `TC-SBX-TXN-004` | primary failure后rollback本身失败 | 返回`RollbackFailed` / `Internal` safe surface;标记manual integrity required;不伪造result / evidence | 宣称成功或已未提交;泄漏raw storage detail;补偿写truth | `AC-SBX-039 RECOVERY-TRACE-SLICE`;`AC-SBX-040 ROLLBACK-SLICE` | `C11`;`MC-07` |
| `TXCHK-SBX-005` / `TC-SBX-TXN-005` | reference-only Consumer / refresh Job accepted UoW | reference marker + stale + receipt / report + idempotency + reference cursor同UoW;不分配truth cursor | source version / dedup key / event ref被当marker cursor;反写context / policy / boundary core truth | `AC-SBX-033 SNAPSHOT-SLICE`;`AC-SBX-040 CURSOR-SLICE`;affected functional AC exact slice | `C11`;`MC-07` |
| `TXCHK-SBX-006` / `TC-SBX-TXN-006` | Query read点与mutation commit交错 | Query只看commit前或commit后完整snapshot;不开write UoW,不repair,不返回half group | Query见部分新组;写stale / repair;因读竞态发起VersionConflict mutation retry | `AC-SBX-032 NO-SECOND-WRITER-SLICE`;`AC-SBX-040 READ-CONSISTENCY-SLICE` | `C11`;`MC-07`;RACE-019交叉核验 |
| `TXCHK-SBX-007` / `TC-SBX-TXN-007` | Command同key + same digest的completed duplicate | typed stored command result原样replay;resolver / backend / domain / repository mutation / audit / relay calls全部`=0` | 第二truth / relay / audit;从current truth重算result;改写duplicate marker到owner truth | `AC-SBX-006/008` exact function slice;`AC-SBX-040 COMMAND-REPLAY-SLICE` | `RP10`;`MC-07` |
| `TXCHK-SBX-008` / `TC-SBX-TXN-008` | Consumer同dedup key + same digest的completed duplicate | stored receipt replay;reference / handoff / control / relay owner mutation `=0`;ack / retry disposition与receipt一致 | duplicate重跑consumer flow;产生第二marker / control / handoff truth | affected functional AC exact slice;`AC-SBX-040 CONSUMER-REPLAY-SLICE` | `RP10`;`MC-07` |
| `TXCHK-SBX-009` / `TC-SBX-TXN-009` | Job同key + same digest的completed duplicate | stored report replay;selection / target port / report accumulator调用`=0`;counts / refs / status不变 | job重跑、重建report item或修复core truth | affected maintenance AC exact slice;`AC-SBX-040 JOB-REPLAY-SLICE` | `RP10`;`MC-07` |
| `TXCHK-SBX-010` / `TC-SBX-TXN-010` | 任一channel同key + different digest / operation context | `IdempotencyConflict`;原record / digest / result不覆盖;新请求不进mutation | last-write-wins、merge、删除原record重试或进入owner flow | `AC-SBX-040 IDEMPOTENCY-CONFLICT-SLICE` | `RP10`;`MC-07` |
| `TXCHK-SBX-011` / `TC-SBX-TXN-011` | completed record但stored result / receipt / report missing或wrong kind | `DuplicateMissingResult`;owner / adapter calls `=0`;manual integrity handoff,不写假result | 从current truth / receipt / report重算;强转wrong kind;把missing当success | `AC-SBX-039 INTEGRITY-TRACE-SLICE`;`AC-SBX-040 NO-RECOMPUTE-SLICE` | `RP10`;`MC-07` |
| `TXCHK-SBX-012` / `TC-SBX-TXN-012` | existing `Reserved` same digest的in-flight并发重入 | 第二调用返retryable in-flight / delayed;不执行;首调用仍是唯一owner | 复用首调用UoW、阻塞等待后重入、或产生第二owner side effect | `AC-SBX-040 IN-FLIGHT-SLICE` | `RP10`;`MC-07`;RACE-001交叉核验 |
| `TXCHK-SBX-013` / `TC-SBX-TXN-013` | stale expected version更新existing truth / marker / relay / projection | `VersionConflict` + current UoW rollback;已commit version不被覆盖;fresh-read后只同key + same digest可重试 | overwrite / merge;fake忽略version;cursor / timestamp / trace id代替version | `AC-SBX-032 VERSIONED-OWNER-SLICE`;`AC-SBX-040 VERSION-CONFLICT-SLICE` | `C11`;`MC-07` |
| `TXCHK-SBX-014` / `TC-SBX-TXN-014` | create使用`expected_version=None`但ref / unique active key已存在 | unique conflict / validation;fake / durable均只保留一个active truth;败者全rollback | auto-create / merge / overwrite / private scan后选一;出现两个active owner | `AC-SBX-032 UNIQUE-OWNER-SLICE`;`AC-SBX-040 SINGLE-TRUTH-SLICE` | `C11`;`MC-07` |

---

## 3. 19 个 deterministic race 验收项

调度记号:`A/B read` 表示两个actor都已读取同一committed version / reserve precondition;`barrier` 禁止任一方提前提交;`A commit -> B resume` 固定胜者,然后验证B的formal loser surface。交换A / B顺序是same test parameter的必要反向调度,不可只跑单顺序。

| 检查索引 / TC | 正式race / deterministic schedule | Single winner | Loser formal surface | 零半状态与禁止副作用 | Canonical AC / Evidence |
|---|---|---|---|---|---|
| `RCHK-SBX-001` / `TC-SBX-RACE-001` | same idempotency key Command;A/B在`reserve` unique barrier就绪,A reserve+commit,B resume;再交换 | 只一次resolver / backend / truth save | same digest为in-flight / replay;different digest为`IdempotencyConflict` | 第二owner / audit / relay / result零写;没有双`Reserved` | `AC-SBX-040 COMMAND-RACE-SLICE`;`C11`;`MC-09` |
| `RCHK-SBX-002` / `TC-SBX-RACE-002` | 同caller request不同key open context;A/B过precheck后在unique create barrier,A commit,B resume;交换 | 仅一active context + identity | `VersionConflict` / `Validation`,current UoW rollback | loser无context / identity / audit / relay / result;active unique闭合 | `AC-SBX-006~008 RACE-SLICE`;`AC-SBX-032 UNIQUE-OWNER-SLICE`;`C11`;`MC-09` |
| `RCHK-SBX-003` / `TC-SBX-RACE-003` | context / identity close vs intake update;A/B读同version,barrier,A save+commit,B save;交换 | close或update一方赢 | loser `VersionConflict` / invalid transition | closed不重开;context / identity不分裂;无半audit / relay | `AC-SBX-006/007 RACE-SLICE`;`AC-SBX-032/040`;`C11`;`MC-09` |
| `RCHK-SBX-004` / `TC-SBX-RACE-004` | boundary establish vs capability refresh;boundary固定snapshot后与refresh marker save交错,双顺序 | boundary按已绑定snapshot成立 /拒绝,或version winner唯一 | `VersionConflict` / retryable delayed | refresh不改established truth;stale capability不静默allow;无partial handle | `AC-SBX-009~011 RACE-SLICE`;`AC-SBX-033/040`;`C11`;`MC-09` |
| `RCHK-SBX-005` / `TC-SBX-RACE-005` | 两个boundary establish;A/B同context / kind读同前置,active group create barrier,双顺序 | 仅一套coherent boundary / handle / lease | unique / `VersionConflict` | loser无decision / boundary / handle / lease / relay半组;无weak fallback | `AC-SBX-009~011 RACE-SLICE`;`AC-SBX-032/040`;`C11`;`MC-09` |
| `RCHK-SBX-006` / `TC-SBX-RACE-006` | policy evaluation vs summary Consumer;A固定policy snapshot,B写reference marker,policy group save与stale save交错;双顺序 | 一个versioned owner write生效;decision按formal snapshot | command `VersionConflict` / `PolicyFailClosed`;consumer delayed / retryable | consumer不把fail-closed改`Accepted`;不触发run;无半policy group | `AC-SBX-012~015 RACE-SLICE`;`AC-SBX-033/040`;`C11`;`MC-09` |
| `RCHK-SBX-007` / `TC-SBX-RACE-007` | start run vs control / failure;A准备run,B建立safety fact,run / safety version barrier后双顺序 | final run单调;最多一formal control / failure path | stale starter `VersionConflict` / invalid transition / blocked | terminal control后不得`Running`;backend launch不重复;无半run / safety group | `AC-SBX-013/020/022 RACE-SLICE`;`AC-SBX-032/040`;`C11`;`MC-09` |
| `RCHK-SBX-008` / `TC-SBX-RACE-008` | capture vs failure / terminate;A准备capture,B准备terminal run,save barrier双顺序 | run terminal winner不被capture改回success;capture仅按合法snapshot保存 | loser `VersionConflict` / `Failed` / invalid transition | failed / terminated run不被改`Completed`;capture不回写run;无output body | `AC-SBX-016/020 RACE-SLICE`;`AC-SBX-032/040`;`C11`;`MC-09` |
| `RCHK-SBX-009` / `TC-SBX-RACE-009` | handoff opening与per-target attempt / observation交错;opening先完整commit且0外呼,A/B读matching progress version并在Attempting / observation CAS barrier交换 | 每target只有一个committed Attempting attempt和一个matching observation winner | `VersionConflict`;target / attempt mismatch `Quarantined`;unknown只inspect same attempt | capture / material truth不变;无第二deliver / receipt / marker;aggregate从完整progress重派生 | `AC-SBX-017~019 RACE-SLICE`;`AC-SBX-040`;`C11`;`MC-09` |
| `RCHK-SBX-010` / `TC-SBX-RACE-010` | API control vs control event;同`control_signal_ref`,A/B在control unique / version barrier,双顺序 | 一个`ControlFact`;Command result与Consumer receipt各自幂等 | loser replay / `VersionConflict` / duplicate receipt | 无第二control / runtime side effect;consumer不绕Command guard | `AC-SBX-008/022 RACE-SLICE`;`AC-SBX-032/040`;`C11`;`MC-09` |
| `RCHK-SBX-011` / `TC-SBX-RACE-011` | classification vs lifecycle / reaper;A/B读同safety group version,在classification / orphan save barrier交换 | 只有一个versioned safety update;unknown / orphan保守 | `VersionConflict` / skipped + report item | 不得把unknown / orphan改success;失败材料 / manual marker保留 | `AC-SBX-020/023 RACE-SLICE`;`AC-SBX-032/040`;`C11`;`MC-09` |
| `RCHK-SBX-012` / `TC-SBX-RACE-012` | cleanup evaluation vs reaper release;A/B固定guard / lease / handle同version,release-call barrier前交换 | non-Allowed / redline pending时无release winner;Allowed时最多一release attempt | blocked / skipped / `VersionConflict` | non-Allowed release calls `=0`;evidence / capture / audit refs保留;无假`Released` | `AC-SBX-022/023 RACE-SLICE`;`AC-SBX-032/040`;`C11`;`MC-09`;OPS补强 |
| `RCHK-SBX-013` / `TC-SBX-RACE-013` | redline Command vs investigation feedback;A/B读containment version,feedback / containment save barrier双顺序 | target匹配 + investigation + guard成立时一个合法迁移 | `VersionConflict` / delayed / quarantined / blocked | feedback不直接`Released`;cleanup不绕过;无advisory-only成功 | `AC-SBX-021/022 RACE-SLICE`;`AC-SBX-032/040`;`C11`;`MC-09`;OPS补强 |
| `RCHK-SBX-014` / `TC-SBX-RACE-014` | relay publish vs feedback;A/B读frozen bundle + exact attempt expected version,publisher outcome / feedback save barrier双顺序 | `Published / DeadLetter` terminal只写一次 | `VersionConflict` / duplicate receipt / retryable report;unknown只inspect same attempt | source truth、frozen payload、source cursor不变;无同attempt重发或terminal -> pending | `AC-SBX-019/022 RACE-SLICE`;`AC-SBX-032/040`;`C11`;`MC-09`;RELAY补强 |
| `RCHK-SBX-015` / `TC-SBX-RACE-015` | reference Consumer vs refresh Job;A/B读reference expected version,marker save barrier双顺序 | 单一reference state;winner UoW分配marker cursor | `VersionConflict` / delayed / partial report | event key / source version不当cursor;不反写core truth;无双receipt / report伪成功 | `AC-SBX-007/012 RACE-SLICE`;`AC-SBX-033/040`;`C11`;`MC-09` |
| `RCHK-SBX-016` / `TC-SBX-RACE-016` | projection stale vs rebuild;A/B读projection version,stale marker / rebuilt snapshot save barrier双顺序 | 一个projection version赢;query只见old / stale / rebuilt完整view | `VersionConflict`,rebuild可重试;query degraded / stale | 无half view;不从old projection修复truth;不丢newer stale marker | `AC-SBX-032 OWNER-SLICE`;`AC-SBX-040 READ-RACE-SLICE`;`C11`;`MC-09` |
| `RCHK-SBX-017` / `TC-SBX-RACE-017` | derived Job duplicate / concurrent;reserve barrier + derived expected version barrier,同key与不同key各双顺序 | same key replay;different key一个derived version winner | in-flight / replay / `VersionConflict`;failure记report | builder failure只写derived / report;不写core failure / policy / artifact truth | `AC-SBX-025 RACE-SLICE`;`AC-SBX-040 JOB-RACE-SLICE`;`C11`;`MC-09` |
| `RCHK-SBX-018` / `TC-SBX-RACE-018` | reconciliation duplicate / concurrent;report save与latest index CAS交错,双顺序 | immutable reports可各自保留;latest index原子单赢家 | index `VersionConflict` / partial report;duplicate重放 | core truth / projection零写;latest不指向half / missing report | `AC-SBX-030 NO-REPAIR-SLICE`;`AC-SBX-040 JOB-RACE-SLICE`;`C11`;`MC-09` |
| `RCHK-SBX-019` / `TC-SBX-RACE-019` | Query vs mutation commit;query读点分别固定在commit前 /持有staged write时 /后 | Query只返before或after完整snapshot | 中间态不可返回;需要时是degraded / missing read surface | query writes `=0`;不mark stale / repair / reserve;不将读竞态变成mutation | `AC-SBX-032 NO-SECOND-WRITER-SLICE`;`AC-SBX-040 READ-CONSISTENCY-SLICE`;`C11`;`MC-09` |

---

## 4. 事务 /重放独立停审

| 检查索引 | UoW / channel边界 | 成功 /失败可判定 | 副作用断言 | TC / slot / report | Runtime disposition |
|---|---|---|---|---|---|
| TXCHK-SBX-001 | pass;accepted Command全组 | pass;all-or-none | pass;cursor / audit / relay / result同组 | pass;TXN-001 / C11 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-002 | pass;10个failure-injection phase均是独立parameter | pass;rollback hidden | pass;所有staged carrier零可见 | pass;TXN-002 / C11 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-003 | pass;commit result boundary | pass;confirmed / unknown分流 | pass;no blind retry / half claim | pass;TXN-003 / C11 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-004 | pass;rollback failure boundary | pass;manual integrity | pass;no compensation / fake evidence | pass;TXN-004 / C11 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-005 | pass;reference-only UoW | pass;reference cursor可判定 | pass;no truth cursor / core write | pass;TXN-005 / C11 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-006 | pass;Query no-write | pass;before / after snapshot | pass;no repair / half group | pass;TXN-006 / C11 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-007 | pass;Command channel | pass;typed result replay | pass;all owner calls=0 | pass;TXN-007 / RP10 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-008 | pass;Consumer channel | pass;receipt / disposition replay | pass;all owner writes=0 | pass;TXN-008 / RP10 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-009 | pass;Job channel | pass;report replay | pass;selection / target calls=0 | pass;TXN-009 / RP10 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-010 | pass;three-channel key / digest | pass;conflict exact | pass;original immutable / no mutation | pass;TXN-010 / RP10 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-011 | pass;typed stored lookup | pass;missing / wrong kind exact | pass;no recompute | pass;TXN-011 / RP10 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-012 | pass;in-flight reserve | pass;retryable / delayed | pass;single owner | pass;TXN-012 / RP10 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-013 | pass;existing-state version | pass;conflict / retry identity | pass;rollback / no overwrite | pass;TXN-013 / C11 / MC-07 | `NotEvaluated` |
| TXCHK-SBX-014 | pass;create unique | pass;unique conflict | pass;one active truth / no auto-merge | pass;TXN-014 / C11 / MC-07 | `NotEvaluated` |

14 /14 个事务 /重放项通过设计停审;runtime 结论仍全部 `NotEvaluated`。

---

## 5. Race 独立停审

| 检查索引 | Deterministic schedule | Single winner | Loser surface | 零半状态 / owner边界 | TC / evidence | Runtime disposition |
|---|---|---|---|---|---|---|
| RCHK-SBX-001 | pass;reserve barrier双顺序 | pass | pass;in-flight / replay / conflict | pass;one executor | RACE-001 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-002 | pass;unique create双顺序 | pass | pass;version / validation | pass;one context + identity | RACE-002 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-003 | pass;same-version save双顺序 | pass | pass;conflict / invalid transition | pass;no context / identity split | RACE-003 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-004 | pass;snapshot / refresh双顺序 | pass | pass;retryable conflict | pass;refresh no truth rewrite | RACE-004 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-005 | pass;boundary create双顺序 | pass | pass;unique / version | pass;one coherent group | RACE-005 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-006 | pass;policy / marker双顺序 | pass | pass;fail-closed / delayed | pass;consumer no Accepted rewrite | RACE-006 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-007 | pass;run / safety双顺序 | pass | pass;blocked / conflict | pass;terminal run monotonic | RACE-007 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-008 | pass;capture / terminal run双顺序 | pass | pass;failed / conflict | pass;capture no run rewrite | RACE-008 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-009 | pass;handoff version双顺序 | pass | pass;conflict / quarantine | pass;capture stable | RACE-009 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-010 | pass;control unique双顺序 | pass | pass;replay / duplicate | pass;one control fact | RACE-010 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-011 | pass;safety group双顺序 | pass | pass;conflict / skipped | pass;unknown no success | RACE-011 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-012 | pass;release-call barrier双顺序 | pass;0或1 attempt | pass;blocked / skipped | pass;guard-first / refs retained | RACE-012 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-013 | pass;containment / feedback双顺序 | pass | pass;delayed / quarantine | pass;feedback no direct release | RACE-013 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-014 | pass;relay version双顺序 | pass | pass;conflict / duplicate | pass;source / cursor stable | RACE-014 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-015 | pass;reference marker双顺序 | pass | pass;delayed / partial | pass;winner cursor only | RACE-015 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-016 | pass;projection version双顺序 | pass | pass;conflict / degraded | pass;no half view / repair | RACE-016 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-017 | pass;reserve + derived version双顺序 | pass | pass;replay / conflict | pass;derived owner only | RACE-017 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-018 | pass;report / latest CAS双顺序 | pass | pass;index conflict / partial | pass;no core write | RACE-018 / C11 / MC-09 | `NotEvaluated` |
| RCHK-SBX-019 | pass;commit前 /中 /后读点 | pass;before or after | pass;degraded / missing read | pass;query writes=0 | RACE-019 / C11 / MC-09 | `NotEvaluated` |

19 /19 个race完成设计停审;19 /19都要求deterministic schedule、single winner、formal loser surface和零半状态,0项依赖偶现压测。

---

## 6. 跨事务 /重放 / race 裁决审计

| 审计项 | 设计结论 | 失败时裁决 |
|---|---|---|
| accepted Command UoW是否包含formal audit / relay / stale / result / idempotency / cursor | pass;TXCHK-001 /002覆盖每一phase | `AC-SBX-032/039/040` exact slice失败;不得通过 |
| rollback / commit unknown是否隐藏不确定性 | 否;confirmed / unknown / rollback failed三分流 | 盲重试或伪称回滚为P0 consistency failure |
| Command / Consumer / Job replay是否都使用stored typed result | pass;TXCHK-007~012 | 任一channel重跑mutation则`AC-SBX-040`失败 |
| Query是否被误放入idempotency mutation | 否;TXCHK-006 / RCHK-019只读 | Query任一write / repair则`AC-SBX-032/040`失败 |
| expected version / unique create是否fake / durable同义 | 必须同义;TXCHK-013 /014 | fake auto-merge / ignore version则MAIN证据无效 |
| race是否只看winner不看loser | 否;19项都有formal loser surface | loser吞错、静默overwrite或半组则失败 |
| cleanup / redline race是否绕guard | 否;RCHK-012 /013必须release call `0 or 1` 且前置成立 | non-Allowed release或feedback直接release不可风险接受 |
| OPS simulation是否被用作MAIN替代 | 否;OPS-07/09只补强 | MAIN-CONTRACT缺失时仍`Blocked`,不得用OPS pass补齐 |
| 是否伪造run / EV / result | 否;路径和future form只是designed contract | runtime结论继续`NotEntered / NotEvaluated` |

---

## 7. 分件自检

| 检查项 | 结论 |
|---|---|
| 14 个 TXN 是否连续覆盖 | 通过;`TXCHK-SBX-001~014` / `TC-SBX-TXN-001~014` 一一对应。 |
| 19 个 RACE 是否连续覆盖 | 通过;`RCHK-SBX-001~019` / `TC-SBX-RACE-001~019` 一一对应。 |
| 是否覆盖UoW、rollback、commit unknown、cursor、unique、version | 通过;TXCHK-001~006 /013~014。 |
| 是否覆盖三通replay、conflict、missing result、in-flight | 通过;TXCHK-007~012。 |
| 每个race是否有双顺序调度、winner、loser、零半状态 | 通过;19 /19。 |
| 是否区分MAIN-CONTRACT主证与OPS补强 | 通过;OPS不可替代MC-07 / MC-09。 |
| 是否创建新AC、run、EV、report或result | 否;TXCHK / RCHK只是检查索引,future EV未分配。 |
