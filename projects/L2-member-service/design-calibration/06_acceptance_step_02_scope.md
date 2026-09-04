# Step 2. 明确验收目标与范围 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 2
> 回填章节：`06-验收标准.md` §2 验收目标与范围

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确验收目标与范围 |
| 当前状态 | `[x] 已确认` |
| 输入基线 | Step 1；`00` §4、§9、§10、§14；`01` §2、§8；`02` CMP-MS-01~07；`03` §2、§5~§8；`04` §2；`05` §2~§3 |
| 输出文件 | `design-calibration/06_acceptance_step_02_scope.md` |
| 当前模块 | `scope_boundary`、`priority_tiering`、`veto_candidates` |
| 思考记录 | `done` |
| 写入记录 | `done` |
| 自检状态 | `done` |
| gate_status | `pass` |
| gate_reason | 验收目标、P0/P1/P2、in/out scope、只验接缝边界和 VETO 候选均可判定；未把兄弟内部 truth 纳入本仓范围 |
| next_allowed_action | 进入 Step 3，固定验收基线 |

### 1.1 Step 内计划

- [x] 读取 Step 1 与目标 / 非目标输入。
- [x] 回答本 Step SOP 问题。
- [x] 诊断旧范围中的越界和优先级混淆。
- [x] 选择按核心闭环、功能、规则、数据、非功能分组的范围方案。
- [x] 产出范围表、依赖接缝表、P0/P1/P2 表和 VETO 候选。
- [x] 形成 §2 回填草稿并自检。

## 2. 本步目标

本轮验收要裁决的是：`L2-member-service` 是否作为成员执行宿主控制面成立，能否保持 Host Truth、装配 / readiness、注册 / session、健康 / 恢复、closure / reconciliation 和 body-free handoff 的分层语义，并在输入无效、依赖未就绪、重复、并发、迟到和 unknown 时 fail-closed。

本轮不裁决外部系统自身是否实现，也不以某个容器、RPC、数据库或消息产品的可用来替代本仓语义成立。范围必须能与 `AC-MS-001~039`、`VF-MS-001~009`、正式 `TC-*` 和未来 `EV-MS-*` 逐项对应。

## 3. 本步输入

| 输入 | 来源 | 状态 | 用途 |
|---|---|---|---|
| 目标 / 非目标 | `00` §4 | 已确认 | 确定核心能力与排除项 |
| 功能需求 / 业务规则 | `00` §9~§10 | 已确认 | 形成 P0 功能和边界范围 |
| 数据归属 / 依赖裁剪 | `00` §11~§12、`01` §8~§12 | 已确认 | 形成 owner 与接缝范围 |
| 验收标准候选 | `00` §14 | 已确认 | 映射 AC-MS 和 VETO 候选 |
| CMP 与模块边界 | `02` §4~§7 | 已确认 | 按能力节点组织验收主题 |
| 协议、状态和流程 | `03` §7~§12 | 已确认 | 确定 P0 入口和禁止推导 |
| 配置 / profile 口径 | `04` §2~§6 | 已确认 | 确定 P0 环境与配置范围 |
| 测试范围 / seam | `05` §2~§5 | 已确认 | 确定用例、证据和外部正向限制 |

## 4. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 本轮验收的核心裁决目标是什么？ | 裁决五个核心闭环 `C-MS-1~5`、本仓 10 Command / 6 Query / 5 Consumer / 1 material helper / 7 Job 的本地语义、边界、状态、事务、证据和安全结果是否成立。 | `00` §7、§9、§14；`03` §7~§15 |
| P0/P1/P2 如何划分？ | P0 是可在 local-dev / ci-test / integration-like controlled seam / operations-replay 下验证的本地 truth 和 fail-closed 语义；P1 是真实 adapter / durable-like / selected integration；P2 是生产容量、深度外部集成和外围优化。 | `00` §9.4、§13.2；`04` §2；`05` §2.3 |
| 哪些下游能力只验接缝？ | Identity / Work 只验双锚、safe summary、freshness；Member 只验 registration / heartbeat / status safe 输入；Images 只验 pinned supply ref；Runtime 只验 host session / handoff ref；Sandbox 只验宿主级 bind / release；Bus / Observability 只验 body-free material、attempt、gap 和 feedback layer。 | `00` §6、§12；`05` §2.4 |
| 哪些非范围会影响最终结论？ | 非范围内部实现本身不影响 P0；但本仓越界保存或反写其 truth、把其不可用伪装成 ready、或缺失接缝 fail-closed，会影响 P0 并可触发 VETO。 | `00` §4.2、§14.6；`03` §9.3 |
| 哪些范围项可能成为一票否决？ | 核心闭环缺失、非项目主语或隐式宿主、owner truth 反写、required seam 缺失仍 ready、敏感正文泄漏、重复 / unknown 盲重放、结果层级升格、依赖类型伪装、静态证据伪造。 | `00` VF-MS-001~009 |
| 哪些范围项必须使用详细设计正式名称？ | 所有 P0 入口、对象、状态、错误、cursor、revision、effect key、handoff layer、配置 key 和 evidence path 必须使用 `03` / `04` / `05` 正式名称；不使用旧 `AllocateExecutionHost` 等历史名。 | `03` §6~§14；`04` §7；`05` §6、§13 |

