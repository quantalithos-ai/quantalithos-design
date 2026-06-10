# Step 12. 详细设计承接清单

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 12
> 回填章节: `02-概要设计.md` §12 详细设计承接清单
> 生成日期: 2026-06-08
> 状态: 已完成

---

## 1. 本步目标

把 Step 4 ~ Step 11 已经收稳的代码主体、主要组成部分、对象、接口、处理流、状态机、异常边界和配置影响显式列为 `03-详细设计.md` 的稳定输入,防止详细设计重新发明主语或暗改概要设计结论。

本步不新增未经讨论的新对象、新接口、新流程或新状态;不写开发任务、排期、测试用例全集、实施 commit boundary、完整 DTO schema、完整 trait、DDL 或配置项清单。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体框架和实现分层 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供主要组成部分、职责与边界 |
| `02_hld_step_06_key_objects.md` 及对象附录 | 已完成 | 提供关键对象轮廓 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 API / 接口骨架 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供关键处理流和函数骨架 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供状态机与状态传播 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供异常与边界场景轮廓 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 提供配置影响和禁止配置化边界 |

---

## 3. SOP 问题回答

### 3.1 哪些代码主体框架已经由概要设计收稳,详细设计不能重新发明?

已收稳的代码主体框架包括:

- 业务主要组成部分:`Governance truth core`、`Governance context and input management`、`Gate and decision management`、`Approval and responsibility management`、`Policy and shared rules management`、`Control and compliance conclusion management`、`Nonconformity corrective loop`、`Governance consumption and traceability`、`Derived maintenance and reconciliation`、`External context mirror support`。
- 实现分层:Inbound、Operations、Application Services、Domain Model、Domain Policy / Guard、Ports、Persistence、Projection、Outbox、Handoff。
- Application service 主语:`GovernanceContextService`、`GovernanceDecisionService`、`ApprovalCoordinationService`、`PolicyGovernanceService`、`ControlComplianceService`、`NonconformityService`、`AuthorizedGovernanceQueryService`、`GovernanceTraceService`、`GovernanceDerivedMaintenanceService`。
- repository / port / job / outbox 主语按 Step 4、Step 5、Step 7 的骨架承接,详细设计可以细化命名和签名,但不能改变职责归属。

### 3.2 哪些对象、接口、处理流和状态机已经成为详细设计输入?

Step 6 的关键对象、Step 7 的 Command / Query / Consumer / Event / Job,Step 8 的 11 个处理流族,Step 9 的 7 组状态机,Step 10 的异常边界和 Step 11 的配置影响均成为详细设计输入。详细设计可以补字段、函数、guard、error、transaction、repository、event payload、test matrix 和 config contract,但不能把这些主语替换为旧 Gate / Decision / Request 教学线索或外部系统 truth。

### 3.3 详细设计应继续展开哪些字段、协议、函数、事务、异常和测试内容?

详细设计应继续展开:

- 每个关键对象的正式 struct / enum / value object、字段、状态、工厂、成员函数和不变量。
- 每个 Command / Query / Consumer / Outbound Event / Job 的 DTO、envelope、result、error、idempotency 和 authorization surface。
- 每个处理流的 application service 编排、port / repository trait、transaction boundary、outbox 形成和 stored result。
- 状态矩阵、允许 / 禁止迁移、并发冲突、expected version、duplicate replay 和错误映射。
- Projection、snapshot、reference、reconciliation、outbox、handoff、external GRC export 的读取 / 写入契约。
- 配置 owner、config validation、runtime builder、adapter config、job config、degraded / unavailable / disabled surface。
- 针对核心闭环、异常边界、禁止配置化、query no-write、consumer / job 不改 truth 的测试矩阵和验收证据切口。

### 3.4 如果详细设计发现主语需要变更,应回退到哪里修正?

如果详细设计发现需要新增、删除、合并或重命名业务主要组成部分、关键对象、接口类别、处理流族、状态组或禁止配置化边界,说明概要设计还没有真正收稳。此时必须回退到对应概要 Step 修正,而不是在 `03-详细设计.md` 中暗改:

- 代码主体 / 分层变更:回退 Step 4。
- 主要组成部分 / 职责边界变更:回退 Step 5。
- 关键对象变更:回退 Step 6。
- API / 接口变更:回退 Step 7。
- 处理流变更:回退 Step 8。
- 状态机变更:回退 Step 9。
- 异常边界变更:回退 Step 10。
- 配置影响或禁止配置化边界变更:回退 Step 11。

