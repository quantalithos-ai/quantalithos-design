# Step 6. 定义数据边界与架构红线验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 6
> 回填章节: `06-验收标准.md` §6 数据边界与架构红线验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 定义数据边界与架构红线验收 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 2 验收范围;Step 5 功能门禁;`00-需求文档.md` BR-GOV-001~040 / AC-GOV-016~025 / VF-GOV-002~010;`01-架构设计.md` §3 / §4 / §8 / §9 / §13;`03-详细设计.md` §5 / §7 / §8;`05-测试方案.md` §5 / §6 / §13 |
| 输出文件 | `projects/L1-governance/design-calibration/06_acceptance_step_06_data_arch_redlines.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 7 |

## 2. 本步目标

把数据所有权、相邻仓边界、禁止正文、派生不反写、依赖裁剪和 P1/P2 防污染转成可检查的验收红线。

本 Step 只回答:

- 哪些数据不得由 `L1-governance` 保存。
- 哪些相邻仓、下游、外部系统或 UI 不得反向改写 Governance truth。
- 哪些 projection / read model / report / job / cache 不得反写真相。
- 哪些 P1/P2 能力不得污染 P0 验收。
- 红线失败时是否进入 Step 11 一票否决候选。

本 Step 不展开每个 Command / Query / Event / Job 的接口验收细节,不裁决状态机、事务、幂等和证据真实性细节。这些分别由 Step 7~10 收口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_02_scope.md` | 已完成 | 提供 P0/P1/P2 范围、只验接缝和 VETO 候选 |
| `06_acceptance_step_05_function_gate.md` | 已完成 | 提供功能验收项与 AC-GOV-001~015 的边界 |
| `00-需求文档.md` §10 / §11 / §14 / §16 | 已完成 | 提供 BR-GOV-001~040、数据归属、AC-GOV-016~025、VF-GOV-002~010 和追溯矩阵 |
| `01-架构设计.md` §3 / §4 / §8 / §9 / §13 | 已完成 | 提供硬约束、职责边界、依赖方向、数据所有权和横切红线 |
| `03-详细设计.md` §5 / §7 / §8 | 已完成 | 提供 contracts / domain / application 边界、public protocol body-free 约束和 query/consumer/job template |
| `05-测试方案.md` §5 | 已完成 | 提供 BR / AC / VF 覆盖矩阵和测试切口反向覆盖 |
| `05-测试方案.md` §13 | 已完成 | 提供 `EV-GOV-STATE-001`、`EV-GOV-CMD-001`、`EV-GOV-QUERY-001`、`EV-GOV-CONSUMER-001`、`EV-GOV-OUTBOX-001`、`EV-GOV-JOB-001`、`EV-GOV-REDACTION-001`、`EV-GOV-ARCH-001` 的路径 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据不得由本仓保存? | process / work / artifact / evidence / AIIA / SoA 文档正文 / archive package / conversation / identity / method definition / standard / runtime execution / capability / observability / workspace / console / external GRC 的正文或主真相不得保存为 Governance 数据。只能保存 ref、safe summary、snapshot、marker、handoff summary 或 Governance 自身结论。 |
| 哪些下游不得反向改写真相? | process、work、artifact、conversation、workspace、console、runtime、capability、observability、archive、external GRC、report/dashboard/export 下游均不得创建、修改、批准、关闭或覆盖 Governance truth。 |
| 哪些 projection / cache 不得反写真相? | governance read model、dashboard、report、reconciliation、projection rebuild、reference refresh、archive handoff、external GRC export、runtime cache、policy cache、conversation display、workspace view 均不得反写核心 truth。 |
| 哪些 P1 能力不得污染 P0? | real-like resolver、durable store、real bus、staging-like、production-like、advanced Policy DSL、complex Gate、automatic drafting、external GRC deep integration、dashboard analytics 和 capacity / SLO 只能作为 selected-run、residual 或 future,不得作为 P0 红线通过证据或绕过 P0 fake / controlled / disabled 证据。 |
| 红线失败时是否一票否决? | AC-GOV-016~025 任一失败均阻断通过。若失败命中 VF-GOV-002~010,进入 Step 11 一票否决正式裁决;当前 Step 记录候选影响,不提前替代 Step 11。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 数据边界未按 Governance truth / external snapshot / reference / derived / forbidden body 分层 | 本 Step 建立 AC-GOV-022~025 和红线验收表 |
| 旧 `06-验收标准.md` | 架构红线没有绑定 BR-GOV / VF-GOV / EV-GOV | 本 Step 将 AC-GOV-016~025 绑定正式规则、证据 ID 和 report path |
| `05-测试方案.md` §5 | 一些边界证据仍以候选族表达 | 本 Step 采用 §13 已固定正式 EV,并保留 VETO 候选到 Step 11 |
| Step 5 | 功能门禁已引用 redaction / no-write 等失败条件 | 本 Step 将这些失败条件提升为独立数据边界和架构红线验收 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据边界 | 泛化“不保存正文” | 分成正式真相、快照 / 投影、引用关系、禁止正文四类 | 验收必须能定位违规类型 |
| 架构红线 | 分散在需求 / 架构 / 测试中 | 汇总为 AC-GOV-016~025 和 RL-GOV 红线表 | 便于正式 `06` 裁决 |
| VETO 关系 | 旧文档不稳定 | 本 Step 只记录 VF 候选影响,Step 11 正式一票否决 | 保持 SOP Step 边界 |
| P1/P2 | 容易作为补证据 | 明确不得污染 P0 红线 | 防止真实环境或外围增强绕过 P0 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否把所有红线直接写成 VETO | A. Step 6 直接裁决;B. Step 6 记录候选,Step 11 正式裁决 | 采用 B。Step 6 负责可检查红线,Step 11 负责一票否决清单 |
| 是否把 AC-GOV-016~025 合并成一个数据边界门禁 | A. 合并;B. 保留规则 / 边界 / 数据归属稳定 AC | 采用 B。便于按 BR-GOV、VF-GOV 和证据定位失败 |
| 是否验真实外部系统正文未进入 Governance | A. 必须真实系统;B. P0 用 fake / controlled / disabled seam + artifact scan | 采用 B。P1 real-like 不作为 P0 前置 |
| 是否允许 report / dashboard / job 修复 truth | A. 允许维护修复;B. 禁止 | 采用 B。维护面只能写 marker / report / derived state,不得成为业务写源 |

