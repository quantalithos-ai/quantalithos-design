# L2-tools 02 概要 Step 1: 确认上游输入边界

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 当前正式 `00-需求文档.md` 与 `01-架构设计.md` 是唯一直接上游基线；六条指定上游正式链只提供各自 owner 的 current workspace seam；旧 `02` 与 README 只作后置差异审计。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 1 确认上游输入边界 |
| 输出文件 | `design-calibration/02_hld_step_01_upstream_boundary.md` |
| 已读取项目级台账 | yes: `design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes: `design-calibration/02_hld_calibration_flow.md` |
| 已读取 SOP / 书写规范 | yes: `概要设计讨论流程_SOP.md` Step 1；`概要设计书写规范.md` §1 / §4.1 |
| 已读取正式直接输入 | yes: 当前正式 `00-需求文档.md`、`01-架构设计.md` |
| 已读取相邻 owner 输入 | yes: Hub、Sandbox、Observability、Core、Bus、SDK 正式链的适用边界 |
| 已读取参考粒度 | yes: `L1-governance`、`L1-artifact`、`L3-method-library`、`L3-capability-hub` 的 02 Step 1 样本 |
| 旧材料处理 | 旧 `02-概要设计.md` 与 README 只作 historical material 差异审计 |
| 进入条件 | pass |
| next_allowed_action | Step 1 完成后，依据同一上游效力进入 Step 2。 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读标准与直接上游读取 | done | 来源效力表 | pass | 判断稳定输入。 |
| 需求输入判断：先思考 | done | 需求结论分组 | pass | 写入需求承接表。 |
| 架构输入判断：先思考 | done | 架构结论分组 | pass | 写入架构承接表。 |
| 相邻 owner seam 判断：先思考 | done | current / conditional / blocked / future 分类 | pass | 写入 seam 表。 |
| 本文不再回答：先思考再写入 | done | 上游已收稳问题清单 | pass | 进入必须回答清单。 |
| 本文必须回答：先思考再写入 | done | 概要层结构问题清单 | pass | 进入暂不定稿清单。 |
| 旧材料后置差异审计 | done | historical conflict 表 | pass | 形成回填草稿。 |
| 自检与停审 | done | Step 1 门禁 | pass | 进入 Step 2。 |

## 2. 本步输入与效力

| 输入 | 本步读取结论 | 效力 | 对后续的约束 |
|---|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 1 | 只确认可承接输入，输出上游映射、本文不再回答、本文必须回答；不得提前拆代码主体。 | 流程标准 | Step 1 不产生对象、接口、处理流或状态结论。 |
| `standards/document/概要设计书写规范.md` §1 / §4.1 | 正式 §1 只表达来源与承接层次，不写需求摘要、架构摘要或后续章节正文。 | 输出标准 | Step 14 只能摘录本 Step 的来源结论。 |
| 当前正式 `00-需求文档.md` | 工具调用语义契约真相仓定位、五节点闭环、17 项核心 FR、业务规则、数据、接口、依赖、NFR、验收与开放问题已收稳。 | 直接需求基线 | 后续结构必须能回到 `C-L2T-1~5` 与 `FR-L2T-001~017`；外围能力不能升为核心。 |
| 当前正式 `01-架构设计.md` | 独立 truth center、`A1~A5/S1~S3/P1~P6`、`R1~R3/T1/T2/D1`、依赖、数据、交互与风险已收稳。 | 直接架构基线 | 后续代码主体必须保护写权、owner、依赖类型和同步 / 异步 / 后台分工。 |
| 六条指定上游正式链 | 分别提供 capability、execution、observation、shared contract、event carrier 与 future client 的 owner 边界。 | current workspace boundary input | 只能消费稳定 owner / no-write 边界；开放正向合同仍 blocked。 |
| `design-calibration/00_req_step_*`、`01_arch_step_*` | 保存正式 00/01 的形成过程、来源和未闭口项。 | 追溯细节 | 只用于解释正式结论，不取代正式 00/01。 |
| 参考项目已完成 02 | 展示新版强骨架、逐对象卡片、组成部分小循环和全链审计的合格粒度。 | 粒度样本 | 不得复制其领域对象或接口成为 L2 事实。 |
| 旧 `02-概要设计.md` 与 README | 暴露旧 registry / inventory / authorization / executor / MCP 等叙事和固定实现假设。 | historical material | 只能列冲突，不得作为候选的默认起点。 |

## 3. SOP 问题回答

### 3.1 当前概要设计要承接哪些需求结论

1. 仓定位与五节点闭环已经收稳：
   - `C-L2T-1`: 工具身份、正式定义与显式演进围绕同一稳定本地锚点成立。
   - `C-L2T-2`: capability-bound / unbound 分类与 body-free Binding 成立，但 Hub 保持 capability truth owner。
   - `C-L2T-3`: canonical invocation、合同一致受理与 no-execution 在真实执行前成立，Runtime 保持行动选择和编排 owner。
   - `C-L2T-4`: execution requirement、正式 authorization 结果消费和条件化 Sandbox seam 分权；不可验证时 fail closed。
   - `C-L2T-5`: normalized result / error / no-execution、Tool-domain audit 与 safe handoff 分层，本地终态先成立。
2. `FR-L2T-001~017` 已规定核心必须覆盖身份 / 定义 / 演进、Binding、调用 / 受理、前置 / 条件交接、outcome / audit / handoff，不允许概要设计删减任一节点。
3. `FR-L2T-E01~E06` 只允许形成搜索、diff、批量辅助、派生索引、诊断、消费说明和管理入口等外围结构，不得成为核心执行前置或第二写源。
4. `BR-L2T-001~042`、`BR-L2T-E01` 与 `DR-L2T-001~034` 已固定 identity、body-free relation、canonical contract、no-execution、fail-closed、source attribution、local-truth-first、forbidden body 和派生 no-write 红线。
5. `IB-L2T-001~019`、`IB-L2T-E01~E04` 只在需求层固定能力边界，正式 API / Event / Job 名称、输入输出骨架与对象归属应由本轮 02 继续收敛。
6. 依赖只允许 Core compile、Hub / Sandbox / Runtime runtime、Bus / Observability event 三类；authorization 仍是 owner-pending，SDK 仍为 future / excluded。
7. `NFR-L2T-001~019` 只提供结构性判断口径，没有量化 authority；`AC/VF` 是设计可判断来源，不是测试结果或签署事实。

### 3.2 当前概要设计要承接哪些架构结论

1. 内部语义边界已经固定为：
   - 核心：`A1` 工具合同身份与定义、`A2` Capability Binding、`A3` 规范调用与受理、`A4` 执行前置与条件交接、`A5` Outcome / Audit / Safe Handoff。
   - 支撑：`S1` 演进与影响解释、`S2` 引用有效性 / 对账 / 追溯、`S3` 受控读取 / 安全材料 / 派生辅助。
   - 受控影子：`P1~P6` 分别承接 Core、Hub、Authorization、Sandbox、Caller / Work / Trace、Bus / Observability 的允许 ref / snapshot / gap。
2. 运行角色固定为 `R1` 同步正式承接、`R2` 异步协作承接、`R3` 后台维护与派生；它们可同部署但不能混写权。
3. 状态承载固定为 `T1` 合同 / Binding truth、`T2` invocation / precondition / outcome / audit truth 与 `D1` snapshot / ref / derived material；物理共用不改变逻辑分权。
4. 外部输入必须经 `E -> F -> K` 正式承接，派生 `D` 和技术承载 `T` 只能服从核心语义，不能反向定义 truth。
5. 数据必须区分本地 truth、外部 snapshot、external reference 与 forbidden body，并锚定消费时点；后到材料形成新事实 / gap，不得原地改写历史 invocation / outcome。
6. 同步裁定、异步传播与后台派生已分层；本地 outcome / audit 与外部 submission / delivery / observation 不构成跨 owner 事务。
7. 架构只确定逻辑机制，不确定语言、目录、协议、schema、数据库、事件名、route、错误码、产品或部署拓扑；本轮概要只能下沉到代码主体骨架，不能越过详细设计边界。

### 3.3 哪些结论足够稳定，可直接作为概要设计输入

| 稳定输入组 | 可直接承接内容 | 允许在 02 中继续展开 |
|---|---|---|
| 本仓 truth owner | Tool identity、formal definition、Binding relation、canonical invocation、normalized outcome、Tool-domain audit。 | 代码主体、对象主语、接口分类、处理流和状态族。 |
| 写权与重入 | `A1~A5` 拥有核心写边界，`S1` 正式演进经 A1 收口，`S2/S3` 只读 / 派生。 | Command / Query / Job 的读写性质和正式重入路径。 |
| 外部 owner 分离 | Hub、authorization、Sandbox、Runtime、Bus、Observability、SDK 的真相均不转移。 | Boundary port、ref / snapshot 对象、failure / gap 轮廓和禁止事项。 |
| 运行角色分离 | 同步受理、异步事实收束、后台对账 / 重建逻辑可分。 | Application service / consumer / job 的主体框架与处理流。 |
| 数据四层与时点 | truth / snapshot / reference / forbidden body；消费时点锚定。 | 对象字段骨架中的 typed ref、source attribution、observed-at 类语义，不写完整字段。 |
| 失败纪律 | 必要外部输入缺失 / 冲突 / stale / unverifiable 时 fail closed；外围失败不回滚本地终态。 | 状态、异常、blocked port 和 handoff gap 轮廓。 |
| Safe material | minimal necessary、body-free、redacted、correlated 四项合取。 | 安全资格、材料准备、local attempt 对象 / 接口 / 流程。 |
| 依赖裁剪 | Core compile，Hub / Sandbox / Runtime runtime，Bus / Observability event。 | Port / adapter 主体与禁止 import 边界，不写具体包。 |

### 3.4 哪些相关结论未收稳，当前不能当作已定输入

| 未收稳输入 | 关联 blocker | Step 1 当前处理 | 后续允许的最大深度 |
|---|---|---|---|
| Authorization owner、source matrix、taxonomy、result contract 与 freshness | `L2T-UP-001~002` | 仅确认 owner-pending ref / evaluation seam 和 fail-closed。 | 可定义 L2 自有消费判断对象与 blocked port；不得定义外部 decision schema。 |
| ToolInvocation 到 Sandbox generic execution、capture / failure 到 normalized outcome 的 mapping | `L2T-UP-003` | 仅确认映射属于 L2 adapter boundary 且未 ready。 | 可定义 adapter port、mapping gap 与来源保留；不得写正向 mapping 表。 |
| Sandbox receipt / feedback / dead-letter / cleanup seam | `L2T-UP-004` | 仅确认本地 handoff context / attempt / gap。 | 不得命名外部 receipt 状态、route 或 cleanup 合同。 |
| Observability producer / source family / route / readiness | `L2T-UP-005~007` | 仅确认 safe material event collaboration 和本地 attempt。 | 可定义 candidate material / outbound port；不得声明 delivered / observed。 |
| Core Tools-specific shared contract authority | `L2T-UP-008` | 仅确认 Core-only compile 与共享类别候选。 | 可用本仓概要类型名；跨仓共享类型必须标为待 authority 对齐。 |
| SDK tools-specific client | `L2T-UP-009` | 保持 future / excluded。 | 可定义服务端 Query / Command 消费边界，不定义 SDK client 或 coverage。 |
| 量化 NFR、真实 evidence、readiness | `Q-L2T-008` 及事实纪律 | 不作为概要对象或配置输入。 | 后续 05~07 有真实 authority 后再收敛；02 不写数值或结果。 |

### 3.5 哪些边界决定概要设计不应展开到哪里

- 不重写仓定位、功能需求、用户故事、架构上下文、限界上下文、依赖取舍和技术机制比较。
- 不把 `A1~A5/S1~S3/P1~P6` 简单复制成代码目录，也不让目录便利性改变这些单元的写权。
- 不写完整 DTO / Event schema、序列化字段、完整 Rust 签名、trait 约束、DDL、事务、SQL、topic、HTTP / RPC path、retry 参数或部署配置。
- 不把 owner-pending seam 变成具体 provider / endpoint / enum / route，不把 current workspace input 写成 released / committed / ready。
- 不保存 raw request、prompt、capture、provider response、secret、credential、evidence body 或外部 truth body。
- 不建立本地 capability registry / inventory / allowlist，不实现具体 builtin / MCP / A2A / API 工具库存、external registry 或 marketplace。
- 不设计 Runtime plan / loop / orchestration / recovery，不设计 Sandbox execution lifecycle，不设计 Observability store 或 SDK client。
- 不把事件传递、观察、receipt、测试、签署、commit 或 readiness 写成已经发生。

## 4. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 冲突类型 | 问题 | 本轮处理 |
|---|---|---|---|
| “先用人话理解本仓”、背景、目标、全局位置、架构风格、选型、取舍 | 层次重复 | 重写需求和架构，挤压新版代码主体 / 对象 / 接口强骨架。 | 不继承；正式 02 按固定 14 章重建。 |
| `ToolPolicy / ToolScope` 作为本仓 allow / deny / governance truth | owner 冲突 | 把工具风险 / 执行要求升级为 authorization decision。 | 记录为 historical conflict；只保留外部正式结果消费和 fail-closed。 |
| `ToolHealth / Availability` 作为本仓正式 truth | 来源缺失 | 当前 00/01 没有对应 owner、需求和数据来源。 | 删除为正式候选；如未来需要必须回到 00/01。 |
| 本地 Tool Registry、inventory、builtin、MCP Client、Role extras、member-images | 范围冲突 | 把具体库存、外部 registry、产品装配和 client 合入工具语义契约层。 | 全部排除为 historical material。 |
| `InvokeTool` / 三态 executor / 宿主回调作为执行主线 | Sandbox / Runtime 边界冲突 | L2 会接管真实执行或让 carrier 分叉工具语义。 | 改为 canonical invocation + 条件 handoff + source consumption；实际执行留在 owner。 |
| Capture / stdout / provider response 直接归一化成结果 | truth 冲突 | 缺正式 mapping / source authority，可能把 execution material 冒充 outcome。 | 只允许受控 source ref 与 blocked mapping port。 |
| 固定 retryable / non-retryable 分类、错误码、事件、接口和函数链 | 事实与层次冲突 | 无现行来源且提前进入详细设计。 | 从现行输入重新推导概要骨架；具体 taxonomy 后移。 |
| P95 / SLA / 成功率、灰度、回滚、上线与监控指标 | 证据 / 文档层次冲突 | 无测量 authority，且属于后续测试、验收、实施 / 运维。 | 不继承；02 只保留结构性 NFR 与风险。 |
| `member` / `member-service` 直边与旧治理 / 观测组合 | 全局裁剪冲突 | 不属于当前项目依赖子集，可能制造 sibling 依赖。 | 仅通过 `P5` 安全 ref 或正式外部 seam 表达，不恢复旧直边。 |
| 旧对象、接口和数据流直接进入详细设计导航 | 逆向定义 | historical 02 反向定义当前 00/01。 | Step 4~9 必须从当前正式上游重新发现主语。 |

## 5. 改动前后对比

| 维度 | 旧材料 | 本轮 Step 1 后 |
|---|---|---|
| 直接上游 | README、旧需求 / 架构和旧概要相互引用 | 仅当前正式 00/01；上游链提供 owner seam，旧 02 仅诊断 |
| 核心主线 | definition -> request -> policy -> executor -> result -> audit | identity / definition -> optional Binding -> canonical invocation / admission -> conditional precondition / handoff -> normalized outcome / audit / safe handoff |
| Authorization | L2 自有 policy / scope / allow-deny | 外部正式 authority；L2 只评估可消费性，无法验证即 fail closed |
| Execution | L2 / host executor 主线 | Sandbox / external execution owner；L2 只有 handoff context、source consumption 和 normalized semantic outcome |
| Capability | 本地 registry / inventory / minimum scope | Hub controlled ref / safe summary + L2 body-free Binding relation |
| Observability | metrics / trace 直接输出且默认 ready | safe material + local attempt / gap；producer / route / observed 保持 blocked |
| 设计深度 | 需求、架构、接口、函数链、上线混写 | Step 1 只定输入；Step 2~13 串行下沉，Step 14 后置装配 |

## 6. 设计取舍

| 方案 | 收益 | 代价 / 风险 | 结论 |
|---|---|---|---|
| A. 沿用旧 02 并替换术语 | 写入量小 | 旧 registry、policy owner、executor 和固定接口会持续污染后续设计 | 不采用 |
| B. 当前正式 00/01 为唯一直接基线，旧材料后置审计 | 结论来源唯一，能按现行 owner 重建 | 必须完整执行 14 Step | 采用 |
| C. 将所有上游正式链内容视为已 ready | 可写出更具体协议 | 会伪造 mapping、route、schema、client 和 readiness | 不采用 |
| D. 因上游 seam 未闭口而停止全部 02 | 避免猜测 | 会把可独立收稳的 L2 逻辑主体也长期阻塞 | 不采用；采用 blocked port + conservative state |
| E. Step 1 直接拆对象和接口 | 表面推进快 | 跳过范围、约束、代码主体和候选池推导 | 不采用 |

## 7. 结构化中间产物

### 7.1 上游关系映射表

| 来源文档 | 上游章节 / 模块 | 承接内容 | 本文继续展开什么 |
|---|---|---|---|
| 当前正式 `00-需求文档.md` | §2、§4、§7、§9~§16 | 工具语义 truth 定位、五节点、核心 / 外围功能、规则、数据、接口、依赖、NFR、验收、风险和追溯。 | 将稳定需求转译为代码主体、对象、接口、处理流、状态、异常与配置影响轮廓。 |
| 当前正式 `01-架构设计.md` | §3~§10、§13~§17 | 硬约束、职责、`A/S/P` 单元、`R/T/D` 承载、依赖、数据、交互、横切、风险和追溯。 | 固定实现分层、组成部分接缝、对象归属、写权、状态传播与边界 port。 |
| `projects/L3-capability-hub/00~07` | capability identity / registry / formal exposure / controlled consumer | Hub 保持 capability truth owner，L2 只消费 controlled ref / safe summary。 | Binding source port、引用评估与 gap 轮廓；不复制 Hub schema。 |
| `projects/L4-sandbox/00~07` | isolation / run / capture / failure / handoff / cleanup | Sandbox 保持 execution truth owner，L2 只交接 canonical context 并消费允许 source material。 | 条件 handoff 与 source adapter 边界；mapping / receipt 保持 blocked。 |
| `projects/L4-observability/00~07` | observation material / projection / no-write | 观察面只读且不反写 source truth。 | Safe observation material 的逻辑消费边界；route / readiness 保持 blocked。 |
| `projects/L0-core/00~07` | shared identity / context / error / trace / metadata / envelope | Core 是唯一 compile authority 候选。 | 共享类别 boundary；Tools-specific 类型 / package 不在 02 伪造。 |
| `projects/L0-bus/00~07` | event collaboration / delivery truth | 已提交安全事实可附着事件 carrier，delivery truth 不转移。 | Outbound candidate、local attempt 与 delivery status ref 分层。 |
| `projects/L0-sdk/00~07` | client 消费服务端正式契约 | SDK 是 future consumer，tools-specific seam 未闭口。 | 服务端接口保持独立；不设计 SDK client。 |

### 7.2 本文不再回答

- 不再回答 `L2-tools` 为什么必须独立成仓，以及它是否是 runtime 行动契约层的工具调用语义契约真相仓。
- 不再回答 agent loop、LLM planning、Runtime orchestration、Capability Hub registry、authorization decision、Sandbox execution、Observability store、SDK client、external registry、inventory 和 marketplace 是否属于本仓。
- 不再回答 `A1~A5/S1~S3/P1~P6` 为什么分权，也不重新比较系统上下文、容器、依赖、数据和通信方案。
- 不再回答 Core compile、Hub / Sandbox / Runtime runtime、Bus / Observability event 的全局依赖裁剪。
- 不再回答 capture / provider response / delivery / observation 为什么不能成为 normalized outcome，或 safe material 为什么必须满足四项合取门禁。
- 不再回答旧 Tool Registry、ToolPolicy / Scope、builtin / MCP、executor、ToolHealth、固定 SLA / 事件 / 错误码 / 上线策略为何不能沿用。

### 7.3 本文必须回答

- 架构 `A/S/P` 单元、`R/T/D` 承载和 `E/F/K/D/T` 依赖角色如何转译为稳定代码主体框架。
- 本仓有哪些主要组成部分；每部分拥有哪些 capability、代码主体和对象发现线索，承担 / 不承担什么，并通过何种接缝协作。
- 哪些候选应成为独立关键对象；其概要级字段类型、状态、成员 / 工厂函数和禁止事项是什么。
- Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 与 external boundary port 如何分类，分别读写什么。
- 核心 P0 Command、外部事实消费、关键 Query 和维护 Job 如何经过入口、application service、domain object、port / store / projection，且不越过 owner。
- 哪些正式状态族影响主线，允许 / 禁止怎样迁移，如何传播为 audit、safe material 或派生状态。
- 哪些异常必须在概要层提前固定 fail-closed、no-execution、gap、degradation 和 no-write 口径。
- 哪些主体受配置影响，哪些 truth owner、invariant、authorization / Sandbox / safe-material 边界禁止配置化。
- `03-详细设计.md` 必须继续展开哪些字段、函数、DTO、port、事务、错误、配置契约、测试切口与 blocked boundary。

### 7.4 暂不定稿但必须显式承接的输入

| 主题 | 02 必须保留 | 02 不得定稿 | 后续实际阻塞点 |
|---|---|---|---|
| Authorization | consumer port、source assessment、fail-closed、gap / blocked 状态 | owner、provider、taxonomy、decision body / schema、freshness 数值 | `03~07` 正向 contract / config / test / implementation |
| Sandbox | execution requirement、handoff context、source ref、mapping port、local attempt / gap | generic mapping、receipt、DLQ、feedback、cleanup、真实 execution path | `03/05/06/07` adapter 和联调 |
| Observability | safe material、local submission attempt、event collaboration boundary | producer/source/event/topic/route、delivered / observed / readiness | `03~07` 正向交接与 evidence |
| Core | shared category dependency boundary | Tools-specific shared type / field / package | `03/05/07` compile contract |
| SDK | future consumer compatibility boundary | client API、language wrapper、coverage | SDK 设计与联调 |
| NFR / evidence | 结构性正确性、外围不阻塞、gap 可见 | P95/P99/QPS/SLA/百分比、run、alias、pass、signoff | `05~07` measurement / evidence authority |

## 8. 回填草稿

以下内容仅供 Step 14 装配正式 §1，当前不修改正式 `02-概要设计.md`。

```md
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/02_hld_step_01_upstream_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读该中间产物的“结构化中间产物”“SOP 问题回答”和“当前文档问题诊断”，了解稳定输入、blocked seam 与 historical material 如何分层。

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `projects/L2-tools/00-需求文档.md` | §2、§4、§7、§9~§16 | 工具调用语义契约真相仓、五节点闭环、核心 / 外围范围、规则、数据、接口、依赖、NFR、验收和风险基线。 |
| `projects/L2-tools/01-架构设计.md` | §3~§10、§13~§17 | `A1~A5/S1~S3/P1~P6`、`R1~R3/T1/T2/D1`、写权、依赖、数据、交互、横切与开放 seam。 |
| Hub / Sandbox / Observability / Core / Bus / SDK 当前正式链 | 各自 owner 与 L2 相关边界 | Capability、execution、observation、shared contract、event carrier 与 future client 的外部 truth 边界；开放正向合同不视为 ready。 |

