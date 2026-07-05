# Step 7. API / 接口骨架

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 7
> 回填章节: `02-概要设计.md` §7 API / 接口骨架
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

把 `L1-artifact` 的正式入口按 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 分类,明确每类接口的输入骨架、输出骨架、处理边界和读写性质。

本步不写 HTTP path、RPC method、topic、完整 DTO schema、错误码、repository trait、事务细节或 handler 调用链。接口名称只用于概要层锚定,详细协议、字段、幂等结果、错误映射和 port 签名留给 `03-详细设计.md`。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 10 个主要组成部分、职责和入口 / 运维形态 |
| `02_hld_step_06_key_objects.md` + 6 个附录 | 已完成 | 提供接口必须承接的对象主语和只读 / truth / state 区分 |
| `projects/L1-artifact/00-需求文档.md` §9 / §12 / §13 / §14 | 当前正式需求基线 | 提供 FR-ART-001~020、接口边界、NFR 和验收否决线索 |
| `projects/L1-artifact/01-架构设计.md` §7 / §8 / §9 / §10 / §11 / §13 | 当前正式架构基线 | 提供三类路径分离、数据所有权、一致性策略、交互方式和外围增强边界 |
| `projects/L1-governance/design-calibration/02_hld_step_07_api_interface_skeleton.md` | 已读取 | 作为 Step 7 单文件高粒度框架参考 |

---

## 3. SOP 问题回答

### 3.1 哪些接口属于 Command,负责改写真相?

Command 只覆盖会改写 `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment`、`AutomationArtifactInput`、`ConsumableArtifactReference`、`ArtifactConsumptionBackref` 和正式变化记录的用例入口。Command 不得由 Query、Consumer 或 Job 隐式替代。

### 3.2 哪些接口属于 Query,只读取投影或只读视图?

Query 只读取 truth summary、projection、read surface、preview、report、reconciliation、trace 和 external resolution summary。Query 不得创建或修复 `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline` 或消费回指 truth。

### 3.3 哪些外部事实需要通过 Inbound Event Consumer 进入本仓?

进入本仓的外部事实包括 work / process / governance 语境变化、method definition 变化、runtime / capability 自动化产出线索和外部内容来源状态变化。Consumer 只能更新 `Artifact*ContextRef`、`ArtifactDefinitionRef`、`AutomationSourceRef`、`ExternalReferenceResolutionState`、pending intake marker 或 stale marker,不得直接生成核心 Artifact truth。

### 3.4 哪些已提交事实需要通过 Outbound Event 对外传播?

需要传播的事实包括 fact、version、lineage、baseline、review / responsibility、consumable reference、traceability、derived freshness 和 handoff state 变化。Outbound Event 只能传播已成立 truth 或维护状态,下游失败不得回滚核心 truth。

### 3.5 哪些恢复、发布、重建、对账动作属于 Operations Job?

preview / report / reconciliation rebuild、external reference refresh、archive / observability / sync handoff preparation 属于 Operations Job。Job 可以维护 `ArtifactDerivedViewState`、`ExternalReferenceResolutionState`、`ArtifactHandoffRecord` 和相关只读结果,不得静默推进业务 truth。

### 3.6 Command 输入骨架是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`?

需要。所有 Command 输入都必须携带 `ActorContext`、`CommandMetadata` 和 `CommandMetadata.request.idempotency_key`。缺失时不得进入 truth 写路径。

### 3.7 Query 输入骨架是否需要 `ActorContext`?

需要。所有 Query 输入都必须携带 `ActorContext` 和 `QueryMetadata`,用于可见性、分页、consistency hint 和消费追溯关联。

### 3.8 Event Consumer 输入骨架是否需要 event id、幂等键或 envelope?

需要。所有 Consumer 输入都必须携带来源 envelope、source event id、source ref、schema version、dedup key 和 trace context。重复、乱序或 unsupported version 只能更新 pending / stale / failed 语义,不得回退正式 truth。

---

## 4. 接口分类说明

