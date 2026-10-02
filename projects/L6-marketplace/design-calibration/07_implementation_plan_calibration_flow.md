# L6-marketplace 07 实施计划校准流程

## 工作方式

- 模式：`full-restart / single-agent / design-only`。
- 本轮只修改 `projects/L6-marketplace/` 下的实施计划校准产物、正式 `07-实施计划.md`、implementation ledger 与 boundary skeleton；审计发现本项目正式真相源冲突时，先登记并最小回修对应 calibration/正式文档。不实现代码、不创建实现仓、不执行业务测试、不提交 commit。
- 严格按 `Step 1 -> Step 13` 执行。每个 Step 先恢复读取项目台账与本 flow，再读取该 Step 适用 SOP/规范和前序输入，完成“问题回答 -> 诊断 -> 取舍 -> 结构化产物 -> 回填草稿 -> 自检/停审”。
- 用户已明确授权本轮完成全部 07，因此各 Step 在本轮连续推进；每个 Step 的 `stop_review` 只表示该 Step 的设计门禁，不表示真实实现或外部资格通过。
- 正式 07 必须在 Step 13 先删除旧稿（若存在），重新建立 13 章骨架，再按批次装配；正式章节只能承载收口结论，并引用具体校准文件。
- 所有实现目标、phase、commit boundary、测试、artifact、report、evidence、签署和 readiness 均只能写成 `planned`、`blocked` 或 `waiting`，不得伪造实际结果。

## 规范输入

| 规范 / 来源 | 用途 | 状态 |
|---|---|---|
| `standards/document/实施计划讨论流程_SOP.md` | 13 Step 讨论顺序、问题集、停审门禁 | 已读取 |
| `standards/document/实施计划书写规范.md` | 正式 07 章节、phase、提交、证据和 ASCII 图规则 | 已读取适用章节 |
| `standards/document/设计文档讨论中间产物规范.md` | full-restart、三层台账、Step 产物格式、写入批次 | 已读取适用章节 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 每个 phase/boundary 的字段、DTO、状态、证据和 phase boundary 复核 | 已读取适用章节 |
| `standards/document/代码实施台账与门禁规范.md` | implementation ledger、planned boundary skeleton、Gate Matrix | 已读取 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓、workspace、scripts、artifact/report 目录口径 | 已读取 |
| 正式 `00/01/02/03/04/05/06` | 当前 design baseline | 已读取 |
| 九个专项上游正式文档及必要台账 | consumer/adapter/owner 资格与阻断边界 | 已读取；正向资格仍 pending/blocked |

## Step 状态

- [x] Step 1. 确认实施输入边界
- [x] Step 2. 明确实施目标、范围和非范围
- [x] Step 3. 收稳前置条件与阅读清单
- [x] Step 4. 抽取实施对象与交付物
- [x] Step 5. 设计实施阶段与依赖顺序
- [x] Step 6. 拆分阶段任务、编写顺序与提交边界
- [x] Step 7. 嵌入测试与验收门禁
- [x] Step 8. 定义配置、环境与外部依赖准备
- [x] Step 9. 定义 Spike、风险与待确认事项
- [x] Step 10. 定义回退、暂停与变更控制
- [x] Step 11. 定义提交、评审与交付纪律
- [x] Step 12. 定义实施完成判定
- [x] Step 13. 整理正式实施计划文档

## 当前恢复点

| 字段 | 当前值 |
|---|---|
| 当前文档 | 07 实施计划 |
| 当前 Step | Step 13 completed / selfcheck_done / stop_review |
| gate_status | `pass`（design-only；实际文档静态检查通过） |
| next_allowed_action | `waiting_user_confirmation` |
| 正式文档 | 13章已按A～E装配；37文件与完整库存静态检查通过，等待用户确认 |
| implementation ledger | 1项目台账+15planned骨架已重写；current=none、全部实际Gate未执行 |
| 外部资格 | `MP-UP-001~008`、`MP-SRC-003/010/013`、`Q-MP-01`、`R-MP-DDD-01~10` 仍未关闭 |

