# L4-observability 01-架构设计 Step 11 · 备选方案与取舍

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 11
> 回填章节: `01-架构设计.md` §12 备选方案与取舍
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 12

---

## 1. 本步目标

把 `L4-observability` 当前主线架构方案与主要相邻替代路径放到同一判断框架下比较,说明为什么选择当前方案,为什么放弃其它路径,以及当前方案牺牲了什么、换来了什么。

本步只比较架构层路径级替代关系,不写产品横评、局部实现对比、未来愿望池、API / event / job / schema、数据库、时序库、对象存储、APM、dashboard、GRC 产品、hash 算法、P95 / SLA、冷存天数、事件数量、topic、outbox、consumer group 或部署细节。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | Step 10 已完成,用户已确认进入 Step 11 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~10 pass,Step 11 已获用户确认 | 确认本轮只允许推进 Step 11。 |
| `design-calibration/01_arch_step_02_arch_goals_constraints.md` | 已完成 | 承接 observation truth 独立性、redaction / correlation、body-free linkage、read-only handoff、retention / no-write 和产品中立约束。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 承接做 / 不做、易混淆职责和边界红线,排除相邻 truth owner 职责。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | 已完成 | 承接同步入口、异步观察材料消费、后台维护交接、真相承载和派生承载边界。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 承接 `L0-core` 唯一编译期依赖、`L0-bus` 事件协作和禁止 sibling truth repo 依赖。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 承接 truth / projection / reference / forbidden body 分离、强一致 / 最终一致和失败处理口径。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 承接同步即时判断、异步材料送达 / 事实传播和后台派生维护三类路径。 |
| `design-calibration/01_arch_step_10_technology_choices.md` | 已完成 | 承接正式承接边界、redaction-first、correlation、audit projection 分离、body-free evidence linkage、retention、no-write guard、幂等顺序和产品中立适配。 |
| `projects/L4-observability/00-需求文档.md` §10 / §11 / §12 / §13 / §14 / §15 | 正式需求基线已完成 | 校验规则、数据归属、接口依赖、NFR、验收和风险边界。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 11 | 已读取 | 控制本步只比较路径级替代方案和取舍。 |
| `standards/document/架构设计书写规范.md` §4.12 | 已读取 | 控制方案路径比较表、边界说明和轻量取舍表写法。 |
| `projects/L1-governance/design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已读取 | 参考路径级比较、非候选方向和轻量取舍表的组织方式。 |
| `projects/L1-artifact/design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已读取 | 参考 truth center、外部正文边界、派生不反写和产品后置口径。 |
| 旧 `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | historical material,已被本文件替换 | 仅作为 schema 清单式薄产物和错误门禁诊断来源,不继承旧结论。 |
| 旧 `projects/L4-observability/README.md` 与旧 `01-架构设计.md` | historical material | 仅作为旧产品栈、旧指标、旧 schema、旧事件和旧实现假设诊断来源。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 02 / 03 / 06 / 07 / 08 / 09 / 10、SOP Step 11 和书写规范 4.12 | done | 本文件 §2 |
| 读取正式 00、旧 Step 11、旧 README / 旧正式 01 和 L1 参考 Step 11 | done | 本文件 §2 / §5 |
| 回答主要可选方案、当前选择理由、被放弃方案优点、不采用原因和当前取舍 | done | 本文件 §4 |
| 输出当前主线方案、方案路径比较表、不进入正式比较的方向、轻量取舍表和方案边界说明 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 11 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 这个仓有哪些主要可选架构方案?

当前主线方案是:

> 以独立 observation truth 为核心,通过正式承接边界、redaction-first / safety marker、correlation context / safe ref、observation truth / derived projection / reference / forbidden body separation、audit projection 与 source audit / Governance truth 分离、body-free evidence linkage、核心强一致 + 派生 / 外围最终一致、同步 / 异步 / 后台三类路径分离、只读消费面、retention marker / active reference protection、no-write guard、幂等顺序保护、traceability / report handoff trail 和产品中立外部适配构成横切观察与审计投影架构。

值得比较的相邻替代路径是:

| 替代路径 | 是否进入本章比较 | 判断 |
|---|---|---|
| 独立 observation truth + 正式边界协作主线 | 是 | 当前采用主线。 |
| 纯日志 / 指标 / 追踪平台路径 | 是 | 与横切观察面 truth、审计投影和 handoff 主线构成结构性替代。 |
| 业务真相聚合仓路径 | 是 | 与不拥有业务 / governance / artifact / identity / runtime truth 的约束构成替代。 |
| 外部 APM / 监控产品主导路径 | 是 | 与产品中立 observation truth 主线构成替代。 |
| Observability store / audit ledger 作为 Governance / Artifact truth source 路径 | 是 | 与只读 audit projection 和 body-free evidence linkage 构成替代。 |
| Report / dashboard / GRC / export first 路径 | 是 | 与只读派生消费和 handoff trail 主线构成替代。 |
| 全同步闭环路径 | 是 | 与同步即时判断 + 异步 / 后台分离构成替代。 |
| 全异步事件化路径 | 是 | 与核心准入、安全、handoff、retention 和 no-write 即时判断构成替代。 |
| 完整事件溯源 / hash-chain-first 路径 | 是 | 与当前 traceability / linkage / handoff 机制但不硬化持久化范式构成替代。 |
| 具体数据库、时序库、对象存储、APM、dashboard、GRC、hash 算法、schema 名称、topic / outbox | 否 | 属于产品级、对象级、协议级或实现级选择,后续文档收敛。 |

### 4.2 为什么当前选择这一种?

当前主线方案能同时满足五个硬目标:

1. Observation truth 独立成立,不被 source repo、本地日志、外部 APM、dashboard、report generator、archive package 或 GRC 工具替代。
2. Redaction-first、safety marker、correlation context 和 safe ref 成为准入、查询、诊断、审计投影、report handoff 和外部导出的结构前提。
3. Audit projection、body-free evidence linkage、report handoff、retention marker 和 no-write violation 能成为本仓正式观察面事实,但不吸收 Governance decision、Artifact lineage、Identity truth、runtime execution truth、source audit truth 或 evidence body。
4. 核心观察事实、关联语境、安全处置、证据线索、handoff、retention 和 no-write 可以强一致成立或拒绝;查询视图、rollup、dashboard、alert、GRC export、archive handoff 和长期分析可以最终一致。
5. 跨仓协作可通过 `L0-core` 共享契约、`L0-bus` 事件协作、运行期 resolver / adapter、safe ref、summary、snapshot 和 handoff 发生,但非 core sibling truth repo 不成为编译期依赖。

其它路径通常只能优化某一面:更快接入日志 / 指标 / trace、复用外部监控产品、集中审计报表、强化事件重放、提高下游展示即时感或降低短期适配成本,但会牺牲 observation truth 边界、正文禁止入仓、audit projection 只读性、evidence body-free、report 真实性、retention protection、no-write guard 或依赖裁剪。

### 4.3 被放弃方案的主要优点是什么?

| 被放弃方案 | 主要优点 |
|---|---|
| 纯日志 / 指标 / 追踪平台路径 | 接入心智直接,工程团队容易把 log / metric / trace 与现有观测工具对应。 |
| 业务真相聚合仓路径 | 查询和报表看起来集中,可以短期减少跨仓 resolver / snapshot / handoff 成本。 |
| 外部 APM / 监控产品主导路径 | 产品生态成熟,采集、展示、告警和仪表盘能力可能更快落地。 |
| Observability store / audit ledger 作为 Governance / Artifact truth source 路径 | 审计叙事集中,报告和复盘材料看似更完整。 |
| Report / dashboard / GRC / export first 路径 | 管理视图、外部审计导出和验收材料体验更早可见。 |
| 全同步闭环路径 | 调用方即时感强,交互链路表面完整。 |
| 全异步事件化路径 | 运行单元更解耦,吞吐扩展和跨仓传播空间更明显。 |
| 完整事件溯源 / hash-chain-first 路径 | 历史重放、完整性叙事、gap detection 和审计解释能力更强。 |

### 4.4 为什么即便有这些优点,当前仍不采用?

这些优点大多来自短期接入便利、工具生态、集中查询、展示体验或历史叙事能力,但 `L4-observability` 的首要问题不是“最快接一个监控平台 / 报表平台 / 审计日志库”,而是“守住横切观察和审计投影的独立真相边界”。一旦选择纯监控平台、业务真相聚合、外部产品主导、审计仓反写治理 / 制品 truth、report-first、全同步或全事件化核心,后续会很难恢复 redaction-first、forbidden body、body-free evidence linkage、source truth 不反写、report 真实性和依赖裁剪。

完整事件溯源、hash chain、具体 APM、时序库、对象存储、dashboard、GRC、alert sink、schema、topic、outbox 和性能指标属于后续概要 / 详细 / 配置 / 测试 / 实施或 ADR 判断,不能在当前阶段反向定义 observation truth。

### 4.5 当前选择牺牲了什么,换来了什么?

| 当前方案牺牲 | 当前方案换来 |
|---|---|
| 初期接入路径更长 | 外部观察材料不会直接污染核心语义。 |
| 承接、redaction、correlation、safe ref 和 visibility 设计成本更高 | raw body、secret、payload body、evidence body 和 opaque id 不会进入正式输出。 |
| 外部 APM / dashboard / GRC 不能直接成为主结构 | 产品配置和展示维度不反向定义 observation truth。 |
| report handoff 不能直接生成最终材料 | 避免伪造真实 run、evidence alias、final verdict 或 signoff。 |
| 派生视图、dashboard、alert、GRC export 会有延迟和 stale 语义 | 派生消费不反写核心观察事实。 |
| retention、active reference protection、rebuild / replay 和 no-write guard 设计更复杂 | 清理、重建、导出和维护不会误清活动引用或修复 source truth。 |
| 暂不硬化完整 ES、hash chain、时序库、对象存储和产品栈 | 当前核心闭环更可控,复杂能力有清晰演进空间。 |

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01_arch_step_11_alternatives_tradeoffs.md` | 以 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection`、`RedactionDecision`、`CorrelationContext` 等 schema 名称组织结构化产物 | Step 11 应比较路径级方案,不应提前写对象模型或字段语义。 | 全部降级为 historical material,本步按路径级替代方案重写。 |
| 旧 Step 11 门禁 | `next_allowed_action=next_step_or_formal_assembly` | 与用户要求一个 Step 一个 Step 停审冲突,且 Step 11 后应等待 Step 12 确认。 | 改为 `wait_user_confirmation_before_step_12`。 |
| 旧 README | OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95、147 events、冷存天数和 hash chain 分片写得像技术主线 | 产品、指标、容量和算法不是当前路径级方案结论。 | 仅作为 historical material 或后续候选输入。 |
| 旧正式 `01-架构设计.md` | 混写产品栈、存储、schema、性能指标、目录和实现假设 | 未经本轮 Step 01~11 停审,且会把产品和实现机制误写成架构主线。 | Step 16 前不得继承旧正式正文。 |
| Step 10 | 已说明单项关键技术机制 | 本步需要把机制组合成路径级主线,不能重写每个机制采用理由。 | 本步只比较当前主线与相邻替代路径。 |
| 需求待确认项 | 产品、指标、schema、算法、handoff 协议和 implementation boundaries 仍未到闭口阶段 | 不能把未闭口事项当作正式替代路径。 | 进入后续概要、详细、配置、测试、验收和实施计划收敛。 |

---

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 方案取舍表达 | schema / 字段 / 能力清单 | 当前主线方案 + 路径级替代方案比较 | 对齐架构规范 4.12。 |
| 当前主线 | 泛 observability 能力或产品栈想象 | 独立 observation truth + 正式边界协作 | 防止产品、schema、report 或审计仓反向定义 truth。 |
| 被放弃方案 | 只列业务真相聚合和纯日志平台 | 系统比较监控平台、业务聚合、产品主导、audit ledger 反写、report-first、全同步、全异步和 ES / hash-chain-first | 覆盖 Step 02~10 已暴露的结构性替代路径。 |
| 不进入比较方向 | 未明确 | 产品、数据库、schema、topic、outbox、指标、容量和算法后置 | 防止 Step 11 滑入概要 / 详细 / 配置 / 测试。 |
| 门禁 | 允许自动进入下一步或正式装配 | Step 11 完成后等待用户确认 Step 12 | 对齐用户逐 Step 停审要求。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只保留 Step 10 单项机制说明 | 简短。 | 缺少当前主线与替代路径的整体取舍,正式 §12 无法回答为什么不采用其它路径。 | 不采用。 |
| 方案 B: 按结构性替代路径做方案比较 | 能说明当前主线为什么成立,也能解释旧产品栈和旧 schema 为什么不能直接继承。 | 表格较长,需要严格排除产品和实现细节。 | 采用。 |
| 方案 C: 加入 OTel、Prometheus、Grafana、TimescaleDB、对象存储、APM、GRC、hash 算法横评 | 接近实施讨论,旧材料可复用。 | 违反本章边界,会让产品和算法反向定义 observation truth。 | 不采用。 |
| 方案 D: 把所有未来增强列为备选方案 | 看似完整。 | 会把愿望池、探索池和正式架构取舍混在一起。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| 外部 APM / dashboard / GRC 是否作为当前主线 truth source | A. 是;B. 否,只作为产品中立适配或下游消费 | B | 产品配置、存储模型和展示维度不能定义本仓 truth。 |
| 是否当前采用业务真相聚合仓路径 | A. 是;B. 否,只承接 safe ref、summary、snapshot、signal、gap 和 handoff | B | 防止吸收 Governance、Artifact、Identity、runtime、sandbox 或 source truth。 |
| 是否当前选择完整事件溯源 / hash-chain-first | A. 作为 P0 必选;B. 保留观察,当前只采用 traceability、body-free linkage、handoff trail 和 gap 语义 | B | 当前需要可追溯和完整性线索,但完整 ES / hash chain 会过早锁定持久化和算法。 |
| report / dashboard / GRC export 是否可以成为主组织核心 | A. 可以;B. 不可以,只能只读派生或导出 | B | 防止派生结构成为第二 observation truth 或伪造验收材料。 |
| 是否允许全同步或全异步作为单一主线 | A. 允许;B. 不允许,继续采用同步 / 异步 / 后台分离 | B | 准入、安全、handoff、retention、no-write 需要即时判断,派生和外围消费不应阻塞核心。 |

---

## 8. 结构化中间产物

### 8.1 当前主线方案

当前采用的主线方案是:

```text
独立 observation truth 核心
  + 正式承接边界隔离外部观察材料
  + redaction-first / safety marker
  + correlation context / safe ref
  + observation truth / derived projection / reference / forbidden body separation
  + audit projection 与 source audit / Governance truth 分离
  + body-free evidence linkage / authenticity hint
  + 核心强一致 + 派生 / 外围最终一致
  + 同步即时判断 / 异步材料送达与事实传播 / 后台派生维护
  + 只读 query / diagnostic / report handoff / dashboard / alert / GRC export
  + retention marker / active reference protection / archive handoff
  + no-write guard / no-write violation
  + 幂等 / 顺序保护
  + traceability / audit projection / report handoff trail
  + 产品中立外部能力适配
