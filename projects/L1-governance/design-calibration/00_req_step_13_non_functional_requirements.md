# Step 13. 非功能需求

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 13
> 回填章节: `00-需求文档.md` §13 非功能需求
> 生成日期: 2026-06-06

---

## 1. 本步目标

把 `L1-governance` 在需求层必须满足的质量约束写清楚,并给出可判断、可验证的口径。本步不写具体监控平台配置、数据库优化、索引、缓存策略、Policy DSL 引擎、重试算法、SLO 仪表盘、审计物理存储、权限实现细节或详细测试方案。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-GOV-1~C-GOV-5 核心能力闭环 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 固定 Governance truth、相邻仓边界、治理约束和审计约束 |
| `design-calibration/00_req_step_11_data_ownership.md` | Step 11 已完成 | 固定真相 / 快照 / 引用 / 禁止正文边界 |
| `design-calibration/00_req_step_12_interfaces_dependencies.md` | Step 12 已完成 | 固定能力级接口和依赖裁剪边界 |
| 旧 `projects/L1-governance/00-需求文档.md` §7 | 旧版非功能需求 | 提取 RaiseGate、DecideGate、GetApplicablePolicies、Policy 下发、SLA、audit coverage 等线索,但不直接作为已验证硬指标 |
| 旧 `projects/L1-governance/02-概要设计.md` §11 | 旧版横切关注点 | 提取安全、性能、可用性、可观测性和审计线索 |

---

## 3. SOP 问题回答

### 3.1 这个仓必须满足哪些性能要求?

性能要求集中在治理裁决与治理控制事实不能成为关键路径的不可解释瓶颈,同时不能为了速度把相邻仓正文、runtime cache 或外部 GRC 正文拉进 Governance:

| 性能关注点 | 判断口径 |
|---|---|
| 治理语境形成 | 建立或调整治理语境不应成为关键治理路径的主链瓶颈。 |
| 关键节点裁决 | 关键节点提出、评审和形成正式结论不应因消费视图、报表或外部展示而阻塞。 |
| Policy / Control 适用判断 | Policy 生效、授权约束和 Control 适用判断不应被高级 DSL、模拟评估或报表阻断。 |
| AIIA / SoA / Nonconformity 治理结论 | 合规评审和纠正闭环不应因正文复制、外部 GRC 同步或高级报表而阻塞正式结论。 |
| 治理事实消费 | 基础治理查询和追溯不应被高级看板、趋势分析或归档准备阻断。 |

旧文档中的 `RaiseGate P95 < 150ms`、`DecideGate P95 < 200ms`、`GetApplicablePolicies P95 < 50ms`、`Policy 下发生效 < 30s`、`SLA >= 99.95%` 当前只能作为后续架构 / 测试阶段的候选目标或容量假设,不在需求 Step 13 直接定为已验证硬指标。

### 3.2 这个仓必须满足哪些可用性要求?

| 可用性关注点 | 判断口径 |
|---|---|
| 核心闭环可用 | 外围增强能力失效时,治理语境、正式裁决、Policy / Control、AIIA / SoA / Nonconformity 和消费追溯仍应成立。 |
| 外部依赖降级 | identity、process、work、artifact、method-library、runtime、capability-hub、conversation、observability 等输入延迟时,不得篡改 Governance truth。 |
| 裁决等待可解释 | 必要输入、决策责任或评审材料未到位时,治理事实应保持可解释等待或失败,不得伪造结论。 |
| 消费输出降级 | 事件输出、报表、归档准备或高级看板延迟时,不得反向修改业务治理结论。 |
| 策略消费降级 | runtime / capability-hub 消费 Policy 延迟或失败时,不得把 cache 命中状态反写成 Policy truth。 |

### 3.3 这个仓必须满足哪些安全要求?

