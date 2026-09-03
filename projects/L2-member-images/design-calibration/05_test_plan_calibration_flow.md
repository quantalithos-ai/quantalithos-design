# L2-member-images 05 测试方案全量校准流程

> 创建日期：2026-09-01
> 最近更新：2026-09-02
> 状态：`completed_stop_review`
> 文档模式：`full-restart`
> 正式文档目标：`projects/L2-member-images/05-测试方案.md`
> 项目级台账：`design-calibration/project_execution_ledger.md`

## 1. 文档级恢复点

| 项目 | 记录 |
|---|---|
| 当前文档 | `05-测试方案.md` |
| 当前 Step | Step 15 `formal_document_assembly`，已完成正式 05 装配与静态总审计。 |
| 当前模块 | `stop_review_after_formal_05` |
| gate_status | `completed_stop_review` |
| gate_reason | 正式 05 已按固定 15 章从 Step 1~14 重建；每章有具体校准来源与延伸阅读。协议库存、TC/EV/suite/path、状态/配置/污染和无执行事实审计通过；`DDD-*`、`PF-*`、`MI-UP-*` 与 `Q-MI-*` 仍仅限制受影响正向 lane。 |
| next_allowed_action | 已获用户“继续”进入 06 Step 1；06 Step 1 完成后立即停审，Step 2~15 仍需逐步授权；不得进入 07、implementation ledger、planned boundary skeleton、实现、测试执行或 commit。 |
| source_files | `project_execution_ledger.md`；Step 1~14；正式 `00~04`；`03_ddd_step_16_test_seams.md`、`03_ddd_step_18_risks_open_questions.md`、`04_config_step_12_downstream_handoff.md`、`04_config_step_14_risks_open_questions.md`；测试方案 SOP/书写规范；中间产物规范。 |

## 2. 本轮授权与执行纪律

- 用户“同意 完成全部 05”授权本项目在单 agent 模式下严格完成 Step 1→15、重建正式 `05-测试方案.md` 并在 05 停审。
- 测试方案只定义可执行验证设计，不运行测试，不生成 run、report、artifact digest、evidence alias、verdict、signoff 或 readiness。
- `L2-member`、`L2-member-service` 的并行草稿只作为 pending/blocker；不把未闭合 manifest、variant、consumer、container、launch 或 confirmation 写成正向测试前置。
- `DDD-S9-B01/B02` 使 10 Command 与 6 Job 当前只能设计 validation/context 后的 zero-effect/no-write seam；Query 严格 no-write；两条 conditional inbound 只能 marker-only；outbound inventory 为零。
- 测试对象、状态、字段、错误和协议名必须回指当前正式 `00~04` 或对应 calibration；旧正式 05/06 与 README 只用于 Step 15 historical pollution audit。
- 正式正文只承载收口结论；问题回答、取舍、污染诊断、Step 自检与停审记录保留在本目录。所有跨仓关系保持 `compile`、`runtime`、`event`、`ref`、`adapter`、`fake` 分类，消费关系不自动变成源码依赖。

## 3. Step 总流程

