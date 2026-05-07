# Scrum：讨论与对象抽象

> 本文的目标不是把 `Scrum Guide` 逐句翻译，也不是把一组会议日历抄成所谓“敏捷流程”。
>
> 当前先做三件事：
> 1. **先把 Scrum 的概念地基打牢**——知道它到底在定义什么、不在定义什么
> 2. **再把 Scrum 理解为一个分层对象系统**——像 `BPMN 2.0`、`ISO/IEC 29110`、`ISO 9001` 那样，先看清它是如何用对象、关系、节奏和承诺组织协作的
> 3. **最后把这些对象放回工程现场**——理解它如何进入产品规划、研发协作、反馈闭环和持续改进
>
> 你可以先把 `Scrum` 理解成：**一套面向复杂问题的轻量级经验主义协作框架。它不试图预先规定全部步骤，而是通过固定节奏、明确责任主体、可检视的工件和持续适应机制，让团队在不确定环境中持续地产生价值。**
>
> 本文主要参考以下官方材料：
>
> - `2020 Scrum Guide (English)` — `https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf`
> - `2020 Scrum Guide (Chinese Simplified)` — `https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-Chinese-Simplified.pdf`
> - `Scrum Guide HTML` — `https://scrumguides.org/scrum-guide.html`
> - `Scrum Guide FAQ` — `https://scrumguides.org/faq.html`
>
> 扩展参考材料包括：
>
> - `Evidence-Based Management Guide` — 用于理解 Scrum 与价值度量的连接
> - `Scrum with Kanban` — 用于理解 Scrum 与流动管理的结合
> - `Scaling Scrum / Nexus` — 用于理解多团队扩展
>
> 需要特别强调：**Scrum 的标准本体是 `Scrum Guide`；其他材料是扩展解释或配套实践，不应与标准正文混为一谈。**

---

## 学习阶段总览

当前这份讨论与抽象文档，按 22 个阶段展开：

0. **第零阶段：概念地基**
   - 把 `Complex Problem`、`Value`、`Product Goal`、`Sprint Goal`、`Increment`、`Definition of Done`、`Empiricism`、`Self-managing` 等核心概念逐个讲清楚
   - 把最容易混淆的概念做对照辨析
   - 确保后续阅读不因术语含混而偏移
1. **第一阶段：整体架构——把 Scrum 看成一个分层系统**
   - 回答 Scrum 到底是什么
   - 建立“它是协作框架，不是技术实践大全”的基本认识
   - 用 `BPMN` 同款“分层系统”视角先看全景
2. **第二阶段：对象系统主干——Scrum 到底由哪些对象构成**
   - 理解 `Product -> Product Goal -> Product Backlog -> Sprint -> Increment` 的主干关系
   - 理解 `Scrum Team`、`Stakeholder`、`Accountability`、`Event`、`Artifact` 之间如何耦合
3. **第三阶段：Sprint——为什么它是整个框架的容器**
   - 理解为什么 `Sprint` 不是普通迭代时间盒，而是 Scrum 的节奏心跳
   - 理解为什么其他事件都被放进 Sprint 容器中
4. **第四阶段：责任主体系统——PO / SM / Developers 到底怎么分工**
   - 理解为什么 `2020 Scrum Guide` 更强调 `Accountability`
   - 理解三类责任主体如何围绕价值、效能和交付协同
5. **第五阶段：事件系统——Scrum 如何形成经验闭环**
   - 理解 `Sprint Planning`、`Daily Scrum`、`Sprint Review`、`Sprint Retrospective`
   - 理解为什么这些事件不是“会议清单”，而是 inspect / adapt 的控制点
6. **第六阶段：工件与承诺系统——对象如何让经验主义可见**
   - 理解 `Product Backlog`、`Sprint Backlog`、`Increment`
   - 理解 `Product Goal`、`Sprint Goal`、`Definition of Done` 为什么是工件承诺（Commitment）
7. **第七阶段：理论系统——Scrum 的底层工作方式是什么**
   - 理解 `Empiricism`、`Lean Thinking`、`Transparency`、`Inspection`、`Adaptation`
8. **第八阶段：价值观系统——为什么 Scrum 不是纯机械流程**
   - 理解 `Commitment / Focus / Openness / Respect / Courage`
   - 理解为什么价值观不是附录，而是实践前提
9. **第九阶段：边界——Scrum 为什么“故意不完整”**
   - 理解 Scrum 定义什么、刻意不定义什么
   - 理解为什么它必须与工程实践、交付实践配合
10. **第十阶段：关系——Scrum 与 Kanban / XP / DevOps / BPMN / 12207 / 15288 的边界**
    - 理解它们的关注点差异与组合方式
11. **第十一阶段：对象不是替代关系，而是不同关注点**
    - 理解为什么 `Product Goal` 不能替代 `Sprint Goal`
    - 为什么 `Review` 不能替代 `Retrospective`
    - 为什么 `Increment` 不能替代 `Release`
12. **第十二阶段：对象之间的层次感**
    - 建立“价值层 -> 协作层 -> 节奏层 -> 可见性层 -> 质量层”的层次结构
13. **第十三阶段：Scrum 在工程中的典型使用方式**
   - 理解在互联网产品、企业内部系统、合规行业、维护型团队中的不同落地方式
14. **第十四阶段：学习顺序与记忆框架**
   - 用最小结构把 Scrum 压缩成一个适合记忆的系统
15. **第十五阶段：对象字典与关系矩阵**
   - 把核心对象逐个定型
   - 用矩阵把控制关系、责任关系和检视关系压平
16. **第十六阶段：一次 Sprint 中，对象如何流转**
   - 把前面的抽象对象重新放回真实工作链条中，形成工程直觉
17. **第十七阶段：把五个事件拆成控制网络**
   - 分别看每个事件的输入、输出、检视点和适应作用
   - 理解为什么 Scrum 事件不是会议清单，而是一组控制节点
18. **第十八阶段：工件的细粒度对象边界**
   - 把 `PBI`、`Ordering`、`Forecast`、`Multiple Increments`、`DoD` 这些高频混淆点压实
19. **第十九阶段：Scrum Team 的组织边界与规模问题**
   - 理解小团队、跨职能、自管理、单产品多团队这些组织性约束
20. **第二十阶段：常见失真模式——看起来像 Scrum，实际上不是**
   - 用失真模式反推哪些对象和关系一旦丢失，Scrum 就会空转
21. **第二十一阶段：按 Scrum Guide 正文逐段对象化**
   - 按 `Purpose / Definition / Theory / Values / Team / Events / Artifacts` 的官方顺序逐段解剖
   - 把每一段映射成对象、关系、约束、边界和误读警告


---

## 第零阶段：概念地基

> 在进入结构和对象细节之前，先把 Scrum 里最核心的术语逐个讲清楚。
>
> 这样做的理由很简单：**如果术语含混，后面的理解一定会偏移。**
>
> 这一阶段不要求你背下全部条文，但要求你在遇到这些词时，不再凭直觉猜。

---

### 0.1 Scrum 的六层对象关系图

Scrum 不是一张“敏捷会议表”，也不是一句“快速迭代”的口号，而是一个由价值目标、团队责任、节奏控制、工作可见性、质量边界和外部反馈共同构成的六层对象体系：

```text
┌─────────────────────────────────────────────────────────────────────┐
│                      Scrum 的六层对象体系                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  第一层：价值与问题对象                                              │
│  ───────────────────────────────────────────────                    │
│  Complex Problem          —— 复杂问题                               │
│  Product                  —— 承载价值的产品                         │
│  Value                    —— 团队持续创造的结果                     │
│  Product Goal             —— 产品未来状态                           │
│                                                                     │
│  第二层：团队与责任对象                                              │
│  ───────────────────────────────────────────────                    │
│  Scrum Team               —— 基本协作单元                           │
│  Product Owner            —— 价值最大化责任主体                     │
│  Scrum Master             —— 框架建立与团队效能责任主体             │
│  Developers               —— 增量创建责任主体                       │
│  Stakeholders             —— 检视结果并提供反馈的外部相关方         │
│                                                                     │
│  第三层：节奏与控制对象                                              │
│  ───────────────────────────────────────────────                    │
│  Sprint                   —— 承载一切节奏的容器                     │
│  Sprint Planning          —— 确定本轮目标与做法                     │
│  Daily Scrum              —— 日常检视与调整                         │
│  Sprint Review            —— 检视结果与外部反馈                     │
│  Sprint Retrospective     —— 反思协作方式并改进                     │
│  Refinement               —— 持续细化产品待办事项                   │
│                                                                     │
│  第四层：工作可见性对象                                              │
│  ───────────────────────────────────────────────                    │
│  Product Backlog          —— 全局待做事项的有序列表                 │
│  Product Backlog Item     —— 可被选择和细化的工作项                 │
│  Sprint Backlog           —— 当前 Sprint 的工作视图                 │
│  Increment                —— 已完成、可用、可检视的结果             │
│                                                                     │
│  第五层：承诺与质量对象                                              │
│  ───────────────────────────────────────────────                    │
│  Product Goal             —— Product Backlog 的承诺                 │
│  Sprint Goal              —— Sprint Backlog 的承诺                  │
│  Definition of Done       —— Increment 的承诺                       │
│  Transparency             —— 经验主义的可见前提                     │
│                                                                     │
│  第六层：反馈与扩展对象                                              │
│  ───────────────────────────────────────────────                    │
│  Inspection / Adaptation  —— 检视与适应                             │
│  Lean Thinking            —— 减少浪费、聚焦本质                     │
│  XP / DevOps / Kanban     —— 与 Scrum 组合的工程与流动实践          │
│  EBM / Nexus              —— 价值度量与多团队扩展                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

这张图的意义在于：

- Scrum 不只是“谁开哪些会”，而是一个从**价值目标 -> 协作责任 -> 节奏控制 -> 工作可见 -> 质量边界 -> 反馈适应**的完整闭环
- 每一层回答不同的问题：为什么做、谁负责、何时检视、用什么可见、怎样算完成、如何继续调整
- 只有先看清这个整体，后面学习 `Sprint Goal`、`Definition of Done` 或 `Retrospective` 时，才知道自己在理解哪一层
- **Scrum 的关键不是“快”，而是“在复杂环境中，用可见的工作与固定节奏持续校正方向”**

---

### 0.2 核心概念清单

下面把 Scrum 最重要的术语，按六层分组，逐个讲清楚。

#### 第一组：价值与问题

**Complex Problem——Scrum 服务的问题类型**

Scrum 不是为“步骤早已确定、变化很小”的工作设计的。它更适合下面这种情形：

- 需求会变化
- 解法并不一开始就完全清楚
- 做着做着才知道什么更有价值
- 团队需要边做边学

也就是说，Scrum 首先假设：**问题是复杂的，不能靠一次性规划彻底消除不确定性。**

**Product——价值承载体**

Scrum 的中心不是项目计划书，而是 `Product`。

它可以是：

- 软件产品
- 平台能力
- 数据服务
- 内部系统
- 任何需要持续演进并承载价值的东西

也就是说，Scrum 不是围绕“交一批任务”组织，而是围绕“持续改进一个产品”组织。

**Value——Scrum 最终追求的结果**

Scrum Guide 的核心词之一就是 `value`。

这意味着团队不是为了完成工时、文档数量或燃尽图好看而工作，而是为了：

- 让产品更有用
- 让用户或业务获得更好的结果
- 让团队更快判断什么值得继续投入

**Product Goal——产品级方向承诺**

`Product Goal` 不是一个模糊愿景口号，而是：

- 产品未来要达到的目标状态
- Product Backlog 排序的长期参照点
- 多个 Sprint 共享的方向约束

可以先记住一句话：

> `Product Goal` 决定“为什么做这批长期工作”。

#### 第二组：团队与责任

**Scrum Team——Scrum 的基本协作单元**

Scrum Team 由：

- `1` 个 `Product Owner`
- `1` 个 `Scrum Master`
- `Developers`

组成。

它的关键不是职位组合，而是：

- 围绕同一个产品目标协作
- 自管理
- 跨职能
- 对每个 Sprint 产生有价值的 Increment 共同负责

**Accountability——责任主体，而不是部门头衔**

`2020 Scrum Guide` 更强调 `Accountability`，这很重要。

这表示 Scrum 更关心：

- 哪类责任必须有人真正承担
- 哪些关键结果必须有人对外说得清
- 框架中的责任边界如何清晰

而不是只关心名片上的职位名称。

**Stakeholder——反馈与约束的外部来源**

Stakeholder 不是 Scrum Team 成员，但对产品价值判断很重要。

它们可能是：

- 用户
- 客户
- 业务方
- 运营方
- 管理层
- 合规与支持团队

Scrum 不是把团队封闭起来，而是通过 `Sprint Review` 把外部反馈引回产品方向。

#### 第三组：节奏与事件

**Sprint——Scrum 的节奏心跳**

`Sprint` 是 Scrum 里最重要的容器对象。

它不是“可有可无的一轮迭代”，而是：

- 一切事件发生的边界
- 一切工作被检视和适应的周期
- 让复杂工作变得可观察、可调整的时间盒

**Sprint Planning——进入本轮工作前的对齐点**

它至少解决三件事：

- 这轮 Sprint 为什么有价值
- 这轮 Sprint 做什么
- 这些工作怎么推进

**Daily Scrum——每天对 Sprint Goal 的局部修正**

Daily Scrum 不是汇报会，不是状态念稿，而是：

- 检视 Sprint Goal 进展
- 调整当天和接下来几天的工作计划
- 保持团队对当前路径有共同理解

**Sprint Review——对“产品结果”的外部检视**

Review 的重点不是团队内部复盘，而是：

- 检视 Increment
- 讨论市场、业务、用户、环境变化
- 调整 Product Backlog 和后续方向

**Sprint Retrospective——对“协作方式”的内部改进**

Retrospective 的重点不是产品结果本身，而是：

- 团队怎么合作
- 哪些方式有效，哪些方式拖慢了价值交付
- 下一轮如何提升质量和效能

#### 第四组：工件与工作可见性

**Product Backlog——产品级工作全景**

它是：

- 一个有序列表
- 一个持续演化的对象
- 所有产品改进需求的入口

它不是一次性冻结的范围清单。

**Product Backlog Item——可被细化和选择的工作单元**

PBI 可以表现为：

- 功能需求
- 技术改进
- 缺陷修复
- 架构调整
- 运维改造
- 实验项

Scrum Guide 不强制它长成“用户故事”格式，这一点很重要。

**Sprint Backlog——当前 Sprint 的工作视图**

它不仅包括：

- 选中的 Product Backlog Items

还包括：

- `Sprint Goal`
- 为交付 Increment 而制定的可执行计划

也就是说，Sprint Backlog 不是简单的任务堆，而是当前 Sprint 的工作模型。

**Increment——完成且可用的结果**

Increment 是 Scrum 对“工作真的做成了什么”的回答。

它强调：

- 可用
- 可检视
- 累积到产品上
- 满足 `Definition of Done`

#### 第五组：承诺与质量

**Product Goal——工件承诺之一**

它约束 `Product Backlog` 不至于沦为散乱愿望池。

**Sprint Goal——工件承诺之二**

它约束 `Sprint Backlog` 不至于沦为一组互不相关的票据。

**Definition of Done——工件承诺之三**

它约束 `Increment` 不至于沦为“看起来差不多完成”的主观判断。

也就是说，这三个承诺分别回答：

- 长期方向是什么
- 当前 Sprint 的价值焦点是什么
- 什么叫真的完成

#### 第六组：理论与边界

**Empiricism——经验主义**

Scrum 的核心逻辑不是“先把计划做得绝对完美”，而是：

- 让真实情况尽可能可见
- 经常检视
- 及时适应

**Lean Thinking——精益思维**

Lean 在这里不是一个独立框架名词，而是一种约束：

- 减少浪费
- 聚焦最有价值的事情
- 不把非必要复杂性当成专业度

**Intentionally Incomplete——故意不完整**

Scrum 故意不去规定：

- 详细需求写法
- 代码实践细则
- 测试工具栈
- 发布流水线
- 组织层级设计

这是它的边界，不是它的缺陷。

---

### 0.3 最容易混淆的 12 组概念辨析

#### 0.3.1 Role vs Accountability

很多团队把 Scrum 角色理解成岗位名称，但更准确的理解是：Scrum 在定义责任主体边界，而不是强制规定 HR 职级体系。

#### 0.3.2 Sprint vs Project Phase

Sprint 不是项目阶段切片，不是“需求阶段 / 开发阶段 / 测试阶段”的时间版排列。它是一个完整的 inspect / adapt 容器。

#### 0.3.3 Sprint Goal vs Task List

Sprint Goal 是本轮 Sprint 的价值焦点；任务列表只是达到这个焦点的局部手段。

#### 0.3.4 Product Goal vs Product Backlog

Product Goal 是方向；Product Backlog 是围绕该方向不断演化的工作列表。前者约束后者，后者承载前者。

#### 0.3.5 Product Backlog Item vs User Story

User Story 只是常见写法之一，Scrum Guide 并没有要求所有 PBI 都必须写成用户故事格式。

#### 0.3.6 Increment vs Release

Increment 是满足 Done 的可用结果；Release 是是否向外部发布的业务决定。不是每个 Increment 都必须立即发布，但每个 Increment 都必须可用。

#### 0.3.7 Definition of Done vs Acceptance Criteria

`Definition of Done` 是团队级、增量级的完成标准；`Acceptance Criteria` 通常是单个条目的验收条件。两者作用层级不同。

#### 0.3.8 Daily Scrum vs Status Report

Daily Scrum 是 Developers 用来调整自己计划的事件，不是向管理者逐一汇报昨天做了什么的仪式。

#### 0.3.9 Sprint Review vs Sprint Retrospective

Review 检视的是产品结果与未来方向；Retrospective 检视的是团队协作方式与工作过程。

#### 0.3.10 Self-managing vs No Constraints

自管理不是没有约束，而是在清晰目标和边界内，由团队自己决定谁在何时以何种方式完成工作。

#### 0.3.11 Scrum Master vs Project Manager

Scrum Master 不是传统项目经理的简单别名。它更关注框架建立、障碍清除、团队效能和组织层面的 Scrum 采用。

#### 0.3.12 Refinement vs Sprint Planning

Refinement 是持续发生的 Product Backlog 细化活动；Sprint Planning 是正式进入一个 Sprint 前，对本轮目标和计划的集中形成。

---

### 0.4 第零阶段最值得背下来的 6 句话

1. Scrum 面向的是**复杂问题**，不是完全可预先规划的问题。
2. Scrum 的中心对象是 `Product` 和 `Value`，不是会议日程表。
3. `Sprint` 是心跳容器，其他事件都围绕它形成 inspect / adapt 节奏。
4. Scrum 通过 `Artifact + Commitment` 让工作变得可见、可检视、可适应。
5. Scrum 只定义最小必要协作结构，**故意不完整**。
6. Scrum 要想工程上真正跑起来，通常必须与 `XP`、`DevOps`、`Kanban` 等实践组合。

---

### 0.5 第零阶段最容易犯的 6 个错误

#### 误解 1：把 Scrum 当成“开会框架”

如果只看到 Planning、Daily、Review、Retro，而没看到 Product Goal、Increment、DoD、Value，就会把 Scrum 学成日历管理。

#### 误解 2：把 Sprint 学成“小瀑布”

如果一个 Sprint 内再拆成“先需求、再开发、再测试”，而直到最后才出现可用结果，那么其实没有学到 Scrum 的核心。

#### 误解 3：把 Product Owner 学成“需求收集员”

PO 的核心不是抄需求，而是最大化产品价值，并为 Product Backlog 提供方向与排序。

#### 误解 4：把 Scrum Master 学成“站会主持人”

如果 Scrum Master 的工作只剩催会和记纪要，那基本等于把这个对象抽空了。

#### 误解 5：把 Done 学成“开发自认差不多”

如果没有清晰的完成定义，Increment 就失去共同质量边界，Transparency 也会失效。

#### 误解 6：认为“用了 Jira 看板 + 两周迭代”就等于 Scrum

工具和节奏可以模仿，但如果目标、责任、工件、反馈和适应机制没有建立，Scrum 仍然没有真正成立。

---

### 0.6 第零阶段过关标准

如果你已经能稳定回答下面这些问题，说明概念地基基本过关：

- Scrum 面向什么类型的问题？
- Scrum 的中心对象是任务还是产品？
- Sprint Goal 和 Product Goal 的边界是什么？
- Increment 和 Release 有什么区别？
- Review 和 Retrospective 分别在检视什么？
- Scrum 为什么说自己“故意不完整”？

---

## 第一阶段：把 Scrum 看成一个分层系统

### 1.1 第一层：Scrum 到底在表达什么

如果把 BPMN 理解成“流程如何表达”，把 12207 理解成“生命周期有哪些过程”，那么 Scrum 更接近于：

> 在复杂问题下，一个小型跨职能团队如何以固定节奏持续生成价值，并不断修正方向。

它关心的不是：

- 所有生命周期过程该怎样完整列出
- 文档模板该长什么样
- 架构设计必须遵循什么技术规范

它关心的是：

- 团队围绕什么长期目标工作
- 在一个 Sprint 中如何形成共同方向
- 如何让结果变得可见
- 如何让反馈尽快回流
- 如何让团队不断适应

换句话说，Scrum 首先表达的是：

- **价值导向**
- **短周期经验闭环**
- **团队级自管理协作**
- **基于真实结果而非静态计划的持续修正**

### 1.2 第二层：Scrum 用什么来表达这些内容

Scrum 不是靠一张大流程图来表达，而是靠下面四类对象联合表达：

```text
Scrum 的表达组件分工

