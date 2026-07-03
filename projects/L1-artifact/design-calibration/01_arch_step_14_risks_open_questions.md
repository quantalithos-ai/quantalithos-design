# Step 14. 风险与待确认事项

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 14
> 回填章节: `01-架构设计.md` §15 风险与待确认事项
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

显式收纳 `L1-artifact` 架构校准后仍未关闭、且会影响后续概要设计 / 详细设计 / 测试验收 / 配置设计 / 实施计划判断的风险和待确认事项。

本步不写任务 backlog、TODO 清单、实施动作、最终解决方案、产品选型、接口字段、状态机细节、数据库、对象存储、Git 后端、hash 算法、测试步骤或优化愿望,也不把前文已经收稳的 Artifact truth、外部正文排除、version / lineage / baseline 锚定、派生不反写和依赖裁剪结论重新打开。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `design-calibration/01_arch_step_01_requirement_baseline.md` | 已完成 | 提供需求基线、旧文档回流风险和一票否决输入。 |
| `design-calibration/01_arch_step_02_goals_constraints.md` | 已完成 | 提供架构目标、不可变约束、当前阶段取舍和非目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供职责红线和易混淆边界。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 提供 `L0-core` 唯一编译期依赖和运行期协作口径。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供 truth / snapshot / reference / derived separation 和一致性边界。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步 / 异步 / 后台承接、失败状态和外围最终一致口径。 |
| `design-calibration/01_arch_step_10_technology_choices.md` | 已完成 | 提供关键技术机制、正式承接边界和当前不采用口径。 |
| `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 提供当前主线方案、替代路径和不采用方案。 |
| `design-calibration/01_arch_step_12_cross_cutting_concerns.md` | 已完成 | 提供安全、可观测、韧性、性能、配置和追溯横切约束。 |
| `design-calibration/01_arch_step_13_evolution_path.md` | 已完成 | 提供可接受债务、不可接受债务和演进触发条件。 |
| `projects/L1-artifact/00-需求文档.md` §15 | 已重建 | 提供需求层风险与待确认事项。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 14 | 已读取 | 控制本步拆分风险与待确认事项。 |
| `standards/document/架构设计书写规范.md` §4.15 | 已读取 | 控制风险表、待确认事项表和当前处理口径写法。 |
| `projects/L1-governance/design-calibration/01_arch_step_14_risks_open_questions.md` | 已参考 | 只参考“风险 / 待确认拆分 + 阻塞判断”的组织方式,不复制治理仓结论。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 13、SOP Step 14 和书写规范 4.15 | done | 本文件 §2 |
| 读取需求风险、旧架构线索和 L1-governance Step 14 框架 | done | 本文件 §2 / §5 |
| 回答风险、影响范围、待确认事项、前文成立性和阻塞判断问题 | done | 本文件 §4 |
| 输出风险表、待确认事项表和当前处理口径说明 | done | 本文件 §7 |
| 写出 Step 16 可回填草稿并更新 flow / 项目台账 | done | 本文件 §8 |

---

## 4. SOP 问题回答

### 4.1 当前还有哪些尚未关闭的架构风险?

当前尚未关闭的正式风险不是“能力还没做完”,而是后续概要、详细、配置、测试和实现阶段可能重新打穿 `L1-artifact` 主线边界的问题:

| 风险 | 当前判断 |
|---|---|
| 相邻仓、派生材料、消费副本或同步副本补造 / 迁移 / 反向定义 Artifact truth | 会破坏 `L1-artifact` 作为可审计制品真相仓的定位。 |
| 外部正文、content backend、hash event、tamper marker 或扫描结果进入 Artifact truth | 会让技术设施或外部正文生命周期反向定义制品事实。 |
| Artifact version 被 current latest、候选修订、自动化再生成或外部状态无声覆盖 | 会破坏历史版本稳定性和可追溯性。 |
| Artifact lineage 由 runtime trace、tool result、模型上下文、event stream、observability record 或 graph query 补造 | 会让血缘脱离正式 fact / version 锚点。 |
| Artifact baseline 被发布说明、治理裁决、归档包、项目状态、临时清单或 current version 集合替代 | 会破坏受控版本集合和历史基线 truth。 |
| Search、preview、projection、report、reconciliation、archive / observability / sync handoff 反写 Artifact truth | 会让派生消费、维护或交接面形成第二 truth。 |
| 同步成功被误写成下游消费、report、archive、observability 或 sync handoff 已完成 | 会制造核心强一致与外围最终一致之间的伪闭环。 |
| 除 `L0-core` 外的 sibling repo 进入编译期业务依赖 | 会破坏 L1 平权 truth 域和全局依赖裁剪。 |
| 配置改变 truth 归属、外部正文边界、同步 / 异步 / 后台边界或派生不反写 | 会让配置层暗改架构主线。 |
| 旧 content backend、hash scan、graph engine、对象存储、Git 后端、P95 / 容量数字回流为当前硬主线 | 会让旧 Draft 或产品设施反向定义当前架构。 |

### 4.2 这些风险会影响哪一层架构结构?

| 风险类型 | 影响范围 |
|---|---|
| Artifact truth ownership 串线 | 职责边界、系统上下文、数据所有权、一致性策略、验收否决 |
| 外部正文 / 技术后端反向定义 truth | 数据归属、技术机制、横切安全、配置边界、演进路线 |
| Version / lineage / baseline 锚定失效 | 核心语义、关键交互、数据一致性、审计追溯、派生消费 |
| 派生 / 报告 / 交接反写 | read model、report、reconciliation、archive / observability / sync handoff、后台维护 |
| 同步 / 异步 / 后台伪闭环 | 通信方式、一致性分层、韧性 / 恢复、验收证据 |
| 编译期依赖越界 | 依赖方向、技术选型、实施边界、后续代码组织 |
| 配置越界 | 横切关注点、配置设计、实施计划、运行降级 |
| 旧口径回流 | 架构目标、技术机制、备选方案、演进路线、测试验收 |

### 4.3 当前还有哪些待确认事项?

当前待确认事项主要是还缺后续设计或测试阶段输入的问题,它们不推翻当前架构边界,但会影响后续能否 1:1 落码和验收:

1. Artifact kind、identity key、definition source、classification、specialized artifact family 如何进入后续对象模型。
2. Artifact version 的状态、候选修订、替代关系、历史版本、并发和不可无声覆盖语义如何表达。
3. Artifact lineage 的关系类型、方向、证据引用、自动化来源可信度、影响分析和跨仓消费边界如何细化。
4. Artifact baseline 的成员表达、冻结语境、历史读取、治理 / 发布 / 归档协作和回溯口径如何细化。
5. Consumable reference、read surface、projection、sync、SDK、console 的安全可消费表达如何定义。
6. 外部正文、content source、hash、content-addressing、完整性校验和 tamper 线索如何进入正式详细设计 / 配置设计。
7. 与 `L3-method-library`、`L2-runtime`、`L1-governance`、`L4-archive`、`L4-observability`、`L5-sync` 等相邻仓的正式协作协议如何闭口。
8. Artifact traceability / audit backref / handoff 与 observability、archive、sync 的交接 schema、回链验证和失败恢复口径如何表达。
9. Search / preview / report / reconciliation / read projection 的只读派生身份、stale / rebuilding / failed 状态和对账恢复口径如何表达。
10. 完整 ES / CQRS、graph lineage engine、对象存储、Git 后端、搜索产品、hash 算法是否升级为 ADR 级决策。
11. 旧性能、容量、可用性、审计覆盖率、lineage query 深度和完整性校验候选数字是否由正式负载模型和测试数据硬化。
12. 缺失的正式 `04-配置设计.md` 与 `07-实施计划.md` 如何在后续文档链中补齐。

### 4.4 哪些待确认项会影响前文结论是否成立?

这些待确认事项不会改变前文已收稳的结论:Artifact 拥有独立制品事实,外部正文不入仓,version / lineage / baseline 锚定正式 fact / version,派生和交接不反写,非 core sibling 不进入编译期依赖。它们会影响后续设计如何表达对象、状态、协议、事件、持久化、错误、配置、测试和交接。如果后续细化结果选择让外部正文、相邻仓 truth、技术后端、hash event、派生视图、event stream、graph query 或 sync copy 反向定义 Artifact truth,则会从“待确认事项”转化为阻塞风险。

### 4.5 哪些风险是当前阶段可接受的,哪些会阻塞后续推进?

当前可带约束推进的风险包括:旧产品设施和旧性能数字回流风险、完整 ES / graph engine / content backend / hash hardening 未定、API / 状态 / schema / 产品承载未定、search / preview / report / archive / observability / sync handoff 细节未定。它们不阻塞 Step 15 / Step 16,但必须在后续对应文档正式闭合。

会阻塞后续推进的是:Artifact truth 边界不清、外部正文进入 Artifact truth、version / lineage / baseline 未锚定正式 fact / version、content backend / hash event / graph query / report 定义 truth、派生 / 导出 / 维护反写、同步成功伪装外围已完成、非 core sibling 编译期依赖、配置暗改架构边界。

---

## 5. 当前文档问题诊断

| 旧 / 前序内容 | 问题 | 本轮处理 |
|---|---|---|
| 需求 Step 15 已列风险和待确认事项 | 需要转成架构层影响范围、当前处理口径和阻塞性。 | 作为本步主要输入,并映射到架构结构。 |
| Step 13 已列可接受债务和不可接受债务 | 需要区分哪些是正式风险,哪些只是后续演进或可接受债务。 | 不把所有债务自动写成风险。 |
| 旧 content backend、hash scan、graph engine、对象存储、Git 后端和性能数字线索 | 容易回流为当前架构主线。 | 写成非阻塞风险,当前只作为历史候选暂存。 |
| 旧 P95 / lineage depth / hash verify 等数字 | 缺少新版负载模型和验证来源。 | 写成待确认事项和容量演进触发线索,不作为当前硬指标。 |
| API、状态机、schema、存储和产品选择未定 | 容易诱导后续 Agent 自行补真相源。 | 写成待确认事项,明确不能在实现中脑补。 |
| 前序每步的 Q 表 | 大部分已经被后续步骤吸收。 | 本步只保留仍影响后续架构 / 设计成立的问题。 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 汇总全部前序 Q 表 | 信息完整。 | 大量问题已被后续 Step 吸收,会制造伪未定。 | 不采用。 |
| 方案 B: 拆分正式风险和待确认事项,并给出阻塞判断 | 可审查,能支撑后续概要 / 详细 / 测试 / 配置。 | 文档较长,需要严格避免写解决方案。 | 采用。 |
| 方案 C: 把 API / 状态机 / schema / 产品未定全部写成阻塞风险 | 看似保守。 | 会让架构文档承担详细设计职责。 | 不采用。 |
| 方案 D: 不保留待确认事项 | 文档干净。 | 会诱导后续 Agent 自行脑补字段、状态、端口或产品。 | 不采用。 |

### 6.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| API / 状态机 / schema 未定是否阻塞正式架构文档整理 | A. 阻塞 Step 15 / Step 16;B. 不阻塞 Step 15 / Step 16,但阻塞对应详细设计或实现 boundary 自行补字段 | B | 架构文档不能下沉详细设计,但实现前必须闭口。 |
| content backend / hash / graph engine / search 产品未定是否是架构风险 | A. 产品未定本身是阻塞风险;B. 产品未定是待确认事项,产品回流为 truth 才是阻塞风险 | B | 保护架构层和实现层分工。 |
| 完整 ES / CQRS 未定是否需要现在定论 | A. 当前必须定论;B. 保留为后续待确认和 ADR 候选,当前只固定 traceability / event collaboration / handoff | B | 避免过早锁定持久化和事件模型。 |
| 缺 `04-配置设计.md` / `07-实施计划.md` 是否阻塞 Step 15 / Step 16 | A. 阻塞;B. 不阻塞架构收尾,但进入配置 / 实施前必须闭口 | B | 文档链缺口已在台账记录,不反向推翻当前架构。 |

---

## 7. 结构化中间产物

### 7.1 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| 相邻仓、派生材料、消费副本或同步副本补造 / 迁移 / 反向定义 Artifact truth 风险 | 职责边界;系统上下文;数据所有权;一致性策略;验收否决 | 当前按 `L1-artifact` 拥有 Artifact fact、content fact context、version、lineage、baseline、consumption backref 和 traceability backref 处理;相邻仓只能引用、消费、显化或交接。 | 阻塞 | 一旦发生会让本仓不再是可审计制品真相仓。 |
| 外部正文、content backend、hash event、tamper marker 或扫描结果进入 Artifact truth 风险 | 数据归属;技术机制;横切安全;配置边界;演进路线 | 当前按外部正文禁止入仓、Artifact 只拥有内容事实语境处理;完整性和 hash 只能作为候选线索或后续设计事项。 | 阻塞 | 一旦发生会让技术设施或外部正文生命周期反向定义制品事实。 |
| Artifact version 被 current latest、候选修订、自动化再生成或外部状态无声覆盖风险 | 核心语义;关键交互;数据一致性;审计追溯;验收否决 | 当前按稳定版本事实、显式变化、候选与历史语境区分处理;不可用 current latest 替代正式版本。 | 阻塞 | 一旦发生会破坏历史版本稳定性和版本审计。 |
| Artifact lineage 由 runtime trace、tool result、模型上下文、event stream、observability record 或 graph query 补造风险 | 核心语义;数据所有权;事件协作;观测交接;lineage 演进 | 当前按 lineage truth 锚定正式 fact / version 处理;trace、tool output、event 和 graph query 只能提供线索、摘要或只读派生。 | 阻塞 | 一旦发生会让血缘脱离正式制品事实锚点。 |
| Artifact baseline 被发布说明、治理裁决、归档包、项目状态、临时清单或 current version 集合替代风险 | 核心语义;一致性策略;archive handoff;验收否决 | 当前按 baseline 是 Artifact 拥有的受控版本集合处理;外部集合只能引用 baseline 或作为消费方。 | 阻塞 | 一旦发生会破坏冻结语境和历史基线 truth。 |
| Search、preview、projection、report、reconciliation、archive / observability / sync handoff 反写 Artifact truth 风险 | read model;report;reconciliation;handoff;后台维护 | 当前按只读派生、后台维护和交接不反写处理;失败只能暴露 stale、rebuilding、failed、retryable 或 handoff-pending。 | 阻塞 | 一旦发生会形成第二 Artifact truth。 |
| 同步成功被误写成下游消费、report、archive、observability 或 sync handoff 已完成风险 | 通信方式;一致性分层;韧性 / 恢复;验收证据 | 当前同步只证明核心 Artifact 判断成立、拒绝、挂起或失败;外围消费和交接必须有独立状态。 | 阻塞 | 该风险会制造伪一致,使最终一致失败不可解释。 |
| 除 `L0-core` 外的 sibling repo 成为编译期业务依赖风险 | 依赖方向;跨仓协作;技术选型;实施边界 | 当前只允许非 core sibling 通过运行期接缝、事件、ref、snapshot、safe summary 或 handoff 协作。 | 阻塞 | 一旦发生会破坏全局依赖裁剪和 L1 平权 truth 域。 |
| 配置改变 truth 归属、外部正文边界、同步 / 异步 / 后台边界或派生不反写风险 | 横切关注点;配置设计;实施计划;运行降级 | 当前按配置不得越界处理;配置只能改变运行承载、传播节奏、派生重建或降级行为,不能改变架构边界。 | 阻塞 | 一旦发生会让配置层暗改架构主线。 |
| 旧 content backend、hash scan、graph engine、对象存储、Git 后端、P95 / 容量数字回流为当前硬主线风险 | 架构目标;技术机制;备选方案;演进路线;测试验收 | 当前只作为 historical material 和后续候选输入暂存,不得高于 Step 1~13 已收稳结论。 | 不阻塞 | 风险已识别,只要不回流为 truth source、产品前置或硬指标,可带约束推进。 |
| 完整 ES / CQRS、graph engine、content backend、hash hardening 或 search 产品被过早锁定或被完全遗忘风险 | 技术机制;备选方案;详细设计;ADR;演进路线 | 当前保留 traceability / event collaboration / handoff、lineage truth anchor、external body boundary 和 derived read surface,完整范式和产品承载后续按压力判断。 | 不阻塞 | 当前不锁定不代表排除,但后续不能由实现自行选边。 |
| 后续 Agent 因 API、状态机、schema、port、存储、配置或产品未定而自行补真相源风险 | 概要设计;详细设计;配置设计;测试方案;实现 boundary | 当前明确这些内容进入后续对应正式文档,不得在实现中临时造字段、状态、端口、mapper、evidence 或产品口径。 | 有条件阻塞 | 如果对应设计仍未闭合就进入实现,该风险会阻塞落码。 |

### 7.2 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| Artifact kind、identity key、definition source、classification 和 specialized artifact family 如何进入后续对象模型 | 概要设计;详细设计;method-library 协作;read surface | 缺正式分类 / 身份 / 定义来源 / 专门制品族群的对象表达和边界归属 | 当前只固定 Artifact fact 可识别并可回指正式来源;分类 schema 和 identity key 后续挂起 | 不影响 Artifact truth ownership,但影响后续对象和协议闭口。 |
| Artifact version 的状态、候选修订、替代关系、历史版本、并发和不可无声覆盖语义如何表达 | 详细对象契约;状态矩阵;持久化;测试方案 | 缺状态集、transition、replacement / supersede 关系、并发冲突和历史读取口径 | 当前按稳定版本事实、显式变化和不可用 current latest 替代正式版本挂起 | 后续不能由实现临时补 version state。 |
| Artifact lineage 的关系类型、方向、证据引用、自动化来源可信度、影响分析和跨仓消费边界如何细化 | Lineage 对象;事件协作;runtime / observability 协作;query / report | 缺 relation taxonomy、direction、evidence carrier、automation source、impact analysis 和消费协议 | 当前按 lineage truth 锚定正式 fact / version,trace / event / graph query 只作线索或派生挂起 | 该事项影响血缘详细设计和测试负例。 |
| Artifact baseline 的成员表达、冻结语境、历史读取、治理 / 发布 / 归档协作和回溯口径如何细化 | Baseline 对象;archive handoff;governance / work 协作;验收标准 | 缺 baseline member carrier、freeze transition、历史读取、协作协议和 drift 处理 | 当前按受控 Artifact version 集合和外部集合不得替代 baseline 挂起 | 该事项影响 baseline 详细设计和归档交接。 |
| Consumable reference、read surface、projection、sync、SDK、console 的安全可消费表达如何定义 | Query / read model;projection;sync;SDK / console;配置设计 | 缺 read surface、visibility / safety、projection identity、sync copy 和下游错误语义 | 当前按安全回指正式 Artifact truth 和下游不得反写 truth 挂起 | 该事项影响消费体验,不迁移 truth ownership。 |
| 外部正文、content source、hash、content-addressing、完整性校验和 tamper 线索如何进入正式详细设计 / 配置设计 | Content boundary;integrity;配置设计;测试方案 | 缺 content source 类型、引用有效性、hash / integrity carrier、扫描节奏和降级状态 | 当前按禁止正文入仓、Artifact 只拥有内容事实语境、完整性只作候选线索挂起 | 后续若选择后端或 hash 算法,不得改变 truth owner。 |
| 与 `L3-method-library`、`L2-runtime`、`L1-governance`、`L4-archive`、`L4-observability`、`L5-sync` 等相邻仓的正式协作协议如何闭口 | 跨仓协作;事件;adapter;handoff;测试方案 | 缺协议、事件、查询、引用、错误语义、重试和交接状态 | 当前按运行期接缝、ref、snapshot、safe summary、event、adapter、handoff 协作挂起 | 该事项影响后续接口和详细设计,不允许源码依赖。 |
| Artifact traceability / audit backref / handoff 与 observability、archive、sync 的交接 schema、回链验证和失败恢复口径如何表达 | 横切追溯;archive / observability / sync handoff;验收证据 | 缺交接 schema、回链验证、失败状态、恢复规则和不可变材料边界 | 当前只保留 Artifact 追溯回指语义和 handoff 接缝,不拥有物理 ledger / archive body / sync private copy | 不影响当前 truth 边界,但影响审计、归档和同步验收。 |
| Search / preview / report / reconciliation / read projection 的只读派生身份、stale / rebuilding / failed 状态和对账恢复口径如何表达 | Derived read model;report;reconciliation;query;测试方案 | 缺派生身份、刷新关系、stale / rebuilding / unavailable / failed 状态和对账恢复语义 | 当前按只读派生、最终一致和不得反写真相挂起 | 该事项影响读侧详细设计,不能变成写源。 |
| 完整 ES / CQRS、graph lineage engine、对象存储、Git 后端、搜索产品、hash 算法是否升级为 ADR 级决策 | ADR;技术机制;详细设计;配置设计;实施计划 | 缺对象、状态、事件、重放、查询复杂度、内容规模、产品约束和审计压力确认 | 当前作为后续演进和 ADR 候选挂起 | 当前不锁定,也不排除;不能由实现自行选边。 |
| 旧性能、容量、可用性、审计覆盖率、lineage query 深度和完整性校验候选数字是否硬化为正式 SLO | 横切性能;测试方案;验收标准;容量评估 | 缺正式负载模型、测量方法、阈值来源和验收数据 | 当前只保留结构性性能预算,旧数字不作为硬指标挂起 | 不能继承旧数字或随意补数。 |
| 缺失的正式 `04-配置设计.md` 与 `07-实施计划.md` 如何在后续文档链中补齐 | 配置设计;实施计划;项目台账;后续门禁 | 缺正式配置文档和实施计划文档 | 当前作为文档链缺口挂起,不反向影响当前架构结论 | 进入配置 / 实施前必须由对应文档正式闭口。 |

### 7.3 当前处理口径说明短文

本章把已经明确会打穿 Artifact truth、职责边界、依赖方向、数据归属、一致性分层或关键交互的问题写成风险,把仍缺对象、状态、协议、产品、容量或跨仓交接确认的问题写成待确认事项。风险的当前处理口径只说明如何保守约束或暂存,不写最终修复方案;待确认事项只说明缺什么确认和当前如何挂起,不预支详细设计结论。可接受债务和后续演进项本身不是风险,但如果后续实现用它们绕过外部正文排除、version / lineage / baseline 锚定、派生不反写或依赖裁剪,就会转化为阻塞问题。任何不确定项都不得为了形成完整叙事而回填成前文确定结论。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §15 “风险与待确认事项”直接摘录并整理本文件 §7.1、§7.2 和 §7.3。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把风险与待确认事项拆成两张表 | A. 拆开;B. 合并为问题清单;C. 写成任务 backlog | A | A 符合书写规范 §4.15,能区分已知风险和缺失确认。 | 已确认采用 A |
| 是否把旧 content backend / hash scan / graph engine / 对象存储 / 性能数字回流列为风险 | A. 列为非阻塞风险;B. 删除;C. 重新纳入主线 | A | 这是本轮重校准要防止的问题,但只要保持历史输入身份就不阻塞。 | 已确认采用 A |
| 是否把外部正文入仓、version / lineage / baseline 未锚定、派生反写、非 core 编译期依赖列为阻塞风险 | A. 列为阻塞;B. 列为不阻塞;C. 写成待确认 | A | 这些问题会直接破坏 Artifact 独立 truth 和架构边界。 | 已确认采用 A |
| 是否在本步决定具体 API / 状态 / content backend / hash / graph engine / 数据库 / 搜索产品 | A. 现在决定;B. 挂起到后续设计;C. 删除不提 | B | 架构层应固定边界和承载口径,具体产品和接口不能在本步脑补。 | 已确认采用 B |
| 是否把完整 ES / CQRS 或 graph engine 写成当前必选 | A. 当前必选;B. 保留观察,后续 ADR 决策;C. 完全排除 | B | 当前已有追溯、事件协作、handoff 和 lineage truth anchor,完整范式需等待详细设计和审计 / 查询压力验证。 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 15 的待确认事项。§7.2 所列内容均作为后续概要设计、详细设计、测试方案、验收标准、配置设计和实施计划需要继续确认的架构输入。

---

## 10. 进入下一步条件

- 已明确拆分正式风险与待确认事项。
- 已说明每项风险的影响范围、当前处理口径和阻塞性。
- 已说明每项待确认事项的影响范围、缺失确认和当前挂起口径。
- 未把任务 backlog、TODO、最终解决方案、已定结论或普通愿望写成风险 / 待确认事项。
- 未为了形成完整叙事而脑补确定性架构结论。
- 可以进入 Step 15 “ADR 与需求追溯”。
