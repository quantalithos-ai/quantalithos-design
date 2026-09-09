# L1-workspace 00 需求 Step 14：验收标准

> 状态：`done / pass_with_blockers`；回填位置：正式 §14

| 类别 | 验收条件 |
|---|---|
| 核心能力 | C1~C6 均能说明进入/退出条件，scope、query、projection、local state、rebuild 和降级语义不互相越权。 |
| 功能 | FR-WS-001~010 有对应输入、可观察输出、失败上限和能力映射。 |
| 规则 | no-write、owner truth、visibility fail-closed、cursor separation、幂等、gap、generation isolation 均可判断。 |
| 数据 | workspace truth、snapshot/ref、禁止正文和下游状态分层；无 source body、secret 或 owner truth 复制。 |
| 接口 | Query/change/event/background/reference 类型清楚；runtime/event/ref/adapter/fake 未被写为 compile。 |
| NFR | 六类质量要求均有判断口径；无无来源量化数字。 |

## 一票否决

workspace 形成任一上游 truth/authorization、query 写入事实、缺 visibility 默认展示、静默跳过 cursor gap、stale 冒充 fresh、projection 反写 owner、把 fake 或未闭合 seam 写成 integration readiness，均验收失败。

## 门禁

```text
gate_status = pass_with_blockers
next_allowed_action = create_step_15_risks_open_questions
```
