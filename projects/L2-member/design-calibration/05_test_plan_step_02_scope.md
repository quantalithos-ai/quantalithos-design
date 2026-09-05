# Step 2. 明确测试目标、范围和非范围

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 2
> 回填章节：`projects/L2-member/05-测试方案.md` §2「本次测试目标与范围」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_02_scope.md`
> 状态口径：本文件只记录设计级、planned、blocked-aware 结论，不表示测试执行、证据、验收或 readiness。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2：明确测试目标、范围和非范围 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | `05_test_plan_step_01_input_boundary.md`；当前正式 `00~04`；`03_ddd_step_16_test_cuts.md`；`04_config_step_12_downstream_handoff.md` |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_02_scope.md` |
| 回填位置 | 正式 `05-测试方案.md` §2（仅 Step 15 装配时回填） |
| 停审方式 | 本 Step 完成后暂停；未经用户再次确认不得创建 Step 3 |

## 2. 本步目标

本 Step 把正式需求、架构、概要、详细设计和配置设计收束成可测试的目标、范围、非范围及优先级。测试对象、用例、fixture、环境、CI、报告和证据实例留给后续 Step，不在本文件越界补写。

本 Step 必须回答：

- P0 通过哪些 member-local 与 blocked-aware 测试，才能证明成员门面主链成立。
- P1 / P2 哪些只做接缝或延后，不把未锁定的外部产品当成 P0 前置。
- 哪些 Runtime、宿主、Bus、身份、规则、工具、对话、制品和观测能力只测 member 一侧接缝。
- 哪些非范围存在残余风险，风险由哪个 owner / 后续阶段承接。
- 哪些范围项直接关联 `VF-L2M-001~009` 一票否决。

本 Step 不重新定义 `FR`、`BR`、`NFR`、`AC`、`VF`、CP、模块、字段、状态、协议或外部 owner；若可测试性依赖的契约未闭合，只记录 blocker，不用 fake、default、旧协议或 adapter 伪补。

## 3. 本步输入

| 输入 | 效力 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | 已完成的直接校准输入 | 固定正式 `00~04` 为权威、旧 `05/06` 为历史材料、最小测试分母和 blocker 姿态 |
| `00-需求文档.md` §7、§9、§10、§13、§14 | 当前正式需求 | 固定 `C-L2M-1~5`、`FR-L2M-001~012` / `E01~E03`、`BR-L2M-001~030`、`NFR-L2M-001~016`、`AC-L2M-001~033`、`VF-L2M-001~009` |
| `01-架构设计.md` §4、§6、§8~§14 | 当前正式架构 | 固定 `BC-L2M-01~07`、owner / truth boundary、依赖分类、local-truth-first、body-free、fail-closed 和非配置化红线 |
| `02-概要设计.md` §4~§12 | 当前正式概要设计 | 固定 `CP01~CP07`、实现分层、主要对象、接口骨架、流程和状态轮廓 |
| `03-详细设计.md` §5~§15 | 当前正式详细设计 | 固定七模块、34 个对象、10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job、28 状态主语、事务 / replay / 错误 / 配置 / 观测边界 |
| `03_ddd_step_16_test_cuts.md` | 直接测试切口输入 | 固定 planned 最小切口、正向与保守分支、协议分母、状态 / 一致性 / redaction 检查入口 |
| `04-配置设计.md` §2、§6、§8、§9、§11、§12 | 当前正式配置设计 | 固定四个 P0 profile、strict validation、slot availability、redaction、no-write / no-retry 和下游 blocker handoff |
| `04_config_step_12_downstream_handoff.md` | 直接配置承接输入 | 固定配置负例、fake / blocked parity、required / optional slot 与下游安全姿态 |
| `L2-runtime`、`L2-tools`、`L0-core`、`L0-bus` 及 L1 truth owners | 外部正式 owner / seam 输入 | 只确定 member 可验证的接缝和依赖类型，不把外部内部实现纳入本仓 P0 |
| `L2-member-service`、`L2-member-images` | sibling 明确可引用材料 | 只保留宿主与镜像供给方向；exact contract、release、credential、compatibility 和 readiness 继续 pending |
| 旧 `05/06`、README、draft | historical / pollution audit | 识别旧对象、协议、路径、指标和验收写法污染，不作为范围或断言来源 |

## 4. SOP 问题回答

### 4.1 P0 必须通过什么才能证明主链成立

P0 的“通过”只表示 member-local oracle 或明确的保守边界 oracle 已成立，不等于 host accepted、Runtime executed、Bus delivered、downstream accepted、observed、evidence 或系统 readiness。P0 必须覆盖以下五类核心能力：

