# ISO/IEC 29110：讨论与对象抽象

> 本文的目标不是把 `ISO/IEC 29110` 的每个 task 都逐条翻译，也不是直接把标准抄成流程手册。
>
> 当前做两件事：
> 1. **先把 29110 的核心概念地基打牢**——哪些术语在说什么、哪些容易搞混
> 2. **再把 29110 理解为一个分层对象系统**——像 `BPMN 2.0`、`CMMI-DEV`、`15288` 一样，先看清“它服务谁、定义什么、如何成为标准、怎么落地”
>
> 你可以先把 `ISO/IEC 29110` 理解成：**一套面向极小型组织（VSE）的生命周期标准族，它通过 Profile 机制，从 `12207` / `15288` / `15289` 中裁出一组“小团队真正能执行”的最小过程集，并配套规范、指南和符合性认证机制。**
>
> 本文所参考的 PDF 与建议阅读顺序，统一放在文末。

---

## 学习阶段总览

当前这份讨论与抽象文档，按 6 个阶段展开：

0. **第零阶段：概念地基**
   - 把 `VSE`、`Profile`、`Profile Group`、`Process`、`Work Product`、`Conformity` 等关键概念逐个讲清楚
   - 把最容易混淆的术语做对照辨析
   - 确保后续阅读不因术语含混而偏移
1. **第一阶段：整体架构——把 29110 看成一个分层系统**
   - 回答 29110 是什么
   - 建立“它是面向 VSE 的标准族，不是一份单独流程模板”的基本认识
   - 用 BPMN 同款“分层系统”视角看全景
2. **第二阶段：对象系统——29110 到底由哪些对象构成**
   - 理解 `VSE → Profile Group → Profile → Process → Activity/Event → Task` 的主干关系
   - 理解 `Role`、`Work Product`、`Repository`、`Baseline` 如何横向约束整个体系
3. **第三阶段：Basic Profile——29110 的最小可执行骨架**
   - 理解 `PM`（项目管理）与 `SI`（软件实现）两过程
   - 理解 Activity、Task、Role、Work Product 如何共同组成“够用的工程治理”
4. **第四阶段：Agile 与 29110——不是替代，而是映射与强化**
   - 理解 `5-4` 为什么不是“抛弃 Basic”，而是把 Basic 的 outcomes 映射到敏捷事件
   - 理解 `Sprint`、`Backlog`、`Increment` 如何进入 29110 的对象系统
5. **第五阶段：符合性与认证——29110 如何被审核与声明符合**
   - 理解 `Conformity Assessment`、`Certification Scheme`、`Certification Body`
   - 理解 29110 认证的是“过程符合性”，不是“产品本身合格”
6. **第六阶段：29110 与 12207 / 15288 / 敏捷方法的关系**
   - 理解 29110 的来源、边界和适用场景
   - 理解为什么它特别适合小团队，但不等于替代大标准

---

## 第零阶段：概念地基

> 在进入过程和结构细节之前，先把 29110 里最核心的术语逐个讲清楚。
>
> 这样做的理由很简单：**如果术语含混，后面的理解一定会偏移。**
>
> 这一阶段不要求你记住全部条款，但要求你在遇到这些词时，不再凭直觉猜。

---

### 0.1 29110 的六层对象关系图

29110 不是一份“轻量流程文档”，而是一个由受众、裁剪、过程、制品、指南、认证共同构成的六层对象体系：

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    29110 的六层对象体系                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  第一层：受众与裁剪对象                                              │
│  ───────────────────────────────────────────────                    │
│  VSE                     —— 极小型组织（通常 ≤ 25 人）               │
│  Profile                 —— 面向特定场景裁出来的标准子集             │
│  Profile Group           —— 一组相关 Profile 的集合                 │
│  Generic Profile Group   —— 通用渐进路线（Entry/Basic/...）         │
│  Specific Profile Group  —— 特定领域/行业的专门化路线               │
│                                                                     │
│  第二层：过程与执行对象                                              │
│  ───────────────────────────────────────────────                    │
│  Process                 —— 过程（如 PM / SI）                      │
│  Activity                —— 过程中的工作块                          │
│  Event                   —— 敏捷语境中的事件化工作块                │
│  Task                     —— 最具体的执行动作                       │
│  Role                    —— 责任角色                                │
│  Work Product            —— 过程产生和维护的制品                    │
│                                                                     │
│  第三层：制品治理对象                                                │
│  ───────────────────────────────────────────────                    │
│  Work Product State      —— 制品状态（approved / baselined / ...）  │
│  Repository              —— 项目制品的持久化存储                    │
│  Baseline                —— 稳定版本/基线                           │
│  Traceability Record     —— 需求/设计/测试/实现间的追踪关系         │
│                                                                     │
│  第四层：标准文档对象                                                │
│  ───────────────────────────────────────────────                    │
│  Overview / Vocabulary   —— 总览与术语                              │
│  Framework / Taxonomy    —— Profile 的准备框架与分类逻辑            │
│  Profile Specification   —— 某类 Profile 的要求规范                │
│  Guideline               —— 如何实施 Profile 的指导文档             │
│  Deployment Package      —— 用于加速落地的一组实施工件             │
│                                                                     │
│  第五层：评估与认证对象                                              │
│  ───────────────────────────────────────────────                    │
│  Conformity Assessment   —— 对要求是否满足的证明                    │
│  Certification Scheme    —— 认证规则体系                            │
│  Certification Body      —— 实施认证的第三方机构                    │
│  Audit / Auditor         —— 审核活动与审核人员                      │
│  Process Capability      —— 过程能力画像                            │
│                                                                     │
│  第六层：演进与方法对象                                              │
│  ───────────────────────────────────────────────                    │
│  Entry / Basic /         —— Generic Profile Group 的渐进路线        │
│  Intermediate / Advanced                                              │
│  Agile Guideline         —— Basic 的敏捷化增强与映射                │
│  Organizational Mgmt     —— 组织管理 profile 路线                  │
│  Service Delivery        —— 服务交付 profile 路线                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

这张图的意义在于：

- 29110 不只是“给小团队一个流程模板”，而是一个从**对象定义 → 过程规范 → 制品治理 → 指南落地 → 符合性认证**的完整体系
- 每一层回答不同的问题：谁在用、裁什么、怎么做、产出什么、怎么证明、如何演进
- 只有先看清这个整体，后面学习 `Basic Profile` 或 `Agile Guidelines` 时才知道自己在理解哪一层
- **29110 的关键不是“轻”，而是“裁剪后仍能被治理、被复用、被认证”** `[综合归纳]`

---

### 0.2 核心概念清单

下面把 29110 最重要的术语，按六层分组，逐个讲清楚。

#### 第一组：受众与裁剪

**VSE——29110 服务的核心对象**

- `VSE (Very Small Entity)` 指企业、组织、部门或项目，通常 **最多 25 人** `[直接支持]`
- 29110 的出发点不是“任何团队都用同一套标准”，而是承认小团队在人数、预算、时间、方法经验上都有约束 `[直接支持]`
- 它特别针对那些**没有能力自己裁剪 12207 / 15288** 的团队 `[直接支持]`

> 一句话：**29110 不是“小团队版大厂流程”，而是“为不会做复杂裁剪的小团队准备的标准入口”。**

**Profile——标准子集化的核心机制**

- `Profile` 是从合适的国际标准中裁出的一个子集 `[直接支持]`
- 这个子集不是随便选出来的，而是把 `processes / outcomes / activities / tasks` 组合起来，完成某个特定功能 `[直接支持]`
- 29110 的“轻量”不是删掉治理，而是通过 Profile 机制**只保留必要部分** `[综合归纳]`

> 一句话：**29110 的最小结构单元不是“流程图”，而是 Profile。**

**Profile Group——Profile 不是单兵，而是成组出现**

- `Profile Group` 是一组相互关联的 profile `[直接支持]`
- 它们之间的关联可以来自：
  - 过程组成关系
  - 能力等级递进关系
  - 或二者兼有 `[直接支持]`
- 因此，29110 不是“单文档”，而是“按 profile group 组织起来的系列” `[综合归纳]`

**Generic Profile Group——通用小团队的主路线**

- `Generic Profile Group` 适用于**不开发关键安全/关键业务系统**的普通 VSE `[直接支持]`
- 在 `1-1` 和 `1-2` 中，可以看到它的核心路线是：
  - `Entry`
  - `Basic`
  - `Intermediate`
  - `Advanced` `[直接支持]`
- 这是 29110 最核心、最通用的一条成长路径 `[综合归纳]`

**Entry / Basic / Intermediate / Advanced——渐进式能力路线**

- `Entry Profile`：面向初创 VSE，或单个小项目（如少于 6 人月） `[直接支持]`
- `Basic Profile`：面向“单个团队开发单个产品”的 VSE `[直接支持]`
- `Intermediate Profile`：面向并行开展多个项目、多个工作团队的 VSE `[直接支持]`
- `Advanced Profile`：面向希望持续发展、增强竞争力的 VSE `[直接支持]`

> 一句话：**29110 不是一步到位的大模型，而是一条为 VSE 设计的渐进升级路线。**

---

#### 第二组：过程与执行

**Process——29110 的过程不是阶段，而是责任单元**

- `Process` 被定义为一组相互关联或交互的 activity，用于把输入转换成输出 `[直接支持]`
- 在 `Basic Profile` 中，软件工程主线被压缩为两个过程：
  - `PM` — Project Management
  - `SI` — Software Implementation `[直接支持]`
- 这两个过程不是顺序阶段，而是**责任维度**：一个管项目，一个管软件实现 `[综合归纳]`

**Activity——过程内部的工作块**

- `Activity` 是一组内聚的 task `[直接支持]`
- 在 `5-1-2` 中，`PM` 和 `SI` 都被分解为多个 activity `[直接支持]`
- 例如 `SI` 被分成：
  - `SI.01` 软件实现启动
  - `SI.02` 软件需求分析
  - `SI.03` 软件架构与详细设计
  - `SI.04` 软件构造
  - `SI.05` 软件集成与测试
  - `SI.06` 软件产品组装 `[直接支持]`

**Event——敏捷语境下的活动化表达**

- 在 `5-4` 中，标准没有直接抛弃 `PM/SI`，而是把过程结果映射到一组敏捷事件 `[直接支持]`
- 典型事件包括：
  - 项目愿景会议
  - 估算会议
  - Sprint Planning
  - Sprint
  - Daily Scrum
  - Sprint Review
  - Sprint Retrospective `[直接支持]`
- 因此，`Event` 可以理解为：**在敏捷语境中承载 outcomes 的工作块** `[综合归纳]`

**Task——29110 最具体的执行动作**

- `Task` 是 activity 中最具体的动作项 `[直接支持]`
- 在 29110 里，task 不只是“做某件事”，它总是带着：
  - 输入 work product
  - 输出 work product
  - 执行角色 `[直接支持]`
- 这意味着 29110 的最小治理单元其实是：

```text
Role + Task + Input WP + Output WP
```

> 一句话：**29110 不是只定义“过程”，而是把过程一直压到可执行的 task 粒度。**

---

#### 第三组：角色与制品

**Role——29110 通过角色而不是岗位名称来分配责任**

- `Role` 表示责任集合，而不是固定的人 `[综合归纳]`
- 在 `Basic Profile` 中可见的核心角色包括：
  - `CUS` — Customer
  - `AN` — Analyst
  - `DES` — Designer
  - `PR` — Programmer
  - `PJM` — Project Manager
  - `TL` — Technical Leader
  - `WT` — Work Team `[直接支持]`
- 在 `Agile` 指南中，则会出现：
  - `PO` — Product Owner
  - `SL` — Scrum Leader
  - `DT` — Developers `[直接支持]`

> 一句话：**29110 关心“谁承担哪类责任”，而不强制你一定按多少岗位编制。**

**Work Product——29110 的治理核心不是文档数量，而是制品对象**

- `Work Product` 在 29110 中不是附属物，而是过程治理的中心 `[综合归纳]`
- 在 `Basic Profile` 中，大量 task 都以 work product 为输入和输出 `[直接支持]`
- 典型 work product 包括：
  - `Project Plan`
  - `Requirements Specification`
  - `Software Design`
  - `Traceability Record`
  - `Test Cases and Test Procedures`
  - `Software Components`
  - `Software`
  - `Test Report`
  - `Maintenance Documentation`
  - `Product Operation Guideline`
  - `Software User Documentation`
  - `Acceptance Record` `[直接支持]`

**Repository / Baseline / State——制品是带状态的治理对象**

- 29110 不只关心“有没有制品”，还关心：
  - 它处于什么状态
  - 是否已 baselined
  - 是否存入 repository
  - 是否可追踪 `[直接支持]`
- 在 `5-1-2` 和 `5-4` 中都可见大量状态词：
  - `initiated`
  - `approved`
  - `reviewed`
  - `verified`
  - `validated`
  - `published`
  - `baselined`
  - `updated` `[直接支持]`
- 这说明 29110 的对象系统不是“静态文档列表”，而是**制品生命周期系统** `[综合归纳]`

> 一句话：**Work Product 在 29110 里更像“带状态的配置对象”，而不是“写不写都行的附件”。**

---

#### 第四组：标准文档体系

**Overview / Vocabulary——不是正文附录，而是认知入口**

- `1-1 Overview` 负责解释：
  - VSE 的问题是什么
  - 29110 的总体结构是什么
  - Profile catalog 如何组织 `[直接支持]`
- `1-2 Vocabulary` 负责统一整个系列的术语地基 `[直接支持]`

**Profile Specification——要求规范层**

- `4-x` 文档描述“某类 profile 的要求是什么” `[直接支持]`
- 以 `4-1` 为例，它给出 `Basic Profile` 的规范要求，并映射回基础标准 `[直接支持]`
- `4-1` 明确写到：其基本 profile 要求来自 `ISO/IEC 12207` 的子集，并给出了映射关系 `[直接支持]`

**Guideline——实施指导层**

- `5-x` 文档回答的是“怎么把这个 profile 真做出来” `[直接支持]`
- 例如 `5-1-2` 把 `Basic Profile` 展开为：
  - process purpose
  - process outcomes
  - roles
  - activities and tasks
  - work products
  - tools
  - annexes `[直接支持]`

**Deployment Package——标准落地的加速组件**

- `Deployment Package (DP)` 在术语里被定义为：为帮助 VSE 实施一组实践而开发的一组 artefacts `[直接支持]`
- 它的作用不是替代标准，而是降低标准落地门槛 `[综合归纳]`
- 在 `5-1-2` 中，`Annex E` 明确出现 `Deployment packages for the software Basic profile` `[直接支持]`

> 一句话：**29110 的文档体系不是“总纲 + 附件”，而是“规范层 + 指南层 + 落地包”的完整链条。**

---

#### 第五组：符合性与认证

**Conformity Assessment——证明要求被满足**

- `Conformity Assessment` 是“证明指定要求已被满足” `[直接支持]`
- 术语里特别说明：它可以包含 testing、inspection、validation、verification、certification、accreditation 等活动 `[直接支持]`
- 标准同时说明：本文件不直接定义“conformity”本身，也不等同于“compliance” `[直接支持]`

**Certification Scheme——认证不是随便审，而是有规则体系**

- `Certification Scheme` 是对某类对象适用的一组指定要求、规则和程序 `[直接支持]`
- `3-2` 就是在定义 29110 的 `Conformity certification scheme` `[直接支持]`
- 它关心的对象包括：
  - certification body
  - audit plan
  - audit team
  - client / auditee
  - decision making
  - certification documentation `[直接支持]`

**Certification Body——第三方认证主体**

- `Certification Body` 是运行 certification scheme 的第三方 conformity assessment body `[直接支持]`
- 这意味着 29110 的正式认证逻辑本质上是**第三方过程认证** `[综合归纳]`

> 一句话：**3-2 关心的是“怎么认证一个 VSE 的过程符合 profile”，而不是“怎么判一个软件产品好不好”。**

---

### 0.3 最容易混淆的 12 组概念辨析

| 概念对 | 区别 |
|---|---|
| `VSE` vs `SME` | `VSE` 是 29110 的目标对象，通常 ≤ 25 人；`SME` 是更宽泛的中小企业概念 |
| `Profile` vs `Profile Group` | 前者是一个标准子集，后者是一组 profile 的集合 |
| `Generic Profile Group` vs `Specific Profile Group` | 前者是通用路线，后者是行业/领域专门化路线 |
| `Specification` vs `Guideline` | 前者定义要求，后者指导实现 |
| `Process` vs `Activity` vs `Task` | 过程是责任维度，Activity 是工作块，Task 是最具体动作 |
| `Activity` vs `Event` | 前者是通用生命周期工作块，后者是敏捷语境中的事件化工作块 |
| `Role` vs `Person` | Role 是责任集合，Person 是实际承担该责任的人 |
| `Work Product` vs `Document` | Work Product 是治理对象，Document 只是其中一种可能载体 |
| `Repository` vs `Baseline` | Repository 是存储，Baseline 是稳定版本状态 |
| `Conformity` vs `Compliance` | 前者是对指定要求满足的证明，后者更偏法规/制度/合同义务 |
| `Certification` vs `Assessment` | Assessment 是评估活动，Certification 是基于规则的第三方正式认定 |
| `Basic Profile` vs `Agile Guideline` | 前者给出最小过程骨架，后者把这套骨架映射到敏捷事件和制品流 |

