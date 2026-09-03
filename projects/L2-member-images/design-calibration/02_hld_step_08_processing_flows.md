# L2-member-images 02 概要 Step 8: 关键处理流 / 重要函数数据流

> 创建日期: 2026-08-24
> 状态: `completed_pass`
> 当前模式: `full-restart`
> 回填位置: 正式 `02-概要设计.md` 第 8 章
> 当前限制: 正式旧 `02` 仍未读取；未创建 Step 9 文件；处理流为结构骨架，不是完整伪代码、事务算法、协议时序或 retry 脚本

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 7 接口骨架、Step 6 关键对象、Step 5 组成部分与 Step 3 约束 |
| 规范 | 已读取概要设计 SOP Step 8 与书写规范 §4.8 |
| 本步目标 | 把关键 Command / Query / Event / Job 连接到入口、Application、Domain、Port / Persistence、Projection / Handoff，明确主路径和边界分支 |
| 本步禁止 | 完整函数调用链、SQL / DDL、错误码全集、retry 参数、协议字段时序、未定义对象或 positive pending contract |

## 1. 通用处理流骨架

```text
Command / Query / Event / Job
  │
  ▼
Inbound / Consumer / Operations
  - 读取 metadata、幂等语境和 actor / source context
  - 拒绝未验证来源，不把 arrival / ACK 当领域成功
  │
  ▼
Application Service
  - 读取已提交事实与受控 refs
  - 编排 domain guard、local decision 和 inward ports
  │
  ▼
Domain Object / Policy
  - 形成或追加本仓 truth、history、gap 或 stage decision
  - 不读取 external body，不改变相邻 owner truth
  │
  ▼
Persistence / Projection / Handoff
  - 保存 local truth 或从 truth 重建只读视图
  - external handoff 只记录 ref / outcome / gap
  │
  ▼
Result / Projection / Pending
```

## 2. 处理流覆盖清单

| 接口 | 是否画独立处理流 | 原因 |
|---|---|---|
| `DefineImageVariant` + `CaptureAssemblyBaseline` | 是，合并为一条定义装配主流 | P0 definition / baseline Command 决定后续所有阶段的输入语境。 |
| `ProposeVariantRevision` | 是 | revision 是 build intent 的必要前置，需独立表达完整性 guard。 |
| `RequestBuildIntent` / `RunNightlyBuildSweep` | 是 | nightly 与同步 request 都产生 intent，但不等于 attempt / candidate。 |
| `ConsumeVerifiedBuildRequest` | 是 | 条件型 Event 可改写本地 intent，必须独立表达 authority / idempotency。 |
| `RecordBuildOutcome` | 是 | external outcome 归纳与 candidate formation 不能隐含在 adapter callback。 |
| `EvaluateCandidateEligibility` | 是 | provenance / gate / eligibility 是资格主线与 fail-closed 关键点。 |
| `RecordArtifactHandoff` | 是 | Artifact handoff 与 image eligibility 分域，pending gap 必须显式。 |
| `PublishInstantiableEntry` / `TransitionAvailability` | 是 | availability / entry / rollback history 是供给主线。 |
| `ResolveInstantiableEntry` | 是 | MI-UP-001 contract gap / unavailable 分支会改变读路径。 |
| `RebuildImageDerivedViews` | 是 | projection freshness 与可重建性影响查询一致性。 |
| `RefreshExternalReferenceSnapshots` / `ReconcileArtifactAndConsumerHandoffs` | 是 | 外部 shadow / handoff gap 的维护失败不能反写 truth。 |
| 其他简单 Query | 否，走通用只读路径 | 只读单一视图且无独立裁剪 / fallback / freshness 复杂分支。 |

## 3. `DefineImageVariant` + `CaptureAssemblyBaseline` 处理流

