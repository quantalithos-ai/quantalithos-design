# CMMI-DEV：讨论与对象抽象

> 当前目标不是穷举所有 Practice Area 的所有 Practice，也不是立即设计结构体。
>
> 当前做两件事：
> 1. **先把 CMMI-DEV 的核心概念地基打牢**——哪些术语在说什么、哪些容易搞混
> 2. **再把 CMMI-DEV 理解为一个分层对象系统**——像 BPMN 那样，先看清"它要表达什么、用什么表达、如何成为框架、怎么落地"
>
> 你可以先把 CMMI-DEV 理解成：**一套描述"组织应该具备哪些过程能力、如何度量这些能力、如何通过评估确认这些能力"的行业最佳实践框架。**

---

## 学习阶段总览

当前这份讨论与抽象文档，按 6 个阶段展开：

0. **第零阶段：概念地基**
   - 把 CMMI-DEV 最重要的核心术语逐个讲清楚
   - 把最容易混淆的概念对照辨析
   - 确保后续学习不因术语含混而理解偏移
1. **第一阶段：整体架构——把 CMMI-DEV 看成分层系统**
   - 回答 CMMI-DEV 是什么
   - 建立"它是能力框架，不是过程模板"的基本认识
   - 用 BPMN 同款四层框架看全景
2. **第二阶段：Practice Area 与 Capability Area 的组织逻辑**
   - 理解四大能力域的职责边界
   - 理解每个 Practice Area 回答什么问题
3. **第三阶段：两种等级——Capability Level 与 Maturity Level**
   - 理解连续式表示法与阶段式表示法的本质差异
   - 理解 CL 和 ML 的评定逻辑
4. **第四阶段：评估——Appraisal 体系**
   - 理解评估方法、评估类型、评估结果
   - 理解 Appraisal 与 Audit 的区别
5. **第五阶段：CMMI-DEV 与其他标准/框架的协同**
   - 理解 CMMI-DEV 与 ISO 12207 / 15288 的互补关系
   - 理解 CMMI-DEV 与 Agile / DevOps 的兼容性
   - 理解 CMMI-DEV 与 SPICE / ISO 15504 的对照

---

## 第零阶段：概念地基

> 在进入架构和能力等级细节之前，先把 CMMI-DEV 里最核心的术语逐个讲清楚。
>
> 这样做的理由很简单：**如果术语含混，后面的理解一定会偏移。**
>
> 这一阶段不要求你记住所有细节，但要求你在遇到这些词时，不再凭直觉猜。

---

### 0.1 CMMI-DEV 的五层对象关系图

CMMI-DEV 不是一个顺序流程，而是一个由理念到落地的五层对象体系：

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    CMMI-DEV 的五层对象体系                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  第一层：理念与价值                                                  │
│  ───────────────────────────────────────────────                    │
│  Best Practice            —— 经过验证的行业最佳实践                  │
│  Performance              —— 组织交付结果的实际水平                   │
│  Improvement              —— 基于度量的持续改进                       │
│  Value                    —— 实践对业务目标的贡献                     │
│                                                                     │
│  第二层：模型结构                                                    │
│  ───────────────────────────────────────────────                    │
│  Model                    —— 包含最佳实践的结构化知识体               │
│  View                     —— 模型针对特定场景的应用视角               │
│  Capability Area          —— 相关 Practice Area 的逻辑分组           │
│  Practice Area            —— 一组相关实践的集合                       │
│  Practice                 —— 单条最佳实践 / 期望行为                  │
│                                                                     │
│  第三层：等级与度量                                                  │
│  ───────────────────────────────────────────────                    │
│  Capability Level (CL)    —— 单个 Practice Area 的能力等级           │
│  Maturity Level (ML)      —— 组织整体的成熟度等级                     │
│  Goal                     —— Practice Area 中期望达成的目标          │
│  Practice Implementation  —— 实践在组织中的具体实现                   │
│  Objective Evidence       —— 支撑等级声明的客观证据                   │
│                                                                     │
│  第四层：评估体系                                                    │
│  ───────────────────────────────────────────────                    │
│  Appraisal                —— 对照模型评估组织能力的正式过程           │
│  Appraisal Method         —— 评估遵循的方法论                        │
│  Appraisal Type           —— 评估的类型（Benchmark / Sustainment 等） │
│  Appraisal Result         —— 评估的正式产出与等级认定                 │
│                                                                     │
│  第五层：落地与采用                                                  │
│  ───────────────────────────────────────────────                    │
│  Adoption                 —— 组织引入 CMMI 的策略和路径              │
│  Transition               —— 从当前状态向目标等级过渡的过程          │
│  Organizational Unit      —— 评估和改进的作用范围                    │
│  Process Asset            —— 组织过程中可复用的制品                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

