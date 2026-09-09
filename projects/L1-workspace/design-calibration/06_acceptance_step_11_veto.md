# Step 11. 定义一票否决项

## 1. Step 状态

`completed / non_acceptance_fixed`。

## 2. VETO 表

| VETO | 触发 | 检查来源 | 裁决 |
|---|---|---|---|
| VETO-WS-001 | workspace 保存/反写任一上游、runtime、archive truth | BOUND-001~003、DEP | 立即不通过 |
| VETO-WS-002 | visibility 缺失/冲突/撤销仍展示或泄漏 hidden metadata | VIS/SEC | 立即不通过 |
| VETO-WS-003 | 任一 Query 写、隐式 refresh 或 read cursor 更新 | QRY/BOUND | 立即不通过 |
| VETO-WS-004 | Gap 静默 advance/terminal 或 stale 冒 fresh/Complete | SRC/STATE | 立即不通过 |
| VETO-WS-005 | Unknown 盲重做、duplicate 二次效果、异 digest覆盖 | SRC/IDEM/TXN | 立即不通过 |
| VETO-WS-006 | cursor/generation 混轴或 unsafe cutover/终态复活 | CONTRACT/PAGE/REC | 立即不通过 |
| VETO-WS-007 | owner mutation、outbound event/outbox、archive handoff | BOUND | 立即不通过 |
| VETO-WS-008 | secret/body/credential/隐私标识泄漏 | SEC/redaction | 立即不通过 |
| VETO-WS-009 | non-core sibling compile 或 production fake fallback | DEP/CONFIG | 立即不通过 |
| VETO-WS-010 | 静态 EV、缺 raw、跨 run 拼接或 blocked 改 passed | report-integrity | 立即不通过 |

## 3. 风险接受关系

任何 VETO 不得由 risk-acceptance 覆盖；VETO 检查缺 source 时是 blocked/not_run，不能判通过或有条件通过。

## 4. 回填与审计

正式 §11 回填十项 VETO、检查证据和 report path；每项停审后做 P0 红线覆盖审计，无孤儿红线，允许 Step12。
