# Step 8. 数据所有权与一致性策略

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 8
> 回填章节: `01-架构设计.md` §9 数据所有权与一致性策略
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-artifact` 拥有哪些正式真相数据,哪些只是快照 / 投影数据,哪些只是引用关系数据,哪些正文 / 真相必须明确排除在本仓之外;并在这些归属判断成立的前提下,说明不同数据关系应采用什么一致性口径,以及一致性暂时不成立时的架构层处理原则。

本步不写数据库表、字段、DDL、缓存策略、outbox、事务机制、事件 schema、重试脚本、repository / service / adapter 或代码对象模型。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供做 / 不做、易混淆职责和边界红线。 |
| `design-calibration/01_arch_step_04_system_context.md` | 已完成 | 提供正式上下文对象、输入 / 输出面和外部降级口径。 |
| `design-calibration/01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 提供核心子域、支撑上下文和本地索引 / 投影 / 引用层。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | 已完成 | 提供真相承载、派生承载、外部正文来源和事件交接运行边界。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 提供依赖方向、倒置边界、禁止反向依赖和跨仓裁剪结论。 |
| `projects/L1-artifact/00-需求文档.md` §11 / §13 | 已重建 | 提供需求层真相 / 快照 / 引用 / 禁止保存正文结论和 NFR 边界。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 8 | 已读取 | 控制本步必须输出数据所有权、一致性、停审和跨数据边界审计。 |
| `standards/document/架构设计书写规范.md` §4.9 | 已读取 | 控制数据归属表、一致性策略表和关系示意图写法。 |
| 旧 `projects/L1-artifact/01-架构设计.md` §8 | 旧 Draft | 作为旧 metadata / relation / baseline / content / tampered / 补偿机制混写问题诊断输入。 |
| `projects/L1-governance/design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已参考 | 只参考“归属先行 + 一致性推导 + 审计停审”的组织方式,不复制治理仓结论。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 3 / 5 / 6 / 7、SOP Step 8 和书写规范 4.9 | done | 本文件 §2 |
| 读取需求数据归属 / NFR、旧架构数据章节和 L1-governance Step 8 框架 | done | 本文件 §2 / §5 |
| 回答正式真相、快照 / 投影、引用、明确不拥有正文和一致性问题 | done | 本文件 §4 |
| 输出数据归属表、一致性策略表、架构单元数据所有权表、关系示意图和边界说明 | done | 本文件 §8 |
| 完成数据所有权停审和跨数据边界审计 | done | 本文件 §8.5 / §8.6 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 8 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 哪些数据由本仓拥有正式真相?

`L1-artifact` 拥有可审计制品事实本身的正式真相。它拥有的是 Artifact fact、version、lineage、baseline、consumption backref、正式制品正文 / 内容事实语境、审查责任锚点和跨仓消费回指,不是相邻仓正文、运行材料正文、方法定义正文、观测正文、归档包正文、workspace / console / sync 私有状态或具体内容后端生命周期。

| 正式真相数据 | 判断 |
|---|---|
| Artifact fact / 制品事实入口 | 平台产出、人工提交、自动化产出或治理证据经正式收束后形成的制品事实由 Artifact 拥有。 |
| Artifact 正文 / 内容事实语境 | 已成为正式 Artifact 的正文归属语义、可识别内容事实和正文边界由 Artifact 拥有。 |
| Artifact version | 稳定版本、候选修订、替代、当前被引用版本和历史版本由 Artifact 拥有。 |
| Artifact lineage | 来源、替代、依赖、影响、自动化关系收束和血缘审查维护锚点由 Artifact 拥有。 |
| Artifact baseline | 受控 Artifact version 集合、基线候选、冻结语境和历史基线由 Artifact 拥有。 |
| Consumable Artifact truth backref | 下游消费后回指正式 fact / version / lineage / baseline 的可消费引用真相由 Artifact 拥有。 |
| Artifact review / responsibility anchor | 审查、负责、维护和协作确认围绕同一 Artifact truth 展开的锚点由 Artifact 拥有。 |
| Artifact truth boundary classification | 本仓对正式 truth、快照、引用和禁止正文的边界判断由 Artifact 拥有。 |
| Artifact audit / traceability backref | 关键 Artifact truth 变化、消费、归档、观测和同步交接的可解释回指由 Artifact 拥有。 |

### 4.2 哪些数据只是快照 / 投影?

快照 / 投影只服务稳定展示、解释、审查、发现、报告、对账、归档准备、观测解释和同步交接,不得成为独立 Artifact truth。

| 快照 / 投影数据 | 上游或来源 |
|---|---|
| 工作 / 项目 / 工作项 / 产出语境摘要 | `L1-work` |
| 过程 / activity / 过程输出语境摘要 | `L1-process` |
| 治理 / evidence / AIIA / SoA / gate 语境摘要 | `L1-governance` |
| Artifact 展示摘要 / 预览摘要 / 消费依据说明 | Artifact truth 派生 |
| Artifact 搜索 / 浏览 / 列表 / projection / report / reconciliation material | Artifact truth 派生 |
| 定义来源 / Artifact kind / WorkProductDefinition 摘要 | `L3-method-library` |
| 自动化来源 / runtime / capability / tool result 摘要 | `L2-runtime` / `L3-capability-hub` |
| conversation / workspace / console / sync 消费摘要 | 下游消费边界 |
| observability / archive handoff preparation summary | Artifact truth 和外部引用派生 |

### 4.3 哪些数据只是引用关系?

引用关系只保存指向外部对象、外部正文或正式材料的稳定回链,不保存外部正文,也不承担外部生命周期。

| 引用关系数据 | 外部对象 |
|---|---|
| WorkRef / ProjectRef / WorkItemRef / WorkProductRef | `L1-work` |
| ProcessRef / ActivityRef / ProcessOutputRef | `L1-process` |
| GovernanceRef / EvidenceRef / GateRef / AIIARef / SoARef / DecisionRef | `L1-governance` / `L1-artifact` 相关正文边界 |
| MethodDefinitionRef / ArtifactKindRef / WorkProductDefinitionRef / StandardRef | `L3-method-library` |
| RuntimeExecutionRef / CapabilityRef / ToolResultRef / ModelContextRef | `L2-runtime` / `L3-capability-hub` |
| ConversationRef / WorkspaceRef / ConsoleContextRef / SyncHandoffRef | `L1-conversation` / `L1-workspace` / `L5-console` / `L5-sync` |
| ArchivePackageRef / ArchiveHandoffRef | `L4-archive` |
| ObservabilityRef / AuditRef / TraceRef / IntegritySignalRef | `L4-observability` |
| ExternalBodyRef / ContentSourceRef / StorageBackendRef | 外部正文来源或内容承载边界 |

### 4.4 哪些正文 / 真相本仓明确不拥有?

`L1-artifact` 明确不拥有相邻仓正文、运行正文、方法定义正文、观测正文、归档包正文、产品入口私有状态或基础设施 truth。即便这些正文参与制品事实形成或消费解释,也只能以引用、摘要、safe summary、快照或 Artifact 自身结论进入。

| 明确不拥有的正文 / 真相 | 原因 |
|---|---|
| Project、WorkItem、Iteration、work lifecycle、工作状态和工作正文 | work truth 属于 `L1-work`。 |
| ProcessInstance、Activity、checkpoint、recovery、过程执行正文 | process execution truth 属于 `L1-process`。 |
| Gate decision、Policy、Approval、AIIA / SoA governance conclusion、Nonconformity | governance truth 属于 `L1-governance`。 |
| MethodContent、WorkProductDefinition 正文、Artifact kind 定义正文、标准正文 | 定义来源 truth 属于 `L3-method-library` 等定义域。 |
| runtime execution、tool result body、model context body、capability registry、provider payload | 运行与能力 truth 属于 runtime / capability 边界。 |
| conversation message、review discussion、workspace layout、console UI state、sync private copy | 对话、工作台、控制台和同步私有状态不属于 Artifact。 |
| audit log store、metric body、trace storage、alert stream | 物理观测正文属于 `L4-observability`。 |
| archive package body、retention policy、restore orchestration、cross-domain package | 归档包装和恢复 truth 属于 `L4-archive`。 |
| Git / S3 / URL / DB / object store / search / vector / external audit platform 的基础设施 truth | 技术设施或外部系统不拥有 Artifact truth。 |

### 4.5 哪些关系必须强一致?

强一致只用于 Artifact 正式真相内部关系,以及正式真相与必要引用有效性的边界判断。Artifact fact、version、lineage、baseline 和 consumption backref 不能被写成半成立状态。

| 强一致关系 | 原因 |
|---|---|
| Artifact fact 与正式正文 / 内容事实语境 | 制品事实入口必须能说明哪份内容事实被正式承载。 |
| Artifact fact 与 Artifact version | 版本必须围绕确定事实成立,不得脱离 fact 成为孤立版本。 |
| Artifact version 与 replacement / candidate / historical version 语境 | 历史和替代语义不得被 current latest 或自动化再生成覆盖。 |
| Artifact version 与 Artifact lineage anchor | 血缘必须锚定正式版本,不得挂在附件、日志或未版本化材料上。 |
| Artifact lineage 内来源 / 替代 / 依赖 / 影响关系 | 正式血缘关系必须围绕同一 fact / version 语境可解释。 |
| Artifact baseline 与 baseline member Artifact versions | 受控版本集合必须锁定正式 Artifact versions,不得动态解析为 current version。 |
| Consumable Artifact truth backref 与 fact / version / lineage / baseline | 下游消费回指必须指向正式 truth,不得指向私有副本或派生材料。 |
| Artifact truth change 与 audit / traceability backref | 关键变化必须有可解释回指,不能只形成业务状态而无追溯事实。 |

### 4.6 哪些关系可以最终一致?

最终一致用于派生消费、下游显化、搜索、报告、对账、归档交接、观测解释、同步交接、事件协作和外部快照刷新。这些关系可以延迟、重建或挂起,但不能反向改变 Artifact truth。

| 最终一致关系 | 原因 |
|---|---|
| Artifact truth 到 search / preview / projection / report / reconciliation | 派生消费可延迟和重建,不得成为业务写源。 |
| Artifact truth 到 conversation / workspace / console / sync 显化 | 下游入口不可用只影响消费体验,不改变 Artifact truth。 |
| Artifact truth 到 observability / archive handoff | 追溯、观测和归档交接可延迟,但 Artifact truth 不因交接失败而变更。 |
| 外部 truth 到 Artifact 本地快照 | 上游摘要可能滞后,本仓只表达 stale / unresolved / pending 状态。 |
| 事件协作输出 / 输入 | 事件传播和消费可延迟,但重复或乱序不能产生重复 Artifact truth。 |
| 外部正文来源可用性与 Artifact 派生预览 | 外部正文来源可缺失或延迟,预览和完整性解释可降级,不得伪造正文。 |

### 4.7 失败时靠什么口径约束、补偿或挂起?

| 失败类型 | 架构层处理口径 |
|---|---|
| Artifact 主真相内部强一致失败 | 明确失败或保持原状态,不得写成部分完成。 |
| 外部快照缺失 / 过期 | 标记 unresolved / stale / pending / waiting,不得补造外部 truth。 |
| 外部引用目标不存在或不可解析 | 挂起相关收束、退回待补语境或显式拒绝,不得保存正文补齐。 |
| 外部正文来源不可用 | 保留引用缺口或不可用语义,不得将替代正文写成本仓 truth。 |
| 派生视图 / 搜索 / 报告 / 对账滞后 | 暴露 stale / rebuilding / unavailable,不得反写真相。 |
| conversation / workspace / console / sync 显化失败 | 只影响显化、访问或同步体验,不得改变 Artifact truth。 |
| observability / archive handoff 失败 | 保留待交接 / failed / retryable 语义,不得接管物理日志或归档包正文。 |
| event 重复 / 乱序 | 保持幂等、拒绝回退或挂起对账,不得生成重复 fact / version / lineage / baseline。 |
| 自动化来源依据不足 | 保守挂起、升级人工审查或拒绝自动形成 truth,不得用 runtime trace 直接补造 Artifact fact / lineage。 |

### 4.8 哪些数据边界如果不写清,后续最容易串仓?

最容易串仓的数据边界是:

1. Artifact fact 与附件、日志、workspace view、archive package、runtime material。
2. Artifact version 与 current latest、候选修订、自动化再生成和下游状态。
3. Artifact lineage 与 runtime trace、tool result、model context、event stream、observability record。
4. Artifact baseline 与 project baseline、governance decision、archive package、release note。
5. Consumable Artifact truth 与 SDK、console、sync、workspace、report 和下游私有副本。
6. Artifact kind / WorkProductDefinition 与具体 Artifact fact / version。
7. 外部正文 / content backend 与 Artifact 正文 / 内容事实语境。
8. Artifact audit / traceability backref 与 observability audit ledger / trace store。
9. Artifact read model / search / report / projection / reconciliation 与 Artifact truth。

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| `Artifact metadata` / `Relations graph` / `Baseline` 直接作为数据所有权对象 | 名称偏对象 / 存储,没有解释 fact、version、lineage、baseline 和消费回指的真相边界。 | 改为正式真相数据分类,不写字段或表。 |
| `Content bytes` 写成外部 backend,并和 Artifact / previewers 最终一致 | 混合了外部正文、内容后端、预览消费和 Artifact 正文事实语境。 | 改为外部正文 / 内容来源只可引用,正式 Artifact 内容事实语境由本仓拥有。 |
| `tampered event` 写入数据所有权矩阵 | 事件名和完整性结果提前定稿,且容易让事件成为 truth。 | 改为完整性 / 观测线索只作引用或摘要,事件协作不承载 truth。 |
| `pin version/hash` 写进 Baseline 一致性策略 | 提前固化 hash / pin 实现机制。 | 保留 baseline member versions 强一致,hash / pin 后置。 |
| `metadata ↔ content backend 通过 hash 校验维护最终一致` | 这是技术校验与补偿机制,不属于当前架构归属判断。 | 改为外部正文来源可用性与派生预览最终一致,不得伪造正文。 |
| 补偿机制写 orphan、重试、replay、重算 hash | 下沉到实现补偿、后台任务和操作流程。 | 本步只写架构层失败处理口径。 |
| `AIIA/SoA 双身份不同步` | 把治理 / 制品协作和同步实现提前写死。 | 改为治理语境只通过引用、摘要和正式边界协作。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据主语 | metadata、relations、baseline、content bytes、tampered event | Artifact fact、content fact context、version、lineage、baseline、consumption backref、快照 / 投影、引用和明确不拥有正文 | 架构层先判断归属,不提前进入对象模型或设施。 |
| 内容数据 | 外部 backend 与 Artifact / previewers 一起讨论 | Artifact 拥有正式内容事实语境,外部正文和后端生命周期不归 Artifact | 防止外部正文入仓或后端成为 truth owner。 |
| 血缘数据 | Relations graph | Artifact lineage truth | 不把查询图或存储图替代正式血缘语义。 |
| 基线数据 | Baseline + pin version/hash | Artifact baseline truth + member version 强一致 | 保留受控版本集合语义,实现机制后置。 |
| 派生数据 | lineage query / audit / previewers 消费 | search、preview、projection、report、reconciliation、handoff 均为快照 / 投影 | 防止派生面成为第二 truth。 |
| 一致性策略 | hash 校验、orphan、重试、replay | 按数据归属推导强一致、最终一致、引用有效性和边界约束 | 保持架构层粒度。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 metadata / relation / baseline / content matrix | 改动少。 | 无法防止外部正文、技术后端和派生结果反写真相。 | 不采用。 |
| 方案 B: 先按四类数据归属划边界,再推导一致性策略 | 能保护 Artifact truth,可支撑后续详细设计。 | 表格较长,后续仍需落对象 schema。 | 采用。 |
| 方案 C: 所有 Artifact 相关数据都强一致 | 语义最硬。 | 外部快照、下游显化、报告、对账和归档交接会难以实现。 | 不采用。 |
| 方案 D: 所有数据都最终一致 | 起步简单。 | 会破坏 fact、version、lineage、baseline 和 consumption backref 主真相。 | 不采用。 |
| 方案 E: 把 content backend / search / observability / archive 写成 truth source | 贴近旧实现想象。 | 会让技术设施和下游系统反向定义 Artifact truth。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| 外部正文 / content backend 是否进入 Artifact truth | A. 进入;B. 不进入,只保留引用、摘要和正式内容事实语境 | B | Artifact 拥有制品事实语义,不拥有外部正文生命周期和后端 truth。 |
| hash / tamper / integrity 是否在 Step 8 定为正式对象或事件 | A. 定稿;B. 不定稿,只保留完整性线索和边界约束 | B | 具体算法、事件和检查机制属于后续详细设计 / 测试方案。 |
| search / preview / projection / report 是否能作为 Artifact 写源 | A. 能;B. 不能,只能派生 | B | 派生消费和维护结果可延迟、可重建,不得成为第二 truth。 |
| archive / observability / sync 是否拥有 Artifact truth | A. 拥有;B. 不拥有,只消费或承接交接材料 | B | Artifact 拥有制品 truth;L4 / L5 负责横切存储、归档和同步能力。 |

---

## 8. 结构化中间产物

### 8.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| Artifact fact / 制品事实入口 | 正式真相数据 | 由 Artifact 拥有平台产出、人工提交、自动化产出或治理证据正式成为制品事实的入口真相。 | 未收束材料、附件、日志、视图或外部正文不自动成为 Artifact fact。 |
| Artifact 正文 / 内容事实语境 | 正式真相数据 | 由 Artifact 拥有已成为正式 Artifact 的正文归属语义、可识别内容事实和内容边界。 | 不等于拥有 Git / S3 / URL / DB 等外部正文生命周期或后端 truth。 |
| Artifact version | 正式真相数据 | 由 Artifact 拥有稳定版本、候选修订、替代、当前被引用版本和历史版本。 | 不得由 current latest、自动化再生成或消费方状态覆盖。 |
| Artifact lineage | 正式真相数据 | 由 Artifact 拥有来源、替代、依赖、影响、自动化关系收束和血缘审查维护锚点。 | runtime trace、tool result、event stream 和 observability record 只能作为线索。 |
| Artifact baseline | 正式真相数据 | 由 Artifact 拥有受控 Artifact version 集合、基线候选、冻结语境和历史基线。 | 不等于 project baseline、governance decision、archive package 或 release note。 |
| Consumable Artifact truth backref | 正式真相数据 | 由 Artifact 拥有下游消费后回指正式 fact / version / lineage / baseline 的可消费引用真相。 | 下游私有副本、sync copy、workspace view 或 report 不能替代该回指。 |
| Artifact review / responsibility anchor | 正式真相数据 | 由 Artifact 拥有审查、负责、维护和协作确认围绕同一 Artifact truth 展开的锚点。 | 不拥有 identity lifecycle、work responsibility truth 或 governance approval truth。 |
| Artifact truth boundary classification | 正式真相数据 | 由 Artifact 拥有本仓对正式 truth、快照、引用和禁止正文的边界判断。 | 该判断不能被技术后端、派生视图或下游消费方改写。 |
| Artifact audit / traceability backref | 正式真相数据 | 由 Artifact 拥有关键变化、消费、归档、观测和同步交接的可解释回指。 | 不等于 observability audit ledger、trace store 或 archive package body。 |
| 工作 / 项目 / 工作项 / 产出语境摘要 | 快照 / 投影数据 | Artifact 可为事实收束、审查和 baseline 协作保留 work 摘要。 | work 正式真相仍归 `L1-work`。 |
| 过程 / activity / 过程输出语境摘要 | 快照 / 投影数据 | Artifact 可为来源、产出和 lineage 收束保留 process 摘要。 | process execution truth 仍归 `L1-process`。 |
| 治理 / evidence / AIIA / SoA / gate 语境摘要 | 快照 / 投影数据 | Artifact 可为证据、责任和消费解释保留 governance 摘要。 | governance decision、policy、approval 和 gate truth 不归 Artifact。 |
| Artifact 展示摘要 / 预览摘要 / 消费依据说明 | 快照 / 投影数据 | 由 Artifact truth 派生,服务展示、审查、归档、观测和同步消费。 | 可延迟、可重建,不得反写 Artifact truth。 |
| Artifact 搜索 / 浏览 / 列表 / projection / report / reconciliation material | 快照 / 投影数据 | 由 Artifact truth 派生,服务发现、报告、对账和维护。 | 不得成为业务写源。 |
| 定义来源 / Artifact kind / WorkProductDefinition 摘要 | 快照 / 投影数据 | Artifact 可为分类、解释和来源追溯保留定义摘要。 | method-library / standard 正文仍归 `L3-method-library`。 |
| 自动化来源 / runtime / capability / tool result 摘要 | 快照 / 投影数据 | Artifact 可为自动化产出收束和 lineage 解释保留来源摘要。 | runtime execution、tool result body 和 capability registry 不归 Artifact。 |
| conversation / workspace / console / sync 消费摘要 | 快照 / 投影数据 | Artifact 可为消费解释和回链保留下游摘要。 | 下游展示、工作台状态、console UI 和 sync 私有副本不归 Artifact。 |
| observability / archive handoff preparation summary | 快照 / 投影数据 | 由 Artifact truth 和外部引用派生,服务观测解释、归档和恢复交接。 | observability store 和 archive package body 不归 Artifact。 |
| work / process / governance / method / runtime / capability / consumer / archive / observability / external body 相关 Ref | 引用关系数据 | Artifact 只保存对外部对象、外部正文、外部材料或交接边界的稳定引用。 | 引用存在不代表拥有外部正文或外部生命周期。 |
| process / work / governance / method-library / runtime / capability / conversation / workspace / console / sync / observability / archive / external backend 正文 | 明确不拥有的正文 / 真相 | 这些正文或主真相由相邻仓、运行层、横切系统、产品入口或外部系统拥有。 | 如需参与 Artifact 语义,只能通过引用、快照、摘要、safe summary 或 Artifact 自身结论表达。 |

### 8.2 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| Artifact fact 与正式正文 / 内容事实语境 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 明确失败或保持原状态,不得形成无内容语境的正式 fact | 制品事实入口必须可解释其内容事实边界。 |
| Artifact fact 与 Artifact version | 正式真相数据 ↔ 正式真相数据 | 强一致 | 版本锚点不闭合时不得形成正式 version | 防止孤立版本或 current latest 替代事实。 |
| Artifact version 与 replacement / candidate / historical version 语境 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 替代或历史语境不闭合时拒绝覆盖或保持原状态 | 防止历史版本被无声覆盖。 |
| Artifact version 与 Artifact lineage anchor | 正式真相数据 ↔ 正式真相数据 | 强一致 | 版本锚点缺失时不得形成正式 lineage | 血缘必须围绕正式版本成立。 |
| Artifact lineage 内来源 / 替代 / 依赖 / 影响关系 | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 强一致 + 引用有效性一致 | 关系目标不可解释时挂起、拒绝或保留 unresolved | 防止 trace / event / tool result 补造血缘。 |
| Artifact baseline 与 baseline member Artifact versions | 正式真相数据 ↔ 正式真相数据 | 强一致 | 成员版本不正式或不可解析时不得冻结 baseline | Baseline 必须锁定正式 Artifact versions。 |
| Consumable Artifact truth backref 与 fact / version / lineage / baseline | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 强一致 + 引用有效性一致 | 回指目标缺失时不得输出正式可消费 truth | 下游消费必须回到同一 Artifact truth。 |
| Artifact truth change 与 audit / traceability backref | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 强一致 | 关键变化缺追溯时失败或保持原状态 | Artifact truth 必须可解释、可审计、可交接。 |
| 外部 truth 到 Artifact 本地快照 | 明确不拥有的正文 / 真相 ↔ 快照 / 投影数据 | 最终一致 + 边界约束一致 | 标记 stale / unresolved / pending / waiting,不得复制正文补齐 | 本地快照只服务判断和解释。 |
| 外部对象 / 外部正文引用有效性 | 引用关系数据 ↔ 明确不拥有的正文 / 真相 | 引用有效性一致 | 保持 missing / invalid / unresolved,或挂起相关收束 | 引用成立不等于正文归属转移。 |
| Artifact truth 到 search / preview / projection / report / reconciliation | 正式真相数据 ↔ 快照 / 投影数据 | 最终一致 | 暴露 stale / rebuilding / unavailable,不得反写真相 | 派生消费可延迟和重建。 |
| Artifact truth 到 conversation / workspace / console / sync 显化 | 正式真相数据 ↔ 快照 / 投影数据 / 引用关系数据 | 最终一致 | 显化或同步失败只影响入口体验,不得改变 Artifact truth | 产品入口不是 Artifact truth source。 |
| Artifact truth 到 observability / archive handoff | 正式真相数据 ↔ 快照 / 投影数据 / 引用关系数据 | 最终一致 + 边界约束一致 | 保留待交接 / failed / retryable 语义,不得接管日志或归档正文 | 交接失败不能改变 Artifact truth 含义。 |
| 事件协作重复或乱序 | 正式真相数据 / 快照 / 投影数据 / 引用关系数据 | 幂等一致 + 顺序约束 | 重复输入返回同一结果或忽略;乱序不得回退状态 | 防止重复 fact、version、lineage 或 baseline。 |
| 查询 / 报告 / 对账 / 归档准备维护 | 快照 / 投影数据 ↔ 正式真相数据 | 只读一致 + 不反写真相 | 维护失败只影响派生状态,不得推进业务 Artifact truth | 读 / 维护路径不能成为写源。 |
| 明确不拥有正文被请求写入 Artifact | 明确不拥有的正文 / 真相 ↔ 正式真相数据 | 边界约束一致 | 拒绝、挂起或转换为引用 / 摘要 / safe summary,不得保存为 Artifact truth | 这是防止串仓和外部正文入仓的最高优先级边界。 |

### 8.3 按架构单元组织的数据所有权表

| 架构单元 | 拥有 truth | 只持有 snapshot / projection | 只持有 reference | forbidden body / forbidden write | 停审结果 |
|---|---|---|---|---|---|
| `Artifact 核心语义角色` | Artifact fact、content fact context、version、lineage、baseline、consumption backref、boundary classification | 不直接持有派生消费材料 | 必要外部 ref 的语义占位 | 外部正文、相邻仓 truth、派生材料反写 | pass |
| `Artifact 编排 / 承接角色` | 不独立拥有 truth,只推动核心语义形成正式变化 | intake summary、review summary、source summary、maintenance summary | work / process / governance / method / runtime / capability / body refs | 绕过核心写 truth;把外部正文原文写入核心 | pass |
| `外部能力接缝角色` | 不拥有 Artifact truth | 外部 safe summary、snapshot、stale / pending 状态 | 外部对象、外部正文和交接 ref | 相邻仓正文入仓;运行期结果直接变 Artifact truth | pass |
| `派生消费辅助角色` | 不拥有业务 truth | search、preview、projection、report、reconciliation、handoff preparation | 下游消费 / archive / observability / sync refs | 派生结果反写 Artifact truth;私有副本替代回指 | pass |
| `技术承载角色` | 不定义业务 truth,只承载正式 truth / derived material | storage / index / cache / event / content source support 的承载材料 | content source、storage backend、event / trace handoff refs | 技术产品定义业务语义;content backend 成为 truth owner | pass |

### 8.4 简化关系示意图

```text
+====================================================================+
|                         L1-artifact 数据边界                        |
|                                                                    |
|   +------------------------------+                                 |
|   | 正式真相数据                 |                                 |
|   | fact / version / lineage     |                                 |
|   | baseline / consumption ref   |                                 |
|   +---------------+--------------+                                 |
|                   | 派生 / 回链                                     |
|                   v                                                 |
|   +---------------+--------------+      +-------------------------+ |
|   | 快照 / 投影数据              |      | 引用关系数据            | |
|   | search / preview / report    |      | refs / handoff links    | |
|   +---------------+--------------+      +------------+------------+ |
|                   | 不反写                           | 只引用        |
+===================+==================================+=============+
                    |                                  |
                    v                                  v
        明确不拥有的外部正文 / 外部主真相
        work / process / governance / method / runtime
        capability / conversation / workspace / observability
        archive / console / sync / content backend
