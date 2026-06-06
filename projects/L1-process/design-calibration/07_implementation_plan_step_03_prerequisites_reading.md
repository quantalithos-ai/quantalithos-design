# L1-process 07 实施计划 Step 3: 收稳前置条件与阅读清单

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` §3 实施前置条件与阅读清单
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 3 |
| 主题 | 收稳前置条件与阅读清单 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_03_prerequisites_reading.md` |

本步定义实现者开始编码前必须完成的阅读、环境、git、目录、依赖、脚本和永久记忆准备。

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-process` |
| 技术栈 | Rust 2024 workspace |
| workspace member | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` |
| 唯一编译期 sibling dependency | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` |
| 其他 sibling repo | 只能通过 port、adapter、event、snapshot、handoff、query 或 fake seam 协作 |
| git 配置 | 项目级 `user.name = quantalithos-labs`;`user.email = quantalithos.ai@gmail.com` |
| scripts 目录 | `scripts/gates/`、`scripts/reports/`、`scripts/checks/`、`scripts/dev/` |
| evidence 路径 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 冲突处理 | 正式 `00~07` 优先;不清楚读对应 calibration;仍不清楚暂停并回报设计缺口 |

## 3. 结构化中间产物

### 3.1 必读清单

| 文档 | 路径 | 阅读目的 |
|---|---|---|
| 需求文档 | `projects/L1-process/00-需求文档.md` | 理解 C-1~C-5、`FR-PROC-*`、`BR-PROC-*`、AC / VF 和非目标 |
| 架构设计 | `projects/L1-process/01-架构设计.md` | 理解职责边界、依赖方向和唯一编译期依赖 |
| 概要设计 | `projects/L1-process/02-概要设计.md` | 理解组成部分、对象轮廓、接口骨架和状态集合 |
| 详细设计 | `projects/L1-process/03-详细设计.md` | 作为字段、DTO、状态、flow、transaction、error、config 和 test cut 真相源 |
| 配置设计 | `projects/L1-process/04-配置设计.md` | 理解 profile、runtime builder、secret、path shape 和 failure mode |
| 测试方案 | `projects/L1-process/05-测试方案.md` | 理解 `TC-PROC-*`、`EV-*`、suite、fixture、gate 和 evidence |
| 验收标准 | `projects/L1-process/06-验收标准.md` | 理解 P0 / P1 / P2、AC、VF、基线、准入准出和风险接受 |
| 实施计划 | `projects/L1-process/07-实施计划.md` | 理解 phase、commit boundary、阅读矩阵、门禁和提交纪律 |
| Rust 编码规范 | `standards/coding/rust.md` | 统一 Rust 标识符、rustdoc、测试名和可读性 |
| 目录组织规范 | `standards/document/子项目目录与代码文件组织规范.md` | 统一 workspace、scripts、artifacts、reports 和目录命名 |
| 依赖裁剪规则 | `standards/document/全局项目依赖关系与裁剪规则.md` | 理解 sibling repo 依赖类型和裁剪边界 |
| 提交规范 | `standards/document/实施计划书写规范.md` §4.9 | 理解提交时机、message、footer 和自检规则 |
| 可落码性标准 | `standards/document/设计真相源闭环与可落码性标准.md` | 每个 phase / commit boundary 开工前复核设计闭环 |

### 3.2 阶段实施前阅读矩阵

| 阶段 / boundary | 必读重点 | 必读 calibration | 开工门禁 |
|---|---|---|---|
| PH-01 | `03` §3~§5、`04` §3~§9、目录组织规范 | `03_ddd_step_04_file_layout.md`;`04_config_step_06_profiles_matrix.md` | 能列出 7 个 member 的 package / crate 名和唯一 compile dependency |
| PH-02~PH-05 | Command contracts、domain objects、ports、flows、states、UoW、idempotency | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_10_state_matrix.md` | 能说明当前 command 的 DTO -> domain -> repo -> outbox -> result 闭环 |
| PH-06 | Query DTO、view、projection、trace、read model、no-write | `03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md` | 能说明 11 Query 不写 truth、audit、outbox、idempotency 或 freshness marker |
| PH-07 | inbound event envelope、dedup、reference snapshot、quarantine / delayed | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_12_error_recovery.md`;`03_ddd_step_13_concurrency_idempotency.md` | 能说明 consumer 只写 snapshot / marker / pending,不推进核心 command state |
| PH-08 | outbound event payload、outbox state、publisher retry / failure | `03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_10_state_matrix.md` | 能说明 10 outbound events 从 committed outbox / truth 构造且不含相邻仓正文 |
| PH-09 | job DTO、job reports、replay、handoff、reconciliation | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`05_test_plan_step_13_reports_evidence.md` | 能说明 job-level reject、item-level failure、partial report 和 no truth repair |
| PH-10 | scripts、reports、redaction、acceptance handoff、veto checklist | `05_test_plan_step_09_automation_gates.md`;`05_test_plan_step_13_reports_evidence.md`;`06_acceptance_step_10_observability_evidence.md`;`06_acceptance_step_11_veto.md` | 能生成 fixed run evidence,不引用 `latest` |

### 3.3 git 与目标仓前置检查

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

输出必须分别为 `quantalithos-labs` 和 `quantalithos.ai@gmail.com`。

| 检查项 | 要求 | 失败处理 |
|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-process` | 不存在则 PH-01 创建或暂停确认 |
| Cargo workspace | root `Cargo.toml` 包含 7 个 members | 命名偏离则暂停 |
| package / crate name | `process-<role>` / `process_<role>` | 命名偏离则暂停 |
| binary name | `process-api`、`process-worker`、job binary names | 命名偏离则暂停 |
| 架构层级泄漏 | 代码命名不得出现 `L0` / `L1` / `l0_` / `l1_` | 发现即修正 |
| 编译期依赖 | 只允许 `core-contracts` sibling path | 非 core sibling dependency 失败 |

