# L1-conversation 07 实施计划 Step 3: 收稳前置条件与阅读清单

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/07-实施计划.md` §3 实施前置条件与阅读清单
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 3 |
| 主题 | 收稳前置条件与阅读清单 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/07_implementation_plan_step_03_prerequisites_reading.md` |

本步定义实施者开始编码前必须完成的阅读、git 配置、编码规范、目标仓、跨仓依赖、工具链、脚本和证据目录检查。本步不拆 phase、不拆 commit boundary、不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 已确认 | 继承 `00~06` 完整、目标实现仓不存在、唯一编译期依赖为 `core-contracts` 的结论 |
| `07_implementation_plan_step_02_scope.md` | 已确认 | 继承 Conversation truth center P0 闭环、P0-supporting 最小切口和非范围边界 |
| `projects/L1-conversation/00-需求文档.md` | 已完成 | 提取核心能力闭环、`FR-CONV-*`、`BR-CONV-*`、`NFR-CONV-*` 和非目标 |
| `projects/L1-conversation/01-架构设计.md` | 已完成 | 提取系统位置、依赖方向、数据所有权、通信方式和架构红线 |
| `projects/L1-conversation/02-概要设计.md` | 已完成 | 提取代码主体框架、主要组成部分、关键对象、接口、处理流和状态轮廓 |
| `projects/L1-conversation/03-详细设计.md` | 已完成 | 提取目标仓、workspace、crate、package、对象、trait、协议、状态、脚本和实施交接 |
| `projects/L1-conversation/04-配置设计.md` | 已完成 | 提取 JSON 配置、profile、runtime graph、reports / artifacts、redaction 和失效模式 |
| `projects/L1-conversation/05-测试方案.md` | 已完成 | 提取 suite、TC、EV、gate、script、artifact、report、redaction 和回归要求 |
| `projects/L1-conversation/06-验收标准.md` | 已完成 | 提取 AC、VETO、证据、缺陷分级、风险接受和最终裁决规则 |
| `standards/coding/rust.md` | 已确认 | 作为 Rust 源码、rustdoc、测试名、错误处理和安全规则来源 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已确认 | 作为实现仓目录、crate、scripts、artifacts 和 reports 组织规则来源 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已确认 | 作为从总依赖图裁剪 L1-conversation 依赖的依据 |
| `standards/document/实施计划书写规范.md` 与 SOP | 已确认 | 作为 §3 输出格式、阶段阅读矩阵、提交纪律和前置门禁约束来源 |

校准来源:

- `design-calibration/03_ddd_step_03_coding_runtime_constraints.md`
- `design-calibration/03_ddd_step_04_units_file_layout.md`
- `design-calibration/03_ddd_step_14_config_dependencies.md`
- `design-calibration/03_ddd_step_15_observability_audit.md`
- `design-calibration/03_ddd_step_16_test_slices.md`
- `design-calibration/03_ddd_step_17_implementation_handoff.md`
- `design-calibration/04_config_step_07_config_items.md`
- `design-calibration/04_config_step_09_load_validate_apply.md`
- `design-calibration/04_config_step_11_failure_modes.md`
- `design-calibration/05_test_plan_step_09_automation_ci_gates.md`
- `design-calibration/05_test_plan_step_13_reports_evidence.md`
- `design-calibration/06_acceptance_step_03_baseline.md`
- `design-calibration/06_acceptance_step_04_entry_exit.md`
- `design-calibration/06_acceptance_step_10_observability_evidence.md`

## 3. 当前本地状态快照

| 检查项 | 当前结果 | 本步处理 |
|---|---|---|
| 设计仓当前短 hash | `7998dd0` | 仅作为当前工作树检查点；交给实现 agent 前必须提交并给完整 design commit |
| 目标实现仓 | `/home/aris/Projects/quantalithos-conversation` 不存在 | 列为早期实施前置交付，由 Step 5 / Step 6 拆入初始化阶段 |
| `quantalithos-core` | 存在，短 hash `ef0d249` | `core-contracts` 是唯一编译期 path dependency，交接前需固定 commit |
| `quantalithos-bus` | 存在，短 hash `b8bfb82` | 只作为事件协作文档 / 接缝参考，不写 Cargo path dependency |
| `quantalithos-identity` | 存在，短 hash `a7a193e` | 只作为 actor / participant resolver 接缝参考，不写 Cargo path dependency |
| `quantalithos-sdk` | 存在，短 hash `853b34c` | 只作为下游消费边界参考，不写 Cargo path dependency |
| 其它 sibling repo | 当前未在本地列表中发现 | 不阻塞 P0；使用 fake / fixture / controlled seam，并进入风险或后续专项 |

