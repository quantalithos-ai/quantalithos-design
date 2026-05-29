# Step 10. 业务规则与边界约束

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 10
> 回填章节: `00-需求文档.md` §10 业务规则与边界约束
> 生成日期: 2026-05-29

---

## 1. 本步目标

把 `L0-bus` 的能力边界转成需求层硬规则，防止后续架构、设计和实现打穿 core / bus / sdk / observability / governance 边界。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 2 本仓边界 | 提取相邻仓职责隔离规则 |
| Step 7 核心能力闭环 | 提取闭环成立的不变量 |
| Step 9 功能需求 | 提取每项功能必须遵守的边界 |

---

## 3. 应问的问题与回答

### 3.1 哪些不变量必须始终成立？

- bus 不重新定义 `L0-core` 的共享契约。
- bus 不拥有业务 payload 正文真相。
- bus 的 delivery / failure / audit / replay 事实必须可追溯。
- SDK、observability、governance 只能消费 bus 输出，不能反写 bus truth。

### 3.2 哪些行为必须禁止？

- 禁止把裸 MQ 参数当成平台 delivery semantic。
- 禁止绕过 dead-letter 和审计链直接 replay。
- 禁止 tap 输出泄露禁止内容或绕过授权。
- 禁止把 failure material 直接当成 governance decision。
- 禁止把 SDK wrapper 字段倒灌到 bus transport truth。

### 3.3 哪些状态变化必须显式发生？

- 发布材料进入 bus 传递链必须显式形成可追溯事实。
- delivery 成功、失败、重试、死信、replay preparation 必须显式留痕。
- 后端适配语义变化必须显式记录，不得静默改变上层 delivery 行为。
- tap / failure material / transport view 的生成必须保持只读边界。

---

## 4. 结构化中间产物

### 4.1 规则结论

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 支撑功能 |
|---|---|---|---|---|
| BR-001 | 边界约束 | `L0-bus` 必须消费 `L0-core` 的共享契约，不得重新定义 Event、Error、TraceContext、Metadata、ActorRef。 | core / bus 边界 | F-001 / F-002 |
| BR-002 | 禁止行为 | `L0-bus` 不得保存或解释业务 payload 正文真相。 | payload 边界 | F-001 / F-006 |
| BR-003 | 不变量 | bus 的传递语义必须独立于具体 MQ 后端表达，不能退化成裸后端参数。 | delivery semantic | F-002 / F-008 |
| BR-004 | 显式变化 | delivery 成功、失败、超时、重试、死信和 replay preparation 必须显式留痕。 | delivery / recovery | F-004 / F-005 |
| BR-005 | 禁止行为 | 未形成完整 dead-letter、delivery history 和 audit chain 时，不得允许 replay。 | replay 边界 | F-005 |
| BR-006 | 不变量 | 幂等锚点必须能支持重复投递识别，但业务副作用幂等由订阅方负责。 | idempotency 边界 | F-003 / F-004 |
| BR-007 | 边界约束 | SDK transport view、tap output、failure material 都是只读输出，不得反写 bus truth。 | read-only output | F-006 |
| BR-008 | 治理约束 | tap、dead-letter read、replay 和 failure material 输出必须具备授权边界。 | privileged operation | F-005 / F-006 |
| BR-009 | 边界约束 | failure material 只能表达 bus 失败事实，不得直接生成 governance decision。 | governance 边界 | F-006 |
| BR-010 | 边界约束 | Outbox relay 只能承接已提交事实，不得把未提交业务状态推进到 bus。 | outbox boundary | F-007 |
| BR-011 | 审计约束 | bus audit 与 delivery history 必须 append-only 或保留可追溯演进链。 | audit / history | F-004 / F-006 |
| BR-012 | 显式变化 | 后端 adapter 能力变化不得静默改变上层传递语义。 | backend adapter | F-008 |

### 4.2 规则类型结论

