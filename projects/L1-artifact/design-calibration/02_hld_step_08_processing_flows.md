# Step 8. 关键处理流 / 重要函数数据流

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 8
> 回填章节: `02-概要设计.md` §8 关键处理流 / 重要函数数据流
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

围绕 Step 7 已收敛的 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 骨架,说明关键接口如何经过 inbound、application service、domain object / policy、repository / relay、projection、trace 和 handoff 形成可继续详细设计的处理流。

本步不写完整 DTO schema、完整 Rust 函数签名、repository trait、事务脚本、错误码全集、retry 参数、SQL、topic 名称或测试用例。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供主要组成部分、职责与边界 |
| `02_hld_step_06_key_objects.md` 及 6 个对象附录 | 已完成 | 提供处理流中允许点名的对象、policy、projection 和审计对象 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供接口骨架和五类接口分类 |
| `projects/L1-artifact/00-需求文档.md` §9 / §12 / §13 / §14 | 当前正式需求基线 | 提供 FR-ART-001~020、接口边界、NFR 和验收否决项 |
| `projects/L1-artifact/01-架构设计.md` §8 / §9 / §10 / §11 / §13 | 当前正式架构基线 | 提供依赖方向、数据所有权、一致性策略、交互方式和外围增强边界 |
| `projects/L1-governance/design-calibration/02_hld_step_08_processing_flows.md` | 已读取 | 作为 Step 8 单文件高粒度框架参考 |

---

## 3. SOP 问题回答

### 3.1 每个关键 Command 的写路径如何进入 application service、domain object、repository / relay?

`L1-artifact` 的关键 Command 共用一个写入骨架:

1. sync entry 校验 `ActorContext`、`CommandMetadata` 和 idempotency key。
2. application service 读取当前 truth、外部 ref、review 语境和必要的 resolution state。
3. domain policy 判断 truth ownership、正式版本锚点、血缘依据、基线成员正式性和消费边界。
4. domain object factory / transition 形成 truth、history、trace 或 stale marker。
5. 同一写入边界保存 truth、change record、trace record、review trace 或 handoff marker。
6. event relay 只传播已提交 truth 变化,失败不得回滚核心 truth。

### 3.2 每个关键 Query 如何读取 projection 或只读视图?

Query 只读,必须携带 `ActorContext` 和 `QueryMetadata`。简单 ref 查询可走通用读路径;涉及 visibility、projection stale / missing、derived freshness 或 degraded resolution 的查询必须经过 `ArtifactReadVisibilityPolicy` 和 `ArtifactDerivedViewState` surface。

### 3.3 每个关键 Inbound Event 如何解析、幂等、转成本地索引或记录?

Inbound Event Consumer 必须先验证 envelope、source event id、schema version、source ref、dedup key 和 trace context。Consumer 只写 `Artifact*ContextRef`、`ArtifactDefinitionRef`、`AutomationSourceRef`、`ExternalReferenceResolutionState`、pending intake marker 或 stale marker,不得直接创建 `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline` 或 `ConsumableArtifactReference` truth。

### 3.4 每个关键 Operations Job 如何基于已持久化事实做重建、对账或交接?

Operations Job 必须从已持久化 truth、trace、derived state、resolution state 或 handoff marker 出发。`RebuildArtifactDerivedViews`、`RefreshExternalReferenceStates` 和 `RunArtifactReconciliation` 影响查询一致性;archive / observability / sync handoff preparation 影响交接可靠性。Job 不得静默修正业务 truth。

### 3.5 处理流中点名的关键函数调用,参数分别是什么类型?

本步只点名概要层函数骨架,参数必须带类型名:

| 函数骨架 | 参数类型骨架 | 使用流 |
|---|---|---|
| `ArtifactIntakeService.register_intake(...)` | `ArtifactContentSourceRef content_source_ref`;`ArtifactIntakeKind intake_kind`;`ActorContext actor_context` | intake |
| `ArtifactFactPolicy.assert_fact_establishable(...)` | `ArtifactIntakeContext intake_context`;`ArtifactDefinitionRef definition_ref`;`ActorContext actor_context` | fact |
| `ArtifactVersionPolicy.assert_publish_allowed(...)` | `ArtifactVersionCandidate candidate`;`ArtifactFact artifact_fact`;`ActorContext actor_context` | version |
| `ArtifactLineagePolicy.assert_relation_basis_sufficient(...)` | `ArtifactLineageBasisRef basis_ref`;`ArtifactVersion source_version`;`ArtifactVersion target_version` | lineage |
| `ArtifactBaselinePolicy.assert_only_formal_versions(...)` | `ArtifactBaselineMembershipRefSet membership_refs`;`ArtifactReviewAnchor review_anchor` | baseline |
| `ArtifactReadVisibilityPolicy.assert_visible(...)` | `AdjacentConsumerRef consumer_ref`;`ArtifactTruthAnchorRef truth_anchor_ref` | read surface |
| `AutomationBoundaryPolicy.assert_candidate_only(...)` | `AutomationArtifactInput automation_input`;`AutomationSourceRef automation_source_ref` | runtime consumer |
| `ExternalReferenceValidityPolicy.assert_reference_usable(...)` | `ExternalReferenceResolutionState resolution_state` | refresh / query |
| `ArtifactDerivedMaintenanceService.rebuild_view(...)` | `ArtifactDerivedViewKind derived_view_kind`;`ArtifactTruthCursor source_cursor` | rebuild |
| `ArtifactHandoffService.prepare_archive_handoff(...)` | `AdjacentConsumerRef handoff_target_ref`;`ArtifactTruthAnchorRef truth_anchor_ref` | handoff |

