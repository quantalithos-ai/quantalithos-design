# L0-bus 07 实施计划 Step 3: 前置条件与阅读清单

> 本文件是 `projects/L0-bus/07-实施计划.md` 的 Step 3 中间产物。
> 本步收稳实施者开始编码前必须完成的阅读、git 配置、编码规范、仓库目录、跨仓依赖、脚本和证据目录检查。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 3 |
| 主题 | 收稳前置条件与阅读清单 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §3 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 已确认 | 继承 `00~06` 已完成、`07` 尚未创建、目标实现仓当前未发现、`core-contracts` 已存在的结论 |
| `07_implementation_plan_step_02_scope.md` | 已确认 | 继承“默认可验证事件传递主闭环”、F-001~F-008、P0 / P0-min 和非范围结论 |
| `projects/L0-bus/00-需求文档.md` | 已完成 | 提取业务目标、功能需求、非目标和验收方向 |
| `projects/L0-bus/01-架构设计.md` | 已完成 | 提取系统位置、依赖方向、通信方式和架构红线 |
| `projects/L0-bus/02-概要设计.md` | 已完成 | 提取主要组成部分、关键对象、接口、流程和状态机轮廓 |
| `projects/L0-bus/03-详细设计.md` | 已完成 | 提取目标仓、workspace、crate、path dependency、脚本和实现前置检查 |
| `projects/L0-bus/04-配置设计.md` | 已完成 | 提取 JSON 配置、profile、backend binding、fail-fast / fail-closed 和证据配置 |
| `projects/L0-bus/05-测试方案.md` | 已完成 | 提取 gate、artifact、report、测试 suite 和证据要求 |
| `projects/L0-bus/06-验收标准.md` | 已完成 | 提取 AC、VETO、缺陷分级、风险接受和最终送验门禁 |
| `standards/coding/rust.md` | 已完成 | 作为实现仓 Rust 编码、rustdoc、源码英文和注释规则来源 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已完成 | 作为实现仓目录、crate、scripts、artifacts 和 reports 组织规则来源 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已完成 | 作为 L0-bus 本仓依赖裁剪和跨仓依赖类型判断来源 |
| `standards/document/实施计划书写规范.md` 与 SOP | 已完成 | 作为 §3 输出格式、阶段阅读矩阵和前置门禁约束来源 |

---

## 3. SOP 问题回答

### 3.1 实施者必须先读哪些文档,分别为了理解什么?

实施者必须先读 L0-bus `00~06` 正式文档,再读 Rust 编码规范、目录与代码文件组织规范、全局依赖裁剪规则、实施计划规范和目标实现仓历史提交。L0-bus 依赖已稳定的 L0-core,因此还必须读 L0-core `00~07` 中与 `core-contracts`、trace、event envelope、metadata、error、outbox fact 相关的章节。

### 3.2 当前项目使用什么语言和编码规范?

当前实现目标是 Rust workspace 多 crate。实现仓必须遵循 `standards/coding/rust.md`。该规范用中文说明,但实现仓源码标识符、模块名、类型名、函数名、变量名、测试名、普通注释和 rustdoc 默认必须使用英文。

### 3.3 Rust 项目是否已明确 `standards/coding` 下的 Rust 编码规范?

已明确。实施前必须阅读 `standards/coding/rust.md`,尤其是源码语言约束、rustdoc 文档注释、命名、格式、错误处理、安全、`rustfmt` 和 Clippy 相关规则。public struct、enum、enum variant、trait、function 和 module 必须有英文 rustdoc。

### 3.4 是否必须阅读提交规范和历史提交?

必须。实施者必须阅读 `standards/document/实施计划书写规范.md` 中提交时机、提交粒度、commit message、body 分组、footer 和实现仓英文规则,并查看目标实现仓近期合格提交。如果目标实现仓尚不存在,应参考已完成实现仓的近期合格提交,但不得照搬 design 仓中文提交规则。

### 3.5 项目级 git `user.name` 和 `user.email` 应如何配置?

