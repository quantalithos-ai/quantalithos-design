# L2-tools 02 概要 Step 6 对象附录: 引用完整性与受控派生

> 创建日期: 2026-08-05
> 状态: completed
> 主控文件: `design-calibration/02_hld_step_06_key_objects.md`
> 组成部分来源: Step 5 §9 引用完整性与受控派生
> Blocker 继承: `L2T-UP-008~009` 及其他外部 seam 缺口持续开放；派生对象不得把 gap 润色为 ready。

---

## 1. 对象正式化范围

本附录正式化 8 个对象：`ReferenceValidityAssessment`、`ConsistencyGap`、`ReferenceConsistencyReport`、`ToolContractSearchProjection`、`ToolContractDiffSummary`、`ToolDiagnosticSummary`、`ToolConsumerGuidanceView`、`SharedContractAuthorityRef`。Job、索引、缓存、查询 DSL、SDK client、event payload 与 reconciliation 自动修复均不属于对象字段。

## 2. `ReferenceValidityAssessment`

### 2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 引用完整性与受控派生 |
| 对象类型 | reference assessment fact |
| 主要责任 | 在特定消费时点评估 typed ref 的 authority、owner attribution、revision 和关联完整性。 |

### 2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `assessment_id` | `ReferenceValidityAssessmentId` | 引用评估事实标识。 |
| `subject_ref` | `TypedExternalReference` | 被评估 typed ref，不包含外部正文。 |
| `expected_authority_ref` | `ExpectedAuthorityRef` | 当前设计所期望的正式 owner / authority。 |
| `expected_revision_ref` | `ExpectedRevisionRef` | 适用时锚定期望 revision / contract 语境。 |
| `validity_state` | `ReferenceValidityState` | valid / stale / conflicting / missing / unverifiable。 |
| `gap_refs` | `ConsistencyGapRefSet` | 关联已发现 owner / source / revision / correlation gap。 |
| `assessed_at` | `AssessmentTime` | 固定本次评估消费时点。 |

### 2.3 状态集合

| 状态 | 作用 |
|---|---|
| `valid` | Authority、owner、revision 与关联在该时点可验证。 |
| `stale` | Ref 可能不再指向当前外部 revision，但历史消费解释不变。 |
| `conflicting` | 多个 authority、revision 或 correlation 线索冲突。 |
| `missing` | 预期 typed ref 不存在。 |
| `unverifiable` | 缺少正式 authority / source contract，无法正向验证。 |

### 2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_valid_for_consumption()` | 仅在 valid 时允许受影响路径继续。 |
| `requires_fail_closed()` | 判断当前状态是否要求核心路径保守失败。 |
| `matches_authority(ExpectedAuthorityRef authority_ref)` | 验证评估使用的 owner 预期。 |
| `explains_gap(ConsistencyGapRef gap_ref)` | 判断指定 gap 是否属于本次评估。 |

### 2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `assess(TypedExternalReference subject_ref, ExpectedAuthorityRef authority_ref, ExpectedRevisionRef revision_ref, AssessmentTime assessed_at)` | 形成某一消费时点的引用评估。 |
| `unverifiable(TypedExternalReference subject_ref, AuthorityGapReason reason)` | Authority / source 未闭口时形成显式不可验证事实。 |

### 2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 自动修改被评估 ref 或外部 truth | Assessment 只有判断权。 |
| 缺 authority 时使用字符串 / 路径猜测为 valid | 正向状态必须由正式来源支撑。 |
| 原地覆盖历史 assessment | 新消费时点形成新 assessment。 |

## 3. `ConsistencyGap`

### 3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 引用完整性与受控派生 |
| 对象类型 | local gap fact |
| 主要责任 | 显式记录本地对象关系、外部 authority / source、mapping、route 或追溯链的可解释缺口。 |

