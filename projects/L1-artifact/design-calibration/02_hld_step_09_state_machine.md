# Step 9. 状态机与状态流转

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 9
> 回填章节: `02-概要设计.md` §9 状态定义与状态流转
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

把 Step 6 已点名对象中的正式状态候选收束成 `L1-artifact` 的概要层状态机,说明状态含义、主迁移方向、禁止迁移和状态传播关系,避免状态机散落在对象轮廓与处理流章节里。后续 `03-详细设计.md` 必须在本步基础上继续展开正式 enum、字段、guard、错误、事务、幂等和测试矩阵。

本步不写状态机代码实现、完整错误码、数据库状态列、UI 展示规则、relay persistence 细节或完整协议 schema。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_06_key_objects.md` 及 6 个对象附录 | 已完成 | 提供状态承载对象、状态候选、成员函数骨架和禁止事项 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供会触发状态变化的 Command、Consumer、Job 骨架 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供关键状态迁移的处理顺序和 no-write 边界 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供 truth ownership、query no-write、consumer 不写核心 truth、job 不修复 truth 等硬约束 |
| `projects/L1-artifact/00-需求文档.md` §10~14 | 当前正式需求基线 | 提供业务规则、数据归属、接口边界和验收否决线 |
| `projects/L1-artifact/01-架构设计.md` §8 / §9 / §10 / §11 / §13 | 当前正式架构基线 | 提供一致性、通信、数据归属、交互方式和外围增强边界 |
| `projects/L1-governance/design-calibration/02_hld_step_09_state_machine.md` | 已读取 | 作为 Step 9 单文件高粒度框架参考 |

---

## 3. SOP 问题回答

### 3.1 本仓有哪些影响主线成立的正式状态?

`L1-artifact` 存在多个并列状态机,而不是一个全局单状态机。当前概要层收稳 8 组正式状态:

1. intake / submission 收束状态。
2. fact / content context 真相成立状态。
3. version / lineage / baseline 受控演化状态。
4. review / responsibility 语境状态。
5. automation candidate boundary 状态。
6. consumable / read surface / backref 消费状态。
7. derived / external reference / mirror refresh / read-model freshness 状态。
8. trace / handoff / reconciliation 交接与运维可见状态。

同时明确:

- `ArtifactFactSummaryView`、`ArtifactVersionSummaryView`、`ArtifactLineageSummaryView`、`ArtifactBaselineSummaryView`、`ArtifactReviewSummaryView` 只承接摘要可读性,当前概要层不为它们单独建立独立 truth 状态机。
- `L1-artifact` 当前概要层没有单独 formalize `ArtifactOutboxRecord`。truth 变化后的对外传播以“已提交 truth 变化触发 relay / event signal”为边界,传播可靠性主要由 `ArtifactTraceRecord`、`ArtifactHandoffRecord` 和受影响 read-model freshness 承接。

### 3.2 每个状态的含义是什么,哪些可以进入正常主线?

正常主线只允许依赖以下状态族:

- `ArtifactIntakeState::Resolved` 与 `ArtifactSubmissionState::Accepted` 可作为 fact / version / lineage / baseline 写路径前置。
- `ArtifactFactState::Established`、`ArtifactContentFactState::Verified` 共同表达“已成立且来源可验证”的核心 truth。
- `ArtifactVersionState::Published` / `Frozen`、`ArtifactLineageState::Established`、`ArtifactBaselineState::Frozen` 才能作为正式消费与交接锚点。
- `ArtifactReviewState::Ready`、`ArtifactResponsibilityAssignmentState::Accepted` 表示审查与责任语境已闭口。
- `AutomationArtifactInputState::Accepted` 只表示自动化线索可以进入正式收束链,不等于已形成事实 truth。
- `ConsumableArtifactReferenceState::Ready`、`ArtifactReadSurfaceState::Ready` 允许正常读取; `Restricted` / `Stale` 只能受限或降级读取。
- `ArtifactDerivedFreshnessState::Fresh`、`ArtifactPreviewState::Ready`、`ArtifactReportState::Ready`、`ArtifactReconciliationState::Clean` 表示派生与报告已追上真相或当前无缺口。
- `ArtifactExternalResolutionState::Resolved`、`ExternalMirrorRefreshState::Resolved` / `Degraded` 表示外部来源已获得可用镜像或可解释降级。
- `ArtifactTraceState::Delivered`、`ArtifactHandoffState::Delivered` 表示外围消费或交接已完成,但不能回推核心 truth 更改。

### 3.3 哪些接口、事件或动作会触发状态迁移?

- Command 触发 intake、fact、version、lineage、baseline、review、responsibility、automation acceptance、consumable reference 和 backref 的核心 truth 迁移。
- Inbound Event Consumer 只触发 `ExternalReferenceResolutionState`、`ExternalMirrorRefreshRecord`、`ArtifactIntakeContext` pending 语义、`ArtifactDerivedViewState` stale 语义和相关 read-model freshness 变化。
- Operations Job 只触发 derived freshness、preview / report / reconciliation 状态、reference refresh、trace / handoff delivery 和 failure / retryable 语义。
- Query 不触发任何持久状态迁移;它只读取当前 truth、derived 和 resolution surface。

### 3.4 哪些迁移明确允许,哪些迁移明确禁止?

允许迁移见 §7,禁止迁移见 §8。概要层只保留主迁移、红线迁移和传播边界;详细设计必须继续补齐:

- 初始态和终态矩阵。
- 可重入迁移和幂等重复。
- expected version、actor、basis 和错误映射。
- relay / handoff retry 细则。

### 3.5 状态变化如何影响 relay、projection、下游感知或只读供给?

- 核心 truth 状态变化必须产生 change record / trace 线索,并使受影响 summary、preview、report、reconciliation 或 read surface 进入 stale / rebuilding / generating / unavailable 语义。
- 外部引用状态变化只能推动 intake pending、content pending check、derived stale、read degraded 和 refresh history,不得直接创建或撤销 `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`。
- handoff / trace / reconciliation 状态变化只影响外围交接、运维可见性和报告解释,不得回写核心 truth。

### 3.6 每个状态属于哪个主要组成部分或关键对象?

状态归属见 §4 和 §10。当前所有状态都能回指 Step 6 已正式定义对象,没有新增未 formalize 的状态承载主语。

---

## 4. 状态机边界总览

| 状态组 | 承载对象 | 主要触发 | 说明 |
|---|---|---|---|
| Intake / submission convergence | `ArtifactIntakeContext`、`ArtifactSubmissionRecord` | `RegisterArtifactIntake`; external context consumers; `AcceptAutomationArtifactInput` | 判断输入是否已收束到允许进入 truth 写路径 |
| Fact / content truth lifecycle | `ArtifactFact`、`ArtifactContentFactContext` | `EstablishArtifactFact`; `ConsumeExternalContentSourceChanged`; `RefreshExternalReferenceStates` | 表达正式事实是否已成立、挂起或关闭,以及内容来源是否可验证 |
| Version / lineage / baseline lifecycle | `ArtifactVersionCandidate`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactBaselineMembership` | `CreateArtifactVersionCandidate`; `PublishArtifactVersion`; `EstablishArtifactLineageLink`; `FreezeArtifactBaseline` | 表达正式版本、正式血缘和正式冻结集合的主线演化 |
| Review / responsibility lifecycle | `ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment` | `OpenArtifactReviewAnchor`; `AssignArtifactResponsibility` | 表达审查是否就绪、责任是否闭口 |
| Automation boundary lifecycle | `AutomationArtifactInput` | `RegisterAutomationArtifactInput`; `AcceptAutomationArtifactInput`; runtime signal consumer | 表达自动化线索只能以候选输入方式进入主线 |
| Consumption / read / backref lifecycle | `ConsumableArtifactReference`、`ArtifactReadSurfaceView`、`ArtifactConsumptionBackref` | `IssueConsumableArtifactReference`; `RecordArtifactConsumptionBackref`; `GetArtifactReadSurface` | 表达可消费读取面、受限读取和消费回指状态 |
| Derived / reference / refresh lifecycle | `ArtifactDerivedViewState`、`ExternalReferenceResolutionState`、`ExternalMirrorRefreshRecord`、`ArtifactPreviewView`、`ArtifactReportView`、`ArtifactReconciliationReport` | 6 个 external consumers; `RebuildArtifactDerivedViews`; `RefreshExternalReferenceStates`; `RunArtifactReconciliation` | 表达派生新鲜度、外部解析状态、刷新结果和报告状态 |
| Trace / handoff lifecycle | `ArtifactTraceRecord`、`ArtifactHandoffRecord` | `RecordArtifactConsumptionBackref`; `PrepareArtifactArchiveHandoff`; `PrepareArtifactObservabilityHandoff`; `PrepareArtifactSyncHandoff` | 表达读取、导出、同步和归档交接是否可追溯、已送达或失败 |

