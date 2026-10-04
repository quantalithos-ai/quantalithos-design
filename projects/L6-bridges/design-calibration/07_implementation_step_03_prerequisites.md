# L6-bridges 07 Step3：实施前置条件与阅读清单

## 1. Step状态与Step内计划

2026-10-04；done_design_static；SOP Step3 / 书写§5.3；仅设计校准，正式回填由Step13单独门禁控制。

| 小阶段 | 状态 | 产物/门禁 |
|---|---|---|
| 输入和前序结论 | read | §2/当前正式来源 |
| SOP问题回答 | done_design_static | §3 |
| 材料诊断/前后对比 | done_design_static | §4/5 |
| 取舍与复杂度 | done_design_static | §6 |
| 结构化产物 | done_design_static | §7 |
| 回填草稿 | done_design_static | §8 |
| 待确认 | done_design_static | §9 |
| 实际静态自检 | done_design_static | §10；无项目测试 |

| 模块 | gate_status | next_allowed_action | source_files |
|---|---|---|---|
| step_03 | pass | enter_step_04 | Step2范围；03§3/4/16.9、目录规范、Rust规范§源码语言/rustdoc、07书写§3/4.9、实施台账§3~8/13、真相源§九 |

## 2. 输入

Step2范围；03§3/4/16.9、目录规范、Rust规范§源码语言/rustdoc、07书写§3/4.9、实施台账§3~8/13、真相源§九。前序问题、诊断、取舍和未决全部承接；actual blocker不关闭。

## 3. SOP问题回答

开工必须固定design commit、目标仓/权限、三层台账、current唯一boundary、逐边界reads与actual资格；本地core优先path，SDK条件选用，运行/事件不写Cargo。Git配置只项目级；永久记忆只机械投影种子，不复制schema；每次恢复先磁盘台账。

## 4. 材料诊断

没有实现仓与design immutable commit；SDK的pub use不是Bridges六owner业务兼容证明；全目录阅读或记忆自由总结无法提供boundary可审查输入。

## 5. 前后对比

| 当前风险 | 本步校准 |
|---|---|
| 没有实现仓与design immutable commit；SDK的pub use不是Bridges六owner业务兼容证明；全目录阅读或记忆自由总结无法提供boundary可审查输入。 | 先定义可审计reading matrix和规则种子；实际资格缺失blocked但不阻设计计划。scratch不要求创建，实际采用后须保护用户状态，不代正式台账。 |

## 6. 取舍与复杂度

先定义可审计reading matrix和规则种子；实际资格缺失blocked但不阻设计计划。scratch不要求创建，实际采用后须保护用户状态，不代正式台账。

## 7. 结构化中间产物

### 3.1 全局规范与启动前置

| 前置 | 必读位置/检查 | 缺失处理 |
|---|---|---|
| 正式设计 | 00~07当前正式章节；先implementation ledger/current boundary，再07、本boundary具名校准 | 缺当前台账或schema不能改代码；formal优先→calibration解释→仍冲突wait_design |
| 语言/格式 | [Rust规范](../../../standards/coding/rust.md)源码语言/rustdoc、命名/ownership/format；实际源码/注释英文，rustfmt不能替语义审查 | 未读取或新语言无规范阻对应改动；脚本合同沿05§9.5，JSON不私造parser |
| 组织 | [目录规范](../../../standards/document/子项目目录与代码文件组织规范.md)；03§4七role/package/lib/sevenbins | member/crate/bin或依赖偏离回design，不造utils/common/第八role |
| 门禁/提交 | [实施台账规范](../../../standards/document/代码实施台账与门禁规范.md)；[07书写规范](../../../standards/document/实施计划书写规范.md)§4.9/5.3；本文§11 | 默认无提交权限；实际单boundary七固定gate并含worktree/activation |
| 可落码/中间产物 | [真相源标准](../../../standards/document/设计真相源闭环与可落码性标准.md)§九；[中间产物规范](../../../standards/document/设计文档讨论中间产物规范.md)§3~5 | 设计者前置经验复核，实现者二次校验，缺口不能延给实现补设计 |
| 依赖 | [全局规则](../../../standards/document/全局项目依赖关系与裁剪规则.md)§4.1/5 | Layer5窗口；只有编译期进manifest，Chat非前置/正式输入 |
| 授权/基线 | 用户单独授权实施与目标仓；覆盖00~07及本次校准/全部ledger的full design commit，目标仓真实状态、受影响上游快照 | 当前07 design worktree hash不是commit；不授权/不造仓/hash/remote |
| 工具环境 | 03§3 Rust2024/MSRV1.93.0、rustfmt/clippy/toolchain；真实配置profile/driver/secret/clock/ID/预算/retention按scope批准 | 不执行工具安装/build/run或填实际值；缺失blocked，无默认provider |

