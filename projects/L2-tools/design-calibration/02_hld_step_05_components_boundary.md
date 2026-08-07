# L2-tools 02 概要 Step 5: 主要组成部分、职责与边界

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 逐一验证 Step 4 的六个业务主体族，先 capability、再对象线索、接缝与停审；本步不写对象字段、接口契约、完整处理流或状态机。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 5 主要组成部分、职责与边界 |
| 已读取台账 / flow | yes |
| 已读取前序 Step | yes: Step 1~4 |
| 已读取 SOP / 书写规范 | yes: 概要 SOP Step 5；概要书写规范 §5 / §4.5 |
| 已读取正式输入 | yes: 00 的 `FR/BR/DR/IB`；01 的 `A/S/P`、数据与交互 |
| 已读取参考粒度 | yes: Governance、Artifact、Method Library、Capability Hub 的 Step 5 |
| 旧材料处理 | 旧 registry / policy / executor / MCP / health 主线只作后置污染审计 |
| 进入条件 | pass: Step 4 已完成 |
| next_allowed_action | 按六个组成部分顺序完成小循环，最后做跨部分审计。 |

## 1. Step 内计划

| 模块 | 状态 | 核心产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 组成部分候选与复杂度判断 | done | 六部分采用结论 | pass | 建立总表 / 总图。 |
| 总表、对象发现维度、交互总图 | done | 全局骨架 | pass | 逐部分小循环。 |
| 1 工具合同与演进 | done | capability、主体、对象线索、停审 | pass | 进入部分 2。 |
| 2 Capability Binding 与受控来源 | done | capability、主体、对象线索、停审 | pass | 进入部分 3。 |
| 3 规范调用与受理 | done | capability、主体、对象线索、停审 | pass | 进入部分 4。 |
| 4 执行前置与条件交接 | done | capability、主体、对象线索、停审 | pass | 进入部分 5。 |
| 5 Outcome、审计与安全交接 | done | capability、主体、对象线索、停审 | pass | 进入部分 6。 |
| 6 引用完整性与受控派生 | done | capability、主体、对象线索、停审 | pass | 执行跨部分审计。 |
| 跨部分闭环 / 历史污染 / 一致性审计 | done | Step 6 候选池门禁 | pass | 创建 Step 6 主控与六个对象附录。 |

## 2. 本步输入与组成部分判定

### 2.1 判定规则

- 主要组成部分必须是稳定业务结构主语，能够独立承接 capability、domain 对象和接缝。
- `A1~A5/S1~S3/P1~P6` 是架构语义单元，不要求一一成为组成部分；本步按业务闭环与写权聚合。
- Inbound / Application / Domain / Ports / Persistence / Projection 是实现分层，不是组成部分。
- Hub、authorization、Sandbox、Runtime、Bus、Observability、SDK 是外部协作对象，不是组成部分。
- 任何组成部分若无法说明 capability、对象线索、非职责与相邻接缝，必须删除或合并。

### 2.2 六组成部分采用结论

| 组成部分 | 架构来源 | 独立存在理由 | 结论 |
|---|---|---|---|
| 工具合同与演进 | `A1/S1/P1` | Stable identity、current definition 与 evolution history 需要同一合同不变量和不同写职责。 | 采用 |
| Capability Binding 与受控来源 | `A2/P2/S2` | 本地 relation truth 与 Hub external truth 必须独立分权并可评估。 | 采用 |
| 规范调用与受理 | `A3/P5` | Invocation / admission 必须在真实执行前形成，且不吸收 Runtime orchestration。 | 采用 |
| 执行前置与条件交接 | `A4/P3/P4` | Requirement、authorization consumption 与 Sandbox handoff 需要共同形成执行前边界，同时不拥有外部 truth。 | 采用 |
| Outcome、审计与安全交接 | `A5/P4/P5/P6` | Semantic outcome、Tool audit 和 post-truth safe handoff 必须 local-first 且分层。 | 采用 |
| 引用完整性与受控派生 | `S2/S3/P1~P6` | 检测 / 对账 / 受控读取 / 派生必须可重建且不能反写核心。 | 采用 |

## 3. 组成部分总览

### 3.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 工具合同与演进 | 建立稳定工具合同、current definition、revision / compatibility / retirement history 与受控读取。 | Contract / definition / evolution services、domain facts、truth store、read view。 | Inventory、implementation、provider / capability identity、SDK wrapper、外部正文。 |
| Capability Binding 与受控来源 | 建立 bound / unbound 与 body-free relation，评估 Hub source 并显式表达 stale / conflict / gap。 | Binding / assessment services、relation facts、Hub ref / snapshot、store / view。 | Hub registry / descriptor / exposure / applicability、allowlist、authorization。 |
| 规范调用与受理 | 形成合同锚定 canonical invocation，完成 admission / reject / wait 与 no-execution 前置事实。 | Invocation / admission services、invocation / anchor / context / view、truth store。 | Runtime plan / loop / recovery、raw request、carrier 私有合同、真实执行。 |
| 执行前置与条件交接 | 形成 execution requirement、消费 authorization 结果并准备 / 记录条件化 Sandbox handoff。 | Precondition / handoff services、requirement / assessment / handoff facts、external ports。 | Authorization decision / taxonomy、Sandbox accepted / run / capture / receipt / cleanup。 |
| Outcome、审计与安全交接 | 受理 execution source，形成 normalized outcome / audit，判断并准备 safe material，记录本地 submission / gap。 | Normalization / audit / safe-handoff services、outcome / audit / material / attempts、ports / view。 | Raw capture / provider body、Bus delivery、Observability store、Runtime recovery。 |
| 引用完整性与受控派生 | 检测 typed refs、形成一致性 gap / report，构建 search / diff / diagnostic / consumer views。 | Integrity / read-model / diagnostic services、assessments / reports / projections / jobs。 | 修正核心或外部 truth、裁决 safe eligibility、成为 invocation 前置。 |

