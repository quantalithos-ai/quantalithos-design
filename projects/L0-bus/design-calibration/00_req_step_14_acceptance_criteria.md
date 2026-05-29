# Step 14. 验收标准

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 14
> 回填章节: `00-需求文档.md` §14 验收标准
> 生成日期: 2026-05-29

---

## 1. 本步目标

把前面已经收敛的目标、核心能力闭环、功能需求、规则边界、数据归属和非功能要求，统一整理为可判断、可验证的需求层验收条件。本步不写测试步骤、接口调用步骤、脚本、CI 配置或具体测试数据。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 7 核心能力闭环 | 形成核心能力闭环验收项 |
| Step 9 功能需求 | 形成 F-001 ~ F-008 的功能能力验收项 |
| Step 10 业务规则与边界约束 | 形成 core / bus / sdk / observability / governance 边界验收项 |
| Step 11 数据需求与数据归属 | 形成 truth / snapshot / reference / forbidden body 数据边界验收项 |
| Step 13 非功能需求 | 形成性能、可用性、安全、审计、幂等、一致性和可观测性验收项 |

---

## 3. 应问的问题与回答

### 3.1 哪些条件满足后，核心能力闭环算成立？

当发布材料能基于 `L0-core` 契约进入 bus，形成统一 transport semantic，被推进为 delivery，被记录结果与幂等锚点，失败能进入 retry / dead-letter / replay preparation，并能产生只读 bus output 时，核心能力闭环成立。

### 3.2 哪些功能能力满足后，本次需求算完成？

F-001 ~ F-006 必须全部成立；F-007 / F-008 作为 P0-min 边界能力，必须至少完成边界定义和默认可验证路径。Redis / Kafka 完整适配、Filter DSL、DLQ UI、多租户和 exactly-once 不作为本次需求通过条件。

### 3.3 哪些规则 / 边界被满足后，才算没有串线？

`L0-bus` 必须消费 `L0-core` 契约而不重定义，不能保存 payload 正文，不能把裸 MQ 参数暴露成平台 delivery semantic，不能让 tap / DLQ / replay 绕过授权边界，不能把 failure material 直接升级为 governance decision。

### 3.4 哪些数据边界被满足后，才算数据归属正确？

bus 只拥有 publication acceptance、delivery、ack / fail、idempotency anchor、retry / dead-letter / replay material 和 bus audit trail 等总线传递事实；transport view、tap / trace / metrics material、failure summary 只是只读快照；core contract、payload、outbox fact、backend capability 只是引用；business payload body、raw secret、governance decision body 和 observability long-term log body 不得进入 bus 数据真相。

### 3.5 哪些非功能要求被满足后，才算质量达标？

验收应确认主链不依赖不可验证性能假设，外围增强缺失时核心闭环仍成立，敏感输出有授权边界，关键状态变化可追溯，delivery 幂等与业务幂等边界清晰，operator / observability / governance / SDK 能消费必要的只读状态或材料。

### 3.6 哪些失败情形属于一票否决？

核心闭环不成立、重新定义 `L0-core` 契约、保存业务正文、delivery / failure / replay 无追溯链、tap / DLQ / replay 无授权边界、将 failure material 当成 governance decision、后端差异泄漏成上层语义等情况，均应一票否决。

---

## 4. 结构化中间产物

