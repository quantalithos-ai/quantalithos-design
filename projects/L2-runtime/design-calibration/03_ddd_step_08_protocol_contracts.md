# L2-runtime 03 Step 8: 协议契约索引与门禁

> 状态: done
> 创建日期: 2026-08-09
> 说明: 本文件是索引；完整 schema 在三个 annex 中

| Annex | 内容 | 数量 | 状态 |
|---|---|---:|---|
| `03_ddd_step_08_protocol_shared.md` | metadata/envelope/page/error/job shared types 与 inventory conflict | shared | done |
| `03_ddd_step_08_protocol_commands.md` | 每个 Command request/result/secondary type/domain/UoW/error/replay | 17 | done |
| `03_ddd_step_08_query_event_job.md` | 每个 Query view、Inbound/Outbound payload、Job input/report | 12/6/6/7 | done |

## Inventory decision

Current confirmed 02 HLD per-item Command table contains 17 Commands. Earlier calibration text that claimed 15 omitted public `RecordWorkingMemory`, `PrepareRuntimeCheckpoint` and `CaptureSourceSnapshot` while adding internal operation names; it is `historical_material`. Step 8 and all later Steps use 17/12/6/6/7.

## Gate

| Check | Result |
|---|---|
| Every protocol has typed request/payload and typed result/receipt/report | pass |
| Every secondary public type has fields or enum variants | pass |
| DTO maps to object constructor, Port and Flow | pass |
| body-free/owner/visibility/freshness/replay boundaries explicit | pass |

```text
step_08 = done
next_allowed_action = step_09
```
