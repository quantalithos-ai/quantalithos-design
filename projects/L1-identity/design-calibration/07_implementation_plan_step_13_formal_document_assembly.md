# Step 13. 整理正式实施计划文档

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 13
> 回填位置: `projects/L1-identity/07-实施计划.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 整理正式实施计划文档 |
| 当前状态 | 已完成 |
| 输入基线 | Step 1~12 中间产物、正式 `00/01/02/03/04/05/06`、实施计划书写规范 |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_13_formal_document_assembly.md` 与 `projects/L1-identity/07-实施计划.md` |
| 正式文档状态 | 本 Step 允许重建正式 `07-实施计划.md` |
| 停审方式 | 先建章节装配计划,再按正式 13 章装配,最后做旧口径、外项目残留、证据路径和格式检查 |

## 2. 本步目标

本 Step 将 Step 1~12 已完成的中间产物装配为正式 `07-实施计划.md`。

本 Step 只回答:

- 正式 `07` 是否覆盖实施计划书写规范要求的 13 章主链。
- 每一章是否来自已确认中间产物。
- 旧版 `07` 中旧命令、旧阶段、旧技术假设是否被清理。
- phase、commit boundary、GATE、artifact/report、提交纪律和完成判定是否一致。
- 是否仍存在未解释的占位、空表、旧口径或上游真相源越界。

本 Step 不新增 `03/04/05/06` 未定义的 schema、port、状态、测试用例、evidence schema 或验收结论。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `实施计划讨论流程_SOP.md` Step 13 | 当前标准 | 提供正式装配问题、章节主链和执行约束 |
| `实施计划书写规范.md` §3、§5 | 当前标准 | 提供正式 13 章主链和各章写法要求 |
| `设计文档讨论中间产物规范.md` §3 | 当前标准 | 提供中间产物到正式文档装配纪律 |
| `07_implementation_plan_calibration_flow.md` | 已更新到 Step 13 | 提供总流程状态和装配工作台 |
| `07_implementation_plan_step_01_input_boundary.md` | 已完成 | §1 来源 |
| `07_implementation_plan_step_02_scope.md` | 已完成 | §2 来源 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已完成 | §3 来源 |
| `07_implementation_plan_step_04_deliverables.md` | 已完成 | §4 来源 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 已完成 | §5 来源 |
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 已完成 | §6 来源 |
| `07_implementation_plan_step_07_test_acceptance_gates.md` | 已完成 | §7 来源 |
| `07_implementation_plan_step_08_config_environment.md` | 已完成 | §8 来源 |
| `07_implementation_plan_step_09_spikes_risks.md` | 已完成 | §9 来源 |
| `07_implementation_plan_step_10_rollback_change_control.md` | 已完成 | §10 来源 |
| `07_implementation_plan_step_11_commit_review_delivery.md` | 已完成 | §11 来源 |
| `07_implementation_plan_step_12_done_criteria.md` | 已完成 | §12 来源 |
| 旧 `projects/L1-identity/07-实施计划.md` | 历史诊断输入 | 只用于确认旧口径需要替换 |

## 4. 模块计划 / 模块目录

| 模块 | 目标 | 输入 | 输出 | 停审门禁 |
|---|---|---|---|---|
| M1 Step 13 规则与旧文档诊断 | 固定正式装配规则和旧文档替换原因 | SOP Step 13、旧 `07` | 装配规则和旧口径诊断 | 不继承旧阶段或旧命令 |
| M2 章节装配映射 | 将 13 章映射到 Step 1~12 中间产物 | Step 1~12 | 章节来源表 | 每章来源明确 |
| M3 正式文档框架 | 建立正式 `07` 13 章主链 | 书写规范 §3 | 正式文档骨架 | 无占位章节 |
| M4 核心表装配 | 装配 phase、commit boundary、GATE、交付物、风险、完成判定核心表 | Step 4~12 | 正式正文 | 不复制详细设计字段表 |
| M5 旧口径与越界清理 | 清理旧 identity 名、外项目残留、`latest` 证据、静态 pass 风险 | Step 1、检查规则 | 检查结果 | 扫描通过 |
| M6 最终停审 | 执行格式、残留和 diff 检查,更新流程状态 | M1~M5 | 停审记录 | `git diff --check` 通过 |