---

## 5. 状态定义表

### 5.1 Intake / Submission 收束状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `ArtifactIntakeState` | `Received` | 输入已接收,但尚未收束到可写主线 | 否 | 只能继续解析来源或等待外部上下文 |
| `ArtifactIntakeState` | `Resolved` | 来源引用、边界判断和最小输入条件已闭口 | 是 | 可进入 fact / version / lineage / baseline 写路径 |
| `ArtifactIntakeState` | `PendingReference` | 外部定义、内容或上下文尚未完成解析 | 否 | 只能等待 consumer / refresh 推动 |
| `ArtifactIntakeState` | `Rejected` | 输入越界、无效或无法解释 | 否,终态 | 不得直接重试进入 truth 写路径 |
| `ArtifactIntakeState` | `Transferred` | 已移交到正式 truth 写路径 | 是,但不再作为当前 intake 工作态 | 用于说明 intake 责任已结束 |
| `ArtifactSubmissionState` | `Received` | 单次提交记录已建立 | 否 | 仅说明一次收束尝试发生 |
| `ArtifactSubmissionState` | `Accepted` | 提交被正式接纳为可继续处理的提交记录 | 是 | 不等于 review 完成,也不等于版本已发布 |
| `ArtifactSubmissionState` | `Rejected` | 该次提交被拒绝 | 否,终态 | 需重提或重建新的 submission |
| `ArtifactSubmissionState` | `Superseded` | 被后续提交替代 | 否,历史态 | 历史可追溯,但不再进入主线 |

### 5.2 Fact / Content 真相状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `ArtifactFactState` | `PendingIntake` | truth 锚点尚未完成正式建立 | 否 | 不能被下游消费或冻结 |
| `ArtifactFactState` | `Established` | 正式制品事实已成立 | 是 | version、review、consumption 都应回指该 truth |
| `ArtifactFactState` | `Suspended` | 因关键来源失效、依据冲突或边界异常被临时挂起 | 受限 | 只能用于解释历史,不能作为正常消费入口 |
| `ArtifactFactState` | `Closed` | 事实主语已结束演化 | 否,终态 | 仍可历史回看,但不继续接收新演化 |
| `ArtifactContentFactState` | `Linked` | 已绑定正式内容来源引用 | 受限 | 可作为建立前置,但未达到最佳可验证状态 |
| `ArtifactContentFactState` | `Verified` | 来源摘要或一致性校验已闭口 | 是 | 与 `ArtifactFact::Established` 共同支撑正常主线 |
| `ArtifactContentFactState` | `PendingCheck` | 来源仍待验证或刷新 | 否 | Query 只能暴露 degraded / pending 语义 |
| `ArtifactContentFactState` | `Unavailable` | 内容引用当前不可达 | 否 | 常与 fact suspend 或 read unavailable 联动 |

### 5.3 Version / Lineage / Baseline 演化状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `ArtifactVersionCandidateState` | `Open` | 候选修订已创建,尚未满足发布条件 | 否 | 不得替代正式版本 |
| `ArtifactVersionCandidateState` | `ReadyToPublish` | 候选修订已满足发布前置 | 是,但只对发布命令可见 | 只能继续进入 publish |
| `ArtifactVersionCandidateState` | `Rejected` | 候选修订被拒绝 | 否,终态 | 不得恢复为 ready |
| `ArtifactVersionCandidateState` | `Superseded` | 候选修订被后续候选替代 | 否,历史态 | 保留候选审计链 |
| `ArtifactVersionState` | `Candidate` | 由 `ArtifactVersionCandidate` 物化出的待发布版本骨架 | 否 | 只在正式 publish 事务附近出现,不替代候选对象 |
| `ArtifactVersionState` | `Published` | 正式版本已成立 | 是 | 可用于 lineage、baseline、consumption 和 handoff |
| `ArtifactVersionState` | `Frozen` | 已进入正式 baseline 冻结语境 | 是 | 仍是正式版本,但附带受控冻结含义 |
| `ArtifactVersionState` | `Superseded` | 已被后续版本替代 | 是,但只作历史消费或追溯 | 不再是默认 current 语义 |
| `ArtifactVersionState` | `Retired` | 不再允许继续作为当前主链版本消费 | 否,终态 | 仍保留历史回看 |
| `ArtifactLineageState` | `PendingBasis` | 血缘关系线索已提出,但依据未闭口 | 否 | 不得进入正式血缘图 |
| `ArtifactLineageState` | `Established` | 血缘关系已正式成立 | 是 | 可进入 lineage summary、trace 和 report |
| `ArtifactLineageState` | `Rejected` | 血缘关系被拒绝 | 否,终态 | 不得再视为正式关系 |
| `ArtifactLineageState` | `Retired` | 关系退出当前有效视图 | 否,历史态 | 仍保留解释链 |
| `ArtifactBaselineState` | `Candidate` | 候选冻结集合已形成 | 否 | 不得被下游当正式 baseline 消费 |
| `ArtifactBaselineState` | `Frozen` | 正式基线已冻结 | 是 | baseline 消费、handoff 和 archive 只能回指该态 |
| `ArtifactBaselineState` | `Superseded` | 被新基线替代 | 是,但只作历史比较 | 历史基线仍必须可回看 |
| `ArtifactBaselineState` | `Retired` | 退出当前消费主链 | 否,终态 | 不再作为当前正式冻结集合 |
| `ArtifactBaselineMembershipState` | `Selected` | 版本已选入候选基线 | 否 | 冻结前仍可调整 |
| `ArtifactBaselineMembershipState` | `Frozen` | 成员已锁定到正式基线 | 是 | 不允许消费时再漂移为 current version |
| `ArtifactBaselineMembershipState` | `Removed` | 冻结前从候选集合移除 | 否 | 冻结后不得回退到 removed |