1. `C-L2M-1`：项目型 `ProjectMemberRef` + `GlobalMemberRef` 双锚、启动语境受理、本地 presence 状态与宿主请求 / 信号 / 报告边界成立；缺失、冲突、不可验证时 fail closed。
2. `C-L2M-2`：订阅范围有来源、入站筛选四态可区分、规则来源可回链、受控投递不透明转发 raw body；Runtime 不可用时 waiting / degraded / blocked，不代答。
3. `C-L2M-3`：只从 Runtime committed safe material 形成出站决定与 body-free 材料；发布只形成 local attempt / gap，delivery / observed / accepted 保持外置。`L2M-UP-004` 未闭合时以拒绝 / gap fence 为 P0 oracle。
4. `C-L2M-4`：在场、筛选、投递、出站及观测材料按同一关联语境追溯；材料无正文、hidden reasoning、secret 或高基数内容；观测通道未就绪不阻塞本地事实。
5. `C-L2M-5`：Member Summary 从已提交事实和 safe view 派生、可重建、不反写；能力出口若未激活，必须产生显式 `not_available` / `stale` / `gap`，不能伪造能力或第二 registry。

为使上述目标可落码，P0 还必须覆盖 `03` 的固定分母：10 个 Command、16 个 Query、14 个 Consumer（10 external + 4 committed-fact）、24 个 outbound semantic candidates、5 个 Job 和 28 个状态主语；并覆盖 UoW 顺序、CAS、append-only、typed replay、commit-unknown、partial item、配置 fail-fast、adapter unavailable、Query no-write、Job no-truth-repair 与 redaction。受上游或 DDD gap 影响的正向 lane 只能以 blocked-aware / refusal / reserved-edge 形式进入 P0。

### 4.2 P1 / P2 是边界验证还是延后

是。P1 用于 owner 合同关闭后或 real-like 产品可控时的接缝资格验证，不改变 P0 truth 语义；P2 用于未来外围能力、生产优化和未定义主语，不作为当前核心闭环的硬门禁。

| 优先级 | 当前含义 | 允许的测试姿态 | 不得作出的结论 |
|---|---|---|---|
| P0 | member-local truth、协议边界、状态 / 一致性、安全和配置红线 | deterministic fake、controlled seam、local / negative / blocked-aware / replay | 不得升格为真实外部交付、宿主健康、系统 readiness |
| P1 | owner 合同闭合后的 real-like adapter、durable-like Store、Bus / Runtime / host / resolver 接缝 | integration-like、staging-like、contract qualification；按 blocker 解锁 | 不得反向定义 owner、schema、route 或 truth |
| P2 | 生产容量、复杂策略、深度外部产品和未来扩展 | 后续专项 / 演进测试；需新的设计授权 | 不得以当前 P2 缺失阻断 P0，也不得继承旧性能数字 |

### 4.3 哪些下游能力只测接缝

`L2-member` 只验证自身发出的 typed ref、safe snapshot、body-free material、local attempt / gap、feedback link、freshness / visibility surface 与保守错误映射。以下能力的完整内部状态机、正文、物理交付、健康、授权、生命周期和 UI 均不纳入本仓 P0：

- `L2-runtime` 的 entry / handoff 接缝可测；run、context、goal、plan、memory、checkpoint、tool execution、outcome truth 不测。
- `L2-member-service` 的 host request / liveness / report 接缝可测；注册接受、endpoint registry、session、健康、重启和容器编排不测。
- `L2-member-images` 的 opaque pinned reference / availability gap 可测；镜像构建、manifest、digest、compatibility、装配和 release readiness 不测。
- `L0-bus` 的 event collaboration boundary 可测；broker、delivery、ack、retry、DLQ、topic route 和传递 truth 不测。
- `L1-work`、`L1-identity`、`L1-governance`、`L2-tools`、`L3-method-library` 只测 typed ref / safe snapshot / source unavailable / stale / conflict；各自 truth、授权、定义正文和生命周期不测。
- `L1-conversation`、`L1-artifact`、`L4-observability`、`L0-sdk` 只测 body-free handoff / read surface / local gap；对话、制品、观测 backend、SDK 产品体验不测。

### 4.4 非范围的残余风险

真实 DB、Bus、resolver、secret provider、host、Runtime、image release、external GRC / provider、生产容量和跨仓 E2E 未锁定，会留下 adapter compatibility、durability、throughput、route、credential、权限和真实消费差异风险。风险不通过“默认值、fake 成功、文件存在、静态映射或旧协议”关闭，而是在 P1/P2、对应上游 owner、实施计划或新 ADR 中承接。

### 4.5 哪些范围项是一票否决相关

