# Step 6. 拆分阶段任务、编写顺序与提交边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 6
> 回填目标：正式 `07-实施计划.md` §6

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 6 / tasks_batches_and_commit_boundaries |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | Step 7；把每个 boundary 映射到测试和验收门禁 |

## 本步输入

| 输入 | 来源 | 状态 |
|---|---|---|
| PH-01～PH-08 阶段表 | `07_implementation_plan_step_05_phases.md` | completed / stop_review |
| 实现契约/目录树 | `03-详细设计.md` §4～§16 | formal / stop_review |
| 测试切口 | `05-测试方案.md` §3/§6/§9/§13 | formal / stop_review |
| 验收门禁 | `06-验收标准.md` §5～§14 | formal / stop_review |
| 可落码性标准/台账标准 | `设计真相源闭环与可落码性标准.md`、`代码实施台账与门禁规范.md` | read |

## SOP 问题回答

| 问题 | 收口回答 | 依据 |
|---|---|---|
| 每阶段先写什么？ | 先读台账和 boundary 文档，确认 design/scope gate，再锁外部契约和测试切口，按行为增量写 domain/application/port/adapter/entry，最后跑 gate 并提交。 | 07 书写规范 §4.7 |
| 高风险逻辑如何拆？ | 状态、事务/UoW、并发/幂等、权限/安全、恢复、跨仓同步、证据均独立批次或 boundary。 | 07 SOP Step 6 |
| 何时允许提交？ | 当前 boundary 的 required checks 有真实证据、staged scope 无越界、message 合规、设计偏离已回写；当前设计阶段不执行。 | 07 台账规范 §7 |
| 经验复核怎么做？ | 设计者按 boundary 选择 §九经验项，逐项给出通过（设计层）/不适用/blocker；实现者只二次校验。 | 真相源标准 §九、07 SOP §2.10 |
| 一个 boundary 能否拆成多个提交？ | 不应拆；同一可验证增量内的协作子功能在 body 分组后保留一笔提交。 | 07 书写规范 §4.9 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 目标实现仓不存在 | 不能运行实际 checks 或记录 hash | 所有 boundary 台账预置为 planned/blocked/waiting，禁止伪造证据 |
| 正向 owner/tool contract 未闭合 | 若直接把 adapter 视作完成，会越过 Design Gate | adapter boundary 明确 blocked 条件和 forbidden workaround |
| 16 个 boundary 可能互相越界 | 后续结果被前置消费、测试重复 | 每个 boundary 明确 allowed/forbidden、输入输出和 next boundary |

## 改动前后对比

| 维度 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 任务粒度 | 只有 phase 级目标 | 16 boundary、每个含任务/批次/门禁/台账 | 可独立 review/revert |
| 提交 | 未定义 | 一 boundary 一提交，planned message | 可审查且不产生真实 commit |
| 经验复核 | 未绑定 | 每个 boundary 逐项选择设计经验 | 防止实现端补口 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 feature 一笔提交 | 简单 | boundary 过粗，无法隔离 recovery/CLI/evidence 风险 | 拒绝 |
| 每个文件一笔提交 | 易分工 | review 噪声、不可形成功能增量 | 拒绝 |
| 16 个行为 boundary，子功能在 body 分组 | 兼顾可验证、回退和 traceability | 计划较长 | 采用 |

## 结构化中间产物

### 通用编码顺序

```text
read_docs -> open_boundary -> design/scope gate
  -> lock test cut and external contract
  -> implement domain/application/port/adapter/entry slice
  -> run boundary gates
  -> update ledger and evidence refs
  -> commit (future only)
  -> handoff -> start_next_boundary
```