### 5.4 Review / Responsibility / Automation 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `ArtifactReviewState` | `Draft` | 审查锚点已建立,但尚未满足正式审查条件 | 否 | 通常还缺责任或依据 |
| `ArtifactReviewState` | `Ready` | 审查锚点已就绪 | 是 | 可进入 baseline freeze、高影响 intake 接受或责任闭口 |
| `ArtifactReviewState` | `PendingResponsibility` | 审查锚点因责任未闭口进入等待 | 否 | 不能直接形成正式审查结果 |
| `ArtifactReviewState` | `Closed` | 审查语境已结束 | 否,终态 | 仍可供历史解释 |
| `ArtifactReviewState` | `Invalid` | 审查锚点失效或不再适用 | 否,终态 | 不得继续分配责任 |
| `ArtifactResponsibilityAssignmentState` | `Pending` | 责任语境已创建,尚未分配 | 否 | 不能解释“谁负责” |
| `ArtifactResponsibilityAssignmentState` | `Assigned` | 已分配负责方 | 是 | 仍需确认是否被接受 |
| `ArtifactResponsibilityAssignmentState` | `Accepted` | 责任承担已被接受 | 是 | 可作为 review ready 的强前置 |
| `ArtifactResponsibilityAssignmentState` | `Released` | 当前责任已释放 | 否,终态 | 不再代表现行责任承担 |
| `ArtifactResponsibilityAssignmentState` | `Invalid` | 责任语境不成立 | 否,终态 | 必须重建新的 assignment |
| `AutomationArtifactInputState` | `Received` | 自动化候选输入已进入本仓边界 | 否 | 不得直接形成 fact / version / lineage |
| `AutomationArtifactInputState` | `Accepted` | 自动化候选可进入正式收束链 | 是,但仅作为候选入口 | 仍需 intake / review / truth 写路径继续承接 |
| `AutomationArtifactInputState` | `PendingReview` | 自动化候选需人工或责任审查 | 否 | 不能跳过 review 直接入主线 |
| `AutomationArtifactInputState` | `Rejected` | 自动化候选被拒绝 | 否,终态 | 不得直接复活 |
| `AutomationArtifactInputState` | `Superseded` | 被新自动化候选替代 | 否,历史态 | 保留来源和审计链 |

### 5.5 Consumption / Read / Backref 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `ConsumableArtifactReferenceState` | `Ready` | 可消费引用可直接指向正式 truth | 是 | 仍需通过 visibility policy |
| `ConsumableArtifactReferenceState` | `Restricted` | truth 存在,但当前不允许直接对外读取 | 受限 | 可返回 restricted surface,不能隐式放行 |
| `ConsumableArtifactReferenceState` | `Stale` | 引用指向的 truth 或其解释材料已过期 | 受限 | 允许 degraded read,但应推动 refresh / re-issue |
| `ConsumableArtifactReferenceState` | `Unavailable` | 当前无法形成可消费输出 | 否 | 不得伪造 fallback 正文 |
| `ArtifactReadSurfaceState` | `Ready` | 读面可直接供给 | 是 | 可伴随 trace 或 backref 要求 |
| `ArtifactReadSurfaceState` | `Restricted` | 读面因可见性或责任约束受限 | 受限 | Query 只返回 restricted,不写任何状态 |
| `ArtifactReadSurfaceState` | `Stale` | 读面因 freshness 或 resolution 过期降级 | 受限 | 只能读当前 stale surface |
| `ArtifactReadSurfaceState` | `Unavailable` | 当前无法构造对外读取面 | 否 | 不得触发 query 内 rebuild |
| `ArtifactConsumptionBackrefState` | `Recorded` | 消费锚点已记录 | 是 | 还需进一步闭合解释链 |
| `ArtifactConsumptionBackrefState` | `Explained` | 已关联 trace 或解释记录 | 是 | 审计链已闭口 |
| `ArtifactConsumptionBackrefState` | `Stale` | 所依赖 truth 或解释材料已过期 | 受限 | 需等待 refresh、retrace 或重新解释 |
| `ArtifactConsumptionBackrefState` | `Retired` | 回指记录退出当前消费链 | 否,历史态 | 仍保留历史痕迹 |

### 5.6 Derived / Reference / Refresh / Report 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `ArtifactDerivedFreshnessState` | `Fresh` | 派生结果已追上当前 truth cursor | 是 | Query 可正常使用 |
| `ArtifactDerivedFreshnessState` | `Stale` | 派生结果落后于 truth 或外部镜像 | 受限 | Query 必须暴露 freshness / degraded |
| `ArtifactDerivedFreshnessState` | `Rebuilding` | 正在由 job 重建 | 受限 | Query 不能顺手 repair |
| `ArtifactDerivedFreshnessState` | `Unavailable` | 派生结果当前不可用 | 否 | 不得伪造只读结果 |
| `ArtifactDerivedFreshnessState` | `Failed` | 最近一次维护失败 | 否 | 需运维可见面显式暴露 |
| `ArtifactExternalResolutionState` | `Pending` | 外部引用等待首次解析或重试 | 否 | 只能阻塞或降级依赖它的路径 |
| `ArtifactExternalResolutionState` | `Resolved` | 已解析到可用 mirror / snapshot | 是 | 可供 intake、review、consumption、derived 使用 |
| `ArtifactExternalResolutionState` | `Stale` | 既有 mirror 已过期 | 受限 | 可用旧快照解释,但必须显式 stale |
| `ArtifactExternalResolutionState` | `Unresolved` | 当前无法形成可用解析结果 | 否 | 不得补造外部 truth |
| `ArtifactExternalResolutionState` | `Waiting` | 等待外部来源恢复或新事件 | 否 | 常与 pending intake 或 degraded query 联动 |
| `ArtifactExternalResolutionState` | `Failed` | 最近一次刷新失败 | 否 | 失败不回滚核心 truth |
| `ExternalMirrorRefreshState` | `Scheduled` | 已计划执行 mirror refresh | 否 | 只是运维入口态 |
| `ExternalMirrorRefreshState` | `Resolved` | 刷新成功并捕获来源版本 | 是 | 对应 resolution 往往推进到 resolved |
| `ExternalMirrorRefreshState` | `Degraded` | 仅形成降级镜像或部分解释结果 | 受限 | 允许 degraded query,不得冒充 fully resolved |
| `ExternalMirrorRefreshState` | `Failed` | 刷新失败 | 否 | 必须留在 job / refresh 报告里 |
| `ExternalMirrorRefreshState` | `Stale` | 既有刷新结果已过期 | 受限 | 需重新刷新 |
| `ArtifactPreviewState` | `Ready` | preview 可直接读取 | 是 | 受 `ArtifactDerivedFreshnessState` 支撑 |
| `ArtifactPreviewState` | `Stale` | preview 已过期 | 受限 | 允许在 policy 允许时降级展示 |
| `ArtifactPreviewState` | `Rebuilding` | preview 重建中 | 受限 | 不得同步 repair |
| `ArtifactPreviewState` | `Unavailable` | preview 当前不可用 | 否 | truth 仍可能正常存在 |
| `ArtifactReportState` | `Ready` | report 已生成并对齐 truth cursor | 是 | 仅表示报告可读 |
| `ArtifactReportState` | `Stale` | report 已落后 | 受限 | 不能作为最新 truth 解释 |
| `ArtifactReportState` | `Generating` | report 正在生成 | 受限 | Query 只读返回 generating surface |
| `ArtifactReportState` | `Unavailable` | report 不可用 | 否 | 不得解释成核心 truth 失败 |
| `ArtifactReconciliationState` | `Clean` | 当前未发现对账缺口 | 是 | 仅代表该 scope 下当前 clean |
| `ArtifactReconciliationState` | `GapDetected` | 已发现 truth / mirror / report / handoff 缺口 | 是,但表示受控告警 | 不能自动修复主线 truth |
| `ArtifactReconciliationState` | `Stale` | 既有对账报告已过期 | 受限 | 需要重跑对账 |
| `ArtifactReconciliationState` | `Failed` | 对账任务失败 | 否 | 失败不能推定 truth 本身错误 |

