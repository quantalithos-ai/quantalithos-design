# Step 13. 设计风险与待确认事项

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 13
> 回填章节: `02-概要设计.md` §13 设计风险与待确认事项
> 生成日期: 2026-06-11
> 状态: 已完成,等待审核后进入 Step 14

---

## 1. Step 状态 + Step 内计划

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 1~12、最新版 SOP / 书写规范和旧 Step 13 草稿 | 已完成 | §2 |
| 回答 Step 13 SOP 问题 | 已完成 | §3 |
| 诊断旧 Step 13 与当前材料的差距 | 已完成 | §4 |
| 比较改动前后口径 | 已完成 | §5 |
| 记录采用 / 不采用的设计取舍 | 已完成 | §6 |
| 输出设计风险清单、待确认事项清单和未闭口项处理口径 | 已完成 | §7 |
| 判断本 Step 是否需要拆分 | 已完成 | §8 |
| 形成正式 `02` §13 回填草稿 | 已完成 | §9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§11 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成并已获用户认可 | 提供输入不足风险和不应在概要层闭口的上游接缝 |
| `02_hld_step_02_goals_scope.md` | 已完成并已获用户认可 | 提供范围内但未闭口的 source / basis / handoff / visibility / threshold 接缝 |
| `02_hld_step_03_constraints.md` | 已完成并已获用户认可 | 提供红线、约束和 typed refs / source marker 后移项 |
| `02_hld_step_04_code_subject_framework.md` | 已完成并已获用户认可 | 提供 outbox / handoff / maintenance 分层风险 |
| `02_hld_step_05_components_boundary.md` | 已完成并已获用户认可 | 提供主要组成部分边界和禁止串线主语 |
| `02_hld_step_06_key_objects.md` | 已完成并已获用户认可 | 提供正式关键对象索引和后移 / 排除项 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成并已获用户认可 | 提供接口总表和后移到 `03/04` 的接口细节 |
| `02_hld_step_08_processing_flows.md` | 已完成并已获用户认可 | 提供处理流后移项、事务边界和 automatic remediation 排除 |
| `02_hld_step_09_state_machine.md` | 已完成并已获用户认可 | 提供状态集合、状态名和 forbidden transition 风险边界 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成并已获用户认可 | 提供异常与 forbidden body / fake delivered / report-only 风险 |
| `02_hld_step_11_configuration_impact.md` | 已完成并已获用户认可 | 提供现有 `04` 反向约束风险和配置禁止项 |
| `02_hld_step_12_detailed_design_handoff.md` | 已完成并已获用户认可 | 提供不进入承接清单、需在本 Step 收纳的未闭口内容 |
| `projects/L1-identity/00-需求文档.md` | 当前需求输入 | 提供 `OQ-ID-*`、业务规则、VETO 和验收边界 |
| `projects/L1-identity/01-架构设计.md` | 当前架构输入 | 提供架构风险、演进路径和依赖裁剪 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定 Step 13 区分设计风险和待确认事项 |
| `standards/document/概要设计书写规范.md` | 最新正式结构标准 | 规定第 13 章风险表、待确认表和禁止画图 |
| 旧 `02_hld_step_13_risks_open_questions.md` | legacy draft | 只作为诊断输入,不得直接继承为新版结论 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计层已经明确构成风险、但尚未闭环的问题有哪些?

当前构成设计风险的是会影响 `03` 是否可 1:1 落码、但在概要层不能自行补定论的事项:

- 相邻仓 / shared contract 现状未复核,可能导致 `03` 引用不存在的 `ActorContext`、trace、metadata、typed ref 或 event envelope 类型。
- role / capability source、work participation source、governance basis、memory / archive handoff、artifact evidence 等外部协议字段未闭口。
- visibility / privacy、redaction、safe summary 字段级裁剪尚未定义,会影响 query / event / trace / report schema。
- reference refresh scope、affected view / projection lookup、optimistic version / cursor 等实现读取面尚未在概要层定义,需 `03` 正式补 port / persistence。
- 现有 `04-配置设计.md` 早于新版 `02/03`,可能反向污染 runtime config、profile 和 adapter mode。
- P0 性能 / 可用性 / evidence 阈值不应沿用旧数字,需要 `05/06` 重新建立基线。

