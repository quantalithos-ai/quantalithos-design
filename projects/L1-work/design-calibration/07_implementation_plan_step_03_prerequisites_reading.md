# L1-work 07 实施计划 Step 3: 收稳前置条件与阅读清单

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` §3 实施前置条件与阅读清单
> 状态: `[x] 已完成`
> 日期: 2026-06-05

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 3 |
| 主题 | 收稳前置条件与阅读清单 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_03_prerequisites_reading.md` |

本步定义实现者开始编码、配置、脚本或测试改动前必须完成的阅读、规范、git、目录、工具、本地多仓依赖、脚本和报告前置检查。本步不拆 phase、不拆 commit boundary,只给后续 Step 5 / Step 6 / Step 7 提供可审查的开工门禁。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 承接目标实现仓、core baseline、design commit 固定风险和输入边界 |
| `07_implementation_plan_step_02_scope.md` | 承接 P0 / P1 / P2 范围边界和非范围 |
| `03-详细设计.md` §3 / §4 / §5 / §16 / §17 | 提取 Rust workspace、crate、依赖、模块、测试切口和实施交接前置项 |
| `04-配置设计.md` | 提取 config、profile、runtime graph、secret、path shape 和 fail-fast / fail-closed 前置项 |
| `05-测试方案.md` | 提取 suite、gate、fixture、artifact、report 和 redaction 前置项 |
| `06-验收标准.md` §2~§4 | 提取 P0 验收范围、基线、准入、run_id、reports / artifacts 和 veto 前置项 |
| `standards/document/实施计划书写规范.md` §5.3 / §4.9 | 提取阅读清单、永久记忆种子、git 配置和实现仓 commit 规范 |
| `standards/document/实施计划讨论流程_SOP.md` Step 3 | 提取本步问题、输出和执行约束 |
| `standards/document/设计文档讨论中间产物规范.md` §5.11 | 提取永久记忆种子类中间产物格式 |
| `standards/document/子项目目录与代码文件组织规范.md` | 提取目录、artifacts、reports 和 scripts 规则 |
| `projects/README.md` §8.2 | 提取 design 仓 / 实现仓提交语言边界和永久记忆来源约束 |
| `standards/coding/rust.md` | 作为当前技术栈 Rust 编码规范 |

## 3. SOP 问题回答

### 3.1 实施者必须先读哪些文档,分别为了理解什么?

实施者开始任何代码、配置、脚本或测试改动前,必须先读正式 `00~07` 中与当前 boundary 相关的章节、当前技术栈编码规范、提交规范、目录组织规范和对应 `design-calibration` 文件。阅读不是“全量泛读”,而是按 phase / commit boundary 的实现判断读取。

全局必读清单见 §7.1。阶段实施前阅读矩阵见 §7.3。

### 3.2 当前项目使用什么语言和编码规范?

当前目标实现是 Rust 2024 workspace。实现仓源码标识符、rustdoc、普通注释和测试名默认使用英文。当前技术栈编码规范为 `standards/coding/rust.md`。

实施计划不能把 Rust 写成所有项目的通用默认;本项目是因为 `03-详细设计.md` 明确目标实现为 Rust 2024 workspace,所以 Step 3 阅读清单指向 Rust 编码规范。

### 3.3 Rust 项目是否已明确 `standards/coding` 下的 Rust 编码规范?

已明确。`standards/coding/rust.md` 是本项目当前技术栈编码规范。若后续 boundary 增加 shell、Python、TypeScript 或其他脚本实现,必须在对应 boundary 开工前补充相应规范路径或记录为待确认风险,不得自行猜测。

### 3.4 是否必须阅读提交规范和历史提交?

必须阅读。当前设计仓提交与未来实现仓提交规则不同:

- 当前 `quantalithos-design` 文档仓:commit `type` 使用英文,subject / body 使用中文,footer 使用固定 AI 注脚。
- 未来 `/home/aris/Projects/quantalithos-work` 实现仓:commit message 必须使用英文,标题固定为 `type(scope): subject`,body 先用一句话说明 commit boundary,再按子功能分组列文件,footer 默认保留 `Co-Authored-By: Codex <noreply@openai.com>`。

实现仓创建后,提交前还必须查看目标仓近期合格提交;若目标仓尚无历史提交,以 `standards/document/实施计划书写规范.md` §4.9 和 `projects/README.md` §8.2 为准。

### 3.5 项目级 git `user.name` 和 `user.email` 应如何配置?

必须使用项目级配置,不得用 `--global` 污染全局配置。

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

检查输出必须分别为 `quantalithos-labs` 和 `quantalithos.ai@gmail.com`。

### 3.6 是否有必须先启动或确认的本地服务、数据库、消息系统或外部依赖?

当前 P0 不要求真实 DB / MQ / search / trace / archive 产品服务作为开工前置。P0 允许 in-memory repository、fake resolver、fake publisher、fake handoff 和 controlled adapter 证明本仓闭环。

必须确认的本地依赖是:

- 目标实现仓路径 `/home/aris/Projects/quantalithos-work` 是否存在;不存在则在实施初始阶段创建。
- 唯一编译期依赖 `/home/aris/Projects/quantalithos-core/crates/contracts` 存在,并在交接前固定 commit。
- 非 core sibling repo 只作为运行期、事件协作或 fake seam,不得写成 Cargo path dependency。
- Rust toolchain、Cargo、格式化、测试和脚本运行环境可用。

### 3.7 每个实施阶段或 commit boundary 开工前,必须先读哪些正式章节?

正式阅读入口按 boundary 组织,不要求一次性阅读所有中间产物。最低规则:

- 所有 boundary 开工前先读 `07-实施计划.md` 对应 phase / commit boundary、§3 阅读清单、§6 任务提交边界、§7 测试门禁、§11 提交纪律。
- 涉及对象 / 状态时读 `03-详细设计.md` §5 / §6 / §10。
- 涉及 port / adapter / service / transaction 时读 `03-详细设计.md` §7 / §9 / §11~§13。
- 涉及 public protocol 时读 `03-详细设计.md` §8。
- 涉及 config / runtime builder 时读 `03-详细设计.md` §13 和 `04-配置设计.md`。
- 涉及测试 / evidence / acceptance 时读 `05-测试方案.md` 和 `06-验收标准.md`。

具体矩阵见 §7.3。

### 3.8 这些正式章节引用了哪些 `design-calibration` 中间产物,其中哪些会影响当前阶段实现判断?

会影响实现判断的校准文件包括:

- `03_ddd_step_04_file_layout.md`: workspace、crate、package、binary 和目录判断。
- `03_ddd_step_05_module_contracts.md`: module ownership 和依赖方向判断。
- `03_ddd_step_06_object_contracts.md`:对象字段、value object、enum、policy 和 invariant 判断。
- `03_ddd_step_07_trait_port_adapter_contracts.md`:repository、port、adapter 和 fake seam 判断。
- `03_ddd_step_08_protocol_contracts.md`:Command / Query / Consumer / Event / Job DTO、result、receipt 和 error surface 判断。
- `03_ddd_step_09_function_flows.md`:application service、worker、job 编排和副作用判断。
- `03_ddd_step_10_state_matrix.md`:状态迁移、非法转换和 domain test 判断。
- `03_ddd_step_11_persistence_transaction_consistency.md`:UoW、repository、transaction 和 persistence 判断。
- `03_ddd_step_12_error_recovery.md`:错误模型、retry、dead-letter 和 recovery 判断。
- `03_ddd_step_13_concurrency_idempotency.md`:幂等、request digest、duplicate、conflict 和并发判断。
- `03_ddd_step_14_config_external_binding.md`:config key、runtime graph 和 adapter binding 判断。
- `03_ddd_step_15_observability_audit.md`:logs、metrics、audit 和 safe diagnostic 判断。
- `03_ddd_step_16_test_cuts.md`:unit / service / contract / job test 切口判断。
- `03_ddd_step_17_implementation_handoff.md`:字段闭环、DTO 闭环、状态闭环、phase boundary 和命名一致性复核。

### 3.9 如果正式文档和 `design-calibration` 表述不一致,实施者应该以哪个为准,何时暂停回报设计缺口?

处理顺序固定为:

```text
正式 00~07 文档
  -> 作为实现基线
  -> 如有不清楚处,读取对应 design-calibration
  -> 如仍不清楚,暂停实施并回报设计缺口
```

实现者不得在代码里自行补 DTO 字段、改 enum variant、调整状态迁移、改变 phase scope、创建未定义 config default 或选择冲突双方之一落码。

### 3.10 本仓是否依赖 `/home/aris/Projects` 下已经实现的 sibling repo?

本仓唯一编译期 sibling dependency 是 `quantalithos-core/crates/contracts`。其他 sibling repo 即使在 `/home/aris/Projects` 下存在,也只能通过 port、adapter、event、snapshot、handoff、query 或 fake seam 协作,不得写入 `Cargo.toml` path dependency。

### 3.11 对已确认的编译期依赖,当前应使用本地 path dependency,还是已经具备 private git tag / rev 的中期条件?

当前使用本地 path dependency:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

在未来具备 private git tag / rev 之前,不得自行改成 crates.io、公开 git dependency 或未固定 rev 的远程依赖。实现交接前必须固定 `core-contracts` commit。

### 3.12 目标实现仓目录是否为 `/home/aris/Projects/quantalithos-<project>`?

是。本项目目标实现仓固定为 `/home/aris/Projects/quantalithos-work`。如果实际路径不同,必须暂停并回报目录偏离,不得在其他目录悄悄实现。

### 3.13 workspace member 目录、Cargo package、Rust crate 和 binary 名是否与详细设计一致?

必须与 `03-详细设计.md` §4 一致:

| member | Cargo package | Rust crate / binary |
|---|---|---|
| `crates/contracts` | `work-contracts` | `work_contracts` |
| `crates/domain` | `work-domain` | `work_domain` |
| `crates/application` | `work-application` | `work_application` |
| `crates/infra` | `work-infra` | `work_infra` |
| `crates/api` | `work-api` | `work_api` / `work-api` |
| `crates/worker` | `work-worker` | `work_worker` / `work-worker` |
| `crates/jobs` | `work-jobs` | `work_jobs` / job binary names |

### 3.14 是否存在 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名?

不得存在。代码命名使用 `work` / role / domain object / protocol object,不得把 `L0`、`L1`、`L2`、`l0_`、`l1_`、`l2_` 写入 package、crate、module、file、type、function、route 或 binary 名。

### 3.15 目标实现仓是否需要创建 `scripts/gates/`、`scripts/reports/`、`scripts/checks/` 和 `scripts/dev/`?

需要作为本轮脚本和证据交付物的目录前置。脚本必须放在 `scripts/` 下,不能放到 `reports/` 输出目录下。

### 3.16 目标实现仓是否需要创建或保留 `artifacts/test/<run_id>` 和 `reports/`?

需要。artifact root 固定为 `artifacts/test/<run_id>`,report root 固定为 `reports/`。正式验收引用不得使用 `latest`,不得写成 `artifacts/test/<project>/<run_id>` 或 `reports/<project>`。