### 3.2 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开候选 |
|---|---|---|---|---|---|---|
| 工具合同与演进 | `ToolContract`;`FormalToolDefinition` | `ToolCompatibilityImpact` | `ToolContractView` | `DefinitionSourceRef` | `ToolContractEvolutionFact` | 六项全部 |
| Capability Binding 与受控来源 | `CapabilityBinding`;`CapabilityBindingAssessment` | Assessment 内的 source / relation invariant | `CapabilityBindingView`;`HubControlledSnapshot` | `HubCapabilityRef` | `CapabilityBindingChangeFact` | 六项全部 |
| 规范调用与受理 | `ToolInvocation`;`InvocationAdmission` | `InvocationContractAnchor` | `ToolInvocationView` | `InvocationContextRefs` | Admission / audit 由本地 facts 回链 | 五项全部 |
| 执行前置与条件交接 | `ExecutionRequirement`;`AuthorizationConsumptionAssessment`;`ExecutionHandoff`;`ExecutionHandoffAttempt` | Fail-closed 与 isolation invariant | 后续由 invocation / handoff query view 承接 | `AuthorizationResultRef`;`SandboxReadinessSnapshot` | Attempt 为 append-only local fact | 六项全部 |
| Outcome、审计与安全交接 | `ExecutionSourceAssessment`;`ToolInvocationOutcome`;`SafeHandoffEligibility`;`ExternalSubmissionAttempt` | Safe material 四项门禁 | `OutcomeAuditView` | `SandboxExecutionSourceRef`;`BusDeliveryStatusRef`;`ObservationMaterialRef` | `ToolAuditEntry`;`SafeHandoffMaterial` | 十项全部 |
| 引用完整性与受控派生 | `ReferenceValidityAssessment`;`ConsistencyGap` | No-write / re-entry invariant | `ReferenceConsistencyReport`;`ToolContractSearchProjection`;`ToolContractDiffSummary`;`ToolDiagnosticSummary`;`ToolConsumerGuidanceView` | `SharedContractAuthorityRef` | Report 保存检测语境，不充当核心 history | 八项全部 |

### 3.3 各部分交互总图

```text
正式维护入口
      │
      ▼
+----------------------+       Hub controlled source
| 1 工具合同与演进     |--------------┐
+----------+-----------+              │
           │ contract / definition    ▼
           ├----------------->+----------------------+
           │                  | 2 Binding / source  |
           │                  +----------+-----------+
           │                             │ applicable relation
           ▼                             ▼
+----------------------+       +----------------------+
| 3 规范调用与受理     |------>| 4 前置与条件交接     |----> Sandbox port
+----------+-----------+       +----------+-----------+
           │ invocation / admission      │ source / handoff context
           └-------------------+----------┘
                               ▼
                    +--------------------------+
                    | 5 Outcome / audit / safe |
                    +-------------+------------+
                                  │ safe post-truth material
                                  └--------------------> Event port

  +--------------------------------------------------------------+
  | 6 引用完整性与受控派生                                      |
  | read 1~5 + allowed refs; emit assessment/report/view; no write|
  +--------------------------------------------------------------+
```

关键说明：

- 图表达组成部分之间的主要语义接缝，不表示每次调用固定经过所有部分或完整时序。
- Capability Binding 只在 bound 工具 / 适用判断中参与；unbound 不是缺失 Binding 的默认解释。
- Sandbox 和 event 箭头只到 external port；不表示 mapping、receipt、route、delivery 或 observation ready。
- 第 6 部分只读核心 truth 与允许 refs，发现问题必须重入相应正式入口，不能直接回写 1~5。
- 图不表达字段、函数、事务、transport、topic、存储或部署。

## 4. 组成部分 1: 工具合同与演进

### 4.1 本部分职责

以稳定本地 `ToolContract` 为工具身份锚点，承载 `FormalToolDefinition` 的当前语义、显式 revision / retirement、兼容影响和合同读取。Current definition 与 evolution history 分权，但所有正式变化必须经同一合同不变量收口。

### 4.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 建立稳定工具合同 | 正式维护语境、定义来源 ref、首个 definition 候选 | `ToolContract` + `FormalToolDefinition` | 原子建立稳定身份与 current definition；冲突不留半合同 | Step 6 / 7 / 8 / 9 |
| 修订正式定义 | Contract anchor、current revision、definition change intent | 新 `FormalToolDefinition` + evolution fact | Current revision 显式替换，旧 revision 保留历史解释 | Step 6 / 7 / 8 / 9 |
| 评估兼容影响 | Current / candidate definition、既有引用与消费线索 | `ToolCompatibilityImpact` | 只形成影响判断；不能由 diff 自动提交 revision | Step 6 / 8 / 10 |
| 更正 / 退役合同 | Contract anchor、正式理由、影响判断 | 新 lifecycle / evolution fact | 显式变化并可追溯；不因 implementation 消失而隐式退役 | Step 6 / 7 / 8 / 9 |
| 稳定读取合同 | Tool anchor、允许 consumer context | `ToolContractView` | 只读；不得触发修订、刷新或外部穿透写入 | Step 6 / 7 / 8 |

### 4.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ToolContractService` | Application service | 编排建立、修订、更正、退役与读取。 | Step 7 / 8 |
| `ToolContractEvolutionService` | Application service | 编排 compatibility assessment 与正式演进重入。 | Step 7 / 8 |
| `ToolContract`;`FormalToolDefinition` | Domain truth | 承载稳定身份、current definition 与 revision 语义。 | Step 6 / 9 |
| `ToolContractEvolutionFact`;`ToolCompatibilityImpact` | Domain fact / value | 承载显式变化历史和影响判断。 | Step 6 / 9 |
| `DefinitionSourceRef` | Typed reference | 回链正式来源 / 评审，不保存正文。 | Step 6 |
| `ToolContractView` | Read model | 提供受控合同读取骨架。 | Step 6 / 7 |
| `ToolContractStore` | Persistence port | 保存 T1 contract truth 与 history。 | Step 7 / 03 |
| `ContractChangePublisherPort` | Collaboration port | 提供已提交安全变化候选。 | Step 7 / 03；route blocked |

### 4.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ToolContract`;`FormalToolDefinition` | 分别独立成节；说明 identity / definition 分工和生命周期。 |
| Policy / Invariant | `ToolCompatibilityImpact` | 独立成节；只表示影响结论，不成为自动批准策略。 |
| Projection / Read model | `ToolContractView` | 独立成节；只读且正文安全。 |
| Reference / Boundary | `DefinitionSourceRef` | 独立成节；保留 owner / source，禁止外部正文。 |
| Audit / History | `ToolContractEvolutionFact` | 独立成节；append-only，不能反写 current definition。 |

### 4.5 本部分不承担什么

- 不拥有具体工具 implementation、source tree、inventory、builtin / MCP / A2A / API registry、provider、secret 或 SDK wrapper。
- 不把 capability identity、显示名、实现名或库存项当 Tool identity。
- 不由 search / diff / reconciliation / Job 静默提交新 definition。
- 不在此部分完成 Binding、invocation、authorization、execution、outcome 或 delivery 状态。

### 4.6 与其他部分的接缝

- 向部分 2 提供稳定 Tool identity / definition anchor，用于声明 binding mode 和 relation。
- 向部分 3 / 4 提供适用 definition revision、调用约束、固有风险与 execution requirement 来源。
- 向部分 5 提供 result / error 语义和 audit 回链锚点。
- 由部分 6 只读形成 search / diff / diagnostic；任何修正必须重入本部分 Command。

