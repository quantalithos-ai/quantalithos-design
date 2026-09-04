# 02 概要校准 Step 6：关键对象轮廓

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 5 completed / pass
> 本步目的：沿 CMP-MS-01~07 逐部分正式化 29 个关键对象，冻结概要字段、状态、行为和禁止边界，并为 Step 8 / 9 建立反查基线

## 1. Step 开工确认与计划

| 项目 | 记录 |
|---|---|
| 已读取通用规范 | yes；概要设计 SOP、概要设计书写规范及既有通用规范基线已复核 |
| 已读取项目输入 | yes；正式 00 / 01、02 flow / ledger、Step 4 / 5 及相关上游边界已复核 |
| 当前 Step | Step 6：关键对象轮廓 |
| 本 Step 输出 | `design-calibration/02_hld_step_06_key_objects.md` |
| 正式文档写入 | forbidden；Step 14 前旧正式 02 仍为 historical_material |
| 下一 Step | blocked；本步 completed / pass 前不得创建 Step 7 |

- [x] 回答对象正式化问题并冻结筛选规则。
- [x] 建立 29 个对象的归属与类型索引。
- [x] 逐项停审 CMP-MS-01~07 的对象骨架。
- [x] 完成 Step 8 / 9 反查、跨对象审计和正式第 6 章回填草稿。
- [x] 完成 Gate 自检并更新 flow / project ledger。

## 2. 本步问题回答与设计取舍

| 问题 | 结论 |
|---|---|
| 哪些对象必须点名 | Step 5 冻结的 29 个对象全部独立展开；缺少任一个都会使决定、世代、session、健康、cleanup 或 handoff 主语在 03 被重新发明。 |
| 对象如何归属 | 每个对象只归属一个 CMP；跨 CMP 只通过 typed ref、已提交 fact 或 safe slice 关联，不共享可写对象。 |
| 字段深度 | 只写 identity、owner anchor、generation、source / correlation、状态、关键关联和时点等概要类型；不写完整字段全集、序列化 schema 或数据库列。 |
| 行为深度 | 只写能保护 invariant 的成员 / 工厂函数骨架，参数均为 `TypeName param_name`；返回类型、实现、事务和调用链留 03。 |
| 外部合同如何表达 | 使用 `ExternalRef`、`SafeExternalSummary`、`RuntimeAssociationRefPlaceholder` 等概要占位类型；它们只表达本仓所需类别，不定义对端 schema。 |
| 状态如何划分 | 每个 owner 保留独立状态轴；readiness、host lifecycle、registration、session、health、closure、handoff 和 projection 不压成单一 `HostStatus`。 |
| 无独立状态 / 行为怎么办 | 纯 policy、material、history 或 projection 对象按责任保留必要行为；没有生命周期的对象不虚构状态集合。 |
| 后续如何反查 | Step 8 的 write / consumer / job / query flow 必须引用本步对象；Step 9 只展开本步已有状态，不得新增隐式状态对象。 |

## 3. 当前材料诊断

| 材料 | 可用内容 | 污染 / 缺口 | 本步处置 |
|---|---|---|---|
| 正式 00 / 01 | C-MS-1~5、数据 owner、一致性、A / S / P 语义和 fail-closed 规则 | 不提供对象字段或函数全集 | 作为结构与边界上限 |
| Step 4 / 5 | 七部分、CAP-MS-01~28、29 个对象候选和接缝 | 尚无对象级字段 / 行为骨架 | 本步唯一候选来源 |
| 兄弟当前文档 | 需求 / 架构级 owner 与 supply 方向 | exact contract 尚未共同闭口 | 只保留 placeholder / blocked / waiting |
| draft 与旧正式 02 | 可用于识别旧名词与过度实现倾向 | 旧 worker、REST / gRPC、对象、状态和 repository 均无当前效力 | 不继承；Step 14 再做污染审计 |

## 4. 对象候选池筛选说明

| 候选名称 / 类别 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `HostIntent`、`HostOrchestrationDecision`、`HostControlPolicy` | CMP-01 truth / decision / policy | 3 个正式关键对象 | 分别拥有受理事实、编排决定和 guard，责任不可合并。 |
| `HostQualificationContext`、`HostAssembly`、`HostReadinessDecision`、`RequiredQualificationPolicy` | CMP-02 snapshot / truth / decision / policy | 4 个正式关键对象 | 外部资格时点、分项装配、整体 readiness 和 required/no-fallback 规则必须分层。 |
| `MemberExecutionHost`、`HostActionAttempt`、`HostExternalAssociation`、`HostGenerationFence` | CMP-03 truth / attempt / association / guard | 4 个正式关键对象 | 逻辑 host、外部副作用、外部 ref 和 single-active fence 各有独立生命周期。 |
| `HostRegistration`、`HostEndpoint`、`HostSession`、`RegistrationSessionPolicy` | CMP-04 acceptance / association / session / policy | 4 个正式关键对象 | registration、endpoint 与 Host Session 不是同一 truth，policy 保护 active uniqueness。 |
| `HealthSignalSnapshot`、`HostHealthAssessment`、`HostFailureClassification`、`HostRecoveryDecision` | CMP-05 snapshot / assessment / failure / decision | 4 个正式关键对象 | signal、四层健康、失败分类和处置决定不能互相代替。 |
| `HostClosure`、`CleanupAttempt`、`ResidualFinding`、`ReconciliationCase` | CMP-06 closure / attempt / finding / case | 4 个正式关键对象 | local closure、external attempt、差异发现与对账处置各有不同 owner 语义。 |
| `HostFactMaterial`、`HostHandoffRecord`、`SafeHostView`、`HostProjectionState`、`HostOutboxRecord`、`HostHistoryEntry` | CMP-07 material / handoff / projection / outbox / history | 6 个正式关键对象 | 源变化材料、逐目标交接、读取视图、投影进度、待发布记录和历史索引不可压缩。 |
| `ProjectMemberRef`、`GlobalMemberRef`、ID、actor、source、correlation、generation、time、reason 类型 | reference / value type | 仅作关键字段类型 | owner 已在 Core / L1 或本地 value 语义中确定；本步不扩成对象主语。 |
| Member / Runtime / Images / Sandbox / credential / carrier / registry / Bus / consumer refs | external reference | 仅作 typed ref / placeholder 字段类型 | exact schema 属 `MSVC-UP-001~008`；展开会伪造对端 truth。 |
| request / response / DTO / event payload / job input | interface data | 留 Step 7 | 接口形态尚未冻结，不是 domain object。 |
| repository / UoW / resolver / publisher / external port | boundary abstraction | 留 Step 7 / 03 | 属端口与持久化契约，不是业务对象。 |
| entry / consumer / service / job runner | code subject | 留 Step 7 / 8 / 03 | 属应用编排主体，不升级为 domain object。 |
| table / index / cache / container / pod / backend SDK response | implementation / product detail | 排除，留 03 或实现期 | 会过早锁定存储、产品或外部状态模型。 |

## 5. 对象分布索引

| 所属部分 | 对象 | 类型摘要 | Capability 来源 |
|---|---|---|---|
| CMP-MS-01 | `HostIntent`；`HostOrchestrationDecision`；`HostControlPolicy` | truth record；decision truth；policy / guard | CAP-MS-01~04 |
| CMP-MS-02 | `HostQualificationContext`；`HostAssembly`；`HostReadinessDecision`；`RequiredQualificationPolicy` | context snapshot；aggregate；decision truth；policy / guard | CAP-MS-05~08 |
| CMP-MS-03 | `MemberExecutionHost`；`HostActionAttempt`；`HostExternalAssociation`；`HostGenerationFence` | aggregate；side-effect record；association；guard | CAP-MS-09~12 |
| CMP-MS-04 | `HostRegistration`；`HostEndpoint`；`HostSession`；`RegistrationSessionPolicy` | truth record；association value；entity shell；policy / guard | CAP-MS-13~16 |
| CMP-MS-05 | `HealthSignalSnapshot`；`HostHealthAssessment`；`HostFailureClassification`；`HostRecoveryDecision` | external snapshot；assessment truth；fact value；decision truth | CAP-MS-17~20 |
| CMP-MS-06 | `HostClosure`；`CleanupAttempt`；`ResidualFinding`；`ReconciliationCase` | aggregate；side-effect record；finding；case truth | CAP-MS-21~24 |
| CMP-MS-07 | `HostFactMaterial`；`HostHandoffRecord`；`SafeHostView`；`HostProjectionState`；`HostOutboxRecord`；`HostHistoryEntry` | material；handoff truth；projection；projection state；outbox；history | CAP-MS-25~28 |

## 6. CMP-MS-01：Host intent and orchestration decision

### 6.1 `HostIntent`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-01 |
| 对象类型 | domain truth record |
| 主要责任 | 保存一次项目成员宿主意图的本地受理事实、正式来源、双锚、范围和幂等身份。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `intent_id` | `HostIntentId` | 本地不可变意图标识。 |
| `project_member_ref` | `ProjectMemberRef` | 唯一当前执行主语；非项目型输入不得进入对象。 |
| `global_member_ref` | `GlobalMemberRef` | 与执行主语一致的身份锚，不替代项目成员边界。 |
| `source_ref` | `HostIntentSourceRef` | 回指正式请求 / 变化来源，不保存外部正文。 |
| `requested_action` | `HostLifecycleAction` | 表达请求的 launch / replace / stop / terminate 类别。 |
| `scope_ref` | `HostControlScopeRef` | 表达已验证的项目与宿主控制范围。 |
| `idempotency_key` | `HostIntentKey` | 关联等价重放并防止第二意图事实。 |
| `correlation_id` | `CorrelationId` | 贯穿决定、动作与历史的安全关联锚。 |
| `acceptance_status` | `HostIntentAcceptanceStatus` | 记录 accepted / rejected / waiting / conflict。 |
| `reason_code` | `HostIntentReasonCode` | 记录结构化受理依据或缺口，不保存外部说明正文。 |
| `recorded_at` | `Timestamp` | 标记本地事实成立时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `accepted` | 双锚、来源和范围已通过本地受理门禁，可进入决定。 |
| `rejected` | 输入违反当前范围或不可变边界，终态保留原因。 |
| `waiting` | 正式来源或所需 owner 事实暂不可判定，不 fail open。 |
| `conflict` | 与相同幂等身份或当前已提交事实冲突，不形成第二决定。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches(HostIntentKey intent_key)` | 判定输入是否为同一幂等语境。 |
| `accept(ActorContext actor, HostIntentReasonCode reason_code)` | 在 guard 通过后形成 accepted 事实。 |
| `reject(ActorContext actor, HostIntentReasonCode reason_code)` | 形成可追溯拒绝事实。 |
| `mark_waiting(DependencyGapRef gap_ref)` | 将未闭合来源显式保持为 waiting。 |
| `mark_conflict(HostIntentRef conflicting_intent_ref)` | 记录冲突而不覆盖既有意图。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record(ProjectMemberRef project_member_ref, GlobalMemberRef global_member_ref, HostIntentSourceRef source_ref, HostLifecycleAction requested_action, HostControlScopeRef scope_ref, HostIntentKey intent_key, CorrelationId correlation_id)` | 从已完成边界 mapping 的项目型输入建立初始意图事实。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 Work / Identity 正文 | 只能保留双锚和正式来源引用。 |
| 直接触发外部动作 | accepted 只允许进入 `HostOrchestrationDecision`。 |
| 接受第三种执行主语 | 当前只支持 `ProjectMemberRef`，其他输入 fail closed。 |

### 6.2 `HostOrchestrationDecision`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-01 |
| 对象类型 | domain decision truth |
| 主要责任 | 在已受理意图和当前 Host Truth 上形成唯一、可追溯的宿主生命周期决定。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `decision_id` | `HostOrchestrationDecisionId` | 本地不可变决定标识。 |
| `intent_ref` | `HostIntentRef` | 回指已受理意图。 |
| `project_member_ref` | `ProjectMemberRef` | 锁定决定的执行主语。 |
| `action` | `HostOrchestrationAction` | 表达 launch / replace / stop / terminate / no-action。 |
| `target_host_ref` | `OptionalHostRef` | 关联既有 host；launch 尚未建 host 时允许为空。 |
| `expected_generation` | `OptionalHostGeneration` | 保护针对当前实例的控制语境。 |
| `basis_refs` | `DecisionBasisRefSet` | 回指已提交事实，不嵌入来源正文。 |
| `supersedes_ref` | `OptionalDecisionRef` | 建立替代链但不覆盖旧决定。 |
| `decision_status` | `LocalDecisionStatus` | 区分 proposed / committed / superseded / voided。 |
| `correlation_id` | `CorrelationId` | 关联后续 qualification、attempt 和 history。 |
| `decided_at` | `Timestamp` | 标记本地决定时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `proposed` | 本地候选已形成但尚未作为可执行决定提交。 |
| `committed` | 决定已成为本仓正式输入；不代表外部动作完成。 |
| `superseded` | 后续正式决定已替代其当前效力，历史保留。 |
| `voided` | 提交前发现边界或冲突问题，不可用于推进。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `commit(ActorContext actor)` | 将满足 guard 的候选决定提交为本地 truth。 |
| `supersede(HostOrchestrationDecisionRef replacement_ref, ActorContext actor)` | 以显式替代链终结当前效力。 |
| `void(DecisionReasonCode reason_code)` | 在未推进外部动作前使无效候选终结。 |
| `targets(HostRef host_ref, HostGeneration generation)` | 判断决定是否准确作用于某一 host generation。 |
| `permits(HostLifecycleAction action)` | 判断后续动作类别是否由本决定授权。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `propose(HostIntentRef intent_ref, ProjectMemberRef project_member_ref, HostOrchestrationAction action, OptionalHostRef target_host_ref, OptionalHostGeneration expected_generation, DecisionBasisRefSet basis_refs, CorrelationId correlation_id)` | 从 accepted intent 与当前事实形成待提交决定。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把决定写成动作结果 | committed 不等于 host / carrier / cleanup 成功。 |
| 由 signal、Query 或 job 隐式创建 | 决定必须有正式 intent / control 来源和 actor。 |
| 合并恢复决定 | 健康失败处置由 `HostRecoveryDecision` 独立拥有。 |

