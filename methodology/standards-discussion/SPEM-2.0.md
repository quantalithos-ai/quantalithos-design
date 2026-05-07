# SPEM 2.0 学习引导

> 当前目标不是穷举全部对象，也不是立即设计结构体。
>
> 当前只做一件事：**先看懂 SPEM 2.0 的整体架构**。
>
> 你可以先把 SPEM 理解成：**一套用来描述“软件开发方法 + 流程 + 插件化复用”的元模型语言**。

---

## 一、先用一句话理解 SPEM 2.0

SPEM 2.0 不是某一种具体开发流程，而是一套**描述开发方法与开发流程的建模语言**。

它试图同时回答三类问题：

- 方法知识是什么？
- 这些方法在流程中什么时候被使用？
- 这些方法和流程如何被复用、裁剪、扩展？

---

## 二、第一张整体架构图

```text
SPEM 2.0
|
+-- Core
|   `-- 最基础的抽象能力
|       - 可扩展元素
|       - 类型限定(kind)
|       - 工作定义
|       - 输入/输出参数
|       - 执行者关系
|
+-- Managed Content
|   `-- 描述性内容能力
|       - 文本描述
|       - 指导材料
|       - 分类
|       - 度量
|       - 分节
|
+-- Method Content
|   `-- 与生命周期无关的“方法知识”
|       - RoleDefinition
|       - TaskDefinition
|       - WorkProductDefinition
|       - ToolDefinition
|
+-- Process Structure
|   `-- 流程骨架 / 分解结构
|       - Activity
|       - BreakdownElement
|       - Milestone
|       - WorkSequence
|       - RoleUse / WorkProductUse
|
+-- Process Behavior
|   `-- 把流程骨架连接到外部行为模型
|       - 外部 Activity 引用
|       - 外部 State 引用
|       - 外部 Transition 引用
|
+-- Process with Methods
|   `-- 把“方法知识”放进“流程上下文”
|       - MethodContentUse
|       - TaskUse
|       - RoleUse
|       - WorkProductUse
|       - TeamProfile
|
`-- Method Plugin
    `-- 复用、裁剪、扩展、配置
        - MethodPlugin
        - MethodConfiguration
        - Variability
        - ProcessComponent
        - WorkProductPort
```

---

## 三、不要一开始陷入对象细节，先记住这 4 层意思

### 1. 基础层：SPEM 先定义“建模语言本身”

这部分主要由 `Core` 提供。

它解决的是：

- 什么叫一个可建模的对象？
- 什么叫一种工作？
- 工作可以有哪些输入输出？
- 工作由谁执行？
- 一个对象如何被标记成某种 kind？

你可以先把这一层理解成：

**SPEM 的语法基础设施层。**

---

### 2. 内容层：SPEM 把“方法知识”抽出来单独建模

这部分主要由 `Managed Content` 和 `Method Content` 组成。

它解决的是：

- 一个角色是什么？
- 一个任务是什么？
- 一个工作产品是什么？
- 它们的文字说明怎么组织？
- 它们如何被分类、加指导材料、加模板、加度量？

关键思想是：

**先定义“方法本身”，不要急着讨论它出现在流程的哪个时刻。**

也就是说：

- `TaskDefinition` 先回答“这类工作本质上怎么做”
- 而不是先回答“它在第几周做”

---

### 3. 过程层：SPEM 再定义“流程骨架”

这部分主要由 `Process Structure` 提供。

它解决的是：

- 一个流程由哪些 `Activity` 组成？
- 它们怎样分解成层级结构？
- 哪些先做，哪些后做？
- 哪些是里程碑？
- 某个活动需要哪些角色和工作产品？

关键思想是：

**流程先是结构。**

也就是说，SPEM 先关心：

- 流程由哪些块组成
- 这些块怎么嵌套
- 块和块之间有什么依赖

这时候还没有真正把“方法定义”严丝合缝地塞进去。

---

### 4. 结合层：SPEM 用 Use 机制把方法放进流程

这部分是 `Process with Methods` 的核心。

它解决的是：

- 一个 `TaskDefinition` 在某个具体 `Activity` 中怎么被使用？
- 同一个 `RoleDefinition` 在不同活动里是不是可以有不同责任？
- 同一个 `WorkProductDefinition` 在不同阶段是不是可以有不同上下文？

这里最重要的思想只有一句：

**Definition 是定义，Use 是上下文中的使用。**

也就是：

```text
RoleDefinition        -> RoleUse
TaskDefinition        -> TaskUse
WorkProductDefinition -> WorkProductUse
```

这是学习 SPEM 时最关键的分界线之一。

---

## 四、第二张图：SPEM 最核心的结构关系

```text
                +----------------------+
                |    Method Content    |
                |  可复用的方法定义层   |
                +----------------------+
                | RoleDefinition       |
                | TaskDefinition       |
                | WorkProductDefinition|
                +----------+-----------+
                           |
                           | 被流程引用 / 代理
                           v
                +----------------------+
                | Process with Methods |
                |   流程中的使用层      |
                +----------------------+
                | RoleUse              |
                | TaskUse              |
                | WorkProductUse       |
                +----------+-----------+
                           |
                           | 放入
                           v
                +----------------------+
                |  Process Structure   |
                |   流程骨架 / 活动层   |
                +----------------------+
                | Activity             |
                | BreakdownElement     |
                | WorkSequence         |
                | Milestone            |
                +----------+-----------+
                           |
                           | 被插件化扩展 / 配置
                           v
                +----------------------+
                |    Method Plugin     |
                |  复用 / 裁剪 / 配置层 |
                +----------------------+
                | MethodPlugin         |
                | MethodConfiguration  |
                | Variability          |
                | ProcessComponent     |
                +----------------------+
```

---

## 五、第三张图：如果把 SPEM 当成“软件架构”，它像这样

```text
[Core]
   ↓ 提供基础抽象
[Managed Content + Method Content]
   ↓ 定义可复用的方法知识
[Process Structure]
   ↓ 定义流程骨架
[Process with Methods]
   ↓ 把方法知识映射进流程
[Method Plugin]
   ↓ 对整个方法库做扩展、变体、配置和组件化复用
[Method Library / Configuration]
```