### 4.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Capability 来源 | pass | 覆盖 `FR-L2T-001~003` 与 `DR-L2T-001~006`。 |
| 候选对象来源 | pass | 六个候选均来自合同建立 / 演进 / 读取需要。 |
| 接缝清晰 | pass | 输出 anchor，不接管 Binding / invocation / outcome。 |
| 非职责清晰 | pass | Inventory / implementation / provider / client 正文已排除。 |
| 详细设计越界 | pass | 未写字段、完整函数、schema、store 实现或 event route。 |

## 5. 组成部分 2: Capability Binding 与受控来源

### 5.1 本部分职责

在稳定 Tool identity 与 Hub 正式 capability ref 之间建立 `CapabilityBinding`，显式区分 bound / unbound，按消费时点评估 source 的 missing / stale / conflict / unverifiable，并保存 L2 自有 relation / assessment / change fact，不复制 Hub truth。

### 5.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 声明关联分类 | Tool contract、正式 binding mode intent | Bound 或 explicit-unbound 的 `CapabilityBinding` | 分类显式成立；空 ref 不等于 unbound | Step 6 / 7 / 8 / 9 |
| 建立 / 替换 Binding | Tool anchor、`HubCapabilityRef`、controlled snapshot | 新 / 替换后的 relation + change fact | Relation 强一致变化；Hub truth 不复制 | Step 6 / 7 / 8 / 9 |
| 评估当前 Binding | Binding、Hub ref / snapshot、消费时点 | `CapabilityBindingAssessment` | Valid / stale / conflict / missing / unverifiable；受影响路径 fail closed | Step 6 / 7 / 8 / 9 |
| 显式失效 / 终止关系 | Binding anchor、正式失效理由或 source change | 失效 relation + change fact | 不删除历史、不回退本地 registry / string match | Step 6 / 7 / 8 / 9 |
| 稳定读取 Binding | Tool / binding anchor | `CapabilityBindingView` | 只返回 L2 relation 与允许 source refs / summary | Step 6 / 7 |
| 检测外部变化线索 | Hub source change clue、已有 Binding | 新 assessment / gap 候选 | 只触发重评，不直接改 relation 或旧 invocation | Step 8 / 10；部分 6 Job |

### 5.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `CapabilityBindingService` | Application service | 编排分类、建立、替换、失效和读取。 | Step 7 / 8 |
| `BindingAssessmentService` | Application service | 评估 Hub source 与 relation 的当前可消费性。 | Step 7 / 8 |
| `CapabilityBinding`;`CapabilityBindingAssessment` | Domain relation / fact | 承载 L2 relation truth 和消费时点评估。 | Step 6 / 9 |
| `HubCapabilityRef`;`HubControlledSnapshot` | Typed ref / snapshot | 承接 Hub owner attribution 与允许摘要。 | Step 6 |
| `CapabilityBindingChangeFact` | History fact | 记录建立、替换、失效与正式理由。 | Step 6 / 9 |
| `CapabilityBindingView` | Read model | 提供 relation / assessment 安全读取。 | Step 6 / 7 |
| `CapabilityBindingStore` | Persistence port | 保存 T1 Binding truth 和 history。 | Step 7 / 03 |
| `HubControlledSourcePort` | Runtime boundary port | 获取 / 接收 Hub controlled ref / safe summary。 | Step 7 / 03 |

### 5.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `CapabilityBinding`;`CapabilityBindingAssessment` | 分别独立成节；relation 与 assessment 不混为一体。 |
| Policy / Invariant | Assessment 内的 body-free、owner-attribution、fail-closed 规则 | 不额外建立本地 allowlist / authorization policy 对象。 |
| Projection / Read model | `HubControlledSnapshot`;`CapabilityBindingView` | 分别独立成节；snapshot 不成为 Hub truth，view 不反写 relation。 |
| Reference / Boundary | `HubCapabilityRef` | 独立成节；不得包含 registry / descriptor / exposure body。 |
| Audit / History | `CapabilityBindingChangeFact` | 独立成节；append-only，不由 reconciliation 自动创建 relation。 |

### 5.5 本部分不承担什么

- 不拥有 capability identity、registry、descriptor、formal exposure、visibility、applicability、provider route / quota / cost / secret 正文。
- 不建立本地 capability registry、inventory、allowlist 或字符串匹配兜底。
- 不把 Hub visibility / exposure / applicability 解释为 invocation authorization。
- 不修改 Hub truth，不让后台对账直接创建 / 修复 Binding。

### 5.6 与其他部分的接缝

- 消费部分 1 的 Tool anchor；通过 `HubControlledSourcePort` 消费 Hub source。
- 向部分 3 提供 capability-bound 工具当前 relation assessment；unbound 路径提供显式分类而非缺省空值。
- 向部分 4 提供适用 capability context，但不产生 authorization 或 Sandbox readiness。
- 由部分 6 检测 refs / changes 并形成 report；正式 relation 变化重入本部分。

### 5.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Capability 来源 | pass | 覆盖 `FR-L2T-004~006` 与 `DR-L2T-007~012`。 |
| 候选对象来源 | pass | 六个候选分别承接 relation、assessment、ref、snapshot、history、view。 |
| 接缝清晰 | pass | Hub 仅 source port，后续调用只消费 L2 assessment。 |
| 非职责清晰 | pass | Registry / allowlist / authorization / provider control 已排除。 |
| 详细设计越界 | pass | 未写 Hub schema、字段、协议、route 或 freshness 数值。 |

## 6. 组成部分 3: 规范调用与受理

### 6.1 本部分职责

把正式 caller intent 承接为锚定 `ToolContract` 与适用 definition revision 的 canonical `ToolInvocation`，在任何真实执行前形成 `InvocationAdmission`。本部分只拥有工具合同内调用语义、调用语境引用和受理事实，不拥有 Runtime 的 action choice、plan、loop、checkpoint、retry 或 recovery。

### 6.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 规范化调用意图 | 正式 caller intent、Tool anchor、合同允许的参数语义、caller / actor / work / trace refs | `ToolInvocation` 候选 | 只保留合同内语义与安全引用；raw request / prompt / transport body 禁止入仓 | Step 6 / 7 / 8 |
| 建立合同锚定 | Invocation 候选、current definition、适用 Binding assessment | `InvocationContractAnchor` | 锚定消费时点的 identity / revision / binding context；后到变化不得覆盖 | Step 6 / 7 / 8 |
| 执行前受理 | Canonical invocation、合同锚定、当前可消费前置 | `InvocationAdmission` | 在真实执行前形成 admitted / rejected / awaiting-precondition / unavailable 语义 | Step 6 / 7 / 8 / 9 |
| 形成无执行前置事实 | Reject、awaiting 或 unavailable 判断及原因引用 | Admission fact 与 outcome 形成所需输入 | 不生成 Sandbox run / capture / failure；消费者终态由部分 5 收口 | Step 6 / 8 / 9 |
| 稳定读取调用 | Invocation anchor、允许 consumer context | `ToolInvocationView` | 只返回 canonical semantics、admission 与安全 refs；不穿透拉取 Runtime 正文 | Step 6 / 7 |
| 承接重复调用语境 | Caller-provided idempotency / correlation ref、既有 invocation | 既有 invocation 或显式冲突 | 重复输入不得分叉合同 truth；不把 retry policy 纳入本仓 | Step 7 / 8 / 10 |

