# L1-workspace 00 需求 Step 2：本仓定位与边界

> 状态：`done / pass`；回填位置：正式 §2

## 1. 问题回答

一句话定义：`L1-workspace` 是跨 L1 真相域的只读工作区视图与投影局部状态仓，维护可重建 read model 和 workspace-only attention state。

单独成仓原因：产品、同步和成员入口需要一个稳定的跨域读取语义，避免各自拼接缓存、未读和可见性解释；同时 workspace 必须与业务 truth、授权裁决和 UI 状态隔离。

## 2. 拥有与不拥有

| 拥有 | 不拥有 |
|---|---|
| view partition、projection revision/generation、source cursor/application record、coverage/gap、InboxItem 派生状态、ReadCursor、unread、pin/mute、preference、last-opened、focus。 | GlobalMember、Project、ProjectMember、WorkItem、Conversation、Turn、ProcessInstance、Activity、Artifact、Gate、Decision、Policy、runtime execution、tools execution、capability registry、sandbox、archive、SDK cache、产品 UI。 |

PersonalWorkspace 与 ProjectWorkspace 是同一框架下的两种 scope，不是新的业务生命周期主体。InboxItem 是来源事实的派生投影；本地 read/pin/mute 等状态不回写上游。

## 3. 易混淆边界

Identity/Work/Conversation/Process/Governance/Artifact 各自拥有事实；Bus 拥有 delivery；SDK/产品拥有访问和 UI；Archive 仅为后续消费者。workspace 只消费正式 query、event、visibility decision/ref，查询保持 no-write。

## 4. 诊断与取舍

旧 README/ADR 将 view object、事件名和 UI 体验混在业务边界中。本轮采用“跨域 materialization + local state”边界，不采用“第七个业务域”或“workspace authorization”解释。

## 5. 门禁

```text
gate_status = pass
next_allowed_action = create_step_03_problem_context
formal_document_write_allowed = false
```
