# Step 5. 主要组成部分、职责与边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 5
> 回填章节: `02-概要设计.md` §5 主要组成部分、职责与边界
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

在 Step 4 已明确“业务主要组成部分”和“实现分层”是两条不同组织轴的前提下,收稳 `L1-artifact` 的主要组成部分、各自职责、不承担职责、包含的代码主体 / 模块和对象发现线索。

本步要完成的是“把 Artifact truth 主线和支撑边界拆成稳定的业务结构主语”,而不是提前写对象字段、API schema、repository 函数、事件 payload、DDL、配置项或实施边界。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成 | 提供 truth ownership、外部正文排除、只读派生、路径分离和层次深度约束 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体骨架、实现分层和业务组成部分候选 |
| `projects/L1-artifact/00-需求文档.md` §9~12 | 当前正式需求基线 | 提供五条核心能力闭环、业务规则、数据归属和接口 / 依赖边界 |
| `projects/L1-artifact/01-架构设计.md` §4~10 | 当前正式架构基线 | 提供职责边界、子域划分、运行单元、依赖方向、数据所有权和关键交互 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 | 约束 Step 5 的总表、小节、门禁和跨组成部分闭环审计 |
| `standards/document/概要设计书写规范.md` | 已读取 | 约束正式 §5 的表、图和小节格式 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计层面,本仓应被划分为哪些主要组成部分?

当前概要设计层面,`L1-artifact` 划分为 10 个主要组成部分:

1. `Artifact fact management`
2. `Artifact version management`
3. `Artifact lineage management`
4. `Artifact baseline management`
5. `Artifact intake convergence`
6. `Artifact review and responsibility context`
7. `Automation output control boundary`
8. `Artifact consumption and traceability`
9. `Derived maintenance and handoff preparation`
10. `External reference and local mirror support`

这 10 个名字都是概要设计层的业务结构主语,不是运行单元名、实现分层名、代码目录名、外部系统名或对象字段名。它们后续会跨越 `Inbound / Operations`、`Application Services`、`Domain Model`、`Ports / Persistence / Projection / Handoff` 等实现分层继续展开。

### 3.2 每个主要组成部分分别承担什么职责?

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| `Artifact fact management` | 形成正式 Artifact fact 和内容事实语境,把真相入口与派生材料、外部正文分开 | `Artifact Sync Entry`、`Truth Write Services`、`Artifact Truth Domain Core`、`Truth Persistence Ports` | 不拥有外部正文生命周期、工作 / 过程 / 治理 truth 或派生视图 truth |
| `Artifact version management` | 形成稳定 Artifact version,区分候选修订、替代、当前引用和历史版本 | `Truth Write Services`、`Truth Read / Consumption Services`、`Artifact Truth Domain Core`、`Truth Persistence Ports` | 不把 current latest、消费方状态、自动化结果或 report row 当正式版本 |
| `Artifact lineage management` | 形成来源、替代、依赖、影响和追溯语义,保护 lineage 锚定在正式 fact / version 上 | `Truth Write Services`、`Artifact Truth Domain Core`、`Truth Persistence Ports`、`Event / Audit / Handoff Relay Ports` | 不把 runtime trace、tool result、event stream 或 graph query 变成正式 lineage truth |
| `Artifact baseline management` | 形成受控 Artifact version 集合、冻结语境、历史基线和可回指 baseline truth | `Truth Write Services`、`Truth Read / Consumption Services`、`Artifact Truth Domain Core`、`Truth Persistence Ports` | 不让 project baseline、governance decision、release note 或 archive package 替代 baseline truth |
| `Artifact intake convergence` | 承接人工、外部、工作、过程和治理侧材料,把它们收束为可审查 Artifact 输入语境 | `Artifact Sync Entry`、`Artifact Async Intake`、`Intake / Review Boundary Services`、`Reference / Snapshot / Body Source Ports` | 不直接形成 version、lineage 或 baseline,不拥有来源仓正文 |
| `Artifact review and responsibility context` | 让审查、负责、维护和协作消费围绕同一 Artifact truth 成立 | `Truth Read / Consumption Services`、`Intake / Review Boundary Services`、`Artifact Truth Domain Core`、`Event / Audit / Handoff Relay Ports` | 不拥有 identity、work、process、governance 的主体 truth |
| `Automation output control boundary` | 让 runtime / capability / tool 产出只以受控输入或候选关系进入 Artifact 语境 | `Artifact Async Intake`、`Intake / Review Boundary Services`、`Reference / Snapshot / Body Source Ports`、`Event / Audit / Handoff Relay Ports` | 不拥有 runtime execution、tool output 或 capability truth |
| `Artifact consumption and traceability` | 对外提供稳定读取、正式回指、消费依据解释和审计追溯 | `Truth Read / Consumption Services`、`Projection / Preview / Report Read Models`、`Event / Audit / Handoff Relay Ports` | 不把 SDK / console / workspace / sync 副本写回核心 truth |
| `Derived maintenance and handoff preparation` | 维护 projection / preview / report / reconciliation 和 archive / observability / sync handoff 材料 | `Artifact Operations Jobs`、`Derived Maintenance Services`、`Projection / Preview / Report Read Models`、`Derived Persistence / Handoff Preparation Ports` | 不形成新 Artifact truth,不覆盖或冻结业务事实 |
| `External reference and local mirror support` | 承载定义来源、工作 / 过程 / 治理引用、外部正文引用、快照、safe summary 和解析状态 | `Reference / Snapshot / Body Source Ports`、`Projection / Preview / Report Read Models`、`Derived Persistence / Handoff Preparation Ports` | 不拥有外部定义、外部正文、外部状态或下游 truth |

### 3.3 哪些内容虽然相关,但必须由相邻部分或边界外能力承担?

