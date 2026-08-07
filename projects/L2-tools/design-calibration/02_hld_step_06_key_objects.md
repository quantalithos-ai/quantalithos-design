# L2-tools 02 概要 Step 6: 关键对象轮廓

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 从 Step 5 的 41 个候选逐项正式化；每个对象独立成节，字段与函数只到概要骨架，不写完整 schema、签名、DDL 或实现。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 6 关键对象轮廓 |
| 已读取项目台账 / flow | yes |
| 已读取前序 Step | yes: Step 1~5，直接候选池来自 Step 5 §11 |
| 已读取 SOP / 书写规范 | yes: 概要 SOP Step 6；概要书写规范 §4.6 |
| 已读取正式输入 | yes: 正式 00/01 的对象、数据、状态与 owner 边界 |
| 已读取参考粒度 | yes: Governance、Artifact、Method Library、Capability Hub 的对象卡片 |
| 旧材料处理 | 旧 `ToolPolicy` / inventory / executor / MCP / member-service / fixed Rust 对象只作排除审计 |
| 进入条件 | pass: Step 5 completed |
| next_allowed_action | 按六个组成部分串行完成对象附录，再做跨对象审计。 |

## 1. Step 内计划

| 模块 | 输出 | 状态 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 输入 / 问题 / 诊断 / 取舍 | 本主控 §2~§5 | done | pass | 建立候选筛选和附录索引。 |
| 候选池筛选与对象分布 | 本主控 §6~§7 | done | pass | 进入组成部分 1。 |
| 1 工具合同与演进 | `02_hld_step_06_key_objects_contract_evolution.md` | done | pass | 进入组成部分 2。 |
| 2 Capability Binding 与受控来源 | `02_hld_step_06_key_objects_binding_source.md` | done | pass | 进入组成部分 3。 |
| 3 规范调用与受理 | `02_hld_step_06_key_objects_invocation_admission.md` | done | pass | 进入组成部分 4。 |
| 4 执行前置与条件交接 | `02_hld_step_06_key_objects_precondition_handoff.md` | done | pass | 进入组成部分 5。 |
| 5 Outcome、审计与安全交接 | `02_hld_step_06_key_objects_outcome_audit_handoff.md` | done | pass | 进入组成部分 6。 |
| 6 引用完整性与受控派生 | `02_hld_step_06_key_objects_integrity_derived.md` | done | pass | 执行跨对象审计。 |
| 停审 / Step 8~9 反查 / 跨对象审计 | 本主控 §8~§12 | done | pass | 创建 Step 7 接口骨架。 |

## 2. 本步输入

| 输入 | 已收稳内容 | 本步使用方式 |
|---|---|---|
| Step 4 | 六业务主体族、实现分层和 external port 状态。 | 对象只能归属业务组成部分，不能从层名发明对象。 |
| Step 5 | 41 个候选、capability 来源、唯一 owner、非对象排除项。 | 逐候选正式化，不临场新增主语。 |
| 正式 00 | `DR-L2T-001~034`、`BR-L2T-001~042` 与 forbidden body。 | 固定字段的 owner、数据类别、时点与禁止事项。 |
| 正式 01 | `A1~A5/S1~S3/P1~P6`、`T1/T2/D1` 和状态分层。 | 固定对象责任、状态族与跨边界引用语义。 |
| `L2T-UP-001~009` | Authorization、Sandbox、Observability、Core、SDK、measurement 开放缺口。 | 只允许 blocked ref / snapshot / assessment，不补 schema / mapping / route。 |

## 3. SOP 问题回答

1. 若不点名 contract / definition / evolution、Binding relation / assessment、invocation / admission、requirement / handoff、source / outcome / audit / safe material、ref assessment / derived view，详细设计会重新发明 owner 与状态主语，因此 41 项全部需要独立对象卡片。
2. 41 项均来自 Step 5 对象发现维度表，全部正式进入本步；没有新增候选。
3. Service、store、port、job、Command / Query / Consumer DTO、event payload、表 / 索引 / topic 和普通 ID / reason / timestamp 只作为接口、详细设计或字段类型，不升级为对象。
4. 每个对象只归属一个主要组成部分；跨部分使用通过 typed ID / ref / anchor 发生，不共享写权。
5. 对象类型覆盖 aggregate、entity / fact、value object、assessment / guard、projection、reference object、audit / history record、context object。
6. 每个对象只保留能影响 owner、关联、消费时点、状态或安全边界的 2~5 个关键字段。
7. 字段类型使用概要类型名；不写语言类型、序列化名、数据库列或可空实现。
8. 只有拥有独立生命周期、assessment、attempt 或 freshness 语义的对象列状态；纯 ref / view 不强造状态机。
9. 成员函数只表达对象自有判断 / 变化；Application 编排留给 Step 7 / 8。
10. 工厂函数只表达对象成立所需的正式输入；不写 repository、transaction 或 event publishing。
11. 函数参数统一为 `TypeName param_name`，不写裸参数或实现签名。
12. Step 5 中的全部 domain / reference / projection / audit 主体必须本步独立成节；services / ports 不在本步展开。
13. Step 8 / 9 预计出现的 invocation、assessment、attempt、outcome、gap、projection 等状态主语均在本步定义。
14. 完整参数 / 结果 schema、状态转换 guard 实现、错误码、持久化、协议与映射后移至 03。
15. 每个组成部分完成后必须核对候选处理、功能来源、类型 / 参数完整和 boundary blocker。
16. 六部分完成后必须审计名称唯一、ID / ref 方向、状态 owner、flow / state 反查和 historical pollution。