## 5. 当前文档问题诊断

| 材料位置 | 问题 | 处理 |
|---|---|---|
| 旧 `06` §1~§4 | 把“执行宿主可启动”当成单一验收目标，未区分 Host Truth、Runtime truth、Sandbox truth 和 handoff | 拆为五个核心闭环和四语义层 |
| 旧 `06` 功能表 | `ExecuteRuntimeAction`、`CapabilityMount` 等旧名称扩大到工具 / Runtime 内部，且未给 P0/P1/P2 | 只纳入 `03` 正式入口；外部执行只验接缝 |
| 旧 `06` 环境表 | 直接要求 test / staging 级全链路可用，未处理 sibling pending | P0 使用 controlled / disabled / placeholder；真实正向列为 blocked / waiting / residual |
| 旧 `06` 非功能门禁 | 旧 P95、成功率等数字没有 workload / authority 来源 | 仅保留结构性 sample，硬阈值后置 |
| `05` 量化候选 | 有性能候选维度但无 authority | 不升格为当前 P0 硬目标 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 验收对象 | “容器 / worker 能启动” | 控制面、Host Truth、session、handoff 四层及五个核心闭环 | 贴合项目职责 |
| 范围边界 | 下游实现混入本仓验收 | 只验正式 ref / snapshot / marker / adapter / feedback seam | 防止 owner 越界 |
| 优先级 | 核心与增强无层次 | P0 本地语义，P1 controlled / real-like，P2 生产和未来 | 支持可裁决放行 |
| VETO | 只有笼统红线 | 9 个 VF 候选覆盖 truth、scope、redaction、幂等、依赖和证据 | 与 `00` 对齐 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否按五个核心闭环组织 P0 | A. 按技术组件；B. 按 `C-MS-1~5` 并交叉映射模块 | 采用 B，避免容器 / API 细节替代业务闭环 |
| 是否把真实 sibling 联调纳入 P0 | A. 纳入；B. 只验 controlled / disabled seam | 采用 B，未闭合合同不能成为 P0 ready 前置 |
| 是否将外围增强纳入总体验收 | A. 作为 P0 必须；B. 作为 P1/P2 后置范围 | 采用 B，`FR-MS-E01~E04` 不阻断核心闭环 |
| 是否使用无来源性能数字 | A. 直接沿用旧数字；B. 只定义测量维度和 authority 条件 | 采用 B，避免无证据硬门禁 |

## 8. 结构化中间产物

### 8.1 验收目标

| 目标 | 需求 / 设计来源 | P0 裁决 |
|---|---|---|
| 项目型意图与决定 | `C-MS-1`、`FR-MS-001~002`、`03` control flow | 双锚、scope、source、显式决定、重复 / 冲突稳定 |
| 装配与 readiness | `C-MS-2`、`FR-MS-003~005`、`03` qualification / assembly | required item、freshness、owner、generation 共同成立；partial / unknown 不 ready |
| 注册与 session | `C-MS-3`、`FR-MS-006~007` | single-active、endpoint / session 失效和旧世代保护；不取得 Runtime run truth |
| 健康与恢复 | `C-MS-4`、`FR-MS-008~009` | host / session / backend / unknown 分层；恢复决定显式、历史保留 |
| closure 与 handoff | `C-MS-5`、`FR-MS-010~012` | local close、cleanup attempt、residual、四层 handoff、immutable material 可追溯 |
| 证据与安全 | `NFR-MS-007~020`、`05` §13 | body-free、redaction、依赖和报告真实性成立 |

