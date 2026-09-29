# Step 4. 代码主体框架映射

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 4。

### Step 内计划

- [x] 读取项目 ledger、02 flow、Step 2~3、正式 01 §6~11。
- [x] 核验专项上游当前状态，区分 required port 与已存在合同。
- [x] 回答架构单元、运行承载与实现分层的映射问题。
- [x] 诊断旧 02 按 storage/index/restore 动作平铺和 provider 混层。
- [x] 输出两张必需图、双轴关系表、shared boundary 判断和自检。

## 2. 本步输入

Step 2 的范围/深度，Step 3 的 16 条约束，正式 01 U1~U6、三运行角色、依赖裁剪、数据与通信。上游核验只证明 owner 边界存在，不证明 exact export/receiver API ready。

## 3. SOP 问题回答

1. U1~U6 分别落为 CP1 请求与作业、CP2 来源绑定与采集、CP3 Bundle 清单与闭包、CP4 完整性与兼容、CP5 存储与生命周期执行、CP6 恢复计划与交接。
2. 同步入口、异步 consumer、operations job 属 Inbound/Operations；各 CP service 属 Application；本仓 truth/invariant 属 Domain；外部 owner/storage/receiver 与本地 store 属 Ports/Adapters/Persistence。
3. 必须先点名 aggregate/value/projection/history record、application service、query composition、port 和 job 角色；字段与完整接口留后续 Step。
4. U1~U6 是业务主要组成轴，不等于六个 crate、进程或部署；运行三角色也不是业务 CP。
5. 外部 owner、Bus、SDK、provider 只能作为 port/adapter 对端，不能被画进本仓内部主体。

## 4. 当前文档问题诊断

旧 02 以“快照固化、索引检索、保留分层、恢复导出、历史观察”拆部分，混合技术动作、产品消费和治理权；ArchiveIndex 容易变成新的业务查询 truth，RetentionClass/LegalHold 越权，historical review 又属于消费面。当前按正式 U1~U6 建业务轴，并把 read/verify 作为组合查询服务，不新增 truth 部分。

## 5. 改动前后对比

| 旧框架 | 当前框架 |
|---|---|
| snapshot/index/retention/restore/query 五动作平铺 | CP1~CP6 与正式 U1~U6 责任一一承接 |
| ArchiveIndex 成为统一历史 truth | 查询组合本仓已承载状态，不替 source truth |
| Retention/LegalHold 作为领域主体 | GovernanceDecisionRef 输入 + LifecycleExecution 本地记录 |
| worker/storage/provider 与领域对象同层 | Inbound/Application/Domain/Ports 四类实现层正交 |

## 6. 设计取舍

- 保持六 CP，不进一步拆 read/verify 或 compensation；它们分别是跨 CP 查询组合和 CP5/CP6 内的失败收敛能力。
- 每个 CP 可跨多层实现；同一 application/infrastructure 层也可承接多个 CP。03 再决定模块/文件布局。
- 本轮允许点名 required port，不声称 port 对端或共享 Core 类型已存在；`AR-ARCH-001` 下无 SDK compile 主体。

## 7. 结构化中间产物

### 7.1 架构到代码主体映射

| 架构单元 | 主要组成部分 | 代码主体骨架 |
|---|---|---|
| U1 Request & Job Coordination | CP1 请求与作业协调 | `ArchiveRequestService`、`ArchiveRequest`、`ArchiveJob`、`ArchiveStorePort` |
| U2 Source Authority & Capture Binding | CP2 来源绑定与采集 | `SourceCaptureService`、`ArchiveSourceBinding`、`CaptureAttempt`、`SourceExportPort` |
| U3 Bundle Manifest & Content Closure | CP3 Bundle 清单与闭包 | `BundleAssemblyService`、`ArchiveBundle`、`BundleManifest`、`ManifestEntry` |
| U4 Integrity & Compatibility Assessment | CP4 完整性与兼容评估 | `BundleVerificationService`、`VerificationAssessment`、`CompatibilityAssessment`、`IntegrityCapabilityPort` |
| U5 Storage & Lifecycle Execution | CP5 存储与生命周期执行 | `PlacementService`、`LifecycleExecutionService`、`ArchivePlacement`、`LifecycleExecution`、`ArchiveStoragePort` |
| U6 Restore Planning, Material & Owner Handoff | CP6 恢复计划与交接 | `RestoreService`、`RestorePlan`、`RestoreItem`、`RestoreHandoff`、`RestoreReceiverPort` |
| U3/U4/U5 read composition | 只读组合面（非独立 CP） | `ArchiveQueryService`、`ArchiveBundleView`、`BundleVerificationView` |

