# L4-observability 01-架构设计 Step 03 · 职责边界

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 3
> 回填章节: `01-架构设计.md` §4 职责边界
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 04

---

## 1. 本步目标

明确 `L4-observability` 在全局职责分工中的承担范围,收稳“做什么 / 不做什么 / 易混淆职责 / 边界红线”。本步只回答职责归属,不画系统上下文图,不展开限界上下文、容器部署、数据所有权矩阵、接口协议、schema 字段、存储产品、外部 APM 选型或实现层依赖。

本步的核心判断是: `L4-observability` 是横切观测材料、审计投影、body-free evidence linkage、只读诊断 / 报告交接、retention marker 和 no-write violation 的观察面真相仓;它不拥有业务 truth、治理 truth、Artifact / evidence 正文、Identity truth、runtime / sandbox execution truth、archive package truth、console UI truth 或外部产品配置 truth。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | 当前台账显示 Step 02 已完成,用户已确认进入 Step 03 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~02 pass,Step 03 blocked by user confirmation | 确认本轮只允许推进 Step 03。 |
| `design-calibration/01_arch_step_01_requirements_baseline.md` | Step 01 已完成 | 承接需求基线、硬约束、数据归属和历史材料降级结论。 |
| `design-calibration/01_arch_step_02_arch_goals_constraints.md` | Step 02 已完成 | 承接架构目标、不可变约束、阶段性取舍和架构非目标。 |
| `projects/L4-observability/00-需求文档.md` §2 / §6 / §7 / §10 / §11 / §14 / §15 | 正式需求基线已完成 | 校验职责边界、依赖、核心闭环、禁止行为、数据归属、验收和风险。 |
| 旧 `projects/L4-observability/README.md` | historical material | 仅作为旧使命、旧产品栈、旧指标、旧目录和旧开放问题诊断来源。 |
| 旧 `projects/L4-observability/01-架构设计.md` | historical material | 仅作为旧职责、旧 schema、旧技术假设和旧正式正文诊断来源。 |
| 旧 `design-calibration/01_arch_step_03_responsibility_boundary.md` | historical material,已被本文件替换 | 仅作为薄产物诊断来源,不继承其中提前写入的 schema 名称。 |
| `projects/L1-governance/design-calibration/01_arch_step_03_responsibility_boundary.md` | 已读取 | 作为职责边界粒度、问题回答和红线表达参照。 |
| `projects/L1-artifact/design-calibration/01_arch_step_03_responsibility_boundary.md` | 已读取 | 作为 truth owner / body 边界 / 下游消费职责表达参照。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 3 | 已读取 | 约束本步问题、产出和进入下一步条件。 |
| `standards/document/架构设计书写规范.md` §4.4 | 已读取 | 控制职责边界表、做 / 不做清单和边界红线写法。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 01~02、架构 SOP Step 3 和书写规范 4.4 | done | 本文件 §2 |
| 回答做什么、不做什么、易混淆职责、禁止隐式行为和串线边界问题 | done | 本文件 §4 |
| 诊断旧 README、旧正式 01 和旧 Step 03 中不可继承的职责 / schema / 产品口径 | done | 本文件 §5 |
| 选择按观察面 truth 与相邻 truth owner 拆分职责,不提前写上下文图或 schema | done | 本文件 §7 |
| 输出职责边界表、做 / 不做清单和边界红线清单 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 03 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 这个仓具体做什么?

`L4-observability` 正式承担的职责是维护平台横切观察面真相,并让 source owner、bus、governance、artifact、identity、runtime / sandbox、archive、console、SDK、报告和验收消费方围绕同一份安全观察语义协作。职责不按“日志库 / dashboard / APM / 指标平台 / 报表工具”划分,而按观察面 truth 和边界划分:

