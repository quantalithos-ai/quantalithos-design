# L2-tools 02 概要 Step 3: 收稳约束条件

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 只提炼会改变代码主体、对象、接口、处理流、状态或配置判断的硬约束；不复述架构全文，不写实现策略。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 3 收稳约束条件 |
| 已读取台账 / flow | yes |
| 已读取前序 Step | yes: Step 1、Step 2 |
| 已读取 SOP / 书写规范 | yes: 概要 SOP Step 3；概要书写规范 §3 / §4.3 |
| 已读取正式输入 | yes: 00 的规则 / 数据 / 接口 / NFR / VF；01 的硬约束 / 依赖 / 数据 / 交互 / 横切 / 风险 |
| 旧材料处理 | 仅作约束缺失与边界冲突诊断 |
| 进入条件 | pass |
| next_allowed_action | Step 3 完成后进入 Step 4。 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 上游来源分类 | done | 需求 / 架构 / 全局 / blocker 来源表 | pass |
| Truth 与数据边界：先思考再写入 | done | owner / four-layer / time-anchor 约束 | pass |
| 调用与外部 seam：先思考再写入 | done | canonical / auth / Sandbox / handoff 约束 | pass |
| 运行与依赖：先思考再写入 | done | sync / async / background 与依赖约束 | pass |
| 派生 / 配置 / 事实纪律：先思考再写入 | done | no-write / no-ready / layer-depth 约束 | pass |
| 历史材料差异审计 | done | historical conflict 表 | pass |
| 后续章节适用性审计 | done | Step 4~12 门禁表 | pass |
| 自检与停审 | done | Step 3 完成条件 | pass |

## 2. 本步输入与来源分类

| 来源 | 本步提炼内容 | 不直接复制的内容 |
|---|---|---|
| 正式 00 §10~§14 | `BR-L2T-*`、`DR-L2T-*`、接口依赖、结构性 NFR、AC / VF 红线。 | 用户故事、FR 清单、完整验收正文。 |
| 正式 01 §3 / §6~§10 / §13 / §15 | `HC-L2T-*`、`A/S/P` 写权、`R/T/D` 承载、依赖、数据、交互和 blocker。 | 架构图、方案比较和 ADR 论证全文。 |
| Step 1 | 稳定输入、相邻 owner seam、blocked / future / historical 分层。 | 尚未收稳的正向 contract。 |
| Step 2 | 七项结构目标、非范围、“可实现代码主体骨架”深度。 | 未来对象 / 接口答案。 |
| 全局依赖 / 真相源标准 | 唯一 owner、compile/runtime/event 裁剪、handoff / failure / evidence 闭环。 | 其他仓完整依赖图。 |
| `L2T-UP-001~009` | 哪些 seam 只能保留 blocked boundary 和保守语义。 | owner、schema、mapping、route、client 或 readiness 猜测。 |

## 3. SOP 问题回答

### 3.1 哪些约束会直接影响对象、接口、处理流或状态机

- Tool identity / definition 的唯一 owner 与正式演进方式决定合同对象、Command 和 lifecycle 状态。
- Binding 只拥有 body-free relation，决定 capability 对象只能保存 typed ref / safe source context，不能保存 Hub 正文。
- Canonical invocation 不因 caller / carrier 分叉，决定入口和结果必须围绕同一对象 / 接口语义。
- Authorization decision 不归 L2 且不可验证时 fail closed，决定前置判断、blocked port 和 no-execution 状态。
- Sandbox execution truth 不归 L2且 isolation 不可旁路，决定 handoff / source ref / attempt 与 run / capture / receipt 状态必须分离。
- Normalized outcome 与 execution material / delivery / observation 分层，决定结果对象、归一化流和 audit 状态。
- Local outcome / audit first 与 safe-material 四项门禁决定外部提交只能形成 local attempt / gap，不能改变终态。
- Truth / snapshot / reference / forbidden body、消费时点锚定和派生 no-write 决定字段、查询、Job、状态传播和异常边界。
- Core-only compile 与 runtime / event seam 决定 port / adapter 层，而不能把 sibling 类型或 material handoff 当 package dependency。
- Open contract 不得写成 ready 决定 Step 7~12 必须显式标出 blocked boundary。