| 接口类别 | 读写性质 | 主要用途 | 必须携带的上下文 | 不得做什么 |
|---|---|---|---|---|
| Command | 改写 Artifact truth / history / backref | fact、version、lineage、baseline、review、automation boundary 和消费回指正式变化 | `ActorContext`、`CommandMetadata`、idempotency key、trace context | 不保存外部正文;不由派生视图或下游副本反向定义 truth |
| Query | 只读 | 读取 Artifact truth summary、read surface、preview、report、reconciliation、trace 和 resolution summary | `ActorContext`、`QueryMetadata`、page / consistency hint | 不写 truth、pending marker、stale marker 或 handoff state |
| Inbound Event Consumer | 写 reference / resolution / pending / stale | 承接外部语境变化、自动化线索和定义来源变化 | event envelope、source event id、source ref、dedup key、trace context | 不直接创建 fact / version / lineage / baseline |
| Outbound Event | 输出已成立事实或维护状态 | 向 work、process、governance、conversation、workspace、archive、observability、sync 传播 Artifact 变化 | truth ref、change kind、trace context | 不携带外部正文或下游私有副本 |
| Operations Job | 后台维护 / 派生 / 对账 / 交接准备 | rebuild、refresh、reconcile、handoff preparation | `JobMetadata`、system / operator actor、run id、job idempotency key | 不作为业务 command;不修复核心 truth |

---

## 5. Command API 骨架表

所有 Command 输入中的 `context` 均表示 `ActorContext` + `CommandMetadata` + idempotency key + trace context。

| Command | 输入骨架 | 输出骨架 | 写入对象 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `RegisterArtifactIntake` | content source ref + intake kind + optional definition / work / process / governance refs + context | `ArtifactIntakeCommandResult` | `ArtifactIntakeContext`、`ArtifactSubmissionRecord`、`ArtifactInputResolutionRecord` | Artifact intake convergence | 只建立收束语境,不等于正式 fact |
| `EstablishArtifactFact` | intake context ref + definition ref + optional review anchor ref + context | `ArtifactFactCommandResult` | `ArtifactFact`、`ArtifactContentFactContext`、`ArtifactFactChangeRecord` | Artifact fact management | 不拥有外部正文生命周期 |
| `CreateArtifactVersionCandidate` | artifact fact ref + proposed content source ref + candidate source ref + context | `ArtifactVersionCandidateCommandResult` | `ArtifactVersionCandidate`、`ArtifactVersionChangeRecord` | Artifact version management | 候选修订不能直接覆盖 current version |
| `PublishArtifactVersion` | candidate ref + publish intent + context | `ArtifactVersionCommandResult` | `ArtifactVersion`、`ArtifactVersionCandidate`、`ArtifactFact`、`ArtifactVersionChangeRecord` | Artifact version management | 只有正式 publish 才形成稳定 version truth |
| `SupersedeArtifactVersion` | current version ref + next version ref + supersede reason + context | `ArtifactVersionCommandResult` | `ArtifactVersion`、`ArtifactFact`、`ArtifactVersionChangeRecord` | Artifact version management | 替代必须显式记录,不得原地抹历史 |
| `EstablishArtifactLineageLink` | source version ref + target version ref + relation kind + basis ref + context | `ArtifactLineageCommandResult` | `ArtifactLineageLink`、`ArtifactLineageChangeRecord` | Artifact lineage management | trace / tool result 只能作为 basis 线索 |
| `RejectArtifactLineageLink` | lineage link ref + reject reason + context | `ArtifactLineageCommandResult` | `ArtifactLineageLink`、`ArtifactLineageChangeRecord` | Artifact lineage management | 拒绝必须显式保留原因 |
| `CreateArtifactBaselineCandidate` | baseline scope ref + membership refs + freeze context hint + context | `ArtifactBaselineCommandResult` | `ArtifactBaseline`、`ArtifactBaselineMembership`、`ArtifactBaselineChangeRecord` | Artifact baseline management | 基线成员必须锚定正式 version |
| `FreezeArtifactBaseline` | artifact baseline ref + review anchor ref + context | `ArtifactBaselineCommandResult` | `ArtifactBaseline`、`ArtifactBaselineMembership`、`ArtifactBaselineChangeRecord` | Artifact baseline management | 不允许运行时解析 current version 代替成员集合 |
| `SupersedeArtifactBaseline` | current baseline ref + next baseline ref + context | `ArtifactBaselineCommandResult` | `ArtifactBaseline`、`ArtifactBaselineChangeRecord` | Artifact baseline management | 历史 baseline 必须保留可回看性 |
| `OpenArtifactReviewAnchor` | truth anchor kind + truth anchor ref + review reason + context | `ArtifactReviewCommandResult` | `ArtifactReviewAnchor`、`ArtifactReviewTraceRecord` | Artifact review and responsibility context | review 必须回到正式 truth |
| `AssignArtifactResponsibility` | review anchor ref + responsible party ref + basis ref + context | `ArtifactResponsibilityCommandResult` | `ArtifactResponsibilityAssignment`、`ArtifactReviewTraceRecord` | Artifact review and responsibility context | 只表达 Artifact 侧责任,不改 identity truth |
| `RegisterAutomationArtifactInput` | automation source ref + candidate kind + derived truth anchor ref + context | `AutomationArtifactInputCommandResult` | `AutomationArtifactInput`、`AutomationIntakeAuditRecord` | Automation output control boundary | 自动化输入只作为候选变化 |
| `AcceptAutomationArtifactInput` | automation input ref + intake context ref + context | `AutomationArtifactInputCommandResult` | `AutomationArtifactInput`、`ArtifactIntakeContext`、`AutomationIntakeAuditRecord` | Automation output control boundary / Artifact intake convergence | 自动化接受后仍需走正式收束链 |
| `IssueConsumableArtifactReference` | truth anchor kind + truth anchor ref + consumer scope ref + context | `ConsumableArtifactReferenceCommandResult` | `ConsumableArtifactReference` | Artifact consumption and traceability | 可消费引用不迁移 ownership |
| `RecordArtifactConsumptionBackref` | consumer ref + consumable ref + consumption reason + context | `ArtifactConsumptionCommandResult` | `ArtifactConsumptionBackref`、`ArtifactTraceRecord` | Artifact consumption and traceability | 消费回指是真相记录,不能藏在下游私有状态里 |