## 4. 当前材料问题诊断

| 诊断 | 风险 | 当前修正 |
|---|---|---|
| 旧 `ToolDefinition` 同时承载 identity、definition、scope 和 adapter 输入。 | 形成巨型对象并迁入 Hub / provider truth。 | 拆为 `ToolContract`、`FormalToolDefinition`、source ref 与独立 Binding。 |
| 旧 `ToolPolicy` / `ToolScope` 拥有 allow / deny。 | 本仓 self-authorization。 | 改为 `ExecutionRequirement` + `AuthorizationConsumptionAssessment` + external ref。 |
| 旧 invocation request 与 normalized invocation 重叠。 | Caller / carrier 分叉合同，时点不稳定。 | 单一 `ToolInvocation` + `InvocationContractAnchor` + `InvocationContextRefs`。 |
| 旧 result、failure、stdout、callback 混在一起。 | Execution truth 冒充工具终态。 | `ExecutionSourceAssessment`、`ToolInvocationOutcome`、`ToolAuditEntry` 分权。 |
| Handoff、delivery、observation 常被写成同一状态。 | L2 本地 attempt 冒充外部成功。 | `ExecutionHandoffAttempt`、`ExternalSubmissionAttempt`、两类 external ref 分离。 |
| 搜索 / health / diagnostic 被当核心真相。 | 派生视图反写或阻塞调用主线。 | 独立 projection / report，明确 stale / rebuilding 可接受与 no-write。 |

## 5. 设计取舍与复杂度判断

- 采用 41 个独立对象，不因篇幅合并未来代码主体；对象名的数量来自边界复杂度，而不是追求模型数量。
- 采用“主控 + 六个组成部分附录”，使对象卡片可串行停审；正式 §6 仍逐对象表达，不用一个索引表代替卡片。
- Assessment / snapshot / ref 分开：assessment 是 L2 对消费条件的判断，snapshot 是允许摘要，ref 是外部对象定位；三者不可互换。
- `ToolInvocationOutcome` 统一承载 success、tool failure、execution failure、capture failure 和 no-execution 的消费者语义；具体 payload / error taxonomy 后移。
- `ToolContractView`、`CapabilityBindingView`、`ToolInvocationView`、`OutcomeAuditView` 是服务核心读取视图；search / diff / diagnostic / guidance 是可重建派生，状态语义不同。
- 当前对象规模超过单文件稳定阅读粒度，必须拆附录；每次写入控制在 100~300 行左右。

## 6. 对象候选池筛选说明

### 6.1 正式关键对象

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `ToolContract`;`FormalToolDefinition`;`ToolCompatibilityImpact`;`ToolContractView`;`DefinitionSourceRef`;`ToolContractEvolutionFact` | 部分 1 truth / policy / view / ref / history | 6 项全部正式化 | 分别承接稳定身份、当前定义、影响、读取、来源与演进历史。 |
| `CapabilityBinding`;`CapabilityBindingAssessment`;`HubControlledSnapshot`;`CapabilityBindingView`;`HubCapabilityRef`;`CapabilityBindingChangeFact` | 部分 2 relation / assessment / snapshot / view / ref / history | 6 项全部正式化 | L2 relation 与 Hub external truth 必须分权。 |
| `ToolInvocation`;`InvocationAdmission`;`InvocationContractAnchor`;`ToolInvocationView`;`InvocationContextRefs` | 部分 3 truth / fact / value / view / context | 5 项全部正式化 | Canonical 调用、执行前判断、时点锚定和 caller refs 不可混合。 |
| `ExecutionRequirement`;`AuthorizationConsumptionAssessment`;`ExecutionHandoff`;`ExecutionHandoffAttempt`;`AuthorizationResultRef`;`SandboxReadinessSnapshot` | 部分 4 fact / assessment / context / attempt / ref / snapshot | 6 项全部正式化 | L2 前置 truth 与 external decision / execution truth 分离。 |
| `ExecutionSourceAssessment`;`ToolInvocationOutcome`;`SafeHandoffEligibility`;`ExternalSubmissionAttempt`;`OutcomeAuditView`;`SandboxExecutionSourceRef`;`BusDeliveryStatusRef`;`ObservationMaterialRef`;`ToolAuditEntry`;`SafeHandoffMaterial` | 部分 5 assessment / truth / guard / fact / view / refs / audit / material | 10 项全部正式化 | Source、终态、审计、安全判断、材料、本地尝试与外部状态各有独立 owner。 |
| `ReferenceValidityAssessment`;`ConsistencyGap`;`ReferenceConsistencyReport`;`ToolContractSearchProjection`;`ToolContractDiffSummary`;`ToolDiagnosticSummary`;`ToolConsumerGuidanceView`;`SharedContractAuthorityRef` | 部分 6 assessment / fact / projections / ref | 8 项全部正式化 | 引用判断、gap 和各类可重建输出需要不同失败 / freshness 语义。 |