价值方向层
  ├─ Product / Product Goal
  │    表达：长期为什么做、往哪里去
  │
责任协作层
  ├─ Scrum Team / Accountabilities
  │    表达：谁对价值、效能、增量负责
  │
节奏控制层
  ├─ Sprint / Events
  │    表达：何时集中检视、何时形成调整
  │
可见性与质量层
  └─ Artifacts / Commitments
       表达：工作是什么、当前承诺是什么、什么算完成
```

也就是说，Scrum 并不是“先有流程、再有角色”，而是让：

- 目标
- 团队
- 节奏
- 工件

一起构成协作系统。

### 1.3 第三层：Scrum 为什么不只是“例会机制”

很多人第一次接触 Scrum，会把它理解成“几个固定会议 + 一个迭代周期”。这种理解只抓住了表面。

Scrum 至少同时包含下面五个层面：

- `Value Model` —— 围绕产品价值组织工作
- `Accountability Model` —— 用清晰责任主体组织协作
- `Cadence Model` —— 用固定节奏组织检视与适应
- `Artifact Model` —— 用工件让工作和结果透明
- `Quality Model` —— 用 DoD 维护增量的一致完成边界

所以它不只是“会议机制”，而是一个**控制复杂工作的方法结构**。

### 1.4 第四层：Scrum 最终想怎么落地

Scrum 的落地目标不是让团队“看起来敏捷”，而是让团队具备下面这些能力：

- 能持续形成可用 Increment
- 能尽快暴露方向错误和执行阻塞
- 能围绕真实结果而不是幻觉计划调整 Product Backlog
- 能让外部反馈进入产品演化
- 能让团队自己的协作方式持续改善

因此，Scrum 的终点不是“合规地执行仪式”，而是：

> 团队在复杂环境中，持续地产生价值，并且持续变得更会产生价值。

---

## 第二阶段：对象系统主干——Scrum 到底由哪些对象构成

### 2.1 先用一张总图看对象关系

```text
Complex Problem
      │
      v
   Product
      │
      v
Product Goal
      │  约束长期方向
      v
Product Backlog -----------------------------┐
      │                                      │
      │  在 Sprint Planning 中选择            │
      v                                      │
   Sprint -----------------------------------┤
      │                                      │
      ├─ Sprint Goal                         │
      ├─ Sprint Backlog                      │
      ├─ Daily Scrum                         │
      ├─ Sprint Review ----------------------┤--> 调整 Product Backlog / 方向
      └─ Sprint Retrospective                │
      │                                      │
      v                                      │
  Increment ---------------------------------┘
      │
      └─ 满足 Definition of Done

Scrum Team
  ├─ Product Owner     -> 对 Product Backlog 与价值负责
  ├─ Developers        -> 对 Sprint Backlog 与 Increment 负责
  └─ Scrum Master      -> 对 Scrum 建立与团队效能负责