所有 P0 红线均与 `VF-L2M-001~009` 关联；其中 `VF-L2M-001` 以 C1~C4 核心交互主链为一票否决，C5 的派生边界另由 `AC-L2M-005`、`BR-L2M-024~026` 和其安全断言约束。尤其以下情形必须阻断：错误主语或不可验证凭据入场；规则 unknown 时 fail open；raw body / hidden reasoning / secret 持久化或转发；member 反写 Runtime / Bus / host / governance / conversation / identity / work truth；把 delivery / observed / accepted / health 当作本地成功；通用外部监听或任意 provider 直连；非 Core package dependency；把 fake / blocked / not_run 写成 positive integration、evidence 或 readiness；交互事实不可回链。

## 5. 当前文档问题诊断

| 位置 | 发现的问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧范围围绕旧 endpoint / 事件管道叙述，不能覆盖当前七 BC、七模块和本地 truth | 完全隔离；以当前 `00~04` 和 `03` test cuts 重建范围 |
| 旧 `06-验收标准.md` | 旧验收可能把外部 delivery / accepted 当作 member 结果 | 只保留方向；当前 `AC-L2M-*` / `VF-L2M-*` 为需求输入，后续 `06` 重新裁决 |
| 当前 `00` | C5 能力出口明确可裁剪，但若不分优先级会误把可选能力变成硬前置 | Member Summary P0；capability outlet 以 P0 安全边界 + P1 条件正向资格承接 |
| 当前 `01/02` | 七个 BC / CP 与实现层正交，不能直接按目录或技术栈分范围 | 范围按能力、协议、状态、一致性和边界切口表达，不按旧 B1~B6 继承 |
| 当前 `03` | 10/16/14/24/5、28 状态和 DDD gap 已给出，但尚未形成 P0/P1/P2 分层 | 将所有分母纳入 P0 计划；受 gap / upstream 影响的正向 lane 显式 blocked-aware |
| 当前 `04` | 四个 profile 和 slot failure 已锁定，real-like 仍是条件能力 | 四个 profile 的校验 / no-write / redaction 为 P0；真实产品激活为 P1 |
| 上游 / sibling | host、Runtime、Core event、screening、credential、image release 等 exact seam 未闭口 | 保留 blocker；只设计拒绝、等待、缺口和非物化断言 |

## 6. 改动前后对比

| 项 | 改动前 | 本 Step 收束后 | 原因 |
|---|---|---|---|
| 测试目标 | 旧文档只描述少量入站 / 出站 happy path | 证明 `C-L2M-1~5` 的 member-local truth、边界和安全不变量 | 与当前需求闭环一致 |
| P0 分母 | 未覆盖全部协议、Job、状态和配置 | 固定 10 Command / 16 Query / 14 Consumer / 24 candidate / 5 Job / 28 state subjects | 承接 `03` Step 16 最小验证清单 |
| 外部协作 | 倾向把宿主、Runtime、Bus 当可直接联调产品 | 只测 typed seam、safe result、attempt / gap、blocked-aware posture | 保持 owner 与依赖类型真实 |
| C5 能力出口 | 可能被误当成 registry 或必备执行能力 | Summary P0；outlet 正向资格 P1 / 可裁剪，失效必须显式 | 符合 `FR-L2M-012` 与 BC07 边界 |
| 配置与环境 | 旧 profile / 端口 / 指标可能回流 | 四个 P0 profile 的 strict validation、slot posture、redaction 和 no-write | 对齐当前 `04`，不继承旧数字 |
| 一票否决 | 旧标准与当前 VF 未对齐 | `VF-L2M-001~009` 逐项绑定范围和负向断言 | 便于后续追溯、证据和 `06` |

## 7. 测试设计取舍

| 议题 | 方案 A | 方案 B | 结论 |
|---|---|---|---|
| P0 是否只测 Command happy path | 只测主线 accepted | 覆盖协议、负向、状态、一致性、配置和安全边界 | 采用 B；否则不能证明 member facade 的 truth / fail-closed 红线 |
| 是否要求真实 host / Runtime / Bus | 真实联调作为 P0 前置 | local fake / controlled / blocked-aware；正向 qualification 条件化 | 采用 B；exact owner contract 未闭口 |
| 是否物化 24 outbound candidate | 预建 event / publisher / outbox 方便测试 | 只测 `L2M-UP-005` 下 zero-materialization / blocked boundary | 采用 B；不创造未批准的 schema / route |
| capability outlet 优先级 | 一律 P0 正向 | P0 验证安全视图 / not-available，P1 验证激活后的正向 | 采用 B；能力出口是派生、可裁剪视图 |
| 性能目标 | 继承 README 的 P95 / SLA | 只测 stage 分解和不阻塞核心；数值后置 | 采用 B；当前无 workload / measurement authority |
| fake 与 evidence | fake pass 作为 integration 证据 | fake 只证明 local contract / Port parity，证据实例后置 | 采用 B；不伪造 readiness |

