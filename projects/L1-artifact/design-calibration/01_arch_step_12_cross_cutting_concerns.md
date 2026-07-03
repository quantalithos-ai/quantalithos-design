# Step 12. 横切关注点

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 12
> 回填章节: `01-架构设计.md` §13 横切关注点
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-artifact` 中已经上升为长期横切主线约束的安全边界、可观测性、可用性 / 韧性、性能预算、配置与变更控制、审计追溯要求,并说明它们分别作用于哪些架构单元、交互边界和数据关系。

本步不写安全手册、认证实现、监控告警配置、日志字段清单、密钥脚本、性能压测脚本、恢复手册、配置文件格式、数据库、对象存储、搜索产品、消息产品、hash 算法、接口、事件、DTO、schema、部署参数、worker 或代码对象。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `design-calibration/01_arch_step_02_goals_constraints.md` | 已完成 | 提供架构目标、不可变约束、当前阶段取舍和非目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供做 / 不做、易混淆职责和边界红线。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 提供唯一编译期依赖、运行期协作和禁止依赖口径。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供 truth / snapshot / reference / forbidden body 和一致性策略。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步 / 异步 / 后台通信方式和失败语义。 |
| `design-calibration/01_arch_step_10_technology_choices.md` | 已完成 | 提供机制级技术选择和不采用口径。 |
| `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 提供当前主线方案、方案取舍和弃用路径。 |
| `projects/L1-artifact/00-需求文档.md` §13 / §14 / §15 | 已重建 | 提供需求层 NFR、验收否决项、风险与待确认事项。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 12 | 已读取 | 控制本步问题、门禁、停审和跨横切审计。 |
| `standards/document/架构设计书写规范.md` §4.13 | 已读取 | 控制横切关注点约束表、粒度和禁写范围。 |
| `projects/L1-governance/design-calibration/01_arch_step_12_cross_cutting_concerns.md` | 已参考 | 只参考“主线约束 + 单元适用性 + 停审审计”的组织方式,不复制治理仓结论。 |
| 旧 `projects/L1-artifact/01-架构设计.md` | 旧 Draft | 作为旧安全、审计、性能、内容后端、hash 和配置线索诊断输入。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 8 / 9 / 10 / 11、SOP Step 12 和书写规范 4.13 | done | 本文件 §2 |
| 读取需求 NFR / 验收 / 风险、旧架构和 L1-governance Step 12 框架 | done | 本文件 §2 / §5 |
| 回答安全、可观测、韧性、性能、配置、审计和适用性问题 | done | 本文件 §4 |
| 输出横切关注点结论、约束表、按架构单元组织的横切约束表和不适用项 | done | 本文件 §7 |
| 完成横切关注点停审和跨横切约束审计 | done | 本文件 §7.5 / §7.6 |
| 写出 Step 16 可回填草稿并更新 flow / 项目台账 | done | 本文件 §8 |

---

## 4. SOP 问题回答

### 4.1 安全边界如何处理?

安全边界围绕 Artifact truth 不被外部入口、下游消费、技术后端或派生材料打穿。所有会形成、读取、传播或维护 Artifact fact、content fact context、version、lineage、baseline、consumption backref 和 traceability backref 的路径,都必须经过正式 Artifact 边界。

work、process、governance、method-library、runtime、capability、conversation、workspace、archive、observability、SDK、console、sync、外部正文来源和内容后端都不能直接写 Artifact truth。它们只能通过 ref、snapshot、safe summary、event、adapter、handoff 或正式同步入口参与。外部正文、runtime material、method definition body、observability record、archive package body 和消费方私有副本不得因为安全或便利理由进入 Artifact truth。

### 4.2 可观测性需要覆盖哪些正式对象和关键链路?

可观测性必须覆盖 Artifact truth 形成、外部输入承接、派生消费、交接和异常边界。架构层必须能看清 fact / version / lineage / baseline / consumption backref 是否成立、拒绝、挂起、过期、不可见、未解析、失败或待交接。