### 3.2 当前还有哪些问题尚未形成定论,只能作为待确认事项挂起?

尚未形成定论的问题包括:

- role / capability source 使用 query、event 还是组合。
- high-risk lifecycle action 的正式集合和 governance basis ref 边界。
- work participation source 的最小安全摘要与 source marker 唯一性。
- memory / archive carrier、handoff target、receipt marker 和 migration result 字段。
- visibility / privacy 的字段级裁剪矩阵和 query response envelope。
- fake / controlled / endpoint / disabled adapter 的 exact runtime semantics。
- 现有 `04` 是重写、修补还是等待新版 `03` 后处理。

### 3.3 这些未闭口项分别会影响哪些主要部分、对象、接口、处理流、状态机或配置影响轮廓?

影响范围如下:

- 角色能力摘要:影响 `RoleCapabilitySummary`、`RoleCapabilitySourceSnapshot`、`MaintainRoleCapabilitySummary`、`HandleRoleCapabilitySourceChanged` 和 source state。
- 全局生命周期:影响 `GlobalLifecycleState`、`HighRiskLifecycleGuard`、`UpdateGlobalLifecycleState` 和 basis missing / invalid / unavailable surface。
- 身份生涯记录:影响 `CareerRecord`、`AppendCareerRecord`、`HandleWorkParticipationAccepted` 和 append-only idempotency。
- 记忆引用关系与传播交接:影响 `MemoryReferenceState`、`TraceHandoffIntent`、`HandoffState`、archive / handoff flow 和 config target。
- 身份事实消费与追溯:影响 `MemberSummaryView`、`IdentityTraceRecord`、`AuditTrail`、`VisibilityPolicy`、query response 和 redaction。
- 派生维护与对账:影响 `ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport`、refresh / rebuild / report-only flow。
- 配置影响轮廓:影响 runtime config shell、adapter mode、profile evidence 和旧 `04` 去留。

### 3.4 哪些问题若不先收纳,后续详细设计会被误导?

最容易误导 `03` 的问题是:

- 把未闭口外部协议字段写成已定 DTO。
- 把 availability / visibility / redaction 细分规则临时写进 query / event schema。
- 用字符串拼接生成 ref、cursor、trace subject、handoff target 或 projection lookup identity。
- 在 fake adapter 中把 request sent 当成 delivered / published。
- 在 `03` 里为了落码直接新增 port、object、state 或 flow,但没有回退 `02`。
- 让旧 `04` 的 profile / adapter 命名反向约束新版概要和详细设计。

### 3.5 哪些内容只是任务或优化项,不应被包装成设计风险或待确认事项?

以下内容不是本 Step 的设计风险:

- 具体开发排期、commit boundary、测试执行命令和实现任务分配。
- 某个 adapter 的性能优化、缓存策略、部署脚本或运维命令。
- 文案润色、图表美化、章节排版优化。
- 未来 P1/P2 扩展能力,只要不影响 P0 主语和边界成立。
- 已在 Step 12 明确承接给 `03` 的稳定展开项,例如 object fields、trait signatures、DTO schema、state matrix、persistence details。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 13 已标“已完成” | 缺少 Step 内计划、SOP 问题回答、诊断、对比、取舍、复杂度判断和自检 | 删除后按最新版模板重建 |
| 旧风险表把部分 `03` 正常展开项写成风险 | 容易把 object fields / DTO schema / port signatures 这些已承接事项重复挂起 | 本轮只收纳未闭口和可能误导 `03` 的事项 |
| 旧待确认表较多字段级问题,但未区分是否已经由 Step 12 承接 | 会让详细设计承接清单和风险表互相冲突 | 本轮把“稳定承接”与“未闭口风险”分开 |
| 旧稿未强调 sibling repo 类型现状复核 | 实现阶段容易出现引用不存在上游类型的 blocker | 本轮新增 sibling contract reality check 风险 |
| 旧稿对现有 `04` 去留只列待确认 | Step 11 已确认旧 `04` 不能反向约束新版 `02`;这里需要升级为设计风险 | 本轮同时列为风险和待确认处理项 |
| 旧稿未点名 fake delivered / published 成功风险 | Step 10 / 11 已把 fake delivered 作为红线 | 本轮列入配置 / adapter semantics 风险 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| Step 结构 | 简要目标、输入、风险表、待确认表 | 完整包含计划、问题回答、诊断、对比、取舍、结构化产物、复杂度、回填和进入条件 |
| 风险定义 | 部分混入详细设计正常工作 | 只列会影响概要成立或误导 `03` 的未闭口项 |
| 待确认事项 | 字段级问题较散 | 按主要组成部分 / 外部接缝 / 配置 / 验收聚合 |
| 旧 `04` 处理 | 待确认项 | 明确为不能反向约束新版 `02/03` 的风险,并挂起去留决策 |
| 实现误导 | 泛泛说不能自行补 | 点名字符串拼接、fake 成功、临时 port / state / flow 等风险 |
| 后续门禁 | 只说进入下一步 | 明确 Step 14 装配时不得把风险写成已闭口结论 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 把所有 Step 待确认事项原样汇总 | 不采用 | 会重复已审核的小节,且混入已承接给 `03` 的正常展开项 |
| 只保留旧 Step 13 风险表 | 不采用 | 旧表缺少新版 Step 10~12 的 fake delivered、旧 `04`、sibling contract reality check 等风险 |
| 按“风险”和“待确认”拆表 | 采用 | 符合 SOP,也能区分已经明确有影响的风险和仍需裁决的问题 |
| 将 `03` 必做的 object / DTO / port / persistence 展开写成风险 | 不采用 | Step 12 已承接,不是风险;只有缺少正式来源或会改变主语时才是风险 |
| 在本 Step 提前裁决 source / basis / handoff / visibility schema | 不采用 | 会越过 `03` 详细设计职责,且没有读取 sibling repo 实际契约 |
| 画风险矩阵或优先级图 | 不采用 | 书写规范禁止本章画图 |

---

## 7. 结构化中间产物

### 7.1 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| Sibling repo / shared contract reality 未复核 | 影响 `03` 引用 `L0-core`、`L0-bus`、`L1-work`、`L1-governance`、`L3-method-library` 的 typed refs、metadata、event envelope、trace / actor 类型 | 概要层只保留 typed boundary;`03` Step 1~3 必须读取实际仓库和标准,发现缺口先回写设计 |
| Role / capability source protocol 未闭口 | 影响 `RoleCapabilitySummary`、`RoleCapabilitySourceSnapshot`、source resolver port、`MaintainRoleCapabilitySummary`、source changed consumer、fixture | 概要层固定 method-library ownership、body-free refs、safe summary 和 source state;字段级 DTO / port / event 在 `03` 闭口 |
| Governance basis schema 未闭口 | 影响 high-risk lifecycle command、`HighRiskLifecycleGuard`、basis resolver、state matrix、错误 / pending surface | 概要层固定高风险变化必须有 body-free basis;`03` 定义 basis ref / summary / valid / invalid / unavailable |
| Work participation source marker 未闭口 | 影响 `CareerRecord` append-only、source dedupe、`HandleWorkParticipationAccepted`、career correction 和 duplicate replay | 概要层固定 work owns ProjectMember truth、identity 只保存 source marker / safe summary;`03` 闭口 source marker schema 和 unique key |
| Memory / archive carrier、handoff target 与 receipt marker 未闭口 | 影响 `MemoryReferenceState`、`TraceHandoffIntent`、`HandoffState`、archive handoff flow、`04` target config | 概要层固定 ref-only、pending / delivered / failed marker 和 no receipt body;`03/04` 闭口 target / receipt / carrier schema |
| Visibility / privacy marker 字段级矩阵未闭口 | 影响 `MemberSummaryView`、`IdentityTraceRecord`、`AuditTrail`、Query DTO、Outbound Event payload、redaction tests | 概要层固定 not visible / redacted / stale / degraded surface;`03` 定义字段级裁剪和 public marker |
| Reference refresh scope、affected views 和 projection lookup 读取面未闭口 | 影响 `ProjectionState`、`ReferenceResolutionState`、rebuild / refresh job、query stale marker、partial report | 概要层固定不得扫描 / 拼接 / 反写真相;`03` 必须定义正式 repository / port 读取面和 missing semantics |
| Optimistic version、cursor 和 id generator 来源未闭口 | 影响 repository save、duplicate replay、projection refresh、outbox / handoff、fake runtime 等价语义 | 概要层只固定需要 version / cursor / stable id;`03` 必须定义生成责任、事务时序和 fake 等价 |
| Outbox payload snapshot 和 event envelope 未闭口 | 影响 canonical outbound events、publisher、stored result、redaction、downstream consumer | 概要层固定 accepted fact material、body-free payload marker 和 publish 后置;`03` 定义 payload snapshot / envelope / topic binding |
| Fake / controlled adapter 可能伪造 published / delivered 成功 | 影响 outbox / handoff 状态、测试可信度、验收 evidence | Step 10 / 11 已设为禁止配置化边界;`03/04/05` 必须定义 fake 只能返回受控 marker,不得把 request sent 当 delivered |
| 现有 `04-配置设计.md` 早于新版 `02/03` | 影响 runtime config、profile、adapter mode、entry args、config evidence | 当前 `04` 不反向约束新版 `02`;新版 `03` 后决定重写或修补 `04` |
| P0 性能 / 可用性 / evidence 阈值未定 | 影响 `05-测试方案.md`、`06-验收标准.md` 和 release gate | 概要层不继承旧硬阈值;`05/06` 重新建立 baseline、sample 和 evidence 口径 |

