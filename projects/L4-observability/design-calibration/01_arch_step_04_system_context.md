# L4-observability 01-架构设计 Step 04 · 系统边界与上下文

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 4
> 回填章节: `01-架构设计.md` §5 系统边界与上下文
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 05

---

## 1. 本步目标

说明 `L4-observability` 在全局系统中的位置,明确它有哪些正式上下文对象、输入面、输出面以及外部边界。本步只表达正式上下文关系和输入 / 输出方向,不展开内部限界上下文、容器部署、数据所有权矩阵、接口协议、事件名、DTO、schema 字段、存储产品、外部 APM 选型或实现层依赖方向。

本步承接 Step 03 的职责边界: `L4-observability` 是横切观察面真相仓,不是业务 truth 聚合仓、事件总线、治理裁决仓、证据正文仓、执行 truth 仓、归档包仓、console UI 仓或外部监控产品配置仓。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | 当前台账显示 Step 03 已完成,用户已确认进入 Step 04 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~03 pass,Step 04 blocked by user confirmation | 确认本轮只允许推进 Step 04。 |
| `design-calibration/01_arch_step_01_requirements_baseline.md` | Step 01 已完成 | 承接需求基线、上下文边界、依赖裁剪和历史材料降级结论。 |
| `design-calibration/01_arch_step_02_arch_goals_constraints.md` | Step 02 已完成 | 承接架构目标、不可变约束、阶段性取舍和架构非目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 03 已完成 | 承接做 / 不做 / 易混淆职责和边界红线。 |
| `projects/L4-observability/00-需求文档.md` §6 / §10 / §11 / §12 / §14 / §15 | 正式需求基线已完成 | 校验依赖、规则、数据归属、接口边界、验收和风险。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 约束 `L0-core` 编译期依赖、`L0-bus` 事件协作和 sibling repo 非编译期依赖。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 4 | 已读取 | 约束系统上下文图、输入 / 输出面、降级口径和进入下一步条件。 |
| `standards/document/架构设计书写规范.md` §4.5 | 已读取 | 控制上下文图对象、关系类型、表格结构和边界说明写法。 |
| `projects/L1-governance/design-calibration/01_arch_step_04_system_context.md` | 已读取 | 作为 Step 04 粒度、图表结构和降级口径参照。 |
| `projects/L1-artifact/design-calibration/01_arch_step_04_system_context.md` | 已读取 | 作为 truth owner / 下游消费 / 基础设施后置表达参照。 |
| 旧 `design-calibration/01_arch_step_04_system_context.md` | historical material,已被本文件替换 | 仅作为薄产物诊断来源,不继承其中 schema / 产品 / 指标口径。 |
| 旧 `projects/L4-observability/README.md` 与旧 `01-架构设计.md` | historical material | 仅作为旧上下文、旧产品栈和旧实现假设诊断来源。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 01~03、架构 SOP Step 4 和书写规范 4.5 | done | 本文件 §2 |
| 回答全局位置、正式上游、正式下游、输入面、输出面、上下文边界和降级口径问题 | done | 本文件 §4 |
| 诊断旧 README、旧正式 01 和旧 Step 04 中系统上下文污染点 | done | 本文件 §5 |
| 选择关键对象收缩图,不画角色、文档来源、事件名、接口名、schema 或基础设施产品 | done | 本文件 §7 |
| 输出系统上下文图、上下游与输入 / 输出面表、依赖失效降级口径和边界说明 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 04 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 这个仓在全局系统中的位置是什么?

`L4-observability` 位于 L4 基础设施层,是平台横切观察面真相边界。它上承 `L0-core` 的共享契约和 `L0-bus` 的事件协作入口,从 Identity、Governance、Artifact、Runtime、Sandbox 等 source owner 接收可观察材料来源语境或安全引用,形成安全观测材料、审计投影、body-free 证据关联、安全日志 / 指标 / 追踪观察面、只读诊断、report handoff、retention marker 和 no-write violation 事实。

这个位置的关键不是“所有系统都把日志交给它”,而是所有跨域观察、审计投影、证据关联、诊断交接和留存语境都必须围绕同一份 observation truth 收束。相邻仓可以作为材料来源、消费方或协作方,但不能把其业务 truth、正文 truth 或执行 truth 转移给 `L4-observability`;本仓也不能把观察面反写为相邻仓正式 truth。