### 3.2 约束分别来自哪里

| 约束组 | 需求来源 | 架构 / 全局来源 |
|---|---|---|
| Identity / definition / evolution | `FR-L2T-001~003`;`BR-L2T-001~008`;`DR-L2T-001~006` | `A1/S1/T1`;`HC-L2T-001/014` |
| Binding | `FR-L2T-004~006`;`BR-L2T-009~015`;`DR-L2T-007~012` | `A2/P2/S2`;`HC-L2T-002` |
| Invocation / admission | `FR-L2T-007~009`;`BR-L2T-016~022/027`;`DR-L2T-013~018` | `A3/P5/R1/T2`;`HC-L2T-003/004` |
| Precondition / authorization / Sandbox | `FR-L2T-010~013`;`BR-L2T-023~031`;`DR-L2T-019~026` | `A4/P3/P4`;`HC-L2T-005/006/012`;`UP-001~004` |
| Outcome / audit / handoff | `FR-L2T-014~017`;`BR-L2T-030~042`;`DR-L2T-027~034` | `A5/P4/P5/P6`;`HC-L2T-007~010`;`UP-005~007` |
| Dependency / shared contract | `DB-L2T-001~008`;`VF-L2T-012` | `E/F/K/D/T`;`HC-L2T-011/012`;全局依赖规则；`UP-008~009` |
| Quality / fact discipline | `NFR-L2T-001~019`;`VF-L2T-008~013` | `R1~R3`;横切关注点；真相源标准 |

### 3.3 哪些边界若不先写清最容易串线

1. Tool identity 与 capability identity、显示名、implementation / inventory item。
2. Formal definition 与 provider descriptor、SDK wrapper、builtin / MCP schema。
3. Binding / Hub visibility / applicability 与 authorization / allowlist。
4. Canonical invocation 与 Runtime action、plan、transport payload、raw request。
5. Execution requirement 与 effective authorization decision。
6. Handoff context / local attempt 与 Sandbox accepted、receipt、run、capture、cleanup。
7. Execution source material 与 normalized result / error。
8. Tool-domain audit 与 Bus delivery audit、Observability projection、Runtime checkpoint。
9. Safe material / local attempt 与 delivered / observed / accepted。
10. Search / diff / diagnostic / reconciliation 与正式写入口。

### 3.4 哪些只是泛化工程原则，不进入本章

- “高内聚、低耦合”“代码可读”“性能要好”“日志完整”等无法直接判定对象 / 接口 / 状态的口号。
- 语言、框架、数据库、消息产品、缓存、搜索、调度、部署拓扑和目录偏好。
- 完整 API / DTO / Event / trait、DDL、事务、索引、retry 算法、错误码和配置项。
- 量化 P95 / P99 / QPS / SLA、覆盖率、测试命令、evidence 路径和实施排期。

### 3.5 每条约束怎样指导后续判断

每条正式约束必须至少拦截一类错误：错误代码主体、错误对象 owner、错误接口读写性质、错误处理流跨界、错误状态归属、错误配置开关或错误 readiness 声明。不能落到上述判断的内容不进入正式约束表。

## 4. 当前文档问题诊断

| 旧口径 | 缺失 / 错误约束 | 后续风险 | 本轮处理 |
|---|---|---|---|
| `ToolPolicy / Scope` 在本仓产生 allow / deny | 未保护 authorization owner | A4 对象和接口自授权 | 约束为 requirement / external-result consumption 分权且 fail closed。 |
| 本地 registry / inventory / builtin / MCP | 未保护 Hub / product owner | A1/A2 对象复制 registry / implementation truth | 约束为 body-free Binding 和正式合同独立 identity。 |
| Executor / host callback / Sandbox 混合 | 未保护 execution owner | L2 状态机出现 run / capture / cleanup | 约束为 conditional handoff + source ref，execution lifecycle 禁入。 |
| Capture / stdout 直接变 result | 未保护 source / semantic mapping | 无来源材料被写成成功 | 约束为 source attribution + mapping boundary + normalization assessment。 |
| Retryable / denied / blocked 混为 tool result taxonomy | 未区分工具失败、no-execution、external gap | Runtime 恢复语义反向进入 L2 | 约束为 local terminal category 与 external degradation 分层。 |
| Audit / metrics / trace 默认同一输出 | 未保护 Tool-domain / delivery / observation 分权 | 外围状态反写结果 | 约束为 local audit first、safe material 和 local attempt。 |
| 固定 SLA / 上线 / 灰度 / 回滚 | 未保护 evidence 与文档层次 | 02 伪造实施事实 | 约束为非量化结构判断和后续文档职责。 |

