# Step 3. 收稳前置条件与阅读清单

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 3
> 回填章节: `07-实施计划.md` §3 实施前置条件与阅读清单

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 收稳前置条件与阅读清单 |
| 当前状态 | 已完成,按用户授权自动进入后续 Step |
| 输入基线 | Step 1~2、新版 `00~06`、`03_ddd_step_04_file_layout.md`、`03_ddd_step_17_implementation_handoff.md`、实施计划规范、目录规范、Rust 编码规范 |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_03_prerequisites_reading.md` |
| 正式文档状态 | 本 Step 不修改正式 `07-实施计划.md` |
| 停审方式 | 自动停审:前置条件、阅读清单、记忆种子和检查表已列出;正式 phase / boundary 阅读矩阵待 Step 5~6 转译 |

## 2. 本步目标

定义实施者开始编码前必须完成的阅读、配置、工具、仓库、依赖、脚本和证据路径检查,避免未读设计、未读规范、错误目录、错误依赖或错误 git 配置导致返工。

本 Step 只回答:

- 实施者必须先读哪些正式文档、校准产物和标准。
- 当前项目使用哪些目录、Rust、提交、依赖和证据路径规范。
- 哪些规则需要进入 Agent 永久记忆种子。
- 目标实现仓、workspace、Cargo package、crate、binary、scripts、artifacts 和 reports 需要如何检查。

本 Step 不定义正式 phase、commit boundary、BATCH、GATE、测试命令、具体 run id 或正式 `07` 正文。阶段阅读矩阵在本 Step 只能先按“实施关注面”给出输入;Step 5~6 定义 phase / boundary 后必须转译成真正的阶段 / boundary 阅读门禁。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 已完成 | 固定新版 `00~06` 为实施计划输入 |
| `07_implementation_plan_step_02_scope.md` | 已完成 | 固定本轮 P0 实施范围、非范围和 P1/P2 边界 |
| `00-需求文档.md` | 新版输入 | 提供需求、规则、数据归属、AC/VETO 和非范围阅读来源 |
| `01-架构设计.md` | 已完成 | 提供架构边界、依赖方向和 data ownership 阅读来源 |
| `02-概要设计.md` | Draft / 等待审核 | 提供主要组成部分、接口骨架、处理流和状态轮廓 |
| `03-详细设计.md` | Step 19 final self-check 已完成 | 提供正式实现契约入口和校准来源索引 |
| `04-配置设计.md` | Draft / Step 15 已审核通过 | 提供 profile、adapter、runtime builder、redaction 和 config redline 输入 |
| `05-测试方案.md` | Draft / Step 15 assembled | 提供 TC、EV、suite、artifact/report 和 entry/exit 输入 |
| `06-验收标准.md` | 已审核通过 | 提供 AC/VETO、P0 blocking suite、证据入口和风险接受输入 |
| `03_ddd_step_04_file_layout.md` | 已审核通过 | 提供目标实现仓、workspace、crate、package、binary 和文件布局 |
| `03_ddd_step_17_implementation_handoff.md` | 已完成 | 提供实现前阅读、关注面矩阵和 phase / boundary 审计输入 |
| `实施计划讨论流程_SOP.md` Step 3 | 流程标准 | 决定阅读清单、永久记忆种子、git / 工具 / 命名 / 脚本检查输出 |
| `实施计划书写规范.md` | 书写标准 | 决定阶段阅读矩阵、代码批次、测试证据、开工前设计闭环复核规则 |
| `设计真相源闭环与可落码性标准.md` §九 | 开工门禁标准 | 决定实现移交前整体审计和每个 boundary 经验复核 |
| `子项目目录与代码文件组织规范.md` | 工程组织标准 | 决定实现仓目录、workspace、package、crate、binary、scripts、artifacts、reports |
| `standards/coding/rust.md` | 编码规范 | 决定 Rust 源码语言、命名、rustdoc、格式和代码实践 |

## 4. 模块计划 / 模块目录

| 模块 | 目标 | 输入 | 输出 | 停审门禁 |
|---|---|---|---|---|
| M1 必读文档清单 | 列出实施者全局必读正式文档、校准产物和标准 | Step 1~2、正式 `00~06`、Step 17 handoff、标准 | 阅读清单 | 每条阅读项说明目的、未读风险和确认方式 |
| M2 实施关注面阅读矩阵输入 | 先按实现关注面组织阅读来源,为 Step 5~6 转译 phase / boundary 矩阵做输入 | `03_ddd_step_17_implementation_handoff.md`、`03_ddd_step_*` | 关注面阅读矩阵 | 不提前发明 phase / commit boundary |
| M3 Agent 永久记忆种子 | 固定实现 agent 开工前必须写入的项目级执行规则 | 实施计划 SOP、可落码标准、用户后序任务要求 | 记忆种子表和生成门禁 | 只写执行规则和规范索引,不复制设计 truth |
| M4 仓库 / git / 编码前置 | 固定实现仓路径、git config、Rust 规范、工作区安全和命名检查 | 目录规范、Rust 规范、Step 4 file layout | 前置检查表 | 不使用 `--global`;代码命名不泄漏架构层级 |
| M5 依赖 / 脚本 / 证据路径前置 | 固定本地多仓依赖类型、scripts、artifacts、reports 和 no `latest` | 全局依赖裁剪规则、`05/06` evidence 规则、实施计划规范 | 依赖检查和脚本 / 报告工具检查表 | runtime/event 依赖不得写成 Cargo path dependency |
| M6 回填与影响判定 | 形成正式 `07` §3 回填草稿和后续 Step 影响 | 本 Step M1~M5 | 回填草稿、影响判定、进入下一步条件 | 不写 phase、boundary、BATCH 或具体 gate command |

### 4.1 模块停审记录

| 模块 | 结论 | 说明 |
|---|---|---|
| M1 | 通过 | 必读文档覆盖正式 `00~06`、关键 `03_ddd_step_*` 和标准 |
| M2 | 通过 | 只输出关注面矩阵输入,明确 Step 5~6 后再转为 phase / boundary 矩阵 |
| M3 | 通过 | 记忆种子只保存执行规则、规范路径、刷新触发和冲突处理 |
| M4 | 通过 | git、Rust、workspace、crate、binary 和工作区安全检查闭合 |
| M5 | 通过 | 编译期 / 运行期 / 事件协作依赖区分清楚,scripts/artifacts/reports 路径闭合 |
| M6 | 通过 | 回填草稿只写前置条件和阅读清单,不提前定义实施阶段 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 实施者必须先读哪些文档,分别为了理解什么? | 必须先读正式 `00~06`、本轮 `07` 已完成的 Step 1~3、`03_ddd_step_04_file_layout.md`、`03_ddd_step_17_implementation_handoff.md`、实施计划 SOP / 书写规范、目录组织规范、Rust 编码规范、可落码性标准和全局依赖裁剪规则。 |
| 当前项目使用什么语言和编码规范? | 当前实现语言为 Rust。源码标识符、普通注释、rustdoc 和测试名默认使用英文,并遵守 `standards/coding/rust.md`。 |
| 是否必须阅读提交规范和历史提交? | 必须阅读实施计划书写规范中的 commit / delivery discipline。历史提交用于理解仓内约定,但不得覆盖正式设计和本计划。 |
| 项目级 git `user.name` 和 `user.email` 应如何配置? | 目标实现仓使用项目级配置:`quantalithos-labs` 和 `quantalithos.ai@gmail.com`,不得使用 `--global` 污染全局配置。 |
| 是否有必须先启动或确认的本地服务、数据库、消息系统或外部依赖? | Step 3 只列检查项。P0 默认不要求真实产品端到端;真实 DB / bus / archive / metric / external provider 能力属于后续 Step 8 的环境与依赖准备或 P1 selected-run。 |
| 每个实施阶段或 commit boundary 开工前必须先读哪些正式章节? | 正式 phase / boundary 未定义前,本 Step 先按实现关注面列阅读矩阵输入。Step 5~6 定义 phase / boundary 后,必须把本矩阵转译成具体 boundary 的阅读门禁。 |
| 如果正式文档和 `design-calibration` 表述不一致,以哪个为准? | 以正式 `00~07` 为准;正式文档不清楚时读具体校准文件;仍不清楚时暂停并回设计真相源,不得实现侧补口。 |
| 本仓是否依赖 `/home/aris/Projects` 下的 sibling repo? | 编译期只允许按正式设计引用 core shared contracts;其他相邻能力是运行期或事件协作,不得默认写成 Cargo path dependency。 |
| 目标实现仓目录和 workspace 命名如何检查? | 默认实现仓为 `/home/aris/Projects/quantalithos-identity`;workspace members 为 `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs`;package / crate / binary 必须与 Step 4 file layout 一致。 |
| 是否存在架构层级泄漏风险? | 存在。代码仓内部 package、crate、module、file、type 和 function 不得出现 `L0` / `L1` / `l0_` / `l1_` 这类架构层级命名。 |
| 目标实现仓是否需要 scripts、artifacts 和 reports? | 需要。实施计划必须要求 `scripts/gates`、`scripts/reports`、`scripts/checks`、`scripts/dev`、`artifacts/test/<run_id>` 和 `reports/` 的路径规则进入后续交付物和门禁设计。 |
| 哪些规则必须进入 Agent 永久记忆? | 必须包含正式文档优先、不得实现侧补 schema/port/state、逐 boundary 可落码审计、设计修复后经验总结检查、工作区安全、项目级 git config、Rust/目录/证据路径规范和 no `latest`。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 正式 phase / boundary 尚未定义 | SOP Step 3 要求阶段阅读矩阵,但 Step 5~6 才能正式定义 phase / boundary | 先输出实施关注面阅读矩阵输入,并要求 Step 5~6 后转译 |
| 旧 `07-实施计划.md` | 旧阅读清单含旧版本、旧入口和旧技术假设 | 不继承;重新从新版 `00~06` 和标准抽取 |
| `03-详细设计.md` | 字段级契约在 `design-calibration/03_ddd_step_*` 中 | 阅读清单必须列具体校准文件,不能只读正式摘要 |
| 目录 / crate 命名 | 容易把设计仓 `L1-identity` 泄漏进代码命名 | 前置检查明确代码命名只用 `identity` |
| 依赖类型 | 运行期 / 事件协作依赖容易被写成 Cargo path dependency | 前置依赖检查明确只有编译期依赖可进 Cargo |
| 后序任务经验总结 | 用户要求设计修复后检查经验是否需要沉淀 | 永久记忆种子和交付纪律输入中固定该规则 |

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阅读清单 | 旧 `07` 使用旧版本和旧 ADR / 旧实现术语 | 新版阅读清单以正式 `00~06`、具体校准文件和标准为主 | 防止旧口径进入实现准备 |
| 阶段阅读矩阵 | 尚无新版 phase / boundary,无法形成正式矩阵 | 先输出实施关注面矩阵输入,Step 5~6 后转译 | 遵守一个 Step 一个 Step,不提前发明 phase |
| 永久记忆 | 旧计划没有可机械投影的记忆种子表 | 新增记忆种子、刷新触发、冲突处理和禁止改写 | 防止 agent 自由总结或复制设计 truth |
| git / 编码前置 | 旧计划泛化要求阅读规范 | 明确项目级 git config、Rust 英文源码、rustdoc 和工作区安全 | 可直接执行和复核 |
| 依赖 / 证据路径 | 旧计划缺 run-scoped artifact/report 和 dependency type 检查 | 明确 compile/runtime/event 区分、scripts、artifacts/test/<run_id>、reports/、no `latest` | 支撑后续测试与验收门禁 |

## 8. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否在 Step 3 写正式 phase / boundary 阅读矩阵 | A. 直接假设 phase;B. 先写关注面矩阵输入 | 采用 B。正式 phase / boundary 由 Step 5~6 生成,本 Step 不能提前补 |
| 是否要求实现者通读全部 `design-calibration` | A. 全目录必读;B. 按关注面 / boundary 精准阅读 | 采用 B。全目录泛读成本高且容易把背景当真相源 |
| 是否把记忆种子写成自由总结 | A. 让 agent 自行概括;B. 用可机械投影规则表 | 采用 B。SOP 要求永久记忆只来自种子表 |
| 是否把相邻运行期依赖写成 path dependency | A. 方便实现直接引用;B. 仅编译期依赖可进 Cargo | 采用 B。运行期 / 事件协作必须通过 port / adapter / event / handoff |
| 是否现在固定具体 `<run_id>` | A. Step 3 固定;B. 只固定路径规则 | 采用 B。具体 run 属于后续测试 / 验收执行基线,本 Step 只固定路径与参数规则 |

## 9. 结构化中间产物

### 9.1 实施阅读清单

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求文档 | `projects/L1-identity/00-需求文档.md` | 理解 C-ID、FR、BR、NFR、AC、VETO、数据归属和非范围 | 把相邻 truth、外部正文、认证或 UI 误做进 identity | 能复述 P0 / 非范围和 VETO |
| 架构设计 | `projects/L1-identity/01-架构设计.md` | 理解 truth boundary、依赖方向、data ownership 和运行 / 事件协作 | 形成源码依赖循环或 truth 混层 | 能说明当前 boundary 的依赖类型 |
| 概要设计 | `projects/L1-identity/02-概要设计.md` | 理解主要组成部分、接口骨架、处理流和状态轮廓 | 按文件 / 对象而不是能力主线实施 | 能把交付物回指概要能力 |
| 详细设计 | `projects/L1-identity/03-详细设计.md` | 作为正式实现契约入口 | 只读摘要导致字段、DTO、状态、port 来源缺失 | 能定位到对应 `03_ddd_step_*` |
| 配置设计 | `projects/L1-identity/04-配置设计.md` | 理解 profile、adapter mode、runtime builder、redaction 和 config redline | 配置改变业务不变量或 fake 伪成功 | 能说明 config 只绑定 adapter/参数 |
| 测试方案 | `projects/L1-identity/05-测试方案.md` | 理解 TC、EV、suite、artifact/report、entry/exit 和 evidence 规则 | 实现无法产生正式测试证据 | 能说明当前 boundary 的测试入口来源 |
| 验收标准 | `projects/L1-identity/06-验收标准.md` | 理解 AC/VETO、P0 blocking suite、风险接受和最终裁决 | 通过不具备可验收证据的实现 | 能说明 VETO 和 P0 evidence 影响 |
| 实施计划 Step 1 | `design-calibration/07_implementation_plan_step_01_input_boundary.md` | 理解本轮 `07` 输入基线和旧 `07` 历史地位 | 误用旧 `07` 作为实现计划 | 能说明旧 `07` 不能作为基线 |
| 实施计划 Step 2 | `design-calibration/07_implementation_plan_step_02_scope.md` | 理解本轮实施目标、范围、非范围和 P0/P1/P2 边界 | 范围自然膨胀或误缩小 | 能说明本轮 P0 覆盖范围 |
| 文件布局 handoff | `design-calibration/03_ddd_step_04_file_layout.md` | 理解实现仓、workspace、crate、package、binary 和文件职责 | 代码落错仓 / 错 crate / 错 binary | 能复核 package / crate / binary 命名 |
| 实施承接 handoff | `design-calibration/03_ddd_step_17_implementation_handoff.md` | 理解实现前阅读、关注面矩阵、可落码审计输入和红线 | 实现者现场补 schema / port / state | 能说明当前 boundary 的审计输入 |
| 实施计划 SOP | `standards/document/实施计划讨论流程_SOP.md` | 理解 Step 1~13、phase / commit boundary 小循环和停审规则 | 实施计划退化成任务清单 | 能说明当前 Step 输出和下一步条件 |
| 实施计划书写规范 | `standards/document/实施计划书写规范.md` | 理解正式 13 章、BATCH、GATE、证据和提交纪律 | 正式 `07` 不可追溯或不可执行 | 能说明 phase / boundary / gate 写法 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` | 理解逐 Step、模块化、分批写作和正式追溯 | 一次性写大文档或未来 Step 文件 | 能说明本 Step 的模块计划 |
| 可落码性标准 | `standards/document/设计真相源闭环与可落码性标准.md` | 理解字段、DTO、状态、phase boundary 和 §九经验复核 | 实现阶段持续遇到 schema / port / 状态 blocker | 能逐 boundary 选择适用复核项 |
| 目录组织规范 | `standards/document/子项目目录与代码文件组织规范.md` | 理解设计仓 / 实现仓 / workspace / scripts / reports 目录规则 | 架构层级泄漏进代码命名或脚本目录错放 | 能执行目录和命名检查 |
| Rust 编码规范 | `standards/coding/rust.md` | 理解英文源码、命名、rustdoc、格式和代码实践 | 源码注释或命名不符合项目要求 | 能说明 Rust 源码语言和文档注释规则 |
| 全局依赖裁剪规则 | `standards/document/全局项目依赖关系与裁剪规则.md` | 理解 compile/runtime/event 依赖类型区分 | 把运行期或事件协作写成 Cargo path dependency | 能输出依赖类型分类表 |

