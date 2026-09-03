# L2-member-images 05 测试方案 Step 15：正式文档装配与总审计

> 状态：`completed_stop_review`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 15
> 输出：`projects/L2-member-images/05-测试方案.md`

## 0. Step 状态与装配范围

| 项目 | 记录 |
|---|---|
| 前置条件 | Step 1~14 已完成；每一步均有问题回答、诊断、取舍、结构化产物、回填草稿、待确认事项和进入下一步条件。 |
| 本步目标 | 删除旧正式 05 并按测试方案规范固定 15 章重建；逐章标注 calibration 来源，完成跨 Step、协议、状态、证据和污染总审计。 |
| 本步允许 | 重建正式 05、更新 05 flow/项目台账、静态审计。 |
| 本步禁止 | 修改 06、创建 07/implementation ledger/planned boundary skeleton、运行测试、生成报告/证据、提交 commit。 |
| 装配状态 | `completed_stop_review`；旧正式 05 已删除并按固定 15 章重建，完成静态总审计后停在 05。 |

### 0.1 Step 内计划

- [x] 读取项目台账、05 flow、Step 1~14、正式 00~04 与相关 03/04 handoff。
- [x] 诊断旧正式 05 污染和当前 TC/EV 断链。
- [x] 统一 TC / EV / suite / future-06 交接规划口径。
- [x] 删除旧正式 05，创建固定 15 章骨架并分批回填。
- [x] 完成跨文档、路径、命名、禁止项和无执行事实静态审计。
- [x] 同步 flow、Step 15、项目台账为 `completed_stop_review` 并停在 05。

## 1. 装配规则与章节来源

| 正式章节 | 唯一/主要校准来源 |
|---:|---|
| 1 | `05_test_plan_step_01_input_boundary.md` |
| 2 | `05_test_plan_step_02_scope.md` |
| 3 | `05_test_plan_step_03_test_objects_cuts.md` |
| 4 | `05_test_plan_step_04_strategy_layers.md` |
| 5 | `05_test_plan_step_05_traceability_coverage.md` |
| 6 | `05_test_plan_step_06_cases.md` |
| 7 | `05_test_plan_step_07_test_data.md` |
| 8 | `05_test_plan_step_08_environment_config.md` |
| 9 | `05_test_plan_step_09_automation_gates.md` |
| 10 | `05_test_plan_step_10_nonfunctional.md` |
| 11 | `05_test_plan_step_11_defects_retest.md` |
| 12 | `05_test_plan_step_12_entry_exit.md` |
| 13 | `05_test_plan_step_13_evidence.md` |
| 14 | `05_test_plan_step_14_regression_risks.md` |
| 15 | 本文件与 Step 1~14 总审计 |

## 2. 当前材料问题诊断

旧正式 05 不是当前 authority：含旧 persona/toolset/seed/publish 主线、非当前编号、未按新版 15 章组织，且可能带有执行/报告暗示。按 full-restart 处理，不在旧文件上追加新用例；仅在正式第 15 章参考和本审计中说明污染隔离。

## 3. 跨 Step 总审计（装配前审计）

| 审计面 | 结论 | 处理 |
|---|---|---|
| 章节完整性 | 通过 | 固定 15 章名称，章号连续，无额外主链章节 |
| 来源追溯 | 通过 | 每章正文前列具体 Step 文件和延伸阅读小节 |
| 协议覆盖 | 通过（planned） | 10 Command、10 Query、2 inbound、6 Job、0 outbound 均有入口；TC 族已统一并通过 suite/EV 映射审计 |
| 状态覆盖 | 通过（planned） | 19 状态矩阵/20 local lifecycle subjects 回指 03；不合并为 ready |
| 一致性覆盖 | 通过（blocked-aware） | version/UoW/append-only/idempotency/commit unknown 有 TC 方向；B01/B02/OPEN/PF 保持 blocker |
| 配置覆盖 | 通过 | 04 五域 21 key、strict JSON、profile、source、redaction、startup-only/fail-closed 有测试入口 |
| 证据路径 | 通过（planned） | 固定 artifacts/reports/scripts 路径；EV family 已统一 Step 5/9/10/14 引用；无 run、digest、report、EV 实例 |
| owner 边界 | 通过 | sibling/upstream 只作为 pending/ref/gap；不声称 consumer/Artifact/registry 成功 |
| 污染隔离 | 通过（待正文重建复核） | 旧 README/05/06 仅 historical；旧 TC/EV、固定结果和环境不继承 |
| 07/实现越界 | 通过 | 未创建 implementation ledger、planned skeleton、脚本或实现仓 |

