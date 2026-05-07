# ISO/IEC/IEEE 15288：讨论与对象抽象

> 本文的目标不是穷举 30 个过程，也不是背诵所有 Activity 和 Task。
>
> 当前做两件事：
> 1. **先把 15288 的核心概念地基打牢**——哪些术语在说什么、哪些容易搞混
> 2. **再把 15288 理解为一个分层对象系统**——像 BPMN 那样，先看清"它要表达什么、用什么表达、如何成为标准、怎么落地"
>
> 你可以先把 15288 理解成：**一套描述"人造系统生命周期中应该有哪些过程、这些过程如何协作、组织如何声明自己符合标准"的国际标准。**

---

## 学习阶段总览

当前这份讨论与抽象文档，按 6 个阶段展开：

0. **第零阶段：概念地基**
   - 把 15288 最重要的核心术语逐个讲清楚
   - 把最容易混淆的概念对照辨析
   - 确保后续学习不因术语含混而理解偏移
1. **第一阶段：整体架构——把 15288 看成分层系统**
   - 回答 15288 是什么
   - 建立"它是系统过程标准，不是方法模板"的基本认识
   - 用 BPMN 同款四层框架看全景
2. **第二阶段：四大过程组不是顺序阶段，而是不同治理层**
   - 区分协议过程组、组织级项目使能过程组、技术管理过程组、技术过程组
   - 看清每组"负责什么、不负责什么、怎么配合"
3. **第三阶段：技术过程主线——从问题空间到运行空间**
   - 从业务/任务分析到处置，建立技术过程的主干理解
   - 理解"问题空间 → 解决方案空间 → 运行空间"的收敛逻辑
4. **第四阶段：15288 独有的系统层概念**
   - 理解 System of Systems (SoS)、Enabling System、Interoperating System
   - 理解产品线工程 (PLE) 与 15288 的关系
   - 理解 Assurance Case、Quality Characteristics
5. **第五阶段：符合性与裁剪**
   - 理解 Full Conformance、Tailored Conformance
   - 理解按 Outcome 符合与按 Task 符合
   - 理解 15288 与 12207 的同源关系

---

## 第零阶段：概念地基

> 在进入架构和过程细节之前，先把 15288 里最核心的术语逐个讲清楚。
>
> 这样做的理由很简单：**如果术语含混，后面的理解一定会偏移。**
>
> 这一阶段不要求你记住所有细节，但要求你在遇到这些词时，不再凭直觉猜。

---

### 0.1 15288 的六层对象关系图

15288 不是一张顺序流程图，而是一个由概念到落地的六层对象体系：

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    15288 的六层对象体系                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  第一层：系统与生命周期观                                            │
│  ───────────────────────────────────────────────                    │
│  System                   —— 部件组合后呈现整体行为或意义的安排       │
│  SoI (System of Interest) —— 标准真正作用的目标对象                  │
│  System Element           —— 构成系统的离散部分                      │
│  SoS (System of Systems)  —— 多个系统交互形成的独特能力集合          │
│  Enabling System          —— 支撑 SoI 生命周期活动的系统             │
│  Interoperating System    —— 与 SoI 交换信息并使用的系统             │
│  Life Cycle               —— 对象从概念到退役的演化历程              │
│  Stage                    —— 生命周期中的时期划分                    │
│  Life Cycle Model         —— 组织阶段与过程应用方式的结构化模式      │
│                                                                     │
│  第二层：过程参考模型                                                │
│  ───────────────────────────────────────────────                    │
│  Process                  —— 回答"做什么、达到什么"的责任维度       │
│  Activity                 —— 过程内的工作块                         │
│  Task                     —— 最具体的动作项                         │
│  Outcome                  —— 过程期望达成的状态/结果                 │
│  Work Product             —— 工作中产生和维护的工件                  │
│  Information Item         —— 供人使用的信息体（由 15289 定义）       │
│                                                                     │
│  第三层：符合性与裁剪                                                │
│  ───────────────────────────────────────────────                    │
│  Conformance              —— 对标准要求的声明满足                   │
│  Compliance               —— 对外部法规/制度/合同的义务满足          │
│  Tailoring                —— 对标准过程的应用调整                   │
│  Objective Evidence       —— 支撑符合性声明的客观证据                │
│                                                                     │
│  第四层：组织与项目治理                                              │
│  ───────────────────────────────────────────────                    │
│  Agreement                —— 合作关系与承诺边界的抽象框架            │
│  Organization             —— 提供长期可复用能力的主体               │
│  Project                  —— 在特定约束下交付 SoI 的临时组织         │
│  Procedure                —— 按"什么步骤做"的操作规程               │
│                                                                     │
│  第五层：工程与运行落地                                              │
│  ───────────────────────────────────────────────                    │
│  Verification             —— 对照规定要求检查是否满足               │
│  Validation               —— 对照预期用途检查是否有价值             │
│  Assurance                —— 对主张已被/将被达成的合理置信           │
│  Deliverable              —— 协议约定对外交付的对象                  │
│  Transition               —— SoI 从开发转入运行环境                  │
│                                                                     │
│  第六层：15288 独有的系统层概念                                      │
│  ───────────────────────────────────────────────                    │
│  Architecture             —— 系统在其环境中的基本概念/属性与演化原则 │
│  Design                   —— 支撑合规实现的系统元素及其关系的规约     │
│  Quality Characteristic   —— 与需求相关的产品/服务/过程/系统固有特征 │
│  Assurance Case           —— 证据→论证→主张的可审计工件             │
│  PLE (Product Line Eng.)  —— 产品线工程，共享资产+变体管理           │
│  MBSE                     —— 基于模型的系统工程方法                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

这张图的意义在于：

- 15288 不只是"30 个过程的清单"，而是一个从系统概念到落地的完整对象体系
- 每一层回答不同的问题：系统是谁、做什么、怎么声明、谁治理、怎么落地、系统层有什么特殊
- 只有先看清这个整体，后面学习具体过程时才知道自己在理解哪一层
- 与 12207 相比，15288 多了一层"系统层概念"——因为 15288 作用的对象不限于软件，而是完整的**人造系统**

---

### 0.2 核心概念清单

下面把 15288 最重要的术语，按六层分组，逐个讲清楚。

#### 第一组：系统与生命周期

**System——15288 作用的基本单位**

15288 定义的 System 不是"一台服务器"或"一段代码"，而是：

- **部件/元素的安排**——这些部件/元素组合后，呈现出单个组成部件所不具备的行为或意义
- 系统可以是物理的、概念的，或两者兼有
- 系统的性质（作为整体）**涌现**自各部件的性质及其间的交互和关系

> 一句话：**15288 里的 System = 部件组合后涌现整体行为的安排。**

**SoI (System of Interest)——标准到底在作用于什么对象**

15288 的技术过程，不是在"写代码"或"装硬件"，而是在**作用于一个特定的对象**——System of Interest。

- SoI 是生命周期正在被考虑的那个系统
- 它可以是一台设备、一个软硬件混合系统、一个服务系统、甚至更大的系统中的子系统
- 技术过程直接改变 SoI 的状态；组织级过程和管理过程间接支撑 SoI 生命周期

