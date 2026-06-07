# Step 4. 系统边界与上下文

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 4
> 回填章节: `01-架构设计.md` §5 系统边界与上下文
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

说明 `L1-governance` 在全局系统中的位置,明确它有哪些正式上下文对象、输入面、输出面以及外部边界。本步只表达正式上下文关系和输入 / 输出方向,不展开内部职责划分、限界上下文、容器部署、数据所有权、接口 schema、DTO、route、事件名或实现层依赖方向。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_01_requirement_baseline.md` | Step 1 已完成 | 承接需求基线、上下文边界和旧架构残留诊断 |
| `design-calibration/01_arch_step_02_goals_constraints.md` | Step 2 已完成 | 承接架构目标、不可变约束、取舍和非目标 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 3 已完成 | 承接做 / 不做 / 易混淆职责和边界红线 |
| `projects/L1-governance/00-需求文档.md` §6 / §12 / §13 / §14 | 已重建 | 承接依赖裁剪、能力级接口、外部依赖、非功能和验收边界 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已完成 | 提供全局依赖基线和单仓裁剪口径 |
| 旧 `projects/L1-governance/01-架构设计.md` | 旧 Draft | 仅作为旧系统上下文、旧技术设施和旧外部 GRC 假设诊断来源 |

---

## 3. SOP 问题回答

### 3.1 这个仓在全局系统中的位置是什么?

`L1-governance` 位于 L1 领域服务层,是治理决策与治理控制事实真相仓。它上承 `L0-core` 的共享契约和 `L0-bus` 的事件协作基础,从 identity、method-library、process、work、artifact、conversation、runtime、capability 和 observability 等上下文对象接收身份、定义、业务语境、执行反馈和观测摘要输入,并向 SDK、workspace、console、process、work、artifact、conversation、runtime、capability、observability 和 archive 等消费方提供治理事实、授权边界、裁决结论、控制适用、合规结论、纠正闭环和追溯材料。

### 3.2 它有哪些正式上游?

| 上游对象 | 上游性质 |
|---|---|
| `L0-core` | 共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 基线来源 |
| `L0-bus` | 事件协作主干和外部变化输入来源 |
| `L1-identity` | actor、member、role 和责任语境来源 |
| `L3-method-library` | AIPolicyDef、Control definition、method、template 和标准定义来源 |
| `L1-process` | process waiting、Activity 和恢复语境来源 |
| `L1-work` | project、work、iteration、dependency、blocker 和风险语境来源 |
| `L1-artifact` | artifact、evidence、baseline、AIIA / SoA 正文引用和合规材料来源 |
| `L1-conversation` | conversation context、Gate / review 显化回链和对话上下文来源 |
| `L2-runtime` / `L2-member-service` | runtime execution、policy cache feedback、autonomy 边界和执行风险线索来源 |
| `L3-capability-hub` | capability、tool 和 provider 使用反馈线索来源 |
| `L4-observability` | alert、audit summary、trace summary 和观测风险线索来源 |

### 3.3 它有哪些正式下游?

| 下游对象 | 下游性质 |
|---|---|
| `L0-sdk` | 上层产品和外部调用方的 governance 能力接入封装 |
| `L0-bus` | 治理事实变化的跨仓传播主干 |
| `L1-process` | process waiting / resume / stop 等路径消费治理裁决结论 |
| `L1-work` | project / work / iteration 等路径消费 Policy、Gate 和 Control 结论 |
| `L1-artifact` | AIIA / SoA、evidence、baseline 和合规材料消费治理批准结论 |
| `L1-conversation` | Gate 卡片、review display 和治理事实显化消费方 |
| `L2-runtime` / `L2-member-service` | automation boundary、Policy 适用和工具使用治理结论消费方 |
| `L3-capability-hub` | capability 使用约束和工具治理授权消费方 |
| `L1-workspace` / `L5-console` | 治理管理入口、只读治理事实和高级看板消费方 |
| `L4-observability` | governance traceability、审计材料和边界异常消费方 |
| `L4-archive` | 治理事实、合规材料、引用来源和归档 / 恢复切片消费方 |

### 3.4 它从外部接收哪些输入面?

| 输入面 | 说明 |
|---|---|
| 共享契约输入 | 跨仓 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 基线 |
| 事件协作输入 | 外部能力级变化、风险信号、消费状态和对账线索 |
| 身份与责任语境输入 | actor、member、role、可承担性和责任语境摘要 |
| 定义来源输入 | AIPolicyDef、Control definition、method、template、标准定义和 safe summary |
| 过程与工作语境输入 | process waiting / Activity 摘要、project / work / iteration / blocker / dependency 摘要 |
| 产物与证据引用输入 | artifact、evidence、baseline、AIIA / SoA 正文引用和摘要 |
| 对话与显化回链输入 | conversation context、Gate 显化回链、review display 回链和 trace / handoff 引用 |
| 运行与能力反馈输入 | runtime feedback、policy cache feedback、capability / tool 使用线索和自动化风险信号 |
| 观测风险输入 | alert summary、audit summary、trace summary 和边界异常线索 |

### 3.5 它向外部提供哪些输出面?

| 输出面 | 说明 |
|---|---|
| 治理语境输出 | actor、scope、适用对象、治理目的和责任语境的可消费治理事实 |
| 关键节点裁决输出 | Gate / Decision、Approval、vote、authorization responsibility 和正式结论 |
| Policy / shared rules 输出 | Policy effective fact、scope、priority、conflict、replacement 和不可覆盖组织级硬约束 |
| Control 输出 | Control applicability、implementation、review、violation 和 remediation 关联 |
| AIIA / SoA 输出 | 影响评估、适用性声明、控制覆盖、适用 / 排除和批准结论 |
| Nonconformity 输出 | 不符合、原因、纠正、复验、关闭和责任语境 |
| 治理事实查询与追溯输出 | 稳定读取、引用、追溯、报告、对账和消费解释材料 |
| 治理事实变化输出 | Gate、Approval、Policy、Control、AIIA / SoA、Nonconformity 等关键变化输出 |
| 归档 / 恢复交接输出 | 治理事实、合规材料、引用来源和可恢复交接材料 |

### 3.6 哪些外部系统或相邻仓构成正式上下文边界?

正式上下文边界包括:

| 边界类别 | 对象 |
|---|---|
| 基础平台边界 | `L0-core`;`L0-bus`;`L0-sdk` |
| L1 相邻真相域边界 | `L1-identity`;`L1-process`;`L1-work`;`L1-artifact`;`L1-conversation`;`L1-workspace` |
| 定义来源边界 | `L3-method-library` |
| L2 / L3 运行与能力边界 | `L2-runtime`;`L2-member-service`;`L3-capability-hub` |
| 产品入口边界 | `L5-console` |
| L4 追溯 / 归档边界 | `L4-observability`;`L4-archive` |

PostgreSQL、audit store、Policy engine、report system、external GRC 和 object storage 当前不作为 Step 4 正式上下文对象;它们属于后续容器、技术选型、配置、外部集成或实施阶段的候选运行设施 / 外围增强。

### 3.7 依赖失效时,本仓的降级口径是什么?

| 失效对象 | 降级口径 |
|---|---|
| `L0-core` | 不可自行降级;共享契约缺失时不能补造正式引用或错误语义。 |
| `L0-bus` | 事件传播和消费可挂起或延迟;不得通过改写治理事实补偿总线缺失。 |
| `L1-identity` | actor / member / role 暂不可解析时,保留 unresolved 或 pending 语境;不得补造成员生命周期或角色结论。 |
| `L3-method-library` | AIPolicyDef / Control definition 暂不可解析时,新生效或复核路径应挂起或标记 unresolved;不得复制定义正文。 |
| `L1-process` / `L1-work` | process / work 语境暂不可解析时,相关 Gate、Policy 或 Control 适用判断应挂起或退回待补语境;不得自造相邻仓 truth。 |
| `L1-artifact` | artifact / evidence / AIIA / SoA 正文引用暂不可解析时,评审或批准路径应挂起或标记证据未闭合;不得保存正文副本。 |
| `L1-conversation` | 显化或对话回链不可用时,Governance truth 不受影响;只影响对话展示和协作入口。 |
| `L2-runtime` / `L2-member-service` / `L3-capability-hub` | 运行反馈或能力反馈不可用时,不得由 cache / tool result 反向定义 Policy truth;自动化边界可进入保守或待确认状态。 |
| `L4-observability` / `L4-archive` | 观测或归档消费不可用时,本仓保留治理追溯事实和交接材料,不接管物理日志或归档包正文。 |
| `L0-sdk` / `L1-workspace` / `L5-console` | 下游入口或视图不可用时,只影响消费体验;不得改变 Governance truth。 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` | 把 PostgreSQL、audit store、外部 GRC、Policy engine、report system 等候选技术 / 外部系统混入上下文 | Step 4 应表达正式仓级上下文,不定技术设施 | 后移到容器、技术选型、配置和演进章节 |
| 旧 `01-架构设计.md` | Gate、Policy、Control、AIIA、SoA、Nonconformity 与对象细节混写 | 系统上下文图不应展开内部对象或 DTO | 本步只画仓 / 系统 / 能力对象 |
| 新版需求 §6 / §12 | 依赖和输入 / 输出面完整但对象较多 | 单图逐个展开会超过系统上下文图对象数量建议 | 图中聚合关键上下文组,表中完整列出 |
| 旧外部 GRC 口径 | 容易被误写为当前核心上下文和 truth 来源 | 新版需求已将外部 GRC 降为外围增强 | 本步不把 external GRC 画入主图 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 图对象 | 旧技术设施、外部 GRC、实现候选和治理对象草案混杂 | 只保留正式仓 / 能力对象,消费和追溯对象用收缩节点表达 | 对齐架构规范 4.5 |
| 上下文关系 | 旧依赖和职责说明混写 | 明确输入 / 输出面、关系方向和关系类型 | 便于后续交互与通信方式展开 |
| 外部 GRC | 容易成为正式上下文 | 作为外围增强和导出消费对象,不进入主图 | 防止外部系统反向定义 Governance truth |
| 降级口径 | 偏技术 SLA 或运行设施 | 按真相边界和依赖失效处理 | 防止外部不可用时自造治理事实 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 上下文图逐个画出所有相邻仓 | 信息完整 | 图超过 7 个对象,可读性差 | 不采用 |
| 方案 B: 图中聚合关键对象组,表中展开每个对象 | 图清晰,表完整 | 图中需要解释收缩节点 | 采用 |
| 方案 C: 沿用旧图并局部补对象 | 修改少 | 旧技术设施、外部 GRC 和对象草案残留 | 不采用 |
| 方案 D: 把 Policy engine / audit store / report system 画入上下文图 | 贴近旧实现设想 | 越过容器和技术选型步骤 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 external GRC 画入系统上下文图?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 画入主图作为正式外部系统 | 会把外围增强误读为当前核心依赖,甚至被当作 truth 来源 |
| 方案 B | 不画入主图,保留为后续导出 / 下游消费增强 | 对齐需求和 Step 2 取舍 |

