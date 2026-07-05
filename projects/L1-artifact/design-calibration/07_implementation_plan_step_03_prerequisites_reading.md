# Step 3. 收稳前置条件与阅读清单

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 3
> 回填章节: `07-实施计划.md` §3 实施前置条件与阅读清单
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 收稳前置条件与阅读清单 |
| 当前状态 | 已完成;用户审查通过 |
| 输入基线 | Step 1 输入边界;Step 2 实施范围;`03-详细设计.md` §3~§5 / §16;目录组织规范;Rust 编码规范;实施计划规范;代码实施台账规范 |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_03_prerequisites_reading.md` |
| 停审方式 | 用户已确认,已进入 Step 4 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 1 输入边界 | 已完成 | 确认 `00`~`06`、标准、目标实现仓和 implementation ledger 风险 |
| Step 2 实施范围 | 已完成 | 确认 P0 Artifact truth center、非范围和 P1 / P2 防误入 |
| `03-详细设计.md` §3~§5 / §16 | 已存在 | 确认 Rust、git config、workspace、crate、package、binary、实施前门禁 |
| `05-测试方案.md` §9 / §13 / §14 | 已存在 | 确认 gate scripts、report scripts、artifact/report roots、candidate evidence 和 regression trigger |
| `06-验收标准.md` §3 / §10~§14 | 已存在 | 确认验收基线、VETO、evidence integrity、risk acceptance 和 signoff 边界 |
| `standards/coding/rust.md` | 标准输入 | 确认 Rust 标识符、注释、rustdoc、测试名和错误处理规范 |
| `standards/document/子项目目录与代码文件组织规范.md` | 标准输入 | 确认实现仓、workspace、package、crate、binary、scripts、reports、artifacts |
| `standards/document/实施计划书写规范.md` | 标准输入 | 确认阶段、commit boundary、门禁、提交和永久记忆种子要求 |
| `standards/document/代码实施台账与门禁规范.md` | 标准输入 | 确认 implementation ledger、boundary ledger、gate matrix 和 planned skeleton 预创建 |
| `/home/aris/Projects` 本地目录 | 已检查 | `quantalithos-core` 存在;`quantalithos-artifact` 当前未发现 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 实施者必须先读哪些文档,分别为了理解什么? | 必须读 `00` 理解五个核心能力、`FR-ART-*`、`BR-ART-*`、NFR 和 `VF-ART-*`;读 `01` 理解 truth boundary、正文排除和依赖方向;读 `02` 理解组成部分和主流程;读 `03` 与对应 `design-calibration/03_ddd_step_*` 理解可落码契约;读 `04` 理解配置和外部绑定;读 `05` 理解测试切口、suite 和 evidence;读 `06` 理解 `AC-ART-*`、`VETO-ART-*` 和风险接受;读 `07` 理解 phase、commit boundary 和门禁。还必须读 Rust 编码规范、目录组织规范、实施计划规范、代码实施台账规范和可落码性标准。 |
| 当前项目使用什么语言和编码规范? | 目标实现仓使用 Rust workspace,Rust edition 2024。源码标识符、rustdoc、普通注释和测试名默认英文;设计文档正文使用中文。编码规范来源为 `standards/coding/rust.md`。 |
| Rust 项目是否已明确 `standards/coding` 下的 Rust 编码规范? | 已明确。实施者开工前必须读取 `standards/coding/rust.md`,不能只依赖个人 Rust 习惯。 |
| 是否必须阅读提交规范和历史提交? | 必须。实现仓 commit message 使用英文,标题固定为 `type(scope): subject`;设计仓提交与实现仓语言边界在 Step 11 继续细化。实施者需要阅读本实施计划 §11、目标实现仓历史提交和项目提交约束。 |
| 项目级 git `user.name` 和 `user.email` 应如何配置? | 目标实现仓必须使用项目级配置:`git config user.name "quantalithos-labs"` 和 `git config user.email "quantalithos.ai@gmail.com"`。不得用 `--global` 替代项目级检查。 |
| 是否有必须先启动或确认的本地服务、数据库、消息系统或外部依赖? | P0 不要求真实 DB、bus、search、object storage、metric backend、archive / observability / sync vendor 或 external product。P0 需要确认 `quantalithos-core` 存在并能作为唯一编译期 sibling dependency;其他相邻仓通过 ref / event / adapter / fake / controlled seam 协作。当前 `/home/aris/Projects/quantalithos-artifact` 未发现,需由 PH-01 创建或开工前手动创建。 |
| 每个实施阶段或 commit boundary 开工前,必须先读哪些正式章节? | 每个 boundary 必读 `03-详细设计.md` 中与该 boundary 对应的模块、对象、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cuts 章节;同时读 `05` 对应 suite / test case 和 `06` 对应 AC / VETO。Step 6 会按 boundary 固定最终阅读矩阵。 |
| 这些正式章节引用了哪些 `design-calibration` 中间产物,其中哪些会影响当前阶段实现判断? | 对实现判断影响最大的是 `03_ddd_step_04_file_layout.md`、Step 5~8 模块 / 对象 / port / protocol、Step 9 flow、Step 10 state matrix、Step 11 persistence、Step 12 error、Step 13 idempotency、Step 14 config、Step 15 observability、Step 16 test cuts、Step 17 handoff,以及 `05_test_plan_step_09/13` 和 `06_acceptance_step_05~15`。 |
| 如果正式文档和 `design-calibration` 表述不一致,实施者应该以哪个为准,何时暂停回报设计缺口? | 正式 `00`~`07` 优先;正式文档不清楚时读取对应校准来源;仍不闭合或校准来源与正式文档冲突时暂停并回报设计缺口,不得自行补 schema、port、状态或 boundary。 |
| 本仓是否依赖 `/home/aris/Projects` 下已经实现的 sibling repo? | 编译期只依赖 `/home/aris/Projects/quantalithos-core` 的 `crates/contracts`。本地目录检查显示 `quantalithos-core`、`quantalithos-bus`、`quantalithos-identity`、`quantalithos-method-library`、`quantalithos-process`、`quantalithos-sdk`、`quantalithos-work`、`quantalithos-conversation`、`quantalithos-governance` 存在,但除 core 外都不得成为 Cargo path dependency。 |
| 对已确认的编译期依赖,当前应使用本地 path dependency 还是 private git tag / rev? | 当前使用本地 path dependency:`core-contracts = { path = "../quantalithos-core/crates/contracts" }`。private git tag / rev 可作为中期发布策略,不作为当前 P0 默认。 |
| 目标实现仓目录是否为 `/home/aris/Projects/quantalithos-<project>`? | 是,目标目录为 `/home/aris/Projects/quantalithos-artifact`。当前检查未发现该目录,必须进入 PH-01 或前置门禁。 |
| workspace member、Cargo package、Rust crate 和 binary 名是否与详细设计一致? | 必须一致。member 目录为 `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs`;package 为 `artifact-<role>`;library crate 为 `artifact_<role>`;entry binary 按 `artifact-api`、`artifact-worker` 或 job action 命名。 |
| 是否存在 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名? | 不允许。`L1-artifact` 只用于设计仓目录;实现仓、package、crate、module、file、binary 中不得出现 `L1` / `l1_`。 |
| 目标实现仓是否需要创建 `scripts/gates/`、`scripts/reports/`、`scripts/checks/` 和 `scripts/dev/`? | 需要。P0 gate、report、redaction、dependency、artifact/report pairing、no-static-evidence 和 dev helper 都需要稳定脚本入口;脚本不得放入 `reports/` 输出目录。 |
| 目标实现仓是否需要创建或保留 `artifacts/test/<run_id>` 和 `reports/`? | 需要。raw artifact root 固定为 `artifacts/test/<run_id>`;human report root 固定为 `reports/runs/<run_id>` 和 `reports/acceptance`;审查补充可进入 `reports/review`。 |
| 哪些 gate / report / check 脚本是本轮实施交付物? | 至少包括 `scripts/gates/run_ci_gate.sh`、`scripts/gates/run_release_gate.sh`、`scripts/gates/run_selected_p1_gate.sh`、`scripts/reports/generate_reports.sh`、`scripts/reports/build_gate_summary.sh`、`scripts/reports/build_evidence_candidates.sh`、`scripts/reports/generate_acceptance_handoff.sh`、`scripts/reports/generate_veto_checklist.sh`、`scripts/reports/generate_risk_acceptance.sh`、`scripts/reports/generate_open_issues.sh`、`scripts/checks/check_redaction.sh`、`scripts/checks/check_dependency_boundary.sh`、`scripts/checks/check_artifact_report_pairing.sh`、`scripts/checks/check_no_static_evidence.sh`。 |
| 这些脚本是否必须支持 `--run-id`、`--artifact-root`、`--config-profile`? | gate / report / check 脚本必须按职责支持 `--run-id`、`--artifact-root`、`--report-root`、`--config-profile`、`--suite`、`--gate` 中的适用参数。正式证据不得依赖隐式 current run。 |
| 是否明确禁止 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式引用 `latest`? | 是。正式路径只能使用 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 和 `reports/review`;不得使用 `latest`。 |
| 哪些规则必须由实现 agent 在项目永久记忆中保存? | 必须保存目标仓路径、唯一编译期依赖、Rust / commit / git config 纪律、正式文档优先、不得自行补设计、artifact/report path、交付实现前审计、implementation ledger 读取和设计修复后经验沉淀检查。 |
| 永久记忆种子是否只写执行规则和规范索引,没有复制详细设计字段 schema、状态矩阵或业务规则正文? | 是。永久记忆只记录规则、路径、刷新触发和冲突处理,不复制 DTO 字段、状态矩阵、业务规则或测试用例正文。 |
| 当前 boundary 的语言 / 技术栈规范路径是否来自阅读清单,而不是在永久记忆中写死某一种语言? | 是。语言 / 技术栈规范路径来自 `07` §3 阅读清单和 `standards/coding/rust.md`。 |
| 永久记忆种子是否包含交付实现前按 phase / commit boundary 审计正式 `03/05/06/07` 的规则? | 必须包含。 |
| 永久记忆种子是否包含修复设计文档后显式检查是否需要总结可复用经验的规则? | 必须包含。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `07-实施计划.md` | 尚未定义前置阅读、git config、目录和脚本门禁 | 实现 agent 容易跳过规范和 baseline | 本 Step 固定前置清单 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-artifact` 当前不存在 | 实现开工无落点 | 作为 PH-01 / 开工前 blocker |
| sibling repo | 多个相邻仓存在 | 实现者可能误加 Cargo path dependency | 只允许 `core-contracts` 为编译期 path dependency |
| calibration 文件 | 详细、测试、验收 calibration 数量大 | 实现者可能一次性全读或漏读关键 Step | 用阶段实施前阅读矩阵按 boundary 读取 |
| implementation ledger | 尚未创建 | 后续实现 agent 会因缺台账反复回设计侧 | Step 3 固定入口;Step 6 / Step 13 必须预创建 |
| 永久记忆 | 若自由总结容易复制设计 truth 或写入临时规则 | 后续实现回合可能带入过期 schema | 本 Step 输出机械投影种子表和生成门禁 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 前置阅读 | 分散在 `00`~`06` 和 standards | 形成阅读清单和阶段阅读矩阵 | 降低实现 agent 漏读风险 |
| 目录命名 | 只在 `03` 和目录规范中出现 | 在实施前置门禁中再次固定 | 防止实现仓命名偏移 |
| sibling 依赖 | 多仓均存在 | 只允许 `core-contracts` 为编译期 path dependency | 执行依赖裁剪红线 |
| evidence 路径 | 分散在 `05/06` | 固定为 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | 防止 `latest` 和静态证据 |
| 记忆生成 | 可能自由总结 | 只从种子表机械投影 | 防止复制设计 truth 和临时规则 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 要求实现者一次性全读所有 calibration | 最完整 | 成本高,容易忽略当前 boundary 关键文件 | 不采用 |
| 按 phase / commit boundary 阅读相关正式章节和校准文件 | 精准,可执行 | 需要 Step 5 / Step 6 继续细化 | 采用 |
| 把 DTO / 状态矩阵摘要写入永久记忆 | 后续回合看起来方便 | 容易过期并形成第二真相源 | 不采用 |
| 永久记忆只写规则和索引 | 稳定,不复制设计 truth | 实现者仍需回读正式文档 | 采用 |
| 把 implementation boundary 台账留给实现 agent 现场创建 | 设计阶段省事 | 与台账规范冲突,会造成实现推进 blocker | 不采用;Step 6 / Step 13 预创建 |