> 一句话：**SoI 就是 15288 所有过程的"目标对象"。**

**System Element——构成系统的离散部分**

- 系统元素是实现指定需求的离散部分
- 示例：硬件、软件、数据、人员、过程（如提供服务的过程）、规程（如操作员指令）、设施、材料
- 一个系统元素本身可以被看作一个系统（这就是递归的来源）

> 一句话：**System Element 是 SoI 的构成单元，当它本身足够复杂时，可以递归地成为新的 SoI。**

**SoS (System of Systems)——系统之系统**

15288 独有的重要概念。SoS 是：

- **一组系统或系统元素**，它们交互以提供任何组成系统单独无法实现的独特能力
- 组成系统（Constituent System）本身是有用的独立系统，有自己的开发、管理、目标
- 但它们在 SoS 中交互，以提供 SoS 独有的能力

SoS 与普通系统的关键区别不在结构，而在**行为和管理特征**：

| 特征 | 普通系统 | SoS |
|------|---------|-----|
| 运营独立性 | 通常没有 | 组成系统可独立运营 |
| 管理独立性 | 通常统一管理 | 组成系统由不同组织管理 |
| 演化方式 | 通常有统一路线图 | 组成系统独立演化，SoS 能力涌现 |
| 目标对齐 | 系统目标统一 | 组成系统目标可能与 SoS 不完全对齐 |

> 一句话：**SoS = 多个独立系统交互涌现出独特能力，而非简单拼装。**

**Enabling System——支撑 SoI 的系统/能力**

标准里，Enabling System 不是"背景服务"，而是正式的系统角色：

- 生产使能系统、培训系统、维护系统——都是 Enabling System
- 它们支撑 SoI 一个或多个生命周期阶段的活动
- **它们本身不是 SoI，但 SoI 的生命周期活动离不开它们**
- 每个 Enabling System 有自己的生命周期，当它自身成为 SoI 时，15288 同样适用

> 一句话：**Enabling System 是"支撑 SoI 从诞生到退役的系统能力"，有自己独立的生命周期。**

**Interoperating System——与 SoI 交换信息并使用的系统**

- Interoperating System 是 Interfacing System 的子集
- Interfacing System：在 SoI 生命周期任何阶段与 SoI 共享接口的系统
- Interoperating System：不仅共享接口，还**交换信息并使用该信息**
- 互操作性不仅涉及信息，还可能涉及物理互操作性

> 一句话：**Interfacing System 共享接口，Interoperating System 还要交换并使用信息——后者是前者的子集。**

**Life Cycle——对象的存在历程**

- 生命周期是 SoI 从概念到退役的**完整演化历程**
- 它不是标准强制的流程模板，而是对象客观经历的时间跨度

**Stage——生命周期中的时期划分**

- Stage 按**时间/里程碑**划分：概念阶段、开发阶段、生产阶段、运行阶段、保障阶段、退役阶段
- Stage ≠ Process：过程按**职责/目的**划分，可跨阶段反复发生
- 阶段之间可以重叠、并发、迭代

**Life Cycle Model——组织阶段与过程应用方式的结构化模式**

- 生命周期模型是组织**如何选择和安排**阶段与过程的采用方式
- 瀑布、增量、迭代、敏捷——都是不同的 Life Cycle Model
- 组织级的 `Life Cycle Model Management` 过程，负责为项目提供采用框架
- **15288 不规定特定的生命周期模型**

> 三者关系：**Life Cycle 是历程，Stage 是时期，Life Cycle Model 是组织方式。**

---

#### 第二组：过程参考模型

**Process——回答"做什么、达到什么"的责任维度**

- 过程定义的是**目的与结果**，不是步骤和工具
- 一个过程通过多个 Activity 实现，Activity 又分解为 Task
- 过程的责任不能缺，但实现方法可以多样

**Activity——过程内的工作块**

- Activity 是过程内部的一组相关任务
- 它不是时间线上的"阶段"，而是过程内职责维度的切分

**Task——最具体的动作项**

- Task 是可以被检查是否完成的动作
- 但**完成任务 ≠ 达成结果**（这是符合性声明两种路径的根本差异来源）

**Outcome——过程期望达成的状态/结果**

- Outcome 是一种**状态描述**，不是一份文档
- 一个过程可以有多条 Outcome
- 符合性可以按 Outcome 声明（结果导向），也可以按 Task 声明（动作导向）

**Work Product——工作中产生和维护的工件**

- Work Product 是 Outcome 的**物化载体**：文档、代码、模型、测试报告、配置基线
- 一个 Outcome 可能通过多个 Work Product 体现
- Work Product ≠ Deliverable（对外交付物只是其中一部分）

**Information Item——供人使用的信息体**

- 由 ISO/IEC/IEEE 15289 专门定义其内容
- 15288 本身不规定信息项的名称、格式和详细内容
- 信息项是 Work Product 的子类——特指"为人类使用而生产、存储和交付的信息体"

> 五层关系链：**Process → Activity → Task → Outcome → Work Product / Information Item**

---

#### 第三组：符合性与裁剪

**Conformance——对标准要求的声明满足**

- Conformance 是对标准中规定条件的**正式满足声明**
- 分 Full Conformance（完全符合）和 Tailored Conformance（裁剪后符合）
- 声明基础可以是 Task-based（做了规定动作）或 Outcome-based（达成了规定结果）

**Compliance——对外部法规/制度/合同的义务满足**

- Compliance 常指法规合规、合同义务、行业制度
- Conformance ≠ Compliance：**前者面向标准，后者面向法规/合同**

**Tailoring——对标准过程的应用调整**

- 裁剪可以作用于：过程的选择、Activity 的增减、Task 的调整、Outcome 的映射
- 但裁剪**不能丢失可理解性和可追溯性**
- 裁剪后符合可能削弱符合性声明的价值

**Objective Evidence——支撑符合性声明的客观证据**

- 证据不等于文档：它可以是记录、测试结果、审计日志、度量数据
- 证据链：Outcome → Work Product → Evidence → Conformance Claim

---

#### 第四组：组织与项目治理

**Agreement——合作关系与承诺边界的抽象框架**

- Agreement 不是"合同"的别名，而是**获取方与供应方之间关系、承诺与责任的抽象框架**
- Acquisition 和 Supply 是双方在 Agreement 下执行的过程
- Agreement 回答"谁和谁、约定什么、各自承担什么"

**Organization vs Project**

- Organization 是**长期存在**的，提供可复用的制度、能力、资源
- Project 是**临时组织**，在特定约束下交付 SoI
- 组织级项目使能过程组服务于 Organization；技术管理过程组服务于 Project

**Procedure——按"什么步骤做"的操作规程**

- Process 回答"做什么/达到什么"（责任维度）
- Procedure 回答"按什么步骤做"（执行维度）
- Method 回答"用什么方法做"（方法论维度）
- **一个 Process 可以有多种 Procedure 和 Method，但 Process 的目的和 Outcome 不能缺**