## 8. 结构化中间产物

### 8.1 测试目标表

| 测试目标 | 需求 / 设计来源 | P0 判定口径 |
|---|---|---|
| 证明成员运行态主体和宿主协作边界成立 | `C-L2M-1`；`FR-L2M-001~003`；`BR-L2M-001~006`；`AC-L2M-001`、`006~008` | 合法双锚与启动语境可形成 member-local presence / collaboration material；错误、冲突、不可验证输入拒绝；不声明 host acceptance、session 或 health |
| 证明入站筛选与受控投递成立 | `C-L2M-2`；`FR-L2M-004~006`；`BR-L2M-007~013`；`AC-L2M-002`、`009~011` | scope 有来源，筛选四态可区分并可回链；投递只用 typed ref / safe snapshot / controlled context；规则 unknown / stale / conflict 保守处置，raw body 不落库 |
| 证明 Runtime 交互与出站分层成立 | `C-L2M-3`；`FR-L2M-007~008`；`BR-L2M-014~019`；`AC-L2M-003`、`012~013` | 出站决定锚定 committed safe material；材料门禁、attempt / gap 和五层状态可区分；Runtime / Bus / downstream 正向结果不由 member 伪造 |
| 证明追溯与安全观测成立 | `C-L2M-4`；`FR-L2M-009~010`；`BR-L2M-020~023`、`030`；`AC-L2M-004`、`014~015` | 关键事实共享关联语境且 append-only；观测材料 body-free、低敏、低基数；route 不可用只保留 local attempt / gap |
| 证明摘要和能力出口的派生边界成立 | `C-L2M-5`；`FR-L2M-011~012`；`BR-L2M-024~026`；`AC-L2M-005`、`016~017` | Summary 从 committed fact / safe view 派生、可重建、无反写；outlet 未激活时显式 not-available / stale / gap，激活后也不复制 definition / registry |
| 证明协议、状态、事务和重放可落码 | `03` §7~§12、§15；`03_ddd_step_16_test_cuts.md` | 10 Command、16 Query、14 Consumer、5 Job、28 状态主语均有 local / negative / blocked-aware 计划；UoW、CAS、typed replay、commit-unknown、partial isolation 可判定 |
| 证明配置和依赖分类不能旁路红线 | `04` §2、§6、§8~§12；`BR-L2M-027~029`；`NFR-L2M-016`；`AC-L2M-026`、`033` | 四个 P0 profile 的 strict validation、slot availability、redaction、no-write / no-retry 成立；只有 Core 为 compile candidate；planned / blocked / not-run 不被写成 pass |

