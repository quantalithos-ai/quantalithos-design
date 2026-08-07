# L2-tools 02 概要 Step 12: 详细设计承接清单

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 只把 Step 4~11 已收稳的代码主体、组成部分、41 个对象、接口、流、状态、异常和配置影响交给 `03-详细设计.md`；不新增主语，不写任务、排期、实现 commit、run_id、测试结果、evidence alias 或验收签署。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 12 详细设计承接清单 |
| 已读取台账 / flow | yes |
| 已读取前序 Step | yes: Step 4~11 |
| 已读取 SOP / 书写规范 | yes: 概要 SOP Step 12；概要书写规范 §4.12 |
| 已读取参考粒度 | yes: Governance、Artifact、Method Library、Capability Hub Step 12 |
| 旧材料处理 | 旧正式 02/03 的 registry、policy、host executor、MCP / builtin、RPC / DB / replay 只作 pollution audit，不作为 03 输入 |
| 进入条件 | pass: Step 11 completed |
| next_allowed_action | 建立稳定输入与 03 展开矩阵、blocked condition、回退规则和 Step 13 风险入口。 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 标准 / 上游 / 参考读取 | done | §0~§2 | pass |
| SOP 问题回答 / 取舍 | done | §3~§4 | pass |
| 代码主体 / 组成部分承接 | done | §5 | pass |
| 41 对象承接 | done | §6 | pass |
| 接口 / port 承接 | done | §7 | pass |
| Flow / state / exception / config 承接 | done | §8~§11 | pass |
| Blocked boundary / 03 输出 / 回退 | done | §12~§15 | pass |
| 覆盖 / 历史污染 / 正式回填 / 门禁 | done | §16~§19 | pass |

## 2. 本步输入与稳定性分类

| 输入层 | 稳定输入 | 03 可细化 | 03 不得暗改 |
|---|---|---|---|
| Step 4 | 六业务主体族；Inbound / Application / Domain / Ports / Persistence / Projection 分层 | Module / type / trait / builder / constructor 边界 | 业务主体与实现分层混合、adapter / projection 定义 truth |
| Step 5 | 六组成部分 capability、职责 / 非职责、跨部分接缝 | 组成部分内 service / object / port 组织 | 合并 / 拆分组成部分、迁移 owner、恢复边界外能力 |
| Step 6 | 41 个关键对象及字段 / 状态 / 函数骨架 | Exact value types、fields、functions、invariants、domain errors、serialization | 新增 / 删除 / 合并 / 重命名正式对象或改变 owner |
| Step 7 | 13 Commands、11 Queries、5 Consumers、4 Event skeletons、4 Jobs、external / persistence ports | Request / response、envelope、trait、error、idempotency / dedup contract | 改接口读写性质、Consumer / Job 取得 core write、event skeleton 变既有协议 |
| Step 8 | 通用路径与 12 个关键流族 | Application flow、repository / port calls、unit-of-work、failure mapping | 改 local-truth-first、formal re-entry、sync / async / background 语义 |
| Step 9 | 多对象状态族、允许 / 禁止迁移、传播和迟到材料规则 | Enum / sum type、guard、concurrency、persistence、correction fact | 合并 owner 状态、覆盖 terminal、外部状态反写 |
| Step 10 | 56 个关键异常 / 边界场景和 6 类处置 | Typed errors、response mapping、retry ownership、quarantine / recovery cut、negative contracts | Host bypass、default allow、source 猜 outcome、外围失败回滚 truth |
| Step 11 | 配置影响、25 条禁止配置化红线、03 / 04 分工 | Config types / validator / builder / adapter / job / projection contract | 配置改变 owner / invariant / state / safety / blocked seam truth |

## 3. SOP 问题回答

1. 03 不能重新发明的代码主体包括六业务组成部分，以及 Inbound / Operations、Application Services、Domain Model / Facts、Ports、Persistence、Projection / Material 的分层与单向依赖。
2. 41 个对象、13 Commands、11 Queries、5 Consumers、4 Event skeletons、4 Jobs、external / persistence ports、12 个独立流族和多状态族都已经成为 03 的稳定输入。
3. 03 应继续展开 exact fields / types / functions / invariants、DTO / envelope / event / job / port contracts、application transaction、idempotency / dedup / ordering、error taxonomy、state guard、persistence / projection、configuration implementation contract 和后续测试设计输入。
4. 若要改变代码主体、组成部分、对象、接口、流、状态、异常或配置红线，必须分别回退 Step 4~11；若改变 owner、依赖裁剪、数据边界或非目标，必须回退 Step 1~3，必要时回到正式 00 / 01。
5. Step 11 的 ConfigLoader / Validator / RuntimeConfig / Adapter / Store / Consumer / Publisher / Job / Projection / Error / builder 方向进入 03；具体 key / value / format / env / secret / endpoint / schedule 数字继续留 04。
6. `L2T-UP-001~009` 涉及的具体 authority / schema / mapping / route / provider / client / readiness / measurement 不能当成已收稳的 03 输入；只能作为 blocked condition 和 Step 13 风险 / 待确认事项。

## 4. 当前材料诊断与设计取舍

| 风险来源 | 问题 | 当前处理 |
|---|---|---|
| Step 4~11 主语分散 | 03 容易漏对象、重命名接口或弱化状态红线 | 本 Step 建统一承接索引与覆盖审计。 |
| 旧正式 03 已有 Rust / RPC / HTTP / DB / replay 细节 | 会倒推当前 02 主语和技术方案 | 全部作为 historical material；当前 03 必须 full-restart。 |
| 41 对象数量较多 | 可能被压缩成几个 DTO / record | 按六组成部分锁定对象组；每个对象都需 exact contract。 |
| Blocked external ports 已点名 | 可能被误读为可实现正向 integration | 每个 port 携带 blocking condition，未闭口只能设计 fail-closed / blocked surface。 |
| Event skeleton 已命名 | 可能被误读为 schema / topic 已发布 | 03 可设计 L2 semantic contract，但 route / carrier authority 仍受 blocker。 |
| 配置方向已点名 | 可能提前写成 04 key 清单 | 03 只定义 implementation contract；values / format / deployment 后移 04。 |

