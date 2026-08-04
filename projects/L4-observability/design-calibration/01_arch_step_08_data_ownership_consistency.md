# L4-observability 01-架构设计 Step 08 · 数据所有权与一致性策略

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 8
> 回填章节: `01-架构设计.md` §9 数据所有权与一致性策略
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 09

---

## 1. 本步目标

明确 `L4-observability` 拥有哪些正式真相数据,哪些只是快照 / 投影数据,哪些只是引用关系数据,哪些正文 / 真相必须明确排除在本仓之外;并在这些归属判断成立的前提下,说明不同数据关系应采用什么一致性口径,以及一致性暂时不成立时的架构层处理原则。

本步不写数据库表、字段、DDL、缓存策略、outbox、事务机制、事件 schema、重试脚本、repository / service / adapter、具体对象模型、产品栈或外部存储选择。本步尤其不把 log / metric / trace / audit / evidence / handoff 的旧 schema 名称和字段清单写成数据所有权。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | 当前台账显示 Step 07 已完成,用户已确认进入 Step 08 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~07 pass,Step 08 blocked by user confirmation | 确认本轮只允许推进 Step 08。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 03 已完成 | 提供做 / 不做、易混淆职责和边界红线。 |
| `design-calibration/01_arch_step_04_system_context.md` | Step 04 已完成 | 提供正式上下文对象、输入 / 输出面和依赖失效降级口径。 |
| `design-calibration/01_arch_step_05_bounded_context.md` | Step 05 已完成 | 提供核心子域、支撑上下文、本地索引 / 投影 / 引用层。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | Step 06 已完成 | 提供观察面真相承载、派生承载和后台维护运行边界。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | Step 07 已完成 | 提供依赖方向、倒置边界、禁止反向依赖和跨仓裁剪结论。 |
| `design-calibration/00_req_step_11_data_requirements_ownership.md` | 需求 Step 11 已完成 | 提供需求层 truth / snapshot / ref / forbidden body 结论。 |
| `projects/L4-observability/00-需求文档.md` §11 / §13 / §14 / §15 | 正式需求基线已完成 | 校验数据归属、NFR、验收和风险边界。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 8 | 已读取 | 控制本步必须输出数据所有权、一致性、停审和跨数据边界审计。 |
| `standards/document/架构设计书写规范.md` §4.9 | 已读取 | 控制数据归属表、一致性策略表和关系示意图写法。 |
| `projects/L1-governance/design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已读取 | 参考“归属先行 + 一致性推导 + 审计停审”的组织方式。 |
| `projects/L1-artifact/design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已读取 | 参考 truth / projection / ref / forbidden body 与架构单元停审粒度。 |
| 旧 `design-calibration/01_arch_step_08_data_ownership_consistency.md` | historical material,已被本文件替换 | 仅作为薄产物诊断来源,不继承 schema 字段、产品栈或 `next_step_or_formal_assembly` 门禁。 |
| 旧 `projects/L4-observability/README.md` 与旧 `01-架构设计.md` | historical material | 仅作为旧数据归属、旧产品栈和旧一致性假设诊断来源。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 03~07、SOP Step 8、书写规范 4.9 和需求数据归属 | done | 本文件 §2 |
| 读取 L1 参考 Step 08、旧架构数据章节和旧 L4 Step 08 | done | 本文件 §2 / §5 |
| 回答正式真相、快照 / 投影、引用、明确不拥有正文和一致性问题 | done | 本文件 §4 |
| 诊断旧 README、旧正式 01 和旧 Step 08 中 schema / 产品 / 实现一致性污染点 | done | 本文件 §5 |
| 输出数据归属表、一致性策略表、架构单元数据所有权表、关系示意图和边界说明 | done | 本文件 §8 |
| 完成数据所有权停审和跨数据边界审计 | done | 本文件 §8.5 / §8.6 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 08 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 哪些数据由本仓拥有正式真相?

`L4-observability` 拥有横切观察面事实本身的正式真相。它拥有的是 observation material 准入、安全处置、来源与关联语境、audit projection、body-free evidence linkage、安全日志 / 指标 / 追踪观察面、报告交接事实、真实性提示、retention marker、active reference protection、rebuild / replay fact 和 no-write violation,不是业务 source truth、治理裁决 truth、证据 / 制品正文、身份生命周期、运行 / sandbox 执行 truth、归档包、console UI state、外部 APM 配置或最终验收结论。

| 正式真相数据 | 判断 |
|---|---|
| 观测材料准入事实 | accepted / rejected / quarantined / degraded 等材料进入观察语境的事实由 Observability 拥有。 |
| 观测材料安全处置语境 | redaction、safety marker、隔离 / 拒绝原因和可审计安全判断由 Observability 拥有。 |
| 来源与关联语境 | source attribution、correlation context、causation 和 safe ref 关联语境由 Observability 拥有,但不拥有来源正文。 |
| 审计投影事实 | 安全观察材料形成只读审计投影的事实由 Observability 拥有,但不拥有 source audit truth。 |
| body-free 证据关联事实 | evidence linkage 的成立、缺失、不可见、digest 线索和消费目的由 Observability 拥有,但不保存 evidence body。 |
| 安全日志观察面 | 已安全表达的日志观察事实由 Observability 拥有,不拥有 raw log body。 |
| 安全指标观察面 | 已安全表达的指标观察和聚合事实由 Observability 拥有,不拥有业务状态 truth。 |
| 安全追踪观察面 | 已安全表达的 trace / span 观察关联由 Observability 拥有,不拥有 execution truth。 |
| 观察输出降级 / 不可见事实 | missing、degraded、blocked、not-visible 和 unsafe output 事实由 Observability 拥有。 |
| 报告交接事实 | report handoff、evidence index input、交接阻塞、完成或撤销事实由 Observability 拥有。 |
| 证据真实性提示 | 区分真实执行证据、待补齐材料和设计期占位的观察面提示事实由 Observability 拥有。 |
| retention marker | hold、release、conflict、archive eligibility 和留存状态由 Observability 拥有。 |
| active reference protection | 材料仍被审计、诊断、报告、留存、重放或合法保留引用的保护事实由 Observability 拥有。 |
| 观察面重放 / 重建事实 | 观察面和派生投影重放 / 重建的范围、原因、影响和缺口事实由 Observability 拥有。 |
| no-write violation 记录 | 查询、诊断、维护、重建、报告交接或导出试图写入 source truth 的违例事实由 Observability 拥有。 |