```

这张图里最重要的是三条主轴：

- **价值主轴**：`Product Goal -> Product Backlog -> Increment`
- **节奏主轴**：`Sprint -> Events -> Adaptation`
- **责任主轴**：`PO / Developers / SM`

### 2.2 价值主轴：Product / Goal / Backlog / Increment

Scrum 的价值主轴可以先压缩成一句话：

> 团队围绕一个产品目标，从待办列表中持续选择工作，在每个 Sprint 中产出可用增量，并依据结果继续调整方向。

这条主轴的稳定顺序是：

1. 先有 `Product` 作为价值载体
2. 再有 `Product Goal` 作为长期方向承诺
3. 再有 `Product Backlog` 作为围绕该方向组织的全局工作列表
4. 再有 `Increment` 作为一步步逼近目标的可用结果

如果没有这条主轴，Scrum 很容易退化成：

- 只在追票据完成率
- 只在追燃尽图好看
- 只在追迭代是否准时结束

### 2.3 责任主轴：PO / Developers / Scrum Master

这三类责任主体不是三层管理链，而是三种不同关注点：

- `Product Owner` 关注价值方向与工作排序
- `Developers` 关注把选中的工作变成满足 Done 的 Increment
- `Scrum Master` 关注 Scrum 是否被正确建立、团队是否更有效

这意味着 Scrum Team 内部的关键分工不是：

- 谁当领导
- 谁审批谁
- 谁给谁排班

而是：

- 谁守住价值
- 谁守住增量
- 谁守住框架与效能

### 2.4 节奏主轴：Sprint 与四个正式事件

严格按照 `2020 Scrum Guide` 的表述：

- `Sprint` 是 containing event（容器事件）
- 其中有四个 formal events（正式事件）

日常口语里常说“五个事件”，这样记没问题，但更精确的理解是：

> 一个 Sprint 容器中，嵌入四个正式 inspect / adapt 事件。

这个设计的重点在于：

- 不把检视和调整交给临时运气
- 不等大周期结束后才发现方向错了
- 把反馈变成结构，而不是偶然发生

### 2.5 可见性主轴：Artifacts 与 Commitments

Scrum 的三大工件是：

- `Product Backlog`
- `Sprint Backlog`
- `Increment`

它们各自附带一个承诺：

- `Product Backlog -> Product Goal`
- `Sprint Backlog -> Sprint Goal`
- `Increment -> Definition of Done`

这说明 Scrum 的对象系统不是“工件孤立摆放”，而是：

- 每个工件都对应一个解释它、约束它、让它可被检视的承诺对象

### 2.6 外部接口：Stakeholder 与 Organization

Scrum Team 不是孤岛。

它的外部接口至少包括：

- `Stakeholders` —— 提供反馈、需求压力、业务约束
- `Organization` —— 提供结构、授权、资源、环境边界

这意味着 Scrum 的有效性不仅取决于团队内部，还取决于：

- 组织是否尊重 Product Owner 的决策
- 是否允许团队自管理
- 是否允许真实问题暴露
- 是否把 Review 当成工作会话而不是表演会

---

## 第三阶段：Sprint——为什么它是整个框架的容器

### 3.1 为什么说 Sprint 是 Scrum 的心跳

Scrum Guide 直接说：`Sprints are the heartbeat of Scrum`。

这句话非常关键，因为它说明：

- Scrum 的节奏不是靠项目经理临时安排会议形成的
- Scrum 的节奏不是靠里程碑偶然驱动的
- Scrum 的节奏是由固定长度的 Sprint 周期主动制造出来的

Sprint 的作用是把复杂工作切成连续的学习循环：

- 计划
- 执行
- 检视
- 适应
- 继续下一轮

### 3.2 为什么 Sprint 不只是“时间盒”

很多团队把 Sprint 学成“两周时间盒”。这只说对了一半。

更准确地说，Sprint 同时是：

- 时间边界
- 目标边界
- 检视边界
- 风险暴露边界
- 学习循环边界

也就是说，Sprint 不是单纯让工作切片，而是让：

- 风险更早暴露
- 价值更早验证
- 计划更早修正

### 3.3 Sprint 内部有什么稳定约束

Scrum Guide 对 Sprint 给出了几个关键约束：

- 不做会危及 `Sprint Goal` 的变更
- 质量不能下降
- `Product Backlog` 可以在需要时细化
- 随着学习加深，可以与 PO 澄清或重新协商范围

这一组约束说明 Sprint 既不是：

- 完全刚性冻结范围

也不是：

- 任意变动、想到哪做哪

而是：

> 允许在守住目标和质量的前提下，基于学习对工作进行调整。

### 3.4 为什么 Sprint 可以被视为短项目，但又不是“小瀑布”

Scrum Guide 说每个 Sprint may be considered a short project。

这句话容易被误用。

正确理解应该是：

- Sprint 有清晰目标
- Sprint 有工作选择
- Sprint 有结果检视
- Sprint 有结束和下一轮开始

所以它具有“项目化闭环”的特征。

但它不是“小瀑布”，因为：

- 它不鼓励把需求、开发、测试顺序串成分段接力
- 它要求在 Sprint 内形成可用 Increment
- 它要求反馈在周期内外快速回流

### 3.5 为什么 Sprint 可取消，但取消权不属于任何人

Scrum Guide 明确说：只有 `Product Owner` 有权取消 Sprint。

这背后的抽象含义是：

- Sprint 取消不是项目层面的随意行政动作
- 取消的判断前提是 `Sprint Goal` 失效
- 方向对象的守门人是 `Product Owner`

这再次说明：Scrum 的控制点设计，与责任主体设计是绑定的。

---

## 第四阶段：责任主体系统——PO / SM / Developers 到底怎么分工

### 4.1 为什么 2020 版更强调 Accountability

如果只用“角色”理解 Scrum，容易把它学成组织架构图。

而 `Accountability` 更强调：

- 哪类关键结果必须有人负责到底
- 哪类边界不能模糊
- 哪类问题不能互相甩锅

因此可以把 Scrum 的三类责任主体先理解成：

- 价值责任主体：`Product Owner`
- 增量责任主体：`Developers`
- 框架与效能责任主体：`Scrum Master`

### 4.2 Developers：不是岗位集合，而是增量创建责任主体

`Developers` 这个词在 Scrum 中并不只是写代码的人。

它更准确的含义是：

- 在 Scrum Team 中，任何对创建可用 Increment 负责的人

因此在不同领域里，Developers 可能包括：

- 开发工程师
- 测试工程师
- 设计师
- 数据工程师
- 运维工程师
- 研究人员

只要他们共同对 Increment 负责，就属于 Developers 这个对象。

Scrum Guide 给 Developers 的关键责任包括：

- 制定 Sprint 计划，形成 Sprint Backlog
- 遵守 Definition of Done 以植入质量
- 每天根据 Sprint Goal 调整计划
- 作为专业人士相互负责

### 4.3 Product Owner：不是需求秘书，而是价值最大化责任主体

PO 的核心不是接需求、写故事、开评审单，而是：

- 最大化产品价值
- 管理 Product Backlog 的有效性
- 明确并沟通 Product Goal
- 创建并清晰表达 Product Backlog Items
- 对 Product Backlog 进行排序
- 确保 Product Backlog 透明、可见、可理解

这意味着 PO 负责的是：

- 方向
- 顺序
- 价值判断

而不是只负责“收需求”。

### 4.4 Scrum Master：不是会议主持人，而是 Scrum 建立与团队效能责任主体

Scrum Master 的核心责任有两层：

- 建立 Scrum as defined in the Scrum Guide
- 提升 Scrum Team 的 effectiveness

它服务的对象有三类：

- 服务团队：帮助自管理、跨职能、清除障碍、确保事件有效
- 服务 PO：帮助建立目标、管理 Backlog、促进利益相关方协作
- 服务组织：推动理解 Scrum、支持采用、拆除组织障碍

这意味着 Scrum Master 不只是团队内勤，而是：

> 连接框架、团队和组织环境的关键对象。

### 4.5 为什么 Scrum Team 不允许子团队与等级链条成为主轴

Scrum Guide 明确说：Scrum Team 内没有 sub-teams or hierarchies。

它想避免的是：

- 分工被做成串行部门接力
- 团队在 Sprint 内互相等待审批
- 某些人只对局部任务负责，没人对整体 Increment 负责

这并不是说团队里不能有资深成员、专业差异，而是说：

- 标准不希望把这些差异组织成破坏共同责任的结构

### 4.6 那项目经理、架构师、测试负责人放哪

Scrum Guide 没有禁止这些岗位存在，但它不把这些岗位当成 Scrum 的基本对象。

也就是说：

- 组织里可以有这些岗位
- 但在 Scrum 抽象层里，关键是他们承担的责任是否被映射到 `PO`、`SM`、`Developers` 的边界里

这是对象抽象时非常重要的一条：

> Scrum 定义的是最小协作责任结构，不是组织全部职位目录。

---

## 第五阶段：事件系统——Scrum 如何形成经验闭环

### 5.1 先看五个事件的整体关系

```text
Sprint
├─ Sprint Planning      -> 形成本轮目标与做法
├─ Daily Scrum          -> 每天检视并微调路径
├─ Sprint Review        -> 检视结果并引入外部反馈
└─ Sprint Retrospective -> 检视协作方式并形成改进
```

它们不是孤立会议，而是一条完整链：

- 先定这轮为什么有价值
- 再每天看是否在逼近该价值
- 结束时看结果是否真的有价值
- 再看团队协作方式是否应该调整

### 5.2 Sprint Planning：为什么做、做什么、怎么做

`Sprint Planning` 的三个主题非常重要：

1. `Why is this Sprint valuable?`
2. `What can be Done this Sprint?`
3. `How will the chosen work get done?`

这三个问题分别对应：

- 价值焦点
- 工作范围
- 执行方法

Planning 的输出不是“大家都来过会”这个事实，而是：

- 一个清晰的 `Sprint Goal`
- 一组被选中的 `Product Backlog Items`
- 一份 Developers 可执行的工作计划

### 5.3 Daily Scrum：不是汇报昨天，而是调整今天和接下来

Daily Scrum 的正式目的，是：

- 检视 toward `Sprint Goal` 的进展
- 按需调整 `Sprint Backlog`

它的关键不是固定问三句话，而是：

- 团队有没有共同看到偏差
- 有没有做出工作层调整
- 有没有因为日常不对齐而积累隐藏风险

所以 Daily Scrum 是：

> 面向 Sprint Goal 的日频路径修正点。

### 5.4 Sprint Review：不是成果展示会，而是工作结果检视会

Review 的关键不是“演示完大家鼓掌”，而是：

- 检视 Increment
- 讨论已经发生了什么变化
- 与 Stakeholders 共同思考下一步最值得做什么
- 进一步调整 Product Backlog

它更像：

- 产品方向校准会
- 结果与环境变化对齐会

而不是单纯的演示秀。

### 5.5 Sprint Retrospective：不是情绪宣泄，而是工作方式改造

Retrospective 的重点是：

- 人、互动、过程、工具、Done、质量、协作方式
- 哪些因素帮助了价值交付
- 哪些因素在制造摩擦或返工
- 下一轮可以改什么

因此它关注的是：

- 团队如何工作

而不是：

- 产品是否符合预期

这个对象边界必须和 Review 明确分开。

### 5.6 Sprint 本身为什么也被当成事件对象

虽然 Sprint 是容器，但它本身也是事件对象，因为它有：

- 固定时长
- 清晰起止
- 内含其他事件
- 持续重复发生
- 自己独特的约束和目的

从对象抽象上看，Sprint 不是背景板，而是整个经验主义闭环的上层框架对象。

### 5.7 Backlog Refinement 为什么重要但不算正式事件

这点经常被误解。

`Backlog Refinement`：

- 很重要
- 持续发生
- 直接影响 Sprint Planning 的质量

但 `Scrum Guide` 没把它列为正式事件。

这背后的含义是：

- Scrum 承认它必须发生
- 但不把它 rigidly 形式化为独立官方事件
- 让团队按上下文灵活安排

这正体现了 Scrum“只定义最小必要结构”的风格。

---

## 第六阶段：工件与承诺系统——对象如何让经验主义可见

### 6.1 为什么 Scrum 需要工件

经验主义要成立，前提是：

- 工作可见
- 进展可见
- 完成度可见
- 问题可见

工件的存在，不是为了增加文档负担，而是为了：

> 给检视和适应提供一个大家能共同指向的对象。

### 6.2 Product Backlog：全局工作视图

`Product Backlog` 是：

- 有序的（ordered）
- 演化中的（emergent）
- 面向产品改进的

它不是：

- 冻结范围清单
- 纯需求池
- 只放业务需求的地方

它还可以包含：

- 缺陷
- 技术债
- 重构
- 实验
- 基础设施改进
- 合规工作

#### 6.2.1 Product Goal 为什么是 Product Backlog 的承诺

如果没有 `Product Goal`，Product Backlog 很容易退化成：

- 谁声音大就先做谁
- 所有事情都看起来重要
- 缺少长期方向判断标准

因此 `Product Goal` 的作用是：

- 给 Product Backlog 一个方向坐标系
- 让排序不只是短期响应，而是方向内的权衡

#### 6.2.2 Refinement 为什么是 Product Backlog 的生命活动

Product Backlog 不是天然就清晰的。

它需要不断：

- 拆分
- 澄清
- 重估
- 重排
- 去除过时项

这说明 Product Backlog 不是一个静态仓库，而是一个持续活化的治理对象。

### 6.3 Sprint Backlog：当前 Sprint 的工作模型

Sprint Backlog 包含：

- `Sprint Goal`
- 选中的 Product Backlog Items
- Developers 为交付 Increment 制定的行动计划

这意味着 Sprint Backlog 不只是任务清单，而是：

- 本轮工作的最小执行模型
- 团队对当前路径的共享视图

#### 6.3.1 Sprint Goal 为什么是 Sprint Backlog 的承诺

如果 Sprint Backlog 只有一堆条目，没有 `Sprint Goal`，就很容易变成：

- 零散任务拼盘
- 一组不共享同一价值意图的工作
- 只追求“做完多少”，而不追求“这一轮为什么值得”

所以 Sprint Goal 的作用是：

- 让本轮工作形成一个价值焦点
- 允许团队在保住目标的情况下灵活调整范围和路径

### 6.4 Increment：结果对象，而不是进度对象

`Increment` 最容易被误学成“本轮完成了多少内容”。

更准确的理解是：

- 它是已经满足 Done 的结果对象
- 它必须可用
- 它是产品的一步具体演进
- 它可以累积，多个 Increment 共同构成当前产品状态

#### 6.4.1 Definition of Done 为什么是 Increment 的承诺

如果没有清晰的 `Definition of Done`，团队就会在“什么算完成”上各说各话。

DoD 的作用是：

- 把完成边界显式化
- 把质量嵌入日常工作，而不是留到最后补
- 提高 Increment 的透明度

因此 DoD 不是 QA 附件，而是 Increment 能否成立的条件之一。

#### 6.4.2 Increment 不等于上线，但必须可用

Scrum Guide 的关键点不是“每轮都必须外部发布”，而是：

- 每轮都必须产出可用结果

这意味着：

- Release 可能受市场、合规、渠道、运营策略影响
- 但 Increment 本身不能是不完整半成品

### 6.5 为什么 Commitments 不是“额外再加三个工件”

很多人会把 Product Goal / Sprint Goal / DoD 误记成“额外三个对象”。

更准确的理解是：

- 它们当然也是对象
- 但它们的主要角色是作为工件的承诺与解释框架存在

也就是说：

- `Product Goal` 解释 Product Backlog 的方向
- `Sprint Goal` 解释 Sprint Backlog 的焦点
- `DoD` 解释 Increment 的完成边界

### 6.6 “Ready” 为什么不是 Scrum 核心标准对象

很多团队熟悉 `Definition of Ready`，但需要特别注意：

- `Definition of Ready` 不是 Scrum Guide 的正式核心对象

团队当然可以使用自己的就绪标准，但从标准抽象上说：

- Scrum 官方只强调通过 `refinement` 让条目达到足够透明、可在一个 Sprint 内完成
- 不要求把 Ready 变成强制标准对象

这也是 Scrum 故意不完整的又一个体现。

---

## 第七阶段：理论系统——Scrum 的底层工作方式是什么

### 7.1 Empiricism：Scrum 的第一原则

经验主义可以先压缩成一句话：

> 用真实观察到的结果，而不是用预设想象，来驱动决策。

这意味着 Scrum 默认相信：

- 世界会变
- 计划会过时
- 团队会在行动中学习
- 最好的下一步，常常要在上一轮结果出来后才能更准确判断

### 7.2 Transparency：为什么一切先要可见

Transparency 解决的是：

- 现在到底做到了什么
- 哪些工作真的完成了
- 哪些风险已经出现
- 当前计划和真实状态是否一致

没有透明，后面的 Inspection 会失真。

### 7.3 Inspection：为什么 Scrum 要周期性地看

Inspection 不是泛泛而谈地“关注进展”，而是：

- 频繁而认真地检视工件和目标进展
- 发现偏差、问题和假设失效点

Scrum 用固定事件为 Inspection 提供节奏，不让它沦为“有空再看看”。

### 7.4 Adaptation：为什么检视之后一定要改

Scrum 明确指出：没有适应的检视是没有意义的。

这意味着：

- Planning 之后，Daily 可能改路径
- Review 之后，Product Backlog 可能改排序
- Retrospective 之后，团队工作方式应该发生变化

Scrum 不是鼓励观察世界，而是鼓励根据观察结果修正行为。

### 7.5 Lean Thinking：为什么要减少浪费并聚焦本质

Lean Thinking 在 Scrum 里帮助回答：

- 什么是真正有价值的工作
- 哪些活动只是制造等待、返工和假忙碌
- 如何避免在低价值工作上消耗大量精力

所以 Lean 不是附加装饰，而是帮助 Scrum 不被仪式和噪音淹没的约束。

---

## 第八阶段：价值观系统——为什么 Scrum 不是纯机械流程

### 8.1 五大价值观是什么

Scrum 强调五个价值观：

- `Commitment`
- `Focus`
- `Openness`
- `Respect`
- `Courage`

它们不是企业文化海报，而是经验主义能否成立的人际前提。

### 8.2 Commitment：为什么不是“绝不变更”，而是对目标负责

Commitment 在 Scrum 里更接近：

- 对目标和团队共同责任的投入

而不是：

- 对最初估算和最初计划的僵硬捍卫

### 8.3 Focus：为什么要围绕当前目标工作

Scrum 通过 Sprint Goal 和 Sprint 边界，让团队聚焦当前最重要的事情。

如果缺少 Focus，团队很容易在：

- 插单
- 并行太多
- 随机切换

中丢失真实进展。

### 8.4 Openness：为什么问题必须暴露

如果团队不敢公开：

- 进展没达到预期
- 某项工作其实没 Done
- 某个方向判断错了
- 某个障碍需要外部帮助

那么 Transparency 就会失效，Scrum 也会被空转。

### 8.5 Respect：为什么自管理不能建立在相互贬低上

Scrum 假定团队成员是 capable, independent people。

如果缺少 Respect：

- 决策会变成权力压制
- 反馈会变成防御与内耗
- 自管理会退化成混乱或表面顺从

### 8.6 Courage：为什么复杂问题下必须允许说真话

复杂问题下，常常需要有人敢于：

- 承认方向可能不对
- 承认 Done 没达到
- 拒绝不合理插单
- 推动改进和暴露障碍

所以 Courage 不是鸡血，而是经验主义的现实要求。

---

## 第九阶段：边界——Scrum 为什么“故意不完整”

### 9.1 Scrum 定义什么

Scrum 明确定义的是：

- 最小必要责任主体
- 最小必要事件结构
- 最小必要工件结构
- 经验主义与精益思维的基本工作方式

### 9.2 Scrum 刻意不定义什么

Scrum 刻意不定义：

- 详细需求模板
- 技术架构方法
- 代码质量实践细则
- 自动化测试方案
- CI/CD 工具链
- 发布审批制度
- 组织治理层级

### 9.3 为什么这种“不完整”是设计选择，不是缺陷

如果 Scrum 把上下文里所有内容都写死，它就会：

- 失去在不同领域的适应性
- 用大量规则掩盖真实问题
- 把团队注意力从价值与反馈转移到流程合规细节

因此，Scrum 的“不完整”恰恰是在保护它的普适骨架。

### 9.4 这意味着 Scrum 需要什么补充

在工程现场，Scrum 往往至少需要和下面这些能力组合：

- `XP` —— 代码实践与质量内建
- `DevOps` —— 持续集成、持续交付、反馈回路
- `Kanban` —— 流动管理、WIP 控制、服务视角
- 组织级产品管理与治理机制 —— 处理跨团队、预算、组合管理等问题

### 9.5 为什么“形式上照做”仍然可能失败

即使团队形式上有：

- 两周 Sprint
- 每天站会
- Review / Retro

如果没有：

- 清晰的 Product Goal
- 真正有权排序的 PO
- 共同认可的 DoD
- 真正可用的 Increment
- 愿意暴露问题并调整的氛围

Scrum 仍然可能只是外形成立，实质失效。

---

## 第十阶段：关系——Scrum 与 Kanban / XP / DevOps / BPMN / 12207 / 15288 的边界

### 10.1 Scrum 与 Kanban：一个强调节奏闭环，一个强调流动管理

可以先粗略记成：

- `Scrum` 更强调固定节奏、目标容器和经验闭环
- `Kanban` 更强调流动可视化、WIP 限制和持续改进

两者不是互斥关系。

`Scrum with Kanban` 的意义就在于：

- 用 Kanban 补强流动视角
- 用 Scrum 保持目标与反馈节奏

### 10.2 Scrum 与 XP：一个定义协作结构，一个定义工程实践

这是最经典的组合关系之一：

- `Scrum` 回答“团队如何围绕目标协作”
- `XP` 回答“团队如何把代码写好、让质量内建”

例如：

- TDD
- Pair Programming
- Continuous Integration
- Refactoring

这些都不是 Scrum 自己定义的，但和 Scrum 很互补。

### 10.3 Scrum 与 DevOps：一个强调产品协作闭环，一个强调交付与运行闭环

可以把它们看成两个不同层面的反馈系统：

- `Scrum` 偏团队级产品协作与短周期适应
- `DevOps` 偏开发到运行的自动化与运行反馈闭环

二者结合后，团队才更可能把 Increment 变成真实可运营的价值交付。

### 10.4 Scrum 与 BPMN：一个定义协作框架，一个定义流程表达语言

它们根本不是同一层问题：

- `Scrum` 关心：团队怎样围绕复杂问题工作
- `BPMN` 关心：流程怎样被精确表达、交换、甚至执行

也就是说：

- Scrum 是“怎么协作”的框架
- BPMN 是“怎么描述流程”的标准

如果需要把 Scrum 团队内外的某些流程画清楚，可以使用 BPMN，但 BPMN 不是 Scrum 的替代品。

### 10.5 Scrum 与 12207 / 15288：一个定义团队级协作骨架，一个定义生命周期过程体系

`12207 / 15288` 更偏：

- 生命周期有哪些过程
- 过程目的和结果是什么
- 组织层如何建立系统/软件工程过程框架

`Scrum` 更偏：

- 一个小团队在复杂环境中如何持续协作并产生价值

因此，Scrum 不能直接替代 12207/15288 的全过程视角；反过来，12207/15288 也不会直接给出 Sprint 级协作细节。

### 10.6 Scrum 与 SAFe / Nexus：一个是单团队骨架，一个是扩展层

Scrum 的基本单位是单个 Scrum Team。

当进入：

- 多团队协同
- 共享产品目标
- 跨团队集成依赖

时，就会需要扩展层，如：

- `Nexus`
- `SAFe`

但这些扩展框架并不替代 Scrum 的核心对象。

---

## 第十一阶段：对象不是替代关系，而是不同关注点

### 11.1 Product Goal、Sprint Goal、Definition of Done 不是一回事

它们分别回答：

- `Product Goal`：长期往哪里去
- `Sprint Goal`：这一轮为什么值得做
- `Definition of Done`：什么叫真的完成

所以：

- 一个是方向对象
- 一个是周期焦点对象
- 一个是质量边界对象

### 11.2 Product Backlog、Sprint Backlog、Increment 不是一回事

它们分别对应：

- 所有未来可能工作
- 当前 Sprint 选中的工作与执行计划
- 已完成且可用的结果

这三者构成的是：

> 候选工作 -> 当前承诺 -> 已成结果

### 11.3 Sprint Review 与 Sprint Retrospective 不是一回事

`Review` 关注：

- 产品结果
- Stakeholder 反馈
- Product Backlog 调整

`Retrospective` 关注：

- 团队协作方式
- 流程、工具、互动、质量实践
- 下一轮团队改进

### 11.4 Scrum Master 与 Product Owner 不是一回事

- `PO` 主要守住价值方向与排序
- `SM` 主要守住框架建立与团队效能

如果把两者混成一个对象，常见后果是：

- 方向和过程改进彼此挤压
- 产品判断与团队赋能都做不深

### 11.5 Increment 与 Release 不是一回事

这个边界必须反复强调：

- Increment 是结果是否可用的工程判断
- Release 是是否对外投放的业务判断

---

## 第十二阶段：对象之间的层次感

虽然 Scrum 的对象不是严格的上下继承体系，但它们之间确实存在明显的层次关系。

### 12.1 价值层

这一层回答：

- 为什么做
- 长期要到哪里去

核心对象：

- `Product`
- `Value`
- `Product Goal`

### 12.2 协作层

这一层回答：

- 谁一起做
- 谁承担什么责任

核心对象：

- `Scrum Team`
- `Product Owner`
- `Scrum Master`
- `Developers`

### 12.3 节奏层

这一层回答：

- 何时集中形成对齐
- 何时进行检视与适应

核心对象：

- `Sprint`
- `Sprint Planning`
- `Daily Scrum`
- `Sprint Review`
- `Sprint Retrospective`

### 12.4 可见性层

这一层回答：

- 工作现在长什么样
- 当前承诺是什么
- 结果可不可以被共同理解

核心对象：

- `Product Backlog`
- `Sprint Backlog`
- `Increment`

### 12.5 质量与校正层

这一层回答：

- 什么算完成
- 为什么要调整
- 怎样才算真正适应

核心对象：

- `Definition of Done`
- `Transparency`
- `Inspection`
- `Adaptation`

可以先把层次感压缩成这句话：

> 价值层决定方向，协作层决定谁负责，节奏层决定何时看，工件层决定看什么，质量层决定什么算可靠结果。

---

## 第十三阶段：Scrum 在工程中的典型使用方式

### 13.1 互联网产品团队：Scrum + XP + DevOps

这是最典型的组合：

- `Scrum` 负责产品节奏与反馈闭环
- `XP` 负责测试、重构、持续集成等工程质量实践
- `DevOps` 负责构建、部署、运行反馈和自动化交付

### 13.2 企业内部系统：Scrum + 轻量治理

这类场景常见特点是：

- Stakeholder 多
- 业务优先级变化频繁
- 发布与审批边界比互联网产品更复杂

此时 Scrum 仍然适用，但要额外处理：

- 需求来源治理
- 发布窗口
- 外部依赖协调

### 13.3 合规行业：Scrum + 生命周期标准 + 质量体系

在汽车、医疗、金融、军工等场景，Scrum 往往不能单独承担全部治理要求。

常见组合是：

- `Scrum` 作为团队级执行框架
- `12207 / 15288` 作为生命周期过程框架
- `ISO 9001`、`SPICE`、行业合规标准作为治理与符合性框架

### 13.4 维护与运营型团队：Scrum + Kanban

当团队面临：

- 大量中断
- 运维事件
- 服务请求
- 紧急修复

时，Scrum 的 Sprint 节奏可能需要用 Kanban 的流动管理来补强，否则团队容易在高打断场景中失去可执行性。

---

## 第十四阶段：学习顺序与记忆框架

### 14.1 推荐学习顺序

如果第一次系统学习 Scrum，最稳的顺序是：

1. 先学 `Product Goal / Sprint Goal / DoD`
2. 再学 `Product Backlog / Sprint Backlog / Increment`
3. 再学 `PO / Developers / SM`
4. 再学 `Sprint` 与四个正式事件
5. 最后再学与 `XP / DevOps / Kanban / 12207` 的协同

原因很简单：

- 先知道目标与完成边界，才能理解为什么要协作
- 先知道工件，才能理解事件在检视什么
- 先知道责任边界，才能理解各事件里谁在承担什么

### 14.2 把 Scrum 压缩成一个适合记忆的框架

可以先记成：

```text
一条心跳：Sprint
三类责任：PO / SM / Developers
三类工件：Product Backlog / Sprint Backlog / Increment
三类承诺：Product Goal / Sprint Goal / DoD
四个正式事件：Planning / Daily / Review / Retro
一个底层逻辑：Transparency -> Inspection -> Adaptation
```

### 14.3 再压缩成一句话

> Scrum = 围绕产品目标，由小型自管理团队，在 Sprint 心跳内，用可见工件和固定检视点持续产生满足 Done 的 Increment，并依据反馈不断适应。

---

## 第十五阶段：对象字典与关系矩阵

### 15.1 对象字典

**Product**
- 定义：价值承载体
- 作用：让团队围绕持续演进对象协作

**Product Goal**
- 定义：产品未来状态的长期目标
- 作用：约束 Product Backlog 的方向

**Product Backlog**
- 定义：产品改进工作的有序、演化列表
- 作用：承载所有未来工作候选

**Product Backlog Item**
- 定义：Backlog 中可被细化和选择的工作项
- 作用：形成 Planning 的输入材料

**Sprint**
- 定义：Scrum 的固定时长容器事件
- 作用：形成价值交付与反馈的心跳周期

**Sprint Goal**
- 定义：当前 Sprint 的价值焦点
- 作用：约束本轮工作不至于碎片化

**Sprint Backlog**
- 定义：Sprint Goal + 选定工作项 + 执行计划
- 作用：成为当前 Sprint 的执行视图

**Increment**
- 定义：满足 Done 的可用结果
- 作用：成为产品演进的真实证据

**Definition of Done**
- 定义：完成的共享标准
- 作用：保证 Increment 的质量边界与透明度

**Product Owner**
- 定义：产品价值最大化责任主体
- 作用：守住方向与排序

**Developers**
- 定义：创建可用 Increment 的责任主体集合
- 作用：守住增量与执行计划

**Scrum Master**
- 定义：建立 Scrum 并提升团队效能的责任主体
- 作用：守住框架与改进能力

**Stakeholder**
- 定义：对产品结果有利益或约束的外部相关方
- 作用：在 Review 中输入反馈和上下文变化

### 15.2 关系矩阵

```text
对象A                关系               对象B
────────────────────────────────────────────────────────
Product Goal         约束方向           Product Backlog
Product Backlog      提供候选工作       Sprint Planning
Sprint Planning      形成               Sprint Goal
Sprint Planning      选择并组织         Sprint Backlog
Sprint Backlog       指导               Developers 的日常工作
Developers           创建               Increment
Definition of Done   约束质量边界       Increment
Sprint Review        检视               Increment
Sprint Review        反馈调整           Product Backlog
Sprint Retrospective 改进               团队工作方式
Product Owner        负责有效管理       Product Backlog
Scrum Master         负责建立           Scrum 框架与团队效能
```

这张矩阵最重要的作用，是帮助建立一个判断规则：

- 任何 Scrum 对象都不是孤立存在的
- 它们总是在“约束、输入、输出、检视、改进”这些关系中成立

---

## 第十六阶段：一次 Sprint 中，对象如何流转

### 16.1 Sprint 之前：方向和候选工作已经在积累

在 Sprint 开始之前，通常已经存在：

- 一个当前有效的 `Product Goal`
- 一个持续演化中的 `Product Backlog`
- 若干已经被足够细化、可在一个 Sprint 内完成的条目

这说明 Sprint 并不是从零开始，而是接入一个持续演进的产品上下文。

### 16.2 Sprint Planning：把长期方向压缩成当前承诺

Planning 发生时，Scrum Team 会把：

- 长期的 `Product Goal`
- 当前的 `Product Backlog`

压缩成：

- 这一轮的 `Sprint Goal`
- 本轮选中的条目
- 执行计划

这一步完成的是：

> 从长期方向到短周期承诺的投影。

### 16.3 Sprint 执行中：Daily Scrum 持续修正路径

进入执行后，团队不是机械照计划推进，而是：

- 每天看 Sprint Goal 的进展
- 调整 Sprint Backlog
- 识别障碍
- 根据学习修正路径

这里真正被持续操作的对象是：

- `Sprint Goal`
- `Sprint Backlog`
- `Definition of Done`

### 16.4 Increment 逐步形成，而不是最后一刻突然出现

理想情况下，Increment 不是 Sprint 结束前临时拼出来的。

更好的状态是：

- 随着工作推进，Increment 逐步成长
- 每做完一部分，就尽量逼近 Done
- 质量不是最后补，而是一直嵌在工作中

### 16.5 Sprint Review：把结果放回外部世界

到 Review 时，团队拿出来的不是“进度说明”，而是：

- 当前真实可检视的 Increment
- 当前环境变化
- 与 Stakeholders 的讨论结果
- 对 Product Backlog 的调整

这一步完成的是：

> 从当前结果回到长期方向的重新校准。

### 16.6 Sprint Retrospective：把团队自己也当作改进对象

在 Review 之后，Retrospective 会把关注点从产品转向团队：

- 哪些协作方式拖慢了我们
- 哪些质量问题反复出现
- 哪些工具、边界、角色互动方式需要改
- 下一轮准备怎么试着变好

这一步完成的是：

> 让团队本身成为持续改进对象，而不是只盯着产品变更。

### 16.7 一个完整闭环到底闭在什么地方

一次 Sprint 真正闭合的不是“任务做完了”这件事，而是下面这条链：

```text
Product Goal
   ↓