### 3.6 哪些步骤必须在概要设计点名,哪些留给详细设计?

概要设计必须点名 sync / async / job 三类路径、policy guard、truth / history / trace / derived / handoff 的顺序和 no-write 边界。完整 DTO 字段、optimistic version、dedup result、retry、dead-letter、relay persistence 和 rollback 细节留给详细设计。

### 3.7 哪些接口必须画独立处理流?

本步独立展开:

- P0 Command: `RegisterArtifactIntake`、`EstablishArtifactFact`、`PublishArtifactVersion`、`EstablishArtifactLineageLink`、`FreezeArtifactBaseline`
- 关键 Query: `GetArtifactReadSurface`
- 所有会改写本地状态的 Consumer
- 所有影响查询一致性或交接可靠性的 Job

### 3.8 哪些接口不单独展开?

`GetArtifactFact`、`GetArtifactVersion`、`ListArtifactVersionsByFact`、`GetArtifactLineageSummary`、`GetArtifactBaseline`、`GetArtifactReviewSummary`、`SearchArtifactFacts`、`GetArtifactPreview`、`GetArtifactReport`、`GetArtifactReconciliationReport`、`GetExternalReferenceResolution` 复用通用读路径或已展开的 `GetArtifactReadSurface` / maintenance 流,不再逐个重复。

---

## 4. 通用处理流骨架

### 4.1 通用 Command 写路径

```text
+====================================================================+
|                   Generic Artifact Command Write Path               |
+====================================================================+
| Command request                                                     |
|   | validate ActorContext + CommandMetadata + idempotency key       |
|   v                                                                 |
| Sync entry / command service                                        |
|   | load refs, current truth, review context and resolution state   |
|   v                                                                 |
| Domain policy + domain object                                       |
|   | assert allowed + apply create / transition / reject / freeze    |
|   v                                                                 |
| Truth persistence boundary                                          |
|   | save truth + change record + trace / review trace + stale mark  |
|   v                                                                 |
| Relay / result surface                                              |
|   | return command result; emit committed change signal only        |
+====================================================================+
```

关键设计点:

- 只有已提交 truth 才能进入 relay。
- command 写路径不得保存外部正文、下游副本或派生正文。
- derived freshness、handoff 或 external resolution 只能作为伴随状态,不能替代核心 truth。

### 4.2 通用 Query 只读路径

```text
+====================================================================+
|                    Generic Artifact Query Read Path                 |
+====================================================================+
| Query request                                                       |
|   | validate ActorContext + QueryMetadata                           |
|   v                                                                 |
| Read / consumption service                                          |
|   | resolve target ref, consumer scope and read subject             |
|   v                                                                 |
| Visibility / freshness guard                                        |
|   | assert visible; inspect derived or resolution state             |
|   v                                                                 |
| Truth / projection / trace read                                     |
|   | read only; no refresh, no repair, no backref write             |
|   v                                                                 |
| Response assembler                                                  |
|   | return view / page + visibility / degraded / freshness surface  |
+====================================================================+
```

关键设计点:

- Query 不写 `ArtifactConsumptionBackref`、`ArtifactTraceRecord` 或 stale marker。
- missing、stale、failed、unavailable 和 not visible 必须进入 response surface。
- Query 不刷新 external source,只暴露当前 resolution / freshness。

### 4.3 通用 Consumer 输入路径

```text
+====================================================================+
|                 Generic Artifact Inbound Consumer Path              |
+====================================================================+
| Inbound event envelope                                              |
|   | validate source event id + schema version + dedup key          |
|   v                                                                 |
| Async intake / consumer service                                     |
|   | map event to allowed ref / summary / pending / stale semantics  |
|   v                                                                 |
| Reference / resolution boundary                                     |
|   | save context ref / definition ref / source ref / resolution     |
|   v                                                                 |
| Local marker update                                                 |
|   | mark pending intake, stale derived view or unresolved source    |
|   v                                                                 |
| Consumer receipt                                                    |
|   | accepted / duplicate / delayed / rejected disposition           |
+====================================================================+
```

关键设计点:

- Consumer 不得绕过 command 入口直接形成本仓核心 truth。
- body rejected、unsupported version 和 duplicate replay 只留 disposition surface。
- 受影响的 derived / read surface 范围留给详细设计闭口。

### 4.4 通用 Job 维护路径