### 4.2 哪些数据只是快照 / 投影?

快照 / 投影只服务稳定查询、诊断、报告、外围消费、审计导出、归档准备和维护解释,不得成为独立 observation truth,更不得成为 source truth。

| 快照 / 投影数据 | 上游或来源 |
|---|---|
| 输入来源安全摘要 | source owner、`L0-bus`、runtime / sandbox 等来源对象 |
| 审计投影安全摘要 | 本仓 audit projection 派生 |
| 运行状态安全摘要 / metric rollup | runtime / sandbox 观察来源和本仓 safe signal 派生 |
| 只读观测查询结果语境 | 本仓 observation truth 派生 |
| 只读诊断摘要 | 本仓 safe signal、gap、audit projection 和 evidence linkage 派生 |
| 报告交接摘要 / 缺口说明 | report handoff fact、audit projection 和 evidence linkage 派生 |
| 重放 / 留存影响摘要 | retention marker、rebuild / replay fact 和 no-write guard 派生 |
| dashboard / alert / management report / GRC export / anomaly analysis material | 本仓安全摘要和派生投影输出 |
| 产品中立外部能力候选摘要 | 后续采集、存储、展示、导出或 APM 候选能力语境 |

### 4.3 哪些数据只是引用关系?

引用关系只保存指向外部对象、外部正文、外部正式材料或外部消费边界的稳定回链,不保存外部正文,也不承担外部生命周期。

| 引用关系数据 | 外部对象 |
|---|---|
| source owner / bus material / payload carrier 引用 | source owner、`L0-bus`、payload owner |
| actor / subject safe ref | `L1-identity` / 安全入口 |
| Governance / policy / gate / control 引用 | `L1-governance` |
| Artifact / evidence / baseline / integrity 引用 | `L1-artifact` 或对应 evidence owner |
| runtime / sandbox source ref | `L2-runtime` / `L4-sandbox` |
| archive / report / external audit handoff ref | `L4-archive`、report / acceptance systems、external audit / GRC |
| SDK / console / dashboard / alert consumer ref | `L0-sdk`、`L5-console` 和外围消费边界 |
| external product capability ref | 外部 APM、采集、存储、展示、导出、GRC 或 alert 候选能力 |

### 4.4 哪些正文 / 真相本仓明确不拥有?

`L4-observability` 明确不拥有业务正文、相邻仓主真相、运行正文、证据正文、归档正文、产品入口私有状态、外部产品配置 truth 或真实验收材料。即便这些材料参与观察、审计、诊断、报告或归档准备,也只能以引用、摘要、safe summary、快照、缺口或 Observability 自身结论进入。

| 明确不拥有的正文 / 真相 | 原因 |
|---|---|
| source business truth、业务 payload、业务修复 / 删除 / 覆盖请求正文 | source owner 拥有业务真相,本仓只观察。 |
| raw body、secret、credential、full sensitive ref、raw log | redaction-first 和 forbidden body 边界明确禁止入仓。 |
| Governance decision、policy、gate、control、source audit truth 正文 | governance truth 或 source audit truth 不属于本仓。 |
| artifact body、evidence body、artifact version / lineage / baseline truth | Artifact / evidence owner 拥有正文和正式制品 truth。 |
| identity member、actor、role lifecycle、认证授权正文 | Identity / 安全入口拥有身份 truth。 |
| runtime execution truth、sandbox control truth、tool result body、raw prompt、provider response body | runtime / sandbox 拥有执行 truth 和控制边界。 |
| archive package、recovery body、长期正文保存、归档裁决 | archive 相关仓拥有归档包和恢复 truth。 |
| console UI state、dashboard layout、workspace view、sync private copy | 产品 / 展示 / 同步层拥有入口和视图状态。 |
| OTel / Prometheus / Grafana / TimescaleDB / external APM / GRC / alert sink 配置 truth | 外部产品或后续配置拥有产品配置,不能定义本仓 truth。 |
| final verdict、signoff、真实 `run_id`、真实 evidence alias、passed evidence | 真实测试与验收阶段产生,设计文档不得伪造。 |

### 4.5 哪些关系必须强一致?

强一致只用于 Observability 正式真相内部关系,以及正式真相与必要引用有效性的边界判断。准入、安全处置、关联、审计投影、证据关联、报告交接、留存和 no-write violation 不能被写成半成立状态。

