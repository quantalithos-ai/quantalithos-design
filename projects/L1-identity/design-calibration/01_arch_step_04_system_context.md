# Step 4. 系统边界与上下文

> 对应正式章节: `01-架构设计.md` §5
> 本步状态: 已完成
> 前序依赖: Step 3 已完成
> 当前结论: `L1-identity` 位于 L1 领域服务层,中心职责是平台级 AI 员工身份真相仓;它只把 `L0-core` 作为编译期基础契约上下文,通过 `L0-bus` 形成事件协作边界,从 method-library / work / governance / memory-archive 等上下文接收来源或依据,向 work / process / conversation / governance / workspace / runtime / SDK / 产品层等消费者提供身份事实消费边界。

---

## 1. Step 状态 + Step 内计划

- 本步目标: 定义 `L1-identity` 与上游、下游、外部来源和横切支撑之间的正式上下文边界。
- 复杂度判断: 本步需要 ASCII 系统上下文图;图只表达边界对象和关系类型,不写 API、事件名、DTO、内部模块、容器、部署或接口协议。
- 图对象收缩: 主图控制为 7 个关键上下文对象;更细的消费者放入表中解释,不让主图膨胀。
- 停审要求: 本步完成后停留审核;已按用户“同意”进入 Step 5。

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 Step 3、需求使用方与依赖 | 本步输入表 | 已完成 |
| 回答系统上下文问题 | SOP 问题回答表 | 已完成 |
| 诊断旧上下文图混层 | 当前材料 / 旧文档问题诊断表 | 已完成 |
| 记录上下文裁剪取舍 | 设计取舍表 | 已完成 |
| 输出上下文图、输入输出面和边界说明 | 结构化中间产物 | 已完成 |
| 判断是否拆上下游附录 | 复杂度判断 | 已完成 |
| 形成正式 §5 回填草稿 | 回填草稿 | 已完成 |
| 停下等待用户审核 | 进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_01_requirement_baseline.md` | 提供唯一需求基线、硬约束和后移事项 |
| `01_arch_step_02_goals_constraints.md` | 提供架构目标、约束和非目标 |
| `01_arch_step_03_responsibility_boundary.md` | 提供做 / 不做、易混职责和边界红线 |
| `00-需求文档.md` §6 | 提供使用方与依赖、依赖裁剪图和降级原则 |
| `00-需求文档.md` §12 | 提供能力接口边界和依赖边界编号 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 提供 `L1-identity` 只允许 `L0-core` 作为编译期依赖候选的规则 |
| `architecture/仓库拆分方案.md` §4.1 | 提供 `quantalithos-identity` 的 L1 仓定位线索 |
| `架构设计讨论流程_SOP.md` Step 4 | 约束本步只表达系统边界与上下文 |
| `架构设计书写规范.md` §4.5 | 约束上下文图对象、关系类型、图后说明和表格结构 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 这个仓在全局系统中的位置是什么? | `L1-identity` 位于 L1 领域服务层,是平台级 AI 员工身份真相仓;它不属于入口认证、runtime 编排、UI 或外部正文承载层。 |
| 它有哪些正式上游? | `L0-core` 提供基础契约;`L3-method-library` 提供角色 / 能力定义来源;`L1-work` 提供项目参与和 ProjectMember 来源事实;`L1-governance` 提供高风险生命周期依据;memory / archive 承载方提供记忆引用迁移或冷存状态。 |
| 它有哪些正式下游? | `L1-work`、`L1-process`、`L1-conversation`、`L1-governance`、`L1-workspace`、`L2-member-service` / `L2-runtime`、`L0-sdk` / L5 产品层和观测 / 归档能力都可消费身份事实、状态摘要或追溯摘要。 |
| 它从外部接收哪些输入面? | 接收基础 ref / actor / metadata 契约、角色能力来源、项目参与来源、高风险处置依据、memory / archive 引用状态和正式入口系统提交的受控管理意图。 |
| 它向外部提供哪些输出面? | 提供平台级成员身份锚点、可见身份摘要、全局生命周期状态、角色能力摘要、生涯 / memory ref 摘要、身份变化追溯、事件协作和对账报告。 |
| 哪些外部系统或相邻仓构成正式上下文边界? | `L0-core`、`L0-bus`、`L3-method-library`、`L1-work`、`L1-governance`、memory / archive 承载方和 identity consumers group 构成本步主图上下文边界。 |
| 依赖失效时,本仓的降级口径是什么? | C-ID-1 身份锚定和已存在成员读取不应因外围来源不可用而被伪造或隐式创建;角色能力、生涯、memory、高风险处置等依赖来源不可用时应进入 pending / unavailable / degraded / report-only 口径,不得补造外部事实。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 诊断项 | 旧处理风险 | 本步处理 |
|---|---|---|
| 把文档来源画进上下文图 | 产品文档、需求文档或 ADR 被误画成系统上下文对象 | 本步只画运行系统 / 仓 / 外部能力,文档来源留在 Step 1 和追溯矩阵 |
| 把角色画进上下文图 | 平台管理员、审计者、AI 员工自身被误画成系统对象 | 本步只画入口系统或消费边界,角色留在需求用户与角色章节 |
| 把接口名或事件名写进图 | 上下文图滑入 protocol / event schema | 本步图只用输入 / 输出 / 依赖三类关系,不写接口名或事件名 |
| 把全部消费者逐个放进主图 | 图对象过多,上下文关系无法审查 | 主图合并为 identity consumers group,表格列出细分消费者 |
| 把运行期 / 事件协作写成源码依赖 | 违反 `VETO-ID-006` 和全局依赖裁剪 | 本步明确只有 `L0-core` 是编译期基础契约上下文 |
| 把 memory / archive 承载方画成 identity 内部模块 | 外部正文承载边界会被吞入 identity | 本步把它们作为外部能力边界,只允许 ref / handoff 状态进入 |
| 把 governance 画成内部 policy 模块 | 高风险 lifecycle 容易变成 identity 自判 | 本步把 governance 作为外部依据来源,identity 不拥有裁决 truth |

---

## 5. 改动前后对比

| 维度 | 旧处理风险 | 新处理 |
|---|---|---|
| 图对象 | 全量列出角色、文档、API、内部模块和相邻仓 | 只保留正式上下文对象和关键 consumer group |
| 关系类型 | 查询、发布、订阅、RPC、command、event 混写 | 只使用输入 / 输出 / 依赖三类系统上下文关系 |
| 上游来源 | 把 method-library / work / governance 的内部对象作为依赖 | 只表达来源、依据或协作边界,不绑定内部结构 |
| 下游消费 | 每个下游都可能被误写成反向依赖 | 下游统一为身份事实消费者,只能消费不能反写 truth |
| 失效处理 | 来源不可用时补默认摘要或跳过依据 | 来源不可用时 pending / unavailable / degraded / report-only,不得伪造外部事实 |
| 编译期关系 | 运行期协作被写成源码依赖 | 只有 `L0-core` 是编译期基础契约候选 |

---

## 6. 设计取舍

| 方案 / 取舍点 | 采用与否 | 理由 |
|---|---|---|
| 单图列出所有下游仓和产品入口 | 不采用 | 会超过系统上下文图建议对象数量,且容易把消费关系误读为接口协议。 |
| 主图只保留关键上游和 consumer group,表格细分消费者 | 采用 | 能保持图可读,同时让下游关系在表中可审查。 |
| 在图上标注具体事件名 / query 名 / command 名 | 不采用 | Step 4 不定义协议和事件 schema,这些属于后续接口 / 详细设计。 |
| 把 `L0-bus` 放入主图 | 采用 | 它是身份变化事实对外协作的事件边界,但不代表业务编译期依赖。 |
| 把 `L0-sdk` / L5 产品层单独画进主图 | 不采用 | 它们是入口 / 封装消费方,本步在 consumer group 和表格中说明即可。 |
| 把 memory / archive 承载方作为外部能力边界 | 采用 | 需求尚未完全定型具体承载方,但 ref-only / handoff 边界必须在上下文层可见。 |
| 在本步定义依赖方向细节 | 不采用 | 编译期 / 运行期 / 事件协作的细粒度约束留给 Step 7。 |

---

## 7. 结构化中间产物

### 7.1 系统上下文图

```text
                         +----------------------+
                         |       L0-core        |
                         |    基础契约依赖       |
                         +----------+-----------+
                                    |
                                    | 依赖
                                    v