目标实现仓必须使用项目级 git config,不使用 `--global`。推荐配置为 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`,并在每次提交前确认读取结果。

### 3.6 是否有必须先启动或确认的本地服务、数据库、消息系统或外部依赖?

P0 不要求启动真实 Kafka、NATS、Redis、RabbitMQ、生产级数据库、KMS、配置中心、gateway、SDK 或 observability dashboard。P0 必须确认 Rust toolchain、目标实现仓路径、L0-core `core-contracts` 本地 path dependency、in-memory / fake backend、fake outbox source、fake subscriber endpoint、JSON config profile、artifact / report 输出目录和 gate scripts。

### 3.7 每个实施阶段或 commit boundary 开工前,必须先读哪些正式章节?

正式阶段将在 Step 5 和 Step 6 收稳。Step 3 先按“预阶段”建立阅读门禁:仓初始化、contracts/domain 基础、publication + semantic、delivery + feedback、recovery + replay、read output + audit、config/runtime、API/worker/jobs、test/report/acceptance。每个预阶段开工前必须阅读对应的 `03`、`04`、`05`、`06` 章节。

### 3.8 这些正式章节引用了哪些 `design-calibration` 中间产物,其中哪些会影响当前阶段实现判断?

会影响实现判断的校准产物主要集中在:

- `03_ddd_step_04_units_file_layout.md`: workspace、crate、文件布局。
- `03_ddd_step_05_module_contracts_axis.md`: crate 职责与依赖方向。
- `03_ddd_step_06_object_contracts.md`: 对象、枚举、值对象和 rustdoc 契约。
- `03_ddd_step_07_trait_port_adapter_contracts.md`: port、adapter、repository、UoW 契约。
- `03_ddd_step_08_protocol_contracts.md`: Command、Query、Event、Job 协议。
- `03_ddd_step_09_function_flows.md`: 逐接口函数级处理流。
- `03_ddd_step_10_state_matrix.md`: 状态机和禁止转换。
- `03_ddd_step_11_persistence_transaction_consistency.md`: 持久化、事务、一致性。
- `03_ddd_step_12_error_recovery.md`: 错误模型和恢复口径。
- `03_ddd_step_13_concurrency_idempotency.md`: 并发、幂等、重入保护。
- `03_ddd_step_14_config_dependencies.md`: 配置绑定和外部依赖。
- `03_ddd_step_15_observability_audit.md`: trace、audit、metrics、redaction。
- `03_ddd_step_16_test_slices.md`: 测试切口和最小验证清单。
- `04_config_*`: config profile、config item、load / validate / apply、failure mode。
- `05_test_plan_*`: suite、gate、artifact、report、evidence。
- `06_acceptance_*`: AC、VETO、缺陷、风险接受、最终裁决。

### 3.9 如果正式文档和 `design-calibration` 表述不一致,实施者应该以哪个为准,何时暂停回报设计缺口?

正式 `00`~`07` 文档是实现基线。若正式文档与 `design-calibration` 冲突,以正式文档为准。若正式文档表达不清,先读取对应校准来源。读取后仍不能确定字段、状态、错误、事务、依赖或验收口径时,暂停当前阶段并回报设计缺口。

### 3.10 本仓是否依赖 `/home/aris/Projects` 下已经实现的 sibling repo?

依赖。L0-bus 的编译期 sibling repo 是 `/home/aris/Projects/quantalithos-core`,当前已确认 `/home/aris/Projects/quantalithos-core/crates/contracts` 存在。L0-bus 的目标实现仓 `/home/aris/Projects/quantalithos-bus` 当前未发现存在,应由实施计划初始阶段创建。

### 3.11 对已确认的编译期依赖,当前应使用本地 path dependency,还是已经具备 private git tag / rev 的中期条件?

当前使用本地 path dependency:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

当前不要求发布到 public crates.io,也不默认要求引用 GitHub。private git tag / rev 是中期切换方案,只有当 core 已完成版本发布策略后才进入实施。

### 3.12 目标实现仓目录是否为 `/home/aris/Projects/quantalithos-<project>`?

是。目标实现仓固定为 `/home/aris/Projects/quantalithos-bus`。当前该目录未发现存在,因此建仓、workspace 初始化和项目级 git config 是本轮早期实施前置交付。

### 3.13 workspace member 目录、Cargo package、Rust crate 和 binary 名是否与详细设计一致?

应与 `03-详细设计.md` §4.2 和 §4.3 一致:

- `crates/contracts`: package `bus-contracts`, lib `bus_contracts`。
- `crates/domain`: package `bus-domain`, lib `bus_domain`。
- `crates/application`: package `bus-application`, lib `bus_application`。
- `crates/infra`: package `bus-infra`, lib `bus_infra`。
- `crates/api`: package `bus-api`, lib `bus_api`, binary `bus-api`。
- `crates/worker`: package `bus-worker`, lib `bus_worker`, binary `bus-worker`。
- `crates/jobs`: package `bus-jobs`, binary `bus-jobs`。

### 3.14 是否存在 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名?

详细设计中的实现仓命名未泄漏架构层级。实施时必须继续检查 package、crate、module、file、binary、feature 和 test name,禁止出现 `L0`、`L1`、`l0_`、`l1_`、`quantalithos-l0-bus` 这类代码命名。

### 3.15 目标实现仓是否需要创建 `scripts/gates/`、`scripts/reports/`、`scripts/checks/` 和 `scripts/dev/`?

需要。`scripts/gates/`、`scripts/reports/`、`scripts/checks/` 是 P0 交付目录;`scripts/dev/` 可作为本地辅助目录。report 生成脚本必须放在 `scripts/reports/`,不能放进 `reports/` 输出目录。

### 3.16 目标实现仓是否需要创建或保留 `artifacts/test/<run_id>` 和 `reports/`?

需要。artifact root 固定为 `artifacts/test/<run_id>`,report root 固定为 `reports/`。禁止使用 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式引用 `latest`。

### 3.17 哪些 gate / report / check 脚本是本轮实施交付物?

本轮至少需要:

- `scripts/gates/run_ci_gate.sh`
- `scripts/gates/run_release_gate.sh`
- `scripts/reports/generate_reports.sh`
- `scripts/reports/generate_acceptance_handoff.sh`
- `scripts/checks/check_artifacts.sh`
- `scripts/checks/check_redaction.sh`
- `scripts/checks/check_report_links.sh`

如果某个脚本在阶段内暂时只实现最小检查,也必须输出稳定 exit code 和固定 `<run_id>` 证据。

### 3.18 这些脚本是否必须支持 `--run-id`、`--artifact-root`、`--config-profile`?

gate scripts 必须支持 `--run-id`、`--artifact-root`、`--config-profile`。report scripts 必须支持 `--run-id`、`--artifact-root`、`--report-root`。check scripts 至少支持其检查对象需要的 `--artifact-root` 和 `--report-root`;如与 profile 有关,也必须支持 `--config-profile`。

### 3.19 是否明确禁止 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式引用 `latest`?

明确禁止。正式验收引用必须固定到某个 `<run_id>` 下的 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`。`latest` 只允许作为本地临时辅助,不得进入正式文档、提交说明、验收交接或 release gate 证据。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 正式 `07-实施计划.md` 尚未创建 | §3 前置条件不存在 | 实施者可能直接写代码,漏读设计和规范 | 本步先形成可回填的 §3 草稿 |
| 目标实现仓当前未发现 | `/home/aris/Projects/quantalithos-bus` 不存在 | 实施者不知道建仓是否属于本轮 | 明确建仓纳入早期实施阶段 |
| L0-core 依赖已存在但未前置化 | `/home/aris/Projects/quantalithos-core/crates/contracts` 存在 | path dependency 配错会直接阻塞编译 | 明确本地 path dependency 和检查方式 |
| `design-calibration` 文件很多 | 直接全量要求阅读会拖慢实施 | 实施者可能跳过关键校准来源 | 按预阶段建立阅读矩阵 |
| scripts / artifacts / reports 容易后补 | `03`、`05`、`06` 均把证据作为门禁 | 最后无法通过验收 | 把脚本和证据目录列为前置检查 |
| 实现仓语言规则容易混淆 | design 仓中文提交,实现仓英文提交 | 可能出现中文 rustdoc、测试名或 commit | 明确实现仓源码、注释、测试和 commit 默认英文 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 前置阅读 | 上游文档和规范散落在不同章节 | 收敛为阅读清单和确认方式 | 实施者知道先读什么、为什么读、如何证明读懂 |
| 阶段阅读 | 只有全量 `design-calibration` 目录 | 按预阶段列出必须补读的校准文件 | 避免全量阅读负担,也避免漏读关键来源 |
| 目标仓 | 只在详细设计中出现 | 明确 `/home/aris/Projects/quantalithos-bus` 当前未发现,早期阶段创建 | 防止在 design 仓写业务代码 |
| sibling dependency | 只在详细设计中写 path | 明确 `core-contracts` 当前本地存在,用 path dependency | 保证编译期依赖可检查 |
| 命名规则 | 目录规范和详细设计分离 | 转成 workspace / package / crate / binary 前置检查 | 防止 L0 层级进入代码命名 |
| 脚本与证据 | 容易留到测试后期 | 前置 scripts、artifacts、reports 目录和参数规则 | 支撑 gate、报告和验收交接 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 要求实施者一次性阅读全部 `design-calibration` | 信息完整 | 成本过高,容易流于形式 | 不采用 |
| 只要求阅读正式 `00~06` | 简洁 | 遇到对象、协议、状态和验收来源时难以追溯 | 不采用 |
| 正式文档为基线,按阶段补读校准产物 | 可执行、可追溯、不会强制全量阅读 | Step 5 / Step 6 后需要把预阶段名对齐为正式阶段 | 采用 |
| 目标仓不存在时暂停所有实施计划 | 避免假设 | 会阻塞文档收敛,且建仓本身可作为实施阶段 | 不采用 |
| 目标仓不存在时把建仓列入早期交付 | 责任清楚,可继续规划 | 需要在后续阶段定义建仓门禁 | 采用 |
| 真实 MQ / DB 作为 P0 前置 | 更接近生产 | 与 P0 fake / in-memory 默认可验证路径冲突 | 不采用 |
| 使用 fake / in-memory 默认路径 | 可快速验证主闭环 | 生产 adapter 风险后置 | 采用 |