```

该方案的核心判断是:`L4-observability` 可以成为横切观察、审计投影、证据线索、留存标记和报告交接的基础,但不能成为业务 truth、治理 truth、制品 / 证据正文、身份 truth、运行 / sandbox 执行 truth、归档 truth、外部产品配置 truth 或真实验收结论。

### 8.2 方案路径比较表

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 独立 observation truth + 正式边界协作主线 | 在多来源、多消费方之间保持观察面事实、审计投影、证据线索、handoff、retention 和 no-write 独立、可审计、可追溯。 | 同时保护 truth 边界、redaction-first、correlation、body-free evidence、派生不反写、report 真实性、留存保护和依赖裁剪。 | 增加承接、adapter、redaction、safe ref、derived、handoff、idempotency、gap 和 no-write 设计成本。 | 采用 | 这是当前主线方案,最符合 Step 02~10 已收敛约束。 |
| 纯日志 / 指标 / 追踪平台路径 | 用 log / metric / trace 作为观察能力主体,快速接入运行可见性。 | 工程心智直接,能较快覆盖运行观察和基础诊断。 | 无法完整覆盖 audit projection、body-free evidence linkage、report handoff、retention marker、active reference protection 和 no-write violation。 | 不采用 | log / metric / trace 是观察面的一部分,不能替代横切审计和交接 truth。 |
| 业务真相聚合仓路径 | 把各 source owner 的业务状态、治理裁决、制品血缘、身份、执行和归档信息集中到 Observability 查询。 | 查询和报告看似集中,跨仓 resolver 成本短期降低。 | 会吸收相邻 truth owner 的正文和生命周期,形成第二业务 truth。 | 不采用 | 本仓只承接 safe ref、summary、snapshot、signal、gap 和 handoff,不得拥有 source truth。 |
| 外部 APM / 监控产品主导路径 | 依赖外部采集、存储、展示、告警或 APM 产品组织观察能力。 | 生态成熟,采集和展示能力可能更快落地。 | 产品配置、标签、存储模型和 dashboard 维度会反向定义 observation truth,且难以表达 evidence linkage、retention 和 no-write 边界。 | 不采用 | 外部产品只能作为 adapter / 配置 / 外围消费候选,不能定义本仓核心语义。 |
| Observability store / audit ledger 作为 Governance / Artifact truth source 路径 | 用统一审计仓或 ledger 直接服务治理裁决、制品证据和合规报告。 | 审计叙事集中,报告和复盘材料看似完整。 | 只读 audit projection 会变成 Governance decision、source audit truth、Artifact lineage 或 evidence body 的替代物。 | 不采用 | Audit projection 必须只读;Governance、Artifact 和 evidence truth 仍归对应 owner。 |
| Report / dashboard / GRC / export first 路径 | 优先围绕管理视图、外部审计导出、GRC 和验收材料组织架构。 | 展示、导出和验收消费体验更早显化。 | 读模型、导出结构和报告材料会反向塑造核心 truth,并可能伪造真实 run、evidence alias、final verdict 或 signoff。 | 不采用 | Report、dashboard、alert、GRC export 只能从 observation truth 派生,不得写核心。 |
| 全同步闭环路径 | 让观察材料准入、派生、dashboard、alert、report、archive 和 GRC 导出同步完成。 | 调用方即时感强,端到端表面完整。 | 外围消费、报告、归档和外部系统会阻塞或回滚核心观察事实,跨仓耦合放大。 | 不采用 | 只适合准入、安全、可见性、handoff、retention 和 no-write 的即时判断,不适合作为全局主线。 |
| 全异步事件化路径 | 所有观察材料、查询、交接和留存均经异步事件传播。 | 解耦和吞吐空间明显,入口压力小。 | 准入、安全可见性、report handoff、retention protection 和 no-write guard 缺少即时成立 / 拒绝口径。 | 不采用 | 核心观察事实和安全边界必须有同步收口,不能全部异步化。 |
| 完整事件溯源 / hash-chain-first 路径 | 以完整事件日志、hash linkage 或 chain gap 作为核心持久化和审计叙事。 | 历史重放、完整性叙事和缺口检测能力强。 | 在对象、状态、协议、证据边界和算法尚未细化前过早锁定持久化范式,提高 P0 复杂度。 | 保留观察 | 当前采用 traceability、body-free linkage、handoff trail 和 gap 语义,不把完整 ES / hash chain 作为 P0 必选。 |

### 8.3 不进入本章正式比较的方向

| 方向 | 不进入比较的原因 | 正确处理 |
|---|---|---|
| 具体数据库、时序库、搜索、缓存、对象存储或消息产品 | 属于实现承载或产品选择,不构成路径级架构取舍。 | 概要设计、详细设计、配置设计、测试方案或实施计划。 |
| OTel、Prometheus、Grafana、TimescaleDB、APM、GRC、alert sink | 外部产品不能定义 observation truth、redaction、correlation、handoff、retention 或 no-write。 | 产品中立适配、配置设计、测试方案或实施计划。 |
| `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等对象名 | 这是概要 / 详细设计对象建模候选,不是路径级方案。 | 概要设计 / 详细设计。 |
| API、command、query、event、topic、callback、outbox、consumer group、DTO、payload | 属于协议和实现细节,不是本章方案路径。 | 概要设计、详细设计、测试方案或实施计划。 |
| P95 / P99 / SLA、冷存天数、事件数量、capacity、scrape interval | 当前缺新版负载模型和验证依据,不能作为路径取舍。 | 测试方案、验收标准或容量验证。 |
| hash 算法、digest canonicalization、hash chain 分片、gap scan 频率 | 当前只确认 body-free linkage、完整性线索和可追溯约束,不锁算法。 | 详细设计、配置设计、测试方案或 ADR。 |
| source business truth、Governance decision、Artifact lineage、Identity lifecycle、runtime execution truth、archive package | 已被 Step 02 / 03 / 08 排除为本仓非职责 / 非所有权。 | 由对应 truth owner 拥有,本仓只观察、引用、投影或交接。 |
| console UI state、dashboard layout、workspace view、sync private copy | 展示和同步私有状态不拥有 observation truth。 | 产品 / 展示 / 同步层消费本仓只读输出。 |
| 真实 `run_id`、真实 evidence alias、passed evidence、final verdict、signoff | 真实测试与验收阶段产生,设计文档不得伪造。 | 真实测试方案、验收执行和验收签署阶段。 |

