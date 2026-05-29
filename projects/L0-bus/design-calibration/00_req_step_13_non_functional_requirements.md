# Step 13. 非功能需求

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 13
> 回填章节: `00-需求文档.md` §13 非功能需求
> 生成日期: 2026-05-29

---

## 1. 本步目标

把 `L0-bus` 在需求层必须满足的质量约束收敛清楚。 本步只定义质量底线、判断口径和必要目标值，不提前指定 MQ 后端、存储优化、监控平台、重试算法或实现参数。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 7 核心能力闭环 | 确认非功能要求必须服务契约化输入、传递语义、delivery、结果留痕、失败恢复和只读输出 |
| Step 10 业务规则与边界约束 | 提取 payload 边界、replay 边界、tap 授权、audit append-only、adapter 语义稳定等质量底线 |
| Step 11 数据需求与数据归属 | 确认非功能要求不要求 bus 保存业务正文，不越过 truth / snapshot / reference / forbidden 数据边界 |
| Step 12 接口与依赖 | 确认同步能力、异步能力、只读查询和运维控制的质量要求 |

---

## 3. 应问的问题与回答

### 3.1 这个仓必须满足哪些性能要求？

`L0-bus` 的性能要求不应写成“必须支持某个具体 MQ 产品吞吐量”，而应写成：bus 的发布材料接入、delivery 推进、结果反馈和只读查询不能成为跨仓事件主链的结构性瓶颈。

当前阶段建议不绑定具体 QPS / TPS 目标，因为吞吐目标会受到运行后端、部署规模和订阅拓扑影响；需求层应先要求后续设计必须能给出压测口径，并能证明默认可验证路径不会阻塞核心闭环。

### 3.2 这个仓必须满足哪些可用性要求？

`L0-bus` 必须在外围增强缺失时仍能成立核心闭环。例如 Redis / Kafka 完整适配、Filter DSL、DLQ UI、完整 ops runbook 没有完成时，默认可验证路径仍应支持发布、delivery、结果留痕、失败进入受控恢复链路。

当后端传输能力、持久化能力或外部发布方输入不可用时，bus 应能形成明确失败状态或拒绝边界，而不是静默丢消息或生成不可追溯状态。

### 3.3 这个仓必须满足哪些安全要求？

`L0-bus` 不得越权保存业务 payload 正文、认证凭证、治理决策正文或观测长期日志正文。tap、DLQ 读取、replay preparation、failure material 输出必须具备授权边界；需求层不指定认证实现，但必须要求这些能力不能作为普通无约束读写面暴露。

### 3.4 这个仓必须满足哪些审计 / 可追溯要求？

发布材料进入 bus、delivery 推进、ack / fail、timeout、retry、dead-letter、replay preparation、tap 输出和 adapter 能力变化都必须可追溯。特别是 replay 不能绕过 dead-letter、delivery history 和 audit chain。

### 3.5 这个仓必须满足哪些幂等 / 一致性要求？

`L0-bus` 必须维护 bus 级 idempotency anchor 和 delivery result 的一致语义，用于识别重复 delivery 与重复结果反馈；但订阅方业务副作用的幂等性不属于 bus。bus 的 transport semantic 必须独立于具体后端，不能因后端切换而改变上层语义。

### 3.6 这个仓必须满足哪些可观测性要求？

`L0-bus` 必须让 operator、observability、governance 和 SDK 消费方稳定判断 bus 当前运行状态和关键异常，包括 delivery backlog、retry backlog、DLQ material、failed delivery summary、tap / audit material、backend health 和语义能力变化。需求层不指定仪表盘、日志字段或指标库。

### 3.7 哪些要求能量化，哪些只能给出判断口径？

当前需求阶段可量化的内容主要是“不得为空、不得缺链、不得无授权边界、不得无状态记录”这类结构性目标；吞吐、延迟、容量和恢复时间更适合在架构 / 测试阶段基于默认后端路径补充基准值。为了避免在需求层虚构数字，本步采用“结构性判断口径 + 后续必须可压测 / 可验证”的表达。

---

## 4. 结构化中间产物

### 4.1 非功能需求结论