### 4.1 模块思考与写入记录

| 模块 | 思考重点 | 写入位置 | 局部停审结论 |
|---|---|---|---|
| M1 | 旧 `07` 是 2026-05 旧草案,包含旧入口名和旧五阶段,不能局部修补 | §6 | 通过 |
| M2 | 正式文档每章必须能回指 Step 1~12 中间产物 | §9.1 | 通过 |
| M3 | 正式文档使用 13 章主链,不保留旧章节结构 | 正式 `07` | 通过 |
| M4 | 正式文档应收敛为可执行计划,不把 12 个 Step 全文照搬 | 正式 `07` | 通过 |
| M5 | 装配后必须跑旧名、外项目、非正式 EV、敏感赋值和行尾空白扫描 | §9.3 | 通过 |
| M6 | Step 13 完成后更新工作台和任务清单 | §13 | 通过 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 正式文档是否完整覆盖书写规范章节主链? | 是,正式 `07` 使用 §1~§13 主链。 |
| 每一章是否来自已确认中间产物? | 是,见 §9.1 章节装配映射表。 |
| 阶段编号、任务编号和门禁编号是否一致? | 正式文档只使用 PH-01~PH-08、commit-01-a~commit-08-c、GATE-01~12。 |
| 上游引用、测试引用和验收引用是否准确? | 正式文档引用新版 `00/01/02/03/04/05/06` 和对应 `design-calibration` 中间产物。 |
| 是否存在详细设计内容被复制进实施计划? | 正式文档只列实现顺序、交付物、门禁和检查项,不复制字段、DDL、完整 flow 或对象契约。 |
| 每个 phase / commit boundary 是否都有开工前字段、DTO、状态、证据和 phase boundary 复核? | Step 6 已完成经验复核,正式文档在 §6 和 §12 保留审计表。 |
| 正式 `07` 是否包含交付实现前可落码闭环审计门禁、审计表和永久记忆种子? | 是,§3 写入永久记忆种子,§12 写入整体审计门禁。 |
| 是否存在未解释的空表、空图或占位内容? | 正式文档不得保留空表或占位;真实运行值用 `<run_id>` 这类正式变量表示。 |

## 6. 当前文档问题诊断

| 旧文档位置 | 问题 | 本 Step 处理 |
|---|---|---|
| 文档元信息 | 旧基线是 2026-05 版本,缺新版 `04` 和新版 `03/05/06` 校准口径 | 重建元信息和变更记录 |
| 旧 §1 阅读清单 | 引用旧 ADR / product / domain 文档和旧版本号 | 改为新版 `00~06`、标准和 calibration reading matrix |
| 旧阅读确认 | 含旧命令和旧对象名 | 全部删除,改为正式 protocol inventory |
| 旧阶段 | 五阶段旧工程路径 | 改为 PH-01~PH-08 |
| 旧 Spike | 围绕旧 SQLx/PostgreSQL/outbox 实现假设 | 改为 Step 9 正式 blocker / spike / risk |
| 旧 commit / footer | footer 大小写与当前标准不一致 | 改为 Step 11 固定 footer |
| 旧测试和验收 | 不包含 GATE-01~12 和 run-scoped evidence | 改为 Step 7 / Step 12 规则 |

## 7. 改动前后对比

| 议题 | 旧正式 `07` | 新正式 `07` |
|---|---|---|
| 输入基线 | 旧 `00/01/02/03/05/06` 版本号 | 新版 `00/01/02/03/04/05/06` 与 Step 1~12 |
| 组织轴 | 旧五阶段编码路径 | PH-01~PH-08 可验证增量 |
| 提交边界 | 粗略提交规则 | commit-01-a~commit-08-c |
| 门禁 | 泛化 rustfmt / clippy / test | GATE-01~12 + artifact/report/acceptance |
| 设计闭环 | 实现遇阻再回写 | 开工前和移交前逐 boundary 审计 |
| 证据 | 未绑定 run-scoped paths | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 完成判定 | 阶段检查点 | 实施完成、实现移交、验收就绪分层 |

