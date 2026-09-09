# Step 12. 定义缺陷分级、复验与放行规则

## 1. Step 状态

`completed / rules_only`；当前无真实 defect。

## 2. 缺陷与结论

| 级别 | 定义 | 结论影响 | 复验 |
|---|---|---|---|
| S | VETO、安全、所有权、一致性终局或证据真实性破坏 | 必须不通过，不得接受 | 修复后原 TC+同族+CUT+全量 P0 |
| A | P0 主线、harness 或报告无法证明但未观察 S 后果 | 不通过；正常退出前为 0 | 原 TC、相邻 suite、integrity |
| B | 不影响 P0 的一般问题/P1/P2 | 只有 06 明确角色/期限后可有条件通过 | 相关范围和风险记录 |

`blocked`、`pending`、`not_run`、`infrastructure_failed` 是执行状态，不是缺陷级别。formal seam 未闭合不能创建“产品失败”替代，也不能放行。

## 3. 放行规则

| 结论 | 必要条件 |
|---|---|
| 通过 | 全部 P0 AC、VETO、证据、S/A、formal seam 均满足 |
| 有条件通过 | P0 主线真实满足；仅允许具名角色接受的 B/P2，且有期限/动作；不得含 VETO、S、未裁决 formal blocker |
| 不通过 | 任一 VETO、S/A、缺 required evidence、formal blocker 或 P0 not_run |

## 4. 回填与进入下一步

正式 §12 回填分级、复验扩大集和三值放行；与 05 Step11 一致，允许 Step13。
