# L4-observability 07-实施计划 Step 03：实施前置条件与阅读清单

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 3
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.3
> 文档性质：设计讨论中间产物。本文不授权代码修改，不产生实现 commit、真实 run、artifact、report、evidence、verdict 或 signoff。

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 03 / 实施前置条件与阅读清单` |
| mode | `full-restart` |
| status | `completed_current_step_03` |
| current module | `prerequisites-reading-and-handoff-gates` |
| upstream | current Step 01~02；current formal `00~06` |
| formal `07` | 未在本 Step 修改，等待 Step 13 装配 |
| design gate | `pass_with_readiness_blockers` |
| implementation handoff | `blocked_until_current_07_completion_and_boundary_audit` |
| new upstream blocker | `none` |
| inherited affected | 12 项保持 `open_upstream_internal`、`open_controlled` 或 `open_internal_affected`，不由本 Step 关闭 |
| target reality | `/home/aris/Projects/quantalithos-observability` 当前不存在；不能核实 workspace、git identity、dirty state 或 target Cargo metadata |
| next allowed action | `continue_to_step_04` |
| current commit | 不需要；用户未要求提交 |

## 2. Step 内计划与执行记录

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取实施计划标准、台账标准和目录规范 | 必读输入登记 | done | SOP、书写规范、中间产物规范、代码实施台账规范和目录组织规范已读取 |
| 读取 current `00~06` 与 Step 01~02 | 上游和范围基线 | done | current 文档优先级、P0 范围和 affected 处置可定位 |
| 核验本机实现前置现实 | reality register | done | target 缺失、core 可见、runtime/event 协作仓不转 Cargo path dependency 已记录 |
| 建立全局阅读清单和阶段矩阵 | reading matrix | done | 每个 phase/boundary 有正式章节和校准文件入口 |
| 建立永久记忆种子和台账入口 | seed/ledger contract | done | 只记录执行规则，不复制 schema/state/business truth |
| 形成回填草稿与停审记录 | §3 草稿 | done | 正文只承载收口结论，未宣称实现 ready |

## 3. SOP 问题回答

### 3.1 实施者必须先读什么

实施者的读取顺序固定为：项目台账、当前 boundary 台账、正式 `07`、当前 boundary 的 Required Reads、上游正式文档和对应校准来源。任何恢复、换 agent、design baseline 变化或用户只说“继续”时，都必须重新执行这个顺序。

| 读取层 | 文件 | 目的 | 未读风险 |
|---|---|---|---|
| 项目执行状态 | `projects/L4-observability/design-calibration/implementation_execution_ledger.md` | 确认唯一 current boundary、baseline、blocker 和 next action | 在错误 boundary 或错误 baseline 上改代码 |
| boundary 状态 | `projects/L4-observability/design-calibration/implementation-boundaries/<boundary_id>.md` | 确认 allowed/forbidden scope、required checks 和 gate 状态 | 越界改动、重复实现或漏跑门禁 |
| 正式实施计划 | `projects/L4-observability/07-实施计划.md` | 获取当前 phase、任务、门禁、提交和 handoff 纪律 | 把校准讨论误当正式执行规则，或反向发明任务 |
| 当前详细契约 | `projects/L4-observability/03-详细设计.md` | 获取唯一 file/object/protocol/flow/state/UoW/error/telemetry owner | 在 handler 或 adapter 临时补字段/状态 |
| 当前配置契约 | `projects/L4-observability/04-配置设计.md` | 获取 typed config、profile、source priority、activation 和 fail-closed 规则 | 猜默认值、fallback 或环境语义 |
| 当前测试方案 | `projects/L4-observability/05-测试方案.md` | 获取 exact TC/DS/suite/lane/profile/script 和 evidence path | 用摘要或静态表代替测试输入 |
| 当前验收标准 | `projects/L4-observability/06-验收标准.md` | 获取 AC/NFR/VF、entry/exit、真实性和三值裁决规则 | 把 test pass 或设计状态写成验收通过 |
| 当前需求/架构/概要 | `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | 确认 truth owner、依赖方向、核心范围和非范围 | 将 observability 变成业务 truth owner |

