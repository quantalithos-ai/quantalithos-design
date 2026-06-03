# 实施计划讨论流程_SOP

> 目标：定义“实施计划内容如何生成”，用于把已收稳的详细设计、测试方案和验收标准转译成可执行、可验证、可提交的实施路径。
> 适用对象：人类作者、Claude/其他 Agent、多人协作讨论。
> 与 `实施计划书写规范.md` 的关系：书写规范负责定义最终结果结构；本 SOP 负责定义每一步如何讨论、收敛和回填。
> 与 `设计文档讨论中间产物规范.md` 的关系：本 SOP 定义每一步问什么；中间产物规范定义每一步讨论后留下什么、如何确认、如何回填。

---

## 修订记录

| 版本 | 日期 | 讨论主题 | 修订内容 |
|---|---|---|---|
| v0.10 | 2026-05-30 | 编码前设计闭环复核讨论规则 | 在 Step 1 / 6 / 10 / 12 / 13 补充字段、DTO、状态、证据和 phase boundary 开工前复核要求 |
| v0.11 | 2026-06-03 | 可落码性开工门禁统一 | 将开工前设计闭环复核统一引用 `设计真相源闭环与可落码性标准.md`，补充 ref identity、validation truth、metadata/idempotency、projection rebuild 和 artifact materialization 讨论项 |
| v0.9 | 2026-05-29 | 测试证据、报告生成与脚本目录讨论规则 | 在 Step 3 / 7 / 11 / 12 补充 scripts、artifacts/test/<run_id>、reports/runs/<run_id> 和 reports/acceptance 的输入输出 |
| v0.8 | 2026-05-29 | 代码仓目录与命名前置讨论规则 | 在 Step 3 补充实现仓目录、workspace member、Cargo package、Rust crate 和 binary 命名检查 |
| v0.7 | 2026-05-29 | 本地多仓依赖实施讨论规则 | 在 Step 3 / Step 8 补充 `/home/aris/Projects` sibling repo、编译期 path dependency、依赖检查和不可用时处理的输入输出 |
| v0.6 | 2026-05-29 | 补充阶段实施前阅读矩阵 | 在 Step 3 要求把正式章节校准来源转译为按阶段 / commit boundary 的 `design-calibration` 必读门禁，并明确冲突处理规则 |
| v0.5 | 2026-05-28 | 收紧实现仓 commit message 讨论规则 | 按实践结论补充英文 commit、固定 `type(scope): subject`、一笔提交对应一个 §6 commit boundary、body 按子功能分组、文件名与改动量标记、footer 空行和 `git commit -F` 规则 |
| v0.4 | 2026-05-28 | 补充代码实现批次讨论规则 | 在 Step 6 增加代码批次问题、输出表和批次规模门禁，约束大段代码按可验证切片分批实现 |
| v0.3 | 2026-05-28 | 补充通用执行纪律 | 对齐中间产物规范，补充逐 Step、删除旧文件重建、校准来源追溯和长文档分批写作纪律及正反例 |
| v0.2 | 2026-05-26 | 提交规范讨论约束补强 | 按旧版 commit 规范完整补齐提交粒度、message 结构、Type / Scope、body 格式、footer、示例、自检清单和设计仓 / 实现仓语言边界的讨论输入输出 |
| v0.1 | 2026-05-26 | 实施计划流程骨架定稿 | 建立以“实施前置条件、阶段顺序、提交边界、测试验收门禁”为主轴的实施计划讨论流程 |

---

## 1. 适用前提

本 SOP 适用于：

```text
需要为一个仓 / 一个模块 / 一个子系统编写 07-实施计划.md
且希望先通过讨论逐步收敛实施路径，再落正式文档
```

进入本 SOP 前，原则上应已经具备：

- `00-需求文档.md`
- `01-架构设计.md`
- `02-概要设计.md`
- `03-详细设计.md`
- `05-测试方案.md`
- `06-验收标准.md`

如果其中某份文档尚未存在，必须在 Step 1 中记录缺口，并判断是否允许继续。

它不适用于：

```text
重新定义需求、架构或详细设计
替代测试方案或验收标准
编写个人日程表
编写完整部署运维手册
跳过设计直接规划编码
```

---

## 2. 核心原则

### 2.1 先确认输入，后安排实施

实施计划必须从已收稳的上游文档出发。详细设计不完整时，不应靠实施计划补设计。

### 2.2 先前置条件，后阶段拆分

实施者必须先确认阅读清单、编码规范、提交规范、git 配置和本地环境，再进入阶段计划。

### 2.3 先可验证增量，后任务清单

阶段拆分必须围绕可验证功能增量，而不是对象、函数、文件或个人待办。

### 2.4 测试和验收前置嵌入

每个阶段都必须说明测试门禁。涉及外部可见行为、状态转换、数据一致性或跨仓交互的阶段，还必须说明验收门禁。

### 2.5 提交边界先设计

实施计划必须提前定义提交边界。提交边界应服务于 review、回退和证据审查，而不是事后按当天工作量随意切分。

### 2.6 中间产物先于正式文档

每个 Step 不得直接跳到正式 `07-实施计划.md`。

执行链路必须是：

```text
本步输入
  -> 应问的问题
  -> SOP 问题回答
  -> Step 中间产物
  -> 回填草稿
  -> 用户确认 / 门禁通过
  -> 正式文档章节
```

Step 中间产物必须遵循 `standards/document/设计文档讨论中间产物规范.md`，至少包含：

- Step 状态
- 本步输入
- SOP 问题回答
- 当前文档问题诊断
- 改动前后对比
- 设计取舍
- 结构化中间产物
- 回填草稿
- 待确认事项
- 进入下一步条件

如果用户要求逐步讨论或逐步划掉，必须先在对应子项目内建立 `design-calibration/07_implementation_plan_calibration_flow.md` 工作台文件，并在每个 Step 完成后更新状态。

### 2.7 ASCII 图输出统一

凡是本 SOP 中要求或允许输出 ASCII 图的 Step，都必须在讨论阶段同时收稳：

```text
图类型
图标题
ASCII 图正文
图后 2~5 条关键说明
```

讨论阶段禁止只说“画一个图”或只输出裸图。所有 ASCII 图必须遵守 `实施计划书写规范` 4.2 `ASCII 图统一格式`。

产图 Step 的最小输出结构为：

````md
#### <图类型>: <图标题>

```text
<ASCII 图正文>
```

关键说明：
- <图表达了什么实施关系>
- <图没有表达哪些详细设计内容>
- <图中最容易误解的边界是什么>
````

如果某一步按需可画图但本轮不画，必须说明“不画图的原因”，不能留下空图占位。

### 2.8 通用执行纪律

实施计划讨论必须遵守 `设计文档讨论中间产物规范.md` 的“通用执行纪律”：