### 5.7 Trace / Handoff 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|---|
| `ArtifactTraceState` | `Recorded` | 消费、导出或交接追溯链已记录 | 是 | 还未说明是否真正送达目标 |
| `ArtifactTraceState` | `Delivered` | 追溯对应的外围动作已送达 | 是 | 只代表外围动作成功 |
| `ArtifactTraceState` | `Failed` | 对应外围动作失败 | 受限 | 不能回推核心 truth 失败 |
| `ArtifactTraceState` | `Retryable` | 对应外围动作失败但允许重试 | 受限 | 需留在运维可见面 |
| `ArtifactTraceState` | `Retired` | 追溯记录退出当前活动链 | 否,历史态 | 保留历史说明能力 |
| `ArtifactHandoffState` | `Pending` | 交接目标已确定,材料尚未准备 | 否 | 只是待处理状态 |
| `ArtifactHandoffState` | `Prepared` | 交接材料已就绪 | 是 | 允许进入 deliver 尝试 |
| `ArtifactHandoffState` | `Delivered` | 交接已送达 | 是 | 不回写核心 truth |
| `ArtifactHandoffState` | `Failed` | 交接失败 | 受限 | 需显式暴露失败 |
| `ArtifactHandoffState` | `Retryable` | 交接失败但允许重试 | 受限 | 不能 silently drop |
| `ArtifactHandoffState` | `Cancelled` | 交接任务被取消 | 否,终态 | 需重新创建新的 handoff 记录 |

---

## 6. 状态流转图

### 6.1 Intake / Submission / Fact / Content

```text
+====================================================================+
|           Intake / Submission / Fact / Content State Flow          |
+====================================================================+
| ArtifactIntakeContext                                              |
|   Received ---- resolve_source ----> Resolved ---- transfer ----> Transferred |
|      | mark_pending_reference          ^                            |
|      v                                 | refresh / consumer         |
|   PendingReference --------------------+                            |
|      | reject                                                       |
|      v                                                              |
|   Rejected                                                          |
|                                                                    |
| ArtifactSubmissionRecord                                            |
|   Received ---- accept ----> Accepted                               |
|      | reject                   | supersede                         |
|      v                          v                                   |
|   Rejected                   Superseded                             |
|                                                                    |
| ArtifactContentFactContext                                          |
|   Linked ---- verify_source ----> Verified                          |
|      | mark_pending_check          ^                                |
|      v                             | refresh / verify              |
|   PendingCheck --------------------+                                |
|      | mark_unavailable                                             |
|      v                                                              |
|   Unavailable                                                       |
|                                                                    |
| ArtifactFact                                                        |
|   PendingIntake ---- establish ----> Established ---- suspend ----> Suspended |
|                                                    | close          |
|                                                    v                |
|                                                  Closed             |
+====================================================================+
```

关键说明:

- `ArtifactIntakeState::Transferred` 表示输入责任已移交 truth 写路径,不等于最终 truth 已发布给下游。
- `ArtifactContentFactState::Verified` 是正常主线最佳状态; `Linked` 仅表示已绑定来源,不保证可验证。
- `ArtifactFactState::Suspended` 与 `ArtifactContentFactState::Unavailable` 常联动出现,但二者仍是不同对象状态。
- Query 只能读取这些状态,不得为了恢复 `PendingReference` 或 `PendingCheck` 触发 refresh。

### 6.2 Version / Lineage / Baseline

```text
+====================================================================+
|              Version / Lineage / Baseline State Flow               |
+====================================================================+
| ArtifactVersionCandidate                                            |
|   Open ---- mark_ready ----> ReadyToPublish                         |
|    | reject                    | supersede_by                       |
|    v                           v                                    |
|   Rejected                  Superseded                              |
|                                                                    |
| ArtifactVersion                                                     |
|   Candidate ---- publish ----> Published ---- freeze_into ----> Frozen |
|                                    | supersede                     | retire |
|                                    v                               v       |
|                                Superseded                       Retired     |
|                                                                    |
| ArtifactLineageLink                                                 |
|   PendingBasis ---- establish ----> Established ---- retire ----> Retired |
|        | reject                                                     |
|        v                                                            |
|     Rejected                                                        |
|                                                                    |
| ArtifactBaseline                                                    |
|   Candidate ---- freeze ----> Frozen ---- supersede ----> Superseded |
|        | retire                               | retire               |
|        v                                      v                     |
|     Retired                                Retired                  |
|                                                                    |
| ArtifactBaselineMembership                                          |
|   Selected ---- freeze_member ----> Frozen                          |
|      | remove                                                       |
|      v                                                              |
|   Removed                                                           |
+====================================================================+
```

关键说明:

- `ArtifactVersionCandidate` 和 `ArtifactVersion::Candidate` 不是重复对象:前者是候选收束语境,后者是 publish 事务附近的正式版本骨架态。
- `ArtifactVersionState::Frozen` 表达“正式版本已进入 baseline 冻结语境”,不会抹去其 published 身份。
- `ArtifactBaselineMembershipState::Frozen` 后禁止再漂移到其他 version,从而守住 baseline formal version only 约束。
- `ArtifactLineageState::Rejected` 是终态;若要重建关系,必须创建新 lineage link。

### 6.3 Review / Responsibility / Automation

```text
+====================================================================+
|            Review / Responsibility / Automation Flow               |
+====================================================================+
| ArtifactReviewAnchor                                                |
|   Draft ---- mark_ready ----> Ready                                 |
|     | wait_responsibility       | close / invalidate                |
|     v                           v                                   |
|   PendingResponsibility ------> Closed / Invalid                    |
|            | responsibility accepted                                |
|            +-----------------------> Ready                          |
|                                                                    |
| ArtifactResponsibilityAssignment                                    |
|   Pending ---- assign ----> Assigned ---- accept ----> Accepted     |
|      | invalidate               | release             | release     |
|      v                          v                    v              |
|   Invalid                    Released             Released          |
|                                                                    |
| AutomationArtifactInput                                             |
|   Received ---- accept ----> Accepted ---- supersede ----> Superseded |
|      | send_to_review             |                                  |
|      v                            |                                  |
|   PendingReview ------------------+                                  |
|      | reject                                                        |
|      v                                                               |
|   Rejected                                                           |
+====================================================================+
```

关键说明:

- `ArtifactReviewState::Ready` 与 `ArtifactResponsibilityAssignmentState::Accepted` 一起提供高影响动作的语境闭口。
- `AutomationArtifactInputState::Accepted` 只允许进入正式收束链,不会直接把自动化结果提升成 fact / version / lineage truth。
- `PendingResponsibility` 和 `PendingReview` 都是明确等待态,不能被下游当作隐式通过。
- review / responsibility / automation 的失败不会直接把核心 truth 回滚为未建立状态。

### 6.4 Consumption / Read / Backref

