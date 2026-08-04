# L4-observability 01-架构设计 Step 09 · 关键交互与通信方式

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 9
> 回填章节: `01-架构设计.md` §10 关键交互与通信方式
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 10

---

## 1. 本步目标

明确 `L4-observability` 在正式边界上的关键交互场景分别适合同步请求 / 响应、异步事件 / 回调,还是后台任务 / 延后承接,并说明失败时的架构层降级或挂起口径。

本步只回答通信方式类别和边界理由,不写 API 路径、接口名、事件名、callback 名、topic 名、DTO、schema、协议选型、队列产品、outbox、transaction、重试实现、调度配置、handler / consumer / publisher 或内部处理步骤。本步尤其不把旧 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等 schema 名称当成交互主语。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | 当前台账显示 Step 08 已完成,用户已确认进入 Step 09 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~08 pass,Step 09 blocked by user confirmation | 确认本轮只允许推进 Step 09。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 03 已完成 | 提供做 / 不做、易混淆职责、report handoff、retention 和 no-write 红线。 |
| `design-calibration/01_arch_step_04_system_context.md` | Step 04 已完成 | 提供正式上下文对象、输入 / 输出面和依赖失效降级口径。 |
| `design-calibration/01_arch_step_05_bounded_context.md` | Step 05 已完成 | 提供核心子域、支撑上下文、本地索引 / 投影 / 引用层。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | Step 06 已完成 | 提供同步入口、异步观察材料消费、后台维护交接、观察面真相承载和派生交接承载。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | Step 07 已完成 | 提供核心语义、编排承接、外部接缝、派生辅助、技术承载和跨仓依赖裁剪口径。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | Step 08 已完成 | 提供 truth / snapshot / ref / forbidden body、一致性策略、失败处理和不得反写真相口径。 |
| `projects/L4-observability/00-需求文档.md` §7 / §9 / §10 / §11 / §12 / §13 / §14 / §15 | 正式需求基线已完成 | 校验核心闭环、功能要求、规则、数据归属、接口依赖、NFR、验收和风险。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 9 | 已读取 | 控制本步必须输出关键交互、通信方式、失败降级、边界约束、停审和跨交互边界审计。 |
| `standards/document/架构设计书写规范.md` §4.10 | 已读取 | 控制关键交互场景表、通信方式判断表、简化交互示意图和边界说明写法。 |
| `projects/L1-governance/design-calibration/01_arch_step_09_interactions_communication.md` | 已读取 | 参考“场景先行 + 方式判断 + 失败口径 + 停审审计”的组织方式。 |
| `projects/L1-artifact/design-calibration/01_arch_step_09_interactions_communication.md` | 已读取 | 参考 truth 收口、外部结果送达、后台派生和交接边界的粒度。 |
| 旧 `design-calibration/01_arch_step_09_interactions_communication.md` | historical material,已被本文件替换 | 仅作为 schema 清单和错误门禁诊断来源,不继承旧交互结论。 |
| 旧 `projects/L4-observability/README.md` 与旧 `01-架构设计.md` | historical material | 仅作为旧接口、旧产品栈、旧指标、旧事件和旧实现假设诊断来源。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 03~08、SOP Step 9 和书写规范 4.10 | done | 本文件 §2 |
| 读取需求接口 / NFR / 验收边界、旧 Step 09、旧正式 01 和 L1 参考 Step 09 | done | 本文件 §2 / §5 |
| 回答同步、异步、后台、正式边界、失败降级和协议细节风险问题 | done | 本文件 §4 |
| 输出关键交互场景表、通信方式判断表、按架构单元组织的交互方式表和简化交互示意图 | done | 本文件 §8 |
| 完成交互方式停审和跨交互边界审计 | done | 本文件 §8.5 / §8.6 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 09 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 哪些交互适合同步能力边界?

需要在一个正式边界上即时得到安全可见性、准入、读取、交接状态、留存保护或 no-write 判断的交互适合同步请求 / 响应类交互。这些交互的共同点是调用方不能先假定成功,再由后台补出 observation truth、report handoff、retention marker 或安全可见性。

适合同步收口的场景包括:

| 同步场景 | 同步原因 |
|---|---|
| 受控观测材料准入判断 | 外部提交、管理触发或受控补录材料必须立即得到 accepted / rejected / quarantined / degraded / pending / unresolved 语义,不能默认入仓。 |
| 安全观察面查询与可见性判断 | SDK、console、source owner、runtime / sandbox 或审计入口读取观察面时,必须立即判断授权、redaction、not-visible、stale、unavailable 或缺口语义。 |
| 只读诊断与缺口解释读取 | 诊断消费者需要即时知道可见诊断摘要、缺口、降级和不可用原因,但不能把诊断读写成业务修复或执行控制。 |
| report handoff 状态读取 / 受控触发 | 报告或验收消费方需要即时知道交接是否 ready、blocked、pending、failed、not-visible 或缺少真实性提示。 |
| retention / active reference protection 判断 | 清理、归档准备、重放或合法保留相关入口必须即时确认 hold、release、conflict、archive eligibility 或 active reference。 |
| no-write guard 与受控维护触发判断 | 查询、诊断、报告、导出、重建或维护触发必须立即判断是否越过 source truth 写边界。 |
| 安全引用 / 关联语境可解析性读取 | actor / subject、governance、artifact / evidence、runtime / sandbox、archive / report safe ref 的可见性和缺口需要即时表达。 |