```text
+====================================================================+
|                  Generic Artifact Maintenance Job Path              |
+====================================================================+
| Job input                                                           |
|   | JobMetadata + run id + scope / cursor / target                 |
|   v                                                                 |
| Operations / maintenance service                                    |
|   | load committed truth, trace, resolution or derived state        |
|   v                                                                 |
| Policy / maintenance guard                                          |
|   | assert rebuild / refresh / handoff source allowed               |
|   v                                                                 |
| Derived / resolution / handoff stores                               |
|   | save rebuilt views, refreshed state or prepared handoff marker  |
|   v                                                                 |
| Job report                                                          |
|   | expose changed refs, failures, unresolved refs and receipts     |
+====================================================================+
```

关键设计点:

- Job 只维护 derived、resolution、reconciliation 和 handoff。
- refresh / rebuild / handoff 失败不得回滚核心 truth。
- job report 是外围可解释性材料,不是业务事实。

---

## 5. 按主要组成部分组织的关键处理流清单

| 主要组成部分 | 关键接口 | 处理流 |
|---|---|---|
| `Artifact fact management` | `EstablishArtifactFact` | fact establish flow |
| `Artifact version management` | `PublishArtifactVersion` | version publish flow |
| `Artifact lineage management` | `EstablishArtifactLineageLink` | lineage establish flow |
| `Artifact baseline management` | `FreezeArtifactBaseline` | baseline freeze flow |
| `Artifact intake convergence` | `RegisterArtifactIntake` | intake register flow |
| `Artifact review and responsibility context` | `GetArtifactReadSurface` | authorized read flow |
| `Automation output control boundary` | `ConsumeRuntimeArtifactSignalRecorded` | runtime signal consumer flow |
| `Artifact consumption and traceability` | `GetArtifactReadSurface`、`PrepareArtifactObservabilityHandoff`、`PrepareArtifactSyncHandoff` | read / handoff flows |
| `Derived maintenance and handoff preparation` | `RebuildArtifactDerivedViews`、`RunArtifactReconciliation`、`PrepareArtifactArchiveHandoff` | maintenance / report / handoff flows |
| `External reference and local mirror support` | 6 个 Consumers、`RefreshExternalReferenceStates` | reference refresh and consumer flows |

---

## 6. 处理流覆盖清单

| 接口 | 是否画独立处理流 | 原因 |
|---|---|---|
| `RegisterArtifactIntake` | 是 | P0 write path,决定正式输入收束 |
| `EstablishArtifactFact` | 是 | P0 write path,决定正式 truth 入口 |
| `CreateArtifactVersionCandidate` | 否 | 复用 version publish 前半段,差异只在 candidate 生成 |
| `PublishArtifactVersion` | 是 | P0 write path,决定稳定 version truth |
| `SupersedeArtifactVersion` | 否 | 复用 version publish flow,差异在 supersede 分支 |
| `EstablishArtifactLineageLink` | 是 | P0 write path,决定正式 lineage truth |
| `RejectArtifactLineageLink` | 否 | 复用 lineage flow,差异在 reject 分支 |
| `CreateArtifactBaselineCandidate` | 否 | 复用 baseline freeze 前半段,差异在 candidate 形成 |
| `FreezeArtifactBaseline` | 是 | P0 write path,决定正式 baseline truth |
| `SupersedeArtifactBaseline` | 否 | 复用 baseline flow,差异在 supersede 分支 |
| `OpenArtifactReviewAnchor` | 否 | 结构简单,并入 `GetArtifactReadSurface` 和 fact / baseline flow 解释 |
| `AssignArtifactResponsibility` | 否 | 结构简单,并入 fact / baseline 前置语境 |
| `RegisterAutomationArtifactInput` | 否 | 复用 runtime signal consumer + intake flow |
| `AcceptAutomationArtifactInput` | 否 | 复用 runtime signal consumer + intake / fact flow |
| `IssueConsumableArtifactReference` | 否 | 与 read surface同构,差异只在 reference establish |
| `RecordArtifactConsumptionBackref` | 否 | 复用 read surface后的显式 backref write |
| `GetArtifactReadSurface` | 是 | 涉及 visibility、freshness、degraded |
| 其余 Query | 否 | 复用通用读路径或 `GetArtifactReadSurface` 边界 |
| `ConsumeWorkArtifactContextChanged` | 是 | 改写本地 context ref、resolution 和 stale marker |
| `ConsumeProcessArtifactContextChanged` | 是 | 改写本地 context ref、resolution 和 stale marker |
| `ConsumeGovernanceArtifactContextChanged` | 是 | 改写本地 context ref、resolution 和 stale marker |
| `ConsumeMethodArtifactDefinitionChanged` | 是 | 改写 definition ref、resolution 和 stale marker |
| `ConsumeRuntimeArtifactSignalRecorded` | 是 | 改写 automation source ref、resolution 和 pending marker |
| `ConsumeExternalContentSourceChanged` | 是 | 改写 source resolution 和 derived / intake stale marker |
| `ArtifactFactChanged` 及其同构 truth change events | 是 | 需要给 outbound relay 边界统一口径 |
| `RebuildArtifactDerivedViews` | 是 | 影响 query freshness 和 projection consistency |
| `RefreshExternalReferenceStates` | 是 | 影响 resolution state 和写路径可解释性 |
| `RunArtifactReconciliation` | 是 | 影响 reconciliation surface 和 freshness |
| `PrepareArtifactArchiveHandoff` | 是 | 影响 archive handoff 可靠性 |
| `PrepareArtifactObservabilityHandoff` | 是 | 影响 observability handoff 可靠性 |
| `PrepareArtifactSyncHandoff` | 是 | 影响 sync handoff 可靠性 |