设计取舍：

- 采用“稳定主语 + 03 展开 + 不得暗改 / blocked condition”三层承接，而不是机械复制 Step 4~11。
- 41 个对象按六组列全名并给组级 exact-contract 要求；正式 §12 可压缩为组级承接，但 Step 12 中间产物保留全量追溯。
- 允许 03 细化语言级 type / function / module naming，只要不改变业务主语、owner 与职责；若 exact naming 暴露主语缺失，必须回退 Step 6 / 7。
- 不把测试用例全集放入本 Step，只定义 03 应为 05 / 06 提供的 contract / invariant / negative surface。
- 不把 implementation boundary、排期或 commit plan 放入本 Step；这些属于 07。

## 5. 代码主体与组成部分承接清单

| 已由概要设计收稳 | 详细设计继续展开 | 不得暗改 / 回退条件 |
|---|---|---|
| Inbound / Operations:Command intake、Query intake、Consumer boundary、Job trigger | Handler / consumer / job runner、context factory、validation order、typed input / output、config injection | 不得绕过 application service / 直接写 store；改变入口类型回退 Step 4 / 7。 |
| Application Services:六组成部分 use-case 编排 | Service methods、dependency ports、unit-of-work、idempotency、result / error surface | 不保存跨调用 truth、不吞并 Runtime orchestration；改变职责回退 Step 4 / 5。 |
| Domain Model / Facts:41 对象及 guard / invariant | Aggregate / entity / value / fact / view / ref / assessment / material / projection 的 exact type organization | 不从 adapter / DB / transport 反推 truth；对象变更回退 Step 6。 |
| Ports:Core、Hub、Caller、Authorization、Sandbox、Source、Event boundaries | Port traits、safe input / output、authority / correlation / mapping guards、blocked response | 不把 logical / blocked port 写成 provider ready；改变依赖 owner 回退 Step 1~3 / 正式 01。 |
| Persistence:truth / attempt / ref / gap / projection stores | Repository traits、stored result、expected version、unit-of-work、read isolation、history retention contract | 不锁具体 DB / table；不允许 partial truth；改变 truth owner 回退 Step 4~6。 |
| Projection / Material:views、search / diff / diagnostic / guidance / report / safe material | Projection shape、watermark / freshness、rebuild、degraded reads、safe serialization | 不反写 core truth、不 fallback inventory / external body；改变语义回退 Step 6 / 8 / 9。 |
| 工具合同与演进 | Module / services / objects / store / source port / event seam 的 exact boundary | Stable identity、current / history、formal evolution 不变；改变组成部分回退 Step 5。 |
| Capability Binding 与受控来源 | Relation aggregate、assessment / snapshot / ref、Hub adapter、consistency job | L2 不拥有 Hub truth / registry；formal unbound 规则不变。 |
| 规范调用与受理 | Canonical invocation aggregate / anchor / context / admission、caller adapter、idempotency store | 不保存 raw request / Runtime plan，不形成 caller-specific contract。 |
| 执行前置与条件交接 | Requirement / auth assessment / Sandbox readiness / handoff / attempt、blocked ports | 不自授权、不拥有 Sandbox lifecycle、不 host bypass。 |
| Outcome、审计与安全交接 | Source assessment、terminal outcome、audit atomic boundary、safe material / submission / feedback refs | 不把 capture / carrier / delivery / observation 当 outcome，不让外围回滚本地 truth。 |
| 引用完整性与受控派生 | Ref assessment、gap、report / projections、integrity / rebuild / refresh jobs | Query / Job 不修 subject，gap closure formal re-entry，derived no-fallback。 |

## 6. 41 个关键对象承接清单

### 6.1 工具合同与演进对象

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 |
|---|---|---|
| `ToolContract` | Exact identity / current-definition / lifecycle fields、factory、adopt / retire guards、expected-version / persistence contract | Stable identity；`retired` 不原地 active；current change only through formal flow。 |
| `FormalToolDefinition` | Revision identity、semantic input / output / risk / execution requirement safe fields、candidate / current / superseded / withdrawn guards | 不含 implementation / provider / secret body；历史 revision immutable。 |
| `ToolCompatibilityImpact` | Impact dimensions、basis refs、consumer impact、compatible / conditional / incompatible / unverifiable representation | Assessment 不切 current；unverifiable 不默认 compatible。 |
| `ToolContractView` | Stable read shape、current / history refs、gap / availability surface、visibility boundary | View 不刷新 / 修复 source，不成为 second truth。 |
| `DefinitionSourceRef` | Authority / subject / revision / consumption-time fields、validity assessment linkage | Ref 只定位，不承载 external body 或自动证明 source valid。 |
| `ToolContractEvolutionFact` | Change kind、old / new refs、actor / reason / trace / time、append-only history contract | History 不反写 current；event material 后置。 |

### 6.2 Capability Binding 与受控来源对象

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 |
|---|---|---|
| `CapabilityBinding` | Relation identity、tool / capability refs、mode、lifecycle、replace / invalidate guards | Bound / explicit-unbound formal classification；不复制 Hub truth。 |
| `CapabilityBindingAssessment` | Consumption context、basis refs / snapshot、valid / conservative states、impact | Assessment per consumption time；不等于 authorization。 |
| `HubControlledSnapshot` | Allowed safe summary、source revision / observed time、freshness / conflict representation | Body-free；新 snapshot 不覆盖历史 invocation anchor。 |
| `CapabilityBindingView` | Relation / selected assessment / gaps / source ref safe read shape | View 不生成 unbound / valid 或 local registry inventory。 |
| `HubCapabilityRef` | Typed authority / identity / revision / resolution fields and validation contract | String / name hit 不等于 resolved。 |
| `CapabilityBindingChangeFact` | Declare / replace / invalidate history、old / new refs、actor / reason / trace | Append-only；Hub clue / Job 不直接生成 relation change。 |