### PH-01 Foundation and composition

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定（未来） |
|---|---:|---|---|---|---|
| IMPL-01-01 | 1 | 校验目标仓、runtime、package manager、branch 和 git config | 03 §3/§4、SYNC-LOCAL-001~005 | bootstrap facts | 事实可追溯；缺项 blocked |
| IMPL-01-02 | 2 | 建立 feature-first 文件树和 public export boundary | 03 §4 | package/src/tests/scripts skeleton | 目录无 L0/L1 泄漏，Scope Gate 通过 |
| IMPL-01-03 | 3 | 建立 shared carrier/error/ref、ID/digest、UoW/idempotency ports | 03 §5.1/§7/§10/§12 | typed local contract | unit/contract cuts 可构造 |
| IMPL-01-04 | 4 | 建立 config loader/validator/capability composition seam | 04 §7/§9 | immutable config snapshot plan | 42-leaf/profile negative cuts |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-01-01 | package/tree/scripts skeleton | 03 §4、目录规范 | files/exports/scripts contract | 100~180 行 | GATE-01 | commit-01-a |
| BATCH-01-02 | shared carriers/errors/ref guards | 03 §7.1/§11 | typed contract + negative tests | 180~260 行 | GATE-02 | commit-01-b |
| BATCH-01-03 | config validation/profile composition | 04 §7/§9 | config tests and capability snapshot seam | 220~300 行 | GATE-02 | commit-01-b |
| BATCH-01-04 | UoW/idempotency/diagnostic ports | 03 §10/§12/§14 | ports + forbidden-effect spies | 180~280 行 | GATE-02 | commit-01-b |

#### 提交边界

| Boundary | 时机 | 包含 | 不包含 | 提交前门禁 |
|---|---|---|---|---|
| `commit-01-a` | package/toolchain facts and skeleton are reviewed | package tree、exports、scripts contract、test categories | feature behavior、runtime dependencies | GATE-01 |
| `commit-01-b` | shared contract/config seam and negative cuts are complete | carriers、errors、config、capability/UoW/idempotency ports | concrete owner/Git/fs adapters、CLI parser | GATE-02 |

### PH-02 Selection/access and metadata

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定（未来） |
|---|---:|---|---|---|---|
| IMPL-02-01 | 1 | 实现 explicit selection、operation lifecycle 和 access evaluation | 03 §5.2/§8 | CP1 local facts/services | implicit/default selection negative passes |
| IMPL-02-02 | 2 | 接入 owner access/reference ports 的 typed blocked mapping | 03 §5.2/§7 | adapter seam + fail-closed mapping | unknown/denied/stale 不放行 |
| IMPL-02-03 | 3 | 实现 binding/manifest/generation/cursor/mapping logical lifecycle | 03 §5.3/§10 | CP2 local facts | same binding/generation UoW 可验证 |
| IMPL-02-04 | 4 | 实现 migrate/rebind command 的 protected old chain | 03 §7.2/§8 | command flow + tests | 不删除旧 provenance |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-02-01 | selection/access domain and operation state | 03 §5.2/§9 | domain + fake repository cuts | 200~300 行 | GATE-03 | commit-02-a |
| BATCH-02-02 | owner access blocked/error mapping | 03 §7/§11 | adapter seam + negative contract | 120~220 行 | GATE-03 | commit-02-a |
| BATCH-02-03 | binding/manifest/generation/cursor/mapping | 03 §5.3/§10 | logical stores/UoW tests | 250~300 行 | GATE-04 | commit-02-b |
| BATCH-02-04 | migrate/rebind protected transitions | 03 §7.2/§8 | command + concurrency tests | 180~260 行 | GATE-04 | commit-02-b |

#### 提交边界

| Boundary | 时机 | 包含 | 不包含 | 提交前门禁 |
|---|---|---|---|---|
| `commit-02-a` | selection/access local contract and blocked owner mapping verified | CP1 objects/services/ports/tests | physical metadata、materialization | GATE-03 |
| `commit-02-b` | metadata logical lifecycle and protected rebind/migrate verified | CP2 stores/commands/UoW/tests | filesystem schema/driver、pull | GATE-04 |

### PH-03 Inspection and materialization

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定（未来） |
|---|---:|---|---|---|---|
| IMPL-03-01 | 1 | 建立 read-only working-copy observation/status composition | CP1/CP2、03 §7.3 | inspection/status views | Query zero-write |
| IMPL-03-02 | 2 | 实现 source delta、plan、path safety 和 run prepare | 03 §5.4/§8 | materialization intent | dirty/path/gap/unknown blocked |
| IMPL-03-03 | 3 | 接入 Git/fs typed observation/apply seams | 03 §5.7 | adapter capability mapping | raw stdout/path/body 不穿透 |
| IMPL-03-04 | 4 | 实现 clone/pull known apply→finalize UoW | 03 §8/§10 | cursor/mapping/provenance finalize | 只在 known finalized 推进 cursor |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-03-01 | observation/status read graph | 03 §7.3/§8.3 | read-only view tests | 160~240 行 | GATE-05 | commit-03-a |
| BATCH-03-02 | delta/plan/path safety | 03 §5.4/§8 | plan/policy/fault tests | 220~300 行 | GATE-06 | commit-03-b |
| BATCH-03-03 | Git/fs adapter seam | 03 §5.7、SYNC-UP-007/010 | typed blocked mapping | 150~250 行 | GATE-06 | commit-03-b |
| BATCH-03-04 | run/finalize/cursor UoW | 03 §10/§12 | finalize/replay tests | 250~300 行 | GATE-06 | commit-03-b |