### 4.1 验收标准结论

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 核心能力闭环验收 | 契约化输入到只读输出的闭环成立 | 发布材料能基于 `L0-core` 契约进入 bus，并依次形成 transport semantic、delivery、结果留痕、失败恢复材料和只读 bus output。 |
| 核心能力闭环验收 | P0 主闭环完整 | F-001 ~ F-006 均有明确能力边界，任一节点缺失都不能判定需求通过。 |
| 核心能力闭环验收 | P0-min 支撑边界成立 | Outbox relay 边界和后端 adapter 默认可验证路径能够支撑 F-001 ~ F-003，不要求所有后端生产适配同时完成。 |
| 功能能力验收 | F-001 契约绑定的发布材料接入 | 发布材料必须携带或关联 `L0-core` 契约引用、发布方 payload reference 或 outbox fact，并能被判定是否可进入 bus 传递链。 |
| 功能能力验收 | F-002 统一传递语义形成 | 合法发布材料能够形成平台级 transport semantic，且不暴露为裸 MQ 后端参数。 |
| 功能能力验收 | F-003 订阅与 delivery 推进 | bus 能基于订阅关系和可用后端路径形成面向订阅方的 delivery。 |
| 功能能力验收 | F-004 delivery 结果与幂等锚点记录 | ack / fail / timeout / duplicate feedback 能形成可追溯 delivery history 和 bus 级 idempotency anchor。 |
| 功能能力验收 | F-005 失败恢复与死信 / replay 准备 | delivery 失败、重试耗尽或 operator 请求恢复时，能形成 retry、dead-letter 或 replay preparation 材料，且 replay 不绕过历史与审计链。 |
| 功能能力验收 | F-006 总线级审计、tap 和只读输出 | bus 能输出 audit material、tap output、transport view 和 failure material，且这些输出保持只读边界。 |
| 功能能力验收 | F-007 Outbox relay 边界承接 | bus 只承接已提交 outbox fact，不把未提交业务状态推进到 bus。 |
| 功能能力验收 | F-008 后端适配边界与默认可验证路径 | 至少存在一条默认可验证 delivery path，且后端差异不改变上层 transport semantic。 |
| 规则 / 边界验收 | `L0-core` 契约边界 | Event、Error、TraceContext、Metadata、ActorRef 等共享契约由 `L0-core` 提供，`L0-bus` 不重新定义。 |
| 规则 / 边界验收 | payload 边界 | `L0-bus` 不保存、不解释业务 payload 正文真相，只保存引用和 bus 传递事实。 |
| 规则 / 边界验收 | 只读输出边界 | SDK transport view、tap output、failure material 不得反写 bus truth。 |
| 规则 / 边界验收 | replay 边界 | 未形成完整 dead-letter、delivery history 和 audit chain 时，不允许 replay。 |
| 规则 / 边界验收 | governance 边界 | failure material 只能表达 bus 失败事实，不能直接生成 governance decision。 |
| 数据归属验收 | bus truth 数据归属 | publication acceptance、delivery record、ack / fail result、idempotency anchor、retry / dead-letter / replay material、bus audit trail 被明确为 bus 真相数据。 |
| 数据归属验收 | 快照与引用边界 | transport view、tap / trace / metrics material、failure summary 是快照；core contract、payload、outbox fact、backend capability 是引用。 |
| 数据归属验收 | 禁止正文边界 | business payload body、raw secret / credential、governance decision body、observability long-term log body 不进入 bus 数据真相。 |
| 非功能验收 | 主链性能口径 | 需求、架构或测试后续必须能证明默认可验证路径不会依赖不可验证的后端性能假设。 |
| 非功能验收 | 外围增强降级口径 | Redis / Kafka 完整适配、Filter DSL、DLQ UI、完整 ops runbook 未完成时，核心闭环仍有默认可验证路径。 |
| 非功能验收 | 安全与授权口径 | tap、DLQ 读取、replay preparation、failure material 输出具备授权边界，不作为普通无约束读写面暴露。 |
| 非功能验收 | 审计与可追溯口径 | 关键状态变化能关联 bus audit trail 或 delivery history，不仅存在于瞬时内存状态。 |
| 非功能验收 | 幂等 / 一致性口径 | bus 能识别重复 delivery 和重复结果反馈，但不接管订阅方业务副作用幂等。 |
| 非功能验收 | 可观测性口径 | operator、observability、governance、SDK 能消费必要的只读状态、tap / audit material 或 failure material。 |

### 4.2 一票否决项