### 3.4 Agent 启动与永久记忆种子

| 记忆 ID | 类别 | 必须写入的记忆文本 | 刷新触发 | 禁止改写 |
|---|---|---|---|---|
| `MEM-PROC-001` | 必读规范 | 开始任何代码、配置、脚本或测试改动前,必须读取当前 boundary 所属技术栈的编码规范、项目提交规范和目录组织规范;具体路径以 `07-实施计划.md` §3 阅读清单为准,不得自行猜测。 | 项目首次开工 / 技术栈或规范路径变更 | 是 |
| `MEM-PROC-002` | 设计边界 | 实现时以正式 `00~07` 文档为基线;正式文档不清楚时读取对应 `design-calibration`;仍不清楚时必须暂停并回报设计缺口,不得自行补字段、schema、状态、配置默认值或 phase scope。 | design baseline commit 变化 / 进入新 boundary | 是 |
| `MEM-PROC-003` | 工作区安全 | 提交前只暂存当前 boundary 相关文件,不得暂存或改写用户已有未提交改动。 | 每次提交前 | 是 |
| `MEM-PROC-004` | 提交纪律 | 实现仓提交必须使用英文 commit message,标题固定为 `type(scope): subject`,一笔提交对应一个 `07-实施计划.md` §6 commit boundary,并在提交前通过该 boundary 声明的验证门禁。 | 每次提交前 / 进入新 commit boundary | 是 |
| `MEM-PROC-005` | 依赖裁剪 | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 是唯一允许的编译期 sibling dependency;其他 sibling repo 只能通过 port、adapter、event、snapshot、handoff、query 或 fake seam 协作,不得写成 Cargo path dependency。 | 依赖变更 / Cargo.toml 变更 / design baseline 变化 | 是 |
| `MEM-PROC-006` | 验证门禁 | 每个 phase 或 commit boundary 完成前必须运行并记录该 boundary 在 `07-实施计划.md` §7 声明的 fmt、check、test、gate、report 或 acceptance 证据;未通过不得提交。 | 进入新 phase / 提交前 | 是 |
| `MEM-PROC-007` | 证据路径 | 正式测试、验收和交付证据只能引用 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`;不得正式引用 `latest`、`artifacts/test/<project>/<run_id>` 或 `reports/<project>`。 | 编写 gate / report / acceptance 证据时 | 是 |
| `MEM-PROC-008` | 永久记忆生成 | 项目永久记忆只能逐条来自 `07-实施计划.md` §3 的种子表 `必须写入的记忆文本`;不得把对话、历史提交、详细设计字段 schema、状态矩阵、DTO 表、业务规则正文或测试用例全文自由总结进永久记忆。 | 生成或刷新永久记忆时 | 是 |
| `MEM-PROC-009` | 交付实现前闭环审计 | 在把 L1-process 交给实现 agent 或切换 design baseline 前,必须按 `设计真相源闭环与可落码性标准.md` 对正式 `03/05/06/07` 做一次按 PH-01~PH-10 和 `07-实施计划.md` §6 完整 commit boundary 表的可落码闭环审计;标准存在不等于当前项目文档已符合标准,未通过时先回写 design repo 并固定新 baseline。 | 实现交付前 / design baseline 变化 / 进入新实现 baseline | 是 |

## 4. 回填草稿

```markdown
## 3. 实施前置条件与阅读清单

> 校准来源:
> - `design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“必读清单”“阶段实施前阅读矩阵”“git 与目标仓前置检查”和“Agent 启动与永久记忆种子”小节。

实现者开始任何代码、配置、脚本或测试改动前,必须先读取当前 boundary 所属正式章节、对应 `design-calibration` 中间产物、Rust 编码规范、项目提交规范、目录组织规范和依赖裁剪规则。
```

## 5. 进入下一步条件

- 阅读清单、阶段阅读矩阵、永久记忆种子和目标仓检查清单已列出。
- 实现 agent 不得自行总结永久记忆。
- 实现仓唯一编译期依赖边界已固定。
