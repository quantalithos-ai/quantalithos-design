# Step 6 回归 6R-01: canonical registry 与 shared type 契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
> 创建日期: 2026-07-18
> 状态: `review_confirmed_shared_truth_consumed_by_7r_m0`
> 所属流程: `03_ddd_calibration_flow.md`
> 上游控制: `03_ddd_step_06_object_contracts_regression_control.md`
> 当前边界: 本文件只拥有canonical type registry、core复用、shared carrier、named typed ref、status / kind / error owner；`6R-06`已确认并由`6R-07`消费，69-row registry现作为Step 6唯一索引。模块私有技术enum只在本表登记名称，exact正文仍由owning module拥有；正式`03-详细设计.md`本对象轮次未修改。

---

## 1. Step 状态与开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否确认 `6R-M0` | 是。用户已确认 M0 控制面,允许进入 `6R-01`。 |
| 项目恢复点 | 当前为`03-详细设计.md` Step 6 regression / `6R-06 full closure audit completed_wait_user_review`；本文是已确认并被各对象分件及closure audit消费的shared truth，物理末尾§23为唯一current recovery source。 |
| 是否允许进入 `6R-02` | 本批门禁已由用户确认，`6R-02~04`已完成并获用户确认；当前已由`6R-05` application batch消费，不得重复展开。 |
| 是否允许修改原 Step 7~10 | 否。它们只作为冲突和消费者扫描输入。 |
| 是否允许修改正式 `03~07` | 否。正式 `03` 只能在回归后的 Step 19 重装配,正式 `04~07` 后续定向重验。 |
| implementation 状态 | `CB-SBX-01A blocked / wait_design`;实现未开始。 |
| 新的 L1 / L2 上游 blocker | 未发现。当前缺口属于 L4-sandbox 详细设计内部闭环。 |

### 1.1 Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目台账、`03` flow、M0、Step 6 SOP / 书写规范 / 可落码性标准。 | done | 确认只进入 `6R-01`。 |
| 2 | 读取正式 `00~02`、HLD 对象 / 状态 / 接口分件和 Step 5 模块 owner。 | done | 固定五条能力、六组并行状态和七模块边界。 |
| 3 | 核验当前 `/home/aris/Projects/quantalithos-core/crates/contracts` exact export。 | done | 区分可复用 core type 与 sandbox-owned type。 |
| 4 | 扫描原 Step 6 及 Step 7~10 的 type / ref / status / error 名称。 | done | 形成保留、改名、后移、失效候选池。 |
| 5 | 建立 master registry 和唯一 canonical section。 | done | current type 不得存在并列定义。 |
| 6 | 编写 shared carrier、named ref、status / kind / error exact Rust contract。 | done | 所有 public type / variant / function 使用中文 Rustdoc。 |
| 7 | 执行 registry、错型转换、状态别名、消费者引用和 unresolved 差集审计。 | done | `unresolved = 0`。 |
| 8 | 更新 M0、原 Step 6、`03` flow 和项目台账。 | done | 已停在 `6R-01` 用户审查点。 |

---

## 2. 本步输入与效力

| 输入 | 当前效力 | 本步用途 |
|---|---|---|
| 正式 `00-需求文档.md` | current reviewed baseline | 固定 execution isolation truth、五条能力和职责红线。 |
| 正式 `01-架构设计.md` | current reviewed baseline | 固定 truth / reference / projection / handoff ownership 和依赖裁剪。 |
| 正式 `02-概要设计.md` | current direct upstream | 固定关键对象主语、六组并行状态、55 个逻辑协议名称和 guard inventory。 |
| `02_hld_step_06_key_objects*.md` | current explanatory input | 提供逐对象字段骨架、guard / view / report 和 named ref 候选。 |
| `02_hld_step_07_api_interface_skeleton.md` | current explanatory input | 提供 Command / Query / Consumer / Event / Job 的 closed logical names。 |
| `02_hld_step_09_state_machine.md` | current explanatory input | 提供逐状态主语的正式 variant 语义;若与正式 `02` 冲突,以正式 `02` 为准。 |
| `03_ddd_step_05_module_contracts.md` | historical reviewed unaffected input | 固定 `contracts/domain/application/infra/api/worker/jobs` owner 和依赖方向。 |
| 原 `03_ddd_step_06_object_contracts.md` §1~§27 | historical reviewed material | 只作为候选池和缺口诊断;不得直接继承为 canonical schema。 |
| 原 Step 7~10 | historical reviewed revalidation pending | 只扫描消费者名称、签名冲突和别名漂移;出现过的名称不自动成为 current type。 |
| 当前 `core-contracts` 实现 | dependency availability evidence | 只确认可检索 export;不反向修改 core,不把实现结果伪装为 Sandbox 实现。 |

---

## 3. SOP 问题回答

| SOP 问题 | `6R-01` 回答 |
|---|---|
| 是否先收敛 shared vocabulary / typed ref / public marker | 是。本文件是所有后续对象分件的唯一 shared registry。 |
| 哪些类型复用 `core-contracts` | actor / request / trace / timestamp / idempotency / operation / request fingerprint / generic external resource ref / optimistic version。见 §7。 |
| 哪些引用由 Sandbox 自己拥有 | Sandbox truth、decision、guard、projection、report、trace、relay 的 repository-readable object ref;必须逐 named wrapper。 |
| generic ref 是否可直接读 repository | 不可。`SandboxObjectRef` 只用于穷尽 union / affected ref / trace subject;repository 和 port 必须接收 named ref。 |
| external source ref 是否属于 Sandbox object ref | 不属于。它是 body-free 外部锚点,不得转成 Sandbox repository key。 |
| captured material / downstream receipt ref 是否属于 Sandbox object ref | 只有 Sandbox 自有 fact / material record identity 属于;下游 material location、receipt、target 继续使用独立 lifecycle ref,不得反向解析成本仓对象。 |
| 状态 owner 如何唯一化 | 每个 persisted / derived / entry / public surface 状态都有唯一 enum owner;旧简称和同义 enum 进入失效表,不提供兼容 alias。 |
| 错误 owner 如何唯一化 | 本批完整定义 `ContractError` 和 `SandboxPublicErrorKind`;对象非法迁移错误由 `6R-02~05` 的对象 canonical section 拥有,不得继续用泛化占位。 |
| 哪些内容明确后移 | object field / factory / guard exact contract 后移到 `6R-02~05`;trait / port 后移 Step 7;DTO schema 后移 Step 8;transition matrix 后移 Step 10。 |

---

## 4. 当前材料问题诊断

| 诊断 ID | 问题 | 当前修正 |
|---|---|---|
| `6R01-DIAG-001` | `SandboxOpaqueId`、`SandboxOpaqueRef`、`SandboxTypedRef` 三层壳无法阻止错型 repository read。 | 删除 public generic id/ref 用法;建立 tagged `SandboxObjectRef` 和逐 named wrapper。 |
| `6R01-DIAG-002` | 原 §10、§24、§25 同时定义同一类型,摘要还声明冲突时以前文为准。 | master registry 为每个类型指定唯一 canonical section;其他文件只能引用。 |
| `6R01-DIAG-003` | `SandboxInstant`、`SandboxOperationName`、actor / trace / idempotency 等重复 core 已有类型。 | 对 current `core-contracts` exact export 做显式复用,不创建同义 wrapper。 |
| `6R01-DIAG-004` | `ReferenceResolutionStatus` 同时承载 intake resolution、context reference resolution 和长期 tracked state,variant 集合不一致。 | 拆为三个 owner enum,不再共享一套 superset。 |
| `6R01-DIAG-005` | boundary、capture、relay、report 状态存在长名 /短名 /对象名不一致。 | 以状态主语为 owner 固定 canonical enum,旧名全部登记失效。 |
| `6R01-DIAG-006` | `ConsumerReceiptStatus` / `SandboxConsumerReceiptStatus`、`JobReportStatus` / `SandboxJobReportStatus` 并存,后者还多 `NoOp` / `DuplicateReplayed`。 | public / stored replay surface 统一使用带 `Sandbox` 前缀的完整 enum;entry 不再维护第二套同义 enum。 |
| `6R01-DIAG-007` | `SandboxPublicErrorKind` 原 Step 6 粗粒度与 Step 8 / 12 细粒度冲突。 | 以已审查错误映射所需的 16 个 caller-safe variant 重建唯一 public kind。 |
| `6R01-DIAG-008` | HLD 中 guard / view / report refs 大量未进入原 typed-ref family。 | registry 覆盖所有 current HLD object ref;没有 repository identity 的 helper set 不冒充 object ref。 |
| `6R01-DIAG-009` | 原公开 Rustdoc 大量为英文。 | 本文件全部 public type / field / variant / function 使用中文 Rustdoc。 |

---

## 5. 改动前后对比

| 维度 | DesignReopen 前 | `6R-01` 目标 |
|---|---|---|
| core type | Sandbox 重复定义 actor 周边、time、operation、digest 壳 | 可检索 core type 直接复用;仅保留 Sandbox 独有语义 |
| local object ref | 共同 `SandboxTypedRef { id }` | tagged union + named wrapper + wrong-kind rejection |
| external ref | `SandboxOpaqueRef` 混合 source / receipt / target / cursor | external source、local object、downstream lifecycle 三类分离 |
| status | 同一主语多名,多个主语共用一 enum | 一个状态主语一个 owner;public surface 与 persisted state 分层 |
| error | 粗 public kind + generic internal error | caller-safe public kind唯一;对象错误在 owner section exact 定义 |
| registry | 名称表与对象正文并列 | 每个 current type 唯一 canonical file / section / module |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 / 边界 |
|---|---|---|
| 继续使用 `SandboxOpaqueRef` | 不采用 | 无法区分本仓 truth、外部 source、receipt、cursor 和 trace subject。 |
| 每个 named ref 都直接包 `ResourceRef` | 不采用 | 从 generic ref 恢复 named ref 时无法机械拒绝 wrong kind。 |
| tagged `SandboxObjectRef` + named wrapper | 采用 | generic union 可穷尽,repository 仍只接收 named wrapper,错型转换有 exact error。 |
| 所有 HLD `*RefSet` 都建 public type | 不采用 | 只有存在独立 ordered-unique / homogeneity 不变量的 set 才建类型;纯表格简称回到 owning object 字段。 |
| 一个 `ReferenceResolutionStatus` 覆盖三类对象 | 不采用 | 三类对象的 variant 与 transition 不同,共享 superset 会允许非法状态。 |
| 为旧状态名提供 type alias | 不采用 | alias 会继续保留双真相;下游回归必须显式改到 canonical 名。 |
| 在本批完整定义所有 `DomainError` | 不采用 | 非法迁移必须由对象 method 与 guard 同批闭口;提前总定义会再次猜 transition。 |
| 从 Step 8 反推新协议名称 | 不采用 | closed logical names 只来自正式 `02` / HLD Step 7;字段 schema 仍由回归后的 Step 8 定义。 |

---

## 7. 真相源与 core 复用规则

### 7.1 可检索 core type

| exact type | exact export | Sandbox 使用面 | 禁止替代 |
|---|---|---|---|
| `ActorRef`;`ActorContext`;`ActorKind`;`RequestOrigin` | `core_contracts::actor` | responsibility、command/query/job actor、audit actor | 不定义 actor lifecycle / member truth;不复制 `SandboxActorRef`。 |
| `RequestId`;`RequestMetadata` | `core_contracts::metadata` | request identity、trace / time / optional idempotency metadata | 不用 route、event id 或 job run id 伪造 request id。 |
| `TraceId` | `core_contracts::metadata` | `SandboxTraceContext`、audit / error / event correlation | 不用 object ref、timestamp 或 digest 替代。 |
| `Timestamp` | `core_contracts::metadata` | domain logical time、adapter observed time、job start / finish | 删除 `SandboxInstant`;不把 page cursor 当时间。 |
| `IdempotencyKey` | `core_contracts::metadata` | Command / Consumer / Job reserve key | 不用 `ResourceRef`、trace id 或 retry count替代。 |
| `OperationName` | `core_contracts::metadata` | application operation identity | 删除 `SandboxOperationName`;不从 raw route / topic 临时解析。 |
| `RequestPayloadFingerprint` | `core_contracts::metadata` | request / payload canonical fingerprint | request digest 不再使用泛化 `SandboxDigest`。 |
| `ResourceRef` | `core_contracts::metadata` | generic external body-free pointer、tagged object ref 内部 key | 不能直接作为 Sandbox repository typed key。 |
| `JobRunId` | `core_contracts::metadata` | operations job invocation identity | 不等于 job report ref、idempotency key或 truth ref。 |
| `PageToken`;`PageRequest` | `core_contracts::metadata` | public page input / output映射候选 | 不等于 optimistic version、truth cursor或source marker。 |
| `Version` | `core_contracts::metadata` | optimistic repository version | 不用 timestamp、cursor、id generator 或 trace id替代。 |

当前核验只证明 2026-07-18 工作区中的 export 可检索。正式 implementation baseline 尚未固定;未来 core revision 变化仍须由 Activation Gate 重新核验,本表不构成 dependency commit 证明。

### 7.2 三类引用角色

| 引用角色 | canonical carrier | 可否作为 Sandbox repository key | 可否携带外部正文 | 转换方向 |
|---|---|---|---|---|
| Sandbox-owned object identity | named `*Ref` wrapping `SandboxObjectRef` | 只能使用 named wrapper | 否 | named -> generic允许;generic -> named必须校验 kind |
| external body-free source | `ExternalSourceRef` / `SafeSummaryRef` | 否 | 否 | 只能由 entry / resolver 显式构造,不得转 local object ref |
| downstream material / receipt / target | owning object中的 typed lifecycle ref | 否,除非其本身是本仓 fact identity | 否 | 只允许 handoff / adapter 显式返回;禁止反向解析成本仓 truth |

### 7.3 contracts 文件 owner

| 文件 | canonical 内容 | 禁止内容 |
|---|---|---|
| `crates/contracts/src/refs.rs` | shared carrier、finite kind / selector、canonical status、`SandboxObjectRefKind`、generic object ref、named wrapper、external / summary ref、shared marker | domain object、repository、external body |
| `crates/contracts/src/metadata.rs` | `SandboxTraceContext` 和对 core metadata 的组合 carrier | 重定义 core actor / request / time / idempotency type |
| `crates/contracts/src/errors.rs` | `ContractError`;`SandboxPublicErrorKind` | domain transition detail、raw adapter error |

Step 4 planned tree中的其余contracts文件按DTO职责分工：`commands.rs`、`queries.rs`、`events.rs`、`jobs.rs`、`views.rs`与`receipts.rs`只声明对应协议对象，并从`refs.rs`复用shared kind / selector / status / marker；不得复制同名enum、建立re-export alias或增加第二套wire-only status。`lib.rs`只做显式导出，`fixtures.rs`只构造已定义契约。该归并方式与`L1-governance`的“refs / reason / shared enum / marker”粒度及`L1-artifact`的marker归属一致。

---

## 8. Canonical type registry

### 8.1 Registry 状态定义

| 状态 | 含义 |
|---|---|
| `canonical_here` | 本文件给出唯一完整定义。 |
| `canonical_6R-02~05` | 本文件固定名称 / owner,完整对象契约在指定后续分件唯一展开。 |
| `core_reuse` | 不在 Sandbox 重定义,使用 §7.1 exact export。 |
| `protocol_step8` | 只有 HLD logical name已固定;DTO schema由回归后的 Step 8唯一定义。 |
| `application_local_step7` | 不穿 public protocol,由 Step 7 callable / helper contract定义。 |
| `historical_invalid` | 旧名称或壳已失效,不得实现或创建 alias。 |

### 8.2 Shared / core registry

| Registry ID | canonical type | kind | owner / canonical section | 状态 | 主要消费者 |
|---|---|---|---|---|---|
| `S6T-CORE-001` | `ActorRef`;`ActorContext`;`ActorKind`;`RequestOrigin` | core actor | `core_contracts::actor`;§7.1 | core_reuse | command / query / job / responsibility / audit |
| `S6T-CORE-002` | `RequestId`;`RequestMetadata`;`TraceId`;`Timestamp` | core metadata | `core_contracts::metadata`;§7.1 | core_reuse | entry / application / domain / event / report |
| `S6T-CORE-003` | `IdempotencyKey`;`OperationName`;`RequestPayloadFingerprint` | core idempotency | `core_contracts::metadata`;§7.1 | core_reuse | command / consumer / job / stored replay |
| `S6T-CORE-004` | `ResourceRef`;`JobRunId`;`PageToken`;`PageRequest`;`Version` | core shared | `core_contracts::metadata`;§7.1 | core_reuse | refs / jobs / paging / repositories |
| `S6T-SH-001` | `SandboxReason` | safe reason | `contracts::refs`;§9.1 | canonical_here | 全模块 |
| `S6T-SH-002` | `SandboxSourceDigest`;`SandboxMaterialDigest` | semantic digest | `contracts::refs`;§9.1 | canonical_here | resolver / capture / handoff |
| `S6T-SH-003` | `SandboxTruthCursor`;`SandboxReferenceCursor` | committed cursor | `contracts::refs`;§9.1 | canonical_here | relay / projection / consumer / job |
| `S6T-SH-004` | `SandboxTraceContext` | trace composition | `contracts::metadata`;§9.2 | canonical_here | entry / domain / adapter / audit |
| `S6T-SH-005` | `ExternalSourceKind`;`ExternalSourceRef`;`ExternalSourceRefSet` | external body-free source | `contracts::refs`;§9.3 | canonical_here | intake / policy / reference / consumer |
| `S6T-SH-006` | `SafeSummaryRef`;`SafeSummaryRefSet` | safe-summary pointer | `contracts::refs`;§9.4 | canonical_here | resolver / policy / view / handoff |
| `S6T-SH-007` | `ExternalBodyMarker`;`ForbiddenExternalBodyMarkerSet` | forbidden-body marker | `contracts::refs`;§9.5 | canonical_here | intake / consumer / capture / errors |
| `S6T-SH-008` | `SandboxObjectRefKind`;`SandboxObjectRef` | tagged local union | `contracts::refs`;§10.1 | canonical_here | affected refs / trace subject / relay source |
| `S6T-SH-009` | all named Sandbox object refs | typed local ref | `contracts::refs`;§10.2~§10.6 | canonical_here | repository / port / DTO / records |
| `S6T-SH-010` | `SandboxSourceFactRef`;`SandboxTraceSubjectRef` | closed subject union | `contracts::refs`;§10.7 | canonical_here | relay / audit / outbox |

### 8.3 `6R-02` context / boundary registry

| Registry ID | canonical type | category | module | canonical location | current contract state |
|---|---|---|---|---|---|
| `S6T-02-001` | `ControlledExecutionContext` | truth entity | domain | `6R-02` context / identity | review_confirmed_consumed_by_6r06 |
| `S6T-02-002` | `ExecutionEnvironmentIdentity` | truth entity | domain | `6R-02` context / identity | review_confirmed_consumed_by_6r06 |
| `S6T-02-003` | `ExecutionContextResolution` | resolution value | domain | `6R-02` context / identity | review_confirmed_consumed_by_6r06 |
| `S6T-02-004` | `ContextReferenceResolution` | resolution value | domain | `6R-02` context / identity | review_confirmed_consumed_by_6r06 |
| `S6T-02-005` | `ExecutionResponsibilityContext`;`ExecutionResponsibilityAnchor` | body-free support | contracts / domain | `6R-02` context / identity | review_confirmed_consumed_by_6r06 |
| `S6T-02-006` | `ControlledExecutionIntakeGuard` | guard | domain | `6R-02` guard | review_confirmed_consumed_by_6r06 |
| `S6T-02-007` | `ExternalBodyExclusionGuard` | guard | domain | `6R-02` guard | review_confirmed_consumed_by_6r06 |
| `S6T-02-008` | `BoundaryRequirementSet` | boundary value | domain | `6R-02` boundary | review_confirmed_consumed_by_6r06 |
| `S6T-02-009` | `ResourceLimitSet`;`ResourceLimitRequirement` | boundary support | domain | `6R-02` boundary | review_confirmed_consumed_by_6r06 |
| `S6T-02-010` | `FilesystemBoundaryRequirement`;`NetworkBoundaryRequirement`;`ProcessBoundaryRequirement`;`WorkspaceBoundaryRequirement` | boundary support | domain | `6R-02` boundary | review_confirmed_consumed_by_6r06 |
| `S6T-02-011` | `CoherentBoundary` | truth entity | domain | `6R-02` boundary | review_confirmed_consumed_by_6r06 |
| `S6T-02-012` | `BoundaryEstablishmentDecision` | decision | domain | `6R-02` boundary | review_confirmed_consumed_by_6r06 |
| `S6T-02-013` | `BackendCapabilitySummary` | external summary snapshot | domain | `6R-02` boundary | review_confirmed_consumed_by_6r06 |
| `S6T-02-014` | `IsolationEnvironmentHandle` | lifecycle entity | domain | `6R-02` boundary | review_confirmed_consumed_by_6r06 |
| `S6T-02-015` | `LeaseWindow` | lifecycle support | domain | `6R-02` boundary | review_confirmed_consumed_by_6r06 |
| `S6T-02-016` | `BoundaryCoherenceGuard`;`BackendCapabilityGuard` | guard | domain | `6R-02` guard | review_confirmed_consumed_by_6r06 |
| `S6T-02-017` | `SandboxExecutionStatusView`;`BoundaryStatusView` | public read view | contracts | `6R-02` view | review_confirmed_consumed_by_6r06 |