### 8.4 轻量取舍对照表

| 当前方案得到 | 当前方案失去 |
|---|---|
| 独立 observation truth 和清晰职责边界 | 纯监控平台的短期接入便利。 |
| Redaction-first 与 forbidden body 边界稳定 | 保存 raw log / payload / evidence body 的调试便利。 |
| Correlation context、safe ref 和 gap 语义统一 | 直接用 opaque id、topic、label、dashboard 维度组织全局查询的便利。 |
| Audit projection、source audit 和 Governance truth 分离 | 审计仓直接裁决治理事实的集中感。 |
| Body-free evidence linkage 和 authenticity hint | 报告材料直接携带 evidence body 的便利。 |
| Report / dashboard / GRC / alert 只读派生 | 派生视图立即成为管理主结构的速度。 |
| Core truth 可同步收口,外围最终一致 | 全同步端到端即时完成感。 |
| 异步送达和后台维护不反写真相 | 全事件化带来的极致解耦。 |
| Retention protection 和 no-write guard 可审计 | cleanup / replay / repair 直接改 source truth 的便利。 |
| 产品中立适配和后续 ADR 空间 | 立即锁定外部 APM / 存储 / dashboard 产品的速度。 |

### 8.5 方案边界说明短文

本章只比较会改变 `L4-observability` 主线结构的相邻替代路径,不比较产品、框架、语言、数据库、时序库、对象存储、APM、dashboard、GRC、alert sink、hash 算法、API、event、topic 或部署平台。source business truth、Governance decision、Artifact / evidence body、Identity lifecycle、runtime / sandbox execution truth、archive package、console UI state 和真实验收材料已经在 Step 02 / 03 / 08 被排除为本仓所有权之外,不再包装成有效备选方案。完整事件溯源、hash chain、外部观测产品、GRC 导出、高级 dashboard 和异常分析是后续演进或实现承载方向,只有当它们改变当前主线结构时才进入本章取舍。当前方案的核心取舍是牺牲短期直接性、工具集中性和即时展示感,换取 observation truth、redaction、evidence linkage、report handoff、retention、no-write 和仓际边界的长期稳定。

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 12. 备选方案与取舍