#### 提交边界

| Boundary | 时机 | 包含 | 不包含 | 提交前门禁 |
|---|---|---|---|---|
| `commit-03-a` | inspection/status read graph is zero-write and complete/partial aware | observation ports、status queries、read tests | materialize effect、CLI parser | GATE-05 |
| `commit-03-b` | materialization plan/path/run and known finalize contract verified | CP3 flows、Git/fs seams、fault/UoW tests | auto merge/rebase/push/stash、physical source contract | GATE-06 |

### PH-04 Conflict/recovery and consistency

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定（未来） |
|---|---:|---|---|---|---|
| IMPL-04-01 | 1 | 实现 conflict fact、manual resolution、checkpoint carriers | 03 §5.5/§9 | CP4 durable facts | intent/effect 分离 |
| IMPL-04-02 | 2 | 实现 conflict/resume/cancel local flows | 03 §8/§11 | typed next action | 不 force retry |
| IMPL-04-03 | 3 | 实现 probe identity/result and outcome-unknown reload | 03 §7.2/§10/§12 | probe/reload contract | 不重提原 effect |
| IMPL-04-04 | 4 | 补 version/generation/lease/idempotency race guards | 03 §10/§12 | consistency cuts | stale writer rejected |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-04-01 | conflict/resolution/checkpoint facts | 03 §5.5/§9 | state/fact tests | 180~260 行 | GATE-07 | commit-04-a |
| BATCH-04-02 | resume/cancel typed transitions | 03 §8/§11 | flow/fault tests | 180~280 行 | GATE-07 | commit-04-a |
| BATCH-04-03 | probe/unknown/idempotency reload | 03 §10/§12 | duplicate/unknown tests | 240~300 行 | GATE-08 | commit-04-b |
| BATCH-04-04 | concurrency/version race guards | 03 §9/§12 | stale UoW tests | 180~260 行 | GATE-08 | commit-04-b |

#### 提交边界

| Boundary | 时机 | 包含 | 不包含 | 提交前门禁 |
|---|---|---|---|---|
| `commit-04-a` | conflict/recovery facts and local transitions are independently reviewable | CP4 facts、manual intent、checkpoint、resume/cancel | formal external probe implementation | GATE-07 |
| `commit-04-b` | unknown/probe/idempotency/concurrency cuts are complete | probe records、reload、races、exact replay tests | retry by new key、auto resolution | GATE-08 |

### PH-05 Review handoff and provenance

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定（未来） |
|---|---:|---|---|---|---|
| IMPL-05-01 | 1 | 实现 candidate eligibility/freeze 和 provenance append/protect | 03 §5.6/§10 | CP5 local facts | candidate basis/relation immutable |
| IMPL-05-02 | 2 | 实现 handoff attempt prepare-before-call 和 layered result | 03 §7/§8 | attempt/transport/probe carriers | ACK 不升格 accepted |
| IMPL-05-03 | 3 | 接入 Review/Decision/probe read seams | 03 §5.6/§7 | typed blocked/unknown mapping | owner contract unresolved stays blocked |
| IMPL-05-04 | 4 | 实现 refresh status Query/command without owner mutation | 03 §7.2/§7.3 | body-free layered status | no Gate/Decision write |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-05-01 | candidate/provenance facts | 03 §5.6/§10 | freeze/protect tests | 200~300 行 | GATE-09 | commit-05-a |
| BATCH-05-02 | attempt/transport/probe result layers | 03 §7/§8 | handoff flow tests | 220~300 行 | GATE-10 | commit-05-b |
| BATCH-05-03 | Review/Decision adapter seam | SYNC-UP-004/005 | blocked/unknown contract tests | 120~220 行 | GATE-10 | commit-05-b |
| BATCH-05-04 | refresh/status safe read | 03 §7.2/§7.3 | zero-write/forbidden-call tests | 140~220 行 | GATE-10 | commit-05-b |