### 6.2 并入、后移与排除

| 候选 / 名称类别 | 筛选结论 | 原因 |
|---|---|---|
| Invocation / handoff query view 线索 | 并入 `ToolInvocationView` | 避免第二 handoff truth；具体 Query 留 Step 7。 |
| Admission audit history 线索 | 由 `InvocationAdmission` + `ToolAuditEntry` 承接 | 执行前判断事实与工具域审计已足以回链。 |
| Safe / no-write / fail-closed / isolation policy 线索 | 并入 guard / assessment 禁止事项与 Step 10 | 不能新建本地 authorization / execution policy truth。 |
| Service、repository / store、port、job | 后移 Step 7 / 8 / 03 | 属于编排、边界或实现主体，不是对象。 |
| ID、revision、timestamp、reason、correlation、status 值 | 作为字段类型 | 不拥有独立业务责任。 |
| DTO、event payload、HTTP / RPC body、SDK response | 后移 Step 7 / 03 | 协议形态不能定义 domain truth。 |
| Table、index、cache、topic、consumer group | 排除本步 | 详细设计 / 实现选择。 |
| 旧 `ToolPolicy`;`ToolScope`;`ToolHealth`;inventory item;MCP client;host callback | historical material / 排除 | 与当前 owner、数据边界和依赖方向冲突。 |

## 7. 对象附录索引与分布

| 组成部分 | 对象数 | 对象附录 | 状态 |
|---|---:|---|---|
| 工具合同与演进 | 6 | `02_hld_step_06_key_objects_contract_evolution.md` | completed |
| Capability Binding 与受控来源 | 6 | `02_hld_step_06_key_objects_binding_source.md` | completed |
| 规范调用与受理 | 5 | `02_hld_step_06_key_objects_invocation_admission.md` | completed |
| 执行前置与条件交接 | 6 | `02_hld_step_06_key_objects_precondition_handoff.md` | completed |
| Outcome、审计与安全交接 | 10 | `02_hld_step_06_key_objects_outcome_audit_handoff.md` | completed |
| 引用完整性与受控派生 | 8 | `02_hld_step_06_key_objects_integrity_derived.md` | completed |

## 8. 组成部分对象正式化停审记录

| 组成部分 | 候选是否处理完 | 对象是否有 capability 来源 | 是否越界 | 状态 |
|---|---|---|---|---|
| 工具合同与演进 | yes | yes | no | pass |
| Capability Binding 与受控来源 | yes | yes | no | pass |
| 规范调用与受理 | yes | yes | no | pass |
| 执行前置与条件交接 | yes | yes | no | pass |
| Outcome、审计与安全交接 | yes | yes | no | pass |
| 引用完整性与受控派生 | yes | yes | no | pass |

## 9. 与 Step 8 / Step 9 的反查清单