- `L0-bus` 无法形成契约化输入、transport semantic、delivery、结果留痕、失败恢复和只读输出的主闭环。
- `L0-bus` 重新定义 `L0-core` 已拥有的 Event、Error、TraceContext、Metadata、ActorRef 等共享契约。
- `L0-bus` 保存或解释业务 payload 正文真相、raw secret、governance decision body 或 observability long-term log body。
- delivery 成功、失败、超时、重试、dead-letter 或 replay preparation 无正式追溯链。
- 未满足 dead-letter、delivery history 和 audit chain 时允许 replay。
- tap、DLQ 读取、replay preparation 或 failure material 输出没有授权边界。
- backend adapter 差异泄漏成上层 transport semantic，导致后端切换改变需求语义。
- failure material 被直接当成 governance decision，而不是只读失败事实材料。

---

## 5. 改动前后差异

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 验收组织 | 旧文档容易围绕后端、接口和测试用例组织 | 按核心闭环、功能能力、规则边界、数据归属、非功能五类组织 |
| 多后端验收 | 四后端容易被理解为全部 P0 | 验收聚焦 adapter 边界和默认可验证路径，完整后端适配不作为本次通过条件 |
| tap / replay 验收 | tap-all 和 replay 容易变成普通能力 | 它们必须有授权、历史和审计链，否则一票否决 |
| 数据验收 | payload / audit / failure material 容易混写 | 明确 truth、snapshot、reference、forbidden body 的验收口径 |
| 非功能验收 | 容易写成高性能高可用口号 | 改成可判断的主链性能、降级、安全、追溯、幂等和观测口径 |

---

## 6. 回填草稿

```md
## 14. 验收标准

> 校准来源：
> - `design-calibration/00_req_step_14_acceptance_criteria.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“验收标准结论”和“一票否决项”小节，了解本仓需求如何从闭环、功能、规则、数据和非功能约束收口为验收口径。

