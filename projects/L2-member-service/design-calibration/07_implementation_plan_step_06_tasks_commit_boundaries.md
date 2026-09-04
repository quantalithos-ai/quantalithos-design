# Step 6. 拆分阶段任务、编写顺序与提交边界

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 6
> 本步状态：completed / pass_with_upstream_blockers
> 回填目标：正式 07-实施计划.md §6；同时作为 24 个 boundary skeleton 的来源。

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / pass_with_upstream_blockers |
| current_module | tasks_commit_boundaries |
| next_allowed_action | Step 7 test_acceptance_gates |
| implementation_allowed | false；所有 boundary 仍是 planned contract |

## 本步输入

正式 03/04/05/06、Step 5 八阶段 DAG、Rust/目录/依赖规范、代码实施台账规范，以及用户要求的单 agent 串行边界。

## SOP 问题回答

每个 phase 拆为三个可独立 review、验证和回退的 boundary；每个 boundary 固定三个 task 与三个 batch，形成 24 boundary / 72 task / 72 batch / 24 gate。代码顺序统一为 public contracts → domain → application/Port/UoW → infra fake/adapter → entry/test/report shell。状态机、事务、幂等、redaction、cursor、handoff 和 no-repair 逻辑必须在独立 batch 中验证。任何字段、DTO、状态、source、version、cursor 或 evidence 不能 1:1 回指正式 03/05/06 时，boundary 标为 blocker，回写设计后再继续；实现者不能临场补口。

## 当前文档问题诊断

没有 07 时，提交边界容易按文件或当天工作量拆分，且无法预创建 boundary ledger。旧方案还可能把真实 provider、完整 event schema 或 release evidence 提前写入。当前方案把每个边界绑定到一个可验证功能增量、一个 Gate、三个 task/batch 和明确的 allowed/forbidden scope。

## 改动前后对比

| 方面 | 改动前 | 改动后 |
|---|---|---|
| 粒度 | 文件 / 对象导向 | 功能增量导向 |
| 任务 | 模糊“完善模块” | IMPL-xx-yy 三任务固定 |
| 批次 | 测试最后补 | 每 boundary 三批，批后即验证 |
| 提交 | 未定义 | 一 boundary 一提交，future skeleton 预创建 |
| blocker | 实现者自行补设计 | 设计者闭口、实现者二次校验 |

## 设计取舍

- 24 个 boundary 足以把八个 phase 切成可 review 的纵切，同时避免 7 模块横向大提交。
- 每 boundary 三批不是要求每批必有固定行数；预计超过 300 行主动拆，超过 500 行必须重切。
- PH-08 的证据与 handoff 只生成 planned shell；没有真实 run 时不得产生 EV、VETO、signoff 或 readiness。

## 结构化中间产物

### 通用编写顺序

```text
contracts / refs / reasons / fixtures
  -> domain state / guard / unit tests
  -> application service / Port / UoW / idempotency
  -> infra fake / adapter / builder
  -> api / worker / jobs entry
  -> targeted test / artifact / report shell
  -> Design / Scope / Build / Test / Evidence / Commit / Handoff Gate
```

### 24 个 boundary、72 个 task 与 72 个 batch

