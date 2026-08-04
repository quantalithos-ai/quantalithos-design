# L4-observability 02-概要设计 Step 03 · 收稳约束条件

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 3
> 回填章节: `02-概要设计.md` §3 约束条件
> 生成日期: 2026-07-08
> 状态: 已完成,等待用户确认后进入 Step 04

---

## 1. 本步目标

在 Step 01 已确认上游输入边界、Step 02 已确认设计目标与当前范围的前提下,提炼会直接影响后续代码主体框架、主要组成部分、关键对象、接口骨架、处理流和状态机表达的结构性约束。

本步只收稳“概要设计继续展开时必须持续守住什么”,不重写需求和架构原文,不提前进入完整对象字段、完整接口 schema、DDL、算法、部署、性能指标、测试门禁或实施边界。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L4-observability/design-calibration/02_hld_step_01_upstream_boundary.md` | 已完成 | 提供上游关系映射、`本文不再回答` / `本文必须回答` 清单和历史材料处理原则。 |
| `projects/L4-observability/design-calibration/02_hld_step_02_scope.md` | 已完成 | 提供本轮概要设计目标、非范围表和“可实现结构骨架层”的深度口径。 |
| `projects/L4-observability/00-需求文档.md` | 当前正式需求基线 | 提炼对后续对象、接口、处理流和状态机有直接约束力的规则边界、数据归属、依赖裁剪和 veto 项。 |
| `projects/L4-observability/01-架构设计.md` | 当前正式架构基线 | 提炼对后续代码主体框架、职责划分、一致性和路径分层有直接约束力的架构红线。 |
| `standards/document/概要设计讨论流程_SOP.md` | 已读取 Step 3 | 约束本步只输出会影响后续概要结构判断的硬约束,不得提前进入 Step 4~11 的细节。 |
| `standards/document/概要设计书写规范.md` | 已读取 4.3 | 约束正式 §3 应输出约束边界说明和约束条件表,并保持约束是“结构边界 / 表达边界”,不是技术实现限制清单。 |
| `projects/L1-governance/design-calibration/02_hld_step_03_constraints.md` | 已读取 | 作为 Step 03 粒度参考,对齐“约束必须能指导后续组成部分 / 对象 / 流程 / 状态判断”的写法。 |
| `projects/L1-artifact/design-calibration/02_hld_step_03_constraints.md` | 已读取 | 作为 Step 03 粒度参考,对齐“真相归属、只读派生、路径分层和深度控制”的收口方式。 |
| 旧 `projects/L4-observability/design-calibration/02_hld_step_03_constraints.md` | 已读取 | 仅作为 historical material,识别旧 Step 03 把对象名、schema 候选和产品心智提前写入约束的问题。 |
| 旧 `projects/L4-observability/02-概要设计.md` | 已读取 | 仅作为 historical material,识别旧正式文档中容易把约束写成对象清单或技术栈清单的位置。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取 Step 03 标准、L1 对标和前序 Step 结果 | done | 本文件 §2 |
| 从新版 `00` 提炼会影响后续概要结构判断的需求约束 | done | 本文件 §4.1、§4.2、§8.2 |
| 从新版 `01` 提炼会影响后续概要结构判断的架构约束 | done | 本文件 §4.1、§4.2、§8.2 |
| 诊断旧 Step 03 和旧正式 `02` 的约束漂移问题 | done | 本文件 §5 |
| 形成约束边界说明和约束条件表 | done | 本文件 §8 |
| 写出正式 §3 的回填草稿 | done | 本文件 §9 |
| 完成自检并回写 flow / 项目台账 | done | 本文件 §11、§12 |

---

## 4. SOP 问题回答

### 4.1 哪些约束会直接影响本仓对象、接口、处理流或状态机设计?

会直接影响后续概要设计判断的约束主要有:

- `L4-observability` 只拥有 observation truth、audit projection、body-free evidence linkage、report handoff record、retention marker、active reference protection、rebuild / replay scope 和 no-write violation 等观察面事实,不拥有业务 truth、Governance truth、Artifact / evidence 正文、Identity truth、runtime / sandbox execution truth、archive package truth 或外部产品配置 truth。
- redaction-first 和 forbidden body 是前置硬边界;任何 log、metric、trace、audit projection、diagnostic summary、report handoff 和导出面都必须建立在安全处置之后,不得存在 raw body、secret、payload body、full sensitive ref、provider response body 或其他外部完整正文的正式保存路径。
- audit projection 和 evidence linkage 必须保持 body-free、只读和可追溯;本仓只能承接引用、摘要、digest / gap / visibility 语境,不得吸收 Governance decision body、artifact body、evidence body、identity body 或 source audit 正文。
- query、diagnostic、report handoff、rebuild、replay、maintenance、dashboard、alert、external export 都只能是只读消费面或本仓局部维护面,不得写 source truth,也不得下发 kill、retry、recovery、business command 或其他执行控制命令。
- retention marker、active reference protection、archive eligibility、archive handoff 和 cleanup 语义必须分开;本仓拥有的是观察材料生命周期与引用保护事实,不拥有 archive package、recovery body 或 source cleanup truth。
- `L0-core` 是唯一编译期依赖;`L0-bus` 只是事件协作边界,不拥有 observation truth,也不是 package dependency 替身;其他 sibling repo 只能通过运行期、事件、safe ref、summary、gap 或 handoff 协作。
- 一致性分层必须持续成立:观察材料准入、关键观察事实成立、no-write violation 记录等核心路径强一致;投影传播、外围消费、报告交接、留存消费、重建 / 重放结果和外部依赖可见性按最终一致或显式 pending / gap / degraded 表达。
- 同步、异步和后台路径必须分离:同步负责准入 / 判断 / 只读查询成立,异步负责已成立观察事实传播和协作输出,后台负责重建、重放、gap scan、rollup、留存检查和交接材料维护。
- 外部产品和历史技术心智只能是产品中立候选,不能被提前提升为本仓 truth source、核心组成部分前提或约束条件本身。
- 当前概要设计只能停在可实现结构骨架层;约束必须指导后续 HLD 结构判断,但不能抢写详细设计字段、接口 schema、DDL、算法或实施规则。

### 4.2 哪些约束来自需求文档,哪些约束来自架构设计或全局设计?

| 来源 | 约束来源内容 | 本步提炼结果 |
|---|---|---|
| `00-需求文档.md` §2 / §4 / §7 | 仓定位、核心能力闭环、非目标和外围增强挂起口径 | 观察面只拥有 observation / projection / linkage / handoff / retention / no-write 主线,外围增强不得反向定义核心结构 |
| `00-需求文档.md` §10 | 业务规则与边界约束 | redaction-first、forbidden body、body-free evidence linkage、只读 query / diagnostic / handoff、retention / replay / no-write 红线 |
| `00-需求文档.md` §11 | 数据需求与数据归属 | observation truth、reference、summary、derived output 和 forbidden body 分层 |
| `00-需求文档.md` §12 | 接口与依赖 | `L0-core` 编译期依赖、`L0-bus` 事件协作、相邻 truth owner 运行期 / handoff / ref 协作 |
| `00-需求文档.md` §13 / §14 | 非功能和验收否决项 | gap / degraded / blocked 显式、no-write 违例可观察、不得伪造真实 evidence / signoff |
| `01-架构设计.md` §3 | 架构硬约束和不可变边界 | 本仓不拥有外部 truth,不保存 forbidden body,不让只读 / 维护路径反写 source truth |
| `01-架构设计.md` §5 / §6 / §8 | 职责边界、上下文和依赖方向 | `L0-core` 唯一编译期依赖、`L0-bus` 事件协作、相邻仓 truth owner 不迁移 |
| `01-架构设计.md` §9 / §10 | 数据所有权、一致性与通信方式 | 核心强一致 + 外围最终一致,同步 / 异步 / 后台路径分离 |
| `01-架构设计.md` §12 / §13 | 横切关注点和演进边界 | redaction、correlation、handoff、retention 和 no-write 必须是持续护栏;产品中立和外部候选不得抢占当前结构 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 全局依赖裁剪纪律 | sibling repo 只通过裁剪后的协作边界进入,不得回流成编译期耦合 |

### 4.3 哪些边界如果不先写清,后续最容易串到相邻仓或详细设计?

最容易失真的边界包括:

- observation truth 与 business / Governance / Artifact / Identity / runtime / archive truth 的边界。若不先写清,后续对象和状态很容易把观察输出误写成外部 truth 的第二正式含义。
- redaction marker 与 raw body、safe ref 与完整正文、body-free evidence linkage 与 evidence body 的边界。若不先写清,后续对象和接口会直接接管 forbidden body。
- audit projection / diagnostic summary / report handoff 与最终裁决 / 真实证据 / 验收签署的边界。若不先写清,后续交接接口会冒充真实执行结果。
- retention marker / active reference protection 与 archive package / cleanup / recovery body 的边界。若不先写清,后续流程会把观察材料留存误写成归档或源清理能力。
- query / diagnostic / rebuild / replay / maintenance 与 source truth 写路径或执行控制面的边界。若不先写清,后续接口和处理流会越权变成修复或控制系统。
- 概要设计骨架与详细设计契约的边界。若不先写清,Step 4~11 会迅速膨胀成完整 schema、完整函数、DDL、产品选型或实施细节。

### 4.4 哪些约束只是泛化工程原则,不应进入本章?

以下内容当前不应作为本章约束写入:

- “代码要清晰”“模块要解耦”“要高性能”“要便于维护”这类泛化工程口号。
- 具体数据库、对象存储、APM、OTel、Prometheus、Grafana、TimescaleDB、搜索、缓存、队列、调度或部署拓扑选择。
- 完整 Rust module tree、trait 签名、repository 函数、DTO / JSON / Event schema、DDL、索引、事务边界。
- 具体 redaction 算法、digest / canonicalization 算法、retention days、legal hold 参数、archive policy 细则。
- 具体测试覆盖率、性能数值、验收 evidence、真实 `run_id`、真实 evidence alias、真实 signoff 或 implementation boundary skeleton。

### 4.5 每条约束是否能指导后续章节的设计判断?

本步保留的每条约束都必须能直接指导至少一类后续判断:

- Step 04 用它判断代码主体框架是否把 intake、projection、query / handoff、retention / replay 和 no-write 防线分层展开,而不是围绕外部产品或 source truth 展开。
- Step 05 用它判断主要组成部分是否越权接管 Artifact / Governance / runtime / archive / console / external product 职责。
- Step 06 用它判断关键对象属于 observation truth、reference、summary、derived output、marker 还是 forbidden body,以及对象名是否暗含越权 truth。
- Step 07 用它判断接口是同步入口、只读查询、异步事件协作还是后台维护入口,以及是否越过 no-write 和 body-free 边界。
- Step 08 用它判断处理流是否混淆同步成立、异步传播、后台维护、gap / degraded 表达和外部交接。
- Step 09 用它判断状态机是否显式覆盖 accepted / rejected / quarantined / not-visible / degraded / blocked / conflict / replay 等观察面状态,而不是伪装成功。
- Step 10 和 Step 11 用它判断异常边界和配置影响是否仍然守住 truth ownership、redaction-first、body-free、只读与依赖裁剪边界。

---

## 5. 当前文档问题诊断

| 旧材料 / 当前风险 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `design-calibration/02_hld_step_03_constraints.md` | 直接把 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection`、`EvidenceLink` 等对象候选写成约束正文 | 重新改写为真正的结构性约束,对象与字段留给 Step 06 / Step 07 以后收口 |
| 旧 `design-calibration/02_hld_step_03_constraints.md` | 直接把 TimescaleDB、Grafana、P95、事件数量、hash chain、冷存等历史技术心智并入约束 | 明确降级为 historical material,当前只保留“产品中立候选,不得成为 truth source”口径 |
| 旧正式 `02-概要设计.md` 的约束章节 | 容易把观测对象清单、输出面和产品候选混写,缺少“哪些边界会直接决定后续 HLD 结构”的明确约束层 | 本步先钉住 truth ownership、redaction、body-free、只读、留存和依赖裁剪等护栏 |
| `00` / `01` 已经有较多边界原文 | 如果不做概要层转译,后续 Step 4~11 很容易重新发明主语或误把上游约束当成“以后再说” | 本步只保留会直接影响代码主体、对象、接口、流程和状态判断的硬约束 |
| 旧 step 链中的自动跨步门禁 | 容易把 Step 03 写完后自动推进到 Step 04 或正式装配 | 当前 gate 只允许 `wait_user_confirmation_before_step_04` |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 约束主语 | 混入对象名、schema 候选和产品名 | 只保留能指导后续 HLD 结构判断的边界约束 |
| redaction / body-free | 容易被写成对象字段或实现特性 | 改为所有对象、接口、流程和状态都必须持续守住的前置边界 |
| 只读与 no-write | 容易只停在口号层 | 明确约束 query / diagnostic / handoff / rebuild / replay / maintenance 都不得写 source truth 或下发控制命令 |
| 留存与归档 | 容易把 retention、archive、cleanup 混成一条线 | 明确 retention marker、active reference protection、archive handoff 和 cleanup 不是同一主语 |
| 依赖裁剪 | 容易把 `L0-bus` 或外部产品写成核心依赖 | 明确 `L0-core` 唯一编译期依赖,`L0-bus` 仅为事件协作,产品保持中立 |
| 深度控制 | Step 03 易提前写入详细设计或实施内容 | 明确概要设计只停在结构骨架层,不抢写 `03~07` 的职责 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接复述 `01-架构设计.md` 的所有约束 | 与架构原文一致 | 过粗,无法直接指导 Step 04~11 的结构判断 | 不采用 |
| 方案 B: 只写一句“承接上游约束即可” | 简短 | 不能实际约束后续代码主体、对象、接口、流程和状态 | 不采用 |
| 方案 C: 只保留会影响后续概要结构展开的结构性约束 | 能直接服务 Step 04~11,也不会抢写详细设计 | 需要人工筛选哪些约束真正对 HLD 结构有约束力 | 采用 |
| 方案 D: 把对象名、字段骨架、产品候选也作为约束写入 | 看起来更具体 | 会把 Step 03 变成 Step 06 / Step 07 / Step 11 的混写 | 不采用 |

