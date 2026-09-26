# Step 2. 明确本轮实现范围和非范围

## 1. Step 状态

- 状态：`completed`
- `gate_status=pass_with_upstream_blockers`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 2
- 回填章节：正式 `03-详细设计.md` §2 本次详细设计目标与范围
- 前序门禁：Step 1 已 `pass_with_upstream_blockers`；`SYNC-UP-001~010` 原样开放。
- 正式 `03-详细设计.md` 写入：`false`

### Step 内计划完成情况

1. [x] 从 Step 1、正式 02 §2/§4～§13 和 `DDH-SYNC-01~17` 提取必须展开的 P0 实现契约。
2. [x] 区分核心 CLI/本地状态/adapter/recovery/handoff 与条件性 P1 接口。
3. [x] 将完整配置、测试、验收、实施、运维和历史能力放回各自文档或 blocker。
4. [x] 建立“实现者能够完成什么”的诚实上限，不把 blocked adapter 写成可运行 integration。
5. [x] 完成旧 03 范围污染诊断、回填草稿和静态自检。

## 2. 本步输入

| 输入 | 采用内容 |
|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 上游关系、本文必须/不再回答、输入缺口和完成上限。 |
| 正式 02 §2 | P0/P1/P2、当前范围、非范围和概要设计深度。 |
| 正式 02 §4～§11 | 五部分×实现分层、29 对象、接口、关键流、状态、异常和配置影响。 |
| `02_hld_step_12_detailed_design_handoff.md` | `DDH-SYNC-01~17`、测试 seam、证据上限和回退规则。 |
| `02_hld_step_13_risks_open_questions.md` | 路径门禁、14 个设计风险和 `SYNC-UP-001~010`。 |
| 详细设计 SOP/书写规范 | 约束目标必须是可实现契约，不是需求复述、任务拆分或测试/配置手册。 |

## 3. SOP 问题回答

### 3.1 本轮详细设计必须覆盖哪些模块？

本轮必须覆盖一个 planned TypeScript package 内的以下实现责任，不提前固化真实目录名之外的 provider 细节：

1. CLI/inbound：`clone`、`pull`、`status`、`push-review` 的显式输入、routing、安全输出；metadata/recovery 操作入口只覆盖 P0 必需的维护与恢复契约。
2. Application orchestration：`OperationCoordinator`、五部分 service、只读 `SyncStatusQueryService`，负责门禁、UoW、port 调用和 typed posture。
3. Domain model/policies：正式 02 的 29 个对象及其二级 refs、enums、sets、guards、validation errors。
4. Local persistence：`.qs-sync` logical metadata、repositories、generation-aware store/UoW、cursor/mapping/conflict/checkpoint/handoff/provenance read/write boundary。
5. Ports/adapters：正式 SDK、Git、filesystem、metadata、clock/id/digest、diagnostics 的 inward-defined ports 和 capability-bounded adapter skeleton。
6. Composition/config seam：只定义 typed config families、loader/validator/builder injection points，不定义最终 keys/defaults/env examples。

### 3.2 本轮必须定义哪些对象、接口、事件、job 和状态机？

- 对象：正式 02 §6 的全部 29 个关键对象；实现上允许将纯二级 value types 组织到同一文件，但不得合并其 identity、ownership 或状态主语。
- CLI/API：四个 P0 CLI 对应的 `CloneWorkingCopy`、`PullWorkingCopy`、`GetSyncStatus`、`PushReviewCandidate`；同时定义其依赖的只读 query、metadata maintenance 和 conflict/recovery command contracts。
- Ports：owner eligibility/posture、material source、review handoff/decision/probe、Git observation/worktree、filesystem inspect/apply、metadata store/UoW、repositories、diagnostics、clock/ID/digest。
- Events：当前无 outbound event；三个 inbound consumer 仅定义为 `planned/blocked` capability slot，只有正式 owner event contract 闭合后才可启用。
- Jobs：`ScanMetadataIntegrity`、`ProbePendingHandoffAttempts`、`MarkStaleOwnerSnapshots` 的 typed contract 和安全边界；不定义 daemon、自动 pull/handoff/recovery job。
- 状态：正式 02 已筛选的 17 个 local lifecycle 对象及其合法/非法迁移；外部 owner lifecycle 仍只以 snapshot/ref 表达。