| # | Phase | Boundary | 一句话增量 | Gate |
|---:|---|---|---|---|
| 01 | PH-01 | commit-01-a | 建立七模块 workspace 与 contracts skeleton | GATE-MS-01 |
| 02 | PH-01 | commit-01-b | 建立 config、builder、ports 与 deterministic fake foundation | GATE-MS-02 |
| 03 | PH-01 | commit-01-c | 建立 scripts、ledger、artifact/report shell | GATE-MS-03 |
| 04 | PH-02 | commit-02-a | 形成 intent 与 orchestration decision 的 local control slice | GATE-MS-04 |
| 05 | PH-02 | commit-02-b | 形成 qualification、assembly 与 readiness 的分项判定 slice | GATE-MS-05 |
| 06 | PH-02 | commit-02-c | 打通 control service、UoW、idempotency 与 stored result | GATE-MS-06 |
| 07 | PH-03 | commit-03-a | 建立 host、generation 与 action-attempt truth | GATE-MS-07 |
| 08 | PH-03 | commit-03-b | 建立 registration、endpoint 与 HostSession shell | GATE-MS-08 |
| 09 | PH-03 | commit-03-c | 接通 application/fake/entry 的 host-session 纵切 | GATE-MS-09 |
| 10 | PH-04 | commit-04-a | 建立 health signal、assessment 与 failure 分层 | GATE-MS-10 |
| 11 | PH-04 | commit-04-b | 建立 host-side recovery decision | GATE-MS-11 |
| 12 | PH-04 | commit-04-c | 接通 health/recovery orchestration 与 adapter seam | GATE-MS-12 |
| 13 | PH-05 | commit-05-a | 建立 closure 与 cleanup-attempt local truth | GATE-MS-13 |
| 14 | PH-05 | commit-05-b | 建立 residual finding 与 reconciliation case | GATE-MS-14 |
| 15 | PH-05 | commit-05-c | 接通 cleanup/reconcile service 与 bounded maintenance | GATE-MS-15 |
| 16 | PH-06 | commit-06-a | 建立 material、history、outbox 与 handoff records | GATE-MS-16 |
| 17 | PH-06 | commit-06-b | 建立 projection、safe view 与 Query contracts | GATE-MS-17 |
| 18 | PH-06 | commit-06-c | 接通 query mapping 与 API logical entry | GATE-MS-18 |
| 19 | PH-07 | commit-07-a | 建立五个 inbound Consumer contracts 与 guards | GATE-MS-19 |
| 20 | PH-07 | commit-07-b | 建立 immutable outbox publisher 与 feedback mapping | GATE-MS-20 |
| 21 | PH-07 | commit-07-c | 接通七个 Operations Job 与 worker/job entry | GATE-MS-21 |
| 22 | PH-08 | commit-08-a | 建立 fixture、gate 与 check script shell | GATE-MS-22 |
| 23 | PH-08 | commit-08-b | 建立 report、evidence、redaction 与 dependency derivation | GATE-MS-23 |
| 24 | PH-08 | commit-08-c | 建立 release smoke 与 acceptance handoff draft | GATE-MS-24 |

下表将每个 boundary 固定为三个实施任务和三个代码批次。任务和批次都是 planned identity，不代表源码或测试已经存在。