---

## 8. 结构化中间产物

### 8.1 约束边界说明

概要设计不是把 `00` 和 `01` 重写一遍,而是把已经收稳的边界转译成后续结构展开时必须持续守住的护栏。对 `L4-observability` 来说,如果不先把 truth ownership、redaction-first、body-free evidence linkage、只读 / no-write、留存分层和依赖裁剪钉住,后续对象、接口、流程和状态就会很快回滑成外部 truth 副本、控制面或实现细节清单。

### 8.2 约束条件表

| 约束 | 作用范围 | 当前要求 |
|---|---|---|
| 不重写需求目标与架构主线 | Step 04~13 全部章节 | 后续概要设计只承接 `00` / `01` 已收稳的仓定位、核心闭环、职责边界、依赖方向、一致性和非目标,不重新定义上游边界或技术取舍 |
| observation truth 不得冒充外部 truth | 主要组成部分、关键对象、状态机、报告交接 | log / metric / trace / audit projection / diagnostic summary / handoff record / retention marker 只能表达观察面事实,不得被解释为 business truth、Governance truth、Artifact truth、Identity truth、runtime execution truth 或 archive truth |
| redaction-first 与 forbidden body 必须前置成立 | 代码主体框架、关键对象、接口骨架、处理流 | 所有观察输出和交接输出都必须建立在安全处置之后,不得设计 raw body、secret、payload body、full sensitive ref、provider response body 或其他外部完整正文的正式保存路径 |
| audit projection 与 evidence linkage 必须 body-free | 关键对象、接口骨架、处理流、异常边界 | 审计投影和证据关联只能承接 safe ref、summary、digest、gap、visibility 和责任语境,不得保存 evidence body、artifact body、identity body、governance decision body 或 source audit 正文 |
| correlation 只能服务观察关联,不能回推业务真相 | 关键对象、接口骨架、处理流 | correlation、trace、causation、source ref、actor / subject ref 只能作为观察关联语境,不得被写成可替代 source truth 的业务主键或事实主语 |
| query / diagnostic / handoff / rebuild / replay / maintenance 只读或局部维护 | 接口骨架、处理流、异常边界、状态机 | 这些路径只能读取、派生、重建、重放或维护本仓观察面事实,不得写 source truth,不得修复业务事实,不得下发 kill、retry、recovery 或其他执行控制命令 |
| retention marker、active reference protection、archive handoff 分层成立 | 主要组成部分、关键对象、处理流、状态机 | 本仓拥有的是观察材料留存、活动引用保护、archive eligibility 和 handoff 状态,不拥有 archive package、recovery body 或 source cleanup truth;仍被合法引用的材料不得被误清理 |
| no-write violation 必须可显式记录 | 关键对象、处理流、状态机、异常边界 | 任何试图从查询、诊断、维护、重建、重放、交接或导出路径反写 source truth 的行为都必须显式成为观察面违例事实,不得静默吞掉 |
| 核心强一致 + 外围最终一致 持续生效 | 关键对象、处理流、状态机 | 材料准入、关键观察事实成立、违例记录和关键 marker 成立按强一致表达;传播、外围消费、交接、重建结果和外部依赖可见性按 pending / gap / degraded / blocked 等最终一致语义表达 |
| 同步 / 异步 / 后台三类路径必须分离 | 代码主体框架、接口骨架、处理流 | 同步路径负责准入 / 判断 / 只读成立,异步路径负责事实传播和协作输出,后台路径负责重建、重放、gap scan、rollup、留存检查和交接材料维护;不得把异步或后台路径写成核心业务写入口 |
| `L0-core` 是唯一编译期依赖 | 代码主体框架、主要组成部分、接口骨架 | 后续概要设计不得把 `L0-bus`、`L1-*`、`L2-runtime`、`L4-*` sibling repo 或外部产品写成编译期主体;共享语义只能来自 `L0-core` |
| `L0-bus` 只是事件协作边界 | 代码主体框架、接口骨架、处理流 | bus 可以提供 tap / audit material / replay 协作语境,但 bus 不是 observation truth owner,也不由本仓接管 publish / subscribe / ack / retry / dead-letter 主干 truth |
| 外部产品只能是产品中立候选 | 代码主体框架、配置影响、详细设计承接 | OTel、Prometheus、Grafana、TimescaleDB、对象存储、搜索、alert sink、GRC export 等只能作为后续技术 / 配置候选,不能在当前概要层被写成本仓 truth source 或组成部分成立前提 |
| 配置不得改写 ownership、redaction、body-free、no-write 或依赖类型 | 配置影响轮廓、接口骨架、处理流 | 到 Step 11 时,只能讨论哪些参数受配置影响,不得让配置改变 truth owner、forbidden body 边界、只读边界、同步 / 异步 / 后台分工或 `L0-core` 唯一编译期依赖纪律 |
| 当前概要设计只停在可实现结构骨架层 | 关键对象、接口骨架、处理流、状态机、配置影响 | 后续章节允许点名组成部分名、对象类别、接口族、处理流名、状态主语和关键字段 / 参数骨架,但不得提前展开完整字段、完整 schema、DDL、算法、测试门禁或实施边界 |

