# Step 8. 定义状态机、事务与一致性验收

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 8
> 书写规范: `standards/document/验收标准书写规范.md` §5.8
> 回填章节: `06-验收标准.md` §8 状态机、事务与一致性验收
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_9
> 所属流程: `06_acceptance_calibration_flow.md`
> 状态分件: `06_acceptance_step_08_state_transition_register.md`
> 事务 /并发分件: `06_acceptance_step_08_transaction_race_review_register.md`
> 事实成熟度: 门禁设计为`PassDesign`;0 target repo,0 fixed run,0 runtime EV,真实验收仍为`NotEntered`

---

## 1. Step状态与Step内计划

| 检查项 | 结论 |
|---|---|
| 用户是否放行Step 8 | 是。Step 7三件已经用户确认并转为`passed_to_step_8`。 |
| 是否读取Step 8标准 | 是。已读取验收SOP Step 8、书写规范§5.8和真相源闭环标准的state / transaction / replay / race条目。 |
| 是否读取正式输入 | 是。已读取正式`03`§8~§12 /§15、Step 10 /11 /13中间产物、正式`05`的STA / TXN / RACE、suite、gate、ESLOT和fixed report。 |
| 是否读取粒度参考 | 是。只参考L1-governance / L1-artifact Step 8的聚合AC、闭环矩阵、停审和跨门禁审计结构,不继承领域结论。 |
| 旧正式`06`定位 | historical material。本Step未修改正式`06`,不继承旧session / command主线或泛化DB / trace证据。 |
| Canonical编号选择 | 复用`AC-SBX-006~023/032/039/040`;不创建平行state / tx AC。STCHK / TXCHK / RCHK只是检查索引。 |
| 当前Step状态 | 主件、状态分件、事务 /并发分件已按current inventory重校准;31 +14 +19逐项闭合并经用户连续确认,已传递至Step 9。 |

### 1.1 Step内计划

| 模块 | 内容 | 状态 | 完成门禁 |
|---|---|---|---|
| M1 canonical回查 | 核对30个owner-level state machine、31个canonical enum entry、事务边界、TC与evidence producer | done | 上游漂移先回写,不由`06`兼容 |
| M2状态登记 | 31个canonical enum entry的legal / illegal / flow / side effect / evidence | done | 31 /31独立停审 |
| M3事务 /重放 | 14个UoW、rollback、cursor、three-channel replay、version / unique | done | 14 /14独立停审 |
| M4 deterministic race | 19个race的双顺序调度、winner、loser和零半状态 | done | 19 /19独立停审 |
| M5 canonical AC slice | 将状态 /事务 /重放 / race回指既有AC、TC、slot、future EV和report | done | 21个canonical slice可裁决 |
| M6跨门禁审计 /回填 | 状态名、phase、非法迁移、副作用、replay、race、证据和§8草稿 | done_reviewed | 无unresolved设计冲突;用户已确认并由Step 9接续 |

---

## 2. 本步目标与边界

### 2.1 本步必须完成

1. 对31个canonical状态enum entry逐项验收合法构造 /迁移、非法迁移、terminal guard、trigger flow和owner side effect,并明确其对应30个owner-level state machine与39个shared status declaration的不同计数口径。
2. 对14个TXN逐项验收accepted UoW、rollback visibility、commit unknown、rollback failure、truth / reference cursor、Query no-write、three-channel replay、digest conflict、missing result、in-flight、expected version和unique create。
3. 对19个race逐项验收deterministic interleaving、single winner、formal loser surface、owner group零半状态和禁止副作用。
4. 将上述检查回指canonical `AC-SBX-*`、详细设计契约、TC、planned ESLOT、future runtime EV form、fixed source report、通过 /失败条件和裁决影响。
5. 完成跨状态一致性审计,确认无状态名漂移、phase越界、非法转换缺证、副作用缺失或幂等 /并发裁决冲突。

### 2.2 本步不完成

- 不对`AC-SBX-036~041`的性能、可用性、安全、审计、幂等一致性和可观测性做总体NFR裁决;Step 8只加严`AC-SBX-039/040`的transaction / consistency slice,Step 9仍是总体owner。
- 不审核runtime EV是否真实存在、raw / report / digest / review是否配对;Step 10完成证据真实性门禁。
- 不创建正式VETO编号、缺陷、复验、风险接受、结论或签署;Step 11~14分别拥有。
- 不选择数据库、锁、线程、scheduler、backend、bus或测试框架产品。
- 不把tools semantic execution、runtime agent loop、member lifecycle orchestration、Artifact truth、observability store truth或policy / approval truth纳入Sandbox状态机。

---

## 3. 本步输入