| Boundary | Task 1 / Batch 1 | Task 2 / Batch 2 | Task 3 / Batch 3 | Allowed scope | Forbidden scope |
|---|---|---|---|---|---|
| commit-01-a | IMPL-01-01 / BATCH-01-01：锁定 workspace / contract / dependency public/domain contract | IMPL-01-02 / BATCH-01-02：编排 Port、UoW、fake/adapter seam | IMPL-01-03 / BATCH-01-03：entry、negative test 与 gate fixture | workspace、crate/package/binary 命名和 public contract 文件壳 | 业务对象实现、外部依赖和真实源码 |
| commit-01-b | IMPL-01-04 / BATCH-01-04：锁定 config / port / fake public/domain contract | IMPL-01-05 / BATCH-01-05：编排 Port、UoW、fake/adapter seam | IMPL-01-06 / BATCH-01-06：entry、negative test 与 gate fixture | validated config、application Port、UoW/fake 基础 | 业务 transition、真实 provider 和 event route |
| commit-01-c | IMPL-01-07 / BATCH-01-07：锁定 tooling / ledger / evidence shell public/domain contract | IMPL-01-08 / BATCH-01-08：编排 Port、UoW、fake/adapter seam | IMPL-01-09 / BATCH-01-09：entry、negative test 与 gate fixture | gate/report/check 入口、台账与目录约定 | 实际 run、测试结果和 acceptance verdict |
| commit-02-a | IMPL-02-01 / BATCH-02-01：锁定 command / state / history public/domain contract | IMPL-02-02 / BATCH-02-02：编排 Port、UoW、fake/adapter seam | IMPL-02-03 / BATCH-02-03：entry、negative test 与 gate fixture | command contracts、domain transition、history/material relation | qualification、host generation 和 registration |
| commit-02-b | IMPL-02-04 / BATCH-02-04：锁定 qualification / assembly / config public/domain contract | IMPL-02-05 / BATCH-02-05：编排 Port、UoW、fake/adapter seam | IMPL-02-06 / BATCH-02-06：entry、negative test 与 gate fixture | safe source、pinned ref、assembly/readiness guards | 本地重解析 role→image、真实镜像和 sandbox backend |
| commit-02-c | IMPL-02-07 / BATCH-02-07：锁定 UoW / idempotency / result public/domain contract | IMPL-02-08 / BATCH-02-08：编排 Port、UoW、fake/adapter seam | IMPL-02-09 / BATCH-02-09：entry、negative test 与 gate fixture | application facade、CAS、reservation、duplicate/conflict | query、consumer、job 和外部动作 |
| commit-03-a | IMPL-03-01 / BATCH-03-01：锁定 host / generation / action public/domain contract | IMPL-03-02 / BATCH-03-02：编排 Port、UoW、fake/adapter seam | IMPL-03-03 / BATCH-03-03：entry、negative test 与 gate fixture | host identity、generation/current pointer、prepared attempt | 真实 orchestrator 调用和 member 内部 truth |
| commit-03-b | IMPL-03-04 / BATCH-03-04：锁定 registration / session / ref public/domain contract | IMPL-03-05 / BATCH-03-05：编排 Port、UoW、fake/adapter seam | IMPL-03-06 / BATCH-03-06：entry、negative test 与 gate fixture | registration、endpoint、session association 与 invalidation | Runtime run/turn/checkpoint、Member body |
| commit-03-c | IMPL-03-07 / BATCH-03-07：锁定 entry / fake / session public/domain contract | IMPL-03-08 / BATCH-03-08：编排 Port、UoW、fake/adapter seam | IMPL-03-09 / BATCH-03-09：entry、negative test 与 gate fixture | facade、fake adapter、API/worker entry wiring | 健康评估、recovery decision 和正式 publisher |
| commit-04-a | IMPL-04-01 / BATCH-04-01：锁定 health / signal / failure public/domain contract | IMPL-04-02 / BATCH-04-02：编排 Port、UoW、fake/adapter seam | IMPL-04-03 / BATCH-04-03：entry、negative test 与 gate fixture | signal snapshot、assessment、failure class/state | 以 heartbeat 直接推导业务成功或 recovery |
| commit-04-b | IMPL-04-04 / BATCH-04-04：锁定 recovery / decision / fence public/domain contract | IMPL-04-05 / BATCH-04-05：编排 Port、UoW、fake/adapter seam | IMPL-04-06 / BATCH-04-06：entry、negative test 与 gate fixture | recovery decision、basis、generation fence | Runtime checkpoint recovery、隐式重试 |
| commit-04-c | IMPL-04-07 / BATCH-04-07：锁定 orchestration / adapter / unknown public/domain contract | IMPL-04-08 / BATCH-04-08：编排 Port、UoW、fake/adapter seam | IMPL-04-09 / BATCH-04-09：entry、negative test 与 gate fixture | use-case、fake/disabled adapter、unknown/hold | 真实 backend readiness 和未授权 restart |
| commit-05-a | IMPL-05-01 / BATCH-05-01：锁定 closure / cleanup public/domain contract | IMPL-05-02 / BATCH-05-02：编排 Port、UoW、fake/adapter seam | IMPL-05-03 / BATCH-05-03：entry、negative test 与 gate fixture | closure、cleanup attempt、invalidation relation | 外部 cleanup complete、删除历史 |
| commit-05-b | IMPL-05-04 / BATCH-05-04：锁定 residual / reconciliation public/domain contract | IMPL-05-05 / BATCH-05-05：编排 Port、UoW、fake/adapter seam | IMPL-05-06 / BATCH-05-06：entry、negative test 与 gate fixture | finding、case、safe comparison、held/escalated | 修改 sibling truth、把 unavailable 当 resolved |
| commit-05-c | IMPL-05-07 / BATCH-05-07：锁定 maintenance / job / no-repair public/domain contract | IMPL-05-08 / BATCH-05-08：编排 Port、UoW、fake/adapter seam | IMPL-05-09 / BATCH-05-09：entry、negative test 与 gate fixture | selectors、single-item UoW、job result shell | 新 effect key、Query 修复、scheduler authorization |
| commit-06-a | IMPL-06-01 / BATCH-06-01：锁定 material / outbox / handoff public/domain contract | IMPL-06-02 / BATCH-06-02：编排 Port、UoW、fake/adapter seam | IMPL-06-03 / BATCH-06-03：entry、negative test 与 gate fixture | immutable material、history/outbox/handoff markers | 伪造 Core/Bus event family、推导 accepted |
| commit-06-b | IMPL-06-04 / BATCH-06-04：锁定 projection / query / no-write public/domain contract | IMPL-06-05 / BATCH-06-05：编排 Port、UoW、fake/adapter seam | IMPL-06-06 / BATCH-06-06：entry、negative test 与 gate fixture | projection identity、freshness、6 Query carrier | Query 写入、rebuild/repair 入口 |
| commit-06-c | IMPL-06-07 / BATCH-06-07：锁定 query / API / redaction public/domain contract | IMPL-06-08 / BATCH-06-08：编排 Port、UoW、fake/adapter seam | IMPL-06-09 / BATCH-06-09：entry、negative test 与 gate fixture | visibility、redaction、transport-neutral mapping | HTTP/RPC 产品绑定、写 repository |
| commit-07-a | IMPL-07-01 / BATCH-07-01：锁定 consumer / envelope / guard public/domain contract | IMPL-07-02 / BATCH-07-02：编排 Port、UoW、fake/adapter seam | IMPL-07-03 / BATCH-07-03：entry、negative test 与 gate fixture | envelope/version、dedup、late/generation guards | lifecycle decision、new effect key |
| commit-07-b | IMPL-07-04 / BATCH-07-04：锁定 publisher / feedback / layer public/domain contract | IMPL-07-05 / BATCH-07-05：编排 Port、UoW、fake/adapter seam | IMPL-07-06 / BATCH-07-06：entry、negative test 与 gate fixture | publisher port、submitted/unknown/gap、layer mapping | 回查 current truth 组包、delivery→accepted |
| commit-07-c | IMPL-07-07 / BATCH-07-07：锁定 jobs / worker / report public/domain contract | IMPL-07-08 / BATCH-07-08：编排 Port、UoW、fake/adapter seam | IMPL-07-09 / BATCH-07-09：entry、negative test 与 gate fixture | job registry、selector、report、worker wiring | Job 创建 intent/decision/generation |
| commit-08-a | IMPL-08-01 / BATCH-08-01：锁定 fixture / gate / check public/domain contract | IMPL-08-02 / BATCH-08-02：编排 Port、UoW、fake/adapter seam | IMPL-08-03 / BATCH-08-03：entry、negative test 与 gate fixture | fixture manifest、参数校验、gate orchestration shell | 静态 passed、真实 evidence 伪造 |
| commit-08-b | IMPL-08-04 / BATCH-08-04：锁定 report / evidence / audit public/domain contract | IMPL-08-05 / BATCH-08-05：编排 Port、UoW、fake/adapter seam | IMPL-08-06 / BATCH-08-06：entry、negative test 与 gate fixture | raw/report pairing、index、audit、redaction | 没有 raw artifact 的正式 EV/VF 结论 |
| commit-08-c | IMPL-08-07 / BATCH-08-07：锁定 release / handoff / stop-review public/domain contract | IMPL-08-08 / BATCH-08-08：编排 Port、UoW、fake/adapter seam | IMPL-08-09 / BATCH-08-09：entry、negative test 与 gate fixture | smoke selector、handoff/open-issues 模板、静态审计 | 真实 signoff/readiness 或越过 blocker |