同步返回成功只能表示该同步边界内的 Observability 判断已经成立,不能代表 source truth 已写入、业务已修复、治理已裁决、execution truth 已改变、证据正文已存在、归档包已生成或验收已签署。

### 4.2 哪些交互适合异步事件?

已经在来源边界成立的观察材料、审计语境、安全摘要、运行信号、证据线索或外部结果送达 Observability,以及已经在 Observability 成立的观察面事实向消费方传播,适合异步事件 / 回调类交互。

适合异步承接的场景包括:

| 异步场景 | 异步原因 |
|---|---|
| source / bus observation material 送达 | 来源材料通常来自事件协作或运行观察材料入口,不应阻塞 source owner 的主写路径。 |
| identity / governance / artifact / runtime / sandbox 观察语境送达 | 相邻 truth owner 已成立的安全引用、摘要、缺口、审计线索或运行观察信号可异步送达。 |
| evidence linkage 线索 / 缺口送达 | body-free evidence ref、digest 线索、not-visible 或 gap 可异步进入,但 evidence body 不入仓。 |
| 已成立 observation truth 变化传播 | 安全观察面、审计投影、retention marker、handoff 状态或 no-write violation 的变化可异步通知消费方。 |
| report / archive / external audit / GRC handoff 送达 | 交接材料和导出准备可以异步传播,消费失败不能回滚本仓 truth。 |
| alert / dashboard / anomaly analysis 外围消费感知 | 外围消费者只需要感知安全摘要或告警线索,不得要求核心同步等待全部消费完成。 |

异步交互表达的是事实送达、变化感知或消费通知,不是事件名、topic、订阅目录、投递顺序、队列产品或 outbox 机制。异步送达失败只能形成待送达、failed、retryable、handoff-pending、stale、unresolved 或 gap,不能补造 observation truth 或外部 truth。

### 4.3 哪些交互适合后台任务或补偿路径?

派生视图、rollup、诊断摘要、查询投影、gap scan、引用刷新、report handoff material、evidence index input、retention 扫描、active reference protection 检查、rebuild / replay、外部审计导出准备、dashboard / alert / anomaly material 和长期分析材料适合后台任务 / 延后承接类交互。

这些交互可以延迟、挂起、重建或重试,但只能维护本仓 observation truth 的派生结果、解释状态、消费摘要、缺口报告或交接材料。后台任务不得创建 source business truth、Governance decision、Artifact lineage、Identity truth、runtime execution truth、sandbox control truth、archive package、final verdict、真实 evidence alias 或 signoff。

### 4.4 哪些交互必须经过总线或正式边界,不能直接穿透?

跨仓观察材料输入、相邻 truth owner 安全引用输入、runtime / sandbox 观察信号输入、evidence linkage 线索输入、Observability truth 变化传播、report / archive / external audit / GRC handoff、SDK / console 只读访问、dashboard / alert / anomaly 外围消费和维护 / 重建触发,都必须经过正式同步入口、异步观察材料消费边界、外部能力接缝、派生消费边界或交接边界。

下列对象不能直接穿透写 `Observability 核心语义角色` 或观察面真相承载:

| 不能穿透对象 | 禁止原因 |
|---|---|
| `L0-bus` 主干 | bus publish / subscribe / ack / retry / replay 不拥有 observation truth。 |
| source owner / runtime / sandbox 正文 | source truth、execution truth、tool result、raw prompt 和 provider response 不归本仓。 |
| identity / governance / artifact 私有 truth | actor lifecycle、governance decision、artifact lineage、evidence body 不归本仓。 |
| SDK / console / dashboard / alert / GRC / report consumer | 入口、展示、外围消费和外部工具不能反向定义 observation truth。 |
| storage / cache / search / APM / OTel / Prometheus / Grafana / TimescaleDB / object storage | 技术产品、存储模型和配置不能定义本仓观察语义。 |
| archive package / recovery body / final signoff | 归档正文、恢复正文、最终裁决和签署不归本仓。 |

### 4.5 关键依赖失效时,本仓如何降级或挂起?