### 3.17 哪些 gate / report / check 脚本是本轮实施交付物?

至少需要在后续 Step 4~7 继续拆出的脚本类型:

- `scripts/gates/`:运行 P0 suite、release gate、redaction / boundary gate。
- `scripts/reports/`:从 `artifacts/test/<run_id>` 生成 `reports/runs/<run_id>` 和 `reports/acceptance`。
- `scripts/checks/`:依赖方向、path shape、no latest、redaction、forbidden body、non-core dependency 检查。
- `scripts/dev/`:本地开发辅助,不得作为验收正式引用。

### 3.18 这些脚本是否必须支持 `--run-id`、`--artifact-root`、`--config-profile`?

正式 gate / report / check 脚本必须支持或等价承接:

- `--run-id`
- `--artifact-root`
- `--config-profile`

如果某脚本不适用某参数,必须在脚本说明或报告中说明原因;不能让正式报告依赖隐式 `latest`。

### 3.19 是否明确禁止 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式引用 `latest`?

已明确禁止。正式证据路径只允许:

- `artifacts/test/<run_id>/...`
- `reports/runs/<run_id>/...`
- `reports/acceptance/...`

`latest` 只允许本地调试,不得成为正式测试、验收、提交或交付引用。

### 3.20 哪些规则必须由实现 agent 在项目永久记忆中保存,以便后续每个编码回合先遵守?

必须保存的规则只来自 §7.5 的 Agent 启动与永久记忆种子表。覆盖类别包括:

- 必读规范。
- 设计边界和缺口暂停。
- 工作区安全。
- 提交纪律。
- 验证与证据路径。
- 依赖裁剪。
- 永久记忆自身生成约束。

### 3.21 永久记忆种子是否只写执行规则和规范索引,没有复制详细设计字段 schema、状态矩阵或业务规则正文?

是。§7.5 只写可执行规则和规范索引,不复制对象字段表、DTO schema、状态矩阵、业务规则正文或测试用例全文。详细设计 truth 必须通过正式文档和章节索引读取。

### 3.22 每条永久记忆是否有稳定 ID、适用范围、来源文档、来源章节、刷新触发和冲突处理口径?

是。§7.5 的每条记忆均使用 `MEM-WORK-NNN` 稳定 ID,并包含适用范围、类别、必须写入文本、规范路径来源、来源文档、来源章节、刷新触发、失效条件、冲突处理和禁止改写。

### 3.23 当前 boundary 的语言 / 技术栈规范路径是否来自阅读清单,而不是在永久记忆中写死某一种语言?

是。永久记忆中的技术栈规范路径通过 `07-实施计划.md` §3 阅读清单获得。本项目阅读清单当前指向 `standards/coding/rust.md`,原因是 L1-work 详细设计明确目标实现为 Rust 2024 workspace。

### 3.24 如果项目 owner 有临时执行约束,是否明确它是临时规则、失效条件是什么,且没有混入通用永久记忆默认项?

当前只有“每个 SOP Step 完成后暂停审核”属于本轮文档编写过程的临时执行约束,不写入未来实现仓项目永久记忆。未来若 owner 要把临时实现约束写入永久记忆,必须先进入 §7.5 种子表并写明失效条件。

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 实施前阅读入口尚未集中 | 00~06 和标准分散 | 实现者漏读规范或按旧口径编码 | 本步形成阅读清单和阶段阅读矩阵 |
| 永久记忆容易自由生成 | agent 可能从对话或全文总结长期规则 | 临时要求、字段 schema 或状态矩阵形成第二真相 | 本步给出机械投影的种子表和生成门禁 |
| Rust 规范可能被误写成通用默认 | 标准要求不得硬编码单一语言 | 后续多语言 boundary 无规范来源 | 本步把 Rust 规范放入 L1-work 阅读清单,不是通用默认 |
| 目标实现仓尚不存在 | `/home/aris/Projects/quantalithos-work` 当前未创建 | 实现 agent 不知道建仓和目录检查如何处理 | 本步将建仓、workspace 和命名列入前置检查 |
| sibling repo 边界容易误入 Cargo dependency | Work 会与多个 L1 / L2 / L4 仓协作 | 破坏唯一编译期依赖纪律 | 本步明确只有 `core-contracts` 可 path dependency |
| evidence 路径容易漂移 | 旧路径可能包含 project 层或 `latest` | 验收不可复核 | 本步固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 阅读清单 | 规范和上游文档分散 | 形成全局必读清单和 boundary 阅读矩阵 | 开工前可审查 |
| 永久记忆 | 只有标准要求,无项目种子 | 形成 `MEM-WORK-*` 种子和生成门禁 | 防止自由总结和第二真相 |
| git 配置 | 需要从标准推断 | 明确项目级 `user.name` / `user.email` | 防止全局污染和提交身份错误 |
| 目录命名 | 详细设计已有布局 | 转成前置检查表 | 实现仓初始化可验证 |
| 多仓依赖 | 架构和详细设计分散说明 | 转成 sibling repo 依赖检查表 | 防止非 core Cargo path dependency |
| 证据路径 | 测试 / 验收分散说明 | 转成脚本和报告前置检查 | 防止 `latest` 和错误层级 |

## 6. 实施计划取舍

### 6.1 是否要求实现者一次性阅读全部 `design-calibration`

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| A. 开工前全量阅读所有中间产物 | 信息完整 | 资料量过大,实现者难以定位当前 boundary 判断 | 不采用 |
| B. 全局阅读正式文档,按 phase / commit boundary 补读对应校准文件 | 可审查且降低负担 | 需要后续 Step 5 / Step 6 继续细化矩阵 | 采用 |