| 输入 | 当前状态 | 本Step用途 |
|---|---|---|
| Step 5三件 | reviewed | 提供`AC-SBX-006~023`功能owner、TC、slot、report和裁决影响;本Step只增加state / consistency slice |
| Step 6三件 | reviewed | 提供`AC-SBX-032`的truth owner、no-second-writer和accepted group原子性边界 |
| Step 7三件 | reviewed | 提供55协议的Command / Query / Consumer / Event / Job进入面、relay / replay接缝和证据入口 |
| 正式`03`§8~§12 /§15 | current reviewed | 提供flow、30个owner-level state machine、31个canonical enum entry、39个shared status declaration、repository / UoW、38 typed error、idempotency / race和测试切口 |
| `03_ddd_step_10_state_matrix.md` | canonical detailed source | 提供31个canonical enum entry的exact variant、legal / forbidden transition、trigger、precondition和side effect |
| `03_ddd_step_11_persistence_transaction_consistency.md` | canonical detailed source | 提供UoW、logical store、save order、version、cursor、rollback、relay / projection / stored replay契约 |
| `03_ddd_step_13_concurrency_idempotency.md` | canonical detailed source | 提供key / digest、duplicate、in-flight、version conflict、retry identity、race guard和fake / durable parity |
| 正式`05`§6.3 /§9 /§10.4 /§13 | current reviewed after DesignReopen writeback | 提供31 STA、14 TXN、19 RACE、SUITE-002 /007 /009、ESLOT-002~011 /013、fixed raw / report path和future EV派生条件 |
| 旧正式`06` | historical material | 只识别旧主语、泛化证据和空checkbox污染;不作为状态 /事务来源 |

---

## 4. SOP问题回答

| SOP问题 | 回答 |
|---|---|
| 哪些合法状态迁移必须通过 | `TC-SBX-STA-001~031`所列每个enum的factory / allowed transition必须通过,特别是`Preparing -> Running / Failed`、四维`Pending -> Coherent`、policy fail-closed、capture创建即定格、handoff opening零外呼、per-target `Attempting`先提交、aggregate机械派生、relay success=`Published`、cleanup / redline guard及projection / replay technical state。 |
| 哪些非法迁移必须拒绝 | 每个STA的representative illegal / terminal reopen均必须拒绝;拒绝时owner truth、audit、relay、stored result和非owner truth均不得存在半状态。 |
| 哪些事务必须原子提交 | accepted Command的reserve、truth group、audit、relay、stale、stored result、complete和cursor;reference-only Consumer / Job的marker、stale、receipt / report、idempotency和reference cursor。Query不开write UoW。 |
| 哪些幂等与并发行为必须成立 | Command / Consumer / Job same digest返回stored typed result;different digest conflict;missing result no recompute;in-flight single owner;existing write expected version;create unique;19 race全部deterministic single winner。 |
| 失败时如何判定不通过 | 任一P0 STA / TXN / RACE缺证、illegal accepted、partial visibility、blind retry、duplicate mutation、Query write、job repair、double winner、loser吞错或guard bypass,对应canonical AC slice失败且不得通过 /有条件通过。VF / VETO命中由Step 11正式裁决。 |
| 是否存在旧状态名、口语状态或后续phase状态 | 曾发现正式`03`装配转写漂移,已登记`SBX-ACC-STATE-NAME-001`并按canonical矩阵回写关闭。当前验收只使用exact variant。 |
| 每项能否回指状态矩阵、flow、TC、EV和report | 能。状态分件覆盖31项,事务 /并发分件覆盖14 +19项;本文§8将其回指21个canonical AC slice。 |
| 每项是否完成停审 | 是。31个状态entry、14事务 /重放、19 race均有独立停审行;runtime状态均为`NotEvaluated`。 |
| 跨状态审计是否有unresolved冲突 | 无。状态名和evidence producer两个上游缺口均已先回写;其余开放项只阻塞实际执行和裁决。 |

---

## 5. 当前文档、historical material与上游回查

| 位置 /材料 | 发现 | 处理 | 当前状态 |
|---|---|---|---|
| 旧正式`06` | 状态 /事务仍围绕旧SandboxExecution / Session / Command主线,无current 31-entry inventory、UoW、stored replay、race或fixed evidence | historical material;不继承,按当前`03/05`重建§8 | contained |
| 正式`03`§9.4 /§15.3 | run初态误写`Pending`,`Classified`误接run,并出现非正式`Publishing`、不存在的reconciliation transition和口语状态 | `SBX-ACC-STATE-NAME-001`;已按Step 10全表回写exact variant并在详细设计flow /中间产物留痕 | resolved |
| 正式`05`§13.2 / Step 13 | 8个slot声明的TC与producer suite列不闭合,future item可能丢raw source | `SBX-TEST-EVIDENCE-PRODUCER-001`;已补齐slot 002 /009 /011 /013 /018 /019 /020 /021的owner suite并留痕 | resolved |
| `AC-SBX-039/040` | 是NFR canonical AC,但Step 8需要transaction / consistency slice | 本Step只加严TX-AUDIT / CONSISTENCY slice;Step 9仍做总体NFR裁决 | phase-separated |
| target repo / suite / run / EV | 全部不存在 | 保持`NotEntered / NotEvaluated`;planned path / future form不写成事实 | open execution blocker |

---

## 6. 改动前后对比

