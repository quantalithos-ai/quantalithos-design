# Step 3. 收稳前置条件与阅读清单

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 3
> 回填章节：未来正式 `07-实施计划.md` §3 实施前置条件与阅读清单
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration |
| `current_step` | `Step 3` |
| `current_module` | `prerequisites_reading_and_memory_seeds` |
| `gate_status` | `pass_for_step_04` |
| `gate_reason` | 全局/项目/阶段阅读清单、实施仓与依赖核验、脚本/证据路径、git 与工作区检查、永久记忆种子、implementation ledger 入口和失败处理均已明确；未授权技术栈保持条件性。 |
| `next_allowed_action` | 创建并完成 `07_implementation_plan_step_04_deliverables.md`；不得修改正式 07，不得创建 implementation ledger 或 boundary skeleton。 |
| `formal_07_write_allowed` | `false_until_step_13_assembly` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `commit_required` | `false` |

## 2. 本步目标、输入与非目标

本步定义未来实现者在任何代码、配置、脚本或测试改动前必须阅读和核验的内容，并将阶段/commit boundary 的阅读门禁、永久记忆种子和实现台账路径固化为计划输入。本步不选择语言、框架、仓库布局、脚本实现或真实环境，也不创建实现仓/台账实例。

### 2.1 本步输入

| 输入 | 用途 |
|---|---|
| Step 1 输入边界 | 固定正式 00～06、专项上游和标准的权威顺序与 blocker |
| Step 2 范围结论 | 确定各阶段需要读取的 P0 主链、P1/blocked lane 和非范围 |
| 实施计划 SOP/书写规范/中间产物规范 | 固定阅读清单、阶段矩阵、永久记忆、台账和写入门禁要求 |
| 可落码标准、代码实施台账规范 | 固定字段/DTO/state/phase 复核、Boundary Gate Matrix、Commit/Handoff Gate |
| 全局依赖规则、目录与代码组织规范、有效编码/提交规范 | 固定依赖类型、目标仓命名和技术规范来源；未获 authority 的规范只作条件性输入 |

### 2.2 非目标

- 不把 `standards/coding/rust.md` 变成 Runner 已选 Rust 事实；若未来 authority 选择其他栈，必须替换为有效规范路径并刷新记忆种子。
- 不创建或修改 `/home/aris/Projects/quantalithos-runner`，不创建 Cargo/package/源码/test runner、脚本、fixture、artifact、report 或 implementation ledger。
- 不把阅读“完成”写成 build/test/evidence/readiness 通过；每个检查只记录 planned/blocked/waiting 条件。
- 不把永久记忆当作详细设计第二真相源；只保存执行规则和规范索引，不复制字段、DTO、状态矩阵或业务正文。

## 3. SOP 问题回答