### 6.3 `HostControlPolicy`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-01 |
| 对象类型 | domain policy / guard |
| 主要责任 | 统一保护项目型双锚、正式来源、scope、幂等、冲突和 current-host 控制规则。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_revision` | `PolicyRevision` | 标识本地规则版本，不表示 governance policy truth。 |
| `supported_subject_kind` | `ExecutionSubjectKind` | 固定当前仅支持 project-member-scoped。 |
| `allowed_action_set` | `HostLifecycleActionSet` | 表达当前需求允许的宿主控制动作类别。 |
| `conflict_mode` | `HostIntentConflictMode` | 约束重复、并发和冲突的稳定处理。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate_subject(ProjectMemberRef project_member_ref, GlobalMemberRef global_member_ref)` | 检查执行主语与身份锚是否一致且在当前范围。 |
| `validate_source(HostIntentSourceRef source_ref, ActorContext actor)` | 检查来源和 actor 是否满足正式控制入口。 |
| `classify_replay(HostIntentKey intent_key, ExistingIntentFacts existing_facts)` | 区分等价重放、冲突和新意图。 |
| `guard_action(HostLifecycleAction action, CurrentHostFacts current_facts)` | 判断动作在当前 host / closure 语境是否允许。 |
| `guard_expected_generation(OptionalHostGeneration expected_generation, CurrentHostFacts current_facts)` | 防止旧世代控制当前 host。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_baseline(PolicyRevision policy_revision, HostLifecycleActionSet allowed_action_set)` | 从正式 00 / 01 的本地不可变边界构造 guard；不加载外部 governance policy。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 充当 governance approval / authorization truth | 本对象只执行本仓已正式确定的边界 guard。 |
| 通过配置扩展主语或 owner | 非项目型范围和外部 truth owner 不能配置化。 |
| 保存本地 allowlist 作为上游替代 | 缺失正式来源必须 waiting / rejected。 |

### 6.4 CMP-MS-01 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理 | pass | 3 个冻结候选均独立展开，无新增或合并。 |
| 功能来源 | pass | 分别承接 CAP-MS-01、02、03；CAP-MS-04 由对象只读能力和后续 Query 承接。 |
| 字段 / 行为深度 | pass | 已覆盖双锚、来源、幂等、决定与 guard，未写 schema / 实现。 |
| 边界 | pass | 不拥有 L1 truth、governance truth 或外部动作结果。 |

停审结论：`CMP-MS-01` object formalization completed / pass；允许进入 CMP-MS-02。

## 7. CMP-MS-02：Host qualification and assembly

### 7.1 `HostQualificationContext`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-02 |
| 对象类型 | context / external snapshot object |
| 主要责任 | 在指定 subject 与 generation 上汇集 required owner refs、safe summaries、解析状态和 freshness。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `context_id` | `HostQualificationContextId` | 一次资格判断语境的不可变标识。 |
| `decision_ref` | `HostOrchestrationDecisionRef` | 回指允许形成装配语境的已提交决定。 |
| `project_member_ref` | `ProjectMemberRef` | 锁定项目型执行主语。 |
| `global_member_ref` | `GlobalMemberRef` | 锁定一致身份锚。 |
| `target_generation` | `HostGeneration` | 防止跨世代复用资格快照。 |
| `source_entries` | `QualificationSourceEntrySet` | 保存 owner、typed ref、safe status 和 captured-at 的分项集合。 |
| `resolution_status` | `QualificationResolutionStatus` | 区分 resolved / partial / missing / stale / conflict / unknown。 |
| `freshness` | `FreshnessAssessment` | 表达整体时点可用性，不把缓存命中当来源 truth。 |
| `captured_at` | `Timestamp` | 标记本地上下文形成时点。 |
| `correlation_id` | `CorrelationId` | 关联装配、readiness 与 history。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | 所有 required source 均可验证且在允许 freshness 内。 |
| `partial` | 仅部分来源成立，明确非 ready。 |
| `missing` | 至少一个 required source 不存在或无正式引用。 |
| `stale` | required source 已过当前 freshness 门禁。 |
| `conflict` | owner、scope、双锚或 generation 信息互相冲突。 |
| `unknown` | resolver / contract /结果无法判定，保持 fail closed。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `record_source(QualificationSourceKind source_kind, ExternalRef source_ref, SafeExternalSummary safe_summary, CapturedAt captured_at)` | 追加一个 owner 明确、body-free 的来源分项。 |
| `mark_unresolved(QualificationSourceKind source_kind, QualificationGapCode gap_code)` | 显式记录 required source 缺口。 |
| `assess_freshness(FreshnessPolicyRef freshness_policy_ref, Timestamp evaluated_at)` | 形成语境时点判断，不修改外部来源。 |
| `matches_generation(HostGeneration generation)` | 防止资格语境跨世代复用。 |
| `is_complete(RequiredSourceKindSet required_sources)` | 判断 required source 是否全部可判定。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `open(HostOrchestrationDecisionRef decision_ref, ProjectMemberRef project_member_ref, GlobalMemberRef global_member_ref, HostGeneration target_generation, CorrelationId correlation_id)` | 为已提交 launch / replace 决定建立空的资格语境。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 external body / secret | 只允许 typed ref、safe summary、freshness 和 redacted marker。 |
| 本地修复 stale / missing source | 缺口必须由正式 owner 新事实闭合。 |
| 作为跨世代缓存 | 每个 context 绑定不可变 target generation。 |

### 7.2 `HostAssembly`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-02 |
| 对象类型 | domain aggregate |
| 主要责任 | 保存某一 host generation 的 required 装配项、本地分项 outcome 与整体装配事实。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `assembly_id` | `HostAssemblyId` | 本地装配聚合标识。 |
| `host_ref` | `HostRef` | 关联逻辑宿主而非 backend resource。 |
| `generation` | `HostGeneration` | 锁定不可变世代。 |
| `qualification_context_ref` | `HostQualificationContextRef` | 回指装配采用的时点资格语境。 |
| `required_items` | `HostAssemblyItemSet` | 记录必须具备的环境、资产、credential、binding 与 carrier 类别。 |
| `item_outcomes` | `HostAssemblyOutcomeSet` | 保存逐项 local pending / succeeded / failed / unknown / blocked。 |
| `assembly_status` | `HostAssemblyStatus` | 表达整体 collecting / progressing / complete / blocked / failed / unknown。 |
| `revision` | `AssemblyRevision` | 保护并发更新和 readiness 依据。 |
| `updated_at` | `Timestamp` | 标记最近本地事实变化时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `collecting` | required item set 或资格来源尚未完整。 |
| `progressing` | required item 已冻结，分项动作仍在推进。 |
| `complete` | 所有 required item 的本地可接受 outcome 已齐；仍需独立 readiness decision。 |
| `blocked` | 正式合同、来源或 prerequisite 未闭口，不能继续。 |
| `failed` | 至少一个 required item 有明确本地失败。 |
| `unknown` | 外部副作用或回送结果无法判定，禁止推导 complete。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `freeze_required_items(HostAssemblyItemSet required_items, HostGeneration generation)` | 在 generation guard 下固定本次 required set。 |
| `record_item_outcome(AssemblyItemRef item_ref, HostAssemblyItemOutcome outcome, HostGeneration generation)` | 只关联 matching generation 的安全分项结果。 |
| `mark_blocked(AssemblyItemRef item_ref, QualificationGapCode gap_code)` | 明确记录 pending contract 或 required source 缺口。 |
| `mark_unknown(AssemblyItemRef item_ref, ExternalEffectRef effect_ref)` | 保留外部结果未知，禁止盲重放。 |
| `all_required_items_satisfied()` | 判断分项是否齐备；不直接返回 Host Readiness truth。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `assemble(HostRef host_ref, HostGeneration generation, HostQualificationContextRef qualification_context_ref, HostAssemblyItemSet required_items)` | 为目标世代建立装配聚合。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用外部 resource state 直接定义装配 | 外部状态只能通过 matching safe outcome 进入。 |
| 把 complete 等同 ready / healthy / registered | 整体 readiness 由独立 decision 持有。 |
| 默认补齐 required item | partial / missing / pending 必须非 ready。 |

### 7.3 `HostReadinessDecision`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-02 |
| 对象类型 | domain decision truth |
| 主要责任 | 基于当前资格与装配事实形成 generation-bound Host Readiness 结论和缺口。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `readiness_decision_id` | `HostReadinessDecisionId` | 不可变 readiness 决定标识。 |
| `host_ref` | `HostRef` | 关联逻辑宿主。 |
| `generation` | `HostGeneration` | 锁定结论适用世代。 |
| `qualification_context_ref` | `HostQualificationContextRef` | 回指资格时点依据。 |
| `assembly_ref` | `HostAssemblyRef` | 回指装配分项事实。 |
| `basis_revision` | `AssemblyRevision` | 防止旧装配 revision 覆盖新结论。 |
| `readiness_status` | `HostReadinessStatus` | ready / blocked / waiting / failed / unknown。 |
| `gap_refs` | `ReadinessGapRefSet` | 关联缺失、stale、contract 或 unknown 分项。 |
| `supersedes_ref` | `OptionalReadinessDecisionRef` | 保留同世代重评历史。 |
| `decided_at` | `Timestamp` | 标记本地结论时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `ready` | 全部 required qualification 与 assembly 条件在同一世代成立。 |
| `blocked` | 正式合同、owner 或禁止边界阻止正向路径。 |
| `waiting` | 允许等待的新来源 / 分项结果尚未到达。 |
| `failed` | required 条件存在明确不可接受结果。 |
| `unknown` | 结果、freshness 或外部 effect 无法判定。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `supersede(HostReadinessDecisionRef replacement_ref)` | 显式建立重评链，不改写旧结论。 |
| `matches(HostRef host_ref, HostGeneration generation, AssemblyRevision basis_revision)` | 验证结论是否仍适用于当前装配。 |
| `is_ready_for(HostGeneration generation)` | 只对 matching generation 返回本地 ready 语义。 |
| `record_gap(ReadinessGapRef gap_ref)` | 追加结构化缺口，不嵌入外部 body。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `decide(HostRef host_ref, HostGeneration generation, HostQualificationContextRef qualification_context_ref, HostAssemblyRef assembly_ref, AssemblyRevision basis_revision, HostReadinessStatus readiness_status, ReadinessGapRefSet gap_refs)` | 从同一世代的资格与装配事实形成不可变结论。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 由 registration / process alive 反推 ready | readiness 仅来自 required qualification 与 assembly。 |
| 表达运行健康 | 运行期健康由 `HostHealthAssessment` 拥有。 |
| 把 placeholder / fake 当 positive readiness | `MSVC-UP-001~008` 未闭口项必须 blocked / waiting。 |

### 7.4 `RequiredQualificationPolicy`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-02 |
| 对象类型 | domain policy / guard |
| 主要责任 | 定义 required source / item、freshness、generation 和 no-fallback 的本地判定规则。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_revision` | `PolicyRevision` | 标记本地 qualification 规则版本。 |
| `required_source_kinds` | `RequiredSourceKindSet` | 固定当前必须解析的 owner 来源类别。 |
| `required_item_kinds` | `RequiredAssemblyItemKindSet` | 固定必须完成的装配类别。 |
| `freshness_policy_ref` | `FreshnessPolicyRef` | 引用时点规则；具体数值留 04。 |
| `fallback_mode` | `QualificationFallbackMode` | 固定为 fail-closed / no-host-fallback。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `required_sources(HostOrchestrationAction action)` | 按正式动作类别得到 required source 类别。 |
| `required_items(HostOrchestrationAction action, HostEnvironmentRequirementRef environment_requirement_ref)` | 从本地需求引用得到 required assembly item 类别。 |
| `evaluate_context(HostQualificationContextRef context_ref, Timestamp evaluated_at)` | 判断来源完整性、冲突与 freshness。 |
| `evaluate_assembly(HostAssemblyRef assembly_ref, HostGeneration generation)` | 判断全部 required item 的本地 outcome。 |
| `guard_no_fallback(QualificationResolutionStatus resolution_status)` | 保证 missing / stale / partial / unknown 不被默认值放行。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_baseline(PolicyRevision policy_revision, RequiredSourceKindSet required_source_kinds, RequiredAssemblyItemKindSet required_item_kinds, FreshnessPolicyRef freshness_policy_ref)` | 从正式架构边界构造 qualification guard，不吸收外部 policy truth。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 解析 Role -> image 或 image manifest | 只消费 Images owner 提供的 pinned supply ref / safe qualification。 |
| 签发 credential 或建立 Sandbox | 只判断其安全引用是否满足 required 条件。 |
| 用配置关闭 required 项 | owner、资格红线与 no-fallback 不能配置化。 |

### 7.5 CMP-MS-02 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理 | pass | 4 个冻结候选均独立展开，无新增或合并。 |
| 功能来源 | pass | 分别覆盖 CAP-MS-05~08。 |
| 状态分层 | pass | qualification、assembly 与 readiness 三轴独立，policy 不充当 truth。 |
| 边界 | pass_with_blockers | Images / credential / Sandbox / carrier 仅 typed ref / safe summary；`MSVC-UP-003/004/006/007` 继续阻塞 positive path。 |

停审结论：`CMP-MS-02` object formalization completed / pass；允许进入 CMP-MS-03。

## 8. CMP-MS-03：Host instance and carrier progression

### 8.1 `MemberExecutionHost`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-03 |
| 对象类型 | domain aggregate |
| 主要责任 | 表达项目成员的一个逻辑执行宿主实例、不可变 generation、新旧实例关系和本地生命周期。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `host_id` | `HostId` | 本仓逻辑宿主的不可变身份。 |
| `project_member_ref` | `ProjectMemberRef` | 唯一执行主语。 |
| `global_member_ref` | `GlobalMemberRef` | 与执行主语一致的身份锚。 |
| `generation` | `HostGeneration` | 对同一项目成员单调推进且不可修改的世代。 |
| `predecessor_host_ref` | `OptionalHostRef` | 回链 restart / replace 前的旧实例。 |
| `creation_decision_ref` | `HostOrchestrationDecisionRef` | 回指创建本实例的已提交决定。 |
| `lifecycle_status` | `HostLifecycleStatus` | 仅表达本地 host progression，不压入 readiness / health / session / cleanup。 |
| `current_association_refs` | `HostAssociationRefSet` | 索引本世代当前外部关联，不嵌入外部资源正文。 |
| `revision` | `HostRevision` | 保护本地并发更新与 current pointer 切换。 |
| `created_at` | `Timestamp` | 标记逻辑实例成立时点。 |
| `updated_at` | `Timestamp` | 标记最近本地生命周期变化。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `established` | 本地 host identity / generation 已提交，尚不表示外部资源存在。 |
| `progressing` | 正在推进一个或多个 generation-bound lifecycle action。 |
| `active` | 本地生命周期允许当前关联继续存在；不等于 ready、healthy 或 Runtime ready。 |
| `held` | conflict、unknown effect 或缺口使进一步动作被冻结。 |
| `quiescing` | 已有正式 stop / terminate / replacement 决定，正在本地收束。 |
| `terminated` | 本地宿主生命周期已终结；cleanup / external deletion 可仍 pending。 |
| `superseded` | 新 generation 已成为当前实例，本对象只保留历史效力。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `begin_progression(HostActionAttemptRef attempt_ref, HostGeneration generation)` | 在 generation guard 下进入外部动作推进。 |
| `mark_active(HostGeneration generation, HostReadinessDecisionRef readiness_ref)` | 依据 matching 本地 readiness 建立 host 活动语义，不推导健康或 session。 |
| `hold(HostHoldReasonCode reason_code, OptionalExternalEffectRef effect_ref)` | 在冲突或副作用 unknown 时冻结后续推进。 |
| `begin_quiescing(HostActionDecisionRef decision_ref, HostGeneration generation)` | 按正式决定开始本地收束。 |
| `terminate(HostClosureRef closure_ref, HostGeneration generation)` | 记录本地生命周期终结并回链 closure。 |
| `supersede(HostRef replacement_host_ref, HostGeneration replacement_generation)` | 建立新旧实例关系且不抹写旧 history。 |
| `associate(HostExternalAssociationRef association_ref, HostGeneration generation)` | 只接受 matching generation 的外部关联索引。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `establish(ProjectMemberRef project_member_ref, GlobalMemberRef global_member_ref, HostGeneration generation, OptionalHostRef predecessor_host_ref, HostOrchestrationDecisionRef creation_decision_ref)` | 在 single-active fence 通过后建立新的逻辑宿主世代。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 使用 backend resource id 作为 host identity | 后端引用必须通过 `HostExternalAssociation` 外置。 |
| 原地增加 generation | restart / replace 必须创建新 host 实例。 |
| 用单一 lifecycle 压平其他状态轴 | readiness、registration、session、health、closure 分别由其 owner 持有。 |

### 8.2 `HostActionAttempt`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-03 |
| 对象类型 | domain side-effect record |
| 主要责任 | 记录一次承载、资产、binding 或宿主生命周期外部动作的本地决定、发起与保守结果。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `attempt_id` | `HostActionAttemptId` | 一次不可变外部动作尝试的本地身份。 |
| `host_ref` | `HostRef` | 关联逻辑 host。 |
| `generation` | `HostGeneration` | 把 attempt 锁定到单一世代。 |
| `decision_ref` | `HostActionDecisionRef` | 回指 orchestration / recovery / closure 类正式决定。 |
| `action_kind` | `HostActionKind` | 表达 create / start / stop / terminate / asset / bind / release 类别。 |
| `target_ref` | `ExternalActionTargetRef` | 指向 adapter / owner 目标，不保存产品请求正文。 |
| `attempt_key` | `ExternalEffectKey` | 为同一不可逆效果提供稳定关联身份。 |
| `local_status` | `HostActionAttemptStatus` | 记录 prepared / dispatched / succeeded / failed / unknown / cancelled。 |
| `external_outcome_summary` | `OptionalSafeExternalOutcome` | 保存允许的时点摘要，不取得外部 truth。 |
| `correlation_id` | `CorrelationId` | 关联 callback、history 与 reconciliation。 |
| `attempted_at` | `Timestamp` | 标记本地发起时点。 |
| `updated_at` | `Timestamp` | 标记最近匹配结果变化。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `prepared` | 本地 attempt 与 fence 已提交，尚未越过 external port。 |
| `dispatched` | 本地已发起调用，但不声明外部接受或完成。 |
| `succeeded` | 已关联允许的 matching success summary；不自动形成 readiness / health。 |
| `failed` | 已关联明确失败摘要，可供分类或收束。 |
| `unknown` | 调用或提交结果无法判定，禁止盲重放。 |
| `cancelled` | 在尚未产生不可判定副作用前被正式取消。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_dispatched(ExternalDispatchRef dispatch_ref, Timestamp dispatched_at)` | 记录本地已越过 port 的事实。 |
| `record_outcome(SafeExternalOutcome outcome, HostGeneration generation)` | 仅关联 generation / correlation 匹配的允许结果。 |
| `mark_unknown(ExternalEffectUncertainty uncertainty)` | 保持 effect unknown 并要求 hold / reconciliation。 |
| `cancel(HostActionDecisionRef cancellation_ref)` | 在允许取消的阶段显式终结 attempt。 |
| `can_retry(ExternalEffectKey effect_key)` | 仅判断是否已有确定结论或 unknown fence；不自行重试。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `prepare(HostRef host_ref, HostGeneration generation, HostActionDecisionRef decision_ref, HostActionKind action_kind, ExternalActionTargetRef target_ref, ExternalEffectKey attempt_key, CorrelationId correlation_id)` | 在外部调用前先形成可追溯 attempt。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 以 dispatched / receipt 表示外部完成 | 本地阶段与外部 owner outcome 必须分层。 |
| 对 unknown effect 自动生成新 key | 必须保持原 key、hold 并进入对账。 |
| 承载逐动作 tool execution | ToolInvocation / ToolResult 属 Tools / Runtime / Sandbox 边界。 |