这张图的意义在于：

- CMMI-DEV 不只是"一组最佳实践的清单"，而是一个从理念到落地的完整对象体系
- 每一层回答不同的问题：什么是好的、怎么组织知识、怎么度量、怎么验证、怎么采用
- 只有先看清这个整体，后面学习具体 Practice Area 时才知道自己在理解哪一层

---

### 0.2 核心概念清单

下面把 CMMI-DEV 最重要的术语，按五层分组，逐个讲清楚。

#### 第一组：理念与价值

**Best Practice——经过验证的行业最佳实践**

- CMMI 的核心单位不是"过程定义"，而是"最佳实践"
- 最佳实践来自数千个组织的经验总结，被证明能有效提升过程性能
- 最佳实践描述的是"应该做什么"（What），而不是"怎么做"（How）

> 一句话：**CMMI 的最小语义单位是 Practice，不是 Procedure。**

**Performance——组织交付结果的实际水平**

- CMMI V2.0/V3.0 的核心关切从"有没有过程"转向"过程有没有产出好的结果"
- Performance 关注的是：质量、进度、成本、客户满意度等可度量的结果
- 高成熟度等级（ML4/ML5）的核心特征正是基于 Performance 的量化管理

> 一句话：**CMMI 不只关心过程有没有，更关心结果好不好。**

**Improvement——基于度量的持续改进**

- CMMI 的目标不是"通过评估"，而是"持续改进组织能力"
- 改进的方向由度量数据驱动，而不是仅凭经验判断
- ML5（优化级）的核心正是统计驱动的持续改进

**Value——实践对业务目标的贡献**

- CMMI V2.0 引入的核心概念：每条实践都应该对业务目标有明确贡献
- 如果一条实践不能为组织带来价值，就应该被质疑或调整
- Value 把 CMMI 从"合规清单"拉回"业务驱动"

> 一句话：**Value 是 CMMI V2.0/V3.0 的灵魂——实践必须有业务价值。**

---

#### 第二组：模型结构

**Model——包含最佳实践的结构化知识体**

- CMMI Model 是对最佳实践的结构化组织
- 它不是"过程定义模板"，而是"过程能力的参考框架"
- Model 定义了"应该具备哪些能力"，但不规定"具体怎么实现"

**View——模型针对特定场景的应用视角**

- CMMI V2.0 引入 View 概念，同一个 Model 可以从不同视角应用
- 当前主要 View 包括：
  - **Development (DEV)**：关注产品和服务的开发
  - **Services (SRV)**：关注服务的交付和管理
  - **Supplier Management (SUP)**：关注供应商管理
  - **People Management (PPL)**：关注人员能力管理
  - **Data Management (DAT)**：关注数据治理
  - **Safety (SAF)**：关注安全关键系统
  - **Security (SEC)**：关注信息安全
  - **Virtual (VIR)**：关注虚拟化环境
- View 不是独立的模型，而是对同一模型的选择性应用

> 一句话：**View 是 CMMI 的"应用场景切换器"，不是不同的模型。**

**Capability Area——相关 Practice Area 的逻辑分组**

- Capability Area 是 V2.0 引入的组织层级
- 它把数十个 Practice Area 按关注点聚合成四大组：
  - **Doing（行动）**：开发产品/服务的核心工程能力
  - **Managing（管理）**：项目和管理能力
  - **Enabling（使能）**：支撑工程和管理的使能能力
  - **Improving（改进）**：组织级持续改进能力
- Capability Area 帮助组织从高层视角定位自己的能力分布

**Practice Area——一组相关实践的集合**

- Practice Area 是 CMMI 模型的核心组织单元
- 每个 Practice Area 聚焦一个特定的过程能力维度
- 例如：Requirements Development and Management、Technical Solution、Verification and Validation
- Practice Area 内包含该维度的 Goal 和 Practice

**Practice——单条最佳实践 / 期望行为**

- Practice 是 CMMI 的最小语义单位
- 每条 Practice 描述一种期望的组织行为
- Practice 本身是"应该做什么"的描述，实现方式由组织自行决定
- Practice 的实现通过 Objective Evidence 来验证

> 层级关系：**Model → View → Capability Area → Practice Area → Practice**

---

#### 第三组：等级与度量

**Capability Level (CL)——单个 Practice Area 的能力等级**