所以你可以先把它理解成：

- `Core` 是语言底座
- `Method Content` 是知识库
- `Process Structure` 是流程骨架
- `Process with Methods` 是桥接层
- `Method Plugin` 是大规模复用与裁剪机制

---

## 六、用一个例子把这些概念串起来

下面用一个很小的场景，把 `Method Content`、`Process Structure`、`Process with Methods`、`Method Plugin` 串起来。

场景是：

**给一个在线书店增加“用户登录”功能。**

在日常开发里，我们通常会直接说：

- 产品提需求
- 开发设计接口
- 开发写代码
- 测试验证
- 发布上线

但在 SPEM 里，这几句话其实混在一起表达了三层东西：

- 方法知识
- 流程顺序
- 项目上下文

SPEM 的价值就是把这三层拆开。

### 1. 先定义可复用的方法知识

这一层是 `Method Content`。

先不关心它发生在流程的第几步，只先定义“这类工作一般是什么”。

例如：

- `RoleDefinition`
  - `Product Owner`
  - `Backend Developer`
  - `Tester`
- `TaskDefinition`
  - `Clarify Requirement`
  - `Design Login API`
  - `Implement Login Service`
  - `Verify Login Flow`
- `WorkProductDefinition`
  - `Requirement Note`
  - `API Specification`
  - `Source Code`
  - `Test Report`

这里的意思是：

- `TaskDefinition` 不是“这次流程里的某一步任务”
- 它只是“这类任务的通用定义”

比如 `Design Login API` 描述的是：

- 目标是什么
- 通常怎么做
- 有哪些步骤
- 需要什么输入
- 产出什么输出
- 一般由谁执行

### 2. 再定义流程骨架

这一层是 `Process Structure`。

现在我们才开始描述这个项目的流程：

- `Requirement Analysis`
- `Design`
- `Implementation`
- `Testing`
- `Release`

这些是 `Activity`。

这里表达的是：

- 有哪些活动
- 哪些先做，哪些后做
- 活动之间如何衔接

可以先粗略理解为：

```text
Requirement Analysis
        |
        v
      Design
        |
        v
 Implementation
        |
        v
     Testing
        |
        v
     Release
```

这时候流程骨架已经有了，但“方法定义”还没有真正放进来。

### 3. 再把方法定义放进流程上下文

这一层是 `Process with Methods`。

这里最关键的一刀是：

```text
TaskDefinition  !=  TaskUse
RoleDefinition  !=  RoleUse
WorkProductDefinition != WorkProductUse
```

也就是说：

- `Definition` 是通用定义
- `Use` 是在具体流程上下文中的一次使用

#### 先看任务

我们有一个通用定义：

- `TaskDefinition: Design Login API`

当它被放进 `Design` 这个活动中时，就变成：

- `TaskUse: Design Login API @ Design`

它不再只是抽象任务定义，而是“这个任务在当前活动中的一次具体使用”。

之所以需要 `TaskUse`，是因为同一个 `TaskDefinition` 可能在不同上下文里有不同使用方式。

例如：

- 第一次使用：在 `Design` 活动里，完整执行接口设计
- 第二次使用：在 `Bug Fix` 活动里，只修订错误码和字段约束

也就是：

```text
TaskDefinition: Design Login API
        |
        +-- TaskUse A: in Design
        |
        `-- TaskUse B: in Bug Fix
```

#### 再看角色

我们有一个角色定义：

- `RoleDefinition: Backend Developer`

当它出现在流程中时，会变成不同的 `RoleUse`：

- `RoleUse: Backend Developer @ Design`
- `RoleUse: Backend Developer @ Implementation`

虽然名字相同，但它们在不同活动中的职责不同：

- 在 `Design` 里偏向接口和方案设计
- 在 `Implementation` 里偏向编码实现

#### 再看工作产品

我们有一个工作产品定义：

- `WorkProductDefinition: API Specification`

当它出现在流程中时，也会变成多个 `WorkProductUse`：

- `WorkProductUse: API Specification @ Design (output)`
- `WorkProductUse: API Specification @ Implementation (input)`
- `WorkProductUse: API Specification @ Testing (input)`

这说明：

- 同一个工作产品定义
- 在不同活动里会以不同身份出现

### 4. 把它们放在一起看

串起来以后，关系大致是这样：

```text
Method Content
  - RoleDefinition: Backend Developer
  - TaskDefinition: Design Login API
  - WorkProductDefinition: API Specification

Process Structure
  - Activity: Design
  - Activity: Implementation

Process with Methods
  - TaskUse: Design Login API @ Design
  - RoleUse: Backend Developer @ Design
  - WorkProductUse: API Specification @ Design (output)

  - RoleUse: Backend Developer @ Implementation
  - WorkProductUse: API Specification @ Implementation (input)
```

如果只看 `Design` 这个活动，可以再简化成：

```text
Activity: Design
   |
   +-- TaskUse: Design Login API
   |      |
   |      +-- performed by -> RoleUse: Backend Developer
   |      |
   |      +-- output -> WorkProductUse: API Specification
   |
   `-- input -> WorkProductUse: Requirement Note
```

你可以先这样理解：

- `Activity` 是流程里的上下文容器
- `TaskUse` 是任务定义在这个容器中的一次使用
- `RoleUse` 是角色定义在这个容器中的一次使用
- `WorkProductUse` 是工作产品定义在这个容器中的一次使用

### 5. 最后再看为什么需要 Method Plugin

假设我们已经有一个基础流程：

```text
Requirement Analysis
 -> Design
 -> Implementation
 -> Testing
 -> Release
```

后来项目变成金融客户项目，需要额外增加：

- 安全设计评审
- 登录审计日志
- 风险检查清单

如果没有插件机制，就只能直接改原流程。

而 SPEM 的做法是：

- 原流程放在一个基础 `MethodPlugin` 里
- 金融合规增强放在另一个 `MethodPlugin` 里
- 用 `Variability` 去扩展或替换原有内容

例如：

- 基础插件：`Base Web App Plugin`
- 增强插件：`Finance Compliance Plugin`

