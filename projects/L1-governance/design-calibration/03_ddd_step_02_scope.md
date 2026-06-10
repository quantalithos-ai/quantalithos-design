# Step 2. 明确本轮实现范围和非范围

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 2
- 回填章节:`03-详细设计.md` §2 本次详细设计目标与范围

### 2. 本步输入

- 上一步中间产物:
  - `projects/L1-governance/design-calibration/03_ddd_step_01_upstream_boundary.md`
- 上游正式文档:
  - `projects/L1-governance/00-需求文档.md`
  - `projects/L1-governance/01-架构设计.md`
  - `projects/L1-governance/02-概要设计.md`
- 概要设计承接清单:
  - `projects/L1-governance/02-概要设计.md` §12
  - `projects/L1-governance/design-calibration/02_hld_step_12_detailed_design_handoff.md`
- 概要设计风险:
  - `projects/L1-governance/02-概要设计.md` §13
  - `projects/L1-governance/design-calibration/02_hld_step_13_risks_open_questions.md`

### 3. SOP 问题回答

1. 本轮详细设计必须覆盖哪些模块?

   回答:本轮必须覆盖 `L1-governance` 核心闭环所需的全部实现模块,包括 inbound / operations、application services、domain model and policies、contracts / protocol surface、ports and external seams、persistence / projection、outbox and handoff、external GRC export preparation、config binding、observability / audit、test cuts。业务主轴必须覆盖概要设计固定的 10 个主要组成部分:`Governance truth core`、`Governance context and input management`、`Gate and decision management`、`Approval and responsibility management`、`Policy and shared rules management`、`Control and compliance conclusion management`、`Nonconformity corrective loop`、`Governance consumption and traceability`、`Derived maintenance and reconciliation`、`External context mirror support`。

2. 本轮必须定义哪些对象、接口、事件、job 和状态机?

   回答:本轮必须把概要设计第 6~9 章固定的主语全部展开为可落码契约:
   - truth / state 对象:`GovernanceContext`、`GovernanceInput`、`Gate`、`GovernanceDecision`、`ApprovalResponsibility`、`ApproverRequirement`、`ResponsibilityChain`、`PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord`、`ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion`、`NonconformityRecord`、`CorrectiveAction`、`VerificationResult`、`DerivedGovernanceViewState`、`ReferenceResolutionState`。
   - policy / guard 对象:`GovernanceTruthPolicy`、`GovernanceContextPolicy`、`DecisionPolicy`、`ApprovalResponsibilityPolicy`、`PolicyConflictPolicy`、`SharedRulesPolicy`、`PolicyScopePolicy`、`ControlApplicabilityPolicy`、`ComplianceConclusionPolicy`、`NonconformityClosurePolicy`、`ReadVisibilityPolicy`、`DerivedGovernanceViewPolicy`。
   - projection / read model 对象:`GovernanceDashboardView`、`DecisionSummaryView`、`PolicyEffectiveView`、`ControlCoverageView`、`NonconformityStatusView`、`GovernanceReconciliationReport`。
   - reference / snapshot 对象:`GovernedSubjectRef`、`GovernanceSourceRef`、`ActorCapabilitySnapshot`、`MethodPolicySnapshot`、`MethodControlSnapshot`、`EvidenceSummaryRef`、`ProcessGovernanceContextRef`、`WorkGovernanceContextRef`、`RuntimeSignalRef`。
   - audit / history / outbox 对象:`GovernanceTraceRecord`、`GovernanceAuditTrail`、`GovernanceOutboxRecord`、`DecisionRecord`、`ResponsibilityTraceRecord`、`PolicyChangeRecord`、`ControlChangeRecord`、`ComplianceConclusionRecord`、`NonconformityChangeRecord`。
   - Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 入口必须保持概要设计第 7 章名称、输入骨架、输出骨架和读写性质。
   - 状态机必须覆盖 context / input readiness、gate / decision、approval responsibility、policy / shared rules、control / compliance、nonconformity corrective、derived freshness、reference resolution、outbox publication。