| 安全关注点 | 判断口径 |
|---|---|
| 正文边界 | Governance 不得保存 process、work、artifact、conversation、identity、method-library、runtime、capability-hub、observability、workspace、console 或外部 GRC 正文。 |
| 授权边界 | 治理变更和查询必须遵守 actor、scope、责任语境、可见性和正式授权边界。 |
| 高影响裁决 | 高影响 Gate、自动裁决、默认超时裁决和风险接受不得绕过正式 Policy、shared rules、Control 或决策责任。 |
| shared rules | shared rules 或等价组织级硬约束不得被 project、role、member 或低层 scope 覆盖。 |
| 执行边界 | runtime cache、tool execution、capability whitelist 和 agent loop 不得定义或修改 Governance truth。 |

### 3.4 这个仓必须满足哪些审计 / 可追溯要求?

| 审计 / 可追溯关注点 | 判断口径 |
|---|---|
| 治理语境 | actor、scope、适用对象、治理目的和责任语境必须可追溯。 |
| 关键节点裁决 | 触发、请求、候选、证据、决策责任、结论和后续纠正必须可解释。 |
| Policy / Control | Policy 生效、优先级、冲突处理、shared rules、Control 适用、复核和违反必须可追溯。 |
| AIIA / SoA | 治理评审、适用性、控制覆盖、批准和正文引用必须可回链到 artifact / evidence。 |
| Nonconformity | 不符合来源、原因、纠正、复验、关闭和责任语境必须可追溯。 |
| 消费与维护 | 治理事实发布、查询、报告、对账、归档准备和恢复材料必须能说明来源、范围和结果。 |

### 3.5 这个仓必须满足哪些幂等 / 一致性要求?

| 幂等 / 一致性关注点 | 判断口径 |
|---|---|
| 单一正式语义 | Gate / Decision、Approval、Policy、Control、AIIA / SoA 和 Nonconformity 不得在相邻仓出现第二真相。 |
| 重复治理输入 | 重复提交同一正式治理变化不得产生重复治理事实或分叉结论。 |
| 裁决不可原地改写 | 正式裁决形成后不得原地改写;纠正或改变必须形成新的可追溯治理事实。 |
| 消费一致性 | process、work、artifact、conversation、runtime、capability-hub、workspace、console、archive 等消费方应看到同一 Governance truth 语义。 |
| 快照 / 投影一致性 | 外部快照、read model、报告和事件输出可滞后,但必须能解释来源、滞后和失效状态。 |

### 3.6 这个仓必须满足哪些可观测性要求?

| 可观测性关注点 | 判断口径 |
|---|---|
| 核心变化可观察 | 治理语境、Gate / Decision、Approval、Policy、Control、AIIA / SoA、Nonconformity 的关键变化必须能被平台观察。 |
| 边界异常可观察 | 外部正文进入 Governance、runtime cache 反写 Policy、低 scope 覆盖 shared rules、维护面改写 truth 等异常必须可发现。 |
| 依赖延迟可观察 | identity、process、work、artifact、method-library、runtime、capability-hub、conversation、observability 等输入延迟或缺失必须可识别。 |
| 消费状态可观察 | 事件输出、下游消费、报告、对账、归档准备和追溯材料状态必须可判断。 |

### 3.7 哪些要求能量化,哪些只能给出判断口径?