### 3.2 语言、目录和提交规范是否已明确

设计输入已确定为 Rust workspace，但目标仓尚未建立，因此 edition、rust-version、workspace lockfile 和实际 git 配置不能在设计仓中伪造为已确认。Rust 编码规则来自 `standards/coding/rust.md`；代码仓目录规则来自 `standards/document/子项目目录与代码文件组织规范.md`；提交和门禁规则来自 `standards/document/代码实施台账与门禁规范.md` 与 `standards/document/实施计划书写规范.md`。

实现 agent 首次进入目标仓时必须核验：

1. `rustc --version`、`cargo --version` 与项目允许的 toolchain 约束。
2. workspace member 是否为 `crates/<role>`。
3. package 名是否为 `observability-<role>`，library crate 名是否为 `observability_<role>`。
4. binary 名是否表达入口或动作，且不包含 `L0`~`L4` 或 `l4_` 架构层级。
5. `core-contracts` 的 package、crate、edition、rust-version 和 path 是否与 current 03 的使用面一致。
6. 目标仓项目级 `user.name`、`user.email`、dirty state 和现有用户改动。

不得把设计仓的当前 git 状态、core 仓当前版本或历史 implementation ledger 当作目标仓 reality。

### 3.3 依赖和本机现实

| 依赖/路径 | 现实检查 | 实施计划口径 | 缺失或不匹配处理 |
|---|---|---|---|
| `/home/aris/Projects/quantalithos-observability` | 当前不存在 | 设计继续；PH-01 先做仓初始化或暂停 | 不得在设计仓代写实现；目标仓创建后重新做 reality check |
| `/home/aris/Projects/quantalithos-core` | 当前存在；`crates/contracts` package 为 `core-contracts`，Rust crate 为 `core_contracts` | 唯一允许的 sibling compile-time path dependency 候选 | package/type/edition 不匹配时阻塞 `commit-01-a`，不复制 shared type |
| `quantalithos-bus` | 当前存在 | runtime/event 协作；由 port、envelope、fake 或 controlled transport 绑定 | 不得添加 Cargo path dependency；缺 binding 时 disabled/blocked |
| `quantalithos-identity`、`quantalithos-governance`、`quantalithos-artifact` | 部分仓存在或由正式依赖矩阵定义 | runtime/event/ref/handoff 协作，不拥有本仓 truth | 不得把相邻仓 source truth 或正文带入本仓 |
| 外部 DB、APM、dashboard、GRC | 未建立为当前实现依赖 | P0 使用 formal fake/controlled/disabled seam | 不得以历史 README 技术选型代替 current config/ADR |

依赖裁剪不以“本机目录存在”为准，而以 current 架构和详细设计的依赖类型为准。只有 `core-contracts` 可以进入 Cargo 编译图；Bus、相邻业务仓、SDK、外部产品和运行时服务必须停留在 port/event/handoff/adapter 边界。

### 3.4 脚本、artifact 和 report 前置

下列路径是 planned implementation output，不表示当前文件或真实执行事实已经存在：

```text
scripts/gates/run_ci_gate.sh
scripts/reports/generate_reports.sh
scripts/checks/check_redaction.sh
scripts/checks/check_metric_labels.sh
scripts/checks/check_dependency_boundary.sh
artifacts/test/<run_id>/
reports/runs/<run_id>/
reports/acceptance/
reports/review/
```

脚本必须使用 current 03/05 的参数和路径合同：

