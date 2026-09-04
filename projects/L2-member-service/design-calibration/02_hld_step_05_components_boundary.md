# 02 概要校准 Step 5：主要组成部分、职责与边界

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 4 completed / pass
> 本步目的：冻结七个业务主要组成部分，逐项收稳 capability、代码主体、对象候选、非职责和接缝，再执行跨组成部分闭环审计

## 1. Step 内计划

- [x] 读取 Step 4 双轴主体框架和七个业务组成部分候选。
- [x] 回答组成部分划分、职责、功能、对象维度和易串线边界问题。
- [x] 诊断旧五层 / draft 九模块与正式 A / S / P 的差异。
- [x] 形成组成部分总表、capability 索引、对象发现维度表和交互总图。
- [x] 逐项停审 1：Host intent and orchestration decision。
- [x] 逐项停审 2：Host qualification and assembly。
- [x] 逐项停审 3：Host instance and carrier progression。
- [x] 逐项停审 4：Registration and Host Session。
- [x] 逐项停审 5：Host health and recovery。
- [x] 逐项停审 6：Host closure and reconciliation。
- [x] 逐项停审 7：Host fact handoff and safe consumption。
- [x] 执行跨组成部分对象、职责、接缝、状态和后续展开审计。
- [x] 形成正式第 5 章回填草稿与 Gate 自检；通过前未创建 Step 6。

## 2. 本步输入与问题回答

| SOP 问题 | 收稳回答 |
|---|---|
| 本仓划分为哪些主要组成部分 | 冻结前候选为七项：意图与决定、资格与装配、实例与承载推进、注册与 Host Session、健康与恢复、收束与对账、事实交接与安全消费。 |
| 划分轴是什么 | 按 C-MS-1~5 的正式业务责任和 necessary supporting responsibility 划分，不按代码层、外部系统或生命周期时间片机械拆分。 |
| 每部分 capability 如何发现 | 从正式 FR / IB、A / S / P 职责、数据 owner、关键交互和 HLC-MS-001~019 反推输入、输出、状态影响与后续 Step。 |
| 对象如何发现 | 每部分分别检查 truth / state、policy / invariant、projection / read、reference / boundary、audit / history 五个维度。 |
| 最易串线处 | readiness vs external supply、host generation vs backend resource、Host Session vs Runtime run、health conclusion vs signal、local cleanup vs external completion、material vs delivered / observed。 |
| 不在本步展开什么 | 对象字段 / 函数 / 状态细节、API contract、完整 flow、协议、repository、产品与实现；分别留给 Step 6~9 或 03。 |

复杂度判断：七个部分、28 项 capability、29 个拟正式化对象跨越五个核心节点，不能压成单表。采用“全局索引 -> 每部分独立小循环 -> 跨部分审计”的单文件分批结构；对象字段与函数继续留给 Step 6。

## 3. 当前材料诊断与划分取舍

| 候选结构 | 主要问题 | 结论 |
|---|---|---|
| 旧 02 五层 | 包含 capability mount 与 action execution；业务阶段和实现层混用 | 排除 |
| draft 九模块 | 边界方向有用，但 assembly / host truth / support / projection 粒度不一致，早于正式 01 | 只作候选线索 |
| A1~A5 + S1~S3 + P1~P3 共十一部分 | 架构语义单元机械变代码模块；P 层会成为独立写源风险 | 排除 |
| 七个业务组成部分 | A2 的资格与外部副作用可分责，S / P 依附明确，覆盖 C-MS-1~5 且无 action truth 越界 | 采用并在本步逐项冻结 |

## 4. 组成部分总表

| ID | 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|---|
| `CMP-MS-01` | Host intent and orchestration decision | 接受项目型宿主意图，形成稳定的 scope / acceptance / orchestration decision 与历史 | control entry、intent / decision services、`HostIntent`、`HostOrchestrationDecision`、`HostControlPolicy` | Work / Identity truth、authorization truth、外部动作完成 |
| `CMP-MS-02` | Host qualification and assembly | 收束 required 外部资格、装配分项和 Host Readiness 本地结论 | qualification / assembly services、`HostQualificationContext`、`HostAssembly`、`HostReadinessDecision`、`RequiredQualificationPolicy` | image / credential / Sandbox / carrier truth 或 fallback |
| `CMP-MS-03` | Host instance and carrier progression | 建立不可变 generation，推进 host-side carrier / registry / binding 动作并关联保守结果 | progression service、`MemberExecutionHost`、`HostActionAttempt`、`HostExternalAssociation`、`HostGenerationFence` | 容器平台产品 truth、镜像内容、逐动作 Sandbox execute |
| `CMP-MS-04` | Registration and Host Session | 受理可信注册，维护唯一 endpoint 和 Host Session 壳及替换 / 失效历史 | registration entry、registration / session services、`HostRegistration`、`HostEndpoint`、`HostSession`、`RegistrationSessionPolicy` | Member 主体、Runtime run / checkpoint、IPC 实现 |
| `CMP-MS-05` | Host health and recovery | 承接允许信号，形成四层健康、失败分类和宿主侧处置决定 | signal consumer、health / recovery services、`HealthSignalSnapshot`、`HostHealthAssessment`、`HostFailureClassification`、`HostRecoveryDecision` | Runtime recovery、业务结果、backend / observed truth |
| `CMP-MS-06` | Host closure and reconciliation | 形成下线收束、cleanup / release local attempt、residual / orphan / drift 和对账处置 | closure / reconciliation services / jobs、`HostClosure`、`CleanupAttempt`、`ResidualFinding`、`ReconciliationCase` | external cleanup completed、删除外部资源、修复 sibling truth |
| `CMP-MS-07` | Host fact handoff and safe consumption | 从已提交 truth 形成 body-free material、outbox / handoff 状态和可重建 safe view | material / read services、publication / projection jobs、`HostFactMaterial`、`HostHandoffRecord`、`SafeHostView`、`HostProjectionState`、`HostOutboxRecord`、`HostHistoryEntry` | Bus delivery、Observability observed、consumer accepted、报告 / evidence 正文 |

## 5. Capability 总索引