```text
DefineImageVariant / CaptureAssemblyBaseline Command
  │
  ▼
DefinitionAssembly Inbound
  - 校验 ActorContext、CommandMetadata、IdempotencyKey
  - 读取 MappingSourceSnapshot 与受控 component / seed refs
  │
  ▼
DefinitionAssemblyCoordinator
  - 调用 ImageVariantDefinition.bind_mapping(MappingSourceSnapshot mapping_snapshot)
  - 调用 AssemblyCompletenessGuard.check_baseline(AssemblyBaseline baseline)
  - 形成 complete / incomplete / conflict 结论
  │
  ▼
ImageVariantDefinition / AssemblyBaseline
  - 追加 definition / baseline history
  - 不完整时形成 ContractGap，不生成 buildable revision
  │
  ▼
DefinitionTruthRepositoryPort -> Definition result / AssemblyDerivationView candidate
```

关键设计点：

- mapping、component、seed 只以 ref / snapshot / placement 进入，不能复制正文或用 live fallback 补齐。
- 幂等重放必须返回既有语境或显式 conflict，不创建第二个 definition / baseline truth。
- 完整字段、事务边界、repository contract 和 serialization 留给 03；本流只固定 local decision 先于任何 build。

## 4. `ProposeVariantRevision` 处理流

```text
ProposeVariantRevision Command
  │
  ▼
DefinitionAssembly Inbound
  - 读取 ImageVariantDefinition 与 AssemblyBaseline
  - 校验 command metadata / idempotency
  │
  ▼
DefinitionAssemblyCoordinator
  - 调用 VariantRevision.propose(ImageVariantRef variant_ref, AssemblyBaselineRef baseline_ref, DerivationRecordRef derivation_ref)
  - 调用 VariantRevision.validate(AssemblyCompletenessGuard guard)
  │
  ▼
VariantRevision
  - proposed -> buildable 或 invalid / blocked
  - 追加 supersedes / derivation 关系
  │
  ▼
DefinitionTruthRepositoryPort -> VariantRevisionRef / gap
```

关键设计点：

- `buildable` 只表示 revision 前置成立，不表示 build、candidate、eligibility 或 availability 成功。
- old revision 不被覆盖；恢复以新 revision / supersede 语境发生。
- Step 10 再展开 missing / stale / conflict 的异常归属，03 再定义完整事务与错误映射。

## 5. `RequestBuildIntent` + `RunNightlyBuildSweep` 处理流

```text
RequestBuildIntent Command / RunNightlyBuildSweep Job
  │
  ▼
BuildCandidate Inbound / Operations
  - 选取已持久化 buildable VariantRevision
  - 建立 trigger context 与 idempotency 语境
  │
  ▼
BuildIntentCoordinator
  - 调用 BuildIntent.request(VariantRevisionRef revision_ref, BuildTriggerKind trigger_kind, BuildTriggerRef trigger_ref, CorrelationId correlation_id)
  - 检查 BuildIntent.can_start_attempt()
  │
  ▼
BuildIntent + BuildInputSnapshot
  - accepted -> snapshot / attempt 前置
  - pending / blocked / cancelled 保留原因，不启动 external work
  │
  ▼
BuildTruthRepositoryPort -> BuildIntentRef / blocked result
```

关键设计点：

- nightly 只是受控 intent 来源；不把固定调度产品、时间参数或 pipeline success 写进概要设计。
- Event / Job 只能基于已提交 revision 形成 intent；不直接跳过 baseline / pin guard。
- 完整 snapshot capture、attempt handoff、并发与 retry 语义交给后续流程 / 03；本流强调 accepted 不等于 completed。

## 6. `ConsumeVerifiedBuildRequest` 处理流

