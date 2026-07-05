# Step 4. 代码主体框架映射

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 4
> 回填章节: `02-概要设计.md` §4 代码主体框架总览
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

把 `01-架构设计.md` 中已收稳的核心 / 支撑上下文、运行单元、依赖约束和一致性机制,转译为后续 `03-详细设计.md` 可以继续展开的代码主体框架。

本步要解决的不是“具体代码放在哪个目录”,而是先稳定两类主语:

- 哪些是 `L1-artifact` 在概要设计层必须固定的代码主体骨架。
- 哪些只是实现分层名,用于安放这些主体,而不是业务主要组成部分本身。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `design-calibration/02_hld_step_02_goals_scope.md` | 已完成 | 提供本轮概要设计的结构目标和设计深度口径 |
| `design-calibration/02_hld_step_03_constraints.md` | 已完成 | 提供 truth ownership、派生只读、路径分离和层次边界约束 |
| `projects/L1-artifact/01-架构设计.md` §6~11 | 当前正式架构基线 | 提供 bounded context、运行单元、依赖方向、一致性策略和技术机制 |
| `projects/L1-artifact/00-需求文档.md` | 当前正式需求基线 | 提供五条核心能力闭环和外围增强非前置口径 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 | 约束 Step 4 必须产出两张 ASCII 图和关键判断 |
| `standards/document/概要设计书写规范.md` | 已读取 | 约束正式 §4 的图、表和关键判断格式 |

---

## 3. SOP 问题回答

### 3.1 架构层已经收稳的模块,分别应落到哪些代码主体骨架上?

当前架构模块到代码主体骨架的映射应按以下口径承接:

- `制品事实核心 / 版本核心 / 血缘核心 / 基线核心`
  - 落到 `Artifact Truth Domain Core`
  - 由 `Truth Write Services` 和 `Truth Read / Consumption Services` 编排进入或读出
  - 通过 `Truth Persistence Ports` 保持正式 truth 持久化边界

- `制品输入收束上下文 / 责任审查语境 / 自动化产出边界`
  - 落到 `Artifact Sync Entry`、`Artifact Async Intake`
  - 由 `Intake / Review Boundary Services` 承接人工、自动化、治理或过程语境输入
  - 通过 `Reference / Snapshot / Body Source Ports` 获取外部语境线索,但不接管外部正文

- `制品消费表达上下文`
  - 落到 `Truth Read / Consumption Services`
  - 由 `Consumable / Audit Backref Policies` 保证消费回指和审计可解释
  - 通过 `Read Surface / Reference Views` 向下游提供安全读取面

- `派生读侧与维护上下文`
  - 落到 `Artifact Operations Jobs` 和 `Derived Maintenance Services`
  - 由 `Projection / Preview / Report Read Models` 承接只读派生
  - 通过 `Derived Persistence / Handoff Preparation Ports` 保持可重建、可延迟的派生承载

- `本地索引 / 投影 / 引用层`
  - 落到 `Reference Views`、`Snapshot Views`、`Cross-context Reference Ports`
  - 它们只提供稳定引用、快照和交接入口,不拥有核心 truth

### 3.2 哪些主体属于 Inbound / Operations,哪些属于 Application Services?

当前应按如下口径区分:

- `Inbound / Operations`
  - `Artifact Sync Entry`
  - `Artifact Async Intake`
  - `Artifact Operations Jobs`

- `Application Services`
  - `Truth Write Services`
  - `Truth Read / Consumption Services`
  - `Intake / Review Boundary Services`
  - `Derived Maintenance Services`

这些主体负责“如何承接请求、事件和维护触发,以及如何编排核心语义”,但它们本身不是最终的 business truth owner。

### 3.3 哪些主体属于 Domain Model,哪些属于 Ports / Persistence / Projection / Handoff?

当前应按如下口径区分:

- `Domain Model`
  - `Artifact Truth Domain Core`
  - `Fact / Version / Lineage / Baseline Truth Policies`
  - `Consumable / Audit Backref Policies`

- `Ports / Persistence / Projection / Handoff`
  - `Truth Persistence Ports`
  - `Reference / Snapshot / Body Source Ports`
  - `Projection / Preview / Report Read Models`
  - `Derived Persistence / Handoff Preparation Ports`
  - `Event / Audit / Handoff Relay Ports`