### 9.2 实施关注面阅读矩阵输入

> 本表是 Step 5~6 生成正式 phase / commit boundary 阅读矩阵的输入。当前不定义 phase 或 boundary。

| 实施关注面 | 必读正式章节 | 必读 `design-calibration` | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| scope / non-scope | `00` §7~§14;`03` §2;`06` §2 | `07_implementation_plan_step_01_input_boundary.md`;`07_implementation_plan_step_02_scope.md`;`03_ddd_step_02_scope.md` | 确认 P0 范围、非范围、P1/P2 和 VETO | 能说明当前 work 不扩域、不误缩域 |
| workspace / crate / file layout | `03` §4 | `03_ddd_step_04_file_layout.md` | 确认目标仓、workspace、package、crate、binary、file owner | 代码落点与正式布局一致 |
| module ownership | `03` module contracts | `03_ddd_step_05_module_contracts.md`;`03_ddd_step_17_implementation_handoff.md` | 确认 contracts/domain/application/infra/api/worker/jobs 责任和依赖 | 不发生跨层反向依赖 |
| object / field / invariant | `03` object contracts | `03_ddd_step_06_object_contracts.md`;`设计真相源闭环与可落码性标准.md` §九 | 确认字段来源、factory、state、policy、guard、不变量 | 不需要实现者补字段或默认值 |
| port / adapter / fake parity | `03` trait / port contracts | `03_ddd_step_07_trait_port_adapter_contracts.md` | 确认 repository、resolver、publisher、handoff、report、UoW、fake parity | 不新增私有 port 或 fake private map |
| protocol surface | `03` protocol contracts | `03_ddd_step_08_protocol_contracts.md` | 确认 Command / Query / Consumer / Outbound / Job DTO、receipt、report | DTO 能构造目标对象或正式 read surface |
| application flow | `03` function flows | `03_ddd_step_09_function_flows.md` | 确认 accepted/rejected/duplicate/no-write/job no-repair/outbox/handoff 顺序 | UoW、stored replay、副作用顺序闭合 |
| state matrix | `03` state matrix;`06` §8 | `03_ddd_step_10_state_matrix.md` | 确认状态主语、状态名、合法/非法迁移和 public marker | 测试/验收/实现使用同一状态词表 |
| persistence / transaction | `03` persistence chapter | `03_ddd_step_11_persistence_transaction_consistency.md` | 确认 logical store、key/index/version、same-UoW、rollback、fake parity | expected version 和 stored replay 来源闭合 |
| error / recovery | `03` error chapter | `03_ddd_step_12_error_recovery.md` | 确认 error owner、public mapping、recovery marker、retryable/terminal | 不解析错误字符串或自行新增 public error |
| concurrency / idempotency | `03` concurrency chapter | `03_ddd_step_13_concurrency_idempotency.md` | 确认 idempotency key/digest、duplicate replay、in-flight、commit unknown | duplicate 不重跑 mutation/job body |
| config / external binding | `03` config binding;`04` | `03_ddd_step_14_config_external_binding.md`;`04_config_step_*.md` | 确认 raw config owner、profile、adapter、runtime builder、redline | config 不改变业务不变量 |
| observability / audit / redaction | `03` observability;`06` §10~§11 | `03_ddd_step_15_observability_audit.md` | 确认 log/metric/audit/report/handoff、forbidden material | 观测材料只含 safe refs/kinds/issues |
| test / evidence / acceptance | `05`;`06` | `03_ddd_step_16_test_cuts.md`;`05_test_plan_step_09_automation_gates.md`;`05_test_plan_step_13_evidence.md`;`06_acceptance_step_10_evidence_audit.md`;`06_acceptance_step_11_blockers.md` | 确认 TC、EV、suite、artifact/report、AC/VETO 入口 | 当前 boundary 有正式门禁和证据路径 |
| implementation handoff | 正式 `07` 当前章节 | `03_ddd_step_17_implementation_handoff.md`;当前 `07_implementation_plan_step_*` | 确认 boundary 审计、暂停、引用和冲突处理 | 不由实现者现场选边或补口 |