| ID | 组成部分 | Capability | 主要输入 | 主要输出 / 状态影响 | 后续展开 |
|---|---|---|---|---|---|
| `CAP-MS-01` | CMP-01 | 接受项目型宿主意图 | source / actor、ProjectMemberRef、GlobalMemberRef、correlation | accepted / rejected / waiting scope conclusion | §6 HostIntent；§7 Command；§8 intent flow；§9 intent state |
| `CAP-MS-02` | CMP-01 | 形成编排决定 | accepted intent、current host facts、requested action | launch / recover / restart / stop / terminate / relocate / hold / no-action decision | §6 decision；§7 Command；§8 decision flow；§9 decision state |
| `CAP-MS-03` | CMP-01 | 重复 / 并发 / 冲突判定 | idempotency / correlation、existing intent / decision | replay result 或 conflict；不生成第二 truth | §6 policy；§8 common write；§10 conflict |
| `CAP-MS-04` | CMP-01 | 决定与当前关联安全读取 | subject / intent / decision ref | body-free current / history summary | §7 Query；§8 query；CMP-07 safe view |
| `CAP-MS-05` | CMP-02 | 解析 required 资格来源 | Work / Identity / Images / credential / Sandbox / carrier refs | source resolution / freshness / qualification context | §6 context；§7 resolver ports；§8 qualification flow |
| `CAP-MS-06` | CMP-02 | 形成宿主装配 | accepted decision、qualified sources、environment requirements | assembly truth 与分项状态 | §6 assembly；§7 Command / ports；§8 assembly flow |
| `CAP-MS-07` | CMP-02 | 记录分项本地结果 | matching generation、external safe outcome | item result / unknown / gap，不取得外部 truth | §6 assembly；§7 feedback consumer；§8 outcome flow |
| `CAP-MS-08` | CMP-02 | 判定 Host Readiness | required item results、freshness、generation | ready / blocked / waiting / failed / unknown decision | §6 readiness；§8 readiness flow；§9 readiness state |
| `CAP-MS-09` | CMP-03 | 建立并 fence host generation | launch / replacement decision、subject | unique current generation / conflict | §6 host / fence；§8 generation flow；§9 host state |
| `CAP-MS-10` | CMP-03 | 发起 host-side lifecycle action | committed decision / attempt / generation | local action attempt，再调用 external port | §6 attempt；§7 ports / jobs；§8 progression flow |
| `CAP-MS-11` | CMP-03 | 关联外部动作结果 | attempt ref、safe external result / timeout | succeeded / failed / unknown local outcome | §6 attempt / association；§7 consumer；§8 outcome flow |
| `CAP-MS-12` | CMP-03 | 维护 carrier / registry / Sandbox 关联 | typed external refs、generation | active / stale / release-pending association | §6 association；§9 association state；CMP-06 closure |
| `CAP-MS-13` | CMP-04 | 受理 / 拒绝可信注册 | Member registration placeholder、credential ref、generation | registration acceptance / rejection / replacement | §6 registration；§7 Command placeholder；§8 registration flow |
| `CAP-MS-14` | CMP-04 | 维护 endpoint | accepted registration、safe endpoint material | unique active / stale / invalid endpoint | §6 endpoint；§7 Query；§9 endpoint state |
| `CAP-MS-15` | CMP-04 | 建立 Host Session 壳 | active host / endpoint、Runtime association placeholder | unique Host Session / blocked association | §6 session；§7 Runtime port；§8 session flow |
| `CAP-MS-16` | CMP-04 | 替换 / 失效接入关联 | replacement / closure / generation change | old association invalidated，history preserved | §6 session policy；§8 invalidation flow；§9 session state |
| `CAP-MS-17` | CMP-05 | 承接并验证健康信号 | Member / session / carrier / binding signal safe summary | accepted / stale / ignored signal snapshot | §6 signal snapshot；§7 Consumer；§8 signal flow |
| `CAP-MS-18` | CMP-05 | 形成四层宿主健康 | verified signals、current generation / session | host / session / backend / unknown assessment | §6 health；§8 assessment flow；§9 health state |
| `CAP-MS-19` | CMP-05 | 分类宿主失败 | health assessment、action / association outcomes | source-specific failure classification | §6 failure；§9 failure state；§10 exceptions |
| `CAP-MS-20` | CMP-05 | 形成宿主侧处置决定 | current host facts、health / failure、formal control | recover / restart / stop / terminate / hold decision | §6 recovery；§7 Command；§8 recovery flow |
| `CAP-MS-21` | CMP-06 | 开启并推进本地收束 | termination / replacement / release decision、current associations | closure state、local invalidations | §6 closure；§7 Command；§8 closure flow |
| `CAP-MS-22` | CMP-06 | 推进 cleanup / release | committed cleanup decision / attempt、external refs | attempt / result / gap / residual | §6 cleanup；§7 Job / port；§8 cleanup flow |
| `CAP-MS-23` | CMP-06 | 识别残留 / 孤儿 / 漂移 | Host Truth 与允许 external summaries | residual finding / unknown | §6 finding；§7 Job；§8 reconcile flow |
| `CAP-MS-24` | CMP-06 | 形成对账处置 | finding、history、current generation | repair-request / hold / escalate / resolved / unknown disposition | §6 case；§8 reconcile flow；§9 reconciliation state |
| `CAP-MS-25` | CMP-07 | 形成 body-free 宿主材料 | committed Host Truth / history | fact material + outbox pending；不含正文 | §6 material / outbox；§7 Event；§8 material flow |
| `CAP-MS-26` | CMP-07 | 推进并记录 per-target handoff | outbox / material、target ref、feedback summary | attempt / delivered-summary / gap；source truth no rollback | §6 handoff；§7 Job / Consumer；§8 publish flow |
| `CAP-MS-27` | CMP-07 | 提供安全当前 / 历史读取 | authorized query、truth / projection | SafeHostView / history page + freshness | §6 view / history；§7 Query；§8 read flow |
| `CAP-MS-28` | CMP-07 | 维护与重建安全投影 | committed truth cursor、projection state | fresh / stale / rebuilding / degraded projection | §6 projection；§7 Job；§8 rebuild flow；§9 projection state |

## 6. 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| CMP-01 | `HostIntent`、`HostOrchestrationDecision` | `HostControlPolicy` | decision slice 并入 `SafeHostView` | intent source / subject refs 仅作字段类型 | `HostHistoryEntry` | `HostIntent`、`HostOrchestrationDecision`、`HostControlPolicy` |
| CMP-02 | `HostQualificationContext`、`HostAssembly`、`HostReadinessDecision` | `RequiredQualificationPolicy` | qualification slice 并入 `SafeHostView` | Identity / Work / Images / credential / binding refs 为字段类型 | qualification history 并入 `HostHistoryEntry` | 四个 truth / policy 对象全部独立展开 |
| CMP-03 | `MemberExecutionHost`、`HostActionAttempt`、`HostExternalAssociation` | `HostGenerationFence` | carrier safe slice 并入 `SafeHostView` | backend / registry / binding typed refs 为 association 字段 | attempt history 保留在对象 + `HostHistoryEntry` | 四个对象全部独立展开 |
| CMP-04 | `HostRegistration`、`HostEndpoint`、`HostSession` | `RegistrationSessionPolicy` | endpoint / session slice 并入 `SafeHostView` | Member / Runtime association refs 为字段 | replacement history 并入 registration / session + `HostHistoryEntry` | 四个对象全部独立展开 |
| CMP-05 | `HealthSignalSnapshot`、`HostHealthAssessment`、`HostFailureClassification`、`HostRecoveryDecision` | freshness / generation guard 由 assessment / decision 行为承接 | health slice 并入 `SafeHostView` | signal source / external feedback refs 为字段 | assessment / decision history 并入 `HostHistoryEntry` | 四个对象全部独立展开 |
| CMP-06 | `HostClosure`、`CleanupAttempt`、`ResidualFinding`、`ReconciliationCase` | closure / reconciliation guard 由对象行为承接 | reconciliation slice 并入 `SafeHostView` | cleanup / release / resource refs 为字段 | cleanup / reconciliation history 并入对象 + `HostHistoryEntry` | 四个对象全部独立展开 |
| CMP-07 | `HostFactMaterial`、`HostHandoffRecord`、`HostOutboxRecord` | material boundary 由 material / handoff 行为承接 | `SafeHostView`、`HostProjectionState` | target / publication / external outcome refs 为字段 | `HostHistoryEntry` | 六个对象全部独立展开 |

## 7. 各部分交互总图

图类型：主要组成部分交互总图

图标题：L2-member-service 从宿主意图到安全交接的组成部分协作

