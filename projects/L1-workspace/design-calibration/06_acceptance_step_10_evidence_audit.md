# Step 10. 定义可观测性、审计与证据门禁

## 1. Step 状态

`completed / evidence_not_instantiated`。

## 2. 证据门禁表

| AC | 必须存在 | 通过条件 | 失败影响 |
|---|---|---|---|
| AC-EVID-001 | 同 run 的 59 EV index | 每 P0 EV 回指 TC、case raw、suite report、digest | 缺失/跨 run 不通过 |
| AC-EVID-002 | gate-results/redaction/integrity | gate 状态来自 raw；扫描完整且无 forbidden canary | report/redaction 失败阻断 |
| AC-EVID-003 | failure/blocked/not_run 留存 | 原始失败和 blocked reason 不被覆盖或改写 | 静态 pass/删失败为 S |
| AC-EVID-004 | acceptance handoff/veto/risk 草案 | 固定 run、范围、限制、VETO 与风险均经人/Agent审查 | 未审查不得送验 |
| AC-EVID-005 | 观测审计边界 | log/metric/trace 只含白名单低基数字段，不作业务事实 | secret/body/授权或提交由 telemetry 证明为 S |

## 3. 最小 evidence index

每项必须含 `schema_version`、`run_id`、`evidence_id`、`tc_id`、status、source case/report paths+digests、design_refs、`acceptance_refs`、redaction_status、integrity_status、generated_by、review_status。当前 59 项均为 planned slot，真实实例为 0。

## 4. 跨证据审计与回填

禁止 `latest`、静态 JSON、日志片段、telemetry、跨 run 拼接、手写 passed。正式 §10 回填 AC-EVID-001~005 和固定路径；证据门禁未实例化不阻止设计继续，但阻止验收通过，允许 Step11。