| 维度 | 改动前 | 本Step收稳后 | 原因 |
|---|---|---|---|
| 状态验收 | 功能项只散列部分状态TC | 31个canonical enum entry逐项legal / illegal / terminal / flow / side effect / evidence,并保留30 owner-level machine口径 | 防止状态名漂移和owner混同 |
| 事务验收 | 数据红线只要求accepted group原子 | 14个TXN覆盖每一staged phase、rollback / unknown / cursor / replay / version / unique | 接口成功不能代替write-set原子性 |
| 幂等 | 功能项提到duplicate不二写 | Command / Consumer / Job三通stored replay、different digest conflict、missing no recompute、in-flight single owner | 防止channel之间幂等语义分裂 |
| 并发 | 部分功能项引用个别race | 19个race逐项deterministic双顺序、winner、loser、零半状态 | 偶现压测不能证明单赢家 |
| evidence | slot producer有缺口 | 主证suite / case raw / report / future EV / RELEASE item链可定位 | 实际验收必须能反查exact assertion |
| 裁决 | 可能新建平行state AC | 复用canonical AC + slice qualifier;STCHK / TXCHK / RCHK只是检查索引 | 保持需求验收真相源唯一 |

---

## 7. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 是否每个enum新建AC | 每个enum entry建STCHK检查索引,回指功能 / owner / consistency canonical AC | 新建31个`AC-SBX-STATE-*` | 避免平行验收真相源 |
| 是否用suite总绿裁决每个状态 | 必须消费exact case / parameter / assertion code | `SUITE-SBX-002 Passed`即全部通过 | 同一suite含31个不同状态断言 |
| commit unknown是否自动重试 | 不允许;先用同key重建commit结果 | 盲重试并希望幂等屏蔽 | 外部side effect与commit结果可能不确定 |
| duplicate missing result是否重算 | 不允许;`DuplicateMissingResult` + manual integrity | 从current truth重建 | current truth不一定等于原operation result |
| race是否靠压测 | deterministic barrier固定双顺序 | 多线程重复N次不出错 | 验收需要可复现loser surface |
| OPS是否可替代MAIN | 不可;OPS只补强replay / race / cleanup simulation | OPS绿色补齐MAIN-CONTRACT缺失 | source role证明上限不同 |
| `AC-SBX-039/040`是否在Step 8完成总裁决 | 只完成transaction / consistency slice | 提前宣称NFR总体闭合 | Step 9必须继续审核六类NFR的完整证明面 |

---

## 8. 结构化中间产物

### 8.1 证据与fixed report通用入口

| 证据族 | Planned slot -> future form | Primary source | Fixed report / case raw | 当前成熟度 |
|---|---|---|---|---|
| domain state | `ESLOT-SBX-002~007/009/010` -> `EV-SBX-INTAKE-002` ~ `EV-SBX-REPLAY-010`按family | MAIN-CONTRACT `SUITE-SBX-002` | `reports/runs/<main_contract_run_id>/suites/SUITE-SBX-002.md`;`artifacts/test/<main_contract_run_id>/suites/SUITE-SBX-002/cases/<tc_id>/<parameter_id>.json` | planned;EV未分配 |
| transaction / visibility | `ESLOT-SBX-011 CONSISTENCY` -> `EV-SBX-CONSISTENCY-011` | MAIN-CONTRACT `SUITE-SBX-007` | `reports/runs/<main_contract_run_id>/suites/SUITE-SBX-007.md` + exact TXN case raw | planned;EV未分配 |
| stored replay | `ESLOT-SBX-010 REPLAY` -> `EV-SBX-REPLAY-010` | MAIN-CONTRACT `SUITE-SBX-007`;Consumer / Job按catalog消费005 /006补强 | `SUITE-SBX-007.md` + exact TXN case raw;其他producer不得被裁剪 | planned;EV未分配 |
| deterministic race | `ESLOT-SBX-011 CONSISTENCY` -> `EV-SBX-CONSISTENCY-011` | MAIN-CONTRACT `SUITE-SBX-009` | `reports/runs/<main_contract_run_id>/suites/SUITE-SBX-009.md` + exact RACE case raw | planned;EV未分配 |
| operations supporting | 同slot exact assertion | OPS expanded `SUITE-SBX-007~009/012` | `reports/runs/<ops_run_id>/suites/<suite_id>.md` + exact case raw | simulation supporting;not substitute |
| release item | 只在source raw / report / checks配对后分配 | fixed RELEASE按序聚合四源 | `reports/runs/<release_run_id>/evidence/<evidence_id>.md`;`evidence-index.md` | 当前不存在 |

每个裁决实例必须保存:

```text
canonical_ac_id + assertion_slice
source_role + source_run_id + suite_id
tc_id + parameter_id + assertion_codes
evidence_slot_id + runtime evidence_id + artifact_digest
case raw path + suite report path + RELEASE item / index path
Passed / Failed / Blocked / NotEvaluated disposition + reason refs
```

本Step不实例化上述字段。

### 8.2 功能canonical AC的状态 /重放 /并发slice

