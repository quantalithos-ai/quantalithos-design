# L4-observability 01-架构设计 Step 01 · 确认需求基线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 1
> 回填章节: `01-架构设计.md` §1 与上游文档的关系声明、§3 约束条件、§16 需求追溯矩阵
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 02

---

## 1. 本步目标

确认当前架构设计依赖的需求结论已经收敛到足以支撑架构推导的程度,并识别哪些需求结论会直接影响系统边界、数据所有权、依赖方向和一致性策略。本步只提炼对架构有约束力的需求结论,不重写需求文档全文,不定义容器、模块、协议、Rust schema、状态机、数据库、外部产品或实现 boundary。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L4-observability/design-calibration/project_execution_ledger.md` | 当前台账 | 确认 `00-需求文档.md` 已完成,用户已同意进入 `01-架构设计.md` Step 01。 |
| `projects/L4-observability/design-calibration/00_requirements_calibration_flow.md` | 需求阶段 Step 17 已完成 | 确认需求 full-restart 已完成,旧材料已降级为 historical material。 |
| `projects/L4-observability/00-需求文档.md` | 新版正式需求基线 | 作为架构设计直接需求基线。 |
| `00_req_step_01_upstream_relation.md` | 已完成 | 提炼上游承接来源、historical material 降级和不重新定义清单。 |
| `00_req_step_02_position_boundary.md` | 已完成 | 提炼本仓定位、非职责、易混淆边界和单独成仓原因。 |
| `00_req_step_06_consumers_dependencies.md` | 已完成 | 提炼依赖裁剪、唯一编译期依赖和禁止依赖。 |
| `00_req_step_07_core_capability_loop.md` | 已完成 | 固定 `C-OBS-1~C-OBS-5` 核心能力闭环。 |
| `00_req_step_10_rules_boundary_constraints.md` | 已完成 | 提炼业务规则、禁止行为、审计约束和边界约束。 |
| `00_req_step_11_data_requirements_ownership.md` | 已完成 | 提炼 truth / snapshot / ref / forbidden body 数据归属。 |
| `00_req_step_14_acceptance_criteria.md` | 已完成 | 提炼验收项、一票否决和真实性边界。 |
| `00_req_step_15_risks_open_questions.md` | 已完成 | 识别后续设计待确认项和一旦发生即阻塞项。 |
| `00_req_step_16_traceability_matrix.md` | 已完成 | 检查需求闭环和漏项。 |
| `projects/L4-observability/README.md` | 旧材料 | 只作为问题诊断来源,不得直接继承技术栈、目录、指标或产品绑定。 |
| 旧 `projects/L4-observability/01-架构设计.md` 与旧 `01_arch_*` 中间产物 | historical material | 只作为差异诊断来源,不得作为当前架构真相源。 |
| `standards/document/架构设计讨论流程_SOP.md` | 已读取 | 约束 Step 01 输出和门禁。 |
| `standards/document/架构设计书写规范.md` | 已读取 | 约束正式回填章节粒度。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 约束编译期 / 运行期 / 事件协作依赖分类。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读取 | 约束后续 schema、port、state、report、evidence 和 boundary 闭口方向。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、需求 flow、正式 00 和架构 SOP / 规范 | done | 本文件 §2 |
| 从新版需求基线提炼架构约束力结论 | done | 本文件 §4、§8.1 |
| 诊断旧 README、旧正式 01 和旧架构 Step 产物中不能继承的口径 | done | 本文件 §5 |
| 选择 full-restart 而非旧文档局部修补 | done | 本文件 §7 |
| 形成架构需求基线、硬约束和未关闭风险 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 01 自检并更新 flow / 项目台账 | done | 本文件 §10 |

---

## 4. SOP 问题回答

### 4.1 当前架构设计依赖哪些需求结论?

| 编号 | 需求结论 | 对架构的约束 |
|---|---|---|
| `ARB-OBS-001` | `L4-observability` 是平台横切观测材料、审计投影与只读报告交接真相仓。 | 架构必须围绕 observation material、audit projection、read-only handoff、retention marker 和 no-write guard 组织,不能退化为 dashboard、日志库或外部 APM 配置仓。 |
| `ARB-OBS-002` | 本仓只承载观测与审计投影,不拥有业务 truth、治理 truth、Artifact / evidence 正文、Identity truth、runtime / sandbox execution truth、archive package truth、console UI truth 或外部产品配置 truth。 | 后续职责、上下文、数据所有权、通信和技术选型都必须显式保护 source truth ownership。 |
| `ARB-OBS-003` | 旧 README、旧 `00~07`、旧 implementation ledger 和旧 implementation boundaries 均为 historical material。 | 架构不得直接继承 OTel / Prometheus / Grafana / TimescaleDB、P95 / SLA、冷存天数、hash chain 分片、旧目录树或旧 boundary。 |
| `ARB-OBS-004` | `C-OBS-1~C-OBS-5` 核心闭环必须成立:安全观测材料入口、审计投影与证据关联、运行观察面安全表达、只读诊断与报告交接、留存与不反写真相边界。 | 架构目标、职责边界、限界上下文、数据所有权、交互方式和横切关注点必须逐项承接五个节点。 |
| `ARB-OBS-005` | 观测材料必须具备可解释来源、安全状态和关联语境,不可解释或不可审计材料不得成为正式观察材料。 | 架构必须预留 source attribution、correlation、redaction / safety marker、accepted / rejected / quarantined 的准入边界。 |
| `ARB-OBS-006` | raw body、secret、credential、完整外部正文、full sensitive ref、raw log、raw prompt、provider response body 和 runtime body 禁止进入本仓正文真相范围。 | 架构必须采用 redaction-first 和 forbidden body boundary;后续 schema / store / report 都不得为这些正文设计保存路径。 |
| `ARB-OBS-007` | 审计投影必须保持只读观察性质,不得替代 Governance decision、Artifact lineage、Identity truth、runtime execution truth 或 source audit truth。 | 架构需要把 audit projection 与 source audit owner、governance truth、artifact truth 和 runtime truth 分开。 |
| `ARB-OBS-008` | 证据关联必须 body-free,只能表达可审计线索、引用语境、摘要、digest / hash linkage 候选或缺口,不得保存 evidence body 或 artifact body。 | 架构必须为 evidence linkage 设计引用 / 摘要 / 缺口边界,并把 body owner 留给 `L1-artifact` 或对应 evidence owner。 |
| `ARB-OBS-009` | 日志、指标和追踪只能表达运行观察面,不得被解释为 runtime / sandbox execution truth、业务成功结论或治理裁决。 | 架构需要把 safe log、metric、trace 和 diagnostic summary 归入观察面,并阻断它们反向裁决执行或业务状态。 |
| `ARB-OBS-010` | 查询、诊断和报告交接必须只读,不得产生隐藏写入、业务修复、执行控制或最终裁决副作用。 | 架构必须隔离 read model、diagnostic、report handoff 和 source write path,并禁止 control command 从本仓发出。 |
| `ARB-OBS-011` | 报告与证据交接只能交接观察材料线索、脱敏状态、缺口说明和可审计引用,不得生成 final verdict、验收签署、真实 `run_id` 或真实 evidence alias。 | 架构需要保留真实性提示和 handoff material 边界,但不得伪造测试 / 验收 evidence。 |
| `ARB-OBS-012` | 留存标记、活动引用保护、重放 / 重建和 no-write violation 是本仓观察面真相,但不得删除仍被引用材料或反写 source truth。 | 架构必须区分 retention marker、archive handoff、rebuild plan、gap scan 和 source truth repair。 |
| `ARB-OBS-013` | `L0-core` 是唯一编译期依赖;`L0-bus` 是事件协作依赖;其他仓通过运行期、事件、引用、摘要或交接协作。 | 架构依赖方向必须裁剪,禁止把 sibling truth repo 写成 package dependency。 |
| `ARB-OBS-014` | 外围增强包括 dashboard、告警、DORA / EBM / ISO 报表、外部 APM / GRC、异常检测和长期分析,不阻塞核心闭环。 | 架构可预留扩展点,但不得让外围产品、报表或工具成为核心 truth 前置。 |
| `ARB-OBS-015` | log / metric / trace / audit event schema、redaction 策略、correlation carrier、digest / canonicalization、report handoff 格式、retention days 和外部产品选型仍待后续文档闭口。 | Step 01 只把这些列为架构必须承接的方向,不得提前定义字段、枚举、算法、产品或测试阈值。 |

### 4.2 这些需求结论里哪些已经稳定?

| 稳定结论 | 判断 |
|---|---|
| 仓定位 | 稳定。`L4-observability` 是横切观测材料、审计投影和只读报告交接真相仓。 |
| truth 边界 | 稳定。本仓拥有观察面内部事实、审计投影事实、body-free 证据关联事实、报告交接事实、留存标记和 no-write violation 记录,不拥有外部业务 truth 或正文 truth。 |
| 核心闭环 | 稳定。`C-OBS-1~5` 均有故事、功能、规则、数据、接口、NFR 和验收承接。 |
| forbidden body 边界 | 稳定。raw body、secret、payload body、evidence / artifact body、identity body、governance decision body、runtime body、archive package body、final verdict 和 signoff 不得入仓。 |
| 只读输出边界 | 稳定。query、diagnostic、report handoff、evidence index input、retention scan 和 rebuild 均不得反写 source truth 或生成最终裁决。 |
| 依赖裁剪 | 稳定。`L0-core` 是唯一编译期依赖;`L0-bus` 是事件协作依赖;其他关系只能运行期、事件协作、引用、摘要或 handoff。 |
| 历史材料处理 | 稳定。旧 README、旧正式文档、旧 implementation ledger、旧 implementation boundaries、旧产品栈和旧指标不作为当前架构真相源。 |
| 验收否决项 | 稳定。核心闭环断裂、forbidden body 入仓、evidence body 入仓、观察面冒充外部 truth、反写 source truth、伪造证据、误清活动引用、非 core 编译依赖、外部产品成为 truth source 或旧材料恢复为新基线均为后续阻塞 / veto。 |

### 4.3 哪些需求结论仍然待确认?

当前没有阻塞架构 Step 02 的需求缺口。下列事项属于后续架构、概要、详细、配置、测试、验收或实施计划阶段的细化问题:

| 待确认事项 | 当前架构处理口径 |
|---|---|
| log / metric / trace / audit event 的具体 schema、字段、状态枚举和安全标签 | Step 01 不定义 schema;后续架构单元、概要对象、详细协议和测试闭口。 |
| redaction、safety marker、accepted / rejected / quarantined 的具体判定策略和配置项 | Step 01 只保留 redaction-first 和 forbidden body 约束;策略与配置后续闭口。 |
| correlation id、trace context、causation、source ref、actor / subject ref、evidence ref 的承载格式 | Step 01 只保留必须基于 `L0-core` typed ref / trace 语境;具体 carrier 后续闭口。 |
| 审计投影、body-free 证据关联、digest、hash linkage、canonicalization 和 chain gap 算法 | Step 01 只保留可追溯、body-free 和缺口显式;算法后续技术选型、详细设计和测试闭口。 |
| report handoff、evidence index input、redaction report 和真实性提示的正式交接格式 | Step 01 只保留只读交接和不伪造证据;格式后续详细设计、测试、验收和实施计划闭口。 |
| 留存期限、legal hold、archive eligibility、活动引用保护和归档交接详细规则 | Step 01 只保留 retention marker、active reference protection 和 no wrongful cleanup;具体规则后续配置 / 验收闭口。 |
| 外部 APM、OTel、Prometheus、Grafana、TimescaleDB、对象存储、GRC、alert sink 或 anomaly analysis 是否进入正式基线 | Step 01 保持产品中立;外部产品只能由后续架构技术选型和配置文档决定。 |
| 观测材料准入、查询、报告交接、事件协作滞后、重放 / 重建窗口和留存冲突处理是否需要量化目标 | Step 01 不继承旧 P95 / SLA;后续测试和验收通过真实口径决定是否硬化。 |
| `implementation_execution_ledger.md` 和 planned boundary skeleton 如何重建 | 仅在正式完成 `07-实施计划.md` 时重建;旧 implementation 资产仍为 historical material。 |

### 4.4 哪些需求会直接影响架构边界?

| 需求 | 影响的架构边界 |
|---|---|
| 本仓只拥有 observation / projection / handoff / marker truth | 必须保留独立 observability boundary,并把 source truth owner 留在 L1 / L2 / L3 / L4 相邻仓。 |
| 观测材料必须先安全准入 | Ingestion boundary 必须区别 accepted、rejected、quarantined、degraded 和 source gap,不能把入口等同业务写入。 |
| redaction 和 forbidden body 是前置边界 | 所有 log / metric / trace / audit / query / diagnostic / report / handoff 输出必须在安全边界之后成立。 |
| audit projection 不等于 source audit truth | Audit projection boundary 与 Governance、Artifact、Identity、runtime / sandbox、bus audit material owner 分离。 |
| evidence linkage 必须 body-free | Evidence linkage boundary 与 evidence / artifact body owner 分离,只允许 ref、digest、summary、gap 和 purpose。 |
| log / metric / trace 不等于 execution truth | Signal projection boundary 与 runtime / sandbox execution boundary 分离。 |
| query / diagnostic / report handoff 只读 | Read / diagnostic / report boundary 与 source write、control command、final verdict 和 signoff 分离。 |
| retention / replay 不得反写真相 | Retention / rebuild boundary 与 archive package、source cleanup、business repair 和 recovery body 分离。 |
| 外部产品不拥有 truth | Adapter / product binding boundary 与 observability domain truth 分离。 |

### 4.5 哪些需求会直接影响数据所有权?

| 数据类别 | 架构影响 |
|---|---|
| Observability 真相数据 | 架构必须为观测材料准入事实、安全处置语境、来源与关联语境、redaction marker、审计投影、body-free 证据关联、安全日志 / 指标 / 追踪观察面、报告交接事实、证据真实性提示、留存标记、活动引用保护、重放 / 重建事实和 no-write violation 记录留出主 truth 承载。 |
| 外部快照数据 | 架构可保留输入来源摘要、审计投影安全摘要、运行状态安全摘要、metric rollup、查询结果语境、诊断摘要、报告交接摘要和重放 / 留存影响摘要,但这些不能替代 source owner truth。 |
| 外部引用数据 | 架构必须通过 source owner / bus event / payload ref、evidence / artifact / governance / identity ref、archive / report / external audit ref 保持 body-free 连接,不能把引用解析成外部正文。 |
| 禁止保存正文 | 架构不得为 raw body、secret、credential、full sensitive ref、业务 payload、evidence body、artifact body、identity body、governance decision body、raw prompt、provider response body、runtime body、final verdict、signoff、archive package 或 recovery body 设计本仓保存路径。 |
| 派生投影与重建 | 架构必须让 projection / rebuild 有正式来源、范围、原因、影响和缺口语境,不得让重建行为修复或覆盖 source truth。 |

### 4.6 哪些需求会直接影响依赖方向或一致性策略?

| 需求 | 影响 |
|---|---|
| `L0-core` 唯一编译期依赖 | 内部 contract、domain、application 和 adapter 边界只能以 `L0-core` 的 shared ref、metadata、trace、error 和 safe marker 作为编译期来源。 |
| `L0-bus` 是事件协作主干 | 事件输入 / 输出通过 bus adapter 协作,但 bus publish / subscribe / ack / retry / dead-letter / replay 主干 truth 不归本仓。 |
| 其他 L1 / L2 / L3 / L4 仓是运行期 / 事件 / 引用 / 摘要协作 | 架构需要 port、adapter、resolver、consumer、publisher、safe summary 和 handoff 边界,不能形成 sibling package dependency。 |
| 材料准入、投影、关联、报告交接和留存必须显式变化 | 一致性策略必须支持幂等、重复检测、gap / degraded 表达、blocked handoff 和 retention conflict,不能用空结果或默认成功补事实。 |
| 投影可重建但 source truth 不可反写 | 一致性策略必须区分强一致写入本仓观察面 truth、最终一致投影 / read model、运行期外部协作和 no-write guard。 |
| 外部依赖不可用不得补造 truth | identity / governance / artifact / runtime / sandbox / archive 不可用时,本仓只能表达 missing、degraded、blocked、not-visible 或 gap。 |

---

## 5. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `01_architecture_calibration_flow.md` | 全部 Step 被标为 pass,`next_allowed_action=assemble_or_next_document`。 | 与用户要求“一次只推进一个 Step,确认后才进入下一 Step”冲突,且旧 Step 产物粒度偏薄。 | 本轮重建 flow,只标记 Step 01 pass,Step 02 等待用户确认。 |
| 旧 `01_arch_step_01_requirements_baseline.md` | 约 81 行,直接列出 `NormalizedLogRecord`、`MetricPoint`、`AuditEventProjection` 等名称级 schema。 | 粒度明显低于 L1-governance / L1-artifact Step 01,且提前滑入 schema 命名,缺少需求基线逐项分析。 | 本文件按 SOP 问题、诊断、取舍、结构化产物和回填草稿重写。 |
| 旧正式 `01-架构设计.md` §1~§3 | 已包含正式架构章节、目标、约束和技术方向。 | 当前没有经过本轮逐 Step 确认,不得作为新版架构基线。 | Step 16 前保持 historical material,不得直接回填或继续扩写。 |
| 旧正式 `01-架构设计.md` 的产品 / 存储 / 性能口径 | 已出现 OTel / Prometheus / Grafana / TimescaleDB、旧 P95 / 数字和产品绑定线索。 | 新版需求已经把这些降级为候选或后续配置 / 测试事项。 | Step 10 / `04` / `05` 重新判断,Step 01 不继承。 |
| 旧 README | 混合仓使命、技术栈、目录结构、性能、冷存、hash chain、dashboard 和开放问题。 | README 不是当前 formal requirement truth,且与新版 00 的分层口径冲突。 | 只作为 historical material 和差异诊断来源。 |
| 旧 implementation ledger / boundaries | 上一轮粗糙实现移交资产仍存在。 | 未经新版 `07-实施计划.md` 重建,不能作为实现门禁。 | 继续保持 historical material;正式完成 `07` 时重新创建 implementation ledger 和 planned boundaries。 |

---

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 架构输入 | 旧 README、旧正式 01 和旧 Step 产物混合。 | 新版 `00-需求文档.md` 为直接需求基线,旧材料只诊断。 | 避免旧口径残留。 |
| Step 01 粒度 | 短摘要式,缺少 SOP 问题逐项回答。 | 与 L1-governance / L1-artifact 对齐,包含问题回答、诊断、取舍、结构化产物、回填草稿和门禁。 | 满足用户要求“到思考深度”和 Step 粒度。 |
| schema 处理 | 提前写具体记录名和字段方向。 | Step 01 只记录 schema 必须后续闭口,不在本 Step 定义 Rust-facing schema。 | 避免跳过 Step 02~10 和 02/03 文档。 |
| 技术产品 | 旧文档倾向绑定 OTel / Prometheus / Grafana / TimescaleDB 等。 | 产品保持候选,必须后续技术选型 / 配置设计闭口。 | 与新版需求 Step 15 一致。 |
| 依赖边界 | 旧 flow 把所有架构 Step 都视为完成。 | 当前只承认 Step 01 完成,Step 02 需用户确认。 | 符合逐 Step 停审要求。 |
| 风险处理 | 待确认项被压缩为少量提示。 | 明确列出不阻塞 Step 02 的 pending items 和后续一旦发生即阻塞项。 | 防止后续 agent 自行补 truth。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接沿用旧 `01-架构设计.md` 与旧 `01_arch_*` 产物 | 快,可以快速进入后续文档。 | 旧产品栈、旧性能数字、旧 schema 名称和旧全 Step pass 状态会继续污染当前链路。 | 不采用。 |
| 方案 B: 只重写 Step 01,并把未来 Step 旧文件降级为 historical material | 保持用户要求的逐 Step 停审,同时不造成未来 Step 伪进度。 | 后续仍需逐 Step 重建。 | 采用。 |
| 方案 C: 在 Step 01 一次性固定 log / metric / trace / audit event schema 和技术栈 | 看似更可落码。 | 越过架构目标、职责、上下文、数据所有权、交互和技术选型 Step,会把未确认字段伪装成结论。 | 不采用。 |
| 方案 D: 把 Step 15 待确认事项全部视为架构阻塞 | 极保守。 | 会让架构 Step 01 承担概要、详细、配置、测试和实施计划职责。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 问题 | 采用口径 | 理由 |
|---|---|---|
| 是否继承旧 P95 / SLA / 冷存天数 / hash chain 分片 | 不继承为硬结论 | 新版需求只把它们列为候选,缺少当前证据来源。 |
| 是否在 Step 01 固定 `NormalizedLogRecord` 等命名 | 不固定 | 记录名、字段和 carrier 属于后续架构 / 概要 / 详细设计闭口。 |
| 是否允许外部 APM / Grafana / Prometheus 成为 truth source | 不允许 | 外部产品只能是 adapter / runtime /配置候选,不能拥有 observation truth 或 business truth。 |
| 是否把 report handoff 写成验收 evidence | 不允许 | report handoff 是只读交接事实,真实 evidence / run / signoff 只能来自真实测试与验收。 |

---

## 8. 结构化中间产物

### 8.1 需求基线结论

| 结论编号 | 需求基线结论 | 架构承接方式 |
|---|---|---|
| `RB-OBS-001` | `L4-observability` 是横切观测材料、审计投影和只读报告交接真相仓。 | 架构围绕 ingestion、audit projection、signal projection、query diagnostic、report handoff、retention / replay 和 no-write guard 组织。 |
| `RB-OBS-002` | 本仓不拥有业务 truth、治理 truth、Artifact / evidence 正文、Identity truth、runtime / sandbox execution truth、archive package truth、console UI truth 或外部产品配置 truth。 | 职责边界、系统上下文和数据所有权必须把 source truth owner 留在相邻仓。 |
| `RB-OBS-003` | 核心能力闭环为 `C-OBS-1~C-OBS-5`。 | Step 02 以后每个架构目标、上下文、容器、数据和交互都必须能回指至少一个核心节点或明确为外围增强。 |
| `RB-OBS-004` | 观测材料入口必须具备来源、关联、安全状态和 accepted / rejected / quarantined / degraded 语境。 | 架构需要独立准入边界和安全处置边界,并保持材料缺口可表达。 |
| `RB-OBS-005` | redaction-first 和 forbidden body 是全仓硬边界。 | 架构必须让所有输出面在 redaction / safety decision 后成立,且不设计 forbidden body 保存路径。 |
| `RB-OBS-006` | audit projection 和 evidence linkage 是 body-free、只读、可追溯的观察面事实。 | 架构需要把 audit projection 与 source truth、evidence body 和 governance decision 分开。 |
| `RB-OBS-007` | safe log / metric / trace 是运行观察面,不是 execution truth。 | 架构需要 signal projection 和 runtime execution owner 分离,并支持缺口 / 降级表达。 |
| `RB-OBS-008` | query、diagnostic 和 report handoff 必须只读,不得生成最终裁决或伪造真实证据。 | 架构需要 read boundary、handoff record、authenticity marker 和 no-write guard。 |
| `RB-OBS-009` | retention marker、active reference protection、rebuild / replay 和 no-write violation 是本仓观察面 truth。 | 架构需要 retention / replay / gap scan 边界,并与 archive package、source cleanup 和 recovery body 分离。 |
| `RB-OBS-010` | `L0-core` 是唯一编译期依赖,`L0-bus` 和其他仓通过事件 / 运行期 / 引用 / handoff 协作。 | 架构依赖方向和后续 implementation plan 必须执行全局依赖裁剪。 |
| `RB-OBS-011` | 外围增强不阻塞核心闭环。 | dashboard、alert、management report、external APM / GRC、anomaly analysis 只能作为扩展点或后续选型。 |
| `RB-OBS-012` | 旧材料和旧 implementation 资产不得直接恢复为当前 truth。 | Step 16 正式装配前必须持续标注旧材料为 historical material,`07` 才能重建 implementation ledger / boundaries。 |

### 8.2 架构硬约束结论

| 约束编号 | 硬约束 | 影响章节 |
|---|---|---|
| `HC-OBS-001` | 不得让 `L4-observability` 拥有、修改、修复、覆盖或删除任何 source business truth。 | §3 约束条件;§4 职责边界;§8 依赖方向;§9 数据所有权;§13 横切关注点 |
| `HC-OBS-002` | 不得保存 raw body、secret、credential、payload body、full sensitive ref、raw prompt、provider response body、runtime body 或其他 forbidden body。 | §3 约束条件;§9 数据所有权;§13 横切关注点 |
| `HC-OBS-003` | 不得保存 evidence body、artifact body、identity body、governance decision body 或 source audit truth 正文。 | §4 职责边界;§9 数据所有权;§10 关键交互 |
| `HC-OBS-004` | Audit projection 不得替代 Governance decision、Artifact lineage、Identity truth、runtime execution truth 或 source audit truth。 | §4 职责边界;§5 系统上下文;§9 数据所有权 |
| `HC-OBS-005` | Safe log / metric / trace、dashboard、alert、summary 和 diagnostic hint 不得反向定义 source truth。 | §4 职责边界;§6 限界上下文;§10 关键交互 |
| `HC-OBS-006` | Query、diagnostic、maintenance、rebuild、report assembly 和 external export 均不得写入 source truth 或下发执行控制命令。 | §4 职责边界;§8 依赖方向;§10 关键交互;§13 横切关注点 |
| `HC-OBS-007` | Report handoff 不得生成 final verdict、验收签署、真实 `run_id`、真实 evidence alias 或 passed evidence。 | §10 关键交互;§13 横切关注点;§15 风险 |
| `HC-OBS-008` | Retention / replay 不得删除仍被审计、诊断、报告、留存、重放或合法保留语境引用的材料。 | §9 数据所有权;§10 关键交互;§13 横切关注点 |
| `HC-OBS-009` | Rebuild / replay 只影响观察面和派生投影,不得修复、删除、覆盖或反写 source truth。 | §9 数据所有权;§10 关键交互 |
| `HC-OBS-010` | 唯一编译期上游限定为 `L0-core`;非 core sibling 仓不得成为 package dependency。 | §8 依赖方向 |
| `HC-OBS-011` | `L0-bus` 投递、ack、retry、dead-letter 和 replay 主干规则不归本仓。 | §5 系统上下文;§8 依赖方向;§10 关键交互 |
| `HC-OBS-012` | 外部 APM、OTel、Prometheus、Grafana、TimescaleDB、对象存储、GRC、alert sink 等不得成为 truth source。 | §11 关键技术选型;§12 备选方案;§13 横切关注点 |
| `HC-OBS-013` | 旧 P95 / SLA / 冷存天数 / hash chain 分片 / 事件数量不得在 Step 01 直接升格为架构硬目标。 | §2 业务背景与驱动力;§3 约束条件;§11 关键技术选型 |
| `HC-OBS-014` | 旧 implementation ledger 和旧 implementation boundaries 不得作为当前实现门禁。 | §14 演进路线;§15 风险;后续 `07-实施计划.md` |

### 8.3 未关闭需求风险结论

| 风险 | 当前状态 | 是否阻塞 Step 02 |
|---|---|---|
| log / metric / trace / audit event schema、字段和状态枚举未定。 | 后续架构 / 概要 / 详细设计职责。 | 否 |
| redaction / safety marker / quarantine 策略与配置未定。 | 后续配置、测试和验收职责。 | 否 |
| correlation carrier、source ref、actor / subject ref 和 evidence ref 格式未定。 | 后续架构、概要和详细设计职责。 | 否 |
| digest / hash linkage / canonicalization / gap 算法未定。 | 后续技术选型、详细设计和测试职责。 | 否 |
| report handoff / evidence index input / redaction report 格式未定。 | 后续详细设计、测试、验收和实施计划职责。 | 否 |
| retention days、legal hold、archive eligibility 和活动引用保护细则未定。 | 后续配置、验收和实施计划职责。 | 否 |
| 外部 APM / storage / dashboard / GRC / alert / anomaly 产品选型未定。 | 后续技术选型和配置设计职责。 | 否 |
| 旧性能指标是否升级为正式目标未定。 | 后续测试方案和验收标准职责。 | 否 |
| planned implementation boundary skeleton 未按新设计重建。 | 后续 `07-实施计划.md` 必须完成。 | 否 |
| Forbidden body 入仓、source truth 反写、伪造真实 evidence、非 core 编译依赖或外部产品成为 truth source。 | 一旦后续发生即阻塞。 | 不阻塞 Step 02,但必须作为硬约束和 veto。 |

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/01_arch_step_01_requirements_baseline.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“当前文档问题诊断”小节,了解本章如何从新版需求基线排除旧架构残留口径。

本文首先承接 `projects/L4-observability/00-需求文档.md` 已收稳的需求基线,再向上追溯全局依赖裁剪规则、`L0-core` 共享契约语境、`L0-bus` 事件协作语境以及 `L1-governance`、`L1-artifact`、`L1-identity` 等相邻 truth owner 的正式边界。本文不重新定义需求、业务规则、数据归属或验收标准,只把这些结论转译为系统结构、职责边界、依赖方向、数据所有权、一致性策略、技术取舍和演进约束。

旧 `README.md`、旧 `01-架构设计.md`、旧 `01_arch_*` 中间产物、旧 implementation ledger 和旧 implementation boundaries 均为 historical material。旧材料中的 OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95 / SLA、冷存期限、hash chain 分片、事件数量、目录结构和旧 implementation boundary 不作为新版架构真相源直接继承。
```