- 严格按 Step 独立执行，不得合并 Step。
- 明确要求重写 / 重建 / 替换旧文件时，先删除旧文件，再按新文件标准创建。
- 正式 `07-实施计划.md` 的章节必须能追溯到具体 `design-calibration/...` 中间产物。
- 长文档先建骨架，再按 Step 或章节分批写入。
- 单次写入以 100~300 行为宜；预计超过 300 行应拆分；预计超过 500 行必须拆分。
- 实施输入、前置条件、实施对象、阶段顺序、提交边界、测试验收门禁和提交纪律等 Step 必须分别收敛。

正确示例：

```text
Step 3 单独收稳阅读清单、编码规范、提交规范和 git 配置。
Step 5 单独设计实施阶段与依赖顺序。
Step 6 单独拆分阶段任务和提交边界。
正式 07-实施计划.md 每章标注对应校准来源。
```

错误示例：

```text
把 Step 3~Step 7 合并成“实施步骤列表”。
在实施计划中补写详细设计缺失的对象和函数。
在旧 07-实施计划.md 上直接追加新版提交规范。
一次性写入 700 行实施任务。
```

错误原因：

- 实施计划只能承接上游，不能替代详细设计。
- 阶段任务、提交边界和测试验收门禁混写会影响 review、回退和验收证据。
- 旧提交纪律和新版实现仓纪律容易冲突。

### 2.9 实施前必须确认设计可 1:1 落码

实施计划不是让实现者替设计文档补缺口。每个 phase / commit boundary 开工前，必须确认字段、DTO、状态、测试、验收和 phase boundary 已经闭环。

本节必须按 `standards/document/设计真相源闭环与可落码性标准.md` 执行。该标准是开工前可落码性门禁的统一判断口径；本 SOP 只规定这些门禁如何进入实施计划讨论、阶段拆分和暂停规则。

正确示例：

```text
commit-04-b 开工门禁:
  - DTO 能构造 PublicationMaterial。
  - core_event_ref 与 core_event_envelope_ref 已在详细设计中区分。
  - 本阶段不依赖 PH-05 feedback result。
  - 测试和验收使用详细设计正式状态名。
  - metadata / idempotency / outbox id 的来源已闭合。
  - 当前阶段涉及的 projection 和 artifact 均有 truth source 或 materialization 口径。
```

错误示例：

```text
先让实现者开始写，遇到字段缺失时在代码里临时补。
状态名以测试里能跑通为准。
当前 phase 先调用后续 phase 的结果，后面再拆。
```

错误原因：

- 实现者被迫自行做设计取舍。
- phase boundary 失效，提交边界不可审查。
- 代码、测试和验收会继续沿用不同真相源。

如果 `设计真相源闭环与可落码性标准.md` §九的任一适用项未通过，实施计划必须把该项标为 blocker，并要求先回写设计真相源；不得把“实现时再确认”作为开工门禁通过条件。

---

## 3. Step 模板字段

每个 Step 都由以下字段组成：

| 字段 | 作用 |
|---|---|
| 本步目标 | 定义本步存在的意义，说明这一步要解决什么实施问题。 |
| 本步输入 | 定义本步开始前必须具备的上游结论或前一步中间产物。 |
| 本步输出 | 定义本步必须收敛出的结果类型。 |
| 应问的问题 | 用于把输入收敛成输出的问题集合，不是独立问卷。 |
| 期望产出 | 本步应交付的具体结论项，是对“本步输出”的展开。 |
| 回填位置 | 指明本步产出最终写入的正式实施计划章节。 |
| 执行约束 | 规定本步过程中哪些做法允许，哪些做法禁止。 |
| 进入下一步的条件 | 判断本步是否完成的门槛。 |

### 执行顺序

```text
本步目标
  -> 本步输入
  -> 本步输出
  -> 应问的问题
  -> 执行约束
  -> 期望产出
  -> 回填位置
  -> 进入下一步的条件
```

---

## 4. 建议的讨论总流程

```text
Step 1. 确认实施输入边界
Step 2. 明确实施目标、范围和非范围
Step 3. 收稳前置条件与阅读清单
Step 4. 抽取实施对象与交付物
Step 5. 设计实施阶段与依赖顺序
Step 6. 拆分阶段任务、编写顺序与提交边界
Step 7. 嵌入测试与验收门禁
Step 8. 定义配置、环境与外部依赖准备
Step 9. 定义 Spike、风险与待确认事项
Step 10. 定义回退、暂停与变更控制
Step 11. 定义提交、评审与交付纪律
Step 12. 定义实施完成判定
Step 13. 整理正式实施计划文档
```

---

## 5. 每一步的讨论目标、输入与产出

### Step 1. 确认实施输入边界

#### 本步目标

确认当前实施计划依赖的需求、架构、概要、详细、测试方案和验收标准是否已收稳到足以制定实施路径，并识别缺失文档、版本不一致和不可继续的输入风险。

#### 本步输入

- 当前仓的 `00-需求文档.md`
- 当前仓的 `01-架构设计.md`
- 当前仓的 `02-概要设计.md`
- 当前仓的 `03-详细设计.md`
- 当前仓的 `05-测试方案.md`
- 当前仓的 `06-验收标准.md`
- 已知 ADR、编码规范、提交规范和仓库约束

#### 本步输出

- 实施输入边界表
- 缺失输入风险表
- 是否允许进入实施计划讨论的结论

#### 应问的问题

1. 当前仓是否已经具备完整的 00 / 01 / 02 / 03 / 05 / 06 文档。
2. 哪些上游文档版本是本轮实施计划的基线。
3. 详细设计是否已经足以支持 1:1 实现。
4. 测试方案和验收标准是否足以定义阶段门禁。
5. 是否存在上游文档之间的冲突。
6. 详细设计是否已经完成字段闭环、DTO 构造闭环、状态闭环和 phase boundary 复核。
7. 测试方案和验收标准是否使用详细设计正式字段、状态、接口和证据名称。
8. 哪些缺口会阻塞实施计划，哪些缺口可以记录为风险继续推进。

#### 期望产出

| 上游文档 | 版本 / 路径 | 本计划如何使用 | 状态 | 风险 |
|---|---|---|---|---|
| `03-详细设计.md` | v0.x | 提供实现契约 | 已确认 / 缺失 / 冲突 | <风险说明> |

| 闭环复核项 | 来源 | 状态 | 阻塞范围 | 处理 |
|---|---|---|---|---|
| 字段闭环 | `03-详细设计.md` | 已确认 / 冲突 / 缺失 | PH-xx | 继续 / 暂停 |
| 状态闭环 | `03` / `05` / `06` | 已确认 / 冲突 / 缺失 | PH-xx | 继续 / 暂停 |

#### 回填位置

- `07-实施计划.md` §1 与上游文档的关系声明
- `design-calibration/07_implementation_plan_calibration_flow.md` Step 1 中间产物

#### 执行约束

- 不允许在本步补写详细设计。
- 不允许用“后续再看”跳过上游缺失。
- 如果详细设计缺少关键实现契约，必须记录为 blocker 或限定实施范围。
- 如果字段、DTO、状态或 phase boundary 存在冲突，不能要求实现者自行选边，必须暂停并回写设计真相源。

#### 进入下一步的条件