### 9.3 Agent 永久记忆种子表

| 记忆 ID | 适用范围 | 类别 | 必须写入的记忆文本 | 规范路径来源 | 来源文档 | 来源章节 | 刷新触发 | 失效条件 | 冲突处理 | 禁止改写 |
|---|---|---|---|---|---|---|---|---|---|---|
| MEM-ID-001 | project | 设计基线 | L1-identity 实现必须以正式 `00~07` 为基线;正式文档不清楚时读对应 `design-calibration` 文件,仍不清楚时暂停并回设计真相源。 | 不适用 | `07-实施计划.md` | §3 | 项目首次开工 / 正式文档变更 | 被新版 `07` 替代 | 正式文档优先 | 是 |
| MEM-ID-002 | phase / commit-boundary | 可落码边界 | 每个 phase / commit boundary 开工前必须复核字段、DTO、状态、phase boundary、证据和命名闭环,并选择可落码标准 §九适用经验项给出结论。 | `设计真相源闭环与可落码性标准.md` | `07-实施计划.md` | §3 / §6 | 每个 boundary 开工前 | boundary 完成 | 有 blocker 则回写设计 | 是 |
| MEM-ID-003 | project | 禁止补口 | 实现 agent 不得自行补 schema、port、状态、DTO、mapper、config key、test/evidence 或 phase scope;发现缺口必须暂停并报告具体设计位置。 | `设计真相源闭环与可落码性标准.md` | `07-实施计划.md` | §3 / §10 | 遇到 design gap | until superseded | 暂停优先 | 是 |
| MEM-ID-004 | project | 工作区安全 | 不得覆盖用户未提交改动;只改当前 boundary 相关文件;正式设计仓和实现仓路径必须先确认。 | 不适用 | `07-实施计划.md` | §3 / §11 | 每次开工 / 提交前 | until superseded | 发现冲突先停 | 是 |
| MEM-ID-005 | project | 目录命名 | 目标实现仓默认 `/home/aris/Projects/quantalithos-identity`;代码内部使用 `identity` slug,不得把 `L0` / `L1` 等架构层级写进 package、crate、module、file 或 type 名。 | `子项目目录与代码文件组织规范.md` | `07-实施计划.md` | §3 | 新建仓 / 新建 crate / 新建文件 | until superseded | 以详细设计布局为准 | 是 |
| MEM-ID-006 | project | Rust 规范 | Rust 源码标识符、普通注释、rustdoc 和测试名默认使用英文;公开 API 和 enum variant 必须有文档注释。 | `standards/coding/rust.md` | `07-实施计划.md` | §3 | 编写 Rust 代码前 | until superseded | Rust 规范优先 | 是 |
| MEM-ID-007 | project | 依赖裁剪 | 只有编译期依赖可写 Cargo path dependency;运行期和事件协作依赖必须通过 port、adapter、event、handoff 或 config binding 表达。 | `全局项目依赖关系与裁剪规则.md` | `07-实施计划.md` | §3 | 新增依赖前 | until superseded | 先分类依赖类型 | 是 |
| MEM-ID-008 | project | 证据路径 | 测试 artifact root 固定为 `artifacts/test/<run_id>`,report root 固定为 `reports/`;正式交付不得引用 `latest`。 | `实施计划书写规范.md` | `07-实施计划.md` | §3 / §7 | 新增 gate/report/check 脚本前 | until superseded | 以 `05/06` 为准 | 是 |
| MEM-ID-009 | project | 设计修复后经验 | 修复设计文档后必须显式判断是否需要总结可复用经验;需要时补标准 / SOP / 项目记忆并添加具体示例,再继续后序任务。 | `实施计划讨论流程_SOP.md` | `07-实施计划.md` | §3 / §11 | 每次设计 blocker 修复后 | until superseded | 同项目变更优先合并提交 | 是 |