---

### 0.4 第零阶段最值得背下来的 6 句话

1. **29110 的核心单位不是“流程模板”，而是 `Profile`。**
2. **29110 的核心受众不是所有团队，而是不会自己裁剪大标准的 `VSE`。**
3. **29110 的 Basic 主干不是一长串过程，而是 `PM + SI` 两过程。**
4. **29110 的治理核心不是“文档多不多”，而是 `Work Product + State + Repository + Baseline`。**
5. **29110 的 Agile 不是替代 Basic，而是把 Basic 的 outcomes 映射到敏捷事件。**
6. **29110 的认证对象是过程符合性，不是产品认证。**

---

### 0.5 第零阶段最容易犯的 6 个错误

#### 误解 1：把 29110 当成“简化版 12207 文本”

29110 的确大量来源于 `12207` / `15288` / `15289`，但它的重点不是重述，而是**把这些标准重组为 VSE 能实际执行的一套 profile 体系**。

#### 误解 2：把 Basic Profile 当成“瀑布流程”

`5-1-2` 明确说明它适用于 waterfall、iterative、incremental、evolutionary、agile 等任意生命周期 `[直接支持]`。Basic 规定的是治理骨架，不是单一方法论。

#### 误解 3：把 Agile 指南理解成“另起一套体系”

`5-4` 实际是在把 Basic 的 outcomes 映射到 agile events、roles、work products。它不是摆脱 Basic，而是**敏捷化解释 Basic**。

#### 误解 4：把 Work Product 理解成“文档负担”

在 29110 里，Work Product 不只是交差文件，而是输入输出、基线、追踪、审核证据的核心对象。

#### 误解 5：把 Certification 理解成“产品质量认证”

`3-2` 讨论的是 conformity certification scheme，也就是对 profile 符合性的第三方认证，而不是对最终软件产品的产品认证。

#### 误解 6：把 Entry / Basic / Intermediate / Advanced 看成顺序阶段

它们更像 profile 路线，而不是单个项目的顺序阶段。一个 VSE 可以根据自身场景选择进入点和目标。

---

### 0.6 第零阶段过关标准

如果你已经能稳定回答下面这些问题，就算通过：

- 29110 的核心服务对象是谁？
- 29110 的最小组织单位是什么？
- `Profile`、`Profile Group`、`Generic Profile Group` 的关系是什么？
- `Basic Profile` 为什么是 `PM + SI`？
- 为什么说 Work Product 是 29110 的治理中心？
- 29110 的认证认证的是什么？

---

## 第一阶段：把 29110 看成一个分层系统

29110 最容易被误解的地方在于：很多人只看到 `Basic Profile` 的任务表，就以为它只是“小团队过程手册”。

更好的理解方法，是先把它看成一个**分层系统**：

```text
┌──────────────────────────────────────────────────────────────────┐
│                       29110 整体框架                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  第一层：它服务谁、解决什么问题                                   │
│  ───────────────────────────────────────────────                 │
│  1. VSE             —— 小团队如何用得起标准                        │
│  2. Profile         —— 如何把大标准裁成小团队可用子集              │
│  3. Recognition     —— 如何让小团队也能被外部认可                  │
│                                                                  │
│  第二层：它用什么来表达                                           │
│  ───────────────────────────────────────────────                 │
│  1. Profile Group   —— 路线组织                                   │
│  2. Process         —— PM / SI 等过程                              │
│  3. Activity/Event  —— 工作块                                     │
│  4. Task            —— 具体执行动作                               │
│  5. Role / WP       —— 责任与制品                                 │
│                                                                  │
│  第三层：它如何成为标准族                                         │
│  ───────────────────────────────────────────────                 │
│  1. Overview / Vocabulary                                         │
│  2. Framework / Taxonomy                                          │
│  3. Profile Specification                                         │
│  4. Guideline / Deployment Package                                │
│  5. Certification Scheme                                          │
│                                                                  │
│  第四层：它如何落地                                               │
│  ───────────────────────────────────────────────                 │
│  1. Basic Profile     —— 最小可执行骨架                            │
│  2. Agile Guideline   —— 敏捷化运行方式                            │
│  3. Audit / Certify   —— 外部认可                                  │
│  4. Evolve            —— 从 Entry 到 Advanced 的演进               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

这张图的意义在于：

- 29110 的核心问题不是“流程画得清不清楚”，而是**小团队如何在资源有限的前提下拥有可治理、可证明的工程过程** `[综合归纳]`
- 它的“轻量”是通过 Profile 和 Guideline 做**标准级裁剪**，不是简单删流程 `[综合归纳]`
- 它最终不是只想让团队“做起来”，还想让团队**被认可** `[直接支持]`

---

### 1.1 第一层：29110 到底在表达什么

29110 试图回答的，不是“软件工程所有团队应该怎么做”，而是下面三个更具体的问题：

- 小团队怎样以可承担的成本使用国际标准？
- 小团队怎样定义一套最小但完整的生命周期过程？
- 小团队怎样向外部证明自己不是“随便做”，而是“按标准做”？

因此，29110 表达的核心不是“完整生命周期百科全书”，而是：

**VSE 场景下的标准化裁剪、可执行过程和外部可识别性。** `[综合归纳]`

---

### 1.2 第二层：29110 用什么来表达这些内容

29110 的表达骨架可以压缩成下面这条主链：

```text
VSE
  -> 选择/适用某个 Profile Group
    -> 采用某个 Profile
      -> 执行一组 Process
        -> 过程由 Activity / Event 组成
          -> Activity / Event 由 Task 构成
            -> Task 由 Role 执行
              -> Task 消费/产生 Work Product
                -> Work Product 进入 Repository，并以 State/Baseline 被治理
```

这个主链是理解 29110 的关键，因为它说明：

- 29110 不是“流程图式标准”
- 也不是“只看制度、忽略执行”的高层框架
- 它是**从受众对象一直压到执行粒度，并用 Work Product 把治理闭环起来的标准族** `[综合归纳]`

---

### 1.3 第三层：29110 为什么不只是“轻量流程模板”

很多人以为 29110 只是一本“小团队开发指南”。这种理解只对了一部分。

29110 至少包含以下五类内容：

1. **对象与术语层**
   - `1-2 Vocabulary` 统一关键术语
2. **标准结构层**
   - `1-1 Overview` 给出 profile catalog 与系列结构
3. **要求规范层**
   - `4-x` 文档定义哪些要求必须满足
4. **实施指导层**
   - `5-x` 文档展开 roles、tasks、work products、examples
5. **认证与符合性层**
   - `3-x` 文档定义如何做 assessment / certification

所以，29110 不是一本单独的“指导手册”，而是：

**总览 + 术语 + 规范 + 指南 + 认证机制** 的组合体系。 `[综合归纳]`

---

### 1.4 第四层：29110 最终想怎么落地

从标准导言反复出现的表述可以看出，29110 的最终落地点有三个：

- 让 VSE 能建立**可运行的生命周期过程** `[直接支持]`
- 让 VSE 能通过 profile 实施和审核，获得**外部认可** `[直接支持]`
- 让 VSE 能在不牺牲可治理性的前提下，按 waterfall / iterative / incremental / agile 等方式工作 `[直接支持]`

换句话说：

- 它既不是纯合规文档
- 也不是纯敏捷实践指南
- 它更像是**“VSE 版生命周期治理骨架 + 落地方法包”** `[综合归纳]`

---

## 第二阶段：29110 的对象系统

### 2.1 先用一张总图看对象关系

```text
+----------------------+
|         VSE          |
|  极小型组织/部门/项目 |
+----------+-----------+
           |
           | 采用
           v
+----------------------+
|    Profile Group     |
| Generic / Specific   |
+----------+-----------+
           |
           | 选择一个 profile
           v
+----------------------+
|       Profile        |
| Entry / Basic / ...  |
+----------+-----------+
           |
           | 定义/约束
           v
+----------------------+
|       Process        |
|     PM / SI / ...    |
+----------+-----------+
           |
           | 分解为
           v
+----------------------+
|   Activity / Event   |
+----------+-----------+
           |
           | 分解为
           v
+----------------------+
|        Task          |
+-----+----------+-----+
      |          |
      | 执行     | 输入/输出
      v          v
+-----------+  +----------------+
|   Role    |  |  Work Product  |
+-----------+  +--------+-------+
                        |
                        | 进入
                        v
                 +-------------+
                 | Repository  |
                 +-------------+
                        |
                        | 受状态/基线控制
                        v
                 +-------------+
                 |State/Baseline|
                 +-------------+
```

这个对象关系图的关键在于：

- `Profile` 是总开关
- `Process` 是治理骨架
- `Task` 是最小执行单元
- `Work Product` 是治理证据和协作媒介

也就是说，29110 不是单纯“看过程”，而是一个**以 Work Product 为抓手的过程对象系统**。 `[综合归纳]`

---

### 2.2 Profile 系统：29110 的第一主轴

从对象抽象角度看，29110 的第一主轴是：

```text
VSE -> Profile Group -> Profile
```

这条主轴回答的是：

- 谁在用标准？
- 用哪一组 profile？
- 当前采用哪个 profile？

这里最重要的直觉是：

- `Profile` 是**标准裁剪结果**
- `Profile Group` 是**裁剪路线组织方式**
- `VSE` 是**被服务对象**

所以 29110 与 `12207` / `15288` 的最大差别之一是：

> `12207/15288` 先给你完整过程宇宙，然后让你自己裁；`29110` 先替你裁好几条典型路线，再让你选。 `[综合归纳]`

---

### 2.3 Process 系统：29110 的第二主轴

在 `Basic Profile` 中，过程系统被压缩为两个核心过程：

- `PM` — 项目管理
- `SI` — 软件实现

这两个过程的关系不是：

- PM 在前、SI 在后
- 管理是一章、实现是一章、彼此没关系

而是：

- `PM` 负责计划、监控、调整、交付、结项
- `SI` 负责需求、设计、构造、集成、测试、组装
- 两者通过 project plan、delivery instructions、acceptance record、repository 等对象交织在一起 `[直接支持]`

所以可以把 29110 的 Basic 看成：

```text
一个管理过程 + 一个工程实现过程
         通过共享 work products 彼此联动
```

---

### 2.4 Role 系统：29110 的第三主轴

29110 的角色系统有两个特点：

- 它按**责任**来定义，不按组织架构来定义 `[综合归纳]`
- 它默认 VSE 可以一人兼多角 `[综合归纳]`

在 `Basic Profile` 中，可以粗略分成三类：

- **外部确认类角色**：`CUS`
- **治理协调类角色**：`PJM`、`TL`
- **工程执行类角色**：`AN`、`DES`、`PR`、`WT`

在 `Agile` 指南中，则加入敏捷化角色：

- `PO`
- `SL`
- `DT`

这说明：

- 29110 不把角色绑死在单一方法论上
- 它允许在同一治理骨架上切换角色命名和职责组织方式 `[综合归纳]`

---

### 2.5 Work Product 系统：29110 的第四主轴

如果只从对象抽象角度看，29110 最值得单独抽出来看的对象，不是 `Process`，而是 `Work Product`。

原因有三：

1. **Task 以 Work Product 为输入输出组织** `[直接支持]`
2. **Traceability、Baseline、Repository 都围绕 Work Product 运作** `[直接支持]`
3. **Audit / Conformity 的客观证据，本质上也高度依赖 Work Product** `[综合归纳]`

因此，29110 里的 Work Product 有三重身份：

- 协作媒介
- 治理载体
- 审核证据

这也是为什么 29110 虽然面向小团队，却仍然保持了相当强的工程可追溯性。 `[综合归纳]`

---

## 第三阶段：Basic Profile——29110 的最小可执行骨架

### 3.1 为什么说 Basic 是 29110 的主入口

从当前可读到的文档体系看，`Basic Profile` 是 29110 最适合深入理解的一层，因为它同时具备：

- 规范层：`4-1`
- 指南层：`5-1-2`
- 可延伸层：`5-4` 敏捷化、Annex 中的测试/安全/可达性/支持过程等扩展 `[直接支持]`

因此，`Basic` 可以视为：

**29110 最小而完整的生命周期骨架。** `[综合归纳]`

---

### 3.2 PM：项目管理过程到底负责什么

在 `5-1-2` 中，`PM` 关注的不是“高层管理思想”，而是非常具体的项目治理动作，例如：

- 范围与交付物界定
- 资源与任务分配
- 成本/进度可行性检查
- 风险识别与监控
- 版本控制策略
- 进展监控与偏差纠正
- 客户与团队评审
- 项目收尾与验收 `[直接支持]`

你可以把 `PM` 理解成：

**保证项目从计划到交付都处于可控状态的治理过程。**

它不是抽象管理理念，而是带有具体输入输出和制品约束的一套 task 系统。

---

### 3.3 SI：软件实现过程到底负责什么

`SI` 的 purpose 在 `5-1-2` 中表达得很明确：

- 对新建或修改的软件产品，系统地开展分析、设计、构造、集成、测试，以及工作产品组装 `[直接支持]`

对应 outcomes 也非常工程化：

- 软件需求被定义、校验、批准、基线化、沟通
- 架构与详细设计被建立，并与需求保持一致和可追踪
- 软件组件被实现并做单元测试
- 软件被集成、验证、缺陷修正
- 软件产品及相关文档被集成、基线化并存入项目仓库
- 所有必要 work products 的 verification / validation 都被执行并留痕 `[直接支持]`

因此：

- `SI` 不是“写代码过程”
- 它是一个从 requirements 到 assembled product 的完整软件实现链路

---

### 3.4 SI 的活动骨架

`5-1-2` 给出的 `SI` 活动骨架可以压缩成下面这条链：

```text
SI.01 软件实现启动
  -> SI.02 软件需求分析
    -> SI.03 软件架构与详细设计
      -> SI.04 软件构造
        -> SI.05 软件集成与测试
          -> SI.06 软件产品组装