```text
formal subject / intent
          |
          v
+---------+---------+     source refs / snapshots
| CMP-01 intent /   |             |
| decision          |             v
+---------+---------+     +-------+---------+
          +-------------> | CMP-02 qualify /|
                           | assemble / ready|
                           +-------+---------+
                                   |
                                   v
                           +-------+---------+
                    +----> | CMP-03 host /   | <---- carrier / registry /
                    |      | carrier progress|       Sandbox safe outcomes
                    |      +-------+---------+
                    |              |
        recovery /  |              v
        release     |      +-------+---------+ <---- Member registration
                    +------+ CMP-04 register /| ----> Runtime association
                           | Host Session     |
                           +-------+---------+
                                   |
                                   v
                           +-------+---------+ <---- health signals
                           | CMP-05 health /  |
                           | recovery         |
                           +-------+---------+
                                   |
                                   v
                           +-------+---------+
                           | CMP-06 closure / | ----> cleanup / release ports
                           | reconciliation   |
                           +-------+---------+
                                   |
       committed truth from CMP-01~06
                                   v
                           +-------+---------+
                           | CMP-07 material /| ----> Bus / authorized consumers
                           | safe consumption |
                           +-----------------+
```

关键说明：

- 箭头表达成立依赖与概要交接，不表示协议、完整调用链、事务或详细时序。
- CMP-03 的回边承接 CMP-05 recovery decision 与 CMP-06 release decision；外部动作仍经 port，不能由健康信号或 job 隐式触发。
- CMP-07 只消费 CMP-01~06 已提交 truth，形成 material / projection；它不反写前序组成部分。
- Member、Runtime、Images、Sandbox、Bus 和 carrier / registry 均是外部 seam，不是图中新增业务组成部分。

## 8. 全局候选筛选规则

| 名称类别 | Step 6 处理 |
|---|---|
| §6 表中“必须独立展开”的 29 个名称 | 逐组成部分建立对象卡片；不得组合成一张全仓表 |
| `ProjectMemberRef`、`GlobalMemberRef`、各 external ref、metadata、correlation、generation id 等 | 作为概要字段类型；由 Core / owner 定义，不升级为本仓对象 |
| API / DTO / request / result / event payload / job input | 留给 Step 7，不作为 domain object |
| repository / UoW / resolver / publisher / carrier / Sandbox / Member / Runtime port | 留给 Step 7 / 03，不作为 domain object |
| entry / consumer / trigger / service / job runner | 作为代码主体与 flow 参与者，不作为 domain object |
| table / index / cache / container / pod / backend SDK response | 详细设计或外部产品；禁止进入 Step 6 |

## 9. CMP-MS-01：Host intent and orchestration decision

### 9.1 本部分职责

本部分是 C-MS-1 的权威入口和决定 owner。它验证正式 source、项目型双锚、scope 与相关锚，形成 acceptance、conflict、waiting、no-action 和宿主生命周期决定；它只承诺本地决定已成立，不承诺装配或外部动作完成。

### 9.2 本部分功能 / capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| CAP-MS-01 接受项目型意图 | actor / source、双锚、requested lifecycle intent、correlation | `HostIntent` 或 rejection / waiting | 写 intent / history；无外部副作用 | Step 6 / 7 / 8 / 9 |
| CAP-MS-02 形成编排决定 | accepted intent、current host / closure facts | `HostOrchestrationDecision` | 写 decision / history / outbox marker；不直接调用 carrier | Step 6 / 7 / 8 / 9 |
| CAP-MS-03 重复 / 冲突判定 | normalized intent identity、已有 intent / decision | replay / conflict / no-action | 不创建第二 decision | Step 6 policy；Step 8 common write；Step 10 |
| CAP-MS-04 安全读取 | subject / intent / decision ref、query context | decision / current association safe slice | 只读，无状态变化 | Step 7 Query；Step 8 Query；CMP-07 view |

### 9.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `HostControlCommandEntry` | inbound entry | 接收 host intent / control command，完成边界 mapping | Step 7 / 8；handler 细节留 03 |
| `HostIntentService` | application service | 编排 intent acceptance、幂等、repository 与 history | Step 8；完整契约留 03 |
| `HostDecisionService` | application service | 编排 current fact 读取、decision policy 与提交 | Step 8；完整契约留 03 |
| `HostIntent` | domain truth | 表达已受理 / 拒绝语境和项目型执行范围 | Step 6 / 9 |
| `HostOrchestrationDecision` | domain decision truth | 表达正式 lifecycle decision、依据与替代关系 | Step 6 / 9 |
| `HostControlPolicy` | domain policy / guard | 约束双锚、scope、idempotency、冲突与允许 action | Step 6；完整规则留 03 |
| intent / decision repositories | persistence port family | 保存本地 truth 与当前索引 | Step 7 boundary；完整 trait 留 03 |

### 9.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `HostIntent` | 独立成节；表达 source、双锚、requested action、acceptance，不保存 Work / Identity 正文 |
| Decision Truth | `HostOrchestrationDecision` | 独立成节；表达 action / no-action、依据、supersede 与 local status |
| Policy / Invariant | `HostControlPolicy` | 独立成节；表达双锚、scope、idempotency / conflict 和 current-host guard |
| Projection | decision slice 并入 `SafeHostView` | 不新建 CMP-01 第二 view；由 CMP-07 独立展开 |
| Reference | source ref、ProjectMemberRef、GlobalMemberRef、correlation | 只作字段类型；不升级为本仓对象 |
| Audit / History | `HostHistoryEntry` | 由 CMP-07 统一展开，必须能记录 intent / decision change |

### 9.5 本部分不承担什么

- 不创建、暂停、释放 ProjectMember，不改变 GlobalMember lifecycle 或 authorization truth。
- 不判定 image / credential / Sandbox / carrier qualification，不形成 Host Readiness。
- 不调用 container / registry / Sandbox，也不把 decision 写成 side effect completed。
- 不根据 Query、heartbeat、backend observed state 或 projection 隐式生成 lifecycle decision。

### 9.6 与其他部分的接缝

- 向 CMP-02 提供 accepted launch / assembly decision；向 CMP-03 提供已提交 lifecycle action decision。
- 接受 CMP-05 的健康 / failure facts和正式 control 语境作为 recovery decision 输入，但 health signal 本身不成为 decision。
- 接受 CMP-06 的 closure / residual facts作为补偿或 no-action 输入，不让 reconciliation job直接创建 decision。
- 向 CMP-07 提供已提交 intent / decision / history，不直接发布外部事件。

### 9.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否清楚 | pass | CAP-MS-01~04 覆盖接受、决定、冲突和读取 |
| 候选对象是否有功能来源 | pass | 三个对象分别来自 acceptance、decision 与 guard |
| 接缝是否清楚 | pass | 决定先于 CMP-02/03，健康 / 对账只提供已提交输入 |
| 禁止事项是否清楚 | pass | 不拥有 L1 truth、不调用外部 side effect、不由读 / 信号隐式决定 |
| 是否越界 | pass | 未定义 Work / Identity / authorization / carrier contract |

停审结论：`CMP-MS-01` completed / pass；名称、职责、CAP-MS-01~04 和三个 Step 6 对象候选冻结。

## 10. CMP-MS-02：Host qualification and assembly

### 10.1 本部分职责

本部分是 C-MS-2 的 required qualification 与 Host Readiness owner。它把外部 typed ref / safe snapshot / freshness 与本地 environment requirement 组织为 qualification context，形成装配分项事实和本地 readiness decision；外部供给、credential、binding 与 carrier truth 始终外置。

### 10.2 本部分功能 / capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| CAP-MS-05 解析资格来源 | accepted decision、subject / identity / supply / credential / binding / carrier refs | `HostQualificationContext` | 写 source state / freshness；解析失败非 ready | Step 6 / 7 / 8 / 9 |
| CAP-MS-06 形成宿主装配 | qualified context、environment requirements、generation | `HostAssembly` | 写 required item set / local status；外部动作由 CMP-03 | Step 6 / 7 / 8 / 9 |
| CAP-MS-07 记录分项本地结果 | assembly / generation、matching safe outcome | updated `HostAssembly` | item attempt / result / unknown 追加；不冒认外部 truth | Step 6 / 7 / 8 / 9 |
| CAP-MS-08 判定 Host Readiness | current qualification / assembly item results | `HostReadinessDecision` | ready / blocked / waiting / failed / unknown；写 history / outbox marker | Step 6 / 8 / 9 |