### 9.4 Agent 永久记忆生成门禁

| 检查项 | 通过标准 | 失败处理 |
|---|---|---|
| 种子表存在 | `07-实施计划.md` §3 明确给出 MEM-ID-* 种子表 | 不生成永久记忆,暂停并补实施计划 |
| 只写表内内容 | 永久记忆逐条来自种子表 `必须写入的记忆文本` | 删除自由总结内容并回到种子表 |
| 来源完整 | 每条记忆有来源文档、来源章节、刷新触发和冲突处理 | 不写入该条记忆 |
| 不复制设计 truth | 不写 DTO 字段表、状态矩阵、业务规则正文 | 删除该内容,改为索引正式文档 |
| 技术栈不硬编码到通用标准 | Rust 规范路径来自本项目阅读清单 | 暂停并补阅读清单 |
| 交付实现前审计 | 种子表包含按 phase / commit boundary 审计正式 `03/05/06/07` 的规则 | 暂停并补种子表 |
| 设计修复后经验检查 | 种子表包含设计修复后检查可复用经验的规则 | 暂停并补种子表 |

### 9.5 git / 编码规范确认清单

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| 项目级 git user.name | `quantalithos-labs` | 在目标实现仓执行 `git config user.name` | 使用项目级配置修正,不得 `--global` |
| 项目级 git user.email | `quantalithos.ai@gmail.com` | 在目标实现仓执行 `git config user.email` | 使用项目级配置修正,不得 `--global` |
| Rust 源码语言 | 标识符、注释、rustdoc、测试名默认英文 | review / lint / 人工检查 | 修改源码文本 |
| rustfmt / clippy | 作为工具门禁,但不替代编码规范 | 后续实现仓 gate | 工具失败不得提交 |
| public rustdoc | public struct/enum/variant/trait/function 有 `///` 或 crate/module `//!` | review / docs check | 补文档注释 |
| unsafe | 默认不使用 | 搜索 `unsafe` | 需要单独设计不变量和测试切口 |