Domain Model 负责“什么是正式 Artifact truth 以及 truth 如何演化”; Ports / Persistence / Projection / Handoff 负责“这些语义如何被承载、读取、派生和交接”。

### 3.4 哪些名称必须在概要设计层先点名,否则详细设计会重新发明主语?

本步必须先固定以下代码主体名:

- `Artifact Sync Entry`
- `Artifact Async Intake`
- `Artifact Operations Jobs`
- `Truth Write Services`
- `Truth Read / Consumption Services`
- `Intake / Review Boundary Services`
- `Derived Maintenance Services`
- `Artifact Truth Domain Core`
- `Truth Persistence Ports`
- `Reference / Snapshot / Body Source Ports`
- `Projection / Preview / Report Read Models`
- `Derived Persistence / Handoff Preparation Ports`
- `Event / Audit / Handoff Relay Ports`

这些名称不是最终的详细设计接口签名,但它们决定了后续 03 不需要重新发明“谁承接同步入口、谁拥有 truth、谁只做派生、谁只做交接”。

### 3.5 哪些内容已经是代码目录、文件路径或框架实现,不应在本步展开?

本步不应展开以下内容:

- crate / module / file tree
- handler / service / repo 的具体文件路径
- trait / struct / enum 的完整定义
- HTTP / RPC / Event / Job 的具体协议名、path、topic 或 schema
- 数据库表、索引、消息产品、对象存储和 hash 方案
- outbox / relay / rebuild / projection 的具体实现策略

---

## 4. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 直接拿 bounded context 名称当代码层名 | 容易把“制品事实核心 / 制品版本核心”误写成 crate 或目录,同时丢掉入口和分层骨架 | 当前先把架构模块映射为代码主体,再单独说明实现分层 |
| 直接把 `api / service / repo / model` 当主要组成部分 | 容易把技术层名误当业务主语,后续 Step 5 会失去稳定的业务组成部分判断 | 当前明确“业务主语”和“实现分层”是两条不同轴 |
| 直接把 `Artifact 同步入口 / 异步输入 / 后台维护` 当最终业务组成部分 | 容易把运行承载方式误当业务结构,导致 truth 主线被入口形态定义 | 当前只把它们固定为 Inbound / Operations 主体,不提升为最终业务组成部分 |
| 直接把 search / report / archive handoff 写成核心框架中心 | 容易让派生和交接反向塑造核心 truth | 当前只把它们放入派生 / handoff 代码主体,不允许成为 truth owner |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 架构到代码的转译 | 需要读者自行从架构上下文图推断代码主语 | 明确给出代码主体骨架和实现分层视图 |
| 业务主语与技术层次 | 容易混成一套名字 | 明确拆成“业务主要组成部分候选”与“实现分层”两条轴 |
| 入口 / truth / 派生 / 交接边界 | 容易在后续步骤混写 | 明确不同主体落位和只读 / 强一致 / 延迟语义 |
| 详细设计准备度 | 03 容易重新发明 service、domain、port 主语 | 先固定详细设计必须承接的代码主体骨架 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接按架构上下文名展开代码主体 | 承接架构最直接 | 容易把上下文名误写成技术层名或目录结构 | 不采用 |
| 方案 B: 直接按 `Inbound / Application / Domain / Ports` 展开整章 | 技术分层清晰 | 会丢失 Artifact truth、消费表达、派生维护等业务主语 | 不采用 |
| 方案 C: 采用“业务主语候选 + 实现分层”双轴映射 | 能同时保护业务边界和代码安放方式 | 需要额外解释两轴不能混用 | 采用 |
| 方案 D: 直接把同步 / 异步 / 后台三类运行单元当最终组成部分 | 运行视角直观 | 会把承载方式误当业务结构中心 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 架构模块到代码主体映射表