| 强一致关系 | 原因 |
|---|---|
| 观测材料准入事实与安全处置语境 | 材料进入观察面必须同时有可解释安全判断,不得成为未判定正式材料。 |
| 安全处置语境与 redaction / safety marker | 输出和查询必须以安全标记为前置,否则 forbidden body 风险不可控。 |
| 来源与关联语境与 observation material | 观察材料必须能解释来源、关联和安全引用,否则不得成为正式 observation truth。 |
| 审计投影事实与来源 / 责任 / 缺口语境 | 只读审计投影必须可解释,不得形成孤立流水或冒充 source audit truth。 |
| body-free 证据关联事实与 evidence / artifact / digest 引用 | 证据关联必须明确 body-free 引用和缺口,不得半保存正文。 |
| safe log / metric / trace 与 redaction / correlation / degraded 语境 | 运行观察面必须和安全关联语境一致,不得以 raw signal 成立。 |
| report handoff fact 与 redaction / evidence linkage / authenticity hint | 报告交接必须携带脱敏、证据线索、缺口和真实性提示,不得静默生成验收材料。 |
| retention marker 与 active reference protection | 留存状态必须保护仍被引用的观察材料,不得误清活动引用。 |
| rebuild / replay fact 与 no-write guard | 重放 / 重建只能影响观察面和派生投影,必须与反写真相防线一致。 |
| no-write violation 与触发语境 | 违例记录必须绑定查询、诊断、维护、交接或导出的触发语境,不得成为不可解释警告。 |

### 4.6 哪些关系可以最终一致?

最终一致用于派生消费、查询视图、rollup、诊断摘要、报告摘要、外部审计导出、归档交接、外围消费、事件协作和外部快照刷新。这些关系可以延迟、重建或挂起,但不能反向改变 observation truth。

| 最终一致关系 | 原因 |
|---|---|
| observation truth 到只读查询结果 / diagnostic summary | 查询和诊断可延迟、重建或不可用,不得改变正式观察面。 |
| observation truth 到 rollup / metric aggregation / management report | 聚合和管理报表服务消费,不定义核心 truth。 |
| audit projection / evidence linkage 到 report handoff summary | 交接摘要可滞后或 blocked,但不改变投影和关联事实。 |
| retention marker 到 archive eligibility / handoff preparation | 归档准备可延迟,archive package 不归本仓。 |
| rebuild / replay fact 到派生投影刷新 | 派生投影可重建,不得修复 source truth。 |
| external source truth 到本仓安全摘要 / ref resolution | 上游摘要可能滞后,本仓只表达 stale / unresolved / missing。 |
| 事件协作输入 / 输出 | 事件传播和消费可延迟,但重复或乱序不能产生重复 observation truth。 |
| dashboard / alert / GRC / anomaly analysis material | 外围消费可延迟、丢失或降级,不影响核心闭环成立。 |

### 4.7 失败时靠什么口径约束、补偿或挂起?

| 失败类型 | 架构层处理口径 |
|---|---|
| Observability 主真相内部强一致失败 | 明确失败或保持原状态,不得写成部分完成或默认成功。 |
| redaction / safety marker 缺失 | 拒绝、隔离、挂起或标记 unsafe / quarantined,不得进入只读输出。 |
| source / bus / actor / evidence / runtime 引用不可解析 | 保持 missing / invalid / unresolved / gap,不得保存正文补齐。 |
| 外部快照缺失 / 过期 | 标记 stale / degraded / pending / waiting,不得补造外部 truth。 |
| 派生查询 / rollup / diagnostic / report 滞后 | 暴露 stale / rebuilding / unavailable,不得反写核心真相。 |
| report / acceptance handoff 失败 | 保留 blocked / pending / failed / retryable 语义,不得填写真实 run、evidence alias、verdict 或 signoff。 |
| archive handoff 或 archive 消费失败 | 保留待交接 / failed / pending 语义,不得接管 archive package 或 recovery body。 |
| event 重复 / 乱序 | 保持幂等、拒绝回退或挂起对账,不得生成重复投影、重复 handoff 或 sequence regression。 |
| rebuild / replay 缺少来源或越过边界 | 挂起、缩小范围或失败,不得修复、删除、覆盖或反写 source truth。 |
| 外部产品或外围消费者不可用 | 降级外围消费或导出,不得让产品状态影响 observation truth。 |

### 4.8 哪些数据边界如果不写清,后续最容易串仓?

最容易串仓的数据边界是:

1. Observation material 准入事实与 source truth 写入 / 修复 / 裁决。
2. Safety marker / redaction 与 raw body、secret、payload body、full sensitive ref。
3. Correlation context 与 opaque id、topic、route、label、dashboard 维度或业务 truth。
4. Audit projection 与 source audit truth、Governance decision、Artifact lineage。
5. Body-free evidence linkage 与 evidence body、artifact body、identity body。
6. Safe log / metric / trace 与 runtime / sandbox execution truth。
7. Query result / diagnostic summary 与业务修复、控制命令、治理裁决。
8. Report handoff / authenticity hint 与真实 `run_id`、真实 evidence alias、final verdict、signoff。
9. Retention marker / active reference protection 与 archive package、cleanup、recovery body。
10. Rebuild / replay / gap scan 与 source truth repair。
11. Dashboard / alert / GRC / external APM / storage 与 observation truth owner。

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `01_arch_step_08_data_ownership_consistency.md` 把 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等 schema 和字段写成结构化中间产物 | Step 08 应先判定数据归属和一致性口径,不应提前定义字段和 schema。 | 全部降级为 historical material,本步按 truth / projection / ref / forbidden body 重写。 |
| 旧 Step 08 `next_allowed_action=next_step_or_formal_assembly` | 与用户要求一个 Step 一个 Step 停审冲突,且 Step 08 后应等待 Step 09 确认。 | 改为 `wait_user_confirmation_before_step_09`。 |
| 旧 README 把 OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95、冷存和 hash chain 写成数据 / 一致性主结构 | 具名产品、指标和容量想象不是 Step 08 数据所有权结论。 | 只作为 historical material;产品选型、容量、NFR 和配置后移。 |
| 旧正式 `01-架构设计.md` 混写数据、存储、技术产品、schema、性能和实施假设 | 未经本轮 Step 01~08 停审,且会把存储实现和字段误写为所有权。 | Step 16 前不得继承旧正式正文。 |
| 需求 Step 11 提供了数据归属,但架构层仍需补一致性口径 | 需求层不展开强一致、最终一致、引用有效性和失败处理。 | 本步在需求归属基础上推导一致性策略。 |
| Step 05 本地影子层和 Step 06 派生承载容易被误读为 truth | 本地投影 / 派生承载存在不等于拥有正式 truth。 | 本步通过归属表和一致性表明确派生可延迟、可重建、不得反写。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据主语 | log / metric / trace / audit schema 和字段 | observation truth、快照 / 投影、引用和明确不拥有正文四类 | 架构层先判断归属,不提前进入对象模型或设施。 |
| 观测材料数据 | 旧内容偏记录字段 | 准入事实、安全处置、关联语境和安全标记作为正式真相 | 防止未安全材料进入正式 observation truth。 |
| 审计 / 证据数据 | 旧内容偏 audit event / evidence link 字段 | 审计投影、body-free 证据关联和缺口语境作为本仓 truth,正文明确排除 | 保护 source audit 和 evidence body 边界。 |
| 运行观察数据 | 旧内容偏 trace / metric 结构 | safe log / metric / trace 与 redaction / correlation 强一致,execution truth 明确排除 | 防止观察面冒充执行 truth。 |
| 交接 / 留存数据 | 旧内容偏 report record / retention marker 字段 | report handoff、authenticity hint、retention、active reference、rebuild 和 no-write truth 归属明确 | 防止伪证和反写真相。 |
| 一致性策略 | 旧内容没有归属到一致性推导 | 按数据归属推导强一致、最终一致、引用有效性、边界约束和失败口径 | 保持架构层粒度。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 log / metric / trace / audit schema 数据表 | 看似可落码。 | 会把 Step 08 拖进概要 / 详细设计,且旧字段会提前硬化。 | 不采用。 |
| 方案 B: 先按四类数据归属划边界,再推导一致性策略 | 能保护 observation truth,可支撑后续详细设计。 | 表格较长,后续仍需落对象 schema。 | 采用。 |
| 方案 C: 所有观察相关数据都强一致 | 语义最硬。 | 外部快照、派生查询、report、archive、GRC 和 dashboard 会难以实现。 | 不采用。 |
| 方案 D: 所有数据都最终一致 | 起步简单。 | 会破坏准入、安全处置、审计投影、report handoff、retention 和 no-write 主真相。 | 不采用。 |
| 方案 E: 把外部 APM / TimescaleDB / Grafana / 对象存储写成 truth source | 接近旧实现想象。 | 会让技术设施和外部产品反向定义 observation truth。 | 不采用。 |
| 方案 F: 把 report handoff 写成真实验收 evidence | 容易服务验收材料。 | 会伪造真实 run、evidence alias、final verdict 或 signoff。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| raw log / trace / metric body 是否进入 Observability truth | A. 进入;B. 不进入,只保留安全观察面事实和安全摘要 | B | redaction-first 和 forbidden body 是硬边界。 |
| evidence / artifact body 是否进入证据关联 truth | A. 进入;B. 不进入,只保留 body-free ref、digest 线索和缺口 | B | 证据正文和制品正文归 Artifact / evidence owner。 |
| runtime / sandbox execution truth 是否进入 safe signal truth | A. 进入;B. 不进入,只保留安全运行观察面 | B | log / metric / trace 不得裁决执行结果。 |
| report handoff 是否可以生成 final verdict / signoff | A. 可以;B. 不可以,只交接观察线索、脱敏状态、缺口和真实性提示 | B | 真实验收只能来自真实测试和验收阶段。 |
| query / diagnostic / rollup / dashboard 是否可以作为观察面写源 | A. 可以;B. 不可以,只能派生 | B | 派生消费和维护结果可延迟、可重建,不得成为第二 truth。 |
| OTel / Prometheus / Grafana / TimescaleDB 是否进入当前数据所有权主链 | A. 进入;B. 不进入,仅作为后续技术或外围增强候选 | B | 当前核心是产品中立 observation truth。 |

---

## 8. 结构化中间产物

