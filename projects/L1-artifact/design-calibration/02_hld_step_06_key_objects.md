# Step 6. 关键对象轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 6
> 回填章节: `02-概要设计.md` §6 关键对象轮廓
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

从 Step 5 的对象候选池中筛出 `L1-artifact` 在概要设计层必须点名的关键对象,并给出对象类型、所属组成部分、关键字段骨架、状态候选、成员函数骨架、工厂函数骨架和禁止事项。

本步不写完整 Rust struct、完整 enum、完整接口 schema、repository trait、数据库表、索引、事件 payload 或事务细节。对象骨架只服务后续 Step 7~9 和 `03-详细设计.md` 的继续展开。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成 | 提供 truth ownership、外部正文排除、派生只读、路径分离和层次深度门禁 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体骨架和实现分层 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 10 个主要组成部分和对象候选池 |
| `projects/L1-artifact/00-需求文档.md` §10~14 | 当前正式需求基线 | 提供业务规则、数据归属、接口边界、NFR 和验收否决项 |
| `projects/L1-artifact/01-架构设计.md` §6 / §8 / §9 / §10 / §13 / §15 | 当前正式架构基线 | 提供子域划分、依赖方向、一致性策略、关键交互、横切约束和风险 |
| 历史 `02-概要设计.md` / `03-详细设计.md` | historical_material | 仅用于旧对象名审计和命名漂移检查,不得反推当前正式结论 |

---

## 3. 对象候选池筛选说明

### 3.1 正式进入 Step 6 的关键对象