---

#### 第五组：工程与运行落地

**Verification vs Validation——参照物不同**

- Verification：对照**规定要求**检查——"我做的东西符合规格吗？"
- Validation：对照**预期用途/利益相关方需要**检查——"我做的东西在真实场景中有价值吗？"
- 验证的参照物是文档/规格；确认的参照物是使用目标/运营价值
- 标准原文用两句话做了精辟区分：
  - Verification: "The system was built right."（系统造对了）
  - Validation: "The right system was built."（造了对的系统）

**Integration vs Verification——关注点不同**

- Integration：关注把系统元素**组合成整体并使其协同**
- Verification：关注已规定要求**是否被满足**
- 集成完成 ≠ 验证通过

**Transition vs Operation——不是一回事**

- Transition：SoI 从开发环境**进入运行环境**的活动（上线/部署/切换）
- Operation：SoI 在运行环境中**持续提供服务**的活动
- 上线完成 ≠ 稳定运行

**Deliverable——协议约定对外交付的对象**

- Deliverable 是 Agreement 中约定交给获取方的工件
- Work Product 范围更广：设计记录、测试证据、配置基线都是 Work Product，但不一定都是 Deliverable
- **交付物不等于全部工作产品**

**Assurance——对主张已被/将被达成的合理置信**

- Assurance 是 15288 比 12207 更强调的概念
- 利益相关方在依赖系统之前需要 Assurance，尤其是涉及复杂性、新颖性或问题历史的系统
- Assurance 常通过构建 **Assurance Case** 实现：证据 → 论证 → 主张
- 安全性 Assurance Case、安全性 Assurance Case、可靠性 Assurance Case 是常见类型

---

#### 第六组：15288 独有的系统层概念

**Architecture vs Design——抽象层级不同**

这是 15288 里最关键的概念区分之一：

- **Architecture**：关注系统在其环境中的**基本概念/属性**与**实现和演化的治理原则**
  - 回答"系统应该是什么样的、为什么这样"
  - 关注**适用性、可行性、可取性**
  - 尽量设计无关（design-agnostic），保留设计灵活性
- **Design**：关注系统元素及其关系的**详细规约**，足够完整以支撑合规实现
  - 回答"如何具体实现架构"
  - 关注**与技术和其他设计元素的兼容性、构建与集成的可行性**
  - 驱动需求经过架构评估和更详细的可行性分析

> 一句话：**Architecture 定方向与原则，Design 定细节与实现——前者尽可能设计无关，后者尽可能实现具体。**

**Quality Characteristic——与需求相关的固有特征**

- 质量特征是产品、服务、过程或系统的**固有特征**，与需求相关
- 常见质量特征：功能性、可靠性、可维护性、可用性、可生产性、时效性
- 15288 的技术过程旨在使产品/服务具备这些质量特征
- 安全性（Safety）、安全性（Security）、可靠性（Dependability）是特殊的质量特征，需要专门的 Assurance Case

**Assurance Case——证据→论证→主张的可审计工件**

- Assurance Case 是一个**可审计的工件**，在给定语境下，基于切实证据为主张提供令人信服且有效的论证
- 它不是简单的测试报告，而是：证据 → 子主张 → 推理 → 总主张的结构化论证
- 15288 明确要求：Assurance 活动应**集成到整个系统生命周期的过程中**
- ISO/IEC/IEEE 15026 系列提供更详细的 Assurance 和 Assurance Case 指导

**PLE (Product Line Engineering)——产品线工程**

- 当组织开发产品线时，整体工程化产品线比逐个工程化每个系统更高效
- 产品线作为单一 SoI 进行工程化，定义变体以支撑各个系统实例
- 特定系统实例被开发、确认和部署后，它自身成为 SoI，拥有自己的后开发生命周期
- Feature-based PLE 的核心信条：
  - 特征目录（Feature Catalogue）捕获产品线中系统实例的区分特征
  - 特征集（Bill of Features）指定特定实例适用的特征
  - 共享资产超集（Shared Asset Supersets）维护所有内容的单一副本
  - 变体点（Variation Points）封装变化内容
  - 系统实例 = 通用内容 + 按选择特征自动派生的变体点

**MBSE (Model-Based Systems Engineering)——基于模型的系统工程**

- 15288 的过程常以 MBSE 方式应用——使用一组模型来实现过程并达成预期结果
- MBSE 是 Annex D（资料性附录）的主题
- 在 MBSE 中，系统需求、架构、设计通过模型而非纯文档表达
- PLE 的特征目录本身就是一种 MBSE 模型

---

### 0.3 最容易混淆的 15 组概念辨析

| # | 概念 A | 概念 B | 核心差异 | 一句话区分 |
|---|--------|--------|----------|------------|
| 1 | System | SoI | 前者是通用定义，后者是标准作用的目标对象 | "System 是定义，SoI 是当前关注的那一个" |
| 2 | SoI | System Element | 前者是被关注的系统，后者是其组成部件 | "SoI 是整体，System Element 是部件" |
| 3 | SoS | 系统集合 | 前者交互涌现独特能力，后者可能只是拼装 | "SoS 靠交互涌现，不是简单拼装" |
| 4 | Enabling System | Interoperating System | 前者支撑 SoI 生命周期，后者与 SoI 交换信息并使用 | "使能系统帮做事，互操作系统换信息" |
| 5 | Life Cycle | Life Cycle Model | 前者是客观历程，后者是组织方式 | "生命周期是历程，生命周期模型是安排方式" |
| 6 | Stage | Process | 前者按时间/里程碑划，后者按职责/目的划 | "阶段是时期，过程是责任" |
| 7 | Process | Procedure | 前者回答"做什么/达到什么"，后者回答"按什么步骤做" | "过程定目的，规程定步骤" |
| 8 | Task | Outcome | 前者是动作完成，后者是状态达成 | "做了事 ≠ 达成结果" |
| 9 | Outcome | Work Product | 前者是期望状态，后者是物化载体 | "结果是状态，工件是载体" |
| 10 | Work Product | Deliverable | 后者是约定的对外交付物，前者范围更广 | "交付物是工件子集" |
| 11 | Conformance | Compliance | 前者面向标准，后者面向法规/合同 | "符合标准 ≠ 合规法规" |
| 12 | Verification | Validation | 前者对照规定要求，后者对照预期用途 | "验证对规格，确认对价值" |
| 13 | Architecture | Design | 前者定方向与原则（设计无关），后者定细节与实现 | "架构定方向，设计定实现" |
| 14 | Quality Management | Quality Assurance | 前者偏组织质量政策/改进，后者偏项目级独立保证与客观证据 | "质量管理定政策，质量保证给证据" |
| 15 | Concept of Operations | Operational Concept | 前者关于组织的运营意图，后者关于特定系统的运营方式 | "组织级运营意图 vs 系统级运营方式" |

---

### 0.4 第零阶段最值得背下来的 6 句话