---

## 6. Query API 骨架表

所有 Query 输入中的 `context` 均表示 `ActorContext` + `QueryMetadata`。Query 可以返回 stale / degraded / missing / not visible surface,但不得修复状态。

| Query | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `GetArtifactFact` | artifact fact ref + context | `ArtifactFactView` | `ArtifactFact` + `ArtifactContentFactContext` + summary view | Artifact fact management | 不刷新正文来源 |
| `GetArtifactVersion` | artifact version ref + context | `ArtifactVersionView` | `ArtifactVersion` + `ArtifactVersionSummaryView` | Artifact version management | 不把 current latest 替代正式 version |
| `ListArtifactVersionsByFact` | artifact fact ref + page + context | `ArtifactVersionPage` | version truth + version summary projection | Artifact version management | 历史版本读取只读 |
| `GetArtifactLineageSummary` | artifact version ref + context | `ArtifactLineageSummaryView` | `ArtifactLineageLink` + lineage summary projection | Artifact lineage management | 不执行图修复或关系补造 |
| `GetArtifactBaseline` | artifact baseline ref + context | `ArtifactBaselineView` | `ArtifactBaseline` + `ArtifactBaselineSummaryView` | Artifact baseline management | 不动态解析成员 |
| `GetArtifactReviewSummary` | review anchor ref + context | `ArtifactReviewSummaryView` | review / responsibility truth + review summary | Artifact review and responsibility context | 不读取相邻仓正文 |
| `GetArtifactReadSurface` | consumable ref or truth anchor ref + consumer ref + context | `ArtifactReadSurfaceView` | `ConsumableArtifactReference` + `ArtifactReadSurfaceView` + visibility policy | Artifact consumption and traceability | Query 只读,不记录 backref |
| `GetArtifactTrace` | trace subject ref + page + context | `ArtifactTraceView` | `ArtifactTraceRecord` + `ArtifactConsumptionBackref` | Artifact consumption and traceability | 不替代 observability 物理审计 |
| `SearchArtifactFacts` | scope / kind / definition / status filters + page + context | `ArtifactFactSearchResultPage` | fact summary / read model / derived view state | Derived maintenance and handoff preparation | stale 时只暴露 freshness |
| `GetArtifactPreview` | truth anchor ref + context | `ArtifactPreviewView` | preview projection + `ArtifactDerivedViewState` | Derived maintenance and handoff preparation | preview 只是只读消费层 |
| `GetArtifactReport` | report scope ref + context | `ArtifactReportView` | report projection + source cursor | Derived maintenance and handoff preparation | report 不决定业务状态 |
| `GetArtifactReconciliationReport` | reconciliation scope or report ref + context | `ArtifactReconciliationReportView` | reconciliation report + derived state | Derived maintenance and handoff preparation | 只读报告,不自动修 truth |
| `GetExternalReferenceResolution` | external ref or resolution state ref + context | `ExternalReferenceResolutionView` | `ExternalReferenceResolutionState` + `ExternalMirrorRefreshRecord` | External reference and local mirror support | 只读解析 / 降级状态,不触发 refresh |