增强插件可以：

- 新增 `TaskDefinition: Security Review`
- 新增 `Guidance: Login Security Checklist`
- 扩展 `Design` 活动
- 扩展 `Implement Login Service` 的要求
- 增加审计日志相关工作产品

最终效果是：

```text
Base Plugin
   +
Finance Compliance Plugin
   =
Finance Project Configuration
```

这时你就能看到 `Method Plugin` 和 `MethodConfiguration` 的意义：

- 基础方法保留
- 特定能力独立扩展
- 通过配置组合出不同项目版本

### 6. 把整个例子压缩成一条主线

对于“在线书店登录功能”这个例子：

- 我们先在 `Method Content` 里定义角色、任务、工作产品
- 再在 `Process Structure` 里定义流程活动
- 然后通过 `TaskUse`、`RoleUse`、`WorkProductUse` 把定义放进具体活动上下文
- 最后通过 `Method Plugin` 和 `Variability` 给特定项目增加额外能力

如果只记一条最核心链路，可以记成：

```text
TaskDefinition
   -> TaskUse
   -> Activity
   -> Process
   -> MethodPlugin / Configuration
```

---

## 七、为什么 SPEM 要这样分层

这是理解 SPEM 的关键。

如果不分层，会出现几个问题：

- 任务定义一旦写进流程，就无法复用
- 同一个任务在不同流程里很难表达“同名但不同上下文”
- 很难支持小团队版 / 大团队版 / 敏捷版 / 合规版的流程变体
- 很难把“方法知识库”和“项目流程”分开维护

所以 SPEM 的设计意图就是：

```text
先定义通用方法
再定义流程骨架
最后把方法放进流程
并允许插件化扩展和裁剪
```

---

## 八、你现在只需要先抓住的 5 个关键词

### 1. Definition

表示可复用定义，不带具体流程时点。

### 2. Use

表示某个定义在具体流程上下文中的一次使用。

### 3. Activity

表示流程中的工作单元，也是流程骨架的核心。

### 4. Variability

表示扩展、替换、贡献等变体能力。

### 5. Method Plugin

表示方法内容和流程内容的大颗粒组织、扩展与配置机制。

---

## 九、此时不要急着问“每个对象怎么设计”

在这一阶段，更重要的问题是：

- SPEM 为什么要分成这些包？
- 为什么要把 Definition 和 Use 分开？
- 为什么流程骨架和方法内容不是一回事？
- 为什么还要单独做 Plugin / Variability？

只要这几个问题想清楚，后面再看对象细节就不会乱。

---

## 十、建议的学习顺序

当前建议按这个顺序学习：

1. 先理解 `Core`
2. 再理解 `Method Content`
3. 再理解 `Process Structure`
4. 再理解 `Process with Methods`
5. 最后理解 `Method Plugin`

也就是：

```text
基础抽象
  -> 方法定义
  -> 流程骨架
  -> 方法与流程结合
  -> 插件化扩展
```

---

## 十一、第二阶段：核心对象主干（已完成）

第二阶段的目标，不是继续记更多名词，而是抓住 SPEM 最核心的对象主干，理解它们为什么要这样分层。

这一阶段我们重点理解了 6 个对象：

- `WorkDefinition`
- `TaskDefinition`
- `TaskUse`
- `Activity`
- `MethodContentUse`
- `MethodPlugin`

如果把这一阶段压缩成一条主线，可以先记成：

```text
WorkDefinition
   -> TaskDefinition
   -> TaskUse
   -> Activity
   -> Process
   -> MethodPlugin
```

这条链的意思不是“继承链”，而是理解链：

- 先有“工作”的抽象
- 再有“任务定义”的通用方法知识
- 再有“任务在流程中的一次使用”
- 再有提供流程上下文的 `Activity`
- 多个 `Activity` 组成 `Process`
- 最后由 `MethodPlugin` 组织成可复用的方法模块体系

### 1. `TaskDefinition` 是方法知识，不是流程步骤

`TaskDefinition` 属于 `Method Content`。

它回答的是：

- 这类任务是什么
- 目标是什么
- 通常怎么做
- 一般有哪些输入输出
- 一般由什么角色执行

例如在“在线书店登录功能”例子里：

- `TaskDefinition: Design Login API`

它表达的是“登录接口设计这类工作本身怎么做”，而不是“它一定出现在某个固定流程节点里”。

所以可以先把 `TaskDefinition` 理解成：

**任务知识模板。**

### 2. `TaskUse` 是上下文化使用，不是运行时实例

`TaskUse` 属于 `Process with Methods`。

它回答的是：

- 某个 `TaskDefinition` 在当前流程里是否被使用
- 它在这个活动里是完整使用还是裁剪使用
- 它在当前上下文里与哪些角色、工件、活动发生关系

最重要的是：

**`TaskUse` 不是运行时任务实例，而是流程模型中的一次上下文化使用。**

例如：

```text
TaskDefinition: Design Login API
        |
        +-- TaskUse: in Design
        |
        `-- TaskUse: in Bug Fix