```

这条链的关键不在顺序感，而在对象流：

- 需求被建立
- 设计被建立
- 组件被构造
- 软件被集成
- 文档被补齐
- 产品被装配
- 相关 work products 被基线化并入库 `[直接支持]`

这说明 Basic 的本质不是“阶段门模型”，而是**围绕工作产品推进的软件实现主链**。 `[综合归纳]`

---

### 3.5 Work Product 为什么是 Basic 的中心

从 `SI.04` 到 `SI.06` 的任务表能非常清楚看出，Basic 的治理并不是“任务做完就结束”，而是：

- 任务做完后，要更新 traceability record
- 要把 software components、test cases、test report 等并入 baseline
- 要把 work products 存入 project repository
- 要形成 software product、maintenance documentation、operation guideline、user documentation 等可交付对象 `[直接支持]`

所以，Basic 的运行逻辑更接近：

```text
任务推进 -> 制品产生 -> 制品校验 -> 制品基线化 -> 制品入库 -> 形成可交付软件产品
```

这也是为什么 29110 虽然说自己是 VSE 标准，但它保留了相当强的配置管理和追踪意识。 `[综合归纳]`

---

## 第四阶段：Agile 与 29110——不是替代，而是映射与强化

### 4.1 为什么说 5-4 不是“另起炉灶”

`5-4` 的目录和内容结构说明得非常清楚：它不是重新发明一套过程，而是把 `Basic Profile` 的过程结果与敏捷事件对接起来 `[直接支持]`。

例如文中可以直接看到：

- `Project management process of Basic profile and the agile events...`
- `Software implementation process of Basic profile and the agile events...` `[直接支持]`

这意味着：

- `Basic` 仍是骨架
- `Agile` 是对骨架的事件化、节奏化、角色化增强

> 一句话：**5-4 不是“Basic 的替代品”，而是“Basic 的敏捷运行方式”。**

---

### 4.2 Agile 指南的对象切换：从 Activity 到 Event

在 `5-4` 中，标准把大量工作组织为事件，例如：

- project vision meeting
- estimation meeting
- sprint planning
- sprint
- daily scrum
- sprint review
- sprint retrospective `[直接支持]`

这里最重要的对象切换是：

- `Basic` 偏 `Process -> Activity -> Task`
- `Agile` 偏 `Process -> Event -> Task`

但注意：

- 上层 process 仍然存在
- task 仍然有输入输出
- work product 仍然是治理核心

也就是说，29110 在 Agile 里变的不是“有没有治理”，而是“工作块的组织方式”。 `[综合归纳]`

---

### 4.3 Agile 的角色映射

从 `5-4` 可读到，Agile 语境中至少有三类核心角色：

- `PO` — Product Owner
- `SL` — Scrum Leader
- `DT` — Developers `[直接支持]`

同时文档也保留了 `TL`、`WT` 等 Basic 语义。特别是 `SL` 的职责说明非常关键：

- 确保 Scrum 被使用
- 帮助 PO 理解敏捷
- 帮助 backlog 优先级管理
- 帮助 developers 成为自组织、多职能团队
- 推动编码最佳实践
- 推动回顾中发现的改进落地 `[直接支持]`

这说明：

- Agile 指南没有把 29110 降成“只开会”
- 它依然把工程纪律、改进闭环和 backlog 治理放在核心位置

---

### 4.4 Agile 的 Work Product 体系

`5-4` 最值得注意的是，它没有弱化 Work Product，反而把敏捷对象纳入了 Work Product 系统：

- `Product Backlog`
- `Sprint Backlog`
- `Increment`
- `Burndown Chart`
- `Meeting Record`
- `Change Request`
- `Validation Results`
- 与 Basic 对应的多种 WP `[直接支持]`

同时，`5-4` 还给出 Work Product 的状态体系，如：

- `done`
- `developed`
- `delivered`
- `reviewed`
- `selected`
- `to verify`
- `verified`
- `validated`
- `published`
- `baselined` `[直接支持]`

这说明一个重要事实：

> 在 29110 里，Agile 不是“少文档”，而是“把敏捷对象也纳入标准化制品治理”。 `[综合归纳]`

---

## 第五阶段：符合性与认证

### 5.1 29110 的认证对象到底是什么

从 `3-2` 的标题和内容可以看出，29110 的认证对象不是产品，而是：

- 某个 VSE 的过程
- 对某个 profile 规范的满足情况
- 在 certification scheme 下的第三方认定 `[直接支持]`

也就是说，29110 的认证逻辑是：

```text
VSE 是否按某个 Profile 的要求运行自己的过程，
并能提供足够证据支撑这一点。
```

因此，它更接近：

- 过程符合性认证
- 组织过程能力的受控认定

而不是：

- 某个软件功能好不好
- 某个产品是否无缺陷

---

### 5.2 3-2 的对象系统

从 `3-2` 的目录可见，它关心的对象包括：

- `Certification body personnel`
- `Audit plan`
- `Audit team selection and assignments`
- `On-site and remote audits`
- `Initial certification audit`
- `Results of evaluation`
- `Decision making`
- `Certification documentation`
- `Directory of certified VSEs`
- `Complaints and appeals` `[直接支持]`

这意味着，29110 的认证不是简单打勾，而是一个完整的第三方审核过程系统。 `[综合归纳]`

---

### 5.3 为什么说 29110 不是“自说自话式标准”

29110 最有意思的一点是：

- `4-x` 定义要求
- `5-x` 说明怎么做
- `3-x` 定义如何审核是否真的做到了

所以它天然形成了一个闭环：

```text
规范要求 -> 实施指南 -> 工作产品证据 -> 评估/认证
```

这和很多“只有指南、没有判定边界”的实践框架很不一样。 `[综合归纳]`

---

## 第六阶段：29110 与 12207 / 15288 / 敏捷方法的关系

### 6.1 29110 与 12207 / 15288 的关系

从 `1-1`、`1-2`、`4-1`、`5-1-2`、`3-2` 多处都能看到明确表述：

- profile 的来源包括 `ISO/IEC/IEEE 12207`
- 也包括 `ISO/IEC/IEEE 15288`
- 以及信息制品标准 `ISO/IEC/IEEE 15289` `[直接支持]`

同时，`4-1` 的 Annex A 还明确把 `Basic Profile` 的 requirement 映射回 `12207:2008` 的具体条目 `[直接支持]`。

因此：

- 29110 不是和 `12207/15288` 平行竞争的另一套过程宇宙
- 它更像是**基于这些大标准做出的 VSE 友好型裁剪与组织** `[综合归纳]`

---

### 6.2 29110 与 12207 的关键差异

可以把它们粗略对比如下：

| 维度 | 12207 | 29110 |
|---|---|---|
| 受众 | 任意软件组织 | 极小型组织 VSE |
| 范围 | 完整软件生命周期过程体系 | 从大标准中裁剪出的 profile 体系 |
| 使用前提 | 组织需自行裁剪 | 标准已预设典型裁剪路线 |
| 落地颗粒度 | 过程/活动/任务框架 | 过程 + 任务 + 角色 + 工作产品 + 指南 |
| 认证逻辑 | 可作为评估参考 | 直接配套 conformity certification scheme |

> 一句话：**12207 是大框架，29110 是小团队进入大框架的门。**

---

### 6.3 29110 与 Agile 的关系

29110 与 Agile 并不冲突，原因有三：

1. `1-1`、`1-2`、`5-1-2`、`5-4` 都说明 29110 可以用于 waterfall、iterative、incremental、evolutionary、agile 等生命周期 `[直接支持]`
2. `5-4` 明确把 Basic outcomes 映射到敏捷事件 `[直接支持]`
3. Agile 指南保留了制品状态、追踪、验证、基线、仓库等治理要素 `[直接支持]`

所以更准确的说法是：

- 29110 不是反敏捷标准
- 它是在做**标准化敏捷** 或 **可认证敏捷** `[综合归纳]`

---

### 6.4 29110 与 Deployment Package 的关系

如果把标准正文看成“应该做什么”，那么 `Deployment Package` 更像：

- 怎么快速上手
- 怎么减少解释成本
- 怎么给 VSE 一个更低门槛的实施入口

因此，DP 在 29110 中是一个很关键但经常被忽略的对象：

> 它代表 29110 不只想成为“被理解的标准”，还想成为“能被拿来用的标准”。 `[综合归纳]`

---

## 把 29110 压缩成一个适合记忆的框架

### 六层一线

**六层：**

1. `VSE / Profile` —— 服务对象与裁剪对象
2. `Process / Activity / Event / Task` —— 执行骨架
3. `Role / Work Product` —— 协作与治理对象
4. `Repository / Baseline / State` —— 制品治理机制
5. `Specification / Guideline / DP` —— 标准到落地的文档体系
6. `Assessment / Certification` —— 外部认可机制

**一线：**

```text
VSE
  -> 采用 Profile
    -> 执行 Process
      -> 分解为 Activity/Event 与 Task
        -> 由 Role 处理 Work Product
          -> 进入 Repository / Baseline
            -> 支撑 Assessment / Certification
```

如果一定要用一句话压缩 29110，可以记成：

> **29110 = 面向 VSE 的标准化裁剪系统，它用 Profile 把大标准压缩成小团队可执行的过程骨架，并用 Work Product 与 Conformity 把它治理起来。**

---

## 第一遍学习 29110 时，应该先建立什么直觉

第一遍学习时，最重要的不是背 task 编号，而是先建立下面几条直觉：

- 29110 是“标准族”，不是单一标准文本
- `Profile` 是全体系的总开关
- `Basic Profile` 是主入口，核心是 `PM + SI`
- `Work Product` 才是 29110 治理闭环的中心
- `Agile` 不是替代，而是对 Basic 的事件化映射
- `Certification` 让 29110 从“指导团队做事”走向“团队可被外部认可”

---

## 下一步应该怎么继续学习

### 路线 A：先深入 Basic Profile

适合当前最想解决的问题是：

- 小团队怎么真正把 29110 跑起来
- PM 与 SI 如何落地到具体工程活动
- 哪些 Work Product 是最低必要集

建议接着精读：

- `ISO IEC 29110-5-1-2 2025.pdf`
- `ISO IEC 29110-4-1 2018.pdf`

### 路线 B：先深入 Agile 映射

适合当前最想解决的问题是：

- 29110 与 Scrum / XP 怎么组合
- Backlog / Increment / Burndown 如何进入标准对象体系
- 如何做“可治理的敏捷”

建议接着精读：

- `ISO IEC 29110-5-4 2025.pdf`
- `ISO IEC 29110-1-2 2024.pdf`

### 路线 C：先深入符合性与认证

适合当前最想解决的问题是：

- 外部审核到底看什么
- 29110 如何做第三方认证
- 要准备哪些类型的证据

建议接着精读：

- `ISO IEC 29110-3-2 2018.pdf`
- `ISO IEC 29110-3-2 2018 Amd1 2025.pdf`

---

## 如果按 BPMN 的粒度继续展开，下一批章节应该怎么写

当前这份文档，已经完成了 `29110` 的总览层、对象地图层和主关系层。

如果继续往下写，最好的方式不是再横向补更多术语，而是像 `BPMN 2.0` 一样，沿着一条最稳定的主轴持续下钻，把对象之间的层次、边界和工程意义逐节讲透。

对 `29110` 来说，这条主轴最适合是：

```text
Basic Profile
  -> Purpose / Outcome
    -> PM / SI
      -> Activity
        -> Task
          -> Role / Work Product
            -> Repository / Baseline / Traceability
              -> Audit Evidence / Certification
```

这条线的好处在于：

- 它最贴近 `29110` 当前最成熟、最完整、最可执行的内容层
- 它能把 `Profile`、`Process`、`Work Product`、`Certification` 串成一条连续学习路径
- 它最容易形成类似 `BPMN` 的“先抓主轴，再逐对象展开”的阅读体验

### 建议补写的 8 个章节

下面这 8 个章节，不是随便罗列主题，而是按“先主干、再对象、再治理、再审核、最后映射”的顺序组织的。

1. **第七阶段：为什么应该先单独理解 `Basic Profile`**
   - 重点回答：为什么 `Basic` 是 `29110` 最稳定的学习入口
   - 明确 `Basic` 不是瀑布模板，而是最小治理骨架
   - 补上“第一遍学习 `Basic` 时，先不要做什么”
   - 作用类似于 `BPMN` 中“为什么应该先单独理解 `Process`”那一层

2. **第八阶段：`Basic Profile` 的最小可执行骨架**
   - 把 `Basic` 压缩成一条最小主链：

```text
Purpose
  -> Outcomes
    -> Activities
      -> Tasks
        -> Work Products
          -> Repository / Baseline
```

   - 回答 `29110` 到底是怎样从“过程目的”一路落到“可审计证据”的
   - 让读者先建立“骨架感”，再进入细节对象

3. **第九阶段：`Purpose`、`Outcome`、`Activity`、`Task` 到底是什么关系**
   - 这是 `29110` 最值得单独讲清的一组对象层次
   - 要明确：
     - `Purpose` 不是任务说明
     - `Outcome` 不是活动列表
     - `Activity` 不是过程全文
     - `Task` 才是最具体动作
   - 这一节的目标，是建立 `29110` 特有的“语义分层感”

4. **第十阶段：先把 `PM` 过程单独讲透**
   - 重点不是再重复“项目管理很重要”
   - 而是回答：`PM` 在 `29110` 里到底控制什么对象
   - 建议补写：
     - `PM` 的活动骨架
     - `PM` 的关键输入/输出 work product
     - `PM` 如何与 `SI` 通过共享制品联动
     - `PM` 为什么不是悬浮在工程之外的“管理层”

5. **第十一阶段：再把 `SI` 过程按活动骨架逐段展开**
   - 不只保留 `SI.01 -> SI.06` 的顺序链
   - 还要逐段回答：
     - 为什么先有启动，再有需求与设计
     - 构造、集成、测试、组装分别改变了什么对象状态
     - 哪些 work product 在各活动之间持续流转
   - 目标是把 `SI` 从“步骤链”讲成“对象流”

6. **第十二阶段：为什么 `Work Product` 才是 29110 的真正中心**
   - 这一节建议单独做成治理主轴
   - 可以继续拆成：
     - `Work Product` 的分类
     - `State` 为什么重要
     - `Repository` 控制的是什么
     - `Baseline` 为什么不是普通存档
     - `Traceability` 为什么让小团队仍然保有工程纪律
   - 这一节对应的是 `29110` 里最像“元对象系统”的部分

7. **第十三阶段：`Verification` / `Validation` / `Acceptance` / `Audit Evidence` 的边界**
   - 当前文档已经提到这些词，但还没有把它们当成一组需要辨析的对象来讲
   - 建议专门回答：
     - 谁在验证
     - 谁在确认可接受
     - 哪些 evidence 能支撑审核
     - 为什么“做过了”和“能证明做过了”不是一回事
   - 这一节会把 `29110` 从“过程说明”推进到“可审核治理”

8. **第十四阶段：`Basic` 与 `Agile` 的逐对象映射**
   - 现在文档已经说明 `5-4` 不是替代，而是映射
   - 下一步应该更细一层：
     - `Outcome` 如何映射到 agile events
     - `Product Backlog`、`Sprint Backlog`、`Increment` 分别进入哪类 work product 语义
     - `done` 与 `verified`、`validated`、`baselined` 的边界是什么
   - 这会让 `29110` 的“标准化敏捷”真正落到对象层，而不只是口号层

### 每一章内部，建议按同一种展开节奏来写

如果希望继续贴近 `BPMN 2.0` 的粒度感，那么后续每一章都可以尽量保持同一个节奏：

1. **先说这个对象或章节在全局里的位置**
2. **再说它与相邻对象的边界区别**
3. **再说它为什么在工程里必要**
4. **再说最容易犯的误解是什么**
5. **最后用一段小结把它压缩成可记忆结论**

这样写的好处是：

- 文档不会退化成“术语解释表”
- 每一章都会形成独立学习闭环
- 后续即使继续扩展，也不会把主线写散

### 如果只先补前三章，优先级建议如下

如果接下来不想一下子铺太开，而是想先补最关键的三章，那么推荐顺序是：

1. `为什么应该先单独理解 Basic Profile`
2. `Basic Profile 的最小可执行骨架`
3. `Purpose / Outcome / Activity / Task 到底是什么关系`

因为这三章一旦补上，整份 `29110` 文档就会从“总览做得很完整”，明显跃迁到“已经开始进入 BPMN 那种对象纵深”。

---

## 第七阶段：为什么应该先单独理解 `Basic Profile`

在 `29110` 的通用 profile 路线里，`Entry`、`Basic`、`Intermediate`、`Advanced` 各有自己的位置。

但如果当前目标是：**先把 `29110` 读成一个稳定的对象系统，而不是只记住若干术语或任务编号**，那么 `Basic Profile` 几乎总是最值得先单独停下来理解的一层。

原因并不是因为它“最高级”，也不是因为它“等于全部 29110”，而是因为：

- 它最完整地展示了 `29110` 如何从 `Profile` 一路落到 `Process / Activity / Task / Work Product`
- 它同时连通了规范层、指南层、敏捷映射层和认证视角 `[直接支持]`
- 它既足够小，适合 `VSE` 实际执行；又足够完整，能看出治理闭环 `[综合归纳]`
- 它最容易把 `29110` 从“小团队流程说明”纠正为“可治理、可证明的生命周期骨架” `[综合归纳]`

换句话说，如果把 `29110` 看成一门面向 `VSE` 的生命周期语言，那么 `Basic Profile` 更像是这门语言里**第一套真正完整、能跑起来、也能被审核的基础句法层**。 `[综合归纳]`

### 7.1 `Basic Profile` 是 29110 最接近“可执行骨架”的入口

前面已经提到，`29110` 的核心不是单一文本，而是一套 profile 体系。

但 profile 体系内部也有明显差别：

- `Entry` 更像更小范围、更低门槛的进入点 `[直接支持]`
- `Intermediate`、`Advanced` 则开始面向多项目、组织发展与竞争力增强 `[直接支持]`
- `Basic` 则是“单个团队开发单个产品”的最典型、最稳定场景 `[直接支持]`

也正因为如此，`Basic` 是最容易看清 `29110` 主干结构的一层。

在这一层里，你已经能同时看到：

- `PM` 与 `SI` 两条过程主线
- `Activity` 与 `Task` 的执行分解
- `Role` 的责任分配
- `Work Product` 的输入输出关系
- `Repository`、`Baseline`、`Traceability` 等治理意识
- `Agile Guideline` 对这套骨架的事件化映射

所以从学习角度看，`Basic` 的价值不只是“够用”，而是它让 `29110` 第一次以一种足够完整又不至于过度膨胀的形态呈现出来。 `[综合归纳]`

### 7.2 为什么第一遍学习时，先抓 `Basic` 最自然

第一遍学习 `29110`，最容易遇到的问题不是“术语太少”，而是“层次太多”。

你会同时碰到：

- `Profile` 和 `Profile Group`
- `Specification` 和 `Guideline`
- `PM`、`SI`、`Activity`、`Task`
- `Role`、`Work Product`、`Repository`、`Baseline`
- `Assessment`、`Certification`

如果一开始就把这些对象全部拉平处理，阅读体验很容易变成：

- 名词都认识一些
- 但不知道谁是主轴
- 也不知道该先抓哪一层

而 `Basic` 的好处就在于：

- 它把对象系统压缩到了一个最可感知的工作场景里
- 它能让学习者先看到“一个小团队如何真正运行生命周期过程”
- 它能把抽象术语挂靠到具体的过程、角色和制品上

也就是说，先学 `Basic` 不是在缩小视野，而是在建立最必要的上下文。

### 7.3 `Basic` 与其他 profile 的关系，不是“前后阶段”

很多人第一次看到 `Entry / Basic / Intermediate / Advanced`，会下意识地把它们看成同一个项目里的顺序阶段。

这其实很容易带偏理解。

更合适的看法是：

- 它们首先是 **profile 路线**，不是项目时间轴 `[综合归纳]`
- 它们表达的是不同复杂度、不同能力需求、不同组织情境下的适用入口 `[直接支持]`
- `Basic` 的特殊性，不在于它排在第二，而在于它是**第一层真正把过程骨架完整展开出来的 profile** `[综合归纳]`

因此，先理解 `Basic`，并不意味着：

- `Entry` 不重要
- `Intermediate`、`Advanced` 可以忽略

而是意味着：

- 你先抓住最稳定、最容易形成整体感的一层
- 等这层吃透后，再往更轻或更复杂的路线移动

这和学习 `BPMN` 时先抓 `Process`，再进入其他视角，是同一种方法论：**先抓最稳的主轴，再向外扩。**

### 7.4 `Basic Profile` 不是瀑布模板，而是最小治理骨架

如果只是翻看 `5-1-2` 的活动和任务顺序，很多人会误以为 `Basic` 只是把传统开发活动列成一条线。

但这种理解只抓到了表面顺序，没有抓到对象本质。

`Basic` 真正稳定下来的，不是某一种时间顺序，而是下面这些治理关系：

- 项目必须被计划、监控、调整和收尾
- 软件必须经过需求、设计、构造、集成、测试和产品组装
- 关键 task 必须有角色、有输入输出、有对应 work product
- 关键 work product 必须被评审、更新、基线化、入库，并能作为证据 `[直接支持]`

因此，`Basic` 规定的不是：

- 你只能按瀑布做

而是：

- 不管你按 waterfall、iterative、incremental、evolutionary 还是 agile 做，都必须保有这套最小治理骨架 `[直接支持]`

所以更准确地说，`Basic` 最像的不是“开发步骤模板”，而是：

> **一套让 VSE 无论采用哪种生命周期方式，都仍然能被治理、被追踪、被证明的最小工程骨架。** `[综合归纳]`

### 7.5 `Basic` 首先训练的，是“过程 - 制品联动思维”

为什么 `Basic` 适合作为主入口？

因为它最先训练的，不是任务记忆，而是**过程与制品联动的思维**。

在 `Basic` 里，真正重要的不是单条 task 文本，而是下面这条关系链：

```text
PM / SI
  -> 分解为 Activities
    -> Activities 分解为 Tasks
      -> Tasks 由 Roles 执行
        -> Tasks 消费和产生 Work Products
          -> Work Products 被评审、更新、基线化并进入 Repository
