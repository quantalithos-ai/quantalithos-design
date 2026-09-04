# 02 概要校准 Step 3：收稳约束条件

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 2 completed / pass
> 本步目的：把上游硬边界转译为能直接指导代码主体、对象、接口、处理流和状态判断的结构约束

## 1. Step 内计划

- [x] 读取 Step 1 stable / pending 边界和 Step 2 范围 / 深度口径。
- [x] 从正式 00 / 01 提炼结构性硬约束，排除泛化工程口号。
- [x] 逐条回答来源、易串线点和后续判断影响。
- [x] 建立约束到 §4~§11 的影响矩阵。
- [x] 诊断旧材料的 fail-open、owner 混写、状态压平和产品渗透问题。
- [x] 形成正式第 3 章回填草稿与 Gate 自检。

## 2. 本步输入

| 输入 | 本步提炼内容 |
|---|---|
| Step 1 | stable owner、positive ceiling、historical pollution、依赖效力 |
| Step 2 | C-MS-1~5 + 必要 S / P 支撑范围、概要深度、外围裁剪 |
| 正式 00 | BR-MS、数据四分类、接口读写性质、NFR / VF 红线 |
| 正式 01 | HC-MS-001~009、BL-MS-001~008、依赖、数据、一致性与横切机制 |
| 全局依赖裁剪规则 | compile / runtime / event / ref / adapter / fake 分类与禁止转换 |

## 3. SOP 问题回答

### 3.1 哪些约束会直接影响对象、接口、流程或状态机

- 执行主语必须是 `ProjectMemberRef`，并绑定一致 `GlobalMemberRef`；影响全部核心对象与入口 guard。
- Host Truth 只有本仓可写；影响 aggregate、repository、signal consumer 和 projection 的写权限。
- control plane、Host Truth、Runtime Session、execution handoff 不得压平；影响对象拆分、接口命名、状态主语和异常分类。
- required qualification 必须共同成立；影响装配对象、Host Readiness guard、正向处理流和禁止迁移。
- generation / single-active / correlation / late-result fence；影响 instance、registration、session、health、recovery 和 cleanup。
- local truth 与 external outcome 分层；影响事务顺序、attempt / gap 对象、发布与对账状态。
- query no-write、consumer 限权、job no-hidden-command；影响接口分类和处理流。
- external truth 只能是 ref / safe snapshot / marker / material；影响字段边界、日志 / 投影与 port。
- pending / fake / unknown 不得提升为 ready；影响全部正向输出和配置。

### 3.2 约束来源如何分布

| 来源 | 主要约束族 |
|---|---|
| 正式 00 | 项目型双锚、C-MS-1~5、数据四分类、接口类型、fail closed、NFR / VF |
| 正式 01 | Host Truth Center、A / S / P、single-active、local-first、outcome layering、ports |
| Runtime / Tools / Sandbox / sibling 正式边界 | 外部 truth 排除、host-side placeholder、逐动作执行与隔离 owner |
| Core / Bus / SDK 正式边界 | contract authority、delivery 分层、受限 compile / fake 上限 |
| 全局依赖规则 | 六类依赖不可互换、运行协作不变源码依赖 |

### 3.3 若不先写清，最易串线的边界

1. `GlobalMemberRef` 被误用为执行主语，绕过 Work 的项目边界。
2. Member heartbeat 或 carrier observed state 被直接写成宿主健康 / 生命周期 truth。
3. Host Session 被扩成 Runtime run / checkpoint 容器。
4. Images pinned ref、credential、Sandbox binding 任一缺失时使用默认值或 fallback 声明 ready。
5. member-service 直接解析 Role -> image、提交 ToolInvocation 或调用逐动作 Sandbox execute。
6. cleanup / publish / observe 的 attempt 或 receipt 被写成 external completion。
7. projection、reconciliation 或 query 成为隐藏命令源。
8. sibling WIP、fake 或 adapter product state 被升级为正式 schema / domain state。

### 3.4 哪些只是泛化工程原则，不进入正式约束表

- “高内聚低耦合”“遵循最佳实践”“保持代码整洁”等不能直接判定结构的口号。
- 一般性的日志、监控、缓存、性能和部署建议；只有影响 owner、状态、读写或 fail-closed 时才进入。
- 数据库索引、隔离级别、RPC timeout、queue partition、容器资源等详细设计 / 配置事项。
- 尚无 workload / environment / measurement authority 的 SLA、P95、容量、heartbeat、retry 数字。