| Canonical AC / slice | 设计契约与trigger flow | 必须消费的Step 8检查 | 通过条件 | 失败条件 | Planned evidence / report | 裁决影响 |
|---|---|---|---|---|---|---|
| `AC-SBX-006 STATE/REPLAY-SLICE` | context intake;`OpenControlledExecutionContextFlow` | STCHK-001 /003;TXCHK-007 /010 /011;RCHK-002 /003 | intake exact transition成立;duplicate返stored result;同caller只一active context | terminal reopen、第二context、duplicate重跑或missing result重算 | INTAKE-002 + REPLAY-010;MC-02 /07 /09 | mandatory失败则不通过;VF-002 /009 /010候选 |
| `AC-SBX-007 STATE/CONSISTENCY-SLICE` | context + execution identity + reference marker | STCHK-001~003;TXCHK-005 /013;RCHK-003 /015 | identity active / terminal正确;reference marker / cursor同UoW;无context / identity split | identity复活、cursor混用、reference反写core或race半identity | INTAKE-002 + CONSISTENCY-011;MC-02 /07 /09 | 不通过;VF-005 /009 /010候选 |
| `AC-SBX-008 UNIFIED-ENTRY/REPLAY-SLICE` | API / Consumer统一formal command path | STCHK-017 /025~027;TXCHK-007 /008 /010~012;RCHK-001 /010 | channel共用key / digest / stored replay;同control signal一fact | 旁路、不同channel二次mutation、二套control truth | REPLAY-010 + CONSISTENCY-011;MC-02 /07 /09 | 不通过;VF-002 /009候选 |
| `AC-SBX-009 STATE/RACE-SLICE` | boundary establish + run preflight | STCHK-004~009 /013;RCHK-004 /005 | fresh capability、coherent四维、active handle / lease;并发只一boundary group | partial coherent、weak fallback、两套handle / lease或loser半组 | BOUNDARY-003 + CONSISTENCY-011;MC-02 /09 | 不通过;P0-Q仍独立Blocked;VF-001~003候选 |
| `AC-SBX-010 BOUNDARY-STATE-SLICE` | four-dimension requirement / coherence / handle | STCHK-004~007;RCHK-004 /005 | resource / filesystem / network / process同代整体`Coherent`;unsupported不launch | 任一维缺失仍coherent或technical state放宽 | BOUNDARY-003;MC-02 /09;qualification另行 | 不通过;VF-003候选 |
| `AC-SBX-011 FAIL-CLOSED-STATE-SLICE` | capability / adapter / config preflight | STCHK-004 /006 /029 /030;TXCHK-013 | stale / unsupported / unavailable / startup blocked不产生allow;technical degraded只有界读 | adapter / config state直接authorize、ignore version或partial startup mutation | BOUNDARY-003 + REPLAY-010 / CONFIG-013补强;MC-02 /07 | 不通过;VF-003 /004候选 |
| `AC-SBX-012 POLICY-STATE-SLICE` | `EvaluatePolicyExecutionFlow`;policy reference consumer | STCHK-010~012;RCHK-006 | formal snapshot产生decision;non-Applicable / non-Allowed保持fail-closed | stale / missing / conflict仍Accepted;consumer改写decision或触发run | POLICY-004 + CONSISTENCY-011;MC-02 /09 | 不通过;VF-004 /005候选 |
| `AC-SBX-013 POLICY/RUN-RACE-SLICE` | policy decision / high-risk + `StartControlledExecutionRunFlow` | STCHK-011~013;RCHK-006 /007 | 仅Accepted + Allowed可`Preparing -> Running`;与control / failure竞态保持run单调 | blocked / fail-closed仍launch;terminal control后`Running`;多formal safety path | POLICY-004 + EXECUTION-005 + CONSISTENCY-011;MC-02 /09 | 不通过;VF-004 /008 /009候选 |
| `AC-SBX-014 FAIL-CLOSED-RECOVERY-SLICE` | policy / capability unavailable recovery | STCHK-010~012 /029 /030;TXCHK-010 /013 | 恢复通过新snapshot / decision / same-key same-digest fresh-read;不原地改allow | fail-closed terminal reopen、different digest覆盖或technical degraded allow | POLICY-004 + REPLAY-010 / ERROR-012补强;MC-02 /07 | 不通过;VF-004候选 |
| `AC-SBX-015 UNIFIED-POLICY-REPLAY-SLICE` | API / Consumer统一policy flow与key space | STCHK-010~012 /025~027;TXCHK-007 /008 /010~012;RCHK-006 | 同语义在channel间重放不重算;不同digest conflict | 不同caller得到二套policy语义或consumer绕fail-closed | POLICY-004 + REPLAY-010;MC-02 /07 /09 | 不通过;VF-004 /009候选 |
| `AC-SBX-016 RUN/CAPTURE-STATE-SLICE` | run lifecycle + `RecordCaptureResultFlow` | STCHK-013 /014;RCHK-007 /008 | run exact单调;capture诚实`Complete / Partial / Failed / Unavailable`;不改run | `Pending`作run初态、`Preparing -> Completed`、capture伪Complete或改写terminal run | EXECUTION-005 + CONSISTENCY-011;MC-02 /09 | 不通过;VF-006 /010候选 |
| `AC-SBX-017 CAPTURE/HANDOFF-STATE-SLICE` | capture immutable + handoff opening / per-target delivery / retry | STCHK-014 /015 /031;RCHK-008 /009 | capture创建即定格;opening只提交fixed plan +完整Pending set且0 delivery;attempt先commit再单次deliver;unknown只inspect same attempt;aggregate机械派生且failure不回滚capture | capture写Pending /原地改写、opening外呼、跳过Attempting、同attempt重送、unknown猜终态、aggregate手工覆盖或target mismatch被接受 | EXECUTION-005 + CONSISTENCY-011;MC-02 /09 | 不通过;VF-005 /006候选 |
| `AC-SBX-018 AUDIT/HANDOFF-TX-SLICE` | formal audit same-UoW + observability material target handoff | STCHK-014 /015 /024 /031;TXCHK-001 /002;RCHK-009 /014 | formal audit / capture / handoff / relay owner分层;ordinary hook仅post-return / post-inspection且失败隔离;target / publish failure no rollback | telemetry替代audit、raw material入仓、pre-call hook阻断主流程、relay / handoff失败回滚source | EXECUTION-005 + RELAY-009 + CONSISTENCY-011;MC-02 /07 /09 | `AC-SBX-018/039` slice失败;不通过;VF-006 /010候选 |
| `AC-SBX-019 RESULT-CHAIN/REPLAY-SLICE` | Capture / per-target Handoff / Relay + three-channel stored result | STCHK-015 /024~028 /031;TXCHK-007~012;RCHK-009 /014 /017 | owner truth分层;publisher只消费frozen committed bundle + exact attempt;feedback / retry只改matching owner;duplicate exact重放 | 第二capture / handoff、payload从latest truth重建、同attempt重复外呼或duplicate重做 | EXECUTION-005 + RELAY-009 + REPLAY-010;MC-02 /07 /09 | 不通过;VF-006 /009 /010候选 |
| `AC-SBX-020 FAILURE-STATE/RACE-SLICE` | `ClassifySandboxFailureFlow`;lifecycle / reaper | STCHK-016 /017;RCHK-007 /008 /011 | known source -> `Classified`;unknown保持`PendingInput`;terminal不重开;不改run历史 | `Unknown`伪success、`Failed -> Classified`误接run、race覆盖orphan / terminal | SAFETY-006 + CONSISTENCY-011 / ERROR-012补强;MC-02 /09 | 不通过;VF-001 /008 /010候选 |
| `AC-SBX-021 REDLINE-STATE/RACE-SLICE` | containment + investigation feedback | STCHK-019;RCHK-012 /013 | `Detected -> Contained -> HandoffPending`;target / investigation / guard成立才release / terminal | advisory-only、feedback直接release、cleanup绕guard或竞态解除containment | SAFETY-006 + CONSISTENCY-011;MC-02 /09;OPS补强 | 不通过;VF-007 /008 /010候选 |
| `AC-SBX-022 SAFETY/REPLAY/AUDIT-SLICE` | control / failure / cleanup / redline + relay / report | STCHK-016~019 /024~028;TXCHK-001~004 /007~012;RCHK-007~14 | 每个非happy path有owner fact、safe audit、typed replay与honest loser / report | 无formal fact、partial report伪成功、rollback / unknown被吞、duplicate二写 | SAFETY-006 + RELAY-009 + REPLAY-010 + CONSISTENCY-011;MC-02 /07 /09 | 不通过;VF-007 /009 /010候选 |
| `AC-SBX-023 LEASE/CLEANUP-RACE-SLICE` | lease / orphan / guard / reaper | STCHK-007~009 /018 /019;TXCHK-013 /014;RCHK-011~013 | expiry stop-new-use;orphan保守;non-Allowed release=0;Allowed最多一release attempt | orphan脱管、force clean、fake Released、二套active handle / truth或无disposition | BOUNDARY-003 + SAFETY-006 + CONSISTENCY-011;MC-02 /07 /09;OPS / P0Q补强 | 不通过;VF-007 /008 /010候选 |