### 4.2 它有哪些正式上游?

| 正式上游 | 关系类型 | 当前口径 |
|---|---|---|
| `L0-core` | 来源 / 依赖 | 提供共享 ID、safe ref、trace / correlation 语境、metadata、error 和安全标记;是唯一编译期上游。 |
| `L0-bus` | 来源 / 协作入口 | 提供 tap / audit material 的事件协作通道和横切观察材料入口;不提供 bus 投递主干 ownership。 |
| `L1-identity` | 来源 / 消费 | 提供 actor / subject safe ref 和身份相关审计语境,也消费身份相关只读观察材料。 |
| `L1-governance` | 来源 / 消费 | 提供治理相关审计语境、policy / gate 观察线索和报告交接消费语境,但 governance decision truth 不转移。 |
| `L1-artifact` | 来源 / 消费 | 提供 artifact / evidence safe ref、完整性线索和 body-free evidence linkage 语境,但 artifact / evidence body 不转移。 |
| `L2-runtime` | 来源 / 消费 | 提供运行 log / metric / trace 来源语境并消费安全运行观察面,但 execution truth 不转移。 |
| `L4-sandbox` | 来源 / 消费 | 提供 sandbox 隔离、环境和执行相关观察材料来源语境,但 sandbox truth 不转移。 |

### 4.3 它有哪些正式下游?

| 正式下游 | 关系类型 | 当前口径 |
|---|---|---|
| `L1-identity` | 消费 | 消费身份相关观察面、审计投影和缺口语境,但不让本仓修改身份 truth。 |
| `L1-governance` | 消费 | 消费治理审计投影、缺口和报告交接材料,但正式治理结论仍归 Governance。 |
| `L1-artifact` | 消费 | 消费制品 / 证据相关观察面、完整性线索和 body-free 证据关联,但正文仍归 Artifact / evidence owner。 |
| `L2-runtime` / `L4-sandbox` | 消费 | 消费安全运行观察、诊断摘要和缺口线索,但不能由本仓下发执行控制命令。 |
| `L4-archive` | 消费 / 交接 | 消费 retention marker、archive eligibility、长期只读交接和活动引用保护语境,但 archive package 不归本仓。 |
| `L0-sdk` / `L5-console` | 入口 / 消费 | 提供只读观察面、审计投影查看、诊断摘要和交接材料访问入口,但入口系统不得反写 observation truth。 |
| report / acceptance handoff systems | 消费 | 消费 report handoff、evidence index input、脱敏状态、缺口说明和真实性提示,但不生成最终 verdict 或 signoff。 |
| external audit / GRC, alert, anomaly analysis consumers | 消费 | 外围消费安全摘要、告警线索或审计导出材料,不得成为本仓 truth source。 |

### 4.4 它从外部接收哪些输入面?

| 输入面 | 来源对象 | 本步边界 |
|---|---|---|
| 共享契约输入面 | `L0-core` | 只接收 shared ref、trace / correlation、metadata、error 和安全标记语境,不重新定义 L0 contract。 |
| 横切观察材料入口 | `L0-bus` 和 source owner | 接收 tap / audit material 和 source observation material,但 bus 主干和 source truth 不归本仓。 |
| 身份审计语境输入面 | `L1-identity` | 接收 actor / subject safe ref 和身份审计语境,不接管 member / role 生命周期。 |
| 治理审计语境输入面 | `L1-governance` | 接收治理相关审计语境、policy / gate 线索和报告消费语境,不接管治理决策。 |
| 制品 / 证据引用输入面 | `L1-artifact` | 接收 artifact / evidence safe ref、完整性线索和 body-free evidence 语境,不保存 evidence body。 |
| 运行观察材料输入面 | `L2-runtime` | 接收安全可表达的运行 log / metric / trace 来源语境,不接管执行结果。 |
| sandbox 观察材料输入面 | `L4-sandbox` | 接收 sandbox 环境、隔离和执行相关观察语境,不接管 sandbox control truth。 |
| 产品中立外部能力输入面 | 采集 / 存储 / 展示 / 导出候选能力 | 仅作为后续技术选型和配置候选,当前不绑定 OTel、Prometheus、Grafana、TimescaleDB 或对象存储。 |