| 相关内容 | 正确归属 | `L1-artifact` 的处理口径 |
|---|---|---|
| Work output、project state、iteration 和 blocker | `L1-work` | 只收束 work 语境引用、Artifact backref 和 baseline 消费线索 |
| Activity output、waiting state、checkpoint 和 recovery | `L1-process` | 只收束 process / activity 语境和 Artifact version / lineage 回指 |
| Governance decision、AIIA、SoA 和 evidence truth | `L1-governance` | 只收束治理证据边界、治理语境引用和 Artifact evidence 回指 |
| Artifact kind、WorkProductDefinition、方法 / 标准定义正文 | `L3-method-library` | 只保存定义来源引用、safe summary 和版本锚点 |
| Runtime execution、tool invocation、capability result | `L2-runtime` / `L3-capability-hub` | 只作为自动化产出候选输入、来源摘要或关系线索进入本仓 |
| Conversation / workspace / console view state | `L1-conversation` / `L1-workspace` / `L5-console` | 只消费 Artifact truth 或只读派生材料,不得定义 truth |
| Archive package body、observability physical log、sync private copy | `L4-archive` / `L4-observability` / `L5-sync` | 只接收 handoff / backref / explanation,不得反向拥有 Artifact truth |
| Git / object store / URL / database 正文生命周期 | 外部内容来源或技术承载 | Artifact 只拥有内容事实语境和引用,不拥有外部正文生命周期 |

### 3.4 哪些候选对象必须进入 Step 6 独立成节展开?

Step 6 必须从本步候选池中正式筛选并展开以下对象线索:

- truth / state:
  `ArtifactFact`、`ArtifactContentFactContext`、`ArtifactVersion`、`ArtifactVersionCandidate`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactBaselineMembership`、`ArtifactIntakeContext`、`ArtifactSubmissionRecord`、`ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment`、`AutomationArtifactInput`、`ConsumableArtifactReference`、`ArtifactConsumptionBackref`、`ArtifactDerivedViewState`、`ExternalReferenceResolutionState`
- policy / invariant:
  `ArtifactFactPolicy`、`ArtifactVersionPolicy`、`ArtifactLineagePolicy`、`ArtifactBaselinePolicy`、`ArtifactIntakePolicy`、`ArtifactReviewPolicy`、`AutomationBoundaryPolicy`、`ArtifactReadVisibilityPolicy`、`ArtifactTraceabilityPolicy`、`ExternalReferenceValidityPolicy`
- projection / read model:
  `ArtifactFactSummaryView`、`ArtifactVersionSummaryView`、`ArtifactLineageSummaryView`、`ArtifactBaselineSummaryView`、`ArtifactReviewSummaryView`、`ArtifactReadSurfaceView`、`ArtifactPreviewView`、`ArtifactReportView`、`ArtifactReconciliationReport`
- reference / boundary:
  `ArtifactContentSourceRef`、`ArtifactDefinitionRef`、`ArtifactWorkContextRef`、`ArtifactProcessContextRef`、`ArtifactGovernanceContextRef`、`AutomationSourceRef`、`AdjacentConsumerRef`
- audit / history:
  `ArtifactFactChangeRecord`、`ArtifactVersionChangeRecord`、`ArtifactLineageChangeRecord`、`ArtifactBaselineChangeRecord`、`ArtifactReviewTraceRecord`、`AutomationIntakeAuditRecord`、`ArtifactTraceRecord`、`ArtifactHandoffRecord`、`ExternalMirrorRefreshRecord`

Repository、port、adapter、trigger、DTO、HTTP body、event payload、database table 和 job runner 仍不在 Step 6 被当成领域对象正式展开。

---

## 4. 结构化中间产物

### 4.1 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| `Artifact fact management` | `ArtifactFact`、`ArtifactContentFactContext` | `ArtifactFactPolicy` | `ArtifactFactSummaryView` | `ArtifactContentSourceRef` | `ArtifactFactChangeRecord` | `ArtifactFact`、`ArtifactContentFactContext`、`ArtifactFactPolicy` |
| `Artifact version management` | `ArtifactVersion`、`ArtifactVersionCandidate` | `ArtifactVersionPolicy` | `ArtifactVersionSummaryView` | current / candidate / history reference 线索 | `ArtifactVersionChangeRecord` | `ArtifactVersion`、`ArtifactVersionCandidate`、`ArtifactVersionPolicy` |
| `Artifact lineage management` | `ArtifactLineageLink` | `ArtifactLineagePolicy` | `ArtifactLineageSummaryView` | lineage evidence / related artifact refs | `ArtifactLineageChangeRecord` | `ArtifactLineageLink`、`ArtifactLineagePolicy` |
| `Artifact baseline management` | `ArtifactBaseline`、`ArtifactBaselineMembership` | `ArtifactBaselinePolicy` | `ArtifactBaselineSummaryView` | baseline consumer refs | `ArtifactBaselineChangeRecord` | `ArtifactBaseline`、`ArtifactBaselineMembership`、`ArtifactBaselinePolicy` |
| `Artifact intake convergence` | `ArtifactIntakeContext`、`ArtifactSubmissionRecord` | `ArtifactIntakePolicy` | intake accepted / rejected summary 线索 | `ArtifactContentSourceRef`、context refs | `ArtifactInputResolutionRecord` | `ArtifactIntakeContext`、`ArtifactSubmissionRecord`、`ArtifactIntakePolicy` |
| `Artifact review and responsibility context` | `ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment` | `ArtifactReviewPolicy` | `ArtifactReviewSummaryView` | review / responsibility context refs | `ArtifactReviewTraceRecord` | `ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment`、`ArtifactReviewPolicy` |
| `Automation output control boundary` | `AutomationArtifactInput` | `AutomationBoundaryPolicy` | automation intake summary 线索 | `AutomationSourceRef` | `AutomationIntakeAuditRecord` | `AutomationArtifactInput`、`AutomationBoundaryPolicy`、`AutomationSourceRef` |
| `Artifact consumption and traceability` | `ConsumableArtifactReference`、`ArtifactConsumptionBackref` | `ArtifactReadVisibilityPolicy`、`ArtifactTraceabilityPolicy` | `ArtifactReadSurfaceView` | `AdjacentConsumerRef` | `ArtifactTraceRecord` | `ConsumableArtifactReference`、`ArtifactConsumptionBackref`、`ArtifactReadVisibilityPolicy`、`ArtifactTraceRecord` |
| `Derived maintenance and handoff preparation` | `ArtifactDerivedViewState` | derived freshness / rebuild policy 线索 | `ArtifactPreviewView`、`ArtifactReportView`、`ArtifactReconciliationReport` | handoff target refs | `ArtifactHandoffRecord` | `ArtifactDerivedViewState`、`ArtifactPreviewView`、`ArtifactReportView`、`ArtifactReconciliationReport` |
| `External reference and local mirror support` | `ExternalReferenceResolutionState` | `ExternalReferenceValidityPolicy` | external mirror summary 线索 | `ArtifactDefinitionRef`、`ArtifactWorkContextRef`、`ArtifactProcessContextRef`、`ArtifactGovernanceContextRef` | `ExternalMirrorRefreshRecord` | `ExternalReferenceResolutionState`、`ExternalReferenceValidityPolicy` |

### 4.2 各部分交互总图

```text
+====================================================================================+
|                           L1-artifact component flow                               |
+====================================================================================+
|                                                                                    |
| Artifact intake convergence ----> Artifact fact management ----> Artifact version  |
|            |                           |                            |               |
|            |                           |                            v               |
|            |                           +--------------------> Artifact lineage      |
|            |                                                        |               |
| Automation output control boundary ---------------------------------+               |
|            |                                                        v               |
| Artifact review and responsibility context -----------------> Artifact baseline     |
|                                                                                    |
| Artifact consumption and traceability <----------- read / backref -----------+     |
|            ^                                                                 |     |
|            |                                                                 |     |
| External reference and local mirror support ----> Derived maintenance and handoff  |
|            |                                      preparation                |     |
|            +------------------------ support / refresh / explain ------------+     |
|                                                                                    |
+====================================================================================+
```

关键说明:

- 图只表达主要组成部分之间的大体交互与交接方向,不表达协议字段、函数调用链、完整时序或数据库结构。
- `Artifact fact / version / lineage / baseline` 共同构成核心 truth 主线;其余部分只能承接输入、审查、消费、派生或引用支持。
- `Automation output control boundary` 和 `External reference and local mirror support` 都只是边界 / 支撑部分,不能生成第二份 Artifact truth。
- `Derived maintenance and handoff preparation` 只处理只读派生和交接材料,不得回写核心 truth。

---

## 5. 各主要组成部分

### 5.1 Artifact fact management

#### 5.1.1 本部分职责

把平台产出、人工确认或受控自动化产物建立为正式 `Artifact fact`,并同时维持可解释的内容事实语境,使后续 version、lineage、baseline、review 和 consumption 都围绕同一真相锚点展开。

#### 5.1.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 正式 Artifact fact 纳管 | intake context、content source ref、责任 / 审查语境 | 已成立或被拒绝的 `ArtifactFact` | 形成正式 truth 入口和 fact change trace | Step 6 / Step 8 / Step 9 |
| 内容事实语境建立 | 已接受输入、内容来源线索、定义来源线索 | `ArtifactContentFactContext` | 将正文拥有权与内容事实语境区分开 | Step 6 / Step 8 |
| 区分正式 truth 与派生材料 | fact、attachments、preview、report、archive / observability 材料 | truth / derived 明确边界 | 禁止派生材料成为正式 fact 来源 | Step 6 / Step 10 |
| 为 version / lineage / baseline 提供统一锚点 | 已成立 fact | 可被后续组件引用的 truth anchor | 下游必须回指同一 fact | Step 7 / Step 8 |

#### 5.1.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `Artifact Sync Entry` | inbound family | 承接人工或同步 fact 纳管请求 | Step 7 / Step 8 |
| `Truth Write Services` | application service family | 编排 fact 建立、拒绝和审计记录 | Step 7 / Step 8 |
| `Artifact Truth Domain Core` | domain model family | 承载 fact 和内容事实语境的真相语义 | Step 6 |
| `Truth Persistence Ports` | persistence port family | 保存正式 fact truth 和 history | Step 7 / 详细设计 |

#### 5.1.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ArtifactFact` | Step 6 独立成节 |
| Truth / State | `ArtifactContentFactContext` | Step 6 独立成节 |
| Policy / Invariant | `ArtifactFactPolicy` | Step 6 独立成节 |
| Projection / Read model | `ArtifactFactSummaryView` | Step 6 独立成节 |
| Reference / Boundary | `ArtifactContentSourceRef` | Step 6 独立成节 |
| Audit / History | `ArtifactFactChangeRecord` | Step 6 独立成节 |

