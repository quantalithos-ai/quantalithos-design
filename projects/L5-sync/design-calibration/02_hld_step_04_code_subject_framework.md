# Step 4. 代码主体框架映射

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；Step 1~3 已通过。
- `gate_status=pass_with_upstream_blockers`；两张规范要求的 ASCII 图与双轴判断已完成。
- 本步点名概要代码主体，不表达目录、crate/package、语言、框架或已有实现。

### Step 内计划

1. 回读正式 01 五个架构单元、运行单元、依赖方向、数据/通信与 Step 2~3。
2. 将架构单元映射为 application/domain/port/persistence/adapter 主体候选。
3. 绘制“架构模块到代码主体映射图”和“实现分层视图”。
4. 审计业务组成部分与实现分层无混用、无第六 truth 部分、无外部对象内化。
5. 形成正式 §4 回填草稿并更新 flow/台账。

## 2. 本步输入

| 输入 | 采用内容 |
|---|---|
| Step 2 §7 | 目标、范围、P0/P1 与设计深度 |
| Step 3 §7 | 22 条硬约束及五部分预映射 |
| 正式 01 §6 | 五个业务组成部分和 External Owner References 支撑层 |
| 正式 01 §7~8 | 本地运行单元与 entry/application/core/ports/adapters 依赖方向 |
| 正式 01 §9~10 | local truth、refs/snapshots、关键交互和 query/mutation 分离 |

## 3. SOP 问题回答

1. **架构模块落到哪些主体？** 五部分分别落到 SelectionAccessService、WorkingCopyService/MetadataService、MaterializationService、ConflictRecoveryService、ReviewHandoffService 等 application 主体及其 domain objects/policies/ports；共享 read/status、operation coordination 与 external ref 支撑跨五部分但不成为新业务 truth。
2. **分层如何归类？** CLI/maintenance 是 Inbound/Operations；用例编排属于 Application Services；本地 truth 与 policies 属 Domain；外部能力由 Ports 定义；`.qs-sync` 属 local persistence；SDK/Git/filesystem/observability 是 adapters。
3. **Domain 与 Ports 如何区分？** Domain 决定 explicit/fail-closed/non-overwrite/transition 等本地规则；Ports 只描述执行这些规则所需的 owner/tool/store 能力，adapter 不得反向裁决。
4. **必须先点名哪些名称？** 四个 CLI 主命令、五个 application service、StatusQueryService、OperationCoordinator、MetadataStore/UnitOfWork、OwnerAccess/Source/Handoff ports、Git/Filesystem/Diagnostics adapters 和五部分的对象族。
5. **哪些不应展开？** 源码路径、模块文件、framework command parser、database table、具体 SDK client、Git 命令、完整 trait/struct 定义全部后置。

## 4. 当前文档问题诊断

旧 02 的代码主体围绕 `SyncTask`、fanout、event replay 和跨端 projection，无法映射当前五部分；draft 又列出九个候选模块，将 local truth core、adapters、diagnostics 等实现/横切层与业务部分并列。若照搬，会把“业务负责什么”和“代码放在哪层”混为一轴，并重复定义 owner truth。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 旧 `SyncTask`/fanout 是中心主体 | `SyncOperation` 与五部分协作形成受控本地主线 |
| 九个候选模块混合业务/实现/横切概念 | 五个业务组成部分固定；实现分层正交映射 |
| 外部系统被内化为同步子模块 | 外部 owner 只经 capability ports + ref/snapshot 支撑 |
| CLI、store、adapters 和 read surface 不成体系 | 各层先点名概要主体并明确依赖方向 |

## 6. 设计取舍

- 保持正式 01 的五部分，不按 identity/work/artifact/workspace/governance/archive 各建内部模块；owner 差异落在 ports/adapters 与 ref kind。
- `OperationCoordinator`、`SyncStatusQueryService`、local persistence 和 External Owner References 是共享代码支撑，不升级为第六业务组成部分。
- `MetadataStore` 表示 `.qs-sync` 受控持久化抽象；具体单文件/多文件/数据库与 schema 留给 03/04。
- Inbound 只获得 application contract；不会直接持有 SDK、Git、filesystem 或 store mutation adapter。

## 7. 结构化中间产物

### 7.1 架构模块到代码主体映射