3. 哪些能力属于 P1 / 后续阶段,不应在本轮展开?

   回答:本轮详细设计只覆盖核心可落码闭环和必要接缝,不展开外围增强。以下内容只保留接口接缝、状态或风险,不写成当前核心实现契约:
   - 高级治理看板、报告健康度分析、策略传播健康度分析和复杂治理分析。
   - Policy DSL、自动 policy synthesis、rule simulation、完整 rule engine 或复杂重放。
   - 超出当前骨架的复杂 Gate 编排、多阶段审批编排、自动授权优化和智能风险建议。
   - 自动 AIIA / SoA 草拟、自动证据正文生成或 artifact 正文处理。
   - external GRC 深度双向同步、外部 GRC truth 反写和供应商专属协议深度绑定。
   - 具体 DB、message bus、cache、search、object storage、audit store、scheduler、external GRC 产品选型、容量数值和生产 SLO。
   - artifact / evidence / method / process / work / runtime / conversation / identity 的正文模型。

4. 哪些内容属于测试方案、实施计划、配置设计或运维手册?

   回答:详细设计只定义代码实现契约和最小测试切口,不替代下游文档:
   - `04-配置设计.md`:完整配置项清单、profile、默认值、样例、迁移、密钥和配置加载矩阵。
   - `05-测试方案.md`:完整测试矩阵、测试数据、自动化执行计划、证据路径和回归策略。
   - `06-验收标准.md`:验收基线、准入准出、验收证据、发布红线和最终判定。
   - `07-实施计划.md`:phase / commit boundary、任务拆分、提交门禁、执行顺序、回退和交付说明。
   - 运维手册 / 部署文档:部署拓扑、告警阈值、生产 runbook、容量规划和故障处置。
   - ADR:数据库、消息系统、搜索、缓存、对象存储、审计存储、rule engine 或 external GRC 产品的架构级选型。

5. 实现者拿到本文后,应能完成哪些代码范围?

   回答:实现者应能在目标 `quantalithos-governance` 仓中完成 Rust workspace / crate / module skeleton、contracts DTO、domain 对象与 policy、application service、repository / port trait、infra fake adapter、projection / outbox / job shell、query response view、idempotency / concurrency guard、config binding、audit / trace hook 和对应单元 / contract / service / integration 测试切口。实现者不应需要自行决定 truth 归属、对象字段、状态集合、command 名称、metadata authority、幂等 digest、projection rebuild truth source、external snapshot refresh source、outbox source identity 或 phase boundary。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧版 `03-详细设计.md` 文档元信息 | 旧文档关联 2026-05-16 旧概要,并以 `GovernanceRequest / Gate / Decision / Exception / RiskAcceptance` 为旧主线 | 本轮范围以新版 `02-概要设计.md` §12 为准,旧 `03` 不作为范围来源 |
| 旧版 `03-详细设计.md` §1~§2 | 旧文档把“内容采集提示”混入详细设计正文,且只覆盖旧五类对象 | 本 Step 将范围改为实现契约范围,不继承采集式结构 |
| `02-概要设计.md` §12 | 只说明详细设计继续展开方向,尚未转成详细设计自身的范围表 | 本 Step 转写为详细设计目标、覆盖范围和非范围 |
| `02-概要设计.md` §13 | 风险与待确认事项混合了详细设计职责、后续演进和配置 / 测试 / 实施职责 | 本 Step 明确哪些属于详细设计,哪些后移到配置 / 测试 / 验收 / 实施 / 运维 / ADR |
| `04-配置设计.md` 尚未按新版 governance 主线重建 | 配置完整手册不能作为 Step 2 输入 | Step 14 只定义代码需要读取的配置引用和绑定点;正式配置手册后续单独写 |
| `05-测试方案.md` / `06-验收标准.md` 与新版 03 尚未同步 | 下游测试验收不能提前反向约束详细设计正文 | Step 16 只给新版测试切口,完整测试 / 验收后续按正式 03 回写 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 本轮范围来源 | 旧 `03`、新版 `02` 和风险清单可能混用 | 只以新版 `00/01/02` 和 `02_hld_*` 为范围来源 | 防止旧对象和旧采集提示回流 |
| 详细设计目标 | 泛化为“写得更细”或继续采集内容 | 定义为可 1:1 落码的对象、接口、状态、事务、错误、幂等和测试切口契约 | 符合详细设计书写规范 |
| 非范围 | 未在 03 校准中固定 | 明确配置、测试、验收、实施、运维、ADR、相邻仓正文和 P1 增强归属 | 防止详细设计越界 |
| 实现者可完成范围 | 依赖后续理解或实现侧自行补缺 | 明确实现者应能完成 workspace、contracts、domain、application、ports、infra fake、projection、outbox、job、tests | 便于后续 Step 3~17 承接 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 本轮只覆盖 Gate / Decision 核心写路径 | 文档量较小,可快速重建旧主线 | context / input、approval、policy、control、nonconformity、query、consumer、job 和 handoff 缺设计,实现仍会阻塞 | 不采用 |
| B. 本轮覆盖概要设计所有核心闭环和必要接缝 | 可形成可落码基线,减少实现 agent 自行补 schema / port / state 的风险 | 文档工作量较大,需要严格分 Step 写入 | 采用 |
| C. 本轮同时写完整配置 / 测试 / 验收 / 实施 / 运维内容 | 看起来一次性完整 | 混淆 `03` 与下游文档职责,会提前锁定产品、排期和证据口径 | 不采用 |

