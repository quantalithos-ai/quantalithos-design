# Step 3. 职责边界

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `responsibility_boundary` | pass | 做 / 不做 / 易混淆职责和边界红线已明确,且未混入上下文关系、子域、数据矩阵或接口方案 | 进入 Step 4 系统边界与上下文 | `01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md` |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 1~2、架构 SOP Step 3 与书写规范 §4.4。
- [x] 以镜像域 owner 而非功能 API / 实现组件划分正式职责。
- [x] 按 C-MI-1~5 收拢“做”职责。
- [x] 按相邻 owner 和后续设计粒度收拢“不做”职责。
- [x] 单列物理装配、资格、Artifact、供给 / 消费等易混淆职责。
- [x] 提炼任何后续实现都不得隐式发生的红线。
- [x] 排除上下文图、通信方式、数据字段、进程与部署内容。
- [x] 完成 owner、static/live 和 positive readiness 自检。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 1 `RB-MI-001~012` / `HC-MI-001~010` | 需求 owner、数据 / 依赖红线和开放条件 |
| Step 2 `AG-MI-001~008` | 必须由职责支撑的结构性结果 |
| Step 2 `IC-MI-001~011` | 不可隐式打穿的仓级边界 |
| 正式 00 C-MI-1~5 / F-MI-001~015 | 正式职责覆盖范围 |
| 正式 00 NG-MI-001~015 / VETO-MI-001~007 | 非职责和否决边界 |

## 3. SOP 问题回答

1. 这个仓具体做什么?

   回答:拥有 image family / variant / persona assembly definition、mapping consumption binding / validation、pinned assembly revision / derivation、build intent / attempt / immutable snapshot / candidate binding、digest / provenance binding、image eligibility、supply availability history 和 pinned instantiable entry 的镜像域语义。

2. 这个仓具体不做什么?

   回答:不编辑 Role / mapping,不拥有 member / runtime / tools / capability / adapter / live state,不控制 container / Sandbox,不审批 policy,不维护 Artifact 通用生命周期,不承载 observability / marketplace / product 或基础设施产品真相。

3. 哪些能力看起来相关但必须属于其他仓?

   回答:Role 到 variant 的“定义”归 Method Library,本仓只验证并绑定来源;component / seed 的语义与 release truth 仍归各 owner;Artifact ref 的签发归 Artifact;容器启动和消费确认归 Member Service;build / registry / evidence tool 的执行事实归 adapter / infra。

4. 哪些行为绝不能隐式发生?

   回答:不得以本地默认映射、mutable ref、live body、adapter success、registry existence、fake result 或 consumer state 补写镜像域 positive truth;不得原地覆盖 revision / attempt / availability 历史;不得私造 outbound event 或 Artifact ref。

5. 哪些边界最易串线?

   回答:variant definition 与 Role mapping、assembly materialization 与 component owner、seed 与 live state、candidate 与 builder outcome、eligibility 与 governance / evidence、availability 与 registry、pinned entry 与 container / consumer、image provenance 与 Artifact lineage 八组边界最易串线。

## 4. 当前材料问题诊断

| 候选职责 | 串线风险 | 当前归类 |
|---|---|---|
| “维护 Role 镜像映射” | 可理解为编辑 mapping truth | 易混淆;只做 mapping consumption binding / validation |
| “打包 runtime / tools / member” | 可理解为拥有 component 发布与兼容 truth | 易混淆;只做 pinned 装配绑定和完整性结论 |
| “初始化 policy / memory / workspace” | 可理解为拥有运行期状态 | 易混淆;只承接 template ref / seed placement |
| “执行镜像构建” | 可理解为拥有 builder / CI | 易混淆;拥有 intent / snapshot / domain outcome,执行由 adapter |
| “扫描并签名镜像” | 预设 evidence kind 和工具 owner | 不做工具执行;只消费正式适用 gate 的 safe conclusion |
| “发布 Artifact 镜像” | 混淆 image availability 与 Artifact 生命周期 | 易混淆;本仓拥有 image supply,Artifact truth 外置 |
| “向 member-service 发布并确认启动” | 混淆 entry、handoff 与 container lifecycle | 只拥有 local entry / handoff gap,不拥有实例化事实 |