### 6.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ToolInvocationService` | Application service | 编排规范化、合同锚定、受理和稳定读取。 | Step 7 / 8 |
| `InvocationAdmissionService` | Application service | 在执行前收口 admission / reject / wait / unavailable 判断。 | Step 7 / 8 |
| `ToolInvocation`;`InvocationAdmission` | Domain truth / fact | 承载 canonical invocation 与执行前受理事实。 | Step 6 / 9 |
| `InvocationContractAnchor` | Domain value | 固定本次调用消费的合同、definition 与适用 relation 语境。 | Step 6 |
| `InvocationContextRefs` | Context / reference object | 聚合允许的 caller / actor / work / trace / correlation refs 与安全摘要。 | Step 6 |
| `ToolInvocationView` | Read model | 提供 invocation / admission 的正文安全读取。 | Step 6 / 7 |
| `ToolInvocationStore` | Persistence port | 保存 T2 invocation 与 admission truth。 | Step 7 / 03 |
| `InvocationCallerPort` | Inbound boundary port | 承接 Runtime / direct caller 的正式调用意图。 | Step 7 / 03 |

### 6.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ToolInvocation`;`InvocationAdmission` | 分别独立成节；invocation 与执行前判断不可合并。 |
| Policy / Invariant | `InvocationContractAnchor` | 独立成节；消费时点锚定，不允许后到定义或 Binding 穿越覆盖。 |
| Projection / Read model | `ToolInvocationView` | 独立成节；只读且不复制 caller / Runtime 正文。 |
| Reference / Boundary | `InvocationContextRefs` | 独立成节；只保存 typed refs / safe summary，禁止 plan / loop / checkpoint body。 |
| Audit / History | `InvocationAdmission` 回链的判断事实 | 不另造重复 audit 对象；由 admission 与部分 5 `ToolAuditEntry` 分工承接。 |

### 6.5 本部分不承担什么

- 不选择下一 action，不拥有 agent loop、LLM planning、Runtime orchestration、checkpoint、retry / recovery 或 caller 生命周期。
- 不保存 raw prompt、conversation、caller / transport request body、secret 或合同外输入正文。
- 不把 direct、adapter、Sandbox carrier 或 future SDK 的私有 request schema 变成另一套 invocation 合同。
- 不在本部分裁决 authorization、准备 Sandbox handoff、形成 execution truth 或 normalized outcome。

### 6.6 与其他部分的接缝

- 消费部分 1 的 identity / definition anchor，以及适用时部分 2 的 Binding assessment。
- 向部分 4 提供已受理 invocation、合同锚定和安全 context refs；未受理路径不得进入执行前置交接。
- 向部分 5 提供 admission 与 no-execution 原因输入；部分 5 形成消费者可见终态和 audit。
- 部分 6 可检测 anchor / refs 有效性，但不得重写 invocation 或 admission。

### 6.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Capability 来源 | pass | 覆盖 `FR-L2T-007~009` 与 `DR-L2T-013~018`。 |
| 候选对象来源 | pass | 五个候选分别承接调用、受理、消费时点锚定、安全语境和读取。 |
| 接缝清晰 | pass | Admission 在执行前成立；consumer-visible no-execution 留给部分 5。 |
| 非职责清晰 | pass | Runtime orchestration、raw body、authorization 与 execution 均已排除。 |
| 详细设计越界 | pass | 未写 request schema、参数全集、幂等算法、transport 或 handler 签名。 |

## 7. 组成部分 4: 执行前置与条件交接

### 7.1 本部分职责

基于已受理 invocation 形成工具域 `ExecutionRequirement`，在 governed 场景消费正式 authorization 结果并判断来源可验证性，在 sandbox-required 场景评估承载前置并形成 L2 自有 `ExecutionHandoff` 与本地尝试事实。Authorization decision 与 Sandbox execution lifecycle 始终保留在外部 owner。

### 7.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 形成执行要求 | Admitted invocation、definition / binding 风险与承载语义 | `ExecutionRequirement` | 明确 governed / sandbox-required / direct-eligible 等工具要求；不等于 effective decision | Step 6 / 7 / 8 / 9 |
| 消费 authorization 结果 | Requirement、正式 `AuthorizationResultRef`、允许 safe summary、消费时点 | `AuthorizationConsumptionAssessment` | Valid / denied / missing / stale / conflict / unverifiable；不可验证 fail closed | Step 6 / 7 / 8 / 9 |
| 评估 Sandbox 前置 | Requirement、`SandboxReadinessSnapshot`、正式 authority / source refs | Handoff eligible / blocked / unavailable 判断 | Readiness 只表示 L2 消费判断，不等于 Sandbox ready / accepted | Step 6 / 7 / 8 / 9 |
| 准备执行交接 | Canonical invocation、合同锚定、已满足的前置、最小安全 context | `ExecutionHandoff` | 形成可交接语境；不保存 Sandbox request body 或执行正文 | Step 6 / 7 / 8 |
| 记录本地交接尝试 | Execution handoff、调用 carrier 的本地结果 | `ExecutionHandoffAttempt` | Append-only attempt / blocked gap；不宣称 accepted / receipt / run | Step 6 / 7 / 8 / 9 |
| 保守收束执行前失败 | 缺失 / 冲突 / 陈旧 / 不可验证前置或 carrier 缺口 | No-execution 输入与可追溯 gap | 不旁路 authorization / Sandbox，不宿主直跑 | Step 8 / 9 / 10 |