- CL 用于度量单个 Practice Area 的实现程度
- 共 4 个等级：
  - **CL0 (Incomplete)**：实践未实施或未达到目标
  - **CL1 (Initial)**：实践已实施，但可能不稳定、不一致
  - **CL2 (Managed)**：实践已制度化，在项目/工作级别可重复
  - **CL3 (Defined)**：实践已标准化到组织级别，有裁剪指南
- CL 是"连续式表示法"的度量手段：你可以单独提升某个 PA 的能力等级

**Maturity Level (ML)——组织整体的成熟度等级**

- ML 用于度量组织整体的成熟程度
- 共 6 个等级：
  - **ML0 (Incomplete)**：几乎没有制度化实践
  - **ML1 (Initial)**：实践存在但混乱，结果不可预测
  - **ML2 (Managed)**：项目级实践已制度化，结果可重复
  - **ML3 (Defined)**：组织级标准过程已建立，项目可裁剪使用
  - **ML4 (Quantitatively Managed)**：过程性能可量化预测和控制
  - **ML5 (Optimizing)**：基于统计的持续改进
- ML 是"阶段式表示法"的度量手段：组织必须逐级提升
- ML3 是大多数组织的核心目标（组织级过程标准化）

> CL 与 ML 的关键区别：**CL 看单个 PA，ML 看整体组织；CL 可以跳跃提升，ML 必须逐级递进。**

**Goal——Practice Area 中期望达成的目标**

- 每个 Practice Area 包含一个或多个 Goal
- Goal 是对"这个 PA 的实践应该达成什么状态"的高层描述
- 实现 Goal 的方式是通过实现该 PA 下的 Practice

**Practice Implementation——实践在组织中的具体实现**

- CMMI 定义 Practice 是"应该做什么"，Implementation 是"组织实际怎么做"
- 同一条 Practice 在不同组织中的 Implementation 可以完全不同
- Implementation 的充分性由 Objective Evidence 支撑

**Objective Evidence——支撑等级声明的客观证据**

- 证据类型包括：文档、记录、访谈结果、演示、度量数据
- 证据必须客观可查，不能仅凭口头声明
- 证据链：Practice → Implementation → Evidence → Level Claim

---

#### 第四组：评估体系

**Appraisal——对照模型评估组织能力的正式过程**

- Appraisal 是 CMMI 判定组织等级的唯一正式途径
- 由经过认证的 Lead Appraiser 主持
- 评估过程有严格的方法论和规范
- 评估结果由 ISACA/CMMI Institute 认可和公示

**Appraisal Method——评估遵循的方法论**

- 当前正式方法为 **ARC (Appraisal Requirements for CMMI)** 定义的评估方法
- 方法规定了评估的流程、角色、证据要求、等级判定规则
- 方法确保不同组织、不同评估师的评估结果具有可比性

**Appraisal Type——评估的类型**

- **Benchmark Appraisal**：正式评估，可产生官方认可的等级认定
- **Sustainment Appraisal**：维持评估，确认之前的等级仍然有效
- **Evaluation Appraisal**：评估型评估，用于诊断和改进，不产生正式等级
- **Action Plan Reappraisal**：整改后复评，针对未通过评估后的补救

**Appraisal Result——评估的正式产出与等级认定**

- 评估结果包括：达成的 Maturity Level 或 Capability Level
- 结果由 CMMI Institute 官方公示
- 结果有效期为 3 年（之后需 Sustainment Appraisal 维持）

> 一句话：**Appraisal 是 CMMI 的"考试"，Method 是"考试规则"，Type 是"考试类型"，Result 是"成绩单"。**

---

#### 第五组：落地与采用

**Adoption——组织引入 CMMI 的策略和路径**

- CMMI 官方提供 Adoption Guide，指导组织如何逐步引入 CMMI
- Adoption 不是"一次性改造"，而是分阶段渐进
- 推荐路径：先识别差距 → 再制定改进计划 → 再实施改进 → 最后评估确认

**Transition——从当前状态向目标等级过渡的过程**

- Transition 关注的是"如何从现状走到目标"
- 涉及：培训、试点、推广、制度化
- Transition 的核心风险是"做了但没有制度化"（通过评估但不能维持）

**Organizational Unit——评估和改进的作用范围**

- OU 定义了 CMMI 评估的边界：哪些项目、哪些部门在评估范围内
- OU 的划分直接影响评估结果的有效范围
- 同一组织可以有多个 OU，各自独立评估

**Process Asset——组织过程中可复用的制品**

- 过程资产包括：标准过程定义、模板、检查单、度量库、经验库
- 过程资产是 ML3 的核心产出：组织级标准过程及其裁剪指南
- 过程资产的复用是 ML3 区别于 ML2 的关键标志

