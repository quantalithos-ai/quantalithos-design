# Step 12. 接口与依赖

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 12
> 回填章节: `00-需求文档.md` §12 接口与依赖
> 生成日期: 2026-05-29

---

## 1. 本步目标

说明 `L0-bus` 在需求层对外体现为哪些能力级接口面，以及消费哪些外部能力输入。本步不写 API 路径、RPC 方法、DTO schema 或 Rust trait。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 6 使用方与依赖 | 提供输入依赖和输出消费方 |
| Step 9 功能需求 | 提供能力边界 |
| Step 11 数据归属 | 确认接口面不越过数据归属边界 |

---

## 3. 应问的问题与回答

### 3.1 本仓对外提供哪些能力级接口？

`L0-bus` 对外提供六类能力级接口面：

- 发布材料接入面。
- 订阅与 delivery 面。
- delivery 结果反馈面。
- 失败恢复与 replay 控制面。
- tap / audit / transport view 只读消费面。
- 运行状态与 operator 处置面。

### 3.2 本仓消费哪些能力级输入？

`L0-bus` 消费四类输入：

- `L0-core` 共享契约输入。
- 发布方 payload / outbox fact 输入。
- 后端传输能力输入。
- 持久化与时间 / ID 等基础能力输入。

### 3.3 哪些是同步能力边界，哪些是异步能力边界？

| 类型 | 能力 |
|---|---|
| 同步能力边界 | 发布材料接入、delivery 结果反馈、replay 请求校验、operator 查询 |
| 异步能力边界 | delivery 推进、retry、dead-letter、tap 输出、transport view 刷新 |
| 只读查询边界 | transport view、failure material、lag / health / audit summary |
| 运维控制边界 | replay、DLQ 处置、后端健康检查、暂停 / 恢复消费 |

---

## 4. 结构化中间产物

### 4.1 对外能力接口结论

| 能力接口面 | 接口类型 | 提供给谁 | 能力说明 | 相关功能 |
|---|---|---|---|---|
| 发布材料接入面 | 同步能力 | 发布方仓 / outbox relay actor | 接收基于 `L0-core` 契约的发布材料，并进入传递链 | F-001 / F-007 |
| 订阅与 delivery 面 | 异步能力 | 订阅方仓 | 按统一 delivery 语义向订阅方推进消息 | F-003 |
| delivery 结果反馈面 | 同步 / 异步能力 | 订阅方仓 | 接收处理结果，形成 ack / fail / timeout 事实 | F-004 |
| 失败恢复面 | 运维控制能力 | operator / bus maintainer | 支持 retry、dead-letter、replay preparation 的受控推进 | F-005 |
| 只读消费面 | 只读查询 / 异步输出 | `L0-sdk` / observability / governance | 输出 transport view、tap、audit material、failure material | F-006 |
| 后端适配能力面 | 内部能力边界 | bus backend adapter | 将平台传递语义映射到后端能力，不泄漏后端差异 | F-008 |
| 运行状态面 | 只读查询 / 运维控制 | SRE / operator | 查看 lag、DLQ、retry backlog、backend health 等运行材料 | F-004 / F-005 / F-008 |

### 4.2 外部依赖边界结论

| 依赖边界 | 依赖类型 | 提供方 | `L0-bus` 如何使用 | 失败影响 |
|---|---|---|---|---|
| 共享契约输入 | 稳定上游契约 | `L0-core` | 校验发布材料、传递语义、错误和 trace 口径 | 强阻塞 |
| 发布材料输入 | 业务事实输入 | L1 / L2 / L3 发布方 | 形成 bus 传递链入口 | 可用 fixture 替代验证 |
| Outbox fact 输入 | 已提交事实输入 | 发布方仓 | 支撑 outbox relay boundary | 影响 F-007 |
| 后端传输能力 | 外部运行能力 | NATS / in-memory / 后续后端 | 承载实际 delivery | 影响 F-003 / F-008 |
| 持久化能力 | 外部运行能力 | 数据库 / 存储 | 保存 delivery、DLQ、audit、replay material | 影响 F-004 / F-005 / F-006 |
| 时间 / ID / trace 基础能力 | 基础能力 | `L0-core` 或运行环境 | 支撑追踪、排序、幂等和留痕 | 影响全链路一致性 |

### 4.3 接口类型结论