```text
ConsumeVerifiedBuildRequest Inbound Event
  │
  ▼
Conditional Event Consumer
  - 验证 EventEnvelope source authority、event id、correlation 与幂等语境
  - 未知 / 未授权 / 重复事件转 rejected / unavailable / ignored
  │
  ▼
BuildIntentCoordinator
  - 将 verified event 转为 BuildTriggerRef
  - 调用 BuildIntent.request(VariantRevisionRef revision_ref, BuildTriggerKind trigger_kind, BuildTriggerRef trigger_ref, CorrelationId correlation_id)
  │
  ▼
BuildIntent
  - 只追加 accepted / pending / blocked intent
  - event arrival 不直接形成 candidate / digest / availability
  │
  ▼
BuildTruthRepositoryPort -> local intent / ContractGap
```

关键设计点：

- `MI-UP-005` 未闭口时入口为 unavailable / rejected，nightly lane 不受影响。
- Event payload 不进入 domain object；只保留验证后的来源身份、触发类别和关联信息。
- 当前无 outbound event；本流不创建 outbox / delivery result。

## 7. `RecordBuildOutcome` 处理流

```text
RecordBuildOutcome Command
  │
  ▼
BuildCandidate Inbound
  - 校验 attempt identity、correlation、idempotency 与 outcome ref
  │
  ▼
BuildIntentCoordinator
  - 调用 BuildAttempt.record_outcome(BuildOutcomeConclusion outcome)
  - 调用 CandidateFormationGuard.check(BuildAttempt attempt, BuildInputSnapshot snapshot, BuildOutcomeConclusion outcome)
  │
  ▼
BuildAttempt / BuildOutcomeConclusion / CandidateImage
  - 明确形成 CandidateImage，或 failed / blocked / unknown
  - unknown 不迁移到普通 success / retry
  │
  ▼
BuildTruthRepositoryPort -> CandidateImageRef / failure gap
```

关键设计点：

- builder success、registry presence、callback 或 transport ACK 仅是输入，不能直接写 candidate。
- output ref、attempt、snapshot 和 correlation 必须可回链；缺失时保守失败。
- raw job / log / report body 不进入本仓；详细 adapter mapping / fake parity 交给 03 / 05。

## 8. `EvaluateCandidateEligibility` 处理流

```text
EvaluateCandidateEligibility Command
  │
  ▼
Qualification Inbound
  - 读取 CandidateImage、BuildInputSnapshot 与 owner safe conclusions
  - 校验 actor / metadata / idempotency
  │
  ▼
QualificationCoordinator
  - 调用 ProvenanceCompletenessGuard.check(ProvenanceBinding provenance_binding)
  - 读取或打开 GateEvaluation
  - 调用 ApplicableGateGuard.evaluate(GateEvaluation gate_evaluation)
  │
  ▼
ProvenanceBinding / GateEvaluation / EligibilityDecision
  - complete + applicable gates passed -> eligible
  - missing / failed / unknown / conflict -> pending / ineligible / blocked
  │
  ▼
QualificationTruthRepositoryPort -> EligibilityDecisionRef / gap
```

关键设计点：

- Q-MI-004 未闭口时只使用 authority-driven applicable set，不枚举 evidence kind / priority。
- eligibility 只属于镜像域，不等于 Artifact formalization、availability 或 consumer confirmation。
- 重新评估追加新 `GateEvaluation` / `EligibilityDecision`，不覆盖历史。

## 9. `RecordArtifactHandoff` 处理流

```text
RecordArtifactHandoff Command
  │
  ▼
Qualification Inbound
  - 验证 candidate 与 eligibility refs
  - 验证 MI-UP-007 合同状态与 Artifact ref 是否可确认
  │
  ▼
QualificationCoordinator
  - 调用 ArtifactHandoffRecord.open(CandidateImageRef candidate_ref, EligibilityDecisionRef eligibility_ref)
  - 记录 optional ArtifactConsumableRef 或 ContractGap
  │
  ▼
ArtifactHandoffRecord
  - pending / gap 为当前允许结果
  - accepted 仅在正式 owner contract 闭口后适用
  │
  ▼
ArtifactHandoffPort -> handoff record / gap view
```

关键设计点：

