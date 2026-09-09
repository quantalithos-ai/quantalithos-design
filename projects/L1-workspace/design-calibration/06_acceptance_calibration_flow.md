# L1-workspace 06 验收标准校准流程

> 模式：`full-restart + single-agent-serial`；承接已停审的 05；完成 06 后立即停审，再进入 07。
> 当前状态：Step15 `completed / formal_stop_review`；正式 06 已装配并静态审计。
> 事实边界：本 flow 只定义验收裁决规则，不生成真实 run、artifact、report、EV、verdict、signoff 或 readiness。

## 1. 文档级恢复点

| 项 | 当前值 |
|---|---|
| current_document | `06-验收标准.md` |
| current_step | `1` |
| current_module | `input_boundary` |
| gate_status | `active` |
| next_allowed_action | `read_inputs_and_complete_step_01` |
| formal_06_write_allowed | `false`（已完成装配） |
| upstream_blocker | `WS-UP-001~008`、`WS-UP-006-S`、`WS-LOCAL-001~003` |

## 2. 本轮目标与边界

06 只把 00~05 的正式需求、设计、配置和测试证据合同转成可裁决的 AC、VETO、风险和签署口径。它不重新定义 workspace truth、owner authorization、event schema、实现任务或测试执行结果；下游 L4-archive 只能作为未来只读消费者，不得反向定义当前验收真相。

## 3. Step 进度

| Step | 主题 | 状态 |
|---:|---|---|
| 1 | 验收输入边界 | completed / external_slots |
| 2 | 验收目标与范围 | completed / p0_boundary_fixed |
| 3 | 验收基线 | completed / fixed_run_required |
| 4 | 进入与退出条件 | completed / current_not_satisfied |
| 5 | 功能验收门禁 | completed / p0_items_blocked_or_planned |
| 6 | 数据边界与架构红线 | completed / veto_candidates |
| 7 | 接口、事件与跨仓同步 | completed / formal_seam_blocked |
| 8 | 状态、事务与一致性 | completed / p0_consistency_gates |
| 9 | 非功能门禁 | completed / baseline_pending |
| 10 | 可观测性、审计与证据 | completed / evidence_not_instantiated |
| 11 | 一票否决 | completed / non_acceptance_fixed |
| 12 | 缺陷、复验与放行 | completed / rules_only |
| 13 | 风险接受与遗留项 | completed / no_current_acceptance |
| 14 | 最终结论与签署 | completed / unsigned |
| 15 | 正式文档装配 | completed / formal_stop_review |

## 4. 固定裁决纪律

1. 结论只允许 `通过`、`有条件通过`、`不通过`；当前没有结论实例。
2. 每个 P0 AC 必须同时回指正式设计契约、TC、EV、固定 report path、通过条件、失败条件和裁决影响。
3. `blocked`、`pending`、`not_run`、`infrastructure_failed` 不能当通过；缺正式 seam 时保留 AC，不用 fake 替代。
4. 一票否决项不得风险接受；Query 写、越权展示、Gap 终局、Unknown 盲重做、unsafe cutover、owner/outbound/archive 反写、secret 泄漏和静态证据均直接不通过。
5. 06 不生成 `verdict`、`signoff` 或 `readiness` 的事实，只定义未来如何产生它们。

## 5. 证据与路径基线

未来验收只能消费同一固定 `<run_id>` 的：

```text
artifacts/test/<run_id>/...
reports/runs/<run_id>/evidence-index.md
reports/runs/<run_id>/gate-results.md
reports/runs/<run_id>/redaction-check.md
reports/acceptance/handoff.md
reports/acceptance/veto-checklist.md
reports/acceptance/risk-acceptance.md
```

禁止 `latest`、跨 run 拼接、静态 EV、口头确认和 telemetry 替代业务证据。当前上述路径均没有真实产物。

## 6. 持续 blocker 与验收姿态

| ID | 当前影响 | 06 姿态 |
|---|---|---|
| WS-UP-001~005 | owner safe query、event、visibility、attention、scope 未闭合 | 相关 AC 保留，正向为 blocked |
| WS-UP-006/006-S | downstream read/export 与静态 seed 未闭合 | compatibility AC blocked，不让 archive 反定义 workspace |
| WS-UP-007~008 | Core 专用合同、personal execution subject 未闭合 | contract/下游 AC blocked |
| WS-LOCAL-001~003 | durable、binding、crypto/UUID pin 未闭合 | 一致性、正式 cursor、staging AC blocked |
| baseline/retention | 量化基线与长期证据 policy 未闭合 | P2/pending，不发明阈值 |

## 7. 进入 07 的门禁

正式 06 已完成 15 章、AC/VETO/证据/风险闭环静态审计并停审；真实 run、EV、verdict、signoff、readiness 仍为 0/不存在。按用户“同意 完成全部”授权，下一步创建 07 flow、implementation ledger 和 planned boundary skeleton；不得把 06 的 blocked/pending 当作通过。