### 8.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| 观测材料准入事实 | 正式真相数据 | 由 Observability 拥有材料在观察语境中被接受、拒绝、隔离或降级的事实。 | 不等于 source truth 写入、业务修复、执行成功或治理裁决。 |
| 观测材料安全处置语境 | 正式真相数据 | 由 Observability 拥有 redaction、safety marker、隔离 / 拒绝原因和可审计安全判断。 | 安全标记不能成为保存 raw body、secret 或 full sensitive ref 的理由。 |
| 来源与关联语境 | 正式真相数据 | 由 Observability 拥有观察材料的来源、关联、causation 和 safe ref 解释语境。 | 不拥有来源对象正文,也不得从 opaque id 反推业务 truth。 |
| 审计投影事实 | 正式真相数据 | 由 Observability 拥有安全观察材料形成只读审计投影的事实。 | 不等于 Governance decision、source audit truth 或 Artifact lineage。 |
| body-free 证据关联事实 | 正式真相数据 | 由 Observability 拥有证据关联成立、缺失、不可见、digest 线索和消费目的。 | 不保存 evidence body、artifact body 或身份 / 治理正文。 |
| 安全日志观察面 | 正式真相数据 | 由 Observability 拥有已安全表达的日志观察事实。 | 不拥有 raw log body、payload body 或 provider response body。 |
| 安全指标观察面 | 正式真相数据 | 由 Observability 拥有已安全表达的指标观察和聚合事实。 | 不拥有业务状态、执行结果或源系统指标配置 truth。 |
| 安全追踪观察面 | 正式真相数据 | 由 Observability 拥有已安全表达的 trace / span 观察关联。 | 不拥有 runtime / sandbox execution truth。 |
| 观察输出降级 / 不可见事实 | 正式真相数据 | 由 Observability 拥有 missing、degraded、blocked、not-visible 和 unsafe output 事实。 | 空结果、不可见或降级不得被消费方补造成事实。 |
| 报告交接事实 | 正式真相数据 | 由 Observability 拥有 report handoff、evidence index input、交接阻塞、完成或撤销事实。 | 不生成 final verdict、真实 run、真实 evidence alias 或 signoff。 |
| 证据真实性提示 | 正式真相数据 | 由 Observability 拥有区分真实执行证据、待补齐材料和设计期占位的观察面提示事实。 | 提示不等于真实 evidence 本体或验收签署。 |
| retention marker | 正式真相数据 | 由 Observability 拥有 hold、release、conflict、archive eligibility 和留存状态。 | 不等于 archive package、recovery body 或长期正文保存。 |
| active reference protection | 正式真相数据 | 由 Observability 拥有观察材料仍被审计、诊断、报告、留存、重放或合法保留引用的保护事实。 | 不得被 cleanup、archive 或重建路径绕过。 |
| 观察面重放 / 重建事实 | 正式真相数据 | 由 Observability 拥有观察面和派生投影重放 / 重建的范围、原因、影响和缺口事实。 | 不修复、删除、覆盖或反写 source truth。 |
| no-write violation 记录 | 正式真相数据 | 由 Observability 拥有查询、诊断、维护、重建、报告交接或导出试图写入 source truth 的违例事实。 | 不等于 source owner 已修复或业务状态已改变。 |
| 输入来源安全摘要 | 快照 / 投影数据 | Observability 可为准入、关联和解释保留 source owner、bus、runtime 或 sandbox 的安全摘要。 | 外部正式 truth 仍归来源 owner。 |
| 审计投影安全摘要 | 快照 / 投影数据 | 由 audit projection 派生,服务报告、审查和外围消费。 | 摘要不得替代 source audit 或 governance truth。 |
| 运行状态安全摘要 / metric rollup | 快照 / 投影数据 | 由 safe signal 派生,服务诊断、管理报表和长期分析。 | 不形成业务状态或 execution truth。 |
| 只读观测查询结果语境 | 快照 / 投影数据 | 由 observation truth 派生,服务只读查询和消费。 | 查询结果可过期、可重建,不得反写真相。 |
| 只读诊断摘要 | 快照 / 投影数据 | 由 safe signal、gap、audit projection 和 evidence linkage 派生。 | 诊断摘要不下发控制命令,不修复 source truth。 |
| 报告交接摘要 / 缺口说明 | 快照 / 投影数据 | 由 report handoff fact、audit projection 和 evidence linkage 派生。 | 不生成最终裁决或真实验收材料。 |
| 重放 / 留存影响摘要 | 快照 / 投影数据 | 由 retention marker、rebuild / replay fact 和 no-write guard 派生。 | 摘要不修改 source truth 或 archive package。 |
| dashboard / alert / management report / GRC export / anomaly analysis material | 快照 / 投影数据 | 由安全摘要和派生投影输出,服务外围消费。 | 外围消费可延迟、可降级,不得成为 truth source。 |
| 产品中立外部能力候选摘要 | 快照 / 投影数据 | 可记录采集、存储、展示、导出或 APM 候选能力的接入语境。 | 不拥有外部产品配置 truth。 |
| source owner / bus material / payload carrier 引用 | 引用关系数据 | Observability 只保存对 source owner、bus material 或 payload owner 的引用关系。 | 引用存在不代表拥有 source truth、bus 主干或 payload 正文。 |
| actor / subject safe ref | 引用关系数据 | Observability 只保存对 actor / subject 的安全引用关系。 | 引用存在不代表拥有 identity lifecycle 或 auth truth。 |
| Governance / policy / gate / control 引用 | 引用关系数据 | Observability 只保存对 governance 语境的引用关系。 | 引用存在不代表拥有 governance decision。 |
| Artifact / evidence / baseline / integrity 引用 | 引用关系数据 | Observability 只保存对 artifact、evidence、baseline 或完整性线索的引用关系。 | 引用存在不代表拥有 artifact / evidence body。 |
| runtime / sandbox source ref | 引用关系数据 | Observability 只保存对 runtime / sandbox 来源的引用关系。 | 引用存在不代表拥有 execution truth 或 sandbox control truth。 |
| archive / report / external audit handoff ref | 引用关系数据 | Observability 只保存对 archive、report、external audit 或 GRC 消费边界的引用关系。 | 引用存在不代表拥有 archive package、report verdict 或 GRC truth。 |
| SDK / console / dashboard / alert consumer ref | 引用关系数据 | Observability 只保存对只读消费方或外围消费者的引用关系。 | 引用存在不代表拥有 UI state 或消费方私有状态。 |
| external product capability ref | 引用关系数据 | Observability 只保存对外部产品候选能力的接入引用。 | 引用存在不代表拥有 OTel、Prometheus、Grafana、TimescaleDB、APM 或 GRC 配置 truth。 |
| source business truth / business payload / source repair body | 明确不拥有的正文 / 真相 | 这些正文或主真相由 source owner 拥有。 | 只能被引用、摘要或观察,不能进入本仓正文真相。 |
| raw body / secret / credential / full sensitive ref / raw log | 明确不拥有的正文 / 真相 | 这些内容被 redaction-first 和 forbidden body 边界明确排除。 | 不得保存为日志、附件、报告、投影或调试材料。 |
| Governance decision / source audit truth 正文 | 明确不拥有的正文 / 真相 | 治理裁决和 source audit truth 由对应 owner 拥有。 | audit projection 不得替代正式裁决或 source audit 正文。 |
| artifact body / evidence body / artifact lineage truth | 明确不拥有的正文 / 真相 | 制品 / 证据正文和血缘 truth 由 Artifact / evidence owner 拥有。 | body-free evidence linkage 不得保存正文。 |
| identity member / actor / role lifecycle / auth truth | 明确不拥有的正文 / 真相 | 身份生命周期和认证授权由 Identity / 安全入口拥有。 | actor / subject safe ref 不等于身份正文。 |
| runtime execution / sandbox control / tool result / raw prompt / provider response body | 明确不拥有的正文 / 真相 | 运行和 sandbox 边界拥有执行 truth 和控制 truth。 | safe signal 不得裁决执行结果。 |
| archive package / recovery body / long-term body store | 明确不拥有的正文 / 真相 | Archive 相关仓拥有归档包、恢复正文和长期正文保存。 | retention marker 不得升级为归档包 ownership。 |
| console UI state / dashboard layout / workspace view / sync private copy | 明确不拥有的正文 / 真相 | 产品、展示和同步层拥有入口状态或私有视图。 | 只读消费不得反向定义 observation truth。 |
| external product / APM / storage / GRC / alert system config truth | 明确不拥有的正文 / 真相 | 外部产品和配置 truth 不属于本仓。 | 产品配置不得反向定义观察语义。 |
| final verdict / signoff / real run_id / real evidence alias / passed evidence | 明确不拥有的正文 / 真相 | 真实测试与验收阶段产生这些材料,设计文档不得伪造。 | report handoff 只提供真实性提示和交接线索。 |

