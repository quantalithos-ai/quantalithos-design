# Step 18. 风险与待确认事项

> 本文件是 `03-详细设计` Step 18 中间产物，对应 `详细设计讨论流程_SOP.md` Step 18 与 `详细设计书写规范.md` §5.17。
> 本步登记未关闭事实、影响和保守处置，不把风险写成实现契约；Step 19 只能引用本文件已明确的风险边界。

## 1. Step 状态与门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | `18 / risks_open_questions` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 正式 `03-详细设计.md` | 尚未装配；Step 19 才允许 full-restart 重建 |
| 实现仓 | `/home/aris/Projects/quantalithos-sync` = `absent / not_created` |
| 实现台账 / boundary skeleton | `not_created`；只能在正式 07 |
| 运行、测试、artifact、report、evidence、verdict、signoff、readiness | 均未创建、未执行、未声称 |
| 下一动作 | `complete_step_19_formal_document_assembly` |

本步的 `completed` 只表示风险登记完成；不表示 blocker 已关闭、设计已可实现、上游已可用或交付已就绪。`SYNC-UP-001~010` 和 `SYNC-LOCAL-001~005` 全部继续保持原状态。

## 2. 本步输入与 SOP 问题回答

### 2.1 输入

| 输入 | 用途 |
|---|---|
| Step 1～17 calibration | 继承上游边界、模块/对象/port/协议/flow/state、持久化、错误、并发、配置、观测、测试和实施承接风险。 |
| `project_execution_ledger.md` | 唯一项目级 blocker、恢复点和授权来源。 |
| 专项上游正式文档与必要台账 | 确认 owner 边界仍是 runtime collaboration，未把外部真相复制到 Sync。 |
| 详细设计/实施计划/真相源标准 | 确认风险必须写影响、责任方和未确认前姿态；不得交给实现者猜测。 |

### 2.2 SOP 问题回答

1. **哪些问题会影响代码实现？**
   上游 SDK/source/access/review/probe 合同、`.qs-sync` 物理 schema 与迁移、cursor comparator、dirty/path protection、package/runtime/CLI/test/Git library 选择、以及下游 05/06/07 尚未建立的测试/验收/phase boundary 都会影响实现边界。它们必须在相应 owner 或后续文档确认前保持 blocked/pending。
2. **哪些问题是实现阻塞，哪些只影响优化？**
   能改变 truth ownership、DTO 字段、状态迁移、effect equivalence、UoW 原子性、权限/来源/路径安全或提交边界的事项是 `blocking`；LFS、浅克隆、GUI/Tauri、性能数字和具体 scheduler 属于 `deferred/unsupported/pending`，当前不进入 P0 实现。
3. **谁负责确认？**
   外部合同由对应 owner（L0-sdk、L1-work、L1-artifact、L1-workspace、L1-governance、L4-archive、L4-observability）与全局架构/依赖维护者确认；本地栈选择由 L5-sync 设计维护者在 04/07 依据仓库事实确认；phase/commit/test/acceptance 映射由正式 05/06/07 负责，但必须回指本文件。
4. **未确认前如何处理？**
   只允许 typed `blocked`、`unsupported`、`needs_action`、`unknown`、`probe_required`、`quarantined` 或 `not_applicable`；不允许默认 allow/latest、空成功、自动 repair、自动 merge/rebase/push、替换 idempotency key、伪造 provenance 或把 ACK 当 accepted。

## 3. 风险登记总览

风险等级定义：

- `blocking`：会阻止相应能力进入实现 boundary；必须先回写真相源或明确 blocked seam。
- `high`：不一定阻止全部实现，但会阻止正向路径、真实 adapter 或交付门禁。
- `medium`：影响后续优化/运营；当前可保守不实现。
- `informational`：只需在正式文档中保持边界声明。

