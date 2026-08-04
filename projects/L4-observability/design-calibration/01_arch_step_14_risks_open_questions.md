# L4-observability 01-架构设计 Step 14 · 风险与待确认事项

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 14
> 回填章节: `01-架构设计.md` §15 风险与待确认事项
> 生成日期: 2026-07-08
> 状态: 已完成,等待用户确认后进入 Step 15

---

## 1. 本步目标

显式收纳 `L4-observability` 架构校准后仍未关闭、且会影响后续概要设计 / 详细设计 / 配置设计 / 测试验收 / 实施计划判断的风险和待确认事项。

本步不写任务 backlog、TODO 清单、实施动作、最终解决方案、产品选型、接口字段、状态机细节、数据库、时序库、对象存储、消息产品、dashboard 产品、APM / GRC 产品、hash 算法、测试步骤或优化愿望,也不把前文已经收稳的 observation truth、redaction-first、body-free evidence linkage、audit projection 只读、retention protection、no-write guard、产品中立和依赖裁剪结论重新打开。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | Step 13 已完成,用户已确认进入 Step 14 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~13 pass,Step 14 已获用户确认 | 确认本轮只允许推进 Step 14。 |
| `design-calibration/01_arch_step_01_requirements_baseline.md` | 已完成 | 提供需求基线、旧材料处理和一票否决来源。 |
| `design-calibration/01_arch_step_02_arch_goals_constraints.md` | 已完成 | 提供架构目标、不可变约束、当前阶段取舍和非目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供做 / 不做、易混淆职责和禁止隐式行为。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 提供 `L0-core` 唯一编译期依赖、`L0-bus` 事件协作和禁止 sibling truth repo 编译期依赖。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供 truth / projection / reference / forbidden body 分离、强一致 / 最终一致和失败处理口径。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步即时判断、异步材料送达 / 事实传播和后台派生维护三类路径。 |
| `design-calibration/01_arch_step_10_technology_choices.md` | 已完成 | 提供正式承接边界、redaction-first、correlation、audit projection 分离、body-free linkage、retention、no-write guard、幂等顺序和产品中立适配。 |
| `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 提供独立 observation truth + 正式边界协作主线和弃用路径。 |
| `design-calibration/01_arch_step_12_cross_cutting.md` | 已完成 | 提供安全、可追溯、可观测、韧性、性能 / 容量、配置和变更控制横切约束。 |
| `design-calibration/01_arch_step_13_evolution_roadmap.md` | 已完成 | 提供可接受债务、不可接受债务、后续演进项和触发条件。 |
| `projects/L4-observability/00-需求文档.md` §15 | 正式需求基线已完成 | 提供需求层风险与待确认事项。 |
| `design-calibration/00_req_step_15_risks_open_questions.md` | 已完成 | 提供需求层风险候选、裁剪项和当前不阻塞 / 后续阻塞判定。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 14 | 已读取 | 控制本步拆分风险与待确认事项。 |
| `standards/document/架构设计书写规范.md` §4.15 | 已读取 | 控制风险表、待确认事项表和当前处理口径写法。 |
| `projects/L1-governance/design-calibration/01_arch_step_14_risks_open_questions.md` | 已读取 | 参考“风险 / 待确认拆分 + 阻塞判断”的组织方式,不复制治理仓结论。 |
| `projects/L1-artifact/design-calibration/01_arch_step_14_risks_open_questions.md` | 已读取 | 参考“架构风险映射 + 待确认事项挂起”的粒度,不复制制品仓结论。 |
| 旧 `design-calibration/01_arch_step_14_risks_open_questions.md` | historical material,已被本文件替换 | 仅作为旧对象 / schema 式薄产物和错误门禁诊断来源,不继承旧结论。 |
| 旧 `projects/L4-observability/README.md` 与旧 `01-架构设计.md` | historical material | 仅作为旧产品栈、旧指标、旧对象命名、旧留存设想和旧实现假设诊断来源。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 13、SOP Step 14 和书写规范 4.15 | done | 本文件 §2 |
| 读取需求风险 / 待确认事项、旧 Step 14、旧 README / 旧正式 01 和 L1 参考 Step 14 | done | 本文件 §2 / §5 |
| 回答风险、影响范围、待确认事项、前文成立性和阻塞判断问题 | done | 本文件 §4 |
| 输出风险表、待确认事项表和当前处理口径说明 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 14 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 当前还有哪些尚未关闭的架构风险?

当前尚未关闭的正式风险不是“能力还没做完”,而是后续概要、详细、配置、测试和实现阶段可能重新打穿 `L4-observability` 主线边界的问题:

| 风险 | 当前判断 |
|---|---|
| 旧 README、旧正式文档、旧 Step 产物、旧 implementation ledger 或旧 implementation boundary 直接恢复为当前架构基线 | 会让 historical material 越权替代本轮 Step 01~13 已收稳结论。 |
| 观察材料、审计投影、metric / log / trace、diagnostic、dashboard、alert 或 report handoff 被解释为业务 truth、Governance truth、Artifact truth、Identity truth、runtime execution truth 或 archive truth | 会破坏本仓只拥有观察面事实、审计投影和交接线索的定位。 |
| raw body、secret、credential、payload body、raw log、raw prompt、provider response body、runtime body 或其它 forbidden body 在后续对象 / 协议 / 存储 / 输出中入仓 | 会打穿 redaction-first、forbidden body 和安全可见性边界。 |
| evidence body、artifact body、identity body、governance decision body 或 source audit truth 正文被 evidence linkage、audit projection 或 report handoff 接管 | 会让 body-free evidence linkage 退化为正文 ownership。 |
| report handoff、evidence index input 或设计阶段材料静态填写真实测试 run、真实 evidence alias、passed evidence、final verdict、signoff 或最终验收结论 | 会伪造真实测试执行证据或验收签署。 |
| retention、archive preparation、cleanup、rebuild、replay 或 maintenance 被写成可删除活动引用材料、修复 source truth、覆盖外部 truth 或下发执行控制 | 会同时打穿 retention protection 和 no-write guard。 |
| `L0-bus` 事件协作、tap / audit material、replay 主干或 bus 运维语义被写成本仓编译期依赖、bus truth ownership 或总线主干规则 | 会破坏全局依赖裁剪和 bus / observability 分仓边界。 |
| 外部产品、dashboard、alert、APM、external audit / GRC 导出、时序存储、对象存储或配置被误升级为核心前置或 truth source | 会让产品设施反向定义 observation truth。 |
| 旧性能 / 容量 / 留存 / 完整性候选数字被后续测试、验收或配置误升级为当前硬指标 | 会让无来源数字反向定义架构约束。 |
| 同步成功被误写成 dashboard、alert、report、external audit export、archive handoff、GRC export 或派生消费已经完成 | 会制造核心强一致与外围最终一致之间的伪闭环。 |
| 后续 Agent 因对象、API、状态机、字段、存储、配置、产品或测试步骤未定而自行补设计真相 | 会把架构层留白误读为实现侧授权。 |

### 4.2 这些风险会影响哪一层架构结构?

| 风险类型 | 影响范围 |
|---|---|
| 旧材料和旧实现资产回流 | 需求基线、架构目标、技术机制、演进路线、测试验收、实施边界 |
| Observation truth ownership 串线 | 职责边界、系统上下文、数据所有权、一致性策略、验收否决 |
| Forbidden body / body-free 边界失守 | 数据归属、技术机制、横切安全、报告交接、外部审计消费 |
| Report handoff 真实性提示失守 | 关键交互、证据线索、测试方案、验收标准、实施移交 |
| Retention / no-write 越权 | 数据一致性、后台维护、归档交接、恢复边界、横切审计 |
| `L0-bus` 和依赖裁剪失守 | 依赖方向、跨仓协作、技术选型、实施边界、代码组织 |
| 外部产品误入核心 | 系统上下文、技术机制、备选方案、配置设计、容量验证 |
| 旧指标伪量化 | 横切性能、测试方案、验收标准、配置设计、容量模型 |
| 同步 / 异步 / 后台伪闭环 | 通信方式、一致性分层、韧性 / 恢复、消费状态 |
| 文档分层失守 | 概要设计、详细设计、配置设计、测试方案、实施 boundary |

### 4.3 当前还有哪些待确认事项?

当前待确认事项主要是还缺后续设计、配置或测试阶段输入的问题,它们不推翻当前架构边界,但会影响后续能否 1:1 落码和验收:

1. 观察材料、观察事实、审计投影、证据线索、报告交接、留存标记、no-write violation 和派生消费的正式对象、状态集和错误语义。
2. Redaction、safety marker、quarantine / rejected / accepted、not-visible、unsafe output 和 forbidden body 处置策略的配置与测试口径。
3. Correlation context、trace context、source ref、actor / subject safe ref、business safe ref、evidence ref 和 gap 语义的统一承载方式。
4. Audit projection 与 body-free evidence linkage 是否需要 digest、canonicalization、integrity hint、gap scan、事件版本或不可变材料的详细算法 / ADR。
5. Report handoff、evidence index input、redaction report、authenticity hint 和外部审计 / GRC export 的正式交接格式。
6. Retention marker、active reference protection、legal hold、archive eligibility、archive handoff 和 cleanup / replay / rebuild 的详细规则。
7. Query、diagnostic、read projection、dashboard、alert、management report、external audit export 和 anomaly analysis 的只读派生身份、stale / rebuilding / failed 状态和对账恢复口径。
8. `L0-bus` 事件协作、source owner signal、runtime / sandbox signal、Governance / Artifact / Identity / Archive safe ref 和 `L0-sdk` / Console 消费边界的正式协作协议。
9. 完整事件溯源、完整性链、长留存模型、APM / dashboard / alert / GRC / storage 产品组合是否升级为 ADR 级决策。
10. 观测材料准入、核心查询、报告交接、派生重建、外部导出、留存扫描和 no-write violation 处理是否需要正式性能、容量、SLO 和留存窗口。
11. `implementation_execution_ledger.md` 和全部 planned boundary skeleton 如何在重新完成 `07-实施计划.md` 时重建。

### 4.4 哪些待确认项会影响前文结论是否成立?

这些待确认事项不会改变前文已收稳的结论:本仓拥有独立 observation truth,外部正文不入仓,audit projection 只读,body-free evidence linkage 不接管 evidence body,report handoff 不伪造真实验收,retention 只标记观察材料生命周期,no-write guard 覆盖维护和交接路径,非 core sibling 不进入编译期依赖。它们会影响后续设计如何表达对象、状态、协议、事件、持久化、错误、配置、测试和交接。如果后续细化结果选择让外部正文、相邻仓 truth、外部产品、派生视图、报告材料、event stream、archive package 或 implementation boundary 反向定义 observation truth,则会从“待确认事项”转化为阻塞风险。

### 4.5 哪些风险是当前阶段可接受的,哪些会阻塞后续推进?

当前可带约束推进的风险包括:旧产品设施和旧性能数字回流风险、完整 ES / 完整性链 / 长留存模型未定、API / 状态 / schema / 产品承载未定、dashboard / alert / report / external audit / archive handoff 细节未定、implementation ledger 和 planned boundary skeleton 尚未重建。它们不阻塞 Step 15 / Step 16,但必须在后续对应文档正式闭合。

会阻塞后续推进的是:Observation truth 边界不清,forbidden body 或 evidence body 入仓,audit projection / report / dashboard / external export 定义 truth,report handoff 伪造真实证据或验收结论,retention / cleanup / replay 破坏 active reference protection,no-write guard 缺失或反写 source truth,`L0-bus` 或 sibling truth repo 成为编译期业务依赖,外部产品成为 truth source,同步成功伪装外围消费已完成。

---

## 5. 当前文档问题诊断

| 旧 / 前序内容 | 问题 | 本轮处理 |
|---|---|---|
| 需求 Step 15 已列风险和待确认事项 | 需要转成架构层影响范围、当前处理口径和阻塞性。 | 作为本步主要输入,并映射到架构结构。 |
| Step 13 已列可接受债务、不可接受债务和触发条件 | 需要区分哪些是正式风险,哪些只是后续演进或可接受债务。 | 不把所有债务自动写成风险。 |
| 旧 Step 14 以对象 / schema 名称组织“风险与待确认” | Step 14 应拆分风险与待确认事项,不应提前固定对象模型或字段。 | 全部降级为 historical material,本步按风险 / 待确认双表重写。 |
| 旧 Step 14 门禁允许自动跨步或进入正式装配 | 与用户要求一个 Step 一个 Step 停审冲突,且 Step 14 后应等待 Step 15 确认。 | 改为 `wait_user_confirmation_before_step_15`。 |
| 旧 README / 旧正式 01 中的产品栈、性能数字、事件数量、冷存时间和完整性链 | 容易回流为当前架构主线或验收硬指标。 | 写成非阻塞风险和待确认事项,当前只作为历史候选暂存。 |
| API、状态机、schema、存储、配置、产品和测试步骤未定 | 容易诱导后续 Agent 自行补真相源。 | 写成待确认事项,明确不能在实现中脑补。 |
| 旧 implementation ledger / boundaries | 上一轮粗糙实现移交资产仍存在。 | 继续保持 historical material;在重新完成 `07-实施计划.md` 前不得作为实现移交门禁。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险表达 | 对象 / schema 清单和泛边界结论混杂 | 正式风险表,包含影响范围、当前处理口径、阻塞性和说明 | 对齐书写规范 4.15。 |
| 待确认事项 | 易混入 TODO、方案、演进愿望或已收敛 Q 表 | 只保留缺确认且会影响主线判断的问题 | 防止制造伪不确定。 |
| 阻塞判断 | 可接受债务、不可接受债务和后续演进触发可能混淆 | 明确阻塞 / 不阻塞 / 有条件阻塞 | 支撑后续设计审查。 |
| 当前处理口径 | 容易写解决方案或实施动作 | 只写架构层约束、暂存或挂起 | 不越过本步职责。 |
| 旧口径处理 | 旧设施、旧对象名和旧数字可能继续污染主线 | 统一按历史输入暂存,不得压过新版主线 | 防止旧 Draft 回流。 |
| 正式装配 | 旧文件暗示可自动进入下一阶段 | Step 14 完成后停审等待 Step 15 | 对齐用户逐 Step 确认要求。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 汇总全部前序 Q 表和需求层风险 | 信息完整。 | 大量问题已被后续 Step 吸收,会制造伪未定。 | 不采用。 |
| 方案 B: 拆分正式风险和待确认事项,并给出阻塞判断 | 可审查,能支撑后续概要 / 详细 / 配置 / 测试 / 实施。 | 文档较长,需要严格避免写解决方案。 | 采用。 |
| 方案 C: 把 API / 状态机 / schema / 产品未定全部写成阻塞风险 | 看似保守。 | 会让架构文档承担详细设计职责。 | 不采用。 |
| 方案 D: 不保留待确认事项 | 文档干净。 | 会诱导后续 Agent 自行脑补字段、状态、端口、产品或 implementation boundary。 | 不采用。 |
| 方案 E: 把所有可接受债务和后续演进项都写成风险 | 覆盖很全。 | 会把正常分层设计误写成风险页,削弱真正阻塞项。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| API / 状态机 / schema 未定是否阻塞正式架构文档整理 | A. 阻塞 Step 15 / Step 16;B. 不阻塞 Step 15 / Step 16,但阻塞对应概要 / 详细设计或实现 boundary 自行补字段 | B | 架构文档不能下沉详细设计,但实现前必须闭口。 |
| redaction / correlation / evidence linkage / retention 细节未定是否推翻当前架构 | A. 推翻;B. 不推翻,只挂起到后续对象、配置、测试和验收 | B | 当前主线已固定边界和机制,细节需后续文档落码。 |
| 外部产品、完整 ES、完整性链和长留存模型未定是否是架构风险 | A. 未定本身是阻塞风险;B. 未定是待确认事项,产品或范式回流为 truth 才是阻塞风险 | B | 保护架构层和实现层分工。 |
| 旧性能、留存、事件数量和 hash chain 候选数字是否作为当前风险或指标 | A. 直接采用;B. 作为旧口径回流风险和待确认事项,后续由测试 / 验收验证 | B | 当前缺正式负载模型和测量来源。 |
| implementation boundary skeleton 是否现在创建 | A. 当前创建;B. 挂起到 `07-实施计划.md` 完成时统一创建 | B | 用户规则要求完成 07 时创建,架构 Step 14 不伪造实施移交资产。 |

---

## 8. 结构化中间产物

### 8.1 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| 旧 README、旧正式文档、旧 Step 产物、旧 implementation ledger 或旧 implementation boundary 直接恢复为当前架构基线风险 | 需求基线;架构目标;技术机制;演进路线;测试验收;实施边界 | 当前按 historical material 处理,只允许作为诊断线索;任何旧指标、旧对象名、旧 boundary 或旧 evidence 口径进入正式结论前必须重新通过对应 Step。 | 不阻塞 | 风险已识别,只要不回流为当前 truth、产品前置或硬指标,可带约束推进。 |
| 观察材料、审计投影、metric / log / trace、diagnostic、dashboard、alert 或 report handoff 冒充外部 truth 风险 | 职责边界;系统上下文;数据所有权;一致性策略;验收否决 | 当前按本仓只拥有 observation truth、audit projection、body-free linkage、handoff、retention 和 no-write truth 处理;相邻仓只能被引用、投影、消费或交接。 | 阻塞 | 一旦发生会让 Observability 退化为多份 source truth 副本。 |
| Raw body、secret、credential、payload body、raw log、raw prompt、provider response body、runtime body 或其它 forbidden body 入仓风险 | 数据归属;技术机制;横切安全;查询输出;报告交接 | 当前按 redaction-first、safety marker 和 forbidden body 永不入仓处理;后续对象、协议、存储和输出必须继续证明正文不入仓。 | 阻塞 | 该风险命中安全边界和禁止正文一票否决。 |
| Evidence body、artifact body、identity body、governance decision body 或 source audit truth 正文被 evidence linkage、audit projection 或 report handoff 接管风险 | 数据所有权;审计投影;证据线索;report handoff;外部审计消费 | 当前按 body-free evidence linkage、authenticity hint、safe ref、缺口和消费目的处理;正文归相应 truth owner。 | 阻塞 | 一旦发生会让证据关联退化为正文 ownership。 |
| Report handoff、evidence index input 或设计阶段材料伪造真实测试 run、真实 evidence alias、passed evidence、final verdict、signoff 或最终验收结论风险 | 关键交互;证据线索;测试方案;验收标准;实施移交 | 当前按真实性提示和不伪造证据处理;真实证据、验收结论和签署只能来自真实测试执行与验收阶段。 | 阻塞 | 该风险会把设计材料伪装成真实验收材料。 |
| Retention、archive preparation、cleanup、rebuild、replay 或 maintenance 越权清理活动引用或反写 source truth 风险 | 数据一致性;后台维护;归档交接;恢复边界;横切审计 | 当前按 retention marker、active reference protection、archive eligibility、archive handoff 和 no-write guard 处理;重放 / 重建只作用于观察面和派生投影。 | 阻塞 | 一旦发生会同时破坏留存保护和只读观察面。 |
| `L0-bus` 事件协作、tap / audit material、replay 主干或 bus 运维语义被写成本仓编译期依赖、bus truth ownership 或总线主干规则风险 | 依赖方向;跨仓协作;技术选型;实施边界;代码组织 | 当前按 `L0-core` 唯一编译期依赖、`L0-bus` 事件协作边界处理;bus ack / retry / dead-letter / replay 主干不属于本仓。 | 阻塞 | 一旦发生会破坏全局依赖裁剪和 bus / observability 分仓边界。 |
| 外部产品、dashboard、alert、APM、external audit / GRC 导出、时序存储、对象存储或配置误升级为核心前置或 truth source 风险 | 系统上下文;技术机制;备选方案;配置设计;容量验证 | 当前按产品中立适配、只读派生和运行期配置候选处理,不得作为核心通过前置或正式 truth source。 | 阻塞 | 产品和配置只能承载主线,不能定义 observation truth。 |
| 旧性能 / 容量 / 留存 / 完整性候选数字被后续测试、验收或配置误升级为当前硬指标风险 | 横切性能;测试方案;验收标准;配置设计;容量模型 | 当前只保留结构性性能预算和候选量化方向,旧数字不作为硬指标。 | 不阻塞 | 风险已识别,后续若直接继承旧数字则转为阻塞。 |
| 同步成功伪装 dashboard、alert、report、external audit export、archive handoff、GRC export 或派生消费已完成风险 | 通信方式;一致性分层;韧性 / 恢复;消费状态 | 当前同步只证明核心观察判断成立、拒绝、隔离、挂起或失败;外围消费和交接必须有独立状态。 | 阻塞 | 该风险会制造核心强一致和外围最终一致之间的伪闭环。 |
| 完整事件溯源、完整性链、长留存模型或外部产品被过早锁定或被完全遗忘风险 | 技术机制;备选方案;详细设计;ADR;演进路线 | 当前保留 traceability、body-free linkage、handoff trail、gap 和产品中立适配,完整范式和产品承载后续按压力判断。 | 不阻塞 | 当前不锁定不代表排除,但后续不能由实现自行选边。 |
| 后续 Agent 因对象、API、状态机、字段、存储、配置、产品或测试步骤未定而自行补设计真相风险 | 概要设计;详细设计;配置设计;测试方案;实现 boundary | 当前明确这些内容进入后续对应正式文档,不得在实现中临时造字段、状态、端口、mapper、evidence、配置或产品口径。 | 有条件阻塞 | 如果对应设计仍未闭合就进入实现,该风险会阻塞落码。 |

### 8.2 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| 观察材料、观察事实、审计投影、证据线索、报告交接、留存标记、no-write violation 和派生消费的正式对象、状态集和错误语义 | 概要设计;详细设计;测试方案;实现 boundary | 缺对象级 schema、状态集、错误映射和失败语义 | 当前只固定 observation truth、projection、reference、forbidden body 和一致性边界,不预支字段或对象名 | 不影响架构主线成立,但影响后续可落码性。 |
| Redaction、safety marker、quarantine / rejected / accepted、not-visible、unsafe output 和 forbidden body 处置策略的配置与测试口径 | 配置设计;详细设计;安全测试;验收标准 | 缺安全策略、配置项、状态转换、测试断言和验收口径 | 当前按 redaction-first、forbidden body 永不入仓和安全可见性挂起 | 后续不能由配置或实现临时弱化安全边界。 |
| Correlation context、trace context、source ref、actor / subject safe ref、business safe ref、evidence ref 和 gap 语义的统一承载方式 | 概要设计;详细设计;跨仓协议;查询 / 诊断;报告交接 | 缺 typed ref、关联语境、缺口状态、不可见状态和解析失败语义 | 当前按 safe ref、summary、snapshot、signal、gap 和 handoff 协作挂起 | 该事项影响关联可解释性,不允许从 opaque id 反推业务 truth。 |
| Audit projection 与 body-free evidence linkage 是否需要 digest、canonicalization、integrity hint、gap scan、事件版本或不可变材料的详细算法 / ADR | 详细设计;ADR;测试方案;外部审计;归档交接 | 缺算法、事件版本、完整性提示、gap 扫描、重放窗口和证据线索边界确认 | 当前只固定 body-free linkage、authenticity hint、traceability 和 handoff trail | 当前不锁定算法或完整事件范式,也不允许 evidence body 入仓。 |
| Report handoff、evidence index input、redaction report、authenticity hint 和 external audit / GRC export 的正式交接格式 | 详细设计;测试方案;验收标准;外部审计消费;实施计划 | 缺交接 schema、消费者标识、失败状态、缺口说明、真实性提示和导出映射 | 当前按只读交接、缺口说明和不伪造真实证据挂起 | 该事项影响报告和审计消费,不得生成真实验收材料。 |
| Retention marker、active reference protection、legal hold、archive eligibility、archive handoff 和 cleanup / replay / rebuild 的详细规则 | 配置设计;详细设计;archive handoff;测试方案;验收标准 | 缺 hold / release、archive eligibility、活动引用扫描、冲突状态、重放窗口和清理规则 | 当前按留存标记、活动引用保护、冲突显式和 no-write truth 挂起 | 后续不得删除仍被引用材料或修复 source truth。 |
| Query、diagnostic、read projection、dashboard、alert、management report、external audit export 和 anomaly analysis 的只读派生身份、stale / rebuilding / failed 状态和对账恢复口径 | Read model;report;dashboard / alert;external export;reconciliation;测试方案 | 缺派生身份、刷新关系、stale / rebuilding / unavailable / failed 状态和对账恢复语义 | 当前按只读派生、最终一致、外围失败不污染核心挂起 | 该事项影响消费体验和诊断可用性,不能变成写源。 |
| `L0-bus` 事件协作、source owner signal、runtime / sandbox signal、Governance / Artifact / Identity / Archive safe ref 和 `L0-sdk` / Console 消费边界的正式协作协议 | 跨仓协作;事件;adapter;handoff;测试方案 | 缺协议、事件、查询、引用、错误语义、重试、缺口和交接状态 | 当前按运行期接缝、event collaboration、ref、snapshot、safe summary、signal、gap、adapter、handoff 协作挂起 | 该事项影响后续接口和详细设计,不允许源码依赖或 truth 接管。 |
| 完整事件溯源、完整性链、长留存模型、APM / dashboard / alert / GRC / storage 产品组合是否升级为 ADR 级决策 | ADR;技术机制;详细设计;配置设计;实施计划 | 缺对象、状态、事件、重放、留存压力、查询复杂度、产品约束和审计压力确认 | 当前作为后续演进和 ADR 候选挂起 | 当前不锁定,也不排除;不能由实现自行选边。 |
| 观测材料准入、核心查询、报告交接、派生重建、外部导出、留存扫描和 no-write violation 处理是否需要正式性能、容量、SLO 和留存窗口 | 横切性能;测试方案;验收标准;配置设计;容量评估 | 缺正式负载模型、测量方法、阈值来源和验收数据 | 当前只保留结构性性能预算,旧数字不作为硬指标挂起 | 后续不能继承旧数字或随意补数。 |
| `implementation_execution_ledger.md` 和全部 planned boundary skeleton 如何在重新完成 `07-实施计划.md` 时重建 | 项目台账;实施计划;实现移交;后续门禁 | 缺新版 07 正式实施计划、boundary 划分和实现移交规则 | 当前旧 implementation ledger / boundaries 仍为 historical material,只允许在正式完成 `07-实施计划.md` 时按新设计重建 | 该事项不阻塞当前架构 Step 15 / 16,但阻塞实现移交前置。 |

### 8.3 当前处理口径说明短文

本章把已经明确会打穿 observation truth、职责边界、依赖方向、数据归属、一致性分层或关键交互的问题写成风险,把仍缺对象、状态、协议、产品、容量、测试或跨仓交接确认的问题写成待确认事项。风险的当前处理口径只说明如何保守约束或暂存,不写最终修复方案;待确认事项只说明缺什么确认和当前如何挂起,不预支概要 / 详细 / 配置 / 测试 / 实施结论。可接受债务和后续演进项本身不是风险,但如果后续实现用它们绕过 forbidden body、body-free evidence、派生不反写、retention protection、no-write guard 或依赖裁剪,就会转化为阻塞问题。任何不确定项都不得为了形成完整叙事而回填成前文确定结论。

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 15. 风险与待确认事项

> 校准来源:
> - `design-calibration/01_arch_step_14_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“风险表”“待确认事项表”和“当前处理口径说明短文”小节,了解本章如何区分已知架构风险和仍需后续确认的问题。