### 8.3 后续章节判断映射

| 后续章节 | 本步约束将如何被使用 |
|---|---|
| Step 04 代码主体框架总览 | 判断框架是否围绕 intake、projection、query / handoff、retention / replay、no-write 防线展开,以及同步 / 异步 / 后台路径是否分层 |
| Step 05 主要组成部分、职责与边界 | 判断组成部分是否越权接管 Governance / Artifact / runtime / archive / external product 职责 |
| Step 06 关键对象轮廓 | 判断对象属于 truth、reference、summary、marker、derived output 还是 forbidden body |
| Step 07 API / 接口骨架 | 判断接口是同步入口、只读查询、异步协作还是后台维护,以及是否触碰 body-free / no-write 边界 |
| Step 08 关键处理流 / 重要函数数据流 | 判断数据流是否把核心成立、传播、重建、交接和异常降级混成一条写源路径 |
| Step 09 状态定义与状态流转 | 判断状态是否显式覆盖 accepted / rejected / quarantined / not-visible / degraded / blocked / conflict / replay 等观察面语义 |
| Step 10 异常与边界场景轮廓 | 判断异常是否覆盖 forbidden body、gap、dependency unavailable、retention conflict、no-write violation 等硬边界 |
| Step 11 配置影响轮廓 | 判断配置是否只影响参数和承载策略,而不是改写 ownership、边界和依赖裁剪 |

