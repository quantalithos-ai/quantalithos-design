# 07 Step 3：收稳前置条件与阅读清单

## Step 状态

`completed_with_explicit_blockers`

## 本步输入

| 输入 | 来源 | 目的 |
|---|---|---|
| Step 1 输入边界 | `07_implementation_plan_step_01_input_boundary.md` | 识别实施前置与阻塞上限 |
| Step 2 范围 | `07_implementation_plan_step_02_scope.md` | 裁剪阅读与环境检查 |
| 实现契约 | `03-详细设计.md` §4~§17 | 绑定模块、字段、协议、状态和边界 |
| 配置/测试/验收 | `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` | 绑定 profile、gate、evidence 与停止条件 |
| 通用规范 | 实施计划 SOP/书写规范、Rust、目录、台账、可落码标准 | 约束实现移交纪律 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 必读文档 | 正式 00~07、当前项目级/边界台账、当前 boundary 来源 Step、Rust/目录/实施/台账/可落码规范 | SOP Step 3、书写规范 §5.3 |
| 目标技术栈 | planned Rust workspace；edition/MSRV/toolchain 只能在目标仓 preflight 确认 | 03 §3/§4；Rust 规范 |
| Git 配置 | 未来目标仓使用项目级 `quantalithos-labs` / `quantalithos.ai@gmail.com`；本轮未执行 | 实施计划规范 §4.9 |
| 目标仓布局 | `/home/aris/Projects/quantalithos-member-images`，七 `crates/<role>`；当前目录 absent | 03 §4；目录组织规范 |
| 当前依赖 | active sibling Cargo dependency 为零；仅 MI-UP-004 关闭后可评估 Core path dependency | 03 §3、04 §5 |
| 脚本/证据路径 | `scripts/gates`、`scripts/reports`、`scripts/checks`；raw `artifacts/test/<run_id>`；reports `reports/runs/<run_id>` 和 `reports/acceptance` | 05 §9/§13 |
| 记忆规则 | 只能机械投影本文件种子；不复制 schema、状态矩阵或临时 blocker | SOP Step 3、书写规范 §5.3 |
| 不能满足前置项时 | 标记 `blocked`，下一动作 `wait_design` 或 `handoff`；不在实现仓自行补口 | 台账规范 §4/§8 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 实现仓目录不存在 | 无法检查 manifest、crate、binary、toolchain、git identity | 设为 PH-01 activation blocker |
| Core exact package/API 未核验 | 不能写 path dependency 或复制 shared carrier | active compile dependency 保持零 |
| Rust 规范未覆盖未发布主题 | unsafe、并发、性能等只能按正式设计与门禁处理 | 不以 lint 通过替代设计闭环 |
| 项目存在大量 calibration | 全量必读会掩盖 boundary 重点 | 用阶段实施前阅读矩阵按需读取 |
| 设计 blocker 影响不同阶段 | 可能误把一个 blocker 扩大成全仓阻断或反之 | 在矩阵中绑定受影响 boundary |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 阅读清单 | 只有 03 Step 17 的泛化列表 | 正式文档、规范、台账与阶段校准入口分层列出 | 让实现者可恢复 |
| 阶段阅读 | 无按 phase/boundary 入口 | 8 phase + 24 boundary 的 scoped matrix | 防止漏读或过度阅读 |
| 前置检查 | 目标仓、脚本和依赖未核验 | 逐项定义检查方式与失败处理 | 失败不被“准备环境”掩盖 |
| 永久记忆 | 可能由 agent 自由总结 | 10 条可机械投影种子、含失效与冲突规则 | 避免第二真相源 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 将所有上游文档设为每个 boundary 必读 | 不易漏信息 | 负担大、无法突出当前契约 | 不采用 |
| 只读正式 03，不读 calibration | 简洁 | 丢失 blocker、历史取舍与 gate 来源 | 不采用 |
| 正式文档为基线，按 boundary 读取具体 calibration | 可审查、可恢复、冲突有规则 | 需要维护矩阵 | 采用 |