+----------------------+   输入   +----------------------+   输出   +----------------------+
| L3-method-library    |---------> |     L1-identity     |--------> | identity consumers   |
| 角色/能力定义来源     |          | 平台级成员身份真相仓  |          | 身份事实消费边界      |
+----------------------+          +----------+-----------+          +----------------------+
                                            ^
                                            |
                         +------------------+------------------+
                         |                  |                  |
                       输入                输入                输入
                         |                  |                  |
                         v                  v                  v
               +----------------+  +----------------+  +----------------------+
               |    L1-work     |  | L1-governance  |  | memory/archive       |
               | 项目参与来源    |  | 高风险依据来源  |  | 记忆引用承载边界      |
               +----------------+  +----------------+  +----------------------+

                         +----------------------+
                         |        L0-bus        |
                         |     事件协作边界      |
                         +----------+-----------+
                                    ^
                                    |
                                  输出/输入
                                    |
                              +-----+-----+
                              | L1-identity |
                              +-----------+
```

图示说明:

- 该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向,不表达接口、事件、实现组件或运行时顺序。
- `identity consumers` 是下游消费组,在表格中拆分为 work、process、conversation、governance、workspace、runtime、SDK / 产品和观测 / 归档等消费者。
- `L0-bus` 表示事件协作边界,不是业务编译期依赖;当前唯一编译期基础契约候选仍是 `L0-core`。
- memory / archive 作为外部能力边界出现,只表达 ref / handoff 状态来源,不表示 identity 保存正文。

### 7.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入 / 输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 依赖 | 共享 ref、actor、trace、metadata、error 基础契约 | 这是当前唯一允许进入编译期候选的基础上下文。 |
| `L0-bus` | 输入 / 输出 | 来源 / 消费 | 身份变化事实的事件协作边界 | 用于跨仓传播变化,不得携带外部正文或变成源码依赖。 |
| `L3-method-library` | 输入 | 来源 | 角色 / 能力定义来源和版本语义 | identity 只消费来源语义,不拥有定义正文。 |
| `L1-work` | 输入 | 来源 | 项目参与、生涯追加和 ProjectMember 来源事实 | identity 可记录身份侧经历,但不反向定义 work truth。 |
| `L1-work` | 输出 | 消费 | GlobalMember 身份锚点和成员状态摘要 | work 用于建立平台成员与项目成员分层。 |
| `L1-governance` | 输入 | 治理依赖 | 高风险生命周期处置依据 | identity 消费治理 / 授权依据引用,不拥有裁决 truth。 |
| `L1-governance` | 输出 | 消费 | actor / responsibility chain 所需成员身份引用 | governance 可消费成员身份事实用于追溯。 |
| memory / archive 承载边界 | 输入 | 来源 | memory refs、迁移 / 冷存引用状态 | identity 只保存引用关系和状态摘要,不保存正文。 |
| `L1-process` | 输出 | 消费 | actor / participant 身份摘要和成员引用 | process 可获得可追溯成员身份,不可反写 identity truth。 |
| `L1-conversation` | 输出 | 消费 | 成员显示身份、参与者摘要和身份变化 | conversation 消费可见摘要,不拥有身份 truth。 |
| `L1-workspace` | 输出 | 消费 | 成员视图、inbox 和跨项目身份摘要 | workspace 消费身份事实用于展示和编排视图。 |
| `L2-member-service` / `L2-runtime` | 输出 | 消费 | 生命周期、角色能力摘要和可运行性信号 | runtime 消费身份状态,不把运行实例写成身份 truth。 |
| `L4-observability` / archive | 输出 | 消费 | 身份追溯、归档触发和审计引用 | 观测和归档只承接安全可见追溯材料。 |
| `L0-sdk` / L5 产品层 | 输出 | 入口 / 消费 | 成员查询、管理和展示封装能力 | 产品和 SDK 是入口 / 封装消费方,不拥有身份 truth。 |

### 7.3 输入面收束

| 输入面 | 来源上下文 | 本步边界 | 失效口径 |
|---|---|---|---|
| 基础契约输入 | `L0-core` | 提供 ref / actor / metadata 等基础形状 | 缺失则本仓不能形成可实现基础契约 |
| 角色能力来源 | `L3-method-library` | 只作为来源和版本语义 | 不可用时角色能力摘要 pending / stale / unavailable |
| 项目参与来源 | `L1-work` | 只作为生涯和 ProjectMember ref 来源 | 不可用时不追加或进入待对账,不得伪造项目事实 |
| 高风险依据 | `L1-governance` | 只作为生命周期处置依据引用 | 不可用时高风险动作拒绝、暂停或待审 |
| memory / archive 状态 | 外部承载边界 | 只作为 ref / handoff 状态 | 不可用时 memory ref 变化 pending / degraded,不得保存正文 |
| 受控管理意图 | SDK / 产品入口 / 受控系统入口 | 只表达入口系统提交意图 | 无可信上下文时拒绝写入 |

### 7.4 输出面收束

| 输出面 | 消费上下文 | 本步边界 | 失效口径 |
|---|---|---|---|
| 身份锚点 | `L1-work`、process、conversation、workspace、SDK / 产品 | 只读 / 消费成员身份 ref | 未知身份不得隐式创建 |
| 状态摘要 | work、runtime、workspace、conversation | 提供可见全局生命周期状态 | 投影不可用时降级为 stale / unavailable,不改 truth |
| 角色能力摘要 | runtime、workspace、governance、产品层 | 提供身份侧摘要和来源引用 | 来源不可用时标 pending / stale,不补定义正文 |
| 生涯 / memory ref 摘要 | workspace、archive、observability、产品层 | 提供身份侧经历和引用状态 | 外部正文不可见时只返回 ref / marker |
| 变化追溯 | governance、observability、archive、审计消费方 | 提供安全可见原因、来源和 ref | 不暴露 credential、secret、外部正文 |
| 事件协作 | `L0-bus` 和订阅方 | 传播身份变化事实或摘要 | 事件不可用时依赖重建 / 对账,不共享数据库修复 |
| 对账报告 | 运维 / 审计 / observability | 报告本仓投影或引用漂移 | report-only,不得修复相邻仓 truth |

### 7.5 边界说明

本步把 `L1-identity` 放在 L1 领域服务层的身份真相位置,而不是入口、UI、runtime 或外部正文承载位置。主图只展示关键上下文对象,因为 Step 4 的任务是收稳系统边界和输入 / 输出方向,不是穷尽所有消费者或定义协议。method-library、work、governance 和 memory / archive 都是来源或依据上下文,它们的正文和内部 truth 不进入 identity;下游消费者只能读取、订阅或展示身份事实,不得反向定义 identity truth。依赖失效时,本仓不得用默认值补造外部事实,只能进入 pending、stale、unavailable、degraded 或 report-only 等后续 Step 可继续细化的降级口径。

---

## 8. 回填草稿

````md
## 5. 系统边界与上下文

> 校准来源:
> - `design-calibration/01_arch_step_04_system_context.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“系统上下文图”“上下游与输入 / 输出面表”“输入面收束”和“输出面收束”小节,了解本章上下文边界如何从职责边界和需求依赖收束。