### 7. 结构化中间产物

#### 7.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳仓内实现边界 | 将 Governance truth、projection、snapshot、outbox、handoff 和 external seam 分层落到代码模块 | 实现者可以创建 workspace / crate / module / file layout |
| 收稳对象契约 | 将概要对象骨架展开为 struct / enum / value object / policy / error 契约 | 实现者可以定义 domain 与 contracts 类型,不自选字段 |
| 收稳协议契约 | 将 Command / Query / Consumer / Event / Job 骨架展开为 DTO、result、receipt、metadata 和 idempotency 规则 | 实现者可以落 `contracts` crate 和 API handler |
| 收稳处理流 | 将概要处理流展开为函数级调用链、transaction、repository 调用、outbox / trace / projection 副作用 | 实现者可以落 application service 和 fake infra |
| 收稳状态矩阵 | 将概要状态集合和迁移方向展开为 allowed / forbidden matrix、guard、错误和测试断言 | 实现者可以落 domain transition 与状态测试 |
| 收稳持久化与一致性 | 明确 truth repository、projection repository、snapshot store、trace / audit store、outbox store、UoW 和锁策略 | 实现者可以落 repository trait 与 fake adapter |
| 收稳错误 / 幂等 / 并发 | 定义错误类型、request digest、duplicate / conflict、dedup、retry、stored result 和 UoW 规则 | 实现者可以落幂等 repository 与 service guard |
| 收稳配置 / 外部绑定 | 只定义代码需要读取的配置引用、外部 adapter 绑定点和禁止配置化边界 | 后续 `04-配置设计.md` 可继续展开完整手册 |
| 收稳审计 / trace / handoff | 明确 accepted truth 的 trace、audit、outbox、archive handoff 和 external GRC export preparation 切口 | 实现者可以落 trace / audit hook、handoff marker 和 export job shell |
| 收稳测试切口 | 给出每个关键模块 / 接口 / 状态的最小测试切口 | 后续 `05-测试方案.md` 可承接为完整测试矩阵 |

#### 7.2 本轮覆盖范围表