### 8.2 范围 / 非范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---:|---|---|
| `CP01 / BC-L2M-01` 双锚启动语境、presence 与 host local material / attempt | 功能 / 状态 / 边界 | P0 | 验证 `ProjectMemberRef + GlobalMemberRef`、startup admission、presence successor、host 请求 / 信号 / 报告的 member-local 事实和拒绝姿态 | 不测 Work / Identity 生命周期、credential issue、host acceptance / session / health、容器编排；受 `L2M-UP-001/006/008` 影响的正向外部 lane blocked |
| `CP02 / BC-L2M-02` subscription scope 与 inbound screening | 功能 / 协议 / 安全 | P0 | 验证 scope 来源、入站事实接收、四态筛选、规则回链、瞬时检查和 body-free record | 不测 Bus delivery、Governance policy truth、真实安全 taxonomy；`L2M-UP-007` 未闭合时正向 allow lane blocked，unknown / stale / conflict 必须保守 |
| `CP03 / BC-L2M-03` controlled delivery 与 Runtime material reception | 功能 / 协议 / 状态 | P0 | 验证 delivery decision、submission / result link、受控语境、Runtime 不可用 / 拒绝 / unknown fence | 不测 Runtime run、context、plan、memory、checkpoint、outcome 或 IPC transport；`L2M-UP-003/004` 影响正向 mapping |
| `CP04 / BC-L2M-04` outbound decision、safe material、publication attempt / gap | 功能 / 安全 / 一致性 | P0 | 验证 committed safe material source gate、body-free material、decision 与 attempt / gap 的 append-only 分层 | 不测 Bus delivery、Conversation / Artifact truth、downstream accepted、24 candidate 物化；`L2M-UP-004/005` 相关正向发布 blocked |
| `CP05 / BC-L2M-05` interaction trace、observation material、attempt / gap | 追溯 / 观测 | P0 | 验证同一 correlation、已提交引用、body-free / redaction、观测 route 不可用姿态 | 不测完整日志、Observability backend、observed truth、evidence verdict；`L2M-DDD-005` 保留 Unknown / gap fence |
| `CP06 / BC-L2M-06` external context mirror、resolution、freshness / gap | 依赖边界 / 派生 | P0（负向及保守）；P1（正向激活） | 验证 owner-specific ref / safe snapshot、scope / purpose、stale / unresolved / blocked 和不生成 authorization / health / registry | 不测 Work / Identity / Governance / Runtime / Tools / host 外部 truth、generic resolver 或自动修复；`L2M-DDD-006` 正向 refresh 保留 blocked |
| `CP07 / BC-L2M-07` Member Summary 与 capability outlet | 派生读模型 | P0（Summary）；P0（outlet 边界）；P1（outlet 正向） | 验证 committed-only projection、freshness、rebuild no-write、outlet safe view 或显式 not-available | 不测 UI、SDK 产品体验、definition body、capability registry、authorization；`L2M-DDD-007` 影响 rebuild 正向 lane |
| 七模块技术边界：`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` | 实现分层 | P0 | 验证有限 carrier、factory / invariant、service orchestration、Store / UoW / builder、entry boundary、Consumer receipt、Job report | 不选择 crate、框架、物理 Store、runner 或部署产品；目标实现仓仍受 `L2M-DDD-001` 约束 |
| 10 Command | 协议 / 事务 | P0 | 每条验证 metadata / subject gate、合法 local result 或保守 non-positive、duplicate / conflict / typed replay | 不断言外部 accepted；`ReplaceSubscriptionScope`、CP06 refresh 等 helper-dependent positive lane 按 blocker 处理 |
| 16 Query | 查询 / 安全 | P0 | 每条验证允许的 body-free read surface、不可见 / stale / unavailable / empty 分支和 no-write | 不触发 resolver、refresh、rebuild、reconcile、reservation、audit 或写 UoW |
| 14 Consumer（10 external + 4 committed-fact） | 事件协作 / 去重 | P0 | 验证 source / schema / body gate、保守 receipt、duplicate / missing carrier / wrong source；committed-fact consumer 只读已提交事实 | 不测来源仓事件生成、Bus delivery、24 candidate 作为 source；完整 receipt 受 `L2M-DDD-003` 约束 |
| 24 outbound semantic candidates | 设计 blocker / 负向 | P0（仅阻断边界） | 逐项验证 `L2M-UP-005` 未闭合时 zero configuration / non-materialization | 不创建 event envelope、publisher、outbox、topic、route、retry、DLQ、delivery 或 receipt |
| 5 Operations Job | 维护 / 重放 | P0 | 验证 finite selector、per-item isolation、partial report、exact report replay、no source-truth repair；CP04~CP07 reserved path 保守 | 不测 scheduler、外部副作用成功、真实归档 / 导出、evidence / readiness |
| 28 状态主语、状态迁移和一致性 | 状态 / 一致性 | P0 | 以正式 enum / helper 验证 legal edge、illegal edge、reserved edge、CAS、append-only、Unknown fence | 不用缺失 helper、repository direct write 或旧状态名伪造通过；`L2M-DDD-004~007` 相关正向保持 blocked |
| 四个配置 profile：`local-dev`、`ci-test`、`integration-like`、`operations-replay` | 配置 / 环境 | P0（前两者及语义门禁）；P0 设计、P1 激活（integration-like） | 验证 profile isolation、strict JSON、source priority、fail-fast、redaction、fake / blocked parity 与 replay no-write | 不测 production-like、固定端口、真实 secret、部署拓扑、性能硬指标；integration-like 正向受 owner contract blocked |
| 外围 `FR-L2M-E01~E03` | 只读增强 | P1 / 可选 | 验证提供时只读、body-free、来源可解释且不改变 core truth | 不作为 C1~C4 或 Summary P0 的前置；缺失进入残余风险 |

### 8.3 P0 / P1 / P2 优先级口径

| 优先级 | 定义 | 进入 / 退出使用方式 |
|---|---|---|
| P0 | 成员门面本地真相、受控边界、安全红线、状态 / 一致性和可观测最小契约；包括受影响外部接缝的负向 / blocked-aware oracle | 后续必须可转成场景、断言和 planned evidence；若缺少本地 oracle 或命中一票否决，则不得退出 |
| P1 | 外部 owner 合同和产品 authority 关闭后，验证 real-like adapter、durable-like Store、Bus / Runtime / host / resolver / outlet 正向资格 | 只在相应 blocker 关闭、测试环境可证明且不改变 P0 truth 时执行；不阻塞当前 P0 设计 |
| P2 | 生产容量与 SLO、复杂策略、深度外部产品、未来主语和增强体验 | 需要新的需求 / 架构 / 配置授权与负载 / 运维依据；当前只保留风险和触发条件 |