| SOP 问题 | Runner 当前回答 | 依据与处理 |
|---|---|---|
| 1. 开始编码前必须读哪些文档？ | 先读正式 00～06；再读当前 boundary 对应的 03/04/05/06 calibration；随后读 07（生成后）、SOP/书写规范、中间产物规范、可落码标准、代码实施台账规范、全局依赖规则、目录组织规范、有效语言规范和提交规范。 | 正式文档优先；calibration 只解释；冲突暂停回写 owner 文档。 |
| 2. 每个阶段/boundary 需要读什么？ | 由阶段阅读矩阵按功能增量列出，不要求实现者一次性阅读整个 calibration 目录；当前 Step 5/6 才会将矩阵绑定到具体 phase/boundary。 | 满足“按阶段读取影响判断的材料”规则，避免全量清单失去门禁意义。 |
| 3. 当前语言、runtime、shell、进程和 packaging 是什么？ | 未获正式 authority，保持 `RUN-DDD-002 / blocked`；阅读清单只列条件性规范，不写死 Rust/Tauri/CLI/GUI。 | `03` §3/§4；Step 1 blocker。 |
| 4. 目标实现仓和目录命名如何核验？ | 目标计划路径为 `/home/aris/Projects/quantalithos-runner`，当前不存在；创建/确认、manifest、workspace/package/crate/binary、源码命名和 test runner 必须在实现移交前核验。 | `RUN-DDD-001/002`；目录规范；不得本仓代建。 |
| 5. sibling 依赖如何分类？ | `L0-core/L0-sdk` 与 Artifact/Governance/Work/Runtime/Sandbox/Observability/Archive 按编译期/运行期/事件协作分别核验；仅正式确认的编译期依赖可在实现仓使用 path dependency，运行期/事件协作不得写成 path dependency。 | 全局依赖规则 §2/§5；`01`/`03` 依赖裁剪。 |
| 6. git 与工作区要检查什么？ | 在实现仓按项目级 `git config user.name/user.email` 检查；确认设计 baseline、用户改动清单、staged scope、无 unrelated changes、whitespace 和有效提交格式。当前设计仓不提交，未填写 hash。 | 实施计划 SOP/书写规范、Commit Gate；Step 11/12 再收口。 |
| 7. 脚本、artifact 和 report 路径如何前置？ | 未来实现仓检查 `scripts/gates/`、`scripts/reports/`、`scripts/checks/`、可选 `scripts/dev/`；raw 统一 `artifacts/test/<run_id>/`，reports 统一 `reports/runs/<run_id>/`、`reports/acceptance/`、`reports/review/`；所有命令显式 `--run-id`/root/profile，不得 `latest`。 | `05` §9/§13；`06` §3/§10；实例当前不存在。 |
| 8. implementation ledger 何时、如何读？ | `implementation_execution_ledger.md` 和全部 boundary skeleton 仅在 Step 13 正式装配完成时创建；未来每次继续、改码、跑 gate、提交和 handoff 前先读项目级实施台账与唯一 current boundary。 | 中间产物规范、实施计划规范、代码实施台账规范。 |
| 9. 永久记忆写什么？ | 只机械投影 Step 3 表中的执行规则、规范索引、刷新触发、失效和冲突处理；不复制详细设计 truth，不自由总结。 | 书写规范 §5.3；种子表见 §7.4。 |
| 10. 设计修复后如何沉淀经验？ | 先判断是否同一项目及是否应 amend/合并提交；再判断是否可复用，必要时更新标准/SOP/项目记忆并添加具体正反例；仅本项目不可泛化的文字修正不扩散。 | 实施计划规范永久记忆规则；当前不新增标准修改。 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| 目标实现仓不存在 | 无法核验实际 manifest、workspace、package、test runner | 作为 `RUN-DDD-001` 前置 gate；计划只列核验/创建条件 |
| 技术栈与目录尚未获 authority | 无法指定命令、源码路径、编码规范或 binary | 条件性阅读规范；Step 8/9 继续 blocked，不从 README 继承 |
| L0-sdk exact surface 和上游 seam 未闭合 | 无法写具体 adapter 读取清单或 integration command | 按 semantic port/blocked lane 阅读；exact surface 到达后重开受影响 Step |
| 当前无 implementation ledger/boundary | 实现者缺少恢复和提交状态入口 | 记录未来创建时序；Step 13 才生成实例 |
| `05/06` planned evidence 路径可能被误当事实 | 会导致静态证据或 `latest` 污染 | 明确路径是合同；run/artifact/report/evidence 实例当前不存在 |
| 永久记忆容易复制业务 schema | 形成第二真相源、过时后难刷新 | 只保留规则索引和执行禁令，完整 truth 回指正式文档 |

## 5. 改动前后对比

| 项 | 改动前 | 本步完成后 | 理由 |
|---|---|---|---|
| 阅读要求 | 上游文档虽存在但没有阶段化门禁 | 建立全局清单与按 phase/boundary 的矩阵骨架 | 让实现者在正确时点读取正确真相源 |
| 技术规范 | README/旧 03 可能被误当技术 authority | 明确语言/目录/提交规范必须来自 authority，未定时保持 blocked | 防止技术选择污染实施计划 |
| 脚本/证据路径 | 05/06 有合同但无前置检查汇总 | 固定 scripts、artifact、report 和显式 run/profile 参数检查 | 防止实现期重建路径或使用 latest |
| 台账 | implementation ledger 尚未建立 | 固定 Step 13 创建、唯一 current boundary 和恢复顺序 | 防止提前伪造实现状态 |
| 永久记忆 | 容易由 agent 自由总结 | 形成可机械投影的种子表和生成门禁 | 保持规则可审计、可刷新 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在 Step 3 直接选择 Rust/Tauri 规范 | 后续命令具体 | 当前没有 authority，易继承 README 历史选择 | 不采用 |
| 只列全局文档清单 | 简单 | 无法判断某阶段真正影响实现的来源 | 不采用 |
| 只列每个 boundary 的完整全文档 | 追溯充分 | 清单膨胀，且 phase 尚未定义时无法准确裁剪 | 不采用 |
| 全局必读清单 + Step 5/6 细化阶段矩阵 | 兼顾完整性与按需读取 | 需要后续 Step 回填矩阵 | 采用 |
| 现在创建 implementation ledger | 早期可见 | 没有 boundary 结果，容易伪造/返工 | 不采用 |

