# L2-runtime 03 详细设计 Step 19: 正式详细设计装配

> 创建日期: 2026-08-08
> 状态: done_stop_review
> 当前模式: controlled_reopen_D09
> 正式输出: `projects/L2-runtime/03-详细设计.md`

## 1. 三层装配门禁

| 门禁 | 检查 | 结果 |
|---|---|---|
| 项目级 | 用户已明确授权 D09；台账允许当前文档/Step 19；不得进入 04 | pass |
| 文档级 | Step 5~18 产物可读；旧正式 03 标记为 historical material；D08 临时闭环已输入 | pass |
| 模块级 | 12 capability、7 layer、对象、Port、协议、Flow、SM-01~SM-31 状态主语和 Step 11~17 cross-cut 需重新回填审计 | pass |
| 事实级 | Rust 是 planned baseline；目标仓不存在；无实现/测试/evidence/readiness | pass |
| blocker | `L2R-UP-001~008`、`CP-001`、`ENTRY-001`、`IMPL-001` 必须保持 fail-closed | pass |

## 2. 正式章节来源

| 正式章节 | 校准来源 |
|---:|---|
| 1~4 | Step 1~4 |
| 5 | Step 5/6/7：技术分层、12 capability、模块实现卡 |
| 6 | Step 6/7：逐对象字段/函数/不变量、逐 Port 签名 |
| 7 | Step 8：17 Command、12 Query、6 Inbound、6 Outbound、7 Job |
| 8 | Step 9：逐接口 handler/service/domain/Port/UoW/错误链 |
| 9 | Step 10：18 状态主语和转换矩阵 |
| 10~15 | Step 11~16：persistence/error/concurrency/config/observation/test |
| 16~17 | Step 17~18：实施承接、风险与 blocker |
| 18 | 本文件、标准与真实使用上游材料 |

## 3. 装配规则

- 正文以模块/能力为主轴，同时提供业务 capability 到技术层的映射。
- 对象不是索引：正文必须给出字段、构造/变更函数、不变量；完整细节可回指 Step 6。
- Port/协议/Flow/State 必须逐项列出，不能压回“例如”。
- cross-cut 必须能回指具体 Flow/object/state/test；所有 unknown 路径保持 fenced。
- 删除旧正式文件后分批写入；装配后执行结构、命名、闭环、污染和 `git diff --check`。

```text
pre_assembly_gate = pass_for_D09
formal_write = closed_stop_review
post_assembly = pass
next_formal_document = blocked_until_D09_close_and_user_confirmation
```

## 4. D09 重开记录

| 项目 | 结论 |
|---|---|
| 重开触发 | 用户明确同意进入 D09 |
| 重开对象 | `projects/L2-runtime/03-详细设计.md` |
| 历史输入 | 现有正式 03、旧 README 和旧协议命名仅作 `historical_material_for_reassembly` |
| 新 canonical 输入 | D01~D08 临时讨论结论、Step 5~18 中间产物、当前正式 00~02 与已完成上游正式链 |
| 本轮允许修改 | 本 Step 文件、`03_ddd_calibration_flow.md`、项目台账、正式 03 |
| 本轮禁止修改 | 实现仓、代码、测试执行、artifact/evidence/readiness、04~07、commit |
| 完成门禁 | 正式章节逐模块展开；每章具体来源块；D08 字段/版本/replay/持久化/错误闭环；post-assembly 静态审计 |

## 5. 分批装配顺序

```text
batch A: §1~§4 upstream/scope/Rust/layout
batch B: §5 capability + seven technical layers + module cards
batch C: §6 object/service/Port/adapter contracts
batch D: §7 public protocol DTO/result/event/job schemas
batch E: §8 per-surface flows and internal operations
batch F: §9 state registry and transition matrices
batch G: §10~§12 persistence/error/concurrency/replay
batch H: §13~§15 configuration/observation/test cuts
batch I: §16~§18 implementation handoff/risk/source/stop audit
```

每个 batch 写入前先完成对应模块/章节的来源、字段闭环和 blocker 检查；每批控制在审查可读范围内，禁止用摘要或跨章节“同上”替代实现契约。

## 6. 装配后审计结论