| 范围 | 必须覆盖的设计内容 | 后续 Step |
|---|---|---|
| 文件布局 | workspace、crate、module、file、package / crate name、binary / library 边界 | Step 4 |
| 模块契约 | 主要模块、职责、不承担职责、依赖方向和内部对象分布 | Step 5 |
| 对象契约 | 所有 truth / policy / projection / reference / audit / outbox 对象字段、函数、状态和不变量 | Step 6 |
| trait / port / adapter | repository、snapshot、external ref、projection、outbox、trace、audit、handoff、external GRC、clock、id、UoW、config、fake adapter 签名 | Step 7 |
| 协议契约 | Command / Query / Consumer / Outbound Event / Job DTO、result、receipt、metadata、error mapping | Step 8 |
| 函数级处理流 | Command、Query、Consumer、Job、outbox publish、projection rebuild、snapshot refresh、reconciliation、handoff、external GRC export 的调用链和副作用 | Step 9 |
| 状态矩阵 | context / input、gate / decision、approval responsibility、policy / shared rules、control / compliance、nonconformity、derived、reference、outbox 状态 | Step 10 |
| 持久化 / 事务 | repository contract、transaction boundary、outbox 同事务、projection 异步、snapshot refresh、trace / audit append 和 lock | Step 11 |
| 错误恢复 | domain / application / protocol / infra error、reject、not_found、conflict、not_visible、stale、failed、retry / quarantine / dead-letter | Step 12 |
| 并发幂等 | idempotency key、request digest、dedup key、result_ref、duplicate、conflict、expected version、UoW 和 replay 规则 | Step 13 |
| 配置绑定 | RuntimeConfig 代码引用、adapter config、consumer config、publisher config、job config、handoff config、禁止配置化项 | Step 14 |
| 审计观测 | audit、trace、outbox evidence、handoff marker、external GRC export marker、metrics / log hook 的代码切口 | Step 15 |
| 测试切口 | unit、contract、service、integration、projection、consumer、job、state matrix、forbidden body、query no-write 最小验证 | Step 16 |
| 实施承接 | 实施前置阅读、闭环复核、未进入实施的待确认项 | Step 17 |

#### 7.3 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、验收目标重写 | `00-需求文档.md` |
| 系统上下文、依赖方向和技术方案取舍重写 | `01-架构设计.md` |
| 新增 / 删除概要设计主要组成部分、核心对象、主接口或状态集合 | 回退 `02-概要设计.md` 对应 Step |
| 完整配置 profile、默认值、JSON 示例、环境变量、密钥、迁移策略和配置矩阵 | `04-配置设计.md` |
| 完整测试矩阵、测试数据、自动化脚本、报告证据和回归策略 | `05-测试方案.md` |
| 验收基线、准入准出、验收证据、发布门禁和最终判定 | `06-验收标准.md` |
| phase / commit boundary、任务拆分、提交说明、回退计划和交付报告 | `07-实施计划.md` |
| 部署拓扑、生产告警、容量规划、on-call runbook | 运维 / 部署文档 |
| 具体 DB、message bus、cache、search、object storage、audit store、scheduler、external GRC 产品最终选型 | `04-配置设计.md` / `07-实施计划.md` / ADR |
| Identity、Process、Work、Artifact、Method、Runtime、Conversation、Observability、Archive、external GRC 正文模型 | 对应相邻仓设计文档或外部系统契约 |
| 高级治理看板、Policy DSL、复杂 Gate 编排、自动 AIIA / SoA 草拟、external GRC 深度双向同步 | 后续版本 / 产品增强 / ADR |

#### 7.4 实现者拿到本文后应能完成的代码范围

| 代码范围 | 应具备的设计输入 |
|---|---|
| Rust workspace / crate skeleton | Step 3 / Step 4 |
| `contracts` DTO / view / event / job / error | Step 6 / Step 8 / Step 12 |
| `domain` aggregate / value object / policy / state transition | Step 6 / Step 10 |
| `application` command / query / consumer / job service | Step 7 / Step 8 / Step 9 / Step 13 |
| `ports` repository / adapter / UoW / clock / id / config | Step 7 / Step 11 / Step 14 |
| `infra` fake repository / fake adapter / config loader | Step 7 / Step 11 / Step 14 |
| projection / read model rebuild | Step 6 / Step 8 / Step 9 / Step 11 |
| external reference / snapshot refresh | Step 6 / Step 7 / Step 9 / Step 11 |
| outbox / publication / trace / audit / handoff / export | Step 6 / Step 8 / Step 9 / Step 11 / Step 15 |
| unit / contract / service / integration test shell | Step 16 |

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解本轮详细设计覆盖范围、非范围和下游文档边界。

## 2. 本次详细设计目标与范围

本轮详细设计目标是把新版 `02-概要设计.md` 已经收稳的 L1-governance 代码主体框架、10 个主要组成部分、关键对象、Command / Query / Consumer / Event / Job 骨架、关键处理流、状态集合和配置影响轮廓,展开为目标实现仓可以 1:1 落码的实现契约。