- 上游输入基线明确。
- 缺失或冲突项已分类为 blocker / risk / deferred。
- 用户确认可以继续讨论实施目标与范围。

### Step 2. 明确实施目标、范围和非范围

#### 本步目标

明确本轮实施要交付什么、不交付什么，以及哪些需求、设计和验收项属于本轮覆盖范围。

#### 本步输入

- Step 1 的输入边界结论
- 需求文档中的用户故事和功能需求
- 详细设计中的实现单元和接口契约
- 验收标准中的 AC 项和一票否决项

#### 本步输出

- 实施目标表
- 实施范围表
- 非范围表

#### 应问的问题

1. 本轮实施的最小可交付结果是什么。
2. 哪些需求编号必须覆盖。
3. 哪些详细设计章节必须落地。
4. 哪些验收项必须在本轮可判定。
5. 哪些能力明确不在本轮实施。
6. 是否存在 P1 / P2 能力容易被误做进 P0。

#### 期望产出

| 类别 | 内容 | 来源 | 是否本轮实施 | 说明 |
|---|---|---|---|---|
| 功能能力 | <能力名称> | FR-xxx / DD-xxx / AC-xxx | 是 / 否 | <说明> |

#### 回填位置

- `07-实施计划.md` §2 实施目标与范围

#### 执行约束

- 范围必须能追溯到上游编号。
- 不允许新增上游不存在的需求。
- 非范围必须显式写出。

#### 进入下一步的条件

- 本轮目标、范围和非范围均已明确。
- 用户确认不会在实施阶段自然膨胀。

### Step 3. 收稳前置条件与阅读清单

#### 本步目标

定义实施者开始编码前必须完成的阅读、配置、工具和环境检查，避免未读设计、未读规范或错误 git 配置导致返工。

#### 本步输入

- Step 1 的上游文档清单
- Step 2 的实施范围
- 项目编码规范和提交规范
- 目标语言、工具链和仓库约定
- `/home/aris/Projects` 下的本地 sibling repo 布局
- `standards/document/子项目目录与代码文件组织规范.md`
- 详细设计中的目录 / package / crate / binary 映射表

#### 本步输出

- 阅读清单
- 阶段实施前阅读矩阵
- git 配置检查清单
- 编码规范确认清单
- 工具与环境前置检查表
- 代码仓目录与命名前置检查表
- 本地多仓依赖前置检查表
- 测试脚本与报告工具前置检查表

#### 应问的问题

1. 实施者必须先读哪些文档，分别为了理解什么。
2. 当前项目使用什么语言和编码规范。
3. Rust 项目是否已明确 `standards/coding` 下的 Rust 编码规范。
4. 是否必须阅读提交规范和历史提交。
5. 项目级 git `user.name` 和 `user.email` 应如何配置。
6. 是否有必须先启动或确认的本地服务、数据库、消息系统或外部依赖。
7. 每个实施阶段或 commit boundary 开工前，必须先读哪些正式章节。
8. 这些正式章节引用了哪些 `design-calibration` 中间产物，其中哪些会影响当前阶段实现判断。
9. 如果正式文档和 `design-calibration` 表述不一致，实施者应该以哪个为准，何时暂停回报设计缺口。
10. 本仓是否依赖 `/home/aris/Projects` 下已经实现的 sibling repo？
11. 对已确认的编译期依赖，当前应使用本地 path dependency，还是已经具备 private git tag / rev 的中期条件？
12. 目标实现仓目录是否为 `/home/aris/Projects/quantalithos-<project>`？
13. workspace member 目录、Cargo package、Rust crate 和 binary 名是否与详细设计一致？
14. 是否存在 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名？
15. 目标实现仓是否需要创建 `scripts/gates/`、`scripts/reports/`、`scripts/checks/` 和 `scripts/dev/`？
16. 目标实现仓是否需要创建或保留 `artifacts/test/<run_id>` 和 `reports/`？
17. 哪些 gate / report / check 脚本是本轮实施交付物？
18. 这些脚本是否必须支持 `--run-id`、`--artifact-root`、`--config-profile`？
19. 是否明确禁止 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式引用 `latest`？

#### 期望产出

阅读清单：

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| <文档名> | <路径> | <目的> | <风险> | <确认方式> |

阶段实施前阅读矩阵：

| 阶段 / commit boundary | 必读正式章节 | 必读 `design-calibration` | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| PH-xx / commit-xx-a | `<repo>/03-详细设计.md` §x | `design-calibration/<step-file>.md` | <该文件影响的实现判断> | <可审查的开工前确认方式> |

git 配置：

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

