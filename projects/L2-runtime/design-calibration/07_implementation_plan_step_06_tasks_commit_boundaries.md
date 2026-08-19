# Step 6. 拆分阶段任务、编写顺序与提交边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 6
> 回填目标：正式 `07-实施计划.md` §6；Step 13 boundary skeleton source
> 本步状态：`completed / pass-designed`
> 详细 annex：`07_implementation_plan_step_06_tasks_batches_ph01_06.md`、`07_implementation_plan_step_06_tasks_batches_ph07_13.md`

## 1. Stable identity and fact boundary

Step 5 固定了 13 个 Phase。每个 Phase 以三个可独立 review 的 boundary 交付，因此本 Step 的唯一集合是：

```text
39 canonical boundaries
39 GATE identities
117 IMPL identities (three per boundary)
117 BATCH identities (three per boundary)
```

这些身份都是 planned contract。目标仓、源码、测试、artifact、report、evidence、commit hash 和 handoff 仍不存在；只有 Step 13 才创建 boundary ledger skeleton。

旧 `commit-01-a~commit-12-c`、35 boundary、105 IMPL/BATCH、旧 `PH-12` tooling identity 均为 `historical_material`，不得通过别名兼容。

## 2. Boundary 通用执行合同

每个 boundary 按以下顺序执行：

```text
read project ledger
  -> read current boundary Required Reads
  -> Design / Scope / Worktree Gate
  -> Batch A: contract + domain construction
  -> Batch B: application + Port/UoW/adapter seam
  -> Batch C: entry/test/negative closure
  -> targeted checks (or explicit not_applicable before PH-13 tooling)
  -> staged-scope / Commit Gate
  -> Handoff Gate
  -> activate successor only after ledger update
```

| Rule | Contract |
|---|---|
| one-sentence boundary | 每 boundary 只能新增一个可验证功能增量；不能按文件类型拆成无语义提交 |
| batch size | 预计超过 300 行主动拆批；实际 source+test diff 超过 500 行必须暂停重切 |
| Batch A | typed contract、factory、domain state/policy；不含外部 I/O |
| Batch B | service、Port、UoW、repository/adapter/fake parity；固定 read/write set 与错误映射 |
| Batch C | entry/consumer/job/targeted tests、negative/replay/Unknown closure；不得引入 successor phase |
| scope | 只能修改 annex 与 boundary ledger 中列出的 crate/module/test；新增路径需回写 03/04/05/07 并 controlled reopen |
| external seam | only typed Port + Disabled/Blocked/Candidate/negative fake；不添加 provider route/secret、Tools executor、Sandbox truth、Obs backend |
| evidence | PH-01~PH-12 只能记录真实命令或 `not_applicable: PH-13 tooling not implemented`；PH-13 才可生成 fixed-run raw/report/index |
| commit | 实现期才允许 commit；设计期 `committed_hash=none`，不得以 planned subject 冒充实际提交 |

## 3. Canonical boundary registry