### 8.3 `HostExternalAssociation`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-03 |
| 对象类型 | domain reference / association object |
| 主要责任 | 保存 host generation 与 carrier、registry、asset 或 Sandbox host binding 的 typed ref 和本地关联状态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `association_id` | `HostExternalAssociationId` | 本地关联身份。 |
| `host_ref` | `HostRef` | 关联逻辑 host。 |
| `generation` | `HostGeneration` | 防止旧资源关联覆盖当前世代。 |
| `association_kind` | `HostExternalAssociationKind` | 区分 carrier / registry / asset / binding 类别。 |
| `owner_ref` | `ExternalOwnerRef` | 标记外部 truth owner。 |
| `external_ref` | `ExternalRef` | 保存 body-free typed ref；准确 schema 可为 placeholder。 |
| `source_attempt_ref` | `HostActionAttemptRef` | 回指建立或更新关联的本地 attempt。 |
| `association_status` | `HostExternalAssociationStatus` | 表达 pending / active / stale / release-pending / released / invalid / unknown。 |
| `safe_outcome` | `OptionalSafeExternalOutcome` | 保存最近允许摘要，不复制资源状态机。 |
| `updated_at` | `Timestamp` | 标记本地关联判断时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `pending` | 本地关联意图已成立，外部 ref / outcome 尚不可判定。 |
| `active` | 本地确认该 ref 当前可用于本世代关联；不等于外部资源健康。 |
| `stale` | ref 或摘要已不满足当前 freshness。 |
| `release_pending` | 已有正式释放决定，外部完成尚未成立。 |
| `released` | 已关联允许的 release summary；external cleanup truth 仍归外部 owner。 |
| `invalid` | owner、scope、generation 或 ref 验证失败。 |
| `unknown` | 外部关联或释放结果无法判定。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `activate(HostActionAttemptRef source_attempt_ref, SafeExternalOutcome outcome, HostGeneration generation)` | 以 matching 安全结果激活本地关联。 |
| `mark_stale(FreshnessReasonCode reason_code)` | 显式撤销当前可用性而不删除 ref 历史。 |
| `request_release(HostActionAttemptRef release_attempt_ref, HostGeneration generation)` | 进入 release-pending 并关联本地 attempt。 |
| `record_release_outcome(SafeExternalOutcome outcome, HostGeneration generation)` | 保守记录允许的释放摘要。 |
| `invalidate(AssociationInvalidationReason reason)` | 使不匹配或被替代关联失效。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `associate(HostRef host_ref, HostGeneration generation, HostExternalAssociationKind association_kind, ExternalOwnerRef owner_ref, ExternalRef external_ref, HostActionAttemptRef source_attempt_ref)` | 从 matching action outcome 建立 typed association。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存资源、镜像、binding 或 receipt 正文 | 只保存 external ref 和 safe summary。 |
| 反向拥有外部 lifecycle | active / released 仅为本地关联语义。 |
| 直接定义 Host Readiness | 关联只是 assembly 的分项输入。 |

