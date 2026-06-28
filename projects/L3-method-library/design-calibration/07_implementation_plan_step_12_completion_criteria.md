# Step 12. 定义实施完成判定

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 12
> 回填章节: `07-实施计划.md` §12 实施完成判定
> 当前模块: `R12.2 completion criteria:再写入`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义实施完成判定 |
| 当前模块 | `R12.2 completion criteria:再写入` |
| 当前状态 | completed_confirmed |
| 输入基线 | Step 2 范围;Step 4 交付物;Step 6 commit boundary;Step 7 门禁;Step 9 风险;Step 10 pause/change;Step 11 交付纪律;`06-验收标准.md` |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_12_completion_criteria.md` |
| 停审方式 | 用户已确认,允许进入 Step 13 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 2 实施范围 | completed_confirmed | 判定 P0 core 是否覆盖 FR-ML-001~009、BR-ML-001~022、NFR-ML-001~016 和 `06` P0 验收面 |
| Step 4 交付物清单 | completed_confirmed | 判定七 crate、protocol family、tests、scripts、artifact/report、ledger 交付物是否完成 |
| Step 6 commit boundary | completed_confirmed | 判定 25 个 candidate boundary 是否完成、提交、可 review、可回退 |
| Step 7 门禁矩阵 | completed_confirmed | 判定 P0 blocking suite、audit、EV、VETO、artifact/report 是否通过 |
| Step 9 Spike / risk / open question | completed_confirmed | 判定 blocker、Spike、OQ 是否关闭或转入正式 residual |
| Step 10 回退、暂停与变更控制 | completed_confirmed | 判定失败项是否按 owning source 修复,未把 blocker 风险接受 |
| Step 11 提交、评审与交付纪律 | completed_confirmed | 判定 commit、review、handoff 和 evidence discipline 是否满足 |
| `06-验收标准.md` §5~§14 | 已读取 | 使用 ML-FG / ML-RL / ML-SYNC / VETO / final decision 的正式裁决边界 |
| 代码实施台账规范 §14 | 已读取 | 使用 boundary 完成条件:ledger、Design/Scope/Worktree/Build/Test/Evidence/Commit/Handoff Gate |
| L1 Step 12 | framework_reference | 只参考完成判定结构,不得复制旧项目范围、编号或结论 |

## 3. SOP 问题回答

1. 本轮需求覆盖如何判定。

   回答: 以 Step 2 的 P0 core 为准。FR-ML-001~009、BR-ML-001~022、NFR-ML-001~016、`TC-ML-*`、`EV-ML-*`、ML-FG、ML-RL、ML-SYNC、ML-STATE/TX/READ/JOB/IDEMP/CHKPT/NFR 均必须能回指实现、测试、artifact、report 和验收证据。FR-ML-E-001~004 只能作为 peripheral / residual / future,不得阻塞 P0 完成。

2. 交付物是否全部完成。

   回答: 以 Step 4 和 Step 6 为准。七正式 crate、58 Command、57 Query、4 Inbound Consumer、34 Outbound Event / sender、8 Operations Job、P0 suite、scripts、run-scoped artifact/report、acceptance handoff shell、implementation ledger / boundary ledger 都必须完成或有正式不适用说明。

3. 测试门禁和验收门禁是否全部通过或有明确风险接受。

   回答: P0 blocking gates 必须通过。VETO-ML、S 级缺陷、redaction/dependency/report audit failure、query/job truth repair、static evidence、invalid P0 config silent fallback 不得风险接受。只有 B/R residual 或不命中 VETO 且有正式 owner/acceptor/deadline_or_trigger 的 A 级风险,才可能进入有条件完成。

4. 风险、Spike 和待确认事项是否关闭。

   回答: SP-ML-001~008 必须有 dry-run/report/checklist/source matrix 等输出或正式取消理由;R-ML blocker 必须关闭;OQ-ML-001~009 必须在截止 boundary 前关闭或转入可审计 residual。

5. 是否存在一票否决项。

   回答: VETO-ML-001~014 任一命中时,实施不得声明完成或有条件完成,也不得进入最终可送验状态。

6. 未完成项如何进入延期、风险接受或 blocker。

   回答: P0 缺失、P0 gate failed、VETO、S 级、证据不可裁决、设计闭环 blocker、phase boundary 冲突一律 blocker。P1/P2/future 或 FR-ML-E peripheral 可延期或 residual,但必须有 owner、acceptor 和 deadline_or_trigger,且不得计入 P0 pass。

7. `reports/runs/<run_id>` 是否已经从 `artifacts/test/<run_id>` 生成。

   回答: 完成判定要求所有正式 run reports 均从 raw artifacts 推导,并通过 report-generation-audit。raw artifact 不能替代 suite report、summary、evidence index 或 acceptance handoff。

8. `reports/acceptance/handoff.md`、`veto-checklist.md` 和必要的 `risk-acceptance.md` 是否已经审查。

   回答: 必须由人或 Agent 审查并记录结论。脚本生成初稿不能替代审查结论。

9. artifact / report 是否通过 redaction 和 link 检查。

   回答: 必须通过 redaction-boundary、dependency-boundary、observability-boundary、report-generation-audit 和 path/link review。任何 unsafe body、secret、full sensitive ref、non-core compile dependency、orphan report 或 `latest` 都阻塞完成。

10. 是否仍存在未关闭的字段、DTO、状态、命名或 phase boundary 冲突。

    回答: 不允许。任何 schema、DTO、port、state、mapper、marker、config、evidence schema 或 phase scope 缺口都必须回写 owning source 并固定新 baseline 后重新判定。

11. 是否已按 phase / commit boundary 对正式 `03/05/06/07` 执行交付实现前可落码闭环审计。

    回答: 必须执行。审计范围覆盖每个 phase / commit boundary 对 `03/05/06/07` 的字段、DTO、状态、port、transaction、query/event/job、config、evidence、EV/VETO、boundary scope 和经验复核。未通过项必须回写设计真相源。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 7 | 门禁已定义但还不是最终完成判定 | 实施结束时可能只看测试通过 | 汇总为完成判定表和 evidence integrity 判定 |
| Step 9 | risk / OQ 有截止点 | 需要完成时统一审计 | 加入风险关闭和未完成项处理 |
| Step 11 | 提交与 handoff 纪律已定义 | 需要成为 boundary 完成必要条件 | 加入 Commit/Handoff Gate 完成表 |
| `06` 验收标准 | 最终裁决很严格 | 实施计划不能使用“基本完成” | 固定完成 / 有条件完成 / 不完成口径 |
| 真实 implementation ledger | 尚未创建实例 | 需要定义完成判定字段 | 本 Step 定义规则,实例仍在 Step 13 前实现移交准备时创建 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 完成口径 | 分散在 gate、risk、acceptance | 汇总为可审查完成判定 | 防止口头宣称完成 |
| raw artifact | 可能被误当作完成证据 | 必须生成 report 和 evidence index | 符合 run-scoped evidence |
| acceptance report | 可能脚本生成即通过 | 必须人或 Agent 审查 | 防止自动宣告 pass |
| P1/P2 | 容易污染 P0 | 只能 residual / future | 保持 P0 core 可裁决 |
| 设计闭环 | 每个 boundary 前复核 | 完成时做整体审计 | 防止残留设计缺口 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只看 cargo / tests pass | 简单 | 覆盖不了 VETO、证据、redaction、dependency 和 design closure | 不采用 |
| 把最终验收裁决写入实施计划 | 看似完整 | 越过 `06-验收标准.md` 和真实验收职责 | 不采用 |
| 实施完成只声明可送验 | 职责清晰 | 仍需验收阶段裁决 | 采用 |
| 未完成项口头延期 | 灵活 | 不可审计 | 不采用 |
| residual 必须有 owner / acceptor / trigger | 可追踪 | 需要更多记录 | 采用 |

## 7. 结构化中间产物

### 7.1 实施完成判定表

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| P0 范围覆盖 | FR-ML-001~009、BR-ML-001~022、NFR-ML-001~016 和 `06` P0 验收面均有实现与门禁证据 | Step 6 boundary;trace matrix;reports/runs | 执行期判定 |
| Protocol family 覆盖 | 58 Command、57 Query、4 Consumer、34 Outbound Event / sender、8 Job 的 P0 surface 均按 boundary 落地或有正式 residual | contract/service/job reports | 执行期判定 |
| 交付物完成 | Step 4 代码、测试、配置、脚本、artifact/report、ledger 交付物完成,非范围未混入 | commit history;delivery checklist | 执行期判定 |
| Commit boundary 完成 | commit-01-a~commit-11-b 均按 Step 6/11 完成,无跨 boundary 混入 | git log;boundary ledger;review notes | 执行期判定 |
| Boundary Gate 完成 | 每个 boundary 的 Design/Scope/Worktree/Build/Test/Evidence/Commit/Handoff Gate 均 pass 或正式 not_applicable | implementation ledger;boundary ledger | 执行期判定 |
| 测试门禁通过 | 所有 P0 blocking suite/check 通过 | `reports/runs/<run_id>` | 执行期判定 |
| 验收红线未命中 | VETO-ML-001~014 均未命中 | `reports/acceptance/veto-checklist.md` | 执行期判定 |
| S 级缺陷为零 | 无未关闭 S 级缺陷 | defect report;open issues | 执行期判定 |
| 风险接受完整 | 有条件完成时 A/B/R residual 有 owner、acceptor、deadline_or_trigger | `reports/acceptance/risk-acceptance.md` | 执行期判定 / 不适用 |
| Evidence integrity | EV index、redaction、dependency、observability、report audit 均通过 | evidence-index;redaction;dependency;observability;report-audit | 执行期判定 |
| Acceptance handoff | handoff、VETO、risk、open issues 已审查 | `reports/acceptance/*` | 执行期判定 |
| 设计闭环无残留 blocker | phase / boundary 字段、DTO、状态、port、mapper、marker、config、evidence、scope 均闭合 | design closure audit | 执行期判定 |

### 7.2 Boundary 完成条件

| 条件 | 完成标准 | 不通过处理 |
|---|---|---|
| boundary 台账存在 | `implementation-boundaries/<boundary_id>.md` 存在并指向明确 baseline | 不得开工或完成 |
| Design Gate | required reads 已读,设计闭环复核无 blocker | 回写 owning source |
| Scope Gate | diff 只含 allowed scope,无 forbidden scope | 拆出越界改动 |
| Worktree Gate | 不 stage 用户无关改动,工作区状态可解释 | 暂停并清理 staged scope |
| Build/Test Gate | Step 7 规定 checks 通过或正式 not_applicable | 修复或回设计 |
| Evidence Gate | artifact/report 配对,无 `latest`,无静态 pass | 修 generator/source |
| Commit Gate | message、footer、diff、checks 通过 | 不提交 |
| Handoff Gate | hash、message、remaining blockers、next action 已回写 | 不声明 boundary 完成 |
| Project ledger | 项目级台账推进到下一动作 | 不进入下一 boundary |

### 7.3 闭环项完成标准

| 闭环项 | 完成标准 | 证据 | 结论 |
|---|---|---|---|
| 字段 / DTO 闭环 | 所有 phase 按正式 `03` 构造,无临时补字段或默认值 | boundary design review;contract tests | 执行期判定 |
| 状态闭环 | 代码、测试、验收使用同一套正式状态名和 transition | domain tests;state matrix review | 执行期判定 |
| Port / repository 闭环 | 所有 flow 所需读写面、version source、UoW 语义正式定义 | application port review;service tests | 执行期判定 |
| Query / projection 闭环 | query no-write、visibility、degraded、stale、material freshness、read surface 来源闭合 | query/material reports | 执行期判定 |
| Event / consumer / publisher 闭环 | inbound receipt/dedup、outbound candidate source、publisher outcome 不重算 current truth | entry-worker-job reports | 执行期判定 |
| Job / replay / handoff 闭环 | checkpoint、stored report replay、partial failure、duplicate path、no truth repair 成立 | operations-replay reports | 执行期判定 |
| Config / dependency 闭环 | P0 profile fail-fast、fake/controlled/disabled seam、only core compile dependency 成立 | config-redline;dependency-boundary | 执行期判定 |
| Evidence 闭环 | raw artifact -> report -> EV / VETO / handoff 可追溯 | report-generation-audit | 执行期判定 |
| Phase boundary | 无当前 phase 依赖后续 phase 的实现或证据 | commit review;boundary ledger | 执行期判定 |

### 7.4 交付实现前可落码闭环审计

| Phase / commit boundary | 复核范围 `03/05/06/07` | 适用标准项 | 结论 | blocker | 修复 baseline |
|---|---|---|---|---|---|
| PH-01 / commit-01-a~b | workspace layout、config baseline、script roots、artifact/report roots、dependency boundary | path baseline;config binding;artifact materialization;dependency closure | 执行期判定 | old layout、core dependency、config path | design commit or 不适用 |
| PH-02 / commit-02-a~c | public contract、domain foundation、application UoW/idempotency shell | 字段闭环;DTO构造;状态;port;transaction;idempotency | 执行期判定 | DTO/state/UoW/stored surface | design commit or 不适用 |
| PH-03 / commit-03-a~b | method asset definition/catalog truth and service slice | truth owner;catalog identity;accepted flow;repository fake | 执行期判定 | definition identity/source/service scope | design commit or 不适用 |
| PH-04 / commit-04-a~b | formalization/version contracts、state guards、stored replay | version state;duplicate replay;conflict handling;commit unknown | 执行期判定 | version source/replay surface | design commit or 不适用 |
| PH-05 / commit-05-a~b | controlled consumption、distribution、handoff semantics | Definition vs Use;availability;downstream-not-ready;handoff shell | 执行期判定 | consumption source/availability marker | design commit or 不适用 |
| PH-06 / commit-06-a~b | trace、audit、impact、lineage evidence refs | redaction;safe refs;lineage;stored replay;observability safe output | 执行期判定 | raw body leak/source gap | design commit or 不适用 |
| PH-07 / commit-07-a~b | external summary body-free boundary、peripheral package/set residual | body-free adapter;residual marker;peripheral not blocking core | 执行期判定 | provider body/peripheral blocker | design commit or 不适用 |
| PH-08 / commit-08-a~c | query/view contracts、read material、query service、projection surface | query no-write;visibility/degraded/stale/freshness marker;material source | 执行期判定 | marker/source/private fallback | design commit or 不适用 |
| PH-09 / commit-09-a~b | inbound consumer、outbound event candidate、publisher outcome | receipt/dedup;event candidate source;publisher outcome;redaction | 执行期判定 | current truth rebuild/raw payload | design commit or 不适用 |
| PH-10 / commit-10-a~c | job protocol、refresh/recovery/handoff jobs、stored report replay | checkpoint;partial issue;duplicate replay;no truth repair | 执行期判定 | job repairs truth/report surface | design commit or 不适用 |
| PH-11 / commit-11-a~b | report generator、evidence index、release smoke、VETO、handoff | raw-to-report;no static evidence;VETO evidence;acceptance review | 执行期判定 | static pass/latest/default VETO | design commit or 不适用 |

### 7.5 交付证据项

| 交付证据项 | 固定路径 | 完成标准 | 结论 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>` | P0 suite 原始证据完整,failed artifact 保留 | 执行期判定 |
| suite reports | `reports/runs/<run_id>/suites/<suite>.md` | 每个 blocking suite 有从 raw artifact 推导的人读 report | 执行期判定 |
| run summary | `reports/runs/<run_id>/summary.md` | 汇总 suite、duration/count、status、baseline、safe failures | 执行期判定 |
| gate summary | `reports/runs/<run_id>/gate-summary.md` | blocking / non-blocking / residual 分类清楚 | 执行期判定 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | EV-ML -> TC-ML -> suite -> artifact -> report -> AC/VETO 可追溯 | 执行期判定 |
| redaction report | `reports/runs/<run_id>/redaction-check.md` | artifact/report/log safe scan 通过 | 执行期判定 |
| dependency report | `reports/runs/<run_id>/dependency-boundary.md` | 证明 only core compile dependency | 执行期判定 |
| observability report | `reports/runs/<run_id>/observability-boundary.md` | logs/metrics/traces 不泄露、不成 truth | 执行期判定 |
| report audit | `reports/runs/<run_id>/report-audit.md` | artifact/report pairing、no `latest`、no static evidence 通过 | 执行期判定 |
| acceptance handoff | `reports/acceptance/handoff.md` | 已审查,包含 baseline、run_id、scope、remaining risks、next action | 执行期判定 |
| VETO checklist | `reports/acceptance/veto-checklist.md` | VETO-ML-001~014 均有真实证据结论 | 执行期判定 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件完成时 residual 完整;无 residual 时可不适用 | 执行期判定 / 不适用 |
| open issues | `reports/acceptance/open-issues.md` | S/A/B/R 分级、复验、关闭或接受状态明确 | 执行期判定 |
| design closure audit | `reports/acceptance/design-closure-audit.md` 或 handoff section | phase/boundary 可落码审计无 blocker | 执行期判定 |

### 7.6 未完成项处理表

| 未完成项类型 | 处理 | 是否允许完成 |
|---|---|---|
| P0 FR/BR/NFR implementation missing | blocker;补实现和门禁 | 否 |
| P0 protocol surface missing without formal residual | blocker;回设计或补实现 | 否 |
| P0 blocking suite failed | blocker;修复并复验 | 否 |
| VETO-ML-001~014 命中 | blocker;不可风险接受 | 否 |
| S 级缺陷未关闭 | blocker;不可风险接受 | 否 |
| redaction/dependency/observability/report audit failed | blocker;修复并复验 | 否 |
| static evidence、`latest`、default VETO passed | blocker;重做 raw artifact 推导 | 否 |
| design closure blocker 未修 | 回写设计并重复核 | 否 |
| A 级缺陷未修复但不命中 VETO | 需要正式风险接受;通常最多有条件完成 | 仅有条件 |
| B/R residual | 风险接受或延期,有 owner/acceptor/deadline_or_trigger | 可完成或有条件 |
| FR-ML-E peripheral 未做完整产品能力 | residual/future,不计 P0 pass | 可完成 |
| P1 selected-run unavailable | residual/unavailable,不计 P0 pass | 可完成 |
| real DB/bus/provider/secret backend 未锁定 | P1/P2 future risk | 可完成 |
| production-like hard SLO 未硬化 | performance residual;保留 sample/trend | 可完成 |

### 7.7 最终交付清单

| 交付物 | 完成判定 |
|---|---|
| 七 crate workspace | package/crate/binary naming and dependency boundary check passed |
| contracts/domain/application/infra/api/worker/jobs implementation | Step 6 boundary completed and tested |
| config profiles and runtime builder | config smoke and config-redline passed |
| in-memory/fake/controlled/disabled adapters | fake semantics tests and availability checks passed |
| command/query/consumer/outbound/job services | service-flow, query no-write, entry-worker-job, operations replay passed |
| scripts/gates, scripts/reports, scripts/checks | release gate dry-run and report audit passed |
| artifacts/test/<run_id> | raw artifacts complete and safe |
| reports/runs/<run_id> | generated from raw artifacts and audited |
| reports/acceptance/* | reviewed handoff, VETO, risk/open issues |
| implementation ledger / boundary ledgers | every boundary has Commit/Handoff Gate closure |
| design closure audit | no unresolved blocker |

### 7.8 完成结论口径

| 结论 | 条件 | 说明 |
|---|---|---|
| 完成 / 可送验 | P0 全部通过,VETO 未命中,S=0,证据完整,无未接受 A 级或 blocker | 进入 `06` 的正式验收裁决 |
| 有条件完成 / 可送验但带 residual | P0 主线成立,VETO 未命中,S=0,证据完整,存在已接受 A/B/R residual | residual 必须有 owner/acceptor/deadline_or_trigger |
| 不完成 / 不可送验 | 任一 P0 blocking gate failed,VETO 命中,S 未关闭,证据不可裁决,设计闭环 blocker 未修 | 不得用“基本完成”替代 |

### 7.9 完成判定停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 完成判定是否有证据 | 通过 | 所有判定项绑定 artifact/report/review |
| 是否禁止“基本完成” | 通过 | 只允许完成 / 有条件完成 / 不完成 |
| raw artifact 是否不能替代 report | 通过 | suite reports、summary、evidence index 必须存在 |
| acceptance reports 是否需审查 | 通过 | handoff/VETO/risk/open issues 必须审查 |
| 设计闭环冲突是否阻塞完成 | 通过 | design closure audit 必须无 blocker |
| P1/P2 是否不会污染 P0 | 通过 | residual/future risk |
| 是否创建真实 evidence | 未创建 | 本 Step 只定义完成判定 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_12_completion_criteria.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施完成判定表”“Boundary 完成条件”“交付实现前可落码闭环审计”“交付证据项”“未完成项处理表”和“完成结论口径”小节。

正式 `07-实施计划.md` §12 后续应回填:

本轮实施只能在 Step 2 P0 范围、Step 4 交付物、Step 6 commit boundary、Step 7 P0 blocking gates、Step 11 Commit/Handoff Gate、run-scoped evidence 和 `06-验收标准.md` VETO 均可判定时声明完成。完成判定是“可送验”判定,不替代验收负责人的最终裁决。

完成必须同时满足:FR-ML-001~009、BR-ML-001~022、NFR-ML-001~016 和 P0 protocol surface 已覆盖;commit-01-a 到 commit-11-b 均完成并回写台账;所有 P0 blocking suite / audit 通过;VETO-ML-001~014 未命中;S 级缺陷为零;raw artifact、suite reports、summary、gate-summary、evidence-index、redaction/dependency/observability/report audit 和 acceptance reports 完整;phase / commit boundary 可落码闭环审计无 blocker。

不允许使用“基本完成”。P0 缺失、blocking gate failed、VETO、S 级、redaction/dependency/observability/report audit failed、static evidence、`latest`、default VETO passed、query/job truth repair 或设计闭环 blocker 均不得延期为已完成。P1/P2/future 和 FR-ML-E peripheral 可以进入 residual,但必须有 owner、acceptor 和 deadline_or_trigger,且不得计入 P0 pass。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 实际 run_id | PH-11 执行时固定 | release handoff |
| design closure audit report 是否单独成文 | 可单独 `design-closure-audit.md` 或放入 handoff section | PH-11 |
| 有条件完成是否允许进入下一轮 | 由 `06-验收标准.md` 和验收负责人裁决 | acceptance |
| implementation ledger 实例创建 | Step 13 装配正式 `07` 并固定 boundary 后、实现移交前创建 | Step 13 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 11 已确认 | 通过 | 用户已确认 |
| 实施完成判定表已定义 | 通过 | §7.1 |
| Boundary 完成条件已定义 | 通过 | §7.2 |
| 闭环项完成标准已定义 | 通过 | §7.3 |
| 交付实现前审计已定义 | 通过 | §7.4 |
| 交付证据项已定义 | 通过 | §7.5 |
| 未完成项处理已定义 | 通过 | §7.6 |
| 完成结论口径已定义 | 通过 | §7.8 |
| 未修改正式 `07` 或实现仓 | 通过 | 本 Step 只写设计中间产物 |
| 可进入 R12.2 / Step 13 | 通过 | 用户已确认,允许进入 Step 13 |

## 11. R12.2 用户确认记录

| 项 | 状态 |
|---|---|
| 用户确认 | 已确认 |
| 确认输入 | `同意` |
| 确认范围 | Step 12 实施完成判定中间产物 |
| 后续动作 | 进入 Step 13 `R13.1 formal document assembly:正式装配` |
| 限制 | Step 13 可修改正式 `07-实施计划.md`;不得创建真实 implementation ledger、boundary ledger、CI、脚本、代码或 evidence |
