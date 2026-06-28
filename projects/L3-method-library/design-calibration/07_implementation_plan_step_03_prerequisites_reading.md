# Step 3. 收稳前置条件与阅读清单

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 3
> 回填章节: `07-实施计划.md` §3 实施前置条件与阅读清单
> 当前模块: `R3.2 prerequisites and reading:再写入`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 收稳前置条件与阅读清单 |
| 当前模块 | `R3.2 prerequisites and reading:再写入` |
| 当前状态 | completed_confirmed |
| 输入基线 | Step 1 输入边界;Step 2 实施范围;`03-详细设计.md` §3~§4 / §16;`04`~`06`;实施计划规范;代码实施台账规范 |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_03_prerequisites_reading.md` |
| 停审方式 | 用户已确认 Step 3,允许进入 Step 4 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 1 输入边界 | completed_confirmed | 确认 current `00`~`06` 是权威输入,旧 `07` 隔离 |
| Step 2 实施范围 | completed_confirmed | 确认 P0 core、peripheral、future 和非范围 |
| `03-详细设计.md` §3~§4 / §16 | 已读取 | 确认 Rust、workspace、crate/package、compile dependency、禁入旧主线和 handoff |
| `04-配置设计.md` | 已存在 | 确认 profile、adapter binding、config redline、secret/redaction 和 unavailable/degraded |
| `05-测试方案.md` | 已存在 | 确认 suite、gate、artifact/report、EV-ML 和 no static evidence |
| `06-验收标准.md` | 已存在 | 确认 baseline、AC/VETO、evidence index、risk acceptance 和 final decision |
| `standards/document/实施计划书写规范.md` | 标准输入 | 确认 §3 必须包含阅读清单、阶段阅读矩阵、永久记忆种子、git 配置和工具环境 |
| `standards/document/代码实施台账与门禁规范.md` | 标准输入 | 确认 project implementation ledger、boundary ledger、gate matrix 和恢复顺序 |
| `/home/aris/Projects/quantalithos-method-library` | 已检查 | 确认目标实现仓存在、干净、git config 正确,但当前 layout 属旧实现形态 |

## 3. SOP 问题回答

1. 实施者必须先读哪些文档，分别为了理解什么。

   回答: 必须先读正式 `00`~`07`。`00` 理解 FR/BR/NFR 与边界,`01` 理解 truth owner 和依赖方向,`02` 理解八组件和代码主体,`03` 理解对象/port/protocol/flow/state/tx/error/config/observability/test cut,`04` 理解配置和依赖准备,`05` 理解测试 suite 与 evidence,`06` 理解 AC/VETO 和验收裁决,`07` 理解 phase、commit boundary、台账、门禁和提交纪律。

2. 当前项目使用什么语言和编码规范。

   回答: 目标实现仓是 Rust workspace,edition 2024。源码标识符、模块、函数、字段、注释、rustdoc、测试名和错误文本使用英文;设计文档正文使用中文。编码规范路径为 `standards/coding/rust.md`。

3. 是否必须阅读提交规范和历史提交。

   回答: 必须。实现仓提交使用英文 `type(scope): subject`,每个 §6 commit boundary 对应一笔提交。实现 agent 开工前还必须读取目标实现仓历史提交和本实施计划 Step 11 结论。

4. 项目级 git `user.name` 和 `user.email` 应如何配置。

   回答: 在 `/home/aris/Projects/quantalithos-method-library` 中执行项目级配置检查。当前检查结果为 `quantalithos-labs <quantalithos.ai@gmail.com>`,符合要求;不得用 `--global` 代替项目级配置。

5. 目标实现仓目录是否存在,当前状态如何。

   回答: `/home/aris/Projects/quantalithos-method-library` 已存在,`git status --short` 当前干净。但现有 workspace 是旧实现形态:member 为 `crates/method_library_*`,Cargo package 为 `method_library_*`,README 仍含 snapshot / outbox / PostgreSQL / old worker 口径,并缺正式 `crates/jobs`。这不能作为新版 `07` 的实现真相,必须在 PH-01 / 首个 boundary 中迁移或重建到正式 `03` §4 口径。

6. workspace member、Cargo package、Rust crate 和 binary 名是否与详细设计一致。

   回答: 正式设计要求 member 目录为 `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs`;Cargo package 为 `method-library-<role>`;Rust crate 为 `method_library_<role>`。当前实现仓不满足 member 目录和 package 命名要求,后续实现前必须按当前设计迁移,不得沿用旧 `method_library_*` member/package。

7. 本仓依赖 `/home/aris/Projects` 下哪些 sibling repo。

   回答: 编译期只允许 `quantalithos-core` / `core-contracts`。`quantalithos-bus`、`quantalithos-process`、`quantalithos-identity`、`quantalithos-sdk` 等只能通过 runtime / event / adapter / fake / controlled seam 协作,不得成为 Cargo path dependency。

8. 是否必须创建 `scripts/`、`artifacts/test/<run_id>` 和 `reports/`。

   回答: 必须。当前实现仓只有旧 `reports/method-library` 输出目录,未发现 `scripts/` 和 `artifacts/`。新版实施计划必须要求创建 `scripts/gates`、`scripts/reports`、`scripts/checks`、`artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`;不得使用 `reports/<project>` 或 `latest`。

9. 每个 phase / commit boundary 开工前必须读哪些正式章节。

   回答: 当前 Step 3 先给阶段阅读矩阵骨架。Step 5 / Step 6 定义 phase 和 commit boundary 后,必须把矩阵细化为每个 boundary 的 required reads,并写入 implementation boundary ledger。

10. 如果正式文档与 `design-calibration` 表述不一致,以哪个为准。

    回答: 正式 `00`~`07` 优先;正式文档不清楚时读取对应校准来源;仍不闭合或冲突时暂停并回报设计缺口,不得自行补 schema、port、state、mapper、config、evidence 或 boundary。

11. 永久记忆种子是否只写执行规则和规范索引。

    回答: 是。永久记忆不得复制详细设计字段 schema、DTO 表、状态矩阵、测试用例全文或临时 blocker 细节。它只保存路径、规范、恢复顺序、缺口暂停、证据路径和经验沉淀规则。

12. 代码实施台账应如何落地。

    回答: 正式 `07` 必须声明项目级台账路径 `projects/L3-method-library/design-calibration/implementation_execution_ledger.md`,以及每个 boundary 的 `projects/L3-method-library/design-calibration/implementation-boundaries/<boundary_id>.md`。缺少这些台账时,实现 agent 不得开始改代码。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| 目标实现仓 | 存在但采用旧 `crates/method_library_*` member 和 package | 与正式 `03` §4 的 `crates/<role>` / `method-library-<role>` 冲突 | 标记为 PH-01 / 首个 boundary 前置迁移项 |
| `README.md` in 实现仓 | 仍含 snapshot/outbox/PostgreSQL/old worker 方向 | 可能误导实现 agent 继承旧主线 | 标记为 old implementation material,不得作为 design truth |
| `reports/method-library` | 旧 report path | 与 `reports/runs/<run_id>` / `reports/acceptance` 冲突 | 后续实施需迁移 report root |
| `scripts/` / `artifacts/` | 当前未发现 | 无法执行新版 evidence/report 门禁 | Step 7 / Step 11 / Step 12 必须定义脚本交付 boundary |
| implementation ledger | 尚未存在 | 实现 agent 无法合法开工 | Step 6 定义 boundary 后创建正式台账口径 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 目标仓状态 | 只知道目录存在 | 明确存在、干净、git config 正确,但 layout 属旧实现 | 防止把旧实现仓误判为可直接继续 |
| 前置阅读 | 分散在 `00`~`06` 和 standards | 形成正式阅读清单和阶段阅读矩阵 | 降低实现 agent 漏读风险 |
| artifact/report | 旧仓有 `reports/method-library` | 新版固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | 对齐 `05/06` |
| 永久记忆 | 可能自由总结 | 只从 MEM-ML 种子表机械投影 | 防止形成第二真相源 |
| 实施台账 | 尚未进入 L3 `07` | 明确项目级和 boundary 级路径 | 防止实现 agent 自行发挥台账 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接沿用现有实现仓布局 | 快 | 与正式 `03` §4 冲突,会恢复旧主线 | 不采用 |
| 要求先删除 / 重建实现仓 | 能清理旧污染 | 这是实现阶段动作,不应在 Step 3 执行 | 不在本 Step 执行;写入 PH-01 前置 |
| 在 Step 3 固定阅读、git、目录、证据、台账门禁 | 可执行、可恢复 | 还不能定义具体 commit boundary | 采用 |
| 把所有 calibration 全列为必读 | 最完整 | 不可执行且会稀释当前 boundary 重点 | 不采用;按 phase/boundary 裁剪 |

## 7. 结构化中间产物

### 7.1 阅读清单

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求文档 | `projects/L3-method-library/00-需求文档.md` | 理解 FR-ML / BR-ML / NFR-ML、核心闭环和非范围 | 误扩 peripheral 或恢复旧 P0 | 能说明 FR-ML-001~009 与 FR-ML-E-001~004 边界 |
| 架构设计 | `projects/L3-method-library/01-架构设计.md` | 理解 Definition vs Use、truth owner、依赖方向和正文排除 | 引入下游 truth 或 sibling compile dependency | 能说明唯一编译期上游和运行期 seam |
| 概要设计 | `projects/L3-method-library/02-概要设计.md` | 理解八组件、代码主体和处理流轮廓 | 按旧对象或旧 publish 主线拆实施 | 能说明八组件不是八个 crate |
| 详细设计 | `projects/L3-method-library/03-详细设计.md` | 理解可落码契约、七实现单元、58/57/4/34/8 protocol 和闭口规则 | 自行补字段、port、state 或 mapper | 能定位对应 Step 校准来源 |
| 配置设计 | `projects/L3-method-library/04-配置设计.md` | 理解 profile、adapter binding、config redline、redaction 和 unavailable/degraded | 配置改变 truth 或使用真实产品前置 | 能说明 P0 profile 和 forbidden configurable boundary |
| 测试方案 | `projects/L3-method-library/05-测试方案.md` | 理解 `TC-ML-*`、suite、artifact/report、`EV-ML-*` | 最后补测或静态造证据 | 能说明 blocking suite 与 report path |
| 验收标准 | `projects/L3-method-library/06-验收标准.md` | 理解 AC/VETO、baseline、risk acceptance 和 final decision | residual 误判为 pass | 能说明 VETO-ML 与 evidence index |
| 实施计划 | `projects/L3-method-library/07-实施计划.md` | 理解 phase、commit boundary、台账、门禁和提交纪律 | 越界实现或提交粒度失控 | 能说明当前 boundary 的 required reads / allowed scope |
| Rust 编码规范 | `standards/coding/rust.md` | 统一 Rust 代码语言、注释、测试和错误风格 | 源码混入中文或不合规范 | 开工前确认已读 |
| 目录组织规范 | `standards/document/子项目目录与代码文件组织规范.md` | 统一 workspace、scripts、reports、artifacts | 目录 / 命名偏移 | 检查 `Cargo.toml` 和目录树 |
| 代码实施台账规范 | `standards/document/代码实施台账与门禁规范.md` | 执行 project ledger、boundary ledger、gate matrix | 实现 agent 跳台账或自造流程 | 缺台账则不得改代码 |
| 可落码性标准 | `standards/document/设计真相源闭环与可落码性标准.md` | 执行 boundary 闭口与经验复核 | 实现者现场补设计 | Step 6 经验复核引用 |

### 7.2 阶段实施前阅读矩阵

| 阶段 / boundary 族 | 必读正式章节 | 必读 `design-calibration` | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| PH-01 layout / baseline | `03` §3~§5;`04` §3~§9;`05` §9;`06` §3 | `03_ddd_step_04_module_layout.md`;`03_ddd_step_05_module_contracts.md`;`04_config_step_06_environment_profiles_matrix.md`;`05_test_plan_step_09_automation_gates.md` | 迁移旧实现仓布局、建立 scripts/artifacts/reports 和台账 | 能说明 `crates/<role>`、`method-library-<role>`、core-contracts 和 path roots |
| contracts / domain | `03` §5~§9;`05` contract/domain tests;`06` ML-FG / ML-RL / ML-STATE | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_10_state_machine.md`;`05_test_plan_step_06_cases.md` | 闭合 typed refs、safe markers、domain state 和 public DTO | 字段、DTO、状态、marker source 已正式闭合 |
| application flow / ports | `03` §5~§12;`05` service-flow;`06` ML-TX / ML-IDEMP / ML-READ | `03_ddd_step_07_trait_port_adapter.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_tx_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md` | 闭合 service orchestration、UoW、idempotency、duplicate replay | 不需要实现端新增 port / mapper / private index |
| infra / runtime fake | `03` §10~§13;`04` §5~§11;`05` infra-runtime-fake | `03_ddd_step_11_persistence_tx_consistency.md`;`03_ddd_step_14_config_dependencies.md`;`04_config_step_09_loading_validation_activation.md`;`04_config_step_11_failure_degradation.md` | 闭合 fake/controlled adapter、config loading、unavailable/degraded | 无 non-core sibling compile dependency,无 raw body / secret 泄露 |
| entry / worker / job | `03` §7~§14;`05` entry-worker-job / operations-replay;`06` ML-SYNC / ML-JOB / ML-CHKPT | `03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_12_errors_recovery.md`;`03_ddd_step_15_observability_audit.md` | 闭合 consumer、outbound candidate、job report、checkpoint、no truth repair | event/job surface、stored report、safe failure source 已闭合 |
| evidence / release | `05` §9 / §13 / §14;`06` §3 / §10~§14;`07` §7 / §11 / §12 | `05_test_plan_step_09_automation_gates.md`;`05_test_plan_step_13_evidence.md`;`06_acceptance_step_10_observability_evidence.md`;`06_acceptance_step_11_veto.md`;`06_acceptance_step_14_final_decision_signoff.md` | 生成 raw artifact、suite report、evidence index、redaction/dependency/report audit、acceptance handoff | fixed `<run_id>`, no latest, artifact/report pairing, no static evidence |

