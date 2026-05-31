# L0-sdk 07 实施计划 Step 3: 前置条件与阅读清单

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 Step 3 中间产物。
> 本步收稳实施者开始编码前必须完成的阅读、git 配置、编码规范、目标仓、跨仓依赖、工具链、脚本和证据目录检查。
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
| `07_implementation_plan_step_01_input_boundary.md` | 已确认 | 继承 `00~06` 已完成、`07` 尚未创建、目标实现仓仅有 git shell、core / bus contracts 需复核的结论 |
| `07_implementation_plan_step_02_scope.md` | 已确认 | 继承 P0 覆盖 F-001~F-010、三语言 official SDK、local package candidate、fake / fixture boundary 和非范围结论 |
| `projects/L0-sdk/00-需求文档.md` | 已完成 | 提取 official client access layer、P0 功能范围、非目标和验收方向 |
| `projects/L0-sdk/01-架构设计.md` | 已完成 | 提取 SDK 与 core、bus、formal API、fake / fixture target、language package 和下游调用方边界 |
| `projects/L0-sdk/02-概要设计.md` | 已完成 | 提取代码主体框架、主要组成部分、关键对象、接口、流程、状态和配置影响 |
| `projects/L0-sdk/03-详细设计.md` | 已完成 | 提取目标仓、workspace、crate、package、path dependency、对象、接口、状态、脚本和实施交接 |
| `projects/L0-sdk/04-配置设计.md` | 已完成 | 提取 JSON profile、contracts path、runtime graph、forbidden config、artifact / report root 和 fail-fast 规则 |
| `projects/L0-sdk/05-测试方案.md` | 已完成 | 提取 gate、suite、artifact、report、test data、redaction 和 candidate 验证要求 |
| `projects/L0-sdk/06-验收标准.md` | 已完成 | 提取 AC、VETO、缺陷分级、风险接受、handoff 和最终裁决规则 |
| `standards/coding/rust.md` | 已完成 | 作为 Rust 源码、rustdoc、命名、格式、错误处理和安全规则来源 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已完成 | 作为实现仓目录、crate、scripts、artifacts 和 reports 组织规则来源 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已完成 | 作为 L0-sdk 从总依赖关系中裁剪自身依赖的依据 |
| `standards/document/实施计划书写规范.md` 与 SOP | 已完成 | 作为 §3 输出格式、阶段阅读矩阵、提交纪律和前置门禁约束来源 |

---

## 3. SOP 问题回答

### 3.1 实施者必须先读哪些文档,分别为了理解什么?

实施者必须先读 L0-sdk `00~06` 正式文档,再读 Rust 编码规范、目录与代码文件组织规范、全局依赖裁剪规则、实施计划规范和目标实现仓历史提交。L0-sdk 依赖已稳定的 L0-core 和 L0-bus,因此还必须阅读两者 `00~07` 中与 `core-contracts`、`bus-contracts`、event envelope、trace、error、outbox fact 和 bus event contract 有关的章节。

### 3.2 当前项目使用什么语言和编码规范?

当前实现目标是 Rust workspace + Python package + TypeScript package。Rust 代码必须遵循 `standards/coding/rust.md`。实现仓源码标识符、模块名、类型名、函数名、变量名、测试名、普通注释、rustdoc 和 commit message 必须使用英文。设计仓文档可以中文,但该规则不得迁移到实现仓。

### 3.3 Rust 项目是否已明确 `standards/coding` 下的 Rust 编码规范?

已明确。实施前必须阅读 `standards/coding/rust.md`,尤其是 rustdoc、命名、格式、错误处理、安全、`rustfmt` 和 Clippy 规则。public struct、enum、enum variant、trait、function 和 module 必须具备英文 rustdoc。

### 3.4 是否必须阅读提交规范和历史提交?

必须。实施者必须阅读 `standards/document/实施计划书写规范.md` 中提交时机、提交粒度、commit message、body 分组、footer 和实现仓英文规则,并查看目标实现仓近期合格提交。若目标实现仓暂无有效实现提交,首批提交必须直接遵循本文规则,不得搬用 design 仓中文提交规则。

### 3.5 项目级 git `user.name` 和 `user.email` 应如何配置?