### 8.3 数据归属、审计与一致性canonical slice

| Canonical AC / slice | 通过条件 | 失败条件 | 覆盖检查 | Planned evidence / primary report | 裁决影响 |
|---|---|---|---|---|---|
| `AC-SBX-032 STATE-OWNER-SLICE` | STCHK-001~019 /031的owned lifecycle truth仅由formal Sandbox flow写;STCHK-020~030只写各自read / marker / report / technical owner | adapter / Query / projection / report / receipt / job创建或修复core truth;同名state跨owner复用语义 | STCHK-001~031;RCHK-002~018 owner checks | domain slots + CONSISTENCY-011;MC-02 /09 | mandatory失败则不通过;VF-005 /009候选 |
| `AC-SBX-032 TX-OWNER-SLICE` | accepted mutation按formal UoW整组commit / rollback;existing version / create unique成立;Query no-write | 半组可见、第二writer、overwrite / merge、cursor混用或Query repair | TXCHK-001~006 /013 /014;RCHK-001~019 | CONSISTENCY-011;MC-07 /09 | mandatory失败则不通过;VETO-CFG-11候选 |
| `AC-SBX-039 TX-AUDIT-SLICE` | accepted truth的formal audit / relay / stored result / cursor按适用同UoW;rollback / unknown / manual integrity都有safe可回链surface | truth已成立但audit / result / relay缺失;rollback failure被吞;unknown盲重试;只有log | TXCHK-001~005 /011;STCHK-024~028;RCHK-010 /014 /018 | CONSISTENCY-011 + REPLAY-010;MC-07 /09 | 本transaction slice失败;总体`AC-SBX-039`仍由Step 9完成;VF-010 / VETO-CFG-07候选 |
| `AC-SBX-040 CONSISTENCY-SLICE` | three-channel duplicate replay、digest conflict、missing no recompute、in-flight single owner、version / unique guard、attempt-before-call、19 race single winner、Query no-write全部成立 | 第二正式语义、double winner、同attempt重复外呼、loser吞错、half state、source rollback、job repair或fake与durable语义分裂 | STCHK-003 /017 /020~031;TXCHK-001~014;RCHK-001~019 | REPLAY-010 + CONSISTENCY-011;MC-02 /07 /09;OPS补强 | 本consistency slice失败;总体`AC-SBX-040`仍由Step 9完成;VF-009 / VETO-CFG-08/11/12候选 |