---

## 7. Inbound Event Consumer 骨架表

所有 Consumer 输入都必须携带来源 envelope、source event id、source ref、schema version、dedup key 和 trace context。Consumer 典型写入结果是 reference、resolution state、pending input 或 stale marker。

| Consumer | 来源 | 输入骨架 | 写入结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `ConsumeWorkArtifactContextChanged` | `L1-work` | work context envelope + work context ref + source version | `ArtifactWorkContextRef`、`ExternalReferenceResolutionState`、related stale marker | Artifact intake convergence / External reference and local mirror support | 不写 Work truth |
| `ConsumeProcessArtifactContextChanged` | `L1-process` | process context envelope + process context ref + source version | `ArtifactProcessContextRef`、`ExternalReferenceResolutionState`、related stale marker | Artifact intake convergence / External reference and local mirror support | 不写 process execution truth |
| `ConsumeGovernanceArtifactContextChanged` | `L1-governance` | governance context envelope + governance context ref + source version | `ArtifactGovernanceContextRef`、`ExternalReferenceResolutionState`、review / baseline stale marker | Artifact review and responsibility context / External reference and local mirror support | 不写 governance decision truth |
| `ConsumeMethodArtifactDefinitionChanged` | `L3-method-library` | definition changed envelope + artifact definition ref + source version | `ArtifactDefinitionRef`、`ExternalReferenceResolutionState`、fact / intake stale marker | Artifact fact management / External reference and local mirror support | 不保存定义正文 |
| `ConsumeRuntimeArtifactSignalRecorded` | `L2-runtime` / `L3-capability-hub` | automation signal envelope + automation source ref + derived truth anchor hint | `AutomationSourceRef`、`ExternalReferenceResolutionState`、pending automation input marker | Automation output control boundary / External reference and local mirror support | 运行材料只提供候选线索 |
| `ConsumeExternalContentSourceChanged` | external content source | content availability envelope + content source ref + source version | `ArtifactContentSourceRef`、`ExternalReferenceResolutionState`、intake / derived stale marker | Artifact intake convergence / External reference and local mirror support | 不复制外部正文 |

---

## 8. Outbound Event 骨架表

Outbound Event 只传播已成立 truth 或维护状态变化。事件 payload 后续由详细设计闭口,本步只给输出骨架和边界。