#### 提交边界

| Boundary | 时机 | 包含 | 不包含 | 提交前门禁 |
|---|---|---|---|---|
| `commit-05-a` | candidate freeze and provenance protection verified | candidate/policy/provenance local contract | external handoff call | GATE-09 |
| `commit-05-b` | attempt-before-call and layered refresh contract verified | handoff attempt、Review adapter seam、probe/status tests | Gate/Decision creation、ACK=accepted | GATE-10 |

### PH-06 Query and CLI surfaces

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定（未来） |
|---|---:|---|---|---|---|
| IMPL-06-01 | 1 | 汇总 13 Query 的 read graph 和 degraded mapper | 03 §7.3/§8.3 | query handlers/views | 每个 Query zero-write |
| IMPL-06-02 | 2 | 建立 safe diagnostic summary 和 output redaction | 03 §14、04 §8 | bounded diagnostic surface | no raw secret/body/path/Git output |
| IMPL-06-03 | 3 | 实现 parser-neutral CLI entry/presentation | 03 §4/§7 | clone/pull/status/push-review routes | explicit selection and safe disposition |
| IMPL-06-04 | 4 | 绑定 CLI entry 到 configured runtime | 04 §9、SYNC-LOCAL-003/004 | composition entry tests | unresolved parser/bin stays waiting |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-06-01 | 13 Query handlers and views | 03 §7.3/§8.3 | query zero-write tests | 260~300 行，必要时拆分 | GATE-11 | commit-06-a |
| BATCH-06-02 | diagnostic/redaction surface | 03 §14、04 §8 | forbidden-output tests | 160~240 行 | GATE-11 | commit-06-a |
| BATCH-06-03 | CLI routes/presenter | 03 §4/§7 | entry negative tests | 220~300 行 | GATE-12 | commit-06-b |
| BATCH-06-04 | runtime composition binding | 04 §9 | composition tests | 150~220 行 | GATE-12 | commit-06-b |

#### 提交边界

| Boundary | 时机 | 包含 | 不包含 | 提交前门禁 |
|---|---|---|---|---|
| `commit-06-a` | all Query/read diagnostics pass zero-write/redaction cuts | 13 Query、views、diagnostic tests | CLI parser/bin and mutation implementation | GATE-11 |
| `commit-06-b` | parser-neutral CLI routes and composition entry are safe | CLI entries/presenter/composition tests | package manager/bin assumptions not yet confirmed | GATE-12 |

### PH-07 Consumers, jobs and operations

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定（未来） |
|---|---:|---|---|---|---|
| IMPL-07-01 | 1 | 实现 3 Consumer envelope validation/quarantine/receipt | 03 §7.4、05 §6 | conservative local transitions | no raw payload/auto action |
| IMPL-07-02 | 2 | 实现 3 Job bounded input/item results/replay | 03 §7.4、05 §6 | typed job result | no repair/migrate/rebind/delete |
| IMPL-07-03 | 3 | 接入 diagnostics/telemetry best-effort isolation | 03 §14、04 §11 | closed signals | sink failure does not change result |
| IMPL-07-04 | 4 | 绑定 operations evidence/report hooks | 05 §13、06 §10 | planned evidence references | no static evidence or readiness |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-07-01 | Consumer envelope/receipt/quarantine | 03 §7.4 | consumer tests | 180~260 行 | GATE-13 | commit-07-a |
| BATCH-07-02 | Job item result/exact replay | 03 §7.4/§10 | job/idempotency tests | 220~300 行 | GATE-13 | commit-07-a |
| BATCH-07-03 | diagnostics/telemetry isolation | 03 §14 | redaction/sink tests | 140~220 行 | GATE-14 | commit-07-b |
| BATCH-07-04 | evidence/report hook contract | 05 §13、06 §10 | link/schema checks | 160~240 行 | GATE-14 | commit-07-b |

#### 提交边界

| Boundary | 时机 | 包含 | 不包含 | 提交前门禁 |
|---|---|---|---|---|
| `commit-07-a` | Consumer/Job local contract and replay tests are complete | 3 Consumer、3 Job、receipt/result stores | private topic/scheduler、truth repair | GATE-13 |
| `commit-07-b` | closed telemetry/redaction and evidence hook contract is reviewable | diagnostics、report hook、redaction/link tests | actual report/evidence instances | GATE-14 |