推荐方案 B。正式文档是实现基线,`design-calibration` 是字段、DTO、状态和 flow 不清楚时的展开来源。

### 6.2 是否把永久记忆交给 agent 自由总结

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| A. agent 阅读后自由总结 | 初看省事 | 临时对话、字段 schema、状态矩阵和测试全文可能进入长期记忆 | 不采用 |
| B. 只从种子表机械投影 | 可审查、可刷新、可删除 | 需要本步写清固定文本 | 采用 |

推荐方案 B。永久记忆只保存执行规则和规范索引,不保存详细设计 truth。

### 6.3 是否把真实外部服务作为开工前置

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| A. 要求真实 DB / MQ / search / trace / archive 先就绪 | 更像生产 | 下游 readiness 阻塞 Work P0,且与 Step 2 非范围冲突 | 不采用 |
| B. P0 只要求 Rust / Cargo / core-contracts / fake seam 和证据脚本前置 | 能独立交付本仓闭环 | 需要严格标记 fake 不是 production success | 采用 |

推荐方案 B。真实产品集成进入 P1 / P2 或风险接受,不是 P0 开工前置。

## 7. 结构化中间产物

### 7.1 阅读清单

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求文档 | `projects/L1-work/00-需求文档.md` | 理解 Work truth、`FR-WORK-*`、`BR-WORK-*`、数据归属、AC / VF 和非目标 | 实现偏离需求或增强能力入 P0 | 能说明本轮覆盖 `FR-WORK-001~008` 且排除 `FR-WORK-E01~E05` |
| 架构设计 | `projects/L1-work/01-架构设计.md` | 理解依赖方向、数据所有权、唯一编译期依赖和相邻仓边界 | 把相邻仓正文或依赖写入 Work | 能说明非 core sibling repo 不进 Cargo dependency |
| 概要设计 | `projects/L1-work/02-概要设计.md` | 理解主要组成部分、对象轮廓、接口骨架和状态集合 | phase / commit boundary 失去业务主线 | 能说明 P0 主线对象和接口族 |
| 详细设计 | `projects/L1-work/03-详细设计.md` | 作为字段、DTO、状态、flow、transaction、error、config 和 test cut 的实现真相源 | 自行补字段或选状态落码 | 能指出当前 boundary 对应正式章节 |
| 配置设计 | `projects/L1-work/04-配置设计.md` | 理解 `WorkRuntimeConfig`、profile、secret、path shape 和 failure mode | 配置绕过 truth 边界或证据路径 | 能说明当前 boundary 读取哪些 config key |
| 测试方案 | `projects/L1-work/05-测试方案.md` | 理解 `TC-WORK-*`、`EV-WORK-*`、suite、fixture、gate 和 evidence | 测试留到最后或证据不可复核 | 能说明当前 boundary 的测试和 evidence ID |
| 验收标准 | `projects/L1-work/06-验收标准.md` | 理解 P0 / P1 / P2、AC、VF、基线、准入准出和风险接受 | P0 通过条件错误或一票否决漏检 | 能说明当前 boundary 对应 AC / VF |
| 实施计划 | `projects/L1-work/07-实施计划.md` | 理解 phase、commit boundary、阅读矩阵、门禁和提交纪律 | 不按实施计划提交或越界实现 | 能说明当前 boundary、门禁和提交关系 |
| Rust 编码规范 | `standards/coding/rust.md` | 统一 Rust 标识符、注释、rustdoc、测试名和可读性 | review 返工,源码语言错误 | 能说明当前 boundary 使用 Rust 规范 |
| 目录组织规范 | `standards/document/子项目目录与代码文件组织规范.md` | 统一 workspace、scripts、artifacts、reports 和目录命名 | 路径漂移或报告不可验收 | 能说明脚本和报告目录规则 |
| 全局依赖裁剪规则 | `standards/document/全局项目依赖关系与裁剪规则.md` | 理解本地 sibling repo 依赖类型和裁剪边界 | 非 core 仓进入 package dependency | 能说明 `core-contracts` 是唯一编译期依赖 |
| 实施计划书写规范 | `standards/document/实施计划书写规范.md` §4.9 / §5.3 | 理解提交规范、阅读清单、永久记忆种子和前置检查 | commit message 或永久记忆违规 | 能说明实现仓英文 commit 结构 |
| 项目总约定 | `projects/README.md` §8.2 | 理解 design 仓 / 实现仓 commit 语言边界和永久记忆来源 | 把 design 仓中文提交规范带到实现仓 | 能说明实现仓 commit message 使用英文 |

### 7.2 必读规范索引表

| 规范类别 | 当前 boundary 适用技术栈 | 规范路径 | 来源文档 | 来源章节 | 未定义时处理 |
|---|---|---|---|---|---|
| 编码规范 | Rust 2024 | `standards/coding/rust.md` | `03-详细设计.md`;`07-实施计划.md` | `03` §3;`07` §3 | 暂停并补阅读清单,不得猜测 |
| 提交规范 | design repo | `projects/README.md` §8.2;`standards/document/实施计划书写规范.md` §4.9 | `07-实施计划.md` | §3 / §11 | 暂停提交 |
| 提交规范 | implementation repo | `standards/document/实施计划书写规范.md` §4.9;目标仓历史合格提交 | `07-实施计划.md` | §3 / §11 | 暂停提交 |
| 目录组织规范 | Rust workspace / scripts / artifacts / reports | `standards/document/子项目目录与代码文件组织规范.md` | `07-实施计划.md` | §3 | 暂停涉及目录改动 |
| 依赖裁剪规范 | 本地 sibling repo | `standards/document/全局项目依赖关系与裁剪规则.md` | `07-实施计划.md` | §3 | 暂停涉及依赖改动 |
| 永久记忆规范 | Agent memory seed | `standards/document/实施计划书写规范.md` §5.3;`standards/document/设计文档讨论中间产物规范.md` §5.11 | `07-实施计划.md` | §3 | 不生成永久记忆 |