### 8.4 `6R-03` policy / run / capture registry

| Registry ID | canonical type | category | module | canonical location | current contract state |
|---|---|---|---|---|---|
| `S6T-03-001` | `PolicyApplicabilitySnapshot` | external summary snapshot | domain | `6R-03` policy | review_confirmed_consumed_by_6r06 |
| `S6T-03-002` | `PolicyExecutionDecision` | decision | domain | `6R-03` policy | review_confirmed_consumed_by_6r06 |
| `S6T-03-003` | `HighRiskActionMarker`;`HighRiskActionDecision` | marker / decision | domain | `6R-03` policy | review_confirmed_consumed_by_6r06 |
| `S6T-03-004` | `PolicyApplicabilityGuard`;`FailClosedPolicyGuard` | guard | domain | `6R-03` guard | review_confirmed_consumed_by_6r06 |
| `S6T-03-005` | `PolicyDecisionSummaryView` | public read view | contracts | `6R-03` view | review_confirmed_consumed_by_6r06 |
| `S6T-03-006` | `ControlledExecutionRun` | truth entity | domain | `6R-03` run | canonical_contract_closed_batch_3_review_confirmed |
| `S6T-03-007` | `CaptureFact` | fact | domain | `6R-03` capture | canonical_contract_closed_batch_4_review_confirmed |
| `S6T-03-008` | `CapturedMaterialRef`;`CapturedMaterialRefSet` | body-free material lifecycle ref | domain / contracts | `6R-03` capture | canonical_contract_closed_batch_4_review_confirmed |
| `S6T-03-009` | `ObservabilityMaterial` | body-free handoff material | domain | `6R-03` capture | canonical_contract_closed_batch_5_review_confirmed |
| `S6T-03-010` | `HandoffFact` | handoff fact | domain | `6R-03` handoff | canonical_contract_closed_batch_5_review_confirmed |
| `S6T-03-011` | `CaptureCompletenessGuard`;`HandoffOwnershipGuard` | guard | domain | `6R-03` guard | capture_guard_closed_batch_4_review_confirmed;handoff_guard_closed_batch_5_review_confirmed |
| `S6T-03-012` | `CaptureSummaryView`;`MaterialHandoffStatusView` | public read view | contracts | `6R-03` view | canonical_contract_closed_batch_6_review_confirmed |

`CapturedMaterialRef` 是 HLD 已固定的 reference object / value object,完整字段包含 capture linkage、material kind、body-free location / digest 和 lifecycle status。它不等同于 `SandboxObjectRef` 的 repository identity wrapper,不能通过 generic object ref 反向构造。

#### 8.4.1 `6R-03` contracts-owned support carrier overlay

`SBX-DDD-VIEW-OWNER-6R03-001` 在 batch 6 发现：`CaptureSummaryView` / `MaterialHandoffStatusView` 若直接引用只在 domain 分件中拥有定义权的二级类型，会迫使 `contracts -> domain` 反向依赖。该问题是 Step 6 内部 owner 缺口，不是 L1 / L2 上游 blocker。修复不新增第 13 个 `S6T-03-*` registry item；以下类型仍分别属于 `S6T-03-007~012` 的 support family，但唯一 Rust owner 固定为 `contracts`：

| support carrier family | canonical owner / planned path | shape / collection invariant | domain consumer | contracts view consumer |
|---|---|---|---|---|
| `CapturedMaterialKey`;`CapturedMaterialKeySet` | `crates/contracts/src/refs.rs` | non-empty opaque key；ordered-unique set，允许为空 | candidate、material、capture、ownership guard | capture material / output / gap coverage；handoff subject |
| `CaptureRequirementGapDisposition` | `crates/contracts/src/refs.rs` | `RecordPartial | RecordFailed` closed enum | requirement、gap、completeness decision | gap summary |
| `CaptureCollectionDisposition` | `crates/contracts/src/refs.rs` | 四种 adapter collection result；不是 persisted state | candidate、decision、capture fact、observability material | capture source / observability status |
| `ObservabilitySignalKind`;`ObservabilitySignalKindSet` | `crates/contracts/src/refs.rs` | closed kind；set 非空、ordered-unique | observability signal summary / material | capture observability status |
| `HandoffMaterialSelection` | `crates/contracts/src/refs.rs` | captured keys / observability ref 的 closed union；target owner校验非空与kind relation | target plan、ownership guard | target plan / progress item |
| `HandoffDeliveryAttemptRef` | `crates/contracts/src/refs.rs` | non-empty Sandbox-local opaque attempt identity | target progress / observation | target progress status item |
| `HandoffReceiptRef` | `crates/contracts/src/refs.rs` | exact target ref + matching-kind external receipt ref；二者identity不得碰撞 | target observation / progress | target progress status item |
| `HandoffMaterialDeliveryKind` | `crates/contracts/src/refs.rs` | `Pending | Delivered | Failed | Retryable` finite derived kind；不是状态机 | handoff/material lifecycle helper | material-specific delivery item |

固定依赖与错误边界如下：

```text
core-contracts
      ^
      |
contracts::{refs.rs, views.rs, errors.rs}
      ^
      |
domain::{capture, observability, handoff}
      ^
      |
application mapper / service
```

1. 上述类型只在`crates/contracts/src/refs.rs`声明一次；该文件按Step 4定义承接typed refs、ids、reason与shared carrier。本校准文件按policy/run/capture/handoff业务主线分件展示Rust schema，但不表示domain再声明同名类型。
2. carrier 自身的 non-empty、ordered-unique、receipt kind / identity shape 失败返回`crates/contracts/src/errors.rs`中的`ContractError`；candidate/material/domain object的lineage、status、coverage、transition与timestamp失败仍返回object-owned error。
3. `crates/contracts/src/views.rs`中的view与`crates/domain/src/capture.rs` / `handoff.rs`都从`refs.rs`复用这些canonical carrier；application mapper只从同一committed snapshot复制字段，不创建同义projection enum、ref或set。
4. 禁止通过 re-export alias、同名 domain wrapper、`String` / `ResourceRef` fallback 或从 ref 文本推断 kind 修复依赖。
5. `HandoffReceiptRef`必须保留exact `target_ref`，否则同kind receipt可被错误复用于另一个target，而domain无法机械校验observation relation。
6. Step 4 current planned tree没有独立kind / status / marker module。batch 7已将shared registry全部收敛到既有`refs.rs`，且明确`kinds.rs`、`status.rs`、`states.rs`、`markers.rs`只属于historical invalid path，不得创建、re-export或由实现者自行补入planned tree。

该 overlay 的关闭条件已满足：八组类型 owner、planned file path、constructor error、domain consumer和两个view字段一致，依赖审计中 `contracts -> domain` public field dependency为零，10个declaration missing / duplicate均为零。`SBX-DDD-VIEW-OWNER-6R03-001 = resolved_in_6r03_batch_6`；该结论只关闭本批内部owner缺口，不关闭Step 6总blocker。

### 8.5 `6R-04` failure / cleanup / read registry

| Registry ID | canonical type | category | module | canonical location | current contract state |
|---|---|---|---|---|---|
| `S6T-04-001` | `FailureClassification`;`ControlFact` | fact / control truth | domain | `6R-04` §12.1 / §12.3 | canonical_bodies_closed_batch_2_review_confirmed |
| `S6T-04-002` | `LeaseRecord`;`OrphanRecoveryRecord` | lifecycle truth | domain | `6R-04` §13.2~§13.3 | canonical_bodies_closed_batch_3_review_confirmed_extended_batch_4 |
| `S6T-04-003` | `CleanupGuard`;`RedlineContainment` | guard truth / safety truth | domain | `6R-04` §14.2 / §14.4 | canonical_bodies_closed_batch_4_review_confirmed_consumed |
| `S6T-04-004` | `ControlConflictGuard`;`CleanupSafetyGuard`;`RedlineContainmentGuard` | guard | domain | `6R-04` §12.2 / §14.1 / §14.3 | all_three_guards_closed_through_batch_4_review_confirmed_consumed |
| `S6T-04-005` | `FailureControlStatusView`;`CleanupReadinessView`;`RedlineContainmentView` | public read view | contracts | `6R-04` §16.5~§16.7 | all_three_branches_closed_review_confirmed_consumed |
| `S6T-04-006` | `ReferenceResolutionState` | tracked reference state | domain | `6R-04` §15.2 | canonical_body_closed_batch_5_review_confirmed_consumed |
| `S6T-04-007` | `DerivedInspectPreviewTrendState` | derived state | domain | `6R-04` §15.6 | canonical_body_closed_batch_5_review_confirmed_consumed |
| `S6T-04-008` | `DerivedReadOnlyGuard` | guard | domain | `6R-04` §15.5 | canonical_body_closed_batch_5_review_confirmed_consumed |
| `S6T-04-009` | `SandboxReadProjection` | projection | domain | `6R-04` §15.8 | canonical_body_closed_batch_5_review_confirmed_consumed |
| `S6T-04-010` | `DerivedInspectPreviewTrendView`;`BackendCapabilityComparisonView` | public read view | contracts | `6R-04` §16.8~§16.9 | both_bodies_closed_review_confirmed_consumed |
| `S6T-04-011` | `SandboxReconciliationReport` | report | contracts | `6R-04` §16.10 | canonical_body_review_confirmed_consumed_by_6r05 |
| `S6T-04-012` | `SandboxAuditTrace` | append-only audit | domain | `6R-04` §16.3 | canonical_body_closed_review_confirmed_consumed |
| `S6T-04-013` | `SandboxEventRelayRecord`;`SandboxRelayAttemptRef` | append-only relay / cross-module attempt ref | domain behavior / contracts carrier | `6R-04` §16.4 / §8.5.1 | relay_body_closed_16_4_review_confirmed_consumed_by_16_5;attempt_ref_overlay_closed_consumed |
| `S6T-04-014` | `ReferenceRefreshMarker`;`DerivedRebuildMarker`;`ReaperEligibilityMarker` | shared maintenance marker carrier / domain relation | contracts carrier / domain behavior | `6R-04` §13.1 / §15.1 / §15.4 | all_three_markers_closed_through_batch_5_review_confirmed_consumed |
| `S6T-04-015` | `SandboxTruthRefSet`;`SandboxProjectionRefSet`;`SandboxStatusViewRefSet`;`DerivedSourceRefSet`;`RedlineContainmentRefSet` | closed typed set | contracts | `6R-04` §14.0 / §15.3 / §15.7 / §16.1~§16.2 | all_set_branches_closed_review_confirmed_consumed |

#### 8.5.1 `6R-04` contracts-owned relay attempt ref overlay

`SandboxRelayAttemptRef` 同时被 domain attempt、application publisher / inspect port、Step 8
feedback DTO 与 persistence carrier消费。若只在 `domain::event_relay` 声明，会迫使
`contracts -> domain` 反向依赖，或诱导 DTO 退化为裸 `ResourceRef`。因此它作为
`S6T-04-013` 的纯 support carrier，唯一 Rust declaration 固定在既有
`crates/contracts/src/refs.rs`；这不新增 `SandboxObjectRefKind` variant、named object ref、
repository truth、status或planned文件。

```rust
/// 标识一个 relay publisher attempt 的 Sandbox-local opaque identity。
#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(transparent)]
pub struct SandboxRelayAttemptRef(ResourceRef);

impl<'de> Deserialize<'de> for SandboxRelayAttemptRef {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let resource_ref = ResourceRef::deserialize(deserializer)?;
        Self::try_from_generated(resource_ref)
            .map_err(|_| serde::de::Error::custom("invalid sandbox relay attempt reference"))
    }
}

impl SandboxRelayAttemptRef {
    /// 从 application typed id generator 生成的非空 opaque ref 构造attempt identity。
    pub fn try_from_generated(
        attempt_ref: ResourceRef,
    ) -> Result<Self, ContractError> {
        ensure_non_empty_resource_ref("SandboxRelayAttemptRef", &attempt_ref)?;
        Ok(Self(attempt_ref))
    }

    /// 返回opaque resource ref；不得解析字符串结构或据此推导attempt ordinal。
    pub fn as_resource_ref(&self) -> &ResourceRef {
        &self.0
    }
}
```

该 ref 不实现 `From<ResourceRef>`、不转换为 `SandboxObjectRef`，也不与
`HandoffDeliveryAttemptRef`互转。attempt ordinal、record / payload / target relation、active
状态、observation和retry规则仍由`crates/domain/src/event_relay.rs`的§16.4对象契约唯一拥有；
contracts只保证non-empty typed identity和checked deserialize。

### 8.6 `6R-05` non-core registry

| Registry ID | canonical type | category | module | canonical location | current contract state |
|---|---|---|---|---|---|
| `S6T-05-001` | `SandboxServiceCallContext`;`SandboxOperationChannel` | application call context | application | `6R-05` §9.2 | canonical_contract_closed_6r05_batch_1 |
| `S6T-05-002` | `SandboxIdempotencyRecord`;`SandboxIdempotencyObservation`;`SandboxStoredOperationResult`;`SandboxStoredResultKind`;`SandboxStoredResultSurfaceRef` | idempotency / replay | application | `6R-05` §9.3~§9.4 | canonical_contract_closed_6r05_batch_1 |
| `S6T-05-003` | `SandboxApplicationError`;`ApplicationErrorKind`;`ApplicationErrorDetail`;`SandboxServiceOutcome`;`ServiceOutcomeStatus`;`SandboxQueryAccessDecision`;`SandboxQueryAccessStatus`;`SandboxSideEffectRef`;`SandboxSideEffectKind`;`SandboxSideEffectRefSet`;`SandboxReasonSet`;`IsolationEnvironmentEstablishmentResult`;`IsolationEnvironmentEstablishmentDisposition`;`SandboxMaintenanceTargetRef`;`SandboxMaintenanceResultRef`;`SandboxMaintenanceResultRefSet`;`SandboxMaintenanceItemStatus`;`SandboxMaintenanceItemOutcome`;`SandboxMaintenanceBatchOutcome` | application outcome / read decision / establishment port result / maintenance outcome | application | `6R-05` §9.5~§9.7、§9.10、§11.13 | canonical_contract_review_confirmed_consumed_by_6r06 |
| `S6T-05-004` | `SandboxRuntimeConfigSummary`;`SandboxRuntimeProfileRef`;`SandboxInfraConfigRef`;`SandboxAdapterBindingMarkerRef`;`SandboxAdapterKind`;`SandboxAdapterActivationKind`;`SandboxAdapterBindingSummary`;`SandboxAdapterBindingSummarySet`;`AdapterAvailabilityState`;`AdapterAvailabilityStateSet` | runtime technical state | infra | `6R-05` §10.2~§10.5 | canonical_contract_closed_6r05_batch_2 |
| `S6T-05-005` | `IsolationBackendEstablishmentCorrelation`;`IsolationBackendAdapterOutcome`;`IsolationBackendOutcomeStatus`;`MaterialHandoffAdapterOutcome`;`HandoffAdapterOutcomeStatus`;`EventPublisherAdapterOutcome`;`PublisherOutcomeStatus` | transient adapter outcome | infra | `6R-05` §10.6~§10.8 | canonical_contract_closed_6r05_batch_2 |
| `S6T-05-006` | `SandboxApiCommandEnvelope`;`SandboxApiQueryEnvelope`;`SandboxApiDisposition` | sync entry shell | api | `6R-05` §11.4~§11.7 | canonical_contract_review_confirmed_consumed_by_6r06 |
| `S6T-05-007` | `SandboxWorkerKind`;`SandboxConsumerReceipt`;`SandboxWorkerRunContext`;`SandboxFulfillmentLoopResult`;`SandboxRelayLoopResult` | async entry / loop result | worker | `6R-05` §11.8~§11.12 | canonical_contract_review_confirmed_consumed_by_6r06 |
| `S6T-05-008` | `SandboxJobRunContext`;`SandboxJobReportAccumulator`;`SandboxJobExitDisposition` | job entry / report helper | jobs | `6R-05` §11.15~§11.18 | canonical_contract_review_confirmed_consumed_by_6r06 |
| `S6T-05-009` | `ContractError`;`SandboxPublicErrorKind` | shared error | contracts | §13 | canonical_here |
| `S6T-05-010` | object-owned error enums | domain error | domain | `6R-02~04` per object | owner_fixed_per_object;no_generic_union |
| `S6T-05-011` | `ApplicationError`;`InfraError`;`InfraConfigIdentityKind`;`ApiError`;`WorkerError`;`JobsError` | module error / finite error role | owning module | `6R-05` §9.5/§10.9/§11.7/§11.12/§11.18 | application_41_infra_18_api_7_worker_12_jobs_17_review_confirmed_consumed_by_6r06 |

### 8.7 Protocol-owned registry

| family | current fixed input | schema owner | 当前状态 |
|---|---|---|---|
| Command | 10 个 HLD logical names | 回归后的 Step 8 | protocol_step8 |
| Query | 13 个 HLD logical names | 回归后的 Step 8 | protocol_step8 |
| Inbound Consumer | 9 个 HLD logical names | 回归后的 Step 8 | protocol_step8 |
| Outbound Event | 13 个 HLD logical names | 回归后的 Step 8 | protocol_step8 |
| Operations Job | 10 个 HLD logical names | 回归后的 Step 8 | protocol_step8 |
| public DTO / page / envelope / receipt / report | 名称候选只作 historical consumer input | 回归后的 Step 8 | not_current_until_step8_review |

### 8.8 Application-local / persistence helper registry

| type | owner | canonical step | 当前处理 |
|---|---|---|---|
| `SandboxTransactionRef`;`Versioned<T>`;`Page<T>` | application port | Step 7 regression | application_local_step7;不得进入 public DTO |
| `SandboxRepositoryCursor` | repository page helper | Step 7 / 11 revalidation | application_local_step7;不得替代 `PageToken` / change cursor / `Version` |
| `SandboxRepositoryVersion` | historical alias | core `Version` | historical_invalid;不得创建新 wrapper |
| `SandboxProjectionRebuildSnapshot`;`SandboxReconciliationSnapshotItem` | application / projection helper | Step 7 / `6R-04` | schema_owner_pending;不得由 fake 私补 |

---

## 9. Shared carrier exact contract

### 9.1 reason、digest 与 committed cursor

```rust
use serde::{Deserialize, Serialize};

/// 承载可向调用方、审计或报告暴露的非空安全原因,不得保存外部正文或原始适配器错误。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
#[serde(transparent)]
pub struct SandboxReason(String);

impl<'de> Deserialize<'de> for SandboxReason {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;
        Self::try_new(value).map_err(|_| serde::de::Error::custom("invalid sandbox reason"))
    }
}

impl SandboxReason {
    /// 从已脱敏文本构造安全原因;空白文本必须拒绝。
    pub fn try_new(value: String) -> Result<Self, ContractError>;

    /// 返回安全原因文本,不得用于解析状态或引用。
    pub fn as_str(&self) -> &str;
}

/// 标识外部来源摘要的规范化校验值,不拥有摘要正文。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
#[serde(transparent)]
pub struct SandboxSourceDigest(String);

impl<'de> Deserialize<'de> for SandboxSourceDigest {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;
        Self::try_from_encoded(value)
            .map_err(|_| serde::de::Error::custom("invalid sandbox source digest"))
    }
}

impl SandboxSourceDigest {
    /// 从已计算的 `algorithm:value` 文本构造来源摘要;本函数不负责计算摘要。
    pub fn try_from_encoded(value: String) -> Result<Self, ContractError>;

    /// 返回已验证的编码文本。
    pub fn as_str(&self) -> &str;
}

/// 标识候选材料的规范化校验值,不等同于 artifact fingerprint 或 evidence digest。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
#[serde(transparent)]
pub struct SandboxMaterialDigest(String);

impl<'de> Deserialize<'de> for SandboxMaterialDigest {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;
        Self::try_from_encoded(value)
            .map_err(|_| serde::de::Error::custom("invalid sandbox material digest"))
    }
}

impl SandboxMaterialDigest {
    /// 从 material adapter 返回的已计算编码构造摘要;空白或缺少算法前缀时拒绝。
    pub fn try_from_encoded(value: String) -> Result<Self, ContractError>;

    /// 返回已验证的编码文本。
    pub fn as_str(&self) -> &str;
}

/// 标识同一事务内已提交 Sandbox truth 变化的单调游标。
#[derive(Clone, Copy, Debug, Eq, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(transparent)]
pub struct SandboxTruthCursor(u64);

impl<'de> Deserialize<'de> for SandboxTruthCursor {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = u64::deserialize(deserializer)?;
        Self::try_from_sequence(value)
            .map_err(|_| serde::de::Error::custom("invalid sandbox truth cursor"))
    }
}

impl SandboxTruthCursor {
    /// 仅供实现 Sandbox UnitOfWork 的受信 adapter 从事务内保留序号构造 truth cursor。
    pub fn try_from_sequence(value: u64) -> Result<Self, ContractError>;

    /// 返回用于排序和序列化的游标值。
    pub fn get(self) -> u64;
}

/// 标识同一事务内已提交 reference / projection marker 变化的单调游标。
#[derive(Clone, Copy, Debug, Eq, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(transparent)]
pub struct SandboxReferenceCursor(u64);

impl<'de> Deserialize<'de> for SandboxReferenceCursor {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = u64::deserialize(deserializer)?;
        Self::try_from_sequence(value)
            .map_err(|_| serde::de::Error::custom("invalid sandbox reference cursor"))
    }
}

impl SandboxReferenceCursor {
    /// 仅供实现 Sandbox UnitOfWork 的受信 adapter 从事务内保留序号构造 reference cursor。
    pub fn try_from_sequence(value: u64) -> Result<Self, ContractError>;

    /// 返回用于排序和序列化的游标值。
    pub fn get(self) -> u64;
}
```