### 2.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳仓内实现边界 | 将 Governance truth、projection、snapshot、outbox、handoff 和 external seam 分层落到代码模块 | workspace / crate / module / file layout |
| 收稳对象契约 | 将概要对象骨架展开为 struct / enum / value object / policy / error 契约 | domain 与 contracts 类型 |
| 收稳协议契约 | 将 Command / Query / Consumer / Event / Job 骨架展开为 DTO、result、receipt、metadata 和 idempotency 规则 | contracts crate 和 API handler |
| 收稳处理流 | 将概要处理流展开为函数级调用链、transaction、repository 调用、outbox / trace / projection 副作用 | application service 与 fake infra |
| 收稳状态矩阵 | 将概要状态集合和迁移方向展开为 allowed / forbidden matrix、guard、错误和测试断言 | domain transition 与状态测试 |
| 收稳持久化与一致性 | 明确 truth repository、projection repository、snapshot store、trace / audit store、outbox store、UoW 和锁策略 | repository trait 与 fake adapter |
| 收稳错误 / 幂等 / 并发 | 定义错误类型、request digest、duplicate / conflict、dedup、retry、stored result 和 UoW 规则 | 幂等 repository 与 service guard |
| 收稳配置 / 外部绑定 | 定义代码需要读取的配置引用、外部 adapter 绑定点和禁止配置化边界 | `04-配置设计.md` 可继续展开完整手册 |
| 收稳审计 / trace / handoff | 明确 accepted truth 的 trace、audit、outbox、archive handoff 和 external GRC export preparation 切口 | trace / audit hook、handoff marker 和 export job shell |
| 收稳测试切口 | 给出每个关键模块 / 接口 / 状态的最小测试切口 | `05-测试方案.md` 可承接为完整测试矩阵 |

### 2.2 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、验收目标重写 | `00-需求文档.md` |
| 系统上下文、依赖方向和技术方案取舍重写 | `01-架构设计.md` |
| 新增 / 删除概要设计主要组成部分、核心对象、主接口或状态集合 | 回退 `02-概要设计.md` 对应 Step |
| 完整配置 profile、默认值、JSON 示例、环境变量、密钥、迁移策略和配置矩阵 | `04-配置设计.md` |
| 完整测试矩阵、测试数据、自动化脚本、报告证据和回归策略 | `05-测试方案.md` |
| 验收基线、准入准出、验收证据、发布门禁和最终判定 | `06-验收标准.md` |
| phase / commit boundary、任务拆分、提交说明、回退计划和交付报告 | `07-实施计划.md` |
| 部署拓扑、生产告警、容量规划、on-call runbook | 运维 / 部署文档 |
| 具体 DB、message bus、cache、search、object storage、audit store、scheduler、external GRC 产品最终选型 | `04-配置设计.md` / `07-实施计划.md` / ADR |
| 相邻仓和外部系统正文模型 | 对应相邻仓设计文档或外部系统契约 |
| 高级治理看板、Policy DSL、复杂 Gate 编排、自动 AIIA / SoA 草拟、external GRC 深度双向同步 | 后续版本 / 产品增强 / ADR |

### 9. 待确认事项

- 无阻塞 Step 3 的待确认事项。
- Step 3 需要继续收稳 Rust 编码规范、源码语言、workspace 约束、提交规范和本地 sibling repo 依赖约束。
- 后续 Step 6~10 若发现需要新增 / 删除概要设计主语,必须回退 `02-概要设计.md`,不能在详细设计中暗改。
- 后续 Step 14 只定义代码引用配置和外部绑定点,不提前锁定具体产品选型或容量数值。

### 10. 进入下一步条件

- 已明确本轮详细设计覆盖所有核心可落码闭环和必要接缝。
- 已明确配置、测试、验收、实施、运维、ADR 和相邻仓正文不属于本轮详细设计正文范围。
- 已明确实现者拿到正式 `03` 后应能完成的代码范围。
- 可以进入 Step 3 “收稳编码规范、语言 / runtime、仓库约束”。
