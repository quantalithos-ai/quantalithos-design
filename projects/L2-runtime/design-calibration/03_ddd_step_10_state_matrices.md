# L2-runtime 03 Step 10: 18 个状态机索引与门禁

> 状态: done
> 创建日期: 2026-08-09
> 本文件是索引；每个状态机完整 enum/ASCII/矩阵/非法迁移/测试在 annex

| Annex | State machines | 状态 |
|---|---|---|
| `03_ddd_step_10_states_01_05.md` | SM-01 Admission; SM-02 Run; SM-03 GoalPlan; SM-04 Context; SM-05 WorkingMemory | done |
| `03_ddd_step_10_states_06_10.md` | SM-06 ModelTurn; SM-07 ActionDecision; SM-08 SideEffect; SM-09 Delegation; SM-10 Feedback | done |
| `03_ddd_step_10_states_11_15.md` | SM-11 Checkpoint; SM-12 Recovery; SM-13 Outcome; SM-14 Handoff/Gap; SM-15 SourceAvailability | done |
| `03_ddd_step_10_states_16_18.md` | SM-16 Projection; SM-17 Adapter; SM-18 Job Lease/Page | done |

## State owner audit

| Check | Result |
|---|---|
| 18/18 subjects have a Step 6 owner and authoritative enum/posture | pass |
| Every positive transition names a Step 9 trigger/function | pass |
| Every state machine has ASCII graph and transition table | pass |
| Illegal transitions and idempotent/late/unknown behavior explicit | pass |
| Tests assert every positive row and negative boundary | pass |
| External approval/execution/observed/acceptance/lifecycle not merged | pass |
| No global state machine added | pass |

```text
step_10 = done
next_allowed_action = step_11_record_flow_persistence_consistency
```