```

这条链一旦建立起来，你对 `29110` 的理解就会稳定很多。

因为这意味着：

- 你看到的不是“做一堆事”
- 而是“让过程不断沉淀为可治理的制品状态”

没有这层思维时，学习者很容易把 `29110` 读成：

- 一个 task 编号列表
- 一组要求写文档的规定
- 一套偏流程管理的模板

而有了这层思维后，`29110` 才会显出它真正的结构：

- `Process` 负责组织工作
- `Work Product` 负责承载协作与证据
- `Repository / Baseline` 负责把执行结果转成可治理对象

### 7.6 从工程角度看，为什么 `Basic` 最容易先产生价值

从工程使用角度看，很多 `VSE` 最先需要解决的问题，并不是“如何建立完整组织级体系”，而是下面这些更现实的问题：

- 项目计划是否清楚
- 需求、设计、测试是不是彼此脱节
- 团队交付物有没有稳定版本
- 代码、文档、测试结果能不能形成一致证据
- 客户验收和内部实现之间有没有断裂

而这些问题，`Basic` 恰好都能直接覆盖。

因为它提供的不是宏大治理口号，而是：

- 一条最小但完整的项目治理主线
- 一条最小但完整的软件实现主线
- 一组最低必要的 work product 与状态控制意识

所以对很多小团队来说，`Basic` 的价值非常现实：

- 它是从“凭经验做项目”走向“按标准做项目”的第一步
- 它是从“零散输出文档”走向“治理 work product”的第一步
- 它也是从“内部知道自己做过什么”走向“外部也能看懂你做过什么”的第一步

### 7.7 第一遍学习 `Basic` 时，先不要做什么

为了避免一上来就把 `29110` 学散，第一遍学习 `Basic` 时，有几件事可以先刻意不做：

- 不急着把每条 task 直接翻译成本团队的 `SOP`
- 不急着把每个 role 机械映射成一个固定岗位
- 不急着把每个 work product 都理解成厚重文档
- 不急着先进入认证细则、审核程序和第三方机制
- 不急着用某一种开发方法去强行重排全部 task 顺序

第一遍最重要的，是先在脑子里建立下面这个最小模型：

```text
客户需求 / 项目承诺
  -> PM 让项目处于受控状态
  -> SI 让软件被逐步实现
  -> 关键 Work Products 持续产生、评审、更新、基线化
  -> 相关对象进入 Repository，并保留 Traceability
  -> 团队因此获得交付、验收和审核的客观基础
```

只要这个最小模型先立住，后面再进入：

- `Purpose` 与 `Outcome`
- `PM` 与 `SI` 的活动结构
- `Verification` / `Validation`
- `Agile` 映射与 `Certification`

理解成本都会明显下降。

### 7.8 把 `Basic Profile` 放在当前位置的意义

到目前为止，这份文档已经建立了几层认识：

- `29110` 是面向 `VSE` 的 profile 化标准族
- 它的核心对象链是 `VSE -> Profile -> Process -> Activity/Event -> Task -> Role/Work Product`
- 它的治理闭环依赖 `Repository`、`Baseline`、`Traceability` 与 `Conformity`

在这个基础上，把 `Basic` 单独抽出来，意义就在于：

1. 先把 `29110` 的主入口稳定下来
2. 先把“最小可执行骨架”看清楚
3. 再沿着 `Purpose / Outcome / Activity / Task` 往更细粒度展开
4. 最后再把这些对象重新放回 `Agile` 和 `Certification` 语境中理解

这个顺序的好处是：

- 不会一开始就被全部 profile 路线淹没
- 不会把“术语层”“执行层”“审核层”混成一团
- 能让每一个后续对象，都挂靠到一个稳定的学习入口上

因此，继续往下写时，最自然的下一步已经很清楚了：

> **不是立刻把全部 profile 全部摊开，而是先在 `Basic Profile` 里建立最小可执行骨架。**

---

## 第八阶段：`Basic Profile` 的最小可执行骨架

在前一阶段里，已经说明了为什么要先单独理解 `Basic Profile`。

再往前走一步，就会遇到一个更基础的问题：

> 如果暂时不急着展开全部 task、全部 work product、全部审核细节，那么 `Basic Profile` 压缩到最少，究竟在表达什么？

这个问题很重要。

因为如果这一层没有先建立起来，后面继续看 `Purpose`、`Outcome`、`Activity`、`Task` 时，就很容易重新掉回“读任务表”而不是“读对象系统”的老路。

所以这一阶段的目标，不是继续铺更多细节，而是先把 `Basic` 最小、最稳定、最可执行的骨架建立起来。

### 8.1 `Basic` 最小骨架只有六个位置

第一遍理解 `Basic Profile`，最推荐先记住下面这条最小主链：

```text
Purpose
  -> Outcomes
    -> Activities
      -> Tasks
        -> Work Products
          -> Repository / Baseline
```

这条链看起来很短，但已经把 `Basic` 最核心的对象结构压缩出来了。

它对应的是六类最基本的问题：

- **`Purpose`**：这个过程为什么存在
- **`Outcomes`**：做到什么状态才算这个过程真正达成
- **`Activities`**：这些结果大致按哪些工作块组织
- **`Tasks`**：具体由谁做什么动作
- **`Work Products`**：动作过程中沉淀出哪些治理对象
- **`Repository / Baseline`**：这些对象如何被保存、稳定和证明

换句话说，第一遍学习 `Basic`，先不要把它看成一张大任务表，而要先把它看成一条：

> **从过程目的出发，经过执行动作，最后沉淀为可治理制品与可证明状态的对象链。** `[综合归纳]`

### 8.2 为什么这六个位置足够重要

因为 `Basic` 的大量细节，最终都可以被看成这六个位置的展开版本。

例如：

- 增加更多 task，本质上是在把某个 `Activity` 展开得更细
- 区分 `PM` 与 `SI`，本质上是在区分两条不同的 `Purpose -> Outcomes` 主线
- 引入更多角色，本质上是在补强 task 的责任分配
- 引入追踪、评审、验证、验收，本质上是在增强 work product 的状态控制与证据能力
- 引入敏捷事件映射，本质上是在改变工作块组织方式，而不是推翻这条骨架

也就是说，无论后面文档展开得多详细，最底层仍然在回答这几个问题：

- 这个过程为什么存在
- 什么结果出现了，才算真的做到
- 这些结果通过哪些工作块推进
- 工作块里有哪些具体动作
- 动作沉淀成哪些 work product
- 这些 work product 如何进入 repository、形成 baseline，并支撑后续审核

这就是 `Basic` 骨架的稳定性。

### 8.3 `Basic` 的核心不是“任务清单”，而是“结果驱动的对象流”

很多人第一次接触 `5-1-2`，会自然地把它理解成一种展开形式：

1. 做 A
2. 做 B
3. 做 C
4. 做 D

这种读法并不完全错，但它只能看到表层顺序。

`Basic` 更深一层的结构其实是：

- 过程先声明自己要达成什么 `Purpose`
- 再说明哪些 `Outcomes` 能证明这个过程真的有效
- 然后才通过 `Activities` 和 `Tasks` 把这些结果一步步落到执行层
- 最后通过 `Work Products`、`Repository`、`Baseline` 把结果固定下来

所以更准确地说，`Basic` 首先不是“任务列表”，而是：

> **一套把过程目标不断收敛为客观结果、再把结果沉淀为可治理对象的结构。** `[综合归纳]`

这也是为什么 `29110` 虽然面向小团队，却并没有放弃标准化过程应有的严谨性。

### 8.4 六个位置里真正的主线是什么

如果把这条骨架再进一步压缩，`Basic Profile` 的主线其实只有两件事：

- **让过程达成结果**
- **让结果变成证据**

于是上面的六个位置还可以再浓缩成：

```text
定义过程要达到什么
  -> 通过活动与任务去实现它
    -> 让实现结果沉淀为 Work Products
      -> 让 Work Products 进入受控状态并可被证明
```

从这个角度看：

- `Purpose` 与 `Outcomes` 更偏“过程要达到什么”
- `Activities` 与 `Tasks` 更偏“过程如何被执行”
- `Work Products` 与 `Repository / Baseline` 更偏“执行结果如何被治理和证明”

这条主线一旦看清，很多对象之间的关系就会一下子变得非常顺。

### 8.5 为什么最末端一定要落到 `Repository / Baseline`

这里有一个很关键、也很容易被忽视的点：

`Basic` 的骨架如果只写到 `Task` 或 `Work Product`，其实都还不完整。

因为在 `29110` 里，团队真正需要的不是：

- 临时做过某件事
- 曾经写出过某个文档
- 大家口头上知道状态差不多完成了

而是：

- 关键 work product 有稳定版本
- 它们能被团队共享、追踪和回顾
- 它们能作为交付、验收、验证、审核的客观基础

因此，`Repository / Baseline` 不是附属收尾动作，而是 `Basic` 骨架不可缺的一环。

只要没有走到这里，过程就还停留在“发生过”，没有真正变成“被治理过”。

这也是为什么说，`29110` 的最小骨架并不是：

```text
做事 -> 完成
```

而更接近：

```text
做事 -> 形成制品 -> 制品被受控 -> 团队因此拥有可证明状态
```

### 8.6 从 `PM` 和 `SI` 看，这条骨架如何同时成立

`Basic` 的一个强点在于：这条最小骨架并不是只适用于 `SI`，它对 `PM` 同样成立。

对 `PM` 来说，骨架更像：

```text
项目受控的目的
  -> 计划、监控、调整、验收等结果
    -> 由若干活动和 task 推进
      -> 沉淀为 Project Plan、记录、验收相关 work products
        -> 进入 repository 并形成项目治理证据
```

对 `SI` 来说，骨架则更像：

```text
软件被系统实现的目的
  -> 需求、设计、构造、集成、测试、组装等结果
    -> 由若干活动和 task 推进
      -> 沉淀为需求、设计、代码、测试、软件产品等 work products
        -> 进入 repository 并形成工程治理证据
```

这说明 `Basic` 不是两张互不相关的表，而是：

- 一条项目治理骨架
- 一条软件实现骨架
- 二者通过共享 work products 与受控状态互相咬合

### 8.7 第一遍学习时，先用“骨架位置”理解，不急着穷举所有对象

这是一个很重要的学习策略。

第一遍学习 `Basic` 时，如果一开始就从全部 task、全部缩写、全部状态词入手，很容易出现几个问题：

- 名词认识了，但不知道它们在结构里起什么作用
- 活动顺序看懂一些，但整体感很弱
- 一旦进入 annex、agile 映射或认证章节，就会开始漂浮

因此，更推荐先这样理解：

- `Purpose` 是“为什么要有这个过程”的位置
- `Outcomes` 是“做到什么算达成”的位置
- `Activities` 是“工作怎么分块组织”的位置
- `Tasks` 是“谁执行哪些动作”的位置
- `Work Products` 是“结果沉淀成什么对象”的位置
- `Repository / Baseline` 是“对象如何进入受控状态”的位置

等这几个位置的功能感建立起来之后，再去细分：

- `PM` 和 `SI` 的差异
- `Role` 的责任结构
- `Verification / Validation / Acceptance` 的边界
- `Agile` 如何把活动重组为事件

学习就会顺得多。

### 8.8 把“最小可执行骨架”放在这里的意义

到这一节结束时，文档的学习路径已经进一步收敛了。

前面几阶段解决的是：

- `29110` 整体是什么
- 它有哪些关键对象
- 为什么 `Basic Profile` 是最稳定的入口

而这一阶段解决的是：

- `Basic` 最少到底在表达什么
- 为什么它不是任务清单，而是对象骨架
- 为什么它天然会通向 work product 治理与可审计证据

这意味着接下来最自然的下一步已经很明确：

1. 先把 `Purpose`、`Outcome`、`Activity`、`Task` 之间的关系单独讲清楚
2. 再去展开 `PM` 与 `SI` 的活动骨架
3. 最后再把这些对象重新放回 `Agile` 与 `Certification` 的语境中理解

因此，如果把这一节只压缩成一句话，可以先记成：

> **`Basic Profile` 的最小骨架，不是“做若干任务”，而是“从过程目的出发，经由活动与任务，把结果沉淀为可治理、可追踪、可证明的 work product 状态”。**

---

## 第九阶段：`Purpose`、`Outcome`、`Activity`、`Task` 到底是什么关系

到了这里，已经有了两个重要前提：

- `Basic Profile` 是 `29110` 最稳定的学习入口
- `Basic` 的最小骨架可以先压缩成 `Purpose -> Outcomes -> Activities -> Tasks -> Work Products -> Repository / Baseline`

接下来最自然的一步，就是把这条骨架中最容易混淆、也最值得单独讲清的一组对象拆开：

- `Purpose`
- `Outcome`
- `Activity`
- `Task`

因为如果这四层关系不清楚，后面无论再看 `PM`、`SI`、`Agile` 还是 `Certification`，都很容易发生同一种偏差：

> 把不同抽象层的对象混成同一类东西来读。

而一旦混起来，`29110` 就会被误读成：

- 一组 task 列表
- 一套活动顺序表
- 或一份高层目标宣言

但实际上，它四层都不是一回事。

### 9.1 先用一张总图看四层关系

可以先把这四层对象压缩成下面这张图：

```text
Process
  -> Purpose
       说明“这个过程为什么存在”
  -> Outcomes
       说明“做到什么状态，才算过程达成”
  -> Activities
       说明“这些结果大致按哪些工作块推进”
  -> Tasks
       说明“具体由谁执行什么动作，并处理哪些 work products”