1. **SoI 是 15288 所有过程的"目标对象"，技术过程直接改变它的状态。**
2. **System 的性质涌现自部件和交互——15288 不是还原论，是系统论。**
3. **Life Cycle 是历程，Stage 是时期，Life Cycle Model 是组织方式。**
4. **Architecture 定方向与原则，Design 定细节与实现——两者不等于。**
5. **Conformance 面向标准，Compliance 面向法规——两者不等于。**
6. **SoS 靠交互涌现独特能力，不是简单拼装——管理独立性和运营独立性是 SoS 的本质特征。**

---

### 0.5 第零阶段最容易犯的 6 个错误

#### 误解 1：把 System 等同于"软件系统"

不对。15288 的 System 包含硬件、软件、人员、过程、设施、材料以及自然实体的任意组合。它覆盖的远不止软件。

#### 误解 2：把 Architecture 和 Design 当成同一件事

不对。Architecture 关注基本概念、属性和演化原则；Design 关注系统元素及其关系的详细规约。Architecture 尽量 design-agnostic，Design 尽量实现具体。

#### 误解 3：把 SoS 当成"大系统"

不对。SoS 与普通系统的区别不在规模，而在行为和管理特征——组成系统的运营独立性和管理独立性才是关键。

#### 误解 4：把 Enabling System 当成"附属工具"

不对。Enabling System 是正式的系统角色，有自己的生命周期。当它自身成为 SoI 时，15288 全部过程同样适用。

#### 误解 5：把 Life Cycle 和 Life Cycle Model 当成同一件事

不对。一个是客观历程，一个是组织选择。

#### 误解 6：把四大过程组当成顺序阶段

不对。它们是不同治理层，不是顺序流水线。

---

### 0.6 第零阶段过关标准

如果第零阶段学明白了，你现在应该已经能回答：

- System、SoI、System Element 三者什么关系？
- SoS 与普通系统的本质区别是什么？
- Enabling System 和 Interoperating System 有什么区别？
- Architecture 和 Design 有什么区别？
- Life Cycle、Stage、Life Cycle Model 三者有什么区别？
- Process / Activity / Task / Outcome / Work Product 五层之间什么关系？
- Conformance 和 Compliance 有什么区别？
- Assurance Case 是什么？它与 Verification / Validation 有什么关系？
- PLE 的核心信条是什么？

只要这些问题能讲顺，第零阶段就已经过关了。

---

## 第一阶段：把 15288 看成一个分层系统

学习 15288 时，最容易犯的错误，是一上来就陷入 30 个过程、上百个 Activity 和 Task 里。这样会很快失去整体感。

更好的方法是先把它理解为一个**分层系统**——就像理解 BPMN 那样：

```text
┌──────────────────────────────────────────────────────────────────┐
│                       15288 整体框架                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  第一层：它要表达什么                                             │
│  ───────────────────────────────────────────────                 │
│  1. System of Interest 的完整生命周期                             │
│  2. 谁和谁建立合作关系                                            │
│  3. 组织如何提供长期使能能力                                       │
│  4. 项目如何受控运行                                              │
│  5. SoI 如何从需求走向运行再到退役                                 │
│  6. SoS 中 SoI 如何参与跨系统交互                                 │
│                                                                  │
│  第二层：它用什么来表达                                           │
│  ───────────────────────────────────────────────                 │
│  1. System Concepts     —— 系统结构、SoI/SoS/使能/互操作          │
│  2. Process Concepts    —— 过程/活动/任务/结果/工件               │
│  3. Life Cycle Concepts —— 生命周期/阶段/模型/迭代/递归/并发       │
│  4. Assurance Concepts  —— 质量/保证/保证案例/质量特征             │
│                                                                  │
│  第三层：它如何成为标准                                           │
│  ───────────────────────────────────────────────                 │
│  1. Process Reference Model  —— 可评估的过程参考模型               │
│  2. Conformance Claims      —— 完全符合 / 裁剪后符合              │
│  3. Tailoring Process       —— Annex A 规定的裁剪过程              │
│  4. Information Items       —— 15289 定义的工件内容                │
│  5. Process Assessment      —— ISO/IEC 33000 系列的能力评估        │
│                                                                  │
│  第四层：它如何落地                                               │
│  ───────────────────────────────────────────────                 │
│  1. Organization Adoption  —— 组织采用，建立过程环境               │
│  2. Project Application    —— 项目应用，选择和执行过程             │
│  3. Agreement Execution    —— 协议执行，供需双方约定过程           │
│  4. Process Assessment     —— 过程评估，改进组织能力               │
│  5. MBSE Implementation    —— 基于模型的落地方式                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

这张图的意义在于：

- 15288 不只是"过程清单"
- 它同时关心"系统如何被理解""过程如何被组织""符合性如何声明""落地如何执行"
- 只有先看清这个整体，后面学习具体过程才不会碎片化

---

### 1.1 第一层：15288 到底在表达什么

15288 试图同时回答六类问题：

1. **SoI 的完整生命周期**——从概念到退役，系统经历了什么
2. **谁和谁建立合作关系**——获取方和供应方如何通过协议建立关系
3. **组织如何提供长期使能能力**——组织如何建立可复用的制度、资源、基础设施
4. **项目如何受控运行**——项目如何计划、评估、控制、管理风险和配置
5. **SoI 如何从需求走向运行再到退役**——技术过程如何把需求转化为可运行的系统
6. **SoS 中 SoI 如何参与跨系统交互**——当 SoI 是 SoS 的组成系统时，有什么特殊考虑

其中第 6 点是 15288 比 12207 更突出的维度——因为系统之系统的场景在系统工程中比在软件工程中更常见。

### 1.2 第二层：15288 用什么来表达这些内容

在理解了"它要表达什么"之后，下一步要理解"它靠什么来表达"。

15288 的表达组件可以看成四类：

```text
15288 的表达组件分工

系统结构层
  ├─ System Concepts
  │    表达：系统是什么、由什么构成、与什么交互
  │
过程行为层
  ├─ Process Concepts
  │    表达：做什么、达到什么、怎么分解、怎么产出
  │
时间组织层
  ├─ Life Cycle Concepts
  │    表达：生命周期如何划分、过程如何迭代/递归/并发
  │
质量保证层
  └─ Assurance Concepts
       表达：质量特征如何定义、置信如何论证、保证如何构建