### 14.1 验收标准表

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 核心能力闭环验收 | 契约化输入到只读输出的闭环成立 | 发布材料能基于 `L0-core` 契约进入 bus，并依次形成 transport semantic、delivery、结果留痕、失败恢复材料和只读 bus output。 |
| 核心能力闭环验收 | P0 主闭环完整 | F-001 ~ F-006 均有明确能力边界，任一节点缺失都不能判定需求通过。 |
| 核心能力闭环验收 | P0-min 支撑边界成立 | Outbox relay 边界和后端 adapter 默认可验证路径能够支撑 F-001 ~ F-003，不要求所有后端生产适配同时完成。 |
| 功能能力验收 | F-001 契约绑定的发布材料接入 | 发布材料必须携带或关联 `L0-core` 契约引用、发布方 payload reference 或 outbox fact，并能被判定是否可进入 bus 传递链。 |
| 功能能力验收 | F-002 统一传递语义形成 | 合法发布材料能够形成平台级 transport semantic，且不暴露为裸 MQ 后端参数。 |
| 功能能力验收 | F-003 订阅与 delivery 推进 | bus 能基于订阅关系和可用后端路径形成面向订阅方的 delivery。 |
| 功能能力验收 | F-004 delivery 结果与幂等锚点记录 | ack / fail / timeout / duplicate feedback 能形成可追溯 delivery history 和 bus 级 idempotency anchor。 |
| 功能能力验收 | F-005 失败恢复与死信 / replay 准备 | delivery 失败、重试耗尽或 operator 请求恢复时，能形成 retry、dead-letter 或 replay preparation 材料，且 replay 不绕过历史与审计链。 |
| 功能能力验收 | F-006 总线级审计、tap 和只读输出 | bus 能输出 audit material、tap output、transport view 和 failure material，且这些输出保持只读边界。 |
| 功能能力验收 | F-007 Outbox relay 边界承接 | bus 只承接已提交 outbox fact，不把未提交业务状态推进到 bus。 |
| 功能能力验收 | F-008 后端适配边界与默认可验证路径 | 至少存在一条默认可验证 delivery path，且后端差异不改变上层 transport semantic。 |
| 规则 / 边界验收 | `L0-core` 契约边界 | Event、Error、TraceContext、Metadata、ActorRef 等共享契约由 `L0-core` 提供，`L0-bus` 不重新定义。 |
| 规则 / 边界验收 | payload 边界 | `L0-bus` 不保存、不解释业务 payload 正文真相，只保存引用和 bus 传递事实。 |
| 规则 / 边界验收 | 只读输出边界 | SDK transport view、tap output、failure material 不得反写 bus truth。 |
| 规则 / 边界验收 | replay 边界 | 未形成完整 dead-letter、delivery history 和 audit chain 时，不允许 replay。 |
| 规则 / 边界验收 | governance 边界 | failure material 只能表达 bus 失败事实，不能直接生成 governance decision。 |
| 数据归属验收 | bus truth 数据归属 | publication acceptance、delivery record、ack / fail result、idempotency anchor、retry / dead-letter / replay material、bus audit trail 被明确为 bus 真相数据。 |
| 数据归属验收 | 快照与引用边界 | transport view、tap / trace / metrics material、failure summary 是快照；core contract、payload、outbox fact、backend capability 是引用。 |
| 数据归属验收 | 禁止正文边界 | business payload body、raw secret / credential、governance decision body、observability long-term log body 不进入 bus 数据真相。 |
| 非功能验收 | 主链性能口径 | 需求、架构或测试后续必须能证明默认可验证路径不会依赖不可验证的后端性能假设。 |
| 非功能验收 | 外围增强降级口径 | Redis / Kafka 完整适配、Filter DSL、DLQ UI、完整 ops runbook 未完成时，核心闭环仍有默认可验证路径。 |
| 非功能验收 | 安全与授权口径 | tap、DLQ 读取、replay preparation、failure material 输出具备授权边界，不作为普通无约束读写面暴露。 |
| 非功能验收 | 审计与可追溯口径 | 关键状态变化能关联 bus audit trail 或 delivery history，不仅存在于瞬时内存状态。 |
| 非功能验收 | 幂等 / 一致性口径 | bus 能识别重复 delivery 和重复结果反馈，但不接管订阅方业务副作用幂等。 |
| 非功能验收 | 可观测性口径 | operator、observability、governance、SDK 能消费必要的只读状态、tap / audit material 或 failure material。 |

### 14.2 一票否决项

- `L0-bus` 无法形成契约化输入、transport semantic、delivery、结果留痕、失败恢复和只读输出的主闭环。
- `L0-bus` 重新定义 `L0-core` 已拥有的 Event、Error、TraceContext、Metadata、ActorRef 等共享契约。
- `L0-bus` 保存或解释业务 payload 正文真相、raw secret、governance decision body 或 observability long-term log body。
- delivery 成功、失败、超时、重试、dead-letter 或 replay preparation 无正式追溯链。
- 未满足 dead-letter、delivery history 和 audit chain 时允许 replay。
- tap、DLQ 读取、replay preparation 或 failure material 输出没有授权边界。
- backend adapter 差异泄漏成上层 transport semantic，导致后端切换改变需求语义。
- failure material 被直接当成 governance decision，而不是只读失败事实材料。
```

---

## 7. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把完整 NATS / Redis / Kafka / InMem 四后端都列为验收通过条件 | 全部列为 P0 验收 | 只验 adapter 边界和默认可验证路径 | 推荐 B。原因是完整多后端适配属于后续增强，不应阻塞 bus 需求主闭环 |
| Q-002 | 是否把验收标准写成测试步骤 | 写具体调用和断言步骤 | 只写验收对象与通过条件 | 推荐 B。原因是测试步骤属于测试方案，不属于需求验收标准 |

当前建议：接受上述推荐后进入 Step 15。

---

## 8. 进入下一步条件

- 已按核心能力闭环、功能能力、规则 / 边界、数据归属、非功能五类验收组织。
- 每项验收都有可判断的通过条件。
- 已明确一票否决项。
- 没有写测试脚本、接口调用步骤、CI 配置或具体测试数据。
