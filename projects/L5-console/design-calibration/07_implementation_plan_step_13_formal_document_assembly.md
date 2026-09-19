# Step 13. 整理正式实施计划文档

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 13
> 回填目标：`projects/L5-console/07-实施计划.md`
> 参考书写规范：`standards/document/实施计划书写规范.md`
> 参考台账规范：`standards/document/代码实施台账与门禁规范.md`
> 执行模式：`full-restart + single-agent-serial`

## 1. Step 状态与输入确认

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 · 整理正式实施计划文档 |
| 当前状态 | `in_progress`；本文件完成后才允许正式 07 full-restart 装配 |
| 输入 | Step 1～12 calibration、正式 `00`～`06`、实施计划 SOP/书写规范、代码实施台账规范 |
| 输出 | 正式 `07-实施计划.md`、`implementation_execution_ledger.md`、22 个 planned boundary skeleton |
| 当前实现事实 | `implementation_repo=not_created`、`design_baseline=not_fixed`、run/artifact/report/evidence/commit 均未创建 |
| 写入授权 | 仅本 Step 允许创建正式 07 和 planned 台账骨架；不允许实现、测试或提交 |

Step 12 已完成并停审。其 `not_entered / blocked_by_missing_implementation_repo_and_baseline` 是当前事实，不得在正式文档装配时改写为完成、通过、签署或 readiness。

## 2. 本步输入与章节来源映射

| 正式章节 | 主要 calibration 来源 | 正式上游/规范入口 | 装配口径 |
|---|---|---|---|
| §1 与上游文档的关系声明 | `07_implementation_plan_step_01_input_boundary.md` | 正式 `00`～`06`、全局依赖规则、真相源标准 | 声明 07 只转译实施路径，不重定义真相；保留目标仓和合同 blocker |
| §2 实施目标与范围 | `07_implementation_plan_step_02_scope.md` | 正式 `00` §4/§5/§9、`03`、`05`、`06` | 只列 P0 行为/安全/证据范围；P1/P2 和未闭合同不得伪装成正向交付 |
| §3 前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | 正式 `00`～`06`、TS/目录/真相源/台账规范 | 给出阶段阅读矩阵、永久记忆规则、仓与 baseline 门禁 |
| §4 实施对象与交付物清单 | `07_implementation_plan_step_04_deliverables.md` | 正式 `03` §4～§17、`04`、`05`、`06` | 按模块、协议族、配置、测试、脚本、证据和 handoff 交付面摘要 |
| §5 实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | 正式 `03`、`05`、`06` | 保留 PH-01～PH-08 及依赖驱动的可验证增量 |
| §6 阶段任务拆分、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commits.md` | 代码实施台账规范、可落码性标准 §九 | 保留统一编写顺序、22 boundary 总表、开工前闭环复核和台账规则 |
| §7 测试与验收门禁嵌入 | `07_implementation_plan_step_07_test_acceptance_gates.md` | 正式 `05` §8～§15、`06` §3/§5/§10/§11 | 只定义 planned gate、证据配对、失败处理和人工审查，不产生测试结果或验收 verdict |
| §8 配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment_dependencies.md` | 正式 `04` §3～§13、`03` §14、`05` §8 | 保留四项配置、三 profile、strict/startup-only/fail-closed 和 fake/disabled 边界 |
| §9 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | 正式 `01`/`03`/`04`/`05`/`06` | 保留 blocker、residual、Spike、OQ 和回写目标，不把 pending 变成 positive |
| §10 回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | 正式 `06` 缺陷/复验/风险规则、台账规范 | 保留 pause/rollback/change/recovery 矩阵与失败证据保留纪律 |
| §11 提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | 代码实施台账规范、项目提交纪律 | 保留一 boundary 一 commit、英文实现仓 message、审查和 handoff 字段 |
| §12 实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | 正式 `06` §11～§14、`05` §13～§15 | 保留四类执行期结果、VETO/S、证据和设计闭环硬条件；当前只写 not_entered 事实 |
| §13 参考 | 本文件 §2、各 Step 文件、规范清单 | `standards/document/*` | 提供可追溯来源，不新增实施结论 |

## 3. SOP 八问回答

