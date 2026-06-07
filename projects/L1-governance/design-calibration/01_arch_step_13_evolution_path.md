# Step 13. 演进路线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 13
> 回填章节: `01-架构设计.md` §14 演进路线
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

说明 `L1-governance` 当前架构主线做到哪里算成立,哪些结构债务当前可接受,哪些能力后续才进入演进主线,以及什么条件会触发下一阶段演进。

本步只讨论架构主线的结构阶段,不写项目排期、版本路线图、任务拆单、TODO 清单、未来愿望池、产品选型、数据库、消息中间件、规则引擎、report 工具、external GRC 产品或部署细节,也不把已被前文排除的 process execution、work truth、artifact body、conversation display、runtime execution、workspace UI、observability physical ledger、archive package body 或 external GRC truth 重新包装成后续演进项。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_02_goals_constraints.md` | 已完成 | 承接架构目标、不可变约束、当前阶段取舍和非目标 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成 | 承接做 / 不做、易混淆职责和边界红线 |
| `01_arch_step_06_container_deployment.md` | 已完成 | 承接运行承载、同步入口、异步输入和后台承接边界 |
| `01_arch_step_07_dependency_direction.md` | 已完成 | 承接 `L0-core` 唯一编译期依赖和非 core sibling 运行期协作口径 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 承接 truth / snapshot / reference / derived separation 和一致性分层 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 承接同步 / 异步 / 后台路径分离和失败处理口径 |
| `01_arch_step_10_technology_choices.md` | 已完成 | 承接关键技术机制和当前不采用口径 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 承接当前主线方案、替代路径和保留观察事项 |
| `01_arch_step_12_cross_cutting_concerns.md` | 已完成 | 承接安全、可观测、韧性、性能、配置和追溯横切约束 |
| `00_req_step_15_risks_open_questions.md` | 已完成 | 承接需求层风险和待确认事项 |
| 旧 `01-架构设计.md` | 旧 Draft | 仅作为旧 external GRC、Policy engine、report、audit store、性能数字和产品设施线索的诊断输入 |

---

## 3. SOP 问题回答

### 3.1 当前阶段做到哪里才算足够?

当前阶段做到“独立 Governance truth + 正式边界协作主线”成立即可,不要求完整事件溯源、产品级规则引擎、外部 GRC 套件、高级 report / dashboard、自动化 AIIA / SoA 起草、复杂 Gate 编排、完整归档协议或硬量化 SLO 同时完成。

当前阶段必须成立的结构包括:

| 当前阶段必须成立结构 | 判断口径 |
|---|---|
| 独立 Governance truth | governance context、Gate / Decision、Approval / responsibility、Policy effective fact / shared rules、Control applicability / review、AIIA / SoA governance conclusion、Nonconformity corrective loop、governance traceability / handoff 能作为治理事实主线成立。 |
| 正式承接边界 | 同步写入、查询、异步输入、外部反馈、report、reconciliation、archive preparation 和维护动作都必须经正式入口、ref、snapshot、safe summary、event、adapter 或 handoff 承接。 |
| 数据分层 | Governance truth、external snapshot、reference、derived view 和 external export 必须分离。 |
| 一致性分层 | 核心治理事实同步强一致成立、拒绝或挂起;下游消费、runtime cache、report、external GRC 导出、observability / archive handoff 最终一致。 |
| Policy / shared rules 保护 | Policy effective fact 和 shared rules 归 Governance,不能被 runtime cache、低 scope 配置、tool result、外部 GRC status 或 timeout fallback 覆盖。 |
| 正文排除 | Artifact / evidence / method / standard / runtime / observability / archive / external GRC 正文不进入 Governance truth。 |
| 派生不反写 | report、dashboard、workspace / console、conversation display、reconciliation、external export 和 archive preparation 只能消费或交接,不能改写治理事实。 |
| 依赖裁剪 | 除 `L0-core` 外,不引入非 core sibling 编译期业务依赖。 |

### 3.2 第一批必须守住哪些结构?

第一批必须守住的是会直接决定本仓定位是否成立的结构:

1. Governance truth 独立于 process waiting、work lifecycle、artifact body、conversation display、runtime cache、workspace view、observability ledger、archive package 和 external GRC truth。
2. Gate / Decision、Approval、Policy、Control、AIIA / SoA 和 Nonconformity 的核心变化必须有同步成立、拒绝、挂起或失败口径。
3. 外部输入只能通过正式引用、快照、safe summary、事件、adapter 或 handoff 进入,不能直接补造外部 truth。
4. report、dashboard、external export、reconciliation 和 archive preparation 不能成为第二 Governance truth。
5. Policy / shared rules 不能被低层配置、runtime 默认值、capability whitelist、policy cache 或 external GRC status 反向定义。
6. traceability / evidence / handoff 必须能解释 actor、scope、object、basis、reason、result、consumer 和交接状态。
7. 非 `L0-core` sibling repo 不进入编译期依赖。

### 3.3 哪些能力或约束留到后续阶段演进?

| 后续演进项 | 当前口径 |
|---|---|
| 完整事件溯源 / CQRS | 当前只固定 traceability / evidence / event collaboration / handoff,不把完整 ES 作为 P0 主体范式。 |
| Policy DSL / rule engine / simulation | 当前固定 Policy truth、scope、priority、conflict 和 shared rules 归属,不锁定规则引擎产品或 DSL。 |
| 复杂 Gate / Decision / Approval 编排 | 当前固定正式裁决与责任边界,复杂多角色审批、升级、委托、timeout 编排后续增强。 |
| 自动化 AIIA / SoA 起草和周期性再评估 | 当前固定治理结论、引用和评审事实,自动化生成、周期重评和复杂 evidence 生命周期后续增强。 |
| Control review / applicability 深化 | 当前固定 Control 适用和评审事实归 Governance,复杂控制矩阵、周期审查和外部标准同步后续增强。 |
| Nonconformity corrective loop 增强 | 当前固定纠正闭环 truth,复杂 root-cause analytics、reopen 策略和跨仓 workflow 后续增强。 |
| report / dashboard / external GRC 导出增强 | 当前只允许只读派生和导出,高级视图、外部套件映射和跨项目报告后续增强。 |
| observability / archive handoff 协议增强 | 当前保留治理追溯语义和交接接缝,物理 ledger、归档包正文和恢复手册后续由对应仓承接。 |
| 容量、SLO 和配置治理硬化 | 当前不继承旧 `150ms / 200ms / 50ms / 30s / 99.95%` 等伪硬指标,后续由负载模型、测试和配置设计硬化。 |

### 3.4 哪些设计债务当前可接受,哪些不可接受?

当前可接受债务:

| 债务 | 当前可接受原因 | 后续触发 |
|---|---|---|
| 未锁定数据库、消息总线、缓存、搜索、规则引擎、report 工具或 external GRC 产品 | 架构当前只需固定 truth、承接、依赖、一致性和派生边界,产品选择不能反向定义核心。 | 概要 / 详细 / 配置 / 实施阶段需要实际承载时。 |
| 未把完整 ES / CQRS 作为 P0 主体范式 | 当前已有 traceability、event collaboration 和 handoff 机制,完整事件模型需要对象、状态、事件和重放需求共同支撑。 | 审计、恢复、重放或时间旅行读取成为硬需求时。 |
| 未硬化 Policy DSL、rule engine 和 simulation | 当前核心是 Policy effective fact 和 shared rules 归属,不是规则表达产品。 | Policy 冲突、自动化授权或规则演算复杂度超过当前机制时。 |
| 未展开高级 Gate / Approval 编排 | 当前先固定正式裁决和责任边界,不把复杂审批产品化作为主线前置。 | 多人复核、升级、委托、超时和例外豁免成为常态时。 |
| 未展开完整 report / dashboard / external GRC 导出模型 | 当前只需保证派生和导出不反写,不让管理视图定义 truth。 | 外部消费开始塑造利益相关方工作流或合规交付时。 |
| 未展开 observability physical ledger / archive package body | 本仓只拥有治理追溯语义和交接材料,物理存储和归档正文属于横切仓。 | 归档 / 观测方提出正式恢复验证、回链和不可变交接要求时。 |
| 未量化旧性能数字为架构硬指标 | 当前缺新版负载模型和测试依据,直接继承会形成伪约束。 | 压测、验收或生产负载模型形成后。 |

当前不可接受债务:

| 债务 | 不可接受原因 |
|---|---|
| Governance truth 边界不清 | 会让 process、work、artifact、runtime、report 或 external GRC 替代治理事实。 |
| 外部 GRC / report / dashboard / runtime cache / policy engine 成为 truth source | 会形成第二 Governance truth 或执行层反向定义治理事实。 |
| 外部正文进入 Governance truth | 会打穿 artifact / evidence / method / standard / archive / external GRC 的正文归属。 |
| 低 scope Policy、项目配置或 runtime 默认值覆盖 shared rules | 会破坏治理安全边界和组织级硬约束。 |
| Decision / Gate / Policy / Control 成功伪装下游传播或导出已经完成 | 会把最终一致外围结果伪装成核心同步事实。 |
| derived view / report / reconciliation / archive preparation 反写真相 | 会破坏只读派生边界。 |
| 非 core sibling 编译期业务依赖 | 会破坏 L1 平权 truth 域和依赖裁剪。 |

### 3.5 未来哪些触发条件会迫使架构调整?

触发条件必须来自边界压力、复杂度压力、一致性压力、审计压力、恢复压力、容量压力或下游消费压力,不能来自模糊的“未来可能需要”。典型触发包括:

- runtime / capability 消费 Policy 的频率和影响扩大,导致 cache divergence、unsupported policy 或 shared rules conflict 具备运营影响。
- Policy 冲突、优先级、scope override、例外豁免和自动化授权场景超过当前机制。
- Gate / Approval / Decision 需要多人复核、升级、委托、超时、仲裁或撤回。
- AIIA / SoA / Control review 需要周期性再评估、更强 evidence 生命周期或跨标准映射。
- Nonconformity 数量、reopen、root-cause 和纠正动作联动超过当前闭环。
- report / dashboard / external GRC 导出开始塑造关键 stakeholder 工作流。
- audit replay、time travel、archive handoff 或 external audit 需要更强不可变事件模型。
- 负载测试、验收或生产数据证明当前核心同步路径、派生重建、交接或查询承载不足。
- 配置变更开始影响 Policy、shared rules、Decision、导出或降级边界。

### 3.6 当前主线演进时,最先改变的结构面是什么?

当前主线演进时最先改变的通常是外围承接层,不是 Governance truth center。优先增强 Policy cache / runtime consumption boundary、只读派生、report / export mapping、handoff、reference / snapshot refresh、reconciliation、archive preparation、traceability view 和配置治理;只有当审计重放、复杂 Policy 表达、容量隔离或恢复要求明确证明当前事实模型不足时,才考虑完整事件溯源、强 rule engine 或更深层核心模型演进。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| external GRC、Policy engine、report、audit store 等旧设施靠近主线 | 容易让产品设施反向定义 Governance truth | 归入后续演进或实现承载,当前只固定边界和触发条件 |
| 旧性能数字直接出现 | 当前缺新版负载模型和验证来源 | 不继承为硬指标,作为容量 / SLO 演进触发线索 |
| Gate / Policy / Control / AIIA / SoA / Nonconformity 与实现聚合草案混写 | 容易把复杂产品能力当作当前阶段前置 | 当前只要求独立 Governance truth 与正式边界协作成立 |
| report / dashboard / external export 线索缺少派生边界 | 后续可能让派生视图成为第二 truth | 明确只读派生和导出增强阶段,不得反写真相 |
| observability / archive 线索贴近治理追溯事实 | 容易让物理 ledger 或 archive body 接管治理事实 | 明确本仓只拥有追溯语义和 handoff,物理承载由对应仓演进 |
| 未区分可接受债务和不可接受债务 | 后续实现可能把边界红线也当成“以后再说” | 本步明确债务分类和触发条件 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 演进主语 | 功能、设施、产品和旧性能数字混杂 | 架构主线阶段、可接受债务、后续结构演进和触发条件 | 对齐架构规范 §4.14 |
| 当前阶段边界 | 容易理解为所有治理自动化和外部集成都要一次完成 | 当前只需独立 Governance truth 与正式边界协作成立 | 防止范围膨胀 |
| 后续演进项 | 容易形成愿望池 | 只保留会改变主线承接方式的结构演进 | 防止边界外职责回流 |
| 设计债务 | 债务性质不清 | 区分可接受债务和不可接受债务 | 保护实现阶段纪律 |
| 触发条件 | 泛泛“后续增强” | 以边界、复杂度、一致性、审计、恢复、容量和消费压力触发 | 演进必须由事实驱动 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 把旧 external GRC、Policy engine、report、audit store 和性能数字全部写成后续路线图 | 覆盖看似完整 | 会把旧 Draft 和产品愿望包装成主线承诺 | 不采用 |
| 方案 B: 按当前主线成立、可接受债务、后续结构演进和触发条件写演进路线 | 能说明当前为什么足以成立,也能给后续演进留下判断门槛 | 后续仍需详细设计 / 测试 / 配置继续落地 | 采用 |
| 方案 C: 当前阶段直接锁定完整 ES、rule engine、external GRC、dashboard 和归档协议 | 实现方向明确 | 过早锁定产品和范式,可能反向打穿 Governance truth | 不采用 |
| 方案 D: 完全不写演进路线 | 文档更短 | 后续容易混淆可接受债务、边界红线和未来增强 | 不采用 |

### 6.1 待确认问题的方案选择

#### 当前是否需要完整事件溯源作为主线?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前必选完整 ES / CQRS | 历史表达强,但过早固化持久化和事件模型 |
| 方案 B | 当前采用 traceability / event collaboration / handoff,完整 ES 后续由审计和重放压力触发 | 对齐当前主线复杂度 |

推荐方案 B。

#### Policy engine / external GRC 是否作为当前演进主线前置?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前必须选定 rule engine / external GRC 产品 | 接入目标清晰,但产品会反向定义 Governance truth |
| 方案 B | 当前只固定 Policy truth、shared rules 和 external export 边界,产品后续收敛 | 保护治理事实独立性 |

推荐方案 B。

#### report / dashboard 是否可以驱动核心模型演进?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 可以由报表和管理视图组织核心模型 | 展示推进快,但形成第二 truth |
| 方案 B | 不可以;report / dashboard 只能作为只读派生和消费面演进 | 保护核心 truth center |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 演进路线表

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 当前主线成立阶段 | 让独立 Governance truth、正式边界协作、truth / snapshot / reference / derived separation、核心强一致、外围最终一致、同步 / 异步 / 后台分离、Policy / shared rules 保护、traceability / handoff 成立。 | 暂不锁定 DB / message / cache / search / rule engine / external GRC / report 产品;暂不硬化完整 ES、Policy DSL、复杂审批编排、自动 AIIA / SoA、硬 SLO 和归档协议。 | 进入概要 / 详细 / 测试 / 配置时细化对象、状态、协议、持久化、事件、配置和验收。 | 当前主线需要落成可实现边界,但尚未出现必须改造核心结构的压力。 | 当前不是“全做完”,而是先让治理事实和边界协作稳定成立。 |
| Policy / shared rules / automation boundary 增强阶段 | 强化 Policy effective fact、shared rules、scope / priority / conflict、自动化授权、runtime cache consumption 和 capability consumption 的边界。 | 当前允许不锁定 Policy DSL、rule engine、simulation 和 runtime cache 产品。 | Policy DSL、规则冲突解释、自动化授权审计、runtime cache divergence 处理、unsupported policy 消费状态。 | Policy 冲突、例外豁免、低 scope override 或 runtime cache divergence 开始影响核心治理判断或执行安全。 | 增强的是 Policy 承接和执行消费边界,不是让 runtime cache 成为 truth。 |
| Gate / Decision / Approval 编排增强阶段 | 在不改变 Governance truth 的前提下增强多人复核、升级、委托、超时、撤回和责任链解释。 | 当前只固定正式裁决、责任语境和同步成立 / 拒绝 / 挂起口径。 | 多角色审批编排、仲裁、delegation、timeout escalation、approval evidence 生命周期。 | Gate / Decision 需要多人、跨角色、升级或例外审批成为常态,当前单一裁决口径不足。 | 该阶段不得让 process waiting state 或 conversation card 接管 Decision truth。 |
| AIIA / SoA / Control 评审增强阶段 | 强化 AIIA / SoA governance conclusion、Control applicability / review 和外部标准 / evidence 引用的生命周期。 | 当前只固定治理结论、引用、快照和正文排除,不做自动起草和周期重评主线。 | 周期性再评估、control matrix、evidence freshness、标准映射、自动草稿辅助和变更影响分析。 | 合规评审需要周期重评、跨标准映射、证据新鲜度或更强结论解释。 | Governance 拥有结论和评审事实,不拥有 artifact / evidence / method 正文。 |
| Nonconformity corrective loop 增强阶段 | 强化不符合项、纠正动作、责任、关闭依据、reopen 和 root-cause 的治理闭环。 | 当前只要求 Nonconformity truth 和纠正闭环成立,复杂分析和工作流后续增强。 | root-cause analytics、reopen policy、跨仓 corrective workflow、趋势分析和纠正有效性复核。 | 不符合项数量、重复出现、纠正失败或责任争议超过当前闭环。 | 该阶段不让 Work blocker 或 report alert 替代 Nonconformity truth。 |
| 派生消费 / report / reconciliation / external GRC 导出增强阶段 | 增强只读 report、dashboard、workspace / console、conversation display、external GRC export 和 reconciliation。 | 当前允许派生旧视图、重建、failed、retryable 和导出延迟,不把派生作为 truth。 | 高级报告、跨项目视图、外部 GRC 映射、导出恢复、对账重建、消费 SLA。 | 下游消费开始塑造 stakeholder 工作流,或导出 / 对账失败影响治理复盘和合规交付。 | 该阶段只能增强消费和导出,不得反写真相。 |
| 事件 / 追溯 / archive / observability handoff 增强阶段 | 在 traceability / evidence / event collaboration / handoff 基础上评估更强不可变事件、重放、时间旅行和正式归档交接协议。 | 当前不硬化完整 ES,不拥有 observability physical ledger 或 archive package body。 | 事件版本治理、重放窗口、time travel view、不可变审计材料、archive handoff protocol、回链验证。 | external audit、恢复、重放、归档或观测方要求当前追溯语义不足以解释事实变化。 | 该阶段强化追溯和交接,不让横切仓反向定义 Governance truth。 |
| 容量 / SLO / 配置治理增强阶段 | 基于正式负载模型硬化核心同步链路、派生重建、导出、配置变更和性能 / 可用性目标。 | 当前不继承旧 `150ms / 200ms / 50ms / 30s / 99.95%` 等数字为硬约束。 | SLO、容量模型、读写隔离、批量限流、配置清单、变更审查、降级策略和压测门禁。 | 测试、验收或生产负载证明当前承载不足,或配置变更开始影响治理边界。 | 该阶段由量化事实触发,不是提前锁定工具或数字。 |

### 7.2 阶段边界说明短文

当前阶段不是“所有治理自动化、外部集成和高级报表全做完才算成立”,而是先让 `L1-governance` 的独立 Governance truth、正式边界协作、数据分层、一致性分层、Policy / shared rules 保护和追溯交接主线稳定成立。当前可接受债务之所以可接受,是因为它们暂不改变本仓是否拥有正确的治理事实,也不会让外部正文、派生视图、runtime cache 或 external GRC 反向定义核心。后续演进必须由明确的边界、复杂度、审计、恢复、容量或下游消费压力触发,不能把旧 Draft 的产品设施和未来愿望写成当前架构承诺。

### 7.3 可接受债务与不可接受债务表

| 债务类型 | 当前是否可接受 | 理由 | 后续处理 |
|---|---|---|---|
| 未锁定 DB / message / cache / search / rule engine / report / external GRC 产品 | 可接受 | 产品承载不能反向定义 Governance truth 和依赖边界。 | 概要 / 详细 / 配置 / 实施阶段收敛。 |
| 未把完整 ES / CQRS 作为 P0 主体范式 | 可接受 | 当前已固定追溯、事件协作和 handoff,完整 ES 需审计 / 重放压力证明。 | 进入事件 / 追溯增强阶段。 |
| 未硬化 Policy DSL / simulation | 可接受 | 当前需要先固定 Policy truth 和 shared rules,不急于锁规则表达产品。 | 进入 Policy / automation boundary 增强阶段。 |
| 未展开复杂 Gate / Approval 编排 | 可接受 | 当前只需正式裁决和责任语境成立。 | 进入 Gate / Decision / Approval 编排增强阶段。 |
| 未展开自动 AIIA / SoA、周期重评和高级 Control 矩阵 | 可接受 | 当前只需治理结论、引用和评审事实成立。 | 进入 AIIA / SoA / Control 评审增强阶段。 |
| 未展开高级 report / dashboard / external GRC mapping | 可接受 | 当前只需派生只读和导出不反写。 | 进入派生消费 / external export 增强阶段。 |
| 未展开 observability ledger / archive package body | 可接受 | 物理观测和归档正文不归本仓。 | 进入 handoff 协议增强,由横切仓承接正文。 |
| 未量化旧性能数字 | 可接受 | 当前缺正式负载模型,直接继承会伪量化。 | 进入容量 / SLO / 配置治理增强阶段。 |
| Governance truth 边界不清 | 不可接受 | 会使本仓退化为外部系统或派生视图的副本。 | 必须当前修正。 |
| 外部正文进入 Governance truth | 不可接受 | 会打穿 artifact / evidence / method / standard / archive / external GRC 正文归属。 | 必须当前修正。 |
| runtime cache、external GRC、report 或 dashboard 定义 truth | 不可接受 | 会形成第二 Governance truth。 | 必须当前修正。 |
| derived / reconciliation / archive preparation 反写 | 不可接受 | 会破坏只读消费和交接边界。 | 必须当前修正。 |
| 非 core sibling 编译期业务依赖 | 不可接受 | 会破坏依赖裁剪和 L1 平权 truth 域。 | 必须当前修正。 |

### 7.4 触发条件小表

| 触发条件 | 触发的演进方向 | 最先改变的结构面 | 不应改变的边界 |
|---|---|---|---|
| Policy 冲突、shared rule override 或 runtime cache divergence 具备实际安全影响 | Policy / shared rules / automation boundary 增强 | Policy 解释、cache consumption、automation authorization | runtime cache 不成为 Policy truth |
| Gate / Approval 需要多人、升级、委托、超时或仲裁 | Gate / Decision / Approval 编排增强 | 审批编排、责任链、timeout escalation | process waiting 不拥有 Decision truth |
| AIIA / SoA / Control 需要周期重评、证据新鲜度或跨标准映射 | AIIA / SoA / Control 评审增强 | 评审周期、引用状态、control matrix | Governance 不拥有正文 |
| Nonconformity 数量、reopen 或纠正失败开始影响治理复盘 | Nonconformity corrective loop 增强 | corrective workflow、root-cause、reopen policy | Work blocker 不替代 Nonconformity truth |
| report / dashboard / external GRC 导出影响关键 stakeholder 工作流 | 派生消费 / external export 增强 | 只读派生、导出映射、对账恢复 | 派生和外部系统不反写 |
| external audit / archive / recovery 需要事件级重放或不可变交接材料 | 事件 / 追溯 / archive / observability handoff 增强 | event version、replay、handoff protocol | observability / archive 不定义 Governance truth |
| 压测、验收或生产负载证明当前承载不足 | 容量 / SLO / 配置治理增强 | SLO、容量、读写隔离、限流 | 不降低核心事实一致性 |
| 配置变更开始影响 Policy、shared rules、Decision 或降级边界 | 容量 / SLO / 配置治理增强 | 配置清单、变更审查、回滚和追溯 | 配置不得暗改架构边界 |

### 7.5 不作为演进项的事项

| 事项 | 不作为演进项的原因 | 正确归属 |
|---|---|---|
| Process execution truth、waiting gate runtime state、checkpoint / recovery body | Governance 只形成治理裁决,不拥有过程执行事实。 | `L1-process` |
| Work truth、WorkItem lifecycle、blocker、iteration 和项目执行 SLA | Governance 只消费工作语境或形成治理闭环,不拥有工作事实。 | `L1-work` |
| Artifact / evidence body、版本和内容完整性 | Governance 只保存治理结论、引用和评审事实。 | `L1-artifact` / `L4-archive` |
| Conversation display、Gate card、review UI | Conversation 只显化治理事实。 | `L1-conversation` / workspace / console |
| Identity authentication、GlobalMember 生命周期和 role registry | Governance 只消费 actor / responsibility 语境。 | `L1-identity` / `L0-core` |
| Method-library definition、standard text、control definition body | Governance 消费定义并形成生效事实,不拥有正文。 | `L3-method-library` |
| Runtime tool execution、agent loop、capability registry truth | Governance 不拥有执行事实和工具能力定义。 | `L2-runtime` / `L3-capability-hub` |
| Workspace UI、dashboard product 和 console 体验 | 这些是消费和展示面,不是 Governance truth。 | `L1-workspace` / console |
| Observability physical ledger、metric store 和 alert platform | Governance 只拥有治理追溯语义和交接材料。 | `L4-observability` |
| Archive package body、长期归档恢复手册 | Governance 只准备和交接治理材料。 | `L4-archive` |
| External GRC truth、外部产品运维和外部审计系统正文 | external GRC 只能作为导出 / 消费 / 外围增强。 | external integration / GRC system |

### 7.6 演进边界说明

`L1-governance` 的演进必须优先保护独立 Governance truth,而不是扩张职责。能在派生层、导出层、runtime cache consumption boundary、reference / snapshot layer、handoff layer、reconciliation 或配置治理中解决的问题,不应直接改变核心 truth center。只有当 Policy 表达、审计重放、复杂审批、控制评审、纠正闭环、容量隔离或恢复要求明确证明当前事实模型不足时,才考虑核心结构演进。每个后续阶段都必须继续满足六条底线:外部正文不入仓,Policy / shared rules 不被低层覆盖,派生不反写,下游消费不反向绑定核心模型,外部系统不定义 Governance truth,不引入非 core 编译期业务依赖。

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
| 是否现在锁定具体 DB / message / rule engine / report / external GRC 产品 | A. 锁定;B. 不锁定,只固定边界;C. 完全不考虑 | B | 产品承载属于后续设计,不能反向定义 Governance truth | 已确认采用 B |
| 完整 ES / CQRS 是否作为当前主线 | A. 当前必选;B. 保留观察,当前采用 traceability / event collaboration / handoff;C. 完全排除 | B | 当前需要可追溯,但完整 ES 需审计和重放压力证明 | 已确认采用 B |
| Policy engine / runtime cache 是否可以定义 Policy truth | A. 可以;B. 不可以,只作为实现 / 消费边界 | B | Policy effective fact 和 shared rules 必须归 Governance | 已确认采用 B |
| report / dashboard / external GRC export 是否可以反写核心 | A. 可以;B. 不可以,只能派生或导出 | B | 防止第二 Governance truth | 已确认采用 B |
| 是否继承旧性能数字为当前硬指标 | A. 继承;B. 不继承,后续由正式负载模型硬化;C. 完全不关心 | B | 避免伪量化,同时保留容量演进触发条件 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 14 的待确认事项。后续仍需在概要设计、详细设计、测试方案、验收标准、配置设计和实施计划中继续收敛对象模型、状态机、协议、事件、持久化、Policy 规则表达、report / export mapping、handoff protocol、容量模型和 SLO。

---

## 10. 进入下一步条件

- 已明确当前阶段主线成立的最低结构边界。
- 已明确当前可接受债务及其理由。
- 已明确当前不可接受债务和边界红线。
- 已明确哪些能力后续才进入主线。
- 已明确触发下一阶段演进的条件。
- 未写项目排期、任务拆单、TODO 清单或未来愿望池。
- 未把已排除的边界外事项重新包装成后续演进项。
- 可以进入 Step 14“风险与待确认事项”。