### 7.2 设计待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `RoleCapabilitySourcePort` 采用 query、event 还是组合 | `RoleCapabilitySourceSnapshot`、source changed consumer、source refresh、adapter config | 挂起到 `03` protocol / port / flow;概要层只保留 resolver / event 接缝 |
| role / capability safe summary 的最小字段 | `RoleCapabilitySummary`、`MemberSummaryView`、outbound payload、trace | 挂起到 `03` object / protocol / view contracts;不得保存 RoleDefinition body |
| high-risk lifecycle action 的正式集合 | `GlobalLifecycleState`、`HighRiskLifecycleGuard`、`UpdateGlobalLifecycleState`、验收 negative | 挂起到 `03` state matrix 和 `06` 验收;概要层只固定必须有 basis |
| governance basis ref 与 decision / approval / policy 的边界 | lifecycle command、basis resolver、trace / audit | 挂起到 `03` contracts / ports;不得接管 governance truth |
| work participation source 的正式摘要 | `CareerRecord`、source marker、consumer flow、dedupe | 挂起到 `03` port / snapshot / persistence;identity 不拥有 ProjectMember truth |
| memory / archive carrier 与 migration receipt | `MemoryReferenceState`、`TraceHandoffIntent`、handoff target config | 挂起到 `03/04`;identity 只保存 refs / markers |
| query view 的 not visible / degraded / stale response envelope | `MemberSummaryView`、query DTO、visibility policy、tests | 挂起到 `03` query protocol;概要层只固定 response category |
| identity trace subject ref 集合 | `IdentityTraceRecord`、trace query、handoff safe material | 挂起到 `03` object / protocol;不得临时拼 subject 字符串 |
| reference state optimistic version 口径 | reference refresh、consumer update、projection stale、concurrency tests | 挂起到 `03` persistence consistency;不得用固定 version 或 timestamp 代替 |
| publish / handoff job 是否共用通用 job shell | job DTO、run receipt、stored result、runner、retry | 挂起到 `03/07`;概要层只固定 job 类别和 no rollback / no fake delivered |
| fake / endpoint / disabled / controlled adapter 精确定义 | config profiles、runtime builder、tests、acceptance evidence | 挂起到新版 `04/05/06`;概要层只固定禁止越界和禁止伪成功 |
| release / acceptance 的 P1 real-like 和 performance threshold | `05/06` release gates、NFR evidence、CI suite | 挂起到测试和验收基线;概要层不写旧硬阈值 |
| 现有 `04-配置设计.md` 的处理方式 | `04`、`05/06/07` 和 implementation handoff | 挂起到新版 `03` 后决策;当前不得作为新版 `02` 真相源 |

### 7.3 当前设计层未闭口项说明

#### 7.3.1 不阻塞概要设计的原因