| 问题 | 本项目结论 | 证据/处理 |
|---|---|---|
| 1. 正式文档是否完整覆盖书写规范章节主链？ | 是，使用 13 个固定章节，顺序与书写规范一致。 | §4 完整性清单；正式文档每章有来源块 |
| 2. 每一章是否来自已确认中间产物？ | 是。§1～§12 一一映射 Step 1～12；§13 映射本 Step 和规范。 | 不在正式正文引入未在 calibration 出现的新 phase、boundary、gate 或数字 |
| 3. 阶段、任务、门禁编号是否一致？ | 保留 `PH-01`～`PH-08`、`commit-01-a`～`commit-08-c`、正式 `TC/AC/VETO/EV` 编号。 | 22 boundary 逐项交叉审计；不沿用旧文档编号 |
| 4. 上游、测试和验收引用是否准确？ | 正式 `00`～`06` 是真相源；calibration 是决策追溯；`06` 保留最终 verdict/signoff/readiness 权限。 | §1、§3、§7、§12 明确冲突处理 |
| 5. 是否把详细设计复制进实施计划？ | 不复制字段级 DTO、完整状态矩阵、函数协议或测试用例正文；只保留实施所需索引、边界和门禁。 | 详细契约回指正式 `03`/`05`/`06` |
| 6. 每个 phase/boundary 是否有开工前闭环复核？ | 是。§6 规定字段/DTO/state、query/no-write、scope/ref、reconcile/idempotency、config、evidence 和 phase boundary 复核；缺口即 blocked。 | Step 6/12 复核矩阵；22 台账骨架各自保留入口 |
| 7. 是否包含可落码闭环审计与台账交接？ | 是。正式 §3、§6、§12 及项目级/边界级台账路径均明确；台账不是实现授权。 | `implementation_execution_ledger.md` 和 22 skeleton 同步创建 |
| 8. 是否存在空表、占位或历史污染？ | 装配后逐章检查；运行期变量（如 `<run_id>`）会显式说明为变量，不伪造值；README/旧正式文档只登记为 historical_material。 | §5 审计清单；Step 1/12 事实边界 |

## 4. 正式文档装配原则

1. **来源先行**：每章开头列出具体 calibration 文件和延伸阅读小节；正文只承载已收敛结论。
2. **实施层摘要**：阶段、boundary、门禁、配置准备、风险、回退、提交和交付规则进入正式 07；详细设计字段、协议和测试用例回指上游。
3. **编号不漂移**：PH、boundary、TC、AC、VETO、EV、blocker/residual/OQ 编号沿用已确认文件；不得为方便装配重新编号。
4. **计划不冒充执行**：`planned`、`pending`、`blocked`、`waiting` 只表达未来或当前阻塞；不得写真实 hash、run、artifact、report、evidence、verdict、signoff 或 readiness。
5. **失败可恢复**：每个 phase/boundary 都必须有 required reads、allowed/forbidden scope、gate、失败动作和 handoff 入口。
6. **台账先于实现**：正式 07 与全部 boundary skeleton 先落盘；目标实现仓不存在时维持 `not_created`，不在设计仓写代码。
7. **最终裁决分层**：07 只定义实施可送验条件；06 仍拥有验收 verdict、signoff 和 readiness。

## 5. 13 章完整性检查

| 检查项 | 通过条件 | 本 Step 结果 |
|---|---|---|
| 章节主链 | §1～§13 均存在且顺序固定 | `pass / after_assembly` |
| 来源块 | 每章有具体 Step 文件、延伸阅读说明 | `planned_for_formal_07` |
| 目标与非范围 | P0/P1/P2 分层，未引入未授权 scope | `pass` |
| 阅读矩阵 | 阶段/边界阅读来源可定位 | `pass` |
| 交付物 | 十模块、5 Command、16 Query、1 conditional consumer、四配置、测试/证据面明确 | `pass` |
| 阶段 | 8 phase 依赖图、阶段门禁和停审口径明确 | `pass` |
| boundary | 22 项唯一、无遗漏、无重复 | `pass` |
| 门禁 | 19 test cut、96 planned TC、7 VETO 的计划入口保真 | `pass` |
| 配置/环境 | 四 key、三 profile、strict/startup-only/fail-closed、fake/disabled 口径一致 | `pass` |
| 风险/OQ | blocker、residual、pending 有 owner/trigger 或回写目标 | `pass` |
| 回退/暂停 | 失败证据保留、非破坏回退、设计回写路径明确 | `pass` |
| 提交/交付 | 一 boundary 一 commit、英文实现仓 message、review/handoff 规则明确 | `pass` |
| 完成判定 | 完成/有条件完成/不完成/not_entered 分界和证据门槛明确 | `pass` |
| 事实诚实 | 当前无实现仓/baseline/run/evidence，正式文档不填假事实 | `pass` |

## 6. Phase、boundary 与编号一致性审计

### 6.1 Phase 审计

| phase | 正式名称 | 依赖 | boundary 数 | 结果 |
|---|---|---|---:|---|
| PH-01 | package/config/test-evidence skeleton | 无 | 2 | `pass` |
| PH-02 | entry/access/navigation shell | PH-01 | 2 | `pass` |
| PH-03 | safe views + 8 Core Query | PH-02 | 3 | `pass` |
| PH-04 | intent/state + 5 Command safety | PH-03 | 3 | `pass` |
| PH-05 | eight topic owner partition | PH-04 | 3 | `pass` |
| PH-06 | recovery/a11y/diagnostics | PH-05 | 3 | `pass` |
| PH-07 | runtime adapters + conditional invalidation | PH-06 | 3 | `pass` |
| PH-08 | release evidence/handoff | PH-07 | 3 | `pass` |
| **合计** |  |  | **22** | `pass` |

### 6.2 Boundary 审计

```text
PH-01: commit-01-a, commit-01-b
PH-02: commit-02-a, commit-02-b
PH-03: commit-03-a, commit-03-b, commit-03-c
PH-04: commit-04-a, commit-04-b, commit-04-c
PH-05: commit-05-a, commit-05-b, commit-05-c
PH-06: commit-06-a, commit-06-b, commit-06-c
PH-07: commit-07-a, commit-07-b, commit-07-c
PH-08: commit-08-a, commit-08-b, commit-08-c
```