---

## 7. 结构化中间产物

### 7.1 阅读清单

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求文档 | `projects/L0-bus/00-需求文档.md` | 理解 F-001~F-008、P0 / P0-min、非目标和业务规则 | 做出非范围能力或漏掉 P0-min | 能说明本轮覆盖和不覆盖的需求编号 |
| 架构设计 | `projects/L0-bus/01-架构设计.md` | 理解 L0-bus 在系统中的位置、依赖方向和通信方式 | 把 auth、SDK、governance decision truth 或 observability dashboard 写进 bus | 能画出 L0-bus 与 L0-core、publisher、subscriber、observability 的边界 |
| 概要设计 | `projects/L0-bus/02-概要设计.md` | 理解主要组成部分、模块、关键对象、接口、流程和状态机轮廓 | 实施顺序退化为对象清单 | 能说明主要功能纵切如何经过各 crate |
| 详细设计 | `projects/L0-bus/03-详细设计.md` | 按 Rust workspace、对象、trait、API、状态、事务、错误、幂等和脚本契约实现 | 字段、函数、状态、错误和事务边界漂移 | 能定位每个实现对象和接口来自哪一节 |
| 配置设计 | `projects/L0-bus/04-配置设计.md` | 理解 JSON profile、backend binding、runtime graph、secret ref 和 fail-fast / fail-closed | 配置项揉错模块或 runtime fail open | 能列出 P0 配置项和 profile |
| 测试方案 | `projects/L0-bus/05-测试方案.md` | 理解 suite、TC、EV、artifact、report 和回归要求 | 阶段完成但没有自动化和证据 | 能把阶段任务映射到测试 suite |
| 验收标准 | `projects/L0-bus/06-验收标准.md` | 理解 AC、VETO、缺陷分级、风险接受和最终裁决 | 触发一票否决仍继续实施 | 能说明每阶段对应验收门禁 |
| L0-core 设计文档 | `projects/L0-core/00~07` | 理解 `core-contracts`、trace、metadata、event envelope、outbox fact 和共享错误来源 | 复制或偏离核心契约 | 能说明 bus 只依赖 core shared contracts |
| Rust 编码规范 | `standards/coding/rust.md` | 理解 Rust 命名、格式、rustdoc、源码英文和安全规则 | 中文 rustdoc / 测试名 / 注释进入实现仓 | 提交前通过 review / fmt / clippy 检查 |
| 目录组织规范 | `standards/document/子项目目录与代码文件组织规范.md` | 理解实现仓、crate、scripts、artifacts、reports 的组织方式 | 目录名、package、crate 或证据路径不合格 | 能对照规范检查仓库结构 |
| 全局依赖规则 | `standards/document/全局项目依赖关系与裁剪规则.md` | 从总依赖图中裁剪 L0-bus 自己的依赖 | 把运行期或事件协作依赖写成 Cargo path dependency | 能说明编译期、运行期、事件协作依赖差异 |
| 实施计划规范 | `standards/document/实施计划书写规范.md` | 理解代码批次、提交边界、提交时机和 commit 规范 | 阶段、批次、commit 混写 | 能说明一笔提交对应哪个 §6 boundary |
| 目标实现仓历史提交 | `/home/aris/Projects/quantalithos-bus` 的 `git log` | 对齐目标仓 commit 风格和提交粒度 | commit message 格式和粒度不合格 | 若仓不存在,建仓后以本文规则创建首批提交 |