### 每阶段任务与批次总表

| Phase | Task IDs | Batch IDs | 编写顺序 | 阶段内提交关系 |
|---|---|---|---|---|
| PH-01 | IMPL-01-01、IMPL-01-02、IMPL-01-03、IMPL-01-04、IMPL-01-05、IMPL-01-06、IMPL-01-07、IMPL-01-08、IMPL-01-09 | BATCH-01-01、BATCH-01-02、BATCH-01-03、BATCH-01-04、BATCH-01-05、BATCH-01-06、BATCH-01-07、BATCH-01-08、BATCH-01-09 | contracts → domain → application/infra → entry/test | 三个 boundary 各一提交 |
| PH-02 | IMPL-02-01、IMPL-02-02、IMPL-02-03、IMPL-02-04、IMPL-02-05、IMPL-02-06、IMPL-02-07、IMPL-02-08、IMPL-02-09 | BATCH-02-01、BATCH-02-02、BATCH-02-03、BATCH-02-04、BATCH-02-05、BATCH-02-06、BATCH-02-07、BATCH-02-08、BATCH-02-09 | contracts → domain → application/infra → entry/test | 三个 boundary 各一提交 |
| PH-03 | IMPL-03-01、IMPL-03-02、IMPL-03-03、IMPL-03-04、IMPL-03-05、IMPL-03-06、IMPL-03-07、IMPL-03-08、IMPL-03-09 | BATCH-03-01、BATCH-03-02、BATCH-03-03、BATCH-03-04、BATCH-03-05、BATCH-03-06、BATCH-03-07、BATCH-03-08、BATCH-03-09 | contracts → domain → application/infra → entry/test | 三个 boundary 各一提交 |
| PH-04 | IMPL-04-01、IMPL-04-02、IMPL-04-03、IMPL-04-04、IMPL-04-05、IMPL-04-06、IMPL-04-07、IMPL-04-08、IMPL-04-09 | BATCH-04-01、BATCH-04-02、BATCH-04-03、BATCH-04-04、BATCH-04-05、BATCH-04-06、BATCH-04-07、BATCH-04-08、BATCH-04-09 | contracts → domain → application/infra → entry/test | 三个 boundary 各一提交 |
| PH-05 | IMPL-05-01、IMPL-05-02、IMPL-05-03、IMPL-05-04、IMPL-05-05、IMPL-05-06、IMPL-05-07、IMPL-05-08、IMPL-05-09 | BATCH-05-01、BATCH-05-02、BATCH-05-03、BATCH-05-04、BATCH-05-05、BATCH-05-06、BATCH-05-07、BATCH-05-08、BATCH-05-09 | contracts → domain → application/infra → entry/test | 三个 boundary 各一提交 |
| PH-06 | IMPL-06-01、IMPL-06-02、IMPL-06-03、IMPL-06-04、IMPL-06-05、IMPL-06-06、IMPL-06-07、IMPL-06-08、IMPL-06-09 | BATCH-06-01、BATCH-06-02、BATCH-06-03、BATCH-06-04、BATCH-06-05、BATCH-06-06、BATCH-06-07、BATCH-06-08、BATCH-06-09 | contracts → domain → application/infra → entry/test | 三个 boundary 各一提交 |
| PH-07 | IMPL-07-01、IMPL-07-02、IMPL-07-03、IMPL-07-04、IMPL-07-05、IMPL-07-06、IMPL-07-07、IMPL-07-08、IMPL-07-09 | BATCH-07-01、BATCH-07-02、BATCH-07-03、BATCH-07-04、BATCH-07-05、BATCH-07-06、BATCH-07-07、BATCH-07-08、BATCH-07-09 | contracts → domain → application/infra → entry/test | 三个 boundary 各一提交 |
| PH-08 | IMPL-08-01、IMPL-08-02、IMPL-08-03、IMPL-08-04、IMPL-08-05、IMPL-08-06、IMPL-08-07、IMPL-08-08、IMPL-08-09 | BATCH-08-01、BATCH-08-02、BATCH-08-03、BATCH-08-04、BATCH-08-05、BATCH-08-06、BATCH-08-07、BATCH-08-08、BATCH-08-09 | contracts → domain → application/infra → entry/test | 三个 boundary 各一提交 |

