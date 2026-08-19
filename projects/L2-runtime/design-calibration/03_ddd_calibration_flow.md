# L2-runtime 03 详细设计全量校准流程

> 创建日期: 2026-08-07
> 当前模式: full-restart
> 正式目标: `projects/L2-runtime/03-详细设计.md`
> 适用 SOP: `standards/document/详细设计讨论流程_SOP.md`
> 适用规范: `standards/document/详细设计书写规范.md`

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|---|
| Step 19 | `formal_03_reassembly + 04_config_contract_writeback` | `completed_user_confirmed` | D09 已停审且用户已授权 04；04 Step 1 发现配置 carrier/slot/Port 缺口并完成最小回写，不改变能力/协议/Flow/状态 | 作为 04 Step 1 的已闭合直接输入；03 不再处于当前执行位 |

## 2. 执行纪律

- 本轮为 03 的第二次受控重开：Step 1~4 保留为已完成输入；从 Step 5 开始按 Step 5 -> Step 19 串行深度重做，不合并、不跳步。
- 每个 Step 先更新本 flow、项目台账并创建当前 Step 中间产物；未完成当前 Step 不创建未来 Step 文件。
- 重开前的旧正式 `03-详细设计.md` 已作为 `historical_material_for_reassembly` 被替换；当前正式 03 是 Step 19 装配后的真相源。
- 行数只用于发现异常，不作为完成门槛；完成门槛是逐 capability/object/Port/protocol/Flow/state/test 的 1:1 闭环。
- 禁止 `...`、`same`、`同上`、`分别按`、合并 Query/Event Flow 或仅用总表代替逐对象/逐状态机契约。
- 旧 `03-详细设计.md`、README、旧 00/01/02/05/06 均为 `historical_material`，只用于污染审计。
- `L2R-UP-001~008`、`L2R-CP-001`、`L2R-ENTRY-001` 必须保持 `pending` / `blocked` / `waiting` / `fail-closed`，不得伪造正向合同、实现、测试、证据或 readiness。`L2R-LANG-001` 已收稳为 Rust workspace planned baseline，但 target repo、具体 runtime/transport/DB/scheduler 仍未选择。
- 不修改实现仓，不提交 commit。

## 3. Step 总流程

| Step | 中间产物 | 主题 | 状态 |
|---:|---|---|---|
| 1 | `03_ddd_step_01_upstream_boundary.md` | 确认概要设计输入边界 | `done_stop_review` |
| 2 | `03_ddd_step_02_scope.md` | 明确实现范围和非范围 | `done` |
| 3 | `03_ddd_step_03_constraints.md` | 编码规范、语言/runtime、仓库约束 | `done` |
| 4 | `03_ddd_step_04_file_layout.md` | 实现单元与文件布局 | `done` |
| 5 | `03_ddd_step_05_module_contracts.md` + capability annexes | 分层、能力切片与模块实现契约 | `done` |
| 6 | `03_ddd_step_06_object_contracts.md` + module annexes | 逐能力/逐模块对象实现契约 | `done` |
| 7 | `03_ddd_step_07_trait_port_adapter_contracts.md` + module annexes | 逐能力完整 Trait / Port / Adapter 契约 | `done` |
| 8 | `03_ddd_step_08_protocol_contracts.md` + protocol annexes | 逐协议族完整 DTO / Event / Job 契约 | `done` |
| 9 | `03_ddd_step_09_function_flows.md` + family annexes | 每个接口独立函数级处理流 | `done` |
| 10 | `03_ddd_step_10_state_matrices.md` + state annexes | 每个状态机独立转换矩阵 | `done` |
| 11 | `03_ddd_step_11_persistence_consistency.md` | 逐 record/Flow 持久化、事务、一致性 | `done` |
| 12 | `03_ddd_step_12_errors_recovery.md` | 逐层/逐 Flow 错误、异常与恢复 | `done` |
| 13 | `03_ddd_step_13_concurrency_idempotency.md` | 逐协议/aggregate/job 并发、幂等、重入 | `done` |
| 14 | `03_ddd_step_14_configuration_dependencies.md` | 逐 profile/slot 配置与依赖 | `done` |
| 15 | `03_ddd_step_15_observability_audit.md` | 逐 Flow/state/event 观测与审计 | `done` |
| 16 | `03_ddd_step_16_test_cuts.md` | 逐对象/Port/协议/Flow/state 测试切口 | `done` |
| 17 | `03_ddd_step_17_implementation_handoff.md` | file/object/Flow/test 到实施承接 | `done` |
| 18 | `03_ddd_step_18_risks_open_questions.md` | 风险、blocker 与未闭合项 | `done` |
| 19 | `03_ddd_step_19_formal_assembly.md` | 正式详细设计重建装配 | `done_stop_review` |