| Step | 输入 / 前序依赖 | 输出文件 | 当前状态 | gate_status | 完成门禁 | 下一步许可 |
|---:|---|---|---|---|---|---|
| 1 测试输入边界 | 正式 `00~04`、03/04 承接材料 | `05_test_plan_step_01_input_boundary.md` | `completed` | `pass` | stable/pending/blocked 输入和不得推导项明确 | 已由 Step 2 承接 |
| 2 目标、范围、非范围 | Step 1、需求/规则/VETO | `05_test_plan_step_02_scope.md` | `completed` | `pass` | P0/P1/P2、非范围及风险归属可判定 | 已由 Step 3 承接 |
| 3 测试对象与切口 | Step 2、03 §4~§16、04 §3~§14 | `05_test_plan_step_03_test_objects_cuts.md` | `completed` | `pass` | 七模块、逻辑协议、状态/一致性/配置/观测入口齐全 | 已由 Step 4 承接 |
| 4 策略与分层 | Step 3、03 Step 16 | `05_test_plan_step_04_strategy_layers.md` | `completed` | `pass` | P0 切口有最早发现层级、时机与阻断处理 | 已由 Step 5 承接 |
| 5 追溯与覆盖 | Step 1~4、00/03/04 编号 | `05_test_plan_step_05_traceability_coverage.md` | `completed` | `pass` | 需求/规则、设计契约、TC、EV 的规划链可双向回指 | 已由 Step 6 承接 |
| 6 场景与用例 | Step 5、03 协议/状态/错误/flow | `05_test_plan_step_06_cases.md` | `completed` | `pass` | 每个 logical surface有可断言的 current-negative/read-only/marker 或 future-reopen 用例 | 已由 Step 7 承接 |
| 7 测试数据 | Step 6、03 DTO/state/UoW、04 profile/redaction | `05_test_plan_step_07_test_data.md` | `completed` | `pass` | P0 fixture、隔离、清理和 fake 边界可定位 | 已由 Step 8 承接 |
| 8 环境与配置 | Step 7、04 五域 21 key、依赖裁剪 | `05_test_plan_step_08_environment_config.md` | `completed` | `pass` | profile、依赖类型、协作方式、配置和失败上限可定位 | 已由 Step 9 承接 |
| 9 自动化与门禁 | Step 4、6、8 | `05_test_plan_step_09_automation_gates.md` | `completed` | `pass` | planned suite、script family、触发、阻断、TC/EV 和固定路径已对齐 | 已由 Step 10 承接 |
| 10 专项与非功能 | Step 1~9、NFR/VETO | `05_test_plan_step_10_nonfunctional.md` | `completed` | `pass` | 安全、一致性、恢复、观测、依赖与无阈值性能方向均有验证方法 | 已由 Step 11 承接 |
| 11 缺陷与复验 | Step 6、10、03/04 风险 | `05_test_plan_step_11_defects_retest.md` | `completed` | `pass` | blocker 与 defect 分离；分级、复验、回写条件明确 | 已由 Step 12 承接 |
| 12 进入与退出 | Step 7~11 | `05_test_plan_step_12_entry_exit.md` | `completed` | `pass` | 未来执行阶段的准入、准出与 blocked 处理可判定 | 已由 Step 13 承接 |
| 13 证据与报告 | Step 5、6、9、12 | `05_test_plan_step_13_evidence.md` | `completed` | `pass` | planned EV、artifact/report 路径、生成与脱敏规则可回指 | 已由 Step 14 承接 |
| 14 回归与残余风险 | Step 6、10、11、13、03/04 风险 | `05_test_plan_step_14_regression_risks.md` | `completed` | `pass` | 最小/全量回归触发器、残余风险、owner 与重开条件明确 | 已由 Step 15 承接 |
| 15 正式装配与总审计 | Step 1~14、书写规范、旧 05 historical audit | `05_test_plan_step_15_formal_document_assembly.md` | `completed_stop_review` | `pass_with_explicit_blockers` | 固定 15 章、具体来源块、术语/协议/证据/污染审计通过 | 已停审；等待用户明确确认进入 06 |

## 4. 统一测试边界

| 主题 | 当前正向可写事实 | 当前测试设计口径 |
|---|---|---|
| Command / Job | 逻辑协议存在；canonical input 与 result replay 仍受 B01/B02 阻断 | 只验证入口 validation、context 构造和 zero-effect/no-write；future accepted path 作为 reopen 用例模板 |
| Query | 读取协议与 view/page 已定义 | 验证 hit/missing/not-visible/degraded/stale/failed/empty 与绝对 no-write |
| Conditional inbound | 仅 marker boundary | 固定 `accepted_input=false`，验证 unavailable/rejected/reopen_required，无 envelope/receipt/dedup |
| Outbound | `ImageOutboundEventInventory::NoneAuthorized` | 验证零 DTO、零 outbox、零 publisher、零 delivery surface |
| 状态与结果 | local staged 状态存在，不能汇总为 ready | 逐 subject 验证正式 enum；`Available/Fresh/Assembled` 不推导 build、Artifact、consumer、runtime 或 readiness |
| 配置与外部依赖 | 04 的五域 21 key、startup-only、fail-closed | 验证严格 JSON、来源优先级、profile/fake 隔离、redaction 和 blocked marker；不验证 provider 成功 |

## 5. 正式装配前的三层门禁

| 门禁层 | 结论 | 依据 |
|---|---|---|
| 项目级 | `completed_stop_review` | 用户已明确授权完成 05；正式 05 已完成，下一正式文档仍需新的用户确认。 |
| 文档级 | `completed_stop_review` | Step 1~15 已完成，正式 05 已装配并静态审计。 |
| Step 级 | `completed_stop_review` | Step 15 完成章节映射、污染隔离、TC/EV/suite/path、协议、状态、配置与无执行事实审计。 |

正式 05 已完成，本 flow 保持 `completed_stop_review`；本轮用户已确认进入 06 Step 1，但 06 Step 1 完成后再次停审。本轮未修改正式 `06-验收标准.md`，未创建 07、implementation ledger、planned boundary skeleton、实现仓、脚本、测试结果或 commit。