---

### 0.3 最容易混淆的 12 组概念辨析

| # | 混淆对 | 区别 |
|---|--------|------|
| 1 | Practice vs Procedure | Practice 是"应该做什么"（What），Procedure 是"怎么做"（How）。CMMI 定义前者，组织定义后者 |
| 2 | Capability Level vs Maturity Level | CL 度量单个 Practice Area，ML 度量组织整体。CL 可单独提升，ML 必须逐级递进 |
| 3 | Practice Area vs Process Area | V1.x 叫 Process Area，V2.0 起改名 Practice Area。术语变了，核心概念不变 |
| 4 | Goal vs Practice | Goal 是"期望达成的状态"，Practice 是"实现 Goal 的行为"。Goal 是靶心，Practice 是箭 |
| 5 | Appraisal vs Audit | Appraisal 对照 CMMI 模型评估能力，Audit 对照法规/合同检查合规。前者为了改进，后者为了合规 |
| 6 | Managed (CL2) vs Defined (CL3) | CL2 在项目级别可重复，CL3 在组织级别标准化。ML2 和 ML3 的区别同理 |
| 7 | Model vs Framework | Model 是 CMMI 的结构化知识体，Framework 在 CMMI 语境中与 Model 近似等价 |
| 8 | View vs Model | View 是 Model 的应用视角，不是独立模型。DEV View 是 Model 在开发场景下的应用 |
| 9 | Conformance vs Appraisal | Conformance 是对 CMMI 实践的声明满足，Appraisal 是正式评估确认。前者可以自声明，后者需要第三方 |
| 10 | Tailoring vs Adaptation | Tailoring 在 CMMI 中指对组织标准过程的裁剪（ML3 核心能力），Adaptation 更偏向实施层面的调整 |
| 11 | Quantitatively Managed (ML4) vs Optimizing (ML5) | ML4 是统计过程控制（可预测），ML5 是基于统计的持续改进（持续优化） |
| 12 | Objective Evidence vs Work Product | Evidence 是支撑等级声明的任何客观材料，Work Product 是过程中的产出物。后者是前者的常见来源之一 |

---

### 0.4 第零阶段最值得背下来的 5 句话

1. **CMMI 定义"应该做什么"，不定义"怎么做"。**——它是能力框架，不是操作手册
2. **CL 看单点，ML 看全局。**——连续式和阶段式是两种不同的度量视角
3. **ML3 是组织级标准化的分水岭。**——从项目级可重复走向组织级标准过程
4. **Appraisal 不是 Audit。**——评估为了改进，审计为了合规
5. **Value 是 CMMI V2.0/V3.0 的灵魂。**——实践必须有业务价值，否则应该质疑

---

### 0.5 第零阶段最容易犯的 5 个错误

#### 误解 1：把 CMMI 当成"流程模板"

CMMI 不是告诉你"先做 A 再做 B"的流程模板。它告诉你的是"你应该具备哪些能力"，至于这些能力如何实现，由组织自己决定。

#### 误解 2：把 Capability Level 和 Maturity Level 当成同一件事

CL 和 ML 是两种完全不同的度量方式。CL 可以让你单独看某个 Practice Area 做得怎么样，ML 告诉你整个组织站在哪个台阶上。一个 ML2 的组织，某些 PA 的 CL 可能已经到了 CL3。

#### 误解 3：把 Appraisal 当成目的

通过评估只是手段，持续改进才是目的。如果评估通过后过程不被维持和改进，评估结果毫无意义。

#### 误解 4：认为 CMMI 和 Agile 矛盾

CMMI V2.0/V3.0 明确支持 Agile 实践。CMMI 关心的是"你有没有这些能力"，而不是"你必须用瀑布"。Agile 团队完全可以在保持敏捷实践的同时满足 CMMI 的要求。

#### 误解 5：把 ML3 当成终点

ML3 只是"过程标准化"的起点。ML4 和 ML5 才是 CMMI 真正有价值的地方——量化管理和持续改进。停在 ML3 等于只完成了标准化，还没有进入数据驱动的持续优化。

---

### 0.6 第零阶段过关标准

如果你能清晰地回答以下问题，第零阶段就过关了：

1. CMMI 的最小语义单位是什么？它和 Procedure 有什么区别？
2. CL2 和 CL3 的本质区别是什么？
3. ML2 和 ML3 的本质区别是什么？
4. Appraisal 和 Audit 的区别是什么？
5. 为什么说 CMMI V2.0/V3.0 的灵魂是 Value？

---