## 5. 改动前后对比

| 维度 | 候选口径 | 当前职责边界 |
|---|---|---|
| 定义 | 管理 Role 镜像 | 管理镜像域定义和来源绑定,不管理 Role / mapping |
| 装配 | 持有 component 与 seed | 持有 pin / placement / revision,不持有外部语义正文 |
| 构建 | CI 直接成为领域 | 领域拥有 intent / snapshot / outcome;adapter 执行外置 |
| 资格 | 本仓扫描 / 批准 | 本仓基于正式 safe conclusions 形成 image eligibility |
| 发布 | registry 状态即真相 | 本仓显式管理 availability 与 immutable entry |
| 消费 | 负责容器启动成功 | 只提供入口并记录交接 / contract gap |
| 审计 | 复制所有 report | 保存镜像域 binding / conclusion,正文归 owner |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 用“定义 / 构建 / 发布”三句概括职责 | 简洁 | 装配、资格、供给 / 消费边界不清 | 不采用 |
| 以九个实现组件作为职责表 | 可直接转模块 | 过早锁实现且重复 adapter owner | 不采用 |
| 以镜像域 truth 和易混淆 owner 为主轴 | 可审查且保护边界 | 表格更长 | 采用 |
| 把所有 adapter 执行都算本仓职责 | 端到端表面完整 | 会拥有 CI / registry / evidence 产品 truth | 不采用 |

## 7. 结构化中间产物

### 7.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| Image family / variant / persona assembly definition | 做 | 这是本仓对可构建镜像身份和装配语义的核心 truth。 |
| Role mapping 来源绑定与有效性结论 | 做 | 本仓必须解释采用何种正式来源,但不拥有来源正文。 |
| Component / extras / base / seed pin 与 placement baseline | 做 | 镜像装配的完整性和布局归本仓判断。 |
| Variant revision 与 base -> variant derivation history | 做 | 装配变化必须形成不覆盖历史的镜像域修订。 |
| Build intent、attempt 与 immutable input snapshot | 做 | 构建候选必须回指确定、完整且受控的输入语境。 |
| Candidate outcome / digest binding | 做 | 只有可验证执行结果才能形成镜像域候选绑定。 |
| Provenance binding 与 image eligibility | 做 | 本仓拥有来源链绑定和镜像是否具备供给资格的结论。 |
| Supply availability、publish / replace / rollback / retire history | 做 | 镜像供给变化是本仓正式 truth。 |
| Pinned instantiable entry 与 local handoff / consumer-gap 语义 | 做 | 本仓提供可验证入口并保持外部消费状态分层。 |
| RoleDefinition 与 Role -> variant mapping 管理 | 不做 | 定义 truth 归 `L3-method-library`。 |
| Member 主体、runtime loop、tool execution / capability registry | 不做 | 这些属于 `L2-member`、Runtime、Tools 和能力 owner。 |
| Secret、live memory / checkpoint / workspace live content 管理 | 不做 | 运行期 live state 不能进入镜像域。 |
| Container 创建 / 启动 / 健康 / 升级与 Sandbox execution | 不做 | 属于 Member Service 与 Sandbox owner。 |
| Governance approval / effective policy 管理 | 不做 | 本仓只能消费正式适用结论。 |
| ArtifactVersion / lineage / baseline / archive 管理 | 不做 | 通用制品 truth 归 `L1-artifact`。 |
| Observability backend / marketplace / product entry 管理 | 不做 | 物理观测、分发与产品入口属于相邻层。 |
| CI / scheduler / builder / registry / scanner / signer / secret store 产品管理 | 不做 | 基础设施只能通过 adapter 参与。 |
| Mapping definition 与 mapping consumption binding | 易混淆职责 | 本仓验证并绑定来源,不编辑或枚举 Role mapping。 |
| Component materialization 与 component release truth | 易混淆职责 | 物理内容进入镜像不转移 component 语义 / 发布 owner。 |
| Seed placement 与 live state initialization | 易混淆职责 | 本仓只定义静态模板放置,不创建运行期 memory / workspace / policy truth。 |
| Build domain outcome 与 builder / registry outcome | 易混淆职责 | 外部执行结果是输入,不得直接等于 candidate 或 availability。 |
| Image eligibility 与 governance / evidence conclusion | 易混淆职责 | 本仓形成镜像资格,不形成 policy / approval / evidence body。 |
| Image availability 与 Artifact lifecycle | 易混淆职责 | 镜像供给 truth 与通用制品 truth 必须分别成立。 |
| Pinned entry 与 container / consumer truth | 易混淆职责 | 入口可用不代表容器启动、健康或下游确认成功。 |
| Image provenance 与 Artifact lineage | 易混淆职责 | 本仓拥有 image binding,不复制 Artifact 通用血缘。 |