### 7.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ExecutionPreconditionService` | Application service | 编排 execution requirement、authorization 消费与前置判断。 | Step 7 / 8 |
| `SandboxHandoffService` | Application service | 编排条件化 Sandbox handoff 与本地 attempt / gap。 | Step 7 / 8 |
| `ExecutionRequirement`;`AuthorizationConsumptionAssessment` | Domain fact / assessment | 承载 L2 自有执行要求和外部结果可消费性判断。 | Step 6 / 9 |
| `ExecutionHandoff`;`ExecutionHandoffAttempt` | Domain context / fact | 承载最小交接语境和 append-only 本地尝试。 | Step 6 / 9 |
| `AuthorizationResultRef`;`SandboxReadinessSnapshot` | Typed ref / snapshot | 承接 owner attribution、safe summary 与消费时点。 | Step 6 |
| `AuthorizationConsumptionPort` | Runtime boundary port | 条件消费正式 authorization result / safe summary。 | Step 7 / 03；owner blocked |
| `SandboxExecutionPort` | Runtime boundary port | 条件提交 canonical handoff，并接收 carrier-level local response。 | Step 7 / 03；mapping / receipt blocked |
| `ExecutionHandoffStore` | Persistence port | 保存前置 assessment、handoff 与本地 attempt truth。 | Step 7 / 03 |

### 7.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ExecutionRequirement`;`AuthorizationConsumptionAssessment`;`ExecutionHandoff`;`ExecutionHandoffAttempt` | 四项分别独立成节；要求、判断、语境与尝试不得合并。 |
| Policy / Invariant | Fail-closed 与 isolation invariant | 并入上述对象禁止事项和 Step 10；不建立本地 authorization policy。 |
| Projection / Read model | Invocation / handoff query view 线索 | 并入 `ToolInvocationView` 或 Step 7 Query，不新增第二 truth。 |
| Reference / Boundary | `AuthorizationResultRef`;`SandboxReadinessSnapshot` | 分别独立成节；当前 blocker 状态必须写入基本信息。 |
| Audit / History | `ExecutionHandoffAttempt` | 独立成节；append-only，且不得吸收外部 receipt / run history。 |

### 7.5 本部分不承担什么

- 不拥有 authorization owner、source matrix、policy / approval 生命周期、高风险 taxonomy 或 effective allow / deny truth。
- 不建立本地 allowlist、last-known-good authorization、自批准或 Hub visibility 替代规则。
- 不拥有 Sandbox environment、request / run / capture / failure / receipt / feedback / cleanup / recovery truth。
- 不把本地 handoff attempt、carrier response 或 readiness snapshot 表述为外部 accepted、ready、executed 或 completed。

### 7.6 与其他部分的接缝

- 消费部分 3 已受理 invocation、合同锚定和 context refs；部分 2 仅提供适用 capability context。
- 通过 blocked `AuthorizationConsumptionPort` 消费正式结果，通过 logical `SandboxExecutionPort` 提交条件 handoff。
- 向部分 5 提供 no-execution 输入、handoff context 与后续 execution source 的关联锚点；不直接产生 outcome。
- 部分 6 可检测 authorization / Sandbox refs 和 attempts 的完整性，但正式变化必须重入本部分。

### 7.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Capability 来源 | pass | 覆盖 `FR-L2T-010~013` 与 `DR-L2T-019~026`。 |
| 候选对象来源 | pass | 六个候选覆盖 requirement、外部消费判断、handoff、attempt、authorization ref 与 readiness snapshot。 |
| 接缝清晰 | pass | L2 judgment / attempt 与外部 decision / execution truth 已分层。 |
| 非职责清晰 | pass | Authorization 与 Sandbox owner 边界未被开放 blocker 填平。 |
| 详细设计越界 | pass | 未伪造 owner、schema、mapping、receipt、carrier、freshness 或正向 readiness。 |

## 8. 组成部分 5: Outcome、审计与安全交接

### 8.1 本部分职责

正式受理与特定 invocation 关联的 execution source 或 no-execution 输入，验证来源并形成唯一 `ToolInvocationOutcome` 与 `ToolAuditEntry`；在本地 outcome / audit 已成立后，按最小必要、body-free、redacted、correlated 四项合取门禁准备安全材料，并记录本地外部提交尝试、降级和 gap。外部 execution、delivery 与 observation truth 不进入本部分终态。

### 8.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 受理 execution source | Invocation / handoff anchor、`SandboxExecutionSourceRef`、允许 source summary、消费时点 | `ExecutionSourceAssessment` | Accepted / rejected / missing / conflict / unverifiable；送达不等于 outcome | Step 6 / 7 / 8 / 9 |
| 形成 normalized success / failure | Accepted source assessment、definition result / error semantics | `ToolInvocationOutcome` | Success / tool-failure / execution-failure / capture-failure 等工具语义终态显式成立 | Step 6 / 7 / 8 / 9 |
| 形成 no-execution outcome | Admission / precondition reject、awaiting / unavailable reason | `ToolInvocationOutcome` | 锚定执行前事实，不补造 execution source 或 Sandbox 状态 | Step 6 / 8 / 9 |
| 原子收口 outcome 与 audit | Invocation、anchor、source / no-execution 输入、outcome | `ToolAuditEntry` | Outcome 与 audit 强一致或形成正式 audit gap；外部状态不参与提交条件 | Step 6 / 7 / 8 / 9 |
| 判断安全交接资格 | 已成立 outcome / audit、目标 collaboration class、sensitivity context | `SafeHandoffEligibility` | 四项门禁任一不满足即 ineligible，不允许“加密后例外” | Step 6 / 7 / 8 / 9 |
| 准备安全材料 | Eligible judgment、允许 refs / summaries | `SafeHandoffMaterial` | 只形成正文安全、可关联的最小材料；不复制 raw source | Step 6 / 7 / 8 |
| 记录外部提交尝试 | Safe material、event collaboration port 的本地调用结果 | `ExternalSubmissionAttempt` | Append-only submitted / degraded / gap；不声明 delivered / observed | Step 6 / 7 / 8 / 9 |
| 读取终态与追溯 | Invocation / outcome / audit anchor | `OutcomeAuditView` | 返回 L2 truth 与允许外部状态 refs；不以外部反馈改写终态 | Step 6 / 7 |

### 8.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `OutcomeNormalizationService` | Application service | 编排 source 受理、no-execution / result / error 归一化。 | Step 7 / 8 |
| `ToolAuditService` | Application service | 编排 outcome / audit 收口与稳定读取。 | Step 7 / 8 |
| `SafeHandoffService` | Application service | 编排 eligibility、material preparation 与本地 submission attempt。 | Step 7 / 8 |
| `ExecutionSourceAssessment`;`ToolInvocationOutcome` | Domain assessment / truth | 承载 execution material 可消费性与唯一工具语义终态。 | Step 6 / 9 |
| `ToolAuditEntry` | Audit record | 回链合同、调用、判断、终态与允许 source refs。 | Step 6 / 9 |
| `SafeHandoffEligibility`;`SafeHandoffMaterial`;`ExternalSubmissionAttempt` | Guard / material / fact | 承载安全资格、正文安全材料和本地提交事实。 | Step 6 / 9 |
| `SandboxExecutionSourceRef`;`BusDeliveryStatusRef`;`ObservationMaterialRef` | Typed reference | 分别承接 execution source、delivery 与 observation/material 外部引用。 | Step 6 |
| `OutcomeAuditView` | Read model | 提供 outcome、audit、attempt / gap 与允许摘要的稳定读取。 | Step 6 / 7 |
| `OutcomeAuditStore`;`ExternalSubmissionStore` | Persistence port | 保存 T2 outcome / audit 和本地 submission facts。 | Step 7 / 03 |
| `ExecutionSourceIntakePort` | Inbound runtime port | 承接正式 execution source / failure material 线索。 | Step 7 / 03；mapping / source blocked |
| `SafeEventCollaborationPort` | Outbound event port | 传播已成立且已通过安全门禁的本地事实材料。 | Step 7 / 03；route blocked |