### 8.2 验收范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---|---|---|
| `HostIntent` / `HostOrchestrationDecision` 与双锚 | core truth | P0 | 受理、拒绝、冲突、显式决定和历史 | 不验 L1 正文 |
| qualification / assembly / readiness | assembly truth | P0 | 必要输入、分项结果和安全就绪 | 不解析 Role→image，不拥有 policy / credential |
| host / generation / action attempt / association | progression truth | P0 | single-active、stable key、旧世代和 unknown | 不验容器平台内部状态 |
| registration / endpoint / `HostSession` | session truth | P0 | 注册接受、替换、失效和可见性 | Member / Runtime 内部不在范围 |
| signal / assessment / failure / recovery | health truth | P0 | 信号新鲜度、失败层级和处置 | 不等同业务成功或 Runtime 进度 |
| closure / cleanup / residual / reconciliation | closure truth | P0 | 本地收束、gap、hold、escalate、历史保留 | 不宣称外部清理完成 |
| material / outbox / projection / history / handoff | safe handoff | P0 | immutable、body-free、四层反馈和 no-write | 不锁 Bus / 观测后端 |
| 10 Command / 6 Query / 5 Consumer / 1 helper / 7 Job | protocol | P0 | 正向上限、负向、幂等、no-write / no-truth-repair | 不补 Core/Bus exact envelope |
| P0 profiles / strict JSON / builder / redaction | configuration | P0 | fail-fast、profile isolation、无 partial facade | 不定义 provider / endpoint 产品 |
| controlled / real-like adapters | integration seam | P1 | 失败映射和接缝行为 | exact sibling contract 未闭合则 waiting |
| capacity / SLO / production-like / deep integration | operations / future | P2 | 后续量化与产品化 | 不进入当前 P0 退出条件 |
| Runtime loop、goal/plan、memory/checkpoint、tool execution | forbidden owner truth | 不验内部 | 只验不被写入或冒充 | 归 Runtime / Tools |
| Member 主体、Images 构建、Sandbox backend/policy、Governance approval、L1 领域、Observability backend | forbidden owner truth | 不验内部 | 只验 safe seam | 归各 owner |

### 8.3 只验接缝的下游 / 外部能力

| 依赖方 | P0 允许验收 | P0 不验 | 未就绪裁决 |
|---|---|---|---|
| `L1-identity` | `GlobalMemberRef`、safe capability / freshness | 身份正文、认证后端 | blocked / stale，不 ready |
| `L1-work` | `ProjectMemberRef`、分配 / 回收 safe summary | ProjectMember truth | 无主语则 rejected |
| `L2-member` | registration / heartbeat / status safe input | Member lifecycle / body | waiting / blocked |
| `L2-member-images` | pinned supply availability / opaque ref | manifest、digest、构建、provenance 正文 | launch blocked |
| `L2-runtime` | host session / allowed ref / handoff feedback | run、turn、goal、plan、checkpoint、result | session blocked / unknown |
| `L4-sandbox` | host-level bind / release / failure marker | backend、policy、逐动作 execute | required binding fail-closed |
| `L0-bus` / observability | body-free material、submission / gap / safe sink | route / backend 内部 | local truth 保留，handoff gap |
| 容器 / registry | adapter availability、safe ref、unknown | 产品资源正文和产品状态机 | blocked / degraded |

### 8.4 P0 / P1 / P2 裁决口径

| 优先级 | 通过前提 | 证据 / 结论 |
|---|---|---|
| P0 | 本地 contracts、domain、application、fake adapter、entry、worker、job 和 redaction / dependency 语义可重复 | 必须有未来真实 `TC-*` / `EV-MS-*` 证据；当前未执行 |
| P1 | controlled / real-like seam 不改变 P0 truth，且 exact contract、环境和证据已锁 | selected-run 或 residual；不替代 P0 |
| P2 | 生产容量、长期保留、复杂策略、深度外部集成或外围优化有明确 authority | future / risk；不进入当前 P0 |

### 8.5 范围项到 VETO 候选

| 范围项 | 相关 VETO |
|---|---|
| 核心闭环与执行主语 | `VF-MS-001`、`VF-MS-002` |
| owner / truth / forbidden body | `VF-MS-003`、`VF-MS-005` |
| readiness / required seam | `VF-MS-004` |
| duplicate / generation / unknown | `VF-MS-006` |
| attempt / receipt / handoff layer | `VF-MS-007` |
| dependency classification | `VF-MS-008` |
| evidence / report honesty | `VF-MS-009` |

## 9. 回填草稿

正式 §2 应写明：本轮验收裁决 `L2-member-service` 的五个核心闭环、P0 协议和安全边界；P0 只要求本地可重复的 Host Truth、控制面、session、handoff、状态、事务、幂等、redaction、依赖和证据语义。下游与外部能力只验正式 seam，不验其内部 truth；未闭合合同保持 blocked / waiting / placeholder。`FR-MS-E01~E04`、真实产品、容量和深度集成属于 P1/P2 后置，不得污染 P0。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 未来是否将某个真实 sibling selected-run 升为 P0 | 改变 Step 3 基线、Step 4 进入条件和 Step 13 residual | 当前不升格，等待正式合同与用户 / owner 决定 |
| 性能 / 容量是否形成硬目标 | 改变 Step 9 门禁 | 当前仅保留结构性 sample |
| 非项目型宿主是否扩展范围 | 影响 `C-MS-1` 与 VETO-002 | 当前项目型-only；扩展须重开需求和设计 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 核心验收目标可裁决 | 通过 | 见 §8.1 |
| In Scope / Out of Scope 清楚 | 通过 | 见 §8.2 |
| 下游只验接缝且未越界 | 通过 | 见 §8.3 |
| P0/P1/P2 与 VETO 候选清楚 | 通过 | 见 §8.4~§8.5 |
| 可进入 Step 3 | 通过 | 固定验收基线和证据入口 |
