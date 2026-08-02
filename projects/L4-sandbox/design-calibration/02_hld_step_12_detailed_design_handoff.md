# Step 12. 详细设计承接清单

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 12
> 回填章节: `02-概要设计.md` §12 详细设计承接清单
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 把 Step 4~11 已收稳的代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、异常边界和配置影响显式列为 `03-详细设计.md` 的稳定输入,防止详细设计重新发明 `L4-sandbox` 的核心主语,或在落字段、协议、事务、错误和测试时暗改概要层结论。本步不新增新主语、不写开发任务、不写排期、不写完整 schema / DDL / config key / 测试用例全集。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 12 | 是。Step 11 审查点后用户已明确回复“同意”。 |
| 项目级台账是否允许进入 Step 12 | 是。`project_execution_ledger.md` 已将恢复点停在 `02-概要设计.md` Step 11,用户确认后允许进入 Step 12。 |
| 文档级 flow 是否允许进入 Step 12 | 是。`02_hld_calibration_flow.md` 已记录 Step 11 `pass_wait_review`,进入 Step 12 的门禁已满足。 |
| 是否已读取 Step 4~11 | 是。代码主体、主要组成部分、关键对象、接口骨架、处理流、状态机、异常边界和配置影响轮廓都已具备。 |
| 是否已读取概要 SOP Step 12 和书写规范 §4.12 | 是。必须输出承接清单表和回退规则说明,且不得新增未讨论主语。 |
| 是否发现阻塞 Step 12 的上游 blocker | 否。`04-配置设计.md`、`07-实施计划.md` 缺失仍是下游文档缺口,但不阻塞先把 `03` 的稳定输入钉死。 |

---

## 2. 本步目标

本步要做的不是开始写详细设计,而是把“概要层已经定死的东西”交给 `03-详细设计.md`。

本步要收稳:

- 哪些代码主体框架、主要组成部分和关键对象已经不能在 `03` 中重新发明。
- 哪些 Command / Query / Consumer / Job / Port / Flow / State 已经成为详细设计的稳定输入。
- `03` 应继续展开哪些字段、协议、函数、事务、一致性、错误、配置实现契约和测试切口。
- 如果 `03` 发现主语需要变更,应该回退到 `02` 的哪个 Step 修正。

本步不展开:

- 具体 Rust struct / enum / trait 签名。
- DTO / event payload / storage schema / DDL 细节。
- 配置 key、默认值、env var、产品参数。
- 测试用例全集、验收证据、实施任务或排期。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体骨架、运行单元和实现分层。 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 6 个主要组成部分、职责与边界。 |
| `02_hld_step_06_key_objects.md` 及对象附录 | 已完成 | 提供核心对象、guard、view、ref 和 relay / containment 等对象主语。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command / Query / Consumer / Outbound Event / Operations Job / Port 骨架。 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 intake、boundary、policy、run、capture、handoff、failure、cleanup、redline、projection、reconciliation、relay 主路径。 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供 6 组并行状态机、允许 / 禁止迁移和传播关系。 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供关键异常与边界场景。 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 提供配置影响轮廓、禁止配置化边界和 `04` 后移边界。 |
| `projects/L4-sandbox/00-需求文档.md` | 当前正式需求基线 | 提供核心闭环、数据归属、验收红线和一票否决线。 |
| `projects/L4-sandbox/01-架构设计.md` | 当前正式架构基线 | 提供依赖裁剪、一致性、运行承载、横切边界和风险挂起项。 |
| `projects/L1-artifact/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已读取 | 参考如何组织承接清单、回退规则和不进入清单内容。 |
| `projects/L1-governance/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已读取 | 参考如何把“03 必须展开什么”与“不能在 03 暗改什么”拆开表达。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取恢复点、Step 4~11、Step 12 标准和 L1 样例。 | done | 确认本步只列稳定输入和回退规则。 |
| 2 | 从代码主体、组成部分、对象、接口、flow、状态、异常和配置中提炼 `03` 不得重发明的主语。 | done | 形成承接清单候选池。 |
| 3 | 回答 Step 12 SOP 问题。 | done | 明确详细设计继续展开方向和回退位置。 |
| 4 | 输出承接清单表。 | done | 每条承接项都回指已收稳主语,不新增新主语。 |
| 5 | 输出继续展开方向、回退规则和不进入清单内容。 | done | 保障 Step 13 / `03/04/05/07` 不会串线。 |
| 6 | 更新 flow 和项目级台账,并停在用户审查点。 | done | 已同步 `02_hld_calibration_flow.md` 和 `project_execution_ledger.md`,当前进入 wait review,不跨到 Step 13。 |