---

## 7. 关键接口处理流

#### RegisterArtifactIntake 处理流

```text
+====================================================================+
|                     RegisterArtifactIntake Flow                     |
+====================================================================+
| RegisterArtifactIntake                                              |
|   | ArtifactContentSourceRef + ArtifactIntakeKind + ActorContext    |
|   v                                                                 |
| ArtifactIntakeService                                               |
|   | register_intake(ArtifactContentSourceRef content_source_ref,     |
|   |                  ArtifactIntakeKind intake_kind,                 |
|   |                  ActorContext actor_context)                     |
|   v                                                                 |
| ArtifactIntakePolicy                                                |
|   | assert_source_resolvable(ArtifactContentSourceRef source_ref)    |
|   | assert_no_external_body_ingest(ArtifactContentSourceRef source)  |
|   v                                                                 |
| ArtifactIntakeContext + ArtifactSubmissionRecord                    |
|   | from_source(...) + record(...)                                  |
|   v                                                                 |
| Intake persistence + resolution audit                               |
|   | save intake context, submission record and initial resolution    |
+====================================================================+
```

关键设计点:

- 本流只建立收束语境,不直接创建 `ArtifactFact`。
- work / process / governance / method / runtime 语境只能以 ref 或 summary hint 进入。
- 正文 ownership 越界必须在 intake 阶段被拒绝或挂起。

#### EstablishArtifactFact 处理流

```text
+====================================================================+
|                     EstablishArtifactFact Flow                      |
+====================================================================+
| EstablishArtifactFact                                               |
|   | ArtifactIntakeContextRef + ArtifactDefinitionRef + ActorContext |
|   v                                                                 |
| ArtifactFactService                                                 |
|   | load intake context, definition ref and review anchor hint       |
|   v                                                                 |
| ArtifactFactPolicy                                                  |
|   | assert_fact_establishable(ArtifactIntakeContext intake_context,  |
|   |                           ArtifactDefinitionRef definition_ref,  |
|   |                           ActorContext actor_context)            |
|   v                                                                 |
| ArtifactContentFactContext + ArtifactFact                           |
|   | from_source(...) + from_intake(...) + establish(...)            |
|   v                                                                 |
| Fact persistence + change history                                   |
|   | save content context, fact and ArtifactFactChangeRecord          |
+====================================================================+
```

关键设计点:

- `ArtifactContentFactContext` 只保存引用、摘要和可用性语义,不保存正文副本。
- automation input、preview、report 和 archive 材料不能替代 truth 来源。
- fact 建立后才允许 version、lineage 和 baseline 围绕同一 truth anchor 展开。

#### PublishArtifactVersion 处理流

```text
+====================================================================+
|                      PublishArtifactVersion Flow                    |
+====================================================================+
| PublishArtifactVersion                                              |
|   | ArtifactVersionCandidateRef + ActorContext                      |
|   v                                                                 |
| ArtifactVersionService                                              |
|   | load candidate, artifact fact and current version                |
|   v                                                                 |
| ArtifactVersionPolicy                                               |
|   | assert_publish_allowed(ArtifactVersionCandidate candidate,       |
|   |                        ArtifactFact artifact_fact,               |
|   |                        ActorContext actor_context)               |
|   v                                                                 |
| ArtifactVersion + ArtifactFact                                      |
|   | from_candidate(...) + publish(...) + bind_current_version(...)   |
|   v                                                                 |
| Version persistence + history                                       |
|   | save version, candidate transition, fact update and change rec   |
+====================================================================+
```

关键设计点:

- current latest、workspace view 或自动化再生成结果都不能替代正式 version truth。
- `SupersedeArtifactVersion` 复用本流,但必须显式记录 supersede 关系和历史版本保留。
- 历史版本读取和基线冻结都必须回到稳定 `ArtifactVersionRef`。

#### EstablishArtifactLineageLink 处理流

```text
+====================================================================+
|                    EstablishArtifactLineageLink Flow                |
+====================================================================+
| EstablishArtifactLineageLink                                        |
|   | source_version_ref + target_version_ref + basis_ref             |
|   v                                                                 |
| ArtifactLineageService                                              |
|   | load source version, target version and relation kind            |
|   v                                                                 |
| ArtifactLineagePolicy                                               |
|   | assert_anchor_versions_resolved(ArtifactVersion source_version,  |
|   |                                  ArtifactVersion target_version) |
|   | assert_relation_basis_sufficient(ArtifactLineageBasisRef basis)  |
|   v                                                                 |
| ArtifactLineageLink                                                 |
|   | connect_versions(...) + establish(...)                          |
|   v                                                                 |
| Lineage persistence + history                                       |
|   | save lineage link and ArtifactLineageChangeRecord                |
+====================================================================+
```