### 8.4 `HostGenerationFence`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-03 |
| 对象类型 | domain policy / concurrency guard |
| 主要责任 | 保护同一 `ProjectMemberRef` 的 single-active host、不可变 generation 和迟到 / unknown effect 隔离。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `project_member_ref` | `ProjectMemberRef` | fence 的唯一执行主语范围。 |
| `current_host_ref` | `OptionalHostRef` | 当前已提交逻辑 host 指针。 |
| `current_generation` | `OptionalHostGeneration` | 当前世代基线。 |
| `current_revision` | `HostRevision` | 保护并发建立 / 替换。 |
| `unknown_effect_refs` | `ExternalEffectRefSet` | 标记仍阻止竞争推进的 unknown effects。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `guard_establish(HostOrchestrationDecisionRef decision_ref, OptionalHostGeneration expected_generation)` | 验证建立新世代不会产生竞争当前实例。 |
| `next_generation(OptionalHostGeneration current_generation)` | 形成新的不可变 generation 值。 |
| `guard_current(HostRef host_ref, HostGeneration generation, HostRevision expected_revision)` | 检查写入是否针对当前事实。 |
| `classify_feedback(HostRef host_ref, HostGeneration generation, CorrelationId correlation_id)` | 将反馈分类为 current / late / duplicate / conflict / unknown。 |
| `guard_irreversible_retry(ExternalEffectKey effect_key, ExternalEffectStatus effect_status)` | 对 unknown 或未闭合不可逆效果拒绝盲重放。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_current(ProjectMemberRef project_member_ref, CurrentHostFacts current_host_facts, ExternalEffectRefSet unknown_effect_refs)` | 从已提交 current pointer 与 unknown effect 建立一次 guard 语境。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 以 backend resource version 代替 generation | generation 是本地 Host Truth。 |
| 删除旧世代以维持 single-active | 旧实例必须保留并回链新实例。 |
| 把 fence 当数据库锁实现 | 本步只定义并发 invariant，具体事务机制留 03。 |

### 8.5 CMP-MS-03 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理 | pass | 4 个冻结候选均独立展开，无新增或合并。 |
| 功能来源 | pass | 分别覆盖 CAP-MS-09~12。 |
| 副作用分层 | pass | host truth、attempt、external association 与 fence 分离。 |
| 边界 | pass_with_blockers | carrier / registry / Sandbox 只经 adapter / ref；产品状态与 exact `MSVC-UP-004` 合同未被补造。 |

停审结论：`CMP-MS-03` object formalization completed / pass；允许进入 CMP-MS-04。

## 9. CMP-MS-04：Registration and Host Session

### 9.1 `HostRegistration`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-04 |
| 对象类型 | domain truth / acceptance record |
| 主要责任 | 保存 Member registration 输入与当前 host generation 的本地接受、拒绝、替换或失效结论。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `registration_id` | `HostRegistrationId` | 本地注册事实身份。 |
| `host_ref` | `HostRef` | 关联逻辑 host。 |
| `generation` | `HostGeneration` | 锁定注册适用世代。 |
| `project_member_ref` | `ProjectMemberRef` | 验证注册执行主语。 |
| `global_member_ref` | `GlobalMemberRef` | 验证身份锚一致性。 |
| `source_ref` | `MemberRegistrationRefPlaceholder` | 回指 Member 拥有的注册输入；exact schema waiting。 |
| `credential_ref` | `LaunchCredentialRefPlaceholder` | 仅保存实例绑定的安全引用，不保存 secret。 |
| `input_fingerprint` | `RegistrationInputFingerprint` | 识别 duplicate / replay，不复制输入正文。 |
| `registration_status` | `HostRegistrationStatus` | received / accepted / rejected / replaced / invalidated。 |
| `reason_code` | `RegistrationReasonCode` | 记录接受 / 拒绝 / 失效依据。 |
| `replaces_ref` | `OptionalHostRegistrationRef` | 保留 replacement 链。 |
| `correlation_id` | `CorrelationId` | 关联 endpoint、session 与 history。 |
| `recorded_at` | `Timestamp` | 标记本地注册结论时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `received` | 已完成边界 mapping，尚未通过 registration guard。 |
| `accepted` | source、双锚、credential 语境和 generation 均满足本地规则。 |
| `rejected` | 冒用、冲突、旧世代、无效资格或范围问题已明确。 |
| `replaced` | 新注册已取得当前效力，旧事实保留。 |
| `invalidated` | host replacement / closure 或正式失效决定终结其活动效力。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `accept(CredentialQualificationRef qualification_ref, ActorContext actor)` | 在全部 guard 通过后形成 accepted 事实。 |
| `reject(RegistrationReasonCode reason_code, ActorContext actor)` | 形成不可覆盖的拒绝结论。 |
| `replace(HostRegistrationRef replacement_ref, ActorContext actor)` | 显式终结当前效力并回链新注册。 |
| `invalidate(AssociationInvalidationReason reason, HostGeneration generation)` | 对 matching 世代注册执行显式失效。 |
| `matches_replay(RegistrationInputFingerprint input_fingerprint, HostGeneration generation)` | 判定等价重放而不建立第二活动注册。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `receive(HostRef host_ref, HostGeneration generation, ProjectMemberRef project_member_ref, GlobalMemberRef global_member_ref, MemberRegistrationRefPlaceholder source_ref, LaunchCredentialRefPlaceholder credential_ref, RegistrationInputFingerprint input_fingerprint, CorrelationId correlation_id)` | 从 Member boundary placeholder 建立待判定注册事实。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 Member request / report body | 本仓只拥有 registration acceptance truth。 |
| 签发或撤销 credential | 只消费实例绑定 qualification ref。 |
| 用 heartbeat 隐式接受注册 | registration 必须经显式 entry 和 guard。 |

### 9.2 `HostEndpoint`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-04 |
| 对象类型 | domain value / association object |
| 主要责任 | 表达某一 accepted registration 对应的安全接入引用、freshness 和活动关联状态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `endpoint_id` | `HostEndpointId` | 本地 endpoint 关联身份。 |
| `host_ref` | `HostRef` | 关联逻辑 host。 |
| `generation` | `HostGeneration` | 锁定 endpoint 适用世代。 |
| `registration_ref` | `HostRegistrationRef` | 回指 accepted registration。 |
| `safe_endpoint_ref` | `SafeHostEndpointRefPlaceholder` | 保存 body-free 接入引用；exact transport schema waiting。 |
| `endpoint_status` | `HostEndpointStatus` | candidate / active / stale / replaced / invalid。 |
| `freshness` | `FreshnessAssessment` | 表达接入材料时点适用性。 |
| `replaces_ref` | `OptionalHostEndpointRef` | 保留 endpoint replacement 链。 |
| `updated_at` | `Timestamp` | 标记最近本地关联判断。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `candidate` | 安全材料已映射，尚未成为唯一活动 endpoint。 |
| `active` | 与当前 accepted registration / generation 唯一关联。 |
| `stale` | freshness 已失效，不能继续作为当前接入依据。 |
| `replaced` | 新 endpoint 已取得当前效力，旧关联保留。 |
| `invalid` | source、scope、registration 或 generation 不匹配。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `activate(HostRegistrationRef registration_ref, HostGeneration generation)` | 在 single-active guard 下取得当前效力。 |
| `assess_freshness(FreshnessPolicyRef freshness_policy_ref, Timestamp evaluated_at)` | 更新本地 freshness 判断。 |
| `replace(HostEndpointRef replacement_ref, HostRegistrationRef replacement_registration_ref)` | 建立连续 replacement history。 |
| `invalidate(AssociationInvalidationReason reason, HostGeneration generation)` | 对 matching 世代关联显式失效。 |
| `is_current_for(HostRef host_ref, HostGeneration generation, HostRegistrationRef registration_ref)` | 判断该接入引用是否仍为当前。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `candidate(HostRef host_ref, HostGeneration generation, HostRegistrationRef registration_ref, SafeHostEndpointRefPlaceholder safe_endpoint_ref, FreshnessAssessment freshness)` | 从 accepted registration 的安全材料建立候选 endpoint。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 secret 或 raw transport detail | 只允许安全接入引用和 freshness。 |
| 把可达性等同健康 / readiness | endpoint 只表达接入关联。 |
| 让旧 endpoint 自动恢复为 current | 必须经新 registration / replacement 显式变化。 |

### 9.3 `HostSession`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-04 |
| 对象类型 | domain entity / external association shell |
| 主要责任 | 表达 host、registration、endpoint 与允许的 Member / Runtime refs 之间唯一活动的 Host Session 壳。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `host_session_id` | `HostSessionId` | 本仓 Host Session 身份，不等于 Runtime session / run id。 |
| `host_ref` | `HostRef` | 关联逻辑 host。 |
| `generation` | `HostGeneration` | 锁定会话适用世代。 |
| `registration_ref` | `HostRegistrationRef` | 回指当前 accepted registration。 |
| `endpoint_ref` | `HostEndpointRef` | 回指当前 active endpoint。 |
| `member_association_ref` | `MemberAssociationRefPlaceholder` | 保存允许的 Member 侧关联类别，exact contract waiting。 |
| `runtime_association_ref` | `OptionalRuntimeAssociationRefPlaceholder` | 保存允许的 Runtime 关联壳；不创建 run。 |
| `session_status` | `HostSessionStatus` | pending / active / blocked / stale / replaced / closed / unknown。 |
| `reason_code` | `HostSessionReasonCode` | 记录阻塞、失效或替代原因。 |
| `replaces_ref` | `OptionalHostSessionRef` | 保留会话 replacement 链。 |
| `established_at` | `OptionalTimestamp` | 标记本地 Host Session 正式建立时点。 |
| `updated_at` | `Timestamp` | 标记最近关联变化。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `pending` | 本地前置已收集，对端 association 仍未闭口。 |
| `active` | 本地 host / registration / endpoint 与允许 refs 唯一关联；不等于 Runtime run active。 |
| `blocked` | `MSVC-UP-001/002/006` 或本地资格缺口阻止正向建立。 |
| `stale` | endpoint、registration 或 external ref 已过时。 |
| `replaced` | 新 Host Session 取得当前效力，旧 history 保留。 |
| `closed` | closure / invalidation 已显式终结关联。 |
| `unknown` | 对端关联结果或 current status 无法判定。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `activate(HostRegistrationRef registration_ref, HostEndpointRef endpoint_ref, HostGeneration generation, RuntimeAssociationRefPlaceholder runtime_association_ref)` | 在正式 seam 可用且 guard 通过时建立本地活动壳。 |
| `mark_blocked(DependencyGapRef gap_ref)` | 保持未闭口合同或 prerequisite 的显式阻塞。 |
| `mark_stale(AssociationInvalidationReason reason)` | 使过时关联退出 current。 |
| `replace(HostSessionRef replacement_ref, HostGeneration generation)` | 建立会话替代链。 |
| `close(HostClosureRef closure_ref, HostGeneration generation)` | 按 matching closure 显式终结。 |
| `matches_signal(SignalSourceRef source_ref, HostGeneration generation)` | 判断健康信号是否可关联本 Host Session。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `open(HostRef host_ref, HostGeneration generation, HostRegistrationRef registration_ref, HostEndpointRef endpoint_ref, MemberAssociationRefPlaceholder member_association_ref)` | 建立 pending Host Session 壳，等待正式 Runtime association 边界。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 Runtime run / checkpoint / outcome 正文 | Runtime truth 只能通过允许 ref 关联。 |
| 把结构存在写成 Runtime ready | `MSVC-UP-001` 未闭口时 positive path 保持 blocked。 |
| 由 endpoint 或 heartbeat 隐式创建 | 必须基于 accepted registration 与显式 session 流。 |

### 9.4 `RegistrationSessionPolicy`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-04 |
| 对象类型 | domain policy / guard |
| 主要责任 | 保护 registration qualification、generation、credential instance binding、single-active 和迟到 / 重放规则。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_revision` | `PolicyRevision` | 标记本地 registration / session 规则版本。 |
| `active_uniqueness_mode` | `ActiveAssociationUniquenessMode` | 固定每个当前 host generation 只有一个活动 registration / endpoint / session。 |
| `replay_mode` | `RegistrationReplayMode` | 约束等价重放与冲突输入的稳定结论。 |
| `credential_binding_mode` | `CredentialBindingMode` | 固定 credential 必须实例绑定、可验证且不可跨实例复用。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate_registration(RegistrationCandidateFacts candidate_facts, CurrentHostFacts current_host_facts, CredentialQualificationRef qualification_ref)` | 校验 source、双锚、generation 与 credential 语境。 |
| `classify_replay(RegistrationInputFingerprint input_fingerprint, ExistingRegistrationFacts existing_facts)` | 区分 duplicate、replay、conflict 和新注册。 |
| `guard_endpoint_activation(HostRegistrationRef registration_ref, CurrentEndpointFacts current_endpoint_facts)` | 保护唯一活动 endpoint。 |
| `guard_session_activation(HostRegistrationRef registration_ref, HostEndpointRef endpoint_ref, CurrentSessionFacts current_session_facts)` | 保护唯一活动 Host Session。 |
| `classify_late_input(HostGeneration input_generation, HostGeneration current_generation)` | 拒绝旧世代或迟到输入覆盖当前关联。 |
| `plan_replacement(CurrentAssociationFacts current_facts, RegistrationCandidateFacts candidate_facts)` | 形成显式替代边界，不原地覆盖历史。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_baseline(PolicyRevision policy_revision, ActiveAssociationUniquenessMode active_uniqueness_mode, RegistrationReplayMode replay_mode, CredentialBindingMode credential_binding_mode)` | 从正式 owner / single-active 规则构造 guard。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 定义 Member IPC / credential schema | `MSVC-UP-002/006` 仍为 waiting。 |
| 定义 Runtime session contract | 只保护本地 Host Session 壳，`MSVC-UP-001` 仍 blocked。 |
| 允许旧实例接管 current | generation mismatch 必须 rejected / stale / conflict。 |

### 9.5 CMP-MS-04 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理 | pass | 4 个冻结候选均独立展开，无新增或合并。 |
| 功能来源 | pass | 分别覆盖 CAP-MS-13~16。 |
| 活动唯一性 | pass | registration、endpoint、Host Session 分轴且共同受 generation / single-active guard。 |
| 边界 | pass_with_blockers | Member / Runtime / credential 类型显式 placeholder；`MSVC-UP-001/002/006` 未伪造成 ready。 |

停审结论：`CMP-MS-04` object formalization completed / pass；允许进入 CMP-MS-05。

## 10. CMP-MS-05：Host health and recovery

