# L0-core 07-实施计划校准流程

> 本文件是 `projects/L0-core/07-实施计划.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态、回填章节和关键门禁。
> 本目录中的内容是中间产物,不替代正式 `07-实施计划.md`。
>
> 本轮状态说明:
> - 当前 `projects/L0-core/07-实施计划.md` 已在 Step 13 创建。
> - 本轮实施计划以新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` 为主输入。
> - 每个 Step 必须先形成中间产物,再回填正式 `07-实施计划.md`。
> - 自动推进时仍必须逐 Step 独立落盘,不得把多个 Step 合并为一个产物。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 实施计划书写规范 | `standards/document/实施计划书写规范.md` |
| 实施计划讨论 SOP | `standards/document/实施计划讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 当前需求文档 | `projects/L0-core/00-需求文档.md` |
| 当前架构设计 | `projects/L0-core/01-架构设计.md` |
| 当前概要设计 | `projects/L0-core/02-概要设计.md` |
| 当前详细设计 | `projects/L0-core/03-详细设计.md` |
| 当前配置设计 | `projects/L0-core/04-配置设计.md` |
| 当前测试方案 | `projects/L0-core/05-测试方案.md` |
| 当前验收标准 | `projects/L0-core/06-验收标准.md` |

---

## 二、状态总览

```text
[ ] 未开始
[~] 讨论中
[x] 已确认
```

| Step | 状态 | 主题 | 中间产物 | 回填章节 |
|---|---|---|---|---|
| Step 1 | [x] | 确认实施输入边界 | `07_implementation_plan_step_01_input_boundary.md` | §1 与上游文档的关系声明 |
| Step 2 | [x] | 明确实施目标、范围和非范围 | `07_implementation_plan_step_02_scope.md` | §2 实施目标与范围 |
| Step 3 | [x] | 收稳前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | §3 实施前置条件与阅读清单 |
| Step 4 | [x] | 抽取实施对象与交付物 | `07_implementation_plan_step_04_deliverables.md` | §4 实施对象与交付物清单 |
| Step 5 | [x] | 设计实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | §5 实施阶段与依赖顺序 |
| Step 6 | [x] | 拆分阶段任务、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commits.md` | §6 阶段任务拆分、编写顺序与提交边界 |
| Step 7 | [x] | 嵌入测试与验收门禁 | `07_implementation_plan_step_07_test_acceptance_gates.md` | §7 测试与验收门禁嵌入 |
| Step 8 | [x] | 定义配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment.md` | §8 配置、环境与外部依赖准备 |
| Step 9 | [x] | 定义 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks.md` | §9 Spike、风险与待确认事项 |
| Step 10 | [x] | 定义回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_change_control.md` | §10 回退、暂停与变更控制 |
| Step 11 | [x] | 定义提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | §11 提交、评审与交付纪律 |
| Step 12 | [x] | 定义实施完成判定 | `07_implementation_plan_step_12_completion.md` | §12 实施完成判定 |
| Step 13 | [x] | 整理正式实施计划文档 | `07_implementation_plan_step_13_formal_document_assembly.md` | 全文 |

---

## 三、本轮校准总目标

本轮不是补写个人待办,也不是重写详细设计、测试方案或验收标准,而是基于已经收稳的新版 `00/01/02/03/04/05/06`,把 L0-core 的实施前置条件、阅读清单、阶段顺序、代码批次、任务边界、提交边界、测试验收门禁、配置准备、风险控制和完成判定整理成可执行、可验证、可交给其他 agent 落地的正式实施计划。

目标输出:

```text
1. 07 只承接 00~06 的结论,不重新定义需求、架构、概要、详细、配置、测试或验收。
2. 07 按实施计划书写规范的 13 章主链组织。
3. 07 必须先要求实施者阅读上游文档、编码规范、提交规范和历史提交。
4. 07 必须按可验证功能增量安排阶段,不能按对象、函数或文件机械拆分。
5. 07 必须为每个阶段定义代码实现批次、验证门禁和提交边界。
6. 07 必须把 05 测试方案和 06 验收标准嵌入阶段门禁,不能把测试和验收放到最后。
7. 07 必须区分当前 design 文档仓和未来实现仓的提交、注释和语言规则。
8. 如果 07 发现 03/04/05/06 输入不足,必须进入风险或 blocker,不能静默补设计。
```

---

## 四、旧文档处理总览

| 文档 | 当前状态 | 本轮处理 |
|---|---|---|
| `07-实施计划.md` | 已创建 | 已按 SOP Step 1~13 生成中间产物并创建正式文档 |
| `00-需求文档.md` | 已按新版需求 SOP 重写 | 作为实施范围和需求追溯输入 |
| `01-架构设计.md` | 已按新版架构 SOP 重写 | 作为依赖方向、边界红线和实施顺序输入 |
| `02-概要设计.md` | 已按新版概要 SOP 重写 | 作为主要组成部分、关键对象、接口和流程输入 |
| `03-详细设计.md` | 已按新版详细设计 SOP 重写 | 作为直接实现契约输入 |
| `04-配置设计.md` | 已按新版配置设计 SOP 创建 | 作为配置、环境和 runtime wiring 输入 |
| `05-测试方案.md` | 已按新版测试方案 SOP 重写 | 作为阶段测试门禁和证据输入 |
| `06-验收标准.md` | 已按新版验收标准 SOP 重写 | 作为阶段验收门禁和完成判定输入 |

---

## 五、执行纪律

- 每个 Step 必须先形成中间产物,不得直接改写正式 `07-实施计划.md`。
- 每个 Step 必须逐项回答 SOP 的“应问的问题”。
- 每个 Step 必须包含当前文档问题诊断和改动前后对比。
- 每个 Step 必须包含实施计划取舍。
- 每个 Step 必须包含至少一个结构化产物: 表格、ASCII 图、阶段表、代码批次表、提交边界表、门禁表、风险表或回填草稿。
- 每个 Step 如涉及图示,必须遵守实施计划 ASCII 图统一格式。
- Step 状态从 `[~]` 改为 `[x]` 后,才能进入下一 Step。
- 自动执行时仍必须逐 Step 独立生成文件,不得合并 Step。
- 当正式 `07-实施计划.md` 需要创建时,先创建骨架,再按 Step 回填正文。
- 允许参考其他子项目实施计划方法,但不能机械搬运其他子项目的阶段、任务或提交边界。
