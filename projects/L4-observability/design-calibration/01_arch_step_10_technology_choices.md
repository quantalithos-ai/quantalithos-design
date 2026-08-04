# L4-observability 01-架构设计 Step 10 · 关键技术选型

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 10
> 回填章节: `01-架构设计.md` §11 关键技术选型
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 11

---

## 1. 本步目标

明确 `L4-observability` 当前架构主线中哪些技术机制、架构手段或治理方式已经上升为架构层决定,分别解决什么结构问题、为什么当前采用、带来什么代价或约束。

本步不写技术栈清单、产品名、框架名、协议选型、数据库选型、队列产品、缓存产品、搜索产品、对象存储产品、APM 产品、dashboard 产品、GRC 产品、接口路径、事件名、DTO、schema、表结构、索引、P95 指标、部署参数、worker 名称或代码对象。本步尤其不把旧 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等 schema 名称写成关键技术选型。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | 当前台账显示 Step 09 已完成,用户已确认进入 Step 10 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~09 pass,Step 10 blocked by user confirmation | 确认本轮只允许推进 Step 10。 |
| `design-calibration/01_arch_step_02_arch_goals_constraints.md` | Step 02 已完成 | 提供架构目标、不可变约束、当前阶段取舍和架构非目标。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | Step 06 已完成 | 提供同步入口、异步观察材料消费、后台维护交接、观察面真相承载和派生交接承载。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | Step 07 已完成 | 提供核心保护、外部接缝、依赖倒置、跨仓裁剪和禁止反向依赖。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | Step 08 已完成 | 提供 truth / snapshot / ref / forbidden body、一致性策略和失败处理口径。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | Step 09 已完成 | 提供同步 / 异步 / 后台延后承接判断和失败降级口径。 |
| `projects/L4-observability/00-需求文档.md` §10 / §11 / §12 / §13 / §14 / §15 | 正式需求基线已完成 | 校验规则、数据归属、接口依赖、NFR、验收和风险。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 10 | 已读取 | 控制本步必须输出机制、理由、代价和不采用口径。 |
| `standards/document/架构设计书写规范.md` §4.11 | 已读取 | 控制关键技术机制表的粒度、正反例和禁写范围。 |
| `projects/L1-governance/design-calibration/01_arch_step_10_technology_choices.md` | 已读取 | 参考机制级选型、不采用口径和边界说明的组织方式。 |
| `projects/L1-artifact/design-calibration/01_arch_step_10_technology_choices.md` | 已读取 | 参考 truth / reference / derived separation、同步 / 异步 / 后台分离和产品延后口径。 |
| 旧 `design-calibration/01_arch_step_10_technology_choices.md` | historical material,已被本文件替换 | 仅作为 schema 清单和错误门禁诊断来源,不继承旧技术结论。 |
| 旧 `projects/L4-observability/README.md` 与旧 `01-架构设计.md` | historical material | 仅作为旧技术栈、旧指标、旧产品、旧事件数量和旧实现假设诊断来源。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 02 / 06 / 07 / 08 / 09、SOP Step 10 和书写规范 4.11 | done | 本文件 §2 |
| 读取正式 00 NFR / 验收 / 风险、旧 Step 10、旧 README / 旧正式 01 和 L1 参考 Step 10 | done | 本文件 §2 / §5 |
| 回答当前采用机制、解决问题、为什么不用其他方案、代价和暂不引入口径 | done | 本文件 §4 |
| 输出关键技术机制表、按架构单元组织的机制适用表、当前不采用口径表和技术边界说明 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 10 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 当前采用哪些关键架构机制?

当前正式采用的关键机制是:

1. 通过正式承接边界隔离外部观察材料与 Observability 核心语义。
2. 采用 redaction-first / safety marker 前置机制。
3. 采用 correlation context 与 safe ref 统一关联机制。
4. 采用 observation truth / derived projection / reference / forbidden body separation。
5. 采用 audit projection 与 source audit / Governance truth 分离机制。
6. 采用 body-free evidence linkage 与 authenticity hint 机制。
7. 采用核心强一致 + 派生 / 外围最终一致机制。
8. 采用同步即时判断、异步材料送达和事实传播、后台派生维护三类路径分离机制。
9. 采用只读派生视图 / diagnostic / report handoff / dashboard / alert / GRC export 承接消费机制。
10. 采用 retention marker + active reference protection + archive handoff 分离机制。
11. 采用 no-write guard 与 no-write violation 可审计机制。
12. 采用幂等与顺序保护机制承接重复、乱序、重放和延迟材料。
13. 采用 traceability / audit projection / report handoff trail 机制支撑追溯和交接解释。
14. 采用产品中立外部能力适配机制,并延后 OTel、Prometheus、Grafana、TimescaleDB、对象存储、APM、GRC、alert sink、search、cache、queue 等产品硬选型。

