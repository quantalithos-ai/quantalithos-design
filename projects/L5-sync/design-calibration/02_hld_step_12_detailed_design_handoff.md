# Step 12. 详细设计承接清单

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；Step 4~11 均已收稳并通过各自审计。
- `gate_status=pass_with_upstream_blockers`；本步只整理稳定输入、03 展开项和回退规则，不新增对象、接口、流、状态或配置主语。
- `formal_fill_allowed=step14_only`；用户尚未授权进入 03，本文件只是未来交接合同。

### Step 内计划

1. 回读 Step 4~11 的完成门禁、跨部分/对象/接口/流/状态审计。
2. 按代码框架、五部分、对象、接口、流程、状态、异常、配置、测试/证据边界整理交接。
3. 区分可交 03 展开的稳定输入与因 `SYNC-UP-001~010` 不能进入正向实现的事项。
4. 明确 03 发现主语变化时的回退目标和禁止暗改规则。
5. 执行无新增分析、无悬空、无实现/测试事实审计后更新 flow/台账。

## 2. 本步输入

| 输入 | 已收稳内容 |
|---|---|
| Step 4 | 五部分×实现分层、planned code subjects、ports/adapters/persistence |
| Step 5 | capability、对象候选来源、接缝、五部分停审和跨部分审计 |
| Step 6 | 29 个关键对象 typed skeleton 与跨对象反查 |
| Step 7 | CLI/API/consumer/job/ports 分类和 typed input/output |
| Step 8 | 通用流、18 个关键图、effect/UoW/unknown 边界 |
| Step 9 | 17 个 lifecycle 对象多轴状态、迁移与传播 |
| Step 10 | 40 个异常场景与安全姿态 |
| Step 11 | 配置影响类别、15 项不可配置化边界与 03/04 分工 |

## 3. SOP 问题回答

1. **哪些代码主体已收稳？** 五部分、Inbound/Operations、Application、Domain/Policies、Ports、local persistence、SDK/Git/fs/diagnostics adapters 及 Step 4 点名主体，详细设计不能重分业务 ownership。
2. **哪些对象/接口/流/状态已成为输入？** Step 6 的 29 对象、Step 7 所有 API/ports/consumer/jobs、Step 8 覆盖决策和关键流、Step 9 多轴状态/迁移全部是 03 的直接输入。
3. **03 应继续展开什么？** 模块/文件与语言映射、二级类型、完整函数/trait/DTO/error、metadata physical schema/repositories/UoW、CLI flags/exit codes、SDK/Git/fs adapters、transaction/lock/crash recovery、state guards、配置类型注入、test seams。
4. **主语需变更时怎么办？** 改五部分/ownership/29 对象 identity/API category/key flow/state axis/hard constraint 必须回退相应 Step 4~11 并重审下游，不得在 03 暗改。
5. **配置如何承接？** 03 只定义 typed config contracts/loader-validator-builder injection；实际 keys/defaults/examples 交 04。
6. **哪些不能交正向实现？** 所有依赖未闭合 SDK/source/posture/handoff/idempotency/metadata/Git/incremental/tool/path 合同的路径，只能交 `planned/blocked/unsupported` skeleton 与负向测试口径。

## 4. 当前文档问题诊断

若只把“实现 clone/pull/status/push-review”交给 03，详细设计会重新发明对象、状态与错误语义，容易把 blocker 用 provider DTO、Git 命令或 metadata JSON 暗补。反之，把所有字段/流程细节锁在 02 又会越层。因此交接必须同时固定概要主语和列明可展开的实现契约。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 仅有能力描述，03 可重新发明模块/对象 | 五部分、主体、29 对象、接口/流/状态是稳定输入 |
| blocker 容易被实现细节掩盖 | 每类交接明确 blocked 正向合同与保守 skeleton 上限 |
| metadata/Git/SDK 配置边界分散 | schema/adapters/config/test seams 有明确下游文档分工 |
| 主语变化无回退路径 | Step 4~11 按变更类型逐项回退并重审依赖链 |

## 6. 设计取舍

- 交接以“已收稳主语 + 03 展开项 + blocker 上限”三列组织，避免把未来任务写成已实现事实。
- 03 可调整语言层布局和小型 value type 合并，但不得改变 ownership、状态轴、边界语义；超出即回退 02。
- 测试切口在本步明确到 contract/negative/failure/evidence ceiling，但测试 case/fixture/runner/result 归 05/实际实施。
- 不创建 implementation ledger 或 boundary skeleton；按用户规则只有正式 07 完成时才创建，状态也只能 planned/blocked/waiting。

## 7. 结构化中间产物

### 7.1 详细设计承接清单

