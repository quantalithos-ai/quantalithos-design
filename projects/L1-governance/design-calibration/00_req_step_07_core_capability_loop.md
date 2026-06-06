# Step 7. 核心能力闭环

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 7
> 回填章节: `00-需求文档.md` §7 核心能力闭环
> 生成日期: 2026-06-06

---

## 1. 本步目标

从 `L1-governance` 作为治理决策与治理控制真相仓的存在必要性出发,收敛本仓成立所需的核心能力骨架。本步不从旧功能清单、接口、事件、字段、状态机、阶段优先级或实现方案出发,只回答“哪些能力缺一个,Governance 就不再是完整治理事实域”。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 Governance 是治理决策与治理控制真相仓,不是 process / work / artifact / conversation / runtime / observability truth |
| `design-calibration/00_req_step_04_goals_non_goals.md` | Step 4 已完成 | 固定目标为治理事实边界、Gate / Approval / Decision、Policy、Control / AIIA / SoA、Nonconformity 和相邻仓协作边界 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定闭环强前置和相邻仓协作范围 |
| 旧 `projects/L1-governance/00-需求文档.md` §5~§6 | 旧用例和功能清单 | 提取 Gate、Policy、Control、AIIA、SoA、Nonconformity 等能力线索,重新分层 |
| `domain/governance/README.md` | 旧治理域详细设计 | 提取六类治理事实和不变量线索,不继承字段、状态机、RPC 或事件名 |

---

## 3. SOP 问题回答

### 3.1 如果没有这个仓,系统会缺什么不可替代的能力或结构？

如果没有 `L1-governance`,平台会缺少一处统一回答“关键决策由谁定、依据什么治理策略、哪些控制适用、影响评估和适用性声明是否成立、不符合如何纠正”的治理事实来源。相邻仓会把治理裁决、策略约束、合规结论和纠正闭环分别散落到流程等待、工作状态、产物正文、对话显化、runtime cache、能力白名单或审计日志中。

因此本仓不可替代的能力不是“审批接口”或“策略下发”本身,而是让治理语境、正式裁决、策略 / 控制约束、合规 / 纠正结论和跨仓消费追溯共同成立。

### 3.2 这个仓成立必须共同具备哪些能力？

`L1-governance` 的核心能力必须同时覆盖五件事:

1. 治理语境与适用对象能够被确定。
2. 关键节点治理裁决能够形成正式结论。
3. 治理策略与控制适用约束能够成立。
4. 影响评估、适用性声明与不符合纠正能够形成治理闭环。
5. 治理事实能够被相邻仓消费并被持续追溯。

这些能力共同成立后,Governance 才既不是审批 UI,也不是 runtime 策略缓存、artifact 合规正文、observability 审计存储或外部 GRC 工具。

### 3.3 哪些能力缺一个,这个仓就不算真正成立？

| 能力 | 缺失后果 |
|---|---|
| 治理语境与适用对象确定 | Gate、Policy、Control、AIIA、SoA 和 Nonconformity 没有稳定 scope、actor 和相邻事实锚点 |
| 关键节点治理裁决形成 | process / work / artifact 等关键路径无法获得正式治理 decision,相邻仓会各自补决策 |
| 治理策略与控制适用约束成立 | runtime、capability-hub、work、process 等消费方无法稳定理解当前有效治理约束 |
| 合规 / 纠正治理闭环成立 | AIIA、SoA、Control 和 Nonconformity 会退化为 artifact 正文、audit note 或普通工作项 |
| 可消费可追溯成立 | 治理事实无法稳定显化、执行、审计、归档或复盘,并会被下游视图反向解释 |

### 3.4 哪些能力只是外围增强,而不是闭环核心？

| 外围增强能力 | 为什么不是闭环核心 |
|---|---|
| Policy DSL 选型和高级规则表达 | 是策略表达方式,不是 Policy truth 成立的最小条件 |
| Gate kind 扩展机制和复杂评审编排 | 重要,但属于裁决能力的扩展形态 |
| AIIA 自动草拟、自动重评和管理评审自动化 | 可提升效率,但不能替代正式治理结论 |
| 外部 GRC / 法律系统集成 | 是外部生态增强,不是平台内部治理事实成立条件 |
| 高级管理后台、看板和审计报表 | 是消费和展示增强,不是 Governance truth 本身 |
| 大规模容量、冷热归档和性能优化 | 属于非功能、归档和实施阶段 |

### 3.5 哪些能力根本不属于这个仓？