### 7.2 做 / 不做摘要

| 类型 | 摘要 |
|---|---|
| 做 | 定义与来源绑定;装配 pin / placement / revision;intent / attempt / snapshot / candidate;digest / provenance / eligibility;availability / entry / gap |
| 不做 | Role / member / runtime / tools / capability / adapter / live state / container / Sandbox / governance / Artifact / observability / marketplace / product / infra truth |
| 易混淆 | mapping 定义 vs 消费;物理装配 vs 外部 owner;seed vs live state;adapter outcome vs domain outcome;eligibility vs approval;availability vs registry / Artifact / consumer |

### 7.3 边界红线

| 红线 | 被保护的边界 |
|---|---|
| 不得 hardcode、复制、编辑或 fallback Role mapping | Method owner 唯一性 |
| 不得以 mutable ref、`latest`、猜版本或默认值补齐必要输入 | 可重复装配与 pin |
| 不得将 secret 或任何 live / observed body 纳入 definition、snapshot、candidate、entry | Static / live 分离 |
| 不得将 scheduler / builder / registry / event / evidence adapter 成功直接写成领域成功 | Adapter / domain 分离 |
| 不得在 provenance 或 eligibility 中私造 policy、evidence、Artifact 正文或 formal ref | 外部 owner 唯一性 |
| 不得将 availability / entry 写成 container health、consumer confirmation 或 product readiness | Supply / consumption 分离 |
| 不得原地覆盖 revision、attempt、eligibility 或 availability 历史 | 审计与回滚可解释性 |
| 不得定义无 authority 的 outbound build / publish event | Event contract authority |
| 不得让 fake seam 或 planned evidence 形成 production readiness | 事实与证据边界 |
| 不得从物理装配 / 消费关系推导非 Core compile dependency | 全局依赖裁剪 |

### 7.4 职责覆盖检查

| 能力节点 | 本仓职责 | 主要不做 / 易混淆边界 |
|---|---|---|
| C-MI-1 | 镜像定义、mapping binding / validation | 不拥有 mapping truth |
| C-MI-2 | pin、placement、revision / derivation | 不拥有 component / seed body 或 live state |
| C-MI-3 | intent、attempt、snapshot、candidate binding | 不拥有 scheduler / builder / registry truth |
| C-MI-4 | digest / provenance binding、image eligibility | 不拥有 policy / evidence / Artifact truth |
| C-MI-5 | availability history、pinned entry、gap | 不拥有 container / consumer / outbound event truth |

## 8. 回填草稿

正式 01 §4 回填 §7.1 职责边界表、§7.2 摘要和 §7.3 红线。正式正文不写外部交互方向、通信机制或内部上下文;这些分别留给 Step 4、5、7、9。

## 9. 待确认事项

- 本 Step 不新增开放编号。
- MI-UP-001~009 只影响相应职责的 exact seam / positive outcome,不转移本步 owner。
- Q-MI-001~004 不改变当前核心职责边界。
- 任何后续 sibling 方案若要求本仓拥有其正文或运行状态,必须重开本 Step,不能以“装配需要”为由越界。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 做 / 不做 / 易混淆是否使用唯一三类 | pass |
| C-MI-1~5 是否均有正式职责承接 | pass |
| 相邻 owner 与隐式行为红线是否明确 | pass |
| 是否未写上下文图、子域、数据矩阵、协议或实现 | pass |
| 是否未把 pending seam 写成已具备能力 | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 4,不得跳到 Step 5 或修改正式 01。
