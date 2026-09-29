# Step 3. 收稳实施前置条件与阅读清单

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 3
> 日期：2026-09-14
> 状态：`completed / prerequisites_closed_with_blockers / continue_authorized`

## 1. Step 状态与开工确认

| 项 | 结论 |
|---|---|
| 当前 Step | Step 3：收稳前置条件与阅读清单 |
| 输出文件 | 本文件；未来回填正式 `07-实施计划.md` §3 |
| 已读取通用规范 | `设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md`、`全局项目依赖关系与裁剪规则.md` |
| 已读取实施规范 | `实施计划讨论流程_SOP.md`、`实施计划书写规范.md`、`代码实施台账与门禁规范.md`、`子项目目录与代码文件组织规范.md` |
| 已读取项目输入 | 正式 `00～06`、Step 1/2、`03` §3/§4/§16、`04` §6/§7/§9/§12、`05` §8/§9/§13、`06` §3/§4/§10/§14 |
| 已读取粒度样本 | `L1-governance/07-实施计划.md`、`L1-workspace/07-实施计划.md` 及其 Step 3/4 calibration；只取粒度与台账方式，不复制领域主语 |
| 已核验的本地事实 | `/home/aris/Projects/quantalithos-archive` 不存在；`quantalithos-core` 存在，workspace edition=2024、rust-version=1.93；其余 sibling 只作为关系/存在性检查输入 |
| 当前模式 | `full-restart / single-agent-serial / continuous_authorization` |
| gate_status | `pass_with_blockers`（允许继续设计 Step 4；不授权创建实现仓或写代码） |
| gate_reason | 阅读、工具链、命名、台账和记忆种子规则已收稳；目标仓、immutable baseline、外部 exact contract 和本地 durable/codec pending 仍阻止 implementation activation |
| next_allowed_action | `create_and_complete_step_04_objects_deliverables` |

## 2. Step 内计划

- [x] 读取 Step 3 SOP、书写规范、台账规范与目录/编码规范。
- [x] 反查正式 `03/04/05/06` 的实施输入和 18 个 blocker/pending。
- [x] 核对目标实现仓、Core compile candidate、sibling 关系、Rust 版本和命名规则。
- [x] 建立全局阅读清单和按 phase/boundary 的阅读矩阵。
- [x] 建立项目级/ boundary 级/实现仓 scratch 台账入口及 gate 规则。
- [x] 建立可机械投影的永久记忆种子和生成门禁。
- [x] 记录历史材料污染、不可满足的前置项和 fail-closed 处理。
- [x] 自检并把文档级 flow / 项目台账推进到 Step 4。

复杂度判断：本 Step 规则面多但结论类型固定，采用“全局清单 + phase/boundary 矩阵 + 记忆种子 + 前置检查表”四块结构；不复制详细设计字段或状态正文。

## 3. SOP 问题回答

