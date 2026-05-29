# Step 5. 用户与角色

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 5
> 回填章节: `00-需求文档.md` §5 用户与角色
> 生成日期: 2026-05-29

---

## 1. 本步目标

明确哪些人类角色和系统角色会接触 `L0-bus`，以及它们分别为什么接触本仓；本步不写仓际依赖、不写接口清单、不写用户故事。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 2 本仓边界 | 防止把相邻仓本体写成角色 |
| Step 4 目标与非目标 | 确认角色围绕事件传递、失败恢复、留痕、tap 和消费边界出现 |
| 旧 `00` 用户与角色章节 | 迁移 Bus Maintainer、SRE、observability、下游开发者等合理角色 |

---

## 3. 应问的问题与回答

### 3.1 本仓有哪些主要角色？

本仓角色分为两类：

- 人类角色：负责维护、接入、运维、审计和评审 bus 需求。
- 系统角色：在运行时发布、订阅、tap、读取失败材料或作为后端承载 delivery。

### 3.2 哪些是人类角色？

| 人类角色 | 使用场景 |
|---|---|
| Bus maintainer | 维护 bus 需求、边界、delivery 语义、恢复语义和后端适配策略 |
| 发布方开发者 | 在业务仓中把已提交事实交给 bus 传递，但不改变 bus truth |
| 订阅方开发者 | 依据 bus delivery 语义处理事件、ack / fail，并实现业务幂等 |
| SDK maintainer | 消费 bus transport view，封装开发者体验，但不反写 bus truth |
| Observability maintainer | 消费 tap / trace / bus audit material，构建观测和审计视图 |
| Governance maintainer | 消费 dead-letter / failure material，进入策略和审批流程 |
| SRE / operator | 观察 lag、retry、dead-letter、replay 和后端状态，执行运维处置 |
| 架构 / 标准评审者 | 审查 bus 是否守住 core / sdk / observability / governance 边界 |

### 3.3 哪些是系统角色？

| 系统角色 | 使用场景 |
|---|---|
| Publisher service | 将领域事实或系统事实提交到 bus 传递链 |
| Subscriber service | 从 bus 接收 delivery，并返回 ack / fail 结果 |
| Outbox relay actor | 将业务仓已提交 outbox fact 推进到 bus 传递链 |
| Bus backend adapter | 承接 bus 平台语义到具体后端能力的映射 |
| Tap consumer | 以受控方式接收 bus 事件流副本，用于观测或审计 |
| Replay actor | 在授权和材料完整时触发 replay 准备或执行 |
| Failure material consumer | 读取 bus 失败材料，交给 governance 或 operator 处理 |

### 3.4 是否存在管理、审计或维护类角色？

存在，且这些角色必须与业务发布 / 订阅角色区分：

- Bus maintainer 维护 bus 需求和语义。
- SRE / operator 处理运行异常，不定义业务语义。
- Observability maintainer 消费 tap 和 trace，不拥有 bus truth。
- Governance maintainer 消费失败材料，不直接把 bus failure 当成治理决策。
- 架构 / 标准评审者审查边界，不参与运行时处理。

### 3.5 是否需要权限差异？

需求阶段需要给出角色权限差异方向，但不展开认证授权机制。认证授权不是 `L0-bus` 需求主线，后续只要求不同角色对 publish、subscribe、tap、replay、DLQ 读取等能力具备不同授权边界。

---

## 4. 改动前后差异

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 角色粒度 | “L1 六域开发者 / Runtime 开发者 / SRE / Console 维护者”等混合仓与人 | 按人类角色与系统角色拆分 |
| 权限矩阵 | 提前列 publish / subscribe / tap-all / DLQ 操作权限 | 需求阶段只保留权限差异方向，不提前写授权实现 |
| Tech Lead / Admin | 容易写成人员头衔 | 改为“架构 / 标准评审者”“SRE / operator”等职责角色 |
| Console | 旧文档出现 DLQ / 运维面板维护者 | Console UI 是下游产品角色，不作为 bus 本仓核心角色 |

---

## 5. 结构化中间产物

### 5.1 角色结论