```

这里先不展开具体对象，只先理解四类组件的职责分工。

### 1.3 第三层：15288 为什么不只是"过程清单"

很多人第一次接触 15288 时，会把它理解成"系统工程的过程清单"。这种理解只对了一部分。

15288 实际上至少包含下面五个层面：

1. **Process Reference Model**——可评估的过程参考模型
   - 每个过程的 Purpose 和 Outcome 构成了可评估的目标集
   - 与 ISO/IEC 33000 系列兼容，支撑过程能力评估

2. **Conformance Claims**——符合性声明机制
   - Full Conformance to Outcomes：达成了所有结果
   - Full Conformance to Tasks：完成了所有规定动作
   - Tailored Conformance：裁剪后声明符合

3. **Tailoring Process**——Annex A 规定的正式裁剪过程
   - 裁剪不是"随便删"，而是一个有规定步骤的过程

4. **Information Items**——15289 定义的工件内容
   - 15288 不规定文档格式和内容，15289 来定义

5. **Process Assessment**——ISO/IEC 33000 系列的能力评估
   - Annex C 定义了评估用的过程参考模型
   - 支撑组织的过程改进

所以 15288 不仅定义了"有哪些过程"，还定义了"怎么声明符合""怎么裁剪""怎么评估""怎么记录"。

### 1.4 第四层：15288 最终想怎么落地

从标准结构上看，15288 支持四种落地模式：

1. **Organization Adoption**——组织采用
   - 组织建立期望的过程环境，配以方法、规程、技术、工具和培训人员
   - 评估组织环境是否符合标准条款

2. **Project Application**——项目应用
   - 项目在已建立的环境中，选择、组织和使用过程元素
   - 评估项目是否符合已声明的环境

3. **Agreement Execution**——协议执行
   - 获取方和供应方通过协议选择、谈判、约定和执行过程
   - 标准作为协议开发的指导

4. **Process Assessment**——过程评估
   - 作为过程参考模型，支撑过程评估和组织过程改进

5. **MBSE Implementation**——基于模型的落地
   - 使用一组模型来实现过程并达成预期结果
   - Annex D 提供了 MBSE 的信息和指导

---

## 第二阶段：四大过程组不是顺序阶段，而是不同治理层

一个常见的误解是把四大过程组当成"先做协议，再做组织，再做管理，最后做工程"的顺序。

更准确的理解是：

```text
┌─────────────────────────────────────────────────────────────────────┐
│                   四大过程组的治理层次                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  协议过程组            → 作用于"合作关系层"                          │
│  Agreement Processes        谁和谁约定、各自承担什么                 │
│  (2 个过程)                                                         │
│    - Acquisition                                                   │
│    - Supply                                                        │
│                                                                     │
│  组织级项目使能过程组  → 作用于"组织能力层"                          │
│  Organizational Processes    长期可复用的制度、资源、能力             │
│  (6 个过程)                                                         │
│    - Life Cycle Model Management                                   │
│    - Infrastructure Management                                     │
│    - Portfolio Management                                          │
│    - Human Resource Management                                     │
│    - Quality Management                                            │
│    - Knowledge Management                                          │
│                                                                     │
│  技术管理过程组        → 作用于"项目受控层"                          │
│  Technical Management        具体项目的计划、控制、风险、配置         │
│  (8 个过程)                                                         │
│    - Project Planning                                              │
│    - Project Assessment and Control                                │
│    - Decision Management                                           │
│    - Risk Management                                               │
│    - Configuration Management                                      │
│    - Information Management                                        │
│    - Measurement                                                   │
│    - Quality Assurance                                             │
│                                                                     │
│  技术过程组            → 作用于"工程执行层"                          │
│  Technical Processes         直接改变 SoI 状态的分析、设计、实现      │
│  (14 个过程)                                                        │
│    - Business or Mission Analysis                                  │
│    - Stakeholder Needs and Requirements Definition                 │
│    - System Requirements Definition                                │
│    - System Architecture Definition                                │
│    - Design Definition                                             │
│    - System Analysis                                               │
│    - Implementation                                                │
│    - Integration                                                   │
│    - Verification                                                  │
│    - Transition                                                    │
│    - Validation                                                    │
│    - Operation                                                     │
│    - Maintenance                                                   │
│    - Disposal                                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

判定规则：

- **如果问题是"谁和谁的关系、约定了什么"** → 协议过程组
- **如果问题是"组织有没有这个能力/机制/资产"** → 组织级项目使能过程组
- **如果问题是"这个项目是否受控/可追踪/有保障"** → 技术管理过程组
- **如果问题是"SoI 本身被怎么分析/设计/实现/验证"** → 技术过程组

### 2.1 为什么 Configuration Management 在技术管理组，不在组织级使能组？

- 组织级的 `Infrastructure Management` 提供的是**环境/平台/工具能力**（如 Git 服务器、制品仓库）
- 技术管理组的 `Configuration Management` 保证的是**项目对象的标识、控制、状态与完整性**
- 前者给基础设施，后者管项目受控状态——层次不同

### 2.2 为什么 Quality Management 在组织级使能组，Quality Assurance 在技术管理组？

- `Quality Management` 是组织级的**质量政策、机制与改进**
- `Quality Assurance` 是项目级的**独立保证活动与客观证据**
- 前者定方向，后者给证据——对象不同

### 2.3 为什么 Knowledge Management 在组织级使能组，Information Management 在技术管理组？

- `Knowledge Management` 面向组织的**长期知识资产积累、复用与演化**
- `Information Management` 面向项目的**信息控制、记录、访问与状态**
- 前者建资产，后者管项目信息——时间尺度不同

### 2.4 标准如何定义一个过程

理解 15288 的过程定义结构，是读懂标准原文的关键。每个过程在标准中都按以下模板定义：

```text
Process
├── Purpose          —— 这个过程为什么存在（一句话目的声明）
├── Outcomes         —— 这个过程应该达成哪些状态（3~7 条结果声明）
├── Activities       —— 过程内的工作块（每条 Activity 可包含多个 Task）
│   └── Tasks        —— 可检查的动作项
└── Outputs          —— 可选属性：产出物或信息项（Annex B 提供示例）
```

> 核心认知：**过程由 Purpose 和 Outcomes 驱动，Activities 和 Tasks 是实现手段，Outputs 是结果载体。**

这就是为什么 15288 允许按 Outcome 声明符合性——因为**目的是本质，动作是手段**。

---

## 第三阶段：技术过程主线——从问题空间到运行空间

15288 的 14 个技术过程，不是线性流水线，而是从三个空间逐步收敛：