## 结构化中间产物

### 全局必读清单

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求 | `projects/L2-member-images/00-需求文档.md` | 确认五 capability、FR、owner、VETO | 范围膨胀 | 能回指本轮 F/AC |
| 架构 | `projects/L2-member-images/01-架构设计.md` | 确认分层、依赖与 truth ownership | 反向依赖 | 画出 inward dependency |
| 概要 | `projects/L2-member-images/02-概要设计.md` | 确认对象/流程骨架 | 按对象错拆阶段 | 说明 capability 与 crate 正交 |
| 详细 | `projects/L2-member-images/03-详细设计.md` | 直接实现契约 | 私补字段/状态 | boundary 复核表 |
| 配置 | `projects/L2-member-images/04-配置设计.md` | strict JSON、21 key、profile | silent fallback | 配置负向样本清单 |
| 测试 | `projects/L2-member-images/05-测试方案.md` | TC/EV/suite/path | 末尾补测 | 阶段 gate 映射 |
| 验收 | `projects/L2-member-images/06-验收标准.md` | AC/VETO/风险/证据上限 | false pass | 进入/退出检查 |
| 实施 SOP | `standards/document/实施计划讨论流程_SOP.md` | Step、phase、boundary 规则 | 漏字段或顺序 | Step 文件结构 |
| 实施书写规范 | `standards/document/实施计划书写规范.md` | 正式 13 章与提交规则 | 文档不可执行 | 章节审计 |
| 台账规范 | `standards/document/代码实施台账与门禁规范.md` | gate 状态、恢复、handoff | 无证据推进 | ledger schema |
| 目录规范 | `standards/document/子项目目录与代码文件组织规范.md` | repo/package/crate/file 命名 | 层级泄漏 | mapping table |
| Rust | `standards/coding/rust.md` | 源码命名、Rustdoc、英文边界 | review 返工 | preflight 阅读记录 |
| 可落码标准 | `standards/document/设计真相源闭环与可落码性标准.md` | 字段、DTO、state、UoW、projection、artifact 复核 | 实现端补设计 | boundary experience review |

### 阶段实施前阅读矩阵

| Phase / boundary | 必读正式章节 | 必读 calibration | 开工门禁 |
|---|---|---|---|
| PH-01 / commit-01-a~c | 03 §3~§5；04 §3~§7；05 §9；06 §3~§4 | `03_ddd_step_03_constraints.md`、`03_ddd_step_04_file_layout.md`、`04_config_step_09_loading_validation_activation.md`、`05_test_plan_step_09_automation_gates.md` | 目标仓、workspace 命名、baseline、toolchain、脚本根和依赖分类均可核验；否则 blocked |
| PH-02 / commit-02-a~c | 03 §5~§6、§9；00 §9~§10；05 §6；06 §5~§6 | `03_ddd_step_06_object_contracts.md`、`03_ddd_step_08_protocol_contracts.md`、`03_ddd_step_10_state_matrices.md` | definition/assembly 字段、mapping/ref 失败上限与状态名可 1:1 构造；MI-UP-002/003/006/008 未闭则正向 blocked |
| PH-03 / commit-03-a~c | 03 §7~§12；05 §6/§10；06 §5/§8 | `03_ddd_step_08_protocol_contracts.md`、`03_ddd_step_09_function_flows.md`、`03_ddd_step_11_persistence_consistency.md`、`03_ddd_step_13_concurrency_idempotency.md` | B01/B02、attempt/snapshot/result/replay 结论已闭；否则只做 zero-effect |
| PH-04 / commit-04-a~c | 03 §7、§9~§13；04 §7~§11；05 §6/§10；06 §5/§9 | `03_ddd_step_08_protocol_contracts.md`、`03_ddd_step_12_error_recovery.md`、`04_config_step_11_failure_degradation.md` | gate/provenance/Artifact 只保留 safe gap；Q-MI-004/MI-UP-007 未闭则 blocked |
| PH-05 / commit-05-a~c | 03 §7~§10、§14~§16；05 §6/§9；06 §5~§10 | `03_ddd_step_06_object_contracts.md`、`03_ddd_step_09_function_flows.md`、`03_ddd_step_10_state_matrices.md`、`03_ddd_step_16_test_seams.md` | availability/entry 与 consumer gap 分层；B03/MI-UP-001 未闭则不宣称 resolved |
| PH-06 / commit-06-a~c | 03 §6~§9、§14~§16；04 §9/§11；05 §6/§9/§13；06 §7~§10 | `03_ddd_step_07_trait_port_adapter_contracts.md`、`03_ddd_step_09_function_flows.md`、`03_ddd_step_15_observability_audit.md` | Query view、projection source、freshness/no-write 可核验；PF 未闭则 recovery blocked |
| PH-07 / commit-07-a~c | 03 §7~§8、§12~§16；05 §6/§9/§13；06 §7~§12 | `03_ddd_step_08_protocol_contracts.md`、`03_ddd_step_09_function_flows.md`、`03_ddd_step_16_test_seams.md` | inbound 仅 marker-only；Job 仅 bounded action；无 scheduler/receipt/report |
| PH-08 / commit-08-a~c | 04 §8~§13；05 §9~§14；06 §3/§10~§14 | `05_test_plan_step_09_automation_gates.md`、`05_test_plan_step_13_evidence.md`、`06_acceptance_step_10_evidence_audit.md` | 只能从固定 run 的 raw artifact 生成报告；当前不执行 |