### 4.5 它向外部提供哪些输出面?

| 输出面 | 消费对象 | 本步边界 |
|---|---|---|
| 安全观察面输出 | source owner、`L0-sdk`、`L5-console` | 输出安全日志、指标、追踪、来源语境和缺口,不得反向定义 source truth。 |
| 审计投影输出 | `L1-governance`、`L1-artifact`、report / audit consumers | 输出只读审计投影、来源语境和责任主体语境,不得替代 Governance 或 source audit truth。 |
| body-free 证据关联输出 | `L1-artifact`、report / acceptance handoff systems | 输出证据引用、摘要、digest 线索和缺口,不得输出 evidence / artifact body。 |
| 只读诊断输出 | `L2-runtime`、`L4-sandbox`、`L5-console` | 输出诊断摘要、降级和观察线索,不得下发 kill、retry、replay 或 recovery command。 |
| report handoff 输出 | report / acceptance handoff systems、`L4-archive` | 输出交接材料线索、脱敏状态、缺口和真实性提示,不得生成 final verdict、真实 run 或 signoff。 |
| retention / archive readiness 输出 | `L4-archive` | 输出 retention marker、active reference protection 和 archive eligibility 线索,不拥有 archive package。 |
| 外围消费输出 | external audit / GRC、alert、anomaly analysis consumers | 输出安全摘要、告警线索或审计导出材料,不得改变本仓 truth 或外部 source truth。 |

### 4.6 哪些外部系统或相邻仓构成正式上下文边界?

正式上下文边界按是否持续影响 observation truth 的输入、消费、入口、交接或外围消费来判断:

| 边界对象 | 是否进入 Step 04 主图 | 判断 |
|---|---|---|
| `L0-core` | 进入 | 唯一编译期共享契约来源,必须在主图表达。 |
| `L0-bus` | 进入 | 横切观察材料主入口和事件协作主干,必须表达为协作边界而非 bus truth ownership。 |
| `L1-identity` / `L1-governance` / `L1-artifact` | 进入但收缩 | 三者是关键 source truth owner 和消费方;主图收缩为 L1 truth owners,表中逐项说明。 |
| `L2-runtime` / `L4-sandbox` | 进入但收缩 | 二者是运行 / sandbox 观察材料关键来源和消费方;主图收缩为 runtime / sandbox observation sources。 |
| `L4-archive` / report handoff systems | 进入但收缩 | 作为 retention、archive eligibility 和 report handoff 消费边界进入主图。 |
| `L0-sdk` / `L5-console` | 进入但收缩 | 作为正式只读访问和管理展示入口进入主图。 |
| external audit / GRC、alert、anomaly analysis consumers | 表中保留,主图不单列或收缩为 peripheral consumers | 当前是外围增强消费对象,不构成 observation truth 成立前置。 |
| OTel / Prometheus / Grafana / TimescaleDB / 对象存储 / 外部 APM | 不进入 | 当前只是产品中立采集、存储、展示或导出能力候选,不是正式 truth source。 |

### 4.7 依赖失效时,本仓的降级口径是什么?