```

这说明：

- 定义只保留一份
- 但使用可以出现多次
- 差异发生在 use 层，而不是 definition 层

### 3. 为什么 `TaskDefinition` 和 `TaskUse` 必须分开

这是第二阶段最关键的结论。

如果不分开，会立刻出现几个问题：

- 同一个任务很难在不同活动中重复使用
- 不同流程上下文的差异没地方表达
- 方法知识会被具体项目流程污染
- 插件和变体难以只改“使用方式”而不改“定义本体”

所以 SPEM 坚持：

```text
TaskDefinition = 这类任务本身是什么
TaskUse        = 这类任务在这里怎么被使用
```

这也是 `Definition` 与 `Use` 分离在任务层面的直接体现。

### 4. `Activity` 是流程骨架的核心

`Activity` 属于 `Process Structure`。

它不是任务定义，而是流程中的上下文容器和结构节点。

它回答的是：

- 流程由哪些活动组成
- 这些活动如何分层和分解
- 哪些先做，哪些后做
- 某个活动里放了哪些任务使用、角色使用、工作产品使用

所以可以记成：

```text
TaskDefinition = 知识
TaskUse        = 连接
Activity       = 位置 / 上下文容器
```

例如在登录功能里：

- `Activity: Design`
- `TaskUse: Design Login API @ Design`

`Design` 提供的是流程位置，`TaskUse` 提供的是“这个任务在这里被使用一次”的桥接关系。

### 5. `MethodContentUse` 是更上层的统一思想

`TaskUse` 不是孤立对象。

SPEM 的真正思路是：

- `RoleDefinition -> RoleUse`
- `TaskDefinition -> TaskUse`
- `WorkProductDefinition -> WorkProductUse`

也就是说，不只是任务，所有方法内容进入流程时，都要经过 use 层。

所以 `MethodContentUse` 代表的是一种更通用的桥接思想：

**方法定义层和流程上下文层必须通过 use 机制连接。**

理解这一层之后，就不会只把 `TaskUse` 看成某个零散类，而会看见 SPEM 背后的统一设计原则。

### 6. `MethodPlugin` 是高层组织单元

当前面几个对象已经清楚之后，`MethodPlugin` 的位置才会真正变得合理。

它解决的不是“单个任务怎么做”，而是：

- 一整组方法内容怎么打包
- 一整组流程怎么复用
- 基础版本和增强版本怎么组合
- 变体、扩展、替换如何组织

例如：

```text
Base Web App Plugin
   +
Finance Compliance Plugin
   =
Finance Project Configuration
```

所以 `MethodPlugin` 可以先理解成：

**方法资产的高层模块包。**

### 7. 第二阶段真正建立的边界感

第二阶段真正重要的，不是多记了几个类名，而是建立了下面这些边界：

- 方法定义，不等于流程节点
- 流程节点，不等于任务知识
- `Use`，不等于运行时实例
- `Plugin`，不等于单个对象，而是高层组织单元

只要这些边界建立起来，后面再看细对象、再抽结构体，就不会轻易混淆。

---

## 十二、第三阶段：关键对象职责与关系（已完成）

第三阶段不再停留在“主干对象有哪些”这个层面，而是进一步进入：

**关键对象内部各自承担什么职责，以及这些对象之间到底如何协同。**

这一阶段的目标不是靠近代码建模，而是先把 SPEM 标准本身的对象边界、关系边界和层次边界看清。

这一阶段我们重点理解了下面这些对象：

- `WorkDefinition`
- `TaskDefinition`
- `RoleDefinition`
- `WorkProductDefinition`
- `Activity`
- `TaskUse`
- `RoleUse`
- `WorkProductUse`
- `WorkSequence`
- `MethodPlugin`
- `VariabilityElement`
- `MethodConfiguration`

如果把第三阶段压缩成一句话，可以先理解成：

```text
方法内容对象先定义“工作、角色、成果”
    -> 这些定义通过 use 进入 Activity 上下文
    -> Activity 和 WorkSequence 组成流程结构与依赖
    -> 最后由 Plugin / Variability / Configuration 组织成可复用的方法体系