这些都是机制级架构选择,不是产品清单、对象模型清单或实现方案。

### 4.2 每个机制解决什么问题?

这些机制分别解决外部来源打穿观察核心、raw body 和敏感正文污染、opaque id / label / topic 被误当业务 truth、审计投影替代治理或 source audit、evidence body 入仓、派生消费反写真相、report handoff 伪造成真实验收材料、retention / cleanup / replay 误清活动引用、维护路径修复 source truth、重复输入产生重复观察事实、跨仓材料不可追溯、外部产品反向定义观察语义和旧技术假设污染新版架构等结构性问题。

### 4.3 为什么不用其他方案?

不采用“外部入口直接写 Observability 核心”,因为 source owner、bus、runtime、sandbox、identity、governance、artifact、report、archive、console、GRC 或 APM 会反向定义 observation truth。

不采用“保存 raw log / payload / prompt / provider response / evidence body / artifact body”,因为会打穿 redaction-first、forbidden body 和 body-free evidence linkage 边界。

不采用“直接依赖相邻仓源码”,因为会破坏 `L0-core` 唯一编译期依赖和 sibling truth owner 平权边界。

不采用“外部 APM / dashboard / storage / GRC 产品定义观察语义”,因为产品配置、存储模型和展示维度不能成为 truth source。

不采用“所有观察相关交互同步完成”或“所有观察相关交互异步化”,因为准入、可见性、handoff、retention 和 no-write 需要即时判断,材料送达、事实传播、派生、导出和外部消费又不应阻塞核心 truth。

不采用“report handoff 直接生成真实 evidence、final verdict 或 signoff”,因为设计文档不能伪造真实测试执行与验收材料。

### 4.4 每个选型带来什么代价或新风险?

这些机制共同带来的代价是:边界层更多、状态表达更严格、redaction / safety / visibility 必须贯穿所有输出、correlation 和 safe ref 需要稳定维护、引用和快照状态需要显式表达、异步传播和交接需要可追踪、派生视图和报告材料需要 stale / rebuilding / failed 语义、retention 与 active reference protection 需要持续对账、no-write guard 需要覆盖读 / 维护 / 交接 / 导出路径,后续详细设计还必须持续防止实现层绕过正文边界、依赖边界、派生反写边界和真实性边界。

这些机制降低了 observation truth 被污染的风险,但提高了对象状态、边界判断、追溯材料、运行解释、测试覆盖和运维可见性的设计成本。

### 4.5 哪些选型是当前阶段必要的,哪些暂不引入?

