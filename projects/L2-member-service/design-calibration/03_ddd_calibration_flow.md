# L2-member-service 03-详细设计校准流程

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 目标正式文档: `projects/L2-member-service/03-详细设计.md`
> 模式: full-restart
> 创建日期: 2026-08-25

## 1. 本轮目标

把已停审的 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 继续转译成可供实现者 1:1 还原的详细设计契约。详细设计只展开实现单元、对象、trait / port / adapter、协议、函数级处理流、状态、事务、一致性、错误、并发、配置绑定、观测切口和实施交接；不重新定义需求、架构 owner 或概要设计的业务主语。

当前正式 `03-详细设计.md`、旧 `03` 中的对象 / 接口 / 状态 / 技术产品以及本目录未来可能存在的旧 Step 文件均属于 `historical_material`，不得直接继承其 completed、ready、positive contract 或实现事实。当前唯一正向设计输入是本项目正式 `00/01/02` 及其已通过的校准材料；兄弟项目尚未闭合的 exact contract 继续以 `pending / blocked / waiting / placeholder / fail-closed` 表达。

## 2. 权威输入与优先级

| 输入 | 级别 | 用途 |
|---|---|---|
| `projects/L2-member-service/00-需求文档.md` | 正式上游 | 仓定位、功能边界、项目型双锚、验收红线和非范围 |
| `projects/L2-member-service/01-架构设计.md` | 正式上游 | Host Truth Center、依赖方向、数据 owner、通信和一致性机制 |
| `projects/L2-member-service/02-概要设计.md` | 直接输入 | 七个 CMP、29 个对象、`IB-MS-001~017`、关键流、正交状态和异常骨架 |
| `design-calibration/02_hld_step_12_detailed_design_handoff.md` | 承接清单 | 03 的模块、对象、接口、流、状态、配置和回退边界 |
| `design-calibration/02_hld_step_13_risks_open_questions.md`、`02_hld_step_14_formal_document_assembly.md` | 风险与装配审计 | blocker、污染、追溯和非伪造门禁 |
| `standards/document/详细设计讨论流程_SOP.md` | 流程规范 | Step 1~19 的输入、输出和停审条件 |
| `standards/document/详细设计书写规范.md` | 正式结构规范 | 正式 03 的章节、字段 / 函数 / 图和可落码要求 |
| `standards/coding/rust.md`、目录组织规范 | 实现约束 | Rust 标识符 / rustdoc、crate / module / file 命名约束 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 交叉门禁 | metadata、DTO、状态、UoW、projection、artifact 和 phase boundary 闭环 |

### 2.1 Step 5~9 粒度与格式校准输入

本轮 Step 5~9 采用 `L1-governance` 对应校准文件的结构和审查粒度作为写作参考：