### 7.3 阶段实施前阅读矩阵

> 当前 Step 3 尚未拆出最终 phase / commit boundary。以下矩阵按预计 boundary 类别组织,Step 5 / Step 6 必须将其细化到正式 `PH-xx / commit-xx-x`。

| 阶段 / commit boundary | 必读正式章节 | 必读 `design-calibration` | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| repo / workspace scaffold | `03-详细设计.md` §3~§5;`07-实施计划.md` §3 | `03_ddd_step_03_constraints.md`;`03_ddd_step_04_file_layout.md`;`03_ddd_step_05_module_contracts.md` | 确认目标仓、workspace、crate、package、binary、依赖方向和命名 | 能列出七个 member 的 package / crate 名和唯一 compile dependency |
| contracts refs / commands / queries / events / jobs | `03-详细设计.md` §6 / §8;`05-测试方案.md`;`06-验收标准.md` | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_16_test_cuts.md`;`03_ddd_step_17_implementation_handoff.md` | 确认 public DTO、typed ref、result、receipt、metadata、idempotency 和 roundtrip tests | 能说明每个 DTO 字段来源;缺 schema 时暂停 |
| domain truth objects / policies / states | `03-详细设计.md` §5 / §6 / §10;`00-需求文档.md` §10~§11 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_10_state_matrix.md`;`03_ddd_step_16_test_cuts.md` | 确认 Project、ProjectMember、Backlog、WorkItem、dependency、blocker、Iteration、PromoteResult 和 policy invariant | 能说明状态转换来源和非法转换错误 |
| application ports / command services / UoW | `03-详细设计.md` §7 / §9 / §11~§13 | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_12_error_recovery.md`;`03_ddd_step_13_concurrency_idempotency.md` | 确认 repository / port trait、service flow、transaction、error mapping 和 idempotency | 能画出当前 command 的 UoW 边界和 outbox / audit 副作用 |
| query / projection / read view | `03-详细设计.md` §8 / §9 / §11 / §15;`06-验收标准.md` | `03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_16_test_cuts.md` | 确认 query no-write、projection freshness、stale / failed marker 和授权 surface | 能说明 query 不写 idempotency、audit、outbox 或 freshness marker |
| inbound consumers / reference snapshots | `03-详细设计.md` §7~§9 / §11~§13 | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_12_error_recovery.md`;`03_ddd_step_13_concurrency_idempotency.md` | 确认外部事件、resolver、snapshot、dead-letter、retry 和 source truth isolation | 能说明 consumer 只用 ref / snapshot / marker,不补外部 truth |
| outbox / worker / outbound events | `03-详细设计.md` §8~§13 / §15 | `03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_10_state_matrix.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_12_error_recovery.md`;`03_ddd_step_15_observability_audit.md` | 确认 outbox state、publish retry、event DTO、publication state 和观测字段 | 能说明 event 从 committed truth / outbox 构造且不含相邻仓正文 |
| operations jobs / reconciliation / handoff | `03-详细设计.md` §7~§15;`04-配置设计.md`;`05-测试方案.md` | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_12_error_recovery.md`;`03_ddd_step_14_config_external_binding.md`;`03_ddd_step_16_test_cuts.md` | 确认 job DTO、scope、partial failure、handoff marker、report 和 rerun / duplicate | 能说明 job-level reject 与 item-level failure 区别 |
| infra adapters / config runtime builder | `03-详细设计.md` §4 / §7 / §13;`04-配置设计.md` | `03_ddd_step_04_file_layout.md`;`03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_14_config_external_binding.md` | 确认 repository、resolver、publisher、handoff、clock、id generator 和 config validation | 能说明 fake adapter 与 production adapter 不混用 |
| scripts / gates / reports / acceptance evidence | `05-测试方案.md`;`06-验收标准.md`;`07-实施计划.md` §7 / §11 / §12 | `03_ddd_step_16_test_cuts.md`;`03_ddd_step_17_implementation_handoff.md`;对应 `05_test_plan_*`;对应 `06_acceptance_*` | 确认 gate、run_id、artifact root、report root、redaction、veto 和 acceptance handoff | 能生成或说明 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |

### 7.4 冲突处理规则

```text
正式 00~07 文档
  -> 作为实现基线
  -> 如有不清楚处,读取对应 design-calibration
  -> 如仍不清楚,暂停实施并回报设计缺口