### 3.5 哪些配置影响需要交给详细设计收口为实现契约?

Step 11 已收稳的配置影响需要在详细设计中变成实现契约,包括 config ownership、ConfigLoader / ConfigValidator、runtime builder、adapter config、job config、consumer config、publisher config、handoff config、config error、degraded / disabled surface 和配置变更审计。配置 key、默认值、环境变量、密钥和产品参数仍留给 `04-配置说明.md`。

### 3.6 哪些未闭环内容不能写入承接清单,而应进入风险与待确认事项?

未明确进入 Step 4 ~ Step 11 稳定结论的内容不能写入本清单,应进入 Step 13。包括产品选型、旧性能数字是否硬化、external GRC 产品映射、复杂 Gate 编排、高级 Policy DSL、自动 AIIA / SoA 草拟、完整报告健康度分析、具体 DB / queue / cache / search / object store / audit store 产品、容量模型和实施阶段 commit boundary。

---

## 4. 详细设计承接清单表

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 10 个业务主要组成部分 | 为每个组成部分定义 module / service / repository / port / adapter / projection / outbox 的正式边界 |
| Inbound / Operations / Application / Domain / Ports / Persistence / Projection / Outbox 实现分层 | 定义 crate / module / file、trait、constructor、dependency injection 和 transaction 关系 |
| `Governance truth core` 的 truth、trace、audit、outbox 成立边界 | 定义 truth repository、trace repository、audit store、outbox repository、stored result 和提交事务 |
| `Governance context and input management` | 定义 `GovernanceContext`、`GovernanceInput`、source resolver、pending reference / evidence、context command DTO |
| `Gate and decision management` | 定义 `Gate`、`GovernanceDecision`、`DecisionRecord`、decision outcome、supersede / revoke、decision command DTO |
| `Approval and responsibility management` | 定义 `ApprovalResponsibility`、`ApproverRequirement`、`ResponsibilityChain`、actor capability snapshot、vote / delegation DTO |
| `Policy and shared rules management` | 定义 `PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord`、scope / priority / override / conflict resolution 契约 |
| `Control and compliance conclusion management` | 定义 `ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion`、coverage / evidence / approval 契约 |
| `Nonconformity corrective loop` | 定义 `NonconformityRecord`、`CorrectiveAction`、`VerificationResult`、closure guard、corrective flow DTO |
| `Governance consumption and traceability` | 定义 authorized query service、trace repository、audit trail、trace handoff / archive handoff / external GRC export port |
| `Derived maintenance and reconciliation` | 定义 projection rebuild、snapshot refresh、reconciliation report、derived view state、affected view 和 report repository |
| `External context mirror support` | 定义 external reference / snapshot repository、reference state、source version、stale / invalid / unavailable 语义 |
| Step 6 关键对象主表与五个对象附录 | 为每个对象补完整字段、enum、value object、factory、method、DomainError、serialization / fixture 策略 |
| Step 6 policy / guard 对象 | 定义正式 guard 输入、返回、错误、snapshot 依赖和测试矩阵 |
| Step 6 projection / read model 对象 | 定义 view ref、view body、freshness、visibility、degraded surface 和 rebuild source |
| Step 6 reference / snapshot / audit / outbox 对象 | 定义 typed refs、summary schema、source version、trace context、publication state 和 persisted shape |
| Step 7 Command 骨架 | 逐 command 定义 request / response DTO、idempotency、actor context、metadata、expected version、result repository |
| Step 7 Query 骨架 | 逐 query 定义 request / response DTO、page、visibility、freshness、degraded、not visible、read model source |
| Step 7 Inbound Event Consumer 骨架 | 定义 event envelope、source id、schema version、dedup、reference update、receipt / quarantine / delayed / dead-letter |
| Step 7 Outbound Event 骨架 | 定义 event payload、outbox source、publication envelope、topic / routing 抽象和 unsupported consumer 语义 |
| Step 7 Operations Job 骨架 | 定义 job input / report、job idempotency、cursor、page、retry、failed refs、stored report |
| Step 8 Command 写路径 | 定义 application service 编排、transaction scope、repository order、outbox creation、result save 和 rollback |
| Step 8 Query 只读路径 | 定义 read authorization、projection load、fallback、degraded response 和 no-write 测试 |
| Step 8 ExternalContextConsumer 流 | 定义 consumer validation、snapshot upsert、reference state version、affected view stale marker |
| Step 8 PublishOutbox 流 | 定义 pending list、publish port、mark published / failed / dead-letter、partial failure report |
| Step 8 Rebuild / Refresh / Reconcile 流 | 定义 committed truth snapshot、projection batch、reference refresh、reconciliation issue 和 report persistence |
| Step 8 Trace / Archive / External GRC Handoff 流 | 定义 handoff scope、package / target refs、receipt、failed marker 和 export report |
| Step 9 状态定义表 | 补正式 enum、初始态、终态、可重入规则、serialization 和 migration 规则 |
| Step 9 允许 / 禁止迁移 | 补状态矩阵、guard、DomainError、expected version、concurrency 和 tests |
| Step 9 状态传播关系 | 补 truth change -> trace / audit / outbox / stale marker / query surface 的正式规则 |
| Step 10 异常与边界场景 | 补正式 error taxonomy、response mapping、retry / quarantine / dead-letter / recovery 和 negative tests |
| Step 11 配置影响轮廓 | 补 ConfigLoader、ConfigValidator、RuntimeConfig、AdapterConfig、JobConfig、ConfigError、runtime builder 注入关系 |
| Step 11 禁止配置化边界 | 补 config validation tests 和 safety gates,确保配置不能绕过 domain invariant |