```md
## 3. 约束条件

本章应摘录:

- `design-calibration/01_arch_step_01_requirements_baseline.md` §8.1 需求基线结论。
- `design-calibration/01_arch_step_01_requirements_baseline.md` §8.2 架构硬约束结论。
- `design-calibration/01_arch_step_01_requirements_baseline.md` §8.3 未关闭需求风险结论。
```

```md
## 16. 需求追溯矩阵

本章应承接 `00-需求文档.md` §16 的需求追溯结论,并在架构层补充每个核心需求如何进入职责边界、系统上下文、限界上下文、依赖方向、数据所有权、一致性策略、关键交互、技术取舍和横切关注点。
```

---

## 10. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否只承接新版 `00-需求文档.md` | pass | 旧 README、旧正式 01、旧 Step 和旧 implementation 资产只用于诊断。 |
| 是否逐项回答 Step 01 SOP 问题 | pass | §4.1~§4.6 已覆盖需求结论、稳定项、待确认项、架构边界、数据所有权和依赖 / 一致性影响。 |
| 是否明确架构前提 | pass | §8.1 已输出需求基线结论。 |
| 是否明确硬约束 | pass | §8.2 已输出架构硬约束结论。 |
| 是否明确未关闭风险 | pass | §8.3 已输出不阻塞 Step 02 的风险和后续阻塞项。 |
| 是否提前写容器、数据库、协议、Rust schema、状态机、字段或技术栈 | pass | 本步只做需求基线提炼和历史诊断。 |
| 是否将 observability 写成 source truth | pass | 全文坚持 observation / projection / handoff / marker truth 与 source truth 分离。 |
| 是否保留 Step 内小阶段 | pass | §3~§9 覆盖计划、回答、诊断、取舍、结构化产物和回填草稿。 |
| 是否伪造实现 commit、run_id、evidence alias、验收签署或测试结果 | pass | 未写入任何真实实现或验收证据。 |
| gate_status | pass | 当前 Step 01 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_02 | 必须等待用户确认后才允许进入 Step 02 `明确架构目标与约束`。 |

当前 Step 01 `确认需求基线` 已完成。下一步必须等待用户确认后进入 Step 02 `明确架构目标与约束`,并只创建 / 改写 `design-calibration/01_arch_step_02_arch_goals_constraints.md`。