### 8.4 一致性失败裁决表

| 失败类型 | 裁决 | 不允许的处置 |
|---|---|---|
| 状态名不是正式enum variant | 对应state slice失败;先回写设计 /测试,不得进实施兼容 | alias、字符串容错或说明文字代替修正 |
| illegal / terminal transition accepted | 对应功能AC + `AC-SBX-032/040` slice失败 | 事后audit或人工修数据补救 |
| accepted group部分可见 | `AC-SBX-032/039/040`失败;不得通过 | 用log / telemetry证明“大概执行过” |
| commit unknown盲重试 | `AC-SBX-040`失败;保留不确定性并停止副作用 | 换key、开新run覆盖原不确定事实 |
| duplicate重跑mutation或missing result重算 | `AC-SBX-040`及受影响功能AC失败 | 使用current truth伪replay |
| Query write / projection / job修复core truth | `AC-SBX-032/040`失败;Step 11后续裁VETO-CFG-11适用 | 以“自愈”或“最终一致”降级 |
| race double winner / loser无formal surface | 对应功能AC + `AC-SBX-040`失败 | 通过降低并发度或压测重跑覆盖 |
| cleanup / redline race release bypass | `AC-SBX-021~023/032/040`失败;不可风险接受 | force-clean、ordinary receipt release或删除调查材料 |
| planned slot / Markdown被当runtime EV | evidence无效,实际验收保持`NotEntered / Blocked` | 静态补EV alias或手写Passed |

### 8.5 64 个检查索引停审摘要

| 集合 | 数量 | 正式名 /契约 | Trigger / schedule | 证据定位 | 副作用断言 | 设计停审 | Runtime |
|---|---:|---|---|---|---|---|---|
| STCHK-SBX-001~031 | 31 | 31 /31 exact enum entry | 31 /31 formal flow | 31 /31 STA + slot + MC-02 | 31 /31 illegal零半状态 / external-call guard | `PassDesign` | `NotEvaluated` |
| TXCHK-SBX-001~014 | 14 | 14 /14 formal UoW / replay | 14 /14 exact injection / channel | 14 /14 TXN + RP10 / C11 + MC-07 | 14 /14 all-or-none / no recompute | `PassDesign` | `NotEvaluated` |
| RCHK-SBX-001~019 | 19 | 19 /19 formal race | 19 /19 deterministic双顺序 | 19 /19 RACE + C11 + MC-09 | 19 /19 winner / loser / no half state | `PassDesign` | `NotEvaluated` |
| 合计 | 64 | 64 /64 | 64 /64 | 64 /64 | 64 /64 | `PassDesign` | `NotEntered` |

逐项细节和64条独立停审记录在两个分件中;本表只是聚合摘要,不替代单项裁决。

### 8.6 跨状态一致性门禁审计表