| 问题组 | 回答 | 依据 |
|---|---|---|
| 必读文档 | 实施者必须先读正式 `00～07`（07 进入实现时才存在）、当前 boundary 的 `design-calibration`、Rust 编码规范、目录规范、台账规范、闭环标准、依赖裁剪标准和提交历史。 | 实施计划 SOP §3；书写规范 §3/§4.6 |
| 技术栈 | 计划技术栈为 Rust 2024 / MSRV 1.93；源码标识符、rustdoc、普通注释和测试名默认英文；Rust 约定来自 `standards/coding/rust.md`，不得在记忆中自由改写。 | `03` §3；Rust 规范 §源码语言/文档注释 |
| 目标仓 | 目标路径固定为 `/home/aris/Projects/quantalithos-archive`。当前目录不存在；不能在设计仓代写实现，也不能把计划目录当实现仓。 | `03` §4；目录规范 §4 |
| Core 依赖 | 只有经实际 package/export/版本核验后，`/home/aris/Projects/quantalithos-core` 的 contracts 才可作为 compile candidate；当前只记录候选，不填写 baseline 或 symbol 事实。 | `03` §3/§13；`quantalithos-core/Cargo.toml` |
| 其他依赖 | L1 owners、workspace、artifact、observability、Bus、SDK、存储、integrity、receiver 依实际关系归为 runtime/event/ref/adapter/fake；不得伪装 Cargo path dependency。 | `01`/`03`；全局依赖规则 |
| 目录命名 | `crates/<role>`、package `<project>-<role>`、lib `<project>_<role>`；代码命名不出现 `L0`/`L1` 前缀。Archive 的 6 role 以正式 `03` 为准。 | `03` §4；目录规范 §5 |
| Git identity | 未来目标实现仓必须 project-local 检查 `quantalithos-labs` / `quantalithos.ai@gmail.com`，不得改 global；当前目标仓不存在，不能执行配置或声称通过。 | 实施计划 SOP Step 3；提交纪律 |
| 阶段阅读 | 每个 phase/boundary 开工前读取该边界会影响判断的正式章节和 calibration，不要求全量阅读目录；正式文档优先，正式不清楚再读 calibration，仍不清楚必须 `wait_design`。 | 中间产物规范 §3.3/§3.4.5 |
| 测试/报告工具 | 未来脚本放 `scripts/{gates,reports,checks,dev}`；raw 固定 `artifacts/test/<run_id>`，报告固定 `reports/runs/<run_id>` 与 `reports/acceptance`；CLI 至少接受 `--run-id --artifact-root --config-profile`；不使用 `latest`。 | `05` §9/§13；目录规范 §9/§10 |
| 台账入口 | 设计仓项目级 `implementation_execution_ledger.md`、全部 boundary ledger 和可选实现仓 `.codex/implementation_ledger.md` 必须在移交前存在；当前阶段只设计规则，Step 13 才创建 skeleton。 | 台账规范 §3/§12 |
| Gate 语义 | `pending/pass/blocked/not_applicable` 与 `read_docs/open_boundary/implement/run_gates/fix_gate_failure/commit/wait_design/handoff/start_next_boundary` 使用标准值；未有证据不能标 pass。 | 台账规范 §4/§7 |
| 永久记忆 | 只机械投影种子表中的执行规则和规范索引，不复制 DTO、state、业务规则或临时 blocker；每条有 ID、来源、刷新、失效、冲突处理。 | SOP Step 3；中间产物规范 §永久记忆 |
| 设计修复后 | 若修复属于本项目，检查是否需要同步标准/SOP/项目记忆并补具体正反例；若属于 owning project，只记录 blocker 和回流路径，不跨仓修改。 | 闭环标准 §九；用户范围约束 |
| 实施前总体审计 | 交付实现前必须按每个 phase/boundary 对正式 `03/05/06/07` 及必要 calibration 做闭环审计，固定 immutable design baseline 后才可能移交。 | 闭环标准 §9.1 |

## 4. 输入与事实核对

| 输入 / 检查 | 本步结论 | 实施影响 |
|---|---|---|
| 正式 `03` | 6 crates、26 objects、8 services、7 port families、30 logical/32 method surfaces、18 states、UoW/error/idempotency/side-effect/test cuts 已收稳 | 可按功能纵切规划；每个 boundary 仍需重新闭环复核 |
| 正式 `04` | 12 config domains、55 P0 keys、profile/source/assembly/failure/redaction 口径已收稳 | 可定义配置准备与 fail-closed 门禁；不填真实值/secret/provider |
| 正式 `05` | 18 CUT、102 TC、26 DS、13 suites、5 gates、14 scripts、19 EV families 为 planned 分母 | 可嵌入阶段门禁；当前没有脚本、run、artifact 或报告 |
| 正式 `06` | 9 FUNC、12 RL、34 protocol/sync、27 state/consistency、8 NFR、10 EVID、10 VETO 与三值规则已停审 | 可定义完成判定；不产生 verdict、risk acceptance、signoff |
| `03` handoff | local closed / blocked external / future document required 三类清楚；handoff=`not_ready / correctly_blocked` | 计划必须保留 required lane，不能以 fake 或 placeholder 关闭 |
| 目标实现仓 | 不存在 | 所有 implementation boundary 只能 planned/blocked/waiting；不能创建仓、Cargo manifest 或源码 |
| Core 实现仓 | 存在；实际 workspace 为 Rust 2024、rust-version 1.93，contracts package 名为 `core-contracts` | 仅证明候选路径形状；仍需在实现前核验 exports/lock/compatibility |
| owner sibling | identity/conversation/work/process/governance 已存在；artifact/observability 实现仓路径未核验为存在 | 存在性不代表 contract ready；Archive 只记录 dependency classification/blocker |

## 5. 全局阅读清单