### 3.5 每条约束如何指导后续章节

正式约束表中的每一条都至少映射到 §4~§11 中一个结构判断；无法映射者不进入本章。详细映射见 §5。

## 4. 结构性约束条件表

| ID | 约束 | 说明 |
|---|---|---|
| `HLC-MS-001` | 项目型双锚不可替代 | 所有宿主意图、决定、实例和当前关联必须以 `ProjectMemberRef` 为执行主语，并关联一致 `GlobalMemberRef`；GlobalMember、Workspace view、endpoint 或 backend resource id 均不能替代执行主语。 |
| `HLC-MS-002` | Host Truth 单一写源 | 意图接受 / 决定、实例 / generation、装配 / readiness、registration / endpoint / Host Session、健康 / 处置、local cleanup / reconciliation 和本地 handoff 事实只能由本仓核心写路径形成。 |
| `HLC-MS-003` | 四语义层与五核心状态不得压平 | control plane、Host Truth、Runtime Session、execution handoff 必须可定位 owner；A1~A5 使用并行状态主语，不使用一个总状态掩盖 qualification、registration、health 或 external outcome。 |
| `HLC-MS-004` | required qualification fail closed | subject、identity anchor、supply、credential、required Sandbox binding 和 carrier capability 中任何必需项 missing / stale / conflict / unknown / pending 时，Host Readiness 必须为非正向状态；不得默认补齐、沿用旧缓存或 host fallback。 |
| `HLC-MS-005` | 外部 truth 最小化且 forbidden body 禁止入仓 | Identity / Work / Images / Member / Runtime / Sandbox / backend / Bus / Observability 只能以 typed ref、safe snapshot、freshness、redacted marker、body-free material 或允许 outcome 参与；secret 与外部正文不能进入 truth、projection、event、log 或 audit。 |
| `HLC-MS-006` | immutable generation 与 single-active fence | restart / relocate / replacement 必须形成新 generation 或新关联事实；同一执行主语只允许一个当前活动宿主语境，旧 generation 的迟到注册、信号、反馈和副作用结果不得覆盖当前事实。 |
| `HLC-MS-007` | 稳定 correlation、幂等与冲突显式 | Command、Consumer、Job item 和外部 side-effect attempt 必须具备可追踪 / 去重锚；相同锚不同意图为 conflict，重复不得生成第二决定、实例、session 或 attempt。具体 key shape 留给 03。 |
| `HLC-MS-008` | 本地提交与外部副作用 local-first 分层 | 本仓先提交 decision / attempt / fence，再经 port 调用外部能力，随后记录 matching local outcome；无法证明结果时进入 unknown / gap / reconciliation，禁止跨 owner 伪原子。 |
| `HLC-MS-009` | local truth 与 external outcome 分层 | local decision / material / attempt / gap、external accepted / completed / delivered / observed 必须是不同对象或状态轴；外部失败不得回滚本地已提交 truth，外部 receipt 不得改写 owner。 |
| `HLC-MS-010` | 入口读写权限固定 | Command 可改写核心 truth；Query 只读；Inbound Consumer 只把已验证外部事实转为 snapshot / marker 或经显式 application use case 推进允许的本地状态；Job 只推进已提交决定、派生、发布、对账或恢复，不可成为隐藏业务命令。 |
| `HLC-MS-011` | shadow / projection 不反写 | P1 / P2 snapshot 和 P3 safe projection 可 stale、unavailable、rebuild；它们不得创建宿主、改变 readiness、恢复 host、关闭 cleanup gap 或成为 authorization / acceptance truth。 |
| `HLC-MS-012` | 外部信号必须带来源、时点与 generation 语境 | Member、Runtime、Sandbox、carrier、Bus 和其他 external feedback 在影响本地判断前必须可验证 source、correlation、captured / observed time、freshness 和目标 generation；缺失或不匹配只能 ignored / rejected / stale / unknown。 |
| `HLC-MS-013` | sibling / infrastructure 只经正式 seam | Identity、Work、Images、Member、Runtime、Sandbox 通过 runtime / event / ref port 协作；carrier / registry 通过 adapter；Bus 通过 event；不得使用 sibling path / package、共享数据库或产品私有模型。 |
| `HLC-MS-014` | Core authority 与受限 SDK 边界不可伪造 | shared ID / ref / metadata / error / trace / envelope 只引用 Core 正式类别；member-service-specific schema 与 SDK exact target 未闭口时保持 placeholder，不建立 shadow type 或声明 compile / self-test pass。 |
| `HLC-MS-015` | 宿主不拥有逐动作执行、镜像或隔离 truth | 不直接解析 Role -> image，不拥有 image manifest body，不提交 ToolInvocation，不推进 tool execution，不创建 Sandbox run / capture / cleanup truth；只保存 pinned supply、host binding 和允许 feedback 的本地关联。 |
| `HLC-MS-016` | 关键事实历史不可覆盖 | 决定、generation、registration replacement、health conclusion、recovery / termination decision、cleanup attempt / gap 和 reconciliation disposition 必须追加或 supersede；当前指针可变化，历史事实不可原地改写或删除。 |
| `HLC-MS-017` | placeholder / fake / observed 不等于 positive ready | `MSVC-UP-001~008` 受影响接口必须带 blocked / waiting / placeholder ceiling；fake 只验证本地边界，backend resource existence 或 event acceptance 均不证明 Host Readiness、integration 或 external completion。 |
| `HLC-MS-018` | 产品、协议、数值和配置不能定义领域语义 | 容器 / 编排 / registry / RPC / event / database 产品、timeout / heartbeat / retry / capacity 数字和配置仅可影响 adapter、节奏或 guard 参数，不得改变 owner、双锚、required qualification、状态含义、no-fallback 或历史。 |
| `HLC-MS-019` | 结构主语必须双向可追溯 | §5 capability 必须由 §6 对象、§7 接口、§8 flow 或 §9 状态承接；后续 flow / state 不得隐式发明对象，接口不得无 owner，孤儿对象不得进入正式 02。 |