```text
┌─────────────────────────────────────────────────────────────────────┐
│                   技术过程的三空间收敛                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  问题空间：理解"为什么要做"                                         │
│  ───────────────────────────────────────────────                    │
│    Business or Mission Analysis                                     │
│      → 识别组织的问题或机会，定义关键问题                            │
│    Stakeholder Needs and Requirements Definition                    │
│      → 利益相关方定义概念、需要和需求                                │
│    System Requirements Definition                                   │
│      → 将利益相关方需求转化为系统需求                                │
│                                                                     │
│  解决方案空间：构建"怎么做"                                         │
│  ───────────────────────────────────────────────                    │
│    System Architecture Definition                                   │
│      → 定义解决利益相关方关注点的架构                                │
│    Design Definition                                                │
│      → 提供足够完整的系统元素规约以支撑实现                          │
│    System Analysis (贯穿支撑)                                       │
│      → 为权衡和决策提供分析数据                                     │
│    Implementation                                                   │
│      → 实现系统元素                                                 │
│    Integration                                                      │
│      → 组合系统元素使其协同                                         │
│    Verification                                                     │
│      → 对照规定要求检查是否满足                                     │
│    Transition                                                       │
│      → 将 SoI 从开发转入运行环境                                    │
│    Validation                                                       │
│      → 对照预期用途确认是否有价值                                   │
│                                                                     │
│  运行空间：维持"持续运转"                                           │
│  ───────────────────────────────────────────────                    │
│    Operation                                                        │
│      → SoI 在运行环境中持续提供服务                                 │
│    Maintenance                                                      │
│      → 维持 SoI 的能力或恢复其服务                                  │
│    Disposal                                                         │
│      → SoI 退役、拆解、存档或处置                                   │
│                                                                     │
│  贯穿支撑：System Analysis + Decision Management                    │
│  ───────────────────────────────────────────────                    │
│    System Analysis 为每个迭代提供数据和信息                          │
│    Decision Management 管理技术过程间的权衡                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.1 问题空间：前三个过程的递进关系

**Business or Mission Analysis → Stakeholder Needs → System Requirements**

这三个过程构成了一条"概念→需要→需求"的转化链：

1. **Business or Mission Analysis**：从组织的运营概念、环境变化和战略输入出发
   - 识别和定义应被解决的关键问题或机会
   - 识别和表征候选的解决方案类

2. **Stakeholder Needs and Requirements Definition**：在已定义的问题/机会语境中
   - 利益相关方定义概念、需要和需求
   - 定义解决方案的运营语境
   - 运营概念回答"系统要做什么、为什么"

3. **System Requirements Definition**：工程团队接手
   - 将利益相关方需求转化为系统需求
   - 系统需求是技术性的、可验证的

> 这三个过程**迭代和递归**地应用——不是一次性完成的。

### 3.2 解决方案空间：从架构到确认

**Architecture → Design → Implementation → Integration → Verification → Transition → Validation**

这是 15288 最核心的工程路径：

1. **System Architecture Definition**：定义架构以解决利益相关方关注点
   - 与问题空间的三个过程迭代、并发应用
   - 关注适用性、可行性、可取性
   - **尽量设计无关**——保留设计灵活性

2. **Design Definition**：基于架构和经验证的需求
   - 提供足够完整的系统元素规约以支撑合规实现
   - 反馈到架构过程，确认或调整分配、分区和对齐
   - 关注与技术和其他设计元素的兼容性、构建与集成的可行性

3. **Implementation**：实现系统元素
   - 对软件/硬件系统元素，在递归更低的层次进行系统定义
   - 在递归更高的层次进行系统实现

4. **Integration**：组合系统元素使其协同
   - 逐步组装，渐进构建信心

5. **Verification**：对照规定要求检查
   - "The system was built right."

6. **Transition**：将 SoI 从开发转入运行环境
   - 不是"上线就完了"，而是有组织的转移过程

7. **Validation**：对照预期用途确认
   - "The right system was built."
   - 注意：Validation 在 Transition 之后——先转移再确认

### 3.3 运行空间：维持和退役

1. **Operation**：SoI 在运行环境中持续提供服务
2. **Maintenance**：维持 SoI 的能力或恢复其服务
3. **Disposal**：SoI 退役——部分或全部替换、升级、最终退役和处置

> 注意：Stage ≠ Process。阶段有 Utilization 和 Support，过程有 Operation 和 Maintenance——它们不是一一对应的。

### 3.4 贯穿支撑：System Analysis

System Analysis 是一个特殊的技术过程——它不改变 SoI 的状态，而是**为每个迭代提供数据和信息**：

- 为技术管理过程和技术过程提供分析支持
- 支撑权衡分析（Trade-off Analysis）
- 与 Decision Management 密切配合
- **在 Figure 5 中，System Analysis 横跨所有过程组**

---

## 第四阶段：15288 独有的系统层概念

### 4.1 SoS (System of Systems) 与 15288

SoS 是 15288 比 12207 更突出的概念维度。标准在多处强调 SoS 的特殊考虑：

**协议过程中的 SoS 考虑**

- 当 SoI 作为 SoS 的组成系统参与时，需要在协议中考虑资源和能力依赖
- 协议需要包含 SoS 交互和依赖的条款，或生成额外协议
- 如果有跨 SoS 的外部责任实体，可能需要管理和支持安排

**组织级过程中的 SoS 考虑**

- 组织级过程建立的资源和环境需要支持 SoI 在 SoS 中的能力提供
- 组成系统的组织独立实施这些过程，但可能受 SoS 的法规、接口标准或协议影响

**技术管理过程中的 SoS 考虑**

- 技术管理过程需要包含预期的 SoS 交互考虑
- 规划、评估和控制活动需要包含 SoS 相关的成本和进度考虑
- 需要监控跨系统依赖的进展

**技术过程中的 SoS 考虑**

- 技术过程需要考虑对交互系统及其利益相关方和基础设施的技术影响
- SoS 配置可能对 SoI 施加新的需求或约束
- SoS 技术考虑尤其影响前 5 个技术过程（业务分析到设计定义）

### 4.2 SoS 的分类法

ISO/IEC/IEEE 21841 定义了 SoS 的标准化分类法，提供了围绕规模、范围等特征的多维视角：

- **Directed SoS**：中心化管理，组成系统被明确指挥
- **Acknowledged SoS**：有中心管理，但组成系统保留独立目标
- **Collaborative SoS**：无中心管理，组成系统自愿协作
- **Virtual SoS**：无中心管理、无明确协议，靠共同目标松散聚合

### 4.3 产品线工程 (PLE) 与 15288

15288 在 5.2.5 中专门讨论了 PLE，这是 12207 没有的内容：

- 产品线作为**单一 SoI** 进行工程化
- 变体定义支撑各个系统实例
- 当特定实例被开发、确认和部署后，它自身成为 SoI
- 15288 的所有生命周期过程**既适用于产品线 SoI，也适用于每个实例 SoI**

```text
产品线 SoI
│
├── 特征目录 (Feature Catalogue)
│    └── 捕获产品线中系统实例的区分特征
│
├── 特征集 (Bill of Features)
│    └── 指定特定实例适用的特征
│
├── 共享资产超集 (Shared Asset Supersets)
│    └── 所有内容的单一副本，无重复
│
├── 变体点 (Variation Points)
│    └── 封装变化内容，按特征选择包含/排除/生成/转换
│
└── 系统实例 = 通用内容 + 自动派生的变体点
```

### 4.4 Assurance 与 Assurance Case

15288 在 5.10 中专门讨论了 Assurance，这是系统工程的特殊需求：

- **Assurance = 对主张已被/将被达成的合理置信**
- 利益相关方在依赖系统之前需要 Assurance
- 系统越复杂、越新颖、技术问题历史越长，需要越强的 Assurance

Assurance Case 的结构：

```text
Assurance Case
│
├── 主张 (Claim)
│    └── 系统具备某种能力/属性
│
├── 论证 (Argument)
│    └── 从证据到主张的推理结构
│    ├── 子主张 (Sub-claims)
│    └── 推理 (Reasoning)
│
└── 证据 (Evidence)
     ├── 测试通过/失败结果
     ├── 定量度量
     └── 定性评价