| 文档 / 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|
| `projects/L4-archive/00-需求文档.md` | A1～A9、F/BR/NFR、owner/禁止面 | 把旧归档模型或治理决策带入实现 | boundary required-read record |
| `projects/L4-archive/01-架构设计.md` | 6 U、依赖类型、source-authority、通信方向 | 错把 runtime/ref/event 当 compile | dependency gate |
| `projects/L4-archive/02-概要设计.md` | 6 CP、对象/entry/状态轮廓 | 按文件/对象而非功能纵切 | phase review |
| `projects/L4-archive/03-详细设计.md` | 当前实现契约和 6 role layout | 实现者自行补 schema/port/state | Design Gate |
| `projects/L4-archive/04-配置设计.md` | 12 域/55 key、builder、failure | 造默认值或 provider | Config Gate |
| `projects/L4-archive/05-测试方案.md` | TC/DS/suite/gate/script/raw/report 分母 | 测试后置或 fake 冒 formal | Test/Evidence Gate |
| `projects/L4-archive/06-验收标准.md` | AC/RL/VETO/exit/risk/signoff 边界 | 将 planned 误报 verdict/readiness | Handoff Gate |
| `standards/document/实施计划讨论流程_SOP.md` | Step 1～13 问题和小循环 | 合并 Step 或遗漏 boundary 审计 | Step file source |
| `standards/document/实施计划书写规范.md` | 正式 13 章、phase、batch、report、commit 规则 | 正式文档变成任务清单/教程 | Formal assembly audit |
| `standards/document/代码实施台账与门禁规范.md` | 项目/boundary ledger schema 与 gate 值域 | 代码端无可恢复状态 | Ledger audit |
| `standards/document/子项目目录与代码文件组织规范.md` | 仓、Cargo、artifacts/reports/scripts 命名 | 路径污染/层级泄漏 | naming/path scan |
| `standards/coding/rust.md` | Rust source/rustdoc/naming/format/lint 约束 | 中文源码、工具链误读 | implementation preflight |
| `standards/document/设计真相源闭环与可落码性标准.md` | §5 metadata/idempotency/UoW、§9 经验复核 | 字段/DTO/query/evidence 缺口留给实现者 | per-boundary matrix |
| `standards/document/设计文档讨论中间产物规范.md` | 三层台账、恢复、写入和正式回填边界 | 只靠对话恢复、越过 Step | project/doc/Step ledger |
| `standards/document/全局项目依赖关系与裁剪规则.md` | L1→L4 串行与依赖裁剪 | 提前进入后续项目/错误依赖 | project ledger |

专项 owner 正式文档按 boundary 矩阵选读：`L1-identity`、`L1-conversation`、`L1-work`、`L1-process`、`L1-governance`、`L1-artifact`、`L1-workspace`、`L4-observability` 的 `00～06` 与必要 ledger；`L0-core`、`L0-bus`、`L0-sdk` 同理。它们提供 owner truth/contract 参考，不改变 Archive 正式边界。

## 6. Phase / commit boundary 实施前阅读矩阵

下表是未来 implementation handoff 的最小读取集合；正式文档与本表冲突时正式文档优先。每项 `required_reads` 必须在 boundary ledger 中逐条回写“已读/冲突/blocked”。