### 8.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ExecutionSourceAssessment`;`ToolInvocationOutcome`;`SafeHandoffEligibility`;`ExternalSubmissionAttempt` | 四项分别独立成节；source、终态、安全资格与本地尝试不可合并。 |
| Policy / Invariant | `SafeHandoffEligibility` | 独立成节；固定四项合取，不拥有外部 delivery policy。 |
| Projection / Read model | `OutcomeAuditView` | 独立成节；不得将 delivery / observation 摘要升级为终态。 |
| Reference / Boundary | `SandboxExecutionSourceRef`;`BusDeliveryStatusRef`;`ObservationMaterialRef` | 三项分别独立成节；owner、消费时点和 blocker 分开表达。 |
| Audit / History | `ToolAuditEntry`;`SafeHandoffMaterial`;`ExternalSubmissionAttempt` | 三项分别独立成节；audit、material 和 attempt 生命周期不同。 |

### 8.5 本部分不承担什么

- 不拥有 Sandbox capture / failure / run、provider response、receipt、cleanup 或 carrier delivery 正文与生命周期。
- 不把 raw capture、provider body、stdout、Bus delivery fact 或 Observability projection 直接当 normalized outcome。
- 不拥有 Bus delivery、Observability observation/store、Runtime retry / recovery、evidence、验收或签署 truth。
- 不因外部 handoff 失败回滚、覆盖或改写本地 outcome / audit；不把 submitted 写成 delivered / observed。

### 8.6 与其他部分的接缝

- 消费部分 3 的 invocation / admission 与部分 4 的 no-execution / handoff context；execution source 只经正式 intake port 进入。
- 消费部分 1 的 result / error definition 语境及部分 2 的适用 relation anchor，用于解释本次 outcome。
- 向部分 6 提供只读 outcome / audit / attempt 与允许 refs；部分 6 只能派生、检测和报告。
- 通过 blocked event collaboration port 提交安全材料；外部 feedback 只能形成新 snapshot / ref / gap。

### 8.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Capability 来源 | pass | 覆盖 `FR-L2T-014~017` 与 `DR-L2T-027~034`。 |
| 候选对象来源 | pass | 十项对象覆盖 source assessment、outcome、audit、安全资格 / 材料、attempt、三类 ref 与 view。 |
| 接缝清晰 | pass | Source delivery、normalized outcome、本地 submission、delivery / observation truth 已分层。 |
| 非职责清晰 | pass | Raw body、Sandbox lifecycle、Bus / Observability truth 和 Runtime recovery 已排除。 |
| 详细设计越界 | pass | 未写 mapping、event、payload、topic、route、receipt、error code 或 evidence。 |

## 9. 组成部分 6: 引用完整性与受控派生

### 9.1 本部分职责

只读核心 truth 与允许的 snapshot / typed ref，在明确消费时点检测 authority、owner attribution、引用有效性和跨对象一致性，形成 `ConsistencyGap`、报告、search / diff / diagnostic / consumer guidance 等可重建输出。发现问题只能报告或触发正式重入，不能修正部分 1~5 或边界外 truth。

### 9.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 评估引用有效性 | Typed ref、authority ref、owner attribution、消费时点 | `ReferenceValidityAssessment` | Valid / stale / conflict / missing / unverifiable；只产生判断 | Step 6 / 7 / 8 / 9 |
| 检测跨对象一致性 | Contract / Binding / invocation / precondition / outcome / audit / attempts 与 refs | `ConsistencyGap` | 记录断链、漂移、owner gap；不直接修复 | Step 6 / 7 / 8 / 9 |
| 形成一致性报告 | Assessment / gaps、检测语境 | `ReferenceConsistencyReport` | 可重复生成；报告本身不成为核心 history 或 approval | Step 6 / 7 / 8 |
| 重建搜索投影 | Contract / definition / Binding / safe view | `ToolContractSearchProjection` | Fresh / stale / rebuilding / unavailable；不阻塞核心写入 | Step 6 / 7 / 8 / 9 |
| 形成定义差异摘要 | 两个已成立 definition / evolution anchors | `ToolContractDiffSummary` | Body-free、只读；diff 不自动提交 revision | Step 6 / 7 / 8 |
| 形成诊断摘要 | 核心 truth、assessment、gaps、允许 refs | `ToolDiagnosticSummary` | 可 stale / failed；不得变成 execution / observation truth | Step 6 / 7 / 8 / 9 |
| 形成消费者指导视图 | Contract / Binding / invocation 约束与允许 summary | `ToolConsumerGuidanceView` | 只说明当前正式消费边界，不生成 SDK client / runtime plan | Step 6 / 7 / 8 |
| 检测外部变化线索 | Hub / authorization / Sandbox / Bus / Observability safe clue | 新 assessment / gap / rebuild trigger | 后到材料只形成新判断；正式变化重入 owner Command | Step 7 / 8 / 10 |

### 9.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ReferenceIntegrityService` | Application service | 编排 authority / ref assessment、gap 与报告。 | Step 7 / 8 |
| `ToolDerivedViewService` | Application service | 编排 search / diff / diagnostic / guidance 的只读生成。 | Step 7 / 8 |
| `ReferenceValidityAssessment`;`ConsistencyGap`;`ReferenceConsistencyReport` | Assessment / fact / report | 承载引用判断、正式 gap 与检测报告。 | Step 6 / 9 |
| `ToolContractSearchProjection`;`ToolContractDiffSummary` | Projection / summary | 提供可重建搜索与合同差异材料。 | Step 6 / 9 |
| `ToolDiagnosticSummary`;`ToolConsumerGuidanceView` | Projection / read model | 提供安全诊断和消费者边界视图。 | Step 6 / 9 |
| `SharedContractAuthorityRef` | Authority reference | 指向 Core shared-contract authority；Tools-specific authority 未闭口时显式 gap。 | Step 6 |
| `ReferenceConsistencyJob`;`DerivedViewRebuildJob` | Operations job | 触发只读检测、报告与派生重建。 | Step 7 / 8 |
| `ProjectionStore` | Persistence / projection port | 保存 D1 可重建投影、报告与刷新状态。 | Step 7 / 03 |