| 类型 / 字段 | 来源 | 不变量 | 禁止替代 |
|---|---|---|---|
| `SandboxReason.0` | guard、typed adapter outcome、caller-safe mapping | trim 后非空;已脱敏;不驱动状态解析 | raw SQL / HTTP / SDK / panic / external body |
| `SandboxSourceDigest.0` | resolver / trusted source envelope | `algorithm:value`;算法及计算器由受影响实现 boundary 固定 | request fingerprint、material digest、trace id |
| `SandboxMaterialDigest.0` | capture / material adapter | `algorithm:value`;不宣称 formal artifact / evidence identity | artifact baseline、evidence alias、source digest |
| `SandboxTruthCursor.0` | UoW accepted truth commit sequence | 大于 0;rollback 不可见;同 store 单调 | `Version`、`PageToken`、`Timestamp`、id generator |
| `SandboxReferenceCursor.0` | UoW reference marker commit sequence | 大于 0;rollback 不可见;与 truth cursor 类型隔离 | source version、dedup key、request fingerprint |

`contracts`、`application`与`infra`是三个独立 crate，因此两个 cursor 的 checked constructor 必须为
`pub`，才能由 `infra` 中实现 `SandboxUnitOfWork` 的 durable / fake adapter 调用。公开可见不表示任意
caller拥有分配权：application service、repository、entry和DTO mapper均不得直接调用；只有 UoW 在同一
事务内保留正序号并完成 non-zero 校验后才能构造，commit confirmed 前该值仍不是 committed cursor。

摘要算法当前仍受 `BLK-SBX-CANONICAL-001` 约束。`6R-01` 只固定 carrier 与角色隔离,不声称 RFC 8785 writer / verifier 已选型或已验证。

### 9.2 trace composition

```rust
use core_contracts::metadata::{RequestId, TraceId};
use serde::{Deserialize, Serialize};

/// 组合 Sandbox 各层共享的 trace identity,不保存 span body、日志正文或 observability store 内容。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub struct SandboxTraceContext {
    /// 当前调用或事实所属的 distributed trace。
    trace_id: TraceId,
    /// 可选父 trace,仅用于跨异步边界保持因果关系。
    parent_trace_id: Option<TraceId>,
    /// 可选原始请求标识,用于 request 到 fact 的可审计关联。
    request_id: Option<RequestId>,
}

#[derive(Deserialize)]
struct SandboxTraceContextWire {
    trace_id: TraceId,
    parent_trace_id: Option<TraceId>,
    request_id: Option<RequestId>,
}

impl<'de> Deserialize<'de> for SandboxTraceContext {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let wire = SandboxTraceContextWire::deserialize(deserializer)?;
        Self::try_new(wire.trace_id, wire.parent_trace_id, wire.request_id)
            .map_err(|_| serde::de::Error::custom("invalid sandbox trace context"))
    }
}

impl SandboxTraceContext {
    /// 从 exact core identity 构造 trace context；所有出现的 string newtype 都必须非空。
    pub fn try_new(
        trace_id: TraceId,
        parent_trace_id: Option<TraceId>,
        request_id: Option<RequestId>,
    ) -> Result<Self, ContractError>;

    /// 从已验证请求元数据复制 trace 与 request identity。
    pub fn try_from_request(
        trace_id: TraceId,
        request_id: RequestId,
    ) -> Result<Self, ContractError>;

    /// 为异步 consumer / job 构造带父 trace 的上下文,不得自行拼接 trace id。
    pub fn try_child(
        trace_id: TraceId,
        parent_trace_id: TraceId,
        request_id: Option<RequestId>,
    ) -> Result<Self, ContractError>;

    /// 返回当前 trace identity。
    pub fn trace_id(&self) -> &TraceId;

    /// 返回可选父 trace identity。
    pub fn parent_trace_id(&self) -> Option<&TraceId>;

    /// 返回可选 request identity。
    pub fn request_id(&self) -> Option<&RequestId>;
}
```

`SandboxTraceContext` 不重复 core `RequestMetadata`,因为 domain fact、consumer feedback 和 maintenance marker 并不都持有完整 request metadata。它只能组合 exact core identities,不能引入 `span_ref: String` 或 raw baggage。当前 core string newtype 构造器不拒绝空值，因此 `try_new` 和自定义 `Deserialize` 必须逐项检查 `TraceId::as_str()`、optional parent trace 和 optional `RequestId::as_str()`；任一 trim 后为空返回 `ContractError::EmptyText`。

### 9.3 external source carrier

```rust
use core_contracts::metadata::ResourceRef;
use serde::{Deserialize, Serialize};

/// 区分 Sandbox 可接收的外部 body-free 来源,不表达外部对象生命周期。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ExternalSourceKind {
    /// Identity / actor / member 锚点来源。
    Identity,
    /// Project / work / implementation context 来源。
    Work,
    /// 工具定义或工具调用语境来源,不包含工具语义正文。
    Tool,
    /// Runtime execution / agent-loop 语境来源,不包含 runtime truth。
    Runtime,
    /// Member host / binding 语境来源,不包含 member lifecycle。
    MemberHost,
    /// Runner 调用语境来源,不包含 Runner 产品状态。
    Runner,
    /// Policy / authorization / capability 摘要来源,不包含定义或审批正文。
    Policy,
    /// Artifact / candidate material 下游来源,不包含 artifact truth。
    Artifact,
    /// Observability material / delivery 来源,不包含观测存储正文。
    Observability,
    /// Security investigation / response 来源,不包含调查正文。
    Investigation,
    /// Isolation backend / capability source,不包含 SDK response 或产品 lifecycle。
    IsolationBackend,
}

/// 指向外部稳定对象的 body-free 引用,不得作为 Sandbox repository 主键。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub struct ExternalSourceRef {
    /// 外部来源类别。
    source_kind: ExternalSourceKind,
    /// 外部系统提供的稳定 opaque resource reference。
    resource_ref: ResourceRef,
    /// 可选外部版本引用,只用于 freshness / conflict 判断。
    source_version_ref: Option<ResourceRef>,
    /// 可选来源摘要,不保存 safe summary 正文。
    source_digest: Option<SandboxSourceDigest>,
}

#[derive(Deserialize)]
struct ExternalSourceRefWire {
    source_kind: ExternalSourceKind,
    resource_ref: ResourceRef,
    source_version_ref: Option<ResourceRef>,
    source_digest: Option<SandboxSourceDigest>,
}

impl<'de> Deserialize<'de> for ExternalSourceRef {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let wire = ExternalSourceRefWire::deserialize(deserializer)?;
        Self::try_from_resolver(
            wire.source_kind,
            wire.resource_ref,
            wire.source_version_ref,
            wire.source_digest,
        )
        .map_err(|_| serde::de::Error::custom("invalid external source reference"))
    }
}

impl ExternalSourceRef {
    /// 从可信 entry / resolver 输出构造外部引用；任一出现的 resource ref 为空时拒绝。
    pub fn try_from_resolver(
        source_kind: ExternalSourceKind,
        resource_ref: ResourceRef,
        source_version_ref: Option<ResourceRef>,
        source_digest: Option<SandboxSourceDigest>,
    ) -> Result<Self, ContractError>;

    /// 返回外部来源类别。
    pub fn source_kind(&self) -> ExternalSourceKind;

    /// 返回外部对象的 opaque resource reference。
    pub fn resource_ref(&self) -> &ResourceRef;

    /// 返回可选 source version reference。
    pub fn source_version_ref(&self) -> Option<&ResourceRef>;

    /// 返回可选 source digest。
    pub fn source_digest(&self) -> Option<&SandboxSourceDigest>;

    /// 判断两个引用是否指向同一外部来源;version / digest 不参与 identity。
    pub fn same_source(&self, other: &Self) -> bool;
}

/// 保存插入顺序且按 `(source_kind, resource_ref)` 去重的外部引用集合。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
#[serde(transparent)]
pub struct ExternalSourceRefSet(Vec<ExternalSourceRef>);

impl<'de> Deserialize<'de> for ExternalSourceRefSet {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let items = Vec::<ExternalSourceRef>::deserialize(deserializer)?;
        Self::try_new(items)
            .map_err(|_| serde::de::Error::custom("invalid external source reference set"))
    }
}

impl ExternalSourceRefSet {
    /// 构造 ordered-unique 集合;重复同源引用必须拒绝,不得静默保留两份版本。
    pub fn try_new(items: Vec<ExternalSourceRef>) -> Result<Self, ContractError>;

    /// 返回只读切片,调用方不得绕过集合不变量修改内容。
    pub fn as_slice(&self) -> &[ExternalSourceRef];

    /// 判断是否包含指定来源类别。
    pub fn contains_kind(&self, source_kind: ExternalSourceKind) -> bool;
}
```

| 约束 | 结论 |
|---|---|
| external ref identity | 只比较 `source_kind + resource_ref`;version / digest 是观察属性。 |
| duplicate same source | 构造失败并返回 `ContractError::DuplicateExternalSource`;不得隐式选择最新版本。 |
| sibling dependency | 除 core 外不引入 Cargo dependency;各 sibling ref 由 entry / resolver 映射为 `ResourceRef`。 |
| scope derivation | 不得从 `ResourceRef` 字符串解析 actor、project、work、policy scope;需要时由正式 resolver / relation decision 提供。 |
| body boundary | URL、path、title 或 opaque ref 可能指向正文,但 Sandbox 只保存指针和摘要;不得 materialize external body 到 truth。 |

### 9.4 safe summary carrier

```rust
use core_contracts::metadata::ResourceRef;
use serde::{Deserialize, Serialize};

/// 指向外部系统提供的 body-free safe summary,不指向完整对象正文。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub struct SafeSummaryRef {
    /// 产生摘要的外部来源类别。
    source_kind: ExternalSourceKind,
    /// safe summary 的稳定引用。
    summary_ref: ResourceRef,
    /// 可选摘要完整性校验值。
    summary_digest: Option<SandboxSourceDigest>,
}

#[derive(Deserialize)]
struct SafeSummaryRefWire {
    source_kind: ExternalSourceKind,
    summary_ref: ResourceRef,
    summary_digest: Option<SandboxSourceDigest>,
}

impl<'de> Deserialize<'de> for SafeSummaryRef {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let wire = SafeSummaryRefWire::deserialize(deserializer)?;
        Self::try_from_resolver(wire.source_kind, wire.summary_ref, wire.summary_digest)
            .map_err(|_| serde::de::Error::custom("invalid safe summary reference"))
    }
}

impl SafeSummaryRef {
    /// 从 resolver / trusted source 输出构造 safe summary 引用；空 summary ref 必须拒绝。
    pub fn try_from_resolver(
        source_kind: ExternalSourceKind,
        summary_ref: ResourceRef,
        summary_digest: Option<SandboxSourceDigest>,
    ) -> Result<Self, ContractError>;

    /// 返回 safe summary 的来源类别。
    pub fn source_kind(&self) -> ExternalSourceKind;

    /// 返回 safe summary 的 opaque reference。
    pub fn summary_ref(&self) -> &ResourceRef;

    /// 返回可选 summary digest。
    pub fn summary_digest(&self) -> Option<&SandboxSourceDigest>;
}

/// 保存插入顺序且按 `(source_kind, summary_ref)` 去重的 safe summary 引用集合。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
#[serde(transparent)]
pub struct SafeSummaryRefSet(Vec<SafeSummaryRef>);

impl<'de> Deserialize<'de> for SafeSummaryRefSet {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let items = Vec::<SafeSummaryRef>::deserialize(deserializer)?;
        Self::try_new(items)
            .map_err(|_| serde::de::Error::custom("invalid safe summary reference set"))
    }
}

impl SafeSummaryRefSet {
    /// 构造 ordered-unique 集合;重复 summary 必须拒绝。
    pub fn try_new(items: Vec<SafeSummaryRef>) -> Result<Self, ContractError>;

    /// 返回只读引用切片。
    pub fn as_slice(&self) -> &[SafeSummaryRef];
}
```

`SafeSummaryRef` 与 `ExternalSourceRef` 不可互相 `From`。前者指向经过外部 owner 限定的安全摘要,后者指向外部对象锚点;二者缺任一时必须按对象 guard 进入 pending / unresolved / degraded,不能互相冒充。

### 9.5 forbidden-body marker

```rust
use serde::{Deserialize, Serialize};

/// 标识绝不能进入 Sandbox truth、projection、error、log 或 report 的外部正文类别。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ExternalBodyMarker {
    /// Identity profile、member lifecycle 或 credential 正文。
    IdentityBody,
    /// Project / work / plan / implementation item 正文。
    WorkBody,
    /// Tool definition、policy、invocation request / result 语义正文。
    ToolSemanticBody,
    /// Runtime agent loop、execution instance、checkpoint 或 result backflow 正文。
    RuntimeLoopBody,
    /// Member host / session / worker / callback material 正文。
    MemberHostBody,
    /// Runner UI / CLI / product run state 正文。
    RunnerBody,
    /// Policy definition、approval、allowlist、capability 或 DSL 正文。
    PolicyDefinitionBody,
    /// Artifact、baseline、formal evidence 或 package 正文。
    ArtifactBody,
    /// Trace、metric、audit ledger、retention 或 alert store 正文。
    ObservabilityBody,
    /// Investigation case、operator note 或 security response 正文。
    InvestigationBody,
    /// Backend SDK response、host、cluster、container 或 scheduler lifecycle 正文。
    BackendBody,
    /// Secret、token、credential、private key 或未脱敏 material。
    SecretMaterial,
}

/// 保存插入顺序且不允许重复的 forbidden-body marker 集合。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
#[serde(transparent)]
pub struct ForbiddenExternalBodyMarkerSet(Vec<ExternalBodyMarker>);

impl<'de> Deserialize<'de> for ForbiddenExternalBodyMarkerSet {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let items = Vec::<ExternalBodyMarker>::deserialize(deserializer)?;
        Self::try_new(items)
            .map_err(|_| serde::de::Error::custom("invalid forbidden external body marker set"))
    }
}

impl ForbiddenExternalBodyMarkerSet {
    /// 构造 ordered-unique marker 集合。
    pub fn try_new(items: Vec<ExternalBodyMarker>) -> Result<Self, ContractError>;

    /// 返回当前是否存在任一正文越界 marker。
    pub fn contains_forbidden_body(&self) -> bool;

    /// 返回只读 marker 切片。
    pub fn as_slice(&self) -> &[ExternalBodyMarker];
}
```

任何非空 `ForbiddenExternalBodyMarkerSet` 都不能被配置、debug、replay、fake 或 test profile 忽略。具体是 reject、quarantine、pending 还是 fail-closed,由 owning guard / protocol flow 定义;集合本身不推进状态。

---

## 10. Named typed ref exact contract

### 10.1 tagged generic object ref

```rust
use core_contracts::metadata::ResourceRef;
use serde::{Deserialize, Serialize};

/// 穷尽当前边界内可持久化、可查询或可作为正式关系端点的 Sandbox 对象类别。
#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxObjectRefKind {
    /// 受控执行语境。
    ControlledExecutionContext,
    /// 执行环境身份。
    ExecutionEnvironmentIdentity,
    /// intake 上下文解析结果。
    ExecutionContextResolution,
    /// intake 外部引用解析边界。
    ContextReferenceResolution,
    /// 受控执行入口 guard。
    ControlledExecutionIntakeGuard,
    /// 外部正文排除 guard。
    ExternalBodyExclusionGuard,
    /// coherent boundary 要求集合。
    BoundaryRequirementSet,
    /// 已建立或已拒绝的 coherent boundary。
    CoherentBoundary,
    /// boundary 建立裁定。
    BoundaryEstablishmentDecision,
    /// backend capability body-free 摘要。
    BackendCapabilitySummary,
    /// Sandbox 持有的隔离环境 handle。
    IsolationEnvironmentHandle,
    /// boundary coherence guard。
    BoundaryCoherenceGuard,
    /// backend capability guard。
    BackendCapabilityGuard,
    /// execution status 只读视图。
    SandboxExecutionStatusView,
    /// boundary status 只读视图。
    BoundaryStatusView,
    /// policy 适用性 body-free 快照。
    PolicyApplicabilitySnapshot,
    /// policy execution 裁定。
    PolicyExecutionDecision,
    /// 高风险动作裁定。
    HighRiskActionDecision,
    /// policy 适用性 guard。
    PolicyApplicabilityGuard,
    /// fail-closed guard。
    FailClosedPolicyGuard,
    /// policy 裁定摘要视图。
    PolicyDecisionSummaryView,
    /// Sandbox-owned controlled run。
    ControlledExecutionRun,
    /// capture fact。
    CaptureFact,
    /// 可交接的 observability material 记录。
    ObservabilityMaterial,
    /// 下游 handoff fact。
    HandoffFact,
    /// capture completeness guard。
    CaptureCompletenessGuard,
    /// handoff ownership guard。
    HandoffOwnershipGuard,
    /// capture 摘要视图。
    CaptureSummaryView,
    /// material handoff 状态视图。
    MaterialHandoffStatusView,
    /// failure classification fact。
    FailureClassification,
    /// control fact。
    ControlFact,
    /// isolation lease record。
    LeaseRecord,
    /// orphan recovery record。
    OrphanRecoveryRecord,
    /// cleanup readiness guard truth。
    CleanupGuard,
    /// redline containment truth。
    RedlineContainment,
    /// control conflict guard。
    ControlConflictGuard,
    /// cleanup safety guard。
    CleanupSafetyGuard,
    /// redline containment guard。
    RedlineContainmentGuard,
    /// failure / control 只读视图。
    FailureControlStatusView,
    /// cleanup readiness 只读视图。
    CleanupReadinessView,
    /// redline containment 只读视图。
    RedlineContainmentView,
    /// 长期外部引用解析状态。
    ReferenceResolutionState,
    /// inspect / preview / trend 派生状态。
    DerivedInspectPreviewTrendState,
    /// derived read-only guard。
    DerivedReadOnlyGuard,
    /// Sandbox read projection。
    SandboxReadProjection,
    /// inspect / preview / trend 派生视图。
    DerivedInspectPreviewTrendView,
    /// backend capability 比较视图。
    BackendCapabilityComparisonView,
    /// Sandbox reconciliation report。
    SandboxReconciliationReport,
    /// Sandbox append-only audit trace。
    SandboxAuditTrace,
    /// Sandbox append-only event relay record。
    SandboxEventRelayRecord,
    /// application idempotency record。
    SandboxIdempotencyRecord,
    /// application stored operation result。
    SandboxStoredOperationResult,
}

/// 在 affected-ref、trace-subject 或 closed union 中携带 kind 的 generic Sandbox 对象引用。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub struct SandboxObjectRef {
    /// 对象类别;不能由 resource reference 字符串反推。
    kind: SandboxObjectRefKind,
    /// Sandbox-local opaque resource reference。
    resource_ref: ResourceRef,
}

#[derive(Deserialize)]
struct SandboxObjectRefWire {
    kind: SandboxObjectRefKind,
    resource_ref: ResourceRef,
}

impl<'de> Deserialize<'de> for SandboxObjectRef {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let wire = SandboxObjectRefWire::deserialize(deserializer)?;
        Self::try_new(wire.kind, wire.resource_ref)
            .map_err(|_| serde::de::Error::custom("invalid sandbox object reference"))
    }
}

impl SandboxObjectRef {
    /// 从显式 kind 与非空 resource ref 构造 generic object ref。
    pub fn try_new(
        kind: SandboxObjectRefKind,
        resource_ref: ResourceRef,
    ) -> Result<Self, ContractError>;

    /// 返回对象类别。
    pub fn kind(&self) -> SandboxObjectRefKind;

    /// 返回 opaque resource reference,调用方不得解析其内部结构。
    pub fn resource_ref(&self) -> &ResourceRef;
}

/// 校验 core `ResourceRef` 在 Sandbox typed-ref 边界中非空。
fn ensure_non_empty_resource_ref(
    field: &'static str,
    value: &ResourceRef,
) -> Result<(), ContractError> {
    if value.as_str().trim().is_empty() {
        return Err(ContractError::EmptyResourceRef { field });
    }
    Ok(())
}
```

| 不变量 | 约束 |
|---|---|
| non-empty | `resource_ref.as_str().trim()` 必须非空。core 当前构造器不验证该条件,所以 Sandbox 边界必须补检。 |
| explicit kind | kind 只能来自 named wrapper 或显式 closed mapper,不得从 string prefix / path / table name 推断。 |
| no repository generic read | repository / port 的 exact read / write 接口只接收 named wrapper;`SandboxObjectRef` 不得作为万能 repository key。 |
| no external conversion | 不提供 `From<ExternalSourceRef>`、`From<SafeSummaryRef>`、`From<CapturedMaterialRef>` 或相反转换。 |
| no alias | 不再导出 `SandboxOpaqueId`、`SandboxOpaqueRef` 或 `SandboxTypedRef`。 |

