# ISO/IEC/IEEE 24748-2：讨论与对象抽象

> 本文的目标不是把 `ISO/IEC/IEEE 24748-2:2024` 的条款逐条复述，也不是把它读成"15288 的使用手册"就结束。
>
> 当前做两件事：
> 1. **先把 24748-2 的核心概念地基打牢**——它到底在回答哪个问题、和 15288 / 12207 / 29110 的分工是什么、裁剪机制如何工作
> 2. **再把 24748-2 理解为一个分层对象系统**——像 `BPMN 2.0`、`SPEM 2.0`、`29110` 一样，先看清"它服务谁、定义什么、怎么落地"
>
> 你可以先把 `ISO/IEC/IEEE 24748-2` 理解成：**"生命周期过程族的落地指南"——它不新增过程，而是教你：(1) 怎么把 15288 / 12207 的过程族实例化成一个真正的 Life Cycle Model；(2) 怎么在不同阶段、不同项目规模下裁剪；(3) 怎么把"过程"和"阶段"正确地区分和组织。**
>
> 本文所参考的 PDF 与建议阅读顺序，统一放在文末。

---

## 学习阶段总览

当前这份讨论与抽象文档，按 6 个阶段展开：

0. **第零阶段：概念地基**
   - 把 `Process` / `Stage` / `Activity` / `Life Cycle Model` / `Tailoring` / `Conformance` 等关键概念逐个讲清楚
   - 把 24748-2 最容易混淆的几对术语(Process vs Stage、Tailoring vs Tailorable、Model vs Framework)做对照辨析
   - 确保后续阅读不因术语含混而偏移
1. **第一阶段：整体架构——把 24748-2 看成一个分层系统**
   - 回答 24748-2 是什么、不是什么
   - 建立"它是 15288/12207 的应用指南 + 裁剪手册 + Life Cycle Model 目录"的基本认识
   - 用 BPMN 同款"分层系统"视角看全景
2. **第二阶段：对象系统——24748-2 到底由哪些对象构成**
   - 理解 `Life Cycle Model → Stages → Processes → Activities → Tasks` 的主干关系
   - 理解 `Decision Gate`、`Baseline`、`Tailoring Decision`、`Conformance Claim` 如何横向约束整个体系
3. **第三阶段：主线展开——应用 15288/12207 的七步法**
   - 理解 24748-2 定义的"应用方法论":从识别利益相关方到建立可追溯的符合性声明
   - 理解"Process Reference Model(PRM) → Implementation → Evidence"三段式
4. **第四阶段：生命周期模型目录——24748-2 里的八种经典模型**
   - 理解瀑布 / V 模型 / 增量 / 演进 / 迭代 / 螺旋 / Agile / DevOps 在 24748-2 的统一抽象下长什么样
   - 理解它们如何共享同一组 15288 过程、只在 Stage 编排上不同
5. **第五阶段：裁剪与符合性——24748-2 的"工程化声明"机制**
   - 理解 `Tailoring` 的三种机制:Reduction / Extension / Adaptation
   - 理解 Full / Tailored Conformance 的边界以及和 29110 Profile 机制的关系
6. **第六阶段：24748-2 与 15288 / 12207 / 29110 / Agile 的关系**
   - 理解 24748-2 的来源、定位和不可替代性
   - 理解为什么它不是"又一份过程标准"，而是"让其他过程标准真正可落地"的关键链接

---

## 第零阶段：概念地基

> 在进入过程和模型细节之前，先把 24748-2 里最核心的术语逐个讲清楚。
>
> 这样做的理由很简单：**24748-2 的独特价值就来自于它对术语的精确化——它显式地区分了 Process 和 Stage、Life Cycle Model 和 Life Cycle Process Framework、Tailoring 和 Selection，这些区分在 15288/12207 里是隐性的。**
>
> 这一阶段不要求你记住全部条款，但要求你在遇到这些词时，不再凭直觉猜。

---

### 0.1 24748-2 的六层对象关系图

24748-2 不是一份"轻量过程文档"，而是一个由受众、过程族、生命周期模型、阶段与活动、裁剪机制、符合性声明共同构成的六层对象体系：