关键设计点:

- trace、tool result、model context 和 graph query 只能作为 basis 线索或只读派生。
- lineage truth 必须锚定正式 version,不能偷连 current content。
- `RejectArtifactLineageLink` 复用本流,差异只在 reject transition。

#### FreezeArtifactBaseline 处理流

```text
+====================================================================+
|                      FreezeArtifactBaseline Flow                    |
+====================================================================+
| FreezeArtifactBaseline                                              |
|   | ArtifactBaselineRef + ArtifactReviewAnchorRef + ActorContext    |
|   v                                                                 |
| ArtifactBaselineService                                             |
|   | load baseline candidate, membership refs and freeze context      |
|   v                                                                 |
| ArtifactBaselinePolicy                                              |
|   | assert_only_formal_versions(ArtifactBaselineMembershipRefSet,    |
|   |                             ArtifactReviewAnchor review_anchor)  |
|   | assert_freeze_context_ready(ArtifactReviewAnchor review_anchor)  |
|   v                                                                 |
| ArtifactBaseline + ArtifactBaselineMembership                       |
|   | freeze(...) + freeze_member()                                   |
|   v                                                                 |
| Baseline persistence + history                                      |
|   | save baseline, memberships and ArtifactBaselineChangeRecord      |
+====================================================================+
```

关键设计点:

- baseline 成员不能在冻结时再动态解析 current version。
- governance decision、release note、archive package 和项目状态都不能替代 baseline truth。
- `CreateArtifactBaselineCandidate` 和 `SupersedeArtifactBaseline` 分别复用本流前后半段。

#### GetArtifactReadSurface 处理流

```text
+====================================================================+
|                       GetArtifactReadSurface Flow                   |
+====================================================================+
| GetArtifactReadSurface                                              |
|   | truth anchor or consumable ref + AdjacentConsumerRef + context  |
|   v                                                                 |
| ArtifactReadService                                                 |
|   | resolve consumable ref and read subject                         |
|   v                                                                 |
| ArtifactReadVisibilityPolicy                                        |
|   | assert_visible(AdjacentConsumerRef consumer_ref,                |
|   |                ArtifactTruthAnchorRef truth_anchor_ref)         |
|   v                                                                 |
| Read surface / trace / derived state read                           |
|   | load ArtifactReadSurfaceView, trace ref and freshness surface    |
|   v                                                                 |
| Response assembler                                                  |
|   | return visible / restricted / stale / unavailable read surface   |
+====================================================================+
```

关键设计点:

- Query 只读,不在本流里隐式写 `ArtifactConsumptionBackref`。
- stale / unavailable / restricted 必须作为正式 surface 返回。
- `RecordArtifactConsumptionBackref` 作为后续显式写入流,只消费本流已经选定的 truth anchor。

#### ConsumeWorkArtifactContextChanged 处理流

```text
+====================================================================+
|                 ConsumeWorkArtifactContextChanged Flow              |
+====================================================================+
| Work context changed envelope                                       |
|   | source event id + ArtifactWorkContextRef + dedup key            |
|   v                                                                 |
| WorkArtifactContextConsumer                                         |
|   | map event to allowed work context summary                       |
|   v                                                                 |
| ExternalReferenceResolutionState                                    |
|   | from_reference(...) / mark_resolved(...) / mark_stale(...)      |
|   v                                                                 |
| Context ref persistence + stale marker                              |
|   | save ArtifactWorkContextRef and affected intake stale marker     |
+====================================================================+
```

关键设计点:

- work truth 不归 artifact,这里只保存 work 语境引用和解析状态。
- consumer 不能直接创建 intake、fact 或 baseline truth。
- 受影响范围只到 intake / review / derived stale,不推进核心 truth。

#### ConsumeProcessArtifactContextChanged 处理流

```text
+====================================================================+
|               ConsumeProcessArtifactContextChanged Flow             |
+====================================================================+
| Process context changed envelope                                    |
|   | source event id + ArtifactProcessContextRef + dedup key         |
|   v                                                                 |
| ProcessArtifactContextConsumer                                      |
|   | map event to allowed process context summary                    |
|   v                                                                 |
| ExternalReferenceResolutionState                                    |
|   | from_reference(...) / mark_resolved(...) / mark_stale(...)      |
|   v                                                                 |
| Context ref persistence + stale marker                              |
|   | save ArtifactProcessContextRef and affected intake stale marker  |
+====================================================================+
```

关键设计点:

- process execution 和 waiting state 不归 artifact。
- process 输出只能作为 artifact intake / lineage 线索,不能替代正式 truth。
- unsupported version 和 duplicate replay 只保留 receipt / disposition。

#### ConsumeGovernanceArtifactContextChanged 处理流