## 5. 改动前后对比

| 维度 | 旧材料 | 当前约束基线 |
|---|---|---|
| Owner | tools 同时拥有合同、策略、执行和健康 | 仅拥有工具语义合同、调用、outcome / audit；外部 truth 分权 |
| 数据 | 正式对象与 raw / external material 边界模糊 | truth / snapshot / reference / forbidden body + source time anchor |
| 失败 | retry / deny / blocked / execution failure 混写 | no-execution、tool failure、execution failure、mapping gap、handoff degradation 分层 |
| 外部协作 | handoff 近似成功 / ready | 只记录 local eligibility / preparation / attempt / gap |
| 依赖 | 旧 sibling 与 product 主线较多 | Core compile；Hub/Sandbox/Runtime runtime；Bus/Observability event |
| 配置 | 未限制开关对 policy / execution 的影响 | 任何配置不得改 owner、不变量、fail-closed、isolation 或 safe-material 门禁 |

## 6. 设计取舍

| 方案 | 收益 | 代价 | 结论 |
|---|---|---|---|
| A. 复制正式 01 的 14 条 HC | 来源直接 | 仍是架构语言，不能完整指导对象 / 接口 / 状态 | 不采用 |
| B. 将 HC、BR、DR、依赖、blocker 转译为概要结构门禁 | 可用于 Step 4~12 审查 | 表更长，需要逐章节适用性检查 | 采用 |
| C. 把 schema / error / retry / storage 规则一起固化 | 看似更可落码 | 越入 03，且开放 seam 会被伪闭合 | 不采用 |
| D. 对未闭口 seam 不设任何结构 | 避免假设 | 实现者会自行补 provider / route / mapping | 不采用；采用 blocked port 和 gap 状态 |

## 7. 结构化中间产物

### 7.1 约束条件表