### PH-08 Gates, reports and acceptance handoff

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | 输出 | 完成判定（未来） |
|---|---:|---|---|---|---|
| IMPL-08-01 | 1 | 实现 gate script parameter contract and suite orchestration | 05 §9 | scripts/gates contract | supports run-id/artifact-root/profile |
| IMPL-08-02 | 2 | 实现 artifact/report index and redaction/link checks | 05 §13、目录规范 §9/§10 | reports/runs outputs | fixed run pairing and no latest |
| IMPL-08-03 | 3 | 生成 acceptance handoff/veto/risk templates | 06 §10～§14 | reports/acceptance templates | human review required |
| IMPL-08-04 | 4 | 执行 03/05/06/07 cross-boundary closure audit | 真相源标准 §九、06 §15 | audit record and blockers | unresolved blocker prevents handoff |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-08-01 | gate/check script capability | 05 §9 | script help/negative checks | 160~240 行 | GATE-15 | commit-08-a |
| BATCH-08-02 | minimal evidence index/report shell | 05 §13 | fixed-run report links | 180~260 行 | GATE-15 | commit-08-a |
| BATCH-08-03 | acceptance handoff/veto/risk templates | 06 §10～§14 | reviewable templates | 140~220 行 | GATE-16 | commit-08-b |
| BATCH-08-04 | cross-document audit and handoff | 03/05/06/07 | audit ledger | 160~240 行 | GATE-16 | commit-08-b |

#### 提交边界

| Boundary | 时机 | 包含 | 不包含 | 提交前门禁 |
|---|---|---|---|---|
| `commit-08-a` | scripts and minimal evidence index can be run against a fixed future run shape | gates/reports/checks contract、artifact/report link checks | final EV pages, verdict, signoff, readiness | GATE-15 |
| `commit-08-b` | acceptance templates and 03/05/06/07 audit are reviewed | handoff/veto/risk templates、closure audit | fabricated run/result or approval | GATE-16 |

### Boundary Gate Matrix（设计计划口径）

| Boundary | Design Gate | Scope Gate | Build Gate | Test Gate | Evidence Gate | Commit Gate | Handoff Gate |
|---|---|---|---|---|---|---|---|
| commit-01-a | 03 §3/§4、local choices known | package/scripts only | runtime check | skeleton/static | N/A or planned | staged scope/message | ledger + next boundary |
| commit-01-b | carrier/config closure | shared contracts only | typecheck | protocol/config negative | planned index | staged scope/message | baseline/blocker |
| commit-02-a | CP1 closure | selection/access only | typecheck | TC-MOD-001/state | planned | scope/message | CP2 next |
| commit-02-b | CP2 logical closure | metadata only | typecheck | TC-MOD-002/UoW | physical blocked | scope/message | PH-03 |
| commit-03-a | read graph closure | observation/query only | typecheck | Query zero-write | planned | scope/message | CP3 next |
| commit-03-b | source/path/UoW closure | materialization only | typecheck | TC-MOD-003/fault | external blocked | scope/message | PH-04 |
| commit-04-a | conflict state closure | recovery facts only | typecheck | state cuts | planned | scope/message | probe next |
| commit-04-b | unknown/idempotency closure | probe/consistency only | typecheck | consistency/idempotency | planned | scope/message | PH-05 |
| commit-05-a | candidate/provenance closure | candidate only | typecheck | handoff local | planned | scope/message | attempt next |
| commit-05-b | attempt/Decision layer closure | handoff only | typecheck | transport/probe | owner blocked | scope/message | PH-06 |
| commit-06-a | query/redaction closure | read surface only | typecheck | 13 Query zero-write | planned | scope/message | CLI next |
| commit-06-b | CLI/composition closure | entry surface only | typecheck | entry negative | parser waiting | scope/message | PH-07 |
| commit-07-a | consumer/job closure | operations only | typecheck | receipt/replay | source blocked | scope/message | ops next |
| commit-07-b | telemetry/evidence closure | diagnostics/hooks only | typecheck | redaction/link | planned | scope/message | PH-08 |
| commit-08-a | script/report closure | gates/reports/checks only | script lint | fixed-run shape | minimal shell | scope/message | handoff next |
| commit-08-b | acceptance/audit closure | handoff/audit only | script lint | report audit | human review required | scope/message | final handoff |