```text
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   [L1]  应用对象层                                                  │
│         ─────────────                                               │
│         System of Interest(SoI) / Enabling System / Stakeholders    │
│                                                                     │
│   [L2]  过程族层(来自 15288 / 12207)                              │
│         ─────────────────────────────                               │
│         Agreement / Organizational Project-Enabling /               │
│         Technical Management / Technical                            │
│                                                                     │
│   [L3]  生命周期模型层                                              │
│         ─────────────                                               │
│         Waterfall / V / Incremental / Evolutionary /                │
│         Iterative / Spiral / Agile / DevOps                         │
│                                                                     │
│   [L4]  阶段与活动层                                                │
│         ─────────────                                               │
│         Stages(Concept / Development / Production /                 │
│                Utilization / Support / Retirement)                  │
│         Activities / Tasks(由过程实例化而来)                       │
│                                                                     │
│   [L5]  裁剪与决策层                                                │
│         ─────────────                                               │
│         Tailoring Decisions / Decision Gates /                      │
│         Baselines / Configuration Items                             │
│                                                                     │
│   [L6]  符合性与证据层                                              │
│         ─────────────                                               │
│         Conformance Claim(Full / Tailored) /                       │
│         Evidence / Audit Trail                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**读法**:

- 从下往上读:你先声明符合什么(L6)，再说裁剪成什么样(L5)，再对应具体的阶段和活动(L4)，再选择生命周期模型(L3)，再调用哪些过程族(L2)，最后作用在哪个 SoI 上(L1)。
- 从上往下读:你先识别 SoI 和利益相关方(L1)，再决定用哪些过程(L2)，再挑生命周期模型(L3)，再编排阶段和活动(L4)，再做裁剪决策(L5)，最后产出符合性证据(L6)。

24748-2 的独特贡献是:**它让 L3(生命周期模型层)显式化了**。15288 和 12207 只给了 L2 的过程族，但"怎么组织成阶段顺序"在那两份标准里是隐性的；24748-2 把这层补了出来。

---

### 0.2 关键术语清单

下面逐个讲清 24748-2 最常用的术语，以及它们之间最容易搞混的地方。

#### 术语 A:`Process`(过程)

**定义(来自 15288/12207 继承)**:一组相关活动的集合，通过使用输入产生一组输出。

**在 24748-2 里的用法**:`Process` 是**不变的能力原语**——不管你用什么生命周期模型，过程本身不变。例如"Requirements Definition Process"在瀑布、敏捷、DevOps 里都存在，区别只是**什么时候调用、调用几次、每次处理多少内容**。

**常见误用**:把 Process 直接等同于"瀑布模型里的一个阶段"。这是最大的误解。阶段和过程是**不同层的**。
#### 术语 B:`Stage`(阶段)

**定义**:生命周期中的一段有明确起止的时间段，通常对应系统某个主要状态(概念形成、开发中、运行中、退役)。

**在 24748-2 里的用法**:`Stage` 是**时间与状态的组织单位**——它组织了"什么时候做什么"。Stage 之间常设 Decision Gate(决策门禁)。

**与 Process 的关键区别**:
- 同一个 Process 可以被多个 Stage 调用(例如 Risk Management Process 在 Concept / Development / Utilization 都要跑)
- 同一个 Stage 内可以同时跑多个 Process
- Process 是"能力"，Stage 是"时段" —— 两者正交

**24748-2 列的 6 个参考 Stage**:Concept / Development / Production / Utilization / Support / Retirement。但这只是**参考**，你可以按项目情况重命名、合并、拆分。

#### 术语 C:`Life Cycle Model`(生命周期模型)

**定义**:对一个系统在其生命周期内所经历的阶段、过程、活动、任务的**编排方式**。

**在 24748-2 里的用法**:`Life Cycle Model` 是**对 Stage 和 Process 调用顺序的一次性编排**。同一组过程(比如 15288 的 30 个过程)可以被编排成瀑布、V、增量、演进、迭代、螺旋、Agile、DevOps —— 这 8 种就是 24748-2 显式列出的**参考模型**。

**关键洞察**:
- Life Cycle Model 不是一成不变的流程图，而是一个**编排方案的声明**
- 24748-2 明确说:你可以**组合**多个模型(项目前期用瀑布 + 后期用迭代、整体用 DevOps + 局部用敏捷)

#### 术语 D:`Life Cycle Process Framework`(生命周期过程框架)

**定义**:一组可用的过程的集合（比如 15288 的过程集、12207 的过程集）。

**与 Life Cycle Model 的区别**:
- Framework 是**过程的池**(有什么过程可用)
- Model 是**如何编排池里的过程**(怎么用它们)

24748-2 把这两层显式分开，是因为实践中经常有团队误把"12207 过程清单"当作"流程图"——这是错误的。12207 只告诉你有哪些过程，没告诉你按什么顺序跑。

#### 术语 E:`Activity` / `Task`

**定义(继承 15288/12207)**:
- `Activity` — Process 下的二级单位，一组相关 Task 的集合
- `Task` — 最小执行单位，有输入输出

**在 24748-2 里的用法**:和 15288/12207 一致。但 24748-2 额外强调:**Activity/Task 不属于某个 Stage**——它们属于 Process。Stage 只是**调用 Activity/Task 的时序容器**。

#### 术语 F:`Decision Gate`(决策门禁)

**定义**:Stage 之间或 Stage 内的特定时点，用于评审前一阶段的成果、决定是否进入下一阶段。

**在 24748-2 里的用法**:Decision Gate 是**项目治理的控制点**。典型的 Decision Gate 类型:
- Concept Review(概念评审)
- System Requirements Review
- System Design Review
- Test Readiness Review
- Production Readiness Review
- Operational Readiness Review

Decision Gate 上的评审内容由 24748-2 推荐，但**具体设哪几个 Gate、各自评审什么、由谁评审**都是裁剪决策。

**在 Quantalithos 里的映射**:Decision Gate = 治理域的 `Gate` 对象。这不是巧合 —— Gate 就是我们对 24748-2 Decision Gate 的一等对象化。

#### 术语 G:`Baseline`

**定义**:某一时点上被正式批准、作为后续工作基础的配置状态。一旦 Baseline 设立，变更必须走变更控制流程。

**与 Artifact 的区别**:
- Artifact 可以有多个版本，每次修改都产生新版本
- Baseline 是**被冻结、被审批、被引用**的特定版本集合

**典型 Baseline**:Requirements Baseline / Design Baseline / Product Baseline。

#### 术语 H:`Tailoring`(裁剪)

**定义**:对一组过程/活动/任务进行增加、修改、减少，使之适配具体项目的需要。

**在 24748-2 里的用法**:Tailoring 是**必做的，不是可选的**。24748-2 认为"直接不做裁剪就套用 15288"是一种**误用**。每个项目必须基于自己的规模、风险、领域做裁剪决策。

**Tailoring 的三种机制**(24748-2 明确列出):
1. **Reduction**(削减) — 移除不适用的 Activity/Task(例如小项目不做 Asset Management Process)
2. **Extension**(扩展) — 新增标准之外的 Activity/Task(例如引入 AI-specific 的 Data Quality Activity)
3. **Adaptation**(适配) — 修改标准的 Activity/Task 细节以适配上下文(例如把"Weekly Status Review"改为"Daily Standup")

**关键原则**:Tailoring 决策必须被记录、可追溯、可评审。不能"偷偷裁剪"。

#### 术语 I:`Conformance Claim`(符合性声明)

**定义**:对"本项目/组织符合某标准"的正式声明。

**两种形态**(继承自 15288/12207):
- **Full Conformance** — 覆盖标准要求的所有过程和所有结果
- **Tailored Conformance** — 明确声明裁剪了什么、为什么，仍然声明符合

24748-2 的贡献在于:**它教你怎么写出一个可审核、可追溯的 Tailored Conformance Claim**。这不是一份"我觉得符合"的自述，而是一份"我裁剪了 X Y Z，理由是 A B C，证据是 D E F"的工程化文档。

---

### 0.3 最容易混淆的三对术语

24748-2 有三对术语特别容易搞混。把这三对辨清楚，后面的章节基本不会迷路。

#### 辨析 1:Process vs Stage

| 维度 | Process | Stage |
|---|---|---|
| 本质 | 能力(什么事会被做) | 时段(什么时候做) |
| 数量维度 | 15288 有 30 个 / 12207 类似规模 | 典型 5-7 个 |
| 重复性 | 同一过程可跨多个阶段执行 | 阶段按时序一次通过或迭代循环 |
| 编排者 | 被 Life Cycle Model 调用 | 由 Life Cycle Model 编排 |
| 例子 | Requirements Definition Process | Concept Stage |

**核心区别**:**Process 是静态的能力原语，Stage 是动态的时序容器**。两者正交。

#### 辨析 2:Tailoring vs Selection

| 维度 | Tailoring(裁剪) | Selection(选型) |
|---|---|---|
| 作用对象 | Process 内部的 Activity/Task | 生命周期模型(瀑布/敏捷/DevOps) |
| 典型决策 | "这个 Task 我们不做" | "我们用 Scrum 作为主框架" |
| 时机 | 项目启动后、持续发生 | 项目启动期、不常变 |
| 可逆性 | 高 | 低 |

在实践里，**先做 Selection、再做 Tailoring**。先选模型，再裁剪活动。

#### 辨析 3:Life Cycle Model vs Life Cycle Process Framework

| 维度 | Life Cycle Model | Life Cycle Process Framework |
|---|---|---|
| 提供什么 | 过程的调用顺序 | 过程的集合 |
| 规范来源 | 24748-2 给出 8 种参考模型 | 15288 / 12207 给出过程池 |
| 典型产出 | 阶段时序图 | 过程清单表 |
| 关系 | Model 使用 Framework | Framework 被 Model 使用 |

**比喻**:Framework 像厨房的全部食材和工具，Model 像菜谱(教你按什么顺序用哪些食材)。

---

### 0.4 24748-2 最常见的五个误解

在展开主干之前，先把实践中最常见的五个误解列出来，避免后面重复踩坑。

**误解 1:"24748-2 是 15288 的简化版或轻量版"**

错。24748-2 不减少 15288 的任何过程——它**是 15288 的应用指南**。你仍然需要完整的 15288 过程池，24748-2 只是教你**怎么把这些过程编排成项目、如何裁剪、如何声明符合**。

**误解 2:"24748-2 给了一个标准的生命周期模型"**

错。24748-2 给了 **8 种参考模型**，但明确说:**你应该根据你的项目选择或组合**。不存在"24748-2 模型"这个东西。

**误解 3:"阶段就是瀑布里的那些阶段"**

错。24748-2 的 Stage 是**时段/状态**的抽象概念，适用于任何生命周期模型。敏捷也有 Stage(Inception / Construction / Transition)，DevOps 也有 Stage(Plan / Code / Build / Test / Release / Deploy / Operate / Monitor)。

**误解 4:"裁剪是对小项目的妥协"**

错。24748-2 明确说裁剪对**所有项目**都是必做的——大项目更需要裁剪，因为"全做"会淹没在过程负担里。

**误解 5:"符合性声明写'我们符合 15288'就行"**

错。24748-2 要求符合性声明必须是**可审核的**:列出裁剪决策、提供证据、支持追溯。
---

## 第一阶段:整体架构 —— 把 24748-2 看成一个分层系统

### 1.1 24748-2 是什么、不是什么

**是什么**:

- 一份关于**如何应用 15288 和 12207** 的国际指南
- 一份**生命周期模型目录**(8 种参考模型 + 它们的适用性分析)
- 一份**裁剪与符合性方法论**(三种裁剪机制 + 可审核符合性声明的格式)
- 一份**跨方法桥梁**(解释瀑布、敏捷、DevOps 如何都在同一个过程框架下共存)

**不是什么**:

- 不是一份独立的过程标准(它不定义新过程)
- 不是一份具体的项目管理手册(它不告诉你今天做什么)
- 不是一份认证标准(24748-2 本身不直接用于认证,认证走 15288/12207/29110 的符合性声明)
- 不是一份强制的"最佳实践"清单(它给的是**可选的参考**,不是硬性规定)

### 1.2 24748-2 的五个核心角色

24748-2 服务于五种角色,每种角色关注的部分不同:

| 角色 | 最关心的部分 | 典型问题 |
|---|---|---|
| 项目经理 | 第 3 / 5 章(模型目录 + 裁剪) | 我这个项目选什么模型?怎么裁剪? |
| 系统工程师 | 第 2 章(过程与阶段映射) | 15288 过程怎么落到具体阶段? |
| 质量/过程工程师 | 第 5 / 6 章(符合性声明) | 怎么写一份可审核的符合性声明? |
| 组织级方法论负责人 | 第 4 / 7 章(组织适配 + 多项目治理) | 怎么把 24748-2 嵌入组织的 QMS? |
| 合规/审计官 | 第 6 章(证据与追溯) | 我怎么审核项目是否真的符合 15288? |

### 1.3 24748-2 在方法论生态里的位置

```
                  ┌──────────────────────────────────────────────┐
                  │  方法论生态的分层关系                          │
                  └──────────────────────────────────────────────┘

       ┌─────────────────────────────────────────────────────┐
       │  执行方法层:Scrum / Kanban / XP / SAFe / DevOps      │
       │           (告诉你今天的日常怎么干)                    │
       └──────────┬──────────────────────────────────────────┘
                  │ 实例化
                  ▼
       ┌─────────────────────────────────────────────────────┐
       │  [本层] 24748-2:生命周期模型与裁剪                    │
       │         (告诉你过程怎么编排、怎么裁剪、怎么声明符合)    │
       └──────────┬──────────────────────────────────────────┘
                  │ 应用
                  ▼
       ┌─────────────────────────────────────────────────────┐
       │  过程族层:15288(系统)/ 12207(软件)                │
       │         (告诉你有哪些过程可用)                        │
       └──────────┬──────────────────────────────────────────┘
                  │ 评估
                  ▼
       ┌─────────────────────────────────────────────────────┐
       │  评估层:CMMI / 15504 / 330xx / 9001                  │
       │         (告诉你过程成熟度如何评)                      │
       └─────────────────────────────────────────────────────┘