| 接口类型 | 本仓适用项 |
|---|---|
| 同步能力边界 | 发布材料接入、结果反馈、replay 请求校验、operator 查询 |
| 异步能力边界 | delivery 推进、retry、dead-letter、tap 输出 |
| 只读查询边界 | transport view、failure material、audit summary、health / lag |
| 运维控制边界 | DLQ 处置、replay、pause / resume consumption |

### 4.4 依赖类型结论

| 依赖类型 | 对象 |
|---|---|
| 强前置依赖 | `L0-core` 共享契约、持久化能力、可验证后端路径 |
| 可替代验证依赖 | 发布方样本、fake backend、fixture outbox fact |
| 非阻塞消费方 | `L0-sdk`、observability、governance、archive、L5/L6 |

---

## 5. 改动前后差异

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 接口描述 | 旧文档倾向 EventBus trait / publish / subscribe / ack 等方法 | 需求层改成能力接口面，不写方法签名 |
| 后端依赖 | 后端产品像并列接口 | 后端是运行依赖和 adapter 边界 |
| 只读输出 | sdk / observability / governance 分散表达 | 统一归为只读消费面 |
| 运维能力 | DLQ / replay / lag 与功能混写 | 单列运行状态与运维控制边界 |

---

## 6. 回填草稿

```md
## 12. 接口与依赖

> 校准来源：
> - `design-calibration/00_req_step_12_interfaces_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“对外能力接口结论”“外部依赖边界结论”和“回填草稿”小节，了解本仓能力级接口面如何收敛。

### 12.1 对外能力接口

| 能力接口面 | 接口类型 | 提供给谁 | 能力说明 | 相关功能 |
|---|---|---|---|---|
| 发布材料接入面 | 同步能力 | 发布方仓 / outbox relay actor | 接收基于 `L0-core` 契约的发布材料，并进入传递链 | F-001 / F-007 |
| 订阅与 delivery 面 | 异步能力 | 订阅方仓 | 按统一 delivery 语义向订阅方推进消息 | F-003 |
| delivery 结果反馈面 | 同步 / 异步能力 | 订阅方仓 | 接收处理结果，形成 ack / fail / timeout 事实 | F-004 |
| 失败恢复面 | 运维控制能力 | operator / bus maintainer | 支持 retry、dead-letter、replay preparation 的受控推进 | F-005 |
| 只读消费面 | 只读查询 / 异步输出 | `L0-sdk` / observability / governance | 输出 transport view、tap、audit material、failure material | F-006 |
| 后端适配能力面 | 内部能力边界 | bus backend adapter | 将平台传递语义映射到后端能力，不泄漏后端差异 | F-008 |
| 运行状态面 | 只读查询 / 运维控制 | SRE / operator | 查看 lag、DLQ、retry backlog、backend health 等运行材料 | F-004 / F-005 / F-008 |

### 12.2 外部依赖边界

| 依赖边界 | 依赖类型 | 提供方 | `L0-bus` 如何使用 | 失败影响 |
|---|---|---|---|---|
| 共享契约输入 | 稳定上游契约 | `L0-core` | 校验发布材料、传递语义、错误和 trace 口径 | 强阻塞 |
| 发布材料输入 | 业务事实输入 | L1 / L2 / L3 发布方 | 形成 bus 传递链入口 | 可用 fixture 替代验证 |
| Outbox fact 输入 | 已提交事实输入 | 发布方仓 | 支撑 outbox relay boundary | 影响 F-007 |
| 后端传输能力 | 外部运行能力 | NATS / in-memory / 后续后端 | 承载实际 delivery | 影响 F-003 / F-008 |
| 持久化能力 | 外部运行能力 | 数据库 / 存储 | 保存 delivery、DLQ、audit、replay material | 影响 F-004 / F-005 / F-006 |
| 时间 / ID / trace 基础能力 | 基础能力 | `L0-core` 或运行环境 | 支撑追踪、排序、幂等和留痕 | 影响全链路一致性 |
```

---

## 7. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否在需求阶段写 EventBus trait 方法 | 写方法名 | 只写能力接口面 | 推荐 B。原因是方法签名属于概要 / 详细设计 |
| Q-002 | 是否把 replay 写成业务接口 | 是 | 写成运维控制边界 | 推荐 B。原因是 replay 是受控恢复动作，不是普通业务接口 |

当前建议：接受上述推荐后进入 Step 13。

---

## 8. 进入下一步条件

- 已明确能力级接口面。
- 已明确外部依赖边界。
- 已区分同步、异步、只读和运维控制边界。
- 没有写 API path、RPC 方法、DTO schema 或 Rust trait。