### 8.4 只测接缝的下游与外部能力

| 能力 / 项目 | 本仓本轮可测 | 本仓不测 | 未闭口时处理 |
|---|---|---|---|
| `L2-runtime` | controlled entry material、submission attempt、result / safe-material ref、拒绝 / waiting / unknown | run、context、goal、plan、memory、checkpoint、outcome、transport | `L2M-UP-003/004`；正向 mapping blocked，保留 local refusal / gap |
| `L2-member-service` | startup context consumption、host request / liveness / status report、local attempt | acceptance、registry、session、health、restart、container lifecycle、credential issue | `L2M-UP-001/006`；不继承旧 UDS / heartbeat / token 形态 |
| `L2-member-images` | opaque pinned component ref、availability / blocked handoff | image build、manifest、digest、compatibility、assembly、release readiness | `L2M-UP-002`；只做 supply boundary |
| `L0-core` | shared ID / ref / metadata / error carrier compatibility、静态 dependency classification | Core 内部实现与 member-specific schema authority | `L2M-UP-005`；不本地 shadow 类型 |
| `L0-bus` | subscriber / publisher Port boundary、body-free carrier handoff、local attempt / gap mapping | broker、delivery、ack、retry、DLQ、route、topic truth | `L2M-UP-004/005`；不声明 delivered |
| `L1-work` / `L1-identity` | ProjectMemberRef / GlobalMemberRef 关联、safe snapshot、unresolved / conflict | ProjectMember / GlobalMember lifecycle、authn / authz backend | `L2M-UP-006/008`；错误时 fail closed |
| `L1-governance` | Policy effective / safe snapshot source check、screening source / freshness / conflict | policy / approval truth、allowlist、security taxonomy | `L2M-UP-007`；unknown / stale / conflict 只降级或阻断 |
| `L2-tools` / `L3-method-library` | Tool / method ref、safe view、capability outlet freshness / gap | ToolDefinition、execution、registry、method body、authorization | ref 缺失时 outlet not-available / stale / gap |
| `L1-conversation` / `L1-artifact` | body-free outbound / artifact ref、handoff attempt / gap | conversation fact、artifact body、rendering、archive package | `L2M-UP-004`；只保留 local material / attempt |
| `L4-observability` | safe observation material、trace / metric / audit field and redaction boundary | backend ingest、observed truth、alert、retention | route 未闭口时 local attempt / gap，不写 observed |
| `L0-sdk` / product consumers | Summary / outlet safe read shape、visibility / freshness | SDK implementation、UI / dashboard、consumer business state | optional / future；不反向成为 package dependency |

### 8.5 非范围与残余风险表

| 非范围 | 残余风险 | 风险归属 / 后续承接 |
|---|---|---|
| 真实 DB、broker、queue、object store、search、scheduler 产品行为 | isolation、durability、throughput、recovery、route 及物理一致性未知 | P1 adapter qualification；实现 / 运维 authority；`L2M-DDD-002` |
| 真实 host、Runtime、Bus、Policy、Identity、Tools、Observability 正向联调 | exact carrier、credential、schema、route、权限和反馈可能与 fake seam 不同 | 对应上游 / sibling owner；`L2M-UP-001~008`；P1 |
| 镜像构建、manifest、release、compatibility、container readiness | member 部件可能无法被宿主正确装配 | `L2-member-images` / `L2-member-service`；`L2M-UP-002` |
| 生产容量、硬 SLO、压测阈值和旧 P95 数字 | 资源上限与高峰退化未验证 | P2 容量评估；NFR 只做 stage 分解 |
| 高级筛选算法、Policy DSL、复杂 Gate / 仲裁 | 复杂规则解释、多人评审和自动决策风险未覆盖 | Governance / security owner；P2；不在 member 自建 |
| 自动摘要草拟、深度外部 GRC、复杂 export / archive | 外部正文或状态可能被误当 member truth | Artifact / archive / external owner；P1/P2 接缝 |
| 非项目型 / personal 第三种执行主语 | 生命周期、身份关联与授权模型未定义 | `L2M-UP-008`；需求 / 架构回开后再测 |
| UI、dashboard、SDK 体验和完整跨仓业务 E2E | 显化层、消费权限与真实流程差异未覆盖 | 产品层 / SDK / 跨仓集成；P1/P2 |
| 真实 evidence、verdict、signoff、readiness 产出 | 当前只有 planned design，不能证明验收 | 后续 `05` Step 13、`06`、`07` 与真实执行；当前禁止声明 |