## 第一阶段：把 CMMI-DEV 看成一个分层系统

> 学习 CMMI 时，最容易犯的错误，是一上来就陷入大量 Practice Area 和 Practice 的细节里。这样会很快失去整体感。
>
> 更好的方法是先把它理解为一个**分层系统**。

```text
┌──────────────────────────────────────────────────────────────────┐
│                       CMMI-DEV 整体框架                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  第一层：它要表达什么                                             │
│  ───────────────────────────────────────────────                 │
│  1. 做什么（Doing）       —— 开发产品和服务的核心工程能力          │
│  2. 管什么（Managing）    —— 项目和工作的管理能力                  │
│  3. 靠什么（Enabling）    —— 支撑工程和管理的使能能力              │
│  4. 改什么（Improving）   —— 组织级持续改进能力                   │
│                                                                  │
│  第二层：它用什么来表达                                           │
│  ───────────────────────────────────────────────                 │
│  1. Practice Area          —— 一组相关实践的集合                  │
│  2. Practice               —— 单条最佳实践                       │
│  3. Goal                   —— Practice Area 的期望目标           │
│  4. Objective Evidence     —— 支撑声明的客观证据                  │
│                                                                  │
│  第三层：它如何成为框架                                           │
│  ───────────────────────────────────────────────                 │
│  1. Capability Level       —— 单个 PA 的能力等级（CL0-CL3）      │
│  2. Maturity Level         —— 组织整体的成熟度等级（ML0-ML5）     │
│  3. Appraisal Method       —— 评估方法论                         │
│  4. Appraisal Type         —— 评估类型                           │
│                                                                  │
│  第四层：它如何落地                                               │
│  ───────────────────────────────────────────────                 │
│  1. Adoption Guide         —— 组织如何引入 CMMI                   │
│  2. Gap Analysis           —— 识别当前状态与目标的差距            │
│  3. Process Improvement     —— 实施改进                           │
│  4. Benchmark Appraisal    —— 正式评估确认等级                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

这张图的意义在于：

- CMMI-DEV 不只是"Practice 清单"
- 它同时关心"要什么能力""怎么表达能力""怎么度量能力""怎么确认能力"
- 只有先看清这个整体，后面学习具体 Practice Area 时才不会碎片化

---

### 1.1 第一层：CMMI-DEV 到底在表达什么

CMMI-DEV 把"开发组织应该具备什么能力"分成了四个维度：

**Doing（行动）——开发产品和服务的核心工程能力**

- 需求开发与管理
- 技术方案
- 产品集成
- 验证与确认
- 同行评审

这些 Practice Area 直接回答"开发活动本身应该做到什么"。

**Managing（管理）——项目和工作的管理能力**

- 项目计划
- 项目监控
- 估算
- 风险与机会管理
- 供应商协议管理

这些 Practice Area 回答"如何让开发活动受控"。

**Enabling（使能）——支撑工程和管理的使能能力**

- 配置管理
- 过程与制品质量保证
- 原因分析与解决
- 决策分析
- 组织级培训

这些 Practice Area 回答"如何保证工程和管理活动有足够的支撑"。

**Improving（改进）——组织级持续改进能力**

- 组织级过程焦点
- 组织级过程定义
- 组织级绩效管理

这些 Practice Area 回答"如何让整个组织的能力持续提升"。

---

### 1.2 第二层：CMMI-DEV 用什么来表达这些内容

在理解了"它要表达什么"之后，下一步要理解"它靠什么来表达"。

```text
CMMI-DEV 的表达组件分工

目标层
  ├─ Goal
  │    表达：这个 Practice Area 期望达成什么状态
  │
实践层
  ├─ Practice
  │    表达：为了达成 Goal，应该展现什么行为
  │
实现层
  ├─ Practice Implementation
  │    表达：组织实际上怎么落实这条 Practice
  │
证据层
  └─ Objective Evidence
       表达：如何证明 Practice 确实被有效实施