## 7. 结构化中间产物

### 7.1 全局实施前阅读清单

| 文档/资源 | 路径 | 阅读目的 | 当前状态/未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求 | `projects/L5-runner/00-需求文档.md` | 范围、FR/BR/NFR/AC、owner/禁止行为 | formal stop review；漏读会扩大范围 | 实现移交 checklist |
| 架构 | `projects/L5-runner/01-架构设计.md` | Layer 5、truth ownership、依赖方向、技术中立 | formal stop review；漏读会越过边界 | Design Gate |
| 概要 | `projects/L5-runner/02-概要设计.md` | 六组成部分、对象/接口/flow/state 轮廓 | formal stop review；漏读会重组主语 | Design Gate |
| 详细 | `projects/L5-runner/03-详细设计.md` | 模块、对象、port、protocol、flow、state、UoW、错误、幂等、配置、观测 | semantic ready / physical blocked | 每 boundary required_reads |
| 配置 | `projects/L5-runner/04-配置设计.md` | 41 项、四 profile、strict source、builder/readiness、failure/rollback | formal stop review；实例未创建 | config/builder gate |
| 测试 | `projects/L5-runner/05-测试方案.md` | CUT/TC/suite/evidence、T0～T4、脚本和回归 | planned/not_run | Test/Evidence Gate |
| 验收 | `projects/L5-runner/06-验收标准.md` | AC/AR/TX/NFA/VETO、entry/exit、fixed-run、verdict 语义 | not_entered | Acceptance Gate |
| 03 承接 | `design-calibration/03_ddd_step_17_implementation_handoff.md` | 字段/DTO/state/phase 审计入口和回写规则 | completed;再次按 boundary 复核 | Design Gate |
| 03 风险 | `design-calibration/03_ddd_step_18_risks_open_questions.md` | blocker、技术中立和重开触发 | completed_with_blockers | Spike/Change Gate |
| 03 test cuts | `design-calibration/03_ddd_step_16_test_slices.md` | 每模块/协议/state/UoW 的最小测试入口 | planned | Test Gate |
| 04 config details | `design-calibration/04_config_step_01_upstream_boundary.md`、`04_config_step_03_control_plane.md`、`04_config_step_07_config_items.md`、`04_config_step_09_loading_validation_activation.md`、`04_config_step_10_change_audit_rollback.md`、`04_config_step_12_downstream_handoff.md` | 配置来源、字段、builder、变更与实施承接 | completed;实例 blocked | Config Gate |
| 05 test details | `design-calibration/05_test_plan_step_03_test_objects_cuts.md`、`05_test_plan_step_04_strategy_layers.md`、`05_test_plan_step_06_cases.md`、`05_test_plan_step_08_environment_config.md`、`05_test_plan_step_09_automation_gates.md`、`05_test_plan_step_13_evidence.md`、`05_test_plan_step_14_regression_risks.md` | 按阶段绑定 CUT/TC/suite/evidence 与运行限制 | planned/not_run | Test/Evidence Gate |
| 06 acceptance details | `design-calibration/06_acceptance_step_03_baseline.md`、`06_acceptance_step_04_entry_exit.md`、`06_acceptance_step_05_function_gate.md`、`06_acceptance_step_10_observability_evidence.md`、`06_acceptance_step_11_veto.md`、`06_acceptance_step_14_final_decision_signoff.md` | baseline、entry/exit、功能、证据、VETO 和签署边界 | not_entered | Acceptance Gate |
| 07 SOP/规范 | `standards/document/实施计划讨论流程_SOP.md`、`实施计划书写规范.md`、`设计文档讨论中间产物规范.md` | Step 1～13、阶段/提交/永久记忆/装配规则 | authority | 文档自检 |
| 可落码/台账 | `standards/document/设计真相源闭环与可落码性标准.md`、`代码实施台账与门禁规范.md` | boundary 复核、ledger、Commit/Handoff Gate | authority | 每 boundary gate |
| 全局依赖/目录 | `standards/document/全局项目依赖关系与裁剪规则.md`、`子项目目录与代码文件组织规范.md` | 依赖类型、目标仓和命名约束 | authority | PH-01/Design Gate |
| 编码/提交规范 | `standards/coding/<authority-language>.md`、有效项目提交规范 | 技术栈编码、提交 message、git 配置 | language pending | Step 8/11 核验；不硬编码 Rust |