## 4. 正式回填前静态检查（当前批次）

- [x] 所有章节都有具体 `design-calibration/05_test_plan_step_*.md` 来源块（正文重建后复核）。
- [x] 所有用例预期使用正式对象/状态/错误名；future/reopen 与 current-negative 已分离。
- [x] 固定路径只使用 `artifacts/test/<run_id>/...`、`reports/runs/<run_id>/...`、`reports/acceptance/...` 和 `scripts/gates|reports|checks/*`。
- [x] 没有填写实际 run_id、artifact digest、report、evidence alias、verdict、signoff 或 readiness。
- [x] Query no-write、inbound `accepted_input=false`、outbound `NoneAuthorized` 和 staged-status isolation 均保留。
- [x] 正式 05 不修改 06，不提前创建 07 或实施台账。

## 5. 校准修复清单（正式装配前必须完成）

| 修复项 | 当前问题 | 统一口径 |
|---|---|---|
| TC 族 | Step 5 使用 `TC-DEF/ASM/BLD/QUAL/SUP/NFR/VETO`，Step 6 使用 `TC-CMD/QUERY/IN/JOB/EVENT/CON/SEC`。 | 以 Step 6 logical surface 为主，并补 `TC-STATE-*`、`TC-CONFIG-*`、`TC-OBS-*`、`TC-DEP-*`、`TC-REC-*`、`TC-PERF-*`；能力映射只写需求/设计 ID，不另造 TC 族。 |
| EV 族 | Step 5/10 使用 `EV-API/DOMAIN/SEC/OBS/PERF` 等，Step 13 使用 `EV-UNIT/SVC/ENTRY/INT/CONFIG/SEC/OBS/GATE/REC`。 | 以 Step 13 的 `EV-UNIT/SVC/ENTRY/INT/CONFIG/SEC/OBS/GATE/REC/PERF` 为唯一规划族；Step 5/6/9/10/14 全部引用这套族。 |
| Suite 追溯 | Step 9 只有 suite 表，缺少 suite→切口→TC→EV→artifact/report 闭环。 | 增加脚本输入/输出表、suite 映射表、阻断套件停审和跨 suite 审计；脚本仅为 planned path。 |
| Evidence 交接 | Step 13 直接写“未来 06 AC-MI-xxx”。 | 改为“00 `AC-MI-*` 验收方向；未来 06 final mapping pending”，不预占 06 编号或 verdict。 |
| Step 15 状态 | 历史材料曾在正式 05 重建前把状态写成完成。 | 正式 05 已实际重建并完成静态总审计；本文件、flow、项目台账统一保持 `completed_stop_review`，不把该状态误读为测试执行或 readiness。 |

## 6. 正式文档回填草稿

正式 `05-测试方案.md` 已仅收录 Step 1~14 的收口结论；本文件的诊断、取舍、停审细节未重复进入正文。每章前置来源块是后续实施/验收人员的追溯入口。所有 EV/TC 仍为规划标识，须由未来获授权执行阶段产生实际结果。

## 7. 待确认事项与停审结论

持续 blocker：`DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY`、`MI-UP-001~009`、`Q-MI-001~004`。它们限制受影响正向 lane，但不改变当前 product-neutral 测试方案结构；解除后必须重开受影响 Step/TC。

正式 05 装配与静态总审计已完成；本文件、flow 与项目台账现统一为 `completed_stop_review`。立即停审，等待用户明确确认后才可读取 06 SOP 或创建 06；本轮不得创建 07、执行测试或提交。