### 10.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `HostQualificationService` | application service | 调用 owner resolvers，保存 safe source state 并执行资格规则 | Step 8；port / UoW 细节留 03 |
| `HostAssemblyService` | application service | 形成 / 更新 assembly，调用 readiness policy | Step 8；完整契约留 03 |
| `HostQualificationContext` | context / snapshot object | 绑定 subject、来源 ref、safe status、freshness 与 generation | Step 6 / 9 |
| `HostAssembly` | domain aggregate | 保存 required item set、分项 local outcome 和当前装配事实 | Step 6 / 9 |
| `HostReadinessDecision` | domain decision record | 保存 readiness 结论、缺口与依据 | Step 6 / 9 |
| `RequiredQualificationPolicy` | domain policy / guard | 判断 required items、freshness、generation 与 no-fallback | Step 6；完整规则留 03 |
| qualification resolver port family | external runtime / ref ports | 解析 Identity / Work / Images / credential / Sandbox / carrier 安全输入 | Step 7；exact contracts pending |
| assembly / readiness repositories | persistence port family | 保存本地 qualification / assembly / decision truth | Step 7 boundary；完整 trait 留 03 |

### 10.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Context / Snapshot | `HostQualificationContext` | 独立成节；必须表达 source、captured-at / freshness、resolution / conflict 和 forbidden-body 边界 |
| Truth / State | `HostAssembly` | 独立成节；分项 outcome 与 overall readiness 分开，绑定 generation |
| Decision Truth | `HostReadinessDecision` | 独立成节；ready / non-ready 结论、missing item 与依据不可被外部状态覆盖 |
| Policy / Invariant | `RequiredQualificationPolicy` | 独立成节；required set、freshness、no fallback、partial 非 ready |
| Projection | qualification / assembly slice 并入 `SafeHostView` | CMP-07 统一展开，不建第二写源 |
| Reference | owner refs、pinned supply ref、credential ref、Sandbox binding ref、carrier capability ref | 仅作字段类型；准确 schema pending |
| Audit / History | `HostHistoryEntry` | CMP-07 统一展开，必须承接 source / assembly / readiness changes |

### 10.5 本部分不承担什么

- 不解析 Role -> image，不拥有 manifest / image / provenance evidence body。
- 不签发、撤销、保存或输出 credential secret；只消费 instance-bound safe ref / qualification。
- 不建立 Sandbox isolation environment 或判断 policy enforcement；只消费 host binding 允许输入。
- 不以 container started、registry pull accepted、Member registered 或 Runtime available替代 Host Readiness。
- 不用默认值、旧缓存、local allowlist 或 host fallback 补齐 required item。

### 10.6 与其他部分的接缝

- 消费 CMP-01 accepted decision和 CMP-03 current generation；向 CMP-03 提供装配所需 local plan / readiness prerequisite。
- qualification resolver 只读取外部 owner 的 ref / safe snapshot；`MSVC-UP-003/004/006/007` 未闭口时 positive item blocked。
- CMP-03 返回 matching generation 的 carrier / registry / binding local outcome；CMP-02 只把它记录为本地分项结果。
- 向 CMP-04 提供 Host Readiness；registration 不能反向证明 readiness。
- 向 CMP-07 交付已提交 qualification / assembly / readiness facts。

### 10.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否清楚 | pass | CAP-MS-05~08 覆盖来源、装配、分项结果和 readiness |
| 候选对象是否有功能来源 | pass | context、aggregate、decision、policy 各有独立责任 |
| 接缝是否清楚 | pass | CMP-02 判 readiness，CMP-03 推外部动作；registration 不反推 |
| 禁止事项是否清楚 | pass | 不拥有供给 / credential / Sandbox / carrier truth，无 fallback |
| 是否越界 | pass | exact sibling fields 保持 pending；未创建 capability mount / image parser |

停审结论：`CMP-MS-02` completed / pass；名称、职责、CAP-MS-05~08 和四个 Step 6 对象候选冻结。

## 11. CMP-MS-03：Host instance and carrier progression

### 11.1 本部分职责

本部分承接 A2 / S2 的 host generation 与外部副作用推进。它在正式决定下建立逻辑 `MemberExecutionHost`，以 local attempt / generation fence 调用 carrier、registry 和适用的 Sandbox host binding 接缝，并把结果保守映射为本地 association / outcome；产品资源状态不能定义 Host Truth。

### 11.2 本部分功能 / capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| CAP-MS-09 建立 / fence generation | accepted launch / replacement decision、current host | `MemberExecutionHost` current generation 或 conflict | 本地强一致写 host / current pointer / history | Step 6 / 8 / 9 |
| CAP-MS-10 发起 lifecycle action | committed decision、host / assembly、generation | `HostActionAttempt` | 先写 attempt / fence，再调用 external port | Step 6 / 7 / 8 / 9 |
| CAP-MS-11 关联动作结果 | attempt、matching safe result / timeout | updated attempt / host local outcome | succeeded / failed / unknown；可能触发 CMP-02/05/06 | Step 6 / 7 / 8 / 9 |
| CAP-MS-12 维护外部关联 | carrier / registry / binding typed refs、generation | `HostExternalAssociation` | active / stale / release-pending / invalid；不拥有外部 lifecycle | Step 6 / 9；CMP-06 release |

### 11.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `HostLifecycleProgressionService` | application service | 编排 generation、attempt、external port 与 local outcome | Step 8；transaction / call ordering 留 03 |
| `MemberExecutionHost` | domain aggregate | 表达逻辑宿主、执行主语、generation、current lifecycle 与关联索引 | Step 6 / 9 |
| `HostActionAttempt` | domain side-effect record | 表达一次 host-side lifecycle / asset / binding / release attempt 与保守结果 | Step 6 / 9 |
| `HostExternalAssociation` | reference / association object | 保存 carrier / registry / Sandbox 等 typed ref 与本地关联状态 | Step 6 / 9 |
| `HostGenerationFence` | domain policy / guard | 拒绝旧 generation、竞争 current host 和迟到 outcome | Step 6；完整并发规则留 03 |
| host carrier / registry / Sandbox port family | external adapter / runtime ports | 执行物理承载、pinned asset 获取、host binding / release 协作 | Step 7；产品与 exact contract pending |
| host / attempt / association repositories | persistence port family | 保存本地 truth、attempt 和 current pointer | Step 7 boundary；完整 trait 留 03 |

### 11.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `MemberExecutionHost` | 独立成节；ProjectMember-scoped、immutable generation、current pointer 与 backend ref 分离 |
| Side-effect Truth | `HostActionAttempt` | 独立成节；kind、target generation、correlation、local / external outcome 分层 |
| Reference / Association | `HostExternalAssociation` | 独立成节；typed ref、owner、generation、association state、safe outcome only |
| Policy / Invariant | `HostGenerationFence` | 独立成节；single-active、expected generation、late / unknown / replay guard |
| Projection | carrier / host slice 并入 `SafeHostView` | CMP-07 统一展开，不从 backend 重建 Host Truth |
| Audit / History | attempt + `HostHistoryEntry` | 对象自身保留 attempt 事实，CMP-07 统一 history query |

### 11.5 本部分不承担什么

- 不拥有 Docker / Kubernetes / registry / isolation backend 产品状态或资源生命周期真相。
- 不选择镜像 variant，不保存 image body，不重新计算 image eligibility。
- 不提交 ToolInvocation、不执行 tool action、不推进 Runtime run 或 Sandbox controlled execution run。
- 不把 adapter accepted、resource exists、pull completed 或 binding receipt直接升级为 Host Readiness / Host Healthy。
- 不对 unknown external effect 盲重试；必须保持 fence / hold / reconciliation。