### 8.6 一票否决关联表

| VF | 测试范围承接 | P0 断言方向 |
|---|---|---|
| `VF-L2M-001` | `C-L2M-1~4`、CP01~CP05、10/16/14/5 协议与状态 / 一致性 | 任一核心交互主链无法形成 member-local truth 或 member 退化为透明管道 / 第二 Runtime owner 即阻断；C5 另按其派生边界验收 |
| `VF-L2M-002` | 双锚、startup admission、subscription / screening source、fail-closed seam | 错主语、冲突关联、不可验证凭据或规则 unknown 被放行即阻断 |
| `VF-L2M-003` | owner / data boundary、Query / projection / Job no-write、dependency classification | member 自建 policy / runtime / conversation / identity / work / bus / observation truth，或任何反写即阻断 |
| `VF-L2M-004` | inbound inspection、controlled delivery、outbound material、trace / observation redaction | raw body、hidden reasoning、secret、provider / definition body 持久化或转发即阻断；授权瞬时检查本身不否决 |
| `VF-L2M-005` | CP03 / CP04 state layering、host / Bus / downstream feedback | delivery / observed / accepted / health 被写成本地成功，或外部失败回滚 local fact 即阻断 |
| `VF-L2M-006` | API / worker / adapter boundary、network exposure rule | 通用外部监听或任意 provider / MCP / A2A / API 直连即阻断；正式 Runtime / host / Bus seam 不误判为违规 |
| `VF-L2M-007` | dependency matrix、Core-only compile candidate、pending seam | 非 Core sibling 进入 package，或 pending host / Runtime / Core schema / route / rule / subject 被伪装闭口即阻断 |
| `VF-L2M-008` | fake / controlled / blocked-aware test posture、planned artifact boundary | fake / planned / blocked / not-run 被写成 positive integration、evidence、readiness 或验收通过即阻断 |
| `VF-L2M-009` | correlation、source / purpose / result classification、append-only history | 关键交互事实不能回链正式需求 / owner、变化被静默覆盖或来源丢失即阻断 |

## 9. 对上游设计的影响判定

| 测试范围结论 | 是否需要回写上游 | 影响类型 | 当前处理 |
|---|---:|---|---|
| P0 覆盖 `03_ddd_step_16_test_cuts.md` 的七模块、协议、状态、一致性、配置和观测最小切口 | 否 | 测试范围收束 | 只把已有 planned cut 分配优先级，不新增领域契约 |
| P0 对 C5 capability outlet 采用“边界必须、正向可裁剪” | 否 | 优先级澄清 | 符合 `00`、`01`、`02`、`04` 的 BC07 / FR-012 口径 |
| P1 需要 host / Runtime / Bus / source / credential / image exact contract 闭合 | 否（当前） | 外部资格条件 | 保留 `L2M-UP-001~008`；owner 合同闭合后定向回开测试范围 |
| 24 outbound semantic candidates 只测 zero-materialization | 否 | blocker 承接 | 不创建 event、publisher、outbox、route、topic 或 delivery 断言 |
| 物理产品、生产容量和高级策略列为 P1/P2 | 否 | 非范围 / 残余风险 | 后续由实现、运维、Governance / Security 或新 ADR 承接 |
| 某 P0 未来无法构造本地 oracle | 是（条件性） | 可验证性缺口 | 回开对应 `03` / `04` owning Step；不得用静态文件或 fake 成功补齐 |

本 Step 没有发现需要立即修改当前 `00~04` 的新事实或新契约。所有 blocker 与设计 gap 继续按原 ID 和原效力保留。

## 10. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_02_scope.md`
>
> 正式 `05-测试方案.md` §2 只能在 Step 15 装配时回填以下收口结论；本文件的过程问答、历史诊断和取舍不原样搬入正式正文。

1. 本轮测试目标是证明 `C-L2M-1~5` 的成员门面本地真相、受控接缝、fail-closed、安全暴露、状态 / 一致性和可追溯边界成立；不证明相邻仓内部 truth。
2. P0 覆盖 `FR-L2M-001~012`、`BR-L2M-001~030`、`NFR-L2M-001~016`、`AC-L2M-001~033` 和 `VF-L2M-001~009` 所要求的本地事实、负向红线和保守姿态；外围 `FR-L2M-E01~E03` 不阻塞核心。
3. P0 测试分母固定为 10 Command、16 Query、14 Consumer（10 external + 4 committed-fact）、24 blocked outbound semantic candidates、5 Job、28 状态主语以及 UoW / CAS / replay / commit-unknown / partial / config / redaction 切口。
4. P1 只在相应 owner contract / product authority 闭合后验证 real-like adapter、durable-like Store、Bus / Runtime / host / resolver / capability outlet 正向资格；P2 只保留未来增强、容量和深度集成。
5. Runtime、member-service、member-images、Bus、Work、Identity、Governance、Tools / Method、Conversation、Artifact、Observability 和 SDK 只测试 member 侧 ref / snapshot / handoff / attempt / gap / visibility 接缝。
6. 24 个 `L2M-UP-005` candidate 在正式 schema / route 未闭合前只能验证 zero configuration / non-materialization；不得把 blocked 变成 event 或 delivery 通过。
7. 非范围与残余风险必须在后续环境、专项、证据、验收和实施章节显式承接，不得被写成当前已验证。

