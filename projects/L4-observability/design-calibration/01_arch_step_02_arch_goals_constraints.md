# L4-observability 01-架构设计 Step 02 · 明确架构目标与约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 2
> 回填章节: `01-架构设计.md` §2 业务背景与驱动力、§3 约束条件
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 03

---

## 1. 本步目标

把 Step 01 已收稳的需求边界、核心能力闭环、数据归属和依赖前提转译成架构必须确保成立的结构目标、不可变约束、当前阶段可接受取舍和架构非目标。本步不写容器、部署、依赖方向图、技术选型、协议、状态机、Rust schema、数据库、外部产品或实现方案。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | 当前台账显示 Step 01 已完成,用户已确认进入 Step 02 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01 pass,Step 02 blocked by user confirmation | 确认本轮只允许推进 Step 02。 |
| `design-calibration/01_arch_step_01_requirements_baseline.md` | Step 01 已完成 | 作为架构目标与约束的直接输入。 |
| `projects/L4-observability/00-需求文档.md` §2 / §4 / §6 / §7 / §10 / §11 / §13 / §14 / §15 | 正式需求基线已完成 | 提取仓定位、目标 / 非目标、依赖、核心闭环、规则、数据归属、NFR、验收和风险。 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | 已完成 | 验证目标与功能 / 规则 / 数据 / 验收的对应关系。 |
| 旧 `projects/L4-observability/README.md` | historical material | 仅作为旧产品栈、旧指标、旧目录和旧开放问题诊断来源。 |
| 旧 `projects/L4-observability/01-架构设计.md` | historical material | 仅作为旧目标、旧技术假设、旧约束和旧正式正文诊断来源。 |
| 旧 `design-calibration/01_arch_step_02_arch_goals_constraints.md` | historical material | 只作为薄产物诊断来源,不继承其中提前写入的 schema 名称。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 2 | 已读取 | 约束 Step 02 问题、产出和进入下一步条件。 |
| `standards/document/架构设计书写规范.md` §4.2 / §4.3 | 已读取 | 控制背景、驱动力、目标、约束、取舍和非目标的写法。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 01、架构 SOP Step 2 和书写规范 4.2 / 4.3 | done | 本文件 §2 |
| 回答 Step 2 的目标、约束、取舍、非目标问题 | done | 本文件 §4 |
| 诊断旧 README、旧正式 01 和旧 Step 02 中不可继承的目标 / 约束 | done | 本文件 §5 |
| 选择从新版需求基线重推目标与约束 | done | 本文件 §7 |
| 输出业务背景、驱动力、架构目标、不可变约束、取舍和非目标 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 02 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 这个仓在架构层面要确保什么成立?

`L4-observability` 架构必须确保“横切观察面真相”独立成立,并让 source services、bus、governance、artifact、identity、runtime / sandbox、archive、console、SDK 和报告 / 验收消费方围绕同一 observation / audit projection / handoff / marker truth 协作,而不是各自保存 raw body、私补 trace / label、复制 evidence body、伪造报告证据或把诊断结果反写到 source truth。

架构层必须守住以下结构性结果:

1. 观测材料必须先进入安全准入语境,能表达来源、关联、安全状态、accepted / rejected / quarantined / degraded 结果,但不等同 source truth 写入。
2. Redaction 与 correlation 必须成为所有 log、metric、trace、audit projection、query、diagnostic 和 report handoff 的结构前提,避免 raw body、secret、full sensitive ref 或 opaque id 污染观察面。
3. Audit projection 与 body-free evidence linkage 必须能作为本仓观察面事实成立,但不保存 evidence / artifact / identity / governance / runtime 正文,也不替代 source audit truth。
4. Safe log、metric 和 trace 必须能支持运行观察和诊断,但不得被解释为 runtime / sandbox execution truth、业务成功结论或治理裁决。
5. Query、diagnostic、report handoff 和 evidence index input 必须保持只读,只能输出安全摘要、缺口、真实性提示和交接材料,不得生成 final verdict、真实 evidence alias、验收签署或 source write。
6. Retention marker、active reference protection、rebuild / replay 和 no-write violation 必须能约束观察面生命周期和派生投影,但不得删除仍被引用材料或修复 / 覆盖 source truth。
7. 跨仓协作必须通过 `L0-core` 共享契约、`L0-bus` 事件协作、运行期 resolver / adapter、safe ref、summary、snapshot 或 handoff 表达,不得把相邻 truth repo 写成编译期依赖。
8. 外部 APM、OTel、Prometheus、Grafana、TimescaleDB、对象存储、GRC、alert sink 或 anomaly analysis 只能作为后续 adapter / 配置 / 外围增强候选,不得成为 observation truth source。