### 11.6 与其他部分的接缝

- 从 CMP-01 接受已提交 lifecycle decision，从 CMP-02 接受 qualification / assembly context和 readiness prerequisites。
- 向 CMP-02 返回 matching generation 的分项 local outcome；由 CMP-02 单独决定 readiness。
- 为 CMP-04 提供 current host / generation；registration 不得创建 host。
- 承接 CMP-05 recovery decision和 CMP-06 cleanup / release decision，但 signal / job 不可绕过正式 decision。
- 向 CMP-06 提供 association / unknown effect，向 CMP-07 提供 committed host / attempt / association facts。

### 11.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否清楚 | pass | CAP-MS-09~12 覆盖 generation、attempt、outcome、association |
| 候选对象是否有功能来源 | pass | host / attempt / association / fence 分别承接不同不变量 |
| 接缝是否清楚 | pass | readiness 属 CMP-02，recovery / closure decision 来自 CMP-05/06 |
| 禁止事项是否清楚 | pass | 不拥有产品、镜像、tool / runtime / sandbox execution truth |
| 是否越界 | pass | 仅 host-side ports；`MSVC-UP-003/004` exact contract 仍 blocked |

停审结论：`CMP-MS-03` completed / pass；名称、职责、CAP-MS-09~12 和四个 Step 6 对象候选冻结。

## 12. CMP-MS-04：Registration and Host Session

### 12.1 本部分职责

本部分承接 C-MS-3 / A3，拥有 registration acceptance、唯一活动 endpoint 和 Host Session 关联壳。它把 Member 拥有的 register request / report 与本仓 acceptance 分开，把 Host Session 与 Runtime run 分开，并以 generation / credential / replacement guard 维护连续历史。

### 12.2 本部分功能 / capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| CAP-MS-13 受理 / 拒绝注册 | Member registration placeholder、host / generation、credential safe ref、metadata | `HostRegistration` acceptance / rejection | 写 registration truth / history；不写 Member truth | Step 6 / 7 / 8 / 9 |
| CAP-MS-14 维护 endpoint | accepted registration、safe endpoint material | `HostEndpoint` | unique active / stale / invalid / replaced | Step 6 / 7 Query / 9 |
| CAP-MS-15 建立 Host Session 壳 | current host / endpoint、Runtime association placeholder | `HostSession` 或 blocked / waiting | unique active session；不创建 Runtime run | Step 6 / 7 port / 8 / 9 |
| CAP-MS-16 替换 / 失效关联 | new registration、generation change、closure / recovery decision | registration / endpoint / session invalidation or replacement | 旧关联追加终结事实；不覆盖历史 | Step 6 policy / 8 / 9 |

### 12.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `HostRegistrationEntry` | inbound entry | 映射 Member registration placeholder、metadata 和 credential context | Step 7 / 8；exact IPC waiting |
| `HostRegistrationService` | application service | 编排 registration guard、acceptance、endpoint 与 history | Step 8；完整契约留 03 |
| `HostSessionService` | application service | 编排 Host Session 建立、替换、失效及 Runtime association placeholder | Step 8；exact Runtime seam blocked |
| `HostRegistration` | domain truth record | 表达请求关联、接受 / 拒绝 / 替换、本地依据与 generation | Step 6 / 9 |
| `HostEndpoint` | domain value / association object | 表达宿主可接入位置的安全形式、状态与 generation | Step 6 / 9 |
| `HostSession` | domain entity / association shell | 表达 host、endpoint、Member / Runtime association refs 和活动状态 | Step 6 / 9 |
| `RegistrationSessionPolicy` | domain policy / guard | 约束 credential qualification、generation、single-active、replacement / late input | Step 6；完整规则留 03 |
| Member / Runtime collaboration port family | external runtime / ref placeholder | 接受 register / heartbeat boundary，维护 Runtime association / entry handoff | Step 7；`MSVC-UP-001/002/006` |
| registration / session repositories | persistence port family | 保存 registration、endpoint、session 和 current index | Step 7 boundary；完整 trait 留 03 |

### 12.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / Acceptance | `HostRegistration` | 独立成节；source / credential / generation、accepted / rejected / replaced 与 reason 分开 |
| Association / State | `HostEndpoint` | 独立成节；只保存 safe endpoint / ref，不输出 secret / raw transport detail |
| Association / State | `HostSession` | 独立成节；session shell、active uniqueness、Runtime ref placeholder，不含 run body |
| Policy / Invariant | `RegistrationSessionPolicy` | 独立成节；registration qualification、single-active、replacement、late / replay guard |
| Projection | registration / endpoint / session slice 并入 `SafeHostView` | CMP-07 统一展开 |
| Reference | Member request / instance ref、Runtime run / session ref、credential ref | 字段类型 / placeholder；不升级外部对象 |
| Audit / History | registration / session history + `HostHistoryEntry` | 对象保留 replacement link，CMP-07 统一查询 |

### 12.5 本部分不承担什么

- 不拥有 Member presence、attention、IPC 内部、request / signal / report body 或本地发送 attempt。
- 不签发 / 撤销 credential，不保存 credential secret，不把 endpoint 当 credential。
- 不创建、推进、恢复或结束 Runtime run / checkpoint / outcome。
- 不把 registration accepted 写成 Host Readiness、Host Healthy、Runtime Ready 或业务成功。
- 不允许旧 generation、重复或迟到 registration 覆盖当前 endpoint / Host Session。

### 12.6 与其他部分的接缝

- 消费 CMP-02 Host Readiness 和 CMP-03 current host / generation；非 ready 或 generation 不匹配时 fail closed。
- Member 输入只能经 `MSVC-UP-002` placeholder；owner 分工成立，字段 / IPC / credential 仍 waiting。
- Runtime association / entry 只能经 `MSVC-UP-001` placeholder；Host Session 可成立结构不等于 Runtime entry 可用。
- 向 CMP-05 提供 current session / endpoint facts和允许 signal association；向 CMP-06 提供需失效的关联。
- 向 CMP-07 提供 committed registration / endpoint / session facts。

### 12.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否清楚 | pass | CAP-MS-13~16 覆盖受理、endpoint、session、替换 / 失效 |
| 候选对象是否有功能来源 | pass | registration、endpoint、session、policy 各有独立责任 |
| 接缝是否清楚 | pass | readiness 前置、Member input 与 Runtime association 分开 |
| 禁止事项是否清楚 | pass | 不拥有 Member body、credential truth 或 Runtime run |
| 是否越界 | pass | 三项 exact seam均保持 placeholder / waiting / blocked |

停审结论：`CMP-MS-04` completed / pass；名称、职责、CAP-MS-13~16 和四个 Step 6 对象候选冻结。

## 13. CMP-MS-05：Host health and recovery

### 13.1 本部分职责

本部分承接 C-MS-4 / A4。它先将 Member、Host Session、carrier、Sandbox binding 等允许信号归一为带 source / generation / freshness 的 snapshot，再形成本仓 host / session / backend / unknown 健康结论、失败分类和 recover / restart / stop / terminate / hold 处置决定；外部 signal 不是本地结论本身。

