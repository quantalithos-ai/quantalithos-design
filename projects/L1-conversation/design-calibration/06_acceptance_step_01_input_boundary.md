# L1-conversation 06 验收标准 Step 1: 确认验收输入边界

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §1 与上游文档的关系声明
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 1 |
| 主题 | 确认验收输入边界 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_01_input_boundary.md` |

本步确认验收标准承接哪些需求、设计、测试、交付、环境和证据输入。正式 `06-验收标准.md` 在 Step 1~14 不修改；Step 15 删除旧文件并按新文件标准重建。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `00-需求文档.md` | 提供仓定位、FR / BR / NFR、P0 红线和一票否决方向 | 作为验收项和失败条件主来源 |
| `01-架构设计.md` | 提供系统边界、依赖方向、数据所有权和架构硬约束 | 作为数据边界、架构红线和跨仓裁决来源 |
| `02-概要设计.md` | 提供主要组成部分、关键对象、接口骨架、状态和异常边界 | 作为验收范围分组来源 |
| `03-详细设计.md` | 提供正式对象、协议、状态、事务、错误、幂等、观测和测试切口 | 作为 AC 设计契约来源 |
| `04-配置设计.md` | 提供 profile、配置项、失效模式、reports / artifacts 和 redaction | 作为配置、环境和证据门禁来源 |
| `05-测试方案.md` | 提供 TC、EV、gate、entry / exit、reports / artifacts、缺陷和风险规则 | 作为验收证据和裁决前置来源 |
| 交付版本 / 送验说明 | 提供 commit、build、run_id、acceptance handoff | Step 3 固定；当前缺失不阻塞文档生成,但阻塞最终验收结论 |
| 旧 `06-验收标准.md` | 历史输入和问题诊断 | 不作为新版真相源 |

## 3. SOP 问题回答

### 3.1 本轮验收依据哪些需求和设计?

本轮验收依据新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md`。验收主线必须围绕 Conversation truth center,即 space / scope、fact append、authorized consumption、cross-domain manifestation、trace / handoff、outbox / events、operations jobs、configuration / reports / redaction。

旧版 `06-验收标准.md` 中的 Conversation / Turn / StreamEvents / projection 主线、固定性能数字和旧三红线表达只能作为旧稿问题诊断,不得直接继承为新版 AC。

### 3.2 哪些测试证据会支撑验收裁决?

验收裁决必须消费 `05-测试方案.md` 中定义的 `TC-CONV-*`、`EV-CONV-*`、`reports/runs/<run_id>/evidence-index.md`、`reports/runs/<run_id>/gate-results.md`、`reports/runs/<run_id>/redaction-check.md` 和 `reports/acceptance/*`。正式 AC 不直接粘贴测试日志,而是引用 EV、TC 和固定 report 路径。

### 3.3 哪些交付版本、环境和数据会成为基线?

交付版本、送验 commit / build、`run_id`、环境 profile、fixture / seed、artifact root 和 report root 会在 Step 3 固定为验收基线。当前设计仓尚未持有实际送验版本和测试执行 run,因此本轮 Step 1~15 可以定义验收标准,但最终验收结论不得在没有固定 `<run_id>` 和 `reports/acceptance/*` 审查记录时宣称通过。

### 3.4 哪些内容属于测试方案或实施计划,不应写进验收标准?

验收标准不重新设计测试用例、fixture、CI 执行命令、实施 phase、commit boundary、开发排期、部署步骤或运维 runbook。测试执行过程留在 `05-测试方案.md` 和测试报告中；实施顺序留给 `07-实施计划.md`；部署和上线步骤留给部署与运维文档。

### 3.5 是否存在阻塞验收标准生成的上游缺口?

不存在阻塞“生成验收标准文档”的上游缺口。新版 `00~05` 已能支撑 AC、证据、红线、风险接受和签署口径生成。

存在阻塞“最终验收结论”的前置缺口: 送验版本、固定 `<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/handoff.md`、`veto-checklist.md` 和必要的 `risk-acceptance.md` 尚未在设计仓中固定。这些必须在 Step 3 和 Step 14 中作为基线 / 签署前置处理。

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 旧稿仍围绕 Turn、StreamEvents、projection 和固定性能数字,与新版 `00~05` 不一致 | 不继承旧验收主语；Step 15 删除重建 |
| 新 `05-测试方案.md` | 已提供 TC、EV、reports / artifacts、entry / exit 和风险规则 | 作为验收证据主输入 |
| `03-详细设计.md` | 已固定对象、协议、状态、事务、幂等和测试切口 | 作为 AC 设计契约主输入 |
| 交付版本 / run_id | 当前尚未固定 | 不阻塞验收标准生成；阻塞最终验收结论 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 验收输入 | 旧稿承接 `02/03/05`,且 05 也是旧稿 | 承接新版 `00~05` 完整文档链 |
| 验收主语 | Conversation / Turn / StreamEvents / projection | Conversation truth center: space / scope、fact、authorized query、manifestation、handoff、outbox、jobs、evidence |
| 性能阈值 | 旧稿写固定 p95 数字 | 不继承未确认数字；量化阈值需来源或进入风险 |
| 证据路径 | 旧稿泛写测试报告 / trace | 固定 `reports/runs/<run_id>`、`reports/acceptance` 和 EV |
| 送验版本 | 未区分文档生成和最终裁决 | Step 3 固定基线；无基线不得最终通过 |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否直接修旧 `06` | 在旧稿上替换条目 | Step 1~14 不改正式 06,Step 15 删除重建 | B | 旧主线污染新版裁决口径 |
| 是否用 05 代替 06 | 直接引用测试方案结论 | 05 提供证据,06 定义裁决 | B | 验收标准是裁决文档 |
| 缺少 run_id 是否阻塞文档生成 | 阻塞所有讨论 | 只阻塞最终验收结论 | B | AC 可以先定义,实际结论必须有固定证据 |
| 是否继承旧性能数字 | 直接继承 | 不继承未确认数字 | B | 新版需求 / 测试方案明确不编造量化阈值 |