| 失效对象 | 降级口径 |
|---|---|
| `L0-core` | 不可自行降级为私有 ID / trace / safe ref 体系;共享契约缺口会阻塞正式观察材料成立。 |
| `L0-bus` | 事件协作输入和观察材料入口可挂起或延迟;不得补造 bus material 或把缺失材料写成已观察。 |
| `L1-identity` | actor / subject 暂不可解析时,身份相关观察材料应进入 unresolved、degraded 或 gap 语境;不得补造 identity truth。 |
| `L1-governance` | 治理语境不可用时,治理审计投影和 report handoff 应显式 blocked / degraded;不得补造治理裁决。 |
| `L1-artifact` | artifact / evidence ref 或完整性线索不可用时,body-free evidence linkage 应显式缺口;不得保存 evidence / artifact body 副本。 |
| `L2-runtime` | runtime 观察来源不可用时,安全运行观察面应显式 missing / degraded;不得由指标、trace 或日志裁决 execution truth。 |
| `L4-sandbox` | sandbox 观察来源不可用时,sandbox 材料域可降级,但不得影响非 sandbox 材料域成立,也不得接管 sandbox control truth。 |
| `L4-archive` | archive 消费不可用时,retention marker 和 active reference protection 仍在本仓成立;archive package 不迁入本仓。 |
| `L0-sdk` / `L5-console` | 只读入口或展示不可用时,只影响消费体验,不得改变 observation truth。 |
| report / acceptance handoff systems | handoff 消费方不可用时,交接进入 blocked / pending / gap;不得填写真实 run、evidence alias、final verdict 或 signoff。 |
| external audit / GRC、alert、anomaly analysis consumers | 外围消费者不可用时,核心观察闭环不受影响;不得用外部产品状态反向定义本仓 truth。 |

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01_arch_step_04_system_context.md` | 约 80 行,仍以 log schema、metric schema、trace schema、audit event schema 等主语收束。 | Step 04 应表达系统上下文对象和输入 / 输出面,不应提前写 schema、字段或记录名。 | 本轮替换为系统上下文产物,schema 后移概要 / 详细设计。 |
| 旧 Step 04 结构化产物 | 把 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等写成当前收口。 | 这些是概要 / 详细设计候选对象,不是系统上下文对象。 | 全部降级为 historical material,不得作为当前架构基线。 |
| 旧 README | 混合 OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95、冷存和 hash chain 等产品 / 指标线索。 | 产品、存储和指标不属于 Step 04 正式上下文,且可能让外部产品成为 truth source。 | 不进入主图;后续技术选型 / 配置 / 测试再评估。 |
| 旧正式 `01-架构设计.md` | 上下文、职责、技术产品、数据和实现假设混写。 | 未经本轮 Step 01~04 停审,且旧上下文可能包含产品绑定和 schema 硬化。 | Step 16 前不得作为正式架构基线。 |
| 新版需求 §6 / §12 | 上下文对象和外围消费者较多。 | 单图逐个展开会超过系统上下文图对象数量建议。 | 主图收缩关键对象组,表中逐项展开。 |

---

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 图对象 | 旧产物没有真正的系统上下文图,而是 schema / 功能主语表。 | 改为仓、协作主干、source truth owner、runtime / sandbox、交接消费和入口消费边界。 | 对齐架构规范 4.5。 |
| 上下文关系 | 旧内容混入职责、schema、产品和数据设计。 | 只保留输入 / 输出 / 依赖方向和能力面。 | 防止提前写接口、事件或内部结构。 |
| 外部产品 | 旧 README 让 OTel / Prometheus / Grafana / TimescaleDB 像核心前置。 | 产品中立能力只列为后续候选,不进入主图 truth source。 | 守住产品中立和 truth 边界。 |
| 降级口径 | 旧内容偏模板化,缺少依赖失效时的 no-write 和真实性边界。 | 按 source truth owner、消费方和外围增强分别给出 missing / degraded / blocked / gap 口径。 | 防止依赖不可用时补造 truth 或伪造 evidence。 |
| report handoff | 旧内容容易与真实 evidence / verdict 混层。 | 明确 report / acceptance handoff systems 只是消费交接材料。 | 防止设计阶段伪造真实验收。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 单图逐个画出所有 source owner、消费者、外部产品和外围增强 | 看似完整。 | 图超过规范建议,并会把外围增强和产品候选误读为核心上下文。 | 不采用。 |
| 方案 B: 主图收缩关键上下文对象组,表中展开完整上下游 | 图清晰,表可审查。 | 需要读表理解细项。 | 采用。 |
| 方案 C: 沿用旧 Step 04 并局部补图 | 修改少。 | 旧 schema、产品栈和 `next_step_or_formal_assembly` 口径会继续污染。 | 不采用。 |
| 方案 D: 把外部 APM / OTel / Prometheus / Grafana / TimescaleDB 画入系统上下文图 | 接近旧实现设想。 | 会提前进入技术选型和配置,并让外部产品像 truth source。 | 不采用。 |

### 7.1 待确认问题的方案选择

#### 是否把外部观测产品画入系统上下文图?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前画入 OTel、Prometheus、Grafana、TimescaleDB、对象存储或外部 APM。 | 会把候选产品误读为正式上下文和 truth source。 |
| 方案 B | 当前不画具名产品,只保留产品中立能力为后续候选。 | 保持 Step 04 的仓级上下文边界,不提前固化技术栈。 |

推荐方案 B。

#### 是否把外围消费者画入主图?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 逐个画出 external audit / GRC、alert、anomaly、DORA / EBM / ISO report 等外围消费者。 | 图过载,且外围增强会被误读为核心闭环前置。 |
| 方案 B | 主图只收缩为 peripheral consumers,表中解释其只读消费边界。 | 保留关系,同时不污染核心上下文。 |

推荐方案 B。

#### 是否把 source owner 全部逐个画入主图?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 单图分别画 `L1-identity`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L4-sandbox`。 | 对象数量较多,图可读性下降。 |
| 方案 B | 主图按 L1 truth owners 与 runtime / sandbox groups 收缩,表中逐项展开。 | 兼顾系统位置感和边界完整性。 |