本地状态只说明当前机器可读性，不等同于正式实现基线。交给实现 agent 前必须固定 design repo commit、core contracts commit 和实现仓起始状态。

## 4. SOP 问题回答

### 4.1 实施者必须先读哪些文档，分别为了理解什么?

实施者必须先读 L1-conversation `00~06` 正式文档，再读 Rust 编码规范、目录与代码文件组织规范、全局依赖裁剪规则和实施计划规范。由于 L1-conversation 只编译依赖 `core-contracts`，还必须阅读 L0-core 中与 shared IDs、ActorRef、TraceContext、metadata、error refs 和 contract boundary 有关的设计。`quantalithos-bus`、`quantalithos-identity`、`quantalithos-sdk` 可作为事件协作、actor resolver 和下游消费边界参考，但不得因此引入 Cargo path dependency。

### 4.2 当前项目使用什么语言和编码规范?

当前实现目标是 Rust 2024 workspace 多 crate。实现仓必须遵循 `standards/coding/rust.md`。实现仓源码标识符、模块名、类型名、函数名、变量名、测试名、普通注释、rustdoc 和 commit message 必须使用英文。设计仓文档可以中文，但该规则不得迁移到实现仓。

### 4.3 Rust 项目是否已明确 `standards/coding` 下的 Rust 编码规范?

已明确。实施前必须阅读 `standards/coding/rust.md`，尤其是源码语言约束、rustdoc、命名、格式、错误处理、安全、`rustfmt` 和 Clippy 规则。public struct、enum、enum variant、trait、function 和 module 必须有英文 rustdoc，enum variant 不能只列变体名。

### 4.4 是否必须阅读提交规范和历史提交?

必须。实施者必须阅读 `standards/document/实施计划书写规范.md` 中提交时机、提交粒度、commit message、body 分组、footer、`git commit -F` 和实现仓英文规则。目标实现仓当前不存在，因此没有本仓历史提交可参考；首批提交必须直接遵循本实施计划规则，不得继承 design 仓中文 commit 口径。

### 4.5 项目级 git `user.name` 和 `user.email` 应如何配置?

目标实现仓必须使用项目级 git config，不使用 `--global`:

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

每次提交前都要确认配置读取结果。AI 参与的实现仓提交默认保留 `Co-Authored-By: Codex <noreply@openai.com>`，footer 前必须空一行。

### 4.6 是否有必须先启动或确认的本地服务、数据库、消息系统或外部依赖?

P0 不要求启动真实 DB、MQ、search、trace store、archive store、Chat UI、Workspace、Runtime、Bridges、Governance、Artifact 或 production observability。P0 必须确认 Rust toolchain、目标实现仓路径、`core-contracts` 本地 path dependency、JSON config profile、in-memory / fake adapters、gate scripts、report scripts、check scripts、artifact root 和 report root。

### 4.7 每个实施阶段或 commit boundary 开工前，必须先读哪些正式章节?

正式阶段将在 Step 5 和 Step 6 收稳。本步先按预阶段建立阅读门禁: 仓初始化与依赖绑定、contracts / refs、space / scope、fact append、authorized query、manifestation / inbound consumer、trace / handoff、outbox / operations jobs、configuration / reports / acceptance。每个预阶段开工前必须阅读对应的 `03`、`04`、`05`、`06` 正式章节。

### 4.8 这些正式章节引用了哪些 `design-calibration` 中间产物，其中哪些会影响当前阶段实现判断?

会影响实现判断的校准产物主要集中在:

- `03_ddd_step_04_units_file_layout.md`: workspace、crate、文件布局、scripts、artifacts 和 reports。
- `03_ddd_step_05_module_contracts_axis.md`: crate 职责、模块职责和依赖方向。
- `03_ddd_step_06_object_contracts.md`: 对象、字段、enum、value object、成员函数和不变量。
- `03_ddd_step_07_trait_port_adapter_contracts.md`: port、adapter、repository、UoW、publisher、handoff 和 job runner 契约。
- `03_ddd_step_08_protocol_contracts.md`: Command、Query、Consumer、Event、Job、Receipt 和 Error DTO。
- `03_ddd_step_09_function_flows.md`: 每个接口、consumer、job 的函数级处理流。
- `03_ddd_step_10_state_matrix.md`: truth、space、fact、manifestation、projection、outbox、handoff 状态矩阵。
- `03_ddd_step_11_persistence_transaction_consistency.md`: 持久化、事务、一致性、sequence 和 cursor。
- `03_ddd_step_12_error_recovery.md`: error envelope、恢复策略、quarantine、retry 和 failed 语义。
- `03_ddd_step_13_concurrency_idempotency.md`: command / event / job 幂等、并发和 rerun。
- `03_ddd_step_14_config_dependencies.md`: config binding、dependency binding 和 fake / controlled seam。
- `03_ddd_step_15_observability_audit.md`: trace、audit、metrics、safe diagnostic、redaction 和 evidence。
- `03_ddd_step_16_test_slices.md`: P0 测试切口。
- `04_config_*`: profile、config item、sensitive ref、load / validate / apply 和 failure mode。
- `05_test_plan_*`: suite、case、gate、artifact、report 和 evidence。
- `06_acceptance_*`: AC、VETO、缺陷、风险接受和最终裁决。

### 4.9 如果正式文档和 `design-calibration` 表述不一致，实施者应该以哪个为准，何时暂停回报设计缺口?

正式 `00`~`07` 文档是实现基线。若正式文档与 `design-calibration` 冲突，以正式文档为准。若正式文档表达不清，先读取对应校准来源。读取后仍不能确定字段、DTO、状态、错误、事务、依赖、配置或验收口径时，暂停当前阶段并回报设计缺口，不得自行补字段、选状态名、改 DTO 或调整 phase scope。

### 4.10 本仓是否依赖 `/home/aris/Projects` 下已经实现的 sibling repo?

依赖。L1-conversation 的唯一编译期 sibling repo 是 `/home/aris/Projects/quantalithos-core`，当前已确认 `/home/aris/Projects/quantalithos-core/crates/contracts` 存在。`quantalithos-bus`、`quantalithos-identity` 和 `quantalithos-sdk` 当前本地存在，但只作为事件协作、resolver 和下游消费边界参考，不写 Cargo dependency。其它来源仓或下游仓不存在不阻塞 P0，必须使用 fake / fixture / controlled seam。

### 4.11 对已确认的编译期依赖，当前应使用本地 path dependency，还是已经具备 private git tag / rev 的中期条件?

当前使用本地 path dependency:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

当前不要求发布到 public crates.io，也不默认要求引用 GitHub。private git tag / rev 是中期切换方案，只有当 core 已完成版本发布策略后才进入实施。

### 4.12 目标实现仓目录是否为 `/home/aris/Projects/quantalithos-<project>`?

是。目标实现仓固定为 `/home/aris/Projects/quantalithos-conversation`。当前该目录不存在，因此建仓、workspace 初始化、项目级 git config、scripts、artifacts 和 reports 目录初始化是本轮早期实施交付。

### 4.13 workspace member 目录、Cargo package、Rust crate 和 binary 名是否与详细设计一致?

应与 `03-详细设计.md` §4.2 和 §4.3 一致:

- `crates/contracts`: package `conversation-contracts`，lib `conversation_contracts`。
- `crates/domain`: package `conversation-domain`，lib `conversation_domain`。
- `crates/application`: package `conversation-application`，lib `conversation_application`。
- `crates/infra`: package `conversation-infra`，lib `conversation_infra`。
- `crates/api`: package `conversation-api`，lib `conversation_api`，binary `conversation-api`。
- `crates/worker`: package `conversation-worker`，lib `conversation_worker`，binary `conversation-worker`。
- `crates/jobs`: package `conversation-jobs`，lib `conversation_jobs`，action binaries。

### 4.14 是否存在 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名?

详细设计中的实现仓命名未泄漏架构层级。实施时必须继续检查 package、crate、module、file、binary、feature 和 test name，禁止出现 `L0`、`L1`、`l0_`、`l1_`、`quantalithos-l1-conversation` 这类代码命名。