## 5. 约束到后续章节的影响矩阵

| 约束族 | §4 代码主体 | §5 组成部分 | §6 对象 | §7 接口 | §8 流程 | §9 状态 | §10~11 |
|---|---|---|---|---|---|---|---|
| HLC-001~003 双锚 / owner / 分层 | inward dependency 和 core subject | 五核心职责不可混 | scope / intent / instance / session 分开 | entry guard / query boundary | intent 到 closure 主链 | 并行状态轴 | owner / scope exception |
| HLC-004~005 qualification / body | S1 / P1 与 boundary layer | qualification / assembly 分工 | ref / snapshot / guard，不含正文 | resolver port / blocked result | required gate | non-ready states | forbidden-body / no-fallback |
| HLC-006~007 generation / idempotency | application / domain / persistence role | 全生命周期共享 guard | generation / correlation / history | metadata / dedup requirement | duplicate / late / conflict branch | single-active / stale | concurrency exceptions |
| HLC-008~009 local-first / outcome | application + ports + outbox | carrier / closure / handoff 分层 | attempt / gap / outcome summary | Command / Consumer / Job / Event | commit -> call -> outcome / reconcile | local vs external axes | unknown / gap / config no bypass |
| HLC-010~012 entry / projection / signal | Inbound / Operations / Projection | S3 / P3 不反写 | safe view / freshness / signal snapshot | class-specific write authority | query / consumer / job skeleton | stale / rebuild / ignored | read-side exception / cadence |
| HLC-013~015 dependency / owner exclusion | ports and adapters | external seam 不成业务组成 | typed refs only | placeholder external ports | no direct action / sandbox flow | external state not local state | dependency failure boundary |
| HLC-016~019 history / evidence / trace | persistence / audit / outbox roles | capability closure | history / audit / projection | no orphan interface | object reverse lookup | no implicit state | risk / configuration / handoff |

## 6. 当前材料诊断

| 问题 | 违反约束 | 修复方向 |
|---|---|---|
| 旧 02 以 runtime action 为入口并直接执行 | HLC-002 / 003 / 015 | 入口改为宿主意图、控制、注册与允许反馈；逐动作执行外置 |
| capability mount、worker 和 execution handle 被当 truth | HLC-003 / 005 / 015 | 只保留 qualification snapshot、Host Session association 和 host-side attempt |
| sandbox binding 与 isolation execution 混写 | HLC-003 / 009 / 015 | 本仓 binding association 与 Sandbox isolation truth 分开 |
| backend health / heartbeat 直接推导 crashed | HLC-002 / 006 / 012 | 信号先验证 generation / freshness，再形成本仓健康结论 |
| callback / publish success 作为完成 | HLC-008 / 009 / 017 | local attempt / gap 与 external completion 分轴 |
| 固定协议、产品与数字 | HLC-013 / 014 / 018 | port / adapter + deferred product / numeric config |
| 只画 happy path | HLC-004 / 008 / 017 | blocked / waiting / unknown / conflict / residual 成为一等路径 |

