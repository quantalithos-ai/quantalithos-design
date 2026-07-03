# Step 3. 职责边界

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 3
> 回填章节: `01-架构设计.md` §4 职责边界
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-artifact` 在全局职责分工中的承担范围,收稳“做什么 / 不做什么 / 易混淆职责 / 边界红线”。本步不画系统上下文图,不展开限界上下文、容器部署、数据所有权矩阵、接口协议或实现层依赖。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_01_requirement_baseline.md` | Step 1 已完成 | 承接需求基线、硬约束和旧架构残留诊断。 |
| `design-calibration/01_arch_step_02_goals_constraints.md` | Step 2 已完成 | 承接架构目标、不可变约束、取舍和非目标。 |
| `projects/L1-artifact/00-需求文档.md` §2 / §6 / §7 / §10 / §11 / §14 / §15 | 已重建 | 校验职责边界、依赖、核心闭环、禁止行为、数据归属、验收和风险。 |
| 旧 `projects/L1-artifact/01-架构设计.md` | 旧 Draft | 仅作为旧职责、旧枚举、旧存储和旧技术假设诊断来源。 |
| `standards/document/架构设计书写规范.md` §4.4 | 已读取 | 控制职责边界表和边界红线写法。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、flow、Step 2、架构 SOP Step 3 和书写规范 4.4 | done | 本文件 §2 |
| 回答做什么、不做什么、易混淆职责和隐式行为问题 | done | 本文件 §4 |
| 诊断旧 `01-架构设计.md` 中职责串线点 | done | 本文件 §5 |
| 选择按职责归属拆分,不提前写上下文图或子域 | done | 本文件 §7 |
| 输出职责边界表、做 / 不做清单和边界红线 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 3 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 这个仓具体做什么?

`L1-artifact` 正式承担的职责是维护可审计制品事实,并让相邻仓围绕同一份 Artifact truth 协作。职责不按“上传、查询、存储、预览、报表”这类功能或实现划分,而按仓级真相和边界划分:

| 职责 | 判断 |
|---|---|
| 承载 Artifact fact truth | 做。平台产出、自动化产出和审查对象必须先进入正式制品事实入口。 |
| 承载 Artifact version truth | 做。同一 Artifact 的修订、候选、替代、当前引用和历史版本必须形成稳定版本事实。 |
| 承载 Artifact lineage truth | 做。来源、影响、替代、依赖和追溯语义必须围绕正式 fact / version 收束。 |
| 承载 Artifact baseline truth | 做。受控 Artifact version 集合的候选、冻结、历史回溯和跨仓消费边界属于本仓职责。 |
| 承载 consumable Artifact truth backref | 做。下游消费、展示、封存、观测和同步后必须能回指正式 Artifact truth。 |
| 承载制品审查、责任和协作消费锚点 | 做。审查和责任语境需要锚定同一 Artifact fact / version / lineage / baseline。 |
| 区分正式 truth、快照摘要、外部引用和禁止保存正文 | 做。否则外部正文、运行材料、视图材料和消费副本会污染 Artifact truth。 |
| 维护派生读侧、预览、搜索、报告、归档和观测消费材料 | 做。它们可以服务发现和消费,但只能从 Artifact truth 派生。 |

### 4.2 这个仓具体不做什么?

`L1-artifact` 不承担相邻真相域职责,也不保存相邻仓或外部系统正文:

| 非职责 | 归属 |
|---|---|
| Project、WorkItem、Iteration、backlog、dependency、blocker、工作状态 truth | `L1-work` |
| ProcessTemplate、ProcessInstance、Activity、checkpoint、recovery、过程执行 truth | `L1-process` |
| Gate decision、Policy、AIIA / SoA 治理结论、Nonconformity corrective loop | `L1-governance` |
| conversation space、turn、review discussion、artifact preview 展示状态 | `L1-conversation` / 产品入口 |
| workspace 聚合视图、筛选状态、UI 布局、console 展示状态 | `L1-workspace` / `L5-console` |
| audit log store、trace storage、metrics、alert stream、观测物理存储 | `L4-observability` |
| archive package、长期保留策略、恢复编排、跨域快照包 | `L4-archive` |
| MethodContent、WorkProductDefinition、Artifact kind 定义来源、标准正文、模板正文 | `L3-method-library` 等定义域 |
| runtime 执行、工具调用、模型上下文、policy cache、plan item progress | 运行与能力层 |
| capability registration、tool adapter、provider contract、工具调用结果 truth | `L3-capability-hub` |
| Git、S3、inline、URL、数据库、搜索引擎、向量库、外部审计平台的基础设施 truth | 后续技术 / 配置 / 外部系统边界 |