## 4. 输入基线与持续 blocker

| 输入 | 定位 | 使用口径 |
|---|---|---|
| `projects/L2-runtime/00-需求文档.md` | current baseline | 只承接能力、规则、边界和 NFR。 |
| `projects/L2-runtime/01-架构设计.md` | current confirmed upstream | 只承接 owner、上下文、依赖、交互和一致性结论。 |
| `projects/L2-runtime/02-概要设计.md` | direct upstream | 03 的唯一结构输入；展开文件、对象、函数、协议、状态和事务契约。 |
| `projects/L2-tools/00~07` | direct upstream | 消费行动契约；未闭合执行 seam 原样传递。 |
| `projects/L3-capability-hub/00~07`、`L3-method-library/00~07` | current upstream | 只消费 identity / definition ref 和 safe view。Method Library 03 有未提交改动。 |
| `projects/L1-governance`、`projects/L1-artifact` | truth / granularity input | 只消费裁决与 artifact ref，参考可落码粒度。 |
| `projects/L4-sandbox`、`projects/L4-observability` | pending external seam | 不补定义，不声明 ready。 |
| `projects/L0-core`、`L0-bus`、`L0-sdk` | foundation | Core 为 compile 候选；Bus 为 event seam；SDK 为下游。 |

持续 blocker：`L2R-UP-001~008`、`L2R-CP-001` checkpoint physical contract、`L2R-ENTRY-001` entry boundary、`L2R-IMPL-001` target repo absent；Rust language baseline 已 planned，具体 runtime/transport/DB/scheduler 仍未选择。

## 5. D09 Controlled Reopen Gate

用户已明确确认进入 D09。该轮只允许重写正式 `03-详细设计.md` 及其 Step 19 / 台账记录；不得创建、修改或进入 `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。

受控重开前检查：

| 检查 | 结果 | 处理口径 |
|---|---|---|
| 用户授权 | pass | 当前轮明确授权 D09 |
| Step 5~18 产物 | pass | 作为输入读取，不跳过既有讨论结论 |
| D08 临时闭环 | pass | `/tmp/L2-runtime_03_missing_design_discussion.md` 已固定字段/版本/摘要/replay/持久化/错误/恢复 |
| 正向外部 seam | blocked/pending | 继续 fail-closed，不在正式 03 中伪造 readiness |
| 实现仓/实现事实 | blocked/not_started | 不创建实现仓、不运行实现测试、不写 commit/evidence |

本次 controlled reopen 将现有正式 `03-详细设计.md` 作为 `historical_material_for_reassembly`，不直接继承其摘要、旧名称或旧版本载体。正文必须按书写规范逐章引用具体校准文件，并将 D08 canonical 结论提升为唯一正式契约。

```text
current_document = 03-详细设计.md
current_step = Step 19 completed_user_confirmed
current_module = D09/formal_03_reassembly/04_config_contract_writeback_complete
gate_status = pass_as_04_input
next_allowed_action = continue_04_step_01
next_formal_document = 04-配置设计.md_in_progress
commit_required = false
```

## 6. 04 Step 1 反向校准记录

| 发现项 | 03 回写 | 结论 |
|---|---|---|
| 正式正文引用 `RuntimeConfigSnapshotPort`、`DefinitionResolverPort`、`EventPublisherPort` 但缺 canonical 方法签名 | §6.8.3/§6.8.4 | 已补齐 immutable snapshot read、body-free definition view、exact outbox snapshot publish；不定义 owner body/route/delivery truth。 |
| `RuntimeProfile` 与旧 annex `RuntimePolicyProfileSet` 重复承载九组 policy value | §13.1 与 Step 6 annex | `RuntimeProfile` 成为唯一 value owner；version set 只记录 lineage。 |
| 旧 13 slots 包含 `ToolAction`、`SandboxHandoff`、`Handoff`，缺 `ModelContextMaterializer` | §13.1/§13.3 与 Step 6/14 annex | 收敛为 13 canonical slots；`InvocationCaller` 是唯一 action seam，无 Sandbox slot；`HandoffSubmission` 与本地 repository 分离。 |
| snapshot/job/slot/error carrier 不完整 | §11.1/§13.1/§13.4 | 补齐 exact slot/job sets、validation/build error 和 blocker identity 字段。 |
| policy/slot 字段存在缩写且 availability type 仅被引用 | §6.8.5/§13.1 与 Step 6/14 | 字段与 12 JSON domain/13 canonical slot 同名；补齐唯一 `AdapterAvailabilityState`，不增加 `Ready`。 |

本次是配置设计 SOP 允许的反向校准，未改变 03 已确认的需求、架构、能力、17/12/6/6/7 协议 inventory、SM-01~SM-31 或事务顺序。