### 3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `gap_id` | `ConsistencyGapId` | 本地 gap 标识。 |
| `gap_scope` | `ConsistencyGapScope` | Contract、Binding、invocation、authorization、Sandbox、outcome、audit、handoff 或 projection。 |
| `subject_refs` | `GapSubjectRefSet` | 关联受影响本地对象 / 外部 refs。 |
| `gap_class` | `ConsistencyGapClass` | Missing、stale、conflict、unverifiable、mapping-blocked、route-blocked 等类别。 |
| `impact_class` | `GapImpactClass` | 表达阻塞核心、阻塞集成、降级外围或仅影响派生。 |
| `gap_state` | `ConsistencyGapState` | open / resolution-pending / resolved / superseded。 |
| `detected_at` | `DetectionTime` | 缺口被正式识别的时点。 |
| `resolution_evidence_ref` | `GapResolutionEvidenceRef` | 仅在正式来源闭口后回链解决依据，不是伪 evidence alias。 |

### 3.3 状态集合

| 状态 | 作用 |
|---|---|
| `open` | 缺口当前成立，按 impact 执行 blocked / fail-closed / degraded。 |
| `resolution_pending` | 已有正式闭口线索，但尚未经对应 owner 重入验证。 |
| `resolved` | 已由正式来源与 owner 边界验证闭口。 |
| `superseded` | 缺口被新的、更准确 gap 事实替代，历史仍保留。 |

### 3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `blocks_core_path()` | 判断 gap 是否阻止受影响核心路径。 |
| `degrades_peripheral_path()` | 判断 gap 是否只影响派生 / 外部协作。 |
| `mark_resolution_pending(GapResolutionEvidenceRef evidence_ref)` | 记录正式闭口线索，尚不宣称 resolved。 |
| `resolve(GapResolutionEvidenceRef evidence_ref, ResolutionDecisionRef decision_ref)` | 经正式验证后关闭 gap。 |

### 3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `detect(ConsistencyGapScope scope, GapSubjectRefSet subjects, ConsistencyGapClass gap_class, GapImpactClass impact)` | 从正式检测形成 gap fact。 |

### 3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 以“已知问题”文本代替 typed subject / impact | Gap 必须可关联、可判断。 |
| 检测后直接修复核心对象或外部 truth | 正式变化必须重入对应 owner。 |
| 伪造 commit、run_id、真实 evidence alias 或验收签署作为 resolution evidence | 只允许未来正式、可引用的解决依据。 |

## 4. `ReferenceConsistencyReport`

### 4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 引用完整性与受控派生 |
| 对象类型 | derived report |
| 主要责任 | 汇总指定检测语境中的 reference assessments、gaps、覆盖范围和水位，供只读维护与正式重入使用。 |

### 4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `report_id` | `ReferenceConsistencyReportId` | 派生报告标识。 |
| `inspection_scope` | `ReferenceInspectionScope` | 本次报告覆盖的对象 / ref 范围。 |
| `assessment_refs` | `ReferenceAssessmentRefSet` | 关联评估事实。 |
| `gap_refs` | `ConsistencyGapRefSet` | 关联 open / resolved gap。 |
| `source_watermark` | `LocalTruthWatermark` | 记录生成时消费的本地 truth 水位。 |
| `report_state` | `DerivedReportState` | current / partial / stale / failed。 |
| `generated_at` | `ProjectionTime` | 报告生成时点。 |

### 4.3 状态集合

| 状态 | 作用 |
|---|---|
| `current` | 报告覆盖其声明水位和检查范围。 |
| `partial` | 部分 authority / source 不可访问，范围不完整但缺口显式。 |
| `stale` | 核心 truth / refs 已推进到报告水位之后。 |
| `failed` | 本次报告生成未形成可用输出。 |

### 4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `contains_open_gap(ConsistencyGapRef gap_ref)` | 判断 open gap 是否被报告覆盖。 |
| `covers_subject(GapSubjectRef subject_ref)` | 判断指定对象 / ref 是否在检查范围。 |
| `is_current_for(LocalTruthWatermark watermark)` | 判断报告水位是否覆盖目标读取。 |
| `requires_formal_reentry()` | 判断是否存在必须经核心 Command / external owner 处理的 gap。 |

### 4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `generate(ReferenceInspectionScope scope, ReferenceAssessmentRefSet assessments, ConsistencyGapRefSet gaps, LocalTruthWatermark watermark)` | 从已存在 assessments / gaps 生成只读报告。 |

### 4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将 report 作为核心 truth 或 evolution history | 它是可重建检测输出。 |
| 由 report 自动修正 Binding、outcome、audit 或 external ref | 报告只提供重入依据。 |
| 隐藏 partial / stale / failed | 派生状态必须显式可见。 |