## 8. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否局部修旧 `07` | A. 局部修补;B. 整体重建 | 采用 B。旧结构与新版详细设计和测试验收不兼容。 |
| 正式文档是否照搬 Step 1~12 全文 | A. 全文照搬;B. 摘要装配核心表 | 采用 B。正式文档要可执行,中间产物保留追溯细节。 |
| 是否在正式 `07` 写完整对象字段 | A. 写;B. 不写 | 采用 B。字段、状态和 flow 归 `03`。 |
| 是否在正式 `07` 给真实完成结论 | A. 给;B. 只给完成判定规则 | 采用 B。真实通过 / 不通过由实现和验收运行后裁决。 |

## 9. 结构化中间产物

### 9.1 章节装配映射表

| 正式章节 | 校准来源 | 装配策略 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 写输入基线、旧文档地位、不得补设计 |
| §2 实施目标与范围 | Step 2 | 写 P0/P1/P2、范围和非范围 |
| §3 实施前置条件与阅读清单 | Step 3 | 写阅读矩阵、git 配置、永久记忆种子 |
| §4 实施对象与交付物清单 | Step 4 | 写交付物摘要和非交付物 |
| §5 实施阶段与依赖顺序 | Step 5 | 写 PH-01~PH-08 总表 |
| §6 阶段任务拆分、编写顺序与提交边界 | Step 6 | 写 commit boundary 总表和开工前复核 |
| §7 测试与验收门禁嵌入 | Step 7 | 写 GATE-01~12 和 boundary gate 映射 |
| §8 配置、环境与外部依赖准备 | Step 8 | 写 profile / adapter / dependency / output root |
| §9 Spike、风险与待确认事项 | Step 9 | 写 blocker / spike / risk / residual / open question |
| §10 回退、暂停与变更控制 | Step 10 | 写 pause / rollback / change / resume |
| §11 提交、评审与交付纪律 | Step 11 | 写 commit message / review / delivery |
| §12 实施完成判定 | Step 12 | 写 done criteria / audit / evidence checklist |
| §13 参考 | Step 1~12 和标准 | 写正式参考清单 |

### 9.2 正式文档装配门禁

| 门禁 | 通过条件 |
|---|---|
| 章节主链 | §1~§13 全部存在 |
| 来源追溯 | 每章有 calibration 来源说明 |
| 旧口径清理 | 旧命令 / 旧对象 / 旧阶段不出现 |
| 外项目残留 | 外项目编号、对象或仓名不出现 |
| 非正式 evidence | 不出现废弃 EV family 或候选 EV |
| 敏感赋值 | 不出现 secret/token/password 等赋值模式 |
| 格式 | 无行尾空白,`git diff --check` 通过 |

## 10. 对上游 / 下游文档的影响判定

| 文档 | 是否需要回写 | 理由 | 处理 |
|---|---|---|---|
| `03-详细设计.md` | 否 | 装配不改变设计契约 | 无需回写 |
| `04-配置设计.md` | 否 | 装配只引用 profile/config 规则 | 无需回写 |
| `05-测试方案.md` | 否 | 装配不新增 TC/EV/artifact schema | 无需回写 |
| `06-验收标准.md` | 否 | 装配不替代验收结论 | 无需回写 |
| `07-实施计划.md` | 是 | 本 Step 正式重建 | 已完成 |

## 11. 回填草稿

本 Step 的回填草稿就是正式 `projects/L1-identity/07-实施计划.md`。正式文档必须按 §9.1 的章节装配映射生成。

## 12. 待确认事项

| 事项 | 影响 | 后续处理 |
|---|---|---|
| 正式 `07` 装配后的实际 design baseline commit | 实现移交 | 装配后由提交记录固定 |
| 目标实现仓 reality check | PH-01 开工 | 实现 agent 按 §3 / §8 / §9 检查 |
| 是否出现新增可复用经验 | 标准更新 | 本轮装配未发现新增经验;实现 blocker 触发时按 §11 处理 |

## 13. 进入下一步条件

| 条件 | 结论 |
|---|---|
| Step 13 装配中间产物已创建 | 通过 |
| 正式 `07` 已按 13 章主链重建 | 通过 |
| 旧 identity 残留扫描 | 通过 |
| governance 残留扫描 | 通过 |
| 非正式 EV 扫描 | 通过 |
| 敏感赋值扫描 | 通过 |
| 行尾空白扫描 | 通过 |
| `git diff --check` | 通过 |
| 下一步 | 等待用户确认,或交给实现 agent 按正式 `07` 开工 |
