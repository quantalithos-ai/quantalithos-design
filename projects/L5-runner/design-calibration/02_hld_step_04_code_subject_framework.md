# Step 4. 代码主体框架映射

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 4 / 代码主体框架映射 |
| 状态 | `completed` |
| 当前模块 | `code_subject_framework:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 六个业务主要组成部分候选与六类实现分层已按双轴映射；两张必画图、关系说明和关键判断齐全，未落入目录、框架或完整实现。 |
| next_allowed_action | `read_and_start_step_05` |
| 正式正文写入 | `blocked_until_step_14` |

### 1.1 Step 内计划

- [x] 恢复项目台账、02 flow 与 Step 3 门禁。
- [x] 读取概要 SOP Step 4、书写规范 §4.4 与 ASCII 图规则。
- [x] 从正式 01 §6～11 提取语义上下文、运行角色、分层、数据与交互输入。
- [x] 回答五个 SOP 问题，形成业务轴与实现轴映射。
- [x] 输出映射表、两张必画图、关系说明和关键判断。
- [x] 后置扫描旧 02/README/draft，完成自检并同步 flow / 台账。

### 1.2 写入前检查

- 当前只允许 Step 4；正式 02 仍不可写。
- 本步可以点名 service/object/port/projection/job 骨架，但这些名称须在 Step 5～7 继续校准。
- 不把 Artifact、Governance、Runtime、Sandbox、Observability 等外部系统当本仓代码模块。
- 不锁语言、目录、桌面壳、进程模型、数据库、协议或 Sandbox backend。
- `RUN-UP-001~008` 只允许 required port 骨架，不证明 adapter 可用。

## 2. 本步输入

| 输入 | 本步使用 |
|---|---|
| Step 2 | 结构目标、范围、逻辑入口和详细设计交接上限。 |
| Step 3 | ownership、显式版本、多轴状态、依赖、no-write、保护和证据门禁。 |
| 正式 01 §6 | 六个业务语义上下文及 owner/platform shadow。 |
| 正式 01 §7～8 | 同步入口、本地视图/意图、取得/恢复、诊断/预览、依赖分层。 |
| 正式 01 §9～10 | local truth / external snapshot/ref / observation 分层和同步/异步/后台交互。 |
| 正式 01 §11～13 | 可替换机制、取舍与横切边界。 |

## 3. SOP 问题回答

### 3.1 架构模块分别落到哪些代码主体骨架

- “选择与资格承接”映射为选择/资格 application service、显式选择与资格 domain 主语、上下文/Release/authority required ports。
- “取得与材料资格承接”映射为取得/验证 application service、后台 job、取得任务/cache/material qualification 主语及 locator/transport/verifier/cache ports。
- “本地运行意图与生命周期”映射为运行/控制 application service、运行意图/控制意图/owner lifecycle projection 及 Sandbox/Runtime required ports。
- “资源、清理与恢复保护”映射为 preflight/cleanup/reconcile services、resource observation/protection/reconcile 主语及 platform/owner cleanup ports。
- “输出预览与失败诊断”映射为 preview/diagnosis/handoff services、safe view/diagnostic/handoff 主语及 Observability/Archive/redaction ports。
- “端侧入口与展示”映射为 logical page presenters、CLI/product inbound、read-model composer 和 operations triggers；所有入口只调用 application use case。
- Owner 状态影子和本地平台影子不是独立业务组成部分，而是跨组成部分的 projection/reference/observation 代码主体。

### 3.2 Inbound / Operations 与 Application Services

- Inbound：逻辑页面 action/query、CLI/SDK/product command/query adapter、正式事件 consumer。
- Operations：download/verification worker、owner-state reconcile、cache protection/eviction review、connection recovery、safe projection maintenance。
- Application Services：选择资格、材料准备、运行生命周期、资源恢复、预览诊断和入口 view 编排；它们组织用例但不持有外部 truth。

### 3.3 Domain、Ports、Persistence、Projection 与 Handoff

- Domain Model 承载 Runner-owned selection/generation、intent、qualification posture、protection/reconcile 和证据边界规则。
- Ports 定义本地存储、平台观察及跨域 required capabilities；Adapters 未来实现这些 port，但在 blocker 关闭前保持 blocked。
- Persistence 只保存 local truth、保护元数据和 safe refs；不保存外部正文。
- Projection/View Model 组合 owner snapshot/ref、local truth 和 observation，带 source/freshness/visibility，不反写来源。
- Handoff 只承接 redacted diagnostic intent/receipt，不迁移 Observability/Archive ownership。
- 当前不建立泛化 Outbox 主语：正式 outbound event family 尚未闭合；本地 operation record 或 handoff posture 不能伪装成全局 event/outbox truth。

### 3.4 概要层必须先点名的名称

必须先点名六个业务主要组成部分候选、`RunnerEntryFacade`、六类 application services、Runner-owned 关键主语候选、owner projection/reference、platform observation、本地 persistence ports 与 external required ports。否则 03 会按页面、外部服务或历史技术重新发明结构。名称仍须经 Step 5 capability 和 Step 6 对象正式化审计。

### 3.5 本步不展开的实现内容

不写 crate/package/module/file 路径、handler/class/trait 完整定义、DTO/schema、HTTP/RPC/topic、数据库表、DI、线程/进程、GUI 框架、下载算法、完整性算法、重试/超时数值、平台命令或 backend 产品。

## 4. 当前文档问题诊断

| 历史倾向 | 风险 | 当前修正 |
|---|---|---|
| 旧 02 以 run/queue/card/control/output/hint 五块组织 | 从“已有运行”出发，遗漏选择、资格、材料和清理保护 | 改用正式 01 六个语义方向，并从显式选择开始。 |
| draft 直接列十个业务模块 | 将语义细分提前固化成实现模块数量 | Step 4 收敛为六个候选组成部分；Step 5 再按 capability 校准。 |
| README 以 Tauri/Rust/Docker 和目录表达代码主体 | 产品/目录反向定义业务边界 | 采用业务轴 + 实现分层轴，不选择载体。 |
| 把外部系统名当内部 module | 容易产生 ArtifactModule/SandboxModule 等 shadow owner | 外部能力只以 required port/adapter role 进入。 |
| 把 owner shadow 和 platform shadow当业务域 | 投影/观察会被误作 truth | 作为跨组件 projection/reference/observation 支撑。 |

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 页面/外部系统/技术栈混合成第一层结构 | 六个业务组成部分回答“做什么”，六类实现分层回答“代码放哪里”。 |
| 一个 RunnerRun 可能聚合全部状态 | 各业务部分有独立 local 主语与 owner projection，多轴组合只在 view 层。 |
| 外部 client 可能由入口直接调用 | 所有入口经 `RunnerEntryFacade`/application services；external adapter 位于 ports 外侧。 |
| 下载、恢复、诊断作为零散后台逻辑 | Operations jobs 只触发正式 use case，仍受 domain 门禁。 |
| 技术产品决定模块 | 技术承载满足 port，不决定业务主语。 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 GUI 页面划分 | 产品直观 | CLI/SDK 复用差，页面绕过核心门禁 | 不采用。 |
| 按上游系统划分 Artifact/Governance/Sandbox modules | adapter 对齐直观 | 复制 owner 语义，形成 shadow domains | 不采用。 |
| 直接继承 draft 十模块 | 覆盖细 | 未经 capability 推导，模块边界过早 | 不采用。 |
| 六个业务组成部分 + 六类实现分层 | 承接 01 且能稳定展开对象/接口/流程 | 需要 Step 5～9 逐部分深化 | 采用。 |
| 把 OwnerProjection/PlatformObservation 设为第七、第八业务部分 | 横切数据显眼 | 将支撑形态误作独立业务目的 | 不采用，保留为 shared code subjects。 |

## 7. 结构化中间产物

### 7.1 架构模块到代码主体映射表

| 架构语义 / 运行角色 | 业务主要组成部分候选 | 代码主体骨架 | 实现分层 | 边界 |
|---|---|---|---|---|
| 选择与资格承接 | 可信选择与资格 | `SelectionQualificationService`、`ReleaseSelection`、`QualificationPosture`、`ContextPort`、`ReleaseAuthorityPort` | Application / Domain / Ports | 拥有选择与本地资格姿态，不拥有 Release/approval。 |
| 取得与材料资格承接 | 材料取得与验证 | `MaterialAcquisitionService`、`MaterialVerificationService`、`AcquisitionJob`、`AcquisitionTask`、`QualifiedMaterial`、`MaterialSourcePort`、`MaterialCachePort` | Operations / Application / Domain / Ports | 区分传输、quarantine、验证、晋级与保护。 |
| 本地运行意图与生命周期 | 运行意图与生命周期 | `RunLifecycleService`、`ControlService`、`RunIntent`、`ControlIntent`、`OwnerRunProjection`、`SandboxControlPort`、`RuntimeStatusPort` | Application / Domain / Projection / Ports | Local intent 与 owner execution truth 分离。 |
| 资源、清理与恢复保护 | 资源、清理与恢复 | `ResourceRecoveryService`、`ReconcileJob`、`ResourceObservation`、`ProtectionGuard`、`ReconcileCase`、`PlatformResourcePort`、`OwnerCleanupPort` | Operations / Application / Domain / Ports | Local observation 与 owner allocation/lease/cleanup 双视图。 |
| 输出预览与失败诊断 | 预览、诊断与交接 | `PreviewDiagnosisService`、`DiagnosticHandoffService`、`SafeOutputPreview`、`FailureDiagnosis`、`DiagnosticHandoff`、`DiagnosticSourcePort`、`RedactionPort` | Application / Domain / Projection / Ports | Bounded/redacted，非 evidence/verdict。 |
| 端侧入口与展示 | 入口与展示编排 | `RunnerEntryFacade`、logical page presenters、CLI/product inbound、`RunnerReadModelComposer` | Inbound / Application / Projection | 多入口共享 use case，不直连 adapter/storage。 |
| Owner 状态与来源引用影子 | 各部分共享支撑 | `OwnerSnapshotRef`、`SourceFreshness`、owner projection repositories | Projection / Persistence | 可重建、带来源，不反写 owner。 |
| 本地平台能力影子 | 资源/入口共享支撑 | `PlatformObservation`、platform observation repository | Projection / Persistence / Ports | 短时观察，不是 allocation/lease truth。 |

### 7.2 架构模块到代码主体映射图

#### 架构模块到代码主体映射图

```text
L5-runner
|
+-- 1. 可信选择与资格
|   +-- SelectionQualificationService
|   +-- ReleaseSelection / QualificationPosture
|   +-- ContextPort / ReleaseAuthorityPort
|
+-- 2. 材料取得与验证
|   +-- MaterialAcquisitionService / MaterialVerificationService
|   +-- AcquisitionTask / QualifiedMaterial
|   +-- AcquisitionJob / MaterialSourcePort / MaterialCachePort
|
+-- 3. 运行意图与生命周期
|   +-- RunLifecycleService / ControlService
|   +-- RunIntent / ControlIntent / OwnerRunProjection
|   +-- SandboxControlPort / RuntimeStatusPort
|
+-- 4. 资源、清理与恢复
|   +-- ResourceRecoveryService / ReconcileJob
|   +-- ResourceObservation / ProtectionGuard / ReconcileCase
|   +-- PlatformResourcePort / OwnerCleanupPort
|
+-- 5. 预览、诊断与交接
|   +-- PreviewDiagnosisService / DiagnosticHandoffService
|   +-- SafeOutputPreview / FailureDiagnosis / DiagnosticHandoff
|   +-- DiagnosticSourcePort / RedactionPort
|
+-- 6. 入口与展示编排
    +-- RunnerEntryFacade / logical page presenters
    +-- CLI / SDK-product inbound adapters
    +-- RunnerReadModelComposer