| 非功能类别 | 要求 | 判断口径 / 目标值 |
|---|---|---|
| 性能 | 发布材料接入、delivery 推进、结果反馈和只读查询不得成为跨仓事件主链的结构性瓶颈。 | 架构与测试阶段必须给出默认可验证路径的压测口径；需求阶段至少证明核心闭环不会依赖不可验证的后端性能假设。 |
| 性能 | tap / audit / failure material 输出不得反向阻塞正常 delivery 主链。 | 只读输出消费延迟或失败不得导致已接受的 delivery 状态丢失或不可推进。 |
| 可用性 | 外围增强能力缺失时，核心发布、delivery、结果留痕和失败恢复链路仍应成立。 | Redis / Kafka 完整适配、Filter DSL、DLQ UI、完整 ops runbook 未完成时，默认可验证路径仍能闭合 F-001 ~ F-008。 |
| 可用性 | 后端、持久化或发布方输入不可用时，bus 必须形成明确拒绝、失败或恢复状态。 | 不允许静默丢弃、不可追溯失败或生成没有 delivery history 的半状态。 |
| 安全 | 本仓不得保存或解释业务 payload 正文、认证凭证、治理决策正文或观测长期日志正文。 | 数据归属表中的 forbidden body 不得进入 bus truth / snapshot / reference 数据。 |
| 安全 | tap、DLQ 读取、replay preparation 和 failure material 输出必须具备授权边界。 | 这些能力不得作为普通无约束读写面暴露；具体认证实现后续由架构 / 实施层决定。 |
| 审计 / 可追溯 | 发布、delivery、ack / fail、timeout、retry、dead-letter、replay preparation、tap 输出必须可追溯。 | 每个关键状态变化都能关联 bus audit trail 或 delivery history，不得只存在瞬时内存状态。 |
| 审计 / 可追溯 | adapter 能力变化不得静默改变上层 transport semantic。 | 后端能力变化必须能被追溯到能力声明或版本变化材料。 |
| 幂等 / 一致性 | bus 级 idempotency anchor 必须支持识别重复 delivery 与重复结果反馈。 | 可判断同一 bus delivery 是否重复、是否已反馈、是否进入恢复链路；业务副作用幂等不归 bus。 |
| 幂等 / 一致性 | transport semantic 必须独立于具体 MQ 后端，不能随后端切换发生需求语义漂移。 | 同一上层 delivery 语义在默认后端和后续 adapter 中保持一致；后端差异只在 adapter 边界内表达。 |
| 可观测性 | operator 必须能判断 bus backlog、retry backlog、DLQ material、failed delivery summary 和 backend health。 | 需求层至少要求存在可读取的运行状态面；具体指标名、日志字段和仪表盘不在本步定义。 |
| 可观测性 | SDK、observability、governance 必须能消费只读 transport view、tap / audit material 和 failure material。 | 只读输出能够说明来源、范围和只读性质，不反写 bus truth。 |

### 4.2 类别适用性结论

| 非功能类别 | 适用性 | 原因 |
|---|---|---|
| 性能 | 适用 | bus 位于跨仓事件主链，核心接入、delivery 和反馈不能成为主链瓶颈 |
| 可用性 | 适用 | bus 是跨仓事件传递运行主干，必须在外围增强缺失时仍有默认可验证路径 |
| 安全 | 适用 | bus 接触 payload 引用、tap、DLQ、failure material 等敏感边界 |
| 审计 / 可追溯 | 强适用 | bus 的存在价值包含传递、失败、恢复和只读输出的可追溯 |
| 幂等 / 一致性 | 强适用 | bus 必须稳定 delivery 语义，但不能接管订阅方业务幂等 |
| 可观测性 | 适用 | bus 运行状态会被 operator、observability、governance、SDK 消费 |

### 4.3 可量化与判断口径结论

| 要求类型 | 当前处理方式 | 原因 |
|---|---|---|
| 吞吐 / 延迟 / 容量 | 暂不在需求层写死数字，要求后续测试方案给出默认路径压测口径 | 具体数字取决于后端、部署规模和订阅拓扑，需求层提前写死容易变成虚假指标 |
| 状态留痕完整性 | 写成硬要求 | 是否存在 delivery history、audit trail、DLQ material 可以直接判断 |
| 授权边界 | 写成硬要求 | tap、DLQ、replay、failure material 是否有授权边界可以直接判断 |
| 数据越界 | 写成硬要求 | bus 是否保存 forbidden body 可以直接检查 |
| 只读输出边界 | 写成硬要求 | SDK / observability / governance 输出是否反写 bus truth 可以直接判断 |

---

## 5. 改动前后差异

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 性能 | 容易围绕具体后端或多语言 client 设想性能 | 回到 bus 主链质量，要求默认可验证路径可压测、不虚构数字 |
| 可用性 | 多后端像同时 P0 | P0 是默认可验证路径和 adapter 边界，外围后端完整适配不阻塞主闭环 |
| 安全 | tap-all、DLQ、replay 容易被写成普通能力 | 明确它们都是受控能力，必须具备授权边界 |
| 审计 | 旧文档分散在 DLQ / replay / observability 中 | 汇总为 bus 关键状态变化必须可追溯 |
| 幂等 | 容易混淆 bus 幂等和业务幂等 | 明确 bus 只维护 delivery / feedback 幂等锚点，业务副作用由订阅方负责 |
| 可观测性 | 可能提前写指标字段或 dashboard | 需求层只要求可稳定观察状态和异常，不写平台配置 |