目标实现仓必须使用项目级 git config,不使用 `--global`。推荐配置为 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`,并在每次提交前确认读取结果。

### 3.6 是否有必须先启动或确认的本地服务、数据库、消息系统或外部依赖?

P0 不要求启动真实 formal API service、真实 bus runtime、真实 package registry、真实 credential provider、gateway、observability dashboard 或 L1/L2/L3/L4 服务。P0 必须确认 Rust / Python / TypeScript 工具链、目标实现仓路径、core / bus contracts 本地 path dependency、local / fake / fixture boundary、JSON config profile、artifact / report 输出目录和 gate / report / check scripts。

### 3.7 每个实施阶段或 commit boundary 开工前,必须先读哪些正式章节?

正式阶段将在 Step 5 和 Step 6 收稳。Step 3 先按预阶段建立阅读门禁:仓初始化与依赖绑定、contracts / semantic baseline、service / event boundary、policy / config / redaction、candidate / package build、docs / smoke / compatibility、evidence / reports / acceptance。每个预阶段开工前必须阅读对应的 `03`、`04`、`05`、`06` 正式章节。

### 3.8 这些正式章节引用了哪些 `design-calibration` 中间产物,其中哪些会影响当前阶段实现判断?

影响实现判断的校准产物主要集中在:

- `03_ddd_step_04_units_file_layout.md`: workspace、crate、package、scripts、artifacts 和 reports 布局。
- `03_ddd_step_05_module_contracts_axis.md`: 模块职责、依赖方向和禁止跨层调用。
- `03_ddd_step_06_object_contracts.md`: domain object、enum、value object、成员变量、成员函数和状态。
- `03_ddd_step_07_trait_port_adapter_contracts.md`: port、adapter、repository、runner、artifact store 和 UoW 契约。
- `03_ddd_step_08_protocol_contracts.md`: Command、Query、Event、Job、Receipt 和 Error DTO。
- `03_ddd_step_09_function_flows.md`: 每个接口和 job 的函数级处理流。
- `03_ddd_step_10_state_matrix.md`: freshness、support、candidate、evidence、redaction、compatibility 和 deprecated 状态矩阵。
- `03_ddd_step_11_persistence_transaction_consistency.md`: store、projection、outbox、transaction 和 consistency。
- `03_ddd_step_12_error_recovery.md`: error envelope、恢复策略和失败语义。
- `03_ddd_step_13_concurrency_idempotency.md`: idempotency、expected version、job item 去重和并发保护。
- `03_ddd_step_14_config_dependencies.md`: config binding、dependency binding 和外部依赖。
- `03_ddd_step_15_observability_audit.md`: trace、audit、metrics、evidence 和 redaction。
- `03_ddd_step_16_test_slices.md`: P0 测试切口。
- `04_config_*`: profile、config item、sensitive ref、load / validate / apply 和 failure modes。
- `05_test_plan_*`: suite、case、gate、artifact、report 和 evidence。
- `06_acceptance_*`: AC、VETO、缺陷、风险接受和最终裁决。

### 3.9 如果正式文档和 `design-calibration` 表述不一致,实施者应该以哪个为准,何时暂停回报设计缺口?

正式 `00`~`07` 文档是实现基线。若正式文档与 `design-calibration` 冲突,以正式文档为准。若正式文档表达不清,先读取对应校准来源。读取后仍不能确定字段、状态、错误、事务、依赖、配置或验收口径时,暂停当前阶段并回报设计缺口。

### 3.10 本仓是否依赖 `/home/aris/Projects` 下已经实现的 sibling repo?

依赖。L0-sdk 的编译期 sibling repo 是 `/home/aris/Projects/quantalithos-core` 和 `/home/aris/Projects/quantalithos-bus`。当前已确认:

- `/home/aris/Projects/quantalithos-core/crates/contracts/Cargo.toml` 存在,package `core-contracts`,lib `core_contracts`。
- `/home/aris/Projects/quantalithos-bus/crates/contracts/Cargo.toml` 存在,package `bus-contracts`,lib `bus_contracts`。
- `/home/aris/Projects/quantalithos-sdk` 当前已存在,但仅有 git shell,应由早期实施阶段补齐 workspace、package、scripts、artifacts 和 reports。

### 3.11 对已确认的编译期依赖,当前应使用本地 path dependency,还是已经具备 private git tag / rev 的中期条件?

当前使用本地 path dependency:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
bus-contracts = { path = "../quantalithos-bus/crates/contracts" }
```

当前不要求发布到 public crates.io,也不默认要求引用 GitHub。private git tag / rev 是中期切换方案,只有当 core / bus 已完成版本发布策略后才进入实施。

### 3.12 目标实现仓目录是否为 `/home/aris/Projects/quantalithos-<project>`?

是。目标实现仓固定为 `/home/aris/Projects/quantalithos-sdk`。当前该目录已存在,但仅有 git shell,因此 workspace 初始化、package 目录初始化、scripts / artifacts / reports 目录初始化和项目级 git config 是本轮早期实施前置交付。