| 审计ID | 审计项 | 结论 | 缺口 /修正 |
|---|---|---|---|
| SCA-SBX-001 | 31个canonical status enum entry是否一一覆盖并与30 owner-level machine /39 shared declaration口径区分 | pass;31 /31 | 无 |
| SCA-SBX-002 | 是否仍有旧 /口语 /不存在状态 | pass;canonical回写后未发现 | `SBX-ACC-STATE-NAME-001`已关闭 |
| SCA-SBX-003 | 同名`Pending / Failed / Degraded / Completed`是否跨owner混同 | pass;owner-local | runtime artifact必须同时保存enum type / assertion code |
| SCA-SBX-004 | run是否混入runtime agent-loop状态 | pass;run只保存stable lifecycle summary | 无 |
| SCA-SBX-005 | boundary是否保持resource / fs / network / process同代coherent | pass | P0-Q真实施加仍Blocked,不影响本Step设计 |
| SCA-SBX-006 | policy / adapter / config technical state是否能直接allow | pass;不能 | 无 |
| SCA-SBX-007 | capture / handoff / relay是否满足定格、attempt-before-call、frozen payload且failure不回滚source | pass | 无 |
| SCA-SBX-008 | cleanup / redline release是否guard-first | pass | 真实release资格仍待P0-Q /实施 |
| SCA-SBX-009 | Query是否write / refresh / rebuild / repair | pass;全部禁止 | 无 |
| SCA-SBX-010 | projection / derived / reconciliation / job是否修core truth | pass;不修复 | 无 |
| SCA-SBX-011 | Event relay是否从stored payload发布且terminal单调 | pass | 无 |
| SCA-SBX-012 | 14个TXN是否连续覆盖 | pass;14 /14 | 无 |
| SCA-SBX-013 | accepted UoW的audit / relay / result / cursor是否有副作用断言 | pass | 无 |
| SCA-SBX-014 | rollback / commit unknown / rollback failed是否分流 | pass | 无 |
| SCA-SBX-015 | truth cursor / reference cursor / page cursor / version / key是否混用 | pass;均分离 | 无 |
| SCA-SBX-016 | Command / Consumer / Job replay是否三通齐全 | pass | Query明确no idempotency mutation |
| SCA-SBX-017 | missing result是否重算、failed record是否原地completed | pass;均禁止 | 无 |
| SCA-SBX-018 | expected version / unique create是否fake / durable parity | pass as required contract | 真实durable执行仍conditional /未实现 |
| SCA-SBX-019 | 19个race是否deterministic并覆盖双顺序 | pass;19 /19 | 无 |
| SCA-SBX-020 | 每个race是否有winner、loser surface和零半状态 | pass;19 /19 | 无 |
| SCA-SBX-021 | phase是否越界到NFR总体、evidence真实性、VETO、risk或signoff | pass;均保留后续Step | 无 |
| SCA-SBX-022 | slot声明TC与producer suite是否闭合 | pass;21 slot全表回查并修正8行 | `SBX-TEST-EVIDENCE-PRODUCER-001`已关闭 |
| SCA-SBX-023 | planned slot / future EV是否被写成真实证据 | pass;当前0 EV | 无 |
| SCA-SBX-024 | 是否发明tools semantics / agent loop / member lifecycle状态 | pass;未发明 | 无 |

`SCA-SBX-*`也只是跨门禁审计索引,不是新AC、TC、EV或VETO。24 /24审计在设计层通过,无unresolved上游冲突。

---

## 9. 复杂度与分批判断

| 内容 | 规模 | 分批结果 |
|---|---:|---|
| canonical状态enum entry / owner-level machine | 31 /30 | 独立分件A,按8个状态族登记 |
| 事务 /重放 | 14 | 独立分件B§2 /§4 |
| deterministic race | 19 | 独立分件B§3 /§5 |
| canonical AC slice | 21 | 主件§8.2 /§8.3 |
| 跨门禁审计 | 24 | 主件§8.6 |

三件总体保持单一Step真相源:主件定义裁决和回填,状态分件定义31个canonical enum entry的验收索引,事务 /并发分件定义33个consistency检查和独立停审。

---

## 10. 正式章节回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_08_state_tx_consistency.md`
> - `design-calibration/06_acceptance_step_08_state_transition_register.md`
> - `design-calibration/06_acceptance_step_08_transaction_race_review_register.md`
>
> 延伸阅读:
> - 建议继续阅读上述两个分件的“31个canonical状态enum entry验收登记”“14个事务、可见性与重放验收项”“19个deterministic race验收项”和“独立停审”,了解本章聚合门禁的逐项来源。

