# L1-workspace 00 需求 Step 15：风险与待确认事项

> 状态：`done / pass_with_blockers`；回填位置：正式 §15

| ID | 风险/待确认事项 | 当前处理口径 | 影响 |
|---|---|---|---|
| `WS-UP-001` | owner query/summary/version/watermark surface 未统一 | 只写能力级 no-write query；逐域接入 pending。 | 字段与 fresh barrier |
| `WS-UP-002` | event family/cursor/replay/rebuild 未闭口 | 保留幂等、gap、rebuild 语义，不宣称实时集成。 | projection maintenance |
| `WS-UP-003` | visibility/authorization owning chain 未统一 | 缺失/冲突/撤销 fail-closed。 | 所有读分区 |
| `WS-UP-004` | Inbox attention input 未对齐 | 只消费 owner 明示输入，不本地推断。 | Inbox/unread |
| `WS-UP-005` | Personal/Project safe refs 未闭口 | scope 作为模型方向，字段/协议 pending。 | scope resolution |
| `WS-UP-006` | SDK/product/sync/archive export contract 未闭口 | 只保留下游消费边界。 | read handoff |
| `WS-UP-007` | workspace-specific Core contract 未确认 | 不本地 shadow schema。 | compile/event contract |
| `WS-UP-008` | personal execution subject 未定义 | workspace 不替代执行主语。 | L2 downstream boundary |

## 当前不阻塞项

上述 blocker 不阻塞需求层的 owner、能力、失败姿态和数据边界收束；它们阻塞 exact schema、正向联调、readiness、量化 baseline 和实施授权。

## 门禁

```text
gate_status = pass_with_blockers
next_allowed_action = create_step_16_traceability_matrix
```