### 3.13 workspace member 目录、Cargo package、Rust crate 和 binary 名是否与详细设计一致?

应与 `03-详细设计.md` §4.2 和 §4.3 一致:

- `crates/contracts`: package `sdk-contracts`,lib `sdk_contracts`。
- `crates/domain`: package `sdk-domain`,lib `sdk_domain`。
- `crates/application`: package `sdk-application`,lib `sdk_application`。
- `crates/infra`: package `sdk-infra`,lib `sdk_infra`。
- `crates/client`: package `sdk-client`,lib `sdk_client`。
- `crates/cli`: package `sdk-cli`,lib `sdk_cli`,binary `sdk`。
- `crates/jobs`: package `sdk-jobs`,lib `sdk_jobs`,action binaries。
- `packages/python`: Python official SDK package surface。
- `packages/typescript`: TypeScript official SDK package surface。

### 3.14 是否存在 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名?

详细设计中的实现仓命名未泄漏架构层级。实施时必须继续检查 package、crate、module、file、binary、feature、Python package、TypeScript package 和 test name,禁止出现 `L0`、`L1`、`l0_`、`l1_`、`quantalithos-l0-sdk` 这类代码命名。

### 3.15 目标实现仓是否需要创建 `scripts/gates/`、`scripts/reports/`、`scripts/checks/` 和 `scripts/dev/`?

需要。`scripts/gates/`、`scripts/reports/`、`scripts/checks/` 是 P0 交付目录;`scripts/dev/` 可作为本地辅助目录。report 生成脚本必须放在 `scripts/reports/`,不能放进 `reports/` 输出目录。

### 3.16 目标实现仓是否需要创建或保留 `artifacts/test/<run_id>` 和 `reports/`?

需要。test artifact root 固定为 `artifacts/test/<run_id>`,report root 固定为 `reports/`。正式验收读取 `reports/runs/<run_id>`、`reports/acceptance` 和 `artifacts/test/<run_id>`。禁止使用 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式引用 `latest`。

### 3.17 哪些 gate / report / check 脚本是本轮实施交付物?

本轮至少需要:

- `scripts/gates/run_pr_gate.sh`
- `scripts/gates/run_main_gate.sh`
- `scripts/gates/run_nightly_gate.sh`
- `scripts/gates/run_candidate_gate.sh`
- `scripts/reports/generate_reports.sh`
- `scripts/reports/generate_acceptance_handoff.sh`
- `scripts/checks/check_artifacts.sh`
- `scripts/checks/check_redaction.sh`
- `scripts/checks/check_report_links.sh`
- `scripts/checks/check_package_layout.sh`

如果某个脚本在阶段内暂时只实现最小检查,也必须输出稳定 exit code 和固定 `<run_id>` 证据。

### 3.18 这些脚本是否必须支持 `--run-id`、`--artifact-root`、`--config-profile`?

gate scripts 必须支持 `--run-id`、`--artifact-root` 和 `--config-profile`。report scripts 必须支持 `--run-id`、`--artifact-root` 和 `--report-root`。check scripts 至少支持其检查对象需要的 `--artifact-root`、`--report-root` 或 `--package-root`;如与 profile 有关,也必须支持 `--config-profile`。

### 3.19 是否明确禁止 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式引用 `latest`?