```

### 1. `WorkDefinition` 是“工作”概念的抽象起点

`WorkDefinition` 是一个抽象类，它统一表达所有“工作类对象”的共性语义。

它至少提供了三类核心能力：

- 前置条件 `precondition`
- 后置条件 `postcondition`
- 输入输出参数 `ownedParameter`

它的意义在于：

- SPEM 先抽象“什么叫一种工作”
- 再分别在方法层和流程层把这个抽象具体化

因此：

- `TaskDefinition` 是方法层的工作定义
- `Activity` 是流程层的工作定义

### 2. `TaskDefinition` 是完整的方法任务说明书

`TaskDefinition` 不是流程里的一步，而是方法内容层里一个可分配的工作单元。

它承担的职责至少包括：

- 定义任务目标
- 定义完整方法步骤
- 关联默认参与角色
- 关联输入输出工作产品类型
- 补充推荐工具
- 声明所需资格能力

其中最关键的一点是：

**`TaskDefinition` 描述的是“这类任务完整怎么做”，而不是“这次流程里做哪一部分”。**

### 3. `RoleDefinition` 定义的是能力与职责，不是具体个人

`RoleDefinition` 不是项目成员本身，而是方法内容层里一个角色能力画像。

它定义的是：

- 技能 `skills`
- 能力 `competencies`
- 职责 `responsibilities`

它和 `TaskDefinition` 的关系有两层：

- 通过 performer 关系表达“这类任务通常由哪些角色参与”
- 通过 `Qualification` 表达“任务所需能力”和“角色所供能力”的匹配

因此，`RoleDefinition` 真正回答的是：

**什么类型的能力主体适合承担这类任务。**

### 4. `WorkProductDefinition` 定义的是成果类型，不是具体文件实例

`WorkProductDefinition` 表示一类会被任务使用、修改、产出的工作成果。

它不是项目里某一个具体文件，而是成果物类型，例如：

- `Requirement Note`
- `API Specification`
- `Source Code`
- `Test Report`

它的核心作用包括：

- 让任务围绕清晰的成果类型展开
- 通过输入输出关系把任务串成工件流
- 让角色责任可以落到成果物上
- 通过 `WorkProductDefinitionRelationship` 表达成果物之间的组合、聚合、依赖关系

所以在方法内容层里，三角关系可以先记成：

```text
TaskDefinition       -> 做什么、怎么做
RoleDefinition       -> 谁具备能力、谁承担职责
WorkProductDefinition -> 围绕什么成果展开工作
```

### 5. `Activity` 是流程中的工作容器与结构节点

`Activity` 不是简单阶段标签，而是流程结构中的工作节点。

它同时具备三层身份：

- `WorkBreakdownElement`：流程分解结构节点
- `WorkDefinition`：流程层的工作定义
- `VariabilityElement`：可参与复用和变体

它的核心职责包括：

- 形成流程骨架
- 承载局部上下文
- 组织嵌套 breakdown 结构
- 作为 use 对象出现的边界范围

因此，`Activity` 不只是“装任务的盒子”，而是流程里的局部工作世界。

### 6. `TaskUse` / `RoleUse` / `WorkProductUse` 是进入流程后的上下文代理

这三个对象都属于 use 层。

它们分别表示：

- `TaskUse`：`TaskDefinition` 在某个 `Activity` 中的一次使用
- `RoleUse`：`RoleDefinition` 在某个 `Activity` 中的一次使用
- `WorkProductUse`：`WorkProductDefinition` 在某个 `Activity` 中的一次使用

它们有几个共同特点：

- 都是 activity-specific 的局部对象
- 都可以在不同活动中多次出现
- 每次出现都可以带不同关系和局部约束
- 都不能简单等同于方法定义本体

其中最关键的一层统一思想是：

**Definition 提供完整定义，Use 提供流程上下文化使用。**

### 7. `TaskUse` 体现任务方法的局部取用

`TaskUse` 不只是任务定义的引用，它还允许在具体活动里只选择一部分 step。

也就是说：

- `TaskDefinition` 保存完整方法
- `TaskUse` 决定当前活动中真正执行哪些部分

这也是 `TaskDefinition` 与 `TaskUse` 必须分开的重要原因。

### 8. `RoleUse` 与 `WorkProductUse` 都是活动局部对象

`RoleUse` 表示某个角色在当前活动中的一次出现。

- 同一个 `RoleDefinition` 可以在多个活动中对应多个 `RoleUse`
- 每个 `RoleUse` 可以只取其资格能力的一个子集

`WorkProductUse` 表示某个工作产品类型在当前活动中的一次出现。

- 同一个 `WorkProductDefinition` 可以在不同活动中有不同 use
- 在一个活动中它可能是输入，在另一个活动中可能是输出或参与物

这意味着：

- 定义层对象是通用的
- use 层对象是局部的、上下文化的

### 9. `ProcessPerformer` 与 `ProcessParameter` 把 use 对象接到活动上

在流程层里，关系并不是随意挂接，而是有专门机制：

- `ProcessPerformer`：把 `RoleUse` 和 `Activity` 关联起来，表达主责、辅助、咨询等参与方式
- `ProcessParameter`：把 `WorkProductUse` 和 `Activity` 关联起来，表达输入输出关系

所以流程层延续了方法层的严谨关系表达，只是对象已经切换成了 use 形态。

### 10. `WorkSequence` 不是普通箭头，而是依赖关系对象

`WorkSequence` 的作用不是装饰流程图，而是显式表达两个 `WorkBreakdownElement` 之间的依赖关系。

它通过 `predecessor`、`successor` 和 `linkKind` 定义：

- 哪个元素是前驱
- 哪个元素是后继
- 依赖发生在开始还是结束时刻

其中常见的 `WorkSequenceKind` 包括：

- `finishToStart`
- `finishToFinish`
- `startToStart`

它表达的是：

**工作依赖关系，而不是工件流关系。**

因此：

- 工件流回答“产物怎样传递”
- `WorkSequence` 回答“工作之间怎样约束开始和结束”

### 11. `MethodPlugin` 解决的是方法资产的模块化组织问题

`MethodPlugin` 不是单个对象，而是一包方法内容和流程资产的物理容器。

它负责：

- 模块化打包方法内容
- 模块化打包流程内容
- 支持插件之间的扩展关系
- 为分层组织方法体系提供边界

所以可以把它先理解成：

**方法资产的模块包。**

### 12. `VariabilityElement` 提供“不改原件的定制机制”

`VariabilityElement` 是 SPEM 非常值钱的一层设计。

它允许：

- 不直接修改原对象
- 而是通过单独的差异对象描述增强、继承、替换等变化

当前至少可以抓住两种最关键的变体语义：

- `contributes`：增量贡献、叠加增强
- `extends`：基于原对象派生一个自己的版本

所以：

- `MethodPlugin` 提供模块边界
- `VariabilityElement` 提供模块间演化机制

### 13. `MethodConfiguration` 决定最终采用哪一套方法组合

当有了多个插件之后，还需要一个对象来决定：

- 最终选哪些插件
- 只启用哪些内容包
- 只启用哪些过程包
- 需要排除哪些分类内容

这个对象就是 `MethodConfiguration`。

它更像：

**面向具体场景的一份方法选配结果。**

可以先理解为：

- `MethodPlugin` 是零件包
- `MethodConfiguration` 是最终装配清单

### 14. 第三阶段真正建立的边界感

第三阶段真正重要的，不是多看了一批对象，而是进一步建立了下面这些边界：

- `WorkDefinition` 是“工作”的抽象，不等于具体任务或具体活动
- `TaskDefinition` / `RoleDefinition` / `WorkProductDefinition` 都属于方法定义层
- `TaskUse` / `RoleUse` / `WorkProductUse` 都属于流程上下文化层
- `Activity` 是流程局部上下文，不只是阶段标签
- `WorkSequence` 表达工作依赖，不等于工件流
- `MethodPlugin` / `VariabilityElement` / `MethodConfiguration` 属于方法体系组织层

到这里，SPEM 已经不再只是“很多类名”，而是一套层次明确的对象网络。

---

## 十三、下一步我们应该学什么

在当前阶段之后，下一步最合理的方式不是立刻进入代码建模，而是做两类延伸理解：

- 继续深挖 SPEM 中更外层或更高级的机制
- 开始和其他过程/方法标准做横向对照

如果继续沿 SPEM 深挖，比较自然的主题有：

- `ProcessComponent`
- `Capability Pattern`
- `MethodConfiguration` 的裁剪与装配逻辑
- `Definition / Use / Variability` 三层如何整体协同

如果开始和其他标准对照，比较自然的方向是：

- SPEM 与 BPMN / UML Activity 的区别
- SPEM 与 RUP / OpenUP 的关系
- SPEM 与你后面要学习的其他标准在“定义层 / 使用层 / 组织层”上的异同

当前最推荐的下一步不是写结构体，而是：

**先把 SPEM 与其他标准放在同一张认知坐标系里比较。**

---

## 十四、第四阶段：`Pattern / Process / Component / Variability` 总关系图（已完成）

在继续靠近代码建模之前，第四阶段先把 SPEM 中几类更高层的过程资产关系收束成一张图。

这一阶段的重点不是再增加一批新类名，而是建立下面这组稳定边界：

- `Capability Pattern` 负责沉淀一段可复用的局部做法
- `Delivery Process` 负责组织一个项目级的完整交付路线
- `ProcessComponent` 负责把过程能力封装成可装配的黑盒模块
- `Variability` 负责管理这些资产如何派生、增强、替换

### 1. 先给出一张总关系图

```text
方法内容层（Method Content）
TaskDefinition / RoleDefinition / WorkProductDefinition / Guidance
            ↓ 被引用、被编排