| 目标 Step | 对照材料 | 本仓必须保留的格式元素 | 不得继承的内容 |
|---|---|---|---|
| Step 5 | `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md` | 模块总览、逐模块职责 / 文件映射、依赖与 owner 审计、测试切口预告、Gate | Governance 模块和对象 |
| Step 6 | `projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md` | 批次表、对象归属、功能映射、对象卡、模块停审、字段 / 状态闭环 | Governance shared type、domain object、ready 结论 |
| Step 7 | `projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 接缝总览、逐 trait / port / adapter 卡、调用方 / 实现方、错误、fake parity、停审 | Governance port 名称和外部合同 |
| Step 8 | `projects/L1-governance/design-calibration/03_ddd_step_08_protocol_contracts.md` | protocol inventory、协议族分批、DTO 字段来源、构造闭环、错误 / 幂等 / metadata 审计 | Governance DTO 和 route / envelope 实现事实 |
| Step 9 | `projects/L1-governance/design-calibration/03_ddd_step_09_function_flows.md` | flow inventory、逐接口函数级调用图、事务 / 状态 / 副作用审计、每流停审 | Governance flow、外部 schema、执行证据 |

格式参考不改变本仓严格 `06 -> 07 -> 08 -> 09` 门禁；在当前 Step 6 模块停审前，不创建 Step 7~9 文件。

## 3. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | next_allowed_action |
|---|---|---|---|---|
| `03-详细设计.md` | Step 19 | formal_document_assembly | Step 19 = completed / pass_with_upstream_blockers；正式 03 已 full-restart 重建并完成审计 | 已停审；未经用户再次明确确认不得进入 `04-配置设计.md`。所有上游 pending / blocked / waiting / placeholder / fail-closed 保持不变。 |

正式 03 已完成写入并停审：

```text
formal_03_write_allowed = false_after_step_19_stop_review
formal_03_stop_review = completed
next_formal_document = 04-配置设计.md
next_formal_document_allowed = false_until_user_explicit_confirmation
```

## 4. Step 状态表

| Step | 主题 | 中间产物 | 状态 | Gate |
|---|---|---|---|---|
| 1 | 确认概要设计输入边界 | `03_ddd_step_01_input_boundary.md` | completed | pass_with_upstream_blockers |
| 2 | 明确本轮实现范围和非范围 | `03_ddd_step_02_scope.md` | completed | pass_with_upstream_blockers |
| 3 | 编码规范、语言 / runtime、仓库约束 | `03_ddd_step_03_runtime_constraints.md` | completed | pass_with_upstream_blockers |
| 4 | 实现单元与文件布局 | `03_ddd_step_04_module_layout.md` | completed_with_owner_correction | pass_with_upstream_blockers |
| 5 | 模块实现契约主轴 | `03_ddd_step_05_module_contracts.md` | completed_rebuild | pass_with_upstream_blockers |
| 6 | 逐模块对象实现契约 | `03_ddd_step_06_object_contracts.md` | completed / pass_with_upstream_blockers | domain CMP-MS-01~07、application、infra、api、worker、jobs object cards 与跨模块审计已完成 |
| 7 | Trait / Port / Adapter 契约 | `03_ddd_step_07_trait_port_adapter_contracts.md` | completed / pass_with_upstream_blockers | application-only port owner, infra adapter contract, fake parity and blocked external seams recorded |
| 8 | API / Command / Query / Event / Job 协议 | `03_ddd_step_08_protocol_contracts.md` | completed / pass_with_upstream_blockers | DTO、envelope、receipt、event、job inventory and construction closure recorded |
| 9 | 函数级处理流 | `03_ddd_step_09_function_flows.md` | completed / pass_with_upstream_blockers | per-interface function order, UoW, side effects and negative paths recorded |
| 10 | 状态机与转换矩阵 | `03_ddd_step_10_state_machine.md` | completed / pass_with_upstream_blockers | orthogonal state axes, legal transitions and forbidden inference recorded |
| 11 | 持久化、事务与一致性 | `03_ddd_step_11_persistence_tx_consistency.md` | completed / pass_with_upstream_blockers | logical store owner、UoW write-set、expected revision、cursor separation、outbox/projection/history consistency recorded; storage product and cursor exact type remain pending |
| 12 | 错误模型、异常分支与恢复 | `03_ddd_step_12_errors_recovery.md` | completed / pass_with_upstream_blockers | layered errors, stable dispositions, rollback/recovery and no-write rules recorded; exact transport codes remain pending |
| 13 | 并发、幂等与重入保护 | `03_ddd_step_13_concurrency_idempotency.md` | completed / pass_with_upstream_blockers | revision/fence/key/digest/replay/unknown and re-entry rules recorded; lease products and upstream delivery contracts remain pending |
| 14 | 配置引用与外部依赖绑定 | `03_ddd_step_14_config_dependencies.md` | completed / pass_with_upstream_blockers | typed binding and builder order fixed; concrete key/default/secret/product values remain pending for 04 |
| 15 | 可观测性与审计埋点 | `03_ddd_step_15_observability_audit.md` | completed / pass_with_upstream_blockers | log/metric/audit/trace/redaction cuts fixed; backend/SLO/retention remain out of scope |
| 16 | 测试切口与最小验证 | `03_ddd_step_16_test_cut.md` | completed / pass_with_upstream_blockers | module/protocol/state/consistency/error/config/observability cuts recorded; no test result/evidence claimed |
| 17 | 详细设计到实施计划承接 | `03_ddd_step_17_implementation_handoff.md` | completed / pass_with_upstream_blockers | handoff、前置阅读、字段/DTO/view/state/phase 预复核完成；未写 phase、commit、实现或 readiness |
| 18 | 风险与待确认事项 | `03_ddd_step_18_risks_open_questions.md` | completed / pass_with_upstream_blockers | blocker、owner、影响、未确认前处理与下游门禁已收口 |
| 19 | 正式详细设计装配 | `03_ddd_step_19_formal_document_assembly.md` | completed / pass_with_upstream_blockers | 正式 03 已 full-restart 重建并完成审计；立即停审，等待用户确认后方可进入 04 |

## 5. 串行执行纪律

- 每次“继续 / 同意 / 上下文恢复”先读 `project_execution_ledger.md`，再读本 flow、当前 Step 和 02 承接清单。
- Step 1~19 必须独立建立中间产物；不得把多个 Step 合成一张总表后直接写正式文档。
- Step 6~10 必须按模块 / 协议族 / 接口 / 状态机小循环展开，再做跨模块闭环审计。
- 正式 03 仅在 Step 19 由已完成且通过门禁的中间产物装配；不得从历史正文复制章节。
- 单次编辑批次控制在约 100~300 行；长章节拆分写入并在每批后做 Markdown / 追溯检查。
- 任何发现主语、owner、对象分母、接口分类、状态轴或安全边界需要变化，先回退 00/01/02 对应 Step；不得在 03 暗改。
- 未提交 commit；不创建实现仓、代码、测试结果、run_id、artifact、report、evidence、verdict、signoff 或 readiness。

本次恢复门禁记录（2026-08-27）：用户“继续”视为沿既有停审顺序授权进入下一个 Step 6 模块；该授权仅覆盖 `domain / CMP-MS-01`，不覆盖 CMP-MS-02、Step 7 或任何上游合同，并不改变 `MSVC-UP-001~008` 的 pending / blocked 状态。

本对象组停审记录（2026-08-28）：`domain / CMP-MS-01 / control.rs` 已完成 `HostIntent`、`HostOrchestrationDecision`、`HostControlPolicy` 与 domain-only mapper-input / replay / current-fact / basis / plan helper。`FormalControlIntakeState` 只表达 future formal mapper 的 `LocallyEvaluable / WaitingForFormalInput / RejectedByFormalInput` 本地输入分类；它不证明 L1 relation、source currentness、scope permission、actor authorization或 Governance approval。当前停在 `CMP-MS-01` 完成后的用户确认门禁：不得自动进入 CMP-MS-02，也不得创建 Step 7。

本轮授权记录（2026-08-28）：用户“继续”明确授权进入 `CMP-MS-02`，范围仅包含 `contracts 6.1-g` corrective closure 与 `domain / qualification.rs`、`domain / assembly.rs` 对象契约。该授权不覆盖 CMP-MS-03、Step 7~19、任何 sibling exact contract 或实现仓；`MSVC-UP-001~008` 继续保持 pending / blocked。

本对象组停审记录（2026-08-29）：`contracts 6.1-g` 已完成 qualification / assembly / readiness shared carrier corrective closure；`domain / CMP-MS-02` 已完成 `HostQualificationContext`、`RequiredQualificationPolicy`、`HostAssembly`、`HostReadinessDecision` 及 source-entry、freshness、item/outcome、readiness-evaluation support value。已固定 `Resolved` 的 policy-only path、no-fallback、source/item/gap canonical order、same-generation / revision guard、`Complete != Ready` 与 immutable readiness replacement chain。`MSVC-UP-001~008` 仍 pending / blocked。当前立即停审：未获用户明确确认不得进入 CMP-MS-03，也不得创建 Step 7。

本轮授权记录（2026-08-29）：用户“继续”明确授权进入 `CMP-MS-03`。范围仅为 `contracts 6.1-h` completion check 后的 `domain / host.rs`、`action_attempt.rs`、`association.rs` 四个冻结业务对象及其仅供本对象组使用的 support value、字段来源与状态闭环审计。该授权不覆盖 `CMP-MS-04`、Step 7~19、任何 sibling exact contract、实现仓或提交；`MSVC-UP-001~008` 继续保持 pending / blocked。

本轮授权记录（2026-08-30）：用户“继续”明确授权进入 `CMP-MS-04`。范围仅为对 registration / endpoint / Host Session 所需 shared carrier 的受限审计，以及 `domain / registration.rs`、`domain / session.rs` 中 `HostRegistration`、`HostEndpoint`、`HostSession`、`RegistrationSessionPolicy` 的对象契约、字段来源、状态闭环与 Step 7 handoff。该授权不覆盖 CMP-MS-05、Step 7~19、Member / Runtime / credential exact contract、实现仓或提交；`MSVC-UP-001~008` 继续保持 pending / blocked。

本轮授权记录（2026-09-01）：用户“继续”明确授权进入 `CMP-MS-05`。范围仅为 `contracts 6.1-j` health / failure local carrier corrective closure，以及 `domain / health_signal.rs`、`domain / health.rs`、`domain / recovery.rs` 中 `HealthSignalSnapshot`、`HostHealthAssessment`、`HostFailureClassification`、`HostRecoveryDecision` 的对象契约、字段来源、状态闭环与 Step 7 handoff。该授权不覆盖 CMP-MS-06、Step 7~19、任何 sibling exact contract、实现仓或提交；`MSVC-UP-001~008` 继续保持 pending / blocked。

本轮授权记录（2026-09-01）：用户“继续”明确授权进入 `CMP-MS-06`。范围仅为 closure / cleanup / residual / reconciliation 所需的受限 shared-carrier 缺口审计，以及 `domain / closure.rs`、`domain / reconciliation.rs` 中 `HostClosure`、`CleanupAttempt`、`ResidualFinding`、`ReconciliationCase` 的对象契约、字段来源、状态闭环与 Step 7 handoff。该授权不覆盖 CMP-MS-07、Step 7~19、任何 sibling exact contract、实现仓或提交；`MSVC-UP-001~008` 继续保持 pending / blocked。

本轮授权记录（2026-09-01）：用户最新“继续”明确授权进入 `CMP-MS-07`。范围仅为 material / handoff / safe view / projection / outbox / history 所需 shared local carrier 的受限缺口审计，以及 `domain / material.rs`、`domain / projection.rs`、`domain / outbox.rs`、`domain / history.rs` 中 `HostFactMaterial`、`HostHandoffRecord`、`SafeHostView`、`HostProjectionState`、`HostOutboxRecord`、`HostHistoryEntry` 的对象契约、字段来源、状态闭环与 future Step 7 handoff。该授权不解决 `HostChangeCursor` / `CommittedChangeCursor` 的上游命名差异，不覆盖 Step 7~19、任何 sibling exact contract、实现仓或提交；`MSVC-UP-001~008` 继续保持 pending / blocked。

### 6.2 CMP-MS-02 完成记录（2026-08-29）

| 审计项 | 结果 | 证据 / 当前上限 |
|---|---|---|
| capability 到对象覆盖 | pass | `CAP-MS-05~08` 均有唯一对象或 domain-only support value；CMP-MS-02 四个正式业务对象无孤儿或重复。 |
| 对象 / 文件 owner | pass | `qualification.rs` 独占 context / policy；`assembly.rs` 独占 assembly / readiness；shared carrier 仍由 `contracts/src/refs.rs` 拥有。 |
| 字段来源闭环 | pass_with_upstream_blockers | local id、revision、local time、typed ref、safe summary、freshness binding和policy baseline均已标来源；上游 exact DTO / mapper未闭合仍保持 pending。 |
| 状态闭环 | pass | qualification、assembly、readiness三轴独立；`Complete != Ready`；unknown、stale、blocked、failed不得隐式正向。 |
| 集合与排序 | pass | source / item / outcome / gap set均采用唯一 key和canonical order，拒绝重复、乱序、缺项及自动整理。 |
| generation / revision / immutable guard | pass | item/outcome要求同 generation；readiness匹配 host + generation + assembly revision；重评新建 replacement并记录 `supersedes_ref`。 |
| external / sibling boundary | pass_with_upstream_blockers | Member、Runtime、Images、credential、Sandbox、carrier、Core/Bus/SDK正文、route、secret、manifest和backend truth均未被吸收。 |
| Step 7 handoff | pass_with_upstream_blockers | 已命名 source/freshness mapper、local store、outcome/progression seam、policy binding、decision UoW和safe mapper；不创建 Step 7 文件。 |

`cmp_ms_02_status = completed / pass_with_upstream_blockers`
`cmp_ms_02_stop_review = completed`
`next_allowed_action = stopped_waiting_for_user_explicit_confirmation_for_cmp_ms_03`

### 6.3 CMP-MS-03 完成记录（2026-08-30）

| 审计项 | 结果 | 证据 / 当前上限 |
|---|---|---|
| capability 到对象覆盖 | pass | `CAP-MS-09~12` 分别由 host/fence、attempt/outcome/unknown fence、typed association承接；四个冻结业务对象无孤儿或重复。 |
| 对象 / 文件 owner | pass | `host.rs` 独占 host / fence / current permit；`action_attempt.rs` 独占 attempt / outcome / witness；`association.rs` 独占 target / association / release surface；shared local id/ref/revision仍由 `contracts/src/refs.rs` 拥有。 |
| generation / revision / permit | pass_with_upstream_blockers | generation、semantic revision、repository expected version、assembly revision、projection cursor和external source version严格分离；establishment plan与mutation permit均为私有、按值消费的 domain guard。future CAS/UoW仍待 Step 7/11/13。 |
| local-first / outcome 组合 | pass_with_upstream_blockers | attempt 先持久化后方可跨 port；`Prepared` 不等于 dispatch；`Unknown` 保留原 effect key；outcome factory/rehydrate 的 status-summary-reason 组合已封闭。exact mapper / receipt / envelope 仍 pending。 |
| association 矩阵 | pass_with_upstream_blockers | kind-target、action/cleanup summary、stale/invalid/unknown/release 转换均有闭合矩阵；`PinnedAsset` 只接受 `HostCarrierOrBackendResourceRef`，不得把 Images supply ref 当 resource target。Images/Sandbox exact contract仍 pending。 |
| feedback 优先级 | pass_with_upstream_blockers | current pair、history-pair、attempt identity、effect/correlation、terminal stage有固定排序；`ClosureInProgress` / `NoCurrentHost` / `Unavailable` 均不得产生 `CurrentMatch`。history lookup seam仍待 Step 7。 |
| Step 7 handoff | pass_with_upstream_blockers | 已命名 current-fact/store/UoW、attempt dispatch、feedback mapper、association/release、safe projection/history seam；不创建 Step 7 文件。 |

`cmp_ms_03_status = completed / pass_with_upstream_blockers`
`cmp_ms_03_stop_review = completed`
`next_allowed_action = stopped_waiting_for_user_explicit_confirmation_for_cmp_ms_04`

### 6.4 CMP-MS-04 完成记录（2026-08-31）

| 审计项 | 结果 | 证据 / 当前上限 |
|---|---|---|
| capability 到对象覆盖 | pass | `CAP-MS-13~16` 分别由 registration / policy、endpoint、Host Session 及跨轴 replay / replacement / invalidation 规则承接；四个冻结业务对象无孤儿或重复。 |
| 对象 / 文件 owner | pass | `registration.rs` 独占 registration / policy 与三轴 permit / replacement-plan issuance；`endpoint.rs` 独占 endpoint truth；`session.rs` 独占 Host Session shell / Runtime witness；shared id/ref/fingerprint/revision仍由 `contracts/src/refs.rs` 拥有。 |
| currentness / permit / atomicity | pass_with_upstream_blockers | registration、endpoint、session 各自绑定 exact target 与 selected current（如有）的 opaque permit；replacement plan要求 old/new/current/history future same-UoW/CAS；不伪造 DB lock、expected-version或提交结果。 |
| 状态轴隔离 | pass | registration `Accepted`、endpoint `Active`、Host Session `Active` 仅代表各自 local state，不自动推导 health、ready、Runtime run、Member status、Sandbox或 host lifecycle。 |
| registration / endpoint 边界 | pass_with_upstream_blockers | dual-anchor、credential qualification、safe endpoint ref、freshness和replay均只消费 formal mapper / committed local facts；`Blocked` / `Conflict` / `Duplicate`保持 disposition，不污染 lifecycle enum。 |
| Runtime positive path | pass_with_upstream_blockers | Step 6 无 callable positive mapper；`HostRuntimeAssociationWitness` 的 factory为 `session.rs` private，`RuntimeAssociationWitnessMapper` 仅是无方法 reserved marker。必须先由 Step 7 闭合 formal `Associated` / `Blocked` / `Unknown` result，再提供唯一 body-free same-shell mapper seam；`MSVC-UP-001` 未关闭前不得生成 witness 或激活 shell。 |
| non-positive causality | pass_with_upstream_blockers | registration invalidation / Host Session close 的 optional `HostClosureDecisionRef` 分别持久化在 `invalidation_causality_ref` / `closure_causality_ref`；history 只复制对象已保存 causality，不事后猜测 cleanup / Runtime stop。 |
| field / state / Step 7 handoff | pass_with_upstream_blockers | §9.10 已逐项审计字段来源、状态矩阵、scope / revision / time约束和六组 Step 7 承接；`MSVC-UP-001/002/006/007` 等 exact contract继续 pending。 |
| old-document pollution / implementation evidence | pass | 未恢复旧 03 的 Runtime session/run、直接 execute、container/RPC/database/topic truth；未创建实现仓、代码、测试、artifact、report、evidence、verdict、signoff或 commit。 |

`cmp_ms_04_status = completed / pass_with_upstream_blockers`
`cmp_ms_04_stop_review = completed`
`next_allowed_action = stopped_waiting_for_user_explicit_confirmation_for_cmp_ms_05`

### 6.5 CMP-MS-05 完成记录（2026-09-01）

| 审计项 | 结果 | 证据 / 当前上限 |
|---|---|---|
| capability 到对象覆盖 | pass | `CAP-MS-17~20` 分别由 signal snapshot、four-axis assessment、failure classification 和 explicit recovery decision 承接；四个冻结对象无孤儿或重复。 |
| 对象 / 文件 owner | pass | `health_signal.rs` 独占 snapshot / intake；`health.rs` 独占 assessment / failure；`recovery.rs` 独占 formal recovery context / decision / plan；local id/ref/revision 仍只属于 `contracts/src/refs.rs`。 |
| formal control 与 health fact 分离 | pass_with_upstream_blockers | Consumer / Job / Query 只能形成或读取 facts；`FormalRecoveryContext` 必须由 future `IB-MS-012` mapper 输出与 loaded accepted `HostIntent` 共同构造，并复核 source / intent / 双锚 scope。exact command / mapper 仍待 Step 7/8。 |
| basis / prerequisite 与 scope | pass_with_upstream_blockers | assessment、failure 与 recovery 只保存 fixed-order typed local refs；recovery prerequisite 必须包含唯一 assessment，future reader 必须验证全部成员同一双锚 `host_ref + generation`。 |
| recovery replacement / commit / void 可落码性 | pass_with_upstream_blockers | current facts 显式携带 optional current committed prior decision；new record 回填 `supersedes_ref`；commit guard 绑定 exact decision / scope / plan / relation；void reason 独立持久而不覆盖 plan reason。store / expected version / same-UoW 仍待 Step 7/11/13。 |
| Recover / Restart 边界 | pass_with_upstream_blockers | `Recover` 在 `MSVC-UP-001` open 时只能 `Blocked / Hold / Unknown` 且不得 commit 成 positive handoff；`Restart` 只能由 committed exact-target decision + fresh empty unknown-effect fence 进入 future `HostGenerationFence::guard_recovery_restart(...)`，不得降级为 Launch。 |
| Stop / Terminate 与 closure | pass_with_upstream_blockers | committed `Stop` / `Terminate` 只能形成 CMP-MS-06 `HostClosureDecisionRef` candidate；不创建 closure / cleanup，不表示 Runtime stop、Sandbox / carrier release 或 external completion。 |
| 状态轴隔离 | pass | snapshot intake、assessment record + four axes、failure status + certainty、recovery decision lifecycle 均独立；`Committed` 不等于 action started / accepted / completed / recovered。 |
| blocker / 污染保真 | pass_with_upstream_blockers | `MSVC-UP-001~008` 继续 pending / blocked；未吸收 Runtime / Member / Images / Sandbox / Core / Bus / SDK / Governance / observability 正文，未恢复旧 03 的 run / checkpoint / direct execute 或 backend truth。 |
| Step 7 handoff / 文件规范 | pass_with_upstream_blockers | 已命名 signal/assessment/failure readers、formal context mapper、prerequisite/current-fact reader、decision store/UoW、Runtime/restart 与 closure candidate seam；future Step 7 文件名固定为 `03_ddd_step_07_trait_port_adapter_contracts.md`，当前不创建。 |

`cmp_ms_05_status = completed / pass_with_upstream_blockers`
`cmp_ms_05_stop_review = completed`
`next_allowed_action = stopped_waiting_for_user_explicit_confirmation_for_cmp_ms_06`

### 6.6 CMP-MS-06 完成记录（2026-09-01）

| 审计项 | 结果 | 证据 / 当前上限 |
|---|---|---|
| capability 到对象覆盖 | pass | `CAP-MS-21~24` 分别由 `HostClosure`、`CleanupAttempt`、`ResidualFinding`、`ReconciliationCase` 唯一承接；四个冻结对象无合并、遗漏或第 30 个对象。 |
| shared carrier / 文件 owner | pass | `contracts/src/refs.rs` 独占 closure / cleanup / finding / case id-ref、revision与homogeneous set；`closure.rs` 独占 closure / cleanup support value；`reconciliation.rs` 独占 residual / case support value。 |
| field source / canonical set | pass_with_upstream_blockers | scope、attempt、finding、case 的 local id/time/ref、safe summary、formal context、redacted reason和semantic revision均已标明唯一来源；basis / indexes拒绝缺项、重复、乱序、cross-subject和raw body。future reader / mapper / store仍待 Step 7。 |
| four-axis state separation | pass | `LocallyClosed`、cleanup `Succeeded`、finding `Resolved`、case `Resolved` 四种 local meaning不互相推导，也不声称 external cleanup / owner completion。 |
| same-key / causality fence | pass_with_upstream_blockers | cleanup release是独立于 `HostActionAttempt` 的 effect lane；post-dispatch `Unknown` / `Gap` 保持 original key、target与correlation，future retry须经named same-key reader / UoW。 |
| Job / formal authority | pass_with_upstream_blockers | Job observation-only只能 detect / open local case / retain unknown；hold、request-cleanup、no-action、escalate、resolve均要求 formal mapped accepted intent + source + dual-anchor context，且 request不创建 attempt或 port call。 |
| external / sibling boundary | pass_with_upstream_blockers | no Runtime run / stop, Member truth, image truth, Sandbox policy/backend/reaper/cleanup truth, Core/Bus schema or SDK readiness was localized; `MSVC-UP-001~008` remain pending / blocked. |
| Step 7 handoff / file discipline | pass_with_upstream_blockers | named only closure/cleanup/finding/case reader-store-UoW-mapper-port seams; `03_ddd_step_07_trait_port_adapter_contracts.md` is not created. |
| old-document pollution / implementation evidence | pass | no direct execute, execution handle, fixed container/RPC/database/topic, tool loop, checkpoint, artifact, test, evidence, verdict, signoff, readiness or commit was added. |

`cmp_ms_06_status = completed / pass_with_upstream_blockers`
`cmp_ms_06_stop_review = completed`
`next_allowed_action = stopped_waiting_for_user_explicit_confirmation_for_cmp_ms_07`

### 6.7 CMP-MS-07 完成记录（2026-09-02）

| 审计项 | 结果 | 证据 / 当前上限 |
|---|---|---|
| capability 到对象覆盖 | pass | `CAP-MS-25~28` 由 `HostFactMaterial`、`HostHandoffRecord`、既有 `SafeHostView` consumption boundary、`HostProjectionState`、`HostOutboxRecord`、`HostHistoryEntry` 承接；没有新增业务对象。 |
| 对象 / 文件 owner | pass | material / handoff -> `domain/src/material.rs`；projection -> `domain/src/projection.rs`；outbox -> `domain/src/outbox.rs`；history -> `domain/src/history.rs`；`SafeHostView` -> `contracts/src/views.rs`；shared id/ref/key/revision -> `contracts/src/refs.rs`。未创建 `handoff.rs` 或 `publication.rs`。 |
| shared-carrier closure | pass_with_upstream_blockers | `6.1-l` 已闭合 local committed-change anchor、五组 id/ref、material key 与 projection semantic revision；`MaterialSafe*`、handoff gap/attempt、projection scope/gap、outbox attempt/gap、history relation 皆有唯一 file owner，且不成为 public DTO / port / protocol。 |
| cursor separation | pass_with_upstream_blockers | `HostChangeCursor` / `CommittedChangeCursor` 保持 exact-type pending。没有第三种 cursor、alias、conversion，也没有用 history id、page cursor、broker offset、CAS/version 或 generation 替代。 |
| feedback layer separation | pass | `submitted`、`delivered`、`observed`、`accepted` 独立保存与映射，互不推导；material、view、history仍为 immutable / append-only。 |
| four-layer boundary | pass_with_upstream_blockers | control plane、host truth、runtime session 与 execution handoff 仅在 host-side local record / safe ref / blocked seam 范围内衔接；未吸收 Runtime、Member、Images、Sandbox、Core、Bus、Observability 或 L1 truth。 |
| Step 7 handoff / 文件纪律 | pass_with_upstream_blockers | 只命名 material/history store、publication/handoff mapper、projection reader/store/rebuild、safe-read mapper 与 feedback consumer future seam；`03_ddd_step_07_trait_port_adapter_contracts.md` 未创建。 |
| 历史污染与实现事实 | pass | 未恢复 direct execute、execution handle、fixed container/RPC/database/topic、checkpoint/tool loop、backend truth，亦未创建实现仓、代码、测试、artifact、report、evidence、verdict、signoff、readiness 或 commit。 |

`cmp_ms_07_status = completed / pass_with_upstream_blockers`
`cmp_ms_07_stop_review = completed`
`preflight_authorization_at_entry = application_object_group_preflight`

本轮恢复记录（2026-09-02）：用户“继续”只授权在 `CMP-MS-07` 停审后进入 application 对象组的 **preflight**。该预检已依据 Step 4 / 5 的唯一 file owner 和 02 承接清单完成 facade、operation context、idempotency / stored result、transaction helper、mapper、read / materialization use-case、job helper 与 application error 的 carrier 缺口审计。preflight 不是 application object-card 写入授权；当前停在 preflight stop-review，等待用户明确确认后再写对象卡。Step 7~19、正式 `03-详细设计.md`、实现、测试、证据与 commit 继续禁止。

### 6.8 Application 对象组 preflight 停审记录（2026-09-02）

| 审计项 | 结果 | 当前上限 |
|---|---|---|
| file owner / capability mapping | pass | `services.rs`、`use_cases/materialization.rs`、`use_cases/read.rs`、`transactions.rs`、`idempotency.rs`、`mappers.rs`、`errors.rs`、`jobs.rs` 与 `ports/unit_of_work.rs` 各有唯一候选 owner；不得新增万能 context / model 文件。 |
| command / query boundary | pass_with_upstream_blockers | materialization 只编排已提交 local material / history / outbox / handoff；read 只组装 `SafeHostView` / history page 且 query no-write。 |
| transaction / idempotency boundary | pass_with_upstream_blockers | application 只定义 carrier / orchestration boundary；expected-version、commit proof、durable store、exact replay 仍待 Step 7/11/13 与 infra。 |
| mapping / error / job boundary | pass_with_upstream_blockers | mapper / error 只做 contracts↔domain / port-neutral、redaction-aware 映射；jobs 只选择已提交 work，不产生新授权或外部完成事实。 |
| sibling contract fidelity | pass_with_upstream_blockers | `MSVC-UP-001~008`、cursor exact type、Core/Bus route/envelope/receipt、Member/Images/Sandbox/Runtime mapper继续 pending / blocked；不得补写 positive schema。 |
| Step 7 / formal document gate | pass | 不创建 `03_ddd_step_07_trait_port_adapter_contracts.md`，不修改正式 `03-详细设计.md`；Step 7 仍 blocked。 |

`application_preflight_status = completed / pass_with_upstream_blockers`
`application_object_cards = pending_explicit_user_confirmation`
`next_allowed_action = stopped_waiting_for_user_explicit_confirmation_for_application_object_cards`

## 6. 当前跨项目 blocker

| ID | 边界 | 当前详细设计上限 |
|---|---|---|
| `MSVC-UP-001` | Runtime entry / Host Session / execution handoff | host-side association、placeholder、blocked result；不定义 Runtime run / outcome |
| `MSVC-UP-002` | Member launch / register / heartbeat / status exact contract | typed request / signal placeholder；不伪造字段、凭据或联调成功 |
| `MSVC-UP-003` | Images pinned supply / manifest / digest / verification | qualification ref 和 fail-closed；不解析 Role -> image 或声明 supply ready |
| `MSVC-UP-004` | SandboxBinding bind / release / cleanup | host association / attempt / safe outcome；不定义 sandbox backend / policy / cleanup truth |
| `MSVC-UP-005` | policy 传递 owner | 当前无正式主线入口；保持 pending，不新增配置或对象 |
| `MSVC-UP-006` | launch credential owner | 只允许 opaque、instance-bound、revocable、不可复用 safe ref；secret 不入仓 |
| `MSVC-UP-007` | Core schema / event family | 只引用类型类别；exact DTO、envelope、route、receipt pending |
| `MSVC-UP-008` | SDK compile target / Server self-test | 记录受限 compile / fake seam 约束；不声明 target 或测试证据 ready |
| `MSVC-UP-009` | 非 ProjectMember 执行主语 | 当前范围已 resolved；非项目主语 fail closed |

## 7. 历史材料处理

旧 `03-详细设计.md` 中的 `MemberRuntimeSession`、`WorkerSlot`、`CapabilityMount`、`RuntimeActionIntake`、`ExecutionHandle`、`SandboxExecutionHandle`、直接 `ExecuteRuntimeAction`、固定容器 / RPC / 数据库 / topic 和 callback body 均只用于污染审计。它们不得直接进入当前 29 个对象、17 个接口或 7 条处理流；若当前 02 有等价语义，只能以当前正式名称和边界重新推导。

## 8. Step 19 正式 03 停审记录（2026-09-02）

| 审计项 | 结果 | 证据 / 当前上限 |
|---|---|---|
| full-restart 装配 | pass | 正式 `03-详细设计.md` 已从 Step 1~18 校准材料重建；旧正式文档只作为 historical_material 污染审计输入。 |
| 18 章结构 | pass | 正文按详细设计规范完成第 1～18 章，并为每章提供校准来源和延伸阅读。 |
| 对象分母 | pass | CMP-MS-01~07 共 29 个业务对象；support value、DTO、carrier、availability、disposition 不计入。 |
| 协议分母 | pass | 10 Command（8 public + 2 internal）、6 Query、5 Consumer、1 material helper、7 Job。 |
| 边界红线 | pass | Query no-write、Job no-authorization、四层 handoff 独立、Cursor exact type pending、上游 blocker 保持 fail-closed。 |
| 历史污染 | pass | 正式正文未恢复旧对象、直接执行主线、固定产品、外部正文或实现事实。 |
| 实现/测试证据 | pass | 未创建实现仓、源码、测试结果、artifact、report、evidence、verdict、signoff、readiness 或 commit。 |
| 修改范围 | pass | 本轮仅修改 `projects/L2-member-service/` 下正式 03、校准 flow 和项目台账；未修改兄弟项目。 |

结论：`step_19_status = completed / pass_with_upstream_blockers`，`formal_03_stop_review = completed`。本项目现在停在正式 `03-详细设计.md`，未经用户再次明确确认不得创建或进入 `04-配置设计.md`。

```text
current_document = 03-详细设计.md
current_step = Step 19 formal_document_assembly
gate_status = completed / pass_with_upstream_blockers
next_allowed_action = stopped_waiting_for_user_explicit_confirmation_for_04
formal_04_write_allowed = false
implementation_allowed = false
commit_allowed = false
```