```

| 场景 | 处理 |
|---|---|
| 正式文档与中间产物冲突 | 以正式文档为准;若正式文档摘要不足,暂停并回报设计缺口 |
| DTO / ref / enum / state 只有名字没有 schema | 不落码占位类型,暂停并回报设计缺口 |
| phase / commit boundary 需要后续 phase 对象 | 暂停并回报 boundary 冲突 |
| 配置默认值或外部 adapter 行为未定义 | 不自行补默认值,暂停并回报配置 / 设计缺口 |
| 测试或验收证据 ID 不闭合 | 暂停并回报 `05` / `06` / `07` 缺口 |

### 7.5 Agent 启动与永久记忆种子表

| 记忆 ID | 适用范围 | 类别 | 必须写入的记忆文本 | 规范路径来源 | 来源文档 | 来源章节 | 刷新触发 | 失效条件 | 冲突处理 | 禁止改写 |
|---|---|---|---|---|---|---|---|---|---|---|
| `MEM-WORK-001` | project | 必读规范 | 开始任何代码、配置、脚本或测试改动前,必须读取当前 boundary 所属技术栈的编码规范、项目提交规范和目录组织规范;具体路径以 `07-实施计划.md` §3 阅读清单为准,不得自行猜测。 | `07-实施计划.md` §3 阅读清单 | `07-实施计划.md` | §3 阅读清单 | 项目首次开工 / 技术栈或规范路径变更 | until superseded | 正式文档优先,暂停并刷新记忆 | 是 |
| `MEM-WORK-002` | project | 设计边界 | 实现时以正式 `00~07` 文档为基线;正式文档不清楚时读取对应 `design-calibration`;仍不清楚时必须暂停并回报设计缺口,不得自行补字段、schema、状态、配置默认值或 phase scope。 | 不适用 | `07-实施计划.md` | §3 冲突处理规则 | design baseline commit 变化 / 进入新 boundary | until superseded | 正式文档优先,暂停并刷新记忆 | 是 |
| `MEM-WORK-003` | commit-boundary | 工作区安全 | 提交前只暂存当前 boundary 相关文件,不得暂存或改写用户已有未提交改动。 | 不适用 | `07-实施计划.md` | §3 git 与工作区安全前置检查 | 每次提交前 | until superseded | 暂停并重新核对暂存区 | 是 |
| `MEM-WORK-004` | commit-boundary | 提交纪律 | 实现仓提交必须使用英文 commit message,标题固定为 `type(scope): subject`,一笔提交对应一个 `07-实施计划.md` §6 commit boundary,并在提交前通过该 boundary 声明的验证门禁。 | `07-实施计划.md` §3 阅读清单 / §11 提交纪律 | `07-实施计划.md` | §3 / §11 | 每次提交前 / 进入新 commit boundary | until superseded | 正式提交规范优先,暂停并修正 message | 是 |
| `MEM-WORK-005` | project | 依赖裁剪 | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 是唯一允许的编译期 sibling dependency;其他 sibling repo 只能通过 port、adapter、event、snapshot、handoff、query 或 fake seam 协作,不得写成 Cargo path dependency。 | `07-实施计划.md` §3 阅读清单 | `07-实施计划.md` | §3 本地多仓依赖前置检查 | 依赖变更 / Cargo.toml 变更 / design baseline 变化 | until superseded | 正式架构和实施计划优先,暂停并修正依赖 | 是 |
| `MEM-WORK-006` | phase | 验证门禁 | 每个 phase 或 commit boundary 完成前必须运行并记录该 boundary 在 `07-实施计划.md` §7 声明的 fmt、check、test、gate、report 或 acceptance 证据;未通过不得提交。 | `07-实施计划.md` §3 阅读清单 / §7 测试门禁 | `07-实施计划.md` | §3 / §7 | 进入新 phase / 提交前 | phase complete / until superseded | 正式门禁优先,暂停并补验证 | 是 |
| `MEM-WORK-007` | project | 证据路径 | 正式测试、验收和交付证据只能引用 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`;不得正式引用 `latest`、`artifacts/test/<project>/<run_id>` 或 `reports/<project>`。 | `07-实施计划.md` §3 阅读清单 | `07-实施计划.md` | §3 测试脚本与报告工具前置检查 | 编写 gate / report / acceptance 证据时 | until superseded | 正式测试方案和验收标准优先,暂停并修正路径 | 是 |
| `MEM-WORK-008` | project | 永久记忆生成 | 项目永久记忆只能逐条来自 `07-实施计划.md` §3 的种子表 `必须写入的记忆文本`;不得把对话、历史提交、详细设计字段 schema、状态矩阵、DTO 表、业务规则正文或测试用例全文自由总结进永久记忆。 | 不适用 | `07-实施计划.md` | §3 Agent 启动与永久记忆种子表 | 生成或刷新永久记忆时 | until superseded | 种子表优先,删除自由总结内容并刷新记忆 | 是 |

### 7.6 Agent 永久记忆生成门禁

| 检查项 | 通过标准 | 失败处理 |
|---|---|---|
| 种子表存在 | `07-实施计划.md` §3 或本中间产物提供固定种子表,且至少覆盖必读规范、工作区安全、提交纪律、设计缺口暂停和验证门禁 | 不生成永久记忆,暂停并要求补实施计划 |
| 只写表内内容 | 永久记忆逐条来自 `必须写入的记忆文本` | 删除自由总结内容并回到种子表 |
| 来源完整 | 每条记忆有来源文档、来源章节、刷新触发、失效条件和冲突处理 | 不写入该条记忆 |
| 技术栈不硬编码 | 语言 / 框架 / 目录规范路径来自阅读清单 | 暂停并补阅读清单 |
| 不复制设计 truth | 不写 DTO 字段表、状态矩阵、业务规则正文或测试用例全文 | 删除该内容,改为索引正式文档 |
| 临时规则有失效条件 | owner 临时约束必须标注 `失效条件` | 不写入永久记忆 |
| 禁止改写执行 | `禁止改写 = 是` 的记忆逐字写入 | 删除改写版本,重新按种子文本写入 |

### 7.7 git 与工作区安全前置检查