```

24748-2 的价值:它是**过程族层**与**执行方法层**之间的**翻译器和桥梁**。没有 24748-2,一个团队很难从"15288 给了 30 个过程"跳到"我们今天用 Scrum 开每日站会"。

### 1.4 24748-2 的两个伴随文档

24748 是一个系列,不是单一文档。在 A 方案设计里尤其要知道:

- **24748-1:Guidelines for life cycle management** — 总纲,把 15288/12207 的生命周期管理概念统一
- **24748-2:Guide to the application of 15288/12207** — 本文讨论的这份,最面向工程实践
- **24748-3,-4,-5,-6,-7** — 各领域专项(系统工程、软件生命周期、架构、能力评估、硬件等)

24748-2 是这套系列里**最直接面向"项目落地"**的那份。

---

## 第二阶段:对象系统 —— 24748-2 到底由哪些对象构成

### 2.1 主干对象关系

24748-2 定义了一个"从系统到证据"的对象主干:

```
System of Interest(系统关切对象)
        │
        │ 跨越的时间被组织为
        ▼
Life Cycle(完整生命周期)
        │
        │ 根据选择的
        ▼
Life Cycle Model(生命周期模型)
        │
        │ 被分解为
        ▼
Stages(阶段序列)
        │
        │ 每个阶段由特定时点的
        ▼