### 6.3 规范调用与受理对象

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 |
|---|---|---|
| `ToolInvocation` | Invocation identity、canonical intent / safe arguments、context / anchor refs、creation semantics | 不含 raw prompt / carrier body / Runtime plan；不是 execution lifecycle。 |
| `InvocationAdmission` | Decision kind / reason / basis、admitted / awaiting / rejected / unavailable exact representation | Immutable decision fact；后到材料不原地翻转。 |
| `InvocationContractAnchor` | Tool / definition / Binding / assessment consumption-time refs and verification rules | 历史 anchor stable；current change 不穿越覆盖。 |
| `ToolInvocationView` | Invocation / admission / precondition / outcome refs、stable / pending / gap surfaces | Query-only；不拉 Runtime / external body。 |
| `InvocationContextRefs` | Caller / work / trace / correlation typed refs、sufficient / degraded / insufficient rules | Missing required ref fail closed；不补造 caller / checkpoint。 |

### 6.4 执行前置与条件交接对象

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 |
|---|---|---|
| `ExecutionRequirement` | Requirement classification basis、authorization / Sandbox applicability、unsupported surface | 工具域要求不等于 external decision；配置 / caller 不可取消适用前置。 |
| `AuthorizationConsumptionAssessment` | Invocation-bound result ref、authority / freshness / subject match guards、allow / constrained / deny / conservative representation | L2 只评估可消费性，不创建 decision；unverifiable fail closed。 |
| `ExecutionHandoff` | Invocation / precondition / safe context anchors、preparing / eligible / blocked / invalidated guards | Eligible 不等于 Sandbox accepted；blocked 不 host fallback。 |
| `ExecutionHandoffAttempt` | Attempt identity、handoff ref、local response / failure category、trace / time、append-only persistence | Attempt 不迁移为 run / receipt；每次 attempt 新 fact。 |
| `AuthorizationResultRef` | Authority / decision / subject / invocation / revision / validity safe fields | Ref 不携带 policy / evidence body，不由 L2 补造 owner。 |
| `SandboxReadinessSnapshot` | Source / mapping / carrier availability safe summary、consumption time、blocked reasons | Snapshot 不拥有 Sandbox readiness truth / lifecycle；mapping blocked 显式。 |

### 6.5 Outcome、审计与安全交接对象

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 |
|---|---|---|
| `ExecutionSourceAssessment` | Source authority / correlation / mapping guards、accepted / conservative states、basis refs | Delivery / capture 不等于 accepted source；new assessment 不覆盖 old。 |
| `ToolInvocationOutcome` | One-of success / tool-failed / execution-failed / capture-failed / no-execution classes、safe result / error refs、basis | 每 invocation 单一 immutable terminal semantic truth；不含 raw body / retry policy。 |
| `SafeHandoffEligibility` | Target-specific minimal / body-free / redacted / correlated checks、eligible / ineligible / unverifiable | 四项合取不可配置放宽；eligibility 不等于 submission / delivery。 |
| `ExternalSubmissionAttempt` | Prepared / submitted-locally / local-failure / route-blocked / degraded fields、target / material refs | Outcome 后置 append-only fact；不迁移 delivered / observed。 |
| `OutcomeAuditView` | Outcome / audit / source / allowed external refs、gap / degradation surface | Read-only；Bus / Observability status 不改 outcome / audit。 |
| `SandboxExecutionSourceRef` | External source identity / invocation correlation / revision / safe summary ref / received-at fields | 不保存 capture / provider body，不拥有 run lifecycle。 |
| `BusDeliveryStatusRef` | Submission / delivery ref、status observation time、unknown / referenced / conservative states | L2 不拥有 publish / retry / DLQ / replay truth；submitted != delivered。 |
| `ObservationMaterialRef` | Material / observation ref、route / source status、unknown / referenced / conservative states | 不拥有 observation store / retention；不声明 observed without formal source。 |
| `ToolAuditEntry` | Invocation / admission / requirement / outcome basis refs、actor / trace / safe reason / time、append-only contract | 与 outcome 同 L2 boundary 收口；不由 logging / event / observation 替代。 |
| `SafeHandoffMaterial` | Target / fact / audit refs、redaction / correlation proof summary、immutable safe carrier | Body-free、minimal、redacted、correlated；不携带 result / audit / evidence body。 |

### 6.6 引用完整性与受控派生对象

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 |
|---|---|---|
| `ReferenceValidityAssessment` | Subject / ref / authority / consumption-time / impact、valid / stale / conflict / missing / unverifiable representation | Assessment 不修 ref / subject，不自动决定 unrelated paths。 |
| `ConsistencyGap` | Gap identity / subject / impact / evidence refs、open / pending / resolved / superseded guards | Subject owner 先修；gap Command 只验证关闭；无伪 evidence。 |
| `ReferenceConsistencyReport` | Scope / watermark / assessment / gap refs、current / partial / stale / failed surface | Report 不定义 subject state，不把 partial 写 healthy。 |
| `ToolContractSearchProjection` | Search-safe fields / index refs / watermark / freshness / rebuild contract | 不成为 registry / allowlist / authorization；failure不改 core。 |
| `ToolContractDiffSummary` | Base / target / impact refs、body-free differences、freshness | Diff 不批准 / adopt revision，不承载 full definition body。 |
| `ToolDiagnosticSummary` | Subject refs、safe truth / assessment / attempt / gap summary、freshness | 不成为 ToolHealth / Observability truth / Runtime recovery input。 |
| `ToolConsumerGuidanceView` | Contract / Binding / gap refs、consumer-safe guidance、freshness / unavailable surface | 不生成 SDK client、Runtime plan 或 authorization decision。 |
| `SharedContractAuthorityRef` | Core authority / contract family / version / resolution assessment fields | `candidate_only` 不等于 resolved；L2 不私造 Core package / schema。 |

### 6.7 对象级通用展开要求

03 对全部 41 个对象统一继续定义：