`L1-identity` 位于 L1 领域服务层,承担平台级 AI 员工身份真相仓职责。它从基础契约、角色能力来源、项目参与来源、高风险治理依据和 memory / archive 引用承载边界接收输入,向 work、process、conversation、governance、workspace、runtime、SDK / 产品层和观测 / 归档能力提供身份事实消费与追溯边界。

### 5.1 系统上下文图

```text
                         +----------------------+
                         |       L0-core        |
                         |    基础契约依赖       |
                         +----------+-----------+
                                    |
                                    | 依赖
                                    v
+----------------------+   输入   +----------------------+   输出   +----------------------+
| L3-method-library    |---------> |     L1-identity     |--------> | identity consumers   |
| 角色/能力定义来源     |          | 平台级成员身份真相仓  |          | 身份事实消费边界      |
+----------------------+          +----------+-----------+          +----------------------+
                                            ^
                                            |
                         +------------------+------------------+
                         |                  |                  |
                       输入                输入                输入
                         |                  |                  |
                         v                  v                  v
               +----------------+  +----------------+  +----------------------+
               |    L1-work     |  | L1-governance  |  | memory/archive       |
               | 项目参与来源    |  | 高风险依据来源  |  | 记忆引用承载边界      |
               +----------------+  +----------------+  +----------------------+

                         +----------------------+
                         |        L0-bus        |
                         |     事件协作边界      |
                         +----------+-----------+
                                    ^
                                    |
                                  输出/输入
                                    |
                              +-----+-----+
                              | L1-identity |
                              +-----------+
```