```

这张图最想表达的，不是四个定义，而是四种不同的语义位置：

- `Purpose` 回答存在理由
- `Outcome` 回答达成标准
- `Activity` 回答组织分块
- `Task` 回答执行动作

所以第一遍学习时，最重要的不是背定义原句，而是先把这四个“位置感”建立起来。

### 9.2 `Purpose` 不是任务说明，而是过程存在理由

`Purpose` 这一层，最容易被低估。

因为很多人一看到过程文档，就会下意识往下找：

- 先做什么
- 再做什么
- 输出什么

于是 `Purpose` 常常被快速跳过。

但在 `29110` 里，`Purpose` 恰恰是在告诉你：

- 这个过程存在的根本理由是什么
- 它试图在生命周期里解决什么问题
- 后面所有 `Outcome`、`Activity`、`Task` 到底围绕什么收敛

也就是说，`Purpose` 不负责描述动作顺序，它负责定义**方向**。

没有 `Purpose`，后面的 task 就会变成：

- 为什么做也说不清
- 做到什么程度算够也说不清
- 只能靠经验解释的动作集合

因此，`Purpose` 最像的不是“第一条 task”，而是：

> **整个过程的存在理由与目标边界。**

### 9.3 `Outcome` 不是活动清单，而是“过程已经达成”的判据

如果说 `Purpose` 回答的是“为什么要有这个过程”，那么 `Outcome` 回答的就是：

> **做到什么状态，才说明这个过程真的已经被有效实现。**

这一层非常关键，因为它把“过程有没有被执行”与“过程有没有真正产生结果”区分开了。

这意味着：

- 不是写了 task 就算完成过程
- 不是开过会、做过动作就算满足过程
- 只有当相应结果状态真的出现，过程才算被达成

因此，`Outcome` 不是：

- task 的改写版
- activity 的摘要版
- 一句空泛口号

它更像是：

- 过程完成状态的判据
- 后续评估、审核和符合性判断的重要支点

也正因为如此，`29110` 的结构才会天然通向认证与证据逻辑：

- `Purpose` 给出方向
- `Outcome` 给出结果判据
- `Task` 只是达成这些判据的手段之一

### 9.4 `Activity` 不是过程全文，而是工作块

理解 `Activity` 时，最常见的误解，是把它当成“过程本身的全部内容”。

但更准确地说，`Activity` 是：

- 在过程内部，为了推进某类结果而划出来的工作块
- 它负责给一组 task 提供组织边界
- 它让过程从“整体目标”进入“分块推进”的状态

所以 `Activity` 的作用，不是再定义一遍 `Purpose`，也不是直接代替 `Task`。

它真正负责的是：

- 把过程拆成若干个可理解、可管理、可分段推进的部分
- 让学习者和执行者知道“当前是在推进哪一段工作”

例如在 `SI` 中，需求分析、设计、构造、集成与测试、产品组装之所以要分开，不是为了把文档切得更细，而是因为：

- 它们承载的对象变化不同
- 它们推进的结果类型不同
- 它们需要的输入输出 work product 不同

因此，`Activity` 最像的不是“细碎动作”，而是：

> **过程内部的工作分块与推进槽位。**

### 9.5 `Task` 才是真正落到执行层的动作

到了 `Task` 这一层，`29110` 才真正落到“谁做什么”的执行粒度。

这一层的特点是最具体，也最容易让人误以为它就是全部标准内容。

但更准确地说，`Task` 在 `29110` 里的地位是：

- 它是过程执行的最小动作单元
- 它通常带着明确的角色、输入、输出与 work product 关系
- 它是把 `Activity` 变成实际工作、把 `Outcome` 变成现实结果的桥梁

所以 `Task` 虽然最具体，却不是最高层。

它不是在回答：

- 为什么要有这个过程
- 什么结果才算达成
- 工作整体如何分块

它回答的是：

- 当前具体做什么
- 由谁做
- 处理哪些对象
- 产生哪些对象变化

也就是说，`Task` 是**执行动作层**，而不是整个过程语义的总代表。

### 9.6 四层之间真正的方向关系是什么

把这四层放在一起看，最重要的不是记住“从大到小”这么简单，而是记住它们在语义上是逐层收敛的。

可以把它理解成：

```text
Purpose
  -> 给出过程为什么存在
Outcome
  -> 给出过程达到什么才算有效
Activity
  -> 给出这些结果按哪些工作块组织
Task
  -> 给出具体如何执行这些工作块
```

这说明四层之间不是并列关系，而是不同问题的连续回答：

- 先回答“为什么做”
- 再回答“做到什么算成”
- 再回答“按哪几块推进”
- 最后回答“具体怎么做”

一旦这个方向关系建立起来，很多常见混淆就会自然消失。

### 9.7 为什么最容易把 `Outcome` 和 `Task` 混起来

这两个对象最容易混，是因为它们都看起来和“做成某件事”有关。

但它们其实关注的是完全不同的问题：

- `Outcome` 看的是**结果状态是否达成**
- `Task` 看的是**执行动作是否发生**

例如：

- 一个团队可以完成若干 task
- 但相关需求、设计、测试记录未形成稳定、可追踪、可批准状态
- 那么从 `Outcome` 的角度看，过程仍然不算真正达成

所以更准确地说：

- `Task` 是达成 `Outcome` 的手段
- `Outcome` 是评判 task 是否真的形成过程结果的上层标准

这也是 `29110` 不会退化成任务清单式标准的关键原因之一。

### 9.8 为什么 `Activity` 不能直接代替 `Outcome`

另一个常见误解，是把 `Activity` 看成“反正就是某一段结果”。

这也不对。

因为：

- `Activity` 说的是工作如何分块推进
- `Outcome` 说的是过程是否已经达到预期状态

一个 activity 可以执行得很多、很忙、很细，
但如果最终没有形成对应的结果状态，它也不能自动等于 outcome 已达成。

所以：

- `Activity` 更偏组织结构
- `Outcome` 更偏完成判据

这两者彼此相关，但不相互替代。

### 9.9 为什么第一遍学习时，要先把这四层当成“位置”而不是“术语”

这是学习 `29110` 时非常重要的一个方法。

如果一开始就只从术语定义入手，很容易出现下面的问题：

- 看到 `Purpose`，知道它叫过程目的，但不知道它为什么在最上层
- 看到 `Outcome`，知道它和结果有关，但不知道它为什么比 task 更重要
- 看到 `Activity`，知道它是工作块，但不知道它和 task 的边界
- 看到 `Task`，知道它最具体，但会误以为标准的核心就是 task 表

因此，更推荐先这样记：

- `Purpose` 是方向位置
- `Outcome` 是判据位置
- `Activity` 是组织位置
- `Task` 是执行位置

等位置感建立起来后，再去看正式定义、表格和条文，理解会稳很多。

### 9.10 把这四层关系放在这里的意义

到这一节结束时，`Basic Profile` 的最小骨架已经不再只是一个抽象链条，而是开始有了明确的内部层次。

前面解决的是：

- 为什么先学 `Basic`
- `Basic` 最小骨架是什么

而这一节进一步解决的是：

- 为什么 `Purpose`、`Outcome`、`Activity`、`Task` 不能拉平来看
- 为什么它们分别对应“方向、判据、组织、执行”四种不同语义
- 为什么后续继续展开 `PM` 与 `SI` 时，必须带着这层分层感进入

这意味着接下来最自然的下一步就是：

- 把 `PM` 过程按这种层次感真正展开
- 再把 `SI` 的活动骨架逐段展开
- 让 `Work Product`、`Verification`、`Agile` 映射都回挂到这四层关系上

如果只用一句话压缩这一节，可以先记成：

> **在 `29110` 里，`Purpose` 决定过程为什么存在，`Outcome` 决定过程做到什么才算成立，`Activity` 决定工作如何分块推进，`Task` 决定具体由谁执行什么动作。**

---

## 第十阶段：先把 `PM` 过程单独讲透

前面几阶段已经把 `Basic Profile` 的入口、骨架，以及 `Purpose / Outcome / Activity / Task` 四层关系建立起来了。

接下来最自然的一步，不是马上跳进全部 `SI` 细节，而是先把 `PM` 单独抽出来。

原因很简单：

- `PM` 是 `Basic` 中最容易被误读的一条过程线
- 很多人会把它理解成“管理层附录”或“项目经理的额外工作”
- 但在 `29110` 里，`PM` 实际上是让整个 `Basic` 保持可控、可交付、可验收、可证明的治理主轴之一

也就是说，如果不先把 `PM` 读透，后面即使把 `SI` 的需求、设计、构造、测试都读完，仍然很容易把 `29110` 误读成“一个有点重的开发流程表”，而不是“管理过程与工程过程共同构成的生命周期骨架”。

### 10.1 `PM` 首先不是管理口号，而是项目受控机制

在 `5-1-2` 的展开里，`PM` 关心的并不是抽象意义上的“加强沟通”“重视协作”这一类管理口号。

它更稳定地围绕下面这些对象展开：

- 项目范围与承诺是否被明确
- 计划、资源、任务和进度是否被组织起来
- 风险、偏差、变更是否被看见并处理
- 交付、验收、结项是否形成受控结果
- 关键记录和工作产品是否进入 repository 并成为后续证据 `[直接支持]`

所以更准确地说，`PM` 在 `29110` 里首先控制的不是“人”，而是：

- 项目承诺
- 项目计划
- 项目状态
- 项目偏差
- 项目交付与验收状态

它的本质更像是：

> **把项目从“大家大致知道在做什么”推进成“项目目标、计划、状态和交付都处于受控状态”的过程。**

### 10.2 如果先不背活动编号，可以把 `PM` 压缩成一条对象骨架

第一遍学习 `PM`，不一定要先逐条背 task。

更推荐先把它压缩成下面这条骨架：

```text
项目承诺 / 范围
  -> 形成项目计划
    -> 按计划执行并跟踪项目状态
      -> 发现偏差、风险、变化并调整
        -> 形成交付、验收与结项结果
          -> 相关 work products 进入 repository
```

这条骨架的关键不在于措辞，而在于它说明了 `PM` 在对象层面真正推动的事情：

- 把项目目标落成计划
- 把计划落成跟踪与控制
- 把跟踪与控制落成交付与验收
- 把交付与验收落成可留痕、可回溯、可证明的项目状态

这说明 `PM` 并不是停留在“计划一下”，而是把项目一路推进到**可交付、可收尾、可追责**的治理链。 `[综合归纳]`

### 10.3 `PM` 最关键控制的对象，不是会议本身，而是项目状态

很多人第一次看 `PM`，容易把注意力放在会议、评审、沟通这些表面动作上。

但如果从对象抽象角度看，`PM` 真正控制的，是项目状态是否受控。

这包括：

- 项目是否有被承诺过的范围和交付物
- 项目是否有被维护的计划与任务分配
- 项目是否持续知道自己当前进展到哪里
- 项目是否能发现偏差并做纠正
- 项目是否能把交付与客户验收收束成明确结果

也就是说：

- 会议只是手段
- 记录只是载体
- `PM` 真正关心的是项目状态能不能被看见、被更新、被收束

因此，`PM` 的核心对象不是“开没开会”，而是：

> **项目状态有没有被持续组织成可理解、可调整、可验收的结构。**

### 10.4 `PM` 为什么不是悬浮在 `SI` 之外的“管理层”

如果把 `PM` 和 `SI` 分成两个章节，很容易产生一种错觉：

- `PM` 是管理层那边的事
- `SI` 才是工程实现这边的事

但在 `29110` 里，这种分法并不准确。

因为 `PM` 与 `SI` 并不是两条互不相干的平行线，它们是通过共享对象彼此咬合的。

前面已经提到，两者会围绕这些对象交织：

- `Project Plan`
- `Delivery Instructions`
- `Acceptance Record`
- `Repository`
- 以及各种与进展、变更、交付相关的 work products `[直接支持]`

这意味着：

- `PM` 决定项目何时计划、如何跟踪、何时交付、如何验收
- `SI` 负责把软件需求、设计、代码、测试、产品真正做出来
- 两者之间通过共享 work products 形成闭环，而不是前后割裂

所以更准确地说：

- `PM` 不在工程之外
- 它是工程得以持续受控运行的上层治理骨架

### 10.5 从 `Purpose / Outcome / Activity / Task` 四层看，`PM` 是怎么落下来的

前一阶段已经把四层关系讲清楚了。

现在把它们套回 `PM`，就会更容易看清 `PM` 的结构：

- **`Purpose`**：让项目在承诺、资源、时间、交付等方面保持受控
- **`Outcomes`**：计划被建立、进展被监控、偏差被处理、交付与验收被完成
- **`Activities`**：把这些结果分块组织成计划、执行跟踪、评审控制、收尾等工作块
- **`Tasks`**：由相应角色执行具体动作，更新记录、计划、交付与验收相关对象

这说明 `PM` 并不是“先有很多 task，再把它们拼成过程”。

相反，它是：

- 先有项目受控这一层目的
- 再有项目受控应当表现出的结果
- 再把这些结果拆成工作块
- 最后才落实为具体执行动作

这也解释了为什么：

- 只做了很多管理动作，不代表 `PM` 就有效
- 只有当计划、进展、偏差、交付、验收这些状态真的形成受控结果时，`PM` 才算真正成立

### 10.6 `PM` 最值得盯住的几类 work product

如果想从对象角度抓 `PM`，最好的方式之一就是盯住它沉淀出的那些关键 work product。

结合前文已经明确出现的对象，可以先重点抓这些：

- `Project Plan`
- `Delivery Instructions`
- `Acceptance Record`
- 与状态、评审、变更、会议、进展相关的记录类对象
- 最终进入 `Repository` 的项目治理证据 `[直接支持]`

这些对象之所以重要，不只是因为它们是“文档”。

更重要的是，它们分别承担了不同治理作用：

- 有的对象定义项目原本打算怎么做
- 有的对象反映项目执行过程中发生了什么
- 有的对象把交付与客户确认固定下来
- 有的对象让项目收尾后仍然保留可追溯证据

所以从 `PM` 角度看，work product 不只是辅助材料，而是项目状态被外显、被共享、被审视的主要媒介。

### 10.7 第一遍学习 `PM` 时，先不要做什么

为了避免把 `PM` 学成“项目经理经验谈”，第一遍学习这一章时，有几件事可以先刻意不做：

- 不急着把 `PM` 机械映射成传统 `PMBOK` 术语框架
- 不急着把每个控制动作都理解成额外文书负担
- 不急着脱离 `SI` 单独讨论纯管理理论
- 不急着把角色固定成大团队式职能分工
- 不急着先钻进认证程序细则，而忽略项目控制主线

第一遍最重要的是先建立下面这个最小模型：

```text
项目承诺
  -> 被组织成计划
  -> 被持续跟踪和调整
  -> 被收束成交付与验收
  -> 被沉淀为可回溯、可证明的项目治理对象
```

只要这个模型先立住，后面再去看：

- `PM` 与 `SI` 的交界
- 偏差、风险、变更如何进入控制循环
- `Agile` 如何把这条治理主线映射到事件节奏
- 认证时哪些项目对象会成为客观证据

理解都会稳定很多。

### 10.8 把 `PM` 放在这里单独讲透的意义

到这一节结束时，文档的主线又往前收敛了一步。

前面几阶段已经解决了：

- 为什么 `Basic` 是入口
- `Basic` 的最小骨架是什么
- `Purpose / Outcome / Activity / Task` 之间是什么关系

而这一节进一步解决的是：

- `PM` 在 `29110` 里到底控制什么对象
- 为什么它不是工程外部的“管理附录”
- 为什么它的本质是项目受控状态的建立、维持和收束
- 为什么理解 `PM`，必须同时盯住计划、状态、偏差、交付和验收对象

这意味着接下来最自然的下一步已经很明确：

- 再把 `SI` 过程按同样的对象层次真正展开
- 让工程实现主线与项目治理主线形成对照
- 再进一步回到 `Work Product`、`Verification`、`Agile` 映射和 `Certification`

如果只用一句话压缩这一节，可以先记成：

> **在 `29110` 的 `Basic Profile` 中，`PM` 不是“项目经理做管理”的附属章节，而是把项目承诺、计划、状态、偏差、交付与验收持续组织成受控对象的一条治理主线。**

---

## 第十一阶段：再把 `SI` 过程按活动骨架逐段展开

前一阶段已经把 `PM` 作为项目治理主线单独讲透了。

接下来最自然的一步，就是把 `SI` 也按同样的对象层次真正展开。

因为如果说 `PM` 负责让项目处于受控状态，那么 `SI` 负责的就是另一件同样关键的事：

> **让软件产品从需求意图一路走到可交付、可验证、可组装、可入库的工程实现状态。**

也就是说，`SI` 不是简单意义上的“开发过程”，而是 `29110` 里那条真正把软件一步步做出来的工程主线。

### 11.1 `SI` 首先不是“写代码”，而是软件实现链路

前面已经提到，`SI` 的 purpose 并不是一句含混的“开发软件”，而是非常明确地指向：

- 对新建或修改的软件产品开展系统化分析、设计、构造、集成、测试和工作产品组装 `[直接支持]`

这个表述里最重要的，不是哪一个动作被点名，而是它说明：

- `SI` 从来不只负责编码
- 它也不只负责前半段的分析设计
- 它覆盖的是从需求理解到产品组装的完整实现链路

所以更准确地说，`SI` 控制的不是“某个开发环节”，而是：

- 需求能不能被定义并稳定下来
- 设计能不能把需求转成可实现结构
- 构造能不能把设计转成组件
- 集成与测试能不能把组件转成受验证的软件
- 产品组装能不能把软件与相关文档收束成可交付对象

因此，`SI` 的本质更像是：

> **把软件从概念意图一路收敛为可交付产品的工程实现过程。**

### 11.2 如果先不背 task，可以先把 `SI` 压缩成一条主链

第一遍学习 `SI`，同样不一定要先穷举全部 task。

更推荐先记住下面这条主链：

```text
软件实现启动
  -> 需求分析
    -> 架构与详细设计
      -> 软件构造
        -> 软件集成与测试
          -> 软件产品组装