| 架构业务部分 | Application 主体 | Domain 主体族 | Ports / persistence / adapters | 入口/查询关联 |
|---|---|---|---|---|
| Selection & Access | `SelectionAccessService` | `SyncSelection`、`AccessEvaluation`、`OperationEligibilityPolicy` | `OwnerAccessPort`、`OwnerReferenceStore`、SDK access adapter | 四命令前置门禁；`status` 只读现有快照 |
| Working Copy & Metadata | `WorkingCopyService`、`MetadataMaintenanceService` | `WorkingCopyBinding`、`MetadataManifest`、`CursorState`、`MappingSet` | `MetadataStore`、`LocalStateUnitOfWork`、`FilesystemPort`、`GitObservationPort` | `clone` bind；metadata inspect/migrate/rebind maintenance |
| Source Materialization | `MaterializationService` | `MaterializationPlan`、`SourceDelta`、`PathChangeSet`、`MaterializationRun` | `MaterialSourcePort`、`GitWorktreePort`、`FilesystemApplyPort` | `clone` initial apply；`pull` incremental apply |
| Conflict & Recovery | `ConflictRecoveryService`、`RecoveryProbeService` | `ConflictRecord`、`RecoveryCheckpoint`、`ManualResolution`、`ProbeRecord` | `RecoveryProbePort`、`LocalStateUnitOfWork`、Git/fs observation | resolve/resume/probe maintenance；status read |
| Review Handoff & Provenance | `ReviewHandoffService`、`ProvenanceService` | `ReviewCandidate`、`HandoffAttempt`、`ProvenanceRecord`、`LayeredHandoffStatus` | `ReviewHandoffPort`、`ReviewDecisionReadPort`、`DiagnosticsPort` | `push-review`；handoff/decision/provenance query |

#### 架构模块到代码主体映射图

```text
L5-sync controlled local synchronization
├─ Selection & Access
│  ├─ SelectionAccessService / OperationEligibilityPolicy
│  └─ OwnerAccessPort / OwnerReferenceStore
├─ Working Copy & Metadata
│  ├─ WorkingCopyService / MetadataMaintenanceService
│  └─ MetadataStore / LocalStateUnitOfWork / local observation ports
├─ Source Materialization
│  ├─ MaterializationService / MaterializationPlan
│  └─ MaterialSourcePort / GitWorktreePort / FilesystemApplyPort
├─ Conflict & Recovery
│  ├─ ConflictRecoveryService / RecoveryProbeService
│  └─ RecoveryProbePort / checkpoint and conflict repositories
└─ Review Handoff & Provenance
   ├─ ReviewHandoffService / ProvenanceService
   └─ ReviewHandoffPort / ReviewDecisionReadPort / DiagnosticsPort
```

关键说明：

- 五个顶层名称是业务主要组成部分；其下主体是概要层 planned contracts，不表示已有类、文件或实现。
- External owner refs 通过各部分的 port/store 使用，不成为第六个业务 truth 组成部分。
- 图不表达具体目录、语言、协议 schema、线程、部署单元或运行调用顺序。
- Shared `OperationCoordinator` 与 `SyncStatusQueryService` 横跨五部分，但只编排/读取，不获得额外 ownership。

### 7.2 实现分层视图

#### 实现分层视图

```text
CLI / maintenance trigger / SDK-facing query
                       │
                       ▼
Inbound / Operations
CloneCommandEntry / PullCommandEntry / StatusQueryEntry / PushReviewCommandEntry
                       │
                       ▼
Application Services
OperationCoordinator + five-part services + SyncStatusQueryService
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
Domain Model / Policies          Ports
local truth + guards             owner / source / handoff / Git / fs / diagnostics
             │                   ▲
             ▼                   │
Local metadata persistence       Adapters
MetadataStore / UnitOfWork       SDK / Git / filesystem / observability
```

关键说明：

- 业务组成部分跨越多个实现层；实现层不能用来替代五部分的职责边界。
- Entry 只解析显式意图和展示 typed result；所有 mutation 经过 Application + Domain guard。
- Domain 不依赖具体 SDK、Git、filesystem 或持久化实现；adapters 实现 inward-defined ports。
- Query service 只组合已持久化 local truth、Git/fs observation 与允许的只读快照，不触发 refresh/repair/probe。
- 图不决定 crate/package、框架、进程、数据库或具体 adapter 产品。

### 7.3 分层主体清单