### 9.6 代码仓目录与命名前置检查表

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-identity` | 检查目录名 | 暂停并回报目录偏离 |
| workspace member | `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs` | 检查 root `Cargo.toml` 和目录 | 暂停并回写实施或详细设计 |
| Cargo package | `identity-contracts` 等 `<project>-<role>` | 检查 member `Cargo.toml` | 暂停并修正命名 |
| Rust lib crate | `identity_contracts` 等 `<project>_<role>` | 检查 `[lib].name` | 暂停并修正命名 |
| binary | `identity-api`、`identity-worker` 和 job action 名 | 检查 `[[bin]].name` 或 bin 文件 | 暂停并修正命名 |
| 架构层级泄漏 | 代码命名中不出现 `L0` / `L1` / `l0_` / `l1_` | 搜索 package / crate / module / file | 暂停并回报偏离 |

### 9.7 本地多仓依赖前置检查表

| 关联能力 | 全局依赖类型 | 本地路径 / 协作方式 | 当前引用方式 | 检查方式 | 不存在时处理 |
|---|---|---|---|---|---|
| core shared contracts | 编译期依赖 | `/home/aris/Projects/quantalithos-core/crates/contracts` | Cargo workspace dependency `core-contracts` | 检查目录和 `Cargo.toml` | 暂停并回报缺失 |
| event bus 主干 | 事件协作依赖 | 通过 publisher / consumer adapter | 不写 Cargo path dependency | 检查 port / adapter | 使用 fake / controlled adapter 或记录 P1 |
| role / capability source | 运行期 / 事件协作 | resolver / source event adapter | 不写 Cargo path dependency | 检查 resolver port | 不可用时 degraded / pending / report-only |
| work source facts | 运行期 / 事件协作 | resolver / event adapter | 不写 Cargo path dependency | 检查 port / fixture | 不可用时 delayed / report-only |
| lifecycle basis source | 运行期 / 事件协作 | basis resolver / safe marker | 不写 Cargo path dependency | 检查 resolver port | 缺 basis 不 accepted |
| memory / archive | 运行期 / 事件协作 | handoff / callback / resolver | 不写 Cargo path dependency | 检查 adapter / receipt | 不可用时 pending / failed marker |
| observability / archive reports | 运行期 / 事件协作 | report writer / handoff adapter | 不写 Cargo path dependency | 检查 adapter | 记录 unavailable / residual |

### 9.8 测试脚本与报告工具前置检查表

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| gate scripts | `scripts/gates/*.sh` | 检查目标实现仓目录和脚本命名 | 作为后续交付物或 blocker 记录 |
| report scripts | `scripts/reports/*.sh` | 检查目标实现仓目录和脚本命名 | 作为后续交付物或 blocker 记录 |
| check scripts | `scripts/checks/*.sh` | 检查目标实现仓目录和脚本命名 | 作为后续交付物或 blocker 记录 |
| dev scripts | `scripts/dev/*.sh` | 检查是否存在开发辅助入口 | 可选,不得替代 gate |
| artifact root | `artifacts/test/<run_id>` | 检查脚本默认值 / 参数 | 修正路径口径 |
| report root | `reports/` and `reports/runs/<run_id>` | 检查生成脚本输出 | 修正路径口径 |
| acceptance reports | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` | 检查 report generator / handoff plan | 后续 Step 7 / Step 12 闭合 |
| formal run ref | 固定 `<run_id>`,不使用 `latest` | 搜索脚本 / 文档 | 暂停并修正 |
| CLI / env precedence | CLI args > environment variables > defaults | 检查脚本参数设计 | 后续实现脚本时修正 |

## 10. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 本 Step 不新增设计契约,只整理阅读和前置检查 | 否 | 承接实施计划 SOP | 无需回写 `03/04/05/06` |
| 正式 phase / boundary 阅读矩阵尚不能最终生成 | 是 | 依赖 Step 5~6 | Step 5~6 定义 phase / boundary 后必须转译本 Step §9.2 |
| 永久记忆种子需要进入正式 `07` §3 | 是 | 实现 agent 开工前门禁 | Step 13 装配正式文档 |
| scripts / artifacts / reports 目录规则需要进入后续交付物和门禁 | 是 | Step 4 / Step 7 输入 | 后续 Step 抽取为交付物和 gate |
| 依赖类型分类会影响 Cargo dependency 规划 | 是 | Step 4 / Step 8 输入 | 后续不得把运行期 / 事件协作写成 path dependency |
| 目标实现仓真实状态尚未检查 | 是 | 实现移交前风险 | Step 4 抽取交付物、Step 12 完成判定时继续确认 |

## 11. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“模块计划 / 模块目录”“实施阅读清单”“实施关注面阅读矩阵输入”“Agent 永久记忆种子表”和“前置检查表”小节,了解实施前置条件如何从正式 `00~06`、详细设计 handoff 和标准收敛。

正式 `07-实施计划.md` §3 应回填:

- 实施者开工前必须阅读正式 `00~06`、本轮 `07` 已完成的校准产物、`03_ddd_step_04_file_layout.md`、`03_ddd_step_17_implementation_handoff.md`、实施计划 SOP / 书写规范、可落码性标准、目录组织规范、Rust 编码规范和全局依赖裁剪规则。
- 正式 phase / commit boundary 定义前,本章先提供“实施关注面阅读矩阵输入”;Step 5~6 生成 phase / boundary 后必须转译为真正的阶段阅读矩阵。
- 实现 agent 的永久记忆只能来自本章 MEM-ID-* 种子表,不得自由总结或复制详细设计 truth。
- 目标实现仓默认 `/home/aris/Projects/quantalithos-identity`,项目级 git user 为 `quantalithos-labs <quantalithos.ai@gmail.com>`,不得使用 `--global`。
- Rust 源码标识符、普通注释、rustdoc 和测试名默认英文;代码内部使用 `identity` slug,不得出现架构层级泄漏。
- 只有编译期依赖可以进入 Cargo path dependency;运行期和事件协作依赖必须通过 port、adapter、event、handoff 或 config binding 表达。
- scripts、artifacts 和 reports 必须使用 `scripts/gates`、`scripts/reports`、`scripts/checks`、`scripts/dev`、`artifacts/test/<run_id>` 和 `reports/`,正式交付不得引用 `latest`。

## 12. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓 `/home/aris/Projects/quantalithos-identity` 的真实当前状态尚未检查 | 影响 Step 4 交付物和迁移任务 | Step 4 继续抽取,实现移交前必须 reality check |
| 真实 phase / commit boundary 尚未定义 | 影响最终阶段阅读矩阵 | Step 5~6 定义后转译 §9.2 |
| scripts / gates / reports / checks 是否已有旧实现 | 影响 Step 4 交付物和 Step 7 门禁 | Step 4 / Step 7 检查 |
| P1 selected-run 环境是否存在 | 影响 Step 8 / Step 9 | 不影响 P0;后续记录 optional / residual |
| 永久记忆实际写入动作是否由后续 agent 执行 | 影响实现 agent 开工 | 本 Step 只提供种子和门禁,不执行外部记忆写入 |

## 13. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 必读正式文档和标准已列出 | 通过 | 见 §9.1 |
| 实施关注面阅读矩阵输入已列出 | 通过 | 见 §9.2;正式 phase / boundary 矩阵待 Step 5~6 转译 |
| Agent 永久记忆种子和生成门禁已列出 | 通过 | 见 §9.3 / §9.4 |
| git / Rust / 命名 / 工作区前置检查已列出 | 通过 | 见 §9.5 / §9.6 |
| 依赖 / 脚本 / artifact / report 前置检查已列出 | 通过 | 见 §9.7 / §9.8 |
| 未提前定义 phase / commit boundary | 通过 | 本 Step 只提供输入 |
| 可进入 Step 4 | 通过 | 下一步:抽取实施对象与交付物 |