### 10.1 `HealthSignalSnapshot`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-05 |
| 对象类型 | external snapshot object |
| 主要责任 | 保存一次 Member / session / carrier / binding 安全信号的来源、世代、顺序与 freshness 判断。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `snapshot_id` | `HealthSignalSnapshotId` | 本地不可变信号快照身份。 |
| `host_ref` | `HostRef` | 关联逻辑 host。 |
| `generation` | `HostGeneration` | 防止旧实例信号污染当前判断。 |
| `host_session_ref` | `OptionalHostSessionRef` | 按需关联本地 Host Session。 |
| `source_kind` | `HealthSignalSourceKind` | 区分 Member / session / carrier / binding 等来源层。 |
| `source_ref` | `SignalSourceRefPlaceholder` | 回指外部信号事实；exact contract pending。 |
| `source_sequence` | `OptionalSignalSequence` | 在来源支持时用于排序；不单方要求对端字段。 |
| `observed_at` | `ExternalObservedAt` | 保存来源声明的观察时点摘要，不等于本仓 observed truth。 |
| `captured_at` | `Timestamp` | 标记本仓形成快照的时点。 |
| `safe_summary` | `SafeHealthSignalSummary` | 只保存健康判断所需 body-free 内容。 |
| `intake_status` | `HealthSignalIntakeStatus` | accepted / duplicate / late / stale / conflict / rejected。 |
| `correlation_id` | `CorrelationId` | 关联 assessment 与 history。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `accepted` | source、generation、顺序与边界均可用于新的健康判断。 |
| `duplicate` | 等价信号已存在，仅稳定关联而不新增结论。 |
| `late` | 合法但晚于当前判断窗口，只保留历史。 |
| `stale` | freshness 不满足当前评估输入要求。 |
| `conflict` | source identity、generation、顺序或摘要互相冲突。 |
| `rejected` | 不属于允许来源、当前范围或含 forbidden body。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `accept(HostGeneration generation, FreshnessAssessment freshness)` | 将 matching 且 fresh 的快照标记为可评估输入。 |
| `classify_order(OptionalSignalSequence current_sequence, Timestamp current_captured_at)` | 区分 current / duplicate / late / conflict。 |
| `mark_stale(FreshnessReasonCode reason_code)` | 显式撤销其当前评估适用性。 |
| `reject(SignalRejectionReasonCode reason_code)` | 记录边界或来源拒绝。 |
| `is_usable_for(HostRef host_ref, HostGeneration generation, Timestamp evaluated_at)` | 判断是否可用于指定世代的时点 assessment。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `capture(HostRef host_ref, HostGeneration generation, OptionalHostSessionRef host_session_ref, HealthSignalSourceKind source_kind, SignalSourceRefPlaceholder source_ref, OptionalSignalSequence source_sequence, ExternalObservedAt observed_at, SafeHealthSignalSummary safe_summary, CorrelationId correlation_id)` | 从允许的 external signal seam 形成 body-free 本地快照。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 raw heartbeat / logs / dump / report | 只能保存 safe summary 和关联 ref。 |
| 直接改 host lifecycle | signal 必须先进入 `HostHealthAssessment`。 |
| 把 source observed-at 当本仓 observed truth | 它只是来源时点摘要。 |

### 10.2 `HostHealthAssessment`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-05 |
| 对象类型 | domain assessment truth |
| 主要责任 | 基于当前 host facts 和 fresh snapshots 形成 host / session / backend / uncertainty 四个独立健康轴。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `assessment_id` | `HostHealthAssessmentId` | 本地不可变 assessment 身份。 |
| `host_ref` | `HostRef` | 关联逻辑 host。 |
| `generation` | `HostGeneration` | 锁定 assessment 适用世代。 |
| `host_axis` | `HostHealthAxisStatus` | 表达逻辑宿主层 healthy / degraded / unhealthy / unknown。 |
| `session_axis` | `SessionHealthAxisStatus` | 表达 Host Session 层状态，不等于 Runtime run。 |
| `backend_axis` | `BackendHealthAxisStatus` | 保存允许的 carrier / binding 摘要判断，不拥有 backend truth。 |
| `uncertainty_axis` | `HealthUncertaintyStatus` | 显式表达 evidence incomplete / stale / conflict / unknown。 |
| `basis_snapshot_refs` | `HealthSignalSnapshotRefSet` | 回指本次判断采用的快照。 |
| `basis_fact_refs` | `HostFactRefSet` | 回指 current host / session / association 本地事实。 |
| `assessment_revision` | `HealthAssessmentRevision` | 标记同世代评估顺序。 |
| `prior_assessment_ref` | `OptionalHostHealthAssessmentRef` | 保留结论演变链。 |
| `record_status` | `HealthAssessmentRecordStatus` | current / superseded / invalidated。 |
| `assessed_at` | `Timestamp` | 标记本地评估时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `current` | 当前 generation 最新可用的四轴评估。 |
| `superseded` | 新 assessment 已取得当前效力，旧四轴值保留。 |
| `invalidated` | generation / basis 冲突使该评估不得用于处置。 |

说明：健康语义位于四个 axis 字段，禁止再以单一状态压平；本表只表达 assessment record 生命周期。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `supersede(HostHealthAssessmentRef replacement_ref, HealthAssessmentRevision replacement_revision)` | 保留评估变化链。 |
| `invalidate(AssessmentInvalidationReason reason)` | 使 generation / basis 不再有效的评估退出 current。 |
| `matches_generation(HostGeneration generation)` | 验证评估的世代适用性。 |
| `has_actionable_failure()` | 判断四轴中是否存在可进入 failure classification 的本地结论。 |
| `has_uncertainty()` | 判断 stale / incomplete / conflict 是否要求 hold。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `assess(HostRef host_ref, HostGeneration generation, HostHealthAxisStatus host_axis, SessionHealthAxisStatus session_axis, BackendHealthAxisStatus backend_axis, HealthUncertaintyStatus uncertainty_axis, HealthSignalSnapshotRefSet basis_snapshot_refs, HostFactRefSet basis_fact_refs, HealthAssessmentRevision assessment_revision, OptionalHostHealthAssessmentRef prior_assessment_ref)` | 从同一时点语境形成不可变四轴评估。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把 process alive 写成整体 healthy | host、session、backend 与 uncertainty 必须分轴。 |
| 表达 Runtime / business / Sandbox policy 健康 | 这些 truth 由外部 owner 持有。 |
| 从 projection 修复 assessment | 只能从本地 facts 与 fresh snapshots 重新评估。 |

### 10.3 `HostFailureClassification`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-05 |
| 对象类型 | domain failure fact / value object |
| 主要责任 | 把可行动健康异常分类为 host / session / backend / unknown 层级、影响和定性 certainty。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `classification_id` | `HostFailureClassificationId` | 本地失败分类身份。 |
| `host_ref` | `HostRef` | 关联逻辑 host。 |
| `generation` | `HostGeneration` | 锁定分类适用世代。 |
| `assessment_ref` | `HostHealthAssessmentRef` | 回指作为主要依据的当前 assessment。 |
| `failure_layer` | `HostFailureLayer` | 区分 host / session / backend / unknown。 |
| `failure_category` | `HostFailureCategory` | 表达失联、不可达、承载异常、binding 异常或无法分类等本地类别。 |
| `impact_scope` | `HostFailureImpactScope` | 表达对 host availability / association / progression 的本地影响。 |
| `certainty` | `FailureCertainty` | 区分 confirmed / suspected / unknown，不使用伪精确分数。 |
| `basis_refs` | `FailureBasisRefSet` | 回指 assessment、attempt 或 association facts。 |
| `classification_status` | `FailureClassificationStatus` | candidate / confirmed / superseded / withdrawn / unknown。 |
| `prior_classification_ref` | `OptionalFailureClassificationRef` | 保留分类演变。 |
| `classified_at` | `Timestamp` | 标记本地分类时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `candidate` | 已有异常线索但依据尚不足以形成 confirmed 分类。 |
| `confirmed` | 本地允许依据足以支持明确失败类别。 |
| `superseded` | 新分类已替代当前效力，旧历史保留。 |
| `withdrawn` | 新正式事实证明该分类不再适用。 |
| `unknown` | 层级或类别无法可靠判定，只能支持 hold / investigation。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `confirm(FailureBasisRefSet basis_refs)` | 在依据满足时形成 confirmed 分类。 |
| `supersede(HostFailureClassificationRef replacement_ref)` | 建立分类替代链。 |
| `withdraw(HostHealthAssessmentRef recovery_assessment_ref)` | 依据新评估显式撤销当前适用性。 |
| `mark_unknown(FailureUncertaintyReason reason)` | 保持无法归层的失败语义。 |
| `applies_to(HostRef host_ref, HostGeneration generation)` | 验证分类对目标世代的适用性。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `classify(HostRef host_ref, HostGeneration generation, HostHealthAssessmentRef assessment_ref, HostFailureLayer failure_layer, HostFailureCategory failure_category, HostFailureImpactScope impact_scope, FailureCertainty certainty, FailureBasisRefSet basis_refs)` | 从当前 assessment 与本地关联事实形成候选 / confirmed 分类。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 分类 Runtime / business failure 正文 | 只描述宿主侧层级与影响。 |
| 保存 raw evidence / logs | basis 只能是 ref 和安全摘要。 |
| 直接发起 restart / terminate | 必须进入独立 `HostRecoveryDecision`。 |

### 10.4 `HostRecoveryDecision`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-05 |
| 对象类型 | domain decision truth |
| 主要责任 | 基于正式控制语境、当前健康 / 失败事实和前置形成 recover / restart / stop / terminate / hold 决定。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `recovery_decision_id` | `HostRecoveryDecisionId` | 本地不可变处置决定身份。 |
| `host_ref` | `HostRef` | 关联被处置 host。 |
| `generation` | `HostGeneration` | 锁定决定作用的当前世代。 |
| `health_assessment_ref` | `HostHealthAssessmentRef` | 回指当前四轴健康依据。 |
| `failure_classification_ref` | `OptionalFailureClassificationRef` | 按需回指失败分类。 |
| `control_source_ref` | `FormalControlSourceRef` | 回指正式 actor / intent / operational control 语境。 |
| `action` | `HostRecoveryAction` | recover / restart / stop / terminate / hold。 |
| `prerequisite_refs` | `RecoveryPrerequisiteRefSet` | 回指允许的资格与 current facts。 |
| `decision_status` | `LocalDecisionStatus` | proposed / committed / superseded / voided。 |
| `supersedes_ref` | `OptionalHostRecoveryDecisionRef` | 保留处置决定替代链。 |
| `correlation_id` | `CorrelationId` | 关联 CMP-03 action attempt 或 CMP-06 closure。 |
| `decided_at` | `Timestamp` | 标记本地决定时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `proposed` | 候选处置已形成，尚未作为外部动作输入提交。 |
| `committed` | 本地决定已成立；不表示 recover / restart / terminate 已完成。 |
| `superseded` | 新正式处置决定已替代当前效力。 |
| `voided` | generation、前置或控制来源不再满足，决定不得推进。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `commit(ActorContext actor, CurrentHostFacts current_host_facts)` | 在 generation 与 prerequisite guard 通过后提交。 |
| `supersede(HostRecoveryDecisionRef replacement_ref, ActorContext actor)` | 显式终结当前效力。 |
| `void(DecisionReasonCode reason_code)` | 使未执行候选失效。 |
| `permits(HostActionKind action_kind)` | 判断 CMP-03 / 06 后续动作是否由本决定授权。 |
| `requires_new_generation()` | 判断 restart / replacement 是否必须建立新 host。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `propose(HostRef host_ref, HostGeneration generation, HostHealthAssessmentRef health_assessment_ref, OptionalFailureClassificationRef failure_classification_ref, FormalControlSourceRef control_source_ref, HostRecoveryAction action, RecoveryPrerequisiteRefSet prerequisite_refs, CorrelationId correlation_id)` | 从已提交健康 / 失败事实与正式 control 语境形成候选处置。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 由 signal consumer 隐式创建并执行 | signal 先形成 assessment / classification，决定再提交。 |
| 声明 Runtime checkpoint / run 恢复 | 本对象只拥有宿主侧处置 truth。 |
| 把 hold 解释为失败消失 | hold 显式保留未知、冲突或 blocked 前置。 |

### 10.5 CMP-MS-05 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理 | pass | 4 个冻结候选均独立展开，无新增或合并。 |
| 功能来源 | pass | 分别覆盖 CAP-MS-17~20。 |
| 因果链 | pass | signal snapshot -> four-axis assessment -> failure classification -> explicit decision。 |
| 边界 | pass_with_blockers | Member / Runtime / Sandbox / carrier 仅 safe signal placeholder；无 raw body、Runtime recovery 或 backend truth。 |

停审结论：`CMP-MS-05` object formalization completed / pass；允许进入 CMP-MS-06。

## 11. CMP-MS-06：Host closure and reconciliation