### 3.3 哪些能力属于 P1 / 后续阶段，不应在本轮正向展开？

| 能力 | 本轮姿态 | 后续/回退位置 |
|---|---|---|
| metadata migrate/rebind、unknown probe、posture/source invalidation | 只定义 P1 safety contract 与 entry seam；正向受 blocker 约束 | 后续详细 Step + 正式上游合同 |
| inbound owner consumers | `planned/blocked`；只定义 startup capability guard | `SYNC-UP-001~005/008` 闭合后回流 01/02/03 |
| 批量预取、多 working-copy 比较、归档项目浏览 | 不进入当前实现契约 | 需求/架构演进后重新校准 |
| Git LFS、浅克隆、GUI/Tauri、daemon | `unsupported/historical/pending` | `SYNC-UP-009` 与新的需求/compatibility 证据 |
| 自动 merge/rebase/push/stash、自动冲突决策、盲重放 | 永久硬禁止，不是 P1 | 只有需求/架构正式改写才可讨论 |

### 3.4 哪些内容属于测试方案、实施计划、配置设计或运维手册？

详细设计只提供模块级 test seams、negative/failure cuts、typed config binding points 和实施前阅读/依赖关系。以下内容不进入本轮：

| 内容 | 归属 |
|---|---|
| 配置 key、source、precedence、default、env/JSON 示例、change/restart 行为 | `04-配置设计.md` |
| 完整测试策略、case matrix、fixture、runner、coverage、实际命令与结果 | `05-测试方案.md` |
| acceptance gate、证据要求、verdict/signoff/readiness | `06-验收标准.md` |
| phase、commit boundary、开发顺序、实现台账和 planned skeleton | `07-实施计划.md`；正式 07 完成时才创建 |
| 部署拓扑、告警阈值、故障处置/runbook | 运维文档，不在 03 |

### 3.5 实现者拿到正式 03 后，应能完成哪些代码范围？

在正式 03 后续 Step 全部完成且进入实施阶段时，实现者应能创建单 TypeScript package 的 CLI + library skeleton，按文件实现 local types/policies/services/repositories/ports/adapters/composition，并实现：

- 四 CLI 的显式输入验证与 typed result mapping；
- local session/binding/metadata/cursor/mapping/conflict/checkpoint/candidate/attempt/provenance 的持久化与只读 status；
- dirty/path/generation/source continuity 的保守门禁和 local recovery state；
- SDK/Git/filesystem adapter 的 capability check、unsupported/blocked branch 和 no-forbidden-action guards；
- contract/negative/failure 测试所需的 fake/in-memory/fault-injection seam。

对于 `SYNC-UP-001~010` 阻断的 owner/source/handoff/Git/fs 正向路径，实现者只能获得 planned/blocked interface skeleton，不得被文档误导为可完成真实集成。当前用户也没有授权代码实施。

## 4. 当前文档问题诊断

旧正式 03 把 source-change intake、跨端 delivery/fanout、replay/resync/repair、projection 和 Rust 目录当作当前范围，同时混入“建议开发顺序”和旧运行机制。这既超出 L5-sync 的本地 controlled synchronization 窄域，也把详细设计、实施计划、测试与运维内容混在一起。

新范围必须以正式 02 的五部分和四 CLI 为中心，明确 `status` no-write、Git/filesystem 仅本地 adapter、Governance handoff 只到 transport/ref 层，并把未闭合正向合同显式留在 blocker，而不是以旧代码名补齐。

## 5. 改动前后对比

| 项 | 历史范围 | 当前范围 |
|---|---|---|
| 核心闭环 | source change→跨端 fanout→replay/repair | select/access→bind/materialize→conflict/recover→review handoff |
| 主入口 | RPC/HTTP 与跨产品消费面 | 本地 CLI + 可嵌入 library surface |
| 本地 truth | `SyncTask`/projection/delivery 状态 | session、binding、metadata、cursor/mapping、conflict/checkpoint、attempt/provenance |
| 外部 truth | 容易复制或聚合进 Sync | 只保存 body-free ref/snapshot/freshness；由 owner 决定 |
| 技术能力 | Rust/Tauri/LFS/shallow/GUI 默认进入 | TypeScript planned；历史能力全部 pending/unsupported |
| 下游内容 | 开发顺序、测试/配置细节混写 | 03 只定义实现契约和 test/config seam，具体内容交 04～07 |