- Exact type category:aggregate / entity / immutable fact / value object / assessment / snapshot / typed ref / view / projection / material。
- Exact fields、typed IDs / refs、revision / timestamp / reason / actor / trace / watermark 结构和 forbidden-body guard。
- Factory / member functions、preconditions、postconditions、domain errors、idempotency / concurrency / expected-version semantics。
- Serialization / version compatibility / persistence / history / correction / projection rebuilding contract。
- Object-level negative tests and property / invariant test inputs for 05，without fabricating results。

若 03 发现某个行为需要新业务对象才能拥有状态、identity、history 或独立 failure semantics，必须回退 Step 6，而不是用 anonymous DTO / map / generic record 隐藏新主语。

## 7. API、Consumer、Event、Job 与 Port 承接清单

### 7.1 Command API

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 / blocker |
|---|---|---|
| `EstablishToolContract` | Request / response、source validation、identity creation、first revision / evolution atomic write、errors / idempotency | Source unverifiable leaves no half contract。 |
| `AssessToolDefinitionChange` | Candidate / consumer-impact inputs、assessment algorithm boundary、stored fact / error | Does not switch current revision。 |
| `AdoptToolDefinitionRevision` | Impact basis guard、expected current revision、atomic old/new/current/evolution write | Incompatible / stale / unverifiable blocked。 |
| `RetireToolContract` | Request / complete semantics、impact closure guard、history / new-invocation behavior | No implicit retirement / deletion / resurrection。 |
| `DeclareCapabilityBinding` | Bound / explicit-unbound request variants、Hub ref / snapshot validation、atomic relation / assessment / change | Null ref != unbound；Hub contract stays external。 |
| `ReplaceCapabilityBinding` | Expected relation / replacement validation、atomic old/new history、errors | No half replacement / fallback unbound。 |
| `InvalidateCapabilityBinding` | Reason / actor / expected state、history and affected new-use behavior | No deletion / local registry fallback。 |
| `SubmitToolInvocation` | Canonicalization、anchor construction、context / admission guards、idempotency、reject no-execution / audit atomic branch | Before real execution；raw request forbidden。 |
| `EvaluateExecutionPreconditions` | Requirement classification、sync authorization result consumption、Sandbox applicability、fail-closed outputs | `L2T-UP-001~002`;no self-authorization。 |
| `PrepareExecutionHandoff` | Handoff eligibility / invalidation、safe carrier mapping input、local attempt / no-execution write | `L2T-UP-003~004`;no host bypass / fake receipt。 |
| `AcceptExecutionSource` | Authority / correlation / mapping validation、normalization、one terminal outcome + audit unit-of-work | `L2T-UP-003`;no fabricated mapping / raw body。 |
| `PrepareSafeExternalHandoff` | Four-gate evaluation、material construction、local port call / degradation | `L2T-UP-004~006`;route may remain blocked。 |
| `RecordConsistencyGapResolution` | Subject-repair verification、formal evidence ref guard、gap transition / conflict | Does not repair subject；no fake evidence / run / signoff。 |

All Commands must expand `ActorContext`、`CommandMetadata`、`IdempotencyKey`、`TraceContext`, but exact transport DTO / error mapping is a 03 decision and must preserve these semantics.

### 7.2 Query API

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 |
|---|---|---|
| `GetToolContract`;`GetCapabilityBinding`;`GetToolInvocation`;`GetExecutionPreconditionView`;`GetOutcomeAudit` | Exact request / response、visibility / consumer guard、not-found / unavailable / gap surface、pagination where applicable | Stable reads only；no refresh / external body pull / write。 |
| `CompareToolDefinitionRevisions`;`CompareToolContracts` | Revision selection / compatibility refs、body-free diff / stale surface | Diff does not adopt / modify current。 |
| `GetReferenceConsistencyReport` | Scope / watermark / partial / stale / failed read contract | Report does not define subject health。 |
| `SearchToolContracts` | Safe filter / page / ordering、projection freshness / unavailable surface | No registry / allowlist / authorization fallback。 |
| `GetToolDiagnostic` | Subject selector、safe truth / ref / attempt / gap summary、freshness | No ToolHealth / Runtime recovery / observation store ownership。 |
| `GetToolConsumerGuidance` | Consumer context、body-free guidance / gaps / availability | No SDK generator / plan / auth decision。 |

All Queries must expand `ActorContext`、`QueryMetadata`、`ConsumerContext` and no-write tests.

### 7.3 Inbound Consumer / Outbound Event / Operations Job

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 / blocker |
|---|---|---|
| `ConsumeHubCapabilityChangeClue` | Envelope / authority / version / dedup / ordering、snapshot / assessment / gap write | Consumer never replaces Binding / old anchors。 |
| `ConsumeAuthorizationResultChangeClue` | Pending source contract、ref validation / gap、blocked response | `L2T-UP-001~002`;does not replace sync result consumption。 |
| `ConsumeSandboxExecutionSource` | Source envelope / ref / safe summary validation、dedup / conflict、formal Command re-entry | `L2T-UP-003~004`;does not write outcome directly。 |
| `ConsumeBusDeliveryStatusFeedback` | Conditional feedback contract、delivery ref / gap write、unknown / conflict handling | Does not infer delivered from local submit or own retry truth。 |
| `ConsumeObservationStatusFeedback` | Blocked feedback contract / safe ref / gap / unavailable surface | `L2T-UP-005~006`;does not claim observed。 |
| `ToolContractChanged`;`CapabilityBindingChanged`;`ToolOutcomeAuditMaterialAvailable`;`ToolConsistencyGapChanged` | Semantic event envelope / version / safe payload / local publication result / compatibility direction | Skeleton only；schema / topic / route blocked where applicable；truth first。 |
| `CheckCapabilityBindingConsistency`;`CheckReferenceIntegrity` | Job input / scope / watermark / report、batch / cursor / idempotency、assessment / gap writes | Detection only；no relation / subject repair。 |
| `RebuildToolDerivedViews` | Projection scope / watermark / builders / replace semantics / partial failure report | Does not block or alter core truth。 |
| `RefreshExternalStatusRefs` | Conditional sources、attempt selection、new refs / gaps / unknown surface | No formal source means no polling that fabricates truth。 |