Decision Gates(决策门禁)连接
        │
        │ 阶段内调用
        ▼
Processes(过程)
   (来自 15288 / 12207 过程池)
        │
        │ 过程被分解为
        ▼
Activities → Tasks
        │
        │ 所有元素都经过
        ▼
Tailoring Decisions(裁剪决策)
        │
        │ 最终产出
        ▼
Baselines + Conformance Claim + Evidence
```

### 2.2 主干对象字典表

| 对象 | 所属层 | 必选/可选 | 持久性 | 典型数量 |
|---|---|---|---|---|
| System of Interest | L1 | 必选 | 项目级永久 | 1 个/项目 |
| Enabling System | L1 | 必选 | 项目级永久 | ≥1 个/项目 |
| Life Cycle | L1 | 必选 | 项目级永久 | 1 个/SoI |
| Life Cycle Model | L3 | 必选 | 项目级永久 | 1 个/SoI(可组合) |
| Life Cycle Process Framework | L2 | 必选 | 组织级 | 1 个/组织 |
| Stage | L4 | 必选 | 时段级 | 典型 5-7 个/项目 |
| Decision Gate | L4 | 必选 | 时点级 | 典型 4-8 个/项目 |
| Process | L2 | 必选 | 组织级 | 15288 给 30 个 |
| Activity | L4 | 必选 | 项目级 | 过程分解产生 |
| Task | L4 | 必选 | 项目级 | Activity 分解产生 |
| Tailoring Decision | L5 | 必选 | 项目级永久 | 数十至数百/项目 |
| Baseline | L5 | 可选(强推荐) | 项目级永久 | 典型 3-6 个/项目 |
| Conformance Claim | L6 | 必选(要声明符合) | 项目级永久 | 1 份/项目 |
| Evidence | L6 | 必选(要声明符合) | 项目级永久 | 每个过程结果都产生 |

### 2.3 横向约束对象

除了主干对象,还有一组**跨对象的约束**:

- **Role**(角色) — 谁负责 Activity/Task(来自 15288,24748-2 强调必须在裁剪时明确)
- **Work Product**(工作产品) — 过程的输入输出(来自 15288,24748-2 强调 Baseline 的本质是 Work Product 的冻结集)
- **Quality Characteristic**(质量特性) — 约束 Work Product 的质量维度(与 ISO 25010 交汇)
- **Risk**(风险) — 跨 Stage 和 Process 的横切关注点(来自 15288 的 Risk Management Process)

### 2.4 对象与 Quantalithos 六域的映射

这是本节的重点:把 24748-2 的对象映射到 Quantalithos 的六域模型。

| 24748-2 对象 | Quantalithos 对应 | 映射说明 |
|---|---|---|
| System of Interest | 工作域 Project | SoI 就是用户委派 AI 团队要做的软件项目本身 |
| Enabling System | 身份域 AI Members + 横切(方法库/能力池) | "使能系统" = 团队 + 工具 + 方法论 |
| Life Cycle Model | 过程域 ProcessTemplate 的一种类型 | 生命周期模型作为可选模板(瀑布/敏捷/DevOps)存在于方法库 |
| Life Cycle Process Framework | 方法库 Method Library + 过程域 ProcessDefinition | Framework 是组织级过程池,SPEM Method Content 是其实现 |
| Stage | 过程域 ProcessInstance 的时间切片 | Stage 在 Quantalithos 里是过程实例的"阶段状态",不是独立对象 |
| Decision Gate | **治理域 Gate** | **直接对应**。Quantalithos Gate 就是对 24748-2 Decision Gate 的一等对象化 |
| Process | 过程域 ProcessDefinition(SPEM TaskDefinition) | Process 本身是 Method Content |
| Activity | 过程域 Activity(BPMN 里的 Activity) | 直接对应 BPMN 的 Activity |
| Task | 过程域 Task / 工作域 WorkItem | BPMN Task 是过程内原语,Quantalithos WorkItem 是工作跟踪单位 |
| Tailoring Decision | **治理域 Profile + 过程域 ProcessProfile** | Profile 裁剪机制对齐 24748-2 Tailoring |
| Baseline | **制品域 Artifact(状态 = baselined)** | Artifact 状态机里的 baselined 状态就是对应 Baseline |
| Conformance Claim | 治理域 ComplianceDeclaration(新增实体) | 每个项目归档时产生一份,包含裁剪决策 + 证据引用 |
| Evidence | 制品域 Artifact + 横切审计事件 | 证据由 Artifact 和不可变审计事件共同组成 |

**两个重要推论**:

1. **Gate 是 24748-2 Decision Gate 的一等对象化**——这是 Quantalithos 治理域的核心隐喻来源
2. **Artifact 状态机必须包含 `baselined` 状态**——这不是装饰,是为了承载 24748-2 的 Baseline 语义

---
## 第三阶段:主线展开 —— 应用 15288/12207 的七步法

### 3.1 24748-2 的"应用方法论"

24748-2 不仅给模型目录,还给出了**应用 15288/12207 的七步法**。这是每一个项目或组织从"知道标准"到"用上标准"的标准路径。

**七步法**:

```
Step 1. 识别 System of Interest 及其利益相关方
        ↓