| Event | 触发来源 | 输出骨架 | 主要消费方 | 边界 |
|---|---|---|---|---|
| `ArtifactFactChanged` | `ArtifactFact` / `ArtifactContentFactContext` change | artifact fact ref + content context ref + change kind + trace context | work、process、governance、conversation、workspace | 不携带正文 |
| `ArtifactVersionChanged` | `ArtifactVersion` change | artifact version ref + artifact fact ref + version state + trace context | work、process、governance、archive、sync | 不携带可变内容副本 |
| `ArtifactLineageChanged` | `ArtifactLineageLink` change | lineage link ref + source / target version refs + relation kind + trace context | work、process、governance、observability | trace / graph 只消费,不反写 |
| `ArtifactBaselineChanged` | `ArtifactBaseline` / membership change | artifact baseline ref + scope ref + baseline state + trace context | work、governance、archive、sync | 不携带临时成员清单正文 |
| `ArtifactReviewChanged` | review / responsibility change | review anchor ref + responsibility ref + review state + trace context | conversation、workspace、governance | 不改变 identity truth |
| `ConsumableArtifactReferenceChanged` | consumable ref / backref change | consumable ref + truth anchor ref + reference state + trace context | SDK、console、sync、conversation、workspace | 消费面只引用正式 truth |
| `ArtifactTraceAvailable` | trace / handoff state change | trace ref + truth anchor ref + handoff ref + trace context | observability、archive、conversation | 不替代物理日志 |
| `ArtifactDerivedViewStateChanged` | derived freshness change | derived view state ref + derived view kind + freshness state + source cursor | workspace、console、report consumers | 派生变化不代表新 truth |

---

## 9. Operations Job 骨架表

Operations Job 必须携带 `JobMetadata`、system / operator actor、run id 和 job idempotency key。Job 只能维护派生、引用刷新、对账和交接准备。

| Job | 输入骨架 | 输出骨架 | 允许写入 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `RebuildArtifactDerivedViews` | derived view kind set + scope / truth cursor + run metadata | rebuild report | `ArtifactPreviewView`、`ArtifactReportView`、`ArtifactReconciliationReport`、`ArtifactDerivedViewState` | Derived maintenance and handoff preparation | 只从 committed truth 重建 |
| `RefreshExternalReferenceStates` | reference scope + source filters + run metadata | refresh report | `ExternalReferenceResolutionState`、`ExternalMirrorRefreshRecord` | External reference and local mirror support | 不复制外部正文 |
| `RunArtifactReconciliation` | reconciliation scope + cursor / report target + run metadata | reconciliation report | `ArtifactReconciliationReport`、`ArtifactDerivedViewState` | Derived maintenance and handoff preparation | 只报告缺口,不修复核心 truth |
| `PrepareArtifactArchiveHandoff` | truth / baseline / report scope + archive target + run metadata | archive handoff report | `ArtifactHandoffRecord`、`ArtifactTraceRecord` | Derived maintenance and handoff preparation | 不生成 archive truth |
| `PrepareArtifactObservabilityHandoff` | trace / lineage / integrity explanation scope + observability target + run metadata | observability handoff report | `ArtifactHandoffRecord`、`ArtifactTraceRecord` | Derived maintenance and handoff preparation | 不生成 observability ledger truth |
| `PrepareArtifactSyncHandoff` | sync scope + downstream target + run metadata | sync handoff report | `ArtifactHandoffRecord`、`ArtifactTraceRecord` | Derived maintenance and handoff preparation | sync 副本不得反向定义 truth |

---

## 10. 接口到主要组成部分映射

