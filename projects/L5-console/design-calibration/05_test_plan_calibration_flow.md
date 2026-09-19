# L5-console 05 测试方案校准流程

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 书写规范：`standards/document/测试方案书写规范.md`
> 目标正式文档：`projects/L5-console/05-测试方案.md`
> 启动日期：2026-09-18
> 当前状态：Step 1～15 `done / pass / self_reviewed`；正式 05 `formal_stop_review`

## 1. 执行边界

- 用户已明确授权“完成全部 05”；授权覆盖 Step 1～15 串行推进，不授权进入 06。
- 只修改 `projects/L5-console/` 下 05 calibration、正式 05 和项目台账；不实现代码、不创建实现仓、不运行项目测试、不提交 commit。
- 正式 00～04 是当前测试设计真相源；旧 `05-测试方案.md`、README 与旧 `06-验收标准.md` 只作 `historical_material` 和污染审计输入。
- `L1-governance` 的 05 及 calibration 只提供粒度与框架参考；不得迁移 Governance 的 Rust、DB、repository、outbox、worker、job、GRC 或产品配置语义。
- 测试方案定义未来可执行用例、suite、gate、artifact/report/evidence 合同，不表示实现仓、脚本、环境、测试运行、run_id、artifact、report、evidence、coverage、verdict、signoff 或 readiness 已存在。
- `CON-Q-034～047` 与 exact owner/SDK、state medium、host/framework、diagnostic/a11y、兼容和量化 authority 继续 open/pending；必须转化为 blocked/conditional test slices 或残余风险，不能伪造 positive 测试条件。

## 2. 三层门禁

| 层级 | 当前状态 | 规则 |
|---|---|---|
| 项目级 | `05_formal_stop_review` | 05 已完成；禁止进入 06、实现、执行测试或提交 |
| 文档级 | `formal_stop_review` | 正式 05 已 full-restart 重建并通过总审计，写入关闭 |
| Step 级 | Step 15 `done / pass / self_reviewed / formal_stop_review` | 装配与最终审计已完成；不得继续改写或进入下一文档 |
| 正式正文 | `formal_05_write_allowed=false_formal_stop_review` | 等待用户明确授权下一文档；旧正式 05 未增量继承 |

## 3. 权威输入与用途

| 输入 | 权威级别 | 05 用途 |
|---|---|---|
| 正式 `00-需求文档.md` | 产品行为 truth | 需求/规则/数据/NFR/VETO 与追溯起点 |
| 正式 `01-架构设计.md` | 架构边界 truth | SDK-only、owner truth、依赖、横切和降级验证 |
| 正式 `02-概要设计.md` | 设计骨架 truth | 组成部分、对象、接口、flow、state、异常切口 |
| 正式 `03-详细设计.md` | 测试直接 truth | 十模块、对象/Port、5 Command、16 Query、conditional consumer、flow/state/error/concurrency/config/diagnostic/test slices |
| 正式 `04-配置设计.md` | 配置测试 truth | 四项 schema、source/profile、strict validation、zero-secret、startup-only、failure/rollback |
| 03 Step 16 / 17 / 18 | 测试与风险直达输入 | 最小切口、实施暂停条件、开放 blocker |
| 04 Step 12 / 14 / 15 | 测试与验收承接 | 配置专项、验收输入、风险与停审事实 |
| 旧 `05-测试方案.md` / 旧 `06-验收标准.md` | historical material | 仅污染审计，不继承 TC/EV、阈值、框架或 owner 假设 |
| `L1-governance` 05 与 calibration | 粒度参考 | 15-Step、小循环、矩阵、证据/门禁框架，不迁移领域语义 |

## 4. Step 状态台账

| Step | 主题 | 中间产物 | 前置 | 状态 | 正式回填 |
|---|---|---|---|---|---|
| 1 | 测试输入边界 | `05_test_plan_step_01_input_boundary.md` | 正式 00～04、风险与 handoff | `done / pass / self_reviewed` | §1 |
| 2 | 目标、范围和非范围 | `05_test_plan_step_02_scope.md` | Step 1 | `done / pass / self_reviewed` | §2 |
| 3 | 测试对象与切口 | `05_test_plan_step_03_test_objects_cuts.md` | Step 2 | `done / pass / self_reviewed` | §3 |
| 4 | 策略与分层 | `05_test_plan_step_04_strategy_layers.md` | Step 3 | `done / pass / self_reviewed` | §4 |
| 5 | 追溯与覆盖 | `05_test_plan_step_05_traceability_coverage.md` | Step 4 | `done / pass / self_reviewed` | §5 |
| 6 | 场景与用例 | `05_test_plan_step_06_cases.md` | Step 5 | `done / pass / self_reviewed` | §6 |
| 7 | 测试数据 | `05_test_plan_step_07_test_data.md` | Step 6 | `done / pass / self_reviewed` | §7 |
| 8 | 环境与配置 | `05_test_plan_step_08_environment_config.md` | Step 7 | `done / pass / self_reviewed` | §8 |
| 9 | 自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_gates.md` | Step 8 | `done / pass / self_reviewed` | §9 |
| 10 | 专项与非功能 | `05_test_plan_step_10_nonfunctional.md` | Step 9 | `done / pass / self_reviewed` | §10 |
| 11 | 缺陷与复验 | `05_test_plan_step_11_defects_retest.md` | Step 10 | `done / pass / self_reviewed` | §11 |
| 12 | 进入与退出准则 | `05_test_plan_step_12_entry_exit.md` | Step 11 | `done / pass / self_reviewed` | §12 |
| 13 | 报告与证据 | `05_test_plan_step_13_evidence.md` | Step 12 | `done / pass / self_reviewed` | §13 |
| 14 | 回归与残余风险 | `05_test_plan_step_14_regression_risks.md` | Step 13 | `done / pass / self_reviewed` | §14 |
| 15 | 正式文档装配 | `05_test_plan_step_15_formal_document_assembly.md` + 正式 05 | Step 14 pass | `done / pass / self_reviewed / formal_stop_review` | 全文 / §15 |

## 5. 全程固定事实边界

| 主题 | 固定口径 |
|---|---|
| 实现事实 | 目标实现仓尚未建立；所有 module/test/script/path 均为 planned contract |
| 测试执行 | 本轮不运行测试；用例和命令只定义未来执行合同 |
| 证据 | EV ID 是未来证据槽，不是现有 evidence；不得静态造证据 |
| 路径 | future raw evidence=`artifacts/test/<run_id>`；report=`reports/runs/<run_id>`；acceptance=`reports/acceptance`；正式引用禁止 `latest` |
| Console truth | 只验证客户端交互与边界；owner truth、Policy/Gate、audit/evidence/readiness 不由 Console 推导 |
| Query / Command | Query zero-write；唯一 owner write 经 `OwnerCommandPort.submit`；unknown 不 replay，formal reconciliation only |
| 状态 | owner/source/freshness/trust/interaction axes 不压扁；positive recovery 只由 formal read/result |
| 配置 | 恰好四项 P0；profile required/no default；optional defaults `[]/false/false`；startup-only；P0 zero-secret |

## 6. 当前恢复点

```text
current_document = 05-测试方案.md
current_step = complete_formal_stop_review
current_module = none
gate_status = done_pass_self_reviewed_formal_stop_review
next_allowed_action = wait_for_explicit_user_authorization_for_06
formal_05_write_allowed = false_formal_stop_review
formal_06_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