Step 2. 选择生命周期模型(Life Cycle Model Selection)
        ↓
Step 3. 定义阶段序列与 Decision Gates
        ↓
Step 4. 从过程池选择适用的过程(Process Selection)
        ↓
Step 5. 裁剪选定的过程(Tailoring)
        ↓
Step 6. 执行过程,产生证据
        ↓
Step 7. 建立符合性声明(Conformance Claim)
```

这七步法贯穿项目启动到结束。前五步集中在项目启动期,第 6 步是执行期的持续动作,第 7 步在关键里程碑或项目结束时产出。

### 3.2 每一步的产出与证据

| Step | 产出 | 证据形式 |
|---|---|---|
| 1. SoI 识别 | SoI 定义 + 利益相关方清单 | Project Charter / Stakeholder Register |
| 2. 模型选择 | 选择理由 + 备选方案对比 | Life Cycle Model Selection Record |
| 3. 阶段定义 | 阶段图 + Gate 定义 | Life Cycle Plan |
| 4. 过程选择 | 应用过程清单 + 不应用过程清单 + 理由 | Process Applicability Record |
| 5. 裁剪决策 | 每个过程的 Activity/Task 调整记录 | Tailoring Record |
| 6. 过程执行 | Work Products + Activity 完成记录 | Project Artifacts + Audit Trail |
| 7. 符合性声明 | 声明文档 + 所有上述证据的汇总引用 | Conformance Claim Document |

### 3.3 七步法在 Quantalithos 里的落地

每一步都可以在 Quantalithos 找到对应的系统动作:

| Step | Quantalithos 动作 | 负责模块 |
|---|---|---|
| 1. SoI 识别 | 用户与 Assistant 私聊立项,产出 Project 聚合根 | 工作域 |
| 2. 模型选择 | Assistant 根据项目画像推荐 ProcessTemplate,用户批准 | 过程域 + 治理域 Gate |
| 3. 阶段定义 | ProcessTemplate 包含阶段定义,实例化为 ProcessInstance | 过程域 |
| 4. 过程选择 | Profile 机制 —— 勾选过程池里的过程 | 过程域 ProcessProfile |
| 5. 裁剪决策 | `tool_scope` + `policy_overrides` 产生每个 Member 的裁剪视图 | 身份域 + 治理域 |
| 6. 过程执行 | Member 在 ProcessInstance 下跑 Activity,产出 Artifact,发 AuditEvent | L2 Member 运行层 |
| 7. 符合性声明 | 项目归档时生成 ComplianceDeclaration,打包进 ArchiveBundle | 治理域 + archive 服务 |

**关键观察**:Quantalithos 不需要重新发明这七步,**它把 24748-2 的七步法原生嵌入到产品工作流**。用户看到的"立项 → 团队组建 → 方案确认 → 实施 → 验收 → 发布"正是七步法的用户语言表达。

### 3.4 "可追溯"的应用原则

24748-2 反复强调一个原则:**每一步的决策都必须可追溯到更高一层的依据**。

```
            SoI 特性
               │ 导出
               ▼
        利益相关方需求
               │ 导出
               ▼
          项目约束
               │ 导出
               ▼
         生命周期模型选择 ← 此处必须记录理由
               │ 导出
               ▼
           过程选择      ← 此处必须记录理由
               │ 导出
               ▼
          裁剪决策        ← 此处必须记录理由
               │ 导出
               ▼
         Work Product    ← 必须引用上游依据
               │ 导出
               ▼
        Conformance Claim ← 引用所有上游证据