### 7.2 阶段实施前阅读矩阵（骨架，Step 5/6 回填 boundary）

| 阶段/边界 | 必读正式章节 | 必读 calibration | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| PH-01 计划性仓/配置/工具前置 | `03` §3～§4；`04` §3～§12；`05` §8～§9；`06` §3～§4 | 03 Step 3/4/17/18；04 Step 3/9/10/12；05 Step 8/9；06 Step 3/4 | 核验目标仓、技术 authority、配置 builder、脚本/路径和环境身份 | `RUN-DDD-001~003`、baseline、命名和工具检查明确；当前 blocked |
| PH-02 context/selection/material | `03` §5～§9；`05` §3～§6；`06` §5～§8 | 03 Step 5～10/16；05 Step 3/6；06 Step 5/6/8 | 字段、协议、状态、UoW、selection/integrity 测试和 AC 绑定 | Design Gate 通过；exact Artifact/Governance seam 未闭合则只走 negative/blocked |
| PH-03 request/control/resource/recovery | `03` §8～§12；`05` §3/§6/§10/§14；`06` §5～§9/§11 | 03 Step 9～13/16；05 Step 6/10/14；06 Step 5/8/9/11 | Accepted/Running、control/cleanup、Unknown/no-replay 和 VETO | Sandbox/Runtime/platform seam 或 durable store 缺失则 blocked |
| PH-04 preview/diagnosis/handoff/query | `03` §5～§8/§14；`04` §7～§11；`05` §3/§9/§13；`06` §10 | 03 Step 8/9/15/16；04 Step 7/9/11；05 Step 9/13；06 Step 10 | safe surface、redaction、Query no-write、handoff≠evidence | Observability exact seam 缺失则 blocked/controlled negative |
| PH-05 consumer/jobs/automation | `03` §5/§7/§8/§12/§14；`05` §3/§9/§13/§14；`06` §7/§10/§12 | 03 Step 8/9/12/15/16；05 Step 9/13/14；06 Step 7/10/12 | header-first Consumer、5 Job、report/claim/checkpoint、fixed-run 产物 | transport/job runner 未定则 planned/blocked |
| PH-06 selected integration/release handoff | `03` §13～§16；`04` §9～§13；`05` §8～§14；`06` §3～§14 | 03 Step 17/18；04 Step 12/13；05 Step 8/13/14/15；06 Step 3/10/12/14 | adapter slot、环境、Evidence/VETO/risk/handoff | 真实 baseline/run/owner/GRC 缺失则 blocked/not_run |

该表是阶段矩阵骨架，不授权任何 phase；Step 5/6 必须把实际 phase/boundary 编号、允许范围和 required checks 逐项回填。

### 7.3 前置检查与失败处理

| 检查面 | 通过标准 | 当前状态 | 失败处理 |
|---|---|---|---|
| 实现仓 | `/home/aris/Projects/quantalithos-runner` 存在、路径偏离已登记 | `RUN-DDD-001 / blocked` | 停止实现移交；不在 design 仓代建 |
| 技术 authority | 语言/runtime/shell/process/packaging 与编码规范已批准 | `RUN-DDD-002 / blocked` | 保持逻辑计划；回写 authority/ADR |
| 目录/命名 | workspace/package/crate/binary/module/file 与目录规范一致，无层级泄漏 | 未核验 | PH-01 阻塞，修正设计或实现仓 |
| sibling 依赖 | 目录存在、依赖类型与使用方式一致，仅确认 compile 依赖可 path | `RUN-UP-008`/专项 pending | 缺失或类型冲突即 blocked；不私连源码 |
| git identity | 项目级 `user.name`/`user.email` 有效，非 global 临时覆盖 | 未核验 | Commit Gate 阻塞 |
| design baseline | 00～07 与 calibration 可复现且无未登记改动 | 未固定 | Handoff Gate 阻塞；不填写 hash |
| script roots | `scripts/gates|reports|checks`（及必要 dev）职责清楚 | 未创建 | Step 4/8 规划交付物；不把 output 目录当脚本目录 |
| artifact/report | 显式 run id、固定 roots、same-run pairing、无 latest | 计划合同 | 路径审计失败则 Evidence/VETO 阻塞 |
| test environment | profile、fixture、clock/id/digest、fake/controlled/disabled 隔离 | 未创建 | Test Gate blocked/not_run |
| external seam | owner public contract、version、error/redaction/trace、scope/lease 等已闭合 | `RUN-UP-001~008 / blocked/pending` | 只运行 negative/blocked；正向 lane 不授权 |