| 检查 | 结果 |
|---|---|
| 17 Command、12 Query、6 Inbound Event、6 Outbound Event、7 Job 逐项计数一致；旧 15 Command 仅为 `historical_material` | pass |
| Step 7 所有 Flow 引用的 local repository/owner Port 已显式定义 | pass |
| 重复的 `HandoffRepositoryPort` 已收敛为唯一方法级定义 | pass |
| Step 10 的旧 18 个状态主语与新增 `SM-19~SM-31` 已在正文逐项装配；`SM-15` availability 与 snapshot completeness 已分轴 | pass |
| Step 11~16 的持久化、错误、并发、配置、观测、测试规则已进入正式章节 | pass |
| Rust planned baseline、具体产品 not_selected、target repo absent 均未伪造成实现事实 | pass |
| `L2R-UP-001~008`、`L2R-CP-001`、`L2R-ENTRY-001`、`L2R-IMPL-001` 保持 pending/blocked/fail-closed | pass |
| 正式 03 行数与上游粒度对比 | pass；行数仅作诊断，逐对象/Port/Flow/State 闭环为完成门槛 |
| `git diff --check`、历史污染词、对象/DTO/Port/Flow/State 闭环审计 | pass；旧别名仅保留在 §18，未知与 blocker 保持 fail-closed |

Step 19 当前结论：正式 `projects/L2-runtime/03-详细设计.md` 已完成 §1~§18 装配与静态审计，状态为 `closed_stop_review`；不得自动创建或进入 `04-配置设计.md`，必须等待用户单独确认。

## 7. D09 装配冲突登记

| 冲突 | 发现位置 | 当前裁决 | 正文处理 |
|---|---|---|---|
| Step 7 文件头/批次 7.5 的历史 `in_progress` 与文件尾 `done` 不一致 | `03_ddd_step_07_trait_port_adapter_contracts.md` | 该冲突仅记录为历史输入；D09 最终逐方法审计已完成，正式 03 采用收敛后的 canonical 方法 | 不改写 Step 7 历史文件；正式正文与台账以本次 `done_stop_review` 为准 |
| `AggregateVersionSet` 与 `ExpectedVersionSet` 并存 | Step 6/7 annex | `ExpectedVersionSet` canonical | 正文不再使用旧名；旧名只在历史污染审计列出 |
| `ToolActionPort` / `SandboxHandoffPort` 与 `InvocationCallerPort` 冲突 | Step 7 annex | `InvocationCallerPort` 是 Runtime 唯一正向 action seam；Runtime 不直连 Sandbox | 正文仅写 canonical Port；旧名不作为可调用接口 |
| `HandoffPort` 与 `HandoffSubmissionPort` 冲突 | Step 7 annex | `HandoffSubmissionPort` 负责候选提交 seam；`HandoffRepositoryPort` 仅保存 local attempt/gap | 正文拆分 repository 与 submission seam |
| 旧 `StoredResultKind::QueryView` | Step 6/临时材料 | Query 不进入 mutation replay registry | 正文 allow-list 排除 QueryView |
| Step 6/8 job carrier 使用 `UnitOfWork`、`JobPagePosture` 等未收敛名称 | Step 6/7/8 annex | `RuntimeUnitOfWorkPort`、`UnitOfWorkHandle`、`JobMetadata`、`JobPageDisposition`、`DispositionCounts` 为正式 03 唯一 carrier；旧名仅为历史输入 | 正文补齐字段、计数不变量和 cursor 提交顺序 |
| Step 10 source 状态把 `Partial` 混入 availability | Step 10 source annex | `SourceAvailabilityState` 保持六态；partial 只由 `SnapshotCompleteness::Partial` 表达 | SM-15 分离 availability 与 completeness |

```text
formal_assembly_cursor = section_18_complete
write_posture = completed_user_confirmed_with_04_writeback
next_gate = 04_step_01_in_progress
```

## 8. 04 配置设计反向校准附记

用户已在 D09 停审后明确授权进入 04。配置设计 Step 1 发现正式 03 的配置读取面存在未定义 Port、重复 policy carrier 和旧 slot aliases，已按配置设计 SOP 的反向校准规则完成最小回写：

- §6.8 补齐 `RuntimeConfigSnapshotPort`、`DefinitionResolverPort`、`EventPublisherPort` 与 exact outbox carriers；
- §11.1 补齐 `ConfigError`、`BuildError`、`BuildDisposition`；
- §13.1 收敛 `RuntimeConfigSnapshot`、`RuntimeProfile`、13 canonical `AdapterSlot` 与 7-job set；
- §13.3 明确 `InvocationCallerPort` 是唯一 action seam，Runtime 没有 Sandbox slot；`HandoffSubmissionPort` 与 local `HandoffRepositoryPort` 分离。
- §6.8.5、§13.1 与 Step 6/14 将 policy/slot 字段统一为 JSON domain/canonical slot 名，并补齐唯一 `AdapterBindingState` / `AdapterAvailabilityState`；不存在 `Ready`。

这些变更只闭合实现签名，不改变 D09 的业务边界、协议/状态 inventory、UoW 顺序和外部 blocker 姿态。