```md
## 8. 状态机、事务与一致性验收

本章不新建验收编号,而是对canonical `AC-SBX-006~023/032/039/040`的state / transaction / replay / race slice加严。状态名必须与正式`03-详细设计.md`的31个canonical enum entry一致,并保留30个owner-level state machine与39个shared declaration的独立计数口径;不接受口语状态、测试私有状态、后续phase状态或跨owner同名语义。

| 验收项 / slice | 主题 | 通过条件 | 失败条件 | 证据来源 | 裁决影响 |
|---|---|---|---|---|---|
| AC-SBX-006~023 STATE / REPLAY / RACE | 18个功能owner的正式状态、终态、重放和并发 | 31个STA的legal / illegal / owner side effect成立;capture / handoff / relay current flow成立;受影响TXN / RACE完成single owner、stored replay和guard | 任一illegal accepted、duplicate重做、同attempt重复外呼、double winner、loser吞错、半状态或越界owner write | ESLOT-SBX-002~011 /013按exact slice;MAIN-CONTRACT SUITE-SBX-002 /007 /009及fixed raw / report | 受影响canonical AC失败;不得通过 /有条件通过 |
| AC-SBX-032 STATE / TX OWNER | execution isolation truth归属与accepted group原子性 | core truth只由formal flow写;accepted group全部commit或rollback;Query / marker / report不成第二writer | 半组可见、第二writer、overwrite / merge、Query repair或job修core truth | ESLOT-SBX-011 + exact domain slot;SUITE-SBX-002 /007 /009 | 失败则不通过;VF-SBX-005/009及VETO-CFG-11适用候选 |
| AC-SBX-039 TX-AUDIT | accepted truth的audit / relay / result / cursor和不确定恢复追溯 | 适用副作用同UoW;rollback / commit unknown / missing result均有safe可回链surface | truth缺audit / result / relay、unknown盲重试、rollback failure被吞或只有log | ESLOT-SBX-010 /011;SUITE-SBX-007 /009 | 本slice失败;AC-SBX-039总体仍须通过§9;VF-SBX-010 / VETO-CFG-07候选 |
| AC-SBX-040 CONSISTENCY | three-channel幂等、version / unique、read consistency、19个deterministic race | same digest stored replay,different digest conflict,missing no recompute,in-flight single owner;19 race single winner + formal loser + no half state | 第二正式语义、double winner、source rollback、Query write、job repair或fake / durable语义分裂 | ESLOT-SBX-010 /011;SUITE-SBX-007 /009;OPS只补强 | 本slice失败;AC-SBX-040总体仍须通过§9;VF-SBX-009 / VETO-CFG-08/11/12候选 |

单个验收项不得仅消费suite总状态。必须从fixed RELEASE evidence item回指source role / run、suite、exact TC / parameter / assertion code、case JSON、suite report和digest。`ESLOT-SBX-*`是planned slot,`EV-SBX-*`只能在真实raw / report / checks配对后分配;当前不存在runtime EV或验收结论。
```

---

## 11. 对上游设计的影响、待确认与blocker

| 项 | 影响 | 状态 /处理 |
|---|---|---|
| 正式`03`状态转写漂移 | 若不回写,STA / 验收会同时接受错误与canonical名 | `SBX-ACC-STATE-NAME-001` resolved;已回写§9.4 /§15.3并留痕 |
| 正式`05` slot producer不闭合 | 若不回写,future evidence item会声明TC但无raw owner suite | `SBX-TEST-EVIDENCE-PRODUCER-001` resolved;已补齐8个slot并留痕 |
| 目标实现仓 / suite / CI缺失 | 无法执行64个检查或生成EV | open for `07` precheck / execution;不阻塞Step 8设计 |
| durable parity | MAIN-CONTRACT fake可证明语义契约,不证明真实durable隔离 | real-like仍`NotRunConditional`;不得补偿P0 |
| P0-Q candidate / lab | 状态 /事务P0-C不证明真实四维或release side effect | P0-Q仍`Blocked`;不影响本Step设计停审 |
| 当前未解上游blocker | 无 | 两个发现项已回写;其余为执行 /资格 /证据blocker |

---

## 12. 自检与停审

| 检查项 | 结论 |
|---|---|
| 是否创建Step 8主件和对应分件 | 通过;1主件 +2分件。 |
| 31个canonical状态enum entry是否逐项闭合 | 通过;31 /31,并与30 owner-level machine /39 shared declaration区分。 |
| 14事务 /重放是否逐项闭合 | 通过;14 /14。 |
| 19 race是否deterministic且逐项闭合 | 通过;19 /19。 |
| 每项是否有trigger / schedule、TC、slot、future EV、report和副作用 | 通过;64 /64。 |
| 是否使用canonical AC而非平行AC | 通过;STCHK / TXCHK / RCHK / SCA均明确仅为检查索引。 |
| 状态名漂移是否清零 | 通过;上游回写后只接受exact variant。 |
| 非法迁移、rollback、audit / relay、replay、race副作用是否可判定 | 通过。 |
| 是否保留Step 9 /10 /11~14责任 | 通过;NFR总体、evidence真实性、VETO、缺陷 /风险 /签署均未越界。 |
| 是否修改正式`06` | 否;正式`06`仍保持historical material,等Step 15装配。 |
| Step 8停审时是否提前创建Step 9 / `07` / implementation ledger / boundary skeleton | 否。用户确认Step 8后,当前仅由Step 9中间产物接续;`07`及implementation产物仍未创建。 |
| 是否伪造commit / run_id / EV / 测试结果 /签署 | 否。 |
| 是否需要提交 | 否;用户未要求commit。 |

### 12.1 进入下一步条件

```text
current_document = `06-验收标准.md`
current_step = Step 8 `状态机、事务与一致性验收`
gate_status = passed_to_step_9
formal_06_modified = no
runtime_acceptance = NotEntered
runtime_evidence_created = no
next_allowed_action = 用户已确认Step 8;由Step 9读取六类NFR输入并形成非功能验收门禁
commit_required = no
```

用户已明确确认Step 8并进入Step 9“定义非功能验收门禁”。Step 9开工已按以下清单读取:

1. `project_execution_ledger.md`
2. `06_acceptance_calibration_flow.md`
3. Step 8主件和两个分件
4. 验收SOP Step 9和书写规范§5.9
5. 正式`00`的六类NFR、`03`的结构有界 /安全 /恢复 /观测契约、`04`的profile / conditional边界、`05`§10非功能方案
6. L1-governance / L1-artifact验收Step 9粒度参考