### 3.2 实施台账与恢复规则

| 入口 | 路径 | 当前/激活规则 |
|---|---|---|
| 项目实施台账 | `design-calibration/implementation_execution_ledger.md` | Step13同步创建；current_boundary=none，无实施授权，gate_status=blocked/next_allowed_action=wait_design |
| boundary台账 | `design-calibration/implementation-boundaries/<boundary_id>.md` | 全部Step13预建非空planned/wait_until_current；activation/design pending或blocked，不能pass |
| scratch | `<implementation_repo>/.codex/implementation_ledger.md` | 可选；当前不适用：仓不存在且不实施，不创建；采用后不提交、不替正式台账，交付前回写正式状态 |

恢复顺序=项目实施台账→current boundary→正式07→当前required design Step→可选scratch。项目尚无current时只read_docs/preflight，仍不能实现。gate_status仅pending/pass/blocked/not_applicable；项目blocked时next只wait_design/fix_gate_failure/handoff。future planned的wait_until_current是规范§3.2.1特例，不是项目blocked执行动作。缺未来skeleton阻移交，未来文件存在不激活。修复设计须固定新的真实baseline并重复核scope/reads/七gate/经验表。

### 3.3 本地目录/依赖检查

| 项 | 设计计划/本轮实际核验 | 未来检查/失败 |
|---|---|---|
| 实现仓 | `/home/aris/Projects/quantalithos-bridges`实际不存在，未创建 | 授权后真实worktree/Cargo目录核验；absence阻实施 |
| 七role | contracts/domain/application/infra/api/worker/jobs；package=bridges-<role>，lib=bridges_<role> | `cargo metadata --no-deps`实际结果比对03§4，不凭示例选择 |
| 七bin | bridges-api、bridges-worker、dispatch_queued_delivery、reconcile_bridge_operation、reconcile_stream_gap、retry_safe_handoff、refresh_bridge_qualification | 比对[[bin]].name/path；库/常驻/一次性入口分离，不隐建cli/ops |
| Core compile | 实际`/home/aris/Projects/quantalithos-core/crates/contracts/Cargo.toml`是core-contracts/core_contracts，lib导出actor/metadata等模块 | root path→`../quantalithos-core/crates/contracts`，member继承workspace；逐exact export/shape/revision核验，缺口回Core owner，不私造sharedkind |
| SDK conditional compile | 实际`/home/aris/Projects/quantalithos-sdk/crates/client/Cargo.toml`是sdk-client/sdk_client；lib pub use四层不是业务method证明 | 若选SDK仅Infra通过root path→`../quantalithos-sdk/crates/client`，pin/错误清洗/重试/config/source另核；没选不mandatory |
| 六owner runtime | Conversation/Identity/Governance/Artifact/条件Workspace/Observability public port | 不Cargo path；SDK或正式API/adapter方法须被03合同覆盖 |
| Bus event | 仅selected既有event協作seam | 不为事件引入owner或Bus源码；正式canonical/admission/current缺失不投递 |
| 平台/产品 | 四平台SDK/API与OAuth/APIKey/KMS/router/store/executor均not_selected/not_established | 逐scope/pin/capability/provider/secret/policy/current核验，不增raw泄漏、hidden retry或降安全 |

