# L2-runtime 01 架构 Step 9: 关键交互与通信方式

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 10 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 4 系统上下文、Step 6 运行承载、Step 8 数据 / 一致性 |
| 通信类型 | 同步请求 / 响应；异步事件 / 回调；后台任务 / 延后承接 |
| 禁止 | API path、event / topic 名、DTO / schema、时序图、协议产品或重试实现 |

## 1. 问题回答与取舍

需要即时判断正式受理、source / precondition、query 或控制结果的边界采用同步请求 / 响应；已成立事实传播和外部结果送达采用异步事件 / 回调；长时 run 推进、等待恢复、projection / handoff continuation 采用后台延后承接。一次场景可以组合方式，但每种方式负责不同语义，不能先返回“成功”再后台补正式事实。旧 UDS gRPC、in-process / sandbox bridge、async trace emit 为未核验协议 / 实现，只作 historical material。

## 2. 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| Runtime trigger / control 受理 | Entry consumers ↔ Runtime entry | 即时判断请求是否形成合法 run / control intent | 必须明确 accepted / rejected / blocked，不等于 run 已完成。 |
| Runtime status / safe outcome 查询 | Consumers ↔ Safe Runtime Views | 返回当前可见的安全运行语义 | 只读、body-free，不触发 truth mutation。 |
| Definition / decision / capability ref 解析 | Runtime ↔ external truth sources | 判断当前来源是否可验证、适用、fresh | 结果影响当前 decision，不能从私有字符串猜测。 |
| Model turn 承接与结果回送 | Model Decision ↔ model adapter | 提交 provider-neutral intent 并关联 result / failure | logical selection 与 physical route 分离。 |
| Tool action 前置 / 提交 | Action Orchestration ↔ Governance / Tools / Sandbox | 判断前置并提交正式 action seam | action choice 不等于 authorization / execution。 |
| Tool / Sandbox / model / child 结果送达 | External owners ↔ Feedback boundary | 将外部已成立或未知结果关联回当前 run | 迟到 / 重复 / 乱序不得逆写历史。 |
| Runtime committed fact 传播 | Runtime ↔ Bus / Observability / consumers | 传播已成立、body-free 的状态 / outcome / gap | 传播失败不回滚 local truth。 |
| Run continuation / recovery | Runtime state ↔ background continuation | 推进长时 run、resume、reflection、recovery 和等待收敛 | 不适合强压进同步入口。 |
| Safe view / handoff material 维护 | Runtime truth ↔ projection / handoff boundary | 派生可消费视图、attempt / gap、刷新关联 | 可延迟 / 重建，不成为业务写源。 |
| Durable memory retrieval / candidate handoff | Context & Memory ↔ pending memory owner | 消费检索引用并交接候选 | owner 未闭口，正向路径可 unavailable。 |

## 3. 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| Runtime trigger / control 受理 | 同步请求 / 响应 | 不宜以纯异步受理掩盖合法性判断 | reject / blocked / unknown，不返回伪完成 | 入口必须即时判定是否被正式接受。 |
| Runtime status / safe outcome 查询 | 同步请求 / 响应 | 不宜后台修改后再返回 | unavailable / stale / gap / not-visible | 查询只读且可见性需即时判断。 |
| Definition / decision / capability ref 解析 | 同步请求 / 响应；按需后台刷新 | 不宜以旧快照静默替代即时判断 | stale / conflict / missing -> wait / fail closed | 当前 decision 依赖时点适用性。 |
| Model turn 承接与结果回送 | 同步或异步 adapter boundary，语义必须相关联 | 不宜把物理 provider 方式固化为 Runtime 语义 | timeout / unavailable / unknown / late | 具体正向 contract pending，架构只锁关联和失败。 |
| Tool action 前置 / 提交 | 同步前置判断 + 可异步结果送达 | 不宜全同步压平执行 / receipt / outcome | no-execution / waiting / blocked / unknown | 正式 owner 的状态必须分层。 |
| 外部结果送达 | 异步事件 / 回调 | 不宜轮询私有存储或直接共享 DB | pending / duplicate / late / unresolved | 外部结果先在 owner 处成立，再关联进入 Runtime。 |
| Runtime committed fact 传播 | 异步事件 / 回调 | 不宜同步 fan-out 作为提交前置 | attempt / gap / failed / retryable | local truth first。 |
| Run continuation / recovery | 后台任务 / 延后承接 | 不宜同步接口长时占有或先返回 success | waiting / paused / blocked / unknown | 长时推进可挂起并从 stable point 恢复。 |
| Safe view / handoff 维护 | 后台任务 / 延后承接 | 不宜阻塞核心提交 | stale / rebuilding / gap / unavailable | 派生可延迟、可重建。 |
| Memory retrieval / candidate handoff | 同步查询或异步 / 后台候选交接 | 不宜把候选直接写成本地 durable truth | degraded / unavailable / pending / rejected | durable owner pending，working-only 可继续。 |

## 4. 按架构单元交互方式与停审

| 单元 | 同步交互 | 异步交互 | 后台 / 延后承接 | 失败降级 | 停审 |
|---|---|---|---|---|---|
| Run & Goal-Plan | trigger / control / status judgment | committed state feedback | long-running progression | reject / wait / blocked / unknown | pass |
| Context & Memory | source resolution / current retrieval | memory result / change feedback | candidate handoff / refresh | degraded / stale / unavailable | pass |
| Model Decision | adapter capability / optional turn boundary | result delivery | timeout / late reconciliation | unavailable / unknown / blocked | pass |
| Action & Delegation | precondition / acceptance | Tool / Sandbox / child result delivery | waiting / child continuation | no-execution / rejected / unknown | pass |
| Checkpoint / Recovery / Handoff | control / resume judgment | committed fact propagation / feedback | recovery / projection / handoff continuation | paused / gap / retryable without blind side effect | pass |
| Entry & Control | formal entry / safe query | control outcome awareness | none as truth mutation | reject / unavailable | pass |
| External Truth Views | current resolution | change / result delivery | refresh / reconciliation | stale / conflict / gap | pass |
| Safe Runtime Views | safe query | projection change propagation | rebuild / material assembly | stale / unavailable / gap | pass |

## 5. 简化交互示意

```text
 [Entry / current judgment] -- synchronous --> [Runtime truth boundary]
                                                     |
                                                     | committed fact
                                                     v
 [External result delivery] -- asynchronous --> [Correlation / new fact]
                                                     |
                                                     v
 [Long run / recovery / view / handoff] ---- background continuation
```

- 同步只负责必须即时收口的判断，不保证外部执行或端到端交付完成。
- 异步送达形成新关联事实，不能覆盖已提交历史。
- 后台 continuation 可挂起 / 恢复，但 unknown side effect 不进入盲重试。

## 6. 跨交互边界审计与门禁

| 审计项 | 结论 | 状态 |
|---|---|---|
| 同步 / 异步冲突 | 受理与执行结果已分层；未承诺全同步闭环。 | pass |
| 直接穿透 | 无共享 DB、provider / Tool / Sandbox direct call 结论。 | pass |
| 协议下沉 | 未写 API / event / DTO / transport 产品。 | pass |
| 失败缺口 | 每类交互均有 reject / wait / gap / unknown 等口径。 | pass |
| pending contract | Tools-Sandbox、model、memory、event route 未伪造。 | pass |

```text
gate_status = pass
next_allowed_action = create_01_arch_step_10_technology_choices
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_10_start
```