```

这正好对应 Quantalithos 的**三条横切红线之一:可追溯性**。24748-2 是这条红线的方法论来源。

---

## 第四阶段:生命周期模型目录 —— 24748-2 里的八种经典模型

24748-2 最具实用价值的部分,是它把**八种主流生命周期模型在同一个抽象框架下平等对照**。下面逐个讲清每种模型的特征、适用场景以及在 Quantalithos 里的表现。

### 4.1 瀑布模型(Waterfall)

**特征**:阶段严格顺序、单向流动、每阶段完成再进下一阶段。

**24748-2 的描述**:
- 阶段:Concept → Requirements → Design → Implementation → Test → Deployment → Maintenance
- Decision Gate 在每两阶段之间严格把关

**适用场景**(24748-2 给出):需求稳定、技术熟悉、监管严格(航空、医疗、核电)。

**在 Quantalithos 里**:作为 ProcessTemplate 的一个类型,名为 `waterfall-classic`。默认不推荐,仅在用户明确需要"严格合规项目"时使用。

### 4.2 V 模型(V-Model)

**特征**:瀑布的变体 —— 每个设计阶段对应一个测试阶段,形成 V 字形(左边下降做设计,右边上升做验证)。

**24748-2 的描述**:
- 左腿:Concept → System Requirements → System Design → Module Design
- 底点:Implementation
- 右腿:Unit Test → Integration Test → System Test → Acceptance Test

**适用场景**:强验证需求的项目(汽车、安全关键)。Automotive SPICE 隐含 V 模型。

**在 Quantalithos 里**:作为 ProcessTemplate `v-model`。每个"设计型 Activity"会生成一个对应的"验证型 Activity",由 QA Member 承担。

### 4.3 增量模型(Incremental)

**特征**:把系统分成多个增量,每个增量通过完整的"需求 → 设计 → 实现 → 测试"循环。增量之间是顺序关系,总需求在一开始就确定。

**24748-2 的描述**:
- 在 Concept 阶段定义完整需求
- 每个增量独立走一遍 Stage 序列
- 增量顺序由优先级决定

**与迭代模型的区别**:Incremental 每次增量都是**最终系统的一部分**,前期定需求;Iterative 每次迭代都是**系统的完整雏形**,边迭代边精化需求。

**在 Quantalithos 里**:作为 ProcessTemplate `incremental`。Project 下划分 Release 1 / 2 / 3,每个 Release 是一个增量。

### 4.4 演进模型(Evolutionary)

**特征**:系统不是一次性完成的,而是通过多次演进式发布逐步成形,每次发布后根据反馈调整下一次内容。

**24748-2 的描述**:
- 起步于一个最小可用系统
- 通过实际使用产生反馈
- 反馈驱动下一次演进的需求

**与增量的区别**:Incremental 前期定全部需求;Evolutionary 需求本身随演进而发现。

**在 Quantalithos 里**:作为 ProcessTemplate `evolutionary`。适合"我有个大致想法但不确定细节"的用户 —— 大部分早期用户场景。

### 4.5 迭代模型(Iterative)

**特征**:以固定周期(迭代)推进,每次迭代产出可观察增量,跨迭代精化需求与设计。

**24748-2 的描述**:
- 迭代周期通常 1-4 周
- 每个迭代走"规划 → 实现 → 评审 → 回顾"
- 通过多次迭代逐步收敛到最终系统

**与 Agile 的关系**:Agile 是一类迭代模型的家族,但迭代模型不都是敏捷(Rational Unified Process 的迭代不算 Agile)。

**在 Quantalithos 里**:作为 ProcessTemplate `iterative-standard`。典型的 Quantalithos 项目默认形态。

### 4.6 螺旋模型(Spiral)

**特征**:以"风险驱动"为核心,每一圈包含"确定目标 → 识别风险 → 制定缓解 → 开发与验证 → 规划下一圈"四个象限。

**24748-2 的描述**:
- 每一圈处理当前最大的风险
- 螺旋的直径代表已投入的成本
- 适合高风险、高不确定性项目

**在 Quantalithos 里**:作为 ProcessTemplate `spiral`。用于需要严格风险管理的项目(金融核心系统、大型架构迁移)。

### 4.7 敏捷模型(Agile)

**特征**:24748-2 在 2024 版中扩展了对 Agile 的描述,将其视为"迭代模型 + 价值观"的组合。

**24748-2 的关键识别**:
- 敏捷不是"没有过程",而是对 15288 过程的**特定裁剪和编排**
- Scrum / Kanban / XP / SAFe 都是敏捷家族的具体实例
- 敏捷的 Sprint 可以映射为 24748-2 的 Stage 的一种特殊形式(高频、短周期的 Stage)

**在 Quantalithos 里**:作为 ProcessTemplate 家族 `agile/scrum`、`agile/kanban`、`agile/safe`。每个模板都继承自 `agile-base`,包含 Sprint/Backlog/Retrospective 对象。

### 4.8 DevOps 模型

**特征**:把"开发"与"运维"整合为持续流,强调持续集成、持续部署、持续监控。

**24748-2 的描述**:
- 阶段高度重叠:Code / Build / Test / Release / Deploy / Operate / Monitor 循环
- 自动化为核心机制
- Operate 和 Monitor 产生的反馈直接驱动下一次 Code

**在 Quantalithos 里**:作为 ProcessTemplate `devops`。需要配合 L4 基础设施层的 CI/CD 与监控集成。

### 4.9 模型组合

24748-2 明确说:**这 8 种模型不是互斥的**。实践中常见组合:

- **Waterfall + Iterative** — 前期(Concept / Requirements)用瀑布,后期(Implementation)用迭代
- **Agile + DevOps** — 团队内部用 Scrum,发布流水线用 DevOps
- **Spiral + Iterative** — 以螺旋管理风险,每一圈内用迭代推进实现
- **V 模型 + Agile** — 敏捷迭代里每次也对应测试验证(这也是 Agile V-Model 的名字由来)

**在 Quantalithos 里**:`ProcessTemplate` 支持组合(一个模板可以 `extends` 另一个模板 + `overrides` 部分阶段)。

---
## 第五阶段:裁剪与符合性 —— 24748-2 的"工程化声明"机制

### 5.1 为什么裁剪是必做的

24748-2 的核心主张之一:**任何项目都需要裁剪,"不裁剪 = 误用"**。

理由:
- 15288 的 30 个过程 × 每个过程 5-10 个 Activity × 每个 Activity 3-5 个 Task = 接近 1000 个动作点
- 没有项目能全部做完,全做必然浪费、失焦、掩盖真正的风险
- 裁剪不是"偷懒",是**资源配置决策**

24748-2 把裁剪定位为**项目治理的一等活动**,而不是"懒得做的借口"。

### 5.2 三种裁剪机制详解

#### 5.2.1 Reduction(削减)

**定义**:从标准的过程/Activity/Task 集中**移除**部分。

**合法削减的判据**:
- 该元素与本项目的 SoI 特性不相关
- 该元素对应的风险在本项目上下文中不存在
- 该元素被其他元素覆盖(例如 QA Member 的评审覆盖了正式的 Peer Review Activity)

**不合法削减的典型**:
- 因为"来不及"就削减验证性 Activity(这是把成本问题伪装成裁剪)
- 因为"不想做"就删减审计性 Task(违反治理原则)

#### 5.2.2 Extension(扩展)

**定义**:在标准之外**新增**元素。

**合法扩展的判据**:
- 本项目有超出标准范围的特殊需求(AI 项目的 Data Quality、硬件项目的 ESD 设计)
- 本项目的组织有额外的合规要求(FDA、GDPR、HIPAA)
- 本项目有特定风险需要专门处理

**关键原则**:扩展的元素**必须标注为"非标准"**,不能伪装成标准过程。

#### 5.2.3 Adaptation(适配)

**定义**:保留标准元素,但修改其**细节**以适配上下文。

**合法适配的典型**:
- 修改评审频率("Weekly Review" → "Daily Standup")
- 修改审批链("由架构师批准" → "由 AI Tech Lead + 用户共同批准")
- 修改工作产品格式("正式 SRS" → "Markdown 需求文档 + 对话引用")

**适配的边界**:不能在适配名义下改变 Activity 的**本质目的**(Outcome)。只能改形式,不能改实质。

### 5.3 裁剪决策记录的标准格式

24748-2 给出了裁剪决策的结构化格式(Tailoring Record):

```
Tailoring Record
────────────────
Tailoring ID:       TR-2026-001
Process:            6.4.2 Requirements Analysis Process
Activity/Task:      Activity A.4.2.3 - Formal Requirements Review
Action:             Adaptation
Change Detail:      Replace "SRR with architecture board" with
                    "Async review by AI Tech Lead + user confirmation via Gate"