Product Backlog
   ↓
Sprint Planning
   ↓
Sprint Goal + Sprint Backlog
   ↓
Increment (meets DoD)
   ↓
Sprint Review -> 调整方向与待办
   ↓
Sprint Retrospective -> 调整团队工作方式
   ↓
进入下一轮 Sprint
```

如果这条链能稳定运行，Scrum 才真正成立。

---

## 第十七阶段：把五个事件拆成控制网络

### 17.1 为什么要从“会议列表”切换到“控制网络”

很多团队在学习 Scrum 时，脑子里的对象顺序是：

- Planning
- Daily
- Review
- Retro

然后自然得出一个错觉：

> Scrum 不就是几场固定会议吗？

这就是为什么必须再往下一层抽象。

更准确的理解应该是：

- 每个事件都不是孤立出现的
- 每个事件都消费某些输入对象
- 每个事件都会产出新的决策、计划或调整
- 这些输出又会成为下一个事件或下一轮 Sprint 的输入

也就是说，Scrum 里的事件真正形成的是：

```text
方向输入 -> 周期承诺 -> 日常修正 -> 结果检视 -> 协作改进 -> 下一轮方向修正
```

当你从“会议清单”切换到“控制网络”之后，很多混乱会突然变清楚：

- 为什么 Review 和 Retro 不能互相替代
- 为什么 Daily 不是汇报会
- 为什么 Planning 不是排工会
- 为什么事件缺席会直接削弱经验主义

### 17.2 Sprint Planning：输入、输出与控制意义

从对象角度看，`Sprint Planning` 至少消费下面几类输入：

- 当前 `Product Goal`
- 当前 `Product Backlog`
- 团队对 `Definition of Done` 的共同理解
- 当前产品状态、外部约束和最新上下文

它至少产出下面三类结果：

- 一个 `Sprint Goal`
- 一组进入本轮的 `Product Backlog Items`
- 一份由 `Developers` 维护的初始执行计划

如果把它压缩成一句话，可以记成：

> Planning 的作用，是把长期方向压缩成当前 Sprint 的价值焦点和执行投影。

这里最容易被忽视的，是它的控制意义并不是“把工单分完”，而是：

- 让团队先对“为什么值得做”形成共同理解
- 再对“本轮做哪些工作”形成边界
- 最后才讨论“怎么推进这些工作”

也就是说，Scrum 把价值问题放在范围问题前面，把范围问题放在执行细节前面。

#### 17.2.1 Topic One 为什么排在最前面

`Why is this Sprint valuable?` 被放在第一位，不是礼貌问题，而是结构性要求。

如果这个问题不先回答清楚，后面就会发生一连串偏移：

- 团队知道要做很多事，但不知道为什么这些事应该一起做
- Sprint 里的工作像一个临时打包集合，而不是围绕一个共同目标组织
- 一旦中途出现变化，团队也不知道该保住什么、舍弃什么

所以从对象关系上说：

- `Sprint Goal` 不是 Planning 的附带产物
- 它是后续 Daily 调整、范围协商、风险判断的上位参照物

#### 17.2.2 Topic Two 为什么不是“先把容量塞满”

`What can be Done this Sprint?` 很容易被误读为：

- 先估出多少点
- 再把容量塞满
- 把每个成员都排到满负荷

但 Scrum Guide 的重心其实不是“填满容量”，而是：

- 围绕 `Sprint Goal` 选择最有助于达成目标的工作
- 让进入 Sprint 的工作形成一个可解释的整体
- 让团队对本轮承诺有现实把握

因此，进入 Sprint 的工作更接近：

> 围绕目标形成的可实现组合，而不是容量优化算法的输出。

#### 17.2.3 Topic Three 为什么由 Developers 主导

`How will the chosen work get done?` 的关键边界是：

- 这不是外部管理者替团队分配工作
- 也不是 PO 继续细化到每个人怎么干
- 而是 `Developers` 围绕 `Sprint Goal` 自己形成执行模型

所以从对象抽象上看：

- `Sprint Goal` 约束工作焦点
- `PBI` 提供工作内容
- `Developers` 负责把这些内容转成可执行路径

这也是为什么 `Sprint Backlog` 最终属于：

- “由 Developers 为 Developers 维护的计划对象”

### 17.3 Daily Scrum：输入、输出与控制意义

`Daily Scrum` 的输入对象非常集中：

- 当前 `Sprint Goal`
- 当前 `Sprint Backlog`
- 已经发生的真实进展
- 已暴露或刚出现的障碍

它的输出也非常集中：

- 对 `Sprint Backlog` 的更新
- 对当天及接下来几天的路径调整
- 对风险和阻塞的更早暴露

所以 Daily Scrum 最本质的作用不是同步“人干了什么”，而是同步：

- 当前路径是否仍然通向 `Sprint Goal`

#### 17.3.1 为什么它只要求 Developers 负责

官方定义里，`Daily Scrum` 是给 `Developers` 的事件。

这背后的对象边界非常清楚：

- Sprint 内具体如何推进当前工作，是 `Developers` 的责任
- Daily 不是外部审批点
- Daily 也不是 PO 或 Scrum Master 主持下的状态审计会

其他人当然可以在场，但如果在场就有一个重要前提：

- 不能打断 Developers 对自己工作路径的调整

#### 17.3.2 为什么 15 分钟是结构约束，不是效率口号

`Daily Scrum` 的 15 分钟时间盒，不是因为“站着开会就会更高效”，而是因为：

- 它只负责做日频路径校正
- 它不试图在这个事件里解决全部问题
- 深入讨论应该拆到会后由相关人继续处理

所以 15 分钟保护的是：

- Daily 作为控制点的轻量性
- 而不是强迫复杂问题必须在 15 分钟内解决完

#### 17.3.3 为什么固定问法不是本质

“昨天做了什么、今天做什么、有什么阻碍”只是常见话术，不是标准正文要求。

标准真正要求的是：

- 检视 toward `Sprint Goal` 的进展
- 必要时调整计划

因此一个团队完全可以用别的方式完成 Daily，只要它仍然满足这两个核心条件。

### 17.4 Sprint Review：输入、输出与控制意义

`Sprint Review` 的核心输入包括：

- 当前 `Increment`
- 当前 `Product Backlog`
- 已发生的市场、业务、技术、环境变化
- Stakeholders 的反馈与判断

它的核心输出包括：

- 对当前结果的共同认识
- 对未来方向的再判断
- 对 `Product Backlog` 的调整

所以 Review 真正控制的是：

> 从当前结果回看长期方向，判断下一步哪些工作还值得继续投入。

#### 17.4.1 为什么 Review 不是“验收关卡”

很多团队会把 Review 做成：

- PO 或业务方逐项验收
- 过了就算完成
- 不过就回去返工

但从 Scrum 抽象上说，Review 的重点不是流程过闸，而是：

- 基于 `Increment` 与 Stakeholders 一起检视真实结果
- 看当前结果对 Product Goal 的推进到底说明了什么
- 看外部环境变化后，原来的 Backlog 排序是否还成立

也就是说，Review 比“是否验收通过”更上层，它处理的是：

- 结果与方向之间的再校准

#### 17.4.2 为什么没有 Stakeholders，Review 就会被抽空

如果 Review 里没有外部相关方，通常会退化成：

- 团队自己给自己演示
- 大家都知道已经做了什么，但没有新的价值判断输入
- Product Backlog 也没有得到新的外部约束

这时 Review 形式还在，但它失去了重要功能：

- 把外部世界重新接回 Scrum 闭环

### 17.5 Sprint Retrospective：输入、输出与控制意义

`Sprint Retrospective` 的输入与 Review 明显不同。

它更关注：

- 本轮协作体验
- 过程摩擦
- 工具与工程实践的有效性
- 团队互动方式
- Done 的执行情况

它的输出则应该是：

- 一个或若干可操作的改进行动
- 对下一轮工作方式的具体调整

所以 Retro 控制的是：

> 团队自己的工作系统，而不是产品方向本身。

#### 17.5.1 为什么 Retro 不能只停留在“大家聊过了”

如果一个 Retro 只有：

- 吐槽
- 共鸣
- 情绪表达

但没有：

- 明确改什么
- 谁来推动
- 下一轮如何体现

那么它就没有真正形成 Adaptation。

从对象角度看，Retro 必须至少产出：

- 一个进入下一轮 Sprint 的改进行动对象

否则 Retrospective 就不会进入实际系统。

#### 17.5.2 为什么 Retro 的改进不应该永远排到“以后再说”

官方 Guide 明确强调：最有影响的改进应该尽快处理。

这意味着改进不是：

- 额外附加项
- 团队有空才做的边缘工作

而是：

- 维持团队效能的必要工作

如果团队永远把改进排到无穷远，Scrum 就会逐渐失去“持续变得更会工作”的能力。

### 17.6 时间盒为什么是控制密度，而不是仪式束缚

Scrum 对事件给出时间盒，不是为了制造仪式感，而是为了控制协作密度：

- `Sprint Planning`：对于一个月 Sprint，最多 8 小时
- `Daily Scrum`：最多 15 分钟
- `Sprint Review`：对于一个月 Sprint，最多 4 小时
- `Sprint Retrospective`：对于一个月 Sprint，最多 3 小时

更短的 Sprint，通常也应更短。

这些时间盒的真正作用是：

- 防止 Planning 无限发散
- 防止 Daily 变成长会
- 防止 Review 变成全天汇报大会
- 防止 Retro 被拖成低质量抱怨会

也就是说，时间盒约束的是：

- 控制点的密度和节奏
- 而不是禁止深入问题本身

### 17.7 五个事件合在一起，到底形成了什么网络

把五个事件连起来看，可以得到一张更准确的控制图：

```text
Product Goal / Product Backlog
            ↓
      Sprint Planning
            ↓
