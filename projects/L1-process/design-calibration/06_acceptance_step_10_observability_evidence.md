# Step 10. 定义可观测性、审计与证据门禁

> 回填章节: `06-验收标准.md` §10 可观测性、审计与证据门禁
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `03` §15 | structured log、metric、audit、script contracts |
| `05` §9 / §13 | gate、report、evidence index 和 redaction |

## 2. SOP 问题回答

1. 证据入口是什么?
   回答:`reports/runs/<run_id>/evidence-index.md` 是 EV / TC / AC / design refs 的主入口。
2. redaction 是否阻断?
   回答:是。raw secret、raw token、raw body 或 forbidden package body 命中时不通过。
3. acceptance handoff 是否写最终裁决?
   回答:handoff 记录送验事实和证据入口;最终裁决写入 §14。

## 3. 当前文档问题诊断

旧文档没有固定 evidence index、redaction report、gate results、handoff、veto checklist 和 risk acceptance 的路径。

## 4. 结构化中间产物

| 证据门禁 | 通过条件 | 失败条件 | 路径 |
|---|---|---|---|
| EV index | P0 EV、TC、AC、design refs 可追溯 | 缺 P0 EV 或路径使用 `latest` | `reports/runs/<run_id>/evidence-index.md` |
| Gate results | P0 suite 阻断结果清晰 | gate 缺失或失败被忽略 | `reports/runs/<run_id>/gate-results.md` |
| Redaction | raw secret / raw body 零命中 | 任一命中 | `reports/runs/<run_id>/redaction-check.md` |
| Release summary | 记录 suite、run_id、config digest、commit | 基线不完整 | `reports/runs/<run_id>/release-summary.md` |
| Acceptance handoff | 记录送验事实、开放问题和证据入口 | handoff 缺失 | `reports/acceptance/handoff.md` |
| Veto checklist | `VF-PROC-*` 逐项判定 | 未判定或 failed | `reports/acceptance/veto-checklist.md` |
| Risk acceptance | 有条件通过风险有接受记录 | 风险无接受人 / owner / 截止时间 | `reports/acceptance/risk-acceptance.md` |

## 5. 回填草稿

§10 定义 trace / audit / log / metric 和证据路径门禁,强调正式证据不得使用 `latest`。

## 6. 待确认事项

无阻塞项。