关键链路包括 Artifact fact 纳管、正文 / 内容事实语境收束、版本形成与替代、血缘建立与审查、baseline 冻结与成员调整、可消费回指读取、外部语境和自动化结果送达、truth 变化传播、search / preview / projection / report / reconciliation 维护、observability / archive / sync handoff、受控维护与重建。本步要求的是状态和边界可辨识,不是指定监控平台、指标名、日志字段或告警阈值。

### 4.3 可用性和韧性需要守住什么底线?

核心 Artifact truth 写入失败时只能明确失败、拒绝、挂起或保持原状态,不得形成部分成立的 fact、无版本锚点的 version、无正式版本锚点的 lineage、成员不正式的 baseline 或指向私有副本的 consumption backref。

外部引用、外部正文、safe summary、自动化来源、快照或派生材料缺失时,只能表达 unresolved、stale、pending、waiting、failed、retryable、unavailable 或 rejected,不得补造外部 truth 或保存替代正文。search、preview、report、reconciliation、archive handoff、observability handoff、sync material 或下游消费失败,不得回滚已经成立的 Artifact truth。

### 4.4 性能预算是否需要给出口径?

当前不继承旧 Draft 或旧需求线索中的 P95、P99、容量、SLA、可用率、hash 校验耗时或审计覆盖率数字作为架构硬指标。本步只给结构性性能预算口径。

Artifact 核心同步路径不得被 search、preview、report、reconciliation、archive preparation、observability handoff、sync material、全量下游 fan-out、完整性扫描、历史追溯包或派生重建拖重。fact、content fact context、version、lineage、baseline 和 consumption backref 的成立 / 拒绝应围绕必要正式引用和边界判断收口;复杂读取、派生、报告、对账和交接通过最终一致或后台承接扩展。

### 4.5 配置如何管理,哪些配置不应散落?

配置可以影响运行承载、传播节奏、派生重建策略、导出启停、批量大小、降级行为、内容来源选择或完整性候选检查节奏,但不得改变 Artifact truth ownership、正式入口、依赖方向、同步 / 异步 / 后台边界、外部正文禁止入仓、只读派生、下游不得反写、审计追溯和交接语义。

涉及 truth 归属、外部正文边界、baseline 冻结、version / lineage 锚定、consumption backref、traceability / handoff 的配置或变更,必须可审查、可追溯、可解释。具体配置 key、文件格式、环境变量、密钥存储和部署参数留到后续配置设计或实施阶段。

### 4.6 审计与可追溯性如何被正式保证?

Artifact 必须能解释 actor / source、scope、artifact object、content fact context、version、lineage basis、baseline member、consumer、reason、result、external ref、handoff 和 maintenance action。追溯要求用于证明制品事实为什么成立、为什么拒绝、基于什么材料、哪个版本被消费、哪个血缘被审查、哪个 baseline 被冻结、如何被观测 / 归档 / 同步交接。

Artifact 拥有 Artifact audit / traceability backref 的语义,但不拥有 observability 物理 ledger、trace storage、archive package body、external audit platform、runtime trace body 或下游 report 正文。外部交接材料可以消费 Artifact 回指,但接收方状态不能反向定义 Artifact truth。

### 4.7 每个架构单元适用哪些横切约束?

`Artifact 核心语义角色` 必须同时承受安全边界、强一致、审计追溯和配置不可越界约束。`Artifact 编排 / 承接角色` 必须承受正式入口、外部引用可解析性、失败不伪成功、幂等顺序和可观测性约束。`外部能力接缝角色` 必须承受 external body 不入仓、snapshot / safe summary 不成 truth、依赖不可穿透和未解析可见约束。`派生消费辅助角色` 必须承受只读派生、最终一致、stale / rebuilding / failed 可见和不得反写约束。`技术承载角色` 必须承受产品选择不定义业务语义、配置不可越界、性能预算和交接不反写真相约束。

### 4.8 是否存在模板化空话或适用性缺失?