## 7. 改动前后对比与取舍

| 维度 | 旧倾向 | 约束后的判断 |
|---|---|---|
| readiness | 组件齐备或进程启动即 ready | required qualification + 本地装配结论，pending / unknown 非 ready |
| health | 信号或 backend status 即结论 | source / generation / freshness 校验后形成分层本地结论 |
| restart | 原 host 重置状态 | 新 generation + single-active，旧史保留 |
| 外部动作 | 同步调用成功即本地完成 | local attempt / fence -> call -> matching outcome / unknown |
| event / projection | 可驱动核心变化 | 仅经受限 consumer / application use case；projection 永不反写 |
| 测试替身 | fake pass 代表集成可用 | 只证明本地 seam 行为，positive qualification 仍 blocked |

取舍说明：这些约束增加了显式状态、history、gap 和 reconciliation 成本，但这是避免双写源、盲重放、隔离 fallback 和伪完成所需的最小结构成本。

## 8. 正式第 3 章回填草稿

```md
## 3. 约束条件

| 约束 | 说明 |
|---|---|
| 项目型双锚不可替代 | `ProjectMemberRef` 是执行主语，`GlobalMemberRef` 是一致身份锚；其他 ref 不得替代。 |
| Host Truth 单一写源且语义不压平 | 本仓独占宿主决定、实例、装配、注册、会话、健康和收束写入；control plane、Host Truth、Runtime Session、execution handoff 及 A1~A5 保持分层。 |
| required qualification fail closed | 必需主语、供给、credential、binding、carrier 任一 missing / stale / conflict / unknown / pending 均不得 Host Ready。 |
| 外部 truth 最小化 | 只允许 typed ref、safe snapshot、freshness、redacted marker、body-free material 和允许 outcome；secret / external body 禁止入仓。 |
| generation、single-active、correlation 与迟到 fence | replacement 形成新事实；重复、并发、迟到和 unknown 不得产生第二活动宿主 / session 或覆盖当前 generation。 |
| local-first 与 outcome layering | 本地 decision / attempt / fence 先提交，外部结果后关联；local、completed、delivered、observed、accepted 不混写。 |
| 入口读写权限固定 | Command 写核心；Query 只读；Consumer 受限写 snapshot / marker 或显式用例；Job 只推进已提交决定、派生、发布、对账和恢复。 |
| shadow / projection 不反写 | P1~P3 可 stale / unavailable / rebuild，但不得成为命令、授权、readiness 或完成写源。 |
| seam 与依赖类型不可转换 | Core / 受限 SDK compile 与 runtime / event / ref / adapter / fake 分开；sibling 不成为 package / shared DB 依赖。 |
| 宿主不拥有外部执行 truth | 不解析 Role -> image，不提交 ToolInvocation，不推进逐动作 Sandbox execute，不拥有 Runtime / Member / Images / Sandbox truth。 |
| 历史与 blocker 必须真实 | 关键事实追加 / supersede；placeholder / fake / observed 不等于 ready，`MSVC-UP-001~008` 持续显式。 |
| 产品、数字与配置不得改语义 | 产品和参数只能影响 adapter / cadence / guard，不能改变 owner、状态、fail-closed、no-fallback 或历史。 |
```

## 9. 待确认事项

- 无阻塞 Step 4 的结构约束缺口。
- exact idempotency key、expected version、transaction、outbox 和 error 形态属于 03，不影响本步约束成立。
- 外部合同闭口后可以细化 port / DTO，但不得削弱 HLC-MS-001~019；若要求改变其中任一 owner / invariant，必须回退 00 / 01。

## 10. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 每条约束影响结构判断 | pass | 均映射到 §4~§11 |
| 来源可追溯 | pass | 正式 00 / 01、稳定 owner 与全局裁剪规则 |
| 未混入泛化口号 | pass | 仅保留可判定的 owner / state / flow / dependency 规则 |
| 未预支详细设计 | pass | key shape、schema、transaction、产品和数值后移 |
| pending / fake ceiling 未弱化 | pass | HLC-MS-014 / 017 明确禁止伪 positive |
| 足以进入 Step 4 | pass | 可据此将架构语义映射为代码主体和实现分层 |

```text
step_03_status = completed
step_03_gate = pass
formal_02_write_allowed = false
next_allowed_step = Step 4 code_subject_framework
```