## 8. 结构化中间产物

### 8.1 架构红线验收表

| 红线 ID | 红线 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| RL-GOV-001 | Governance truth 独立归属 | governance context、Gate / Decision、Approval、Policy、shared rules、Control、AIIA / SoA conclusion、Nonconformity、traceability record 均由 Governance 正式对象 / flow 承载 | 任一核心治理事实由 process、work、conversation、runtime、external GRC、report 或 UI 状态替代 | `TC-GOV-DOMAIN-*`;`TC-GOV-CMD-001~023`;`EV-GOV-STATE-001`;`EV-GOV-CMD-001` |
| RL-GOV-002 | 相邻仓状态不得替代 Decision truth | process waiting / Activity / checkpoint、work lifecycle、conversation UI、runtime cache 只能作为 ref / snapshot / consumer context | 任一相邻状态可直接形成、批准、关闭或覆盖 Gate / Decision | `TC-GOV-CMD-004~009`;`TC-GOV-CONSUMER-001~003`;`EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001` |
| RL-GOV-003 | 外部正文禁止入仓 | artifact/evidence/AIIA/SoA/method/runtime/observability/archive/external GRC body 被拒绝或只转为 ref / safe summary | 任一外部正文出现在 truth、outbox、audit、trace、report、projection 或 handoff 中 | `TC-GOV-CMD-030`;`TC-GOV-CONSUMER-004~009`;`TC-GOV-REDACTION-001~004`;`EV-GOV-REDACTION-001`;`EV-GOV-OUTBOX-001` |
| RL-GOV-004 | Policy truth 不得被定义层或执行层反向定义 | PolicyEffectiveFact / SharedRuleSet / PolicyConflict 拥有生效事实;method/runtime/capability 只提供 ref / summary / feedback | AIPolicyDef、Control definition、runtime cache、capability whitelist、tool execution 直接成为 Policy truth | `TC-GOV-CMD-010~013`;`TC-GOV-CONSUMER-005~007`;`EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001` |
| RL-GOV-005 | shared rules 不得被低 scope 覆盖 | 低 scope override 被拒绝、形成 conflict 或需正式评审/批准 | project、role、member、runtime 默认值或低 scope Policy 静默覆盖组织硬约束 | `TC-GOV-DOMAIN-*`;`TC-GOV-CMD-010~013`;`EV-GOV-STATE-001`;`EV-GOV-CMD-001` |
| RL-GOV-006 | 正式裁决不得原地改写 | finalized decision 变化必须走 supersede / 新事实 / trace / history | finalized decision 被原地 update 且无新治理事实和追溯 | `TC-GOV-CMD-005~006`;`TC-GOV-STATE-*`;`EV-GOV-CMD-001`;`EV-GOV-STATE-001` |
| RL-GOV-007 | 合规结论与正文来源分离 | AIIA / SoA conclusion 只保存治理结论、coverage、artifact/evidence refs 和 safe marker | 保存 AIIA / SoA 第二份正文、artifact body、evidence body 或无法回链正文来源 | `TC-GOV-CMD-016~018`;`TC-GOV-CONSUMER-004`;`TC-GOV-REDACTION-*`;`EV-GOV-CMD-001`;`EV-GOV-REDACTION-001` |
| RL-GOV-008 | Nonconformity 不得退化 | NC 必须包含正式不符合、原因、纠正、复验、关闭和责任语境 | bug、work blocker、observability alert 或备注可直接关闭 NC | `TC-GOV-CMD-019~023`;`TC-GOV-QUERY-010`;`EV-GOV-CMD-001`;`EV-GOV-QUERY-001` |
| RL-GOV-009 | Query / projection / report / job / handoff 不得反写真相 | 查询、投影重建、对账、归档准备、external export 和 job 只读 truth 或写 marker/report/derived state | 读或维护动作隐式创建、修改、批准、关闭业务 Governance truth | `TC-GOV-QUERY-015~016`;`TC-GOV-JOB-001~010`;`TC-GOV-IDEMP-*`;`EV-GOV-QUERY-001`;`EV-GOV-JOB-001`;`EV-GOV-IDEMP-001` |
| RL-GOV-010 | 非 core sibling 不得成为编译期依赖 | dependency scan 证明唯一编译期上游为 `L0-core` / core-contracts;其他仓经 ref / adapter / event / handoff 协作 | `L1-process`、`L1-work`、`L1-artifact`、`L1-identity`、`L3-method-library`、`L4-observability` 等成为 package dependency | `TC-GOV-ARCH-001`;`EV-GOV-ARCH-001` |
| RL-GOV-011 | P1/P2 不得污染 P0 红线证据 | P1/P2 selected-run、real adapter、production-like、advanced DSL、external GRC deep integration 只进入 residual / future | 用 P1/P2 结果替代 P0 fake / controlled / disabled evidence,或因 P1 unavailable 判 P0 failed / passed | `EV-GOV-CONFIG-001`;`EV-GOV-REPORT-001`;`reports/acceptance/risk-acceptance.md` |

