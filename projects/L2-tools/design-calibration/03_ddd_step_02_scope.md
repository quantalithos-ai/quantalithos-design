# L2-tools 03 详细设计 Step 2: 明确本轮实现范围和非范围

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/03_ddd_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/03-详细设计.md`
> 回填章节: 正式 03 §2
> 当前写入许可: 只允许本 Step 中间产物与 flow / ledger；正式 03 仍禁止写入。

---

## 1. Step 开工与输入

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 1 `completed / pass`;`next_allowed_action=create_step_02_scope`。 |
| 正式输入 | 当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`，重点为 02 §2、§4~§12。 |
| 解释性输入 | `03_ddd_step_01_upstream_boundary.md`;`02_hld_step_12_detailed_design_handoff.md`;`02_hld_step_13_risks_open_questions.md`。 |
| 标准输入 | 详细设计 SOP Step 2；详细设计书写规范 §5.2；真相源闭环与可落码性标准。 |
| historical material | 旧正式 03 的 registry / policy / executor / MCP / builtin / fixed backend 范围不进入本轮。 |
| 正式写入 | Step 19 前为 `false`。 |
| 用户授权 | 已授权单一 agent 串行完成全部 03；完成 03 后停审。 |

## 2. SOP 问题回答

### 2.1 必须覆盖哪些模块

本轮覆盖七个计划工程层 `contracts / domain / application / infra / api / worker / jobs`，以及横跨这些工程层的六个业务组成部分：工具合同与演进、Capability Binding 与受控来源、规范调用与受理、执行前置与条件交接、Outcome / 审计 / 安全交接、引用完整性与受控派生。七个工程层由 Step 3~5 定稿，六个业务组成部分不得各自拆成 crate，也不得合并相邻 owner。

实现分层必须覆盖 public contracts、domain truth / facts / refs / views、application services 与 owned ports、backend-neutral repositories / adapters、同步 entry、异步 consumer entry、operations job entry、projection 与 fake/test seam。

### 2.2 必须定义哪些主语

- 正式 02 §6 的 41 个关键对象必须全部展开 exact type、字段、constructor / factory、成员函数、enum、invariant、持久化和测试切口；不得静默删减、合并或匿名 DTO 化。
- 13 Command、11 Query、5 Inbound Consumer、4 Outbound Event skeleton、4 Operations Job 必须全部形成 logical protocol、secondary public type、callable、function flow、error、idempotency / ordering 与 test cut。
- 7 个 named external ports、6 个 store group、`ProjectionStore`、repository / UoW / clock / ID / idempotency 等本地 seam 必须形成 caller-owned trait 和 adapter / fake 约束。
- 5 条通用路径与 12 个关键流族必须展开到每个 public interface；通用模板不能替代 interface-specific transaction、state、error 与 side effect。
- 六个 owner-qualified 状态族必须经过状态主语筛选并形成 exact transition matrix；assessment / snapshot / ref / attempt / derived freshness 不能被错误并成全局状态机。
- `EX-L2T-001~056`、`NC-L2T-001~025`、`L2T-UP-001~009` 必须分别进入 error / configuration / blocker contract，不以配置、fake 或历史 schema 消失。

### 2.3 后续阶段与外围能力

本轮没有通过缩减对象池形成的 P1 子集。正式 02 已收稳的 41 对象和 `13/11/5/4/4` surface 都属于 detailed-design exact-contract 范围；其中 search / diff / diagnostic / guidance / report / projection 是外围非阻塞实现面，但仍须设计 freshness、unavailable、rebuild 与 no-write contract。

以下只保留 seam 或非目标：agent loop、LLM planning、Runtime orchestration / checkpoint / recovery、Capability Hub registry truth、effective authorization / policy / taxonomy、Sandbox isolation / run / capture / receipt / cleanup、Bus delivery / retry / DLQ / replay、Observability store / retention / route、external MCP / A2A / API registry、marketplace listing、SDK client、tool implementation inventory、raw body / secret / evidence body。

### 2.4 与后续正式文档的分工