### 按 Phase 的任务 / 批次 / 提交补充

本节按书写规范把每个 Phase 单独落盘；task/batch 仍是 planned identity，预计规模按单批代码变更量估算，状态、事务、幂等、安全和跨仓 seam 等高风险逻辑必须单独验证。

#### PH-01 Foundation

| 顺序 | Task / Batch | 实施动作与输入 | 输出与验证 | 提交关系 |
|---:|---|---|---|---|
| 1 | `IMPL-01-01~03` / `BATCH-01-01~03` | workspace、contracts、命名与 dependency skeleton；输入 `03` §3~§4、目录/Rust 规范 | manifest、typed carrier 壳；每批 100~220 行；GATE-MS-01 | `commit-01-a`；skeleton 可检查后提交 |
| 2 | `IMPL-01-04~06` / `BATCH-01-04~06` | validated config、builder、Port/UoW/fake；输入 `03` §13、`04` §3~§11 | config binding、fake/disabled seam；每批 100~260 行；GATE-MS-02 | `commit-01-b`；负向 config 检查通过后提交 |
| 3 | `IMPL-01-07~09` / `BATCH-01-07~09` | scripts、ledger、artifact/report 路径壳；输入 `05` §9/§13、台账规范 | gate 参数与模板；每批 80~180 行；GATE-MS-03 | `commit-01-c`；dry-run 可复现后提交 |

#### PH-02 Control / Qualification

| 顺序 | Task / Batch | 实施动作与输入 | 输出与验证 | 提交关系 |
|---:|---|---|---|---|
| 1 | `IMPL-02-01~03` / `BATCH-02-01~03` | intent/decision contract 与状态迁移；输入 `03` §6~§9 | command carrier、history relation；每批 120~280 行；GATE-MS-04 | `commit-02-a`；accepted/rejected/duplicate 切口通过后提交 |
| 2 | `IMPL-02-04~06` / `BATCH-02-04~06` | qualification/assembly/readiness guards；输入 `03` §6~§9、`04` §7 | typed resolver input、blocked/unknown fixture；每批 100~260 行；GATE-MS-05 | `commit-02-b`；外部 unavailable 不被升级后提交 |
| 3 | `IMPL-02-07~09` / `BATCH-02-07~09` | UoW/CAS/idempotency/stored result；输入 `03` §10~§12、`05` 幂等切口 | reservation、duplicate/conflict replay；每批 140~300 行；GATE-MS-06 | `commit-02-c`；replay 不重复 mutation 后提交 |