### 11.1 `HostClosure`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-06 |
| 对象类型 | domain aggregate / closure truth |
| 主要责任 | 表达指定 host generation 的本地收束范围、关联失效、cleanup 缺口和 local-completion 边界。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `closure_id` | `HostClosureId` | 本地收束聚合身份。 |
| `host_ref` | `HostRef` | 关联被收束逻辑 host。 |
| `generation` | `HostGeneration` | 锁定 closure 适用世代。 |
| `decision_ref` | `HostActionDecisionRef` | 回指 termination / replacement / release 的正式决定。 |
| `closure_scope` | `HostClosureScope` | 固定需失效 / 收束的 registration、endpoint、session 与 association 类别。 |
| `invalidation_refs` | `AssociationInvalidationRefSet` | 记录已提交的本地关联失效事实。 |
| `cleanup_attempt_refs` | `CleanupAttemptRefSet` | 关联本次收束产生的 cleanup / release attempts。 |
| `pending_item_refs` | `ClosurePendingItemRefSet` | 显式保留未闭合项。 |
| `gap_refs` | `ClosureGapRefSet` | 记录外部 unavailable / unknown / contract gap。 |
| `closure_status` | `HostClosureStatus` | open / invalidating / cleanup-pending / locally-closed / residual / blocked / unknown。 |
| `revision` | `ClosureRevision` | 保护并发推进与完成判断。 |
| `opened_at` | `Timestamp` | 标记收束开始时点。 |
| `updated_at` | `Timestamp` | 标记最近本地变化。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `open` | closure scope 已建立，尚未完成本地关联失效。 |
| `invalidating` | 正在显式失效 registration / endpoint / Host Session / association。 |
| `cleanup_pending` | 本地失效已推进，仍有 cleanup / release attempt 或反馈待处理。 |
| `locally_closed` | 本仓要求的失效与本地记录均已提交；不声明 external cleanup completed。 |
| `residual` | 仍有 residual / orphan / drift finding 需要处置。 |
| `blocked` | required port / contract / owner 缺口阻止正向推进。 |
| `unknown` | 外部 effect 或本地提交结果不可判定，保持 fence。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `record_invalidation(AssociationInvalidationRef invalidation_ref, HostGeneration generation)` | 追加 matching 世代的本地关联失效事实。 |
| `add_cleanup_attempt(CleanupAttemptRef cleanup_attempt_ref)` | 将 cleanup / release attempt 纳入 closure。 |
| `record_gap(ClosureGapRef gap_ref)` | 显式保留外部或合同缺口。 |
| `record_residual(ResidualFindingRef finding_ref)` | 使 residual 与 closure 持续关联。 |
| `mark_locally_closed(ClosureRevision expected_revision)` | 仅在本地 required items 已收束时形成 local-completion。 |
| `hold_unknown(ExternalEffectRef effect_ref)` | 防止 unknown 外部动作被盲重放。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `open(HostRef host_ref, HostGeneration generation, HostActionDecisionRef decision_ref, HostClosureScope closure_scope)` | 从已提交 termination / replacement / release 决定建立本地 closure。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把 host terminated 等同 cleanup complete | 本地生命周期与收束 / 外部完成分别判断。 |
| 删除 registration / session / association 历史 | 只显式失效并追加 closure 关系。 |
| 以资源不存在推断已清理 | 必须保留来源、时点和 finding / gap。 |

### 11.2 `CleanupAttempt`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-06 |
| 对象类型 | domain side-effect record |
| 主要责任 | 记录 closure 下的一次资源 cleanup、binding release 或关联收尾的本地 attempt、结果层和 gap。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `cleanup_attempt_id` | `CleanupAttemptId` | 一次 cleanup / release 尝试的本地身份。 |
| `closure_ref` | `HostClosureRef` | 回指所属 closure。 |
| `host_ref` | `HostRef` | 关联被清理 host。 |
| `generation` | `HostGeneration` | 锁定目标世代。 |
| `cleanup_kind` | `CleanupActionKind` | 区分 carrier cleanup / binding release / registry cleanup / association close。 |
| `target_ref` | `ExternalCleanupTargetRef` | 保存外部目标 typed ref。 |
| `effect_key` | `ExternalEffectKey` | 提供幂等关联与 unknown fence。 |
| `local_status` | `CleanupAttemptStatus` | prepared / dispatched / succeeded / failed / unknown / gap / cancelled。 |
| `external_outcome_summary` | `OptionalSafeExternalOutcome` | 保存允许反馈摘要，不拥有 external completion truth。 |
| `gap_ref` | `OptionalCleanupGapRef` | 指向未送达、未回送或合同缺口。 |
| `attempted_at` | `Timestamp` | 标记本地发起时点。 |
| `updated_at` | `Timestamp` | 标记最近结果关联时点。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `prepared` | 本地 cleanup attempt 与 effect key 已提交。 |
| `dispatched` | 已发起外部调用，不声明接受或完成。 |
| `succeeded` | 已关联 matching 允许成功摘要；external owner truth 仍外置。 |
| `failed` | 已关联明确失败摘要。 |
| `unknown` | side effect 或回送结果不可判定，禁止盲重放。 |
| `gap` | port、route、contract 或反馈缺口仍存在。 |
| `cancelled` | 在无未知副作用的允许阶段被正式取消。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_dispatched(ExternalDispatchRef dispatch_ref, Timestamp dispatched_at)` | 记录本地已越过 external port。 |
| `record_outcome(SafeExternalOutcome outcome, HostGeneration generation)` | 只关联 matching target / generation 的允许结果。 |
| `mark_unknown(ExternalEffectUncertainty uncertainty)` | 建立 unknown fence。 |
| `record_gap(CleanupGapRef gap_ref)` | 保存未闭合的合同 / 路由 /反馈缺口。 |
| `can_retry(ExternalEffectKey effect_key)` | 防止对 unknown 或已确定 attempt 盲重放。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `prepare(HostClosureRef closure_ref, HostRef host_ref, HostGeneration generation, CleanupActionKind cleanup_kind, ExternalCleanupTargetRef target_ref, ExternalEffectKey effect_key)` | 在外部 cleanup / release 调用前形成 local-first attempt。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把 request receipt / timeout 写成完成 | completion 只能由外部 owner 声明，本仓仅保存安全摘要。 |
| 与 `HostActionAttempt` 合并 | 本对象只处理 closure cleanup / release 责任。 |
| 删除 unknown / failed attempts | 每次尝试均须保留并可对账。 |

### 11.3 `ResidualFinding`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-06 |
| 对象类型 | domain finding record |
| 主要责任 | 表达 Host Truth 与允许外部摘要之间的 residual、orphan、drift 或 unknown 差异。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `finding_id` | `ResidualFindingId` | 本地差异发现身份。 |
| `host_ref` | `HostRef` | 关联逻辑 host。 |
| `generation` | `HostGeneration` | 锁定发现适用世代。 |
| `closure_ref` | `OptionalHostClosureRef` | 按需关联 closure。 |
| `finding_kind` | `ResidualFindingKind` | residual / orphan / drift / unknown。 |
| `affected_ref` | `ExternalRef` | 指向受影响资源 / binding / association，不保存正文。 |
| `local_fact_refs` | `HostFactRefSet` | 回指本地对照基线。 |
| `external_summary` | `SafeExternalSummary` | 保存带来源 / captured-at 的允许摘要。 |
| `finding_status` | `ResidualFindingStatus` | open / confirmed / disputed / resolved / superseded / unknown。 |
| `reason_code` | `ResidualReasonCode` | 表达差异原因或无法判定原因。 |
| `detected_at` | `Timestamp` | 标记本地发现时点。 |
| `updated_at` | `Timestamp` | 标记最近处置变化。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `open` | 新差异已记录，尚未形成明确 disposition。 |
| `confirmed` | 本地 facts 与允许摘要足以确认差异存在。 |
| `disputed` | 来源摘要互相冲突，禁止自动修复。 |
| `resolved` | 已有显式 case disposition 证明本地发现闭合；不泛化为外部 cleanup 完成。 |
| `superseded` | 新 finding 已更准确地描述同一差异。 |
| `unknown` | 资源 owner、时点或结果无法判定。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `confirm(HostFactRefSet local_fact_refs, SafeExternalSummary external_summary)` | 在来源与时点可比较时确认差异。 |
| `dispute(ResidualReasonCode reason_code)` | 记录冲突摘要并阻止自动处置。 |
| `resolve(ReconciliationCaseRef case_ref, ReconciliationResolutionRef resolution_ref)` | 通过显式 case 关闭 finding。 |
| `supersede(ResidualFindingRef replacement_ref)` | 保留差异演变链。 |
| `matches(ExternalRef affected_ref, HostGeneration generation)` | 识别同一资源 / 世代差异。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `detect(HostRef host_ref, HostGeneration generation, OptionalHostClosureRef closure_ref, ResidualFindingKind finding_kind, ExternalRef affected_ref, HostFactRefSet local_fact_refs, SafeExternalSummary external_summary, ResidualReasonCode reason_code)` | 从 committed Host Truth 与允许时点摘要形成 finding。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 自动修改 host / registration / health truth | finding 只能进入 reconciliation disposition。 |
| 保存 backend dump / evidence / report | 只保留 safe summary 与 ref。 |
| 为消除差异删除既有事实 | resolved 也必须保留 finding history。 |

### 11.4 `ReconciliationCase`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-06 |
| 对象类型 | domain case / disposition truth |
| 主要责任 | 聚合一个或多个 findings，形成 repair-request / hold / escalate / resolve / unknown 的本地处置事实。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `case_id` | `ReconciliationCaseId` | 本地对账 case 身份。 |
| `host_ref` | `HostRef` | 关联逻辑 host。 |
| `generation` | `HostGeneration` | 锁定 case 的实例世代。 |
| `finding_refs` | `ResidualFindingRefSet` | 聚合需共同处置的 findings。 |
| `disposition` | `ReconciliationDisposition` | repair-request / hold / escalate / resolve / unknown / no-action。 |
| `case_status` | `ReconciliationCaseStatus` | open / action-requested / holding / escalated / resolved / unknown。 |
| `decision_basis_refs` | `ReconciliationBasisRefSet` | 回指 history、attempt、current facts 和允许摘要。 |
| `action_attempt_refs` | `CleanupAttemptRefSet` | 关联由 disposition 授权的 cleanup attempts。 |
| `actor_context_ref` | `ReconciliationActorContextRef` | 区分人工 / 正式 command / job 语境，不让 job 取得隐式权力。 |
| `resolution_ref` | `OptionalReconciliationResolutionRef` | 记录显式闭合依据。 |
| `revision` | `ReconciliationCaseRevision` | 保护并发处置与重复 job。 |
| `opened_at` | `Timestamp` | 标记 case 建立时点。 |
| `updated_at` | `Timestamp` | 标记最近 disposition 变化。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `open` | findings 已聚合，尚未形成处置。 |
| `action_requested` | 已形成正式 repair / cleanup request；不等于动作完成。 |
| `holding` | unknown、conflict 或前置缺口使 case 保持等待。 |
| `escalated` | 已交接给正式 owner / operator；不等于被接受。 |
| `resolved` | 本地 case 有显式 resolution basis，history 保留。 |
| `unknown` | disposition 或外部 effect 无法判定。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `add_finding(ResidualFindingRef finding_ref, HostGeneration generation)` | 将 matching 世代 finding 纳入 case。 |
| `decide(ReconciliationDisposition disposition, ReconciliationBasisRefSet basis_refs, ReconciliationActorContextRef actor_context_ref)` | 形成显式本地 disposition。 |
| `link_attempt(CleanupAttemptRef cleanup_attempt_ref)` | 关联由 case 授权的后续 attempt。 |
| `hold(ReconciliationHoldReason reason)` | 在 unknown / conflict 下阻止自动 repair。 |
| `escalate(HandoffTargetRef target_ref, ReconciliationActorContextRef actor_context_ref)` | 记录本地升级动作，不声明对端接受。 |
| `resolve(ReconciliationResolutionRef resolution_ref, ReconciliationCaseRevision expected_revision)` | 以可回链依据显式闭合 case。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `open(HostRef host_ref, HostGeneration generation, ResidualFindingRefSet finding_refs, ReconciliationActorContextRef actor_context_ref)` | 从一个或多个 matching findings 建立 case。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 由 job 隐式重启、终止或改写 truth | job 只能发现 / 推进已有正式 disposition。 |
| 以 escalated / requested 表示 accepted / completed | 外部 owner 状态保持外置。 |
| 修复 sibling / backend truth | 本对象只拥有本地 case 与处置历史。 |

### 11.5 CMP-MS-06 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理 | pass | 4 个冻结候选均独立展开，无新增或合并。 |
| 功能来源 | pass | 分别覆盖 CAP-MS-21~24。 |
| 结果分层 | pass | local closure、cleanup attempt、finding、case disposition 与 external completion 分离。 |
| 边界 | pass_with_blockers | Sandbox / carrier cleanup 只经 typed ref / safe summary；`MSVC-UP-004/007` exact receipt 与 route 仍 pending。 |

停审结论：`CMP-MS-06` object formalization completed / pass；允许进入 CMP-MS-07。

## 12. CMP-MS-07：Host fact handoff and safe consumption

### 12.1 `HostFactMaterial`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-07 |
| 对象类型 | domain material record |
| 主要责任 | 从 CMP-MS-01~06 已提交变化形成可关联、可裁剪、body-free 的宿主事实材料。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `material_id` | `HostFactMaterialId` | 本地不可变材料身份。 |
| `source_change_ref` | `CommittedHostChangeRef` | 回指唯一已提交源变化。 |
| `source_fact_refs` | `HostFactRefSet` | 回指支撑材料的本地 truth，不复制对象正文。 |
| `project_member_ref` | `ProjectMemberRef` | 标记执行主语。 |
| `global_member_ref` | `GlobalMemberRef` | 标记一致身份锚。 |
| `host_ref` | `OptionalHostRef` | 按变化类别关联逻辑 host。 |
| `generation` | `OptionalHostGeneration` | 按需锁定实例世代。 |
| `material_class` | `HostFactMaterialClass` | 区分 intent / decision / assembly / session / health / closure / handoff 类安全材料。 |
| `safe_fact_summary` | `BodyFreeHostFactSummary` | 保存最小结构化摘要，禁止 secret / external body。 |
| `redaction_profile_ref` | `RedactionProfileRef` | 标记采用的安全裁剪规则；具体配置留 04。 |
| `occurred_at` | `Timestamp` | 引用源变化发生时点。 |
| `formed_at` | `Timestamp` | 标记材料形成时点。 |
| `correlation_id` | `CorrelationId` | 关联 history、outbox 和 handoff。 |

本对象是从单一 committed change 形成的不可变材料，没有独立生命周期状态；传播状态由 `HostOutboxRecord` 和 `HostHandoffRecord` 持有。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate_body_free(ForbiddenBodyClassSet forbidden_body_classes)` | 验证材料不含 secret 或外部正文类别。 |
| `matches_source(CommittedHostChangeRef source_change_ref)` | 保证材料只对应一个已提交变化身份。 |
| `redact(RedactionProfileRef redaction_profile_ref)` | 形成更窄的安全摘要，不扩展源事实。 |
| `is_about(HostRef host_ref, OptionalHostGeneration generation)` | 判断材料与目标 host / generation 的关联。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `form(CommittedHostChangeRef source_change_ref, HostFactRefSet source_fact_refs, ProjectMemberRef project_member_ref, GlobalMemberRef global_member_ref, OptionalHostRef host_ref, OptionalHostGeneration generation, HostFactMaterialClass material_class, BodyFreeHostFactSummary safe_fact_summary, RedactionProfileRef redaction_profile_ref, CorrelationId correlation_id)` | 从已提交本地 truth 形成 immutable body-free material。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 credential、endpoint、image、Runtime、Sandbox、backend 或 report 正文 | 材料必须最小且 body-free。 |
| 表达 delivered / observed / accepted | 本对象只证明本地材料已经形成。 |
| 由 external state 反向生成 source truth | source 必须是已提交 `CommittedHostChangeRef`。 |