| 实现层 | 代码主体骨架 | 作用 | 禁止事项 / 后续位置 |
|---|---|---|---|
| Inbound / Operations | `CloneCommandEntry`、`PullCommandEntry`、`StatusQueryEntry`、`PushReviewCommandEntry`、`MetadataMaintenanceEntry`、`RecoveryOperationsEntry` | 解析显式 input、调用 application、映射安全输出 | 不直接调用 concrete adapters；Step 7 展开接口 |
| Application | `OperationCoordinator`、五部分 services、`SyncStatusQueryService` | 编排门禁、local transition、ports 和 typed results | 不承载 owner truth；Step 5/7/8 展开 |
| Domain Model | `SyncOperation`、五部分对象族、guards/policies、result states | 承载 local truth/invariant 和状态迁移 | 不依赖设施；Step 6/9 展开 |
| Ports | owner access/source/handoff/decision/probe、Git/fs、clock/id、diagnostics contracts | 表达 core 所需最小能力 | 不复制 provider body/schema；Step 7 展开 |
| Local persistence | `MetadataStore`、`LocalStateUnitOfWork`、各 local repository/projection | 受控保存 `.qs-sync` 逻辑主题与只读 view | 物理 schema 留 03/04；Step 6/7 展开 |
| Adapters | SDK owner adapters、Git adapter、filesystem adapter、metadata adapter、diagnostics adapter | 翻译正式 facility 并执行白名单动作 | 不裁决 domain/owner truth；Step 7/10 展开 |

### 7.4 共享主体与业务部分关系

| 共享主体 | 使用方 | 为什么不是独立业务部分 |
|---|---|---|
| `SyncOperation` / `OperationCoordinator` | 五部分 | 描述一次本地用例的关联与编排，不拥有独立业务 truth |
| `SyncStatusQueryService` / status view builders | 五部分 | 只读聚合各部分状态，不产生新生命周期 |
| External owner ref/snapshot objects | 五部分 | 是边界引用，不复制 owner 实体或授权 |
| `LocalStateUnitOfWork` / metadata repositories | 五部分 | 是一致性/持久化机制，不定义业务能力 |
| Clock/ID/diagnostics/redaction support | 五部分 | 横切支持，不决定 sync success 或 Governance verdict |

### 7.5 关键判断

1. 五个业务组成部分是 Step 5~9 的固定小循环主轴，不因实现层或 adapter 数量改变。
2. `SyncOperation` 是本地 operation aggregate/coordination anchor，不是旧 `SyncTask`、平台 job 或 Review lifecycle。
3. `.qs-sync` 是逻辑 local persistence boundary；本步不锁 `metadata.json` 或任何物理布局。
4. SDK/Git/filesystem/observability 均属于 adapter 侧；只有 ports 的有限语义进入 application/domain。
5. Outbound domain event / outbox 当前不作为核心主体：本地 CLI 主线不需要声明平台事件发布；若 03 发现可靠本地派生通知需求，须回退 02 重审，不能暗增。

## 8. 回填草稿

正式 §4 摘录 §7.1~7.5 的映射表、两张图、分层主体清单与关键判断。正文明确所有名称是 planned design contract，未声称仓库已有代码。

延伸阅读入口指向本文件的“架构模块到代码主体映射”“实现分层视图”“共享主体与业务部分关系”和“关键判断”。

## 9. 待确认事项

- `SYNC-UP-001` 阻止 ports 到真实 SDK 方法/错误的映射；`SYNC-UP-006` 阻止 local persistence 物理形态定稿。
- `SYNC-UP-007/009/010` 阻止 Git adapter 支持矩阵、LFS/shallow/GUI 和完整路径保护实现定稿。
- 上述缺口不改变 inward port 与 fail-closed 主体，但受影响 adapter 只能进入 03 的 blocked/planned 承接。

## 10. 进入下一步条件

- [x] 两张必需 ASCII 图符合标题、字符、方向和图后说明规范。
- [x] 五个业务组成部分与实现分层已分开，无第六 truth 部分。
- [x] Step 5~9 所需服务、对象族、ports/persistence/adapters 已点名且不等于已有代码。
- [x] 没有外部系统对象内化、具体目录/框架/schema 或跨层依赖。
- [x] 历史 `SyncTask`、九模块与固定 metadata 污染未继承。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 5。此结论仅为文档静态自检。