```

这条链已经在前文出现过，但这里要进一步强调：

它的重点不是顺序感，而是**对象变化**。

也就是说，沿着这条链真正发生的，是下面这些对象被一步步建立和收束：

- 需求被定义
- 设计被建立
- 组件被实现
- 软件被集成
- 测试结果被记录
- 产品与相关文档被装配
- 最终 work products 被基线化并进入 repository `[直接支持]`

这说明 `SI` 的主线不是“开发人员做了很多动作”，而是：

- 软件对象不断被细化
- work product 不断被生成、验证、更新和收束
- 工程结果不断从临时状态走向可治理状态

### 11.3 为什么 `SI.01` 必须先存在

很多人看 `SI` 活动骨架时，会很容易把真正感兴趣的部分直接放到需求、设计或编码上，于是忽略 `SI.01` 软件实现启动。

但这个起点其实非常重要。

因为在 `29110` 的对象逻辑里，工程实现不能凭“大家开始做了”就自然成立。

它必须先回答：

- 当前迭代或项目阶段到底要实现什么
- 输入条件是否齐备
- 当前实现工作与项目计划如何对齐
- 当前使用和产生的 work products 是否处在受控语境中

也就是说，`SI.01` 的作用不是“做一点准备动作”这么简单，而是：

> **把软件实现从模糊意图切换到受控执行状态。**

没有这一层启动，后面的需求分析、设计、构造就会更像零散动作，而不是挂靠在 `Basic` 治理骨架里的实现活动。

### 11.4 为什么需求分析和设计不能塌成一个黑箱

在小团队里，很多工作常常是一边想需求、一边画设计、一边改代码。

这在现实中很常见，但从 `29110` 的对象角度看，需求分析和设计仍然需要被区分开。

原因不是为了增加流程负担，而是因为这两段在对象层承担的任务完全不同：

- `SI.02` 的核心，是把需求对象建立出来，并使其可理解、可确认、可追踪
- `SI.03` 的核心，是把需求进一步转成架构与详细设计对象，使实现路径明确下来

换句话说：

- 需求阶段解决的是“系统应该做什么”
- 设计阶段解决的是“系统准备怎么被做出来”

如果两者完全塌成一个黑箱，最容易丢失的就是：

- 需求与设计之间的追踪关系
- 后续测试到底在验证什么
- 变更到底影响了哪一层对象

因此，`29110` 把这两段分开，并不是为了把工程切碎，而是为了保住对象流的清晰边界。

### 11.5 为什么构造、集成、测试、组装必须继续分段

如果说需求和设计是把“要做什么”收敛清楚，那么从 `SI.04` 往后，`SI` 才真正进入把软件做出来的后半段。

这里也最容易被误读成：

- 反正就是开发完再测一下
- 最后把东西打包出去

但从对象抽象角度看，这几段各自都在改变不同的对象状态：

- **构造**：把设计对象转成软件组件，并形成最初的实现结果
- **集成**：把分散组件收束为可协同运行的软件整体
- **测试**：把“已经做出来”进一步推进成“已经被验证和校验”
- **组装**：把软件本体与所需文档、说明、记录一起收束为交付级对象

所以这几段不能被简单压扁成“开发完成”。

因为在 `29110` 里：

- 代码写出来，不等于软件已经可交付
- 软件跑起来，不等于相关证据已经齐备
- 测试做过，不等于工作产品已经进入受控状态

也正因为这样，`SI` 的后半段才会天然与 baseline、repository、traceability、verification、validation 这些治理对象重新汇合。

### 11.6 `SI` 最值得盯住的，不是动作顺序，而是 work product 的持续流转

如果只按活动名称去记 `SI`，很容易又回到阶段表式理解。

更稳定的看法是：

- 每个 activity 都在消费一些 work products
- 同时又生成、更新、验证另外一些 work products
- 这些对象不断在活动之间流转，并逐步走向稳定状态

所以沿着 `SI` 真正流动的，不只是“任务”，而是：

- `Requirements Specification`
- `Software Design`
- `Software Components`
- `Test Cases and Test Procedures`
- `Test Report`
- `Software`
- `Maintenance Documentation`
- `Product Operation Guideline`
- `Software User Documentation`
- `Traceability Record` 等对象 `[直接支持]`

这说明 `SI` 的主线如果只读成“做分析、做设计、写代码、测一测”，会丢掉最关键的东西：

> **`SI` 本质上是在推动一组工程 work products 从草稿状态逐步走向可追踪、可验证、可交付状态。**

### 11.7 从 `Purpose / Outcome / Activity / Task` 四层看，`SI` 是怎么落下来的

现在把前一阶段建立的四层关系重新套回 `SI`，就会发现它的结构非常清楚：

- **`Purpose`**：让软件产品被系统地实现出来
- **`Outcomes`**：需求、设计、构造、集成、测试、组装等结果状态逐步成立
- **`Activities`**：把这条实现链组织成 `SI.01` 到 `SI.06` 六个工作块
- **`Tasks`**：由相应角色执行具体动作，处理并更新相关 work products

这样一看，就能明白：

- `SI` 不是 task 的堆叠
- 它也不是 activity 名字的串联
- 它是从“软件必须被实现出来”这层目的出发，逐步分解为可执行、可验证、可交付的工程结构

这也是为什么 `SI` 能和 `PM` 形成明确对照：

- `PM` 更偏项目受控状态
- `SI` 更偏软件实现状态
- 二者最后都通过 work products 与 repository 汇合

### 11.8 第一遍学习 `SI` 时，先不要做什么

为了避免把 `SI` 又读回传统开发阶段表，第一遍学习这一章时，有几件事可以先刻意不做：

- 不急着把六个 activity 机械理解成严格瀑布阶段
- 不急着把每个 work product 理解成笨重文档包袱
- 不急着只盯代码和测试，而忽略需求、设计和组装对象
- 不急着先研究所有 annex、工具和方法细节
- 不急着把敏捷实践与 `SI` 对立起来

第一遍最重要的是先建立下面这个最小模型：

```text
软件意图
  -> 被定义成需求
  -> 被收敛成设计
  -> 被实现成组件
  -> 被集成为软件
  -> 被验证并组装为交付对象
  -> 被基线化、入库，并留下追踪与证据
```

只要这个模型先立住，后面再去看：

- 哪些 role 在不同活动中承担责任
- 哪些 verification / validation 发生在何处
- `Agile` 如何把这条链映射成 event 节奏
- 哪些对象会成为审核证据

理解都会稳很多。

### 11.9 把 `SI` 放在这里逐段展开的意义

到这一节结束时，`Basic Profile` 的两条主线终于开始形成清晰对照了。

前面几阶段已经分别解决了：

- 为什么先学 `Basic`
- `Basic` 的最小骨架是什么
- `Purpose / Outcome / Activity / Task` 之间是什么关系
- `PM` 过程控制的对象是什么

而这一节进一步解决的是：

- `SI` 到底控制哪些工程对象
- 为什么它不是“写代码过程”的别名
- 为什么六个 activity 的关键在于对象流，而不是阶段门顺序
- 为什么 work product 才是把 `SI` 连到治理、审核和交付的真正抓手

这意味着接下来最自然的下一步已经很明确：

- 回到 `Work Product` 本身，单独把它作为治理中心讲透
- 再把 `Verification / Validation / Acceptance / Audit Evidence` 的边界拉直
- 最后再把这些对象放回 `Agile` 与 `Certification` 语境中重看

如果只用一句话压缩这一节，可以先记成：

> **在 `29110` 的 `Basic Profile` 中，`SI` 不是“开发阶段表”，而是把需求、设计、组件、软件、测试结果和交付材料一路收敛为可验证、可组装、可基线化、可入库对象的工程实现主线。**

---

## 第十二阶段：为什么 `Work Product` 才是 29110 的真正中心

到了这里，`Basic Profile` 的两条主线已经基本展开出来了：

- `PM` 负责把项目承诺、计划、状态、偏差、交付与验收组织成受控对象
- `SI` 负责把需求、设计、组件、软件、测试和交付材料组织成可实现、可验证、可组装的工程对象

接下来最自然的一步，就是回到那个在前面已经多次出现、但值得单独讲透的核心对象：`Work Product`。

因为如果只看 `PM` 和 `SI` 的活动名，很容易仍然把 `29110` 理解成“过程驱动的标准”。

但只要再往下看一层，就会发现：

> **29110 真正持续被生成、被传递、被评审、被基线化、被审核的，不是 activity 名字，而是 work products。**

也正因为这样，`Work Product` 才不是普通配角，而是 `29110` 里最接近治理中枢的对象。

### 12.1 为什么说 `Work Product` 不是附件，而是主对象

很多人第一次读过程标准时，会自然地把文档、记录、代码、测试结果看成“过程执行后的附带产物”。

但在 `29110` 里，这种看法是不够的。

因为前面已经反复看到：

- task 总是围绕输入和输出 work product 组织 `[直接支持]`
- traceability、baseline、repository 都围绕 work product 运作 `[直接支持]`
- 审核与符合性判断所依赖的客观证据，也高度依赖 work product `[综合归纳]`

这说明 `Work Product` 在 `29110` 里的地位，并不是：

- 过程执行完以后顺手留下来的材料

而是：

- 过程执行时不断被处理的核心对象
- 项目协作与工程推进的共同媒介
- 后续治理、评审、审核、验收的证据承载体

所以更准确地说，`Work Product` 不是附件，而是：

> **过程之所以能被看见、被治理、被证明的主要载体。**

### 12.2 `Work Product` 为什么比“文档”这个词更准确

如果只用“文档”来理解 `Work Product`，很容易马上产生两个偏差：

- 以为它只是写下来给别人看的东西
- 以为它天然偏重、偏形式化、偏行政负担

但 `29110` 中的 `Work Product` 明显更宽。

它既可以包括：

- 计划
- 规格说明
- 设计
- 测试用例与测试报告
- 验收记录
- 用户文档

也可以包括：

- 软件组件
- 软件本体
- backlog、increment、meeting record、change request 等敏捷对象 `[直接支持]`

这意味着：

- `Work Product` 不是“只给人读的文稿”
- 它是所有在过程里被正式处理、被引用、被传递、被确认、被审视的对象

因此，用 `Work Product` 而不是“文档”来理解 `29110`，更能抓住它真正的对象系统。

### 12.3 `Work Product` 在 29110 里至少有三重身份

前面已经 briefly 说过，29110 里的 `Work Product` 至少有三重身份。

这里可以把这三重身份真正讲透：

1. **协作媒介**
   - 团队不是直接围绕抽象想法协作，而是围绕具体对象协作
   - 需求、设计、代码、测试结果、计划、记录，都是协作的中介面

2. **治理载体**
   - 项目和工程之所以能被控制，不是因为口头上说“在跟进”
   - 而是因为相关对象处于可评审、可更新、可基线化、可入库的状态

3. **审核证据**
   - 外部评估或认证并不能直接观察“你曾经认真做过”
   - 它只能观察你留下了哪些对象、这些对象处于什么状态、彼此是否可追踪

所以从对象抽象角度看，`Work Product` 是 `29110` 里少数同时连接：

- 执行
- 协作
- 治理
- 审核

四个层面的对象。

### 12.4 为什么 `Task` 最终都要回到 `Work Product`

前面已经说过，`Task` 是执行动作层。

但 `Task` 真正重要，不是因为它本身被写在标准里，而是因为它总会落到对象变化上。

更准确地说，一个 `Task` 在 `29110` 中之所以成立，通常意味着：

- 它消费某些 input work products
- 它更新或生成某些 output work products
- 它让某些对象状态发生变化

所以如果只记 task 动作，而不看它到底改变了哪些 work product，就会丢掉 `29110` 最关键的执行逻辑。

这也是为什么 `29110` 不是：

```text
Task -> Task -> Task
```

而更接近：

```text
Task
  -> 改变 Work Product
    -> Work Product 进入新状态
      -> 新状态支撑后续活动、交付与审核
```

也就是说，task 是动作层，work product 才是状态沉淀层。

### 12.5 为什么 `Repository / Baseline / Traceability` 都要围着 `Work Product` 转

如果 `Work Product` 只是附件，那么很多治理对象都没有必要存在。

但正因为 `Work Product` 是主对象，`29110` 才必须继续回答下面这些问题：

- 这些对象放在哪里
- 哪个版本是当前稳定版本
- 新旧版本之间怎么区分
- 需求、设计、测试、实现之间怎么追踪
- 审核时如何证明这些对象不是临时拼出来的

于是：

- `Repository` 负责让对象有稳定、共享、可回溯的存放位置
- `Baseline` 负责让对象从“还在变化”进入“当前作为正式依据的稳定版本”
- `Traceability` 负责让对象之间的依赖与来源关系可被追踪

这三者如果离开 `Work Product`，就会失去抓手。

所以从对象系统看，更准确的关系不是：

```text
Repository / Baseline / Traceability + Work Product
```

而是：

```text
Work Product
  -> 被存入 Repository
  -> 在某个时点形成 Baseline
  -> 与其他 Work Products 保持 Traceability