明确禁止。正式验收引用必须固定到某个 `<run_id>` 下的 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`。`latest` 只允许作为本地临时辅助,不得进入正式文档、提交说明、验收交接或 release gate 证据。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 正式 `07-实施计划.md` 尚未创建 | §3 前置条件不存在 | 实施者可能直接写代码,漏读设计和规范 | 本步先形成可回填的 §3 草稿 |
| 目标实现仓仅有 git shell | `/home/aris/Projects/quantalithos-sdk` 已存在,但缺少 workspace / package / scripts / evidence 结构 | 实施者不知道初始化是否属于本轮 | 明确初始化纳入早期实施阶段 |
| 上游 contracts 依赖需要固定 | core / bus contracts 本地存在,但需记录 crate 名和路径 | path dependency 配错会阻塞编译或复制 truth | 明确本地 path dependency 和检查方式 |
| 三语言工具链复杂 | Rust / Python / TypeScript package build 与 smoke 涉及多工具链 | candidate build、docs、smoke 容易后期才暴露问题 | Step 3 前置工具链检查,Step 9 记录 Spike |
| `design-calibration` 文件很多 | 直接全量要求阅读会拖慢实施 | 实施者可能跳过真正影响实现判断的文件 | 按预阶段建立阅读矩阵 |
| scripts / reports / artifacts 容易后补 | `05` / `06` 均把证据作为门禁 | 最后无法通过验收 | 把脚本和证据目录列为前置检查 |
| design 仓和实现仓语言规则不同 | design 仓中文提交,实现仓英文提交 | 可能出现中文 rustdoc、测试名或 commit | 明确实现仓源码、注释、测试和 commit 默认英文 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 前置阅读 | 上游文档和规范散落在不同章节 | 收敛为阅读清单和确认方式 | 实施者知道先读什么、为什么读、如何证明读懂 |
| 阶段阅读 | 只有全量 `design-calibration` 目录 | 按预阶段列出必须补读的校准文件 | 避免全量阅读负担,也避免漏读关键来源 |
| 目标仓 | 只在详细设计中出现 | 明确 `/home/aris/Projects/quantalithos-sdk` 当前仅有 git shell,早期阶段初始化 | 防止在 design 仓写业务代码 |
| sibling dependency | 只在详细设计中写 path | 明确 core / bus contracts 当前本地存在,用 path dependency | 保证编译期依赖可检查 |
| 命名规则 | 目录规范和详细设计分离 | 转成 workspace / package / crate / binary 前置检查 | 防止 L0 层级进入代码命名 |
| 多语言工具链 | 容易在 candidate 阶段才暴露 | 前置 Rust / Python / TypeScript 工具链和 package layout 检查 | 降低后期返工 |
| 脚本与证据 | 容易留到测试后期 | 前置 scripts、artifacts、reports 目录和参数规则 | 支撑 gate、报告和验收交接 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 要求实施者一次性阅读全部 `design-calibration` | 信息完整 | 成本过高,容易流于形式 | 不采用 |
| 只要求阅读正式 `00~06` | 简洁 | 遇到对象、协议、状态、配置和验收来源时难以追溯 | 不采用 |
| 正式文档为基线,按阶段补读校准产物 | 可执行、可追溯、不会强制全量阅读 | Step 5 / Step 6 后需要把预阶段名对齐为正式阶段 | 采用 |
| 目标仓未完成 workspace 初始化时暂停所有实施计划 | 避免假设 | 会阻塞文档收敛,且初始化本身可作为实施阶段 | 不采用 |
| 目标仓未完成 workspace 初始化时把初始化列入早期交付 | 责任清楚,可继续规划 | 需要在后续阶段定义初始化门禁 | 采用 |
| 把 core / bus domain crate 作为依赖 | 类型丰富,实现方便 | 会复制上游业务 truth,破坏 SDK 边界 | 不采用 |
| 只依赖 core / bus contracts crate | 边界清楚,符合 official SDK 接入层定位 | 需要 fixture / fake 表达运行期协作 | 采用 |
| 真实 registry / endpoint / credential provider 作为 P0 前置 | 接近生产 | 超出 P0,也会阻塞 local candidate 闭环 | 不采用 |
| 使用 local / fake / fixture 默认路径 | 可快速验证主闭环 | 真实联调风险后置 | 采用 |

---

## 7. 结构化中间产物

### 7.1 阅读清单

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求文档 | `projects/L0-sdk/00-需求文档.md` | 理解 F-001~F-010、P0 / P1 / P2、非目标和业务规则 | 做出非范围能力或漏掉三语言 P0 | 能说明本轮覆盖和不覆盖的需求编号 |
| 架构设计 | `projects/L0-sdk/01-架构设计.md` | 理解 official client access layer、依赖方向和运行边界 | 把 auth、gateway、bus runtime、service truth 或 registry ops 写进 SDK | 能画出 SDK 与 core、bus、service、package consumer 的边界 |
| 概要设计 | `projects/L0-sdk/02-概要设计.md` | 理解主要组成部分、模块、关键对象、接口、流程和状态机轮廓 | 实施顺序退化为对象清单 | 能说明主要功能纵切如何经过各 crate / package |
| 详细设计 | `projects/L0-sdk/03-详细设计.md` | 按 workspace、对象、trait、API、状态、事务、错误、幂等和脚本契约实现 | 字段、函数、状态、错误、配置和事务边界漂移 | 能定位每个实现对象和接口来自哪一节 |
| 配置设计 | `projects/L0-sdk/04-配置设计.md` | 理解 JSON profile、contracts path、runtime graph、sensitive ref 和 fail-fast / fail-closed | 配置项揉错模块或 runtime fail open | 能列出 P0 配置组、profile 和禁止配置项 |
| 测试方案 | `projects/L0-sdk/05-测试方案.md` | 理解 suite、TC、EV、artifact、report、gate 和回归要求 | 阶段完成但没有自动化和证据 | 能把阶段任务映射到测试 suite |
| 验收标准 | `projects/L0-sdk/06-验收标准.md` | 理解 AC、VETO、缺陷分级、风险接受和最终裁决 | 触发一票否决仍继续实施 | 能说明每阶段对应验收门禁 |
| L0-core 设计文档 | `projects/L0-core/00~07` | 理解 `core-contracts`、trace、metadata、error 和共享契约来源 | 复制或偏离核心契约 | 能说明 SDK 只依赖 core shared contracts |
| L0-bus 设计文档 | `projects/L0-bus/00~07` | 理解 `bus-contracts`、event contract 和 bus event semantic boundary | SDK 误实现 bus runtime truth | 能说明 SDK 只做 event client semantic |
| Rust 编码规范 | `standards/coding/rust.md` | 理解 Rust 命名、格式、rustdoc、源码英文和安全规则 | 中文 rustdoc / 测试名 / 注释进入实现仓 | 提交前通过 review / fmt / clippy 检查 |
| 目录组织规范 | `standards/document/子项目目录与代码文件组织规范.md` | 理解实现仓、crate、packages、scripts、artifacts、reports 的组织方式 | 目录名、package、crate 或证据路径不合格 | 能对照规范检查仓库结构 |
| 全局依赖规则 | `standards/document/全局项目依赖关系与裁剪规则.md` | 从总依赖图中裁剪 L0-sdk 自己的依赖 | 把运行期或事件协作依赖写成 Cargo path dependency | 能说明编译期、运行期、事件协作依赖差异 |
| 实施计划规范 | `standards/document/实施计划书写规范.md` | 理解代码批次、提交边界、提交时机和 commit 规范 | 阶段、批次、commit 混写 | 能说明一笔提交对应哪个 §6 boundary |
| 目标实现仓历史提交 | `/home/aris/Projects/quantalithos-sdk` 的 `git log` | 对齐目标仓 commit 风格和提交粒度 | commit message 格式和粒度不合格 | 若无有效历史提交,首批提交直接使用本文规则 |

### 7.2 阶段实施前阅读矩阵

正式 `00`~`07` 文档是实现基线;`design-calibration` 是决策背景和细节追溯。正式阶段名称将在 Step 5 / Step 6 最终确定,本表先按预阶段组织开工前阅读门禁。

| 预阶段 / commit boundary | 必读正式章节 | 必读 `design-calibration` | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| 仓初始化与依赖绑定 | `03` §4 / §13 / §16;`04` §6 / §7;`05` §9;`06` §3 / §10 | `03_ddd_step_04_units_file_layout.md`;`03_ddd_step_14_config_dependencies.md`;`04_config_step_06_profiles_matrix.md`;`04_config_step_07_config_items.md`;`05_test_plan_step_09_automation_ci_gates.md`;`06_acceptance_step_03_baseline.md` | 确认目标仓、workspace、package、path dependency、profile、scripts 和证据根目录 | 能说明目录命名、crate / package 名、core / bus contracts path、artifact / report root 和 git config |
| contracts 与 semantic baseline | `03` §5 / §6 / §8 / §9 / §10;`05` §5 / §6;`06` §5 / §7 / §8 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_10_state_matrix.md`;`05_test_plan_step_06_cases.md`;`06_acceptance_step_05_function_gate.md`;`06_acceptance_step_08_state_tx_consistency.md` | 确认 shared contract consumption、semantic baseline、derived view 和 freshness | 能说明 SDK 不复制 core / bus truth,三语言概念如何承接同一 baseline |
| service / event boundary | `03` §5 / §7 / §8 / §9 / §12 / §13;`04` §7 / §8 / §11;`05` §6 / §8 / §9;`06` §6 / §7 | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_12_error_recovery.md`;`03_ddd_step_13_concurrency_idempotency.md`;`04_config_step_08_sensitive_secrets.md`;`05_test_plan_step_08_environment_config.md`;`06_acceptance_step_07_interface_sync_gate.md` | 确认 formal / fake / fixture boundary、bus event semantic、error / trace 和 idempotency | 能说明 P0 如何在无真实 service / bus runtime 时验证最小接入 |
| policy / config / redaction | `03` §6 / §12 / §13 / §14 / §15;`04` §4 / §8 / §9 / §11;`05` §9 / §10;`06` §9 / §10 / §11 | `03_ddd_step_12_error_recovery.md`;`03_ddd_step_14_config_dependencies.md`;`03_ddd_step_15_observability_audit.md`;`04_config_step_08_sensitive_secrets.md`;`04_config_step_09_load_validate_apply.md`;`04_config_step_11_failure_modes.md`;`05_test_plan_step_10_special_nonfunctional.md`;`06_acceptance_step_10_evidence_audit.md`;`06_acceptance_step_11_blockers.md` | 确认 raw secret、forbidden body、redaction、credential ref-only、config fail-fast 和 evidence safety | 能说明哪些配置不能存在,哪些泄露触发 VETO |
| candidate / package build | `03` §5 / §6 / §8 / §9 / §10 / §15;`04` §6 / §7;`05` §6 / §9;`06` §5 / §10 / §11 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_10_state_matrix.md`;`04_config_step_07_config_items.md`;`05_test_plan_step_09_automation_ci_gates.md`;`06_acceptance_step_05_function_gate.md`;`06_acceptance_step_10_evidence_audit.md` | 确认 local package candidate、language artifact、build runner、artifact metadata 和 candidate gate | 能说明 candidate 状态机、三语言产物和 public registry 非范围 |
| docs / smoke / compatibility | `03` §8 / §9 / §10 / §12 / §15;`05` §6 / §9 / §10 / §14;`06` §5 / §9 / §12 / §13 | `03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_10_state_matrix.md`;`03_ddd_step_12_error_recovery.md`;`05_test_plan_step_06_cases.md`;`05_test_plan_step_10_special_nonfunctional.md`;`05_test_plan_step_14_regression_risks.md`;`06_acceptance_step_12_defects_release.md`;`06_acceptance_step_13_risk_acceptance.md` | 确认 quickstart、docs runner、cross-language smoke、compatibility 和 deprecated 规则 | 能说明 smoke / docs / compatibility 失败如何阻断 candidate |
| evidence / reports / acceptance | `03` §15 / §16;`05` §9 / §12 / §13;`06` §3 / §4 / §10 / §11 / §14 | `03_ddd_step_15_observability_audit.md`;`03_ddd_step_16_test_slices.md`;`05_test_plan_step_12_entry_exit_criteria.md`;`05_test_plan_step_13_reports_evidence.md`;`06_acceptance_step_03_baseline.md`;`06_acceptance_step_04_entry_exit.md`;`06_acceptance_step_10_evidence_audit.md`;`06_acceptance_step_14_conclusion_signoff.md` | 确认 run_id、evidence index、handoff、veto checklist、risk acceptance 和 final decision | 能说明正式验收只引用固定 run_id,不引用 latest |