| 类别 | 当前口径 |
|---|---|
| 当前阶段必要 | 正式承接边界、redaction-first、安全标记、correlation context、safe ref、truth / derived / reference / forbidden body separation、audit projection 分离、body-free evidence linkage、核心强一致 + 外围最终一致、同步 / 异步 / 后台分离、只读派生消费、retention + active reference protection、no-write guard、幂等 / 顺序保护、traceability / handoff trail、产品中立适配 |
| 当前阶段暂不硬化 | 具体语言栈、数据库产品、消息产品、时序存储、对象存储、搜索 / 缓存产品、OTel / Prometheus / Grafana / TimescaleDB / APM / GRC / alert sink、hash 算法、canonicalization 算法、完整事件溯源方案、具体 API / event / job 协议、旧 P95 / SLA / 冷存天数 / 事件数量 / hash chain 分片 |

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `01_arch_step_10_technology_choices.md` 把 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection`、`RedactionDecision`、`CorrelationContext` 等写成结构化中间产物 | Step 10 应写机制级技术选型,不应提前固定对象模型、字段或 schema 名称。 | 全部降级为 historical material,本步按机制、理由、代价和不采用口径重写。 |
| 旧 Step 10 `next_allowed_action=next_step_or_formal_assembly` | 与用户要求一个 Step 一个 Step 停审冲突,且 Step 10 后应等待 Step 11 确认。 | 改为 `wait_user_confirmation_before_step_11`。 |
| 旧 README 把 OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95、147 events、冷存年限和 hash chain 分片写成技术主线 | 产品、指标和容量想象不是 Step 10 机制级选型结论。 | 只作为 historical material;产品、容量、SLO、配置和测试后移。 |
| 旧正式 `01-架构设计.md` 混写产品栈、存储、schema、性能指标、目录和实现假设 | 未经本轮 Step 01~10 停审,且会把产品和实现机制误写成架构选型。 | Step 16 前不得继承旧正式正文。 |
| Step 08 / Step 09 已定义数据和通信边界,但未说明哪些技术机制进入架构主线 | 数据归属和通信方式不等于技术机制选型。 | 本步只把影响边界保护、一致性和交互主链的机制提到架构选型层。 |
| 需求 NFR 保留可用性、性能、安全、追溯和运维要求,但未给出正式负载模型 | 当前不能把旧 P95 / P99 / SLA 或容量数字写成硬选型。 | 作为后续测试方案、验收标准和实施计划输入。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 选型主语 | schema、字段、产品、指标和泛观察能力 | 机制级技术选型 / 架构手段 | 4.11 要求说明机制解决的问题、理由和代价。 |
| 安全边界 | redaction 容易变成字段或输出过滤 | redaction-first / safety marker 作为准入和输出前置机制 | 防止 forbidden body 入仓或泄漏。 |
| 关联语义 | trace id、span id、topic、label 或 opaque id 容易散落 | correlation context 与 safe ref 统一关联机制 | 防止从 opaque id 反推业务 truth。 |
| 数据归属 | log / metric / trace / audit 对象像独立 truth | observation truth / derived / ref / forbidden body separation | 防止对象清单替代所有权判断。 |
| 证据和报告 | evidence link / report handoff 容易生成伪证 | body-free linkage、authenticity hint 和 handoff trail | 防止 evidence body 入仓和伪造验收。 |
| 留存和重建 | hash chain、冷存、cleanup、replay 容易写成实现 | retention marker、active reference protection 和 no-write guard | 防止误清材料或修复 source truth。 |
| 外部产品 | OTel / Prometheus / Grafana / TimescaleDB 像核心前置 | 产品中立适配,产品硬选型后移 | 防止外部产品配置定义 observation truth。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接继承旧 OTel / Prometheus / Grafana / TimescaleDB / object storage / hash chain 方案 | 实施想象清晰。 | 过早锁定产品、存储、指标和算法,且可能让外部产品反向定义观察语义。 | 不采用。 |
| 方案 B: 按机制级选型说明解决的问题、采用理由和代价 | 能承接职责、依赖、数据和通信结论,并为后续概要 / 详细设计提供红线。 | 后续仍需落到具体对象、协议、存储、产品和测试。 | 采用。 |
| 方案 C: 当前强制完整事件溯源、hash chain、时序库、对象存储和外部 APM | 追溯和观测能力想象完整。 | 当前缺必要性证明,会显著抬高 P0 复杂度并提前决定持久化模型和产品栈。 | 不采用。 |
| 方案 D: 不写关键技术机制,全部留到详细设计 | 避免过早承诺。 | 后续设计缺少机制级红线,容易反复串仓、反写和伪造 evidence。 | 不采用。 |
| 方案 E: 把 report、dashboard、alert、GRC export 作为核心 truth 写源 | 能满足外围消费想象。 | 会让派生和外部系统成为第二 observation truth。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| 是否当前锁定 OTel / Prometheus / Grafana / TimescaleDB / 对象存储 / APM / GRC / alert sink | A. 直接锁定;B. 不锁产品,只锁产品中立适配和边界机制 | B | 当前缺产品级输入和实施约束,且产品不能反向定义 observation truth。 |
| 是否当前选择具体 hash / digest / canonicalization / chain 算法 | A. 锁定;B. 不锁,只确认 body-free linkage、完整性线索和可追溯约束 | B | 算法必须服务 truth 边界,不能先于证据和报告交接边界闭口。 |
| 是否把完整事件溯源作为当前必选 | A. 必选;B. 暂不必选,只确认 traceability、event collaboration、handoff 和 rebuild 机制 | B | Observability 需要可追溯,但完整 ES 持久化模型需要后续取舍。 |
| 是否继承旧 P95 / SLA / 冷存 / 事件数量作为架构硬约束 | A. 继承;B. 不继承,后续由测试 / 验收和容量验证收敛 | B | 当前缺正式负载模型和测量来源。 |
| 是否允许 report handoff 生成真实 evidence、verdict 或 signoff | A. 允许;B. 不允许,只交接观察线索、脱敏状态、缺口和真实性提示 | B | 真实 evidence 和 signoff 只能来自真实测试与验收阶段。 |
| 是否允许除 `L0-core` 外引入编译期仓依赖 | A. 允许;B. 不允许,一律通过运行期 / 事件协作 / adapter / SDK / handoff 边界 | B | 对齐 Step 07 和全局依赖裁剪规则。 |

---

## 8. 结构化中间产物

### 8.1 关键技术机制表

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 通过正式承接边界隔离外部观察材料与 Observability 核心语义 | 防止 source owner、bus、runtime、sandbox、identity、governance、artifact、archive、report、console 或外部产品直接写 observation truth。 | Observability 面对多来源材料和多类消费方,若不隔离外部输入会迅速吸收 source truth、execution truth、governance truth 或 evidence body。 | 增加承接层判断、输入状态、拒绝 / pending / quarantine 口径和测试成本。 | 该机制决定外部能力如何进入核心边界,属于架构层结构性决定。 |
| redaction-first / safety marker 前置机制 | 防止 raw body、secret、credential、payload body、full sensitive ref、raw log、raw prompt 或 provider response 污染入仓、查询、诊断和报告。 | Step 02 / 03 / 08 已确认 forbidden body 是硬边界;任何观察输出都必须先满足安全处置语境。 | 需要维护安全状态、隔离 / 拒绝语义、not-visible 解释和覆盖所有输出面的测试。 | 这不是局部过滤实现,而是 observation truth 成立前置条件。 |
| correlation context 与 safe ref 统一关联机制 | 防止 trace id、span id、causation id、topic、route、label、opaque id 或 dashboard 维度被误读为业务 truth。 | 横切观察和报告交接必须能解释来源、关联、责任主体和缺口,但不能从 ID 或 label 反推外部正文。 | 需要稳定关联语境、引用解析状态、unresolved / gap 语义和跨来源一致解释。 | 该机制影响审计投影、诊断、evidence linkage 和 handoff 主链。 |
| observation truth / derived projection / reference / forbidden body separation | 防止日志、指标、追踪、审计投影、报告、dashboard、GRC 导出和外部正文混成一套 truth。 | Step 08 已确认本仓只拥有观察面事实、审计投影、body-free linkage、handoff、retention 和 no-write truth。 | 需要为派生滞后、引用缺失、正文不可见、快照过期和重建状态提供显式语义。 | 该机制同时影响数据归属、一致性和后续对象建模。 |
| audit projection 与 source audit / Governance truth 分离机制 | 防止只读审计投影替代 source audit truth、Governance decision、Artifact lineage 或 Identity truth。 | Observability 必须服务横切审计可见性,但不能接管相邻 truth owner 的正式裁决和正文。 | 需要维护来源、责任、缺口、not-visible、stale 和 handoff purpose。 | 该机制保护审计投影成为只读观察面,而不是第二治理仓。 |
| body-free evidence linkage 与 authenticity hint 机制 | 防止 evidence link、digest、hash linkage 或 evidence index input 变成 evidence body / artifact body 副本或真实验收材料。 | 本仓需要为报告和审计提供证据线索,但 evidence body 和真实测试 evidence 不归本仓。 | 需要区分真实执行证据、待补齐材料、设计期占位、不可见证据和缺口。 | 该机制直接保护 evidence ownership 和验收真实性。 |
| 核心强一致 + 派生 / 外围最终一致机制 | 防止准入、安全处置、关联、audit projection、evidence linkage、handoff、retention 和 no-write 出现半成立状态,同时避免外围消费阻塞核心。 | Step 08 已确认核心 truth 必须同步成立或拒绝,查询视图、rollup、dashboard、report、GRC、archive handoff 可延迟。 | 需要解释 pending、blocked、failed、retryable、stale、rebuilding、unavailable 和 degraded 状态。 | 该机制定义观察事实和消费状态如何成立。 |
| 同步即时判断、异步材料送达和事实传播、后台派生维护三类路径分离机制 | 防止外部结果和派生维护阻塞主路径,也防止后台任务隐式推进 source truth。 | Step 09 已确认三类通信方式分别服务准入 / 可见性即时判断、观察材料送达 / 事实传播和派生 / 扫描 / 交接维护。 | 增加状态可见性、延迟解释、运行承载分工和失败恢复设计成本。 | 该机制决定关键交互如何承接,属于架构层通信结构。 |
| 只读派生视图 / diagnostic / report handoff / dashboard / alert / GRC export 消费机制 | 防止查询、诊断、report、dashboard、alert、GRC export 或 anomaly analysis 直接依赖核心结构或反写真相。 | 下游需要稳定消费、诊断、报告、告警和导出,但核心模型不能被展示、聚合或外部工具绑定。 | 增加派生滞后、重建、对账异常、旧视图和延迟解释成本。 | 该机制影响运行承载、数据所有权和通信方式。 |
| retention marker + active reference protection + archive handoff 分离机制 | 防止 cleanup、archive package、replay 或 recovery 误清仍被审计、诊断、报告、留存或合法保留引用的材料。 | Observability 拥有留存标记和活动引用保护,Archive 只消费 archive eligibility 和交接材料。 | 需要持续维护 hold / release / conflict / blocked / archive eligible 状态和引用对账。 | 该机制保护观察材料生命周期,同时不接管 archive package。 |
| no-write guard 与 no-write violation 可审计机制 | 防止查询、诊断、维护、导出、report handoff、rebuild 或 replay 越权写 source truth。 | Observability 的读侧、派生侧和维护侧都很容易被误用为修复或控制路径,必须有统一边界防线。 | 增加请求范围判断、拒绝 / 挂起口径、违例记录和审计通知成本。 | 该机制保护本仓只观察、不反写业务 truth。 |
| 幂等与顺序保护机制 | 防止重复材料、重复事件、乱序反馈、重放输入或重复 handoff 生成重复 observation truth、重复 report handoff 或状态回退。 | Observability 天然承接异步材料、多来源信号、派生重建和 replay,必须抵抗重复和乱序。 | 需要稳定身份依据、顺序依据、重复识别依据、冲突口径和对账能力。 | 该机制保护观察事实唯一性和交接消费一致性。 |
| traceability / audit projection / report handoff trail 机制 | 防止观察材料、审计投影、evidence linkage、report handoff、retention 和 no-write violation 不可解释。 | 本仓必须回答来源、关联、安全处置、证据线索、缺口、真实性提示、消费目的和交接结果。 | 增加追溯材料维护成本,且不能把外部正文顺带存入 Observability。 | 该机制支撑审计、复盘、验收审查和归档准备。 |
| 产品中立外部能力适配与产品硬选型延后 | 防止旧 Draft 的 OTel、Prometheus、Grafana、TimescaleDB、对象存储、APM、GRC、alert sink 或性能数字未经论证进入正式架构。 | 当前架构已能确定观察语义、承载角色和交互机制,但尚缺产品级输入、负载模型、运维约束和测试依据。 | 后续仍需在概要 / 详细 / 配置 / 测试 / 实施阶段补齐产品选择和指标验证。 | 该机制本质是架构治理手段,用于保护真相源闭环和产品中立性。 |

### 8.2 按架构单元组织的机制适用表

| 架构单元 | 必须采用的机制 | 明确不采用的机制 | 代价 / 约束 | 停审结果 |
|---|---|---|---|---|
| `Observability 核心语义角色` | redaction-first、correlation context、truth / derived / ref / forbidden body separation、核心强一致、body-free linkage、retention、no-write guard | 外部正文入仓、产品配置定义语义、派生结果反写核心、report 生成真实 evidence | 核心状态和边界判断更严格。 | pass |
| `Observability 编排 / 承接角色` | 正式承接边界、同步 / 异步 / 后台分离、幂等与顺序保护、traceability / handoff trail | 外部输入直接写核心、后台维护先执行再补审计、rebuild / replay 修复 source truth | 需要更多输入状态、失败口径和对账路径。 | pass |
| `外部能力接缝角色` | 运行期接缝、safe ref / summary / snapshot / signal / gap、产品中立适配 | 相邻仓源码依赖、source / runtime / evidence body 复制、外部 APM / GRC 作为 truth source | 需要解析、不可见、缺口和降级语义。 | pass |
| `派生消费辅助角色` | 只读派生、最终一致、stale / rebuilding / failed 解释、report / dashboard / alert / GRC export 消费边界 | 派生写核心、外围消费阻塞核心成立、report handoff 生成 signoff | 需要重建、延迟解释和消费侧状态管理。 | pass |
| `技术承载角色` | 正式承载契约、truth 与 derived 承载分离、产品硬选型后移 | 存储 / cache / search / dashboard / APM 产品定义观察语义 | 技术实现必须服从架构机制,不能反向改语义。 | pass |

### 8.3 当前不采用口径表

| 不采用口径 | 不采用原因 | 正确落点 |
|---|---|---|
| 具体数据库、时序库、搜索、缓存或对象存储产品作为当前关键选型 | 产品选择属于实现承载,当前只需锁定观察面真相承载、派生承载和一致性机制。 | 概要设计、详细设计、配置设计或实施计划 |
| OTel、Prometheus、Grafana、TimescaleDB、APM、GRC、alert sink 作为当前硬选型 | 外部产品不能定义 observation truth、redaction、correlation、handoff 或 retention 语义。 | Step 11 备选方案、配置设计、测试方案或实施计划 |
| `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等对象作为当前技术选型 | 这是概要 / 详细设计对象建模候选,不是架构机制。 | 概要设计 / 详细设计 |
| 具体 API / command / query / event / topic / payload / outbox / consumer group 作为当前选型 | 这是协议和实现细节,不是本章机制级结论。 | 概要设计、详细设计、测试方案或实施计划 |
| hash 算法、digest canonicalization、hash chain 分片或扫描频率作为当前硬选型 | 当前只需要 body-free linkage、完整性线索和可追溯约束,不锁算法。 | 技术选型后续细化、配置设计、测试方案或详细设计 |
| 完整事件溯源作为当前必选 | Observability 需要追溯、事件协作、handoff 和 rebuild,但不等于必须当前采用完整 ES 持久化模型。 | Step 11 备选方案与取舍 |
| report / dashboard / alert / GRC export 作为 observation truth 写源 | 会让派生和外部消费成为第二 truth。 | 只读派生、导出消费和后台维护 |
| archive package 或 recovery body 作为本仓留存机制 | 会让 Observability 接管 archive truth 和正文恢复。 | Archive handoff、retention marker 和 active reference protection |
| report handoff 生成真实 `run_id`、真实 evidence alias、final verdict 或 signoff | 会伪造真实测试和验收材料。 | 真实测试执行与验收阶段 |
| 旧 P95 / SLA / 冷存 / 事件数量作为本步硬选型 | 当前缺新版需求基线下的正式负载模型和验证依据。 | 测试方案、验收标准或容量验证 |
| 除 `L0-core` 之外的编译期仓依赖 | 会破坏 sibling truth owner 边界和全局依赖裁剪规则。 | 运行期边界、事件协作、SDK、adapter 或 handoff |

