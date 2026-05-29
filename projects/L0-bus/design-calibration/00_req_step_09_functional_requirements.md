# Step 9. 功能需求

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 9
> 回填章节: `00-需求文档.md` §9 功能需求
> 生成日期: 2026-05-29

---

## 1. 本步目标

把 Step 8 的用户故事归并为系统能力。功能需求按业务能力拆分，不按对象、API、CRUD、Command、后端 adapter 或文件结构拆分。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 7 核心能力闭环 | 每项功能必须映射到至少一个闭环节点 |
| Step 8 用户故事 | 每项功能必须支撑至少一个用户故事 |
| Step 4 目标与非目标 | 控制 P0 / P0-min / P1 范围 |

---

## 3. 应问的问题与回答

### 3.1 系统必须提供哪些业务能力？

系统必须提供八类能力：

1. 契约绑定的发布材料接入。
2. 统一传递语义形成。
3. 订阅与 delivery 推进。
4. delivery 结果与幂等锚点记录。
5. 失败恢复与死信 / replay 准备。
6. 总线级审计、tap 和只读消费输出。
7. Outbox relay 边界承接。
8. 后端适配边界与默认可验证路径。

### 3.2 每个能力的输入、输出、触发条件、失败情况是什么？

见结构化中间产物的功能需求表。需求阶段只描述能力边界，不写 API path、Rust 函数或数据库表。

### 3.3 哪些能力共同构成闭环核心？哪些只是外围增强？

F-001~F-006 构成 P0 主闭环；F-007~F-008 属于 P0-min 边界能力，用于支撑 outbox 和 backend 可验证性。Redis / Kafka 完整适配、filter DSL、DLQ UI、多租户和 exactly-once 仍是外围增强，不进入本步功能需求主表。

---

## 4. 结构化中间产物

### 4.1 功能需求结论

| 编号 | 功能需求 | 输入 | 输出 | 触发条件 | 失败情况 | 优先级 | 支撑闭环 | 支撑故事 |
|---|---|---|---|---|---|---|---|---|
| F-001 | 契约绑定的发布材料接入 | `L0-core` 契约引用、发布方 payload 或 outbox fact | 可进入 bus 传递链的发布材料 | 发布方提交已提交事实或事件材料 | 契约引用缺失、metadata 不合法、payload 来源不可信 | P0 | CL-001 | US-001 |
| F-002 | 统一传递语义形成 | 合法发布材料、传递意图、上下文 | 平台级传递语义 | 发布材料通过接入校验 | 传递语义无法判定、与 core 契约冲突、裸 MQ 参数泄漏 | P0 | CL-002 | US-001 / US-007 |
| F-003 | 订阅与 delivery 推进 | 传递语义、订阅关系、后端可用路径 | 面向订阅方的 delivery | 有订阅方匹配传递范围 | 无可用订阅、路由不成立、后端不可用 | P0 | CL-003 | US-002 |
| F-004 | delivery 结果与幂等锚点记录 | delivery 结果、订阅方反馈、幂等上下文 | delivery history、ack/fail 事实、幂等锚点 | 订阅方反馈处理结果或 delivery 超时 | 结果缺失、重复反馈冲突、幂等锚点不成立 | P0 | CL-004 | US-002 / US-003 / US-007 |
| F-005 | 失败恢复与死信 / replay 准备 | 失败 delivery、重试策略、历史记录 | retry 计划、dead-letter 材料、replay preparation | delivery 失败、重试耗尽或 operator 请求恢复 | 历史不完整、无死信材料、replay 条件不满足 | P0 | CL-005 | US-003 / US-005 |
| F-006 | 总线级审计、tap 和只读消费输出 | delivery history、失败材料、总线状态 | bus audit material、tap output、transport view、failure material | 事件传递、失败恢复或下游只读消费 | 输出反写真相、泄露 payload 禁止内容、tap 未授权 | P0 | CL-006 | US-004 / US-005 / US-006 |
| F-007 | Outbox relay 边界承接 | 已提交 outbox fact、core 契约引用、发布方上下文 | 可进入 F-001 的发布材料 | 发布方使用 outbox 模式提交事实 | outbox fact 未提交、重复 relay、事实与契约不匹配 | P0-min | CL-001 / CL-002 | US-001 |
| F-008 | 后端适配边界与默认可验证路径 | 统一传递语义、后端能力、环境 profile | 至少一条可验证 delivery path | 当前环境需要执行 delivery | 后端不可用、adapter 语义不支持、后端差异泄漏 | P0-min | CL-002 / CL-003 | US-002 / US-007 |

### 4.2 能力类型结论

| 类型 | 功能编号 |
|---|---|
| P0 主闭环 | F-001 / F-002 / F-003 / F-004 / F-005 / F-006 |
| P0-min 支撑边界 | F-007 / F-008 |
| P1/P2 外围增强 | Redis / Kafka 完整适配、Filter DSL、DLQ UI、多租户、effectively-once |

### 4.3 功能间依赖结论