### 4.2 哪些约束是不可变的?

不可变约束来自需求规则、数据归属、依赖裁剪、真实性边界和验收否决项:

| 约束来源 | 不可变约束 |
|---|---|
| source truth 边界 | 本仓不拥有、修改、修复、覆盖或删除任何业务 truth、Governance truth、Artifact truth、Identity truth、runtime / sandbox execution truth 或 archive truth。 |
| forbidden body 边界 | raw body、secret、credential、payload body、full sensitive ref、raw prompt、provider response body、runtime body、evidence body、artifact body、identity body、governance decision body 和 archive package body 不得进入本仓保存路径。 |
| observation material 边界 | 不可解释来源、不可安全表达或无法审计的材料不得成为正式 observation material。 |
| redaction / correlation 边界 | 未经过安全判断和关联语境收束的材料不得进入只读查询、诊断、报告交接或审计投影输出。 |
| audit projection 边界 | Audit projection 不得替代 Governance decision、Artifact lineage、Identity truth、runtime execution truth 或 source audit truth。 |
| evidence linkage 边界 | Evidence linkage 必须 body-free,不得保存 evidence body 或把 report handoff 写成真实验收 evidence。 |
| signal projection 边界 | Safe log / metric / trace、dashboard、alert、summary 或 diagnostic hint 不得反向定义 source truth 或执行 truth。 |
| report handoff 边界 | Report handoff 不得生成 final verdict、验收签署、真实 `run_id`、真实 evidence alias 或 passed evidence。 |
| retention / replay 边界 | Retention / replay 不得删除仍被审计、诊断、报告、留存、重放或合法保留语境引用的材料,也不得修复 source truth。 |
| `L0-bus` 边界 | 本仓不拥有 bus publish / subscribe / ack / retry / dead-letter / replay 主干规则。 |
| 依赖边界 | `L0-core` 是唯一编译期上游;非 core sibling 仓不得成为 package dependency。 |
| 外部产品边界 | 外部观测产品、dashboard、alert、APM、GRC、TimescaleDB、Grafana、Prometheus、OTel Collector 或对象存储不得成为 truth source。 |

### 4.3 哪些约束是当前阶段可以接受的取舍?

当前可接受取舍只覆盖 `L4-observability` 潜在能力范围内的架构收缩,不把边界外事项伪装为取舍:

| 取舍对象 | 当前处理 |
|---|---|
| 高级 dashboard 和可视化编排 | 当前作为外围消费增强处理,不作为安全观察面、审计投影或 report handoff 成立前置。 |
| 告警规则、通知渠道和订阅体验 | 当前作为 alert / notification 增强处理,alert 不等于 source truth、execution truth 或治理裁决。 |
| DORA / EBM / ISO 管理报表 | 当前作为管理分析增强处理,只能派生自安全摘要和交接材料,不生成最终结论。 |
| 外部 APM / OTel / Prometheus / Grafana / TimescaleDB / 对象存储 | 当前作为产品中立 adapter / 配置候选,不在 Step 02 固定技术栈。 |
| 外部审计 / GRC 导出 | 当前作为外部消费增强处理,只能导出安全摘要、引用和缺口说明,不生成治理 truth。 |
| 异常检测、根因建议和长期分析 | 当前作为智能诊断增强处理,不得替代只读诊断、审计投影或 source truth。 |
| 旧 P95 / P99 / SLA、冷存年限、hash chain 分片和事件数量 | 当前作为候选 SLO / 容量 / 测试输入,不写成已验证硬指标。 |
| log / metric / trace / audit event schema 细节 | 当前只保留必须后续闭口的方向,不在 Step 02 固定字段、枚举或 Rust-facing carrier。 |
| digest、hash linkage、canonicalization 和 chain gap 算法 | 当前只保留可追溯和 body-free 约束,后续技术选型、详细设计和测试闭口。 |
| retention days、legal hold 和 archive eligibility 细则 | 当前只保留 retention marker 与活动引用保护,后续配置、验收和实施计划闭口。 |

### 4.4 哪些目标可以明确判断,甚至量化?

当前可以明确判断的目标是结构目标,不是实现指标:

| 目标类型 | 当前判断 |
|---|---|
| Observation truth 独立性 | 必须成立。本仓只能拥有 observation / audit projection / handoff / marker truth,不能接管 source truth。 |
| 核心闭环 | 必须成立。`C-OBS-1~C-OBS-5` 是当前架构主线。 |
| Redaction / forbidden body 边界 | 必须成立。任何输出面都不得泄漏 raw body、secret、payload body、evidence body 或 runtime body。 |
| Correlation 可解释性 | 必须成立。跨仓观察需要来源、关联、safe ref、缺口和降级语境,不能从 opaque id 或产品 label 反推出业务 truth。 |
| Body-free evidence linkage | 必须成立。证据关联必须能被审计和报告消费,但 evidence / artifact body 不入仓。 |
| Read-only handoff | 必须成立。查询、诊断、报告和 evidence index input 不生成 final verdict、signoff 或真实测试 evidence。 |
| Retention / no-write guard | 必须成立。留存、重建、重放和缺口扫描只作用于观察面和派生投影。 |
| 依赖裁剪 | 必须成立。除 `L0-core` 外不形成编译期依赖。 |
| 旧性能 / 容量数字 | 当前不能量化为硬目标。旧 P95 / P99 / SLA、冷存年限、hash chain 分片和事件数量只作为后续测试和容量评估候选。 |

### 4.5 哪些事情虽然相关,但不是本仓架构当前要解决的问题?

