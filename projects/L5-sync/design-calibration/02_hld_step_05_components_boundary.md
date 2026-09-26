# Step 5. 主要组成部分、职责与边界

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；Step 1~4 已通过。
- `gate_status=pass_with_upstream_blockers`；五部分小循环与跨部分审计已完成，`SYNC-UP-001~010` 保持开放。
- `formal_fill_allowed=step14_only`；本步只形成对象候选池，不展开字段、状态、成员/工厂函数。

### Step 内计划

1. 回读 Step 4 主体映射、Step 3 约束和正式 01 五部分。
2. 先形成五部分总表、总 capability 分布、对象发现维度与交互总图。
3. 严格依次完成五个部分的职责、capability、代码主体、对象线索、非职责、接缝和停审。
4. 完成跨部分对象重复、职责重叠、接缝冲突、候选遗漏与后续位置审计。
5. 形成正式 §5 回填草稿并更新 flow/台账。

## 2. 本步输入

| 输入 | 采用内容 |
|---|---|
| Step 4 §7 | 五部分到 application/domain/ports/adapters 的代码主体框架 |
| Step 3 §7 | 各部分必须遵守的 hard constraints |
| 正式 00 `CP-SYNC-01~06` / `FR-SYNC-001~012` | 核心 capability 与失败姿态 |
| 正式 01 §6、§8~10、§13 | 五部分职责、依赖、local truth、一致性与通信边界 |
| 概要 SOP/规范 Step/§5 | capability-first、对象发现、逐部分停审与跨部分审计格式 |

## 3. SOP 问题回答

1. **主要组成部分是什么？** 沿用正式 01 的五部分，不增删：Selection & Access、Working Copy & Metadata、Source Materialization、Conflict & Recovery、Review Handoff & Provenance。
2. **职责和非职责如何分？** 每部分只拥有其 Sync-local state/policy；外部 owner truth、Git remote truth、自动冲突决定和 Review Decision 均在边界外。
3. **需要完成哪些 capability？** 从显式语境/eligibility，经 binding/metadata、plan/apply、conflict/recovery，到 candidate/handoff/provenance；status 只读横切观察。
4. **需要哪些输入输出/状态/外协？** 每个 capability 在 §7 的逐部分表中记录 typed object family、local state effect 与 port seam，不用 provider DTO 作为本地对象。
5. **代码主体如何承接？** 使用 Step 4 已命名的 service/domain/port/store/adapter 主语，不创建按上游 owner 划分的内部 truth 模块。
6. **最易越界内容？** Access snapshot 当授权、metadata 当平台 truth、Git commit 当 source/Baseline、conflict 自动解决、ACK/probe 当 Decision。
7. **对象发现维度？** 每部分从 truth/state、policy/invariant、projection/read model、reference/boundary、audit/history 五维发现；Step 6 再正式筛选。
8. **哪些不是对象？** Entry、Application Service、Port、Repository、Adapter、DTO、trigger 和字段类型不因被点名而成为 Step 6 domain object。

## 4. 当前文档问题诊断

旧 02 的五部分围绕对象映射、路由、批同步、冲突与性能优化展开，主线仍是跨端 fanout/resync；draft 的九部分又把 local core、adapters、diagnostics 与业务能力并列。两者都无法给 Step 6 提供干净的对象来源，也会使 status、Git 与 owner truth 混层。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 旧组成部分与当前正式 01 不一致 | 五部分严格承接正式 01，不在概要层重分架构 |
| 功能直接跳到 API/状态或历史实现 | 每部分先 capability，再发现对象/接缝 |
| service/adapter/local truth 并列成业务部分 | 业务部分与实现分层正交，一个部分可跨多层 |
| 缺少单部分和跨部分停审 | 五次局部停审 + 一次全局闭环审计 |

## 6. 设计取舍

- 选择五个相对稳定的业务主语，而不是按 CLI 命令分四部分；一个命令可以穿过多个部分，避免复制门禁和状态。
- `ExternalOwnerSnapshot`、`SyncOperation`、`SyncStatusView` 是共享对象候选，通过明确 owner/component 归属避免形成第六部分。
- 逻辑 metadata 是 Working Copy & Metadata 所拥有的持久化表达；其他部分通过 local transition/unit-of-work 接缝请求更新，不直接写物理文件。
- Provenance 由 Review Handoff & Provenance 统一维护关联，但 provenance input 由各部分提供；统一维护不意味着拥有外部 evidence 或 owner truth。

## 7. 结构化中间产物

### 7.1 组成部分总表