冲突处理规则:

- 正式 `00`~`07` 与 `design-calibration` 冲突时,以正式文档为准。
- 正式文档不清楚时,读取对应 `design-calibration` 文件理解决策背景。
- 读取后仍不能确定实现口径时,暂停当前阶段并回报设计缺口。

### 7.3 git 配置检查清单

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

| 检查项 | 要求 | 检查方式 | 备注 |
|---|---|---|---|
| 配置作用域 | 只使用目标实现仓项目级配置 | 不使用 `--global` | 避免污染其他仓 |
| `user.name` | `quantalithos-labs` | `git config user.name` | 提交前复核 |
| `user.email` | `quantalithos.ai@gmail.com` | `git config user.email` | 提交前复核 |
| 历史提交参考 | 查看目标实现仓近期合格提交 | `git log` | 无有效历史提交时首批提交直接使用本文规则 |

### 7.4 编码与提交规范确认清单

| 类型 | 前置要求 | 检查方式 |
|---|---|---|
| Rust 格式 | 遵循 rustfmt / 项目配置 | `cargo fmt` 或目标仓等价命令 |
| Rust 静态检查 | 遵循 Clippy 和编码规范 | `cargo clippy` 或目标仓等价命令 |
| Rust 测试 | 按阶段门禁执行相关 suite | `cargo test` 或目标仓 CI 命令 |
| Python package | package surface、示例和 smoke 可运行 | 目标仓约定的 Python build / test 命令 |
| TypeScript package | package surface、示例和 smoke 可运行 | 目标仓约定的 TypeScript build / test 命令 |
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
| 目标实现仓路径 | `/home/aris/Projects/quantalithos-sdk` | 检查目录和 workspace 骨架 | 不开始业务编码,先初始化或确认仓结构 |
| 设计基线 | 记录当前 design 仓 commit / diff 基线 | `git status` / `git rev-parse HEAD` | 未记录则不能宣称按本文实现 |
| Rust toolchain | 可运行 Rust workspace | `rustc --version`、`cargo --version` | 先安装或切换 toolchain |
| Python toolchain | 可构建 / 测试 Python package | `python --version` 和目标仓 build 命令 | 进入 Step 9 Spike 或早期环境任务 |
| TypeScript toolchain | 可构建 / 测试 TypeScript package | `node --version`、`npm --version` 或目标仓等价命令 | 进入 Step 9 Spike 或早期环境任务 |
| 格式 / lint / test | 可运行目标仓门禁 | `cargo fmt`、`cargo clippy`、`cargo test` 和语言 package 命令 | 若命令不同,实施前记录替代命令 |
| JSON 配置 profile | local-dev / ci-test / integration-test / candidate-validation 可表达 | 对照 `04-配置设计.md` | 缺失进入 Step 8 风险 |
| 文件系统状态根 | store、projection、outbox、artifact、report root 可配置 | temp dir / fixture dir | 路径冲突或不可写时 fail-fast |
| 外部引用解析 | 使用 fake / fixture / boundary resolver,禁止默认放行 | negative fixture | fail open 进入 blocker |
| Gate / report / check scripts | P0 脚本目录和参数存在 | shell help / dry run | 缺失列入 Step 4 交付物 |
| 证据输出 | 可记录 run_id、commit、suite、case_id、profile、artifact path | 对照 05 / 06 EV | 物理路径未定进入 Step 8 / Step 11 |