> 校准来源:
> - `design-calibration/01_arch_step_11_alternatives_tradeoffs.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“当前主线方案”“方案路径比较表”“不进入本章正式比较的方向”“轻量取舍对照表”和“方案边界说明短文”小节,了解本章如何从架构目标、职责边界、运行承载、依赖方向、数据所有权、关键交互和关键技术机制推导路径级取舍。

### 12.1 当前主线方案

摘录 `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` §8.1。

### 12.2 方案路径比较表

摘录 `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` §8.2。

### 12.3 不进入本章正式比较的方向

摘录 `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` §8.3。

### 12.4 轻量取舍对照表

摘录 `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` §8.4。

### 12.5 方案边界说明

摘录 `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` §8.5。
```

---

## 10. 待确认事项

本步不新增阻塞 Step 12 的待确认事项。下列事项进入后续 Step 或后续文档,不得在 Step 11 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|
| `Q-OBS-ARCH-011-001` | 具体数据库、时序库、搜索、缓存、对象存储、queue / broker 产品是否采用 | 后续概要 / 详细设计、配置设计、测试方案和实施计划收敛。 |
| `Q-OBS-ARCH-011-002` | OTel、Prometheus、Grafana、TimescaleDB、APM、GRC、alert sink 是否进入产品组合 | 后续配置设计、测试方案、实施计划或 ADR 收敛。 |
| `Q-OBS-ARCH-011-003` | log / metric / trace / audit / evidence / handoff / retention 的正式对象、schema、字段和状态机 | 后续概要 / 详细设计收敛。 |
| `Q-OBS-ARCH-011-004` | hash、digest、canonicalization、integrity hint、hash linkage 和 gap scan 的算法与测试口径 | 后续详细设计、配置设计、测试方案或 ADR 收敛。 |
| `Q-OBS-ARCH-011-005` | report handoff、evidence index input、dashboard、alert、GRC export 和 archive handoff 的协议级契约 | 后续概要 / 详细设计、测试方案和实施计划收敛。 |
| `Q-OBS-ARCH-011-006` | P95 / P99 / SLA、冷存天数、事件数量、容量、retention window 和 archive handoff 指标 | 后续测试方案、验收标准和容量验证基于真实负载模型收敛。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确当前架构主线方案 | pass | 已在 §8.1 写明独立 observation truth + 正式边界协作主线。 |
| 是否比较路径级替代方案 | pass | §8.2 比较纯监控平台、业务聚合、外部产品主导、audit ledger 反写、report-first、全同步、全异步和 ES / hash-chain-first。 |
| 是否同时写清收益和代价 | pass | 每条路径均有主要收益、主要代价 / 约束和当前结论。 |
| 是否避免产品横评 | pass | 产品、数据库、对象存储、APM、dashboard、GRC 和算法均后置到 §8.3 / §10。 |
| 是否避免 schema / 字段提前硬化 | pass | schema 名称只在历史诊断或不进入比较方向中出现,不作为当前路径结论。 |
| 是否避免把 Observability 写成 source truth | pass | 本文反复明确只拥有 observation / audit projection / linkage / handoff / retention / no-write truth。 |
| 是否避免伪造真实 evidence / run / signoff | pass | report handoff 不生成真实 `run_id`、真实 evidence alias、final verdict 或 signoff。 |
| 是否遵守逐 Step 停审 | pass | Step 11 完成后等待用户确认,不进入 Step 12。 |

| 门禁项 | 状态 |
|---|---|
| gate_status | pass |
| next_allowed_action | wait_user_confirmation_before_step_12 |
| formal_document_write | not_allowed_until_step_16 |