#### 5.1.5 本部分不承担什么

不拥有 Git / URL / object store / external body 的生命周期;不拥有 Work output、Process output、Governance evidence、runtime result 或派生 preview / report 的 truth;也不直接承担 version、lineage 或 baseline 的完整状态机。

#### 5.1.6 与其他部分的接缝

接收 `Artifact intake convergence` 和 `Automation output control boundary` 提供的已收束输入,向 `Artifact version management`、`Artifact lineage management`、`Artifact baseline management` 和 `Artifact consumption and traceability` 提供统一 truth 锚点。

#### 5.1.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能来源是否清楚 | pass | 直接承接 `FR-ART-001~004` |
| 候选对象是否有功能来源 | pass | fact / content context 均有明确业务来源 |
| 接缝是否清楚 | pass | 只从 intake / automation 收输入,向 version / lineage / baseline / consumption 出 truth anchor |
| 非职责是否清楚 | pass | 已明确不拥有外部正文和派生 truth |
| 是否越界到详细设计 | pass | 未展开字段、schema、repo 函数或存储实现 |

### 5.2 Artifact version management

#### 5.2.1 本部分职责

围绕正式 `Artifact fact` 形成稳定 `Artifact version` 语义,保护候选修订、替代、当前引用和历史版本不会被无声覆盖,并为 lineage、baseline、review 和 downstream consumption 提供确定版本锚点。

#### 5.2.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 形成稳定 Artifact version | fact anchor、修订 / 替代意图、内容变化依据 | `ArtifactVersion` | 产生正式版本锚点 | Step 6 / Step 8 / Step 9 |
| 区分候选修订、当前引用和历史版本 | existing version、candidate、replacement context | candidate / active / historical semantics | 防止 current latest 或外部状态替代正式 version | Step 6 / Step 9 |
| 保留历史版本追溯 | 已成立版本和替代关系 | historical version reference | 审计与消费可以回到当时版本 | Step 6 / Step 8 |
| 向 baseline / lineage / consumption 输出版本锚点 | confirmed version | version refs / summaries | 下游消费不得绕过正式 version | Step 7 / Step 8 |

#### 5.2.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `Truth Write Services` | application service family | 编排版本形成、替代和冲突拒绝 | Step 7 / Step 8 |
| `Truth Read / Consumption Services` | application service family | 提供稳定版本读取和历史版本定位 | Step 7 / Step 8 |
| `Artifact Truth Domain Core` | domain model family | 承载版本成立与替代边界 | Step 6 |
| `Truth Persistence Ports` | persistence port family | 保存版本 truth 和历史引用 | Step 7 / 详细设计 |

