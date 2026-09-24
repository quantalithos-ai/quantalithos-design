# Step 5. 主要组成部分、职责与边界

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 5 / 主要组成部分、职责与边界 |
| 状态 | `completed` |
| 当前模块 | `components_boundary:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 六个主要组成部分已逐个完成 capability、代码主体、对象发现线索、接缝和非职责停审；跨组成部分对象/职责/接缝审计无 unresolved 冲突。 |
| next_allowed_action | `read_and_start_step_06` |
| 正式正文写入 | `blocked_until_step_14` |

### 1.1 Step 内计划

- [x] 读取项目台账、02 flow、Step 4、概要 SOP Step 5 和书写规范 §4.5。
- [x] 依据正式 00/01 的能力闭环、语义上下文、数据归属和交互边界建立候选组成部分。
- [x] 依次完成六个组成部分的 capability、代码主体、对象发现线索、接缝和停审。
- [x] 形成对象发现维度总表和各部分交互总图。
- [x] 完成跨组成部分闭环审计、历史污染扫描、回填草稿和自检。

### 1.2 本步门禁

- 本步不展开字段、成员函数、工厂函数、完整 API schema、处理流步骤或状态矩阵。
- 组成部分是概要层业务结构主语，不是目录、类、函数、外部系统或后端产品。
- 对象线索只是 Step 6 候选池；port、repository、DTO、页面组件和 raw owner response 不自动升格为领域对象。
- 所有跨域能力保持 required/planned/blocked；不因列出接缝而声称真实集成可用。

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `02_hld_step_04_code_subject_framework.md` | 六个业务组成部分候选、双轴实现分层和 shared boundary。 |
| `02_hld_step_03_constraints.md` | ownership、显式版本、多轴状态、no-write、保护、redaction 和 blocker 门禁。 |
| 正式 `00-需求文档.md` §7、§9～§13 | CP-RUN-01~05、功能、业务规则、数据归属、接口和 NFR。 |
| 正式 `01-架构设计.md` §4～§10 | 职责边界、六个语义上下文、承载、依赖、所有权、一致性和交互。 |
| 旧 02、README、draft | 后置遗漏/污染扫描，不提供当前组成部分定论。 |

## 3. SOP 问题回答

### 3.1 组成部分划分

本仓采用六个业务主要组成部分：

1. `Context and explicit selection`：可信语境、项目上下文引用、immutable Release/version 选择和 selection generation。
2. `Material acquisition and qualification`：locator 消费、下载/cache/quarantine、完整性验证和 qualified posture。
3. `Run intent and lifecycle`：运行请求、控制意图、owner status/ref 组合和生命周期展示。
4. `Resource, cleanup and recovery protection`：本地资源观察、owner allocation/lease 双视图、保护、清理和 reconcile/manual-review。
5. `Preview, diagnosis and handoff`：bounded/redacted 预览、失败分类、下一步解释和安全 handoff posture。
6. `Entry and presentation composition`：逻辑页面/CLI/产品入口、view model、连接状态和跨平台展示编排。

这些部分描述“Runner 做什么”；`Inbound/Application/Domain/Projection/Ports/Operations` 仍只是实现分层。

### 3.2 每部分功能、输入输出和边界

每部分均先定义 capability，再发现对象。输入主要是显式 actor/context、owner-safe ref/snapshot、local observation 或用户 intent；输出严格区分 Runner-owned local truth、safe projection 和 owner-attributed posture。没有部分可以创建或修改上游 truth。

### 3.3 最易串线的职责

- selection/qualification 不能变成 Artifact 或 Governance owner。
- material acquisition 不能把传输完成写成 authority 或 running。
- lifecycle 不能把 `accepted`、PID、端口或本地进程写成 running/terminal。
- resource/cleanup 不能把 local probe 写成 allocation/lease/cleanup truth。
- preview/diagnosis 不能把本地摘要写成 evidence/report/verdict/signoff。
- entry/presentation 不能直连 SDK、数据库、Sandbox backend 或执行副作用。

## 4. 当前文档问题诊断

| 历史材料 | 风险 | 本轮处置 |
|---|---|---|
| 旧 02 的 queue/run card/retry/replay 主线 | 从“已有运行”倒推结构，遗漏选择、材料资格和保护 | 重新以五个核心能力闭环 + 入口展示推导。 |
| README 的 ReleaseService/SandboxService、Tauri、Docker、性能数字 | 技术与外部 owner 被误写成内部组成部分 | 只作 historical_material；保留抽象 seam 和可替换承载。 |
| draft 的十个候选模块 | 模块数先于 capability，可能造成重复对象 | 六部分只锁业务 coverage；Step 6 再正式化对象。 |
| `RunnerRun`/`OutputPreview`/`HealthHint` 等旧词 | 可能压平多轴状态或把 view 升格 truth | 仅作为候选线索，须回指来源和 owner。 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 结构主轴 | 页面、队列、外部系统和技术混合 | 六个业务组成部分 + 实现分层双轴。 |
| 运行主线 | 直接假设有可运行进程 | 从 context/selection/qualification 开始，按多轴 lifecycle 承接。 |
| 对象发现 | 旧对象名直接进入设计 | 按 truth/state/policy/projection/reference/audit/history 形成候选池。 |
| 入口边界 | 页面可能直接调用外部能力 | 所有入口经共同 application/domain 门禁。 |
| 非 happy path | 偏重 retry/replay/kill | 资源保护、unknown、reconcile、handoff 和 cleanup 是核心 capability。 |

## 6. 设计取舍

| 方案 | 结论 | 原因 |
|---|---|---|
| 按页面拆分 | 不采用 | 页面不是 truth owner，且 CLI/SDK 会产生重复门禁。 |
| 按上游仓拆分 | 不采用 | 会复制 Artifact/Governance/Runtime/Sandbox/Observability truth。 |
| 直接继承 draft 十模块 | 不采用 | 未完成 capability→对象→接口推导，数量和名称不可当定论。 |
| 六个业务组成部分 + shared projection/reference 支撑 | 采用 | 覆盖核心闭环，保持 owner 与技术载体可替换。 |
| 将外围预取/比较/归档浏览纳入核心 | 不采用 | 当前需求与 owner 合同不足，只保留条件性扩展点。 |

## 7. 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 明确不承担 |
|---|---|---|---|
| Context and explicit selection | 建立可信 actor/session/project context，保存 immutable Release/version、scope、selection generation 和选择失效姿态。 | `RunnerEntryFacade`、`SelectionService`、`ContextResolver`、`ReleaseSelection`、`SelectionGeneration` | 不创建/修改 Release、Artifact、baseline、approval、Project/Work truth。 |
| Material acquisition and qualification | 取得 locator、管理下载进度/cache/quarantine，验证 manifest/digest/signature/平台资格并形成 qualified posture。 | `AcquisitionService`、`QualificationService`、`AcquisitionJob`、`MaterialCache`、`IntegrityPosture` | 不发布 Artifact，不本地批准，不以传输完成替代完整性或 authority。 |
| Run intent and lifecycle | 建立受控运行/启停/取消意图，组合 owner-safe Sandbox/Runtime 状态并展示多轴 lifecycle。 | `RunLifecycleService`、`ControlService`、`RunIntent`、`ControlIntent`、`OwnerRunProjection` | 不拥有 execution loop、boundary、lease、Runtime outcome 或把 ACK 当 running。 |
| Resource, cleanup and recovery protection | 观察本地端口/路径/磁盘/进程/能力，承接保护、cleanup intent、lease/orphan posture、断线对账和 manual review。 | `ResourceRecoveryService`、`ReconcileJob`、`ResourceObservation`、`ProtectionGuard`、`RecoveryCase` | 不拥有 scheduler/allocation、Sandbox cleanup guard、全局资源或自动重放未知副作用。 |
| Preview, diagnosis and handoff | 组合 bounded/redacted 输出预览、失败分类、source/freshness/visibility 和 handoff posture。 | `PreviewService`、`DiagnosisService`、`HandoffService`、`OutputPreview`、`FailureDiagnosis`、`HandoffPosture` | 不保存 raw body/secret，不生成 evidence/report/verdict/signoff，不拥有 Archive/Observability truth。 |
| Entry and presentation composition | 将 GUI/CLI/SDK/product entry 映射到共同 use case，组合 view model、连接状态、restricted/blocked/unknown 展示。 | `RunnerEntryFacade`、`RunnerReadModelComposer`、logical page presenters、`ConnectivityService` | 不直连外部 client、存储或平台副作用，不决定 domain authority。 |

## 8. 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| Context and explicit selection | `ReleaseSelection`、`SelectionGeneration` | immutable source binding、scope consistency | `SelectionPostureView` | `RunnerContextRef`、`ReleaseRef`、`AuthorityRef` | selection change/revocation history | `ReleaseSelection`、`SelectionGeneration`、`RunnerContextRef` |
| Material acquisition and qualification | `AcquisitionTask`、`MaterialCacheEntry` | source/version/digest binding、quarantine promotion | `QualificationPostureView`、`DownloadProgressView` | locator/manifest/integrity refs | verification/eviction history | `AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture` |
| Run intent and lifecycle | `RunIntent`、`ControlIntent` | `accepted != running`、owner attribution | `OwnerRunProjection`、`ExecutionPostureView` | `SandboxRequestRef`、`RuntimeRunRef`、`BoundaryRef` | control/reconcile history | `RunIntent`、`ControlIntent`、`OwnerRunProjection` |
| Resource, cleanup and recovery protection | `ProtectionGuard`、`RecoveryCase` | active lease/capture/handoff/retention/orphan protection | `ResourceConflictView`、`CleanupPostureView` | local probe ref、`LeaseRef`、`CleanupRef` | cleanup/reconcile history | `ResourceObservation`、`ProtectionGuard`、`RecoveryCase` |
| Preview, diagnosis and handoff | `FailureDiagnosis`、`HandoffPosture` | redaction/body bound/source freshness | `OutputPreview`、`DiagnosticSummaryView` | `OutputRef`、`DiagnosticRef`、`HandoffRef` | handoff/diagnostic history | `OutputPreview`、`FailureDiagnosis`、`HandoffPosture` |
| Entry and presentation composition | local connectivity/selection view state | no-write/read-only composition | `RunnerReadModel`、`ConnectivityView` | visibility/source/freshness metadata | UI interaction telemetry (non-audit) | `RunnerReadModel`、`ConnectivityView` |

## 9. 各部分交互总图

```text
Context and explicit selection
              |
              v
