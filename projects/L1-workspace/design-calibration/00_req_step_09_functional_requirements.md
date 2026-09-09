# L1-workspace 00 需求 Step 9：功能需求

> 状态：`done / pass_with_blockers`；回填位置：正式 §9

## 1. 核心功能

| ID | 功能 | 输入/触发 | 外部可见结果 | 失败上限 |
|---|---|---|---|---|
| `FR-WS-001` | 解析 Personal/Project scope | principal、scope selector | 可解释 scope/ref 或拒绝 | invalid/unauthorized/fail-closed |
| `FR-WS-002` | 消费 visibility/membership 结论 | owner decision/ref | 裁剪后的可见分区 | missing/conflict/fail-closed |
| `FR-WS-003` | no-write 跨域查询聚合 | read request | 带来源版本/coverage 的结果 | partial/blocked/unavailable |
| `FR-WS-004` | 投影维护 | owner event/baseline | 新 view revision 或 gap | duplicate/late/conflict/gap |
| `FR-WS-005` | Personal read model | verified personal sources | 个人摘要/入口/attention | stale/partial/blocked |
| `FR-WS-006` | Project read model | verified project sources | 项目摘要/引用 | stale/partial/blocked |
| `FR-WS-007` | InboxItem 投影 | owner attention input | 带 source ref 的派生条目 | unknown input 不生成 |
| `FR-WS-008` | read/unread 与 local state | local-state request | scope-bound local result | conflict/unauthorized |
| `FR-WS-009` | refresh/invalidate/rebuild | gap、撤销或维护触发 | 新 generation、stale 或 blocked | 不混 generation |
| `FR-WS-010` | 对外 read/export | 产品/SDK/sync/archive request | revision/provenance/status read model | 不声明下游 accepted |

## 2. 非目标功能

上游业务写入、授权裁决、通知优先级推断、正文复制、bus delivery、SDK cache、UI 和 archive 恢复不进入功能需求。

## 3. 门禁

```text
gate_status = pass_with_blockers
next_allowed_action = create_step_10_business_rules_boundaries
```