| 类别 | 必须确认 | 禁止 |
|---|---|---|
| run identity | 调用者显式提供非空 `<run_id>` | `latest`、默认 run、跨 invocation 复用 |
| raw artifact | `artifacts/test/<run_id>` 与 run id 一致 | `artifacts/test/<project>/<run_id>` 或复制到第二 root |
| run report | `reports/runs/<run_id>` | 把 report generator 放进 reports 输出目录，或跨 run 拼接 |
| acceptance/review | `reports/acceptance`、`reports/review` | 自动生成 passed、verdict、signoff 或真实 evidence alias |
| CLI | 按脚本合同支持 `--run-id`、`--artifact-root`、必要时 `--report-root`/`--config-profile` | 通过环境隐式猜 root/profile |
| failure | 缺输入、无法解析、禁止字段、依赖越界或任一 required check 失败时非零并保留 finding | 删除失败 artifact、补默认成功或修改输入消除命中 |

### 3.5 项目级和 boundary 级台账入口

| 台账 | 路径 | 创建/激活时机 | 每次读取时机 | 缺失处理 |
|---|---|---|---|---|
| 项目级实施台账 | `projects/L4-observability/design-calibration/implementation_execution_ledger.md` | Step 13 完成时重建；实现移交前必须存在 | 每次恢复、换 agent、baseline 变化和 boundary 切换 | 不允许改代码；先回设计仓补台账 |
| boundary 台账 | `projects/L4-observability/design-calibration/implementation-boundaries/<boundary_id>.md` | Step 13 一次性预创建全部 planned skeleton | 当前 boundary 开工、跑门禁、提交和 handoff 前 | 缺当前台账则 blocked；缺未来 skeleton 则不得移交 |
| 实现仓 scratch | `<implementation_repo>/.codex/implementation_ledger.md` | 目标仓策略允许且实现 agent需要时 | 本地恢复 workspace 状态 | 可不提交，但不得替代设计仓台账 |

Step 13 前现有的旧 ledger/boundary 文件全部视为 `historical_material`。它们的 `current`、`commit`、`baseline` 和 `pass` 字样不会被继承。

### 3.6 Agent 永久记忆种子

永久记忆只能机械投影下表的规则，不得自由总结 schema、状态矩阵、业务规则或当前执行结果。

| 记忆 ID | 适用范围 | 必须写入的规则 | 来源 | 刷新触发 | 失效/冲突处理 |
|---|---|---|---|---|---|
| `MEM-OBS-001` | project | 开工、恢复或换 agent 前，先读项目台账、当前 boundary 台账、正式 `07` 和 Required Reads。 | 台账规范 §3、实施计划 SOP §2.9 | 台账路径或恢复点变化 | 正式 `07` 和台账优先；缺失时 `wait_design` |
| `MEM-OBS-002` | project/phase | Observability 只拥有 observation-side fact、projection、marker、history、outbox、handoff 和 derived maintenance，不拥有或反写业务 source truth。 | `00`、`01`、`03` | truth owner 或架构变化 | 回到 `00/01/03` 重审，不在实现端改 owner |
| `MEM-OBS-003` | boundary | 无法按正式设计 1:1 构造字段、DTO、状态、version、source、port 或 phase boundary 时必须阻塞并回写设计。 | 可落码性标准 §九、`03` §16 | 发现设计缺口 | 禁止临时 schema、alias、fallback 或默认状态 |
| `MEM-OBS-004` | project | 除 `core-contracts` 外，sibling repo 只通过 runtime/event/ref/handoff/adapter 协作，不进 Cargo path dependency。 | 依赖裁剪规则、`03` §3/§13 | dependency graph 变化 | 依赖 gate blocked，回架构/详细设计 |
| `MEM-OBS-005` | phase/boundary | raw artifact 使用 `artifacts/test/<run_id>`，report 使用 `reports/runs/<run_id>`；禁止 `latest` 和静态 evidence。 | `05`、`06`、`03` §15 | 脚本或路径变化 | report/evidence gate blocked |
| `MEM-OBS-006` | phase | `LocalTest`、`IntegrationLike`、`RuntimeLike` 必须显式配置；fake/controlled/disabled 不能被写成 production readiness。 | `04`、`05` | profile/mode 变化 | `InvalidConfiguration` 或 `not_evaluated` |
| `MEM-OBS-007` | handoff | 实现移交前按 phase/boundary 审计正式 `03/04/05/06/07`，并逐项记录 affected。 | SOP §2.10、`03` §16 | design baseline 变化 | 不得移交实现 |
| `MEM-OBS-008` | project | 修复设计后先判断是否属于同一项目，再检查是否需要沉淀可复用经验；需要时补标准/SOP/项目记忆和具体示例。 | 中间产物规范 §记忆种子 | 每次设计修复 | 在提交或 handoff 前完成 |
| `MEM-OBS-009` | evidence | 设计 `planned`、`blocked`、`not_run`、`not_evaluated` 不得转写为真实测试通过、验收结论或 signoff。 | `05/06` 真实性条款 | 每次报告生成 | 保留原状态并阻断正向结论 |