代码仓目录与命名前置检查表：

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-<project>` | 检查目录名 | 暂停并回报目录偏离 |
| workspace member 目录 | `crates/<role>` | 检查 `crates/` | 暂停并回报命名偏离 |
| Cargo package | `<project>-<role>` | 检查 `Cargo.toml` `[package].name` | 暂停并回报命名偏离 |
| Rust library crate | `<project>_<role>` | 检查 `Cargo.toml` `[lib].name` | 暂停并回报命名偏离 |
| binary 名 | `<project>` 或 `<action_name>` | 检查 `[[bin]].name` | 暂停并回报命名偏离 |
| 架构层级泄漏 | 代码命名中不出现 `L0` / `L1` / `l0_` / `l1_` | 搜索 package / crate / module / file | 暂停并回报设计或实现偏离 |

本地多仓依赖前置检查表：

| 依赖仓库 | 全局依赖类型 | 本地路径 | 当前引用方式 / 协作方式 | 检查方式 | 不存在时处理 |
|---|---|---|---|---|---|
| `<repo>` | 编译期依赖 / 运行期依赖 / 事件协作依赖 | `/home/aris/Projects/<repo>` | path dependency / API / SDK / event / projection / fake | 检查目录和 `Cargo.toml` / endpoint / topic / test double | 暂停 / fixture / fake |

测试脚本与报告工具前置检查表：

| 检查项 | 要求 | 检查方式 | 失败处理 |
|---|---|---|---|
| gate scripts | `scripts/gates/*.sh` | 检查目录和脚本命名 | 创建或记录为本轮交付物 |
| report scripts | `scripts/reports/*.sh` | 检查目录和脚本命名 | 创建或记录为本轮交付物 |
| check scripts | `scripts/checks/*.sh` | 检查目录和脚本命名 | 创建或记录为本轮交付物 |
| artifact root | `artifacts/test/<run_id>` | 检查配置和脚本默认值 | 修正路径口径 |
| report root | `reports/` | 检查生成脚本输出 | 修正路径口径 |
| formal run ref | 固定 `<run_id>`，不使用 `latest` | 检查测试 / 验收文档 | 暂停并修正文档 |

#### 回填位置

- `07-实施计划.md` §3 实施前置条件与阅读清单

#### 执行约束

- 必须明确项目级 git 配置，不使用 `--global`。
- 必须要求阅读提交规范。
- 必须要求阅读语言编码规范。
- 必须要求阅读 `子项目目录与代码文件组织规范.md`。
- 必须检查实现仓目录、workspace member、Cargo package、Rust crate 和 binary 命名是否与详细设计一致。
- 不得把 `L0` / `L1` / `L2` 等架构层级写入代码命名。
- 必须检查已实现跨仓依赖在 `/home/aris/Projects` 下是否存在。
- 只有已确认的编译期依赖当前阶段默认本地 path dependency；不得默认要求发布到公共 crates.io。
- 运行期依赖和事件协作依赖必须写协作方式和检查方式，不得写成 Cargo path dependency。
- 必须检查 gate / report / check 脚本目录和命名是否符合 `子项目目录与代码文件组织规范.md`。
- 必须明确 artifact root 为 `artifacts/test/<run_id>`，report root 为 `reports/`。
- 不得把 report 生成脚本放入 `reports/` 输出目录。
- 子项目存在 `design-calibration/` 时，必须输出阶段实施前阅读矩阵。
- 阶段实施前阅读矩阵必须按阶段或 commit boundary 组织，不允许只列一个全局 `design-calibration` 文件清单。
- 不要求实施者一次性阅读全部中间产物；只要求在对应阶段开工前阅读会影响该阶段判断的校准文件。
- 正式 `00`~`07` 文档与 `design-calibration` 冲突时，以正式文档为准；正式文档不清楚时读对应校准来源；仍不清楚时暂停并回报设计缺口。
- 不允许把前置条件写成泛泛的“准备环境”。

#### 进入下一步的条件

- 阅读清单、阶段实施前阅读矩阵、配置、规范和工具前置条件均已列出。
- 无法满足的前置项已进入风险或 blocker。

### Step 4. 抽取实施对象与交付物

#### 本步目标

从详细设计、测试方案和验收标准中抽取本轮实际会交付的代码、测试、配置、数据和文档产物。

#### 本步输入

- Step 2 的实施范围
- 详细设计中的模块、对象、接口、事件、持久化和测试切口
- 测试方案中的用例和证据要求
- 验收标准中的 AC 项

#### 本步输出

- 实施对象清单
- 交付物清单
- 非交付物清单

#### 应问的问题

1. 本轮会新增或修改哪些代码模块。
2. 本轮会新增或修改哪些接口、事件、job 或 adapter。
3. 本轮会新增哪些测试。
4. 本轮会产生哪些配置、迁移、种子数据或文档同步。
5. 哪些上游设计对象本轮不交付。
6. 哪些交付物跨仓或依赖外部模块。

#### 期望产出

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| <交付物> | code / test / config / doc | <来源> | <路径或模块> | <判定> |

#### 回填位置

- `07-实施计划.md` §4 实施对象与交付物清单

#### 执行约束

- 交付物必须可判定。
- 不允许使用“完善相关代码”这类模糊项。
- 不允许把全部对象清单当作实施对象清单。

#### 进入下一步的条件

- 本轮交付物与非交付物明确。
- 交付物均能追溯到上游文档。

### Step 5. 设计实施阶段与依赖顺序

#### 本步目标

将实施对象组织为按依赖推进的阶段化可验证功能增量，并解释为什么按这个顺序实施。

#### 本步输入

- Step 4 的交付物清单
- 详细设计中的模块依赖、接口依赖和状态依赖
- 测试方案与验收标准中的门禁要求
- 风险和外部依赖初步判断

#### 本步输出

- 阶段依赖图
- 阶段总表
- 阶段顺序理由

#### 应问的问题

1. 最小可运行或可测试的纵切是什么。
2. 哪些阶段必须先于其他阶段。
3. 哪些风险或跨仓依赖需要前置。
4. 每个阶段完成后能验证什么。
5. 是否存在按对象拆分而不可验证的阶段。
6. 哪些阶段可以并行，哪些不能并行。

#### 期望产出

#### 阶段依赖图: <仓名> 实施阶段顺序

```text
[PH-01 前置准备]
  | enables
  v
[PH-02 最小纵切]
  | depends_on
  v
[PH-03 扩展能力]
```

关键说明：
- 图表达阶段依赖顺序，不表达完整函数调用链。
- 每个阶段必须在阶段总表中补充门禁。
- 阶段必须按可验证功能增量拆分。

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-02 | <阶段名称> | <目标> | PH-01 | <交付物> | GATE-xx |

#### 回填位置

- `07-实施计划.md` §5 实施阶段与依赖顺序

#### 执行约束

- 必须输出阶段依赖图。
- 阶段不能按对象、函数或文件裸拆。
- 阶段必须有门禁。
- 不允许把所有实现压成一个阶段。

#### 进入下一步的条件

- 阶段顺序、依赖和理由均已明确。
- 用户确认阶段拆分符合可验证增量原则。

### Step 6. 拆分阶段任务、编写顺序与提交边界

#### 本步目标

将每个实施阶段拆成可执行任务，定义阶段内代码编写顺序，并定义每个阶段的提交边界、commit 时机、包含内容、不包含内容和提交前门禁。

#### 本步输入

- Step 5 的阶段总表
- 详细设计中的实现契约
- 测试方案中的最小测试切口
- 项目提交规范

#### 本步输出

- 每阶段任务表
- 每阶段编写顺序表
- 每阶段代码实现批次表
- 每阶段提交边界表
- 提交粒度判断表
- 提交前检查清单

#### 应问的问题

1. 每个阶段内有哪些实施动作。
2. 每个任务的输入、输出和完成判定是什么。
3. 阶段内代码应该按什么顺序写，为什么。
4. 是否先锁定外部契约和测试切口，再填内部实现。
5. 哪些任务必须同提交，哪些任务必须分开提交。
6. 哪些时机可以 commit，哪些时机不能 commit。
7. 哪些测试必须在提交前执行。
8. 是否存在提交边界过大或过小的问题。
9. 是否存在把无关修改混入同一提交的风险。
10. 每个提交边界能否用一句话描述。
11. 每个提交边界是否可以独立 review、独立验证、必要时独立回退。
12. 本阶段是否存在单批代码预计超过 300 行或 500 行的实现动作。
13. 哪些实现动作必须拆成多个代码批次。
14. 哪些状态机、事务、并发、幂等、安全、审计、错误恢复或跨仓同步逻辑必须单独批次实现。
15. 每个代码批次完成后应该执行哪些编译、格式化、lint、单测、集成测试或验收门禁。
16. 每个代码批次与提交边界是什么关系。
17. 每个 phase / commit boundary 开工前需要复核哪些字段、DTO、状态、证据和 phase boundary。
18. 发现详细设计、测试方案、验收标准之间冲突时，是暂停、回写设计还是调整本阶段范围。

#### 期望产出

```md
### PH-02 <阶段名称>

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-02-01 | 1 | <实施动作> | <输入> | <输出> | <判定> |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-02-01 | <本批次形成的可验证代码增量> | <详细设计 / 测试切口 / 依赖批次> | <代码 / 测试 / 证据输出> | 100~300 行 / 需拆分 / 不适用 | GATE-xx | 单独提交 / 归入 commit-02-a |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-02-a | <何时提交> | <包含> | <不包含> | GATE-xx |

#### 开工前设计闭环复核

| 复核项 | 检查内容 | 失败处理 |
|---|---|---|
| 字段闭环 | <Domain 必填字段来源> | 暂停并回报设计缺口 |
| DTO 构造闭环 | <输入契约能否构造目标对象> | 暂停并回报设计缺口 |
| 状态闭环 | <状态名是否一致> | 回写设计后继续 |
| ref identity 闭环 | <lookup ref 是否有正式类型和 key> | 暂停并回报设计缺口 |
| validation truth 闭环 | <校验是否有 truth source / port> | 暂停并回报设计缺口 |
| metadata / idempotency 闭环 | <metadata authority、digest、result_ref、UoW 是否闭合> | 暂停并回报设计缺口 |
| projection rebuild 闭环 | <projection 是否有 committed truth / replay source> | 调整 rebuild set 或回写设计 |
| artifact materialization 闭环 | <runner 是否能解析 artifact location> | 暂停并回报设计缺口 |
| phase boundary | <是否依赖后续 phase> | 调整阶段或回写设计 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-02-a | 适中 / 过细 / 过粗 | 是 / 否 | 是 / 否 | 保留 / 拆分 / 合并 |
```

#### 回填位置

- `07-实施计划.md` §6 阶段任务拆分、编写顺序与提交边界

#### 执行约束

- 任务必须以实施动作命名。
- 任务必须归属阶段。
- 任务必须写明阶段内编写顺序。
- 每个阶段必须输出代码实现批次表。
- 每个阶段或 commit boundary 必须输出开工前设计闭环复核表。
- 代码批次必须按可验证功能切片拆分，不能按“所有 domain / 所有 repository / 所有测试”横向堆叠。
- 单批预计超过 300 行应拆分；超过 500 行必须拆分。
- 状态机、事务、并发、幂等、安全、审计、错误恢复和跨仓同步等高风险逻辑必须单独批次实现、单独验证。
- 提交边界必须服务于 review 和回退。
- 提交边界必须说明 commit 时机。
- 不允许以单个函数作为默认提交边界。
- 不允许以单个文件、单个 struct 或当天工作量作为默认提交边界。
- 不允许把多个无关功能合并成一笔提交。
- 不允许把测试全部留到阶段最后之后再补。

#### 进入下一步的条件

- 每个阶段都有任务表、编写顺序和提交边界。
- 每个阶段都有代码实现批次表，且批次规模、验证门禁和提交关系清楚。
- 每个阶段或 commit boundary 都有字段、DTO、状态和 phase boundary 开工前复核口径。
- 每个提交边界都有提交前门禁。

### Step 7. 嵌入测试与验收门禁

#### 本步目标

将测试方案和验收标准嵌入每个实施阶段，确保实施过程不是最后补测，而是阶段性验证。

#### 本步输入

- Step 5 的阶段表
- Step 6 的阶段任务与提交边界
- `05-测试方案.md`
- `06-验收标准.md`

#### 本步输出

- 阶段门禁矩阵
- 证据归档规则
- 报告生成规则
- 验收交接报告审查规则
- 门禁失败处理口径

#### 应问的问题

1. 每个阶段应执行哪些测试用例或测试切口。
2. 哪些阶段必须对齐验收标准 AC 项。
3. 每个门禁需要产出什么证据。
4. 门禁失败是否允许继续进入下一阶段。
5. 哪些门禁可以自动化，哪些需要人工审查。
6. 哪些验收一票否决项需要在实施阶段提前规避。
7. 每个阶段应调用哪些 `scripts/gates/*.sh`？
8. 每个阶段会输出哪些 `artifacts/test/<run_id>/...`？
9. 哪些阶段需要调用 `scripts/reports/*.sh` 生成 `reports/runs/<run_id>`？
10. 哪些阶段需要生成或更新 `reports/acceptance/*`？
11. 哪些报告必须由人或 Agent 审查补充后才能进入验收？

#### 期望产出

| 阶段编号 | 测试门禁 | 验收门禁 | 执行脚本 | artifact 输出 | report 输出 | 失败处理 |
|---|---|---|---|---|---|---|

| 阶段编号 | 生成脚本 | 输入 artifact | 输出 report | 人 / Agent 审查要求 |
|---|---|---|---|---|
| PH-02 | TC-xxx | AC-xxx | <证据> | <处理> |

#### 回填位置

- `07-实施计划.md` §7 测试与验收门禁嵌入

#### 执行约束

- 每个阶段至少绑定一个测试门禁。
- 涉及外部可见行为、状态转换、跨仓交互或数据一致性的阶段必须绑定验收门禁。
- 门禁失败处理必须明确。
- artifact 输出必须使用 `artifacts/test/<run_id>`。
- report 输出必须使用 `reports/runs/<run_id>` 和 `reports/acceptance`。
- `reports/acceptance/*` 可以脚本生成初稿，但必须声明审查补充责任。

#### 进入下一步的条件

- 阶段门禁矩阵完整。
- 证据归档和失败处理已明确。

### Step 8. 定义配置、环境与外部依赖准备

#### 本步目标

定义实施前或阶段前需要准备的配置、环境、外部服务、跨仓依赖和 fake / mock 策略。

#### 本步输入

- 架构设计中的外部依赖和通信方式
- 详细设计中的配置引用、adapter、port 和外部接口
- 测试方案中的环境矩阵
- Step 5 的阶段顺序
- Step 3 的本地多仓依赖前置检查表

#### 本步输出

- 外部依赖准备表
- 配置与环境检查表
- fake / mock 使用边界

#### 应问的问题

1. 哪些外部服务或仓是实施前置依赖。
2. 哪些依赖只在特定阶段需要。
3. 哪些配置项必须在本地或 CI 环境准备。
4. 是否允许 fake / mock，允许到什么阶段为止。
5. 外部依赖不可用时是暂停、降级还是替代。
6. 哪些依赖需要由其他团队或仓提供。
7. 已实现仓库依赖是否已经在 `/home/aris/Projects` 下存在。
8. 哪些依赖是编译期依赖，Cargo 本地 path dependency 写法是否已经与详细设计一致。
9. 哪些依赖是运行期依赖或事件协作依赖，应该使用 API / SDK / adapter / event / projection / fake，而不是 Cargo path dependency。

#### 期望产出

| 依赖项 | 类型 | 全局依赖类型 | 使用阶段 | 提供方 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|---|
| <依赖项> | service / repo / config / tool | 编译期依赖 / 运行期依赖 / 事件协作依赖 / 不适用 | PH-xx | <提供方> | <检查> | <处理> |

#### 回填位置

- `07-实施计划.md` §8 配置、环境与外部依赖准备

#### 执行约束

- 外部依赖必须显式列出。
- 不允许把依赖失败留给实施者临场判断。
- fake / mock 必须标明使用边界。
- repo 类依赖必须写本地路径和当前引用方式；只有编译期依赖当前阶段优先采用本地 path dependency。
- 运行期依赖和事件协作依赖必须写 API / SDK / adapter / event / projection / fake 等协作方式。
- private git tag / rev 只能作为中期方案记录，不能替代当前本地开发检查。

#### 进入下一步的条件

- 关键依赖均有检查方式和失败处理。
- 阶段级依赖关系与 Step 5 不冲突。

### Step 9. 定义 Spike、风险与待确认事项

#### 本步目标

前置识别实施中可能导致返工、延期或设计回写的不确定性，并定义处理方式和截止点。

#### 本步输入

- Step 1 的输入风险
- Step 5 的阶段依赖
- Step 8 的外部依赖准备表
- 详细设计和测试方案中的复杂点

#### 本步输出

- Spike 表
- 风险表
- 待确认事项表

#### 应问的问题

1. 哪些技术点需要先做 Spike。
2. 哪些风险会阻塞某个阶段。
3. 哪些待确认事项会影响提交边界或验收门禁。
4. 每个 Spike 的输出是什么。
5. 每个风险的处理方式和截止点是什么。
6. 哪些风险需要回写上游设计。

#### 期望产出

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| R-001 | risk | <风险> | PH-xx | <处理> | <截止点> |
| SP-001 | spike | <Spike> | PH-xx | <输出> | <截止点> |

#### 回填位置

- `07-实施计划.md` §9 Spike、风险与待确认事项

#### 执行约束

- Spike 必须有明确输出。
- 风险必须绑定阶段。
- 待确认事项必须有截止点。
- 不允许长期悬空的“后续确认”。

#### 进入下一步的条件

- 风险、Spike 和待确认事项均已分类。
- 会阻塞实施的事项已明确为 blocker。

### Step 10. 定义回退、暂停与变更控制

#### 本步目标

定义实施过程中遇到设计缺口、门禁失败、外部依赖不可用或需求变化时如何暂停、回退、变更和恢复。

#### 本步输入

- Step 6 的提交边界
- Step 7 的门禁矩阵
- Step 8 的外部依赖准备表
- Step 9 的风险与待确认事项

#### 本步输出

- 暂停规则表
- 回退规则表
- 变更控制表

#### 应问的问题

1. 哪些情况必须暂停当前阶段。
2. 哪些情况允许回退到上一个提交边界。
3. 哪些情况必须回写详细设计或测试方案。
4. 门禁失败后如何处理。
5. 外部依赖不可用时是否允许继续局部实施。
6. 恢复实施的条件是什么。
7. 发现字段缺失、状态冲突、DTO 构造不完整或 phase boundary 越界时如何处理。

#### 期望产出

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| <触发条件> | pause / rollback / change | <责任方> | <证据> | <恢复条件> |

#### 回填位置

- `07-实施计划.md` §10 回退、暂停与变更控制

#### 执行约束

- 不允许用“视情况处理”替代明确规则。
- 设计偏离必须回写上游文档。
- 设计真相源冲突必须暂停当前 phase，不得由实现者在代码里临时取舍。
- 回退规则必须优先保护已验证阶段。

#### 进入下一步的条件

- 暂停、回退、变更和恢复条件明确。
- 规则与提交边界、门禁矩阵一致。

### Step 11. 定义提交、评审与交付纪律

#### 本步目标

定义实施过程中必须遵守的提交规范、评审纪律、代码规范、文档同步和证据提交要求。

#### 本步输入

- 项目提交规范
- 历史提交样例
- 语言编码规范
- Step 6 的提交边界
- Step 7 的门禁矩阵

#### 本步输出

- 提交纪律表
- 提交 message 结构约束
- Type / Scope 约束
- Commit body 分组格式
- 固定 footer 策略
- 设计仓 / 实现仓语言边界
- Commit 示例
- 提交前检查清单
- 评审纪律表
- 交付纪律表
- artifact / report 交付检查表

#### 应问的问题

1. 提交前必须检查哪些 git 配置。
2. 提交 message 应参考哪些规范和历史提交。
3. 当前仓是 `quantalithos-design` 设计文档仓，还是其他实现代码仓。
4. 如果提交发生在当前 design 文档仓，如何保证 `type` 英文、subject / body 中文、footer 固定。
5. 如果提交发生在其他实现仓，如何保证 commit message 必须使用英文。
6. 如果提交发生在其他实现仓，如何保证标题格式固定为 `type(scope): subject`。
7. 当前项目允许哪些 `type` 和 `scope`，以及 `scope` 如何与 §6 commit boundary 对齐。
8. 每笔提交应对应哪个 §6 commit boundary，是否存在把多个 boundary 混成一笔的风险。
9. 如果一个 commit boundary 内部包含多个协作子功能，如何保证仍然是一笔提交，而不是按文件、repository、service、route 或子模块拆成多笔。
10. commit body 的第一句如何概括本 commit boundary。
11. commit body 应按哪些子功能分组，分组名称如何体现“为什么这些文件属于同一笔提交”。
12. body 文件条目是否只写文件名，禁止写完整路径。
13. body 文件条目是否带大致改动量，例如 `(+3)`、`(-35)`、`(~38)`、`(~+330/-60)`。
14. body 是否禁止字面量 `\n`，并使用真实换行。
15. bullet 之间是否禁止插空行。
16. 当前项目是否要求固定 footer，固定文本是什么。
17. `Co-Authored-By` 前是否必须有真实空行。
18. 是否允许多模型 `Co-Authored-By`，还是只能保留项目固定 footer。
19. 当需要精确控制格式时，是否必须把完整 message 写入文件，再使用 `git commit -F` 或 `git commit --amend -F`。
20. 如果提交发生在其他实现仓，源码标识符、rustdoc、普通注释和测试名是否必须英文。
21. 哪些 commit 时机被允许，哪些时机被禁止。
22. 代码规范、格式化、lint 和测试如何检查。
23. 设计偏离时如何同步文档。
24. 证据如何附到提交、PR 或交付说明中。
25. 哪些情况下必须拆分提交，哪些情况下允许合并提交。
26. 当前实施计划中应给出的合格 commit 示例和反例是什么。
27. 提交或交付说明是否只引用 `reports/runs/<run_id>` 和 `reports/acceptance`，而不是粘贴完整日志？
28. 如果门禁生成了 raw artifact，是否已经生成对应 report？
29. `reports/acceptance/handoff.md` 和 `veto-checklist.md` 是否已经由人或 Agent 审查？

#### 期望产出

#### 提交纪律

| 项 | 要求 | 检查方式 |
|---|---|---|
| git user.name | `quantalithos-labs` | `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | `git config user.email` |
| 提交规范 | <规范路径> | 提交前阅读并对照历史提交 |
| 提交粒度 | 一笔提交对应一个 §6 commit boundary | 对照 §6 提交边界 |
| 提交信息 | 标题、body、footer、空行和语言边界符合本章规则 | 对照近期合格提交 |

#### 提交 message 结构

| 部分 | 项目约束 | 示例 / 说明 |
|---|---|---|
| title | 实现仓固定为 `<type>(<scope>): <subject>`；design 仓按项目历史允许 `<type>: <中文 subject>` | `feat(query): add basic read APIs and projection access` |
| summary | body 第一段用一句话说明本 commit boundary | `Basic read-only query services and projection access for PH-06-a:` |
| body groups | 按子功能分组，每组列文件名、改动量和文件级说明 | `Projection and repository reads:` |
| footer | 默认保留固定 footer，且 footer 前必须空一行 | `Co-Authored-By: Codex <noreply@openai.com>` |

#### Type / Scope

| 项 | 允许值 | 说明 |
|---|---|---|
| type | feat / fix / refactor / docs / test / chore / perf / ci / style | <按项目裁剪> |
| scope | project / workitem / artifact / agent-config / snapshot / event / api / common / design / integration / knowledge | <按项目裁剪；实现仓标题必须填写 scope> |

#### Commit body 格式

```text
One-sentence summary for this commit boundary:

Sub-feature group A:
- file_a.rs (+12): concise functional summary.
- file_b.rs (~+80/-10): concise functional summary.

Sub-feature group B:
- file_c.rs (+34): concise functional summary.
- file_d.rs (+9): concise functional summary.
```

#### Commit body 文件条目规则

| 项 | 规则 | 正例 | 反例 |
|---|---|---|---|
| 文件名 | 只写文件名，不写完整路径 | `query_services.rs` | `crates/method/src/query_services.rs` |
| 改动量 | 使用大致变化标记 | `(+3)` / `(-35)` / `(~38)` / `(~+330/-60)` | `(120 lines)` |
| 分组 | 按子功能分组，不按文件类型平铺 | `Projection and repository reads:` | `Files:` |
| 换行 | 使用真实换行，不写字面量 `\n` | 标题、body、footer 分段 | `subject\n\nbody` |
| 空行 | 标题后空一行；footer 前空一行；bullet 之间不插空行 | 分组间可空行 | bullet 之间逐条空行 |

#### 语言边界

| 仓类型 | commit message | 注释 / rustdoc / 测试名 | 说明 |
|---|---|---|---|
| 当前 design 文档仓 | <type 英文,subject / body 中文,footer 固定> | <设计说明和伪代码注释可中文> | <仅 quantalithos-design> |
| 其他实现仓 | <commit message 必须英文；标题固定为 `type(scope): subject`；目标仓更严格规则只能叠加，不能放宽英文 commit 和固定标题要求> | <源码标识符、rustdoc、普通注释和测试名默认英文> | <不得继承 design 仓中文 commit 口径> |

#### Commit 示例

```text
feat(query): add basic read APIs and projection access

Basic read-only query services and projection access for PH-06-a:

Projection and repository reads:
- postgres.rs (~+215/-5): add read-only content, version, and published-reference reads plus adapter tests.
- mod.rs (+17): extend read-only ports for query flows.

Basic query handlers and HTTP routes:
- query_services.rs (+848): add Get/List/GetVersion handlers, consistency markers, and tests.
- routes.rs (~+840/-20): wire query endpoints and HTTP tests.

Co-Authored-By: Codex <noreply@openai.com>
```

#### Commit 反例

```text
feat(query): add basic read APIs and projection access
Basic read-only query services and projection access for PH-06-a:\n\n- crates/core/src/query_services.rs (+848): add query handlers.
- routes.rs (+840): wire routes.

- postgres.rs (+215): add reads.
Co-Authored-By: Codex <noreply@openai.com>
```

错误原因：

- 标题后没有真实空行。
- body 中出现了字面量 `\n`。
- 文件条目写了完整路径。
- bullet 之间插入了空行。
- 没有按子功能分组。
- `Co-Authored-By` 前没有空行。

#### 不合格拆分示例

```text
commit 1: feat(query): add repository reads
commit 2: feat(query): add query services
commit 3: feat(query): add routes
```

如果这三部分共同构成同一个 §6 commit boundary，应合并为一笔提交，并在 body 中按子功能分组说明。

#### 提交前检查清单

| 检查项 | 通过条件 |
|---|---|
| git 配置 | <user.name/user.email 正确> |
| diff 范围 | <只覆盖一个 §6 commit boundary> |
| 门禁结果 | <fmt/lint/test/acceptance 已通过或说明原因> |
| 文档同步 | <设计偏离已回写> |
| 源码语言 | <实现仓源码标识符、rustdoc、普通注释和测试名未混入中文> |
| title 格式 | <实现仓固定为 `type(scope): subject`> |
| body 格式 | <先写 boundary summary，再按子功能分组，文件名不带路径，标注改动量> |
| 空行格式 | <标题后空一行，footer 前空一行，bullet 之间不插空行> |
| 换行格式 | <body 中没有字面量 `\n`> |
| 证据记录 | <测试或验收证据已有落点> |
| 提交信息 | <subject/body/footer 符合规范> |
| 格式控制 | <需要精确控制时使用 `git commit -F` 或 `git commit --amend -F`> |

#### artifact / report 交付检查表

| 检查项 | 通过条件 |
|---|---|
| artifact root | `artifacts/test/<run_id>` 存在且包含 `meta/context.json`、`evidence-index.json` 和 suite report |
| report root | `reports/runs/<run_id>` 已生成 |
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` 可回指 raw artifacts |
| 门禁结果 | `reports/runs/<run_id>/gate-results.md` 汇总 gate 结果 |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` 通过 |
| 验收交接 | `reports/acceptance/handoff.md` 已审查 |
| 一票否决 | `reports/acceptance/veto-checklist.md` 已审查 |
| 风险接受 | 有条件通过时 `reports/acceptance/risk-acceptance.md` 已审查 |

#### 回填位置

- `07-实施计划.md` §11 提交、评审与交付纪律

#### 执行约束

- 必须包含 git 用户配置检查。
- 必须包含提交规范和历史提交阅读要求。
- 必须包含编码规范阅读要求。
- 必须包含 commit 时机约束。
- 必须包含提交 message 的 subject、body、footer 约束。
- 必须声明当前 design 文档仓使用中文 subject / body、英文 type、固定 footer。
- 必须声明其他实现仓 commit message 必须英文，且标题固定为 `type(scope): subject`。
- 必须包含 type / scope 允许值；实现仓不得默认省略 scope。
- 必须包含一笔提交对应一个 §6 commit boundary 的规则。
- 必须说明同一 boundary 内多个协作子功能应保留为一笔提交，并在 body 中按子功能分组。
- 必须包含 body boundary summary、子功能分组、文件名写法和改动量标记规则。
- 必须禁止 body 字面量 `\n`。
- 必须禁止 bullet 之间插空行。
- 如果项目要求固定 footer，必须写出完整 footer 文本。
- 必须要求 `Co-Authored-By` 前有真实空行。
- 如果项目允许多模型 footer，必须说明每个模型各占一行；如果项目只允许固定 footer，必须禁止展开多行模型注脚。
- 必须区分当前 design 文档仓提交语言与其他实现仓提交 / 源码语言规则。
- 实现代码仓必须声明源码标识符、rustdoc、普通注释和测试名默认英文。
- 必须给出至少一条符合当前项目的 commit 正例和一条反例。
- 必须说明需要精确控制格式时，应把完整 message 写入文件，再使用 `git commit -F` 或 `git commit --amend -F`。
- 必须包含提交前检查清单。
- 必须包含 artifact / report 交付检查表。
- 不允许把不相关改动混入同一提交。

#### 进入下一步的条件

- 提交、评审和交付纪律可执行。
- 用户确认提交边界与纪律符合项目约定。

### Step 12. 定义实施完成判定

#### 本步目标

定义什么时候可以宣称本轮实施完成，以及未完成项如何处理。

#### 本步输入

- Step 2 的实施范围
- Step 4 的交付物清单
- Step 7 的门禁矩阵
- Step 9 的风险与待确认事项
- 验收标准中的最终结论规则

#### 本步输出

- 实施完成判定表
- 未完成项处理表
- 最终交付清单

#### 应问的问题

1. 本轮需求覆盖如何判定。
2. 交付物是否全部完成。
3. 测试门禁和验收门禁是否全部通过或有明确风险接受。
4. 风险、Spike 和待确认事项是否关闭。
5. 是否存在一票否决项。
6. 未完成项如何进入延期、风险接受或 blocker。
7. `reports/runs/<run_id>` 是否已经从 `artifacts/test/<run_id>` 生成。
8. `reports/acceptance/handoff.md`、`veto-checklist.md` 和必要的 `risk-acceptance.md` 是否已经审查。
9. artifact / report 是否通过 redaction 和 link 检查。
10. 是否仍存在未关闭的字段、DTO、状态、命名或 phase boundary 冲突。

#### 期望产出

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| <判定项> | <标准> | <证据> | 通过 / 不通过 |

| 闭环项 | 完成标准 | 证据 | 结论 |
|---|---|---|---|
| 字段 / DTO 闭环 | 所有 phase 已按详细设计实现，无临时补设字段 | <review / test evidence> | 通过 / 不通过 |
| 状态闭环 | 代码、测试、验收使用同一套正式状态名 | <TC / EV / review> | 通过 / 不通过 |
| phase boundary | 无当前 phase 依赖后续 phase 的实现或证据 | <commit review> | 通过 / 不通过 |

| 交付证据项 | 固定路径 | 完成标准 | 结论 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>` | P0 suite 原始证据完整 | 通过 / 不通过 |
| run reports | `reports/runs/<run_id>` | summary / evidence-index / gate-results / redaction-check 完整 | 通过 / 不通过 |
| acceptance handoff | `reports/acceptance/handoff.md` | 已经人 / Agent 审查 | 通过 / 不通过 |
| veto checklist | `reports/acceptance/veto-checklist.md` | 所有 VETO 有结论 | 通过 / 不通过 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件通过时风险接受完整 | 通过 / 不适用 / 不通过 |

#### 回填位置

- `07-实施计划.md` §12 实施完成判定

#### 执行约束

- 不允许使用“基本完成”。
- 完成判定必须有证据。
- 未完成项必须分类处理。
- 不得用 raw artifact 替代人类可读 report。
- 不得用脚本生成的 `reports/acceptance/*` 初稿替代人 / Agent 审查结论。
- 不得在仍有字段、DTO、状态或 phase boundary 冲突时宣称实施完成。

#### 进入下一步的条件

- 完成判定可审查。
- 未完成项处理口径明确。

### Step 13. 整理正式实施计划文档

#### 本步目标

将 Step 1 ~ Step 12 已确认的中间产物回填为正式 `07-实施计划.md`，并完成一致性自查。

#### 本步输入

- Step 1 ~ Step 12 的中间产物
- `实施计划书写规范.md`
- 当前仓文档目录结构

#### 本步输出

- 正式 `07-实施计划.md`
- 实施计划评审清单
- 剩余风险与待确认事项

#### 应问的问题

1. 正式文档是否完整覆盖书写规范章节主链。
2. 每一章是否来自已确认中间产物。
3. 阶段编号、任务编号和门禁编号是否一致。
4. 上游引用、测试引用和验收引用是否准确。
5. 是否存在详细设计内容被复制进实施计划。
6. 每个 phase / commit boundary 是否都有开工前字段、DTO、状态、证据和 phase boundary 复核。
7. 是否存在未解释的空表、空图或占位内容。

#### 期望产出

正式文档必须使用以下章节：

```text
1. 与上游文档的关系声明
2. 实施目标与范围
3. 实施前置条件与阅读清单
4. 实施对象与交付物清单
5. 实施阶段与依赖顺序
6. 阶段任务拆分、编写顺序与提交边界
7. 测试与验收门禁嵌入
8. 配置、环境与外部依赖准备
9. Spike、风险与待确认事项
10. 回退、暂停与变更控制
11. 提交、评审与交付纪律
12. 实施完成判定
13. 参考
```

#### 回填位置

- 当前仓 `07-实施计划.md`
- `design-calibration/07_implementation_plan_calibration_flow.md` Step 13 状态

#### 执行约束

- 不允许跳过中间产物直接生成正式文档。
- 不允许保留占位符作为正式内容。
- 不允许将旧版实施计划的编码教程式内容整段搬入新版文档。

#### 进入下一步的条件

- 正式实施计划通过评审清单。
- 用户确认实施计划可交给另一个 agent 执行。

---

## 6. 实施计划生成工作台模板

当用户要求逐步讨论、每完成一项划掉，或需要保留中间产物时，必须在子项目目录内创建：

```text
design-calibration/07_implementation_plan_calibration_flow.md
```

模板：

```md
# 07 实施计划校准流程

## 工作方式

- 每个 Step 单独讨论、确认、回填。
- 每个 Step 必须保留 SOP 问题回答、改动前后对比、结构化中间产物和回填草稿。
- 每个 Step 完成后，将状态从 `[ ]` 改为 `[x]`。
- 不允许一次性批量生成所有 Step 后再统一确认。

## Step 状态

- [ ] Step 1. 确认实施输入边界
- [ ] Step 2. 明确实施目标、范围和非范围
- [ ] Step 3. 收稳前置条件与阅读清单
- [ ] Step 4. 抽取实施对象与交付物
- [ ] Step 5. 设计实施阶段与依赖顺序
- [ ] Step 6. 拆分阶段任务、编写顺序与提交边界
- [ ] Step 7. 嵌入测试与验收门禁
- [ ] Step 8. 定义配置、环境与外部依赖准备
- [ ] Step 9. 定义 Spike、风险与待确认事项
- [ ] Step 10. 定义回退、暂停与变更控制
- [ ] Step 11. 定义提交、评审与交付纪律
- [ ] Step 12. 定义实施完成判定
- [ ] Step 13. 整理正式实施计划文档

## Step 记录模板

### Step N. <名称>

#### Step 状态

`draft / reviewed / accepted`

#### 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|

#### SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|

#### 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|

#### 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|

#### 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|

#### 结构化中间产物

<按本 Step 要求输出表格、清单或 ASCII 图>

#### 回填草稿

<可直接回填到 07-实施计划.md 的草稿>

#### 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|

#### 进入下一步条件

- [ ] <条件 1>
- [ ] <条件 2>
```