---

## 5. SOP 问题回答

### 5.1 哪些代码主体框架已经由概要设计收稳,详细设计不能重新发明?

已收稳且 `03-详细设计.md` 不得重新发明的代码主体框架包括:

- 运行单元:
  `Sandbox Sync Entry`、`Sandbox async control and handoff consumption unit`、`Sandbox controlled execution fulfillment unit`、`Sandbox backend maintenance and cleanup unit`。
- 业务主要组成部分:
  `Controlled execution intake and identity`、`Boundary establishment and enforcement`、`Policy execution decision`、`Execution capture and material handoff`、`Failure control and safety closure`、`Local reference, projection and derived support`。
- application / domain / support 主体:
  `ControlledExecutionIntakeService`、`ExecutionEnvironmentService`、`BoundaryEstablishmentService`、`PolicyExecutionService`、`ControlledExecutionCarrierService`、`CaptureHandoffService`、`FailureControlService`、`CleanupReaperService`、`RedlineContainmentService`、`SandboxReadService`、`SandboxDerivedMaintenanceService`。
- port / read model / support 主体:
  `ContextReferenceResolverPort`、`PolicySummaryPort`、`BackendCapabilityPort`、`IsolationBackendPort`、`MaterialHandoffPort`、`ObservabilityMaterialPort`、`EventRelayPort`、`InvestigationHandoffPort`、`SandboxProjectionReadModels`、`DerivedInspectPreviewTrendReadModels`。

详细设计可以把这些主体落为 crate / module / trait / struct / constructor,但不能改写“谁拥有 truth、谁只做派生、谁只做交接、谁只能只读”的职责归属。

### 5.2 哪些对象、接口、处理流和状态机已经成为详细设计输入?

以下内容已经成为 `03-详细设计.md` 的稳定输入:

- 关键对象:
  `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`ExecutionContextResolution`、`ContextReferenceResolution`、`BoundaryRequirementSet`、`CoherentBoundary`、`BoundaryEstablishmentDecision`、`BackendCapabilitySummary`、`IsolationEnvironmentHandle`、`PolicyApplicabilitySnapshot`、`PolicyExecutionDecision`、`HighRiskActionDecision`、`ControlledExecutionRun`、`CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial`、`HandoffFact`、`FailureClassification`、`ControlFact`、`LeaseRecord`、`OrphanRecoveryRecord`、`CleanupGuard`、`RedlineContainment`、`SandboxReadProjection`、`DerivedInspectPreviewTrendState`、`SandboxEventRelayRecord`、`SandboxReconciliationReport`、`SandboxAuditTrace` 等。
- 接口族:
  Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 和外部 Port。
- 已点名 Command / Query / Job / Port 主语:
  `OpenControlledExecutionContext`、`EstablishExecutionBoundary`、`EvaluatePolicyExecution`、`StartControlledExecutionRun`、`RecordCaptureResult`、`OpenMaterialHandoff`、`SubmitSandboxControl`、`ClassifySandboxFailure`、`EvaluateCleanupReadiness`、`RecordRedlineContainment`、`GetSandboxReadProjection`、`GetDerivedInspectPreviewTrend`、`GetBackendCapabilityComparison`、`GetSandboxReconciliationReport`、`PublishSandboxEventRelay`、`RetryPendingMaterialHandoffs`、`RunLeaseOrphanReaper`、`EvaluatePendingCleanupGuards`、`MaintainRedlineContainmentHandoffs`、`RebuildSandboxReadProjections`、`MaintainDerivedInspectPreviewTrend`、`RunSandboxReconciliation`、`RefreshSandboxReferenceStates`、`RefreshBackendCapabilitySummaries`。
- 处理流族:
  intake 受理 / 拒绝、boundary requirement 合成与建立、policy summary 裁定、run 启动与 lifecycle 收束、capture / handoff、failure / control、lease / orphan / cleanup / reaper、redline containment / investigation handoff、query / projection / derived、relay / feedback / reconciliation。
- 状态机输入:
  6 组并行状态机及其允许 / 禁止迁移、传播关系和 no-write / no-rollback 红线。
- 异常和配置输入:
  Step 10 的关键异常边界,以及 Step 11 的配置影响和禁止配置化边界。

### 5.3 详细设计应继续展开哪些字段、协议、函数、事务、异常和测试内容?

详细设计应继续展开:

- 每个关键对象的正式字段、typed ref、enum / kind / reason、factory、member method 和 invariant。
- 每个接口的 request / response、stored result、idempotency、expected version、authorization、error surface 和 trace / metadata carrier。
- 每个处理流的 application service 编排、repository / port trait、transaction boundary、save order、outbox / relay / handoff / stale marker 顺序。
- 每个状态机的正式 enum、初始态、终态、重入规则、并发冲突规则、错误映射和 serialization / persistence shape。
- 详细错误 taxonomy、duplicate / delayed / retryable / failed / dead-letter / blocked / unavailable / degraded / not-visible / restricted 等 surface。
- 配置实现契约:
  `RuntimeConfig` owner、`ConfigLoader`、`ConfigValidator`、`AdapterConfig`、`JobConfig`、`ConfigError`、runtime builder 注入关系。
- 测试切口:
  query no-write、consumer 不写核心 truth、job 不修核心 truth、fail-closed、cleanup guard、redline containment、handoff no-rollback、relay no-rollback、配置不可越界等负向测试。

### 5.4 如果详细设计发现主语需要变更,应回退到哪里修正?

如果 `03-详细设计.md` 发现需要新增、删除、合并、重命名或改职责归属,说明概要设计还没有真正收稳,必须回退到对应 Step 修正:

- 代码主体 / 运行单元 / 分层主语变更:回退 Step 4。
- 主要组成部分 / 职责边界变更:回退 Step 5。
- 关键对象主语变更:回退 Step 6。
- 接口类别或命令 / 查询 / job 家族变更:回退 Step 7。
- 主处理流顺序或处理流家族变更:回退 Step 8。
- 状态组、禁止迁移或传播关系变更:回退 Step 9。
- 异常边界、cleanup / redline 语义变更:回退 Step 10。
- 配置影响或禁止配置化边界变更:回退 Step 11。
- 如果已经触动 truth ownership、依赖裁剪或需求红线,则回退 Step 1~3 或更上游 `00/01`。

### 5.5 哪些配置影响需要交给详细设计收口为实现契约?

需要由 `03-详细设计.md` 收口为实现契约的配置影响包括:

- sync entry、consumer、fulfillment、maintenance、query / derived、handoff / relay 的 config owner。
- backend profile、boundary profile、policy summary profile、handoff profile、cleanup profile、redline escalation profile、projection / reconciliation profile。
- `ConfigLoader` / `ConfigValidator` / runtime builder 的注入关系,以及启动阻断、adapter disabled、consumer delayed、read degraded、job skipped 的 surface。
- 未来 `04-配置设计.md` 的承接口径:哪些配置项属于 boundary / policy / handoff / cleanup / read-side / relay / port adapter 分类。

### 5.6 哪些未闭环内容不能写入承接清单,而应进入风险与待确认事项?

以下内容不能当作“已稳定输入”写进承接清单,应进入 Step 13 或后续文档:

- 具体 backend 产品组合、DB / object store / bus / observability / investigation 系统产品选型。
- 具体 network allowlist、seccomp / AppArmor / cap-drop、cluster / namespace / node pool、mount 清单。
- timeout / retry / backoff / cron / batch / retention / lease / SLO 等具体数字。
- 完整 config key、默认值、env var、secret、部署挂载。
- 完整测试用例全集、验收证据路径、实施 commit boundary、开发排期。

---

## 6. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `02/03` 没有明确“03 的稳定输入” | 详细设计容易重新发明对象、接口、状态和 port | 本步集中列出 Step 4~11 的稳定承接主语 |
| sandbox 主语跨 intake / boundary / policy / capture / cleanup / read-side 多条主线 | `03` 容易按实现便利拆散职责边界 | 本步按“代码主体 -> 组成部分 -> 对象 -> 接口 -> flow -> 状态 -> 配置”逐层锁定 |
| `04-配置设计.md` 当前缺失 | 详细设计容易顺手把配置项清单写进 `03` | 本步把配置实现契约和配置说明边界拆开 |
| 缺少显式回退规则 | `03` 可能在不回写 `02` 的情况下暗改主语 | 本步要求主语变更必须回退对应 Step |

---

## 7. 详细设计承接清单表

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| `Sandbox Sync Entry`、`Sandbox async control and handoff consumption unit`、`Sandbox controlled execution fulfillment unit`、`Sandbox backend maintenance and cleanup unit` | 定义各运行单元的 module / builder / handler / consumer / job runner、metadata、依赖注入和运行 report 契约 |
| 6 个主要组成部分 | 为每个组成部分定义 module boundary、service ownership、domain aggregate / policy / guard 归属、read / write / handoff / maintenance 接缝 |
| `ControlledExecutionIntakeService`、`ExecutionEnvironmentService`、`BoundaryEstablishmentService`、`PolicyExecutionService`、`ControlledExecutionCarrierService`、`CaptureHandoffService`、`FailureControlService`、`CleanupReaperService`、`RedlineContainmentService`、`SandboxReadService`、`SandboxDerivedMaintenanceService` | 定义 application service 函数、输入输出类型、repository / port 依赖、unit-of-work、result surface 和 trace / audit side effect |
| `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`ExecutionContextResolution`、`ContextReferenceResolution` | 定义字段、typed refs、状态字段、factory、accepted / rejected / unresolved / closed 迁移和并发规则 |
| `BoundaryRequirementSet`、`CoherentBoundary`、`BoundaryEstablishmentDecision`、`BackendCapabilitySummary`、`IsolationEnvironmentHandle` | 定义 boundary profile carrier、capability shape、decision enum、handle lifecycle、release / orphan / failed 规则 |
| `PolicyApplicabilitySnapshot`、`PolicyExecutionDecision`、`HighRiskActionDecision` | 定义 snapshot / summary shape、decision enum、high-risk markers、fail-closed guard 和 reevaluation 规则 |
| `ControlledExecutionRun`、`CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial`、`HandoffFact` | 定义 run lifecycle、capture completeness、material class、handoff receipt / failed / retryable shape 和 ownership guard |
| `FailureClassification`、`ControlFact`、`LeaseRecord`、`OrphanRecoveryRecord`、`CleanupGuard`、`RedlineContainment` | 定义 failure / control / lease / orphan / cleanup / containment 状态字段、transition method、reason / source / evidence carrier 和 block / release 规则 |
| `SandboxReadProjection`、`DerivedInspectPreviewTrendState`、`SandboxEventRelayRecord`、`SandboxReconciliationReport`、`SandboxAuditTrace` | 定义 projection / derived / relay / reconciliation / audit persisted shape、freshness、visibility、retry / dead-letter、finding / trace structure |
| `ControlledExecutionIntakeGuard`、`BoundaryCoherenceGuard`、`FailClosedPolicyGuard`、`CaptureCompletenessGuard`、`HandoffOwnershipGuard`、`ControlConflictGuard`、`CleanupSafetyGuard`、`RedlineContainmentGuard`、`DerivedReadOnlyGuard` | 定义 guard 输入、返回面、error shape、snapshot dependency 和 negative tests |
| Command 骨架 | 逐 command 定义 request / response DTO、actor context、command metadata、idempotency、expected version、stored result、error mapping |
| Query 骨架 | 逐 query 定义 request / response DTO、page / cursor、freshness、not-visible / restricted / stale / degraded / unavailable surface 和 no-write test |
| Inbound Event Consumer 骨架 | 定义 source envelope、schema version、dedupe、quarantine / delayed / duplicate / failed receipt 和 reference update 规则 |
| Outbound Event / relay 骨架 | 定义 outbound envelope、routing abstraction、publish result、feedback mapping 和 no-rollback rule |
| Operations Job 骨架 | 定义 job input / report、cursor、batch、retry、parallelism、stored report、idempotency 和 blocked / skipped / degraded surface |
| `OpenControlledExecutionContext` | 定义受理 DTO、resolver interaction、idempotency、stored result 和 accepted / rejected / unresolved response mapping |
| `EstablishExecutionBoundary` | 定义 boundary requirement assembly、capability check、backend interaction、pending / unsupported / failed surface |
| `EvaluatePolicyExecution` | 定义 policy summary / authorization input、fail-closed mapping、high-risk decision、rejudge before launch |
| `StartControlledExecutionRun` | 定义 launch request、handle lifecycle interaction、running / failed / terminated mapping 和 completion signal ingestion |
| `RecordCaptureResult`、`OpenMaterialHandoff` | 定义 capture result DTO、material refs、handoff target refs、receipt / failed / retryable mapping 和 ownership tests |
| `SubmitSandboxControl`、`ClassifySandboxFailure`、`EvaluateCleanupReadiness`、`RecordRedlineContainment` | 定义 control request、failure taxonomy、cleanup guard input、containment / investigation handoff mapping |
| `GetSandboxReadProjection`、`GetDerivedInspectPreviewTrend`、`GetBackendCapabilityComparison`、`GetSandboxReconciliationReport` | 定义 query projection shape、freshness / degraded exposure、comparison / report payload 和 no-write contract |
| `RefreshSandboxReferenceStates`、`RefreshBackendCapabilitySummaries`、`RetryPendingMaterialHandoffs`、`PublishSandboxEventRelay`、`RunLeaseOrphanReaper`、`EvaluatePendingCleanupGuards`、`MaintainRedlineContainmentHandoffs`、`RebuildSandboxReadProjections`、`MaintainDerivedInspectPreviewTrend`、`RunSandboxReconciliation` | 定义 job scanning、cursor / batch、retry / dead-letter、state update order、partial failure report 和 idempotency |
| Step 9 的 6 组状态机 | 定义正式 enum、初始态、终态、允许 / 禁止迁移矩阵、重入规则、并发冲突和 serialization / persistence shape |
| Step 10 的关键异常与边界场景 | 定义 error taxonomy、response mapping、retry / blocked / pending / unavailable / dead-letter / recovery cut 和 negative tests |
| Step 11 的配置影响轮廓和禁止配置化边界 | 定义 `RuntimeConfig` ownership、`ConfigLoader`、`ConfigValidator`、`AdapterConfig`、`JobConfig`、`ConfigError`、runtime builder 注入关系和配置越界负向测试 |