## 5. `ToolContractSearchProjection`

### 5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 引用完整性与受控派生 |
| 对象类型 | derived search projection |
| 主要责任 | 从合同、definition、Binding 与安全摘要构建可重建、body-free 的搜索 / 浏览材料。 |

### 5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `projection_id` | `ToolContractSearchProjectionId` | 派生投影标识。 |
| `tool_id` | `ToolId` | 被索引稳定工具。 |
| `definition_revision` | `DefinitionRevision` | 投影基于的正式 definition revision。 |
| `search_safe_summary` | `ToolSearchSafeSummary` | 可搜索的正文安全摘要。 |
| `binding_summary` | `BindingModeSafeSummary` | 只表达 relation 分类 / gap，不复制 Hub truth。 |
| `source_watermark` | `LocalTruthWatermark` | 投影对应的本地 truth 水位。 |
| `freshness_state` | `DerivedFreshnessState` | fresh / stale / rebuilding / unavailable。 |

### 5.3 状态集合

| 状态 | 作用 |
|---|---|
| `fresh` | 投影覆盖声明的 source watermark。 |
| `stale` | 核心 truth 已推进，读取必须标示陈旧。 |
| `rebuilding` | 投影正在重建，核心合同 / invocation 不受阻。 |
| `unavailable` | 当前无法提供搜索投影，稳定合同读取仍可工作。 |

### 5.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches_tool(ToolId tool_id)` | 判断投影所属稳定工具。 |
| `is_fresh_for(LocalTruthWatermark watermark)` | 判断投影是否覆盖目标水位。 |
| `mark_stale(LocalTruthWatermark latest_watermark)` | 标记核心 truth 已前进，不反写核心。 |
| `is_body_free()` | 验证搜索材料无禁止正文。 |

### 5.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `project(ToolContractView contract_view, CapabilityBindingView binding_view, LocalTruthWatermark watermark)` | 从稳定安全读取形成搜索投影。 |

### 5.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 作为 Tool registry / inventory 或调用授权来源 | Search projection 是可重建读取材料。 |
| 反写 contract / definition / Binding | 派生无核心写权。 |
| 保存 provider / Hub / external registry body | 投影只使用安全摘要。 |

## 6. `ToolContractDiffSummary`

### 6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 引用完整性与受控派生 |
| 对象类型 | derived comparison summary |
| 主要责任 | 对两个已成立 definition / evolution anchors 形成 body-free 差异与兼容影响引用摘要。 |

### 6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `diff_summary_id` | `ToolContractDiffSummaryId` | 派生差异摘要标识。 |
| `tool_id` | `ToolId` | 被比较稳定工具。 |
| `base_revision` | `DefinitionRevision` | 比较基线 revision。 |
| `target_revision` | `DefinitionRevision` | 比较目标 revision。 |
| `semantic_change_summary` | `DefinitionSemanticChangeSummary` | 调用 / outcome / requirement 的正文安全变化摘要。 |
| `compatibility_impact_ref` | `CompatibilityImpactRef` | 指向正式影响判断，不由 diff 自行裁决。 |
| `freshness_state` | `DerivedFreshnessState` | fresh / stale / unavailable。 |

### 6.3 状态集合

| 状态 | 作用 |
|---|---|
| `fresh` | 两个 revision 与影响引用仍可验证。 |
| `stale` | 相关 current revision / impact 已变化，摘要只作历史读取。 |
| `unavailable` | 缺少正式 revision 或影响引用，无法形成可解释 diff。 |

### 6.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `compares(DefinitionRevision base_revision, DefinitionRevision target_revision)` | 验证摘要比较范围。 |
| `has_compatibility_impact()` | 判断是否回链正式 impact。 |
| `is_body_free()` | 验证差异摘要未复制 definition source 正文。 |

### 6.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `compare(FormalToolDefinition base, FormalToolDefinition target, ToolCompatibilityImpact impact)` | 从已成立对象形成只读差异摘要。 |

### 6.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 由 diff 自动采用 revision 或修改 compatibility impact | 正式变化必须重入合同边界。 |
| 包含完整 schema / source body / implementation diff | 本对象只表达概要语义变化摘要。 |
| 将 unavailable 默认为无变化 | 缺少来源必须显式。 |