---

## 9. 回填草稿

以下内容供 Step 14 重建正式 `02-概要设计.md` 时回填。正式正文只摘录已确认结论,不重复问题回答、旧材料诊断或取舍过程。

```md
## 3. 约束条件

> 校准来源:
> - `design-calibration/02_hld_step_03_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_03_constraints.md` 的“结构化中间产物”“回填草稿”和“待确认事项”小节。

概要设计不是重写需求与架构,而是在既有边界下继续向可实现结构展开。对 `L4-observability` 来说,后续代码主体、组成部分、对象、接口、流程和状态必须持续守住 truth ownership、redaction-first、body-free evidence linkage、只读 / no-write、留存分层和依赖裁剪边界。

| 约束 | 作用范围 | 当前要求 |
|---|---|---|
| observation truth 不得冒充外部 truth | 主要组成部分、关键对象、状态机、报告交接 | log / metric / trace / audit projection / diagnostic summary / handoff record / retention marker 只能表达观察面事实,不得被解释为外部 truth |
| redaction-first 与 forbidden body 必须前置成立 | 代码主体框架、关键对象、接口骨架、处理流 | 所有观察输出和交接输出都必须建立在安全处置之后,不得设计 forbidden body 的正式保存路径 |
| query / diagnostic / handoff / rebuild / replay / maintenance 只读或局部维护 | 接口骨架、处理流、异常边界、状态机 | 不得写 source truth,不得下发执行控制命令 |
| `L0-core` 是唯一编译期依赖,`L0-bus` 只是事件协作边界 | 代码主体框架、主要组成部分、接口骨架 | 共享语义只能来自 `L0-core`,bus 和 sibling repo 只能通过裁剪后的协作边界进入 |
| 当前概要设计只停在可实现结构骨架层 | 关键对象、接口骨架、处理流、状态机、配置影响 | 允许点名结构主语和关键骨架,不提前展开完整实现契约 |
```