### 8.2 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 观测材料准入事实与安全处置语境 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 明确失败、拒绝、隔离或保持原状态,不得默认成功 | 正式 observation material 必须同时具备准入和安全语境。 |
| 安全处置语境与 redaction / safety marker | 正式真相数据 ↔ 正式真相数据 | 强一致 | 安全标记缺失时不得进入只读输出或报告交接 | 防止 forbidden body 和未脱敏材料泄漏。 |
| 来源与关联语境与 observation material | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 强一致 + 引用有效性一致 | 引用不可解析时标记 unresolved / gap 或挂起,不得补造来源 | 观察材料必须可解释来源和关联。 |
| 审计投影事实与来源 / 责任 / 缺口语境 | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 强一致 + 引用有效性一致 | 缺少可解释来源或责任语境时不得形成正式投影 | 防止 audit projection 冒充 source audit truth。 |
| body-free 证据关联事实与 evidence / artifact / digest 引用 | 正式真相数据 ↔ 引用关系数据 | 强一致 + 引用有效性一致 | 引用缺失时保留 missing / not-visible / gap,不得保存 evidence body 补齐 | 证据关联必须 body-free 且可追溯。 |
| safe log / metric / trace 与 redaction / correlation / degraded 语境 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 安全关联语境缺失时拒绝、降级或隔离观察输出 | 运行观察面不能以 raw signal 成立。 |
| report handoff fact 与 redaction / evidence linkage / authenticity hint | 正式真相数据 ↔ 正式真相数据 / 快照 / 投影数据 / 引用关系数据 | 强一致 + 引用有效性一致 | 脱敏、证据线索或真实性提示不闭合时 handoff blocked / pending | 防止 report handoff 伪造成真实验收材料。 |
| retention marker 与 active reference protection | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 强一致 | 活动引用未闭合时不得释放或清理 | 防止误清仍被审计、诊断、报告或合法保留引用的材料。 |
| rebuild / replay fact 与 no-write guard | 正式真相数据 ↔ 正式真相数据 | 强一致 | 范围、原因或 no-write guard 不闭合时挂起或失败 | 重放 / 重建只能作用于观察面和派生投影。 |
| no-write violation 与触发语境 | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 强一致 + 引用有效性一致 | 触发语境不可解释时保留不可见 / unresolved,不得静默丢弃 | 违例必须可审计且不能被当作 source 修复完成。 |
| external source truth 到本仓安全摘要 | 明确不拥有的正文 / 真相 ↔ 快照 / 投影数据 | 最终一致 + 边界约束一致 | 标记 stale / unresolved / missing / degraded,不得复制正文补齐 | 本地摘要只服务观察和解释。 |
| observation truth 到只读查询 / diagnostic / rollup / report / GRC export | 正式真相数据 ↔ 快照 / 投影数据 | 最终一致 + 只读一致 | 暴露 stale / rebuilding / unavailable,不得反写真相 | 派生消费可延迟和重建。 |
| observation truth 到 archive handoff / external audit / report consumer | 正式真相数据 ↔ 快照 / 投影数据 / 引用关系数据 | 最终一致 + 边界约束一致 | 保留 pending / blocked / failed / retryable,不得接管外部正文或签署 | 交接失败不能改变本仓 truth。 |
| 外部对象 / 外部正文引用有效性 | 引用关系数据 ↔ 明确不拥有的正文 / 真相 | 引用有效性一致 | 保持 missing / invalid / unresolved / not-visible,或挂起相关投影 / handoff | 引用成立不等于正文归属转移。 |
| 事件协作重复或乱序 | 正式真相数据 / 快照 / 投影数据 / 引用关系数据 | 幂等一致 + 顺序约束 | 重复输入返回同一结果或忽略;乱序不得回退状态 | 防止重复投影、重复 handoff、重复 violation 或 sequence regression。 |
| 查询 / 诊断 / 报告 / 导出 / 重建维护 | 快照 / 投影数据 ↔ 正式真相数据 | 只读一致 + 不反写真相 | 维护失败只影响派生状态,不得推进 source owner 或 observation core truth | 读 / 维护路径不能成为业务写源。 |
| 明确不拥有正文被请求写入 Observability | 明确不拥有的正文 / 真相 ↔ 正式真相数据 | 边界约束一致 | 拒绝、隔离、挂起或转换为引用 / 摘要 / safe summary,不得保存为 Observability truth | 这是防止串仓和 forbidden body 入仓的最高优先级边界。 |