### 4.15 目标实现仓是否需要创建 `scripts/gates/`、`scripts/reports/`、`scripts/checks/` 和 `scripts/dev/`?

需要。`scripts/gates/`、`scripts/reports/`、`scripts/checks/` 是 P0 交付目录；`scripts/dev/` 可作为本地辅助目录。report 生成脚本必须放在 `scripts/reports/`，不能放进 `reports/` 输出目录。

### 4.16 目标实现仓是否需要创建或保留 `artifacts/test/<run_id>` 和 `reports/`?

需要。artifact root 固定为 `artifacts/test/<run_id>`，report root 固定为 `reports/`。正式验收读取 `reports/runs/<run_id>`、`reports/acceptance` 和 `artifacts/test/<run_id>`。禁止使用 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式引用 `latest`。

### 4.17 哪些 gate / report / check 脚本是本轮实施交付物?

本轮至少需要:

- `scripts/gates/run_ci_gate.sh`
- `scripts/reports/generate_reports.sh`
- `scripts/checks/check_redaction.sh`

如果后续 Step 7 / Step 11 需要拆出 release redline、report link、artifact shape 或 acceptance handoff 检查，可以在同一脚本族下增加脚本，但不得把 report 生成脚本放进 `reports/` 输出目录。

### 4.18 这些脚本是否必须支持 `--run-id`、`--artifact-root`、`--config-profile`?

gate scripts 必须支持 `--run-id`、`--artifact-root` 和 `--config-profile`。report scripts 必须支持 `--run-id`、`--artifact-root` 和 `--report-root`。check scripts 至少支持其检查对象需要的 `--artifact-root` 和 `--report-root`；如与 profile 有关，也必须支持 `--config-profile`。

### 4.19 是否明确禁止 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式引用 `latest`?

