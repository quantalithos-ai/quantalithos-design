# Step 13. 定义风险接受与遗留项

## 1. Step 状态

`completed / no_current_acceptance`。

## 2. 风险/遗留项表

| 风险 | 影响 | 当前处置 | 可否有条件通过 |
|---|---|---|---|
| WS-UP-001~005 | 正向 safe read/event/visibility/attention/scope 不可证明 | owning project 闭合后新 run | 否，P0 blocked |
| WS-UP-006/006-S | downstream/export/seed 不可证明 | 后续消费者/owner合同 | 否，当前串行阻塞 |
| WS-UP-007/008 | Core 与 execution subject 未定 | owner/架构回写 | 否 |
| WS-LOCAL-001~003 | durable/binding/crypto 不可证明 | 实施前置与新 run | 否 |
| workload/baseline/retention | 数值和长期证据未定 | 07/运维后续定义 | 仅 P2 pending，不得形成 P0 通过 |

## 3. 接受规则

S/VETO、external blocked P0、缺 raw/report、visibility 未验证、Query 写、Gap/Unknown/cursor 红线均不可接受。B/P2 才可能由未来实现、测试、安全、数据 owner 和验收负责人按 06 固定字段接受；当前无姓名、无签署、无期限实例。

## 4. 回填与进入下一步

正式 §13 回填风险表、不可接受项和 `reports/acceptance/risk-acceptance.md` 必填字段。所有当前风险保持 waiting/blocker，允许 Step14。