All Consumers expand `EventEnvelope`、`SourceEventId`、`DeduplicationKey`、`ContractVersion`、`SourceAuthorityRef`、`TraceContext`;all Jobs expand `SystemActorContext`、`JobMetadata`、`JobRunKey`、`TruthWatermark`. These are design contracts, not actual run IDs or execution evidence.

### 7.4 External / Persistence / Projection ports

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 / blocker |
|---|---|---|
| `SharedContractAuthorityPort` | Resolver trait、contract family / version query、resolved / candidate / conflict errors | `L2T-UP-008`;no invented Core type / package。 |
| `HubControlledSourcePort` | Snapshot / ref resolver、authority / version / timeout errors | Runtime seam；no Hub body / registry replication。 |
| `InvocationCallerPort` | Carrier adapters to one canonical Command request / result / error | No caller-specific tool contract。 |
| `AuthorizationConsumptionPort` | Pending invocation-bound request / result ref contract and fail-closed error | `L2T-UP-001~002`;positive provider not assumed。 |
| `SandboxExecutionPort` | Safe handoff carrier mapping / local response / timeout errors | `L2T-UP-003~004`;attempt != accepted / receipt / run。 |
| `ExecutionSourceIntakePort` | Source ref / safe summary / envelope intake result | Delivery != accepted source / outcome。 |
| `SafeEventCollaborationPort` | Safe material submit / local failure / route-blocked result | `L2T-UP-004~006`;no delivery / retry / DLQ / observation ownership。 |
| Six truth / attempt stores | Repository traits、stored result、expected version、unit-of-work and stable reads | No DB / table selection；preserve atomic invariants。 |
| `ProjectionStore` | Projection / report / watermark reads and rebuild replace semantics | No core write / fallback truth。 |

## 8. 关键处理流承接清单

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 / blocker |
|---|---|---|
| `GenericCommandWritePath` | Validation、load、domain call、unit-of-work、stored result / idempotency、error mapping | External delivery不进入 local commit；no anonymous write。 |
| `GenericStableQueryPath` | Visibility / consumer guard、view repository、not-found / stale / gap / unavailable surface | No refresh / repair / external body pull。 |
| `GenericInboundConsumerPath` | Envelope / authority / version / dedup / ordering、ref / snapshot / assessment / gap writes、Command re-entry | Consumer no direct core write；late material append-only。 |
| `GenericOperationsJobPath` | Runner、scope / cursor / watermark、assessment / report / projection writes、partial result | Job no subject repair / fake external truth。 |
| `SafeOutboundMaterialPath` | Committed fact selection、four-gate evaluation、material persistence、local submit / degradation | Truth first；route may be blocked；no raw body。 |
| Contract establishment | Source validation、identity / first revision / history atomicity、idempotent duplicate handling | No half contract / inferred external identity。 |
| Contract evolution | Assess / adopt / retire exact sequencing、expected current、history and derived stale propagation | Assessment != adoption；old invocation anchor stable。 |
| Binding mutation | Declare / replace / invalidate exact transaction、formal unbound variant、history | No null-as-unbound / Hub copy / local registry fallback。 |
| Binding clue / consistency | Consumer and Job entry mapping、assessment / snapshot / gap persistence、formal relation re-entry | Detection does not mutate relation。 |
| Canonical invocation / admission | Canonicalization、anchor / context / admission / reject-outcome-audit transaction and idempotency | Before execution；no raw request / Runtime state。 |
| Execution precondition | Requirement + authorization result assessment、constraint guard、no-execution branch | `L2T-UP-001~002`;unverifiable fail closed。 |
| Sandbox handoff | Readiness / mapping guard、handoff state、port call / local attempt、blocked no-execution | `L2T-UP-003~004`;no host bypass / fake receipt。 |
| Execution source / outcome / audit | Async clue intake、formal source acceptance、normalization、single outcome + audit transaction | `L2T-UP-003`;delivery != acceptance；mapping blocked no guessed outcome。 |
| Safe external handoff | Eligibility / material / local submission sequencing、per-target attempt / gap | `L2T-UP-004~006`;external feedback independent。 |
| External feedback | Bus / Observation ref validation、dedup / late / conflict / unknown behavior | No external status writes outcome / audit / Runtime recovery。 |
| Integrity / gap resolution | Assessment / report / gap open、subject owner repair proof、pending / resolved / superseded guards | Gap close only；no fake evidence / auto-repair。 |
| Derived rebuild / complex read | Projection builders、watermark / replace / partial failure、fresh / stale / rebuilding / unavailable reads | No core prerequisite / fallback inventory。 |

03 may factor common implementation helpers, but may not merge business flow families if that erases different owners, transaction boundaries, fail-closed timing, or external-status semantics.

## 9. 状态与状态传播承接清单

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 |
|---|---|---|
| Contract lifecycle / definition revision | Exact enums / sum types、transition guards、expected version、history / correction representation | No retired resurrection / superseded rollback / Job pointer update。 |
| Compatibility / source assessment | Assessment value types、basis refs、freshness / conflict errors | New fact, not in-place rewrite;unverifiable blocks adoption。 |
| Binding lifecycle / assessment / snapshot | Relation transition matrix、replacement transaction、consumption-time assessment | Null != unbound;invalidated no in-place recovery;old anchors stable。 |
| Context sufficiency / admission | Decision construction、immutable persistence、reject no-execution linkage | Rejected / unavailable never flips to admitted。 |
| Requirement / authorization / readiness | Classification / assessment exact variants and per-invocation basis | Requirement != decision;unverifiable fail closed;no global policy state。 |
| Handoff / execution attempt | Preparing / eligible / blocked / invalidated guards、attempt append semantics | Attempt never becomes external lifecycle。 |
| Source / terminal outcome / audit | Source assessment variants、one-terminal uniqueness、audit unit-of-work / correction fact | Terminal never overwritten;raw source not outcome。 |
| Safe eligibility / submission / external refs | Target-scoped eligibility、attempt transitions、Bus / Observation ref states | Submitted != delivered / observed;two external owners remain separate。 |
| Reference / gap / report / projection | Impact-aware gaps、formal resolution、watermark / rebuild / partial / failed states | Job / report / projection no subject write / truth inference。 |
| Global propagation | Core truth -> new invocation eligibility / derived stale / optional safe material;external refs only append | No cross-owner global state machine or transaction。 |
| Late / duplicate / conflict material | Dedup / ordering / conflict assessment / correction contract | No last-write-wins across anchors / terminal truth。 |