```

这里的核心思想是：

- CMMI 的表达从抽象到具体：Goal → Practice → Implementation → Evidence
- CMMI 只定义前两层（Goal 和 Practice），后两层由组织自行定义
- 评估时看的是证据层，判断的是实现层，对标的是实践层

---

### 1.3 第三层：CMMI-DEV 为什么不只是"最佳实践清单"

很多人第一次接触 CMMI 时，会把它理解成"一组最佳实践的清单"。这种理解只对了一部分。

CMMI-DEV 实际上至少包含四个层面：

**等级体系——怎么度量**

- CL/ML 不是标签，而是一套严格的等级判定体系
- 等级之间有明确的进阶逻辑：从无序到制度化，到标准化，到量化，到优化
- 等级的判定不是自说自话，而是通过正式评估确认

**评估方法——怎么验证**

- 评估有标准化的方法论（ARC）
- 评估师需要经过认证
- 评估结果有官方认可和公示

**改进路径——怎么提升**

- CMMI 不只告诉你"你在哪"，还告诉你"怎么往上走"
- 从 ML2 到 ML3 的提升，本质是从项目级制度化到组织级标准化
- 从 ML3 到 ML4 的提升，本质是从定性管理到量化管理

**价值导向——为什么做**

- V2.0/V3.0 的核心转变：从"有没有"到"好不好"
- 每条 Practice 都应该对业务目标有贡献
- 不能产生 Value 的实践应该被质疑

---

### 1.4 第四层：CMMI-DEV 最终想怎么落地

CMMI 的落地路径，可以理解为四个阶段：

**1. 识别差距（Gap Analysis）**

- 对照 CMMI 模型，找出当前组织的实践差距
- 确定目标等级（通常是 ML2 或 ML3）
- 制定改进优先级

**2. 实施改进（Process Improvement）**

- 针对差距，逐步引入缺失的实践
- 在试点项目中验证
- 形成过程资产（标准过程、模板、检查单）

**3. 制度化（Institutionalization）**

- 将试点验证过的实践推广到整个组织
- 建立组织级标准过程和裁剪指南
- 确保实践不被个人依赖，而是被制度维持

**4. 评估确认（Benchmark Appraisal）**

- 通过正式评估确认达成的等级
- 评估结果由 CMMI Institute 公示
- 之后每 3 年需要 Sustainment Appraisal 维持

---

## 第二阶段：Practice Area 与 Capability Area 的组织逻辑

### 2.1 四大 Capability Area 不是四条流水线，而是四个能力维度

最常见的误解是把 Doing → Managing → Enabling → Improving 当成"先做再管再支撑再改进"的顺序流程。

实际上：

- **Doing** 回答"核心工程能力够不够"
- **Managing** 回答"管理能力够不够"
- **Enabling** 回答"使能支撑够不够"
- **Improving** 回答"改进机制够不够"

它们是**同时需要**的四个维度，不是前后相继的四个阶段。

### 2.2 每个 Practice Area 回答什么问题

```text
Capability Area: Doing（行动）
──────────────────────────────────────────────────────
  Requirements Development & Management
    → 我们能否稳定地开发和管理工作需求？

  Technical Solution
    → 我们能否设计出满足需求的解决方案？

  Product Integration
    → 我们能否正确地集成产品组件？

  Verification & Validation
    → 我们能否验证和确认工作产品的正确性？

  Peer Reviews
    → 我们能否通过同行评审提前发现问题？

Capability Area: Managing（管理）
──────────────────────────────────────────────────────
  Project Planning
    → 我们能否制定合理的项目计划？

  Project Monitoring & Control
    → 我们能否监控项目并纠正偏差？

  Estimation
    → 我们能否做出可信的估算？

  Risk & Opportunity Management
    → 我们能否管理风险和机会？

  Supplier Agreement Management
    → 我们能否有效管理供应商？

Capability Area: Enabling（使能）
──────────────────────────────────────────────────────
  Configuration Management
    → 我们能否管理工件的一致性？

  Process & Product Quality Assurance
    → 我们能否保证过程和产品的质量？

  Causal Analysis & Resolution
    → 我们能否找到问题的根因并解决？

  Decision Analysis & Resolution
    → 我们能否做出有依据的决策？

  Organizational Training
    → 我们能否系统地培训人员？

Capability Area: Improving（改进）
──────────────────────────────────────────────────────
  Organizational Process Focus
    → 我们能否识别和规划过程改进？

  Organizational Process Definition
    → 我们能否定义和维护组织级过程资产？

  Organizational Performance Management
    → 我们能否量化管理和持续改进组织绩效？
```

---

## 第三阶段：两种等级——Capability Level 与 Maturity Level

### 3.1 Capability Level：连续式视角

Capability Level 允许你单独看某个 Practice Area 做得怎么样，不需要和其他 PA 绑定。

```text
CL3 (Defined)
  │  组织级标准化：实践被纳入组织标准过程，有裁剪指南
  │
CL2 (Managed)
  │  项目级制度化：实践在项目中可重复，有计划、有资源、有监控
  │
CL1 (Initial)
  │  基本实施：实践已实施，但不稳定、不一致
  │
CL0 (Incomplete)
     未实施或未达到目标