---

## 8. 详细设计继续展开方向

### 8.1 对象与状态契约

详细设计必须把 Step 6 / Step 9 闭成可落码对象契约:

- 关键对象的字段、newtype、typed ref、enum variant、状态字段、factory、member function。
- 状态迁移的输入、guard、输出、error、history / audit / relay / handoff 副作用。
- reason、kind、summary、scope、cursor、freshness、visibility、failure class 等 typed carrier。

### 8.2 协议与接口契约

详细设计必须把 Step 7 闭成正式接口契约:

- Command / Query request / response DTO。
- Consumer / Outbound Event envelope、schema version、source event id、trace context、actor metadata。
- Job input / report、cursor、retry result、partial failure surface。
- duplicate、unsupported version、restricted、stale、degraded、unavailable、failed、blocked 等 response / receipt surface。

### 8.3 Application flow 与事务契约

详细设计必须把 Step 8 闭成 application / transaction contract:

- service 编排顺序、repository / port trait、save order、stored result、relay trigger。
- truth、history、audit、handoff、stale marker、cleanup guard、relay state 的事务边界。
- Query no-write、Consumer 不写核心 truth、Job 不修核心 truth 的显式约束和测试。

### 8.4 Persistence / projection / handoff / relay 契约

详细设计必须定义:

- truth repository、history repository、projection repository、reference state repository、relay repository、handoff repository。
- projection rebuild、freshness marker、comparison / trend / reconciliation persisted shape。
- receipt validation、failed / retryable / dead-letter mapping、partial failure report。

### 8.5 配置与运行承载契约

详细设计必须定义:

- config owner、adapter config、job config、consumer config、publisher config、handoff config。
- config validation 失败时的启动阻断、adapter disabled、read degraded、consumer delayed、job skipped surface。
- application service 只接收已验证 config summary,domain 不直接读配置。
- 未来 `04-配置设计.md` 的参数分类、填充边界和说明入口。

### 8.6 测试与验收承接

详细设计必须为后续 `05-测试方案.md` 和 `06-验收标准.md` 提供:

- command / state transition tests
- query no-write / visibility / degraded tests
- consumer duplicate / unsupported version / forbidden body tests
- capture / handoff / relay / no-rollback tests
- cleanup guard / reaper / redline containment tests
- forbidden configuration / fail-closed / boundary no-silent-degrade negative tests

---

## 9. 概要设计回退规则

如果详细设计发现上述主语需要变更,说明概要设计尚未真正收稳,应先回到概要设计修正,不得在 `03-详细设计.md` 中暗改。

| 详细设计发现的问题 | 回退位置 | 说明 |
|---|---|---|
| 需要新增或删除运行单元 / 代码主体骨架 | Step 4 | 运行单元和实现分层必须先在概要层收稳 |
| 需要新增、删除或合并主要组成部分 | Step 5 | 业务组成部分不是实现期可私改项 |
| 需要新增关键对象、删除对象或改变对象归属 | Step 6 | 对象主语必须先在概要层正式化 |
| 需要新增接口族或改变接口分类 | Step 7 | 入口类别和 family 必须先在接口骨架收稳 |
| 需要新增处理流族或改变主路径顺序 | Step 8 | 这会直接改变应用编排和事务语义 |
| 需要改变状态组、主状态或禁止迁移 | Step 9 | 状态机红线不能在详细设计临时修改 |
| 需要改变异常边界、cleanup / redline 语义或让 Query / Job 写 truth | Step 10 | 已触动概要层边界规则 |
| 需要改变配置影响或允许配置绕过红线 | Step 11 | 配置不可越界是概要层门禁 |
| 需要改变 truth ownership、外部正文边界或依赖裁剪 | 回退 Step 1~3 或更上游 `00/01` | 这已超出概要局部调整范围 |