推荐方案 B。

#### 是否在图里逐个展开所有上下文仓?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 逐个展开 `L1-process`、`L1-work`、`L1-artifact`、`L1-conversation`、`L2-runtime` 等所有对象 | 图过载,不符合关键对象数量建议 |
| 方案 B | 主图按职责收缩关键对象组,表格完整列出 | 兼顾系统位置感和完整上下文清单 |

推荐方案 B。

#### 是否把 Policy engine / audit store 写成正式上下文对象?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成上下文对象 | 会提前进入技术选型和部署设施 |
| 方案 B | 后移到容器、技术选型、配置或实施阶段 | 保持 Step 4 只表达仓级上下文 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 系统上下文图

```text
----------------------+     +----------------------+     +----------------------+
| L1-identity         |     | L0-core / L0-bus     |     | L3-method-library    |
| actor and role refs |     | shared event base    |     | policy/control defs  |
+----------+-----------+     +----------+-----------+     +----------+-----------+
           |                            |                            |
           | 输入                       | 输入 / 依赖                | 输入
           v                            v                            v
       +---+-------------------------------------------------------------------+---+
       |                           L1-governance                               |
       |              governance decision and control fact truth                |
       +---+----------------------------+----------------------------+----------+
           ^                            ^                            |
           | 输入 / 输出                | 输入 / 输出                | 输出
+----------+-----------+     +----------+-----------+     +----------+-----------+
| L1-process / work   |     | L1-artifact /       |     | SDK / workspace /   |
| business contexts   |     | method evidence     |     | console consumers   |
+----------+-----------+     +----------+-----------+     +----------+-----------+
           ^                            ^                            |
           | 输入 / 输出                | 输入 / 输出                | 输出
+----------+-----------+     +----------+-----------+     +----------+-----------+
| conversation /      |     | runtime / capability|     | observability /     |
| review display      |     | feedback contexts   |     | archive handoff     |
+----------------------+     +----------------------+     +----------------------+
```