| 架构模块 / 运行单元 | 代码主体骨架 | 所在实现分层 | 当前说明 |
|---|---|---|---|
| 制品事实核心 / 版本核心 / 血缘核心 / 基线核心 | `Artifact Truth Domain Core` | `Domain Model` | 是本仓正式 truth 语义中心 |
| 制品输入收束 / 责任审查 / 自动化产出边界 | `Artifact Sync Entry`;`Artifact Async Intake`;`Intake / Review Boundary Services` | `Inbound / Operations`;`Application Services` | 负责承接输入和边界解释,不拥有外部正文 |
| 制品消费表达上下文 | `Truth Read / Consumption Services`;`Consumable / Audit Backref Policies` | `Application Services`;`Domain Model` | 负责稳定读取和可回指消费,不迁移 ownership |
| 派生读侧与维护上下文 | `Artifact Operations Jobs`;`Derived Maintenance Services`;`Projection / Preview / Report Read Models` | `Inbound / Operations`;`Application Services`;`Projection` | 负责只读派生、重建和交接准备,不反写真相 |
| 本地索引 / 投影 / 引用层 | `Reference Views`;`Snapshot Views`;`Cross-context Reference Ports` | `Projection`;`Ports / Persistence` | 提供稳定引用与快照入口,不拥有 truth |
| Artifact 真相存储承载 | `Truth Persistence Ports` | `Ports / Persistence` | 承接 fact / version / lineage / baseline / backref 的正式持久化边界 |
| Artifact 派生消费承载 | `Derived Persistence / Handoff Preparation Ports` | `Ports / Persistence`;`Projection / Handoff` | 承接只读派生、预览、报告和交接准备结果 |
| Artifact 事件协作 / 追溯交接边界 | `Event / Audit / Handoff Relay Ports` | `Ports / Handoff` | 承接变化传播、追溯和交接,但不拥有下游 truth |
| 外部正文 / 内容来源边界 | `Reference / Snapshot / Body Source Ports` | `Ports / Boundary Integration` | 只提供引用、摘要和完整性线索,不把外部生命周期带入本仓 |

#### 架构模块到代码主体映射图

```text
L1-artifact
|
|- 1. Truth-centered code subjects
|  |- Artifact Sync Entry
|  |- Truth Write Services
|  |- Truth Read / Consumption Services
|  |- Artifact Truth Domain Core
|  `- Truth Persistence Ports
|
|- 2. Intake and boundary code subjects
|  |- Artifact Async Intake
|  |- Intake / Review Boundary Services
|  |- Reference / Snapshot Views
|  `- Reference / Snapshot / Body Source Ports
|
|- 3. Derived and handoff code subjects
|  |- Artifact Operations Jobs
|  |- Derived Maintenance Services
|  |- Projection / Preview / Report Read Models
|  `- Derived Persistence / Handoff Preparation Ports
|
`- 4. Collaboration and traceability code subjects
   |- Consumable / Audit Backref Policies
   |- Cross-context Reference Ports
   `- Event / Audit / Handoff Relay Ports
```

关键说明：
- 这张图表达“架构模块如何落到代码主体骨架”,不表达目录、文件路径或 crate 边界。
- `Artifact Truth Domain Core` 是正式 truth 主线的中心,其余主体只能围绕它承接、读取、派生或交接。
- `Artifact Sync Entry`、`Artifact Async Intake` 和 `Artifact Operations Jobs` 只表示入口 / 运维触发形态,不是最终业务主要组成部分名称。
- `Projection / Preview / Report Read Models` 与 `Derived Persistence / Handoff Preparation Ports` 明确属于只读派生和交接语义,不能反写核心 truth。

#### 实现分层视图

```text
External calls / external events / maintenance triggers
                        |
                        v
+--------------------------------------------------+
| Inbound / Operations                             |
| - Artifact Sync Entry                            |
| - Artifact Async Intake                          |
| - Artifact Operations Jobs                       |
+--------------------------+-----------------------+
                           |
                           v
+--------------------------------------------------+
| Application Services                             |
| - Truth Write Services                           |
| - Truth Read / Consumption Services              |
| - Intake / Review Boundary Services              |
| - Derived Maintenance Services                   |
+--------------------------+-----------------------+
                           |
                           v
+--------------------------------------------------+
| Domain Model                                     |
| - Artifact Truth Domain Core                     |
| - Fact / Version / Lineage / Baseline Policies   |
| - Consumable / Audit Backref Policies            |
+--------------------------+-----------------------+
                           |
                           v