---

## 10. 不进入本承接清单的内容

以下内容不写入本承接清单,应进入 Step 13 或后续文档:

| 内容 | 后续归属 |
|---|---|
| 具体 backend / DB / object store / bus / observability / investigation 产品选型 | Step 13 / `04-配置设计.md` / `07-实施计划.md` / ADR |
| network allowlist 条目、security profile、mount 清单、cluster / namespace / node pool | Step 13 / `04-配置设计.md` / 测试方案 |
| timeout / retry / backoff / cron / batch / cursor / retention / lease / SLO 具体数字 | Step 13 / `04` / `05` / `06` |
| config key、默认值、env var、secret、部署挂载 | `04-配置设计.md` |
| 完整测试用例全集、验收 evidence 路径、mock 数据 | `05-测试方案.md` / `06-验收标准.md` |
| 实施 commit boundary、开发排期、提交顺序、boundary skeleton | `07-实施计划.md` |

---

## 11. 回填 `02-概要设计.md` §12 草稿

正式 `02-概要设计.md` 在 Step 14 才能重建。当前可回填的 §12 草稿骨架如下:

1. 先写一段总述:
   Step 4~11 已把 `L4-sandbox` 的代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、异常边界和配置边界收稳,这些内容应直接成为 `03-详细设计.md` 的稳定输入。
2. 再放承接清单表:
   至少摘录运行单元、6 个主要组成部分、关键对象、接口族、主处理流、状态机输入、异常输入和配置输入。
3. 再写详细设计继续展开方向:
   字段、协议、事务、一致性、错误、配置实现契约和测试切口都由 `03` 继续闭合。
4. 最后写回退规则:
   如果 `03` 发现主语需要变更,必须先回到 `02` 对应 Step 修正,不得在详细设计中暗改。

---

## 12. 自检

| 自检项 | 结果 | 说明 |
|---|---|---|
| 是否只写 Step 4~11 已收稳的结论 | 是 | 未新增未讨论对象、接口、流程或状态。 |
| 是否明确 `03` 继续展开什么 | 是 | 已覆盖对象、协议、事务、状态、配置契约和测试切口。 |
| 是否明确主语变更必须回退概要设计 | 是 | §9 已逐类列出回退位置。 |
| 是否滑入实施计划、配置说明或测试用例全集 | 否 | 这些都被留到 Step 13 或后续正式文档。 |
| 是否改动正式 `projects/L4-sandbox/02-概要设计.md` | 否 | 正式文档仍待 Step 14 重建。 |

---

## 13. 当前结论

`02-概要设计.md` Step 12 `详细设计承接清单` 已完成当前中间产物收敛,并已同步 `02_hld_calibration_flow.md` 与 `project_execution_ledger.md`。

当前恢复点已停在 Step 12 `completed_wait_user_review`。下一允许动作只有:

1. 等待用户审查本 Step 12 中间产物。
2. 只有在用户再次明确确认后,才允许读取概要设计 SOP Step 13、概要设计书写规范 §4.13,并进入 Step 13 `设计风险与待确认事项`。