推荐方案 B。

---

## 8. 结构化中间产物

### 8.1 系统上下文图

```text
+----------------------+      +----------------------+      +----------------------+
|       L0-core        |      |        L0-bus        |      |  L1 truth owners     |
| shared contract base |      | observation material |      | identity/gov/artifact|
+----------+-----------+      +----------+-----------+      +----------+-----------+
           |                             |                             |
           | 依赖                        | 输入 / 输出                 | 输入 / 输出
           v                             v                             v

                    +--------------------------------------+
                    |          L4-observability            |
                    | cross-cutting observation truth      |
                    +------------------+-------------------+
                                       ^
                                       |
                         输入 / 输出   |
                                       |
                    +------------------+-------------------+
                    | runtime / sandbox observation sources|
                    | L2-runtime / L4-sandbox              |
                    +------------------+-------------------+
                                       |
                                       | 输出
                                       v
+----------------------+      +----------------------+      +----------------------+
| archive / report     |      | SDK / console        |      | peripheral consumers |
| handoff consumers    |      | read-only access     |      | audit/alert/analysis |
+----------------------+      +----------------------+      +----------------------+
```

该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向，不表达接口、事件、实现组件或运行时顺序。

图示说明:

- `L4-observability` 位于中心,表示它是横切 observation truth、audit projection、handoff、retention marker 和 no-write violation 的真相边界。
- `L0-core` 是唯一编译期共享契约来源;`L0-bus` 是事件协作和观察材料入口,但 bus 主干 truth 不归本仓。
- `L1 truth owners` 和 `runtime / sandbox observation sources` 只通过安全引用、摘要、观察材料和消费边界协作,不把业务 truth、正文 truth 或 execution truth 迁入本仓。
- `archive / report handoff consumers`、`SDK / console` 和 `peripheral consumers` 只读消费安全观察面、交接材料或外围摘要,不得反向定义 observation truth。