| # | 组成部分 | 核心职责 | 主要代码主体 | 明确不承担 |
|---|---|---|---|---|
| `CP1` | Selection & Access | 建立显式操作语境，消费 owner eligibility/posture 并在 mutation 前 revalidate | `SelectionAccessService`、`OperationEligibilityPolicy`、`OwnerAccessPort` | 身份认证、授权裁决、Project/ProjectMember 生命周期 |
| `CP2` | Working Copy & Metadata | 拥有 working-copy binding、`.qs-sync` 逻辑 metadata、generation/cursor/mapping 与本地观察锚点 | `WorkingCopyService`、`MetadataMaintenanceService`、`MetadataStore` | Workspace projection、Git remote truth、静默修复/重绑 |
| `CP3` | Source Materialization | 基于获准 source 构造安全 plan，获取并应用全量/增量材料，成功后 finalize 本地水位 | `MaterializationService`、`MaterialSourcePort`、Git/fs apply ports | source authority、Artifact/Baseline、自动 merge/rebase |
| `CP4` | Conflict & Recovery | 检测/记录冲突，维护 checkpoint/manual decision/probe，安全续行或停止 | `ConflictRecoveryService`、`RecoveryProbeService` | 自动解决冲突、盲目重放、上游事务恢复 |
| `CP5` | Review Handoff & Provenance | 冻结候选、发起/探测正式 handoff、分层读取结果并维护 provenance 关联 | `ReviewHandoffService`、`ProvenanceService`、handoff/decision ports | Review Gate/Decision、accepted/approved/signoff、Git push |

### 7.2 总 capability 分布

| 能力节点 | 主责部分 | 协作部分 | 当前概要结果 |
|---|---|---|---|
| 显式 select + begin operation | CP1 | CP2 | `SyncOperation` 与 `SyncSelection` 候选；无隐式 latest |
| access/posture/source eligibility | CP1 | CP3/CP5 | `AccessEvaluation` + external snapshot；unknown fail-closed |
| bind/init/inspect metadata | CP2 | CP1/CP4 | binding/manifest/generation/integrity 候选 |
| status | CP2 提供 local read anchor | CP1~CP5 | 共享 `SyncStatusView` 只读聚合，不 refresh/repair |
| initial/incremental materialize | CP3 | CP1/CP2/CP4/CP5 provenance | plan/delta/change-set/run 候选，成功后 local finalize |
| conflict/manual decision/recovery | CP4 | CP2/CP3/CP5 | conflict/checkpoint/resolution/probe 候选 |
| push-review/handoff/probe/decision read | CP5 | CP1/CP2/CP4 | candidate/attempt/layered status/provenance 候选 |
| posture/source invalidation | CP1 主责判定 | CP2~CP5 | 使计划/候选/操作受限，不删除历史 |
| bounded diagnostics/provenance | CP5 主责关联 | CP1~CP4 提供事实 ref | redacted local relation，不生成 evidence/verdict |

### 7.3 对象发现维度表

| 部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开候选 |
|---|---|---|---|---|---|---|
| CP1 | `SyncOperation`、`SyncSelection`、`AccessEvaluation` | `OperationEligibilityPolicy` | access/status slice | `ExternalOwnerSnapshot` | access revalidation relation（并入 operation/history） | `SyncOperation`、`SyncSelection`、`AccessEvaluation`、`OperationEligibilityPolicy`、`ExternalOwnerSnapshot` |
| CP2 | `WorkingCopyBinding`、`MetadataManifest`、`CursorState`、`MappingSet` | `WorkingCopySafetyPolicy`、`MetadataIntegrityPolicy` | `WorkingCopyObservation` | path/Git/tool refs | metadata transition history（并入 manifest/provenance） | `WorkingCopyBinding`、`MetadataManifest`、`CursorState`、`MappingSet`、`WorkingCopyObservation`、两项 policy |
| CP3 | `MaterializationPlan`、`SourceDelta`、`PathChangeSet`、`MaterializationRun` | `MaterializationSafetyPolicy` | materialization result slice | source locator/cursor refs | run/checkpoint relation | 四个 state objects + policy |
| CP4 | `ConflictRecord`、`RecoveryCheckpoint`、`ManualResolution`、`ProbeRecord` | `RecoverySafetyPolicy` | conflict/recovery status slice | probe target/result refs | conflict/recovery transition history | 四个 state/history objects + policy |
| CP5 | `ReviewCandidate`、`HandoffAttempt`、`ProvenanceRecord` | `CandidateEligibilityPolicy`、`HandoffResultPolicy` | `LayeredHandoffStatus`、`SyncStatusView` | Gate/Decision/diagnostic refs | provenance/handoff history | 三个 truth/history + two policies + two views |

