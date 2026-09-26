# L5-sync 07 实施计划校准流程

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md`
> 对应书写规范：`standards/document/实施计划书写规范.md`
> 对应实施台账规范：`standards/document/代码实施台账与门禁规范.md`
> 当前模式：`full-restart + single-agent-serial`
> 用户授权：完成全部 07；正式 `07-实施计划.md` 完成后立即停审，不进入代码实现、测试执行或 commit。

## 1. 执行边界

- 只修改 `projects/L5-sync/` 下的正式 07、`design-calibration/` 中间产物和本项目台账。
- 当前 agent 独立完成阅读、分析、写入和审计；不创建、调用或委派 sub-agent、worker、team 或并行代理。
- 不创建实现仓、不安装依赖、不实现代码、不运行测试、不创建真实 artifact/report/evidence，不填写真实 commit hash、run、verdict、signoff 或 readiness。
- 旧 README、旧正式文档、draft 和其他项目实施计划只作 `historical_material` 或框架参考；不继承旧 Rust/Tauri、旧 SyncTask、旧提交边界或未核验工具选择。
- 严格按 Step 1 → 13 串行推进。每个 Step 独立生成中间产物并更新台账；Step 13 只装配正式 07 并停审。
- 正式 07 完成时同步创建 `implementation_execution_ledger.md` 和全部 planned boundary skeleton；其状态只能是 `planned`、`blocked` 或 `waiting`。

## 2. 权威输入与真相边界

| 输入 | 用途 | 当前姿态 |
|---|---|---|
| `00-需求文档.md` | FR/BR/AC/VETO、范围、truth ownership、NFR | 正式需求真相源 |
| `01-架构设计.md` | 五 feature、依赖方向、local/owner seam、红线 | 正式架构真相源 |
| `02-概要设计.md` | CP1～CP6、流程、对象轮廓、protocol/state 概览 | 正式概要真相源 |
| `03-详细设计.md` | TypeScript/ESM 单 package、29 objects、10/13/3/0/3 protocol、17 state、ports、flows、UoW、test cuts | 唯一直接实现契约 |
| `04-配置设计.md` | 42 leaf、38 required、4 nullable operations、4 P0 profiles、source/activation/redaction | 配置与组合门禁真相源 |
| `05-测试方案.md` | TC/SUITE/EV 计划、G0～G7、路径和阻塞矩阵 | 测试/证据计划真相源 |
| `06-验收标准.md` | AC/VETO、三值结论、S/A/B/R、报告/交接门禁 | 验收与证据上限真相源 |
| 07 SOP/规范/台账规范 | 13 Step、phase/commit boundary、implementation ledger、Commit/Handoff Gate | 流程唯一约束 |

固定证据根（未来实现阶段才可生成实例）：

```text
artifacts/test/<run_id>/
reports/runs/<run_id>/
reports/acceptance/
```

当前不存在实现仓、代码、脚本、lockfile、run、artifact、report、evidence、commit hash 或 readiness。`TC-SYNC-*`、`SUITE-SYNC-*`、`EV-SYNC-*` 只能作为计划标识。

## 3. Step 主链

| Step | 主题 | 中间产物 | 回填章节 | 状态 |
|---:|---|---|---|---|
| 1 | 确认实施输入边界 | `07_implementation_plan_step_01_input_boundary.md` | §1 | `completed / stop_review` |
| 2 | 明确实施目标、范围和非范围 | `07_implementation_plan_step_02_scope.md` | §2 | `completed / stop_review` |
| 3 | 收稳前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | §3 | `completed / stop_review` |
| 4 | 抽取实施对象与交付物 | `07_implementation_plan_step_04_deliverables.md` | §4 | `completed / stop_review` |
| 5 | 设计实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases.md` | §5 | `completed / stop_review` |
| 6 | 拆分阶段任务、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commits.md` | §6 | `completed / stop_review` |
| 7 | 嵌入测试与验收门禁 | `07_implementation_plan_step_07_test_acceptance_gates.md` | §7 | `completed / stop_review` |
| 8 | 定义配置、环境与外部依赖准备 | `07_implementation_plan_step_08_dependencies.md` | §8 | `completed / stop_review` |
| 9 | 定义 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks.md` | §9 | `completed / stop_review` |
| 10 | 定义回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_change.md` | §10 | `completed / stop_review` |
| 11 | 定义提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_handoff.md` | §11 | `completed / stop_review` |
| 12 | 定义实施完成判定 | `07_implementation_plan_step_12_completion.md` | §12 | `completed / stop_review` |
| 13 | 整理正式实施计划文档 | `07_implementation_plan_step_13_formal_assembly.md` | §1～§13 | `completed / stop_review` |

## 4. 当前恢复点

```text
current_document = 07-实施计划.md
current_step = 13
current_module = formal_document_assembly
gate_status = pass_with_upstream_blockers
next_allowed_action = user_review_formal_07
formal_07_status = formal / stop_review
formal_07_calibration_write_allowed = completed / closed
formal_07_write_allowed = completed / closed
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 5. 实施移交上限

- `SYNC-UP-001~010` 与 `SYNC-LOCAL-001~005` 在 07 中继续保持 `blocked/waiting`，不被 phase、boundary、fake、cache、ACK、日志或 telemetry 关闭。
- 所有 phase / commit boundary 只描述未来可验证增量；当前实现台账和 boundary skeleton 不授权实现。
- 目标实现仓 `/home/aris/Projects/quantalithos-sync` 当前 `absent / not_created`；无实际 design commit baseline，不能填写伪造 hash。
- implementation ledger 的 `gate_status` 只能是 `blocked` 或 `waiting`；未来 boundary 的 `status` 只能是 `planned`、`blocked` 或 `waiting`。
- `pass` 只能作为正式计划中的未来门禁判定条件，不得作为当前实施实例结果。
- 正式 07 不新增需求、对象、字段、协议、状态、配置 leaf、outbound event、Project/Artifact/Baseline/Review/Workspace/Archive/Git remote truth。

## 6. 跨文档回写规则

- 正式 00～07 优先；正式文档不清楚时读取对应 calibration；仍不清楚则暂停并记录 design blocker。
- 任一 boundary 发现字段、DTO、状态、ref identity、validation truth、metadata/idempotency、projection rebuild、artifact materialization 或 phase boundary 未闭合，必须 `blocked / wait_design`，不得由实现者补口。
- 设计修复后先更新正式真相源和对应 calibration，再刷新受影响 boundary 的 design baseline；不在实现仓临时修 schema/port/state/mapper/config/evidence。

## 7. 持续 blocker

```text
SYNC-UP-001~010
SYNC-LOCAL-001~005
TARGET-REPO-001  /home/aris/Projects/quantalithos-sync absent / not_created
DESIGN-BASELINE-001  当前设计仓没有用户批准的实现移交 commit hash
```