## 7. 结构化中间产物

### 7.1 验收输入映射表

| 来源文档 | 验收输入 | 本文如何裁决 |
|---|---|---|
| `00-需求文档.md` | 仓定位、FR / BR / NFR、一票否决方向 | 转成验收范围、功能门禁、非功能门禁和 veto |
| `01-架构设计.md` | 职责边界、依赖方向、数据所有权、架构硬约束 | 转成数据边界、架构红线和跨仓接缝 AC |
| `02-概要设计.md` | 主要组成部分、关键对象、接口骨架、状态和异常边界 | 转成验收范围分组和功能 AC 主语 |
| `03-详细设计.md` | 对象、协议、状态、处理流、事务、幂等、错误、观测 | 转成 AC 设计契约、正式字段 / 状态和失败条件 |
| `04-配置设计.md` | profile、配置项、失效模式、reports / artifacts、redaction | 转成配置、环境、path shape 和 redaction 证据门禁 |
| `05-测试方案.md` | TC、EV、gate、entry / exit、reports / artifacts、缺陷和风险规则 | 转成证据来源、进入 / 退出条件、风险接受和放行规则 |
| 交付版本 / 送验说明 | commit、build、run_id、acceptance handoff | Step 3 固定基线；Step 14 形成最终结论前置 |

### 7.2 验收标准不再回答的问题

| 不回答的问题 | 归属文档 |
|---|---|
| 为什么要做 Conversation truth center | `00-需求文档.md` |
| 为什么采用当前架构边界和依赖方向 | `01-架构设计.md` |
| 主要对象、接口和处理流如何组织 | `02-概要设计.md` / `03-详细设计.md` |
| Rust struct / enum / trait / repository / service 具体如何实现 | `03-详细设计.md` 和实现仓 |
| 配置项、默认值、profile 和失效模式如何设计 | `04-配置设计.md` |
| 测试用例、数据、环境、脚本和 EV 如何生成 | `05-测试方案.md` |
| phase、commit boundary、开发顺序和提交规范 | `07-实施计划.md` |
| 部署步骤、生产 runbook 和运维操作 | 部署与运维文档 |

### 7.3 验收标准必须回答的问题

| 必须回答的问题 | 后续 Step |
|---|---|
| 本轮验收裁决什么、不裁决什么 | Step 2 |
| 按哪一版需求、设计、测试、交付、环境和证据裁决 | Step 3 |
| 什么条件下可以开始验收,什么条件下可以结束验收 | Step 4 |
| 哪些功能主线通过才算 P0 成立 | Step 5 |
| 哪些数据边界和架构红线失败即不通过 | Step 6 / Step 11 |
| Command、Query、Event、Job 和跨仓接缝如何裁决 | Step 7 |
| 状态机、事务、幂等和一致性如何裁决 | Step 8 |
| 非功能、可观测性、审计和证据如何裁决 | Step 9 / Step 10 |
| 缺陷、复验、风险接受和最终签署如何裁决 | Step 12 / Step 13 / Step 14 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §1 时摘录。

```markdown
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/06_acceptance_step_01_input_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_01_input_boundary.md` 的“验收输入映射表”“验收标准不再回答的问题”和“验收标准必须回答的问题”小节，了解本章验收输入边界如何从新版 `00~05` 收敛而来。

本验收标准承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md`。本文不重新定义需求、设计、配置或测试用例，只把这些文档中的 P0 能力、红线、证据和风险规则转成可裁决的 AC。

旧版 `06-验收标准.md` 只作为历史诊断输入。正式验收标准必须围绕 Conversation truth center、space / scope、fact append、authorized consumption、manifestation、handoff、outbox、operations jobs、configuration、reports / artifacts 生成裁决门禁。
```

## 9. 待确认事项

无阻塞进入 Step 2 的待确认事项。

后续 Step 必须继续收口:

- Step 3 固定交付版本、`run_id`、report 和 acceptance handoff 基线。
- Step 10 / Step 11 必须把 redaction / boundary scan 和一票否决项转成不可风险接受门禁。
- Step 14 必须明确没有固定证据基线时不得给出“通过”结论。
- Step 15 重建正式 `06-验收标准.md` 时不得继承旧 Turn / StreamEvents 主线或未确认性能数字。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收输入清楚 | 通过 | 新版 `00~05` 已作为输入链 |
| 验收边界清楚 | 通过 | 测试、实施、部署问题已排除出 06 |
| 旧稿处理清楚 | 通过 | 旧 `06` 不作为新版真相源 |
| 上游缺口分类清楚 | 通过 | 缺送验版本 / run_id 只阻塞最终结论,不阻塞标准生成 |
| 可以进入 Step 2 | 通过 | 下一步明确验收目标与范围 |