| 风险 ID | 等级 | 风险主题 | 影响范围 | 当前状态 |
|---|---|---|---|---|
| `SYNC-RISK-001` | blocking | L0-sdk 的 project/version/source/workspace/review surface、版本、错误和 capability 未逐项核验 | 所有 SDK adapter、selection/source/handoff DTO、真实集成 | `SYNC-UP-001 pending/blocked` |
| `SYNC-RISK-002` | blocking | Artifact 与 Workspace 的 materialization source、版本水位、增量 comparator 和优先级未统一 | clone/pull、SourceDelta、CursorState、MappingSet | `SYNC-UP-002 pending/blocked` |
| `SYNC-RISK-003` | blocking | L1-work 权限、ProjectMember 与 archived/dissolved/retired posture/action matrix 未闭合 | access evaluation、pre-call revalidation、归档姿态 | `SYNC-UP-003 pending/blocked` |
| `SYNC-RISK-004` | blocking | Governance handoff、ACK、probe、Decision ref/state 合同未闭合 | PushReviewCandidate、RefreshReviewHandoffStatus、HandoffAttempt | `SYNC-UP-004 pending/blocked` |
| `SYNC-RISK-005` | blocking | effect unknown、幂等 key、request digest、probe 与重试等价关系未闭合 | all external effects、duplicate replay、recovery | `SYNC-UP-005 pending/blocked` |
| `SYNC-RISK-006` | blocking | `.qs-sync` 目录/schema/migration/retention/recovery/atomicity 未闭合 | MetadataManifest、UoW、repositories、migration/rebind | `SYNC-UP-006 pending/blocked` |
| `SYNC-RISK-007` | high | Git remote、branch/object/source 与 local materialization 关系未闭合 | Git adapter、candidate basis、provenance | `SYNC-UP-007 pending/blocked` |
| `SYNC-RISK-008` | blocking | cursor/mapping comparator、gap/replay、跨版本兼容未闭合 | PullWorkingCopy、SourceDelta、CursorState | `SYNC-UP-008 pending/blocked` |
| `SYNC-RISK-009` | medium | Git LFS、浅克隆、GUI/Tauri 等历史选择没有当前支持矩阵 | optional tooling/performance/UX | `SYNC-UP-009 pending/blocked` |
| `SYNC-RISK-010` | blocking | dirty/untracked/path/symlink/lock 与人工冲突决策合同需进一步核验 | FilesystemApply、PathChangeSet、Conflict/Resume | `SYNC-UP-010 pending/blocked` |
| `SYNC-RISK-011` | blocking | Node runtime、package manager、package/bin 名、parser/validator/test runner/Git library 未确认 | package root、CLI、scripts、test source、dependency syntax | `SYNC-LOCAL-001~005 local_pending` |
| `SYNC-RISK-012` | blocking | 正式 05/06/07 尚未按本轮设计重建 | test/acceptance/phase/commit/evidence mapping | downstream `not_started/blocked` |
| `SYNC-RISK-013` | high | 目标实现仓不存在且 git identity/branch/config 无法确认 | implementation bootstrap、commit gate、真实 adapter | `absent / not_created` |
| `SYNC-RISK-014` | blocking | 物理 persistence driver、transaction/crash semantics 未验证 | UoW、commit ambiguity、atomic visibility | inherits `SYNC-UP-006` |
| `SYNC-RISK-015` | high | positive external adapters 只能由 `unknown` SDK surface 映射，不能证明 integration | SDK/source/handoff/probe contract tests | `planned/blocked` |
| `SYNC-RISK-016` | high | Query public view 的 visibility resolver/index lookup 依赖尚未全部核验 | 13 Query response/page/marker | `planned; owner resolver pending` |
| `SYNC-RISK-017` | high | Consumer event source/order/schema/topic 未闭合 | 3 Consumers、receipt/quarantine | `planned/blocked` |
| `SYNC-RISK-018` | medium | Job scheduler/trigger/operational ownership 未选择 | 3 Jobs、run cadence、deployment | `not_selected` |
| `SYNC-RISK-019` | high | telemetry sink/diagnostics adapter 尚无真实产品合同 | signal delivery、diagnostic summary | `planned; sink failure isolated` |
| `SYNC-RISK-020` | blocking | phase boundary 目前只有设计输入清单，没有正式 07 的 boundary IDs/ledgers | implementation handoff、Commit/Handoff Gate | `not_assigned` |
| `SYNC-RISK-021` | informational | Sync 不拥有 Workspace projection rebuild 或 Artifact/evidence materialization | 防止错误扩展 scope | `not_applicable`（必须保持） |
| `SYNC-RISK-022` | informational | 本地 Git commit、上传 ACK、telemetry、job report 容易被下游误读为 accepted/evidence/readiness | review/acceptance communication | 需在 03/05/06/07 重复红线 |

## 4. 风险缓解与未确认前姿态