### 12.2 `HostHandoffRecord`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-07 |
| 对象类型 | domain handoff truth record |
| 主要责任 | 按 material 与 target 记录本地 handoff attempt、gap 及 delivered / observed / accepted 的分层安全摘要。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `handoff_id` | `HostHandoffId` | 单一 material-target 交接身份。 |
| `material_ref` | `HostFactMaterialRef` | 回指待交接 body-free material。 |
| `target_ref` | `HandoffTargetRef` | 指向 Bus / Observability / 授权 consumer 等正式目标类别。 |
| `handoff_key` | `HandoffKey` | 为同一目标的重试与反馈提供稳定身份。 |
| `attempt_refs` | `HandoffAttemptRefSet` | 记录本地提交尝试，不嵌入 transport 请求。 |
| `local_status` | `HostHandoffStatus` | pending / attempted / gap / feedback-linked / closed / unknown。 |
| `gap_refs` | `HandoffGapRefSet` | 记录 route、contract、publisher 或 feedback 缺口。 |
| `delivery_summary` | `OptionalExternalDeliverySummary` | 保存外部 owner 声明的时点摘要，不由本仓推断。 |
| `observation_summary` | `OptionalExternalObservationSummary` | 保存 Observability owner 的时点摘要。 |
| `acceptance_summary` | `OptionalExternalAcceptanceSummary` | 保存下游 owner 的时点摘要。 |
| `updated_at` | `Timestamp` | 标记最近本地交接记录变化。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `pending` | material-target 交接记录已建立，尚无本地 attempt。 |
| `attempted` | 至少一次本地 handoff attempt 已记录，不声明 delivered。 |
| `gap` | route、contract、publisher 或反馈缺口仍存在。 |
| `feedback_linked` | 已关联至少一种外部 owner 安全摘要，各 outcome layer 仍独立。 |
| `closed` | 本地 policy 决定不再推进该 handoff；不等于 accepted。 |
| `unknown` | attempt 或反馈关联结果无法判定。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `record_attempt(HandoffAttemptRef attempt_ref, HandoffKey handoff_key)` | 追加本地交接尝试并保持 stable identity。 |
| `record_gap(HandoffGapRef gap_ref)` | 记录传播或合同缺口而不回滚 source truth。 |
| `link_delivery(ExternalDeliverySummary delivery_summary)` | 只关联外部 delivery owner 提供的安全摘要。 |
| `link_observation(ExternalObservationSummary observation_summary)` | 只关联 Observability owner 摘要。 |
| `link_acceptance(ExternalAcceptanceSummary acceptance_summary)` | 只关联 consumer owner 摘要。 |
| `close(HandoffClosureReason reason)` | 显式终结本地推进，不合并外部 outcome。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `open(HostFactMaterialRef material_ref, HandoffTargetRef target_ref, HandoffKey handoff_key)` | 为一个 material-target 对建立本地 handoff truth。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 从 timeout / local submit 推断 delivered | delivered 只可关联正式外部 owner 摘要。 |
| 将 delivered、observed、accepted 压成一个状态 | 三层字段独立，缺一不推断另一层。 |
| 因交接失败回滚 source truth | handoff gap 只影响消费面。 |

### 12.3 `SafeHostView`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-07 |
| 对象类型 | read model / projection |
| 主要责任 | 汇总授权可见的当前 host、readiness、session、health、closure 与 handoff 安全切片。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `SafeHostViewId` | 一份派生读取快照身份。 |
| `project_member_ref` | `ProjectMemberRef` | 视图查询执行主语。 |
| `global_member_ref` | `GlobalMemberRef` | 身份锚安全切片。 |
| `current_host_slice` | `OptionalSafeHostSlice` | 派生当前 host / generation / lifecycle 最小值。 |
| `readiness_slice` | `OptionalSafeReadinessSlice` | 派生当前 readiness 与 gap 摘要。 |
| `registration_session_slice` | `OptionalSafeRegistrationSessionSlice` | 派生 registration / endpoint / Host Session 安全状态。 |
| `health_recovery_slice` | `OptionalSafeHealthRecoverySlice` | 派生四轴健康、失败层与处置摘要。 |
| `closure_reconciliation_slice` | `OptionalSafeClosureReconciliationSlice` | 派生 local closure、cleanup gap、residual / case 摘要。 |
| `handoff_slice` | `OptionalSafeHandoffSlice` | 派生 local attempt / gap 与外部 outcome layers 摘要。 |
| `source_revision_refs` | `HostFactRevisionRefSet` | 回指各 slice 的已提交 source revisions。 |
| `visibility` | `ViewVisibilityScope` | 表达授权裁剪范围，不保存 authorization truth。 |
| `freshness` | `ProjectionFreshness` | 显式表达 view 时点与 stale / degraded。 |
| `generated_at` | `Timestamp` | 标记派生快照形成时点。 |

本对象是不可变读取快照，不拥有独立写状态；projection progression 由 `HostProjectionState` 持有。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `restrict(ViewVisibilityScope visibility)` | 对当前安全切片做更窄授权裁剪。 |
| `is_fresh_as_of(Timestamp requested_at, FreshnessPolicyRef freshness_policy_ref)` | 判断视图是否满足查询时点要求。 |
| `references(HostFactRef fact_ref)` | 判断某 source fact 是否已进入当前 view。 |
| `safe_history_anchor()` | 提供历史查询的 body-free 起点，不触发 refresh。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `project(ProjectMemberRef project_member_ref, GlobalMemberRef global_member_ref, OptionalSafeHostSlice current_host_slice, OptionalSafeReadinessSlice readiness_slice, OptionalSafeRegistrationSessionSlice registration_session_slice, OptionalSafeHealthRecoverySlice health_recovery_slice, OptionalSafeClosureReconciliationSlice closure_reconciliation_slice, OptionalSafeHandoffSlice handoff_slice, HostFactRevisionRefSet source_revision_refs, ViewVisibilityScope visibility, ProjectionFreshness freshness)` | 从已提交 truth / projection source 构建安全只读快照。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 成为 command / decision / acceptance 输入的唯一 truth | 写路径必须读取原 owner 的 current facts。 |
| Query 时隐式 refresh / repair / publish | 查询严格 no-write。 |
| 输出 forbidden body 或 raw endpoint | 只允许安全 slice。 |

