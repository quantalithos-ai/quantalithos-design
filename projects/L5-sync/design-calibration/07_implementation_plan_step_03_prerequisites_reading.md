# Step 3. 收稳前置条件与阅读清单

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 3
> 回填目标：正式 `07-实施计划.md` §3

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 3 / prerequisites_and_reading |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | Step 4；只抽取交付物，不创建实现仓 |

## 本步输入

| 输入 | 来源 | 状态 |
|---|---|---|
| Step 1 输入边界 | `07_implementation_plan_step_01_input_boundary.md` | completed / stop_review |
| Step 2 范围 | `07_implementation_plan_step_02_scope.md` | completed / stop_review |
| TypeScript 规则 | `standards/coding/typescript.md` | read；目标实现语言为 TypeScript |
| 目录组织规则 | `standards/document/子项目目录与代码文件组织规范.md` | read |
| SOP/书写/台账规范 | 07 三份标准 | read |
| 目标实现仓 | `/home/aris/Projects/quantalithos-sync` | absent / not_created |

## SOP 问题回答

| 问题 | 收口回答 | 依据 |
|---|---|---|
| 开工前必须读什么？ | 正式 00～06、当前 boundary 台账、对应 calibration、TypeScript 编码规范、目录组织规范、实施/提交/台账规范和相关专项上游正式文档。 | 07 SOP §3、03 §3/§16 |
| 当前技术栈是什么？ | TypeScript / ESM / Node-compatible；精确 Node、package manager、parser、runner、Git library 仍是 `SYNC-LOCAL-001~005`。 | 03 元信息、§3.1/§3.3 |
| 实现仓在哪里？ | 目标是 `/home/aris/Projects/quantalithos-sync`，当前不存在；创建前不得将设计仓当代码仓。 | 03 元信息、目录规范 |
| 需要哪些脚本目录？ | 未来实现仓使用 `scripts/gates/`、`scripts/reports/`、`scripts/checks/`、可选 `scripts/dev/`；当前不创建目录。 | 05 §9、07 书写规范 §4.7.2 |
| 永久记忆如何生成？ | 只允许机械投影本步固定种子表；不得从对话自由总结设计 truth。 | 07 SOP §3、书写规范 §5.3 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 目标仓缺失 | 无法检查 package、branch、git identity、workspace 状态 | 作为 `TARGET-REPO-001` blocker，PH-01 前处理 |
| Node/package/tool runner 未定 | 无法写 install/build/test 命令或 lockfile | 保留 capability-level checks，不锁具体命令 |
| 设计 calibration 文件很多 | 一次性全读增加误用和范围污染 | 按 phase/boundary 建阶段阅读矩阵 |
| 无批准 design commit | 无法满足实现台账 hash 要求 | ledger 明确 `blocked / no approved hash`，不伪造 |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 阅读方式 | 上游文档散列阅读 | 正式章节 + boundary-scoped calibration 矩阵 | 可恢复、可审计 |
| 技术栈 | 旧 README 可能指向 Rust/Tauri | TypeScript/ESM 仅作为当前设计候选 | 避免历史污染 |
| 记忆 | 无实施记忆入口 | 固定 `MEM-SYNC-001~004` 种子 | 防止实现 agent 自由扩写 |
| 台账 | 未创建 | 规定项目级、boundary 级、可选实现仓 scratch 路径 | 承接代码实施台账规范 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| §3 列出整个 `design-calibration/` | 简单 | 无法知道每个 boundary 需要哪份真相 | 拒绝 |
| 只列正式 00～06 | 简洁 | 丢失关键决策来源和 blocker 解释 | 拒绝 |
| 正式章节为基线，按 phase/boundary 指向最小 calibration 集 | 兼顾稳定性和可追溯性 | 需要维护矩阵 | 采用 |

## 结构化中间产物