#### PH-03 Host / Registration / Session

| 顺序 | Task / Batch | 实施动作与输入 | 输出与验证 | 提交关系 |
|---:|---|---|---|---|
| 1 | `IMPL-03-01~03` / `BATCH-03-01~03` | host/generation/action-attempt truth；输入 `03` host/action/UoW | current pointer、prepared attempt；每批 120~280 行；GATE-MS-07 | `commit-03-a`；single-winner/generation fence 通过后提交 |
| 2 | `IMPL-03-04~06` / `BATCH-03-04~06` | registration/endpoint/session association；输入 `03` §7~§12、Member/Runtime pending mapper | registration/session carrier、invalidation；每批 100~260 行；GATE-MS-08 | `commit-03-b`；stale/cross-generation 分支通过后提交 |
| 3 | `IMPL-03-07~09` / `BATCH-03-07~09` | host-session facade/fake/entry；输入 `03` §4~§5/§8、`05` entry cuts | safe outcome mapper；每批 100~240 行；GATE-MS-09 | `commit-03-c`；entry smoke 不泄漏 body 后提交 |

#### PH-04 Health / Recovery

| 顺序 | Task / Batch | 实施动作与输入 | 输出与验证 | 提交关系 |
|---:|---|---|---|---|
| 1 | `IMPL-04-01~03` / `BATCH-04-01~03` | signal/assessment/failure facts；输入 `03` §8.4/§9/§11、health cuts | freshness/late/generation markers；每批 100~240 行；GATE-MS-10 | `commit-04-a`；late/unknown 分支通过后提交 |
| 2 | `IMPL-04-04~06` / `BATCH-04-04~06` | recovery decision/basis/fence；输入 `03` §8.4/§9/§12、`06` AC-MS-014 | held/unknown decision；每批 120~280 行；GATE-MS-11 | `commit-04-b`；不把 heartbeat 当业务成功后提交 |
| 3 | `IMPL-04-07~09` / `BATCH-04-07~09` | orchestration、adapter/fake/disabled seam；输入 `03` §11~§14、`04` §11 | unavailable safe outcome；每批 100~260 行；GATE-MS-12 | `commit-04-c`；disabled/unknown 可重放后提交 |

#### PH-05 Closure / Reconciliation

| 顺序 | Task / Batch | 实施动作与输入 | 输出与验证 | 提交关系 |
|---:|---|---|---|---|
| 1 | `IMPL-05-01~03` / `BATCH-05-01~03` | closure/cleanup attempt/invalidation；输入 `03` §8.5/§10~§12、`06` AC-MS-015 | local closure 与 attempt；每批 120~280 行；GATE-MS-13 | `commit-05-a`；不宣称 external cleanup complete 后提交 |
| 2 | `IMPL-05-04~06` / `BATCH-05-04~06` | residual/reconciliation safe comparison；输入 `03` §6/§8.5/§10、`06` AC-MS-016 | held/escalated finding/case；每批 100~260 行；GATE-MS-14 | `commit-05-b`；no-repair replay 通过后提交 |
| 3 | `IMPL-05-07~09` / `BATCH-05-07~09` | bounded maintenance selector/UoW/report；输入 `03` §7.5/§8.5/§12、job cuts | stored report replay；每批 100~240 行；GATE-MS-15 | `commit-05-c`；不创建新 key 后提交 |

#### PH-06 Material / Projection / Query

| 顺序 | Task / Batch | 实施动作与输入 | 输出与验证 | 提交关系 |
|---:|---|---|---|---|
| 1 | `IMPL-06-01~03` / `BATCH-06-01~03` | immutable material/history/outbox/handoff；输入 `03` §7.6/§10/§14 | body-free candidate/markers；每批 120~280 行；GATE-MS-16 | `commit-06-a`；不推导 accepted 后提交 |
| 2 | `IMPL-06-04~06` / `BATCH-06-04~06` | projection/SafeHostView/6 Query；输入 `03` §7.3/§8.3/§10、query cuts | committed source、双 cursor、no-write carrier；每批 120~300 行；GATE-MS-17 | `commit-06-b`；cursor/no-write 规则闭合后提交 |
| 3 | `IMPL-06-07~09` / `BATCH-06-07~09` | query mapping/visibility/redaction/API logical entry；输入 `03` §7~§8/§14、`04` redaction | transport-neutral safe outcome；每批 100~240 行；GATE-MS-18 | `commit-06-c`；不绑定 HTTP/RPC 后提交 |