03 must define exact state storage, transition authorization, concurrency conflict, serialization compatibility, and correction / superseding facts. It must not turn assessment、snapshot、attempt、outcome、audit or external refs into one mutable status record.

## 10. 异常与边界承接清单

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 |
|---|---|---|
| `pre_execution_fail_closed` | Typed rejection / unavailable taxonomy、response mapping、audit basis、idempotent repeat | No real execution / Sandbox facts / host bypass。 |
| `source_not_accepted` | Authority / correlation / mapping errors、unresolved surface、gap / later formal re-entry | No guessed terminal outcome。 |
| `terminal_conflict` | Duplicate / late / conflicting source detection、conflict gap、correction / superseding contract | Existing outcome / audit immutable；no second current terminal。 |
| `post_truth_degradation` | Local submission / route / feedback errors、partial status / reconciliation cut | Outcome / audit unchanged；L2 does not own delivery recovery。 |
| `derived_read_degradation` | Stale / rebuilding / unavailable / partial response types and rebuild error | Core truth / stable read unaffected；no old cache fallback。 |
| `formal_reentry_required` | Subject-specific Command re-entry、gap pending / evidence verification | Job / Query / Consumer does not repair subject。 |
| `EX-L2T-001~056` | Each scenario's typed error / state result / owner / negative contract；retry / quarantine only where owner contract allows | No error-code flattening that erases owner / execution-occurrence distinction。 |

03 can define retry / quarantine / dead-letter / recovery cuts only after naming the owning boundary. It must not assign Runtime retry、Sandbox cleanup、Bus delivery retry / DLQ / replay or Observability recovery to L2-tools.

## 11. 配置实现契约承接清单

| 已由概要设计收稳 | 详细设计继续展开 | 必须保持 |
|---|---|---|
| Config only affects composition / adapters / stores / jobs / projections | `RuntimeConfig` ownership、`ConfigLoader` / `ConfigValidator` / `ConfigError`、runtime builder graph | Domain does not read config;config is not a truth source。 |
| Adapter configuration directions | `AdapterConfig` variants for Core / Hub / caller / auth / Sandbox / source / event seams | Configured endpoint != valid authority / mapping / route / readiness。 |
| Persistence / projection configuration directions | `StoreConfig` / `ProjectionConfig` capability validation、unit-of-work / freshness surfaces | No product / table / DSN selection in 03;no atomicity downgrade / fallback truth。 |
| Consumer / publisher configuration directions | `ConsumerConfig` / `PublisherConfig` / `HandoffConfig` source / target / version / dedup / timeout / local failure contracts | Consumer no core write;route blocked preserved;four gates cannot be disabled。 |
| Job configuration directions | `JobConfig` scope / cursor / watermark / batch / retry / parallelism categories and runner injection | No subject repair / fake run / fake external truth。 |
| 25 `NC-L2T-*` redlines | Cross-config validation / negative config contract | Validator may tighten but never relax owner / invariant / state / safety boundary。 |

Specific keys、values、defaults、formats、paths、env vars、secret names、endpoints、schedules and numeric limits remain inputs to `04-配置设计.md`, not 03 conclusions.

## 12. Blocked boundary handoff

| Blocker | 03 可继续设计 | 03 必须保持 blocked | 解除条件 |
|---|---|---|---|
| `L2T-UP-001` authorization owner | Invocation-bound consumption port、assessment、fail-closed error / config surfaces | Authority / provider / positive allow path | Formal owner and source contract published。 |
| `L2T-UP-002` source matrix / taxonomy | Requirement / result matching placeholders、conservative variants | High-risk taxonomy、allow / deny / constraint schema / freshness semantics | Owner-published matrix / contract。 |
| `L2T-UP-003` Sandbox mapping | L2 adapter responsibility、mapping port / error / blocked state / negative tests | Concrete invocation-to-command and source-to-outcome mapping、positive normalization readiness | Formal cross-boundary mapping agreed。 |
| `L2T-UP-004` receipt / handoff | Local attempt / failure / unknown refs、blocked route contracts | Receipt、retry / DLQ / feedback / cleanup positive behavior | Owner handoff / receipt contract published。 |
| `L2T-UP-005` Observability producer / source | Body-free material eligibility、route-blocked / unknown ref / config surface | Producer enum、source family、route、observed result | Formal producer / source / route contract。 |
| `L2T-UP-006` Observability readiness conflict | Workspace-source attribution and conservative integration gate | Implementation-ready / positive test / acceptance claim | Upstream formal chain status reconciled with evidence later。 |
| `L2T-UP-007` uncommitted baseline | File / section attribution to current workspace | Frozen commit / immutable baseline assertion | User-approved frozen baseline / commit later。 |
| `L2T-UP-008` Core shared contract | Authority port / ref、candidate / missing / conflict errors | Tools package / type / schema / version authority | Core formal Tools-specific contract published。 |
| `L2T-UP-009` SDK client | Server-side contract / guidance / future consumer seam | SDK client / wrapper / compatibility / coverage | SDK formal Tools client design / contract later。 |

These blockers do not prevent 03 from designing local logical contracts and conservative negative paths. They do prevent 03 from claiming end-to-end positive executability, published cross-repo schema, real adapter/provider, route readiness, test success, acceptance evidence, or implementation readiness.

## 13. 03 必须形成的设计输出方向