### 12.4 `HostProjectionState`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-07 |
| 对象类型 | projection state object |
| 主要责任 | 记录一个安全投影 scope 的 committed-change cursor、freshness、rebuild 和 gap 状态。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `projection_state_id` | `HostProjectionStateId` | 本地 projection state 身份。 |
| `projection_scope` | `HostProjectionScope` | 表达全局、项目成员或 host 级派生范围。 |
| `last_applied_change_ref` | `OptionalCommittedHostChangeRef` | 回指最近已成功应用的源变化。 |
| `source_cursor` | `CommittedChangeCursor` | 表达派生进度，不定义 event broker offset schema。 |
| `projection_status` | `HostProjectionStatus` | fresh / stale / rebuilding / degraded / unavailable。 |
| `gap_refs` | `ProjectionGapRefSet` | 记录缺失 change、映射失败或存储不可用。 |
| `fresh_as_of` | `OptionalTimestamp` | 表达可声明的源事实时点。 |
| `revision` | `ProjectionRevision` | 保护并发 apply / rebuild。 |
| `updated_at` | `Timestamp` | 标记最近 projection state 变化。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `fresh` | 已追上当前可知 committed cursor 且无未闭合 gap。 |
| `stale` | 投影落后但仍可带 freshness 提供安全读取。 |
| `rebuilding` | 正从已提交 source 重建，不写回源 truth。 |
| `degraded` | 部分 slice 或 source gap 不可用，必须显式降级。 |
| `unavailable` | 当前无法提供可靠 projection。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply(CommittedHostChangeRef change_ref, CommittedChangeCursor source_cursor, ProjectionRevision expected_revision)` | 在顺序 guard 下推进 projection cursor。 |
| `mark_stale(ProjectionGapRef gap_ref)` | 记录落后或缺口。 |
| `begin_rebuild(ProjectionRevision expected_revision)` | 显式进入重建状态。 |
| `complete_rebuild(CommittedChangeCursor source_cursor, OptionalTimestamp fresh_as_of)` | 在重建来源完整时恢复 fresh。 |
| `mark_degraded(ProjectionGapRefSet gap_refs)` | 表达部分可用而不伪造完整视图。 |
| `mark_unavailable(ProjectionFailureReason reason)` | 阻止不可靠 projection 被当 current truth。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `initialize(HostProjectionScope projection_scope, CommittedChangeCursor initial_cursor)` | 建立 projection progression 起点，不声明已有数据或 rebuild 完成。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 反写 CMP-MS-01~06 truth | rebuild / apply 只能更新派生状态。 |
| 伪造 run_id、report 或 rebuild evidence | 本步只定义 planned object semantics。 |
| 以 event broker offset 定义领域 cursor | exact transport / storage 细节留 03。 |

### 12.5 `HostOutboxRecord`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-07 |
| 对象类型 | outbox record |
| 主要责任 | 将一个 committed host change 与待发布 material 绑定为 local-first、可追踪的传播记录。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `outbox_record_id` | `HostOutboxRecordId` | 本地 outbox 记录身份。 |
| `source_change_ref` | `CommittedHostChangeRef` | 回指已提交源变化。 |
| `material_ref` | `HostFactMaterialRef` | 回指 body-free material。 |
| `publication_key` | `PublicationKey` | 保持同一 source-material 的稳定发布身份。 |
| `target_class` | `PublicationTargetClass` | 表达 Bus / Observability / authorized consumer 类别，不定义 route。 |
| `publication_status` | `HostOutboxStatus` | pending / attempted / submitted / gap / unknown / closed。 |
| `attempt_refs` | `PublicationAttemptRefSet` | 记录本地 publisher attempts。 |
| `gap_refs` | `PublicationGapRefSet` | 记录 route / publisher / contract 缺口。 |
| `created_at` | `Timestamp` | 标记本地记录形成时点。 |
| `updated_at` | `Timestamp` | 标记最近传播状态变化。 |

#### 状态集合

| 状态 | 作用 |
|---|---|
| `pending` | committed change 与 material 已绑定，等待本地 publisher。 |
| `attempted` | 已进行本地发布尝试，不声明对端接受。 |
| `submitted` | publisher 边界返回允许的本地提交结果；不等于 Bus delivered。 |
| `gap` | route、contract、publisher 或目标不可用。 |
| `unknown` | 提交效果无法判定，保持 stable publication key。 |
| `closed` | 本地 policy 已结束推进；外部 outcome 由 handoff record 分层保存。 |

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `record_attempt(PublicationAttemptRef attempt_ref, PublicationKey publication_key)` | 追加本地 publisher attempt。 |
| `mark_submitted(SafePublicationSubmissionSummary submission_summary)` | 记录 publisher 边界允许摘要，不升级为 delivered。 |
| `record_gap(PublicationGapRef gap_ref)` | 保存未闭合 route / contract / target 缺口。 |
| `mark_unknown(PublicationUncertainty uncertainty)` | 防止使用新 key 盲重发不可判定提交。 |
| `close(PublicationClosureReason reason)` | 显式结束本地 outbox progression。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `enqueue(CommittedHostChangeRef source_change_ref, HostFactMaterialRef material_ref, PublicationKey publication_key, PublicationTargetClass target_class)` | 基于已提交 source-material 对建立 pending outbox record。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把 submitted 写成 delivered / observed / accepted | 外部 outcome 只进入 `HostHandoffRecord` 安全摘要。 |
| 因 publisher 失败回滚 source change | outbox 失败只形成 gap / unknown。 |
| 固定 Bus route / envelope / DLQ schema | `MSVC-UP-007` 未闭口，exact contract 留后续。 |

### 12.6 `HostHistoryEntry`

#### 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | CMP-MS-07 |
| 对象类型 | append-only history record |
| 主要责任 | 为 intent 到 handoff 的已提交变化提供统一、body-free、可排序和可回链的历史索引。 |

#### 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `history_entry_id` | `HostHistoryEntryId` | 不可变历史条目身份。 |
| `change_ref` | `CommittedHostChangeRef` | 回指唯一源变化。 |
| `change_category` | `HostHistoryChangeCategory` | 区分 intent / decision / host / assembly / registration / health / closure / handoff。 |
| `project_member_ref` | `ProjectMemberRef` | 提供项目型主语索引。 |
| `global_member_ref` | `GlobalMemberRef` | 提供身份锚索引。 |
| `host_ref` | `OptionalHostRef` | 按需关联逻辑 host。 |
| `generation` | `OptionalHostGeneration` | 按需关联实例世代。 |
| `prior_fact_ref` | `OptionalHostFactRef` | 建立 supersede / replace / prior 关系。 |
| `decision_ref` | `OptionalHostDecisionRef` | 回指触发变化的正式本地决定。 |
| `source_ref` | `FormalChangeSourceRef` | 回指 actor / command / consumer / job 语境，不保存正文。 |
| `safe_summary` | `BodyFreeHistorySummary` | 保存最小可诊断摘要。 |
| `correlation_id` | `CorrelationId` | 贯穿跨对象变化链。 |
| `occurred_at` | `Timestamp` | 表达源变化发生时点。 |
| `recorded_at` | `Timestamp` | 表达历史条目本地提交时点。 |

本对象 append-only 且无可变生命周期状态；纠正通过新 entry 和 prior / replacement ref 表达，禁止原地覆盖。

#### 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `references(HostFactRef fact_ref)` | 判断条目是否回链指定本地 fact。 |
| `follows(OptionalHostFactRef prior_fact_ref)` | 验证 history 链关系。 |
| `belongs_to(ProjectMemberRef project_member_ref, OptionalHostRef host_ref)` | 判断主语 / host 查询归属。 |
| `validate_body_free(ForbiddenBodyClassSet forbidden_body_classes)` | 保证 history 不吸收 external body。 |

#### 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `append(CommittedHostChangeRef change_ref, HostHistoryChangeCategory change_category, ProjectMemberRef project_member_ref, GlobalMemberRef global_member_ref, OptionalHostRef host_ref, OptionalHostGeneration generation, OptionalHostFactRef prior_fact_ref, OptionalHostDecisionRef decision_ref, FormalChangeSourceRef source_ref, BodyFreeHistorySummary safe_summary, CorrelationId correlation_id)` | 为一个已提交变化建立 append-only 安全历史索引。 |

#### 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 原地改写或删除历史 | supersede / correction 必须追加新条目。 |
| 保存 log / report / evidence / secret 正文 | history 只保留 ref 和 body-free summary。 |
| 充当 event delivery 或 observability evidence | 条目只证明本地变化被记录。 |

### 12.7 CMP-MS-07 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理 | pass | 6 个冻结候选均独立展开，无新增或合并。 |
| 功能来源 | pass | material / outbox 承接 CAP-MS-25，handoff 承接 CAP-MS-26，view 承接 CAP-MS-27，projection state 承接 CAP-MS-28，history横跨已提交变化。 |
| 消费分层 | pass | source truth、material、outbox、per-target attempt、delivery / observed / accepted summary 与 projection 分离。 |
| 边界 | pass_with_blockers | Bus route / receipt、Observability / consumer outcome 只作 placeholder / safe summary；`MSVC-UP-007` 继续 pending。 |

停审结论：`CMP-MS-07` object formalization completed / pass；允许执行 Step 6 跨对象终审。

## 13. Step 8 / Step 9 对象反查清单

| 后续场景 / 状态轴 | 必须引用的本步对象 | 反查结论 |
|---|---|---|
| 意图受理、冲突与决定写路径 | `HostIntent`、`HostOrchestrationDecision`、`HostControlPolicy`、`HostHistoryEntry`、`HostOutboxRecord` | defined；不得由 handler 临时发明 intent / decision DTO truth。 |
| qualification、assembly 与 readiness 写路径 | `HostQualificationContext`、`HostAssembly`、`HostReadinessDecision`、`RequiredQualificationPolicy`、`HostHistoryEntry` | defined；三轴状态必须分别展示。 |
| host generation 建立与 external action progression | `MemberExecutionHost`、`HostActionAttempt`、`HostExternalAssociation`、`HostGenerationFence`、`HostHistoryEntry` | defined；local attempt 必须先于 external port。 |
| registration / endpoint / Host Session flow | `HostRegistration`、`HostEndpoint`、`HostSession`、`RegistrationSessionPolicy`、`HostHistoryEntry` | defined；活动唯一和 replacement history 必须显式。 |
| signal consumer 与健康处置 flow | `HealthSignalSnapshot`、`HostHealthAssessment`、`HostFailureClassification`、`HostRecoveryDecision`、`HostHistoryEntry` | defined；consumer 不得直接触发 side effect。 |
| closure / cleanup / reconciliation jobs | `HostClosure`、`CleanupAttempt`、`ResidualFinding`、`ReconciliationCase`、`HostHistoryEntry` | defined；job 不得隐式创造 lifecycle decision。 |
| material / publish / feedback / query / projection flow | `HostFactMaterial`、`HostOutboxRecord`、`HostHandoffRecord`、`SafeHostView`、`HostProjectionState`、`HostHistoryEntry` | defined；Query no-write，external outcomes 分层。 |
| Step 9 intent / decision 状态轴 | `HostIntent`、`HostOrchestrationDecision` | defined；acceptance 与 decision record lifecycle 分开。 |
| Step 9 readiness / assembly 状态轴 | `HostQualificationContext`、`HostAssembly`、`HostReadinessDecision` | defined；readiness 不由 registration / health 反推。 |
| Step 9 host / action / association 状态轴 | `MemberExecutionHost`、`HostActionAttempt`、`HostExternalAssociation` | defined；generation 由 `HostGenerationFence` 保护。 |
| Step 9 registration / endpoint / session 状态轴 | `HostRegistration`、`HostEndpoint`、`HostSession` | defined；三条 current pointer 独立但同世代。 |
| Step 9 health / recovery 状态轴 | `HealthSignalSnapshot`、`HostHealthAssessment`、`HostFailureClassification`、`HostRecoveryDecision` | defined；四轴健康位于 assessment 字段。 |
| Step 9 closure / reconciliation 状态轴 | `HostClosure`、`CleanupAttempt`、`ResidualFinding`、`ReconciliationCase` | defined；local completion 不等于 external completion。 |
| Step 9 handoff / projection 状态轴 | `HostHandoffRecord`、`HostProjectionState`、`HostOutboxRecord` | defined；material / view / history 为 immutable record / snapshot，不虚构 lifecycle。 |

## 14. 跨对象 / 跨组成部分一致性审计

| 审计项 | 结论 | 处理 / 证据 |
|---|---|---|
| 对象数量 | pass | CMP-01 3 + CMP-02 4 + CMP-03 4 + CMP-04 4 + CMP-05 4 + CMP-06 4 + CMP-07 6 = 29；与 Step 5 完全一致。 |
| 候选遗漏 / 临时新增 | pass | 29 个候选全部独立成节；新增名称均为字段 value / ref / safe summary 类型，不是新的业务对象。 |
| 对象功能来源 | pass | CAP-MS-01~28 均可回指至少一个 owner object；history / outbox 等支持对象有 committed-change 来源。 |
| 决定重复 | pass | `HostOrchestrationDecision` 拥有 formal intent/control 决定；`HostRecoveryDecision` 拥有 health/failure disposition；两者不合并。 |
| readiness / health 重复 | pass | `HostReadinessDecision` 只判 assembly；`HostHealthAssessment` 只判运行健康四轴。 |
| host / backend 重复 | pass | `MemberExecutionHost` 是逻辑 Host Truth；`HostExternalAssociation` 只保存 backend / binding typed ref。 |
| action / cleanup attempt 重复 | pass | `HostActionAttempt` 推进 host / asset / binding lifecycle；`CleanupAttempt` 只在 closure 下推进 release / cleanup。 |
| outbox / handoff 重复 | pass | outbox 绑定 committed change-material 的本地传播；handoff 是 per-target attempt / gap /反馈分层。 |
| source / projection 写权 | pass | `SafeHostView`、`HostProjectionState` 不反写；`HostFactMaterial`、`HostHistoryEntry` 均从 committed change 形成。 |
| current uniqueness | pass | host 由 generation fence；registration / endpoint / Host Session 由 `RegistrationSessionPolicy` 共同 guard。 |
| 历史连续性 | pass | predecessor、supersedes、replaces、prior 与 immutable generation 均有概要字段；无原地覆盖旧史。 |
| transaction 边界 | pass | 对象骨架支持 local decision / attempt / history / outbox 先提交；未伪造跨 owner transaction。具体 UoW 留 Step 7 / 03。 |
| external outcome 分层 | pass | dispatched / submitted / attempt、delivery、observed、accepted 和 external cleanup summary 均分开；无反向推断。 |
| forbidden body | pass | 所有 external owner 输入只为 typed ref / safe summary / placeholder，material / view / history 有 body-free guard。 |
| pending 保真 | pass_with_blockers | `MSVC-UP-001~008` 均未被 exact 字段 / schema / route / target 补闭；正向 session、assembly、binding、publish 持续 blocked / waiting。 |
| Step 8 / 9 悬空对象 | pass | 预期 write / consumer / job / query 和全部状态轴均能反查本步 29 对象。 |

## 15. 字段与函数深度审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 字段三列与概要类型 | pass | 每个字段均有 `字段 / 类型 / 作用`，未写 Rust / DDL / wire 类型。 |
| 函数 typed parameters | pass | 所有成员 / 工厂函数参数均为 `TypeName param_name`；无裸参数名。 |
| 返回与实现深度 | pass | 未写返回类型、泛型、生命周期、trait、算法、调用链或事务实现。 |
| 状态适用性 | pass | 有生命周期的对象均有状态表；immutable material / view / history 明确说明不设独立状态。 |
| policy / guard 边界 | pass | policy 只保护本地 invariant，不取得 governance / upstream truth。 |
| placeholder 诚实性 | pass | placeholder 类型均明确对应未闭口合同，没有 exact field / protocol 语义。 |

## 16. 正式第 6 章回填草稿

正式 §6 应按本文件结构回填：先放候选池筛选和对象分布索引，再沿 CMP-MS-01~07 保留 29 个对象独立小节。每个对象保留基本信息、关键字段、适用状态、成员 / 工厂函数与禁止事项；停审记录、材料诊断和 Gate 台账不进入正文。正式正文必须保留以下总说明：

1. 概要类型只冻结对象边界，不是 Core schema、wire contract、数据库列或 Rust 完整签名。
2. 带 `Placeholder` 的外部 ref 继续受 `MSVC-UP-001~008` 限制，不证明 positive contract ready。
3. immutable material / view / history 不虚构状态；传播和派生状态由 handoff / outbox / projection state owner 持有。
4. Step 8 / 9 不得发明第 30 个业务对象；若发现缺口必须回开 Step 5 / 6。

## 17. 待确认事项与后续上限

| 事项 | 当前结论 | 后续影响 |
|---|---|---|
| Runtime association / entry | `HostSession` 仅保留 placeholder；positive blocked | Step 7 只定义 host-side port；Step 8 正向 flow 必须标 blocked；Step 9 不得出现 Runtime run state。 |
| Member registration / signal | owner 分工可用，exact input / credential / IPC waiting | Step 7 可定义本地 entry / consumer 骨架，不写 payload schema。 |
| Images / credential / Sandbox / carrier | qualification / association 类别成立，exact contract pending | Step 7 port placeholder；Step 8 required item 不可验证即 blocked。 |
| Core event family / SDK target | 对象语义成立，shared type / event / compile target pending | 本步类型名不等于 Core schema；Step 7 / 12 继续挂起。 |
| 定量 freshness / timeout / backoff | 本步只保留 policy ref | Step 11 只讨论配置影响，具体 key / value 留 04。 |

## 18. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 每部分逐项正式化并停审 | pass | CMP-MS-01~07 均先完整展开对象，再记录独立停审。 |
| 候选池闭合 | pass | 29 / 29 独立对象全部处理，无合并、孤儿或新增业务主语。 |
| 对象字段 / 行为可落码 | pass | identity、owner anchor、状态、关联、时点、generation 与 invariant 行为已到概要骨架深度。 |
| 详细设计边界 | pass | schema、完整签名、UoW、repository trait、算法、DDL 和产品细节均后移。 |
| 跨对象一致性 | pass | 状态轴、决定、attempt、external outcome、projection 和 history 无 owner 冲突。 |
| Step 8 / 9 反查 | pass | 预期 flow / state 引用全部有定义。 |
| 外部 blocker | pass_with_blockers | `MSVC-UP-001~008` 保持 pending / blocked / waiting，未阻塞本地对象结构但阻塞相关 positive path。 |
| 正式文档写入 | pass | 未修改旧正式 02；正式装配仍锁定到 Step 14。 |

```text
step_06_status = completed
step_06_gate = pass
objects_formalized = 29_of_29
component_stop_reviews = 7_of_7
cross_object_audit = pass_with_upstream_blockers
formal_02_write_allowed = false
next_allowed_step = Step 7 interface_skeleton
```