```

图示说明:

- `正式真相数据` 是 `L1-artifact` 唯一可以主张拥有的制品业务真相。
- `快照 / 投影数据` 和 `引用关系数据` 可以本地存在,但不能反写核心真相或吸收外部正文。
- `明确不拥有的外部正文 / 外部主真相` 只能通过引用、摘要、safe summary 或 Artifact 自身结论参与。
- 该图不表达存储设计、同步流程、事件流、对象模型或事务边界。

### 8.5 数据所有权停审记录

| 架构单元 | truth 是否唯一 | projection / cache 是否禁止反写 | external body 是否禁止保存 | 一致性口径是否清楚 | 停审结果 |
|---|---|---|---|---|---|
| `Artifact 核心语义角色` | pass | pass | pass | pass | pass |
| `Artifact 编排 / 承接角色` | pass | pass | pass | pass | pass |
| `外部能力接缝角色` | pass | pass | pass | pass | pass |
| `派生消费辅助角色` | pass | pass | pass | pass | pass |
| `技术承载角色` | pass | pass | pass | pass | pass |

### 8.6 跨数据边界审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在双真相 | pass | fact、version、lineage、baseline 和 consumption backref 均由 Artifact 拥有,相邻仓只引用或消费。 |
| 是否存在投影反写真相 | pass | search、preview、projection、report、reconciliation、archive / observability / sync handoff 均不得反写。 |
| 是否存在引用正文入仓 | pass | 外部正文、相邻仓正文、运行材料、观测正文、归档包和产品入口私有状态均明确不拥有。 |
| 是否存在强一致 / 最终一致误用 | pass | 核心 truth 内部强一致;外部快照、派生消费、显化和交接最终一致。 |
| 是否存在失败补偿口径冲突 | pass | 失败时按 explicit failure、pending、stale、unresolved、retryable 或拒绝处理,不伪造 truth。 |
| 是否存在旧技术机制污染 | pass | hash、tamper event、orphan cleanup、retry、replay、PostgreSQL、content backend 均未作为本步正式机制。 |
| 是否存在后续详细设计承接风险 | pass | 本步未写字段、表、schema、event payload、outbox、事务、repository 或 adapter。 |

### 8.7 数据边界说明

`L1-artifact` 的数据所有权边界是“拥有制品事实、版本、血缘、基线和可消费回指,本地保留判断和消费辅助,引用外部对象和材料,明确排除外部正文与相邻仓主真相”。Artifact fact、content fact context、version、lineage、baseline、consumption backref、review / responsibility anchor 和 traceability backref 属于 Artifact;work、process、governance、method-library、runtime、capability、conversation、workspace、console、sync、observability、archive 和 content backend 正文不属于 Artifact。快照、投影、搜索、预览、报告、对账、观测解释和归档准备可以提升消费、解释和交接能力,但它们的延迟、失效或重建不能改变正式制品事实。后续设计如果需要写字段、表、事件、补偿、索引或 hash / integrity 机制,必须从本章归属和一致性口径继续下沉,不能反向修改本章边界。

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 9. 数据所有权与一致性策略

> 校准来源:
> - `design-calibration/01_arch_step_08_data_ownership_consistency.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“数据归属表”“一致性策略表”“按架构单元组织的数据所有权表”“简化关系示意图”和“跨数据边界审计表”小节,了解本章如何先确认数据归属,再推导一致性策略。