| 依赖 / 场景失效 | 降级 / 挂起口径 |
|---|---|
| 同步准入 / 查询 / handoff / retention 判断失败 | 明确失败、拒绝、not-visible、blocked、pending、unavailable 或保持原状态,不得默认成功。 |
| `L0-core` shared ref / safety marker 缺失 | 阻塞正式观察材料成立或进入 rejected / quarantined / unresolved,不得建立私有替代契约。 |
| `L0-bus` 或 source material 未送达 | 保持 missing / pending / gap,不得补造已观察事实。 |
| identity / governance / artifact / evidence 引用不可解析 | 保持 unresolved / not-visible / gap,不得保存外部正文补齐。 |
| runtime / sandbox 观察信号缺失或过期 | 标记 missing / stale / degraded,不得从 log / metric / trace 推断 execution truth。 |
| 异步输入重复、乱序或过期 | 幂等识别、拒绝回退或挂起对账,不得生成重复 observation truth、handoff 或 no-write violation。 |
| 派生查询 / rollup / diagnostic / dashboard 滞后 | 返回 stale / rebuilding / unavailable 或旧视图,不得反写核心 truth。 |
| report / archive / external audit / GRC 交接失败 | 保留 pending / blocked / failed / retryable / handoff-pending,不得生成真实 run、evidence alias、final verdict 或 signoff。 |
| retention / cleanup / replay 与 active reference 冲突 | 保留 hold / conflict / blocked 或缩小重建范围,不得误清活动引用材料。 |
| 外部产品或外围消费者不可用 | 降级外围消费或导出,不得影响 observation truth 成立。 |
| 维护 / 重建请求越过 no-write 边界 | 拒绝、记录 no-write violation 或挂起审计,不得修复、删除、覆盖或反写 source truth。 |

### 4.6 哪些通信口径若不先写清,后续最容易误入协议细节?

最容易误入协议或实现细节的口径是:

1. 把 observation material 准入写成 API / command 清单,而不是同步安全准入边界。
2. 把 source / bus observation material 送达写成 topic、event schema、consumer group 或 outbox 机制。
3. 把 safe log / metric / trace 观察面写成 raw signal、runtime execution truth 或外部 APM 数据模型。
4. 把 audit projection 写成 Governance decision、source audit truth 或 artifact lineage 同步接口。
5. 把 evidence linkage 写成 evidence body 同步、artifact body 复制或 digest 算法实现。
6. 把 report handoff 写成报告生成时序、真实 `run_id`、真实 evidence alias、final verdict 或 signoff。
7. 把 retention / active reference protection 写成 cleanup 脚本、TTL、归档包格式或恢复流程。
8. 把 query / diagnostic / rollup / dashboard / alert / GRC export 写成核心写路径或同步成功条件。
9. 把 rebuild / replay / gap scan 写成 source truth repair 或跨仓补偿事务。
10. 把 OTel / Prometheus / Grafana / TimescaleDB / 对象存储写成通信方式结论,而不是后续技术候选。

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `01_arch_step_09_interactions_communication.md` 把 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection`、`RedactionDecision`、`CorrelationContext` 等写成交互收口 | Step 09 应判断关键交互场景和通信方式,不应提前定义 schema 或对象字段。 | 全部降级为 historical material,本步改按场景 / 边界 / 通信方式 / 失败口径重写。 |
| 旧 Step 09 `next_allowed_action=next_step_or_formal_assembly` | 与用户要求一个 Step 一个 Step 停审冲突,且 Step 09 后应等待 Step 10 确认。 | 改为 `wait_user_confirmation_before_step_10`。 |
| 旧 README 把 OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95、事件数量、冷存和 hash chain 写成交互和运行假设 | 产品、指标和容量想象不是 Step 09 通信方式结论。 | 仅作为 historical material;产品、容量、SLO 和配置后移。 |
| 旧正式 `01-架构设计.md` 混写接口、事件、数据、存储、技术产品和 report 细节 | 未经本轮 Step 01~09 停审,且会把协议 / 产品 / schema 误写成通信原则。 | Step 16 前不得继承旧正式正文。 |
| Step 06 已列出同步入口、异步消费和后台维护,但未判断交互场景 | 运行承载不等于通信方式判断。 | 本步在 Step 06 承载基础上给出场景到通信方式的映射。 |
| Step 08 已定义强一致 / 最终一致,但未说明交互方式 | 数据一致性不等于通信方式。 | 本步把强一致 truth 判断映射到同步边界,把派生 / 交接 / 外部传播映射到异步或后台。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 交互主语 | log / metric / trace / audit schema 和字段 | 关键交互场景、正式边界、交互目的和通信方式 | 架构层先判断边界语义,对象模型后移。 |
| 同步边界 | 混同为 schema 查询或 API 候选 | 准入、可见性、只读诊断、handoff 状态、retention 和 no-write 即时判断 | 防止伪同步成功和 source truth 反写。 |
| 异步边界 | 容易写成 event / topic / consumer 目录 | 观察材料送达、外部结果送达和已成立 observation truth 传播 | 防止协议名替代架构判断。 |
| 后台承接 | 混入 hash chain、冷存、rollup、dashboard 和 report 实现 | 派生、rollup、gap scan、报告交接材料、留存扫描、rebuild / replay 和外部导出准备 | 防止后台任务生成外部 truth 或真实 evidence。 |
| 失败口径 | 技术重试、SLA、产品不可用或测试证据想象 | blocked、pending、failed、retryable、stale、unresolved、gap、quarantined、not-visible 和 no-write violation | 对齐 Step 08 数据所有权与一致性策略。 |
| 外部产品 | 具名产品像通信和运行主结构 | 产品中立能力仅作为后续技术或配置候选 | 保持 observation truth 不被产品绑定。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 所有观察相关交互都同步完成 | 调用方心智简单。 | 会让 source owner、report、archive、GRC、dashboard、alert 和派生视图阻塞 observation truth,并放大跨仓耦合。 | 不采用。 |
| 方案 B: 所有观察材料和消费都异步化 | 解耦程度高。 | 准入、安全可见性、handoff 状态、retention 保护和 no-write guard 缺少即时判断。 | 不采用。 |
| 方案 C: 同步收口即时安全 / 可见性 / 交接 / 留存 / no-write 判断,异步承接材料送达和事实传播,后台维护派生 / 扫描 / 交接材料 | 符合职责边界、运行承载、数据所有权和一致性策略。 | 后续概要 / 详细设计必须清楚标注状态和边界。 | 采用。 |
| 方案 D: 先锁定 API、event、topic、OTel、Prometheus、Grafana、TimescaleDB、report API,再反推交互方式 | 实施看似直接。 | 会让协议、产品和实现机制反向决定 observation truth。 | 不采用。 |
| 方案 E: 让 report / archive / GRC / dashboard / alert 参与 observation truth 写入 | 贴近外围消费需求。 | 会形成第二 truth,并破坏只读观察与审计投影边界。 | 不采用。 |
| 方案 F: 让 rebuild / replay / gap scan 修复 source truth | 看似能提升闭环恢复能力。 | 会让维护路径越权写业务、治理、制品或执行 truth。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| 受控观测材料准入是否可以先异步接受再后台判定 | A. 可以;B. 不可以,同步边界必须返回 accepted / rejected / quarantined / pending 等安全语义 | B | 正式 observation material 不能伪装成已安全入仓。 |
| source / bus observation material 是否要求来源仓同步等待 Observability 完成所有派生 | A. 要求;B. 不要求,来源材料送达异步承接,派生后台维护 | B | 观察不应阻塞 source owner 主写路径。 |
| 查询 / 诊断 / dashboard / alert 是否可以反写 observation truth | A. 可以;B. 不可以,只能只读消费或派生 | B | 防止派生和外围消费成为第二 truth。 |
| report handoff 是否可以生成真实 evidence / verdict / signoff | A. 可以;B. 不可以,只交接观察线索、脱敏状态、缺口和真实性提示 | B | 避免设计阶段伪造真实测试与验收材料。 |
| retention / cleanup / replay 是否可以覆盖 active reference protection | A. 可以;B. 不可以,冲突时 hold / blocked / conflict | B | 防止误清仍被审计、诊断、报告、留存或合法保留引用的材料。 |
| OTel / Prometheus / Grafana / TimescaleDB 是否进入当前通信方式主链 | A. 进入;B. 不进入,仅作为后续技术或外围增强候选 | B | 当前只定通信类别和边界语义,不定产品或协议。 |

---

## 8. 结构化中间产物

### 8.1 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 受控观测材料准入判断 | source owner / 管理入口 / 审计入口边界 ↔ Observability 同步入口 | 判断候选观察材料是否可进入 observation truth 语境,或必须拒绝、隔离、降级、挂起。 | 该场景直接影响本仓观察面真相,必须即时收口安全和来源语境。 |
| 安全观察面查询与可见性判断 | SDK / console / source owner / runtime / sandbox / 审计入口 ↔ Observability 同步入口 | 返回安全观察面、不可见、缺口、stale、unavailable 或授权失败语义。 | 查询是只读交互,但可见性和 redaction 必须即时判断。 |
| 只读诊断与缺口解释读取 | runtime / sandbox / console / 运维审计入口 ↔ Observability 同步入口 | 读取诊断摘要、降级原因、gap、correlation 和 no-write 线索。 | 诊断只能解释观察事实,不能成为执行控制或业务修复入口。 |
| report handoff 状态读取 / 受控触发 | report / acceptance handoff systems / console ↔ Observability 同步入口 | 判断交接是否 ready、blocked、pending、failed、not-visible 或缺少真实性提示。 | handoff 状态影响报告消费,但不生成最终 verdict、真实 run 或签署。 |
| retention / active reference protection 判断 | archive / cleanup / replay / 审计入口 ↔ Observability 同步入口 | 判断材料是否 hold、release、conflict、archive eligible 或仍被活动引用保护。 | 留存保护必须即时解释,避免清理或归档绕过活动引用。 |
| no-write guard 与受控维护触发判断 | 查询 / 诊断 / report / export / rebuild / maintenance 边界 ↔ Observability 同步入口 | 判断请求是否试图写 source truth,并决定拒绝、挂起、记录 violation 或允许后台维护。 | 这是防止读侧、维护侧和交接侧反写真相的同步防线。 |
| source / bus observation material 送达 | L0-bus / source owner / 外部能力接缝 ↔ Observability 异步观察材料消费 | 将 tap / audit material、source observation material、安全摘要或缺口送达本仓。 | 送达不等于 source truth 转移,也不要求来源仓等待所有派生完成。 |
| 相邻 truth owner 观察语境送达 | identity / governance / artifact / runtime / sandbox 边界 ↔ Observability 异步观察材料消费 | 送达 actor / subject safe ref、governance 语境、artifact / evidence ref、runtime / sandbox safe signal。 | 外部 truth 仍归来源 owner,本仓只承接安全引用、摘要、线索或 gap。 |
| body-free evidence linkage 线索送达 | Artifact / evidence owner / report handoff 边界 ↔ Observability 异步观察材料消费 | 送达证据引用、digest 线索、不可见状态、缺口和消费目的。 | evidence body 不入仓,线索送达不能替代 evidence truth。 |
| observation truth 变化传播 | Observability truth 边界 ↔ source owner / runtime / sandbox / SDK / console / report / archive / audit consumers | 传播安全观察面、审计投影、handoff、retention、gap 或 no-write 变化感知。 | 已成立事实传播失败不能回滚本仓 truth。 |
| report / archive / external audit / GRC handoff 送达 | Observability 派生 / 交接边界 ↔ report / archive / external audit / GRC consumers | 交接脱敏材料线索、evidence index input、缺口、真实性提示和导出准备材料。 | 交接消费可延迟,接收方不得反向定义 observation truth。 |
| 派生视图 / rollup / dashboard / alert / anomaly material 维护 | Observability truth 边界 ↔ 派生消费辅助 / 后台维护边界 | 维护查询视图、rollup、诊断摘要、dashboard、alert、异常分析和长期分析材料。 | 派生消费可延迟和重建,不得成为第二 observation truth。 |
| gap scan / 引用刷新 / projection rebuild / replay | 后台维护边界 ↔ Observability truth / 外部引用 / 派生状态 | 检查缺口、刷新引用可解析性、重建派生投影或记录重放影响。 | 维护只能影响观察面和派生投影,不得修复 source truth。 |
| retention 扫描与 archive eligibility 准备 | 后台维护边界 ↔ retention truth / archive handoff 边界 | 维护 hold、release、conflict、archive eligibility 和活动引用保护解释。 | 后台可推进留存判断,但必须服从 active reference protection。 |
| no-write violation 记录与通知 | 同步入口 / 后台维护 / 交接边界 ↔ Observability truth / 消费边界 | 记录并传播越界写入尝试的观察面事实和触发语境。 | violation 是本仓 truth,但不表示 source owner 已修复或业务状态已改变。 |

### 8.2 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 受控观测材料准入判断 | 同步请求 / 响应类交互 | 不宜先异步接受再后台默认成立 | 返回 accepted、rejected、quarantined、degraded、pending、unresolved 或明确失败 | 准入会改变 observation truth,必须即时判断安全和来源语境。 |
| 安全观察面查询与可见性判断 | 同步请求 / 响应类交互 | 不宜用异步推送替代正式读取判断 | 返回可见结果、not-visible、stale、unavailable、gap 或拒绝 | 查询只读,但 redaction、授权和可见性必须即时成立。 |
| 只读诊断与缺口解释读取 | 同步请求 / 响应类交互 | 不宜作为业务修复、执行控制或治理裁决交互 | 返回诊断摘要、缺口、degraded、unavailable 或 no-write 拒绝 | 诊断用于解释观察事实,不改写外部 truth。 |
| report handoff 状态读取 / 受控触发 | 同步请求 / 响应类交互 + 后台任务 / 延后承接 | 不宜同步伪造完整报告、真实 evidence 或签署 | 返回 ready、blocked、pending、failed、not-visible、retryable 或真实性提示缺失 | 状态读取即时,材料组装和导出准备可后台承接。 |
| retention / active reference protection 判断 | 同步请求 / 响应类交互 + 后台任务 / 延后承接 | 不宜由 cleanup / archive 消费方直接决定释放 | 返回 hold、release、conflict、blocked、archive eligible 或不可解析 | 活动引用保护优先于清理、归档和重放便利。 |
| no-write guard 与受控维护触发判断 | 同步请求 / 响应类交互 | 不宜让后台维护先执行再补审计 | 拒绝、挂起、记录 violation、缩小范围或允许后台只读维护 | 维护和交接入口必须先过不反写真相防线。 |
| source / bus observation material 送达 | 异步事件 / 回调类交互 | 不宜要求来源仓同步等待派生视图和报告完成 | 保持 missing、pending、unresolved、rejected、quarantined 或 gap | 来源事实已在来源仓成立,本仓异步承接观察材料。 |
| 相邻 truth owner 观察语境送达 | 异步事件 / 回调类交互 | 不宜通过源码依赖或正文复制穿透本仓核心 | 保持未送达、unresolved、not-visible、degraded 或 gap | 相邻 truth owner 只送达安全引用、摘要、线索或缺口。 |
| body-free evidence linkage 线索送达 | 异步事件 / 回调类交互 | 不宜同步复制 evidence body 或 artifact body | 保持 missing、not-visible、gap、pending 或 rejected | 证据关联可以送达,证据正文不能迁入本仓。 |
| observation truth 变化传播 | 异步事件 / 回调类交互 | 不宜要求所有消费方确认后才成立本仓 truth | 保留待传播、failed、retryable、handoff-pending 或消费方 stale | 已成立观察事实传播失败不回滚核心 truth。 |
| report / archive / external audit / GRC handoff 送达 | 异步事件 / 回调类交互 + 后台任务 / 延后承接 | 不宜作为 observation truth 或验收结论成立前置 | 保留 pending、blocked、failed、retryable、not-visible 或待导出 | 交接和导出可延迟,接收方不反写真相。 |
| 派生视图 / rollup / dashboard / alert / anomaly material 维护 | 后台任务 / 延后承接类交互 | 不宜阻塞准入、查询可见性或核心 truth 成立 | 保留旧视图、stale、rebuilding、failed、unavailable 或 degraded | 派生消费最终一致,可重建。 |
| gap scan / 引用刷新 / projection rebuild / replay | 后台任务 / 延后承接类交互 | 不宜作为 source truth repair 或跨仓补偿事务 | 输出 gap、marker、impact summary、failed、blocked 或缩小范围 | 维护用于解释和重建观察面,不修复来源 truth。 |
| retention 扫描与 archive eligibility 准备 | 后台任务 / 延后承接类交互 | 不宜让 archive package 或 cleanup 脚本决定本仓留存 truth | 输出 hold、release candidate、conflict、blocked、pending 或 archive eligibility | 留存派生可后台推进,核心保护语义仍由本仓拥有。 |
| no-write violation 记录与通知 | 同步请求 / 响应类交互 + 异步事件 / 回调类交互 | 不宜静默丢弃或当作 source repair 完成 | 记录 violation、绑定触发语境、通知相关消费方或挂起审计 | violation 是观察面事实,用于防止越界写入扩散。 |

### 8.3 按架构单元组织的交互方式表

| 架构单元 | 同步交互 | 异步交互 | 后台 / 延后承接 | 失败降级口径 | 停审结果 |
|---|---|---|---|---|---|
| `Observability 核心语义角色` | 只接受已由编排收束后的准入、可见性、handoff、retention 和 no-write 判断。 | 不直接订阅外部事件或回调。 | 不直接运行后台维护。 | 输入不闭合时拒绝、隔离、保持原状态或记录 gap / violation。 | pass |
| `Observability 编排 / 承接角色` | 承接受控准入、查询、诊断、handoff、retention、维护触发和 no-write guard。 | 承接 source / bus material、相邻 truth owner 语境、evidence 线索和变化传播。 | 发起派生维护、gap scan、projection rebuild、report handoff material、retention 扫描和 replay 解释。 | pending / unresolved / rejected / quarantined / not-visible / blocked / unavailable,不得补造 truth。 | pass |
| `外部能力接缝角色` | 暴露正式只读和受控入口,不让外部直接写核心。 | 接收或输出观察材料送达、外部结果送达和已成立事实传播。 | 提供延后交接、导出准备和恢复边界。 | 外部不可用只影响语境、消费或交接,不改 observation truth。 | pass |
| `派生消费辅助角色` | 可支持只读查询、诊断和 handoff 状态读取,不得作为写入主路径。 | 可消费已成立 observation truth 变化和交接通知。 | 维护 query、rollup、diagnostic、dashboard、alert、GRC export、analysis、gap 和 report material。 | stale / rebuilding / failed / unavailable / degraded,不得反写真相。 | pass |
| `技术承载角色` | 支撑同步边界的正式承载,不决定安全语义。 | 支撑事件协作和交接边界,不承载外部正文 truth。 | 支撑派生、扫描、重建、留存、导出和外围消费。 | 技术失败只能暴露失败、挂起或降级,不得改写语义。 | pass |

### 8.4 简化交互示意图

```text
+-----------------------------+        +-------------------------------+
| 只读 / 受控入口边界          |        | 观察材料 / 外部语境边界       |
| sdk / console / report       |        | bus / source / identity/gov   |
| audit / archive / maintenance|        | artifact / runtime / sandbox  |
+-------------+---------------+        +---------------+---------------+
              | [sync request / response]               |
              v                                         | [async event / callback]