### 8.3 按架构单元组织的数据所有权表

| 架构单元 | 拥有 truth | 只持有 snapshot / projection | 只持有 reference | forbidden body / forbidden write | 停审结果 |
|---|---|---|---|---|---|
| `Observability 核心语义角色` | 准入、安全处置、关联、审计投影、body-free evidence linkage、safe signal、report handoff、authenticity hint、retention、rebuild、no-write violation | 不直接拥有派生消费材料 | 必要外部 ref 的语义占位 | raw body、source truth、evidence body、execution truth、archive package、final verdict | pass |
| `Observability 编排 / 承接角色` | 不独立拥有 truth,只推动核心语义形成正式变化 | intake summary、query context、diagnostic summary、handoff summary、maintenance summary | source / bus / actor / evidence / runtime / archive refs | 绕过核心写 truth;把外部正文原文写入核心;向 source truth 反写 | pass |
| `外部能力接缝角色` | 不拥有 Observability truth | 外部 safe summary、snapshot、stale / pending / gap 状态 | 外部对象、外部正文和交接 ref | 相邻仓正文入仓;运行期结果直接变 observation truth | pass |
| `派生消费辅助角色` | 不拥有核心 truth | query、rollup、diagnostic、report、dashboard、alert、GRC export、analysis material | 下游消费 / archive / report / external audit refs | 派生结果反写 observation truth;私有副本替代核心 truth | pass |
| `技术承载角色` | 不定义 observation truth,只承载正式 truth / derived material | storage / index / cache / event / collector / dashboard / export support 的承载材料 | product capability、storage backend、event / trace handoff refs | 技术产品定义观察语义;外部产品配置成为 truth owner | pass |

### 8.4 简化关系示意图

```text
+====================================================================+
|                    L4-observability 数据边界                       |
|                                                                    |
|   +------------------------------+                                 |
|   | 正式真相数据                 |                                 |
|   | observation / audit / handoff |                                 |
|   | retention / no-write truth   |                                 |
|   +---------------+--------------+                                 |
|                   | 派生 / 回链                                     |
|                   v                                                 |
|   +---------------+--------------+      +-------------------------+ |
|   | 快照 / 投影数据              |      | 引用关系数据            | |
|   | query / rollup / report      |      | refs / handoff links    | |
|   | diagnostic / export          |      | source / evidence refs  | |
|   +---------------+--------------+      +------------+------------+ |
|                   | 不反写                           | 只引用        |
+===================+==================================+=============+
                    |                                  |
                    v                                  v
        明确不拥有的外部正文 / 外部主真相
        source / bus / identity / governance / artifact
        evidence / runtime / sandbox / archive / console
        external APM / GRC / verdict / signoff
```

图示说明:

- `正式真相数据` 是 `L4-observability` 唯一可以主张拥有的观察面真相。
- `快照 / 投影数据` 和 `引用关系数据` 可以本地存在,但不能反写核心真相或吸收外部正文。
- `明确不拥有的外部正文 / 外部主真相` 只能通过引用、摘要、safe summary、gap 或 Observability 自身结论参与。
- 该图不表达存储设计、同步流程、事件流、对象模型或事务边界。

### 8.5 数据所有权停审记录

| 架构单元 | truth 是否唯一 | projection / cache 是否禁止反写 | external body 是否禁止保存 | 一致性口径是否清楚 | 停审结果 |
|---|---|---|---|---|---|
| `Observability 核心语义角色` | pass | pass | pass | pass | pass |
| `Observability 编排 / 承接角色` | pass | pass | pass | pass | pass |
| `外部能力接缝角色` | pass | pass | pass | pass | pass |
| `派生消费辅助角色` | pass | pass | pass | pass | pass |
| `技术承载角色` | pass | pass | pass | pass | pass |

