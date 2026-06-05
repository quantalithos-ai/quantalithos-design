# L1-work 07 实施计划 Step 13: 正式文档装配

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` 全文
> 状态: `[x] 已完成`
> 日期: 2026-06-05

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 13 |
| 主题 | 整理正式实施计划文档 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 是 |
| 正式产物位置 | `projects/L1-work/07-实施计划.md` |
| 中间产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_13_formal_document_assembly.md` |

本步将 Step 1~Step 12 已确认中间产物回填为正式 `07-实施计划.md`,并执行一致性自查。本步不新增 P0 范围、不改变已确认 phase / commit boundary、不生成真实实现或验收结论。

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 1 中间产物 | 回填 §1 与上游文档的关系声明 |
| Step 2 中间产物 | 回填 §2 实施目标与范围 |
| Step 3 中间产物 | 回填 §3 实施前置条件、阅读清单和永久记忆种子 |
| Step 4 中间产物 | 回填 §4 实施对象与交付物清单 |
| Step 5 中间产物 | 回填 §5 实施阶段与依赖顺序 |
| Step 6 中间产物 | 回填 §6 阶段任务拆分、编写顺序与提交边界 |
| Step 7 中间产物 | 回填 §7 测试与验收门禁嵌入 |
| Step 8 中间产物 | 回填 §8 配置、环境与外部依赖准备 |
| Step 9 中间产物 | 回填 §9 Spike、风险与待确认事项 |
| Step 10 中间产物 | 回填 §10 回退、暂停与变更控制 |
| Step 11 中间产物 | 回填 §11 提交、评审与交付纪律 |
| Step 12 中间产物 | 回填 §12 实施完成判定 |
| `standards/document/实施计划书写规范.md` | 校验正式章节主链、评审清单、参考章节 |
| `standards/document/实施计划讨论流程_SOP.md` | 校验 Step 13 输出和执行约束 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 正式文档是否完整覆盖书写规范章节主链 | 是。正式文档包含文档元信息、变更记录和 §1~§13。 |
| 2. 每一章是否来自已确认中间产物 | 是。§1~§12 均来自对应 Step 1~12;§13 记录真实引用材料和 Step 13 校准来源。 |
| 3. 阶段编号、任务编号和门禁编号是否一致 | 已按 PH-01~PH-09、IMPL-01-01~IMPL-09-02、commit-01-a~commit-09-a、`TC-WORK-*`、`AC-WORK-*`、`VETO-WORK-*` 写入。 |
| 4. 上游引用、测试引用和验收引用是否准确 | 已引用 `00~06`、`design-calibration` Step 1~12、`TC / EV / AC / VETO` 和固定 evidence path。 |
| 5. 是否存在详细设计内容被复制进实施计划 | 未复制对象字段表、DTO schema、状态矩阵或函数伪代码全文;只保留实施顺序、门禁、交付和引用入口。 |
| 6. 每个 phase / commit boundary 是否都有开工前复核 | §6 明确每个 phase / boundary 开工前复核字段、DTO、状态、ref identity、validation、metadata / idempotency、projection rebuild、artifact materialization 和 phase boundary。 |
| 7. 是否存在未解释的空表、空图或占位内容 | 当前未保留空表、空图或未解释占位;`<run_id>`、`<type>`、`<scope>` 等为本计划正式规范变量。 |

## 4. 正式文档评审清单

| 检查项 | 结论 |
|---|---|
| 引用需求、架构、概要、详细、测试方案和验收标准 | 通过 |
| 列出实施前置阅读清单、编码规范和提交规范 | 通过 |
| 存在 `design-calibration/` 时,把校准来源转译为阶段实施前阅读矩阵 | 通过 |
| 包含 Agent 启动与永久记忆种子表,且生成门禁、刷新触发、冲突处理和禁止项完整 | 通过 |
| 永久记忆种子没有硬编码单一语言规范,而是从阅读清单引用当前技术栈规范路径 | 通过 |
| 包含项目级 git user.name / user.email 检查 | 通过 |
| 按可验证功能增量拆分阶段,不是按对象、函数或文件拆分 | 通过 |
| 每个阶段都有输入、输出、依赖、门禁和提交边界 | 通过 |
| 每个阶段说明阶段内编写顺序 | 通过 |
| 每个阶段说明代码实现批次和提交关系 | 通过 |
| 每个 phase / commit boundary 都有开工前字段 / DTO / 状态 / phase boundary 复核 | 通过 |
| 对超过 300 行、超过 500 行和高风险逻辑的代码批次给出拆分策略 | 通过 |
| 每个提交边界说明 commit 时机 | 通过 |
| 测试方案和验收标准被嵌入阶段门禁 | 通过 |
| 列出配置、环境和外部依赖准备 | 通过 |
| 列出 Spike、风险、待确认事项和截止点 | 通过 |
| 定义暂停、回退和变更控制 | 通过 |
| 定义实施完成判定和证据 | 通过 |
| 每个正式章节列出对应 `design-calibration` 中间产物 | 通过 |
| 没有复制详细设计中的完整实现契约 | 通过 |

## 5. 剩余风险与待确认事项

| 项 | 类型 | 处理 |
|---|---|---|
| 正式 `07-实施计划.md` 当前未提交 | design handoff risk | 用户确认后按 design 仓提交规范提交并固定 commit hash |
| 目标实现仓 `/home/aris/Projects/quantalithos-work` 当前未创建 | implementation start risk | PH-01 创建 |
| `core-contracts` baseline 需实现交接前固定 | implementation start risk | PH-01 / handoff 前记录 core commit |
| 真实生产 DB / MQ / search / trace / archive 未定义 | P1/P2 risk | 不进入 P0;后续专项处理 |
| Step 13 后仍需用户审核正式 07 | review requirement | 本步完成后暂停等待用户审核 |

## 6. 装配一致性检查

| 检查项 | 状态 |
|---|---|
| 正式 `07-实施计划.md` 已创建 | 已完成 |
| Step 1~12 均为 `[x]` 后再装配 | 已完成 |
| 正式章节 §1~§13 齐全 | 已完成 |
| 每章保留校准来源入口 | 已完成 |
| 不保留未解释占位符 | 已完成;`<run_id>`、`<type>`、`<scope>` 等规范变量允许保留 |
| 不生成真实验收结论 | 已完成 |
| 不提交 design 仓改动 | 已完成 |

## 7. 进入后续条件

| 条件 | 状态 |
|---|---|
| 正式实施计划通过本步评审清单 | 已满足 |
| 用户确认实施计划可交给另一个 agent 执行 | 待用户审核 |
| 若用户要求交接实现,先提交 design baseline 并给出 commit hash | 待用户指令 |