```

Assurance 活动应**集成到整个系统生命周期的过程中**——不是事后补的。

---

## 第五阶段：符合性与裁剪

### 5.1 两种完全符合

15288 提供两种完全符合的判定标准，**满足任一即可**：

1. **Full Conformance to Outcomes**
   - 声明一组过程，证明所有 Outcome 已达成
   - Activities 和 Tasks 是指导而非要求
   - 允许更大的实现自由度
   - 适用于创新型生命周期模型

2. **Full Conformance to Tasks**
   - 声明一组过程，证明所有 Activity 和 Task 的要求已达成
   - Outcomes 是指导而非要求
   - 适用于需要详细理解供应方过程的合同场景

> 两种标准**不等价**——完成所有 Task 可能需要比仅达成 Outcome 更高的能力水平。

### 5.2 裁剪后符合

当过程集不符合完全符合条件时：

- 按 Annex A 规定的 Tailoring Process 进行裁剪
- 声明裁剪后的过程集
- 证明裁剪后的 Outcome、Activity 和 Task 已达成

注意事项：

- 裁剪可能削弱符合性声明的感知价值
- 组织可能发现，对更少的过程声称完全符合，比对更多过程声称裁剪后符合更有利
- 也可以混合声明：对部分过程完全符合，对其他过程裁剪后符合

### 5.3 Tailoring Process (Annex A)

Annex A 规定了一个正式的裁剪过程，包含以下步骤：

1. 识别 SoI 的环境条件
2. 识别应被裁剪的过程
3. 识别应被裁剪的过程元素（Outcome/Activity/Task）
4. 记录裁剪决策及其理由
5. 评估裁剪的影响

### 5.4 Process Reference Model (Annex C)

Annex C 定义了用于过程评估的过程参考模型：

- 每个过程的 Purpose 和 Outcome 构成评估目标
- 与 ISO/IEC 33000 系列兼容
- 支撑组织的过程能力评估和改进

---

## 第六阶段：15288 与 12207 的关系

### 6.1 同源关系

15288 和 12207：

- **共享相同的过程模型**
- **共享大部分 Activity 和 Task**
- **主要差异在描述性注释**
- 构成一个连续谱：从几乎不用软件的系统到软件为主的系统

### 6.2 选择标准

- 当软件是主要的系统或系统元素时，使用 ISO/IEC/IEEE 12207
- 当系统是软硬件混合或以硬件为主时，使用 ISO/IEC/IEEE 15288
- 两者可以互补使用

### 6.3 15288 比 12207 多了什么

1. **System of Systems 概念**——5.4 整节是 15288 独有的
2. **Product Line Engineering**——5.2.5 是 15288 独有的
3. **System Architecture Definition**——12207 只叫 "Architecture Definition"
4. **Interoperating System 概念**——15288 独有
5. **更强的 Assurance 导向**——5.10 在 15288 中更为突出
6. **System Solution Context**——5.2.4 是 15288 独有的

### 6.4 兼容性

15288 声明与以下管理体系兼容：

- ISO 9001（质量管理体系）
- ISO/IEC 20000 系列（服务管理体系）
- ISO/IEC 19770 系列（IT 资产管理体系）
- ISO/IEC 27000 系列（信息安全管理体系）

---

## 小结：把 15288 压缩成一个适合记忆的框架

如果希望用最少的认知负担记住 15288 的整体结构，可以把它压缩成"四横一纵"。

### 四横

#### 第一横：系统怎么理解

- System / SoI / System Element / SoS / Enabling System / Interoperating System
- 它们回答的是：**15288 作用的对象是什么、由什么构成、与什么交互。**

#### 第二横：过程怎么组织

- 4 大过程组 / 30 个过程 / Activity / Task / Outcome / Work Product
- 它们回答的是：**15288 用哪些过程把系统生命周期覆盖完整。**

#### 第三横：生命周期怎么安排

- Life Cycle / Stage / Life Cycle Model / Iteration / Recursion / Concurrency
- 它们回答的是：**过程如何在不同时期以不同方式被应用。**

#### 第四横：符合性怎么声明

- Full Conformance / Tailored Conformance / Tailoring / Assessment / Assurance
- 它们回答的是：**15288 为什么不只是"过程清单"，而是一个可声明、可评估、可裁剪的标准。**

### 一纵

这一纵就是：

> 从"人类能理解的系统生命周期"，一直贯通到"组织可声明、项目可执行、评估可改进、保证可论证的系统过程框架"。

这是一条从理解到落地的连续路径，也是 15288 区别于普通过程清单的关键。

---

## 把 15288 看成"系统工程操作系统"

如果用一张更形象的图来理解：

```text
外部世界：业务目标 / 组织使命 / SoS 能力需求
                |
                v
        +-------------------+
        |   协议过程组       |
        | Acquisition/Supply| ← 建立合作关系
        +-------------------+
                |
                v
        +---------------------------+
        |  组织级项目使能过程组     |
        | LCM/Infra/Portfolio/     | ← 提供长期可复用能力
        | HR/QM/KM                |
        +---------------------------+
                |
                v
        +---------------------------+
        |  技术管理过程组           |
        | Planning/Control/Decision| ← 项目受控运行
        | Risk/Config/Info/        |
        | Measure/QA               |
        +---------------------------+
                |
                v
        +---------------------------+
        |  技术过程组               |
        | BMA→SHN→SRD→Arch→Design | ← 直接改变 SoI 状态
        | →Impl→Int→Ver→Trans→Val |
        | →Op→Maint→Disp          |
        | + System Analysis (贯穿) |
        +---------------------------+
                |
                v
        SoI 在运行环境中持续提供服务
```

**15288 的完整性，来自"协议 + 组织保障 + 技术管理 + 技术工程"的联合。**

技术过程是最显眼的一层，但它不是标准的全部——没有协议就没有合作关系，没有组织能力就没有环境支撑，没有技术管理就没有受控运行。

---

## 15288 的标准体系关系图

15288 不是孤立存在的，它处于一个标准体系中：

```text
ISO/IEC/IEEE 15288 (系统生命周期过程)
│
├── ISO/IEC/IEEE 12207 (软件生命周期过程)
│    └── 同源过程模型，共享大部分 Activity/Task
│
├── ISO/IEC/IEEE 15289 (信息项内容)
│    └── 定义生命周期过程信息项的内容
│
├── ISO/IEC/IEEE 24748-1/-2 (生命周期管理指南)
│    └── 过程应用指南、决策门、阶段详述
│
├── ISO/IEC/IEEE 24774 (过程描述规范)
│    └── 过程描述的属性规范
│
├── ISO/IEC/IEEE 29148 (需求工程)
│    └── 概念、需要和需求的详细开发指导
│
├── ISO/IEC/IEEE 420x0 系列 (架构标准)
│    ├── 42010 架构描述
│    ├── 42020 架构过程
│    └── 42030 架构评估
│
├── ISO/IEC/IEEE 15026 系列 ( Assurance )
│    └── 系统和软件 Assurance 与 Assurance Case
│
├── ISO/IEC/IEEE 21839/21840/21841 (SoS 系列)
│    └── SoS 考虑、应用指南、分类法
│
├── ISO/IEC 33000 系列 (过程评估)
│    └── 过程能力评估框架
│
└── ISO/IEC/IEEE 26550/26580 (产品线工程)
     └── PLE 方法和特征模型