### 7.6 代码仓目录与命名前置检查表

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-sdk` | 检查目录名 | 暂停并回报目录偏离 |
| workspace member 目录 | `crates/<role>` | 检查 `crates/` | 暂停并回报命名偏离 |
| Cargo package | `sdk-<role>` | 检查 `Cargo.toml` `[package].name` | 暂停并回报命名偏离 |
| Rust library crate | `sdk_<role>` | 检查 `Cargo.toml` `[lib].name` | 暂停并回报命名偏离 |
| binary 名 | `sdk` 或具体 action name | 检查 `[[bin]].name` | 暂停并回报命名偏离 |
| Python package | official SDK package surface,不得含 `l0` 层级 | 检查 package metadata | 暂停并回报命名偏离 |
| TypeScript package | official SDK package surface,不得含 `l0` 层级 | 检查 package metadata | 暂停并回报命名偏离 |
| 架构层级泄漏 | 代码命名中不出现 `L0` / `L1` / `l0_` / `l1_` | 搜索 package / crate / module / file / test | 暂停并回报设计或实现偏离 |
| evidence 路径 | `artifacts/test/<run_id>` 与 `reports/` | 检查 scripts 默认值 | 修正路径口径 |

### 7.7 本地多仓依赖前置检查表

| 依赖仓库 | 全局依赖类型 | 本地路径 | 当前引用方式 / 协作方式 | 检查方式 | 不存在时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core/crates/contracts` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 检查目录、`Cargo.toml` package `core-contracts`、lib `core_contracts` | 暂停真实编译实现,不得复制类型 |
| `quantalithos-bus` | 编译期依赖 + 事件协作依赖 | `/home/aris/Projects/quantalithos-bus/crates/contracts` | `bus-contracts = { path = "../quantalithos-bus/crates/contracts" }`;bus runtime 走 boundary adapter / fake | 检查目录、`Cargo.toml` package `bus-contracts`、lib `bus_contracts`;检查 fake event boundary | contracts 不可用则暂停;runtime 不可用则 pending / fake |
| L1/L2/L3/L4 service repos | 运行期依赖 / 人工查阅位置 | `/home/aris/Projects/quantalithos-*` | 不写 Cargo path;通过 formal API / fake / fixture / projection 协作 | 检查接口文档或 fixture,不要求仓存在 | repo 不存在不阻塞 P0,能力 pending / unsupported |
| public package registries | 发布阶段依赖 | 不适用 | 当前 P0 不依赖公共 registry | 不作为 P0 前置检查 | 不可用不阻塞,本地 candidate 验证继续 |