```

关键说明：

- 六个部分是待 Step 5 逐个停审的业务结构主语，不代表六个进程、包或部署单元。
- `OwnerSnapshotRef`、`SourceFreshness` 和 `PlatformObservation` 横跨多个部分，但不形成新的 truth domain。
- 图中 port 是 Runner 所需边界，不声明相邻 owner 已提供同名 API 或真实 adapter。
- 图不表达代码目录、完整对象定义、协议、调用时序或技术产品。

### 7.3 实现分层视图

#### 实现分层视图

```text
用户动作 / CLI-SDK 调用 / 正式 owner 信号 / 运维触发
                         |
                         v
+-------------------------------------------------------+
| Inbound / Presentation / Operations                   |
| logical pages | command/query adapters | consumers/jobs|
+---------------------------+---------------------------+
                            v
+-------------------------------------------------------+
| Application Services                                  |
| selection | acquisition | lifecycle | recovery | diag |
+---------------------------+---------------------------+
                            v
+-------------------------------------------------------+
| Domain Model / Policies                               |
| local truth | qualification | protection | state rules|
+---------------------------+---------------------------+
                            |
             +--------------+--------------+
             v                             v
+---------------------------+  +--------------------------+
| Persistence / Projection  |  | Required Ports           |
| local state / safe views  |  | owner / platform / clock |
+---------------------------+  +------------+-------------+
                                           v
                               Adapters (blocked where
                               RUN-UP-001~008 remains open)