| 类型 | 当前口径 |
|---|---|
| 可候选量化 | Gate 提出 / 裁决路径、Policy / Control 适用查询路径、治理事实基础查询、事件输出延迟、报告 / 对账完成时间、归档准备耗时 |
| 当前只给判断口径 | 正文边界、安全越界、shared rules 不可覆盖、正式裁决不可原地改写、治理事实消费一致、外部快照不成真相 |
| 不在本步定死 | 旧 `150ms / 200ms / 50ms / 30s / 99.95%` 指标,后续测试与容量阶段验证后再决定是否成为正式目标 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` §7.1 | 直接写 RaiseGate、DecideGate、GetApplicablePolicies、Policy 下发、SLA 和 audit coverage 量化目标 | 缺当前稳定来源,容易伪量化 | 作为候选目标 / 容量假设,不直接定死 |
| 旧 `00-需求文档.md` §7.2 | 用 ISO / NIST / SOX / 9001 等合规标准表达要求 | 合规方向有价值,但容易变成标准正文复制或外部 GRC 需求 | 转译为控制覆盖、治理结论、审计追溯和正文边界 |
| 旧 `02-概要设计.md` §11 | 安全、性能、可用性、可观测性线索明确 | 可用,但部分表达偏概要 / 实现 | 转译为需求层判断口径 |
| 旧 `06-验收标准.md` §5 | 决策链留痕率、可回放率、无 drift、非授权拦截率写为验收门禁 | 有价值,但属于 Step 14 验收表达 | 本步提取为审计、追溯、一致性和安全判断口径 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 性能目标 | 直接使用旧 P95、Policy 下发和 SLA 数字 | 写成主链不阻塞 + 候选量化目标 | 避免没有验证来源的硬指标 |
| 可用性 | 以 SLA 和下游降级表达 | 核心闭环可用 + 外部输入延迟不造真相 + 消费输出不反写 | 更贴合 Governance truth 仓边界 |
| 安全 | 分散在授权、shared rules、Policy 和标准要求中 | 明确正文边界、授权边界、高影响裁决、shared rules 和执行边界 | 承接 Step 10 / Step 11 |
| 可追溯 | audit trail 覆盖率 | 具体到治理语境、裁决、Policy / Control、AIIA / SoA、Nonconformity、消费维护 | 更能支撑验收 |
| 一致性 | 多下游无 drift | 单一 Governance truth + 重复输入不分叉 + 消费一致 + 滞后可解释 | 防止相邻仓第二真相 |
| 可观测性 | 审计链和告警 | 增加边界异常、依赖延迟、消费状态和维护状态可观察 | 适合后续测试 / 验收 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 原样保留旧 P95 / SLA / 下发数字 | 看起来可量化 | 当前缺稳定来源,会误导验收和实现 | 不采用 |
| 方案 B: 写判断口径,旧指标作为候选目标 | 保留量化线索,同时避免伪量化 | 后续测试阶段还要验证具体值 | 采用 |
| 方案 C: 只写六类口号 | 简短 | 不可验收 | 不采用 |
| 方案 D: 写监控字段、SLO 仪表盘、DB 审计和缓存策略 | 接近落地 | 超出需求层 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把旧 P95 / SLA 数字定为正式需求?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 直接定为正式需求 | 可能形成无来源硬指标 |
| 方案 B | 作为后续架构 / 测试阶段候选目标 | 保留性能方向,避免伪量化 |

推荐方案 B。原因是当前没有真实测量或稳定上游基线。

#### 是否把 `audit_trail append-only 覆盖率 100%` 写成本步硬指标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 原样写成 DB / event 级覆盖指标 | 会提前固定审计物理存储和验证机制 |
| 方案 B | 写成关键治理变化必须可追溯,物理审计实现后移 | 保留审计目标,不提前写实现 |

推荐方案 B。原因是 observability 物理存储不归 Governance。

#### 外部依赖失效时是否要求 Governance 完全可用?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 完全可用 | 不现实,外部引用和责任语境会影响特定判断 |
| 方案 B | 核心 truth 不被篡改,受影响能力等待或降级 | 更符合 Step 12 依赖边界 |

推荐方案 B。原因是外部输入延迟时,Governance 应保持真相不被污染,而不是伪装所有能力可用。

---

## 7. 结构化中间产物

### 7.1 非功能类别结论

| 非功能类别 | 适用性 | 说明 |
|---|---|---|
| 性能 | 适用 | Governance 是关键裁决和策略控制事实主链,不应成为协作瓶颈 |
| 可用性 | 适用 | 核心闭环能力必须和外围增强、下游消费、外部同步降级分开 |
| 安全 | 强适用 | Governance 承载高影响裁决、shared rules、Policy、Control 和风险接受 |
| 审计 / 可追溯 | 强适用 | 治理结论必须回答谁批准、依据什么、影响什么、如何被消费 |
| 幂等 / 一致性 | 强适用 | 多下游消费同一 Governance truth,重复输入和纠正必须不分叉 |
| 可观测性 | 适用 | 关键变化、边界异常、依赖延迟和消费状态需要可发现 |

### 7.2 非功能要求结论

| 非功能类别 | 要求 | 判断口径 / 目标值 |
|---|---|---|
| 性能 | 治理语境形成和关键节点裁决不应成为治理主链瓶颈。 | 后续架构 / 测试阶段可验证裁决路径延迟;旧 `RaiseGate P95 < 150ms`、`DecideGate P95 < 200ms` 仅作为候选目标。 |
| 性能 | Policy / Control 适用判断不应被高级 DSL、模拟评估、报表或外部同步阻断。 | 基础适用判断应独立于外围增强成立;旧 `GetApplicablePolicies P95 < 50ms` 仅作为候选目标。 |
| 性能 | 治理事实基础读取和追溯不应被高级看板、趋势分析或归档准备阻断。 | 基础查询 / 引用能力应独立于高级展示成立。 |
| 可用性 | 外围增强失效时,核心治理闭环仍应成立。 | Policy DSL、复杂 Gate 编排、自动草拟、外部 GRC、高级报表失效不影响 C-GOV-1~C-GOV-5 成立。 |
| 可用性 | 外部输入延迟时,Governance 不得篡改 truth 边界。 | 相邻仓输入缺失时,对应能力可等待、失败或降级,但不得隐式造结论。 |
| 可用性 | 事件输出、报表、归档准备或高级看板延迟时不得反向修改治理业务结论。 | 消费视图和维护结果可滞后,不能成为写源。 |
| 安全 | Governance 不得保存相邻仓正文或执行正文。 | Step 11 禁止正文边界必须成立。 |
| 安全 | 高影响裁决、自动裁决、默认超时裁决和风险接受不得绕过正式授权、Policy、shared rules 或 Control。 | 未满足治理约束时不能形成正式放行或接受风险结论。 |
| 安全 | shared rules 或组织级硬约束不得被低层 scope 覆盖。 | project、role、member 或低层 Policy 冲突时不能覆盖组织级硬约束。 |
| 审计 / 可追溯 | 治理语境、正式裁决、审批责任、Policy / Control、AIIA / SoA 和 Nonconformity 关键变化必须可追溯。 | 能说明 actor、scope、适用对象、依据、责任、结论和后续纠正。 |
| 审计 / 可追溯 | AIIA / SoA 和 Control 结论必须可回链到 artifact / evidence 或 method definition 引用。 | Governance 只保存结论和引用,不保存正文。 |
| 审计 / 可追溯 | 治理事实消费、报告、对账和归档准备必须能说明来源、范围和结果。 | 维护 / 消费面不得静默改变业务治理结论。 |
| 幂等 / 一致性 | 同一正式治理变化不得因重复输入产生重复事实或分叉结论。 | 重复输入只能得到同一业务结果或被识别为冲突。 |
| 幂等 / 一致性 | 正式裁决形成后不得原地改写。 | 纠正或改变必须形成新的可追溯治理事实。 |
| 幂等 / 一致性 | 多下游消费同一 Governance truth 语义。 | process、work、artifact、conversation、runtime、capability-hub 等不得各自解释出不同治理结论。 |
| 可观测性 | 核心治理事实变化必须能被平台稳定观察。 | governance context、Gate / Decision、Approval、Policy、Control、AIIA / SoA、Nonconformity 变化有可观察记录。 |
| 可观测性 | 边界越界尝试和外部依赖延迟必须可发现。 | 外部正文入仓、runtime cache 反写、低 scope 覆盖 shared rules、相邻输入缺失等异常可识别。 |
| 可观测性 | 治理事实消费和维护状态必须可观察。 | 事件输出、下游消费、报告、对账、归档准备和追溯材料状态可判断。 |

### 7.3 判断口径 / 目标值结论

| 类别 | 当前口径 |
|---|---|
| 正式目标 | 核心闭环不因外围增强失效而整体不可用;Governance 不保存相邻仓正文;关键变化可追溯;重复输入不产生重复事实;正式裁决不可原地改写;shared rules 不被低 scope 覆盖;多下游消费同一 Governance truth |
| 候选目标 | `RaiseGate P95 < 150ms`;`DecideGate P95 < 200ms`;`GetApplicablePolicies P95 < 50ms`;`Policy 下发生效 < 30s`;`SLA >= 99.95%` |
| 待后续验证 | 裁决路径延迟、Policy / Control 查询延迟、事件输出延迟、下游消费滞后窗口、报告 / 对账完成时长、归档准备耗时 |

### 7.4 非功能与功能 / 规则映射结论

| 非功能类别 | 支撑的功能 / 规则 |
|---|---|
| 性能 | FR-GOV-001~FR-GOV-010;避免裁决、Policy / Control 判断、基础查询和追溯成为主链瓶颈 |
| 可用性 | FR-GOV-001~FR-GOV-010;BR-GOV-011;BR-GOV-020;Step 12 外部依赖边界 |
| 安全 | BR-GOV-012~BR-GOV-019;BR-GOV-028~BR-GOV-038;Step 11 禁止保存正文 |
| 审计 / 可追溯 | BR-GOV-039;BR-GOV-040;FR-GOV-009;FR-GOV-010 |
| 幂等 / 一致性 | BR-GOV-001~BR-GOV-011;BR-GOV-021~BR-GOV-027;Step 11 真相 / 快照 / 引用生命周期 |
| 可观测性 | BR-GOV-039;BR-GOV-040;Step 12 事件输出和维护能力 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §13。正式文档可摘录本文件 §7.1~§7.4 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 13. 非功能需求

> 校准来源:
> - `design-calibration/00_req_step_13_non_functional_requirements.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“非功能与功能 / 规则映射结论”小节,了解本章如何从核心闭环、规则、数据归属和接口依赖收敛质量要求。