### 13.2 本部分功能 / capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| CAP-MS-17 承接 / 验证健康信号 | external safe signal、source / correlation / generation / observed time | `HealthSignalSnapshot` 或 ignored / rejected | 写 snapshot / freshness；不直接改 host lifecycle | Step 6 / 7 Consumer / 8 / 9 |
| CAP-MS-18 形成四层健康 | current host / session / associations、fresh snapshots | `HostHealthAssessment` | 写 host / session / backend / unknown 轴结论和 history | Step 6 / 8 / 9 |
| CAP-MS-19 分类宿主失败 | health assessment、host action / association outcome | `HostFailureClassification` | 写 source / category / confidence / current generation 关联 | Step 6 / 9 / 10 |
| CAP-MS-20 形成宿主处置决定 | current facts、failure、formal actor / control context | `HostRecoveryDecision` | recover / restart / stop / terminate / hold；后续交 CMP-03/06 | Step 6 / 7 Command / 8 / 9 |

### 13.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `HostSignalConsumer` | inbound event / signal consumer | 校验 source、dedup、generation、freshness 并 dispatch | Step 7 / 8；exact event schema pending |
| `HostHealthService` | application service | 编排 snapshots、current facts、assessment 与 history | Step 8；完整契约留 03 |
| `HostRecoveryService` | application service | 编排 failure、formal control、recovery decision 与下游推进 | Step 8；完整契约留 03 |
| `HealthSignalSnapshot` | external snapshot object | 保留健康判断所需 safe summary、source、generation 与 freshness | Step 6 / 9 |
| `HostHealthAssessment` | domain truth / assessment | 表达 host / session / backend / unknown 并行健康结论 | Step 6 / 9 |
| `HostFailureClassification` | domain fact / value object | 表达宿主失败来源、类别、影响和 certainty，不含 raw logs | Step 6 / 9 |
| `HostRecoveryDecision` | domain decision truth | 表达宿主侧处置 action、依据、目标 generation 与状态 | Step 6 / 9 |
| signal / feedback intake ports | external event / runtime ports | 接收 Member / Runtime / Sandbox / carrier 允许摘要 | Step 7；exact contracts pending |
| health / recovery repositories | persistence port family | 保存 snapshots、assessments、failure / decision history | Step 7 boundary；完整 trait 留 03 |

### 13.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Snapshot / Reference | `HealthSignalSnapshot` | 独立成节；source、generation、observed / captured time、freshness、safe summary 与 raw body exclusion |
| Truth / State | `HostHealthAssessment` | 独立成节；四轴健康不能压成单值，assessment revision / prior link 可追溯 |
| Failure Truth | `HostFailureClassification` | 独立成节；host / session / backend / unknown 与 runtime / business failure 区分 |
| Decision Truth | `HostRecoveryDecision` | 独立成节；recover / restart / stop / terminate / hold，decision 不等于 action complete |
| Projection | health / recovery slice 并入 `SafeHostView` | CMP-07 统一展开 |
| Audit / History | assessment / failure / decision changes + `HostHistoryEntry` | CMP-07 统一 history query；对象保留 source / prior link |

### 13.5 本部分不承担什么

- 不把 heartbeat missed、backend status、session signal 或 Observability alert 直接当 Host Truth。
- 不拥有 Runtime progress / checkpoint / recovery、business failure、Sandbox enforcement 或 backend health truth。
- 不读取 raw logs、container dump、capture、checkpoint 或 report body 来补本地字段。
- 不在 signal consumer 中隐式执行 restart / terminate；必须形成正式 `HostRecoveryDecision`。
- 不锁定 health window、heartbeat interval、retry / recovery 次数或 SLO 数字。

### 13.6 与其他部分的接缝

- 从 CMP-03 / 04 读取 current generation、host、endpoint、Host Session 与 association；从外部 seam 接收 safe signal。
- recovery decision交 CMP-03 发起 host-side action；terminate / closure intent交 CMP-06 收束。
- restart 必须形成 CMP-03 新 generation，旧 assessment / failure history 保留。
- unknown、stale、conflict 或 incomplete signal 不能由 CMP-02 readiness或 CMP-07 projection修复。
- 向 CMP-07 提供 committed health / failure / recovery facts。

### 13.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否清楚 | pass | CAP-MS-17~20 覆盖 signal、assessment、failure 与 decision |
| 候选对象是否有功能来源 | pass | snapshot、assessment、classification、decision 分层 |
| 接缝是否清楚 | pass | signal -> assessment -> decision -> CMP-03/06，无隐式 side effect |
| 禁止事项是否清楚 | pass | 不拥有 Runtime / business / Sandbox / backend / observed truth |
| 是否越界 | pass | 无 heartbeat 数字、raw logs、checkpoint 或 backend schema |

停审结论：`CMP-MS-05` completed / pass；名称、职责、CAP-MS-17~20 和四个 Step 6 对象候选冻结。

## 14. CMP-MS-06：Host closure and reconciliation

### 14.1 本部分职责

本部分承接 C-MS-5 / A5，拥有本地下线收束、关联失效、cleanup / release local attempt、gap / residual、orphan / drift 分类和 reconciliation disposition。它以 local-first 方式证明本仓已经做了什么、仍不知道什么，不冒认 carrier / Sandbox / consumer 的外部完成事实。

### 14.2 本部分功能 / capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| CAP-MS-21 开启 / 推进本地收束 | termination / replacement / release decision、host / session / associations | `HostClosure` | 写 closure / invalidation / history；不先声明外部 cleanup | Step 6 / 7 / 8 / 9 |
| CAP-MS-22 推进 cleanup / release | committed closure / attempt、external refs | `CleanupAttempt` | local attempt -> external call -> succeeded / failed / unknown / gap | Step 6 / 7 Job / port / 8 / 9 |
| CAP-MS-23 识别 residual / orphan / drift | committed Host Truth、allowed external summaries | `ResidualFinding` | 写 finding / unknown；不自动修复 | Step 6 / 7 Job / 8 / 9 |
| CAP-MS-24 形成 reconciliation disposition | finding、history、current generation、actor / job context | `ReconciliationCase` | repair-request / hold / escalate / resolved / unknown；不改外部 truth | Step 6 / 8 / 9 |

### 14.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `HostClosureService` | application service | 编排 closure、association invalidation、cleanup / release attempt 与 gap | Step 8；完整契约留 03 |
| `HostReconciliationService` | application service | 比较本地事实与允许摘要，形成 finding / disposition | Step 8；完整契约留 03 |
| `HostOperationsJobs` | operations job entry | 触发 due cleanup、unknown-effect、residual / orphan / drift 对账 | Step 7 / 8；schedule / batch 留 04 |
| `HostClosure` | domain aggregate / truth | 表达本地收束范围、关联失效、完成边界与未闭合项 | Step 6 / 9 |
| `CleanupAttempt` | domain side-effect record | 表达 cleanup / release 的本地决定、attempt、result / gap | Step 6 / 9 |
| `ResidualFinding` | domain finding record | 表达 residual / orphan / drift / unknown 的可追踪发现 | Step 6 / 9 |
| `ReconciliationCase` | domain case / disposition truth | 聚合 finding、处置、重试 / hold / escalate / resolved 历史 | Step 6 / 9 |
| cleanup / release / observation port family | external adapter / runtime / ref ports | 推进外部动作或读取允许摘要 | Step 7；exact receipt / caller pending |
| closure / finding / case repositories | persistence port family | 保存本地 closure、attempt、finding 和 case truth | Step 7 boundary；完整 trait 留 03 |

### 14.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `HostClosure` | 独立成节；local completion、pending association、gap / residual 不得压成 terminated |
| Side-effect Truth | `CleanupAttempt` | 独立成节；cleanup / release kind、generation、local / external outcome、unknown fence |
| Finding | `ResidualFinding` | 独立成节；residual / orphan / drift / unknown 分类、source / captured time、affected ref |
| Case / Disposition | `ReconciliationCase` | 独立成节；findings、disposition、status、prior attempt / decision refs，report-only 不自动 repair |
| Projection | closure / reconciliation slice 并入 `SafeHostView` | CMP-07 统一展开 |
| Reference | carrier / Sandbox / endpoint / session / consumer refs | 字段类型；external body 与 lifecycle 外置 |
| Audit / History | cleanup / case history + `HostHistoryEntry` | 对象保留 attempts / changes，CMP-07 统一查询 |