## 7. `ToolDiagnosticSummary`

### 7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 引用完整性与受控派生 |
| 对象类型 | derived diagnostic summary |
| 主要责任 | 汇总某工具 / invocation 的本地 truth、assessments、attempts 与 gaps，提供正文安全诊断入口。 |

### 7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `diagnostic_id` | `ToolDiagnosticSummaryId` | 派生诊断标识。 |
| `subject_ref` | `ToolDiagnosticSubjectRef` | 指向 tool、Binding 或 invocation / outcome 主语。 |
| `local_state_summary` | `ToolLocalStateSafeSummary` | 合同、调用、终态等 L2 truth 安全摘要。 |
| `assessment_summary` | `ExternalAssessmentSafeSummary` | Hub / authorization / Sandbox / refs 的 L2 判断摘要。 |
| `attempt_summary` | `LocalAttemptSafeSummary` | Execution / external submission 的本地 attempt 摘要。 |
| `gap_refs` | `ConsistencyGapRefSet` | 当前关联 gaps。 |
| `freshness_state` | `DerivedFreshnessState` | fresh / stale / rebuilding / failed。 |

### 7.3 状态集合

| 状态 | 作用 |
|---|---|
| `fresh` | 诊断覆盖声明的本地 truth / gap 水位。 |
| `stale` | 核心 truth 或 gaps 已变化。 |
| `rebuilding` | 诊断正在重建，不阻塞核心路径。 |
| `failed` | 本次派生失败，不能被解释为 subject failure。 |

### 7.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `has_blocking_gap()` | 判断是否存在阻塞受影响核心 / integration path 的 gap。 |
| `has_local_terminal_outcome()` | 判断 subject 是否已有 L2 终态。 |
| `external_status_is_unknown()` | 判断外围状态是否缺正式可验证 ref。 |
| `is_body_free()` | 验证诊断不包含 raw / secret / external-owner body。 |

### 7.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `derive(ToolDiagnosticSubjectRef subject_ref, LocalTruthSafeSummary truth, ExternalAssessmentSafeSummary assessments, LocalAttemptSafeSummary attempts, ConsistencyGapRefSet gaps)` | 从只读输入形成诊断摘要。 |

### 7.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 作为 Observability store、ToolHealth truth 或 Runtime recovery controller | 它是 L2 只读派生。 |
| 自动修复 gap、重试 execution 或提交 | 诊断不取得写权。 |
| 以派生失败改写 subject 状态 | `failed` 只描述诊断材料自身。 |

## 8. `ToolConsumerGuidanceView`

### 8.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 引用完整性与受控派生 |
| 对象类型 | derived consumer read model |
| 主要责任 | 向 Runtime、direct caller 与 future SDK 提供当前正式工具消费边界、所需前置与 gap 的安全指导，不生成 client / plan。 |

### 8.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `guidance_id` | `ToolConsumerGuidanceViewId` | 派生指导视图标识。 |
| `tool_id` | `ToolId` | 指导目标稳定工具。 |
| `definition_revision` | `DefinitionRevision` | 指导基于的正式 revision。 |
| `invocation_guidance` | `CanonicalInvocationGuidanceSummary` | 合同内调用语义摘要，不是 client DTO。 |
| `precondition_guidance` | `ExecutionPreconditionGuidanceSummary` | Governed / Sandbox 条件与保守失败摘要。 |
| `binding_guidance` | `CapabilityBindingGuidanceSummary` | Bound / unbound 与 source gap 摘要。 |
| `known_gap_refs` | `ConsistencyGapRefSet` | 消费者必须可见的 blocked / degraded gap。 |
| `freshness_state` | `DerivedFreshnessState` | fresh / stale / rebuilding / unavailable。 |

### 8.3 状态集合

| 状态 | 作用 |
|---|---|
| `fresh` | 视图覆盖声明的 contract / Binding / gap 水位。 |
| `stale` | 上游本地 truth 已演进，消费者必须回退稳定合同查询。 |
| `rebuilding` | 指导正在重建，不阻塞正式 invocation API 自身。 |
| `unavailable` | 暂无派生指导，不代表工具合同不存在或已授权。 |