## 7. 结构化中间产物

### 7.1 阅读清单

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求文档 | `projects/L1-artifact/00-需求文档.md` | 理解五个核心能力、`FR-ART-*`、`BR-ART-*`、NFR、`VF-ART-*` 和非范围 | 误扩 P0 或漏掉 VETO | 能说明五个核心能力与 `FR-ART-001~020` |
| 架构设计 | `projects/L1-artifact/01-架构设计.md` | 理解 truth boundary、正文排除、依赖方向和跨仓 seam | 误引入 sibling compile dependency 或保存外部正文 | 能说明唯一编译期上游和跨仓 seam |
| 概要设计 | `projects/L1-artifact/02-概要设计.md` | 理解组成部分、对象轮廓、接口骨架和处理流 | 按对象横切而非可验证纵切实施 | 能说明主要组成部分和接口骨架 |
| 详细设计 | `projects/L1-artifact/03-详细设计.md` | 理解可落码契约入口 | 自行补字段、port、状态或 flow | 能定位对应 calibration 来源 |
| 配置设计 | `projects/L1-artifact/04-配置设计.md` | 理解 P0 profiles、adapter binding、entry config 和 fail-fast | fake / disabled / controlled seam 被误判 | 能说明 P0 profile 和 unavailable 处理 |
| 测试方案 | `projects/L1-artifact/05-测试方案.md` | 理解 `TC-ART-*`、suite、artifact / report 和 candidate evidence | 最后补测或静态造证据 | 能说明 blocking suite 和 report path |
| 验收标准 | `projects/L1-artifact/06-验收标准.md` | 理解 `AC-ART-*`、`VETO-ART-*`、risk acceptance 和 final decision | 误把 residual 当 pass | 能说明 VETO 触发条件 |
| 实施计划 | `projects/L1-artifact/07-实施计划.md` | 理解 phase、commit boundary、门禁和完成判定 | 越界实现或提交粒度失控 | 能说明当前 boundary 的输入 / 输出 / 门禁 |
| Rust 编码规范 | `standards/coding/rust.md` | 统一 Rust 代码语言、注释、测试和错误风格 | 源码混入中文或不合规范 | 开工前确认已读 |
| 目录组织规范 | `standards/document/子项目目录与代码文件组织规范.md` | 统一实现仓、workspace、package、crate、scripts、reports、artifacts | 目录 / 命名偏移 | 检查目录和 Cargo metadata |
| 代码实施台账规范 | `standards/document/代码实施台账与门禁规范.md` | 统一 implementation ledger、boundary ledger 和 handoff gate | 实现推进时缺 boundary 或越权开工 | 能说明当前 boundary 和 next_allowed_action |
| 可落码性标准 | `standards/document/设计真相源闭环与可落码性标准.md` | 执行字段、DTO、状态、outbox、job、phase boundary 复核 | 实现者现场补设计 | Step 6 经验复核引用 |