```text
+====================================================================+
|                Consumption / Read / Backref Flow                   |
+====================================================================+
| ConsumableArtifactReference                                         |
|   Ready ---- restrict ----> Restricted                              |
|    | mark_stale                 ^                                   |
|    v                            | re-issue / refreshed explanation  |
|   Stale ------------------------+                                   |
|    | unavailable                                                    |
|    v                                                                |
|   Unavailable                                                       |
|                                                                    |
| ArtifactReadSurfaceView                                             |
|   Ready ---- restrict ----> Restricted                              |
|    | mark_stale                 ^                                   |
|    v                            | rebuild / re-evaluate visibility  |
|   Stale ------------------------+                                   |
|    | unavailable                                                    |
|    v                                                                |
|   Unavailable                                                       |
|                                                                    |
| ArtifactConsumptionBackref                                          |
|   Recorded ---- mark_explained ----> Explained                      |
|      | mark_stale                    | mark_stale                   |
|      v                               v                              |
|    Stale ------------------------ retire ----------------------> Retired |
+====================================================================+
```

关键说明:

- `ConsumableArtifactReferenceState` 和 `ArtifactReadSurfaceState` 都允许降级读取,但降级不等于可无条件读取。
- `ArtifactReadSurfaceState` 的恢复只能来自新的 visibility / freshness 计算,不能来自 query 内隐式写入。
- `ArtifactConsumptionBackrefState::Explained` 表示消费锚点与 trace 解释链已闭口,不是说外围交付一定成功。
- 受限 / 过期 / 不可用都必须对下游显式暴露,不能被 UI 或 SDK 静默吞掉。

### 6.5 Derived / Reference / Refresh / Reconciliation

```text
+====================================================================+
|           Derived / Reference / Refresh / Report Flow              |
+====================================================================+
| ArtifactDerivedViewState                                            |
|   Fresh ---- mark_stale ----> Stale ---- start_rebuild ----> Rebuilding |
|    ^                            | mark_failed             | mark_rebuilt  |
|    |                            v                         v               |
|    +------------------------- Failed <-------------- Unavailable         |
|                                                                    |
| ExternalReferenceResolutionState                                    |
|   Pending ---- mark_resolved ----> Resolved ---- mark_stale ----> Stale |
|      | mark_unresolved / waiting / failed       | refresh               |
|      v                                          v                       |
|   Unresolved / Waiting / Failed  <----------- Pending                  |
|                                                                    |
| ExternalMirrorRefreshRecord                                          |
|   Scheduled ---- mark_resolved ----> Resolved ---- expire ----> Stale  |
|       | mark_degraded                | degrade                         |
|       | mark_failed                  v                                 |
|       v                           Degraded                             |
|    Failed                                                            |
|                                                                    |
| ArtifactPreview / ArtifactReport / ReconciliationReport              |
|   Ready / Clean ---- stale ----> Stale ---- rebuild / rerun ----> Ready / Clean |
|      | generate / rebuild / fail                                       |
|      v                                                                  |
|   Generating / Rebuilding / Failed / Unavailable                        |
+====================================================================+
```

关键说明:

- `ArtifactDerivedViewState` 是 freshness truth owner; preview / report / reconciliation surface 只显化其结果。
- `ExternalReferenceResolutionState::Resolved` 与 `ExternalMirrorRefreshState::Resolved` 语义相关,但一个表达当前可用性,一个表达单次刷新结果。
- `Degraded` 只在 refresh record 上正式出现,用于说明“得到了可解释但不完整的镜像结果”。
- `ArtifactReconciliationState::GapDetected` 不会自动把核心 truth 改成 failed;它只触发报告和运维可见面。

### 6.6 Trace / Handoff

```text
+====================================================================+
|                     Trace / Handoff State Flow                      |
+====================================================================+
| ArtifactTraceRecord                                                 |
|   Recorded ---- mark_delivered ----> Delivered                      |
|      | mark_failed                     | retire                      |
|      v                                 v                             |
|    Failed ---- mark_retryable ----> Retryable ---- retry ----> Delivered |
|                                                              | retire |
|                                                              v        |
|                                                           Retired     |
|                                                                    |
| ArtifactHandoffRecord                                               |
|   Pending ---- mark_prepared ----> Prepared ---- mark_delivered ----> Delivered |
|      | cancel                        | mark_failed                    |
|      v                               v                                |
|   Cancelled                      Failed ---- mark_retryable ----> Retryable |
|                                                              | retry  |
|                                                              v        |
|                                                           Prepared    |
+====================================================================+
```

关键说明:

- `ArtifactTraceState::Delivered` 和 `ArtifactHandoffState::Delivered` 都只说明外围动作完成,不能回推核心 truth 发生新的业务迁移。
- `Retryable` 必须保留在运维可见面,不能被当作“稍后自动会好”而省略。
- handoff cancel / fail / retry 不改变 `ArtifactFact`、`ArtifactVersion` 或 `ArtifactBaseline` 的核心状态。
- archive / observability / sync 三类 handoff 共用同一状态骨架,差异留给详细设计闭口。

---

## 7. 允许迁移清单

### 7.1 Intake / Fact 主线

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `ArtifactIntakeContext` | `Received -> Resolved` | `resolve_source` |
| `ArtifactIntakeContext` | `Received / Resolved -> PendingReference` | `mark_pending_reference` |
| `ArtifactIntakeContext` | `PendingReference -> Resolved` | refresh / consumer 闭口引用 |
| `ArtifactIntakeContext` | `Resolved -> Transferred` | `transfer_to_truth_write` |
| `ArtifactIntakeContext` | `Received / PendingReference / Resolved -> Rejected` | `reject` |
| `ArtifactSubmissionRecord` | `Received -> Accepted` | `accept` |
| `ArtifactSubmissionRecord` | `Received -> Rejected` | `reject` |
| `ArtifactSubmissionRecord` | `Received / Accepted -> Superseded` | `supersede` |
| `ArtifactContentFactContext` | `Linked -> Verified` | `verify_source` |
| `ArtifactContentFactContext` | `Linked / Verified -> PendingCheck` | `mark_pending_check` |
| `ArtifactContentFactContext` | `PendingCheck -> Verified` | verify after refresh |
| `ArtifactContentFactContext` | `Linked / Verified / PendingCheck -> Unavailable` | `mark_unavailable` |
| `ArtifactFact` | `PendingIntake -> Established` | `establish` |
| `ArtifactFact` | `Established -> Suspended` | `suspend` |
| `ArtifactFact` | `Established / Suspended -> Closed` | `close` |

### 7.2 Version / Lineage / Baseline 主线

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `ArtifactVersionCandidate` | `Open -> ReadyToPublish` | `mark_ready` |
| `ArtifactVersionCandidate` | `Open / ReadyToPublish -> Rejected` | `reject` |
| `ArtifactVersionCandidate` | `Open / ReadyToPublish -> Superseded` | `supersede_by` |
| `ArtifactVersion` | `Candidate -> Published` | `publish` |
| `ArtifactVersion` | `Published -> Frozen` | `freeze_into` |
| `ArtifactVersion` | `Published / Frozen -> Superseded` | `supersede` |
| `ArtifactVersion` | `Published / Frozen / Superseded -> Retired` | `retire` |
| `ArtifactLineageLink` | `PendingBasis -> Established` | `establish` |
| `ArtifactLineageLink` | `PendingBasis -> Rejected` | `reject` |
| `ArtifactLineageLink` | `Established -> Retired` | `retire` |
| `ArtifactBaseline` | `Candidate -> Frozen` | `freeze` |
| `ArtifactBaseline` | `Frozen -> Superseded` | `supersede` |
| `ArtifactBaseline` | `Candidate / Frozen / Superseded -> Retired` | `retire` |
| `ArtifactBaselineMembership` | `Selected -> Frozen` | `freeze_member` |
| `ArtifactBaselineMembership` | `Selected -> Removed` | `remove` |