```text
+====================================================================+
|             ConsumeGovernanceArtifactContextChanged Flow            |
+====================================================================+
| Governance context changed envelope                                 |
|   | source event id + ArtifactGovernanceContextRef + dedup key      |
|   v                                                                 |
| GovernanceArtifactContextConsumer                                   |
|   | map event to governance context summary                         |
|   v                                                                 |
| ExternalReferenceResolutionState                                    |
|   | from_reference(...) / mark_resolved(...) / mark_stale(...)      |
|   v                                                                 |
| Context ref persistence + review / baseline stale                   |
|   | save governance context ref and affected stale markers          |
+====================================================================+
```

关键设计点:

- governance decision truth 不归 artifact。
- governance 语境只支撑 review、responsibility 和 baseline freeze context。
- consumer 失败只能表现为 unresolved / stale,不能补造治理事实。

#### ConsumeMethodArtifactDefinitionChanged 处理流

```text
+====================================================================+
|              ConsumeMethodArtifactDefinitionChanged Flow            |
+====================================================================+
| Method definition changed envelope                                  |
|   | source event id + ArtifactDefinitionRef + source version        |
|   v                                                                 |
| ArtifactDefinitionConsumer                                          |
|   | map definition change to safe definition summary                |
|   v                                                                 |
| ArtifactDefinitionRef + ExternalReferenceResolutionState            |
|   | from_external(...) / mark_resolved(...) / mark_stale(...)       |
|   v                                                                 |
| Definition ref persistence + fact / intake stale                    |
|   | save definition ref and mark affected fact surfaces stale       |
+====================================================================+
```

关键设计点:

- method-library 正文不进入 artifact truth。
- definition 变化只能影响 fact establishability、intake explainability 和 derived freshness。
- definition source unavailable 只能阻塞新写入或造成 degraded read,不回滚既有 truth。

#### ConsumeRuntimeArtifactSignalRecorded 处理流

```text
+====================================================================+
|                ConsumeRuntimeArtifactSignalRecorded Flow            |
+====================================================================+
| Runtime signal envelope                                              |
|   | source event id + AutomationSourceRef + dedup key               |
|   v                                                                 |
| AutomationArtifactSignalConsumer                                     |
|   | map event to candidate automation input semantics               |
|   v                                                                 |
| AutomationBoundaryPolicy                                            |
|   | assert_candidate_only(AutomationArtifactInput automation_input,  |
|   |                       AutomationSourceRef automation_source_ref) |
|   v                                                                 |
| AutomationSourceRef + resolution + pending marker                   |
|   | save source ref, resolution state and pending automation marker  |
+====================================================================+
```

关键设计点:

- runtime / capability 结果只能形成候选线索,不能直接创建 fact、version 或 lineage。
- 正式收束仍要回到 `RegisterAutomationArtifactInput` 或 `AcceptAutomationArtifactInput`。
- tool output、model context 和 execution log 不进入 artifact 正文 truth。

#### ConsumeExternalContentSourceChanged 处理流

```text
+====================================================================+
|                ConsumeExternalContentSourceChanged Flow             |
+====================================================================+
| External content source envelope                                    |
|   | source event id + ArtifactContentSourceRef + source version     |
|   v                                                                 |
| ExternalContentSourceConsumer                                       |
|   | map source availability to content resolution semantics         |
|   v                                                                 |
| ExternalReferenceResolutionState                                    |
|   | mark_resolved(...) / mark_stale(...) / mark_unresolved(...)     |
|   v                                                                 |
| Source ref persistence + intake / derived stale                     |
|   | save resolution state and mark affected read surfaces stale     |
+====================================================================+
```

关键设计点:

- 外部内容来源变化只改变可达性和解释能力,不直接改写 `ArtifactContentFactContext` truth。
- 正文不可达时允许返回 stale / unavailable / degraded surface。
- consumer 不复制正文,也不私造替代内容。

#### ArtifactFactChanged 处理流

```text
+====================================================================+
|                     ArtifactFactChanged Relay Flow                  |
+====================================================================+
| Committed truth change                                              |
|   | ArtifactFact / Version / Lineage / Baseline change record       |
|   v                                                                 |
| Event / Audit / Handoff Relay Ports                                 |
|   | copy committed change summary into outbound relay payload        |
|   v                                                                 |
| Downstream change signal                                             |
|   | Artifact*Changed / TraceAvailable / DerivedViewStateChanged      |
|   v                                                                 |
| Delivery result surface                                              |
|   | success / failed / retryable kept outside core truth            |
+====================================================================+
```

关键设计点:

- outbound event 只复制已提交 truth 变化,不得按 current projection 重新构造业务含义。
- relay 失败不回滚核心 truth。
- archive / observability / sync 的可审计交接由 handoff jobs 另行处理,不和普通 truth change signal 混写。

#### RebuildArtifactDerivedViews 处理流