| 职责 | 判断 |
|---|---|
| 安全观测材料准入事实承载 | 做。进入本仓观察语境的材料必须有来源、关联、安全状态和 accepted / rejected / quarantined / degraded 语境。 |
| 观测材料安全处置语境承载 | 做。redaction、safety marker、隔离原因、拒绝原因和可审计处置语境属于本仓观察面事实。 |
| 来源与关联语境承载 | 做。trace、span、causation、source ref、actor / subject safe ref 和业务安全引用需要统一承载,但不解析成 source truth。 |
| 审计投影事实承载 | 做。来自 source owner 或 bus 的审计材料可以形成只读审计投影,但不替代 source audit truth。 |
| body-free 证据关联事实承载 | 做。证据链接、digest / hash linkage 候选、缺口、不可见和消费目的属于本仓观察面事实,但 evidence body 不入仓。 |
| 安全日志 / 指标 / 追踪观察面承载 | 做。safe log、metric、trace 是运行观察面事实,用于诊断和报告交接,不等于 execution truth。 |
| 观察输出缺口 / 降级 / 不可见表达 | 做。缺失、不可见、被降级或不可安全输出必须显式表达,不能让消费方用空结果补事实。 |
| 只读查询与诊断摘要派生维护 | 做。查询和诊断可以聚合安全观察线索、摘要和缺口,但不得写源或下发控制命令。 |
| 报告交接与 evidence index input 承载 | 做。report handoff 只交接观察材料线索、脱敏状态、缺口说明、可审计引用和真实性提示。 |
| 证据真实性提示承载 | 做。本仓可以标记真实执行证据、待补齐材料和设计期占位的可见性边界,但不得伪造真实证据。 |
| retention marker 与活动引用保护承载 | 做。hold、release、conflict、archive eligibility 和 active reference protection 属于本仓观察面生命周期事实。 |
| 观察面重放 / 重建 / gap scan 事实承载 | 做。本仓可以重建派生观察投影和记录影响范围,但不得修复、删除、覆盖或反写 source truth。 |
| no-write violation 记录承载 | 做。查询、诊断、维护、重建、报告交接或导出试图写入 source truth 的违例应成为本仓观察面事实。 |
| 外围消费材料维护 | 做。dashboard、alert、管理报表、GRC 导出和长期分析可以消费安全摘要,但只能作为派生消费材料。 |

### 4.2 这个仓具体不做什么?

`L4-observability` 不承担相邻真相域职责,不拥有外部正文,也不拥有外部观测产品的系统配置 truth:

| 非职责 | 归属 |
|---|---|
| 事件总线 publish / subscribe / ack / retry / dead-letter / replay 主干 | `L0-bus` |
| Governance decision、Gate、Policy、AIIA、SoA、Control、Nonconformity truth | `L1-governance` |
| Artifact fact、version、lineage、baseline、artifact body、evidence body | `L1-artifact` 或对应 evidence owner |
| Identity member、actor、role、subject lifecycle、认证授权 truth | `L1-identity` / 安全入口 |
| runtime / sandbox execution truth、tool execution、kill / retry / recovery / control command | runtime / sandbox 边界 |
| archive package、长期正文保存、恢复编排、recovery body 和最终归档 truth | archive 相关仓 |
| console / workspace UI 状态、dashboard layout、交互状态和展示 ownership | 产品 / 展示层 |
| 外部 APM、Grafana、Prometheus、OTel Collector、TimescaleDB、对象存储、GRC、alert sink 的系统 truth | 外部系统或后续配置 / 适配边界 |
| source business truth、业务修复、业务裁决、最终验收 verdict、signoff | 对应 source owner、真实测试和验收阶段 |
| API / DTO / Rust schema / 状态机 / 数据库表 / 索引 / repository / adapter 细节 | 后续概要、详细、配置、测试或实施阶段 |

### 4.3 哪些能力看起来相关但必须属于其他仓?