| 类型 | 规则编号 |
|---|---|
| 不变量 | BR-003 / BR-006 |
| 禁止行为 | BR-002 / BR-005 |
| 显式变化 | BR-004 / BR-012 |
| 边界约束 | BR-001 / BR-007 / BR-009 / BR-010 |
| 治理约束 | BR-008 |
| 审计约束 | BR-011 |

---

## 5. 改动前后差异

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 规则表达 | 旧文档多以测试红线表达，如 `Envelope ≠ payload` | 需求层正式写成 BR 规则 |
| Replay | 设计中强调 replay material | 需求层明确未满足 dead-letter/history/audit 不得 replay |
| Tap | 旧文档写 tap-all | 改为授权边界下的 tap / read-only output |
| Backend | 多后端适配像技术选型 | 需求层明确后端不得泄漏平台 delivery semantic |

---

## 6. 回填草稿

```md
## 10. 业务规则与边界约束

> 校准来源：
> - `design-calibration/00_req_step_10_rules_boundary_constraints.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“规则结论”“规则类型结论”和“回填草稿”小节，了解本仓边界红线如何从功能需求收敛。

| 规则编号 | 规则类型 | 规则内容 | 约束对象 | 支撑功能 |
|---|---|---|---|---|
| BR-001 | 边界约束 | `L0-bus` 必须消费 `L0-core` 的共享契约，不得重新定义 Event、Error、TraceContext、Metadata、ActorRef。 | core / bus 边界 | F-001 / F-002 |
| BR-002 | 禁止行为 | `L0-bus` 不得保存或解释业务 payload 正文真相。 | payload 边界 | F-001 / F-006 |
| BR-003 | 不变量 | bus 的传递语义必须独立于具体 MQ 后端表达，不能退化成裸后端参数。 | delivery semantic | F-002 / F-008 |
| BR-004 | 显式变化 | delivery 成功、失败、超时、重试、死信和 replay preparation 必须显式留痕。 | delivery / recovery | F-004 / F-005 |
| BR-005 | 禁止行为 | 未形成完整 dead-letter、delivery history 和 audit chain 时，不得允许 replay。 | replay 边界 | F-005 |
| BR-006 | 不变量 | 幂等锚点必须能支持重复投递识别，但业务副作用幂等由订阅方负责。 | idempotency 边界 | F-003 / F-004 |
| BR-007 | 边界约束 | SDK transport view、tap output、failure material 都是只读输出，不得反写 bus truth。 | read-only output | F-006 |
| BR-008 | 治理约束 | tap、dead-letter read、replay 和 failure material 输出必须具备授权边界。 | privileged operation | F-005 / F-006 |
| BR-009 | 边界约束 | failure material 只能表达 bus 失败事实，不得直接生成 governance decision。 | governance 边界 | F-006 |
| BR-010 | 边界约束 | Outbox relay 只能承接已提交事实，不得把未提交业务状态推进到 bus。 | outbox boundary | F-007 |
| BR-011 | 审计约束 | bus audit 与 delivery history 必须 append-only 或保留可追溯演进链。 | audit / history | F-004 / F-006 |
| BR-012 | 显式变化 | 后端 adapter 能力变化不得静默改变上层传递语义。 | backend adapter | F-008 |
```

---

## 7. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把 `Envelope ≠ payload` 作为规则原文 | 保留原文 | 转译成 payload 边界规则 | 推荐 B。原因是需求文档应写规则内容，原文可在设计 / 测试中作为红线标签 |
| Q-002 | 是否把授权机制写入规则 | 写认证实现 | 只写授权边界需求 | 推荐 B。原因是认证实现不是 `L0-bus` 需求主线 |

当前建议：接受上述推荐后进入 Step 11。

---

## 8. 进入下一步条件

- 已列出保护 core / bus / sdk / observability / governance 边界的规则。
- 已列出 delivery、dead-letter、replay、tap、outbox、backend adapter 的关键红线。
- 没有把实现校验逻辑、接口字段或数据库结构写成规则。