局部过程模式层（Pattern）
Capability Pattern
= 一段可复用的局部做法 / 协作结构
            ↓ 被绑定到更大过程上下文
项目过程层（Process）
Delivery Process / Phase / Iteration / Activity
= 一个项目完整交付路线图

---------------------------------------------
横向封装维度（Component）
ProcessComponent
= 把一组过程能力封装为可装配的黑盒模块
  通过 `WorkProductPort` 等契约与外界连接
---------------------------------------------

贯穿全局的演化维度（Variability）
extends / contributes / replaces
= 让已有过程资产在不同场景下派生、增强、替换
```

这张图里最关键的一点是：

- `Pattern` 和 `Process` 属于过程表达
- `Component` 属于封装表达
- `Variability` 属于演化表达

它们不是同一维度的四个并列对象，而是四种不同的观察角度。

### 2. `Capability Pattern` 是局部能力模板

`Capability Pattern` 不是完整项目流程，而是一段局部、可复用的能力做法。

它通常描述：

- 某类工作由哪些任务构成
- 这些任务涉及哪些角色与工作产品
- 这些任务之间有什么依赖关系
- 这套做法如何在不同项目中被复用

所以它回答的问题是：

**遇到这类工作时，通常应该按什么结构来做？**

它更像一段过程模板，例如：

- 需求澄清模式
- 代码评审模式
- 安全认证实现模式
- 缺陷修复闭环模式

因此，`Capability Pattern` 的核心特征是：局部、可复用、可嵌入、但不承担完整生命周期。

### 3. `Delivery Process` 是项目级交付路线图

`Delivery Process` 与 `Capability Pattern` 的区别在于，它关心的不是某类能力怎么做，而是一个项目整体如何推进。

它主要描述：

- 生命周期如何划分
- 过程有哪些阶段与活动
- 哪些活动先做，哪些后做
- 每个阶段承担什么交付目标

所以它回答的问题是：

**这个项目从启动到收尾，整体应该怎么交付？**

如果把两者压缩成一句对照：

- `Capability Pattern` 是局部能力复用
- `Delivery Process` 是全局交付组织

### 4. `Capability Pattern` 是如何进入 `Process` 的

`Capability Pattern` 真正被用到流程里时，重点不是“复制进去”，而是“绑定进去”。

一个典型理解方式可以写成：

```text
Process 里的某个 Activity
    extends