明确禁止。正式验收引用必须固定到某个 `<run_id>` 下的 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`。`latest` 只允许作为本地临时辅助，不得进入正式文档、提交说明、验收交接或 release gate 证据。

## 5. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 正式 `07-实施计划.md` 尚未创建 | §3 前置条件不存在 | 实施者可能直接写代码，漏读设计和规范 | 本步先形成可回填的 §3 草稿 |
| 目标实现仓当前不存在 | `/home/aris/Projects/quantalithos-conversation` 不存在 | 实施者不知道建仓是否属于本轮 | 明确建仓纳入早期实施阶段 |
| core contracts 可读但未固定正式基线 | `/home/aris/Projects/quantalithos-core/crates/contracts` 存在，短 hash `ef0d249` | path dependency 配错或 core commit 漂移会直接阻塞编译 | 明确本地 path dependency、交接前固定 commit |
| 运行期 / 事件协作仓部分不存在 | bus / identity / sdk 存在，其它来源或下游仓未发现 | 实施者可能把不存在仓写成依赖或阻塞 P0 | 明确 P0 使用 fake / fixture / controlled seam |
| `design-calibration` 文件很多 | 直接全量要求阅读会拖慢实施 | 实施者可能跳过关键校准来源 | 按预阶段建立阅读矩阵 |
| scripts / artifacts / reports 容易后补 | `03`、`05`、`06` 均把证据作为门禁 | 最后无法通过验收 | 把脚本和证据目录列为前置检查 |
| 实现仓语言规则容易混淆 | design 仓中文提交，实现仓英文提交 | 可能出现中文 rustdoc、测试名或 commit | 明确实现仓源码、注释、测试和 commit 默认英文 |

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 前置阅读 | 上游文档和规范散落在不同章节 | 收敛为阅读清单和确认方式 | 实施者知道先读什么、为什么读、如何证明读懂 |
| 阶段阅读 | 只有全量 `design-calibration` 目录 | 按预阶段列出必须补读的校准文件 | 避免全量阅读负担，也避免漏读关键来源 |
| 目标仓 | 只在详细设计中出现 | 明确 `/home/aris/Projects/quantalithos-conversation` 当前不存在，早期阶段创建 | 防止在 design 仓写业务代码 |
| sibling dependency | 只在详细设计中写 path | 明确只有 `core-contracts` 是编译期 path dependency | 保证编译期依赖可检查 |
| 命名规则 | 目录规范和详细设计分离 | 转成 workspace / package / crate / binary 前置检查 | 防止 L1 层级进入代码命名 |
| 脚本与证据 | 容易留到测试后期 | 前置 scripts、artifacts、reports 目录和参数规则 | 支撑 gate、报告和验收交接 |

## 7. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 要求实施者一次性阅读全部 `design-calibration` | 信息完整 | 成本过高，容易流于形式 | 不采用 |
| 只要求阅读正式 `00~06` | 简洁 | 遇到对象、协议、状态、配置和验收来源时难以追溯 | 不采用 |
| 正式文档为基线，按阶段补读校准产物 | 可执行、可追溯，不强制全量阅读 | Step 5 / Step 6 后需要把预阶段名对齐为正式阶段 | 采用 |
| 目标仓不存在时暂停所有实施计划 | 避免假设 | 会阻塞文档收敛，且建仓本身可作为实施阶段 | 不采用 |
| 目标仓不存在时把建仓列入早期交付 | 责任清楚，可继续规划 | 需要在后续阶段定义建仓门禁 | 采用 |
| 真实 DB / MQ / resolver / handoff 作为 P0 前置 | 更接近生产 | 与 P0 fake / in-memory 默认可验证路径冲突 | 不采用 |
| 使用 fake / in-memory / controlled seam 默认路径 | 可快速验证主闭环 | 生产 adapter 风险后置 | 采用 |

## 8. 结构化中间产物

### 8.1 阅读清单

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求文档 | `projects/L1-conversation/00-需求文档.md` | 理解 `FR-CONV-*`、P0 闭环、非目标和业务规则 | 做出非范围能力或漏掉 P0-supporting | 能说明本轮覆盖和不覆盖的需求编号 |
| 架构设计 | `projects/L1-conversation/01-架构设计.md` | 理解系统位置、依赖方向、数据所有权和通信方式 | 把 Chat、Workspace、Runtime 或 Bridges truth 写进本仓 | 能画出 Conversation 与相邻仓的边界 |
| 概要设计 | `projects/L1-conversation/02-概要设计.md` | 理解主要组成部分、关键对象、接口、流程和状态机轮廓 | 实施顺序退化为对象清单 | 能说明主要功能纵切如何经过各 crate |
| 详细设计 | `projects/L1-conversation/03-详细设计.md` | 按 Rust workspace、对象、trait、API、状态、事务、错误、幂等和脚本契约实现 | 字段、函数、状态、错误和事务边界漂移 | 能定位每个实现对象和接口来自哪一节 |
| 配置设计 | `projects/L1-conversation/04-配置设计.md` | 理解 JSON profile、runtime graph、report path、security redaction 和 failure modes | 配置项揉错模块或 runtime fail open | 能列出 P0 配置组、profile 和禁止配置 |
| 测试方案 | `projects/L1-conversation/05-测试方案.md` | 理解 suite、TC、EV、artifact、report、gate 和回归要求 | 阶段完成但没有自动化和证据 | 能把阶段任务映射到测试 suite |
| 验收标准 | `projects/L1-conversation/06-验收标准.md` | 理解 AC、VETO、缺陷分级、风险接受和最终裁决 | 触发一票否决仍继续实施 | 能说明每阶段对应验收门禁 |
| L0-core 设计与实现 | `projects/L0-core/00~07`;`/home/aris/Projects/quantalithos-core` | 理解 `core-contracts`、shared IDs、ActorRef、TraceContext、metadata 和 error refs | 复制或偏离核心契约 | 能说明 Conversation 只依赖 core shared contracts |
| L0-bus 设计与实现 | `projects/L0-bus/00~07`;`/home/aris/Projects/quantalithos-bus` | 理解事件协作、outbox、retry 和 evidence 口径 | 把 bus runtime truth 写进 Conversation | 能说明 bus 只是 event collaboration seam |
| L1-identity 设计与实现 | `projects/L1-identity/00~07` 如存在；`/home/aris/Projects/quantalithos-identity` | 理解 actor、participant、AI member 和 resolver 引用来源 | 本仓创建或改变成员生命周期 | 能说明 identity 只通过 ref / resolver 进入 |
| L0-sdk 设计与实现 | `projects/L0-sdk/00~07`;`/home/aris/Projects/quantalithos-sdk` | 理解下游 SDK 消费边界 | 误把 downstream client experience 当 P0 | 能说明本仓只暴露 query / event / projection surface |
| Rust 编码规范 | `standards/coding/rust.md` | 理解 Rust 命名、格式、rustdoc、源码英文和安全规则 | 中文 rustdoc / 测试名 / 注释进入实现仓 | 提交前通过 review / fmt / clippy 检查 |
| 目录组织规范 | `standards/document/子项目目录与代码文件组织规范.md` | 理解实现仓、crate、scripts、artifacts、reports 的组织方式 | 目录名、package、crate 或证据路径不合格 | 能对照规范检查仓库结构 |
| 全局依赖规则 | `standards/document/全局项目依赖关系与裁剪规则.md` | 从总依赖图中裁剪 L1-conversation 自己的依赖 | 把运行期或事件协作依赖写成 Cargo path dependency | 能说明编译期、运行期、事件协作依赖差异 |
| 实施计划规范 | `standards/document/实施计划书写规范.md` | 理解代码批次、提交边界、提交时机和 commit 规范 | 阶段、批次、commit 混写 | 能说明一笔提交对应哪个 §6 boundary |

### 8.2 阶段实施前阅读矩阵

正式 `00`~`07` 文档是实现基线；`design-calibration` 是决策背景和细节追溯。正式阶段名称将在 Step 5 / Step 6 最终确定，本表先按预阶段组织开工前阅读门禁。

| 预阶段 / commit boundary | 必读正式章节 | 必读 `design-calibration` | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| PRE-PH-00 仓初始化与依赖绑定 | `03` §3~§4;`04` §7~§9;`05` §9 / §13 | `03_ddd_step_04_units_file_layout.md`;`03_ddd_step_14_config_dependencies.md`;`05_test_plan_step_13_reports_evidence.md` | 确认 workspace、crate、scripts、reports、artifacts 和 `core-contracts` path | 能说明目录、package、crate、binary、script 和 path dependency |
| PRE-PH-01 contracts / refs / DTO | `03` §6~§8;`06` §7 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md` | 确认 refs、Command、Query、Consumer、Event、Job、Receipt、Error 字段 | 能说明每个 DTO 字段来源和缺失字段处理 |
| PRE-PH-02 space / scope truth | `03` §6 / §9~§13;`06` §5 / §8 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_10_state_matrix.md` | 确认 space、participant scope、visibility scope、状态和事务 | 能说明合法 / 非法迁移和 visibility guard |
| PRE-PH-03 fact append / transaction / idempotency | `03` §6 / §9 / §11~§13;`05` §6 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md` | 确认 append-only、receipt、trace、outbox、duplicate / conflict | 能说明 UnitOfWork 边界和幂等结果 |
| PRE-PH-04 authorized query / projection / search / cursor | `03` §6~§11;`06` §5 / §8 | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_10_state_matrix.md` | 确认 query no-write、read model、refs-only search、cursor monotonic | 能说明 query 不写 truth，projection 不自动修复 |
| PRE-PH-05 manifestation / inbound consumer | `03` §6~§13;`06` §6~§7 | `03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_12_error_recovery.md` | 确认 external fact ref、safe snapshot、unresolved / mismatch、quarantine | 能说明 source truth isolation 和 forbidden body guard |
| PRE-PH-06 trace / review / handoff | `03` §6 / §9 / §12 / §15;`06` §5 / §10 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_15_observability_audit.md` | 确认 review anchor、trace handoff、archive handoff、safe diagnostic | 能说明 handoff failure 不回滚 fact / trace truth |
| PRE-PH-07 outbox / worker / operations jobs | `03` §7~§15;`05` §9~§10;`06` §7~§9 | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_16_test_slices.md` | 确认 consumer、outbox relay、projection rebuild、cursor、consistency jobs | 能说明 rerun、partial failure、report ref 和 no-auto-repair |
| PRE-PH-08 config / tests / reports / acceptance | `04`;`05`;`06` | `04_config_step_09_load_validate_apply.md`;`04_config_step_11_failure_modes.md`;`05_test_plan_step_09_automation_ci_gates.md`;`06_acceptance_step_11_veto_items.md` | 确认 profile、path shape、redaction、gate、evidence、VETO | 能说明 fixed run id、artifact/report path 和 release redline |

### 8.3 git 配置检查清单

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| `user.name` | `quantalithos-labs` | `git config user.name` | 设置项目级 config 后再提交 |
| `user.email` | `quantalithos.ai@gmail.com` | `git config user.email` | 设置项目级 config 后再提交 |
| commit language | 实现仓 subject / body 必须英文 | 对照 commit message 文件 | 不提交，重写 message |
| commit title | `type(scope): subject`，scope 必填 | review message 第一行 | 不提交，重写 message |
| AI footer | `Co-Authored-By: Codex <noreply@openai.com>` | 检查 footer 和空行 | 不提交，修正 message |

### 8.4 编码规范确认清单

| 检查项 | 要求 | 确认方式 |
|---|---|---|
| 源码语言 | 标识符、注释、rustdoc、测试名默认英文 | review / grep |
| enum variant | 每个 variant 有英文 rustdoc | review public enum |
| 错误处理 | 不用裸字符串错误，按 protocol / domain / application / repository / job 分层 | error type review |
| 格式 | 使用 `cargo fmt` | gate / local command |
| 测试名 | 英文，并能回指 `TC-CONV-*` 或测试切口 | test review |

### 8.5 代码仓目录与命名前置检查表

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-conversation` | 检查目录名 | 暂停并回报目录偏离 |
| workspace member | `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs` | 检查 `Cargo.toml` 和 `crates/` | 暂停并修正目录 |
| Cargo package | `conversation-<role>` | 检查 `[package].name` | 暂停并修正 package |
| Rust library crate | `conversation_<role>` | 检查 `[lib].name` | 暂停并修正 crate |
| binary 名 | `conversation-api`、`conversation-worker` 和具体 job action | 检查 `[[bin]].name` | 暂停并修正 binary |
| 架构层级泄漏 | 代码命名不出现 `L0` / `L1` / `l0_` / `l1_` | 搜索 package / crate / module / file / test | 暂停并回报偏离 |