---

## 10. 待确认事项

| 编号 | 待确认事项 | 当前处理口径 |
|---|---|---|
| `Q-HLD-STEP03-001` | 正式 §3 是否保留完整 15 条约束,还是在装配时收成更短表格 | 当前中间产物保留完整约束,Step 14 再按正式文档可读性裁剪,但不得丢失核心边界 |
| `Q-HLD-STEP03-002` | `correlation` 在正式 §3 中是否单列,还是合并进 redaction / observation truth 约束 | 当前单列保留,因为它会直接影响 Step 06 / Step 07 的对象与接口主语 |
| `Q-HLD-STEP03-003` | 旧 Step 03 文件是否需要立即删除 | 当前不做删除,统一作为 `historical_material_replaced`;后续只承认本轮 Step 03 产物 |

---

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 是否只保留会影响后续概要结构判断的约束 | pass |
| 是否明确区分了需求来源、架构来源和全局依赖来源 | pass |
| 是否把 truth ownership、redaction-first、body-free、只读 / no-write、留存分层和依赖裁剪写成结构约束 | pass |
| 是否未把对象字段、接口 schema、DDL、产品选型、性能指标或实施边界提前写入本章 | pass |
| 是否未触碰正式 `02-概要设计.md` | pass |
| 是否发现阻塞 Step 04 的上游 blocker | no |

---

## 12. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已按概要 SOP Step 3、概要书写规范 4.3、新版 `00`、新版 `01`、Step 01~02 当前产物和 L1 参考粒度重建 Step 03;旧 Step 03 已降级为 historical material | wait_user_confirmation_before_step_04 |