---

## 5. 详细设计继续展开方向

### 5.1 对象与状态契约

详细设计必须把 Step 6 / Step 9 的对象和状态候选闭合为可落码契约:

- 每个对象的字段、ID / Ref、新类型、enum variant、状态字段、构造函数和成员函数。
- 每个状态迁移的输入、guard、输出、错误和 history / trace / outbox 副作用。
- 每个 reason、kind、summary、scope、cursor、version、page、freshness、visibility 和 degraded 类型。

### 5.2 协议与接口契约

详细设计必须把 Step 7 的接口骨架闭合为正式 protocol:

- Command / Query / Event / Job DTO。
- inbound / outbound envelope、schema version、source event id、trace context、actor context、metadata。
- result surface、stored command result、job report、duplicate replay 和 not visible / stale / degraded response。
- API 错误映射、unsupported version、invalid request、not authorized、not visible、conflict、unavailable、dead-letter。

### 5.3 Application flow 与事务契约

详细设计必须把 Step 8 的处理流闭合为可实现 application contract:

- service 函数、repository / port trait、id generator、clock、unit-of-work、expected version。
- truth、history、trace、audit、outbox、projection stale、result 的事务边界。
- Consumer 的 dedup、snapshot / reference state 更新、affected view stale marker。
- Job 的 pending scan、cursor、partial failure、retry、stored report 和 idempotency。

### 5.4 Persistence / projection / outbox 契约

详细设计必须定义:

- truth repository 的 save / get / list / versioned update。
- projection repository 的 replace / mark stale / load state / affected view 读取面。
- reference snapshot repository 的 state、version、refresh、failed marker。
- outbox repository 的 pending scan、mark published / failed / dead-letter、publication version。
- trace / audit / handoff / export / reconciliation report 的持久化 surface。

### 5.5 配置与运行承载契约

详细设计必须定义:

- runtime config owner、adapter config、job config、consumer config、publisher config、handoff config。
- config validation 失败的启动阻断、adapter disabled、degraded 或 delayed 语义。
- application service 通过 builder 注入已验证 dependency,domain 不直接读取配置。
- 配置变更审计、config snapshot evidence 和高风险配置变更的审批或追溯口径。

### 5.6 测试与验收承接

详细设计必须为后续 `05-测试方案.md` 和 `06-验收标准.md` 提供:

- command state transition tests。
- contract roundtrip / fixture tests。
- query no-write / visibility / degraded tests。
- consumer duplicate / unsupported version / forbidden body tests。
- outbox partial failure / dead-letter tests。
- rebuild / refresh / reconciliation / handoff job tests。
- forbidden configuration / domain invariant negative tests。

---

## 6. 概要设计回退规则

如果详细设计发现上述主语需要变更,说明概要设计尚未收稳,应先回退概要设计修正,不得在详细设计中暗改。