| 相关事项 | 当前架构判断 |
|---|---|
| `L0-bus` publish / subscribe / ack / retry / dead-letter / replay 主干 | 由 `L0-bus` 拥有,本仓只通过正式事件协作边界消费 tap / audit material。 |
| Governance decision、Policy、Gate、AIIA、SoA、Control、Nonconformity | 由 `L1-governance` 拥有,本仓只承载观察投影、缺口、引用和报告交接语境。 |
| Artifact fact、version、lineage、baseline、evidence body、artifact body | 由 `L1-artifact` 或对应 evidence owner 拥有,本仓只做 body-free evidence linkage。 |
| Identity member、actor、role、subject lifecycle、认证授权 | 由 `L1-identity` / 安全入口拥有,本仓只消费 actor / subject safe ref 和安全摘要。 |
| runtime / sandbox execution truth、kill / retry / recovery / control command | 由 runtime / sandbox 边界拥有,本仓只承载安全观察面和只读诊断。 |
| archive package、长期正文保存、恢复编排和 recovery body | 由 archive 相关仓拥有,本仓只输出 retention marker、archive eligibility 线索和交接语境。 |
| console / workspace UI、dashboard layout、Grafana dashboard ownership | 由产品 / 展示层拥有,本仓只提供只读观察面和安全摘要。 |
| 外部 APM、GRC、alert sink、storage product 的系统架构 | 属于外部系统或后续配置 / 适配边界,不是 Step 02 架构目标。 |
| API / DTO / 状态机 / 数据库表 / 索引 / port / repository / adapter | 属于概要、详细、配置、测试或实施阶段,不在架构目标层定义。 |
| 真实测试 run、真实 evidence alias、验收签署和最终 verdict | 属于真实测试执行与验收阶段,设计文档不得伪造。 |

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01_arch_step_02_arch_goals_constraints.md` | 约 81 行,直接把 Step 02 写成 schema 主语表,列 `NormalizedLogRecord`、`MetricPoint`、`AuditEventProjection` 等名称。 | Step 02 应讨论架构目标、约束、取舍和非目标,不应提前固定 schema 命名或字段方向。 | 本轮删除旧薄产物,按 SOP 和 L1 参考粒度重写。 |
| 旧 `README.md` | 把 OTel Collector、TimescaleDB、对象存储、Prometheus、Grafana、DORA / EBM / ISO dashboard、P95 和冷存策略写成仓使命或性能。 | 混合产品栈、指标、目录和开放问题,不等同当前架构目标。 | 降级为 historical material;只保留“横切观测 / 审计 / 指标 / trace / evidence”方向线索。 |
| 旧正式 `01-架构设计.md` §2 / §3 | 已写入架构目标、约束和技术方向。 | 未经过本轮 Step 01~02 确认,且存在旧技术 / 指标 / 产品绑定残留。 | Step 16 前不得作为正式架构基线。 |
| 旧技术栈和外部产品 | OTel / Prometheus / Grafana / TimescaleDB / 对象存储被写得像核心前置。 | 外部产品和存储不应成为 observation truth source。 | 当前作为后续技术选型和配置候选。 |
| 旧性能和容量口径 | 审计写入 P95、hash chain 验证、血缘查询 P95、Prometheus scrape 间隔等被写成性能。 | 缺少当前需求证据、负载模型和验收来源。 | 当前作为候选 SLO / 测试输入,不得硬化。 |
| 旧 implementation ledger / boundaries | 上一轮粗糙实现移交资产仍存在。 | 未经新版 `07-实施计划.md` 重建,不能作为实现门禁。 | 继续保持 historical material。 |

---

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 架构目标表达 | 偏 schema、功能和技术产品。 | 改为 observation truth、核心闭环、redaction / correlation、audit projection、read-only handoff、retention / no-write 和依赖裁剪的结构性结果。 | 对齐架构规范 4.2。 |
| 不可变约束 | 旧文档混入产品栈、指标和实现假设。 | 覆盖 source truth、forbidden body、redaction、audit projection、evidence linkage、signal projection、report handoff、retention、bus、依赖和外部产品边界。 | 对齐 Step 01 和正式 00。 |
| 当前取舍 | 外围增强与核心闭环混杂。 | 明确 dashboard、alert、管理报表、外部 APM / GRC、异常检测、旧指标和 schema 细节作为阶段性取舍或候选。 | 防止范围膨胀和伪前置。 |
| 架构非目标 | 分散在 README / 正式文档 / Step 文件中。 | 形成独立非目标表,按 truth owner 和文档分层归因。 | 便于 Step 03 职责边界和 Step 04 上下文继续审查。 |
| 指标处理 | 旧 P95 / SLA / 冷存等直接硬化。 | 降为候选测试或容量输入。 | 避免无来源指标污染正式架构。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 README / 旧正式 01 / 旧 Step 02 的目标、schema 和技术栈 | 复用快。 | 旧产品栈、旧指标、旧 schema 名称和旧全 Step pass 状态会继续污染当前链路。 | 不采用。 |
| 方案 B: 从新版 Step 01 和正式 00 重新推导架构目标与约束 | 可追溯,边界完整,符合逐 Step 停审。 | 后续仍需逐 Step 重建。 | 采用。 |
| 方案 C: Step 02 直接固定 log / metric / trace / audit event schema、hash 算法、存储后端和外部产品 | 推进看似更快。 | 越过职责边界、上下文、数据所有权、技术选型、配置和详细设计。 | 不采用。 |
| 方案 D: 把 dashboard、alert、DORA / EBM、外部 GRC、异常检测全部列为非目标 | 范围最小。 | 会丢失 observability 作为横切消费基础的演进线索。 | 不采用,改列为当前阶段可接受取舍。 |

### 7.1 待确认问题的方案选择

#### 外部观测产品是否进入架构目标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前架构目标固定 OTel Collector、Prometheus、Grafana、TimescaleDB 或对象存储。 | 会让外部产品成为事实上的 truth source,并污染配置 / 实施边界。 |
| 方案 B | 当前只要求产品中立的 observation / projection / handoff / marker truth 成立。 | 保留 adapter 和配置空间,对齐 Step 02 分层。 |

推荐方案 B。

#### hash linkage / digest / canonicalization 是否进入架构目标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前固定 hash chain、分片策略和校验阈值。 | 会把旧 README 的技术想象提前硬化。 |
| 方案 B | 当前只要求 audit projection 和 evidence linkage 可追溯、body-free、缺口显式。 | 保留算法和测试口径给后续技术选型、详细设计和测试。 |

推荐方案 B。

#### 旧性能 / 冷存 / 事件数量是否进入架构目标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 直接作为硬架构目标。 | 与需求 §13 / §15 冲突,缺少正式负载模型和验证来源。 |
| 方案 B | 作为候选 SLO、容量和测试输入。 | 保留旧线索,不伪量化。 |

推荐方案 B。

---

## 8. 结构化中间产物

### 8.1 业务背景结论

Quantalithos 的治理裁决、制品证据、身份引用、运行执行、sandbox 结果、归档准备、报告审查和验收复核都需要被观察、关联、脱敏、审计和交接。`L4-observability` 值得单独做架构设计,是因为这些横切观察材料如果散落在 source repo、本地日志、dashboard、外部 APM、报告生成器或验收文档中,平台会形成多套互相冲突的观察语义,并容易把观察面误写成业务 truth、执行 truth、证据正文或最终验收结论。

### 8.2 驱动力结论

| 驱动力 | 说明 |
|---|---|
| 横切观察面需要独立承载 | Source owner 各自保存日志、trace 或指标会导致 redaction、correlation 和 evidence linkage 口径分裂。 |
| Redaction 与 correlation 需要成为结构前提 | 否则 raw body、secret、full sensitive ref、opaque id 或产品 label 会污染查询、诊断和报告。 |
| Audit projection 与 evidence linkage 需要 body-free 成立 | 否则本仓会吸收 Governance、Artifact、Identity、runtime 或 source audit 正文。 |
| 运行观察面需要与 execution truth 分离 | 否则 trace、metric、log、alert 或 diagnostic hint 会被误用为业务成功、执行结果或治理裁决。 |
| Report handoff 与真实性提示需要独立边界 | 否则设计文档和报告材料容易静态伪造真实 `run_id`、evidence alias、final verdict 或 signoff。 |
| Retention、rebuild 和 no-write guard 需要持续约束 | 否则清理、重放、缺口扫描或维护任务会误删活动引用材料或反写 source truth。 |
| 跨仓协作必须裁剪依赖 | 除 `L0-core` 外不得把相邻 truth owner 或外部产品变成编译期 truth 上游。 |

### 8.3 架构目标表

| 架构目标 | 说明 |
|---|---|
| 承载独立的横切观察面真相 | 否则观察材料会散落在 source repo、本地日志、dashboard、外部 APM 或报告工具中。 |
| 支撑安全观测材料入口作为统一结构前提成立 | 否则审计投影、运行观察、诊断和交接都会缺少可信来源与准入状态。 |
| 支撑 redaction 与 correlation 贯穿所有观察输出 | 否则 raw body、secret、full sensitive ref、opaque id 或临时 label 会污染观察面。 |
| 支撑 audit projection 与 body-free evidence linkage 成立 | 否则审计材料会变成 source truth 副本、证据正文副本或不可追溯流水。 |
| 支撑 safe log、metric 和 trace 作为运行观察面成立 | 否则运行诊断会依赖 raw log、私有 label 或把 trace 结果冒充 execution truth。 |
| 支撑只读 query、diagnostic 和 report handoff 成立 | 否则观察查询和报告交接会变成隐藏写入、控制命令、业务修复或验收裁决。 |
| 支撑真实性提示和 evidence index input 不伪造证据 | 否则设计期材料会被误用为真实 run、真实 evidence、final verdict 或 signoff。 |
| 支撑 retention marker、active reference protection 和 rebuild / replay 边界成立 | 否则材料可能被越权清理、错误重建或反写 source truth。 |
| 允许 source owner、bus、archive、console、SDK 和报告消费方通过正式边界协作 | 否则本仓要么吸收相邻仓 truth,要么无法被相邻仓稳定消费。 |
| 守住外部产品和配置不成为 truth source | 否则 APM、Grafana、Prometheus、TimescaleDB 或对象存储会反向定义平台观察语义。 |

### 8.4 不可变约束表

| 约束 | 说明 |
|---|---|
| 不拥有、修改、修复、覆盖或删除任何 source business truth | 否则 observability 会从观察面膨胀为业务控制面。 |
| 不拥有 Governance decision、Policy、Gate、AIIA、SoA、Control 或 Nonconformity truth | 否则审计投影会替代治理正式结论。 |
| 不拥有 Artifact fact、version、lineage、baseline、evidence body 或 artifact body | 否则 body-free evidence linkage 会变成制品 / 证据正文副本。 |
| 不拥有 Identity member、actor、role、subject lifecycle、认证或授权 truth | 否则 actor / subject safe ref 会打穿身份 truth 边界。 |
| 不拥有 runtime / sandbox execution truth 或执行控制命令 | 否则 trace、metric、log 或 diagnostic hint 会冒充执行裁决。 |
| 不拥有 archive package、recovery body、console UI truth 或外部产品配置 truth | 否则 retention marker、handoff 或 dashboard 会越过本仓边界。 |
| 不保存 raw body、secret、credential、payload body、full sensitive ref、raw prompt、provider response body、runtime body 或外部完整正文 | 否则 redaction-first 和 forbidden body 边界失效。 |
| 不保存 evidence body、artifact body、identity body、governance decision body 或 source audit truth 正文 | 否则审计投影和 evidence linkage 不再 body-free。 |
| 不允许 query、diagnostic、maintenance、rebuild、report assembly 或 external export 写入 source truth | 否则派生和维护路径会成为隐式写源。 |
| 不允许 report handoff 生成 final verdict、验收签署、真实 `run_id`、真实 evidence alias 或 passed evidence | 否则只读交接会冒充真实验收。 |
| 不允许 retention / replay 删除仍被合法引用的观察材料或修复 source truth | 否则长期追溯和 no-write guard 会被打穿。 |
| 不允许除 `L0-core` 外形成编译期依赖 | 否则 L4 observability 会与平权 truth owner 形成循环耦合。 |
| 不允许外部 APM、OTel Collector、Prometheus、Grafana、TimescaleDB、对象存储、GRC 或 alert sink 成为 truth source | 否则产品配置会反向定义平台观察语义。 |

### 8.5 当前阶段可接受取舍表

| 取舍 | 当前口径 |
|---|---|
| 高级 dashboard 和可视化编排 | 当前作为外围消费增强处理,只消费安全观察面和摘要,不纳入核心闭环前置。 |
| 告警规则、通知渠道和订阅体验 | 当前作为 alert / notification 增强处理,alert 不等于 source truth 或 execution truth。 |
| DORA / EBM / ISO 管理报表 | 当前作为管理分析增强处理,不生成最终业务结论、治理结论或验收结论。 |
| 外部 APM / OTel / Prometheus / Grafana / TimescaleDB / 对象存储 | 当前作为产品中立 adapter / 配置候选,不在 Step 02 固化。 |
| 外部审计 / GRC 导出 | 当前作为外部消费增强处理,不作为 Governance truth 或 evidence body 来源。 |
| 异常检测、根因建议和长期分析 | 当前作为智能诊断增强处理,不得替代只读诊断或 source truth。 |
| log / metric / trace / audit event schema 字段与状态枚举 | 当前只保留后续闭口要求,不在 Step 02 定义字段、枚举或 Rust-facing carrier。 |
| digest、hash linkage、canonicalization 和 chain gap 算法 | 当前只保留可追溯和 body-free 约束,后续技术选型、详细设计和测试闭口。 |
| retention days、legal hold 和 archive eligibility 细则 | 当前只保留 marker、活动引用保护和冲突显式,后续配置、验收和实施计划闭口。 |
| 旧 P95 / P99 / SLA、冷存年限、hash chain 分片和事件数量 | 当前作为候选 SLO / 容量 / 测试输入,不写成已验证硬指标。 |

### 8.6 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计事件总线主干架构 | publish / subscribe / ack / retry / dead-letter / replay truth 属于 `L0-bus`。 |
| 不设计 Governance 决策与控制架构 | Gate、Policy、Decision、AIIA、SoA、Control 和 Nonconformity truth 属于 `L1-governance`。 |
| 不设计 Artifact / Evidence 正文与血缘架构 | Artifact fact、version、lineage、baseline、evidence body 和 artifact body 属于 `L1-artifact` 或对应 evidence owner。 |
| 不设计 Identity 生命周期、认证和授权架构 | member、actor、role、subject lifecycle、认证和授权 truth 属于 `L1-identity` / 安全边界。 |
| 不设计 Runtime / Sandbox 执行与控制架构 | execution truth、tool execution、kill / retry / recovery 和 sandbox 隔离控制属于运行 / sandbox 边界。 |
| 不设计 Archive package 与恢复架构 | archive package、长期正文保存、恢复编排和 recovery body 属于 archive 相关仓。 |
| 不设计 Console / Workspace UI 架构 | dashboard layout、workspace view、console state 和 UI ownership 属于产品 / 展示层。 |
| 不设计外部 APM / GRC / storage 产品系统架构 | 外部系统是 adapter / 配置 / 消费候选,不是本仓架构主线。 |
| 不在架构目标层定义 API / DTO / 状态机 / 数据库表 / 索引 / port / repository / adapter | 这些属于概要、详细、配置、测试或实施阶段。 |
| 不生成真实测试 evidence、真实 `run_id`、真实 evidence alias、验收签署或 final verdict | 这些只能来自真实测试执行与验收阶段,设计文档不得伪造。 |

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论。

```md
## 2. 业务背景与驱动力