| 后续文档 | 03 只提供 | 03 不写 |
|---|---|---|
| `04-配置设计.md` | Typed config candidate、validator、builder injection point、owner、禁止配置化红线。 | 完整 key catalog、格式、默认值、environment variable、secret name、profile、部署挂载、热更新值。 |
| `05-测试方案.md` | Unit / contract / integration 的最小 test cut、fake seam、oracle 与 negative boundary。 | 完整用例矩阵、fixture 数据、执行计划、coverage target、run、结果、报告或 evidence alias。 |
| `06-验收标准.md` | 可验证的 contract / state / safety / consistency handoff。 | 验收签署、真实 evidence、pass/fail 结论、发布准入。 |
| `07-实施计划.md` | Planned workspace / module / file、dependency order、implementation handoff gates。 | Phase / commit boundary、任务排期、implementation ledger、planned boundary skeleton、实现 commit。 |
| 运维 / ADR | Backend-neutral failure / health / recovery ownership、待选产品位置。 | 部署拓扑、容量、on-call runbook；framework / transport / DB / broker / scheduler / telemetry backend 最终选型。 |

### 2.5 实现者拿到本文后应能完成什么

在后续正式 04~07 提供其各自输入且 blocker gate 满足的前提下，实现者应无需自选业务 truth 即可创建 Rust workspace、七 member、41 个 domain / view / ref contract、全部 DTO / carrier、application service、repository / port / fake、entry handlers、worker consumers、job runners、transaction / idempotency / concurrency guards、projection rebuild、body-free observation cuts 与最小测试。外部 positive seam 未闭口时，实现者只能完成 blocked adapter / fake / negative path，不得伪造 provider 或 end-to-end readiness。

## 3. 当前材料诊断

| 材料 / 问题 | 风险 | 本步处理 |
|---|---|---|
| 旧正式 03 的范围围绕 registry / policy / executor / MCP / builtin | 把相邻 owner 与产品库存并入 L2。 | 全部标为 historical；只承接正式 00/01/02。 |
| 正式 02 是 skeleton 粒度 | 若只做摘要，41 对象与接口仍需实现者猜字段和 callable。 | 全量进入 Step 6~17 exact-design 范围。 |
| 九项 external blocker | 可能被误读为 03 整体无法推进，或用 fake schema 伪闭口。 | Local contract 与 blocked seam 分层；positive path 单独暂停。 |
| 目标实现仓不存在 | 无代码事实可扫描。 | 只设计 planned layout；实现状态、build 和 test 不在范围。 |
| 旧链缺正式 04 | 03 容易越界成为配置手册。 | 只交付 typed binding 输入；完整配置后移 04。 |
| 用户要求 03 全部连续完成 | 容易为速度跳过 Step / 附录。 | 仍按 19 Step 串行；仅取消 Step 间用户停审，保留文件级门禁。 |

## 4. 改动前后与取舍

| 主题 | 改动前 | 本步收口后 |
|---|---|---|
| 设计范围 | 正式 02 提供概要承接，旧 03 仍可能被误作底稿。 | 只以当前 00/01/02 为 authority，旧 03 不提供范围。 |
| Exact coverage | 六部分与 surface 已点名，尚未成为 03 自身覆盖台账。 | 41 对象、37 inbound / operation protocols、4 outbound skeleton、ports / stores、flows / states 全量登记。 |
| Blocker | Positive seam 未闭口。 | Blocked contract 进入范围；外部 provider / route / mapping / readiness 不进入范围。 |
| 下游边界 | 配置、测试、验收、实施容易提前混入。 | 03 只提供承接输入，04~07 保持正式职责。 |
| 实现预期 | 仍可能需要实现者猜 owner、DTO、state 和 transaction。 | 正式 03 完成时必须提供可直接落码的本地 contract 与保守 external seam。 |

采用“全量 exact local contract + blocked-aware external seam”的方案。不采用只写核心 happy path，也不采用把外部 owner、下游正式文档或产品选型一并定稿的方案。

## 5. 结构化中间产物

### 5.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳工程组织 | 把业务主轴转成 Rust workspace / crate / module / file 与单向依赖。 | 可创建且无循环依赖的 planned skeleton。 |
| 收稳模块契约 | 固定七工程层与六业务组成部分的唯一 owner、entry、store、port。 | 每个代码主体有唯一文件和允许依赖。 |
| 收稳对象契约 | Exact-expand 41 对象及必要非 core carrier。 | 可实现 Rust types、constructors、functions、guards 与 serialization。 |
| 收稳 seam 契约 | 定义 repository / UoW / external port / adapter / fake 的 caller、implementer、error。 | 可替换 backend 和 blocked provider，不污染 domain。 |
| 收稳协议契约 | Exact-expand `13/11/5/4/4` 及 secondary public types。 | 可实现 transport-neutral API / worker / job public surface。 |
| 收稳函数流 | 每个 public interface 形成 callable、validation order、UoW、state、side effect、error。 | Application service 可逐函数实现。 |
| 收稳状态与数据 | 六状态族、stores、keys、versions、atomicity、projection / watermark。 | State guards、repositories 和 consistency behavior 可实现。 |
| 收稳横切行为 | Error、recovery、concurrency、idempotency、config binding、telemetry / audit。 | Negative path 和 deterministic fake 可实现。 |
| 收稳下游输入 | 给 04~07 提供配置、测试、验收与实施所需 authority，不替代其正文。 | 后续正式文档无需反向补设计 boundary。 |