### Step13 定向回修恢复记录

05 Context要求真实implementation_commit/generator_commit；未提交源码不能用旧HEAD或占位hash生成正式材料。已在Step3/5/6/7/11/12/13、库存附录与全部骨架闭合“提交前非合格诊断→提交后固定源码/newrun→Handoff”，并传播正式07；07-a最终98EV/六artifact/六seal/draft必须在提交后，新结果合格前不激活07-b。MEM-MP-006已机械刷新，仍保留十个种子；不放宽05/06required集合、不新增schema字段、不实际提交。本批已通过实际静态核验，只设计，后续等待用户确认。

## Step 产物索引

| Step | 文件 | 回填章节 | 状态 |
|---:|---|---|---|
| 01 | `07_implementation_plan_step_01_input_boundary.md` | §1 | completed / selfcheck_done / stop_review |
| 02 | `07_implementation_plan_step_02_scope.md` | §2 | completed / selfcheck_done / stop_review |
| 03 | `07_implementation_plan_step_03_prerequisites_reads.md` | §3 | completed / selfcheck_done / stop_review |
| 04 | `07_implementation_plan_step_04_delivery_inventory.md` | §4 | completed / selfcheck_done / stop_review |
| 05 | `07_implementation_plan_step_05_phases.md` | §5 | completed / selfcheck_done / stop_review |
| 06 | `07_implementation_plan_step_06_tasks_boundaries.md` | §6 | completed / selfcheck_done / stop_review |
| 07 | `07_implementation_plan_step_07_test_acceptance_gates.md` | §7 | completed / selfcheck_done / stop_review |
| 08 | `07_implementation_plan_step_08_config_environment_dependencies.md` | §8 | completed / selfcheck_done / stop_review |
| 09 | `07_implementation_plan_step_09_spikes_risks.md` | §9 | completed / selfcheck_done / stop_review |
| 10 | `07_implementation_plan_step_10_rollback_pause_change.md` | §10 | completed / selfcheck_done / stop_review |
| 11 | `07_implementation_plan_step_11_commit_review_delivery.md` | §11 | completed / selfcheck_done / stop_review |
| 12 | `07_implementation_plan_step_12_completion.md` | §12 | completed / selfcheck_done / stop_review |
| 13 | `07_implementation_plan_step_13_formal_assembly.md` | §13 | completed / selfcheck_done / stop_review / waiting_user_confirmation |

## 07 真实性与停止规则

- 目标实现仓 `/home/aris/Projects/quantalithos-marketplace` 当前不存在；本轮不创建。
- 不生成真实 `Cargo.lock`、migration、artifact、run、report、digest、scan、signature、payment、evidence、verdict、signoff 或 readiness。
- Billing、支付、订阅、收入分成、跨境交易、Archive market lane、生产 canonical event/outbox 均保持 `future/blocker` 或 `0 active`。
- planned boundary skeleton 只作为实现移交前的台账骨架，不授权任何实现；未来 boundary 必须是 `status=planned` 且 `next_allowed_action=wait_until_current`。
- 完成 Step 13 后立即停审，等待用户确认；不得自动进入实现阶段或其他文档。

## 07正式完成停审记录

当前agent单独完成13 Step及其定向回修，正式07按A～E装配13章。实际静态核对覆盖37文件、13固定十段/183问题、7phase/15串行boundary、49task/flow、215path、98TC/EV、11suite、55×15经验、15阅读矩阵和10种子/22工具；修复后检查退出0。详情见[静态记录](07_implementation_static_review_record.md)。仅文档检查，未实现、运行业务测试、生成EV或提交。

全部15骨架planned/wait_until_current、current=none，actualGate pending/blocked，baseline未冻结。上游资格及future/capacity缺口不关闭。现在`completed / selfcheck_done / stop_review / waiting_user_confirmation`；下一动作只等待用户确认07，未经额外授权不进入实现，不需要提交commit。