### 阅读清单

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求 | `projects/L5-sync/00-需求文档.md` | FR/BR/AC/VETO、非目标和 truth ownership | 范围越界 | 回指覆盖编号 |
| 架构 | `projects/L5-sync/01-架构设计.md` | owner seam、依赖方向和红线 | 创建错误 truth owner | 回指 boundary/依赖表 |
| 概要 | `projects/L5-sync/02-概要设计.md` | CP1～CP6、主流程和协议轮廓 | phase 顺序错误 | 回指 CP/flow |
| 详细 | `projects/L5-sync/03-详细设计.md` | 1:1 object/port/protocol/state/UoW 契约 | 实现端猜字段或状态 | Design Gate |
| 配置 | `projects/L5-sync/04-配置设计.md` | 42 leaf、profiles、activation、redaction | silent fallback/hot reload | Config Gate |
| 测试 | `projects/L5-sync/05-测试方案.md` | TC/SUITE/EV、G0～G7、证据路径 | 阶段无可验证门禁 | Test Gate |
| 验收 | `projects/L5-sync/06-验收标准.md` | AC/VETO、S/A/B/R、handoff | 误报通过/readiness | Acceptance Gate |
| TypeScript 编码 | `standards/coding/typescript.md` | 命名、module、strict/unknown、JSDoc | 代码 review 返工 | boundary read record |
| 目录组织 | `standards/document/子项目目录与代码文件组织规范.md` | 实现仓、文件、scripts、artifact/report 路径 | 仓/路径污染 | Scope Gate |
| 真相源标准 | `standards/document/设计真相源闭环与可落码性标准.md` | 字段/DTO/state/metadata/idempotency/phase 闭环 | 实现端补口 | Design Gate |
| 07 SOP/书写/台账 | `standards/document/实施计划讨论流程_SOP.md`、`实施计划书写规范.md`、`代码实施台账与门禁规范.md` | phase、boundary、ledger、commit/handoff | 无法交付 | 07 review checklist |
| 专项上游 | L0-sdk、L1-identity、L1-work、L1-governance、L1-artifact、L1-workspace、L4-archive、L4-observability 当前正式文档/台账 | owner surface、source、review、archive、diagnostic | 错误 adapter | 外部依赖矩阵 |

### 阶段实施前阅读矩阵（正式章节优先）

| 阶段 / boundary | 必读正式章节 | 必读 calibration | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| PH-01 / `commit-01-a/b` | 03 §3～§4、§7.1、§13；04 §3～§10；05 §8～§9 | `03_ddd_step_03_coding_runtime_constraints.md`、`03_ddd_step_04_units_file_layout.md`、`04_config_step_09_loading_validation_activation.md`、`05_test_plan_step_08_environment_config.md` | 锁 package/runtime、shared carrier、config builder、脚本边界 | target repo、toolchain、package choice、baseline 均可核验；否则 blocked |
| PH-02 / `commit-02-a/b` | 03 §5.2～§5.3、§9～§10；05 §3/§6；06 §5～§8 | `03_ddd_step_06_object_contracts.md`、`03_ddd_step_07_trait_port_adapter_contracts.md`、`03_ddd_step_10_state_matrix.md`、`03_ddd_step_11_persistence_transaction_consistency.md` | selection/access、binding、generation、logical metadata、UoW | 字段/DTO/state/ref/metadata 闭环通过 |
| PH-03 / `commit-03-a/b` | 03 §5.4、§8.2、§10～§12；05 §6/§10；06 §5～§9 | `03_ddd_step_09_function_flows.md`、`03_ddd_step_12_error_recovery.md`、`03_ddd_step_13_concurrency_idempotency.md` | clone/pull/materialize、dirty/path、cursor/mapping、unknown | source comparator/Git/fs contract known-safe；否则 waiting/blocked |
| PH-04 / `commit-04-a/b` | 03 §5.5、§9～§12；05 §6/§10；06 §8/§12 | `03_ddd_step_10_state_matrix.md`、`03_ddd_step_11_persistence_transaction_consistency.md`、`03_ddd_step_12_error_recovery.md` | 17 state、conflict/checkpoint/probe、resume/cancel、idempotency | transition/UoW/replay contract 1:1 |
| PH-05 / `commit-05-a/b` | 03 §5.6、§7.2/§7.3、§8；05 §6/§13；06 §7/§10/§11 | `03_ddd_step_08_protocol_contracts.md`、`03_ddd_step_15_observability_audit.md`、`06_acceptance_step_07_interface_sync_gate.md` | candidate/attempt/Decision layering、provenance、diagnostic | Governance/SDK review surface known; ACK 不等 accepted |
| PH-06 / `commit-06-a/b` | 03 §7/§14/§15、04 §7/§9/§11、05 §9/§13、06 §10～§14 | `03_ddd_step_16_test_cuts.md`、`04_config_step_09_loading_validation_activation.md`、`05_test_plan_step_13_evidence.md`、`06_acceptance_step_10_evidence_audit.md` | CLI/query/consumer/job、scripts、reports、handoff | runner/package/evidence schema 和 blocker map 已闭合 |