### 7.2 阶段实施前阅读矩阵

正式 `00`~`07` 文档是实现基线;`design-calibration` 是决策背景和细节追溯。下表使用预阶段名,Step 5 / Step 6 可以把预阶段替换为正式 PH 和 commit boundary,但不得降低阅读门禁。

| 预阶段 | 必读正式章节 | 必读 `design-calibration` | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| 仓初始化与 workspace 骨架 | `03` §3 / §4 / §16；`05` §13；`06` §10 | `03_ddd_step_03_coding_runtime_constraints.md`；`03_ddd_step_04_units_file_layout.md`；`05_test_plan_step_13_reports_evidence.md`；`06_acceptance_step_10_evidence_audit.md` | 确认目标仓、crate、scripts、artifacts、reports 和 evidence 目录 | 能说明每个 crate 的 package / lib / binary 名和证据根目录 |
| contracts / domain 基础 | `03` §5 / §6 / §7 / §9 | `03_ddd_step_05_module_contracts_axis.md`；`03_ddd_step_06_object_contracts.md`；`03_ddd_step_08_protocol_contracts.md`；`03_ddd_step_10_state_matrix.md` | 确认 DTO、领域对象、状态 enum、禁止正文规则和状态转换 | 能说明哪些类型在 contracts,哪些不变量在 domain |
| publication acceptance + semantic | `00` §9；`03` §7 / §8 / §10 / §11；`06` §5 / §6 | `03_ddd_step_08_protocol_contracts.md`；`03_ddd_step_09_function_flows.md`；`03_ddd_step_11_persistence_transaction_consistency.md`；`03_ddd_step_12_error_recovery.md`；`06_acceptance_step_05_function_gate.md`；`06_acceptance_step_06_boundary_gate.md` | 确认 accepted / rejected publication、semantic derivation、payload ref 边界和错误映射 | 能说明合法材料、非法材料、payload body 禁止落库的处理结果 |
| delivery + feedback + idempotency | `03` §8 / §9 / §10 / §12；`05` §6 / §9；`06` §8 / §9 | `03_ddd_step_09_function_flows.md`；`03_ddd_step_10_state_matrix.md`；`03_ddd_step_11_persistence_transaction_consistency.md`；`03_ddd_step_13_concurrency_idempotency.md`；`05_test_plan_step_06_cases.md`；`06_acceptance_step_08_state_tx_consistency.md` | 确认 delivery lifecycle、feedback、duplicate、timeout、history 和幂等锚点 | 能说明重复 feedback、late feedback 和并发 delivery 的稳定结果 |
| recovery / DLQ / replay preparation | `03` §7 / §8 / §9 / §11；`05` §6；`06` §5 / §11 | `03_ddd_step_08_protocol_contracts.md`；`03_ddd_step_09_function_flows.md`；`03_ddd_step_10_state_matrix.md`；`03_ddd_step_12_error_recovery.md`；`06_acceptance_step_05_function_gate.md`；`06_acceptance_step_11_blockers.md` | 确认 retry plan、dead-letter material、replay preparation 和 approval ref 边界 | 能说明 replay 需要哪些 evidence,缺失时如何拒绝 |
| read-only output / audit / tap | `03` §7 / §8 / §10 / §14；`05` §13；`06` §10 | `03_ddd_step_08_protocol_contracts.md`；`03_ddd_step_09_function_flows.md`；`03_ddd_step_11_persistence_transaction_consistency.md`；`03_ddd_step_15_observability_audit.md`；`05_test_plan_step_13_reports_evidence.md`；`06_acceptance_step_10_evidence_audit.md` | 确认 Query 不写 truth、audit material、tap output、redaction 和 trace ref | 能说明只读输出、审计证据和脱敏检查来源 |
| config / runtime graph | `04` §3~§12；`03` §13；`06` §5 / §9 | `03_ddd_step_14_config_dependencies.md`；`04_config_step_03_control_plane_overview.md`；`04_config_step_07_config_items.md`；`04_config_step_09_load_validate_apply.md`；`04_config_step_11_failure_modes.md`；`06_acceptance_step_09_nonfunctional.md` | 确认 JSON config、profile、backend binding、secret ref、fail-fast / fail-closed | 能说明 valid profile 如何启动,非法配置如何失败 |
| api / worker / jobs wiring | `03` §4 / §5 / §7 / §8 / §13；`05` §8 / §9；`06` §7 | `03_ddd_step_04_units_file_layout.md`；`03_ddd_step_07_trait_port_adapter_contracts.md`；`03_ddd_step_08_protocol_contracts.md`；`03_ddd_step_09_function_flows.md`；`05_test_plan_step_08_environment_config.md`；`06_acceptance_step_07_interface_sync_gate.md` | 确认 HTTP JSON、consumer、operations job、runtime wiring 和 fake / in-memory adapter | 能说明入口如何只调用 application,不绕过 use case |
| tests / reports / acceptance handoff | `05` §9 / §12 / §13 / §14；`06` §10~§14 | `05_test_plan_step_09_automation_ci_gates.md`；`05_test_plan_step_12_entry_exit_criteria.md`；`05_test_plan_step_13_reports_evidence.md`；`06_acceptance_step_10_evidence_audit.md`；`06_acceptance_step_12_defects_release.md`；`06_acceptance_step_13_risk_acceptance.md`；`06_acceptance_step_14_conclusion_signoff.md` | 确认 gate、report、EV、defect、risk acceptance 和最终送验材料 | 能说明固定 `<run_id>` 下有哪些 artifacts 和 reports 可送验 |