#### PH-07 Consumer / Publisher / Jobs

| 顺序 | Task / Batch | 实施动作与输入 | 输出与验证 | 提交关系 |
|---:|---|---|---|---|
| 1 | `IMPL-07-01~03` / `BATCH-07-01~03` | consumer envelope/version/dedup/late guards；输入 `03` §7.4/§8.4、Core/Bus pending | 5 consumer carriers、guard fixture；每批 100~260 行；GATE-MS-19 | `commit-07-a`；不创建 lifecycle decision 后提交 |
| 2 | `IMPL-07-04~06` / `BATCH-07-04~06` | publisher/receipt/handoff-layer mapping；输入 `03` §7.6/§10.4、route pending | submitted/unknown/gap outcome；每批 120~280 行；GATE-MS-20 | `commit-07-b`；不把 delivery 升级为 accepted 后提交 |
| 3 | `IMPL-07-07~09` / `BATCH-07-07~09` | 7 Job registry/selector/worker/report；输入 `03` §7.5/§8.5/§12、job cuts | stored report、no-repair result；每批 100~260 行；GATE-MS-21 | `commit-07-c`；不创建 intent/decision/generation 后提交 |

#### PH-08 Evidence / Release Handoff

| 顺序 | Task / Batch | 实施动作与输入 | 输出与验证 | 提交关系 |
|---:|---|---|---|---|
| 1 | `IMPL-08-01~03` / `BATCH-08-01~03` | fixture/gate/check 参数与路径校验；输入 `05` §9/§13、既有 suite | fixed-run dry-run shell；每批 80~220 行；GATE-MS-22 | `commit-08-a`；不写 passed/evidence 后提交 |
| 2 | `IMPL-08-04~06` / `BATCH-08-04~06` | raw→report→index、redaction/dependency audit；输入 `05` §13~§14、`06` §10~§13 | report/index/audit output；每批 100~260 行；GATE-MS-23 | `commit-08-b`；无 raw 不生成 EV/VF 后提交 |
| 3 | `IMPL-08-07~09` / `BATCH-08-07~09` | release smoke、handoff/open-issues draft；输入 `06` §11~§14 | smoke 与 draft；每批 100~240 行；GATE-MS-24 | `commit-08-c`；不生成 verdict/signoff/readiness 后提交 |

### Boundary Gate Matrix 与实施台账规则

| Boundary | Gate | Required checks（planned） | Commit Gate | Handoff Gate |
|---|---|---|---|---|
| commit-01-a | GATE-MS-01 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-01-b | GATE-MS-02 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-01-c | GATE-MS-03 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-02-a | GATE-MS-04 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-02-b | GATE-MS-05 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-02-c | GATE-MS-06 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-03-a | GATE-MS-07 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-03-b | GATE-MS-08 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-03-c | GATE-MS-09 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-04-a | GATE-MS-10 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-04-b | GATE-MS-11 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-04-c | GATE-MS-12 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-05-a | GATE-MS-13 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-05-b | GATE-MS-14 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-05-c | GATE-MS-15 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-06-a | GATE-MS-16 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-06-b | GATE-MS-17 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-06-c | GATE-MS-18 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-07-a | GATE-MS-19 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-07-b | GATE-MS-20 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-07-c | GATE-MS-21 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-08-a | GATE-MS-22 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-08-b | GATE-MS-23 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |
| commit-08-c | GATE-MS-24 | fmt/check/build；boundary targeted suite；redaction/dependency（适用时）；固定 run 参数校验 | staged diff 只含 allowed scope；英文 type(scope): subject；whitespace 与文档同步 | 回写 hash（当前 none）、next boundary、未跑检查、blocker、user-change 与 baseline；缺项不得激活 successor |

### 开工前设计闭环复核（每个 boundary 必做）