```

这条关系链，几乎就是 `29110` 的治理闭环本体。

### 12.6 如果按工程类型看，`Work Product` 可以怎样分层理解

为了避免把所有制品都看成同一种东西，可以先按工程作用粗分几类：

- **计划与控制类**
  - 如 `Project Plan`、记录、变更相关对象
- **需求与设计类**
  - 如 `Requirements Specification`、`Software Design`
- **实现与构造类**
  - 如 `Software Components`、`Software`
- **验证与测试类**
  - 如 `Test Cases and Test Procedures`、`Test Report`、`Validation Results`
- **交付与运行支持类**
  - 如 `Maintenance Documentation`、`Product Operation Guideline`、`Software User Documentation`
- **确认与收尾类**
  - 如 `Acceptance Record`
- **敏捷治理类**
  - 如 `Product Backlog`、`Sprint Backlog`、`Increment`、`Burndown Chart`、`Meeting Record`、`Change Request`

这样分的意义不在于建立一套固定 taxonomy，而在于帮助理解：

- `Work Product` 不是单一种类的文件
- 它横跨项目治理、工程实现、验证确认、交付支持与敏捷运行
- 它几乎把 `29110` 全部主线都串起来了

### 12.7 为什么说 `Work Product` 的核心不是“有没有”，而是“处于什么状态”

如果只停在“列出有哪些 work products”，对 `29110` 的理解其实还只到一半。

更关键的是：

- 这些对象现在是不是 initiated
- 是不是 reviewed
- 是不是 verified / validated
- 是不是 approved
- 是不是 published
- 是不是 baselined `[直接支持]`

这说明 `29110` 真正关心的，不是静态制品清单，而是：

> **制品对象在生命周期中的状态演进。**

因此，`Work Product` 在 `29110` 里更像：

- 带状态的配置对象
- 带责任边界的协作对象
- 带审核含义的证据对象

而不只是“写完就放在那里的一份材料”。

### 12.8 为什么 `Work Product` 才能把 `PM` 和 `SI` 真正接起来

如果只看过程名称，`PM` 和 `SI` 似乎分别属于“管理”和“工程”两套语境。

但真正把它们接在一起的，不是口头协调，而是共享对象。

例如前面已经提到：

- `Project Plan` 会约束 `SI` 的开展节奏
- `Delivery Instructions` 会把工程结果与交付安排连起来
- `Acceptance Record` 会把客户确认与工程完成收束在一起
- `Repository` 会把项目治理对象与软件工程对象放进同一受控空间 `[直接支持]`

这说明：

- `PM` 通过 work products 影响 `SI`
- `SI` 通过 work products 向 `PM` 反馈真实状态
- 两条过程线最后不是靠口号汇合，而是靠对象汇合

所以从对象系统看，`Work Product` 实际上就是 `PM` 与 `SI` 的接缝层。

### 12.9 为什么第一遍学习时，要先盯住 `Work Product`，而不是穷举全部 task

这是理解 `29110` 的一个重要拐点。

如果一直停留在 task 视角，很容易出现下面的问题：

- 记住了很多动作，但不知道治理主线在哪里
- 知道做过什么，但不知道结果沉淀在哪里
- 理解了过程顺序，但不知道审核证据从哪里长出来

而只要切换到 `Work Product` 视角，很多东西会突然连起来：

- 为什么 task 要有输入输出
- 为什么 baseline 重要
- 为什么 repository 重要
- 为什么 traceability 重要
- 为什么 agile 对象也会被纳入治理
- 为什么认证最终总会落到证据对象上

也就是说，`Work Product` 是把“执行标准”读成“治理标准”的关键切换点。

### 12.10 把 `Work Product` 放在这里单独讲透的意义

到这一节结束时，`29110` 的主线已经开始从“过程展开”进一步收束到“治理中枢”了。

前面几阶段已经依次解决了：

- 为什么先学 `Basic`
- `Basic` 的最小骨架是什么
- `Purpose / Outcome / Activity / Task` 如何分层
- `PM` 与 `SI` 两条主线分别控制什么对象

而这一节进一步解决的是：

- 为什么 `Work Product` 不是附属物，而是中心对象
- 为什么 repository、baseline、traceability 都必须围绕它展开
- 为什么它同时连接执行、协作、治理与审核
- 为什么只有盯住它，`29110` 的治理闭环才真正看得见

这意味着接下来最自然的下一步已经很明确：

- 把 `Verification / Validation / Acceptance / Audit Evidence` 的边界再单独拉直
- 让“结果状态”和“证据状态”的区别变得更清楚
- 再把这些对象放回 `Agile` 和 `Certification` 语境中重看

如果只用一句话压缩这一节，可以先记成：

> **在 `29110` 里，真正被协作、被控制、被基线化、被追踪、被审核的核心对象不是流程步骤本身，而是处于不同状态中的 `Work Product`。**

---

## 第十三阶段：`Verification` / `Validation` / `Acceptance` / `Audit Evidence` 的边界

到了这里，`29110` 的对象主线已经从 `Profile`、`Process`、`Task` 一路收敛到 `Work Product` 这个治理中枢了。

接下来最自然的一步，就是把另外一组特别容易混、但又直接决定“过程结果能否被相信”的对象边界拉直：

- `Verification`
- `Validation`
- `Acceptance`
- `Audit Evidence`

如果这几层关系不清楚，那么前面讲过的很多内容都会重新变得模糊：

- 什么叫“已经做完”
- 什么叫“已经验证”
- 什么叫“客户可以接受”
- 什么叫“审核时足以证明”

也就是说，这一章真正要解决的，是：

> **在 `29110` 里，结果状态、接受状态和证据状态，到底是如何区分的。**

### 13.1 为什么这四个词最容易被混成一团

这四个词之所以特别容易混，是因为它们都和“某件事是不是已经可以算完成”有关。

在日常工程语境里，人们很容易把它们混着说：

- “已经验证过了”
- “客户也认可了”
- “测试都做了”
- “审核肯定能过”

但从 `29110` 的对象逻辑看，这几句话实际上指向的是不同层级的问题：

- 有的是在说对象是否符合规定内容
- 有的是在说对象是否满足使用或业务需要
- 有的是在说客户或相关方是否正式接受
- 有的是在说你能否拿出足够证据，让第三方相信这些都真实发生过

所以，第一步必须先把这几层拆开，否则：

- `Verification` 会被误读成“只要测试做过就行”
- `Validation` 会被误读成“和 verification 一个意思”
- `Acceptance` 会被误读成“内部做完了就算接受”
- `Audit Evidence` 会被误读成“把文档补齐就行”

### 13.2 `Verification` 回答的是：对象是否按规定被做对了

在 `29110` 里，`Verification` 最核心的关注点，不是“客户喜不喜欢”，也不是“业务值不值”，而是：

> **当前对象是否满足它所依据的规定、规格、设计或预期条件。**

因此，`Verification` 更偏向：

- 需求是否一致、完整、可检查
- 设计是否与需求一致
- 代码或组件是否符合设计
- 集成后的软件是否符合预定条件
- 测试结果和相关 work product 是否与规定要求一致

也就是说，`Verification` 首先关心的是：

- 做得对不对
- 是否符合既定依据
- 是否能从对象关系上被检查出来

所以它更像“符合性检查”或“按规定核实”，而不是最终业务价值判断。

### 13.3 `Validation` 回答的是：做出来的东西是否真的满足使用需要

如果说 `Verification` 更偏“做得对不对”，那么 `Validation` 更偏：

> **即使你按规定做对了，这个结果是否真的满足预期使用、业务目标或用户需要。**

这层差异非常关键。

因为一个对象完全可能出现下面这种情况：

- 它通过了 verification
- 但最终并不满足用户场景或业务目标

所以 `Validation` 的视角，天然更贴近：

- 使用场景
- 业务目标
- 用户或客户真正关心的问题
- “这个结果拿去用，到底行不行”

也正因为这样，在 `29110` 里，`Validation Results` 这类对象会成为重要制品 `[直接支持]`。

所以更准确地说：

- `Verification` 更偏“按依据核实”
- `Validation` 更偏“按使用目标确认”

它们彼此关联，但绝不是同义词。

### 13.4 `Acceptance` 回答的是：相关方是否正式接收结果

再往前一步，`Acceptance` 处理的已经不是纯技术判断，而是：

> **在相关结果已经形成之后，客户或相关责任方是否正式接受该结果。**

这意味着 `Acceptance` 的语义又不一样：

- 它不是在重复 verification
- 也不是在重复 validation
- 它更像是把前面形成的结果状态，收束成一个“被确认接收”的状态

这也是为什么 `Acceptance Record` 这种对象在 `29110` 里非常关键 `[直接支持]`。

因为它承载的是：

- 某次交付是否被正式接受
- 某个阶段结果是否被相关方确认
- 项目是否能从“已完成内部工作”收束到“已完成外部确认”

所以更准确地说：

- `Verification` 关注对象是否按规定成立
- `Validation` 关注对象是否满足使用需要
- `Acceptance` 关注结果是否被正式接收

这三层是连续的，但不是互相替代的。

### 13.5 `Audit Evidence` 回答的是：你怎样证明前面那些状态真的发生过

到了 `Audit Evidence`，问题又进一步变化了。

这一层不再主要问：

- 对象本身技术上是否正确
- 客户是否满意
- 结果是否已被接受

它问的是：

> **如果第三方审核员现在来检查，你能拿什么证明这些事情真的发生过，而且不是事后拼出来的。**

所以 `Audit Evidence` 的核心，不是“再做一次验证”，而是：

- 用什么对象证明 verification 发生过
- 用什么对象证明 validation 发生过
- 用什么对象证明 acceptance 发生过
- 用什么对象证明这些状态之间彼此可追踪、可回溯、可核对

这也是为什么前一阶段会强调：

- `Work Product` 是审核证据的承载体
- `Repository / Baseline / Traceability` 是证据可信性的关键支撑

换句话说，`Audit Evidence` 关心的不是“你说你做了”，而是“你能不能拿出稳定对象证明你做了”。

### 13.6 这四层对象的真正关系是什么

把它们放在一起看，最重要的不是逐条背定义，而是要先记住它们解决的是四个不同问题：

```text
Verification
  -> 这个对象是否按规定被做对了？
Validation
  -> 这个对象是否真的满足使用需要？
Acceptance
  -> 这个结果是否被相关方正式接收？
Audit Evidence
  -> 你能否证明前面这些状态真实发生过？
```

这样一排开，就会发现：

- `Verification` 更偏对象符合性
- `Validation` 更偏使用适配性
- `Acceptance` 更偏责任确认与交付收束
- `Audit Evidence` 更偏第三方可证明性

也就是说，它们不是同义反复，而是一条不断往“可信状态”收敛的链。

### 13.7 为什么“做过了”不等于“能证明做过了”

这是 `29110` 最容易被忽视、但又最接近认证逻辑的一点。

在很多团队里，常见状态是：

- 实际上确实做过 review
- 也做过测试
- 客户口头上也说过没问题

但如果这些事情没有沉淀成受控对象，那么到了审核视角，就会出现一个问题：

- 你内部知道做过
- 但外部无法稳定确认你做过

因此在 `29110` 里，下面这两句话不是一个意思：

- “我们做过 verification / validation / acceptance”
- “我们拥有足以支撑审核的 evidence，证明这些事情发生过”

这也是为什么：

- 结果状态和证据状态必须分开看
- 单纯完成动作，不自动等于形成可审核对象
- 只有当相关结果进入 work product、状态、repository、baseline、traceability 体系后，才真正具备外部可证明性

### 13.8 为什么这四层边界会重新回到 `Work Product`

到这里就会发现，前一阶段讲 `Work Product` 并不是绕路。

因为无论是：

- verification
- validation
- acceptance
- audit evidence

最终都要落到对象承载上。

例如：

- `Verification` 要通过被检查的需求、设计、代码、测试对象来体现
- `Validation` 要通过 `Validation Results` 等结果对象来体现 `[直接支持]`
- `Acceptance` 要通过 `Acceptance Record` 这类对象来体现 `[直接支持]`
- `Audit Evidence` 则要通过整组 work products 及其状态、基线、追踪关系来体现

所以从对象系统上看，这几层边界最终都会重新汇入同一个中心：

```text
结果发生
  -> 沉淀为 Work Products
    -> Work Products 带有相应状态
      -> 状态进入 Repository / Baseline / Traceability
        -> 这些对象共同构成 Audit Evidence
```

这也是为什么 `29110` 最后会呈现出一种很强的“结果可证明化”特征。

### 13.9 第一遍学习这四层边界时，先不要做什么

为了避免把这一章学成术语对照表，第一遍学习时，有几件事可以先刻意不做：

- 不急着把 verification 和 validation 简化成一句英语口号
- 不急着把 acceptance 理解成“客户说一句行了”
- 不急着把 audit evidence 理解成“最后整理文档”
- 不急着只从测试角度理解 verification / validation
- 不急着脱离 work product 去讨论这些概念

第一遍最重要的是先建立下面这个最小模型：

```text
对象被做出来
  -> 需要被核实它是否符合规定
  -> 需要被确认它是否满足使用需要
  -> 需要被相关方正式接受
  -> 需要留下足以被第三方审核的客观证据
```

只要这个模型立住，后面再回到：

- `PM` 与 `SI` 各自产生哪些结果状态
- 哪些 work products 承担这些状态
- 敏捷场景下这些状态如何被事件化表达
- 认证时审核员到底在看什么

理解都会顺很多。

### 13.10 把这组边界放在这里单独讲透的意义

到这一节结束时，`29110` 的主线又往前收敛了一步。

前面几阶段已经分别解决了：

- 为什么 `Basic` 是入口
- `Basic` 的最小骨架是什么
- `Purpose / Outcome / Activity / Task` 如何分层
- `PM` 与 `SI` 两条主线分别控制什么对象
- 为什么 `Work Product` 是治理中枢

而这一节进一步解决的是：

- 为什么 verification、validation、acceptance、audit evidence 不能混成一个词堆
- 为什么它们分别对应“符合、满足、接收、证明”四种不同语义
- 为什么只有把结果状态和证据状态分开，`29110` 的符合性逻辑才真正清楚
- 为什么这些边界最后都会回到 work product 体系

这意味着接下来最自然的下一步已经很明确：

- 把这些对象重新放回 `Agile` 语境中，看事件化工作方式如何承载同样的治理要求
- 再回到 `Certification` 语境，看第三方到底如何利用这些对象判断 profile 符合性

如果只用一句话压缩这一节，可以先记成：

> **在 `29110` 里，`Verification` 关注对象是否按规定成立，`Validation` 关注对象是否满足使用需要，`Acceptance` 关注结果是否被正式接收，而 `Audit Evidence` 关注你是否能以受控 work products 证明这些状态真实发生过。**

---

## 第十四阶段：`Basic` 与 `Agile` 的逐对象映射

到了这里，前面几章已经把 `Basic Profile` 自身的对象结构基本讲透了：

- 为什么先学 `Basic`
- `Basic` 的最小骨架是什么
- `Purpose / Outcome / Activity / Task` 如何分层
- `PM` 与 `SI` 两条主线各自控制什么对象
- `Work Product` 为什么是治理中枢
- `Verification / Validation / Acceptance / Audit Evidence` 如何区分

接下来最自然的一步，不是再把 Agile 当成一套“额外玩法”来介绍，而是要真正回答一个更关键的问题：

> **当 `29110` 切到 Agile 语境时，到底是哪些对象被重新组织了，哪些对象其实根本没有变。**

这也是为什么前文一直强调：`5-4` 不是替代 `Basic`，而是把 `Basic` 的治理骨架映射到敏捷事件、角色和制品流中去。

### 14.1 为什么 `Basic` 与 `Agile` 的关系不是“二选一”

很多人第一次看到 `5-4`，会自然地以为它在说：

- 如果采用 Agile，就不再按 `Basic` 理解
- 或者 `Basic` 是传统过程，`Agile` 是另一套替代体系

但从对象结构看，这种理解并不准确。

因为前面已经很清楚：

- `Basic` 给的是治理骨架
- `Agile` 改变的主要是工作块组织方式、事件节奏、角色命名与敏捷制品表达
- `Work Product`、状态、追踪、验证、确认、证据这些治理要求并没有被取消 `[直接支持]`

所以更准确地说：

- `Basic` 回答“过程要达成什么，以及最小治理骨架是什么”
- `Agile` 回答“在敏捷工作方式下，这套骨架如何被重新编排、重新命名、重新节奏化”

因此两者不是二选一，而更像：

> **同一套治理要求，在两种工作组织视角下的不同展开方式。**

### 14.2 最先发生变化的，是 `Activity` 到 `Event` 的组织切换

如果要找 `Basic -> Agile` 最先发生的对象变化，最明显的就是：

- `Basic` 更偏 `Process -> Activity -> Task`
- `Agile` 更偏 `Process -> Event -> Task` `[直接支持]`

这意味着：

- 在 `Basic` 里，工作首先被分成若干 activity
- 在 `Agile` 里，工作首先被组织进一组节奏化事件，如 planning、daily scrum、review、retrospective、sprint 等 `[直接支持]`

但这里最关键的不是“名字变了”，而是：

- 上层 process 仍然存在
- task 仍然存在
- task 仍然要处理 work products
- 最终仍然要形成可验证、可接受、可证明的对象状态

所以真正变化的是：

- 工作块的编排方式
- 节奏感与责任分配的表现形式

而没有变化的是治理闭环本身。

### 14.3 `Outcome` 没消失，只是被事件节奏重新承载了

前面已经说明，`Basic` 的关键不是 task，而是 outcome。

到了 Agile 语境，这一点并没有被取消。

更准确地说，`5-4` 做的事情是：

- 让 `PM` 和 `SI` 的 process outcomes 不再只挂在 activity 结构上
- 而是把这些结果分散映射到 project vision meeting、estimation meeting、sprint planning、sprint、daily scrum、sprint review、sprint retrospective 等事件中去 `[直接支持]`

这意味着：

- outcome 仍然是上层约束
- event 只是新的承载容器
- task 仍然是把 outcome 落到执行层的动作

所以不能把 Agile 理解成“没有 outcomes，只剩 ceremonies”。

更准确的理解是：

> **在 `29110` 里，Agile 不是把 outcomes 取消了，而是把 outcomes 的实现与留痕分布到一组反复发生的事件节奏中。**

### 14.4 角色不是简单改名，而是责任映射

`Basic` 与 `Agile` 的另一处显著变化，是角色表面名称变了。

例如前文已经提到：

- `Basic` 中常见 `PJM`、`TL`、`WT`、`AN`、`DES`、`PR` 等角色
- `Agile` 中则出现 `PO`、`SL`、`DT` 等敏捷角色 `[直接支持]`

但这里最容易犯的错误，是把这件事理解成“把旧名字替换成新名字”。

实际上，更准确的说法是：

- `Agile` 在重新组织责任分工的表达方式
- 它让 backlog 治理、迭代节奏、自组织团队、持续改进这些责任前景化
- 但并没有把需求、设计、实现、验证、交付、追踪这些责任本身消掉

所以角色映射真正变化的是：

- 责任的呈现方式
- 协作边界的组织方式
- 工作节奏中的决策位置

而不是简单的名词替换。

### 14.5 `Work Product` 是最能看出“Agile 不是去治理化”的地方

如果要证明 `29110` 的 Agile 不是“轻治理”，最直接的地方其实不是事件表，而是 work product 体系。

因为前面已经看到，在 `5-4` 中被纳入治理的对象包括：

- `Product Backlog`
- `Sprint Backlog`
- `Increment`
- `Burndown Chart`
- `Meeting Record`
- `Change Request`
- `Validation Results`
- 与 Basic 对应的多种 work products `[直接支持]`

这说明什么？

说明 Agile 在 `29110` 里并不是：

- 少做对象
- 少留痕
- 不讲受控状态

而是：

- 把敏捷语境中的核心对象正式纳入 work product 治理系统
- 让 backlog、increment、review 结果、会议记录也成为标准对象
- 让敏捷运行结果同样能进入 repository、baseline、traceability 与 evidence 链条

所以更准确地说：

> **`29110` 里的 Agile，不是“减掉制品”，而是“把敏捷制品也纳入标准化治理”。**

### 14.6 `done` 不等于 `verified`，`verified` 也不等于 `validated` 或 `baselined`

Agile 语境里一个特别容易混的点，是把各种“完成状态”混成一句话。

但前面已经讲过，`29110` 对状态边界非常敏感。

在 `5-4` 中，work product 状态可以包括：

- `done`
- `developed`
- `delivered`
- `reviewed`
- `selected`
- `to verify`
- `verified`
- `validated`
- `published`
- `baselined` `[直接支持]`

这说明：

- `done` 更像迭代执行语境中的完成标记
- `verified` 说明它已经过按依据核实
- `validated` 说明它已经过按使用需要确认
- `baselined` 说明它已进入正式受控版本状态

因此，在 `29110` 的 Agile 里，下面这些并不是一回事：

- “这个 backlog item 做完了”
- “这个结果已经 verified”
- “这个结果已经 validated”
- “这个结果已经 baselined”

这也是 `29110` 的 Agile 和很多口头敏捷最大不同的地方：

- 它仍然要求把状态边界讲清楚
- 它仍然要求结果状态能够外显为受控对象

### 14.7 `Basic` 与 `Agile` 真正的映射，不是表面对照，而是对象重挂载

如果只做一个表格，把 activity 对应到 event，理解仍然会比较浅。

更深一层的看法是：

- `Basic` 把治理骨架挂在 process / activity / task 上
- `Agile` 把同样的治理要求重新挂到 event / role / agile work products 上
- 本质上是**同一组对象关系在不同工作节奏中的重挂载**

可以把它压缩成下面这张图：

```text
Basic
  -> Process
    -> Activity
      -> Task
        -> Work Product
          -> State / Repository / Baseline