### 实施台账入口

| 台账 | 路径 | 作用 | 缺失时处理 |
|---|---|---|---|
| 项目级实施台账 | `projects/L5-sync/design-calibration/implementation_execution_ledger.md` | design baseline、current boundary、gate、blocker、next action | 先创建；不得改代码 |
| boundary 级台账 | `projects/L5-sync/design-calibration/implementation-boundaries/<boundary_id>.md` | required reads、allowed/forbidden scope、Gate Matrix、commit/handoff | 全部 skeleton 预创建后才可移交 |
| 实现仓 scratch | `/home/aris/Projects/quantalithos-sync/.codex/implementation_ledger.md` | 本地 touched files/commands/user changes | 目标仓存在后按项目规则决定；当前不存在 |

### Agent 启动与永久记忆种子

| 记忆 ID | 适用范围 | 必须写入的记忆文本 | 来源 | 刷新触发 | 失效条件 |
|---|---|---|---|---|---|
| `MEM-SYNC-001` | project/phase/boundary | 开始任何代码、配置、脚本或测试改动前，必须读取当前 boundary 所属技术栈规范、项目提交规范和目录组织规范；路径以正式 07 §3 为准。 | 07 规范 §3/书写规范 §5.3 | 首次开工、规范路径变化 | until superseded |
| `MEM-SYNC-002` | boundary | 提交前只暂存当前 boundary 文件，不得改写或纳入用户已有无关改动。 | 07 台账规范 §7.2/§7.3 | 每次提交前 | until superseded |
| `MEM-SYNC-003` | project/phase/boundary | 实现移交或 design baseline 变化前，按 phase/boundary 审计正式 03/05/06/07；未通过先回写设计并固定新 baseline。 | 真相源标准 §九、07 §12 | 移交前、baseline 变化 | until superseded |
| `MEM-SYNC-004` | project | 修复设计文档后先判断项目归属和提交合并方式，再检查是否产生可复用经验；需要时补标准/SOP/记忆及具体示例。 | 07 书写规范 §5.3 | 设计修复后、提交前 | until superseded |

所有种子只能机械投影，不得复制 03 的 schema、状态矩阵、DTO 或业务规则正文。

### 工具与环境前置检查

| 检查项 | 未来要求 | 当前状态 |
|---|---|---|
| 目标仓 | `/home/aris/Projects/quantalithos-sync` 存在且独立于 design repo | absent / blocked |
| TypeScript runtime | Node 版本、package manager、target 经 `SYNC-LOCAL-001/002` 确认 | local_pending |
| package/bin/parser/runner/Git library | 经 `SYNC-LOCAL-003/004/005` 确认 | local_pending |
| project git config | `git config user.name/email` 为项目要求，不能 `--global` | 未执行；未来检查 |
| scripts | gates/reports/checks/dev 的命名、参数和路径 | planned；未创建 |
| artifact/report roots | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | planned；无实例 |

## 回填草稿

正式 §3 将包含阅读清单、阶段阅读矩阵、台账入口、永久记忆种子、git 配置、TypeScript/目录规范和工具前置检查；当前所有执行检查均为 planned/blocked/waiting，不写实际环境通过结果。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| TypeScript 编码规范是否需项目专用增补 | 全部 boundary | PH-01 开工前 |
| Node/package manager/runner/Git library | package、scripts、tests | `commit-01-a` 开工前 |
| 目标仓 git identity/branch | Commit Gate | 首次实现移交前 |
| 是否启用 scratch ledger | 实现仓局部恢复 | 目标仓创建时 |

## 进入下一步条件

- [x] 阅读清单和按阶段矩阵已建立。
- [x] implementation ledger/boundary 入口已明确。
- [x] 永久记忆种子有来源、刷新和失效条件。
- [x] 未满足前置项已标为 blocker/waiting。