该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向,不表达接口、事件、实现组件或运行时顺序。`identity consumers` 包括 work、process、conversation、governance、workspace、runtime、SDK / 产品和观测 / 归档等身份事实消费者。

### 5.2 上下游与输入 / 输出面

| 对象 | 关系方向 | 关系类型 | 输入 / 输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 依赖 | 共享 ref、actor、trace、metadata、error 基础契约 | 这是当前唯一允许进入编译期候选的基础上下文。 |
| `L0-bus` | 输入 / 输出 | 来源 / 消费 | 身份变化事实的事件协作边界 | 用于跨仓传播变化,不得携带外部正文或变成源码依赖。 |
| `L3-method-library` | 输入 | 来源 | 角色 / 能力定义来源和版本语义 | identity 只消费来源语义,不拥有定义正文。 |
| `L1-work` | 输入 / 输出 | 来源 / 消费 | 项目参与来源、GlobalMember 身份锚点和成员状态摘要 | work 拥有 ProjectMember truth,identity 拥有平台成员 identity truth。 |
| `L1-governance` | 输入 / 输出 | 治理依赖 / 消费 | 高风险生命周期依据、治理追溯所需成员身份引用 | identity 消费治理依据引用,不拥有裁决 truth。 |
| memory / archive 承载边界 | 输入 | 来源 | memory refs、迁移 / 冷存引用状态 | identity 只保存引用关系和状态摘要,不保存正文。 |
| identity consumers | 输出 | 消费 | 身份锚点、状态摘要、角色能力摘要、生涯 / memory ref 摘要、变化追溯、对账报告 | 消费方只能读、订阅或展示身份事实,不得反写 identity truth。 |