| ID | 约束 | 作用范围 | 当前要求 |
|---|---|---|---|
| `HLC-L2T-001` | Tool contract 单一 owner | Step 4~9 的主体、对象、接口、流和状态 | Stable Tool identity、current formal definition 与其正式演进只能由 L2 核心边界建立；显示名、implementation、inventory、provider、capability 或 client 不得替代。 |
| `HLC-L2T-002` | 五节点核心不得缺项或互相吞并 | 组成部分、对象候选、处理流覆盖 | Identity / definition、Binding、invocation / admission、precondition / conditional handoff、outcome / audit / safe handoff 均须有承载；不是每次调用固定流水线，但任一语义不得消失。 |
| `HLC-L2T-003` | 显式演进必须正式重入 | 合同对象、Command、Job、状态机 | 定义更正、修订、兼容影响和退役经正式合同写边界形成新事实；查询、diff、对账或 Job 只能报告，不得静默改 current definition。 |
| `HLC-L2T-004` | Binding 仅为 body-free 本地 relation | Binding 对象、Hub port、校验流和状态 | 必须锚定本地 tool identity 与 Hub 正式 ref；不得复制 registry / descriptor / exposure / applicability，也不得把可见性解释为 authorization。 |
| `HLC-L2T-005` | Canonical invocation 跨 caller / carrier 单一 | Invocation 对象、入口、carrier port、outcome | Runtime、direct caller、adapter、Sandbox 或 future SDK 只能适配同一 invocation / result / error 语义；raw request、plan、loop、checkpoint 不入 truth。 |
| `HLC-L2T-006` | Admission / no-execution 必须先于真实执行 | Submit / admission 流、invocation 状态、audit | 合同不可解析、定义失效、适用 Binding 不成立或前置无法验证时须显式拒绝 / 等待；不得用后到 execution material 反推已受理。 |
| `HLC-L2T-007` | Execution requirement 不等于 authorization | A4 主体、对象、接口和状态 | L2 只能形成合同内执行要求与外部结果消费判断；不得创建 allow / deny / approval truth、owner 优先级或高风险 taxonomy。 |
| `HLC-L2T-008` | 正式 authorization 不可验证即 fail closed | Authorization ref / assessment、precondition flow | 来源、有效性、结论缺失 / stale / conflict / unverifiable 时只能等待、blocked 或 no-execution；`UP-001~002` 未关闭前正向 port 保持 blocked。 |
| `HLC-L2T-009` | Sandbox-required 隔离不可旁路 | Carrier requirement、handoff、状态 / 异常 | 不得宿主直跑、调用方本地降级或以配置绕过；L2 不拥有 accepted、receipt、run、capture、failure、cleanup、recovery。 |
| `HLC-L2T-010` | Handoff 与 execution lifecycle 分离 | Handoff context / attempt / gap、Sandbox ports | Prepared / attempted 仅是本地事实，不表示外部 accepted / executed；mapping / receipt / cleanup 未闭口时只能显式 gap。 |
| `HLC-L2T-011` | Execution source 必须可归因且不能直接冒充 outcome | Source ref / assessment、normalization flow | 只消费正式 owner 的允许 ref / safe summary，保留 source、消费时点和已知缺口；`UP-003~004` 未关闭前不得声称正向 mapping ready。 |
| `HLC-L2T-012` | Outcome 语义必须分层 | Result / error / no-execution 对象、状态与 Query | Success、tool failure、execution failure、no-execution、normalization blocked 与 external handoff degradation 可区分；capture / provider / transport / delivery / observation 不是 outcome。 |
| `HLC-L2T-013` | Local outcome / Tool-domain audit first | Outcome commit、audit、external handoff flow | 本地终态与 audit 先成立；Bus / Observability / Runtime 消费失败不回滚、不覆盖、不重新裁决，也不触发 L2 接管 Runtime recovery。 |
| `HLC-L2T-014` | Safe material 四项合取且 forbidden body 无例外 | Safe eligibility、material、event / query、diagnostic | 外发必须同时 minimal necessary、body-free、redacted、correlated；raw request / prompt / capture / provider response、secret、credential、evidence body 永不进入对象或输出。 |
| `HLC-L2T-015` | Truth / snapshot / reference / derived 分层 | 所有对象、stores、Query、Consumer、Job | 本地存在不等于本地拥有；external snapshot / ref 保持 owner attribution，derived 可 stale / rebuild，不得反写 truth。 |
| `HLC-L2T-016` | 消费时点锚定且历史不可穿越改写 | Snapshot / ref 字段骨架、状态、对账流 | 外部 ref / snapshot 记录消费时点语义；后到变化形成新 assessment / fact / gap / re-evaluation，不原地改写既有 invocation / outcome。 |
| `HLC-L2T-017` | 重复输入与变化必须幂等地维持单一 truth | Command / Consumer、evolution、binding、outcome | 同一语义输入不得分叉身份、revision、Binding、invocation 或终态；具体 key / 算法留给 03。 |
| `HLC-L2T-018` | 同步、异步与后台职责分离 | Inbound、Application service、Consumer、Job、flow | 执行前裁定同步收口；外部变化 / source 与 post-truth 传播异步承接；检查 / 对账 / 派生 / rebuild 后台执行，任何异步 / Job 正式变化必须重入核心。 |
| `HLC-L2T-019` | Core-only compile 与三类依赖 | Ports / adapters、类型来源、接口 | 只有 Core 可成为 compile authority；Hub / Sandbox / Runtime 为 runtime seam，Bus / Observability 为 event collaboration；material handoff 不是第四类依赖。 |
| `HLC-L2T-020` | 外围读取 / 派生不可成为核心前置 | Search / diff / diagnostic / report / Query / Job | 外围能力可延迟、stale、unavailable 或重建；不得创建合同、Binding、invocation、outcome 或阻塞无关核心路径。 |
| `HLC-L2T-021` | 配置不得改变 truth 与安全边界 | Step 11 与所有可配置主体 | 配置不得改变 owner、canonical semantics、fail-closed、Sandbox requirement、forbidden body、safe-material 门禁、依赖类型、状态非法迁移或 local-truth-first。 |
| `HLC-L2T-022` | Open / pending / future 不得表述为 ready | Objects、ports、flows、config、handoff、风险 | `UP-001~009` 相关 provider、schema、mapping、route、receipt、package、client、measurement 只能是 blocked / pending / future；不得用旧材料补空白。 |
| `HLC-L2T-023` | 概要层保持 code-subject skeleton 深度 | Step 4~12 与正式装配 | 可点名对象 / API / Event / Job 和概要类型；不得写完整 schema / 签名 / 实现 / DDL / protocol / config key / test / implementation fact。 |
| `HLC-L2T-024` | 无 measurement / evidence authority 不量化或声明通过 | 风险、配置、后续承接 | 02 不写 P95 / P99 / QPS / SLA / 百分比、run、evidence alias、测试结果、签署、commit 或 readiness。 |