#### 架构模块到代码主体映射图

```text
L4-archive
├─ CP1 请求与作业协调
│  └─ ArchiveRequestService / ArchiveRequest / ArchiveJob
├─ CP2 来源绑定与采集
│  └─ SourceCaptureService / ArchiveSourceBinding / CaptureAttempt
├─ CP3 Bundle 清单与闭包
│  └─ BundleAssemblyService / ArchiveBundle / BundleManifest
├─ CP4 完整性与兼容评估
│  └─ BundleVerificationService / VerificationAssessment
├─ CP5 存储与生命周期执行
│  └─ PlacementService / LifecycleExecutionService / ArchivePlacement
└─ CP6 恢复计划与交接
   └─ RestoreService / RestorePlan / RestoreItem / RestoreHandoff
```

关键说明：

- 六个 CP 承接 U1~U6 的稳定业务责任，图不表示六个部署、crate 或事务。
- `ArchiveQueryService` 横跨 CP3~CP5 的只读视图，不获得 capture/repair/restore 写能力。
- 外部 owner、storage、integrity、receiver 通过 port 进入，不是图中的内部业务组成部分。

#### 实现分层视图

```text
operation request / query / owner event / external feedback / scheduled work
                              │
                              ▼
                 Inbound / Operations
         command handlers / consumers / jobs
                              │
                              ▼
                 Application Services
       request / capture / assembly / verify /
        placement / lifecycle / restore / query
                              │
                              ▼
                 Domain Model + Contracts
       aggregates / values / assessments / history
                              │
                              ▼
          Ports / Persistence / External Adapters
    local store | source | decision | integrity | storage | receiver
```

关键说明：

- 业务 CP 说明“负责什么”，实现分层说明代码主体“安放在哪里”，两者不可互换。
- Application 只编排本仓状态和外部意图；Domain 不依赖 provider/SDK/sibling 实现。
- Ports 只声明本地所需边界；Adapters 是否可实现受 `AR-UP-*` 约束。
- 图不表达目录、文件、完整 trait、schema、数据库或部署结构。

### 7.2 业务轴与实现分层关系

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | CP1~CP6 是从正式 U1~U6 下沉的业务结构主语。 |
| 实现分层 | Inbound/Operations、Application、Domain、Ports/Persistence/Adapters 是代码安放方式。 |
| 运行承载 | sync admission/read、background execution、async feedback 是部署/执行角色，可承载多个 CP。 |
| 关系 | 一个 CP 可跨所有实现层；一个运行角色或实现层可承接多个 CP。 |
| shared boundary | request/actor/project/source/decision/version/fence/coverage/ref/error 等类型只在 Core exact 符号核验后复用，否则保持本地边界类型。 |
| persistence | 本仓 store 只保存 Archive-owned truth；不共享 owner/provider 表或事务。 |
| event/outbox | 可为本仓已提交事实保留传播角色，但 outbound family 未经合同核验时只作候选，不能宣称 Bus topic ready。 |

### 7.3 关键判断

六 CP、四类实现层和三运行角色是三条正交轴。Step 5 按六 CP 发现 capability 和对象候选；Step 6~9 必须沿相同 CP 逐项反查。只读组合、reconcile 与 compensation 作为跨 CP 或部分内 capability，不通过新增 truth 部分制造第七/第八 owner。

## 8. 回填草稿

正式 §4 摘录 §7 两图、映射表、双轴关系和关键判断；不写模块路径或上游接口已实现。

## 9. 待确认事项

Core exact contract、outbound event family、各 source/receiver port 的可实现性继续受 `AR-UP-*` / `AR-ARCH-001` 阻塞，不影响 Step 5 基于 required capability 展开。

## 10. 进入下一步条件

两张必需图完整；CP、实现层与运行承载未混层；required port 未被写成已存在合同。`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 5。