Material acquisition and qualification
              |
              v
Resource / preflight protection -----> Run intent and lifecycle
              |                                  |
              |                                  v
              +----------------------> Preview, diagnosis and handoff
                                                 |
                                                 v
                                   Entry and presentation composition

Owner snapshots/refs and local observations enter each part through
formal ports; recovery/reconcile can re-read all parts but cannot replay
unknown side effects or rewrite owner truth.
```

关键说明：

- 图表达 capability 依赖方向，不表达 API 字段、函数调用、协议时序或部署拓扑。
- 每条箭头都经过 application/domain 门禁；展示层不能绕过选择、资格、保护或来源限制。
- Owner snapshot/ref、local observation 和 Runner-owned local truth 是不同来源；合并只生成 view，不合并 ownership。
- 外围预取、比较和 Archive 引用不进入核心成功判定。

## 10. 各组成部分独立停审

### 10.1 Context and explicit selection

#### 职责与 capability

| Capability | 输入 | 输出 | 状态/副作用 | 后续展开 |
|---|---|---|---|---|
| 建立运行语境 | actor/session/project safe refs、platform context | `RunnerContextRef` 或 restricted/blocked | 只保存最小本地语境，不批准权限 | Step 6/7 |
| 显式选择 immutable Release | `ReleaseRef`、scope、用户选择 | `ReleaseSelection`、新 `SelectionGeneration` | 选择变化使旧资格/意图失效 | Step 6/8/9 |
| 承接 authority posture | Artifact/Governance safe view | current/pending/revoked/expired/conflict view | 不本地生成 approval | Step 6/7 |

#### 代码主体

| 主体 | 类型 | 作用 | 后续位置 |
|---|---|---|---|
| `SelectionService` | Application | 编排 context、选择和资格前置 | Step 7/8 |
| `ReleaseSelection` / `SelectionGeneration` | Domain | 保存本地选择绑定和失效边界 | Step 6/9 |
| `ContextResolverPort` / `ReleaseAuthorityPort` | Port | 读取正式 context/Release/Governance safe seam | Step 7 |
| `SelectionPostureView` | Projection | 组合可见性、freshness 和资格姿态 | Step 6/7 |

#### 对象发现线索

| 维度 | 候选 | Step 6 口径 |
|---|---|---|
| Truth/State | `ReleaseSelection`、`SelectionGeneration` | 独立对象；不可由页面字段替代。 |
| Policy/Invariant | source/scope/generation binding | 作为不变量，不复制 Governance policy。 |
| Projection | `SelectionPostureView` | 独立只读 view。 |
| Reference | `RunnerContextRef`、`ReleaseRef`、`AuthorityRef` | safe ref，不保存正文。 |
| Audit/History | selection invalidation record | 是否独立对象留 Step 6 判断。 |

#### 非职责与接缝

不创建 Release、不解释 policy 正文、不授予 approval、不把 cache 当 authority。所有外部读取经正式 SDK/公开 adapter；合同未闭合时保持 blocked。

#### 停审记录

| 项目 | 结论 |
|---|---|
| capability→对象来源 | pass；每项均有 selection/context/view/ref 主语。 |
| 接缝与 ownership | pass；Artifact/Governance/Work 仍是 owner。 |
| 越层/悬空 | pass；无字段或函数提前下沉。 |

### 10.2 Material acquisition and qualification

#### 职责与 capability

| Capability | 输入 | 输出 | 状态/副作用 | 后续展开 |
|---|---|---|---|---|
| 取得材料 | qualified selection、locator posture | `AcquisitionTask`、progress/failure | 后台下载，可暂停/恢复，失败材料 quarantine | Step 6/8 |
| 验证和晋级 | manifest/digest/signature/policy refs、local bytes | `IntegrityPosture`、`MaterialCacheEntry` | verified 后才可 qualified；source drift 失效 | Step 6/9 |
| 保护与淘汰候选 | lease/capture/handoff/retention posture | protected/evictable view | 保护未解除不删除 | Step 6/8/10 |

#### 代码主体

| 主体 | 类型 | 作用 | 后续位置 |
|---|---|---|---|
| `AcquisitionService` / `QualificationService` | Application | 编排传输、验证、cache 晋级 | Step 7/8 |
| `AcquisitionJob` | Operations | 承接长时取得/验证/重建触发 | Step 7/8 |
| `AcquisitionTask` / `MaterialCacheEntry` / `IntegrityPosture` | Domain | 表达本地材料状态和绑定 | Step 6/9 |
| `MaterialSourcePort` / `IntegrityVerifierPort` / `MaterialCachePort` | Port | 外部 locator、验证和本地 cache seam | Step 7 |

#### 对象发现线索

| 维度 | 候选 | Step 6 口径 |
|---|---|---|
| Truth/State | `AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture` | 独立展开；传输和验证不合并。 |
| Policy/Invariant | source/version/digest binding、qualified gate | 作为不变量/资格对象候选。 |
| Projection | `DownloadProgressView`、`QualificationPostureView` | 只读 view。 |
| Reference | locator/manifest/digest/signature refs | safe refs；不锁算法和 schema。 |
| Audit/History | verification/promotion/eviction history | 仅概要候选，详细记录留 03。 |

#### 非职责与接缝

不修改 Release 内容、不签发 authority、不将 HTTP 200/传输完成当成功、不将本地 cache 反写 Artifact。`RUN-UP-001/002/008` 未闭合时 adapter 保持 blocked。

#### 停审记录

| 项目 | 结论 |
|---|---|
| capability→对象来源 | pass；取得、验证、晋级和保护各有主语。 |
| 多轴边界 | pass；download/verification/qualification 分离。 |
| 越层/悬空 | pass；无 Release truth 或算法定论。 |

### 10.3 Run intent and lifecycle

#### 职责与 capability

| Capability | 输入 | 输出 | 状态/副作用 | 后续展开 |
|---|---|---|---|---|
| 建立运行意图 | qualified material、selection generation、actor/context | `RunIntent`、request posture | 只表达意图；未确认不显示 running | Step 6/7/8 |
| 承接控制意图 | start/stop/cancel 用户 intent | `ControlIntent`、accepted/pending/unknown | unknown 冻结重放 | Step 6/8/9 |
| 展示 owner lifecycle | Sandbox/Runtime safe status/ref | `OwnerRunProjection`、execution view | owner attribution、freshness 和 restricted | Step 6/7/9 |

#### 代码主体

| 主体 | 类型 | 作用 | 后续位置 |
|---|---|---|---|
| `RunLifecycleService` / `ControlService` | Application | 编排请求和控制 | Step 7/8 |
| `RunIntent` / `ControlIntent` | Domain | Runner-owned intent truth | Step 6/9 |
| `OwnerRunProjection` | Projection | 组合正式 owner status/ref | Step 6/7 |
| `SandboxControlPort` / `RuntimeStatusPort` | Port | required public seam | Step 7 |

#### 对象发现线索

| 维度 | 候选 | Step 6 口径 |
|---|---|---|
| Truth/State | `RunIntent`、`ControlIntent` | 独立对象；不创建万能 RunnerRun。 |
| Policy/Invariant | accepted != running、generation/digest/lease match | 作为不变量和 guard。 |
| Projection | `OwnerRunProjection`、`ExecutionPostureView` | owner attributed view。 |
| Reference | SandboxRequestRef、RuntimeRunRef、BoundaryRef | safe ref。 |
| Audit/History | control/reconcile history | 记录 intent/receipt/result 分层。 |

#### 非职责与接缝

不执行 Runtime loop、不创建 Sandbox boundary、不把 ACK/PID/端口写成 running/terminal/cleanup。`RUN-UP-003/004/007/008` 未闭合时只能保守展示 blocked/unknown。

#### 停审记录

| 项目 | 结论 |
|---|---|
| capability→对象来源 | pass；intent、control、owner projection 分离。 |
| 状态来源 | pass；本地 intent 与 owner lifecycle 不混。 |
| 越层/悬空 | pass；无 Runtime/Sandbox truth 复制。 |

### 10.4 Resource, cleanup and recovery protection

#### 职责与 capability

| Capability | 输入 | 输出 | 状态/副作用 | 后续展开 |
|---|---|---|---|---|
| 本地 preflight | port/path/disk/process/platform probe | `ResourceObservation`、conflict view | 只观察，不分配全局资源 | Step 6/8 |
| 保护与清理意图 | lease/capture/handoff/retention/orphan refs | `ProtectionGuard`、cleanup posture | guard 未解除不删除/淘汰 | Step 6/8/9 |
| 断线/重启对账 | cursor/generation/connectivity、owner status | `RecoveryCase`、reconcile/manual-review | unknown 冻结危险副作用 | Step 6/8/10 |

#### 代码主体

| 主体 | 类型 | 作用 | 后续位置 |
|---|---|---|---|
| `ResourceRecoveryService` | Application | 编排 probe、保护、reconcile | Step 7/8 |
| `ReconcileJob` | Operations | 只读重查和本地视图重建 | Step 7/8 |
| `ResourceObservation` / `ProtectionGuard` / `RecoveryCase` | Domain | 资源、保护和恢复本地主语 | Step 6/9 |
| `PlatformResourcePort` / `OwnerCleanupPort` | Port | 本地观察与 owner cleanup seam | Step 7 |

#### 对象发现线索

| 维度 | 候选 | Step 6 口径 |
|---|---|---|
| Truth/State | `ResourceObservation`、`ProtectionGuard`、`RecoveryCase` | 独立展开；local/owner 视图分开。 |
| Policy/Invariant | active protection、no replay、cleanup guard | 作为 guard/invariant。 |
| Projection | `ResourceConflictView`、`CleanupPostureView`、`ConnectivityView` | 只读 view。 |
| Reference | LeaseRef、CleanupRef、cursor/generation refs | safe refs。 |
| Audit/History | reconcile/cleanup history | 记录对账和保护变化。 |

#### 非职责与接缝

不调度全局资源、不静默抢占端口、不证明 Sandbox cleanup 已完成、不在未知时自动重发 stop/cleanup。`RUN-UP-003/007` 保持 blocker。

#### 停审记录

| 项目 | 结论 |
|---|---|
| capability→对象来源 | pass；观察、保护、恢复各自有主语。 |
| owner/local 双视图 | pass；没有单侧成功推导。 |
| 越层/悬空 | pass；无 scheduler/reaper truth。 |

### 10.5 Preview, diagnosis and handoff

#### 职责与 capability

| Capability | 输入 | 输出 | 状态/副作用 | 后续展开 |
|---|---|---|---|---|
| 安全预览 | owner output refs、bounded summaries、freshness | `OutputPreview` | body-bounded、redacted、restricted 可见 | Step 6/7/8 |
| 失败解释 | owner/local failures、source refs、impact | `FailureDiagnosis` | 不猜测终态，不升级 verdict | Step 6/8/10 |
| 诊断 handoff | redacted summary、allowed refs | `HandoffPosture` | pending/accepted/blocked/delivered 不是 evidence | Step 6/7/9 |

#### 代码主体

| 主体 | 类型 | 作用 | 后续位置 |
|---|---|---|---|
| `PreviewService` / `DiagnosisService` / `HandoffService` | Application | 编排预览、诊断和 handoff | Step 7/8 |
| `OutputPreview` / `FailureDiagnosis` / `HandoffPosture` | Domain/Projection | 安全本地摘要与交接姿态 | Step 6/9 |
| `DiagnosticSourcePort` / `RedactionPort` / `ObservabilityHandoffPort` | Port | owner-safe 读取和交接 seam | Step 7 |

#### 对象发现线索

| 维度 | 候选 | Step 6 口径 |
|---|---|---|
| Truth/State | `FailureDiagnosis`、`HandoffPosture` | 独立展开；不成为正式审计 truth。 |
| Policy/Invariant | redaction/body bound/visibility | 作为安全不变量。 |
| Projection | `OutputPreview`、`DiagnosticSummaryView` | 只读、带 source/freshness。 |
| Reference | OutputRef、DiagnosticRef、HandoffRef | safe refs。 |
| Audit/History | local diagnostic/handoff history | 本地可追溯但标非正式审计。 |

#### 非职责与接缝

不保存 raw stdout/stderr/Artifact 正文/secret，不生成 evidence/report/verdict/signoff，不把 handoff ACK 写成审计完成。`RUN-UP-005/006/008` 未闭合时保持 restricted/blocked。

#### 停审记录

| 项目 | 结论 |
|---|---|
| capability→对象来源 | pass；preview、diagnosis、handoff 分层。 |
| 证据边界 | pass；本地摘要明确非正式 evidence。 |
| 越层/悬空 | pass；无 Archive/Observability truth。 |

### 10.6 Entry and presentation composition

#### 职责与 capability

| Capability | 输入 | 输出 | 状态/副作用 | 后续展开 |
|---|---|---|---|---|
| 多入口统一 | GUI/CLI/SDK/product action/query | application command/query | 不增加业务写源 | Step 7/8 |
| 逻辑页面组合 | local truth、owner projections、observations | `RunnerReadModel`、页面 view | read-only composition；restricted/unknown 显式 | Step 6/7 |
| 连接/生命周期展示 | connectivity、freshness、reconcile posture | `ConnectivityView`、next-step view | 不覆盖 source state | Step 6/9/10 |

#### 代码主体

| 主体 | 类型 | 作用 | 后续位置 |
|---|---|---|---|
| `RunnerEntryFacade` | Inbound/Application | 为所有入口提供共享用例边界 | Step 7/8 |
| `RunnerReadModelComposer` | Projection/Application | 组合安全 view | Step 6/7 |
| logical page presenters / CLI adapter | Inbound/Presentation | 映射产品入口，不持有规则 | Step 7 |
| `ConnectivityService` / `ConnectivityView` | Application/Projection | 连接和恢复姿态 | Step 6/9 |

#### 对象发现线索

| 维度 | 候选 | Step 6 口径 |
|---|---|---|
| Truth/State | local connection/reconcile posture | 只保留必要本地状态，不能覆盖 owner state。 |
| Policy/Invariant | no direct side effect、view source attribution | 作为入口约束。 |
| Projection | `RunnerReadModel`、`ConnectivityView` | 独立 view。 |
| Reference | source/freshness/visibility metadata | shared reference fields/objects。 |
| Audit/History | UI operation telemetry | 非正式审计；是否持久化留详细设计。 |

#### 非职责与接缝

不选择 UI 框架、不直连 SDK/DB/Sandbox、不写上游 truth、不把 toast/页面刷新当成功。

#### 停审记录

| 项目 | 结论 |
|---|---|
| capability→对象来源 | pass；入口、view、连接姿态可回指共享用例。 |
| 读写边界 | pass；页面只组合 view，写操作回到 facade/command。 |
| 越层/悬空 | pass；无技术产品定论。 |

## 11. 总体边界说明

六个部分共同覆盖 `CP-RUN-01~05`，但 ownership 始终分裂：Runner 只拥有选择、意图、取得/cache/验证姿态、local observation、保护/恢复姿态和安全展示；上游 owner 继续拥有 Release/authority、execution、boundary/lease/cleanup、observability/evidence、archive truth。任何 view 只能保留 source/freshness/visibility，并在 blocked/stale/unknown/restricted 时显式暴露限制。

## 12. Step 6 展开门禁

- [x] 每个候选对象均能回指某一部分 capability。
- [x] port、repository、page、DTO、外部 ref 与 domain object 已初步分层。
- [x] 选择、取得、生命周期、资源/恢复、诊断/handoff、入口 view 不能互相吞并。
- [ ] Step 6 需逐部分正式化字段/状态/函数；本文件不提前定义。

## 13. 跨组成部分闭环审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 核心需求覆盖 | pass | CP-RUN-01~05 均有组成部分承接；外围 FR-RUN-014~016 保持条件性。 |
| ownership 唯一 | pass | 本地 truth、owner projection、platform observation 和 view 分层。 |
| 对象候选来源 | pass | 每个 Step 6 候选都回指 capability；无孤儿对象。 |
| 接缝方向 | pass | 入口→应用→domain→port；跨域不直连内部实现。 |
| 状态来源 | pass | selection/material/request/execution/cleanup/diagnostic/connectivity 分轴，未引入万能 success。 |
| 共享对象 | pass | source/freshness/ref 等 shared support 不形成第二 truth；细节留 Step 6。 |
| 后续位置 | pass | 对象→Step 6，接口→Step 7，流程→Step 8，状态→Step 9。 |
| blocker 真实性 | pass | `RUN-UP-001~008` 仍限制正向 adapter，不被本地候选补齐。 |

## 14. 回填草稿

正式 §5 将从 §7、§8、§9 和各部分小节摘录六部分总表、对象发现维度表、交互总图和每部分职责/非职责/接缝；不回填本文件的逐部分停审过程和历史污染诊断。

## 15. 待确认事项

| 项目 | 当前口径 |
|---|---|
| 主要组成部分正式名称 | 当前六名已足够稳定进入 Step 6；若对象/接口反查发现职责重叠，必须回退本 Step。 |
| owner projection exact DTO | 仍受 `RUN-UP-001~008` 控制，只定义 safe ref/snapshot 所需能力。 |
| 外围能力 | 预取、比较、Archive 浏览不进入核心对象/接口/状态闭环。 |

## 16. 进入下一步条件

- [x] 已明确六个主要组成部分及职责/非职责。
- [x] 每部分已有 capability、代码主体、对象发现线索和接缝。
- [x] 已形成对象发现维度表和交互总图。
- [x] 六个部分均完成独立停审，跨部分闭环审计无 unresolved 冲突。
- [x] 未展开对象字段、函数、接口 schema、处理步骤或状态矩阵。

结论：`gate_status=pass`，允许进入 Step 6“关键对象轮廓”。