#### 5.2.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ArtifactVersion` | Step 6 独立成节 |
| Truth / State | `ArtifactVersionCandidate` | Step 6 独立成节 |
| Policy / Invariant | `ArtifactVersionPolicy` | Step 6 独立成节 |
| Projection / Read model | `ArtifactVersionSummaryView` | Step 6 独立成节 |
| Audit / History | `ArtifactVersionChangeRecord` | Step 6 独立成节 |

#### 5.2.5 本部分不承担什么

不拥有 content backend 的版本 history;不把 workspace / sync / archive 的当前视图当正式 version;不承担 lineage 关系判断、baseline 成员冻结或审查责任的完整语义。

#### 5.2.6 与其他部分的接缝

消费 `Artifact fact management` 给出的 truth anchor,向 `Artifact lineage management` 和 `Artifact baseline management` 输出正式版本锚点,并为 `Artifact review and responsibility context` 和 `Artifact consumption and traceability` 提供确定版本读取面。

#### 5.2.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能来源是否清楚 | pass | 直接承接 `FR-ART-005~008` |
| 候选对象是否有功能来源 | pass | version / candidate / history 均有明确来源 |
| 接缝是否清楚 | pass | 上接 fact,下接 lineage / baseline / consumption |
| 非职责是否清楚 | pass | 已排除 current latest、消费副本和外部状态替代 |
| 是否越界到详细设计 | pass | 未展开版本状态枚举和持久化细节 |

### 5.3 Artifact lineage management

#### 5.3.1 本部分职责

围绕正式 `Artifact fact` 和 `Artifact version` 形成正式 `Artifact lineage` 语义,表达来源、替代、依赖、影响和追溯关系,同时阻止 runtime trace、tool result、event stream 或 graph 查询结果直接被误当成 lineage truth。

#### 5.3.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 建立正式 lineage relation | fact / version anchors、relation intent、evidence clues | `ArtifactLineageLink` | 形成正式关系语义 | Step 6 / Step 8 / Step 9 |
| 表达来源、替代、依赖和影响 | version relation、上下文依据、自动化来源线索 | lineage semantics | 为 review、impact 和 downstream tracing 提供解释基础 | Step 6 / Step 8 |
| 保持 lineage 锚定正式 truth | fact / version、trace / tool / event clues | anchored lineage or rejection | 防止线索材料直接升级为 truth | Step 6 / Step 10 |
| 输出血缘解释给 baseline / consumption / derived | lineage state | lineage summary / backref | 支撑审计、报告和影响理解 | Step 7 / Step 8 |

#### 5.3.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `Truth Write Services` | application service family | 编排 lineage 建立、拒绝和调整 | Step 7 / Step 8 |
| `Artifact Truth Domain Core` | domain model family | 承载正式 lineage 锚定语义 | Step 6 |
| `Truth Persistence Ports` | persistence port family | 保存 lineage truth 与历史追溯 | Step 7 / 详细设计 |
| `Event / Audit / Handoff Relay Ports` | audit / handoff port family | 向 traceability、report 和 handoff 输出变化线索 | Step 7 / 详细设计 |

#### 5.3.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ArtifactLineageLink` | Step 6 独立成节 |
| Policy / Invariant | `ArtifactLineagePolicy` | Step 6 独立成节 |
| Projection / Read model | `ArtifactLineageSummaryView` | Step 6 独立成节 |
| Reference / Boundary | lineage evidence / related artifact refs | Step 6 独立成节 |
| Audit / History | `ArtifactLineageChangeRecord` | Step 6 独立成节 |

#### 5.3.5 本部分不承担什么

不把 runtime trace、tool output、model context、observability record、event stream 或 graph query 结果直接当作 lineage truth;不承担 baseline 冻结、外部正文 ownership 或 review / responsibility 主语。

#### 5.3.6 与其他部分的接缝

消费 `Artifact fact management` 和 `Artifact version management` 提供的正式 truth 锚点,为 `Artifact baseline management`、`Artifact review and responsibility context`、`Artifact consumption and traceability` 与 `Derived maintenance and handoff preparation` 提供血缘解释。

#### 5.3.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能来源是否清楚 | pass | 直接承接 `FR-ART-009~012` |
| 候选对象是否有功能来源 | pass | lineage / impact / trace 候选均有业务来源 |
| 接缝是否清楚 | pass | 上接 fact / version,下接 baseline / consumption / derived |
| 非职责是否清楚 | pass | 已排除 trace / tool / event 直接拥有 lineage |
| 是否越界到详细设计 | pass | 未展开 relation taxonomy 和 query 实现 |

### 5.4 Artifact baseline management

#### 5.4.1 本部分职责

围绕正式 `Artifact version` 形成受控版本集合和冻结语境,把可审查、可引用、可回溯的 `Artifact baseline` 作为本仓正式 truth 维护下来,并防止 project baseline、release note、governance decision 或 archive package 反向替代 baseline truth。

#### 5.4.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 形成受控版本集合 | confirmed versions、membership intent、scope context | `ArtifactBaselineMembership` | 建立正式成员集合语义 | Step 6 / Step 8 |
| 冻结 Artifact baseline | candidate set、freeze context、review / governance clues | `ArtifactBaseline` | 形成可引用 baseline truth | Step 6 / Step 8 / Step 9 |
| 保留历史 baseline 回溯 | frozen baseline、member history、supersede context | historical baseline reference | 审计和跨仓消费可定位当时冻结集合 | Step 6 / Step 8 |
| 向 work / governance / archive / sync 提供 baseline backref | baseline truth | baseline summaries / references | 下游不得私自复制或补造 baseline | Step 7 / Step 8 |

#### 5.4.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `Truth Write Services` | application service family | 编排 baseline candidate、freeze 和 supersede | Step 7 / Step 8 |
| `Truth Read / Consumption Services` | application service family | 提供 baseline 读取、历史定位和回指解释 | Step 7 / Step 8 |
| `Artifact Truth Domain Core` | domain model family | 承载 baseline truth 与 membership 边界 | Step 6 |
| `Truth Persistence Ports` | persistence port family | 保存 baseline truth、成员集合和历史线索 | Step 7 / 详细设计 |