### 10.2 named wrapper 生成规则

以下宏是实现骨架,不是把多个类型合并成一个 public alias。每个 invocation 生成独立 Rust type、独立 serde type identity 和固定 kind 校验。

```rust
macro_rules! define_sandbox_object_ref {
    ($name:ident, $kind:ident, $doc:literal) => {
        #[doc = $doc]
        #[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
        #[serde(transparent)]
        pub struct $name(ResourceRef);

        impl<'de> Deserialize<'de> for $name {
            fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                let resource_ref = ResourceRef::deserialize(deserializer)?;
                Self::try_new(resource_ref)
                    .map_err(|_| serde::de::Error::custom("invalid named sandbox reference"))
            }
        }

        impl $name {
            /// 从非空 Sandbox-local resource reference 构造 named ref。
            pub fn try_new(resource_ref: ResourceRef) -> Result<Self, ContractError> {
                ensure_non_empty_resource_ref(stringify!($name), &resource_ref)?;
                Ok(Self(resource_ref))
            }

            /// 返回只读 resource reference;不得解析其内部结构或转换成其他 named ref。
            pub fn as_resource_ref(&self) -> &ResourceRef {
                &self.0
            }

            /// 消费 named ref 并返回 opaque resource reference。
            pub fn into_resource_ref(self) -> ResourceRef {
                self.0
            }
        }

        impl From<$name> for SandboxObjectRef {
            fn from(value: $name) -> Self {
                Self {
                    kind: SandboxObjectRefKind::$kind,
                    resource_ref: value.0,
                }
            }
        }

        impl TryFrom<SandboxObjectRef> for $name {
            type Error = ContractError;

            fn try_from(value: SandboxObjectRef) -> Result<Self, Self::Error> {
                if value.kind != SandboxObjectRefKind::$kind {
                    return Err(ContractError::WrongObjectRefKind {
                        expected: SandboxObjectRefKind::$kind,
                        actual: value.kind,
                    });
                }
                Ok(Self(value.resource_ref))
            }
        }
    };
}
```

禁止增加 `impl From<SandboxObjectRef> for XxxRef`、`impl From<ResourceRef> for XxxRef` 或任意跨 named ref 的 `From`。这些 infallible conversion 会绕过 non-empty / wrong-kind 门禁。

`Deserialize` 必须走与 `try_new` 相同的 non-empty 校验；不得依赖 `#[serde(transparent)]` 的派生反序列化直接写入 private field。反序列化错误文本保持固定且不回显原始 ref；详细 `ContractError` 只在受控内部 mapper 中保留。

### 10.3 intake / boundary named refs

```rust
define_sandbox_object_ref!(ControlledExecutionContextRef, ControlledExecutionContext, "引用 Sandbox 拥有的受控执行语境。");
define_sandbox_object_ref!(ExecutionEnvironmentIdentityRef, ExecutionEnvironmentIdentity, "引用 Sandbox 拥有的执行环境身份。");
define_sandbox_object_ref!(ExecutionContextResolutionRef, ExecutionContextResolution, "引用一次 intake 上下文解析结果。");
define_sandbox_object_ref!(ContextReferenceResolutionRef, ContextReferenceResolution, "引用一次 intake 外部引用解析边界记录。");
define_sandbox_object_ref!(ControlledExecutionIntakeGuardRef, ControlledExecutionIntakeGuard, "引用受控执行入口 guard 的固定规则快照。");
define_sandbox_object_ref!(ExternalBodyExclusionGuardRef, ExternalBodyExclusionGuard, "引用外部正文排除 guard 的固定规则快照。");
define_sandbox_object_ref!(BoundaryRequirementSetRef, BoundaryRequirementSet, "引用 coherent boundary 的完整要求集合。");
define_sandbox_object_ref!(CoherentBoundaryRef, CoherentBoundary, "引用 Sandbox 已建立或已拒绝的 coherent boundary truth。");
define_sandbox_object_ref!(BoundaryEstablishmentDecisionRef, BoundaryEstablishmentDecision, "引用 boundary 建立裁定。");
define_sandbox_object_ref!(BackendCapabilitySummaryRef, BackendCapabilitySummary, "引用用于 boundary 判断的 backend capability 摘要。");
define_sandbox_object_ref!(IsolationEnvironmentHandleRef, IsolationEnvironmentHandle, "引用 Sandbox 管理的隔离环境 handle。");
define_sandbox_object_ref!(BoundaryCoherenceGuardRef, BoundaryCoherenceGuard, "引用 boundary coherence guard 的固定规则快照。");
define_sandbox_object_ref!(BackendCapabilityGuardRef, BackendCapabilityGuard, "引用 backend capability guard 的固定规则快照。");
define_sandbox_object_ref!(SandboxExecutionStatusViewRef, SandboxExecutionStatusView, "引用 Sandbox execution status 只读视图。");
define_sandbox_object_ref!(BoundaryStatusViewRef, BoundaryStatusView, "引用 boundary status 只读视图。");
```

### 10.4 policy / run / capture named refs

```rust
define_sandbox_object_ref!(PolicyApplicabilitySnapshotRef, PolicyApplicabilitySnapshot, "引用给定 policy / authorization 的 body-free 适用性快照。");
define_sandbox_object_ref!(PolicyExecutionDecisionRef, PolicyExecutionDecision, "引用 Sandbox policy execution 裁定。");
define_sandbox_object_ref!(HighRiskActionDecisionRef, HighRiskActionDecision, "引用单个高风险动作裁定。");
define_sandbox_object_ref!(PolicyApplicabilityGuardRef, PolicyApplicabilityGuard, "引用 policy 适用性 guard 的固定规则快照。");
define_sandbox_object_ref!(FailClosedPolicyGuardRef, FailClosedPolicyGuard, "引用 fail-closed guard 的固定规则快照。");
define_sandbox_object_ref!(PolicyDecisionSummaryViewRef, PolicyDecisionSummaryView, "引用 policy decision summary 只读视图。");
define_sandbox_object_ref!(ControlledExecutionRunRef, ControlledExecutionRun, "引用 Sandbox-owned controlled execution run。");
define_sandbox_object_ref!(CaptureFactRef, CaptureFact, "引用一次受控执行的 capture fact。");
define_sandbox_object_ref!(ObservabilityMaterialRef, ObservabilityMaterial, "引用 Sandbox 记录的 observability handoff material。");
define_sandbox_object_ref!(HandoffFactRef, HandoffFact, "引用 Sandbox 记录的下游 handoff fact。");
define_sandbox_object_ref!(CaptureCompletenessGuardRef, CaptureCompletenessGuard, "引用 capture completeness guard 的固定规则快照。");
define_sandbox_object_ref!(HandoffOwnershipGuardRef, HandoffOwnershipGuard, "引用 handoff ownership guard 的固定规则快照。");
define_sandbox_object_ref!(CaptureSummaryViewRef, CaptureSummaryView, "引用 capture summary 只读视图。");
define_sandbox_object_ref!(MaterialHandoffStatusViewRef, MaterialHandoffStatusView, "引用 material handoff status 只读视图。");
```

### 10.5 failure / cleanup / read named refs

```rust
define_sandbox_object_ref!(FailureClassificationRef, FailureClassification, "引用 Sandbox failure classification fact。");
define_sandbox_object_ref!(ControlFactRef, ControlFact, "引用 Sandbox control fact。");
define_sandbox_object_ref!(LeaseRecordRef, LeaseRecord, "引用 isolation environment lease record。");
define_sandbox_object_ref!(OrphanRecoveryRecordRef, OrphanRecoveryRecord, "引用 orphan recovery record。");
define_sandbox_object_ref!(CleanupGuardRef, CleanupGuard, "引用 cleanup readiness guard truth。");
define_sandbox_object_ref!(RedlineContainmentRef, RedlineContainment, "引用 security redline containment truth。");
define_sandbox_object_ref!(ControlConflictGuardRef, ControlConflictGuard, "引用 control conflict guard 的固定规则快照。");
define_sandbox_object_ref!(CleanupSafetyGuardRef, CleanupSafetyGuard, "引用 cleanup safety guard 的固定规则快照。");
define_sandbox_object_ref!(RedlineContainmentGuardRef, RedlineContainmentGuard, "引用 redline containment guard 的固定规则快照。");
define_sandbox_object_ref!(FailureControlStatusViewRef, FailureControlStatusView, "引用 failure / control status 只读视图。");
define_sandbox_object_ref!(CleanupReadinessViewRef, CleanupReadinessView, "引用 cleanup readiness 只读视图。");
define_sandbox_object_ref!(RedlineContainmentViewRef, RedlineContainmentView, "引用 redline containment 只读视图。");
define_sandbox_object_ref!(ReferenceResolutionStateRef, ReferenceResolutionState, "引用长期跟踪的外部 reference resolution state。");
define_sandbox_object_ref!(DerivedInspectPreviewTrendStateRef, DerivedInspectPreviewTrendState, "引用 inspect / preview / trend 派生状态。");
define_sandbox_object_ref!(DerivedReadOnlyGuardRef, DerivedReadOnlyGuard, "引用 derived read-only guard 的固定规则快照。");
define_sandbox_object_ref!(SandboxReadProjectionRef, SandboxReadProjection, "引用 Sandbox read projection。");
define_sandbox_object_ref!(DerivedInspectPreviewTrendViewRef, DerivedInspectPreviewTrendView, "引用 inspect / preview / trend 派生视图。");
define_sandbox_object_ref!(BackendCapabilityComparisonViewRef, BackendCapabilityComparisonView, "引用 backend capability comparison 只读视图。");
define_sandbox_object_ref!(SandboxReconciliationReportRef, SandboxReconciliationReport, "引用 Sandbox reconciliation report。");
define_sandbox_object_ref!(SandboxAuditTraceRef, SandboxAuditTrace, "引用 Sandbox append-only audit trace。");
define_sandbox_object_ref!(SandboxEventRelayRecordRef, SandboxEventRelayRecord, "引用 Sandbox append-only event relay record。");
```

### 10.6 application persistence named refs

```rust
define_sandbox_object_ref!(SandboxIdempotencyRecordRef, SandboxIdempotencyRecord, "引用 application idempotency reservation / completion record。");
define_sandbox_object_ref!(SandboxStoredOperationResultRef, SandboxStoredOperationResult, "引用 replayable stored command result、consumer receipt 或 job report。");
```

`SandboxServiceCallContext`、adapter outcome、entry envelope、loop result 和 report accumulator 是按调用存在的 helper / finite outcome,没有独立 repository identity,因此不得为它们添加 `*Ref` 来凑齐命名对称。

### 10.7 closed source fact 与 trace subject

```rust
/// 穷尽 13 类正式 outbound event 对应的已成立 source fact identity。
#[derive(Clone, Debug, Eq, PartialEq, Serialize, Deserialize)]
pub enum SandboxSourceFactRef {
    /// `SandboxExecutionContextChanged` 的 source fact。
    ExecutionContext(ControlledExecutionContextRef),
    /// `SandboxBoundaryChanged` 的 source fact。
    BoundaryDecision(BoundaryEstablishmentDecisionRef),
    /// `SandboxPolicyDecisionChanged` 的 source fact。
    PolicyDecision(PolicyExecutionDecisionRef),
    /// `SandboxRunChanged` 的 source fact。
    Run(ControlledExecutionRunRef),
    /// `SandboxCaptureChanged` 的 source fact。
    Capture(CaptureFactRef),
    /// `SandboxMaterialHandoffChanged` 的 source fact。
    MaterialHandoff(HandoffFactRef),
    /// `SandboxFailureChanged` 的 source fact。
    Failure(FailureClassificationRef),
    /// `SandboxControlChanged` 的 source fact。
    Control(ControlFactRef),
    /// `SandboxCleanupChanged` 的 source fact。
    Cleanup(CleanupGuardRef),
    /// `SandboxRedlineContainmentChanged` 的 source fact。
    RedlineContainment(RedlineContainmentRef),
    /// `SandboxProjectionChanged` 的 source fact。
    Projection(SandboxReadProjectionRef),
    /// `SandboxDerivedViewChanged` 的 source fact。
    DerivedState(DerivedInspectPreviewTrendStateRef),
    /// `SandboxReconciliationFindingAvailable` 的 source fact。
    ReconciliationReport(SandboxReconciliationReportRef),
}

impl SandboxSourceFactRef {
    /// 返回与 source fact 一一对应的 formal outbound event kind。
    pub fn event_kind(&self) -> SandboxEventKind;

    /// 转为 generic object ref,用于 affected-ref / relay linkage;不得用于 generic repository read。
    pub fn into_object_ref(self) -> SandboxObjectRef;
}

/// 表达允许成为业务 audit subject 的 Sandbox-local 对象引用。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub struct SandboxTraceSubjectRef(SandboxObjectRef);

impl<'de> Deserialize<'de> for SandboxTraceSubjectRef {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let object_ref = SandboxObjectRef::deserialize(deserializer)?;
        Self::try_from_object_ref(object_ref)
            .map_err(|_| serde::de::Error::custom("invalid sandbox trace subject"))
    }
}

impl SandboxTraceSubjectRef {
    /// 从显式 local object ref 构造 trace subject;guard、view、audit 自身和 application helper 必须拒绝。
    pub fn try_from_object_ref(value: SandboxObjectRef) -> Result<Self, ContractError>;

    /// 返回 trace subject 的 generic local object ref。
    pub fn as_object_ref(&self) -> &SandboxObjectRef;
}
```

允许成为 `SandboxTraceSubjectRef` 的 kind 闭集为:

```text
ControlledExecutionContext
ExecutionEnvironmentIdentity
ExecutionContextResolution
ContextReferenceResolution
BoundaryRequirementSet
CoherentBoundary
BoundaryEstablishmentDecision
BackendCapabilitySummary
IsolationEnvironmentHandle
PolicyApplicabilitySnapshot
PolicyExecutionDecision
HighRiskActionDecision
ControlledExecutionRun
CaptureFact
ObservabilityMaterial
HandoffFact
FailureClassification
ControlFact
LeaseRecord
OrphanRecoveryRecord
CleanupGuard
RedlineContainment
ReferenceResolutionState
DerivedInspectPreviewTrendState
SandboxReadProjection
SandboxReconciliationReport
SandboxEventRelayRecord
```

guard / view 只能作为 trace 的输入或结果引用,不能作为业务 subject;`SandboxAuditTrace` 不能 subject 自身;idempotency / stored result 由 application operation trace关联,不作为 domain audit subject。

---

## 11. Canonical kind / selector contract

### 11.1 Kind owner 与封闭规则

本节只固定跨对象、跨协议会共享的有限分类。kind 表达“是什么类别”，不表达对象生命周期、适配器产品、配置项、route、topic 或任意字符串分派。完整约束如下：

| kind | 唯一 owner | 枚举来源 | 主要消费者 | 禁止用途 |
|---|---|---|---|---|
| `BoundaryLimitKind` | `contracts::refs` | 正式 `02` 的 coherent boundary 维度与 HLD boundary requirement | boundary requirement、capability summary / comparison、protocol mapping | 不保存 backend flag、数值限额或 profile key。 |
| `HighRiskActionKind` | `contracts::refs` | 正式 `02` policy / high-risk 边界 | marker、decision、policy guard | 不替代 tools semantic action 或 authorization truth。 |
| `SandboxFailureKind` | `contracts::refs` | 正式 `02` failure classification 范围 | failure fact、view、event | 不替代 raw adapter error 或 runtime result。 |
| `SandboxControlKind` | `contracts::refs` | 正式 `02` control 边界 | command / consumer、control fact | 不表达 business replay 或 runtime recovery。 |
| `MaterialKind` | `contracts::refs` | 正式 `02` capture / candidate material 边界 | captured material、capture view、handoff | 不表达 Artifact / evidence / baseline truth。 |
| `HandoffTargetKind` | `contracts::refs` | 正式 `02` 下游 owner 边界 | handoff target、port selector、job filter | target kind 不代表下游已接收。 |
| `RedlineKind` | `contracts::refs` | 正式 `00~02` security redline 与零容忍项 | containment、failure、event | 不得作为 advisory-only warning。 |
| `DerivedMaterialKind` | `contracts::refs` | 正式 `02` read / derived 范围 | derived state、query、maintenance job | 不得驱动核心 truth 迁移。 |

所有 enum 均要求：

1. 使用穷尽匹配；不得加入 `String`、`Unknown(String)` 或 backend-specific payload。
2. `Unknown` / `Other` 只在本节明确保留的分类中出现，并必须走保守路径；不得映射为 allow / success。
3. wire rename、schema version 和未知 wire value 的处置由回归后的 Step 8 定义；本节不把 serde fallback 当兼容策略。
4. 下游若需要新增 variant，必须先回到本节登记 owner、来源、guard 影响和消费者差集，不能在 DTO、adapter 或 job 内私增。

### 11.2 Boundary / policy kind

```rust
use serde::{Deserialize, Serialize};

/// 穷尽 coherent boundary 必须共同成立的限制维度。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BoundaryLimitKind {
    /// CPU 配额、份额或时间限制。
    Cpu,
    /// 内存上限及相关强制限制。
    Memory,
    /// 单次受控执行的墙钟时间限制。
    WallClock,
    /// IO 数量、吞吐或并发限制。
    Io,
    /// 文件系统可见性、读写和路径边界。
    Filesystem,
    /// 网络入口、出口和协议边界。
    Network,
    /// 进程、子进程、信号和进程数量边界。
    Process,
    /// workspace 可见性和写入边界。
    Workspace,
    /// mount 来源、目标、模式和传播边界。
    Mount,
    /// lease、release、cleanup 和托管生命周期边界。
    Lifecycle,
}

/// 穷尽 Sandbox 需要独立裁定的高风险动作类别。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum HighRiskActionKind {
    /// 扩大既定文件系统或 workspace 可见范围。
    FilesystemExpansion,
    /// 请求既定 network boundary 之外的出口访问。
    NetworkEgress,
    /// 请求越过既定进程、namespace 或宿主边界。
    ProcessEscape,
    /// 请求提高 CPU、memory、time、IO 或 process limit。
    ResourceExpansion,
    /// 请求读取、注入或暴露 secret material。
    SecretExposure,
    /// 来源无法给出可验证类别；该值必须 pending、blocked 或 fail-closed。
    Unknown,
}
```

`BoundaryLimitKind` 是 capability comparison 的比较轴，不是 requirement value。CPU 数值、mount mode、network rule、process profile 等 exact value object 由 `6R-02` 定义。`HighRiskActionKind::Unknown` 不是兼容放行项；它只能形成 `PendingAuthorization`、`Blocked` 或 `FailClosed`。

### 11.3 Failure / control / redline kind

```rust
/// 穷尽 Sandbox 自己能够形成正式分类事实的失败类别。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxFailureKind {
    /// 给定 policy 或 authorization 明示拒绝。
    PolicyDeny,
    /// 受控执行或维护动作超出明确时间边界。
    Timeout,
    /// isolation backend 建立、运行、检查或释放失败。
    BackendFailure,
    /// CPU、memory、time、IO 或 process limit 被触发。
    ResourceExceeded,
    /// 必需输出或材料未能按 capture contract 收口。
    CaptureFailure,
    /// material、observability 或 relay handoff 失败。
    HandoffFailure,
    /// lease 与 backend lifecycle 不一致或发现孤儿环境。
    Orphan,
    /// security redline 已检测并进入 containment。
    Redline,
    /// 输入尚不足以稳定分类；不得解释为成功。
    Unknown,
}

/// 穷尽 Sandbox 接受并形成正式控制事实的动作类别。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxControlKind {
    /// 立即终止受控执行。
    Kill,
    /// 取消尚未完成的受控执行或维护动作。
    Cancel,
    /// 请求在 guard 允许时执行 cleanup。
    Cleanup,
    /// 根据已给定拒绝事实阻断继续执行。
    Deny,
    /// 记录并执行 timeout 收束。
    Timeout,
    /// 请求安全调查或保守 containment 交接。
    Investigation,
    /// 已验证但不属于以上类别的控制动作；必须附安全原因并保守处理。
    Other,
}

/// 穷尽需要形成 containment truth 的安全红线类别。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RedlineKind {
    /// 越过文件系统、workspace 或 mount 边界。
    FilesystemBoundaryBreach,
    /// 未授权外联或越过 network boundary。
    NetworkBoundaryBreach,
    /// 逃逸进程、namespace、signal 或 child-process 边界。
    ProcessBoundaryBreach,
    /// 未授权访问宿主资源或宿主路径。
    UnauthorizedHostAccess,
    /// 以 host-run、local-process 或旁路路径冒充正式 Sandbox 成功。
    HostExecutionBypass,
    /// secret、credential、token 或 private material 暴露。
    SecretExposure,
    /// 未经授权尝试执行高风险动作。
    UnauthorizedHighRiskAction,
    /// 已检测但暂不能细分的安全红线；必须 containment，不得仅告警。
    Other,
}
```

`SandboxFailureKind::Redline` 表示失败分类与 redline truth 发生关联，不能替代 `RedlineKind`。`SandboxControlKind::Investigation` 只形成控制 / 交接事实，不拥有 investigation lifecycle，也不允许执行 business replay。

### 11.4 Material / handoff / derived kind