### 7.2 阶段实施前阅读矩阵

> 说明: 本矩阵按 Step 2 的实施范围预分组。正式 phase / commit boundary 名称由 Step 5 / Step 6 固定后,必须把本矩阵细化到每个 boundary。

| 阶段 / commit boundary | 必读正式章节 | 必读 `design-calibration` | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| PH-01 foundation | `03` §3~§5;`04` §3~§9;`05` §9;`06` §3 | `03_ddd_step_03_constraints.md`;`03_ddd_step_04_file_layout.md`;`04_config_step_06_environment_profiles_matrix.md`;`05_test_plan_step_09_automation_gates.md` | 确认 workspace、dependency、config、scripts 和 path roots | 能说明仓目录、crate/package、core dependency 和 scripts root |
| PH-02 fact / intake / review | `03` §5~§12;`05` §3~§7;`06` §5~§8 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_10_state_matrix.md`;`03_ddd_step_11_persistence_transaction_consistency.md` | 确认 fact、intake、automation、review、responsibility command 纵切 | 当前 command boundary 字段 / DTO / state / version / outbox source 已闭合 |
| PH-03 version / lineage / baseline | `03` §5~§13;`05` state / idempotency suites;`06` §5 / §8 / §11 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_10_state_matrix.md`;`03_ddd_step_13_concurrency_idempotency.md` | 确认 version、lineage、baseline 迁移、stored result 和 duplicate replay | transition、expected version、history retain 和 VETO source 已闭合 |
| PH-04 read / projection / consumption | `03` §7~§11;`05` query tests;`06` §7 / §8 | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md` | 确认 query no-write、visibility、projection / trace / report view、consumable ref | 能说明 view DTO、repository helper、not visible / degraded / stale surface |
| PH-05 inbound / outbound / relay | `03` §7~§13;`05` consumer / outbox / relay tests;`06` interface sync / VETO | `03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_12_error_recovery.md`;`03_ddd_step_13_concurrency_idempotency.md` | 确认 event envelope、consumer receipt、outbox payload snapshot、worker-only relay facade | payload source、topic key、duplicate receipt、retry / failed marker 已闭合 |
| PH-06 jobs / handoff / report | `03` §7~§13 / §15;`05` job / operations replay;`06` job / no truth repair | `03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md`;`03_ddd_step_15_observability_audit.md` | 确认 job DTO、report、handoff/export、duplicate replay、no truth repair | job report result surface、partial failure 和 marker 写路径已闭合 |
| PH-07 gates / evidence / acceptance handoff | `04` §9~§12;`05` §9 / §13;`06` §10~§14;`07` §7 / §11 / §12 | `05_test_plan_step_09_automation_gates.md`;`05_test_plan_step_13_evidence.md`;`06_acceptance_step_10_observability_evidence.md`;`06_acceptance_step_11_veto.md`;`06_acceptance_step_14_final_decision_signoff.md` | 确认 gate、report、EV candidate、redaction、dependency、VETO、acceptance handoff | fixed run artifact/report、no static evidence、human-readable reports |

### 7.3 实施台账入口表

| 台账 | 路径 | 创建时机 | 读取时机 | 缺失处理 |
|---|---|---|---|---|
| 项目级实施台账 | `projects/L1-artifact/design-calibration/implementation_execution_ledger.md` | Step 13 / 实现移交前 | 每次继续 / 换 agent / design baseline 变化 / 进入新 boundary | 先创建,不得改代码 |
| boundary 级实施台账 | `projects/L1-artifact/design-calibration/implementation-boundaries/<boundary_id>.md` | 实现移交前按 Boundary Gate Matrix 预创建全部 planned skeleton;当前 boundary 激活为 `read_docs` | 修改代码前 / 跑门禁前 / 提交前 / handoff 前 | 缺当前台账不得改代码;缺未来 planned skeleton 不得移交实现 |
| scratch 台账 | `/home/aris/Projects/quantalithos-artifact/.codex/implementation_ledger.md` | 项目要求时 | 本地恢复工作区状态、touched files、commands run、用户无关改动 | 可选;若当前 boundary 要求则缺失时先创建 |

### 7.4 Boundary Gate Matrix 模板

| Commit boundary | Design Gate | Scope Gate | Build Gate | Test Gate | Evidence Gate | Commit Gate | Handoff Gate |
|---|---|---|---|---|---|---|---|
| `commit-xx-a` | baseline + design closure | allowed / forbidden scope | `cargo fmt`;`cargo check` 或 boundary 指定 build | targeted tests / suite | artifact/report 或 N/A | staged scope + message + diff check | hash + next action + ledger update |

### 7.5 Agent 启动与永久记忆种子表

| 记忆 ID | 适用范围 | 类别 | 必须写入的记忆文本 | 规范路径来源 | 来源文档 | 来源章节 | 刷新触发 | 失效条件 | 冲突处理 | 禁止改写 |
|---|---|---|---|---|---|---|---|---|---|---|
| MEM-ART-001 | project | 目标仓 | 本项目实现仓为 `/home/aris/Projects/quantalithos-artifact`;若不存在,先按 `07-实施计划.md` PH-01 创建或暂停确认,不得在 design 仓写实现代码。 | `07` §3 | `07-实施计划.md` | §3 | 项目首次开工 / 仓路径变更 | until superseded | 暂停并回报路径偏离 | 是 |
| MEM-ART-002 | project | 依赖纪律 | 唯一允许的编译期 sibling dependency 是 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`;其他仓只能通过 runtime / event / adapter / fake seam 协作。 | `03` §3 / `07` §3 | `03-详细设计.md`;`07-实施计划.md` | §3 | Cargo dependency 变更 / phase 开工 | until superseded | 暂停并回报 dependency boundary violation | 是 |
| MEM-ART-003 | project | 编码规范 | Rust 源码标识符、rustdoc、普通注释和测试名默认英文;开工前读取 `standards/coding/rust.md`。 | `07` §3 | `07-实施计划.md` | §3 | 首次开工 / 规范路径变更 | until superseded | 正式文档优先 | 是 |
| MEM-ART-004 | commit-boundary | 设计边界 | 实现时不得自行补字段、DTO、port、状态、version 来源、outbox source、job report surface 或 phase boundary;无法 1:1 落码时暂停并回报设计缺口。 | 可落码性标准 / `07` §3 | `07-实施计划.md` | §3 / §6 | 每个 boundary 开工 | until superseded | 暂停并回写 design repo | 是 |
| MEM-ART-005 | project / phase | 证据路径 | 测试 raw artifact root 固定为 `artifacts/test/<run_id>`,report root 固定为 `reports/runs/<run_id>` 和 `reports/acceptance`;不得引用 `latest`。 | `05` §9 / §13;`07` §3 | `05-测试方案.md`;`07-实施计划.md` | §9 / §13 / §3 | gate / report script 变更 | until superseded | 修正路径口径并重跑门禁 | 是 |
| MEM-ART-006 | project / boundary | 交付实现前审计 | 在把项目交给实现 agent 或进入新的实现 baseline 前,必须按 phase / commit boundary 审计正式 `03/05/06/07`;未通过项先回写设计并固定新 baseline。 | `07` §3 / 可落码性标准 | `07-实施计划.md` | §3 / §12 | 实现移交前 / design baseline 变化 | until superseded | 暂停移交实现 | 是 |
| MEM-ART-007 | project | 经验沉淀 | 修复设计文档后,必须显式检查是否需要总结可复用经验;需要时同步补标准 / SOP / 项目记忆并添加正反例。 | `07` §3 / 可落码性标准 | `07-实施计划.md` | §3 | 每次设计修复后 | until superseded | 先判断同项目归属再沉淀 | 是 |
| MEM-ART-008 | project / boundary | 实施台账 | 每次继续、换 agent、进入新 boundary、准备提交或设计 blocker 修复后,必须先读项目级 implementation ledger 和当前 boundary ledger;台账缺失或非当前 boundary 未激活时不得改代码。 | `07` §3 / 代码实施台账规范 | `07-实施计划.md` | §3 / §6 | 每次继续 / boundary 切换 / design baseline 变化 | until superseded | 正式台账优先,暂停并回写设计仓 | 是 |