> 筛选纪律：Step 6 可以合并不具独立生命周期/不变量的候选，也可以将 policy 作为独立对象展开；任何删并必须逐项说明，不能静默遗失 capability 来源。

### 7.4 各部分交互总图

```text
Explicit user intent
        │
        ▼
Selection & Access
        │ verified eligibility / owner refs
        ▼
Working Copy & Metadata
        │ binding + local observation
        ▼
Source Materialization
        │ plan / apply result
        ▼
Conflict & Recovery
        │ clear or explicit resume / probe outcome
        ▼
Review Handoff & Provenance
        │
        ▼
Layered local / transport / external-decision status
```

关键说明：

- 图表达主要责任交接，不表示每个命令必须完整穿过五部分；`status` 是跨部分只读组合。
- CP4 可以阻断 CP3 或 CP5，也可以在安全前提下把显式 resume 返回对应主线；它不自动裁决。
- CP5 只交接 candidate 并保存 ref/status，Governance Decision 仍是外部 owner truth。
- External owner refs、Git/filesystem 和 local persistence 是横向支撑接缝，为保持主方向未画成业务部分。

## 8. 逐组成部分小循环

### CP1. Selection & Access

#### CP1.1 本部分职责

把每次命令的 principal、project、version/source、target 和 operation 组合为显式本地语境；通过正式 owner seam 获取身份/成员/项目 posture/source eligibility 的有限结果，并在危险副作用前重新验证。它负责“是否允许进入当前 Sync 用例”的本地门禁，不负责产生授权事实。

#### CP1.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 建立显式选择 | CLI/request 中明确的 principal/project/version/source/target/operation | `SyncSelection` | 创建/关联 local operation；不访问 Git/owner mutation | Step 6/7/8 |
| 创建操作语境 | selection、correlation、requested action | `SyncOperation` | local planned operation；不是平台 job | Step 6/9 |
| 查询 eligibility | selection + owner access port | `AccessEvaluation` + owner snapshot refs | 可更新显式 mutation 的 local access association | Step 7/8 |
| mutation 前 revalidate | operation + current owner result | eligible/blocked typed result | 使陈旧 plan/candidate 失效或保持 blocked | Step 8/9/10 |
| 只读展示 access slice | 已持久化 evaluation/snapshot | status access slice | 无写、无 refresh | Step 7/8 |
| 接收显式 invalidation 提示（合同存在时） | owner event/ref | stale/ineligible marker intent | 只写本地失效状态；不自动 apply/handoff | Step 7~10；受 blocker |

#### CP1.3 包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `SelectionAccessService` | application service | 编排 selection 与 owner eligibility | Step 7/8 |
| `OperationEligibilityPolicy` | domain policy | 基于 typed owner results 执行 fail-closed 规则 | Step 6/9 |
| `OwnerAccessPort` | outbound port | 读取 principal/project/member/posture/source eligibility | Step 7；真实 SDK mapping 受阻 |
| `OwnerReferenceStore` | local persistence port | 保存有限 ref/snapshot/freshness | Step 7 |
| SDK access adapter | adapter | 将正式 SDK 结果翻译为本地语义 | Step 7/12；`SYNC-UP-001/003` |

#### CP1.4 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth/state | `SyncOperation`、`SyncSelection`、`AccessEvaluation` | 独立成节；明确 local-only lifecycle 与 typed context |
| policy | `OperationEligibilityPolicy` | 独立成节；明确 unknown/stale/denied 的禁止路径 |
| reference | `ExternalOwnerSnapshot` | 独立成节；明确 source/freshness/visibility 和不授权 |
| projection | access slice | 并入 `SyncStatusView`，不单独造 truth |
| history | revalidation record | 作为 `SyncOperation` / provenance relation 字段来源，Step 6 审核是否独立 |

#### CP1.5 本部分不承担什么

- 不认证 principal、不签发 credential、不决定 ProjectMember 或权限。
- 不从路径、remote、branch、缓存或 `latest` 推断 project/version/source。
- 不因 snapshot 尚未过期而跳过 mutation 前正式核验。
- 不执行 materialization、冲突决定、handoff 或 archive mutation。

#### CP1.6 与其他部分的接缝

- 向 CP2 提供显式 selection/operation 与有限 owner refs，用于建立 binding；不直接写 metadata。
- 向 CP3/CP5 提供当前 eligibility result；这些部分仍在副作用前要求 revalidate。
- 从 CP4 接收 recovery/resume 所需的重新验证请求；unknown 继续 blocked。
- posture/source invalidation 传播到计划/候选时不删除历史和 provenance。