```rust
/// 穷尽 Sandbox 可记录为 body-free captured material 的类别。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MaterialKind {
    /// 标准输出的引用、摘要或 digest。
    Stdout,
    /// 标准错误的引用、摘要或 digest。
    Stderr,
    /// 进程退出状态的安全摘要。
    ExitStatus,
    /// 受控执行产生的文件或目录材料引用。
    OutputFile,
    /// 编译、测试、backend 或 capture diagnostic 的安全摘要。
    Diagnostic,
    /// 等待下游判断是否升级为正式 truth 的候选输出。
    CandidateOutput,
    /// 已验证但未细分的 body-free material；必须附安全来源和 digest。
    Other,
}

/// 穷尽 Sandbox 可显式交接但不拥有其正式 truth 的目标类别。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum HandoffTargetKind {
    /// `L1-artifact` material / artifact 接收边界。
    Artifact,
    /// `L2-runtime` execution feedback / material 接收边界。
    Runtime,
    /// `L5-runner` result / material 接收边界。
    Runner,
    /// `L4-observability` audit / trace / metric material 接收边界。
    Observability,
    /// security investigation 接收边界。
    Investigation,
    /// `L0-bus` 或等价 event relay 接收边界。
    EventRelay,
    /// 已验证但未细分的外部 owner；必须有 typed target ref 和 ownership guard。
    Other,
}

/// 穷尽 read-only derived material 的类别。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DerivedMaterialKind {
    /// 对单个 truth / material 的只读检查结果。
    Inspect,
    /// 对候选材料或边界结果的只读预览。
    Preview,
    /// 对已提交摘要的只读趋势结果。
    Trend,
    /// 对 backend capability 摘要的只读比较。
    BackendComparison,
    /// 对 truth、projection、handoff 或 relay 的只读对账结果。
    Reconciliation,
}
```

`MaterialKind` 只描述 material role；正文位置、digest、safety summary 和 lifecycle 由 `CapturedMaterialRef` 在 `6R-03` 闭合。`HandoffTargetKind` 只用于 closed selection，必须与独立 downstream target ref 一起出现，不能单独证明目标存在或已经接收。

### 11.5 Command / Query selector

```rust
/// 穷尽正式 `02` 中 10 个写入型 Command logical name。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxCommandKind {
    /// 打开受控执行语境并绑定 execution identity。
    OpenControlledExecutionContext,
    /// 建立 coherent execution boundary。
    EstablishExecutionBoundary,
    /// 对给定 policy / authorization 摘要作执行裁定。
    EvaluatePolicyExecution,
    /// 在已成立前置条件下启动受控执行 run。
    StartControlledExecutionRun,
    /// 记录 run 的 capture 结果。
    RecordCaptureResult,
    /// 为 captured / observability material 打开显式 handoff。
    OpenMaterialHandoff,
    /// 提交并收束 Sandbox control fact。
    SubmitSandboxControl,
    /// 形成稳定 Sandbox failure classification。
    ClassifySandboxFailure,
    /// 评估 cleanup readiness guard。
    EvaluateCleanupReadiness,
    /// 记录 security redline containment。
    RecordRedlineContainment,
}

/// 穷尽正式 `02` 中 13 个只读 Query logical name。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxQueryKind {
    /// 读取受控执行语境和可见执行状态。
    GetSandboxExecutionStatus,
    /// 读取 coherent boundary 状态。
    GetBoundaryStatus,
    /// 读取 policy execution decision 摘要。
    GetPolicyDecisionSummary,
    /// 读取 capture 摘要。
    GetCaptureSummary,
    /// 读取 material handoff 状态。
    GetMaterialHandoffStatus,
    /// 读取 failure / control 状态。
    GetFailureControlStatus,
    /// 读取 cleanup readiness。
    GetCleanupReadiness,
    /// 读取 redline containment 状态。
    GetRedlineContainmentStatus,
    /// 读取 Sandbox read projection。
    GetSandboxReadProjection,
    /// 读取 inspect / preview / trend 派生视图。
    GetDerivedInspectPreviewTrend,
    /// 读取 backend capability 比较视图。
    GetBackendCapabilityComparison,
    /// 读取 Sandbox reconciliation report。
    GetSandboxReconciliationReport,
    /// 读取 Sandbox audit trace。
    GetSandboxAuditTrace,
}
```

### 11.6 Consumer / outbound event selector

```rust
/// 穷尽正式 `02` 中 9 个 inbound event consumer logical name。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxConsumerKind {
    /// 消费调用方 context reference 变化。
    ConsumeCallerContextReferenceChanged,
    /// 消费给定 policy summary 变化。
    ConsumePolicySummaryChanged,
    /// 消费 backend capability summary 变化。
    ConsumeBackendCapabilitySummaryChanged,
    /// 消费 isolation backend lifecycle signal。
    ConsumeIsolationBackendLifecycleSignal,
    /// 消费 material handoff 状态变化。
    ConsumeMaterialHandoffStatusChanged,
    /// 消费 observability handoff 状态变化。
    ConsumeObservabilityHandoffStatusChanged,
    /// 消费外部 Sandbox control request。
    ConsumeSandboxControlRequested,
    /// 消费 investigation handoff 状态变化。
    ConsumeInvestigationHandoffStatusChanged,
    /// 消费 Sandbox truth relay feedback。
    ConsumeSandboxTruthRelayFeedback,
}

/// 穷尽正式 `02` 中 13 个 outbound event logical name。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxEventKind {
    /// execution context / identity / intake 状态变化。
    SandboxExecutionContextChanged,
    /// coherent boundary / handle 状态变化。
    SandboxBoundaryChanged,
    /// policy / high-risk execution decision 变化。
    SandboxPolicyDecisionChanged,
    /// controlled execution run 状态变化。
    SandboxRunChanged,
    /// capture fact / material 状态变化。
    SandboxCaptureChanged,
    /// material handoff 状态变化。
    SandboxMaterialHandoffChanged,
    /// failure classification 变化。
    SandboxFailureChanged,
    /// control fact 变化。
    SandboxControlChanged,
    /// cleanup / lease / orphan 状态变化。
    SandboxCleanupChanged,
    /// redline containment 状态变化。
    SandboxRedlineContainmentChanged,
    /// read projection freshness 变化。
    SandboxProjectionChanged,
    /// read-only derived view freshness 变化。
    SandboxDerivedViewChanged,
    /// reconciliation finding 可供读取。
    SandboxReconciliationFindingAvailable,
}
```

### 11.7 Operations Job selector

```rust
/// 穷尽正式 `02` 中 10 个 Operations Job logical name。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxJobKind {
    /// 发布 pending / retryable event relay record。
    PublishSandboxEventRelay,
    /// 刷新长期跟踪的 external reference state。
    RefreshSandboxReferenceStates,
    /// 刷新 backend capability summary。
    RefreshBackendCapabilitySummaries,
    /// 重试 pending / retryable material handoff。
    RetryPendingMaterialHandoffs,
    /// 检查 lease 并保守回收 orphan environment。
    RunLeaseOrphanReaper,
    /// 重评 pending cleanup guard。
    EvaluatePendingCleanupGuards,
    /// 维护 redline investigation handoff。
    MaintainRedlineContainmentHandoffs,
    /// 从 committed truth 重建 read projection。
    RebuildSandboxReadProjections,
    /// 维护 inspect / preview / trend 派生状态。
    MaintainDerivedInspectPreviewTrend,
    /// 运行 truth / projection / handoff / relay 对账。
    RunSandboxReconciliation,
}
```

### 11.8 Selector 机械闭合表

| family | canonical enum | variant 数 | direct upstream | 差集 | 约束 |
|---|---|---:|---|---:|---|
| Command | `SandboxCommandKind` | 10 | HLD Step 7 §8 | 0 | 只允许写入型 application entry；不从 route string 推断。 |
| Query | `SandboxQueryKind` | 13 | HLD Step 7 §9 | 0 | 只读；selector 不授予 visibility 或 write 权限。 |
| Inbound Consumer | `SandboxConsumerKind` | 9 | HLD Step 7 §10 | 0 | source authority、schema、dedup 和 forbidden-body guard 仍必须独立验证。 |
| Outbound Event | `SandboxEventKind` | 13 | HLD Step 7 §11 | 0 | 必须由 `SandboxSourceFactRef` 映射；不得从 payload 或 topic 反推。 |
| Operations Job | `SandboxJobKind` | 10 | HLD Step 7 §12 | 0 | job 只维护既有 truth / refs / projection，不冒充业务 Command。 |
| **合计** | 5 个 closed enum | **55** | 正式 `02` / HLD Step 7 | **0** | Step 8 只能定义 schema 和 mapping，不能新增 logical name。 |

selector 与 `OperationName` 是不同角色：selector 是 compile-time closed dispatch；`OperationName` 是 core-owned operation metadata。回归后的 Step 8 必须提供逐 variant 到固定 `OperationName` 的显式映射，禁止 `format!("{:?}")`、route / topic 解析或任意 free-form fallback。

---

## 12. Canonical status contract

### 12.1 Status owner registry

状态 enum 必须绑定单一状态主语。相同 variant 文本在不同主语中只表示各自主语的状态，不能跨 enum 转换、比较或作为通用数据库列。transition method、允许迁移和 exact domain error 由 `6R-02~05` 与回归后的 Step 10 共同闭合；本节只固定类型和有限值集合。

| group | 状态主语 | canonical enum | variants | canonical consumer batch |
|---|---|---|---:|---|
| intake | `ControlledExecutionContext` | `ControlledExecutionIntakeStatus` | 5 | `6R-02` |
| identity | `ExecutionEnvironmentIdentity` | `ExecutionEnvironmentIdentityStatus` | 3 | `6R-02` |
| intake resolution | `ExecutionContextResolution` | `ExecutionContextResolutionStatus` | 4 | `6R-02` |
| intake reference resolution | `ContextReferenceResolution` | `ContextReferenceResolutionStatus` | 4 | `6R-02` |
| tracked reference | `ReferenceResolutionState` | `ReferenceResolutionStateStatus` | 5 | `6R-04` |
| boundary decision | `BoundaryEstablishmentDecision` | `BoundaryEstablishmentDecisionStatus` | 5 | `6R-02` |
| coherent boundary | `CoherentBoundary` | `CoherentBoundaryStatus` | 6 | `6R-02` |
| backend capability | `BackendCapabilitySummary` | `BackendCapabilitySummaryStatus` | 4 | `6R-02` |
| isolation handle | `IsolationEnvironmentHandle` | `IsolationEnvironmentHandleStatus` | 5 | `6R-02` |
| policy snapshot | `PolicyApplicabilitySnapshot` | `PolicyApplicabilityStatus` | 5 | `6R-03` |
| policy decision | `PolicyExecutionDecision` | `PolicyExecutionDecisionStatus` | 5 | `6R-03` |
| high-risk decision | `HighRiskActionDecision` | `HighRiskActionDecisionStatus` | 4 | `6R-03` |
| run | `ControlledExecutionRun` | `ControlledExecutionRunStatus` | 5 | `6R-03` |
| capture | `CaptureFact` | `CaptureFactStatus` | 4 | `6R-03` |
| captured material | `CapturedMaterialRef` | `CapturedMaterialStatus` | 5 | `6R-03` |
| observability material | `ObservabilityMaterial` | `ObservabilityMaterialStatus` | 4 | `6R-03` |
| handoff target progress | `HandoffTargetProgress` | `HandoffTargetProgressStatus` | 5 | `6R-03` |
| handoff | `HandoffFact` | `HandoffFactStatus` | 5 | `6R-03` |
| failure | `FailureClassification` | `FailureClassificationStatus` | 4 | `6R-04` |
| control | `ControlFact` | `ControlFactStatus` | 5 | `6R-04` |
| lease | `LeaseRecord` | `LeaseRecordStatus` | 5 | `6R-04` |
| orphan | `OrphanRecoveryRecord` | `OrphanRecoveryRecordStatus` | 5 | `6R-04` |
| cleanup | `CleanupGuard` | `CleanupGuardStatus` | 5 | `6R-04` |
| redline | `RedlineContainment` | `RedlineContainmentStatus` | 5 | `6R-04` |
| projection | `SandboxReadProjection` | `SandboxReadProjectionStatus` | 5 | `6R-04` |
| derived | `DerivedInspectPreviewTrendState` | `DerivedInspectPreviewTrendStatus` | 5 | `6R-04` |
| reconciliation | `SandboxReconciliationReport` | `SandboxReconciliationReportStatus` | 4 | `6R-04` |
| audit | `SandboxAuditTrace` | `SandboxAuditTraceStatus` | 4 | `6R-04` |
| relay | `SandboxEventRelayRecord` | `SandboxEventRelayStatus` | 5 | `6R-04` |
| idempotency | `SandboxIdempotencyRecord` | `SandboxIdempotencyRecordStatus` | 3 | `6R-05` |
| stored result | `SandboxStoredOperationResult` | `SandboxStoredOperationResultStatus` | 3 | `6R-05` |
| visible execution view | `SandboxExecutionStatusView` | `SandboxExecutionVisibleStatus` | 6 | `6R-02` |
| visible policy view | `PolicyDecisionSummaryView` | `VisiblePolicyDecisionStatus` | 5 | `6R-03` |
| query response | public query surface | `SandboxQuerySurfaceStatus` | 11 | Step 8 regression |
| adapter | `AdapterAvailabilityState` | `AdapterAvailabilityStatus` | 4 | `6R-05` |
| runtime config | `SandboxRuntimeConfigSummary` | `RuntimeConfigStatus` | 3 | `6R-05` |
| command result | public command result | `SandboxCommandResultStatus` | 6 | Step 8 regression |
| consumer receipt | public consumer receipt | `SandboxConsumerReceiptStatus` | 7 | Step 8 regression |
| job report | public job report | `SandboxJobReportStatus` | 6 | Step 8 regression |

`EntryDisposition` 不在表中充当状态机。它是一次 entry 调用的有限处置结果，见 §12.8；不得持久化为 domain / application lifecycle，也不得替代 command result、consumer receipt 或 job report status。

### 12.2 Intake / identity / resolution status

```rust
use serde::{Deserialize, Serialize};

/// 受控执行语境从受理到关闭的状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ControlledExecutionIntakeStatus {
    /// 请求已受理，但必需引用、摘要或责任链仍待解析。
    PendingResolution,
    /// 语境已满足最小受理条件，可进入 boundary / policy 主线。
    Accepted,
    /// 语境不满足最小条件或被明确拒绝。
    Rejected,
    /// 必需引用不可解析、冲突或需要人工介入。
    Unresolved,
    /// 语境已终止并只允许保留只读历史。
    Closed,
}

/// execution environment identity 在 Sandbox 内的绑定状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ExecutionEnvironmentIdentityStatus {
    /// 身份与 accepted context、责任锚点和 trace 已绑定。
    Active,
    /// 对应受控执行生命周期已正常关闭。
    Closed,
    /// 责任链或必要引用失效，后续执行必须阻断。
    Invalidated,
}

/// 一次 intake 执行语境解析结果的状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ExecutionContextResolutionStatus {
    /// 必需引用和 safe summary 足以支撑正式受理。
    Resolved,
    /// 非核心摘要仍有缺口，只能停留在 pending 或 degraded 判断。
    Partial,
    /// 必需引用缺失或暂不可解析。
    Unresolved,
    /// 引用、摘要或责任语境彼此冲突。
    Conflicted,
}

/// 一次 intake 外部引用解析边界记录的状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ContextReferenceResolutionStatus {
    /// intake 所需引用已解析到 body-free safe summary。
    Complete,
    /// 引用仍存在，但摘要或 source version 已过期。
    Stale,
    /// 来源暂不可用，当前无法闭合 intake。
    Unavailable,
    /// 引用格式、归属或边界非法。
    Invalid,
}

/// 长期跟踪的 external reference / safe summary 刷新状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ReferenceResolutionStateStatus {
    /// 当前引用与摘要已解析且可供只读或后续重评使用。
    Resolved,
    /// source version 或摘要已过期，需要 refresh。
    Stale,
    /// 必需引用当前不可解析。
    Unresolved,
    /// 引用越界、格式非法或 owner 不匹配。
    Invalid,
    /// 外部来源暂不可用。
    Unavailable,
}
```

三种 resolution status 禁止互转：

| enum | 生命周期 | 可否决定首次 intake | 可否被 refresh job 更新 | 禁止替代 |
|---|---|---|---|---|
| `ExecutionContextResolutionStatus` | 一次 context resolution value | 是，与 intake guard 共同决定 | 只能通过新的 resolver outcome 更新 owning object | tracked reference state |
| `ContextReferenceResolutionStatus` | 一次 intake refs 边界记录 | 是，`Complete` 才可支持 normal path | consumer / resolver 可按 owning transition 更新 | context 整体 resolution |
| `ReferenceResolutionStateStatus` | 长期 tracking state | 否，只能使 read / projection / re-evaluation stale 或 blocked | 是 | 首次 intake success 或外部 truth |

### 12.3 Boundary / capability / handle status

```rust
/// boundary establishment 裁定的状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BoundaryEstablishmentDecisionStatus {
    /// 当前 requirement 与 capability 允许建立边界。
    Established,
    /// requirement 被明确拒绝或不允许建立。
    Rejected,
    /// 仍缺少可验证的 capability summary。
    PendingCapability,
    /// backend 明确不支持任一必需限制。
    Unsupported,
    /// 建立或验证动作失败。
    Failed,
}

/// coherent boundary truth 的生命周期状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CoherentBoundaryStatus {
    /// 完整 boundary requirement 已形成，但尚未建立。
    Required,
    /// 所有必需限制共同成立且已验证。
    Established,
    /// boundary requirement 被明确拒绝。
    Rejected,
    /// 等待可验证的 backend capability。
    PendingCapability,
    /// 建立后失败、丢失或无法继续验证。
    Failed,
    /// 环境边界已按 cleanup / release 规则收束。
    Released,
}

/// backend capability body-free summary 的可用状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BackendCapabilitySummaryStatus {
    /// 摘要与当前 source version 匹配；只有 checked age 仍在正 freshness window 内才可用于 boundary 判断。
    Fresh,
    /// 摘要已过期，只能触发 pending / refresh。
    Stale,
    /// 当前没有足够能力信息，不得 permissive fallback。
    Unknown,
    /// 已确认 backend 不支持一项或多项必需限制。
    Unsupported,
}

/// Sandbox 持有的 isolation environment handle 生命周期状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum IsolationEnvironmentHandleStatus {
    /// backend 环境已创建但尚未进入受控运行。
    Created,
    /// handle 可供匹配 context / boundary / policy 的受控运行使用。
    Active,
    /// cleanup guard 已允许或正在等待 backend release 完成。
    ReleasePending,
    /// backend 环境已确认释放。
    Released,
    /// Sandbox truth、lease 与 backend lifecycle 可能不一致。
    OrphanSuspected,
}
```

只有 matching `BackendCapabilityDecisionKind::Supported` 已用同一次 clock result 证明 `Fresh` snapshot 的 checked age 仍在 window 内，且 `BoundaryEstablishmentDecisionStatus::Established`、`CoherentBoundaryStatus::Established` 与有效 `IsolationEnvironmentHandleStatus::Created | Active` 在同一代 requirement / profile / capability 语境中一致时，后续 run guard 才能继续判断；任一 enum 不能单独证明可 launch。`Fresh` window 后续到期只阻止新的 establishment attempt，不反向改写已建立 boundary truth；已建立环境继续由 handle / lease / lifecycle observation / failure / cleanup 链收束。

### 12.4 Policy / high-risk status

```rust
/// 给定 policy / authorization body-free snapshot 的适用状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PolicyApplicabilityStatus {
    /// 给定摘要足以执行 Sandbox policy decision。
    Applicable,
    /// 缺少必需 policy 或 authorization 摘要。
    Missing,
    /// 给定 policy / authorization 摘要彼此冲突。
    Conflicted,
    /// 当前动作、边界或 backend 不支持对应策略要求。
    Unsupported,
    /// 摘要已过期，不能继续沿用原裁定。
    Stale,
}

/// Sandbox 对给定 policy / authorization 摘要的正式执行裁定状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PolicyExecutionDecisionStatus {
    /// policy、authorization 与 high-risk guard 均允许继续判断 launch。
    Accepted,
    /// 给定 policy 或 authorization 明示拒绝。
    Rejected,
    /// high-risk action 或前置 guard 阻断执行。
    Blocked,
    /// 仍在等待 policy、authorization 或 capability 摘要。
    Pending,
    /// 输入缺失、冲突、不支持或过期时形成保守拒绝。
    FailClosed,
}

/// 单个 high-risk action 在给定 policy 中的裁定状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum HighRiskActionDecisionStatus {
    /// 动作在当前 authorization、boundary 与 capability 内被明确允许。
    Allowed,
    /// 动作越界、未授权或被 guard 明确阻断。
    Blocked,
    /// 仍缺少可验证 authorization summary。
    PendingAuthorization,
    /// 当前 boundary 或 backend 无法安全执行该动作。
    Unsupported,
}
```

`PolicyApplicabilityStatus::Applicable` 只允许创建 / 重评 decision；`PolicyExecutionDecisionStatus::Accepted` 仍不代表 run 已启动；每一个 high-risk marker 都必须有对应 decision，且任一 non-`Allowed` 结果都不能被总 decision 忽略。

### 12.5 Run / capture / material / handoff status