| 边界外能力 | 归属原因 |
|---|---|
| ProcessInstance、Activity、waiting gate state 和恢复真相 | 属于 `L1-process` |
| Project、WorkItem、Iteration、blocker 和 dependency truth | 属于 `L1-work` |
| Artifact、Evidence、Baseline、AIIA / SoA 文档正文和版本血缘 | 属于 `L1-artifact` |
| Conversation space、Gate 显化 Turn、review display 和可见性 | 属于 `L1-conversation` 或产品入口 |
| GlobalMember、Actor、Role 生命周期和认证授权 | 属于 `L1-identity` 或授权边界 |
| AIPolicyDef、method、role、template 和标准方法定义正文 | 属于 `L3-method-library` |
| policy cache、autonomy enforcement、tool loop 和执行事实 | 属于 `L2-runtime` / `L2-member-service` |
| capability registration、tool adapter 和工具调用结果 | 属于 `L3-capability-hub` |
| audit log store、metrics、trace storage 和 alert stream | 属于 `L4-observability` |
| workspace / console UI 状态和外部 GRC 套件 | 属于产品层或外部系统 |

### 3.6 当前已有或预期功能中,哪些是在支撑这些核心能力？

| 旧功能 / 能力线索 | 支撑的核心能力节点 | 处理口径 |
|---|---|---|
| Gate / Approval / Decision | 关键节点治理裁决形成 | 后续 Step 9 功能需求和 Step 10 规则展开 |
| Policy、shared rules、autonomy | 治理策略与控制适用约束成立 | 后续 Step 9 / Step 10 / Step 12 展开 |
| Control | 治理策略与控制适用约束成立;合规闭环 | 后续功能、规则和验收中展开 |
| AIIA / SoA | 合规治理结论闭环 | 正文归 artifact,治理只保留结论和引用 |
| Nonconformity / corrective loop | 合规 / 纠正治理闭环 | 不写成普通 work blocker 或 observability alert |
| Gate / Policy 对相邻仓消费 | 可消费可追溯成立 | 后续 Step 12 接口与依赖和 Step 14 验收展开 |
| Policy DSL、P95、容量、自动化草拟 | 外围增强或非功能 | 后移 Step 13 / Step 14 / 后续设计 |

---

## 4. 核心能力闭环结论

### 4.1 闭环定义

`L1-governance` 的核心能力闭环是:治理语境与适用对象必须先被确定;在该语境下,关键节点治理裁决能够形成正式结论;正式裁决与治理策略共同支撑策略生效和控制适用;控制、影响评估、适用性声明和不符合纠正形成持续治理闭环;最终这些治理事实必须能被相邻仓消费并被追溯。只要其中任何一环缺失,Governance 就会退化成审批页面、策略缓存、合规文档副本、审计流水或外部 GRC 适配层。

### 4.2 核心能力闭环图

```text
治理语境与适用对象能够被确定
  -> 关键节点治理裁决能够形成正式结论
  -> 治理策略与控制适用约束能够成立
  -> 影响评估、适用性声明与不符合纠正能够形成治理闭环
  -> 治理事实能够被相邻仓消费并被持续追溯
```

图示说明:

- 本图只表达核心能力成立的逻辑依赖关系。
- 本图不表达运行时调用顺序、接口时序、事件传播顺序或开发实施步骤。
- 图中节点只写能力成立描述,不写接口名、事件名、对象字段、数据库动作或实现组件名。