### 8.6 本地多仓依赖前置检查表

| 依赖仓库 | 依赖类型 | 本地路径 | 当前状态 | 协作方式 | 不存在时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core` | 存在，短 hash `ef0d249` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 暂停，不复制 core 类型 |
| `quantalithos-bus` | 事件协作 | `/home/aris/Projects/quantalithos-bus` | 存在，短 hash `b8bfb82` | outbox / event collaboration seam，不写 Cargo dependency | 使用 fake publisher / fixture |
| `quantalithos-identity` | 运行期 resolver / event | `/home/aris/Projects/quantalithos-identity` | 存在，短 hash `a7a193e` | actor / participant resolver seam，不写 Cargo dependency | 使用 fake resolver / unresolved marker |
| `quantalithos-work` | 来源事实引用 | `/home/aris/Projects/quantalithos-work` | 未发现 | external fact resolver seam，不写 Cargo dependency | 使用 safe ref / unresolved marker |
| `quantalithos-governance` | 来源事实引用 | `/home/aris/Projects/quantalithos-governance` | 未发现 | governance manifestation seam，不写 Cargo dependency | 使用 safe ref / unresolved marker |
| `quantalithos-artifact` | 来源事实引用 | `/home/aris/Projects/quantalithos-artifact` | 未发现 | artifact ref / safe snapshot seam，不写 Cargo dependency | 使用 safe ref / unresolved marker |
| `quantalithos-runtime` | 事件协作 | `/home/aris/Projects/quantalithos-runtime` | 未发现 | result fact consumer seam，不写 Cargo dependency | 使用 fake runtime result |
| `quantalithos-bridges` | 事件协作 | `/home/aris/Projects/quantalithos-bridges` | 未发现 | mapped fact consumer seam，不写 Cargo dependency | 使用 fake bridge mapped fact |
| `quantalithos-observability` | handoff | `/home/aris/Projects/quantalithos-observability` | 未发现 | trace handoff port，不写 Cargo dependency | 使用 fake handoff with retry / failed |
| `quantalithos-archive` | handoff | `/home/aris/Projects/quantalithos-archive` | 未发现 | archive handoff port，不写 Cargo dependency | 使用 fake handoff with retry / failed |
| `quantalithos-sdk` | 下游消费 | `/home/aris/Projects/quantalithos-sdk` | 存在，短 hash `853b34c` | query / event / projection surface consumer，不写 Cargo dependency | 不阻塞 P0 |
| `quantalithos-chat` | 下游消费 | `/home/aris/Projects/quantalithos-chat` | 未发现 | UI consumer，不写 Cargo dependency | 不阻塞 P0 |
| `quantalithos-workspace` | 下游消费 | `/home/aris/Projects/quantalithos-workspace` | 未发现 | workspace projection consumer，不写 Cargo dependency | 不阻塞 P0 |

### 8.7 测试脚本与报告工具前置检查表

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| gate script | `scripts/gates/run_ci_gate.sh` | 检查脚本存在、可执行、支持参数 | 创建或记录为本轮交付物 |
| report script | `scripts/reports/generate_reports.sh` | 检查脚本存在、可执行、读取 artifact root | 创建或记录为本轮交付物 |
| redaction check | `scripts/checks/check_redaction.sh` | 检查脚本存在、可执行、失败语义 | 创建或记录为本轮交付物 |
| artifact root | `artifacts/test/<run_id>` | 检查配置和脚本默认值 | 修正路径口径 |
| report root | `reports/`，运行报告为 `reports/runs/<run_id>` | 检查生成脚本输出 | 修正路径口径 |
| acceptance report | `reports/acceptance` | 检查 handoff / veto / risk / open issues | 创建或记录为本轮交付物 |
| formal run ref | 固定 `<run_id>`，不使用 `latest` | 检查测试 / 验收文档和报告链接 | 暂停并修正文档或脚本 |

## 9. 回填草稿

以下内容供 Step 13 组装正式 `07-实施计划.md` §3 时摘录，当前不直接写入正式文档。

````markdown
## 3. 实施前置条件与阅读清单

> 校准来源：
> - `design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“阅读清单”“阶段实施前阅读矩阵”“代码仓目录与命名前置检查表”“本地多仓依赖前置检查表”和“测试脚本与报告工具前置检查表”小节，了解实现 agent 开工前必须读哪些文档、检查哪些本地依赖和为什么不得把运行期接缝写成 Cargo path dependency。