```

---

## 过程应用的三种动态模式

15288 在 5.8.2 中专门讨论了过程的迭代、递归和并发——这三种动态模式是理解过程如何被应用的关键：

### 迭代 (Iteration)

- **同一系统层次**上重复应用同一过程或过程集
- 重要的渐进精化机制——例如验证和集成之间的迭代可以渐进构建产品符合性的信心
- 迭代不是"返工"，而是**预期行为**
- 新信息的产生通常会带来需求、风险或机会方面的问题，需要继续迭代直到问题解决

```text
System Architecture Definition ←──→ Design Definition
         ↑                              |
         |                              ↓
         └──────── System Analysis ──────┘
```

### 递归 (Recursion)

- **在系统结构的不同层次**上重复应用同一过程或过程集
- 15288 的关键应用模式：SoI → System Element → System Element 的 System Element → ...
- 从系统到系统元素的视角：过程的输出是其他过程或系统元素的输入
- 对软件/硬件系统元素：在递归更低的层次进行系统定义，在递归更高的层次进行系统实现

```text
SoI Level
│  └── 应用全部技术过程
│
System Element Level 1
│  └── 递归应用全部技术过程
│
System Element Level 2
│  └── 递归应用全部技术过程
│
...直到系统元素足够具体、可理解、可管理，可以被实现（制造、购买或复用）
```

### 并发 (Concurrency)

- 过程可以**同时使用**——不在时间上串行
- 项目内并发：设计和构建准备同时进行
- 项目间并发：不同项目责任下同时设计系统元素
- 所有过程都可以与其他过程并行
- 例如：Operation 和 Maintenance 过程需要为 System Requirements、Architecture、Design 和 Implementation 过程提供输入

> 核心认知：**15288 不规定过程的执行顺序。顺序由项目目标和生命周期模型的选择决定。**

---

## Process View——跨过程关注点的统一视角

15288 在 5.8.3 中引入了 Process View 概念：

- 有时需要对**横跨多个过程的关注点**进行统一聚焦
- Process View 像 Process 一样有 Purpose 和 Outcomes
- 但它**不包含独特的 Activity 和 Task**——而是通过引用其他过程的 Activity 和 Task 来达成
- 标准中提到的 Process View 例子：
  - Speciality Engineering（专业工程）
  - Interface Management（接口管理）
  - Security（安全）
  - System Assurance / Software Assurance

```text
┌───────────────────────────────────────────────┐
│              Process View: Security            │
│                                               │
│  Purpose: 统一关注系统安全问题                  │
│  Outcomes: 安全需求被识别、追踪、满足           │
│                                               │
│  实现方式：                                     │
│    → 引用 Stakeholder Needs 中的安全需求       │
│    → 引用 Architecture 中的安全架构决策        │
│    → 引用 Verification 中的安全验证            │
│    → 引用 Risk Management 中的安全风险评估     │
│    → ...                                      │
│                                               │
│  不定义新的 Activity/Task                      │
│  而是指引如何在现有过程中达成安全关注           │
└───────────────────────────────────────────────┘
```

---

## 过程间关系总图

标准中的 Figure 5 展示了过程间的一般关系：

```text
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Agreement Processes ──────────────────────┐                   │
│     Acquisition, Supply                    │                   │
│                                             │                   │
│   Organizational Project-Enabling           │ 双向关系           │
│     Processes ──────────────────────────────┤                   │
│     LCM, Infra, Portfolio,                 │                   │
│     HR, QM, KM                             │                   │
│                                             │                   │
│   Technical Management Processes ───────────┤ 持续应用于         │
│     Planning, Assessment & Control,        │ 所有过程和         │
│     Decision, Risk, Config,               │ 生命周期阶段       │
│     Info, Measure, QA                      │                   │
│                                             │                   │
│   Technical Processes ──────────────────────┘                   │
│     BMA → SHN → SRD → Arch → Design → Impl                     │
│     → Int → Ver → Trans → Val → Op → Maint → Disp             │
│     + System Analysis (横跨支撑)                                 │
│                                                                 │
│   注：箭头不表示时间顺序或调度关系                                │
│       项目可按任何顺序应用过程、在过程间迭代、并发实现             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 下一步应该怎么继续学习

在整体框架建立之后，后续最自然的学习顺序有两种。

### 路线 A：先学四大过程组的职责边界

- 协议过程组 vs 组织级过程组 vs 技术管理过程组 vs 技术过程组
- 每组"负责什么、不负责什么、怎么配合"

这种方式适合先把 15288 的"治理地图"看清楚。

### 路线 B：先学技术过程主线

- 从 Business/Mission Analysis 到 Disposal 的 14 个技术过程
- 理解"问题空间 → 解决方案空间 → 运行空间"的收敛逻辑

这种方式适合更快进入"系统工程到底怎么做事"。

如果从当前状态出发，更推荐先走**路线 A**，因为只有先分清不同治理层，后面学习技术过程时才知道这些过程在哪个治理语境下运行。

---

## 最终一句话总结

> `ISO/IEC/IEEE 15288` 是一个同时覆盖系统概念建模、生命周期过程组织、符合性声明与裁剪、过程能力评估与改进、以及 Assurance 论证的人造系统生命周期过程标准。

这句话中的每个部分都很重要：

- 它不仅定义过程，还建模系统概念
- 它不仅组织过程，还组织生命周期
- 它不仅是过程清单，还是可声明、可裁剪、可评估的标准
- 它不仅关注过程执行，还关注 Assurance 论证
- 它不限于软件，而是覆盖完整的人造系统

这就是学习 `ISO/IEC/IEEE 15288` 时最先要建立的整体框架。

---

## 参考资料

### 核心标准与应用指南

- [`ISO/IEC/IEEE 15288:2023` — `15288-2023.pdf`](./15288-2023.pdf)
- [`ISO/IEC/IEEE 24748-2:2024` — `24748-2-2024.pdf`](./24748-2-2024.pdf)

### 同源与配套过程标准

- [`ISO/IEC/IEEE 12207:2017` — `12207-2017.pdf`](./12207-2017.pdf)
- [`ISO/IEC/IEEE 12207:2026` — `12207-2026.pdf`](./12207-2026.pdf)
- [`ISO/IEC/IEEE 15289:2019` — `15289-2019.pdf`](./15289-2019.pdf)
- [`ISO/IEC/IEEE 24765:2017` — `24765-2017.pdf`](./24765-2017.pdf)

### 需求与架构相关标准

- [`ISO/IEC/IEEE 29148:2018` redline — `29148_2018-2011_redline.pdf`](./29148_2018-2011_redline.pdf)
- [`ISO/IEC/IEEE 42010:2022` redline — `42010_2022-2011_redline.pdf`](./42010_2022-2011_redline.pdf)