本步不纳入与本仓主体无关的身份凭据生命周期、治理 Policy 生效、process checkpoint 恢复、work SLA、conversation UI 可访问性、workspace 布局、observability 物理存储、archive 包恢复手册、runtime 工具沙箱、capability 注册审批、method definition 版本治理或外部产品运维。它们可能重要,但主体职责不属于 `L1-artifact`;本仓只保留与 Artifact truth、外部正文边界、派生消费、追溯交接、配置不可越界和失败语义有关的横切约束。

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 安全、审计、hash、防篡改、content backend 和性能数字混写 | 容易让技术设施、完整性机制或旧指标反向定义 Artifact truth。 | 改为横切约束表,只固定边界、保护目标和判断口径。 |
| 旧性能 / 容量 / 可用性数字直接进入架构 | 当前缺新版负载模型和验证来源。 | 不作为硬指标继承,改为结构性性能预算。 |
| observability / archive / audit store 线索贴近 truth center | 可能让物理日志、归档包或外部审计平台替代 Artifact traceability backref。 | 区分 Artifact 追溯语义与外部物理存储 / 包正文。 |
| content backend / Git / S3 / DB / hash 线索主导安全和完整性 | 容易把后端生命周期、正文副本或 hash 事件写成制品事实。 | 固定外部正文只可引用或摘要,Artifact 只拥有内容事实语境。 |
| 配置缺少边界约束 | 后续可能用配置绕过 truth ownership、同步收口或只读派生。 | 增加配置与变更控制横切约束。 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按通用非功能模板填安全、性能、可用性、审计 | 覆盖看似完整。 | 容易写空泛口号,与 Artifact 边界无关。 | 不采用。 |
| 方案 B: 只保留持续作用于 Artifact 主线的横切约束 | 与 Step 8 / 9 / 10 / 11 主线贴合,可审查。 | 后续仍需概要 / 详细 / 配置 / 测试继续落地。 | 采用。 |
| 方案 C: 把监控、告警、密钥、压测、配置 key 和恢复脚本都写进本章 | 看起来可执行。 | 越过架构层,污染配置、测试和运维边界。 | 不采用。 |
| 方案 D: 横切关注点全部后移到实施阶段 | 文档更轻。 | 后续实现缺少长期边界约束,容易串仓和私补。 | 不采用。 |

### 6.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| 是否继承旧性能 / 可用性数字 | A. 直接继承;B. 当前只给结构性预算,后续测试 / 验收量化 | B | 避免无来源数字成为架构硬门禁。 |
| 是否写具体监控字段和告警阈值 | A. 写入;B. 只定义必须可见的对象、链路和状态 | B | 架构层只约束可辨识性,不替代观测设计。 |
| 是否允许配置改变 Artifact 边界 | A. 允许;B. 不允许,配置只能在既有边界内选择运行行为 | B | truth ownership、外部正文边界和派生不反写不能由配置暗改。 |
| 是否把完整性 / hash 机制作为当前横切硬选型 | A. 是;B. 否,当前只保留完整性候选和外部正文边界 | B | hash / integrity 机制后续收敛,不能反向定义 Artifact truth。 |

---

## 7. 结构化中间产物

### 7.1 横切关注点结论

| 结论类型 | 结论 |
|---|---|
| 横切关注点结论 | 当前进入主线的横切关注点是安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制。 |
| 适用性结论 | 这些约束只作用于 Artifact truth、外部正文边界、派生消费、交接、维护和配置变更,不替相邻仓定义主体横切要求。 |
| 架构约束结论 | 任何入口、事件、后台任务、派生视图、技术后端或配置都不得绕过 Artifact truth ownership、外部正文禁止入仓、只读派生和追溯交接。 |
| 后续承接结论 | 概要、详细、配置、测试、验收和实施计划必须继承这些横切边界,但具体 schema、port、event、metric、threshold、config key 和测试脚本后续闭口。 |