### 5.2 41 对象范围登记

| 业务组成部分 | Exact-design 对象（全部 in scope） | 数量 |
|---|---|---:|
| 工具合同与演进 | `ToolContract`;`FormalToolDefinition`;`ToolCompatibilityImpact`;`ToolContractView`;`DefinitionSourceRef`;`ToolContractEvolutionFact` | 6 |
| Capability Binding 与受控来源 | `CapabilityBinding`;`CapabilityBindingAssessment`;`HubControlledSnapshot`;`CapabilityBindingView`;`HubCapabilityRef`;`CapabilityBindingChangeFact` | 6 |
| 规范调用与受理 | `ToolInvocation`;`InvocationAdmission`;`InvocationContractAnchor`;`ToolInvocationView`;`InvocationContextRefs` | 5 |
| 执行前置与条件交接 | `ExecutionRequirement`;`AuthorizationConsumptionAssessment`;`ExecutionHandoff`;`ExecutionHandoffAttempt`;`AuthorizationResultRef`;`SandboxReadinessSnapshot` | 6 |
| Outcome、审计与安全交接 | `ExecutionSourceAssessment`;`ToolInvocationOutcome`;`SafeHandoffEligibility`;`ExternalSubmissionAttempt`;`OutcomeAuditView`;`SandboxExecutionSourceRef`;`BusDeliveryStatusRef`;`ObservationMaterialRef`;`ToolAuditEntry`;`SafeHandoffMaterial` | 10 |
| 引用完整性与受控派生 | `ReferenceValidityAssessment`;`ConsistencyGap`;`ReferenceConsistencyReport`;`ToolContractSearchProjection`;`ToolContractDiffSummary`;`ToolDiagnosticSummary`;`ToolConsumerGuidanceView`;`SharedContractAuthorityRef` | 8 |
| 合计 | 正式 02 §6 的对象池，无增删 | 41 |

### 5.3 Public surface 范围登记

| 类别 | Exact-design 名称 | 数量 | Step |
|---|---|---:|---:|
| Command | `EstablishToolContract`;`AssessToolDefinitionChange`;`AdoptToolDefinitionRevision`;`RetireToolContract`;`DeclareCapabilityBinding`;`ReplaceCapabilityBinding`;`InvalidateCapabilityBinding`;`SubmitToolInvocation`;`EvaluateExecutionPreconditions`;`PrepareExecutionHandoff`;`AcceptExecutionSource`;`PrepareSafeExternalHandoff`;`RecordConsistencyGapResolution` | 13 | 8~9 |
| Query | `GetToolContract`;`CompareToolDefinitionRevisions`;`GetCapabilityBinding`;`GetToolInvocation`;`GetExecutionPreconditionView`;`GetOutcomeAudit`;`GetReferenceConsistencyReport`;`SearchToolContracts`;`CompareToolContracts`;`GetToolDiagnostic`;`GetToolConsumerGuidance` | 11 | 8~9 |
| Consumer | `ConsumeHubCapabilityChangeClue`;`ConsumeAuthorizationResultChangeClue`;`ConsumeSandboxExecutionSource`;`ConsumeBusDeliveryStatusFeedback`;`ConsumeObservationStatusFeedback` | 5 | 8~9 |
| Event skeleton | `ToolContractChanged`;`CapabilityBindingChanged`;`ToolOutcomeAuditMaterialAvailable`;`ToolConsistencyGapChanged` | 4 | 8~9 |
| Job | `CheckCapabilityBindingConsistency`;`CheckReferenceIntegrity`;`RebuildToolDerivedViews`;`RefreshExternalStatusRefs` | 4 | 8~9 |

### 5.4 Seam、数据与状态范围