## 6. 设计取舍

1. 采用“P0 纵向闭环 + P1 保守 seam”：四 CLI 和五部分形成设计主轴，maintenance/consumer/job 只有支撑安全与恢复所需部分进入。
2. 保留 CLI 与 library 双 surface，但共享同一 application/domain core；不让 CLI parser 或未来 GUI 复制规则。
3. 对 blocker 采用负向可落码优先：明确缺合同时返回何种 posture、不得执行何种副作用；不假定 provider DTO、工具命令或 schema。
4. 测试 seam 和 evidence ceiling 属于详细设计范围，测试用例/运行/报告不属于；配置 injection 属于，配置手册不属于。

## 7. 结构化中间产物

### 7.1 设计目标表

| ID | 目标 | 交付给实现者的结果 | 完成上限 |
|---|---|---|---|
| `DDD-SYNC-G01` | 固定单 package 内模块边界 | CLI/library/application/domain/ports/persistence/adapters/composition 的 dependency map | planned paths，不声称仓或文件存在 |
| `DDD-SYNC-G02` | 把五部分转成 TypeScript 契约 | 29 对象、secondary types、services、policies、repositories 的定义位置 | 不改变概要 identity/ownership/state axis |
| `DDD-SYNC-G03` | 收稳四 CLI 与维护/查询协议 | typed input/result/error、routing、exit mapping slot、query no-write | binary/flags/exit values 后置，不能猜测 |
| `DDD-SYNC-G04` | 收稳 `.qs-sync` local state 边界 | metadata topics、store/UoW、generation/integrity/recovery/provenance contract | 物理 schema 正向路径受 `SYNC-UP-006` 阻断 |
| `DDD-SYNC-G05` | 收稳 materialization 与 Git/fs 安全面 | plan/stage/apply/finalize、dirty/path/tool guards、fault seam | 不自动 Git，不承诺 remote/LFS/shallow |
| `DDD-SYNC-G06` | 收稳 conflict/recovery/unknown | checkpoint、manual intent、probe/reentry、no-blind-replay | owner probe/idempotency 受 `SYNC-UP-004/005` 阻断 |
| `DDD-SYNC-G07` | 收稳 review handoff/provenance | candidate/attempt/transport/probe/Decision 分层、redaction | 不创建 Gate/Decision，不把 ACK 当 accepted |
| `DDD-SYNC-G08` | 固定 adapter 和 composition seam | SDK/Git/fs/metadata/diagnostics ports、capability validation、blocked skeleton | 真实 integration 不因 fake 或接口名而被证明 |
| `DDD-SYNC-G09` | 建立后续验证与实施承接 | per-module test cuts、evidence ceiling、04～07 分工 | 不运行测试、不创建实施台账/骨架 |

### 7.2 P0 必须覆盖矩阵

| 范围轴 | 必须覆盖 | 本轮不锁定 |
|---|---|---|
| CLI | `clone`、`pull`、`status`、`push-review` 的语义、显式选择和 typed result | package/binary 名、parser、flags、exit code 数值、shell completion |
| CP1 | selection、operation、eligibility、snapshot、pre-effect revalidation | owner SDK method/DTO、permission algorithm |
| CP2 | target inspect、binding、manifest、cursor/mapping、integrity、status slice | `.qs-sync` 最终物理 schema/retention/destructive cleanup |
| CP3 | source resolve/read seam、plan/path change、safe apply/finalize | authority/comparator/provider payload、remote mapping、auto Git |
| CP4 | conflict/checkpoint/manual intent/resume/probe/unknown | 自动 resolution、blind retry、owner repair |
| CP5 | candidate freeze、durable attempt、handoff/probe/read、provenance/layered status | Gate/Decision mutation、accepted verdict、formal evidence |
| Adapters | SDK/Git/filesystem/metadata/diagnostics minimal ports + capability detection | unverified libraries, commands, protocols, LFS/shallow/GUI |
| Verification | unit/contract/negative/fault-injection seam and evidence boundary | complete test plan, execution, report, evidence, readiness |

### 7.3 非范围表