+-------------+---------------+        +---------------+---------------+
| Observability 同步入口       |        | Observability 异步材料消费     |
+-------------+---------------+        +---------------+---------------+
              |                                        |
              +--------------------+-------------------+
                                   |
                                   v
                       +-----------+-----------+
                       | Observability truth   |
                       | observation / audit / |
                       | handoff / retention / |
                       | no-write violation    |
                       +-----+-------------+---+
                             |             |
               [async event] |             | [background]
                             v             v
            +----------------+----+   +----+------------------+
            | 消费 / 报告 / 归档  |   | 派生 / 扫描 / 重建 / |
            | / 外部审计边界      |   | 留存 / 导出承接      |
            +---------------------+   +-----------------------+
```

图示说明:

- 同步请求 / 响应用于即时判断准入、可见性、diagnostic、handoff、retention 和 no-write,不是表达具体协议。
- 异步事件 / 回调用于观察材料送达、外部结果送达和已成立 observation truth 变化传播,不是事件目录。
- 后台任务 / 延后承接用于派生、rollup、gap scan、projection rebuild、report handoff material、retention 扫描和导出准备,不得反写真相。
- 图不表达 API、event name、topic、DTO、schema、处理顺序、队列产品、存储产品或运行部署拓扑。

### 8.5 交互方式停审记录

| 交互场景 | 是否匹配数据所有权 | 是否经过正式边界 | 是否未下沉协议 schema | 停审结果 |
|---|---|---|---|---|
| 受控观测材料准入判断 | pass | pass | pass | pass |
| 安全观察面查询与可见性判断 | pass | pass | pass | pass |
| 只读诊断与缺口解释读取 | pass | pass | pass | pass |
| report handoff 状态读取 / 受控触发 | pass | pass | pass | pass |
| retention / active reference protection 判断 | pass | pass | pass | pass |
| no-write guard 与受控维护触发判断 | pass | pass | pass | pass |
| source / bus observation material 送达 | pass | pass | pass | pass |
| 相邻 truth owner 观察语境送达 | pass | pass | pass | pass |
| body-free evidence linkage 线索送达 | pass | pass | pass | pass |
| observation truth 变化传播 | pass | pass | pass | pass |
| report / archive / external audit / GRC handoff 送达 | pass | pass | pass | pass |
| 派生视图 / rollup / dashboard / alert / anomaly material 维护 | pass | pass | pass | pass |
| gap scan / 引用刷新 / projection rebuild / replay | pass | pass | pass | pass |
| retention 扫描与 archive eligibility 准备 | pass | pass | pass | pass |
| no-write violation 记录与通知 | pass | pass | pass | pass |

### 8.6 跨交互边界审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在同步 / 异步选择冲突 | pass | 准入、可见性、handoff、retention 和 no-write 走同步收口;材料送达和事实传播走异步;派生和维护走后台。 |
| 是否存在直接穿透边界 | pass | Source、bus、identity、governance、artifact、runtime、sandbox、archive、report、console、GRC 和产品能力均必须经过正式边界。 |
| 是否存在协议细节下沉 | pass | 未写 API、event name、topic、DTO、schema、handler、consumer、publisher、outbox、transaction 或队列产品。 |
| 是否存在失败降级缺口 | pass | 已给出 rejected、quarantined、pending、unresolved、not-visible、stale、blocked、failed、retryable、handoff-pending、gap 和 no-write violation 口径。 |
| 是否存在派生反写真相 | pass | query、diagnostic、rollup、dashboard、alert、GRC export、analysis、report material、rebuild 和 replay 均不得反写核心或 source truth。 |
| 是否存在外部正文迁入本仓 | pass | source body、raw log、payload、evidence body、artifact body、identity body、runtime body、archive package 和 external product config 均未作为本步交互结果。 |
| 是否存在 report / evidence 伪造风险 | pass | report handoff 只交接观察线索、脱敏状态、缺口和真实性提示,不生成真实 run、evidence alias、verdict 或 signoff。 |
| 是否存在产品栈污染 | pass | OTel、Prometheus、Grafana、TimescaleDB、对象存储、APM、GRC 和 alert sink 未作为通信方式或 truth source。 |
| 是否存在后续详细设计承接风险 | pass | 本步保留通信类别和边界理由,具体协议、port、adapter、event、schema、store 和调度机制后续收敛。 |

### 8.7 边界说明

`L4-observability` 的通信方式按“是否必须即时判断观察面安全语义”来选择:准入、查询可见性、诊断读取、handoff 状态、retention 保护和 no-write guard 必须同步收口;观察材料送达、相邻 truth owner 语境送达和已成立 observation truth 传播适合异步承接;派生视图、rollup、gap scan、report handoff material、retention 扫描、rebuild / replay 和外部导出准备适合后台延后承接。同步成功不能表示 source truth、governance decision、artifact lineage、runtime execution、archive package 或验收签署已经成立。异步和后台失败只能表现为 pending、blocked、failed、retryable、stale、unresolved、gap、not-visible 或 degraded,不能回滚已经成立的本仓 truth,也不能反写外部 truth。

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 10. 关键交互与通信方式

> 校准来源:
> - `design-calibration/01_arch_step_09_interactions_communication.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“关键交互场景表”“通信方式判断表”“按架构单元组织的交互方式表”“简化交互示意图”“交互方式停审记录”和“跨交互边界审计表”小节,了解本章如何从职责边界、系统上下文、运行承载、依赖方向和数据所有权推导通信方式。