### 4.3 能力层级划分表

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | 治理语境与适用对象确定;关键节点治理裁决;治理策略与控制适用;AIIA / SoA / Nonconformity 治理闭环;治理事实消费与追溯 |
| 外围增强能力 | Policy DSL 高级表达;Gate kind 扩展;复杂评审编排;AIIA 自动草拟 / 重评;管理评审自动化;外部 GRC 集成;高级报表;容量和性能优化 |
| 边界外能力 | process waiting state;work 项目事实;artifact / evidence 正文;conversation 显化和可见性;identity 成员生命周期;method definition;runtime 执行;capability registry;observability 存储;workspace / console UI 状态 |

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` §5 | 用 Raise / Decide Gate、Policy 查询、SoA 查看、Nonconformity 自动创建等故事直接表达核心 | 用户故事和功能候选不能替代核心能力闭环 | Step 7 先定义能力闭环,Step 8 再写故事 |
| 旧 `00-需求文档.md` §6 | 功能清单按 Gate、Approval、Policy、Control、AIIA、SoA、Nonconformity 展开 | 功能列表不是能力成立结构 | 只作为功能回填线索 |
| 旧 `00-需求文档.md` §7 / §11 | P95、Policy 下发时延、SoA 38 控制项和覆盖率直接强化核心感 | 非功能和验收指标不等于闭环核心 | 后移 Step 13 / Step 14 |
| 旧 `01-架构设计.md` | 组件、聚合、下发、订阅和同步链路被用来解释核心 | 架构组件和协作链路不是需求能力闭环 | 本步只保留能力成立关系 |
| `domain/governance/README.md` | 详细字段、状态机、RPC、事件名和不变量丰富 | 可作线索,但不能直接进入 Step 7 | 后续 Step 9~Step 12 / 03 详细设计再裁剪 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 把旧 F-001~F-014 功能清单当作核心闭环 | 覆盖面广,迁移快 | 功能、规则、接口、非功能和验收混在一起 | 不采用 |
| 方案 B: 以治理事实成立链定义闭环 | 对齐仓存在必要性,能同时覆盖决策和控制 | 后续仍需 Step 8 / Step 9 展开故事和功能 | 采用 |
| 方案 C: 只把 Gate 裁决作为核心闭环 | 简洁,突出关键决策 | 会漏掉 Policy、Control、AIIA、SoA 和 Nonconformity 的治理控制事实 | 不采用 |
| 方案 D: 以 Policy 下发和 runtime enforcement 定义闭环 | 能体现执行约束 | 会让 runtime 执行 truth 反向压过 Governance truth | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 Gate 六段式写入核心闭环图？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成独立图节点 | 会把具体 Gate 规则提前写入 Step 7 |
| 方案 B | 放入“关键节点治理裁决”能力下,后移 Step 10 / Step 14 展开 | 能保留裁决能力,不提前写规则 |

推荐方案 B。原因是 Gate 六段式属于重要规则和验收方向,不适合作为闭环图节点。

#### 是否把 SoA 38 控制项写入核心闭环图？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成独立节点 | 会把具体标准覆盖验收提前写入 Step 7 |
| 方案 B | 放入“合规治理闭环”能力下,后移 Step 10 / Step 14 | 保持闭环图能力层级干净 |

推荐方案 B。原因是 38 控制项覆盖是规则 / 验收,不是能力闭环图的独立节点。

#### 是否把 Policy 下发到 runtime 写成核心节点？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 单独列为核心节点 | 会把消费链路和执行层缓存写成 Governance 核心 |
| 方案 B | 放入“治理事实被相邻仓消费”节点 | 保留协作价值,不让执行 truth 反向定义 governance |

推荐方案 B。原因是 runtime 消费 Policy,但 Policy truth 属于 Governance。

---

## 7. 结构化中间产物

### 7.1 仓存在必要性结论

`L1-governance` 不可替代的能力是统一治理决策与治理控制事实。没有它,关键裁决、策略生效、控制适用、影响评估、适用性声明和不符合纠正会散落在 process waiting state、work lifecycle、artifact 正文、conversation 显化、runtime cache、capability whitelist 和 observability audit 中,平台无法稳定回答“谁批准了什么、依据什么治理约束、哪些控制适用、治理结论如何被消费和追溯”。

### 7.2 核心能力闭环结论

| 节点 | 能力成立描述 |
|---|---|
| C-GOV-1 | 治理语境与适用对象能够被确定 |
| C-GOV-2 | 关键节点治理裁决能够形成正式结论 |
| C-GOV-3 | 治理策略与控制适用约束能够成立 |
| C-GOV-4 | 影响评估、适用性声明与不符合纠正能够形成治理闭环 |
| C-GOV-5 | 治理事实能够被相邻仓消费并被持续追溯 |

### 7.3 外围增强能力结论

| 能力 | 处理口径 |
|---|---|
| Policy DSL 高级表达 | 后移功能、接口和详细设计裁剪 |
| Gate kind 扩展 / 复杂评审编排 | 后移功能、规则和验收 |
| AIIA 自动草拟 / 自动重评 | 后续增强,不得替代正式治理结论 |
| 管理评审自动化和外部 GRC 集成 | 后续产品 / 集成增强 |
| 高级审计报表、容量、性能和冷热归档 | 后移非功能、测试、验收和实施计划 |

### 7.4 边界外能力结论

| 能力 | 归属 |
|---|---|
| waiting gate / ProcessInstance / Activity | `L1-process` |
| Project / WorkItem / Iteration truth | `L1-work` |
| Artifact / Evidence / AIIA / SoA 正文 | `L1-artifact` |
| Gate 显化、review display 和对话可见性 | `L1-conversation` |
| GlobalMember / actor / role lifecycle | `L1-identity` |
| AIPolicyDef / method / template 定义正文 | `L3-method-library` |
| runtime enforcement / tool loop / policy cache 命中 | `L2-runtime` / `L2-member-service` |
| capability registration / tool adapter | `L3-capability-hub` |
| audit storage / metrics / alert stream | `L4-observability` |
| UI state / external GRC suite | `L1-workspace`、`L5-console` 或外部系统 |

### 7.5 功能回填映射结论

| 旧功能 / 能力线索 | 映射节点 | 后续处理 |
|---|---|---|
| Gate / Approval / Decision | C-GOV-2 | Step 8 用户故事、Step 9 功能需求、Step 10 规则、Step 14 验收 |
| Policy / shared rules / autonomy | C-GOV-3 | Step 9 功能需求、Step 10 规则、Step 12 接口与依赖 |
| Control | C-GOV-3 / C-GOV-4 | Step 9 功能需求、Step 10 规则、Step 14 验收 |
| AIIA / SoA | C-GOV-4 | Step 9 功能需求、Step 11 数据归属、Step 14 验收 |
| Nonconformity | C-GOV-4 | Step 9 功能需求、Step 10 规则、Step 14 验收 |
| Gate / Policy 对 process / work / runtime / conversation 消费 | C-GOV-5 | Step 12 接口与依赖、Step 14 验收 |
| P95、Policy 下发时延、容量和覆盖率 | 外围增强 / 非功能 | Step 13 / Step 14 再评估 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §7。

````md
## 7. 核心能力闭环

> 校准来源:
> - `design-calibration/00_req_step_07_core_capability_loop.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“核心能力闭环结论”“能力层级划分表”和“功能回填映射结论”小节,了解本章如何从仓存在必要性而不是旧功能清单中收敛核心闭环。