| 后续主线 / 状态族 | 已定义对象 | 反查结论 |
|---|---|---|
| 合同建立 / 修订 / 退役流；合同 lifecycle | `ToolContract`;`FormalToolDefinition`;`ToolCompatibilityImpact`;`DefinitionSourceRef`;`ToolContractEvolutionFact` | complete |
| Binding 分类 / 建替 / 重评 / 失效流；relation / assessment 状态 | `CapabilityBinding`;`CapabilityBindingAssessment`;`HubControlledSnapshot`;`HubCapabilityRef`;`CapabilityBindingChangeFact` | complete |
| Canonical invocation / admission 流；admission 状态 | `ToolInvocation`;`InvocationContractAnchor`;`InvocationContextRefs`;`InvocationAdmission` | complete |
| Execution requirement / authorization / Sandbox handoff 流；assessment / handoff / attempt 状态 | `ExecutionRequirement`;`AuthorizationConsumptionAssessment`;`AuthorizationResultRef`;`SandboxReadinessSnapshot`;`ExecutionHandoff`;`ExecutionHandoffAttempt` | complete |
| Execution source intake / outcome / audit 流；source / outcome 状态 | `SandboxExecutionSourceRef`;`ExecutionSourceAssessment`;`ToolInvocationOutcome`;`ToolAuditEntry` | complete |
| Safe handoff 流；eligibility / submission / external-ref 状态 | `SafeHandoffEligibility`;`SafeHandoffMaterial`;`ExternalSubmissionAttempt`;`BusDeliveryStatusRef`;`ObservationMaterialRef` | complete |
| Reference reconciliation / derived rebuild 流；gap / projection 状态 | `ReferenceValidityAssessment`;`ConsistencyGap`;`ReferenceConsistencyReport`;`ToolContractSearchProjection`;`ToolContractDiffSummary`;`ToolDiagnosticSummary`;`ToolConsumerGuidanceView`;`SharedContractAuthorityRef` | complete |
| 稳定 Query 读取 | `ToolContractView`;`CapabilityBindingView`;`ToolInvocationView`;`OutcomeAuditView` | complete |

后续 Step 8 / Step 9 只能使用本表对象或明确的字段类型；若需要新增正式对象，必须回退本步重新正式化。

## 10. 跨对象 / 跨组成部分一致性审计

| 审计主题 | 结论 | 说明 |
|---|---|---|
| 对象数量 / 名称唯一 | pass | 六附录分别 6 / 6 / 5 / 6 / 10 / 8，共 41 个；无重复名称。 |
| 候选池覆盖 | pass | Step 5 的 41 个正式候选全部独立成节，无新增对象主语。 |
| 字段类型 | pass | 所有关键字段使用概要类型名，不含语言 / DB / serialization 类型。 |
| 函数参数 | pass | 所有带参函数均为 `TypeName param_name`，无裸参数或实现签名。 |
| Stable ID / revision | pass | Tool identity、definition revision、invocation、outcome 和 facts 使用不同 ID / ref，未互相替代。 |
| Ref / snapshot / assessment | pass | Ref 负责定位，snapshot 负责消费时点摘要，assessment 负责 L2 判断；无语义合并。 |
| Current / history | pass | Contract / Binding current truth 与 evolution / change facts 分离；history 不反写 current。 |
| Admission / outcome | pass | 执行前判断与消费者终态分离，并通过 invocation / basis refs 回链。 |
| 两类 attempt | pass | `ExecutionHandoffAttempt` 面向 Sandbox execution seam；`ExternalSubmissionAttempt` 面向 post-outcome event seam。 |
| Local / external state | pass | L2 assessment / attempt / outcome 与 authorization decision、Sandbox lifecycle、Bus delivery、Observability observation 分离。 |
| Derived no-write | pass | Search / diff / diagnostic / guidance / report 无核心写权，派生失败不改 subject 状态。 |
| Forbidden body | pass | 所有 ref / snapshot / view / audit / material 均禁止 raw prompt / capture / provider / secret / external store body。 |
| Blocker 状态 | pass | Authorization / Sandbox / Observability / Core / SDK 缺口以 unverifiable / blocked / unknown / candidate-only 表达。 |
| 历史污染 | pass | `ToolPolicy` / `ToolScope` / `ToolHealth` / inventory / MCP client / host callback 只存在于排除说明。 |

## 11. 回填草稿

正式 §6 将按本主控 §6~§7 说明候选筛选和分布，并从六个附录逐对象回填基本信息、关键字段、状态、函数和禁止事项。正式正文不得把 41 个对象压缩成对象组，也不得把 blocked ref 写成 ready contract。

## 12. 完成门禁

| 门禁 | 结果 | 说明 |
|---|---|---|
| 每个候选独立成节 | pass | 41 个对象全部有基本信息、关键字段和禁止事项。 |
| 状态 / 函数按需完整 | pass | 有 lifecycle / assessment / attempt / freshness 的对象均定义状态；行为参数均有类型。 |
| 六组成部分逐项停审 | pass | 每个附录均 `completed / pass`。 |
| Step 8 / 9 反查 | pass | 所有预期 flow / state 主语已定义。 |
| 跨对象一致性 | pass | 无重复 owner、状态混并、ref 方向冲突或名称漂移。 |
| 概要层级 | pass | 未写完整 schema、函数签名、DDL、协议、mapping、route 或实现。 |

```text
step_status = completed
current_module = completed
gate_status = pass
next_allowed_action = create_step_07_api_interface_skeleton
formal_document_write_allowed = false
commit_required = false
```