| 范围 | 本轮必须闭口 | 不得声称 |
|---|---|---|
| Named external ports | 7 个 port 的 logical method、request / response、caller、error、blocked state、fake。 | External provider、wire schema、route 或 readiness 已存在。 |
| Persistence | 6 store groups、ProjectionStore、repository / UoW / idempotency record、key、version、history、atomic family。 | 具体 DB、DDL、table、index 产品已选。 |
| Flows | 5 common discipline + 12 flow family，最终覆盖全部 37 inbound / operation entry 与 outbound continuation。 | 用通用模板代替 interface-specific callable。 |
| States | Contract / definition；Binding / assessment；invocation / admission；precondition / handoff；outcome / audit / handoff；integrity / derived 六族。 | Global tool state 或跨 owner transaction。 |
| Exceptions | `EX-L2T-001~056` 的 typed detection、error / disposition / recovery owner。 | 外部 retry / DLQ / recovery 归 L2。 |
| Config boundary | `NC-L2T-001~025` 对应 typed candidate、validation 和 non-configurable guard。 | 完整配置手册或安全红线可配置。 |

### 5.5 非范围表

| 非范围 | 留给哪一层 / 文档 |
|---|---|
| 用户需求、系统上下文、owner 与依赖架构重选 | 已完成的正式 00 / 01；发现冲突则回退，不在 03 暗改。 |
| 配置 key / value / default / env / profile / secret / deployment | 正式 04。 |
| 完整测试矩阵、执行与证据 | 正式 05。 |
| 验收门禁、证据 alias、签署与通过结论 | 正式 06。 |
| Phase / commit / 排期 / implementation ledger / boundary skeleton | 正式 07。 |
| Runtime action selection、agent / LLM loop、plan、checkpoint、retry / recovery | `L2-runtime`。 |
| Capability registry / provider / exposure / applicability truth | `L3-capability-hub` 或对应 external owner。 |
| Authorization decision、policy、approval、taxonomy | 正式 authorization owner；`L2T-UP-001~002`。 |
| Sandbox environment / run / capture / receipt / cleanup / recovery | `L4-sandbox`;`L2T-UP-003~004`。 |
| Bus delivery、retry、DLQ、replay；Observability store / route / retention | 对应 owner；`L2T-UP-004~006`。 |
| SDK client / wrapper / compatibility coverage | `L0-sdk`;`L2T-UP-009`。 |
| Tool implementation、builtin / MCP / A2A / API inventory、marketplace listing | Adapter / inventory / distribution owner。 |
| Framework、transport、database、broker、scheduler、search、telemetry backend | Future ADR / implementation choice constrained by 03/04。 |
| Raw request / prompt / capture / response / secret / evidence body | 永久禁止进入 L2 truth，不是后移项。 |

### 5.6 Step 分派与回退门禁

| 主题 | 主 Step | 回退条件 |
|---|---:|---|
| Language / repo / dependency | 3 | Authority 不足或实际 sibling package 不存在。 |
| Workspace / file | 4 | 需要改变工程层或新增 compile dependency。 |
| Module owner | 5 | 六业务组成部分或七工程层职责冲突。 |
| Object exact contract | 6 | 需要新增有 identity / lifecycle / history 的业务主语时回退正式 02 Step 6。 |
| Port / adapter | 7 | External owner 或 compile/runtime/event 分类变化时回退 01 / 02。 |
| Protocol / flow / state | 8~10 | Public capability、写权或状态 owner 变化时回退对应概要 Step。 |
| Persistence through tests | 11~16 | 不得通过 backend / config / test fake 改变前序 contract。 |
| Handoff / risk / assembly | 17~19 | 任一 source、schema、callable、flow、state、store、test 链未闭合则禁止装配。 |

## 6. 回填草稿

正式 §2 应写实现契约目标、全量覆盖范围、blocked-aware seam 和非范围。正文点名六业务组成部分、七工程层候选、41 对象、`13/11/5/4/4` surface、ports / stores / flows / states / exceptions / config boundary，并明确 04~07 分工。过程诊断、候选方案和 Step 分派只保留在本中间产物。

## 7. 门禁

| 条件 | 结果 |
|---|---|
| 六组成部分与七工程层是否进入范围 | pass |
| 41 对象是否逐组全量登记 | pass |
| `13/11/5/4/4` 是否逐名登记 | pass |
| Port / store / flow / state / error / config 是否有后续 Step | pass |
| Blocked seam 是否进入 negative contract 而非伪 positive provider | pass |
| 04~07、相邻仓与永久禁止项是否分清 | pass |
| 是否未写排期、配置值、测试结果、实施 ledger / skeleton | pass |
| 是否未修改正式 03 | pass |

```text
step_status = completed
gate_status = pass
gate_reason = all 41 objects, 13/11/5/4/4 protocol surfaces, ports, stores, flows, states, errors and config boundaries have exact-design ownership while downstream documents and external positive providers remain outside this document
next_allowed_action = create_step_03_constraints
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