| 检查项 | 要求 | 检查命令 / 检查方式 | 失败处理 |
|---|---|---|---|
| git user.name | `quantalithos-labs` | `git config user.name` | 使用项目级 `git config user.name "quantalithos-labs"` 修正 |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email` | 使用项目级 `git config user.email "quantalithos.ai@gmail.com"` 修正 |
| 不使用 global 污染 | 不执行 `git config --global` 改本项目身份 | 检查命令历史 / 当前 repo config | 暂停并改用项目级配置 |
| 工作区保护 | 不改写用户已有未提交改动 | `git status --short`;按 boundary 复核 diff | 暂停并只处理当前 boundary |
| 暂存区保护 | 只暂存当前 boundary 文件 | `git diff --cached --name-only` | 取消无关暂存并重新核对 |
| 提交规范 | 实现仓英文 commit;design 仓中文 commit | 阅读 `projects/README.md` §8.2 和 `实施计划书写规范.md` §4.9 | 暂停提交并重写 message |

### 7.8 编码规范确认清单

| 检查项 | 要求 | 确认方式 | 失败处理 |
|---|---|---|---|
| Rust edition | Rust 2024 workspace | 检查 root `Cargo.toml` 和 crate `Cargo.toml` | 暂停并修正 workspace |
| 源码语言 | 标识符、rustdoc、普通注释、测试名使用英文 | code review / search | 修正源码语言 |
| public docs | public struct / enum / trait / function / enum variant 按 Rust 规范写 rustdoc | `cargo doc` / lint / review | 补文档注释 |
| 业务中文 | 只允许作为明确业务数据、协议样例、i18n 资源或测试 fixture | review | 移除或说明落点 |
| 格式化 | Rust 使用 `cargo fmt --all` | gate | 未通过不得提交 |
| 静态检查 | 按 boundary 使用 `cargo check` / clippy 若后续定义 | gate | 未通过不得提交 |

### 7.9 工具与环境前置检查表

| 前置项 | 要求 | 检查命令 / 检查方式 | 失败处理 |
|---|---|---|---|
| Rust toolchain | 可编译 Rust 2024 workspace | `rustc --version`;`cargo --version` | 暂停实施并补齐环境 |
| cargo fmt | 可运行格式化 | `cargo fmt --version` 或 `cargo fmt --all` | 暂停并补工具链 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-work` | 检查目录;不存在则按初始阶段创建 | 不在其他目录实现 |
| core contracts | `/home/aris/Projects/quantalithos-core/crates/contracts` | 检查目录和 git commit | 缺失则暂停;commit 未固定则记录风险 |
| 本地服务 | P0 不要求真实 DB / MQ / search / trace / archive | 检查 config profile 使用 fake / in-memory | 不因真实服务缺失阻塞 P0 |
| config profile | 至少具备 P0 测试 profile | 按 `04-配置设计.md` 检查 | 缺失列入初始交付 |
| scripts shell | 能运行 gate / report / check 脚本 | `sh` / `bash` 版本或 shebang 检查 | 暂停并补环境说明 |