### 7.2 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界:正式 Artifact 入口强制生效 | fact、content fact context、version、lineage、baseline、consumption backref 的写入和读取 | 所有改变或读取 Artifact truth 的路径都必须经过正式边界判断。 | 防止相邻仓、产品入口、runtime 或技术后端打穿制品核心。 | 这是跨入口、交互和数据关系的边界规则,不是单个接口权限。 |
| 安全边界:外部正文不得入仓 | external body、content source、Git / S3 / URL / DB、runtime output、method body、archive body | Artifact 只能保存引用、摘要、safe summary 或内容事实语境,不得拥有外部正文生命周期。 | 保护外部正文来源 truth 和 Artifact truth 独立性。 | 适用于同步纳管、预览、完整性候选、归档和同步。 |
| 安全边界:相邻仓 truth 不可穿透 | work、process、governance、method-library、runtime、capability、conversation、workspace、archive、observability、sync | 非 core sibling 仓只能通过 ref、snapshot、safe summary、event、adapter 或 handoff 协作。 | 保护 L1 平权 truth 域和 `L0-core` 唯一编译期依赖。 | 不因调用便利引入源码依赖或第二 truth。 |
| 审计与可追溯:关键 truth 变化可复盘 | fact、version、lineage、baseline、consumption backref、review / responsibility anchor | 关键变化必须解释来源、actor、object、reason、basis、result 和版本 / 血缘 / 基线锚点。 | 保护制品事实可审计、可追溯、可解释。 | 这是 Artifact 追溯语义,不是物理日志平台。 |
| 审计与可追溯:交接不反写真相 | observability、archive、sync、report、workspace / console、external consumer | 交接材料必须回指 Artifact truth,接收方状态不得反向定义本仓 truth。 | 保护下游消费和长期归档不形成第二真相。 | 交接失败只形成 pending / failed / retryable。 |
| 可观测性:核心 truth 状态可见 | fact 纳管、版本形成、血缘建立、baseline 冻结、消费回指读取 | 必须能区分成立、拒绝、挂起、不可见、未解析、过期、失败和待收束。 | 保护核心闭环是否真实成立的可审查性。 | 不指定日志字段、指标名或告警阈值。 |
| 可观测性:传播、派生和维护状态可见 | truth 变化传播、search、preview、projection、report、reconciliation、handoff、维护重建 | 必须能区分待传播、stale、rebuilding、unavailable、handoff-pending、failed 和 retryable。 | 保护最终一致和后台承接的可解释性。 | 下游未消费不得回滚 Artifact truth。 |
| 韧性 / 恢复能力:核心失败不伪成功 | 同步主真相写入、正式读取、版本 / 血缘 / 基线判断 | 核心失败只能失败、拒绝、挂起或保持原状态,不得写成半成立。 | 保护正式制品事实完整性。 | 该约束优先于调用方即时体验。 |
| 韧性 / 恢复能力:外部不可解析不补造 truth | 外部引用、外部正文、safe summary、自动化来源、快照刷新 | 外部来源缺失、过期或不可解析时只表达 unresolved、stale、pending、waiting、failed 或 rejected。 | 防止 Artifact 为继续执行而伪造外部事实或正文。 | 适用于同步判断、异步输入和后台刷新。 |
| 韧性 / 恢复能力:派生失败不污染核心 | search、preview、projection、report、reconciliation、archive / observability / sync handoff | 派生或交接失败不得回滚、覆盖或补写 Artifact truth。 | 保护核心 truth 在外围降级情况下独立成立。 | 派生失败可返回旧视图、stale、failed 或 unavailable。 |
| 性能 / 容量约束:核心同步链路不被外围拖重 | fact、content fact context、version、lineage、baseline、consumption backref | 下游 fan-out、派生重建、完整性扫描、报告、对账、归档和观测交接不得成为核心同步前置。 | 保护核心制品判断在规模增长下仍可成立。 | 当前不写具体数字,先固定结构性预算。 |
| 性能 / 容量约束:复杂消费通过派生和后台扩展 | 搜索、预览、报告、对账、历史追溯、归档准备、同步材料 | 复杂读取和批量交接必须通过派生、后台承接或后续实现扩展,不得反向塑造核心模型。 | 保护核心模型不被展示、报告和导出结构绑定。 | 具体容量、索引和缓存策略后续收敛。 |
| 配置与变更控制:配置不得越界 | 运行开关、传播节奏、派生重建、导出启停、降级策略、内容来源、完整性候选 | 配置不得改变 truth 归属、正式入口、依赖方向、外部正文边界、只读派生和追溯交接。 | 防止配置层暗改架构。 | 具体配置 key 后移配置设计。 |
| 配置与变更控制:高风险变更可追溯 | baseline、version / lineage 锚定、consumption backref、handoff、降级策略 | 影响 Artifact 主线的配置或策略变化必须可审查、可追溯、可解释。 | 保护责任语境、审计复盘和边界稳定。 | 不等同于写配置文件格式。 |