#### 5.4.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ArtifactBaseline` | Step 6 独立成节 |
| Truth / State | `ArtifactBaselineMembership` | Step 6 独立成节 |
| Policy / Invariant | `ArtifactBaselinePolicy` | Step 6 独立成节 |
| Projection / Read model | `ArtifactBaselineSummaryView` | Step 6 独立成节 |
| Audit / History | `ArtifactBaselineChangeRecord` | Step 6 独立成节 |

#### 5.4.5 本部分不承担什么

不拥有项目发布计划、治理裁决、归档包正文、同步副本清单或外部版本集合定义;不把 current versions list、临时清单或 report row 当成正式 baseline。

#### 5.4.6 与其他部分的接缝

消费 `Artifact version management` 和 `Artifact lineage management` 提供的正式版本和血缘解释,向 `Artifact review and responsibility context`、`Artifact consumption and traceability`、`Derived maintenance and handoff preparation` 输出可回指 baseline truth。

#### 5.4.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能来源是否清楚 | pass | 直接承接 `FR-ART-013~016` |
| 候选对象是否有功能来源 | pass | baseline / membership / history 均有明确来源 |
| 接缝是否清楚 | pass | 上接 version / lineage,下接 consumption / derived / handoff |
| 非职责是否清楚 | pass | 已排除 project / governance / archive 替代 baseline |
| 是否越界到详细设计 | pass | 未展开成员 carrier、冻结协议或持久化实现 |

### 5.5 Artifact intake convergence

#### 5.5.1 本部分职责

把人工提交、工作 / 过程产出、治理证据、外部内容来源和其他正式边界输入收束为可审查的 `Artifact` 输入语境,并在进入 fact / version / lineage / baseline 主线之前先完成来源解释、边界判断和最小可接受性判断。

#### 5.5.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 收束人工 / 外部 / 相邻仓输入 | sync request、adjacent refs、content source clues | `ArtifactIntakeContext` | 建立统一 intake 语境 | Step 6 / Step 8 |
| 解析输入来源与正文边界 | source ref、body location、safe summary、definition source | accepted / pending / unresolved input state | 保持外部正文与 Artifact truth 分离 | Step 6 / Step 8 / Step 10 |
| 形成可审查提交记录 | intake context、actor / reason clues、initial evidence | `ArtifactSubmissionRecord` | 为 review / responsibility 和 fact 建立前置依据 | Step 6 / Step 8 |
| 向 fact / version / lineage 写路径移交正式输入 | resolved intake state | truth-write-ready input | 未收束输入不得越过本部分直接进入主线 | Step 7 / Step 8 |

#### 5.5.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `Artifact Sync Entry` | inbound family | 承接同步提交、管理入口和受控人工动作 | Step 7 / Step 8 |
| `Artifact Async Intake` | inbound family | 承接异步来源送达和变化输入 | Step 7 / Step 8 |
| `Intake / Review Boundary Services` | application service family | 编排来源解析、正文边界判断和提交成立 | Step 7 / Step 8 |
| `Reference / Snapshot / Body Source Ports` | boundary port family | 提供 source ref、safe summary、snapshot 和内容位置线索 | Step 7 / 详细设计 |

#### 5.5.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ArtifactIntakeContext` | Step 6 独立成节 |
| Truth / State | `ArtifactSubmissionRecord` | Step 6 独立成节 |
| Policy / Invariant | `ArtifactIntakePolicy` | Step 6 独立成节 |
| Reference / Boundary | `ArtifactContentSourceRef`、context refs | Step 6 独立成节 |
| Audit / History | `ArtifactInputResolutionRecord` | Step 6 独立成节 |

#### 5.5.5 本部分不承担什么

不直接形成正式 `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink` 或 `ArtifactBaseline`;不拥有外部正文生命周期;不把 archive / observability / sync / workspace 侧材料当作输入真相。

#### 5.5.6 与其他部分的接缝

向 `Artifact fact management`、`Artifact version management` 和 `Artifact lineage management` 提供已收束输入,并依赖 `External reference and local mirror support` 提供定义来源、工作 / 过程 / 治理语境和外部正文线索。

#### 5.5.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能来源是否清楚 | pass | 直接承接 `FR-ART-001~004`、`BR-ART-001~005` |
| 候选对象是否有功能来源 | pass | intake context / submission record 都直接来自输入收束职责 |
| 接缝是否清楚 | pass | 只向 truth 主线移交已收束输入 |
| 非职责是否清楚 | pass | 已排除外部正文 ownership 和主线业务写入 |
| 是否越界到详细设计 | pass | 未展开协议、DTO 或 adapter 细节 |

### 5.6 Artifact review and responsibility context

#### 5.6.1 本部分职责

保证审查、负责、维护和协作理解都围绕同一 `Artifact fact / version / baseline` 成立,把 review、responsibility 和解释语境从 work state、governance decision、conversation card 或 workspace view 中剥离出来,作为 Artifact 主线的正式支撑部分。

#### 5.6.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 锚定 review / responsibility 语境 | fact / version / baseline refs、actor / role clues、reason | `ArtifactReviewAnchor` | 保证审查面对同一 truth 锚点 | Step 6 / Step 8 |
| 形成责任分配与维护语境 | review anchor、work / governance / process context | `ArtifactResponsibilityAssignment` | 建立后续维护和责任解释基础 | Step 6 / Step 8 |
| 输出审查与责任解释给消费方 | review / responsibility state | review summary / backref | 下游协作不必私补责任语义 | Step 6 / Step 7 |
| 保留 review / responsibility trace | key review changes、maintenance decisions | review trace history | 审计和争议复盘可回看依据 | Step 6 / Step 8 |

#### 5.6.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `Truth Read / Consumption Services` | application service family | 提供与 truth 锚点一致的审查 / 责任读取面 | Step 7 / Step 8 |
| `Intake / Review Boundary Services` | application service family | 编排 review anchor、responsibility context 和解释结果 | Step 7 / Step 8 |
| `Artifact Truth Domain Core` | domain model family | 保护 review / responsibility 只能附着在正式 truth 上 | Step 6 |
| `Event / Audit / Handoff Relay Ports` | audit / handoff port family | 输出 review trace 和协作解释线索 | Step 7 / 详细设计 |

#### 5.6.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ArtifactReviewAnchor` | Step 6 独立成节 |
| Truth / State | `ArtifactResponsibilityAssignment` | Step 6 独立成节 |
| Policy / Invariant | `ArtifactReviewPolicy` | Step 6 独立成节 |
| Projection / Read model | `ArtifactReviewSummaryView` | Step 6 独立成节 |
| Audit / History | `ArtifactReviewTraceRecord` | Step 6 独立成节 |