| Phase / boundary | 必读正式章节 | 必读 calibration /专项输入 | 开工前确认 |
|---|---|---|---|
| PH-01 / `commit-01-a-foundation` | `03` §3～§4、`04` §3～§6、目录规范、Rust 规范 | `03_ddd_step_03_coding_runtime_constraints.md`;`03_ddd_step_04_units_file_layout.md`;`04_config_step_03_control_plane.md`;`05_test_plan_step_09_automation_gates.md | target repo、edition/MSRV、6 role、Core candidate、无 L0/L1 命名泄漏 |
| PH-01 / `commit-01-b-runtime-shell` | `03` §13～§15、`04` §7～§11、`05` §8～§13 | `03_ddd_step_14_config_external_binding.md`;`03_ddd_step_15_observability_audit.md`;`04_config_step_07_config_items.md`;`04_config_step_09_loading_validation_activation.md` | 12 domains/55 keys、required slot、raw/report roots、fake 不进 production |
| PH-02 / `commit-02-a-admission-contracts` | `00` §7～§10、`02` §5、`03` §5～§9 | `03_ddd_step_05_module_contracts.md`;`03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`05_test_plan_step_06_cases.md` | C01/C02 input→object→state→result 构造闭合 |
| PH-02 / `commit-02-b-local-consistency` | `03` §10～§13、`05` §6/§10/§11、`06` §8 | `03_ddd_step_09_processing_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md`;`05_test_plan_step_06_cases.md` | UoW/CAS/read-set/fence/result replay/unknown 来源闭合；LOCAL-001/003 未闭合则 blocked |
| PH-03 / `commit-03-a-query-surfaces` | `03` §5.3/§7.2/§8.3/§14、`04` §3/§8/§11、`05` §3/§6/§10 | `03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_processing_flows.md`;`03_ddd_step_15_observability_audit.md`;`05_test_plan_step_06_cases.md` | 5 Query view/visibility/no-write marker 有来源 |
| PH-03 / `commit-03-b-cursor-visibility` | `03` §7.2/§10/§11/§12、`06` §5/§8/§10 | `03_ddd_step_10_state_matrices.md`;`03_ddd_step_12_error_recovery.md`;`03_ddd_step_13_concurrency_idempotency.md`;`05_test_plan_step_13_evidence.md` | cursor codec/mapping、redaction、continuation/restart 未闭合即 blocked |
| PH-04 / `commit-04-a-source-capture` | `00` §7/§11、`01` §5/§8、`03` §7.5/§8.4、`05` §6/§8、`06` §6/§7 | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_processing_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`05_test_plan_step_07_test_data.md`；对应 L1 owner `00～06` | source-authority matrix、version/fence/coverage、Auxiliary 与 per-owner fail-closed |
| PH-04 / `commit-04-b-bundle-closure` | `03` §7.4/§9/§10、`05` §3/§6、`06` §5/§8 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_10_state_matrices.md`;`03_ddd_step_16_test_cuts.md` | declared/actual exact set、immutable revision、closure findings、seal guard |
| PH-05 / `commit-05-a-assessment-contracts` | `03` §5.1/§5.2/§7.2/§8.3/§9、`04` §7/§11、`05` §3/§6、`06` §5/§9 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_10_state_matrices.md` | verification/compatibility DTO、typed ref/finding、target selector、failure posture schema；AR-UP-004 仍阻塞正向 capability |
| PH-05 / `commit-05-b-assessment-execution` | `03` §7.2/§8.3/§9/§11、`04` §7/§11、`05` §6/§10、`06` §5/§9 | `03_ddd_step_09_processing_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_12_error_recovery.md`;`03_ddd_step_13_concurrency_idempotency.md`;`04_config_step_11_failure_degradation.md` | J07/J08 execution、immutable assessment save/replay、Q03 read binding、Unknown/Unsupported/IntegrityFailed；AR-UP-004、AR-03-LOCAL-003/004 blocked |
| PH-06 / `commit-06-a-placement-retrieval` | `03` §7.3/§8.5/§9～§12、`04` §7/§11、`05` §6/§10、`06` §5/§8 | `03_ddd_step_09_processing_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md`;`05_test_plan_step_10_nonfunctional.md` | intent-before-effect、ACK≠commit、probe/reconcile；AR-UP-005 blocked |
| PH-06 / `commit-06-b-lifecycle-governance` | `00` §10/§11、`03` §7.3/§8.5/§9/§11、`04` §7/§11/§13、`06` §6/§9/§13 | `03_ddd_step_12_error_recovery.md`;`04_config_step_11_failure_degradation.md`;`06_acceptance_step_13_risk_acceptance.md`;`L1-governance/06-验收标准.md` | current decision/hold/delete authority；AR-UP-003 不得 workaround |
| PH-07 / `commit-07-a-restore-plan` | `00` §7/§10～§12、`03` §7/§8/§9/§11/§12、`05` §6/§10、`06` §5～§8 | `03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_processing_flows.md`;`03_ddd_step_10_state_matrices.md`;`03_ddd_step_12_error_recovery.md`;各 owner `03/06` | exact owner set、plan revision/items、eligibility/compatibility、无 owner write |
| PH-07 / `commit-07-b-restore-handoff` | `03` §7.5/§8.5/§9/§10/§11、`05` §6/§10/§13、`06` §6/§7/§10 | `03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_15_observability_audit.md`;`05_test_plan_step_13_evidence.md`;`06_acceptance_step_10_observability_evidence.md`;各 receiver owner `03/06` | per-owner material/handoff/outcome/compensation；AR-UP-006/009 blocked |
| PH-08 / `commit-08-a-local-evidence` | `05` §9/§13/§14、`06` §10/§12 | `05_test_plan_step_09_automation_gates.md`;`05_test_plan_step_13_evidence.md`;`06_acceptance_step_10_observability_evidence.md`;`06_acceptance_step_12_defects_retest_release.md` | scripts contract、raw→report、fixed run、redaction/no-static；不生成实例 |
| PH-08 / `commit-08-b-formal-handoff` | `00`～`07` 全部适用章节、`06` §3/§4/§10/§11/§13/§14 | 所有上游 owner closure、`06_acceptance_step_14_final_decision_signoff.md`、本计划 Step 12/13 | 所有 required seam 有 owner/version/fence/binding/vector/finality；当前永久 blocked |