| 复核项 | 必须确认 | 当前结论 / 失败处理 |
|---|---|---|
| 字段 / DTO / 状态 | 必填字段、variant、source、validation、合法迁移与测试名一致 | planned；缺口 blocked / wait_design，回写 03/05/06 |
| ref identity / scope | ProjectMemberRef + GlobalMemberRef、generation、target、correlation 有唯一 owner | planned；不得用字符串拼接或第二 truth |
| validation truth | source / owner / freshness / version 有正式 resolver 或 safe input | pending；不能用本地恒真检查 |
| metadata / idempotency | operation context、digest、reservation、stored result、UoW 顺序闭合 | planned；durable product pending |
| cursor / consistency | HostChangeCursor 与 CommittedChangeCursor 不 alias；sidecar 缺失进入 consistency defect | pending exact type；不得造第三 cursor |
| state / history | transition factory、history/material/outbox 写集和 rollback 窗口一致 | planned；不能绕过 domain |
| projection / query | source cursor、freshness、degraded、rebuild source、no-write 已固定 | planned；Query 不写 |
| job / evidence | selector、report、artifact root、run pairing、redaction 和 no-truth-repair 已固定 | planned；没有 run 不生成 evidence |
| phase boundary | 不引用 successor 的对象、结果、授权或 evidence | pass-designed；越界则重切 boundary |
| Rust / naming | 标识符、rustdoc、测试名英文；无架构层级泄漏 | planned；失败阻断 PH-01/相关 boundary |

### Commit boundary 经验复核

| 经验项 | 适用范围 | 当前设计期结论 |
|---|---|---|
| metadata / idempotency / trace / ref identity | 所有 command、consumer、job、handoff boundary | planned；字段/receipt exact 缺失处保持 blocker |
| validation truth / source precedence | PH-02、PH-03、PH-04、PH-07 | planned；只接受 typed source/ref，不解析外部正文 |
| state factory / transition / history | PH-02~PH-05 | pass-designed；具体实现尚未运行 |
| UoW / CAS / outbox / inbox / lease / cursor | PH-02、PH-06、PH-07 | pending；cursor exact 与 durable product 未闭合 |
| projection rebuild / artifact materialization | PH-06、PH-08 | planned；必须由 committed source / fixed run 派生 |
| phase boundary / owner / dependency | 全部 24 boundary | pass-designed；单 current，future wait_until_current |
| Rustdoc / naming | 全部代码 boundary | planned；实现仓缺失，不能执行 |

### 提交粒度判断

| 审计项 | 结论 |
|---|---|
| 一句话描述 | 24 个 boundary 均可一句话描述 |
| 独立 review / 验证 / 回退 | 每 boundary 有单一 Gate 和 allowed scope，设计期为 planned |
| 过细 / 过粗 | 适中；三批内可进一步按 100~300 行切分，不改变 boundary identity |
| 跨 phase 混入 | 未发现；PH-08 证据不前移 |
| 提交时机 | 仅实现仓未来门禁通过后提交；本轮 design 仓不提交 |

### Commit boundary 停审记录

| Boundary 范围 | 审查项 | 结论 | 缺口 |
|---|---|---|---|
| commit-01-a..08-c | scope、tasks、batches、gate、review、rollback、handoff identity | completed / pass_with_upstream_blockers | target repo、exact contracts、真实产品和 run 仍 pending |

### 跨 boundary 粒度 / 依赖 / 门禁审计

| 审计项 | 结论 | 修正 |
|---|---|---|
| 24 boundary 与 24 gate 集合 | pass-designed | 1:1 映射 |
| 72 task 与 72 batch 集合 | pass-designed | 每 boundary 三对 |
| phase 顺序 | pass-designed | PH-01 → PH-08 |
| current 唯一性 | planned | 仅 commit-01-a 可在未来激活；当前仍 blocked |
| evidence maturity | pass-designed | PH-08 前仅 candidate/shell，正式 EV 需真实 run |

## 回填草稿

正式 §6 应回填八 phase 的 24 boundary 总表、统一编写顺序、每 boundary 三 task/三 batch、Gate Matrix、开工前闭环复核、经验复核、提交粒度和停审规则；boundary 台账路径详见 Step 13 装配结果。

## 待确认事项

- 24 boundary 的 allowed scope 与目标仓实际目录创建结果需在 implementation activation 前复核。
- HostChangeCursor / CommittedChangeCursor exact type、Core/Bus receipt、durable store/lease 产品仍 pending。
- 任何 boundary 新增文件或跨 phase 依赖都必须回写 03/05/06/07 并 controlled reopen。

## 进入下一步条件

24 boundary、72 task、72 batch、24 gate、提交门禁和经验复核均已固定，允许进入 Step 7 测试与验收门禁。
