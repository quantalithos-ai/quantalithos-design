# Step 13. 演进路线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 13
> 回填章节: `01-架构设计.md` §14 演进路线
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

说明 `L1-artifact` 当前架构主线做到哪里算成立,哪些结构债务当前可接受,哪些能力后续才进入演进主线,以及什么条件会触发下一阶段演进。

本步只讨论架构主线的结构阶段,不写项目排期、版本路线图、任务拆单、TODO 清单、未来愿望池、产品选型、数据库、对象存储、Git 后端、搜索产品、hash 算法、消息产品、部署细节、API、event、DTO、schema、worker 或实施 boundary,也不把已被前文排除的 work truth、process execution、governance decision、conversation display、workspace view、observability ledger、archive package、runtime material、method definition body 或 sync private copy 重新包装成后续演进项。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `design-calibration/01_arch_step_02_goals_constraints.md` | 已完成 | 承接架构目标、不可变约束、当前阶段取舍和非目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 承接做 / 不做、易混淆职责和边界红线。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | 已完成 | 承接运行承载、同步入口、异步输入、后台承接和交接边界。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 承接 `L0-core` 唯一编译期依赖和非 core sibling 运行期协作口径。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 承接 truth / snapshot / reference / derived separation 和一致性分层。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 承接同步 / 异步 / 后台路径分离和失败处理口径。 |
| `design-calibration/01_arch_step_10_technology_choices.md` | 已完成 | 承接关键技术机制和当前不采用口径。 |
| `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 承接当前主线方案、替代路径和保留观察事项。 |
| `design-calibration/01_arch_step_12_cross_cutting_concerns.md` | 已完成 | 承接安全、可观测、韧性、性能、配置和追溯横切约束。 |
| `projects/L1-artifact/00-需求文档.md` §13 / §14 / §15 | 已重建 | 承接需求层 NFR、验收否决项、风险与待确认事项。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 13 | 已读取 | 控制本步输出当前阶段、演进阶段、已知债务和触发条件。 |
| `standards/document/架构设计书写规范.md` §4.14 | 已读取 | 控制演进路线表、阶段边界说明和触发条件小表粒度。 |
| `projects/L1-governance/design-calibration/01_arch_step_13_evolution_path.md` | 已参考 | 只参考“当前主线成立 + 可接受债务 + 触发条件”的组织方式,不复制治理仓结论。 |
| 旧 `projects/L1-artifact/01-架构设计.md` | 旧 Draft | 仅作为旧 content backend、graph engine、hash scan、性能数字和产品设施线索的诊断输入。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 11 / 12、SOP Step 13 和书写规范 4.14 | done | 本文件 §2 |
| 读取需求风险 / NFR、旧架构演进段和 L1-governance Step 13 框架 | done | 本文件 §2 / §5 |
| 回答当前阶段足够性、第一批必须守住结构、后续演进项、可接受债务和触发条件 | done | 本文件 §4 |
| 输出演进路线表、阶段边界说明、可接受 / 不可接受债务表、触发条件表和不作为演进项清单 | done | 本文件 §7 |
| 写出 Step 16 可回填草稿并更新 flow / 项目台账 | done | 本文件 §8 |

---

## 4. SOP 问题回答

### 4.1 当前阶段做到哪里才算足够?

当前阶段做到“独立 Artifact truth + 正式边界协作主线”成立即可,不要求完整内容平台、图血缘引擎、完整事件溯源、全量对象存储、全 Git 后端、实时完整性扫描、高级搜索 / 预览 / 报告、完整归档协议、观测平台集成、同步产品体验或硬量化 SLO 同时完成。

当前阶段必须成立的结构包括:

| 当前阶段必须成立结构 | 判断口径 |
|---|---|
| 独立 Artifact truth | Artifact fact、content fact context、version、lineage、baseline、consumption backref、review / responsibility anchor、traceability / handoff 能作为制品事实主线成立。 |
| 正式承接边界 | 正式纳管、版本形成、血缘建立、baseline 冻结、读取、外部语境输入、派生维护和交接动作都必须经正式入口、ref、snapshot、safe summary、event、adapter 或 handoff 承接。 |
| 数据分层 | Artifact truth、external reference、snapshot、derived material 和 forbidden body 必须分离。 |
| 一致性分层 | 核心 Artifact truth 同步成立、拒绝或挂起;搜索、预览、报告、对账、归档、观测和同步材料最终一致。 |
| 外部正文分离 | Artifact 拥有内容事实语境,不拥有 Git / S3 / URL / DB / object store / runtime output / method body / archive package 等外部正文生命周期。 |
| Version / lineage / baseline 锚定 | 版本、血缘和基线必须锚定正式 Artifact fact / version,不由 current latest、trace、event stream、release note 或 archive package 反推。 |
| 派生不反写 | search、preview、projection、report、reconciliation、workspace / console / sync copy 和 archive / observability handoff 只能消费或交接,不能改写 Artifact truth。 |
| 依赖裁剪 | 除 `L0-core` 外,不引入非 core sibling 编译期业务依赖。 |

### 4.2 第一批必须守住哪些结构?

第一批必须守住的是会直接决定本仓定位是否成立的结构:

1. Artifact truth 独立于 work lifecycle、process execution、governance decision、conversation display、workspace view、runtime trace、method definition、observability store、archive package、console state 和 sync copy。
2. Artifact fact、content fact context、version、lineage、baseline 和 consumption backref 的核心变化必须有同步成立、拒绝、挂起或失败口径。
3. 外部输入只能通过正式引用、快照、safe summary、事件、adapter 或 handoff 进入,不能直接补造外部 truth 或复制外部正文。
4. Version、lineage 和 baseline 必须锚定正式 fact / version,不能被 current latest、自动化再生成、图查询结果、hash 事件或归档包替代。
5. Search、preview、report、projection、reconciliation、archive handoff、observability handoff 和 sync material 不能成为第二 Artifact truth。
6. 关键变化、消费、报告、对账、观测和归档准备必须能回指正式 Artifact truth。
7. 非 `L0-core` sibling repo 不进入编译期依赖。

### 4.3 哪些能力或约束留到后续阶段演进?

| 后续演进项 | 当前口径 |
|---|---|
| Artifact kind / relation taxonomy / specialized artifact families | 当前只固定 Artifact truth 主线和外部定义来源边界,不锁具体分类 schema、关系枚举或专门族群。 |
| Content source / integrity / hash hardening | 当前固定外部正文不入仓和完整性候选边界,不锁 Git / S3 / URL / DB、hash 算法、扫描频率或 tamper event。 |
| Lineage query / impact analysis / graph enhancement | 当前固定 lineage truth 锚定正式 fact / version,不让图查询引擎成为 truth source。 |
| Search / preview / report / projection / reconciliation 增强 | 当前只允许只读派生和最终一致,高级读模型、报告和对账恢复后续增强。 |
| Archive / observability / sync handoff protocol | 当前固定追溯回指和交接不反写,物理 ledger、归档包正文、同步私有状态和恢复手册由对应边界后续承接。 |
| 完整事件溯源 / 重放 / 时间旅行读取 | 当前采用 traceability / event collaboration / handoff,不把完整 ES 作为 P0 主体范式。 |
| 容量、SLO、性能指标和配置治理硬化 | 当前不继承旧 P95 / P99 / 容量 / SLA / hash 校验耗时数字,后续由负载模型、测试和配置设计硬化。 |

### 4.4 哪些设计债务当前可接受,哪些不可接受?

当前可接受债务:

| 债务 | 当前可接受原因 | 后续触发 |
|---|---|---|
| 未锁定数据库、对象存储、Git、搜索、消息、hash 或内容后端产品 | 架构当前只需固定 truth、承接、依赖、一致性和外部正文边界,产品选择不能反向定义核心。 | 概要 / 详细 / 配置 / 实施阶段需要实际承载时。 |
| 未锁定 Artifact kind、relation taxonomy、DatasetArtifact 特化和详细状态机 | 当前先保护 Artifact truth 主线,具体分类和状态属于后续对象 / 详细设计闭口。 | 分类、关系或特化对象开始影响 truth 可落码性时。 |
| 未把完整 ES / CQRS / graph engine 作为 P0 主体范式 | 当前已有 traceability、event collaboration、lineage truth anchor 和 handoff 机制,完整事件或图模型需要审计 / 查询压力证明。 | 审计重放、时间旅行读取或复杂 lineage 查询成为硬需求时。 |
| 未展开高级 search / preview / report / reconciliation | 当前只需保证派生只读和最终一致,不让消费模型定义 truth。 | 下游消费、审查或对账开始依赖高级读侧能力时。 |
| 未展开 archive / observability / sync 物理协议 | 本仓只拥有 Artifact 回指和交接语义,物理存储、归档包和同步私有状态不归本仓。 | 归档 / 观测 / 同步方提出正式恢复验证、回链或不可变交接要求时。 |
| 未量化旧性能数字为架构硬指标 | 当前缺新版负载模型和测试依据,直接继承会形成伪约束。 | 压测、验收或生产负载模型形成后。 |

当前不可接受债务:

| 债务 | 不可接受原因 |
|---|---|
| Artifact truth 边界不清 | 会让 work、process、governance、runtime、report、archive、observability 或 sync 替代制品事实。 |
| 外部正文进入 Artifact truth | 会打穿 content source、method definition、runtime material、observability record、archive package 和 sync copy 的正文归属。 |
| content backend、hash event、graph query、search view 或 report 定义 truth | 会形成第二 Artifact truth 或技术设施反向定义业务语义。 |
| version、lineage 或 baseline 未锚定正式 fact / version | 会导致 current latest、自动化再生成、trace、event stream 或归档包覆盖历史事实。 |
| derived view / report / reconciliation / archive preparation / sync copy 反写 | 会破坏只读派生和消费边界。 |
| 非 core sibling 编译期业务依赖 | 会破坏 L1 平权 truth 域和依赖裁剪。 |

### 4.5 未来哪些触发条件会迫使架构调整?

触发条件必须来自边界压力、复杂度压力、一致性压力、审计压力、恢复压力、容量压力或下游消费压力,不能来自模糊的“未来可能需要”。典型触发包括:

- Artifact kind、relation taxonomy、DatasetArtifact 或 specialized artifact family 的差异开始影响 truth 建模和消费回指。
- 外部正文来源、content integrity、hash / tamper 解释或内容可用性开始影响正式纳管、版本形成或审计复盘。
- lineage 查询深度、影响分析复杂度或跨仓消费压力超过当前只读派生和后台对账承载。
- search、preview、report、projection 或 reconciliation 开始塑造审查、消费或归档工作流。
- archive、observability 或 sync 对不可变交接、恢复验证、回链完整性或长期保留提出正式要求。
- external audit、历史重放、time travel view 或争议复盘要求当前 traceability / handoff 不足以解释事实变化。
- 负载测试、验收或生产数据证明当前核心同步路径、派生重建、交接或查询承载不足。
- 配置变更开始影响外部正文边界、version / lineage / baseline 锚定、派生不反写或 handoff 降级语义。

### 4.6 当前主线演进时,最先改变的结构面是什么?

当前主线演进时最先改变的通常是外围承接层,不是 Artifact truth center。优先增强 external reference / snapshot refresh、content integrity candidate、read projection、search / preview / report、reconciliation、handoff、traceability view、archive / observability / sync consumption boundary 和配置治理;只有当分类模型、lineage 表达、审计重放、容量隔离或恢复要求明确证明当前事实模型不足时,才考虑核心 truth center 的结构演进。

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 §12 写成阶段 1~4 路线图 | 混合项目阶段、产品增强和实现愿望,不是架构主线演进。 | 改为当前主线成立、可接受债务、后续结构演进和触发条件。 |
| graph engine、hash scan、content adapter、P95 等写成路线节点 | 产品 / 实现和旧指标过早主导架构演进。 | 降为后续触发线索,不得反向定义 Artifact truth。 |
| DatasetArtifact、quality tags、GDPR / retention 等进入阶段列表 | 部分属于详细设计、配置、归档或合规边界,未区分本仓主体职责。 | 只保留会改变 Artifact truth、外部正文或交接边界的演进。 |
| 旧文档未区分可接受债务和不可接受债务 | 后续实现可能把 truth 边界红线也当成“以后再说”。 | 本步明确债务分类和触发条件。 |
| 旧性能数字直接作为触发阈值 | 当前缺新版负载模型和验证来源。 | 不继承为硬指标,只作为容量 / SLO 演进候选。 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 把旧 content backend、hash scan、graph engine、DatasetArtifact、retention 和 P95 全部写成路线图 | 覆盖看似完整。 | 会把旧 Draft 和产品愿望包装成当前架构承诺。 | 不采用。 |
| 方案 B: 按当前主线成立、可接受债务、后续结构演进和触发条件写演进路线 | 能说明当前为什么足以成立,也能给后续演进留下判断门槛。 | 后续仍需概要 / 详细 / 配置 / 测试继续落地。 | 采用。 |
| 方案 C: 当前阶段直接锁定完整 ES、graph engine、对象存储、Git 后端和实时完整性扫描 | 实现方向明确。 | 过早锁定产品和范式,可能反向打穿 Artifact truth。 | 不采用。 |
| 方案 D: 完全不写演进路线 | 文档更短。 | 后续容易混淆可接受债务、边界红线和未来增强。 | 不采用。 |

### 6.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| 当前是否需要完整事件溯源作为主线 | A. 当前必选完整 ES / CQRS;B. 当前采用 traceability / event collaboration / handoff,完整 ES 后续由审计和重放压力触发 | B | 对齐当前主线复杂度,不提前锁持久化范式。 |
| graph lineage engine 是否作为当前演进主线前置 | A. 是;B. 否,lineage truth 先锚定正式 fact / version,查询引擎后续触发 | B | 防止查询图替代正式血缘语义。 |
| content backend / hash 是否作为当前主线硬方案 | A. 是;B. 否,当前只固定外部正文边界和完整性候选 | B | 后端和 hash 机制后续收敛,不能反向定义 truth。 |
| search / preview / report 是否可以驱动核心模型演进 | A. 可以;B. 不可以,只能作为只读派生和消费面演进 | B | 防止派生结构形成第二 Artifact truth。 |

---

## 7. 结构化中间产物

### 7.1 演进路线表

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 当前主线成立阶段 | 让独立 Artifact truth、正式边界协作、truth / reference / snapshot / derived separation、核心强一致、外围最终一致、同步 / 异步 / 后台分离、外部正文分离、version / lineage / baseline 正式锚定、只读派生和 traceability / handoff 成立。 | 暂不锁定 DB / object store / Git / search / graph / message / hash 产品;暂不硬化完整 ES、实时完整性扫描、高级 report、归档协议、sync 私有模型和硬 SLO。 | 进入概要 / 详细 / 测试 / 配置时细化对象、状态、协议、持久化、事件、配置和验收。 | 当前主线需要落成可实现边界,但尚未出现必须改造核心结构的压力。 | 当前不是“全做完”,而是先让制品事实和边界协作稳定成立。 |
| Artifact taxonomy / specialized artifact 增强阶段 | 在不改变 truth ownership 的前提下细化 Artifact kind、relation taxonomy、DatasetArtifact 或其它专门制品族群的语义边界。 | 当前允许不锁分类 schema、关系枚举、专门族群字段和状态机。 | 分类 / 关系语义、专门制品 family、可消费回指差异、后续对象与状态闭口。 | 分类差异影响 version / lineage / baseline / consumption backref 的正式判断或消费解释。 | 增强的是 Artifact 语义表达,不是让 method definition 或业务视图拥有 truth。 |
| Content source / integrity 增强阶段 | 强化外部正文引用、内容事实语境、完整性候选、hash / tamper 解释和内容可用性边界。 | 当前只固定 external body 不入仓和内容事实语境由 Artifact 拥有,不锁后端或算法。 | 内容来源策略、完整性候选、hash / tamper 解释、引用刷新、可用性降级和审计提示。 | 外部正文可用性或完整性解释开始影响正式纳管、版本形成、审计复盘或归档交接。 | 该阶段不得让 content backend、hash event 或扫描任务成为 Artifact truth source。 |
| Lineage query / impact analysis 增强阶段 | 在 lineage truth 已锚定正式 fact / version 的前提下增强影响分析、多跳查询、图视图和对账能力。 | 当前允许 lineage 查询实现后置,不引入 graph engine 作为主线前置。 | 影响分析、关系探索、图视图、派生索引、血缘对账和查询降级。 | 血缘查询复杂度、跨仓消费或审计解释超过当前派生承载能力。 | 查询引擎只能服务正式血缘,不得定义血缘 truth。 |
| 派生消费 / read surface 增强阶段 | 增强 search、preview、projection、report、workspace / console / sync 友好输出和 reconciliation。 | 当前允许派生旧视图、stale、rebuilding、failed 和 unavailable,不把派生作为 truth。 | 高级搜索、预览、报告、消费依据说明、对账恢复、读侧容量和下游消费 SLA。 | 下游消费、审查、同步或对账开始塑造关键工作流。 | 该阶段只能增强消费和展示,不得反写核心。 |
| Archive / observability / sync handoff 增强阶段 | 强化 Artifact truth 到归档、观测和同步边界的回指、交接、恢复验证和长期解释能力。 | 当前不拥有 observability physical ledger、archive package body 或 sync private copy。 | handoff protocol、回链验证、不可变交接材料、恢复校验、sync conflict 解释。 | 归档、观测、同步或外部审计要求当前交接语义不足以证明来源和完整性。 | 该阶段强化交接,不让横切仓或同步副本反向定义 Artifact truth。 |
| 事件 / 追溯 / 重放增强阶段 | 在 traceability / audit backref / event collaboration / handoff 基础上评估更强不可变事件、重放和时间旅行读取。 | 当前不硬化完整事件溯源,不把 event stream 作为 truth。 | 事件版本治理、重放窗口、time travel view、争议复盘材料和审计回放。 | external audit、恢复、重放或争议复盘要求当前追溯回指不足以解释事实变化。 | 该阶段强化审计表达,不是把事件流升级为唯一 truth。 |
| 容量 / SLO / 配置治理增强阶段 | 基于正式负载模型硬化核心同步链路、派生重建、查询、交接、配置变更和降级策略。 | 当前不继承旧 P95 / P99 / 容量 / SLA / hash 校验耗时为硬约束。 | SLO、容量模型、读写隔离、批量限流、配置清单、变更审查、压测门禁和降级策略。 | 测试、验收或生产负载证明当前承载不足,或配置变更开始影响 Artifact 边界。 | 该阶段由量化事实触发,不是提前锁定工具或数字。 |

### 7.2 阶段边界说明短文

当前阶段不是“内容后端、图查询、完整事件溯源、实时完整性扫描、高级报告和归档同步全做完才算成立”,而是先让 `L1-artifact` 的独立 Artifact truth、正式边界协作、外部正文分离、version / lineage / baseline 锚定、只读派生和追溯交接主线稳定成立。当前可接受债务之所以可接受,是因为它们暂不改变本仓是否拥有正确的制品事实,也不会让外部正文、技术后端、派生视图、事件流或同步副本反向定义核心。后续演进必须由明确的边界、复杂度、审计、恢复、容量或下游消费压力触发,不能把旧 Draft 的产品设施和未来愿望写成当前架构承诺。

### 7.3 可接受债务与不可接受债务表

| 债务类型 | 当前是否可接受 | 理由 | 后续处理 |
|---|---|---|---|
| 未锁定 DB / object store / Git / search / graph / message / hash 产品 | 可接受 | 产品承载不能反向定义 Artifact truth 和依赖边界。 | 概要 / 详细 / 配置 / 实施阶段收敛。 |
| 未锁定 Artifact kind、relation taxonomy、DatasetArtifact 特化和详细状态机 | 可接受 | 当前需要先固定 Artifact truth 主线和正式边界。 | 后续对象、状态和详细设计闭口。 |
| 未把完整 ES / CQRS 作为 P0 主体范式 | 可接受 | 当前已固定追溯、事件协作和 handoff,完整 ES 需审计 / 重放压力证明。 | 进入事件 / 追溯 / 重放增强阶段。 |
| 未引入 graph lineage engine | 可接受 | Lineage truth 先锚定正式 fact / version,查询实现可后置。 | 进入 lineage query / impact analysis 增强阶段。 |
| 未展开高级 search / preview / report / reconciliation | 可接受 | 派生消费当前只需只读、最终一致和可解释失败。 | 进入派生消费 / read surface 增强阶段。 |
| 未展开 archive / observability / sync 物理协议 | 可接受 | 物理观测、归档正文和同步私有状态不归本仓。 | 进入 handoff 增强,由对应边界承接正文。 |
| 未量化旧性能数字 | 可接受 | 当前缺正式负载模型,直接继承会伪量化。 | 进入容量 / SLO / 配置治理增强阶段。 |
| Artifact truth 边界不清 | 不可接受 | 会使本仓退化为外部系统或派生视图的副本。 | 必须当前修正。 |
| 外部正文进入 Artifact truth | 不可接受 | 会打穿 content source、runtime、method、archive、observability 和 sync 正文归属。 | 必须当前修正。 |
| content backend、hash event、graph query、search view 或 report 定义 truth | 不可接受 | 会形成第二 Artifact truth。 | 必须当前修正。 |
| version / lineage / baseline 不锚定正式 fact / version | 不可接受 | 会导致历史事实、血缘和基线被 current latest、trace 或归档包覆盖。 | 必须当前修正。 |
| derived / reconciliation / archive preparation / sync copy 反写 | 不可接受 | 会破坏只读消费和交接边界。 | 必须当前修正。 |
| 非 core sibling 编译期业务依赖 | 不可接受 | 会破坏依赖裁剪和 L1 平权 truth 域。 | 必须当前修正。 |

### 7.4 触发条件小表

| 触发条件 | 触发的演进方向 | 最先改变的结构面 | 不应改变的边界 |
|---|---|---|---|
| Artifact kind、relation taxonomy 或 specialized artifact 差异影响正式判断 | Artifact taxonomy / specialized artifact 增强 | 分类语义、关系语义、消费回指解释 | method definition 不拥有 Artifact truth |
| 外部正文可用性、hash / tamper 解释或内容完整性影响审计 | Content source / integrity 增强 | 内容引用、完整性候选、引用刷新 | content backend 不成为 truth owner |
| 血缘查询深度、影响分析或跨仓消费压力上升 | Lineage query / impact analysis 增强 | 派生索引、图视图、血缘对账 | graph query 不定义 lineage truth |
| search / preview / report / sync 输出影响关键消费工作流 | 派生消费 / read surface 增强 | 只读派生、读侧容量、对账恢复 | 派生和同步副本不反写 |
| archive / observability / sync 要求不可变交接和恢复验证 | Archive / observability / sync handoff 增强 | handoff protocol、回链验证、恢复校验 | 横切仓不定义 Artifact truth |
| external audit、争议复盘或恢复需要事件级重放 | 事件 / 追溯 / 重放增强 | event version、replay、time travel view | event stream 不替代 truth |
| 压测、验收或生产负载证明当前承载不足 | 容量 / SLO / 配置治理增强 | SLO、容量、读写隔离、限流 | 不降低核心事实一致性 |
| 配置变更开始影响外部正文边界、version / lineage / baseline 或 handoff | 容量 / SLO / 配置治理增强 | 配置清单、变更审查、回滚和追溯 | 配置不得暗改架构边界 |

### 7.5 不作为演进项的事项

| 事项 | 不作为演进项的原因 | 正确归属 |
|---|---|---|
| Work truth、WorkItem lifecycle、iteration、blocker 和项目执行 SLA | Artifact 只消费或回指工作语境,不拥有工作事实。 | `L1-work` |
| Process execution truth、Activity output、checkpoint / recovery body | Artifact 只承接过程产出语境或候选输入,不拥有执行事实。 | `L1-process` |
| Governance decision、Gate、AIIA / SoA、Nonconformity truth | Artifact 可作为证据或消费对象,不拥有治理裁决。 | `L1-governance` |
| Conversation display、review UI、workspace layout 和 console 体验 | 这些是展示和消费面,不是 Artifact truth。 | `L1-conversation` / `L1-workspace` / `L5-console` |
| Identity authentication、GlobalMember 生命周期和 role registry | Artifact 只消费 actor / responsibility 语境。 | `L1-identity` / `L0-core` |
| Method definition、standard text、artifact type definition body | Artifact 可引用定义来源,不拥有定义正文。 | `L3-method-library` |
| Runtime tool execution、agent loop、capability registry truth | Artifact 不拥有执行事实和工具能力定义。 | `L2-runtime` / `L3-capability-hub` |
| Observability physical ledger、metric store 和 alert platform | Artifact 只拥有追溯回指语义和交接材料。 | `L4-observability` |
| Archive package body、retention policy 和长期恢复手册 | Artifact 提供 version / baseline / handoff,不拥有归档包正文或恢复编排。 | `L4-archive` |
| Sync private copy、offline workspace state 和外部内容后端生命周期 | 这些只能消费或承载,不得拥有 Artifact truth。 | `L5-sync` / external infrastructure |

### 7.6 演进边界说明

`L1-artifact` 的演进必须优先保护独立 Artifact truth,而不是扩张职责。能在 external reference、snapshot refresh、content integrity candidate、derived read surface、handoff、reconciliation 或配置治理中解决的问题,不应直接改变核心 truth center。只有当分类模型、内容完整性、血缘表达、审计重放、容量隔离或恢复要求明确证明当前事实模型不足时,才考虑核心结构演进。每个后续阶段都必须继续满足六条底线:外部正文不入仓,version / lineage / baseline 锚定正式 fact / version,派生不反写,下游消费不反向绑定核心模型,外部系统不定义 Artifact truth,不引入非 core 编译期业务依赖。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §14 “演进路线”直接摘录并整理本文件 §7.1、§7.2、§7.3、§7.4、§7.5 和 §7.6。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 完整事件溯源是否当前必选 | A. 当前必选;B. 当前保留 traceability / event collaboration / handoff,后续由重放压力触发 | B | 避免过早锁定持久化和事件范式。 | 已确认采用 B |
| graph lineage engine 是否当前前置 | A. 当前前置;B. 后置到 lineage query / impact analysis 增强阶段 | B | 防止查询图替代正式血缘 truth。 | 已确认采用 B |
| content backend / hash 是否当前硬选型 | A. 当前硬选型;B. 当前只固定外部正文边界和完整性候选 | B | 后端、算法和扫描节奏后续收敛。 | 已确认采用 B |
| search / preview / report 是否可以驱动核心模型 | A. 可以;B. 不可以,只能作为只读派生和消费面演进 | B | 防止派生结构形成第二 Artifact truth。 | 已确认采用 B |
| 旧 P95 / 容量数字是否作为当前触发阈值 | A. 是;B. 否,后续由正式负载模型和测试验收重定 | B | 当前缺新版验证来源,不能伪量化。 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 14 的待确认事项。Artifact classification、relation taxonomy、DatasetArtifact 特化、content source、hash / integrity、lineage query、read projection、archive / observability / sync handoff、完整事件溯源、容量模型和配置治理是否升级为 ADR 或实施硬门禁,应等待概要、详细、配置、测试、验收和实施计划继续闭口。

---

## 10. 进入下一步条件

- 已明确当前阶段主线成立的最低结构边界。
- 已明确第一批必须守住的结构。
- 已明确当前可接受债务及其理由。
- 已明确当前不可接受债务。
- 已明确哪些能力后续才进入演进主线。
- 已明确触发下一阶段演进的条件。
- 未滑入项目排期、TODO 清单、未来愿望池、产品选型或实现计划。
- 可以进入 Step 14 “风险与待确认事项”。