### 9.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ReferenceValidityAssessment`;`ConsistencyGap` | 分别独立成节；assessment 与 gap 不得合并为自动修复状态。 |
| Policy / Invariant | No-write / formal re-entry invariant | 并入每个对象禁止事项与 Step 10，不单建可修改 policy。 |
| Projection / Read model | `ReferenceConsistencyReport`;`ToolContractSearchProjection`;`ToolContractDiffSummary`;`ToolDiagnosticSummary`;`ToolConsumerGuidanceView` | 五项分别独立成节；各自来源、freshness 与禁止反写边界不同。 |
| Reference / Boundary | `SharedContractAuthorityRef` | 独立成节；不得伪造 Core Tools-specific package / schema。 |
| Audit / History | Report 的检测语境与 gap refs | 由 report / gap 自身承接；不得冒充核心 evolution / audit history。 |

### 9.5 本部分不承担什么

- 不创建、更正、替换或退役合同，不建立 / 修复 Binding，不受理 invocation，不形成 outcome / audit 或 safe eligibility。
- 不修改 Core、Hub、authorization、Sandbox、Runtime、Bus、Observability 或 SDK truth，也不复制其正文。
- 不让 search / diff / diagnostic / guidance / reconciliation 成为 invocation、outcome 或本地 truth 成立的同步前置。
- 不生成 SDK client、marketplace listing、外部 registry、Runtime plan、测试 evidence 或 readiness 结论。

### 9.6 与其他部分的接缝

- 只读部分 1~5 的正式对象和允许的 `P1~P6` refs / snapshots；无任何直接回写箭头。
- 外部变化线索只触发 assessment / gap / projection rebuild；需要改变核心时返回对应部分的正式 Command。
- 只读 view 可被 Runtime、future SDK 或运维消费者使用，但 consumer 不取得 truth 写权。
- `SharedContractAuthorityRef` 只记录 Core authority 位置；`L2T-UP-008` 未闭口时受影响类型 / package 继续 blocked。

### 9.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Capability 来源 | pass | 覆盖 `S2/S3/P1~P6` 与需求中的引用、追溯、受控读取及派生约束。 |
| 候选对象来源 | pass | 八项对象覆盖 assessment、gap、report、四类派生输出与 Core authority ref。 |
| 接缝清晰 | pass | 只有 read / assess / report / rebuild，正式变化必须重入部分 1~5。 |
| 非职责清晰 | pass | 核心写入、外部 truth、SDK / marketplace / Runtime planning 已排除。 |
| 详细设计越界 | pass | 未写调度、索引、缓存、查询 DSL、store、refresh interval 或具体 Core package。 |

## 10. 总体边界说明

六个组成部分共同形成“合同成立、受控关联、规范调用、条件执行、语义终态、只读维护”的工具行动契约闭环。它们不是固定部署单元，也不是强制每次调用遍历的线性 pipeline：unbound 工具不消费 Hub Binding，非 governed 调用不消费 authorization，非 sandbox-required 调用不建立 Sandbox handoff，未通过安全资格判断的 outcome 不进入外部提交。任何条件分支都不得改变 canonical invocation / result / error 的单一语义。

本仓的写权止于工具合同、Binding relation、invocation / admission、执行要求与本地 handoff 事实、normalized outcome / Tool audit、安全资格 / 材料 / 本地提交事实以及自身检测 / gap。Runtime orchestration、Hub registry truth、authorization decision、Sandbox execution truth、Bus delivery、Observability observation/store、SDK client 和外部正文保持边界外 owner。

## 11. Step 6 对象候选池门禁

### 11.1 正式候选分布

| 组成部分 | 正式候选数 | Step 6 独立对象 |
|---|---:|---|
| 工具合同与演进 | 6 | `ToolContract`;`FormalToolDefinition`;`ToolCompatibilityImpact`;`ToolContractView`;`DefinitionSourceRef`;`ToolContractEvolutionFact` |
| Capability Binding 与受控来源 | 6 | `CapabilityBinding`;`CapabilityBindingAssessment`;`HubControlledSnapshot`;`CapabilityBindingView`;`HubCapabilityRef`;`CapabilityBindingChangeFact` |
| 规范调用与受理 | 5 | `ToolInvocation`;`InvocationAdmission`;`InvocationContractAnchor`;`ToolInvocationView`;`InvocationContextRefs` |
| 执行前置与条件交接 | 6 | `ExecutionRequirement`;`AuthorizationConsumptionAssessment`;`ExecutionHandoff`;`ExecutionHandoffAttempt`;`AuthorizationResultRef`;`SandboxReadinessSnapshot` |
| Outcome、审计与安全交接 | 10 | `ExecutionSourceAssessment`;`ToolInvocationOutcome`;`SafeHandoffEligibility`;`ExternalSubmissionAttempt`;`OutcomeAuditView`;`SandboxExecutionSourceRef`;`BusDeliveryStatusRef`;`ObservationMaterialRef`;`ToolAuditEntry`;`SafeHandoffMaterial` |
| 引用完整性与受控派生 | 8 | `ReferenceValidityAssessment`;`ConsistencyGap`;`ReferenceConsistencyReport`;`ToolContractSearchProjection`;`ToolContractDiffSummary`;`ToolDiagnosticSummary`;`ToolConsumerGuidanceView`;`SharedContractAuthorityRef` |
| 合计 | 41 | 每项在 Step 6 独立成节；不得用对象组替代。 |

### 11.2 不进入 Step 6 的名称

| 名称类别 | 处理位置 | 不作为关键对象的原因 |
|---|---|---|
| `*Service` | Step 7 / Step 8 | Application 编排主体，不是 domain / reference / projection 对象。 |
| `*Store` | Step 7 / 03 | Persistence port，不拥有额外业务语义。 |
| `*Port` | Step 7 / 03 | Inbound / runtime / event collaboration 边界，开放 seam 仍可能 blocked。 |
| `*Job` | Step 7 / Step 8 | Operations trigger，不是正式 truth。 |
| Fail-closed、isolation、no-write / re-entry invariant | 对象禁止事项、Step 10 | 是跨对象不变量，不建立本地 policy truth。 |
| Handoff query view | 并入 `ToolInvocationView` / Step 7 Query | 避免形成第二 invocation / handoff truth。 |
| ID、revision、reason、status、timestamp 等值类型 | 作为 Step 6 字段类型 | 仅需点名概要类型，不必各自独立成节。 |
| Command / Query / Consumer DTO、event payload | Step 7 / 03 | 协议形态后移，不能反推 domain object。 |
| 表、索引、topic、consumer group、cache entry | 03 | 属于详细设计或实现选择。 |