`L1-governance` 的核心能力闭环是:治理语境与适用对象必须先被确定;在该语境下,关键节点治理裁决能够形成正式结论;正式裁决与治理策略共同支撑策略生效和控制适用;控制、影响评估、适用性声明和不符合纠正形成持续治理闭环;最终这些治理事实必须能被相邻仓消费并被追溯。只要其中任何一环缺失,Governance 就会退化成审批页面、策略缓存、合规文档副本、审计流水或外部 GRC 适配层。

```text
治理语境与适用对象能够被确定
  -> 关键节点治理裁决能够形成正式结论
  -> 治理策略与控制适用约束能够成立
  -> 影响评估、适用性声明与不符合纠正能够形成治理闭环
  -> 治理事实能够被相邻仓消费并被持续追溯
```

本图只表达能力成立的逻辑依赖关系,不表达运行时调用顺序、接口时序、事件传播顺序、开发实施步骤或对象字段。

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | 治理语境与适用对象确定;关键节点治理裁决;治理策略与控制适用;AIIA / SoA / Nonconformity 治理闭环;治理事实消费与追溯 |
| 外围增强能力 | Policy DSL 高级表达;Gate kind 扩展;复杂评审编排;AIIA 自动草拟 / 重评;管理评审自动化;外部 GRC 集成;高级报表;容量和性能优化 |
| 边界外能力 | process waiting state;work 项目事实;artifact / evidence 正文;conversation 显化和可见性;identity 成员生命周期;method definition;runtime 执行;capability registry;observability 存储;workspace / console UI 状态 |
````

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把 Gate 六段式写入核心闭环图 | 写成独立节点 | 放入关键节点治理裁决,后移规则 / 验收 | 推荐 B。原因是六段式是规则和验收方向 |
| Q-002 | 是否把 SoA 38 控制项写入核心闭环图 | 写成独立节点 | 放入合规治理闭环,后移规则 / 验收 | 推荐 B。原因是控制项覆盖是规则和验收方向 |
| Q-003 | 是否把 Policy 下发到 runtime 写成核心节点 | 写成独立节点 | 放入治理事实被相邻仓消费 | 推荐 B。原因是 runtime 消费 Policy,但不拥有 Policy truth |
| Q-004 | 是否只以 Gate 作为 Governance 核心 | 是 | 否,同时覆盖治理决策与治理控制 | 推荐 B。原因是 Step 2 / Step 4 已确认 governance 同时拥有决策和控制 truth |

当前建议:接受上述推荐后进入 Step 8。

---

## 10. 进入下一步条件

- 已说明 `L1-governance` 的不可替代能力是统一治理决策与治理控制事实。
- 已定义 1 条由 5 个能力节点组成的核心能力闭环。
- 已区分核心能力、外围增强能力和边界外能力。
- 已把旧功能线索映射到能力层级,但未写接口、事件、DTO、数据结构、状态机或实现步骤。