---

## 6. 回填草稿

```md
## 13. 非功能需求

> 校准来源：
> - `design-calibration/00_req_step_13_non_functional_requirements.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“非功能需求结论”“类别适用性结论”和“可量化与判断口径结论”小节，了解本仓质量底线如何从核心闭环、规则边界、数据归属和接口依赖收敛。

| 非功能类别 | 要求 | 判断口径 / 目标值 |
|---|---|---|
| 性能 | 发布材料接入、delivery 推进、结果反馈和只读查询不得成为跨仓事件主链的结构性瓶颈。 | 架构与测试阶段必须给出默认可验证路径的压测口径；需求阶段至少证明核心闭环不会依赖不可验证的后端性能假设。 |
| 性能 | tap / audit / failure material 输出不得反向阻塞正常 delivery 主链。 | 只读输出消费延迟或失败不得导致已接受的 delivery 状态丢失或不可推进。 |
| 可用性 | 外围增强能力缺失时，核心发布、delivery、结果留痕和失败恢复链路仍应成立。 | Redis / Kafka 完整适配、Filter DSL、DLQ UI、完整 ops runbook 未完成时，默认可验证路径仍能闭合 F-001 ~ F-008。 |
| 可用性 | 后端、持久化或发布方输入不可用时，bus 必须形成明确拒绝、失败或恢复状态。 | 不允许静默丢弃、不可追溯失败或生成没有 delivery history 的半状态。 |
| 安全 | 本仓不得保存或解释业务 payload 正文、认证凭证、治理决策正文或观测长期日志正文。 | 数据归属表中的 forbidden body 不得进入 bus truth / snapshot / reference 数据。 |
| 安全 | tap、DLQ 读取、replay preparation 和 failure material 输出必须具备授权边界。 | 这些能力不得作为普通无约束读写面暴露；具体认证实现后续由架构 / 实施层决定。 |
| 审计 / 可追溯 | 发布、delivery、ack / fail、timeout、retry、dead-letter、replay preparation、tap 输出必须可追溯。 | 每个关键状态变化都能关联 bus audit trail 或 delivery history，不得只存在瞬时内存状态。 |
| 审计 / 可追溯 | adapter 能力变化不得静默改变上层 transport semantic。 | 后端能力变化必须能被追溯到能力声明或版本变化材料。 |
| 幂等 / 一致性 | bus 级 idempotency anchor 必须支持识别重复 delivery 与重复结果反馈。 | 可判断同一 bus delivery 是否重复、是否已反馈、是否进入恢复链路；业务副作用幂等不归 bus。 |
| 幂等 / 一致性 | transport semantic 必须独立于具体 MQ 后端，不能随后端切换发生需求语义漂移。 | 同一上层 delivery 语义在默认后端和后续 adapter 中保持一致；后端差异只在 adapter 边界内表达。 |
| 可观测性 | operator 必须能判断 bus backlog、retry backlog、DLQ material、failed delivery summary 和 backend health。 | 需求层至少要求存在可读取的运行状态面；具体指标名、日志字段和仪表盘不在本步定义。 |
| 可观测性 | SDK、observability、governance 必须能消费只读 transport view、tap / audit material 和 failure material。 | 只读输出能够说明来源、范围和只读性质，不反写 bus truth。 |
```

---

## 7. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否在需求层写死吞吐、延迟、容量数值 | 写入初始数字 | 需求层只写可判断口径，后续测试方案给出基准值 | 推荐 B。原因是当前后端、部署规模和订阅拓扑未定，提前写数字容易形成虚假需求 |
| Q-002 | 是否把监控指标名和日志字段写进非功能需求 | 写具体字段 | 只写可观测状态和异常类别 | 推荐 B。原因是指标字段属于设计 / 测试阶段，不属于需求层质量底线 |

当前建议：接受上述推荐后进入 Step 14。

---

## 8. 进入下一步条件

- 已按性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类逐项检查。
- 每项非功能要求都有判断口径或目标值。
- 没有把 MQ 后端、监控平台、数据库优化、重试算法或认证实现写成需求。
- 已明确哪些要求当前不适合量化，以及后续应由测试方案补充基准值。