```

关键说明：

- 入口和 Operations 只能触发 application use case；它们不能直接写 storage 或调用 Sandbox 私有实现。
- Domain 只依赖 Runner-owned rules 与稳定共享契约语义，不依赖 UI、SDK client、平台 API 或数据库产品。
- Projection 组合 local truth、safe owner snapshot/ref 和 local observation，但不得在读取时产生副作用。
- Adapter 是否可实现取决于真实 owner 合同；图中的层次不是 readiness 声明或部署拓扑。

### 7.4 业务主要组成部分与实现分层关系说明

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 可信选择与资格、材料取得与验证、运行意图与生命周期、资源清理恢复、预览诊断交接、入口展示编排；回答 Runner 业务结构“做什么”。 |
| 实现分层 | Inbound/Presentation/Operations、Application、Domain、Persistence/Projection、Ports、Adapters；回答代码主体“如何安放与依赖”。 |
| 关系 | 一个业务部分会跨多个实现层；同一实现层可服务多个业务部分。组成部分不可直接等同包、crate、进程或页面。 |
| Shared boundary | `OwnerSnapshotRef`、`SourceFreshness`、`PlatformObservation`、correlation/actor/context 等稳定语义可被多个部分使用，但不能形成万能共享对象或第二 truth。 |
| Persistence | 只保存 local truth、protection metadata 与 safe refs；具体 store/schema/transaction 留给 03。 |
| Event/Outbox | 可预留 consumer/relay 边界；无正式 event family 前不建立宣称可用的 outbound event 或 outbox。 |

### 7.5 关键判断

1. 六个名称是本轮概要设计的业务主要组成部分候选；Inbound/Application/Domain/Ports 等仅是实现分层。
2. 端侧入口虽然是业务组成部分，但逻辑页面、CLI adapter 和 view composer 只是其中的代码主体，不是独立 truth owner。
3. Owner projection/reference 与 platform observation 是跨部分支撑；任何 view 中的“running”“cleaned”“approved”仍必须带正式 source。
4. Required port 表达 Runner 需要什么能力；真实方法、DTO、协议、版本与可用性须等待 `RUN-UP-001~008`。
5. 不采用历史五部分、draft 十模块或正式 01 六语义的一对一机械源码映射；Step 5 将按 capability 证明六个候选是否成立。

## 8. 回填草稿

正式 §4 使用 §7.2、§7.3 两图以及 §7.4 关系表，并摘录 §7.5 关键判断。正式正文不收录问题回答、历史诊断或方案比较。

## 9. 待确认事项

- 六个候选组成部分需在 Step 5 通过 capability、对象线索、接缝与非职责逐个停审后才能正式化。
- Service/object/port 名称需分别在 Step 5～7 校准；本步命名不是完整实现合同。
- 是否需要正式 inbound/outbound events 取决于 owner event seam；当前不假定 event family 或 outbox 存在。

## 10. 进入下一步条件

- [x] 两张必画 ASCII 图及图后说明齐全。
- [x] 架构语义到代码主体映射完整，业务轴与实现轴未混用。
- [x] 外部系统只以 required port/ref/snapshot 进入，没有成为本仓内部 truth module。
- [x] 未写目录、完整 trait/struct、schema、数据库、框架或部署结构。
- [x] 正式 02 未修改，未来 Step 文件未提前创建。

结论：`gate_status=pass`，允许进入 Step 5“主要组成部分、职责与边界”。