### 7.3 Review / Automation / Consumption 主线

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `ArtifactReviewAnchor` | `Draft -> Ready` | `mark_ready` |
| `ArtifactReviewAnchor` | `Draft / Ready -> PendingResponsibility` | `wait_responsibility` |
| `ArtifactReviewAnchor` | `PendingResponsibility -> Ready` | responsibility accepted |
| `ArtifactReviewAnchor` | `Ready / PendingResponsibility -> Closed` | `close` |
| `ArtifactReviewAnchor` | `Draft / Ready / PendingResponsibility -> Invalid` | `invalidate` |
| `ArtifactResponsibilityAssignment` | `Pending -> Assigned` | `assign` |
| `ArtifactResponsibilityAssignment` | `Assigned -> Accepted` | `accept` |
| `ArtifactResponsibilityAssignment` | `Assigned / Accepted -> Released` | `release` |
| `ArtifactResponsibilityAssignment` | `Pending / Assigned / Accepted -> Invalid` | `invalidate` |
| `AutomationArtifactInput` | `Received -> Accepted` | `accept` |
| `AutomationArtifactInput` | `Received -> PendingReview` | `send_to_review` |
| `AutomationArtifactInput` | `PendingReview -> Accepted / Rejected` | review outcome |
| `AutomationArtifactInput` | `Received / Accepted / PendingReview -> Superseded` | `supersede` |
| `ConsumableArtifactReference` | `Ready -> Restricted` | `restrict` |
| `ConsumableArtifactReference` | `Ready / Restricted -> Stale` | `mark_stale` |
| `ConsumableArtifactReference` | `Ready / Restricted / Stale -> Unavailable` | explicit unavailable handling |
| `ArtifactReadSurfaceView` | `Ready -> Restricted / Stale / Unavailable` | visibility / freshness / source degradation |
| `ArtifactReadSurfaceView` | `Restricted / Stale -> Ready` | rebuild or re-evaluate visibility |
| `ArtifactConsumptionBackref` | `Recorded -> Explained` | `mark_explained` |
| `ArtifactConsumptionBackref` | `Recorded / Explained -> Stale` | `mark_stale` |
| `ArtifactConsumptionBackref` | `Recorded / Explained / Stale -> Retired` | `retire` |

### 7.4 Derived / Reference / Trace / Handoff 主线

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `ArtifactDerivedViewState` | `Fresh -> Stale` | `mark_stale` |
| `ArtifactDerivedViewState` | `Stale -> Rebuilding` | `start_rebuild` |
| `ArtifactDerivedViewState` | `Rebuilding -> Fresh` | `mark_rebuilt` |
| `ArtifactDerivedViewState` | `Stale / Rebuilding -> Failed` | `mark_failed` |
| `ArtifactDerivedViewState` | `Fresh / Stale / Rebuilding -> Unavailable` | explicit unavailable handling |
| `ExternalReferenceResolutionState` | `Pending -> Resolved / Unresolved / Waiting / Failed` | refresh / consumer result |
| `ExternalReferenceResolutionState` | `Resolved -> Stale` | `mark_stale` |
| `ExternalReferenceResolutionState` | `Stale / Unresolved / Waiting / Failed -> Pending` | schedule retry / refresh |
| `ExternalReferenceResolutionState` | `Stale / Pending -> Resolved` | `mark_resolved` |
| `ExternalMirrorRefreshRecord` | `Scheduled -> Resolved / Degraded / Failed` | refresh outcome |
| `ExternalMirrorRefreshRecord` | `Resolved / Degraded -> Stale` | expire / stale |
| `ArtifactPreviewView` | `Ready -> Stale / Rebuilding / Unavailable` | stale / rebuild / unavailable |
| `ArtifactPreviewView` | `Stale / Rebuilding -> Ready` | rebuild success |
| `ArtifactReportView` | `Ready -> Stale / Generating / Unavailable` | stale / generation / unavailable |
| `ArtifactReportView` | `Stale / Generating -> Ready` | regeneration success |
| `ArtifactReconciliationReport` | `Clean -> GapDetected / Stale / Failed` | reconcile result or expiry |
| `ArtifactReconciliationReport` | `GapDetected / Stale / Failed -> Clean` | rerun reconcile with no gaps |
| `ArtifactTraceRecord` | `Recorded -> Delivered / Failed` | delivery outcome |
| `ArtifactTraceRecord` | `Failed -> Retryable` | `mark_retryable` |
| `ArtifactTraceRecord` | `Retryable -> Delivered` | retry success |
| `ArtifactTraceRecord` | `Delivered / Retryable -> Retired` | retire trace |
| `ArtifactHandoffRecord` | `Pending -> Prepared` | `mark_prepared` |
| `ArtifactHandoffRecord` | `Prepared -> Delivered / Failed` | delivery outcome |
| `ArtifactHandoffRecord` | `Failed -> Retryable` | `mark_retryable` |
| `ArtifactHandoffRecord` | `Retryable -> Prepared` | retry prepare |
| `ArtifactHandoffRecord` | `Pending / Prepared -> Cancelled` | cancel handoff |

---

## 8. 禁止迁移清单

| 对象 | 禁止迁移 | 原因 |
|---|---|---|
| Query path | `* -> *` 任意持久状态迁移 | Query 必须保持只读 |
| 任意 Consumer | `ArtifactFact / ArtifactVersion / ArtifactLineageLink / ArtifactBaseline / ArtifactReviewAnchor / ArtifactResponsibilityAssignment` 的核心 truth 迁移 | Consumer 只能写 reference、resolution、pending 或 stale |
| 任意 Job | `ArtifactFact / ArtifactVersion / ArtifactLineageLink / ArtifactBaseline` 的核心 truth 修复性迁移 | Job 不得修复核心 truth |
| `ArtifactVersionCandidate` | `Rejected -> ReadyToPublish` | 被拒绝候选必须新建新的候选语境 |
| `ArtifactLineageLink` | `Rejected -> Established` | 被拒绝关系不得原地复活 |
| `ArtifactBaselineMembership` | `Frozen -> Removed` | 冻结后的成员不得漂移 |
| `ArtifactBaseline` | `Frozen -> Candidate` | 正式基线不得退回候选 |
| `ArtifactReviewAnchor` | `Closed / Invalid -> Ready` | 已结束或失效的审查锚点不得复用 |
| `ArtifactResponsibilityAssignment` | `Released / Invalid -> Accepted` | 责任释放或失效后必须重建新的 assignment |
| `AutomationArtifactInput` | `Rejected -> Accepted` | 被拒绝自动化输入不得原地转正 |
| `ConsumableArtifactReference` | `Unavailable -> Ready` 的隐式 query 恢复 | 必须通过明确 re-issue / rebuild / refresh 语义恢复 |
| `ArtifactReadSurfaceView` | `Unavailable -> Ready` 的 query 内修复 | read surface 恢复只能来自 job / command / visibility 重新求值 |
| `ArtifactDerivedViewState` | `Failed -> Fresh` 的无 rebuild 恢复 | 必须经过明确 rebuild 成功 |
| `ExternalReferenceResolutionState` | `Unresolved / Failed -> Resolved` 的无 refresh 恢复 | 必须经过 refresh 或 consumer 新结果 |
| `ArtifactTraceRecord` | `Delivered -> Recorded` | 已送达 trace 不得倒退 |
| `ArtifactHandoffRecord` | `Delivered -> Pending / Prepared` | 已送达 handoff 若需再次交接,必须创建新记录 |
| `ArtifactReconciliationReport` | `GapDetected -> Clean` 的无 rerun 恢复 | 必须重跑对账并基于新 source cursor 证明 clean |