| 输出方向 | 03 最小设计结果 | 对后续文档的输入 |
|---|---|---|
| Code / module organization | Six component modules + shared boundary modules + ports / persistence / projections / composition root, with dependency direction | 07 boundary skeleton planning later，but no code now |
| Domain object contracts | 41 object exact fields / types / invariants / factories / functions / errors / states | 05 object / invariant / state tests;06 structural acceptance |
| API / protocol contracts | Command / Query / Consumer / Event / Job / Port exact contracts and version / compatibility surfaces | 04 transport / endpoint config;05 contract tests;06 interface acceptance |
| Application / transaction design | 12 flow families + common paths with unit-of-work / idempotency / ordering / formal re-entry | 05 flow / concurrency / failure tests;06 semantic acceptance |
| Persistence / projection design | Repository / stored-result / history / audit / attempt / gap / projection / watermark contracts | 04 store config;05 persistence / rebuild tests |
| State / correction design | Exact states / guards / transitions / concurrency / late material / correction / superseding contracts | 05 transition / property tests;06 state acceptance |
| Error / degradation design | Owner-qualified taxonomy / response mapping / negative path / recovery ownership | 05 negative / fault injection tests;06 fail-closed / boundary acceptance |
| Security / audit design | Forbidden-body guard、four-gate safe material、outcome + audit atomicity、actor / trace | 05 security / redaction / audit tests;06 veto criteria |
| Configuration implementation design | Config owner / loader / validator / typed configs / builder / invalid / blocked / degraded surfaces | 04 exact config catalog and operation semantics |
| Traceability / blocker design | Objects / APIs / flows / states -> FR / BR / IB / NFR / blocker mapping | 05 / 06 traceability;07 boundary plan |

03 must provide design specifications, not implementation evidence. No actual commit、run_id、test result、evidence alias or acceptance signoff is expected or permitted in this handoff.

## 14. 不进入稳定承接清单的未闭口内容

| 内容 | 当前归属 | 原因 |
|---|---|---|
| Exact authorization owner / taxonomy / decision schema | Step 13 `待确认` + `L2T-UP-001~002` | Not a current formal input。 |
| Exact Sandbox invocation / capture / failure / result mapping and receipt | Step 13 `待确认` + `L2T-UP-003~004` | Logical L2 adapter boundary only。 |
| Observability producer / source / route / readiness | Step 13 `待确认` + `L2T-UP-005~006` | Positive integration not closed。 |
| Frozen upstream commit baseline | Step 13 `待确认` + `L2T-UP-007` | Current workspace input only。 |
| Core Tools package / type / schema | Step 13 `待确认` + `L2T-UP-008` | Candidate authority only。 |
| SDK Tools client / wrapper / compatibility | Step 13 `待确认` + `L2T-UP-009` | Future consumer only。 |
| Quantified SLO / P95 / QPS / capacity / measurement authority | Step 13 risk / later 05 / 06 | No approved measurement / evidence authority。 |
| Exact language / framework / DB / cache / broker / queue / search / scheduler / topology | 03 technology / implementation design only if standards and upstream permit;04 / 07 as applicable | Not fixed by current 02。 |
| Exact config key / value / default / format / env / secret / endpoint / schedule | 04 | Step 11 explicitly defers these。 |
| Test case suite / fixtures / evidence path / acceptance signoff | 05 / 06 | Not a detailed-design handoff fact or current result。 |
| Implementation task / commit boundary / sequence / ledger / skeleton | 07 | Not an overview / detailed design result。 |

## 15. 概要设计回退规则

如果详细设计发现上述主语需要变更，说明概要设计尚未真正收稳，应先回到概要设计修正，而不是在 `03-详细设计.md` 中暗改。

| 03 发现的问题 | 必须回退 | 说明 |
|---|---|---|
| 需要新增 / 删除 / 合并业务主体族或改变实现分层职责 | Step 4 | 这会改变代码主体和依赖方向。 |
| 需要新增 / 删除 / 合并组成部分，或迁移 capability / owner / 接缝 | Step 5 | 这是业务边界变化，不是实现细化。 |
| 需要新增 / 删除 / 合并 / 重命名关键对象，或改变对象类别 / identity / owner | Step 6 | 新状态 / history / failure 主语必须先在概要正式化。 |
| 需要新增接口、事件、Job、Port，改变 Command / Query / Consumer / Job 读写性质 | Step 7 | API / boundary skeleton 必须先收稳。 |
| 需要新增 flow family、改变关键顺序 / transaction-like boundary / formal re-entry | Step 8 | 这会改变 application coordination semantics。 |
| 需要新增状态族、改变状态含义、允许 / 禁止迁移、传播或 terminal immutability | Step 9 | 状态语义不能在 03 偷改。 |
| 需要改变 fail-closed、source acceptance、terminal conflict、post-truth degradation 或 recovery owner | Step 10 | 异常 owner / 主线分支属于概要。 |
| 需要改变配置影响、允许配置绕过 `NC-L2T-*` 或把 blocked seam 配置为 ready | Step 11 | 配置红线是概要门禁。 |
| 需要改变本仓定位、truth owner、数据归属、forbidden body、依赖裁剪或非目标 | Step 1~3，必要时正式 00 / 01 | 已超出概要内部细化范围。 |
| 需要把 authority / Sandbox / Observability / Core / SDK blocker 视为已闭口 | Step 13 + 对应上游 owner | 不能由 03 单方解除外部 blocker。 |

允许的 03 细化包括：language-level type / module / function naming、exact fields、value types、repository / port traits、transaction / concurrency mechanism、DTO / envelope schema、error variants、config contract types。只要这些细化不改变上表主语、owner、状态、流和红线，就不需要回退。

## 16. 全量承接覆盖审计