### 7.8 测试脚本与报告工具前置检查表

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| gate scripts | `scripts/gates/*.sh` | 检查目录和脚本命名 | 创建或记录为本轮交付物 |
| report scripts | `scripts/reports/*.sh` | 检查目录和脚本命名 | 创建或记录为本轮交付物 |
| check scripts | `scripts/checks/*.sh` | 检查目录和脚本命名 | 创建或记录为本轮交付物 |
| package scripts | package build / smoke entry 可被 gate 调用 | 检查 packages 和 scripts 协作 | 缺失进入 candidate 阶段交付物 |
| artifact root | `artifacts/test/<run_id>` | 检查配置和脚本默认值 | 修正路径口径 |
| report root | `reports/` | 检查生成脚本输出 | 修正路径口径 |
| run report | `reports/runs/<run_id>` | 检查 report script 输出 | 缺失则 gate 不得通过 |
| acceptance report | `reports/acceptance` | 检查 handoff / veto / risk 文件 | 缺失则不得进入最终验收 |
| formal run ref | 固定 `<run_id>`,不使用 `latest` | 检查测试 / 验收文档和脚本输出 | 暂停并修正文档或脚本 |

### 7.9 前置检查流程图

图类型: 实施前置检查流程图

图标题: L0-sdk 编码前置检查顺序

