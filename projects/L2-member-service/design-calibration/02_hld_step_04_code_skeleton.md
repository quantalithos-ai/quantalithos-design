# 02 概要校准 Step 4：代码主体框架映射

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 3 completed / pass
> 本步目的：把 A1~A5、S1~S3、P1~P3 转译为代码主体骨架，并严格区分业务主要组成部分与实现分层

## 1. Step 内计划

- [x] 读取 Step 2 目标 / 范围、Step 3 结构约束和正式 01 架构单元。
- [x] 回答架构语义如何落到入口、application、domain、port、persistence / projection / outbox 主体。
- [x] 诊断旧 02 用“宿主真相层 / 装配层 / 动作执行层”等混合维度分层的问题。
- [x] 选择七个业务主要组成部分候选，建立 A / S / P 映射。
- [x] 绘制必需的架构模块到代码主体映射图和实现分层视图。
- [x] 完成主体遗漏、依赖方向、pending seam 和非详细设计审计。
- [x] 形成正式第 4 章回填草稿与 Gate 自检。

## 2. 本步输入

| 输入 | 约束本步的结论 |
|---|---|
| Step 2 | 只展开 C-MS-1~5 与必要 S / P 支撑，不展开 E01~E04 独立主线 |
| Step 3 | 双锚、single writer、qualification、generation、local-first、入口权限和 seam 分类 |
| 正式 01 §6 | A1~A5、S1~S3、P1~P3 共同构成一个 Host Truth Center |
| 正式 01 §7~11 | 三运行角色、向内依赖、数据 owner、同步 / 异步 / background 和十项机制 |
| 概要书写规范 §4 | 两张必画图、关系说明表和关键判断；禁止目录 / 文件 / 完整类型定义 |

## 3. SOP 问题回答

### 3.1 架构模块分别应落到哪些代码主体骨架

| 架构语义 | 业务组成部分候选 | 关键代码主体骨架 | 说明 |
|---|---|---|---|
| A1 宿主意图与编排决定 | Host intent and orchestration decision | control entry、intent / decision application service、intent / decision truth、scope / idempotency guard | 同步形成权威接受和决定，不表示外部动作完成 |
| A2 宿主装配与就绪 | Host qualification and assembly | qualification / assembly service、qualification snapshot、assembly plan / result、readiness decision | S1 / P1 的外部输入只形成资格，不取得来源 owner |
| A2 + S2 宿主实例与承载动作 | Host instance and carrier progression | lifecycle progression service、host generation、carrier action attempt / outcome、carrier / registry / binding port | 外部副作用通过 adapter-neutral port，unknown 可对账 |
| A3 注册与 Host Session | Registration and Host Session | registration entry、registration / session service、registration acceptance、endpoint、Host Session、Member / Runtime placeholder port | Member 请求与 Runtime run 外置，活动关联唯一 |
| A4 健康与恢复 | Host health and recovery | signal consumer、health assessment service、recovery decision service、health conclusion、recovery decision | 四层健康与宿主处置，不读取 Runtime checkpoint |
| A5 生命周期收束与对账 | Host closure and reconciliation | closure service、cleanup / release progression、reconciliation job、closure / residual / finding truth | local cleanup、gap、orphan / drift 和处置归本仓 |
| S3 / P3 事实交接与只读消费 | Host fact handoff and safe consumption | material service、safe query service、projection / publication jobs、material / attempt / safe view / projection state | body-free、可迟滞、可重建，不拥有 external completion |
| P1 / P2 外部影子 | 分布于 qualification、carrier、registration、health、closure | typed source snapshot、association ref、freshness / resolution state | 影子依附业务责任，不建立独立“万能缓存组成部分” |

### 3.2 哪些主体属于 Inbound / Operations 与 Application Services

| 实现层 | 主体候选 | 责任上限 |
|---|---|---|
| Inbound / Operations | `HostControlCommandEntry`、`HostQueryEntry`、`HostRegistrationEntry`、`HostSignalConsumer`、`HostExternalFeedbackConsumer`、`HostOperationsJobs` | validation、mapping、dispatch；不做 domain transition 或直接 repository / port 调用 |
| Application Services | `HostIntentService`、`HostDecisionService`、`HostQualificationService`、`HostAssemblyService`、`HostLifecycleProgressionService`、`HostRegistrationService`、`HostSessionService`、`HostHealthService`、`HostRecoveryService`、`HostClosureService`、`HostReconciliationService`、`HostMaterialService`、`HostReadService` | 编排 use case、UoW、domain、repository、port、outbox / projection marker；不替代 domain invariant |

