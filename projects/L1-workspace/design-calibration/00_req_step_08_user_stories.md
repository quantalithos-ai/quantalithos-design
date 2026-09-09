# L1-workspace 00 需求 Step 8：用户故事

> 状态：`done / pass`；回填位置：正式 §8

| ID | 角色 | 用户故事 | 能力 |
|---|---|---|---|
| `US-WS-001` | 成员/产品用户 | 我希望在可验证的 Personal scope 看到个人可见的跨项目入口和 attention 输入。 | C1/C2/C4 |
| `US-WS-002` | 成员/产品用户 | 我希望进入 Project scope 后看到项目相关的安全摘要和稳定引用。 | C1/C2/C4 |
| `US-WS-003` | 成员/产品用户 | 我希望未读、置顶、静音、最近打开和偏好只影响我的 workspace 体验。 | C5 |
| `US-WS-004` | 产品/同步调用方 | 我希望读取结果带来源、版本、覆盖和降级状态，能够判断是否完整。 | C4 |
| `US-WS-005` | 维护者 | 我希望发现重复、乱序、缺口、撤销和失效，并安全重放或重建。 | C3/C6 |
| `US-WS-006` | 审计/安全查看者 | 我希望知道每个视图分区依据的 owner、visibility decision 和 source watermark。 | C2/C4/C6 |
| `US-WS-007` | owner provider | 我希望 workspace 只读消费我的正式事实，不反写或复制正文。 | C2/C3 |

外围故事：搜索、历史比较、统计和 archive freeze 仅在后续合同闭口后纳入，不进入核心完成分母。

## 2. 门禁

```text
gate_status = pass
next_allowed_action = create_step_09_functional_requirements
```