```rust
/// Sandbox-owned controlled execution run 的生命周期状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ControlledExecutionRunStatus {
    /// context、boundary 和 policy 已成立，正在准备 backend launch。
    Preparing,
    /// 受控执行正在正式隔离边界内运行。
    Running,
    /// 运行已完成并可进入 capture / handoff 收口。
    Completed,
    /// 运行失败并需要 failure classification。
    Failed,
    /// 运行被 control、cleanup 或 redline 显式终止。
    Terminated,
}

/// 一次 run 的 capture fact 定格状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CaptureFactStatus {
    /// 所有 required material 已按 capture contract 收口。
    Complete,
    /// 只捕获了部分 required material，缺口必须显式可见。
    Partial,
    /// capture 动作失败并需要 failure / cleanup 处理。
    Failed,
    /// material 来源或 capture adapter 当前不可用。
    Unavailable,
}

/// 单个 captured material reference 的 lifecycle 状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CapturedMaterialStatus {
    /// body-free candidate material 已与 capture fact 绑定。
    Captured,
    /// 已打开 handoff，等待下游回执。
    HandoffPending,
    /// 下游 handoff 失败。
    HandoffFailed,
    /// 下游确认接收，但 formal truth ownership 不迁移给 Sandbox。
    HandoffAccepted,
    /// cleanup / investigation guard 阻止删除或释放材料。
    RetentionBlocked,
}

/// 一份 observability material 的交接状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ObservabilityMaterialStatus {
    /// body-free usage / audit / trace / metric material 已准备。
    Prepared,
    /// 正等待 observability handoff 回执。
    HandoffPending,
    /// observability handoff 失败。
    HandoffFailed,
    /// Sandbox 已记录交接事实，不代表 observability store truth 已成立。
    HandoffRecorded,
}

/// 单个handoff target在一个fixed target plan内的delivery progress状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum HandoffTargetProgressStatus {
    /// target已纳入batch但尚未持久化delivery attempt。
    Pending,
    /// 已形成唯一in-flight attempt，等待typed outcome或feedback。
    Attempting,
    /// target已返回可验证ack；不迁移formal truth ownership。
    Delivered,
    /// typed outcome允许对同一target安全重试。
    Retryable,
    /// target已进入不可自动重试的terminal failure。
    Failed,
}

/// 一次显式 downstream handoff fact 的状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum HandoffFactStatus {
    /// handoff 已打开但尚未收到可验证回执。
    Pending,
    /// 下游已确认接收 refs / material summary。
    Delivered,
    /// handoff 失败且当前未证明可安全重试。
    Failed,
    /// handoff 失败但按 typed outcome 允许重试。
    Retryable,
    /// cleanup guard 当前阻断相关材料删除或环境释放。
    BlockedByCleanupGuard,
}
```

`CaptureFactStatus` 不包含 `Pending`：`CaptureFact` 只在 `RecordCaptureResult` 持久化定格结果时创建，capture in-flight 是 application / adapter 调用状态，不是该 fact 的 lifecycle。`HandoffFactStatus` 不包含 `DeadLetter`：dead-letter 属于 event relay record；material handoff exhausted 仍保持 `Failed` 并由 report / safe reason 解释。

### 12.6 Failure / control / lease / cleanup / redline status

```rust
/// Sandbox failure classification fact 的稳定化状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FailureClassificationStatus {
    /// 仍缺 material、backend、control 或 redline 输入。
    PendingInput,
    /// 已形成稳定且可审计的 failure kind。
    Classified,
    /// 后续 control 或 redline 形成了更高优先级解释。
    Superseded,
    /// failure 已作为不可继续执行的终态收束。
    Terminal,
}

/// Sandbox control fact 的处理状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ControlFactStatus {
    /// control request 已作为正式事实受理。
    Accepted,
    /// 相同 control 已存在，本次重复被显式收束。
    IgnoredDuplicate,
    /// control 与现有 run / cleanup / redline 状态冲突。
    Conflicted,
    /// control 的 Sandbox-side 收束动作已完成。
    Completed,
    /// control 收束动作失败并需要显式恢复处理。
    Failed,
}

/// isolation environment lease record 的状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum LeaseRecordStatus {
    /// lease 当前有效。
    Active,
    /// lease 接近明确 expiry，需要 reaper 评估。
    Expiring,
    /// lease 已过期，环境不得继续作为 active handle 使用。
    Expired,
    /// 对应 environment 已确认释放。
    Released,
    /// lease、Sandbox truth 与 backend lifecycle 可能不一致。
    OrphanSuspected,
}

/// orphan environment 保守恢复记录的状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum OrphanRecoveryRecordStatus {
    /// 发现疑似 orphan，需要确认 backend lifecycle。
    Suspected,
    /// orphan 已被可验证 summary 确认。
    Confirmed,
    /// 正在 cleanup / redline guard 约束下保守回收。
    Recovering,
    /// 环境已回收且审计链保留。
    Recovered,
    /// 回收失败，需要 containment 或人工处理。
    Failed,
}

/// cleanup readiness guard 的状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CleanupGuardStatus {
    /// 等待 capture、handoff 或 audit material 安全收口。
    PendingEvidence,
    /// 等待 investigation / security handoff 状态。
    PendingInvestigation,
    /// cleanup 当前被明确阻断。
    Blocked,
    /// guard 已允许执行 cleanup，但 cleanup 尚未必完成。
    Allowed,
    /// cleanup 已完成并保留必要 trace / material linkage。
    Completed,
}

/// security redline containment truth 的状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RedlineContainmentStatus {
    /// redline signal 已被识别并形成正式 truth。
    Detected,
    /// 影响已按 fail-closed 规则隔离或阻断。
    Contained,
    /// 等待 security investigation handoff。
    HandoffPending,
    /// 在 guard 和 investigation 条件满足后解除 containment。
    Released,
    /// redline 已以不可继续执行的安全终态收束。
    Terminal,
}
```

`LeaseRecordStatus::Expired`、`OrphanRecoveryRecordStatus::Recovered`、`CleanupGuardStatus::Allowed` 和 `RedlineContainmentStatus::Released` 彼此独立，不能从其中任一状态推导其余状态。尤其 `Allowed` 不是 cleanup 完成，`Recovered` 不证明 capture / audit material 已安全交接，`Released` 不允许同一 run 复活。

### 12.7 Projection / derived / reconciliation / audit / relay status

```rust
/// Sandbox read projection 相对 committed truth 的状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxReadProjectionStatus {
    /// projection 已覆盖目标 committed truth cursor。
    Fresh,
    /// committed truth 已变化，projection 等待重建。
    Stale,
    /// projection 正从 committed truth snapshot 重建。
    Rebuilding,
    /// projection 可安全读取但存在明确缺口。
    Degraded,
    /// projection 当前不可供给。
    Unavailable,
}

/// inspect / preview / trend 派生状态相对来源 refs 的 freshness。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DerivedInspectPreviewTrendStatus {
    /// 派生结果与当前来源 refs / cursor 匹配。
    Fresh,
    /// 来源已变化，派生结果等待重建。
    Stale,
    /// 正从 body-free source refs 重建派生结果。
    Rebuilding,
    /// 重建失败，但不得形成核心 failure truth。
    Failed,
    /// 一项或多项来源当前不可用。
    Unavailable,
}

/// 一份 Sandbox reconciliation report 的结果状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxReconciliationReportStatus {
    /// 未发现目标 scope 内的未闭合不一致。
    Clean,
    /// 发现需要正式处理的 projection / handoff / relay 不一致。
    IssuesFound,
    /// 依赖缺失导致报告不完整但仍可安全读取。
    Degraded,
    /// 报告生成失败。
    Failed,
}

/// 一条 append-only Sandbox audit trace 的 linkage 状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxAuditTraceStatus {
    /// trace 已记录但尚未链接到正式 subject。
    Recorded,
    /// trace 已链接到正式 Sandbox subject。
    Linked,
    /// trace 对应的 relay 仍待发布。
    RelayPending,
    /// relay 失败，但本地 trace truth 保留。
    RelayFailed,
}

/// 一条 append-only Sandbox event relay record 的发布状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxEventRelayStatus {
    /// 已提交 source fact 正等待发布。
    Pending,
    /// event 已发布或收到可验证 delivery feedback。
    Published,
    /// 发布失败且尚未被分类为 retryable / dead-letter。
    Failed,
    /// typed publisher outcome 允许后续重试。
    Retryable,
    /// 当前 relay record 不再重试，需要新 record 或人工处置。
    DeadLetter,
}
```

`SandboxReconciliationReportStatus::IssuesFound` 只能生成 finding / degraded marker，不能修复 truth。`SandboxAuditTraceStatus::RelayFailed` 不删除 trace，`SandboxEventRelayStatus::Published` 也不升级 source fact 的业务状态。

### 12.8 Application / infra / public surface status

```rust
/// application idempotency reservation / completion record 的状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxIdempotencyRecordStatus {
    /// key 与 request fingerprint 已原子保留，operation 可执行一次。
    Reserved,
    /// replayable stored result 已保存并完成链接。
    Completed,
    /// operation 在保存 replayable result 前失败。
    Failed,
}

/// application stored public operation result 的状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxStoredOperationResultStatus {
    /// accepted / completed public result 可 replay。
    Completed,
    /// rejected public result 可 replay，duplicate 不得重跑 mutation。
    Rejected,
    /// failed public result 已安全保存并可 replay。
    Failed,
}

/// 一项 infrastructure adapter 的技术可用状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AdapterAvailabilityStatus {
    /// adapter 通过当前技术健康检查，可供对应 service guard 调用。
    Available,
    /// 已发布generation中的adapter只支持明确的degraded read / maintenance surface；startup required slot出现本值仍阻断发布。
    Degraded,
    /// adapter 当前不可用。
    Unavailable,
    /// adapter 被 validated config 禁用，但 hard domain guard 仍保持启用。
    Disabled,
}

/// validated runtime configuration 的启动状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RuntimeConfigStatus {
    /// 配置通过完整验证，可进入 runtime assembly。
    Valid,
    /// 缺少或冲突的 hard requirement 阻断启动。
    StartupBlocked,
    /// startup仅允许infra-private optional telemetry降级；发布后read / maintenance降级由adapter和public surface状态表达。
    Degraded,
}

/// query response 在 visibility、projection 与 dependency 条件下的 public surface 状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxQuerySurfaceStatus {
    /// 当前调用方可读取完整安全视图。
    Visible,
    /// 查询合法且可见，但当前没有匹配项。
    Empty,
    /// 调用方不能获知目标是否存在。
    NotVisible,
    /// 目标存在但当前 scope 只允许受限或脱敏视图。
    Restricted,
    /// projection / reference 已过期但可显式返回 stale surface。
    Stale,
    /// 视图可读但存在明确缺口。
    Degraded,
    /// query assembly 失败并返回 caller-safe error。
    Failed,
    /// projection 或 derived state 正在重建。
    Rebuilding,
    /// 对应 query / adapter 被 validated config 禁用。
    Disabled,
    /// 必需 projection 尚不存在。
    MissingProjection,
    /// repository、projection 或必要 adapter 当前不可用。
    Unavailable,
}

/// public command result 的有限状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxCommandResultStatus {
    /// command 已提交其规定的 truth / result。
    Accepted,
    /// command 被明确拒绝且未伪造 success。
    Rejected,
    /// command 合法但前置引用、capability 或 handoff 尚待闭合。
    Pending,
    /// command 只形成明确的 degraded result。
    Degraded,
    /// command 失败并返回 caller-safe error。
    Failed,
    /// duplicate request 返回已保存的完整 command result。
    DuplicateReplayed,
}

/// public inbound consumer receipt 的有限状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxConsumerReceiptStatus {
    /// event 已按 consumer contract 处理并可确认。
    Accepted,
    /// duplicate event 返回已保存 receipt，未重跑 mutation。
    Duplicate,
    /// event 应在依赖或 source 恢复后重试。
    Delayed,
    /// event 被安全拒绝。
    Rejected,
    /// consumer 处理失败。
    Failed,
    /// schema、source 或 forbidden-body 问题要求隔离处置。
    Quarantined,
    /// event 合法但没有需要提交的本地变化。
    NoOp,
}

/// public operations job report 的有限状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxJobReportStatus {
    /// 所有已选择 item 均成功完成。
    Succeeded,
    /// 至少一个 item 失败且至少一个 item 成功或安全跳过。
    PartialFailed,
    /// job 未能完成其规定工作。
    Failed,
    /// job 按 guard / selection 规则安全跳过。
    Skipped,
    /// job 生成了不完整但诚实的 degraded report。
    Degraded,
    /// duplicate job invocation 返回已保存完整 report。
    DuplicateReplayed,
}

/// 一次 API、worker 或 job entry 调用采取的有限处置；它不是持久状态机。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum EntryDisposition {
    /// entry 接受输入并调用相应 application surface。
    Accepted,
    /// entry 在任何 application mutation 前拒绝输入。
    Rejected,
    /// entry 安全延迟处理并保留后续重试语义。
    Delayed,
    /// entry 按 guard / selection 规则跳过处理。
    Skipped,
    /// entry 失败并返回 caller-safe surface。
    Failed,
}
```

`SandboxIdempotencyRecordStatus` 只表达已持久化 record 的生命周期；same-request
duplicate、different-request conflict、in-flight 和 failed-terminal 都是 reservation/read
observation，由 application-owned `SandboxIdempotencyObservation` 表达，不得写回
`record_status`。同理，`SandboxStoredOperationResultStatus` 只允许完整 surface 已保存后的
`Completed | Rejected | Failed`；lookup missing、wrong kind、不可见或损坏属于
`ApplicationErrorDetail::StoredResultUnavailable`，不得持久化一条 `Unavailable` result 来掩盖
完整性缺口。该 current override 使原 Step 10 中 `Reserved -> Conflict`、`Completed -> Duplicate`
和 `lookup -> Unavailable` 的写法进入 `historical_reviewed_revalidation_pending`。

### 12.9 Visible view status

```rust
/// `SandboxExecutionStatusView` 对外展示的汇总状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxExecutionVisibleStatus {
    /// intake、reference、boundary 或 policy 前置尚未完成。
    VisiblePending,
    /// context、boundary 和 policy 前置已满足但 run 尚未开始。
    VisibleReady,
    /// controlled run 正在运行。
    VisibleRunning,
    /// run 与必要 capture 已完成。
    VisibleCompleted,
    /// failure、control、cleanup 或 redline 使执行进入失败面。
    VisibleFailed,
    /// projection / reference / handoff 缺口导致读取面降级。
    VisibleDegraded,
}

/// `PolicyDecisionSummaryView` 对外展示的 policy decision 状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum VisiblePolicyDecisionStatus {
    /// 展示已接受的 policy execution decision。
    Accepted,
    /// 展示明示拒绝。
    Rejected,
    /// 展示 high-risk / guard 阻断。
    Blocked,
    /// 展示仍待闭口的 policy decision。
    Pending,
    /// 展示因缺失、冲突、不支持或过期而形成的 fail-closed。
    FailClosed,
}
```

visible status 只能由 source object + projection marker 组装，不能反向调用 transition method。`SandboxExecutionVisibleStatus::VisibleCompleted` 需要 owning view exact guard 在 `6R-02` 定义，不能仅凭 `ControlledExecutionRunStatus::Completed` 猜测 capture / handoff / failure 已闭合。

### 12.10 Public surface 与 persisted state 分层

| public / entry enum | 是否持久化 | source of truth | duplicate 行为 | 禁止替代 |
|---|---|---|---|---|
| `SandboxCommandResultStatus` | 作为完整 stored public result 的字段持久化 | application outcome + domain commit | `DuplicateReplayed` 返回原 result | domain object status |
| `SandboxConsumerReceiptStatus` | receipt / stored result 需要 replay 时持久化 | consumer application outcome | `Duplicate` 返回原 receipt | consumer processing state machine |
| `SandboxJobReportStatus` | 完整 job report 持久化 | report accumulator 的 persisted item refs | `DuplicateReplayed` 返回原 report | per-item state 或 job runner process state |
| `SandboxQuerySurfaceStatus` | 不作为 truth 持久化；可存在于 response / cacheable projection output | visibility + projection + adapter decision | 不适用 | projection lifecycle |
| `EntryDisposition` | 否 | entry mapper 的一次返回 | 不适用 | command / receipt / report status |

`Duplicate` 与 `DuplicateReplayed` 的命名差异是有意的：consumer receipt 的 `Duplicate` 本身就是可返回的最终 receipt status；command / job 返回原 stored result / report 时使用 `DuplicateReplayed` 明示结果来自 replay。不得再定义不带 `Sandbox` 前缀的 `ConsumerReceiptStatus` 或 `JobReportStatus`。

---

## 13. Canonical error contract

### 13.1 Error owner 与分层

| 层级 | canonical owner | 本批是否完整定义 | 可否暴露 public | 约束 |
|---|---|---|---|---|
| shared value / ref construction | `ContractError` | 是 | 只能经 mapper 转 `SandboxPublicErrorKind::Validation` / `Internal` | 不携带 raw body、SQL、IO、SDK 或 panic 文本。 |
| caller-safe protocol category | `SandboxPublicErrorKind` | 是 | 是 | 只有 16 个稳定 variant；safe reason / retryable / trace 由 Step 8 DTO 定义。 |
| domain transition / invariant | each object-owned error enum | 否，`6R-02~04` 与对象同节定义 | 否 | 必须携带 object ref、from/to、guard reason 等 exact context；不得建立泛化union或只用 generic `InvalidStateTransition`。 |
| application | `ApplicationError` / `SandboxApplicationError`;`ApplicationErrorKind`;`ApplicationErrorDetail` | 是，`6R-05` batch 1 §9.5 | 否 | detail -> kind -> public kind 三段映射均须穷尽；不接受 raw cause、generic `DomainError` union或 wildcard。 |
| infra | `InfraError` | 是，`6R-05` batch 2 §10.9 | 否 | 18个exact variant必须穷尽映射到application detail / public kind；raw cause只留内部受控诊断。 |
| entry | `ApiError`;`WorkerError`;`JobsError` | 是，`6R-05` batch 3 §11.7/§11.12/§11.18 | 否 | 7/12/17 exact variant及各自application-kind boundary action均已闭合；raw cause不得进入entry error。 |

### 13.2 `ContractError`

```rust
/// shared carrier、typed ref 和有限集合构造失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ContractError {
    /// 必需文本字段 trim 后为空。
    EmptyText {
        /// 发生错误的稳定字段名。
        field: &'static str,
    },
    /// 必需 `ResourceRef` trim 后为空。
    EmptyResourceRef {
        /// 发生错误的 stable carrier / field 名。
        field: &'static str,
    },
    /// digest 不满足非空 `algorithm:value` 编码。
    InvalidDigestEncoding {
        /// digest 角色，只允许 `source_digest` 或 `material_digest`。
        field: &'static str,
    },
    /// committed cursor 为零，不能表示已提交变化。
    ZeroCommittedCursor {
        /// cursor 角色，只允许 `truth_cursor` 或 `reference_cursor`。
        field: &'static str,
    },
    /// external source set 出现相同 `(source_kind, resource_ref)`。
    DuplicateExternalSource {
        /// 重复来源的类别。
        source_kind: ExternalSourceKind,
        /// 重复来源的 opaque ref。
        resource_ref: ResourceRef,
    },
    /// safe summary set 出现相同 `(source_kind, summary_ref)`。
    DuplicateSafeSummary {
        /// 重复摘要的来源类别。
        source_kind: ExternalSourceKind,
        /// 重复摘要的 opaque ref。
        summary_ref: ResourceRef,
    },
    /// forbidden-body marker set 出现重复 marker。
    DuplicateExternalBodyMarker {
        /// 重复的 marker。
        marker: ExternalBodyMarker,
    },
    /// captured material key set出现重复opaque key。
    DuplicateCapturedMaterialKey,
    /// observability signal kind set为空。
    EmptyObservabilitySignalKindSet,
    /// observability signal kind set出现重复finite kind。
    DuplicateObservabilitySignalKind {
        /// 重复出现的signal kind。
        signal_kind: ObservabilitySignalKind,
    },
    /// handoff receipt的target kind、target source、receipt source或identity关系不合法。
    HandoffReceiptRelationInvalid {
        /// receipt声明服务的closed target kind。
        target_kind: HandoffTargetKind,
    },
    /// generic Sandbox object ref 不能安全恢复为请求的 named ref。
    WrongObjectRefKind {
        /// 目标 named ref 要求的 kind。
        expected: SandboxObjectRefKind,
        /// generic ref 实际携带的 kind。
        actual: SandboxObjectRefKind,
    },
    /// generic object ref 的 kind 不允许作为业务 audit subject。
    InvalidTraceSubjectKind {
        /// 被拒绝的 object kind。
        actual: SandboxObjectRefKind,
    },
    /// page / repository cursor 无法按对应 owner 的 opaque contract 验证。
    InvalidCursor {
        /// cursor 所属 surface，而不是原始 cursor 内容。
        owner: &'static str,
    },
}
```