---

## 9. 状态传播关系

### 9.1 状态传播总图

```text
+====================================================================+
|                   Artifact State Propagation                       |
+====================================================================+
| Core truth transition                                               |
|   ArtifactFact / Version / Lineage / Baseline / Review change      |
|      |                                                             |
|      +--> change record / review trace / submission audit          |
|      +--> committed relay trigger / outbound truth change signal   |
|      +--> affected summary / read surface / preview / report stale |
|      +--> affected backref / handoff / trace explanation recheck   |
|                                                                    |
| External reference transition                                       |
|   Resolution pending / stale / resolved / failed                   |
|      |                                                             |
|      +--> intake pending / content pending check                   |
|      +--> derived freshness stale                                  |
|      +--> read degraded / unavailable                              |
|      +--> refresh report / mirror history                          |
|                                                                    |
| Job / handoff transition                                            |
|   rebuild / reconcile / handoff prepare / deliver                  |
|      |                                                             |
|      +--> preview / report / reconciliation surface                |
|      +--> trace / handoff state                                    |
|      +--> operations visibility                                    |
|      +--> no core truth rewrite                                    |
+====================================================================+
```

关键说明:

- 核心 truth 状态变化一定会影响只读供给和解释链,但不会因为 relay / handoff 成败而被回滚。
- 外部引用状态变化只能向 intake、content check、derived freshness 和 read surface 传播,不会越界塑造核心 truth。
- `L1-artifact` 当前概要层没有单独 `Outbox` 对象,因此传播边界用 committed relay trigger / outbound truth change signal 表达。
- Query 只能读取传播后的 surface,不能为了“看起来更新”触发 refresh、rebuild 或 backref write。

### 9.2 状态变化对下游的影响

| 来源状态变化 | 必须传播到 | 不允许传播到 |
|---|---|---|
| `ArtifactIntakeState` / `ArtifactSubmissionState` 变化 | submission / resolution audit、trace 解释、待处理视图 | 已建立 fact truth |
| `ArtifactFactState` / `ArtifactContentFactState` 变化 | fact change record、summary stale、read surface degraded、relay trigger | 下游副本 truth |
| `ArtifactVersionState` 变化 | version change record、lineage / baseline / preview / report stale、relay trigger | current latest 隐式覆盖 |
| `ArtifactLineageState` 变化 | lineage summary stale、traceability explanation、report stale | runtime / tool truth |
| `ArtifactBaselineState` / membership 变化 | baseline summary stale、archive / sync handoff target re-evaluate、relay trigger | 动态 current version 解析 |
| `ArtifactReviewState` / responsibility 变化 | review summary stale、high-impact command guard、trace explanation | identity / governance truth |
| `AutomationArtifactInputState` 变化 | automation audit、pending review queue、intake convergence | fact / version 直接成立 |
| `ConsumableArtifactReferenceState` / `ArtifactReadSurfaceState` 变化 | SDK / console / sync 读取感知、trace / backref requirement | 核心 truth |
| `ArtifactDerivedFreshnessState` / preview / report / reconciliation 变化 | query freshness、operations report、workspace / console degraded surface | fact / version / baseline truth |
| `ArtifactExternalResolutionState` / refresh state 变化 | intake pending、content pending check、derived stale、read degraded | 外部来源 truth |
| `ArtifactTraceState` / `ArtifactHandoffState` 变化 | archive / observability / sync 交付可见面、operations report | 核心 truth state |

---

## 10. 处理流与状态机对应关系

| Step 8 处理流族 | 主要状态机 | 输出状态影响 |
|---|---|---|
| `RegisterArtifactIntake` flow | `ArtifactIntakeState`、`ArtifactSubmissionState`、`ArtifactExternalResolutionState` | intake resolved / pending / rejected, submission accepted / superseded |
| `EstablishArtifactFact` flow | `ArtifactFactState`、`ArtifactContentFactState` | fact established / suspended / closed, content linked / verified / unavailable |
| `PublishArtifactVersion` flow | `ArtifactVersionCandidateState`、`ArtifactVersionState` | candidate ready / rejected / superseded, version published / frozen / superseded |
| `EstablishArtifactLineageLink` flow | `ArtifactLineageState` | lineage pending basis / established / rejected |
| `FreezeArtifactBaseline` flow | `ArtifactBaselineState`、`ArtifactBaselineMembershipState`、`ArtifactReviewState` | baseline frozen / superseded, membership frozen, review ready precondition |
| `GetArtifactReadSurface` flow | `ConsumableArtifactReferenceState`、`ArtifactReadSurfaceState`、`ArtifactDerivedFreshnessState`、`ArtifactExternalResolutionState` | ready / restricted / stale / unavailable read surface |
| 6 个 state-writing consumers | `ArtifactExternalResolutionState`、`ExternalMirrorRefreshState`、`ArtifactIntakeState`、`ArtifactDerivedFreshnessState` | resolution pending / resolved / stale / failed, intake pending, derived stale |
| `RebuildArtifactDerivedViews` | `ArtifactDerivedFreshnessState`、`ArtifactPreviewState`、`ArtifactReportState` | fresh / rebuilding / failed preview / report |
| `RefreshExternalReferenceStates` | `ArtifactExternalResolutionState`、`ExternalMirrorRefreshState`、`ArtifactContentFactState` | resolved / degraded / failed refresh and downstream pending check |
| `RunArtifactReconciliation` | `ArtifactReconciliationState`、`ArtifactDerivedFreshnessState` | clean / gap / stale / failed reconciliation report |
| `PrepareArtifactArchiveHandoff` / `PrepareArtifactObservabilityHandoff` / `PrepareArtifactSyncHandoff` | `ArtifactTraceState`、`ArtifactHandoffState` | prepared / delivered / failed / retryable handoff and trace |

---

## 11. 按主要组成部分组织的状态归属表

| 主要组成部分 | 状态承载对象 | 核心状态集合 |
|---|---|---|
| `Artifact fact management` | `ArtifactFact`、`ArtifactContentFactContext` | `PendingIntake / Established / Suspended / Closed`; `Linked / Verified / PendingCheck / Unavailable` |
| `Artifact version management` | `ArtifactVersionCandidate`、`ArtifactVersion` | `Open / ReadyToPublish / Rejected / Superseded`; `Candidate / Published / Frozen / Superseded / Retired` |
| `Artifact lineage management` | `ArtifactLineageLink` | `PendingBasis / Established / Rejected / Retired` |
| `Artifact baseline management` | `ArtifactBaseline`、`ArtifactBaselineMembership` | `Candidate / Frozen / Superseded / Retired`; `Selected / Frozen / Removed` |
| `Artifact intake convergence` | `ArtifactIntakeContext`、`ArtifactSubmissionRecord` | `Received / Resolved / PendingReference / Rejected / Transferred`; `Received / Accepted / Rejected / Superseded` |
| `Artifact review and responsibility context` | `ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment` | `Draft / Ready / PendingResponsibility / Closed / Invalid`; `Pending / Assigned / Accepted / Released / Invalid` |
| `Automation output control boundary` | `AutomationArtifactInput` | `Received / Accepted / PendingReview / Rejected / Superseded` |
| `Artifact consumption and traceability` | `ConsumableArtifactReference`、`ArtifactReadSurfaceView`、`ArtifactConsumptionBackref`、`ArtifactTraceRecord` | `Ready / Restricted / Stale / Unavailable`; `Ready / Restricted / Stale / Unavailable`; `Recorded / Explained / Stale / Retired`; `Recorded / Delivered / Failed / Retryable / Retired` |
| `Derived maintenance and handoff preparation` | `ArtifactDerivedViewState`、`ArtifactPreviewView`、`ArtifactReportView`、`ArtifactReconciliationReport`、`ArtifactHandoffRecord` | `Fresh / Stale / Rebuilding / Unavailable / Failed`; `Ready / Stale / Rebuilding / Unavailable`; `Ready / Stale / Generating / Unavailable`; `Clean / GapDetected / Stale / Failed`; `Pending / Prepared / Delivered / Failed / Retryable / Cancelled` |
| `External reference and local mirror support` | `ExternalReferenceResolutionState`、`ExternalMirrorRefreshRecord` | `Pending / Resolved / Stale / Unresolved / Waiting / Failed`; `Scheduled / Resolved / Degraded / Failed / Stale` |