### 3.7 按 phase / boundary 的阅读矩阵

正式文档优先；校准文件用于解释决策和定位细节。如果二者冲突，先暂停并回设计，而不是在实现端选一个。

| phase / boundary | 必读正式章节 | 必读校准文件 | 开工前必须确认 |
|---|---|---|---|
| PH-01 / `commit-01-a` | `03` §3~§4、`04` §3~§6、`05` §8~§9、`07` §3~§5 | `03_ddd_step_03_constraints.md`、`03_ddd_step_04_file_layout.md`、current Step 03~05 | target repo、workspace、package/crate/binary、only-core dependency、profile root 可核验 |
| PH-01 / `commit-01-b` | `04` §7~§13、`05` §9、`06` §3 | `04_config_step_06_environment_profiles_matrix.md`、`04_config_step_09_loading_validation_activation.md`、`05_test_plan_step_13_evidence.md` | strict config、script args、same-run path、无 `latest` |
| PH-02 / `commit-02-a` | `03` §5~§7、§11、`05` §3~§6 | `03_ddd_step_05_module_contracts.md`、`03_ddd_step_06_object_contracts.md`、`03_ddd_step_08_protocol_contracts.md`、`05_test_plan_step_03_test_objects_cuts.md` | public type owner、二级类型、exact protocol 和 forbidden body 闭合 |
| PH-02 / `commit-02-b` | `03` §9~§12、§14、§15 | `03_ddd_step_10_state_matrix.md`、`03_ddd_step_11_persistence_transaction_consistency.md`、`03_ddd_step_12_error_recovery.md`、`03_ddd_step_15_observability_audit.md` | state/transition、UoW、error、redaction、telemetry source 闭合 |
| PH-03 / `commit-03-a` | `03` §7~§8、§11~§12、§14 | `03_ddd_step_09_function_flows.md`、`03_ddd_step_13_concurrency_idempotency.md`、`03_ddd_step_15_observability_audit.md`、`05_test_plan_step_06_cases.md` | accepted write order、idempotency digest、correlation/redaction 入口闭合 |
| PH-03 / `commit-03-b` | `03` §7.4、§8.4、§13、`05` §7/§9 | `03_ddd_step_08_protocol_contracts.md`、`03_ddd_step_14_config_external_binding.md`、`05_test_plan_step_08_environment_config.md` | Consumer pre-parse order、producer map、ack/completion；I05 仍 controlled |
| PH-04 / `commit-04-a` | `03` §5、§7、§9~§11、§14 | `03_ddd_step_06_object_contracts.md`、`03_ddd_step_09_function_flows.md`、`03_ddd_step_15_observability_audit.md` | append-only audit/evidence/hash/gap owner 和 UoW 顺序 |
| PH-04 / `commit-04-b` | `03` §7.3、§8.3、§11、§14、`06` §5~§6 | `03_ddd_step_08_protocol_contracts.md`、`03_ddd_step_16_test_cuts.md`、`06_acceptance_step_05_function_gate.md` | query surface、visibility、body-free linkage、acceptance trace |
| PH-05 / `commit-05-a` | `03` §5、§7.2~§7.5、§9、§14 | `03_ddd_step_06_object_contracts.md`、`03_ddd_step_08_protocol_contracts.md`、`03_ddd_step_15_observability_audit.md` | log/metric/trace schema、safe labels、projection marker、event snapshot |
| PH-05 / `commit-05-b` | `03` §7.3、§8.3、§10、§15 | `03_ddd_step_09_function_flows.md`、`03_ddd_step_11_persistence_transaction_consistency.md`、`05_test_plan_step_06_cases.md` | 14 Query zero-write、same-snapshot read、stale/degraded totality |
| PH-06 / `commit-06-a` | `03` §7.2/§7.6、§8.6~§8.7、§11~§13、`04` §10~§11 | `03_ddd_step_09_function_flows.md`、`03_ddd_step_12_error_recovery.md`、`03_ddd_step_13_concurrency_idempotency.md`、`05_test_plan_step_11_defects_retest.md` | job plan/report/ref、external phase、recovery class、same-token |
| PH-06 / `commit-06-b` | `03` §9~§12、`05` §6/§10、`06` §8~§10 | `03_ddd_step_10_state_matrix.md`、`03_ddd_step_11_persistence_transaction_consistency.md`、`05_test_plan_step_10_nonfunctional.md` | retention/protection/rebuild/no-write、J06 controlled、no source repair |
| PH-07 / `commit-07-a` | `03` §4、§5.3~§5.7、§13、`04` §8~§11 | `03_ddd_step_07_trait_port_adapter_contracts.md`、`03_ddd_step_14_config_external_binding.md`、`04_config_step_09_loading_validation_activation.md` | runtime builder complete-or-error、finite catalogs、entry least authority |
| PH-07 / `commit-07-b` | `03` §14~§16、`05` §9、`06` §3/§11 | `03_ddd_step_15_observability_audit.md`、`03_ddd_step_16_test_cuts.md`、`05_test_plan_step_13_evidence.md` | redaction/metric/dependency/report checks可从同一 run 生成 |
| PH-08 / `commit-08-a` | `05` §8~§10、`06` §3~§4 | `05_test_plan_step_08_environment_config.md`、`05_test_plan_step_09_automation_gates.md`、`06_acceptance_step_03_baseline.md` | required lane、baseline、run、raw/report provenance 可复查 |
| PH-08 / `commit-08-b` | `05` §11~§14、`06` §4、§11~§14 | `05_test_plan_step_11_defects_retest.md`、`05_test_plan_step_13_evidence.md`、`06_acceptance_step_14_final_decision_signoff.md` | handoff、VETO、risk/open issue 和三值裁决只保留待真实执行 |