Git配置仅未来目标仓项目级：`git config user.name "quantalithos-labs"`、`git config user.email "quantalithos.ai@gmail.com"`并读取确认；不--global。本轮未执行配置。

### 3.4 按阶段/boundary阅读矩阵

Step4先定位交付面，Step5确定phase，Step6才赋稳定boundary ID并给逐boundary精确reads；不是要求开工前全读calibration目录。每boundary必须同时读取本章全局规则、03相关schema/flow/state/UoW、04对应current/secret、05相关TC/schema、06对应gate及07§6/7；具体矩阵作为本章规范性延伸由[Step6](07_implementation_step_06_boundaries.md)§7逐卡及[Step7](07_implementation_step_07_gates.md)§7定义，最终正式§3装配具体矩阵。未形成逐boundaryreads前禁止设计移交。以下矩阵为Step6收稳后反填本章的精确阅读入口，实际开工仍须全部门禁。

| Boundary | 必读正式章节 | 必读calibration | 读取目的/开工门禁 |
|---|---|---|---|
| commit-01-a / PH-01 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_04_units_file_layout.md](03_ddd_step_04_units_file_layout.md)、[03_ddd_step_07_infra_adapter_contracts.md](03_ddd_step_07_infra_adapter_contracts.md)、[03_ddd_step_14_config_dependencies.md](03_ddd_step_14_config_dependencies.md)、[04_config_step_07_config_items.md](04_config_step_07_config_items.md)、[04_config_step_08_sensitive_secrets.md](04_config_step_08_sensitive_secrets.md)、[04_config_step_09_loading_validation.md](04_config_step_09_loading_validation.md)、[04_config_step_07_platform_source_reverification.md](04_config_step_07_platform_source_reverification.md) | workspace真实Core导出/工具链→strict config拒缺→11target发现无业务IO；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-01-b / PH-01 | 03§4/6~12/16；05§9.5/13；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [05_test_plan_step_09_script_contract_calibration.md](05_test_plan_step_09_script_contract_calibration.md)、[05_test_plan_harness_schema.json](05_test_plan_harness_schema.json)、[05_test_plan_step_13_evidence.md](05_test_plan_step_13_evidence.md)、[06_acceptance_step_10_evidence_audit.md](06_acceptance_step_10_evidence_audit.md)、[06_acceptance_step_14_conclusion_signoff.md](06_acceptance_step_14_conclusion_signoff.md) | 完整05JSON schema→bounded捕获→case/suite/index/check/report读写，不从fixture造run；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-02-a / PH-02 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_06_object_contracts.md](03_ddd_step_06_object_contracts.md)、[03_ddd_step_07_trait_port_adapter_contracts.md](03_ddd_step_07_trait_port_adapter_contracts.md)、[03_ddd_step_08_protocol_contracts.md](03_ddd_step_08_protocol_contracts.md)、[03_ddd_step_09_processing_flows.md](03_ddd_step_09_processing_flows.md)、[03_ddd_step_10_state_matrix.md](03_ddd_step_10_state_matrix.md)、[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)、[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)、[03_ddd_step_17_field_closure.md](03_ddd_step_17_field_closure.md) | typed完整snapshot/get-save→全expected/unique/immutable seed→实际或未知commitproof→storedreplay与四Query零写；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-02-b / PH-02 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_06_object_contracts.md](03_ddd_step_06_object_contracts.md)、[03_ddd_step_07_trait_port_adapter_contracts.md](03_ddd_step_07_trait_port_adapter_contracts.md)、[03_ddd_step_08_protocol_contracts.md](03_ddd_step_08_protocol_contracts.md)、[03_ddd_step_09_processing_flows.md](03_ddd_step_09_processing_flows.md)、[03_ddd_step_10_state_matrix.md](03_ddd_step_10_state_matrix.md)、[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)、[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)、[03_ddd_step_17_field_closure.md](03_ddd_step_17_field_closure.md) | strict配置授权→Configured/Pending→current两端activation→原storedresult/read；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-02-c / PH-02 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_06_object_contracts.md](03_ddd_step_06_object_contracts.md)、[03_ddd_step_07_trait_port_adapter_contracts.md](03_ddd_step_07_trait_port_adapter_contracts.md)、[03_ddd_step_08_protocol_contracts.md](03_ddd_step_08_protocol_contracts.md)、[03_ddd_step_09_processing_flows.md](03_ddd_step_09_processing_flows.md)、[03_ddd_step_10_state_matrix.md](03_ddd_step_10_state_matrix.md)、[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)、[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)、[03_ddd_step_17_field_closure.md](03_ddd_step_17_field_closure.md) | LinkIdentity/Location/Message及lifecycle→generation/current→safe read/duplicate，全variant穷尽；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-03-a / PH-03 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_06_object_contracts.md](03_ddd_step_06_object_contracts.md)、[03_ddd_step_07_trait_port_adapter_contracts.md](03_ddd_step_07_trait_port_adapter_contracts.md)、[03_ddd_step_08_protocol_contracts.md](03_ddd_step_08_protocol_contracts.md)、[03_ddd_step_09_processing_flows.md](03_ddd_step_09_processing_flows.md)、[03_ddd_step_10_state_matrix.md](03_ddd_step_10_state_matrix.md)、[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)、[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)、[03_ddd_step_17_field_closure.md](03_ddd_step_17_field_closure.md) | private verification→safe完整接管/原claim→qualifiedowner单次交接→known/unknown，不从ACK建Turn；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-03-b / PH-03 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_06_object_contracts.md](03_ddd_step_06_object_contracts.md)、[03_ddd_step_07_trait_port_adapter_contracts.md](03_ddd_step_07_trait_port_adapter_contracts.md)、[03_ddd_step_08_protocol_contracts.md](03_ddd_step_08_protocol_contracts.md)、[03_ddd_step_09_processing_flows.md](03_ddd_step_09_processing_flows.md)、[03_ddd_step_10_state_matrix.md](03_ddd_step_10_state_matrix.md)、[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)、[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)、[03_ddd_step_17_field_closure.md](03_ddd_step_17_field_closure.md) | registered notice→detectgap→sourcecoverage B闭gap→C新独立stageproof/cursor双CAS，partial保gap；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-04-a / PH-04 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_06_object_contracts.md](03_ddd_step_06_object_contracts.md)、[03_ddd_step_07_trait_port_adapter_contracts.md](03_ddd_step_07_trait_port_adapter_contracts.md)、[03_ddd_step_08_protocol_contracts.md](03_ddd_step_08_protocol_contracts.md)、[03_ddd_step_09_processing_flows.md](03_ddd_step_09_processing_flows.md)、[03_ddd_step_10_state_matrix.md](03_ddd_step_10_state_matrix.md)、[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)、[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)、[03_ddd_step_17_field_closure.md](03_ddd_step_17_field_closure.md) | committed source+current disclosure→SafePresentationPlan→sameStableEffect DeliveryIntent与lane原tuple；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-04-b / PH-04 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_06_object_contracts.md](03_ddd_step_06_object_contracts.md)、[03_ddd_step_07_trait_port_adapter_contracts.md](03_ddd_step_07_trait_port_adapter_contracts.md)、[03_ddd_step_08_protocol_contracts.md](03_ddd_step_08_protocol_contracts.md)、[03_ddd_step_09_processing_flows.md](03_ddd_step_09_processing_flows.md)、[03_ddd_step_10_state_matrix.md](03_ddd_step_10_state_matrix.md)、[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)、[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)、[03_ddd_step_17_field_closure.md](03_ddd_step_17_field_closure.md) | claim A→actual Bcommit/current/bounds→单次PlatformEffect→knownreceipt或原unknown，不盲重发；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-05-a / PH-05 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_06_object_contracts.md](03_ddd_step_06_object_contracts.md)、[03_ddd_step_07_trait_port_adapter_contracts.md](03_ddd_step_07_trait_port_adapter_contracts.md)、[03_ddd_step_08_protocol_contracts.md](03_ddd_step_08_protocol_contracts.md)、[03_ddd_step_09_processing_flows.md](03_ddd_step_09_processing_flows.md)、[03_ddd_step_10_state_matrix.md](03_ddd_step_10_state_matrix.md)、[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)、[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)、[03_ddd_step_17_field_closure.md](03_ddd_step_17_field_closure.md) | known externalmessage/owneraction→明确responsibility/current/expiry→oneuse初Missing，本地bind；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-05-b / PH-05 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_06_object_contracts.md](03_ddd_step_06_object_contracts.md)、[03_ddd_step_07_trait_port_adapter_contracts.md](03_ddd_step_07_trait_port_adapter_contracts.md)、[03_ddd_step_08_protocol_contracts.md](03_ddd_step_08_protocol_contracts.md)、[03_ddd_step_09_processing_flows.md](03_ddd_step_09_processing_flows.md)、[03_ddd_step_10_state_matrix.md](03_ddd_step_10_state_matrix.md)、[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)、[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)、[03_ddd_step_17_field_closure.md](03_ddd_step_17_field_closure.md) | platformverified→internalactor/actiontarget/current→one-use actualclaim→ownercall/result，同opduplicate；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-06-a / PH-06 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_06_object_contracts.md](03_ddd_step_06_object_contracts.md)、[03_ddd_step_07_trait_port_adapter_contracts.md](03_ddd_step_07_trait_port_adapter_contracts.md)、[03_ddd_step_08_protocol_contracts.md](03_ddd_step_08_protocol_contracts.md)、[03_ddd_step_09_processing_flows.md](03_ddd_step_09_processing_flows.md)、[03_ddd_step_10_state_matrix.md](03_ddd_step_10_state_matrix.md)、[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)、[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)、[03_ddd_step_17_field_closure.md](03_ddd_step_17_field_closure.md) | LocalCommit/Owner/Platform/Consumer原subject→readonlyqualify/probe→有限合法finalize；J05target/job双key/op；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-06-b / PH-06 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_06_object_contracts.md](03_ddd_step_06_object_contracts.md)、[03_ddd_step_07_trait_port_adapter_contracts.md](03_ddd_step_07_trait_port_adapter_contracts.md)、[03_ddd_step_08_protocol_contracts.md](03_ddd_step_08_protocol_contracts.md)、[03_ddd_step_09_processing_flows.md](03_ddd_step_09_processing_flows.md)、[03_ddd_step_10_state_matrix.md](03_ddd_step_10_state_matrix.md)、[03_ddd_step_11_persistence_transactions.md](03_ddd_step_11_persistence_transactions.md)、[03_ddd_step_13_concurrency_idempotency.md](03_ddd_step_13_concurrency_idempotency.md)、[03_ddd_step_17_field_closure.md](03_ddd_step_17_field_closure.md) | canonical/admission/current→原handoff claim/consumer op→已知结果only/nonrecursive finalize；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-07-a / PH-07 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_04_units_file_layout.md](03_ddd_step_04_units_file_layout.md)、[03_ddd_step_07_infra_adapter_contracts.md](03_ddd_step_07_infra_adapter_contracts.md)、[03_ddd_step_14_config_dependencies.md](03_ddd_step_14_config_dependencies.md)、[04_config_step_07_config_items.md](04_config_step_07_config_items.md)、[04_config_step_08_sensitive_secrets.md](04_config_step_08_sensitive_secrets.md)、[04_config_step_09_loading_validation.md](04_config_step_09_loading_validation.md)、[04_config_step_07_platform_source_reverification.md](04_config_step_07_platform_source_reverification.md) | 批准driver/provider/key/clock/budget→原commit proof同driver→coldactivation/no fallback，缺失阻启动；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-07-b / PH-07 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_04_units_file_layout.md](03_ddd_step_04_units_file_layout.md)、[03_ddd_step_07_infra_adapter_contracts.md](03_ddd_step_07_infra_adapter_contracts.md)、[03_ddd_step_14_config_dependencies.md](03_ddd_step_14_config_dependencies.md)、[04_config_step_07_config_items.md](04_config_step_07_config_items.md)、[04_config_step_08_sensitive_secrets.md](04_config_step_08_sensitive_secrets.md)、[04_config_step_09_loading_validation.md](04_config_step_09_loading_validation.md)、[04_config_step_07_platform_source_reverification.md](04_config_step_07_platform_source_reverification.md) | 逐current方法/安全source/authority验证→受核owneradapter；SDK仅选用后pin完整导出/错误清洗；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-07-c / PH-07 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_04_units_file_layout.md](03_ddd_step_04_units_file_layout.md)、[03_ddd_step_07_infra_adapter_contracts.md](03_ddd_step_07_infra_adapter_contracts.md)、[03_ddd_step_14_config_dependencies.md](03_ddd_step_14_config_dependencies.md)、[04_config_step_07_config_items.md](04_config_step_07_config_items.md)、[04_config_step_08_sensitive_secrets.md](04_config_step_08_sensitive_secrets.md)、[04_config_step_09_loading_validation.md](04_config_step_09_loading_validation.md)、[04_config_step_07_platform_source_reverification.md](04_config_step_07_platform_source_reverification.md) | Slack installation/scope/method/HMAC→event/thread/changes→ACK/receipt/rate/probe原合同；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-07-d / PH-07 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_04_units_file_layout.md](03_ddd_step_04_units_file_layout.md)、[03_ddd_step_07_infra_adapter_contracts.md](03_ddd_step_07_infra_adapter_contracts.md)、[03_ddd_step_14_config_dependencies.md](03_ddd_step_14_config_dependencies.md)、[04_config_step_07_config_items.md](04_config_step_07_config_items.md)、[04_config_step_08_sensitive_secrets.md](04_config_step_08_sensitive_secrets.md)、[04_config_step_09_loading_validation.md](04_config_step_09_loading_validation.md)、[04_config_step_07_platform_source_reverification.md](04_config_step_07_platform_source_reverification.md) | trusted server/version/plugin或PAT source→post/root/action→deployment rate与原probe；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-07-e / PH-07 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_04_units_file_layout.md](03_ddd_step_04_units_file_layout.md)、[03_ddd_step_07_infra_adapter_contracts.md](03_ddd_step_07_infra_adapter_contracts.md)、[03_ddd_step_14_config_dependencies.md](03_ddd_step_14_config_dependencies.md)、[04_config_step_07_config_items.md](04_config_step_07_config_items.md)、[04_config_step_08_sensitive_secrets.md](04_config_step_08_sensitive_secrets.md)、[04_config_step_09_loading_validation.md](04_config_step_09_loading_validation.md)、[04_config_step_07_platform_source_reverification.md](04_config_step_07_platform_source_reverification.md) | Bot API/version/accountscope→webhook或poll排他→update/topic/callback与retry_after；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-07-f / PH-07 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_04_units_file_layout.md](03_ddd_step_04_units_file_layout.md)、[03_ddd_step_07_infra_adapter_contracts.md](03_ddd_step_07_infra_adapter_contracts.md)、[03_ddd_step_14_config_dependencies.md](03_ddd_step_14_config_dependencies.md)、[04_config_step_07_config_items.md](04_config_step_07_config_items.md)、[04_config_step_08_sensitive_secrets.md](04_config_step_08_sensitive_secrets.md)、[04_config_step_09_loading_validation.md](04_config_step_09_loading_validation.md)、[04_config_step_07_platform_source_reverification.md](04_config_step_07_platform_source_reverification.md) | HTTP Ed25519或Gateway intents/session排他→interaction/message/thread→bucket/global与resumegap；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-07-g / PH-07 | 03§4/6~12/16；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [03_ddd_step_04_units_file_layout.md](03_ddd_step_04_units_file_layout.md)、[03_ddd_step_07_infra_adapter_contracts.md](03_ddd_step_07_infra_adapter_contracts.md)、[03_ddd_step_14_config_dependencies.md](03_ddd_step_14_config_dependencies.md)、[04_config_step_07_config_items.md](04_config_step_07_config_items.md)、[04_config_step_08_sensitive_secrets.md](04_config_step_08_sensitive_secrets.md)、[04_config_step_09_loading_validation.md](04_config_step_09_loading_validation.md)、[04_config_step_07_platform_source_reverification.md](04_config_step_07_platform_source_reverification.md) | qualified executor/transport owninglease→按完整19service dispatch→shutdown freshbudget/unknown集合；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-08-a / PH-08 | 03§4/6~12/16；05§9.5/13；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [05_test_plan_step_09_script_contract_calibration.md](05_test_plan_step_09_script_contract_calibration.md)、[05_test_plan_harness_schema.json](05_test_plan_harness_schema.json)、[05_test_plan_step_13_evidence.md](05_test_plan_step_13_evidence.md)、[06_acceptance_step_10_evidence_audit.md](06_acceptance_step_10_evidence_audit.md)、[06_acceptance_step_14_conclusion_signoff.md](06_acceptance_step_14_conclusion_signoff.md) | 真实完整expectedmanifest→116TC closedparameters/四平台/mandatory→两check→22EV，不缩分母；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |
| commit-08-b / PH-08 | 03§4/6~12/16；05§9.5/13；04§7~12；05§6原cut；06相关gate；07§5/6/7；07§3/6/7/11/12 | [05_test_plan_step_09_script_contract_calibration.md](05_test_plan_step_09_script_contract_calibration.md)、[05_test_plan_harness_schema.json](05_test_plan_harness_schema.json)、[05_test_plan_step_13_evidence.md](05_test_plan_step_13_evidence.md)、[06_acceptance_step_10_evidence_audit.md](06_acceptance_step_10_evidence_audit.md)、[06_acceptance_step_14_conclusion_signoff.md](06_acceptance_step_14_conclusion_signoff.md) | validatedReportIndex/EV→draft_for_review Handoff→人工原disposition/六VETO/139gate→真实commit/remainingblocker handoff；核本卡exactschema/refs/current/wholeCAS/result/state/TC/EV；55经验项及实际baseline/唯一current/资格无缺才可开工 |