### 10.1 关键交互场景表

摘录 `design-calibration/01_arch_step_09_interactions_communication.md` §8.1。

### 10.2 通信方式判断表

摘录 `design-calibration/01_arch_step_09_interactions_communication.md` §8.2。

### 10.3 按架构单元组织的交互方式表

摘录 `design-calibration/01_arch_step_09_interactions_communication.md` §8.3。

### 10.4 简化交互示意图

摘录 `design-calibration/01_arch_step_09_interactions_communication.md` §8.4。

### 10.5 边界说明

摘录 `design-calibration/01_arch_step_09_interactions_communication.md` §8.7。
```

---

## 10. 待确认事项

本步不新增阻塞 Step 10 的待确认事项。下列事项进入后续 Step,不得在 Step 09 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|
| `Q-OBS-ARCH-009-001` | 受控准入、查询、诊断、handoff、retention 和 no-write 的正式 API / command / query 形态 | 后续概要 / 详细设计收敛。 |
| `Q-OBS-ARCH-009-002` | source / bus observation material、相邻 truth owner 语境和 observation truth 变化传播的 event / callback / topic / payload 形态 | 后续概要 / 详细设计和接口设计收敛。 |
| `Q-OBS-ARCH-009-003` | redaction、visibility、quarantine、degraded、gap、stale、blocked、retryable 的具体状态机和错误模型 | 后续详细设计、配置设计、测试方案和验收标准收敛。 |
| `Q-OBS-ARCH-009-004` | report handoff material、evidence index input、external audit / GRC export 的交接协议和失败语义 | 后续概要、测试方案、验收标准和实施计划收敛。 |
| `Q-OBS-ARCH-009-005` | retention 扫描、archive eligibility、active reference protection、cleanup / replay / rebuild 的调度与实现机制 | 后续技术选型、配置设计、详细设计和测试方案收敛。 |
| `Q-OBS-ARCH-009-006` | OTel、Prometheus、Grafana、TimescaleDB、对象存储、APM、GRC、alert sink、search / cache / queue 产品是否采用 | 后续 Step 10、配置设计、测试方案和实施计划收敛。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确关键交互场景及正式边界位置 | pass | §8.1 已列出准入、查询、诊断、handoff、retention、no-write、材料送达、事实传播、派生维护和交接场景。 |
| 是否明确每类场景适合采用的通信方式 | pass | §8.2 已区分同步请求 / 响应、异步事件 / 回调和后台任务 / 延后承接。 |
| 是否说明不宜采用的方式及边界原因 | pass | §8.2 已逐项说明不宜异步伪成功、同步阻塞派生、后台反写、正文复制或产品定义语义。 |
| 是否明确通信方式失败时的架构层处理口径 | pass | §4.5 / §8.2 已给出 rejected、quarantined、pending、unresolved、not-visible、stale、blocked、failed、retryable、handoff-pending、gap 和 no-write violation。 |
| 是否按架构单元完成交互方式停审 | pass | §8.3 / §8.5 已逐项通过。 |
| 是否完成跨交互边界审计 | pass | §8.6 未发现同步 / 异步冲突、直接穿透、协议细节下沉、失败降级缺口或派生反写真相。 |
| 是否避免 API、事件、DTO、schema、topic、outbox、transaction、队列产品和技术选型 | pass | 本步只写通信类别、边界语义和失败口径。 |
| 是否保持 report handoff 与 evidence authenticity 的真实性边界 | pass | 未生成真实 run、真实 evidence alias、final verdict、signoff 或测试结果。 |
| gate_status | pass | 当前 Step 09 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_10 | 必须等待用户确认后才允许进入 Step 10 `关键技术选型`。 |

当前 Step 09 `关键交互与通信方式` 已完成。下一步必须等待用户确认后进入 Step 10 `关键技术选型`,并只创建 / 改写 `design-calibration/01_arch_step_10_technology_choices.md`。