### 8.4 技术边界说明

本章采用的是机制级技术选型,不是产品清单或实现方案。`L4-observability` 当前最需要被显式固定的是 observation truth 如何避免被 raw body、相邻 truth owner、派生视图、报告材料、归档包、外部 APM / GRC 产品和旧技术假设污染,因此正式承接边界、redaction-first、correlation、数据分层、body-free linkage、核心强一致、外围最终一致、三类交互路径、只读派生、retention protection、no-write guard、幂等顺序、追溯交接和产品中立适配都进入架构主线。具体数据库、消息产品、时序库、对象存储、OTel、Prometheus、Grafana、TimescaleDB、APM、GRC、alert sink、hash 算法、outbox、协议、P95 和容量数值只有在不反向改变这些机制的前提下,才可以在后续概要 / 详细设计、配置设计、测试方案和实施计划中继续选择。若后续技术实现与本章机制冲突,应以本章机制为架构真相源。

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 11. 关键技术选型

> 校准来源:
> - `design-calibration/01_arch_step_10_technology_choices.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“关键技术机制表”“按架构单元组织的机制适用表”“当前不采用口径表”和“技术边界说明”小节,了解本章如何从架构目标、运行承载、依赖方向、数据所有权和关键交互推导机制级技术选型。

### 11.1 关键技术机制表

摘录 `design-calibration/01_arch_step_10_technology_choices.md` §8.1。

### 11.2 按架构单元组织的机制适用表

摘录 `design-calibration/01_arch_step_10_technology_choices.md` §8.2。

### 11.3 当前不采用口径表

摘录 `design-calibration/01_arch_step_10_technology_choices.md` §8.3。

### 11.4 技术边界说明

摘录 `design-calibration/01_arch_step_10_technology_choices.md` §8.4。
```