| 风险族 | 缓解措施（当前允许） | 未确认前禁止 | 解除条件 |
|---|---|---|---|
| SDK/owner 合同（001/003） | 只定义 capability port、safe snapshot、typed blocked/unknown；保存 context/ref，不保存正文 | 猜 endpoint/method/DTO/error；本地授权或 owner cache 代替 | owner 正式文档、SDK surface、版本兼容和错误映射逐项核验，并回写 Step 1/7/8/14 |
| source/comparator（002/008） | 保留 `SourceDelta` 的 Gap/Unsupported/Unknown；applied cursor 不前进 | 以空数组、时间、Git commit、arrival order 推断 NoOp/continuous；自动 full/replay | Artifact/Workspace source authority、cursor comparator、gap/replay contract 固定 |
| review/probe（004/005） | durable prepare→call→probe/finalize；分离 transport/external Decision 层 | ACK=accepted、timeout=failed/zero-effect、换 key 重提、自动 retry | Governance handoff/Decision/probe/idempotency/equivalence contract 固定 |
| metadata/transaction（006） | logical manifest、generation、append-only provenance、typed integrity degradation | 锁定文件名/表名、silent migration/delete、half-visible cursor/mapping | physical schema、migration、UoW/crash/retention contract 固定并进入 04/07 |
| Git/filesystem/dirty（007/010） | root-bound read-only observe、non-overwrite path guard、显式 manual resolution | remote push、merge/rebase/stash、覆盖 dirty/untracked、自动冲突选择 | local tool contract、path/symlink/lock semantics、manual resolution scope 固定 |
| local stack（LOCAL-001~005） | 使用 Node-compatible/ESM/strict planned wording；不写 install/test command | 猜 Node/package/bin/parser/runner/Git library、写 lockfile或 package manifest | 04/07 基于目标仓和依赖事实完成选择，并回写 Step 3/4/14 |
| downstream delivery（012/020） | Step 17 提供闭环表、boundary 输入/排除和 07 重审要求 | 在 03 伪造 phase/commit/evidence/AC/EV 或 implementation ledger | 05/06/07 正式校准完成，逐 boundary 审计通过并固定 design baseline |
| observability（019/022） | closed schema、redaction、best-effort sink、durable local refs 分离 | 用日志/span/job report证明业务成功、review accepted或readiness | observability owner 合同与 06 evidence boundary 明确 |

## 5. 待确认事项表

| 事项 ID | 当前影响 | 需要谁确认 | 未确认前处理方式 | 关联风险 |
|---|---|---|---|---|
| `SYNC-OPEN-001` | L0-sdk 是否提供 typed project/version/source/workspace/review handoff 方法、错误、版本和 capability matrix 未知 | L0-sdk owner + 全局 SDK 维护者 | 只使用 `OwnerAccessPort`/`MaterialSourcePort`/`ReviewHandoffPort`/`ReviewDecisionReadPort`，positive adapter blocked | 001/015 |
| `SYNC-OPEN-002` | Materialization source 与 source version/cursor 的权威 owner 未知 | L1-artifact、L1-workspace owner | clone/pull 只允许 blocked/unsupported/gap；不猜来源优先级 | 002/008 |
| `SYNC-OPEN-003` | project selection 的 permission/posture 与 archived action matrix 未知 | L1-work owner + Governance 相关 owner | fail-closed；不在 Sync 本地授权 | 003 |
| `SYNC-OPEN-004` | Review Gate candidate upload、ACK、external handoff ref、Decision read/probe 未知 | L1-governance owner | transport/external layers 分开；不报告 accepted | 004/005 |
| `SYNC-OPEN-005` | unknown effect 的 equivalence/key/probe/retry 合同未知 | L0-sdk、Governance、全局可靠性维护者 | durable attempt/checkpoint；禁止盲重放/换 key | 005 |
| `SYNC-OPEN-006` | `.qs-sync` 物理 schema、migration、retention、repair/deletion policy 未知 | L5-sync 设计维护者 + 04 owner/全局架构维护者 | logical contract only；query 不 repair；provenance append/protect | 006/014 |
| `SYNC-OPEN-007` | Git remote 与 local working copy/source relation 未知 | L5-sync 设计维护者 + Artifact/Workspace owner | Git 仅 observation/apply seam；不 push/merge/rebase | 007 |
| `SYNC-OPEN-008` | comparator/gap/replay 与跨版本兼容未知 | Artifact/Workspace owner + SDK owner | `Gap/Unknown/Unsupported`，不推进 cursor | 008 |
| `SYNC-OPEN-009` | dirty/untracked/symlink/path lock 与人工 resolution contract 未知 | L5-sync 设计维护者、filesystem/Git adapter owner | non-overwrite、manual/probe required；不自动 stash/merge | 010 |
| `SYNC-OPEN-010` | Node version/package manager/package/bin/parser/runner/Git lib/SDK dependency syntax 未知 | L5-sync 设计维护者 + 04/07 implementer after repo exists | 保持 `pending/local_pending`；不生成 package/lock/test command | 011 |
| `SYNC-OPEN-011` | Query visibility resolver、page index、empty-page seed 和 degraded mapper 尚未有真实 adapter | owner read-port 维护者 + 05/06设计维护者 | 使用 typed missing/not-visible/partial；不从 ref/string拼视图 | 016 |
| `SYNC-OPEN-012` | Consumer event source/schema/version/order/topic/dedup contract 未知 | 各上游 event owner + L0-bus/SDK owner | handlers `planned/blocked`；只做 envelope validation/quarantine 设计 | 017 |
| `SYNC-OPEN-013` | Job scheduler/trigger、system actor scope、run retention 未知 | L5-sync ops owner + 04/07 | jobs 只作为 explicit bounded operation；不声称 daemon/schedule | 018 |
| `SYNC-OPEN-014` | Diagnostics/telemetry sink、sampling/retention/alerting 未知 | L4-observability owner | closed best-effort signal；sink failure isolation | 019 |
| `SYNC-OPEN-015` | 05/06 的正式测试/验收 ID、artifact/report/evidence schema 未建立 | 后续文档 owner / 用户确认 | Step 16 TC 只作设计切口；不伪造 EV/AC/report/readiness | 012/020/022 |
| `SYNC-OPEN-016` | 07 的 phase/commit boundary、implementation ledger 路径、baseline 和 required checks 未建立 | 07 文档 owner（本项目后续步骤） | 不创建 implementation ledger/skeleton；Step 17 boundary 表只作为输入 | 020 |
| `SYNC-OPEN-017` | 是否需要支持 LFS、浅克隆、GUI/Tauri、daemon 等历史能力无权威决定 | 用户 + 架构维护者 | 作为 historical/pending，不建目录、不写 capability | 009/021 |
| `SYNC-OPEN-018` | 目标实现仓 git identity、分支和初始状态未知 | 实现仓 owner/实施者 | 不提交、不声称 commit；实施前只读检查 | 013/020 |

