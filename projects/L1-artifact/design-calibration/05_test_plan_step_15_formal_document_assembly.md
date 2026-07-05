# Step 15. 整理正式测试方案文档

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 15
> 回填章节: 完整 `05-测试方案.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15 整理正式测试方案文档 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1~14 中间产物;`测试方案书写规范.md`;`设计文档讨论中间产物规范.md`;`projects/L1-governance/design-calibration/05_test_plan_step_15_formal_document_assembly.md` 只作框架参考 |
| 输出文件 | `projects/L1-artifact/05-测试方案.md` |
| 停审方式 | 完成正式 `05` 装配后暂停,等待用户审查 |

## 2. 本步目标

将 Step 1~14 已收稳的测试输入、范围、切口、用例、数据、环境、门禁、专项、缺陷、进入/退出、证据和回归策略,装配成正式 `05-测试方案.md`。

本 Step 只负责正式文档装配,不新增未在中间产物中确认过的测试范围、suite、evidence 规则、验收编号或实现细节。

## 3. 装配原则

- 正式 `05` 必须使用 `测试方案书写规范.md` 规定的 15 章主链。
- 每一章都必须保留校准来源块,且只能引用具体 `design-calibration/05_test_plan_step_*.md` 文件。
- 正式正文只承载收口后的测试方案结论,不回填 Step 里的诊断、取舍争论或停审记录。
- 不把 Step 文件原样拼接进正式 `05`;必须按正式文档语气重新组织。
- 不写真实执行结果、真实 `run_id`、真实 defect status、验收 pass/fail 或静态证据结论。
- 当前 authoritative evidence id 仍保持 `EV-CAND-ART-*`,不提前发明 `EV-ART-*` 或 `AC-ART-*`。
- 第 14 章验收引用继续直接使用 `14.1~14.5` 与 `VF-ART-001~004`。
- `PublishPendingArtifactRelays` 必须继续保持为 worker-only internal relay publication facade,不得并入 6 个 public jobs。
- 依赖裁剪继续保持“只有 `L0-core/core-contracts` 允许 compile-time sibling upstream;其他 sibling 仅能通过 runtime/event/handoff/replay seam 协作”。

## 4. 章节装配映射

| 正式章节 | 主要校准来源 | 关键装配决策 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 固定新版 `00/01/02/03/04` 为正式输入,旧 `05/06` 只作历史诊断 |
| §2 本次测试目标与范围 | Step 2 | 固定 5 个核心能力、P0/P1/P2、only-seam downstream 边界和 `VF-ART-*` |
| §3 测试对象与测试切口 | Step 3 | 固定 7 模块、16 Command、13 Query、6 Consumer、8 Event、6 public jobs 和 relay facade 独立口径 |
| §4 测试策略与分层 | Step 4 | 固定 Contract / Service / Integration / Entry / Release 分层和高风险最早发现层级 |
| §5 需求追溯与覆盖矩阵 | Step 5 | 固定 `FR-ART-*`、`BR-ART-*`、`NFR-ART-*`、`14.1~14.5`、`VF-ART-*` 双向追溯 |
| §6 测试场景与用例设计 | Step 6 | 固定逐协议用例族,Query 全量 `no-write`,public jobs 全量 `no-truth-repair` |
| §7 测试数据设计 | Step 7 | 固定 `DS-ART-*` 数据集、run 隔离、negative corpus、no real sibling / product 依赖 |
| §8 测试环境与配置矩阵 | Step 8 | 固定 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 四个 P0 profile |
| §9 自动化与 CI/CD 门禁 | Step 9 | 固定 suites / gates / `artifacts/test/<run_id>` / `reports/runs/<run_id>` |
| §10 专项测试与非功能验证 | Step 10 | 固定 truth ownership、cross-repo consumption、redaction、recovery、dependency、observability 专项 |
| §11 缺陷管理与复验规则 | Step 11 | 固定 `S/A/B/R` 分级、S 级 blocker、retest scope 和防回归要求 |
| §12 进入准则与退出准则 | Step 12 | 固定 entry / exit checklist,明确当前不要求 formal EV 编号 |
| §13 测试报告与证据归档 | Step 13 | 固定 `EV-CAND-ART-*`、candidate evidence index、acceptance drafts 和真实性审计 |
| §14 回归策略与残余风险 | Step 14 | 固定变更触发最小/全量回归、residual 风险和必须转入新版 `06` 的事项 |
| §15 参考 | Step 1~14 | 汇总正式输入、校准中间产物、标准/SOP 和下游承接 |

## 5. 正式化决策

| 议题 | 正式决策 | 说明 |
|---|---|---|
| 章节结构 | 使用 15 章正式主链 | 与 `测试方案书写规范.md` 一致 |
| 验收引用 | 直接使用 `14.1~14.5` 与 `VF-ART-001~004` | 不发明 `AC-ART-*` |
| 证据 ID | 继续使用 `EV-CAND-ART-*` | Step 13 已明确当前 authoritative candidate evidence id |
| 环境口径 | 四个 P0 profile + `staging-like/production-like` future | 与 Step 8 一致 |
| 依赖边界 | 仅 `L0-core/core-contracts` 可 compile-time 引入 | 与 Step 8 / Step 10 / Step 13 一致 |
| Query 边界 | 每个 Query 都显式声明 `no-write` | 与 Step 6 / Step 10 / Step 12 一致 |
| Job 边界 | 每个 public job 都显式声明 `no-truth-repair` | 与 Step 6 / Step 10 / Step 12 一致 |
| relay facade | 单独成章内测试对象 / 自动化 / 证据 / 回归路径 | 不并入 6 个 public jobs |
| 正式正文边界 | 不写真实测试结果和静态结论 | 真实 run 结论只属于 future reports / acceptance docs |

## 6. 自审清单

| 检查项 | 通过标准 | 当前状态 |
|---|---|---|
| 15 章结构完整 | 与规范最小模板一致 | 通过 |
| 每章校准来源完整 | 每章都引用具体 `05_test_plan_step_*.md` | 通过 |
| 输入边界未漂移 | 只承接新版 `00/01/02/03/04` 与已确认的 Step 结论 | 通过 |
| 旧口径未回流 | 旧 `05/06` 未被当成真相源 | 通过 |
| `PublishPendingArtifactRelays` 独立口径完整 | 范围、对象、用例、自动化、证据、回归均单列 | 通过 |
| `EV-CAND-ART-*` 未被 formal EV 替代 | §13 和 acceptance 引用保持 candidate 口径 | 通过 |
| Query `no-write` 和 job `no-truth-repair` 显式保留 | §6 / §10 / §12 / §14 均可追溯 | 通过 |
| 依赖裁剪未放松 | 只允许 `core-contracts` compile-time upstream | 通过 |
| 未写真实执行结论 | 无真实 `run_id`、pass/fail、defect state | 通过 |

## 7. 输出结果

| 输出 | 状态 | 说明 |
|---|---|---|
| `projects/L1-artifact/05-测试方案.md` | 已完成 | 正式 15 章文档已装配 |
| `05_test_plan_step_15_formal_document_assembly.md` | 已完成 | 记录本步装配决策、自审与停审条件 |

## 8. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 正式 `05-测试方案.md` 已装配 | 通过 | 已完成 |
| flow / 项目台账已同步 | 通过 | `05_test_plan_calibration_flow.md` 与 `project_execution_ledger.md` 已同步到 Step 15 完成待审状态 |
| 等待用户审查 | 通过 | 当前停在 Step 15 审查点 |
