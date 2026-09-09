# Step 7. 嵌入测试与验收门禁

## 1. Step 状态

`completed / gates_planned`。门禁均为未来执行合同，不是当前结果。

## 2. 阶段门禁矩阵

| 阶段 | 测试门禁 | 验收门禁 | planned脚本 | artifact/report | 失败处理 |
|---|---|---|---|---|---|
| PH-01 | contracts/dependency static | AC-BOUND-005 | `run_ci_gate.sh`、dependency check | fixed run paths | 停止后续；修边界 |
| PH-02 | contracts-protocol、domain-invariants | AC-STATE-008 | `run_ci_gate.sh` | suite raw/report | 回写03并重跑 |
| PH-03 | query-no-write、api-read-surface、maintenance | AC-FUNC-001~003/008 | `run_ci_gate.sh` | same-run raw | Query写/安全失败即阻断 |
| PH-04 | maintenance、worker-consumer-boundary | AC-FUNC-004/007、AC-SYNC-003/004 | `run_ci_gate.sh` | source/Inbox raw | event seam缺失保持 blocked |
| PH-05 | jobs-recovery、maintenance | AC-FUNC-009、AC-STATE-001~007 | `run_ci_gate.sh` | recovery raw | basis/phase失败停审 |
| PH-06 | infra-adapter、config-redaction、dependency | AC-BOUND/NFR | `run_ci_gate.sh`、checks | redaction/integrity | fake/durable/crypto缺口阻断 |
| PH-07 | entry suites、report-integrity | AC-EVID-001~005 | report/check scripts | reports/runs/<run_id> | 缺 raw/report 不交付 |
| PH-08 | formal-seam-conformance | all P0 AC/VETO | `run_release_gate.sh`、`run_formal_seam_gate.sh` | acceptance drafts | blocked/failed 不得送验 |

## 3. Commit boundary 门禁

每个 BND 至少绑定一组 unit/domain/service/entry/check；涉及外部行为、状态、跨仓或一致性的 boundary 必须绑定相应 AC/VETO。required artifact 使用 `artifacts/test/<run_id>`，报告使用 `reports/runs/<run_id>`；acceptance 草案只能在 PH-08 后由人/Agent审查。

## 4. 门禁失败与停审

failed、blocked、not_run、infrastructure_failed 都阻止进入下一阶段；不得同 run 改状态、静态补 EV 或用 fake 解除 formal blocker。每个 phase/boundary 完成后停审测试覆盖、证据路径、AC/VETO映射和失败责任。

## 5. 回填与进入下一步

阶段/提交门禁矩阵完整，允许 Step8。