### 7.4 Agent 启动与永久记忆种子表

永久记忆只允许机械投影下表“必须写入的记忆文本”，不允许自由总结，不复制详细设计 truth。技术规范路径必须由未来 §3 阅读清单中的 authority-language 替换；当前不生成实际记忆。

| 记忆 ID | 适用范围 | 类别 | 必须写入的记忆文本 | 规范路径来源 | 刷新触发 | 失效条件 | 冲突处理 | 禁止改写 |
|---|---|---|---|---|---|---|---|---|
| `MEM-RUN-001` | project/phase/boundary | 设计边界 | 开工前必须以正式 `03/04/05/06/07` 与当前 boundary required_reads 为准；字段、DTO、状态、phase、evidence 缺口不得由实现者自行补写。 | `07` §3（未来）/本 Step | 每次设计 baseline 或 boundary 变化 | 规范/正式文档更新 | 正式文档优先，暂停并刷新 | 是 |
| `MEM-RUN-002` | project/phase/boundary | 依赖与安全 | 只经正式 SDK/API/public adapter；不得复用 Sandbox 私有实现、直连内部 DB/bus/topic、反写 owner truth 或把 local record 当 evidence。 | `01`、`03`、`06` | 依赖 seam/安全规则变化 | boundary superseded | 正式边界优先，暂停 | 是 |
| `MEM-RUN-003` | project/phase/boundary | 证据路径 | 所有运行命令显式使用固定 `<run_id>`、`artifacts/test/<run_id>/` 与 `reports/.../<run_id>`；禁止 `latest`、跨 run 拼接和静态证据。 | `05` §9/§13、`06` §3/§10 | evidence/path 规则变化 | 路径合同替换 | 正式 05/06 优先 | 是 |
| `MEM-RUN-004` | project/phase/boundary | 状态/恢复 | `Accepted≠Running`、`Complete≠Verified≠Qualified`、`Confirmed≠Cleaned`；Unknown/commit-unknown 必须 freeze + RecoveryCase，禁止自动 replay/resend/reclaim/resume。 | `03` §9～§12、`06` §8 | 状态/恢复设计变化 | 正式状态矩阵替换 | 正式 03 优先 | 是 |
| `MEM-RUN-005` | project/phase/boundary | 测试门禁 | planned TC/suite/slot 不等执行或通过；blocked/not_run/incomplete 不得伪装 pass/readiness。 | `05` §6/§12～§14、`06` §3/§12 | 测试/验收规则变化 | 新正式 05/06 baseline | 正式文档优先 | 是 |
| `MEM-RUN-006` | project/phase/boundary | 实施台账 | 每次继续、改码、跑 gate、提交和 handoff 前先读项目级 implementation ledger 与唯一 current boundary；未来 boundary 保持 planned/waiting。 | 07 §11/§12（未来）、台账规范 | ledger/boundary 变化 | 当前台账优先 | 暂停并刷新 | 是 |
| `MEM-RUN-007` | project/phase/boundary | 经验沉淀 | 设计修复后先判断是否同项目及是否需要 amend/合并；可复用经验才更新标准/SOP/项目记忆并加入具体正反例。 | 07 §3（未来）、实施计划规范 | 设计修复/提交后 | 项目规则更新 | 正式规范优先 | 是 |

#### 永久记忆生成门禁

只有当未来正式 `07` §3 具备稳定种子表、来源、刷新触发、失效条件和冲突处理，并通过项目/文档/Step 三层检查时，才允许机械生成记忆。当前 `implementation_ledger_allowed=false_until_step_13_assembly`，因此本 Step 不生成任何实际永久记忆文件。

### 7.5 实施台账入口（计划合同）