### 5.3 边界说明

主图只展示关键上下文对象,因为系统上下文图用于说明本仓在全局系统中的位置,不用于定义接口协议或内部结构。method-library、work、governance 和 memory / archive 都是来源或依据上下文,它们的正文和内部 truth 不进入 identity。下游消费者只能读取、订阅或展示身份事实,不得反向定义 identity truth;依赖失效时只能进入 pending、stale、unavailable、degraded 或 report-only 口径,不得用默认值补造外部事实。
````

---

## 9. 待确认事项

本步不新增待确认事项。需求层已登记的 `OQ-ID-001`~`OQ-ID-006` 继续有效。

| 待确认项 | 本步处理 |
|---|---|
| `OQ-ID-001` method-library 到 identity 的角色 / 能力来源方式 | 本步只确认 method-library 是正式来源上下文;具体同步 / 查询 / 事件协议后移 Step 9 / `03` |
| `OQ-ID-002` 高风险 lifecycle 动作枚举 | 本步只确认 governance 是高风险依据上下文;具体动作枚举后移 `03/06` |
| `OQ-ID-003` memory refs 的正式承载方和迁移结果 surface | 本步只以 memory / archive 承载边界表达外部能力;具体承载方和 surface 后移 Step 8 / Step 9 / `03` |
| `OQ-ID-004` 成员摘要 visibility / privacy 字段级裁剪 | 本步只确认消费边界和正文排除;字段级裁剪后移 Step 12 / `03` |
| `OQ-ID-005` P0 performance / availability 阈值 | 本步不处理性能阈值;后移 `05/06` |
| `OQ-ID-006` 既有 `04` 是否保留或重写 | 本步不引用既有 `04`;后移新版 `03` 稳定后的配置复核 |

---

## 10. 进入下一步条件

Step 4 已完成。允许进入 Step 5 的条件已满足:

- 用户已通过“同意”确认本步系统边界与上下文。
- `01_architecture_calibration_flow.md` 可将 Step 4 状态更新为 `已完成`。
- Step 5 只能承接本步上下文边界去划分限界上下文 / 子域,不得回头改写上游 / 下游关系。
- 若后续审核发现上下文对象、输入输出面或降级口径冲突,必须先回到本 Step 修正,不能带着冲突继续后续 Step。