边界级矩阵沿用相应 Phase 行，并在每个 boundary skeleton 中列出精确 required reads；正式文档与 calibration 冲突时以正式文档为准。

### 台账与路径前置检查

| 前置项 | 要求 | 检查方式 | 当前状态 | 失败处理 |
|---|---|---|---|---|
| 项目级实施台账 | `design-calibration/implementation_execution_ledger.md` | 文件存在且 current 唯一 | 本轮将创建 | 缺失不得改代码 |
| boundary 台账 | `design-calibration/implementation-boundaries/<boundary>.md` | 24 个 planned skeleton 集合相等 | 本轮将创建 | 不得移交实现 |
| 实现仓 scratch | `/home/aris/Projects/quantalithos-member-images/.codex/implementation_ledger.md` | 目标仓存在后检查 | absent/未核验 | 按项目规则决定，不在设计仓代建 |
| workspace/package/crate | 七 `crates/<role>` 与 `member-images-*` / `member_images_*` | 检查 Cargo.toml | 未核验 | PH-01 blocked |
| binary | 仅 jobs action candidates；api/worker binary 待 authority | 检查 manifest 与设计 | 未核验 | 不自行命名/创建 |
| Git identity | 项目级 user.name/email | `git config user.name/email` | 未执行 | Commit Gate blocked |
| toolchain | Rust 版本与 edition/MSRV | `rustc --version`、`cargo --version` | 未执行 | activation blocked |
| scripts | gate/report/check 目录与参数 | target repo 检查 | 未创建 | 作为 PH-01/PH-08 交付物 |
| evidence roots | 固定 run path，无 `latest` | script/config review | 未创建 | 不生成实例 |

### Agent 启动与永久记忆种子