+--------------------------------------------------+
| Ports / Persistence / Projection / Handoff       |
| - Truth Persistence Ports                        |
| - Reference / Snapshot / Body Source Ports       |
| - Projection / Preview / Report Read Models      |
| - Derived Persistence / Handoff Preparation      |
| - Event / Audit / Handoff Relay Ports            |
+--------------------------------------------------+
```

关键说明：
- 这张图说明“外部调用、外部事件和运维任务如何进入实现分层”,不表达业务组成部分的正式总表。
- `Application Services` 负责编排真相写入、消费读取、边界解释和派生维护,但不替代 `Domain Model` 成为 truth owner。
- `Ports / Persistence / Projection / Handoff` 是承载和协作层,只负责持久化、派生、引用和交接,不能决定业务状态含义。
- 业务主要组成部分会在 Step 5 正式收口,但它们都必须在这套实现分层里垂直落位。

### 7.2 业务主要组成部分与实现分层关系说明

| 项 | 说明 |
|---|---|
| 业务主要组成部分候选 | 当前先识别为 `truth 主线`、`输入收束与审查边界`、`消费表达与审计回指`、`派生维护与交接准备`、`本地引用 / 快照支持` 五类候选业务主语;正式总表在 Step 5 收口 |
| 实现分层 | `Inbound / Operations`、`Application Services`、`Domain Model`、`Ports / Persistence / Projection / Handoff` 是代码组织层,用来安放和连接业务主语 |
| 关系 | 业务主要组成部分说明“系统在业务上由哪些稳定部分构成”;实现分层说明“这些部分分别通过什么层次承接入口、编排语义、持久化 truth 和提供派生 / 交接能力” |
| 当前边界 | Step 4 先固定代码主体骨架,不把候选业务主语直接写成目录结构,也不把实现分层直接写成 Step 5 的正式组成部分 |

### 7.3 关键判断

#### 7.3.1 业务主语和实现分层不能混用

- `truth 主线`、`输入收束与审查边界`、`消费表达与审计回指`、`派生维护与交接准备` 这类名称是业务主要组成部分候选。
- `Inbound / Operations`、`Application Services`、`Domain Model`、`Ports / Persistence / Projection / Handoff` 是实现分层。
- 前者回答“做什么”,后者回答“代码如何安放这些主语”;若混用,Step 5 会退化成 `api/service/repo/model` 技术分层表。

#### 7.3.2 运行单元不是最终业务组成部分

- `Artifact Sync Entry`、`Artifact Async Intake`、`Artifact Operations Jobs` 必须先固定,因为 03 需要知道入口和运维触发面。
- 但这些名称只回答“从哪里进来”,不回答“业务上由哪些主要组成部分构成”。
- 因此它们在 Step 4 进入代码主体框架,但不直接替代 Step 5 的正式组成部分总表。

#### 7.3.3 只读派生与交接必须在框架层提前降级

- `Projection / Preview / Report Read Models`、`Derived Persistence / Handoff Preparation Ports`、`Event / Audit / Handoff Relay Ports` 必须在 Step 4 就被明确标记为派生 / 交接主体。
- 这样 Step 6~9 才不会把 report、preview、archive handoff 或 observability explain 误写成核心 truth owner。

---

## 8. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §4.1 可承接本文件 §7.1 的映射表和 `架构模块到代码主体映射图`。
- §4.2 可承接本文件的 `实现分层视图`。
- §4.3 可承接本文件 §7.2 的“业务主要组成部分与实现分层关系说明”。
- §4.4 可承接本文件 §7.3 的关键判断。
- 本文件 §3 的问题回答、§4 的诊断和 §6 的设计取舍留在 `design-calibration`,不直接进入正式正文。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Step 4 是否直接产出正式业务组成部分总表 | A. 是;B. 否,先固定代码主体骨架,正式总表交给 Step 5 | B | 否则会把实现分层和业务主语提前混写 | 已确认采用 B |
| `Artifact Sync Entry / Async Intake / Operations Jobs` 是否就是最终业务主语 | A. 是;B. 否,它们只是入口 / 运维形态 | B | 它们回答承载方式,不回答业务结构 | 已确认采用 B |
| 派生 / handoff 代码主体是否应提前降级为只读 / 交接角色 | A. 否;B. 是 | B | 若不先降级,后续很容易抢占 truth 主线 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步没有新增阻塞 Step 5 的待确认事项。下一步可进入“主要组成部分、职责与边界”。

---

## 10. 进入下一步条件

- 已明确架构模块如何映射为代码主体骨架。
- 已明确业务主要组成部分候选与实现分层的关系。
- 已明确哪些名称属于入口 / 运维形态,哪些名称属于 domain truth center,哪些只属于派生 / handoff 主体。
- 没有提前下沉到目录、文件路径、完整 trait / struct、协议 schema 或存储实现。
- 可以进入 Step 5 “主要组成部分、职责与边界”。