实施者开工前必须完成 `00~06` 正式文档、Rust 编码规范、目录组织规范、全局依赖裁剪规则和实施计划规范阅读。目标实现仓固定为 `/home/aris/Projects/quantalithos-conversation`，当前目标仓尚不存在，早期实施阶段必须创建 workspace、crate、scripts、artifacts 和 reports 结构。

唯一编译期 path dependency 是:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

`quantalithos-bus`、`quantalithos-identity`、`quantalithos-work`、`quantalithos-governance`、`quantalithos-artifact`、`quantalithos-runtime`、`quantalithos-bridges`、`quantalithos-observability`、`quantalithos-archive`、`quantalithos-sdk`、`quantalithos-chat` 和 `quantalithos-workspace` 均不得写成 Cargo path dependency。P0 使用 fake / fixture / controlled seam 验证本仓 truth center 闭环。

目标实现仓必须使用项目级 git config:

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
```

实现仓源码、rustdoc、测试名和 commit message 必须使用英文。commit 标题固定为 `type(scope): subject`，每笔提交对应 §6 中一个 commit boundary，AI footer 默认保留 `Co-Authored-By: Codex <noreply@openai.com>`。

每个 phase / commit boundary 开工前，实施者必须按阅读矩阵补读对应正式章节和 `design-calibration` 来源。正式文档与中间产物冲突时以正式文档为准；正式文档不清楚且校准来源也无法闭合时，暂停并回报设计缺口。
````

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 阅读清单已列出 | 已满足 |
| 阶段实施前阅读矩阵已列出 | 已满足 |
| git 配置、编码规范和 commit 语言规则已列出 | 已满足 |
| 目标仓目录、workspace、package、crate、binary 命名检查已列出 | 已满足 |
| 本地多仓依赖和 path dependency 规则已列出 | 已满足 |
| scripts、artifacts、reports 前置检查已列出 | 已满足 |
| 无法满足的前置项已进入风险或后续阶段 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

Step 3 可以进入 Step 4。Step 4 应抽取实施对象与交付物，尤其要把 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`、config、scripts、reports、artifacts 和 acceptance handoff 转成可交付清单。