冲突处理规则:

```text
正式 00~07 文档
  -> 作为实现基线
  -> 如有不清楚处,读取对应 design-calibration
  -> 如仍不清楚,暂停实施并回报设计缺口
```

### 7.3 git 配置检查清单

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| 配置作用域 | 只使用目标实现仓项目级配置 | 不使用 `--global` | 暂停提交,在目标仓重新配置 |
| `user.name` | `quantalithos-labs` | `git config user.name` | 修改项目级配置 |
| `user.email` | `quantalithos.ai@gmail.com` | `git config user.email` | 修改项目级配置 |
| 提交规范阅读 | 已阅读实施计划提交规范 | 对照 `standards/document/实施计划书写规范.md` | 未阅读不得提交 |
| 历史提交参考 | 查看目标仓近期提交 | `git log --oneline -n 5` | 若仓不存在,建仓后按本文规则创建首批提交 |

### 7.4 编码规范确认清单

| 类型 | 前置要求 | 检查方式 |
|---|---|---|
| Rust 格式 | 遵循 rustfmt 和项目配置 | `cargo fmt` |
| Rust 静态检查 | 遵循 Clippy 和编码规范 | `cargo clippy` 或目标仓等价命令 |
| Rust 测试 | 按阶段门禁执行相关 suite | `cargo test` 或目标仓 gate script |
| 源码语言 | 实现仓标识符、rustdoc、普通注释和测试名默认英文 | review / grep / lint |
| 公开 API 注释 | public struct / enum / enum variant / trait / function / module 使用英文 rustdoc | review / `cargo doc` 可选 |
| 提交语言 | 实现仓 commit message 必须英文 | review commit message |
| 提交标题 | `type(scope): subject` | 对照规范和历史提交 |
| 提交粒度 | 一笔提交对应 §6 一个 commit boundary | 对照实施计划 §6 |
| Commit body | 按子功能分组,只写文件名,标注改动量,不写字面量 `\n` | 使用 message 文件和 `git commit -F` |
| Footer | 默认 `Co-Authored-By: Codex <noreply@openai.com>` | footer 前保留空行 |