## 6. 未确认前的实现姿态矩阵

| 能力/入口 | 当前允许姿态 | 当前禁止姿态 | 依赖确认 |
|---|---|---|---|
| `clone` | planned local orchestration；缺 source/access/metadata 时 typed blocked | 宣称已物化、自动选择 latest、覆盖 target | 001/002/003/006/008/010 |
| `pull` | read/plan skeleton、Gap/Unknown/Conflict 结果 | 无 comparator 仍推进 cursor、自动 full/merge/rebase | 002/007/008/010 |
| `status` / 13 Queries | read-only views、partial/missing/not-visible/unavailable | refresh、repair、probe、写 provenance、空数组冒充健康 | 006/010/016 |
| `push-review` | candidate freeze、Prepared attempt、transport layer、probe-required | Git remote push、ACK=accepted、Decision/Gate write、换 key 重试 | 001/004/005/007 |
| metadata migration/rebind | explicit command contract、new generation/provenance relation | query auto migration、in-place overwrite、删除 protected provenance | 006/010/011 |
| conflict/resume/probe | explicit human intent、checkpoint、formal probe route | auto resolve、blind replay、force retry | 005/008/010 |
| Consumers | envelope/receipt local conservative transitions的 planned handler | 私有 topic、raw payload persistence、auto pull/apply/handoff | 001/004/005/006/012 |
| Jobs | bounded scan/probe/stale operations、typed report/replay design | scheduler事实、auto repair、batch complete=ready | 001/005/006/013 |

## 7. Step 18 自检、回填与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 所有 Step 1～17 未关闭问题均登记 | pass_with_blockers | 10 个上游、5 个本地、下游文档与实现仓缺口均有风险/事项 ID。 |
| blocking/high/medium/informational 分类 | pass | 每项有影响范围、责任方或待确认方和未确认前姿态。 |
| 不确定项未被写成实现事实 | pass | 所有正向外部合同、phase、AC/EV、runtime/package/test 选择保持 pending/blocked。 |
| 与 Step 17 闭环一致 | pass | 字段/DTO/view/state/metadata/idempotency/Query no-write 和名称未引入新定义。 |
| 回填位置 | ready_for_step_19 | 正式 03 §5.17 引用本文件风险表与待确认事项表。 |
| 实现/测试/提交纪律 | pass | 未创建实现仓、implementation ledger、测试、artifact/report/evidence；未运行测试、未提交。 |

### 7.1 Step 19 进入条件

- [x] 风险表覆盖 `SYNC-UP-001~010`、`SYNC-LOCAL-001~005`、下游文档未建、目标实现仓缺失、phase boundary 未分配等真实 blocker。
- [x] 每个风险都有影响、缓解、责任方/待确认方和未确认前处置。
- [x] 05/06/07 的测试/验收/实施编号没有被伪造；projection rebuild 与 artifact/evidence 对 Sync 明确为 `not_applicable`。
- [x] Step 19 只允许 full-restart 装配正式 03；装配后必须停审，不得进入 04。

Step 18 gate：`pass_with_upstream_blockers`；下一动作：`complete_step_19_formal_document_assembly`。