```text
+====================================================================+
|                  RebuildArtifactDerivedViews Flow                   |
+====================================================================+
| RebuildArtifactDerivedViews                                         |
|   | ArtifactDerivedViewKind set + ArtifactTruthCursor + JobMetadata |
|   v                                                                 |
| ArtifactDerivedMaintenanceService                                   |
|   | load committed truth, summary views and existing derived state   |
|   v                                                                 |
| ArtifactDerivedViewState                                            |
|   | start_rebuild() / mark_rebuilt(ArtifactTruthCursor source)      |
|   v                                                                 |
| Projection builders                                                  |
|   | rebuild preview, report and reconciliation report projections    |
|   v                                                                 |
| Derived persistence + job report                                    |
|   | save rebuilt views, freshness state and rebuild report           |
+====================================================================+
```

关键设计点:

- rebuild 只从 committed truth / summary / trace 构造只读结果。
- derived view 失败只能表现为 stale / failed / unavailable。
- preview / report / reconciliation 都不得反写 fact、version、lineage 或 baseline。

#### RefreshExternalReferenceStates 处理流

```text
+====================================================================+
|                RefreshExternalReferenceStates Flow                  |
+====================================================================+
| RefreshExternalReferenceStates                                      |
|   | reference scope + source filters + JobMetadata                  |
|   v                                                                 |
| ExternalReferenceRefreshService                                     |
|   | load refs, current resolution state and refresh targets         |
|   v                                                                 |
| ExternalReferenceValidityPolicy                                     |
|   | assert_reference_usable(ExternalReferenceResolutionState)       |
|   v                                                                 |
| ExternalReferenceResolutionState + ExternalMirrorRefreshRecord      |
|   | mark_resolved(...) / mark_stale(...) / mark_failed(...)         |
|   v                                                                 |
| Resolution persistence + affected stale markers                     |
|   | save resolution, refresh record and related stale markers       |
+====================================================================+
```

关键设计点:

- refresh 只更新 resolution、refresh history 和相关 stale surface。
- stale / unresolved 不能直接推进 truth write。
- external mirror 是支撑材料,不是新的 truth center。

#### RunArtifactReconciliation 处理流

```text
+====================================================================+
|                   RunArtifactReconciliation Flow                    |
+====================================================================+
| RunArtifactReconciliation                                           |
|   | reconciliation scope + truth cursor + JobMetadata              |
|   v                                                                 |
| ArtifactReconciliationService                                       |
|   | load truth summaries, derived states and handoff markers         |
|   v                                                                 |
| ArtifactReconciliationReport                                        |
|   | from_scope(...) + evaluate gaps / drift / stale conditions      |
|   v                                                                 |
| Reconciliation persistence                                          |
|   | save report and update derived freshness marker if needed        |
|   v                                                                 |
| Job report                                                          |
|   | expose clean / gap / stale / failed surface                     |
+====================================================================+
```

关键设计点:

- reconciliation 只报告 drift、gap 和 freshness 问题。
- report failure 不等于核心 truth failure。
- 修复动作留给后续 command 或 job,不能在本流中隐式完成。

#### PrepareArtifactArchiveHandoff 处理流

```text
+====================================================================+
|                 PrepareArtifactArchiveHandoff Flow                  |
+====================================================================+
| PrepareArtifactArchiveHandoff                                       |
|   | truth / baseline / report scope + archive target + JobMetadata  |
|   v                                                                 |
| ArtifactHandoffService                                              |
|   | load truth anchors, report views and existing handoff records    |
|   v                                                                 |
| ArtifactHandoffRecord + ArtifactTraceRecord                         |
|   | for_target(...) + mark_prepared()                               |
|   v                                                                 |
| Handoff preparation ports                                           |
|   | assemble archive-ready refs, summaries and traceable receipts    |
|   v                                                                 |
| Handoff persistence + job report                                    |
|   | save prepared / failed / retryable handoff state                |
+====================================================================+
```

关键设计点:

- archive package body 不归 artifact。
- 本流只准备 handoff 所需 refs、summary 和 receipt 语义。
- handoff 失败不回滚 baseline 或 report truth。

#### PrepareArtifactObservabilityHandoff 处理流

```text
+====================================================================+
|             PrepareArtifactObservabilityHandoff Flow               |
+====================================================================+
| PrepareArtifactObservabilityHandoff                                 |
|   | trace / lineage / integrity scope + target + JobMetadata        |
|   v                                                                 |
| ArtifactHandoffService                                              |
|   | load ArtifactTraceRecord, lineage summaries and explanation refs |
|   v                                                                 |
| ArtifactHandoffRecord + ArtifactTraceRecord                         |
|   | for_target(...) + mark_prepared()                               |
|   v                                                                 |
| Handoff preparation ports                                           |
|   | assemble observability-facing explanation material              |
|   v                                                                 |
| Handoff persistence + job report                                    |
|   | save prepared / failed / retryable handoff state                |
+====================================================================+
```

关键设计点:

- observability physical ledger 不归 artifact。
- observability handoff 只解释 artifact truth 与 traceability。
- 交接成功与核心 truth 成立必须分离判断。

#### PrepareArtifactSyncHandoff 处理流