### 7.3 代码实施台账前置

| 台账 | 固定路径 | 创建时机 | 缺失处理 |
|---|---|---|---|
| 项目级实施台账 | `projects/L3-method-library/design-calibration/implementation_execution_ledger.md` | Step 6 定义首个 commit boundary 后,实现移交前 | 先创建,不得改实现仓代码 |
| boundary 级实施台账 | `projects/L3-method-library/design-calibration/implementation-boundaries/<boundary_id>.md` | 每个 commit boundary 开工前 | 先创建,不得改实现仓代码 |
| 实现仓本地执行台账 | `/home/aris/Projects/quantalithos-method-library/.codex/implementation_execution_ledger.md` 或等价本地记录 | 实现 agent 本地恢复辅助;设计仓台账为正式交付 | 不得替代设计仓台账 |

### 7.4 Agent 启动与永久记忆种子表

| 记忆 ID | 适用范围 | 类别 | 必须写入的记忆文本 | 规范路径来源 | 来源文档 | 来源章节 | 刷新触发 | 失效条件 | 冲突处理 | 禁止改写 |
|---|---|---|---|---|---|---|---|---|---|---|
| MEM-ML-001 | project | 目标仓 | 本项目实现仓为 `/home/aris/Projects/quantalithos-method-library`;不得在 design 仓写实现代码。 | `07` §3 | `07-实施计划.md` | §3 | 项目首次开工 / 仓路径变更 | until superseded | 暂停并回报路径偏离 | 是 |
| MEM-ML-002 | project | 布局纪律 | 正式 workspace member 使用 `crates/<role>`,Cargo package 使用 `method-library-<role>`,Rust crate 使用 `method_library_<role>`;现有旧 `crates/method_library_*` 不得作为新版布局真相。 | `03` §4 / `07` §3 | `03-详细设计.md`;`07-实施计划.md` | §4 / §3 | PH-01 / layout 变更 | until superseded | 正式 `03` 优先,暂停迁移 | 是 |
| MEM-ML-003 | project | 依赖纪律 | 唯一允许的编译期 sibling dependency 是 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`;其他 sibling repo 只能通过 runtime/event/adapter/fake seam 协作。 | `03` §3~§4 / `07` §3 | `03-详细设计.md`;`07-实施计划.md` | §3~§4 / §3 | Cargo dependency 变更 / phase 开工 | until superseded | 暂停并回报 dependency boundary violation | 是 |
| MEM-ML-004 | project | 编码规范 | Rust 源码标识符、rustdoc、普通注释、错误文本和测试名使用英文;开工前读取 `standards/coding/rust.md`。 | `07` §3 | `07-实施计划.md` | §3 | 首次开工 / 规范路径变更 | until superseded | 正式文档优先 | 是 |
| MEM-ML-005 | commit-boundary | 设计边界 | 实现时不得自行补字段、DTO、port、状态、mapper、config key、evidence schema、job report surface 或 phase boundary;无法 1:1 落码时暂停并回报设计缺口。 | 可落码性标准 / `07` §3 | `07-实施计划.md` | §3 / §6 | 每个 boundary 开工 | until superseded | 暂停并回写 design repo | 是 |
| MEM-ML-006 | project / phase | 证据路径 | 测试 raw artifact root 固定为 `artifacts/test/<run_id>`,report root 固定为 `reports/runs/<run_id>` 和 `reports/acceptance`;不得引用 `latest` 或 `reports/<project>`。 | `05` §13 / `06` §3 / `07` §3 | `05-测试方案.md`;`06-验收标准.md`;`07-实施计划.md` | §13 / §3 / §3 | gate/report script 变更 | until superseded | 修正路径并重跑门禁 | 是 |
| MEM-ML-007 | project / boundary | 台账门禁 | 改实现仓代码前必须读取设计仓 project implementation ledger 和当前 boundary ledger;缺任一台账或 current_boundary 不匹配时不得开工。 | 代码实施台账规范 / `07` §3 | `07-实施计划.md` | §3 / §6 | 每次继续 / 新 boundary / design baseline 变化 | until superseded | 暂停并要求设计仓补台账 | 是 |
| MEM-ML-008 | project / boundary | 交付实现前审计 | 在把项目交给实现 agent 或进入新的实现 baseline 前,必须按 phase / commit boundary 审计正式 `03/05/06/07`;未通过项先回写设计并固定新 baseline。 | `07` §3 / 可落码性标准 | `07-实施计划.md` | §3 / §12 | 实现移交前 / design baseline 变化 | until superseded | 暂停移交实现 | 是 |
| MEM-ML-009 | project | 经验沉淀 | 修复设计文档后,必须显式检查是否需要总结可复用经验;需要时同步补标准 / SOP / 项目记忆并添加正反例。 | `07` §3 / 可落码性标准 | `07-实施计划.md` | §3 | 每次设计修复后 | until superseded | 先判断项目归属再沉淀 | 是 |

### 7.5 Agent 永久记忆生成门禁

| 检查项 | 通过标准 | 失败处理 |
|---|---|---|
| 种子表存在 | `07` §3 给出 MEM-ML-* 种子表 | 不生成永久记忆 |
| 只写表内内容 | 永久记忆逐条来自 `必须写入的记忆文本` | 删除自由总结内容 |
| 来源完整 | 每条有来源文档、章节、刷新触发和冲突处理 | 不写入该条 |
| 不复制设计 truth | 不写 DTO 字段表、状态矩阵、业务规则正文或测试用例全文 | 改为索引正式文档 |
| 交付实现前审计 | 包含 MEM-ML-008 | 暂停并补种子表 |
| 设计修复后经验检查 | 包含 MEM-ML-009 | 暂停并补种子表 |
| 技术栈不硬编码 | 语言 / 框架 / 目录规范路径来自阅读清单 | 暂停并补阅读清单 |

### 7.6 git / 工作区检查清单

| 检查项 | 命令 | 当前结果 | 通过标准 | 失败处理 |
|---|---|---|---|---|
| 实现仓路径 | `git rev-parse --show-toplevel` | `/home/aris/Projects/quantalithos-method-library` | 匹配目标仓 | 不匹配则暂停 |
| 工作区状态 | `git status --short` | clean | 只含当前 boundary 改动 | 拆分或移除无关改动 |
| user.name | `git config user.name` | `quantalithos-labs` | `quantalithos-labs` | 项目级配置 |
| user.email | `git config user.email` | `quantalithos.ai@gmail.com` | `quantalithos.ai@gmail.com` | 项目级配置 |
| 最近提交口径 | `git log --oneline -5` | 仍含旧 infra/downstream/operations/snapshot/outbox 方向 | 只能作历史参考 | 不作为 current design truth |

### 7.7 代码仓目录与命名前置检查表

| 检查项 | 正式要求 | 当前实现仓状态 | 处理 |
|---|---|---|---|
| workspace member | `crates/contracts/domain/application/infra/api/worker/jobs` | 当前为 `crates/method_library_*`,且无 `jobs` | PH-01 / 首个 boundary 迁移 |
| Cargo package | `method-library-<role>` | 当前为 `method_library_<role>` | PH-01 / 首个 boundary 迁移 |
| Rust lib crate | `method_library_<role>` | 当前 crate 名与 Rust lib 方向接近,但 member/package 不合规 | 迁移时保留 lib crate 口径 |
| scripts root | `scripts/gates`;`scripts/reports`;`scripts/checks`;`scripts/dev` | 未发现 | 后续 boundary 创建 |
| artifact root | `artifacts/test/<run_id>` | 未发现 | 后续 boundary 创建 |
| report root | `reports/runs/<run_id>`;`reports/acceptance` | 当前有旧 `reports/method-library` | 后续迁移,旧目录不得作为正式报告路径 |
| forbidden old mainline | 不得恢复 MethodContent/publish/snapshot/outbox/PostgreSQL | 当前 README / commits 含旧口径 | 作为 historical implementation material |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阅读清单”“阶段实施前阅读矩阵”“Agent 启动与永久记忆种子表”“git / 工作区检查清单”和“代码仓目录与命名前置检查表”小节。

正式 `07-实施计划.md` §3 后续应回填:

实施者开始任何代码、配置、脚本、测试或提交前,必须先读取正式 `00`~`07`、`standards/coding/rust.md`、目录组织规范、代码实施台账规范和可落码性标准。正式文档优先;正式文档不清楚时读取对应 `design-calibration` 来源;仍不闭合时暂停回报设计缺口,不得自行补 schema、port、state、mapper、config key、evidence schema 或 phase boundary。

目标实现仓为 `/home/aris/Projects/quantalithos-method-library`。当前仓存在且 git 配置正确,但已有目录和 README 属旧实现形态,不得作为新版实施真相。正式布局必须按 `03-详细设计.md` §4 使用 `crates/<role>`、`method-library-<role>`、`method_library_<role>` 和 `contracts/domain/application/infra/api/worker/jobs` 七个实现单元。除 `quantalithos-core` / `core-contracts` 外,其他 sibling repo 不得进入 Cargo 编译期依赖。

正式实施还必须创建并遵守设计仓项目级 implementation ledger 和每个 commit boundary 的 boundary ledger。缺台账、缺 current boundary、缺 required reads、缺 allowed scope、缺 required checks 或 gate status 不匹配时,实现 agent 不得改代码。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 旧实现仓是迁移、删除重建还是保留部分可复用代码 | 影响 PH-01 / Step 5 / Step 6 | 当前只标记为前置 blocker,不在 Step 3 改实现仓 |
| `core-contracts` 当前 package / crate 名是否与正式写法一致 | 影响 Cargo dependency | Step 8 / PH-01 前置检查 |
| `scripts/*` 的最小首个 boundary 是 layout boundary 还是 evidence boundary | 影响 Step 6 | 后续按 phase / commit boundary 拆 |
| implementation ledger 首个 boundary id | 影响台账生成 | Step 6 定义后固定 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 2 范围已确认 | 通过 | 用户已确认 |
| 前置阅读清单已形成 | 通过 | 覆盖 `00`~`07`、标准、台账和目标仓 |
| 目标实现仓状态已记录 | 通过 | 存在、干净、git config 正确,但 layout 需迁移 |
| 永久记忆种子已定义 | 通过 | MEM-ML-001~009 |
| 未修改正式 `07` 或实现仓 | 通过 | 本 Step 只写设计中间产物 |
| 可进入 R3.2 / Step 4 | 通过 | 用户已确认,允许进入 Step 4 |

## 11. R3.2 用户确认记录

| 项 | 状态 |
|---|---|
| 用户确认 | 已确认 |
| 确认内容 | Step 3 前置条件、阅读清单、目标仓检查、台账前置、永久记忆种子和实现仓旧布局迁移口径 |
| 后续动作 | 进入 Step 4 `R4.1 objects and deliverables:先思考` |