Agile
  -> Process
    -> Event
      -> Task
        -> Agile Work Product + Basic Work Product
          -> State / Repository / Baseline
```

这张图最重要的意思是：

- 上层 process 没消失
- 下层 task 没消失
- work product 没消失
- state / repository / baseline 没消失
- 变化的核心，只是中间那层“工作如何被组织与呈现”

### 14.8 为什么 `PM` 和 `SI` 在 Agile 中仍然都存在

另一个常见误解，是把 Agile 理解成“只剩开发迭代，没有项目管理”。

但 `5-4` 恰恰不是这么做的。

前面已经看到，它同时明确讨论：

- `Project management process of Basic profile and the agile events...`
- `Software implementation process of Basic profile and the agile events...` `[直接支持]`

这意味着：

- `PM` 在 Agile 中并没有消失
- `SI` 在 Agile 中也没有消失
- 它们只是通过 sprint 节奏、会议、backlog、increment 等对象重新进入运行方式

所以在 `29110` 的 Agile 里，并不是：

- 只剩下一条开发主线

而仍然是：

- 一条项目治理主线
- 一条软件实现主线
- 两者通过敏捷事件和 work products 保持耦合

### 14.9 第一遍学习 `Basic -> Agile` 映射时，先不要做什么

为了避免把这一章读成“Scrum 名词表”，第一遍学习时，有几件事可以先刻意不做：

- 不急着把 `5-4` 理解成脱离 `Basic` 的独立方法论
- 不急着把 ceremonies 当成全部内容
- 不急着把 `done` 等同于全部治理状态
- 不急着把 backlog / increment 理解成工具界面里的字段
- 不急着只讨论敏捷价值观，而忽略对象与证据链

第一遍最重要的是先建立下面这个最小模型：

```text
Basic 的治理骨架
  -> 被 Agile 事件节奏重新组织
  -> 由 Agile 角色重新承载责任
  -> 通过 Agile Work Products 重新外显状态
  -> 但仍然回到同一套验证、确认、基线、仓库与证据逻辑
```

只要这个模型立住，后面再回到：

- backlog、increment、meeting record 各自承担什么治理角色
- 哪些状态在 sprint 内发生、哪些状态必须进入受控版本
- 第三方审核时如何看待这些敏捷对象

理解都会顺很多。

### 14.10 把 `Basic -> Agile` 映射放在最后讲透的意义

到这一节结束时，整条纵深主线就真正闭环了。

前面几阶段已经依次解决了：

- `Basic` 作为主入口为什么重要
- `Basic` 的最小骨架是什么
- `Purpose / Outcome / Activity / Task` 如何分层
- `PM` 与 `SI` 两条主线如何展开
- `Work Product` 为什么是治理中心
- `Verification / Validation / Acceptance / Audit Evidence` 如何区分

而这一节进一步解决的是：

- 为什么 `Agile` 不是对 `Basic` 的替代，而是对象级映射
- 为什么真正变化的是 activity 到 event 的组织方式，而不是治理闭环本身
- 为什么敏捷制品会被纳入同一个 work product 治理系统
- 为什么只有看清这些对象映射，才能理解 `29110` 所说的“标准化敏捷”

因此，如果只用一句话压缩这一节，可以先记成：

> **在 `29110` 里，`Agile` 不是把 `Basic` 推翻，而是把同一套 process、task、work product、state、repository、baseline 与 evidence 要求，重新挂载到 event、敏捷角色与敏捷制品上的另一种运行方式。**

---

## 第十五阶段：`Certification` 视角下，审核员到底如何沿着对象链看 `29110`

到这里，`29110` 的内部对象系统其实已经基本铺开了。

前面已经分别讲过：

- `Basic Profile` 为什么是主入口
- `PM` 与 `SI` 两条主线如何控制结果
- `Work Product` 为什么是治理中枢
- `Verification / Validation / Acceptance / Audit Evidence` 为什么必须分开
- `Agile` 为什么不是替代 `Basic`，而是对象重挂载

但如果只停在“组织自己怎么理解”，这套体系还没有真正闭环。

因为 `29110` 和很多过程方法最大的不同之一就在于：

> **它不是只关心你会不会讲自己的过程故事，而是关心第三方能不能沿着一条客观对象链，判断你是否真的符合某个 profile。**

这也是为什么最后必须把视角切到 `Certification`：不是再重复一次认证流程，而是要真正理解——**审核员看见的 `29110`，和实施者日常感受到的 `29110`，其实是同一套对象系统的另一面。**

### 15.1 审核员首先看的，不是“团队好不好”，而是“你声称符合什么”

很多人会把认证理解成一种笼统判断：

- 这个团队成熟不成熟
- 这个团队工程做得好不好
- 这个产品质量高不高

但从前文对 `3-2` 的分析已经很清楚，`29110` 的认证对象更准确地说是：

- 某个 `VSE` 的过程
- 对某个 `profile` 规范的满足情况
- 在 `certification scheme` 下的第三方认定 `[直接支持]`

所以审核员进入现场时，最先要建立的不是“好团队 / 差团队”印象，而是下面这条起点线：

```text
你是谁（VSE）
  -> 你声称采用哪个 Profile
    -> 这个 Profile 要求你达成哪些过程结果
```

因此，认证的第一步不是看工具，不是看代码，也不是先看某次会议开得好不好，而是先锁定：

- 审核范围是什么
- 适用的 profile 是什么
- 被评价的是哪组过程要求

如果这一步没有锁定，后面所有证据都会漂浮。

### 15.2 审核员真正要追的，是一条“要求到证据”的闭环链

从对象系统上看，审核员真正关心的不是单个 artefact，而是一条可追的链。

把前文所有阶段压到认证视角，可以得到这样一条最核心的审核链：

```text
Profile Requirement
  -> Process Purpose / Outcomes
    -> Activity / Event / Task 的实际运行
      -> Work Products
        -> State / Repository / Baseline / Traceability
          -> Verification / Validation / Acceptance 结果
            -> Audit Evidence
              -> Results of Evaluation
                -> Certification Decision
```

这条链里最关键的意思是：

- 认证不是只看“有没有做事”
- 认证也不是只看“有没有文档”
- 认证要看“要求、执行、结果、状态、证据、判定”能不能连起来

所以如果一定要压缩成一句话，可以先记成：

> **审核员不是在找一堆文件，而是在找一条从 profile requirement 连到 certification decision 的对象闭环。**

### 15.3 为什么审核员不会把“开过会”直接当成“符合”

前面讲 `Agile` 时已经强调，`29110` 并不是只看 ceremonies。

到了认证视角，这件事会更明显。

因为对审核员来说，下面几件事不是一回事：

- 开过 sprint planning
- backlog 被受控维护
- 对应结果真的形成了受控 work product
- 这些对象已经过 verification / validation / acceptance
- 它们能够支撑某个 outcome 被认为已经实现

也就是说，审核员不会因为团队说：

- “我们每天都开 daily”
- “我们每两周 review 一次”
- “我们很敏捷”

就自动判定符合。

审核员真正会继续追问的是：

- 这些事件承载了哪些 task
- 这些 task 产生了哪些结果对象
- 这些结果对象现在是什么状态
- 它们是否能证明某个 requirement / outcome 已被满足

所以在认证语境下，事件只是入口，不是结论。

### 15.4 `Work Product` 为什么会成为审核员最稳定的抓手

如果说实施者最容易感受到的是 task 和协作节奏，那么审核员最稳定的抓手通常就是 `Work Product`。

原因很简单：

- task 是发生过的动作
- event 是一段时间里的组织方式
- role 是责任承载者
- 但最终最容易被第三方客观检查的，仍然是留下来的 work products 及其受控状态

这也正好对应前面已经反复讲过的结论：

- verification、validation、acceptance、audit evidence 最终都会回到对象承载上
- 而这个对象承载的中心就是 `Work Product`

所以审核员通常不会满足于“我们确实做了”，而会继续看：

- work product 在不在
- 是不是版本受控
- 状态是否清楚
- 是否能够从输入追到输出
- 是否能够从结果追到形成该结果的依据

这也是为什么 `29110` 的认证天然会把组织重新拉回到 work product 治理质量上。

### 15.5 审核员看的不是“文档多不多”，而是“证据链是否可证明”

很多团队一听到认证，就会立刻滑向两个极端：

- 要么觉得“只要文档多就行”
- 要么觉得“敏捷团队肯定不适合被审”

但 `29110` 的逻辑并不是这两个方向。

更准确地说，审核员要看的不是文档数量，而是证据质量。

所谓证据质量，至少包含几层：

- 这个对象是否真实存在
- 它是否与某个要求有关联
- 它的状态是否清楚
- 它是否处在受控库 / 基线 / 追踪关系中
- 它是否足以支撑 evaluation result 与 decision making

所以：

- 文档很多，但彼此无追踪、无状态、无边界，不一定构成好证据
- 文档不多，但关键对象闭环清楚、状态清楚、追踪清楚，反而更接近 `29110` 想要的证据质量

这也是 `VSE` 友好性的真正含义之一：

> **不是让你靠少写文档逃离治理，而是让你用更小但更清楚的对象集完成可证明治理。**

### 15.6 审核员如何区分 `verification`、`validation`、`acceptance` 与 `audit evidence`

前一阶段已经把这四层边界本身讲透了。

到了审核员视角，最重要的不是再背定义，而是理解他为什么必须把它们拆开看。

因为如果不拆开，认证判断会立刻混乱：

- 一个对象被 `verified`，并不自动说明它已经 `validated`
- 一个对象被 `validated`，并不自动说明它已经被相关方正式 `accepted`
- 某个结果被 `accepted`，也不自动说明你已经留下足够的 `audit evidence`

审核员在看时，更像是在区分四种不同问题：

- 它是否按规定被核实过
- 它是否按使用需要被确认过
- 它是否被相关方正式接收过
- 这些状态是否被受控对象可靠地证明出来

所以从认证角度看，这四个词不是术语细节，而是四类不同的判定边界。

### 15.7 `On-site / Remote Audit` 改变的是取证方式，不改变对象逻辑

前文读 `3-2` 时已经看到，标准会明确讨论：

- `On-site and remote audits`
- `Audit plan`
- `Audit team selection and assignments`
- `Results of evaluation`
- `Decision making` 等对象 `[直接支持]`

这说明认证不是随手抽查，而是一个受控审核过程。

但从对象系统上看，`on-site` 和 `remote` 的差异，主要只是：

- 审核员如何接触对象
- 如何访谈角色
- 如何查看仓库、记录与状态
- 如何组织审计计划与取证活动

而不是：

- 远程审就可以不看证据链
- 现场审就只凭印象判断

换句话说：

> **审核方式可以变化，但审核对象链不会变化。**

无论现场还是远程，审核员最终都还是要回到：

- profile requirement
- process outcomes
- work products
- state / baseline / repository / traceability
- evaluation result 与 certification decision

### 15.8 为什么认证结论最终仍然会回到 `Decision Making`

`3-2` 中一个特别值得注意但容易被忽略的对象，是：

- `Results of evaluation`
- `Decision making`
- `Certification documentation` `[直接支持]`

这说明认证并不是“发现了一些证据就自动发证”。

中间至少还有一层非常关键的对象边界：

- 证据是证据
- 评估结果是对证据的整理与判断
- 认证决定则是基于这些结果做出的正式机构行为

因此，审核员沿对象链一路往前追，最后并不是停在“我看到了某份 backlog”或者“我看到了某次评审记录”。

最后真正需要落下来的，是：

- 这些对象如何支撑 evaluation result
- evaluation result 如何支撑 certification decision
- decision 如何进入正式 certification documentation

所以认证闭环的最后一环，并不是某个 artefact，而是**被制度化表达出来的决定对象**。

### 15.9 第一遍从认证视角理解 `29110` 时，先不要做什么

为了避免把这一章读成“审计流程手册”，第一遍学习时，有几件事可以先刻意不做：

- 不急着背认证机构流程细节
- 不急着把注意力放在申诉、名录等外围管理对象上
- 不急着把审核理解成对个人能力的主观打分
- 不急着把认证理解成“文档检查”
- 不急着脱离 `Profile -> Outcome -> Work Product -> Evidence` 主链去看局部对象

第一遍最重要的是先建立下面这个最小模型：

```text
组织声称符合某个 Profile
  -> 审核员据此锁定 requirement 与 process outcomes
  -> 沿 task / event 的实际运行去找 work products
  -> 检查这些对象的状态、基线、仓库与追踪关系
  -> 区分 verification / validation / acceptance / audit evidence
  -> 形成 evaluation result
  -> 进入 certification decision
```

只要这个模型立住，后面再回到：

- 审核计划怎么组织
- 现场与远程怎么切换
- 认证文件、名录、申诉为什么存在

都会更容易放到正确层次里去理解。

### 15.10 把 `Certification` 放到最后讲透的意义

到这一节结束时，这份文档的纵深线基本就完整了。

前面几阶段已经逐步建立了：

- `VSE` 与 `Profile` 的总开关
- `Basic Profile` 的最小执行骨架
- `PM` 与 `SI` 的双主线
- `Work Product` 的治理中心地位
- `Verification / Validation / Acceptance / Audit Evidence` 的边界
- `Basic` 与 `Agile` 的对象级映射

而这一节最终补上的，是最后那个经常被忽略、但决定整个体系是否闭环的问题：

- 第三方到底是沿什么路径来判断你“真的符合”
- 为什么认证不是看气氛、不是看口号、不是看文档数量
- 为什么 `29110` 的对象系统最终必须能被审核员重走一遍
- 为什么只有当这条对象链能被第三方复核，`29110` 才真正从“实施框架”变成“可证明标准”

因此，如果只用一句话压缩这一节，可以先记成：

> **在 `29110` 里，`Certification` 的本质，不是第三方来听你解释流程，而是第三方沿着 `Profile -> Outcome -> Work Product -> State / Evidence -> Evaluation -> Decision` 这条对象链，独立判断你的过程是否真的可被证明地符合。**

---

## 小结

29110 最值得抓住的，不是“它是小团队标准”这么简单，而是下面四点：

1. **它用 Profile 机制把大标准裁成小团队可执行的子集。**
2. **它用 PM + SI 给出最小但完整的生命周期骨架。**
3. **它用 Work Product / Repository / Baseline 形成治理与追踪闭环。**
4. **它用 Guideline + Certification Scheme 让小团队既能做起来，也能被认可。**

所以，如果只用一句话概括：

> `ISO/IEC 29110` 不是“轻量版大标准”，而是“为 VSE 设计的一套从裁剪、执行、治理到符合性证明的完整生命周期体系”。

---

## 当前文档建议参考的 PDF

### 一、当前正文的核心主参考

- `ISO IEC 29110-1-1-2024.pdf` — Overview
- `ISO IEC 29110-1-2 2024.pdf` — Vocabulary
- `ISO IEC 29110-4-1 2018.pdf` — Generic profile group specification
- `ISO IEC 29110-5-1-2 2025.pdf` — Software Basic profile guideline
- `ISO IEC 29110-5-4 2025.pdf` — Agile software development guidelines
- `ISO IEC 29110-3-2 2018.pdf` — Conformity certification scheme

### 二、当前文档已涉及或建议补充交叉的扩展参考

- `ISO IEC 29110-3-2 2018 Amd1 2025.pdf` — Conformity certification scheme amendment
- `ISO IEC 29110-4-2 2021.pdf` — Entry profile group specification
- `ISO IEC 29110-4-3 2018.pdf` — Intermediate profile group specification
- `ISO IEC 29110-5-1-1 2025.pdf` — Entry profile guideline

### 三、作为上游背景理解时建议同时对照的标准 PDF

- `12207-2017.pdf` / `12207-2026.pdf`
- `15288-2023.pdf`
- `15289-2019.pdf`

### 四、建议阅读顺序

如果只想按当前这份文档的主线阅读，优先顺序可以先抓：`1-2 -> 1-1 -> 4-1 -> 5-1-2 -> 5-4 -> 3-2`；如果要补齐 profile 全景与认证修订，再读 `4-2`、`4-3`、`5-1-1`、`3-2 Amd1`。

其中带有“`[直接支持]`”标记的内容，表示可直接从上述标准文本得到；带有“`[综合归纳]`”标记的内容，表示基于多份文档交叉后的抽象总结。