Sprint Goal / Sprint Backlog
            ↓
        Daily Scrum
            ↓
         Increment
            ↓
       Sprint Review
            ↓
  Product Backlog 更新 / 方向再判断
            ↓
   Sprint Retrospective
            ↓
      团队工作方式调整
            ↓
         下一轮 Sprint
```

这张图真正说明的是：

- Scrum 事件不是会务安排
- 它们共同构成了一张围绕方向、路径、结果和团队能力的控制网络

---

## 第十八阶段：工件的细粒度对象边界

### 18.1 Product Backlog Item 到底是什么粒度对象

`Product Backlog Item` 很容易被粗暴理解成：

- 一张需求卡
- 一条用户故事
- 一个 Jira 任务

但从 Scrum 抽象上看，PBI 更准确地是：

- Product Backlog 中可被排序、细化、选择和完成的最小工作单元之一

它至少要满足几个条件：

- 能被讨论其价值
- 能被放进排序关系里
- 能被继续细化
- 能在某个时刻进入 Sprint

所以 PBI 的重点不在于固定长相，而在于它是否能进入 Scrum 的工件流转。

#### 18.1.1 为什么 PBI 不等于“用户故事模板”

用户故事是一种很常见的表达形式，但不是标准要求。

如果把 PBI 和用户故事完全画等号，容易产生两个误解：

- 只有业务功能才配进入 Backlog
- 技术债、缺陷、基础设施改进都成了“不正规工作”

而实际上，Scrum 只关心：

- 这些工作是否对产品价值或产品能力的演进有意义
- 是否需要进入统一排序体系

### 18.2 Ordering 为什么比 Prioritization 更准确

`2020 Scrum Guide` 使用的是 `order`，而不是简单说 `priority`。

这很重要，因为 `ordering` 暗示的是多维权衡，不只是单一业务优先级。

一个 PBI 的顺序，可能同时受这些因素影响：

- 用户价值
- 风险
- 学习价值
- 依赖关系
- 实现成本
- 时机窗口
- 合规压力

因此如果把 Backlog 管理理解成“永远只按业务优先级排序”，就会把对象含义缩窄。

#### 18.2.1 为什么排序不是投票墙

在很多组织里，所谓“优先级排序”容易变成：

- 谁级别高谁说了算
- 谁催得急谁排前面
- 谁声音大谁先做

但从 Scrum 对象上看，`Product Owner` 的作用正是把这些噪音重新压缩成：

- 一个对 Product Goal 负责的、有解释能力的顺序结构

也就是说，Backlog 的顺序应该能被解释成：

> 为什么在当前目标和当前上下文下，这件事比另一件事更值得先做。

### 18.3 Sprint Backlog 为什么更像 Forecast，而不是合同

官方 Guide 把进入 Sprint 的工作理解为一种 `forecast`。

这个词非常关键，因为它说明：

- Developers 对本轮能完成什么做出专业预测
- 这个预测不是不可调整的法律合同
- 随着学习发生，计划本身可以更新

因此 `Sprint Backlog` 的对象定位不是：

- 冻结范围合同

而是：

- 围绕 Sprint Goal 持续更新的实时执行视图

#### 18.3.1 为什么 Forecast 不等于随便改

一旦听到 `forecast`，有人会滑向另一个极端：

- 反正是预测，那中途怎么变都行

这同样不对。

因为 Scrum 同时又规定：

- 不能做危及 `Sprint Goal` 的变更
- 质量不能下降

所以更准确的理解应该是：

- `Sprint Backlog` 的条目和计划可以调整
- 但这种调整必须受 `Sprint Goal` 和 `DoD` 的双重约束

### 18.4 Increment 为什么是可累积对象，而不是单次交付物

很多团队会把“本轮做出的东西”理解成一个独立批次，好像上一轮和这一轮之间没有连续性。

但 Scrum 的 `Increment` 更准确地是：

- 当前产品状态中，新增且满足 Done 的那一部分
- 它会叠加在既有产品基础上
- 多个 Increment 累积形成当前产品的真实状态

这说明 Increment 不是：

- 每轮单独交作业

而是：

- 产品持续演进链上的新完成片段

#### 18.4.1 为什么一个 Sprint 内可以有多个 Increment

这是一个很重要但常被忽略的点。

一个 Sprint 并不是只能在最后一天产生一次 Increment。

更准确地说：

- 一个 Sprint 内可以逐步形成多个满足 Done 的增量
- Sprint Review 检视的是这些增量累积后的产品状态

这件事的意义很大，因为它直接关联：

- 团队是否在持续集成
- 团队是否在持续靠近可用状态
- 团队是否把质量后置到最后一刻

### 18.5 Definition of Done 为什么更像共享质量契约

`Definition of Done` 不能被理解成个人习惯，也不能被理解成某个职能团队私有标准。

它在 Scrum 中更像：

- Scrum Team 对“什么算完成”的共享质量契约

它的作用不是装饰说明，而是决定：

- 哪些结果可以被算作 Increment
- 哪些结果还只能算在做中

#### 18.5.1 组织标准与团队 DoD 的关系

官方 Guide 给了一个非常关键的边界：

- 如果组织已经有正式标准，那么它会成为所有 Scrum Teams 的最低基线
- 团队自己的 DoD 不能低于这条线

这说明 DoD 不是完全私有随意定义的，它可能同时受：

- 组织标准
- 产品特性
- 监管要求
- 工程成熟度

共同影响。

#### 18.5.2 多个团队做同一个产品时，为什么要共享 DoD

如果多个 Scrum Teams 一起做同一个产品，但各自使用完全不同的 Done 标准，就会出现一个严重问题：

- “完成”这个词在产品层失去统一语义

这会直接破坏：

- Increment 的透明度
- 跨团队集成判断
- Review 时对产品当前状态的共同理解

所以当多个团队共同服务同一产品时，共享 DoD 不是管理偏好，而是对象一致性的要求。

### 18.6 工件一旦和现实脱节，会发生什么

Scrum 的工件之所以重要，是因为它们承载 Transparency。

一旦工件与现实脱节，就会出现：

- Product Backlog 不能真实反映当前方向
- Sprint Backlog 不能真实反映当前路径
- Increment 不能真实反映当前产品状态
- DoD 不能真实反映完成边界

这时 Scrum 最先坏掉的不是会议，而是：

- Inspect 与 Adapt 失去依据

也就是说，工件失真会直接导致经验主义失真。

---

## 第十九阶段：Scrum Team 的组织边界与规模问题

### 19.1 为什么官方强调 typically 10 or fewer

Scrum Guide 对团队规模的表述很克制：

- 小到足够敏捷
- 大到足以在一个 Sprint 内完成有意义的工作
- 通常 10 人或更少

这个边界背后的对象逻辑是：

- 团队越大，沟通路径越多
- 对齐成本越高
- 决策与反馈越容易迟滞

而 Scrum 依赖的恰恰是：

- 高频检视
- 快速调整
- 对同一个目标的共同理解

所以“10 or fewer”并不是迷信数字，而是在保护协作密度。

### 19.2 Cross-functional 为什么不等于“每个人什么都会”

跨职能最常见的误读是：

- 每个人都必须从需求写到测试、从设计做到运维

这并不是标准的本意。

更准确的理解是：

- 团队作为整体，拥有完成产品增量所需的能力组合
- 个体技能可以不同
- 团队内部可以共享、学习、协同，但不要求所有人完全同质化

也就是说，`Cross-functional` 强调的是：

- 团队整体能力闭环

而不是：

- 个体能力同构

### 19.3 Self-managing 为什么不等于“没有边界、没有约束”

自管理经常被误解成：

- 团队想怎么干就怎么干
- 外部都不能提要求
- 没人可以设定产品方向或组织约束

这显然不对。

Scrum 的自管理更准确地是：

- 团队在既定目标和边界内，自己决定谁做什么、何时做、如何协作

这些既定边界至少包括：

- `Product Goal`
- `Sprint Goal`
- `Definition of Done`
- 产品和组织的外部约束

所以 Self-managing 的真正含义是：

- 执行路径自治

而不是：

- 世界观自治

### 19.4 为什么 Product Owner 必须是一个人，而不是委员会

官方 Guide 明确说：`The Product Owner is one person, not a committee.`

这句话非常有力量，因为它直接切开了很多组织里的常见问题：

- 多个业务方各自有意见
- 多个经理都想决定优先级
- 谁都能往 Backlog 里塞“最高优先级”

如果没有一个明确的单点责任主体，最终会发生：

- Product Goal 失焦
- Backlog 顺序失真
- 团队每天面对冲突命令

因此 PO 作为单人对象，不是为了集中权力，而是为了保证：

- 价值方向有一个最终整合口

### 19.5 Stakeholders 为什么不能直接替代 PO 管理 Backlog

Stakeholders 的声音当然重要，但它们进入 Scrum 的方式不是：

- 各自直接改 Backlog 顺序

而是：

- 通过 Review、沟通和持续协作影响 Product Owner 的判断

这个边界很关键，因为它保护的是：

- Backlog 顺序的可解释性
- 价值决策的统一出口
- 团队面对外部输入时的稳定性

### 19.6 多个团队服务同一产品时，为什么必须共享主轴对象

当多个 Scrum Teams 一起做同一个产品时，官方 Guide 明确强调它们应共享：

- 同一个 `Product Goal`
- 同一个 `Product Backlog`
- 同一个 `Product Owner`

这背后的对象逻辑是：

- 如果目标分裂，产品就会变成局部最优拼接物
- 如果 Backlog 分裂，价值排序就无法统一
- 如果 PO 分裂，方向责任就会碎裂

也就是说，多团队扩展最先要守住的，不是额外流程，而是：

- 核心价值对象仍然必须保持单一主轴

### 19.7 为什么子团队结构会破坏 Increment 的统一责任

如果一个 Scrum Team 内部被重新固化成：

- 需求子团队
- 开发子团队
- 测试子团队
- 发布子团队

那么虽然名义上还是一个团队，实际上已经变成了串行接力结构。

这会直接带来：

- Sprint 内部大量等待
- Done 被推迟到末端角色
- Increment 责任被切碎
- Daily 失去共同路径调整基础

这就是为什么官方要强调：

- 没有 sub-teams
- 共同对 Increment 负责

---

## 第二十阶段：常见失真模式——看起来像 Scrum，实际上不是

### 20.1 为什么要从“失真模式”反向理解 Scrum

只看正面定义时，人很容易觉得：

- 我们大概也这样做了

但很多团队的真实状态是：

- 形式像
- 对象关系不像
- 控制点存在
- 经验主义没成立

所以反向看失真模式，能更快看出 Scrum 的关键骨架到底在哪里。

### 20.2 失真一：有 Sprint，但没有 Sprint Goal

这是最常见的空转模式之一。

表现通常是：

- 每轮都有开始和结束日期
- 也拉进来很多工作项
- 但团队说不清本轮为什么值得

这时 Sprint 会退化成：

- 纯时间分桶

缺失的对象其实是：

- `Sprint Goal` 这个焦点对象

一旦缺它，团队中途就只能围绕“哪些票还没做完”打转，而不是围绕“本轮价值目标是否仍在逼近”来调整。

### 20.3 失真二：有 Daily，但它只是状态汇报会

表现通常是：

- 每个人轮流向某个负责人汇报昨天做了什么
- 会议结束后，Sprint Backlog 不变
- 团队路径也没有因 Daily 真正调整

这时 Daily 形式还在，但它已经失去：

- 对 Sprint Goal 的检视
- 对 Sprint Backlog 的即时调整

也就是说，事件对象还在，控制作用没了。

### 20.4 失真三：有 Review，但它只是演示秀或验收会

表现通常是：

- 团队展示成果
- 业务方表示“挺好”或“这里要改”
- 但 Product Backlog 没有被系统性调整
- 大家也没有重新讨论方向与环境变化

这时 Review 没有真的把：

- 当前结果
- Stakeholder 反馈
- 产品方向

重新接成闭环。

它变成了：

- 展示活动

而不是：

- 方向校准活动

### 20.5 失真四：有 Retrospective，但没有任何改进行动进入下一轮

表现通常是：

- 团队每轮都聊得很充分
- 也知道很多痛点
- 但下一轮还是老样子

这说明 Retro 输出没有真正对象化，没有进入系统。

缺的不是讨论热情，而是：

- 可执行改进对象
- 与下一轮 Sprint 的连接关系

### 20.6 失真五：有 Backlog，但 PO 没有真实排序权

表现通常是：

- Backlog 里有顺序，但谁都知道那不是真顺序
- 高层、销售、客户、项目经理都能直接插队
- 团队每天面对多个“最高优先级”

这时丢失的关键对象不是 Backlog 本身，而是：

- `Product Owner` 作为统一价值整合口的责任边界

### 20.7 失真六：有 Increment 说法，但没有清晰 DoD

表现通常是：

- 大家口头上说这轮已经完成了
- 但有人理解成“代码写完”
- 有人理解成“测完”
- 有人理解成“上线后稳定一周”

这时 `Increment` 已经失去共同语义。

缺失的关键对象就是：

- `Definition of Done`

没有它，Transparency 会最先被破坏。

### 20.8 失真七：Scrum Team 名义存在，但内部仍是串行职能接力

表现通常是：

- 分析做完才轮到开发
- 开发做完才轮到测试
- 测试完了再排发布
- 一个 Sprint 内形成不了可用结果

这时团队虽然名义上用 Scrum，但其真实工作结构仍然是：

- 小瀑布
- 职能接力
- 子团队分段负责

缺失的其实是：

- `Cross-functional`
- 共同对 `Increment` 负责

### 20.9 失真八：Scrum Master 只剩会务和催办

表现通常是：

- 帮大家订会议室
- 提醒谁还没更新工单
- 追着大家开会

但没有真正做下面这些事：

- 改善 Scrum Team 的效能
- 清除障碍
- 推动组织理解经验主义
- 帮团队建立更健康的工作方式

这时 Scrum Master 对象被压扁成了：

- 行政协调员

而不是：

- 框架建立与效能提升责任主体

### 20.10 如果这些失真同时出现，会发生什么

如果一个团队同时存在：

- 没有真正的 Sprint Goal
- Daily 不调整路径
- Review 不调整方向
- Retro 不形成改进
- PO 没排序权
- DoD 不清晰

那么它仍然可以：

- 用 Sprint 这个词
- 有一块看板
- 有固定会议节奏

但从对象关系上看，Scrum 已经基本被抽空了。

剩下的只是：

- 术语外壳
- 仪式表面
- 管理幻觉

这也是为什么理解 Scrum 时，不能只看“有没有这些名词”，而必须看：

- 对象是否真的存在
- 关系是否真的成立
- Inspect / Adapt 是否真的在发生

---

## 第二十一阶段：按 Scrum Guide 正文逐段对象化

### 21.1 这一阶段到底在做什么

前面 20 个阶段，已经把 Scrum 拆成了一个对象系统。

但如果要更接近标准正文本身，还需要再做一步：

- 不只按主题理解
- 而是按 `Scrum Guide` 的原始段落顺序理解
- 看每一段到底在声明什么对象
- 看这些对象之间是怎样逐段拼起来的

这一阶段的目标，不是做逐句翻译，而是做更接近“标准正文解剖”的版本。

也就是说，下面每一段都会尽量回答三个问题：

- 这段原文在定义什么对象或关系
- 这段原文在施加什么约束或边界
- 这段原文最容易被误读成什么

### 21.2 阅读标记：这一轮对象化用什么标尺

为了避免只是在做摘要，这一阶段统一使用下面四种标记：

- `对象`：文中被显式或隐式定义的核心 thing，如 `Sprint`、`Product Goal`、`Developers`
- `关系`：对象之间的作用关系，如“约束”“输入”“输出”“负责”“检视”
- `约束`：正文中的规范性边界，如“只能由谁做”“不能发生什么”“至少做到什么”
- `边界`：正文故意不写、或明确排除的内容

所以“逐段对象化”并不是把段落压缩成一句话，而是把每段背后的标准作用抽出来。

### 21.3 Purpose of the Scrum Guide：前言四段到底在做什么

#### 21.3.1 段落 1：版本历史与权威来源

- `对象`：`Scrum Guide` 本体、版本演进历史、作者权威来源
- `关系`：Guide 作为 Scrum 的正式定义载体，而不是外围教程
- `解剖结论`：这段先把“谁在定义标准”固定下来，避免后续把二手实践文章当成标准正文

#### 21.3.2 段落 2：Guide 的规范性边界

- `对象`：`Scrum` 的 core design、elements、rules、benefits
- `关系`：元素各自服务整体价值；删改核心设计会覆盖问题并削弱收益
- `约束`：不能随意删掉元素后还声称自己在完整使用 Scrum
- `解剖结论`：这段真正声明的是“Scrum Guide 不是建议合集，而是最小规范骨架”

#### 21.3.3 段落 3：适用域扩展与 `developers` 一词的语义修正

- `对象`：复杂工作场景、多领域专业人员、`developers` 术语
- `关系`：`developers` 在正文里是简化用语，不是把 Scrum 限定在软件程序员
- `边界`：不能把 `Developers` 误读成“只有写代码的人”
- `解剖结论`：这段在给后文的术语做去行业偏见处理

#### 21.3.4 段落 4：上下文实践可以存在，但不在 Guide 正文中定义

- `对象`：patterns、processes、insights、context-sensitive tactics
- `关系`：这些东西可以围绕 Scrum 生长，但不等于 Scrum 标准本体
- `边界`：正文故意不把上下文战术写死
- `解剖结论`：这段把“标准正文”和“落地打法”切开了

### 21.4 Scrum Definition：定义段到底声明了哪几个最小对象

#### 21.4.1 段落 1：一句话总定义

- `对象`：lightweight framework、people、teams、organizations、value、adaptive solutions、complex problems
- `关系`：Scrum 的目标不是执行流程，而是让不同层级主体通过适应性解法产生价值
- `解剖结论`：这句总定义先把 Scrum 绑定到“复杂问题 -> 适应 -> 价值”这条主轴

#### 21.4.2 段落 2：nutshell 四步是最小运行链

- `步骤 1`：`Product Owner -> Product Backlog`，把复杂问题转成有序工作候选
- `步骤 2`：`Scrum Team -> Increment`，把部分候选转成 Sprint 内的价值增量
- `步骤 3`：`Scrum Team + Stakeholders -> inspect/adjust`，把结果放回外部检视与调整
- `步骤 4`：`Repeat`，声明 Scrum 不是一次性流程，而是持续闭环
- `解剖结论`：这四句其实就是后文全部对象系统的最小骨架版

#### 21.4.3 段落 3：simple / try it as is / purposefully incomplete

- `对象`：simplicity、philosophy、theory、structure、purposefully incomplete framework
- `关系`：先按原样使用，再判断是否帮助目标达成
- `约束`：不能还没按原样运行，就先大幅改造后再评价 Scrum
- `边界`：Guide 只定义实现 Scrum theory 所需的最小部分
- `解剖结论`：这段把“先照骨架跑起来，再谈本地化”固定成了阅读姿势

#### 21.4.4 段落 4：Scrum 对现有实践的态度

- `对象`：existing practices、management、environment、work techniques
- `关系`：Scrum 会包裹现有实践、暴露其有效性，必要时使部分旧做法失去必要性
- `解剖结论`：这段说明 Scrum 不是替代一切方法的大全，而是一个暴露问题与改进现状的框架

### 21.5 Scrum Theory：理论段逐段在搭什么地基

#### 21.5.1 理论段 1：经验主义与精益思维是双地基

- `对象`：`Empiricism`、`Lean Thinking`
- `关系`：前者给决策来源，后者给价值取舍方向
- `解剖结论`：这段告诉你 Scrum 不是从“完整预测”出发，而是从“观察到什么、就据此决定什么”出发

#### 21.5.2 理论段 2：迭代增量 + 集体能力闭环

- `对象`：iterative、incremental、predictability、risk control、collective skills
- `关系`：Scrum 不是只靠节奏，而是靠迭代增量和团队整体能力一起工作
- `解剖结论`：这段把 Sprint 节奏和跨职能团队能力绑在了一起

#### 21.5.3 理论段 3：Sprint 容器与四个正式事件

- `对象`：`Sprint`、four formal events、inspection、adaptation
- `关系`：四个正式事件被放入 Sprint 容器，形成经验主义的固定节奏
- `约束`：这些事件不是附加会议，而是理论落地的机制
- `解剖结论`：这段是后续事件系统的总索引

#### 21.5.4 Transparency 第一段：可见性先于一切

- `对象`：emergent process、work、performers、receivers、three formal artifacts
- `关系`：重要决策建立在对工件状态的感知之上
- `约束`：工件透明度不足会直接降低价值并提高风险
- `解剖结论`：这段把“工件”与“决策质量”绑死了

#### 21.5.5 Transparency 第二段：没有透明就没有有效检视

- `对象`：transparency、inspection
- `关系`：inspection 依赖 transparency
- `解剖结论`：这段其实在解释为什么 Scrum 必须有可共同指向的工件

#### 21.5.6 Inspection 两段：为什么要频繁而认真地看

- `对象`：artifacts、progress toward agreed goals、cadence、five events
- `关系`：目标进展和工件都必须被高频检视；事件提供检视频率
- `约束`：Inspection without adaptation is pointless
- `解剖结论`：这两段把“看什么”“多久看”“为什么不能只看不改”一起规定了

#### 21.5.7 Adaptation 两段：学习一旦发生，就必须调整

- `对象`：acceptable limits、unacceptable product、adjustment、empowerment、self-managing
- `关系`：一旦偏离边界或结果不可接受，就要尽快调整
- `约束`：没有被赋能、没有自管理能力，会让 adaptation 变难
- `解剖结论`：这两段把自管理与适应能力直接联结起来

### 21.6 Scrum Values：价值观三段分别在补什么

#### 21.6.1 段落 1：五个价值观被正式点名

- `对象`：`Commitment`、`Focus`、`Openness`、`Respect`、`Courage`
- `关系`：它们不是组织口号，而是 successful use of Scrum 的前提
- `解剖结论`：这段先把价值观提升到框架成立条件，而不是文化附录

#### 21.6.2 段落 2：价值观如何作用于行为

- `对象`：goals、support each other、work of the Sprint、challenges、capable independent people、do the right thing
- `关系`：五个价值观分别锚定目标承诺、焦点保持、问题公开、相互尊重和说真话的勇气
- `解剖结论`：这段把抽象价值观翻译成可观察行为

#### 21.6.3 段落 3：价值观与 trust 的关系

- `对象`：decisions、steps、way Scrum is used、trust、empirical pillars
- `关系`：价值观被实践出来时，透明、检视、适应才会真正活起来并形成信任
- `解剖结论`：这段告诉你为什么纯机械照流程仍可能失败

### 21.7 Scrum Team：团队章节五段的对象化

#### 21.7.1 段落 1：基本协作单元与构成

- `对象`：`Scrum Team`、`Scrum Master`、`Product Owner`、`Developers`、`Product Goal`
- `关系`：Scrum Team 是基本单位；团队内无 sub-teams 或 hierarchies；共同聚焦一个 Product Goal
- `约束`：不能把 Scrum Team 理解成一个再被切碎的层级组织
- `解剖结论`：这段同时定义了团队边界、组成和共同目标

#### 21.7.2 段落 2：Cross-functional 与 Self-managing

- `对象`：cross-functional、self-managing
- `关系`：团队整体具备创造价值所需能力；团队内部决定谁做什么、何时做、如何做
- `边界`：自管理不是没有方向边界，跨职能也不是每个人技能完全相同
- `解剖结论`：这段在给团队工作方式定型

#### 21.7.3 段落 3：规模与多团队重组

- `对象`：small enough、large enough、typically 10 or fewer、multiple Scrum Teams
- `关系`：团队过大时，应拆成多个同一产品下的凝聚团队
- `约束`：拆分后仍需共享 `Product Goal`、`Product Backlog`、`Product Owner`
- `解剖结论`：这段把多团队扩展的主轴对象先提前写出来了

#### 21.7.4 段落 4：团队责任范围与可持续节奏

- `对象`：stakeholder collaboration、verification、maintenance、operation、experimentation、R&D、sustainable pace
- `关系`：团队对产品相关活动整体负责；组织授权团队管理自己的工作
- `解剖结论`：这段在拒绝“团队只负责开发代码，其余都算外部流程”这种切法

#### 21.7.5 段落 5：整体责任与三种 accountability

- `对象`：valuable useful Increment、three specific accountabilities
- `关系`：整个团队对每个 Sprint 的可用增量负责，三种责任主体是内部进一步分工
- `解剖结论`：这段把“共同责任”和“具体责任主体”连接起来了

### 21.8 Developers：两段到底定义了什么

#### 21.8.1 段落 1：Developers 的对象边界

- `对象`：people in the Scrum Team committed to creating any aspect of a usable Increment
- `关系`：凡是对可用 Increment 的任一方面负责的人，都属于 Developers
- `边界`：这里不是职位名词，而是增量创建责任集合
- `解剖结论`：这段把 Developers 从“程序员岗位”抬升成了责任对象

#### 21.8.2 段落 2：四条 Developers accountability

- `对象 1`：create a plan for the Sprint -> `Sprint Backlog`
- `对象 2`：adhere to `Definition of Done` -> 把质量植入工作
- `对象 3`：adapt plan each day toward `Sprint Goal` -> 日频路径修正
- `对象 4`：hold each other accountable as professionals -> 同侪专业责任
- `解剖结论`：这四条把计划、质量、适应、专业互责四个维度一起压到 Developers 身上

### 21.9 Product Owner：五段的对象化解剖

#### 21.9.1 段落 1：PO 的第一性责任

- `对象`：maximizing the value of the product
- `关系`：PO 首先负责价值最大化，不是单纯做需求转录
- `解剖结论`：这段先把 PO 从“需求秘书”位置拉出来

#### 21.9.2 段落 2：有效 Product Backlog 管理四件事

- `对象 1`：develop and explicitly communicate `Product Goal`
- `对象 2`：create and clearly communicate `Product Backlog items`
- `对象 3`：order `Product Backlog items`
- `对象 4`：ensure `Product Backlog` is transparent, visible, understood
- `解剖结论`：这段说明 PO 不只是排顺序，还要对方向、表达质量和透明度负责

#### 21.9.3 段落 3：可以委派工作，但不能委派 accountability

- `对象`：delegation、accountability
- `关系`：PO 可以让别人帮忙做 Backlog 工作，但责任仍留在 PO 身上
- `解剖结论`：这段阻止组织把 PO 稀释成一个名义岗位

#### 21.9.4 段落 4：组织必须尊重 PO 决策

- `对象`：organization、PO decisions、content/order of Product Backlog、inspectable Increment
- `关系`：PO 决策通过 Backlog 内容与顺序、以及 Review 中可检视的增量表现出来
- `约束`：如果组织不尊重这些决策，PO 对象就会失效
- `解剖结论`：这段实际上在给 PO 配组织级权威前提

#### 21.9.5 段落 5：PO 是一个人，不是委员会

- `对象`：one person、not a committee、stakeholders、convince the Product Owner
- `关系`：利益相关方通过影响 PO，而不是直接替代 PO 管理 Backlog
- `解剖结论`：这段把价值判断的统一出口固定下来

### 21.10 Scrum Master：六段如何把 SM 定义完整

#### 21.10.1 段落 1：建立 Scrum as defined in the Scrum Guide

- `对象`：Scrum theory、Scrum practice、Scrum Guide
- `关系`：SM 首先负责让大家理解并建立 Guide 所定义的 Scrum
- `解剖结论`：这段说明 SM 的首责是框架建立，不是会务支持

#### 21.10.2 段落 2：团队效能责任

- `对象`：effectiveness、improve practices、Scrum framework
- `关系`：SM 要在 Scrum 边界内推动团队改进实践
- `解剖结论`：这段把 SM 从“流程管理员”提升为效能责任主体

#### 21.10.3 段落 3：true leaders who serve

- `对象`：true leaders、service
- `关系`：SM 不是无权角色，而是以服务方式发挥领导作用
- `解剖结论`：这段修正了很多人对 servant-leadership 的误读

#### 21.10.4 段落 4：服务 Scrum Team 的四条路径

- `对象 1`：coach self-management and cross-functionality
- `对象 2`：help focus on high-value Increments that meet `DoD`
- `对象 3`：cause removal of impediments
- `对象 4`：ensure events take place and are positive, productive, kept within timebox
- `解剖结论`：这段把 SM 对团队内部的服务范围写成了能力、价值、障碍、事件四个面向

#### 21.10.5 段落 5：服务 PO 的四条路径

- `对象`：Product Goal definition、Backlog management、clear concise PBIs、empirical planning、stakeholder collaboration
- `关系`：SM 不替 PO 做价值判断，但帮助 PO 把价值对象运转得更清晰
- `解剖结论`：这段把 SM 与 PO 的关系定义成“赋能价值管理”，而不是“替代价值管理”

#### 21.10.6 段落 6：服务组织的四条路径

- `对象`：Scrum adoption、implementation planning、empirical approach、barrier removal
- `关系`：SM 的作用越出团队边界，进入组织采用层
- `解剖结论`：这段说明 SM 也是组织变革接口对象

### 21.11 Scrum Events：事件总论两段在说什么

#### 21.11.1 段落 1：事件为什么是 formal opportunities

- `对象`：`Sprint` 容器、formal events、inspect、adapt、artifacts、regularity
- `关系`：事件被设计成正式的 inspect/adapt 机会；不用这些事件就会损失调整机会
- `约束`：事件不是可有可无的仪式
- `解剖结论`：这段是全部事件章节的规范性总前言

#### 21.11.2 段落 2：同一时间地点的复杂度控制

- `对象`：same time and place、reduce complexity
- `关系`：事件安排也服务于降低协作复杂度
- `解剖结论`：这段看似会务细节，实则是在控制协作摩擦

### 21.12 The Sprint：Sprint 小节七段的对象化

#### 21.12.1 段落 1：Sprint 是心跳，不是时间盒附庸

- `对象`：heartbeat of Scrum、ideas turned into value
- `关系`：Sprint 是整个框架的节奏主轴
- `解剖结论`：这段先把 Sprint 提升为框架核心容器

#### 21.12.2 段落 2：固定时长与立即续接

- `对象`：fixed length、one month or less、consistency、next Sprint starts immediately
- `关系`：固定长度保护节奏一致性；Sprint 连续相接形成持续运转
- `解剖结论`：这段把 Sprint 变成连续心跳，而不是离散项目片段

#### 21.12.3 段落 3：所有必要工作都在 Sprint 内发生

- `对象`：Product Goal、Planning、Daily、Review、Retrospective
- `关系`：实现产品目标所需的正式事件全部被放进 Sprint 容器内
- `解剖结论`：这段说明 Sprint 不是只包开发期，它包的是完整检视周期

#### 21.12.4 段落 4：Sprint 内四条运行约束

- `约束 1`：不能做危及 `Sprint Goal` 的变更
- `约束 2`：质量不能下降
- `约束 3`：`Product Backlog` 可按需 refinement
- `约束 4`：随着学习增加，可与 PO 澄清或重新协商范围
- `解剖结论`：这四条一起定义了“有弹性但不失控”的 Sprint 边界

#### 21.12.5 段落 5：为什么至少每月形成一次 inspect/adapt

- `对象`：predictability、monthly cadence、risk、complexity、shorter Sprints、short project
- `关系`：较短 Sprint 提供更多学习循环并限制风险暴露窗口
- `解剖结论`：这段解释了 Sprint 长度与学习频率之间的直接关系

#### 21.12.6 段落 6：预测工具不是经验主义替代品

- `对象`：burn-down、burn-up、cumulative flow、empiricism、forward-looking decisions
- `关系`：图表可用，但不能替代基于已发生事实的判断
- `边界`：Scrum 不把预测图表上升为标准核心对象
- `解剖结论`：这段在给度量工具降级，防止团队迷信图表

#### 21.12.7 段落 7：Sprint 取消权的归属

- `对象`：obsolete `Sprint Goal`、cancel Sprint、`Product Owner`
- `关系`：只有 PO 有权在目标失效时取消 Sprint
- `解剖结论`：这段把取消权和方向责任绑定在一起

### 21.13 Sprint Planning：Planning 小节逐段对象化

#### 21.13.1 段落 1：Planning 的启动作用

- `对象`：work to be performed、resulting plan、entire Scrum Team collaborative work
- `关系`：Planning 负责启动 Sprint，并由整个 Scrum Team 协作形成计划
- `解剖结论`：这段排除了“外部替团队排工”的默认想象

#### 21.13.2 段落 2：PO 的准备责任与他人建议输入

- `对象`：most important PBIs、map to `Product Goal`、invite other people for advice
- `关系`：PO 保证讨论围绕高价值工作展开；外部人可提供建议，但不替代 Scrum Team 做承诺
- `解剖结论`：这段把价值输入和决策边界分开了

#### 21.13.3 段落 3：Planning 用三个主题组织

- `对象`：Topic One / Topic Two / Topic Three
- `关系`：Planning 不是一锅讨论，而是先价值、再范围、再做法
- `解剖结论`：这段其实定义了 Planning 的内部结构

#### 21.13.4 Topic One：为什么这轮 Sprint 有价值

- `对象`：PO proposal、product value and utility、`Sprint Goal`
- `关系`：PO 提出本轮如何提升价值；整个团队协作形成 `Sprint Goal`
- `约束`：`Sprint Goal` 必须在 Planning 结束前确定
- `解剖结论`：这段把 `Sprint Goal` 定位为 Planning 的强制输出，而不是可选备注

#### 21.13.5 Topic Two 第一段：本轮能做什么

- `对象`：selected PBIs、discussion with PO、refinement during selection
- `关系`：Developers 在与 PO 讨论后选择条目；选择过程本身可以继续 refinement
- `解剖结论`：这段说明“选工作”和“理解工作”是一起发生的

#### 21.13.6 Topic Two 第二段：Forecast 的依据

- `对象`：past performance、upcoming capacity、`Definition of Done`、Sprint forecasts
- `关系`：预测可信度取决于团队对历史表现、可用容量和完成标准的掌握
- `解剖结论`：这段把 forecast 建立在经验与质量边界之上，而不是拍脑袋承诺

#### 21.13.7 Topic Three：怎么把选中的工作做出来

- `对象`：plan the work、Increment that meets `DoD`、decompose to smaller work items、sole discretion of Developers
- `关系`：Developers 为每个选中条目规划达到 Done 所需工作；细化方式由 Developers 自主决定
- `约束`：No one else tells them how to turn PBIs into Increments
- `解剖结论`：这段把执行路径自治权正式交给了 Developers

#### 21.13.8 段落 4：Sprint Backlog 的定义式

- `对象`：`Sprint Goal` + selected PBIs + plan for delivering them
- `关系`：三者 together 构成 `Sprint Backlog`
- `解剖结论`：这段明确说 Sprint Backlog 不是单纯任务表

#### 21.13.9 段落 5：Planning 的时间盒

- `对象`：eight hours for one-month Sprint、shorter Sprints shorter event
- `关系`：时间盒随 Sprint 时长缩放
- `解剖结论`：这段在约束 Planning 密度，而不是把思考做浅

### 21.14 Daily Scrum：Daily 小节逐段对象化

#### 21.14.1 段落 1：Daily 的正式目的

- `对象`：inspect progress toward `Sprint Goal`、adapt `Sprint Backlog`、adjust upcoming planned work
- `关系`：Daily 把目标进展检视和计划调整直接连起来
- `解剖结论`：这段说明 Daily 的中心对象不是人，而是 `Sprint Goal` 与 `Sprint Backlog`

#### 21.14.2 段落 2：方法可变，但焦点不可变

- `对象`：whatever structure and techniques they want、focus on progress、actionable plan for next day of work
- `关系`：形式可灵活，核心必须保住目标进展与次日行动计划
- `边界`：官方不要求固定三问法
- `解剖结论`：这段把 Daily 从话术模板中解放出来

#### 21.14.3 段落 3：Daily 对 focus 与 self-management 的作用

- `对象`：focus、self-management
- `关系`：Daily 通过日频对齐强化团队自治能力
- `解剖结论`：这段说明 Daily 不是同步成本，而是自治机制的一部分

#### 21.14.4 段落 4：PO / SM 什么时候以 Developers 身份参与

- `对象`：PO、SM、actively working on items in Sprint Backlog、Developers
- `关系`：只有当他们正在做 Sprint Backlog 中的工作时，才以 Developers 身份参与 Daily
- `解剖结论`：这段很细，但它清楚地保护了 Daily 的主体边界

#### 21.14.5 段落 5：15 分钟与后续讨论

- `对象`：15-minute timebox、further discussions
- `关系`：Daily 自身保持轻量；深入讨论可以在会后继续
- `解剖结论`：这段把控制点与问题求解过程拆开了

### 21.15 Sprint Review：Review 小节逐段对象化

#### 21.15.1 段落 1：Review 的正式目的

- `对象`：inspect outcome of the Sprint、determine future adaptations、results、key stakeholders、progress toward `Product Goal`
- `关系`：Review 连接当前结果、关键相关方和长期产品目标
- `解剖结论`：这段把 Review 定位成方向校准点

#### 21.15.2 段落 2：Review 期间到底要处理什么

- `对象`：what was accomplished、what has changed in the environment、what to do next、`Product Backlog`
- `关系`：通过回顾结果与环境变化，协作决定下一步，并据此调整 Backlog
- `解剖结论`：这段说明 Review 的输出必须落回 `Product Backlog`

#### 21.15.3 段落 3：Review 是工作会，不是演示秀

- `对象`：working session、avoid limiting it to a presentation
- `关系`：Review 的重点是共同判断，不是单向展示
- `解剖结论`：这段直接否定了“Review = demo meeting”的缩窄理解

#### 21.15.4 段落 4：Review 时间盒

- `对象`：four-hour timebox for one-month Sprint
- `关系`：Sprint 越短，Review 通常也越短
- `解剖结论`：这段继续把事件当作控制密度对象来处理

### 21.16 Sprint Retrospective：Retro 小节逐段对象化

#### 21.16.1 段落 1：Retro 的正式目的

- `对象`：plan ways to increase quality and effectiveness
- `关系`：Retro 面向团队工作系统本身，而不是面向产品方向
- `解剖结论`：这段一句话就把 Retro 与 Review 的边界切开了

#### 21.16.2 段落 2：Retro 要检视哪些东西

- `对象`：individuals、interactions、processes、tools、what went well、problems、how solved or not solved
- `关系`：Retro 不是泛泛而谈感受，而是系统性检查协作机制
- `解剖结论`：这段给出了 Retro 的完整观察面

#### 21.16.3 段落 3：改进必须尽快进入系统

- `对象`：most impactful improvements、as soon as possible、next Sprint Backlog
- `关系`：影响最大的改进应尽快处理，甚至直接进入下一轮 Sprint Backlog
- `解剖结论`：这段把改进行动从“以后再说”拉回到了正式工作对象中

#### 21.16.4 段落 4：Retro 结束一个 Sprint

- `对象`：concludes the Sprint、three-hour timebox
- `关系`：Retro 是 Sprint 的最后一个正式控制点
- `解剖结论`：这段说明 Sprint 的闭合，不只是结果交付，还包括工作方式修正

### 21.17 Scrum Artifacts：总前言两句话在说什么

#### 21.17.1 段落 1：工件代表工作或价值

- `对象`：artifacts、work、value、transparency of key information
- `关系`：工件不是文档负担，而是关键状态的透明承载体
- `解剖结论`：这段把工件和 Transparency 再次锁死

#### 21.17.2 段落 2：每个工件都绑定一个 commitment

- `对象`：commitment、artifact
- `关系`：承诺对象用于强化检视焦点和可解释性
- `解剖结论`：这段是后面 `Product Goal / Sprint Goal / DoD` 的总引言

### 21.18 Product Backlog：Backlog 小节逐段对象化

#### 21.18.1 段落 1：Backlog 的总定义

- `对象`：emergent ordered list、what is needed to improve the product、single source of work
- `关系`：Product Backlog 是持续演化、可排序的唯一工作来源
- `解剖结论`：这段把 Backlog 定位成产品改进总入口

#### 21.18.2 段落 2：Ready 不是官方对象，但可选条目必须足够透明

- `对象`：items that can be done within one Sprint、ready for selection、refinement、ongoing activity
- `关系`：可在一个 Sprint 内完成的条目会在 refinement 中逐步变得足够透明
- `边界`：Guide 没把 `Definition of Ready` 设成正式对象
- `解剖结论`：这段解释了为什么 refinement 重要，但 Ready 不是核心标准对象

#### 21.18.3 Commitment 段落 1：`Product Goal` 是 Backlog 的承诺

- `对象`：future state of the product、target、Backlog emerges to define what will fulfill it
- `关系`：`Product Goal` 提供长期方向，剩余 Backlog 围绕它生长
- `解剖结论`：这段正式确认 `Product Goal` 是 Product Backlog 的上位方向对象

#### 21.18.4 Commitment 段落 2：Product 本身的边界定义

- `对象`：product as vehicle to deliver value、clear boundary、known stakeholders、well-defined users or customers
- `关系`：Product 不是抽象话题，而是有边界、有受众的价值载体
- `解剖结论`：这段非常重要，因为它给 `Product Goal` 提供了宿主对象

#### 21.18.5 Commitment 段落 3：`Product Goal` 的时间尺度

- `对象`：long-term objective、must fulfill or abandon before taking on the next
- `关系`：同一时刻只维持一个当前 Product Goal；达成或放弃后再切换下一目标
- `解剖结论`：这段给 Product Goal 加上了排他性与阶段性边界

### 21.19 Sprint Backlog：当前 Sprint 工作模型的逐段对象化

#### 21.19.1 段落 1：Sprint Backlog 的组成

- `对象`：`Sprint Goal`、selected PBIs、actionable plan for delivering the Increment
- `关系`：Sprint Backlog 由目标、条目、计划三部分共同构成
- `解剖结论`：这段再次确认 Sprint Backlog 不是纯任务板

#### 21.19.2 段落 2：by and for Developers 的实时视图

- `对象`：by and for the Developers、real-time picture、updated throughout the Sprint、enough detail for Daily Scrum
- `关系`：Sprint Backlog 属于 Developers，并应随着学习不断更新
- `解剖结论`：这段把 Sprint Backlog 的所有权、更新频率和透明度要求一次写全了

#### 21.19.3 Commitment 段落：`Sprint Goal` 是 Sprint Backlog 的承诺

- `对象`：single objective、coherence、flexibility、negotiate scope with PO without affecting goal
- `关系`：`Sprint Goal` 给 Sprint Backlog 提供统一目标，并允许在守住目标时灵活谈范围
- `解剖结论`：这段正式定义了 Sprint 内“目标稳定、范围可调”的原则

### 21.20 Increment：结果对象的逐段解剖

#### 21.20.1 段落 1：Increment 的总定义

- `对象`：concrete stepping stone、`Product Goal`、additive to all prior Increments、verified、usable
- `关系`：Increment 是通向 Product Goal 的具体台阶，必须与既有产品状态可累加、可协同工作
- `解剖结论`：这段把 Increment 从“本轮产出物”提升为产品演进链上的新完成片段

#### 21.20.2 段落 2：多个 Increment 与发布边界

- `对象`：multiple Increments within a Sprint、sum of Increments、may be delivered prior to the end、Review not a gate
- `关系`：一个 Sprint 内可以形成多个 Increment；价值可以先于 Review 被交付
- `边界`：Review 不是发布审批门
- `解剖结论`：这段直接阻止“只在 Sprint 最后一天才算有 Increment”的误读

#### 21.20.3 Commitment 标题段：`Definition of Done`

- `对象`：formal description、quality measures required for the product、moment an item meets DoD an Increment is born
- `关系`：`DoD` 规定了 Increment 诞生的质量边界
- `解剖结论`：这段把 Done 和 Increment 的成立条件绑定起来了

#### 21.20.4 段落 4：未满足 DoD 的条目如何处理

- `对象`：PBI not meeting DoD、cannot be released、cannot be presented at Sprint Review、returns to Product Backlog
- `关系`：不满足 DoD 的工作不能伪装成 Increment，也不能混入 Review 成果
- `解剖结论`：这段是在保护结果透明度，避免“半完成品也算完成”

#### 21.20.5 段落 5：组织标准与团队 DoD 的关系

- `对象`：organizational standards、minimum baseline、team-created DoD
- `关系`：若组织已有标准，团队 DoD 只能在其之上细化，不能低于它
- `解剖结论`：这段把 DoD 放进了组织治理上下文

### 21.21 End Note 与 Acknowledgements：为什么这部分不是规则对象，但仍有意义

#### 21.21.1 End Note：标准之外还有策略与补充实践

- `对象`：strategy、complementary practices
- `关系`：Guide 在结束处再次提醒：Scrum 不是完整经营与工程实践大全
- `解剖结论`：这部分虽然不是核心规则，但它再次强调了 Scrum 的边界意识

#### 21.21.2 Acknowledgements：来源说明不是规则正文

- `对象`：authors、contributors、history
- `边界`：这部分提供标准来源脉络，但不新增规范性对象
- `解剖结论`：它帮助理解标准出处，不直接改变 Scrum 的对象系统

### 21.22 把整份 Guide 的正文骨架再压缩一次

如果把这一轮逐段对象化再压缩成一张图，可以记成：

```text
Purpose        -> 先定义 Guide 的权威边界与适用边界
Definition     -> 给出 Scrum 的最小闭环
Theory         -> 给出 empiricism / lean 的工作原理
Values         -> 给出人际与行为前提
Scrum Team     -> 定义基本协作单元与三类责任主体
Events         -> 定义 inspect / adapt 的正式控制点
Artifacts      -> 定义透明载体与对应承诺
End Note       -> 再次声明边界：Scrum 需要与其他实践组合
```

从“标准正文解剖”的角度看，`Scrum Guide` 的写法非常克制：

- 它先定义边界
- 再定义最小闭环
- 再定义理论与价值观前提
- 再定义团队、事件、工件这三组可执行对象
- 最后再提醒你：不要把它误读成过程大全

这也解释了为什么 Scrum 文本很短，但误读极多：

- 它不是没写重点
- 而是把重点压缩到了对象、关系和约束的最小骨架里

---

## 小结

如果把整份文档再压缩一次，可以记成下面这组核心判断：

- Scrum 解决的是**复杂问题下的团队级价值协作**，不是全生命周期过程大全
- Scrum 的中心对象是 `Product`、`Goal`、`Increment`，不是会议本身
- `Sprint` 是心跳容器，四个正式事件围绕它形成 inspect / adapt 节奏
- `Product Backlog / Sprint Backlog / Increment` 通过 `Product Goal / Sprint Goal / DoD` 获得方向、焦点和质量边界
- `PO / Developers / SM` 不是职位目录，而是三种最小必要责任主体
- Scrum 故意不定义技术实践，所以工程上通常必须与 `XP`、`DevOps`、`Kanban` 等组合

更进一步说：

> Scrum 的本质，不是“把工作拆成两周一次”，而是“让团队在复杂环境中，用真实结果、固定节奏和清晰责任，持续地产生价值并持续修正自己”。

---

## 参考资料

### 1. Scrum 官方资料

- [The Scrum Guide](https://scrumguides.org/)
- [Scrum Guide HTML](https://scrumguides.org/scrum-guide.html)
- [Scrum Guide PDF (English)](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf)
- [Scrum Guide PDF (Chinese Simplified)](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-Chinese-Simplified.pdf)
- [Scrum Guide FAQ](https://scrumguides.org/faq.html)

### 2. Scrum 扩展资料

- [Evidence-Based Management Guide](https://www.scrum.org/resources/evidence-based-management-guide)
- [Scrum with Kanban](https://www.scrum.org/scrum-kanban)
- [Scaling Scrum / Nexus](https://www.scrum.org/resources/scaling-scrum)

### 3. 本仓库内的关联讨论文档

这些文档不是 `Scrum Guide` 正文本体，但在本篇写作时用于做结构对照、边界比较和对象抽象类比：

- [开发流程标准](./开发流程标准.md)
- [BPMN 2.0 讨论与对象抽象](./BPMN 2.0 讨论与对象抽象.md)
- [SPEM 2.0 讨论与对象抽象](./SPEM 2.0 讨论与对象抽象.md)
- [CMMI-DEV 讨论与对象抽象](./CMMI-DEV 讨论与对象抽象.md)
- [ISO-IEC 15504 讨论与对象抽象](./ISO-IEC 15504 讨论与对象抽象.md)
- [ISO 9001 讨论与对象抽象](./ISO 9001 讨论与对象抽象.md)
- [ISO-IEC-29110 讨论与对象抽象](./ISO-IEC-29110 讨论与对象抽象.md)
- [IEEE-12207 讨论与对象抽象](./IEEE-12207 讨论与对象抽象.md)
- [ISO-IEC-IEEE-15288 讨论与对象抽象](./ISO-IEC-IEEE-15288 讨论与对象抽象.md)