---

## 12. 状态归属停审记录

| 主要组成部分 | 停审结果 | 说明 |
|---|---|---|
| `Artifact fact management` | pass | fact 与 content context 状态已明确分离,且都能回指 Step 8 write / refresh 流 |
| `Artifact version management` | pass | candidate 与 formal version 双状态机已区分,未混成单一 latest 语义 |
| `Artifact lineage management` | pass | relation pending / established / rejected / retired 已明确 |
| `Artifact baseline management` | pass | baseline 与 membership 状态都已显式收稳,冻结后不漂移 |
| `Artifact intake convergence` | pass | intake / submission 收束状态已覆盖人工、外部和自动化前置 |
| `Artifact review and responsibility context` | pass | review 和 responsibility 状态前置关系已明确 |
| `Automation output control boundary` | pass | 自动化输入只作为候选入口的状态边界已锁定 |
| `Artifact consumption and traceability` | pass | consumable / read / backref / trace 四层状态已拆开表达 |
| `Derived maintenance and handoff preparation` | pass | freshness、preview / report / reconciliation 与 handoff 已分层 |
| `External reference and local mirror support` | pass | resolution state 与 refresh history 已明确不是核心 truth |

---

## 13. 跨状态一致性审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| Step 8 点名处理流是否都能回指 Step 9 状态机 | pass | 所有关键 command / consumer / job 都已映射到对应状态组 |
| Step 9 状态承载对象是否都来自 Step 6 | pass | 未引入新的未 formalize 状态对象 |
| 是否出现 consumer 直接驱动核心 truth 状态 | pass | consumer 只影响 resolution / pending / stale / refresh |
| 是否出现 job 修复核心 truth 状态 | pass | job 只影响 freshness、report、reconcile、trace 和 handoff |
| 是否把 relay / outbox 成功当作核心 truth 成功 | pass | 已明确外围传播成功与核心 truth 成立分离 |
| 是否把 summary / preview / report 误当成 truth owner | pass | summary / surface 状态只读,truth owner 仍是核心对象或 derived state |
| 是否存在同名 / 近义状态语义冲突 | pass | version candidate 与 version candidate state 已专门解释; stale / unavailable 按对象角色区分 |
| 是否下沉到完整枚举、错误码、数据库列或实现脚本 | pass | 当前只停在概要层状态骨架 |

---

## 14. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 历史 `02-概要设计.md` | 容易只把“已发布 / 已归档 / 可查询”写成松散业务词,没有正式状态承载对象 | 改为按 Step 6 正式对象逐组收稳状态机 |
| 旧功能描述方式 | 容易把 current latest、preview、archive package 当成同一层状态 | 拆开 core truth、derived、consumption 和 handoff 状态 |
| Step 8 relay 描述 | 容易误解为必须先 formalize 独立 outbox 对象 | 明确当前概要层无独立 outbox object,传播由 trace / handoff / relay trigger 表达 |
| 自动化与外部输入 | 容易把 runtime / external source 结果直接推进主线 truth | 明确 automation 与 external resolution 只能进入候选 / pending / stale / degraded 语义 |

---

## 15. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 状态机粒度 | 主要散落在对象说明与流程里 | 按 8 组正式状态机单独收稳 |
| 核心 truth 与派生 / 交接 | 容易混在“artifact 状态”里 | 明确拆为 truth、derived、reference、consumption、trace、handoff |
| 外部引用影响 | 只知道会 stale / degraded | 明确 resolution、refresh、content check、intake pending 的传播链 |
| read / backref / trace 关系 | 容易只写“可追溯” | 拆成 consumable、read surface、backref、trace 四层状态 |
| relay / outbox 理解 | 容易想当然补独立 outbox 对象 | 明确当前只 formalize relay trigger,不新增未定义对象 |

---

## 16. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否建立单一 `ArtifactLifecycleState` | 不建立 | truth、candidate、derived、reference、handoff 语义差异过大 |
| 是否把 `ArtifactVersionCandidate` 与 `ArtifactVersion::Candidate` 合并 | 不合并 | 一个是候选语境,一个是 formal version 物化骨架态 |
| 是否为 summary views 单独 formalize 状态机 | 当前不单独 formalize | 当前概要层只需保留 read surface、preview、report、reconciliation 的可见状态 |
| 是否补一个独立 outbox 状态对象 | 不补 | Step 6 未 formalize 该对象,概要层用 relay trigger / trace / handoff 表达传播边界即可 |
| 是否允许 Query / Consumer / Job 越权恢复核心 truth | 不允许 | 继续承接 Step 3 和 Step 8 的 no-write / no truth repair 红线 |

---

## 17. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §9 引用本文件 §4 的状态机边界总览。
- §9 摘录本文件 §5 的状态定义表,必要时压缩为核心状态组表。
- §9 摘录本文件 §6 的 6 个状态流转图,保留图后关键说明。
- §9 摘录本文件 §7 和 §8 的允许 / 禁止迁移红线。
- §9 引用本文件 §9 的状态传播总图,作为 relay、derived、reference、read surface 和 handoff 的概要边界。
- `03-详细设计.md` 必须基于本文件继续展开正式 enum、guard、error、port、事务、幂等和测试矩阵。

---

## 18. 待确认事项

本步不新增阻塞 Step 10 的待确认事项。详细设计阶段仍需继续闭合:

- `ArtifactFactState::Suspended` 是否支持原地恢复为 `Established`,以及恢复 guard。
- `ConsumableArtifactReferenceState` / `ArtifactReadSurfaceState` 的恢复是“原地恢复”还是“新引用重发”。
- relay trigger 的正式 stored-result / delivery persistence 是否在 `03-详细设计.md` 引入独立对象。
- derived freshness 与 preview / report / reconciliation surface 的 exact affected scope 计算方式。
- handoff / trace 重试策略、receipt surface 和 dead-letter 口径。

这些属于详细设计层继续闭口,不阻塞概要设计进入 Step 10。

---

## 19. 进入下一步条件

- 已明确 `L1-artifact` 存在多个正式状态机,且都能回指 Step 6 对象。
- 已给出状态集合、状态含义和是否可进入正常主线。
- 已用 `text` 图说明核心状态流转和状态传播关系。
- 已给出允许迁移和禁止迁移清单。
- 已明确 Query、Consumer、Job 对状态的影响边界。
- 未写入状态机代码实现、完整错误码、数据库列、UI 规则或完整 DTO schema。
- 可以进入 Step 10 `异常与边界场景轮廓`。