### 7.5 工具与环境前置检查表

| 前置项 | P0 要求 | 检查方式 | 不满足时处理 |
|---|---|---|---|
| 目标实现仓路径 | `/home/aris/Projects/quantalithos-bus` | `test -d /home/aris/Projects/quantalithos-bus` | 若不存在,由初始阶段创建 |
| 设计基线 | 记录当前 design 仓 commit / diff 基线 | `git status` / `git rev-parse HEAD` | 未记录不得宣称按本文实现 |
| Rust toolchain | 可运行 Rust workspace | `rustc --version`、`cargo --version` | 先安装或切换 toolchain |
| Cargo fmt / lint / test | 可运行目标仓门禁 | `cargo fmt`、`cargo clippy`、`cargo test` | 若命令不同,实施前记录替代命令 |
| Shell 脚本环境 | gate / report / check scripts 可执行 | `bash --version`、脚本 `--help` | 缺失则补齐脚本或记录替代命令 |
| JSON 配置 profile | 至少支持 local / ci-test / release-like 的表达 | 对照 `04-配置设计.md` | 缺失进入 Step 8 风险 |
| In-memory / fake backend | P0 默认可验证路径可启动 | fake adapter test | 不要求真实 MQ |
| Fake outbox source | 可提供 committed outbox fact fixture | fixture test | 不要求真实 L0-core 运行服务 |
| Evidence 输出 | 可生成 run_id、suite、case、profile、artifact path | 对照 `05` / `06` EV | 物理路径未定进入 Step 8 / Step 11 |