### 7.3 按架构单元组织的横切约束表

| 架构单元 | 安全边界 | 可观测性 | 韧性 / 恢复能力 | 性能 / 容量约束 | 配置与变更控制 | 审计与可追溯 | 停审结果 |
|---|---|---|---|---|---|---|---|
| `Artifact 核心语义角色` | 只能处理正式收束后的 truth,不得接收外部正文或派生反写。 | fact / version / lineage / baseline / backref 状态必须可辨识。 | 输入不闭合时失败、拒绝或保持原状态。 | 不被派生、报告、归档或观测拖重。 | 配置不得改变 truth ownership 或核心一致性。 | 关键 truth 变化必须有追溯回指。 | pass |
| `Artifact 编排 / 承接角色` | 所有外部输入必须通过正式入口、ref、snapshot 或 safe summary。 | pending / unresolved / rejected / unavailable 必须可见。 | 外部不可解析不得补造 truth。 | 同步边界只做必要判断,复杂消费后置。 | 降级和传播策略不得改变同步 / 异步 / 后台边界。 | 必须记录来源、依据、结果和交接状态。 | pass |
| `外部能力接缝角色` | 不允许相邻仓源码、正文或生命周期穿透 Artifact。 | 外部引用、快照和 safe summary 的过期 / 缺失可见。 | 缺失时 stale / unresolved / waiting,不复制正文。 | 外部检查和刷新不得阻塞核心 truth。 | 内容来源和 adapter 配置不得变成 truth 规则。 | 外部材料只作为引用或依据回指。 | pass |
| `派生消费辅助角色` | search / preview / report / projection / sync copy 不得反写。 | stale / rebuilding / failed / unavailable 必须可见。 | 派生失败不回滚核心。 | 复杂读取、报表和对账通过派生 / 后台扩展。 | 派生重建配置不得改变核心模型。 | 派生材料必须回指正式 Artifact truth。 | pass |
| `技术承载角色` | 数据库、对象存储、Git、search、queue、hash 机制不定义业务 truth。 | 技术失败必须暴露为架构允许状态。 | 承载失败不得补写或覆盖语义。 | 产品和容量策略服从核心 / 外围分离。 | 配置不得绕过边界和依赖裁剪。 | 承载材料不替代 Artifact audit backref。 | pass |

### 7.4 不进入本章的横切项

| 横切项 | 不进入本章原因 | 正确归属 |
|---|---|---|
| Identity 认证凭据、GlobalMember 生命周期、role 管理 | 主体职责不属于 Artifact。 | `L1-identity` / `L0-core` / 安全设计 |
| Governance Policy、Gate decision、AIIA / SoA 结论安全 | Artifact 只承载或引用制品事实,不拥有治理裁决。 | `L1-governance` |
| Runtime 工具沙箱、agent loop、执行恢复和 capability registry | 主体职责属于 runtime / capability 层。 | `L2-runtime` / `L3-capability-hub` |
| Method definition、Artifact kind 定义和标准版本治理 | Artifact 可引用定义,不拥有定义来源 truth。 | `L3-method-library` |
| Process checkpoint、waiting gate 和 Activity SLA | Artifact 不拥有 process execution truth。 | `L1-process` |
| Work 项目执行 SLA、iteration 承诺和 backlog 状态 | Artifact 不拥有 work execution truth。 | `L1-work` |
| Conversation UI、workspace 布局、console 可访问性 | Artifact 不拥有展示状态或 UI truth。 | `L1-conversation` / `L1-workspace` / `L5-console` |
| Observability 物理日志存储、指标平台和告警规则 | Artifact 只拥有追溯回指语义和交接材料。 | `L4-observability` |
| Archive package body、长期保留策略和恢复手册 | Artifact 提供版本 / baseline / handoff,不拥有归档包正文或恢复编排。 | `L4-archive` |

### 7.5 横切关注点停审记录