### 8.6 跨数据边界审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在双真相 | pass | observation material、audit projection、body-free evidence linkage、report handoff、retention 和 no-write truth 均由 Observability 拥有,相邻仓只提供来源或消费。 |
| 是否存在投影反写真相 | pass | query、rollup、diagnostic、report、dashboard、alert、GRC export、analysis 和 archive handoff 均不得反写核心或 source truth。 |
| 是否存在引用正文入仓 | pass | source body、payload、evidence body、artifact body、identity body、governance body、runtime body、archive package、provider response 和 external product config 均明确不拥有。 |
| 是否存在强一致 / 最终一致误用 | pass | 核心 truth 内部强一致;外部快照、派生消费、显化和交接最终一致。 |
| 是否存在失败补偿口径冲突 | pass | 失败时按 explicit failure、quarantine、gap、pending、stale、unresolved、blocked、retryable、拒绝或挂起处理,不伪造 truth。 |
| 是否存在旧技术机制污染 | pass | schema 字段、hash chain 分片、冷存期限、TimescaleDB、Grafana、Prometheus、OTel、object storage、outbox、consumer group 均未作为本步正式机制。 |
| 是否存在真实 evidence / signoff 污染 | pass | final verdict、signoff、真实 run_id、真实 evidence alias 和 passed evidence 均明确不拥有。 |
| 是否存在后续详细设计承接风险 | pass | 本步未写字段、表、schema、event payload、outbox、事务、repository、adapter 或具体存储产品。 |

### 8.7 数据边界说明

`L4-observability` 的数据所有权边界是“拥有观察面事实、审计投影、body-free 证据关联、报告交接、留存和 no-write 事实,本地保留查询 / 诊断 / 报告 / 外围消费辅助,引用外部对象和材料,明确排除外部正文与相邻仓主真相”。Observation material、safety decision、correlation context、audit projection、safe signal、report handoff、authenticity hint、retention marker、rebuild fact 和 no-write violation 属于 Observability;source、identity、governance、artifact、evidence、runtime、sandbox、archive、console、external APM、GRC、final verdict 和 signoff 正文不属于 Observability。快照、投影、rollup、诊断、报告、dashboard、alert、GRC 导出和长期分析可以提升消费、解释和交接能力,但它们的延迟、失效或重建不能改变正式观察面事实。后续设计如果需要写字段、表、事件、补偿、索引、存储或外部产品配置,必须从本章归属和一致性口径继续下沉,不能反向修改本章边界。

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 9. 数据所有权与一致性策略

> 校准来源:
> - `design-calibration/01_arch_step_08_data_ownership_consistency.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“数据归属表”“一致性策略表”“按架构单元组织的数据所有权表”“简化关系示意图”和“跨数据边界审计表”小节,了解本章如何先确认数据归属,再推导一致性策略。

### 9.1 数据归属表

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §8.1。

### 9.2 一致性策略表

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §8.2。

### 9.3 按架构单元组织的数据所有权表

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §8.3。

### 9.4 简化关系示意图

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §8.4。

### 9.5 数据边界说明

摘录 `design-calibration/01_arch_step_08_data_ownership_consistency.md` §8.7。
```

---

## 10. 待确认事项

本步不新增阻塞 Step 09 的待确认事项。下列事项进入后续 Step,不得在 Step 08 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|
| `Q-OBS-ARCH-008-001` | observation material、safe signal、audit projection、body-free evidence linkage、report handoff 和 retention marker 的正式对象 / schema / 字段 | 后续概要 / 详细设计、配置设计和测试方案收敛。 |
| `Q-OBS-ARCH-008-002` | redaction、safety marker、accepted / rejected / quarantined / degraded 的具体状态机和配置来源 | 后续关键交互、横切关注点、配置和验收收敛。 |
| `Q-OBS-ARCH-008-003` | digest、canonicalization、hash linkage、gap scan 和 integrity hint 的算法与测试口径 | 后续技术选型、详细设计和测试方案收敛。 |
| `Q-OBS-ARCH-008-004` | query、rollup、diagnostic、report handoff、GRC export 和 dashboard 的正式 read surface | 后续 Step 09、概要 / 详细设计和配置设计收敛。 |
| `Q-OBS-ARCH-008-005` | archive / report / external audit handoff 的交接协议、失败语义和 evidence 形态 | 后续 Step 09、测试方案、验收标准和实施计划收敛。 |
| `Q-OBS-ARCH-008-006` | OTel、Prometheus、Grafana、TimescaleDB、对象存储、external APM、GRC 或 alert sink 的技术与配置边界 | 后续 Step 10、配置设计、测试方案和实施计划收敛。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确正式真相数据、快照 / 投影数据、引用关系数据和明确不拥有正文 | pass | §8.1 已按四类数据归属列出。 |
| 是否说明每类数据为什么属于当前归属边界 | pass | §8.1 / §8.7 已给出归属和边界说明。 |
| 是否明确不同数据关系的一致性口径 | pass | §8.2 已区分强一致、最终一致、引用有效性、幂等一致、只读一致和边界约束。 |
| 是否明确一致性暂时不成立时的架构层处理原则 | pass | §4.7 / §8.2 已给出 explicit failure、quarantine、gap、pending、stale、unresolved、blocked、retryable、拒绝或挂起口径。 |
| 是否按架构单元完成数据所有权停审 | pass | §8.3 / §8.5 已逐项通过。 |
| 是否完成跨数据边界审计 | pass | §8.6 未发现双真相、投影反写、引用正文入仓或一致性冲突。 |
| 是否避免数据库、缓存 / 投影 / outbox、事务、协议或代码模型细节 | pass | 未写字段、表、DDL、event payload、repository、adapter、事务脚本或重试实现。 |
| 是否保持 report handoff 与 evidence authenticity 的真实性边界 | pass | 未生成真实 run、evidence alias、final verdict、signoff 或测试结果。 |
| gate_status | pass | 当前 Step 08 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_09 | 必须等待用户确认后才允许进入 Step 09 `关键交互与通信方式`。 |

当前 Step 08 `数据所有权与一致性策略` 已完成。下一步必须等待用户确认后进入 Step 09 `关键交互与通信方式`,并只创建 / 改写 `design-calibration/01_arch_step_09_interactions_communication.md`。
