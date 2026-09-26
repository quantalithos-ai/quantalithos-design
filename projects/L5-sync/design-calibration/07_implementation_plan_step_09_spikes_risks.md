# Step 9. 定义 Spike、风险与待确认事项

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 9
> 回填目标：正式 `07-实施计划.md` §9

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 9 / spikes_risks_and_open_questions |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | Step 10；定义暂停、回退和变更控制 |

## 本步输入

| 输入 | 来源 | 状态 |
|---|---|---|
| 上游 blocker/risk | 00～06、project ledger | active |
| phase/boundary 顺序 | Step 5/6 | completed / stop_review |
| 依赖准备表 | Step 8 | completed / stop_review |
| 设计风险登记 | `03-详细设计.md` §17、`04-配置设计.md` §14、`05-测试方案.md` §14、`06-验收标准.md` §13 | formal / stop_review |

## SOP 问题回答

| 问题 | 收口回答 | 依据 |
|---|---|---|
| 哪些点必须先 Spike？ | package/toolchain、SDK surface、metadata physical semantics、comparator/Git/fs、Review effect equivalence、CLI/runner/evidence tooling。 | 03 §17、04 §13、05 §14 |
| 哪些风险会阻塞 phase？ | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005`、target repo absent、无 approved baseline、字段/DTO/state/metadata/idempotency 闭环缺口。 | 03/06 blocker map |
| Spike 输出是什么？ | 可引用的 decision matrix、contract fixture/negative result、设计回写或明确不适用结论；不是代码实现或测试通过。 | 07 SOP Step 9 |
| 截止点如何固定？ | 绑定到 boundary 开工前；超时即 `blocked/wait_design`，不允许无限探索。 | 07 规范 §5.9 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 上游 blocker 数量多 | 风险表若只写“待确认”会失去可执行性 | 每项绑定 boundary、owner、输出和截止点 |
| 工具选择不确定 | 可能提前写错命令和 package | Spike 只产出选择矩阵，不产出伪造实现 |
| 正向 integration 未闭合 | 可能误把 controlled fake 当真实能力 | Spike 结果必须标 capability ceiling |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 不确定性 | 分散在上游文档 | 集中为 SP/Risk/Open 表 | 可按 boundary 恢复 |
| 截止点 | 未固定 | 每项有 phase/boundary cutoff | 防止长期悬空 |
| 处理方式 | 可能临时猜测 | blocked/wait_design 或 deferred/future trigger | 保持 truth boundary |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把所有未知放到最终风险章节 | 文档短 | 开工时仍不知道先解决什么 | 拒绝 |
| 为每个未知单独创建代码 Spike | 可能快速发现问题 | 当前未授权实现，容易污染设计仓 | 拒绝 |
| 设计阶段定义 Spike 输出和截止点，实际 Spike 作为未来 boundary 前置活动 | 可审计，不伪造实现 | 需要维护表 | 采用 |

## 结构化中间产物

### Spike 表

| 编号 | Spike | 影响阶段/boundary | 必须输出 | 截止点 | 未完成处理 |
|---|---|---|---|---|---|
| `SP-SYNC-001` | Node/runtime/package/parser/runner 选择 | PH-01 / 01-a | local choice matrix、命令和 lock policy | 01-a 开工前 | `SYNC-LOCAL-001~005` blocker |
| `SP-SYNC-002` | SDK project/version/source/workspace/review typed surface | PH-01～05 / 01-b、02-a、03-b、05-b | method/DTO/error/version compatibility matrix | 01-b 前；各 adapter 前复核 | `SYNC-UP-001` blocker |
| `SP-SYNC-003` | `.qs-sync` physical store/schema/migration/crash/retention | PH-02～04 / 02-b | physical carrier and atomicity decision | 02-b 前 | `SYNC-UP-006` blocker |
| `SP-SYNC-004` | source comparator/cursor/gap/replay compatibility | PH-03/04 / 03-b、04-b | comparator/source authority matrix | 03-b 前 | `SYNC-UP-002/008` blocker |
| `SP-SYNC-005` | Git/filesystem support and dirty/path/symlink behavior | PH-03/06 / 03-b、06-b | tool capability matrix and fixture set | 03-b 前 | `SYNC-UP-007/010` blocker |
| `SP-SYNC-006` | Review handoff effect equivalence/ACK/probe/Decision | PH-05 / 05-b | prepare/call/probe/finalize contract matrix | 05-b 前 | `SYNC-UP-004/005` blocker |
| `SP-SYNC-007` | event source/topic/order and job runner ownership | PH-07 / 07-a | consumer/job registration matrix | 07-a 前 | `SYNC-LOCAL-004`/upstream blocker |
| `SP-SYNC-008` | gate/report/evidence generator ownership and schema | PH-08 / 08-a/b | script interface + report maturity matrix | 08-a 前 | evidence handoff blocked |
| `SP-SYNC-009` | 03/05/06/07 cross-boundary closure audit | all | signed design audit record with blockers/baseline | implementation handoff | no implementation handoff |

### 风险表

| 风险 ID | 等级 | 描述 | 影响 boundary | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| `R-SYNC-001` | blocking | SDK owner surface/API/error/version unknown | 01-b、02-a、03-b、05-b | typed port only; Spike 002;回写 03 | 对应 adapter 开工前 |
| `R-SYNC-002` | blocking | source authority/comparator/gap unknown | 03-b、04-b | keep Gap/Unknown/Unsupported; Spike 004 | 03-b 前 |
| `R-SYNC-003` | blocking | permission/posture/archived action matrix unknown | 02-a、05-b | fail-closed; no local auth | 02-a 前 |
| `R-SYNC-004` | blocking | Review ACK/probe/Decision/effect equivalence unknown | 05-b | attempt-before-call; no resubmit | 05-b 前 |
| `R-SYNC-005` | blocking | physical metadata schema/atomicity/crash semantics unknown | 02-b～04-b | logical-only; no repair/delete | 02-b 前 |
| `R-SYNC-006` | blocking | dirty/path/symlink/lock and manual resolution contract incomplete | 03-b/04-a/06-b | non-overwrite/manual required | 03-b 前 |
| `R-SYNC-007` | high | Node/package/parser/runner/Git library choice unknown | 01-a、06-b、08-a | no install/lock/command claim | 01-a 前 |
| `R-SYNC-008` | high | event source/topic/order/scheduler unknown | 07-a | bounded handlers/jobs only | 07-a 前 |
| `R-SYNC-009` | high | target implementation repo absent | all | create only after explicit implementation handoff | PH-01 |
| `R-SYNC-010` | blocking | no approved design baseline hash | all | ledger blocked; user/design owner fixes | before handoff |
| `R-SYNC-011` | high | Query visibility/index/degraded mapper lacks real adapter | 03-a/06-a | typed missing/not-visible/partial; no fabricated views | 03-a |
| `R-SYNC-012` | high | report/evidence schema and reviewer ownership unknown | 07-b/08-a/b | script capability/minimal shell only | 08-a |
| `R-SYNC-013` | medium | LFS/shallow/GUI/Tauri support not decided | out-of-scope | historical/future trigger; no capability | scope review |
| `R-SYNC-014` | informational | local commit/ACK/job report may be misread as truth/evidence | all | repeat redline in gate/handoff docs | every boundary |

### 待确认事项表

| Open ID | 需要确认 | 责任方 | 影响 | 截止点 | 未确认前口径 |
|---|---|---|---|---|---|
| `SYNC-OPEN-019` | implementation repo creation/branch/identity | implementation owner/user | PH-01 | 01-a |
| `SYNC-OPEN-020` | approved design baseline hash | design owner/user | all Design Gates | handoff |
| `SYNC-OPEN-021` | TypeScript runtime/package/parser/runner | L5-sync owner | PH-01/06 | 01-a |
| `SYNC-OPEN-022` | physical metadata owner/schema | L5-sync/architecture owner | PH-02～04 | 02-b |
| `SYNC-OPEN-023` | source comparator and authority | Artifact/Workspace/SDK owner | PH-03/04 | 03-b |
| `SYNC-OPEN-024` | Git/fs support matrix | L5-sync/tool owner | PH-03/06 | 03-b |
| `SYNC-OPEN-025` | Review effect/probe/Decision contract | Governance/SDK owner | PH-05 | 05-b |
| `SYNC-OPEN-026` | event and job ownership | bus/ops owner | PH-07 | 07-a |
| `SYNC-OPEN-027` | evidence/report reviewer | test/acceptance owner | PH-08 | 08-b |

### 风险关闭规则

- Spike 未产生明确 decision/contract matrix 时，相关 boundary 保持 `blocked`，不得改为 `planned` 以外的可实施状态。
- 风险若改变字段、DTO、状态、配置、truth owner、协议或 evidence source，必须回写 03/04/05/06，再刷新 07 baseline。
- `R-SYNC-013` 只有在明确 scope trigger 后才升级；不得借实施计划默认启用历史工具选择。
- 当前没有已接受风险实例；“有条件通过”只属于未来 06 真实送验结论，不属于当前实施计划。

## 回填草稿

正式 §9 将回填 Spike、风险、待确认项、截止点和未确认前姿态；每项均绑定 phase/boundary 和处理动作，不使用“后续再确认”作为完成条件。

## 进入下一步条件

- [x] Spike 均有输出和截止点。
- [x] 风险均绑定 phase/boundary 和处理方式。
- [x] 长期 blocker、deferred/future 与当前可验证 local contract 已分层。