#### 5.6.5 本部分不承担什么

不拥有 GlobalMember、role、project assignee、governance approver 或 process waiting truth;不把 conversation display、workspace card、console list row 当 review anchor。

#### 5.6.6 与其他部分的接缝

依赖 `Artifact fact management`、`Artifact version management` 和 `Artifact baseline management` 提供 truth 锚点,并向 `Artifact consumption and traceability` 和 `Derived maintenance and handoff preparation` 输出审查 / 责任解释线索。

#### 5.6.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能来源是否清楚 | pass | 直接承接 `FR-ART-003`、`FR-ART-007`、`FR-ART-015`、`FR-ART-019` |
| 候选对象是否有功能来源 | pass | review anchor / responsibility assignment 均有明确职责来源 |
| 接缝是否清楚 | pass | 上接 truth 主线,下接 consumption / derived explanation |
| 非职责是否清楚 | pass | 已排除 identity / work / governance 主体 truth |
| 是否越界到详细设计 | pass | 未展开 actor schema、role contract 或审批流程 |

### 5.7 Automation output control boundary

#### 5.7.1 本部分职责

让 AI member、runtime、capability 和 tool result 只能以“候选输入、候选修订、候选关系线索”的方式进入 Artifact 主线,确保自动化产出存在本身不自动形成正式 fact、version、lineage 或 baseline。

#### 5.7.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 接收自动化产出候选输入 | runtime / capability / tool result clues | `AutomationArtifactInput` | 建立自动化来源边界语义 | Step 6 / Step 8 |
| 判断自动化产出可否进入主线 | automation input、definition source、content source、review clues | accepted / pending / rejected automation state | 避免自动化结果绕过正式收束 | Step 6 / Step 8 / Step 10 |
| 把自动化关系线索交给 version / lineage | automation source、candidate relation、evidence clues | candidate version / lineage intent | 自动化只提供线索,不直接拥有 truth | Step 7 / Step 8 |
| 保留自动化边界审计 | automation input changes、resolution result | automation audit record | 复盘时可解释来源、依据和拒绝原因 | Step 6 / Step 8 |

#### 5.7.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `Artifact Async Intake` | inbound family | 承接自动化产出和外部变化输入 | Step 7 / Step 8 |
| `Intake / Review Boundary Services` | application service family | 编排自动化候选输入的边界检查和收束判断 | Step 7 / Step 8 |
| `Reference / Snapshot / Body Source Ports` | boundary port family | 提供 automation source、definition 和 content 线索 | Step 7 / 详细设计 |
| `Event / Audit / Handoff Relay Ports` | audit / handoff port family | 输出自动化边界审计和失败解释线索 | Step 7 / 详细设计 |

#### 5.7.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `AutomationArtifactInput` | Step 6 独立成节 |
| Policy / Invariant | `AutomationBoundaryPolicy` | Step 6 独立成节 |
| Reference / Boundary | `AutomationSourceRef` | Step 6 独立成节 |
| Audit / History | `AutomationIntakeAuditRecord` | Step 6 独立成节 |

#### 5.7.5 本部分不承担什么

不拥有 runtime execution、tool invocation、capability registry、model trace 或 observability log truth;不直接形成 final fact / version / lineage / baseline。

#### 5.7.6 与其他部分的接缝

依赖 `External reference and local mirror support` 提供来源解析和定义线索,向 `Artifact intake convergence`、`Artifact fact management`、`Artifact version management` 和 `Artifact lineage management` 提供已判断的自动化候选输入或关系线索。

#### 5.7.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能来源是否清楚 | pass | 直接承接 `FR-ART-002`、`FR-ART-006`、`FR-ART-010` |
| 候选对象是否有功能来源 | pass | automation input / source / audit 均有明确来源 |
| 接缝是否清楚 | pass | 只向主线提供候选输入,不直接写 truth |
| 非职责是否清楚 | pass | 已排除 runtime / capability truth ownership |
| 是否越界到详细设计 | pass | 未展开异步协议、tool payload 或 replay 机制 |

### 5.8 Artifact consumption and traceability

#### 5.8.1 本部分职责

把 `Artifact fact / version / lineage / baseline` 变成相邻仓、SDK、console、workspace、archive、observability 和 sync 能稳定消费且可回指的正式读取面,同时维持“消费不迁移 truth ownership”的 traceability 语义。

#### 5.8.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 提供安全 consumable reference | fact / version / lineage / baseline refs、visibility context | `ConsumableArtifactReference` | 建立稳定消费锚点 | Step 6 / Step 7 |
| 维护消费回指 | consumer context、selected truth anchor、read reason | `ArtifactConsumptionBackref` | 可解释消费到底基于哪份 truth | Step 6 / Step 8 |
| 输出正式读侧解释 | truth state、review / responsibility clues、availability clues | `ArtifactReadSurfaceView` | 对外给出 readable / unavailable / stale 等解释 | Step 6 / Step 7 / Step 10 |
| 记录 traceability 与 audit backref | read / export / handoff action、consumer ref | `ArtifactTraceRecord` | 支撑审计复盘和跨仓解释 | Step 6 / Step 8 |

#### 5.8.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `Truth Read / Consumption Services` | application service family | 编排正式读取、消费锚点和 backref 输出 | Step 7 / Step 8 |
| `Projection / Preview / Report Read Models` | read model family | 提供对外消费所需的安全视图和摘要 | Step 7 / 详细设计 |
| `Event / Audit / Handoff Relay Ports` | audit / handoff port family | 输出 trace、audit 和 handoff explain 线索 | Step 7 / 详细设计 |

#### 5.8.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ConsumableArtifactReference` | Step 6 独立成节 |
| Truth / State | `ArtifactConsumptionBackref` | Step 6 独立成节 |
| Policy / Invariant | `ArtifactReadVisibilityPolicy`、`ArtifactTraceabilityPolicy` | Step 6 独立成节 |
| Projection / Read model | `ArtifactReadSurfaceView` | Step 6 独立成节 |
| Reference / Boundary | `AdjacentConsumerRef` | Step 6 独立成节 |
| Audit / History | `ArtifactTraceRecord` | Step 6 独立成节 |

#### 5.8.5 本部分不承担什么