### 16 个 boundary 实施台账入口

| Boundary | Ledger file | Allowed scope | Forbidden scope | Required checks | 当前状态 |
|---|---|---|---|---|---|
| commit-01-a | `implementation-boundaries/commit-01-a.md` | package/tree/scripts skeleton | feature behavior, lock/install | design/scope/worktree/static | blocked |
| commit-01-b | `implementation-boundaries/commit-01-b.md` | shared carriers/config/ports | concrete adapters/CLI parser | type/contract/config | planned |
| commit-02-a | `implementation-boundaries/commit-02-a.md` | selection/access | metadata/materialization | domain/state/negative | planned |
| commit-02-b | `implementation-boundaries/commit-02-b.md` | binding/metadata logical | physical schema/delete | UoW/generation | planned |
| commit-03-a | `implementation-boundaries/commit-03-a.md` | observation/query read graph | mutation/effect | query-zero-write | planned |
| commit-03-b | `implementation-boundaries/commit-03-b.md` | materialization plan/run | auto Git actions | path/dirty/fault/UoW | planned |
| commit-04-a | `implementation-boundaries/commit-04-a.md` | conflict/recovery facts | external probe call | state/intent | planned |
| commit-04-b | `implementation-boundaries/commit-04-b.md` | probe/unknown/idempotency | blind replay/new key | consistency/replay | planned |
| commit-05-a | `implementation-boundaries/commit-05-a.md` | candidate/provenance | external submit | freeze/provenance | planned |
| commit-05-b | `implementation-boundaries/commit-05-b.md` | handoff attempt/status | Gate/Decision mutation | layered handoff | planned |
| commit-06-a | `implementation-boundaries/commit-06-a.md` | Query/diagnostic | write/lock/probe | 13 zero-write/redaction | planned |
| commit-06-b | `implementation-boundaries/commit-06-b.md` | CLI routes/presentation | parser assumptions | entry negative | planned |
| commit-07-a | `implementation-boundaries/commit-07-a.md` | consumers/jobs | repair/scheduler truth | receipt/replay | planned |
| commit-07-b | `implementation-boundaries/commit-07-b.md` | telemetry/evidence hooks | raw output/readiness | redaction/link | planned |
| commit-08-a | `implementation-boundaries/commit-08-a.md` | gate/report scripts | final verdict | fixed-run/index | planned |
| commit-08-b | `implementation-boundaries/commit-08-b.md` | acceptance templates/audit | fabricated evidence/signoff | handoff/audit | planned |

### 开工前设计闭环复核模板（每个 boundary 必填）

| 复核项 | 检查内容 | 失败处理 |
|---|---|---|
| 字段闭环 | 当前增量的字段均有 03/04 正式来源 | `blocked / wait_design` |
| DTO 构造闭环 | 输入 carrier 能构造目标 object/view/result/receipt | `blocked / wait_design` |
| 状态闭环 | 使用 03 exact state subject/value/transition helper | 回写 03/05/06/07 |
| ref identity | typed ref/key/generation/context 来源明确 | `blocked / wait_design` |
| validation truth | 校验经正式 port/truth source，不扫描 fake/map 猜测 | `blocked / wait_design` |
| metadata/idempotency | authority、digest、result carrier、UoW 同边界可见 | `blocked / wait_design` |
| projection rebuild | 若有 projection，必须有 committed source；Sync owned projection 之外标 not_applicable | 调整 boundary/回写设计 |
| artifact materialization | 若生成 artifact/report，路径/runner/source 明确；否则 not_applicable | `blocked / wait_design` |
| phase boundary | 不依赖后续对象/结果/证据 | 调整 phase/boundary |

### Boundary 经验复核总表