```text
+====================================================================+
|                   PrepareArtifactSyncHandoff Flow                   |
+====================================================================+
| PrepareArtifactSyncHandoff                                          |
|   | sync scope + downstream target + JobMetadata                    |
|   v                                                                 |
| ArtifactHandoffService                                              |
|   | load consumable refs, read surface and handoff target           |
|   v                                                                 |
| ArtifactHandoffRecord + ArtifactTraceRecord                         |
|   | for_target(...) + mark_prepared()                               |
|   v                                                                 |
| Sync handoff preparation ports                                      |
|   | assemble sync-safe refs, freshness and receipt surface          |
|   v                                                                 |
| Handoff persistence + job report                                    |
|   | save delivered / failed / retryable sync handoff state          |
+====================================================================+
```

关键设计点:

- sync private copy 不得反向定义 artifact truth。
- 本流只导出 sync-safe ref、freshness 和 receipt,不导出本仓 truth owner。
- sync 冲突解释留给详细设计和后续状态机。

---

## 8. 未展开处理流的取舍说明

| 接口组 | 不单独展开原因 | 继续承接位置 |
|---|---|---|
| `CreateArtifactVersionCandidate`、`SupersedeArtifactVersion` | 与 `PublishArtifactVersion` 同构,只是 candidate 形成或 supersede 分支不同 | Step 9 状态机、详细设计函数签名 |
| `RejectArtifactLineageLink` | 与 `EstablishArtifactLineageLink` 同构,只是 transition 不同 | Step 9、异常章节 |
| `CreateArtifactBaselineCandidate`、`SupersedeArtifactBaseline` | 与 `FreezeArtifactBaseline` 同构,差异只在 candidate / supersede transition | Step 9、详细设计 |
| `OpenArtifactReviewAnchor`、`AssignArtifactResponsibility` | 作为 fact / baseline / consumption 的前置语境,结构简单 | Step 9、详细设计 |
| 其余 Query | 复用通用只读路径或 `GetArtifactReadSurface` 的 visibility / freshness 边界 | Step 9、异常章节 |
| 普通 truth change outbound events | 复用 `ArtifactFactChanged` relay flow | Step 9 状态传播、详细设计 relay 契约 |

---

## 9. 处理流归属停审记录

| 主要组成部分 | 停审结果 | 说明 |
|---|---|---|
| `Artifact fact management` | pass | fact establish flow 已回指 Step 6 truth 对象和 Step 7 command |
| `Artifact version management` | pass | version publish flow 已显式保留 candidate / current / history 边界 |
| `Artifact lineage management` | pass | lineage flow 已显式排除 trace / tool / graph truth 化 |
| `Artifact baseline management` | pass | baseline freeze flow 已显式保留 formal version only 边界 |
| `Artifact intake convergence` | pass | intake flow 已保留 ref / summary 输入和 no external body ownership |
| `Artifact review and responsibility context` | pass | read surface flow 已解释 visibility 和 review / responsibility 前置语境 |
| `Automation output control boundary` | pass | runtime signal flow 已保留 candidate only 约束 |
| `Artifact consumption and traceability` | pass | read / trace / sync / observability handoff 已分开表达 |
| `Derived maintenance and handoff preparation` | pass | rebuild / reconcile / archive handoff 已保留 no truth repair |
| `External reference and local mirror support` | pass | 6 个 consumer 和 refresh flow 已统一到 resolution / stale / pending 语义 |

---

## 10. 跨处理流一致性审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| Step 7 关键接口是否都有处理流口径 | pass | P0 command、关键 query、全部 state-writing consumers 和关键 jobs 均已覆盖 |
| Step 8 点名对象是否都能回指 Step 6 | pass | 使用对象均来自 Step 6 truth / state / policy / projection / audit 集 |
| 是否出现 consumer 直接创建核心 truth | pass | 所有 consumer 都只写 ref、resolution、pending 或 stale |
| 是否出现 query 隐式写 backref 或 refresh | pass | Query 保持只读,backref 和 refresh 分别回到 command / job |
| 是否出现 job 修复核心 truth | pass | rebuild / refresh / reconcile / handoff 全部保持 no truth repair |
| sync / async / job 三类路径是否混写 | pass | command、consumer、job 边界分离,且与 Step 3 / 01 架构一致 |
| 是否下沉到完整函数实现、事务脚本或协议时序 | pass | 当前只保留概要层 service / policy / object / relay 骨架 |

---

## 11. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §8 引用本文件 §4 的通用 command / query / consumer / job 处理流骨架。
- §8 摘录本文件 §7 的关键处理流图,保留图后关键设计点。
- §8 引用本文件 §8 的未展开理由,避免正式文档逐接口机械重复。
- 详细设计必须基于本文件继续补 DTO、函数签名、repository / relay port、事务边界、异常分支和测试切口。

---

## 12. 进入下一步条件

- 已按主要组成部分明确关键接口如何通过主要对象形成处理流。
- 已覆盖 P0 Command、关键 Query、全部 state-writing Consumers 和关键 Jobs。
- 已点名关键函数骨架且参数包含类型名。
- 已说明未逐接口重复画图的取舍。
- 未写入完整 DTO schema、repository trait、事务脚本、错误码全集或测试细节。
- 可以进入 Step 9 “状态机与状态流转”。