### 4.3 哪些能力看起来相关但必须属于其他仓?

| 易混淆能力 | 必须归属 / 边界 |
|---|---|
| Work output vs Artifact fact | 工作输出和工作状态属于 Work;只有经正式收束后的制品事实属于 Artifact。 |
| Activity output vs Artifact fact | 过程 activity 的执行状态属于 Process;输出成为制品事实后才归 Artifact。 |
| Governance evidence / AIIA / SoA conclusion vs Artifact body / version | 治理结论属于 Governance;评估文档、证据正文和版本事实属于 Artifact。 |
| Artifact kind definition vs Artifact fact | 类型定义来源属于 Method Library;具体制品事实和版本归 Artifact。 |
| runtime trace / tool result vs Artifact lineage | trace 和工具结果只能提供线索;正式 lineage 必须由 Artifact 收束。 |
| archive package vs Artifact baseline | 归档包和恢复编排属于 Archive;baseline truth 属于 Artifact。 |
| observability ledger vs Artifact audit backref | 物理日志、指标和 trace store 属于 Observability;Artifact 只维护可消费回指和解释边界。 |
| workspace / console view vs consumable Artifact truth | 视图和同步状态属于产品入口;正式可消费回指归 Artifact。 |
| content storage backend vs Artifact truth owner | 存储后端只是承载方式候选,不能成为 Artifact truth owner。 |
| search / projection / report vs Artifact truth | 派生读侧可以发现和展示,不能成为业务写源。 |

### 4.4 哪些行为绝不能隐式发生?

| 禁止隐式行为 | 原因 |
|---|---|
| 附件、日志、workspace 视图、archive package、observability record 或运行材料隐式成为 Artifact fact truth | 会让派生材料替代正式事实入口。 |
| 新内容、候选修订、自动化再生成或下游状态隐式覆盖 Artifact version truth | 会破坏历史版本、审查责任和下游引用。 |
| runtime trace、tool result、model context、event stream 或私有链路隐式创建 Artifact lineage truth | 会让血缘脱离正式 fact / version 锚点。 |
| 发布说明、治理裁决、项目状态、归档包或临时清单隐式形成 Artifact baseline truth | 会让受控版本集合漂移。 |
| SDK、console、sync、workspace、report、archive 或 observability 隐式复制、迁移、反推或反写 Artifact truth | 会让下游消费变成第二 truth source。 |
| work、process、governance、conversation、workspace、archive、observability、method-library、runtime 或 capability-hub 的 truth 隐式进入 Artifact truth | 会打穿相邻仓职责边界。 |
| 外部正文、运行材料正文、视图正文、事件正文、归档包正文、观测正文或消费方私有材料正文隐式入仓 | 会让 Artifact 膨胀为外部正文总仓。 |
| `L0-bus` 隐式承载 Artifact body、version set、lineage graph、baseline members 或下游副本作为 truth | 会让事件协作替代 truth 存储。 |
| 除 `L0-core` 外把 sibling repo 隐式写成编译期依赖 | 会破坏全局依赖裁剪和 L1 真相域平权。 |
| query、projection、report、search、preview、reconciliation、archive preparation 或 maintenance 隐式写业务 Artifact truth | 会让读 / 维护路径反写真相。 |

### 4.5 哪些边界如果不写清,后续设计最容易串线?

最容易串线的边界是:

1. Artifact fact 与附件、日志、视图、归档包、运行材料。
2. Artifact version 与 current latest、候选修订、自动化再生成、下游状态。
3. Artifact lineage 与 runtime trace、tool result、event stream、observability record。
4. Artifact baseline 与 project baseline、governance decision、archive package、release note。
5. Consumable Artifact truth 与 SDK、console、sync、workspace、report 和下游私有状态。
6. Artifact kind / work product definition 与具体 Artifact fact / version。
7. Artifact audit backref 与 observability audit ledger。
8. Content storage backend 与 Artifact truth owner。

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` §1~§3 | 把 Artifact kind、relation kind、hash、content backend、lineage 查询和 baseline pin 混写为架构目标 / 职责。 | 容易把对象细节、技术机制和旧指标直接写成职责。 | 本步只按做 / 不做 / 易混淆职责收束。 |
| 旧 §4 | 把 process、work、governance、archive、observability 画成外部关系并附带具体输出。 | 容易让消费方或协作方变成 truth owner。 | 本步只固定职责归属,上下文关系留到 Step 4。 |
| 旧 §5 | 直接给 Metadata、Lineage、Freeze、Dataset、Content 上下文。 | 这是限界上下文划分,不是职责边界。 | 后续 Step 5 独立收敛。 |
| 新版需求 §10 / §11 | 边界规则和数据归属完整但分散。 | 后续架构若不集中重述,详细设计仍可能把派生材料或相邻仓正文写入 Artifact truth。 | 本步集中形成职责边界表和红线清单。 |

---

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 职责表达 | Artifact metadata、relation graph、baseline、dataset、content adapter 与技术草案混写。 | 汇总为 Artifact fact、version、lineage、baseline、consumable backref 和派生消费职责。 | 对齐架构规范 4.4。 |
| 不做事项 | 旧文档只覆盖编辑器、评审决策、过程编排、UI 预览等部分边界。 | 明确排除 work、process、governance、conversation、workspace、observability、archive、method-library、runtime、capability 和基础设施 truth。 | 对齐新版需求。 |
| 易混淆职责 | 分散在目标、依赖和技术段落。 | 单独列出 work output、activity output、governance evidence、runtime trace、archive package、content backend 等混淆点。 | 防止后续设计串仓。 |
| 边界红线 | 分散在需求规则和验收否决项。 | 集中列出不得隐式发生的行为。 | 便于 Step 4 之后继续承接。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只写“Artifact 做制品管理” | 简短。 | 会把 fact、version、lineage、baseline 和 consumption backref 压扁成泛附件管理。 | 不采用。 |
| 方案 B: 按做 / 不做 / 易混淆职责拆分 | 可审查,能防串线。 | 文档更长。 | 采用。 |
| 方案 C: 在职责边界中同时画上下文图 | 读者直观。 | 越过 Step 4,混淆职责与外部关系。 | 不采用。 |
| 方案 D: 把搜索、预览、projection、report、归档和观测全部列为非职责 | 范围最小。 | 会丢失 Artifact 对下游消费和派生读侧的边界承接。 | 不采用,改写成派生消费职责和当前取舍。 |

### 7.1 待确认问题的方案选择

#### 是否把 read model / search / report 写成 Artifact 职责?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 完全排除。 | 会丢失需求中的搜索、预览、投影、报表和消费友好输出线索。 |
| 方案 B | 写成派生消费职责,但明确不得反写真相。 | 既承接需求,又保护 Artifact truth。 |

推荐方案 B。

#### 是否把 content storage backend 写成 Artifact 职责?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前职责固定 Git / S3 / inline / URL 或数据库存储。 | 会把旧技术方案写成职责。 |
| 方案 B | 当前职责只固定 Artifact truth 与外部正文 / 存储后端边界。 | 保持职责清晰,技术机制后续再定。 |

推荐方案 B。

#### 是否把 governance baseline / project baseline 写成 Artifact 职责?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 任何 baseline 均归 Artifact。 | 会把治理裁决、项目状态或归档包替代 Artifact baseline truth。 |
| 方案 B | Artifact 只拥有 Artifact version 受控集合 truth,其他 baseline 语境只可引用或消费。 | 对齐需求边界。 |

推荐方案 B。

---

## 8. 结构化中间产物

### 8.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| Artifact fact truth 承载 | 做 | 这是本仓作为可审计制品真相仓的入口职责。 |
| Artifact version truth 承载 | 做 | 稳定版本事实必须由本仓维护,否则引用和替代语义会漂移。 |
| Artifact lineage truth 承载 | 做 | 来源、影响、替代和依赖关系必须围绕正式 fact / version 收束。 |
| Artifact baseline truth 承载 | 做 | 受控 Artifact version 集合不能由项目、治理或归档语境替代。 |
| Consumable Artifact truth backref 承载 | 做 | 下游消费后必须能回指正式 fact、version、lineage 或 baseline。 |
| 制品审查、责任和协作消费锚点承载 | 做 | 审查和责任语境需要锚定同一 Artifact truth。 |
| Artifact truth、快照摘要、外部引用和禁止正文分层 | 做 | 若不显式分层,外部正文和消费副本会污染本仓 truth。 |
| 派生读侧、预览、搜索、报告、归档和观测消费材料维护 | 做 | 这些材料只能从 Artifact truth 派生,不得改变业务制品结论。 |
| Work 项目 / 工作项 / 迭代 / 工作状态管理 | 不做 | 这些 truth 属于 `L1-work`。 |
| Process 执行 / Activity / checkpoint / recovery 管理 | 不做 | 这些 truth 属于 `L1-process`。 |
| Governance 裁决、Policy、AIIA / SoA 结论和 Nonconformity 管理 | 不做 | 这些 truth 属于 `L1-governance`。 |
| Conversation review / preview display / Chat UI 管理 | 不做 | 对话事实和展示状态属于 `L1-conversation` / 产品入口。 |
| Workspace / console 聚合 UI 状态管理 | 不做 | 视图状态和交互状态属于 workspace / console。 |
| Observability ledger / metrics / trace store 管理 | 不做 | 物理审计存储和观测正文属于 `L4-observability`。 |
| Archive package / retention / restore orchestration 管理 | 不做 | 归档包装和恢复编排属于 `L4-archive`。 |
| Method definition / Artifact kind source / standard body 管理 | 不做 | 定义来源和标准正文属于 `L3-method-library` 等定义域。 |
| Runtime / capability execution 管理 | 不做 | 执行正文、工具调用、模型上下文和能力注册属于运行与能力层。 |
| External content storage / search engine / vector / external audit platform 管理 | 不做 | 基础设施和外部系统不拥有 Artifact truth。 |
| Work output 与 Artifact fact 边界 | 易混淆职责 | 工作输出不是 Artifact truth,正式收束后才进入本仓。 |
| Activity output 与 Artifact fact 边界 | 易混淆职责 | 过程执行状态不归本仓,输出进入制品事实后才归 Artifact。 |
| Governance evidence / AIIA / SoA conclusion 与 Artifact body / version 边界 | 易混淆职责 | 治理结论不归本仓,但相关制品正文和版本归 Artifact。 |
| Artifact kind definition 与 Artifact fact 边界 | 易混淆职责 | 定义来源属于 Method Library,具体制品事实属于 Artifact。 |
| Runtime trace / tool result 与 Artifact lineage 边界 | 易混淆职责 | trace 和工具结果只能作为线索,不能补造正式 lineage。 |
| Archive package 与 Artifact baseline 边界 | 易混淆职责 | 归档包不替代本仓受控版本集合 truth。 |
| Observability ledger 与 Artifact audit backref 边界 | 易混淆职责 | 物理日志属于 Observability,本仓只维护制品事实回指。 |
| Workspace / console view 与 consumable Artifact truth 边界 | 易混淆职责 | 下游视图和同步状态不能形成第二份制品真相。 |
| Content storage backend 与 Artifact truth owner 边界 | 易混淆职责 | 存储后端只是承载方式候选,不是 truth owner。 |
| Search / projection / report 与 Artifact truth 边界 | 易混淆职责 | 派生读侧不得成为业务写源。 |

### 8.2 做 / 不做清单

| 类型 | 清单 |
|---|---|
| 做 | Artifact fact truth;Artifact version truth;Artifact lineage truth;Artifact baseline truth;consumable Artifact truth backref;审查 / 责任 / 协作消费锚点;truth / snapshot / ref / forbidden body 分层;派生读侧和消费材料维护 |
| 不做 | work truth;process truth;governance truth;conversation truth / UI;workspace / console UI state;observability physical store;archive package / restore;method definition / standard body;runtime / capability execution;external storage / search / audit platform truth |
| 易混淆职责 | Work output vs Artifact fact;Activity output vs Artifact fact;governance evidence / conclusion vs Artifact body / version;Artifact kind definition vs Artifact fact;runtime trace vs lineage;archive package vs baseline;observability ledger vs audit backref;view / sync state vs consumable truth;storage backend vs truth owner;projection vs truth |

### 8.3 边界红线清单

| 红线 | 说明 |
|---|---|
| 不得把附件、日志、workspace 视图、archive package、observability record 或运行材料写成 Artifact fact truth | 否则派生材料会替代正式事实入口。 |
| 不得把新内容、候选修订、自动化再生成或下游状态无声覆盖 Artifact version truth | 否则历史版本和审查责任不可追溯。 |
| 不得把 runtime trace、tool result、model context、event stream 或私有链路写成 Artifact lineage truth | 否则血缘会脱离正式 fact / version 锚点。 |
| 不得把发布说明、治理裁决、项目状态、归档包或临时清单写成 Artifact baseline truth | 否则受控版本集合会漂移。 |
| 不得让 consumer、SDK、console、sync、workspace、report、archive 或 observability 拥有、复制、迁移、反推或反写 Artifact truth | 否则下游消费会变成第二 truth source。 |
| 不得让 work、process、governance、conversation、workspace、archive、observability、method-library、runtime 或 capability-hub 的 truth 进入 Artifact truth | 否则相邻仓职责边界被打穿。 |
| 不得保存外部正文、运行材料正文、视图正文、事件正文、归档包正文、观测正文或消费方私有材料正文作为 Artifact truth | 否则 Artifact 会膨胀为外部正文总仓。 |
| 不得让 `L0-bus` 承载 Artifact body、version set、lineage graph、baseline members 或下游副本作为 truth | 否则事件协作会替代 truth 存储。 |
| 不得把除 `L0-core` 外的 sibling repo 写成编译期依赖 | 否则全局依赖裁剪失效。 |
| 不得让 query、projection、report、search、preview、reconciliation、archive preparation 或 maintenance 隐式写业务 Artifact truth | 否则读 / 维护路径反写真相。 |

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论。

```md
## 4. 职责边界