### 14.5 本部分不承担什么

- 不拥有 Sandbox cleanup、carrier resource deletion、registry cleanup、Bus delivery 或 consumer acceptance truth。
- 不删除 external evidence / capture / artifact / report，不把资源不存在自动写成本地已清理。
- 不在 reconciliation job 中创建 lifecycle decision、重启宿主、修改 registration / health 历史或修复 sibling truth。
- 不把 terminated、cleanup attempted、release receipt、residual resolved 和 external completed 压成一个状态。
- 不对 commit-unknown / side-effect-unknown 盲重放；必须保持 fence、hold 或人工 / owner 处置入口。

### 14.6 与其他部分的接缝

- 消费 CMP-01 / 05 已提交 termination / replacement / recovery decision和 CMP-03 / 04 当前 associations。
- 指示 CMP-03 推进 matching generation 的 release action；由本部分拥有 local cleanup / closure outcome。
- 使 CMP-04 registration / endpoint / Host Session 进入显式 invalidation，但不删历史。
- external summary只作为 finding 输入，不直接改变 closure / case；`MSVC-UP-004` exact cleanup receipt 继续 pending。
- 向 CMP-07 提供 committed closure / attempt / finding / case facts。

### 14.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否清楚 | pass | CAP-MS-21~24 覆盖收束、cleanup、finding 和 disposition |
| 候选对象是否有功能来源 | pass | aggregate、attempt、finding、case 四类责任不重复 |
| 接缝是否清楚 | pass | CMP-03 执行动作，CMP-04 失效关联，本部分拥有 local closure / reconcile |
| 禁止事项是否清楚 | pass | 不冒认 external completion、不自动 repair、不盲重放 |
| 是否越界 | pass | Sandbox / carrier / Bus / consumer truth 仍外置 |

停审结论：`CMP-MS-06` completed / pass；名称、职责、CAP-MS-21~24 和四个 Step 6 对象候选冻结。

## 15. CMP-MS-07：Host fact handoff and safe consumption

### 15.1 本部分职责

本部分承接 S3 / P3，将 CMP-01~06 已提交 Host Truth 和 history 变成 body-free material、outbox / per-target handoff 本地状态，以及可授权、可迟滞、可重建的当前 / 历史安全读取面。它不拥有传递、观测、接受、报告或证据正文。

### 15.2 本部分功能 / capability 清单

| Capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| CAP-MS-25 形成 body-free material | committed Host Truth / change / history | `HostFactMaterial` + `HostOutboxRecord` | 同本地 change 提交或基于已提交 change 形成 pending；禁止正文 | Step 6 / 7 Event / 8 / 9 |
| CAP-MS-26 推进 per-target handoff | pending outbox / material、target ref、safe feedback | `HostHandoffRecord` | attempt / gap / external summary；不回滚 source truth | Step 6 / 7 Job / Consumer / 8 / 9 |
| CAP-MS-27 安全当前 / 历史读取 | authorized query、truth / projection / history | `SafeHostView` / history page + freshness | 只读；不 refresh / repair / control | Step 6 / 7 Query / 8 |
| CAP-MS-28 维护 / 重建投影 | committed truth cursor、projection state、job context | `HostProjectionState` + rebuilt safe view | stale / rebuilding / fresh / degraded；不反写真相 | Step 6 / 7 Job / 8 / 9 |

### 15.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `HostMaterialService` | application service | 从 committed change 形成安全材料、outbox 与 handoff record | Step 8；完整契约留 03 |
| `HostReadService` | query application service | 执行授权、visibility / freshness 判断和 current / history 读取 | Step 7 / 8；完整契约留 03 |
| publication / projection jobs | operations jobs | 发布 outbox、重试 handoff、重建 projection | Step 7 / 8；cadence / batch 留 04 |
| `HostFactMaterial` | domain material record | body-free 表达已提交宿主变化、subject / host / change refs | Step 6 |
| `HostHandoffRecord` | domain handoff truth | 表达 per-target local attempt / gap 和允许 external summary | Step 6 / 9 |
| `SafeHostView` | read model / projection | 汇总授权可见的 current host / readiness / session / health / closure safe slice | Step 6；Query 见 Step 7 |
| `HostProjectionState` | projection state object | 表达 projection freshness、cursor、rebuild / degraded 状态 | Step 6 / 9 |
| `HostOutboxRecord` | outbox record | 绑定 committed change 与待发布 material，不等于 Bus delivery | Step 6 / 9 |
| `HostHistoryEntry` | append-only history record | 统一索引 intent 到 handoff 的 body-free change history | Step 6；读取见 Step 7 |
| event publisher / handoff target ports | event / runtime / ref ports | 向 Bus / authorized target 提交 material并接收允许 feedback | Step 7；route / receipt pending |
| projection / outbox / handoff / history repositories | persistence ports | 保存本地派生、发布和历史状态 | Step 7 boundary；完整 trait 留 03 |

### 15.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Material | `HostFactMaterial` | 独立成节；body-free、change / subject / host refs、material class 与 forbidden fields |
| Handoff Truth | `HostHandoffRecord` | 独立成节；target、attempt / gap、local / external outcome 轴和 no-rollback |
| Projection / Read | `SafeHostView` | 独立成节；各组成部分 safe slice、freshness / visibility，不能成为 command input truth |
| Projection State | `HostProjectionState` | 独立成节；cursor、fresh / stale / rebuilding / degraded，rebuild 不修 truth |
| Outbox | `HostOutboxRecord` | 独立成节；committed change、material ref、publication local state、same identity retry |
| Audit / History | `HostHistoryEntry` | 独立成节；change category、prior / subject / host / decision refs、redacted summary，不存正文 |
| Reference | target / route / publication / receipt / observation refs | 只作字段类型；exact schema / owner receipt pending |

### 15.5 本部分不承担什么

- 不拥有 Bus publication acceptance / delivery / retry / DLQ truth，不声明 event 已到达 consumer。
- 不拥有 Observability observed truth、log / metric backend、report、Artifact / Archive / Evidence / verdict / signoff 正文。
- 不让 Query 触发 refresh、reconcile、restart、cleanup、publish 或任何核心 truth 变化。
- 不从旧 projection、external observed state 或 consumer feedback 重建 / 修复 CMP-01~06 truth。
- 不输出 secret、raw endpoint、image / credential / Runtime / Sandbox / backend body。

### 15.6 与其他部分的接缝

- 只消费 CMP-01~06 committed change / truth / history；material formation失败不回滚源 truth并形成 local gap。
- outbox / publisher 只向 `L0-bus` 或正式 handoff target 交接；route / receipt / consumer owner 未闭口时保持 `MSVC-UP-007` / event boundary pending。
- external delivery / observed / accepted summary只更新 matching `HostHandoffRecord`，不改 source truth。
- `SafeHostView` 聚合各组成部分最小安全 slice，但每个源状态 owner 仍是原组成部分。
- projection / handoff unavailable只降低消费面，不阻塞本地 Host Truth 判断。

### 15.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| capability 是否清楚 | pass | CAP-MS-25~28 覆盖 material、handoff、read、projection |
| 候选对象是否有功能来源 | pass | material、handoff、view、projection、outbox、history 各自独立 |
| 接缝是否清楚 | pass | 只消费 committed truth；Bus / consumer completion 外置 |
| 禁止事项是否清楚 | pass | no-write、no-repair、body-free、no external completion claim |
| 是否越界 | pass | 未创建 Observability / Bus / Artifact truth 或报告正文 |

