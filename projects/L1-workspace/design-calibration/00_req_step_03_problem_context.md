# L1-workspace 00 需求 Step 3：背景与问题定义

> 状态：`done / pass`；回填位置：正式 §3

## 1. 问题回答

业务背景：平台需要让一个成员在个人与项目语境中查看多个 L1 truth domain 的安全摘要、引用和 attention 输入。各产品、同步入口或运行层若各自聚合，会产生重复解释、跨域漂移和可见性风险。

主要问题：跨域读取没有统一的 workspace read model；来源版本和覆盖范围难以解释；事件延迟/重复/缺口容易被压成“当前状态”；本地未读和置顶状态容易反写为业务事实；授权/可见性决定可能被视图层自行推断；下游缺少稳定的只读消费面。

## 2. 业务问题与技术问题

| 类型 | 结论 |
|---|---|
| 业务问题 | 成员无法获得可信、可解释且按 scope 裁剪的个人/项目工作区视野。 |
| 技术问题 | query、event、version、cursor、visibility 和 rebuild seam 尚未形成统一的跨域消费合同；没有 owner-safe 输入时无法证明 read model 完整性。 |

## 3. 旧材料诊断

ADR-0015 中的群聊/私聊和对象清单可说明体验背景，但不能证明当前 query/event/visibility 已闭口。历史性能数字、UI 布局、缓存和 transport 不进入问题定义。

## 4. 门禁

```text
gate_status = pass
next_allowed_action = create_step_04_goals_non_goals
formal_document_write_allowed = false
```