| # | Phase | Boundary | One-sentence increment | IMPL tasks | BATCHes | Gate | Exit dependency |
|---:|---|---|---|---|---|---|---|
| 01 | PH-01 | `commit-01-a` | 建立七 crate workspace 和命名闭包 | `IMPL-01-01~03` | `BATCH-01-01~03` | GATE-01 | repo/Core preflight |
| 02 | PH-01 | `commit-01-b` | 建立 shared IDs/refs/scope/metadata | `IMPL-01-04~06` | `BATCH-01-04~06` | GATE-02 | 01-a |
| 03 | PH-01 | `commit-01-c` | 建立 reason/error/digest/operation context | `IMPL-01-07~09` | `BATCH-01-07~09` | GATE-03 | 01-b |
| 04 | PH-02 | `commit-02-a` | 闭合 local Port、record、version 和 cursor 方法级契约 | `IMPL-02-01~03` | `BATCH-02-01~03` | GATE-04 | PH-01 |
| 05 | PH-02 | `commit-02-b` | 闭合 UoW/CAS/inbox/outbox/idempotency local stores | `IMPL-02-04~06` | `BATCH-02-04~06` | GATE-05 | 02-a |
| 06 | PH-02 | `commit-02-c` | 闭合 Unknown、lease/page、faultable consistency kernel | `IMPL-02-07~09` | `BATCH-02-07~09` | GATE-06 | 02-b |
| 07 | PH-03 | `commit-03-a` | 建立 loop cursor/snapshot/activation/step objects | `IMPL-03-01~03` | `BATCH-03-01~03` | GATE-07 | PH-02 |
| 08 | PH-03 | `commit-03-b` | 建立 wakeup/continuation/yield/reservation state | `IMPL-03-04~06` | `BATCH-03-04~06` | GATE-08 | 03-a |
| 09 | PH-03 | `commit-03-c` | 建立 closed planner 与 T1/T2/T3 loop service | `IMPL-03-07~09` | `BATCH-03-07~09` | GATE-09 | 03-b |
| 10 | PH-04 | `commit-04-a` | 建立 admission/run/goal-plan domain state | `IMPL-04-01~03` | `BATCH-04-01~03` | GATE-10 | PH-03 |
| 11 | PH-04 | `commit-04-b` | 实现 accepted-only admission 和 control flows | `IMPL-04-04~06` | `BATCH-04-04~06` | GATE-11 | 04-a |
| 12 | PH-04 | `commit-04-c` | 实现 progress、history 与 zero-write queries | `IMPL-04-07~09` | `BATCH-04-07~09` | GATE-12 | 04-b |
| 13 | PH-05 | `commit-05-a` | 建立 source/context snapshot/composition state | `IMPL-05-01~03` | `BATCH-05-01~03` | GATE-13 | PH-04 |
| 14 | PH-05 | `commit-05-b` | 实现 working memory/use/exclusion/compaction | `IMPL-05-04~06` | `BATCH-05-04~06` | GATE-14 | 05-a |
| 15 | PH-05 | `commit-05-c` | 实现 source-change consumer 与 bounded maintenance jobs | `IMPL-05-07~09` | `BATCH-05-07~09` | GATE-15 | 05-b |
| 16 | PH-06 | `commit-06-a` | 建立 provider-neutral model intent/turn/result state | `IMPL-06-01~03` | `BATCH-06-01~03` | GATE-16 | PH-05 |
| 17 | PH-06 | `commit-06-b` | 实现 model two-UoW submission 和 blocked adapter | `IMPL-06-04~06` | `BATCH-06-04~06` | GATE-17 | 06-a |
| 18 | PH-06 | `commit-06-c` | 实现 result classification/event/query safe summary | `IMPL-06-07~09` | `BATCH-06-07~09` | GATE-18 | 06-b |
| 19 | PH-07 | `commit-07-a` | 建立 action choice/guard/attempt/marker state | `IMPL-07-01~03` | `BATCH-07-01~03` | GATE-19 | PH-06 |
| 20 | PH-07 | `commit-07-b` | 实现 five-owner guard and fail-closed proposal | `IMPL-07-04~06` | `BATCH-07-04~06` | GATE-20 | 07-a |
| 21 | PH-07 | `commit-07-c` | 实现 record-before-call action submit and SM-31 | `IMPL-07-07~09` | `BATCH-07-07~09` | GATE-21 | 07-b |
| 22 | PH-08 | `commit-08-a` | 建立 delegation child boundary/budget/request state | `IMPL-08-01~03` | `BATCH-08-01~03` | GATE-22 | PH-07 |
| 23 | PH-08 | `commit-08-b` | 实现 child result once、feedback receipt/order | `IMPL-08-04~06` | `BATCH-08-04~06` | GATE-23 | 08-a |
| 24 | PH-08 | `commit-08-c` | 实现 reflection decision and feedback incorporation | `IMPL-08-07~09` | `BATCH-08-07~09` | GATE-24 | 08-b |
| 25 | PH-09 | `commit-09-a` | 建立 checkpoint candidate/prepared/fence state | `IMPL-09-01~03` | `BATCH-09-01~03` | GATE-25 | PH-08 |
| 26 | PH-09 | `commit-09-b` | 实现 matching receipt、CommitUnknown 和 recovery decision | `IMPL-09-04~06` | `BATCH-09-04~06` | GATE-26 | 09-a |
| 27 | PH-09 | `commit-09-c` | 实现 bounded continuation、resume/reconcile jobs | `IMPL-09-07~09` | `BATCH-09-07~09` | GATE-27 | 09-b |
| 28 | PH-10 | `commit-10-a` | 建立 terminal proof、unique local outcome | `IMPL-10-01~03` | `BATCH-10-01~03` | GATE-28 | PH-09 |
| 29 | PH-10 | `commit-10-b` | 建立 body-free handoff material/attempt/gap | `IMPL-10-04~06` | `BATCH-10-04~06` | GATE-29 | 10-a |
| 30 | PH-10 | `commit-10-c` | 实现 ACK consumer and bounded gap reconciliation | `IMPL-10-07~09` | `BATCH-10-07~09` | GATE-30 | 10-b |
| 31 | PH-11 | `commit-11-a` | 建立 history-only projection and rebuild query | `IMPL-11-01~03` | `BATCH-11-01~03` | GATE-31 | PH-04~10 |
| 32 | PH-11 | `commit-11-b` | 实现 inbound invalidation and immutable fact/decision events | `IMPL-11-04~06` | `BATCH-11-04~06` | GATE-32 | 11-a |
| 33 | PH-11 | `commit-11-c` | 实现 immutable outbox publisher and bounded jobs | `IMPL-11-07~09` | `BATCH-11-07~09` | GATE-33 | 11-b |
| 34 | PH-12 | `commit-12-a` | 建立 strict config roots/snapshot/slot/job validation | `IMPL-12-01~03` | `BATCH-12-01~03` | GATE-34 | PH-01~11 |
| 35 | PH-12 | `commit-12-b` | 建立 composition root and adapter/fake posture | `IMPL-12-04~06` | `BATCH-12-04~06` | GATE-35 | 12-a |
| 36 | PH-12 | `commit-12-c` | 实现 API/worker/jobs facade-only entry surfaces | `IMPL-12-07~09` | `BATCH-12-07~09` | GATE-36 | 12-b |
| 37 | PH-13 | `commit-13-a` | 建立 exact CUT/TC/EV/suite manifests and raw runners | `IMPL-13-01~03` | `BATCH-13-01~03` | GATE-37 | PH-01~12 |
| 38 | PH-13 | `commit-13-b` | 建立 nine checks, same-run reports and evidence index | `IMPL-13-04~06` | `BATCH-13-04~06` | GATE-38 | 13-a |
| 39 | PH-13 | `commit-13-c` | 建立 full local handoff and review-only acceptance drafts | `IMPL-13-07~09` | `BATCH-13-07~09` | GATE-39 | 13-b |