停审结论：`CMP-MS-07` completed / pass；名称、职责、CAP-MS-25~28 和六个 Step 6 对象候选冻结。

## 16. 总体边界说明

1. `CMP-MS-01~07` 是正式概要业务组成部分；后续 Step 不得新增第八部分或以技术层替代。
2. CMP-01 / 02 / 03 / 04 / 05 / 06 分别拥有其本地 truth，均处于同一 Host Truth Center；CMP-07 只拥有 material / handoff / outbox / history / projection 的本地事实。
3. S1 / P1 依附 CMP-02，S2 / P2 按使用责任分布 CMP-03~06，S3 / P3 由 CMP-07 承接；任何 shadow / projection 都不反写。
4. Runtime、Tools、Member、Images、Sandbox、L1、Bus、SDK、carrier / registry 是外部 owner / seam，不是本仓业务组成部分。
5. `MSVC-UP-001~008` 只允许 host-side placeholder / blocked / waiting；Step 6~9 可以点名本地对象与 port，但不能单方造对端 positive contract。

## 17. 跨组成部分闭环审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| C-MS-1~5 覆盖 | pass | C-MS-1 -> CMP-01；C-MS-2 -> CMP-02/03；C-MS-3 -> CMP-04；C-MS-4 -> CMP-05；C-MS-5 -> CMP-06/07 |
| CAP 覆盖 | pass | CAP-MS-01~28 连续且每项有输入、输出、状态影响和后续章节 |
| A / S / P 覆盖 | pass | A1~A5、S1~S3、P1~P3 均映射，无独立 shadow 写源 |
| 对象候选计数 | pass | 29 个独立候选均来自 capability / 对象维度，无临时新增对象 |
| decision 重复 | pass | `HostOrchestrationDecision` 处理正式 intent / control；`HostRecoveryDecision` 处理 health / failure disposition。触发、依据和 owner 不同，均只向 CMP-03 提供 typed decision ref，不合并 truth。 |
| readiness / health 重复 | pass | `HostReadinessDecision` 只判断装配；`HostHealthAssessment` 只判断运行健康；registration / backend status不能替代任一。 |
| host / closure 重复 | pass | `MemberExecutionHost` 表达逻辑实例与 generation；`HostClosure` 表达本地收束边界；terminated 不自动等于 cleanup completed。 |
| attempt 重复 | pass | `HostActionAttempt` 处理 host carrier / asset / binding lifecycle；`CleanupAttempt` 处理 closure release / cleanup；kind 与 owner 边界分开。 |
| outbox / handoff 重复 | pass | `HostOutboxRecord` 表达待传播本地记录；`HostHandoffRecord` 表达 per-target attempt / gap；均不等于 Bus delivery。 |
| 接口归属冲突 | pass | Command / Consumer / Job 的最终分类留 Step 7，但写 owner已确定；Query / projection无核心写权。 |
| flow 跨界 | pass | CMP-03 执行外部 lifecycle action；CMP-05 / 06 只能先形成正式 decision / closure；CMP-07 不反写。 |
| 状态语义冲突 | pass | intent、readiness、host、registration、session、health、closure、reconciliation、handoff、projection 为并行状态轴。 |
| 外部合同 | pass_with_blockers | Member / Runtime / Images / Sandbox / credential / Core / SDK exact contract 持续 `MSVC-UP-001~008`，不影响本地结构但阻塞 positive path。 |
| 外围增强 | pass | E01~E04 没有进入独立 component / CAP / object；未来需按 Step 2 回开。 |

## 18. Step 6 展开门禁

Step 6 必须逐部分处理以下 29 个对象，不得省略、合并或临时新增：

```text
CMP-01: HostIntent, HostOrchestrationDecision, HostControlPolicy
CMP-02: HostQualificationContext, HostAssembly,
        HostReadinessDecision, RequiredQualificationPolicy
CMP-03: MemberExecutionHost, HostActionAttempt,
        HostExternalAssociation, HostGenerationFence
CMP-04: HostRegistration, HostEndpoint, HostSession,
        RegistrationSessionPolicy
CMP-05: HealthSignalSnapshot, HostHealthAssessment,
        HostFailureClassification, HostRecoveryDecision
CMP-06: HostClosure, CleanupAttempt, ResidualFinding,
        ReconciliationCase
CMP-07: HostFactMaterial, HostHandoffRecord, SafeHostView,
        HostProjectionState, HostOutboxRecord, HostHistoryEntry
```

如果 Step 6 判断某候选不应成为独立对象，必须在候选池筛选表中说明合并 / 降级原因并回查本步 capability；如果需要新对象，必须先回退本步补对象发现线索。

## 19. 后续展开一致性检查

| 后续位置 | 必须承接 | 禁止悬空 |
|---|---|---|
| Step 6 / 正式 §6 | 29 个独立对象、字段 / 函数骨架、归属、禁止事项 | 不得出现无 CAP 来源对象或外部 truth object |
| Step 7 / 正式 §7 | CAP-MS-01~28 所需 Command / Query / Consumer / Event / Job / Port | 每个接口必须回指组成部分 / 对象 / flow |
| Step 8 / 正式 §8 | 五节点核心 write flow、registration / signal consumer、cleanup / reconciliation / publish / projection / query | 不得由 Query / Consumer / Job隐式发明 command |
| Step 9 / 正式 §9 | 29 对象中有状态者及跨部分传播 | 不得用单一 HostStatus 压平并行状态轴 |
| Step 10~12 | 所有 fail-closed、unknown、gap、config 与 03 承接点 | blocker / non-range 不得消失 |

## 20. 正式第 5 章回填草稿

正式 §5 将使用本文件的组成部分总表、对象发现维度表、交互总图，并为 CMP-MS-01~07 分别保留：职责、capability 表、代码主体 / 模块表、对象发现线索、非职责和接缝。停审记录、诊断和详细 Gate 留在 calibration，正文以“总体边界与 Step 6 门禁”压缩呈现。

## 21. 待确认事项

- 七个组成部分和 29 个对象候选均已冻结，无阻塞 Step 6 的本地结构冲突。
- `MSVC-UP-001~008` 继续影响对象字段上限和 Step 7 external port，不得因对象名称成立而解释为 exact contract成立。
- `HostOrchestrationDecision` 与 `HostRecoveryDecision` 在 03 可共享 decision reference value type，但不得合并其来源、状态或 history truth。

## 22. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 每部分先 capability 后对象线索 | pass | CMP-01~07 均按小循环展开 |
| 每部分独立停审 | pass | 七份停审记录均完成，无 unresolved conflict |
| 组成部分是业务主语 | pass | entry / service / port / repository / job 仅作代码主体 |
| 对象维度完整 | pass | truth / policy / projection / reference / audit / history 均逐项判断 |
| 交互总图完整 | pass | 有标题、text 图和四条关键说明 |
| 后续展开无悬空 | pass | CAP、对象和 Step 6~12 位置均可反查 |
| 跨部分审计通过 | pass | 重复对象、职责、接缝、flow、state、外围与 blocker 均已审计 |
| 未提前写字段 / 函数 / contract | pass | 对象细节留 Step 6，接口 / flow / state 留 Step 7~9 |

```text
step_05_status = completed
step_05_gate = pass
components_frozen = CMP-MS-01..07
capabilities_frozen = CAP-MS-01..28
step_06_object_pool = 29_objects
formal_02_write_allowed = false
next_allowed_step = Step 6 key_objects
```