| 横切关注点 | 是否适用于本仓主线 | 是否说明作用范围 | 是否说明保护目标 | 是否未下沉实现细节 | 停审结果 |
|---|---|---|---|---|---|
| 安全边界 | pass | pass | pass | pass | pass |
| 审计与可追溯 | pass | pass | pass | pass | pass |
| 可观测性 | pass | pass | pass | pass | pass |
| 韧性 / 恢复能力 | pass | pass | pass | pass | pass |
| 性能 / 容量约束 | pass | pass | pass | pass | pass |
| 配置与变更控制 | pass | pass | pass | pass | pass |

### 7.6 跨横切约束审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在模板化空话 | pass | 每项横切约束均落到 Artifact truth、外部正文、派生、交接、维护或配置边界。 |
| 是否存在适用性缺失 | pass | 已按五类架构单元判断约束适用性,并列出不进入本章的横切项。 |
| 是否存在审计追溯缺口 | pass | fact、version、lineage、baseline、consumption backref 和 handoff 均要求 traceability backref。 |
| 是否存在配置边界遗漏 | pass | 配置不得改变 truth 归属、正式入口、外部正文边界、只读派生和追溯交接。 |
| 是否与 Step 8 数据语义冲突 | pass | 核心 truth 强一致、派生最终一致、external body forbidden 的口径保持一致。 |
| 是否与 Step 9 通信语义冲突 | pass | 同步核心、异步传播、后台派生 / 对账 / 交接的分离保持一致。 |
| 是否误写具体实现 | pass | 未写 API、event、DTO、schema、metric、threshold、config key、测试脚本或部署参数。 |

### 7.7 横切影响说明

`L1-artifact` 的横切关注点不是通用质量清单,而是长期压在 Artifact truth 主线之上的结构约束。安全、可观测、韧性、性能、配置和追溯都服务于同一条主线:Artifact truth 独立成立,外部正文不入仓,相邻仓 truth 不穿透,派生消费不反写,失败和延迟可解释,交接材料可回指正式制品事实。具体监控、告警、密钥、压测、配置 key、恢复脚本、存储产品、hash 算法和运维流程只有在不改变这些横切约束的前提下,才能在后续设计和实施阶段继续细化。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §13 “横切关注点”直接摘录并整理本文件 §7.1、§7.2、§7.3、§7.4、§7.6 和 §7.7。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把具体监控字段和告警阈值写入架构横切章节 | A. 写入;B. 不写,只定义可观测对象、链路和状态;C. 完全不写可观测性 | B | 架构层应定义可辨识状态,字段和阈值属于后续设计。 | 已确认采用 B |
| 是否把具体配置项和配置文件写入本章 | A. 写入;B. 不写,只定义配置不可越界原则;C. 不讨论配置 | B | 配置设计有独立阶段,本章只固定配置不得绕过架构主线。 | 已确认采用 B |
| 是否把完整性 / hash 机制定为当前横切硬方案 | A. 是;B. 否,只保留完整性候选和外部正文边界 | B | hash、tamper marker 和扫描频率属于后续详细 / 配置 / 测试问题。 | 已确认采用 B |
| 是否现在量化性能 / 可用性目标 | A. 现在量化;B. 当前只给结构性预算口径,后续测试 / 验收量化;C. 完全不关注 | B | 当前缺正式负载模型,但不能不约束核心链路不被外围拖重。 | 已确认采用 B |
| 是否允许配置改变 Artifact truth 边界 | A. 允许;B. 不允许,配置只能在已收稳架构边界内选择运行行为;C. 由实现决定 | B | truth、外部正文、派生和交接边界不能由配置暗改。 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 13 的待确认事项。具体监控字段、告警阈值、密钥处理、配置 key、压测指标、恢复脚本、hash / integrity 算法、对象存储 / Git / DB / search 产品、observability 存储、archive package 格式和同步协议留到配置设计、详细设计、测试方案、验收标准和实施计划继续收敛。

---

## 10. 进入下一步条件

- 已明确安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制的横切约束。
- 已说明每项横切约束的作用范围、约束要求、保护目标和边界说明。
- 已按架构单元组织横切约束,并完成停审。
- 已明确哪些横切项不属于本仓主体职责。
- 已明确当前不继承旧性能 / 可用性数字为架构硬指标。
- 未写安全手册、监控配置、告警阈值、密钥脚本、压测脚本、恢复手册、产品选型或实现机制。
- 可以进入 Step 13 “演进路线”。