### 7.6 Agent 永久记忆生成门禁

| 检查项 | 通过标准 | 失败处理 |
|---|---|---|
| 种子表存在 | `07` §3 给出 `MEM-ART-*` 种子表 | 不生成永久记忆 |
| 只写表内内容 | 永久记忆逐条来自 `必须写入的记忆文本` | 删除自由总结内容 |
| 来源完整 | 每条有来源文档、章节、刷新触发和冲突处理 | 不写入该条 |
| 不复制设计 truth | 不写 DTO 字段表、状态矩阵、业务规则正文或测试用例全文 | 改为索引正式文档 |
| 交付实现前审计 | 包含 `MEM-ART-006` | 暂停并补种子表 |
| 设计修复后经验检查 | 包含 `MEM-ART-007` | 暂停并补种子表 |
| 实施台账恢复 | 包含 `MEM-ART-008` | 暂停并补种子表 |
| 临时规则隔离 | 当前文档生成期临时约束不进入实现仓永久记忆 | 删除临时规则 |

### 7.7 git 配置检查清单

| 检查项 | 命令 | 通过标准 | 失败处理 |
|---|---|---|---|
| user.name | `git config user.name` | `quantalithos-labs` | 在目标仓执行项目级 `git config user.name "quantalithos-labs"` |
| user.email | `git config user.email` | `quantalithos.ai@gmail.com` | 在目标仓执行项目级 `git config user.email "quantalithos.ai@gmail.com"` |
| 提交仓确认 | `git rev-parse --show-toplevel` | 位于 `/home/aris/Projects/quantalithos-artifact` | 暂停,不得把实现提交写进 design 仓 |
| 工作区状态 | `git status --short` | 只含当前 boundary 相关改动 | 拆分或移除无关改动 |