| 主要组成部分 | Command | Query | Consumer | Outbound Event | Job |
|---|---|---|---|---|---|
| `Artifact fact management` | `EstablishArtifactFact` | `GetArtifactFact` | `ConsumeMethodArtifactDefinitionChanged`、`ConsumeExternalContentSourceChanged` | `ArtifactFactChanged` | `RefreshExternalReferenceStates` |
| `Artifact version management` | `CreateArtifactVersionCandidate`、`PublishArtifactVersion`、`SupersedeArtifactVersion` | `GetArtifactVersion`、`ListArtifactVersionsByFact` | - | `ArtifactVersionChanged` | - |
| `Artifact lineage management` | `EstablishArtifactLineageLink`、`RejectArtifactLineageLink` | `GetArtifactLineageSummary` | `ConsumeRuntimeArtifactSignalRecorded` | `ArtifactLineageChanged` | - |
| `Artifact baseline management` | `CreateArtifactBaselineCandidate`、`FreezeArtifactBaseline`、`SupersedeArtifactBaseline` | `GetArtifactBaseline` | `ConsumeGovernanceArtifactContextChanged` | `ArtifactBaselineChanged` | `PrepareArtifactArchiveHandoff` |
| `Artifact intake convergence` | `RegisterArtifactIntake` | - | `ConsumeWorkArtifactContextChanged`、`ConsumeProcessArtifactContextChanged`、`ConsumeExternalContentSourceChanged` | - | `RefreshExternalReferenceStates` |
| `Artifact review and responsibility context` | `OpenArtifactReviewAnchor`、`AssignArtifactResponsibility` | `GetArtifactReviewSummary` | `ConsumeGovernanceArtifactContextChanged` | `ArtifactReviewChanged` | - |
| `Automation output control boundary` | `RegisterAutomationArtifactInput`、`AcceptAutomationArtifactInput` | - | `ConsumeRuntimeArtifactSignalRecorded` | - | `RefreshExternalReferenceStates` |
| `Artifact consumption and traceability` | `IssueConsumableArtifactReference`、`RecordArtifactConsumptionBackref` | `GetArtifactReadSurface`、`GetArtifactTrace` | - | `ConsumableArtifactReferenceChanged`、`ArtifactTraceAvailable` | `PrepareArtifactObservabilityHandoff`、`PrepareArtifactSyncHandoff` |
| `Derived maintenance and handoff preparation` | - | `SearchArtifactFacts`、`GetArtifactPreview`、`GetArtifactReport`、`GetArtifactReconciliationReport` | - | `ArtifactDerivedViewStateChanged` | `RebuildArtifactDerivedViews`、`RunArtifactReconciliation`、`PrepareArtifactArchiveHandoff`、`PrepareArtifactObservabilityHandoff`、`PrepareArtifactSyncHandoff` |
| `External reference and local mirror support` | - | `GetExternalReferenceResolution` | 所有 external context / definition / content consumers | - | `RefreshExternalReferenceStates` |

---

## 11. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 历史 `02-概要设计.md` | 容易把上传 / 查询 / 归档 / 预览 / 血缘查看直接写成混合入口 | 改为 Command / Query / Consumer / Event / Job 五类骨架 |
| 旧技术线索 | 容易把 bus、sync、archive、observability 交接写成主链 truth 写入口 | 统一压到 Outbound Event 或 Operations Job |
| 派生消费增强 | 容易让 search / preview / report / reconciliation 反向塑造核心模型 | 在 Query / Job 中明确只读、最终一致和不得反写真相 |
| 自动化来源 | 容易把 runtime / capability 结果直接当正式 Artifact truth | 只允许经 Consumer / Command 进入 automation boundary 和 intake convergence |

---

## 12. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否在概要层点名 Command / Query / Event / Job | 点名 | Step 8 / Step 9 需要可反查的正式入口主语 |
| 是否把消费回指留在 Query 隐式写入 | 不留 | Query 必须保持只读,`ArtifactConsumptionBackref` 必须有显式 Command |
| 是否让 Consumer 直接形成 fact / version / lineage / baseline | 不允许 | 外部变化只能形成引用、pending 或 stale 语义 |
| 是否让 Job 承担 truth repair | 不允许 | Job 只能维护派生、refresh、reconcile 和 handoff |
| 是否把 search / preview / report 作为核心闭环前置 | 不作为前置 | 它们是消费增强,不是核心真相成立条件 |

---

## 13. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §7 “API / 接口骨架”引用本文件 §4 的接口分类说明。
- §7 摘录 §5~§9 五张接口骨架表。
- §7 保留 §10 的接口到主要组成部分映射,作为 Step 8 / Step 9 的入口索引。
- 详细设计必须基于这些骨架继续定义 DTO、错误码、幂等结果、协议 envelope、port trait 和事务边界。

---

## 14. 进入下一步条件

- 已明确本仓接口按 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 分类。
- 已显式说明 Command 需要 `ActorContext`、`CommandMetadata` 和 idempotency key。
- 已显式说明 Query 需要 `ActorContext` 和 `QueryMetadata`。
- 已显式说明 Consumer 需要 envelope、source event id、source ref、dedup key 和 trace context。
- 已明确 Job 不得作为业务 command 或 truth repair 入口。
- 未写入 HTTP path、topic、完整 DTO schema、repository 函数或事务细节。
- 可以进入 Step 8 “关键处理流 / 重要函数数据流”。