### 8.2 AC-GOV-016~025 红线闭环矩阵

| 验收项 ID | 验收主题 | 覆盖规则 / 红线 | 通过条件 | 失败条件 | 证据 ID / report path | 裁决影响 |
|---|---|---|---|---|---|---|
| AC-GOV-016 | 不变量成立 | BR-GOV-001~011;RL-GOV-001 / 005 / 006 / 008 / 009 | domain invariant、state matrix、read/report/job no truth source 均成立 | 任一核心不变量被接受为合法状态或合法 flow | `EV-GOV-STATE-001` / `reports/runs/<run_id>/suites/contract-domain-fast.md`;`EV-GOV-CMD-001` / `reports/runs/<run_id>/suites/service-flow-fast.md` | 失败则不通过;可能触发 VF-GOV-001 / 005 / 006 / 008 / 009 |
| AC-GOV-017 | 禁止行为被阻断 | BR-GOV-012~020;RL-GOV-002~009 | sibling state、external body、automation bypass、query/job truth write 均被拒绝、挂起或转换为 ref / marker | 任一禁止行为可成功写入或修改 Governance truth | `EV-GOV-CMD-001`;`EV-GOV-QUERY-001`;`EV-GOV-CONSUMER-001`;`EV-GOV-REDACTION-001`;`EV-GOV-JOB-001` | 失败则不通过;可能触发 VF-GOV-002~009 |
| AC-GOV-018 | 显式变化成立 | BR-GOV-021~027;RL-GOV-001 / 006 / 008 | context、Gate、Decision、Approval、Policy、Control、AIIA / SoA、NC 变化只能经正式 Command / trace / history / outbox | 状态可被隐式变化、静默覆盖或无 trace/history | `EV-GOV-CMD-001`;`EV-GOV-OUTBOX-001`;`reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 失败则不通过;可能触发 VF-GOV-006 |
| AC-GOV-019 | 相邻仓边界成立 | BR-GOV-028~035;RL-GOV-002~004 / 010 | process/work/artifact/conversation/identity/method/runtime/capability/observability 只通过 ref / safe summary / snapshot / event / adapter seam 协作 | 本仓保存相邻仓主 truth/body,或形成非 core 编译期依赖 | `EV-GOV-CONSUMER-001`;`EV-GOV-REDACTION-001`;`EV-GOV-ARCH-001`;`reports/runs/<run_id>/dependency-boundary.md` | 失败则不通过;可能触发 VF-GOV-002 / 003 / 004 / 010 |
| AC-GOV-020 | 治理约束成立 | BR-GOV-036~038;RL-GOV-004 / 005 / 008 | 高影响裁决、shared rules、Control 基线、高严重 NC 均需正式责任、评审或批准条件 | 高影响自动化无授权通过;低 scope 覆盖 shared rules;高严重 NC 被普通告警关闭 | `EV-GOV-STATE-001`;`EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001` | 失败则不通过;可能触发 VF-GOV-004 / 005 / 008 |
| AC-GOV-021 | 审计约束成立 | BR-GOV-039~040;RL-GOV-006 / 009 | 关键变化、发布、消费、报告、对账、归档准备能说明来源、范围和结果,且不静默改变 truth | 关键变化无 trace/history/outbox;消费或维护结果不可解释;报告或对账静默改变 truth | `EV-GOV-CMD-001`;`EV-GOV-OUTBOX-001`;`EV-GOV-JOB-001`;`EV-GOV-REPORT-001` | 失败则不通过;可能触发 VF-GOV-006 / 009 |
| AC-GOV-022 | Governance 真相数据归属正确 | Governance truth ownership;RL-GOV-001 | 正式 truth 数据只包括 Governance context、Gate/Decision、Approval、Policy、shared rules、Control、AIIA/SoA conclusion、NC 和 traceability | truth store 混入外部主真相或缺少 Governance 自有 truth | `EV-GOV-STATE-001`;`EV-GOV-CMD-001`;`EV-GOV-REPORT-001` | 失败则不通过;可能触发 VF-GOV-001 |
| AC-GOV-023 | 外部快照不成真相 | snapshot / projection boundary;RL-GOV-009 | 外部摘要、read model、report、dashboard、reconciliation summary 可 stale / rebuild,但不形成独立 business truth | snapshot、projection、report、dashboard 或 reconciliation 被当作业务 truth source | `EV-GOV-QUERY-001`;`EV-GOV-JOB-001`;`EV-GOV-IDEMP-001` | 失败则不通过;可能触发 VF-GOV-009 |
| AC-GOV-024 | 外部引用不接管正文 | reference boundary;RL-GOV-002~004 / 007 | process/work/artifact/conversation/identity/method/runtime/capability/observability/archive 只作为 ref / safe summary / marker | ref 解析失败时复制正文、接管生命周期或保存外部 body | `EV-GOV-CONSUMER-001`;`EV-GOV-REDACTION-001`;`EV-GOV-ARCH-001` | 失败则不通过;可能触发 VF-GOV-003 / 004 / 007 / 010 |
| AC-GOV-025 | 外部正文禁止入仓 | forbidden body boundary;RL-GOV-003 / 007 | logs、metrics、audit、trace、outbox、report、artifact 均扫描无 forbidden body / secret / full sensitive ref | 任一输出或存储面保存相邻仓正文、runtime execution body、observability body、UI body 或 external GRC body | `EV-GOV-REDACTION-001` / `reports/runs/<run_id>/redaction-check.md`;`EV-GOV-REPORT-001` / `reports/runs/<run_id>/report-audit.md` | 失败则不通过;可能触发 VF-GOV-003 / 007 |

### 8.3 不得由本仓保存的数据清单

| 数据类别 | 禁止保存为 Governance truth | 允许的最小形态 |
|---|---|---|
| Process | ProcessInstance、Activity、waiting gate、checkpoint、recovery truth/body | ProcessRef、safe process summary、governance context ref、consumer receipt |
| Work | Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration、dependency、blocker truth/body | ProjectRef、WorkRef、safe work summary、stale marker |
| Artifact / Archive | Artifact、Evidence、Baseline、AIIA / SoA document、ImplementationPlan、archive package body | ArtifactRef、EvidenceRef、BaselineRef、coverage ref、archive handoff marker |
| Conversation / UI | conversation fact、space、participant scope、visibility、Gate card、review display、chat/UI body | ConversationContextRef、display ref、safe presentation marker |
| Identity | GlobalMember、Actor、Role、authn/authz、member lifecycle truth | ActorRef、MemberRef、capability snapshot summary、responsibility ref |
| Method Library | AIPolicyDef、Control definition、ProcessTemplateDef、RoleDefinition、method、standard body | DefinitionRef、MethodRef、ControlDefinitionRef、version, safe summary |
| Runtime / Capability | runtime enforcement、agent loop、tool execution、policy cache hit、plan item progress、tool result/provider body | RuntimeSignalRef、capability summary、execution risk marker |
| Observability | audit log store、metrics body、trace store、alert stream、stack trace | AlertSummaryRef、safe diagnostic ref、trace/handoff ref |
| Workspace / Console / external GRC | dashboard UI state、console config body、external GRC workflow/status/body | exported fact ref、handoff receipt, disabled/fake/controlled adapter marker |

### 8.4 P1 / P2 防污染规则

| P1/P2 能力 | P0 中允许的证明 | 禁止做法 |
|---|---|---|
| real-like resolver / durable store / real bus | fake / controlled / disabled seam + failure mapping | 用真实产品 selected-run 代替 P0 redline evidence |
| staging-like / production-like | residual / future readiness 记录 | 因未运行而判 P0 失败,或因运行过而跳过 P0 fake 证据 |
| advanced Policy DSL / simulation | 验证其不替代 PolicyEffectiveFact | 用 DSL simulation 结果直接成为 Policy truth |
| complex Gate orchestration | 验证其不替代基础 Gate / Decision truth | 用复杂编排状态直接关闭正式 Decision |
| automatic AIIA / SoA drafting | 验证草拟只作为 input | 用自动草拟正文替代 AIIA / SoA governance conclusion |
| external GRC deep integration | disabled/fake/controlled export 不定义 Governance truth | 让 external GRC status 成为 Governance truth 来源 |
| dashboard analytics / capacity / report health | 派生只读、不反写 | 让 dashboard/report/health score 创建或改写治理事实 |

### 8.5 红线停审记录

| 红线 / 验收项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| RL-GOV-001~010 | 红线均可从需求、架构、详细设计和测试证据追溯 | 通过 | VETO 正式裁决留 Step 11 |
| AC-GOV-016~021 | 规则 / 边界验收均回指 BR-GOV-001~040 和正式 EV | 通过 | 状态 / 事务细节由 Step 8 加严 |
| AC-GOV-022~025 | 数据归属验收均回指架构 §9 和 redaction / dependency / report evidence | 通过 | redaction artifact 真实性由 Step 10 加严 |
| P1/P2 防污染 | P1/P2 不作为 P0 红线通过证据 | 通过 | residual 和风险接受由 Step 13 收口 |
| 证据路径 | 使用 `reports/runs/<run_id>` 和 `artifacts/test/<run_id>` 口径 | 通过 | 正式裁决前仍需 Step 3 固定真实 `run_id` |

### 8.6 跨红线审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在数据不得保存清单缺口 | 未发现 | 见 §8.3 |
| 是否存在下游可反写 Governance truth 的口径 | 未发现 | query / job / report / dashboard / export 均禁止反写 |
| 是否存在 projection / cache 成为 truth source | 未发现 | read model、runtime cache、policy cache、dashboard 均只能派生或反馈 |
| 是否存在 P1 污染 P0 | 未发现 | 见 §8.4 |
| 是否提前替代 Step 11 VETO | 未提前 | 只记录候选 VF 影响 |
| 是否要求下游仓完整实现 | 未要求 | P0 只验 ref / snapshot / event / adapter seam |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_06_data_arch_redlines.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“架构红线验收表”“AC-GOV-016~025 红线闭环矩阵”“不得由本仓保存的数据清单”“P1 / P2 防污染规则”和“跨红线审计表”小节,了解数据边界与架构红线如何从需求、架构、详细设计和测试证据收敛。

正式 `06-验收标准.md` §6 应回填:

- 数据边界与架构红线验收覆盖 AC-GOV-016~025。
- `L1-governance` 只能拥有 Governance truth、外部安全快照 / 摘要、外部引用和派生材料,不得保存相邻仓正文或外部主真相。
- query、projection、report、dashboard、reconciliation、handoff、export、runtime cache、policy cache 和 job 均不得创建、修改、批准、关闭或覆盖 Governance truth。
- 除 `L0-core` / core-contracts 外,任何 sibling business repo 编译期依赖均为红线失败。
- AC-GOV-016~025 任一失败均阻断通过;若命中 VF-GOV-002~010,由 Step 11 正式判定一票否决。
- P1/P2 selected-run、real adapter、production-like、advanced DSL、external GRC deep integration 或 capacity evidence 不得替代 P0 红线证据。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 11 是否把全部 RL-GOV-001~010 纳入 VETO | 影响最终一票否决表 | 当前只记录 VF 候选影响;Step 11 正式裁决 |
| 是否需要为 `EV-GOV-BOUNDARY-*` / `EV-GOV-POLICY-*` 拆正式 ID | 影响 evidence index 细粒度 | 当前使用 §13 已固定正式 EV;若测试方案后续新增正式编号,Step 15 可引用 |
| dependency scan 是否覆盖 workspace metadata 和 transitive dependency | 影响 VF-GOV-010 证据强度 | 当前要求 `EV-GOV-ARCH-001`;具体扫描细节由测试方案 / 实现仓 report-audit 证明 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 数据边界和架构红线都有验收项 | 通过 | AC-GOV-016~025 均已闭环 |
| 哪些数据不得保存已明确 | 通过 | 见 §8.3 |
| 下游 / projection / cache 不反写已明确 | 通过 | 见 §8.1 / §8.2 |
| P1/P2 防污染已明确 | 通过 | 见 §8.4 |
| 可进入 Step 7 | 通过 | 下一步定义接口、事件与跨仓同步验收;进入前等待用户审查 |