该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向，不表达接口、事件、实现组件或运行时顺序。

图示说明:

- `L1-governance` 位于中心,表示它是治理决策与治理控制事实真相仓。
- `L0-core` / `L0-bus` 是共享契约和事件协作基础,不是业务治理事实来源。
- `L1-identity`、`L3-method-library`、`L1-process`、`L1-work`、`L1-artifact`、conversation、runtime 和 capability 等对象只通过正式上下文边界提供引用、摘要、定义或反馈。
- `SDK`、workspace、console、observability 和 archive 是消费或交接方向,不得反向定义 Governance truth。

### 7.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 | 共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、evidence 基线 | Governance 依赖统一引用和追溯口径,不得重新定义 L0 契约。 |
| `L0-bus` | 输入 / 输出 | 来源 / 消费 | 事件协作主干、治理事实变化传播和外部变化输入 | Bus 不拥有 Governance truth,但承载跨仓感知和协作。 |
| `L1-identity` | 输入 | 来源 | actor、member、role、可承担性和责任语境 | Governance 只消费身份引用和摘要,不拥有成员生命周期。 |
| `L3-method-library` | 输入 | 来源 | AIPolicyDef、Control definition、method、template、标准定义和 safe summary | Governance 形成生效事实和适用事实,不保存定义正文。 |
| `L1-process` | 输入 / 输出 | 来源 / 消费 | process waiting / Activity 语境和治理裁决结论 | Process 提供等待语境并消费正式 decision。 |
| `L1-work` | 输入 / 输出 | 来源 / 消费 | project / work / iteration / dependency / blocker 语境和治理约束结论 | Work 提供业务对象语境并消费 Policy / Gate / Control 结论。 |
| `L1-artifact` | 输入 / 输出 | 来源 / 消费 | artifact / evidence / baseline / AIIA / SoA 正文引用和批准结论 | Artifact 拥有正文,Governance 拥有治理结论和引用。 |
| `L1-conversation` | 输入 / 输出 | 来源 / 消费 | conversation context、Gate / review display 回链和治理事实显化输入 | Conversation 显化治理事实,但不拥有 Decision truth。 |
| `L2-runtime` / `L2-member-service` | 输入 / 输出 | 来源 / 消费 | runtime feedback、policy cache feedback、autonomy 边界和 Policy 适用结论 | Runtime 消费治理约束并提供反馈线索,不得反向定义 Policy truth。 |
| `L3-capability-hub` | 输入 / 输出 | 来源 / 消费 | capability / tool 使用反馈和工具治理授权 | Capability-hub 消费能力使用约束,但不拥有 Policy truth。 |
| `L4-observability` | 输入 / 输出 | 来源 / 消费 | alert summary、audit summary、trace summary、治理追溯材料 | Observability 拥有物理观测存储,Governance 拥有治理追溯事实。 |
| `L0-sdk` | 输出 | 入口 | governance client / integration access | SDK 封装治理能力给上层产品和外部调用方消费。 |
| `L1-workspace` / `L5-console` | 输出 | 消费 / 入口 | 只读治理事实、管理入口、高级看板和显化材料 | 产品入口消费 Governance facts,不拥有业务治理结论。 |
| `L4-archive` | 输出 | 消费 | 治理事实、合规材料、引用来源和归档 / 恢复切片 | Archive 消费交接材料,不反向改变 Governance truth。 |