本文采用 `design-calibration/00_req_step_13_non_functional_requirements.md` §7 的非功能需求结论。非功能要求按性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类展开。旧 `150ms / 200ms / 50ms / 30s / 99.95%` 指标仅作为后续架构和测试阶段的候选目标,不在需求层直接定为已验证硬指标。

正式非功能需求表应摘录:

- `design-calibration/00_req_step_13_non_functional_requirements.md` §7.1 非功能类别结论。
- `design-calibration/00_req_step_13_non_functional_requirements.md` §7.2 非功能要求结论。
- `design-calibration/00_req_step_13_non_functional_requirements.md` §7.3 判断口径 / 目标值结论。
- `design-calibration/00_req_step_13_non_functional_requirements.md` §7.4 非功能与功能 / 规则映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把旧 P95 / SLA 数字定为正式需求 | 是 | 作为候选目标,后续验证 | 推荐 B。原因是当前缺稳定测量来源 |
| Q-002 | 是否把 `audit_trail append-only 覆盖率 100%` 写成本步硬指标 | 写成 DB / event 级覆盖指标 | 写关键治理变化必须可追溯,审计实现后移 | 推荐 B。原因是本步不写审计物理实现 |
| Q-003 | 外部依赖失效时是否要求 Governance 完全可用 | 完全可用 | 核心 truth 不被篡改,受影响能力等待或降级 | 推荐 B。原因是外部输入会影响特定判断 |
| Q-004 | 是否把监控字段 / SLO 仪表盘写入需求 | 写入 | 后移测试 / 运维 / 详细设计 | 推荐 B。原因是本步只写判断口径 |

当前建议:接受上述推荐后进入 Step 14。

---

## 10. 进入下一步条件

- 已按性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类检查适用性。
- 每项非功能要求都有判断口径或候选目标处理方式。
- 已明确旧 P95、Policy 下发、SLA 和 audit coverage 指标不是当前需求层硬指标。
- 已说明非功能要求与功能 / 规则 / 数据 / 依赖边界的映射。
- 未写监控配置、数据库优化、缓存策略、Policy DSL 引擎、审计物理存储、SLO 仪表盘或测试执行步骤。
