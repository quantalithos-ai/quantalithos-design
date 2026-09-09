# L1-workspace 00 需求 Step 4：目标与非目标

> 状态：`done / pass`；回填位置：正式 §4

## 1. 目标

| ID | 目标 | 判断方式 |
|---|---|---|
| `G-WS-001` | 建立 Personal/Project scope 的统一 workspace read-model 边界。 | scope、principal 与 source owner 可区分。 |
| `G-WS-002` | 以 no-write query 消费 owner-safe facts、ref、版本和可见性决定。 | query 不写 source/local state，缺权限 fail-closed。 |
| `G-WS-003` | 维护可重建投影，明确 cursor、版本、幂等、重复、乱序、缺口、重放和失效语义。 | 每个投影状态可说明 source coverage 和降级状态。 |
| `G-WS-004` | 提供 workspace-only Inbox/read/unread/pin/mute/preference 等局部状态。 | 更新不改变上游业务 truth。 |
| `G-WS-005` | 向下游提供带 provenance、coverage 和 stale/partial/blocked/fail-closed 的稳定只读模型。 | 下游可判断结果边界，不把局部结果当全局强一致。 |
| `G-WS-006` | 让上游未闭合边界可见并保持保守上限。 | pending/blocker 有影响范围，不伪报 ready。 |

## 2. 非目标

身份、项目、对话、流程、治理、制品、运行、工具、能力 registry、sandbox、archive、SDK/client、UI、通知裁决、业务命令、授权真相、外部正文、固定协议/存储/性能数字均交给对应 owner 或后续文档。

## 3. 范围收束

第一版仅聚合已有正式 query/event/visibility 输入的分区；没有 owner 明示 attention 输入时不生成 Inbox priority。跨域全局强一致、预测性 ranking、搜索和 archive freeze 作为后置或增强。

## 4. 门禁

```text
gate_status = pass
next_allowed_action = create_step_05_users_roles
formal_document_write_allowed = false
```