### 8.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `supports_revision(DefinitionRevision revision)` | 判断指导是否匹配消费者目标 revision。 |
| `requires_authorization()` | 返回正式 definition 声明的消费前置摘要。 |
| `requires_sandbox()` | 返回正式隔离承载要求摘要。 |
| `has_blocking_gap()` | 判断当前是否存在阻止正向消费的开放 gap。 |

### 8.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `project(ToolContractView contract_view, CapabilityBindingView binding_view, ConsistencyGapRefSet gaps)` | 从稳定安全读取形成消费者指导。 |

### 8.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 生成 SDK client、language wrapper、Runtime action / plan 或 transport request | Consumer implementation 属于外部 owner / 03。 |
| 把 guidance 当 authorization / readiness truth | 它只描述合同边界和已知 gap。 |
| Stale / unavailable 时退回旧本地 allowlist / inventory | 必须使用正式合同 Query 或保守失败。 |

## 9. `SharedContractAuthorityRef`

### 9.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 引用完整性与受控派生 |
| 对象类型 | compile-authority reference object |
| 主要责任 | 指向 Core shared-contract authority、适用 package / type 语境与 revision；当前 Tools-specific authority 未闭口时显式 gap。 |

### 9.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `authority_ref_id` | `SharedContractAuthorityRefId` | 本地 authority ref 标识。 |
| `core_authority_ref` | `CoreSharedContractAuthorityRef` | 指向唯一允许 compile dependency 的 Core authority。 |
| `contract_family` | `SharedContractFamily` | 表达共享 identity / error / trace / event / service contract 类别。 |
| `package_or_type_ref` | `CorePackageOrTypeRef` | 仅在正式 Tools-specific authority 存在时定位具体 contract。 |
| `authority_revision_ref` | `ExternalRevisionRef` | 锚定被消费 authority revision。 |
| `resolution_state` | `SharedAuthorityResolutionState` | resolved / candidate-only / missing / conflicting / unverifiable。 |

### 9.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | Core 中存在正式可引用的适用 contract authority。 |
| `candidate_only` | 上游需求声明该类别，但尚无可引用 Tools-specific package / type；当前主要状态。 |
| `missing` | 受影响 path 所需 authority 未提供。 |
| `conflicting` | 多个 package / type 或 revision 声称 authority。 |
| `unverifiable` | 无法确认来源 / revision 是否正式。 |

### 9.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `supports_family(SharedContractFamily family)` | 判断 authority ref 是否覆盖需要的共享合同类别。 |
| `has_formal_package_or_type()` | 判断是否具备可引用具体 contract。 |
| `permits_compile_reference()` | 仅在 resolved 且 authority 为 Core 时允许具体 compile ref。 |
| `requires_authority_gap()` | 判断 candidate-only / missing / conflict / unverifiable 是否需 gap。 |

### 9.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_core(CoreSharedContractAuthorityRef authority_ref, SharedContractFamily family, CorePackageOrTypeRef type_ref, ExternalRevisionRef revision_ref)` | 从正式 Core authority 建立 compile ref。 |
| `candidate(SharedContractFamily family, UpstreamContractCandidateRef candidate_ref)` | 仅有上游候选声明时形成非 ready ref。 |

### 9.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 在 `L2T-UP-008` 未闭口时私造 package、crate、schema 或 type authority | Core compile baseline 不等于具体合同存在。 |
| 指向 Hub / Sandbox / Runtime sibling package 作为 compile dependency | 这些项目只能通过 runtime seam 协作。 |
| 由本地类型反向宣称 shared authority | Authority 必须来自 Core 正式合同。 |

## 10. 本组成部分停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理完整 | pass | 8 个候选全部独立成节。 |
| Capability 来源 | pass | Ref assessment、gap、report、search / diff / diagnostic / guidance 与 Core authority ref 均有对象承接。 |
| Assessment / gap / report 分工 | pass | 判断、正式缺口和汇总派生各有独立语义。 |
| 派生状态 | pass | Fresh / stale / rebuilding / unavailable / failed 不反写核心。 |
| No-write / formal re-entry | pass | 所有对象均无核心 / 外部 truth 修复权。 |
| Blocker 诚实 | pass | Core Tools-specific authority 与 SDK consumer 均未被写成 ready。 |

```text
component_status = completed
gate_status = pass
next_allowed_action = complete_step_06_cross_object_audit
```