### 3.5 永久记忆种子

只能逐字机械投影下表规则索引，不复制业务schema/状态/TC或临时blocker；本轮不创建实际记忆。冲突formal优先且暂停刷新，不能以记忆绕规范。

| 记忆ID | 范围 | 类别 | 必须写入文本 | 规范路径来源 | 来源文档 | 来源章节 | 刷新触发 | 失效条件 | 冲突处理 | 禁止改写 |
|---|---|---|---|---|---|---|---|---|---|---|
| MEM-BR-001 | project | 必读规范 | 修改任何代码、配置、脚本或测试前必须读取07§3.1列出的当前技术栈规范、目录规范和07§11提交纪律。 | 本文§3.1阅读清单 | 07-实施计划.md | §3.1 | 首次开工/规范或技术栈变更 | until superseded | formal优先，暂停/刷新种子 | 是 |
| MEM-BR-002 | project | 工作区安全 | 只修改和暂存当前boundary允许的文件，不改写、撤销或提交用户已有无关改动。 | 本文§3.1阅读清单 | 07-实施计划.md | §10/11 | 每次修改/提交前 | until superseded | formal优先，暂停/刷新种子 | 是 |
| MEM-BR-003 | project | 主动闭环审计 | 交付实现或变更设计基线前必须按真相源标准§九逐boundary审计正式03/05/06/07及校准来源，未通过先回设计固定新基线。 | 本文§3.1阅读清单 | 07-实施计划.md | §3.2/12 | 实现交付/设计基线变化 | until superseded | formal优先，暂停/刷新种子 | 是 |
| MEM-BR-004 | project | 经验沉淀 | 设计修复后必须判断上一提交的项目归属和新增可复用经验，需要时补标准/SOP/种子及具体示例，同项目可在另获提交授权后合并上一提交，不同项目另提交，无新增经验须明示，再交接。 | 本文§3.1阅读清单；跨项目标准/amend另需用户授权 | 07-实施计划.md | §3.5/11 | 每次设计修复后 | until superseded | formal优先，暂停/刷新种子 | 是 |
| MEM-BR-005 | project | 缺口暂停 | 字段、port、状态、authority、配置或证据闭口缺失时必须设blocked/wait_design并回报 owning 设计，不在实现端补口。 | 本文§3.1阅读清单 | 07-实施计划.md | §3.2/6 | 开工/发现缺口 | until superseded | formal优先，暂停/刷新种子 | 是 |
| MEM-BR-006 | project | 恢复入口 | 每次继续、上下文恢复、开boundary、提交前或设计修复后必须依次读取项目实施台账、current boundary台账、正式07和当前required design来源。 | 本文§3.1阅读清单 | 07-实施计划.md | §3.2 | 每次恢复/切换boundary | until superseded | formal优先，暂停/刷新种子 | 是 |
| MEM-BR-007 | commit-boundary | 唯一激活 | 全部future boundary必须保持planned/wait_until_current，只有项目实施台账明确推进且授权/门禁到位才可激活一个current。 | 本文§3.1阅读清单 | 07-实施计划.md | §3.2/6 | 切换boundary | until superseded | formal优先，暂停/刷新种子 | 是 |
| MEM-BR-008 | commit-boundary | 提交纪律 | 实现提交必须为英文type(scope): subject且一提交对应一个boundary，英文body按子功能与文件名改动量分组并保留固定Codex footer。 | 本文§3.1阅读清单 | 07-实施计划.md | §11 | 每次提交前 | until superseded | formal优先，暂停/刷新种子 | 是 |
| MEM-BR-009 | project | 事实真实性 | 不得以planned文档、fake断言、平台ACK或静态自检代替实际commit、run、外部结果、EV、verdict、signoff或readiness。 | 本文§3.1阅读清单 | 07-实施计划.md | §7/12 | 门禁/交付 | until superseded | formal优先，暂停/刷新种子 | 是 |
| MEM-BR-010 | project | 材料安全 | 日志、artifact和report必须拒绝外部正文、token、secret、敏感审批、附件字节及可还原派生，运行材料只按05固定安全schema生成。 | 本文§3.1阅读清单 | 07-实施计划.md | §7/8 | 任何输出/工具变更 | until superseded | formal优先，暂停/刷新种子 | 是 |

经验沉淀先分类项目/是否可泛化，补具体正反例并横扫同类。当前用户仅许Bridges写入、禁止提交，故不跨项目更新标准、不amend；需要这些动作时登记blocker请求新授权。不得把规范中的未来提交/amend流程当本轮许可。


## 8. 回填草稿

回填正式07§3仅采用§7规范内容；问题、诊断、取舍、过程记录不复制。最终在Step13按目标目录转换链接并逐章装配，不提前写正式07。

## 9. 待确认

BR-UP-001~009 open/010 reference_only、Workspace十二open、Observability十二affected原状态、actual资格及实现授权仍waiting；不由本Step自检释放。

## 10. 自检与过程

实施ledger schema和值域/未来planned特例核对；十个MEM稳定规则索引且无schema；两实际manifest/lib与根path/七bin来源一致；缺仓、baseline、资格保持blocked；逐boundary精确矩阵在Step6收敛前不得移交。

Step设计静态自检与规范回指已完成；未运行项目测试/编译/外部IO，不产生实际EV。下一仅顺序Step4。