```text
Implementer
  |
  v
Read L0-sdk 00~06 + standards
  |
  v
Read required L0-core / L0-bus contract context
  |
  v
Confirm /home/aris/Projects/quantalithos-sdk + design baseline
  |
  v
Configure project-level git identity
  |
  v
Check Rust / Python / TypeScript toolchains
  |
  v
Check core-contracts + bus-contracts path dependencies
  |
  v
Prepare JSON profiles + fake / fixture boundaries
  |
  v
Prepare scripts + artifacts/test/<run_id> + reports/
  |
  v
Enter Step 4 deliverable extraction
```

关键说明:

- 该图只表达编码前的前置检查顺序,不表达正式实施阶段。
- 真实 service endpoint、真实 bus runtime、public registry 和真实 credential provider 不在 P0 前置启动项中。
- 如果任一前置项无法满足,应进入 Step 8 或 Step 9 的环境风险 / blocker,而不是静默开始编码。

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §3。

```markdown
## 3. 实施前置条件与阅读清单

> 校准来源:
> - `design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阅读清单”“阶段实施前阅读矩阵”“git 配置检查清单”“编码与提交规范确认清单”“工具与环境前置检查表”“代码仓目录与命名前置检查表”“本地多仓依赖前置检查表”和“测试脚本与报告工具前置检查表”小节,了解实施者在编码前必须完成哪些前置动作。

实施者开始编码前,必须完成阅读、git 配置、编码规范、提交规范、工具链、跨仓依赖和环境前置检查。不得在未确认目标实现仓、未阅读上游 `00~06`、未确认 Rust / Python / TypeScript 工具链、未确认 core / bus contracts path dependency 和未配置项目级 git identity 的情况下开始实现。

本轮目标实现仓是 `/home/aris/Projects/quantalithos-sdk`。当前该目录已存在,但仅有 git shell,因此 workspace 初始化、package 目录初始化、scripts / artifacts / reports 目录初始化和项目级 git config 属于早期实施前置交付。实现仓 commit message、源码标识符、rustdoc、普通注释和测试名必须使用英文。

正式 `00`~`07` 文档是实现基线;`design-calibration` 是决策背景和细节追溯。若正式文档与 `design-calibration` 冲突,以正式文档为准。若正式文档表达不清,先读对应校准来源;仍不能确定字段、状态、错误、事务、依赖、配置或验收口径时,暂停当前阶段并回报设计缺口。
```

---

## 9. 待确认事项

| 事项 | 方案 | 建议 |
|---|---|---|
| 目标实现仓仅有 git shell 是否阻塞继续写实施计划 | A. 阻塞;B. 不阻塞,进入 Step 3 / Step 5 定义 workspace 初始化前置和初始化阶段;C. 忽略 | 采用 B |
| 是否要求实施者全量阅读 `design-calibration` | A. 全量必读;B. 按阶段 / commit boundary 建阅读矩阵;C. 不读 | 采用 B |
| Python / TypeScript 工具链未固定是否阻塞实施计划 | A. 阻塞;B. 不阻塞,作为 Step 3 / Step 8 前置和 Step 9 Spike;C. 忽略 | 采用 B |
| core / bus 依赖方式 | A. 本地 path dependency 到 contracts crate;B. public crates.io;C. GitHub 默认引用;D. 复制类型 | 采用 A |
| public registry 是否为 P0 前置 | A. 是;B. 否,只做 local candidate;C. 视工具链情况 | 采用 B |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 阅读清单已列出 | 已满足 |
| 阶段实施前阅读矩阵已列出 | 已满足 |
| git 配置检查清单已列出 | 已满足 |
| 编码与提交规范确认清单已列出 | 已满足 |
| 工具与环境前置检查表已列出 | 已满足 |
| 代码仓目录与命名前置检查表已列出 | 已满足 |
| 本地多仓依赖前置检查表已列出 | 已满足 |
| 测试脚本与报告工具前置检查表已列出 | 已满足 |
| 无法满足的前置项已进入风险或 blocker | 已满足 |

结论: 可以进入 Step 4,抽取实施对象与交付物。