不拥有 SDK / console / workspace / archive / observability / sync 的私有状态和副本 truth;不把 report、preview、search row 或 export file 直接当作核心 truth;不替下游定义其产品状态机。

#### 5.8.6 与其他部分的接缝

读取 `Artifact fact management`、`Artifact version management`、`Artifact lineage management`、`Artifact baseline management` 提供的核心 truth,消费 `Artifact review and responsibility context` 的解释语义,并与 `Derived maintenance and handoff preparation`、`External reference and local mirror support` 协作提供安全读面。

#### 5.8.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能来源是否清楚 | pass | 直接承接 `FR-ART-017~020` |
| 候选对象是否有功能来源 | pass | consumable reference / backref / trace 都有明确来源 |
| 接缝是否清楚 | pass | 只读核心 truth,不反写主线 |
| 非职责是否清楚 | pass | 已排除下游副本 ownership |
| 是否越界到详细设计 | pass | 未展开 query contract、visibility rule schema 或 export protocol |

### 5.9 Derived maintenance and handoff preparation

#### 5.9.1 本部分职责

围绕正式 Artifact truth 维护 projection、preview、report、reconciliation 和 archive / observability / sync handoff 材料,把复杂消费、解释、对账和交接留在只读派生 / 后台维护路径中完成,同时确保这些材料可重建、可延迟、不可反写核心 truth。

#### 5.9.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 重建 preview / report / projection | core truth、mirror data、review / responsibility clues | `ArtifactPreviewView`、`ArtifactReportView` | 产生只读派生结果 | Step 6 / Step 8 |
| 维护 reconciliation 与 refresh | core truth、derived state、mirror refresh result | `ArtifactReconciliationReport` | 暴露 stale / rebuilding / failed / retryable | Step 6 / Step 8 / Step 10 |
| 准备 archive / observability / sync handoff | selected truth anchor、derived explanation、target refs | handoff-ready material | 形成可交接但不反写的材料 | Step 7 / Step 8 |
| 维护派生状态可重建性 | projection state、refresh lag、job outcome | `ArtifactDerivedViewState` | 后台失败不污染 core truth | Step 6 / Step 9 / Step 10 |

#### 5.9.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `Artifact Operations Jobs` | operations family | 触发 rebuild、refresh、reconciliation 和 handoff preparation | Step 7 / Step 8 |
| `Derived Maintenance Services` | application service family | 编排派生维护、对账和交接准备 | Step 7 / Step 8 |
| `Projection / Preview / Report Read Models` | read model family | 承载 preview、report 和 reconciliation 读模型 | Step 7 / 详细设计 |
| `Derived Persistence / Handoff Preparation Ports` | persistence / handoff port family | 保存 derived state 和 handoff 材料 | Step 7 / 详细设计 |

#### 5.9.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ArtifactDerivedViewState` | Step 6 独立成节 |
| Projection / Read model | `ArtifactPreviewView`、`ArtifactReportView`、`ArtifactReconciliationReport` | Step 6 独立成节 |
| Reference / Boundary | handoff target refs | Step 6 独立成节 |
| Audit / History | `ArtifactHandoffRecord` | Step 6 独立成节 |

#### 5.9.5 本部分不承担什么

不形成新的 `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink` 或 `ArtifactBaseline`;不把派生报告、archive package、observability entry 或 sync copy 回写为主线 truth;不要求外围交接完成才能视为核心同步成功。

#### 5.9.6 与其他部分的接缝

读取 `Artifact consumption and traceability` 暴露的安全读面和 backref,依赖 `External reference and local mirror support` 提供快照 / mirror 数据,并向 archive、observability、sync 等边界输出交接材料。

#### 5.9.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能来源是否清楚 | pass | 直接承接架构中的派生读侧与维护上下文 |
| 候选对象是否有功能来源 | pass | derived state / preview / report / reconciliation 都有明确来源 |
| 接缝是否清楚 | pass | 只读主线 truth,向外围输出交接材料 |
| 非职责是否清楚 | pass | 已排除派生反写核心 truth |
| 是否越界到详细设计 | pass | 未展开 job runner、handoff protocol 或存储实现 |

### 5.10 External reference and local mirror support

#### 5.10.1 本部分职责

承载定义来源、工作 / 过程 / 治理语境、外部正文位置、自动化来源和邻接消费方相关的引用、snapshot、safe summary、本地 mirror 和解析状态,为 intake、review、consumption 和 derived maintenance 提供稳定的外部边界支持。

#### 5.10.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 维护外部引用与 safe summary | external refs、snapshot clues、definition source | stable local reference / summary | 提供边界内可消费的外部线索 | Step 6 / Step 7 |
| 维护解析与刷新状态 | ref resolution result、refresh trigger、source availability | `ExternalReferenceResolutionState` | 暴露 pending / unresolved / stale / waiting | Step 6 / Step 8 / Step 10 |
| 为 intake / review / automation 提供来源解释 | context refs、body location、automation source | resolved or degraded mirror data | 避免主线自行补造外部 truth | Step 7 / Step 8 |
| 为 derived / handoff 提供本地 mirror 支持 | snapshot / refresh state、adjacent context clues | mirror-backed derived support | 派生和交接可以解释缺失与降级 | Step 6 / Step 8 |

#### 5.10.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `Reference / Snapshot / Body Source Ports` | boundary port family | 提供外部定义、上下文、内容位置和自动化来源接缝 | Step 7 / 详细设计 |
| `Projection / Preview / Report Read Models` | read model family | 保存本地 mirror 可见状态和 refresh 结果 | Step 7 / 详细设计 |
| `Derived Persistence / Handoff Preparation Ports` | persistence / handoff port family | 保存 snapshot、mirror 和 refresh 结果 | Step 7 / 详细设计 |

#### 5.10.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ExternalReferenceResolutionState` | Step 6 独立成节 |
| Policy / Invariant | `ExternalReferenceValidityPolicy` | Step 6 独立成节 |
| Reference / Boundary | `ArtifactDefinitionRef`、`ArtifactWorkContextRef`、`ArtifactProcessContextRef`、`ArtifactGovernanceContextRef` | Step 6 独立成节 |
| Audit / History | `ExternalMirrorRefreshRecord` | Step 6 独立成节 |

#### 5.10.5 本部分不承担什么

不拥有方法定义正文、工作 / 过程 / 治理状态 truth、外部正文生命周期、runtime execution truth 或下游消费方真相;也不允许 local mirror 替代正式 Artifact truth。