#### CP1.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否完整 | pass | 覆盖 explicit selection、operation、owner check、revalidate、read slice、invalidation |
| 对象是否有功能来源 | pass | 五个独立候选均可回指具体 capability |
| 接缝是否清楚 | pass_with_blocker | SDK surface/action matrix 受 `SYNC-UP-001/003` 阻断 |
| 禁止事项是否清楚 | pass | 无本地授权、隐式选择或 archive mutation |
| 是否越界 | pass | owner truth 仅 ref/snapshot，不内化身份/项目对象 |

### CP2. Working Copy & Metadata

#### CP2.1 本部分职责

拥有本地 working-copy binding 和 `.qs-sync` 逻辑 metadata 的受控表达，维护 generation、source/local cursor、mapping、完整性、路径/Git/tool observation 与 local transition 原子边界；为其他部分提供本地锚点，但不把本地目录升级为 Workspace projection 或 Git remote truth。

#### CP2.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| inspect target | explicit target path | `WorkingCopyObservation` | 只读 Git/fs/path/tool 状态，不初始化 metadata | Step 6~8 |
| initialize binding/metadata | verified selection + safe target observation | binding + manifest generation | 原子建立 local binding/provenance anchor | Step 6~9；schema blocked |
| load/validate metadata | target + expected binding | integrity/binding result | 只读时无修复；mutation 路径可显式 blocked | Step 7/10 |
| explicit migrate/repair/rebind | maintenance intent + old/new refs + safeguards | transition result | 新 generation/history；不得静默改 provenance | Step 6~10；受 `SYNC-UP-006` |
| maintain cursor/mapping | committed materialization result | updated cursor/mapping | 与 apply finalize 在 local transition 中关联 | Step 6/8/9 |
| observe working copy | binding + Git/fs ports | new observation | 观察不改文件/metadata | Step 7/8 |
| expose metadata/status slice | persisted local state + observation | status slices | query no-write | Step 7/8 |

#### CP2.3 包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `WorkingCopyService` | application service | inspect/bind/observe working copy | Step 7/8 |
| `MetadataMaintenanceService` | application service | 显式 init/migrate/repair/rebind 编排 | Step 7/8/10 |
| `WorkingCopySafetyPolicy` | domain policy | path/dirty/untracked/tool/lock safety | Step 6/9 |
| `MetadataIntegrityPolicy` | domain policy | schema/generation/integrity/provenance guard | Step 6/9 |
| `MetadataStore` / `LocalStateUnitOfWork` | persistence ports | load/save local truth 与关联 transition | Step 7/12 |
| `GitObservationPort` / `FilesystemPort` | local outbound ports | 只读观察、path/lock/integrity | Step 7 |
| metadata/Git/filesystem adapters | adapters | 物理持久化与白名单设施动作 | Step 7/10/12 |

#### CP2.4 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth/state | `WorkingCopyBinding`、`MetadataManifest`、`CursorState`、`MappingSet` | 均独立成节；逻辑 schema 而非物理 JSON |
| policy | `WorkingCopySafetyPolicy`、`MetadataIntegrityPolicy` | 独立成节；分别保护 local environment 与 metadata truth |
| projection/observation | `WorkingCopyObservation` | 独立成节；明确 observation time/能力/dirty，不作为授权 |
| reference | canonical path / Git refs / tool refs | 作为字段类型，不独立承担 truth |
| audit/history | generation/metadata transition | 先并入 `MetadataManifest` + `ProvenanceRecord`，Step 6 审核 |

#### CP2.5 本部分不承担什么

- 不拥有 Workspace projection、Artifact/source 正文、Git remote/branch policy。
- 不在 status/query 中创建、迁移、修复或重写 `.qs-sync`。
- 不静默重绑 source/target，不删除或伪造 provenance/冲突依据。
- 不提供任意 filesystem/Git 命令执行能力，不自动 stash/merge/rebase/push。

#### CP2.6 与其他部分的接缝

- 从 CP1 消费显式 selection 和 current eligibility，只用其建立/校验 local binding。
- 向 CP3 提供 immutable binding generation、cursor/mapping 和 observation；CP3 不直接写 metadata adapter。
- 与 CP4 通过 checkpoint/conflict refs 协作处理 partial/unknown；修复不绕过 conflict history。
- 向 CP5 提供 candidate freeze 所需的 binding generation、local observation 和 provenance anchors。

#### CP2.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否完整 | pass | 覆盖 inspect/init/load/validate/migrate/rebind/cursor/mapping/status |
| 对象是否有功能来源 | pass | 七个独立候选均有 capability 来源 |
| 接缝是否清楚 | pass_with_blocker | metadata 物理 schema/迁移/保留受 `SYNC-UP-006`；Git 保护受 `007/010` |
| 禁止事项是否清楚 | pass | query no-write、no silent rebind、no arbitrary Git/fs |
| 是否越界 | pass | local working copy 未冒充 Workspace/Git remote truth |