审计结论：22 个 boundary 与 Step 6 总表逐项相同；没有使用旧项目的 `-d` boundary，也没有把 0 Event/0 Job 伪造为缺失实现。所有未来 boundary 台账在装配后必须是 `planned / wait_until_current`，只有项目级台账当前边界可进入 `blocked / wait_design`。

## 7. 空表、占位、历史污染与事实诚实审计

| 审计面 | 禁止内容 | 装配处理 |
|---|---|---|
| 空表 | 无列值、无解释的空表 | 删除或改为明确的 planned/blocked 状态表；不保留空表 |
| 占位 | `TBD`、`待补` 被当作已定事实 | 改写为 `pending`、`blocked`、`residual`，同时给 owner/trigger/回写入口 |
| 运行变量 | `<run_id>`、`<design_baseline>` 等被误读为真实值 | 明确标注“运行期变量/执行期填写”；当前台账写 `not_fixed` 或 `not_created` |
| 历史材料 | README、旧 07、draft 的 Provider Contract、固定数字、框架和阈值 | 仅在 §1/§13 作为 historical_material/污染审计来源，不继承结论 |
| 执行事实 | 伪造仓、hash、测试结果、artifact/report/evidence、verdict/signoff/readiness | 全部保持 absent/not_created/not_entered；不创建实现仓或运行测试 |
| 真相越界 | Console 拥有 owner truth、DB、projection、repository、outbox、worker、job | 在 §1/§2/§4/§6/§8 明示 forbidden scope |

## 8. 剩余风险与停审条件

| 编号 | 类型 | 当前事实 | 正式 07 处理 | 是否阻断本 Step |
|---|---|---|---|---|
| `BLK-CON-07-001` | blocker | `/home/aris/Projects/quantalithos-console` 不存在 | PH-01 前置条件；台账 `blocked / wait_design` | 不阻断文档装配 |
| `BLK-CON-07-002` | blocker | exact owner/SDK query、command、result、ref、scope、qualification、safe-field、reconcile、idempotency 未闭合 | 继续 `blocked/conditional`；不得 positive binding | 不阻断文档装配 |
| `BLK-CON-07-003` | blocker | immutable design/delivery/environment/dependency baseline 未固定 | 实现移交前必须固定 | 不阻断文档装配 |
| `RES-CON-07-001` | residual | browser/AT matrix、carrier medium、diagnostic sink/envelope、量化 authority pending | 记为 residual/future，不宣称 selected pass | 不阻断文档装配 |
| `RES-CON-07-002` | residual | framework/router/bundler/package manager/host lifecycle pending | 由 PH-01/PH-02 开工前确认 | 不阻断文档装配 |
| `CON-Q-034～047` | conditional/open | 上游 positive contract 未闭合 | 保留 open/pending；不得变为 integration/readiness | 不阻断文档装配 |

本 Step 停审条件：正式 07、项目级实施台账和 22 个 boundary skeleton 创建并通过章节/编号/事实审计；然后立即切换 `formal_stop_review`。停审后不进入代码实现、项目测试、真实 evidence 生成或 commit。

## 9. 回填与装配记录

正式文档按以下顺序 full-restart 装配：

1. 创建标题、状态声明和 §1～§13 框架。
2. 回填 §1～§4 的输入、范围、阅读和交付物。
3. 回填 §5～§6 的 phase、任务、22 boundary、台账与闭环复核。
4. 回填 §7～§8 的测试/验收门禁、配置、环境和外部依赖。
5. 回填 §9～§12 的风险、回退、提交纪律和完成判定。
6. 回填 §13 参考、来源索引和历史材料说明。
7. 创建实施 ledger 与全部 planned boundary skeleton；执行 `git diff --check -- projects/L5-console` 及静态一致性检查。

## 10. Step 自审记录

- [x] 已读取并核对 Step 12、实施计划 Step 13 SOP/书写规范、代码实施台账规范、当前 flow/项目台账和 L1-governance 粒度参考。
- [x] 已回答 Step 13 八个 SOP 问题。
- [x] 已完成 13 章来源映射、装配原则、章节完整性、phase/boundary/编号审计规则。
- [x] 已定义空表、占位、历史污染和执行事实审计规则。
- [x] 已保留 `BLK-CON-07-001～003`、`RES-CON-07-001～002` 与 `CON-Q-034～047` 的 blocker/conditional/residual 状态。
- [x] 未创建实现仓、源码、测试、run、artifact/report/evidence、verdict、signoff 或 commit。

## 11. Step 13 进入正式装配结论

Step 13 校准稿 `pass / ready_for_full_restart_assembly`。下一动作仅为在 `projects/L5-console/` 内创建正式 `07-实施计划.md`、项目级 `implementation_execution_ledger.md` 和全部 22 个 planned boundary skeleton；装配完成后立即停审。任何实现授权、测试执行授权或提交授权均不由本 Step 产生。