```text
F-001 -> F-002 -> F-003 -> F-004 -> F-005 -> F-006
  ^                         ^
  |                         |
F-007                     F-008
```

图示说明：

- F-001~F-006 是主能力链。
- F-007 是输入来源边界，回到 F-001。
- F-008 是传递承载边界，支撑 F-003。
- 该图不是调用链，也不是实施顺序。

---

## 5. 改动前后差异

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 功能拆分依据 | EventBus trait、NATS/Redis/Kafka、Outbox、DLQ、tap 等技术对象 | 契约接入、传递语义、delivery 推进、结果留痕、失败恢复、只读输出等业务能力 |
| P0 范围 | 四后端、tap-all、Outbox worker 等都像 P0 | F-001~F-006 为 P0，F-007~F-008 为 P0-min，其他后移 |
| SDK | 多语言 client 作为 bus 功能 | bus 只输出 transport view，SDK client 归 `L0-sdk` |
| 后端 adapter | 按产品列功能 | 只作为后端适配边界与默认可验证路径 |

---

## 6. 回填草稿

```md
## 9. 功能需求

> 校准来源：
> - `design-calibration/00_req_step_09_functional_requirements.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“功能需求结论”“能力类型结论”和“功能间依赖结论”小节，了解功能需求如何按业务能力而不是对象或后端拆分。

| 编号 | 功能需求 | 输入 | 输出 | 触发条件 | 失败情况 | 优先级 | 支撑闭环 | 支撑故事 |
|---|---|---|---|---|---|---|---|---|
| F-001 | 契约绑定的发布材料接入 | `L0-core` 契约引用、发布方 payload 或 outbox fact | 可进入 bus 传递链的发布材料 | 发布方提交已提交事实或事件材料 | 契约引用缺失、metadata 不合法、payload 来源不可信 | P0 | CL-001 | US-001 |
| F-002 | 统一传递语义形成 | 合法发布材料、传递意图、上下文 | 平台级传递语义 | 发布材料通过接入校验 | 传递语义无法判定、与 core 契约冲突、裸 MQ 参数泄漏 | P0 | CL-002 | US-001 / US-007 |
| F-003 | 订阅与 delivery 推进 | 传递语义、订阅关系、后端可用路径 | 面向订阅方的 delivery | 有订阅方匹配传递范围 | 无可用订阅、路由不成立、后端不可用 | P0 | CL-003 | US-002 |
| F-004 | delivery 结果与幂等锚点记录 | delivery 结果、订阅方反馈、幂等上下文 | delivery history、ack/fail 事实、幂等锚点 | 订阅方反馈处理结果或 delivery 超时 | 结果缺失、重复反馈冲突、幂等锚点不成立 | P0 | CL-004 | US-002 / US-003 / US-007 |
| F-005 | 失败恢复与死信 / replay 准备 | 失败 delivery、重试策略、历史记录 | retry 计划、dead-letter 材料、replay preparation | delivery 失败、重试耗尽或 operator 请求恢复 | 历史不完整、无死信材料、replay 条件不满足 | P0 | CL-005 | US-003 / US-005 |
| F-006 | 总线级审计、tap 和只读消费输出 | delivery history、失败材料、总线状态 | bus audit material、tap output、transport view、failure material | 事件传递、失败恢复或下游只读消费 | 输出反写真相、泄露 payload 禁止内容、tap 未授权 | P0 | CL-006 | US-004 / US-005 / US-006 |
| F-007 | Outbox relay 边界承接 | 已提交 outbox fact、core 契约引用、发布方上下文 | 可进入 F-001 的发布材料 | 发布方使用 outbox 模式提交事实 | outbox fact 未提交、重复 relay、事实与契约不匹配 | P0-min | CL-001 / CL-002 | US-001 |
| F-008 | 后端适配边界与默认可验证路径 | 统一传递语义、后端能力、环境 profile | 至少一条可验证 delivery path | 当前环境需要执行 delivery | 后端不可用、adapter 语义不支持、后端差异泄漏 | P0-min | CL-002 / CL-003 | US-002 / US-007 |

Redis / Kafka 完整适配、Filter DSL、DLQ UI、多租户和 effectively-once 属于外围增强，不进入当前 P0 功能需求主表。
```

---

## 7. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把 `tap` 单独拆成一个功能 | 单独拆 F-009 | 放入 F-006 只读输出能力 | 推荐 B。原因是 tap 是只读输出的一类，需求阶段不必单独对象化 |
| Q-002 | 是否把 NATS / InMemory 分别写成功能 | 分别写功能 | 合并为 F-008 后端适配边界 | 推荐 B。原因是功能应按业务能力拆，不按后端产品拆 |

当前建议：接受上述推荐后进入 Step 10。

---

## 8. 进入下一步条件

- 每项功能都服务至少一个用户故事。
- 每项功能都映射到核心能力闭环。
- 功能按业务能力拆分，没有按对象、API、CRUD、Command、后端 adapter 或文件结构拆分。