### 15.1 风险表

摘录 `design-calibration/01_arch_step_14_risks_open_questions.md` §8.1。

### 15.2 待确认事项表

摘录 `design-calibration/01_arch_step_14_risks_open_questions.md` §8.2。

### 15.3 当前处理口径说明

摘录 `design-calibration/01_arch_step_14_risks_open_questions.md` §8.3。
```

---

## 10. 待确认事项

本步不新增阻塞 Step 15 的上游 blocker。§8.2 所列内容均作为后续概要设计、详细设计、配置设计、测试方案、验收标准和实施计划需要继续确认的架构输入,不得在 Step 14 内提前闭口。

| 编号 | 待确认事项 | 当前状态 |
|---|---|
| `Q-OBS-ARCH-014-001` | 正式对象、状态集、错误语义、接口和协作协议 | 后续概要 / 详细设计收敛。 |
| `Q-OBS-ARCH-014-002` | Redaction、safety marker、forbidden body、correlation、safe ref、gap 的策略和配置 | 后续详细设计、配置设计、测试方案和验收标准收敛。 |
| `Q-OBS-ARCH-014-003` | Digest、canonicalization、integrity hint、gap scan、事件版本、完整性链和完整 ES 是否成为 ADR | 后续详细设计、测试方案、ADR 和演进触发收敛。 |
| `Q-OBS-ARCH-014-004` | Report handoff、external audit / GRC export、archive handoff、retention 和 active reference protection 的格式与规则 | 后续详细设计、配置设计、测试方案、验收标准和实施计划收敛。 |
| `Q-OBS-ARCH-014-005` | 外部产品组合、容量目标、SLO、留存窗口和 implementation boundary skeleton | 后续配置设计、测试方案、验收标准和 `07-实施计划.md` 收敛。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确拆分正式风险与待确认事项 | pass | 已在 §8.1 和 §8.2 分别输出风险表和待确认事项表。 |
| 是否说明每项风险的影响范围、当前处理口径和阻塞性 | pass | 风险表包含影响范围、当前处理口径、是否阻塞和说明。 |
| 是否说明每项待确认事项的影响范围、缺失确认和当前挂起口径 | pass | 待确认事项表包含影响范围、缺失确认、当前挂起口径和说明。 |
| 是否把任务 backlog、TODO、最终解决方案或普通愿望写成风险 / 待确认事项 | pass | 全文只保留会影响主线判断的风险和缺失确认。 |
| 是否重写已定结论或把已排除事项重新打开 | pass | 只记录风险与挂起口径,未重开 observation truth、forbidden body、body-free、no-write 和依赖裁剪结论。 |
| 是否误写产品、对象字段、协议细节、测试结果或 implementation boundary | pass | 产品、对象、协议、指标和 implementation boundary 均后移对应文档闭口。 |
| 是否修改正式 `01-架构设计.md` | pass | 本步只更新中间产物、flow 和项目台账,正式文档仍等待 Step 16。 |
| 是否发现上游 blocker | pass | 未发现阻塞 Step 14 完成的上游 blocker。 |
| gate_status | pass | Step 14 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_15 | 必须等待用户确认后才能进入 Step 15。 |