- 不在本仓定义 ArtifactVersion、lineage、baseline 或正式 ref mint。
- image eligibility 与 Artifact handoff 分域；handoff failure 不回滚已成立 image truth。
- exact schema、confirmation、错误映射留给双方正式 owner contract 与 03。

## 10. `PublishInstantiableEntry` + `TransitionAvailability` 处理流

```text
PublishInstantiableEntry / TransitionAvailability Command
  │
  ▼
SupplyEntry Inbound
  - 读取 eligible CandidateImage / EligibilityDecision / ProvenanceBinding
  - 校验 immutable image ref、actor、metadata、idempotency
  │
  ▼
AvailabilityCoordinator
  - 调用 EntryPinGuard.check_entry(InstantiableEntry entry)
  - 调用 AvailabilityTransitionGuard.check_transition(AvailabilityTransition transition, CurrentAvailabilityFacts current_facts)
  │
  ▼
InstantiableEntry / AvailabilityTransition
  - available / committed 或 rejected / blocked
  - publish / replace / rollback / retire 追加 transition history
  │
  ▼
AvailabilityTruthRepositoryPort -> EntryRef / AvailableVariantCatalogView candidate
```

关键设计点：

- production entry 必须 immutable pinned；不接受 latest / mutable selector / guessed version。
- availability commit 不表示 Member Service launch、container health、upgrade 或 confirmation。
- rollback / retire 通过新 transition 发生，不能删除 candidate、digest 或旧 availability history。

## 11. `ResolveInstantiableEntry` 处理流

```text
ResolveInstantiableEntry Query
  │
  ▼
SupplyEntry Query Inbound
  - 校验 ActorContext、variant ref、consumer contract context
  │
  ▼
AvailabilityCoordinator / Entry Read Service
  - 读取本地 availability truth 与 ImageManifestView
  - 检查 ConsumerHandoffGap / ProjectionFreshness
  │
  ▼
InstantiableEntry / ConsumerHandoffGap / ImageDerivedReadModel
  - 返回 pinned entry、unavailable、contract-gap 或 stale view
  │
  ▼
Member Service consumer boundary
```

关键设计点：

- `MI-UP-001` 未闭口时不可声明 positive resolve / confirmation；不可验证 ref 必须 blocked / unavailable。
- Query 不直接解析 Method Library mapping，不等待 container instantiation 或 health。
- Query 读路径允许 stale / rebuilding / unavailable，但不得以空结果掩盖 gap。

## 12. `RebuildImageDerivedViews` 处理流

```text
RebuildImageDerivedViews Operations Job
  │
  ▼
ProjectionRebuilder
  - 读取正式 truth watermark、ImageTraceRecord 与 ContractGap
  - 标记 ProjectionFreshness=rebuilding
  │
  ▼
ImageDerivedReadModel
  - 从 definition / candidate / qualification / supply truth 重建安全摘要
  - 不读取 external body，不写回 domain truth
  │
  ▼
ProjectionRepositoryPort -> fresh / stale / unavailable view
```

关键设计点：

- projection 失败只影响读侧 freshness，不改变既有 truth 或 history。
- 重建必须可重复、可从正式 truth 重新开始；不能从 projection 反推缺失 truth。
- 具体 watermark、批处理、并发和持久化留给 03。

## 13. `RefreshExternalReferenceSnapshots` + `ReconcileArtifactAndConsumerHandoffs` 处理流

```text
RefreshExternalReferenceSnapshots / ReconcileArtifactAndConsumerHandoffs Job
  │
  ▼
ReferenceDerived Operations
  - 读取 owner ref、safe conclusion、handoff record 与当前 gap
  - 分类 valid / stale / conflict / unavailable / pending
  │
  ▼
ReferenceIntakeCoordinator / HandoffReconciler
  - 更新 ExternalReferenceSnapshot、ContractGap、ProjectionFreshness
  - 仅在正式 resolution 可验证时形成新本地 decision input
  │
  ▼
ReferenceDerived truth / views
  - 追加 trace / reconciliation record
  - 不反写 definition、candidate、eligibility、availability
```