Capability Pattern
```

这表示：

- 当前 `Activity` 不是凭空定义的
- 它继承或承接某个能力模式中的关系网络
- 该模式里的任务、角色、工件及依赖结构被带入当前过程语境
- 当前过程可以在继承基础上再做局部特化

所以这里的 `extends` 不是简单文本复用，而是过程语义上的继承与绑定。

### 5. `ProcessComponent` 解决的是封装与装配

如果说 `Capability Pattern` 强调“里面通常怎么做”，那么 `ProcessComponent` 强调的就是“外面应该如何接入它”。

`ProcessComponent` 的价值主要体现在：

- 把一组过程能力封装成黑盒单元
- 明确输入什么工作产品、输出什么工作产品
- 让外部通过端口和契约装配，而不是依赖内部细节
- 支持过程资产跨团队、跨插件、跨方法库复用

这里最关键的接口思想就是 `WorkProductPort`。

也就是说：

- `Capability Pattern` 更偏白盒，强调内部做法与协作结构
- `ProcessComponent` 更偏黑盒，强调外部装配与边界契约

两者不是互斥关系，而是对同一类过程能力的两种不同描述视角。

### 6. `Pattern`、`Process`、`Component` 三者的总对照

把这三者放在一起看，可以得到下面这张对照表：

- `Capability Pattern`：复用一段局部做法
- `Delivery Process`：组织一个完整项目的交付路线
- `ProcessComponent`：封装一组过程能力的边界与接口

所以：

- `Pattern` 关注做法
- `Process` 关注路线
- `Component` 关注封装

这也是为什么 `ProcessComponent` 不是单纯和 `Pattern`、`Process` 并列竞争的第三种流程对象，而更像一个“模块化封装视角”。

### 7. `Variability` 是跨层的演化机制

`Variability` 不是新的过程内容，而是已有资产如何变化的机制。

它回答的问题是：

**同一套过程资产，在不同组织、不同项目、不同方法配置下，应该如何复用并变化？**

因此它可以贯穿：

- 方法内容层
- 模式层
- 过程层
- 组件化资产层

也就是说，`Variability` 不是某一层里的一个普通对象，而是一种跨层演化关系。

### 8. `extends` / `contributes` / `replaces` 的使用场景

这三种变体机制的区别，可以这样抓：

#### `extends`

表示基于原有资产派生一个自己的版本，既保留与基线的谱系关系，又允许局部特化。

适合：

- 某个 `Activity` 绑定并继承 `Capability Pattern`
- 某个标准过程派生出行业版或团队版
- 某个任务定义在原做法基础上增加本地约束

它体现的是：继承式复用。

#### `contributes`

表示给已有资产增量补充内容，但不强调形成一个完全独立的新身份。

适合：

- 给基础流程补一组审计活动
- 给标准任务增加额外检查点
- 给某个模式叠加组织特有的指导材料或工作产品说明

它体现的是：叠加式增强。

#### `replaces`

表示原有资产在当前场景中不再采用，而是由新的资产整体取代。

适合：

- 某一步骤在本组织中完全不用原版本
- 某个角色职责被新的职责定义整体替换
- 某项活动在执行方式上发生根本变化，不能再视为原活动的增强版本

它体现的是：替换式复用。

### 9. 第四阶段真正建立的边界感

这一阶段真正重要的，不是只记住了几个高级名词，而是建立了以下边界：

- `Capability Pattern` 描述局部过程能力，不等于完整项目流程
- `Delivery Process` 描述项目交付路线，不等于局部能力模板
- `ProcessComponent` 描述封装与装配边界，不等于内部做法本身
- `Variability` 描述资产如何变化，不等于某种新的方法内容
- `extends` / `contributes` / `replaces` 是三种不同的复用语义，不能混用

到这里，可以把这一块压缩成四句话：

- `Pattern`：复用做法
- `Process`：组织交付
- `Component`：封装能力边界
- `Variability`：管理资产演化

---

## 十五、第五阶段：SPEM 与主流项目管理软件的关系（已完成）

在把 `Pattern / Process / Component / Variability` 这组内部关系收束之后，下一步自然会问一个现实问题：

**市面上的项目管理软件，究竟有没有哪些是真正依赖 `SPEM 2.0` 这套标准开发的？**

这一阶段的重点不是比较“谁功能更多”，而是建立下面这条判断线：

- 一个软件是否只是能管理流程
- 还是它真的把过程资产当成方法元模型来表达

### 1. 先明确判断标准：不是“能管流程”，而是“是否以 `SPEM` 为底层表达”

如果只是看表面，很多软件都能做：

- 角色分工
- 任务分派
- 状态流转
- 迭代计划
- 缺陷跟踪
- 文档协作

但这还不能说明它遵循了 `SPEM`。

真正更接近 `SPEM` 的软件，通常应该至少表现出下面几类特征：

- 能区分方法定义层和流程使用层
- 能显式表达 `Role`、`Task`、`Work Product` 这些方法资产
- 能表达 `Capability Pattern`、`Delivery Process` 这类过程资产
- 能表达 `extends`、`contributes`、`replaces` 这类变体关系
- 能把过程能力封装成可装配的组件，而不是只有工作流配置

所以这一阶段真正比较的不是“谁会做工作流”，而是：

**谁是在做方法工程，谁只是在做流程执行。**

### 2. 市面软件的第一轮分组

按这个口径做第一轮归类，可以先得到下面这组判断：

#### `SPEM-native`

- `Eclipse Process Framework Composer (EPF Composer)`

这是当前最明确的一类。它不是“像 `SPEM`”，而是公开材料里就能直接落到 `SPEM 2.0` 实现谱系上的工具。

#### `SPEM-influenced`

- `IBM Rational Method Composer (RMC)`

它和 `EPF / UMA / SPEM` 的关系非常近，更像是方法工程工具链中的商业化谱系。但从公开可访问资料的证据强度来看，仍比 `EPF Composer` 稍弱，因此这里先保守放到“明显受影响”这一档。

#### `SPEM-unrelated but process-capable`

- `Jira`
- `禅道`
- `Huawei CodeArts`
- `IBM Rational Team Concert / Engineering Workflow Management`
- `Azure DevOps`
- `GitLab`
- `GitHub Projects`
- `Polarion ALM`
- `codebeamer`
- `Tuleap`

这一组的共同点是：

- 都能很好地管理项目执行与过程运行
- 也常常支持敏捷、Scrum、Kanban、SAFe、IPD、V-Model 等框架
- 但没有充分证据表明它们以 `SPEM 2.0` 为底层元模型

#### 更偏内容协作或建模平台

- `Confluence`
- `MagicDraw / Cameo`
- `Modelio`

这类工具要么更偏内容协作，要么更偏通用建模，并不是“项目过程元模型执行工具”这一路。

### 3. 五个重点产品的最终判断

这一轮最值得拿来对照的，是下面五个产品：

- `EPF Composer`
- `IBM Rational Method Composer`
- `Jira`
- `禅道`
- `Huawei CodeArts`

把它们压缩成一句最明确的结论：

- `EPF Composer`：`SPEM-native`
- `IBM Rational Method Composer`：`SPEM-influenced`
- `Jira`：`SPEM-unrelated but process-capable`
- `禅道`：`SPEM-unrelated but process-capable`
- `Huawei CodeArts`：`SPEM-unrelated but process-capable`

如果进一步解释：

- `EPF Composer` 真正站在方法工程和过程元模型这一层
- `RMC` 非常接近 `SPEM` 谱系，但公开证据不如 `EPF Composer` 那么直接
- `Jira / 禅道 / CodeArts` 虽然都很强，但更像“项目执行平台”或“研发协同平台”，而不是 `SPEM` 元模型实现

### 4. 从 `SPEM` 构件维度看它们分别做到了哪一层

如果把这五个产品放到 `Role / Task / Work Product / Process / Pattern / Variability / Component` 这条轴上，可以得到下面这张更有解释力的表：

| 产品 | Role | Task | Work Product | Process | Pattern | Variability | Component | 最终判断 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `EPF Composer` | 原生 | 原生 | 原生 | 原生 | 原生 | 原生 | 中映射 | `SPEM-native` |
| `IBM Rational Method Composer` | 高映射 | 高映射 | 高映射 | 高映射 | 高映射 | 高映射 | 中映射 | `SPEM-influenced` |
| `Jira` | 弱映射 | 中高映射 | 弱映射 | 中映射 | 弱映射 | 弱映射 | 无 | `SPEM-unrelated but process-capable` |
| `禅道` | 中映射 | 高映射 | 中映射 | 中高映射 | 中映射 | 弱中映射 | 无 | `SPEM-unrelated but process-capable` |
| `Huawei CodeArts` | 中映射 | 中高映射 | 中映射 | 中高映射 | 弱中映射 | 弱映射 | 无 | `SPEM-unrelated but process-capable` |

这里最重要的不是前面三列，而是后面三列：

- `Pattern`
- `Variability`
- `Component`

因为很多主流工具都能做到一点：

- 角色
- 任务
- 流程
- 工件

但真正到了：

- 可复用的能力模式
- 过程资产变体机制
- 过程组件化装配

就能立刻看出它是不是 `SPEM` 那一路。

### 5. 三个主流平台各自缺什么

如果从 `SPEM` 的角度反看 `Jira / 禅道 / CodeArts`，最关键的不是它们“有没有流程”，而是它们缺了哪些层。

#### `Jira`

`Jira` 最强的是：

- issue / work item
- workflow 状态流转
- board / sprint
- 项目级配置

所以它更像是在承载：

- `TaskUse`
- `Activity` 的执行视图
- 项目中的工作流状态机

但它最缺的是：

- `TaskDefinition` 这种方法定义层
- `Capability Pattern` 这种局部能力模式层
- `extends / contributes / replaces` 这种变体语义层
- `ProcessComponent` 这种过程组件化表达层

因此：

**`Jira` 更适合作为执行引擎，而不适合作为方法工程内核。**

#### `禅道`

`禅道` 比 `Jira` 更接近研发方法载体，因为它天然拥有：

- 需求
- 任务
- 缺陷
- 测试
- 计划
- 生命周期阶段
- Scrum / 瀑布 / 看板 / SAFe / IPD 等框架支持

它比 `Jira` 更接近 `SPEM` 的地方在于：

- 工件对象更丰富
- 生命周期组织更显式
- 更像研发管理系统，而不是单纯工单平台

但它仍然缺少：

- `Definition / Use` 的严格分层
- `Capability Pattern` 的过程模式语义
- `Variability` 的显式谱系关系
- `ProcessComponent` 和 `WorkProductPort` 这类组件化契约层

因此：

**`禅道` 更适合承载“研发对象化的过程执行”，但不是 `SPEM` 的完整实现。**

#### `Huawei CodeArts`

`CodeArts` 的强项不在方法建模，而在工程协同：

- 需求
- 代码仓库
- 质量检查
- 流水线
- 测试计划
- 制品管理

所以它最强的是：

- DevSecOps 工具链协同
- 项目执行中的交付流
- 端到端研发过程编排

它和 `SPEM` 接近的地方，更多在：

- `Delivery Process` 的执行视图
- 工件在过程中的流转
- 角色参与项目活动

但它仍然缺少：

- 方法定义层
- 能力模式层
- 变体谱系层
- 过程组件层

因此：

**`CodeArts` 更适合作为过程落地与交付平台，而不是方法工程建模平台。**

### 6. 一个最重要的观察：主流软件大多只做到 `Use` 层

这一步和前面学到的 `Definition / Use` 分界是能接起来的。

`EPF / RMC` 更像是在同时建模：

- `TaskDefinition`
- `RoleDefinition`
- `WorkProductDefinition`
- 以及它们进入过程后的上下文化使用

而 `Jira / 禅道 / CodeArts` 更像主要在管理：

- `TaskUse`
- `Role assignment`
- `Work item state`
- `process execution`

也就是说：

- `SPEM` 更关心“方法是什么”
- 主流项目管理软件更关心“项目现在怎么跑”

这是两个不同层级。

### 7. 第五阶段真正建立的边界感

这一阶段真正重要的，不是列出了一串软件名字，而是建立了下面这些判断边界：

- 能管理任务和流程，不等于采用了 `SPEM`
- `SPEM` 关注的是方法定义、过程模式、变体机制、组件装配
- 主流项目管理软件大多关注的是任务执行、状态流转、项目协同、工件追踪
- `EPF Composer` 是当前最明确的 `SPEM` 正例
- `RMC` 非常接近 `SPEM` 谱系，但公开证据需比 `EPF Composer` 更保守地表述
- `Jira / 禅道 / CodeArts` 更适合作为执行平台，而不是方法工程元模型本体

到这里，可以把这一块压缩成一句话：

**行业里的主流项目管理软件大多不是 `SPEM-native`，它们更多是在承载过程执行；真正靠近 `SPEM` 的，是少数方法工程工具。**

---

## 十六、本专题实际阅读来源与文档路径

为了避免后续回看时只看到结论、却不知道结论来自哪里，这里把本专题讨论过程中实际读取、检索和交叉核对过的文档列出来。

### 1. 当前专题文档本身

- `/home/aris/WorkProject/teams/design/SPEM 2.0 讨论与对象抽象.md`
  - 当前专题主文档
  - 每完成一个阶段后，都会把阶段性结论回填到这里

### 2. 上层导航文档

- `/home/aris/WorkProject/teams/design/开发流程标准.md`
  - 作为上层总览与专题入口文档使用
  - 用来确认 `SPEM 2.0` 专题在整体“开发流程标准”学习路径中的位置

### 3. SPEM 官方规范文本

- `/home/aris/WorkProject/teams/design/SPEM 2.0 Specification.pdf`
  - 用来核对规范章节的文字定义
  - 主要用于交叉确认 `Method Content`、`Process`、`Variability`、`ProcessComponent` 等概念在规范中的语义边界

### 4. SPEM 合并元模型文件

- `/home/aris/WorkProject/teams/design/SPEM2.merged.cmof`
  - 当前专题最核心的元模型依据之一
  - 用来核对类定义、继承链、关键属性，以及 `ProcessComponent`、`WorkProductPort`、`VariabilityElement` 等对象之间的结构关系

- `/home/aris/WorkProject/teams/design/SPEM2-Method-Content.merged.cmof`
  - 用来补充核对 `Method Content` 相关定义
  - 主要帮助厘清 `TaskDefinition`、`RoleDefinition`、`WorkProductDefinition` 一侧的内容层结构

- `/home/aris/WorkProject/teams/design/SPEM2-Process-Behavior-Content.merged.cmof`
  - 用来补充核对 `Process Behavior` 相关定义
  - 主要帮助理解过程层与行为扩展点之间的关系

### 5. 关于这些来源的使用方式说明

本专题里的结论，不是只靠单一文档直接摘抄，而是通过下面几种方式交叉得到：

- 先用专题文档沉淀阶段性理解
- 再回到 `SPEM 2.0 Specification.pdf` 核对规范文字语义
- 再结合各个 `*.merged.cmof` 文件核对元模型结构、继承关系和对象边界
- 最后把规范语义与元模型结构一起压缩成当前文档里的概念边界与关系图

因此，后面如果你再继续往下学，可以把这一节当成“本专题的阅读来源索引”。