```

**什么时候用 CL？**

- 你只想提升某个特定 PA 的能力（比如只提升"风险管理"）
- 你的组织不需要整体 ML 等级，但需要在某些领域证明能力
- 你在 ML3 的基础上，想把某个 PA 推到 CL3 以上

### 3.2 Maturity Level：阶段式视角

Maturity Level 是一条组织级别的阶梯路径，必须逐级提升。

```text
ML5  Optimizing          ── 统计驱动的持续改进
     │
ML4  Quantitatively Managed ── 统计过程控制，可量化预测
     │
ML3  Defined             ── 组织级标准过程，项目可裁剪
     │
ML2  Managed             ── 项目级制度化，结果可重复
     │
ML1  Initial             ── 实践存在但混乱，结果不可预测
     │
ML0  Incomplete          ── 几乎没有制度化实践
```

**每个 ML 等级要求哪些 PA？**

| ML | 核心要求 | 关键特征 |
|----|---------|---------|
| ML2 | Managing 类 PA 的 CL 达到 CL2 | 项目级可重复 |
| ML3 | ML2 + Doing/Enabling/Improving 类 PA 的 CL 达到 CL3 | 组织级标准化 |
| ML4 | ML3 + 量化目标和过程性能模型 | 统计过程控制 |
| ML5 | ML4 + 原因分析和持续优化机制 | 持续改进 |

> 注意：ML1 不是"什么都没做"，而是"做了但不稳定"。ML0 才是"几乎没做"。

### 3.3 CL 与 ML 的关系

```text
                    Capability Level 视角
                    ┌──────────────────────┐
                    │  PA-A  PA-B  PA-C  PA-D  PA-E  │
                    │  CL3   CL2   CL3   CL1   CL2   │
                    └──────────────────────┘
                              ↕ 对照
                    Maturity Level 视角
                    ┌──────────────────────┐
                    │  ML3 = 一组 PA 达到规定的 CL 水平 │
                    └──────────────────────┘
```

关键理解：

- **ML 是 CL 的聚合**：达到某个 ML，意味着一组 PA 各自达到了规定的 CL
- **CL 可以单独使用**：你不需要追求 ML，也可以单独提升某个 PA 的 CL
- **ML3 是最常见的组织目标**：因为它代表了"组织级标准化"这个关键转折点

---

## 第四阶段：评估——Appraisal 体系

### 4.1 评估不是审计

这是理解 CMMI 评估最重要的一步：

| 维度 | Appraisal | Audit |
|------|-----------|-------|
| 目的 | 识别能力等级和改进机会 | 检查法规/合同合规 |
| 对照 | CMMI Model | 法规、合同、制度 |
| 产出 | 等级认定 + 改进建议 | 合规/不合规结论 |
| 主导 | 认证 Lead Appraiser | 审计师 |
| 性质 | 改进导向 | 合规导向 |

### 4.2 评估类型

```text
Appraisal Types
│
├── Benchmark Appraisal
│     正式评估，可产生官方认可的 ML/CL 等级
│     有效期 3 年
│     需要 Lead Appraiser 主持
│
├── Sustainment Appraisal
│     维持评估，确认之前的等级仍然有效
│     在 Benchmark 之后 3 年内进行
│     范围可以小于原始 Benchmark
│
├── Evaluation Appraisal
│     评估型评估，用于诊断和改进
│     不产生正式等级认定
│     适合改进过程中的自我检查
│
└── Action Plan Reappraisal
      整改后复评
      针对之前评估中发现的不足
      确认整改措施已有效实施
```

### 4.3 评估过程的核心步骤

```text
1. 评估规划
   ├── 确定评估范围（Organizational Unit）
   ├── 确定评估类型
   └── 选择 Lead Appraiser

2. 评估准备
   ├── 收集客观证据
   ├── 准备访谈对象
   └── 准备演示/文档

3. 评估实施
   ├── 文档审查
   ├── 人员访谈
   ├── 实践演示
   └── 证据确认

4. 评估判定
   ├── 逐 PA 判定 CL
   ├── 汇总判定 ML
   └── 生成评估报告

5. 结果公示
   └── 提交 CMMI Institute 官方认可和公示