本文在已收稳的需求和架构边界下继续向代码主体、主要组成部分、对象、接口、处理流、状态与详细设计承接骨架展开。本文不重新定义仓定位、系统边界、依赖取舍或数据 owner，也不把 current workspace input、开放 blocker 或 historical material 表述为已实现、已验证或 ready。

本文不再回答：需求目标、架构上下文、相邻 owner 是否属于本仓、技术机制比较与旧 registry / policy / executor 路径。

本文必须回答：代码主体框架、主要组成部分、关键对象、接口骨架、关键处理流、状态、异常、配置影响、03 承接和概要设计开放问题。
```

## 9. 待确认事项

### 9.1 处理建议

| 待确认项 | 备选 | 采用结论 | 理由 | 状态 |
|---|---|---|---|---|
| 是否沿用旧 02 主线 | A 沿用；B 只作 historical audit；C 局部拼接 | B | 当前 00/01 已重建，旧主线存在 owner 与范围冲突 | confirmed |
| 上游正式链是否等于正向合同 ready | A 是；B 仅按 owner 边界和当前事实逐项判断 | B | `L2T-UP-001~009` 明确证明多项 seam 未闭口 | confirmed |
| 开放 seam 是否阻塞整个 02 | A 全停；B 逻辑主体继续，具体正向 contract blocked | B | L2 自有对象与保守失败语义可独立收敛 | confirmed |
| Step 1 是否直接拆代码主体 | A 是；B 留给 Step 4 | B | 必须先完成 Step 2 范围与 Step 3 约束 | confirmed |

### 9.2 本 Step 未关闭事项

本 Step 不新增 blocker。`L2T-UP-001~009` 原样继承，不阻塞进入 Step 2，但会限制后续对象、接口、流、配置和详细设计承接的正向声明深度。

## 10. 进入下一步条件

- [x] 已明确正式 00/01 是唯一直接上游基线。
- [x] 已明确需求与架构中可以直接承接的稳定结论。
- [x] 已把六条相邻 owner 输入区分为 current boundary、blocked contract 或 future consumer。
- [x] 已明确本文不再回答什么、必须回答什么。
- [x] 已记录旧 02 的 registry、policy、executor、MCP、指标和上线口径为 historical conflict。
- [x] 未提前创建代码主体、对象、接口、处理流或状态结论。
- [x] `L2T-UP-001~009` 未被伪造关闭。
- [x] 可以进入 Step 2“明确本仓设计目标与当前范围”。