### 7.3 依赖失效降级口径

| 对象 | 失效情况 | 架构口径 |
|---|---|---|
| `L0-core` | 共享契约、引用或 trace 口径不稳定 | 不新增正式契约语义,不得自行补造共享类型。 |
| `L0-bus` | 事件协作主干不可用 | 已形成 Governance truth 不得丢失;变化输出、跨仓协作和消费通知可挂起或延迟。 |
| `L1-identity` | actor / member / role 暂不可解析 | 相关裁决、责任或授权路径进入 unresolved / pending;不得补造身份真相。 |
| `L3-method-library` | AIPolicyDef / Control definition 暂不可解析 | 新 Policy 生效、Control 适用或复核路径挂起或标记定义未闭合;不得复制定义正文。 |
| `L1-process` / `L1-work` | process / work 语境暂不可解析 | 相关 Gate、Policy 或 Control 判断应挂起、降级为待补语境或显式失败;不得自造外部 truth。 |
| `L1-artifact` | evidence、baseline、AIIA / SoA 正文引用暂不可解析 | 评审、批准或适用性判断应挂起或标记证据未闭合;不得保存正文副本。 |
| `L1-conversation` | 显化或对话回链不可用 | Governance truth 不受影响;只影响对话展示和协作入口。 |
| `L2-runtime` / `L2-member-service` / `L3-capability-hub` | 运行或能力反馈不可用 | Policy truth 不由 cache / tool result 补造;自动化治理边界进入保守或待确认状态。 |
| `L4-observability` / `L4-archive` | 观测或归档消费不可用 | 本仓保留治理追溯事实和交接材料,不接管物理日志或归档包正文。 |
| `L0-sdk` / `L1-workspace` / `L5-console` | 下游入口或视图不可用 | 只影响消费体验和管理入口,不得改变 Governance truth。 |