```

---

## 第五阶段：CMMI-DEV 与其他标准/框架的协同

### 5.1 CMMI-DEV vs ISO 12207 / 15288

| 维度 | CMMI-DEV | ISO 12207 / 15288 |
|------|----------|-------------------|
| 性质 | 行业框架（非 ISO 标准） | 国际正式标准 |
| 关注点 | 过程能力成熟度 | 生命周期过程 |
| 定义方式 | "应该具备什么能力" | "应该有哪些过程、过程应产出什么" |
| 评估方式 | CMMI Appraisal | 自声明 / 第三方评估 |
| 粒度 | Practice Area / Practice | Process / Activity / Task |
| 互补性 | CMMI 答复"能力够不够" | 12207/15288 答复"过程全不全" |

**典型的协同方式**：

- 用 12207/15288 定义"应该有哪些过程"（过程清单）
- 用 CMMI-DEV 定义"每个过程应该做到什么水平"（能力等级）
- 12207/15288 给骨架，CMMI 给肌肉

### 5.2 CMMI-DEV vs Agile / DevOps

CMMI 和 Agile 不矛盾。CMMI V2.0/V3.0 明确支持 Agile 实践：

| 维度 | CMMI-DEV | Agile / DevOps |
|------|----------|---------------|
| 关注点 | 过程能力成熟度 | 快速交付和持续反馈 |
| 时间尺度 | 组织级（季度/年度改进） | 迭代级（周/天级交付） |
| 度量 | CL/ML 等级 | 速度、质量、周期时间 |
| 文档 | 证据导向（够用即可） | 可工作软件 > 面面俱到的文档 |

**兼容实践示例**：

- Sprint Planning → Project Planning (PA)
- Daily Standup → Project Monitoring & Control (PA)
- Retrospective → Causal Analysis & Resolution (PA)
- Definition of Done → Verification & Validation (PA)
- CI/CD → Configuration Management (PA)

### 5.3 CMMI-DEV vs SPICE / ISO 15504

| 维度 | CMMI-DEV | SPICE (ISO 15504) |
|------|----------|-------------------|
| 性质 | 行业框架 | 国际标准 |
| 等级体系 | CL (0-3) + ML (0-5) | CL (0-5) |
| 过程参考 | 自定义 Practice Area | 基于 ISO 12207 的过程分类 |
| 评估方法 | CMMI Appraisal | SPICE Assessment |
| 主要市场 | 北美、全球广泛 | 欧洲、汽车行业 |

SPICE 的 CL 有 6 级（0-5），比 CMMI 的 CL 多了 CL4（可预测）和 CL5（优化），这对应了 CMMI ML4/ML5 的量化管理层面。

---

## 把 CMMI-DEV 压缩成一个适合记忆的框架

### 四横一纵

```text
四横
──────────────────────────────────────────────
第一横：做什么能力       Doing / Managing / Enabling / Improving
第二横：怎么表达能力     Goal → Practice → Implementation → Evidence
第三横：怎么度量能力     CL (0-3) / ML (0-5)
第四横：怎么确认能力     Appraisal (Benchmark / Sustainment / Evaluation)

一纵
──────────────────────────────────────────────
价值牵引               所有实践必须对业务目标有贡献（Value）
```

---

## 第一遍学习 CMMI-DEV 时，应该先建立什么直觉

1. **CMMI 是能力框架，不是流程模板**——它告诉你"应该有什么能力"，不告诉你"第一步做什么"
2. **等级的本质是制度化程度**——CL2 是项目级制度化，CL3 是组织级标准化
3. **ML3 是最重要的分水岭**——从"项目各自为战"走向"组织统一标准"
4. **评估是为了改进，不是为了拿证**——通过评估只是手段，持续改进才是目的
5. **Value 是灵魂**——如果一条实践不能产生业务价值，它应该被质疑

---

## 下一步应该怎么继续学习

### 路线 A：先深入 Practice Area

逐个理解每个 Practice Area 的 Goal 和 Practice，建立"每个 PA 到底在说什么"的直觉。

### 路线 B：先深入评估方法

理解 Appraisal 的具体流程和判定规则，建立"评估到底怎么评"的直觉。

### 路线 C：先做差距分析

对照 CMMI-DEV 模型，对当前组织的实践做 Gap Analysis，建立"我们在哪、差距在哪"的直觉。

---

## 小结

CMMI-DEV 的核心不是"30 多个 Practice Area 的细节"，而是以下几个理解：

- **它是什么**：一套描述"组织应该具备哪些过程能力"的行业最佳实践框架
- **它怎么组织**：四大 Capability Area → Practice Area → Practice → Goal
- **它怎么度量**：CL（单点）和 ML（全局）两种等级体系
- **它怎么确认**：Appraisal 评估体系
- **它为什么存在**：帮助组织持续改进过程能力，最终提升业务 Performance

> 一句话总结：**CMMI-DEV 是过程能力的"体检标准"——告诉你应该具备什么能力、现在做到什么程度、怎么继续提升。**