### 7.10 代码仓目录与命名前置检查表

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-work` | 检查目录名 | 暂停并回报目录偏离 |
| workspace member 目录 | `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs` | 检查 `crates/` | 暂停并回报命名偏离 |
| Cargo package | `work-contracts`、`work-domain`、`work-application`、`work-infra`、`work-api`、`work-worker`、`work-jobs` | 检查 `Cargo.toml` `[package].name` | 暂停并回报命名偏离 |
| Rust library crate | `work_contracts`、`work_domain`、`work_application`、`work_infra`、`work_api`、`work_worker`、`work_jobs` | 检查 `Cargo.toml` `[lib].name` | 暂停并回报命名偏离 |
| binary 名 | `work-api`、`work-worker` 或 job binary names | 检查 `[[bin]].name` | 暂停并回报命名偏离 |
| 架构层级泄漏 | 代码命名中不出现 `L0` / `L1` / `L2` / `l0_` / `l1_` / `l2_` | 搜索 package / crate / module / file / type / function | 暂停并回报设计或实现偏离 |

### 7.11 本地多仓依赖前置检查表

| 依赖仓库 | 全局依赖类型 | 本地路径 | 当前引用方式 / 协作方式 | 检查方式 | 不存在时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `/home/aris/Projects/quantalithos-core/crates/contracts` | Cargo path dependency `../quantalithos-core/crates/contracts` | 检查目录、`Cargo.toml` 和 commit | 暂停;P0 无法编译 |
| `quantalithos-bus` | 事件协作依赖 | `/home/aris/Projects/quantalithos-bus` | port / fake publisher / event contract | 不写 Cargo dependency;检查 fake / event DTO | 不阻塞 P0,使用 fake 并记录风险 |
| `quantalithos-identity` | 运行期依赖 | `/home/aris/Projects/quantalithos-identity` | resolver port / snapshot / fake | 不写 Cargo dependency;检查 resolver trait | 不阻塞 P0,使用 fake 并记录风险 |
| `quantalithos-conversation` | 事件协作依赖 | `/home/aris/Projects/quantalithos-conversation` | inbound event / source ref / fake | 不写 Cargo dependency;检查 event DTO / fixture | 不阻塞 P0,使用 fake 并记录风险 |
| `quantalithos-method-library` | 运行期依赖 | `/home/aris/Projects/quantalithos-method-library` | resolver port / definition snapshot | 不写 Cargo dependency;检查 adapter seam | 不阻塞 P0,使用 fake 并记录风险 |
| `quantalithos-process` | 运行期依赖 | `/home/aris/Projects/quantalithos-process` | timing event / process ref / fake | 不写 Cargo dependency;检查 consumer seam | 不阻塞 P0,使用 fake 并记录风险 |
| `quantalithos-governance` | 运行期依赖 | `/home/aris/Projects/quantalithos-governance` | decision ref / snapshot / fake | 不写 Cargo dependency;检查 resolver seam | 不阻塞 P0,使用 fake 并记录风险 |
| `quantalithos-artifact` | 运行期依赖 | `/home/aris/Projects/quantalithos-artifact` | evidence ref / completion summary / fake | 不写 Cargo dependency;检查 resolver seam | 不阻塞 P0,使用 fake 并记录风险 |
| `quantalithos-runtime` | 事件协作依赖 | `/home/aris/Projects/quantalithos-runtime` | promote request event / source ref / fake | 不写 Cargo dependency;检查 consumer seam | 不阻塞 P0,使用 fake 并记录风险 |
| `quantalithos-workspace` | 下游消费依赖 | `/home/aris/Projects/quantalithos-workspace` | query / projection consumer | 不写 Cargo dependency;检查 public surface only | 不阻塞 P0 |
| `quantalithos-observability` | handoff / downstream | `/home/aris/Projects/quantalithos-observability` | handoff port / fake | 不写 Cargo dependency;检查 handoff seam | 不阻塞 P0,使用 fake 并记录风险 |
| `quantalithos-archive` | handoff / downstream | `/home/aris/Projects/quantalithos-archive` | archive handoff port / fake | 不写 Cargo dependency;检查 handoff seam | 不阻塞 P0,使用 fake 并记录风险 |

### 7.12 测试脚本与报告工具前置检查表

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| gate scripts | `scripts/gates/*.sh` 或等价 runner | 检查目录和脚本命名 | 创建或记录为本轮交付物 |
| report scripts | `scripts/reports/*.sh` 或等价 runner | 检查目录和脚本命名 | 创建或记录为本轮交付物 |
| check scripts | `scripts/checks/*.sh` 或等价 runner | 检查目录和脚本命名 | 创建或记录为本轮交付物 |
| dev scripts | `scripts/dev/*` 仅用于本地辅助 | 检查脚本说明 | 不作为正式验收引用 |
| artifact root | `artifacts/test/<run_id>` | 检查配置和脚本默认值 | 修正路径口径 |
| report root | `reports/` | 检查生成脚本输出 | 修正路径口径 |
| run report | `reports/runs/<run_id>` | 检查 report generator | 缺失则不得送验 |
| acceptance report | `reports/acceptance` | 检查 handoff / veto / risk files | 缺失则不得送验 |
| formal run ref | 固定 `<run_id>`,不使用 `latest` | 检查测试 / 验收文档和脚本输出 | 暂停并修正文档或脚本 |
| script args | 支持 `--run-id`、`--artifact-root`、`--config-profile` 或说明不适用 | 检查 help / README / invocation | 补参数或补不适用说明 |
| redaction | raw secret / token / payload / source body 不进入报告 | redaction check | 未通过不得提交 / 送验 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §3。

````markdown
## 3. 实施前置条件与阅读清单

> 校准来源:
> - `design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阅读清单”“阶段实施前阅读矩阵”“Agent 启动与永久记忆种子表”“git 与工作区安全前置检查”“本地多仓依赖前置检查表”和“测试脚本与报告工具前置检查表”小节,了解实现 agent 开工前必须完成哪些可审查准备。

实现者开始任何代码、配置、脚本或测试改动前,必须先读取当前 boundary 所属正式章节、对应 `design-calibration` 中间产物、Rust 编码规范、项目提交规范、目录组织规范和依赖裁剪规则。

本项目目标实现仓为 `/home/aris/Projects/quantalithos-work`,当前技术栈为 Rust 2024 workspace。`core-contracts = { path = "../quantalithos-core/crates/contracts" }` 是唯一允许的编译期 sibling dependency;其他相邻仓只能通过 port、adapter、event、snapshot、handoff、query 或 fake seam 协作。

实现仓必须使用项目级 git 配置:

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

Agent 永久记忆只能从本章种子表机械投影,不得自由总结对话、历史提交、详细设计字段 schema、状态矩阵、DTO 表、业务规则正文或测试用例全文。永久记忆与正式文档冲突时,以正式文档为准并刷新记忆。

正式测试、验收和交付证据只能引用 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`;不得正式引用 `latest`、`artifacts/test/<project>/<run_id>` 或 `reports/<project>`。
````

## 9. 待确认事项

无阻塞进入 Step 4 的待确认事项。

后续必须继续收口:

- Step 4 抽取交付物时,将 `scripts/gates`、`scripts/reports`、`scripts/checks`、`artifacts/test/<run_id>` 和 `reports/` 明确到交付物清单。
- Step 5 / Step 6 形成正式 phase / commit boundary 后,必须把 §7.3 的预计 boundary 阅读矩阵细化为正式 `PH-xx / commit-xx-x`。
- Step 7 必须把 §7.12 的 gate / report / redaction / run_id 规则嵌入阶段门禁。
- Step 11 必须展开实现仓英文 commit message 正例、反例、type / scope、body 分组和提交前检查清单。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 阅读清单已列出 | 已满足 |
| 阶段实施前阅读矩阵已列出 | 已满足 |
| Agent 永久记忆种子表已列出 | 已满足 |
| Agent 永久记忆生成门禁已列出 | 已满足 |
| git 配置和工作区安全前置已列出 | 已满足 |
| 编码规范确认清单已列出 | 已满足 |
| 工具与环境前置检查表已列出 | 已满足 |
| 代码仓目录与命名前置检查表已列出 | 已满足 |
| 本地多仓依赖前置检查表已列出 | 已满足 |
| 测试脚本与报告工具前置检查表已列出 | 已满足 |
| 无法满足的前置项已进入风险或 blocker | 已满足 |

结论:可以进入 Step 4,抽取实施对象与交付物。