### 7.2 后续章节门禁表

| Step | 必须使用的约束 | 关键门禁问题 |
|---|---|---|
| 4 代码主体 | `001~005`;`013~015`;`018~020`;`022~023` | 业务主体是否保护 owner / write boundary；实现层是否把 sibling 或技术载体变成核心。 |
| 5 组成部分 | `001~016`;`018~020` | 五节点是否完整；每部分 capability、非职责和 seam 是否清晰。 |
| 6 对象 | `001~017`;`020`;`022~023` | 每个对象属于 truth / snapshot / ref / derived 哪类；是否含外部正文、伪状态或孤儿主语。 |
| 7 接口 | `003~014`;`017~023` | Command / Query / Consumer / Event / Job / Port 是否分类正确；blocked seam 是否显式。 |
| 8 处理流 | `003~018`;`020~023` | 流是否从正式入口到本地结果；是否出现跨 owner 伪事务、隐式执行或外围前置。 |
| 9 状态 | `003~018`;`020~022` | 状态是否归本地对象；外部 accepted / run / delivered / observed 是否被误并。 |
| 10 异常 | `004~016`;`020~022` | Owner / source / forbidden body / fail-closed / degradation 是否覆盖。 |
| 11 配置 | `007~010`;`013~016`;`019~024` | 配置是否可能绕过不变量、生成外部 truth 或伪造 readiness。 |
| 12 详细设计承接 | 全部 | 是否把 stable skeleton 与 blocked contract 分开，且未新增前文主语。 |

## 8. 回填草稿

Step 14 装配正式 §3 时使用 §7.1，保留 `ID / 约束 / 作用范围 / 当前要求` 四列；正式正文不复制问题回答、差异审计或完整来源分类。章末使用一段短文说明：这些约束保护概要层结构边界，并不替代 03 的完整契约或 04~07 的配置、测试、验收和实施事实。

## 9. 待确认事项

| 待确认项 | 采用结论 | 状态 |
|---|---|---|
| 是否只复述架构 HC | 将 HC 与 BR / DR / dependency / blocker 转译为 24 条可执行概要门禁。 | confirmed |
| 未闭口 seam 是否从约束中删除 | 保留 blocked port / gap / fail-closed 约束，但不补正向 schema。 | confirmed |
| 是否加入具体幂等、retry、存储和配置实现 | 只固定语义要求，具体实现后移 03/04。 | confirmed |

本 Step 不新增 blocker；`L2T-UP-001~009` 已进入 `HLC-L2T-008/010/011/022/024`。

## 10. 进入下一步条件

- [x] 24 条约束均能影响至少一个后续结构判断。
- [x] 五节点、外部 owner、数据四层、时点、失败、依赖和事实纪律全部覆盖。
- [x] 已建立 Step 4~12 适用性门禁。
- [x] 没有泛化工程口号、产品选型、schema、错误码、配置 key 或量化承诺。
- [x] 可以进入 Step 4“代码主体框架映射”。