| Boundary | 涉及设计面 | 适用经验项 | 不适用理由 | 证据位置 | 结论/处理 |
|---|---|---|---|---|---|
| commit-01-a | package/config/test/evidence | runtime/package identity、script path、artifact root | state/persistence/outbox 不在 skeleton | 03 §3/§4、05 §9、目录规范 | blocker：local choices/repo absent |
| commit-01-b | DTO/error/config/UoW/idempotency | DTO 二级类型、validation truth、idempotency carrier | projection rebuild/materialize 不在本 boundary | 03 §7/§10/§12、04 §7/§9 | blocker：baseline/toolchain 未锁 |
| commit-02-a | command/state/access | ref identity、state carrier、permission truth | report generation 不适用 | 03 §5.2/§9/§11 | blocker：owner contract |
| commit-02-b | metadata/persistence/UoW | metadata authority、generation、atomic visibility | CLI/event publisher 不适用 | 03 §5.3/§10 | blocker：physical schema |
| commit-03-a | query/projection/read-only | query zero-write、view completeness、availability marker | materialization effect 不适用 | 03 §7.3/§8.3、06 §8 | 设计层通过；实现仍 waiting |
| commit-03-b | state/persistence/tool/materialization | artifact location、path safety、UoW/finalize、unknown | outbound event/outbox 不适用（Outbound=0） | 03 §5.4/§8/§10 | blocker：source/Git/fs/comparator |
| commit-04-a | state/recovery/persistence | same-layer transition、checkpoint carrier、manual intent | external handoff/report 不适用 | 03 §5.5/§9/§11 | 设计层通过；probe dependency pending |
| commit-04-b | idempotency/concurrency/unknown | identity/digest/exact replay、commit unknown reload | projection rebuild/outbox 不适用 | 03 §10/§12 | blocker：probe/effect equivalence |
| commit-05-a | candidate/provenance/state | append/protect/supersede、candidate freeze | Query-only boundary 不适用 | 03 §5.6/§10 | 设计层通过；owner refs pending |
| commit-05-b | handoff/protocol/evidence | attempt-before-effect、layered result、public carrier | local metadata migration 不适用 | 03 §7/§8、06 §7/§11 | blocker：Governance contract |
| commit-06-a | query/diagnostic/redaction | zero-write, safe output, sink isolation | external apply/job scheduler 不适用 | 03 §7.3/§14、04 §8 | 设计层通过；runner pending |
| commit-06-b | CLI/config/entry | explicit selection、safe presentation、tool boundary | durable state carrier 不新增 | 03 §4/§7、04 §9 | blocker：parser/bin/runtime |
| commit-07-a | consumer/job/idempotency | public job schema、receipt、item replay、invalidation | outbound event 不适用 | 03 §7.4/§10、05 §6 | blocker：event/scheduler |
| commit-07-b | observability/evidence | closed signal、redaction、report link | truth mutation 不适用 | 03 §14、05 §13、06 §10 | 设计层通过；no real evidence |
| commit-08-a | scripts/evidence/report | artifact/report pairing、fixed run、minimal index shell | domain transition 不适用 | 05 §9/§13、目录规范 | blocker：target runner absent |
| commit-08-b | acceptance/audit/handoff | AC/VETO trace、evidence ceiling、human review | code implementation 不适用 | 06 §10～§14 | blocked until real run/review |

### Boundary 停审记录

| Boundary | 一句话描述 | 独立 review/验证/回退 | 结论 |
|---|---|---|---|
| commit-01-a～commit-08-b | 每个 boundary 形成一个可验证功能/风险增量 | 是（计划层） | all planned; current implementation handoff blocked |

### 跨 boundary 粒度/依赖/门禁审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 一 boundary 一提交 | pass (plan) | 未产生真实提交 |
| boundary 不按文件/struct 拆 | pass (plan) | 文件仅作为 allowed scope |
| 依赖顺序 | pass (plan) | serial PH-01→PH-08 |
| 测试门禁 | pass (plan) | Step 7 继续细化 GATE-01～16 |
| 经验复核 | pass (design mapping) | affected positive boundaries remain blocked |
| 台账预创建 | required | Step 13 创建全部 skeleton；当前尚未创建 |

## 回填草稿

正式 §6 将回填 8 个 phase 的任务表、代码批次、提交边界、Boundary Gate Matrix、台账入口、开工闭环复核、经验复核和跨 boundary 审计；不填写真实执行结果或 commit hash。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| commit-01-a 的 runtime/package 选择 | 全部实现命令和脚本 | PH-01 开工前 |
| physical metadata/source/Git/review contracts | commit-02-b/03-b/05-b | 各 boundary 开工前 |
| evidence report maturity | commit-08-a/b | PH-08 开工前 |

## 进入下一步条件

- [x] 16 boundary 均有一句话边界、包含/不包含、批次和门禁。
- [x] 每个 boundary 有台账入口和经验复核口径。
- [x] 跨 boundary 依赖、粒度和门禁审计完成。