### 3.8 开工、提交和 handoff 的最小门禁

| 门禁 | 通过条件 | 当前设计期状态 |
|---|---|---|
| Design Gate | 读取正式基线、当前校准来源和 affected register；字段/DTO/state/source/phase boundary 可 1:1 解释 | 设计可规划；各 affected positive path 仍 conditional/blocked |
| Scope Gate | 改动只属于当前 boundary allowed scope，未引入后续 phase 或未知 owner | 只能在目标仓建立后执行 |
| Worktree Gate | 目标仓存在、dirty state 已记录、用户改动不被覆盖、项目级 git identity 已核验 | blocked，目标仓不存在 |
| Build Gate | Rust format/check、workspace/dependency/static checks按 boundary 完成 | not_run |
| Test Gate | 当前 boundary 所需 TC/suite/lane 完成并保留失败/blocked 状态 | not_run |
| Evidence Gate | 只有真实 invocation 才可产生 raw/report；设计期只保留 planned linkage | not_applicable in design |
| Commit Gate | staged scope、message、diff check、required checks 和 ledger 完整 | not_run；不在设计仓提交 |
| Handoff Gate | commit/hash、测试结果、remaining blocker、next boundary 由真实实现台账回写 | blocked until Step 13 and target reality |

## 4. 当前文档问题诊断

