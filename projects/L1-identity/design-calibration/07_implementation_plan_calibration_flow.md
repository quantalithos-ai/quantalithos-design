# L1-identity 实施计划校准工作台

> 对应正式文档: `projects/L1-identity/07-实施计划.md`
> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md`
> 书写规范: `standards/document/实施计划书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 当前目标: 按新版正式 `00/01/02/03/04/05/06` 重建 `L1-identity` 的 `07-实施计划.md`
> 当前状态: Step 13 formal assembly 已完成;正式 `07-实施计划.md` 已重建

---

## 1. 本轮重写原则

- 新版 `07` 必须承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。
- 旧版 `07-实施计划.md` 只作为历史诊断输入,不得继承旧阶段结构、旧入口名、旧版本号、旧技术假设或旧提交边界。
- 实施计划只回答“如何按可验证顺序落地代码”,不重新定义需求、对象契约、DTO、状态、port、测试用例、证据 schema 或验收结论。
- 大文件按“先建框架,再逐 Step / 逐章节写入”执行。正式 `07-实施计划.md` 只能在 Step 13 由已审核中间产物装配。
- Phase / commit boundary 是本轮主轴。每个 boundary 必须有设计闭环复核、代码批次、测试门禁、证据门禁、提交 message 分组和停审结论。
- 每个 commit boundary 必须从 `设计真相源闭环与可落码性标准.md` §九选择适用经验项,并逐项给出 `通过 / 不适用 / blocker`。
- 实现 agent 只做二次校验和阻塞回报。若 boundary 复核出现 blocker,必须先回写设计真相源,不得要求实现者自行补 schema、port、状态或 phase scope。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L1-identity/00-需求文档.md` | Draft / 新版重写输入 | C-ID、FR-ID、BR-ID、NFR-ID、AC-ID、VETO-ID、数据归属和 forbidden material 来源 |
| `projects/L1-identity/01-架构设计.md` | 已完成 | truth boundary、dependency boundary、运行 / 事件协作、data ownership 和架构红线来源 |
| `projects/L1-identity/02-概要设计.md` | Draft / 等待审核 | 主要组成部分、接口骨架、处理流、状态轮廓、异常边界和详细设计承接来源 |
| `projects/L1-identity/03-详细设计.md` | Step 19 final self-check 已完成 | object、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cuts 来源 |
| `projects/L1-identity/04-配置设计.md` | Draft / Step 15 已审核通过 | profile、adapter mode、strict config、runtime builder、redaction 和 failure/degraded 来源 |
| `projects/L1-identity/05-测试方案.md` | Draft / Step 15 assembled | TC、EV、suite、artifact/report、entry/exit、defect/retest 和 evidence gate 来源 |
| `projects/L1-identity/06-验收标准.md` | 已审核通过 | AC/VETO 裁决、P0 blocking suite、证据入口、风险接受和最终验收口径来源 |
| `projects/L1-identity/07-实施计划.md` | 旧草案 | 只作历史诊断输入;不得作为新版实施基线 |
| `design-calibration/03_ddd_step_17_implementation_handoff.md` | 已完成 | 详细设计到实施计划的承接清单和开工前复核输入 |
| `standards/document/实施计划讨论流程_SOP.md` | 当前流程标准 | Step 1~13 讨论顺序和中间产物要求 |
| `standards/document/实施计划书写规范.md` | 当前书写标准 | 正式 `07` 13 章主链、phase / commit boundary、门禁和提交纪律来源 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 当前开工门禁标准 | boundary 开工前经验复核和 blocker 暂停口径来源 |
| `standards/document/设计文档讨论中间产物规范.md` | 当前中间产物标准 | Step 文件结构、追溯、停审和分批写作纪律来源 |

---

## 3. 总流程计划

| Step | 主题 | 输入文件 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---:|---|---|---|---|---|---|---|
| 1 | 确认实施输入边界 | 新版 `00/01/02/03/04/05/06`、旧 `07`、实施计划 SOP / 规范 | `07_implementation_plan_step_01_input_boundary.md` | 无 | 已完成 | 输入基线、历史诊断、风险分类和是否允许继续讨论明确 | 已进入 Step 2 |
| 2 | 明确实施目标、范围和非范围 | Step 1、`00` 需求、`03` 契约、`06` 验收范围 | `07_implementation_plan_step_02_scope.md` | Step 1 | 已完成 | 实施目标、范围、非范围和 P0/P1/P2 实施边界闭合 | 已进入 Step 3 |
| 3 | 收稳前置条件与阅读清单 | Step 2、正式 `00~06`、规范和仓库约束 | `07_implementation_plan_step_03_prerequisites_reading.md` | Step 2 | 已完成 | 阅读清单、阶段阅读矩阵、永久记忆种子、git / 工具 / 命名检查闭合 | 已进入 Step 4 |
| 4 | 抽取实施对象与交付物 | Step 2~3、`03/05/06` | `07_implementation_plan_step_04_deliverables.md` | Step 3 | 已完成 | 代码、测试、脚本、报告和文档交付物 / 非交付物清楚 | 已进入 Step 5 |
| 5 | 设计实施阶段与依赖顺序 | Step 4、`03` handoff、`05/06` 门禁 | `07_implementation_plan_step_05_phases_dependencies.md` | Step 4 | 已完成 | PH 编号、依赖顺序、可验证增量和跨阶段红线闭合 | 已进入 Step 6 |
| 6 | 拆分阶段任务、编写顺序与提交边界 | Step 5、可落码性标准 §九 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | Step 5 | 已完成 | 每个 phase 的 commit boundary、BATCH、经验复核和停审表闭合 | 已进入 Step 7 |
| 7 | 嵌入测试与验收门禁 | Step 6、`05/06` | `07_implementation_plan_step_07_test_acceptance_gates.md` | Step 6 | 已完成 | 每个 boundary 的测试、证据、验收门禁和失败处理闭合 | 已进入 Step 8 |
| 8 | 定义配置、环境与外部依赖准备 | Step 7、`04`、仓库 / sibling 依赖约束 | `07_implementation_plan_step_08_config_environment.md` | Step 7 | 已完成 | profile、adapter、脚本、artifact/report root 和外部依赖检查闭合 | 已进入 Step 9 |
| 9 | 定义 Spike、风险与待确认事项 | Step 8、`03/04/05/06` risk / residual | `07_implementation_plan_step_09_spikes_risks.md` | Step 8 | 已完成 | Spike、blocker、deferred、residual 和暂停条件分类闭合 | 已进入 Step 10 |
| 10 | 定义回退、暂停与变更控制 | Step 9、phase / boundary 计划 | `07_implementation_plan_step_10_rollback_change_control.md` | Step 9 | 已完成 | 回退点、暂停点、设计变更、baseline 更新和重新审计规则闭合 | 已进入 Step 11 |
| 11 | 定义提交、评审与交付纪律 | Step 10、提交规范、证据门禁 | `07_implementation_plan_step_11_commit_review_delivery.md` | Step 10 | 已完成 | commit message、review、工作区安全、证据交付和设计修复后经验检查闭合 | 已进入 Step 12 |
| 12 | 定义实施完成判定 | Step 11、`06` 验收出口 | `07_implementation_plan_step_12_done_criteria.md` | Step 11 | 已完成 | 实施完成、移交实现、整体可落码审计和 acceptance readiness 口径闭合 | 已进入 Step 13 |
| 13 | 整理正式实施计划文档 | Step 1~12、书写规范 | `07_implementation_plan_step_13_formal_document_assembly.md` 与 `../07-实施计划.md` | Step 12 | 已完成 | 正式 `07` 13 章主链、校准来源、旧口径清理和全文自检完成 | 等待用户确认 / 可交给实现 agent |

---

## 4. Step 内统一执行模板

每个 `07_implementation_plan_step_*` 文件必须按以下结构落盘:

1. Step 状态
2. 本步目标
3. 本步输入
4. SOP 问题回答
5. 当前文档问题诊断
6. 改动前后对比
7. 设计取舍
8. 结构化中间产物
9. 对上游 / 下游文档的影响判定
10. 回填草稿
11. 待确认事项
12. 进入下一步条件

涉及 phase / commit boundary 的 Step 必须按以下小循环展开:

```text
Phase 可验证目标
  -> phase 依赖和前置门禁
  -> commit boundary
  -> boundary 子功能分组
  -> 代码批次和编写顺序
  -> boundary 经验适用性复核
  -> 测试 / 验收 / 证据门禁
  -> 提交 message 分组
  -> boundary 停审