> 校准来源:
> - `design-calibration/01_arch_step_03_responsibility_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“边界红线清单”小节,了解本章如何区分 Artifact 做什么、不做什么和最易混淆的仓际职责。

正式章节应摘录:

- `design-calibration/01_arch_step_03_responsibility_boundary.md` §8.1 职责边界表。
- `design-calibration/01_arch_step_03_responsibility_boundary.md` §8.2 做 / 不做清单。
- `design-calibration/01_arch_step_03_responsibility_boundary.md` §8.3 边界红线清单。
```

---

## 10. 待确认事项

本步不新增阻塞性待确认事项。后续 Step 4 需要把这些职责边界转换为正式系统上下文关系,但不应改变本步职责归属。

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-ART-ARCH-003-001 | content storage、hash、integrity 和 tamper 检测机制 | 后续技术选型和配置收敛;当前只固定职责边界。 |
| Q-ART-ARCH-003-002 | projection、search、preview、sync 和 report 的正式 read surface | 后续系统上下文、关键交互和详细设计收敛;当前只固定派生职责不得反写。 |
| Q-ART-ARCH-003-003 | Artifact kind / WorkProductDefinition 与具体 Artifact fact 的正式映射方式 | 后续概要 / 详细设计收敛;当前只固定定义来源不归 Artifact。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓做什么 | pass | §8.1 / §8.2 已列出 Artifact truth 和派生消费职责。 |
| 是否明确本仓不做什么 | pass | §8.1 / §8.2 已列出相邻仓、外部正文和基础设施非职责。 |
| 是否明确易混淆职责 | pass | §8.1 / §8.2 已列出 work output、activity output、governance evidence、runtime trace、archive package 等混淆点。 |
| 是否给出边界红线 | pass | §8.3 已集中列出红线。 |
| 是否提前写系统上下文、子域、数据所有权、接口协议或实现方案 | pass | 本步只输出职责归属。 |
| 是否允许进入 Step 4 | pass | 当前职责边界足以支撑系统边界与上下文讨论。 |

当前 Step 3 `职责边界` 已完成。下一步必须等待用户确认后进入 Step 4 `系统边界与上下文`,并只创建 / 改写 `design-calibration/01_arch_step_04_system_context.md`。