## 4. Boundary 开工前设计闭环

每一行 boundary 必须在实现前逐项回答；这里是总规则，annex 给出 boundary-specific 回指：

| 复核面 | 必须闭合 | 失败处理 |
|---|---|---|
| field/DTO | exact owner、字段/variant、必填性、source、validation、禁止替代 | `blocked / wait_design`，回正式 03/04/05 |
| object factory | 每个可构造状态能填满必填字段，reason/marker/ref 来源唯一 | 回 03 §6/§9；不得 private default |
| callable/Port | exact method、input/output carrier、read/write set、error mapping | 回 03 §7/§8/§12 |
| state | canonical SM、guard、illegal/stale/replay/Unknown、history mutation | 回 03 §9；不得全局 StateManager |
| transaction | expected version、idempotency、UoW order、crash window、stored result | 回 03 §10~§13/05 TX |
| event/job/query | inbox/ACK、outbox snapshot、cursor/lease、zero-write/bounded/no-repair | 回 03 §8/§10/§15 |
| config/evidence | source/profile/snapshot/activation 或 raw/report/pairing/redaction | 回 04/05/06 |
| dependency | only Core compile；other seams typed and owner-preserving | 回 global裁剪/03 §1 |
| phase boundary | 不依赖 successor 的对象/result/evidence；一个 step 只调用一个 service | 回 Step 5，重切 boundary |
| Rust source | public Rustdoc/source comments English per coding standard；正式 03 冲突需先修复 | `L2R-LANG-002` hard stop |

## 5. Commit boundary 经验复核合同

设计者在每个 boundary 选择 `设计真相源闭环与可落码性标准.md` §9.2 的适用项，并记录 `pass-designed / not_applicable / blocker`。实现者只二次校验，不负责现场补设计。至少覆盖：

- metadata/idempotency/trace/ref identity；
- validation truth、source precedence 和 body-free carrier；
- state factory/transition 和 history；
- UoW/CAS/outbox/inbox/lease/cursor；
- projection rebuild、artifact materialization、same-run pairing；
- phase boundary、owner/dependency 和 Rustdoc/naming。

任何 blocker 都必须先回写 owning source、固定新 baseline，再重审受影响 boundary。

## 6. Commit / Handoff 纪律

实现仓的 planned subject 必须是英文 `type(scope): subject`，body 按 annex 的两个协作功能组列文件名和 approximate delta，footer 与 `standards/document/实施计划书写规范.md` §11 一致。设计仓本轮不提交，所有 `committed_hash=none`。

Commit Gate 至少审查：唯一 current、前置 handoff、allowed scope、用户改动隔离、fmt/check/build/Rustdoc、非空 selector、适用 raw/report pairing、staged diff 和 message。Handoff Gate 记录 hash/message/post-status/blocker/next action/user changes/baseline；缺任何字段不能激活 successor。

## 7. 跨 boundary 审计与 Step 门禁

| 审计项 | 结论 |
|---|---|
| 39 boundary、117 IMPL、117 BATCH、39 GATE 集合 | `pass-designed`（annex 与本表必须集合相等） |
| predecessor/next 顺序 | `pass-designed`；唯一线性 current，PH-11 依赖 PH-04~10 |
| Loop Kernel 分层 | `pass`；SM-25~30 只归 PH-03，SM-31 只归 PH-07 |
| 每 boundary 三 batch、三 IMPL | `pass-designed` |
| test/AC/VF/NFR/EG 归属 | Step 7 逐 gate 绑定；当前未执行 |
| external blocker/owner boundary | `pass-designed`；无 fake/ACK/ping/readiness promotion |
| actual implementation/commit/run/evidence | `none/not_started` |

```text
step_06 = completed
next_allowed_action = rebuild_step_07_test_acceptance_gates
formal_07_write_allowed = false
implementation_ledger_write_allowed = false_until_step_13
```