---

## 10. 待确认事项

本步不新增阻塞 Step 11 的待确认事项。下列事项进入后续 Step 或后续文档,不得在 Step 10 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|
| `Q-OBS-ARCH-010-001` | 具体数据库、时序库、搜索、缓存、对象存储、queue / broker 产品是否采用 | 后续 Step 11、概要 / 详细设计、配置设计和实施计划收敛。 |
| `Q-OBS-ARCH-010-002` | OTel、Prometheus、Grafana、TimescaleDB、APM、GRC、alert sink 是否进入产品组合 | 后续 Step 11、配置设计、测试方案和实施计划收敛。 |
| `Q-OBS-ARCH-010-003` | log / metric / trace / audit / evidence / handoff / retention 的正式对象、schema、字段和状态机 | 后续概要 / 详细设计收敛。 |
| `Q-OBS-ARCH-010-004` | hash、digest、canonicalization、integrity hint、hash linkage 和 gap scan 的算法与测试口径 | 后续详细设计、配置设计和测试方案收敛。 |
| `Q-OBS-ARCH-010-005` | outbox、consumer、publisher、event payload、topic、replay、projection rebuild 和后台调度机制 | 后续概要 / 详细设计、测试方案和实施计划收敛。 |
| `Q-OBS-ARCH-010-006` | P95 / P99 / SLA、冷存天数、事件数量、容量、retention window 和 archive handoff 指标 | 后续测试方案、验收标准和实施计划基于真实负载模型收敛。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确哪些技术机制已经上升为架构层决定 | pass | §8.1 已列出正式承接、redaction-first、correlation、数据分层、audit projection、body-free linkage、一致性、三类路径、只读派生、retention、no-write、幂等顺序、追溯交接和产品中立适配。 |
| 是否说明每项机制解决的架构层问题 | pass | §8.1 每行均说明要解决的边界、truth、正文、反写、交接或追溯问题。 |
| 是否说明每项机制为什么当前值得采用 | pass | §8.1 每行均给出采用理由。 |
| 是否明确每项机制所引入的代价 / 约束 | pass | §8.1 和 §4.4 已给出状态、边界、追溯、测试、对账和运维解释成本。 |
| 是否说明为什么这些机制不是局部实现细节 | pass | §8.1 / §8.4 已说明这些机制影响边界保护、一致性和关键交互主链。 |
| 是否明确当前不采用口径 | pass | §8.3 已列出产品、schema、协议、算法、完整事件溯源、report 伪证、archive package、旧指标和编译期依赖不采用口径。 |
| 是否避免技术栈清单、产品横向对比、实现机制或部署环境细节 | pass | 本步只写机制级选型,未写产品选型、协议、表结构、接口、部署参数或代码对象。 |
| 是否保持 report handoff 与 evidence authenticity 的真实性边界 | pass | 未生成真实 run、真实 evidence alias、final verdict、signoff 或测试结果。 |
| gate_status | pass | 当前 Step 10 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_11 | 必须等待用户确认后才允许进入 Step 11 `备选方案与取舍`。 |

当前 Step 10 `关键技术选型` 已完成。下一步必须等待用户确认后进入 Step 11 `备选方案与取舍`,并只创建 / 改写 `design-calibration/01_arch_step_11_alternatives_tradeoffs.md`。