| 材料 | 问题 | current 处置 |
|---|---|---|
| 旧 Step 03~13 | 以“已完成”摘要替代具体阅读、检查和台账规则 | 只作 historical；本文件重建前置合同 |
| 旧 implementation ledger | 使用不存在的 design baseline 和 current commit 叙述 | Step 13 重建；不继承状态 |
| README/旧技术栈 | 将产品、数据库、性能和部署假设当作前置条件 | 只保留方向线索；以 `03/04/05/06` 为准 |
| 目标仓缺失 | 无法验证实际 workspace、git、Cargo、CI 和 runtime | 作为 implementation blocker 进入 PH-01，不阻塞设计继续 |
| `core-contracts` 现实 | 本机可见但未与目标 workspace 结合 | 只记录候选 path dependency；目标仓创建后重新验证 |

## 5. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 把所有正式文档和校准文件列为每次全量必读 | 不采用 | 读取成本高且不能体现 boundary 相关性；改用阶段阅读矩阵 |
| 只列正式文档，不列 calibration | 不采用 | 无法定位 affected、取舍和历史冲突；实现者在歧义时容易自行补口 |
| 在设计仓先创建目标实现仓和 git 配置 | 不采用 | 违反只做设计文档和真实性规则；目标仓 reality 必须由实现阶段核验 |
| 把本机 sibling 仓全部写成 Cargo 依赖 | 不采用 | 违反全局依赖裁剪；运行期/event 协作不等于编译期依赖 |
| 用永久记忆复制 schema/state 方便 agent | 不采用 | 会产生第二真相源；记忆只保存执行规则和来源索引 |

## 6. 回填草稿

正式 `07` §3 只回填以下结论：实施者必须先读取项目/边界台账、正式 `00~07`、当前 boundary Required Reads、适用标准和阶段 calibration；目标仓创建后必须核实 Rust workspace、命名、git、only-core compile dependency、profile 和 dirty state。脚本使用同一 `<run_id>` 的 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`，禁止 `latest`、静态 evidence 和默认成功。永久记忆只保存执行规则，实施移交前必须按 phase/boundary 审计正式 `03/04/05/06/07`。目标仓当前不存在，因此 implementation handoff 仍 blocked。

## 7. 待确认事项、blocker 与停审

| 项 | 状态 | 影响 | 处理 |
|---|---|---|---|
| target implementation repo | `open_blocker` | 无法进行代码、Cargo、git、build、test 或 commit reality check | PH-01 创建或确认后重新核验 |
| 12 inherited affected | `open/controlled/conditional` | 阻塞对应 positive boundary；不阻塞计划文档继续收敛 | Step 06/07/09 按 boundary 显式绑定 |
| real CI / RuntimeLike / external capability | `not_established` | release/acceptance 只能保持 planned/not_evaluated | Step 08/09/12 保持真实性状态 |
| new upstream blocker | `none` | 本 Step 未发现要求回退 `00~06` 的新冲突 | 保持 `none`；既有 affected 不得被关闭 |

## 8. Step 自检与进入下一步条件

| 检查项 | 结论 |
|---|---|
| 阅读清单是否覆盖正式文档、标准、台账和目录规范 | pass |
| 阶段阅读矩阵是否按 phase/boundary，而非粗暴列目录 | pass |
| 是否明确目标仓和 sibling dependency 的现实边界 | pass_with_readiness_blockers |
| 是否定义 script/artifact/report 的 canonical path 和真实性 | pass |
| 是否存在可机械投影的永久记忆种子 | pass |
| 是否把 affected 或设计状态误报为 implementation pass | no |
| 是否伪造 commit/run/evidence/verdict/signoff | no |
| gate_status | `pass_with_readiness_blockers` |
| next_allowed_action | `continue_to_step_04` |