```

---

## 5. 当前必须额外盯住的事项

| 编号 | 事项 | 来源 | 当前处理 |
|---|---|---|---|
| ID-IMPL-WATCH-001 | 旧 `07` 早于新版 `03/04/05/06`,包含旧入口族、旧阶段和旧版本引用 | 旧 `07` 诊断 | Step 1 降级为历史诊断输入;Step 13 重建正式文档 |
| ID-IMPL-WATCH-002 | `00/02/04/05` 仍带 Draft / assembled 状态标记 | 当前正式文档元信息 | Step 1 记为实现移交前 baseline 固定风险;不阻塞 `07` 讨论 |
| ID-IMPL-WATCH-003 | `03` 字段级契约保留在校准文件中 | `03` 正文说明 | Step 3 / Step 6 必须形成阶段阅读矩阵,不能只读正式摘要 |
| ID-IMPL-WATCH-004 | 每个 boundary 必须做可落码经验复核 | 实施计划 SOP / 可落码性标准 §九 | Step 6 必须逐 boundary 落表,不能只写“遵循标准” |
| ID-IMPL-WATCH-005 | 测试与验收证据必须嵌入实施计划 | `05/06` | Step 7 必须把 suite、artifact/report、AC/VETO 和失败处理挂到 boundary |
| ID-IMPL-WATCH-006 | 设计修复后的后序任务包含经验沉淀检查 | 实施计划 SOP Step 3 / Step 11 | Step 3 永久记忆种子与 Step 11 交付纪律必须覆盖 |
| ID-IMPL-WATCH-007 | 大文件不能一次性写完整正式 `07` | 中间产物规范 | Step 13 才装配正式文档,且按章节分批写入 |

---

## 6. 当前执行状态

| 项 | 状态 |
|---|---|
| 正式 `07-实施计划.md` | 已按 Step 1~12 中间产物重建完成 |
| 当前完成 Step | Step 13 formal assembly 已完成 |
| 当前下一步 | 等待用户确认 / 可交给实现 agent 按正式 `07` 开工 |
| 是否创建 / 替换未来 Step 文件 | 未创建未来 Step 文件 |
| 旧 `07-实施计划.md` 如何处理 | 已整体替换为新版 13 章正式实施计划;旧文档仅保留为 Step 13 诊断来源记录 |