| 易混淆能力 | 必须归属 / 边界 |
|---|---|
| event tap / audit material vs event delivery mainline | tap 和审计材料可进入本仓观察面;投递、ack、retry、dead-letter 和 replay 主干属于 `L0-bus`。 |
| audit projection vs Governance / source audit truth | 本仓拥有只读投影和缺口语境;正式治理结论和 source audit truth 归 source owner。 |
| evidence linkage vs evidence / artifact body | 本仓拥有 body-free 链接、摘要、digest 线索和缺口;证据正文、制品正文和版本血缘归 `L1-artifact` 或 evidence owner。 |
| actor / subject safe ref vs Identity truth | 本仓消费安全引用和审计语境;成员、角色、生命周期、认证授权归 Identity / 安全入口。 |
| trace / metric / log vs runtime execution truth | 本仓拥有安全观察面;执行结果、沙箱状态、控制命令和 recovery truth 归 runtime / sandbox。 |
| diagnostic hint / alert vs business repair or governance decision | 本仓输出只读诊断和告警线索;业务修复、治理裁决和工作状态归相应 owner。 |
| report handoff vs final verdict / acceptance signoff | 本仓交接观察线索和真实性提示;真实测试证据、最终结论和签署只能来自真实执行与验收。 |
| retention marker vs archive package / recovery truth | 本仓拥有观察材料留存标记和活动引用保护;归档包、恢复正文和长期正文保存归 archive。 |
| rebuild / replay vs source truth repair | 本仓只能重建观察投影和记录缺口;source truth 修复、删除或覆盖必须由 source owner 处理。 |
| dashboard / report / GRC export vs truth source | 派生展示和外部导出只能消费安全摘要,不得成为业务 truth、治理 truth 或 evidence truth。 |
| external observability product vs L4 observation truth | 外部 APM / 存储 / dashboard 是 adapter 或配置候选,不能反向定义本仓观察语义。 |

### 4.4 哪些行为绝不能隐式发生?

| 禁止隐式行为 | 原因 |
|---|---|
| source event、raw log、payload、prompt、provider response 或 runtime body 隐式成为本仓正文 truth | 会打穿 redaction-first 和 forbidden body 边界。 |
| 观测材料入口隐式表示 source truth 已写入、已修复、已执行成功或已被治理裁决 | 会让观察面替代业务、执行或治理事实。 |
| audit projection 隐式创建或修改 Governance decision、Artifact lineage、Identity truth、runtime execution truth 或 source audit truth | 会让只读投影反写相邻 truth owner。 |
| evidence link、digest、hash linkage 或 evidence index input 隐式保存 evidence / artifact body | 会让 body-free 证据关联变成证据正文仓。 |
| metric、log、trace、alert、summary 或 diagnostic hint 隐式定义业务状态、执行结果、治理结论或验收结论 | 会让观察摘要成为第二 truth source。 |
| query、diagnostic、maintenance、rebuild、report assembly 或 external export 隐式写入任何 L1 / L2 / L3 / L4 source truth | 会让读 / 维护 / 交接路径反写真相。 |
| report handoff 隐式生成真实 `run_id`、真实 evidence alias、passed evidence、final verdict 或 signoff | 会伪造真实执行证据和验收签署。 |
| retention、archive preparation、cleanup、replay 或 rebuild 隐式删除仍被审计、诊断、报告、留存、重放或合法保留语境引用的材料 | 会破坏活动引用保护和长期追溯。 |
| 外部 APM、Grafana、Prometheus、OTel Collector、TimescaleDB、对象存储或 GRC 工具隐式成为 truth source | 会让产品配置反向定义平台观察语义。 |
| 除 `L0-core` 外把 sibling truth repo 隐式写成编译期依赖 | 会破坏全局依赖裁剪和 truth owner 平权。 |

### 4.5 哪些边界如果不写清,后续设计最容易串线?

最容易串线的边界是:

1. 观测材料准入事实与 source truth 写入 / 修复 / 裁决。
2. Redaction / safety marker 与 raw body、secret、payload body、full sensitive ref。
3. Correlation context 与 opaque id、dashboard label、topic、route 或临时映射。
4. Audit projection 与 Governance decision、source audit truth、Artifact lineage。
5. Body-free evidence linkage 与 evidence body、artifact body、identity body。
6. Safe log / metric / trace 与 runtime / sandbox execution truth。
7. Query / diagnostic / alert 与业务修复、执行控制、治理裁决。
8. Report handoff / evidence index input 与真实 run、真实 evidence、final verdict、signoff。
9. Retention marker / active reference protection 与 archive package、cleanup、recovery body。
10. Rebuild / replay / gap scan 与 source truth repair。
11. 外部 APM / dashboard / GRC / storage 与 observation truth owner。

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01_arch_step_03_responsibility_boundary.md` | 约 80 行,直接以 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等 schema 名称组织职责。 | Step 03 应收稳做 / 不做 / 易混淆职责,不应提前固定 schema 主语或字段方向。 | 本轮替换为职责归属产物,schema 名称后移概要 / 详细设计闭口。 |
| 旧 `README.md` | 混合 OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95、冷存和 hash chain 等产品 / 指标 / 存储线索。 | 技术栈和指标不是当前职责边界,且可能让外部产品成为 truth source。 | 降级为 historical material;只保留横切观测、审计、trace、metrics、retention 和 handoff 方向线索。 |
| 旧正式 `01-架构设计.md` §4 及周边章节 | 已有职责、上下文、子域、技术和数据结论混写。 | 未经本轮 Step 01~03 停审,且旧技术 / schema / 指标残留会污染正式架构。 | Step 16 前不得作为正式架构基线。 |
| 旧 implementation ledger / boundaries | 上一轮粗糙实现移交资产仍存在。 | 未经新版 `07-实施计划.md` 重建,不能作为实现门禁。 | 继续保持 historical material。 |
| 新版需求 §10 / §11 | 规则和数据归属完整但分散。 | 后续架构若不集中重述,概要和详细设计容易把观察面写成 source truth。 | 本步集中形成职责边界表和红线清单。 |

---

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 职责表达 | 偏 schema / 产品 / 功能主语。 | 按观察面 truth、审计投影、证据关联、只读交接、留存和 no-write guard 拆分。 | 对齐架构规范 4.4。 |
| 不做事项 | 旧材料只零散提到相邻仓和外部产品。 | 明确排除 bus 主干、Governance、Artifact / evidence、Identity、runtime / sandbox、archive、console、外部 APM 和真实验收。 | 保护相邻 truth owner。 |
| 易混淆职责 | 分散在需求、README 和旧正式文档。 | 单独列出 audit projection、body-free evidence、safe log / metric / trace、diagnostic、report handoff、retention、external product 等混淆点。 | 防止后续设计串仓。 |
| 红线表达 | 旧文档把规则、数据和实现约束混合。 | 集中列出禁止隐式发生的行为。 | 便于 Step 04 之后继续承接。 |
| 技术产品 | OTel / Prometheus / Grafana / TimescaleDB 等旧线索容易变成职责。 | 当前仅作为后续技术选型 / 配置候选,不得成为 truth source。 | 保持产品中立。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只写“Observability 做日志、指标、追踪和告警” | 简短。 | 会把 audit projection、evidence linkage、report handoff、retention 和 no-write guard 压扁成泛监控平台。 | 不采用。 |
| 方案 B: 按观察面 truth、相邻 truth owner 和易混淆职责拆分 | 可审查,能防串线。 | 文档更长。 | 采用。 |
| 方案 C: 在职责边界中同时固定 schema、字段、状态枚举、存储和产品 | 看似可落码。 | 越过系统上下文、数据所有权、技术选型、概要和详细设计。 | 不采用。 |
| 方案 D: 把 dashboard、alert、GRC 导出、长期分析全部列为非职责 | 范围最小。 | 会丢失外围消费和派生材料维护边界。 | 不采用,改写成派生消费职责和当前取舍。 |

### 7.1 待确认问题的方案选择

#### 是否把 log / metric / trace / audit event schema 写成 Step 03 职责?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前固定 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等 schema 名称。 | 会把旧薄产物中的命名提前硬化,并跳过数据所有权、交互和详细设计。 |
| 方案 B | 当前只固定安全日志 / 指标 / 追踪观察面和审计投影职责。 | 保持职责清晰,把字段、状态和 carrier 留给后续文档闭口。 |

推荐方案 B。

#### 是否把外部观测产品写成本仓职责?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前把 OTel、Prometheus、Grafana、TimescaleDB、对象存储或 GRC 写成本仓核心职责。 | 会让产品和配置成为事实上的 truth source。 |
| 方案 B | 当前只固定产品中立的 observation / projection / handoff / marker truth。 | 保留 adapter 和配置空间,并守住外部产品边界。 |

推荐方案 B。

#### 是否把 report handoff 写成验收 evidence?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前把 report handoff 直接视为真实 evidence、run 或 signoff。 | 会伪造真实执行证据和验收结论。 |
| 方案 B | 当前只把 report handoff 写成只读交接事实和真实性提示。 | 支撑后续验收审查,但不替代真实测试执行。 |

推荐方案 B。

---

## 8. 结构化中间产物

### 8.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 安全观测材料准入事实承载 | 做 | 本仓必须拥有材料在观察语境中被接受、拒绝、隔离或降级的事实。 |
| 观测材料安全处置语境承载 | 做 | redaction、safety marker 和处置原因属于观察面可审计事实。 |
| 来源与关联语境承载 | 做 | 本仓需要统一表达来源、trace、causation 和 safe ref,但不拥有来源正文。 |
| 审计投影事实承载 | 做 | 本仓拥有只读审计投影,否则跨域审计材料会散落在 source owner 中。 |
| body-free 证据关联事实承载 | 做 | 本仓拥有证据链接成立、缺失或不可见的观察面事实,但不保存证据正文。 |
| 安全日志观察面承载 | 做 | 已安全表达的日志观察事实属于本仓,原始日志正文不属于本仓。 |
| 安全指标观察面承载 | 做 | 指标观察和聚合事实属于本仓,业务状态和执行结果不属于本仓。 |
| 安全追踪观察面承载 | 做 | trace / span 观察关联属于本仓,execution truth 不属于本仓。 |
| 观察输出缺口 / 降级 / 不可见表达 | 做 | 本仓必须显式表达 gap、degraded、not-visible 和 unsafe output。 |
| 只读查询与诊断摘要派生维护 | 做 | 查询和诊断只能聚合安全观察线索,不得产生 source write 或 control command。 |
| report handoff / evidence index input 承载 | 做 | 本仓可交接材料线索、脱敏状态、缺口和引用,不得生成最终结论。 |
| 证据真实性提示承载 | 做 | 本仓可以区分真实执行证据、待补齐材料和设计期占位的可见性边界。 |
| retention marker 承载 | 做 | hold、release、conflict 和 archive eligibility 属于观察材料生命周期事实。 |
| active reference protection 承载 | 做 | 仍被审计、诊断、报告、重放或合法保留引用的材料必须被保护。 |
| 观察面 rebuild / replay / gap scan 事实承载 | 做 | 本仓可以重建观察投影和记录缺口,但不能修复 source truth。 |
| no-write violation 记录承载 | 做 | 任何试图从查询、诊断、维护或交接路径写源的行为都应被记录。 |
| dashboard / alert / report / GRC 派生消费材料维护 | 做 | 派生消费材料只能消费安全摘要和引用,不能成为 truth source。 |
| 事件总线主干管理 | 不做 | publish、subscribe、ack、retry、dead-letter 和 replay 主干属于 `L0-bus`。 |
| Governance decision / Policy / Gate / Control truth 管理 | 不做 | 治理正式结论属于 `L1-governance`,审计投影不得替代它。 |
| Artifact fact / version / lineage / baseline 管理 | 不做 | 制品事实、版本、血缘和基线属于 `L1-artifact`。 |
| evidence body / artifact body 管理 | 不做 | 本仓只保存 body-free 关联,正文归 evidence / artifact owner。 |
| Identity lifecycle / authentication / authorization 管理 | 不做 | actor / subject safe ref 不等于身份生命周期或权限 truth。 |
| runtime / sandbox execution truth 管理 | 不做 | 运行执行、工具结果、sandbox 状态和控制命令属于运行边界。 |
| archive package / recovery body 管理 | 不做 | 留存标记不等于归档包、恢复正文或长期正文保存。 |
| console / workspace UI 状态管理 | 不做 | dashboard layout、视图状态和产品交互状态属于展示层。 |
| 外部 APM / storage / dashboard / GRC 产品 truth 管理 | 不做 | 外部产品只能作为 adapter、配置或消费方,不能成为本仓 truth source。 |
| 真实测试 evidence、run、final verdict、signoff 管理 | 不做 | 真实证据和验收签署只能来自真实测试执行与验收阶段。 |
| 观测材料入口与 source truth 写入边界 | 易混淆职责 | 若不显式区分,入口准入会被误解为业务事实已写入或已修复。 |
| redaction / safety marker 与 raw body 边界 | 易混淆职责 | 安全标记不能成为保存 raw body、secret 或 full sensitive ref 的理由。 |
| correlation context 与业务 truth 边界 | 易混淆职责 | trace、topic、route、label 或 opaque id 不得反推出业务 truth。 |
| audit projection 与 source audit / Governance truth 边界 | 易混淆职责 | 只读投影不拥有 source audit 正文或治理裁决。 |
| evidence linkage 与 evidence body 边界 | 易混淆职责 | 链接、摘要和 digest 线索不等于证据正文 ownership。 |
| safe log / metric / trace 与 execution truth 边界 | 易混淆职责 | 运行观察面不能替代执行结果、sandbox 状态或业务成功结论。 |
| diagnostic / alert 与 business repair / control command 边界 | 易混淆职责 | 诊断提示和告警不得触发隐藏修复或执行控制。 |
| report handoff 与 final verdict / signoff 边界 | 易混淆职责 | 报告交接只提供材料线索和真实性提示,不生成最终验收结论。 |
| retention marker 与 archive package / cleanup 边界 | 易混淆职责 | 留存标记不能升级为归档包 ownership 或越权清理。 |
| rebuild / replay 与 source truth repair 边界 | 易混淆职责 | 重建只作用于观察面和派生投影,不能修复外部 truth。 |
| external product 与 observation truth owner 边界 | 易混淆职责 | APM、Grafana、Prometheus、TimescaleDB 或 GRC 不能反向定义平台观察语义。 |

### 8.2 做 / 不做清单

| 类型 | 清单 |
|---|---|
| 做 | 安全观测材料准入;观测材料安全处置;来源与关联语境;审计投影;body-free 证据关联;安全日志 / 指标 / 追踪观察面;缺口 / 降级 / 不可见表达;只读查询 / 诊断摘要;report handoff / evidence index input;证据真实性提示;retention marker;active reference protection;rebuild / replay / gap scan;no-write violation;派生消费材料维护 |
| 不做 | 事件总线主干;Governance truth;Artifact fact / version / lineage / baseline;evidence / artifact body;Identity lifecycle / auth;runtime / sandbox execution truth;archive package / recovery body;console / workspace UI state;外部 APM / storage / dashboard / GRC 产品 truth;真实测试 evidence / run / final verdict / signoff;API / DTO / schema / 数据库 / adapter 细节 |
| 易混淆职责 | 入口准入 vs source write;redaction marker vs raw body;correlation vs business truth;audit projection vs source audit / Governance truth;evidence linkage vs evidence body;safe signals vs execution truth;diagnostic / alert vs repair / control;report handoff vs verdict / signoff;retention marker vs archive package / cleanup;rebuild / replay vs source repair;external product vs observation truth |

### 8.3 边界红线清单

| 红线 | 说明 |
|---|---|
| 不得保存 raw body、secret、credential、payload body、full sensitive ref、raw prompt、provider response body、runtime body 或外部完整正文 | 否则 redaction-first 和 forbidden body 边界失效。 |
| 不得保存 evidence body、artifact body、identity body、governance decision body 或 source audit truth 正文 | 否则审计投影和 body-free evidence linkage 会打穿相邻 truth owner。 |
| 不得把观测材料入口、audit projection、metric、log、trace、dashboard、alert、summary、diagnostic hint 或 report handoff 写成 source truth | 否则观察面会成为第二业务真相。 |
| 不得让 query、diagnostic、maintenance、rebuild、report assembly 或 external export 写入任何 L1 / L2 / L3 / L4 source truth | 否则只读和维护路径会反写真相。 |
| 不得让诊断视图下发 kill、retry、replay、recovery、business command 或其他执行控制命令 | 否则诊断职责会越界为 runtime / sandbox 控制面。 |
| 不得让 report handoff、evidence index input 或设计阶段材料生成真实 `run_id`、真实 evidence alias、passed evidence、final verdict、signoff 或最终验收结论 | 否则设计文档会伪造真实执行证据和验收签署。 |
| 不得让 retention、cleanup、archive preparation、replay 或 rebuild 删除仍被审计、诊断、报告、留存约束、重放或合法保留语境引用的观察材料 | 否则活动引用保护和长期追溯失效。 |
| 不得让 rebuild / replay / gap scan 修复、删除、覆盖或反写 source business truth、Governance truth、Artifact truth、Identity truth、runtime truth 或 archive truth | 否则观察面维护会变成外部 truth 修复流程。 |
| 不得让 `L0-bus` 事件协作替代本仓 observation truth,也不得让本仓拥有 bus 投递主干 truth | 否则 bus 与 observability 的职责会互相吞并。 |
| 不得把除 `L0-core` 外的 sibling repo 写成编译期依赖 | 否则全局依赖裁剪失效。 |
| 不得让外部 APM、OTel、Prometheus、Grafana、TimescaleDB、对象存储、GRC 或 alert sink 成为 truth source | 否则产品配置会反向定义平台观察语义。 |
| 不得把旧 README、旧正式文档、旧中间产物、旧 implementation ledger 或旧 implementation boundaries 恢复为当前架构 truth | 否则 full-restart 校准链路会被旧粗糙实现污染。 |

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 4. 职责边界

> 校准来源:
> - `design-calibration/01_arch_step_03_responsibility_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“边界红线清单”小节,了解本章如何区分 Observability 做什么、不做什么和最易混淆的仓际职责。