| 记忆 ID | 适用范围 | 必须写入的记忆文本 | 来源 | 刷新触发 | 失效条件 | 冲突处理 |
|---|---|---|---|---|---|---|
| MEM-MI-001 | project/phase/boundary | 开始代码、配置、脚本或测试改动前，先读取项目级台账、当前 boundary 台账、正式 03~07 与 scoped calibration；缺失则停止。 | 07 §3、台账规范 | 首次开工/恢复 | until superseded | 正式文档优先，刷新种子 |
| MEM-MI-002 | project | 目标实现仓固定为 `/home/aris/Projects/quantalithos-member-images`；不存在时只能做 activation 记录，不能在设计仓实现。 | 03 §3/§17 | repo 创建或路径变化 | until superseded | 暂停并回报路径偏离 |
| MEM-MI-003 | project/phase | 当前 active sibling compile dependency 为零；只有 MI-UP-004 正式闭合并核验真实 Core package/crate/API 后才可评估 path dependency。 | 03 §3、04 §5 | Core contract 变化 | until superseded | 不复制/shadow |
| MEM-MI-004 | project/phase/boundary | 无法 1:1 闭合字段、DTO、state、ref、validation truth、UoW、replay、projection 或 artifact materialization 时，设置 `blocked / wait_design`，不得由实现者补口。 | 可落码标准 §九、03 §17 | baseline/设计变化 | until superseded | 回写 owning source |
| MEM-MI-005 | project/phase | Query 必须 strict read-only；当前 Command/Job 在 B01/B02 前 zero-effect；conditional inbound 恒为 marker-only 且 `accepted_input=false`；outbound inventory 为零。 | 03 §7~§9、05/06 | protocol/flow 变化 | until superseded | 正式文档优先 |
| MEM-MI-006 | project/phase | 只允许 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`/`reports/acceptance` 固定 run 配对；不得使用 `latest`、跨 run 拼接或静态 pass。 | 05 §9/§13、06 §3/§10 | evidence path 变化 | until superseded | 证据门禁阻断 |
| MEM-MI-007 | project/phase/boundary | 一笔 commit 只能对应一个 §6 boundary；提交前保护用户无关改动，提交后回写 hash、门禁、剩余 blocker 与下一 boundary。 | 实施书写规范 §4.9、台账规范 | 每次提交/handoff | until superseded | 暂停并重核 staged scope |
| MEM-MI-008 | project | `Assembled`、`Fresh`、`Available`、`Eligible`、`Resolved` 等 local 状态不得被解释为 runtime、Artifact、consumer 或 readiness。 | 03 §9、04 §3、06 §6 | 状态/验收变化 | until superseded | 回写状态语义 |
| MEM-MI-009 | project/phase | 交付实现前按 phase/boundary 审计正式 03/05/06/07；任一适用经验项为 blocker 时先回写并固定新 baseline。 | 实施书写规范 §5.3/§5.12 | 每次移交/baseline 变化 | until superseded | 不移交实现 |
| MEM-MI-010 | project | 修复设计后先判断改动是否同项目；再检查是否产生可复用经验，必要时补标准/SOP/项目种子与至少一个示例，并输出交接说明。 | 实施计划规范 §5.3 | 每次设计修复/提交前 | until superseded | 同项目 amend 规则仅在获授权提交时适用 |

种子表是机械投影唯一来源；不得把 03 字段表、19 状态矩阵、TC 全文、临时 blocker 或自由总结写入永久记忆。

## 回填草稿

实施者先读项目级实施台账，再读当前 boundary 台账和正式文档；根据阶段矩阵补读具体 calibration。目标仓、baseline、toolchain、Git identity、Core contract、owner seam、UoW/result/recovery 未核验或未闭合时，开工门禁保持 `blocked / wait_design`。未来实现仓源码默认遵守 Rust 英文标识符、Rustdoc、注释和测试名规则；设计仓中文说明不应复制到源码。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 目标仓建立与工具链 | PH-01 所有 boundary | commit-01-a activation 前 |
| Core package/crate/API | 可能的 compile seam | commit-01-a 设计 gate 前 |
| Rust edition/MSRV 与目标仓规范 | 所有 Rust boundary | 首次源码改动前 |
| Git identity 与当前工作树保护 | 所有 commit boundary | 首次提交前 |
| 24 个 boundary 是否需拆分/合并 | Step 5/6 稳定性 | 正式移交实现前 |

## 进入下一步条件

- [x] 全局阅读清单、阶段矩阵、台账路径和前置检查已定义。
- [x] 永久记忆种子可机械投影，且不复制设计 truth。
- [x] 未满足的环境/owner 条件已标记 blocker，不被写成 ready。