| ID | 已由概要设计收稳 | 详细设计继续展开 | blocker / 完成上限 |
|---|---|---|---|
| `DDH-SYNC-01` | 五业务部分与正交实现分层 | module/package/file layout、dependency injection、runtime composition | 不改变五部分 ownership；不声称代码已存在 |
| `DDH-SYNC-02` | 四 CLI verbs 与 maintenance/query interface 主语 | parser/flags/exit code/output DTO/command routing | explicit selection 不得由默认值补；GUI/Tauri pending |
| `DDH-SYNC-03` | CP1 selection/operation/evaluation/snapshot/policy | 二级 refs/results/errors、owner check matrix、SDK mapping/freshness | `SYNC-UP-001/003`；正向 owner adapter blocked |
| `DDH-SYNC-04` | CP2 binding/manifest/cursor/mapping/observation/policies | `.qs-sync` physical schema/layout/versioning/migration/store/UoW/lock | `SYNC-UP-006/007/010`；不得锁历史 metadata.json |
| `DDH-SYNC-05` | CP3 delta/plan/change-set/run/policy | source DTO mapping、comparator、path mapping、staging/apply/finalize/crash consistency | `SYNC-UP-002/007/008/010`；no proof, no pull |
| `DDH-SYNC-06` | CP4 conflict/checkpoint/resolution/probe/policy | conflict taxonomy、resume matrix、probe adapters、idempotency equivalence、leases | `SYNC-UP-004/005/010`；no auto resolve/replay |
| `DDH-SYNC-07` | CP5 candidate/attempt/provenance/policies/views | Governance DTO/error mapping、candidate digest/scope、probe/decision mapping、redaction | `SYNC-UP-001/004/005/006`；ACK≠Decision |
| `DDH-SYNC-08` | 29 对象的 identity、fields semantics、states、methods/factories | 完整 type definitions、secondary enums/refs/sets, validation errors, serialization mapping | 可合并纯 value implementation，但改变主语/状态须回退 Step 6 |
| `DDH-SYNC-09` | Command/Query/Consumer/Job/Port 分类 | complete signatures、request/result DTO、error taxonomy、repository traits | provider raw DTO/opaque maps 不得替代 local contracts |
| `DDH-SYNC-10` | 18 关键流与通用 mutation/query/consumer/job 骨架 | exact calls、transaction scopes、lock ordering、crash windows、retry eligibility | 不得创建跨 SDK/Git/fs/store 分布式事务假象 |
| `DDH-SYNC-11` | 17 lifecycle objects 的状态、允许/禁止迁移与传播 | enum definitions、guard functions、optimistic concurrency、persistence transitions | 外部 owner lifecycle 只 snapshot/ref，不内化 |
| `DDH-SYNC-12` | 40 异常场景与 typed posture | error hierarchy/code、CLI mapping、adapter error normalization、fault recovery | retry/backoff 不可绕 unknown/probe/manual |
| `DDH-SYNC-13` | 配置影响类别与不可配置化边界 | RuntimeConfig/loader/validator/builder families、adapter/job injection | keys/defaults/env/examples 交 04；hard gates 不可配置 |
| `DDH-SYNC-14` | conditional consumers / no outbound event | event envelope/schema/dedup/order only after formal contract; startup capability guard | consumers `blocked/planned`；不得订阅 private topic；outbound not applicable |
| `DDH-SYNC-15` | status no-write 与 layered views | read store/view builder/redaction/visibility/partial-read DTO | no refresh/repair/probe/persist observation |
| `DDH-SYNC-16` | local UoW/prepare-call-probe-finalize | repository/UoW/idempotency/probe implementations and recovery queries | physical mechanism必须基于 actual adapter capability |
| `DDH-SYNC-17` | forbidden body / provenance/evidence ceiling | safe summary/redaction/secret provider boundaries、log policy、test assertions | raw body/credential/evidence report禁止；diagnostics≠readiness |

### 7.2 测试切口与证据边界交接