| 审计维度 | 预期 | 实际承接 | 结果 |
|---|---:|---:|---|
| 主要组成部分 | 6 | 6 | pass |
| Step 6 objects | 41 | 41:6 + 6 + 5 + 6 + 10 + 8 | pass |
| Commands | 13 | 13 | pass |
| Queries | 11 | 11 | pass |
| Inbound Consumers | 5 | 5 | pass |
| Outbound Event skeletons | 4 | 4 | pass |
| Operations Jobs | 4 | 4 | pass |
| Named external ports | 7 | 7 | pass |
| Internal store port groups | 7 | 6 truth / attempt stores + ProjectionStore | pass |
| Common paths | 5 | Command / Query / Consumer / Job / safe outbound | pass |
| Key flow families | 12 | Contract establish / evolution、Binding mutation / clue、invocation、precondition、handoff、source-outcome-audit、safe handoff、feedback、integrity-gap、derived | pass |
| State themes from Step 8 §13 | 12 | 12 groups covered in §9 | pass |
| Step 10 scenarios | 56 | Six disposition / owner groups plus `EX-L2T-001~056` exact handoff | pass |
| Non-configurable boundaries | 25 | `NC-L2T-001~025` handed to ConfigValidator / negative contracts | pass |
| Open blockers | 9 | `L2T-UP-001~009` each has design allowance / blocked claim / exit condition | pass |

### 16.1 Cross-layer integrity audit

| Audit | Result | Explanation |
|---|---|---|
| No new subject | pass | 本 Step 只点名已有对象 / API / flow / config implementation direction；RuntimeConfig 等来自 Step 11 的 03 handoff。 |
| Owner preservation | pass | Hub / authorization / Sandbox / Bus / Observability / Core / SDK truth 均未迁入 L2。 |
| Write-path preservation | pass | Commands own core writes;Queries / Consumers / Jobs retain no-write boundaries。 |
| Transaction honesty | pass | Only L2 internal atomic invariants handed off;no cross-owner transaction。 |
| Positive-path honesty | pass | Blocked external seams remain blocked;03 may design negative / logical contracts only。 |
| Test / evidence honesty | pass | Only future test input directions;no actual test result / run / evidence / signoff。 |
| Document boundary | pass | No implementation task / schedule / commit ledger / code skeleton。 |

## 17. Historical pollution 审计

| Old 02 / 03 subject | Conflict with current handoff | Result |
|---|---|---|
| `ToolRegistry` / builtin / MCP / provider inventory | Replaces stable contract + Hub-controlled ref boundary | Not handed to 03。 |
| `ToolPolicy` / `ToolScope` / local governed allowlist | Makes L2 authorization owner | Not handed;formal result assessment + fail-closed only。 |
| Monolithic `InvokeTool` / host executor / member-service callback | Merges caller、carrier、Sandbox、source、outcome owners | Not handed;canonical invocation / handoff / source / outcome flows separate。 |
| Raw stdout / callback normalization | Copies forbidden body and guesses outcome | Not handed;source ref / safe summary + formal mapping gate。 |
| Retryable / non-retryable / replay / recovery manager | Owns Runtime / Sandbox / Bus recovery | Not handed;owner-qualified errors / attempts only。 |
| ToolHealth / availability / metrics / trace store | Merges diagnostic / external observation with truth | Not handed;derived diagnostic + external refs only。 |
| Fixed Rust / Python、RPC / HTTP、DB / tables、broker / topic | Historical implementation preselection | Not handed;03 must derive current implementation design under current standards。 |
| Replay audit / Observability retention | Takes Bus / Observability truth | Not handed;ToolAuditEntry + body-free event material / refs only。 |
| SLA / P95 / QPS / capacity values | Lacks current measurement authority / evidence | Not handed as stable fact。 |

## 18. Step 13 风险 / 待确认入口

Step 13 must classify, without converting them into stable handoff facts:

- Cross-owner contract blockers `L2T-UP-001~006 / 008~009` and workspace baseline `L2T-UP-007`。
- Risk that 03 compresses 41 objects / state owners into generic records / status or rebuilds historical registry / policy / executor models。
- Risk that logical ports / event skeleton / config direction are read as implementation-ready contracts。
- Risk that mapping / source acceptance / terminal correction / outcome+audit atomicity remain underspecified before coding。
- Risk that exact technology / persistence / transport choices accidentally redefine domain truth or dependency direction。
- Pending measurement / SLO / capacity / evidence authority for later 05 / 06。
- Pending exact correction fact、retry / recovery ownership and cross-repo compatibility / versioning contracts where upstream is not closed。

## 19. 正式 §12 回填草稿与完成门禁

### 19.1 正式回填草稿

正式第 12 章应压缩吸收本 Step 为“已由概要设计收稳 / 详细设计继续展开”双列表，覆盖：

1. 六组成部分与实现分层。
2. 41 对象六组。
3. Command / Query / Consumer / Event / Job / Port 骨架。
4. 12 flow families 与 common paths。
5. 状态 / late-material / correction 方向。
6. 异常 / error / recovery-owner 方向。
7. 配置实现契约与 04 后移。
8. Blocked boundaries 与回退规则。

正式章不复制所有对象 / API 明细，不画图，不写任务、排期、测试用例全集或代码指令；全量精确索引保留在本中间产物。

### 19.2 完成门禁

| 门禁 | 结果 | 说明 |
|---|---|---|
| 稳定输入完整 | pass | Step 4~11 所有主要主语均进入承接。 |
| 41 对象全量承接 | pass | 六组 6 / 6 / 5 / 6 / 10 / 8，无遗漏 / 新增。 |
| 接口 / port 全量承接 | pass | 13 / 11 / 5 / 4 / 4 + ports 完整。 |
| Flow / state / exception / config 完整 | pass | 12 flow families、state themes、56 exceptions、25 config redlines 均有 03 direction。 |
| Blocker 分层 | pass | 9 blockers 有 local design allowance、blocked claim and exit condition。 |
| 回退规则完整 | pass | Step 4~11 和更上游回退条件明确。 |
| No new design subject | pass | 未新增对象 / API / flow / state；config type names only inherited 03 direction。 |
| No implementation plan | pass | 未写 task / owner assignment / schedule / commit boundary / skeleton。 |
| Historical pollution | pass | Registry / policy / executor / raw callback / health / replay / tech stack not handed。 |
| Evidence honesty | pass | No implementation commit、run_id、test result、evidence alias or acceptance signoff。 |
| Step 13 ready | pass | Risks / open questions entry explicitly established。 |

```text
step_status = completed
gate_status = pass
next_allowed_action = create_step_13_risks_open_questions
formal_document_write_allowed = false
commit_required = false
```