上述风险和待确认事项不阻塞当前 `02-概要设计.md`,因为概要设计已经收稳:

- identity truth center、数据 ownership 和 forbidden body 边界。
- 8 个主要组成部分、关键对象、接口类别、处理流方向和状态集合。
- query no-write、report-only maintenance、eventual propagation、handoff 不伪成功和配置不可越界红线。
- `03` 的承接清单和回退规则。

它们会阻塞 `03` 的对应 object contract、protocol、port、flow、persistence、config 或 test boundary,因此必须在后续文档中正式闭口。

#### 7.3.2 会阻塞详细设计 / 实现的条件

如果 `03` 或实现阶段需要以下内容,但正式设计没有给出,必须暂停并回写设计:

- 从 external ref 构造 body-free summary 的字段来源。
- actor / trace / metadata / event envelope / typed ref 在 sibling repo 中的真实类型来源。
- external scope 展开规则、affected views / stale marker 映射、projection lookup。
- optimistic version、truth cursor、refresh cursor、id generator 来源。
- trace subject、audit subject、handoff target、receipt marker 的稳定映射规则。
- payload snapshot schema、stored result schema、duplicate replay surface。
- config profile、adapter mode、entry args、fake / controlled / endpoint / disabled 语义。

这些问题不能由实现 agent 通过字符串拼接、默认值、全表扫描、固定 `Some(1)` version、临时 enum、旁路 fake、临时 port 或配置开关自行补齐。

### 7.4 风险自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否区分风险和待确认 | 通过 | 风险表写已识别影响,待确认表写尚未定论问题 |
| 是否避免写任务 / TODO / 排期 | 通过 | 未写 backlog、开发任务或实施计划 |
| 是否把已承接给 `03` 的正常展开项重新挂起 | 通过 | object fields、DTO、port、state matrix 等只在缺来源时进入风险 |
| 是否说明当前挂起口径 | 通过 | 每项都写了概要层保守口径或后续闭口位置 |
| 是否禁止画图 | 通过 | 本 Step 未画图 |

---

## 8. 复杂度判断 / 是否拆分

本 Step 不需要拆分附录。

理由:

- 风险和待确认事项可以按表格完整表达。
- 具体字段、schema、port、test 和 config 不在本 Step 展开。
- 若 `03` 发现某项风险实际扩展为多个 blocker,应在对应 `03` Step 中拆分,不回到 Step 13 扩写实现细节。

---

## 9. 回填草稿

正式 `02-概要设计.md` §13 可回填以下内容:

- 设计风险清单:列出 sibling contract reality、外部 source / basis / handoff / visibility / projection / version / outbox / fake adapter / 旧 `04` / 性能验收阈值等风险。
- 设计待确认事项清单:列出 role source 模式、safe summary 字段、high-risk action 集合、basis 边界、work source 摘要、memory / archive receipt、query envelope、trace subject、reference version、job shell、adapter 语义、release threshold、旧 `04` 处理方式。
- 当前设计层未闭口项说明:说明这些问题不阻塞概要设计,但会阻塞 `03/04/05/06/07` 的对应闭口。

---

## 10. 待确认事项

| 待确认项 | 为什么需要确认 | 默认处理 |
|---|---|---|
| 是否认可风险表只收纳会误导 `03` 或影响概要成立的未闭口项 | 防止 Step 13 变成任务 / TODO 总表 | 当前不纳入普通实施任务 |
| 是否认可 sibling repo reality check 作为 `03` 风险输入 | 防止详细设计引用不存在的上游类型 | `03` 开始时先读实际仓库和标准 |
| 是否认可旧 `04` 去留继续挂起 | 当前新版 `02` 未完成正式装配,新版 `03` 也未重写 | 当前只确认旧 `04` 不反向约束新版 `02` |

---

## 11. 进入 Step 14 的条件

进入 Step 14 “整理正式概要设计文档”前,需要用户确认:

- 风险和待确认事项已经拆开表达。
- 每项风险 / 待确认都有影响范围和当前处理 / 挂起口径。
- 未把任务、TODO、实施计划或普通详细设计展开项包装成风险。
- Step 14 可以在不新增结论的前提下,把 Step 1~13 装配进正式 `02-概要设计.md`。