### CP3. Source Materialization

#### CP3.1 本部分职责

在明确 eligibility、binding generation、source authority/comparator 和安全 local observation 的前提下，构造可审查 materialization plan，获取全量或增量 source material，生成受限 path changes，并通过 Git/filesystem ports 应用；只有 local result 可证明时才请求 CP2 finalize cursor/mapping。它拥有本地计划/运行状态，不拥有 Artifact/Workspace source truth。

#### CP3.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| resolve material source | selection/binding + owner source port | typed source locator/version/cursor | 只读 owner seam；authority 不唯一则 blocked | Step 7/8；`SYNC-UP-002` |
| compare source/local cursor | source waterline + local cursor + comparator | full/incremental/no-op/gap/unsupported result | 不自行猜 comparator 或推进 cursor | Step 6~10；`SYNC-UP-008` |
| build materialization plan | binding generation + delta + mapping + observation | `MaterializationPlan` | local planned state，固定 preconditions | Step 6/9 |
| validate path change set | source delta + mapping/path policy | `PathChangeSet` or conflict intent | 无文件写；dirty/path/rename/delete 不安全则交 CP4 | Step 6/8/10 |
| apply controlled changes | valid plan + safe ports | `MaterializationRun` outcome | 受限本地文件/Git object I/O；不 merge/rebase/push | Step 7/8/9 |
| finalize local application | proven apply result + unchanged generation | cursor/mapping/provenance update intent | 经 CP2 local unit-of-work 提交；unknown 不推进 | Step 8/9 |
| resume safe local stage | checkpoint + revalidated preconditions | continued/invalidated/blocked | 只续行已证明安全 local stage | Step 8~10 |

#### CP3.3 包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `MaterializationService` | application service | resolve/compare/plan/validate/apply/finalize 编排 | Step 7/8 |
| `MaterializationSafetyPolicy` | domain policy | source/binding/cursor/path/dirty precondition | Step 6/9 |
| `MaterialSourcePort` | owner outbound port | 读取 locator/manifest/delta/comparator result | Step 7；真实合同 blocked |
| `GitWorktreePort` | local outbound port | 有限工作树观察与受控 local apply seam | Step 7；禁止 remote/push |
| `FilesystemApplyPort` | local outbound port | staging/atomic replacement/path protection | Step 7/12 |
| source SDK / Git / filesystem adapters | adapters | 翻译正式 source 与执行白名单本地动作 | Step 7/10/12 |

#### CP3.4 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth/state | `MaterializationPlan`、`MaterializationRun` | 独立成节；区分 plan vs observed outcome |
| value/state input | `SourceDelta`、`PathChangeSet` | 独立成节；字段来源需 owner/mapping/path policy |
| policy | `MaterializationSafetyPolicy` | 独立成节；明确 precondition 与 invalidation |
| reference | source locator/version/cursor refs | 作为 typed refs；不复制 Artifact/Workspace body |
| audit/history | run/checkpoint/provenance relations | run 本身独立；checkpoint 在 CP4、provenance 在 CP5 |

#### CP3.5 本部分不承担什么

- 不决定 Artifact 与 Workspace 谁是权威来源，不创造来源优先级或 comparator。
- 不把 Git commit/branch/remote 当 source version、Artifact 或 Baseline。
- 不自动 merge/rebase/push/stash，不覆盖 dirty/untracked 或不可解释路径。
- 不在 apply 未知/partial 时推进 local cursor 或伪造完整 materialization。

#### CP3.6 与其他部分的接缝

- CP1 提供当前 eligibility；CP2 提供 binding/cursor/mapping/observation 并拥有最终 local transition。
- 任何 dirty/path/gap/source drift/partial/unknown 形成 CP4 conflict/checkpoint intent，而非在 CP3 内吞掉。
- 每次成功/失败/blocked 的 source/application ref 交 CP5 维护 provenance；不是正式 evidence。
- CP5 candidate 的可用性依赖 CP3 已完成且未漂移的 local result，但 CP3 不主动发起 handoff。

#### CP3.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否完整 | pass | resolve/compare/plan/validate/apply/finalize/resume 均有落点 |
| 对象是否有功能来源 | pass | plan/delta/change-set/run/policy 均有来源 |
| 接缝是否清楚 | pass_with_blocker | source authority/comparator/Git mapping 受 `SYNC-UP-002/007/008/010` |
| 禁止事项是否清楚 | pass | no source invention、no auto Git、unknown no cursor advance |
| 是否越界 | pass | 只拥有 local plan/run，不拥有 source/Artifact/Workspace truth |