## 12. 跨组成部分闭环审计

| 审计主题 | 审计结论 | 处理结果 |
|---|---|---|
| Identity / definition owner | 只有部分 1 写 `ToolContract` 与 current definition。 | pass；Hub capability、implementation 和 inventory 均不得成为定义源。 |
| Binding 与 authorization 重叠 | 部分 2 只拥有 relation / source assessment，部分 4 只消费正式 authorization result。 | pass；无 local allowlist / self-authorization 对象。 |
| Admission 与 no-execution outcome | 部分 3 记录执行前判断，部分 5 形成消费者可见终态。 | pass；两者通过 invocation anchor 回链而不合并。 |
| 两类 handoff attempt | 部分 4 的 `ExecutionHandoffAttempt` 面向 Sandbox execution；部分 5 的 `ExternalSubmissionAttempt` 面向 post-outcome event collaboration。 | pass；名称、时点、目标和外部状态均不同。 |
| Execution source 与 outcome | `SandboxExecutionSourceRef` / assessment 只作为来源，`ToolInvocationOutcome` 是唯一工具终态。 | pass；capture / provider response 不冒充 outcome。 |
| Audit 与 Observability | `ToolAuditEntry` 是工具域 audit，`ObservationMaterialRef` 仅引用外部材料。 | pass；不拥有 observation store / observed truth。 |
| 派生与核心写权 | 部分 6 只 read / assess / report / rebuild。 | pass；问题修复必须重入部分 1~5 Command。 |
| 对象重复 | 41 个候选名称唯一；view、ref、attempt 均有唯一 owner。 | pass；无跨部分重复对象。 |
| 对象孤儿 | 每个候选均至少回指一项 capability，且在 Step 6 有独立展开位置。 | pass；无无来源候选。 |
| 接口归属 | Command / Query 由相应 Application service 承接，外部 seam 由 port 承接。 | pass；Step 7 不得把 port 写成外部 ready contract。 |
| 处理流覆盖 | 合同、Binding、invocation、precondition、source / outcome、safe handoff、integrity / rebuild 均有 flow 主语。 | pass；Step 8 必须覆盖 P0 写路径和影响一致性的 Job。 |
| 状态语义 | Local truth、external assessment、local attempt、derived freshness、external status 分属不同对象。 | pass；Step 9 禁止构造全仓统一状态机。 |
| 详细设计承接 | Services / ports / stores / jobs 均标注 Step 7 / 8 / 03；对象标注 Step 6 / 9。 | pass；后续位置无悬空。 |

## 13. 历史材料污染审计

| 历史主语 / 方案 | 冲突 | 当前处理 |
|---|---|---|
| `ToolDefinition` 由 capability catalog / adapter 输入直接生成 | 将 Hub / provider truth 迁入本仓并缺少稳定合同演进。 | 仅作 historical material；当前由 `ToolContract` + `FormalToolDefinition` + `DefinitionSourceRef` 承接。 |
| `ToolInvocationRequest`、host callback、stdout 主线 | Caller / carrier 私有合同与 execution material 冒充工具语义。 | 不继承；当前使用 canonical `ToolInvocation`、source assessment 与 normalized outcome。 |
| `ToolPolicy` / `ToolScope` / PermissionCheckResult | 使 L2 拥有 authorization / allowlist truth。 | 不继承；只保留 `ExecutionRequirement` 与正式 result consumption assessment。 |
| member-service host execution | 旧相邻仓定位与当前 Sandbox execution owner 不一致。 | 不继承；只保留 Sandbox logical port、handoff attempt 和 source ref。 |
| Local registry、builtin inventory、MCP client / extras | 把外部 registry / product assembly / client 纳入工具合同层。 | 全部排除。 |
| `ToolHealth` / availability、retryable error | 混合 execution / provider / Runtime recovery 状态。 | 不继承为核心对象；外部 readiness、gap 和工具 outcome 分层表达。 |
| 固定 Rust 目录、RPC / HTTP、event、error code、SLA | 属于旧实现假设或未验证事实。 | 仅用于污染检查，不进入 Step 5 候选池。 |

## 14. 后续展开一致性检查

| 后续 Step | 必须承接 | 当前门禁结论 |
|---|---|---|
| Step 6 | 41 个对象逐对象字段 / 状态 / 函数 / 禁止事项；按六部分拆附录。 | pass；候选池完整且无重复。 |
| Step 7 | Command、Query、Inbound Consumer、Outbound Event、Job、Persistence / runtime / event ports。 | pass；开放 seam 必须标 `blocked` / `logical` / `future`。 |
| Step 8 | 各部分主要写流、P0 Command、外部输入正式重入、关键 Query / Job。 | pass；不得画成所有 seam 每次同步串联。 |
| Step 9 | Contract / Binding / admission / precondition / outcome / attempts / ref / projection 多状态族。 | pass；不得合并外部 decision / execution / delivery / observation 状态。 |
| Step 10 | Missing / stale / conflict / unverifiable、mapping / route gap、forbidden body、迟到材料。 | pass；不写错误码大全。 |
| Step 11 | 只识别配置影响类型与禁止配置化边界。 | pass；owner、canonical semantics、fail-closed、safe gate 不可配置化。 |
| Step 12 | 对象、接口、flow、state、boundary 和 blocker 的 03 承接。 | pass；不得新增 Step 5 未出现主语。 |

## 15. Step 5 回填草稿

正式 §5 使用本文件 §3 的总表 / 总图、§4~§9 的六部分职责 / 主体 / 对象线索 / 非职责 / 接缝，并保留 §10~§14 的总体边界、Step 6 候选门禁与跨部分审计摘要。正式正文不复制停审过程和历史扫描全文，但必须明确 41 个候选的后续去向及 blocker 状态。

## 16. 完成门禁

| 门禁 | 结果 | 说明 |
|---|---|---|
| 六个主要组成部分已独立停审 | pass | 每部分 capability、主体、对象线索、非职责和接缝完整。 |
| 对象候选池可驱动 Step 6 | pass | 41 个候选均独立展开；接口 / port / store / job 已剔除。 |
| 跨部分冲突已消歧 | pass | Admission / outcome、两类 attempt、source / result、audit / observation 已分权。 |
| 后续展开无悬空 | pass | Step 6~12 承接位置全部明确。 |
| Historical material 未回流 | pass | 旧 policy / inventory / executor / MCP / member-service 主线均排除。 |
| Blocker 事实诚实 | pass | `L2T-UP-001~009` 持续开放，未伪造 owner、mapping、route、schema 或 ready。 |

```text
step_status = completed
gate_status = pass
next_allowed_action = create_step_06_main_and_six_object_appendices
formal_document_write_allowed = false
commit_required = false
```