### 7.8 代码仓目录与命名前置检查表

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-artifact` | 检查目录存在 | PH-01 创建或暂停确认 |
| workspace member | `crates/contracts/domain/application/infra/api/worker/jobs` | 检查 `crates/` | 暂停并修正 |
| Cargo package | `artifact-contracts` 等 `artifact-<role>` | 检查 `Cargo.toml` | 暂停并修正 |
| Rust lib crate | `artifact_contracts` 等 `artifact_<role>` | 检查 `[lib].name` | 暂停并修正 |
| binary 名 | `artifact-api`、`artifact-worker`、job action binary | 检查 `[[bin]].name` | 暂停并修正 |
| 架构层级泄漏 | 代码命名不出现 `L0` / `L1` / `l0_` / `l1_` | 搜索 package / crate / file / module | 暂停并回报 |

### 7.9 本地多仓依赖前置检查表

| 依赖仓库 | 全局依赖类型 | 本地路径 | 当前引用方式 / 协作方式 | 检查方式 | 不存在时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | Cargo path dependency: `../quantalithos-core/crates/contracts` | 检查目录和 crate manifest | 阻塞 PH-01 |
| `quantalithos-bus` | 事件协作依赖 | `/home/aris/Projects/quantalithos-bus` | 不作为 Cargo dependency;topic / publisher seam 或 fake | 检查存在性和设计输入 | 不阻塞 P0 fake |
| `quantalithos-identity` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-identity` | actor / responsibility / capability ref 或 resolver fake | 检查 ref / event 契约 | 不阻塞 P0 fake |
| `quantalithos-process` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-process` | process artifact context ref / event / fake | 检查 ref / event 契约 | 不阻塞 P0 fake |
| `quantalithos-work` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-work` | work artifact context ref / event / fake | 检查 ref / event 契约 | 不阻塞 P0 fake |
| `quantalithos-governance` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-governance` | governance artifact context / evidence basis ref / fake | 检查 ref / event 契约 | 不阻塞 P0 fake |
| `quantalithos-method-library` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-method-library` | method artifact definition ref / event / snapshot fake | 检查 ref / event 契约 | 不阻塞 P0 fake |
| `quantalithos-conversation` | 运行期 / 事件协作依赖 | `/home/aris/Projects/quantalithos-conversation` | conversation context event / fake | 检查 ref / event 契约 | 不阻塞 P0 fake |
| external archive / observability / sync | 外部运行期依赖 | vendor 未锁定 | disabled / fake / controlled handoff adapter | config profile | 不阻塞 P0 |