### CP4. Conflict & Recovery

#### CP4.1 本部分职责

将 access/posture、metadata、source/cursor/mapping、dirty/path、apply partial 和 handoff unknown 等异常提升为可审计的 local conflict/checkpoint/probe/manual-resolution 语义；决定当前本地步骤可否安全续行、应探测还是必须人工介入。它不替用户自动解决，也不修复外部 owner truth。

#### CP4.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| classify conflict | detection facts + affected refs | `ConflictRecord` | 创建 local conflict/history；保留证据摘要 | Step 6~10 |
| capture checkpoint | operation/plan/attempt phase + fingerprints | `RecoveryCheckpoint` | local checkpoint；不证明外部完成 | Step 6/8/9 |
| record manual resolution | conflict + explicit actor decision | `ManualResolution` | 记录意图并使旧 plan/candidate 失效或产生 resume prereq | Step 6~9 |
| evaluate safe resume | checkpoint + current access/binding/observation | resumable/invalidated/manual result | 无隐式副作用；必要时返回主线重新 plan | Step 8~10 |
| prepare/probe unknown outcome | persisted attempt + formal probe capability | `ProbeRecord` | 外部只读 probe；不盲重放 | Step 6~9；合同 blocked |
| abandon/cancel local continuation | operation/checkpoint + actor intent | terminal local result/history | 不删除 provenance/conflict/handoff attempt | Step 7~10 |
| expose conflict/recovery slice | persisted records | read view | query no-write，不启动 probe | Step 7/8 |

#### CP4.3 包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ConflictRecoveryService` | application service | classify/record decision/resume/abandon | Step 7/8 |
| `RecoveryProbeService` | application service | prepare and execute explicit unknown probe | Step 7/8 |
| `RecoverySafetyPolicy` | domain policy | 判断 local-safe resume、probe-required/manual | Step 6/9 |
| `RecoveryProbePort` | outbound port | 查询正式 external side-effect outcome | Step 7；`SYNC-UP-004/005` |
| conflict/checkpoint/probe repositories | persistence ports | 保存 local recovery truth/history | Step 7/12 |

#### CP4.4 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth/state | `ConflictRecord`、`RecoveryCheckpoint`、`ManualResolution`、`ProbeRecord` | 均独立成节；不把错误字符串当对象 |
| policy | `RecoverySafetyPolicy` | 独立成节；明确 local retry 与 external replay 边界 |
| projection | conflict/recovery slice | 并入 `SyncStatusView` |
| reference | affected path/source/operation/handoff refs | typed refs，不保存正文/raw output |
| audit/history | transition chain | 由上述记录与 provenance 关联，不新增泛化 AuditLog truth |

#### CP4.5 本部分不承担什么

- 不自动 merge/rebase/stash、选“ours/theirs”、覆盖或删除冲突证据。
- 不把 retry、timeout 或进程重启解释为幂等证明。
- 不修复 Project/Artifact/Workspace/Governance/Archive truth，也不将 telemetry 当 probe。
- 不在 status/query 中执行 resume、probe、cleanup 或状态推进。

#### CP4.6 与其他部分的接缝

- 从 CP1 获得 revalidation；从 CP2 获得 binding/generation/observation；从 CP3/CP5 获得失败或 unknown attempt facts。
- local-safe resume 返回 CP2/CP3/CP5 的显式新操作，而不是在 recovery service 中绕过原门禁。
- external probe 结果只更新 ProbeRecord/attempt relation，最终 owner decision 仍由 CP5 的外部 ref 表达。
- 所有 conflict/checkpoint/manual/probe 关系进入 CP5 provenance，但不等于 formal evidence。

#### CP4.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否完整 | pass | conflict/checkpoint/manual/resume/probe/abandon/read 均覆盖 |
| 对象是否有功能来源 | pass | 四记录一 policy 均有独立语义 |
| 接缝是否清楚 | pass_with_blocker | external probe/idempotency 与人工决策精确合同受 `SYNC-UP-004/005/010` |
| 禁止事项是否清楚 | pass | no auto resolution、no blind replay、query no-write |
| 是否越界 | pass | recovery 只恢复 local orchestration，不修复 owner truth |

### CP5. Review Handoff & Provenance

#### CP5.1 本部分职责