正式章节应摘录:

- `design-calibration/01_arch_step_03_responsibility_boundary.md` §8.1 职责边界表。
- `design-calibration/01_arch_step_03_responsibility_boundary.md` §8.2 做 / 不做清单。
- `design-calibration/01_arch_step_03_responsibility_boundary.md` §8.3 边界红线清单。
```

---

## 10. 待确认事项

本步不新增阻塞性待确认事项。后续 Step 04 需要把这些职责边界转换为正式系统上下文关系,但不应改变本步职责归属。

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| `Q-OBS-ARCH-003-001` | log / metric / trace / audit event 的正式 schema、字段、状态枚举和安全标签 | 后续数据所有权、概要和详细设计收敛;当前只固定职责边界。 |
| `Q-OBS-ARCH-003-002` | redaction、safety marker、accepted / rejected / quarantined 的策略和配置 | 后续横切关注点、配置、测试和验收收敛;当前只固定 redaction-first 职责和红线。 |
| `Q-OBS-ARCH-003-003` | correlation carrier、source ref、actor / subject ref 和 evidence ref 的统一格式 | 后续系统上下文、关键交互、概要和详细设计收敛;当前只固定来源与关联语境职责。 |
| `Q-OBS-ARCH-003-004` | digest、hash linkage、canonicalization、gap scan 和 report handoff 格式 | 后续技术选型、详细设计、测试和验收收敛;当前只固定 body-free、只读和缺口显式边界。 |
| `Q-OBS-ARCH-003-005` | 外部 APM / storage / dashboard / GRC / alert / anomaly 产品选型 | 后续技术选型和配置设计收敛;当前只固定外部产品不得成为 truth source。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓做什么 | pass | §8.1 / §8.2 已列出观察面 truth、审计投影、证据关联、只读交接、留存和 no-write 职责。 |
| 是否明确本仓不做什么 | pass | §8.1 / §8.2 已列出 bus、Governance、Artifact、Identity、runtime、archive、console、外部产品和真实验收非职责。 |
| 是否明确易混淆职责 | pass | §8.1 / §8.2 已列出入口准入、redaction、correlation、audit projection、evidence linkage、safe signals、diagnostic、report handoff、retention 和 external product 边界。 |
| 是否给出边界红线 | pass | §8.3 已集中列出 forbidden body、source truth、no-write、真实性、retention、依赖和外部产品红线。 |
| 是否提前写系统上下文、子域、数据所有权、接口协议或实现方案 | pass | 本步只输出职责归属,未画上下文图,未定 schema / 字段 / 存储 / 产品。 |
| 是否把旧 README 或旧正式 01 直接写成新版结论 | pass | 旧材料只作为 historical material 和诊断来源。 |
| 是否伪造实现 commit、run_id、evidence alias、验收签署或测试结果 | pass | 未写入任何真实实现或验收证据。 |
| gate_status | pass | 当前 Step 03 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_04 | 必须等待用户确认后才允许进入 Step 04 `系统边界与上下文`。 |

当前 Step 03 `职责边界` 已完成。下一步必须等待用户确认后进入 Step 04 `系统边界与上下文`,并只创建 / 改写 `design-calibration/01_arch_step_04_system_context.md`。