### 7.6 代码仓目录与命名前置检查表

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-bus` | 检查目录名 | 若不存在则创建;若命名偏离则暂停并回报 |
| workspace member 目录 | `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs` | 检查 `crates/` | 修正目录或暂停 |
| Cargo package | `bus-contracts`、`bus-domain`、`bus-application`、`bus-infra`、`bus-api`、`bus-worker`、`bus-jobs` | 检查各 `Cargo.toml` `[package].name` | 修正 package 名 |
| Rust library crate | `bus_contracts`、`bus_domain`、`bus_application`、`bus_infra`、`bus_api`、`bus_worker` | 检查 `[lib].name` | 修正 crate 名 |
| binary 名 | `bus-api`、`bus-worker`、`bus-jobs` | 检查 `[[bin]].name` 或 package default binary | 修正 binary 名 |
| 架构层级泄漏 | 代码命名中不出现 `L0` / `L1` / `l0_` / `l1_` | 搜索 package / crate / module / file / test | 暂停并回报设计或实现偏离 |
| scripts 目录 | `scripts/gates`、`scripts/reports`、`scripts/checks`、可选 `scripts/dev` | 检查目录 | 创建或记录为阶段交付 |
| artifacts 目录 | `artifacts/test/<run_id>` | 检查脚本默认值和文档引用 | 修正路径口径 |
| reports 目录 | `reports/`、`reports/runs/<run_id>`、`reports/acceptance` | 检查生成脚本输出 | 修正路径口径 |

### 7.7 本地多仓依赖前置检查表

| 依赖仓库 | 全局依赖类型 | 本地路径 | 当前引用方式 / 协作方式 | 检查方式 | 不存在时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core/crates/contracts` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 检查目录和 `Cargo.toml` package / lib | 暂停编译期阶段并回报 |
| 消息 backend / store | 运行期依赖 | 本轮可使用目标仓内 in-memory / fake | adapter / fake / fixture | 运行 fake backend 测试 | 不阻塞 P0;生产 adapter 后置 |
| 全平台事件消费者 | 事件协作依赖 | 本轮使用 fake subscriber / projection fixture | event / projection / tap output | consumer / publisher boundary test | 不写 Cargo path dependency |
| Observability / audit consumer | 事件协作依赖 | 本轮使用 report / artifact 输出 | tap material / audit material | redaction / evidence check | 不要求真实 dashboard |

### 7.8 测试脚本与报告工具前置检查表

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| CI gate script | `scripts/gates/run_ci_gate.sh` | 检查脚本存在、可执行、支持 required args | 创建或记录为本轮交付物 |
| Release gate script | `scripts/gates/run_release_gate.sh` | 检查脚本存在、可执行、支持 required args | 创建或记录为本轮交付物 |
| Report generator | `scripts/reports/generate_reports.sh` | 检查输出到 `reports/runs/<run_id>` | 创建或记录为本轮交付物 |
| Acceptance handoff generator | `scripts/reports/generate_acceptance_handoff.sh` | 检查输出到 `reports/acceptance` | 创建或记录为本轮交付物 |
| Artifact checker | `scripts/checks/check_artifacts.sh` | 检查 `artifacts/test/<run_id>` 完整性 | 创建或记录为本轮交付物 |
| Redaction checker | `scripts/checks/check_redaction.sh` | 检查 raw secret / raw payload body 风险 | 创建或记录为本轮交付物 |
| Report link checker | `scripts/checks/check_report_links.sh` | 检查 report 能回指 artifact root | 创建或记录为本轮交付物 |
| Gate args | `--run-id`、`--artifact-root`、`--config-profile` | 脚本 `--help` 和 smoke test | 缺失则不得作为正式 gate |
| Report args | `--run-id`、`--artifact-root`、`--report-root` | 脚本 `--help` 和 smoke test | 缺失则不得作为正式 report generator |
| 禁止路径 | 不使用 `artifacts/test/<project>/<run_id>`、`reports/<project>`、正式 `latest` | grep 文档和脚本 | 发现即修正 |

### 7.9 前置检查流程图

```text
Implementer
  |
  v
Read L0-bus 00~06 + L0-core 00~07 + standards
  |
  v
Confirm /home/aris/Projects/quantalithos-bus
  |
  v
Confirm /home/aris/Projects/quantalithos-core/crates/contracts
  |
  v
Configure project-level git identity
  |
  v
Check Rust toolchain + repository naming
  |
  v
Prepare fake backend + JSON profiles + evidence roots
  |
  v
Enter Step 4 deliverable extraction
```

关键说明:

- 该图只表达编码前的前置检查顺序,不表达正式实施阶段。
- 真实 MQ、生产数据库、配置中心、gateway、SDK 和 dashboard 不在 P0 前置启动项中。
- 任一前置项无法满足时,应进入 Step 8 或 Step 9 的环境风险 / blocker,不能静默开始编码。

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §3。

```markdown
## 3. 实施前置条件与阅读清单

> 校准来源：
> - `design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“阅读清单”“阶段实施前阅读矩阵”“git 配置检查清单”“编码规范确认清单”“代码仓目录与命名前置检查表”“本地多仓依赖前置检查表”和“测试脚本与报告工具前置检查表”小节，了解实施者在编码前必须完成哪些前置动作。

实施者开始编码前，必须完成阅读、项目级 git 配置、Rust 编码规范、提交规范、工具链、目标仓、sibling dependency、scripts、artifacts 和 reports 前置检查。不得在未确认目标实现仓、未阅读上游 `00~06`、未确认 L0-core `core-contracts`、未配置项目级 git identity 的情况下开始实现。

目标实现仓固定为 `/home/aris/Projects/quantalithos-bus`。当前该目录不存在，建仓和 workspace 初始化属于早期实施阶段，不允许在 design 仓实现业务代码。稳定上游为 `/home/aris/Projects/quantalithos-core/crates/contracts`，当前采用本地 path dependency：

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

实施者必须先读 L0-bus `00~06`、L0-core `00~07`、`standards/coding/rust.md`、`standards/document/子项目目录与代码文件组织规范.md`、`standards/document/全局项目依赖关系与裁剪规则.md` 和实施计划提交规范。实现仓源码、rustdoc、普通注释、测试名和 commit message 默认必须使用英文。

阶段开工前还必须按阶段实施前阅读矩阵补读对应的 `design-calibration` 文件。正式 `00`~`07` 文档是实现基线；`design-calibration` 只用于理解决策背景、取舍和细节来源。若二者冲突，以正式文档为准；若正式文档不清楚，先读对应校准来源；仍不清楚时暂停并回报设计缺口。

正式 `07-实施计划.md` 回填阶段阅读矩阵时,必须列出具体 `design-calibration` 文件名,不得只写 `Step 3 / Step 4 / Step 6` 这类编号简称。阶段阅读矩阵既要包含 07 实施计划校准产物,也要包含与本阶段实现判断直接相关的 `03_ddd_*`、`04_config_*`、`05_test_plan_*` 和 `06_acceptance_*` 校准产物。

目标实现仓必须使用项目级 git 配置：

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

实现仓必须创建或维护 `scripts/gates/`、`scripts/reports/`、`scripts/checks/`、`artifacts/test/<run_id>` 和 `reports/`。gate scripts 必须支持 `--run-id`、`--artifact-root`、`--config-profile`；report scripts 必须支持 `--run-id`、`--artifact-root`、`--report-root`。artifact root 固定为 `artifacts/test/<run_id>`，report root 固定为 `reports/`，禁止使用 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式引用 `latest`。
```

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| `/home/aris/Projects/quantalithos-bus` 当前未发现存在 | 不阻塞实施计划,但影响实际编码开工 | 初始阶段必须创建目标仓和 workspace | 接受,并在 Step 4 / Step 5 / Step 6 纳入交付与阶段 |
| `core-contracts` 版本固定方式 | 当前使用 sibling path dependency | 后续可复现构建需要记录 core commit | 接受当前 path dependency,实施时记录 core 仓 commit |
| 真实 MQ / durable DB adapter | P0 不作为前置 | 生产化风险后置 | 接受 fake / in-memory 默认路径,将生产 adapter 写入风险或 P1 |
| 目标仓历史提交 | 目标仓不存在时无历史提交 | 首批提交只能依规范创建 | 建仓后严格按本文英文 commit 规则执行 |

建议方案: 接受上述待确认事项后继续。原因是这些事项不影响当前收稳阅读、规范和前置门禁,但必须在后续 Step 4~Step 9 转成交付物、阶段、风险或环境准备项。

---

## 10. 进入下一步条件

- 阅读清单已覆盖 L0-bus `00~06`、L0-core `00~07`、Rust 编码规范、目录组织规范、依赖裁剪规则、实施计划规范和目标仓提交规范。
- 阶段实施前阅读矩阵已按预阶段组织,没有要求实施者一次性全量阅读所有 `design-calibration`。
- 项目级 git 配置、源码语言、commit 语言、footer、path dependency、仓库命名、scripts、artifacts 和 reports 规则已列出。
- 目标实现仓缺失和真实 MQ / DB adapter 后置已进入待确认事项,不阻塞进入 Step 4。