在 selection/access、binding/source/local observation 和冲突状态均重新验证后，形成 freeze-bound 本地 review candidate，持久化 handoff attempt，再经正式 Governance seam call/probe/read；分层展示 prepared、transport、probe 与 external decision ref，并贯穿记录不可伪造的 provenance relation。它不拥有 Review Gate、Decision、accepted、Artifact/Baseline 或 Git remote。

#### CP5.2 功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| inspect candidate eligibility | operation + binding/source/local/conflict/access facts | eligible/blocked reasons | 只读 local facts + explicit owner revalidation | Step 6~10 |
| freeze review candidate | stable eligible facts + digest/path set | `ReviewCandidate` | local candidate truth tied to generation/observation | Step 6/8/9 |
| prepare handoff attempt | candidate + governance target/context | `HandoffAttempt` prepared | local durable attempt/idempotency association | Step 6~9 |
| call formal handoff | prepared attempt + `ReviewHandoffPort` | transport outcome / external ref / unknown | 外部副作用；必须 prepare first | Step 7/8/9；contract blocked |
| probe unknown / read decision | attempt/ref + official ports | probe outcome / external decision snapshot | 只读 owner results，不能生成 verdict | Step 7~10 |
| assemble layered status | candidate + attempt + probe + decision refs | `LayeredHandoffStatus` | no-write projection | Step 6~8 |
| append provenance relation | facts from all parts | `ProvenanceRecord` | local protected relation/history；不保存正文 | Step 6/8/9 |
| emit bounded diagnostics | local operation/ref/error summary | redacted diagnostic association | diagnostics side effect only；不证明 success | Step 7/8/10 |

#### CP5.3 包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ReviewHandoffService` | application service | inspect/freeze/prepare/call/probe/finalize | Step 7/8 |
| `ProvenanceService` | application/domain service | 维护跨部分 local relation 与完整性 | Step 7/8 |
| `CandidateEligibilityPolicy` | domain policy | 校验 generation/access/dirty/conflict/drift | Step 6/9 |
| `HandoffResultPolicy` | domain policy | 防止 transport/probe/decision 语义升格 | Step 6/9 |
| `ReviewHandoffPort` / `ReviewDecisionReadPort` | outbound ports | 正式 handoff 与 decision read | Step 7；`SYNC-UP-004/005` |
| `DiagnosticsPort` | outbound port | redacted correlation/diagnostics | Step 7/10 |
| candidate/attempt/provenance repositories | persistence ports | 保存 local truth/history | Step 7/12 |

#### CP5.4 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth/state | `ReviewCandidate`、`HandoffAttempt`、`ProvenanceRecord` | 独立成节；明确 local-only ownership |
| policy | `CandidateEligibilityPolicy`、`HandoffResultPolicy` | 独立成节；覆盖 drift 与 ACK/Decision 分层 |
| projection/read model | `LayeredHandoffStatus`、`SyncStatusView` | 独立成节；status 汇总需明确 no-write |
| reference | Gate/handoff/Decision/diagnostic refs | typed ref/snapshot，可并入 external owner snapshot |
| audit/history | attempt/provenance transitions | 由 attempt/provenance 记录，不新造 formal evidence |

#### CP5.5 本部分不承担什么

- 不创建/批准 Review Gate，不产生 Decision、accepted、approved、signoff 或 readiness。
- 不把本地 commit、candidate digest、transport ACK、HTTP 200 或 remote object 当 Artifact/Baseline/accepted。
- 不自动 Git push 或直接写主分支，不绕过 Governance seam。
- 不保存 credential、raw body/output、evidence/report 正文，不删除或伪造 provenance。

#### CP5.6 与其他部分的接缝

- CP1 提供 current eligibility；CP2 提供 binding/generation/observation；CP3 提供 materialization/source refs；CP4 提供 conflict clear/probe facts。
- `ReviewCandidate` 冻结后任一 input drift 都使其失效，必须重新检查/冻结；不能复用旧 candidate 偷渡变化。
- `HandoffAttempt` 与 external decision 仅通过 safe refs 关联；transport final 不自动推进 decision state。
- provenance 接收各部分的 local fact refs，但其完整性不使这些 refs 变成 formal audit/evidence。

#### CP5.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否完整 | pass | eligibility/freeze/prepare/call/probe/read/status/provenance/diagnostics 均覆盖 |
| 对象是否有功能来源 | pass | 三 truth、两 policy、两 view 均有来源 |
| 接缝是否清楚 | pass_with_blocker | Governance handoff/probe/idempotency 受 `SYNC-UP-004/005` |
| 禁止事项是否清楚 | pass | no Gate bypass、no ACK elevation、no Git push、no evidence fabrication |
| 是否越界 | pass | 只拥有 candidate/attempt/provenance local truth |