### 3.3 哪些主体属于 Domain、Ports、Persistence / Projection / Outbox

| 实现层 | 主体族 | 责任上限 |
|---|---|---|
| Domain Model / Policies | intent / decision、qualification / readiness、host / generation / action attempt、registration / endpoint / session、health / recovery、closure / residual / reconciliation、material / handoff、guard / policy / history | Host Truth、状态、不变量和纯判断；不读配置或外部正文 |
| Application Ports | subject / identity / image supply / credential resolver，Member / Runtime / Sandbox placeholder，host carrier / registry adapter，event publisher / handoff target，clock / id / UoW | 由 application 声明、infra 实现；每个 port 保持依赖类型和 owner ceiling |
| Persistence / History | aggregate repository、append-only history / audit、idempotency / stored result、outbox / attempt / gap store | 保存本仓 truth 与技术控制记录；不共享 sibling storage |
| Projection / Read | safe current view、history view、read projection、freshness / rebuild state | 从已提交 truth 派生；不反写或修复核心 |
| Adapters / Runtime Wiring | host carrier、registry、resolver、event / handoff、placeholder / fake adapter 和 runtime builder | 吸收产品 / protocol 差异；fake / placeholder 不进入 ready 证明 |

### 3.4 哪些名称必须在概要层先点名

- 七个业务主要组成部分候选必须先点名，否则详细设计会按 A / S / P 或技术层重新发明模块边界。
- application service、核心 truth / policy、外部 port、repository / history、projection / outbox 的主体族必须先点名。
- `MemberExecutionHost`、generation、readiness、registration / endpoint / Host Session、health / recovery、closure / residual / reconciliation、material / handoff / safe view 等结构主语必须有后续承接入口。
- 准确对象清单在 Step 6 冻结，准确 API / Port 名在 Step 7 冻结；本步名称是代码主体骨架，不是完整契约。

### 3.5 哪些属于详细实现，不在本步展开

- crate、module、file、package、binary、目录树和命名空间。
- Rust struct / enum / trait、完整函数签名、repository method、DTO 和 schema。
- HTTP / RPC / IPC / topic、serialization、database、table、index、transaction implementation。
- Docker / Kubernetes / registry / message / observability 产品与部署拓扑。

## 4. 当前材料诊断与取舍

| 旧 / draft 分层 | 问题 | 本轮取舍 |
|---|---|---|
| “成员执行宿主与运行会话 / 能力挂载 / 动作执行 / 恢复 / 反馈”五层 | 同时混合业务阶段、外部 owner 和实现层；包含 action execution / capability mount 越权 | 不采用 |
| draft 九个模块 | 较接近业务责任，但 orchestration、host truth、support / projection 粒度不一致 | 作为线索，不直接继承 |
| A1~A5 / S1~S3 / P1~P3 原样当模块 | 架构语义单元不是代码模块；A2 的资格与长时副作用、P1/P2 的依附责任仍需展开 | 不机械采用 |
| 七个业务组成部分 + 六类实现分层 | 能覆盖五节点核心和必要支撑，并保持业务“做什么”与代码“如何安放”正交 | 采用，Step 5 逐项冻结 |

关键取舍：A2 在概要层拆为“资格与装配”和“实例与承载推进”。前者拥有 required qualification / Host Readiness 的本地判定，后者拥有 generation 与 host-side side-effect attempt / outcome；二者仍属于同一个 Host Truth Center，不形成两个 readiness owner。

## 5. 架构模块到代码主体映射图

图类型：架构模块到代码主体映射图

图标题：L2-member-service Host Truth 业务主体骨架