### 9.1 数据归属表

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §8.1。

### 9.2 一致性策略表

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §8.2。

### 9.3 按架构单元组织的数据所有权表

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §8.3。

### 9.4 简化关系示意图

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §8.4。

### 9.5 数据边界说明

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §8.7。
```

---

## 10. 待确认事项

本步不新增阻塞 Step 9 的待确认事项。下列事项进入后续 Step,不得在 Step 8 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-ART-ARCH-008-001 | Artifact 正文 / 内容事实语境与外部正文来源、content-addressing、hash 和 integrity marker 的具体 schema | 后续概要 / 详细设计、配置设计和测试方案收敛。 |
| Q-ART-ARCH-008-002 | Artifact version、lineage、baseline 的状态机、成员表达、关系类型和并发语义 | 后续概要 / 详细设计和测试方案收敛。 |
| Q-ART-ARCH-008-003 | search、preview、projection、report、reconciliation 和 sync material 的正式 read surface | 后续 Step 9、概要 / 详细设计和配置设计收敛。 |
| Q-ART-ARCH-008-004 | archive / observability / sync handoff 的交接协议、失败语义和 evidence 形态 | 后续 Step 9、测试方案和验收标准收敛。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确正式真相数据、快照 / 投影数据、引用关系数据和明确不拥有正文 | pass | §8.1 已按四类数据归属列出。 |
| 是否说明每类数据为什么属于当前归属边界 | pass | §8.1 / §8.7 已给出归属和边界说明。 |
| 是否明确不同数据关系的一致性口径 | pass | §8.2 已区分强一致、最终一致、引用有效性、幂等一致和边界约束。 |
| 是否明确一致性暂时不成立时的架构层处理原则 | pass | §4.7 / §8.2 已给出 explicit failure、pending、stale、unresolved、retryable、拒绝或挂起口径。 |
| 是否按架构单元完成数据所有权停审 | pass | §8.3 / §8.5 已逐项通过。 |
| 是否完成跨数据边界审计 | pass | §8.6 未发现双真相、投影反写、引用正文入仓或一致性冲突。 |
| 是否避免数据库、缓存 / 投影 / outbox、事务、协议或代码模型细节 | pass | 未写字段、表、DDL、event payload、repository、adapter、事务脚本或重试实现。 |
| 是否允许进入 Step 9 | pass | 当前数据所有权与一致性策略足以支撑关键交互与通信方式讨论。 |

当前 Step 8 `数据所有权与一致性策略` 已完成。下一步必须等待用户确认后进入 Step 9 `关键交互与通信方式`,并只创建 / 改写 `design-calibration/01_arch_step_09_interactions_communication.md`。