### 8.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 / 依赖 | 共享 ID、safe ref、trace / correlation、metadata、error、安全 marker | 唯一编译期上游;本仓不得重新定义共享契约。 |
| `L0-bus` | 输入 / 输出 | 来源 / 消费 | tap / audit material、观察输出降级、留存和交接相关协作 | Bus 是事件协作主干,不拥有 observation truth 或 source truth。 |
| `L1-identity` | 输入 / 输出 | 来源 / 消费 | actor / subject safe ref、身份审计语境、身份相关观察缺口 | 本仓只消费和输出身份相关观察语境,不拥有身份生命周期。 |
| `L1-governance` | 输入 / 输出 | 来源 / 消费 | 治理审计语境、policy / gate 观察线索、治理报告交接材料 | 本仓只做观察投影和交接,不拥有 governance decision。 |
| `L1-artifact` | 输入 / 输出 | 来源 / 消费 | artifact / evidence safe ref、完整性线索、body-free 证据关联 | 本仓不得保存 artifact body 或 evidence body。 |
| `L2-runtime` | 输入 / 输出 | 来源 / 消费 | runtime log / metric / trace 来源语境、安全运行观察面、诊断摘要 | 本仓不拥有 execution truth,也不下发执行控制命令。 |
| `L4-sandbox` | 输入 / 输出 | 来源 / 消费 | sandbox 环境、隔离和执行相关观察语境、sandbox 诊断缺口 | Sandbox truth 和控制边界不迁入本仓。 |
| `L4-archive` | 输出 | 消费 | retention marker、archive eligibility、长期只读交接和活动引用保护 | Archive 消费留存线索,不让本仓拥有 archive package。 |
| `L0-sdk` | 输出 | 入口 / 消费 | 只读观察面、审计投影、诊断摘要和交接材料访问入口 | SDK 是正式访问边界,不得绕过 no-write guard。 |
| `L5-console` | 输出 | 入口 / 消费 | 管理查看、只读诊断、审计投影查看和交接材料消费 | Console UI state 和 dashboard layout 不属于本仓 truth。 |
| report / acceptance handoff systems | 输出 | 消费 | report handoff、evidence index input、脱敏状态、缺口和真实性提示 | 消费方不能把交接材料当成 final verdict、真实 evidence 或 signoff。 |
| external audit / GRC consumers | 输出 | 消费 | 安全审计材料导出、缺口说明和可审计引用 | 外部 GRC 是外围消费方,不拥有本仓 truth 或治理 truth。 |
| alert / notification consumers | 输出 | 消费 | 观察输出降级、异常线索和安全摘要 | Alert 只能消费观察摘要,不等于业务 truth 或执行裁决。 |
| anomaly / root-cause analysis consumers | 输出 | 消费 | 安全观察摘要、趋势和诊断建议输入 | 分析建议不得替代只读诊断边界或 source truth。 |
| 产品中立采集 / 存储 / 展示 / 导出能力 | 输入 / 输出 | 外部能力候选 | 后续 adapter、存储、展示或导出候选能力 | 当前不绑定 OTel、Prometheus、Grafana、TimescaleDB、对象存储或 APM。 |

### 8.3 依赖失效降级口径

| 对象 | 失效情况 | 架构口径 |
|---|---|---|
| `L0-core` | shared ref、trace / correlation 或安全 marker 不稳定 | 不生成正式 observation truth,不得用私有契约补造共享语义。 |
| `L0-bus` | tap / audit material 输入或协作输出不可用 | 观察材料入口和跨仓协作可挂起;不得静默补造材料或写成已交接。 |
| `L1-identity` | actor / subject safe ref 或身份审计语境不可用 | 身份相关观察进入 unresolved / degraded / gap;不得补造 identity truth。 |
| `L1-governance` | 治理审计语境或报告消费语境不可用 | 治理投影和 handoff 进入 blocked / degraded;不得补造 governance decision。 |
| `L1-artifact` | artifact / evidence ref 或完整性线索不可用 | body-free evidence linkage 进入 gap / not-visible;不得保存正文副本。 |
| `L2-runtime` | runtime 观察来源不可用 | safe log / metric / trace 观察面显式 missing / degraded;不得裁决 execution truth。 |
| `L4-sandbox` | sandbox 观察来源不可用 | sandbox 材料域显式 degraded;不得接管 sandbox control truth。 |
| `L4-archive` | archive 消费或归档准备不可用 | retention marker 仍在本仓成立;archive handoff 可 blocked / pending。 |
| `L0-sdk` / `L5-console` | 只读入口或展示不可用 | 只影响访问和展示体验,不得修改 observation truth。 |
| report / acceptance handoff systems | 报告、验收或 evidence index 消费不可用 | handoff 进入 blocked / pending / gap,不得伪造真实 run、evidence alias、verdict 或 signoff。 |
| external audit / GRC、alert、anomaly consumers | 外围消费者不可用 | 核心观察闭环不受影响;不得让外围工具状态反向定义 truth。 |
| 产品中立外部能力候选 | 外部采集 / 存储 / 展示 / 导出产品不可用 | 当前不构成正式 truth 前置;后续技术选型必须保留替换和降级口径。 |

### 8.4 边界说明结论