```text
L2-member-service / Host Truth Center
|
+-- 1. Host intent and orchestration decision
|   +-- control command entry
|   +-- intent / decision application services
|   +-- intent / decision truth + scope / idempotency guards
|
+-- 2. Host qualification and assembly
|   +-- qualification / assembly application services
|   +-- source snapshots + qualification / readiness decisions
|   +-- subject / identity / image / credential resolvers
|
+-- 3. Host instance and carrier progression
|   +-- lifecycle progression application service
|   +-- execution host + immutable generation
|   +-- carrier / registry / Sandbox association ports and attempts
|
+-- 4. Registration and Host Session
|   +-- registration entry + registration / session services
|   +-- acceptance + endpoint + Host Session
|   +-- Member / Runtime placeholder ports
|
+-- 5. Host health and recovery
|   +-- signal intake + health / recovery services
|   +-- health conclusion + recovery decision
|   +-- freshness / generation guards
|
+-- 6. Host closure and reconciliation
|   +-- closure / reconciliation services and jobs
|   +-- cleanup / release attempt + gap / residual / finding
|   +-- external outcome association
|
+-- 7. Host fact handoff and safe consumption
    +-- material / read services + publication / projection jobs
    +-- body-free material + handoff attempt / gap
    +-- safe views + projection / publication state
```

关键说明：

- 七个编号项是业务主要组成部分候选；Step 5 将逐项校验 capability、非职责、候选对象和接缝后冻结。
- `entry`、`service`、`guard`、`port`、`repository`、`job` 是代码主体角色，不是新的业务子域。
- 图中 placeholder port 表示边界已被点名，不表示 Member / Runtime / Images / Sandbox 合同或真实集成已成立。
- 图不表达代码目录、文件、协议、数据库、产品或部署拓扑。

## 6. 实现分层视图

图类型：实现分层视图

图标题：L2-member-service 向内依赖与运行入口分层

```text
External commands / registrations / signals / feedback / jobs
                              |
                              v
+----------------------------------------------------------------+
| Inbound / Operations                                           |
| command + query entries | registration + signal consumers | jobs|
+------------------------------+---------------------------------+
                               |
                               v
+----------------------------------------------------------------+
| Application Services                                           |
| intent | qualification | lifecycle | session | health | closure |
| material | query | reconciliation                                |
+------------------------------+---------------------------------+
                               |
                               v
+----------------------------------------------------------------+
| Domain Model / Policies                                        |
| Host Truth objects | states | decisions | guards | history       |
+------------------------------+---------------------------------+
                               |
            +------------------+------------------+
            v                                     v
+-------------------------------+   +-----------------------------+
| Application Ports             |   | Persistence / Projection    |
| resolver / external capability |   | truth / history / outbox    |
| publisher / handoff / clock    |   | idempotency / safe read     |
+---------------+---------------+   +-----------------------------+
                |
                v
+----------------------------------------------------------------+
| Adapters / Runtime Wiring                                      |
| runtime / event / ref / adapter / fake bindings; product-neutral|
+----------------------------------------------------------------+
```

关键说明：

- 依赖方向向内：入口和 adapter 依赖 application contract，application 依赖 domain 与声明的 ports，domain 不依赖外部产品。
- Persistence / Projection 是技术承载责任；它服务所有业务组成部分，不是第八个业务组成部分。
- 同步入口、异步 consumer 和 operations job 可以同部署，但其写权限和完成语义保持独立。
- 图不表达 framework、crate、module、文件、数据库或具体 dependency injection 实现。

## 7. 业务主要组成部分与实现分层关系

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 七个候选回答“Host Truth 生命周期的哪段业务责任由谁承担”；它们沿 C-MS-1~5 和必要支撑划分。 |
| 实现分层 | Inbound / Operations、Application、Domain、Ports、Persistence / Projection、Adapters 回答“这些主体在代码依赖中如何安放”。 |
| 关系 | 每个业务组成部分可横跨多个实现层；每个实现层可承载多个业务组成部分。二者是正交维度，不能以 service / repository / adapter 名替代业务责任。 |
| 共享机制 | correlation、generation、idempotency、history、outbox、projection 和 UoW 横切多个组成部分，但不因此成为独立业务真相 owner。 |
| 外部系统 | Identity、Work、Images、Member、Runtime、Sandbox、Bus、SDK、carrier / registry 是 owner 或能力边界，不是本仓主要组成部分。 |