> 校准来源:
> - `design-calibration/01_arch_step_02_arch_goals_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“设计取舍”小节,了解本章如何把需求闭环转译为架构目标。

正式章节应摘录:

- `design-calibration/01_arch_step_02_arch_goals_constraints.md` §8.1 业务背景结论。
- `design-calibration/01_arch_step_02_arch_goals_constraints.md` §8.2 驱动力结论。
- `design-calibration/01_arch_step_02_arch_goals_constraints.md` §8.3 架构目标表。
```

```md
## 3. 约束条件

> 校准来源:
> - `design-calibration/01_arch_step_01_requirements_baseline.md`
> - `design-calibration/01_arch_step_02_arch_goals_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“架构硬约束结论”“不可变约束表”“当前阶段可接受取舍表”和“架构非目标表”小节,了解本章约束如何从需求边界和架构目标收敛而来。

正式章节应摘录:

- `design-calibration/01_arch_step_02_arch_goals_constraints.md` §8.4 不可变约束表。
- `design-calibration/01_arch_step_02_arch_goals_constraints.md` §8.5 当前阶段可接受取舍表。
- `design-calibration/01_arch_step_02_arch_goals_constraints.md` §8.6 架构非目标表。
```

---

## 10. 待确认事项

本步不新增阻塞性待确认事项。已知待确认项沿用 Step 01 的风险清单,后续分别在职责边界、系统上下文、数据所有权、技术选型、演进路线和风险章节承接。

| 编号 | 待确认事项 | 当前处理 |
|---|---|---|
| `Q-OBS-ARCH-002-001` | 旧 P95 / P99 / SLA、冷存年限、hash chain 分片和事件数量是否升级为正式测试目标 | 当前作为候选 SLO / 容量 / 测试输入,后续测试方案和容量验证阶段决定。 |
| `Q-OBS-ARCH-002-002` | log / metric / trace / audit event schema、字段、状态枚举和安全标签如何承载 | 当前不在 Step 02 定稿,后续概要 / 详细设计闭口。 |
| `Q-OBS-ARCH-002-003` | redaction、safety marker、accepted / rejected / quarantined 策略如何定义 | 当前只保留 redaction-first 和 forbidden body 边界,后续配置、测试和验收闭口。 |
| `Q-OBS-ARCH-002-004` | correlation carrier、source ref、actor / subject ref 和 evidence ref 格式如何统一 | 当前只保留 `L0-core` shared contract 语境,后续架构、概要和详细设计闭口。 |
| `Q-OBS-ARCH-002-005` | digest、hash linkage、canonicalization、chain gap 和 report handoff 格式如何定义 | 当前只保留可追溯、body-free、缺口显式和只读交接口径,后续技术选型、详细设计和测试闭口。 |
| `Q-OBS-ARCH-002-006` | 外部 APM / storage / dashboard / GRC / alert / anomaly 产品选型是否进入正式基线 | 当前作为产品中立 adapter / 配置候选,后续技术选型和配置设计决定。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确架构必须确保什么成立 | pass | §8.3 已输出结构性架构目标。 |
| 是否明确不可变约束 | pass | §8.4 覆盖 source truth、forbidden body、audit projection、evidence linkage、signal projection、report handoff、retention、bus、dependency 和外部产品边界。 |
| 是否明确当前阶段可接受取舍 | pass | §8.5 将外围增强、旧指标、schema 细节、算法、retention 细则和外部产品降为取舍 / 候选输入。 |
| 是否明确架构非目标 | pass | §8.6 按 truth owner 和文档分层归因。 |
| 是否提前写容器、数据库、协议、Rust schema、状态机、字段或技术栈 | pass | 本步只做目标与约束转译。 |
| 是否把旧 README 或旧正式 01 直接写成新版结论 | pass | 旧材料只作为历史诊断来源。 |
| 是否将 observability 写成 source truth | pass | 全文坚持 observation / projection / handoff / marker truth 与 source truth 分离。 |
| 是否伪造实现 commit、run_id、evidence alias、验收签署或测试结果 | pass | 未写入任何真实实现或验收证据。 |
| gate_status | pass | 当前 Step 02 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_03 | 必须等待用户确认后才允许进入 Step 03 `职责边界`。 |

当前 Step 02 `明确架构目标与约束` 已完成。下一步必须等待用户确认后进入 Step 03 `职责边界`,并只创建 / 改写 `design-calibration/01_arch_step_03_responsibility_boundary.md`。