| 测试切口 | 03 应提供的 seam | 05 后续测试主题 | 证据上限 |
|---|---|---|---|
| explicit selection/access | fake/contract `OwnerAccessPort`、typed clock/snapshot | missing/implicit/stale/denied/revoked/archive/unknown | fake 只证明 fail-closed local behavior |
| metadata/binding | in-memory/corrupting `MetadataStore`、generation-controlled UoW | init/migrate/rebind/corrupt/dangling/generation conflict/provenance protection | 不证明真实 filesystem durability |
| Git/filesystem safety | capability-bounded fake adapters + sandbox seam | dirty/untracked/path escape/symlink/lock/tool unsupported/no forbidden commands | command spy 不证明真实 Git remote/source mapping |
| source/cursor/mapping | scripted `MaterialSourcePort` comparator/delta results | full/incremental/no-op/gap/out-of-order/duplicate/rename/delete/mapping conflict | scripted delta 不证明 owner source authority |
| apply/recovery | fault-injecting stage/commit/UoW/probe seams | partial/unknown/crash before/after apply/finalize/resume/replan/no cursor advance | local simulation 不证明 OS atomicity until integration tests |
| handoff | scripted `ReviewHandoffPort`/decision/probe adapters | ACK/timeout/lost response/known reject/probe unknown/decision pending/terminal | ACK/fake decision 不证明 real Governance accepted |
| status/query | read-only repositories/observation adapters with write spies | no hidden write, partial/missing/stale/redaction/layer separation | view test 不证明 upstream freshness |
| config | loader/validator/composition seams | invalid/conflicting/unsupported/secret leak/hard-gate override refusal | config parse success 不证明 adapter availability |
| diagnostics/provenance | redaction spy/provenance integrity harness | body/credential rejection, parent gap, non-delete, diagnostic outage isolation | logs/traces/provenance 不是 formal evidence/verdict |

### 7.3 03 入口阅读矩阵

| 03 主题 | 必读 02 calibration |
|---|---|
| 模块/分层 | Step 4、Step 5 |
| 对象/逻辑 metadata | Step 5、Step 6 |
| CLI/API/ports/adapters | Step 7、Step 1 blocker mapping |
| 流程/事务/恢复 | Step 8、Step 10 |
| 状态/错误 | Step 9、Step 10 |
| 配置 contracts | Step 11 |
| 测试 seams/evidence ceiling | 本 Step §7.2 + Step 10 |

### 7.4 回退规则

| 03 发现的变化 | 必须回退位置 | 后续重审范围 |
|---|---|---|
| owner/仓职责或五部分变化 | 00/01 + Step 1/3/4/5 | Step 5~13 全链 |
| 新增/删除/合并关键对象，改变 identity/ownership/状态轴 | Step 5/6 | Step 7~13 |
| Command↔Query、consumer/job/outbound event 类别变化 | Step 7 | Step 8~13；必要时回 01 通信 |
| 关键 flow/effect/UoW/unknown 语义变化 | Step 8 | Step 9~13 |
| 状态/允许禁止迁移/传播变化 | Step 6/9 | Step 10~13，必要时接口/流重审 |
| 新异常改变主线/跨部分协作 | Step 10，若新增 capability 回 Step 5 | Step 11~13 与受影响前序 |
| 配置能改变 domain/security/consistency | Step 3/9/11 | Step 12~13；若放宽需求红线则回 00 |
| 上游 blocker 正式闭合 | Step 1/13 + 对应对象/API/flow/state/exception | 受影响 Step 3~12；不在 03 直接补入 |

如果详细设计发现上述主语需要变更，说明概要设计尚未真正收稳，必须先回到相应 Step 修正并重做后续审计，而不是在 `03-详细设计.md`、代码或测试中暗改。

### 7.5 后置一致性核对

| 核对项 | 结论 |
|---|---|
| 全部条目有前序来源 | pass；无新对象/API/flow/state/config 主语 |
| 29 对象、接口、18 流、17 状态、40 异常均有 03 承接 | pass |
| blocker 未进入正向实现承诺 | pass；均标 planned/blocked/unsupported 上限 |
| 测试 seam 与证据边界 | pass；fake/local evidence 不证明真实 owner/integration |
| implementation ledger/skeleton | not created；严格留到正式 07 完成 |
| 03 authorization | not granted；完成 02 后必须停审 |

## 8. 回填草稿

正式 §12 摘录 §7.1 承接清单、§7.2 测试/证据交接、§7.4 回退规则及完成上限。阅读矩阵保留在 calibration，正式正文以具体 Step 来源链接提供入口。

延伸阅读入口指向本文件的“详细设计承接清单”“测试切口与证据边界交接”“03 入口阅读矩阵”和“回退规则”。

## 9. 待确认事项

`SYNC-UP-001~010` 不是 03 可以自行解决的实现 TODO；必须由正式 owner 合同/本项目设计回流关闭。03 只能定义 blocked adapter skeleton、negative semantics 和 test seam，不得声称可落码正向集成已经成立。

## 10. 进入下一步条件

- [x] Step 4~11 已收稳内容全部有 03 承接，不新增设计结论。
- [x] 对象、接口、流、状态、异常、配置、测试 seam 与 evidence ceiling 无悬空。
- [x] 回退规则能定位变化应回哪个 Step 以及后续重审范围。
- [x] blocker 未包装为实现任务或 ready contract；未创建实施台账/skeleton。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 13。此结论仅为文档静态自检，不授权进入 03。