### 7.4 边界说明结论

`L1-governance` 的系统上下文围绕“共享底座、身份语境、定义来源、业务语境、证据来源、运行反馈、产品消费和追溯交接”展开。进入主图的对象都是会影响治理语境、正式裁决、Policy / Control、生效事实、合规结论、纠正闭环或追溯消费的正式上下文对象;用户角色、内部对象、接口名、事件名、DTO 和候选技术设施不进入本章。`L1-process`、`L1-work`、`L1-artifact`、`L1-conversation`、`L2-runtime`、`L3-capability-hub` 和 `L4-observability` 只通过引用、摘要、反馈、事件协作或消费边界参与,不把相邻仓正文或 truth 转移给 Governance。`L0-sdk`、`L1-workspace`、`L5-console` 和 `L4-archive` 可以消费 Governance facts 或交接材料,但不得反向定义本仓业务治理事实。

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论。

```md
## 5. 系统边界与上下文

> 校准来源:
> - `design-calibration/01_arch_step_04_system_context.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“系统上下文图”“上下游与输入 / 输出面表”和“边界说明”小节,了解本章如何把职责边界放入全局系统关系中。

正式章节应摘录:

- `design-calibration/01_arch_step_04_system_context.md` §7.1 系统上下文图。
- `design-calibration/01_arch_step_04_system_context.md` §7.2 上下游与输入 / 输出面表。
- `design-calibration/01_arch_step_04_system_context.md` §7.4 边界说明结论。
```

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 系统上下文图是否逐个展开所有相邻仓 | A. 逐个展开;B. 在图中聚合、表中展开;C. 只保留 L0 / workspace | B | Step 4 需要控制图对象数量,同时不能丢失 process、work、artifact、runtime、capability、archive 等边界 | 已确认采用 B |
| 是否把 external GRC 画入系统上下文图 | A. 画入;B. 不画入主图,作为外围增强 / 下游导出 | B | external GRC 当前不是 Governance truth 来源,也不是核心闭环前置 | 已确认采用 B |
| 是否把 Policy engine / audit store / report system 画入系统上下文图 | A. 画入;B. 后移技术选型 / 配置 / 实施 | B | 这些是候选运行设施或实现机制,不是 Step 4 仓级上下文对象 | 已确认采用 B |
| 是否在 Step 4 图中写接口名、事件名或协议名 | A. 写;B. 不写 | B | 架构 SOP 明确 Step 4 不表达接口协议、事件名、DTO 或实现组件 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 5 的待确认事项。具体子域划分、容器部署、依赖方向、数据所有权、通信方式和技术选型留到后续 Step 独立收敛。

---

## 10. 进入下一步条件

- 已明确 `L1-governance` 在全局系统中的位置。
- 已画出只含正式对象的系统上下文图,且图中未出现角色、文档来源对象、接口名、事件名或内部模块。
- 已明确上游、下游、输入面、输出面和依赖失效口径。
- 未提前展开内部子域、容器部署、数据所有权或接口协议。

结论:可以进入 Step 5 `限界上下文与子域划分`。