| constructor / validation | exact `ContractError` | caller-safe mapping 候选 | 说明 |
|---|---|---|---|
| `SandboxReason::try_new` | `EmptyText { field: "sandbox_reason" }` | `Validation` | 不回显空值或 raw input。 |
| digest `try_from_encoded` | `EmptyText` / `InvalidDigestEncoding` | `Validation` | 本批不验证算法可用性或重新计算 digest。 |
| committed cursor constructor | `ZeroCommittedCursor` | `Internal` | public request 不应直接构造 committed cursor。 |
| `ExternalSourceRefSet::try_new` | `DuplicateExternalSource` | `Validation` | 不自动选择 source version。 |
| `SafeSummaryRefSet::try_new` | `DuplicateSafeSummary` | `Validation` | 不自动丢弃重复摘要。 |
| `ForbiddenExternalBodyMarkerSet::try_new` | `DuplicateExternalBodyMarker` | `Validation` | forbidden marker 非空时的业务处置由 owner guard 决定。 |
| `CapturedMaterialKeySet::try_new` | `DuplicateCapturedMaterialKey` | `Validation` 或 `Internal` | adapter / repository mapper不得自动去重或选择latest。 |
| `ObservabilitySignalKindSet::try_new` | `EmptyObservabilitySignalKindSet` / `DuplicateObservabilitySignalKind` | `Validation` 或 `Internal` | set shape由contracts拥有；mandatory `Audit`与source relation仍由domain owner校验。 |
| `HandoffReceiptRef::try_from_adapter` | `HandoffReceiptRelationInvalid` | `Validation` 或 `Internal` | target / receipt source kind必须匹配且identity不碰撞；不证明下游formal truth。 |
| named `*Ref::try_new` / `SandboxObjectRef::try_new` | `EmptyResourceRef` | `Validation` 或 `Internal` | 取决于 ref 来自 public input 还是 repository invariant。 |
| `TryFrom<SandboxObjectRef> for XxxRef` | `WrongObjectRefKind` | `Validation` 或 `Internal` | repository / mapper 必须有 52/52 wrong-kind tests。 |
| `SandboxTraceSubjectRef::try_from_object_ref` | `InvalidTraceSubjectKind` | `Validation` | guard / view / audit-self / application helper 不能成为 subject。 |
| page / repository cursor decoder | `InvalidCursor` | `Validation` | 不保存或暴露原始 cursor 内容。 |

`ContractError` 不包含字符串形式的 `message`、`raw_value`、`source_error` 或 `backtrace`。内部模块可以记录受控 cause chain，但 public mapper 只能输出固定 kind、`SandboxReason` 和 trace identity。

### 13.3 `SandboxPublicErrorKind`

```rust
/// Sandbox public protocol 可稳定暴露的 caller-safe error category。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxPublicErrorKind {
    /// request、selector、typed ref、cursor 或字段组合无效。
    Validation,
    /// 必需 external source / safe summary 当前不可解析。
    ReferenceUnresolved,
    /// 输入或中间结果试图携带禁止入仓的外部正文。
    ForbiddenExternalBody,
    /// actor / authority 不允许执行所请求操作。
    NotAuthorized,
    /// 调用方不能获知目标是否存在或读取其内容。
    NotVisible,
    /// optimistic repository version 冲突。
    VersionConflict,
    /// 同一 idempotency key 对应不同 operation 或 request fingerprint。
    IdempotencyConflict,
    /// duplicate 已完成记录缺少 replayable stored result；不得重跑。
    DuplicateMissingResult,
    /// coherent boundary 被拒绝、不支持、失败或无法验证。
    BoundaryRejected,
    /// policy / authorization 缺失、冲突、不支持、过期或 high-risk 未获允许。
    PolicyFailClosed,
    /// 必需 infrastructure adapter 当前不可用。
    AdapterUnavailable,
    /// inbound schema / protocol version 不受支持。
    UnsupportedVersion,
    /// inbound event / material 因 source、schema 或安全问题被隔离。
    Quarantined,
    /// 对应 adapter 或 surface 被 validated configuration 禁用。
    Disabled,
    /// query / read-only path 试图触发 mutation。
    NoWriteViolation,
    /// 未能安全映射的内部错误；只能返回脱敏 reason 和 trace。
    Internal,
}
```

### 13.4 Public mapping invariants

| invariant | 规则 |
|---|---|
| exhaustive | 每个object-owned error enum以及`ApplicationError`、`InfraError`、`ApiError`、`WorkerError`、`JobsError`的variant必须在owning batch提供显式mapper；不得 `_ => Internal` 静默吞掉新增variant。 |
| safe reason | public reason 必须由固定 template 或已脱敏 `SandboxReason` 形成；不得直接使用 `Display` of raw cause。 |
| retryable owner | `retryable` 由 exact internal variant + protocol family 决定，不由 public kind 单独推导。例如 `AdapterUnavailable` 在 query 可 degraded，在 command launch 可 fail-closed。 |
| visibility | authorization / existence ambiguity 对 Query 使用 `NotVisible`；不得通过 `Validation`、`ReferenceUnresolved` 或 source ref 暴露存在性。 |
| duplicate | `DuplicateMissingResult` 永不触发 recompute；`IdempotencyConflict` 永不覆盖 existing record。 |
| boundary / policy | `BoundaryRejected` 与 `PolicyFailClosed` 不能映射为 degraded launch success。 |
| no-write | `NoWriteViolation` 是实现 / wiring 错误面，必须审计并阻断 mutation，不是业务 empty result。 |
| internal | `Internal` 不携带 SQL、IO path、HTTP body、SDK response、panic、secret 或外部正文。 |

public error DTO、HTTP / RPC / event transport mapping、retry-after、redaction marker 和 trace field schema 均留给回归后的 Step 8；error recovery / rollback / alert / operator handoff 留给 Step 12 回归。本节只固定跨协议必须稳定的 category。

---

## 14. Historical material 与 rename / invalidation ledger

### 14.1 效力规则

原 Step 6~10 已审查内容保留为 `historical_material`，用于定位消费者和回归差集，不再拥有任何 current type 定义权。下表的 `historical_invalid` 项必须被下游逐处改写；禁止通过 `type Old = New`、deprecated alias、双 re-export 或 serde alias 维持两套名称。

### 14.2 Shared carrier / ref invalidation

| historical name / pattern | 状态 | canonical replacement / owner | 原因 | downstream action |
|---|---|---|---|---|
| `SandboxOpaqueId` | historical_invalid | named `*Ref` wrapping core `ResourceRef` | 无法阻止跨对象错型读取。 | Step 7 repository / port 全部改为 named ref。 |
| `SandboxOpaqueRef` | historical_invalid | 按角色选择 named local ref、`ExternalSourceRef`、`SafeSummaryRef`、core `ResourceRef` 或后续 typed lifecycle ref | 混合 local object、external source、receipt、cursor、profile 与 target。 | `6R-02~05` 逐字段分类；Step 7/8 禁止继续出现。 |
| `SandboxTypedRef` | historical_invalid | `SandboxObjectRef` + 52 个 named wrapper | 旧 `{ id }` 不携带 kind，generic -> named 无法 reject。 | 52/52 wrong-kind conversion tests。 |
| `SandboxInstant` | historical_invalid | core `Timestamp` | 重复 core time contract。 | 对象、DTO、job / adapter 全部改用 exact core type。 |
| `SandboxOperationName` | historical_invalid | core `OperationName` + §11 closed selector | metadata identity 与 dispatch selector 被混为一体。 | Step 8 定义 selector -> `OperationName` 显式映射。 |
| `SandboxRepositoryVersion` | historical_invalid | core `Version` | 重复 optimistic version carrier。 | Step 7 repository compare-and-set 使用 `Version`。 |
| 泛化 `SandboxDigest` | historical_invalid | request 使用 core `RequestPayloadFingerprint`；source / material 使用各自 digest | 三种 digest 语义与算法成熟度不同。 | 禁止 compatibility wrapper。 |
| `Vec<ResourceRef>` 作为 Sandbox repository key | historical_invalid_pattern | 对应 named `*Ref` / ordered typed set | generic ref 绕过 kind 与集合不变量。 | Step 7 signature 差集必须为 0。 |

### 14.3 Kind rename / split

| historical name / variant | 状态 | canonical replacement | 修正理由 |
|---|---|---|---|
| `CapturedMaterialKind` | historical_invalid_name | `MaterialKind` | `CapturedMaterialRef.material_kind` 已明确该 enum 只表达 material role；避免 type 与 owning object 同词重复。 |
| `MaterialKind::FileDigest` | historical_invalid_variant | `MaterialKind::OutputFile` + `SandboxMaterialDigest` 字段 | file 是 material 类别，digest 是独立完整性 carrier，不能混为 variant。 |
| `SecurityRedlineKind` | historical_invalid_name | `RedlineKind` | 正式 `03` 历史消费者已使用短名；canonical enum 新增 host access / host bypass 红线。 |
| `HandoffTargetKind::Relay` | historical_invalid_variant | `HandoffTargetKind::EventRelay` | 与 material relay / event relay 语义歧义。 |
| 7 项旧 `BoundaryLimitKind` | historical_incomplete | §11.2 的 10 项 closed set | 正式边界还包含 workspace、mount、lifecycle，不能只列 CPU / memory / time / IO / FS / network / process。 |
| 任意 backend-specific kind | historical_invalid_pattern | `BoundaryLimitKind` + `6R-02` typed requirement / adapter mapping | backend 产品能力不是 domain kind。 |

### 14.4 Status rename / split

| historical name | 状态 | canonical owner | 迁移说明 |
|---|---|---|---|
| `ReferenceResolutionStatus` | historical_invalid_split | `ExecutionContextResolutionStatus`;`ContextReferenceResolutionStatus`;`ReferenceResolutionStateStatus` | 旧 enum 同时服务三种主语且 variant 不一致；必须按字段主语选择，禁止 alias。 |
| `BoundaryDecisionStatus` | historical_invalid_name | `BoundaryEstablishmentDecisionStatus` | owner 名与对象完全一致，避免把 coherent boundary state 混入 decision。 |
| `BoundaryCoherenceStatus` | historical_invalid_name | `CoherentBoundaryStatus` | 以 owning object `CoherentBoundary` 命名。 |
| `BackendCapabilityStatus` | historical_invalid_name | `BackendCapabilitySummaryStatus` | 本仓只拥有 summary snapshot，不拥有 backend capability truth。 |
| `IsolationHandleStatus` | historical_invalid_name | `IsolationEnvironmentHandleStatus` | 与 owning object exact match。 |
| `CaptureStatus` | historical_invalid_name | `CaptureFactStatus` | 与 owning fact exact match；旧 `Pending` 被删除。 |
| `CapturedMaterialRefStatus` / 未命名 material status | historical_invalid_name | `CapturedMaterialStatus` | 独立于 capture fact 和 handoff fact。 |
| `ObservabilityHandoffStatus` | historical_invalid_name | `ObservabilityMaterialStatus` | 状态 owner 是 material，不是外部 observability truth。 |
| `HandoffStatus` | historical_invalid_name | `HandoffFactStatus` | 与 owning fact exact match；不再混入 relay dead-letter。 |
| `LeaseStatus` | historical_invalid_name | `LeaseRecordStatus` | 与 owning record exact match。 |
| `OrphanRecoveryStatus` | historical_invalid_name | `OrphanRecoveryRecordStatus` | 与 owning record exact match。 |
| `DerivedFreshnessStatus` | historical_invalid_name | `DerivedInspectPreviewTrendStatus` | 防止 comparison / reconciliation 共享同一模糊 freshness owner。 |
| `SandboxProjectionStatus` | historical_invalid_name | `SandboxReadProjectionStatus` | 明确 read projection，不是任意 projection。 |
| `ReconciliationReportStatus` | historical_invalid_name | `SandboxReconciliationReportStatus` | public / repository consumer 统一完整 owner 名。 |
| `EventRelayStatus` | historical_invalid_name | `SandboxEventRelayStatus` | 明确 Sandbox-owned relay record；`Delivered` 改为 `Published`。 |
| `IdempotencyRecordStatus` | historical_invalid_name | `SandboxIdempotencyRecordStatus` | 与 owning record exact match。 |
| `StoredResultStatus` | historical_invalid_name | `SandboxStoredOperationResultStatus` | 与 owning record exact match。 |
| `ConsumerReceiptStatus` | historical_invalid_name | `SandboxConsumerReceiptStatus` | 统一 public surface，并补 `NoOp`。 |
| `JobReportStatus` | historical_invalid_name | `SandboxJobReportStatus` | 统一 public surface，并补 `DuplicateReplayed`。 |
| `ReconciliationReportStatus` 与 `SandboxReconciliationReportStatus` 并存 | historical_conflict | 只保留后者 | 不提供 alias。 |
| `ConsumerReceiptStatus` 与 `SandboxConsumerReceiptStatus` 并存 | historical_conflict | 只保留后者 | 不提供 alias。 |
| `JobReportStatus` 与 `SandboxJobReportStatus` 并存 | historical_conflict | 只保留后者 | 不提供 alias。 |

### 14.5 Error invalidation

| historical error | 状态 | canonical replacement | 迁移约束 |
|---|---|---|---|
| 9 项旧 `SandboxPublicErrorKind` (`InvalidRequest` / `Blocked` / `Unavailable` / `Duplicate` / `Failed` 等) | historical_invalid | §13.3 的 16 项 caller-safe kind | Step 8/12 已审查的细分集合优先；禁止 alias 或“旧 kind + message”兼容。 |
| `DomainError::InvalidStateTransition` 泛化占位 | historical_invalid_pattern | `6R-02~04` 每对象 exact transition error | error 必须携带 owner ref、from/to 与 guard 原因；不能靠字符串解释。 |
| raw adapter / repository error 直接 public | historical_invalid_pattern | `InfraError` / `ApplicationError` -> explicit public mapper | 禁止 `to_string()` 进入 public reason。 |
| `_ => SandboxPublicErrorKind::Internal` | historical_invalid_pattern | exhaustive per-variant mapper | 新错误未映射必须编译失败或 closure audit 失败。 |

### 14.6 Downstream historical consumer inventory

| historical consumer | 当前效力 | 回归时必须完成 |
|---|---|---|
| 原 `03_ddd_step_06_object_contracts.md` §1~§27 | historical_material | `6R-02~07` 逐对象 / 字段 / callable 回填 canonical 名；旧 schema 不直接修改为 current。 |
| 原 Step 7 trait / port / adapter | historical_reviewed_revalidation_pending | repository / port typed ref、core reuse、status / kind、error owner 全量差集为 0。 |
| 原 Step 8 protocol | historical_reviewed_revalidation_pending | 55 logical name 保留；DTO 中所有 opaque ref / old status / old public error 逐字段替换。 |
| 原 Step 9 flow | historical_reviewed_revalidation_pending | flow 只调用回归后 exact callable；不再引用泛化 `DomainError` / old status。 |
| 原 Step 10 state matrix | historical_reviewed_revalidation_pending | 每个 matrix 绑定本节唯一 enum 和对象 exact transition error。 |
| Step 11~18 | downstream_impact_revalidation_pending | 仅在 Step 6~10 顺序回归后做影响回查。 |
| 正式 `03-详细设计.md` | historical_reviewed_invalidated_by_design_reopen | 回归后 Step 19 重装配；当前禁止直接修补。 |
| 正式 `04~07` | downstream_revalidation_pending | 正式 `03` 重装配并审查后定向重验。 |

本 ledger 不要求当前修改这些历史文件。它把所有已发现的旧名称变成显式 migration obligation；后续批次若发现未登记旧名，必须先回到本表追加记录，再修改消费者。

---

## 15. `6R-01` closure audit

### 15.1 Registry uniqueness audit

| audit ID | 检查 | 设计结果 | 证据位置 | 后续义务 |
|---|---|---|---|---|
| `6R01-AUD-REG-001` | current shared type 是否都有唯一 canonical section | pass_for_6R01 | §8 registry -> §9~§13 | `6R-02~05` 只能引用，不得复制定义。 |
| `6R01-AUD-REG-002` | canonical registry 同名重复 | 0 | §8.2~§8.8；§14 同义名全部 historical invalid | `6R-06` 再对所有对象分件做全局差集。 |
| `6R01-AUD-REG-003` | unresolved current shared type | 0 | core reuse、shared carrier、ref、kind、status、error 均有 owner | 对象正文中的 support carrier 仍按 registry 留在 `6R-02~05`。 |
| `6R01-AUD-REG-004` | 是否提前定义 object body / trait / DTO / flow / matrix | 0 项越界 | 本文件只含 shared vocabulary 与后续 owner reservation | Step 7/8/9/10 继续 blocked。 |
| `6R01-AUD-REG-005` | historical material 是否可能继续充当 current truth | contained | §14 明确 invalid / revalidation pending | 禁止 compatibility alias。 |

### 15.2 Core reuse audit

| 检查 | 结论 | 说明 |
|---|---|---|
| exact export 可检索 | pass_for_design_input | 2026-07-18 已读取 `/home/aris/Projects/quantalithos-core/crates/contracts/src/actor.rs`、`metadata.rs`、`lib.rs`。 |
| required exact type | 16 个均可检索 | `ActorRef`;`ActorContext`;`ActorKind`;`RequestOrigin`;`RequestId`;`RequestMetadata`;`TraceId`;`Timestamp`;`IdempotencyKey`;`OperationName`;`RequestPayloadFingerprint`;`ResourceRef`;`JobRunId`;`PageToken`;`PageRequest`;`Version`。 |
| local duplicate wrapper | 0 个 current | `SandboxInstant`、`SandboxOperationName`、`SandboxRepositoryVersion` 等已失效。 |
| core string newtype non-empty guarantee | core 不提供 | Sandbox-owned combination / typed-ref constructor 和 custom `Deserialize` 必须补检；不能把 core 可构造等同于本仓合法。 |
| implementation revision / compatibility | 未固定 | `BLK-SBX-VERSION-001` 仍由 implementation Activation Gate 关闭；本轮不伪造 dependency commit。 |

### 15.3 Typed ref closure

| audit | expected | actual design | 差集 / 结论 |
|---|---:|---:|---|
| `SandboxObjectRefKind` variants | 52 | 52 | 0 |
| named wrapper declarations | 52 | 52 | 0 |
| kind -> named wrapper 一一对应 | 52 | 52 | 排序差集 0 |
| named -> generic conversion | 52 | macro 固定生成 52 | design contract covered |
| generic -> named wrong-kind rejection | 52 | macro 固定生成 52 | design contract 52/52；尚无实现测试结果 |
| named / generic deserialize non-empty guard | 53 | 52 named + 1 generic 均走 `try_new` | design contract covered |
| repository generic read allowance | 0 | 明确禁止 | Step 7 signature audit 必须复核 |
| external / safe-summary / material 与 local ref infallible conversion | 0 | 未定义且明确禁止 | pass_for_6R01 |

这里的 `design contract 52/52` 不是测试通过声明。实现阶段必须为 52 个 wrapper 生成 positive roundtrip、wrong-kind、empty constructor 和 empty deserialize case；在真实测试执行前不得写 `tested`、run id 或 evidence alias。

### 15.4 Shared carrier invariant audit

| carrier | private fields | fallible constructor | checked deserialize | duplicate / role guard | 结论 |
|---|---|---|---|---|---|
| `SandboxReason` | 是 | 是 | 是 | non-empty / caller-safe | pass_for_design |
| source / material digest | 是 | 是 | 是 | role split；`algorithm:value` | pass_for_design；算法 blocker open |
| truth / reference cursor | 是 | crate-only fallible | 是 | non-zero / role split | pass_for_design |
| `SandboxTraceContext` | 是 | 是 | 是 | core ids non-empty / no baggage | pass_for_design |
| `ExternalSourceRef` | 是 | 是 | 是 | source kind + ref identity；version/digest observation | pass_for_design |
| `ExternalSourceRefSet` | 是 | 是 | 是 | ordered unique；duplicate reject | pass_for_design |
| `SafeSummaryRef` / set | 是 | 是 | 是 | 与 source ref 不互转；duplicate reject | pass_for_design |
| forbidden-body marker set | 是 | 是 | 是 | duplicate reject；non-empty set 不可忽略 | pass_for_design |
| trace subject | 是 | 是 | 是 | 仅 27 个允许 kind；guard/view/audit-self/helper reject | pass_for_design |
| `SandboxRelayAttemptRef` | 是 | 是 | 是 | non-empty；不转`SandboxObjectRef`；不与handoff attempt互转 | pass_for_design；§8.5.1 overlay |

`SandboxSourceDigest` / `SandboxMaterialDigest` 的 algorithm selection、canonical writer 与 verifier 仍受 `BLK-SBX-CANONICAL-001` 约束。该 blocker 不阻塞 shared role / carrier 设计完成，但会阻塞受影响 implementation boundary Activation；本文件没有声称算法实现、fixture 或验证结果存在。

### 15.5 Kind / selector closure

| family | expected | actual | 差集 | 结论 |
|---|---:|---:|---:|---|
| shared semantic kind | 8 enum | 8 enum | 0 | owner 与 redline / fallback 规则已固定。 |
| Command selector | 10 | 10 | 0 | closed |
| Query selector | 13 | 13 | 0 | closed |
| Inbound Consumer selector | 9 | 9 | 0 | closed |
| Outbound Event selector | 13 | 13 | 0 | closed |
| Operations Job selector | 10 | 10 | 0 | closed |
| protocol logical name total | 55 | 55 | 0 | Step 8 不得新增 logical name。 |

所有 selector 都来自正式 `02` / HLD Step 7 已审查 closed logical name。没有从原 Step 8 route、topic、binary 名或历史 README 发明新入口。

### 15.6 Status / error closure