### 7.10 测试脚本与报告工具前置检查表

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| gate scripts | `scripts/gates/run_ci_gate.sh`;`run_release_gate.sh`;`run_selected_p1_gate.sh` | `--help` / path check | 创建或修正 |
| report scripts | `scripts/reports/generate_reports.sh`;`build_gate_summary.sh`;`build_evidence_candidates.sh`;acceptance draft generators | `--help` / sample artifact | 创建或修正 |
| check scripts | `scripts/checks/check_redaction.sh`;`check_dependency_boundary.sh`;`check_artifact_report_pairing.sh`;`check_no_static_evidence.sh` | `--help` / failure sample | 创建或修正 |
| artifact root | `artifacts/test/<run_id>` | gate dry run | 修正路径口径 |
| report root | `reports/runs/<run_id>` and `reports/acceptance` | report dry run | 修正路径口径 |
| formal run ref | 固定 `<run_id>`,不得引用 `latest` | grep / report audit | 暂停并修正 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阅读清单”“阶段实施前阅读矩阵”“实施台账入口表”“Agent 启动与永久记忆种子表”“git 配置检查清单”“代码仓目录与命名前置检查表”和“测试脚本与报告工具前置检查表”小节,了解实施前置条件如何收敛。

正式 `07-实施计划.md` §3 应回填:

实现 agent 开工前必须确认目标实现仓 `/home/aris/Projects/quantalithos-artifact` 存在或由 PH-01 创建,确认项目级 git user 为 `quantalithos-labs <quantalithos.ai@gmail.com>`,确认 Rust 编码规范、目录组织规范、实施计划规范、代码实施台账规范和可落码性标准已读,并按当前 boundary 读取正式 `00`~`07` 及对应 `design-calibration` 来源。

正式实现只能在目标实现仓进行。唯一允许的编译期 sibling dependency 是 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`;其他相邻仓只能通过 ref、event、adapter、fake、controlled 或 disabled seam 协作。实现仓必须使用 `artifact-<role>` package、`artifact_<role>` crate、`artifact-api` / `artifact-worker` binary 和 `crates/contracts/domain/application/infra/api/worker/jobs` workspace 布局。

实现 agent 每次继续、换 agent、进入新 boundary、准备提交或设计 blocker 修复后,必须先读取项目级 implementation ledger 和当前 boundary ledger。正式 `07` 定稿前必须预创建全部 planned boundary 台账骨架,当前唯一激活 boundary 才允许开工。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `quantalithos-artifact` 由 PH-01 创建还是先手工创建 | 影响实现开工顺序 | Step 5 决定 |
| implementation boundary 命名与数量 | 影响 Step 6 / Step 13 planned skeleton | Step 5 / Step 6 决定 |
| scripts 是否由 PH-01 先建空壳还是随证据阶段补齐 | 影响 gate 可执行性 | Step 6 / Step 7 决定 |
| 是否需要 `.codex/implementation_ledger.md` scratch 台账 | 影响实现仓本地恢复 | Step 6 / Step 10 决定 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 阅读清单明确 | 通过 | 正式 `00`~`07`、standards 和关键 calibration 已列出 |
| 阶段阅读矩阵已预分组 | 通过 | Step 5 / Step 6 继续细化到 boundary |
| git / Rust / 目录 / 依赖 / scripts 前置检查明确 | 通过 | 可进入实施对象与交付物抽取 |
| 永久记忆种子和生成门禁明确 | 通过 | 只保存规则和索引,不复制设计 truth |
| implementation ledger 责任已固定 | 通过 | Step 6 / Step 13 必须预创建 |
| 可进入 Step 4 | 通过 | 下一步抽取实施对象与交付物;进入前等待用户审查 |