关键设计点：

- 外部 source 变化只影响受影响的新 decision lane；既有成立事实和历史不被删除。
- Artifact / consumer owner 的 positive confirmation 未到达时保持 gap，不自行推断。
- source body、backend response 和 observed state 不进入本仓对象。

## 14. 处理流与对象 / 接口对应关系

| 处理流 | 接口 | 主要对象 | 主要部分 | 关键边界 |
|---|---|---|---|---|
| 定义装配 | `DefineImageVariant` / `CaptureAssemblyBaseline` | variant、baseline、mapping snapshot、pin set | `DefinitionAssembly` | static / live、owner、complete pin |
| revision | `ProposeVariantRevision` | revision、assembly guard | `DefinitionAssembly` | supersede，不覆盖 |
| intent | `RequestBuildIntent` / nightly | intent、snapshot | `BuildCandidate` | accepted != completed |
| event intake | `ConsumeVerifiedBuildRequest` | event envelope、intent、gap | `BuildCandidate` | conditional inbound only |
| outcome | `RecordBuildOutcome` | attempt、outcome、candidate | `BuildCandidate` | ACK != candidate |
| qualification | `EvaluateCandidateEligibility` | provenance、gate、eligibility | `Qualification` | fail closed |
| Artifact handoff | `RecordArtifactHandoff` | handoff、gap | `Qualification` | image != Artifact |
| supply | publish / transition | entry、availability transition | `SupplyEntry` | image != consumer / container |
| resolve | `ResolveInstantiableEntry` | entry、consumer gap、read model | `SupplyEntry` | exact consumer contract pending |
| projection | `RebuildImageDerivedViews` | trace、freshness、read model | `ReferenceDerived` | read-only / rebuildable |
| reconciliation | refresh / reconcile jobs | snapshot、gap、trace | `ReferenceDerived` | no writeback |

## 15. 未展开处理流的取舍

- 简单的 `GetAssemblyDerivation`、`GetBuildTrace`、`GetProvenanceAndEligibility`、`GetImageTrace`、`GetContractGaps` 与 `GetProjectionFreshness` 走通用只读路径；它们没有额外的状态改写或跨 owner positive decision。
- 当前没有 Outbound Event 处理流，因为 `MI-UP-009` 没有 authority；若未来关闭，必须重开接口、流程和状态 Step。
- 具体 adapter / repository / transaction / retry / error mapping 不是遗漏，而是 Step 8 明确留给 03。

## 16. 跨处理流一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| P0 Command 均有独立流 | `pass` | 定义、revision、intent、outcome、qualification、handoff、supply 均覆盖。 |
| 状态改写 Event 有独立流 | `pass` | conditional build request 已画，未授权路径为 unavailable。 |
| 关键 Operations Job 有独立流 | `pass` | nightly、reconcile、projection rebuild、reference refresh 均覆盖。 |
| 流中对象均在 Step 6 定义 | `pass` | 无临时领域对象；接口 context 仅作为骨架参数。 |
| 跨部分接缝可追溯 | `pass` | Definition -> Build -> Qualification -> Supply，ReferenceDerived 横切支撑。 |
| 事务 / retry 未越层 | `pass` | 只写边界与先后，完整算法留 03。 |
| 单一 ready 风险 | `closed_for_current_step` | 每阶段结果和 gap 独立。 |

## 17. 回填草稿与下一步门禁

正式第 8 章应回填通用流、覆盖清单和独立处理流图及关键设计点；不回填本文件诊断 / 取舍过程。Step 9 只能从这些流和 Step 6 对象提取状态，不得新增隐式状态轴。

`gate_status = pass_stop_review`。Step 8 足以支撑 Step 9；下一动作是读取 Step 8 与 Step 9 规范并创建 `02_hld_step_09_state_machine.md`。