#### 5.10.6 与其他部分的接缝

为 `Artifact intake convergence`、`Artifact review and responsibility context`、`Automation output control boundary`、`Artifact consumption and traceability` 和 `Derived maintenance and handoff preparation` 提供引用解析、快照、safe summary、降级和刷新状态。

#### 5.10.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能来源是否清楚 | pass | 直接承接架构中的本地索引 / 投影 / 引用层 |
| 候选对象是否有功能来源 | pass | resolution state / context refs / mirror refresh 都有明确来源 |
| 接缝是否清楚 | pass | 只为其余部分提供边界支持,不写核心 truth |
| 非职责是否清楚 | pass | 已排除外部 truth ownership 和 mirror 反客为主 |
| 是否越界到详细设计 | pass | 未展开 snapshot schema、resolver API 或 refresh scheduler |

---

## 6. 总体边界说明与 Step 6 门禁

### 6.1 总体边界说明

- `Artifact fact / version / lineage / baseline` 是核心 truth 主线,其余 6 个组成部分只能承接输入、解释责任、控制自动化边界、提供消费读面、维护派生材料或支撑外部引用。
- `Artifact intake convergence`、`Artifact review and responsibility context`、`Automation output control boundary` 都是“主线前后的边界与语境部分”,不是第二 truth center。
- `Artifact consumption and traceability` 负责对外稳定读取和回指,但不迁移 ownership。
- `Derived maintenance and handoff preparation` 与 `External reference and local mirror support` 都允许最终一致、刷新延迟和降级状态,但禁止改变核心 truth 结论。

### 6.2 Step 6 展开门禁

- Step 5 的对象发现线索只是候选池,不等于最终对象定义。
- Step 6 必须从本文件 §4.1 和 §5 逐项筛选正式关键对象,并为每个对象标明所属主要组成部分。
- API、repository、port、trigger、DTO、database table、HTTP body、event payload 和 job runner 默认不作为 Step 6 领域对象展开。
- 如果 Step 8 处理流或 Step 9 状态机引用某个对象,Step 6 必须能找到该对象的正式骨架。
- 外部正文、runtime output、archive package body、observability body、workspace / sync 私有副本不得作为任何主要组成部分的正式 truth 对象进入 Step 6。

### 6.3 跨组成部分闭环审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| fact / version / lineage / baseline 是否独立成正式核心组成部分 | pass | 与架构 4 核心子域一一对应 |
| intake / review / automation 是否误写成核心 truth owner | pass | 已明确只承接输入和边界语境 |
| consumption 是否被误写成下游副本 ownership | pass | 只提供 consumable reference 和 backref |
| derived / handoff 是否被误写成业务写源 | pass | 已明确只读派生、可重建、不可反写 |
| external mirror 是否替代外部 truth 或核心 truth | pass | 只提供 snapshot / safe summary / resolution state |
| 对象候选是否存在明显重复归属冲突 | pass | 候选对象均能回指单一主要组成部分 |
| 后续展开位置是否悬空 | pass | 每个代码主体和候选对象都已标明 Step 6 / 7 / 8 / 9 / 详细设计 |

### 6.4 后续展开一致性检查结论

- Step 6 将以本文件的 10 个主要组成部分作为对象候选池来源,不再重新发明新的业务主语。
- Step 7 必须沿用本文件列出的代码主体 / 模块名,把接口骨架放回正确的组成部分和实现分层。
- Step 8 必须保持同步 / 异步 / 后台路径分离,不能让 derived job 或 external refresh 反向推进核心 truth。
- Step 9 必须把核心 truth 状态与 derived / mirror / handoff 状态分离,不能混成单一状态机。

---

## 7. 当前文档问题诊断

| 旧问题 / 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `02-概要设计.md` 偏解释型材料 | 容易把术语、存储心智、预览展示和外部正文混成结构主线 | 先收稳 10 个业务组成部分,再让后续对象 / 接口 / 流程回指这些组成部分 |
| 只看到四条核心能力闭环 | 容易忽视输入、审查、自动化边界、消费回指和 mirror 支撑 | 在 4 核心 truth 之外补齐 6 个支撑组成部分 |
| 入口 / 异步 / 后台运行单元容易被误当业务主语 | 会把运行形态误写成系统结构 | 保留 Step 4 的运行主体,但不把它们当正式主要组成部分 |
| search / preview / report / archive / observability 容易抢占主线 | 派生与交接能力会反向塑造 truth center | 独立为 derived / handoff 与 consumption / traceability 两个支撑组成部分 |

---

## 8. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §5 “主要组成部分、职责与边界”引用本文件 §3.2 的组成部分总表和 §4.1 的对象发现维度表。
- §5 引用本文件 §4.2 的各部分交互总图。
- §5 按本文件 §5 的 10 个主要组成部分生成正式章节。
- Step 6 “关键对象轮廓”必须引用本文件 §6.2 的门禁,从对象候选池正式筛选。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把输入收束、审查责任和自动化边界再压缩成一个组成部分 | A. 合并;B. 保持 3 个支撑组成部分 | B | 三者输入来源、风险边界和后续对象池明显不同,合并会让 Step 6 / 8 串线 | 已确认采用 B |
| 是否把 consumption 与 derived / handoff 合并 | A. 合并;B. 分开 | B | 读取 / 回指与派生维护 / 交接的状态语义不同,分开更利于 Step 8 / 9 | 已确认采用 B |
| 是否把 local mirror support 并入 intake | A. 并入;B. 独立 | B | mirror / snapshot / resolution state 同时服务 intake、review、consumption 和 derived | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步没有新增阻塞 Step 6 的待确认事项。Step 6 需要做的工作是从本文件候选池中正式筛对象,而不是重新调整主要组成部分划分。

---

## 10. 进入下一步条件

- 已明确 `L1-artifact` 由哪些主要组成部分构成。
- 已明确每个主要组成部分承担什么、不承担什么。
- 已明确每个主要组成部分包含哪些代码主体 / 模块,且后续展开位置没有悬空。
- 已形成对象发现维度表、各部分交互总图和每个组成部分的对象发现线索。
- 已完成跨组成部分闭环审计,没有 unresolved 冲突。
- 对象字段、接口 schema、处理流细节、状态枚举、持久化实现和配置项仍保留给后续 Step 独立展开。
- 可以进入 Step 6 “关键对象轮廓”。