Rationale:          Quantalithos projects don't have a human architecture board;
                    AI Tech Lead fills this role with user as final authority.
Risk Mitigation:    Gate decision requires explicit user approval;
                    decision is logged and irreversible without new Gate.
Approved By:        [Method Library Owner]
Effective From:     [Project start date]
Evidence Link:      [link to audit trail]
```

**在 Quantalithos 里**:每个 `ProcessProfile` 的 `tailoring_decisions` 字段就是这种结构的数组。

### 5.4 符合性声明的两种形态

#### 5.4.1 Full Conformance(完全符合)

**条件**:
- 应用了标准规定的**所有 Activity 和 Outcome**
- 没有删减任何 Outcome(Activity 可以细节调整,但目的必须全保留)
- 产出了所有规定的 Work Product

**典型场景**:受监管行业的关键系统(航空、医疗、核电)。

**在 Quantalithos 里**:实际上罕见,但预留路径 —— 用于未来的**合规产品线**。

#### 5.4.2 Tailored Conformance(裁剪符合)

**条件**:
- 明确声明了所有裁剪决策
- 每个裁剪决策有理由、有风险缓解、有批准
- 保留了过程的**核心目的**(即使细节有变化)

**24748-2 的要求**:Tailored Conformance 声明必须包含:
1. 声明符合的标准版本(如"ISO/IEC/IEEE 12207:2017")
2. 应用的过程清单(哪些完整应用、哪些部分应用、哪些不应用)
3. 所有裁剪决策的记录
4. 每个裁剪的理由与风险缓解
5. 关键 Outcome 的证据引用

**在 Quantalithos 里**:归档包 `ArchiveBundle` 里的 `ComplianceDeclaration` 必须满足这五项。

### 5.5 与 29110 Profile 机制的关系

24748-2 的裁剪机制和 29110 Profile 机制是**协作关系**,不是竞争:

- **29110 Profile 机制**:面向 VSE(极小型组织)的**预定义裁剪套餐**(Entry / Basic / Intermediate / Advanced)
- **24748-2 裁剪机制**:面向**任意规模项目**的**通用裁剪方法论**

**结合使用**:
1. 大组织先用 24748-2 的方法论定义**组织级 Profile**(一批适合的裁剪模板)
2. 小项目(VSE 规模)直接选择 29110 Profile
3. 中等规模项目参考 29110 Basic Profile 做起点,叠加 24748-2 Adaptation

**在 Quantalithos 里**:
- `ProcessTemplate` 的 `profile_group` 字段可选 `29110-basic` / `29110-intermediate` / `org-defined`
- 每个 Template 都遵循 24748-2 的 Tailoring Record 格式记录裁剪决策
- 两者共存、互补

---

## 第六阶段:24748-2 与其他标准的关系

### 6.1 与 15288 / 12207 的关系

**核心关系**:24748-2 是 15288/12207 的**应用指南**。

```
  15288 / 12207
  (定义过程池:30 个过程)
       │
       │ 如何使用这些过程?
       ▼
  24748-2
  (定义:选模型 + 裁剪 + 声明符合)
       │
       │ 产出
       ▼
  实际可执行的项目工程流程