| 详细设计发现的问题 | 回退位置 | 说明 |
|---|---|---|
| 需要新增或删除业务主要组成部分 | Step 5 | 主要组成部分是概要层业务分解,不能在详细设计临时改 |
| 需要调整实现分层或代码主体主语 | Step 4 | Inbound / Application / Domain / Ports / Projection / Outbox 等分层必须先在概要层收稳 |
| 需要新增关键对象或删除对象 | Step 6 | 对象主语必须先进入关键对象轮廓 |
| 需要新增 Command / Query / Consumer / Event / Job | Step 7 | 接口类别和入口必须先进入接口骨架 |
| 需要新增处理流族或改变处理顺序 | Step 8 | 处理流必须先在概要层解释 |
| 需要新增状态组、改状态主线或改变禁止迁移 | Step 9 | 状态机红线不能在详细设计暗改 |
| 需要改变异常边界或让 Query / Consumer / Job 写 core truth | Step 10 | 异常边界变更会影响架构约束 |
| 需要改变配置影响或允许配置绕过边界 | Step 11 | 配置不可越界是概要层门禁 |
| 需要改变 truth 归属、正文排除、依赖裁剪或核心能力闭环 | Step 1~3 或回到需求 / 架构 | 这已经超出概要局部调整 |

---

## 7. 不进入本承接清单的内容

以下内容不写入本承接清单,应进入 Step 13 风险与待确认事项或后续文档:

| 内容 | 后续归属 |
|---|---|
| 具体 DB、message bus、cache、search、object storage、audit store、external GRC 产品选型 | Step 13 / `04-配置说明.md` / 实施计划 / ADR |
| 旧性能数字是否硬化为 SLO | Step 13 / 测试方案 / 验收标准 |
| 高级治理看板、Policy DSL、复杂 Gate 编排、自动 AIIA / SoA 草拟 | Step 13 / 后续演进设计 |
| 完整配置 key、默认值、环境变量和密钥 | `04-配置说明.md` |
| 完整测试用例全集和验收证据路径 | `05-测试方案.md` / `06-验收标准.md` |
| 实施 commit boundary、开发排期、代码提交策略 | `07-实施计划.md` |

---

## 8. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧文档没有明确交给详细设计的稳定输入清单 | 后续 agent 容易重新发明对象、接口或状态 | 本步把 Step 4~11 的稳定结论列成承接清单 |
| 旧 Gate / Decision / Request 教学线索容易回流 | 会覆盖新版业务主要组成部分和接口分类 | 本步明确详细设计不得回到旧主线 |
| 旧文档混合概要、详细、配置、测试、实施线索 | 下游不知道哪些该继续展开,哪些该回退 | 本步明确详细设计展开方向和不进入清单的内容 |
| 缺少回退规则 | 详细设计可能暗改概要结论 | 本步要求主语变更必须回退对应概要 Step |

---

## 9. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 详细设计输入 | 隐含在各章节 | 集中列为稳定承接清单 |
| 主语变更处理 | 未说明 | 明确必须回退概要设计 |
| 详细设计职责 | 泛化为“后续细化” | 明确对象、协议、流程、状态、持久化、配置、测试方向 |
| 风险与待确认 | 容易混进承接清单 | 明确未闭合内容进入 Step 13 |
| 文档分层 | 旧文档混合 | 区分 `03`、`04`、`05`、`06`、`07` 承接范围 |

---

## 10. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否把所有 Step 4~11 细节机械粘贴 | 不粘贴全文 | 承接清单要提供稳定索引,正式细节仍以各 Step 文件为准 |
| 是否在本步新增对象或接口 | 不新增 | 本步只承接已收稳结论 |
| 是否列开发任务 | 不列 | 开发任务属于实施计划 |
| 是否列风险项 | 不在本步展开 | 风险和待确认事项进入 Step 13 |
| 是否允许详细设计微调命名 | 允许细化,不允许改主语职责 | 详细设计可落正式类型名,但不能改变概要层职责边界 |

---

## 11. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §12 引用本文件 §4 的详细设计承接清单表。
- §12 摘录本文件 §5 的详细设计继续展开方向。
- §12 摘录本文件 §6 的概要设计回退规则。
- §12 摘录本文件 §7 的不进入承接清单内容,并把这些内容交给 Step 13 或后续文档。
- 正式文档中应明确:如果 `03-详细设计.md` 发现主语需要变更,应先回到 `02-概要设计.md` 对应章节修正,不得暗改。

---

## 12. 待确认事项

本步不新增阻塞 Step 13 的待确认事项。Step 13 将专门收纳当前概要设计层尚未闭合的设计风险、待确认事项和后续文档承接项。

---

## 13. 进入下一步条件

- 已明确概要设计向详细设计交付哪些稳定输入。
- 已明确详细设计继续展开对象、接口、流程、状态、异常、配置、持久化和测试。
- 已明确详细设计发现主语变更时必须回退概要设计。
- 未新增未经讨论的新对象、新接口、新流程或新状态。
- 未写入开发任务、排期、测试用例全集或实施指令。
- 可以进入 Step 13 “设计风险与待确认事项”。