| 台账 | 计划路径 | 创建时机 | 读取时机 | 缺失处理 |
|---|---|---|---|---|
| 项目级实施台账 | `projects/L5-runner/design-calibration/implementation_execution_ledger.md` | Step 13 正式 07 装配完成时 | 每次继续/换 agent/design baseline 变化 | 不得改码；回到设计侧补建 |
| boundary 台账 | `projects/L5-runner/design-calibration/implementation-boundaries/<boundary_id>.md` | Step 13 按最终 Boundary Gate Matrix 一次性预创建全部 skeleton | 当前 boundary 改码、gate、提交、handoff 前 | 缺当前或未来 skeleton 均不得移交 |
| 实现仓 scratch 台账 | `<implementation_repo>/.codex/implementation_ledger.md` | 仅在正式 07 明确要求且实现仓存在时 | 本地恢复工作区状态 | 按正式 07 标记 required/not_applicable；不得在 design 仓代建 |

### 7.6 当前事实与允许动作

| 项 | 当前值 | 允许动作 |
|---|---|---|
| target implementation repo | 不存在 | 继续设计计划；实现移交前阻塞 |
| language/runtime/shell | 未授权 | 只保留条件性阅读规范和 gate |
| local store/cache backend | 未定 | 只规划 guarantees/adapter contract |
| external positive seams | `RUN-UP-001~008 blocked/pending` | 规划 negative/blocked/conditional lane |
| scripts/artifacts/reports/evidence | 仅计划合同 | Step 4/7/8/12 定义交付和门禁，不创建实例 |
| implementation ledger/boundary skeleton | 不存在 | Step 13 才创建 |

## 8. 回填草稿（未来正式 07 §3）

> 校准来源：`design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
>
> 延伸阅读：请继续阅读本文件的“全局实施前阅读清单”“阶段实施前阅读矩阵”“前置检查与失败处理”“永久记忆种子表”和“实施台账入口”。

未来正式 §3 应要求实现者先阅读正式 `00`～`06`、当前 07 及对应 calibration 来源，再按阶段/commit boundary 读取影响当前判断的章节；正式文档优先，冲突时暂停回写真相源。目标实现仓、语言/runtime/shell/process、目录命名、sibling 依赖、git identity、脚本 roots、固定 run/artifact/report 路径、环境 profile、外部 seam 和 design baseline 必须在实现移交前逐项核验。实现仓和 exact technology 当前未获 authority，故不写死语言或命令。永久记忆只允许从稳定种子表机械投影执行规则和规范索引；不复制 schema、状态或业务正文。项目级 implementation ledger 与所有 planned boundary skeleton 仅在正式 07 Step 13 装配完成时创建。

## 9. 待确认事项

| 事项 | 影响 | 处理时点 | 当前状态 |
|---|---|---|---|
| 语言/runtime/shell 与有效编码规范路径 | 影响物理目录、命令和永久记忆来源 | Step 8/9 | `RUN-DDD-002 / blocked` |
| 目标实现仓、manifest、test runner 和 workspace/package 命名 | 影响 PH-01 与全部 boundary | Step 4/8 | `RUN-DDD-001 / blocked` |
| L0-sdk exact package/client/error/redaction/trace | 影响 adapter 阅读和 positive integration | Step 8/9 | `RUN-UP-008 / pending` |
| Artifact/Governance/Sandbox/Runtime/Observability/Archive exact public seam | 影响阶段阅读和 T2/T3 gate | Step 5/7/8/9 | `RUN-UP-001~007 / blocked` |
| git 提交规范与项目级 identity | 影响 Commit Gate | Step 11 | 尚未核验 |
| baseline 与用户未提交改动清单 | 影响 Handoff Gate | Step 11/12/13 | 未固定，不伪造 hash |
| scripts、environment、fixture、redaction corpus | 影响 Test/Evidence Gate | Step 4/7/8 | 未创建，计划合同 |

## 10. 进入下一步条件

- [x] 全局阅读清单与按阶段读取原则已固定。
- [x] 目录、依赖、git、脚本、artifact/report、环境和 external seam 的检查与失败处理已明确。
- [x] 永久记忆种子、生成门禁、刷新/失效/冲突处理已定义，且未生成实际记忆事实。
- [x] implementation ledger 与 boundary skeleton 的路径、创建时机和缺失处理已定义，当前仍未创建。
- [x] 技术栈未授权、目标仓不存在和正向 seam blocker 均保持开放。
- [x] 允许进入 Step 4；下一步只能创建 `07_implementation_plan_step_04_deliverables.md`。