```

**实践关系**:没有 24748-2,团队在 15288 面前会陷入"30 个过程太多、不知道从哪开始"的瘫痪。24748-2 把这 30 个过程**编排成可落地的项目结构**。

### 6.2 与 29110 的关系

已在 §5.5 详述。简单概括:**24748-2 是方法论,29110 是该方法论在极小型组织场景下的预制模板**。

### 6.3 与 CMMI / 15504 的关系

24748-2 和过程能力评估标准的关系是"被评估"而非"评估":

- CMMI / 15504 问:"你的过程能力有多高?"
- 24748-2 提供:"我们用什么生命周期模型、怎么裁剪的、有什么证据"

**在评估场景下**,24748-2 产出的文档(Life Cycle Plan / Tailoring Record / Conformance Claim)正好是评估官需要看到的证据。

### 6.4 与敏捷方法(Scrum/Kanban)的关系

24748-2:2024 版明确接纳敏捷方法为**生命周期模型的一类**。这是对早期"敏捷反标准"误解的正式澄清。

**具体接纳方式**:
- Scrum Sprint = 24748-2 的高频 Stage(每 Sprint 是一个完整的 Stage 循环)
- Kanban = 24748-2 的"连续 Stage"(消除 Stage 边界,纯粹按工作流拉动)
- XP 实践(结对编程、TDD、持续集成) = Activity 级裁剪(Adaptation)

**关键澄清**:敏捷不绕过 15288 过程,它只是用**不同的方式**执行这些过程。24748-2 的价值是让敏捷团队也能写出符合性声明,通过合规审计。

### 6.5 与 42010(架构描述)的关系

24748-2 与 ISO/IEC/IEEE 42010(架构描述)交汇在**架构阶段**:
- 24748-2 说明架构过程**何时发生、产生什么**
- 42010 说明架构**如何描述**

在 Quantalithos 的 architecture/ 目录里,这两份标准是互补的 —— 24748-2 驱动"什么时候画架构图",42010 驱动"架构图怎么画"。

---

## 第七阶段(总结):24748-2 的独特定位

### 7.1 24748-2 回答了什么问题

24748-2 回答了三个其他标准不回答的问题:

1. **"我有这么多过程标准,怎么落地?"** — 给出七步法 + 裁剪机制
2. **"我要用敏捷,还能声明符合 15288 吗?"** — 给出 Tailored Conformance 路径
3. **"我怎么证明裁剪决策是合理的?"** — 给出 Tailoring Record 标准格式 + 证据追溯要求

### 7.2 24748-2 不回答什么

- 不回答"用什么工具"(工具由 CMMI PA、SPEM、具体敏捷框架回答)
- 不回答"团队日常怎么跑"(执行层由 Scrum、Kanban 回答)
- 不回答"过程做得多好"(评估层由 CMMI、15504 回答)
- 不回答"代码怎么写"(实现层由具体工程实践回答)

### 7.3 24748-2 对 Quantalithos 的根本意义

**一句话总结**:24748-2 为 Quantalithos 提供了"让过程标准真正可落地"的方法论桥梁。

**具体意义**:

1. **Gate 的一等对象化有了方法论来源** — 24748-2 的 Decision Gate 概念是 Quantalithos 治理域 Gate 聚合根的直接前身
2. **Tailoring 机制的合法性** — 24748-2 为 Quantalithos 的 Profile / tool_scope / policy_overrides 三层裁剪机制提供了国际标准依据
3. **Conformance Claim 的工程化** — ArchiveBundle 里的 ComplianceDeclaration 不是我们发明的格式,而是 24748-2 规定的最小元素集
4. **可追溯红线的方法论依据** — 24748-2 的"每步决策可追溯"原则,是三条横切红线中"可追溯性"红线的直接来源
5. **8 种生命周期模型直接入库** — 方法库的初始 ProcessTemplate 家族就是 24748-2 的 8 种参考模型

---

## 附录:本文档的使用方式

### 查表场景

- 查 24748-2 对象定义:看 §2.2 主干对象字典表
- 查 Quantalithos 映射:看 §2.4 对象与 Quantalithos 六域的映射
- 查 8 种生命周期模型:看 §4
- 查裁剪机制:看 §5.2
- 查符合性声明格式:看 §5.3 和 §5.4

### 写 ADR 时的引用模式

```
## 标准对齐
- 本 ADR 引入的 XXX 机制,对应 ISO/IEC/IEEE 24748-2:2024 §N.N
- 裁剪决策记录遵循本文 §5.3 的 Tailoring Record 格式
- 本决策的符合性类型:Tailored Conformance
```

### 设计文档末尾"标准对齐"一节的模板

```markdown
## 标准对齐(24748-2)
- 生命周期模型选择:[模型名],理由见 §X.X
- 应用过程:[清单]
- 裁剪决策:[Tailoring Record 引用]
- 符合性声明:[Full / Tailored],证据见 [path]
```

---

## 参考资料

本文基于的原文:

- `references/pdfs/24748-2-2024.pdf` — **主要参考**,2024 年版
- `references/pdfs/24748-2-2012.pdf` — 2012 年旧版,对照理解演进

建议阅读顺序:

1. 先读 24748-2:2024 的 Foreword 和 Introduction,理解定位
2. 读第 4 章(术语),配合本文 §0.2 和 §0.3 辨析术语
3. 读第 5 章(概念框架),配合本文 §1 和 §2
4. 读第 6 章(应用指南),配合本文 §3 和 §4
5. 读第 7 章(符合性),配合本文 §5
6. 最后读附录,特别是 Annex A(生命周期模型目录)

### 配套标准的入口

- `methodology/standards-discussion/IEEE-12207.md` — 12207 讨论
- `methodology/standards-discussion/ISO-IEC-IEEE-15288.md` — 15288 讨论
- `methodology/standards-discussion/ISO-IEC-29110.md` — 29110 讨论
- `methodology/standards-discussion/SPEM-2.0.md` — SPEM 讨论

### 本文在 Quantalithos 设计中的引用位置

- `product/六域模型.md` — 六域设计引用 §2.4 的对象映射
- `architecture/仓库拆分方案.md` — method-library 仓设计引用 §4 的 8 种模型
- `standards/产品遵循规范清单.md` — 裁剪规范引用 §5