`L4-observability` 的系统上下文围绕“共享契约、事件协作、相邻 truth owner、运行 / sandbox 观察来源、只读访问、报告交接、留存归档和外围消费”展开。进入主图的对象都是会持续影响 observation truth 的正式输入、输出、消费或交接边界;角色、文档来源、接口名、事件名、DTO、schema、数据库、存储产品、dashboard 产品和外部 APM 不进入本章。`L1-identity`、`L1-governance`、`L1-artifact`、`L2-runtime` 和 `L4-sandbox` 只通过 safe ref、摘要、观察材料、缺口和只读消费边界协作,不把身份、治理、制品、证据、执行或 sandbox truth 转移给本仓。`L4-archive`、`L0-sdk`、`L5-console`、report / acceptance systems 和外围消费者只能消费安全观察面或交接材料,不得反写本仓 truth 或生成真实验收结论。

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 5. 系统边界与上下文

> 校准来源:
> - `design-calibration/01_arch_step_04_system_context.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“当前文档问题诊断”小节,了解本章如何从职责边界、需求依赖裁剪和输入 / 输出面收敛出正式系统上下文。

### 5.1 系统上下文图

摘录 `design-calibration/01_arch_step_04_system_context.md` §8.1。

### 5.2 上下游与输入 / 输出面表

摘录 `design-calibration/01_arch_step_04_system_context.md` §8.2。

### 5.3 边界说明

摘录 `design-calibration/01_arch_step_04_system_context.md` §8.4。
```

---

## 10. 待确认事项

本步不新增阻塞 Step 05 的待确认事项。下列事项进入后续 Step,不得在 Step 04 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| `Q-OBS-ARCH-004-001` | `L4-observability` 内部限界上下文与子域如何划分 | 后续 Step 05 收敛;当前只固定系统上下文边界。 |
| `Q-OBS-ARCH-004-002` | 输入 / 输出面背后的具体交互方式、同步 / 异步口径和消息语义 | 后续 Step 09 和详细设计收敛;当前不写协议、事件名或 DTO。 |
| `Q-OBS-ARCH-004-003` | log / metric / trace / audit projection / report handoff 的具体 schema 和状态枚举 | 后续数据所有权、概要和详细设计收敛;当前不写字段或记录名。 |
| `Q-OBS-ARCH-004-004` | OTel、Prometheus、Grafana、TimescaleDB、对象存储、外部 APM 或 GRC 是否进入技术主线 | 后续 Step 10、配置、测试和实施阶段收敛;当前不画入系统上下文。 |
| `Q-OBS-ARCH-004-005` | report / acceptance handoff 的正式交接格式和证据真实性提示细节 | 后续关键交互、详细设计、测试、验收和实施计划收敛;当前只固定只读交接边界。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓在全局系统中的位置 | pass | `L4-observability` 已定位为 L4 横切 observation truth boundary。 |
| 是否画出正式对象的系统上下文图 | pass | §8.1 只画仓、协作主干、truth owner、runtime / sandbox、交接消费、访问入口和外围消费边界。 |
| 图中是否避免角色、文档来源对象、接口名、事件名和实现组件 | pass | 图中无角色、文档、API、event、DTO、repository、database、产品名。 |
| 是否通过表格解释上下游和输入 / 输出面 | pass | §8.2 已列出对象、关系方向、关系类型、输入 / 输出面和说明。 |
| 是否说明依赖失效降级口径 | pass | §8.3 已按 source owner、消费方、外围消费者和外部候选能力给出降级口径。 |
| 是否说明边界和不进入主图的相关对象 | pass | §8.4 已解释 source owner、消费方、外围增强和外部产品候选边界。 |
| 是否提前写内部结构、容器部署、数据所有权、协议或技术选型 | pass | 本步只输出系统上下文;相关事项进入后续 Step。 |
| 是否把旧 README 或旧正式 01 直接写成新版结论 | pass | 旧材料只作为 historical material 和诊断来源。 |
| 是否伪造实现 commit、run_id、evidence alias、验收签署或测试结果 | pass | 未写入任何真实实现或验收证据。 |
| gate_status | pass | 当前 Step 04 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_05 | 必须等待用户确认后才允许进入 Step 05 `限界上下文与子域划分`。 |

当前 Step 04 `系统边界与上下文` 已完成。下一步必须等待用户确认后进入 Step 05 `限界上下文与子域划分`,并只创建 / 改写 `design-calibration/01_arch_step_05_bounded_context.md`。