## 7. 实施仓、目录、Git 与工具前置检查

| 检查项 | 通过条件（未来） | 当前事实 | 失败处理 |
|---|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-archive` 是独立 Git 仓，用户改动先记录 | 不存在 | `blocked / wait_for_external_precondition`；不得创建 |
| workspace member | `crates/contracts`, `domain`, `application`, `infra`, `api`, `worker` 与 `03` 一致 | 未创建 | 回写 07/03，禁止实现 |
| package/lib/binary | package=`archive-<role>`、lib=`archive_<role>`；binary 仅正式确认的 `archive-worker` | 未创建 | 命名 Gate blocked |
| Rust/toolchain | edition 2024、MSRV 1.93、Rust source/rustdoc/test name 英文 | Core manifest 形状符合；Archive 未核验 | 记录 actual toolchain/lock 后才可 pass |
| Core candidate | path `../quantalithos-core/crates/contracts`、package/export/version/lock 可核验 | repo 存在但 Archive path 未解析 | `AR-ARCH-001`/dependency gate 保持 blocked |
| Git identity | project-local `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com` | 无目标仓，未配置 | 不改 global；交接前再核验 |
| scripts | `scripts/gates`, `scripts/reports`, `scripts/checks`, `scripts/dev` | 未创建 | Step 4/8 仅计划；实现前缺失则 blocked |
| output roots | raw `artifacts/test/<run_id>`；reports `reports/runs/<run_id>`、`reports/acceptance` | 未创建 | 不创建设计仓输出目录；实现仓 Gate blocked |
| command args | `--run-id`, `--artifact-root`, `--config-profile`，CLI>env>default | 未实现 | script contract 未满足不得 pass |
| run reference | 固定真实 run_id；禁止 `latest`、project nested path、绝对本机引用 | 当前 run=0 | 不生成示例 run 或 digest |

## 8. 依赖分类与 fail-closed 规则

| 依赖对象 | 关系分类 | 允许表达 | 禁止表达 | 不可用姿态 |
|---|---|---|---|---|
| `L0-core` contracts | compile candidate（待核验） | 最小 typed shared symbol | 复制 core domain/application/infra | dependency blocked |
| L1 truth snapshot/export | runtime + ref + adapter | `SourceExportPort`、typed binding、owner material/ref | Cargo path、shadow schema、workspace fallback | `Blocked/Partial/Stale/Missing/Conflicting` |
| `L1-workspace` | runtime + ref + adapter | `WorkspaceProjection/Auxiliary` | canonical fallback | Auxiliary/blocked |
| `L1-artifact` | runtime + ref + adapter | owner-approved artifact material/ref | Artifact truth/正文 | blocked |
| `L4-observability` | runtime + ref + adapter | safe telemetry/material handoff | audit backend/chain truth | optional drop；formal blocked |
| `L0-bus` | event + adapter | trusted inbound envelope only | outbox/publisher/topic before AR-HLD-Q-001 | no consumer success / blocked |
| storage/integrity/KMS/schema | runtime + adapter/ref | required slot + typed outcome | provider/product choice | `Unknown/Unsupported/CommitUnknown` |
| restore receivers | runtime + ref + adapter | per-owner handoff and outcome | direct owner DB write | blocked/partial/unknown/compensation |
| fake/controlled double | fake / test-only | local shape/order/negative proof | production fallback、formal proof | test-only |
| SDK | runtime/downstream client | consumer-facing adapter outside server graph | Archive compile dependency | AR-ARCH-001 blocked |

## 9. 台账入口与 Gate Matrix 规则

| 台账 | 路径 | 创建 / 读取时机 | 缺失处理 |
|---|---|---|---|
| 设计项目台账 | `projects/L4-archive/design-calibration/project_execution_ledger.md` | 每次恢复先读；记录设计 Step 和 blocker | 不得依据对话直接继续 |
| 文档 flow | `design-calibration/07_implementation_plan_calibration_flow.md` | 每次 Step 切换、正式装配前 | 修正 flow 后才能继续 |
| 实施项目台账 | `design-calibration/implementation_execution_ledger.md` | Step 13 创建；实现 agent 每次继续先读 | 不得开始实现 |
| boundary ledger | `design-calibration/implementation-boundaries/<boundary_id>.md` | Step 13 全量预创建；当前 boundary 激活前/改码前/跑 gate 前/提交前 | 当前缺失 blocked；未来缺失不得移交 |
| 实现仓 scratch | `/home/aris/Projects/quantalithos-archive/.codex/implementation_ledger.md` | 实现仓存在后可选 | 不替代设计仓台账 |

每个 boundary 必须有 Design / Scope / Worktree / Build / Test / Evidence / Commit / Handoff Gate。未来 boundary 固定 `status=planned`、`next_allowed_action=wait_until_current`；任何 `pass` 都必须绑定真实 evidence；当前没有任何真实 evidence。

## 10. Agent 永久记忆种子

永久记忆只能逐条机械投影以下文本；不得扩写成对象 schema、状态矩阵、业务规则、TC/EV 全文或临时 blocker。

| 记忆 ID | 适用范围 | 必须写入的记忆文本 | 来源 | 刷新触发 | 失效 / 冲突处理 |
|---|---|---|---|---|---|
| `MEM-AR-001` | project | 开始任何代码、配置、脚本或测试改动前，必须读取当前 boundary 的正式文档、calibration、编码规范、目录规范和台账；正式文档优先，冲突时暂停。 | `07` §3；台账规范 §7 | 首次开工、规范/设计 baseline 变化 | 被新正式 07 替换；正式文档优先 |
| `MEM-AR-002` | project | 实现仓固定为 `/home/aris/Projects/quantalithos-archive`；目录不存在时只能记录 blocker，不得在设计仓代写实现或自行创建。 | `03` §4；本 Step §7 | target repo 状态变化 | target owner 明确授权并实际存在后刷新 |
| `MEM-AR-003` | project / boundary | 只有经核验的 `L0-core` contracts 才可能成为 compile dependency；L1、Bus、SDK、provider、observability 只能按 runtime/event/ref/adapter/fake 协作。 | `03` §3；本 Step §8 | actual graph/contract 变化 | AR-ARCH-001 closure 后重核 |
| `MEM-AR-004` | project / boundary | 无法按正式设计 1:1 构造字段、DTO、query/view、状态、metadata/idempotency、source/material 或 evidence 时，必须停在当前 boundary 并回写设计，不得用 fake/default/map 补口。 | 闭环标准 §9.2；`03` §16 | 每个 boundary 开工前 | 设计修复并固定新 baseline 后刷新 |
| `MEM-AR-005` | project / boundary | raw artifact 固定为 `artifacts/test/<run_id>`，可读报告固定为 `reports/runs/<run_id>` 与 `reports/acceptance`；正式引用不得使用 `latest`。 | `05` §9/§13；目录规范 §9 | gate/report 路径变化 | 新正式路径替换；旧 raw 保持历史 |
| `MEM-AR-006` | project / boundary | Query 必须保持 durable/external zero-write；telemetry、cache、repair、retrieve、probe 和 owner 状态不得由 Query 隐式触发。 | `03` §7.2/§8.3；`05` §3 | query boundary 变化 | 任何设计变更需重跑 Query/no-write 复核 |
| `MEM-AR-007` | project / boundary | `L1-workspace` 永远是 `Auxiliary`；Archive 不拥有或反写 identity、conversation、work、process、governance、artifact、workspace、observability 真相。 | `00` §11；`03` §1/§16 | source-authority 变化 | owner 正式合同变更后重核，不由 Archive 自批 |
| `MEM-AR-008` | project / boundary | Bundle 不是跨域写权限；恢复只能通过各 owning domain 的正式 receiver/import/command/handoff，并逐 owner 记录 partial、stale、missing、conflicting、unsupported-version、integrity-failed、commit-unknown 和 compensation/retry。 | `00` A7～A9；`03` §7/§8 | restore receiver 合同变化 | owner closure 后刷新；禁止 direct DB workaround |
| `MEM-AR-009` | handoff | 在交付实现前，必须按 phase/commit boundary 审计正式 `03/05/06/07` 并固定 immutable design baseline；审计未通过不得移交。 | 闭环标准 §9.1；`06` §3 | handoff/baseline 变化 | 新 baseline 重新审计 |
| `MEM-AR-010` | project | 修复设计后先判断是否属于本项目，再检查提交合并方式和可复用经验；需要时同步标准/SOP/项目记忆并补一个具体正反例，最后写交接说明。 | 中间产物规范；闭环标准 §9 | 每次设计修复 | owner project 事项仅记录 blocker/回流 |

### 永久记忆生成门禁

| 检查项 | 通过条件 | 失败处理 |
|---|---|---|
| 种子存在 | `MEM-AR-001～010` 有稳定 ID、文本、来源、刷新和失效/冲突处理 | 不生成永久记忆 |
| 机械投影 | 写入文本逐字来自本表 | 删除自由总结，回到本表 |
| 不复制 truth | 不含 DTO 字段、状态矩阵、业务规则或 TC/EV 正文 | 删除并改为正式文档索引 |
| 技术栈可刷新 | Rust/目录/提交规范路径来自 §5，不写入通用标准默认 | 规范路径变更时刷新 |
| 设计修复经验 | 包含项目归属、提交合并、经验检查与示例规则 | 补种子后方可移交 |
| baseline 纪律 | 明确 baseline 未固定前不得实现/提交 | 保持 blocked |

## 11. 回填草稿

正式 `07` §3 应收口为：实施者先读正式 `00～06`、当前阶段校准来源、Rust/目录/台账/闭环/依赖规范；目标仓固定路径但当前不存在；Rust 2024/MSRV 1.93 与英文源码规则只作为未来前置检查；只有经核验的 Core contracts 才可能编译期依赖；所有 L1/Bus/SDK/provider/storage/receiver/observability 依实际关系归类；阶段阅读矩阵按 PH/boundary 组织；raw/report 目录和 CLI 参数固定；项目级和 boundary ledger 在移交前全量预创建；永久记忆只机械投影种子表；未闭合条件全部进入 blocked/waiting，不用 fake/default/静态清单关闭。

## 12. 待确认事项、上游影响与事实边界

| 事项 | owner | 影响 | 当前姿态 / 截止点 |
|---|---|---|---|
| target implementation repo | L4-archive implementation owner / 用户授权 | 所有实现 boundary | `absent / blocked`；PH-01 activation 前 |
| immutable design/source baseline | 设计/实施交接 | Design Gate、Handoff Gate | 未固定；正式 07 完成后仍需另行固定 |
| Core contract export/lock | L0-core owner + implementation owner | 唯一 compile candidate | pending；PH-01 开工前 |
| 12 upstream/architecture blockers | 各 owning project/标准 owner | source, governance, integrity, storage, receiver, outbound | open；对应 boundary 开工前不得 workaround |
| 6 local pending | L4-archive design/implementation owner | codec、cursor、durable UoW、schema/numbers、telemetry、implementation start | open；对应 boundary 保持 blocked |
| Git identity/toolchain | implementation owner | Commit/Build Gate | 未核验；目标仓存在后检查 |

本 Step 没有新增 owning-project blocker；没有修改其他仓正式文档；没有创建目标实现仓、Cargo 文件、脚本、run、artifact、report、evidence、verdict、signoff、readiness 或 commit。

## 13. 自检与进入下一步条件

- [x] 必读规范、正式输入和专项 owner 读取范围已记录。
- [x] 目标仓不存在、Core candidate 和 sibling 关系已按事实边界登记。
- [x] 目录、Git identity、Rust、脚本、artifact/report roots 和 CLI 参数前置已列出。
- [x] compile/runtime/event/ref/adapter/fake 分类和不可用姿态已固定。
- [x] 项目/boundary/scratch 台账入口、Gate Matrix 和 planned skeleton 规则已固定。
- [x] 永久记忆种子含来源、刷新、冲突、设计修复经验和禁止自由总结规则。
- [x] 未把任何实现、baseline、run 或外部成功写成事实。
- [x] 连续授权允许 Step 4；implementation/test/acceptance/commit 仍禁止。

`gate_status = pass_with_blockers`; `next_allowed_action = create_and_complete_step_04_objects_deliverables`。