| 对象类别 | 正式关键对象 | 展开位置 |
|---|---|---|
| Truth / State 核心对象 | `ArtifactFact`、`ArtifactContentFactContext`、`ArtifactVersion`、`ArtifactVersionCandidate`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactBaselineMembership` | `02_hld_step_06_key_objects_truth_core.md` |
| Truth / State 支撑对象 | `ArtifactIntakeContext`、`ArtifactSubmissionRecord`、`ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment`、`AutomationArtifactInput`、`ConsumableArtifactReference`、`ArtifactConsumptionBackref` | `02_hld_step_06_key_objects_boundary_context.md` |
| Truth / State 派生 / 镜像状态对象 | `ArtifactDerivedViewState`、`ExternalReferenceResolutionState` | `02_hld_step_06_key_objects_support_states.md` |
| Policy / Guard | `ArtifactFactPolicy`、`ArtifactVersionPolicy`、`ArtifactLineagePolicy`、`ArtifactBaselinePolicy`、`ArtifactIntakePolicy`、`ArtifactReviewPolicy`、`AutomationBoundaryPolicy`、`ArtifactReadVisibilityPolicy`、`ArtifactTraceabilityPolicy`、`ExternalReferenceValidityPolicy` | `02_hld_step_06_key_objects_policies.md` |
| Projection / Read model | `ArtifactFactSummaryView`、`ArtifactVersionSummaryView`、`ArtifactLineageSummaryView`、`ArtifactBaselineSummaryView`、`ArtifactReviewSummaryView`、`ArtifactReadSurfaceView`、`ArtifactPreviewView`、`ArtifactReportView`、`ArtifactReconciliationReport` | `02_hld_step_06_key_objects_projections.md` |
| Reference / Audit / History | `ArtifactContentSourceRef`、`ArtifactDefinitionRef`、`ArtifactWorkContextRef`、`ArtifactProcessContextRef`、`ArtifactGovernanceContextRef`、`AutomationSourceRef`、`AdjacentConsumerRef`、`ArtifactFactChangeRecord`、`ArtifactVersionChangeRecord`、`ArtifactLineageChangeRecord`、`ArtifactBaselineChangeRecord`、`ArtifactInputResolutionRecord`、`ArtifactReviewTraceRecord`、`AutomationIntakeAuditRecord`、`ArtifactTraceRecord`、`ArtifactHandoffRecord`、`ExternalMirrorRefreshRecord` | `02_hld_step_06_key_objects_references_audit.md` |

### 3.2 只作为字段类型或组合线索,不独立成节的名称

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `ArtifactKindRef`、`ArtifactIdentityKey`、`ArtifactClassification` | reference / support type | 只作字段类型 | 当前 Step 5 没把它们收稳为独立对象主语,但允许作为关键字段类型出现 |
| current / candidate / history reference 线索 | version support clue | 只作字段类型 | 由 `ArtifactVersion` / `ArtifactVersionCandidate` 的字段和状态表达 |
| lineage evidence / related artifact refs | lineage support clue | 只作字段类型 | 由 `ArtifactLineageLink` 字段承接,不单独升格为对象 |
| baseline consumer refs | baseline support clue | 只作字段类型 | 由 `ArtifactBaseline`、`ConsumableArtifactReference` 和 `ArtifactConsumptionBackref` 承接 |
| handoff target refs | derived / handoff support clue | 只作字段类型 | 由 `ArtifactHandoffRecord` 和 `AdjacentConsumerRef` 承接 |
| refresh / rebuild policy clue | derived support clue | 不独立成节 | 当前不新增未在 Step 5 点名的 `DerivedPolicy` 主语,由 `ArtifactDerivedViewState` 的状态与行为承接 |

### 3.3 不作为关键对象展开的名称

| 名称类别 | 示例 | 处理口径 |
|---|---|---|
| API / request / result | `CreateArtifact`、`PublishArtifactVersion`、`FreezeBaseline`、query result | 留给 Step 7 和详细设计 |
| Repository / port / adapter | `TruthPersistencePorts`、`Reference / Snapshot / Body Source Ports`、relay ports | 留给 Step 7 接口骨架和详细设计 |
| Inbound / job / trigger | sync entry、async intake、operations jobs、rebuild trigger | 留给 Step 7 / Step 8 |
| 数据库 / 投影实现 | table、index、materialized view、search backend、state store product | 不进入概要对象轮廓 |
| 历史旧对象名 | `Artifact`、`BaselineMember`、`ContentRef`、`CurrentVersionPointer`、`AdoptedRelation`、`ApprovedRelation` | 仅作历史线索审计;当前分别吸收到 `ArtifactFact`、`ArtifactBaselineMembership`、`ArtifactContentFactContext` 或后续详细设计关系模型中 |
| 外部正文对象 | work/process/governance 正文、runtime log、archive package body、observability physical log | 只允许引用、摘要或 mirror 状态,不得成为 Artifact truth 对象 |

---

## 4. 关键对象与主要组成部分分布

| 主要组成部分 | 关键对象 |
|---|---|
| `Artifact fact management` | `ArtifactFact`、`ArtifactContentFactContext`、`ArtifactFactPolicy`、`ArtifactFactSummaryView`、`ArtifactContentSourceRef`、`ArtifactFactChangeRecord` |
| `Artifact version management` | `ArtifactVersion`、`ArtifactVersionCandidate`、`ArtifactVersionPolicy`、`ArtifactVersionSummaryView`、`ArtifactVersionChangeRecord` |
| `Artifact lineage management` | `ArtifactLineageLink`、`ArtifactLineagePolicy`、`ArtifactLineageSummaryView`、`ArtifactLineageChangeRecord` |
| `Artifact baseline management` | `ArtifactBaseline`、`ArtifactBaselineMembership`、`ArtifactBaselinePolicy`、`ArtifactBaselineSummaryView`、`ArtifactBaselineChangeRecord` |
| `Artifact intake convergence` | `ArtifactIntakeContext`、`ArtifactSubmissionRecord`、`ArtifactIntakePolicy`、`ArtifactInputResolutionRecord` |
| `Artifact review and responsibility context` | `ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment`、`ArtifactReviewPolicy`、`ArtifactReviewSummaryView`、`ArtifactReviewTraceRecord` |
| `Automation output control boundary` | `AutomationArtifactInput`、`AutomationBoundaryPolicy`、`AutomationSourceRef`、`AutomationIntakeAuditRecord` |
| `Artifact consumption and traceability` | `ConsumableArtifactReference`、`ArtifactConsumptionBackref`、`ArtifactReadVisibilityPolicy`、`ArtifactTraceabilityPolicy`、`ArtifactReadSurfaceView`、`AdjacentConsumerRef`、`ArtifactTraceRecord` |
| `Derived maintenance and handoff preparation` | `ArtifactDerivedViewState`、`ArtifactPreviewView`、`ArtifactReportView`、`ArtifactReconciliationReport`、`ArtifactHandoffRecord` |
| `External reference and local mirror support` | `ExternalReferenceResolutionState`、`ExternalReferenceValidityPolicy`、`ArtifactDefinitionRef`、`ArtifactWorkContextRef`、`ArtifactProcessContextRef`、`ArtifactGovernanceContextRef`、`ExternalMirrorRefreshRecord` |

---

## 5. 对象附录文件

本步对象数量较多。为同时满足“每个关键对象独立成节”和“中间产物可维护”,本步拆成主控文件和 6 个对象附录:

| 文件 | 内容 |
|---|---|
| `02_hld_step_06_key_objects.md` | 筛选说明、对象分布、停审记录、反查清单和一致性审计 |
| `02_hld_step_06_key_objects_truth_core.md` | fact / version / lineage / baseline 主线对象骨架 |
| `02_hld_step_06_key_objects_boundary_context.md` | intake / review / automation / consumption 支撑对象骨架 |
| `02_hld_step_06_key_objects_support_states.md` | derived state / external resolution state 骨架 |
| `02_hld_step_06_key_objects_policies.md` | policy / guard 对象骨架 |
| `02_hld_step_06_key_objects_projections.md` | summary / read surface / preview / report / reconciliation 对象骨架 |
| `02_hld_step_06_key_objects_references_audit.md` | reference、audit、history、handoff 和 refresh record 对象骨架 |

正式 `02-概要设计.md` 后续只摘取主表和必要对象摘要,不把附录机械粘贴为正式正文。

---

## 6. Step 8 / Step 9 反查清单

### 6.1 关键处理流反查

| 预计处理流 | 必须能反查到的对象 |
|---|---|
| 正式 Artifact fact 纳管 | `ArtifactIntakeContext`、`ArtifactSubmissionRecord`、`ArtifactFact`、`ArtifactContentFactContext`、`ArtifactFactPolicy` |
| Artifact version 发布 / 替代 / 历史保留 | `ArtifactVersion`、`ArtifactVersionCandidate`、`ArtifactVersionPolicy`、`ArtifactVersionChangeRecord` |
| Artifact lineage 建立 / 拒绝 / 解释 | `ArtifactLineageLink`、`ArtifactLineagePolicy`、`ArtifactLineageChangeRecord`、`AutomationSourceRef` |
| Artifact baseline 形成 / 冻结 / 历史回看 | `ArtifactBaseline`、`ArtifactBaselineMembership`、`ArtifactBaselinePolicy`、`ArtifactBaselineChangeRecord` |
| review / responsibility 语境形成 | `ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment`、`ArtifactReviewPolicy`、`ArtifactReviewTraceRecord` |
| 自动化候选输入收束 | `AutomationArtifactInput`、`AutomationBoundaryPolicy`、`AutomationIntakeAuditRecord`、`ExternalReferenceResolutionState` |
| consumable read / traceability / backref | `ConsumableArtifactReference`、`ArtifactConsumptionBackref`、`ArtifactReadVisibilityPolicy`、`ArtifactTraceabilityPolicy`、`ArtifactTraceRecord` |
| preview / report / reconciliation rebuild | `ArtifactDerivedViewState`、`ArtifactPreviewView`、`ArtifactReportView`、`ArtifactReconciliationReport` |
| external mirror refresh / degraded read | `ExternalReferenceResolutionState`、`ExternalReferenceValidityPolicy`、`ExternalMirrorRefreshRecord` |
| handoff preparation / delivery / retry | `ArtifactHandoffRecord`、`AdjacentConsumerRef`、`ArtifactTraceRecord` |

### 6.2 状态机反查

| 状态主题 | Step 6 对象来源 |
|---|---|
| fact / content fact context lifecycle | `ArtifactFact`、`ArtifactContentFactContext` |
| version candidate / published / superseded / frozen lifecycle | `ArtifactVersion`、`ArtifactVersionCandidate` |
| lineage establishment lifecycle | `ArtifactLineageLink` |
| baseline candidate / frozen / superseded lifecycle | `ArtifactBaseline`、`ArtifactBaselineMembership` |
| intake resolution lifecycle | `ArtifactIntakeContext`、`ArtifactSubmissionRecord` |
| review / responsibility lifecycle | `ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment` |
| automation boundary lifecycle | `AutomationArtifactInput` |
| consumable read / backref lifecycle | `ConsumableArtifactReference`、`ArtifactConsumptionBackref` |
| derived freshness / rebuild lifecycle | `ArtifactDerivedViewState` |
| external resolution / refresh lifecycle | `ExternalReferenceResolutionState`、`ExternalMirrorRefreshRecord` |
| handoff / delivery lifecycle | `ArtifactHandoffRecord` |

---

## 7. 每个主要组成部分的对象正式化停审记录

| 主要组成部分 | 结论 | 说明 |
|---|---|---|
| `Artifact fact management` | pass | 已有 truth、policy、summary、reference、history 五类对象承接 |
| `Artifact version management` | pass | 已有 version、candidate、policy、summary、history 承接 |
| `Artifact lineage management` | pass | 已有 lineage truth、policy、summary、history 承接 |
| `Artifact baseline management` | pass | 已有 baseline、membership、policy、summary、history 承接 |
| `Artifact intake convergence` | pass | 已有 intake context、submission、policy、resolution history 承接 |
| `Artifact review and responsibility context` | pass | 已有 review anchor、responsibility、policy、summary、trace 承接 |
| `Automation output control boundary` | pass | 已有 automation input、policy、source ref、audit 承接 |
| `Artifact consumption and traceability` | pass | 已有 consumable ref、backref、visibility / trace policies、read surface、trace record 承接 |
| `Derived maintenance and handoff preparation` | pass | 已有 derived state、preview、report、reconciliation、handoff 承接 |
| `External reference and local mirror support` | pass | 已有 resolution state、validity policy、context refs、refresh history 承接 |

---

## 8. 跨对象 / 跨组成部分一致性审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 核心 truth 是否被重复建模 | pass | fact / version / lineage / baseline 各有唯一主对象 |
| 支撑对象是否越界拥有相邻仓 truth | pass | review、automation、mirror、handoff 均只保存 ref / state / summary |
| 派生对象是否误写成 truth source | pass | preview / report / reconciliation 全部保持只读 |
| Step 8 / Step 9 会用到的对象是否已定义 | pass | 反查清单覆盖当前主线和支撑流程 |
| 历史对象名是否造成当前命名漂移 | pass | 已把 `Artifact` / `BaselineMember` / `ContentRef` 等历史名降为审计线索 |
| 是否下沉到数据库或完整接口模型 | pass | 当前只停在对象骨架层 |

---

## 9. 本步设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否沿用历史 `Artifact` 作为当前核心 truth 对象名 | 不沿用 | Step 5 已收稳 `ArtifactFact`,当前必须承接新主语 |
| 是否把 adopted / approved relation 提前升格为正式对象 | 不升格 | 当前 Step 5 候选池未将其收稳为正式对象主语,留给后续详细设计接缝模型 |
| 是否把所有 ref / snapshot 都独立成节 | 只展开带边界语义的 ref / state | 普通 ID / ref 留作字段类型,避免 Step 6 膨胀成类型词典 |
| 是否新增未在 Step 5 点名的 derived policy 主语 | 不新增 | derived freshness / rebuild 语义先由 `ArtifactDerivedViewState` 承接 |

---

## 10. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 历史 02 / 03 的对象命名 | 容易让 `Artifact`、`BaselineMember`、`ContentRef` 直接回流为当前正式主语 | 仅作历史审计,不反推当前 Step 5 已收稳对象名 |
| 事实主线与只读派生混写 | 容易让 preview / report / handoff 变成 truth source | 单独 formalize `ArtifactDerivedViewState`、read models 和 handoff record |
| 相邻仓语境直接入模 | 容易把 work / process / governance / runtime truth 吸进 Artifact 对象 | 统一通过 context ref、source ref、resolution state 承接 |

---

## 11. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §6 “关键对象轮廓”引用本文件 §3.1 的对象筛选表和 §4 的对象分布表。
- §6 对核心 truth 对象至少摘录 `ArtifactFact`、`ArtifactContentFactContext`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`。
- §6 对支撑对象摘录 `ArtifactIntakeContext`、`ArtifactReviewAnchor`、`AutomationArtifactInput`、`ConsumableArtifactReference`、`ArtifactDerivedViewState`、`ExternalReferenceResolutionState`。
- Step 7~9 必须引用本文件 §6 的反查清单,不得引入 Step 6 未定义的新正式对象。

---

## 12. 进入下一步条件

- 已按主要组成部分完成对象正式化筛选,每个组成部分对象正式化已停审。
- 已明确详细设计必须承接哪些关键对象、每个对象的责任和骨架边界。
- 未来可能成为正式代码主体的对象没有被压缩成对象组。
- 跨对象 / 跨组成部分审计没有 unresolved 冲突。
- Step 8 / Step 9 将使用的对象均能在本步找到定义。
- 可以进入 Step 7 “API / 接口骨架”。
