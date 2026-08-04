# L4-observability 03-详细设计 Step 06 - R06.5 policy / guard / append-only record 专项

> 主控文件: `03_ddd_step_06_object_contracts.md`
> 前置 contracts 专项: `03_ddd_step_06_contracts_carriers.md`
> 前置 domain core 专项: `03_ddd_step_06_domain_truth_signal_audit.md`
> 前置 boundary / maintenance 专项: `03_ddd_step_06_boundary_read_maintenance.md`
> 修复批次: `R06.5 policy / guard / append-only record`
> 当前子批次: `R06.5-G H8~H13 gap / peripheral / reference / projection maintenance / gap scan / replay append-only record`（historical checkpoint）
> 当前状态: R06.5-G_done_confirmed_historical_checkpoint；F2 record factory reconciliation已同步，整体 current pointer 为 `R06.6-F2_done_waiting_user_before_R06.7`
> 正式回填状态: blocked_until_R06.8_and_step_19

## 1. 本批边界与停止规则

| 项 | 当前裁定 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 06 `逐模块定义对象实现契约` |
| R06.5 总目标 | 将 18 个 policy / guard、13 个 append-only record、它们的 secondary carrier 与 `DomainError` 压到逐对象可落码粒度 |
| R06.5-A 已完成目标 | 固定authoritative input、对象inventory、policy-output与transition-record覆盖、support owner、历史冲突和后续子批次门禁 |
| R06.5-B 已完成目标 | 闭口shared policy basis、13个typed record identity、record metadata/audit visibility与Step06 exact `DomainError` |
| R06.5-C 已完成目标 | 闭口P1~P6六个policy、40个new explicit type、3个existing decision extension、complete snapshot binding、affected owning member与resolver carrier |
| R06.5-D 已完成目标 | 闭口P7~P12六个policy、77个new explicit type、5个decision extension、1个domain enum extension、3个contracts affected groups、cross-crate assembly与zero-write门禁 |
| R06.5-E 已完成目标 | 闭口P13~P18六个policy、66个new explicit type、existing decision/state/transition affected definitions、complete target/scope/version/dependency/current lookup与zero-side-effect门禁 |
| R06.5-F 已完成目标 | 已逐卡闭口H1~H7七个append-only record的typed subject/source、before/change/after、三输入factory、validated rehydrate、metadata约束、append-only与phase boundary |
| 当前允许写入 | 本专项不再写入；F2 reconciliation已完成，下一动作受主控 / flow / ledger 的用户确认门禁控制 |
| 当前禁止写入 | 本专项的旧 G 批内容、R06.7~R06.8、Step 07~19、正式 `03`、任何 `04`、实现代码 |
| 直接上游 blocker | `R06.6-F2-H13-UPSTREAM=open_controlled`；formal `02`的scope-only H13映射与current per-target factory冲突，当前禁止`DefineReplayScope`写H13 |
| 内部 blocker | `03-RPR-S06-GRANULARITY=open`；P1~P18、H1~H13及F2 factory reconciliation均已闭合，Step06仍待R06.7~R06.8；`R06-F-AFFECT-UOW-01=open_controlled_downstream` |
| 停止规则 | 本专项停在历史 checkpoint `R06.5-G_done_confirmed_historical_checkpoint`并已被F2消费；current恢复点由§74、主控/flow/ledger统一记录为`R06.6-F2_done_waiting_user_before_R06.7` |

R06.5-A不以控制矩阵代替对象卡，B批也不以shared foundation替代concrete policy。C/D/E批现已逐卡闭口P1~P18；H1~H13的change-specific字段、variant、factory与record仍必须由F/G独立卡闭口，不能根据A/B批矩阵或transition inventory直接落码。

## 2. 必读输入与使用结论

| 输入 | 本批使用结论 |
|---|---|
| `详细设计讨论流程_SOP.md` Step 06 | 每个模块先完成 capability、功能到对象、对象能力与批次停审；每个对象必须独立成小节 |
| `详细设计书写规范.md` §5.5 / §5.6 | policy / record 需 Rust-facing 类型、字段、完整函数签名、factory、variant、来源、不变量与 Step 7 承接 |
| `设计真相源闭环与可落码性标准.md` | member parameter、policy output、record metadata、change kind、record ref 与 error 必须有唯一 definition owner |
| `设计文档讨论中间产物规范.md` | 本专项先形成 current 中间产物并同步 gate，不提前回填正式 `03` |
| 正式 `02-概要设计.md` §6 / §12 | 保留 18 个 policy 和 13 个 record 主语；详细设计负责补 exact schema 与 phase boundary |
| `02_hld_step_06_key_objects_policies.md` | 只作为 policy responsibility / candidate field / candidate method 骨架；文件明确声明不定义完整策略实现 |
| `02_hld_step_06_key_objects_history_records.md` | 只作为 record responsibility / candidate field 骨架；ID/Ref、aggregate-to-record factory 与 mutable execution record 形态必须按 current delta contract修复 |
| 主控 §6.5.4 / §6.5.5 | 18 + 13 current inventory 与 `R06-D06/D07/D12` 修复责任 |
| contracts 专项 §19.5 | policy / record / classifier / ref / `DomainError` 的计划 owner registry；不能视为已完成 schema |
| R06.3 专项 | 7 个 current transition、3 个 exact decision、actor/time/trace carrier与 core truth post-state |
| R06.4 专项 | 17 个 current transition、8 个 exact decision/authorization、三输入 record factory、per-target replay与 dual-watermark边界 |
| Step 07/09/10/11/12 | 只用于 affected use 与 persistence/flow 缺口反查；冻结材料不能成为 R06.5 definition owner |
| L1-governance / L1-artifact Step 06 | 参考逐 policy / record 独立卡、字段来源和 append-only 红线粒度；不复制相邻域 truth |

## 3. Authority 与 historical material 裁定

### 3.1 current authority 顺序

```text
formal 00 / 01 / 02 truth and object subjects
  -> current R06.2 contracts types
  -> current R06.3 / R06.4 truth, decisions, transitions and post-state
  -> R06.5 policy / record exact cards
  -> affected-only Step 07+ review
```

当概要骨架与 R06.3/R06.4 current schema冲突时，保留概要的业务主语与责任，但由 current transition / decision / body-free / no-write边界决定 exact shape。若后续发现必须删除或改变正式概要主语/归属，必须按正式 `02` §12.3 回退；A 批未发现这种外部 blocker。

### 3.2 historical / affected-only 形态

| historical / frozen shape | current裁定 | 后续处理 |
|---|---|---|
| generic `DomainPolicy<P, R>` 代替 18 个 policy | 只能是 private implementation helper，不能是 current object contract | C~E 为每个 policy 建独立卡 |
| 18 个概要 `*PolicyId` | 只在概要骨架出现，没有 lifecycle、repository 或 stable public identity语义 | 不按名称自动生成 18 个 newtype；B 批闭口共享 immutable policy basis，C~E逐卡说明是否需要额外 identity |
| infra `PolicyBindingRef` | 配置/infra locator，负责在 assembly 阶段解析 policy material | 不得进入 domain policy字段、decision或error；resolved immutable basis由B批承接 |
| policy 接收另一个 policy object | 会形成隐式依赖、无法证明同一 snapshot | application先加载一致输入；policy只消费 exact object/snapshot/basis |
| policy直接返回 aggregate state、aggregate、`Result<()>`或公开 bare enum | 无法证明target/version/rule basis，易绕过 owning member | C~E逐卡返回既有或新增target-bound decision；纯 structural guard例外必须逐卡证明 |
| generic `ObservationHistoryRecord { BodyFreeRef, String change_kind }` | 丢失typed subject/kind/reason/after-state/trace/cursor | historical only；F/G逐record重建，不生成 persisted generic row |
| 概要 `*RecordId` 与 current `*RecordRef` 双命名 | current contracts与persistence统一以typed `record_ref`为PK | B/F/G闭口typed ref；不生成ID/Ref双类型或alias |
| record factory直接接收 aggregate并从current state猜历史变化 | 丢失before/change payload且可在失败路径伪造record | 必须消费successful transition + same-UoW post-state + typed metadata并交叉校验 |
| record拥有 `mark_running/mark_completed/attach_gap` 等 mutation | history row应append-only，mutable execution truth已有owning state/job object | 每次accepted operation生成新record；旧row不更新 |
| `ReadAccessRecord`由同步Query暗写 | 违反Query no-write且当前没有writer | F批已闭口phase-reserved schema/禁用条件，不授权当前write flow |
| replay record以整个scope作为一次execution subject | 与R06.4 per-target coordination冲突 | 每个execution record绑定scope + exact coordination + target；scope-wide summary由R06.6 job report承接 |

## 4. R06.5 子批次控制

### 4.1 子批次状态表

| 子批次 | 覆盖范围 | 当前状态 | 完成证据 | 停审门禁 |
|---|---|---|---|---|
| `R06.5-A` | authority、inventory、coverage、owner、delta、分批控制 | done_confirmed | 本文件 §1~§12 | 用户已确认进入B |
| `R06.5-B` | shared policy basis、record metadata/ref template、record audit surface、`DomainError` | done_confirmed | §§13~§18；23个new explicit type + 1个复用record ref、owner/error/zero-unowned审计 | 用户已确认进入C |
| `R06.5-C` | policy P1~P6：intake / safety / signal / body-free / evidence / authenticity | done_confirmed | §§19~§30；6个policy卡、40 new + 3 affected extensions、R06.2/R06.3/R06.4 affected sync | 用户已确认进入D |
| `R06.5-D` | policy P7~P12：handoff / retention / replay boundary / no-write / read / gap | done_confirmed | §§31~§44；6个独立policy卡及target-bound审计 | 用户已确认进入E |
| `R06.5-E` | policy P13~P18：degraded / peripheral / reference / adapter / maintenance / replay coordination | done_confirmed | §§45~56；6个独立policy卡、66 new explicit types、R06.2/R06.4 affected sync、owner/complete snapshot/zero-side-effect审计 | 用户已确认进入F |
| `R06.5-F` | record H1~H7：intake / correlation / audit / handoff / retention / no-write / read | done_confirmed | §§57~65；7个独立record卡、67个new explicit type、12-family total mapping、validated rehydrate与affected audit | 用户已确认进入G |
| `R06.5-G` | record H8~H13：gap / peripheral / reference / maintenance / gap scan / replay；R06.5全文门禁 | done_confirmed_historical_checkpoint | §§66~§73；6个独立record card、62个G批新增显式类型、affected-definition与总门禁均完成 design-only | 已被 R06.6 输入审查消费；当前指针见主控 / flow / ledger |

### 4.2 子批次执行规则

1. 每个子批次先读本文件指定 input，再写独立对象卡；不得从 family 表批量生成 schema。
2. 每个 policy 卡必须给出 immutable basis、exact loaded input、target-bound output、private constructor owner、错误、零副作用与测试红线。
3. 每个 record 卡必须给出 typed record ref、subject、change kind、before/change/after字段、metadata、三输入 factory、append-only与同UoW规则。
4. 每批完成后同步主控、flow、ledger并停审；不得在一次确认中跨越下一个子批次。
5. R06.5-G通过前，R06.5不算完成；R06.6、Step 07与正式文档保持冻结。

## 5. capability 与对象 inventory

### 5.1 policy / guard capability inventory

| # | policy object | capability / target | current output owner | 子批次 |
|---|---|---|---|---|
| P1 | `IntakeAdmissionPolicy` | source/purpose/safety准入一个receipt | `domain::intake::AdmissionDecision` exact | C |
| P2 | `SafetyDispositionPolicy` | 对candidate summary做redaction-first分类 | `domain::safety::SafetyDispositionDecision` exact | C |
| P3 | `SafeSignalPolicy` | 对一个Candidate signal作record/suppress判断 | R06.3 `SignalDecision` C批extension exact | C |
| P4 | `BodyFreeLinkagePolicy` | 校验一个boundary ref可形成body-free linkage | pure structural guard；允许typed `Result<()>`，不产生public marker | C |
| P5 | `EvidenceVisibilityPolicy` | 对linkage/projection/scope计算可见性 | R06.3两个visibility decision C批extension exact | C |
| P6 | `AuthenticityHintPolicy` | 对一个handoff immutable input形成origin/placeholder/insufficient判断 | `domain::handoff::AuthenticityHintDecision` exact | C |
| P7 | `HandoffReadinessPolicy` | 对一个handoff/input/consumer计算readiness | 复用R06.4 `HandoffReadinessDecision` | D |
| P8 | `RetentionProtectionPolicy` | 对marker/protection/consumer snapshot判断hold/release/conflict | 复用R06.4 `RetentionMarkerDecision` / `ActiveProtectionReleaseDecision` | D |
| P9 | `ReplayBoundaryPolicy` | 审批或阻塞一个exact replay scope snapshot | 复用R06.4 `ReplayApprovalSnapshot`并由scope member消费 | D |
| P10 | `NoWriteGuardPolicy` | 对trigger/forbidden target作pass/block判断 | `NoWriteGuardDecision`待D闭口 | D |
| P11 | `ReadVisibilityPolicy` | 对one-shot request/scope形成visibility | 复用R06.4 `ReadVisibilityDecision` | D |
| P12 | `GapClassificationPolicy` | 对source/snapshot/visibility形成exact gap classification | `GapClassificationDecision`待D闭口 | D |
| P13 | `DegradedOutputPolicy` | 对gap/safety/visibility形成normal/degraded/blocked replacement input | `DegradedOutputDecision`待E闭口 | E |
| P14 | `PeripheralExportPolicy` | 对delivery与preparation分别形成export判断 | 复用R06.4 `PeripheralDeliveryDecision` / `ExportPreparationDecision` | E |
| P15 | `ReferenceFreshnessPolicy` | 对loaded snapshot/result/target判断refresh/freshness/gap传播 | `ReferenceFreshnessDecision`待E闭口；resolver `ReferenceRefreshResult`不等于policy decision | E |
| P16 | `AdapterBoundaryPolicy` | 对safe summary/adapter family作product-neutral/body-free guard | pure structural guard；允许typed `Result<()>`，不产生public marker | E |
| P17 | `DerivedMaintenancePolicy` | 对一个immutable target/effect/guard/scope授权execution | 复用R06.4 `MaintenanceExecutionAuthorization` | E |
| P18 | `ReplayCoordinationPolicy` | 对approved scope中的一个exact target判断start/block | `ReplayCoordinationDecision`待E闭口；不得返回scope-wide aggregate | E |

### 5.2 append-only record inventory

| # | record object | exact subject | primary accepted input | 子批次 |
|---|---|---|---|---|
| H1 | `IntakeDecisionRecord` | `ObservationReceiptRef` | `ObservationReceiptTransition` + post `ObservationReceipt` | F |
| H2 | `CorrelationLinkRecord` | `CorrelationContextRef` | `CorrelationContextTransition` + post `CorrelationContext`；selected `SafeSignalTransition`只在明确correlation effect时使用 | F |
| H3 | `AuditAppendRecord` | `AuditProjectionRef` | `AuditProjectionTransition`或`EvidenceLinkageTransition` + matching post-state；复用`AuditAppendKind` | F |
| H4 | `HandoffLifecycleRecord` | `ReportHandoffRecordRef` | `ReportHandoffTransition` + post `ReportHandoffRecord` | F |
| H5 | `RetentionChangeRecord` | marker或protection的tagged subject | `RetentionMarkerTransition`或`ActiveReferenceProtectionTransition` + matching post-state | F |
| H6 | `NoWriteViolationRecord` | `NoWriteViolationRef` | `NoWriteViolationTransition` + post `NoWriteViolation` | F |
| H7 | `ReadAccessRecord` | `DiagnosticRequestContextRef` | explicit future async accepted audit envelope + `ReadVisibilityDecision/State`;current phase无writer | F |
| H8 | `GapTransitionRecord` | `GapStateRef` | `GapTransition` + post `GapState`；related degraded ref only from accepted `DegradedOutputTransition` binding | G |
| H9 | `PeripheralDeliveryRecord` | tagged delivery/preparation subject | `PeripheralDeliveryTransition`或`ExportPreparationTransition` + matching post-state | G |
| H10 | `ReferenceRefreshRecord` | `ReferenceSnapshotStateRef` | in-place `ReferenceSnapshotTransition` + post state, or P17/P15 accepted typed new-snapshot creation input + new post state; no fabricated old-row transition | G |
| H11 | `ProjectionMaintenanceRecord` | tagged projection/rollup maintenance subject | `ProjectionMaintenanceTransition`、`SignalRollupTransition`或`RollupRebuildTransition` + matching post-state | G |
| H12 | `GapScanRecord` | exact `MaintenanceTargetRef` of kind Gap | R06.6 immutable job item result + discovered canonical gap set + target snapshot；不是mutable record | G |
| H13 | `ReplayExecutionRecord` | scope + exact coordination + target | `ReplayCoordinationTransition` + post `ReplayCoordinationState`；每target独立record | G |

## 6. policy output coverage matrix

### 6.1 exact current result carriers

| current carrier | authoritative owner | producer(s) | A批裁定 |
|---|---|---|---|
| `SignalDecision` | R06.3 `domain::signal` | P3 | C批authoritative extension：basis + complete target/correlation/assessment/runtime snapshot；不生成alias |
| `EvidenceVisibilityDecision` | R06.3 `domain::evidence` | P5 | C批authoritative extension：basis + complete linkage/projection/boundary/digest snapshot |
| `AuditProjectionVisibilityDecision` | R06.3 `domain::audit` | P5 | C批authoritative extension：basis + complete projection snapshot；不升级为consumer authorization |
| `HandoffReadinessDecision` | R06.4 `domain::handoff` | P7 | 复用handoff/input/consumer/scope shape |
| `RetentionMarkerDecision` | R06.4 `domain::retention` | P8 | 复用exact marker/protection snapshot shape |
| `ActiveProtectionReleaseDecision` | R06.4 `domain::retention` | P8 | 复用observed/revalidated consumer-set shape |
| `ReplayApprovalSnapshot` | R06.4 `domain::replay` | P9 | 作为loaded approval input/result snapshot；D批闭口policy producer与scope consumption |
| `ReadVisibilityDecision` | R06.4 `domain::read` | P11 | 复用one-shot target-bound shape |
| `PeripheralDeliveryDecision` | R06.4 `domain::peripheral` | P14 | 复用delivery decision shape |
| `ExportPreparationDecision` | R06.4 `domain::peripheral` | P14 | 复用preparation decision shape |
| `MaintenanceExecutionAuthorization` | R06.4 `domain::maintenance` | P17 | 复用immutable target/effect/mode/guard；不恢复旧enum |

### 6.2 result carrier gaps assigned to one owner

| gap carrier | unique owner / producer | 必须绑定 | 禁止退化 |
|---|---|---|---|
| `AdmissionDecision` | `domain::intake` / P1；exact in §20 | complete receipt + post-safety disposition + basis + outcome | bare bool / receipt state / free reason |
| `SafetyDispositionDecision` | `domain::safety` / P2；exact in §20 | complete receipt/disposition + summary/context + basis + outcome | bare `SafetyDispositionState` / config result |
| `AuthenticityHintDecision` | `domain::handoff` / P6；exact in §26 | complete hint/handoff/input/linkage/origin/gap snapshots + basis | 直接返回mutable `AuthenticityHint` |
| `NoWriteGuardDecision` | `domain::no_write` / P10 | trigger context + attempted target + guard scope | pass bool / policy object传给aggregate |
| `GapClassificationDecision` | `domain::gap` / P12 | source + affected object + snapshot/visibility basis | bare `GapKind` / default gap kind |
| `DegradedOutputDecision` | `domain::gap` / P13 | output revision target + safety + visibility + optional gap | 直接返回mutable state / public `DegradedSurface`注入 |
| `ReferenceFreshnessDecision` | `domain::reference` / P15 | snapshot subject/version + refresh result/target | 把record或resolver result当policy授权 |
| `ReplayCoordinationDecision` | `domain::replay` / P18 | approved scope + exact target + retention/protection/guard snapshot | 返回scope-wide `ReplayCoordinationState` |

上述8个名称在A批只是owner reservation。C批现已闭口其中`AdmissionDecision`、`SafetyDispositionDecision`、`AuthenticityHintDecision`；其余5个仍须D/E独立卡给出exact fields、constructor、member、error和测试后才可落码。

### 6.3 pure structural guard exceptions

| policy | 允许返回 | 成立条件 | 禁止扩张 |
|---|---|---|---|
| P4 `BodyFreeLinkagePolicy` | `Result<(), DomainError>` | 只验证loaded projection/boundary/purpose/scope/digest是否满足body-free structural invariant；成功后仍由`EvidenceLinkage` factory/member与P5 visibility decision闭合target state | 不从错误拼visibility/gap marker；不把成功当Linked decision |
| P16 `AdapterBoundaryPolicy` | `Result<(), DomainError>` | 只验证adapter family + safe summary的product-neutral/body-free形态；resolver result和P15 freshness decision继续承接状态语义 | 不从成功生成Resolved/Fresh；不把provider output直接写snapshot |

这两个例外不产生 public status marker，也不把 bare error 映射成 visible/degraded/missing 等业务 surface，因此不违反 query marker 必须来自 typed decision/result 的标准。若后续 C/E 发现它们需要向对象传递分类载荷，必须在对应子批次重开本矩阵并新增具名 decision，不能由实现私补。

## 7. transition-to-record coverage matrix

| current transition / accepted input | record consumer | mapping rule | uncovered / defer |
|---|---|---|---|
| `ObservationReceiptTransition` | H1 | 一次accepted admission change生成一条record | none |
| `SafetyDispositionTransition` | H1 | 同一intake UoW可生成独立typed subject branch；H1须用tagged decision source，不能混淆receipt state | F闭口tagged source |
| `CorrelationContextTransition` | H2 | direct | none |
| `SafeSignalTransition` | H2 selected branches或explicit no-record | Recorded/Revalidated只有明确correlation linkage effect时进入H2；Suppressed/MarkedStale当前不生成H2/H3；不得重复写两族record | F已闭口total mapping |
| `SignalRollupTransition` | H11 | tagged maintenance subject | G闭口rollup branch |
| `AuditProjectionTransition` | H3 | direct；append ref/kind需与delta一致 | none |
| `EvidenceLinkageTransition` | H3 | linkage branch必须绑定owning projection | F闭口tagged source |
| `ReportHandoffTransition` | H4 | direct | none |
| `AuthenticityHintTransition` | H4 | hint branch必须绑定same handoff | F闭口tagged source |
| `RetentionMarkerTransition` | H5 | marker branch | none |
| `ActiveReferenceProtectionTransition` | H5 | protection branch；不得暗示cleanup | F闭口tagged subject |
| `ReplayScopeTransition` | no current persisted record | scope definition/approval/close cannot satisfy H13's per-target coordination input | `explicit_no_record` under `R06.6-F2-H13-UPSTREAM`; a future scope-lifecycle family requires upstream redesign |
| `NoWriteViolationTransition` | H6 | direct | none |
| `ReadVisibilityTransition` / `ReadVisibilityDecision` | H7 | current synchronous Query no writer；只供future async envelope | phase_reserved |
| `DiagnosticScopeTransition` | no current persisted record | process/projection scope replacement由maintenance/projection history解释 | explicit_no_record |
| `DiagnosticSummaryTransition` | H11 | derived projection maintenance branch | G闭口summary branch |
| `GapTransition` | H8 | direct | none |
| `DegradedOutputTransition` | H8 | only related gap/output branch；不伪造gap transition | G闭口tagged source |
| `PeripheralDeliveryTransition` | H9 | delivery branch | none |
| `ExportPreparationTransition` | H9 | preparation branch | G闭口tagged subject |
| `ReferenceSnapshotTransition` / typed new-snapshot accepted creation input | H10 | in-place direct; new identity uses a G-batch tagged branch carrying previous ref and both policy bases | G closes new-snapshot accepted-input schema |
| `ProjectionMaintenanceTransition` | H11 | projection branch + dual watermarks | none |
| `ReplayCoordinationTransition` | H13 | per-target execution branch | none |
| `RollupRebuildTransition` | H11 | rollup execution branch | G闭口tagged subject |
| R06.6 gap-scan item result | H12 | immutable item result + discovered set + target snapshot | blocked_by_R06.6_input_shape；G只可定义record所需contract，不可读取R06.6专项 |

Coverage并不要求每个 transition 都生成 record，也不允许一个 transition无条件复制到多个 record family。F/G 必须为每个 accepted variant给出 total mapping：exact one family、explicit no-record、或 phase-reserved；未分类即为实现 blocker。

## 8. shared support owner inventory

### 8.1 R06.5-B foundations（已完成）

| carrier group | qualification / owner | purpose | B批完成结论 |
|---|---|---|---|
| `PolicyBasisRef` | `TC`, `contracts::refs` | 已解析immutable rule snapshot identity；与infra `PolicyBindingRef`隔离 | §14 exact；no locator/direct conversion |
| `PolicyFamily`;`PolicyRevision`;`PolicyEvaluationBasis` | `FC`, `domain::policies` | family + basis ref + revision/digest；不含rule body | §15 exact；18-family total mapping |
| record ref family | `TC`, `contracts::refs` | 13 append-only PK；复用既有`AuditAppendRecordRef`，新增其余12个typed ref | §14 exact；不生成`*Id` alias |
| `ObservationRecordOrigin`;`ObservationRecordMetadata<R>` | `FC`, `domain::records` | writer lane、actor、time、trace、causation、audit visibility与可选committed cursor | §16 exact；不复制R06.6 operation namespace |
| `RecordAuditVisibility` | `FC`, `domain::records` | internal/audit-timeline/operations exposure | §16 exact；不是business authorization |
| `DomainError`与三个classifier | `FC`, `domain::errors` | factory/policy/transition/record construction failure | §17 exact；Step12只mapping/recovery |

`PolicyBasisRef`与`PolicyEvaluationBasis`已由B批成为current exact schema。冻结Step14/04的`PolicyBindingRef`仍只是resolution前locator；后续affected audit必须承接locator到resolved immutable basis的单向assembly，不得把locator、credential、rule body或config map带入domain。

### 8.2 policy support families

| policy batch | support family | status / owner rule |
|---|---|---|
| C P1~P6 | required intake context、redaction/quarantine rules、signal kind/label/correlation rules、reference family/body-free rules、visibility rules、origin/placeholder rules | 概要名称均为candidate；C必须逐项复用current type或建立FC/HX，不得留悬空名 |
| D P7~P12 | handoff blocking、protection/release、replay allowed/forbidden、forbidden write set、visibility constraints、gap classification rules | D逐policy闭口；不得存retention days、source target或授权truth |
| E P13~P18 | degradation/unsafe output、export boundary、freshness/unresolved、adapter family/product-truth、maintenance target、replay impact rules | E逐policy闭口；per-target/dual-watermark/no-write强制承接 |

### 8.3 record support families

| record batch | support family | status / owner rule |
|---|---|---|
| F H1~H7 | intake/correlation/handoff/retention/no-write/read typed change kind/reason + tagged subject/source | F独立enum/value卡；复用current reason/state，不复制同义enum |
| G H8~H13 | gap/peripheral/reference/maintenance/scan/replay typed kind/reason/impact summary | G独立enum/value卡；`AuditAppendKind`复用R06.3；per-target/dual cursor必须无损 |

## 9. record factory common boundary

### 9.1 mandatory three inputs

每个 current append-only record factory必须语义上接收三类输入；可以按record建立具名metadata与tagged delta，但不可缺任一类：

1. successful transition / accepted immutable item result：证明本次被接受的operation、before-state与change payload。
2. same-UoW post-mutation snapshot：提供subject、immutable relation与完整after-state条件字段。
3. typed `ObservationRecordMetadata`：提供record ref、actor/system owner、recorded time、trace/causation、audit visibility与该record需要的cursor。

Factory必须交叉校验subject、target、from/to、after-state、reason、cursor namespace和metadata operation scope。任何不一致返回`DomainError`，并使aggregate save、record append及后续outbox snapshot在同一UoW回滚。

### 9.2 append-only redlines

- record只有construct/inspect，不提供update、delete、mark、attach或state transition member。
- record不推进truth、projection、delivery、replay或job state，不调用repository/adapter/clock/id generator。
- record ref由application id generator在accepted UoW生成，不由subject/time/digest拼接。
- record不保存raw log/metric/trace/audit/evidence body、provider payload、locator、credential、rule body、真实run id、evidence alias、verdict或signoff。
- correction追加新的typed correction/supersession record；不得覆盖旧row。具体是否需要correction kind由F/G逐卡裁定，不能默认增加。
- append-only store没有repository version；duplicate PK拒绝，duplicate operation由idempotency在append前拦截。

## 10. policy common boundary

- policy只消费自身immutable basis与application已经加载的exact objects/snapshots；不依赖repository、adapter、config、clock、id generator或transport。
- policy不修改输入、不调用aggregate member、不append record/outbox/stale marker/job report，不执行外部I/O。
- policy output constructor必须private/domain-owned，并携带足够target/scope/version basis防止跨对象复用。
- config/entry不能构造decision，infra `PolicyBindingRef`只能在assembly阶段解析为validated immutable basis。
- denied/blocked/pending/insufficient必须用typed outcome/error表达；不得从message解析，也不得默认success。
- policy不是业务授权truth；actor/subject权限只以安全snapshot输入参与本仓read/observation边界判断。
- no-write、retention、body-free、not-visible、per-target replay与derived-only边界不可配置绕过。

## 11. 差异项与后续传播

### 11.1 主控差异项

| delta | A批结论 | 关闭条件 |
|---|---|---|
| `R06-D06-POLICY-FAMILY` | 18个policy inventory、output覆盖与C~E owner已固定 | E批18个独立卡、support/decision zero-unowned后关闭 |
| `R06-D07-RECORD-FAMILY` | 13个record inventory、24 transition覆盖与F/G owner已固定；F批7个record已闭口 | G批完成剩余6个独立卡与R06.5全量total mapping/append-only审计后关闭 |
| `R06-D11-SUPPORT-TYPE` | B批shared foundation、P1~P18与H1~H7 support已exact；G批仍有唯一owner待闭口 | G批zero-unowned；全Step仍待R06.8 |
| `R06-D12-ERROR-OWNER` | `DomainError` Step06 exact owner/variants已由B闭口，旧主控/Step12 enum降为affected material | Step06 definition resolved；R06.6/R06.7其他层error及Step12 mapping仍待后续 |
| `UR-REC-BASE` | generic persisted history row确定为HX | F/G无generic PK/kind/string fallback后关闭 |

### 11.2 affected-only传播登记

| affected location | 当前冲突 | R06.5完成后的动作 | 当前写入 |
|---|---|---|---|
| R06.3/R06.4 exact decision / transition | C~F已同步P1~P18 decision、H1~H7所需snapshot/proof/transition增量 | G继续逐卡判断affected extension；不得复制shape | C~F affected sync done；G pending |
| Step07 repository / UoW | append接口未覆盖13族/phase-reserved语义，且旧顺序在cursor前构造record、save可能提前consume post-state | R06.8后affected review exact append surface/fake parity，并承接`R06-F-AFFECT-UOW-01`的borrow-stage/cursor/append顺序 | frozen |
| Step09 flows | 多处旧`assert_*`、直接构造authorization、record与aggregate顺序 | Step08稳定后逐flow改为load basis -> evaluate -> member -> delta -> record factory | frozen |
| Step10 state | record mutation、policy直接推进state或旧classifier名 | Step09后affected backref review | frozen |
| Step11 persistence | store表可作logical use，但字段仍依赖旧record骨架 | Step10后按F/G exact schema复审；Query read access保持phase-reserved | frozen |
| Step12 errors | 旧error taxonomy可能首次补variant | 只能映射B批`DomainError`，不得新增domain control-flow variant | frozen |
| Step14 / 04 config | `PolicyBindingRef`是locator且原材料冻结 | `03`修复完成后审计locator -> immutable basis assembly；不让config构造decision | frozen |
| formal03 / 04 | 仍含repair前policy/record material | Step19重装配后才恢复04 affected audit | frozen |

## 12. R06.5-A 自检与停止点（historical，已消费）

| 自检项 | 结论 | 证据 / 限制 |
|---|---|---|
| 是否先读标准与上游 | pass | §2 |
| 是否覆盖18个policy | pass_inventory | §5.1；C~E各6个 |
| 是否覆盖13个record | pass_inventory | §5.2；F 7个、G 6个 |
| 是否审计current policy output | pass_coverage | §6；11 exact reuse + 8 owner reservations + 2 pure structural guard exceptions |
| 是否审计current transition input | pass_coverage | §7；24 transition + gap-scan item input |
| 是否固定secondary carrier owner | pass_for_A | §8；B批shared foundation与C批P1~P6 support已exact，D~G仍待闭口 |
| 是否固定policy/record公共边界 | pass_for_A | §§9~10；不是最终对象卡 |
| 是否隔离historical/frozen material | pass | §§3、11 |
| 是否修改R06.3/R06.4 schema、R06.6、Step07+、formal03或04 | pass_no_write | 仅创建A批控制产物并同步控制文件 |
| 是否伪造commit/run/test/evidence/signoff | pass_none_created | 只记录planned design gates |
| external upstream blocker | none | formal 00/01/02足以支撑R06.5 |
| historical internal blocker | `03-RPR-S06-GRANULARITY=open` | 当时R06.5仍需B~G；current见§73，Step06仍需R06.6~R06.8 |
| R06.5-A gate | historical_pass_consumed | inventory/coverage/owner/sub-batch已闭口并由B批消费 |
| historical next action | `wait_user_confirmation_before_R06.5-B` | 用户已确认并完成B批，不再是current action |

### 12.1 R06.5-B 阅读清单（historical，已消费）

以下清单记录A批完成后曾等待用户确认的B批输入；该确认已经发生，且清单已由B批消费：

1. Step 06标准中secondary carrier、error、factory、enum与逐对象停审条款。
2. 本文件§§3/6~10中的shared foundation、policy basis、record metadata/ref与`DomainError` owner。
3. R06.2 `BodyFreeRef` / TC template；R06.3 `ActorSafeRef`、`ObservedAt`、`TraceCorrelationRef`、`CausationRef`、committed cursor；R06.4 dual-watermark与record三输入规则。
4. Step04 planned domain files、Step14/04 `PolicyBindingRef` affected material，只作locator隔离反查。
5. L1-governance/L1-artifact policy foundation、record metadata/ref与error卡粒度。

该历史下一入口已由用户确认并由C批消费；current下一阅读入口只见§30.3。A批记录不再授权或阻止任何current动作。

## 13. R06.5-B 输入、能力与 definition owner

### 13.1 B批读取结论

| 输入 | B批使用结论 |
|---|---|
| Step 06 SOP / 书写规范 | shared foundation仍须逐类型给出Rust schema、字段来源、factory/member、variant、不变量、owner/use与测试红线 |
| R06.2 `BodyFreeRef` / TC模板 | `PolicyBasisRef`和12个新增record ref复用校验、wire、digest discriminator与redacted Debug；每个类型仍保留独立卡 |
| R06.3 shared metadata | 复用`ActorSafeRef`、`ObservedAt`、`TraceCorrelationRef`、`CausationRef`和既有`AuditAppendRecordRef`；禁止复制同义类型 |
| R06.2 cursor类型 | metadata复用`Option<ObservationCommittedCursor>`保存本次UoW的单一tagged commit position；H11等record的observation/reference双水位仍来自same-UoW post-state，不混入commit cursor |
| Step04 planned files | contracts类型归`contracts::{refs,metadata}`；domain foundation归`domain::{policies,history,errors}`，不新增crate或文件 |
| frozen Step14 / 04 | `PolicyBindingRef(pub String)`是infra/config locator；B批只登记后续单向resolution，不复制或修改冻结定义 |
| frozen Step12 | 旧19-variant `DomainError`只作use inventory；B批成为exact definition owner，Step12后续只能affected mapping/recovery |
| L1参考 | 采用逐carrier/error code与redline粒度；不复制相邻域subject、message或truth anchor |

### 13.2 capability到对象映射

| capability | 输入 | 输出对象 | owner | 本批不承接 |
|---|---|---|---|---|
| 标识一个已解析immutable policy snapshot | policy registry resolved identity | `PolicyBasisRef` | `contracts::refs` | locator解析、registry I/O、rule body |
| 区分18个policy family | compile-time policy对象集合 | `PolicyFamily` | `domain::policies` | dynamic plugin、配置字符串扩展 |
| 固定一次evaluation的policy basis | family/ref/revision/digest | `PolicyEvaluationBasis` | `domain::policies` | rule-specific字段与evaluate逻辑，留C~E |
| 标识13个append-only record | application id generator输出 | 13个typed `*RecordRef` | `contracts::refs` | record schema/factory，留F/G |
| 为record factory提供稳定审计metadata | typed record ref、origin、actor/time/trace/causation/visibility/cursors | `ObservationRecordMetadata`及support | `domain::records` | application operation namespace，留R06.6 |
| 表达domain factory/policy/member失败 | current R06.3/R06.4 use + B~G construction use | `DomainError`及mismatch classifier | `domain::errors` | public mapping/recovery，留affected Step12 |

### 13.3 owner与依赖方向

```text
infra config PolicyBindingRef
  -> infra policy registry resolves and validates immutable material
  -> PolicyBasisRef + PolicyEvaluationBasis
  -> one exact C/D/E policy object
  -> target-bound decision or structural guard result

application id generator + accepted operation context
  -> one exact typed record ref
  -> ObservationRecordMetadata
  -> F/G record factory also receives transition/item-result + post-state
  -> append-only record
```

`contracts`不依赖`domain`。`domain::records`可以import contracts refs/metadata；policy和record不依赖infra locator、config、repository、clock或id generator。Step04 planned physical file仍写`history.rs`，与A批已经固定的逻辑owner `domain::records`不一致；B批裁定logical module为`records`，R06.8必须将物理文件改为`records.rs`或给出不制造双module的等价布局，当前不得让实现任选。B批不会把`ObservationOperationName`从R06.6提前搬入metadata；当前以有限`ObservationRecordOrigin`证明writer lane，F/G再为每个factory固定允许origin集合。

## 14. contracts foundation 独立对象卡

### 14.1 `PolicyBasisRef`

```rust
/// Stable identity of one resolved immutable policy snapshot.
#[repr(transparent)]
pub struct PolicyBasisRef(BodyFreeRef);
```

| 卡片项 | exact contract |
|---|---|
| owner / qualification | `contracts::refs`;TC；不是18个`*PolicyId`之一 |
| mint source | trusted policy registry在immutable material完成解析、validation与revision pin后返回registry-owned snapshot identity |
| factory / member | 复用R06.2 TC的`new/as_body_free_ref/into_body_free_ref`；raw string先经`BodyFreeRef::parse` |
| wire / digest | field=`policy_basis_ref`；typed discriminator + exact inner bytes；同inner的其他ref不得比较/转换 |
| equality | exact canonical identity equality；同binding的新revision必须有新basis ref，旧basis ref不得重定向 |
| forbidden | 从`PolicyBindingRef`字符串、config key、rule digest、family、revision、path/URI/credential或clock拼接 |
| tests / stop | locator-like输入、binding/basis混用、same-inner cross-type、revision重定向、Debug redaction；`pass_R06.5-B` |

`PolicyBasisRef`只证明registry返回了一个可稳定引用的resolved snapshot，不证明该snapshot属于某family、revision/digest匹配或能够授权当前target；这些由`PolicyEvaluationBasis`与C~E policy逐次校验。

### 14.2 record ref共同构造边界

以下13个identity均为`contracts::refs`独立newtype。application id generator只在accepted mutation UoW准备阶段为目标record生成exact type；factory失败或UoW rollback时该ref不形成durable fact。ref不得由subject、transition、time、cursor、digest、scope或其他record ref派生。

共同成员仅复用R06.2 TC模板：`new(BodyFreeRef) -> Self`、`as_body_free_ref()`、`into_body_free_ref()`；不提供跨record `From`、type alias、`Display`或public raw-string constructor。wire field与typed discriminator按各卡固定。

### 14.3 `IntakeDecisionRecordRef`

```rust
/// Stable identity of one append-only intake decision record.
#[repr(transparent)]
pub struct IntakeDecisionRecordRef(BodyFreeRef);
```

| owner / mint | wire field | exact use | forbidden substitution | tests / stop |
|---|---|---|---|---|
| `contracts::refs`;application id generator | `intake_decision_record_ref` | H1 PK及metadata ref | receipt/safety ref、generic history id | cross-type/digest/rollback orphan；`pass_R06.5-B` |

### 14.4 `CorrelationLinkRecordRef`

```rust
/// Stable identity of one append-only correlation linkage record.
#[repr(transparent)]
pub struct CorrelationLinkRecordRef(BodyFreeRef);
```

| owner / mint | wire field | exact use | forbidden substitution | tests / stop |
|---|---|---|---|---|
| `contracts::refs`;application id generator | `correlation_link_record_ref` | H2 PK及metadata ref | correlation context/signal/trace ref | trace token与record identity混用；`pass_R06.5-B` |

### 14.5 `AuditAppendRecordRef`（authoritative reuse）

authoritative schema保持R06.3 §9.30的`AuditAppendRecordRef`独立卡。它是H3唯一PK；B批不生成`AuditAppendRecordId`、alias、generic sum ref或第二个ref。application id generator在audit/evidence accepted UoW前生成，projection transition和metadata必须携带同一个typed value；禁止从projection/cursor/digest拼接。B批不改变R06.3类型。

### 14.6 `HandoffLifecycleRecordRef`

```rust
/// Stable identity of one append-only report handoff lifecycle record.
#[repr(transparent)]
pub struct HandoffLifecycleRecordRef(BodyFreeRef);
```

| owner / mint | wire field | exact use | forbidden substitution | tests / stop |
|---|---|---|---|---|
| `contracts::refs`;application id generator | `handoff_lifecycle_record_ref` | H4 PK及metadata ref | handoff/input/receipt/external run identity | 不得伪造run_id/evidence alias；`pass_R06.5-B` |

### 14.7 `RetentionChangeRecordRef`

```rust
/// Stable identity of one append-only retention or protection change record.
#[repr(transparent)]
pub struct RetentionChangeRecordRef(BodyFreeRef);
```

| owner / mint | wire field | exact use | forbidden substitution | tests / stop |
|---|---|---|---|---|
| `contracts::refs`;application id generator | `retention_change_record_ref` | H5 marker/protection tagged branch PK | marker/protection/consumer ref | 不暗示cleanup/release；`pass_R06.5-B` |

### 14.8 `NoWriteViolationRecordRef`

```rust
/// Stable identity of one append-only no-write violation history record.
#[repr(transparent)]
pub struct NoWriteViolationRecordRef(BodyFreeRef);
```

| owner / mint | wire field | exact use | forbidden substitution | tests / stop |
|---|---|---|---|---|
| `contracts::refs`;application id generator | `no_write_violation_record_ref` | H6 PK及metadata ref | `NoWriteViolationRef`、attempt target ref | record identity不授权补偿或写入；`pass_R06.5-B` |

### 14.9 `ReadAccessRecordRef`

```rust
/// Stable identity reserved for one future asynchronous read-access record.
#[repr(transparent)]
pub struct ReadAccessRecordRef(BodyFreeRef);
```

| owner / mint | wire field | exact use | forbidden substitution | tests / stop |
|---|---|---|---|---|
| `contracts::refs`;future async audit application writer only | `read_access_record_ref` | H7 phase-reserved PK | query/request/view ref、sync Query side effect | current writer absence与no-mint gate；`pass_phase_reserved_R06.5-B` |

current同步Query不得调用id generator生成此ref。类型存在只为闭口H7 planned schema identity；F批必须继续声明无current writer，不能因类型可构造而授权hidden write。

### 14.10 `GapTransitionRecordRef`

```rust
/// Stable identity of one append-only gap transition record.
#[repr(transparent)]
pub struct GapTransitionRecordRef(BodyFreeRef);
```

| owner / mint | wire field | exact use | forbidden substitution | tests / stop |
|---|---|---|---|---|
| `contracts::refs`;application id generator | `gap_transition_record_ref` | H8 PK及metadata ref | gap/degraded/source ref | record不得伪造gap lifecycle；`pass_R06.5-B` |

### 14.11 `PeripheralDeliveryRecordRef`

```rust
/// Stable identity of one append-only peripheral delivery or preparation record.
#[repr(transparent)]
pub struct PeripheralDeliveryRecordRef(BodyFreeRef);
```

| owner / mint | wire field | exact use | forbidden substitution | tests / stop |
|---|---|---|---|---|
| `contracts::refs`;application id generator | `peripheral_delivery_record_ref` | H9 tagged branch PK | delivery/preparation/consumer/adapter receipt ref | Delivered不等于external acceptance；`pass_R06.5-B` |

### 14.12 `ReferenceRefreshRecordRef`

```rust
/// Stable identity of one append-only body-free reference refresh record.
#[repr(transparent)]
pub struct ReferenceRefreshRecordRef(BodyFreeRef);
```

| owner / mint | wire field | exact use | forbidden substitution | tests / stop |
|---|---|---|---|---|
| `contracts::refs`;application id generator | `reference_refresh_record_ref` | H10 PK及metadata ref | snapshot/source-version/resolver result ref | 不证明external lifecycle或truth；`pass_R06.5-B` |

### 14.13 `ProjectionMaintenanceRecordRef`

```rust
/// Stable identity of one append-only derived projection maintenance record.
#[repr(transparent)]
pub struct ProjectionMaintenanceRecordRef(BodyFreeRef);
```

| owner / mint | wire field | exact use | forbidden substitution | tests / stop |
|---|---|---|---|---|
| `contracts::refs`;application id generator | `projection_maintenance_record_ref` | H11 tagged projection/rollup PK | maintenance/progress/rebuild ref | 不证明source repaired或target Fresh；`pass_R06.5-B` |

### 14.14 `GapScanRecordRef`

```rust
/// Stable identity of one append-only result record for an exact gap-scan target.
#[repr(transparent)]
pub struct GapScanRecordRef(BodyFreeRef);
```

| owner / mint | wire field | exact use | forbidden substitution | tests / stop |
|---|---|---|---|---|
| `contracts::refs`;R06.6 accepted item UoW id generation | `gap_scan_record_ref` | H12 PK及metadata ref | target/job/item/gap-set ref | G不得猜R06.6 item identity；`pass_input_reserved_R06.5-B` |

### 14.15 `ReplayExecutionRecordRef`

```rust
/// Stable identity of one append-only execution record for one replay target.
#[repr(transparent)]
pub struct ReplayExecutionRecordRef(BodyFreeRef);
```

| owner / mint | wire field | exact use | forbidden substitution | tests / stop |
|---|---|---|---|---|
| `contracts::refs`;application per-target accepted UoW id generation | `replay_execution_record_ref` | H13 PK及metadata ref | scope/coordination/target/job-run ref | 一个ref不得覆盖多个target；`pass_R06.5-B` |

### 14.16 record ref family stop review

| 检查 | 结论 |
|---|---|
| 13个record identity是否都有唯一Rust type | pass；12个新增卡 + R06.3 `AuditAppendRecordRef`复用 |
| 是否生成概要`*RecordId`与current`*RecordRef`双类型 | no；所有`*RecordId`保持historical placeholder |
| 是否使用generic `BodyFreeRef` persisted PK | no；只作为private inner，persisted field保留typed discriminator |
| 是否从subject/time/digest/scope派生 | no；唯一mint owner为application id generator或具名future writer |
| phase-reserved identity是否误授权writer | no；`ReadAccessRecordRef`当前无mint flow，`GapScanRecordRef`等待R06.6 accepted item input |
| external upstream blocker | none |

## 15. policy foundation 独立对象卡

### 15.1 `PolicyFamily`

```rust
/// Finite family of one observation-domain policy implementation.
pub enum PolicyFamily {
    /// Admission policy for one observation receipt candidate.
    IntakeAdmission,
    /// Safety and redaction disposition policy for one material summary.
    SafetyDisposition,
    /// Safe-signal recording or suppression policy.
    SafeSignal,
    /// Structural body-free evidence linkage guard.
    BodyFreeLinkage,
    /// Evidence and audit projection visibility policy.
    EvidenceVisibility,
    /// Authenticity hint derivation policy for one handoff input.
    AuthenticityHint,
    /// Report handoff readiness policy.
    HandoffReadiness,
    /// Retention marker and active protection policy.
    RetentionProtection,
    /// Observation-only replay scope approval policy.
    ReplayBoundary,
    /// Guard against writes outside observation-owned truth.
    NoWriteGuard,
    /// One-shot read visibility policy.
    ReadVisibility,
    /// Typed observation gap classification policy.
    GapClassification,
    /// Degraded or blocked output derivation policy.
    DegradedOutput,
    /// Peripheral delivery and export preparation policy.
    PeripheralExport,
    /// Body-free reference freshness policy.
    ReferenceFreshness,
    /// Structural product-neutral adapter output guard.
    AdapterBoundary,
    /// Target-bound derived maintenance authorization policy.
    DerivedMaintenance,
    /// Per-target replay coordination policy.
    ReplayCoordination,
}
```

| variant | exact token | policy inventory |
|---|---|---|
| `IntakeAdmission` | `intake_admission` | P1 |
| `SafetyDisposition` | `safety_disposition` | P2 |
| `SafeSignal` | `safe_signal` | P3 |
| `BodyFreeLinkage` | `body_free_linkage` | P4 |
| `EvidenceVisibility` | `evidence_visibility` | P5 |
| `AuthenticityHint` | `authenticity_hint` | P6 |
| `HandoffReadiness` | `handoff_readiness` | P7 |
| `RetentionProtection` | `retention_protection` | P8 |
| `ReplayBoundary` | `replay_boundary` | P9 |
| `NoWriteGuard` | `no_write_guard` | P10 |
| `ReadVisibility` | `read_visibility` | P11 |
| `GapClassification` | `gap_classification` | P12 |
| `DegradedOutput` | `degraded_output` | P13 |
| `PeripheralExport` | `peripheral_export` | P14 |
| `ReferenceFreshness` | `reference_freshness` | P15 |
| `AdapterBoundary` | `adapter_boundary` | P16 |
| `DerivedMaintenance` | `derived_maintenance` | P17 |
| `ReplayCoordination` | `replay_coordination` | P18 |

| 契约项 | exact rule |
|---|---|
| owner | `domain::policies`;18个variant与P1~P18一一对应 |
| token | 上表18个exact lowercase snake_case token；不得按Rust名称临时case-convert |
| factory/member | `from_internal_token(&str) -> Option<Self>`；`as_token() -> &'static str`；unknown/case/numeric返回`None`，由registry/persistence mapper上提consistency failure |
| use | `PolicyEvaluationBasis.family`、policy constructor family assertion、basis canonical digest discriminator |
| non-identity | 不是policy id/ref、config key、binding locator、state、authorization或dynamic implementation name |
| tests / stop | 18-token total round-trip、unknown/alias/case拒绝、P1~P18 bijection；`pass_R06.5-B` |

新增policy family必须先重开正式`02` policy object inventory和本R06.5控制矩阵；config或registry不得用`Other(String)`扩张本enum。

### 15.2 `PolicyRevision`

```rust
/// Non-zero immutable revision of one resolved policy snapshot.
pub struct PolicyRevision(u64);
```

| 契约项 | exact rule |
|---|---|
| owner/source | `domain::policies`;trusted registry解析后的immutable monotonically assigned revision |
| factory | `try_from_u64(value: u64) -> Result<Self, DomainError>`；0返回`PolicyBasisMismatch(InvalidRevision)` |
| member/wire | `get() -> u64`；canonical unsigned integer |
| ordering | 只允许同一registry identity lineage内比较；跨`PolicyBasisRef` revision数值无全局顺序语义 |
| forbidden | config default、clock、file mtime、digest prefix、application increment、current binding version替代 |
| tests / stop | 0/1/max、same-ref ordering、cross-ref no-order use；`pass_R06.5-B` |

### 15.3 `PolicyEvaluationBasis`

```rust
/// Immutable body-free basis pinned to one exact policy evaluation.
pub struct PolicyEvaluationBasis {
    /// Exact policy family that may consume this basis.
    family: PolicyFamily,
    /// Stable resolved snapshot identity.
    basis_ref: PolicyBasisRef,
    /// Non-zero immutable snapshot revision.
    revision: PolicyRevision,
    /// Digest of canonical body-free rule material under its declared profile.
    basis_digest: DigestSummary,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `family` | registry entry的compile-time expected family | 必须与具体C/D/E policy type一一匹配 |
| `basis_ref` | registry resolved immutable snapshot | 不得等于或由`PolicyBindingRef`直接转换 |
| `revision` | registry snapshot metadata | same `basis_ref`的内容/revision不可变化 |
| `basis_digest` | registry对canonical body-free rule material计算的`DigestSummary` | 不保存rule body；不能使用request/body digest代替 |

| 函数签名 | 作用 | 返回 / 失败 | 副作用 |
|---|---|---|---|
| `pub fn from_resolved_snapshot(family: PolicyFamily, basis_ref: PolicyBasisRef, revision: PolicyRevision, basis_digest: DigestSummary) -> Self` | 从registry已完成解析/validation的四个typed字段构造 | `Self`；输入已由各自类型闭口 | 无I/O；不读config |
| `pub fn require_family(&self, expected: PolicyFamily) -> Result<(), DomainError>` | concrete policy constructor验证family | mismatch=`PolicyBasisMismatch(UnexpectedFamily)` | 无 |
| `pub fn same_snapshot(&self, other: &Self) -> bool` | 比较family/ref/revision/digest全部字段 | exact bool | constant-time digest comparison在实现支持时使用 |
| `pub fn basis_ref(&self) -> &PolicyBasisRef` | inspection | ref | 无 |
| `pub fn revision(&self) -> PolicyRevision` | inspection | copy value | 无 |
| `pub fn basis_digest(&self) -> &DigestSummary` | inspection | ref | 无 |

不变量与禁止事项：

- 一个policy对象只能持有一个`PolicyEvaluationBasis`；每次evaluation返回的decision必须回指同一个basis identity/revision/digest，具体affected extension由C~E逐卡闭口。
- `PolicyBindingRef -> PolicyEvaluationBasis`只能由infra registry resolution完成；entry/application不得解析locator、读取rule body或从binding字符串构造basis。
- same family不同basis/ref/revision不得在一次multi-policy snapshot中静默混用；application若需一致组合，必须在进入policy前加载同一assembly snapshot。
- basis不含actor、target、scope或业务truth；它不能单独授权任何状态迁移。
- 必测family mismatch、same-ref changed revision/digest、different-ref same digest、locator leakage scan、no rule body与deterministic equality。停审：`pass_R06.5-B`。

### 15.4 policy foundation stop review

| 检查 | 结论 |
|---|---|
| 18个概要`*PolicyId`是否仍需生成 | no；统一由family + immutable basis identity表达，没有独立policy lifecycle/repository identity |
| `PolicyBindingRef`是否进入domain字段 | no；只允许resolution前存在于infra/config |
| rule snapshot是否可复核 | yes；family + basis ref + non-zero revision + typed digest四字段齐全 |
| policy output是否因此已完成 | no；C~E仍须逐policy闭口input/output/private constructor/error/test |
| external upstream blocker | none |

## 16. append-only record metadata foundation

### 16.1 `ObservationRecordOrigin`

```rust
/// Finite writer lane that accepted the operation producing one local record.
pub enum ObservationRecordOrigin {
    /// A synchronous write command accepted by the application layer.
    Command,
    /// An authenticated inbound consumer accepted the mutation.
    InboundConsumer,
    /// A resident worker accepted a derived-only maintenance mutation.
    ResidentWorker,
    /// A one-shot operations job accepted the item or phase mutation.
    OperationsJob,
    /// A future explicit asynchronous read-audit envelope.
    AsynchronousReadAudit,
}
```

| variant | token | allowed boundary | forbidden interpretation |
|---|---|---|---|
| `Command` | `command` | current mutating Command | Query、transport route或actor authority |
| `InboundConsumer` | `inbound_consumer` | authenticated current Consumer | producer business success |
| `ResidentWorker` | `resident_worker` | derived projection/outbox-side local mutation | source repair或external truth write |
| `OperationsJob` | `operations_job` | accepted per-item/per-phase Job | real run id、acceptance或signoff |
| `AsynchronousReadAudit` | `asynchronous_read_audit` | H7 future explicit envelope only | current synchronous Query hidden writer |

decode/member为`from_internal_token(&str) -> Option<Self>`与`as_token() -> &'static str`；unknown/case/alias返回`None`并由persistence mapper上提consistency failure，不得default。没有`Query` variant。F/G为每个record factory固定allowed origin set；已解析但不允许的origin返回`RecordConstructionMismatch(Origin)`。该enum不是R06.6的52-operation namespace，也不能用于idempotency key或route dispatch。必测五token、Query absence、H7 reserved-only与unknown拒绝。停审：`pass_R06.5-B`。

### 16.2 `RecordAuditVisibility`

```rust
/// Audit projection eligibility of one local append-only record.
pub enum RecordAuditVisibility {
    /// The record is retained for internal consistency and direct repository inspection only.
    InternalOnly,
    /// The record may appear only on an operations-restricted diagnostic surface.
    OperationsOnly,
    /// The record may feed the audit timeline after an independent read-visibility decision.
    AuditTimelineEligible,
}
```

| variant | token | 只表达 | 明确不表达 |
|---|---|---|---|
| `InternalOnly` | `internal_only` | 不进入read projection | secret/raw body允许保存 |
| `OperationsOnly` | `operations_only` | 可供受限operations projection选择 | actor已授权、记录必须可见 |
| `AuditTimelineEligible` | `audit_timeline_eligible` | 可作为timeline assembler候选 | public、visible、accepted、signoff |

decode/member为`from_internal_token(&str) -> Option<Self>`与`as_token() -> &'static str`；unknown/case/alias返回`None`并由persistence mapper上提consistency failure。owner为`domain::records`。实际读取仍必须加载`ReadVisibilityDecision`/scope和redaction规则；assembler不得仅凭此enum返回record。F/G逐record/variant固定允许值；已解析但超过factory上限的值返回`RecordConstructionMismatch(AuditVisibility)`。必测exact token、internal不能升级、timeline仍被visibility阻断、unknown拒绝。停审：`pass_R06.5-B`。

### 16.3 `ObservationRecordMetadata<R>`

```rust
/// Typed audit metadata supplied to one append-only record factory.
pub struct ObservationRecordMetadata<R> {
    /// Exact typed identity of the record being constructed.
    record_ref: R,
    /// Finite accepted writer lane; never a free-form operation name.
    origin: ObservationRecordOrigin,
    /// Body-free actor or system principal projection.
    actor_ref: ActorSafeRef,
    /// Canonical local time captured before record construction.
    recorded_at: ObservedAt,
    /// Optional body-free trace correlation token.
    trace_ref: Option<TraceCorrelationRef>,
    /// Optional body-free causation token supplied by a trusted envelope or context.
    causation_ref: Option<CausationRef>,
    /// Maximum audit projection eligibility, still subject to read policy.
    audit_visibility: RecordAuditVisibility,
    /// Optional tagged commit position assigned by the current UoW.
    committed_cursor: Option<ObservationCommittedCursor>,
}
```

| 字段 | 来源 | factory交叉校验 |
|---|---|---|
| `record_ref` | application id generator的exact `R` | `R`在编译期必须等于目标H1~H13 ref type；H3还须等于transition携带ref |
| `origin` | trusted application call context的finite writer lane | F/G exact record/transition variant allowed-origin matrix |
| `actor_ref` | R06.3 `ActorSafeRef` | 不从display/session/credential/provider payload构造 |
| `recorded_at` | application clock在accepted operation中取得 | 不用DB default、adapter return time或external occurred time替代 |
| `trace_ref` | trusted metadata/correlation context | optional；不得从URL/span body构造 |
| `causation_ref` | trusted envelope/context | optional；不得从time/cursor/trace猜出 |
| `audit_visibility` | record factory允许值与application requested exposure的交集 | caller不能升级；不等于read authorization |
| `committed_cursor` | current UoW assigned `ObservationCommittedCursor` | tag必须匹配record write namespace；无cursor的accepted lane必须显式`None` |

```rust
impl<R> ObservationRecordMetadata<R> {
    pub fn new(
        record_ref: R,
        origin: ObservationRecordOrigin,
        actor_ref: ActorSafeRef,
        recorded_at: ObservedAt,
        trace_ref: Option<TraceCorrelationRef>,
        causation_ref: Option<CausationRef>,
        audit_visibility: RecordAuditVisibility,
        committed_cursor: Option<ObservationCommittedCursor>,
    ) -> Self;

    pub fn record_ref(&self) -> &R;
    pub fn origin(&self) -> ObservationRecordOrigin;
    pub fn actor_ref(&self) -> &ActorSafeRef;
    pub fn recorded_at(&self) -> &ObservedAt;
    pub fn trace_ref(&self) -> Option<&TraceCorrelationRef>;
    pub fn causation_ref(&self) -> Option<&CausationRef>;
    pub fn audit_visibility(&self) -> RecordAuditVisibility;
    pub fn committed_cursor(&self) -> Option<&ObservationCommittedCursor>;
}
```

`new`只组装已经validated的typed values，不访问clock/id generator/context/repository。完整record factory必须再校验origin、ref value、visibility、cursor namespace以及transition/post-state的subject/target/state/reason；不匹配时返回`RecordConstructionMismatch`且不得append。

metadata不是独立persisted row；F/G concrete record可flatten这些字段，但不得丢失typed ref discriminator或cursor namespace。H11的observation/reference required/observed/completed watermarks来自same-UoW post-state和transition，不得塞进`committed_cursor`；本字段只表示当前append所属UoW的至多一个commit position。

必测：每个`R`不能跨record factory编译、all five origins、trace/causation四种presence、cursor两namespace与None、visibility不升级、Debug不泄露actor/ref/token、metadata不含raw body/locator/credential/real run id/evidence alias。停审：`pass_R06.5-B`。

### 16.4 record metadata origin baseline

| record | B批允许origin baseline | F/G必须继续收窄 |
|---|---|---|
| H1 intake | Command / InboundConsumer | 按receipt/safety branch |
| H2 correlation | Command / InboundConsumer | 按context/signal branch |
| H3 audit append | Command / InboundConsumer / OperationsJob | 按source/evidence/visibility/gap branch；ResidentWorker不直接append H3 |
| H4 handoff | Command / InboundConsumer / OperationsJob | 按handoff/hint branch；Consumer仅限accepted archive-feedback/hint transition |
| H5 retention | Command / OperationsJob | 按marker/protection branch |
| H6 no-write | Command / InboundConsumer / ResidentWorker / OperationsJob | origin描述本次accepted violation lifecycle operation；原始attempt family由`trigger_context_ref.trigger_kind`独立保存，二者不得强制相等 |
| H7 read access | AsynchronousReadAudit only | current phase仍无writer |
| H8 gap | Command / InboundConsumer / ResidentWorker / OperationsJob | 按gap/degraded branch |
| H9 peripheral | Command / InboundConsumer / OperationsJob | 按preparation/delivery phase；Consumer仅限accepted report-consumer feedback transition |
| H10 reference | Command / InboundConsumer / OperationsJob | 按snapshot transition；Command仅限register/update snapshot accepted branch |
| H11 maintenance | Command / InboundConsumer / ResidentWorker / OperationsJob | 按projection/summary/rollup branch和accepted-input variant继续收窄 |
| H12 gap scan | OperationsJob only | 等待R06.6 accepted item result shape |
| H13 replay | OperationsJob only | 每target独立coordination/execution |

origin baseline是factory允许集合，不是writer授权。actual flow还必须通过R06.6 context、Step09 UoW和Step11 append contract；B批不因列出origin而解冻任何下游。

## 17. `DomainError` exact contract

### 17.1 expected negative outcome 与 error边界

以下结果不是`DomainError`：admission rejected、safety quarantined、signal suppressed、visibility restricted/not-visible/blocked、handoff pending/blocked/degraded、retention hold/conflict、no-write blocked、gap classified、degraded output、export blocked、freshness stale/unresolved、replay blocked。它们必须由C~E target-bound decision或R06.3/R06.4 current state/result承载。

`DomainError`只表示调用方提供的basis/input与对象不匹配、非法或reserved transition、body/truth/no-write边界违反、record三输入不一致，或对象自身不变量无法成立。实现不得把typed negative outcome压成`PolicyRejected`，也不得从error message反推业务surface。

### 17.2 `DomainRelationMismatchKind`

```rust
/// Finite relation that failed an exact domain object or policy-input binding check.
pub enum DomainRelationMismatchKind {
    /// The supplied subject does not equal the owning object's subject.
    Subject,
    /// The supplied canonical scope does not equal or contain the required scope.
    Scope,
    /// The supplied target or effect does not equal the target bound to the object.
    Target,
    /// The supplied observed version does not equal the expected loaded version.
    Version,
    /// The supplied consumer does not equal the consumer bound to the object.
    Consumer,
    /// The supplied immutable snapshot does not describe the loaded object state.
    StateSnapshot,
    /// A target-bound decision cannot be consumed by the current object member.
    DecisionBinding,
    /// A cursor has the wrong target, namespace, or monotonic relation.
    Cursor,
}
```

| variant | token | exact meaning | 禁止误用 |
|---|---|---|---|
| `Subject` | `subject` | loaded input subject不等于owning object subject | missing subject、authorization denied |
| `Scope` | `scope` | canonical scope或scope member不匹配 | scope内expected blocked outcome |
| `Target` | `target` | exact target/effect/object binding不匹配 | target当前不eligible |
| `Version` | `version` | decision/input observed version不等于loaded expected version | repository CAS error |
| `Consumer` | `consumer` | handoff/export/read consumer identity不匹配 | consumer业务权限判断 |
| `StateSnapshot` | `state_snapshot` | supplied immutable snapshot不对应current object/state | normal stale/degraded state |
| `DecisionBinding` | `decision_binding` | decision target/scope/version/basis不能被current member消费 | decision outcome为Denied/Blocked |
| `Cursor` | `cursor` | cursor target/namespace/ordering relation不合法 | cross-namespace total ordering |

decode/member为`from_internal_token(&str) -> Option<Self>`与`as_internal_token() -> &'static str`；unknown token返回`None`，由persistence mapper上提consistency failure。owner为`domain::errors`；token只用于internal persistence/telemetry mapping，不进入public protocol。必测八variant total match与no free-string fallback。

### 17.3 `PolicyBasisMismatchKind`

```rust
/// Finite defect in one resolved immutable policy evaluation basis.
pub enum PolicyBasisMismatchKind {
    /// A persisted or resolved family token is outside the fixed policy inventory.
    UnknownFamilyToken,
    /// A concrete policy received a basis belonging to another policy family.
    UnexpectedFamily,
    /// The resolved policy revision is zero or otherwise invalid.
    InvalidRevision,
    /// A pinned evaluation attempted to replace its immutable basis identity.
    SnapshotIdentityChanged,
    /// A pinned evaluation attempted to replace its immutable revision.
    SnapshotRevisionChanged,
    /// The same basis identity and revision resolved to different canonical material.
    SnapshotDigestChanged,
}
```

| variant | token | trigger |
|---|---|---|
| `UnknownFamilyToken` | `unknown_family_token` | registry/persistence提供非18-family exact token |
| `UnexpectedFamily` | `unexpected_family` | concrete policy接收到其他family的basis |
| `InvalidRevision` | `invalid_revision` | revision为0或不能解释为validated immutable revision |
| `SnapshotIdentityChanged` | `snapshot_identity_changed` | 已pin evaluation尝试替换basis ref |
| `SnapshotRevisionChanged` | `snapshot_revision_changed` | same evaluation identity尝试替换revision |
| `SnapshotDigestChanged` | `snapshot_digest_changed` | same basis/ref/revision出现不同digest |

decode/member为`from_internal_token(&str) -> Option<Self>`与`as_internal_token() -> &'static str`；classifier自身未知持久化token返回`None`并上提consistency failure。`UnknownFamilyToken`只由`PolicyFamily::from_internal_token`返回`None`后的trusted registry validation构造。上述variant表达deterministic basis defect，不表达配置locator missing、registry network failure或policy正常拒绝。前两类infra failure在application/infra error层处理；policy negative result由decision处理。

### 17.4 `RecordConstructionMismatchKind`

```rust
/// Finite mismatch found while joining transition, post-state, and record metadata.
pub enum RecordConstructionMismatchKind {
    /// The typed metadata record identity does not match the target record.
    RecordRef,
    /// The accepted writer lane is not allowed for this record variant.
    Origin,
    /// Transition and post-state subjects do not match.
    Subject,
    /// Transition, post-state, or item-result targets do not match.
    Target,
    /// The transition's before-state cannot be reconciled with its change payload.
    FromState,
    /// The transition's after-state does not match the declared target state.
    ToState,
    /// The same-UoW post-state does not contain the transition's after-state fields.
    PostState,
    /// Typed reason or result fields disagree across the three factory inputs.
    Reason,
    /// Requested audit eligibility exceeds the record variant's allowed maximum.
    AuditVisibility,
    /// The committed cursor belongs to the wrong local namespace.
    CursorNamespace,
    /// A required committed cursor is missing or an unexpected cursor is present.
    CommittedCursor,
    /// The transition branch or immutable item-result kind belongs to another record.
    AcceptedInputKind,
}
```

| variant | token | factory检查 |
|---|---|---|
| `RecordRef` | `record_ref` | metadata typed ref与transition已有ref或目标record type不一致 |
| `Origin` | `origin` | metadata origin不在该record/variant允许集合 |
| `Subject` | `subject` | transition、post-state的subject identity不一致 |
| `Target` | `target` | transition、post-state、item result的target relation不一致 |
| `FromState` | `from_state` | delta before-state/change payload不一致 |
| `ToState` | `to_state` | delta after-state与declared target state不一致 |
| `PostState` | `post_state` | delta after-state与same-UoW post-state条件字段不一致 |
| `Reason` | `reason` | transition reason/result与post-state retained/cleared字段不一致 |
| `AuditVisibility` | `audit_visibility` | caller请求的visibility超过record variant允许上限 |
| `CursorNamespace` | `cursor_namespace` | cursor tag不属于该record write namespace |
| `CommittedCursor` | `committed_cursor` | required cursor missing或unexpected cursor present |
| `AcceptedInputKind` | `accepted_input_kind` | H12 item result或tagged transition branch不属于目标record |

decode/member为`from_internal_token(&str) -> Option<Self>`与`as_internal_token() -> &'static str`；unknown persisted token返回`None`并由mapper上提consistency failure，不能猜`AcceptedInputKind`。该classifier不携带string、raw value或serialized delta。safe diagnostics由application在error外关联typed subject/record ref；不能把输入body、provider message或整个record写进error。

### 17.5 `DomainError`

```rust
/// Canonical failure of an observation-domain factory, policy, member, or record join.
pub enum DomainError {
    /// A required typed body-free relation is absent.
    MissingRequiredReference,
    /// A loaded object, snapshot, or decision relation does not match the exact owner.
    RelationMismatch(DomainRelationMismatchKind),
    /// The requested lifecycle transition is not allowed from the current state.
    InvalidStateTransition,
    /// The transition is intentionally unavailable in the current phase.
    ReservedTransition,
    /// A resolved immutable policy basis is malformed or belongs to another policy family.
    PolicyBasisMismatch(PolicyBasisMismatchKind),
    /// Safety or redaction invariants cannot be satisfied by the supplied typed input.
    SafetyBoundaryViolation,
    /// Raw material, a locator, or a forbidden body crossed a body-free boundary.
    BodyFreeBoundaryViolation,
    /// The requested authenticity surface would exceed the linked body-free evidence.
    AuthenticityBoundaryViolation,
    /// A reference snapshot or subject crossed its observation-side ownership boundary.
    ReferenceBoundaryViolation,
    /// Replay input or effect exceeds the approved observation-only scope.
    ReplayBoundaryViolation,
    /// A caller attempted to bypass the no-write boundary instead of consuming its decision.
    NoWriteBoundaryViolation,
    /// Correlation identity conflicts with the current canonical binding.
    CorrelationConflict,
    /// Reference identity, version, or resolution fields are internally inconsistent.
    ReferenceConflict,
    /// Retention or protection relations cannot satisfy their current object invariant.
    RetentionConflict,
    /// Gap and degraded-output fields cannot form one valid observation-side state.
    GapInvariantViolation,
    /// Rollup identity, scope, count, or source position is internally inconsistent.
    RollupInvariantViolation,
    /// Required committed rollup coverage is incomplete.
    RollupIncomplete,
    /// Report handoff fields or immutable input relations are internally inconsistent.
    HandoffInvariantViolation,
    /// A maintenance, rollup, or replay completion lacks required target-bound material.
    MaintenanceIncomplete,
    /// Transition, post-state, and typed metadata cannot form one append-only record.
    RecordConstructionMismatch(RecordConstructionMismatchKind),
}
```

owner是`domain::errors`，planned file保持Step04 `crates/domain/src/errors.rs`。enum共20个top-level variants，其中三个带有限classifier；不含message、raw ref、body、stack、adapter error、HTTP code、retry flag或config locator。

`DomainError`不提供接受free message/code的generic constructor。owning factory/policy/member只可直接构造上述exact variant；inspection可提供`is_reserved_transition() -> bool`、`is_record_construction_mismatch() -> bool`和`relation_mismatch_kind() -> Option<DomainRelationMismatchKind>`，不得提供影响control flow的message parser或unknown fallback。

### 17.6 producer与zero-mutation mapping

| producer family | allowed `DomainError` | normal negative不走error |
|---|---|---|
| R06.3 intake/safety | missing/relation/state/reserved/safety/body-free | rejected/quarantined disposition |
| R06.3 correlation/signal | missing/relation/state/correlation conflict | partial correlation、signal suppressed |
| R06.3 audit/evidence | missing/relation/state/reserved/body-free/authenticity | restricted/not-visible visibility decision |
| R06.3 rollup | relation/state/rollup invariant/incomplete/maintenance incomplete | stale/rebuilding/failed stored state |
| R06.4 handoff | relation/state/reserved/authenticity/handoff invariant | pending/blocked/degraded readiness |
| R06.4 retention/no-write/replay | relation/state/reserved/retention/replay/no-write boundary | hold/conflict/block decisions |
| R06.4 read/gap | relation/state/gap invariant | restricted/not-visible/blocked/degraded outputs |
| R06.4 peripheral/reference/maintenance | relation/state/reserved/reference/replay/maintenance | blocked/failed/stale/unresolved valid states |
| R06.5 C~E policy | policy basis/relation plus exact structural boundary variants | all finite decision outcomes |
| R06.5 F~G record | record construction mismatch plus underlying invariant when post-state itself invalid | no-record/phase-reserved total mapping |

所有factory/member/policy/record join返回`Err`时：输入不可修改；mutable receiver逐字段不变；不生成transition/decision/record/outbox；不消费durable identity；application回滚当前UoW。`ReservedTransition`永远不生成delta。`RecordConstructionMismatch`要求aggregate save、record append与后续outbox snapshot全部不提交。

### 17.7 historical error delta

| frozen/historical variant | current处理 |
|---|---|
| `ScopeMismatch` | 合并为`RelationMismatch(Scope)` |
| `PolicyRejected` | HX；expected negative必须是typed decision，basis defect使用`PolicyBasisMismatch` |
| `ReadNotAllowed` | HX；read visibility由`ReadVisibilityDecision`表达 |
| `HandoffNotReady` | HX；readiness由`HandoffReadinessDecision`表达，非法字段用`HandoffInvariantViolation` |
| generic `ReferenceBoundaryViolation`用于所有reference defect | ownership越界仍保留；identity/version内部冲突使用`ReferenceConflict`或`RelationMismatch` |
| Step12首次增加variant | 禁止；Step12只能映射上述exact enum并按affected review更新旧19-variant表 |

删除上述三个expected-negative error主语不删除正式概要对象或能力，只修正详细设计层的control-flow归属；无需回退正式`02`。C~E若发现新的domain failure无法映射本enum，必须停在对应policy卡并重开B批，不能在实现或Step12私加variant。

### 17.8 error tests / stop review

| 检查 | 结论 |
|---|---|
| current显式`ReservedTransition`与rollup错误是否保留 | pass |
| policy basis与record三输入是否有finite error | pass；两个独立classifier |
| subject/scope/target/version/decision mismatch是否可区分 | pass；`DomainRelationMismatchKind` |
| expected blocked/denied/not-ready是否误作error | no；回到typed decisions |
| 是否携带message/raw body/ref/provider/config | no |
| Step12是否仍可首次定义domain variant | no；仅affected mapping/recovery |
| error path是否zero mutation/delta/write | pass |
| external upstream blocker | none |

## 18. R06.5-B zero-unowned、affected material 与停止点

### 18.1 B批显式类型账

| category | count | authoritative owner | 结论 |
|---|---:|---|---|
| policy identity | 1 | `contracts::refs::PolicyBasisRef` | exact TC card完成 |
| new record identity | 12 | `contracts::refs` | 逐ref独立卡完成 |
| reused record identity | 1 | R06.3 `contracts::refs::AuditAppendRecordRef` | 不重复定义 |
| policy foundation | 3 | `domain::policies::{PolicyFamily,PolicyRevision,PolicyEvaluationBasis}` | family/ref/revision/digest闭环 |
| record metadata foundation | 3 | `domain::records::{ObservationRecordOrigin,RecordAuditVisibility,ObservationRecordMetadata<R>}` | typed ref、actor/time/trace/causation/visibility/cursor闭环 |
| error classifier + error | 4 | `domain::errors` | 8 + 6 + 12 classifier variants及20 top-level error variants闭环 |
| B批new explicit Rust types | 23 | 上述owner | zero duplicate heading；另复用1个existing ref |

### 18.2 field/type owner审计

| field/type | definition owner | B批use | 结论 |
|---|---|---|---|
| `BodyFreeRef` | R06.2 `contracts::refs` | 13 newtype inner | reuse_exact |
| `DigestSummary` | R06.2 `contracts::refs` | policy basis digest | reuse_exact；不hash raw body |
| `ActorSafeRef`;`ObservedAt` | R06.3 `contracts::metadata` | record metadata | reuse_exact |
| `TraceCorrelationRef`;`CausationRef` | R06.3 `contracts::refs` | optional record metadata | reuse_exact |
| `ObservationCommittedCursor` | R06.2 `contracts::metadata` | optional one-UoW commit position | reuse_exact；dual watermarks仍归post-state |
| 13 record refs | R06.5-B `contracts::refs` | `ObservationRecordMetadata<R>` type parameter | exact；无generic persisted PK |
| `PolicyBindingRef` | frozen Step14/04 infra config | resolution前locator | affected-only；不得import到domain |
| `ObservationOperationName` | R06.6 application owner | 不进入B批metadata | legal defer；origin不替代operation namespace |

### 18.3 internal affected material

| affected item | current conflict | B批裁定 | 处理时点 / blocker |
|---|---|---|---|
| R06.2 registry §19.5 record ref owner | 旧行写`domain::records TC/FC`，与public typed ref依赖方向冲突 | record objects/support仍归`domain::records`；13个record ref统一归`contracts::refs` | 本批同步registry；不是上游blocker |
| Step04 `history.rs` | planned physical file名与current logical module `domain::records`不一致 | current definition owner只认`domain::records`；不得实现双module | R06.8 affected file-layout统一；内部implementation blocker until repaired |
| frozen Step12 19-variant enum | 含expected-negative `PolicyRejected/ReadNotAllowed/HandoffNotReady`且缺basis/record mismatch | current authoritative enum只见§17 | R06.8后affected Step12 mapping；不得当前修改冻结Step12 |
| frozen Step14/04 `PolicyBindingRef(pub String)` | locator shape不能成为domain snapshot identity | infra resolution后输出`PolicyBasisRef + PolicyEvaluationBasis` | R06.8/Step14 affected audit；不得直接conversion |

以上均为详细设计内部definition/use或布局传播项，不是正式`00/01/02`上游冲突。B批未发现需要回退概要对象主语、truth owner或项目依赖的 blocker。

### 18.4 B批门禁（historical，已消费）

| gate | 结论 | 证据 / 限制 |
|---|---|---|
| 是否读取标准、A批owner与current shared type | pass | §13.1 |
| policy foundation是否可逐policy复用 | pass | §15；18-family exact tokens、immutable basis四字段 |
| 13个record identity是否闭口 | pass | §14；12 new + 1 authoritative reuse |
| metadata是否含typed ref与完整审计字段 | pass | §16.3；actor/time/trace/causation/visibility/cursor |
| metadata是否提前复制R06.6 operation namespace | no | 只固定writer origin，exact operation仍defer |
| commit cursor与dual watermark是否混淆 | no | metadata至多一个tagged UoW cursor；dual watermark来自post-state |
| `DomainError`是否有unique exact owner | pass | §17；20 variants + 3 finite classifier |
| expected negative是否仍走error | no | blocked/denied/not-ready由typed decisions承接 |
| raw body/locator/credential/provider/product是否进入foundation | no | schema与扫描均无承载字段 |
| 是否修改R06.3/R06.4 schema、R06.6、Step07+、formal03或04 | pass_no_write | 只写本专项及控制面/历史checkpoint元信息 |
| 是否伪造commit/run/test/evidence/signoff | pass_none_created | 测试仅为planned design redline |
| external upstream blocker | none | formal00/01/02足以支撑C批 |
| historical internal blocker | `03-RPR-S06-GRANULARITY=open` | 当时仍需C~G及R06.6~R06.8；Step04 module filename待R06.8同步 |
| R06.5-B gate | pass_done_waiting_user | foundation/type/error/owner/format门禁通过 |
| historical next_allowed_action | `wait_user_confirmation_before_R06.5-C` | 已由用户确认解除并被C批消费 |

### 18.5 用户确认后 R06.5-C 阅读清单（historical，已消费）

只有本专项、主控、flow、ledger与R06.2/R06.3/R06.4 checkpoint均同步为`R06.5-B_done_waiting_user`，且用户明确确认后，才读取：

1. Step06标准中policy object、factory、private decision constructor、error、逐对象停审条款。
2. 本文件§§5.1/6/10/15/17中P1~P6 inventory、existing/pending decision、policy foundation与error boundary。
3. R06.3 `ObservationReceipt`、`SafetyDisposition`、`CorrelationContext`、`SafeSignal`、`AuditProjection`、`EvidenceLinkage`及其exact state/decision/transition。
4. R06.4 `AuthenticityHint`与immutable evidence input关系；只作P6 target/result承接，不读取D/E policy材料。
5. 概要policy附录中P1~P6 candidate rule/input；逐项按current object修复，不复制18个`*PolicyId`。
6. Step09/10/12中P1~P6 affected use及L1逐policy卡粒度，只作反向缺口检查。

该历史门禁已由用户确认解除，且C批已完成。current停审与禁止范围只见§30.2~§30.3。

## 19. R06.5-C 输入、范围与 owner 裁定

### 19.1 C批执行边界

| 项 | 当前裁定 |
|---|---|
| 用户门禁 | 2026-07-18 已明确确认进入 `R06.5-C`；§18.5 阅读门禁已消费 |
| 唯一范围 | P1 `IntakeAdmissionPolicy`、P2 `SafetyDispositionPolicy`、P3 `SafeSignalPolicy`、P4 `BodyFreeLinkagePolicy`、P5 `EvidenceVisibilityPolicy`、P6 `AuthenticityHintPolicy` |
| policy物理 owner | planned `crates/domain/src/policies.rs`；不按18个policy再拆crate或建立repository entity |
| decision逻辑 owner | P1 `domain::intake`、P2 `domain::safety`、P3 `domain::signal`、P5 `domain::{evidence,audit}`、P6 `domain::handoff`；P4是无decision的structural guard |
| private constructor | decision constructor一律 `pub(crate)`，只允许对应policy调用；application、entry、config、infra不能构造或反序列化decision |
| current允许同步 | 本专项；R06.3/R06.4中被C批直接影响的decision/member说明；主控、flow、ledger及R06.2~R06.4 checkpoint |
| current禁止范围 | P7~P18、H1~H13、R06.6~R06.8、Step07~19正文、formal `03`、任何`04`或实现代码 |

### 19.2 已读取输入与结论

| 输入 | C批使用结论 |
|---|---|
| Step 06 SOP / 书写规范 | 每个policy必须独立给出capability、字段、factory、完整evaluate签名、输出、错误、字段来源、下游use和对象停审 |
| R06.3 intake/safety | receipt与disposition才拥有状态；policy只返回target-bound decision，不能直接改state或构造record |
| R06.3 signal | 复用`SignalDecision`；概要`SafeLabelSet`无可信body-free来源，继续保持HX，改用finite label assessment而非label map |
| R06.3 audit/evidence | P4只校验typed structural input；P5复用linkage/projection visibility decision；Missing与NotVisible必须分开 |
| R06.4 handoff/authenticity | P6只评估已绑定handoff的immutable `EvidenceIndexInputView`；`AuthenticityHint`仍是唯一mutable state owner |
| 概要P1~P6 | policy名称与capability保留；18个`*PolicyId`、`default_for_scope`和自由规则对象不生成 |
| frozen Step09/10/12 | 只用于发现旧signature、旧bare enum与expected-negative error；C批登记affected use，不修改冻结文件 |
| L1粒度参考 | 采用逐policy schema/field/signature/redline粒度；不复制其generic policy result或相邻域truth |

### 19.3 统一构造、basis与零副作用规则

六个policy均为immutable value object。构造顺序固定为：infra registry先把`PolicyBindingRef`解析为validated `PolicyEvaluationBasis`和typed finite rules，composition root再调用具体policy factory；factory第一步执行`basis.require_family(expected)`。policy不持有binding、registry handle、rule body、clock、repository、resolver、adapter、actor profile或business authorization。

所有decision新增或复用时都必须保存完整`PolicyEvaluationBasis`，不能只保存`PolicyBasisRef`或revision。消费对象先做target/scope/state snapshot binding，再读取outcome；binding失败返回`RelationMismatch(DecisionBinding)`且zero mutation。P4成功只说明本次typed structural input没有越界，不等于linkage已`Linked`、可见或可交接。

### 19.4 typed rule material 与 basis digest绑定

具体policy factory不能只验证family后就信任调用方传入的rules。每个factory必须按以下统一framing对typed finite material做canonical encoding并重新计算`DigestSummary`，结果与`basis.basis_digest()` constant-time比较；不等返回`PolicyBasisMismatch(SnapshotDigestChanged)`且不构造policy。

```text
"l4-observability-policy" || 0x00
|| PolicyFamily exact token || 0x00
|| "material-v1" || 0x00
|| field-count(u16 big-endian)
|| repeated(field-tag-length || field-tag || value-length || canonical-value)
```

set按各卡规定的canonical key升序且duplicate已折叠；enum用exact token；table按compile-time field顺序；empty set编码count=0而不是省略字段。长度都有固定unsigned big-endian framing，禁止JSON map iteration、Debug字符串、locale排序、config原文、locator或memory layout参与digest。digest profile由`PolicyEvaluationBasis.basis_digest.profile_version`固定；unsupported profile必须在registry validation阶段拒绝，不能在domain fallback。

| family | material-v1 exact fields |
|---|---|
| P1 IntakeAdmission | `admission_rules` canonical pairs；`unresolved_source_action`；`stale_source_action` |
| P2 SafetyDisposition | six `ForbiddenBodyKind` fields按enum declaration order对应的disposition token |
| P3 SafeSignal | `formation_rules` canonical pairs；`partial_correlation_action` |
| P4 BodyFreeLinkage | `linkage_rules` canonical pairs |
| P5 EvidenceVisibility | `visibility_rules` canonical four-tuples |
| P6 AuthenticityHint | fixed single marker `non_fabricating_origin_v1`;没有可配置upgrade rule |

每个rule/set/table提供crate-private `canonical_policy_material()`；只允许concrete factory调用，不作为public config serializer。planned tests必须包含每个field改变、set顺序/duplicate等价、empty显式编码、family/schema tag隔离、digest mismatch和same digest profile round-trip。

实现owner固定为`domain::policies::material_v1`内部纯函数：`fn verify(family: PolicyFamily, fields: &[(&'static str, &[u8])], expected: &DigestSummary) -> Result<(), DomainError>`。caller先按各set/table的crate-private canonical encoder形成临时bytes slice；helper再统一加family/schema/field framing。v1算法沿用`DigestValue`已冻结的SHA-256；该函数不需要新trait、port、config或I/O。当前Step04未列`material_v1`子模块且Step03未锁定具体SHA crate，登记为R06.8 file/dependency affected项；在统一前实现不得另造application/infra digest service或使用默认hasher。

## 20. P1 / P2 shared finite carrier 与 decision schema

### 20.1 `IntakeAdmissionRule`

```rust
/// One allowed source-family and submission-purpose pair for intake admission.
pub struct IntakeAdmissionRule {
    /// External family represented by the structured source reference.
    source_family: SourceFamilyKind,
    /// Observation-side purpose allowed for that family.
    purpose: SubmissionPurpose,
}
```

| 契约项 | exact rule |
|---|---|
| owner / source | `domain::policies`；validated P1 registry snapshot中的finite pair |
| factory | `pub fn new(source_family: SourceFamilyKind, purpose: SubmissionPurpose) -> Self` |
| member | `pub fn matches(&self, source_family: SourceFamilyKind, purpose: SubmissionPurpose) -> bool`；`canonical_key()`按两个exact token编码 |
| invariant | 不含source object ref、event id、locator、actor、route或动态字符串；pair只表示本仓准入兼容性 |
| planned tests | 9x6 finite pair、same pair equality、canonical ordering、source/purpose交叉误配 |

### 20.2 `IntakeAdmissionRuleSet`

```rust
/// Canonical set of intake admission rules.
pub struct IntakeAdmissionRuleSet(Vec<IntakeAdmissionRule>);
```

Factory为`pub fn from_rules(rules: Vec<IntakeAdmissionRule>) -> Self`：按`source_family token + purpose token`排序并折叠exact duplicate。由于两个输入enum分别只有9与6个variant，规范化结果天然不超过54；空集是显式deny-all snapshot，不得由missing config或default产生。members为`allows(family, purpose)`、`contains_family(family)`、`as_slice()`。

该set是已验证basis material的typed投影，不替代`basis_digest`。新增source/purpose必须先重开对应contracts enum、P1 compatibility、Step08 producer map和测试；空集只有在resolved snapshot明确声明deny-all且digest覆盖该事实时才有效，loader缺项不能偷偷降级为空集。

### 20.3 `NonResolvedSourceAction`

```rust
/// Finite admission action for a structurally valid but non-resolved source snapshot.
pub enum NonResolvedSourceAction {
    /// Reject the intake without creating downstream observation truth.
    Reject,
    /// Keep an explicitly degraded observation-side receipt.
    Degrade,
}
```

token为`reject/degrade`。P1分别保存unresolved与stale动作；`Invalid`不使用本enum而是`ReferenceBoundaryViolation`。`Degrade`只能产生typed `DegradedReason::UnresolvedReference`或`DegradedReason::Stale`，不能default为Accepted。planned tests覆盖两个token、unknown拒绝和Invalid不可映射。

### 20.4 `AdmissionDecisionKind`

```rust
/// Finite target transition selected by the intake admission policy.
pub enum AdmissionDecisionKind {
    /// Admit the receipt with its exact eligible safety disposition.
    Accept,
    /// Reject the receipt for a finite intake reason.
    Reject(IntakeRejectReason),
    /// Isolate the receipt for a finite quarantine reason.
    Quarantine(QuarantineReason),
    /// Retain only explicit degraded observation semantics.
    Degrade(DegradedReason),
}
```

`Accept`不是source/business acceptance；`Reject/Quarantine/Degrade`是expected negative outcome，不是`DomainError`。enum仅在domain crate内部传递，不建立public wire fallback。每个payload必须直接进入匹配的`ObservationReceiptTransition`，不得从message重建。

### 20.4.1 intake / safety complete snapshots

```rust
/// Complete body-free receipt revision observed by an intake policy.
pub struct ObservationReceiptPolicySnapshot {
    receipt_ref: ObservationReceiptRef,
    source_ref: ObservationSourceRef,
    admission_state: ObservationReceiptState,
    safety_disposition_ref: Option<SafetyDispositionRef>,
    submission_purpose: SubmissionPurpose,
    received_at: ObservedAt,
}

/// Complete body-free safety-disposition revision observed by a policy.
pub struct SafetyDispositionPolicySnapshot {
    disposition_ref: SafetyDispositionRef,
    receipt_ref: ObservationReceiptRef,
    state: SafetyDispositionState,
    redaction_marker: RedactionMarker,
    forbidden_body: ForbiddenBodyFlag,
    sanitized_summary_ref: Option<SafeSignalSummaryRef>,
}
```

两者owner分别为`domain::intake`与`domain::safety`。`from_receipt` / `from_disposition`逐字段exact-copy；`applies_to`逐字段比较，不提供public field constructor、serde decode或mutation。它们不是第二truth，只是短生命周期decision内的immutable observed revision；`received_at`等immutable字段也必须比较，防止corrupt rehydrate或错误对象替换被state-only检查漏过。

### 20.5 `AdmissionDecision`

```rust
/// Policy-basis- and target-bound admission decision for one received receipt.
pub struct AdmissionDecision {
    /// Exact immutable policy snapshot used for this decision.
    policy_basis: PolicyEvaluationBasis,
    /// Complete receipt revision governed by this decision.
    receipt_snapshot: ObservationReceiptPolicySnapshot,
    /// Complete post-safety disposition revision evaluated with the receipt.
    disposition_snapshot: SafetyDispositionPolicySnapshot,
    /// Finite admission outcome.
    kind: AdmissionDecisionKind,
}
```

| 函数 | exact contract |
|---|---|
| `pub(crate) fn new(...) -> Self` | 唯一调用者P1；全部字段一次性构造，不提供builder/default/serde decode |
| `pub fn applies_to(&self, receipt: &ObservationReceipt, disposition: &SafetyDisposition) -> bool` | 两个complete snapshot逐字段匹配，且disposition receipt relation等于receipt snapshot |
| `pub fn kind(&self) -> &AdmissionDecisionKind` | 只读，不消费或修改decision |
| `pub fn policy_basis(&self) -> &PolicyEvaluationBasis` | 为record/diagnostic映射提供body-free basis inspection |
| `pub(crate) fn proves_accepted_transition(&self, transition: &ObservationReceiptTransition, post_receipt: &ObservationReceipt, post_disposition: &SafetyDisposition, safety_decision: &SafetyDispositionDecision) -> bool` | H1 sibling records module专用；比较P1/P2 complete snapshots、transition previous/change与两个post-state，不重新evaluate policy |

`AdmissionDecision`不保存raw material、safe summary body、actor、config locator或外部source状态正文。不同receipt、source identity、purpose、disposition或basis的decision不可复用；planned tests覆盖每一维mismatch、四outcome、payload total match和Debug body scan。

### 20.6 `ForbiddenBodyDisposition`

```rust
/// Finite terminal handling for a detected forbidden-body class.
pub enum ForbiddenBodyDisposition {
    /// Reject unsafe material while retaining only typed body-free evidence.
    Reject,
    /// Quarantine unsafe material for an explicit observation-side boundary fact.
    Quarantine,
}
```

token为`reject/quarantine`；不含Accept、Ignore、LogOnly或动态action。P2只在`ForbiddenBodyFlag::Detected`且存在matching `ForbiddenBodyEvidence`时读取；无forbidden body时该字段不改变clean/redacted结果。

### 20.7 `SafetyDispositionDecisionKind`

```rust
/// Finite state transition selected by the redaction-first safety policy.
pub enum SafetyDispositionDecisionKind {
    /// Accept a clean body-free summary.
    MarkSafe(SafeSignalSummaryRef),
    /// Accept a redacted body-free summary.
    MarkRedacted(SafeSignalSummaryRef),
    /// Reject detected forbidden material without retaining that material.
    RejectUnsafe(ForbiddenBodyEvidence),
    /// Isolate the candidate and retain optional typed forbidden-body evidence.
    Quarantine {
        reason: QuarantineReason,
        evidence: Option<ForbiddenBodyEvidence>,
    },
}
```

`Unchecked + no summary`固定产生`Quarantine { reason: RedactionIncomplete, evidence: None }`；Clean/Redacted只能进入对应variant；Detected只能进入RejectUnsafe或`Quarantine { reason: ForbiddenBodyDetected, evidence: Some(...) }`。这样H1可以审计被丢弃材料的finite class，同时不把正文带入state。expected quarantine/rejection不走error，非法marker/flag/summary/evidence组合才返回`SafetyBoundaryViolation`。

### 20.8 `SafetyDispositionDecision`

```rust
/// Policy-basis- and target-bound safety decision for one pending disposition.
pub struct SafetyDispositionDecision {
    /// Exact immutable policy snapshot used for this decision.
    policy_basis: PolicyEvaluationBasis,
    /// Complete receipt revision observed during evaluation.
    receipt_snapshot: ObservationReceiptPolicySnapshot,
    /// Complete pending disposition revision observed before mutation.
    disposition_snapshot: SafetyDispositionPolicySnapshot,
    /// Exact body-free material summary classified by the policy.
    material_summary: ReceivedMaterialSummary,
    /// Exact body-free evaluation context used by the policy.
    evaluation_context: SafetyEvaluationContext,
    /// Finite accepted safety transition.
    kind: SafetyDispositionDecisionKind,
}
```

| 函数 | exact contract |
|---|---|
| `pub(crate) fn new(...) -> Self` | 唯一调用者P2；constructor位于`domain::safety`可见边界 |
| `pub fn applies_to_pre_state(&self, disposition: &SafetyDisposition, receipt: &ObservationReceipt) -> bool` | 两个complete snapshots逐字段匹配，summary/context仍与snapshot source/purpose相容，且disposition snapshot为Pending；只供mutation前调用 |
| `pub fn proves_post_state(&self, disposition: &SafetyDisposition, receipt: &ObservationReceipt) -> bool` | receipt仍与complete snapshot相等；disposition identity/relation不变，并total比较kind与mutation后的Safe/Redacted/Rejected/Quarantined及summary/flag组合 |
| `pub fn kind(&self) -> &SafetyDispositionDecisionKind` | 只读outcome |
| `pub fn policy_basis(&self) -> &PolicyEvaluationBasis` | 只读basis |
| `pub(crate) fn proves_accepted_transition(&self, transition: &SafetyDispositionTransition, post_disposition: &SafetyDisposition, receipt: &ObservationReceipt) -> bool` | H1 sibling records module专用；比较complete pre-snapshot、accepted change payload和post conditional matrix |

decision不含redaction rule body、detected bytes/hash、provider message、actor profile或visibility授权。planned tests覆盖target/source mismatch、四kind、post-state mismatch、Detected无evidence、wrong summary ref和zero-mutation consumption。

## 21. P1 `IntakeAdmissionPolicy`

### 21.1 capability / object source

P1只判断一个已创建`ObservationReceipt`能否根据其immutable source-purpose、一个P2 safety decision及same-UoW disposition post-state进入Accepted、Rejected、Quarantined或Degraded。它不创建receipt、不查询current receipt唯一键、不执行redaction，也不拥有source truth。repository发现的`ConflictingCurrentReceipt`继续由application唯一键冲突映射，不伪装成P1已观察事实。

### 21.2 exact Rust schema

```rust
/// Immutable intake-admission policy over one resolved rule snapshot.
pub struct IntakeAdmissionPolicy {
    /// Exact immutable policy snapshot for the intake-admission family.
    basis: PolicyEvaluationBasis,
    /// Canonical source-family and purpose compatibility rules.
    admission_rules: IntakeAdmissionRuleSet,
    /// Explicit action for an unresolved source snapshot.
    unresolved_source_action: NonResolvedSourceAction,
    /// Explicit action for a stale source snapshot.
    stale_source_action: NonResolvedSourceAction,
}
```

| 字段 | exact source | invariant |
|---|---|---|
| `basis` | infra registry已验证的immutable snapshot | family必须`IntakeAdmission`；不得从`PolicyBindingRef`直接构造 |
| `admission_rules` | 同一snapshot的typed rule projection | canonical；empty仅代表显式deny-all，不是missing config fallback |
| `unresolved_source_action` | 同一snapshot finite token | 只可Reject/Degrade；不允许Accept |
| `stale_source_action` | 同一snapshot finite token | 只可Reject/Degrade；不允许凭clock判定stale |

### 21.3 factory / evaluate / output

```rust
impl IntakeAdmissionPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        admission_rules: IntakeAdmissionRuleSet,
        unresolved_source_action: NonResolvedSourceAction,
        stale_source_action: NonResolvedSourceAction,
    ) -> Result<Self, DomainError>;

    pub fn evaluate(
        &self,
        receipt: &ObservationReceipt,
        disposition: &SafetyDisposition,
        safety_decision: &SafetyDispositionDecision,
    ) -> Result<AdmissionDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

| evaluate阶段 | exact check / outcome |
|---|---|
| basis | constructor已`require_family(PolicyFamily::IntakeAdmission)`；evaluation不得替换basis |
| target state | receipt只允许Received/Degraded；disposition必须属于receipt且为P2 decision的same-UoW post-state |
| safety binding | P2 member已用`applies_to_pre_state`接受decision；P1只调用`proves_post_state`并要求loaded disposition与decision的terminal outcome total match |
| compatibility | 先检查family/purpose：family无rule时Reject(SourceNotAllowed)，pair缺失时Reject(PurposeNotAllowed)；不允许禁用pair借Unresolved/Stale分支Degrade |
| source Invalid | `Err(ReferenceBoundaryViolation)`；invalid snapshot不是正常准入分支 |
| source Unresolved/Stale | 按两个explicit action返回Reject(MissingRequiredSafeInput)或Degrade(UnresolvedReference/Stale)；不得继续Accepted |
| safe/redacted | P2 MarkSafe/MarkRedacted且post-state一致时Accept |
| forbidden reject | P2 RejectUnsafe时Reject(ForbiddenBodyDetected) |
| quarantine | P2 `Quarantine { reason, evidence }`时P1原样映射reason；typed evidence继续留在P2 decision/safety transition供H1审计，不塞进receipt |

`AdmissionDecision::new`是P1唯一output constructor。decision保存P1 basis、receipt observed state、完整source snapshot、purpose、disposition observed post-state及kind；`ObservationReceipt::apply_admission(&mut self, disposition: &SafetyDisposition, decision: &AdmissionDecision) -> Result<ObservationReceiptTransition, DomainError>`是唯一public消费入口。原`accept/reject/quarantine/degrade`降为owning module private transition helpers，不允许application绕过P1直接调用。decision按借用消费，accepted UoW可继续把两个policy basis交给F批record factory。

### 21.4 exact error / zero side effect

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(UnexpectedFamily)` | P1 factory收到非IntakeAdmission basis |
| `RelationMismatch(Subject)` | disposition或safety decision不属于receipt/source |
| `RelationMismatch(StateSnapshot)` | decision与disposition post-state或source snapshot不一致 |
| `RelationMismatch(DecisionBinding)` | P2 decision target、observed state或basis不能用于当前loaded对象 |
| `InvalidStateTransition` | receipt不在Received/Degraded或disposition仍Pending |
| `ReferenceBoundaryViolation` | source snapshot为Invalid或跨owner family |
| `SafetyBoundaryViolation` | safety decision kind与post-state marker/flag/summary组合无法同时成立 |

Reject、Quarantine和Degrade都不是error。所有`Err`都不修改receipt/disposition，不创建AdmissionDecision、transition、record、outbox或identity；P1没有repository、clock、resolver、adapter、config和I/O依赖。

### 21.5 downstream use / planned test redlines / stop review

| affected use | C批裁定 |
|---|---|
| R06.3 `ObservationReceipt` | 新增唯一public `apply_admission`；decision exact binding后才调用private transition helper |
| frozen Step09 intake flow | 旧`evaluate(source,purpose,disposition)`和application match bare enum标记affected；后续改为P2 decision -> disposition post-state -> P1 decision -> `apply_admission` |
| frozen Step10 | 四个receipt目标状态保持不变；policy不创建receipt |
| H1 record | F批消费successful receipt/safety transition与policy basis；C批不生成record |

planned tests必须覆盖：54 pair universe、explicit deny-all、family-vs-purpose reason、Resolved/Unresolved/Stale/Invalid、P2四kind、decision跨receipt/source snapshot/purpose/disposition/basis复用、Degraded reevaluation、duplicate current receipt不由P1伪造、error zero mutation、raw body/locator/actor/config字段扫描。对象停审：`pass_R06.5-C_P1_design_only`。

## 22. P2 `SafetyDispositionPolicy`

### 22.1 capability / object source

P2对一个Pending `SafetyDisposition`及其exact receipt/summary/context执行redaction-first有限分类。scanner/resolver在进入domain前已丢弃正文并形成`ReceivedMaterialSummary`与可选`ForbiddenBodyEvidence`；P2不扫描、不脱敏、不读取规则正文，只校验typed组合并产生target-bound decision。

### 22.2 exact Rust schema

```rust
/// Immutable redaction-first safety policy over one resolved rule snapshot.
pub struct SafetyDispositionPolicy {
    /// Exact immutable policy snapshot for the safety-disposition family.
    basis: PolicyEvaluationBasis,
    /// Handling selected for every detected forbidden-body class.
    forbidden_body_dispositions: ForbiddenBodyDispositionTable,
}

/// Total finite mapping from forbidden-body class to terminal handling.
pub struct ForbiddenBodyDispositionTable {
    raw_payload: ForbiddenBodyDisposition,
    secret_material: ForbiddenBodyDisposition,
    credential_material: ForbiddenBodyDisposition,
    provider_response_body: ForbiddenBodyDisposition,
    external_object_body: ForbiddenBodyDisposition,
    sensitive_reference_or_locator: ForbiddenBodyDisposition,
}
```

`ForbiddenBodyDispositionTable::new(...) -> Self`要求六个named参数，因此不存在missing/default/unknown branch；member `disposition_for(kind: ForbiddenBodyKind) -> ForbiddenBodyDisposition`必须total match六variant。表只保存finite action，不保存pattern、regex、secret、body、hash、locator或provider name。

| policy字段 | exact source | invariant |
|---|---|---|
| `basis` | registry immutable snapshot | family必须`SafetyDisposition` |
| `forbidden_body_dispositions` | 同snapshot的validated finite projection | 六kind完整；任何kind都不能映射Accept/Ignore/LogOnly |

### 22.3 factory / evaluate / output

```rust
impl SafetyDispositionPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        forbidden_body_dispositions: ForbiddenBodyDispositionTable,
    ) -> Result<Self, DomainError>;

    pub fn evaluate(
        &self,
        receipt: &ObservationReceipt,
        disposition: &SafetyDisposition,
        summary: &ReceivedMaterialSummary,
        context: &SafetyEvaluationContext,
        forbidden_body_evidence: Option<&ForbiddenBodyEvidence>,
    ) -> Result<SafetyDispositionDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

| input组合 | exact decision |
|---|---|
| NotDetected + Clean + Some summary | `MarkSafe(exact summary ref)` |
| NotDetected + Redacted + Some summary | `MarkRedacted(exact summary ref)` |
| NotDetected + Unchecked + None | `Quarantine { RedactionIncomplete, None }`；安全边界尚未闭合，不默认success |
| Detected + Unchecked + None + matching evidence | table为Reject时`RejectUnsafe(evidence clone)`；为Quarantine时`Quarantine { ForbiddenBodyDetected, Some(evidence clone) }` |
| 任何其他marker/flag/summary/evidence组合 | `Err(SafetyBoundaryViolation)`；不生成expected outcome |

所有分支先校验：receipt state为Received/Degraded；disposition为Pending且属于receipt；summary source的id/family/object/snapshot与receipt source exact equal；context purpose等于receipt purpose；context actor只保留为审计责任输入，不参与业务授权；visibility constraint ref不能绕过forbidden-body规则。`forbidden_body_evidence`在NotDetected时必须None，在Detected时必须Some且source exact match。

`SafetyDispositionDecision::new`是P2唯一output constructor。`SafetyDisposition::apply_decision(&mut self, receipt: &ObservationReceipt, decision: &SafetyDispositionDecision) -> Result<SafetyDispositionTransition, DomainError>`成为唯一public mutation入口；旧`mark_safe/mark_redacted/reject_unsafe/quarantine`降为private helpers。P2 decision携带evaluation前Pending state，member通过`applies_to_pre_state`后原子写入对应terminal state并返回existing transition delta；`SafetyDispositionTransition::Quarantined`受影响扩展为`{ from, reason, evidence: Option<ForbiddenBodyEvidence> }`，且ForbiddenBodyDetected要求Some、其他reason要求None。decision按借用消费，随后P1用`proves_post_state`验证同一accepted change。

### 22.4 exact error / zero side effect

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(UnexpectedFamily)` | P2 factory收到非SafetyDisposition basis |
| `RelationMismatch(Subject)` | receipt/disposition/summary/evidence source关系不一致 |
| `RelationMismatch(StateSnapshot)` | disposition initial fields与summary marker/flag/ref不一致 |
| `InvalidStateTransition` | receipt不可评估或disposition不是Pending |
| `MissingRequiredReference` | Detected缺evidence，或Clean/Redacted缺safe summary ref |
| `SafetyBoundaryViolation` | marker/flag/summary/evidence组合非法，或试图把Detected变成safe/redacted |
| `BodyFreeBoundaryViolation` | typed边界之外仍检测到raw body/locator/credential/provider payload输入 |

RejectUnsafe与Quarantine是decision outcome，不是error。`Err`不修改disposition，不清理/替换summary，不创建transition/record/outbox；P2不调用scanner、resolver、repository、clock或adapter。

### 22.5 downstream use / planned test redlines / stop review

| affected use | C批裁定 |
|---|---|
| R06.3 `SafetyDisposition` | 新增`apply_decision`；四个裸mutation入口降private；existing transition shape复用 |
| P1 | 只消费P2 decision + same-UoW post-state；不能从state alone重建quarantine reason |
| frozen Step09 intake flow | 旧`SafetyDisposition::evaluate`后直接P1的顺序标记affected；后续插入P2 evaluate/apply |
| H1 record | F批可消费safety transition和P2 basis，但C批不决定record branch schema |

planned tests必须覆盖六kind x 两action、clean/redacted/unclosed/detected矩阵、Detected缺/错evidence、source/purpose/snapshot mismatch、terminal disposition重评、visibility constraint不能绕过、decision跨target/basis复用、error zero mutation、serialization/Debug无body/hash/locator/credential/provider message。对象停审：`pass_R06.5-C_P2_design_only`。

## 23. P3 `SafeSignalPolicy`

### 23.1 capability / object source

P3只判断一个已存在的`SafeSignal::Candidate`能否成为Recorded，或必须以finite reason进入Suppressed。它消费candidate、其loaded correlation context及safe-summary mapper给出的target-bound assessment；不读取log line、metric series、span/event、label map、runtime payload或execution result，也不裁决execution truth。

### 23.2 finite rule / assessment carrier

```rust
/// One allowed source-family and safe-signal-kind pair.
pub struct SignalFormationRule {
    source_family: SourceFamilyKind,
    signal_kind: SafeSignalKind,
}

/// Canonical set of allowed source-family and safe-signal-kind pairs.
pub struct SignalFormationRuleSet(Vec<SignalFormationRule>);

/// Body-free result of label-safety inspection for one safe summary.
pub enum SafeLabelAssessment {
    /// The signal family carries no labels requiring assessment.
    NoLabels,
    /// Labels were reduced to an accepted bounded, non-sensitive shape.
    Bounded,
    /// Label cardinality exceeded the accepted finite boundary.
    UnsafeCardinality,
    /// Forbidden or sensitive label material was detected and discarded.
    ForbiddenMaterialDiscarded,
}

/// Finite policy action for a partially bound correlation context.
pub enum PartialCorrelationAction {
    /// Permit recording while preserving Partial as an observation-side limitation.
    Record,
    /// Suppress normal signal output until correlation becomes usable.
    Suppress,
}
```

`SignalFormationRule::new(family, kind)`与`matches`不接收string。`SignalFormationRuleSet::from_rules`按两个exact token排序、折叠duplicate，空集只表示digest覆盖的explicit deny-all；9x4组合天然最多36。`SafeLabelAssessment` token固定`no_labels/bounded/unsafe_cardinality/forbidden_material_discarded`；它不携带label key/value/count、阈值或hash。`PartialCorrelationAction`固定`record/suppress`，不允许默认Record。

```rust
/// Immutable target-bound safety assessment supplied for one safe-signal candidate.
pub struct SafeSignalEvaluationSnapshot {
    signal_ref: SafeSignalRef,
    summary_ref: SafeSignalSummaryRef,
    signal_kind: SafeSignalKind,
    label_assessment: SafeLabelAssessment,
}

/// Complete body-free correlation snapshot observed by one signal evaluation.
pub struct SignalCorrelationSnapshot {
    context_ref: CorrelationContextRef,
    receipt_ref: ObservationReceiptRef,
    source_ref: ObservationSourceRef,
    observed_state: CorrelationContextState,
    pending_seed: Option<CorrelationSeed>,
    trace_ref: Option<TraceCorrelationRef>,
    causation_ref: Option<CausationRef>,
    subject_ref: Option<SubjectObservationReference>,
    runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
}
```

`SafeSignalEvaluationSnapshot::from_resolver_result(signal_ref, summary_ref, signal_kind, label_assessment) -> Self`只接受Step07 safe-summary resolver的finite output；public accessors为四字段只读值及`applies_to(&SafeSignal)`。frozen Step07 `RuntimeSandboxSafeSummary` / source-safe summary result缺少`label_assessment`，登记affected；protocol caller不能直接提交`SafeLabelAssessment`。snapshot不含raw label、metric value、span、log line、provider metadata或resolver message，也不生成额外“assessment proof”identity。

`SignalCorrelationSnapshot::from_context(context: &CorrelationContext) -> Self` exact-copy全部字段；subject/runtime structured ref只保留identity + snapshot/state，pending seed本身已body-free。`applies_to(context)`逐字段比较，包括Bound同态runtime追加、Partial seed替换和subject/runtime snapshot，不允许只比较context state。该snapshot owner为`domain::signal`，无public/serde constructor，不含business correlation、Identity profile或execution truth。

### 23.3 reused `SignalDecision` authoritative extension

canonical Rust declaration只见R06.3专项§9.21；本节不重复声明existing type，只记录P3引入的affected field与producer约束：

| field | exact type | C批 extension rule |
|---|---|---|
| `policy_basis` | `PolicyEvaluationBasis` | 保存P3使用的完整family/ref/revision/digest |
| `signal_ref` | `SafeSignalRef` | exact candidate target |
| `observed_signal_state` | `SafeSignalState` | evaluation时必须为Candidate |
| `correlation_snapshot` | `SignalCorrelationSnapshot` | complete correlation revision，不是context ref-only |
| `summary_ref` | `SafeSignalSummaryRef` | 与candidate及assessment逐项一致 |
| `signal_kind` | `SafeSignalKind` | 与candidate及formation rule一致 |
| `label_assessment` | `SafeLabelAssessment` | 只能来自trusted safe-summary resolver result |
| `runtime_signal_snapshot` | `Option<RuntimeSandboxSignalRef>` | 保存完整optional runtime boundary revision |
| `kind` | `SignalDecisionKind` | finite Record/Suppress outcome |

这是R06.3既有`SignalDecision`的C批最小扩展，不生成第二类型。`pub(crate) fn new(...) -> Self`仅P3可调用；`applies_to(signal, context, assessment)`必须比较target/state、complete correlation snapshot、summary/kind/label assessment及完整optional signal runtime snapshot；`kind()`和`policy_basis()`只读。decision不保存rule set、execution id或label map。

### 23.4 exact policy schema / signatures

```rust
/// Immutable safe-signal policy over one resolved rule snapshot.
pub struct SafeSignalPolicy {
    basis: PolicyEvaluationBasis,
    formation_rules: SignalFormationRuleSet,
    partial_correlation_action: PartialCorrelationAction,
}

impl SafeSignalPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        formation_rules: SignalFormationRuleSet,
        partial_correlation_action: PartialCorrelationAction,
    ) -> Result<Self, DomainError>;

    pub fn evaluate(
        &self,
        signal: &SafeSignal,
        context: &CorrelationContext,
        assessment: &SafeSignalEvaluationSnapshot,
    ) -> Result<SignalDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

| evaluation顺序 | exact outcome |
|---|---|
| basis / target | family必须`SafeSignal`；signal必须Candidate；complete correlation snapshot与assessment四字段必须exact match |
| source-kind | pair不在`formation_rules`时`Suppress(UnsupportedSignalKind)` |
| correlation Invalid | `Suppress(CorrelationInvalid)`；不把opaque hint冲突解释为business truth |
| correlation Unbound | `Suppress(ReferenceUnavailable)` |
| correlation Partial | 根据explicit action Record或`Suppress(ReferenceUnavailable)` |
| label UnsafeCardinality | `Suppress(UnsafeLabelCardinality)` |
| label ForbiddenMaterialDiscarded | `Suppress(SafetyBoundaryNotClosed)`；detected material不进入decision |
| optional runtime Available | summary ref必须等于signal summary，继续Record候选 |
| optional runtime Degraded | safe summary仍匹配时允许Record；degraded只保留在structured ref，不宣称execution success |
| optional runtime Missing | `Suppress(ReferenceUnavailable)` |
| optional runtime NotVisible | `Suppress(VisibilityRestricted)`；不写成missing |
| all checks closed | `SignalDecisionKind::Record` |

固定优先级为relation/invariant error -> unsupported pair -> correlation -> label -> runtime -> Record，因此同一输入只产生一个deterministic outcome。normal Suppress不是error。P3没有`requires_degraded_output`第二判断入口；重复判断会造成同一basis下两个结果源，已降为historical material。

`SafeSignal::apply_decision(&mut self, context: &CorrelationContext, decision: &SignalDecision) -> Result<SafeSignalTransition, DomainError>`继续是唯一policy消费入口；它先执行扩展后的`applies_to`，再把Record/Suppress映射到既有transition。裸`SafeSignal::suppress(reason)`降为module-private helper，application不能绕过P3；借用decision使accepted UoW后续record/audit mapping仍可读取basis。

### 23.5 exact error / downstream / planned tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(UnexpectedFamily)` | P3 factory收到非SafeSignal basis |
| `RelationMismatch(Subject)` | signal/context/runtime或assessment target不一致 |
| `RelationMismatch(StateSnapshot)` | observed state、source snapshot、summary/kind/runtime availability发生变化 |
| `RelationMismatch(DecisionBinding)` | decision不能被当前signal/context消费 |
| `InvalidStateTransition` | signal不是Candidate；Suppressed terminal不能重评 |
| `CorrelationConflict` | same context identity出现冲突source/runtime binding，不能作为normal Partial处理 |
| `SafetyBoundaryViolation` | assessment声称bounded但safe summary relation不成立 |
| `BodyFreeBoundaryViolation` | 调用方试图把raw labels/payload作为assessment输入 |

所有error保持signal/context不变，不创建decision/transition/rollup/record/outbox。affected frozen Step09中的`evaluate(context, summary_ref, kind)`需后续改为candidate + exact assessment；Step10 Recorded/Suppressed目标不变；H2/H3 record选择留F批。planned tests覆盖36 pair、explicit empty、四context state、四label assessment、四runtime availability与None、summary/runtime mismatch、decision跨basis/target/state复用、priority table、Suppressed terminal、zero mutation和body/label/provider字段扫描。对象停审：`pass_R06.5-C_P3_design_only`。

## 24. P4 `BodyFreeLinkagePolicy`

### 24.1 capability / object source

P4是C批唯一无decision output的structural guard。它校验一个loaded audit projection、structured governance/artifact/evidence boundary、consumer purpose/scope和digest能否共同形成`EvidenceLinkage::Candidate`。成功只表示本次typed inputs满足body-free结构，不表示Visible、Linked、authentic、accepted或handoff-ready；后续状态只能由P5 decision和`EvidenceLinkage` member推进。

### 24.2 finite compatibility carrier

```rust
/// One structurally allowed external-reference family and evidence-purpose pair.
pub struct BodyFreeLinkageRule {
    reference_family: GovernanceArtifactEvidenceFamily,
    purpose: EvidenceConsumerPurpose,
}

/// Canonical set of structurally allowed body-free linkage pairs.
pub struct BodyFreeLinkageRuleSet(Vec<BodyFreeLinkageRule>);
```

`BodyFreeLinkageRule::new(family, purpose)`与`matches`只用finite enum。`BodyFreeLinkageRuleSet::from_rules`按family/purpose token排序并折叠duplicate；4x4组合天然最多16；empty只代表basis digest覆盖的explicit deny-all。set不含URI、path、provider、artifact/evidence body、regex、credential、actor或consumer identity。

### 24.3 exact policy schema / signatures

```rust
/// Immutable structural guard for one body-free evidence-linkage candidate.
pub struct BodyFreeLinkagePolicy {
    basis: PolicyEvaluationBasis,
    linkage_rules: BodyFreeLinkageRuleSet,
}

impl BodyFreeLinkagePolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        linkage_rules: BodyFreeLinkageRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn validate(
        &self,
        projection: &AuditProjection,
        boundary_ref: &GovernanceArtifactEvidenceReference,
        purpose: EvidenceConsumerPurpose,
        consumer_scope: &EvidenceConsumerScope,
        digest_summary: &DigestSummary,
    ) -> Result<(), DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

### 24.4 exact loaded checks / error / zero side effect

| check order | success condition | failure |
|---|---|---|
| basis | family=`BodyFreeLinkage` | `PolicyBasisMismatch(UnexpectedFamily)` at factory |
| projection | source fact appended；state Appended或VisibilityRestricted | `InvalidStateTransition` |
| purpose/scope | `consumer_scope.purpose == purpose`，完整scope已通过contracts factory | `RelationMismatch(Scope)` |
| family-purpose | pair在`linkage_rules` | `ReferenceBoundaryViolation`；这是structural incompatibility，不是NotVisible |
| boundary state | Linked或NotVisible；Missing不建linkage；Invalid terminal | Missing=`MissingRequiredReference`；Invalid=`ReferenceBoundaryViolation` |
| digest | boundary持有Some且exact等于参数 | absent=`MissingRequiredReference`；mismatch=`ReferenceConflict` |
| body-free shape | typed external safe ref、snapshot和digest均通过其canonical constructor | 越过typed mapper的raw body/locator/credential/provider payload=`BodyFreeBoundaryViolation` |

P4不接受`ExternalBodySignal`或raw bytes参数。若entry/adapter只得到正文而没有独立authenticated safe metadata，mapper不得构造`GovernanceArtifactEvidenceReference`，application fail-closed并映射`BodyFreeBoundaryViolation`。若同一resolver result同时给出独立typed boundary/digest和finite `BodyBlockedReason`，raw body必须先丢弃；application可先用safe metadata通过P4建立Candidate，再显式调用private body-block transition。不得从error message生成`BodyBlockedReason`、NotVisible或Gap，P4本身也不产生该transition。

`validate`的`Ok(())`不携带授权，application随后才能调用`EvidenceLinkage::candidate(...)`并执行P5。任一`Err`都不创建linkage、decision、transition、record、outbox或identity，不修改projection/boundary；P4无repository/resolver/config/clock/I/O。

### 24.5 downstream use / planned tests / stop review

frozen Step09旧`validate(boundary_ref,purpose)`缺projection/scope/digest，标记affected；`linkage.link(policy)`删除，改为P4 validate -> candidate -> P5 decision -> `apply_visibility`。planned tests覆盖16 pairs、explicit empty、projection三可调用/两禁用形态、scope purpose mismatch、Linked/NotVisible/Missing/Invalid、digest absent/mismatch、all reference families、raw body/locator/credential/provider negative、error不生成marker与zero side effect。对象停审：`pass_R06.5-C_P4_design_only`。

## 25. P5 `EvidenceVisibilityPolicy`

### 25.1 capability / object source

P5有两个明确能力：对一个linkage + consumer scope产生consumer-specific `EvidenceVisibilityDecision`；对一个audit projection + body-free safety snapshot产生global `AuditProjectionVisibilityDecision`。两种decision共享同一P5 basis，但target和输入集合不同，不能互换。P5只决定本仓可见性，不拥有actor authorization、Governance/Artifact/evidence truth，也不把NotVisible写成Missing。

### 25.2 consumer visibility rule carrier

```rust
/// One visible consumer-family, purpose, and external-reference-family tuple.
pub struct EvidenceVisibilityRule {
    consumer_kind: ObservationConsumerKind,
    purpose: EvidenceConsumerPurpose,
    scope_kind: ConsumerScopeKind,
    reference_family: GovernanceArtifactEvidenceFamily,
}

/// Canonical set of visible evidence tuples; absence means policy-restricted.
pub struct EvidenceVisibilityRuleSet(Vec<EvidenceVisibilityRule>);
```

`EvidenceVisibilityRule::new(...)`与`matches`只用5x4x8x4 finite values。`EvidenceVisibilityRuleSet::from_rules`按四个token排序、折叠duplicate，天然最多640；empty是explicit deny-all。rule不含actor/profile/role、consumer locator、external product或free reason。tuple缺失返回`NotVisible(PolicyRestricted)`，不是`DomainError`。完整`EvidenceConsumerScope`仍由linkage和decision exact保存；scope kind只做有限兼容，不把scope升级为业务授权。

### 25.3 projection-global safety input

```rust
/// Finite safe-boundary assessment for one audit projection revision.
pub enum AuditProjectionSafetyAssessment {
    /// Current source and linkage material remains body-free and resolvable.
    BodyFree,
    /// A required body-free source or linkage reference is unresolved.
    ReferenceUnresolved,
    /// Forbidden body material crossed an assessed boundary and was discarded.
    BodyFreeBoundaryBlocked,
    /// A validated global visibility constraint restricts this projection.
    PolicyRestricted,
}

/// Immutable target-bound input assembled from loaded projection safety material.
pub struct AuditProjectionVisibilitySnapshot {
    projection_ref: AuditProjectionRef,
    observed_projection_state: AuditProjectionState,
    subject_ref: AuditSubjectRef,
    correlation_context_ref: CorrelationContextRef,
    source_audit_ref: SourceAuditRef,
    source_audit_summary_ref: SafeExternalSummaryRef,
    source_fact_appended: bool,
    observed_latest_append_record_ref: Option<AuditAppendRecordRef>,
    linkage_refs: EvidenceLinkageRefSet,
    gap_refs: GapStateRefSet,
    visibility_reason: Option<EvidenceVisibilityReason>,
    assessment: AuditProjectionSafetyAssessment,
}

/// Complete body-free linkage snapshot observed by one visibility evaluation.
pub struct EvidenceLinkageVisibilitySnapshot {
    linkage_ref: EvidenceLinkageRef,
    projection_ref: AuditProjectionRef,
    boundary_ref: GovernanceArtifactEvidenceReference,
    evidence_purpose: EvidenceConsumerPurpose,
    consumer_scope: EvidenceConsumerScope,
    observed_state: EvidenceLinkageState,
    digest_summary: DigestSummary,
    visibility_reason: Option<EvidenceVisibilityReason>,
    body_blocked_reason: Option<BodyBlockedReason>,
}
```

Factory `AuditProjectionVisibilitySnapshot::from_loaded_boundary(projection, assessment)` exact-copy projection全部body-free字段；assessment只能来自loaded source-audit safe-reference result与typed body-free/visibility mapper。`EvidenceLinkageVisibilitySnapshot::from_linkage(linkage)`同样exact-copy linkage全部字段。两者不保存source audit/evidence body、actor或constraint body，`applies_to`逐字段比较，防止旧snapshot在同state append、gap、reason、boundary refresh或digest改变后重放。

### 25.4 reused decision authoritative extensions

canonical Rust declarations只见R06.3专项§§9.36~9.37；本节不重复声明existing types，只记录P5 affected fields与producer约束：

| existing decision | C批 exact field extension | binding scope |
|---|---|---|
| `EvidenceVisibilityDecision` | `policy_basis: PolicyEvaluationBasis`;`linkage_snapshot: EvidenceLinkageVisibilitySnapshot`;`projection_snapshot: AuditProjectionVisibilitySnapshot`;`evaluated_boundary: GovernanceArtifactEvidenceReference`;`evaluated_digest: DigestSummary`;`outcome: EvidenceVisibilityOutcome` | exact linkage + projection + embedded consumer scope + refreshed/current boundary/digest |
| `AuditProjectionVisibilityDecision` | `policy_basis: PolicyEvaluationBasis`;`projection_snapshot: AuditProjectionVisibilitySnapshot`;`outcome: EvidenceVisibilityOutcome` | exact global projection revision；不含consumer authorization |

这是R06.3两个existing decision的affected-only扩展，不生成alias。constructor均`pub(crate)`且只由P5调用。linkage decision的`applies_to(linkage, projection, evaluated_boundary, digest)`比较两个complete snapshots及refreshed boundary/digest；完整consumer scope已包含在linkage snapshot内，不能另传不同scope。projection decision的`applies_to(projection, snapshot)`比较complete observed revision。两者均提供`outcome()`和`policy_basis()`只读，不提供serde/default/public builder。

### 25.5 exact policy schema / complete signatures

```rust
/// Immutable evidence-visibility policy over one resolved rule snapshot.
pub struct EvidenceVisibilityPolicy {
    basis: PolicyEvaluationBasis,
    visibility_rules: EvidenceVisibilityRuleSet,
}

impl EvidenceVisibilityPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        visibility_rules: EvidenceVisibilityRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn evaluate_linkage(
        &self,
        linkage: &EvidenceLinkage,
        projection: &AuditProjection,
        projection_snapshot: &AuditProjectionVisibilitySnapshot,
        evaluated_boundary: &GovernanceArtifactEvidenceReference,
        evaluated_digest: &DigestSummary,
        consumer_scope: &EvidenceConsumerScope,
    ) -> Result<EvidenceVisibilityDecision, DomainError>;

    pub fn evaluate_projection(
        &self,
        projection: &AuditProjection,
        snapshot: &AuditProjectionVisibilitySnapshot,
    ) -> Result<AuditProjectionVisibilityDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

### 25.6 linkage outcome matrix

所有分支先校验basis family=`EvidenceVisibility`、linkage state为Candidate/Linked/NotVisible/Stale、`projection_snapshot.applies_to(projection)`、传入consumer scope exact等于linkage immutable scope、evaluated boundary stable identity/family/external safe ref与linkage相同、digest exact匹配。Candidate/Linked/NotVisible可用current boundary；Stale必须使用same stable identity的新snapshot。projection assessment为ReferenceUnresolved/BodyFreeBoundaryBlocked/PolicyRestricted时先映射对应NotVisible reason，不能被consumer tuple放宽。

| evaluated input | outcome |
|---|---|
| boundary Missing | `Err(MissingRequiredReference)`；不生成NotVisible |
| boundary Invalid | `Err(ReferenceBoundaryViolation)` |
| boundary NotVisible | `NotVisible(boundary.visibility_reason)`；reason缺失为`ReferenceConflict` |
| projection VisibilityRestricted/Suppressed | `NotVisible(projection reason或PolicyRestricted)`；global restriction不可被consumer rule绕过 |
| consumer/purpose/scope-kind/reference-family tuple不在visibility rules | `NotVisible(PolicyRestricted)` |
| boundary Linked + projection Appended + tuple allowed | `Visible` |
| evaluate_linkage时projection PendingAppend | `Err(RelationMismatch(StateSnapshot))`；合法linkage不可能属于未append source fact的projection |

`EvidenceLinkage::apply_visibility(&mut self, projection: &AuditProjection, evaluated_boundary: GovernanceArtifactEvidenceReference, evaluated_digest: DigestSummary, decision: &EvidenceVisibilityDecision) -> Result<Option<EvidenceLinkageTransition>, DomainError>`成为唯一public P5消费入口，并按下表dispatch到private helper：

| current / outcome | mutation |
|---|---|
| Candidate + Visible | `link`，返回Some Linked |
| Candidate/Linked + NotVisible | `mark_not_visible`，返回Some NotVisible |
| Linked + Visible且snapshot exact | `Ok(None)`，不得生成record或更新时间 |
| NotVisible + Visible且current boundary Linked | `link`，返回Some Linked |
| NotVisible + same NotVisible reason/snapshot | `Ok(None)` |
| NotVisible + changed NotVisible reason | same-state reason replacement，返回Some NotVisible；transition允许`from=NotVisible` |
| Stale + refreshed Linked boundary + Visible | `relink`，返回Some Linked |
| Stale + refreshed Linked/NotVisible boundary + NotVisible | `refresh_not_visible`，原子替换boundary/digest并返回Some NotVisible |

任何其他组合返回`InvalidStateTransition`或`DecisionBinding`且zero mutation。decision不直接mark stale；stale来自reference change transition，不从visibility outcome猜测。`EvidenceLinkageTransition::NotVisible`因此受影响允许from Candidate/Linked/NotVisible/Stale，target固定NotVisible。

### 25.7 projection outcome matrix

| snapshot / projection relation | outcome / error |
|---|---|
| snapshot target/head/state不匹配 | `RelationMismatch(StateSnapshot)` |
| assessment BodyFree且source fact appended | `Visible`；Restricted可进入显式restore，Appended无需mutation |
| assessment BodyFree但source fact未append | `NotVisible(ReferenceUnresolved)` |
| ReferenceUnresolved | `NotVisible(ReferenceUnresolved)` |
| BodyFreeBoundaryBlocked | `NotVisible(BodyFreeBoundaryBlocked)` |
| PolicyRestricted | `NotVisible(PolicyRestricted)` |
| projection Suppressed | `NotVisible(PolicyRestricted)`；reserved terminal不能restore |

global decision不携带consumer scope，不能用来授权某个query/handoff；consumer-specific assembler仍需linkage/read policy结果。`AuditProjection::restrict_visibility/restore_visibility`借用decision，在mutation前验证P5 basis与complete observed snapshot，随后才消费append ref并返回existing transition。

### 25.8 exact error / zero side effect / tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(UnexpectedFamily)` | P5 factory收到非EvidenceVisibility basis |
| `RelationMismatch(Subject/Scope)` | linkage/projection/boundary/consumer scope关系不一致 |
| `RelationMismatch(StateSnapshot)` | observed state/head/snapshot/digest与loaded对象不同 |
| `RelationMismatch(DecisionBinding)` | decision被错误member/target消费 |
| `InvalidStateTransition` | linkage/projection lifecycle不允许本次evaluation/consumption |
| `MissingRequiredReference` | evaluated boundary确为Missing或digest absent |
| `ReferenceConflict` | stable boundary identity/digest/required reason内部冲突 |
| `ReferenceBoundaryViolation` | Invalid/cross-family external boundary |
| `BodyFreeBoundaryViolation` | global safety snapshot检测到无法typed化的forbidden body输入，而调用方试图继续构造Visible |

normal NotVisible/PolicyRestricted/ReferenceUnresolved/BodyFreeBoundaryBlocked outcome不是error。任一error都不修改linkage/projection，不消费append ref，不生成transition/record/outbox/gap。planned tests覆盖640 finite tuple universe、explicit empty、all boundary/linkage/projection states、NotVisible vs Missing、refresh snapshot、consumer/scope-kind/scope identity/purpose/family mismatch、global vs consumer decision cross-use、old head replay、restrict/restore、zero mutation和body/authorization字段扫描。对象停审：`pass_R06.5-C_P5_design_only`。

## 26. P6 `AuthenticityHintPolicy`

### 26.1 capability / object source

P6对一个loaded handoff、其committed immutable `EvidenceIndexInputView`、input中每条loaded linkage的target-bound origin assessment及exact loaded gaps，产生一个`AuthenticityHintDecision`。它只说明当前body-free input的origin quality，不验证evidence内容，不生成真实alias/run id/signoff/verdict，也不把`EvidenceLinkage::Linked`或digest等同于真实证据。

### 26.2 target-bound origin assessment

```rust
/// Immutable origin assessment bound to one loaded linkage revision.
pub struct EvidenceOriginAssessment {
    linkage_snapshot: EvidenceLinkageVisibilitySnapshot,
    resolution: EvidenceOriginResolution,
}

/// Canonical non-empty assessment set matching one evidence-index input exactly.
pub struct EvidenceOriginAssessmentSet(Vec<EvidenceOriginAssessment>);
```

`EvidenceOriginResolution`的唯一Rust definition见R06.2 contracts专项§24.1，本节只import该contracts-owned type，不重复声明。其三个exact variant是`TrustedBoundary`、`Placeholder(PlaceholderReason)`与`Insufficient(AuthenticityGapReason)`，但它不是public Command字段。它必须由Step07 `GovernanceArtifactEvidenceResolver`的`EvidenceSafeSummary.origin_resolution`返回：`TrustedBoundary`只由authenticated resolver mapping产生，Placeholder只由explicit fixture/synthetic classifier产生，Insufficient只由safe unresolved/visibility basis产生。frozen Step07缺少该字段、frozen Step08却允许调用方提交`EvidenceOriginKind`，两处均登记affected；C批不修改冻结文件。

`EvidenceOriginAssessment::from_resolver_mapping(linkage, resolution) -> Result<Self, DomainError>`由application在收到上述resolver result后调用，并保存complete `EvidenceLinkageVisibilitySnapshot`。`TrustedBoundary`要求linkage Linked、boundary Linked且digest匹配；Placeholder允许Linked/NotVisible但不能声称trusted；Insufficient可表达unresolved/not-visible/open-gap类safe limitation。该factory不接受provider name、URI、run id、alias、body或free reason。

`EvidenceOriginAssessmentSet::try_for_input(input, assessments) -> Result<Self, DomainError>`按linkage ref canonical排序，拒绝duplicate；必须与`input.linkage_refs`一一相等且non-empty，不能缺项、多项或跨input复用。empty input不允许通过set factory；P6直接产出MissingImmutableInput/UnresolvedEvidenceLinkage类Insufficient。members为`as_slice`、`get(linkage_ref)`、`all_apply_to(loaded_linkages)`。

### 26.2.1 handoff / hint / linkage / gap complete snapshots

```rust
/// Complete body-free handoff revision observed by an authenticity evaluation.
pub struct AuthenticityHandoffSnapshot {
    handoff_ref: ReportHandoffRecordRef,
    handoff_scope_ref: ReportHandoffScopeRef,
    consumer_ref: ReportConsumerRef,
    state: ReportHandoffState,
    readiness: HandoffReadinessState,
    evidence_index_input_ref: EvidenceIndexInputViewRef,
    authenticity_hint_ref: Option<AuthenticityHintRef>,
    gap_refs: GapStateRefSet,
    visibility: Option<VisibilitySurface>,
    retention_marker_ref: Option<RetentionMarkerRef>,
    no_write_guard_scope: Option<NoWriteGuardScope>,
    delivery_result: Option<HandoffDeliveryResult>,
    block_reason: Option<HandoffBlockReason>,
    updated_at: ObservedAt,
}

/// Complete body-free authenticity-hint revision observed before mutation.
pub struct AuthenticityHintSnapshot {
    hint_ref: AuthenticityHintRef,
    handoff_ref: ReportHandoffRecordRef,
    state: AuthenticityHintState,
    evidence_origin: Option<EvidenceOriginKind>,
    placeholder_reason: Option<PlaceholderReason>,
    gap_refs: GapStateRefSet,
    insufficient_reason: Option<AuthenticityGapReason>,
    evaluated_at: ObservedAt,
}

/// Canonical complete linkage snapshots matching one immutable input.
pub struct AuthenticityLinkageSnapshotSet(Vec<EvidenceLinkageVisibilitySnapshot>);

/// Complete body-free gap revision observed by a domain policy.
pub struct GapPolicySnapshot {
    gap_ref: GapStateRef,
    source_ref: GapSourceRef,
    gap_kind: GapKind,
    state: GapLifecycleState,
    affected_object_ref: AffectedObservationObjectRef,
    degraded_ref: Option<DegradedOutputRef>,
    opened_at: ObservedAt,
    closed_at: Option<ObservedAt>,
    close_reason: Option<GapCloseReason>,
}

/// Canonical complete gap snapshots matching one evaluated target or input.
pub struct GapPolicySnapshotSet(Vec<GapPolicySnapshot>);
```

`AuthenticityHandoffSnapshot::from_handoff`与`AuthenticityHintSnapshot::from_hint`逐字段exact-copy并提供`applies_to`。两个set factory分别从loaded objects构造、按typed ref排序、拒绝duplicate，并要求ref集合exact等于input对应set；linkage snapshot还要求每项projection属于`input.audit_projection_refs`，gap snapshot要求每项ref属于`input.gap_refs`。set可空；空只表示该immutable input没有对应member，不证明真实性或完整性。

通用gap snapshot归`domain::gap`并由P6/P7/P11复用，避免三套同字段gap revision。跨crate assembly API固定为：`pub fn GapPolicySnapshot::from_loaded_gap(gap: &GapState) -> Result<Self, DomainError>`逐字段copy并验证lifecycle/close/degraded matrix；`pub fn GapPolicySnapshotSet::try_for_expected_refs(expected_refs: &GapStateRefSet, loaded_gaps: &[GapState]) -> Result<Self, DomainError>`要求ref一一相等、按typed ref canonical排序、拒绝duplicate/extra/missing，并逐项调用前者。fields private、无serde/default；application只能从repository-loaded或same-UoW accepted gap调用。handoff/hint/linkage/gap snapshots均不保存正文、locator、provider result或外部truth。

### 26.3 `AuthenticityHintDecisionKind` / decision

```rust
/// Finite authenticity-hint transition selected for one immutable handoff input.
pub enum AuthenticityHintDecisionKind {
    /// Every included linkage has a trusted body-free origin assessment.
    ConfirmTrustedBoundary,
    /// At least one included linkage is explicitly a placeholder.
    MarkPlaceholder(PlaceholderReason),
    /// Current safe inputs cannot support a stronger origin hint.
    MarkInsufficient {
        reason: AuthenticityGapReason,
        gap_refs: GapStateRefSet,
    },
}

/// Policy-basis- and immutable-input-bound authenticity-hint decision.
pub struct AuthenticityHintDecision {
    policy_basis: PolicyEvaluationBasis,
    hint_snapshot: AuthenticityHintSnapshot,
    handoff_snapshot: AuthenticityHandoffSnapshot,
    input_snapshot: EvidenceIndexInputView,
    linkage_snapshots: AuthenticityLinkageSnapshotSet,
    origin_assessments: Option<EvidenceOriginAssessmentSet>,
    gap_snapshots: GapPolicySnapshotSet,
    kind: AuthenticityHintDecisionKind,
}
```

`origin_assessments`为Some时必须与non-empty input linkage set一一相等；None是合法的“trusted origin尚未建立”输入并产生Insufficient，不能产生Confirm/Placeholder。input linkage set为空时必须None。decision直接保留immutable input与四组规范化body-free snapshot，不计算第二套digest，也不把linkage digest解释为origin proof。`pub(crate) fn new(...)`仅P6调用。`applies_to(hint,handoff,input,loaded_linkages,assessments,loaded_gaps)`重新构造并逐项比较全部snapshot；`kind()`与`policy_basis()`只读。另有`pub(crate) fn proves_accepted_transition(&self, transition: &AuthenticityHintTransition, post_hint: &AuthenticityHint, handoff: &ReportHandoffRecord) -> bool`供H4 sibling records module比较decision target/outcome、transition before/change和post hint，不重新执行resolver或P6。decision不保存assessment body、external ref locator、actor、run id、alias或verdict。

### 26.4 exact policy schema / complete signatures

```rust
/// Immutable authenticity-hint policy over one resolved rule snapshot.
pub struct AuthenticityHintPolicy {
    basis: PolicyEvaluationBasis,
}

impl AuthenticityHintPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
    ) -> Result<Self, DomainError>;

    pub fn assess(
        &self,
        hint: &AuthenticityHint,
        handoff: &ReportHandoffRecord,
        input: &EvidenceIndexInputView,
        loaded_linkages: &[EvidenceLinkage],
        origin_assessments: Option<&EvidenceOriginAssessmentSet>,
        loaded_gaps: &[GapState],
    ) -> Result<AuthenticityHintDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

P6没有accepted-origin set配置：`EvidenceOriginKind`只有`TrustedBoundary`可进入RealEvidenceLinked，Placeholder/InsufficientBasis是结果分类；允许配置把其他origin升级为trusted会破坏真实性边界。`PlaceholderDetectionRule`也不进domain，placeholder必须由explicit typed mapper assessment给出。

### 26.5 exact input binding / deterministic outcome

所有分支先校验：basis family=`AuthenticityHint`；hint为Unassessed/Insufficient且属于handoff；handoff不是Delivered/Cancelled且其`evidence_index_input_ref`等于input；input purpose为ReportHandoffInput、committed/committable；`input.consumer_scope.consumer_ref`必须exact等于`ObservationConsumerRef::Report(handoff.consumer_ref)`；complete loaded linkage/gap snapshots与input sets exact one-to-one；每个linkage属于input projection；assessment为Some时必须与linkage snapshots逐项相等，None则只能产生Insufficient。`handoff_scope_ref`是独立catalog selection identity，P6不从opaque ref猜scope membership；其与input的正式binding由handoff创建UoW已固定的`evidence_index_input_ref`证明，P7不得反向改写。

| priority | input condition | decision kind |
|---|---|---|
| 1 | input identity/scope/set关系非法 | `DomainError`，不产生hint outcome |
| 2 | input visibility NotVisible/Blocked或not-visible linkage | `MarkInsufficient(EvidenceNotVisible, input/loaded gaps)`；不得泄露placeholder/trusted分类 |
| 2a | input visibility Degraded | `MarkInsufficient(TrustedOriginUnavailable, input/loaded gaps)`；limited body也不能升级真实性提示 |
| 3 | any loaded gap未Resolved | `MarkInsufficient(OpenObservationGap, exact unresolved gap refs)`；必须non-empty |
| 4 | input freshness Stale/Rebuilding/Unknown | `MarkInsufficient(UnresolvedEvidenceLinkage, input gap refs)`；不得把Freshness unknown当real |
| 5 | input linkage set empty、assessment absent/缺项、linkage Stale/Candidate/BodyBlocked | `MarkInsufficient(MissingImmutableInput/UnresolvedEvidenceLinkage/TrustedOriginUnavailable, exact gaps)`，按最具体finite reason |
| 6 | any explicit Placeholder assessment | `MarkPlaceholder`；只在前述visibility/freshness/gap门禁通过后，按canonical linkage order选择第一条reason |
| 7 | any assessment Insufficient | `MarkInsufficient(assessment reason, exact gaps)`；按canonical linkage order选择第一条reason，完整set仍可逐项复核 |
| 8 | every linkage Linked且每个assessment TrustedBoundary、input Fresh、visibility允许body | `ConfirmTrustedBoundary` |

`ConfirmTrustedBoundary`只让hint state变为`RealEvidenceLinked`并保存`EvidenceOriginKind::TrustedBoundary`；名称是既有状态词，不是真实性verdict。它不能让handoff Ready/Delivered，也不能生成evidence alias。通过visibility/freshness/gap门禁后，origin classification内部仍按Placeholder > Insufficient > Trusted，防止混合集合被“all/any trusted”逻辑覆盖。

`AuthenticityHint::apply_decision(&mut self, handoff, input, loaded_linkages, assessments, loaded_gaps, decision: &AuthenticityHintDecision, evaluated_at) -> Result<Option<AuthenticityHintTransition>, DomainError>`成为唯一public policy mutation入口：先做complete binding，再分别调用private helper。Unassessed到三个target返回Some；Insufficient到Real/Placeholder返回Some；Insufficient到不同reason/gap的Insufficient返回同态Some；exact同态replay返回None且不得只更新时间。裸三个member降为module-private；clock time由application在accepted UoW传入，不进入P6 evaluation；借用decision使F批record factory仍可读取P6 basis和完整assessment set。

### 26.6 exact error / zero side effect

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(UnexpectedFamily)` | P6 factory收到非AuthenticityHint basis |
| `RelationMismatch(Subject/Consumer/Scope)` | hint/handoff/input consumer或scope关系不一致 |
| `RelationMismatch(StateSnapshot)` | handoff/hint/input/assessment/linkage/gap snapshot与loaded对象不一致 |
| `RelationMismatch(DecisionBinding)` | decision被另一hint/handoff/input消费 |
| `InvalidStateTransition` | terminal hint重写，或Delivered/Cancelled handoff上首次评估 |
| `MissingRequiredReference` | input/linkage/gap object本身未加载，无法证明set一一对应 |
| `AuthenticityBoundaryViolation` | TrustedBoundary assessment缺正式trusted mapper来源、linkage/boundary不是Linked或digest不匹配 |
| `HandoffInvariantViolation` | handoff保存的immutable input ref与loaded input不一致 |
| `ReferenceConflict` | assessment boundary snapshot/digest与linkage冲突 |

Placeholder与Insufficient不是error。任何`Err`都不修改hint/handoff/input/linkage/gap，不生成decision/transition/record/outbox/run id/alias/signoff；P6不访问repository/resolver/config/clock/adapter。

### 26.7 downstream use / planned tests / stop review

| affected use | C批裁定 |
|---|---|
| R06.4 `AuthenticityHint` | 新增唯一public`apply_decision`；三个裸transition member降private；state与transition shape不变 |
| frozen Step07/08/09 | Step07 `EvidenceSafeSummary`补`origin_resolution`；Step08删除caller-supplied `evidence_origin`；Step09必须加载handoff/input/linkages/gaps并通过resolver形成origin assessments |
| frozen Step10 | policy不再“creates hint”；先`AuthenticityHint::assess`建立Unassessed，再P6 decision/apply；四state保持不变 |
| P7 handoff readiness | D批只能消费committed hint state/ref，不得从P6 decision直接宣告Ready |
| H4 lifecycle record | F批消费hint/handoff transitions；C批不决定record schema |

planned tests覆盖assessment set exact equality/ordering/duplicate、placeholder precedence、all freshness/visibility/linkage states、open vs resolved gap、mixed trusted/placeholder/insufficient、missing assessment、linkage digest/snapshot conflict、cross-handoff/input/consumer/scope/basis replay、terminal hint、Delivered/Cancelled handoff、TrustedBoundary不等于verdict、zero mutation，以及run id/evidence alias/signoff/body/locator/provider字段扫描。对象停审：`pass_R06.5-C_P6_design_only`。

## 27. R06.5-C 类型、owner 与构造闭环审计

### 27.1 43个显式类型账

| group | new / extended types | count | authoritative owner |
|---|---|---:|---|
| P1 intake | `IntakeAdmissionRule`;`IntakeAdmissionRuleSet`;`NonResolvedSourceAction`;`AdmissionDecisionKind`;`ObservationReceiptPolicySnapshot`;`SafetyDispositionPolicySnapshot`;`AdmissionDecision`;`IntakeAdmissionPolicy` | 8 new | `domain::{policies,intake,safety}` |
| P2 safety | `ForbiddenBodyDisposition`;`SafetyDispositionDecisionKind`;`SafetyDispositionDecision`;`ForbiddenBodyDispositionTable`;`SafetyDispositionPolicy` | 5 new | `domain::{policies,safety}` |
| P3 signal | `SignalFormationRule`;`SignalFormationRuleSet`;`SafeLabelAssessment`;`PartialCorrelationAction`;`SafeSignalEvaluationSnapshot`;`SignalCorrelationSnapshot`;`SafeSignalPolicy` | 7 new | `domain::{policies,signal}` |
| P3 reused decision | `SignalDecision` | 1 affected extension | R06.3 `domain::signal`；本专项§23.3 authoritative extension |
| P4 body-free | `BodyFreeLinkageRule`;`BodyFreeLinkageRuleSet`;`BodyFreeLinkagePolicy` | 3 new | `domain::policies` |
| P5 visibility support | `EvidenceVisibilityRule`;`EvidenceVisibilityRuleSet`;`AuditProjectionSafetyAssessment`;`AuditProjectionVisibilitySnapshot`;`EvidenceLinkageVisibilitySnapshot`;`EvidenceVisibilityPolicy` | 6 new | `domain::{policies,audit,evidence}` |
| P5 reused decisions | `EvidenceVisibilityDecision`;`AuditProjectionVisibilityDecision` | 2 affected extensions | R06.3 `domain::{evidence,audit}`；本专项§25.4 authoritative extension |
| P6 authenticity | `EvidenceOriginResolution`;`EvidenceOriginAssessment`;`EvidenceOriginAssessmentSet`;`AuthenticityHandoffSnapshot`;`AuthenticityHintSnapshot`;`AuthenticityLinkageSnapshotSet`;`GapPolicySnapshot`;`GapPolicySnapshotSet`;`AuthenticityHintDecisionKind`;`AuthenticityHintDecision`;`AuthenticityHintPolicy` | 11 new | `contracts::metadata`仅resolver result enum；gap snapshots归`domain::gap`；其余`domain::handoff/policies` |
| total | 40 new + 3 affected extensions | 43 | zero duplicate owner |

43-type账按C批全部authoritative文件计数：本专项声明39个new type，R06.2 contracts专项§24.1声明1个new `EvidenceOriginResolution`，R06.3专项§§9.21/9.36/9.37持有3个existing decision的canonical declaration与C批extension，合计40 new + 3 affected extension。本专项不重复声明contracts enum或existing decision，因此zero duplicate owner。`domain::policies::material_v1`的private helper函数和`&[(&'static str, &[u8])]`参数不是public/explicit Step06 type，不进入43-type账。C批没有生成任何`*PolicyId`、generic policy result、public bool decision、rule body、dynamic enum或config locator wrapper。

### 27.2 owner / factory / source registry

| object group | unique constructor / source | 禁止构造方 |
|---|---|---|
| rule / set / table | registry validated typed values -> canonical constructor -> material-v1 digest verify | entry、DTO、application default、config raw map |
| six concrete policies | `from_resolved_snapshot`；family + material digest双校验 | repository rehydrate、serde、`PolicyBindingRef` direct conversion |
| P1/P2 snapshots | owning object `from_*` exact copy | protocol caller、mapper partial fields |
| `SafeSignalEvaluationSnapshot` | Step07 safe-summary resolver result + candidate target | caller-supplied label map/assessment |
| signal correlation snapshot | loaded `CorrelationContext` exact copy | trace/runtime/subject partial args |
| audit/linkage visibility snapshots | loaded owning object exact copy + typed safety assessment | consumer request、public view反向构造 |
| `EvidenceOriginResolution` | Step07 evidence resolver result | Step08 command field、config、policy default |
| P6 handoff/hint/linkage/gap snapshots | loaded objects + immutable input exact set join | ref-only list、current object重建history、query preview alone |
| decisions | only P1/P2/P3/P5/P6 crate-private constructors | application/entry/config/infra/public serde |

### 27.3 complete snapshot 与 stale-decision gate

| decision | complete observed material | same-state change that must invalidate |
|---|---|---|
| `SafetyDispositionDecision` | receipt + pending disposition + material summary + evaluation context | summary/marker/flag/source/context变化 |
| `AdmissionDecision` | full receipt + post-safety disposition | source snapshot、received_at、disposition fields变化 |
| `SignalDecision` | candidate fields + full correlation + label assessment + full runtime ref | Bound runtime追加、Partial seed替换、runtime availability、summary变化 |
| `EvidenceVisibilityDecision` | full linkage + full projection + evaluated boundary/digest | append head、gap/linkage set、reason、boundary refresh、scope变化 |
| `AuditProjectionVisibilityDecision` | full projection + global assessment | same-state append/gap/reason/head变化 |
| `AuthenticityHintDecision` | full hint/handoff/input/linkage/origin/gap snapshots | readiness/hint attach/gap lifecycle/linkage boundary/input field变化 |

以上snapshot都是decision-local body-free value，不是repository truth、version或public DTO。repository CAS仍由Step11处理；complete snapshot只防止调用方在同一loaded version内跨target/跨state/跨内容误用decision，不能替代CAS。

## 28. R06.5-C outcome、error 与副作用总审计

### 28.1 expected outcome total matrix

| policy | positive / normal outcome | expected negative outcome | 绝不使用的error替代 |
|---|---|---|---|
| P1 | Accept | Reject / Quarantine / Degrade | `PolicyRejected` |
| P2 | MarkSafe / MarkRedacted | RejectUnsafe / Quarantine | `PolicyRejected`;generic safety error |
| P3 | Record | Suppress(finite reason) | `PolicyRejected` |
| P4 | `Ok(())` structural only | none；不兼容是boundary defect | 从error构造NotVisible/Gap |
| P5 | Visible | NotVisible(finite reason) | `ReadNotAllowed`;Missing伪装NotVisible |
| P6 | ConfirmTrustedBoundary | MarkPlaceholder / MarkInsufficient | `HandoffNotReady`;authenticity verdict error |

P4和P5边界不冲突：P4只判断typed relation是否可形成candidate；P5只对已形成或可刷新的exact linkage/projection snapshot计算visibility。P4 `Ok`不能跳过P5，P5 Visible也不能跳过P4或owning object member。

### 28.2 `DomainError` producer coverage

| error family | P1 | P2 | P3 | P4 | P5 | P6 |
|---|---:|---:|---:|---:|---:|---:|
| PolicyBasisMismatch | yes | yes | yes | yes | yes | yes |
| RelationMismatch | yes | yes | yes | yes(scope) | yes | yes |
| InvalidStateTransition | yes | yes | yes | yes | yes | yes |
| MissingRequiredReference | no normal source branch | yes | no normal suppression branch | yes | yes only actual missing | yes only unloaded required object |
| Safety/BodyFree boundary | safety consistency | yes | yes | body-free | body-free | authenticity only |
| Correlation/Reference/Handoff conflict | no | no | correlation | reference | reference | reference/handoff |

没有发现需要重开B批新增`DomainError` variant的情况。P1的Unresolved/Stale、P3的Unavailable、P5的policy restriction和P6的insufficient都已有typed outcome，不滥用error。

### 28.3 zero-side-effect gate

六个policy及其snapshot/decision factory均不得访问repository、adapter、resolver、config、clock、id generator、UoW、outbox或record store。resolver结果必须在调用policy前由application加载；clock只在accepted owning member mutation时传入。任何`Err`：

1. 所有loaded objects逐字段不变。
2. 不创建decision/transition/record/outbox/gap/stale marker。
3. 不消费append ref、record ref、hint ref或durable identity。
4. 不调用外部port，不写log body或error detail。
5. application必须使当前accepted UoW保持未提交或回滚。

normal negative decision同样不直接产生副作用；只有application显式把decision交给exact owning member后才可能产生transition。P1/P2/P3/P5/P6 decision均按借用消费，供same-UoW record factory读取policy basis；不得clone后跨UoW持久化为授权token。

## 29. R06.5-C affected-only 传播清单

| affected location | current conflict | authoritative C裁定 | 解冻后动作 |
|---|---|---|---|
| R06.3 `SignalDecision` | 旧shape只有signal/context/kind，缺basis与complete snapshot | §23.3 extension | done；canonical declaration已同步R06.3 §9.21，reconciliation见§22 |
| R06.3 two visibility decisions | 旧shape只有target/scope/outcome，缺basis/complete revision | §25.4 extension | done；canonical declarations已同步R06.3 §§9.36~9.37，reconciliation见§22 |
| R06.3 receipt/safety members | application曾可裸调用accept/mark/reject/quarantine | P1/P2 decision唯一public apply；private helpers | done；R06.3 §§10~11/§22 |
| R06.3 signal member | public suppress曾可绕P3 | `apply_decision(&SignalDecision)`唯一policy入口 | done；R06.3 §13/§22 |
| R06.3 linkage members | stale->new NotVisible和same-state reason change未闭合 | `apply_visibility` total dispatch；NotVisible transition扩展 | done；R06.3 §15/§22 |
| R06.3 safety transition | quarantine不带typed body class | Quarantined新增optional evidence strict matrix | done；R06.3 §9.11/§22 |
| R06.4 authenticity members | policy曾可被裸origin/reason调用绕过；Insufficient同态未闭合 | `apply_decision` total dispatch + complete snapshots | done；R06.4 §10.2/§20 |
| frozen Step07 resolver schema | signal缺label assessment；evidence缺origin resolution | resolver result补finite fields | R06.8后affected Step07 review，不在C批改冻结正文 |
| frozen Step08 authenticity command | caller可提交`EvidenceOriginKind` | 删除caller origin；service从resolver构造assessment | R06.8后Step08逐协议重组 |
| frozen Step09 flows | P1~P6均是旧bare/partial signature | 使用§21~§26 exact flow sequence | Step09重写时逐flow传播 |
| frozen Step10 | policy直接creates hint/receipt；部分trigger回指旧member | factory与decision/apply分离 | Step10 affected review |
| frozen Step12 | expected negative error与旧19 variant | 只映射B批20-variant error + C decisions | Step12 affected review |
| Step04 / dependency | 无`material_v1` owner与SHA crate | private pure helper；v1 exact framing/algorithm fixed | R06.8统一file/Cargo impact |
| F批 records | 需要policy basis和affected transition shape | decision借用 + transition保留typed payload | F批逐record消费，不在C批猜schema |

以上均是详细设计内部definition/use传播，不改变正式`02`的18个policy主语、truth owner或项目依赖关系，因此不是external upstream blocker。

## 30. R06.5-C 自检、blocker 与停止点

### 30.1 object stop-review summary

| object | schema / fields | factory / complete signature | target output | error / zero side effect | test redline | result |
|---|---|---|---|---|---|---|
| P1 IntakeAdmission | pass | pass | AdmissionDecision | pass | planned complete | pass_design_only |
| P2 SafetyDisposition | pass | pass | SafetyDispositionDecision | pass | planned complete | pass_design_only |
| P3 SafeSignal | pass | pass | extended SignalDecision | pass | planned complete | pass_design_only |
| P4 BodyFreeLinkage | pass | pass | structural `Result<()>` exception | pass | planned complete | pass_design_only |
| P5 EvidenceVisibility | pass | pass | two extended decisions | pass | planned complete | pass_design_only |
| P6 AuthenticityHint | pass | pass | AuthenticityHintDecision | pass | planned complete | pass_design_only |

`planned complete`只表示测试红线已设计，不表示测试已实现或执行；没有真实test result、evidence alias、run id、signoff或commit。

### 30.2 C批 gate

| gate | conclusion | evidence / remaining limit |
|---|---|---|
| P1~P6是否逐policy独立成卡 | pass | §§21~26 |
| policy fields是否均来自same resolved snapshot | pass | §19.4 + each factory |
| decisions是否basis + target + complete snapshot bound | pass | §§20/23/25/26 + §27.3 |
| expected negative是否typed | pass | §28.1 |
| P4 structural exception是否未冒充state | pass | §24 |
| Missing / NotVisible / Restricted是否分离 | pass | §25 |
| authenticity是否不伪造 | pass | §26；resolver-owned origin + visibility-first |
| body/locator/credential/provider内容是否进入schema | no | only typed refs/reasons/snapshots |
| external upstream blocker | none | formal00/01/02足以支撑C批 |
| internal blocker | `03-RPR-S06-GRANULARITY=open` | R06.5仍需D~G，Step06仍需R06.6~R06.8 |
| R06.5-C gate | pass_done_waiting_user | 43 explicit types；6 exact policy cards；R06.2/R06.3/R06.4 affected definitions已同步 |
| historical next_allowed_action | `wait_user_confirmation_before_R06.5-D` | 已由用户确认并完成D批，不再是current action |

### 30.3 用户确认后 R06.5-D 阅读清单

只有本专项、主控、flow、ledger与R06.2/R06.3/R06.4 checkpoint均同步为`R06.5-C_done_waiting_user`，且用户再次明确确认后，才读取：

1. 本文件P7~P12 inventory/output owner与shared foundation。
2. R06.4 handoff readiness、retention/protection、replay scope、no-write、read visibility、gap exact objects/decisions/transitions。
3. 概要P7~P12 candidate rules，以及冻结Step09/10/12 affected uses。
4. L1逐policy卡只作粒度参考。

确认前不得进入R06.5-D~G或R06.6，不得修改Step07~19、formal`03`、任何`04`或实现代码。当前不需要提交。

## 31. R06.5-D 输入、范围与 authority 裁定

### 31.1 D批执行边界

| 项 | 当前裁定 |
|---|---|
| 用户门禁 | 用户已明确确认继续进入 `R06.5-D`；§30.3 阅读门禁已消费 |
| 唯一范围 | P7 `HandoffReadinessPolicy`、P8 `RetentionProtectionPolicy`、P9 `ReplayBoundaryPolicy`、P10 `NoWriteGuardPolicy`、P11 `ReadVisibilityPolicy`、P12 `GapClassificationPolicy` |
| policy物理 owner | planned `crates/domain/src/policies.rs`；六个policy均是immutable value object，不创建repository entity或`*PolicyId` |
| reused output owner | P7 `domain::handoff::HandoffReadinessDecision`；P8 `domain::retention::{ActiveProtectionReleaseDecision,RetentionMarkerDecision}`；P9 `domain::replay::ReplayApprovalSnapshot`；P11 `domain::read::ReadVisibilityDecision` |
| new output owner | P10 `domain::no_write::NoWriteGuardDecision`；P12 `domain::gap::GapClassificationDecision` |
| current允许同步 | 本专项；R06.4中五个reused decision/input及其owning member；R06.2 registry；主控、flow、ledger |
| current禁止范围 | P13~P18、H1~H13、R06.6~R06.8、Step07~19正文、formal `03`、任何`04`或实现代码 |

### 31.2 已读取输入与使用结论

| 输入 | D批使用结论 |
|---|---|
| Step 06 SOP / 书写规范 | 每个policy独立闭口schema、字段来源、factory、完整evaluate签名、target-bound output、expected outcome、error、zero-side-effect和planned test redline |
| R06.4 handoff / authenticity | P7只能消费已提交且已绑定handoff的current `AuthenticityHint` snapshot；不能直接消费P6 decision或把`RealEvidenceLinked`升级为verdict |
| R06.4 retention / protection | P8严格分为active-consumer reconciliation与marker evaluation两次调用；marker只能消费reconciled protection post-snapshot |
| R06.4 replay | P9必须为scope中的每个target保存retention/protection snapshot；单个全局state不足以证明多target approval |
| R06.4 no-write | `ForbiddenWriteTargetRef`只描述source/external forbidden target，不能表示合法observation-side write；P10需统一tagged evaluation target |
| R06.4 read / gap | P11是同步Query process-local decision且零写；P12必须消费typed finite basis，不能从absence、message或默认kind分类 |
| 概要P7~P12 | policy名称和能力主语保留；`*PolicyId`、policy-to-policy参数、`assert_*`、`default_gap_kind`和自由规则对象均降级为historical candidate |
| frozen Step09/10/12 | 只登记旧signature/error/side-effect affected use；本批不修改冻结文件 |
| L1粒度参考 | 采用逐policy完整输入输出和测试红线粒度，不复制相邻域truth或generic result |

### 31.3 current authority 与 historical material

| historical / candidate shape | current replacement | 原因 |
|---|---|---|
| `HandoffReadinessPolicyId`等六个`*PolicyId` | `PolicyEvaluationBasis` | policy不是独立lifecycle truth；basis已提供family/ref/revision/digest |
| policy字段或参数直接持有另一个policy对象/ref | same assembly snapshot中的typed decision/input | policy不能把未执行的policy对象当作已验证结果，也不能形成policy依赖图 |
| `assert_can_read` / `assert_no_source_write` | `evaluate(...) -> target-bound decision` | Visible/NotVisible/Blocked/Pass是expected outcome，不是assertion failure |
| `ForbiddenWriteTargetSet`同时表示允许与禁止目标 | `NoWriteEvaluationTarget` tagged union + exact rule set | forbidden ref无法合法表示observation-side target |
| one `retention_state` + one `protection_state`审批整个replay set | canonical `ReplayTargetBoundarySnapshotSet` | approval必须逐target可复核，不允许全局代表值覆盖异构target |
| `default_gap_kind` / absence fallback | finite `GapClassificationBasis` + total explicit rules | missing、unresolved、not-visible、unsafe不得通过默认值或错误文本互相替代 |
| Query构造/持久化`ReadVisibilityState`或`ReadAccessRecord` | process-local `ReadVisibilityDecision`；response assembler直接消费 | synchronous Query不得隐藏写入、刷新、重建、建record或outbox |

上述冲突均登记为详细设计内部historical material，不构成external upstream blocker。正式`02`固定的六个policy主语仍保留；D批只把概要骨架收敛到可落码的typed contract。

### 31.4 D批统一构造、decision binding 与零副作用规则

六个policy均按§19.3/§19.4共享规则构造：registry先解析`PolicyEvaluationBasis`和typed finite material；factory先`require_family`，再对`material-v1` canonical bytes重新计算digest并与basis constant-time比较。policy不保存repository、clock、resolver、adapter、config、actor profile、业务授权或外部truth。

P7/P8/P9/P11复用的R06.4 carrier必须在其canonical owner中新增完整`policy_basis`和complete snapshot字段；本文件只定义policy和D批自有support type，不复制canonical declaration。P10/P12 decision constructor为`pub(crate)`且仅对应policy可调用。所有decision按借用消费；消费前重建complete snapshot并逐字段比较，先校验binding，再解释outcome。失败返回固定20-variant `DomainError`中的既有variant，且输入、receiver、repository、identity、transition、record、outbox和external port均零副作用。

#### 31.4.1 跨 crate constructor 可见性

目标workspace中`observability-application`与`observability-domain`是两个独立crate，依赖方向为`application -> domain`。因此必须区分两类constructor：

| constructor类别 | Rust visibility | caller | 边界 |
|---|---|---|---|
| policy decision / authorization constructor | `pub(crate)` | 仅同一domain crate中的对应policy | application、entry、infra不能伪造outcome；无serde/default/builder |
| loaded snapshot / relation binding / one-shot input assembly factory | `pub fn` on domain type | `observability-application`在typed repository/resolver结果分支中调用；domain policy也可复用 | 字段private；不进入contracts或protocol re-export；无serde/raw DTO constructor；只接受typed loaded object/value并执行complete relation matrix |

Rust没有跨crate `friend` visibility。把application所需的snapshot factory写成`pub(crate)`会导致设计不可编译；把decision constructor写成`pub`又会让application伪造policy truth。current裁定用上述两层API解决。`api/worker/jobs/infra`不得新增对domain的直接assembly调用；它们只能调用application或实现application port，这由Step05 dependency matrix和后续R06.7/R06.8扫描约束。对于“repository确实执行并返回`Ok(None)`”这类无法由domain value单独证明的事实，Step07 typed port result与Step09逐flow match branch共同构成调用证据；D批不伪造proof token。

### 31.5 D批 typed material digest字段

在§19.4现有P1~P6 material表后，D批增加以下exact fields：

| family | `material-v1` exact fields |
|---|---|
| P7 HandoffReadiness | `nontrusted_hint_rules` canonical placeholder/insufficient table；`gap_rules` canonical four-kind table；`restricted_visibility_action`；`non_fresh_input_action` |
| P8 RetentionProtection | `consumer_state_rules` canonical tagged-state table；`empty_consumer_release_reason`；`marker_rules` canonical marker/protection/presence matrix |
| P9 ReplayBoundary | `target_effect_rules` canonical target-kind/effect pairs；`retention_rules`；`protection_rules` |
| P10 NoWriteGuard | `trigger_effect_rules` canonical trigger-kind/effect-kind matrix；`allowed_local_effect_rules` canonical local-target/effect pairs |
| P11 ReadVisibility | `purpose_scope_rules` canonical purpose/scope-kind pairs；`freshness_actions` canonical table；`degraded_action` |
| P12 GapClassification | `classification_rules` canonical complete basis-to-kind table |

所有set/table按各卡指定key排序并拒绝conflicting duplicate；exact duplicate折叠。empty只在卡片明确允许时表示deny-all，绝不表示使用default。enum使用canonical token，tagged union先编码variant tag再编码payload；不允许Debug、JSON map顺序、错误消息、clock、locator或config原文参与digest。

## 32. R06.5-D shared typed material 与 complete snapshot

### 32.1 handoff readiness finite material

```rust
/// Repository-loaded immutable input and its committed observation position.
pub struct CommittedEvidenceIndexInputSnapshot {
    input: EvidenceIndexInputView,
    committed_cursor: ObservationCursor,
}

/// Explicit handling for a non-trusted authenticity hint at handoff time.
pub enum HandoffHintReadinessAction {
    /// Keep preparation pending until a stronger local basis exists.
    Pending,
    /// Permit only a degraded handoff surface with the hint and gaps retained.
    Degraded,
}

/// Explicit handling for one classified gap on a handoff surface.
pub enum HandoffGapHandling {
    /// A gap prevents preparation.
    Block,
    /// A gap permits only an explicitly degraded preparation.
    Degraded,
}

/// Explicit handling for a restricted but body-free handoff input.
pub enum RestrictedHandoffVisibilityAction {
    /// Restricted body-free material may continue after all other gates pass.
    Allow,
    /// Restricted material requires an explicitly degraded handoff surface.
    Degraded,
    /// Restricted material blocks handoff preparation.
    Block,
}

/// Explicit handling for a stale, rebuilding, or unknown immutable input.
pub enum NonFreshHandoffInputAction {
    /// Keep preparation pending until a fresh committed input is available.
    Pending,
    /// Permit only an explicitly degraded handoff surface with a typed gap.
    Degraded,
    /// Block preparation for this immutable input revision.
    Block,
}

/// Canonical finite material used by P7.
pub struct HandoffReadinessRuleSet {
    hint_placeholder: HandoffHintReadinessAction,
    hint_insufficient: HandoffHintReadinessAction,
    gap_rules: Vec<(GapKind, HandoffGapHandling)>,
    restricted_visibility_action: RestrictedHandoffVisibilityAction,
    non_fresh_input_action: NonFreshHandoffInputAction,
}
```

| carrier | source / construction | exact invariant |
|---|---|---|
| `CommittedEvidenceIndexInputSnapshot` | `pub fn from_committed(input: EvidenceIndexInputView, committed_cursor: ObservationCursor) -> Result<Self, DomainError>`；application only from `ReportHandoffRepository::get_evidence_index_input` or same-UoW accepted append result plus assigned cursor | `input.as_of_cursor == Some(committed_cursor)`；input must be committable；public Rust domain API但不是public protocol/serde constructor；preview不能包装 |
| `HandoffHintReadinessAction` | P7 material snapshot | only Placeholder/Insufficient use this table；`Unassessed` is fixed Pending；neither action implies Ready |
| `HandoffGapHandling` | P7 material snapshot | applies only to Open/Acknowledged gaps；resolved gaps bypass the table；no Allow variant |
| `RestrictedHandoffVisibilityAction` | P7 material snapshot | Allow still requires hint/retention/no-write/gap gates；not an authorization grant |
| `NonFreshHandoffInputAction` | P7 material snapshot | no Allow/Ready variant；Degraded requires at least one typed gap |
| `HandoffReadinessRuleSet` | registry finite material | exactly one entry for each `GapKind`; duplicate kind with different action rejects; no actor role, consumer locator or report body |

`CommittedEvidenceIndexInputSnapshot`是process-local loaded proof，不进入public DTO、domain aggregate或persistence row；它不增加`committed: bool`这类caller可伪造字段。`HandoffReadinessRuleSet`的canonical gap key顺序为`MissingMaterial`、`UnresolvedReference`、`NotVisibleMaterial`、`UnsafeOutput`；nontrusted hint按`PlaceholderDetected`、`Insufficient`顺序编码。`Unassessed`固定Pending，`RealEvidenceLinked`没有可配置upgrade，仍必须通过visibility、gap、retention和no-write门禁后才能进入`Ready`。P7不得将`PlaceholderDetected`或`Insufficient`映射成`Ready`。

### 32.2 retention complete snapshots

```rust
/// Complete body-free snapshot of one retention marker consumed by P8.
pub struct RetentionMarkerPolicySnapshot {
    marker_ref: RetentionMarkerRef,
    protected_ref: ProtectedObservationRef,
    state: RetentionMarkerState,
    active_protection_ref: Option<ActiveReferenceProtectionRef>,
    archive_eligibility_ref: Option<ArchiveEligibilityRef>,
    purpose: RetentionPurpose,
    release_reason: Option<RetentionReleaseReason>,
    conflict_reason: Option<RetentionConflictReason>,
}

/// One current consumer state observed while revalidating protection.
pub struct RetentionConsumerStateSnapshot {
    observed_consumer_ref: ObservationConsumerRef,
    current_consumer: RetentionConsumerCurrentSnapshot,
}

/// Canonical consumer-state set used for active-protection reconciliation.
pub struct RetentionConsumerStateSnapshotSet(Vec<RetentionConsumerStateSnapshot>);

/// Explicit local dependency state for a read-model or diagnostic consumer.
pub enum LocalConsumerDependencyState {
    /// The exact consumer ref is the current committed dependency head.
    ActiveCurrentHead,
    /// A separately identified committed projection superseded this ref.
    Superseded,
    /// The dependency index and repository confirm that this ref is absent.
    Missing,
    /// Loaded index and repository snapshots disagree.
    SnapshotConflict,
}

/// Tagged current state observed for every supported protection-consumer family.
pub enum RetentionConsumerObservedState {
    Report(ConsumerBoundaryState),
    Peripheral(PeripheralConsumerState),
    ReadModel(LocalConsumerDependencyState),
    Diagnostic(LocalConsumerDependencyState),
    ArchiveHandoff(ArchiveReportHandoffState),
}

/// Complete current consumer object or local dependency snapshot loaded for P8.
pub enum RetentionConsumerCurrentSnapshot {
    Report(ReportConsumerRef),
    Peripheral(PeripheralConsumerRef),
    ReadModel {
        consumer_ref: ObservationReadModelRef,
        dependency_state: LocalConsumerDependencyState,
    },
    Diagnostic {
        consumer_ref: DiagnosticViewRef,
        dependency_state: LocalConsumerDependencyState,
    },
    ArchiveHandoff(ArchiveReportHandoffRef),
}

/// P8 disposition for one observed consumer state.
pub enum RetentionConsumerDisposition {
    KeepActive,
    ReleaseCandidate(RetentionReleaseReason),
    Conflict(ProtectionConflictReason),
}

/// One total tagged-state rule for active-consumer reconciliation.
pub struct RetentionConsumerStateRule {
    state_key: RetentionConsumerObservedState,
    disposition: RetentionConsumerDisposition,
}

/// Canonical total rule set over every finite observed consumer state.
pub struct RetentionConsumerStateRuleSet(Vec<RetentionConsumerStateRule>);

/// Finite active-consumer presence used by marker/protection rules.
pub enum ActiveConsumerPresence {
    Empty,
    NonEmpty,
}

/// P8 marker outcome selected for one valid marker/protection/presence tuple.
pub enum RetentionMarkerRuleOutcome {
    Hold,
    ReleaseEligible(RetentionReleaseReason),
    Conflict(RetentionConflictReason),
}

/// One explicit rule for a valid retention/protection snapshot tuple.
pub struct RetentionMarkerRule {
    marker_state: RetentionMarkerState,
    protection_state: Option<ActiveReferenceProtectionState>,
    consumer_presence: ActiveConsumerPresence,
    outcome: RetentionMarkerRuleOutcome,
}

/// Canonical total rules for all non-Released marker/protection/presence keys.
pub struct RetentionMarkerRuleSet(Vec<RetentionMarkerRule>);

/// Complete body-free snapshot of one protection relation consumed by P8.
pub struct ActiveProtectionPolicySnapshot {
    protection_ref: ActiveReferenceProtectionRef,
    protected_ref: ProtectedObservationRef,
    reason: ActiveProtectionReason,
    state: ActiveReferenceProtectionState,
    consumer_refs: ObservationConsumerRefSet,
    release_reason: Option<RetentionReleaseReason>,
    conflict_reason: Option<ProtectionConflictReason>,
}
```

| carrier | factory / validation | forbidden shortcut |
|---|---|---|
| `RetentionMarkerPolicySnapshot` | `pub fn from_loaded_marker(marker: &RetentionMarker) -> Result<Self, DomainError>`逐字段copy并验证conditional matrix；`applies_to`比较全部字段 | 不能只保存`marker_ref + state`，不能从reason推导release |
| `RetentionConsumerStateSnapshot` | `pub fn from_loaded_current(observed_consumer_ref: ObservationConsumerRef, current_consumer: RetentionConsumerCurrentSnapshot) -> Result<Self, DomainError>`保存protection中observed full ref + 同一UoW加载的current full consumer/dependency snapshot | 两者variant和stable identity必须相同；Report/Peripheral/Archive还比较kind/scope/purpose/owner不变，只允许state变化 |
| `RetentionConsumerStateSnapshotSet` | `pub fn try_for_protection(protection: &ActiveReferenceProtection, snapshots: Vec<RetentionConsumerStateSnapshot>) -> Result<Self, DomainError>`按consumer canonical bytes排序、拒绝duplicate；允许empty | 必须与observed set一一相等；empty只表示本次加载没有active consumer，不证明历史上从未引用 |
| `LocalConsumerDependencyState` | local dependency index与repository exact lookup | Missing是已执行typed lookup的结果，不是未加载；Conflict不得降级为inactive |
| `RetentionConsumerCurrentSnapshot` | report/peripheral/archive使用完整current structured ref；read/diagnostic使用typed ref + dependency state | 不保存endpoint/locator/body；`state_key()`是total projection，不能由string解析 |
| `RetentionConsumerStateRuleSet` | registry typed material | 对Report 4、Peripheral 4、ReadModel 4、Diagnostic 4、ArchiveHandoff 5共21个tagged state各一条；无wildcard/default |
| `RetentionMarkerRuleSet` | registry typed material | 4个non-Released marker states x 6个protection signals(None + five states) x 2个presence = 48 keys；invalid tuple显式Conflict，Released marker不进入table |
| `ActiveProtectionPolicySnapshot` | `pub fn from_loaded_protection(protection: &ActiveReferenceProtection) -> Result<Self, DomainError>`逐字段copy并验证state/set/reason matrix | 不用全局bool或单一state替代consumer set；不删除历史consumer |

P8的reconciliation只允许stable identity相等的consumer状态更新。decision retained set必须包含所有`KeepActive`与`Conflict` consumer，只有`ReleaseCandidate`可被排除；kind/scope/owner被替换、观察版本不一致或集合不是observed set的stable-identity subset时返回`RelationMismatch(StateSnapshot/Consumer)`或`RetentionConflict`，不降级为Expired。

### 32.3 replay per-target boundary material

```rust
/// Complete target-bound retention/protection/no-write snapshot for one replay target.
pub struct ReplayTargetBoundarySnapshot {
    target_ref: ReplayTargetRef,
    allowed_effect: ReplayAllowedEffect,
    retention: ReplayRetentionBoundarySnapshot,
    protection: ReplayProtectionBoundarySnapshot,
    no_write: NoWriteGuardDecision,
}

/// Canonical one-entry-per-target snapshot for a replay approval.
pub struct ReplayTargetBoundarySnapshotSet(Vec<ReplayTargetBoundarySnapshot>);

/// Opaque retention lookup result bound to one replay target.
pub struct ReplayRetentionBoundarySnapshot {
    target_ref: ReplayTargetRef,
    marker: Option<RetentionMarkerPolicySnapshot>,
}

/// Opaque active-protection lookup result bound to one replay target.
pub struct ReplayProtectionBoundarySnapshot {
    target_ref: ReplayTargetRef,
    protection: Option<ActiveProtectionPolicySnapshot>,
}

/// Complete replay-scope pre-state captured by P9.
pub struct ReplayScopePolicySnapshot {
    scope_ref: ReplayScopeRef,
    target_refs: ReplayTargetRefSet,
    allowed_effect: ReplayAllowedEffect,
    state: ReplayScopeState,
    no_write_guard_scope: NoWriteGuardScope,
    block_reason: Option<ReplayBlockReason>,
    close_reason: Option<ReplayCloseReason>,
}

/// Finite result selected by P9 for one complete replay boundary.
pub enum ReplayBoundaryOutcome {
    Approved,
    Blocked {
        target_ref: ReplayTargetRef,
        reason: ReplayBlockReason,
    },
}

/// One exact replay target/effect pair permitted by P9 material.
pub struct ReplayTargetEffectRule {
    target_kind: ObservationObjectKind,
    effect: ReplayAllowedEffect,
}

pub struct ReplayTargetEffectRuleSet(Vec<ReplayTargetEffectRule>);

/// P9 action for one explicit retention boundary signal.
pub enum ReplayRetentionAction {
    Allow,
    Block(ReplayBlockReason),
}

pub enum ReplayRetentionSignal {
    Unmarked,
    ActiveHold,
    ReleaseEligible,
    Released,
    Conflict,
}

pub struct ReplayRetentionRule {
    signal: ReplayRetentionSignal,
    action: ReplayRetentionAction,
}

pub struct ReplayRetentionRuleSet(Vec<ReplayRetentionRule>);

/// P9 action for one explicit active-protection boundary signal.
pub enum ReplayProtectionAction {
    Allow,
    Block(ReplayBlockReason),
}

pub enum ReplayProtectionSignal {
    NotPresent,
    Unprotected,
    Protected,
    Expired,
    Released,
    Conflicted,
}

pub struct ReplayProtectionRule {
    signal: ReplayProtectionSignal,
    action: ReplayProtectionAction,
}

pub struct ReplayProtectionRuleSet(Vec<ReplayProtectionRule>);
```

| rule | exact contract |
|---|---|
| cardinality | set必须与`ReplayScope.target_refs`一一相等；不得缺target、重复target或增加target |
| target/effect | 每个target的`allowed_effect`必须与scope effect和`MaintenanceTargetKind`一一兼容 |
| retention | 六类current target的marker presence均为Optional、lookup均为Required；opaque snapshot的`marker=None`只表示committed same-target lookup明确返回None并映射`Unmarked`；Some保存complete marker；`ActiveHold`/`Conflict`只能blocked，`ReleaseEligible`不等于cleanup授权 |
| protection | 六类current target的lookup均为Required且允许typed absence；opaque snapshot的`protection=None`只表示committed same-target lookup明确返回None并映射`NotPresent`；Some保存complete relation；`Protected`/`Conflicted`只能blocked，`Expired`仍由exact rule决定 |
| no-write | 每个P10 decision必须绑定Replay trigger、`trigger_ref == scope_ref.body_free_ref()`、`NoWriteLocalTargetRef::Replay { same scope,same target }`、`ApprovedReplay(scope effect)`与`ObservationMaintenance` guard scope；Blocked不能被P9覆盖 |
| ordering | 按`ReplayTargetRef` canonical tagged bytes排序；scope-wide iteration不从set长度或数据库全表推断 |

#### 32.3.1 六类 target 的 relation requirement 矩阵

| replay target / exact effect | retention marker presence | retention lookup | marker lookup返回None | protection lookup | protection lookup返回None | rationale |
|---|---|---|---|---|---|---|
| `GapState` / `ScanObservationGap` | Optional | Required | target-bound `marker=None` -> `Unmarked` | Required | target-bound `protection=None` allowed | gap scan仍受既有hold/active reference约束，但上游没有要求每个gap预建marker/protection |
| `SignalRollupWindow` / `RebuildSignalRollup` | Optional | Required | 同上 | Required | allowed | rollup可重建不等于可绕过已存在的retention/protection relation |
| `ReferenceSnapshotState` / `RefreshBodyFreeReference` | Optional | Required | 同上 | Required | allowed | refresh只更新本地body-free snapshot；存在marker/protection时必须逐target评估 |
| `ObservationReadModel` / `RebuildDerivedProjection` | Optional | Required | 同上 | Required | allowed | derived view可被`DerivedProjectionAuditability`或active consumer保护，absence必须来自lookup |
| `DiagnosticView` / `RebuildDerivedProjection` | Optional | Required | 同上 | Required | allowed | diagnostic consumer/reference可能保持旧revision active，不能从target kind推断absence |
| `DashboardAlertExportView` / `RebuildDerivedProjection` | Optional | Required | 同上 | Required | allowed | peripheral view不拥有业务truth，但既有handoff/consumer protection仍必须阻断越界替换 |

当前六类没有`retention marker Required`行，因为marker由独立显式retention flow建立，上游没有规定每个可重放对象必须预建marker；也没有`retention marker NotRequired`行，因为`ProtectedObservationRef`可指向六类任一observation-owned object，且`RetentionPurpose::{ReplaySafety,DerivedProjectionAuditability,ActiveConsumerProtection}`都可能使现有marker与replay有关。因而“marker尚未加载”不能解释为Optional absence或NotRequired，必须先完成same-target lookup；缺少lookup input返回`MissingRequiredReference`。

#### 32.3.2 relation snapshot constructors 与 absence proof

| constructor / mapper | input gate | output | forbidden shortcut |
|---|---|---|---|
| `pub fn ReplayRetentionBoundarySnapshot::from_lookup_result(target_ref: ReplayTargetRef, marker: Option<&RetentionMarker>) -> Result<Self, DomainError>` | application只可在retention repository committed same-snapshot lookup返回`Ok(marker)`的match arm调用；Some时complete marker target exact | opaque `{ target_ref, marker: Option<complete snapshot> }` | public fields/direct variant、protocol/entry/config构造、错误/超时/未加载映射None、从target kind推断absence |
| `target_ref()` / `marker()` / `signal()` | read-only；`signal()` total映射None->Unmarked，Some->exact marker state | P9 policy inspection | boolean `is_safe`、从reason猜state |
| `pub fn ReplayProtectionBoundarySnapshot::from_lookup_result(target_ref: ReplayTargetRef, protection: Option<&ActiveReferenceProtection>) -> Result<Self, DomainError>` | application只可在active-protection repository committed same-snapshot lookup返回`Ok(protection)`的match arm调用；Some时complete relation target exact | opaque `{ target_ref, protection: Option<complete snapshot> }` | public fields/direct variant、缺失加载、分页未完成、adapter unavailable或lookup error冒充None |
| `target_ref()` / `protection()` / `signal()` | read-only；`signal()` total映射None->NotPresent，Some->exact protection state | P9 policy inspection | scope-wide bool、从consumer count猜state |
| `pub fn ReplayTargetBoundarySnapshot::try_from_lookups(scope: &ReplayScope, target_ref: ReplayTargetRef, retention: ReplayRetentionBoundarySnapshot, protection: ReplayProtectionBoundarySnapshot, no_write: NoWriteGuardDecision) -> Result<Self, DomainError>` | scope为Defined；target是exact member；从scope复制allowed effect；两类boundary的target均exact；P10为Replay + same scope/target/effect/identity/scope | one complete target entry | caller提交独立effect、跨target relation、只抄P10 scope/outcome、Blocked P10被替换 |
| `pub fn ReplayTargetBoundarySnapshotSet::try_from_complete_lookups(scope: &ReplayScope, entries: Vec<ReplayTargetBoundarySnapshot>) -> Result<Self, DomainError>` | 每个scope target恰好一项；两类lookup均完成；P10 same scope/target/effect；canonical sort/unique | complete per-target set | database row count推断absence、漏页、partial batch、一个global relation复制到多target |

Step 07 repository port必须以`Result<Option<Versioned<...>>, RepositoryError>`或等价typed committed result区分`Ok(None)`与加载失败；D批不提前定义该port或伪造repository proof token。两个opaque snapshot只有`from_lookup_result`一个public Rust factory且不在contracts/protocol/serde暴露；application只可在成功`Ok(option)` match branch调用，repository error与未完成batch保留为application/infrastructure error，不能进入None分支。Step 11仍须为同一consistent read snapshot、unique relation key和scope save前的并发重检/CAS给出实现闭环；D批snapshot不伪装repository version，也不替代该并发门禁。

`ReplayTargetEffectRuleSet`固定六个allowlisted pair：Gap/Scan、SignalRollup/RebuildRollup、ReferenceSnapshot/Refresh，以及三个derived view/RebuildProjection。`ReplayRetentionRuleSet`覆盖五个explicit `ReplayRetentionSignal`（`Unmarked`加四个marker state）；`ReplayProtectionRuleSet`覆盖六个explicit `ReplayProtectionSignal`。`Unmarked/NotPresent`是opaque snapshot在完成same-target lookup后形成的typed signal，不是未加载/default；Released relation通常由object invariant在evaluation前拒绝，但规则仍必须显式存在并只能Block，防止decode/rehydration路径漏分支。旧`ReplayApprovalSnapshot`中的单一`retention_state`/`protection_state`字段降为historical candidate；current canonical shape改为`scope_snapshot + target_boundary_snapshots + outcome`。如果保留summary accessor，只能从set在调用点计算，不能作为持久化或decision字段。

### 32.4 no-write evaluation target 与 outcome

```rust
/// Target shape accepted by P10 before the no-write decision is made.
pub enum NoWriteEvaluationTarget {
    /// A local observation-side target with one already validated derived effect.
    Local {
        target_ref: NoWriteLocalTargetRef,
        local_effect: ObservationLocalEffect,
    },
    /// A source or external target that must be blocked.
    Forbidden(ForbiddenWriteTargetRef),
}

/// Exact read-side selector evaluated by P10 and P11 for one Query surface.
pub enum ReadEvaluationTargetRef {
    /// One stable observation-owned object or view identity.
    Object(ObservationObjectRef),
    /// One canonical projection scope used by list/page queries.
    ProjectionScope(ObservationProjectionScope),
    /// One transient audit-timeline selection over committed append facts.
    AuditTimeline {
        subject_ref: AuditSubjectRef,
        window: AuditTimelineWindow,
    },
    /// One body-free evidence input preview or committed snapshot identity.
    EvidenceIndexInput {
        input_ref: EvidenceIndexInputViewRef,
        consumer_scope: EvidenceConsumerScope,
    },
    /// One composite retention/protection read keyed by the protected relation.
    RetentionProtection(ProtectedObservationRef),
}

/// Exact observation-owned target family evaluated by the no-write guard.
pub enum NoWriteLocalTargetRef {
    /// An already committed or committed-input-derived read-side selection.
    Read {
        request_context_ref: DiagnosticRequestContextRef,
        target_ref: ReadEvaluationTargetRef,
    },
    /// One report-handoff aggregate evaluated or prepared locally.
    Handoff(ReportHandoffRecordRef),
    /// One local external-audit export-preparation aggregate.
    ExportPreparation(ExternalAuditExportPreparationRef),
    /// One validated derived-maintenance descriptor.
    Maintenance(MaintenanceTargetRef),
    /// One exact target inside one immutable replay scope.
    Replay {
        scope_ref: ReplayScopeRef,
        target_ref: ReplayTargetRef,
    },
}

/// Finite discriminator used by P10 material without discarding the tagged target payload.
pub enum NoWriteLocalTargetKind {
    Read,
    Handoff,
    ExportPreparation,
    Maintenance,
    Replay,
}

/// Finite observation-owned effect that may pass P10 without granting external write authority.
pub enum ObservationLocalEffect {
    /// Reads an already committed observation or diagnostic surface.
    ReadCommittedSurface,
    /// Evaluates or prepares a body-free handoff/export surface.
    PrepareBodyFreeHandoff,
    /// Applies one validated observation-side maintenance effect.
    DerivedMaintenance(MaintenanceAllowedEffect),
    /// Applies one approved observation-side replay effect.
    ApprovedReplay(ReplayAllowedEffect),
}

/// Expected result of one no-write evaluation; Block is not a DomainError.
pub enum NoWriteGuardOutcome {
    /// The operation is limited to the declared local observation-side effect.
    AllowedObservationEffect(ObservationLocalEffect),
    /// The attempted target is forbidden and must be fail-closed.
    Blocked,
}

/// Local-effect family used by the trigger compatibility table.
pub enum ObservationLocalEffectKind {
    ReadCommittedSurface,
    PrepareBodyFreeHandoff,
    DerivedMaintenance,
    ApprovedReplay,
}

/// One trigger-to-local-effect compatibility rule.
pub struct NoWriteTriggerEffectRule {
    trigger_kind: NoWriteTriggerKind,
    local_effect_kind: ObservationLocalEffectKind,
}

pub struct NoWriteTriggerEffectRuleSet(Vec<NoWriteTriggerEffectRule>);

/// One exact local object/effect compatibility rule.
pub struct NoWriteLocalEffectRule {
    target_kind: NoWriteLocalTargetKind,
    local_effect: ObservationLocalEffect,
}

pub struct NoWriteLocalEffectRuleSet(Vec<NoWriteLocalEffectRule>);
```

`ReadEvaluationTargetRef`覆盖14个Query所需的五类exact selector；page/list用ProjectionScope，AuditTimeline与EvidenceIndexInput保留自身transient selector，RetentionProtection不伪造view identity，其余对象/view使用Object。它不授权读取，也不持久化Query context。`NoWriteTriggerEffectRuleSet`必须恰好包含四个pair：ReadOrDiagnostic/Read、HandoffOrExport/PrepareHandoff、Maintenance/DerivedMaintenance、Replay/ApprovedReplay；无cross-family allow。`NoWriteLocalEffectRuleSet`最多包含11个safe pair：Read/Read、Handoff与ExportPreparation/Prepare、四个Maintenance/effect、四个Replay/effect；conflicting duplicate拒绝，empty为显式deny-all。nested descriptor还必须逐字段验证：Read request context、Maintenance target/effect、Replay scope/target/effect均exact；rule不能靠broad kind绕过。`NoWriteEvaluationTarget::Local`是唯一合法的local target表达；不得把它编码成`ForbiddenWriteTargetRef`，也不得用`allow_read_only(bool)`代替effect binding。`ObservationLocalEffect`只表达本仓允许尝试的有限local effect，不授权actor、不证明scope membership，也不替代P7/P9/P11/P17/P18各自decision。`Blocked`是正常guard outcome，exact attempted target只在enclosing `NoWriteGuardDecision`保存一次。Forbidden target可由application建立current R06.4 `NoWriteViolation`；local classification conflict不得伪造external ref，后续H6/operations diagnostic以decision说明承接。policy本身不调用adapter、不写violation、不生成record。

### 32.5 read-side complete snapshot

```rust
/// Exact request-purpose and visibility-scope pair accepted by P11.
pub struct ReadPurposeScopeRule {
    purpose: ReadPurpose,
    scope_kind: VisibilityScopeKind,
}

pub struct ReadPurposeScopeRuleSet(Vec<ReadPurposeScopeRule>);

/// Payload-free freshness discriminator used by P11 material.
pub enum ReadProjectionFreshnessKind {
    Fresh,
    Stale,
    Rebuilding,
    Unknown,
}

/// P11 may preserve committed visibility or narrow it to Restricted.
pub enum ReadFreshnessAction {
    PreserveCommitted,
    Restrict,
}

pub struct ReadFreshnessRule {
    freshness_kind: ReadProjectionFreshnessKind,
    action: ReadFreshnessAction,
}

pub struct ReadFreshnessRuleSet(Vec<ReadFreshnessRule>);

/// Explicit P11 action for a persisted degraded visibility surface.
pub enum ReadDegradedAction {
    Restrict,
    NotVisible,
    Block,
}

/// Complete body-free target snapshot for one request-scoped visibility evaluation.
pub struct ReadVisibilityTargetSnapshot {
    target_ref: ReadEvaluationTargetRef,
    projection_scope: ObservationProjectionScope,
    freshness: ObservationProjectionFreshnessSurface,
    gaps: GapPolicySnapshotSet,
    source_visibility: ReadVisibilitySourceSnapshot,
}

/// Complete persisted or committed-input-derived visibility provenance consumed by P11.
pub struct ReadVisibilitySourceSnapshot {
    surface: VisibilitySurface,
    constraint_ref: Option<VisibilityConstraintRef>,
    block_reason: Option<ReadBlockReason>,
}

/// One-shot read input; it is never persisted by synchronous Query.
pub struct ReadVisibilityInputSnapshot {
    visibility_ref: ReadVisibilityRef,
    request_context: DiagnosticRequestContext,
    target: ReadVisibilityTargetSnapshot,
    visibility_scope_ref: VisibilityScopeRef,
    no_write: NoWriteGuardDecision,
}
```

`ReadPurposeScopeRuleSet`必须恰好包含四个exact pair：Query/Observation、Diagnostic/Diagnostic、HandoffPreview/Handoff、ExportPreparation/Export；不能收窄、cross-map或用absence表达deny，否则14个正式Query会因部署material缺项产生非设计行为。具体actor/consumer restriction由loaded visibility provenance表达，不删operation family。`ReadFreshnessRuleSet`必须覆盖四种freshness kind；Rebuilding/Unknown只能Restrict，Fresh可Preserve，Stale由material Preserve或Restrict。`ReadDegradedAction`只有收窄动作，无Visible/Preserve；`Block`固定映射`ReadBlockReason::VisibilityConstraint`，不能由policy material伪造SafetyBoundary、NoWriteGuard、RetentionBoundary或InconsistentSnapshot来源。

`pub fn ReadVisibilitySourceSnapshot::from_loaded_target(surface: VisibilitySurface, constraint_ref: Option<VisibilityConstraintRef>, block_reason: Option<ReadBlockReason>, gaps: &GapPolicySnapshotSet) -> Result<Self, DomainError>`是application可见、字段private且无serde的process-local domain factory，必须执行以下total matrix：

| persisted / committed source surface | constraint | block reason | gap binding |
|---|---|---|---|
| Visible | None | None | surface gap/degraded均None；loaded gap set可含其他diagnostic gap但不能被解释为visibility限制 |
| Restricted | Some | None | surface gap/degraded均None；constraint来自loaded owning state，不由request提交 |
| NotVisible | None | None | surface gap Some且必须对应`gaps`中Open/Acknowledged的exact revision |
| Blocked | None | Some | surface gap可None；Some时必须对应`gaps`中exact open revision；typed reason来自owning state/P10/retention/safety provenance，不从public kind猜测 |
| Degraded + limited | optional Some | None | embedded degraded gap若Some必须匹配set；缺constraint时P11不能选择Restricted，只能按material进一步收窄 |
| Degraded + blocked | None | Some | embedded gap按`DegradedSurface`矩阵可选并必须匹配set；hard-block reason必须由owning source显式提供 |

public `VisibilitySurface`本身不保存internal block reason，因此不能单独构造该snapshot。application必须从loaded owning object/view的typed state/reason和surface一起做exhaustive mapping；若repository/view已丢失hard-block provenance，返回`RelationMismatch(StateSnapshot)`并登记Step07/08/11 affected gap，不能按`SafetyBoundary`或`InconsistentSnapshot`默认猜测。`GapPolicySnapshotSet::try_for_expected_refs`使用§26.2.1 public domain factory并要求expected set一一相等；surface/degraded中的gap必须属于该set。

`ReadVisibilitySourceSnapshot::source_gap_ref()`只返回surface自身的NotVisible/Blocked gap或embedded `DegradedSurface.gap_ref`，并再次确认该ref指向set中的current `Open/Acknowledged` revision。完整`target.gaps`可以包含其他diagnostic gap，但这些gap没有source visibility provenance，不得被P11借来填充Blocked/NotVisible output。

application通过以下两个public Rust domain factory组装P11 input，字段仍private且无serde/default：

| factory | complete gate |
|---|---|
| `pub fn ReadVisibilityTargetSnapshot::from_committed_target(target_ref: ReadEvaluationTargetRef, projection_scope: ObservationProjectionScope, freshness: ObservationProjectionFreshnessSurface, gaps: GapPolicySnapshotSet, source_visibility: ReadVisibilitySourceSnapshot) -> Result<Self, DomainError>` | target与projection scope兼容；freshness来自same committed head；source surface引用的constraint/gap与complete gap revisions一致；EvidenceIndexInput preview只可由committed constituent facts/cursor组装 |
| `pub fn ReadVisibilityInputSnapshot::try_new(visibility_ref: ReadVisibilityRef, request_context: DiagnosticRequestContext, target: ReadVisibilityTargetSnapshot, visibility_scope_ref: VisibilityScopeRef, no_write: NoWriteGuardDecision) -> Result<Self, DomainError>` | context projection/visibility/diagnostic scope与target一致；P10为ReadOrDiagnostic + same request context + same read target + ReadCommittedSurface + ObservationMaintenance；另一个actor/request不能复用 |

`visibility_ref`由application id generator为本次one-shot evaluation生成，只在process内使用，不持久化。P10 decision必须绑定`ReadOrDiagnostic` + `NoWriteLocalTargetRef::Read { request_context_ref: same request context, target_ref: same target }` + `ReadCommittedSurface`；P10自身验证`trigger_ref`等于该`request_context_ref.body_free_ref()`且guard scope为`ObservationMaintenance`，P11 input factory再以完整context/target snapshot复核，防止同kind decision跨request复用。`request_context`、projection scope、target identity、freshness、complete gap revisions、source provenance和visibility scope必须在P11 decision中完整保留；Query只读这些已加载值，不刷新stale marker、不重建projection、不保存request context、不创建read record或outbox。

### 32.6 gap finite classification basis

```rust
/// Finite safety signal supplied to P12 by the redaction boundary.
pub enum GapSafetySignal {
    /// No unsafe-output condition was observed for this typed input.
    BodyFree,
    /// The selected output cannot be exposed under the current boundary.
    UnsafeOutput,
}

/// Explicit reference-resolution signal; NotApplicable is not absence/default.
pub enum GapReferenceSignal {
    NotApplicable,
    Pending,
    Resolved,
    Stale,
    Unresolved,
    Invalid,
    Unavailable,
}

/// Explicit request visibility signal; NotEvaluated is not absence/default.
pub enum GapVisibilitySignal {
    NotEvaluated,
    Visible,
    Restricted,
    NotVisible,
    Blocked(ReadBlockReason),
}

/// Complete typed basis consumed by P12; absence is not a classification.
pub struct GapClassificationBasis {
    source_binding: GapSourceAffectedBinding,
    reference_signal: GapReferenceSignal,
    visibility_signal: GapVisibilitySignal,
    safety_signal: GapSafetySignal,
}

/// Process-local proof that a loaded gap source affects one observation-owned object.
pub struct GapSourceAffectedBinding {
    source_snapshot: GapSourceRef,
    affected_object_ref: AffectedObservationObjectRef,
}

/// Finite policy-material key derived from one complete P12 basis.
pub struct GapClassificationRuleKey {
    source_kind: GapSourceKind,
    source_state: GapSourceState,
    reference_signal: GapReferenceSignal,
    visibility_signal: GapVisibilitySignal,
    safety_signal: GapSafetySignal,
}

/// One exact classification row; no wildcard or fallback row exists.
pub struct GapClassificationRule {
    key: GapClassificationRuleKey,
    result: GapClassificationRuleResult,
}

/// Canonical total table over every structurally valid finite key.
pub struct GapClassificationRuleSet(Vec<GapClassificationRule>);

/// Total P12 material result; inconsistent snapshots are explicit errors, not gap kinds.
pub enum GapClassificationRuleResult {
    Outcome(GapClassificationOutcome),
    RejectInconsistentSnapshot,
}

/// Expected P12 result for one complete typed basis.
pub enum GapClassificationOutcome {
    /// The complete basis does not justify opening an observation gap.
    NoGap,
    /// One explicit finite gap kind is justified by the basis.
    Classified(GapKind),
}
```

`pub fn GapSourceAffectedBinding::from_loaded_dependency(source: &GapSourceRef, affected: AffectedObservationObjectRef) -> Result<Self, DomainError>`是application可见、字段private且无serde的process-local domain factory，只能在application已通过typed dependency lookup或same-UoW object relation证明后调用；它不持久化`dependency_bound: bool`，也不允许entry提交任意affected ref。`pub fn GapClassificationBasis::try_new(source_binding: GapSourceAffectedBinding, reference_signal: GapReferenceSignal, visibility_signal: GapVisibilitySignal, safety_signal: GapSafetySignal) -> Result<Self, DomainError>`是唯一application assembly factory：从完整source snapshot读取state；ReferenceSnapshot source要求非`NotApplicable`，其他五种source kind要求`NotApplicable`；visibility/safety使用exact finite token并先验证结构兼容矩阵。P12只接受该factory形成的basis。

`NotEvaluated`是显式visibility signal。字段缺失、未知token、错误消息、`Option::None` fallback或`default_gap_kind`都不能生成`GapKind`。`NoGap`是正常typed outcome且不会创建`GapState`；handoff阻塞/降级由P7基于persisted `GapKind + lifecycle`独立决定，P12不拥有第二套handoff readiness truth。

## 33. P7 `HandoffReadinessPolicy`

### 33.1 capability / object source

P7对一个已存在的`ReportHandoffRecord`和其append-once committed `EvidenceIndexInputView`计算current readiness。它消费同handoff已接受并绑定的current `AuthenticityHint`、input列出的完整gap snapshot、同target retention/protection snapshot以及P10 no-write decision。P7不直接消费P6 decision，不重新执行origin resolver，不创建hint/marker/protection/handoff，也不把`RealEvidenceLinked`解释为真实性verdict。

### 33.2 complete target-bound input

```rust
/// Retention and active-protection pair required by one handoff input.
pub struct HandoffRetentionSnapshot {
    marker: RetentionMarkerPolicySnapshot,
    protection: Option<ActiveProtectionPolicySnapshot>,
}

/// Complete immutable input captured by one P7 readiness decision.
pub struct HandoffReadinessInputSnapshot {
    handoff: AuthenticityHandoffSnapshot,
    input: CommittedEvidenceIndexInputSnapshot,
    current_consumer: ReportConsumerRef,
    authenticity_hint: Option<AuthenticityHintSnapshot>,
    gaps: GapPolicySnapshotSet,
    retention: Option<HandoffRetentionSnapshot>,
    no_write: NoWriteGuardDecision,
}
```

| input part | exact binding rule |
|---|---|
| handoff/input | handoff state只能Draft/Prepared或可重试/政策阻塞Failed；input ref必须等于handoff immutable ref，purpose=`ReportHandoffInput`，consumer exact=`ObservationConsumerRef::Report(handoff.consumer_ref)` |
| current consumer | application从current validated catalog/repository加载完整`ReportConsumerRef`；stable id/kind/scope/purpose必须等于handoff保存的consumer revision，只允许`boundary_state`变化；缺失、kind/scope/purpose漂移为relation error，不能回退使用handoff旧state |
| committed proof | input来自repository load或same-UoW accepted append；cursor/content/committable matrix必须成立；preview无法构造proof |
| hint | handoff `authenticity_hint_ref=None`时只能None；Some时loaded hint ref/handoff ref/complete snapshot必须exact，缺loaded object返回error |
| gaps | loaded complete revision set按ref canonical排序并与input `gap_refs`一一相等；hint gap refs必须是该set子集；`effective_gap_refs`只取当前`Open/Acknowledged`项并canonical排序；Resolved/Suppressed仍留在complete snapshot用于stale-decision binding，但不得继续进入current output gap set；handoff旧gap refs只在handoff pre-snapshot中保留供stale-decision检查 |
| retention | handoff无marker ref时只能None；Some时marker必须加载，marker relation为Some时protection必须加载且ref/target exact，relation为None时protection必须None；state/consumer是否足以Ready由matrix决定 |
| no-write | decision必须绑定`HandoffOrExport` trigger、`trigger_ref == handoff_ref.body_free_ref()`、`NoWriteLocalTargetRef::Handoff(current handoff)`、`PrepareBodyFreeHandoff` local effect和`ObservationMaintenance` guard scope；不得传入P10 policy对象代替结果 |

`HandoffRetentionSnapshot::from_loaded(marker, protection, handoff)`要求marker为handoff dependency index选出的同一`ProtectedObservationRef`，并验证marker relation与Option protection成对、target/ref exact；它不在构造阶段要求Protected或current consumer存在。evaluation中只有marker `ActiveHold` + protection `Protected` + active set包含exact `ObservationConsumerRef::Report(current_consumer)`才满足Ready前置；不能用handoff保存的旧consumer revision做active-set equality。`Unmarked/ReleaseEligible/Unprotected/Expired`保持Pending，relation/consumer已明确冲突或Released才Blocked；marker ActiveHold本身不是cleanup或external delivery授权。

### 33.3 exact policy schema / signatures

```rust
/// Immutable handoff-readiness policy over one resolved rule snapshot.
pub struct HandoffReadinessPolicy {
    basis: PolicyEvaluationBasis,
    rules: HandoffReadinessRuleSet,
}

impl HandoffReadinessPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        rules: HandoffReadinessRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn evaluate(
        &self,
        handoff: &ReportHandoffRecord,
        input: &CommittedEvidenceIndexInputSnapshot,
        current_consumer: &ReportConsumerRef,
        authenticity_hint: Option<&AuthenticityHint>,
        loaded_gaps: &[GapState],
        retention_marker: Option<&RetentionMarker>,
        active_protection: Option<&ActiveReferenceProtection>,
        no_write_decision: &NoWriteGuardDecision,
    ) -> Result<HandoffReadinessDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

factory要求family=`HandoffReadiness`，验证§31.5全部typed material digest，四个gap kind rule必须total。hint action没有Ready；non-fresh action没有Allow/Ready。policy不按consumer id生成实例，不保存consumer、handoff、clock、repository或另一个policy ref。

R06.4 canonical `HandoffReadinessDecision`在D批同步后保存：P7 `policy_basis`、完整`HandoffReadinessInputSnapshot`、readiness、output visibility、output gap set、retention marker ref、no-write scope和typed block reason。`pub(crate)` constructor只由P7调用；`applies_to`重新构造上述snapshot并逐字段比较。原只含identity和flattened output的shape不足以阻止hint/gap/retention/no-write stale replay，不能继续单独实现。

### 33.4 deterministic readiness matrix

evaluation先完成§33.2全部structural binding；随后按以下优先级选择第一个终局，低优先级不得覆盖高优先级：

| priority | exact condition | readiness / output |
|---:|---|---|
| 1 | consumer不是`Active`、scope/purpose不兼容 | `Blocked(ConsumerUnavailable)`；不调用delivery |
| 2 | P10 outcome为Blocked或不是current handoff/local effect | valid Blocked outcome -> `Blocked(NoWriteGuardBlocked)`；binding mismatch -> error |
| 3 | input visibility为NotVisible/Blocked或blocked Degraded | `Blocked(VisibilityBlocked)`；body absent，保留input gap |
| 4 | retention marker/protection为Conflict/Conflicted/Released或relation不再保护current report consumer | valid boundary state -> `Blocked(RetentionBoundary)`；relation mismatch -> error |
| 5 | 任一Open/Acknowledged gap的rule为Block | `Blocked(EvidenceGap)`；完整gap set保留 |
| 6 | handoff尚未绑定hint，或hint state=`Unassessed` | `PendingEvidence`；绝不由config升级 |
| 7 | marker/protection缺失、Unmarked、ReleaseEligible、Unprotected或Expired | `PendingEvidence`；等待独立P8 accepted state，不自行hold/release |
| 8 | input freshness非Fresh | 按`NonFreshHandoffInputAction`返回Pending/Blocked(InputNotFresh)/Degraded；Blocked不要求或伪造gap；Degraded要求typed gap，否则回到Pending |
| 9 | hint为PlaceholderDetected或Insufficient | 按对应action返回Pending或Degraded；绝不Ready；hint reason/gaps继续可审计 |
| 10 | 任一open gap rule为Degraded，或input已是limited Degraded | `Degraded`；不得升级现有surface |
| 11 | input visibility Restricted | action=Block -> Blocked；Degraded -> Degraded；Allow继续；仍须前述全部门禁通过 |
| 12 | hint=`RealEvidenceLinked`、input Fresh且Visible/allowed Restricted、无open gap、retention ActiveHold + protection Protected、P10 allowed | `Ready` |

readiness决定后的output assembly也是total matrix，不允许owning member或response mapper二次推导：

| readiness | `visibility` | `gap_refs` | `retention_marker_ref` | `no_write_guard_scope` | `block_reason` |
|---|---|---|---|---|---|
| PendingEvidence | None | current `effective_gap_refs`，允许empty | exact loaded marker ref或None | exact P10 trigger guard scope | None |
| Ready | exact input Visible或allowed Restricted surface | empty | required ActiveHold marker ref | `ObservationMaintenance` | None |
| Degraded | `VisibilitySurface::degraded(total mapped DegradedSurface)` | current `effective_gap_refs`，允许authenticity/restricted-only empty | exact loaded marker ref | `ObservationMaintenance` | None |
| Blocked | `VisibilitySurface::blocked(selected real effective gap or None)` | current `effective_gap_refs` | exact loaded marker ref或None | exact P10 trigger guard scope | exact one of six `HandoffBlockReason` variants |

`selected real effective gap`只可从`effective_gap_refs`按本节固定priority和canonical ref选择，用于public marker；不能为ConsumerUnavailable、NoWriteGuardBlocked或无gap的RetentionBoundary伪造gap。完整历史/当前gap revisions只保存在`input_snapshot.gaps`用于审计和stale binding，flattened `gap_refs`不复制Resolved/Suppressed历史项。Ready强制empty是因为任何effective gap已在更高优先级终止。decision中的flattened marker/no-write字段只是inspection copy，不能替代complete input snapshot binding。

`Degraded` output使用现有`VisibilitySurface::degraded`和typed `DegradedReason`构造，不得比input surface更宽；无法形成合法limited surface时必须Pending或Blocked，不能伪造gap。映射为total table：

| selected limiting source | `DegradedReason` | gap requirement |
|---|---|---|
| open `UnsafeOutput` | `SafetyLimited` | exact selected gap Some |
| open `NotVisibleMaterial` | `NotVisible` | exact selected gap Some |
| open `UnresolvedReference` | `UnresolvedReference` | exact selected gap Some |
| open `MissingMaterial` | `MissingMaterial` | exact selected gap Some |
| stale/rebuilding/unknown input and policy chose Degraded | `Stale` | exact selected explanatory gap Some；没有gap则固定Pending |
| Restricted input and policy chose Degraded | `VisibilityLimited` | gap None unless another higher-priority open gap exists |
| PlaceholderDetected or Insufficient hint and policy chose Degraded | `AuthenticityLimited` | selected hint/input gap Some when present，otherwiseNone |

多个degraded来源按`UnsafeOutput > NotVisibleMaterial > UnresolvedReference > MissingMaterial > stale > restricted > placeholder/insufficient`固定优先级选择surface reason；同kind按typed ref canonical first。完整revision set保留在input snapshot，全部effective refs保留在decision output，不因选择一个public reason丢失其他current gap。`VisibilityLimited`不等于NotVisible，`AuthenticityLimited`不等于SafetyLimited或真实性verdict。

### 33.5 decision consumption / error / zero side effect

`ReportHandoffRecord::apply_readiness(&mut self, handoff_inputs..., &decision, updated_at)`、`prepare(..., &decision, updated_at)`和`block(..., &decision, updated_at)`是唯一public consumers；D批affected sync将签名改为借用decision并传入用于complete binding的loaded input/current consumer/hint/gaps/retention/protection/no-write material。member先执行`decision.applies_to`，后按readiness调用private helper。Ready只更新readiness snapshot；Prepared/Delivered仍由独立member和adapter flow决定。

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(UnexpectedFamily/SnapshotDigestChanged)` | wrong P7 family或typed material digest不匹配 |
| `MissingRequiredReference` | handoff已绑定hint/marker/protection/gap但对应loaded object缺失，或committed input无法加载 |
| `RelationMismatch(Subject/Consumer/Scope/Target)` | handoff/input/hint/gap/retention/protection/no-write target关系不一致 |
| `RelationMismatch(StateSnapshot/DecisionBinding)` | complete snapshot与loaded current对象不同，或P10 decision跨trigger/target/effect/basis复用 |
| `InvalidStateTransition` | Delivered/Cancelled、permanent/rejected Failed或其他不可重评handoff状态 |
| `HandoffInvariantViolation` | decision output optional-field/readiness/visibility/gap/reason矩阵不成立 |
| `RetentionConflict` | marker/protection自身字段无法形成合法snapshot，而非正常Conflict state |
| `NoWriteBoundaryViolation` | caller绕过P10 decision、试图直接声明guard通过 |

Pending、Blocked、Degraded不是error。所有error保持handoff/input/hint/gap/marker/protection逐字段不变，不创建decision/transition/H4 record/outbox/token，不消费identity，不调用resolver、repository、clock或delivery adapter。planned tests覆盖：preview不能构造committed proof、all four hint states、missing/foreign hint、all visibility/freshness states、four gap kinds x lifecycle x handling、multi-gap priority、retention/protection/consumer全矩阵、P10 allowed/blocked/cross-target、consumer Active/Blocked/Retired、Ready必要充分条件、Placeholder/Insufficient永不Ready、changed decision重评、cross-handoff/input/basis replay、zero mutation，以及body/locator/credential/provider/run id/evidence alias/verdict/signoff扫描。对象停审：`pass_R06.5-D_P7_design_only`。

## 34. P8 `RetentionProtectionPolicy`

### 34.1 capability / two-stage boundary

P8拥有两个严格有序的纯评估能力：

1. 对一个`ActiveReferenceProtection`的complete observed consumer set逐项消费trusted current state，形成`ActiveProtectionReleaseDecision`。
2. 只有上述decision已被same object成功应用并得到reconciled post-snapshot后，才对一个exact `RetentionMarker`形成`RetentionMarkerDecision`。

P8不读取repository、不调用consumer adapter、不执行cleanup/archive/delete、不直接mutate marker/protection，也不把consumer ref缺失当inactive。application负责在同一consistent UoW加载对象和typed consumer state；policy只评估。任何第一阶段error或stale-decision都终止流程，第二阶段不得使用旧protection snapshot继续计算。

### 34.2 exact policy schema / complete signatures

```rust
/// Immutable retention/protection policy over one resolved rule snapshot.
pub struct RetentionProtectionPolicy {
    basis: PolicyEvaluationBasis,
    consumer_state_rules: RetentionConsumerStateRuleSet,
    empty_consumer_release_reason: RetentionReleaseReason,
    marker_rules: RetentionMarkerRuleSet,
}

impl RetentionProtectionPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        consumer_state_rules: RetentionConsumerStateRuleSet,
        empty_consumer_release_reason: RetentionReleaseReason,
        marker_rules: RetentionMarkerRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn evaluate_active_protection(
        &self,
        protection: &ActiveReferenceProtection,
        consumer_states: &RetentionConsumerStateSnapshotSet,
    ) -> Result<ActiveProtectionReleaseDecision, DomainError>;

    pub fn evaluate_retention_marker(
        &self,
        marker: &RetentionMarker,
        reconciled_protection: Option<&ActiveReferenceProtection>,
    ) -> Result<RetentionMarkerDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

factory要求family=`RetentionProtection`；21个consumer tagged states各有exact rule；marker rules固定48 keys，不允许wildcard/default/first-match ambiguity。object-invariant invalid tuple必须显式映射Conflict，不能缺行或当factory error绕过total material。`empty_consumer_release_reason`只处理原observed set本来就是empty的关系；非空observed set全部inactive时，release reason必须由每个`ReleaseCandidate(reason)`一致得出，mixed reason返回`RetentionConflict`而不是任选一个。

### 34.3 active-protection decision schema 与 reconciliation

R06.4 canonical `ActiveProtectionReleaseDecision`同步扩展为：

- P8完整`policy_basis`。
- `ActiveProtectionPolicySnapshot` observed pre-state。
- `RetentionConsumerStateSnapshotSet`，必须与pre-state `consumer_refs`一一相等。
- exact revalidated `active_consumer_refs`。
- selected `release_reason`。
- `ActiveProtectionReleaseOutcome`。

consumer rule总语义：

| consumer family | state -> disposition requirements |
|---|---|
| Report | `Active`只能KeepActive；`Pending/Blocked`由snapshot material明确KeepActive或Conflict，不能自动释放；`Retired`只能ReleaseCandidate |
| Peripheral | `Active/Limited`只能KeepActive；`Blocked`由material明确KeepActive或Conflict；`Retired`只能ReleaseCandidate |
| ReadModel / Diagnostic | `ActiveCurrentHead` KeepActive；`Superseded/Missing` ReleaseCandidate；`SnapshotConflict` Conflict |
| ArchiveHandoff | `Pending/Ready/Blocked`由material明确KeepActive或Conflict；`Delivered/Failed`可由material ReleaseCandidate，但不得解释为archive accepted |

policy逐consumer应用rule并构造`retained_consumer_refs = KeepActive refs union Conflict refs`。在选择outcome前，全部`ReleaseCandidate` disposition的release reason必须一致，全部`Conflict` disposition的conflict reason也必须一致；任一组出现mixed reason都返回`RetentionConflict`且不生成decision，即使另一组同时存在也不得因Conflict优先而跳过release-reason一致性检查。通过一致性门禁后，任一Conflict优先；Conflict consumer自身与所有KeepActive consumer都必须保留，不能因无法分类为normal active而从保护关系消失。无Conflict且retained set non-empty产出`Protected`，维持合法保护关系并清除旧release/conflict reason；retained set empty且pre-state consumer set non-empty产出`Expired`并保存唯一release reason；pre-state set empty可产出`Releasable`，但Protected不能直接Release。`Expired`只是要求下一轮fresh re-evaluation；只有loaded protection当前为Unprotected/Expired/Conflicted、current observed set empty且fresh P8 basis确认后，才允许`Releasable`。

`ActiveReferenceProtection::apply_release_decision(&mut self, consumer_states: &RetentionConsumerStateSnapshotSet, decision: &ActiveProtectionReleaseDecision)`是唯一public policy consumer。member重建pre-snapshot和consumer-state binding，atomic replace active set/state/reasons；exact replay None。decision cross-protection/target/consumer/basis reuse或caller先修改consumer set均zero mutation。R06.4 canonical owner同步保存完整decision schema，不在本文件复制Rust declaration。

### 34.4 retention marker decision 与 mandatory order

`evaluate_retention_marker`接收的protection必须是第一阶段accepted mutation后的current object，或marker根本无active-protection ref时为None。完整input为`RetentionMarkerPolicySnapshot` + `Option<ActiveProtectionPolicySnapshot>`；decision保存P8 basis、两份snapshot、target state、release/conflict reason。`RetentionMarkerDecision::applies_to(marker, reconciled_protection)`逐字段重建，不接受只传state/ref。

| marker/protection condition | exact P8 outcome |
|---|---|
| marker `Released` | `Err(InvalidStateTransition)`；terminal/reserved，rule table不覆盖 |
| marker有protection ref但参数None/foreign ref/target | missing或relation error；不猜unprotected |
| protection `Protected`且active set non-empty | `ActiveHold`；relation/ref保留，reasons清空 |
| protection `Conflicted` | `Conflict`，reason按typed protection conflict映射；active set保留 |
| protection `Unprotected/Expired/Released`且set非empty | object invariant error，不进入normal outcome |
| protection `Expired` | `ActiveHold`或`Conflict`由explicit marker rule决定；绝不直接ReleaseEligible |
| protection `Released`或无relation，且marker rule满足empty set release候选 | `ReleaseEligible(reason)`；只表示candidate，不cleanup |
| archive eligibility unresolved、pending handoff、active replay等typed boundary | `Conflict(exact reason)`；不能从message或repository error推导 |

顺序固定：load pre marker/protection/consumers -> P8 protection decision -> protection apply/save in current UoW -> rebuild `ActiveProtectionPolicySnapshot` -> P8 marker decision -> marker apply/save。application可以在同一UoW中完成两次mutation，但第二次输入必须是内存中accepted post-state；若任一save/CAS失败，两者和H5 records一起rollback。禁止一次evaluate同时返回两个decision，禁止marker先于protection更新，禁止用旧pre-state决定ReleaseEligible。

### 34.5 error / zero side effect / planned tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(...)` | wrong family、invalid revision或material digest mismatch |
| `MissingRequiredReference` | protection observed set中的consumer没有typed loaded state，或marker-required protection未加载 |
| `RelationMismatch(Consumer/Target/StateSnapshot/DecisionBinding)` | consumer family/state tag、protected target、complete snapshot或decision cross-use不匹配 |
| `InvalidStateTransition` | Released protection/marker重评，或Protected直接消费Releasable |
| `RetentionConflict` | mixed release reasons、mixed conflict reasons、invalid marker/protection tuple、non-empty set与released/unprotected状态冲突 |
| `ReferenceConflict` | dependency index与read-model/diagnostic committed head snapshot冲突 |

ActiveHold、Protected、Expired、Releasable、Conflicted、ReleaseEligible和marker Conflict均是typed outcome/state，不是error。所有error不修改marker/protection/consumer，不生成decision/transition/H5 record/outbox，不调用cleanup/archive/consumer adapter，也不消费identity。planned tests覆盖21 tagged consumer states、KeepActive -> Protected、Conflict consumer retained、full-set equality/order/duplicate、missing lookup vs typed Missing、mixed active/inactive/conflict、mixed release/conflict reason、Protected不能direct Released、Expired re-evaluation、all marker/protection/presence tuples、mandatory two-stage order、post-snapshot vs stale pre-snapshot、cross-marker/protection/basis decision、CAS rollback handoff、release不cleanup/archive、zero mutation和body/locator/provider/retention-days扫描。对象停审：`pass_R06.5-D_P8_design_only`。

## 35. P9 `ReplayBoundaryPolicy`

### 35.1 capability / target cardinality

P9只对一个仍处于`Defined`的`ReplayScope`计算一次完整scope boundary decision。application必须先为scope中的每个`ReplayTargetRef`加载typed retention/protection relation，并调用P10得到same-target no-write decision；P9不自行查询、遍历全表、扩大target set、执行replay或协调job。一个scope有N个target时，input set必须恰好N项；任何单一global retention/protection state都不能代表整个集合。

### 35.2 exact policy schema / signatures

```rust
/// Immutable replay-boundary policy over one resolved rule snapshot.
pub struct ReplayBoundaryPolicy {
    basis: PolicyEvaluationBasis,
    target_effect_rules: ReplayTargetEffectRuleSet,
    retention_rules: ReplayRetentionRuleSet,
    protection_rules: ReplayProtectionRuleSet,
}

impl ReplayBoundaryPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        target_effect_rules: ReplayTargetEffectRuleSet,
        retention_rules: ReplayRetentionRuleSet,
        protection_rules: ReplayProtectionRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn evaluate(
        &self,
        scope: &ReplayScope,
        target_boundaries: &ReplayTargetBoundarySnapshotSet,
    ) -> Result<ReplayApprovalSnapshot, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

factory要求family=`ReplayBoundary`、六个exact target/effect pair、五个retention signals和六个protection signals各一条；no wildcard/default。rule可以对Expired/ReleaseEligible等中间态选择Allow或typed Block，但不能将ActiveHold/Conflict/Protected/Conflicted配置成Allow；factory遇到该unsafe material直接`ReplayBoundaryViolation`，而不是构造一个危险policy。

### 35.3 canonical `ReplayApprovalSnapshot` extension

R06.4 `domain::replay`中的唯一canonical declaration同步为四个字段：`policy_basis: PolicyEvaluationBasis`、`scope_snapshot: ReplayScopePolicySnapshot`、`target_boundary_snapshots: ReplayTargetBoundarySnapshotSet`与`outcome: ReplayBoundaryOutcome`。exact Rust declaration只在R06.4 owner文件出现，本节不建立第二definition。

constructor为`pub(crate)`且只允许P9调用。`scope_snapshot`逐字段复制scope；target set exact等于scope set，且每项effect等于scope effect。`applies_to(scope, target_boundaries)`重新构造scope和每target retention/protection/P10 decision complete snapshot；任何target排序、state、active set、guard decision或basis变化都使旧decision失效。snapshot不是public DTO、approval token、job plan、execution result或source-repair claim。

### 35.4 deterministic target evaluation

P9先完成scope/target set binding，再按target canonical order逐项评估；第一个blocked target决定outcome中的`target_ref`，完整input set仍保留供审计。优先级固定：

| priority | per-target condition | result |
|---:|---|---|
| 1 | P10 decision不是Replay trigger + same scope/target + `ApprovedReplay(scope effect)`，或其outcome Blocked | valid Blocked -> `NoWriteGuardBlocked`；binding不匹配 -> error |
| 2 | target/effect pair不在P9 allowlist | `EffectTargetMismatch` |
| 3 | retention rule选择Block | exact rule的typed `ReplayBlockReason` |
| 4 | protection rule选择Block | exact rule的typed `ReplayBlockReason` |
| 5 | all four checks allow | continue next target |

全部target allow时outcome=`Approved`。scope set mismatch、foreign target、duplicated/missing target、scope不在Defined、scope guard不是ObservationMaintenance、retention/protection observed relation指向其他target属于input/binding error，不压成正常Blocked。normal hold/protection/no-write policy block才是`ReplayBoundaryOutcome::Blocked`。

### 35.5 owning member / side-effect boundary

`ReplayScope::apply_boundary_decision(&mut self, target_boundaries, &decision) -> Result<ReplayScopeTransition, DomainError>`成为唯一public policy消费入口：

- `Approved`只允许`Defined -> Approved`，preserve exact target/effect/guard，reasons仍None。
- `Blocked { reason,.. }`只允许`Defined -> Blocked`，写入typed block reason，target set不变。
- member先complete `applies_to`，再atomic mutation；decision按借用消费。
- 修复前public `approve(ReplayApprovalSnapshot)`和policy-originated `block(reason)`降为module-private helper；explicit lifecycle close仍由原owning member处理。

P9/P10不创建`ReplayCoordinationState`、job plan、execution record、maintenance authorization或outbox。只有Approved scope能在后续P17/P18中按一个exact target继续；scope-wide job expansion留R06.6 immutable plan。

### 35.6 error / zero side effect / planned tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(...)` | wrong family或typed material digest mismatch |
| `MissingRequiredReference` | target set中的retention/protection lookup或P10 required material未加载；lookup absence必须已形成same-target `NotPresent`，不能由caller或missing load补造 |
| `RelationMismatch(Target/Scope/StateSnapshot/DecisionBinding)` | target set cardinality、scope pre-state、relation target或P10 decision跨target/basis不匹配 |
| `InvalidStateTransition` | scope非Defined或terminal scope重评 |
| `ReplayBoundaryViolation` | policy material试图allow unsafe target/effect、active hold/conflict、protected/conflicted或source/external write |
| `RetentionConflict` | loaded marker/protection自身不变量无法成立，不是normal hold/block state |
| `NoWriteBoundaryViolation` | caller省略P10或把policy object/guard scope当decision |

P9 Blocked是expected outcome，不是error。任何error或Blocked evaluation都不执行replay、不调用source/external write port；error不修改scope且不创建decision/transition，Blocked decision只有在owning member accepted后才产生transition。planned tests覆盖1/2/256 target cardinality、canonical order/duplicate/missing/extra、六类target requirement矩阵、六target-effect pairs、五个retention signals、六个protection signals、lookup None与missing/error/partial page区分、per-target mixed states、first blocked target stability、all P10 bindings、single global state无法构造、cross-scope/target/basis replay、Approved不执行、Blocked保留set、zero mutation，以及source/external/body/provider/run-id扫描。对象停审：`pass_R06.5-D_P9_design_only`。

## 36. P10 `NoWriteGuardPolicy`

### 36.1 capability / expected outcome

P10对一个trusted `NoWriteTriggerContextRef`和一个exact `NoWriteEvaluationTarget`形成Pass/Block decision。它覆盖Query/diagnostic、handoff/export、derived maintenance和approved replay四条路径，但不替代这些路径自己的业务policy。Forbidden source/external target永远Block；local target只有trigger/effect family与target/effect pair均在当前immutable material中才Allow。Block是正常expected outcome，不是`DomainError`。

### 36.2 `NoWriteGuardDecision`

```rust
/// Complete target-bound no-write result for one attempted local operation boundary.
pub struct NoWriteGuardDecision {
    policy_basis: PolicyEvaluationBasis,
    trigger_context_ref: NoWriteTriggerContextRef,
    attempted_target: NoWriteEvaluationTarget,
    outcome: NoWriteGuardOutcome,
}
```

`NoWriteGuardDecision::new`为`pub(crate)`且只允许P10调用。decision保存trigger context的identity/kind/scope和完整tagged target；`applies_to(trigger,target)`逐字段比较，Read/Maintenance/Replay nested descriptor也必须exact。accessor只提供`policy_basis()`、`trigger_context_ref()`、`attempted_target()`、`outcome()`、`forbidden_target() -> Option<&ForbiddenWriteTargetRef>`。没有`assert_passed`、bool conversion、generic `From<Result>`或public deserialize constructor。

### 36.3 exact policy schema / signatures

```rust
/// Immutable no-write guard over one resolved rule snapshot.
pub struct NoWriteGuardPolicy {
    basis: PolicyEvaluationBasis,
    trigger_effect_rules: NoWriteTriggerEffectRuleSet,
    local_effect_rules: NoWriteLocalEffectRuleSet,
}

impl NoWriteGuardPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        trigger_effect_rules: NoWriteTriggerEffectRuleSet,
        local_effect_rules: NoWriteLocalEffectRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn evaluate(
        &self,
        trigger_context_ref: &NoWriteTriggerContextRef,
        attempted_target: &NoWriteEvaluationTarget,
    ) -> Result<NoWriteGuardDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

factory要求family=`NoWriteGuard`、四个exact trigger/effect pair，验证local rules中每个nested effect/object compatibility。material可以删除safe pair形成deny-all/subset，但不能新增source/external target、把Handoff映射maintenance effect、把unapproved replay映射Allowed，或允许canonical truth object被maintenance/replay覆盖。unsafe material返回`NoWriteBoundaryViolation`，不构造policy。

### 36.4 total evaluation matrix

| input | exact outcome / validation |
|---|---|
| `Forbidden(SourceTruth)` | `Blocked`；target guard scope必须SourceTruth且trigger scope不能把它解释为local maintenance |
| `Forbidden(ExternalTruth)` | `Blocked`；target guard scope必须ExternalTruth |
| Local + trigger/effect kind pair absent | `Blocked`；是expected fail-closed |
| Local + broad target/effect pair absent | `Blocked`；是expected fail-closed |
| Read {request context,target} + ReadCommittedSurface | only ReadOrDiagnostic trigger；`trigger_ref == request_context_ref.body_free_ref()`；target使用`ReadEvaluationTargetRef`五类exact selector，P11另行证明完整context/scope/visibility |
| Handoff + PrepareBodyFreeHandoff | only HandoffOrExport trigger；`trigger_ref == handoff_ref.body_free_ref()` |
| ExportPreparation + PrepareBodyFreeHandoff | only HandoffOrExport trigger；`trigger_ref == preparation_ref.body_free_ref()` |
| Maintenance + DerivedMaintenance(effect) | only Maintenance trigger；`trigger_ref == maintenance_target_ref_id.body_free_ref()`；descriptor effect必须equal，且四类target/effect compatibility成立 |
| Replay {scope,target} + ApprovedReplay(effect) | only Replay trigger；`trigger_ref == scope_ref.body_free_ref()`；P10校验same target/effect no-write shape，scope当前Defined/Approved等lifecycle由P9/P18另行校验 |

所有local pair还要求`trigger_context.guard_scope == ObservationMaintenance`。identity不等、trigger kind不匹配、nested target/effect自相矛盾均属于`RelationMismatch`或`NoWriteBoundaryViolation`，不能压成普通deny，也不能由下游“补校验”后继续；合法且identity一致、但当前immutable allowlist缺pair时才返回expected `Blocked`。Forbidden target的trigger identity由trusted mutating flow和后续violation factory绑定，P10仍强制target kind与SourceTruth/ExternalTruth guard scope一致；它不从forbidden target猜local owning identity。

### 36.5 downstream consumption and violation boundary

P7/P9/P11及后续P17/P18必须保存并complete-bind P10 decision，不能只抄`NoWriteGuardScope`或传入policy ref。Allowed只证明本次exact target/effect未越过P10 no-write material，不授权actor、不推进任何state、不执行adapter。

Forbidden target Blocked后，application可在mutating Command/Consumer/Job path调用`NoWriteViolation::detect(violation_ref, trigger_ref, forbidden_target)`并立即`block`，随后F批H6建立record。P10不接收`violation_ref`，不创建violation，不消费record id。local pair Blocked没有合法`ForbiddenWriteTargetRef`，不得伪造external identity；caller fail closed并通过process-local decision/typed application surface报告。synchronous Query无论Allowed或Blocked都不创建violation/read record/outbox，不保存decision。

### 36.6 error / zero side effect / planned tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(...)` | wrong family或material digest mismatch |
| `RelationMismatch(Scope/Target/StateSnapshot)` | trigger guard scope、forbidden target scope、nested local descriptor或target/effect payload自相矛盾 |
| `NoWriteBoundaryViolation` | unsafe rule material、caller试图把source/external包装成Local、maintenance/replay target越界 |
| `ReplayBoundaryViolation` | Replay nested target/effect不是R06.2 allowlisted replay pair |
| `ReferenceBoundaryViolation` | Local target携带external/source owner或untagged body-free ref |

Blocked不走error。所有error/Blocked evaluation都不调用attempted adapter；error不创建decision，Blocked只创建process-local decision。policy无repository、clock、config、actor、record/outbox dependency。planned tests覆盖四trigger x four effect-kind total matrix、11 safe local pairs、all forbidden target kinds/scopes、empty/subset rule sets、unsafe material factory拒绝、nested maintenance/replay mismatch、Allowed cross-target/basis reuse、Forbidden violation handoff、local Blocked no fake ref、Query zero writer spies、zero mutation和body/locator/credential/provider/SQL扫描。对象停审：`pass_R06.5-D_P10_design_only`。

## 37. P11 `ReadVisibilityPolicy`

### 37.1 capability / no-write contract

P11对一个one-shot `DiagnosticRequestContext`和一个已加载的committed observation/read projection形成request-scoped visibility decision。它消费P10 same-target Allowed/Blocked result，只能保持或收窄persisted `VisibilitySurface`，不能把NotVisible/Blocked/Degraded/Stale/Unknown升级为Visible，也不定义Identity授权truth。同步Query中的P11 evaluation和response assembly全程零写。

### 37.2 exact policy schema / signatures

```rust
/// Immutable request-scoped read-visibility policy over one resolved snapshot.
pub struct ReadVisibilityPolicy {
    basis: PolicyEvaluationBasis,
    purpose_scope_rules: ReadPurposeScopeRuleSet,
    freshness_rules: ReadFreshnessRuleSet,
    degraded_action: ReadDegradedAction,
}

impl ReadVisibilityPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        purpose_scope_rules: ReadPurposeScopeRuleSet,
        freshness_rules: ReadFreshnessRuleSet,
        degraded_action: ReadDegradedAction,
    ) -> Result<Self, DomainError>;

    pub fn evaluate(
        &self,
        input: ReadVisibilityInputSnapshot,
    ) -> Result<ReadVisibilityDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

factory要求family=`ReadVisibility`，purpose/scope恰好四个canonical pair；freshness四kind total。Rebuilding/Unknown不能Preserve，degraded action不能Visible/Preserve，unsafe material返回`GapInvariantViolation`或`NoWriteBoundaryViolation`且不构造policy。policy不持有consumer、actor role、repository、clock、resolver、constraint body或P10 policy。

### 37.3 canonical `ReadVisibilityDecision` extension

R06.4 `domain::read`的canonical declaration同步为六个字段：`policy_basis: PolicyEvaluationBasis`、`input_snapshot: ReadVisibilityInputSnapshot`、`kind: ReadVisibilityKind`、`constraint_ref`、`gap_ref`与`block_reason`。exact Rust declaration只在R06.4 owner文件出现，本节不建立第二definition。

`pub(crate)` constructor只由P11调用。decision identity、request context、scope和target从完整input读取，不再重复flatten为可漂移字段。optional matrix固定为：Visible无payload；Restricted只constraint；NotVisible要求gap；Blocked要求reason、gap可选且只能引用input中真实存在的open gap。`applies_to(input)`比较P11 basis以外的完整one-shot snapshot；另一个actor/request/target/projection head/freshness/gap/provenance/P10 decision不能复用旧result。

### 37.4 deterministic visibility matrix

evaluation先验证request context自身、projection scope、visibility scope kind、target scope和P10 binding；正常outcome优先级：

| priority | condition | exact output |
|---:|---|---|
| 1 | purpose/scope pair与四个canonical mapping不一致 | input relation error；不把部署material缺项伪装成NotVisible |
| 2 | P10 valid outcome Blocked | `Blocked(source_visibility.source_gap_ref() or None, NoWriteGuard)`；只保留source surface已绑定的真实gap，不能从其他diagnostic gap选择；Query仍零写 |
| 3 | source snapshot Blocked | `Blocked(source gap or None, exact source block reason)`；不从public kind猜reason，不扩大body |
| 4 | persisted surface NotVisible | `NotVisible(existing gap)`；not-visible != missing |
| 5 | source snapshot blocked Degraded | `Blocked(source gap or None, exact source block reason)`；不从`DegradedReason::GuardBlocked`猜no-write/retention |
| 6 | source snapshot limited Degraded | Restrict且constraint存在 -> Restricted；NotVisible且open gap存在 -> NotVisible；Block -> `Blocked(optional existing gap, VisibilityConstraint)`；缺所需constraint/gap时fail-closed为`Blocked(optional existing gap, InconsistentSnapshot)` |
| 7 | freshness Rebuilding/Unknown | constraint存在 -> Restricted；否则`Blocked(source_visibility.source_gap_ref() or None, InconsistentSnapshot)`；不创建或借用unrelated gap |
| 8 | freshness Stale | Preserve保持source结果；Restrict在constraint存在时Restricted，否则fail-closed `Blocked(source_visibility.source_gap_ref() or None, InconsistentSnapshot)`；绝不upgrade |
| 9 | persisted Restricted | `Restricted`且保留exact constraint；缺constraint是input defect |
| 10 | persisted Visible + Fresh + allowed pair + P10 Allowed | `Visible` |

current `VisibilitySurface`至多绑定一个gap，因此P11直接保留`source_visibility.source_gap_ref()`，不再对完整diagnostic gap set做第二次priority选择。仅存在于`target.gaps`、未被source surface绑定的gap不参与output selection；完整input set仍保留在snapshot中用于一致性与诊断审计。P11不关闭/acknowledge/mitigate gap，也不把empty gap set解释为全局完整。

### 37.5 synchronous Query consumption

Query service流程固定为：load committed view/marker -> build one-shot context/input -> P10 -> P11 -> response assembler。assembler借用`ReadVisibilityDecision`并按kind组装`ObservationQuerySurface`；不调用`ReadVisibilityState::from_decision/apply_decision`，不保存decision/context/state，不刷新reference，不mark stale，不rebuild，不创建H7 `ReadAccessRecord`，不写outbox/idempotency/stored result。

R06.4 `ReadVisibilityState`保留其domain shape，仅供未来显式`ObservationRecordOrigin::AsynchronousReadAudit` envelope；current同步Query无producer。其factory/member必须消费complete P11 decision且不能反向成为Query writer。frozen Step09 `assert_can_read`和Step10“new evaluated state”旧语句登记affected，后续逐flow review改为上述process-local path。

### 37.6 error / zero side effect / planned tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(...)` | wrong family或material digest mismatch |
| `MissingRequiredReference` | persisted NotVisible引用的gap、persisted Restricted引用的constraint或surface所指gap对象未加载；normal guard-only Blocked不要求gap |
| `RelationMismatch(Scope/Target/StateSnapshot/DecisionBinding)` | context/scope/target/projection/P10 complete snapshot不匹配 |
| `GapInvariantViolation` | persisted surface/freshness/gap/constraint矩阵本身无效 |
| `NoWriteBoundaryViolation` | P10被省略、跨target复用或caller试图在Query中写read state/record |
| `ReferenceConflict` | committed projection identity/head与snapshot不一致 |

Visible/Restricted/NotVisible/Blocked均不是error。所有error和normal outcome都保持repository对象逐字段不变；decision只在process内存在，不生成transition/H7/outbox，不调用write/refresh/rebuild port。planned tests覆盖4x4 purpose/scope、all persisted visibility/freshness组合、P10 allow/block/cross-target、constraint/gap required matrix、source-provenance gap保留与unrelated diagnostic gap拒绝、NotVisible != Missing、Stale preserve仍不upgrade、Rebuilding/Unknown no Visible、one-shot cross-request/actor/basis replay、repository writer/refresh/rebuild/record/outbox spies均0、response body matrix和body/credential/role/provider扫描。对象停审：`pass_R06.5-D_P11_design_only`。

## 38. P12 `GapClassificationPolicy`

### 38.1 capability / truth boundary

P12把一个已验证的`GapSourceRef`、一个exact affected observation object和typed source/reference/visibility/safety signals分类为`NoGap`或四个canonical `GapKind`之一。它不发现dependency、不调用resolver、不解析错误消息、不创建gap identity、不判断handoff readiness，也不把no-write/retention block冒充第五种gap。分类只表达本仓观察面缺口，不声称source material已删除、外部reference生命周期异常或业务truth错误。

### 38.2 exact policy / decision schema

```rust
/// Immutable gap-classification policy over one resolved total rule table.
pub struct GapClassificationPolicy {
    basis: PolicyEvaluationBasis,
    rules: GapClassificationRuleSet,
}

/// Complete target-bound P12 result for one finite classification basis.
pub struct GapClassificationDecision {
    policy_basis: PolicyEvaluationBasis,
    basis: GapClassificationBasis,
    outcome: GapClassificationOutcome,
}

impl GapClassificationPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        rules: GapClassificationRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn classify(
        &self,
        basis: GapClassificationBasis,
    ) -> Result<GapClassificationDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

decision constructor为`pub(crate)`且只允许P12调用。`applies_to(source, affected, reference_signal, visibility_signal, safety_signal)`重新构造`GapSourceAffectedBinding`和完整basis；cross-source/affected/state/basis复用拒绝。decision不保存gap ref、opened time、actor、default kind、provider message、body、locator或authorization。

### 38.3 total rule universe 与 safe priority

canonical key universe按以下finite product生成：

- 六个`GapSourceKind`。
- 四个`GapSourceState`。
- ReferenceSnapshot source使用六个非NotApplicable reference signals；其他五种source只使用NotApplicable，因此共`6 + 5 = 11`个合法source-kind/reference组合。
- 九个visibility variant shapes：NotEvaluated、Visible、Restricted、NotVisible及Blocked的五个typed reason。
- 两个safety signals。

因此material必须恰好包含`4 x 11 x 9 x 2 = 792`个unique key。第一层结构门禁固定：88个`visibility=Blocked(InconsistentSnapshot)` key全部必须是`RejectInconsistentSnapshot`，包括`safety=UnsafeOutput`的44行；这88行不进入GapKind优先级。其余704个结构一致key必须是`Outcome(...)`。factory按key canonical token排序，拒绝missing/extra/duplicate/conflicting row，并对704个Outcome行执行下列安全映射：

| explicit evidence | only allowed result constraints |
|---|---|
| `UnsafeOutput` safety | 在704个结构一致行中必须`Classified(UnsafeOutput)`，outcome优先级最高 |
| source state `NotVisible`，或visibility `NotVisible` / `Blocked(VisibilityConstraint)` | safety BodyFree时必须`Classified(NotVisibleMaterial)` |
| source Unresolved，或reference Stale/Unresolved/Unavailable | 在更高优先级未命中时必须`Classified(UnresolvedReference)`；canonical `GapKind`没有Stale，不能把stale snapshot表示为fresh/NoGap |
| source Unknown，或reference Pending/Invalid | 在更高优先级未命中时必须`Classified(MissingMaterial)`；Invalid不升级为external invalidity verdict；schema中没有额外“missing dependency”隐式分支 |
| visibility Blocked(SafetyBoundary) | 必须`Classified(UnsafeOutput)` |
| visibility Blocked(NoWriteGuard/RetentionBoundary) | 自身不证明gap；无其他evidence时必须`NoGap`，有其他evidence按上述优先级 |
| source Known + reference Resolved/NotApplicable + visibility Visible/Restricted/NotEvaluated或Blocked(NoWriteGuard/RetentionBoundary) + BodyFree | 无其他higher-priority evidence时必须`NoGap` |

固定求值顺序为`RejectInconsistentSnapshot structural gate -> Unsafe > NotVisible > Unresolved > Missing > NoGap`。后五项priority只用于factory验证704个显式Outcome行，runtime仍按exact key lookup，不用if/else fallback替代material。`default_gap_kind`没有实现位置；unknown/absence不能命中任何row。

### 38.4 owning `GapState` factory

```rust
impl GapState {
    pub fn open_from_decision(
        gap_ref: GapStateRef,
        decision: &GapClassificationDecision,
        opened_at: ObservedAt,
    ) -> Result<Self, DomainError>;
}
```

只有`Classified(kind)`可建立Open gap，并从decision complete basis复制`source_ref`、`affected_object_ref`和kind；`NoGap`返回`GapInvariantViolation`且不消费/保存gap identity。修复前public `open(gap_ref, source_ref, gap_kind, affected, opened_at)`降为`domain::gap` private helper，只由`open_from_decision`调用。Command/Consumer/Job不能提交bare `GapKind`绕过P12；已有persisted gap rehydrate仍按R06.4 object invariant验证，不重新执行current policy改变历史kind。

同source+affected已有Open/Acknowledged gap时，application先versioned lookup；exact same kind是duplicate/no new object，changed kind需要独立accepted transition/replacement规则，不能调用open覆盖。该后续flow/record形态由F/G和Step09 affected review闭口；P12本身只形成decision，不读existing gap或生成H8 record。

### 38.5 error / zero side effect / planned tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(...)` | wrong family、digest mismatch、table缺/多/重复key |
| `MissingRequiredReference` | dependency lookup未建立`GapSourceAffectedBinding`，或ReferenceSnapshot source缺typed reference signal |
| `RelationMismatch(Subject/Target/StateSnapshot/DecisionBinding)` | source/affected relation、source state或decision complete basis不匹配 |
| `GapInvariantViolation` | source-kind/reference compatibility错误、NoGap被用于open、optional state matrix无效 |
| `ReferenceConflict` | `RejectInconsistentSnapshot` exact row，或loaded reference/source snapshots互相冲突 |
| `ReferenceBoundaryViolation` | source/affected crossing external/source owner boundary或untyped ref |

NoGap和四类Classified均是normal outcome。P12 error不创建decision；normal decision也不写repository。`open_from_decision` error不创建GapState/transition/H8/outbox，不消费durable identity。planned tests覆盖792 key exact cardinality、88 reject rows、canonical order/duplicate/missing/extra、fixed priority pairwise combinations、NotVisible != Missing、NoWrite/Retention block alone -> NoGap、Invalid不变external verdict、source-kind/reference compatibility、dependency binding cross-target、NoGap open拒绝、decision cross-basis/source replay、existing gap duplicate handoff、zero mutation和error-message/body/locator/provider/default scanning。对象停审：`pass_R06.5-D_P12_design_only`。

## 39. R06.5-D 类型账与唯一 owner

### 39.1 77个new explicit type与affected type账

| group | new explicit types | count | canonical owner |
|---|---|---:|---|
| P7 handoff readiness | `CommittedEvidenceIndexInputSnapshot`;四个readiness action enum；`HandoffReadinessRuleSet`;`HandoffRetentionSnapshot`;`HandoffReadinessInputSnapshot`;`HandoffReadinessPolicy` | 9 | snapshot/input归`domain::handoff` / planned `report_handoff.rs`；rule/policy归`domain::policies` / planned `policies.rs` |
| P8 retention/protection | marker/protection complete snapshots；consumer/current/tagged-state/disposition/rule family；marker presence/outcome/rule family；`RetentionProtectionPolicy` | 15 | snapshot/decision input归`domain::retention` / planned `retention_replay.rs`；rule/policy归`domain::policies` |
| P9 replay boundary | per-target boundary/set；retention/protection opaque lookup snapshots；scope snapshot/outcome；target/effect、retention、protection三组rule family；`ReplayBoundaryPolicy` | 17 | snapshot/outcome归`domain::replay` / planned `retention_replay.rs`；rule/policy归`domain::policies` |
| P10 no-write | evaluation/local/read target；local effect/kind/outcome；trigger/local rule family；`NoWriteGuardDecision`;`NoWriteGuardPolicy` | 13 | target/effect/decision归`domain::no_write` / planned `no_write.rs`；rule/policy归`domain::policies` |
| P11 read visibility | purpose/scope与freshness rule family；degraded action；source/target/input snapshot；`ReadVisibilityPolicy` | 11 | source/target/input snapshot归`domain::read` / planned `read_diagnostic.rs`；rule/policy归`domain::policies` |
| P12 gap classification | safety/reference/visibility signal；basis/binding；rule key/row/set/result/outcome；policy与decision | 12 | basis/binding/outcome/decision归`domain::gap` / planned `gap_degraded.rs`；rule/policy归`domain::policies` |
| total | §32的67个shared/material/snapshot type + §§33~38的10个policy/input/decision type | 77 | zero duplicate new type owner |

D批另有五个existing canonical decision受到authoritative extension，但不计入77个new type：`HandoffReadinessDecision`、`ActiveProtectionReleaseDecision`、`RetentionMarkerDecision`、`ReplayApprovalSnapshot`、`ReadVisibilityDecision`。它们仍分别归R06.4 `domain::{handoff,retention,replay,read}`，exact declaration只见R06.4 owner文件。既有`ActiveProtectionReleaseOutcome`增加`Protected`是一个domain enum extension；contracts-owned `HandoffBlockReason`、`VisibilitySurface`、`DegradedReason/DegradedSurface`形成三个affected contracts groups。由此D批总影响面是`77 new + 5 existing decision extensions + 1 existing domain enum extension + 3 existing contracts groups extended`，没有第二声明。

### 39.2 definition / constructor / source registry

| carrier group | unique definition / constructor | trusted source | forbidden producer |
|---|---|---|---|
| finite rule/action/table | `domain::policies`;typed constructor + canonical order + material-v1 digest check | validated registry snapshot | raw config map、entry default、string parser fallback、policy binding locator |
| complete object snapshot | corresponding owning domain module；application-visible `pub fn from_loaded_* / try_*` exact-copy factory，private fields、no serde/default | repository-loaded object or same-UoW accepted post-state | protocol caller fields、ref/state-only mapper、raw/public serde constructor |
| committed handoff input proof | `domain::handoff::CommittedEvidenceIndexInputSnapshot` | repository-proven committed input or same-UoW append with assigned cursor | preview、`committed: bool`、entry assertion |
| P8 current consumer snapshot | `domain::retention` tagged current structured object/dependency lookup | exact consumer repository/dependency index lookup | state/ref-only release assertion、missing-as-inactive default |
| P9 per-target boundary set | `domain::replay` canonical one-entry-per-scope-target constructor | exact target relation lookup + same-target P10 decision | one global retention/protection value、database row order、scope-wide bool |
| P10 attempted target / decision | `domain::no_write`;decision constructor only P10 | trusted trigger context + typed local/forbidden target | `ForbiddenWriteTargetRef`伪装local target、adapter result、public pass bool |
| P11 one-shot input / decision | `domain::read`;decision constructor only P11 | loaded committed projection + trusted request context + P10 | persisted Query request row、caller visibility assertion、actor role default |
| P12 basis / decision | `domain::gap`;binding constructor after typed dependency proof；decision only P12 | loaded source/affected relation and finite signals | error-message classifier、default gap kind、caller bare `GapKind` |

所有decision constructor均为`pub(crate)`且只允许对应policy调用；policy object不能传给aggregate代替decision。application必须使用§31.4.1所列public Rust snapshot/binding factory，不能直接写private fields；这些factory不是contracts/protocol API。rule set/table可公开作为domain typed value构造，但没有public raw decode/default，并必须在policy factory中重新编码并匹配`PolicyEvaluationBasis.basis_digest`。snapshot/decision均不可作为repository truth、public DTO或跨UoW authorization token。

### 39.3 reused owner 与 dependency方向

| reused carrier | owner | D批usage | dependency rule |
|---|---|---|---|
| `PolicyEvaluationBasis` | R06.5-B `domain::policies` | 六policy与全部decision保存完整basis | 不引入infra `PolicyBindingRef` |
| `HandoffBlockReason` | R06.2 `contracts::metadata` | P7 Blocked output增加`InputNotFresh`与`RetentionBoundary`，分别承接freshness hard block和retention/protection hard block | contracts不依赖domain；两者均不冒充`EvidenceGap`，variant不声明cleanup truth |
| `ReadBlockReason` | R06.4 `contracts::metadata` | P11/P12区分visibility/safety/no-write/retention/inconsistent | 不用message/string或NotFound替代 |
| handoff/authenticity snapshots | R06.5-C `domain::handoff` | P7复用complete handoff/hint/gap snapshot | 不从P6 decision反推current object |
| marker/protection/consumer refs与states | R06.2/R06.4 contracts/domain | P7~P9 complete relation binding | 不复制state enum或typed ref |
| `VisibilitySurface`;freshness/gap sets | R06.2/R06.3 contracts | P7/P11/P12 finite input/output | public surface不是authorization或domain truth |
| `ReplayTargetRefSet`;maintenance effect | R06.2 contracts | P9 per-target cardinality/effect matrix | target set不得扩大；effect不递归授权 |
| `DomainError` | R06.5-B `domain::errors` | only invariant/binding/material defects | D批没有新增error variant；expected negative保持decision outcome |

logical domain modules可以相互借用body-free value，但public contracts继续零domain依赖。planned物理布局沿用Step04已有`report_handoff.rs`、`retention_replay.rs`、`no_write.rs`、`read_diagnostic.rs`、`gap_degraded.rs`和`policies.rs`；D批不新增crate、不建立六个policy repository，也不按policy创建`*PolicyId`。

## 40. R06.5-D complete snapshot、cardinality 与material门禁

### 40.1 complete snapshot stale-decision matrix

| decision | complete observed material | same-state change that invalidates reuse |
|---|---|---|
| P7 `HandoffReadinessDecision` | handoff + committed input/cursor + current catalog consumer + attached hint + exact input gaps + marker/protection/current protected-consumer set + P10 | consumer state/kind/scope/purpose、hint reason/gaps、gap lifecycle、marker/protection set、input cursor/freshness/visibility、P10 basis/outcome变化 |
| P8 `ActiveProtectionReleaseDecision` | complete protection + exact observed consumer set + full current consumer/dependency snapshots | consumer kind/scope/owner/state、dependency head、set membership/order、release/conflict reason变化 |
| P8 `RetentionMarkerDecision` | complete marker pre-state + accepted reconciled protection post-state | marker relation/reason/archive hint或protection post-state/set变化；旧pre-state不能复用 |
| P9 `ReplayApprovalSnapshot` | complete scope + exact one-entry-per-target retention/protection/P10 set | any target/effect/relation/set/P10 trigger/scope/target/outcome/order变化 |
| P10 `NoWriteGuardDecision` | complete trigger context + tagged attempted target/effect | local descriptor、replay scope/target/effect、forbidden scope或policy basis变化 |
| P11 `ReadVisibilityDecision` | one-shot request/actor + exact target/projection/freshness/source provenance/complete gaps/scope + P10 | request identity、actor、projection head、gap revision、constraint/block provenance、freshness、surface或P10变化 |
| P12 `GapClassificationDecision` | source/affected binding + source/reference/visibility/safety finite basis | source state、affected relation或任一signal变化 |

这些门禁只防止loaded object之间的cross-use和stale-use，不替代Step11 repository version/CAS。application在member消费前仍必须持有expected repository version；CAS失败时aggregate mutation、record append与outbox handoff全部回滚。

### 40.2 finite cardinality / no-default审计

| policy | required finite material | constructor gate |
|---|---|---|
| P7 | 2个nontrusted hint action、4个gap kind rule、1 restricted action、1 non-fresh action | gap rules exactly four；Unassessed fixed Pending；Placeholder/Insufficient无Ready动作 |
| P8 | 21个tagged consumer-state rule + 48个marker/protection/presence key | no wildcard/default；conflicting duplicate/missing/extra拒绝；invalid tuple显式Conflict |
| P9 | 6个target/effect pair + 5 retention signal rows + 6 protection signal rows；六类target均为marker Optional但两类relation lookup Required | ActiveHold/Conflict/Protected/Conflicted与source/external write不能配置Allow；missing/error/partial lookup不得构造NotPresent |
| P10 | exactly 4 trigger/effect family pair + at most 11 explicit safe local pair | missing safe pair为expected Block；unsafe/cross-family/source/external allow在factory拒绝 |
| P11 | exactly 4 purpose/scope pair + exactly 4 freshness row + one degraded action | Rebuilding/Unknown不能Preserve；degraded不能Visible/Preserve |
| P12 | exactly 792 unique keys，其中88个InconsistentSnapshot key显式Reject | structural reject先于gap priority；no wildcard/default/first-match；其余704项显式Outcome；priority只验证table，不替代runtime exact lookup |

material-v1编码继续使用§19.4统一framing；set/table先按各卡canonical key排序，再由private helper验证family/schema/field digest。empty只在P10 local safe-pair subset中表示显式deny-all；其他要求total的table缺项全部是factory error。没有`default_gap_kind`、`allow_read_only(bool)`、`is_approvable(bool)`或first enum variant fallback。

## 41. R06.5-D outcome、error 与副作用总审计

### 41.1 expected outcome total matrix

| policy | positive / normal outcome | expected limiting / negative outcome | forbidden error replacement |
|---|---|---|---|
| P7 HandoffReadiness | Ready | PendingEvidence / Degraded / Blocked(finite reason) | `HandoffNotReady`;generic policy rejection |
| P8 RetentionProtection | marker ActiveHold/ReleaseEligible；protection Protected/Releasable | marker Conflict；protection Expired/Conflicted | `PolicyRejected`;把active consumer当missing/error |
| P9 ReplayBoundary | Approved | Blocked(exact first target + reason) | `ReplayBoundaryViolation`代替normal hold/protection/no-write block |
| P10 NoWriteGuard | AllowedObservationEffect(exact effect) | Blocked | `NoWriteBoundaryViolation`代替合法fail-closed pair |
| P11 ReadVisibility | Visible | Restricted / NotVisible / Blocked | `ReadNotAllowed`;NotVisible伪装Missing |
| P12 GapClassification | NoGap / Classified(exact `GapKind`) | same normal outcome family；无generic rejection | invalid snapshot以default gap吸收 |

P7 `Ready`、P9 `Approved`、P10 `Allowed`和P11 `Visible`均不是业务授权、外部成功、真实性判定、验收签署或execution truth。P8 `ReleaseEligible/Releasable`只允许推进本地relation state，不执行cleanup、archive或delete。P12 `Classified`只打开observation gap，不断言外部对象错误或已损坏。

### 41.2 `DomainError` coverage

| error family | P7 | P8 | P9 | P10 | P11 | P12 |
|---|---:|---:|---:|---:|---:|---:|
| PolicyBasisMismatch | yes | yes | yes | yes | yes | yes |
| RelationMismatch | handoff/input/consumer/scope/state/decision | consumer/target/state/decision | scope/target/state/P10 | scope/target/state | request/scope/target/state/P10 | source/target/state/decision |
| InvalidStateTransition | terminal/non-retry handoff | Released/unsafe release order | non-Defined scope | no normal state move | invalid persisted state only | NoGap cannot open |
| MissingRequiredReference | committed input or bound object absent | current consumer/protection absent | target relation/P10 absent | none for valid Block | required gap/constraint/input absent | dependency binding/reference signal absent |
| exact boundary conflict | handoff/retention/no-write | retention/reference | replay/retention/no-write | no-write/replay/reference | gap/no-write/reference | gap/reference |

D批不需要新增`DomainError` variant。`ReplayBoundaryViolation`只用于unsafe policy material或structural replay boundary defect；`NoWriteBoundaryViolation`只用于unsafe material/self-contradictory target或绕过decision；`GapInvariantViolation`只用于非法basis/output/open matrix。normal Blocked、Pending、Degraded、Expired、Conflicted、NotVisible、NoGap均不走error。

### 41.3 zero-side-effect gate

六个policy及其rule/snapshot/decision constructors均不得访问repository、UoW、clock、id generator、resolver、adapter、config、outbox、record store、cleanup/archive port或source/external write port。所有load、current consumer lookup和committed proof在application进入policy前完成。任何`Err`：

1. 所有loaded object和mutable receiver逐字段不变。
2. 不创建decision、transition、gap、violation、record、outbox、job plan、coordination或effect token。
3. 不消费gap/record/outbox/operation identity，不更新时间或cursor。
4. 不调用delivery、replay、maintenance、cleanup、archive、refresh、rebuild或source/external adapter。
5. application保持UoW未提交或完整回滚。

normal negative decision本身也零副作用；只有exact owning member成功消费后才产生domain transition。P10 Forbidden Blocked后的`NoWriteViolation`是application显式的后续accepted flow，不是policy隐式副作用；local Blocked和同步Query一律没有violation writer。

## 42. P11 synchronous Query zero-write closure

### 42.1 current flow与禁止依赖

```text
load committed public/read projection and markers
  -> construct DiagnosticRequestContext + ReadVisibilityInputSnapshot
  -> P10 NoWriteGuardPolicy::evaluate
  -> bind P10 decision into P11 input
  -> P11 ReadVisibilityPolicy::evaluate
  -> response assembler borrows ReadVisibilityDecision
  -> return body-free public surface
```

P11和Query service的current constructor不得注入repository writer、UoW、idempotency store、outbox store、record store、reference refresh port、projection rebuild port、maintenance service或external adapter。Query可以调用read repository和trusted safe mapper；读取不允许通过“audit convenience”在同一handler尾部追加write。

### 42.2 zero-write matrix

| candidate write | current ruling | future activation gate |
|---|---|---|
| `ReadVisibilityState::from_decision/apply_decision` | phase-reserved private；current无producer | explicit async read-audit operation + UoW + persistence + flow review |
| `ReadVisibilityTransition` | current同步Query不生成 | same future async owning member accepted mutation |
| H7 `ReadAccessRecord` | F批只可定义schema/disabled condition；current无writer | `ObservationRecordOrigin::AsynchronousReadAudit` envelope + same-UoW transition/post-state/metadata |
| `DiagnosticRequestContext` persistence | forbidden；one-shot process-local | 必须另行设计durable audit subject，不可隐式开启 |
| idempotency / stored result | Query current不写 | 仅future明确durable query contract可重开R06.6 |
| outbox/event | forbidden | 需要独立event主语、transaction和protocol，不由P11推导 |
| reference refresh / projection rebuild / gap mutation | forbidden | 只能由对应Command/Job及P15/P17等owning flow执行 |
| no-write violation | Query即使P10 Blocked也不写 | mutating Command/Consumer/Job尝试Forbidden target才可显式建立 |

response assembler必须按P11 decision的four-kind optional matrix组装：Visible有body且无限制payload；Restricted只输出允许的body-free subset/constraint；NotVisible和Blocked无normal body并保留exact gap/reason。assembler不得把NotVisible映射404、把Blocked映射authorization truth、把empty gap set解释为全局完整，或为了“审计读取”触发任何write。

### 42.3 zero-write planned verification

planned test redline包括：14个Query逐operation使用writer-spy断言repository save、UoW commit、record append、outbox append、idempotency reserve、refresh/rebuild和external adapter调用均为0；P10 Allowed/Blocked与P11四outcome均覆盖；cross-request/actor/target/basis decision不能复用。这里仅定义测试切口，不表示测试已经实现或运行。

## 43. R06.5-D affected-only传播清单

| affected location | previous conflict | D批authoritative ruling | current action |
|---|---|---|---|
| R06.4 handoff | readiness曾可由flattened input/reason驱动 | P7 complete committed input + hint/gap/retention/P10 binding；three owning members借用decision | done；R06.4 §10.1/§21同步 |
| R06.4 retention | release decision曾可state/set-only；marker可能消费pre-state | P8 full consumer snapshots；protection先apply，marker只消费post-state | done；R06.4 §§8.4~8.5/§21同步 |
| R06.4 replay | one global retention/protection state表示整个scope；approve/block可绕policy | per-target complete set；唯一public `apply_boundary_decision` | done；R06.4 §§8.6/9.6/§21同步 |
| R06.4 read | flat decision和`ReadVisibilityState`可被误解为Query writer | complete P11 input；Query只借用decision，state phase-reserved | done；R06.4 §§9.6.1/9.8/§21同步 |
| R06.4 gap | public bare `open(..., GapKind, ...)`绕P12 | `open_from_decision`唯一public factory | done；R06.4 §9.12/§21同步 |
| R06.2 contracts | handoff non-fresh与retention block缺独立finite reason，degraded source mapping不全 | `HandoffBlockReason::{InputNotFresh,RetentionBoundary}`与`DegradedReason/Surface` lossless增量 | done；contracts affected addendum/checkpoint同步 |
| frozen Step07 | repository/port缺部分committed proof、consumer snapshot和per-target load shape | exact source见§§32~38 | affected-only；R06.8后逐trait review |
| frozen Step08 | request DTO可能提交bare state/reason/origin/visibility | decision input全部由application trusted load组装 | affected-only；逐协议重组时删除caller assertion |
| frozen Step09 | 旧flow直接调用approve/block/open/assert_can_read | 使用P7~P12 evaluate -> exact owning member / assembler sequence | affected-only；Step09逐flow修复 |
| frozen Step10 | trigger表含new read state或bare gap/replay transition | current callable source见R06.4 §21 | affected-only；Step10 review |
| frozen Step11/12 | same-UoW/CAS和error mapping仍是旧decision shape | complete snapshots不替代CAS；expected negative不映射error | affected-only；对应Step解冻后审计 |
| R06.5 F/G | H4~H8/H13将消费accepted transition、post-state和policy basis | D批只固定输入边界 | 不提前定义record、writer或persistence schema |

上述传播不改变正式`02`的policy主语、truth owner或全局依赖裁剪，因此没有external upstream blocker。Step04 physical file与logical owner目前兼容；`material_v1`私有helper和history/records命名仍留R06.8统一，不在D批修改Step04。

## 44. R06.5-D 自检、blocker 与停止点

### 44.1 object stop-review summary

| object | schema / fields | factory / complete signature | target-bound output | error / zero side effect | planned tests | result |
|---|---|---|---|---|---|---|
| P7 HandoffReadiness | pass | pass | reused complete `HandoffReadinessDecision` | pass | complete redlines | pass_design_only |
| P8 RetentionProtection | pass | pass_two_stage | two reused complete decisions | pass | complete redlines | pass_design_only |
| P9 ReplayBoundary | pass | pass_per_target | reused complete `ReplayApprovalSnapshot` | pass | complete redlines | pass_design_only |
| P10 NoWriteGuard | pass | pass | new `NoWriteGuardDecision` | pass | complete redlines | pass_design_only |
| P11 ReadVisibility | pass | pass | reused complete `ReadVisibilityDecision` | pass_query_zero_write | complete redlines | pass_design_only |
| P12 GapClassification | pass | pass_792_key | new `GapClassificationDecision` | pass | complete redlines | pass_design_only |

`complete redlines`只表示测试设计覆盖已写全，不表示实现、执行或通过测试。

### 44.2 D批全文门禁

| gate | conclusion | evidence / remaining limit |
|---|---|---|
| P7~P12是否逐policy独立成卡 | pass | §§33~38 |
| new explicit type是否逐组有唯一owner | pass | 77 new types；§39.1~§39.3 |
| reused decision是否只有canonical declaration | pass | five declarations only in R06.4；本文件只登记extension |
| policy basis/material是否complete且无default | pass | §31.5、§40.2；21/48/6+5+6/4+11/4+4/792 cardinality |
| decision是否complete target/snapshot bound | pass | §§33~40.1 |
| expected negative是否typed而非error | pass | §41.1~§41.2 |
| P8 mandatory two-stage order | pass | §34；protection accepted post-state先于marker decision |
| P9是否逐target而非global representative | pass | §§32.3/35/40.1 |
| P10 local target是否与Forbidden target分离 | pass | §§32.4/36；local Blocked不伪造external ref |
| synchronous Query是否zero-write | pass_design | §§37/42；无current state/H7/outbox/idempotency producer |
| P12是否无default gap kind | pass | 792 exact rows；88 explicit reject；fixed safe priority |
| no business/source/external truth write | pass | readiness/retention/replay/read/gap均只承载observation boundary |
| implementation/test/evidence/signoff fabrication | none | 未写实现代码、未运行测试、未生成commit/run id/evidence alias/verdict/signoff |
| external upstream blocker | none | formal00/01/02足以支撑D批 |
| internal blocker | `03-RPR-S06-GRANULARITY=open` | historical D checkpoint；current见§56.2 |
| historical R06.5-D gate | `R06.5-D_done_waiting_user` | 已由用户确认解除并被E批消费 |
| historical next action | `wait_user_confirmation_before_R06.5-E` | 已消费，不再是current action |

### 44.3 用户确认后 R06.5-E 阅读清单（historical，已消费）

只有本专项、R06.2/R06.4 affected checkpoint、Step06主控、flow与project ledger全部同步为`R06.5-D_done_waiting_user`，且用户再次明确确认后，才读取：

1. 本文件P13~P18 inventory/output owner、B批shared foundation与D批P10/replay/maintenance承接边界。
2. R06.4 `DegradedOutputState`、`PeripheralDeliveryState`、`ExternalAuditExportPreparation`、`ReferenceSnapshotState`、`ProjectionMaintenanceState`、`ReplayCoordinationState`及existing decisions/authorization。
3. 概要P13~P18 candidate rules，以及冻结Step07/09/10/12 affected uses。
4. L1逐policy卡只作粒度与owner参考，不复制相邻域truth。

确认前不得读取或写入P13~P18 exact policy卡，不得进入H1~H13、R06.6~R06.8、Step07~19、formal `03`、任何`04`或实现代码。当前不需要提交。

## 45. R06.5-E 输入、范围与 authority 裁定

### 45.1 E批执行边界

| 项 | current裁定 |
|---|---|
| 用户门禁 | 用户已明确确认进入`R06.5-E`；§44.3阅读门禁已消费 |
| 唯一范围 | P13 `DegradedOutputPolicy`、P14 `PeripheralExportPolicy`、P15 `ReferenceFreshnessPolicy`、P16 `AdapterBoundaryPolicy`、P17 `DerivedMaintenancePolicy`、P18 `ReplayCoordinationPolicy` |
| policy owner | planned `crates/domain/src/policies.rs`；六个policy均为immutable resolved value object，无repository、`*PolicyId`或runtime locator |
| new result owner | P13 `domain::gap::DegradedOutputDecision`；P15 `domain::reference::ReferenceFreshnessDecision`；P17 `domain::maintenance::DerivedMaintenanceDecision`；P18 `domain::replay::ReplayCoordinationDecision` |
| reused result owner | P14复用并扩展R06.4 `domain::peripheral::{PeripheralDeliveryDecision,ExportPreparationDecision}`；P17 Authorized分支内复用R06.4 `MaintenanceExecutionAuthorization` |
| pure guard | P16只返回`Result<(), DomainError>`，不创建public status、freshness、availability或product truth marker |
| current允许同步 | 本专项；R06.4 degraded/peripheral/reference/maintenance/replay canonical owner；R06.2必要reason owner；主控、flow、ledger |
| current禁止范围 | H1~H13、R06.5-F/G、R06.6~R06.8、Step07~19正文、formal`03`、任何`04`、实现代码 |

### 45.2 已读取输入与使用结论

| input | E批使用结论 |
|---|---|
| Step06 SOP / 书写规范 | 每个policy独立闭口capability、schema、字段来源、factory、完整evaluate签名、target-bound output、error、zero-side-effect与planned tests |
| R06.5 A/B/D | 复用18-family basis/material framing、P10 complete no-write decision、P9 per-target retention/protection snapshot与P11 process-local visibility decision；不传policy对象 |
| R06.4 degraded/peripheral | `DegradedOutputState`是immutable persisted revision；delivery/preparation各有owning lifecycle；adapter结果不等于external audit acceptance |
| R06.4 reference | `ReferenceRefreshResult`只是resolver finite result；`ReferenceSnapshotState`才拥有local resolution/freshness；record不得反向授权mutation |
| R06.4 maintenance/replay | `MaintenanceTargetRef` immutable且四组kind/effect一一对应；双namespace cursor由execution state保存；coordination每identity只绑定一个exact target |
| R06.2 contracts | 复用`AdapterFamily`、structured consumer/target/ref、finite reason与body-free surface；不复制provider/product schema |
| 概要P13~P18 | policy主语和责任保留；`*PolicyId`、policy互传、wall-clock freshness、record-as-input、scope-wide coordination均降级为historical candidate |
| frozen Step07/09/10/12 | 只登记旧repository shape、`assert_*`、裸reason/direct authorization和error mapping affected use；本批不修改冻结文件 |
| L1粒度参考 | 采用逐policy字段/函数/不变量/差异/测试红线粒度，不复制相邻域truth |

### 45.3 historical material replacement

| historical / frozen shape | current replacement | 原因 |
|---|---|---|
| `DegradedOutputPolicy.evaluate(...) -> DegradedOutputState` | complete input -> `DegradedOutputDecision`；显式mutation flow再创建/替换immutable revision | Query evaluation不得隐藏持久化，也不能由public surface直构domain state |
| degraded只绑定`VisibilityScopeRef` | `DegradedOutputTargetBinding`同时保存exact observation object与scope | 同一scope可覆盖多个对象，scope-only decision可跨target复用 |
| P13消费mutable `ReadVisibilityState` | 消费P11 complete `ReadVisibilityDecision` + loaded safety/gap snapshots | current同步Query无`ReadVisibilityState` producer |
| P14 `assert_export_allowed(consumer, view, visibility)` | preparation/delivery两个complete input分别evaluate并产出target-bound decision | ref-only检查丢失consumer state、gap revision、retention与P10 binding |
| P15 `freshness_window` / local clock | typed `ReferenceRefreshResult` + same-stream `SourceVersionComparison` | source version不能用wall clock、lexical或numeric fallback猜测 |
| P15消费`ReferenceRefreshRecord` | record只由accepted transition生成；policy消费loaded snapshot与resolver result | append-only record不能反向授权truth mutation |
| P16 `reject_product_truth(ProductTruthSignal)` | finite adapter family + trusted body-free output provenance structural validation | 不建立free-form product truth信号或产品名enum |
| P17直接返回authorization或抛`PolicyRejected` | `DerivedMaintenanceDecision::{Authorized,Blocked}`；Authorized内携带复用authorization | expected block必须是typed outcome，不能伪造authorization |
| P18消费policy对象/retention marker并批准整个scope | 每次消费Approved scope + exact target current boundary + P10/P17 decision | scope approval不等于当前单target execution许可 |
| P18从`ReplayExecutionRecord`生成impact | H13只记录accepted transition；impact summary后置record/view assembly | record不能反向决定execution或扩大changed target |

上述均是详细设计内部shape收敛，不改变正式`02`的policy主语、模块归属或truth boundary，因此没有external upstream blocker。

### 45.4 E批统一构造与跨crate边界

六个policy沿用§19.3/§19.4：registry解析`PolicyEvaluationBasis`与typed finite material，factory先`require_family`，再对`material-v1` canonical bytes重算digest并constant-time匹配。rule/table constructor拒绝unknown、missing、extra、conflicting duplicate与不安全allow row；无default、wildcard、first-match或free string。

loaded snapshot/input factory必须是domain type上的public Rust API，字段private、no serde/default/builder，只允许application在repository/resolver typed success branch组装。decision/authorization constructor保持`pub(crate)`且只有对应policy可调用。P16 structural guard成功不产生decision。snapshot、decision和policy basis均不是public DTO、repository truth、跨UoW authorization token或config material。

## 46. R06.5-E shared typed material与complete snapshot

### 46.1 P13 degraded-output target、signals与rules

```rust
/// Exact observation-side object and visibility scope evaluated for degradation.
pub struct DegradedOutputTargetBinding {
    affected_object_ref: AffectedObservationObjectRef,
    visibility_scope_ref: VisibilityScopeRef,
}

/// Finite downstream safety signal retained without exposing material.
pub enum DegradedSafetySignal {
    NotApplicable,
    Safe,
    Redacted,
    Pending,
    Rejected,
    Quarantined,
}

/// Finite P11 output consumed by P13 without persisting read state.
pub enum DegradedVisibilitySignal {
    Visible,
    Restricted,
    NotVisible,
    Blocked,
}

/// Expected degraded-output result for one exact input.
pub enum DegradedOutputOutcome {
    Normal,
    Limited {
        reason: DegradedReason,
        gap_ref: Option<GapStateRef>,
    },
    Blocked {
        reason: DegradedReason,
        block_reason: DegradedBlockReason,
        gap_ref: Option<GapStateRef>,
    },
}

/// One finite P13 key over safety, visibility and effective gap class.
pub struct DegradedOutputRuleKey {
    safety: DegradedSafetySignal,
    visibility: DegradedVisibilitySignal,
    gap_kind: Option<GapKind>,
}

pub struct DegradedOutputRule {
    key: DegradedOutputRuleKey,
    outcome: DegradedOutputOutcomeTemplate,
}

/// Material outcome without a caller-selected gap identity.
pub enum DegradedOutputOutcomeTemplate {
    Normal,
    Limited(DegradedReason),
    Blocked {
        reason: DegradedReason,
        block_reason: DegradedBlockReason,
    },
    RejectInconsistentSnapshot,
}

pub struct DegradedOutputRuleSet(Vec<DegradedOutputRule>);

/// Complete process-local P13 input assembled from current loaded material.
pub struct DegradedOutputInputSnapshot {
    target: DegradedOutputTargetBinding,
    safety: DegradedSafetyInputSnapshot,
    visibility: ReadVisibilityDecision,
    visibility_block_reason: Option<ReadBlockReason>,
    gaps: GapPolicySnapshotSet,
}

/// Explicit safety provenance; NotApplicable is validated, never missing/default.
pub enum DegradedSafetyInputSnapshot {
    NotApplicable,
    Disposition(SafetyDispositionPolicySnapshot),
}
```

`DegradedOutputTargetBinding::from_loaded_relation(affected_object_ref, visibility_scope_ref, visibility)`要求P11 decision的exact read target能够无损映射到同一`ObservationObjectRef`，且scope identity/kind相同；ProjectionScope/AuditTimeline这类多对象selector不能生成persisted degraded sidecar，只能直接向response映射process-local surface。`DegradedOutputInputSnapshot::try_new`要求直接由receipt/safety派生的target必须携带same-dependency complete disposition，其他target必须显式`NotApplicable`；该variant来自compile-time target/dependency matrix，不是Option缺失或默认Safe。P11 decision complete input和gap set current revisions一致；`visibility_block_reason`必须逐字段等于P11 Blocked payload，非Blocked必须None；NotVisible gap及Blocked optional gap只能来自P11 decision自身，不能从unrelated diagnostic gap借用。

`DegradedSafetySignal`由explicit input total映射；NotApplicable仅在target compatibility允许时继续评估，Safe/Redacted可继续评估，Pending fail-closed Blocked(InconsistentSnapshot)，Rejected/Quarantined固定Blocked(SafetyBlocked)。P13只从current `Open/Acknowledged` gap中选择effective gap；Resolved/Suppressed保留在complete snapshot用于stale binding但不触发当前degrade。多个effective gap按固定安全优先级`UnsafeOutput > NotVisibleMaterial > UnresolvedReference > MissingMaterial`选择一个surface gap；这不是修改/关闭其他gap，也不生成default gap。

rule set必须覆盖6 safety x 4 visibility families x 5 gap signals（None + 4 kinds）共120个explicit key，其中target/safety或payload结构矛盾必须显式`RejectInconsistentSnapshot`。Normal只允许NotApplicable/Safe/Redacted + Visible + no effective gap；Restricted固定Limited(VisibilityLimited)；NotVisible/Blocked、Pending/Rejected/Quarantined及四gap均不能Normal。template只决定reason/block，不携带gap identity；runtime gap ref必须来自complete input。

### 46.2 P14 peripheral preparation/delivery complete snapshots

```rust
pub struct PeripheralConsumerPolicySnapshot {
    consumer_ref: PeripheralConsumerRef,
}

pub struct PeripheralViewPolicySnapshot {
    view: DashboardAlertExportView,
}

pub struct ExportPreparationPolicySnapshot {
    preparation: ExternalAuditExportPreparation,
}

pub struct PeripheralDeliveryPolicySnapshot {
    delivery: PeripheralDeliveryState,
}

/// Opaque completed lookup for retention/protection on one export view.
pub struct PeripheralRetentionBoundarySnapshot {
    protected_ref: ProtectedObservationRef,
    marker: Option<RetentionMarkerPolicySnapshot>,
    protection: Option<ActiveProtectionPolicySnapshot>,
}

pub struct PeripheralExportInputSnapshot {
    consumer: PeripheralConsumerPolicySnapshot,
    view: PeripheralViewPolicySnapshot,
    gaps: GapPolicySnapshotSet,
    retention: PeripheralRetentionBoundarySnapshot,
    no_write: NoWriteGuardDecision,
}

pub enum ExportEvidenceInputState {
    Pending,
    Committed,
}

pub struct ExportEvidenceInputBoundarySnapshot {
    expected_input_ref: EvidenceIndexInputViewRef,
    state: ExportEvidenceInputState,
    committed_input: Option<CommittedEvidenceIndexInputSnapshot>,
}

pub struct ExportPreparationInputSnapshot {
    preparation: ExportPreparationPolicySnapshot,
    export: PeripheralExportInputSnapshot,
    evidence_input: ExportEvidenceInputBoundarySnapshot,
}

pub struct PeripheralDeliveryInputSnapshot {
    delivery: PeripheralDeliveryPolicySnapshot,
    preparation: ExportPreparationPolicySnapshot,
    export: PeripheralExportInputSnapshot,
    degraded: Option<DegradedOutputDecision>,
}

pub enum PeripheralConsumerPolicyAction {
    Allow,
    AllowLimited,
    Block(ExportBlockReason),
}

pub struct PeripheralConsumerPolicyRule {
    kind: PeripheralConsumerKind,
    state: PeripheralConsumerState,
    export_allowed: ExportAllowedFlag,
    action: PeripheralConsumerPolicyAction,
}

pub struct PeripheralConsumerPolicyRuleSet(Vec<PeripheralConsumerPolicyRule>);

pub enum PeripheralGapAction {
    Degrade,
    Block,
}

pub struct PeripheralGapRule {
    gap_kind: GapKind,
    action: PeripheralGapAction,
}

pub struct PeripheralGapRuleSet(Vec<PeripheralGapRule>);

pub enum PeripheralFreshnessAction {
    Allow,
    Pending,
    Degrade,
    Block,
}

pub struct PeripheralFreshnessRule {
    freshness_kind: ReadProjectionFreshnessKind,
    action: PeripheralFreshnessAction,
}

pub struct PeripheralFreshnessRuleSet(Vec<PeripheralFreshnessRule>);

pub enum PeripheralDeliveryPolicyOutcome {
    Prepare,
    Block(PeripheralBlockReason),
}
```

consumer rule set固定覆盖5 kind x 4 state x 2 export flag共40个key。Retired/Blocked或Denied不能Allow；Limited最多AllowLimited。gap rules必须恰好四个kind：UnsafeOutput/NotVisibleMaterial只能Block，MissingMaterial/UnresolvedReference可Degrade或Block。freshness rules必须覆盖Fresh/Stale/Rebuilding/Unknown：Fresh只能Allow，Rebuilding/Unknown不能Allow，Degrade只有存在exact effective gap时才成立，否则降为Pending。`PeripheralRetentionBoundarySnapshot::from_lookup_result`只能在marker与protection repository完成same-target lookup后调用；None是明确repository `Ok(None)`，未执行lookup、lookup error或partial result不得构造snapshot。marker relation为Some时protection必须Some且exact；ActiveHold、Protected/Conflicted或relation conflict固定block，不能由material放宽。

两个input factory都要求view consumer structured value与current consumer stable identity/kind/scope一致，view freshness/visibility/gap refs与complete loaded revisions一致，P10绑定HandoffOrExport + exact preparation + PrepareBodyFreeHandoff。`ExportEvidenceInputBoundarySnapshot::from_lookup_result(expected_input_ref, Option<CommittedEvidenceIndexInputSnapshot>)`只能在immutable input repository exact lookup完成后调用：None形成Pending，Some必须same ref、purpose=`ExternalAuditPreparation`、consumer=`ObservationConsumerRef::Peripheral(current consumer)`且scope exact；missing/lookup error不可伪造成Pending。preparation input要求该expected ref等于preparation immutable input；Pending固定`PendingEvidence`，Committed再按input visibility/freshness/effective gaps评估Ready/Degraded/Blocked，不复用绑定Report handoff的P7 decision。delivery input要求delivery/preparation/consumer/view四identity exact，且optional P13 decision只能适用于view exact target。P14不接收adapter result、destination、credential、provider status或external audit verdict。

### 46.3 P15/P16 reference and adapter basis

```rust
pub struct ReferenceSnapshotPolicySnapshot {
    snapshot: ReferenceSnapshotState,
}

pub struct ReferenceFreshnessInputSnapshot {
    snapshot: ReferenceSnapshotPolicySnapshot,
    target_ref: MaintenanceTargetRef,
    refresh_result: ReferenceRefreshResult,
    version_relation: ReferenceVersionRelation,
    adapter_family: AdapterFamily,
    no_write: NoWriteGuardDecision,
}

pub enum ReferenceRefreshResultKind {
    Resolved,
    Stale,
    Unresolved,
    Invalid,
    Unavailable,
}

pub enum ReferenceFreshnessAction {
    ApplyResolved,
    ApplyStale,
    ApplyUnresolved,
    ApplyInvalid,
    ApplyUnavailable,
    PreserveCurrent,
    RequireNewSnapshot,
    RejectInconsistentSnapshot,
}

/// Explicit version relation; absence is represented only by NoCurrentVersion.
pub enum ReferenceVersionRelation {
    NoCurrentVersion,
    Older,
    Equal,
    Newer,
    Uncomparable,
    NotApplicable,
}

pub struct ReferenceFreshnessRule {
    current_state: ReferenceSnapshotStateKind,
    result_kind: ReferenceRefreshResultKind,
    version_relation: ReferenceVersionRelation,
    action: ReferenceFreshnessAction,
}

pub struct ReferenceFreshnessRuleSet(Vec<ReferenceFreshnessRule>);

/// Product-neutral provenance of a safe summary produced by a trusted mapper.
pub struct AdapterSafeOutputSnapshot {
    adapter_family: AdapterFamily,
    subject_ref: ReferenceSubjectRef,
    summary_ref: SafeExternalSummaryRef,
    source_version: ObservationSourceVersionRef,
}

pub struct AdapterFamilyRule {
    adapter_family: AdapterFamily,
    permits_reference_summary: bool,
}

pub struct AdapterFamilyRuleSet(Vec<AdapterFamilyRule>);
```

P16只允许四个resolver family产生reference summary：`ObservationSourceResolver`、`RuntimeSandboxResolver`、`GovernanceArtifactEvidenceResolver`、`SubjectObservationResolver`；其余9个family必须显式false。`AdapterSafeOutputSnapshot::from_trusted_mapper`要求subject family、summary owner、source version stream与adapter family compile-time compatibility，且只接收safe ref，不接收raw body、locator、provider name、config key或error message。

P15 input只在application同一调用链已对Resolved output执行P16后接收对应`AdapterSafeOutputSnapshot`的fields；P16不产生可保存proof，P15 input factory仍独立重复family/subject/summary/version结构关系校验。其他result不得携带summary/version。Resolved相对已有version时relation必须Older/Equal/Newer/Uncomparable，same exact version=`PreserveCurrent`，Newer=`ApplyResolved`，Older/Uncomparable=`PreserveCurrent`或显式stale outcome但绝不能覆盖current summary/version；无current version时只能`NoCurrentVersion`。非Resolved result只能`NotApplicable`。rule set覆盖6 current states x 5 result kinds x 6 relation values共180个explicit key，结构非法项显式Reject；Invalid current state对任何result一律`RequireNewSnapshot`，不能原地恢复。

### 46.4 P17/P18 maintenance and replay-coordination snapshots

```rust
/// Canonical projection scopes bound immutably to one maintenance target.
pub struct MaintenanceProjectionScopeSet(Vec<ObservationProjectionScope>);

/// Complete target/scope relation loaded before maintenance authorization.
pub struct MaintenanceTargetScopePolicySnapshot {
    target_ref: MaintenanceTargetRef,
    scopes: MaintenanceProjectionScopeSet,
}

pub struct MaintenanceTargetPolicySnapshot {
    binding: MaintenanceTargetScopePolicySnapshot,
    dependencies: MaintenanceDependencyNamespaceSet,
    dependency_availability: MaintenanceDependencyAvailability,
}

pub enum MaintenanceDependencyNamespace {
    Observation,
    Reference,
}

pub struct MaintenanceDependencyNamespaceSet(Vec<MaintenanceDependencyNamespace>);

pub enum MaintenanceDependencyAvailability {
    Available,
    Unavailable,
}

pub enum MaintenanceExecutionModeInput {
    Scheduled,
    ApprovedReplay(ReplayScopePolicySnapshot),
}

pub struct DerivedMaintenanceInputSnapshot {
    target: MaintenanceTargetPolicySnapshot,
    mode: MaintenanceExecutionModeInput,
    no_write: NoWriteGuardDecision,
}

pub enum DerivedMaintenanceOutcome {
    Authorized(MaintenanceExecutionAuthorization),
    Blocked(MaintenanceBlockReason),
}

pub struct MaintenanceTargetEffectRule {
    target_kind: MaintenanceTargetKind,
    effect: MaintenanceAllowedEffect,
}

pub struct MaintenanceTargetEffectRuleSet(Vec<MaintenanceTargetEffectRule>);

pub struct ReplayCoordinationPolicySnapshot {
    coordination: ReplayCoordinationState,
}

pub struct ReplayCoordinationInputSnapshot {
    coordination: ReplayCoordinationPolicySnapshot,
    approved_scope: ReplayScopePolicySnapshot,
    target_boundary: ReplayTargetBoundarySnapshot,
    maintenance: DerivedMaintenanceDecision,
    no_write: NoWriteGuardDecision,
}

pub enum ReplayCoordinationOutcome {
    Start(MaintenanceExecutionAuthorization),
    Blocked(ReplayBlockReason),
}

pub struct ReplayCoordinationRule {
    target_kind: ObservationObjectKind,
    effect: ReplayAllowedEffect,
}

pub struct ReplayCoordinationRuleSet(Vec<ReplayCoordinationRule>);
```

`MaintenanceProjectionScopeSet::try_from_loaded_scopes`按`ObservationProjectionScope` canonical bytes排序、拒绝duplicate与empty；`ByMaintenanceTarget` aggregate selector只能作为由全部member派生的read-fence scope，不能替代真实member集合。`MaintenanceTargetScopePolicySnapshot::from_loaded_binding`只在application已从typed repository读取canonical binding后调用，逐字段保存target与完整scope membership；它不依赖或复制frozen Step07 application helper，也不保存repository version。binding relation本身按当前约束immutable；同一target出现不同scope set是consistency conflict，若业务确需改变membership必须走后续显式replacement design，不能原地改binding或继续复用旧decision。

`MaintenanceTargetPolicySnapshot::from_loaded_binding`要求canonical target与target-scope snapshot逐字段一致；dependency namespace set non-empty、canonical、最多两个member，并由完整loaded dependency index推导，不接受caller两个bool。dependency availability表示该set的全部required namespace是否可读，Unavailable是typed expected block而不是用None冒充无依赖。owning state再从set无损派生`requires_observation_cursor/requires_reference_cursor`，两个namespace仍分别保存/比较。P17 target/effect rules恰好四个一一对应pair。Scheduled P10必须绑定Maintenance trigger + exact target + DerivedMaintenance effect；ApprovedReplay还要求scope Approved、target在scope、effect与guard exact，并消费same-target Replay P10 decision，不能以scope ref替代完整snapshot。

P18 input只允许`ReplayCoordinationKind::Pending`；coordination scope/target/guard必须与Approved scope及其exact replay target member一致。`target_boundary`重用P9 per-target complete retention/protection snapshot，但针对current lookup重新构造；P17 decision必须Authorized(ApprovedReplay same scope)，P10必须Replay trigger + same scope/target/effect。rule set固定六个ReplayTargetRef allowed variant与四effect兼容形成的六个exact true rows，source/canonical truth/unsupported pair不能进入input constructor。P18不迭代scope、不创建job plan、不执行maintenance、不生成changed refs。

### 46.5 E批 `material-v1` exact fields

E批继续使用§19.4的family/schema/field framing。下表字段顺序是digest的一部分；rule set先由各自factory完成cardinality、canonical sort、duplicate与unsafe-row校验，再编码canonical bytes。policy factory不得接受调用方预计算的opaque rule digest来跳过typed material校验。

| policy family | `material-v1` exact fields in order | exact cardinality / fixed material gate |
|---|---|---|
| P13 `DegradedOutput` | `degraded_output_rules` | 120个key：6 safety x 4 visibility x 5 gap signal；每个key恰好一条 |
| P14 `PeripheralExport` | `consumer_rules`;`gap_rules`;`freshness_rules` | 40 + 4 + 4；三个table都必须complete |
| P15 `ReferenceFreshness` | `reference_freshness_rules` | 180个key：6 current state x 5 result kind x 6 version relation |
| P16 `AdapterBoundary` | `adapter_family_rules` | 13个`AdapterFamily`各一条；四个resolver true、其余九个false |
| P17 `DerivedMaintenance` | `maintenance_target_effect_rules` | 四个`MaintenanceTargetKind/MaintenanceAllowedEffect`一一对应pair |
| P18 `ReplayCoordination` | `replay_coordination_rules` | 六个current replay target/effect true row；不得出现false row或额外target |

P13/P15的结构非法key仍显式存在于complete table，并编码`RejectInconsistentSnapshot`；这允许factory证明规则宇宙完整，但runtime命中该行必须返回typed `DomainError`，不能生成normal decision。P16的false row不是部署可调deny list，而是13-family closed-world证明；任何把非四resolver family改成true的material都在factory阶段拒绝。P17/P18只有当前canonical allow pairs，没有wildcard、deny-by-absence后再default allow或扩展source/external truth的入口。

## 47. P13 `DegradedOutputPolicy`

### 47.1 capability / truth boundary

P13对一个exact observation object、一个exact visibility scope、P11 one-shot complete decision、显式safety dependency和complete gap revisions形成`Normal/Limited/Blocked` decision。它不保存同步Query状态、不创建degraded revision identity、不写repository、不关闭或重分类gap，也不把limited body-free surface称为替代成功。同步Query只消费decision组装response；只有显式mutating flow才能在同一UoW把decision应用为新的immutable `DegradedOutputState` revision。

### 47.2 exact policy / decision schema

```rust
/// Immutable degraded-output policy over one resolved total rule table.
pub struct DegradedOutputPolicy {
    basis: PolicyEvaluationBasis,
    rules: DegradedOutputRuleSet,
}

/// Complete target- and input-bound result of one P13 evaluation.
pub struct DegradedOutputDecision {
    policy_basis: PolicyEvaluationBasis,
    input_snapshot: DegradedOutputInputSnapshot,
    outcome: DegradedOutputOutcome,
}

impl DegradedOutputPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        rules: DegradedOutputRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn evaluate(
        &self,
        input: DegradedOutputInputSnapshot,
    ) -> Result<DegradedOutputDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

`DegradedOutputDecision::new`为`pub(crate)`且只有P13可调用。inspection仅提供`policy_basis()`、`input_snapshot()`、`target()`、`outcome()`、`effective_gap_ref()`和`applies_to(&DegradedOutputInputSnapshot)`；`applies_to`逐字段比较target、safety complete snapshot、P11 decision及其basis/input、block reason和complete gap revisions。decision没有public builder、serde decode、bool conversion、replacement ref、actor、clock、record ref或outbox ref。

### 47.3 complete binding 与 deterministic evaluation

evaluation顺序固定，先binding再rule lookup：

| priority | condition | exact result |
|---:|---|---|
| 1 | target/scope不能由P11 exact selector无损映射，或P11 target/scope与binding不一致 | `RelationMismatch(Target/Scope/DecisionBinding)`；不构造decision |
| 2 | target要求safety disposition但输入为NotApplicable，或非safety target携带foreign disposition | `RelationMismatch(StateSnapshot)`；不把missing解释为Safe |
| 3 | P11 Blocked payload与`visibility_block_reason`不一致，或NotVisible/Blocked gap不是P11 provenance gap | `GapInvariantViolation`或`RelationMismatch(DecisionBinding)` |
| 4 | complete gaps与P11 input revisions、target dependency set或lifecycle不一致 | `RelationMismatch(StateSnapshot)` |
| 5 | 从Open/Acknowledged gaps按固定优先级选择effective gap，映射6x4x5 exact key | 只做lookup，不修改任何gap |
| 6 | rule为`RejectInconsistentSnapshot` | `GapInvariantViolation`；不构造decision |
| 7 | valid template | 注入input中exact effective gap ref，形成target-bound outcome |

factory对120行执行以下不可放宽约束：Pending必须Blocked(InconsistentSnapshot)；Rejected/Quarantined必须Blocked(SafetyBlocked)；NotVisible必须Blocked(VisibilityBlocked)并保留P11 provenance gap；P11 Blocked必须映射与exact `ReadBlockReason`一致的`DegradedBlockReason`；UnsafeOutput不得Limited或Normal；Restricted不得Normal；任一effective gap不得Normal。MissingMaterial/UnresolvedReference可按显式table形成Limited或Blocked，但Limited必须保留exact gap；NotVisibleMaterial/UnsafeOutput只能Blocked。Normal只允许NotApplicable/Safe/Redacted + Visible + no effective gap。

### 47.4 owning revision / Query split

mutating flow使用以下唯一public domain入口；同步Query禁止调用：

```rust
impl DegradedOutputState {
    pub fn create_from_decision(
        degraded_ref: DegradedOutputRef,
        decision: &DegradedOutputDecision,
    ) -> Result<Self, DomainError>;

    pub fn replace_from_decision(
        previous: &DegradedOutputState,
        replacement_ref: DegradedOutputRef,
        decision: &DegradedOutputDecision,
    ) -> Result<Option<(Self, DegradedOutputTransition)>, DomainError>;
}
```

durable revision新增immutable `affected_object_ref: AffectedObservationObjectRef`，并保留`visibility_scope_ref`；两个字段都从decision target复制，rehydration逐字段验证。`Normal -> DegradedOutputKind::None`且reason/block/gap为空；`Limited -> Active`且reason必填、block为空、limited=true；`Blocked -> Blocked`且reason/block必填、limited=false、gap按decision保留。replacement必须换新identity；exact same target/outcome返回`Ok(None)`且不消费replacement identity。旧`normal/from_policy_output/replace_from_policy`和`ReadVisibilityState`参数shape降为historical private helper，不再是current public入口。

同步Query流程只把`DegradedOutputDecision`lossless映射为`DegradedSurface/VisibilitySurface`，不创建`DegradedOutputRef`、state、transition或H8 record。显式mutating flow在decision complete binding后创建新revision；accepted revision与transition才可由G批H8关联。两条路径都不修改`SafetyDisposition`、`ReadVisibilityDecision`或`GapState`。

### 47.5 error / zero side effect / planned tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(...)` | wrong family、material digest mismatch、120-key缺/多/重复或unsafe row |
| `MissingRequiredReference` | target-required disposition、P11 provenance gap或complete gap revision未加载 |
| `RelationMismatch(Target/Scope/StateSnapshot/DecisionBinding)` | target/scope/safety/P11/gap complete input不匹配或decision跨input复用 |
| `SafetyBoundaryViolation` | disposition自身conditional fields无法形成finite safety signal |
| `GapInvariantViolation` | illegal P11 payload、effective-gap selection冲突、Reject row或outcome/gap矩阵非法 |
| `InvalidStateTransition` | durable replacement使用terminal/cross-target pre-state或same identity替换 |

Normal/Limited/Blocked都是expected outcome，不走error。evaluate error与所有Query outcome均保持repository writer、clock、id generator、record/outbox、resolver和adapter调用为零；durable factory error不创建revision/delta且不消费identity。planned tests覆盖120 exact keys、missing/extra/duplicate/conflicting row、固定gap优先级的pairwise组合、六safety x 四visibility、NotApplicable compatibility、P11 provenance gap、multi-object selector禁止持久sidecar、cross-target/scope/basis replay、Query writer spies全零、durable exact-target binding/new identity/duplicate None，以及body/locator/provider/config/run-id/evidence/signoff扫描。对象停审：`pass_R06.5-E_P13_design_only`。

## 48. P14 `PeripheralExportPolicy`

### 48.1 capability / two-target boundary

P14在同一immutable material下提供两个彼此独立的入口：对`ExternalAuditExportPreparation`形成`ExportPreparationDecision`，对`PeripheralDeliveryState`形成`PeripheralDeliveryDecision`。preparation只判断body-free immutable input是否可进入Prepared/Blocked/Pending/Degraded；delivery只判断已保存preparation与public view是否可发起adapter delivery。两者都不调用adapter、不持有endpoint/credential、不接收adapter result，也不生成external audit acceptance、verdict、evidence alias或signoff。

### 48.2 exact policy schema / complete signatures

```rust
/// Immutable peripheral-export policy over consumer, gap and freshness rules.
pub struct PeripheralExportPolicy {
    basis: PolicyEvaluationBasis,
    consumer_rules: PeripheralConsumerPolicyRuleSet,
    gap_rules: PeripheralGapRuleSet,
    freshness_rules: PeripheralFreshnessRuleSet,
}

impl PeripheralExportPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        consumer_rules: PeripheralConsumerPolicyRuleSet,
        gap_rules: PeripheralGapRuleSet,
        freshness_rules: PeripheralFreshnessRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn evaluate_preparation(
        &self,
        input: ExportPreparationInputSnapshot,
    ) -> Result<ExportPreparationDecision, DomainError>;

    pub fn evaluate_delivery(
        &self,
        input: PeripheralDeliveryInputSnapshot,
    ) -> Result<PeripheralDeliveryDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

两个decision的constructor均`pub(crate)`且只有P14可调用。canonical declaration仍归R06.4 `domain::peripheral`，但E批扩展为保存`policy_basis`及各自完整input snapshot，再保存既有output fields；`applies_to_preparation`/`applies_to_delivery`重建complete input逐字段比较。decision不提供public struct literal、serde/default/builder，也不能在preparation与delivery之间互转。

### 48.3 preparation evaluation matrix

`evaluate_preparation`先绑定preparation/consumer/view/evidence input、current gaps、retention/protection与P10，再按以下固定优先级形成decision：

| priority | current condition | readiness / block |
|---:|---|---|
| 1 | P10 complete decision合法但Blocked | `Blocked(NoWriteGuardBlocked)` |
| 2 | retention ActiveHold/Conflict，或protection Protected/Conflicted | `Blocked(RetentionHoldActive)` |
| 3 | consumer rule Block | `Blocked(exact ExportBlockReason)` |
| 4 | view/committed input NotVisible或Blocked | `Blocked(VisibilityBlocked)`；真实gap保留 |
| 5 | effective UnsafeOutput/NotVisibleMaterial gap | `Blocked(EvidenceGap)` |
| 6 | evidence input Pending | `PendingEvidence`，visibility None，gap refs保留；不得伪装missing lookup |
| 7 | freshness Rebuilding/Unknown action Pending | `PendingEvidence`；不生成default gap |
| 8 | consumer AllowLimited、freshness Degrade或Missing/Unresolved gap action Degrade | `Degraded`；visibility为limited body-free surface且至少一个exact gap |
| 9 | committed visible/restricted input + Fresh + consumer Allow + no effective gap | `Ready` |

`PendingEvidence`只来自已完成lookup的typed absence或显式nonfresh Pending action；repository error、未加载、partial batch与corrupt committed snapshot返回error。Ready不得携带block reason或hard gap；Degraded必须保留所有effective gap refs而非只保留surface gap。P7 decision绑定Report handoff，不能替代本入口的consumer/view/evidence-input binding。

### 48.4 delivery evaluation matrix

delivery入口要求preparation current state/readiness已经由P14 accepted decision推进为`Prepared + Ready/Degraded`；Draft/PendingEvidence、Blocked、Delivered与permanent/rejected Failed不能进入normal Prepare outcome。优先级为P10 -> retention/protection -> consumer -> preparation state/readiness -> view visibility/freshness -> effective gaps -> optional P13 exact-target decision。

`PeripheralDeliveryPolicyOutcome::Prepare`只在全部门禁通过时生成`allowed=true` decision。任一门禁block生成`allowed=false`及六variant之一：`ExportForbidden`、`ConsumerUnavailable`、`VisibilityBlocked`、`EvidenceGap`、`RetentionHoldActive`、`NoWriteGuardBlocked`。optional P13 decision若存在必须绑定当前view exact target/scope；Limited允许body-free limited delivery并保留gap，Blocked映射VisibilityBlocked或EvidenceGap且不调用adapter。缺失P13不表示Normal：view本身标记degraded时必须提供same-target decision，否则`MissingRequiredReference`。

adapter result只在owning `PeripheralDeliveryState::record_delivery`中消费；`Delivered`仍只表示本地boundary记录到delivery，不是外部系统接受、审计签署或report correctness。P14不生成`PeripheralDeliveryResult`，也不根据provider response重评policy。

### 48.5 owning member / stale-decision gate

`ExternalAuditExportPreparation::apply_decision(&ExportPreparationInputSnapshot, &ExportPreparationDecision, updated_at)`与`PeripheralDeliveryState::{prepare,block}(&PeripheralDeliveryInputSnapshot, &PeripheralDeliveryDecision, updated_at)`成为current public policy入口；member先执行decision complete binding，再读取outcome并一次性mutation。旧只接收decision的签名降为module-private helper。preparation/delivery/consumer/view/evidence input、visibility/freshness/gap revision、retention/protection或P10/P13任一变化都使旧decision失效。

Accepted member保留R06.4既有transition semantics：preparation替换readiness/visibility/gaps和block reason；delivery替换visibility/gaps/block reason。任何binding/error路径逐字段不变且不生成transition/H9 record/outbox。adapter call只能发生在`Prepared` transition成功提交之后的application external-effect cut，不能在policy/member内部发生。

### 48.6 error / zero side effect / planned tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(...)` | wrong family、digest mismatch、40/4/4 table cardinality或unsafe allow row |
| `MissingRequiredReference` | consumer/view/evidence input/gap/retention/protection lookup未完成，或required P13 decision缺失 |
| `RelationMismatch(Consumer/Target/Scope/StateSnapshot/DecisionBinding)` | preparation/delivery/consumer/view/input/P10/P13 cross-target或stale snapshot |
| `RetentionConflict` | marker/protection target或conditional state自身冲突 |
| `GapInvariantViolation` | view gap refs与complete revisions不一致，Degraded无gap，NotVisible缺gap |
| `HandoffInvariantViolation` | immutable evidence input purpose/consumer/scope或preparation readiness matrix非法 |
| `InvalidStateTransition` | terminal preparation/delivery尝试复用decision或delivery未Prepared |

四种preparation readiness与Prepare/Blocked delivery都是expected outcome。policy evaluation不调用adapter、repository、clock、id generator或writer；member error不生成transition/record/outbox。planned tests覆盖40 consumer keys、4 gap/4 freshness rows、repository `Ok(None)`与error/未加载区分、Pending/Committed evidence boundary、Ready/Degraded/Blocked/Pending totality、six peripheral block reasons、retention/protection强制block、P10/P13 cross-target、preparation与delivery decision互换拒绝、adapter spy零调用、accepted member atomic replacement、adapter result不等于acceptance，以及body/endpoint/credential/provider/verdict/signoff扫描。对象停审：`pass_R06.5-E_P14_design_only`。

## 49. P15 `ReferenceFreshnessPolicy`

### 49.1 capability / reference truth boundary

P15把一个loaded local `ReferenceSnapshotState`、本次typed `ReferenceRefreshResult`、同一source stream的version relation、exact reference-maintenance target与P10 decision收敛为`ReferenceFreshnessDecision`。它决定当前local snapshot可否消费本次result、应保持现状、还是必须建立新snapshot identity；它不拥有external reference lifecycle，不用local wall clock推断source freshness，不从append-only `ReferenceRefreshRecord`反向授权，也不调用resolver或repository。

### 49.2 exact policy / decision schema

```rust
/// Immutable reference-freshness policy over one complete finite rule table.
pub struct ReferenceFreshnessPolicy {
    basis: PolicyEvaluationBasis,
    rules: ReferenceFreshnessRuleSet,
}

/// Complete result bound to one local reference snapshot and resolver outcome.
pub struct ReferenceFreshnessDecision {
    policy_basis: PolicyEvaluationBasis,
    input_snapshot: ReferenceFreshnessInputSnapshot,
    action: ReferenceFreshnessAction,
}

impl ReferenceFreshnessPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        rules: ReferenceFreshnessRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn evaluate(
        &self,
        input: ReferenceFreshnessInputSnapshot,
    ) -> Result<ReferenceFreshnessDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

decision constructor为`pub(crate)`且只有P15可调用。inspection为`policy_basis()`、`input_snapshot()`、`action()`、`applies_to(&ReferenceSnapshotState, &ReferenceRefreshResult, &MaintenanceTargetRef, &NoWriteGuardDecision)`、`requires_new_snapshot()`；complete comparison包含snapshot所有conditional fields、subject、observed time、target descriptor、resolver result payload、adapter family、version relation与P10 basis/input/outcome。P17是owning mutation的独立第二门禁，不进入P15 decision，避免freshness与maintenance policy形成循环owner。decision不是resolver result、record、job result、freshness marker或跨UoW token。

### 49.3 input construction 与 version relation

`ReferenceFreshnessInputSnapshot::try_new`只允许application在以下顺序完成后调用：加载current snapshot与canonical target binding；对Resolved mapper output先执行P16；使用typed source-version comparator确认same stream；构造P10 Maintenance或ApprovedReplay same-target decision；最后把所有complete freshness inputs move进snapshot。P16成功不形成marker或proof，所以本factory仍独立重复adapter family、subject、summary owner与source-version stream兼容校验。application还必须独立执行P17；P17 Blocked、stale target binding或P10不一致不能进入owning mutation，但不改变P15 decision的唯一owner。它执行下列结构门禁：

| result / current version | only legal relation | forbidden substitution |
|---|---|---|
| Resolved + current None | `NoCurrentVersion` | `Newer`不能代替absence proof |
| Resolved + current Some | `Older/Equal/Newer/Uncomparable` | lexical、numeric、timestamp或digest ordering |
| Stale/Unresolved/Invalid/Unavailable | `NotApplicable` | 用旧current version制造relation |
| any result | relation stream必须等于snapshot subject/target stream | cross-subject comparator result |

Resolved result的summary/source version必须逐字段等于P16 validated `AdapterSafeOutputSnapshot`；其他result不允许附带safe output。`NoCurrentVersion`只来自loaded Pending/Unresolved/Invalid/Unavailable或Stale-without-version snapshot的explicit absence；Resolved current state缺version本身是corrupt input。P15可比较source version，但`observed_at`只用于mutation monotonicity，不参与freshness ordering。

### 49.4 180-key total matrix

rule set固定6 current state x 5 result kind x 6 relation共180行。factory先标记结构非法组合为`RejectInconsistentSnapshot`，再对合法组合执行以下不可放宽约束；runtime始终按exact key lookup，不以if/else fallback替代material。

| current/result/relation | allowed action |
|---|---|
| any Invalid current + any result/relation | `RequireNewSnapshot`；不能原地恢复 |
| Resolved + NoCurrentVersion | `ApplyResolved`，但仅current无usable version时 |
| Resolved + Newer | `ApplyResolved` |
| Resolved + Equal + exact same summary/version | `PreserveCurrent` |
| Resolved + Equal + different summary | `RejectInconsistentSnapshot`；same version不能改body-free summary identity |
| Resolved + Older | `PreserveCurrent`或`ApplyStale`；绝不能覆盖current summary/version |
| Resolved + Uncomparable | `PreserveCurrent`或`ApplyStale`；绝不能宣称Newer/Fresh |
| Stale + NotApplicable | `ApplyStale` |
| Unresolved + NotApplicable | `ApplyUnresolved` |
| non-Invalid current + Invalid result + NotApplicable | `ApplyInvalid` |
| Unavailable + NotApplicable | `ApplyUnavailable` |

`ApplyStale`在Older/Uncomparable Resolved result分支使用typed `ReferenceStaleReason::{SourceAdvanced,ComparatorUnavailable}`并保留current usable summary/version；resolver直接返回Stale时payload reason原样保留，是否保留last usable pair由current state matrix决定。`PreserveCurrent`形成normal expected decision但owning member返回`Ok(None)`，不更新时间、不生成transition/record。任何table行允许Older/Uncomparable覆盖current version、Invalid原地恢复、nonResolved使用非NotApplicable，factory都返回`ReferenceBoundaryViolation`或`PolicyBasisMismatch`。

### 49.5 owning member / new-snapshot boundary

```rust
impl ReferenceSnapshotState {
    pub fn apply_freshness_decision(
        &mut self,
        target: &MaintenanceTargetPolicySnapshot,
        maintenance: &DerivedMaintenanceDecision,
        decision: &ReferenceFreshnessDecision,
    ) -> Result<Option<ReferenceSnapshotTransition>, DomainError>;

    pub fn create_from_required_new_snapshot(
        snapshot_ref: ReferenceSnapshotStateRef,
        previous: &ReferenceSnapshotState,
        target: &MaintenanceTargetPolicySnapshot,
        maintenance: &DerivedMaintenanceDecision,
        decision: &ReferenceFreshnessDecision,
    ) -> Result<Self, DomainError>;
}
```

`apply_freshness_decision`先complete-bind P17 Authorized target/scope/dependency/mode/P10，再绑定current snapshot/result/target/P10与P15 decision，最后解释action。ApplyResolved/Stale/Unresolved/Invalid/Unavailable使用R06.4 private transition helpers；PreserveCurrent返回None；RequireNewSnapshot和Reject action拒绝原地mutation。`create_from_required_new_snapshot`只接受P17 Authorized、P15 RequireNewSnapshot、不同identity、同subject与同一complete result；它在新identity上按result建立Resolved/Stale/Unresolved/Invalid/Unavailable完整状态，或在result结构不允许建立新state时返回error。旧Invalid row保持不变且不产生external lifecycle claim；新snapshot的accepted creation history由G批H10的typed new-snapshot accepted-input branch承接，并保存P17/P15两个basis，不能伪造old-row transition。旧public `apply_refresh(result)`降为module-private helper，不能绕过P15/P17双decision gate。

accepted mutation产生`ReferenceSnapshotTransition`，G批H10随后以transition + same-UoW post-state + metadata建record；record不能作为下一次P15 input。P15 decision也不直接创建或关闭gap；application可在accepted post-state后调用P12形成same-subject gap decision，不能从resolver error message猜gap kind。

### 49.6 error / zero side effect / planned tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(...)` | wrong family、digest mismatch、180-key缺/多/重复或unsafe row |
| `MissingRequiredReference` | current snapshot/target/P10/comparator或Resolved typed safe-output component未加载 |
| `RelationMismatch(Subject/Target/Version/StateSnapshot/DecisionBinding)` | stream、subject、target、snapshot fields、P10或decision不匹配 |
| `ReferenceConflict` | Equal version不同summary、illegal relation/result payload、observed time regression |
| `ReferenceBoundaryViolation` | source/external truth owner越界、Invalid原地恢复或unsafe policy material |
| `NoWriteBoundaryViolation` | P10省略、cross-target或Blocked被当成authorization |
| `InvalidStateTransition` | RequireNewSnapshot被用于原地mutation，或new identity与old相同 |

Stale/Unresolved/Invalid/Unavailable/PreserveCurrent/RequireNewSnapshot均为typed result，不等于provider failure或external verdict。evaluate不调用resolver/repository/clock/writer；error与PreserveCurrent不生成transition/H10/outbox/gap。planned tests覆盖180 exact keys、all structural reject rows、NoCurrentVersion与missing-load区分、Older/Equal/Newer/Uncomparable、same-version summary conflict、Invalid current对所有result均要求new identity、P16成功无proof且P15重复结构校验、P10 scheduled/replay binding、record-as-input rejection、zero resolver/writer spies、observed time不参与ordering，以及body/locator/provider/error-text/default-window扫描。对象停审：`pass_R06.5-E_P15_design_only`。

## 50. P16 `AdapterBoundaryPolicy`

### 50.1 capability / pure structural exception

P16只验证一个trusted mapper形成的`AdapterSafeOutputSnapshot`是否由允许产生reference summary的adapter family生成，并且subject、summary owner、source-version stream与family compile-time compatibility一致。它不判断availability、freshness、visibility、authenticity、authorization或external product truth；成功返回`Ok(())`，失败返回typed `DomainError`，不产生decision/status/marker/state/record。

### 50.2 exact policy schema / signatures

```rust
/// Immutable product-neutral structural guard for trusted adapter output.
pub struct AdapterBoundaryPolicy {
    basis: PolicyEvaluationBasis,
    family_rules: AdapterFamilyRuleSet,
}

impl AdapterBoundaryPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        family_rules: AdapterFamilyRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn validate_reference_summary(
        &self,
        output: &AdapterSafeOutputSnapshot,
    ) -> Result<(), DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

factory要求family=`AdapterBoundary`，13个`AdapterFamily`各一条，且true set精确等于四个resolver family。rule不是可部署扩张点：store/publisher/delivery/clock/id-generator任一true均返回`BodyFreeBoundaryViolation`，四resolver任一false则返回`PolicyBasisMismatch(SnapshotDigestChanged)`或missing material defect。不存在wildcard、product name、provider capability string或`Other` family。

### 50.3 trusted output construction / validation

`AdapterSafeOutputSnapshot::from_trusted_mapper(adapter_family, subject_ref, summary_ref, source_version)`是public Rust domain factory但不在protocol/serde暴露。它只接受已经由对应resolver adapter完成raw-to-safe mapping的typed refs；raw response、URL/path、provider id、credential、error string、free-form product truth或serialized body不能进入参数。

validation按固定顺序执行：family rule必须true；family必须`is_resolver()`；subject variant必须与resolver family一一对应；summary typed owner必须与subject owner一致；source version subject/stream必须与subject相同；所有ref必须通过existing body-free validation。四个exact mapping为ObservationSource、RuntimeSandbox、GovernanceArtifactEvidence、SubjectObservation；ArchiveReportHandoff等其他safe ref若需resolver必须先由正式设计增加对应`AdapterFamily`，不能借现有family。

P16成功只证明结构可交给P15，不能直接构造`ReferenceRefreshResult::Resolved`、`ReferenceFreshnessDecision`、`ReferenceSnapshotState::Resolved`或public `Fresh` surface。application先调用P16，再把同一output fields映射进resolver result和P15 input；P15仍需complete snapshot/version/P10判断。P16不能接收`ReferenceRefreshRecord`、adapter availability state或config binding作为替代证明。

### 50.4 error / zero side effect / planned tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(...)` | wrong family、digest mismatch、13-row缺/多/重复或四/九 truth table不精确 |
| `BodyFreeBoundaryViolation` | raw/locator/product/provider/credential语义进入safe output，或非resolver family被允许 |
| `ReferenceBoundaryViolation` | subject family、summary owner或adapter family不兼容 |
| `RelationMismatch(Subject/Version)` | source-version stream或summary owner不属于exact subject |
| `MissingRequiredReference` | subject、summary或source version typed component缺失；不能用empty/default ref |

成功和失败都不修改snapshot、adapter availability、config、reference state或gap，不调用repository/resolver/clock，不生成decision/transition/record/outbox。planned tests覆盖13 family totality、四true/九false、每个resolver与合法subject mapping、all cross-family pairs、same subject/different source stream、raw body/URI/path/provider/error string拒绝、success仍不能构造Fresh、zero writer spies和Debug redaction。对象停审：`pass_R06.5-E_P16_design_only`。

## 51. P17 `DerivedMaintenancePolicy`

### 51.1 capability / authorization boundary

P17对一个canonical observation-side maintenance target、完整target-scope membership、typed dependency namespace、execution mode与P10 decision形成`Authorized/Blocked` decision。Authorized内含一个`MaintenanceExecutionAuthorization`，但真正的消费入口必须借用整个`DerivedMaintenanceDecision`和current target snapshot，不能抽出authorization跨UoW重放。P17不创建maintenance/replay/job state、不生成progress/cursor/plan/claim，不调用resolver/store，也不授权source truth或external truth写入。

### 51.2 exact policy / decision schema

```rust
/// Immutable derived-maintenance policy over the four canonical target/effect pairs.
pub struct DerivedMaintenancePolicy {
    basis: PolicyEvaluationBasis,
    target_effect_rules: MaintenanceTargetEffectRuleSet,
}

/// Complete target-, scope-, dependency- and guard-bound maintenance result.
pub struct DerivedMaintenanceDecision {
    policy_basis: PolicyEvaluationBasis,
    input_snapshot: DerivedMaintenanceInputSnapshot,
    outcome: DerivedMaintenanceOutcome,
}

impl DerivedMaintenancePolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        target_effect_rules: MaintenanceTargetEffectRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn evaluate(
        &self,
        input: DerivedMaintenanceInputSnapshot,
    ) -> Result<DerivedMaintenanceDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

`DerivedMaintenanceDecision::new`和`MaintenanceExecutionAuthorization::new`均为`pub(crate)`，只有P17调用。decision inspection为`policy_basis()`、`input_snapshot()`、`outcome()`、`authorization() -> Option<&MaintenanceExecutionAuthorization>`、`block_reason()`和`applies_to(&MaintenanceTargetPolicySnapshot, &MaintenanceExecutionModeInput, &NoWriteGuardDecision)`。authorization canonical owner统一为`domain::maintenance`；`domain::policies`只拥有policy与rule material，不建立第二definition。

### 51.3 target / scope / dependency construction

| carrier factory | exact source and invariant |
|---|---|
| `MaintenanceProjectionScopeSet::try_from_loaded_scopes` | complete canonical binding member list；non-empty、sorted、unique；不接受caller-submitted subset或`ByMaintenanceTarget`替代member |
| `MaintenanceTargetScopePolicySnapshot::from_loaded_binding` | loaded canonical `MaintenanceTargetRef` + complete scope set；target id/kind/object/effect/guard逐字段验证 |
| `MaintenanceDependencyNamespaceSet::try_from_loaded_roles` | 从完整dependency index的typed roles total映射Observation/Reference；non-empty、最多2、declaration order canonical；无bool constructor |
| `MaintenanceTargetPolicySnapshot::from_loaded_binding` | target-scope snapshot + dependency set + typed availability；重新验证target kind/effect与每scope compatibility |
| `DerivedMaintenanceInputSnapshot::try_new` | target snapshot + Scheduled或ApprovedReplay scope snapshot + P10 complete decision；字段private，无serde/default/builder |

dependency availability的`Unavailable`只表示完整typed index明确无法提供至少一个required namespace，不表示set缺失；index未加载、partial page或repository error不能构造snapshot。Projection target可依赖Observation、Reference或两者；ReferenceSnapshot只依赖Reference，Gap scan依赖Observation/Reference中实际indexed roles，SignalRollup只依赖Observation。compile-time target compatibility与loaded roles冲突返回error，不能改两个bool继续执行。

### 51.4 scheduled / replay decision matrix

evaluation先验证target/effect rule、target-scope/dependency complete binding与P10 identity，再产生expected outcome：

| priority | condition | exact result |
|---:|---|---|
| 1 | target指向source/external truth，或kind/object/effect/guard自相矛盾 | `NoWriteBoundaryViolation` / `ReferenceBoundaryViolation`；不构造decision |
| 2 | 四个canonical target/effect pair不匹配 | `RelationMismatch(Target)`；resolved material不能把它配置为allow |
| 3 | Scheduled但P10不是Maintenance + same target + DerivedMaintenance(effect) | binding mismatch为error；valid Blocked为`Blocked(NoWriteGuardBlocked)` |
| 4 | ApprovedReplay scope非Approved、target不在scope、effect/guard不一致 | `ReplayBoundaryViolation`或`RelationMismatch(Scope/Target)` |
| 5 | ApprovedReplay的P10不是Replay + same scope/target/effect | binding mismatch为error；valid Blocked为`Blocked(NoWriteGuardBlocked)` |
| 6 | dependency availability为Unavailable | `Blocked(DependencyUnavailable)` |
| 7 | all gates pass | `Authorized(MaintenanceExecutionAuthorization)` |

四个exact pair为Projection/RebuildDerivedProjection、ReferenceSnapshot/RefreshBodyFreeReference、Gap/ScanGap、SignalRollup/RebuildSignalRollup。`MaintenanceBlockReason::{SourceTruthTarget,EffectNotAllowed,InvalidTarget}`不从well-formed current input产生：对应情况在input/binding阶段是结构错误；只有`NoWriteGuardBlocked`和`DependencyUnavailable`是current expected block。这样不会把攻击性target包装成正常deny后继续，也不会伪造authorization。

authorization逐字段复制target、allowed effect、Scheduled或`ApprovedReplay(scope_ref)` mode与ObservationMaintenance guard。它不含actor、job/run、cursor、scope member set、repository version或policy basis；这些完整证明只保留在enclosing decision，因此authorization不能单独作为public API参数。

### 51.5 owning consumption / dual-watermark handoff

`ProjectionMaintenanceState::start_from_decision`、`RollupRebuildState::start_from_decision`、reference maintenance mutation入口以及R06.6 gap-scan item planner都必须接收`&MaintenanceTargetPolicySnapshot`和`&DerivedMaintenanceDecision`，先调用complete `applies_to`，再提取Authorized payload。旧`start(MaintenanceExecutionAuthorization, ...)`降为owning module private helper。Blocked decision不得创建/推进state、progress、claim、job item或record。

Projection maintenance factory从`MaintenanceDependencyNamespaceSet`无损派生两个immutable requirement bool；后续start仍分别接收Observation/Reference cursor并按namespace检查，不能把set折成一个global requirement。Reference refresh owning member必须同时验证P17 Authorized与P15 decision的same target/subject/P10 relation；gap scan item result在R06.6闭口，但必须保存P17 target binding，不可只存bool。P17只授权尝试本地derived effect，不证明执行完成、projection Fresh、reference Resolved、gap已扫描或rollup正确。

### 51.6 error / zero side effect / planned tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(...)` | wrong family、digest mismatch、四pair缺/多/重复或unsafe pair |
| `MissingRequiredReference` | canonical binding/dependency index/scope/P10未加载 |
| `RelationMismatch(Scope/Target/StateSnapshot/DecisionBinding)` | target-scope、dependency roles、mode、scope member、P10或decision漂移 |
| `NoWriteBoundaryViolation` | source/external target、wrong guard或P10 bypass |
| `ReplayBoundaryViolation` | ApprovedReplay scope/effect/member不满足 |
| `ReferenceBoundaryViolation` | reference target/subject owner越界 |
| `MaintenanceIncomplete` | required dependency set为空、partial或不能映射namespace |

Authorized与两个Blocked reason均是normal outcome。evaluate不创建state/authorization以外durable identity，不调用writer/resolver/clock；Blocked/error不生成transition/H11/H12/H13/outbox。planned tests覆盖4 exact pairs及16 cross-pairs、scope set canonical/empty/duplicate/subset、typed dependency set三种合法组合、partial/unavailable区分、Scheduled/ApprovedReplay P10 identity、Approved scope membership、Blocked no fake authorization、decision cross-binding replay、dual namespace不折叠、all owning start paths拒绝bare authorization，以及source/external/body/provider/run-id扫描。对象停审：`pass_R06.5-E_P17_design_only`。

## 52. P18 `ReplayCoordinationPolicy`

### 52.1 capability / one-target cardinality

P18只评估一个已经存在的`ReplayCoordinationState::Pending`，并把它绑定到一个persisted Approved replay scope中的一个exact target、current retention/protection lookup、P17 decision与P10 decision，形成Start或Blocked。它不遍历scope、不选择target、不创建coordination identity/job plan/claim/progress、不执行maintenance、不生成changed refs，也不消费H13 record。scope-wide展开唯一留给R06.6 immutable plan，每个target建立独立coordination identity和P18 decision。

### 52.2 exact policy / decision schema

```rust
/// Immutable replay-coordination policy over six exact target/effect pairs.
pub struct ReplayCoordinationPolicy {
    basis: PolicyEvaluationBasis,
    rules: ReplayCoordinationRuleSet,
}

/// Complete one-coordination/one-target result for an approved replay scope.
pub struct ReplayCoordinationDecision {
    policy_basis: PolicyEvaluationBasis,
    input_snapshot: ReplayCoordinationInputSnapshot,
    outcome: ReplayCoordinationOutcome,
}

impl ReplayCoordinationPolicy {
    pub fn from_resolved_snapshot(
        basis: PolicyEvaluationBasis,
        rules: ReplayCoordinationRuleSet,
    ) -> Result<Self, DomainError>;

    pub fn evaluate(
        &self,
        input: ReplayCoordinationInputSnapshot,
    ) -> Result<ReplayCoordinationDecision, DomainError>;

    pub fn basis(&self) -> &PolicyEvaluationBasis;
}
```

decision constructor为`pub(crate)`且只有P18可调用。inspection仅提供`policy_basis()`、`input_snapshot()`、`outcome()`、`authorization()`、`block_reason()`和`applies_to(&ReplayCoordinationInputSnapshot)`；complete comparison包含coordination全部pre-state字段、Approved scope全部字段、current target boundary的marker/protection/P10 revisions、P17 complete decision和独立P10 complete decision。decision无changed refs、violation ref、job/run/record/outbox identity或external outcome。

### 52.3 current approved-scope input construction

`ReplayScopePolicySnapshot::from_approved_scope`要求persisted scope为Approved、target set non-empty、reason fields None。`ReplayTargetBoundarySnapshot::try_from_current_approved_lookups`复用P9同一shape，但允许Approved pre-state：application必须重新完成same-target retention marker与active protection lookup，并构造current Replay P10 decision；repository `Ok(None)`才可形成typed absence，旧P9 approval snapshot不能替代current lookup。

`ReplayCoordinationPolicySnapshot::from_coordination`复制coordination identity/scope/target/state/guard及all conditional fields，只允许Pending且reason/violation为空。`ReplayCoordinationInputSnapshot::try_new`执行：

1. coordination scope等于Approved scope，target descriptor无损映射到scope中exact `ReplayTargetRef`。
2. target boundary的target/effect等于scope与coordination target；retention/protection/P10来自current lookup。
3. P17 decision为Authorized，mode=`ApprovedReplay(same scope)`，target/effect/guard、target-scope binding与dependency set均为current input；Blocked decision仍可进入P18以形成typed Blocked，但不能携带authorization。
4. 独立P10 decision与target boundary中的P10及P17 input中的P10逐字段相等，均绑定Replay trigger + same scope/target/effect。

scope-wide set、foreign target、old approval-time lookup、single global marker/protection、P10 outcome bool或bare authorization都不能构造input。

### 52.4 six-row rule / current safety gate

rule set固定六行且没有`allowed`字段：GapState/ScanObservationGap、SignalRollupWindow/RebuildSignalRollup、ReferenceSnapshotState/RefreshBodyFreeReference、ObservationReadModel/DiagnosticView/DashboardAlertExportView各自RebuildDerivedProjection。factory要求六行exact齐全、canonical sorted unique；任何source truth、external truth、support progress object、coordination object或cross-effect row返回`ReplayBoundaryViolation`。

完成binding后按以下固定优先级形成outcome：

| priority | current condition | exact outcome |
|---:|---|---|
| 1 | independent/current P10 valid Blocked | `Blocked(NoWriteGuardBlocked)` |
| 2 | marker为ActiveHold、ReleaseEligible或Conflict | `Blocked(RetentionHoldActive)`；ReleaseEligible尚未Released |
| 3 | protection为Protected、Expired或Conflicted | `Blocked(ActiveReferenceProtection)`；Expired必须先revalidate/release |
| 4 | P17 `Blocked(NoWriteGuardBlocked)` | `Blocked(NoWriteGuardBlocked)` |
| 5 | P17 `Blocked(DependencyUnavailable)` | `Blocked(ScopeSnapshotStale)`；current dependency basis不足，不能start |
| 6 | exact six-row pair缺失 | factory/input defect，返回`ReplayBoundaryViolation`而非normal block |
| 7 | current marker Unmarked/Released + protection absent/Unprotected/Released + P10/P17 Authorized | `Start(same P17 authorization)` |

P17其他block reason对well-formed current input不可达；若corrupt decision出现则返回`ReplayBoundaryViolation`，不能猜映射。Start不执行任何target effect，只把exact authorization交给owning coordination member。P18比scope approval再次收紧current boundary；它不能把approval-time safe状态当成execution-time safe状态。

### 52.5 owning member / no changed-ref fabrication

```rust
impl ReplayCoordinationState {
    pub fn apply_policy_decision(
        &mut self,
        input: &ReplayCoordinationInputSnapshot,
        decision: &ReplayCoordinationDecision,
        updated_at: ObservedAt,
    ) -> Result<ReplayCoordinationTransition, DomainError>;
}
```

member先重建coordination pre-snapshot并执行decision/input complete binding。Start调用private same-target `start(authorization)`，只做Pending -> Coordinating，transition的changed refs为空；Blocked调用private `block(reason, None)`，只做Pending -> Blocked。P18没有正式来源可生成`NoWriteViolationRef`，因此policy Blocked永远传None；若未来独立violation flow建立typed ref，需另有accepted member/transition设计，不能在P18猜造。

`complete(approved_scope, changed_refs, updated_at)`仍属于后续实际maintenance完成路径，不由P18调用。changed set只能empty或stored exact target singleton，并只在Coordinating -> Completed时由真实accepted local write结果提供。P18 evaluation、Start和Blocked均不得预填changed refs、H13 record、job report或source-repair claim。

### 52.6 error / zero side effect / planned tests

| `DomainError` | exact trigger |
|---|---|
| `PolicyBasisMismatch(...)` | wrong family、digest mismatch、六row缺/多/重复或unsafe row |
| `MissingRequiredReference` | Approved scope/current retention/protection/P10/P17/coordination snapshot未加载 |
| `RelationMismatch(Scope/Target/StateSnapshot/DecisionBinding)` | coordination/scope/target/current lookup/P10/P17/decision任一漂移 |
| `ReplayBoundaryViolation` | scope非Approved、unsupported target/effect、scope-wide input、corrupt P17 block或source/external target |
| `RetentionConflict` | current marker/protection relation或conditional fields冲突 |
| `NoWriteBoundaryViolation` | P10省略、cross-target、non-Replay trigger或Blocked被替换 |
| `InvalidStateTransition` | coordination非Pending或terminal identity重用 |

Start与六种typed replay block reason都是normal outcome；current P18 path实际可产生NoWriteGuardBlocked、RetentionHoldActive、ActiveReferenceProtection、ScopeSnapshotStale。evaluation不调用maintenance/resolver/repository/clock/writer；Blocked/error不创建job/claim/progress/violation/record/outbox。planned tests覆盖六exact rows及cross-effect、1/2/256 scope cardinality但每次只选one target、current lookup None/error/partial区分、approval-time/current state变化、P10三处exact equality、P17 Authorized/Blocked、Pending-only、Start empty changed set、Blocked no violation ref、scope iteration/job plan spies为零、completion不由P18触发，以及source/external/body/provider/run-id/evidence/signoff扫描。对象停审：`pass_R06.5-E_P18_design_only`。

## 53. R06.5-E 类型、owner 与构造闭环审计

### 53.1 66个new explicit type账

| group | count | exact content |
|---|---:|---|
| P13 shared + policy/decision | 12 | §46.1十个carrier + `DegradedOutputPolicy/Decision` |
| P14 shared + policy | 21 | §46.2二十个carrier + `PeripheralExportPolicy`；两个decision为existing extension |
| P15/P16 shared + policies/decision | 13 | §46.3十个carrier + P15 policy/decision + P16 policy |
| P17/P18 shared + policies/decisions | 20 | §46.4十六个carrier + P17/P18各自policy/decision |
| total unique `pub struct/enum` | 66 | 机械扫描范围§§46~52；不含impl、existing decision/object/authorization extension |

上表按对象族说明，authoritative机械账为：§46 shared carrier 56个；§§47~52新增policy/decision 10个；合计66。若分组展示文字与机械计数冲突，以56 + 10及逐名称registry为准，不能凭分组行数生成类型。

### 53.2 unique owner registry

| carrier group | unique logical owner | planned physical owner | duplicate-prevention gate |
|---|---|---|---|
| six policies、rule/material objects | `domain::policies` | `crates/domain/src/policies.rs` + private `material_v1` | 无`*PolicyId`、repository/config locator或contracts copy |
| P13 target/input/decision | `domain::gap` | `gap_degraded.rs` | persisted revision只由decision consumer创建；Query不写state |
| P14 input snapshots / existing decisions | `domain::peripheral` | `peripheral.rs` | preparation/delivery decision不互换；adapter result不是policy result |
| P15 input/decision | `domain::reference` | `reference.rs` | resolver result/record不等于decision；version relation非clock |
| P16 safe-output snapshot / structural guard | `domain::reference` + policy in `domain::policies` | `reference.rs` / `policies.rs` | success无marker/status/authorization |
| P17 target/dependency/input/decision/authorization | `domain::maintenance` | `maintenance.rs` | authorization canonical owner不是`domain::policies`；bare authorization不公开消费 |
| P18 input/decision | `domain::replay` | `retention_replay.rs` | one coordination/one target；scope iteration归R06.6 |

### 53.3 existing affected definition账

| existing canonical type/group | E批 authoritative delta | unique owner |
|---|---|---|
| `DegradedOutputState/Transition` | 增加exact affected object binding；factory/member只消费P13 decision | R06.4 `domain::gap` |
| `PeripheralDeliveryDecision`;`ExportPreparationDecision` | 增加P14 basis + respective complete input snapshot；既有output fields保留 | R06.4 `domain::peripheral` |
| `ReferenceSnapshotState` | public refresh入口改为P15 decision；Invalid恢复新identity | R06.4 `domain::reference` |
| `MaintenanceExecutionAuthorization` | owner统一`domain::maintenance`；只能位于P17 Authorized decision内公开消费 | R06.4 `domain::maintenance` |
| `ReplayCoordinationState` | public policy入口改为P18 complete decision；Blocked不伪造violation ref | R06.4 `domain::replay` |
| `PeripheralBlockReason` | 增加`EvidenceGap`;`RetentionHoldActive`，共六variant | R06.2 `contracts::metadata` |

## 54. R06.5-E complete snapshot、outcome 与零副作用总审计

### 54.1 complete snapshot / stale decision gate

| policy | complete binding dimensions | stale / cross-use rejected |
|---|---|---|
| P13 | object + visibility scope + P11 complete decision + explicit safety + all gap revisions | multi-object selector持久化、foreign gap/safety、old P11 basis |
| P14 | preparation或delivery + consumer + view + immutable input + gaps + retention/protection + P10 + optional P13 | preparation/delivery互换、old consumer/view/head、missing lookup |
| P15 | snapshot all fields + resolver result + adapter family + typed version relation + target + P10 | wall-clock relation、record-as-input、Invalid in-place recovery |
| P16 | adapter family + subject + summary owner + source-version stream | provider/product/raw body、success-as-Fresh |
| P17 | target + complete scope set + dependency namespaces/availability + mode/scope + P10 | caller bool、scope subset、bare auth、cross-mode reuse |
| P18 | coordination pre-state + Approved scope + one current target boundary + P17 + P10 | scope iteration、approval-time lookup、foreign target、changed refs |

### 54.2 expected outcome / error boundary

| policy | normal typed outcomes | never represented as normal outcome |
|---|---|---|
| P13 | Normal/Limited/Blocked | malformed target/safety/P11/gap relation |
| P14 | PendingEvidence/Ready/Degraded/Blocked；delivery Prepare/Blocked | lookup error、identity mismatch、external acceptance |
| P15 | Apply*/PreserveCurrent/RequireNewSnapshot | equal-version summary conflict、cross-stream comparator |
| P16 | structural success `()` | Fresh/Resolved/available/authorized status |
| P17 | Authorized/Blocked(NoWrite/Dependency) | source/external target、invalid target/effect pair |
| P18 | Start/Blocked | scope-wide approval、job success、source repair、changed target set |

### 54.3 zero-side-effect gate

| phase | permitted effect | explicitly zero |
|---|---|---|
| six policy factories/evaluations | construct immutable policy/decision or return typed error | repository、clock、id generator、resolver、adapter、state、record、outbox、job/claim |
| P13 Query consumption | response-only surface mapping | all durable write/state/record/idempotency |
| P13/P14/P15 owning member | accepted local state/revision + exact transition | external adapter、source truth、record/outbox before same-UoW join |
| P17 Authorized | process-local decision/authorization only | maintenance execution、cursor/progress/plan/claim/state |
| P18 Start/Blocked apply | Pending -> Coordinating/Blocked transition only | actual target effect、changed refs、violation ref、H13/job report |

## 55. R06.5-E affected-only 传播清单

| affected location | E批 delta | current action |
|---|---|---|
| R06.4 degraded/peripheral/reference/maintenance/replay | exact affected definitions与public consumption入口 | 本批同步R06.4 §22；早期扁平签名降historical |
| R06.2 contracts | `PeripheralBlockReason`六variant及E批owner registry | 本批同步contracts §26 |
| frozen Step07 | complete target-scope/dependency/current lookup、P16/P17/P18 input assembly port evidence | affected-only；R06.8后逐trait review，不在E批修改 |
| frozen Step08 | caller-supplied status/freshness/authorization fields不得出现 | affected-only；逐协议重组时修复 |
| frozen Step09 | old `assert_*`、bare authorization、record-as-policy-input、scope-wide replay flow | affected-only；逐flow rewrite时消费E批decision |
| frozen Step10/11/12 | trigger、new identity、same-UoW/CAS、error mapping | affected-only；保持冻结 |
| R06.5 G records | H8/H9/H10/H11/H12/H13消费accepted transition/item result | 只登记输入；不得在E批定义record schema或writer |

## 56. R06.5-E 自检、blocker 与停止点

### 56.1 object stop-review summary

| policy | schema/signature | complete snapshot | outcome/error | zero side effect | result |
|---|---|---|---|---|---|
| P13 DegradedOutput | pass | pass：exact target + P11/safety/gaps | pass：120 keys | pass Query/no write | `pass_R06.5-E_P13_design_only` |
| P14 PeripheralExport | pass two-entry | pass：prep/delivery/current lookup | pass：40/4/4 | pass no adapter verdict | `pass_R06.5-E_P14_design_only` |
| P15 ReferenceFreshness | pass | pass：snapshot/result/version/target/P10 | pass：180 keys | pass no resolver/record auth | `pass_R06.5-E_P15_design_only` |
| P16 AdapterBoundary | pass structural | pass：family/subject/summary/version | pass：13 family | pass no marker/status | `pass_R06.5-E_P16_design_only` |
| P17 DerivedMaintenance | pass | pass：target/scopes/dependencies/mode/P10 | pass：4 pairs | pass no execution | `pass_R06.5-E_P17_design_only` |
| P18 ReplayCoordination | pass | pass：one coordination/scope/target/current boundary/P17/P10 | pass：6 rows | pass no plan/changed refs | `pass_R06.5-E_P18_design_only` |

### 56.2 E批 gate

| gate | conclusion |
|---|---|
| six independent policy cards | pass；§§47~52，不以family table替代 |
| new explicit type account | pass；56 shared + 10 policy/decision = 66，机械扫描确认名称唯一且无重复声明 |
| existing affected definitions | pass；R06.4 §22与R06.2 §26已同步，旧裸decision/result/authorization入口降historical private-helper |
| material cardinality | pass design：120；40/4/4；180；13；4；6，无default/wildcard |
| complete snapshot | pass；target/scope/version/dependency/current lookup均不可省略 |
| owner conflict | resolved in design：`MaintenanceExecutionAuthorization -> domain::maintenance` |
| business truth / body-free | pass；不反写source/external/business truth，不保存raw body/provider material |
| fabricated evidence | none；未生成commit/run id/evidence alias/verdict/signoff/test result |
| external upstream blocker | none |
| internal blocker at E checkpoint | `03-RPR-S06-GRANULARITY=open`；当时P1~P18 policy已闭口，但H1~H13及R06.6~R06.8仍未完成 |
| historical checkpoint | `R06.5-E_done_waiting_user`；已由F批消费 |
| historical next allowed | 只进入`R06.5-F H1~H7`；已消费，不再是current action |

### 56.3 R06.5-F 阅读清单（已由F批消费）

1. 本专项§§7/9/14/16/17及H1~H7 inventory，复核三输入factory、typed metadata与append-only红线。
2. R06.3七个transition与post-state、R06.4 handoff/retention/no-write/read transition和P1~P12 decision basis。
3. 概要H1~H7 candidate records及冻结Step07/09/11 persistence affected use，只作冲突诊断。
4. L1逐record卡字段/source/factory/append-only粒度，只作参考，不复制相邻域truth。

用户已确认进入F批；本清单只保留为input evidence，不再是current停止门禁。current门禁见§57及后续F批对象卡；仍不得读取或写R06.5-G、R06.6~R06.8、Step07~19、formal`03`、任何`04`或实现代码。当前不需要提交。

## 57. R06.5-F 输入、范围与 record authority 裁定

### 57.1 F批执行边界（historical，已由G批消费）

| 项 | historical裁定 |
|---|---|
| historical范围 | 只闭口H1~H7七个append-only record、F批专属tagged source/change/reason/accepted-input/post-state carrier，以及被三输入factory直接暴露的existing delta最小affected sync |
| historical非范围 | H8~H13、application writer/UoW、repository trait/DDL/index、outbox、protocol、flow、状态矩阵、formal `03`、任何`04`或实现代码 |
| authority | R06.3/R06.4 current transition与same-UoW post-state > 概要record骨架；P1~P12 target-bound decision只作为accepted mutation basis，不成为record truth owner |
| 外部上游 blocker | `none`；正式00/01/02已经固定七个record主语及append-only/no-business-truth边界 |
| historical material | 概要`*RecordId`、aggregate-only factory、`summarize() -> String`、同步Query写H7、generic history row均不沿用 |
| historical checkpoint | `R06.5-F_done_waiting_user`；已由G批消费 |
| historical stopping rule | 当时等待用户审查；已解除，不再是current gate |

### 57.2 已读取输入与使用结论

| 输入 | F批使用结论 |
|---|---|
| 本专项§§7/9/14/16/17 | 复用13个typed record ref中的H1~H7 identity、typed metadata、12类construction mismatch、append-only三输入factory与transition total mapping红线 |
| R06.3 receipt/safety/correlation/signal | H1消费receipt/safety tagged transition；H2直接消费context transition，仅消费明确改变correlation解释的signal transition |
| R06.3 audit/evidence | H3消费projection或linkage tagged transition；projection branch复用`AuditAppendKind`，linkage branch不能伪装成projection append |
| R06.4 handoff/authenticity | H4分别保存handoff lifecycle与same-handoff authenticity hint变化；Delivered只表示local delivery fact |
| R06.4 retention/protection/no-write | H5保存marker/protection两个tagged subject；H6只保存已成立violation transition，不从P10 blocked decision伪造violation |
| R06.4 read + P11/P10 | H7 schema保留，但current synchronous Query无state/transition/record writer、无id mint、无UoW或cursor分配 |
| 概要H1~H7 | 仅保留业务责任；`record_id`统一替换为B批typed ref，aggregate-only factory与过短字段集降historical |
| frozen Step07/09/11 | 只用于确认append port、same-UoW与cursor affected use；不作为schema definition owner，不在F批修改 |
| L1参考 | 只参考逐record卡、字段来源与append-only测试粒度；不复制相邻域actor/truth/trace模型 |

### 57.3 三输入factory与持久化共同规则

每个factory的exact语义固定为：`from_accepted(accepted_input, same_uow_post_state, ObservationRecordMetadata<ExactRecordRef>) -> Result<Record, DomainError>`。accepted input可以是具名tagged enum，并可借用驱动该transition的target-bound decision；它仍只属于第一类“successful accepted change”，不得另加repository current state或自由文本。post-state必须是同一次内存mutation后的对象；metadata必须在同一accepted UoW内由application准备。

| 检查顺序 | mismatch | 固定行为 |
|---:|---|---|
| 1 | `AcceptedInputKind` | transition branch不属于本record、reserved branch被current writer调用或tagged source/post-state不配对；立即返回且不读取可选payload |
| 2 | `RecordRef` / `Origin` | 对携带预留record ref的H3，metadata exact ref不匹配transition；其他family的typed ref不是本次operation预留值，或writer lane不在branch allowlist |
| 3 | `Subject` / `Target` | transition、decision、post-state的owning identity/relation不一致 |
| 4 | `FromState` / `ToState` | transition payload不满足owning state matrix，或variant固定target错误 |
| 5 | `PostState` / `Reason` | post-state conditional fields、cleared fields、typed reason/evidence与delta/decision不一致 |
| 6 | `AuditVisibility` | requested record exposure超过branch允许上限；不得自动降级后继续 |
| 7 | `CommittedCursor` / `CursorNamespace` | H1~H7 accepted append均要求`Some(ObservationCommittedCursor::Observation(_))`；None或Reference一律拒绝 |

record factory不分配identity/time/cursor，不调用policy、repository、adapter、clock、outbox或另一个aggregate member。所有字段一次构造后只提供typed inspection；无`update/delete/mark/attach/retry/transition`，无serde default、builder、generic conversion或free-form summary。persistence mapper可flatten `ObservationRecordMetadata<R>`，但必须保留exact typed ref discriminator、origin、actor、recorded time、trace/causation、visibility和tagged cursor。

### 57.4 F批 policy-basis copy rule

只有transition确由P1~P12 target-bound decision驱动时，record才复制该decision的完整`PolicyEvaluationBasis`；direct aggregate member变化使用明确的`None`或direct tagged branch。record不得接收裸`PolicyBasisRef`、最近一次policy basis、policy object或config binding。多policy accepted path必须逐一具名保存，不能折叠为unordered set：H1 receipt branch保存P1 admission + P2 safety basis，H1 safety branch只保存P2；H2只有`SignalRecorded` branch保存P3，direct `SignalRevalidated`与context branch固定None；H3 visibility/linkage decision branch只保存P5；H4 readiness branch保存P7、authenticity branch保存P6；H5 policy reconciliation branch保存P8；H6 direct violation lifecycle不复制P10，因为P10 decision只解释attempt boundary而不驱动violation member；H7 future envelope保存P11和嵌套P10 basis。

`PolicyEvaluationBasis`进入record只证明accepted mutation使用了哪个immutable local rule snapshot，不证明业务授权、source truth、外部验收、真实性、修复或signoff。record不保存decision complete snapshot、rule material、locator或policy body。

## 58. H1 `IntakeDecisionRecord`

### 58.1 capability / subject boundary

H1记录同一intake链上的两种不同accepted change：`ObservationReceiptTransition`和`SafetyDispositionTransition`。persisted主语始终锚定`ObservationReceiptRef`，但`source`必须tagged区分receipt admission与其exact safety disposition；禁止把safety state写进receipt state或仅凭terminal aggregate重建reason。一个same-UoW safety mutation与后续receipt admission mutation各生成一条H1 record，使用两个不同`IntakeDecisionRecordRef`；它们可共享trace/causation/cursor，但不得共享PK或合并成一个row。共享cursor只证明原子提交，不定义intra-UoW total order；safety-first因果由receipt decision的完整disposition snapshot、两个transition和post-state关系证明，reader不得按record ref或timestamp猜顺序。

### 58.2 exact support carrier

```rust
/// Exact intake object whose accepted change is recorded by H1.
pub enum IntakeDecisionSource {
    Receipt,
    SafetyDisposition(SafetyDispositionRef),
}

/// Finite accepted change written by one intake-decision record.
pub enum IntakeDecisionChangeKind {
    ReceiptAccepted,
    ReceiptRejected,
    ReceiptQuarantined,
    ReceiptDegraded,
    ReceiptSuperseded,
    SafetyMarkedSafe,
    SafetyMarkedRedacted,
    SafetyRejectedUnsafe,
    SafetyQuarantined,
}

/// Typed explanatory payload retained only when the selected change requires one.
pub enum IntakeDecisionReason {
    IntakeRejected(IntakeRejectReason),
    Quarantined(QuarantineReason),
    Degraded(DegradedReason),
    ForbiddenBody(ForbiddenBodyKind),
}

/// Exact immutable policy bases that drove the selected intake branch.
pub enum IntakeDecisionPolicyBasis {
    Admission {
        admission: PolicyEvaluationBasis,
        safety: PolicyEvaluationBasis,
    },
    Safety {
        safety: PolicyEvaluationBasis,
    },
    Direct,
}
```

| carrier | exact invariant |
|---|---|
| `IntakeDecisionSource` | Receipt branch没有disposition subject；Safety branch必须保存exact disposition ref且其`receipt_ref`等于record receipt |
| `IntakeDecisionChangeKind` | 九个variant与两个transition enum的5+4 variant一一对应；Superseded有schema但current owning member reserved，因此无current producer |
| `IntakeDecisionReason` | accepted/safe/redacted/superseded固定None；reject/quarantine/degraded/unsafe固定对应Some；不保存message、body、hash或provider detail |
| `IntakeDecisionPolicyBasis` | Admission branch必须分别为P1/P2 family，Safety branch必须为P2；两个basis不要求identity相同，也不能互换；Direct只保留给phase-reserved Superseded |

### 58.3 accepted input / same-UoW post-state

```rust
/// Successful intake change and the decisions whose bindings were consumed.
pub enum IntakeDecisionAcceptedInput<'a> {
    ReceiptAdmission {
        transition: &'a ObservationReceiptTransition,
        admission_decision: &'a AdmissionDecision,
        safety_decision: &'a SafetyDispositionDecision,
    },
    ReceiptSuperseded {
        transition: &'a ObservationReceiptTransition,
    },
    SafetyDisposition {
        transition: &'a SafetyDispositionTransition,
        safety_decision: &'a SafetyDispositionDecision,
    },
}

/// Exact post-mutation state matching the selected H1 accepted-input branch.
pub enum IntakeDecisionPostState<'a> {
    ReceiptAdmission {
        receipt: &'a ObservationReceipt,
        disposition: &'a SafetyDisposition,
    },
    ReceiptSuperseded(&'a ObservationReceipt),
    SafetyDisposition(&'a SafetyDisposition),
}
```

ReceiptAdmission要求post-state同时提供receipt与disposition；不能直接调用`admission_decision.applies_to(post_receipt, post_disposition)`，因为decision snapshot是receipt pre-state。factory改为校验decision内complete pre-snapshot与transition `from`、decision kind与transition payload、disposition snapshot与P2 post-state证明，并校验post receipt的immutable fields不变、state/optional disposition等于delta target。ReceiptSuperseded只接受Superseded transition/post-state并使用Direct basis，当前phase在record construction前返回ReservedTransition。Safety branch调用P2的post-state证明语义，并校验transition payload与decision kind全等。records module通过owning modules的`pub(crate)` inspection读取complete snapshot；不新增public DTO accessor或serde。

### 58.4 exact record schema

```rust
/// Append-only audit history for one accepted intake or safety decision change.
pub struct IntakeDecisionRecord {
    metadata: ObservationRecordMetadata<IntakeDecisionRecordRef>,
    receipt_ref: ObservationReceiptRef,
    source: IntakeDecisionSource,
    change_kind: IntakeDecisionChangeKind,
    before: IntakeDecisionRevision,
    change: IntakeDecisionChange,
    after: IntakeDecisionRevision,
    reason: Option<IntakeDecisionReason>,
    policy_basis: IntakeDecisionPolicyBasis,
}

pub enum IntakeDecisionChange {
    ReceiptAccepted {
        disposition_ref: SafetyDispositionRef,
    },
    ReceiptRejected {
        reason: IntakeRejectReason,
    },
    ReceiptQuarantined {
        reason: QuarantineReason,
    },
    ReceiptDegraded {
        reason: DegradedReason,
    },
    ReceiptSuperseded {
        replacement_ref: ObservationReceiptRef,
    },
    SafetyMarkedSafe {
        summary_ref: SafeSignalSummaryRef,
    },
    SafetyMarkedRedacted {
        summary_ref: SafeSignalSummaryRef,
    },
    SafetyRejectedUnsafe {
        evidence: ForbiddenBodyEvidence,
    },
    SafetyQuarantined {
        reason: QuarantineReason,
        evidence: Option<ForbiddenBodyEvidence>,
    },
}

pub enum IntakeDecisionRevision {
    Receipt(IntakeReceiptRevision),
    SafetyDisposition(IntakeSafetyRevision),
}

pub struct IntakeReceiptRevision {
    receipt_ref: ObservationReceiptRef,
    source_ref: ObservationSourceRef,
    admission_state: ObservationReceiptState,
    safety_disposition_ref: Option<SafetyDispositionRef>,
    submission_purpose: SubmissionPurpose,
    received_at: ObservedAt,
}

pub struct IntakeSafetyRevision {
    disposition_ref: SafetyDispositionRef,
    receipt_ref: ObservationReceiptRef,
    state: SafetyDispositionState,
    redaction_marker: RedactionMarker,
    forbidden_body: ForbiddenBodyFlag,
    sanitized_summary_ref: Option<SafeSignalSummaryRef>,
}
```

| field | exact source | invariant |
|---|---|---|
| `metadata` | typed application operation context | origin只可Command/InboundConsumer；cursor必须Observation；record ref不得等于任何subject ref |
| `receipt_ref` | decision complete snapshot + post-state | 三者exact；不从disposition或source raw value派生 |
| `source` | accepted input tag | Safety variant保存exact disposition ref；Receipt variant不伪造disposition subject |
| `change_kind` | transition variant total match | 不从after state推导；同一target不同reason仍保留exact kind/reason |
| `before` | decision/transition pre-snapshot | 完整receipt或safety body-free revision；tag与source一致 |
| `change` | accepted transition的owned finite payload | 与change kind一一对应；不持有borrowed transition、opaque bytes或free string |
| `after` | transition fixed target + post-state | 完整same-UoW revision；不接受caller state参数 |
| `reason` | transition/decision typed payload | 按§58.5矩阵；无`Other(String)`或empty reason |
| `policy_basis` | accepted decisions | exact P1/P2 basis copy；不保存decision或policy material |

metadata audit visibility上限：ReceiptAccepted/ReceiptDegraded/SafetyMarkedSafe/SafetyMarkedRedacted可为`AuditTimelineEligible`；ReceiptRejected/ReceiptQuarantined/SafetyRejectedUnsafe/SafetyQuarantined最多`OperationsOnly`；reserved ReceiptSuperseded最多`AuditTimelineEligible`。所有branch允许更窄`InternalOnly`；不允许caller越级。

### 58.5 transition / field total matrix

| accepted transition | change / after | reason | conditional fields |
|---|---|---|---|
| Receipt Accepted | `ReceiptAccepted` / Receipt(Accepted) | None | after disposition=Some exact post ref；change无reason/evidence/replacement |
| Receipt Rejected | `ReceiptRejected` / Receipt(Rejected) | Some IntakeRejected | after disposition None；change reason exact |
| Receipt Quarantined | `ReceiptQuarantined` / Receipt(Quarantined) | Some Quarantined | after disposition None；P2 evidence仍只在独立Safety record |
| Receipt Degraded | `ReceiptDegraded` / Receipt(Degraded) | Some Degraded | after disposition None |
| Receipt Superseded | `ReceiptSuperseded` / Receipt(Superseded) | None | change replacement Some且不等于receipt；Direct basis；current phase无producer |
| Safety MarkedSafe | `SafetyMarkedSafe` / Safety(Safe) | None | after summary Some/marker Clean/flag NotDetected |
| Safety MarkedRedacted | `SafetyMarkedRedacted` / Safety(Redacted) | None | after summary Some/marker Redacted/flag NotDetected |
| Safety RejectedUnsafe | `SafetyRejectedUnsafe` / Safety(Rejected) | Some ForbiddenBody(kind) | change evidence Some exact；after summary None/flag Detected |
| Safety Quarantined | `SafetyQuarantined` / Safety(Quarantined) | Some Quarantined | change evidence Some iff reason ForbiddenBodyDetected；after summary None |

Receipt branch还要求`AdmissionDecisionKind`与transition一一相等，P1 disposition snapshot等于P2 accepted post-state；Safety branch要求`SafetyDispositionDecisionKind`与transition一一相等。任何payload mismatch返回`RecordConstructionMismatch(Reason)`，post optional matrix不一致返回`PostState`，错误不降级成较少字段的record。

### 58.6 factory / inspection / append-only boundary

```rust
impl IntakeDecisionRecord {
    pub fn from_accepted(
        accepted: IntakeDecisionAcceptedInput<'_>,
        post_state: IntakeDecisionPostState<'_>,
        metadata: ObservationRecordMetadata<IntakeDecisionRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<IntakeDecisionRecordRef>,
        receipt_ref: ObservationReceiptRef,
        source: IntakeDecisionSource,
        change_kind: IntakeDecisionChangeKind,
        before: IntakeDecisionRevision,
        change: IntakeDecisionChange,
        after: IntakeDecisionRevision,
        reason: Option<IntakeDecisionReason>,
        policy_basis: IntakeDecisionPolicyBasis,
    ) -> Result<Self, DomainError>;

    pub fn metadata(&self) -> &ObservationRecordMetadata<IntakeDecisionRecordRef>;
    pub fn receipt_ref(&self) -> &ObservationReceiptRef;
    pub fn source(&self) -> &IntakeDecisionSource;
    pub fn change_kind(&self) -> IntakeDecisionChangeKind;
    pub fn before(&self) -> &IntakeDecisionRevision;
    pub fn change(&self) -> &IntakeDecisionChange;
    pub fn after(&self) -> &IntakeDecisionRevision;
    pub fn reason(&self) -> Option<&IntakeDecisionReason>;
    pub fn policy_basis(&self) -> &IntakeDecisionPolicyBasis;
}

impl IntakeReceiptRevision {
    pub fn try_rehydrate(
        receipt_ref: ObservationReceiptRef,
        source_ref: ObservationSourceRef,
        admission_state: ObservationReceiptState,
        safety_disposition_ref: Option<SafetyDispositionRef>,
        submission_purpose: SubmissionPurpose,
        received_at: ObservedAt,
    ) -> Result<Self, DomainError>;

    pub fn receipt_ref(&self) -> &ObservationReceiptRef;
    pub fn source_ref(&self) -> &ObservationSourceRef;
    pub fn admission_state(&self) -> ObservationReceiptState;
    pub fn safety_disposition_ref(&self) -> Option<&SafetyDispositionRef>;
    pub fn submission_purpose(&self) -> SubmissionPurpose;
    pub fn received_at(&self) -> &ObservedAt;
}

impl IntakeSafetyRevision {
    pub fn try_rehydrate(
        disposition_ref: SafetyDispositionRef,
        receipt_ref: ObservationReceiptRef,
        state: SafetyDispositionState,
        redaction_marker: RedactionMarker,
        forbidden_body: ForbiddenBodyFlag,
        sanitized_summary_ref: Option<SafeSignalSummaryRef>,
    ) -> Result<Self, DomainError>;

    pub fn disposition_ref(&self) -> &SafetyDispositionRef;
    pub fn receipt_ref(&self) -> &ObservationReceiptRef;
    pub fn state(&self) -> SafetyDispositionState;
    pub fn redaction_marker(&self) -> RedactionMarker;
    pub fn forbidden_body(&self) -> ForbiddenBodyFlag;
    pub fn sanitized_summary_ref(&self) -> Option<&SafeSignalSummaryRef>;
}
```

没有`record_decision(receipt, kind, reason)`、`summarize() -> String`、update/delete/correction member。factory不修改receipt/disposition，不调用policy或append port；application必须在aggregate save与record append同一UoW内处理，任一factory/append/CAS失败使两个state mutation、两条H1 record、cursor/outbox全部rollback。correction需未来具名supersession record，不能改旧H1 row。

### 58.7 error / planned tests / stop review

| mismatch | H1 exact trigger |
|---|---|
| `AcceptedInputKind` | Receipt input配Safety post、非H1 transition、current writer尝试reserved Superseded或branch tag错误 |
| `Subject` / `Target` | receipt/disposition/source relation不一致、P1/P2 decision跨object复用 |
| `FromState` / `ToState` | delta from不等于decision pre-state、variant target与post state不一致 |
| `PostState` / `Reason` | summary/marker/flag/evidence/replacement/optional disposition矩阵不成立 |
| `Origin` / visibility / cursor | 非Command/InboundConsumer、negative safety branch请求timeline、cursor None/Reference |

planned tests覆盖9 variant schema totality、当前8 callable variant、P1/P2 basis family与cross-basis、safety-first/receipt-second同UoW两record不同PK、all marker/flag/summary/evidence组合、negative visibility cap、origin/cursor、factory error zero record/append、rollback不可见，以及raw body/locator/credential/provider payload/real run id/evidence alias/verdict/signoff字段与Debug扫描。对象停审：`pass_R06.5-F_H1_design_only`。

## 59. H2 `CorrelationLinkRecord`

### 59.1 capability / subject boundary

H2记录一个`CorrelationContext`的accepted binding、partial、invalid变化，或一个被明确标记为correlation linkage的safe signal accepted变化。record主语固定为`CorrelationContextRef`；signal不是第二主语，而是被tagged为该context的linkage evidence。`SafeSignalTransition`只有在same-UoW application已经证明signal的`correlation_context_ref`、loaded context revision和linkage effect完全一致时才可进入H2。普通signal记录、suppression、staleness和rollup变化不自动生成H2。

### 59.2 exact support carrier

```rust
/// Source object whose accepted change is represented by H2.
pub enum CorrelationLinkSource {
    Context,
    Signal {
        signal_ref: SafeSignalRef,
        linkage_effect: CorrelationSignalLinkageEffect,
    },
}

/// Finite change kind for a correlation-context or explicit signal-link branch.
pub enum CorrelationLinkChangeKind {
    SeedBound,
    RuntimeSignalLinked,
    CorrelationDegraded,
    CorrelationInvalidated,
    SignalRecorded,
    SignalRevalidated,
}

/// Typed reason carried only by a degraded or invalidated context branch.
pub enum CorrelationLinkReason {
    Gap(CorrelationGapReason),
    Invalid(CorrelationInvalidReason),
}

/// Explicit application-side proof that a signal transition is a correlation link.
pub enum CorrelationSignalLinkageEffect {
    Recorded,
    Revalidated,
}

```

`CorrelationSignalLinkageEffect`不是policy decision、correlation authorization或signal state替代；它只能由application从loaded signal/context relation和明确的flow branch组装，不能由record factory从signal kind或context ref猜出。`Suppressed`、`MarkedStale`和其他未列出的signal branch必须选择`explicit_no_record`，不能传入H2 factory。

### 59.3 affected transition snapshot closure

为使H2不从current context猜before fields，R06.3 §9.17是`CorrelationContextTransitionSnapshot`的唯一Rust definition owner；H2只import并消费该type，不在`domain::records`重复声明。`CorrelationContextTransition`各variant新增`previous: CorrelationContextTransitionSnapshot`，并由owning member在accepted mutation前复制；`SeedBound`的variant payload仍是after active bindings，`RuntimeSignalLinked`保留previous runtime ref，`Degraded/Invalidated`保留被清除或保留的pending/relation字段。snapshot的`context_ref/receipt_ref/source_ref`必须与same-UoW post-state exact，fields为private，不新增public rehydrate或free constructor。该affected sync只补足record可审计性，不改变state machine、owner或current member签名语义。

signal linkage不修改`CorrelationContext`，所以H2的signal branch使用明确的`CorrelationSignalLinkageEffect`，并把context revision作为unchanged before/after relation；没有effect tag时不得把所有safe signal transition复制成H2。

### 59.4 accepted input / same-UoW post-state

```rust
pub enum CorrelationLinkAcceptedInput<'a> {
    Context {
        transition: &'a CorrelationContextTransition,
    },
    SignalRecorded {
        transition: &'a SafeSignalTransition,
        signal_decision: &'a SignalDecision,
    },
    SignalRevalidated {
        transition: &'a SafeSignalTransition,
    },
}

pub enum CorrelationLinkPostState<'a> {
    Context(&'a CorrelationContext),
    Signal {
        signal: &'a SafeSignal,
        context: &'a CorrelationContext,
    },
}
```

Context branch要求transition previous snapshot与post context的immutable identity exact、transition target/state/active fields exact。`SignalRecorded`只接受`SafeSignalTransition::Recorded`和P3 `SignalDecisionKind::Record`，basis family必须SafeSignal；`SignalRevalidated`只接受direct `SafeSignalTransition::Revalidated`且policy basis固定None，不得借用aggregate中旧decision。两个signal branch都要求transition subject、post signal state/summary/context ref和loaded context revision exact。Signal branch不允许`signal.context_ref != context.context_ref`、Partial/Invalid relation未经explicit P3 decision允许或`Suppressed/MarkedStale`映射为link。

### 59.5 exact record schema

```rust
pub struct CorrelationLinkRecord {
    metadata: ObservationRecordMetadata<CorrelationLinkRecordRef>,
    context_ref: CorrelationContextRef,
    receipt_ref: ObservationReceiptRef,
    source_ref: ObservationSourceRef,
    source: CorrelationLinkSource,
    change_kind: CorrelationLinkChangeKind,
    before: CorrelationLinkRevision,
    change: CorrelationLinkChangePayload,
    after: CorrelationLinkRevision,
    reason: Option<CorrelationLinkReason>,
    policy_basis: Option<PolicyEvaluationBasis>,
}

pub enum CorrelationLinkChangePayload {
    SeedBound {
        trace_ref: Option<TraceCorrelationRef>,
        causation_ref: Option<CausationRef>,
        subject_ref: Option<SubjectObservationReference>,
        runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
    },
    RuntimeSignalLinked {
        runtime_signal_ref: RuntimeSandboxSignalRef,
    },
    CorrelationDegraded {
        reason: CorrelationGapReason,
    },
    CorrelationInvalidated {
        reason: CorrelationInvalidReason,
    },
    SignalRecorded {
        signal_ref: SafeSignalRef,
        summary_ref: SafeSignalSummaryRef,
    },
    SignalRevalidated {
        signal_ref: SafeSignalRef,
        previous_summary_ref: SafeSignalSummaryRef,
        current_summary_ref: SafeSignalSummaryRef,
    },
}

pub enum CorrelationLinkRevision {
    Context(CorrelationContextRecordRevision),
    Signal(SafeSignalLinkRevision),
}

pub struct CorrelationContextRecordRevision {
    state: CorrelationContextState,
    pending_seed: Option<CorrelationSeed>,
    trace_ref: Option<TraceCorrelationRef>,
    causation_ref: Option<CausationRef>,
    subject_ref: Option<SubjectObservationReference>,
    runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
}

pub struct SafeSignalLinkRevision {
    signal_ref: SafeSignalRef,
    signal_kind: SafeSignalKind,
    state: SafeSignalState,
    summary_ref: SafeSignalSummaryRef,
    runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
    context: CorrelationContextRecordRevision,
}
```

`CorrelationLinkRevision`是tagged record-internal body-free snapshot，不是新的truth object、public DTO或持久化独立表。Context branch的previous revision直接来自transition previous snapshot，current revision来自post context。Signal branch的previous signal fields来自R06.3 `SafeSignalTransitionSnapshot`，current fields来自post signal；两边都嵌入同一个loaded context revision，证明signal relation没有偷换。`change`是从accepted transition lossless映射的owned finite payload，不持有borrow或opaque serialized transition；persistence mapper必须使用有限 discriminator并拒绝unknown/跨tag optional组合。

| field | source / invariant |
|---|---|
| `metadata` | origin只可Command/InboundConsumer；cursor必须Observation；visibility默认不超过AuditTimelineEligible |
| `context_ref`/receipt/source | current context post-state和transition snapshot exact；不从signal或trace token派生 |
| `source` | Context branch无signal；Signal branch保存exact signal ref和effect，不把signal ref当context ref |
| `change_kind` | Context四variant或Signal two-variant total mapping；不从after state猜 |
| `before/change/after` | before来自transition snapshot；change来自accepted transition；after来自same-UoW post-state；三者tag必须一致 |
| `reason` | 仅CorrelationDegraded/CorrelationInvalidated分别保存typed gap/invalid reason；SeedBound/RuntimeSignalLinked/Signal branches固定None |
| `policy_basis` | Signal policy branch为Some(P3 exact basis)；context direct lifecycle为None；不能复制最近一次P3 basis |

Audit visibility上限固定为：SeedBound、RuntimeSignalLinked、SignalRecorded、SignalRevalidated可`AuditTimelineEligible`；CorrelationDegraded、CorrelationInvalidated最多`OperationsOnly`。所有branch允许更窄`InternalOnly`，caller请求越级返回`RecordConstructionMismatch(AuditVisibility)`而不是静默降级。

### 59.6 transition / no-record total mapping

| accepted input | H2 mapping |
|---|---|
| `SeedBound` | `CorrelationLinkChangeKind::SeedBound`，after state Bound，保存active refs |
| `RuntimeSignalLinked` | `RuntimeSignalLinked`，state-preserving but runtime ref changes |
| `Degraded` | `CorrelationDegraded` + exact `CorrelationGapReason` |
| `Invalidated` | `CorrelationInvalidated` + exact `CorrelationInvalidReason` |
| `SafeSignalTransition::Recorded` + explicit Recorded effect | `SignalRecorded` + P3 basis if decision-driven |
| `SafeSignalTransition::Revalidated` + explicit Revalidated effect | `SignalRevalidated` + direct provenance；`policy_basis=None`；若未来由新P3 decision驱动，必须先扩展accepted-input schema，不能从aggregate历史字段猜basis |
| `SafeSignalTransition::Suppressed` | explicit_no_record；H2不记录抑制本身 |
| `SafeSignalTransition::MarkedStale` | explicit_no_record；由signal/reference record family承接，不伪造correlation change |

### 59.7 factory / append-only / tests

```rust
impl CorrelationLinkRecord {
    pub fn from_accepted(
        accepted: CorrelationLinkAcceptedInput<'_>,
        post_state: CorrelationLinkPostState<'_>,
        metadata: ObservationRecordMetadata<CorrelationLinkRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<CorrelationLinkRecordRef>,
        context_ref: CorrelationContextRef,
        receipt_ref: ObservationReceiptRef,
        source_ref: ObservationSourceRef,
        source: CorrelationLinkSource,
        change_kind: CorrelationLinkChangeKind,
        before: CorrelationLinkRevision,
        change: CorrelationLinkChangePayload,
        after: CorrelationLinkRevision,
        reason: Option<CorrelationLinkReason>,
        policy_basis: Option<PolicyEvaluationBasis>,
    ) -> Result<Self, DomainError>;

    pub fn metadata(&self) -> &ObservationRecordMetadata<CorrelationLinkRecordRef>;
    pub fn context_ref(&self) -> &CorrelationContextRef;
    pub fn receipt_ref(&self) -> &ObservationReceiptRef;
    pub fn source_ref(&self) -> &ObservationSourceRef;
    pub fn source(&self) -> &CorrelationLinkSource;
    pub fn change_kind(&self) -> CorrelationLinkChangeKind;
    pub fn before(&self) -> &CorrelationLinkRevision;
    pub fn change(&self) -> &CorrelationLinkChangePayload;
    pub fn after(&self) -> &CorrelationLinkRevision;
    pub fn reason(&self) -> Option<&CorrelationLinkReason>;
    pub fn policy_basis(&self) -> Option<&PolicyEvaluationBasis>;
}

impl CorrelationContextRecordRevision {
    pub fn try_rehydrate(
        state: CorrelationContextState,
        pending_seed: Option<CorrelationSeed>,
        trace_ref: Option<TraceCorrelationRef>,
        causation_ref: Option<CausationRef>,
        subject_ref: Option<SubjectObservationReference>,
        runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
    ) -> Result<Self, DomainError>;

    pub fn state(&self) -> CorrelationContextState;
    pub fn pending_seed(&self) -> Option<&CorrelationSeed>;
    pub fn trace_ref(&self) -> Option<&TraceCorrelationRef>;
    pub fn causation_ref(&self) -> Option<&CausationRef>;
    pub fn subject_ref(&self) -> Option<&SubjectObservationReference>;
    pub fn runtime_signal_ref(&self) -> Option<&RuntimeSandboxSignalRef>;
}

impl SafeSignalLinkRevision {
    pub fn try_rehydrate(
        signal_ref: SafeSignalRef,
        signal_kind: SafeSignalKind,
        state: SafeSignalState,
        summary_ref: SafeSignalSummaryRef,
        runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
        context: CorrelationContextRecordRevision,
    ) -> Result<Self, DomainError>;

    pub fn signal_ref(&self) -> &SafeSignalRef;
    pub fn signal_kind(&self) -> SafeSignalKind;
    pub fn state(&self) -> SafeSignalState;
    pub fn summary_ref(&self) -> &SafeSignalSummaryRef;
    pub fn runtime_signal_ref(&self) -> Option<&RuntimeSandboxSignalRef>;
    pub fn context(&self) -> &CorrelationContextRecordRevision;
}
```

factory必须先检查accepted tag、metadata ref/origin/cursor，再检查context/signal relation和transition previous snapshot，最后检查reason/basis。任何Mismatch返回对应`RecordConstructionMismatchKind`且不构造partial record。record无update/delete/attach/summarize、无signal/context mutation、无resolver/repository/adapter/clock调用。planned tests覆盖4 context + 2 signal accepted branch、all state/reason payload、signal effect缺失/错配、cross-context/signal/decision replay、previous snapshot完整性、explicit no-record mapping、origin/visibility/cursor、zero side effect与body/trace token/locator扫描。对象停审：`pass_R06.5-F_H2_design_only`。

## 60. H3 `AuditAppendRecord`

### 60.1 capability / subject boundary

H3记录两类本地审计投影变化：`AuditProjection`自己的source/linkage/gap/visibility append，以及某个projection所拥有的`EvidenceLinkage` body-free lifecycle变化。两类变化共享H3的typed `AuditAppendRecordRef`和audit visibility surface，但必须由`AuditAppendRecordSubject`显式标记；linkage branch不能伪造projection append head，projection branch不能把linkage state当作`AuditAppendKind`。

`AuditAppendKind`继续是R06.3唯一owner的projection/timeline finite classifier，仅用于`SourceFactAppended`、`EvidenceLinkageAppended`、`VisibilityRestricted`、`VisibilityRestored`、`GapAttached`。H3新增的`AuditLinkageChangeKind`只用于linkage branch。每个accepted transition最多映射一条H3 record；`EvidenceLinkageTransition`不同时生成H2，除非另有明确 correlation linkage effect，且该effect由H2 branch独立承接。

### 60.2 exact support carrier

```rust
/// Exact local subject represented by one audit-append record.
pub enum AuditAppendRecordSubject {
    Projection {
        projection_ref: AuditProjectionRef,
    },
    EvidenceLinkage {
        projection_ref: AuditProjectionRef,
        linkage_ref: EvidenceLinkageRef,
    },
}

/// Finite classifier for an evidence-linkage lifecycle change.
pub enum AuditLinkageChangeKind {
    Linked,
    BodyBlocked,
    NotVisible,
    MarkedStale,
}

/// Projection or linkage change kind; no free-string fallback.
pub enum AuditAppendRecordChangeKind {
    Projection(AuditAppendKind),
    EvidenceLinkage(AuditLinkageChangeKind),
}

/// Typed reason retained only for branches that carry a finite explanation.
pub enum AuditAppendReason {
    Visibility(EvidenceVisibilityReason),
    BodyBlocked(BodyBlockedReason),
    Stale(ReferenceStaleReason),
    Gap(GapStateRef),
}

/// Body-free before/after revision tagged by the owning audit subject.
pub enum AuditAppendRevision {
    Projection(AuditProjectionRevision),
    EvidenceLinkage(EvidenceLinkageRevision),
}

pub struct AuditProjectionRevision {
    projection_ref: AuditProjectionRef,
    subject_ref: AuditSubjectRef,
    correlation_context_ref: CorrelationContextRef,
    source_audit_ref: SourceAuditRef,
    source_audit_summary_ref: SafeExternalSummaryRef,
    state: AuditProjectionState,
    source_fact_appended: bool,
    latest_append_record_ref: Option<AuditAppendRecordRef>,
    linkage_refs: EvidenceLinkageRefSet,
    gap_refs: GapStateRefSet,
    visibility_reason: Option<EvidenceVisibilityReason>,
}

pub struct EvidenceLinkageRevision {
    linkage_ref: EvidenceLinkageRef,
    projection_ref: AuditProjectionRef,
    boundary_ref: GovernanceArtifactEvidenceReference,
    evidence_purpose: EvidenceConsumerPurpose,
    consumer_scope: EvidenceConsumerScope,
    state: EvidenceLinkageState,
    digest_summary: DigestSummary,
    visibility_reason: Option<EvidenceVisibilityReason>,
    body_blocked_reason: Option<BodyBlockedReason>,
}
```

`AuditProjectionRevision`和`EvidenceLinkageRevision`是`domain::records`内部的record snapshot carrier，不是新的truth object；它们由R06.3 canonical `AuditProjectionTransitionSnapshot` / `EvidenceLinkageTransitionSnapshot`与same-UoW post-state组装。字段private、无default/serde/public raw constructor。`AuditAppendReason::Gap`只保存typed gap ref，不把gap state或reason猜进append kind；GapAttached的完整gap revision由post-state/loaded gap scope在后续view中读取。

### 60.3 accepted input / same-UoW post-state

```rust
pub enum AuditAppendAcceptedInput<'a> {
    ProjectionSourceFact {
        transition: &'a AuditProjectionTransition,
    },
    ProjectionEvidenceLinkage {
        transition: &'a AuditProjectionTransition,
        linkage: &'a EvidenceLinkage,
    },
    ProjectionVisibility {
        transition: &'a AuditProjectionTransition,
        decision: &'a AuditProjectionVisibilityDecision,
    },
    ProjectionGap {
        transition: &'a AuditProjectionTransition,
        gap: &'a GapState,
    },
    LinkageLinked {
        transition: &'a EvidenceLinkageTransition,
        decision: &'a EvidenceVisibilityDecision,
    },
    LinkageNotVisible {
        transition: &'a EvidenceLinkageTransition,
        decision: &'a EvidenceVisibilityDecision,
    },
    LinkageBodyBlocked {
        transition: &'a EvidenceLinkageTransition,
    },
    LinkageMarkedStale {
        transition: &'a EvidenceLinkageTransition,
    },
}

pub enum AuditAppendPostState<'a> {
    Projection(&'a AuditProjection),
    EvidenceLinkage {
        projection: &'a AuditProjection,
        linkage: &'a EvidenceLinkage,
    },
}
```

Projection branches require `transition.previous` to be the pre-mutation projection revision and post `projection` to contain the exact target fields. `ProjectionVisibility` additionally requires the P5 global decision to match the transition branch and outcome; `ProjectionSourceFact`, `ProjectionEvidenceLinkage` and `ProjectionGap` are direct accepted mutations with no P5 basis. Linkage visibility branches require the P5 decision's complete linkage/projection snapshots and evaluated boundary/digest to match the transition and post-state. `LinkageBodyBlocked` and `LinkageMarkedStale` do not fabricate a P5 basis: the former is an accepted body-free boundary rejection, the latter is a reference-change transition.

`AuditProjectionTransition::append_record_ref` must equal `metadata.record_ref` for every projection branch. Linkage transitions have no append ref field; H3 metadata allocates an independent H3 record ref. In both cases a ref is consumed only after the owning transition succeeds; failed transition or factory does not create an append row.

### 60.4 exact record schema

```rust
pub struct AuditAppendRecord {
    metadata: ObservationRecordMetadata<AuditAppendRecordRef>,
    subject: AuditAppendRecordSubject,
    source_audit_ref: SourceAuditRef,
    source_audit_summary_ref: SafeExternalSummaryRef,
    change_kind: AuditAppendRecordChangeKind,
    before: AuditAppendRevision,
    change: AuditAppendChange,
    after: AuditAppendRevision,
    linkage_ref: Option<EvidenceLinkageRef>,
    gap_ref: Option<GapStateRef>,
    reason: Option<AuditAppendReason>,
    policy_basis: Option<PolicyEvaluationBasis>,
}

pub enum AuditAppendChange {
    Projection {
        append_kind: AuditAppendKind,
        append_record_ref: AuditAppendRecordRef,
        linkage_ref: Option<EvidenceLinkageRef>,
        gap_ref: Option<GapStateRef>,
    },
    EvidenceLinkage {
        change_kind: AuditLinkageChangeKind,
        previous_boundary_ref: GovernanceArtifactEvidenceReference,
        current_boundary_ref: GovernanceArtifactEvidenceReference,
        previous_digest: DigestSummary,
        current_digest: DigestSummary,
    },
}
```

| field | exact source / invariant |
|---|---|
| `metadata` | H3 ref exact；projection append origin允许Command/InboundConsumer/OperationsJob，linkage origin允许Command/InboundConsumer；cursor必须Observation |
| `subject` | projection subject ref或projection+linkage pair；不能只保存linkage ref而丢owner projection |
| source audit fields | projection post-state / linkage owner projection exact copy；body-free safe summary，不是source audit body |
| `change_kind`/`change` | projection复用R06.3 `AuditAppendKind`；linkage使用H3 finite kind；两者tag必须一致 |
| `before` | transition canonical previous snapshot；不从post-state或latest record反推 |
| `after` | same-UoW post projection/linkage complete revision；不接受caller state参数 |
| optional linkage/gap | only exact accepted branch；ProjectionEvidenceLinkage and Linkage branches have linkage; ProjectionGap has gap; others None |
| `reason` | Visibility/BodyBlocked/Stale/Gap matrix fixed；SourceFact/EvidenceLinkageAppended/Linked no reason |
| `policy_basis` | P5 basis only for ProjectionVisibility/LinkageLinked/LinkageNotVisible；direct/body-blocked/stale branches None |

Audit visibility上限固定为：五个projection append kind以及linkage Linked/NotVisible/MarkedStale可`AuditTimelineEligible`；linkage BodyBlocked最多`OperationsOnly`。实际timeline仍需独立read visibility decision；eligibility不等于可见或公开。所有branch允许`InternalOnly`，越级请求返回`RecordConstructionMismatch(AuditVisibility)`。

### 60.5 transition / field total matrix

| accepted transition | record kind | before/after | reason / basis |
|---|---|---|---|
| Projection `SourceFactAppended` | Projection(SourceFactAppended) | projection previous -> post projection | None / None |
| Projection `EvidenceLinkageAppended` | Projection(EvidenceLinkageAppended) | previous linkage set -> post set | None / None |
| Projection `VisibilityRestricted` | Projection(VisibilityRestricted) | previous visibility -> restricted post | Some Visibility / Some P5 global basis |
| Projection `VisibilityRestored` | Projection(VisibilityRestored) | restricted previous -> appended post | None / Some P5 global basis |
| Projection `GapAttached` | Projection(GapAttached) | previous gap set -> post set | Some Gap(gap ref) / None |
| Linkage `Linked` | EvidenceLinkage(Linked) | previous Candidate/Stale/NotVisible -> post Linked | None / Some P5 linkage basis |
| Linkage `BodyBlocked` | EvidenceLinkage(BodyBlocked) | previous Candidate -> post BodyBlocked | Some BodyBlocked / None |
| Linkage `NotVisible` | EvidenceLinkage(NotVisible) | previous state/reason -> post NotVisible | Some Visibility / Some P5 linkage basis |
| Linkage `MarkedStale` | EvidenceLinkage(MarkedStale) | previous Linked/NotVisible -> post Stale | Some Stale / None |

`VisibilityRestricted` and `VisibilityRestored` never carry a linkage or gap ref. `GapAttached` never changes projection lifecycle and must preserve previous/current state equality. `BodyBlocked` never stores forbidden body material; its reason is only the finite `BodyBlockedReason` from the transition. A linkage branch cannot use `AuditAppendKind::EvidenceLinkageAppended`, because that kind denotes a projection's append operation and would make timeline assembly ambiguous.

### 60.6 factory / inspection / append-only boundary

```rust
impl AuditAppendRecord {
    pub fn from_accepted(
        accepted: AuditAppendAcceptedInput<'_>,
        post_state: AuditAppendPostState<'_>,
        metadata: ObservationRecordMetadata<AuditAppendRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<AuditAppendRecordRef>,
        subject: AuditAppendRecordSubject,
        source_audit_ref: SourceAuditRef,
        source_audit_summary_ref: SafeExternalSummaryRef,
        change_kind: AuditAppendRecordChangeKind,
        before: AuditAppendRevision,
        change: AuditAppendChange,
        after: AuditAppendRevision,
        linkage_ref: Option<EvidenceLinkageRef>,
        gap_ref: Option<GapStateRef>,
        reason: Option<AuditAppendReason>,
        policy_basis: Option<PolicyEvaluationBasis>,
    ) -> Result<Self, DomainError>;

    pub fn metadata(&self) -> &ObservationRecordMetadata<AuditAppendRecordRef>;
    pub fn subject(&self) -> &AuditAppendRecordSubject;
    pub fn source_audit_ref(&self) -> &SourceAuditRef;
    pub fn source_audit_summary_ref(&self) -> &SafeExternalSummaryRef;
    pub fn change_kind(&self) -> AuditAppendRecordChangeKind;
    pub fn before(&self) -> &AuditAppendRevision;
    pub fn change(&self) -> &AuditAppendChange;
    pub fn after(&self) -> &AuditAppendRevision;
    pub fn linkage_ref(&self) -> Option<&EvidenceLinkageRef>;
    pub fn gap_ref(&self) -> Option<&GapStateRef>;
    pub fn reason(&self) -> Option<&AuditAppendReason>;
    pub fn policy_basis(&self) -> Option<&PolicyEvaluationBasis>;
}

impl AuditProjectionRevision {
    pub fn try_rehydrate(
        projection_ref: AuditProjectionRef,
        subject_ref: AuditSubjectRef,
        correlation_context_ref: CorrelationContextRef,
        source_audit_ref: SourceAuditRef,
        source_audit_summary_ref: SafeExternalSummaryRef,
        state: AuditProjectionState,
        source_fact_appended: bool,
        latest_append_record_ref: Option<AuditAppendRecordRef>,
        linkage_refs: EvidenceLinkageRefSet,
        gap_refs: GapStateRefSet,
        visibility_reason: Option<EvidenceVisibilityReason>,
    ) -> Result<Self, DomainError>;

    pub fn projection_ref(&self) -> &AuditProjectionRef;
    pub fn subject_ref(&self) -> &AuditSubjectRef;
    pub fn correlation_context_ref(&self) -> &CorrelationContextRef;
    pub fn source_audit_ref(&self) -> &SourceAuditRef;
    pub fn source_audit_summary_ref(&self) -> &SafeExternalSummaryRef;
    pub fn state(&self) -> AuditProjectionState;
    pub fn source_fact_appended(&self) -> bool;
    pub fn latest_append_record_ref(&self) -> Option<&AuditAppendRecordRef>;
    pub fn linkage_refs(&self) -> &EvidenceLinkageRefSet;
    pub fn gap_refs(&self) -> &GapStateRefSet;
    pub fn visibility_reason(&self) -> Option<&EvidenceVisibilityReason>;
}

impl EvidenceLinkageRevision {
    pub fn try_rehydrate(
        linkage_ref: EvidenceLinkageRef,
        projection_ref: AuditProjectionRef,
        boundary_ref: GovernanceArtifactEvidenceReference,
        evidence_purpose: EvidenceConsumerPurpose,
        consumer_scope: EvidenceConsumerScope,
        state: EvidenceLinkageState,
        digest_summary: DigestSummary,
        visibility_reason: Option<EvidenceVisibilityReason>,
        body_blocked_reason: Option<BodyBlockedReason>,
    ) -> Result<Self, DomainError>;

    pub fn linkage_ref(&self) -> &EvidenceLinkageRef;
    pub fn projection_ref(&self) -> &AuditProjectionRef;
    pub fn boundary_ref(&self) -> &GovernanceArtifactEvidenceReference;
    pub fn evidence_purpose(&self) -> EvidenceConsumerPurpose;
    pub fn consumer_scope(&self) -> &EvidenceConsumerScope;
    pub fn state(&self) -> EvidenceLinkageState;
    pub fn digest_summary(&self) -> &DigestSummary;
    pub fn visibility_reason(&self) -> Option<&EvidenceVisibilityReason>;
    pub fn body_blocked_reason(&self) -> Option<&BodyBlockedReason>;
}
```

H3没有`append(projection, kind)`、`summarize() -> String`、update/delete/visibility mutation或replay member。factory先校验subject and accepted tag，再校验 transition previous snapshot、post-state complete fields、P5 decision（如有）、metadata ref/origin/visibility/cursor，最后构造一个不可变record。factory不调用projection/linkage member，不保存transition对象本身作为opaque blob，不创建outbox或timeline view。

### 60.7 error / planned tests / stop review

| mismatch | H3 exact trigger |
|---|---|
| `AcceptedInputKind` | projection/linkage tag互换、linkage branch使用projection append kind、reserved/suppressed branch传入factory |
| `RecordRef` | projection transition append ref与metadata ref不相等，或record ref跨类型使用 |
| `Subject` / `Target` | linkage不属于projection、source/subject/context relation漂移、P5 decision跨projection/linkage复用 |
| `FromState` / `ToState` | previous snapshot state、transition from、post-state target不一致 |
| `PostState` / `Reason` | linkage/gap/visibility/body-block conditional fields不匹配，previous/current boundary或digest缺失 |
| `AuditVisibility` / cursor | body-block/negative branch越过visibility cap，cursor None/Reference或origin不允许 |

planned tests覆盖5 projection kinds + 4 linkage kinds、每个accepted input的tag totality、projection append ref identity、linkage owner binding、P5 global/linkage decision basis、previous snapshot完整性、stale previous visibility/boundary/digest、gap state-preserving、body-free negative scan、duplicate ref、factory zero side effect、append/CAS rollback和no generic `String` change kind。对象停审：`pass_R06.5-F_H3_design_only`。

## 61. H4 `HandoffLifecycleRecord`

### 61.1 capability / truth boundary

H4记录一个`ReportHandoffRecord`的readiness、preparation、hint attachment、local delivery或policy block变化，以及同一handoff所拥有的`AuthenticityHint`评估变化。H4只追溯observability-owned body-free handoff；它不保存report/evidence body、destination locator、provider receipt、真实run id、evidence alias、verdict、acceptance或signoff。`Delivered`只表示local delivery boundary返回typed Delivered，`RealEvidenceLinked`只表示P6接受了trusted body-free origin hint，两者均不能升级为外部真相。

### 61.2 exact support carrier

```rust
/// Exact handoff-side subject changed by one H4 record.
pub enum HandoffLifecycleSubject {
    Handoff(ReportHandoffRecordRef),
    AuthenticityHint {
        handoff_ref: ReportHandoffRecordRef,
        hint_ref: AuthenticityHintRef,
    },
}

/// Finite accepted handoff or authenticity change.
pub enum HandoffLifecycleChangeKind {
    ReadinessEvaluated,
    ReadinessBlocked,
    Prepared,
    AuthenticityHintAttached,
    DeliveryRecorded,
    PreparationBlocked,
    TrustedBoundaryHintRecorded,
    PlaceholderHintRecorded,
    InsufficientHintRecorded,
}

/// Typed reason/result carried by an H4 change when applicable.
pub enum HandoffLifecycleReason {
    HandoffBlocked(HandoffBlockReason),
    Delivery(HandoffDeliveryResult),
    Placeholder(PlaceholderReason),
    AuthenticityInsufficient(AuthenticityGapReason),
}

/// Exact policy family that drove an H4 branch.
pub enum HandoffLifecyclePolicyBasis {
    Readiness(PolicyEvaluationBasis),
    Authenticity(PolicyEvaluationBasis),
}
```

`HandoffLifecycleRevision`以tagged Handoff/AuthenticityHint revision保持两个state owner独立；hint branch不能携带handoff state，handoff branch不能用hint state代替readiness。`HandoffLifecyclePolicyBasis::Readiness`只接受P7 family，`Authenticity`只接受P6 family。Direct delivery和hint attachment固定basis None，不能复制aggregate最近一次P7/P6 basis。

### 61.3 complete record revision carrier

```rust
pub enum HandoffLifecycleRevision {
    Handoff(HandoffRecordRevision),
    AuthenticityHint(AuthenticityHintRevision),
}

pub struct HandoffRecordRevision {
    handoff_ref: ReportHandoffRecordRef,
    handoff_scope_ref: ReportHandoffScopeRef,
    consumer_ref: ReportConsumerRef,
    state: ReportHandoffState,
    readiness: HandoffReadinessState,
    evidence_index_input_ref: EvidenceIndexInputViewRef,
    authenticity_hint_ref: Option<AuthenticityHintRef>,
    gap_refs: GapStateRefSet,
    visibility: Option<VisibilitySurface>,
    retention_marker_ref: Option<RetentionMarkerRef>,
    no_write_guard_scope: Option<NoWriteGuardScope>,
    delivery_result: Option<HandoffDeliveryResult>,
    block_reason: Option<HandoffBlockReason>,
    updated_at: ObservedAt,
}

pub struct AuthenticityHintRevision {
    hint_ref: AuthenticityHintRef,
    handoff_ref: ReportHandoffRecordRef,
    state: AuthenticityHintState,
    evidence_origin: Option<EvidenceOriginKind>,
    placeholder_reason: Option<PlaceholderReason>,
    gap_refs: GapStateRefSet,
    insufficient_reason: Option<AuthenticityGapReason>,
    evaluated_at: ObservedAt,
}
```

Handoff previous revision由`ReportHandoffTransition`的previous state/readiness/delivery/hint/gap/visibility/retention/no-write/block/time与post-state immutable relation合成；factory不得从post-state猜被清除字段。Hint previous revision完全来自`AuthenticityHintTransition`，其中H4 affected sync已补exact `handoff_ref`；post hint提供current revision。两个revision均为record内部body-free snapshot，无独立repository/public DTO/default/serde/raw constructor。

### 61.4 accepted input / post-state

```rust
pub enum HandoffLifecycleAcceptedInput<'a> {
    ReadinessEvaluated {
        transition: &'a ReportHandoffTransition,
        decision: &'a HandoffReadinessDecision,
    },
    ReadinessBlocked {
        transition: &'a ReportHandoffTransition,
        decision: &'a HandoffReadinessDecision,
    },
    Prepared {
        transition: &'a ReportHandoffTransition,
        decision: &'a HandoffReadinessDecision,
    },
    AuthenticityHintAttached {
        transition: &'a ReportHandoffTransition,
        hint: &'a AuthenticityHint,
    },
    DeliveryRecorded {
        transition: &'a ReportHandoffTransition,
    },
    PreparationBlocked {
        transition: &'a ReportHandoffTransition,
        decision: &'a HandoffReadinessDecision,
    },
    AuthenticityHintEvaluated {
        transition: &'a AuthenticityHintTransition,
        decision: &'a AuthenticityHintDecision,
    },
}

pub enum HandoffLifecyclePostState<'a> {
    Handoff(&'a ReportHandoffRecord),
    AuthenticityHint {
        handoff: &'a ReportHandoffRecord,
        hint: &'a AuthenticityHint,
    },
}
```

ReadinessEvaluated要求handoff lifecycle不变、target readiness非Blocked，且readiness或policy snapshot字段发生变化；ReadinessBlocked要求lifecycle不变、post readiness Blocked和typed block reason。Prepared要求target lifecycle Prepared且decision为Ready或允许的Degraded；PreparationBlocked要求post lifecycle Failed、readiness Blocked和typed block reason。DeliveryRecorded要求pre Prepared、post Delivered/Failed及typed adapter-independent result matrix，不允许P7 basis。HintAttached只改变current hint ref/time，并要求loaded hint属于same handoff。HintEvaluated要求P6 decision、transition、post hint和loaded owning handoff exact；terminal exact replay没有transition也没有record。

### 61.5 exact record schema / change payload

```rust
pub struct HandoffLifecycleRecord {
    metadata: ObservationRecordMetadata<HandoffLifecycleRecordRef>,
    handoff_ref: ReportHandoffRecordRef,
    handoff_scope_ref: ReportHandoffScopeRef,
    consumer_ref: ReportConsumerRef,
    evidence_index_input_ref: EvidenceIndexInputViewRef,
    subject: HandoffLifecycleSubject,
    change_kind: HandoffLifecycleChangeKind,
    before: HandoffLifecycleRevision,
    change: HandoffLifecycleChange,
    after: HandoffLifecycleRevision,
    reason: Option<HandoffLifecycleReason>,
    policy_basis: Option<HandoffLifecyclePolicyBasis>,
}

pub enum HandoffLifecycleChange {
    Handoff {
        from_state: ReportHandoffState,
        to_state: ReportHandoffState,
        from_readiness: HandoffReadinessState,
        to_readiness: HandoffReadinessState,
    },
    AuthenticityHint {
        hint_ref: AuthenticityHintRef,
        from_state: AuthenticityHintState,
        to_state: AuthenticityHintState,
    },
}
```

| field | exact source / invariant |
|---|---|
| metadata | origin Command/InboundConsumer/OperationsJob；InboundConsumer仅限accepted archive-feedback/hint branch；cursor Observation；handoff branch max AuditTimelineEligible，hint branch max OperationsOnly |
| handoff/scope/consumer/input | same-UoW handoff immutable fields；hint branch必须加载same owning handoff，不能从hint ref猜consumer/scope |
| subject | exact accepted tag；hint subject保存handoff+hint pair |
| change kind | seven accepted-input variants total映射到9 kinds；hint outcome再按P6 decision/transition target分三种 |
| before/change/after | previous delta + explicit change + post-state；tag和identity必须一致 |
| reason | block/delivery/placeholder/insufficient按矩阵；readiness、prepared、attachment、trusted hint固定None |
| policy basis | P7只用于readiness/prepared/blocked；P6只用于hint evaluated；delivery/attachment固定None |

### 61.6 total field matrix

| accepted branch | change kind / target | reason | basis |
|---|---|---|---|
| ReadinessEvaluated | `ReadinessEvaluated`;lifecycle same且target非Blocked | None | P7 |
| ReadinessBlocked | `ReadinessBlocked`;lifecycle same，readiness变为Blocked | HandoffBlocked(exact reason) | P7 |
| Prepared | `Prepared`;to Prepared | None | P7 |
| AuthenticityHintAttached | `AuthenticityHintAttached`;lifecycle/readiness same | None | None |
| DeliveryRecorded Delivered | `DeliveryRecorded`;to Delivered | Delivery(Delivered) | None |
| DeliveryRecorded failure | `DeliveryRecorded`;to Failed | Delivery(Retryable/Permanent/Rejected) | None |
| PreparationBlocked | `PreparationBlocked`;to Failed/Blocked | HandoffBlocked(exact reason) | P7 |
| Hint ConfirmTrustedBoundary | `TrustedBoundaryHintRecorded`;to RealEvidenceLinked | None | P6 |
| Hint MarkPlaceholder | `PlaceholderHintRecorded`;to PlaceholderDetected | Placeholder(exact reason) | P6 |
| Hint MarkInsufficient | `InsufficientHintRecorded`;to Insufficient | AuthenticityInsufficient(exact reason) | P6 |

ReadinessEvaluated不能与ReadinessBlocked重叠：lifecycle-preserving resulting readiness Blocked必须使用`ReadinessBlocked`；真正调用handoff `block`并进入Failed使用`PreparationBlocked`。Failed delivery keeps block reason None；policy-blocked Failed keeps delivery result None。Delivered does not create acceptance/signoff. Placeholder/Insufficient remain explicit and cannot be rewritten as missing or false evidence.

### 61.7 factory / append-only / tests

```rust
impl HandoffLifecycleRecord {
    pub fn from_accepted(
        accepted: HandoffLifecycleAcceptedInput<'_>,
        post_state: HandoffLifecyclePostState<'_>,
        metadata: ObservationRecordMetadata<HandoffLifecycleRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<HandoffLifecycleRecordRef>,
        handoff_ref: ReportHandoffRecordRef,
        handoff_scope_ref: ReportHandoffScopeRef,
        consumer_ref: ReportConsumerRef,
        evidence_index_input_ref: EvidenceIndexInputViewRef,
        subject: HandoffLifecycleSubject,
        change_kind: HandoffLifecycleChangeKind,
        before: HandoffLifecycleRevision,
        change: HandoffLifecycleChange,
        after: HandoffLifecycleRevision,
        reason: Option<HandoffLifecycleReason>,
        policy_basis: Option<HandoffLifecyclePolicyBasis>,
    ) -> Result<Self, DomainError>;

    pub fn metadata(&self) -> &ObservationRecordMetadata<HandoffLifecycleRecordRef>;
    pub fn handoff_ref(&self) -> &ReportHandoffRecordRef;
    pub fn handoff_scope_ref(&self) -> &ReportHandoffScopeRef;
    pub fn consumer_ref(&self) -> &ReportConsumerRef;
    pub fn evidence_index_input_ref(&self) -> &EvidenceIndexInputViewRef;
    pub fn subject(&self) -> &HandoffLifecycleSubject;
    pub fn change_kind(&self) -> HandoffLifecycleChangeKind;
    pub fn before(&self) -> &HandoffLifecycleRevision;
    pub fn change(&self) -> &HandoffLifecycleChange;
    pub fn after(&self) -> &HandoffLifecycleRevision;
    pub fn reason(&self) -> Option<&HandoffLifecycleReason>;
    pub fn policy_basis(&self) -> Option<&HandoffLifecyclePolicyBasis>;
}

impl HandoffRecordRevision {
    pub fn try_rehydrate(
        handoff_ref: ReportHandoffRecordRef,
        handoff_scope_ref: ReportHandoffScopeRef,
        consumer_ref: ReportConsumerRef,
        state: ReportHandoffState,
        readiness: HandoffReadinessState,
        evidence_index_input_ref: EvidenceIndexInputViewRef,
        authenticity_hint_ref: Option<AuthenticityHintRef>,
        gap_refs: GapStateRefSet,
        visibility: Option<VisibilitySurface>,
        retention_marker_ref: Option<RetentionMarkerRef>,
        no_write_guard_scope: Option<NoWriteGuardScope>,
        delivery_result: Option<HandoffDeliveryResult>,
        block_reason: Option<HandoffBlockReason>,
        updated_at: ObservedAt,
    ) -> Result<Self, DomainError>;

    pub fn handoff_ref(&self) -> &ReportHandoffRecordRef;
    pub fn handoff_scope_ref(&self) -> &ReportHandoffScopeRef;
    pub fn consumer_ref(&self) -> &ReportConsumerRef;
    pub fn state(&self) -> ReportHandoffState;
    pub fn readiness(&self) -> HandoffReadinessState;
    pub fn evidence_index_input_ref(&self) -> &EvidenceIndexInputViewRef;
    pub fn authenticity_hint_ref(&self) -> Option<&AuthenticityHintRef>;
    pub fn gap_refs(&self) -> &GapStateRefSet;
    pub fn visibility(&self) -> Option<&VisibilitySurface>;
    pub fn retention_marker_ref(&self) -> Option<&RetentionMarkerRef>;
    pub fn no_write_guard_scope(&self) -> Option<NoWriteGuardScope>;
    pub fn delivery_result(&self) -> Option<HandoffDeliveryResult>;
    pub fn block_reason(&self) -> Option<&HandoffBlockReason>;
    pub fn updated_at(&self) -> &ObservedAt;
}

impl AuthenticityHintRevision {
    pub fn try_rehydrate(
        hint_ref: AuthenticityHintRef,
        handoff_ref: ReportHandoffRecordRef,
        state: AuthenticityHintState,
        evidence_origin: Option<EvidenceOriginKind>,
        placeholder_reason: Option<PlaceholderReason>,
        gap_refs: GapStateRefSet,
        insufficient_reason: Option<AuthenticityGapReason>,
        evaluated_at: ObservedAt,
    ) -> Result<Self, DomainError>;

    pub fn hint_ref(&self) -> &AuthenticityHintRef;
    pub fn handoff_ref(&self) -> &ReportHandoffRecordRef;
    pub fn state(&self) -> AuthenticityHintState;
    pub fn evidence_origin(&self) -> Option<EvidenceOriginKind>;
    pub fn placeholder_reason(&self) -> Option<&PlaceholderReason>;
    pub fn gap_refs(&self) -> &GapStateRefSet;
    pub fn insufficient_reason(&self) -> Option<&AuthenticityGapReason>;
    pub fn evaluated_at(&self) -> &ObservedAt;
}
```

factory checks accepted tag, decision family/complete binding, handoff/hint identity, previous delta fields, post conditional matrix, metadata origin/visibility/cursor in that order. It never invokes delivery adapter, policy, clock, repository, handoff/hint member or outbox. Record has no update/delete/acknowledge/retry/attach method. Planned tests cover readiness same-state replacement, prepare from Draft/eligible Failed, hint attachment, four delivery results, policy block, three hint outcomes including changed Insufficient, cross-handoff/consumer/input/basis mismatch, visibility caps, rollback, and scans for body/destination/credential/provider receipt/run id/evidence alias/verdict/signoff. Object stop: `pass_R06.5-F_H4_design_only`.

## 62. H5 `RetentionChangeRecord`

### 62.1 capability / two-subject boundary

H5 records accepted changes to `RetentionMarker` or `ActiveReferenceProtection` without merging their state owners. A marker says whether an observation-side hold blocks release; a protection relation says which current consumers still require the object. Neither record executes cleanup, archive, delete or source mutation. `ReleaseEligible`, `Expired` and relation `Released` remain local evaluation facts; they do not claim the protected object was deleted or an archive accepted it.

P8's mandatory two-stage operation yields two separate H5 records when both objects change: first `ActiveReferenceProtection` reconciliation, then `RetentionMarker` decision application. They use distinct `RetentionChangeRecordRef` values and the same accepted UoW observation cursor. If either factory, append or save fails, both object mutations and both records roll back.

The shared cursor proves one atomic commit, not an intra-UoW total order. The marker record's accepted P8 binding and `evaluated_protection_state` must prove that it consumed the reconciled protection post-state; persistence and timeline readers must not infer protection-before-marker from generated record-ref or timestamp ordering.

### 62.2 exact support carrier

```rust
pub enum RetentionChangeSubject {
    Marker {
        marker_ref: RetentionMarkerRef,
        protected_ref: ProtectedObservationRef,
    },
    ActiveProtection {
        protection_ref: ActiveReferenceProtectionRef,
        protected_ref: ProtectedObservationRef,
    },
}

pub enum RetentionChangeKind {
    MarkerHeld,
    MarkerReleaseEligible,
    MarkerConflictRecorded,
    ArchiveEligibilityAttached,
    ProtectionConsumerAttached,
    ProtectionReconciled,
    ProtectionExpired,
    ProtectionReleased,
    ProtectionConflictRecorded,
}

pub enum RetentionChangeReason {
    MarkerRelease(RetentionReleaseReason),
    MarkerConflict(RetentionConflictReason),
    ProtectionRelease(RetentionReleaseReason),
    ProtectionConflict(ProtectionConflictReason),
}
```

`MarkerHeld` requires ActiveHold, `MarkerReleaseEligible` requires ReleaseEligible, and `MarkerConflictRecorded` requires Conflict. `ProtectionReconciled` means the accepted P8 reconciliation produced Protected, including a state-preserving changed active set; it does not mean all references were repaired. `ProtectionReleased` refers only to the relation lifecycle. There is no `CleanupCompleted`, `Archived`, `Deleted` or generic string kind.

### 62.3 complete record revisions

```rust
pub enum RetentionChangeRevision {
    Marker(RetentionMarkerRevision),
    ActiveProtection(ActiveProtectionRevision),
}

pub struct RetentionMarkerRevision {
    marker_ref: RetentionMarkerRef,
    protected_ref: ProtectedObservationRef,
    state: RetentionMarkerState,
    active_protection_ref: Option<ActiveReferenceProtectionRef>,
    archive_eligibility_ref: Option<ArchiveEligibilityRef>,
    purpose: RetentionPurpose,
    release_reason: Option<RetentionReleaseReason>,
    conflict_reason: Option<RetentionConflictReason>,
}

pub struct ActiveProtectionRevision {
    protection_ref: ActiveReferenceProtectionRef,
    protected_ref: ProtectedObservationRef,
    reason: ActiveProtectionReason,
    state: ActiveReferenceProtectionState,
    consumer_refs: ObservationConsumerRefSet,
    release_reason: Option<RetentionReleaseReason>,
    conflict_reason: Option<ProtectionConflictReason>,
}
```

Marker previous revision uses transition previous relation/archive/release/conflict fields and the post marker's immutable `protected_ref/purpose`; state comes from `from_state`. Protection previous revision uses transition previous set/reasons and post protection's immutable `protected_ref/reason`; state comes from `from_state`. The immutable fields must be stable across the transition and are not inferred from another record. Current revisions copy the same-UoW post-state. These are H5-internal snapshots, not additional truth or independent persisted aggregates.

### 62.4 accepted input / post-state

```rust
pub enum RetentionChangeAcceptedInput<'a> {
    MarkerDecisionApplied {
        transition: &'a RetentionMarkerTransition,
        decision: &'a RetentionMarkerDecision,
        reconciled_protection: Option<&'a ActiveReferenceProtection>,
    },
    MarkerArchiveEligibilityAttached {
        transition: &'a RetentionMarkerTransition,
    },
    ProtectionConsumerAttached {
        transition: &'a ActiveReferenceProtectionTransition,
    },
    ProtectionConflictMarked {
        transition: &'a ActiveReferenceProtectionTransition,
    },
    ProtectionReleaseDecisionApplied {
        transition: &'a ActiveReferenceProtectionTransition,
        decision: &'a ActiveProtectionReleaseDecision,
        consumer_states: &'a RetentionConsumerStateSnapshotSet,
    },
}

pub enum RetentionChangePostState<'a> {
    Marker(&'a RetentionMarker),
    ActiveProtection(&'a ActiveReferenceProtection),
}
```

Each accepted-input tag must equal the affected R06.4 transition kind: marker `DecisionApplied` or `ArchiveEligibilityAttached`; protection `ConsumerAttached`, `ConflictMarked` or `ReleaseDecisionApplied`. Decision branches require exact P8 complete binding and copy only the decision's P8 basis. Direct branches require no decision and basis None. The marker decision branch receives the reconciled protection only when the marker relation requires it; the option must match both decision and post marker relation. Protection release input includes the exact consumer-state snapshot set used by P8, preventing a record from binding only the resulting consumer set.

### 62.5 exact record schema

```rust
pub struct RetentionChangeRecord {
    metadata: ObservationRecordMetadata<RetentionChangeRecordRef>,
    subject: RetentionChangeSubject,
    change_kind: RetentionChangeKind,
    before: RetentionChangeRevision,
    change: RetentionChangePayload,
    after: RetentionChangeRevision,
    affected_consumer_ref: Option<ObservationConsumerRef>,
    evaluated_consumer_refs: ObservationConsumerRefSet,
    archive_eligibility_ref: Option<ArchiveEligibilityRef>,
    reason: Option<RetentionChangeReason>,
    policy_basis: Option<PolicyEvaluationBasis>,
}

pub enum RetentionChangePayload {
    Marker {
        transition_kind: RetentionMarkerTransitionKind,
        evaluated_protection_state: Option<ActiveReferenceProtectionState>,
    },
    ActiveProtection {
        transition_kind: ActiveReferenceProtectionTransitionKind,
        previous_consumer_refs: ObservationConsumerRefSet,
        current_consumer_refs: ObservationConsumerRefSet,
    },
}
```

| field | source / invariant |
|---|---|
| metadata | origin Command/OperationsJob only; cursor Observation; audit visibility at most OperationsOnly |
| subject | exact marker/protection ref + same protected observation target; cross-target relation rejected |
| change kind | accepted transition kind and target state total mapping, never caller-selected |
| before/change/after | transition prior fields + finite operation kind + post-state complete revision |
| affected consumer | Some only for `ProtectionConsumerAttached`, equal transition inserted consumer and post set member |
| evaluated consumer set | P8 decision branches copy exact evaluated/revalidated set; direct archive/conflict branches empty; attach branch contains the post current set in payload but evaluated set remains empty |
| archive eligibility | Some only for ArchiveEligibilityAttached, equal new post marker hint; it is not archive package or acceptance |
| reason | target-state matrix below; no free text or retention duration |
| policy basis | Some P8 only for two decision-applied branches; all direct branches None |

### 62.6 total field matrix

| accepted branch / target | change kind | reason | basis |
|---|---|---|---|
| Marker decision -> ActiveHold | MarkerHeld | None | P8 |
| Marker decision -> ReleaseEligible | MarkerReleaseEligible | MarkerRelease(exact reason) | P8 |
| Marker decision -> Conflict | MarkerConflictRecorded | MarkerConflict(exact reason) | P8 |
| Marker archive attachment | ArchiveEligibilityAttached | None | None |
| Protection consumer attach -> Protected | ProtectionConsumerAttached | None | None |
| Protection direct conflict -> Conflicted | ProtectionConflictRecorded | ProtectionConflict(exact reason) | None |
| P8 release decision -> Protected | ProtectionReconciled | None | P8 |
| P8 release decision -> Expired | ProtectionExpired | ProtectionRelease(exact reason) | P8 |
| P8 release decision -> Released | ProtectionReleased | ProtectionRelease(exact reason) | P8 |
| P8 release decision -> Conflicted | ProtectionConflictRecorded | ProtectionConflict(exact reason) | P8 |

Marker `Released` has no current callable producer, so H5 defines no current marker-release branch. ArchiveEligibilityAttached must be state-preserving ReleaseEligible and change only the archive hint. Consumer attach must add exactly one previously absent consumer and clear stale release/conflict reasons. P8 reconciliation may keep Protected while replacing the active set; exact replay yields no transition and no H5 record.

### 62.7 factory / append-only / tests

```rust
impl RetentionChangeRecord {
    pub fn from_accepted(
        accepted: RetentionChangeAcceptedInput<'_>,
        post_state: RetentionChangePostState<'_>,
        metadata: ObservationRecordMetadata<RetentionChangeRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<RetentionChangeRecordRef>,
        subject: RetentionChangeSubject,
        change_kind: RetentionChangeKind,
        before: RetentionChangeRevision,
        change: RetentionChangePayload,
        after: RetentionChangeRevision,
        affected_consumer_ref: Option<ObservationConsumerRef>,
        evaluated_consumer_refs: ObservationConsumerRefSet,
        archive_eligibility_ref: Option<ArchiveEligibilityRef>,
        reason: Option<RetentionChangeReason>,
        policy_basis: Option<PolicyEvaluationBasis>,
    ) -> Result<Self, DomainError>;

    pub fn metadata(&self) -> &ObservationRecordMetadata<RetentionChangeRecordRef>;
    pub fn subject(&self) -> &RetentionChangeSubject;
    pub fn change_kind(&self) -> RetentionChangeKind;
    pub fn before(&self) -> &RetentionChangeRevision;
    pub fn change(&self) -> &RetentionChangePayload;
    pub fn after(&self) -> &RetentionChangeRevision;
    pub fn affected_consumer_ref(&self) -> Option<&ObservationConsumerRef>;
    pub fn evaluated_consumer_refs(&self) -> &ObservationConsumerRefSet;
    pub fn archive_eligibility_ref(&self) -> Option<&ArchiveEligibilityRef>;
    pub fn reason(&self) -> Option<&RetentionChangeReason>;
    pub fn policy_basis(&self) -> Option<&PolicyEvaluationBasis>;
}

impl RetentionMarkerRevision {
    pub fn try_rehydrate(
        marker_ref: RetentionMarkerRef,
        protected_ref: ProtectedObservationRef,
        state: RetentionMarkerState,
        active_protection_ref: Option<ActiveReferenceProtectionRef>,
        archive_eligibility_ref: Option<ArchiveEligibilityRef>,
        purpose: RetentionPurpose,
        release_reason: Option<RetentionReleaseReason>,
        conflict_reason: Option<RetentionConflictReason>,
    ) -> Result<Self, DomainError>;

    pub fn marker_ref(&self) -> &RetentionMarkerRef;
    pub fn protected_ref(&self) -> &ProtectedObservationRef;
    pub fn state(&self) -> RetentionMarkerState;
    pub fn active_protection_ref(&self) -> Option<&ActiveReferenceProtectionRef>;
    pub fn archive_eligibility_ref(&self) -> Option<&ArchiveEligibilityRef>;
    pub fn purpose(&self) -> RetentionPurpose;
    pub fn release_reason(&self) -> Option<&RetentionReleaseReason>;
    pub fn conflict_reason(&self) -> Option<&RetentionConflictReason>;
}

impl ActiveProtectionRevision {
    pub fn try_rehydrate(
        protection_ref: ActiveReferenceProtectionRef,
        protected_ref: ProtectedObservationRef,
        reason: ActiveProtectionReason,
        state: ActiveReferenceProtectionState,
        consumer_refs: ObservationConsumerRefSet,
        release_reason: Option<RetentionReleaseReason>,
        conflict_reason: Option<ProtectionConflictReason>,
    ) -> Result<Self, DomainError>;

    pub fn protection_ref(&self) -> &ActiveReferenceProtectionRef;
    pub fn protected_ref(&self) -> &ProtectedObservationRef;
    pub fn reason(&self) -> ActiveProtectionReason;
    pub fn state(&self) -> ActiveReferenceProtectionState;
    pub fn consumer_refs(&self) -> &ObservationConsumerRefSet;
    pub fn release_reason(&self) -> Option<&RetentionReleaseReason>;
    pub fn conflict_reason(&self) -> Option<&ProtectionConflictReason>;
}
```

The factory never calls cleanup, archive, consumer lookup, P8, repository, clock or another member. It validates transition kind, exact target and sets, P8 decision if present, post-state conditional fields, then metadata. Record has no release/delete/archive/attach/update method. Planned tests cover all ten matrix rows, P8 mandatory protection-then-marker order, same cursor/two PKs, consumer-set ordering/duplicates, direct versus policy conflict provenance, archive hint only, Released relation without cleanup claim, cross-target/basis replay, origin/visibility/cursor, rollback and body/locator/provider/retention-days/archive-package/signoff scans. Object stop: `pass_R06.5-F_H5_design_only`.

## 63. H6 `NoWriteViolationRecord`

### 63.1 capability / no-fabrication boundary

H6 records a successfully mutated `NoWriteViolation`: fail-closed block, local escalation or local handling closure. Detection factory alone creates the initial `NoWriteViolation::Detected` object but no transition; current H6 therefore starts at the first accepted `Detected -> Blocked` delta. A P10 `NoWriteGuardDecision::Blocked` does not by itself create H6, because local allowlist block may have no legal `ForbiddenWriteTargetRef` and no violation identity. Only an existing violation plus accepted owning transition may be recorded.

H6 never authorizes compensation, retries the forbidden adapter call, writes source/external truth, marks source repaired, deletes the violation or interprets Closed as external remediation. It stores only typed trigger/target and finite local reasons; no attempted payload, SQL, endpoint, credential or provider exception.

### 63.2 exact support carrier

```rust
pub enum NoWriteViolationRecordKind {
    Blocked,
    Escalated,
    Closed,
}

pub enum NoWriteViolationRecordReason {
    Escalation(NoWriteEscalationReason),
    Closure(NoWriteCloseReason),
}

pub struct NoWriteViolationRevision {
    violation_ref: NoWriteViolationRef,
    trigger_context_ref: NoWriteTriggerContextRef,
    attempted_write_target: ForbiddenWriteTargetRef,
    state: NoWriteViolationState,
    escalation_reason: Option<NoWriteEscalationReason>,
    close_reason: Option<NoWriteCloseReason>,
}
```

`NoWriteViolationRecordKind` deliberately has no Detected variant until a typed accepted creation input exists; object creation and transition history are not conflated. `NoWriteViolationRevision` is a record snapshot, not a second violation aggregate. Its previous revision comes from transition subject/target/from/reason pairs; current revision comes from same-UoW post violation.

### 63.3 accepted input / exact record schema

```rust
pub struct NoWriteViolationAcceptedInput<'a> {
    transition: &'a NoWriteViolationTransition,
}

impl<'a> NoWriteViolationAcceptedInput<'a> {
    pub fn from_transition(transition: &'a NoWriteViolationTransition) -> Self;
    pub fn transition(&self) -> &'a NoWriteViolationTransition;
}

pub struct NoWriteViolationRecord {
    metadata: ObservationRecordMetadata<NoWriteViolationRecordRef>,
    violation_ref: NoWriteViolationRef,
    trigger_context_ref: NoWriteTriggerContextRef,
    attempted_write_target: ForbiddenWriteTargetRef,
    record_kind: NoWriteViolationRecordKind,
    before: NoWriteViolationRevision,
    change: NoWriteViolationChange,
    after: NoWriteViolationRevision,
    reason: Option<NoWriteViolationRecordReason>,
}

pub enum NoWriteViolationChange {
    Blocked,
    Escalated(NoWriteEscalationReason),
    Closed(NoWriteCloseReason),
}
```

The R06.4 affected transition now carries exact `trigger_context_ref` in addition to violation ref and forbidden target. Factory requires both immutable relations to equal the post violation; it cannot reconstruct the trigger from metadata or target. No policy basis is stored: P10 did not drive `block/escalate/close` member semantics, and copying its most recent basis would create false provenance. The trigger context itself retains only body-free kind/scope identity.

| field | source / invariant |
|---|---|
| metadata | Command/InboundConsumer/ResidentWorker/OperationsJob allowed; cursor Observation; visibility exactly InternalOnly or OperationsOnly, never AuditTimelineEligible；origin是本次block/escalate/close accepted lane，不是原始trigger kind的别名 |
| violation/trigger/target | transition + post-state exact immutable relation; target must remain SourceTruth or ExternalTruth and guard scope compatible |
| record kind | from/to/reason matrix, not caller parameter |
| before | transition from and previous reasons; Close from Escalated preserves previous escalation reason |
| change | accepted transition的owned finite payload；Blocked/Escalated/Closed与record kind一一对应 |
| after | post violation complete revision; must equal transition current reason fields |
| reason | None for Blocked, exact escalation for Escalated, exact closure for Closed |

### 63.4 total transition matrix

| transition | record kind | reason / post invariants |
|---|---|---|
| Detected -> Blocked | Blocked | reason None; escalation/close both None; forbidden adapter call remains zero |
| Detected -> Escalated | Escalated | Escalation Some; close None |
| Blocked -> Escalated | Escalated | Escalation Some; close None |
| Blocked -> Closed | Closed | Closure Some; escalation None; post close Some |
| Escalated -> Closed | Closed | Closure Some; previous/current escalation retained consistently; post close Some |

Any other from/to pair is `RecordConstructionMismatch(ToState)` or `AcceptedInputKind`. Closed does not mean target repaired; no `Repaired`, `Compensated`, `Retried` or `Deleted` kind exists. Duplicate exact append is handled by idempotency/PK before repository append, not by mutating the record.

### 63.5 factory / append-only / tests

```rust
impl NoWriteViolationRecord {
    pub fn from_accepted(
        accepted: NoWriteViolationAcceptedInput<'_>,
        post_state: &NoWriteViolation,
        metadata: ObservationRecordMetadata<NoWriteViolationRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<NoWriteViolationRecordRef>,
        violation_ref: NoWriteViolationRef,
        trigger_context_ref: NoWriteTriggerContextRef,
        attempted_write_target: ForbiddenWriteTargetRef,
        record_kind: NoWriteViolationRecordKind,
        before: NoWriteViolationRevision,
        change: NoWriteViolationChange,
        after: NoWriteViolationRevision,
        reason: Option<NoWriteViolationRecordReason>,
    ) -> Result<Self, DomainError>;

    pub fn metadata(&self) -> &ObservationRecordMetadata<NoWriteViolationRecordRef>;
    pub fn violation_ref(&self) -> &NoWriteViolationRef;
    pub fn trigger_context_ref(&self) -> &NoWriteTriggerContextRef;
    pub fn attempted_write_target(&self) -> &ForbiddenWriteTargetRef;
    pub fn record_kind(&self) -> NoWriteViolationRecordKind;
    pub fn before(&self) -> &NoWriteViolationRevision;
    pub fn change(&self) -> &NoWriteViolationChange;
    pub fn after(&self) -> &NoWriteViolationRevision;
    pub fn reason(&self) -> Option<&NoWriteViolationRecordReason>;
}

impl NoWriteViolationRevision {
    pub fn try_rehydrate(
        violation_ref: NoWriteViolationRef,
        trigger_context_ref: NoWriteTriggerContextRef,
        attempted_write_target: ForbiddenWriteTargetRef,
        state: NoWriteViolationState,
        escalation_reason: Option<NoWriteEscalationReason>,
        close_reason: Option<NoWriteCloseReason>,
    ) -> Result<Self, DomainError>;

    pub fn violation_ref(&self) -> &NoWriteViolationRef;
    pub fn trigger_context_ref(&self) -> &NoWriteTriggerContextRef;
    pub fn attempted_write_target(&self) -> &ForbiddenWriteTargetRef;
    pub fn state(&self) -> NoWriteViolationState;
    pub fn escalation_reason(&self) -> Option<&NoWriteEscalationReason>;
    pub fn close_reason(&self) -> Option<&NoWriteCloseReason>;
}
```

Factory does not call P10, adapter, repository, clock, violation member, compensation or source/external ports. It creates no violation from a decision and has no update/delete/close/escalate member. Planned tests cover five matrix rows, P10 Blocked without violation produces no H6, local target block cannot fabricate forbidden target, trigger/target mismatch, close-after-escalation history, all origins, visibility ceiling, observation cursor, zero adapter calls on blocked path, append rollback and raw payload/SQL/locator/credential/provider error/source-repaired scans. Object stop: `pass_R06.5-F_H6_design_only`.

## 64. H7 `ReadAccessRecord` (`phase_reserved`)

### 64.1 capability / current disabled boundary

H7 is the planned append-only audit schema for a future explicit asynchronous read-audit Command or Consumer UoW. It can record initial acceptance of a `ReadVisibilityDecision` into a `ReadVisibilityState`, or a later accepted reevaluation transition for the same request-scoped identity. It does not authorize the read, persist a response body or turn visibility into business permission.

Current synchronous Query has no H7 writer. It does not persist `DiagnosticRequestContext` or `ReadVisibilityState`, mint `ReadAccessRecordRef`, create an async envelope, begin an observation UoW, assign a cursor, append H7/outbox or save P11/P10 decisions. Merely defining the following types does not enable a writer. Any current call to the phase-reserved envelope/state factory must return `DomainError::ReservedTransition` before identity/cursor allocation or repository interaction.

### 64.2 exact support carrier

```rust
/// Future asynchronous read-audit operation accepted by an explicit write boundary.
pub enum ReadAuditAcceptanceKind {
    InitialVisibilityRecorded,
    VisibilityReevaluated,
}

/// Finite H7 change kind; it describes audit persistence, not read authorization.
pub enum ReadAccessChangeKind {
    VisibilityRecorded,
    VisibilityReevaluated,
}

/// Complete read-visibility revision stored before or after an accepted audit change.
pub struct ReadVisibilityRecordRevision {
    visibility_ref: ReadVisibilityRef,
    request_context_ref: DiagnosticRequestContextRef,
    visibility_scope_ref: VisibilityScopeRef,
    kind: ReadVisibilityKind,
    constraint_ref: Option<VisibilityConstraintRef>,
    gap_ref: Option<GapStateRef>,
    block_reason: Option<ReadBlockReason>,
}

/// Process-local acceptance produced only by a future asynchronous write boundary.
pub struct AsynchronousReadAuditAcceptedEnvelope<'a> {
    acceptance_kind: ReadAuditAcceptanceKind,
    request_context: &'a DiagnosticRequestContext,
    input_snapshot: &'a ReadVisibilityInputSnapshot,
    decision: &'a ReadVisibilityDecision,
    transition: Option<&'a ReadVisibilityTransition>,
}

impl<'a> AsynchronousReadAuditAcceptedEnvelope<'a> {
    pub(crate) fn accept(
        acceptance_kind: ReadAuditAcceptanceKind,
        request_context: &'a DiagnosticRequestContext,
        input_snapshot: &'a ReadVisibilityInputSnapshot,
        decision: &'a ReadVisibilityDecision,
        transition: Option<&'a ReadVisibilityTransition>,
    ) -> Result<Self, DomainError>;
}
```

The envelope is not persisted and has no public/serde/default/builder constructor. Its phase-reserved `pub(crate)` factory is owned by a future application-facing domain assembly path and is currently specified to return `ReservedTransition` for all callers. Reopening requires a separately designed async Command/Consumer protocol, operation/idempotency owner, repository/UoW flow, authorization boundary and tests; config cannot enable it.

For future initial acceptance, `transition=None`, kind InitialVisibilityRecorded and the post state must exactly reflect the P11 decision. For future reevaluation, transition=Some, kind VisibilityReevaluated and transition/decision/post state must share visibility/request/scope/target and complete conditional fields. The envelope copies no request/response body, query text, filter body, UI state, credential, actor profile or authorization token.

### 64.3 exact record schema

```rust
pub struct ReadAccessRecord {
    metadata: ObservationRecordMetadata<ReadAccessRecordRef>,
    request_context_ref: DiagnosticRequestContextRef,
    actor_ref: ActorSafeRef,
    read_purpose: ReadPurpose,
    projection_scope: ObservationProjectionScope,
    diagnostic_scope_ref: DiagnosticScopeRef,
    visibility_scope_ref: VisibilityScopeRef,
    target_ref: ReadEvaluationTargetRef,
    change_kind: ReadAccessChangeKind,
    before: Option<ReadVisibilityRecordRevision>,
    change: ReadAccessChange,
    after: ReadVisibilityRecordRevision,
    policy_basis: PolicyEvaluationBasis,
    no_write_policy_basis: PolicyEvaluationBasis,
}

pub enum ReadAccessChange {
    InitialVisibilityRecorded,
    VisibilityReevaluated {
        visibility_ref: ReadVisibilityRef,
        request_context_ref: DiagnosticRequestContextRef,
        visibility_scope_ref: VisibilityScopeRef,
        from_kind: ReadVisibilityKind,
        to_kind: ReadVisibilityKind,
    },
}
```

| field | exact future source / invariant |
|---|---|
| metadata | origin must be exactly AsynchronousReadAudit; committed cursor must be Some Observation; audit visibility InternalOnly or OperationsOnly, never timeline eligible |
| request/actor/purpose/scopes | envelope request context + P11 complete input exact; metadata actor must equal request actor, not merely another safe actor |
| target | `ReadVisibilityInputSnapshot.target.target_ref`; no generic BodyFreeRef or view-body selector |
| change kind | acceptance kind total mapping; initial has before None, reevaluation has before Some |
| before | absent only for initial creation; reevaluation copies transition previous kind/constraint/gap/block fields |
| change | initial typed marker or accepted transition的owned finite identity/state payload；before/after保存conditional fields |
| after | same-UoW `ReadVisibilityState`; exact P11 outcome optional-field matrix |
| policy basis | exact P11 basis from decision; cannot be caller supplied or replaced by visibility kind |
| no-write policy basis | exact nested P10 basis from P11 input; proves the audited operation remained inside its read-only local effect, not actor authorization |

`actor_ref` intentionally appears both in metadata and request context-derived fields; factory requires equality so persistence cannot attribute the record to a different actor. The record stores the safe actor ref only, never identity profile, role/capability body or authorization conclusion.

### 64.4 accepted input / post-state / matrix

```rust
pub struct ReadAccessAcceptedInput<'a> {
    envelope: &'a AsynchronousReadAuditAcceptedEnvelope<'a>,
}

impl<'a> ReadAccessAcceptedInput<'a> {
    pub(crate) fn from_envelope(
        envelope: &'a AsynchronousReadAuditAcceptedEnvelope<'a>,
    ) -> Self;
}

impl ReadAccessRecord {
    pub(crate) fn from_accepted(
        accepted: ReadAccessAcceptedInput<'_>,
        post_state: &ReadVisibilityState,
        metadata: ObservationRecordMetadata<ReadAccessRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<ReadAccessRecordRef>,
        request_context_ref: DiagnosticRequestContextRef,
        actor_ref: ActorSafeRef,
        read_purpose: ReadPurpose,
        projection_scope: ObservationProjectionScope,
        diagnostic_scope_ref: DiagnosticScopeRef,
        visibility_scope_ref: VisibilityScopeRef,
        target_ref: ReadEvaluationTargetRef,
        change_kind: ReadAccessChangeKind,
        before: Option<ReadVisibilityRecordRevision>,
        change: ReadAccessChange,
        after: ReadVisibilityRecordRevision,
        policy_basis: PolicyEvaluationBasis,
        no_write_policy_basis: PolicyEvaluationBasis,
    ) -> Result<Self, DomainError>;
}
```

| acceptance | before | after / required checks |
|---|---|---|
| InitialVisibilityRecorded | None | state identity/request/scope and Visible/Restricted/NotVisible/Blocked optional matrix exactly equal P11 decision; transition must be None |
| VisibilityReevaluated | Some from transition | transition previous/current fields, P11 decision and post state exact; at least kind or conditional payload changes; transition must be Some |

The future factory order is AcceptedInputKind -> phase gate -> metadata origin/ref/cursor/visibility -> request/actor/scopes/target -> P11/P10 complete binding -> transition before/change -> post-state matrix. Under the current phase, the factory remains `pub(crate)` and stops at the phase gate with `ReservedTransition`; no application crate caller or in-crate test helper can construct a durable record even if it fabricates in-memory values. Reopening the future writer must explicitly change visibility and satisfy §64.1 gates. This current behavior takes precedence over the planned success matrix.

### 64.5 inspection / append-only / no-writer verification

```rust
impl ReadAccessRecord {
    pub fn metadata(&self) -> &ObservationRecordMetadata<ReadAccessRecordRef>;
    pub fn request_context_ref(&self) -> &DiagnosticRequestContextRef;
    pub fn actor_ref(&self) -> &ActorSafeRef;
    pub fn read_purpose(&self) -> ReadPurpose;
    pub fn projection_scope(&self) -> &ObservationProjectionScope;
    pub fn diagnostic_scope_ref(&self) -> &DiagnosticScopeRef;
    pub fn visibility_scope_ref(&self) -> &VisibilityScopeRef;
    pub fn target_ref(&self) -> &ReadEvaluationTargetRef;
    pub fn change_kind(&self) -> ReadAccessChangeKind;
    pub fn before(&self) -> Option<&ReadVisibilityRecordRevision>;
    pub fn change(&self) -> &ReadAccessChange;
    pub fn after(&self) -> &ReadVisibilityRecordRevision;
    pub fn policy_basis(&self) -> &PolicyEvaluationBasis;
    pub fn no_write_policy_basis(&self) -> &PolicyEvaluationBasis;
}

impl ReadVisibilityRecordRevision {
    pub fn try_rehydrate(
        visibility_ref: ReadVisibilityRef,
        request_context_ref: DiagnosticRequestContextRef,
        visibility_scope_ref: VisibilityScopeRef,
        kind: ReadVisibilityKind,
        constraint_ref: Option<VisibilityConstraintRef>,
        gap_ref: Option<GapStateRef>,
        block_reason: Option<ReadBlockReason>,
    ) -> Result<Self, DomainError>;

    pub fn visibility_ref(&self) -> &ReadVisibilityRef;
    pub fn request_context_ref(&self) -> &DiagnosticRequestContextRef;
    pub fn visibility_scope_ref(&self) -> &VisibilityScopeRef;
    pub fn kind(&self) -> ReadVisibilityKind;
    pub fn constraint_ref(&self) -> Option<&VisibilityConstraintRef>;
    pub fn gap_ref(&self) -> Option<&GapStateRef>;
    pub fn block_reason(&self) -> Option<&ReadBlockReason>;
}
```

No update/delete/authorize/respond/retry/transition member exists. The record cannot contain response rows, page cursors, query text, filters or body. Planned verification has two groups:

1. Current zero-writer tests: all 14 synchronous Query services have id generator/UoW/cursor/H7/outbox/request-context repository spies at zero; envelope and state phase-reserved factories return ReservedTransition before side effects; config cannot enable them.
2. Future-contract tests, not currently executable as acceptance evidence: initial/reevaluation matrices, four visibility kinds and optional fields, actor/request/scope/target/P10/P11 cross-binding, origin/visibility/cursor, append-only rollback and body/credential/authorization scans.

No test result, run id or evidence alias is claimed here. Object stop: `pass_phase_reserved_R06.5-F_H7_design_only`.

## 65. R06.5-F 类型、owner、字段与停止门禁总审计

### 65.1 67个new explicit type账

本节只统计§§58~64新增的`pub struct/enum`，不把B批已定义的七个record ref、`ObservationRecordMetadata<R>`、R06.3/R06.4 transition/decision/post-state或新增`impl`重复计数。机械账与逐名账必须同时成立；后续移动物理文件不允许重新声明同名type。

| record group | count | exact new types |
|---|---:|---|
| H1 intake | 11 | `IntakeDecisionSource`;`IntakeDecisionChangeKind`;`IntakeDecisionReason`;`IntakeDecisionPolicyBasis`;`IntakeDecisionAcceptedInput`;`IntakeDecisionPostState`;`IntakeDecisionRecord`;`IntakeDecisionChange`;`IntakeDecisionRevision`;`IntakeReceiptRevision`;`IntakeSafetyRevision` |
| H2 correlation | 11 | `CorrelationLinkSource`;`CorrelationLinkChangeKind`;`CorrelationLinkReason`;`CorrelationSignalLinkageEffect`;`CorrelationLinkAcceptedInput`;`CorrelationLinkPostState`;`CorrelationLinkRecord`;`CorrelationLinkChangePayload`;`CorrelationLinkRevision`;`CorrelationContextRecordRevision`;`SafeSignalLinkRevision` |
| H3 audit/evidence | 11 | `AuditAppendRecordSubject`;`AuditLinkageChangeKind`;`AuditAppendRecordChangeKind`;`AuditAppendReason`;`AuditAppendRevision`;`AuditProjectionRevision`;`EvidenceLinkageRevision`;`AuditAppendAcceptedInput`;`AuditAppendPostState`;`AuditAppendRecord`;`AuditAppendChange` |
| H4 handoff | 11 | `HandoffLifecycleSubject`;`HandoffLifecycleChangeKind`;`HandoffLifecycleReason`;`HandoffLifecyclePolicyBasis`;`HandoffLifecycleRevision`;`HandoffRecordRevision`;`AuthenticityHintRevision`;`HandoffLifecycleAcceptedInput`;`HandoffLifecyclePostState`;`HandoffLifecycleRecord`;`HandoffLifecycleChange` |
| H5 retention | 10 | `RetentionChangeSubject`;`RetentionChangeKind`;`RetentionChangeReason`;`RetentionChangeRevision`;`RetentionMarkerRevision`;`ActiveProtectionRevision`;`RetentionChangeAcceptedInput`;`RetentionChangePostState`;`RetentionChangeRecord`;`RetentionChangePayload` |
| H6 no-write | 6 | `NoWriteViolationRecordKind`;`NoWriteViolationRecordReason`;`NoWriteViolationRevision`;`NoWriteViolationAcceptedInput`;`NoWriteViolationRecord`;`NoWriteViolationChange` |
| H7 read audit | 7 | `ReadAuditAcceptanceKind`;`ReadAccessChangeKind`;`ReadVisibilityRecordRevision`;`AsynchronousReadAuditAcceptedEnvelope`;`ReadAccessRecord`;`ReadAccessChange`;`ReadAccessAcceptedInput` |
| total | 67 | 11 + 11 + 11 + 11 + 10 + 6 + 7；名称在F批范围内唯一 |

F批没有生成`*RecordId`、generic history row、record/subject union ref、serde transition blob、`String change_kind`或`Other(String)`。B批的七个typed record ref继续是唯一PK type，R06.3的`AuditAppendRecordRef`继续复用而不产生alias。

### 65.2 unique owner / visibility / type-use registry

| type group | unique logical definition owner | construction / use visibility | duplicate-prevention gate |
|---|---|---|---|
| H1 record、source/change/revision/input/post carriers | `domain::records::intake` | accepted-input/post-state enum及`from_accepted`供application组装；record/revision字段private，只经typed inspection持久化 | `domain::intake`只拥有receipt/safety truth、decision和transition，不复制record type |
| H2 record family | `domain::records::correlation` | application显式选择Context/SignalRecorded/SignalRevalidated accepted tag；factory total验证；record immutable | `domain::signal`/`domain::correlation`不新增history row或linkage-effect alias |
| H3 record family | `domain::records::audit` | application传accepted projection/linkage branch；projection branch强制复用transition中的H3 ref | `AuditAppendKind`仍唯一归`contracts::metadata`；linkage kind只归H3，不扩展projection enum |
| H4 record family | `domain::records::handoff` | application传member-specific accepted tag；factory借用P6/P7 decision做binding | `domain::handoff`仍唯一拥有handoff/hint truth和decision，不直接返回record |
| H5 record family | `domain::records::retention` | application按marker/protection operation组装；two-stage P8生成两个不同PK | `domain::retention`仍唯一拥有transition kind/state；record不拥有cleanup/release operation |
| H6 record family | `domain::records::no_write` | 只接受existing violation transition；metadata origin是本次lifecycle writer lane | `domain::no_write`拥有violation truth；P10或application不能从Blocked decision生成record |
| H7 acceptance kind / envelope | `domain::read` | `pub(crate)` phase-reserved factory当前总是`ReservedTransition` | `domain::records`不得成为read acceptance或authorization owner |
| H7 record/change/revision/accepted wrapper | `domain::records::read_access` | record factory `pub(crate)`且当前在phase gate失败；无application caller | synchronous Query、protocol、repository或config不得复制schema或启用writer |
| shared metadata/visibility/origin | `domain::records`，B批§16 | 七family复用generic typed metadata；concrete factory继续收窄origin/visibility/cursor | concrete family不复制metadata字段或定义第二origin enum |
| record identity | `contracts::refs`，B批§14及R06.3 §9.30 | application id generator预留；record factory只消费 | 无`Id/Ref`双类型、digest/cursor派生identity或generic record ref |
| policy decision/basis | 各P1~P12 owning domain module + `domain::policies` basis | record factory只借用complete decision并复制允许的basis | record不构造decision、不保存policy material或最近一次aggregate basis |

logical `domain::records::*`不提前裁定物理文件必须拆成七个Rust文件。冻结Step04仍写`history.rs`，而current logical owner写`domain::records`；`R06.8`必须选择一个一致布局并回写Step04，禁止同时建立`history`与`records`两个definition owner。

### 65.3 transition-to-record total mapping终检

| transition family | accepted variants / operation source | F mapping | no-record / reserved boundary |
|---|---|---|---|
| `ObservationReceiptTransition` | Accepted/Rejected/Quarantined/Degraded | each -> exactly one H1 Receipt branch | Superseded为`phase_reserved`；current factory拒绝且不append |
| `SafetyDispositionTransition` | MarkedSafe/MarkedRedacted/RejectedUnsafe/Quarantined | each -> exactly one H1 SafetyDisposition branch | none；与receipt transition同UoW时仍是两个PK/两条record |
| `CorrelationContextTransition` | SeedBound/RuntimeSignalLinked/Degraded/Invalidated | each -> exactly one H2 Context branch | none |
| `SafeSignalTransition` | Recorded + explicit H2 tag/P3 decision；Revalidated + explicit H2 tag | each qualifying effect -> exactly one H2 Signal branch；Revalidated basis fixed None | Suppressed/MarkedStale=`explicit_no_record`；Recorded/Revalidated没有explicit effect也不得猜H2 |
| `AuditProjectionTransition` | five `AuditAppendKind` operations | each -> exactly one H3 Projection branch；metadata ref equals transition ref | none |
| `EvidenceLinkageTransition` | Linked/BodyBlocked/NotVisible/MarkedStale | each -> exactly one H3 EvidenceLinkage branch | none；不得改用Projection(EvidenceLinkageAppended)伪装linkage lifecycle |
| `ReportHandoffTransition` | apply_readiness(nonblocked/blocked)、prepare、attach hint、deliver、block | accepted-input tag + exact before/after diff -> one H4 kind；delivery按result分支 | exact replay返回None；cancel reserved且无transition/record |
| `AuthenticityHintTransition` | ConfirmTrustedBoundary/MarkPlaceholder/MarkInsufficient | decision outcome + transition target -> one of three H4 hint kinds | exact replay无transition；terminal重评需new hint identity |
| `RetentionMarkerTransition` | DecisionApplied to ActiveHold/ReleaseEligible/Conflict；ArchiveEligibilityAttached | each row -> exactly one H5 Marker branch | marker Released无current producer；exact replay无transition |
| `ActiveReferenceProtectionTransition` | ConsumerAttached；ConflictMarked；ReleaseDecisionApplied to Protected/Expired/Released/Conflicted | each row -> exactly one H5 ActiveProtection branch | exact replay无transition；relation Released不表示object cleanup |
| `NoWriteViolationTransition` | Detected->Blocked/Escalated；Blocked->Escalated/Closed；Escalated->Closed | five legal pairs -> exactly one H6 | initial Detected creation=`explicit_no_record`；P10 Blocked alone=`explicit_no_record` |
| `ReadVisibilityTransition` / initial accepted state | future InitialVisibilityRecorded/Reevaluated | planned exactly one H7 per accepted async envelope | whole family `phase_reserved`；current synchronous Query及all current callers zero writer |

本表覆盖F批全部12个transition family。`exactly one`只约束一个accepted branch对本family的映射，不表示同一业务UoW只能产生一条record：H1 safety + receipt、H5 protection + marker分别必须保持两条不同PK；同一transition不得无条件复制到两个record family。所有未列分支只能是上表明确的`explicit_no_record`或`phase_reserved`，不得由implementation自行补默认。

### 65.4 字段来源与 persistence inspection闭环

| field family | exact source | construction cross-check | persistence / read boundary |
|---|---|---|---|
| record PK / origin / actor / time / trace / causation / visibility / cursor | exact `ObservationRecordMetadata<FamilyRecordRef>` | typed ref、branch origin allowlist、visibility ceiling、Observation cursor tag；H7另要求AsynchronousReadAudit | mapper经metadata inspection flatten；不得DB default actor/time/cursor或丢typed discriminator |
| subject / owning relation | accepted tag + transition + same-UoW post-state | all identities and immutable relations equal；H3/H4/H5 tagged owner pair不得漂移 | record subject accessor + tagged enum；不得降成裸`BodyFreeRef`唯一键 |
| before | transition previous snapshot / previous field pairs | from state、old optional fields、old set/digest/reason完整且与decision pre-snapshot匹配 | family revision accessor逐字段读取；不得从after/current row反推 |
| change / change kind | accepted transition finite variant或accepted-input tag | kind/payload/target一一对应，无caller-selected string | typed enum discriminator + payload；unknown/cross-tag optional组合fail closed |
| after | same-UoW post aggregate/state | target state、conditional fields、sets、reasons、immutable relation与transition exact | family revision accessor逐字段读取；不是第二truth row或public DTO |
| reason / result | transition/decision typed payload | positive/negative/blocked/delivery matrix逐branch固定Some/None | record accessor返回typed value；无message/provider payload/free string |
| policy basis | exact accepted P1~P12 decision only | family、target、complete pre-snapshot、transition/post proof；direct branch固定None/Direct | persisted immutable basis copy；不保存decision、rule body、config locator |
| record-specific refs/sets | exact transition/post-state/loaded relation | H3 linkage/gap、H4 scope/consumer/input、H5 consumer/evaluation/archive、H7 scopes/target逐项检查 | concrete record accessor完整暴露；mapper不得通过Debug/serde私有字段取值 |

§§58~64已经为七个record及其private revision struct补齐所有persisted field的typed inspection method。accepted input、post-state与future H7 envelope是process-local assembly carrier，不持久化，因此无需暴露generic serde/default/builder。enum payload通过finite variant pattern读取；任何 persistence adapter需要文档未列的私有字段、raw transition序列化或自由字符串列时必须暂停并回报设计缺口。

#### 65.4.1 validated persistence rehydration

每个H1~H7 record和12个private before/after revision struct均提供`pub fn try_rehydrate(all persisted fields) -> Result<Self, DomainError>`，供infra persistence mapper自底向上调用；这些函数不从domain prelude re-export，application、entry、policy和protocol不得把它们当accepted-operation factory。H1~H6逐字段执行与record内部shape有关的全部校验：typed metadata ref、origin、visibility、Observation cursor、subject/tag、before/change/after identity与state矩阵、optional reason/ref/set和policy-family矩阵。它不要求提供原transition或complete decision，因为二者是process-local且不持久化；因此rehydration只确认stored append-only fact内部一致，不重新证明或重新授权当年的operation。

H7在current phase对任何`try_rehydrate`输入先返回`DomainError::ReservedTransition`，即使row字段表面合法也不得把不存在的current writer历史伪装成可用record。未来启用async read-audit时，正式设计变更必须解除该gate并启用§64.3~§64.4的完整shape校验。所有rehydration均禁止unchecked struct literal、serde default、current policy replay、resolver/config读取、identity/cursor mint、aggregate mutation、record correction或outbox creation；corrupt row fail closed并进入Step12 consistency mapping。

### 65.5 origin、visibility、cursor与same-UoW affected review

| record | allowed current origin | visibility ceiling | cursor / phase rule |
|---|---|---|---|
| H1 | Command / InboundConsumer | positive branch可Timeline；reject/quarantine/unsafe最多Operations | required Observation |
| H2 | Command / InboundConsumer | bound/link可Timeline；degraded/invalid最多Operations | required Observation |
| H3 projection | Command / InboundConsumer / OperationsJob | five projection kinds可Timeline | required Observation；metadata ref等于transition ref |
| H3 linkage | Command / InboundConsumer | Linked/NotVisible/Stale可Timeline；BodyBlocked最多Operations | required Observation |
| H4 | Command / InboundConsumer / OperationsJob | handoff branch最多Timeline；hint branch最多Operations；Consumer仅限具名accepted feedback/hint branch | required Observation |
| H5 | Command / OperationsJob |最多Operations | required Observation；P8 two-stage records共享cursor但PK不同 |
| H6 | Command / InboundConsumer / ResidentWorker / OperationsJob | InternalOnly或Operations，never Timeline | required Observation；origin描述本次block/escalate/close lane，trigger kind描述原attempt family |
| H7 | AsynchronousReadAudit only | InternalOnly或Operations | future required Observation；current factory总是ReservedTransition且不mint/allocate/append |

F批metadata必须携带committed cursor，而冻结Step07 §7.2、Step09 shared flow和Step11 §§10.2/11.2/12仍把append-only record放在cursor分配之前。该顺序无法调用本批factory，登记为`R06-F-AFFECT-UOW-01`，current authoritative ordering为：

```text
reserve typed object / record refs and operation time
  -> versioned load + policy evaluation + accepted domain transition
  -> stage mutable truth/state and build no-cursor affected-membership plan
  -> assign the UoW's one ObservationCursor
  -> wrap ObservationCommittedCursor::Observation
  -> construct typed metadata
  -> construct and stage all mandatory append-only records
  -> record committed source memberships / outbox / stale / result
  -> commit
```

Cursor allocation、record factory、record append、CAS或后置mandatory write任一失败均rollback整个UoW；backend可以留下不可见cursor gap但不得复用。H1/H5同UoW多record复用一个cursor，不复用PK。cursor没有intra-UoW ordinal语义，reader不得按typed record ref、timestamp或数据库行序猜因果；H1通过decision/disposition snapshot，H5通过reconciled protection post-state与P8 binding证明跨record顺序。该affected item不是外部上游blocker，也不修改本批冻结下游；R06.8完成后必须在解冻Step07时同步Step09/11，并在Step16添加顺序与rollback切口。未同步前不得宣称formal `03`可实施。

为使上述顺序可按Rust ownership落码，解冻Step07时还必须同步两项trait delta：所有需要在record factory中继续借用same-UoW post-state的`save_*` stage入口改为借用`&T`或返回等价typed staged snapshot，不得在cursor分配前consume唯一aggregate；当前合并的`save_no_write_violation(violation, record, ...)`拆为versioned violation stage与cursor后`append_no_write_violation_record(record, ...)`。adapter仍可在borrow期间复制validated persistence fields，但不能要求aggregate实现`Clone`，也不能用重读staged/current row替代factory的same-UoW post-state。该trait delta与顺序共同属于`R06-F-AFFECT-UOW-01`，不得由实现agent临时选择。

### 65.6 append-only、truth boundary与planned verification

| audit cut | F批结论 | planned verification；不代表已执行 |
|---|---|---|
| append-only API | seven records只有factory/inspection，无update/delete/retry/attach/transition | compile/API scan拒绝mutable member；repository只允许append |
| before/change/after losslessness | 12 transition family均有typed total mapping | every variant/operation row round-trip；old optional/set/digest/reason不从after猜 |
| identity / cross-binding | ref、subject、target、decision、post-state必须同一operation | cross-record-ref、cross-subject、cross-policy、cross-post-state negative matrix |
| origin / visibility / cursor | §65.5 finite matrix | all allowed/denied origins、visibility ceiling、None/Reference cursor rejection |
| UoW atomicity | truth/state/record/cursor/outbox同事务；H1/H5 multi-record all-or-none | failure injection at cursor/factory/append/CAS/outbox/stale/result；rollback不可见 |
| persistence inspection / rehydration | every private persisted field有typed accessor；H1~H6有validated stored-shape rehydrate，H7 current拒绝rehydrate | fake/durable append encoding与typed read-mapping parity；corrupt row fail closed；禁止Debug/opaque transition blob |
| no business truth | record只保存observation-side local change | scan无acceptance/verdict/signoff/source-repaired/cleanup claim |
| body-free / secret-safe | no raw body、locator、credential、provider payload或real run id/evidence alias | schema/Debug/serialization snapshot scans；negative unsafe branch仍只保留finite evidence/reason |
| H7 no writer | type存在但phase gate优先 | 14 sync Query的id/UoW/cursor/H7/outbox spies all zero；config不能启用 |

本节没有实现测试、没有执行测试，也没有生成commit、run id、真实evidence alias或验收签署。`planned verification`只定义未来Step16/实现阶段必须具备的切口。

### 65.7 F批停止门禁（historical，已由G批消费）

| gate | conclusion |
|---|---|
| seven independent record cards | pass design-only；§§58~64均有capability、exact schema、factory、matrix、append-only和test redline |
| new explicit type account | pass；67 unique new types，分组11/11/11/11/10/6/7 |
| zero-unowned / duplicate owner | pass_for_F；§65.2固定record/read/shared/ref/decision唯一owner；物理`history.rs`命名冲突后移R06.8且禁止双owner |
| transition total mapping | pass_for_F；12 family均为exact H1~H7、explicit_no_record或phase_reserved |
| field source / mapper surface | pass_for_F；metadata、subject、before/change/after、reason/basis与record-specific字段均有来源、inspection和validated rehydrate boundary |
| provenance correction | pass；H2 Revalidated固定direct/None；H6 lifecycle origin与original trigger kind不混同 |
| append-only / no business truth | pass design-only；无mutable record API、raw body、external truth、cleanup、verdict或signoff |
| H7 current writer | none；phase-reserved factory先于identity/cursor/repository返回ReservedTransition |
| downstream affected item | `R06-F-AFFECT-UOW-01=open_controlled`；current ordering已固定，待R06.8后解冻Step07并同步Step09/11/16 |
| external upstream blocker | none；正式00/01/02足以支撑H1~H7 |
| historical internal blocker | `03-RPR-S06-GRANULARITY=open`；当时F批完成不等于R06.5或Step06完成，仍需G及R06.6~R06.8 |
| historical checkpoint | `R06.5-F_done_waiting_user`；已由G批消费 |
| historical next allowed | 当时只进入`R06.5-G H8~H13`；不再是current action |

### 65.8 用户确认后 R06.5-G 阅读清单

1. 本专项§§7/9/14/16/17/65及H8~H13 inventory，先固定G批六个record的input authority与H12 reserved dependency。
2. R06.4 gap/degraded、peripheral、reference、projection/rollup maintenance和replay transition/post-state，以及§22 affected definitions。
3. 正式`02` H8~H13 record responsibility与冻结Step07/09/11/16 use，只作缺口反查，不成为definition owner。
4. R06.6尚未开始，未经另一个明确Step/子批次门禁不得读取或写入其正文；H12所需item result保持typed input reservation，不得猜job identity/result。

确认前不得读取或写入H8~H13 concrete card、R06.6、Step07~19、formal`03`、任何`04`或实现代码。当前不需要提交。

## 66. R06.5-G 输入、范围与 record authority 裁定（historical，已消费）

### 66.1 G批执行边界

| 项 | 当前裁定 |
|---|---|
| historical用户门禁 | 用户已明确确认进入`R06.5-G`；§65.8阅读门禁已消费 |
| historical唯一范围 | H8 `GapTransitionRecord`、H9 `PeripheralDeliveryRecord`、H10 `ReferenceRefreshRecord`、H11 `ProjectionMaintenanceRecord`、H12 `GapScanRecord`、H13 `ReplayExecutionRecord`及R06.5全文总门禁 |
| record logical owner | `domain::records::{gap,peripheral,reference,maintenance,gap_scan,replay}`；不创建generic history row或第二套record module |
| historical允许同步 | 本专项；R06.3 `SignalRollupTransition`；R06.4 gap/degraded creation proof与H8~H13 affected-definition；contracts/main flow/ledger current pointer |
| historical禁止范围 | R06.6正文与job/item schema、R06.7~R06.8、Step07~19、正式`03`、任何`04`、实现代码 |
| historical完成停止点 | 六个record卡、affected-definition与R06.5总审计完成后同步为`R06.5-G_done_waiting_user`并停审；不得进入R06.6 |

### 66.2 已读取输入与使用结论

| 输入 | G批使用结论 |
|---|---|
| Step06 SOP / 书写规范 | 每个record独立闭口capability、schema、accepted input、post-state、factory、inspection、rehydrate、append-only与planned test |
| R06.5 §§7/9/14/16/17/65 | typed PK、三输入factory、metadata、origin/visibility/cursor、error与same-UoW顺序继续生效 |
| R06.4 gap/degraded | gap truth与immutable degraded revision分离；首次创建不能从post-state或missing row反推，必须补typed creation proof |
| R06.4 peripheral/reference | policy-driven与adapter/direct branch必须分离；reference in-place与new-identity recovery必须分离 |
| R06.4 maintenance/replay | projection双namespace cursor、rollup execution和per-target replay不得压成scope-wide或global cursor |
| R06.3 rollup | `SignalRollupTransition`需保留window identity与完整before fields，才能无损形成H11 |
| 正式02 H8~H13 | 保留六个record主语和责任；`*RecordId`、mutable scan record、bare guard result与aggregate-to-record factory均为historical candidate |
| frozen Step07/09/11/16 | 只登记append surface、UoW ordering、旧flow/schema/test affected use；不修改冻结文件 |
| L1逐record参考 | 采用逐record before/change/after、field source和validated rehydrate粒度；不复制相邻域truth |

Historical G checkpoint: 当时外部上游blocker记录为`none`，H12仍等待R06.6。该判断已被§74消费并部分推翻：D-3/D-6已闭合H12 fieldwise compatibility，而`R06.6-F2-H13-UPSTREAM=open_controlled`已发现正式`02`的H13映射冲突。

### 66.3 G批共同构造、rehydrate与origin规则

1. H8~H11、H13必须消费`successful transition / typed creation proof + same-UoW post-state + typed metadata`。creation proof只能由owning domain factory与新对象一起返回，application不能公开构造、serde decode或从repository absence制造。
2. H12消费`GapScanAcceptedItemResult + canonical target snapshot + typed metadata`；result是G批定义的record-required reservation，不包含job、plan、item、claim、run或report identity。
3. H8/H9/H11/H12/H13 metadata要求`Some(ObservationCommittedCursor::Observation(_))`；H10按§74允许application-selected Reference或Observation。H11的observation/reference coverage cursor是record body字段，不能替代metadata commit cursor；H12/H13也不能把job cursor或scope ref塞进metadata。
4. `try_rehydrate`只校验persisted record自身的typed shape，不重跑policy、不恢复transition、不授权maintenance/replay，也不查询current source/external truth。corrupt row fail closed。
5. G批record均无update/delete/mark/retry/attach/close member。correction必须未来追加具名correction record；当前不增加`Corrected`或`Other(String)`。

| record | allowed origin | visibility ceiling |
|---|---|---|
| H8 gap/degraded | Command / InboundConsumer / ResidentWorker / OperationsJob |一般最多Timeline；UnsafeOutput或Blocked degraded最多Operations |
| H9 peripheral | Command / InboundConsumer / OperationsJob |最多Operations；Consumer仅限accepted feedback branch；local delivery result不进入Timeline |
| H10 reference | Command / InboundConsumer / OperationsJob |Resolved/Stale/Unresolved可Timeline；Invalid/Unavailable最多Operations |
| H11 maintenance | Command / InboundConsumer / ResidentWorker / OperationsJob |最多Operations；按accepted-input variant继续收窄 |
| H12 gap scan | OperationsJob only |最多Operations |
| H13 replay | OperationsJob only |最多Operations |

## 67. H8 `GapTransitionRecord`

### 67.1 capability / two-owner boundary

H8以一个`GapStateRef`为审计锚，记录gap首次打开、acknowledge、mitigate、resolve，或与该gap明确绑定的immutable `DegradedOutputState` revision创建/替换。gap lifecycle和degraded revision仍由两个不同对象拥有；H8的tagged source只把它们放进同一可追溯family，不允许degraded branch打开、关闭或重分类gap，也不允许gap branch从after revision猜P13 policy basis。

概要候选`Escalated`没有current state、member或transition owner，因此为`HX`，不生成H8 variant。`Suppressed`有state但current suppress/unsuppress均返回`ReservedTransition`，所以不生成current record。没有exact `gap_ref`的Normal/Blocked degraded revision不进入H8，分类为`explicit_no_record`；同步Query的process-local P13 decision同样零writer。

### 67.2 affected creation proof与support carrier

```rust
/// Accepted creation of one policy-classified gap.
pub struct GapOpened {
    gap_ref: GapStateRef,
    source_ref: GapSourceRef,
    gap_kind: GapKind,
    affected_object_ref: AffectedObservationObjectRef,
    opened_at: ObservedAt,
    policy_basis: PolicyEvaluationBasis,
}

/// Accepted creation of one immutable degraded-output revision.
pub struct DegradedOutputCreated {
    degraded_ref: DegradedOutputRef,
    affected_object_ref: AffectedObservationObjectRef,
    state: DegradedOutputKind,
    reason: Option<DegradedReason>,
    block_reason: Option<DegradedBlockReason>,
    gap_ref: Option<GapStateRef>,
    visibility_scope_ref: VisibilityScopeRef,
    limited_consumption_allowed: bool,
    policy_basis: PolicyEvaluationBasis,
}
```

`GapOpened`唯一owner为`domain::gap`。`GapState::open_from_decision(...)`改为返回`Result<(GapState, GapOpened), DomainError>`；proof逐字段复制P12 classified decision和新对象初始`Open/None/None`结果。`DegradedOutputCreated`同属`domain::gap`，由`create_from_decision(...) -> Result<(DegradedOutputState, DegradedOutputCreated), DomainError>`与新revision一起返回。两种proof均字段private、constructor `pub(crate)`且无serde/default/builder；record只借用，不保存proof对象本身。

```rust
/// Exact H8 subject branch selected by an accepted local change.
pub enum GapTransitionSubject {
    Gap(GapStateRef),
    DegradedOutput {
        gap_ref: GapStateRef,
        degraded_ref: DegradedOutputRef,
    },
}

/// Finite accepted change written by H8.
pub enum GapTransitionChangeKind {
    Opened,
    Acknowledged,
    Mitigated,
    Resolved,
    DegradedOutputCreated,
    DegradedOutputReplaced,
}

/// Exact policy provenance of one H8 branch.
pub enum GapTransitionPolicyBasis {
    GapClassification(PolicyEvaluationBasis),
    DegradedOutput(PolicyEvaluationBasis),
    Direct,
}
```

`Opened`只接受P12 basis，两个degraded branch只接受P13 basis，acknowledge/mitigate/resolve固定`Direct`。basis不能从post gap、degraded revision或最近一次aggregate policy snapshot取得。`GapTransitionSubject::DegradedOutput`要求record锚点、degraded revision的`gap_ref`与loaded gap identity三者exact。

### 67.3 accepted input / same-UoW post-state

```rust
pub enum GapTransitionAcceptedInput<'a> {
    GapOpened(&'a GapOpened),
    GapAcknowledged(&'a GapTransition),
    GapMitigated(&'a GapTransition),
    GapResolved(&'a GapTransition),
    DegradedOutputCreated(&'a DegradedOutputCreated),
    DegradedOutputReplaced(&'a DegradedOutputTransition),
}

pub enum GapTransitionPostState<'a> {
    Gap(&'a GapState),
    DegradedOutput {
        gap: &'a GapState,
        degraded: &'a DegradedOutputState,
    },
}
```

`GapOpened`只能配`Gap(Open)`，source/kind/affected/opened time与proof全等且degraded/close fields为None。`GapChanged`只能配同identity gap；acknowledge要求`Open -> Acknowledged`与actor Some，mitigate要求state为Open/Acknowledged到Acknowledged且degraded ref变化，resolve要求`Open/Acknowledged/Suppressed -> Resolved`与typed close reason/time。进入`Suppressed`或从`Suppressed`执行unsuppress仍为reserved；对已存在的historical Suppressed gap执行typed close是canonical current member允许的唯一outgoing branch。

Degraded creation/replacement只在post revision `gap_ref=Some`时进入H8；factory还加载该gap并要求其identity、affected object一致且lifecycle为Open/Acknowledged。creation proof和post revision逐字段全等；replacement transition提供完整previous/current conditional fields，post revision提供after。没有gap的revision、exact replay `Ok(None)`或同步Query decision均没有H8 accepted input。

### 67.4 exact record / revision / change schema

```rust
pub struct GapTransitionRecord {
    metadata: ObservationRecordMetadata<GapTransitionRecordRef>,
    gap_ref: GapStateRef,
    source: GapTransitionSubject,
    change_kind: GapTransitionChangeKind,
    before: Option<GapTransitionRevision>,
    change: GapTransitionChange,
    after: GapTransitionRevision,
    policy_basis: GapTransitionPolicyBasis,
}

pub enum GapTransitionRevision {
    Gap(GapRecordRevision),
    DegradedOutput(DegradedOutputRecordRevision),
}

pub struct GapRecordRevision {
    gap_ref: GapStateRef,
    source_ref: GapSourceRef,
    gap_kind: GapKind,
    state: GapLifecycleState,
    affected_object_ref: AffectedObservationObjectRef,
    degraded_ref: Option<DegradedOutputRef>,
    opened_at: ObservedAt,
    closed_at: Option<ObservedAt>,
    close_reason: Option<GapCloseReason>,
}

pub struct DegradedOutputRecordRevision {
    degraded_ref: DegradedOutputRef,
    affected_object_ref: AffectedObservationObjectRef,
    state: DegradedOutputKind,
    reason: Option<DegradedReason>,
    block_reason: Option<DegradedBlockReason>,
    gap_ref: Option<GapStateRef>,
    visibility_scope_ref: VisibilityScopeRef,
    limited_consumption_allowed: bool,
}

pub enum GapTransitionChange {
    GapOpened {
        source_ref: GapSourceRef,
        gap_kind: GapKind,
        affected_object_ref: AffectedObservationObjectRef,
        opened_at: ObservedAt,
    },
    GapAcknowledged {
        actor_ref: ActorSafeRef,
    },
    GapMitigated {
        previous_degraded_ref: Option<DegradedOutputRef>,
        current_degraded_ref: DegradedOutputRef,
    },
    GapResolved {
        reason: GapCloseReason,
        closed_at: ObservedAt,
    },
    DegradedOutputCreated {
        degraded_ref: DegradedOutputRef,
    },
    DegradedOutputReplaced {
        previous_degraded_ref: DegradedOutputRef,
        current_degraded_ref: DegradedOutputRef,
    },
}
```

| branch | before | after / change | metadata ceiling |
|---|---|---|---|
| gap opened | None | complete Gap(Open) + exact classification payload | UnsafeOutput最多Operations，否则Timeline |
| acknowledged | Gap(Open) | Gap(Acknowledged) + metadata actor-exact acknowledgement | Timeline |
| mitigated | Gap(Open/Acknowledged) | Gap(Acknowledged) + changed degraded ref | Timeline |
| resolved | Gap(Open/Acknowledged/Suppressed) | Gap(Resolved) + close reason/time；不声称source repaired | Timeline |
| degraded created | None | complete DegradedOutput + exact new ref | Blocked最多Operations，否则Timeline |
| degraded replaced | previous complete revision | current complete revision + old/new ref | Blocked target最多Operations，否则Timeline |

acknowledgement change中的actor必须等于metadata actor；这证明本次local acknowledgement attribution，但不表示actor拥有业务授权truth。gap/degraded reason已完整保存在revision/change，不增加free-form `GapTransitionReason`。mapper不得把enum Debug或serialized transition blob作为persisted payload。

### 67.5 factory、inspection与validated rehydrate

```rust
impl GapTransitionRecord {
    pub fn from_accepted(
        accepted: GapTransitionAcceptedInput<'_>,
        post_state: GapTransitionPostState<'_>,
        metadata: ObservationRecordMetadata<GapTransitionRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<GapTransitionRecordRef>,
        gap_ref: GapStateRef,
        source: GapTransitionSubject,
        change_kind: GapTransitionChangeKind,
        before: Option<GapTransitionRevision>,
        change: GapTransitionChange,
        after: GapTransitionRevision,
        policy_basis: GapTransitionPolicyBasis,
    ) -> Result<Self, DomainError>;

    pub fn metadata(&self) -> &ObservationRecordMetadata<GapTransitionRecordRef>;
    pub fn gap_ref(&self) -> &GapStateRef;
    pub fn source(&self) -> &GapTransitionSubject;
    pub fn change_kind(&self) -> GapTransitionChangeKind;
    pub fn before(&self) -> Option<&GapTransitionRevision>;
    pub fn change(&self) -> &GapTransitionChange;
    pub fn after(&self) -> &GapTransitionRevision;
    pub fn policy_basis(&self) -> &GapTransitionPolicyBasis;
}

impl GapRecordRevision {
    pub fn try_rehydrate(
        gap_ref: GapStateRef,
        source_ref: GapSourceRef,
        gap_kind: GapKind,
        state: GapLifecycleState,
        affected_object_ref: AffectedObservationObjectRef,
        degraded_ref: Option<DegradedOutputRef>,
        opened_at: ObservedAt,
        closed_at: Option<ObservedAt>,
        close_reason: Option<GapCloseReason>,
    ) -> Result<Self, DomainError>;

    pub fn gap_ref(&self) -> &GapStateRef;
    pub fn source_ref(&self) -> &GapSourceRef;
    pub fn gap_kind(&self) -> GapKind;
    pub fn state(&self) -> GapLifecycleState;
    pub fn affected_object_ref(&self) -> &AffectedObservationObjectRef;
    pub fn degraded_ref(&self) -> Option<&DegradedOutputRef>;
    pub fn opened_at(&self) -> &ObservedAt;
    pub fn closed_at(&self) -> Option<&ObservedAt>;
    pub fn close_reason(&self) -> Option<&GapCloseReason>;
}

impl DegradedOutputRecordRevision {
    pub fn try_rehydrate(
        degraded_ref: DegradedOutputRef,
        affected_object_ref: AffectedObservationObjectRef,
        state: DegradedOutputKind,
        reason: Option<DegradedReason>,
        block_reason: Option<DegradedBlockReason>,
        gap_ref: Option<GapStateRef>,
        visibility_scope_ref: VisibilityScopeRef,
        limited_consumption_allowed: bool,
    ) -> Result<Self, DomainError>;

    pub fn degraded_ref(&self) -> &DegradedOutputRef;
    pub fn affected_object_ref(&self) -> &AffectedObservationObjectRef;
    pub fn state(&self) -> DegradedOutputKind;
    pub fn reason(&self) -> Option<&DegradedReason>;
    pub fn block_reason(&self) -> Option<&DegradedBlockReason>;
    pub fn gap_ref(&self) -> Option<&GapStateRef>;
    pub fn visibility_scope_ref(&self) -> &VisibilityScopeRef;
    pub fn limited_consumption_allowed(&self) -> bool;
}
```

factory/rehydrate必须验证：metadata origin/visibility/Observation cursor；subject与revision tag；creation的before None；lifecycle的before Some；state/conditional matrix；P12/P13 family；gap/degraded/affected relation；ack actor；close reason/time；replacement identity变化。`GapState::Suppressed`可作为historical recovery shape被Gap revision rehydrate，并且只允许typed close形成`Suppressed -> Resolved` H8；进入Suppressed或其他outgoing change均拒绝。

### 67.6 append-only / planned tests / stop review

H8没有open/ack/mitigate/resolve/replace member；它不调用P12/P13、不创建gap/degraded identity、不写view/outbox、不关闭source gap。planned tests覆盖gap open/ack/mitigate/close（含historical Suppressed close）、2 degraded branch、两种creation proof不可公开构造、all state/reason/optional matrices、gapless degraded explicit-no-record、suppress/unsuppress reserved、Escalated absence、cross-gap/cross-affected/cross-policy、ack actor mismatch、origin/visibility/cursor、validated round-trip/corrupt row、factory error与append/CAS rollback，以及body/locator/provider/source-repaired/verdict/signoff扫描。对象停审：`pass_R06.5-G_H8_design_only`。

## 68. H9 `PeripheralDeliveryRecord`

### 68.1 capability / two-lifecycle boundary

H9记录一个本地peripheral delivery attempt或一个external-audit/export preparation的observability-owned生命周期变化。`PeripheralDeliveryState`拥有delivery attempt，`ExternalAuditExportPreparation`拥有preparation；两者在record中用tagged subject区分，不能把preparation的`Ready`、delivery的`Prepared`或adapter返回的`Delivered`折叠成同一个状态。H9只表达本地body-free view已准备、被边界阻断、adapter-independent result已映射或准备输入发生变化，不表达consumer接收、external audit验收、产品状态、report verdict、signoff或source truth。

`PeripheralDeliveryTransition`与`ExportPreparationTransition`中的policy branch必须分别保留P14 basis；`record_delivery`、`attach_gap`、`fail_retryable`和adapter result branch固定无policy basis。旧概要的`ready/delivered/failed/suppressed`自由字符串和单一`delivery_state`均为historical material；`Cancelled`仍是reserved，不能生成H9 record。

### 68.2 exact support carrier

```rust
/// Exact local lifecycle subject represented by one H9 record.
pub enum PeripheralDeliverySubject {
    Delivery {
        delivery_ref: PeripheralDeliveryRef,
        preparation_ref: ExternalAuditExportPreparationRef,
    },
    Preparation {
        preparation_ref: ExternalAuditExportPreparationRef,
    },
}

/// Finite accepted delivery/preparation change; no string fallback.
pub enum PeripheralDeliveryChangeKind {
    DeliveryPrepared,
    DeliveryBlocked,
    DeliveryDelivered,
    DeliveryRetryableFailed,
    DeliveryPermanentlyFailed,
    DeliveryRejected,
    PreparationPendingEvidence,
    PreparationPrepared,
    PreparationBlocked,
    PreparationGapAttached,
    PreparationDelivered,
    PreparationRetryableFailed,
    PreparationPermanentlyFailed,
    PreparationRejected,
}

/// Typed reason/result retained only on the matching H9 branch.
pub enum PeripheralDeliveryRecordReason {
    DeliveryBlock(PeripheralBlockReason),
    DeliveryResult(PeripheralDeliveryResult),
    DeliveryFailure(ExportFailureReason),
    PreparationBlock(ExportBlockReason),
    PreparationFailure(ExportFailureReason),
    GapAttached(GapStateRef),
}

/// Policy provenance for a policy-driven H9 branch.
pub enum PeripheralDeliveryPolicyBasis {
    Delivery(PolicyEvaluationBasis),
    Preparation(PolicyEvaluationBasis),
    None,
}
```

`PeripheralDeliveryPolicyBasis::Delivery`和`Preparation`都必须是P14 family；`None`只允许adapter/direct local branches。`PeripheralDeliverySubject::Delivery`的preparation ref必须等于loaded delivery state，consumer/view关系必须由post-state提供；Preparation branch不能携带delivery ref。Reason与kind的组合必须total：blocked只能带对应block reason，terminal/retryable result只能带对应result/failure，gap attachment只能带exact gap ref。

### 68.3 accepted input / same-UoW post-state

```rust
pub enum PeripheralDeliveryAcceptedInput<'a> {
    DeliveryPrepared {
        transition: &'a PeripheralDeliveryTransition,
        decision: &'a PeripheralDeliveryDecision,
    },
    DeliveryBlocked {
        transition: &'a PeripheralDeliveryTransition,
        decision: &'a PeripheralDeliveryDecision,
    },
    DeliveryResult {
        transition: &'a PeripheralDeliveryTransition,
    },
    PreparationDecision {
        transition: &'a ExportPreparationTransition,
        decision: &'a ExportPreparationDecision,
    },
    PreparationGapAttached {
        transition: &'a ExportPreparationTransition,
        gap: &'a GapState,
    },
    PreparationDeliveryResult {
        transition: &'a ExportPreparationTransition,
    },
    PreparationRetryableFailure {
        transition: &'a ExportPreparationTransition,
    },
}

pub enum PeripheralDeliveryPostState<'a> {
    Delivery(&'a PeripheralDeliveryState),
    Preparation(&'a ExternalAuditExportPreparation),
}
```

The factory first matches the accepted tag to the transition type and then checks the same-UoW post-state. `DeliveryPrepared` requires `Pending/Blocked/RetryableFailed -> Prepared`, decision `allowed=true`, exact P14 input and current visibility/gaps. `DeliveryBlocked` requires a non-allowed P14 decision and post `Blocked` with no result/failure. `DeliveryResult` maps only an accepted `Prepared -> Delivered/Failed` delta; its result and failure reason come from the post delivery state, not from metadata or an adapter error string. `PreparationDecision` maps P14 `PendingEvidence`, `Ready/Degraded` or `Blocked` to the exact post preparation matrix. `PreparationGapAttached` requires `Draft` and an exact dependency-member gap; it must not carry a prior P14 basis. `PreparationDeliveryResult` and `PreparationRetryableFailure` consume their local transition and post-state without policy replay.

An initial `PeripheralDeliveryState::pending` or `ExternalAuditExportPreparation::draft` has no accepted transition and is `explicit_no_record`. Exact replay returning `Ok(None)` is also no-record. `Cancelled`, terminal state reuse and stale/terminal decision calls are rejected or reserved before record construction.

### 68.4 exact record / revision / change schema

```rust
pub struct PeripheralDeliveryRecord {
    metadata: ObservationRecordMetadata<PeripheralDeliveryRecordRef>,
    subject: PeripheralDeliverySubject,
    change_kind: PeripheralDeliveryChangeKind,
    before: PeripheralDeliveryRevision,
    change: PeripheralDeliveryChange,
    after: PeripheralDeliveryRevision,
    reason: Option<PeripheralDeliveryRecordReason>,
    policy_basis: PeripheralDeliveryPolicyBasis,
}

pub enum PeripheralDeliveryRevision {
    Delivery(PeripheralDeliveryStateRevision),
    Preparation(ExportPreparationRevision),
}

pub struct PeripheralDeliveryStateRevision {
    delivery_ref: PeripheralDeliveryRef,
    preparation_ref: ExternalAuditExportPreparationRef,
    consumer_ref: PeripheralConsumerRef,
    view_ref: DashboardAlertExportViewRef,
    visibility: Option<VisibilitySurface>,
    state: PeripheralDeliveryKind,
    result: Option<PeripheralDeliveryResult>,
    block_reason: Option<PeripheralBlockReason>,
    failure_reason: Option<ExportFailureReason>,
    gap_refs: GapStateRefSet,
    updated_at: ObservedAt,
}

pub struct ExportPreparationRevision {
    preparation_ref: ExternalAuditExportPreparationRef,
    consumer_ref: PeripheralConsumerRef,
    evidence_index_input_ref: EvidenceIndexInputViewRef,
    view_ref: DashboardAlertExportViewRef,
    visibility: Option<VisibilitySurface>,
    state: ExportPreparationState,
    gap_refs: GapStateRefSet,
    readiness: HandoffReadinessState,
    failure_reason: Option<ExportFailureReason>,
    block_reason: Option<ExportBlockReason>,
    delivery_result: Option<PeripheralDeliveryResult>,
    updated_at: ObservedAt,
}

pub enum PeripheralDeliveryChange {
    DeliveryPrepared,
    DeliveryBlocked { reason: PeripheralBlockReason },
    DeliveryResult {
        result: PeripheralDeliveryResult,
        failure_reason: Option<ExportFailureReason>,
    },
    PreparationPendingEvidence,
    PreparationPrepared { readiness: HandoffReadinessState },
    PreparationBlocked { reason: ExportBlockReason },
    PreparationGapAttached { gap_ref: GapStateRef },
    PreparationDeliveryResult {
        result: PeripheralDeliveryResult,
        failure_reason: Option<ExportFailureReason>,
    },
    PreparationRetryableFailure { reason: ExportFailureReason },
}
```

For both lifecycle families the `before` revision is the complete pre-mutation snapshot carried by the transition fields plus the loaded immutable relation; it is never reconstructed from the post-state. The `after` revision is assembled from the same-UoW post-state and must satisfy the exact conditional matrix:

| branch | before -> after | reason / basis |
|---|---|---|
| delivery prepared | Pending/Blocked/RetryableFailed -> Prepared | no reason; `Delivery(P14)` |
| delivery blocked | Pending/Prepared/RetryableFailed -> Blocked | block reason; `Delivery(P14)` |
| delivery result | Prepared -> Delivered/Failed | result + compatible failure; `None` |
| preparation pending | any allowed Draft/Blocked/retryable Failed decision -> Draft with `PendingEvidence` | no reason; `Preparation(P14)` |
| preparation prepared | Draft/Blocked/retryable Failed -> Prepared | readiness Ready/Degraded; `Preparation(P14)` |
| preparation blocked | Draft/Prepared/Blocked/retryable Failed -> Blocked | block reason; `Preparation(P14)` |
| preparation gap | Draft -> Draft with one new gap | exact gap ref; `None` |
| preparation delivery | Prepared -> Delivered/Failed | result + compatible failure; `None` |
| preparation retryable failure | Draft/Prepared -> Failed with no delivery result | retryable failure; `None` |

`PermanentFailure` and `Rejected` are terminal local outcomes and still require a typed accepted transition when the owning member first commits the `Failed` state; they cannot be silently dropped after mutation. R06.4's “no outgoing delta” means there is no later transition out of that terminal failed state. If an implementation rejects the operation before mutation, it produces no transition and no H9 record.

The record never stores destination, endpoint, credential, provider receipt, response body, retry count, external run id, acceptance or verdict. `Delivered` remains a local adapter boundary fact.

### 68.5 factory / inspection / validated rehydrate

```rust
impl PeripheralDeliveryRecord {
    pub fn from_accepted(
        accepted: PeripheralDeliveryAcceptedInput<'_>,
        post_state: PeripheralDeliveryPostState<'_>,
        metadata: ObservationRecordMetadata<PeripheralDeliveryRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<PeripheralDeliveryRecordRef>,
        subject: PeripheralDeliverySubject,
        change_kind: PeripheralDeliveryChangeKind,
        before: PeripheralDeliveryRevision,
        change: PeripheralDeliveryChange,
        after: PeripheralDeliveryRevision,
        reason: Option<PeripheralDeliveryRecordReason>,
        policy_basis: PeripheralDeliveryPolicyBasis,
    ) -> Result<Self, DomainError>;

    pub fn metadata(&self) -> &ObservationRecordMetadata<PeripheralDeliveryRecordRef>;
    pub fn subject(&self) -> &PeripheralDeliverySubject;
    pub fn change_kind(&self) -> PeripheralDeliveryChangeKind;
    pub fn before(&self) -> &PeripheralDeliveryRevision;
    pub fn change(&self) -> &PeripheralDeliveryChange;
    pub fn after(&self) -> &PeripheralDeliveryRevision;
    pub fn reason(&self) -> Option<&PeripheralDeliveryRecordReason>;
    pub fn policy_basis(&self) -> &PeripheralDeliveryPolicyBasis;
}

impl PeripheralDeliveryStateRevision {
    pub fn try_rehydrate(
        delivery_ref: PeripheralDeliveryRef,
        preparation_ref: ExternalAuditExportPreparationRef,
        consumer_ref: PeripheralConsumerRef,
        view_ref: DashboardAlertExportViewRef,
        visibility: Option<VisibilitySurface>,
        state: PeripheralDeliveryKind,
        result: Option<PeripheralDeliveryResult>,
        block_reason: Option<PeripheralBlockReason>,
        failure_reason: Option<ExportFailureReason>,
        gap_refs: GapStateRefSet,
        updated_at: ObservedAt,
    ) -> Result<Self, DomainError>;

    pub fn delivery_ref(&self) -> &PeripheralDeliveryRef;
    pub fn preparation_ref(&self) -> &ExternalAuditExportPreparationRef;
    pub fn consumer_ref(&self) -> &PeripheralConsumerRef;
    pub fn view_ref(&self) -> &DashboardAlertExportViewRef;
    pub fn visibility(&self) -> Option<&VisibilitySurface>;
    pub fn state(&self) -> PeripheralDeliveryKind;
    pub fn result(&self) -> Option<PeripheralDeliveryResult>;
    pub fn block_reason(&self) -> Option<&PeripheralBlockReason>;
    pub fn failure_reason(&self) -> Option<&ExportFailureReason>;
    pub fn gap_refs(&self) -> &GapStateRefSet;
    pub fn updated_at(&self) -> &ObservedAt;
}

impl ExportPreparationRevision {
    pub fn try_rehydrate(
        preparation_ref: ExternalAuditExportPreparationRef,
        consumer_ref: PeripheralConsumerRef,
        evidence_index_input_ref: EvidenceIndexInputViewRef,
        view_ref: DashboardAlertExportViewRef,
        visibility: Option<VisibilitySurface>,
        state: ExportPreparationState,
        gap_refs: GapStateRefSet,
        readiness: HandoffReadinessState,
        failure_reason: Option<ExportFailureReason>,
        block_reason: Option<ExportBlockReason>,
        delivery_result: Option<PeripheralDeliveryResult>,
        updated_at: ObservedAt,
    ) -> Result<Self, DomainError>;

    pub fn preparation_ref(&self) -> &ExternalAuditExportPreparationRef;
    pub fn consumer_ref(&self) -> &PeripheralConsumerRef;
    pub fn evidence_index_input_ref(&self) -> &EvidenceIndexInputViewRef;
    pub fn view_ref(&self) -> &DashboardAlertExportViewRef;
    pub fn visibility(&self) -> Option<&VisibilitySurface>;
    pub fn state(&self) -> ExportPreparationState;
    pub fn gap_refs(&self) -> &GapStateRefSet;
    pub fn readiness(&self) -> HandoffReadinessState;
    pub fn failure_reason(&self) -> Option<&ExportFailureReason>;
    pub fn block_reason(&self) -> Option<&ExportBlockReason>;
    pub fn delivery_result(&self) -> Option<PeripheralDeliveryResult>;
    pub fn updated_at(&self) -> &ObservedAt;
}
```

Rehydration validates subject/revision tag, identity relations, state/result/failure/block/readiness/visibility matrix, gap-set ownership, policy-basis family and metadata origin/visibility/cursor. It does not call P14 or an adapter. No record member updates either lifecycle; retry requires a new policy decision or a new delivery identity according to the owning state contract, never mutation of the stored record.

### 68.6 append-only / planned tests / stop review

H9 has no delivery/preparation mutation member and no adapter call. Planned tests cover all eight preparation and six delivery mapping branches, P14 basis present/absent matrix, PendingEvidence versus Prepared, retryable versus terminal failure, block/result incompatibility, gap membership, consumer/view/preparation cross-binding, exact origin/Operations visibility ceiling, typed rehydrate round-trip and corrupt rows, factory/append/CAS rollback, and scans rejecting endpoint/credential/provider payload/external acceptance/verdict/signoff. `Cancelled`, initial draft/pending factories, stale decision and pre-mutation rejection are explicit no-record or reserved cases. Object stop: `pass_R06.5-G_H9_design_only`。

## 69. H10 `ReferenceRefreshRecord`

### 69.1 capability / reference truth boundary

H10记录一个本地`ReferenceSnapshotState`的body-free refresh/result变化。它同时覆盖原snapshot identity上的in-place状态变化，以及P15要求新identity时从旧`Invalid` snapshot建立新revision的accepted creation branch。H10只表达resolver结果已被本仓 typed boundary 接受、freshness/resolution state在本地改变或本地快照需要换代；它不拥有外部引用、source version truth、resolver body、provider lifecycle、external acceptance或source repair。

`ReferenceSnapshotTransition`是in-place branch的唯一accepted delta。`RequireNewSnapshot`没有旧row transition，因此不能由record factory凭`Invalid`当前状态伪造；G批新增的`ReferenceSnapshotCreated`是由owning `create_from_required_new_snapshot`与新对象一起返回的creation proof。`PreserveCurrent`、P16 structural success、resolver error未形成accepted local mutation时均为`explicit_no_record`。

### 69.2 exact support carrier

```rust
/// Accepted creation of a new local snapshot identity after an invalid revision.
pub struct ReferenceSnapshotCreated {
    previous_snapshot_ref: ReferenceSnapshotStateRef,
    previous_subject_ref: ReferenceSubjectRef,
    previous_state: ReferenceSnapshotStateKind,
    snapshot_ref: ReferenceSnapshotStateRef,
    subject_ref: ReferenceSubjectRef,
    state: ReferenceSnapshotStateKind,
    safe_summary_ref: Option<SafeExternalSummaryRef>,
    source_version: Option<ObservationSourceVersionRef>,
    stale_reason: Option<ReferenceStaleReason>,
    resolution_reason: Option<ReferenceResolutionReason>,
    invalid_reason: Option<ReferenceInvalidReason>,
    observed_at: ObservedAt,
    maintenance_policy_basis: PolicyEvaluationBasis,
    freshness_policy_basis: PolicyEvaluationBasis,
}

/// Exact subject of one reference-refresh history row.
pub enum ReferenceRefreshSubject {
    InPlace {
        snapshot_ref: ReferenceSnapshotStateRef,
        subject_ref: ReferenceSubjectRef,
    },
    NewSnapshot {
        previous_snapshot_ref: ReferenceSnapshotStateRef,
        snapshot_ref: ReferenceSnapshotStateRef,
        subject_ref: ReferenceSubjectRef,
    },
}

/// Finite accepted local refresh change.
pub enum ReferenceRefreshChangeKind {
    Resolved,
    Stale,
    Unresolved,
    Invalid,
    Unavailable,
    NewSnapshotFromInvalid,
}

/// Typed result/reason payload for a reference refresh record.
pub enum ReferenceRefreshRecordReason {
    Stale(ReferenceStaleReason),
    Resolution(ReferenceResolutionReason),
    Invalid(ReferenceInvalidReason),
}

/// Both policy evaluations are retained when a refresh was accepted.
pub enum ReferenceRefreshPolicyBasis {
    InPlace {
        maintenance: PolicyEvaluationBasis,
        freshness: PolicyEvaluationBasis,
    },
    NewSnapshot {
        maintenance: PolicyEvaluationBasis,
        freshness: PolicyEvaluationBasis,
    },
}
```

`ReferenceSnapshotCreated`的两个snapshot ref必须不同，两个subject ref必须相等，`previous_state`必须为`Invalid`；当前结果的条件字段必须与新对象逐字段相等。P17 basis必须是`DerivedMaintenance`，P15 basis必须是`ReferenceFreshness`；两者的target、subject、P10 guard relation由owning member再次检查。`ReferenceRefreshRecordReason`只在Stale/Unresolved/Invalid/Unavailable对应分支保存；Resolved和NewSnapshot branch不使用自由原因。`Unavailable`复用typed `ReferenceResolutionReason`，不存resolver error文本。

### 69.3 affected creation definition and accepted input

R06.4 `ReferenceSnapshotState::create_from_required_new_snapshot(...)` current definition同步为：

```rust
pub fn create_from_required_new_snapshot(
    snapshot_ref: ReferenceSnapshotStateRef,
    previous: &ReferenceSnapshotState,
    target: &MaintenanceTargetPolicySnapshot,
    maintenance: &DerivedMaintenanceDecision,
    decision: &ReferenceFreshnessDecision,
) -> Result<(ReferenceSnapshotState, ReferenceSnapshotCreated), DomainError>;
```

该member在返回前复制旧`Invalid` revision、new snapshot全部conditional fields及两个accepted basis到private proof；失败或UoW rollback时proof不形成durable fact。proof不是transition、policy decision、record ref或job result。

```rust
pub enum ReferenceRefreshAcceptedInput<'a> {
    Resolved {
        transition: &'a ReferenceSnapshotTransition,
    },
    Stale {
        transition: &'a ReferenceSnapshotTransition,
    },
    Unresolved {
        transition: &'a ReferenceSnapshotTransition,
    },
    Invalid {
        transition: &'a ReferenceSnapshotTransition,
    },
    Unavailable {
        transition: &'a ReferenceSnapshotTransition,
    },
    NewSnapshot {
        creation: &'a ReferenceSnapshotCreated,
    },
}

pub enum ReferenceRefreshPostState<'a> {
    InPlace(&'a ReferenceSnapshotState),
    NewSnapshot {
        previous: &'a ReferenceSnapshotState,
        current: &'a ReferenceSnapshotState,
    },
}
```

每个in-place tag只允许对应的`to_state`（Resolved/Stale/Unresolved/Invalid/Unavailable），并要求transition snapshot ref、subject、from/to与post state exact；transition中的两个 basis必须完整且family正确。`NewSnapshot`要求creation proof的previous state/ref与loaded previous object exact、previous state为Invalid、current object identity为new ref且subject相同；creation result的conditional matrix必须与current post state exact。没有transition或creation proof的current row不能进入H10。

### 69.4 exact record / revision / change schema

```rust
pub struct ReferenceRefreshRecord {
    metadata: ObservationRecordMetadata<ReferenceRefreshRecordRef>,
    subject: ReferenceRefreshSubject,
    change_kind: ReferenceRefreshChangeKind,
    before: ReferenceSnapshotRevision,
    change: ReferenceRefreshChange,
    after: ReferenceSnapshotRevision,
    reason: Option<ReferenceRefreshRecordReason>,
    policy_basis: ReferenceRefreshPolicyBasis,
}

pub struct ReferenceSnapshotRevision {
    snapshot_ref: ReferenceSnapshotStateRef,
    subject_ref: ReferenceSubjectRef,
    state: ReferenceSnapshotStateKind,
    safe_summary_ref: Option<SafeExternalSummaryRef>,
    source_version: Option<ObservationSourceVersionRef>,
    stale_reason: Option<ReferenceStaleReason>,
    resolution_reason: Option<ReferenceResolutionReason>,
    invalid_reason: Option<ReferenceInvalidReason>,
    observed_at: ObservedAt,
}

pub enum ReferenceRefreshChange {
    Resolved {
        safe_summary_ref: SafeExternalSummaryRef,
        source_version: ObservationSourceVersionRef,
    },
    Stale {
        reason: ReferenceStaleReason,
    },
    Unresolved {
        reason: ReferenceResolutionReason,
    },
    Invalid {
        reason: ReferenceInvalidReason,
    },
    Unavailable {
        reason: ReferenceResolutionReason,
    },
    NewSnapshotFromInvalid {
        previous_snapshot_ref: ReferenceSnapshotStateRef,
        snapshot_ref: ReferenceSnapshotStateRef,
    },
}
```

| branch | before | after | reason / basis |
|---|---|---|---|
| Resolved | same snapshot pre-state | Resolved with summary + source version | None; `InPlace(P17,P15)` |
| Stale | same snapshot pre-state | Stale with typed stale reason; usable pair follows P15 matrix | Some Stale; `InPlace(P17,P15)` |
| Unresolved | same snapshot pre-state | Unresolved with resolution reason | Some Resolution; `InPlace(P17,P15)` |
| Invalid | same snapshot pre-state | Invalid with invalid reason and no usable pair | Some Invalid; `InPlace(P17,P15)` |
| Unavailable | same snapshot pre-state | Unavailable with resolution reason | Some Resolution; `InPlace(P17,P15)` |
| NewSnapshotFromInvalid | previous Invalid snapshot | new identity with complete result state | None; `NewSnapshot(P17,P15)` |

The before revision for every in-place branch comes from the transition's previous fields and is never read back from the current row. For new identity, the before revision comes from `ReferenceSnapshotCreated` and the loaded previous invalid object; it is an explicit accepted creation proof, not a fabricated old-row transition. `Resolved` requires both safe refs, `Stale`/`Unresolved`/`Invalid`/`Unavailable` obey the exact R06.4 conditional matrix, and observed time cannot regress within an identity. `ReferenceRefreshRecord` never treats `source_version` as an external truth version or compares it by numeric/string ordering.

### 69.5 factory / inspection / validated rehydrate

```rust
impl ReferenceRefreshRecord {
    pub fn from_accepted(
        accepted: ReferenceRefreshAcceptedInput<'_>,
        post_state: ReferenceRefreshPostState<'_>,
        metadata: ObservationRecordMetadata<ReferenceRefreshRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<ReferenceRefreshRecordRef>,
        subject: ReferenceRefreshSubject,
        change_kind: ReferenceRefreshChangeKind,
        before: ReferenceSnapshotRevision,
        change: ReferenceRefreshChange,
        after: ReferenceSnapshotRevision,
        reason: Option<ReferenceRefreshRecordReason>,
        policy_basis: ReferenceRefreshPolicyBasis,
    ) -> Result<Self, DomainError>;

    pub fn metadata(&self) -> &ObservationRecordMetadata<ReferenceRefreshRecordRef>;
    pub fn subject(&self) -> &ReferenceRefreshSubject;
    pub fn change_kind(&self) -> ReferenceRefreshChangeKind;
    pub fn before(&self) -> &ReferenceSnapshotRevision;
    pub fn change(&self) -> &ReferenceRefreshChange;
    pub fn after(&self) -> &ReferenceSnapshotRevision;
    pub fn reason(&self) -> Option<&ReferenceRefreshRecordReason>;
    pub fn policy_basis(&self) -> &ReferenceRefreshPolicyBasis;
}

impl ReferenceSnapshotRevision {
    pub fn try_rehydrate(
        snapshot_ref: ReferenceSnapshotStateRef,
        subject_ref: ReferenceSubjectRef,
        state: ReferenceSnapshotStateKind,
        safe_summary_ref: Option<SafeExternalSummaryRef>,
        source_version: Option<ObservationSourceVersionRef>,
        stale_reason: Option<ReferenceStaleReason>,
        resolution_reason: Option<ReferenceResolutionReason>,
        invalid_reason: Option<ReferenceInvalidReason>,
        observed_at: ObservedAt,
    ) -> Result<Self, DomainError>;

    pub fn snapshot_ref(&self) -> &ReferenceSnapshotStateRef;
    pub fn subject_ref(&self) -> &ReferenceSubjectRef;
    pub fn state(&self) -> ReferenceSnapshotStateKind;
    pub fn safe_summary_ref(&self) -> Option<&SafeExternalSummaryRef>;
    pub fn source_version(&self) -> Option<&ObservationSourceVersionRef>;
    pub fn stale_reason(&self) -> Option<&ReferenceStaleReason>;
    pub fn resolution_reason(&self) -> Option<&ReferenceResolutionReason>;
    pub fn invalid_reason(&self) -> Option<&ReferenceInvalidReason>;
    pub fn observed_at(&self) -> &ObservedAt;
}
```

Factory and rehydration validate metadata origin (`Command`, `InboundConsumer` or `OperationsJob`), visibility ceiling, a present tagged committed cursor, subject/snapshot identity, before/after identity rules, state/conditional fields, result payload, P17/P15 family and same-target/P10 relation carried by the accepted proof/transition. `Command` is limited to accepted register/update snapshot branches. H10 accepts either tagged cursor variant because the domain factory does not receive the application write footprint: `Reference` is used by a reference-only UoW and `Observation` by a mixed observation-owned UoW. The F2 application plan is the sole owner of choosing and validating that class; the factory rejects only a missing cursor, not a valid tag based on hidden repository state. They do not run the 180-key policy table, call a resolver, reopen an invalid snapshot, create a gap, or mutate the old row. `PreserveCurrent`, malformed resolver output and rejected decision are no-record/error paths.

### 69.6 append-only / planned tests / stop review

H10 has no refresh/retry/resolve member; all local mutation belongs to `ReferenceSnapshotState` and its two decision-gated factories. Planned tests cover five in-place result branches plus new-identity creation, invalid-current requiring new ref, same-subject/different-ref relation, two-basis family and target binding, conditional field totality, source-version stream non-ordering, PreserveCurrent no-record, old-row immutability, origin/visibility/cursor, validated rehydrate/corrupt rows, factory/append/CAS rollback, and scans rejecting source body/provider payload/locator/external lifecycle/verdict/signoff. Object stop: `pass_R06.5-G_H10_design_only`.

## 70. H11 `ProjectionMaintenanceRecord`

### 70.1 capability / four maintenance subject boundary

H11记录observability-owned derived maintenance的accepted local change，覆盖四类subject：projection maintenance state、diagnostic summary replacement、signal rollup window变化和rollup rebuild attempt。它不记录source truth修复、source replay、external reference lifecycle、job report或业务成功。Projection与rollup的双namespace/observation cursor字段必须保持各自namespace；H11 metadata中的committed cursor只标识当前record所在UoW，不能替代subject内部coverage cursor。

`ProjectionMaintenanceTransition`、`DiagnosticSummaryTransition`、`SignalRollupTransition`和`RollupRebuildTransition`分别是canonical input owner。每个transition有独立tag，不能从after state、cursor变化或target kind猜H11 change kind。同步Query只产生process-local summary decision，不创建H11 record；maintenance failure是typed local outcome，不能被翻译成source operation failure。

### 70.2 exact support carrier

```rust
/// Exact derived-maintenance subject represented by H11.
pub enum ProjectionMaintenanceSubject {
    Projection {
        maintenance_ref: ProjectionMaintenanceRef,
        target_ref: MaintenanceTargetRef,
    },
    DiagnosticSummary {
        previous_summary_ref: DiagnosticSummaryRef,
        current_summary_ref: DiagnosticSummaryRef,
        scope_ref: DiagnosticScopeRef,
    },
    SignalRollup {
        window_ref: SignalRollupWindowRef,
    },
    RollupRebuild {
        rebuild_ref: RollupRebuildRef,
        window_ref: SignalRollupWindowRef,
    },
}

/// Finite operation classifier for one H11 record.
pub enum ProjectionMaintenanceChangeKind {
    ProjectionMarkedStale,
    ProjectionRebuildStarted,
    ProjectionRebuildCompleted,
    ProjectionMaintenanceFailed,
    DiagnosticSignalAttached,
    DiagnosticGapAttached,
    DiagnosticNoWriteViolationAttached,
    DiagnosticMarkedStale,
    DiagnosticMarkedUnavailable,
    RollupSignalAccepted,
    RollupSealedFresh,
    RollupRebuildStarted,
    RollupRebuildFailed,
    RollupExecutionStarted,
    RollupExecutionCompleted,
    RollupExecutionFailed,
}

/// Typed local reason/payload for an H11 branch.
pub enum ProjectionMaintenanceRecordReason {
    MaintenanceFailure(MaintenanceFailureReason),
    DiagnosticStaleness(StalenessReason),
    DiagnosticUnavailable(DiagnosticUnavailableReason),
    RollupFailure(MaintenanceFailureReason),
}

/// Policy provenance carried only by policy-driven maintenance starts.
pub enum ProjectionMaintenancePolicyBasis {
    DerivedMaintenance(PolicyEvaluationBasis),
    None,
}
```

`DerivedMaintenance`只允许P17 family，且只出现在Projection/Rebuild/rollup-start branches对应的 accepted transition；mark-stale、complete、fail、diagnostic attachment、rollup signal/seal/failure等direct lifecycle branch固定`None`。`ProjectionMaintenanceSubject`的四个tag与revision schema必须一一对应，不能用一个generic `MaintenanceTargetRef`覆盖diagnostic或rollup。

### 70.3 accepted input / same-UoW post-state

```rust
pub enum ProjectionMaintenanceAcceptedInput<'a> {
    ProjectionMarkedStale(&'a ProjectionMaintenanceTransition),
    ProjectionRebuildStarted(&'a ProjectionMaintenanceTransition),
    ProjectionRebuildCompleted(&'a ProjectionMaintenanceTransition),
    ProjectionMaintenanceFailed(&'a ProjectionMaintenanceTransition),
    DiagnosticSignalAttached(&'a DiagnosticSummaryTransition),
    DiagnosticGapAttached(&'a DiagnosticSummaryTransition),
    DiagnosticNoWriteViolationAttached(&'a DiagnosticSummaryTransition),
    DiagnosticMarkedStale(&'a DiagnosticSummaryTransition),
    DiagnosticMarkedUnavailable(&'a DiagnosticSummaryTransition),
    SignalRollupAccepted(&'a SignalRollupTransition),
    SignalRollupSealedFresh(&'a SignalRollupTransition),
    SignalRollupRebuildStarted(&'a SignalRollupTransition),
    SignalRollupRebuildFailed(&'a SignalRollupTransition),
    RollupExecutionStarted(&'a RollupRebuildTransition),
    RollupExecutionCompleted(&'a RollupRebuildTransition),
    RollupExecutionFailed(&'a RollupRebuildTransition),
}

pub enum ProjectionMaintenancePostState<'a> {
    Projection(&'a ProjectionMaintenanceState),
    DiagnosticSummary(&'a DiagnosticSummary),
    SignalRollup(&'a SignalRollupWindow),
    RollupRebuild(&'a RollupRebuildState),
}
```

The factory maps the accepted operation tag and canonical transition fields explicitly:

| accepted input | H11 kind | before source | after source |
|---|---|---|---|
| `ProjectionMarkedStale` tag | ProjectionMarkedStale | transition previous dual cursors/progress/failure | post maintenance state |
| `ProjectionRebuildStarted` tag | ProjectionRebuildStarted | transition previous snapshot | post state with Rebuilding/progress |
| `ProjectionRebuildCompleted` tag | ProjectionRebuildCompleted | transition previous snapshot | post Fresh and completed dual cursors |
| `ProjectionMaintenanceFailed` tag | ProjectionMaintenanceFailed | transition previous snapshot | post Failed + reason |
| five diagnostic tags | matching Diagnostic kind | transition complete previous revision | post summary revision |
| `SignalRollupAccepted` tag | RollupSignalAccepted | `SignalRollupRevisionSnapshot` | post window state/count/cursor/set |
| `SignalRollupSealedFresh` tag | RollupSealedFresh | transition previous snapshot | post Fresh |
| `SignalRollupRebuildStarted` tag | RollupRebuildStarted | transition previous snapshot | post Rebuilding |
| `SignalRollupRebuildFailed` tag | RollupRebuildFailed | transition previous snapshot | post Failed + reason |
| three execution tags | matching execution kind | transition previous snapshot | post rebuild state |

Any omitted, duplicate, or tag/transition mismatch returns `RecordConstructionMismatch(AcceptedInputKind)`. `SignalRollupTransition::SignalAccepted` must include `SignalRollupRevisionSnapshot` containing `window_ref`; its resulting state/count/cursor/set are cross-checked against post state. Diagnostic operation and its typed ref/reason are read from canonical `DiagnosticSummaryTransition::change`, never inferred from which set changed. A failed/duplicate domain member call produces no transition and no H11 record. `SignalRollupWindow::reopen_for_rebuild` is a direct lifecycle transition and therefore has no policy basis; only the separate P17-gated rollup execution start carries `DerivedMaintenance` provenance.

### 70.4 exact record / revision / change schema

```rust
pub struct ProjectionMaintenanceRecord {
    metadata: ObservationRecordMetadata<ProjectionMaintenanceRecordRef>,
    subject: ProjectionMaintenanceSubject,
    change_kind: ProjectionMaintenanceChangeKind,
    before: ProjectionMaintenanceRevision,
    change: ProjectionMaintenanceChange,
    after: ProjectionMaintenanceRevision,
    reason: Option<ProjectionMaintenanceRecordReason>,
    policy_basis: ProjectionMaintenancePolicyBasis,
}

pub enum ProjectionMaintenanceRevision {
    Projection(ProjectionMaintenanceRevisionSnapshot),
    DiagnosticSummary(DiagnosticSummaryRevision),
    SignalRollup(SignalRollupRevision),
    RollupRebuild(RollupRebuildRevision),
}

pub struct ProjectionMaintenanceRevisionSnapshot {
    maintenance_ref: ProjectionMaintenanceRef,
    target_ref: MaintenanceTargetRef,
    state: ProjectionMaintenanceStateKind,
    requires_observation_cursor: bool,
    requires_reference_cursor: bool,
    observation_cursor: Option<ObservationCursor>,
    reference_cursor: Option<ReferenceCursor>,
    progress_ref: Option<RebuildProgressViewRef>,
    failure_reason: Option<MaintenanceFailureReason>,
    updated_at: ObservedAt,
}

pub struct DiagnosticSummaryRevision {
    summary_ref: DiagnosticSummaryRef,
    scope_ref: DiagnosticScopeRef,
    freshness: DiagnosticFreshnessState,
    safe_signal_refs: SafeSignalRefSet,
    gap_refs: GapStateRefSet,
    no_write_violation_refs: NoWriteViolationRefSet,
    staleness_reason: Option<StalenessReason>,
    unavailable_reason: Option<DiagnosticUnavailableReason>,
    as_of_cursor: Option<ObservationCommittedCursor>,
    assembled_at: ObservedAt,
}

pub struct SignalRollupRevision {
    window_ref: SignalRollupWindowRef,
    scope: SignalRollupScope,
    window_kind: RollupWindowKind,
    window_start_at: ObservedAt,
    window_end_at: ObservedAt,
    state: SignalRollupState,
    signal_count: SignalCount,
    source_cursor: Option<ObservationCursor>,
    signal_refs: SafeSignalRefSet,
}

pub struct RollupRebuildRevision {
    rebuild_ref: RollupRebuildRef,
    window_ref: SignalRollupWindowRef,
    target_ref: MaintenanceTargetRef,
    state: RollupRebuildKind,
    source_cursor: Option<ObservationCursor>,
    rebuilt_count: Option<SignalCount>,
    progress_ref: Option<RebuildProgressViewRef>,
    failure_reason: Option<MaintenanceFailureReason>,
    updated_at: ObservedAt,
}

pub enum ProjectionMaintenanceChange {
    ProjectionMarkedStale,
    ProjectionRebuildStarted,
    ProjectionRebuildCompleted,
    ProjectionMaintenanceFailed {
        reason: MaintenanceFailureReason,
    },
    DiagnosticSignalAttached {
        signal_ref: SafeSignalRef,
    },
    DiagnosticGapAttached {
        gap_ref: GapStateRef,
    },
    DiagnosticNoWriteViolationAttached {
        violation_ref: NoWriteViolationRef,
    },
    DiagnosticMarkedStale {
        reason: StalenessReason,
    },
    DiagnosticMarkedUnavailable {
        reason: DiagnosticUnavailableReason,
    },
    RollupSignalAccepted {
        signal_ref: SafeSignalRef,
        committed_cursor: ObservationCursor,
        resulting_count: SignalCount,
    },
    RollupSealedFresh {
        included_through: Option<ObservationCursor>,
    },
    RollupMaintenanceStarted {
        target_ref: MaintenanceTargetRef,
    },
    RollupMaintenanceFailed {
        reason: MaintenanceFailureReason,
    },
    RebuildExecutionStarted,
    RebuildExecutionCompleted,
    RebuildExecutionFailed {
        reason: MaintenanceFailureReason,
    },
}
```

The change payload is deliberately typed but compact: all conditional before/after values live in the two revisions, while the accepted transition supplies the exact operation payload. Each diagnostic branch preserves the exact added ref or typed freshness reason. `RollupSignalAccepted` includes signal identity, committed cursor and resulting count, while `SignalRollupRevision` preserves the full pre/post signal set and state. No H11 field contains a job/run/report identity or raw signal material.

### 70.5 factory / inspection / validated rehydrate

```rust
impl ProjectionMaintenanceRecord {
    pub fn from_accepted(
        accepted: ProjectionMaintenanceAcceptedInput<'_>,
        post_state: ProjectionMaintenancePostState<'_>,
        metadata: ObservationRecordMetadata<ProjectionMaintenanceRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<ProjectionMaintenanceRecordRef>,
        subject: ProjectionMaintenanceSubject,
        change_kind: ProjectionMaintenanceChangeKind,
        before: ProjectionMaintenanceRevision,
        change: ProjectionMaintenanceChange,
        after: ProjectionMaintenanceRevision,
        reason: Option<ProjectionMaintenanceRecordReason>,
        policy_basis: ProjectionMaintenancePolicyBasis,
    ) -> Result<Self, DomainError>;

    pub fn metadata(&self) -> &ObservationRecordMetadata<ProjectionMaintenanceRecordRef>;
    pub fn subject(&self) -> &ProjectionMaintenanceSubject;
    pub fn change_kind(&self) -> ProjectionMaintenanceChangeKind;
    pub fn before(&self) -> &ProjectionMaintenanceRevision;
    pub fn change(&self) -> &ProjectionMaintenanceChange;
    pub fn after(&self) -> &ProjectionMaintenanceRevision;
    pub fn reason(&self) -> Option<&ProjectionMaintenanceRecordReason>;
    pub fn policy_basis(&self) -> &ProjectionMaintenancePolicyBasis;
}

impl ProjectionMaintenanceRevisionSnapshot {
    pub fn try_rehydrate(
        maintenance_ref: ProjectionMaintenanceRef,
        target_ref: MaintenanceTargetRef,
        state: ProjectionMaintenanceStateKind,
        requires_observation_cursor: bool,
        requires_reference_cursor: bool,
        observation_cursor: Option<ObservationCursor>,
        reference_cursor: Option<ReferenceCursor>,
        progress_ref: Option<RebuildProgressViewRef>,
        failure_reason: Option<MaintenanceFailureReason>,
        updated_at: ObservedAt,
    ) -> Result<Self, DomainError>;
}

impl DiagnosticSummaryRevision {
    pub fn try_rehydrate(
        summary_ref: DiagnosticSummaryRef,
        scope_ref: DiagnosticScopeRef,
        freshness: DiagnosticFreshnessState,
        safe_signal_refs: SafeSignalRefSet,
        gap_refs: GapStateRefSet,
        no_write_violation_refs: NoWriteViolationRefSet,
        staleness_reason: Option<StalenessReason>,
        unavailable_reason: Option<DiagnosticUnavailableReason>,
        as_of_cursor: Option<ObservationCommittedCursor>,
        assembled_at: ObservedAt,
    ) -> Result<Self, DomainError>;
}

impl SignalRollupRevision {
    pub fn try_rehydrate(
        window_ref: SignalRollupWindowRef,
        scope: SignalRollupScope,
        window_kind: RollupWindowKind,
        window_start_at: ObservedAt,
        window_end_at: ObservedAt,
        state: SignalRollupState,
        signal_count: SignalCount,
        source_cursor: Option<ObservationCursor>,
        signal_refs: SafeSignalRefSet,
    ) -> Result<Self, DomainError>;
}

impl RollupRebuildRevision {
    pub fn try_rehydrate(
        rebuild_ref: RollupRebuildRef,
        window_ref: SignalRollupWindowRef,
        target_ref: MaintenanceTargetRef,
        state: RollupRebuildKind,
        source_cursor: Option<ObservationCursor>,
        rebuilt_count: Option<SignalCount>,
        progress_ref: Option<RebuildProgressViewRef>,
        failure_reason: Option<MaintenanceFailureReason>,
        updated_at: ObservedAt,
    ) -> Result<Self, DomainError>;
}
```

Each revision also exposes typed field inspections corresponding to every constructor argument. Rehydration checks target kind/effect, dual namespace requirement flags, count/set equality, rollup window bounds, state conditional fields, diagnostic freshness matrices, and metadata origin/Operations visibility/Observation cursor. The H11 factory allowlist is Command/InboundConsumer/ResidentWorker/OperationsJob, but each accepted-input variant applies the stricter F2 writer registry: Command/InboundConsumer may produce `SignalRollupAccepted` or another explicitly mapped accepted branch only, while projection/rebuild completion requires its named worker/job branch. It never reruns P17, rebuilds a view, reads safe-signal rows, or treats `Fresh`/`Completed` as source repair.

### 70.6 append-only / planned tests / stop review

H11 has no maintenance or summary mutation member. Planned tests cover 4 projection lifecycle branches, 5 diagnostic change kinds, 4 rollup-window variants, 3 rollup-execution variants, `SignalAccepted` pre/post set/count/cursor round-trip, diagnostic change-kind totality, dual namespace non-collapse, target/effect compatibility, policy-basis only on start branches, exact origin/visibility/cursor, corrupt rehydrate rows, factory/append/CAS/outbox rollback and no-source-repair/body/provider/run-id/verdict scans. Object stop: `pass_R06.5-G_H11_design_only`.

## 71. H12 `GapScanRecord`

### 71.1 capability / R06.6 reservation boundary

H12记录一次针对单个`MaintenanceTargetRef`（kind=`Gap`、effect=`ScanGap`）的accepted gap-scan item result。它只保存观察侧扫描结果与canonical discovered gap refs，不拥有job plan、job identity、item identity、claim、attempt、run、report或operations truth。R06.6 D-3/D-6 已建立逐字段兼容的 item outcome association；H12仍是record-required input的唯一domain owner，application只能无损传递，不得把job fields并入record。

### 71.2 exact reserved input carrier

```rust
/// Typed result supplied by the accepted gap-scan item boundary.
pub struct GapScanAcceptedItemResult {
    target_ref: MaintenanceTargetRef,
    target_snapshot: GapScanTargetSnapshot,
    discovered_gap_refs: GapStateRefSet,
    outcome: GapScanOutcome,
    completed_at: ObservedAt,
}

/// Complete body-free P17 target binding required to accept one scan result.
pub struct GapScanTargetSnapshot {
    target_ref: MaintenanceTargetRef,
    projection_scopes: MaintenanceProjectionScopeSet,
    dependency_namespaces: MaintenanceDependencyNamespaceSet,
    authorization_mode: MaintenanceAuthorizationMode,
    observation_cursor: Option<ObservationCursor>,
    reference_cursor: Option<ReferenceCursor>,
    maintenance_policy_basis: PolicyEvaluationBasis,
}

/// Finite scan result state owned by the future item result producer.
pub enum GapScanOutcome {
    Completed,
    Failed(MaintenanceFailureReason),
    Blocked(MaintenanceBlockReason),
}
```

上述三个类型是`domain::records::gap_scan`的typed accepted-input owner；R06.6 D-3/D-6 application item carrier已逐项保留这些字段，但不复制其domain定义。G批不定义`GapScanKind`、`GapScanState`、`job_ref`、`item_ref`、`run_id`、`report_ref`、attempt counter、schedule或worker state；`GapScanOutcome`是唯一record-side result classifier。

`GapScanTargetSnapshot::from_authorized_target(target: &MaintenanceTargetPolicySnapshot, decision: &DerivedMaintenanceDecision, observation_cursor: Option<ObservationCursor>, reference_cursor: Option<ReferenceCursor>) -> Result<Self, DomainError>`只接受P17 Authorized、target kind `Gap`、effect `ScanGap`和完整scope/dependency binding。它复制exact P17 basis、authorization mode、canonical scopes/dependencies以及按namespace要求提供的两个cursor。required namespace必须Some，non-required必须None；两个cursor不比较、不互换。snapshot字段private，无serde/default/builder，不能由caller bare bool或裸target构造。

`GapScanOutcome::Completed`只表示本次 observation-side scan result 已被item classification接受；它不单独证明UoW已commit。`Failed/Blocked`必须带typed reason。`discovered_gap_refs`为空是明确扫描结果，不代表source完整；任何gap ref必须来自accepted scan result的canonical set，record不得从缺失材料制造新gap。

### 71.3 accepted input / post-state

```rust
pub enum GapScanAcceptedInput<'a> {
    ItemResult(&'a GapScanAcceptedItemResult),
}

pub struct GapScanPostState {
    target_snapshot: GapScanTargetSnapshot,
    discovered_gap_refs: GapStateRefSet,
    outcome: GapScanOutcome,
    completed_at: ObservedAt,
}
```

The H12 factory accepts only an `ItemResult` tag, a borrowed same-UoW `&GapScanPostState`, and metadata. It verifies the accepted result and post-state target snapshot, discovered set, outcome and completion time are exact copies before building one immutable after revision. Borrowing preserves the same values for the application item/report fold after H12 construction; the factory cannot consume or reconstruct them. No mutable `GapScanState` is created by H12, and no `GapState` is opened or closed merely because a ref appears in the result. A current R06.6 item may separately call the H8 gap-opening flow with a P12 decision; that is an independent accepted mutation and record.

### 71.4 exact record / revision / change schema

```rust
pub struct GapScanRecord {
    metadata: ObservationRecordMetadata<GapScanRecordRef>,
    target_ref: MaintenanceTargetRef,
    before: Option<GapScanRevision>,
    change: GapScanChange,
    after: GapScanRevision,
}

pub struct GapScanRevision {
    target_snapshot: GapScanTargetSnapshot,
    discovered_gap_refs: GapStateRefSet,
    outcome: GapScanOutcome,
    completed_at: ObservedAt,
}

pub enum GapScanChange {
    ScanCompleted {
        discovered_gap_refs: GapStateRefSet,
    },
    ScanFailed {
        reason: MaintenanceFailureReason,
    },
    ScanBlocked {
        reason: MaintenanceBlockReason,
    },
}
```

H12是一次immutable item-result record；`before`固定为`None`，不得伪造“job尚未运行”、`PendingInput`、`Scheduled`或`Running`状态。H12不是execution lifecycle record，而是一个accepted immutable result append。`ScanCompleted`允许empty set，`ScanFailed/ScanBlocked`的after outcome与reason必须一致；`change`与after outcome exact match，不能从after state猜。任何`before=Some`或mutable `start/mark_failed` member均拒绝。

### 71.5 factory / inspection / validated rehydrate

```rust
impl GapScanRecord {
    pub fn from_accepted(
        accepted: GapScanAcceptedInput<'_>,
        post_state: &GapScanPostState,
        metadata: ObservationRecordMetadata<GapScanRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<GapScanRecordRef>,
        target_ref: MaintenanceTargetRef,
        before: Option<GapScanRevision>,
        change: GapScanChange,
        after: GapScanRevision,
    ) -> Result<Self, DomainError>;

    pub fn metadata(&self) -> &ObservationRecordMetadata<GapScanRecordRef>;
    pub fn target_ref(&self) -> &MaintenanceTargetRef;
    pub fn before(&self) -> Option<&GapScanRevision>;
    pub fn change(&self) -> &GapScanChange;
    pub fn after(&self) -> &GapScanRevision;
}

impl GapScanRevision {
    pub fn try_rehydrate(
        target_snapshot: GapScanTargetSnapshot,
        discovered_gap_refs: GapStateRefSet,
        outcome: GapScanOutcome,
        completed_at: ObservedAt,
    ) -> Result<Self, DomainError>;

    pub fn target_snapshot(&self) -> &GapScanTargetSnapshot;
    pub fn discovered_gap_refs(&self) -> &GapStateRefSet;
    pub fn outcome(&self) -> &GapScanOutcome;
    pub fn completed_at(&self) -> &ObservedAt;
}
```

`GapScanTargetSnapshot` exposes typed inspection for all seven fields (`target_ref`, scopes, dependencies, authorization mode, two cursors and maintenance basis). The rehydration gate rejects any non-None `before`, unsupported target/effect, P17 family mismatch, cursor namespace mismatch, outcome/reason mismatch, unbounded or noncanonical gap set, metadata origin other than OperationsJob, visibility above OperationsOnly, missing committed Observation cursor, and any unknown outcome token. It does not invoke R06.6, job repository, source scan, P12, H8 or an external adapter.

### 71.6 append-only / planned tests / stop review

H12 has no start/complete/fail/close member. Planned tests cover the three typed outcomes, empty-versus-nonempty discovered set, target kind/effect/guard and dual namespace binding, before-always-None gate, exact result/post-state copy, R06.6 carrier compatibility review, origin/visibility/cursor, corrupt rehydrate rows, duplicate record ref/rollback and scans rejecting job/run/report/claim/attempt/source-body/fabricated-gap/verdict/signoff fields. Object stop: `pass_R06.5-G_H12_design_only_reserved_input`.

## 72. H13 `ReplayExecutionRecord`

### 72.1 capability / per-target replay boundary

H13记录一个已批准replay scope内一个exact target的coordination lifecycle。每个`ReplayCoordinationState`只对应一个`ReplayScopeRef`、一个`ReplayCoordinationRef`和一个`MaintenanceTargetRef`；H13绝不把scope-wide job plan或多个target压成一条record。`Start/Blocked` transition保留P18 basis及授权审计字段，实际`Completed/Failed` transition不借用旧P18 basis，因为它们来自后续accepted execution result。

H13只表达本仓 observation-side coordination pending/coordinating/blocked/completed/failed；不表达source replay、external write、job run success、source repair、changed truth以外的影响、验收或signoff。`changed_refs`只能来自`Coordinating -> Completed`的真实accepted local result，并且为空或exact target singleton。

### 72.2 exact support carrier

```rust
/// Exact accepted replay coordination branch.
pub enum ReplayExecutionChangeKind {
    Started,
    Blocked,
    Completed,
    Failed,
}

/// Typed local reason for a blocked or failed coordination.
pub enum ReplayExecutionRecordReason {
    ReplayBlock(ReplayBlockReason),
    MaintenanceFailure(MaintenanceFailureReason),
}

/// Policy provenance retained only for P18 Start/Blocked branches.
pub enum ReplayExecutionPolicyBasis {
    Coordination(PolicyEvaluationBasis),
    None,
}
```

`Started/Blocked`必须P18 basis，`Completed/Failed`固定None。`Blocked`当前不带`NoWriteViolationRef`，因为P18没有violation identity source；若未来独立violation attachment开启，必须另建accepted transition，不修改H13旧row。Reason与state total mapping：Blocked必须`ReplayBlockReason`，Failed必须`MaintenanceFailureReason`，Started/Completed固定None。

### 72.3 accepted input / same-UoW post-state

```rust
pub enum ReplayExecutionAcceptedInput<'a> {
    Started(&'a ReplayCoordinationTransition),
    Blocked(&'a ReplayCoordinationTransition),
    Completed(&'a ReplayCoordinationTransition),
    Failed(&'a ReplayCoordinationTransition),
}

pub struct ReplayExecutionPostState<'a> {
    coordination: &'a ReplayCoordinationState,
    approved_scope: &'a ReplayScope,
}
```

Factory只接受四个显式operation tag。它必须验证scope仍为Approved、coordination target仍是scope中exact member、transition and post-state identities exact、tag与from/to state一致、P18 Start/Blocked的authorization mode/effect/no-write guard与stored target exact、completion changed set为空或target singleton、failure/block/violation fields矩阵一致。任何scope iteration、foreign target、support progress ref或job report ref都会拒绝。

### 72.4 exact record / revision / change schema

```rust
pub struct ReplayExecutionRecord {
    metadata: ObservationRecordMetadata<ReplayExecutionRecordRef>,
    scope_ref: ReplayScopeRef,
    coordination_ref: ReplayCoordinationRef,
    target_ref: MaintenanceTargetRef,
    before: ReplayExecutionRevision,
    change: ReplayExecutionChange,
    after: ReplayExecutionRevision,
    reason: Option<ReplayExecutionRecordReason>,
    policy_basis: ReplayExecutionPolicyBasis,
}

pub struct ReplayExecutionRevision {
    coordination_ref: ReplayCoordinationRef,
    scope_ref: ReplayScopeRef,
    target_ref: MaintenanceTargetRef,
    state: ReplayCoordinationKind,
    no_write_guard_scope: NoWriteGuardScope,
    no_write_violation_ref: Option<NoWriteViolationRef>,
    block_reason: Option<ReplayBlockReason>,
    failure_reason: Option<MaintenanceFailureReason>,
    updated_at: ObservedAt,
}

pub enum ReplayExecutionChange {
    Started {
        authorization_mode: MaintenanceAuthorizationMode,
        authorized_effect: MaintenanceAllowedEffect,
        no_write_guard_scope: NoWriteGuardScope,
    },
    Blocked {
        reason: ReplayBlockReason,
    },
    Completed {
        changed_refs: AffectedObservationObjectRefSet,
    },
    Failed {
        reason: MaintenanceFailureReason,
    },
}
```

| transition | before -> after | reason / basis |
|---|---|---|
| Start | Pending -> Coordinating | None; `Coordination(P18)` and authorization fields |
| Blocked | Pending -> Blocked | ReplayBlockReason; `Coordination(P18)`; violation ref None |
| Completed | Coordinating -> Completed | None; `None` basis; changed set empty or exact target singleton |
| Failed | Coordinating -> Failed | MaintenanceFailureReason; `None` basis; no changed-set payload |

The before revision for Start/Blocked/Completed/Failed comes from transition previous fields plus the immutable scope/target/guard relation; the after revision comes from same-UoW coordination post-state. `changed_refs` belongs only to `ReplayExecutionChange::Completed`, because `ReplayCoordinationState` does not persist it; placing it in the revision would create a second aggregate field. Completion cannot carry a policy basis or authorization fields. A retry after Failed requires a new coordination identity according to the owning state contract; the old record is immutable.

### 72.5 factory / inspection / validated rehydrate

```rust
impl ReplayExecutionRecord {
    pub fn from_accepted(
        accepted: ReplayExecutionAcceptedInput<'_>,
        post_state: ReplayExecutionPostState<'_>,
        metadata: ObservationRecordMetadata<ReplayExecutionRecordRef>,
    ) -> Result<Self, DomainError>;

    pub fn try_rehydrate(
        metadata: ObservationRecordMetadata<ReplayExecutionRecordRef>,
        scope_ref: ReplayScopeRef,
        coordination_ref: ReplayCoordinationRef,
        target_ref: MaintenanceTargetRef,
        before: ReplayExecutionRevision,
        change: ReplayExecutionChange,
        after: ReplayExecutionRevision,
        reason: Option<ReplayExecutionRecordReason>,
        policy_basis: ReplayExecutionPolicyBasis,
    ) -> Result<Self, DomainError>;

    pub fn metadata(&self) -> &ObservationRecordMetadata<ReplayExecutionRecordRef>;
    pub fn scope_ref(&self) -> &ReplayScopeRef;
    pub fn coordination_ref(&self) -> &ReplayCoordinationRef;
    pub fn target_ref(&self) -> &MaintenanceTargetRef;
    pub fn before(&self) -> &ReplayExecutionRevision;
    pub fn change(&self) -> &ReplayExecutionChange;
    pub fn after(&self) -> &ReplayExecutionRevision;
    pub fn reason(&self) -> Option<&ReplayExecutionRecordReason>;
    pub fn policy_basis(&self) -> &ReplayExecutionPolicyBasis;
}

impl ReplayExecutionRevision {
    pub fn try_rehydrate(
        coordination_ref: ReplayCoordinationRef,
        scope_ref: ReplayScopeRef,
        target_ref: MaintenanceTargetRef,
        state: ReplayCoordinationKind,
        no_write_guard_scope: NoWriteGuardScope,
        no_write_violation_ref: Option<NoWriteViolationRef>,
        block_reason: Option<ReplayBlockReason>,
        failure_reason: Option<MaintenanceFailureReason>,
        updated_at: ObservedAt,
    ) -> Result<Self, DomainError>;

    pub fn coordination_ref(&self) -> &ReplayCoordinationRef;
    pub fn scope_ref(&self) -> &ReplayScopeRef;
    pub fn target_ref(&self) -> &MaintenanceTargetRef;
    pub fn state(&self) -> ReplayCoordinationKind;
    pub fn no_write_guard_scope(&self) -> &NoWriteGuardScope;
    pub fn no_write_violation_ref(&self) -> Option<&NoWriteViolationRef>;
    pub fn block_reason(&self) -> Option<&ReplayBlockReason>;
    pub fn failure_reason(&self) -> Option<&MaintenanceFailureReason>;
    pub fn updated_at(&self) -> &ObservedAt;
}
```

Rehydration validates per-target identity, Approved scope relation, state/conditional fields, Completed change changed-set cardinality, P18 basis family on Start/Blocked only, metadata OperationsJob origin/visibility/Observation cursor, and no-write scope. It never expands scope, calls maintenance, creates a job report, or treats Completed as source repair.

### 72.6 append-only / planned tests / stop review

H13 has no start/complete/fail member and no scope iteration. Planned tests cover four transition branches, one-target cardinality, Approved scope membership, P18 basis versus actual-result no-basis, Blocked no violation ref, changed-set empty/exact singleton, cross-target/scope/coordination rejection, retry identity separation, origin/visibility/cursor, validated rehydrate/corrupt rows, factory/append/CAS rollback, and scans rejecting job/run/source-repair/external-write/verdict/signoff fields. Object stop: `pass_R06.5-G_H13_design_only`。

## 73. R06.5-G 总门禁与停审记录

### 73.1 六个独立 record 与新增类型精确账

本节是 G 批机械账与逐卡账的唯一 current owner。统计范围严格限定为 §§67~72 的 `pub struct` / `pub enum` 声明；不重复计算 B 批 typed record ref、共享 `ObservationRecordMetadata<R>`、R06.3/R06.4 canonical transition / decision / state / post-state，也不把 `impl`、方法或 rustdoc 视为新类型。

| record | G 批新增显式类型 | exact names |
|---|---:|---|
| H8 `GapTransitionRecord` | 12 | `GapOpened`; `DegradedOutputCreated`; `GapTransitionSubject`; `GapTransitionChangeKind`; `GapTransitionPolicyBasis`; `GapTransitionAcceptedInput`; `GapTransitionPostState`; `GapTransitionRecord`; `GapTransitionRevision`; `GapRecordRevision`; `DegradedOutputRecordRevision`; `GapTransitionChange` |
| H9 `PeripheralDeliveryRecord` | 11 | `PeripheralDeliverySubject`; `PeripheralDeliveryChangeKind`; `PeripheralDeliveryRecordReason`; `PeripheralDeliveryPolicyBasis`; `PeripheralDeliveryAcceptedInput`; `PeripheralDeliveryPostState`; `PeripheralDeliveryRecord`; `PeripheralDeliveryRevision`; `PeripheralDeliveryStateRevision`; `ExportPreparationRevision`; `PeripheralDeliveryChange` |
| H10 `ReferenceRefreshRecord` | 10 | `ReferenceSnapshotCreated`; `ReferenceRefreshSubject`; `ReferenceRefreshChangeKind`; `ReferenceRefreshRecordReason`; `ReferenceRefreshPolicyBasis`; `ReferenceRefreshAcceptedInput`; `ReferenceRefreshPostState`; `ReferenceRefreshRecord`; `ReferenceSnapshotRevision`; `ReferenceRefreshChange` |
| H11 `ProjectionMaintenanceRecord` | 13 | `ProjectionMaintenanceSubject`; `ProjectionMaintenanceChangeKind`; `ProjectionMaintenanceRecordReason`; `ProjectionMaintenancePolicyBasis`; `ProjectionMaintenanceAcceptedInput`; `ProjectionMaintenancePostState`; `ProjectionMaintenanceRecord`; `ProjectionMaintenanceRevision`; `ProjectionMaintenanceRevisionSnapshot`; `DiagnosticSummaryRevision`; `SignalRollupRevision`; `RollupRebuildRevision`; `ProjectionMaintenanceChange` |
| H12 `GapScanRecord` | 8 | `GapScanAcceptedItemResult`; `GapScanTargetSnapshot`; `GapScanOutcome`; `GapScanAcceptedInput`; `GapScanPostState`; `GapScanRecord`; `GapScanRevision`; `GapScanChange` |
| H13 `ReplayExecutionRecord` | 8 | `ReplayExecutionChangeKind`; `ReplayExecutionRecordReason`; `ReplayExecutionPolicyBasis`; `ReplayExecutionAcceptedInput`; `ReplayExecutionPostState`; `ReplayExecutionRecord`; `ReplayExecutionRevision`; `ReplayExecutionChange` |
| **total** | **62** | `12 + 11 + 10 + 13 + 8 + 8`; names are unique within the G declaration range |

The G count corrects the provisional `31-object` wording in the in-progress checkpoint; that wording is historical planning material and is not a second type account. No duplicate declaration was found in the G range, and no G type is promoted to a contracts or application owner.

### 73.2 transition / creation-proof to record mapping

| accepted source | record branch | no-record / reserved boundary |
|---|---|---|
| `GapOpened` | H8 `Opened` with `before=None`, P12 basis | missing proof, gapless degraded revision, or Query decision: explicit no-record |
| `GapTransition` lifecycle branch | H8 `Acknowledged` / `Mitigated` / `Resolved` | entering or leaving `Suppressed` except typed historical close: reserved |
| `DegradedOutputCreated` / `DegradedOutputTransition` | H8 `DegradedOutputCreated` / `DegradedOutputReplaced` | normal/blocked revision without exact gap relation: explicit no-record |
| `PeripheralDeliveryTransition` | H9 delivery policy or adapter-result branch | initial state, exact replay, stale decision, reserved cancel: no-record/reserved |
| `ExportPreparationTransition` | H9 preparation decision, gap attachment, or local result branch | initial draft, unsupported terminal reuse, external acceptance: no-record/boundary violation |
| `ReferenceSnapshotTransition` | H10 five in-place result branches | `PreserveCurrent`, malformed result, rejected decision: no-record/error |
| `ReferenceSnapshotCreated` | H10 new-identity branch with old invalid revision and new ref | creation inferred from missing row or old-row mutation: rejected |
| `ProjectionMaintenanceTransition` | H11 projection lifecycle branch | incompatible target/effect, duplicate/no-op, source repair: no-record/error |
| `DiagnosticSummaryTransition` | H11 typed summary change branch | set-difference inference or Query side effect: rejected/no-record |
| `SignalRollupTransition` | H11 rollup window branch with complete previous snapshot | missing previous fields or collapsed namespace cursor: rejected |
| `RollupRebuildTransition` | H11 rebuild start/complete/fail branch | reserved cancel or source replay: reserved/no-record |
| reserved `GapScanAcceptedItemResult` | H12 immutable result branch, `before=None` | job lifecycle, fabricated gap opening/closing, or guessed R06.6 schema: out of scope/rejected |
| `ReplayCoordinationTransition` | H13 one exact scope/coordination/target branch | scope-wide record, foreign target, job/report/source-repair effect: rejected |

Every listed accepted branch maps to at most one typed record in its family. Multi-record UoW cases retain separate record refs; a shared Observation commit cursor does not establish intra-UoW order.

### 73.3 field-source, before/change/after and rehydrate audit

| audit surface | G gate |
|---|---|
| metadata | Each factory consumes typed `ObservationRecordMetadata<ExactRecordRef>`; origin and visibility ceiling are validated before construction. H1~H6/H8/H9/H11~H13 require `Observation`; H10 accepts the one application-selected tagged `Reference` or `Observation` cursor. |
| subject and identity | Subject/tag, target, scope, coordination, preparation, gap, snapshot and affected-object relations are cross-checked against the accepted source and same-UoW post-state. |
| before | H8 creation and H12 result branches explicitly use `None`; H9/H10/H11/H13 use the source transition or creation proof's complete previous snapshot; no branch reads current row to reconstruct history. |
| change | Every change kind is a finite typed variant with branch-specific payload; no string discriminator, `Other`, or Debug/opaque transition blob is persisted. |
| after | Every after revision is assembled from the same-UoW post-state and checked for conditional fields, set/count/cursor equality and target relation. |
| policy basis | Only policy-driven branches retain P12/P13/P14/P15/P17/P18 basis; direct/adapter/result branches use typed `None`/`Direct` according to their card. |
| rehydrate | Each record and persisted revision exposes typed inspection and `try_rehydrate`; rehydrate validates stored shape only, never reruns policy, scans source, calls an adapter, creates identity or changes truth. |

### 73.4 origin / visibility / cursor and H12 reservation matrix

| family | origin / visibility rule | cursor rule |
|---|---|---|
| H8 | Command/InboundConsumer/ResidentWorker/OperationsJob; unsafe or blocked output is Operations-only | required Observation metadata cursor; degraded body fields never replace it |
| H9 | Command/InboundConsumer/OperationsJob; Consumer only for accepted feedback branch; delivery/preparation details are Operations-only | required Observation metadata cursor |
| H10 | Command/InboundConsumer/OperationsJob within the card ceiling | required tagged metadata cursor: Reference for reference-only, Observation for mixed; source version is not a commit cursor |
| H11 | Command/InboundConsumer/ResidentWorker/OperationsJob within subject-specific ceiling | required Observation metadata cursor; accepted-input variant further restricts each lane; observation/reference coverage cursors remain separate |
| H12 | OperationsJob and Operations-only visibility | required Observation metadata cursor; dual target namespace cursors are independent and may be `Some`/`None` only per target contract |
| H13 | OperationsJob and Operations-only visibility | required Observation metadata cursor; scope/coordination refs are not job identity or cursor substitutes |

H12's `GapScanAcceptedItemResult`, `GapScanTargetSnapshot` and `GapScanOutcome` remain a typed reservation owned by G. They do not define a job, plan, item, claim, attempt, run, report, schedule, or worker state. R06.6 must either consume these fields exactly or submit an affected-definition change; G does not predeclare R06.6 fields.

### 73.5 same-UoW, append-only and truth-boundary audit

1. The accepted transition or typed creation/result proof, same-UoW post-state and typed metadata are all mandatory. Factory or append failure rolls back the owning observation mutation, record, cursor allocation, outbox/stale/result side effect and CAS as one UoW; no partial history row is visible.
2. All six records expose inspection/factory/validated rehydrate only. They have no update, delete, retry, attach, mark, close, transition or correction mutation. A correction, if later required, must be a new typed record branch.
3. The records carry only observation-side truth: log/metric/trace/audit projection state, correlation/gap/reference/maintenance markers and body-free evidence linkage. They do not own business/source truth, raw bodies, locators, credentials, provider payloads, external acceptance, verdicts, signoff, real run identity or evidence alias.
4. H8 does not open or resolve a gap from a degraded record; H12 does not open/close `GapState`; H13 does not execute replay or write a source. H9 `Delivered` is local adapter-boundary output only.
5. All test statements in §§67~72 and this section are planned verification cuts. No test, run, commit, evidence alias or acceptance signature is claimed as executed or real.

### 73.6 G批停止结论

| gate | conclusion |
|---|---|
| six independent concrete record cards | pass design-only；H8~H13各自有capability、typed schema、accepted input、post-state、factory、inspection、rehydrate、append-only与planned verification |
| G type account | pass；62 unique new explicit types，分组`12/11/10/13/8/8`，无duplicate declaration |
| transition / creation proof totality | pass；每个current accepted branch有唯一family mapping，reserved/no-record边界显式列出 |
| field source / lossless delta | pass；before/change/after均有canonical source，H11 rollup与diagnostic payload已补齐 |
| rehydrate / persistence inspection | pass design-only；所有persisted字段有typed inspection和corrupt-row fail-closed规则 |
| origin / visibility / cursor | pass design-only；六个family矩阵闭合，H12双namespace不折叠 |
| H12 R06.6 boundary | historical pass reservation-only；current D-3/D-6 fieldwise compatibility与F2 borrow rule见§74 |
| same-UoW / append-only | pass design-only；无mutable record API，失败全量rollback规则已固定 |
| observation-only truth boundary | pass；无business/source/external truth、raw body、credential、locator、provider payload、verdict、signoff或真实evidence/run identity |
| 外部上游 blocker | historical `none`；current为`R06.6-F2-H13-UPSTREAM=open_controlled`，见§74 |
| remaining internal blocker | `03-RPR-S06-GRANULARITY=open`；Step06仍需R06.6~R06.8及后续受影响审计，不能宣称formal `03`完成 |
| controlled affected item | `R06-F-AFFECT-UOW-01=open_controlled`；留待R06.8解冻下游时处理，不在G跨步修复 |
| planned verification | only；未执行测试、未生成commit/run_id/evidence alias/验收签署 |
| historical checkpoint | `R06.5-G_done_waiting_user` |
| historical next allowed | 读取 R06.6 输入；该动作与A/B批均已完成，当前指针为 `R06.6-B_done_waiting_user` |
| commit | 不需要提交 |

G 批历史停审在此；其 checkpoint 已被 R06.6-F2 records reconciliation 消费。`R06.5` 不等同于 Step 06 完成；正式 `03`、R06.7~R06.8、Step 07~19、任何 `04` 文件和实现代码继续冻结。

## 74. R06.6-F2 record factory reconciliation and current pointer

This section and the concrete H1~H13 cards are the current `domain::records` owner. Where an earlier A/B/F/G checkpoint conflicts with this section, the earlier row is historical material. F2 does not change any record's before/change/after schema or append-only ownership; it closes application-callable factory inputs, writer lanes, cursor rules and same-UoW borrowing.

### 74.1 exact current factory boundary

| family | accepted factory input | origin allowlist | committed cursor | F2 amendment |
|---|---|---|---|---|
| H1 | receipt/safety accepted input + matching post-state | Command / InboundConsumer | Observation | unchanged |
| H2 | correlation/signal accepted input + matching post-state | Command / InboundConsumer | Observation | unchanged |
| H3 | audit/linkage accepted input + matching post-state | Command / InboundConsumer / OperationsJob, narrowed by branch | Observation | unchanged |
| H4 | handoff/hint accepted input + matching post-state | Command / InboundConsumer / OperationsJob | Observation | InboundConsumer enabled only for named accepted feedback/hint branch |
| H5 | marker/protection accepted input + matching post-state | Command / OperationsJob | Observation | unchanged |
| H6 | existing violation transition + `&NoWriteViolation` | Command / InboundConsumer / ResidentWorker / OperationsJob | Observation | initial Detected and P10-only Blocked remain no-record |
| H7 | future async read envelope | AsynchronousReadAudit | future Observation | current factory remains phase-reserved and uncallable |
| H8 | gap/degraded accepted input + matching post-state | Command / InboundConsumer / ResidentWorker / OperationsJob | Observation | unchanged |
| H9 | delivery/preparation accepted input + matching post-state | Command / InboundConsumer / OperationsJob | Observation | InboundConsumer enabled only for accepted report-consumer feedback branch |
| H10 | snapshot accepted input + matching post-state | Command / InboundConsumer / OperationsJob | Reference or Observation | domain accepts either present tag; application footprint selects exact tag |
| H11 | projection/diagnostic/rollup/rebuild accepted input + matching post-state | Command / InboundConsumer / ResidentWorker / OperationsJob | Observation | factory validates subject-variant lane; rollup SignalAccepted may be assembled only after cursor assignment |
| H12 | item result + `&GapScanPostState` | OperationsJob | Observation | factory borrows post-state so the same values remain available to item/report fold |
| H13 | per-target coordination transition + approved scope/post-state | OperationsJob | Observation | `ReplayScopeTransition` and `DefineReplayScope` cannot mint or append H13 |

`ObservationRecordMetadata<R>` remains a rehydration-capable generic domain value with `Option<ObservationCommittedCursor>` because H7 historical/future shape and corrupt-row validation need to represent absence. Current F2 writers never call its raw `new(..., None)` path. They consume `ObservationRecordMetadataSeed<R>::bind_cursor`, so every callable H1~H6/H8~H13 factory receives `Some`. H10 is the only current family accepting both tagged variants; every other current family rejects `Reference`.

### 74.2 cursor-dependent H11 closure

`SignalRollupWindow::accept_signal(signal, context, observation_cursor)` remains the domain mutation owner. The application retains the mutable window and exact repository version before cursor allocation, invokes this member after the one Observation cursor is assigned, and calls `ProjectionMaintenanceRecord::from_accepted` while the returned local transition is alive. The factory borrows the mutated window as its same-UoW post-state and returns an owned H11 record. It does not persist the window, allocate a cursor, clone/reload the aggregate or return a request borrowing the local transition.

### 74.3 H13 controlled upstream conflict

The early §7 row that allowed `ReplayScopeTransition` to produce H13 is superseded. H13 has no scope-definition/approval/close accepted-input variant and cannot represent a scope-wide lifecycle event. Current conservative behavior is:

- `CoordinateObservationReplay` may create one H13 per accepted target coordination transition;
- `DefineReplayScope` may persist its observation-owned scope mutation and mapped non-record followers, but it cannot create H13;
- deciding whether scope lifecycle remains `explicit_no_record` or gains a new record family requires an upstream HLD/design change; H13 cannot be stretched to hide the conflict.

### 74.4 records stop gate

| gate | status |
|---|---|
| concrete schemas / factories | `pass_design_only_with_F2_reconciliation` |
| writer allowlist versus operation authorization | `pass`; origin remains coarse and F2 operation registry remains stricter |
| H10 tagged cursor | `pass_design_only`; Reference-only and mixed paths are distinct |
| H11 cursor-dependent ownership | `pass_design_only` |
| H12 borrow / D-3 compatibility | `pass_design_only` |
| H13 upstream consistency | `open_controlled`; conservative no-H13 scope-definition boundary active |
| downstream append/UoW repair | `R06-F-AFFECT-UOW-01=open_controlled_downstream` |
| verification | `planned/not_run`; no result, run id, evidence alias or acceptance claimed |
| current pointer | `R06.6-F2_done_waiting_user_before_R06.7` |
| next allowed | wait for explicit user confirmation before R06.7 |
| commit | not required |
