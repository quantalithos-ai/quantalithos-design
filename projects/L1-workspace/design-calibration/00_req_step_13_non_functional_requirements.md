# L1-workspace 00 需求 Step 13：非功能需求

> 状态：`done / pass_with_blockers`；回填位置：正式 §13

| 类别 | 要求 | 判断口径 |
|---|---|---|
| 正确性 | read model 的每个分区能回链 source/visibility/revision/coverage。 | 无来源或冲突时不得标 fresh。 |
| 一致性 | source cursor、view revision、read cursor 分离，跨域结果声明水位和覆盖。 | 不承诺未有 barrier 支撑的全局强一致。 |
| 可用性 | source、event、visibility 或 replay 不可用时保留可解释 stale/partial/blocked/unavailable。 | 不伪造 ready、完整或 accepted。 |
| 安全 | visibility 不可验证时 fail-closed；不得泄露受裁剪正文或存在性超出正式合同。 | owner decision/ref 可验证才可展示。 |
| 可追溯 | projection、Inbox、local state、rebuild 和导出均能回链变更语境。 | 具备 source ref/version、workspace revision 和原因。 |
| 可演进 | owner 新增域、事件或字段不应迫使 workspace 复制 source schema。 | 通过 ref/adapter 和显式 pending 承接变化。 |
| 性能/容量 | 查询、投影和重建不应以无界跨域正文聚合为前置。 | 具体 P95、吞吐、容量和保留期等待 workload baseline。 |

旧材料中的性能数字、缓存命中率、容量和 SLA 没有当前 measurement authority，不进入硬目标。

## 2. 门禁

```text
gate_status = pass_with_blockers
next_allowed_action = create_step_14_acceptance_criteria
```