| audit | 结果 | 说明 |
|---|---|---|
| canonical status enum | 39 | 原38个owner保持不变；batch 5新增`HandoffTargetProgressStatus`，每个persisted / visible / public surface主语仍只有一个owner。 |
| resolution owner | 3 | intake context、intake ref、tracked ref 已拆分。 |
| public command / consumer / job status | 3 个完整 enum | 不再保留旧短名；public 与 persisted object state 分层。 |
| `EntryDisposition` | 1 个 finite outcome | 明确排除为 persisted state。 |
| `ContractError` | 14 个 exact variant | 覆盖空值、digest、cursor、重复集合、capture / observability carrier、handoff receipt、wrong-kind 和 trace subject。 |
| `SandboxPublicErrorKind` | 16 | 与历史 Step 8 / 12 已审查 mapping 集合一致。 |
| old status alias | 0 | §14 全部登记为 historical invalid，禁止 alias。 |
| generic domain transition error | 0 个 current definition | exact object error 留给 `6R-02~04`，不得用泛化占位。 |

### 15.7 Rust-facing documentation audit

| 检查 | 结果 | 说明 |
|---|---|---|
| public type / variant Rustdoc | pass_for_design_review | §9~§13 所有 public struct / enum / field / variant 均有中文职责注释。 |
| public constructor / accessor Rustdoc | pass_for_design_review | 所有列出的 public callable 均说明来源、返回与关键禁止事项。 |
| private wire/helper | allowed_private | private serde wire struct 不形成 public API；错误文本固定且不回显原值。 |
| English-only inherited Rustdoc | 0 个 current Sandbox public declaration | core type 自身文档由 core owner 管理，本文件只写中文复用说明。 |

### 15.8 Deferred boundary audit

| deferred item | owner / batch | 当前是否阻塞 `6R-01` | 门禁 |
|---|---|---|---|
| context / identity / boundary object body、factory、guard、exact transition error | `6R-02` | 已确认 | canonical contract 已闭合且已由用户确认，当前作为`6R-04` transitive upstream。 |
| policy / run / capture / material / handoff object contract | `6R-03` | 已确认 | batch 2~7均已闭合并获用户确认，当前作为`6R-04` direct upstream。 |
| failure / cleanup / read / projection / relay / audit object contract | `6R-04` | 已确认 | batch 1~7与§16.1~§16.10均已确认并由`6R-05`消费。 |
| application / infra / api / worker / jobs object contract and module errors | `6R-05` | completed_wait_user_review | application batch 1和infra batch 2已确认；API/worker/jobs batch 3已闭合并停审，用户确认前不得进入`6R-06`。 |
| full Step 6 object / field / factory / guard / transition / consumer difference | `6R-06` | 否 | blocked by `6R-05` batch 3 user review；unresolved 必须为 0。 |
| Step 6 主控回填与 Step 7 handoff | `6R-07` | 否 | blocked by `6R-06` review。 |
| trait / repository / adapter exact callable | Step 7 regression | 是，对 Step 7 | Step 6 全部回归并经用户确认。 |
| DTO / protocol mapping | Step 8 regression | 是，对 Step 8 | Step 7 regression confirmed。 |
| flow / state matrix | Step 9 / 10 regression | 是，对相应 step | 严格按上一步确认推进。 |

### 15.9 Blocker conclusion

| blocker | 当前状态 | 是否为新上游 blocker | 影响 |
|---|---|---|---|
| `SBX-DDD-GRANULARITY-REOPEN-001` | open | 否，DesignReopen 主 blocker | 阻塞正式 `03` implementation baseline、`04~07` 当前下游效力和 implementation Activation。 |
| `SBX-DDD-GRANULARITY-STEP6-001` | open_6r_05_batch_3_completed_wait_user_review | 否 | batch 3 entry contract已闭合；等待用户审查，随后才可进入`6R-06`，仍须串行完成`6R-06~07`，Step 7继续blocked。 |
| `SBX-DDD-VIEW-OWNER-6R03-001` | resolved_in_6r03_batch_6_revalidated_batch_7 | 否，Step 6内部诊断 | contracts-owned carrier overlay、constructor error与view字段依赖已闭合；不新增registry ID或第二套projection carrier。 |
| `SBX-DDD-CONTRACTS-FILE-6R03-001` | resolved_in_6r03_batch_7 | 否，Step 4 / Step 6内部冲突已关闭 | Step 4与Step 6统一由既有`refs.rs`承接shared enum / marker；current未规划路径差集为0，禁止实现者新增module。 |
| `BLK-SBX-CANONICAL-001` | open | 否，既有 implementation design gate | canonical writer / verifier 未选型；不阻塞 carrier role 设计，阻塞相关 implementation boundary Activation。 |
| `BLK-SBX-VERSION-001` | open | 否，既有 implementation precheck | exact core revision / compatibility 未固定；当前只记录工作区可检索性。 |
| 新 L1 / L2 semantic blocker | none_found | 否 | 当前缺口均为 Sandbox 详细设计内部回归工作。 |

### 15.10 Batch gate

| gate | 结论 |
|---|---|
| canonical registry / core reuse | pass_for_6R01 |
| shared carrier exact contract | pass_for_6R01 |
| 52 named typed refs | pass_for_6R01 |
| kind / 55 selector | pass_for_6R01 |
| 39 status owner / public surface split | pass_for_6R01_plus_6R03_batch5 |
| contract / public error owner | pass_for_6R01 |
| historical invalid / downstream obligations | pass_for_6R01 |
| `6R-01` review | 已确认并被 `6R-02~04` 消费。 |
| `6R-03` batch 7 | closure audit已完成并获用户确认。 |
| `6R-04` batch 6 / §16.10 | 本行记录§16.10对象停审时的历史快照；该对象随后已由batch 7消费。 |
| contracts path blocker | `SBX-DDD-CONTRACTS-FILE-6R03-001 resolved_in_6r03_batch_7`；current path差集为0。 |
| 是否允许进入 Step 7 | 否，Step 6 `6R-05~07` 尚未完成。 |
| 是否允许修改正式 `03~07` | 否。 |
| implementation | `CB-SBX-01A blocked / wait_design`。 |
| commit | 不需要；用户未要求。 |

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-04
historical_batch = batch_6_audit_relay_views_reconciliation
step_status = in_progress
historical_batch_status = in_progress
historical_gate_status = completed_wait_user_review
historical_current_object = §16.10 SandboxReconciliationReport
historical_object_gate_status = completed_wait_user_review
historical_next_allowed_action = wait_user_review_before_batch_7
named_types = 28/28
support_families = 13/13
step_7 = blocked_by_step_6_regression
implementation = CB-SBX-01A blocked / wait_design
```

上述代码块是§16.10对象停审时的历史快照，不再表示current recovery；当前入口只以§16为准。

## 16. Current recovery override after `6R-04` batch 7

本节覆盖本文前方的历史批次快照。`6R-01` shared registry本身已确认并被`6R-04`消费；当前只记录
batch 7对其进行的跨对象复核结果，不重新定义shared type、kind、status或error。

| current check | result | fact boundary |
|---|---|---|
| typed-ref kind / wrapper | `52 / 52`, unresolved `0` | 设计文本静态对账，不是编译结果 |
| shared status owner | `39 / 39`, unresolved `0` | 不提前改写Step 10 historical状态清单 |
| `S6T-04-*` registry | `15 / 15`, unresolved `0` | owner与section唯一，不产生实现路径 |
| planned contracts paths | `10 / 10`, unresolved `0` | 只确认Step 4 planned tree，未创建新文件 |
| Rustdoc / fence | unresolved `0` | 不等同于rustdoc编译或lint结果 |

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-04
current_batch = 6R-04 batch 7 closure audit
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
next_allowed_action = wait_user_review_before_6R_05
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

## 20. Entry batch 3 closure snapshot

本节记录entry batch 3闭合快照，覆盖§17~§19及§18的历史内容效力，但物理文件末尾的§21才是
唯一current recovery override。本节不改变其中
application/infra已确认内容。`6R-05` batch 3已消费shared status/error owner并闭合application
maintenance carrier、API/worker/jobs stable carrier与三类entry error；当前停在用户审查点，不得创建或
进入`6R-06`。

| registry / owner | current result | downstream revalidation obligation |
|---|---|---|
| `S6T-05-003` | 新增6项application maintenance carrier；application detail current 41/41 exact once | Step 7定义maintenance facade exact callable，不得让jobs扫描repository或补造item outcome |
| `S6T-05-006` | API 3类carrier + `ApiError` 7/7闭合 | Step 7/8按command/query/error分别消费，不得用generic outcome mapper |
| `S6T-05-007` | worker kind/context/receipt/2 loop results + `WorkerError` 12/12闭合 | Step 7/9保持4-command + 1-relay allow-set，不承接tools/runtime semantic loop |
| `S6T-05-008` | job context/full-batch accumulator/exit disposition + `JobsError` 17/17闭合 | Step 7~9保留完整batch/item/continuation，duplicate使用replay-only accumulator |
| shared status owner | 39/39 unchanged | entry新增transient `SandboxMaintenanceItemStatus`，不计入persisted/public status owner清单 |
| actor authority | worker/job P0 system-only | historical Step 8 `Maintenance/operator-scoped`差异待Step 8回归，不新增core kind |

这里的闭合是设计静态结果，不是Rust编译、测试、运行、provider probe、evidence或验收事实。新的L1/L2
blocker为0；既有implementation blocker保持open，`CB-SBX-01A`保持`blocked / wait_design`。

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-05
current_batch = 6R-05 batch 3 API/worker/jobs
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
object_gate_status = entry_contract_closed_wait_review
next_allowed_action = wait_user_review_before_6R_06
application_error_detail_mapping = 41/41_exact_once
api_error_mapping = 7/7_exact_once
worker_error_mapping = 12/12_exact_once
jobs_error_mapping = 17/17_exact_once
historical_consumer_delta = 16/16_registered
shared_status_owner = 39/39_unchanged
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

上述§17~§19和§18继续保留各批历史停点；current恢复以物理文件末尾§21为准。

上述代码块保留 `6R-04` batch 7 完成时的历史停点，不再表示 current recovery。

## 17. Current recovery override after `6R-05` application batch 1

本节覆盖 §1、§15.8~§16 中仍停留在 `6R-04` 的历史快照。`6R-05` application batch 1
已经消费 shared registry，并将以下 current owner 回写到 §8.6、§12.1、§12.8 和 §13.1：

| current owner | current result | downstream revalidation obligation |
|---|---|---|
| application context | `SandboxServiceCallContext` / `SandboxOperationChannel` exact factory closed | Step 7/8 不得从 route、topic或binary name猜 operation/channel |
| idempotency record | persisted status only `Reserved | Completed | Failed` | Step 7/10/13 必须移除持久化 `Duplicate/Conflict` 和 channel-based duplicate identity |
| stored operation result | persisted status only `Completed | Rejected | Failed`;surface mandatory | Step 7/8/10/11 必须把 `Unavailable` 改为 lookup integrity error |
| application error | `ApplicationErrorDetail -> ApplicationErrorKind -> SandboxPublicErrorKind` exhaustive | Step 7/10/12 不得继续使用 generic `Domain`、raw port error或 wildcard fallback |
| service outcome / query access | 不新增第二identity；stored surface与call context提供identity、closed set、access/final-surface split | Step 7~10 必须重验 outcome shape、query no-write和surface mapping |
| checked deserialize | idempotency record、stored surface ref、stored operation result均经private wire回到唯一validator/constructor | Step 7/11 durable adapter不得直接写private field或绕过unknown-field拒绝 |

application error detail静态对账为37/37且每项恰好映射一次；current application contract中
`SandboxServiceOutcomeRef`、`SandboxQueryAccessDecisionRef`和generic domain error union均为0。
以上结论是设计文本 contract closure，不是 Rust 编译、测试、持久化迁移或运行结果。
infra、API、worker、jobs carrier 尚未进入本批，`S6T-05-004~008` 和对应 module error 继续
`pending`。

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-05
current_batch = 6R-05 batch 1 application context / replay
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
next_allowed_action = wait_user_review_before_6R_05_batch_2_infra
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

## 19. Current recovery override after infra batch 2 review

本节覆盖§18的恢复叙述，但不改变§18中infra contract的已确认内容。用户已确认infra batch 2，
`S6T-05-006~008`与`S6T-05-011`中的entry error当前进入正文补齐；在batch 3完成前仍保留
`in_progress`，不得提前标记registry闭合。

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-05
current_batch = 6R-05 batch 3 API/worker/jobs
batch_status = in_progress
gate_status = in_progress
next_allowed_action = complete_6R_05_batch_3_api_worker_jobs_then_stop_for_review
shared_status_owner = 39/39_unchanged
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

上述§17正文与代码块保留application batch 1完成时的历史停点，不再表示current recovery。

## 18. Current recovery override after `6R-05` infra batch 2

本节覆盖§1、§15.8~§17中的旧恢复叙述。infra batch 2已经消费shared registry，并把current owner
回写到§8.6和§13.1；shared status owner总数仍为39，不因infra-private outcome enum或application
establishment disposition增加lifecycle status。

| current owner | current result | downstream revalidation obligation |
|---|---|---|
| application establishment port result | `IsolationEnvironmentEstablishmentResult` / disposition登记到`S6T-05-003` | Step 7必须移除application trait对infra outcome的依赖，并保留partial environment cleanup obligation |
| config / binding identity | three typed refs + 18-slot binding set | Step 14/Step 7不得暴露raw config、endpoint、topic、path、secret或40组/101项配置 |
| activation / startup availability | activation只`Required | Disabled`；18/18 availability exact coverage | selected projection/derived/reference constructor失败必须startup blocked；post-publication degraded另行表达 |
| runtime summary | LD-17 bootstrap与LD-22 disposition分离；LD-24独立原子发布 | Step 10/14不得把summary当generation publication truth |
| establishment adapter outcome | 4/4 branch，只承接environment establishment | run launch与inspect/release继续分别使用既有typed lifecycle observation |
| handoff adapter outcome | 3/3 branch，绑定exact persisted target attempt + generation | Step 7/9/10必须先形成domain observation，再由`apply_target_observation`接受 |
| publisher adapter outcome | `Published/Retryable/DeadLetter` 3/3，无generic `Failed` | Step 7/9/10必须先形成relay observation，再由`apply_delivery_observation`接受 |
| infra error | 18/18 exact variant -> application detail -> public kind | Step 9/12移除`OutcomeClassificationMissing` / `RuntimeBuilderFailed`及wildcard mapping |

设计静态闭合结果为adapter kind 18/18、activation kind 2/2、availability coverage 18/18、
`InfraError` mapping 18/18、historical consumer delta 10/10。以上不是Rust编译、测试、startup、
generation publication、provider probe或runtime evidence。API/worker/jobs仍未进入current object batch，
`S6T-05-006~008`与`ApiError/WorkerError/JobsError`继续pending。

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-05
current_batch = 6R-05 batch 2 infra
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
next_allowed_action = wait_user_review_before_6R_05_batch_3_api_worker_jobs
adapter_kind = 18/18
activation_kind = 2/2_required_or_disabled
availability_coverage = 18/18
infra_error_mapping = 18/18_exact_once
shared_status_owner = 39/39_unchanged
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

## 21. Entry batch 3 completion snapshot

本节保留entry batch 3完成时的阶段性恢复快照，不再表示current recovery。`S6T-05-003/006/007/008/011`已按batch 3闭合；application error detail为
41/41，`ApiError/WorkerError/JobsError`分别为7/12/17项exact mapping。worker/job P0保持
system-only；historical Step 8 `Maintenance/operator-scoped`差异只登记为后续回归义务。

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-05
current_batch = 6R-05 batch 3 API/worker/jobs
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
object_gate_status = entry_contract_closed_wait_review
next_allowed_action = wait_user_review_before_6R_06
application_error_detail_mapping = 41/41_exact_once
api_error_mapping = 7/7_exact_once
worker_error_mapping = 12/12_exact_once
jobs_error_mapping = 17/17_exact_once
historical_consumer_delta = 16/16_registered
shared_status_owner = 39/39_unchanged
new_l1_l2_blocker = 0
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

该停点已获用户确认并由`6R-06`消费。

## 22. Current recovery override for `6R-06`

本节位于物理文件末尾，是本文唯一current recovery source。前方§16~§21中的恢复代码块均为
historical snapshot；69-row registry、52 typed refs、39 shared status owner与error layering当前只作为
`6R-06`审计输入，不提前宣称Step 6整体通过。

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-06
current_batch = 6R-06 full closure audit
batch_status = in_progress
gate_status = in_progress
next_allowed_action = complete_6R_06_then_stop_for_review
upstream_6R_05 = review_confirmed
registry_expected_rows = 69
shared_status_owner = 39/39_unchanged
typed_ref_kind_wrapper = 52/52_unchanged
new_l1_l2_blocker = 0
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

`6R-06`完成后必须停审；用户确认前不得进入`6R-07`，不得修改正式`03~07`或任何
implementation boundary状态。

上述§22是`6R-06`执行中的恢复快照，已由物理末尾§23覆盖；其69-row registry、52 typed refs、
39 shared status owner和error layering内容继续有效。

## 23. Current recovery override after `6R-06` closure audit

本节位于物理文件末尾，是本文唯一current recovery source。`6R06-A~F`已完成设计文本静态闭合；
该结果不表示Rust编译、测试、运行或验收通过，也不关闭Step 6。`6R-07`仍须在用户确认后单独执行。

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-06
current_batch = 6R-06 full closure audit
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
next_allowed_action = wait_user_review_before_6R_07
upstream_6R_05 = review_confirmed
registry_rows = 69/69
shared_status_owner = 39/39
typed_ref_kind_wrapper = 52/52
guard_contract = 12/12
mutable_status_owner_callable = 20/20
cross_object_forward_helper = 10/10
historical_consumer_later_owner = 4/4
downstream_boundary_overlay = 11/11
static_audit_unresolved = 0
new_l1_l2_blocker = 0
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

当前只允许等待用户审查。未经确认不得进入`6R-07`、Step 7、正式`03~07`或实现仓。

上述§23是`6R-06`完成待审时的恢复快照，现已由物理末尾§24覆盖；其schema、registry和静态审计
结论继续有效。

## 24. Current recovery override after `6R-07` master assembly

本节位于物理文件末尾，是本文唯一current recovery source。用户已确认`6R-06`，其closure audit已由
`6R-07`消费；本文件§8的69-row registry仍是唯一registry master，§7及§9~§13仍是shared/core
canonical schema source。`6R-07`只建立authority索引与Step 7 handoff，没有在其他文件复制schema。

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-07
current_batch = 6R-07 master assembly and Step 7 handoff
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
next_allowed_action = wait_user_review_before_step_7_regression
upstream_6R_06 = review_confirmed_consumed_by_6R_07
registry_rows = 69/69
shared_status_owner = 39/39
typed_ref_kind_wrapper = 52/52
canonical_sources = 5/5
module_owners = 7/7
step_7_handoff_groups = 15/15
static_audit_unresolved = 0
new_l1_l2_blocker = 0
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

当前只允许等待Step 6用户审查。确认前不得进入Step 7 regression、修改historical Step 7正文、改动
正式`03~07`、implementation boundary skeleton或实现仓。

上述§24是Step 6完成待审时的historical recovery snapshot；§8 registry及§7、§9~§13 schema继续
有效，当前恢复点由物理末尾§25覆盖。

## 25. Current recovery override after Step 6 review confirmation

用户已确认Step 6，shared truth现由Step 7 regression `7R-M0`消费。Step 7只能按registry引用这些类型，
不得复制named ref、status、marker、view或error schema。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-M0
step_6_status = review_confirmed_consumed_by_7R_M0
registry_rows = 69/69
shared_status_owner = 39/39
typed_ref_kind_wrapper = 52/52
canonical_sources = 5/5
next_allowed_action = wait_user_review_before_7R_01_service_facades
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

Step 7 callable发现缺失类型时必须重开Step 6；禁止在application-local port helper伪造domain/shared替代类型。

## 26. `7R-02A` targeted cursor constructor visibility overlay

Step 7 `7R-02A`执行跨crate可编码性复核时发现：`SandboxTruthCursor`与
`SandboxReferenceCursor`由`contracts`唯一声明，但实现`SandboxUnitOfWork`的durable / fake adapter位于独立
`infra` crate；原`pub(crate) from_committed_sequence`无法被合法实现者调用，且方法名错误暗示构造动作本身
已经证明commit。该问题是已有carrier的constructor visibility缺口，不是新类型、状态、identity或上游项目
blocker。

本节定向覆盖§9.1的constructor spelling：两个类型统一使用
`pub fn try_from_sequence(u64) -> Result<Self, ContractError>`，继续执行non-zero checked construction。
公开可见只解决workspace crate边界；分配权仍唯一属于UoW。事务内reserved value可用于同一原子组的后续
staged relation，但只有commit confirmed后才成为可向后续read / relay / result暴露的committed cursor。
application service、repository、entry、DTO mapper和identity allocator直接调用均为禁止路径。

```text
current_consumer = Step 7 regression / 7R-02A completed
overlay_scope = cursor constructor visibility and neutral checked spelling only
registry_rows = 69/69 unchanged
shared_status_owner = 39/39 unchanged
typed_ref_kind_wrapper = 52/52 unchanged
cursor_family = 2/2 unchanged
new_l1_l2_blocker = 0
next_allowed_action = start_7R_02B
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
commit_required = no
```