## 11. 待确认事项与开放 blocker

| ID / 事项 | 影响 | 当前处理 | 后续承接点 |
|---|---|---|---|
| `L2M-UP-001` host / IPC / credential / lifecycle exact contract | CP01 正向注册、存活、session、health qualification | local material、拒绝和 blocked seam；不继承旧 UDS / heartbeat / token | Step 3、Step 8~10；member-service owner |
| `L2M-UP-002` image release / manifest / entry / compatibility | image supply 与 host assembly qualification | opaque ref / availability / blocked handoff | Step 8、Step 10、P1；member-images owner |
| `L2M-UP-003` Runtime entry / trigger mapping | CP03 positive admission | missing mapping refusal / waiting / blocked | Step 3、Step 6、Step 8；Runtime owner |
| `L2M-UP-004` Runtime handoff / feedback source family | CP03/04/05 positive relay、delivery / observed 分层 | local result-link、attempt / gap；不声明 delivered / observed | Step 3、6、8、10、13；Runtime / Bus owner |
| `L2M-UP-005` Core / Bus member-specific schema / route | 24 candidate materialization、publisher、outbox、delivery | zero configuration / non-materialization only | Step 3、8、9、13、14；Core / Bus owner |
| `L2M-UP-006` credential / identity anchor owner | CP01 positive admission | missing / conflict / unverifiable fail closed | Step 3、6、8；Identity / host owner |
| `L2M-UP-007` screening taxonomy / policy source | CP02 positive screening | unknown / stale / conflict conservative disposition | Step 3、6、8、10；Governance / security owner |
| `L2M-UP-008` non-project execution subject | future subject coverage | project double-anchor only；其他 blocked | Step 3、14；需求 / 架构回开 |
| `L2M-DDD-001~007`、`scope_supersede_gap` | implementation / helper-dependent positive oracle | reserved-edge / refusal / blocked-aware；不私补 schema / helper | Step 3、6、8、10、14；owning DDD Step |
| 物理 DB / Bus / runner / report backend 未锁定 | integration、性能、evidence execution | product-neutral planned scope；不执行 | Step 8~13、07 |
| 用户是否确认进入 Step 3 | 允许创建对象与切口中间产物 | 当前 Step 完成后停审 | 需新的明确确认 |

## 12. Step 2 完成门禁

| 条件 | 结果 | 依据 |
|---|---|---|
| P0 / P1 / P2 口径已固定 | 通过（设计级） | §8.3 |
| P0 范围绑定需求、能力、CP / BC、协议和风险 | 通过（planned） | §8.1、§8.2 |
| 非范围均有原因和风险归属 | 通过（明确残余风险） | §8.5、§11 |
| 下游只测接缝边界已明确 | 通过（blocked-aware） | §8.4 |
| 一票否决项均有范围承接 | 通过（负向待后续展开） | §8.6 |
| 未新增字段、状态、接口、错误或配置契约 | 通过 | 本文件仅收束测试范围 |
| 未产生 TC / EV、artifact、report、evidence、verdict、signoff、readiness 或执行事实 | 通过 | 仅设计 planned / blocked-aware posture |

## 13. 停审结论

Step 2 已完成：测试目标、范围、非范围与 P0/P1/P2 优先级已收稳。P0 以 member-local truth、安全和 fail-closed 边界为核心，并覆盖既有 `03` 最小测试分母；外部正向 qualification 只有在相应 owner 合同和产品 authority 闭合后才进入 P1；外围增强、生产容量和深度集成进入 P2 或残余风险。所有下游只测 member 侧接缝，24 个 outbound semantic candidate 保持 `L2M-UP-005` blocked / zero-materialization。未发现需回写 `00~04` 的新契约。

```text
step_02 = completed
gate_status = pass_with_explicit_blockers / stop_review
next_allowed_action = wait_for_user_confirmation_before_create_step_03_test_objects_cuts
formal_05_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