| 角色 | 类型 | 接触场景 |
|---|---|---|
| Bus maintainer | 人类 | 维护 bus 需求、语义、边界和版本演进 |
| 发布方开发者 | 人类 | 接入 publish / outbox relay，确保业务事实进入 bus |
| 订阅方开发者 | 人类 | 接入 delivery，处理 ack / fail 和业务幂等 |
| SDK maintainer | 人类 | 消费 transport view 封装 SDK |
| Observability maintainer | 人类 | 消费 tap、trace、bus audit material |
| Governance maintainer | 人类 | 消费 failure material，进入治理流程 |
| SRE / operator | 人类 | 处理 lag、DLQ、replay 和后端运行异常 |
| 架构 / 标准评审者 | 人类 | 审查边界、标准对齐和破坏性变更 |

### 5.2 系统角色结论

| 系统角色 | 类型 | 接触场景 |
|---|---|---|
| Publisher service | 系统 | 提交事件或事实进入 bus |
| Subscriber service | 系统 | 接收 delivery 并返回处理结果 |
| Outbox relay actor | 系统 | 推进已提交 outbox fact |
| Bus backend adapter | 系统 | 把平台语义映射到具体消息后端 |
| Tap consumer | 系统 | 受控消费事件流副本 |
| Replay actor | 系统 | 基于完整材料触发 replay |
| Failure material consumer | 系统 | 读取失败材料供治理或运维处理 |

### 5.3 权限差异结论

| 能力 | 普通发布 / 订阅角色 | 维护 / 运维角色 | 观测 / 治理角色 |
|---|---|---|---|
| publish | 允许，受发布范围约束 | 可维护规则，不替业务发布 | 通常不发布业务事件 |
| subscribe | 允许，受订阅范围约束 | 可诊断订阅状态 | 只消费授权视图 |
| tap | 默认不允许 | 可配置 / 诊断 | observability 可受控消费 |
| dead-letter read | 默认不允许 | 允许处理 | governance 可读取 failure material |
| replay | 默认不允许 | 可在授权下执行 | governance 可参与放行规则 |

---

## 6. 回填草稿

```md
## 5. 用户与角色

> 校准来源：
> - `design-calibration/00_req_step_05_users_roles.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“改动前后差异”和“回填草稿”小节，了解角色如何从旧文档的仓名 / 人员头衔收敛为职责角色。

### 5.1 人类角色

| 角色 | 使用场景 |
|---|---|
| Bus maintainer | 维护 bus 需求、语义、边界和版本演进 |
| 发布方开发者 | 在业务仓中把已提交事实交给 bus 传递 |
| 订阅方开发者 | 依据 bus delivery 语义处理事件、ack / fail，并实现业务幂等 |
| SDK maintainer | 消费 bus transport view，封装开发者体验 |
| Observability maintainer | 消费 tap、trace 和 bus audit material |
| Governance maintainer | 消费 dead-letter / failure material，进入策略和审批流程 |
| SRE / operator | 观察 lag、retry、dead-letter、replay 和后端状态，执行运维处置 |
| 架构 / 标准评审者 | 审查 bus 是否守住 core / sdk / observability / governance 边界 |

### 5.2 系统角色

| 系统角色 | 使用场景 |
|---|---|
| Publisher service | 将领域事实或系统事实提交到 bus 传递链 |
| Subscriber service | 从 bus 接收 delivery，并返回 ack / fail 结果 |
| Outbox relay actor | 将业务仓已提交 outbox fact 推进到 bus 传递链 |
| Bus backend adapter | 承接 bus 平台语义到具体后端能力的映射 |
| Tap consumer | 以受控方式接收 bus 事件流副本 |
| Replay actor | 在授权和材料完整时触发 replay |
| Failure material consumer | 读取 bus 失败材料，交给 governance 或 operator 处理 |
```

---

## 7. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否保留旧文档中的 Tech Lead / Admin | 保留为角色 | 改成职责角色 | 推荐 B。原因是需求文档应表达职责，不绑定组织头衔 |
| Q-002 | 是否把 Console 维护者作为本仓核心角色 | 写入核心角色 | 作为下游产品角色，后续使用方 / 依赖表达 | 推荐 B。原因是 DLQ UI 不属于当前 `L0-bus` P0 目标 |

当前建议：接受上述推荐后进入 Step 6。

---

## 8. 进入下一步条件

- 已区分人类角色与系统角色。
- 已明确管理、审计、维护、发布、订阅、观测、治理角色。
- 没有把仓际依赖表、接口动作或用户故事混写进本章。