## 9. 总体边界与 Step 6 展开门禁

### 9.1 总体边界说明

- CP1 决定“是否可进入”，CP2 决定“本地锚点是否安全”，CP3 决定“计划与 apply 是否可执行”，CP4 决定“异常后是否可安全续行”，CP5 决定“候选是否可交接并如何分层解释结果”。
- `SyncOperation` 归 CP1，作为跨部分 correlation anchor；它不吸收各部分内部状态或变成上帝对象。
- `SyncStatusView` 归 CP5 的 read/status surface 组装，但只引用各部分 read slice；它没有 mutation 方法和独立 truth。
- `ExternalOwnerSnapshot` 归 CP1/reference support，按 kind 被各部分消费；不在五部分中复制成多个不同真相。
- 所有物理 persistence mutation 经 CP2 定义的 local UoW/store seam；业务 transition 仍由各自部分的 domain policy 决定。

### 9.2 Step 6 候选池处理门禁

| 门禁 | 要求 |
|---|---|
| capability 来源 | 每个正式对象必须回指本文件中的具体 capability |
| 独立责任 | 只有承担独立 truth/state/policy/view/reference/history 责任的候选成节 |
| 非对象剔除 | services/ports/repositories/adapters/entries/DTOs 不作为 domain object，除非说明特殊结构责任 |
| 类型化骨架 | 每对象字段与函数参数必须有 `TypeName`；不写完整 schema/signature |
| owner/状态 | 明确所属 CP、ownership、状态集合及禁止事项 |
| 反查 | Step 8/9 将使用的对象必须在 Step 6 先定义；未使用候选需说明删并理由 |

### 9.3 跨组成部分闭环审计

| 审计项 | 结论 | 修正 / 说明 |
|---|---|---|
| 重复对象 | pass | `ExternalOwnerSnapshot`、`SyncOperation`、`SyncStatusView` 各有唯一主责，不按部分复制 |
| 职责重叠 | pass | CP2 owns local persistence anchor；CP3 owns apply plan/run；CP4 owns abnormal recovery；CP5 owns handoff/provenance |
| 候选遗漏 | pass | explicit context、binding/metadata/cursor/mapping、materialization、conflict/recovery、handoff/provenance/status 全有候选 |
| 接缝冲突 | pass | 所有 mutation 经过原部分 policy + CP2 UoW，不让 persistence 决定业务状态 |
| owner 越界 | pass | 外部 truth 只以 typed ref/snapshot/port result 出现；无外部实体副本 |
| query no-write | pass | access/metadata/conflict/handoff/status read slices 均禁止 refresh/repair/probe |
| blocker 传播 | pass_with_upstream_blockers | 十项 blocker 已映射至相关 capability/port，未被 local default 补齐 |
| 后续展开位置 | pass | 对象→Step 6，interfaces→Step 7，flows→Step 8，states→Step 9，异常→Step 10，config→Step 11 |
| P0 命令覆盖 | pass | clone/pull/status/push-review 均可沿五部分 capability 反查；维护命令独立存在 |

### 9.4 后续一致性检查结论

Step 6~9 必须保持 CP1→CP5 顺序逐部分展开并各自停审；不可新增第六业务部分、不可把 shared support 升格为 truth、不可在接口/流程阶段出现未在候选池处理的关键对象。若需要改变组成部分或新增关键 capability，必须回退本 Step，而不是在后文暗改。

## 10. 回填草稿

正式 §5 摘录 §7 总表/维度表/交互图、§8 五部分小节以及 §9 总体边界和审计结论。正文保留每部分 capability、代码主体、对象线索、非职责与接缝，但将过程性停审表压缩为“审计结论 + calibration 入口”。

延伸阅读入口指向本文件的“对象发现维度表”“逐组成部分小循环”“Step 6 候选池处理门禁”和“跨组成部分闭环审计”。

## 11. 待确认事项

`SYNC-UP-001~010` 继续开放；它们阻断对应 capability 的正向 adapter/协议定稿，但不改变五部分 ownership。若 owner 合同改变 source authority、posture action 或 handoff semantics，必须回流 Step 1/3/5 重审。

## 12. 进入下一步条件

- [x] 五个主要组成部分逐一完成 capability-first 小循环和单部分停审。
- [x] 组成部分总表、对象发现维度表、各部分交互总图齐全。
- [x] 每个代码主体/候选对象都有后续展开位置，无悬空。
- [x] 跨部分审计无 unresolved 重复、职责重叠、接缝冲突或候选遗漏。
- [x] 字段/状态/函数细节仍留给 Step 6，未提前落完整实现。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 6。此结论仅为文档静态自检。