### 7.1 架构单元到组成部分候选映射

| 架构单元 | 主要组成部分候选 | 映射说明 |
|---|---|---|
| A1 | 1 | 一对一承接 intent / decision 核心 |
| A2 | 2、3 | 拆分资格 / readiness 与长时 carrier side effect，但共享 generation 和 Host Truth |
| A3 | 4 | 一对一承接 registration / endpoint / Host Session |
| A4 | 5 | 一对一承接 health / recovery decision |
| A5 | 6 | 一对一承接 closure / cleanup / reconciliation |
| S1 + P1 | 2 | qualification 的受控来源与影子输入 |
| S2 + P2 | 3~6 | carrier / Member / Runtime / Sandbox association 与允许反馈，按责任落到使用处 |
| S3 + P3 | 7 | material、handoff、safe projection 与外部 outcome summary |

## 8. 关键判断

- 业务主要组成部分候选只有七个；A / S / P 编号、实现层、外部 owner、运行角色和技术机制都不是额外组成部分。
- `Host qualification and assembly` 拥有本地 readiness 判定，不拥有 supply / credential / Sandbox / carrier truth。
- `Host instance and carrier progression` 只负责 host-side generation、attempt、outcome 与 association；它不是容器平台或 Sandbox execute owner。
- `Registration and Host Session` 的 session 只是宿主关联壳，不是 Runtime run。
- `Host fact handoff and safe consumption` 只形成 local material / attempt / gap 和可重建视图，不拥有 delivered / observed / accepted。
- Step 5 可以在不改变上述七项语义的前提下校准名称；若需新增或删除业务组成部分，必须回退本步重新审计。

## 9. 后续主体承接清单

| 主体类别 | Step 5 | Step 6 | Step 7 | Step 8 | Step 9 |
|---|---|---|---|---|---|
| 七个业务组成部分 | 冻结职责 / capability / 非职责 / 接缝 | 对象按归属展开 | 接口按归属展开 | flow 按归属展开 | 状态按归属展开 |
| application service | 作为代码主体点名 | 不作为 domain object | 内部 use-case / port 入口摘要 | 编排职责 | 不拥有状态 |
| domain truth / policy | 对象候选线索 | 独立对象卡片 | 作为输入输出 / 写入结果 | 参与判断与提交 | 承载状态 |
| port / repository | 接缝候选 | ref 对象按需；port 不升级对象 | 正式边界摘要 | 外部调用 / persistence 位点 | 外部状态不转成本地状态 |
| projection / outbox / history | 候选代码主体 | 对象轮廓 | Query / Event / Job | 派生 / 发布 flow | freshness / publication 状态 |

## 10. 正式第 4 章回填草稿

正式回填采用 §5、§6 两张图和 §7 关系表；将压缩 Step 4 的诊断、SOP 回答和后续清单，但保留七个业务组成部分候选、关键代码主体、向内依赖和 placeholder 非 ready 说明。

## 11. 待确认事项

- 七个名称在 Step 5 逐项停审后才正式冻结；当前不存在需要新增第八个业务组成部分的证据。
- exact crate / module / binary 与语言选择留给 03；本步不把治理 / Artifact 参考项目的 Rust 布局复制过来。
- `MSVC-UP-001~008` 只影响外部 port 的准确 contract，不阻塞本地 application / domain / persistence 骨架成立。

## 12. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 两张必画图完整 | pass | 映射图与实现分层图均含标题、text 图和关键说明 |
| 业务组成与实现分层未混用 | pass | 七个业务候选与六类实现层正交表达 |
| A / S / P 均有承接 | pass | 架构映射表无孤儿单元 |
| 核心与必要支撑均有代码主体入口 | pass | entry / service / domain / port / persistence / projection / outbox 已覆盖 |
| 未写目录 / 文件 / 完整契约 | pass | 只到主体骨架和职责层 |
| pending 未伪 ready | pass | placeholder / fake / product-neutral 上限明确 |
| 足以进入 Step 5 | pass | 可按七个候选逐项完成 capability、对象线索和边界停审 |

```text
step_04_status = completed
step_04_gate = pass
formal_02_write_allowed = false
next_allowed_step = Step 5 components_and_boundaries
```