| 非范围 | 留给哪一层 / 文档 |
|---|---|
| 外部 owner 或 Git remote truth 的创建、修改、复制模型 | 永远由各正式 owner 持有；Sync 只消费 safe refs/capabilities |
| 自动 merge/rebase/push/stash、覆盖 dirty、自动冲突决定、provenance 删除/伪造 | 永久硬禁止，不是后续 backlog |
| 精确 Node 版本、package manager、CLI parser、binary/package 名、flags/exit values | 有权威 runtime/产品输入后回到 Step 3/8/14；当前 `local_pending` |
| 配置全集及示例 | 04 |
| 完整测试矩阵、测试执行和报告 | 05；实际运行待实施授权 |
| 验收 verdict、evidence/signoff/readiness | 06 与正式 owner |
| phase、commit boundary、implementation ledger/skeleton | 07；当前严禁创建 |
| GUI/Tauri、LFS、浅克隆、daemon、批量预取、多副本比较、归档浏览 | `SYNC-UP-009` 或需求/架构演进后再设计 |
| 固定 SLA/性能数字和部署/运维 runbook | workload/测试/运维文档，当前无权威证据 |

### 7.4 文档归属与交付边界

```text
03 detailed design
  owns: types, signatures, module/file responsibility, state/flow/UoW/error contracts,
        adapter seams, config binding points, test cuts and evidence ceiling

04 configuration design
  owns: keys, sources, precedence, defaults, examples and change behavior

05/06
  own: complete test/acceptance matrices and evidence/verdict requirements

07
  owns: implementation phases, commit boundaries, planned ledgers/skeletons
```

关键说明：

- 该图表达文档责任，不表示 04～07 已获授权或已存在当前 calibration。
- 03 中的 test cut/config seam 是代码契约，不等于测试结果或配置手册。
- `SYNC-UP-001~010` 不能通过把内容转交其他文档而被视为关闭。

### 7.5 blocker 对范围的裁剪

| Blocker 组 | 允许进入本轮 | 禁止进入本轮的正向承诺 |
|---|---|---|
| `SYNC-UP-001/003` | owner access/posture port、freshness、fail-closed result | 真实 SDK methods/DTO/errors、完整允许动作矩阵 |
| `SYNC-UP-002/008` | explicit source ref、delta/comparator slot、gap/unsupported | source priority、连续性算法、可运行 incremental pull |
| `SYNC-UP-004/005` | durable attempt、idempotency correlation、probe/manual states | ACK accepted、盲重试、跨域 exactly-once |
| `SYNC-UP-006` | logical metadata topics、generation/provenance invariants、store abstraction | 最终物理 schema、迁移/retention/delete implementation |
| `SYNC-UP-007/009/010` | Git/fs observation、whitelist/capability guard、non-overwrite | remote truth、auto Git、LFS/shallow/GUI support claim |

## 8. 回填草稿

正式 §2 应摘录 §7.1～§7.3，明确本轮是单 TypeScript package 的 CLI + library 实现契约设计，覆盖五部分和 P0 安全闭环，但对未闭合上游只提供 planned/blocked skeleton。

正式正文应将文档归属浓缩为边界说明，不写 phase、开发任务或实际测试命令。延伸阅读入口指向本文件“设计目标表”“P0 必须覆盖矩阵”“非范围表”“blocker 对范围的裁剪”。

## 9. 待确认事项

- `SYNC-UP-001~010` 全部保持 `pending/blocked`；不因本步划定范围而降级。
- 精确 Node/runtime/package/CLI 工具选择属于 Step 3 的 `local_pending`；不阻断 Step 3，但阻止写成既定实现事实。
- 是否启用任何 consumer、LFS、浅克隆、GUI/Tauri 或 daemon 仍无权威依据，本轮不展开。

## 10. 进入下一步条件与自检

- [x] 已回答本轮模块、对象/API/event/job/state、P1、下游文档归属和实现交付范围。
- [x] P0 必须覆盖内容能回指正式 02 与 `DDH-SYNC-01~17`。
- [x] CLI + library 共用 core，未新增第六业务 truth 部分。
- [x] status no-write、no auto Git、non-overwrite、ACK/Decision 和 provenance 红线保持不变。
- [x] 未把 blocker、fake、historical choice 写成正向实现能力。
- [x] 未写开发排期、commit boundary、配置全集、测试结果或实现事实。

结论：`gate_status=pass_with_upstream_blockers`；允许创建并完成 Step 3。该结论只收稳详细设计范围，不授权代码实施或正式 03 写入。
