# L3-capability-hub 03 详细设计 Step 15: 可观测性与审计埋点契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 15
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §14 可观测性与审计埋点契约
> 创建日期: 2026-07-22
> 当前模式: full-restart
> 状态: `03_step_15_completed_continuous_execution`
> 正式文档状态: 当前不修改正式 `03-详细设计.md`;正式装配仍留 Step 19

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 15 `定义可观测性与审计埋点契约` |
| 输出文件 | `design-calibration/03_ddd_step_15_observability_audit.md` |
| 已读取通用规范 | `设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md`、`全局项目依赖关系与裁剪规则.md`，pass |
| 已读取文档类型规范 | `详细设计讨论流程_SOP.md` Step 15、`详细设计书写规范.md` §5.14，pass |
| 已读取项目状态 | `project_execution_ledger.md`、`03_ddd_calibration_flow.md`、Step 14 §§143~151，pass |
| 已读取上游输入 | 正式 `00/01/02`、Step 6~14 相关中间产物，pass |
| 参考项目 | `projects/L1-governance`、`projects/L1-artifact` 的 Step 15 组织粒度；只取框架，不复制领域对象或事件语义 |
| 用户授权 | 用户已确认从 Step 14 完成停审点进入 Step 15 |
| 当前模式 | `full-restart`；旧正式 `03`、README 和旧 Step 15 内容只作 historical material 审计输入 |
| 执行纪律 | 先回答 SOP 问题，再做诊断、取舍、结构化和自检；用户已授权连续执行剩余任务，`R15.16` 完成后由独立 Step 16 中间产物继续承接 |
| blocker | `none`；两项 L0-core design-sync debt 仍是非阻塞债务，不在本批解决 |

本 Step 继续遵守以下硬门禁：observability 不成为 capability access truth；runtime log / metric 不替代已持久化的 traceability、change、impact、reference、report 或 handoff surface；审计、trace、marker 和 diagnostic 只承接 body-free ref、safe summary、closed category 和既有状态；不得把 runtime execution、tools execution、governance approval、method body、SDK client、marketplace listing 或外部 observability store 合并进 Hub。

## 1. Step 状态与分批计划

Step 15 按“先思考、再写入”的小阶段拆分。`R15.x` 是本 Step 内的审查批次，不改变正式章节仍为 §14 的事实。

| 批次 | 主题 | 本批可审查产物 | 状态 |
|---|---|---|---|
| `R15.1` | 开工与必读文档:先思考 | 输入闭包、旧材料初判、SOP 五问初判、模块拆分 | completed_and_consumed_by_R15.2 |
| `R15.2` | 开工与必读文档:再写入 | Step 状态台账、读取清单、Step 14 handoff、输出骨架、历史隔离、进入门禁 | completed_and_consumed_by_R15.3 |
| `R15.3` | 分层与总原则:先思考 | runtime signal / business fact / handoff / report / diagnostic 的主语分类 | completed_and_consumed_by_R15.4 |
| `R15.4` | 分层与总原则:再写入 | accepted / rejected / duplicate / failed / delayed / unsupported / Query no-write 总矩阵 | completed_stop_review |
| `R15.5` | structured log cuts:先思考 | API、application、infra、Worker、Jobs、Port failure 的日志位置推导、83-flow反向覆盖、错误owner审计 | completed_stop_review |
| `R15.6` | structured log cuts:再写入 | 日志埋点表、字段规则、错误分支日志表 | completed_stop_review |
| `R15.7` | metric cuts:先思考 | counter / histogram / gauge 主题与低基数分类 | completed_stop_review |
| `R15.8` | metric cuts:再写入 | 指标埋点表、允许标签和禁止标签表 | completed_stop_review |
| `R15.9` | trace / span / correlation:先思考 | metadata 来源、入口边界、跨协作关联规则 | completed_stop_review |
| `R15.10` | trace / span / correlation:再写入 | trace context、span boundary、correlation 和禁止 payload 表 | completed_stop_review |
| `R15.11` | audit / operations fact:先思考 | accepted truth、derived/report、handoff 和 non-audit 分支归类 | completed_and_consumed_by_R15.12 |
| `R15.12` | audit / operations fact:再写入 | 审计事件表、operations fact 表、source-missing stop 表 | completed_stop_review |
| `R15.13` | redaction:先思考 | 敏感字段、body-free source 和跨仓 handoff 分类 | completed_stop_review |
| `R15.14` | redaction:再写入 | redaction 表、禁止字段表、Step 16/19/04/07 handoff | completed_stop_review |
| `R15.15` | cross-step closure:先思考 | Step 6~14 观测覆盖、重复 owner、phase boundary 和 historical 复核 | completed_stop_review |
| `R15.16` | cross-step closure:再写入 | closure audit、正式 §14 source map、Step 16 entry gate 和 Step 15 stop-review | completed_and_handed_off_to_step_16 |

复杂度判断：本 Step 至少需要日志、指标、trace/span、审计/operations fact、redaction 五组独立小循环，不能用一张总表压缩。structured-log、metric、trace/span、audit/operations fact均已形成final profile；R15.14把10类敏感材料、`Off/Redacted`、required/optional source、actor/ref/safe-text/digest/issue、跨边界和observer failure规则反向应用到155/155 profile。R15.15完成Step 6~14、phase、owner、83/17/51/155与historical交叉审计，R15.16完成最终closure与正式§14 source map；Step 15现已闭合并交给Step 16。

## 2. 本步目标与非目标

### 2.1 必须闭合

1. 实现者能够定位 API、application、infra、Worker、Jobs、repository/UoW、external Port 和 handoff 边界的观测插入点。
2. accepted truth change、derived material、event capture、external collaboration、Job report、handoff marker 与 runtime log / metric 的职责不混淆。
3. rejected、unsupported、duplicate replay、delayed、failed、commit unknown、rollback failed、consistency defect 和 Query no-write 分支具有可观察但不伪造 truth 的表达方式。
4. trace context、safe ref、reason、state、exact record/ref/version、receipt/report ref 的来源能回指 Step 6~14 已闭合对象、协议和 Port；当前 Hub 不定义 generic accepted `source_cursor`。
5. 日志、指标、trace、审计、diagnostic、handoff 的禁止字段和 body-free 边界可交给后续测试与实施计划继续展开。

### 2.2 明确不做

| 不做内容 | 原因 / 后续 owner |
|---|---|
| 不创建通用 `ObservabilityPort`、本地 observability ledger 或第二套 audit truth | Step 7 已有 `ObservabilityAuditReferencePort` 与 `ObservabilityAuditHandoffPort`；L4-observability 拥有外部存储 / 消费边界 |
| 不定义告警阈值、SLO、dashboard、采样率、retention、pager、runbook 或 exporter endpoint | 运维 / 配置 / 部署文档职责，不属于详细设计代码埋点切口 |
| 不新增 public struct、enum、field、variant、error、issue code、state、protocol 或 Port | 观测层只引用已有 carrier；若确需新增，必须回开所属 Step 并执行英文 Rustdoc 门禁 |
| 不保存 raw request/event/provider response、method body、document body、secret、credential、TLS material、topic/offset/lease 或 stack trace | 继承 Step 14 redaction 和全局 forbidden-body 规则 |
| 不把 runtime/tools execution、governance approval、method-library body、SDK response、marketplace listing 或 evidence alias 变成观测字段 | 这些是边界外 truth 或正文 |
| 不把日志、指标、trace 或审计结果作为 recovery、replay、state transition 或 acceptance evidence 的来源 | 正式 truth、UoW、Job journal、stored result 和既有 mapper 才是来源 |

## 3. 必读文档与读取状态

| 输入 | 状态 | 本 Step 承接结论 |
|---|---|---|
| `project_execution_ledger.md` | 已读取 | 从 `R15.2` 停审点恢复并经用户确认进入 `R15.3`；继续逐批停审，不创建 implementation artifact |
| `03_ddd_calibration_flow.md` | 已读取 | Step 14 已完成；Step 15 进入中间产物；Step 16~19保持未开始 |
| `standards/document/详细设计讨论流程_SOP.md` Step 15 | 已读取 | 本 Step 必须输出日志、指标、审计事件切口，并回答五个问题 |
| `standards/document/详细设计书写规范.md` §5.14 | 已读取 | 最终 §14 使用日志埋点表、指标埋点表、审计事件表；不把过程台账回填正式正文 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读取 | 当前遵守开工确认、先思考再写入、模块门禁、三层台账和上下文恢复顺序 |
| `standards/document/设计真相源闭环与可落码性标准.md` §§2.14~2.15 | 已读取 | observability 与 business audit 分层；accepted side-effect inventory 必须逐 flow 闭合；观测不能替代 truth |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | L4-observability 是运行期 / 事件协作边界，不是本仓 Cargo dependency 或业务 truth owner |
| 正式 `00-需求文档.md` | 已读取 | `NFR-CH-018~020` 要求关键状态、变化、异常、依赖延迟、消费失败和维护失败可识别，但不允许观测材料反写真相 |
| 正式 `01-架构设计.md` | 已读取 | Hub 拥有 traceability/change/impact fact；不拥有 observability store truth；外部正文只以 ref / safe summary 承接 |
| 正式 `02-概要设计.md` | 已读取 | 当前主线是 identity、registry、descriptor、seam、relation、exposure、controlled view、derived material 和 external ref，不沿用旧 provider/cost/audit 主线 |
| Step 6 对象契约 | 已读取 | 已有 change record、`CapabilityAccessTraceabilityRecord`、`CapabilityChangeImpactFact`、derived/reference/report/capture/job carriers 可作为观测来源 |
| Step 7 Port / adapter 契约 | 已读取 | 已有 36 个 application-owned Port；external resolver、audit reference、audit handoff、event collaboration 的 owner 已闭合 |
| Step 8 protocol 契约 | 已读取 | 26 Command、33 Query、6 Inbound、10 Outbound、8 Job 的 metadata、receipt、response、capture 和 report surface 已闭合 |
| Step 9 function flows | 已读取 | 83/83 flow 的 accepted/rejected/duplicate/delayed/failed/no-write 分支和副作用顺序是观测切口来源 |
| Step 10 state matrix | 已读取 | 24 个 state-like enum、111 active variants 和 `638 = 239 + 98 + 301` pair 分类已闭合；观测不能发明全局状态 |
| Step 11 persistence / consistency | 已读取 | single authority、UoW、append-only trace/capture、stored result、Job journal 和 commit resolution 是事实来源 |
| Step 12 error / recovery | 已读取 | 17 ApplicationError、51 issue code 和错误优先级已闭合；Step 15 只能观察既有类别 |
| Step 13 concurrency / idempotency | 已读取 | duplicate replay、commit unknown、rollback、exact read、safe reentry 和 digest 规则已闭合 |
| Step 14 config / dependency binding | 已读取 | §§149~151 已给出 Step 15 handoff、redaction 禁止面、配置 / runtime / external / event / job owner和完成门禁 |
| `projects/L1-governance` Step 15 | 已读取 | 只参考“目标 -> 输入 -> 分批 -> 五问 -> 日志/指标/审计 -> redaction -> closure”的组织深度 |
| `projects/L1-artifact` Step 15 | 已读取 | 只参考表格粒度与安全边界表达，不复制 artifact truth、retention 或 evidence 语义 |

## 4. 输入基线、数量基线与 owner 边界

### 4.1 当前可观测性输入基线

| 基线 | 当前结论 | Step 15 的使用方式 |
|---|---|---|
| capability access truth | identity、registry、descriptor、governance seam relation、method relation、formal exposure、traceability/change/impact fact | accepted business audit 和 trace 只能从这些已成立事实或其正式 change record 生成 |
| derived / read surfaces | controlled consumer view、directory/search、audit-friendly export、ecosystem discovery、reconciliation report、reference resolution | 只记录 freshness、availability、revision、report/ref 和安全结果；不能把 material 当 truth |
| event boundary | 10 个 Outbound event family、immutable snapshot/capture、stable intent binding、external collaboration outcome | local capture 与 external delivery 状态分开观察；不生成 local outbox/relay/DLQ/attempt lifecycle |
| entry boundary | API、Worker、Jobs 各自拥有入口生命周期；infra 只做配置和 graph assembly | 入口日志 / 指标记录 safe phase 和 typed disposition；不持有 repository 或 raw config |
| external observability boundary | `ObservabilityAuditReferencePort`、`ObservabilityAuditHandoffPort`、`ObservabilityAuditRef` | 只记录 reference / handoff outcome / safe scope / receipt ref；不读取或保存外部 telemetry / audit body |
| diagnostic boundary | `Off` / `Redacted` profile 和既有 error / issue mapper | 只允许 redacted category、safe summary、typed ref；不扩大 error surface |

### 4.2 当前数量与覆盖基线

| 项目 | 当前基线 |
|---|---:|
| workspace member | 7 |
| application-owned Port | 36/36 |
| repository trait / method | 22/110 |
| Command / Query | 26/26 + 33/33 = 59/59 |
| Inbound source slot | 6/6 |
| Outbound event family | 10/10 |
| Operations Job | 8/8 |
| protocol / flow | 83/83 |
| state-like enum / active variant | 24/111 |
| ordered state pairs | `638 = 239 current + 98 reserved + 301 illegal` |
| ApplicationError / issue code | 17/17 + 51/51 |

数量只用于反向覆盖审计，不授权在本 Step 新增协议、状态、Port 或观测对象。

### 4.3 候选观察面全集（不是最终埋点表）

| 观察面 | 唯一 owner | 允许观察的事实类别 | 当前禁止越界 |
|---|---|---|---|
| `infra/config` validation | infra | validated / rejected / missing source 的 safe category、profile、phase | raw key/value、secret、endpoint、credential |
| `infra/runtime_builder` Stage 0~7 | infra | stage、selected entry、complete predicate、assembly failure category | graph body、raw source chain、partial graph、fallback choice |
| API command / query facade | api + application | protocol family、metadata gate、typed outcome、no-write surface、observation duration | request body、raw response、execution result、domain 自造 trace |
| local authority / UoW / commit resolution | application + persistence owner | transaction phase、commit outcome、rollback / recovery branch、safe transaction ref | staged data、replica guess、log-derived durability |
| Worker activation / inbound | worker + application | source family、schema gate、trusted actor、receipt action、task lifecycle | topic、group、partition、offset、lease、encoded envelope |
| Outbound capture / collaboration | application + collaboration Port | capture source、stable intent、typed collaboration outcome、repair handoff | local delivery state、transport receipt body、route credential、relay state |
| Jobs admission / execution / drain | jobs + application Job owner | job kind、deadline phase、journal disposition、join/drain result、report ref | host scheduler state、attempt counter、queue/lease、raw request |
| external resolver / handoff | named external Port owner | typed resolution / handoff outcome、safe failure class、receipt/ref | provider response body、HTTP/status text、external document/body |
| derived material / report | application maintenance owner | revision、freshness、availability、report/impact refs、safe finding category | repair of core truth、report-as-truth、raw finding body |
| diagnostic / redaction | error owner + boundary owner | existing issue code、safe summary、redaction category、supporting typed refs | new generic error、raw source chain、stack trace、evidence claim |

## 5. Step 14 handoff 承接

| Step 14 handoff | Step 15 初步承接 | 仍需后续批次闭合 |
|---|---|---|
| `Off` / `Redacted` diagnostics | 观测只能输出 safe category、phase、typed ref 和 redacted reason | 每个日志/trace/audit 位置的允许字段清单，R15.5~R15.14 |
| Stage 0~7 runtime builder | 记录 stage success/failure、selected entry、complete predicate 和 partial-prefix disposal | 具体 log level、metric family、span boundary，R15.3~R15.10 |
| 9/9 external Port 与 14/14 callable | 记录 family、phase、typed outcome、failure class 和 retry eligibility | 每个 Port 的日志/指标/审计切口，R15.5~R15.12 |
| 6 Inbound source slots | 记录 source/schema/trusted actor/receipt decision 的 safe category | duplicate、unsupported、delayed、quarantine 和 no-write 观察矩阵，R15.4/R15.6/R15.12 |
| 10 Outbound event family | 记录 immutable capture、stable intent、external outcome 和 repair handoff ref | accepted truth side-effect 与 collaboration outcome 的审计关系，R15.11/R15.12 |
| 8 Operations Job runner | 记录 admission、journal phase、target/final disposition、join/drain 和 report ref | Job-specific metrics、trace/span、operations fact，R15.7~R15.12 |
| single authority / commit resolution | 记录 transaction phase、`Durable` / `NotDurable` / `Unknown` 的既有 resolution | `CommitOutcomeUnknown` 的 critical visibility 与禁止 success/failure audit，R15.6/R15.12 |
| body-free external collaboration | 只承接 exact candidate / capture / intent / outcome refs | 不得从外部状态补造本地 audit、event 或 delivery truth，R15.11/R15.14 |

## 6. SOP 五问初步回答

本节是 `R15.2` 的写入口径，不代替后续日志、指标、trace 或审计最终表。

| SOP 问题 | 初步回答 | 唯一来源 / 后续批次 |
|---|---|---|
| 哪些处理流必须记录审计？ | 只有已接受并写入正式 capability access truth 的变化、已有 traceability/change/impact fact 的形成、正式 derived/report/marker 的合法状态变化、以及已有 handoff / collaboration / Job report surface 的可追溯结果，才可进入 business audit / operations fact。Query no-write、rejected、unsupported、duplicate replay 和未证明 durable 的分支不得伪造成 accepted audit。 | Step 6、9、11、12、13；R15.11/R15.12 |
| 哪些错误分支必须记录日志？ | 至少覆盖 validation rejected、MissingSource、NotConfigured、Port temporary/timeout、typed unavailable、InvalidContract、ConsistencyDefect、CommitOutcomeUnknown、rollback failure、idempotency conflict/in-flight/duplicate、unsupported inbound、receipt rejection、collaboration failure、Job control-plane failure、runtime assembly failure 和 redaction violation。日志只记录既有 error/issue category 与 safe refs。 | Step 12/14；R15.5/R15.6 |
| 哪些关键路径需要指标？ | API command/query、Worker inbound/activation、Outbound capture/collaboration、Jobs admission/target/finalization、UoW/commit resolution、config validation、runtime assembly、external Port availability、derived/report maintenance 和 handoff outcome 都需要候选 counter、duration 或 state-family 指标；具体名称和标签后续逐批闭合。 | Step 8/9/11/14；R15.7/R15.8 |
| 日志、指标、审计字段分别记录什么？ | 日志承载排障上下文、safe phase、operation family、typed outcome、error category 和 typed correlation refs；指标只承载低基数 family/state/result/category；审计/operations fact 承载既有 truth/change/impact/marker/report/handoff refs、state、reason及exact source version。三者都不得保存正文或 secret，且不能互相替代；Hub不补造generic `source_cursor`。 | 真相源标准 §2.14/§2.14-a；R15.3~R15.14 |
| 哪些监控和告警细节应留给运维手册？ | SLO、阈值、告警规则、dashboard、采样、retention、backend、pager、runbook、部署 endpoint、topic concrete value、生产健康阈值和人工修复流程留给运维 / 配置 / 部署文档。本 Step 只定义代码埋点切口和安全字段边界。 | SOP Step 15；`04` 与运维文档 |

## 7. 当前文档问题诊断与 historical material 隔离

### 7.1 当前设计缺口

| 输入位置 | 诊断 | Step 15 处理方向 |
|---|---|---|
| Step 6 对象契约 | change record、traceability、impact、derived、reference、capture、Job report 已有 owner，但尚未按 runtime log / metric / audit 位置汇总 | 先按既有对象和状态建立观察主语索引，不新增 carrier |
| Step 7 Port 契约 | resolver、handoff、collaboration、UoW 和 repository failure 已有 typed surface，入口观测字段尚未逐项落表 | 后续按 Port owner 定义日志/指标/operations fact 切口 |
| Step 8 protocol 契约 | metadata、receipt、response、event capture、Job report 已闭合，但 accepted/rejected/duplicate/no-write 的观测分层尚未形成单表 | R15.3/R15.4 先做分层矩阵 |
| Step 9 flow 契约 | 83 条 flow 已有 side-effect 和 recovery 顺序，但 implementation-level insertion point 尚未逐族展开 | R15.5~R15.12 按 Command/Query/Inbound/Outbound/Job 展开 |
| Step 12 error 契约 | 17 error / 51 issue code 已闭合，critical visibility、redaction 和 no-fabrication 需转成观测规则 | 只复用既有错误类别，不创建观测专用 error |
| Step 14 config / dependency | raw config、runtime assembly、external unavailable、handoff boundary 已闭合 | R15.13已完成敏感材料和跨边界分类；R15.14最终固定config/secret/endpoint不出边界 |

### 7.2 旧材料隔离表

| 旧材料 | 冲突主线 | 当前处理 |
|---|---|---|
| 旧正式 `03-详细设计.md` | `ProviderContract`、`CapabilityDecision`、`CostRecord`、`DeniedInvocationAudit`、KMS/Vault、QueryCapabilities、runtime/tools 调用和旧 audit event | `historical_material`；不把旧对象、字段、指标、topic、成本或 provider 调用观测带入当前 §14 |
| 旧 README | 将 observability、provider、runtime、marketplace 等外围概念混成 Hub 核心职责 | `historical_material`；只保留外部 MCP/A2A/API 集成中心方向线索 |
| 旧 `05/06` | 旧 TC、性能数字、evidence、签署、放行和验收结果 | `historical_material`；本 Step 不声称测试或验收事实 |
| L1-governance Step 15 | GovernanceTrace、GovernanceOutbox、治理专属 accepted audit 和领域指标 | 只参考分批和表格深度，不复制对象、事件名、outbox、retention 或治理语义 |
| L1-artifact Step 15 | artifact body、package、archive、evidence lineage 和 artifact-specific metrics | 只参考 redaction、handoff 和表格粒度，不改变 Hub owner |
| 旧 observability backend 假设 | “日志后端可作为真相 / audit store 必然本地存在 / backend failure 自动降级” | 不继承；必须由现有 Port、error、profile 和下游边界重新证明 |

## 8. 设计取舍记录

| 议题 | 未采用方案 | 当前采用方案 | 依据 |
|---|---|---|---|
| observability store owner | 在 Hub 内新建 observability ledger / audit store | Hub 只拥有 traceability/change/impact 与 body-free audit ref；L4-observability 负责外部观测存储 / 消费 | 正式 `01`、Step 7 Port、全局依赖裁剪 |
| accepted audit carrier | 新建 generic `AuditRecord` 统一承载所有事实 | 复用既有 change record、`CapabilityAccessTraceabilityRecord`、`CapabilityChangeImpactFact`、derived/report/marker/handoff refs | 避免第二 truth 和泛化 payload |
| rejected / failed path | 为所有失败创建“失败业务审计” | 记录 typed log/metric/receipt/report/diagnostic；只有已定义的 operations fact 才形成审计 | Step 9/12 side-effect 与 error precedence |
| Query observation | Query 每次写 audit 或修复 trace | Query 保持 no-write，只允许 runtime log / metric 和已有 read surface | Step 9、Step 12、真相源标准 |
| trace context | domain object 或 observer 自行生成 trace id | 从 core metadata、Inbound envelope 或 Job metadata 承接既有 `TraceId` / context | Step 6/8/真相源标准 §2.14 |
| metric labels | 使用 actor、subject、request、trace、digest、ref 作为 label | 只使用低基数 family、kind、state、result、category；高基数关联走 log/trace/ref | 真相源标准 §2.14 |
| external failure | 保存 adapter response / transport text 方便排障 | 保存既有 typed failure class、safe reason、diagnostic ref、phase 和 correlation ref | Step 12/14 forbidden-body boundary |
| event delivery observation | 在 Hub 添加 outbox/relay/attempt/DLQ/ack 状态 | 观察 local capture、stable intent 和 external collaboration outcome；delivery lifecycle 归外部 Port | Step 8/10/14 |
| operations thresholds | 在 Step 15 写阈值、SLO 和告警 | 只写代码埋点切口，阈值和运维流程后移 | SOP Step 15 |

## 9. Step 15 输出骨架与正式 §14 source map

| 未来输出块 | 必须闭合的内容 | 当前 source / owner | 当前状态 |
|---|---|---|---|
| §14.1 分层与总原则 | runtime log/metric、business trace/audit/history、event capture、handoff/export marker、Job report、diagnostic 的非替代关系 | R15.3/R15.4；Step 6/9/11/12/14 | 六层主语分层和83-flow disposition总矩阵已完成；R15.15确认四plane可共存但不可互为source，canonical source待R15.16 |
| §14.2 Structured log cuts | 位置、级别、字段、目的；含入口、UoW、Port、Worker、Jobs、config 和失败分支 | R15.5/R15.6；Step 8/9/12/14 | 60个final profile、52个独立event key、8个folded profile、字段/owner/error与redaction映射已闭合；formal source待R15.16 |
| §14.3 Metric cuts | 指标名、类型、打点位置、低基数标签、禁止标签 | R15.7/R15.8；Step 8/9/14 | 48个final profile、34 Counter / 12 Histogram / 2 Gauge、closed label与mode/gate已闭合；formal source待R15.16 |
| §14.4 Trace / span / correlation | trace context 来源、span boundary、correlation ref、duplicate/commit-unknown 关联 | R15.9/R15.10；Step 6/8/13/14 | 27个final span、3个fixed event、4类correlation mode、attribute allowlist与phase audit已闭合；formal source待R15.16 |
| §14.5 Audit / operations facts | accepted truth、derived/report、handoff、collaboration、Job report 与 non-audit branch | R15.11/R15.12；Step 6/9/10/11/12/14 | 20个final durable profile、post-Durable admission、minimum projection、83-flow admission与14项hard stop已闭合；formal source待R15.16 |
| §14.6 Redaction / sensitive boundary | body-free source、敏感字段、禁止字段、safe summary / ref 和下游 handoff | R15.13/R15.14；正式 `00/01`、Step 14 | 10类material、`RD-01..RD-16`、155/155 profile投影与hard-stop优先级已闭合；formal source待R15.16 |
| §14.7 Cross-step closure / downstream handoff | Step 6~14 coverage、Step 16 test handoff、Step 19 assembly source、`04/07` boundary 提示 | R15.15/R15.16 | R15.15已形成owner/phase/coverage/historical及instrumentation候选结论；R15.16 final closure待完成 |

正式 §14 只能从本文件后续已完成并自检的 R15 模块装配。正式正文不得回填本文件的 SOP 问题回答、旧材料诊断、方案比较、批次状态或 stop-review 过程。

## 10. R15.2 写入边界

### 10.1 本批允许写入

| 内容 | 本批处理 |
|---|---|
| Step 开工确认 | 已写入，记录标准、上游、模式、授权和 blocker |
| 必读文档与读取状态 | 已写入，包含正式 `00/01/02`、Step 6~14、规范和 L1 参考 |
| Step 14 handoff | 已写入，明确观测候选位置与 owner，不写最终字段 |
| SOP 五问初步回答 | 已写入，作为后续 R15.3~R15.14 的推导入口 |
| 当前文档诊断 / historical 隔离 | 已写入，不将旧正式 `03` 事实重新激活 |
| 设计取舍 | 已写入，锁定 owner / boundary 方向，不新增 public contract |
| 输出骨架与分批计划 | 已写入，R15.3~R15.16 逐批停审 |
| 进入 R15.3 门禁 | 已写入，下一批只允许先思考分层与总原则 |

### 10.2 本批禁止写入

| 禁止内容 | 状态 |
|---|---|
| 最终日志埋点表、日志级别和字段表 | intentionally absent |
| 最终指标名、类型和 label 表 | intentionally absent |
| 最终 trace/span schema、audit event name、operations fact schema | intentionally absent |
| 新 Rust struct / enum / field / variant / trait / callable | delta = 0 |
| 新 error / issue code / state / protocol / Port | delta = 0 |
| test case schema、run、evidence、验收签署 | none claimed |
| implementation ledger、planned boundary skeleton、实现代码 | not created |
| 正式 `03-详细设计.md`、正式 `04-配置设计.md` | not modified / not created |
| 告警阈值、SLO、dashboard、sampling、retention、runbook | intentionally deferred |

## 11. R15.2 自检与停审记录

| 检查项 | 结果 | 说明 |
|---|---|---|
| 通用规范、Step 15 SOP、书写规范已读取 | pass | 读取记录见 §0、§3 |
| 正式 `00/01/02` 与 Step 6~14 上游已读取 | pass | 观测 owner、error、flow、config handoff 已回指 |
| L1-governance / L1-artifact 只作粒度参考 | pass | 未复制其领域对象、outbox、retention 或 evidence 语义 |
| Step 14 handoff 已承接 | pass | §§149~151 与 §5 对齐 |
| SOP 五问已初步回答 | pass | §6；最终表留后续 R15 批次 |
| historical material 已隔离 | pass | §7；旧 provider/cost/runtime/audit 主线未重新进入 |
| owner / phase boundary 未合并 | pass | Hub truth、L4 observability、external Port、runtime/tools、governance、method-library、SDK、marketplace 分离 |
| 本批未新增 Rust 声明 | pass | `rust_declaration_delta = 0`，无新增注释审计对象 |
| 正式文档与实现产物未提前生成 | pass | formal `03/04`、Step 16、implementation ledger、boundary skeleton 均未生成或修改 |
| 未伪造测试 / run / evidence / sign-off / commit | pass | 本批只做设计中间产物 |
| unresolved upstream blocker | none | 仅保留两项非阻塞 L0-core design-sync debt |

## 12. R15.2 stop-review snapshot

```text
current_document = 03-详细设计.md
current_step = 15
current_module = R15.2 开工与必读文档:再写入
gate_status = 03_step_15_r15_2_completed_stop_review
step_15_status = in_progress
r15_1_status = completed_and_consumed_by_r15_2
r15_2_status = completed_stop_review
formal_03_modified = false
formal_04_created = false
step_16_intermediate_created = false
implementation_artifact_created = false
implementation_ledger_created = false
planned_boundary_skeleton_created = false
rust_declaration_delta = 0
unresolved_upstream_blocker = none
non_blocking_cross_repo_design_debts = 2
protocol_flow_coverage = 83/83
application_port_coverage = 36/36
application_error_issue_coverage = 17/17 + 51/51
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_3
```

## 13. R15.2 下一批门禁（已消费）

Step 15 `R15.2` 已完成并停审，用户确认已收到，本门禁已由 `R15.3` 消费。`R15.3` 已回读本文件 §4~§8、Step 14 §149、Step 8/9/11/12/13 的相关闭口，并只处理 runtime signal、business fact、handoff / collaboration、Job report / journal 和 diagnostic 的主语分层。

`R15.3` 不得直接写最终日志埋点表、指标埋点表、trace/span 表、审计事件表、测试 schema、实现代码、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL；正式 `03`、正式 `04`、Step 16 和实现产物仍保持禁止生成。

当前不需要提交 commit；未经用户明确要求不得提交。

## 14. R15.3 授权、回读与写入边界

### 14.1 本批授权与输入闭包

| 项目 | 本批结论 |
|---|---|
| 用户授权 | 已明确同意从 `R15.2` 进入 `R15.3` |
| 三层恢复点 | 开工前已读取项目台账、`03_ddd_calibration_flow.md` 和本文件 `R15.2` snapshot，三者均指向 `R15.3` |
| 标准回读 | 已回读详细设计 SOP Step 15、书写规范 §5.14、真相源标准 §2.14 / §2.14-a 和中间产物规范 |
| Step 14 回读 | 已回读 §149.1~§149.4 的候选位置、owner、redaction 和进入门禁 |
| protocol / flow 回读 | 已回读 Step 8 的 metadata、receipt、capture、Job report 闭口及 Step 9 §40.3~§40.6 的 83-flow side-effect owner 审计 |
| persistence / recovery 回读 | 已回读 Step 11 的 UoW / stored replay / journal / capture 权威，Step 12 的 error / issue / recovery 分类，Step 13 的 duplicate / reentry / commit-unknown 闭口 |
| 参考粒度 | 已复核 L1-governance、L1-artifact Step 15 的分层方式，只采用审查深度，不复制 outbox、artifact、governance 或 evidence 语义 |
| unresolved upstream blocker | `none`；两项 L0-core design-sync debt 仍为非阻塞债务 |

### 14.2 本批只思考什么

本批只回答“一个可观察主语究竟是什么、由谁拥有、哪类载体可承接、能否参与恢复 / replay、能否证明业务事实”。本批不决定日志级别、指标名、metric label、span 名、审计事件名、字段 schema、告警或运维策略。

| 本批允许 | 本批禁止 |
|---|---|
| 对现有 truth、change、traceability、impact、reference、derived、capture、journal、receipt/report、handoff 和 diagnostic 做角色分类 | 新增 generic audit / observability object、repository、Port、state、error、issue code 或 protocol |
| 固定不同层之间允许的单向关联 | 把 runtime signal 变成 replay、recovery、state transition 或验收来源 |
| 识别“本身是持久化事实”和“只是观察该事实”的差别 | 直接写最终日志、指标、trace/span 或审计事件表 |
| 为 `R15.4` 提供 disposition 矩阵的判定规则和列结构 | 提前填 accepted / rejected / duplicate / failed / delayed / unsupported / Query 的最终逐族矩阵 |

`rust_declaration_delta = 0`。本批没有 struct、field、enum、variant、payload、trait 或 callable 变更，因此没有新增 Rustdoc 对象；既有“所有结构体及字段必须有英文 `///` 注释”门禁保持不变。

## 15. 可观察主语的六层分类

### 15.1 分层判定顺序

任何候选“审计 / 观测记录”先依次回答以下问题，不允许先起 event 名再反推含义：

1. 它是否已经是 Step 6~11 定义并由正式 repository / UoW 保存的事实？若是，先归入既有事实层，不得再复制为 generic audit truth。
2. 它是否会被 replay、reentry、commit resolution 或后续 flow 读取？若是，它是 control / continuity authority，不是 runtime signal。
3. 它是否只是某次入口、调用、等待、错误映射或完成耗时的观察结果？若是，只能归 runtime signal。
4. 它是否由外部 Port 拥有？若是，本仓最多观察 typed outcome 或保存既有 body-free ref，不能声明外部交付 / 审计存储真相。
5. 它是否只是 public response、receipt、Job report 或 stored replay envelope？若是，它证明协议结果，不自动证明新的 capability truth。
6. 它是否只有 error / issue category、safe reason 或 supporting refs？若是，归 diagnostic；不得把 diagnostic 当状态、事实或恢复输入。

### 15.2 六层主语总表

| 层 | 主语是什么 | 当前唯一 owner / authority | 允许承接 | 明确不能证明 |
|---|---|---|---|---|
| L1 runtime signal | 一次入口、函数、UoW、Port、Worker task、Job runner 或 runtime builder 的发生、阶段、结果类别、耗时、计数和关联 | 产生该动作的 api / application / infra / worker / jobs 边界；backend 只消费 | structured log、低基数 metric、runtime span / correlation | committed truth、durability、delivery、approval、replay、recovery、验收通过 |
| L2 business fact | capability identity / registry / descriptor / seam / method relation / exposure 的 committed truth，以及六类 change record、`CapabilityAccessTraceabilityRecord`、`CapabilityChangeImpactFact` | domain / application repository 与 local UoW | 既有 typed refs、state、reason、actor、trace id与exact record/source version；runtime signal只能引用其 body-free ref | 外部 observability body、runtime execution、governance approval、method body、SDK / marketplace truth |
| L3 derived / reference / operations fact | controlled view、directory、audit-friendly export、ecosystem summary、reconciliation report、`ReferenceResolutionState` 等已定义 material / reference / report revision | 对应 derived / reference / report repository | revision / freshness / availability / resolution / report ref 与既有 safe finding / reason | core truth 修复、外部正文、验收 evidence、runtime health 反推 |
| L4 continuity / replay fact | idempotency record、stored command result / consumer receipt / Job report envelope、`CapabilityEventPayloadSnapshot`、`CapabilityEventCaptureRecord`、`CapabilityJobExecutionRecord` | application-owned repository、same-UoW contract 与 authoritative read | exact key / digest / result / receipt / report / snapshot / capture / journal ref 和既有 state | 新业务事实、外部 delivery lifecycle、generic audit、从日志恢复 payload / report |
| L5 handoff / collaboration fact | local handoff-request revision、optional body-free audit refs、event stable-intent binding，以及 external Port 返回的 typed outcome | local revision / capture 归 Hub；external handoff / collaboration status 归对应 Port owner | local exact ref、safe scope、stable intent ref、typed outcome、optional receipt ref；仅在既有 flow 明示时进入 report | external store body、delivery receipt body、本地 outbox / relay / attempt / DLQ、交付成功证据 |
| L6 diagnostic issue | 已有 `ApplicationError`、issue code、safe reason、redacted diagnostic ref 和 supporting typed refs | 既有 error / issue mapper 与触发边界 | closed error category、phase、retry eligibility、safe ref / reason | accepted trace、domain state、durability、自动 retry 权限、evidence alias、stack trace正文 |

这六层是角色分类，不是新增 module、enum 或 schema。一个既有 carrier 只能按其正式 owner 发挥作用；运行时可以同时“观察一个 L2/L3/L4/L5 事实”，但观察结果仍是 L1，不会生成该事实的第二份副本。

## 16. 精确载体角色与非替代关系

### 16.1 既有载体角色表

| 现有载体 / surface | 主层 | 可作为后续权威输入 | runtime 观察时只允许引用 | 禁止误称 |
|---|---|---|---|---|
| 六类 `*ChangeRecord` | L2 | traceability、query、event exact-source mapping、impact / material propagation | change ref、kind、from/to state、safe reason、trace id | DB changelog、runtime log、外部 audit event |
| `CapabilityAccessTraceabilityRecord` | L2 | trace query、audit-friendly export、handoff request / summary | exact traceability ref、state、change refs、optional handoff refs | L4 observability ledger、span body、验收审计签署 |
| `CapabilityChangeImpactFact` | L2 | impact query、downstream summary / handoff | exact impact ref、state、body-free summary / related refs | runtime execution result、billing / cost fact |
| `ReferenceResolutionState` | L3 | identity / relation / material / Query / refresh flow 的 canonical reference decision | subject ref、resolution value、safe reason、version | external owner body、resolver response dump、provider health truth |
| derived material / `CapabilityReconciliationReport` | L3 | Query、maintenance comparison、Job detail 和 exact event source | material/report ref、state、freshness、safe counts / finding category | capability core truth、自动修复证明、验收 evidence |
| `CapabilityEventPayloadSnapshot` | L4 | exact post-commit candidate reconstruction | snapshot ref、source ref、schema ref、digest category；serialized bytes不得进入观测 | business event store、local outbox、可日志化 payload |
| `CapabilityEventCaptureRecord` | L4 + local L5 link | crash recovery、stable intent bind、repair Job | capture ref、source ref、`Captured / IntentBound`、stable intent ref | external pending / delivered / failed truth、attempt / retry record |
| external `CapabilityEventCollaborationOutcome` / item | external-owned L5 | existing flow validation、capture bind、repair Job typed item | family、typed status、safe reason、intent / source refs | Hub local delivery truth、accepted capability audit、transport receipt body |
| `CapabilityJobExecutionRecord` | L4 | interrupted reserved Job exact reentry、terminal target assembly | job kind、journal phase、target disposition、safe issue refs | observability journal、scheduler attempt / lease、public report |
| `CapabilityJobReport<T>` / stored report envelope | L3 result + L4 replay | public result、duplicate replay；report detail只能来自 journal assembler | job kind、disposition、report / result ref、typed counts / item categories | core truth、runner log汇总、从 current state 重建的结果 |
| stored command result / consumer receipt | L4 | duplicate replay | operation / consumer family、stored result / receipt ref、typed disposition | accepted trace的替代品、第二次业务处理许可 |
| `ApplicationError` / 51 issue codes | L6 | existing protocol / worker / job error mapping与既定 recovery branch | exact category、phase、safe issue / diagnostic refs | 新状态、新 audit truth、通过字符串推导 retry |

### 16.2 Handoff 必须拆成三个不同主语

| 主语 | 当前事实 | 允许结论 | 禁止结论 |
|---|---|---|---|
| local handoff request | `CapabilityAccessTraceabilityRecord::request_handoff(...)` 形成并提交一个 `HandoffPending` revision，可选关联已解析 audit ref | Hub 已记录“请求交接”及其 body-free scope / refs | 外部系统已接收、已持久化、已验收 |
| external handoff invocation | commit 后调用 `ObservabilityAuditHandoffPort` 得到 typed outcome | 可形成 L1 runtime signal；只有既有 flow 明示的 typed report / issue 才可承接结果 | 失败回滚 local accepted revision、临时新建 handoff marker / receipt / evidence |
| handoff query / export view | Query 读取 exact trace、audit ref/state 或 export summary | 只回显 local persisted body-free事实，保持 no-write | 触发重试、修复 trace、读取 raw audit store 或证明外部 delivery |

`ObservabilityAuditReferencePort` 是 inbound body-free resolution seam；`ObservabilityAuditHandoffPort` 是 outbound handoff seam。两者不得因为都含 audit 字样而合并成观测 store，也不得共用一个“audit succeeded”事实。

### 16.3 Job journal、report 与 runtime signal 必须三分

| 主语 | 形成时机 | 生命周期作用 | 禁止替代 |
|---|---|---|---|
| execution journal | initial / per-target UoW 持久化 frozen plan、terminal outcome 和 run issue | reserved reentry 与 final pure assembly 的唯一 durable source | log、metric、scheduler state、public report |
| typed Job report + stored envelope | final UoW 从 all-terminal journal 纯组装并保存 | caller结果与 completed duplicate replay | journal target恢复、current material重扫、acceptance evidence |
| Job runtime signal | runner admission、dispatch、deadline、drain、join、application return 的观察 | 排障、容量和运行趋势 | report内容、target truth、重入checkpoint、自动重试授权 |

partial / failed / retryable Job report 是该次 Operations Job 的正式结果，不等于 capability truth 失败，也不等于实现测试失败；未来日志和指标只能复制其 closed disposition，不得重新累计或更改报告结论。

## 17. 允许的单向关联图

#### 关联图: Capability Hub 可观测主语与权威事实方向

```text
metadata / inbound envelope / job metadata
                  |
                  v
       operation trace context
          |                 |
          v                 v
L2/L3 committed facts   L1 runtime signals ---------> external telemetry backend
          |                 ^                                   |
          v                 |                                   X
L4 snapshot/capture, stored result, journal/report               |
          |                 |                                   |
          +------ refs -----+        no truth/replay/recovery ---+
          |
          v
L5 body-free handoff / collaboration seam ----> external owner outcome
          |                                      |
          +-------------- typed refs/outcome ----+
                         |
                         v
                 existing report or L1 signal only

L6 diagnostic issue <--- existing error / contract / recovery classification
          |
          +---- safe refs/categories only; never creates L2/L3/L4/L5 truth
```

关键说明：
- trace context 从 metadata / envelope 向下传播；domain object、logger、metric backend 和 adapter不得自行生成第二 authority。
- L1 可以引用 L2~L6 的 body-free ref / closed category，任何 L1 backend 输出都不能反向驱动 replay、recovery 或状态迁移。
- external outcome 只按既有 flow 进入 capture binding、typed report或 runtime signal，不自动成为 Hub-owned delivery / audit truth。
- snapshot 中的 serialized envelope 是恢复输入，但不是允许写入日志、trace attribute 或 diagnostic 的字段。

## 18. 边界场景判定记录

| 场景 | 正确分层 | 本批裁决 |
|---|---|---|
| accepted Command 已提交 truth / records / trace / capture / stored result | L2 + L4 已在 local UoW成立；L1只观察 | observer不得追加第二 audit，也不得因打点失败否定 commit |
| stable rejected Command 保存 replay surface但无 truth mutation | L4 stored result + L6 issue，可有 L1 | stored rejection不升级为 accepted business trace |
| Query visible / empty / not-visible / degraded | public read surface + L1 | zero L2~L5 write；不得以“访问审计”为由开启UoW |
| Inbound accepted / ignored / duplicate | declared ref/state/summary + receipt按Step 9成立；duplicate只读L4 receipt | 不能把 Worker completion log当 receipt，也不能为 duplicate新建trace/capture |
| unsupported Inbound schema | L6 typed unsupported issue + receipt / Worker action + L1 | header-first停止；不得解析或记录payload，不写accepted trace |
| local event source commit后 external collaboration失败 | L2/L3 source与L4 snapshot/capture仍成立；external L5 outcome + L1 | 不回滚source，不复制external failed为local delivery state |
| Job target已提交、final report前崩溃 | L4 journal是恢复authority | 不从日志、metric、current material或external status重建结果 |
| completed Job duplicate | L4 stored report envelope恢复原detail；当前response临时标记duplicate | 不重跑scan/resolver/handoff/collaboration，不新增Job operations fact |
| commit outcome `Unknown` | L1 critical runtime visibility + L6 existing error；authority resolution决定事实 | 未resolution前不得记录accepted或not-durable业务结论；日志不能决定结果 |
| rollback failure / consistency defect | L6 exact issue + L1 | 不伪造成normal failed target / accepted audit，不自动创造恢复动作 |
| runtime builder Missing / Disabled / Fake / Configured | startup binding decision + L1 | Missing阻塞；Disabled显式关闭；Fake只允许对应profile；观测不得改变四态 |
| audit-friendly export Ready / Partial / Unavailable | L3 persisted derived material | 只是body-free export summary，不是外部audit body、evidence或验收签署 |

## 19. R15.3 设计取舍与反例关闭

| 争议 | 被否决的简化 | 当前裁决 |
|---|---|---|
| “所有可追踪内容都叫 audit event” | 用一个 generic event 混装 change、capture、handoff、Job report 和错误 | 保留六层角色与既有 carrier；最终审计表只能引用已有事实写入点或明确 non-audit |
| “日志成功即可证明处理成功” | 以 success log 代替 committed record / receipt / report | 成功只能由local authority、stored surface或typed external outcome证明；日志仅观察 |
| “handoff pending 等于外部已接收” | 从local state推断external delivery | local request、external invocation、query view三分，禁止推断 |
| “Job report 可从日志汇总” | finalizer扫描日志或metric重建target detail | report只从all-terminal journal纯组装，duplicate只从stored envelope读取 |
| “capture 是 outbox / delivery audit” | 给capture补pending/failed/retry/attempt | capture只闭合snapshot恢复和stable intent binding；external lifecycle不归Hub |
| “diagnostic 能指导任意重试” | 从错误文本、stack或backend告警决定retry | 只使用Step 12/14既有typed outcome、error class和已授权recovery分支 |
| “Query也应写审计以便追责” | 每次Query追加read audit | 当前协议与flow明确no-write；只允许L1 signal，未来如需access audit必须回开上游契约 |

本批没有发现需要回开 Step 6~14 的 schema、owner、Port 或 state 缺口。现有 carrier 足以支持后续埋点设计；因此禁止在 `R15.4` 借“审计完整性”新增对象或写路径。

## 20. R15.3 自检与停审快照

### 20.1 本批自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| runtime signal 与 persisted fact 已分开 | pass | L1 不参与 truth、replay、recovery 或 acceptance |
| business / derived / continuity owner 已分开 | pass | L2/L3/L4 分别回指现有 repository / UoW 契约 |
| handoff / collaboration owner 已分开 | pass | local request / capture binding与external typed outcome不合并 |
| Job journal / report / runner signal 已分开 | pass | journal是恢复源，report是结果 / replay，runner signal只观察 |
| Query no-write、duplicate no-rerun 已保留 | pass | 未新增 audit write、repair或第二次 accepted effect |
| raw body / secret / transport字段未进入分类 | pass | serialized snapshot bytes只保留为L4恢复内容，不允许观测输出 |
| generic observability/audit object增量 | `0` | 无新object、repository、Port、error、issue、state或protocol |
| Rust声明与注释增量 | `0` | 未新增 / 修改struct、field、enum、variant、payload、trait、callable |
| unresolved upstream blocker | `none` | 两项L0-core同步债务仍非阻塞 |
| 正式与实现产物 | unchanged / absent | formal `03/04`、Step 16、implementation ledger、boundary skeleton均未生成或修改 |
| 伪造事实 | `0` | 未声称测试、run_id、evidence alias、sign-off或commit |

### 20.2 Stop-review snapshot

```text
current_document = 03-详细设计.md
current_step = 15
current_module = R15.3 分层与总原则:先思考
gate_status = 03_step_15_r15_3_completed_stop_review
step_15_status = in_progress
r15_2_status = completed_and_consumed_by_r15_3
r15_3_status = completed_stop_review
r15_4_status = pending
formal_03_modified = false
formal_04_created = false
step_16_intermediate_created = false
implementation_artifact_created = false
implementation_ledger_created = false
planned_boundary_skeleton_created = false
rust_declaration_delta = 0
unresolved_upstream_blocker = none
non_blocking_cross_repo_design_debts = 2
protocol_flow_coverage = 83/83
application_port_coverage = 36/36
application_error_issue_coverage = 17/17 + 51/51
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_4
```

### 20.3 下一批门禁

`R15.3` 已完成并停审。用户下一次明确确认后，只允许进入 `R15.4 分层与总原则:再写入`，把本批六层分类应用到 accepted / rejected / duplicate / failed / delayed / unsupported / Query no-write 的逐 flow-family 总矩阵。

`R15.4` 必须至少包含：flow family、protocol disposition、已成立的L2/L3事实、L4 continuity/replay surface、L5 handoff/collaboration surface、L6 diagnostic、允许的L1观察以及禁止伪造项。它不得写最终日志级别、指标名、span名或审计事件名，也不得新增 schema / Port / state / error。

当前不需要提交 commit；未经用户明确要求不得提交。

## 21. R15.4 授权、写入规则与判定词典

### 21.1 本批授权与输入闭包

R15.4 进入时已在三层恢复台账中切换为 in-progress。本批只把 R15.3 的六层分类应用到既有 83 条 protocol-flow；不创建新的观察对象，也不改变 Step 6~14 已成立的协议、state、Port、error 或 UoW。

| 回读输入 | 本批使用方式 | 冲突处理 |
|---|---|---|
| Step 8 protocol contracts | 读取每个 protocol 的 closed response disposition、receipt、capture、stored result 和 Job report surface | 以 Step 8 当前闭口为准，不用旧正式 03 的 provider/runtime 主线 |
| Step 9 function flows | 读取 83 个独立 flow 的 exact effect、no-write、post-commit 和 replay authority | 每个 flow 必须在本批矩阵出现一次，不能以 generic family 行代替 |
| Step 11 persistence / consistency | 确认 L2/L3/L4 的 repository、UoW、snapshot、journal 和 commit-resolution authority | runtime observation 不能反向成为 persistence truth |
| Step 12 error / recovery | 复用既有 17 个 ApplicationError、51 个 issue code 和 typed disposition mapping | 不从日志文本、transport status 或 adapter private code 推导新分类 |
| Step 13 concurrency / idempotency | 固定 duplicate、winner read、commit unknown、rollback failure 和 no-rerun 规则 | duplicate 不重跑业务、不新增 accepted truth、trace、capture 或 external collaboration |
| Step 14 config / external binding | 固定 API、Worker、Jobs、external Port 和 local capture 的 owner 边界 | 不把 physical route、topic、scheduler、credential 或外部存储引入本批 |

### 21.2 矩阵列的规范含义

下列 profile token 是本中间产物的编辑性引用，不是 Rust identifier、schema、enum、field、Port 或实现要求。每个 token 在本节有唯一展开定义；矩阵中的 token 与展开文字共同构成规范。

| token | 展开定义 |
|---|---|
| CMD-L4 | Command 的 idempotency reservation、accepted/rejection stored result、result ref 和 declared snapshot/capture 由同一 accepted local UoW 承接；completed duplicate 只读取 exact stored surface |
| Q-L4 | Query 严格 no-write；不 reserve、不保存 stored result、不 append trace、不 capture、不创建 replay surface；如需显示既有 L4 ref，只能 exact read |
| IN-L4 | Inbound 的 receipt、idempotency completion 和声明的 ref/state/summary effect 按 flow 同一 UoW；DuplicateReplayed 先 exact-read stored receipt；Delayed/UnsupportedSchema 不形成 completed receipt |
| OUT-L4 | Outbound source revision、完整 payload snapshot、初始 Captured record 同一 source-owning UoW；post-commit bind 只能把同一 capture 从 Captured 推到 IntentBound |
| JOB-L4 | Job 的 deterministic plan、Reserved idempotency record、execution journal、per-target terminal outcome、final typed report/envelope 和 Completed reservation 按既有 phase 原子化；duplicate 只读 typed stored report |
| H0 | 本 flow 不拥有 handoff/collaboration；只允许引用既有 local ref 或 follow-up marker，不能调用 external handoff/collaboration Port |
| H1 | 本 flow 形成 Hub-owned local handoff request 或 trace revision；external invocation 仅在既有 flow 的 post-commit 位置发生，结果不回滚 local truth |
| H2S | 本 flow 形成 source capture，但不在本 flow 调用 external collaboration；后续 collaboration 只能由既有 post-commit facade 或 repair Job 继续，local state 最多是 Captured/IntentBound |
| H2C | 本 flow 从 official stored snapshot/capture 调用 external collaboration 并取得 typed outcome；external status 归 Port owner，local state 最多是 Captured/IntentBound |
| H3 | 本 flow 只查询既有 handoff/reference/collaboration ref；不触发 retry、repair、handoff 或 delivery |
| D-CMD | L6 使用既有 protocol rejection 或 ApplicationError/issue mapper；MissingRequiredField、InvalidField、InvalidScope、PolicyRejected、BodyForbidden、DuplicateConflict 等保持原 owner |
| D-Q | L6 使用 Query 的 closed visibility/degraded marker 和既有 ApplicationError；NotVisible、normal missing、degraded body 不能升级为 Command rejection |
| D-IN | L6 使用 receipt 的 Rejected、UnsupportedSchema、Quarantined、Delayed 及既有 issue ref；matching Port shape defect 必须是 ConsistencyDefect |
| D-OUT | L6 使用 source UoW error、typed external outcome 或既有 PortFailure/ConsistencyDefect；不能把 external failed/unavailable 改写为 local business failure |
| D-JOB | L6 使用 journal/report 的 declared target issue、Failed/Retryable/PartiallyCompleted 或既有 ApplicationError；不能从 runner signal 累加出 report disposition |
| O-ENTRY | L1 允许观察 entry admission、protocol/schema validation、operation family、phase、typed disposition、耗时和 safe correlation ref |
| O-READ | L1 允许观察 resolver-first、read count category、visibility/freshness、Port result category、耗时和 safe correlation ref |
| O-WRITE | L1 允许观察 reserve、UoW phase、save/append/capture、commit-resolution、rollback 和 post-commit boundary；不记录 staged body |
| O-COLLAB | L1 允许观察 capture continuation、external Port typed status、bind phase 和安全 ref；不证明 delivery 或 audit success |
| O-JOB | L1 允许观察 admission、plan、journal、target ordinal category、deadline、drain、join 和 finalization；不代替 journal/report |

### 21.3 各协议族 disposition 语义

| 协议族 | exact disposition / surface | 本批的权威来源 | 不能用 runtime signal 替代 |
|---|---|---|---|
| Command | Accepted、DuplicateReplayed；稳定业务/协议拒绝为 Rejected；技术异常仍为 ApplicationError | CapabilityCommandResponse、CapabilityProtocolRejection、stored result、idempotency | accepted truth、stored replay 或 rejection result |
| Query | Visible、NotVisible、Degraded；单体/分页 body 按具体 Query card 决定 | CapabilityQuerySurface、resolver decision、exact repository read | visibility、freshness、body presence 或 no-write |
| Inbound | Accepted、DuplicateReplayed、Delayed、Ignored、Rejected、UnsupportedSchema、Quarantined | CapabilityInboundEventReceipt、source header gate、consumer UoW | receipt、source processing completion 或 local effect |
| Outbound | local Captured/IntentBound；external Candidate/PendingDelivery/Delivered/Failed/HandoffUnavailable | source UoW、payload snapshot/capture、CapabilityAccessEventCollaboration outcome | external delivery truth、second event 或 source rollback |
| Operations Job | Completed、PartiallyCompleted、Failed、Retryable、DuplicateReplayed、Rejected | execution journal、typed Job report/envelope、idempotency | target outcome、retry authorization 或 report detail |

### 21.4 通用负面规则

1. Accepted 只表示既有 flow 已提交其声明的 local effect；不得扩展为 external delivery、governance approval、runtime execution、tools execution、marketplace listing 或验收通过。
2. Rejected、Delayed、UnsupportedSchema、Quarantined 和 Query NotVisible/Degraded 只使用既有 typed surface；不得保存 raw request/event/provider response、method body、document body、secret、credential、TLS material、topic/offset/lease 或 stack trace。
3. DuplicateReplayed 只从既有 stored result、receipt 或 Job report 恢复；不重新解析当前 truth、不重新调用 resolver、不追加 trace/change/capture、不重复 external call。
4. CommitOutcomeUnknown、TransactionRollbackFailed 和 ConsistencyDefect 的安全观察可以是 critical diagnostic，但在 authority resolution 前不能宣称 accepted、failed、not-durable 或 zero-effect。
5. Query 所有 flow 的 Q-L4 是硬约束；访问审计不是本批新增写入理由。

## 22. R15.4 Command disposition / fact / observation matrix

### 22.1 Command family shared rule

26 条 Command 都遵守以下顺序：entry closed metadata gate -> application exact service -> idempotency reserve -> exact loaded owner/version -> domain/member calls -> declared truth/change/trace/material/capture writes -> stored result and idempotency completion -> commit -> optional post-commit collaboration。稳定拒绝若发生在 reserve 后，只能保存既有 rejection surface；技术失败回滚当前 UoW。下表中的 Rejected 不表示把 ApplicationError 伪装成协议 rejection。

| # | flow | exact disposition | established L2/L3 fact | L4 continuity / replay | L5 handoff / collaboration | L6 diagnostic | allowed L1 observation | forbidden fabricated truth / side effect |
|---:|---|---|---|---|---|---|---|---|
| C01 | command_establish_capability_access_context_flow | Accepted; DuplicateReplayed; Rejected | identity create/revision、source reference/state、review fact、identity change/trace | CMD-L4; identity/reference capture only for actual revisions | H2S for declared identity/reference captures; external outcome is not accepted identity fact | D-CMD; source/identity/key policy rejection or existing typed error | O-WRITE: intake validation、reserve、identity/source/review phase、capture count、commit outcome | 不伪造 identity from source payload、governance approval、runtime authorization 或 duplicate second identity |
| C02 | command_correct_capability_identity_flow | Accepted; DuplicateReplayed; Rejected | exact identity correction、related identity refs、ordered identity change records、traceability revision | CMD-L4; stored result carries exact correction effect refs | H2S only for actual identity change capture; no external success claim | D-CMD; stale/current-key/related-set policy rejection、ConsistencyDefect | O-WRITE: exact owner loads、key winner check、CAS、rollback/commit | 不从日志重建 correction、不创建 cascade delete、不给 loser 伪造 merged identity |
| C03 | command_retire_capability_identity_flow | Accepted; DuplicateReplayed; Rejected | identity retired change record and trace; dependent registry guard remains separate | CMD-L4; one exact stored result; capture only after actual retire | H2S for identity changed capture; external outcome separate | D-CMD; already-retired/active-dependent policy rejection or typed error | O-WRITE: lifecycle guard、CAS、UoW、capture and commit resolution | 不把 retire 请求扩展为 registry cascade、runtime revoke 或 external delivery |
| C04 | command_record_capability_access_review_fact_flow | Accepted; DuplicateReplayed; Rejected | access-review fact revision、optional superseded review、identity attachment、matching change/trace | CMD-L4; exact review result and idempotency completion | H2S for actual identity/review change capture; review is not approval handoff | D-CMD; missing/current-review/policy-body rejection | O-WRITE: review validation、current-link read、append order、commit | 不伪造 governance approval、vote、Policy truth 或 duplicate second review |
| C05 | command_register_capability_in_registry_flow | Accepted; DuplicateReplayed; Rejected | active identity -> registry entry Registered、registry change/trace | CMD-L4; registry result and exact capture refs in effect summary | H2S for registry changed capture; no reconciliation report claim | D-CMD; identity/uniqueness/basis policy rejection | O-WRITE: active identity gate、current-registry uniqueness、reserve/CAS/commit | 不把 registry registration 当 FormalVisible、runtime allowlist、marketplace listing 或 execution readiness |
| C06 | command_update_registry_lifecycle_state_flow | Accepted; DuplicateReplayed; Rejected | exact registry lifecycle transition、registry change/trace | CMD-L4; no-op/rejected surface is not accepted registry change | H2S for actual registry change capture | D-CMD; route-owned transition rejection、stale/version conflict、typed error | O-WRITE: target-state gate、expected version、actual delta、commit | 不让此 route 形成 FormalVisible/Retired 专属效果、不把 no-op 写成 change |
| C07 | command_update_registry_visibility_basis_flow | Accepted; DuplicateReplayed; Rejected | registry visibility-basis revision、forced VisibilityPending when declared、change/trace | CMD-L4; exact basis result and capture only on actual delta | H2S for registry changed capture; no runtime visibility decision | D-CMD; same-basis/policy/body-forbidden rejection | O-WRITE: basis validation、policy-derived target、material stale propagation、commit | 不伪造 runtime/search/marketplace authorization、不把 caller basis 直接写成 FormalVisible |
| C08 | command_retire_capability_registry_entry_flow | Accepted; DuplicateReplayed; Rejected | registry Retired change record/trace; identity remains separately owned | CMD-L4; exact retire result and capture | H2S for registry capture; no implicit identity retire | D-CMD; terminal/illegal/cascade request rejection | O-WRITE: current entry guard、expected version、retire UoW、capture | 不删除 identity、descriptor、exposure 或把 external listing 撤销当本地事实 |
| C09 | command_establish_adapter_descriptor_flow | Accepted; DuplicateReplayed; Rejected | adapter descriptor create/Accepted or Unresolved、registry binding、descriptor change/trace; safe summary/ref state if declared | CMD-L4; descriptor result and declared captures | H2S for descriptor/reference change capture; resolver outcome remains typed dependency result | D-CMD; source/document owner/kind/body rejection、resolver error、ConsistencyDefect | O-WRITE: prerequisite chain、resolver gate、descriptor factory、registry bind、commit | 不保存 provider response、secret、method body、runtime adapter instance 或 marketplace metadata |
| C10 | command_replace_adapter_descriptor_flow | Accepted; DuplicateReplayed; Rejected | old descriptor Replaced + new descriptor accepted/unresolved、registry binding、two trace revisions | CMD-L4; old/new refs and stored result are exact; no duplicate replacement | H2S for descriptor changed captures; external resolver/collaboration status separate | D-CMD; current descriptor/version/source/document rejection; typed resolver defect | O-WRITE: old/new symmetry、bind order、CAS、capture and commit | 不重建 current descriptor from logs、不把 replacement accepted 当 provider health 或 execution success |
| C11 | command_record_descriptor_risk_constraint_summary_flow | Accepted; DuplicateReplayed; Rejected | descriptor risk/constraint summary revision、descriptor change/trace | CMD-L4; exact summary result; capture only actual revision | H2S for descriptor changed capture | D-CMD; invalid summary/body-forbidden/stale descriptor rejection | O-WRITE: summary factory category、expected version、append/capture | 不把 risk summary 当 runtime policy decision、cost/quota、安全审批或 raw scan result |
| C12 | command_attach_descriptor_secret_reference_flow | Accepted; DuplicateReplayed; Rejected | opaque secret reference and safe handling summary histories、descriptor change/trace | CMD-L4; only opaque ref/state/safe summary refs | H2S for descriptor/reference capture; secret resolver outcome remains external typed observation | D-CMD; secret body/credential/TLS material forbidden、owner/version mismatch | O-WRITE: body-free boundary scan、resolver typed result、two-history UoW | 不记录 secret value、KMS/Vault operation、credential validity 或 provider response |
| C13 | command_attach_governance_seam_relation_flow | Accepted; DuplicateReplayed; Rejected | governance seam relation、governance reference/state、seam change/trace | CMD-L4; exact relation result and capture | H2S: actual governance seam/reference captures only; no audit handoff or approval claim | D-CMD; governance body/owner/kind/policy rejection or ConsistencyDefect | O-WRITE: identity/review prerequisite、resolver result、relation save、capture and commit | 不创建 governance approval、Policy/shared-rules truth、vote/workflow、audit handoff 或 runtime deny |
| C14 | command_replace_governance_seam_relation_flow | Accepted; DuplicateReplayed; Rejected | seam replacement、old/new relation revisions、matching trace | CMD-L4; exact replacement refs and replay surface | H2S for actual seam/reference captures only; audit handoff call count is zero | D-CMD; current seam/version/resolver mismatch or ConsistencyDefect | O-WRITE: old/new pair validation、CAS、capture and commit | 不把 external governance response body 复制为 seam state，也不伪造 handoff success |
| C15 | command_expire_governance_seam_relation_flow | Accepted; DuplicateReplayed; Rejected | seam Expired change/trace; governance owner remains external | CMD-L4; exact expiry result and capture | H2S for seam changed capture; no external revoke claim | D-CMD; current/terminal/illegal transition rejection | O-WRITE: exact seam load、terminal transition、commit resolution | 不修改 governance approval、不删除 identity、不伪造 external expiration acknowledgement |
| C16 | command_attach_capability_method_relation_flow | Accepted; DuplicateReplayed; Rejected | capability-method relation、method asset ref/state、relation change/trace | CMD-L4; relation result and exact capture | H2S for relation capture; optional follow-up marker only | D-CMD; method body/source path/owner mismatch/body-forbidden rejection | O-WRITE: identity and resolver gate、relation factory、save/capture/commit | 不保存 method body、TaskDefinition、source code、method execution result 或 library lifecycle |
| C17 | command_remove_capability_method_relation_flow | Accepted; DuplicateReplayed; Rejected | relation Removed change/trace; method asset remains external reference | CMD-L4; exact removal replay; no second removal | H2S for relation capture | D-CMD; missing/stale/current relation or illegal transition rejection | O-WRITE: exact relation/version/index guard、append/capture | 不删除 method asset、不解释为 method disabled、不执行 runtime/tools revocation |
| C18 | command_establish_formal_exposure_boundary_flow | Accepted; DuplicateReplayed; Rejected | formal exposure、visibility、registry target only when policy derives it、exposure change/trace | CMD-L4; exposure/visibility/registry effects and captures in one UoW | H2S for exposure capture; no runtime authorization invocation | D-CMD; incomplete prerequisite、policy/body/scope rejection、ConsistencyDefect | O-WRITE: complete prerequisite chain、policy derive、source-version symmetry、commit | 不把 exposure Active/Visible 当 runtime allow、SDK publication、marketplace listing 或 governance approval |
| C19 | command_update_formal_visibility_applicability_flow | Accepted; DuplicateReplayed; Rejected | visibility applicability revision、possible exposure revision、registry actual delta、change/trace | CMD-L4; exact final source-version-symmetric result | H2S for actual exposure/visibility capture | D-CMD; stale source/consumer scope/policy rejection | O-WRITE: re-evaluate/mark-pending branch、final version check、material propagation | 不用 caller 强制 Visible、不写 runtime deny/allow、不把 view freshness 当 exposure truth |
| C20 | command_suspend_formal_exposure_boundary_flow | Accepted; DuplicateReplayed; Rejected | exposure Suspended、visibility unavailable revision、possible registry pending delta、change/trace | CMD-L4; exact suspend result and capture | H2S for exposure capture; consumer cannot initiate this route | D-CMD; non-active/retired/consumer-originated request rejection | O-WRITE: source-version symmetry、suspend/visibility UoW、commit | 不触发 runtime/tools stop、不撤销 SDK client、不伪造 external consumer acknowledgement |
| C21 | command_retire_formal_exposure_boundary_flow | Accepted; DuplicateReplayed; Rejected | exposure/visibility Retired terminal revisions、registry retirement effect when declared、change/trace | CMD-L4; exact multi-subject result and captures | H2S for exposure capture; no marketplace delisting claim | D-CMD; terminal/version/dependent-state rejection | O-WRITE: exposure/visibility pair guard、atomic terminal writes、capture | 不级联删除 identity/descriptor/relation、不生成 runtime execution result 或 marketplace transaction |
| C22 | command_record_capability_change_impact_fact_flow | Accepted; DuplicateReplayed; Rejected | CapabilityChangeImpactFact Identified revision、matching change/trace refs | CMD-L4; impact result and impact capture | H2S for impact event capture; downstream feedback remains separate | D-CMD; missing change/trace/impact scope or consistency defect | O-WRITE: exact source revision、impact factory、append/capture/commit | 不把 impact identified 当 execution outcome、billing/cost fact 或 acceptance evidence |
| C23 | command_record_traceability_handoff_summary_flow | Accepted; DuplicateReplayed; Rejected | traceability HandoffPending revision、optional exact audit reference/state、handoff summary | CMD-L4; stored command result; no external outcome in accepted result | H1: local request is committed first; post-commit ObservabilityAuditHandoffPort outcome is external and non-rollback | D-CMD plus D-OUT for post-commit typed handoff failure; no error-text retry | O-WRITE/O-COLLAB: request revision、commit boundary、external invocation、typed outcome/ref | 不把 HandoffPending 当 external received、audit persisted、evidence alias 或 acceptance signature |
| C24 | command_record_reference_resolution_state_flow | Accepted; DuplicateReplayed; Rejected | actual `ReferenceResolutionState` revision、declared material stale revisions、stored result；`change_record_refs=[]`、`traceability_refs=[]` | CMD-L4; exact state result and reference capture on actual delta | H2S for `ReferenceResolutionChanged` capture; resolver is observation, not local owner | D-CMD; same-value/no-op、state transition、resolver shape or consistency issue | O-WRITE: current state/value+reason comparison、transition、capture、material propagation、commit | 不复制 resolver body、不把 state Resolved 当 external service health 或 relation/exposure approval |
| C25 | command_register_external_document_reference_flow | Accepted; DuplicateReplayed; Rejected | body-free `ExternalDocumentRef`、initial canonical state、stored result；`change_record_refs=[]`、`traceability_refs=[]` | CMD-L4; exact ref/state result and capture | H2S for reference capture; no document handoff success | D-CMD; document body/owner/kind/digest conflict or resolver error | O-WRITE: body-free scan、candidate uniqueness、ref/state UoW、commit | 不保存 document body、OpenAPI/schema text、source path 或 evidence document |
| C26 | command_register_capability_consumer_reference_flow | Accepted; DuplicateReplayed; Rejected | `RuntimeToolsConsumerRef`或`SdkExposureConsumerRef`、initial canonical state、stored result；`change_record_refs=[]`、`traceability_refs=[]` | CMD-L4; exact union-bound result and capture | H2S for reference capture; no runtime execution or SDK publication | D-CMD; consumer union/scope/owner/body rejection or resolver defect | O-WRITE: closed union selection、candidate digest、ref/state save、capture/commit | 不创建 runtime invocation、tool result、allowlist/cache、SDK package/client 或 marketplace listing |

### 22.2 Command matrix closure

| 审计项 | expected | result |
|---|---:|---|
| 独立 Command rows | 26 | 26 |
| 每行有 exact disposition | 26 | 26 |
| 每行有 L2/L3、L4、L5、L6、L1 与 forbidden 列 | 26 | 26 |
| Command duplicate 明确 exact stored replay / no-rerun | 26 | 26 |
| Command accepted local UoW 与 external post-commit boundary 分开 | 26 | 26 |
| Query-like no-write 误用 | 0 | 0 |
| 新增 protocol / object / field / state / Port / error | 0 | 0 |

## 23. R15.4 Query disposition / fact / observation matrix

### 23.1 Query family shared rule

33 条 Query 都先执行 declared resolver，再执行 exact repository read；resolver 的 NotVisible 不能在读取 body 后反推，resolver 的 Degraded 不能由 item 内容或错误文本反推。所有 Query 均使用 Q-L4 和 H3：不 reserve、不写 stored result、不 append change/trace、不 mark stale、不 refresh/rebuild、不调用 external handoff/collaboration、不触发 repair。

| # | flow | exact disposition / surface | established L2/L3 fact | L4 continuity / replay | L5 handoff / collaboration | L6 diagnostic | allowed L1 observation | forbidden fabricated truth / side effect |
|---:|---|---|---|---|---|---|---|---|
| Q01 | query_get_capability_identity_flow | Visible; NotVisible; Degraded | identity truth、source ref/state、current access review | Q-L4; exact read of existing source/state only | H3; no source resolver mutation or handoff | D-Q; normal missing differs from pair ConsistencyDefect | O-READ: identity resolver、exact loads、visibility/freshness、duration | 不把 visible missing 变成 identity creation、不返回 NotVisible subject id、不写 access audit |
| Q02 | query_search_capability_identities_flow | Visible page/empty; NotVisible empty page; resolver-declared Degraded | identity search page and declared review/source summary | Q-L4; no cursor persistence or stored replay | H3; no collaboration | D-Q; page/cursor/repository errors remain ApplicationError | O-READ: collection resolver、page mapping、item-count category、cursor outcome | 不从 empty 推断 NotVisible、不创建 directory projection、不保存 query history |
| Q03 | query_get_capability_access_review_fact_flow | Visible body or visible missing; NotVisible; declared Degraded | access-review fact and identity relation | Q-L4; exact review/identity read | H3; review is not approval handoff | D-Q; no review and wrong review/identity pair have different mappings | O-READ: resolver order、current review read、body-free mapping | 不伪造 governance approval、不以 Query 触发 review write 或 handoff |
| Q04 | query_get_capability_registry_entry_flow | Visible body/missing; NotVisible; declared Degraded | registry entry、identity truth | Q-L4; exact registry and identity reads | H3 | D-Q; owner/version mismatch is ConsistencyDefect | O-READ: registry resolver、two exact loads、visibility and duration | 不读取 directory 代替 registry truth、不把 entry visible 当 runtime authorization |
| Q05 | query_list_capability_registry_entries_flow | Visible page/empty; NotVisible empty; resolver-declared Degraded | registry collection page with stable order | Q-L4; opaque cursor is query-local, not replay state | H3 | D-Q; page/owner mismatch remains technical error | O-READ: collection gate、list call、page mapping、empty/not-visible distinction | 不从 directory projection 或 runtime cache 补 registry、不写 read audit |
| Q06 | query_get_registry_visibility_semantics_flow | Visible explicit optional semantics; NotVisible; declared Degraded | registry/identity plus optional exposure/visibility semantics | Q-L4; exact optional exposure/visibility reads | H3 | D-Q; missing optional relation follows card; wrong owner is ConsistencyDefect | O-READ: optional branch、source-version union、surface mapping | 不将 semantics 当 runtime deny/allow、不创建 exposure 或 visibility |
| Q07 | query_get_adapter_descriptor_flow | Visible body/missing; NotVisible; declared Degraded | adapter descriptor and registry/identity relation | Q-L4; exact descriptor and prerequisite reads | H3 | D-Q; external body fallback remains forbidden | O-READ: descriptor resolver、exact current load、safe surface mapping | 不返回 provider response、不重建 descriptor、不调用 execution adapter |
| Q08 | query_get_descriptor_risk_constraint_summary_flow | Visible body/missing; NotVisible; Degraded if summary unavailable | descriptor risk/constraint summary as declared local fact | Q-L4; exact summary/descriptor read | H3 | D-Q; safe-summary degraded or ApplicationError remains typed | O-READ: summary resolver、freshness/availability mapping | 不把 summary 当 policy approval、quota/cost 或 runtime decision |
| Q09 | query_get_descriptor_secret_safe_summary_flow | Visible body-free safe summary; NotVisible; Degraded(Redacted/Unavailable) | descriptor secret reference、safe handling summary、canonical state | Q-L4; exact opaque ref/state read; no secret replay | H3 | D-Q; Redacted is typed surface, not raw error | O-READ: redaction gate、resolver/read outcome、duration | 不读 secret value、credential、KMS/Vault body 或验证 secret 可用性 |
| Q10 | query_list_descriptors_by_capability_flow | Visible page/empty; NotVisible empty; resolver-declared Degraded | registry-linked descriptor page with history/current mapping | Q-L4; cursor only in response, no stored page | H3 | D-Q; registry/descriptor owner mismatch is technical | O-READ: identity -> registry -> collection resolver order、page count | 不以 descriptor list 创建 registry/descriptor、不返回旧 provider catalog |
| Q11 | query_get_governance_seam_relation_flow | Visible body-free relation; NotVisible; Degraded(ReferenceUnresolved/Unavailable) | governance seam relation、governance reference/state | Q-L4; exact relation/ref/state reads | H3; no audit handoff invocation | D-Q; typed reference marker or ConsistencyDefect | O-READ: seam resolver、relation/ref pair、safe freshness | 不把 relation 当 approval truth、不读 governance body 或触发 review |
| Q12 | query_get_access_governance_separation_flow | Visible separation surface; NotVisible; declared Degraded | identity/review fact plus optional seam relation; explicitly no approval | Q-L4; exact review/seam reads | H3; no governance handoff | D-Q; missing optional seam follows card; mismatch is defect | O-READ: subject resolvers、separation mapper、duration | 不输出 approval/vote/Policy body、不把 absence 改成 deny 或 accepted |
| Q13 | query_get_capability_method_relation_flow | Visible body-free relation; NotVisible; Degraded(ReferenceUnresolved/Unavailable) | method relation、method asset ref/state | Q-L4; exact relation/ref/state reads | H3; no method handoff | D-Q; typed reference degraded or ConsistencyDefect | O-READ: relation resolver、ref-state mapping | 不读 method body、source code、execution result 或改变 relation |
| Q14 | query_list_capability_relations_flow | Visible page/empty; NotVisible empty; resolver-declared Degraded | selected relation-kind page and local body-free refs | Q-L4; no replay/capture | H3 | D-Q; kind/page/owner mismatch is technical | O-READ: collection resolver、kind-bound list、page mapper | 不合并 governance/method relations、不从 empty 扩大缺失结论 |
| Q15 | query_get_formal_exposure_boundary_flow | Visible exposure/visibility; NotVisible; declared Degraded | formal exposure、formal visibility、registry linkage | Q-L4; exact exposure/visibility reads | H3 | D-Q; source-version/owner asymmetry is ConsistencyDefect | O-READ: exposure resolver、paired exact loads、surface mapping | 不调用 policy mutation、不把 Visible 当 runtime allow 或 SDK publication |
| Q16 | query_get_formal_visibility_applicability_flow | Visible applicability; NotVisible; Degraded for declared consumer/reference gap | visibility applicability、optional consumer check、exposure source version | Q-L4; exact reads only | H3; no runtime enforcement | D-Q; consumer/ref degraded or ConsistencyDefect | O-READ: exposure then consumer resolver order、applicability branch | 不执行 consumer check 为 authorization、不创建 exposure transition 或 deny record |
| Q17 | query_get_controlled_consumer_view_flow | Visible/Fresh; NotVisible; Degraded(StaleReadable/Rebuilding/Unavailable/Partial) | ControlledConsumerView material、exposure/consumer source versions | Q-L4; exact material read, no refresh/rebuild | H3 | D-Q; freshness from persisted state, not log age | O-READ: view resolver、exact material read、freshness and source-version mapping | 不把 view freshness 改成 exposure truth、不触发 refresh Job 或 runtime execution |
| Q18 | query_list_consumable_capabilities_for_runtime_tools_flow | Visible page/empty; NotVisible empty; Degraded on material availability | consumer-bound controlled-view page and exposure refs | Q-L4; exact view page read | H3; runtime/tools is only reference subject | D-Q; resolver-level degraded or material error | O-READ: consumer-scope resolver、item visibility、freshness category | 不执行 tools、不返回 tool result、不创建 allowlist/cache 或 runtime authorization |
| Q19 | query_get_sdk_exposure_boundary_flow | Visible server exposure view; NotVisible; Degraded for SDK/ref/material gap | SDK consumer ref/state + exposure/visibility/view | Q-L4; exact paired reads | H3; no SDK publication/client call | D-Q; NotVisible/Degraded precedence and source-version union | O-READ: SDK resolver -> exposure resolver、pair checks、duration | 不创建 SDK client/package/binding/cache 或把 server exposure 当 published artifact |
| Q20 | query_get_capability_access_trace_flow | Visible page; Degraded(StaleReadable) for Partial/HandoffPending; NotVisible empty | append-only traceability revisions、change refs、handoff-pending state | Q-L4; exact trace page read; no append/replay | H3; reads local handoff refs only | D-Q; trace item state is fact; repository defect is error | O-READ: trace collection resolver、state aggregation、page count | 不从 logs 重建 trace、不把 trace id 当 evidence、不修复 HandoffPending |
| Q21 | query_get_capability_change_impact_flow | Visible impact/missing; NotVisible; declared Degraded | CapabilityChangeImpactFact and exact change/trace links | Q-L4; exact impact/change reads | H3 | D-Q; source mismatch is ConsistencyDefect | O-READ: impact resolver、source-link load、surface mapping | 不把 impact query 当 execution result、feedback 或 audit acceptance |
| Q22 | query_get_downstream_consumption_impact_summary_flow | Visible page; NotVisible empty; item states remain explicit | DownstreamConsumptionImpactSummary revisions and consumer/change refs | Q-L4; exact summary page read | H3 | D-Q; item Delayed/Unavailable is L3 fact, not query failure | O-READ: collection resolver、item-state mapping、page duration | 不将 downstream feedback 变 runtime denial、retry Command 或 capability truth |
| Q23 | query_get_audit_handoff_trace_summary_flow | Visible body-free bundle; Degraded partial for complete non-resolved refs; NotVisible | traceability revision plus ObservabilityAudit reference/state pairs | Q-L4; exact trace/ref/state reads, no stored query result | H3; never calls ObservabilityAuditHandoffPort | D-Q; missing/wrong mandatory pair is ConsistencyDefect | O-READ: trace -> audit refs order、pair validation、degraded mapping | 不读取 raw audit store、不触发 handoff/retry、不把 ref/trace 当 evidence 或签署 |
| Q24 | query_search_capability_directory_flow | Visible page/empty; NotVisible empty; Degraded(StaleReadable/Rebuilding/Unavailable) | DirectoryProjection material and declared source versions | Q-L4; exact projection page read | H3 | D-Q; projection-state marker or technical read error | O-READ: collection resolver、projection freshness、page mapping | 不把 projection 当 registry truth、不在 Query rebuild/refresh 或写 trace |
| Q25 | query_browse_capability_directory_flow | Visible page/empty; NotVisible empty; Degraded per directory state | Directory browse projection and source-version set | Q-L4; exact browse read | H3 | D-Q; same directory degraded rules | O-READ: browse-scope resolver、stable ordering、freshness | 不用 current truth 重建 page、不将 browse visibility 当 access authorization |
| Q26 | query_get_audit_friendly_export_summary_flow | Visible Ready/Partial; Degraded(Partial/Unavailable); NotVisible | AuditFriendlyExportSummary material and exact trace/audit ref links | Q-L4; exact export read | H3; local refs only, no external audit call | D-Q; redacted body-free degraded marker | O-READ: export resolver、source-version/ref pair checks、duration | 不返回 raw audit/log/span/metric body、不创建 evidence alias 或验收签署 |
| Q27 | query_get_read_only_ecosystem_discovery_summary_flow | Visible Ready/Partial; Degraded; NotVisible | ReadOnlyEcosystemDiscoverySummary from exposure/consumer-safe refs | Q-L4; exact discovery read | H3; ecosystem is read-only summary | D-Q; material freshness/unavailable marker | O-READ: exposure resolver、summary load、freshness | 不创建 marketplace listing/ranking/pricing/transaction 或 runtime route |
| Q28 | query_get_capability_reconciliation_report_flow | Visible immutable report/page; NotVisible; declared Degraded | CapabilityReconciliationReport immutable revision and findings | Q-L4; exact report read, no rebuild | H3 | D-Q; report state is fact; technical load defect is error | O-READ: report resolver、immutable revision load、page mapping | 不把 report finding 自动修复 core truth、不从 report 生成 Command/Job |
| Q29 | query_get_reference_resolution_state_flow | Visible all explicit values; NotVisible; Degraded(Unavailable/Redacted/StaleReadable) | external reference subject + canonical ReferenceResolutionState | Q-L4; exact reference/state read | H3; no resolver refresh or collaboration | D-Q; Invalid/Forbidden retain body-free state with Redacted | O-READ: external-reference resolver gate、state mapping、duration | 不调用 external resolver、不把 state 重建为 owner body 或新增 state |
| Q30 | query_get_external_document_reference_flow | Visible body-free ref/state; NotVisible; Degraded | ExternalDocumentReference and canonical state | Q-L4; exact ref/state read | H3 | D-Q; body forbidden remains Redacted | O-READ: subject resolver、mandatory state pair、surface mapping | 不读 document body、不刷新 state、不把 document ref 当 evidence |
| Q31 | query_get_runtime_tools_consumer_reference_flow | Visible body-free consumer ref/state; NotVisible; Degraded | RuntimeTools consumer reference and canonical state | Q-L4; exact ref/state read | H3; no tools call | D-Q; typed reference degradation/error | O-READ: consumer-union resolver、state read、duration | 不执行 runtime/tools、不返回 invocation/result/allowlist/cache |
| Q32 | query_get_sdk_exposure_consumer_reference_flow | Visible body-free SDK ref/state; NotVisible; Degraded | SDK exposure consumer reference and canonical state | Q-L4; exact ref/state read | H3; no SDK publication | D-Q; typed reference degradation/error | O-READ: SDK-union resolver、state pair、surface mapping | 不读取 client/package/generated code 或推断 publication status |
| Q33 | query_get_observability_audit_reference_flow | Visible body-free audit ref/state; NotVisible; Degraded(Redacted/Unavailable) | ObservabilityAuditReference and canonical state | Q-L4; exact ref/state read; no raw audit body | H3; never calls handoff Port | D-Q; Redacted boundary and pair ConsistencyDefect | O-READ: audit-subject resolver、state/freshness mapping、duration | 不读取 raw telemetry/audit body、不创建 audit truth、evidence alias、retry 或 handoff success |

### 23.2 Query matrix closure

| 审计项 | expected | result |
|---|---:|---|
| 独立 Query rows | 33 | 33 |
| Query surface 明确 Visible / NotVisible / Degraded | 33 | 33 |
| strict no-write / no-replay / no-collaboration | 33 | 33 |
| Query 不新增 L2/L3/L4/L5 fact | 33 | 33 |
| normal empty 与 NotVisible 不混淆 | 33 | 33 |
| 新增 audit-write / refresh / repair 路径 | 0 | 0 |

## 24. R15.4 Inbound Event Consumer disposition / fact / observation matrix

### 24.1 Inbound family shared rule

六条 Inbound flow 均先由 Worker 完成 source family、trusted actor、logical event name 和 schema version 的 header-first gate，只有 schema version 支持后才解析 typed payload。五条 reference consumer 的 fresh no-change 可以形成存储型 Ignored receipt；DownstreamConsumptionImpactReported 的五个合法 feedback payload state 都形成新的 summary，因此 fresh processing disposition 为 Accepted，即使 payload state 本身叫 Delayed、Unavailable 或 Ignored。

| # | flow | exact disposition | established L2/L3 fact | L4 continuity / replay | L5 handoff / collaboration | L6 diagnostic | allowed L1 observation | forbidden fabricated truth / side effect |
|---:|---|---|---|---|---|---|---|---|
| I01 | inbound_consume_governance_result_reference_changed_flow | Accepted; DuplicateReplayed; Delayed; Ignored; Rejected; UnsupportedSchema; Quarantined | GovernanceResultRef and canonical state revision only; no seam/approval truth | IN-L4; actual state revision may form ReferenceResolutionChanged capture; Ignored stores exact no-op receipt | H2S only on actual reference-state capture; GovernanceSeamReview is follow-up marker, not a Command or handoff | D-IN; request contradiction -> Rejected/Quarantined; matching resolver shape defect -> ConsistencyDefect | O-ENTRY/O-WRITE: header gate、reserve、resolver category、receipt disposition、Worker completion action | 不解析 unsupported payload、不创建 seam/approval/Policy truth、不自动执行 review 或泄漏 original receipt on conflict |
| I02 | inbound_consume_method_asset_reference_changed_flow | Accepted; DuplicateReplayed; Delayed; Ignored; Rejected; UnsupportedSchema; Quarantined | MethodAssetRef and canonical state revision only; no method relation or asset lifecycle mutation | IN-L4; actual state revision may form reference capture; exact no-change stores Ignored receipt | H2S only on actual capture; MethodRelationReview is body-free follow-up only | D-IN; method body/target contradiction quarantined; resolver shape mismatch is ConsistencyDefect | O-ENTRY/O-WRITE: source validation、resolver outcome class、state delta/no-op、receipt | 不保存 method body/source code、不创建 relation、不运行 method、不把 follow-up 当 queued Command |
| I03 | inbound_consume_downstream_consumption_impact_reported_flow | Accepted; DuplicateReplayed; Delayed; Rejected; UnsupportedSchema; Quarantined | append-only DownstreamConsumptionImpactSummary revision linked to exact impact and consumer | IN-L4; accepted summary + receipt + completion share UoW; no Ignored fresh receipt for valid feedback variants | H0; CapabilityImpactReview is optional follow-up only; no event collaboration owned by this flow | D-IN; processing Delayed only for unavailable prerequisite; payload Delayed/Unavailable/Ignored remains Accepted when summary saves | O-ENTRY/O-WRITE: actor/family gate、impact/consumer exact reads、payload state category、append/commit、receipt | 不把 downstream execution/request/result 存入 summary、不将 payload Delayed 误记为 processing retry、不修改 impact or core truth |
| I04 | inbound_consume_external_capability_source_reference_changed_flow | Accepted; DuplicateReplayed; Delayed; Ignored; Rejected; UnsupportedSchema; Quarantined | ExternalCapabilitySourceRef and canonical state revision only; no identity truth | IN-L4; actual ref/state delta may form reference capture; no-change receipt is replayable | H2S on actual capture; CapabilityIdentityIntakeReview does not create identity | D-IN; MCP/A2A/API body or digest/subject collision quarantined; Port shape mismatch is ConsistencyDefect | O-ENTRY/O-WRITE: source slot、body-free scan、resolver class、state delta、receipt/action | 不保存 MCP request/tool schema/A2A message/API payload/credential、不创建 identity、不执行 runtime integration |
| I05 | inbound_consume_audit_material_reference_changed_flow | Accepted; DuplicateReplayed; Delayed; Ignored; Rejected; UnsupportedSchema; Quarantined | ObservabilityAuditReference and canonical state revision only; no audit-store or traceability handoff truth | IN-L4; actual state delta may form reference capture; exact no-change stores Ignored receipt | H2S on actual reference capture; AuditHandoffReview is follow-up only and never proves handoff | D-IN; raw log/span/metric/audit/GRC body quarantined; resolver shape mismatch is ConsistencyDefect | O-ENTRY/O-WRITE: audit source slot、redaction gate、resolver class、receipt/action | 不保存 raw telemetry/audit body、不 append traceability、不调用 handoff Port、不创建 evidence alias 或验收签署 |
| I06 | inbound_consume_external_document_reference_changed_flow | Accepted; DuplicateReplayed; Delayed; Ignored; Rejected; UnsupportedSchema; Quarantined | ExternalDocumentReference and canonical state revision only; no descriptor truth | IN-L4; actual state delta may form reference capture; no-change receipt is replayable | H2S on actual capture; DescriptorSupportReview is body-free follow-up only | D-IN; document/OpenAPI/schema/guide body quarantined; resolver shape mismatch is ConsistencyDefect | O-ENTRY/O-WRITE: document source slot、header/body-free gate、state delta、receipt/action | 不保存 document body、不修改 descriptor、不自动 attach support、不把 ref 当 evidence |

### 24.2 Inbound disposition boundary audit

| branch | L2/L3 effect | L4 surface | L5 effect | hard prohibition |
|---|---|---|---|---|
| Accepted | only the flow-declared ref/state or downstream summary revision | result_ref Some; exact receipt/effect refs persisted | H2S capture only when an actual canonical state revision declares it | no owner truth mutation beyond declared local fact |
| DuplicateReplayed | none in current invocation | exact stored receipt and original effect refs | none; no resolver/follow-up/capture rerun | no Clock/UoW/business body |
| Delayed | none | result_ref None; no completed receipt; RetryRequired + NoLocalEffect | none | no partial ref/state/summary write |
| Ignored | no new canonical revision | replayable no-op receipt with result_ref Some | follow-up/capture empty unless original exact receipt says otherwise | no inferred Accepted effect |
| Rejected | none; only safe stored rejection when existing contract allows | result_ref conditional per existing canonical stable outcome | none | no offending input persistence |
| UnsupportedSchema | none | result_ref None; header-derived receipt only | none | typed payload must not be decoded |
| Quarantined | none; safely canonical stable quarantine may be stored | result_ref conditional; BoundaryQuarantined + NoLocalEffect | none | no raw forbidden body, original result leakage or automatic merge |

### 24.3 Inbound matrix closure

| 审计项 | expected | result |
|---|---:|---|
| 独立 Inbound rows | 6 | 6 |
| header-first UnsupportedSchema no-decode | 6 | 6 |
| DuplicateReplayed exact receipt / no-rerun | 6 | 6 |
| reference consumer no-change -> Ignored | 5 | 5 |
| downstream payload state 与 processing disposition 分离 | 1 | 1 |
| owner truth 越界写入 | 0 | 0 |

## 25. R15.4 Outbound Event capture / collaboration matrix

### 25.1 Outbound three-phase shared rule

十条 Outbound flow 的 disposition 不是一个新 enum，而是三个既有 surface 的组合：

1. Phase A：exact committed source、complete serialized envelope snapshot 和 initial Captured record 在 source-owning UoW 一起提交。
2. Phase B：commit 后只从 official snapshot/capture 形成 candidate；external Port 返回 Candidate、PendingDelivery、Delivered、Failed 或 HandoffUnavailable typed status。
3. Phase C：取得 source-symmetric stable intent 后，以独立短 UoW 把同一 capture 绑定为 IntentBound；typed Port failure或bind failure不回滚 source，capture 保持可恢复。

| # | flow / protocol family | exact phase disposition | established L2/L3 source fact | L4 continuity / replay | L5 handoff / collaboration | L6 diagnostic | allowed L1 observation | forbidden fabricated truth / side effect |
|---:|---|---|---|---|---|---|---|---|
| O01 | outbound_capability_identity_changed_capture_and_collaborate_flow / CapabilityIdentityChanged | Captured -> external typed status -> IntentBound; reentry exact-get | exact CapabilityIdentityChangeRecord and matching identity revision | OUT-L4; immutable identity event snapshot/capture | H2C; external intent/status remains external-owned | D-OUT; source/snapshot/capture mismatch -> ConsistencyDefect | O-WRITE/O-COLLAB: source UoW、capture ref、Port status、bind result | 不从 current identity 重建 payload、不把 Delivered 当 identity audit acceptance、不创建 second event |
| O02 | outbound_capability_registry_changed_capture_and_collaborate_flow / CapabilityRegistryChanged | Captured -> external typed status -> IntentBound; reentry exact-get | exact `RegistryChangeRecord` only | OUT-L4; registry source/snapshot/capture identity fixed | H2C | D-OUT | O-WRITE/O-COLLAB: exact source kind、capture/bind、typed status | 不用 reconciliation report 或 directory 代替 registry source、不声明 marketplace listing delivery |
| O03 | outbound_adapter_descriptor_changed_capture_and_collaborate_flow / AdapterDescriptorChanged | Captured -> external typed status -> IntentBound; reentry exact-get | exact `DescriptorChangeRecord` and accepted descriptor revision | OUT-L4; descriptor event bytes immutable | H2C | D-OUT; forbidden body or source asymmetry remains typed error | O-WRITE/O-COLLAB: mapper/capture/commit、Port status、bind | 不包含 secret/provider response/adapter execution state、不从 current descriptor 重建 |
| O04 | outbound_governance_seam_relation_changed_capture_and_collaborate_flow / GovernanceSeamRelationChanged | Captured -> external typed status -> IntentBound; reentry exact-get | exact GovernanceSeamChangeRecord and seam revision | OUT-L4 | H2C; collaboration is not governance handoff approval | D-OUT | O-WRITE/O-COLLAB: source capture、typed external outcome、bind | 不包含 approval/Policy/workflow body、不把 external delivery 当 governance decision |
| O05 | outbound_capability_method_relation_changed_capture_and_collaborate_flow / CapabilityMethodRelationChanged | Captured -> external typed status -> IntentBound; reentry exact-get | exact `MethodRelationChangeRecord` and relation revision | OUT-L4 | H2C | D-OUT | O-WRITE/O-COLLAB: relation-source capture、status、bind | 不包含 method body/source code/execution result、不改变 method-library asset |
| O06 | outbound_formal_exposure_boundary_changed_capture_and_collaborate_flow / FormalExposureBoundaryChanged | Captured -> external typed status -> IntentBound; reentry exact-get | exact `CapabilityExposureChangeRecord` and exposure/visibility revision declared by source | OUT-L4 | H2C | D-OUT | O-WRITE/O-COLLAB: source-version gate、capture、status、bind | 不声明 runtime allow/deny、SDK publication、marketplace listing 或 consumer execution |
| O07 | outbound_controlled_consumer_view_availability_changed_capture_and_collaborate_flow / ControlledConsumerViewAvailabilityChanged | Captured -> external typed status -> IntentBound; reentry exact-get | exact changed ControlledConsumerView revision and freshness state | OUT-L4; view revision is exact source, not exposure substitute | H2C | D-OUT | O-WRITE/O-COLLAB: view source state、capture/status/bind | 不把 view availability 当 core exposure truth 或 runtime cache delivery、不从 current view rebuild |
| O08 | outbound_capability_change_impact_identified_capture_and_collaborate_flow / CapabilityChangeImpactIdentified | Captured -> external typed status -> IntentBound; reentry exact-get | exact CapabilityChangeImpactFact in Identified state | OUT-L4 | H2C | D-OUT | O-WRITE/O-COLLAB: impact source check、capture/status/bind | 不使用 downstream feedback/later impact revision、不声明 execution/billing/acceptance fact |
| O09 | outbound_derived_material_refreshed_capture_and_collaborate_flow / DerivedMaterialRefreshed | Captured -> external typed status -> IntentBound; reentry exact-get | exact DirectoryProjection、AuditFriendlyExportSummary、ReadOnlyEcosystemDiscoverySummary 或 CapabilityReconciliationReport revision | OUT-L4; closed four-variant material/report source | H2C | D-OUT | O-WRITE/O-COLLAB: source variant、capture/status/bind | 不使用 ControlledConsumerView/registry/marketplace listing、不把 export/report 当 evidence 或 auto-repair |
| O10 | outbound_reference_resolution_changed_capture_and_collaborate_flow / ReferenceResolutionChanged | Captured -> external typed status -> IntentBound; reentry exact-get | exact canonical ReferenceResolutionState revision | OUT-L4; source subject/kind/version/digest symmetry fixed | H2C | D-OUT; resolver response is never event source | O-WRITE/O-COLLAB: reference-state source、capture/status/bind | 不包含 external owner body、不把 Resolved 当 service health、不修改 relation/exposure truth |

### 25.2 Outbound outcome / authority boundary

| observed branch | Hub-owned durable fact | external-owned typed fact | forbidden inference |
|---|---|---|---|
| source UoW committed | exact L2/L3 source + snapshot + Captured | none yet | delivery started/completed |
| external Candidate/PendingDelivery | same Captured or later IntentBound local link | same stable external intent and typed status | local pending-delivery state、attempt count、relay position |
| external Delivered | source/capture unchanged; stable intent may be bound | external delivery status only | acceptance、audit sign-off、runtime consumption |
| external Failed/HandoffUnavailable | source/capture unchanged; stable intent may still be bound | external failure/unavailability + safe typed reason | source rollback、local business failure、new local delivery state |
| no typed outcome / Port error | source/capture unchanged and recoverable | none established | infer Failed from HTTP/log/error text |
| local bind/commit failed | source/snapshot unchanged; capture remains Captured | returned external stable intent remains external | create second intent/event or mark local Delivered |
| IntentBound reentry | exact capture returns bound intent; external get only | current typed item/outcome | rerun mapper/collaborate or replace stable intent |

### 25.3 Outbound matrix closure

| 审计项 | expected | result |
|---|---:|---|
| 独立 Outbound rows | 10 | 10 |
| exact source family | 10 | 10 |
| Phase A source/snapshot/Captured same-UoW | 10 | 10 |
| Phase B/C post-commit and source non-rollback | 10 | 10 |
| external status copied into local capture | 0 | 0 |
| local outbox/relay/DLQ/attempt lifecycle | 0 | 0 |

## 26. R15.4 Operations Job disposition / fact / observation matrix

### 26.1 Job family shared rule

八条 Job 都只从 all-terminal CapabilityJobExecutionRecord 纯组装 final disposition：

- Completed：全部 declared targets completed/unchanged，且没有 blocking issue；合法零目标也可 Completed。
- PartiallyCompleted：至少一个 target completed/unchanged，且至少一个 target failed/skipped。
- Failed：无 target completed，或 reconciliation 持久化了 explicit Failed report。
- Retryable：temporary prerequisite/resolver/collaboration unavailability 阻止稳定完成，并由既有 typed classification 授权。
- DuplicateReplayed：只读取 exact typed stored report；不运行 planning/target/final business body。
- Rejected：metadata/schema/name/body/scope 在 Job body 前拒绝，report=None。

Failed/Retryable/PartiallyCompleted 是本次 Job protocol result，不等于 capability truth 失败、implementation test 失败或 acceptance 失败。runner 的 deadline/drain/join signal 不能形成或修改这些 disposition。

| # | flow | exact disposition | established L2/L3 operations fact | L4 continuity / replay | L5 handoff / collaboration | L6 diagnostic | allowed L1 observation | forbidden fabricated truth / side effect |
|---:|---|---|---|---|---|---|---|---|
| J01 | job_run_capability_registry_reconciliation_flow | Completed; PartiallyCompleted; Failed; Retryable; DuplicateReplayed; Rejected | optional immutable CapabilityReconciliationReport over frozen registry-centered truth/material basis | JOB-L4; report append + DerivedMaterialRefreshed capture + terminal journal outcome share target UoW; duplicate typed report only | H2S only when an actual report revision forms capture; no external collaborate in this flow | D-JOB; safe missing source may become finding/target issue; loaded asymmetry remains ConsistencyDefect | O-JOB/O-WRITE: planning basis category、target/report state、capture、journal/finalization、duration | 不创建/update/retire registry、不发 CapabilityRegistryChanged、不自动 repair/rebuild、不从 logs 汇总 report |
| J02 | job_refresh_controlled_consumer_view_flow | Completed; PartiallyCompleted; Failed; Retryable; DuplicateReplayed; Rejected | ControlledConsumerView Ready/Partial revision or typed unchanged target; exact exposure/consumer source versions | JOB-L4; changed view + availability capture + target journal in one UoW; duplicate report no scan | H2S for actual view availability capture; no runtime/tools call | D-JOB; inapplicable/unresolved target issue vs owner/version ConsistencyDefect remains separate | O-JOB/O-WRITE: frozen target count category、build/refresh/unchanged、target UoW、final disposition | 不修改 formal exposure/visibility、不保存 Rebuilding/Unavailable intermediate、不触发 runtime cache/execution |
| J03 | job_rebuild_directory_search_browse_projection_flow | Completed; PartiallyCompleted; Failed; Retryable; DuplicateReplayed; Rejected | DirectorySearchBrowseProjection Ready revision or typed unchanged target | JOB-L4; projection revision + DerivedMaterialRefreshed capture + journal terminal outcome; duplicate no truth scan | H2S for actual projection capture | D-JOB; normally absent prerequisite may be stable target failure; persisted asymmetry is ConsistencyDefect | O-JOB/O-WRITE: plan/page exhaustion、target create/update/unchanged、capture/finalization | 不 backfill registry/descriptor/exposure、不保存 Rebuilding/Unavailable intermediate、不调用 provider/marketplace fallback |
| J04 | job_prepare_audit_friendly_export_summary_flow | Completed; PartiallyCompleted; Failed; Retryable; DuplicateReplayed; Rejected | AuditFriendlyExportSummary Ready/Partial/Unavailable revision with exact trace/change and allowed audit refs | JOB-L4; material revision + DerivedMaterialRefreshed capture + journal outcome; duplicate report only | H3 plus H2S for local derived capture; no ObservabilityAuditHandoffPort call | D-JOB; Invalid/Forbidden -> stable failed target; Unavailable/Unresolved/Stale/Expired map to existing material states; pair defect remains ConsistencyDefect | O-JOB/O-WRITE: frozen ref/state categories、final material state、capture/journal/finalization | 不读取 raw audit store/log/span/metric、不创建 evidence alias/sign-off、不通过 Job 执行 handoff |
| J05 | job_rebuild_read_only_ecosystem_discovery_summary_flow | Completed; PartiallyCompleted; Failed; Retryable; DuplicateReplayed; Rejected | ReadOnlyEcosystemDiscoverySummary Ready/Partial/Unavailable revision or unchanged | JOB-L4; material/capture/journal target UoW; duplicate no scan | H2S for actual derived capture | D-JOB; optional-source gap stays typed; loaded owner/source defect is ConsistencyDefect | O-JOB/O-WRITE: exposure/context plan、material outcome category、capture/finalization | 不创建 marketplace listing/ranking/pricing/transaction、不改 exposure、不执行 runtime route |
| J06 | job_run_derived_material_reconciliation_flow | Completed; PartiallyCompleted; Failed; Retryable; DuplicateReplayed; Rejected | optional immutable CapabilityReconciliationReport over broad truth/material basis | JOB-L4; report + DerivedMaterialRefreshed capture + terminal journal outcome; duplicate no scans | H2S only for report capture | D-JOB; RebuildRequired/Inconsistent/Failed remain report states with declared disposition impact | O-JOB/O-WRITE: basis/finding/report-state category、append/capture/finalization | 不自动 invoke another Job、不 repair core truth/material、不 turn RebuildRequired into execution |
| J07 | job_refresh_external_reference_resolution_flow | Completed; PartiallyCompleted; Failed; Retryable; DuplicateReplayed; Rejected | canonical ReferenceResolutionState revision or typed unchanged/skipped target | JOB-L4; updated state + ReferenceResolutionChanged capture + terminal journal outcome in target UoW; duplicate no resolver/scan | H2S for actual reference capture; no inline event collaboration | D-JOB; temporary resolver failure may authorize Retryable; terminal state skip differs from ConsistencyDefect | O-JOB/O-WRITE: scope scan completion、resolver typed category、state transition/unchanged/skipped、capture/finalization | 不创建 missing registered ref、不 reopen Invalid/Forbidden current candidate、不 mark dependent material stale、不 copy external body |
| J08 | job_repair_capability_access_event_collaboration_flow | Completed; PartiallyCompleted; Failed; Retryable; DuplicateReplayed; Rejected | typed collaboration status items/report; local Captured -> IntentBound link only when exact stable intent returned | JOB-L4; frozen capture/intent plan、per-target journal outcome、typed final report; duplicate suppresses all Port/repository scans | H2C; Captured bind + journal success same target UoW; IntentBound/external-intent branch is journal-only; external status remains Port-owned | D-JOB/D-OUT; typed Failed/HandoffUnavailable is a successful inspected item, untyped Port failure may become target issue; asymmetry is ConsistencyDefect | O-JOB/O-COLLAB: target kind、external get/repair/collaborate typed status、bind/journal/finalization、duration | 不 rerun event mapper、不 read current source truth、不 create new snapshot/capture/event、不 copy delivery state locally、不 generate second intent |

### 26.2 Job disposition / effect authority audit

| branch | operations fact authority | continuity authority | L1 may observe | L1 must not infer |
|---|---|---|---|---|
| fresh completed/partial/failed/retryable | per-target journal + final typed report | JOB-L4 final-report UoW | target outcome category、count category、phase、duration | report refs/items from counters or logs |
| fresh Rejected | exact metadata/schema/body/scope validation | no completed report | admission rejection category | planning ran、zero targets completed by report |
| completed duplicate | original typed stored Job report | completed idempotency record + exact report envelope | DuplicateReplayed and safe result ref | current truth/material/status or retry permission |
| reserved reentry | exact frozen execution journal | first Planned ordinal and all terminal outcomes | reentry phase and target ordinal category | rescan scope、re-resolve terminal target、reconstruct report from current state |
| target commit succeeds, final report crashes | target fact and journal terminal outcome remain durable | journal drives pure final assembly | recovery phase only | rollback prior targets or rebuild outcome from logs |
| typed external Failed/HandoffUnavailable item | external-owned status copied into J08 journal/report item | exact journal/report | typed status category | local failure state、source rollback、retry from text |
| no typed external outcome | no collaboration status fact established | target remains Planned until authorized terminalization | safe Port/ApplicationError category | fabricate Failed item or external state |

### 26.3 Job matrix closure

| 审计项 | expected | result |
|---|---:|---|
| 独立 Job rows | 8 | 8 |
| six existing Job dispositions covered per row | 8 | 8 |
| journal/report/runtime signal three-way separation | 8 | 8 |
| DuplicateReplayed no scan/resolver/handoff/collaboration | 8 | 8 |
| no core truth repair | 8 | 8 |
| report reconstructed from log/metric/private counter | 0 | 0 |

## 27. R15.4 Cross-protocol technical branch matrix

这些 branch 横跨五族，但仍复用 Step 12/14 既有类型。表中 observable 仅表示未来 L1 切口可安全观察的类别；本批不决定日志级别、metric 名、span 名、audit event 名或字段 schema。

| technical branch | authority before observation | allowed L1 observation | L6 / typed disposition | forbidden business conclusion | recovery / replay authority |
|---|---|---|---|---|---|
| transaction begin failed | no local UoW/effect exists | operation family、begin phase、safe failure class、trace context | TransactionBeginFailed or existing Port failure mapping | accepted、stored rejection、capture、receipt/report exists | new attempt only under existing Step 13 rule |
| confirmed commit not durable | same authority proves NotDurable | commit resolution phase and safe class | TransactionCommitFailed | durable business fact or external delivery | Step 13 exact retry rule after zero durability proof |
| commit outcome unknown | durability is unresolved | transaction ref、resolution attempt category、budget exhausted、safe issue ref | CommitOutcomeUnknown | accepted、failed、not-durable、zero-effect | same-authority resolve_commit + barrier + exact stored read |
| rollback failed | rollback success is not established | original phase + rollback failure category, with raw source nonpublic | TransactionRollbackFailed | rollback complete、zero side effect、normal Failed target | manual/operational investigation per existing rule |
| consistency defect | loaded/stored/Port-return typed relation is impossible | subject kind、invariant kind、operation/phase、safe refs | ConsistencyDefect | normal missing、NotVisible、Degraded、Ignored、Quarantined 或 retryable target | human/design/data repair; never rebuild mandatory sidecar |
| codec/integrity failure | existing canonical codec/digest check | codec kind、integrity phase、safe result/capture/report ref | CodecFailure or InvalidContract where already mapped | body content、secret、payload bytes、stored result usable | existing exact read/repair rule only |
| idempotency in progress | concrete owner is proven active | operation family、matching-key class、exact-read phase | IdempotencyInProgress | duplicate completed、business body rerun、winner result leakage | same-key exact read only |
| completed sidecar missing | Completed record exists but result/receipt/report absent/asymmetric | channel、sidecar kind、safe result ref、invariant | ConsistencyDefect | rerun mutation/consumer/Job or synthesize response | manual repair; no log-derived surface |
| startup MissingSource / NotConfigured | selected required binding absent or explicitly disabled | Stage 0~7、selected entry、binding slot kind、profile、typed failure class | InfraError::RuntimeAssembly / existing MissingSource or NotConfigured mapping | fallback adapter chosen、partial graph usable、business operation rejected | startup fails or slot stays Disabled per Step 14 |
| startup TemporarilyUnavailable / Timeout | selected binding cannot be assembled in declared budget | stage、slot kind、typed timeout/unavailable class、cleanup completion | InfraError::RuntimeAssembly wrapping existing class | auto retry count/delay、partial graph availability | host/deployment policy only; no business replay |
| startup InvalidContract / cycle / incomplete graph | validated config or graph violates closed composition | stage、selected entry、invariant/category、all-cause cleanup result | InvalidContract / InfraError::RuntimeAssembly | dynamic owner merge、fallback graph、entry available | configuration/design correction |
| external Port typed unavailable | Port returned declared unavailable outcome/class | Port kind/callable family、phase、typed status、safe refs | typed Query/Inbound/Job/Outbound surface or PortFailure::TemporarilyUnavailable as defined | external body、service health truth、local business rollback | concrete flow's existing retry/new-run/repair boundary |
| external Port invalid typed response | adapter cannot form legal application return or returned tuple is asymmetric | Port kind、shape invariant、phase、safe correlation | InvalidTypedResponse before return; ConsistencyDefect after typed relation loaded | Quarantined/Degraded/Failed inferred from response text | adapter/design fix; no automatic retry unless explicitly typed |
| external Port unexpected source failure | no safe typed discriminant exists | Port kind、UnexpectedSourceFailure、phase、safe diagnostic ref | PortFailure::UnexpectedSourceFailure | temporary retry、permanent rejection、external status | manual investigation; raw source stays nonpublic |
| observer/backend failure | L2~L5 operation follows its existing authority | observability backend category only if caller can do so without recursion | existing infra/entry wrapper; no new ApplicationError | rollback accepted truth、change protocol disposition、skip journal/report | operation continues or fails only where an existing mandatory dependency already says so |

### 27.1 Cross-protocol branch invariants

1. Stable protocol dispositions and ApplicationError are separate axes: a technical exception cannot be relabeled Rejected/Delayed/Quarantined/Degraded merely to improve observability.
2. External Port typed outcome and raw invocation error are separate axes: only typed outcome may enter existing report/capture binding; raw error maps through the existing failure taxonomy.
3. Commit unknown and rollback failed are not ordinary Failed outcomes. Both require diagnostic visibility but forbid success/failure fabrication.
4. Startup failure precedes API/Worker/Jobs exposure. A partial runtime graph cannot produce business dispositions or accept work.
5. Observer failure is never a new business transaction member, replay authority or acceptance source.

## 28. R15.4 覆盖审计与批次级 cross-step closure

### 28.1 83-flow exact-set 覆盖审计

本批以 Step 9 当前闭口中的 83 个独立 flow 名称为权威集合，以 §§22~26 的五张矩阵为实际集合。审计比较的是规范化后的 exact flow name 集合，不以行数相等代替集合相等，也不把 shared rule、closure row 或 technical branch row 计作 flow。

| flow family | Step 9 expected | R15.4 actual | missing | extra | duplicate matrix id / flow | result |
|---|---:|---:|---:|---:|---:|---|
| Command | 26 | 26 | 0 | 0 | 0 / 0 | pass |
| Query | 33 | 33 | 0 | 0 | 0 / 0 | pass |
| Inbound Event Consumer | 6 | 6 | 0 | 0 | 0 / 0 | pass |
| Outbound Event | 10 | 10 | 0 | 0 | 0 / 0 | pass |
| Operations Job | 8 | 8 | 0 | 0 | 0 / 0 | pass |
| **total** | **83** | **83** | **0** | **0** | **0 / 0** | **pass** |

机械复核同时确认：83 行的 Markdown 列数一致；每行都具有 exact disposition / surface、L2/L3 fact、L4 continuity/replay、L5 handoff/collaboration、L6 diagnostic、allowed L1 observation 和 forbidden fabrication 七个语义列。矩阵 ID 与 flow name 均为 83 个唯一值。

### 28.2 Disposition 与 authority 反向覆盖

| 必须闭合的分支 | 权威 surface | 本批闭合位置 | 反向检查结果 |
|---|---|---|---|
| Command Accepted / Rejected / DuplicateReplayed | response、protocol rejection、stored result、idempotency | §22、CMD-L4、D-CMD | 技术异常未伪装为 Rejected；duplicate 不重跑业务或 post-commit call |
| Query Visible / NotVisible / Degraded | resolver decision、exact repository read、query surface | §23、Q-L4、D-Q、H3 | 33/33 no-write；无 reserve、capture、repair、handoff 或 read-audit write |
| Inbound 七类 receipt disposition | source header gate、receipt、consumer UoW | §24、IN-L4、D-IN | Delayed / UnsupportedSchema 不伪造 completed receipt；duplicate exact replay |
| Outbound local / external 两套状态 | snapshot/capture UoW、typed collaboration outcome | §25、OUT-L4、H2S/H2C | Captured -> IntentBound 与 Candidate / PendingDelivery / Delivered / Failed / HandoffUnavailable 分离 |
| Job 六类 disposition | execution journal、typed report/envelope、idempotency | §26、JOB-L4、D-JOB | journal、report、runner signal 三分；duplicate 不 scan、resolve 或 collaborate |
| cross-protocol technical failure | Step 12 error、Step 13 recovery、Step 14 assembly mapping | §27 | commit unknown、rollback failed、consistency defect、startup failure和observer failure均未生成业务结论 |

反向覆盖没有发现“只有观察信号、没有权威载体”的 accepted / replay / receipt / report 分支，也没有发现“以日志文本、metric、span 或外部 backend 状态决定恢复”的路径。`H2S` 与 `H2C` 已逐行分开，避免把 local capture 和 external collaboration 合并成同一个 delivery truth。

### 28.3 Step 6~14 批次级一致性闭环

这里的 closure 只证明 R15.4 消费上游契约时没有产生冲突，不替代 `R15.15/R15.16` 对整个 Step 15 的最终 cross-step closure。

| 上游 Step | R15.4 消费的 closed contract | 本批检查 | 结果 |
|---|---|---|---|
| Step 6 objects | change、traceability、impact、derived/reference/report、snapshot/capture、journal 与 safe issue carrier | 只引用既有 carrier，不新增 observability truth object | pass |
| Step 7 Ports / repositories | 36 Ports、22 repository traits / 110 methods、external resolver/handoff/collaboration boundary | 不新增 generic ObservabilityPort、本地 audit store、outbox、relay 或 delivery repository | pass |
| Step 8 protocols | 26 + 33 + 6 + 10 + 8 protocol surface | disposition 逐协议保持 closed union，不扩展 response / receipt / report schema | pass |
| Step 9 flows | 83 个 exact flow、UoW phase、post-commit phase 和 no-write sequence | exact-set 83/83，missing / extra / duplicate 均为 0 | pass |
| Step 10 states | 24 state-like enums / 111 active variants / 638 ordered pairs | 未增加 observer-driven state、delivery state 或 audit state | pass |
| Step 11 persistence | same-authority UoW、stored result、snapshot/capture、journal、commit resolution | L1 signal 不参与 durability、replay、recovery 或 result reconstruction | pass |
| Step 12 errors | 17 ApplicationError、51 issue code、typed Port / entry wrapper | technical branch 只复用既有 taxonomy，不解析 raw text/private code 创建新分类 | pass |
| Step 13 concurrency | duplicate winner read、commit-unknown resolution、rollback failure与no-rerun | duplicate / unknown / failed 分支未形成额外 truth 或 external call | pass |
| Step 14 binding | API / Worker / Jobs phase、9 external Ports、14 callables、Configured/Fake/Disabled/Missing | physical route、credential、scheduler、topic/offset/lease 未进入矩阵 authority | pass |

### 28.4 Capability Hub 边界、historical material 与 blocker 审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| capability identity / registry / descriptor / seam / relation / exposure ownership | pass | 只观察本仓既有 local truth、derived/reference fact 和 declared handoff surface |
| governance approval / Policy truth | excluded | seam relation、review fact和safe ref不能提升为 approval truth |
| method-library asset relation | body-free | 只允许 asset ref/state/safe summary；method body、TaskDefinition、source code均禁止 |
| SDK exposure boundary | preserved | formal exposure与controlled view不等于SDK client、package、publication或runtime authorization |
| runtime / tools execution | excluded | 不创建 invocation、tool result、execution status、allowlist或runtime cache truth |
| marketplace listing / transaction | excluded | 不创建listing、pricing、transaction、fulfillment或delisting truth |
| external observability store | external owner | 不创建本地第二套audit ledger，不把backend成功作为Hub accepted truth |
| local outbox / relay / DLQ / attempt / lease / ack | excluded | outbound只拥有snapshot/capture及IntentBound；physical delivery lifecycle不回流 |
| 旧正式 `03` / README provider-cost-runtime主线 | historical_material | 未用于补齐矩阵，也未重新引入旧对象、状态或错误语义 |
| unresolved upstream blocker | 0 | 现有 Step 6~14 carrier足以承接后续日志切口推导 |
| non-blocking design debt | 2 | 保留 `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` 与 `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001`，本批不声称已同步 L0-core |

## 29. R15.4 自检、停审快照与下一批门禁

### 29.1 本批自检

| Gate | Result | Evidence / reason |
|---|---|---|
| R15.3 六层分类已被消费 | pass | §§21~27；每个 flow 都区分 L1~L6 authority |
| Step 9 exact flow set | pass | §28.1；83/83，missing=0，extra=0，duplicate=0 |
| five-family cardinality | pass | 26 Command + 33 Query + 6 Inbound + 10 Outbound + 8 Job = 83 |
| Query no-write | pass | 33/33 使用 Q-L4 / H3；没有 reserve、write、capture、repair或collaboration |
| duplicate no-rerun | pass | Command / Inbound / Job exact stored replay；Outbound same capture continuation；无第二次业务 effect |
| local capture / external collaboration separation | pass | H2S 与 H2C、§25三阶段和§28.2均已固定 |
| business fact / runtime signal separation | pass | observer/backend failure不改变truth、disposition、replay或recovery |
| cross-step baseline mutation | none | object、field、protocol、state、Port、repository、error和issue code增量均为0 |
| Rust declaration / structure comment delta | 0 / pass | 本批没有新增或修改 Rust struct、field、enum、variant、payload、trait或callable；不存在遗漏英文 `///` 的新声明 |
| final log / metric / span / audit event definition | not entered | 本批只完成分层总矩阵；`R15.5~R15.14`仍为pending |
| formal document / next Step | untouched | 正式`03`未修改，正式`04`未创建，Step 16~19未开始 |
| implementation artifact | absent | implementation ledger与planned boundary skeleton均未创建 |
| implementation/test/run/evidence/sign-off/commit claimed | no | 未实现、未执行或声称测试；未伪造run_id、evidence alias、验收签署或commit |
| unresolved upstream blocker | 0 | 两项L0-core事项保持non-blocking design debt，不阻塞`R15.5` |

### 29.2 Stop-review snapshot

```text
document = 03-详细设计.md
step = 15 定义可观测性与审计埋点契约
batch = R15.4 分层与总原则:再写入
batch_status = completed_stop_review
step_15_status = in_progress
command_matrix = 26/26
query_matrix = 33/33
inbound_matrix = 6/6
outbound_matrix = 10/10
operations_job_matrix = 8/8
protocol_flow_exact_set = 83/83
missing_flow = 0
extra_flow = 0
duplicate_matrix_id = 0
duplicate_matrix_flow = 0
query_write_authorized = 0
new_rust_declarations = 0
new_or_modified_struct_fields = 0
formal_03_modified = false
formal_04_created = false
step_16_started = false
implementation_ledger_created = false
planned_boundary_skeleton_created = false
unresolved_upstream_blocker = none
non_blocking_cross_repo_design_debts = CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001,CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_5
```

### 29.3 下一批门禁

`R15.4` 已完成并停审。用户下一次明确确认后，只允许进入 `R15.5 structured log cuts:先思考`。进入时应先读取本文件 §§21~29、详细设计 SOP Step 15、书写规范 §5.14、Step 9 的 83-flow phase、Step 12 error / issue mapping、Step 14 API / Worker / Jobs / Port binding，以及 R15.4 的 O-ENTRY / O-READ / O-WRITE / O-COLLAB / O-JOB 分类。

`R15.5` 只推导 structured log 的 insertion point、owner、phase、触发条件、权威来源和禁止字段，不写最终日志表，不确定日志级别/事件名/字段 schema，不进入 `R15.6`，也不修改正式文档或创建后续 Step / implementation artifact。

当前不需要提交 commit；未经用户明确要求不得提交。

## 30. R15.5 structured log cuts:授权、输入闭包与问题边界

### 30.1 本批授权

用户已确认从 `R15.4 completed_stop_review` 进入 `R15.5 structured log cuts:先思考`。本批只回答“在哪里观察、由谁负责、处于哪个 phase、什么条件触发、权威来源是什么、哪些字段绝对禁止”的设计问题，不把候选切口直接写成正式日志埋点表。

本批允许写入：

1. 入口、application、local authority、repository/UoW、external Port、Worker、Outbound continuation、Jobs、runtime builder 和统一 diagnostic 的候选插入点。
2. 每个插入点的唯一 owner、phase、触发条件、观察目的和权威 truth/source surface。
3. 同一失败在 entry / application / infra 多层出现时的主记录层与可选关联层，避免重复表达。
4. 既有 `ApplicationError`、`CapabilityIssueCode`、typed Port outcome、protocol disposition 和 commit resolution 的日志观察位置。
5. 入口、UoW、Port、Worker、Jobs 和 config/runtime builder 的 body-free / redaction 禁止面。

本批禁止写入：

| 禁止项 | 原因 |
|---|---|
| 最终日志级别 | `R15.6` 按错误分支和位置统一裁决；本批只确定切口语义 |
| 最终 event name / log key / field schema | 避免先写字段再反向改变 owner、cardinality 或安全边界 |
| metric、trace/span、audit event 具体定义 | 分别由 `R15.7~R15.14` 处理；本批只说明日志与其他 surface 的非替代关系 |
| 新增 log Port、ObservabilityPort、audit store 或 error variant | 既有 `Step 7/12/14` owner 已闭合；观测切口不能创造第二真相源 |
| 告警阈值、采样、retention、dashboard、runbook、backend | 留给运维 / 配置 / 部署文档 |
| raw request/event/provider response、stack trace、secret、credential、endpoint、topic/offset/lease | 违反 Step 14 redaction 与 body-free 边界 |

### 30.2 本批读取闭包

| 输入 | 本批消费的结论 | 不得从输入推导 |
|---|---|---|
| Step 15 `R15.4` §§21~29 | 五族 disposition、L1~L6 分层、H0/H1/H2S/H2C/H3、O-ENTRY/O-READ/O-WRITE/O-COLLAB/O-JOB | 新 disposition、新 state 或日志字段全集 |
| Step 9 83-flow inventory / shared guards | exact entry -> application -> Port/UoW -> post-commit phase、Query no-write、duplicate no-rerun | generic `execute`、generic `publish`、generic `load current` 或新调用面 |
| Step 12 error / recovery | 17 `ApplicationError`、51 issue code、failure precedence、rollback、commit unknown、raw-to-typed mapping | 从错误文本、HTTP status、adapter private code重新分类 |
| Step 13 concurrency / idempotency | reserve、winner read、stored replay、same-authority commit resolution、no-rerun | 将 log record 当作 replay/result/recovery authority |
| Step 14 config / binding | Stage 0~7、API/Worker/Jobs owner、9 external Port、14 callable、Missing/Disabled/Unavailable边界 | raw config、physical route、scheduler、transport metadata或fallback owner |
| Step 4/5 layout / module contracts | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 的文件和分层归属 | 新建独立 `observability` crate 或跨层反向依赖 |
| Step 6/7 carriers / Port contracts | typed refs、safe summary、stored result、receipt、capture、journal、report、handoff ref | 通过日志补造缺失 carrier、body 或业务状态 |
| Step 15 §149 Step 14 handoff | raw / secret / credential / route / body forbidden list、Off/Redacted boundary | full/verbose diagnostic mode 或安全豁免 |

### 30.3 R15.5 的日志语义

本批将 structured log 视为 L1 runtime observation：它描述某个已发生的入口检查、调用阶段、typed result、技术失败或生命周期动作。日志必须能够回指既有 authority，但不能承载或替代该 authority。

| 日志主语 | 可表达 | 不可表达 |
|---|---|---|
| entry observation | 请求 / 事件 / Job 是否通过 header、schema、route、scope 和 metadata gate；dispatch observation 是否结束 | domain truth 已接受、外部服务已成功、应用 invocation 已取消 |
| application observation | exact operation family、编排 phase、typed disposition、UoW boundary、post-commit handoff boundary | 从日志重建 object、change、receipt、stored result 或报告 |
| local authority observation | begin、save/append/capture、commit resolution、rollback、barrier、winner read | staged body、replica guess、durability 未证明时的成功/失败结论 |
| Port / adapter observation | Port family、callable phase、typed outcome、raw failure 的既有分类 | provider response body、transport status推导的业务状态、外部健康真相 |
| Worker observation | source slot、activation、admission、receipt continuation、stop/join/drain | topic、offset、lease、attempt、encoded event body、application receipt的替代品 |
| Jobs observation | job admission、plan/journal phase、target ordinal category、deadline、join/drain、finalization | journal/report之外的 target outcome、自动 retry 授权、从 counter重建 report |
| diagnostic observation | existing issue/error kind、safe subject、phase、redacted reason、typed refs | 新 error、raw cause、stack trace、evidence alias、验收签署 |

### 30.4 唯一主记录层与关联层规则

同一个技术分支可能穿过多个层，但只能由最接近事实判定的 owner 形成主记录；上层最多记录安全的 phase transition 或 typed caller-visible outcome，并通过既有 correlation/ref 关联，不复制底层诊断正文。

| 场景 | 主记录层 | 上层允许的关联观察 | 禁止重复 / 越权 |
|---|---|---|---|
| route/schema/metadata rejected | entry | application 不得再写 accepted-like failure；可记录调用未dispatch | 不把协议拒绝复制为 domain error或Port failure |
| application validation / policy rejection | application | entry 可记录 caller-visible disposition；infra 不重新分类 | 不把 `Rejected`变成 adapter unavailable |
| UoW begin/save/commit/rollback failure | local authority / UoW owner | application 记录既有 ApplicationError / phase boundary | 不由 API 推断 durability，不由日志生成 stored result |
| external Port typed unavailable / failed | named Port/application collaboration owner | entry/application记录 typed outcome category | 不复制 response body，不把 external failure写成本地 truth failure |
| adapter raw source failure | adapter boundary | application只接收既有 PortFailure 分类 | 不由 application解析 raw text或status |
| Worker source / task lifecycle failure | Worker owner | application记录 receipt/continuation结果（若已形成） | 不由 Worker创建 receipt、journal或delivery lifecycle |
| Job journal/report failure | application Job owner | Jobs记录 runner observation和host-safe return | 不由 runner counter重建report，不把 host retry当业务retry |
| runtime builder failure | infra runtime builder | selected entry只看到startup unavailable | 不启动partial graph，不把startup failure映射成协议响应 |
| observer/backend failure | existing caller boundary | 仅在不递归时记录backend category | 不回滚业务truth、不改变原 disposition |

### 30.5 Phase vocabulary（编辑性，不新增状态）

下列 phase 只引用 Step 9/11/14 已有调用顺序，是 R15.5 组织日志切口的编辑性标签，不是新增 Rust enum、protocol state 或 persisted lifecycle：

| phase family | 适用位置 | 观察边界 |
|---|---|---|
| `entry_admission` | API、Worker、Jobs 进入 application 前 | metadata/schema/route/actor/body-size/scope 对称检查和 dispatch gate |
| `application_pre_uow` | Command、可写 Consumer、Job planning | body-local validation、operation context、digest input、resolver prerequisite；Query只使用 read path |
| `uow_active` | Command、Consumer、Outbound source、Job target/final report | begin、reserve、load、domain call、save/append/capture、stored result、completion |
| `commit_resolution` | 所有拥有 UoW 或 commit observation 的 owner | Durable / NotDurable / Unknown、barrier、exact read、rollback result |
| `post_commit_collaboration` | Outbound、handoff、external collaboration、repair Job | official snapshot/capture读取、typed Port invocation、bind/handoff continuation |
| `worker_lifecycle` | source task、activation、continuation、shutdown | parked、active、stop、drain、join、cleanup；不记录 transport private metadata |
| `job_lifecycle` | Jobs admission、journal、target、finalization、process drain | Ready/InFlight/Consumed observation、deadline、journal/report/ref、join/drain |
| `startup_assembly` | infra config validation、runtime builder Stage 0~7 | selected entry、binding slot、stage failure、prefix disposal、complete predicate |
| `diagnostic_resolution` | error mapper、redaction gate、observer backend boundary | existing typed issue/error、safe ref、redacted category和source omission |

本词汇表不决定单条日志何时开始/结束，也不决定同一 flow 是否需要一条或多条日志；这些要在 `R15.6` 结合错误分支和字段规则裁决。

## 31. R15.5 structured log cuts:插入点候选矩阵

### 31.1 Entry / API 边界

API 只观察协议入口和 application invocation 的安全边界。API 不拥有 repository、UoW、resolver、external Port 或 raw config，因此不能在 API 层判断 durable truth、Port failure 细类或 domain transition。

| cut id | insertion point | owner | phase | trigger | authoritative source | allowed observation purpose | forbidden material |
|---|---|---|---|---|---|---|---|
| L-API-01 | route / operation / concrete body对称校验完成或失败 | `api` entry | `entry_admission` | route、operation name、schema version或body variant不匹配 | Step 8 exact handler mapping and protocol rejection surface | 说明入口是否到达 application；区分 protocol rejection 与未dispatch | request body、route secret、raw transport body、HTTP status text |
| L-API-02 | metadata / trace / idempotency header gate | `api` entry + existing metadata mapper | `entry_admission` | required metadata缺失、非法或通过 | protocol metadata contract、existing validation issue | 记录 metadata gate category和safe correlation availability | raw header map、credential、token、full idempotency key |
| L-API-03 | application service dispatch前后 | `api` entry | `entry_admission` -> `application_pre_uow` | exact service callable被调用；调用返回typed response或error | Step 8 handler/service contract and Step 9 entry call order | 记录 operation family、dispatch boundary、caller-visible typed disposition | response body dump、domain object dump、application invocation cancellation claim |
| L-API-04 | Query response surface形成后 | `api` entry | `entry_admission` end | Query返回 Visible / NotVisible / Degraded或ApplicationError | Query resolver decision and exact response surface | 记录 read outcome与duration；证明入口没有写路径 | query body、subject enumeration、read audit write claim |
| L-API-05 | API observation timeout / transport return | `api` entry | `entry_admission` / observation end | response observation预算结束或transport返回 | Step 14 non-cancelling invocation contract | 记录 observation end与continued application ownership的分离 | “application已取消/未执行”结论、retry authorization、raw response |
| L-API-06 | API exposure barrier打开或阻断 | API composition root | `startup_assembly` | complete graph、listener ownership和non-cancelling proof成立/失败 | Step 14 Stage 0~7 complete predicate | 记录 entry availability boundary和startup failure category | partial graph、fallback entry、business protocol rejection、config raw values |

API 的 `L-API-03` 只负责 dispatch boundary；业务 accepted/rejected 的主记录由 application，commit resolution 由 local authority。这样 API 日志不会把 transport response 等同于业务 truth，也不会在 timeout 后声称 invocation 被取消。

### 31.2 Application Command / Query / Consumer / Outbound source 边界

application 是 protocol disposition 与业务编排的主 owner，但不是 runtime log backend、external delivery owner 或 raw adapter failure解析器。Command、可写 Inbound 和 Outbound source 使用既有 UoW；Query 保持 strict no-write。

| cut id | insertion point | owner | phase | trigger | authoritative source | allowed observation purpose | forbidden material |
|---|---|---|---|---|---|---|---|
| L-APP-01 | exact service进入 shared guard / write-channel canonical digest boundary | `application` | `application_pre_uow` | Command / Consumer / Job handler通过入口校验；canonical encoder / digest形成或返回既有CodecFailure | Step 9 shared guard + Step 13 canonical request digest contract | 记录 exact operation family、channel、flow ref、初始phase和safe codec/integrity category | generic operation name替代 exact flow、request body、digest bytes、full key或new digest字段 |
| L-APP-02 | body-local validation / forbidden-body gate | `application` | `application_pre_uow` | required field、scope、variant、body-free或policy-only约束通过/拒绝 | Step 8 protocol contract + Step 12 validation mapping | 记录既有 validation / rejection category和安全 subject kind | raw body、policy expression、method/document body、raw error text |
| L-APP-03 | idempotency reserve result | `application` | `application_pre_uow` -> `uow_active` | reserve获得、completed duplicate、in-progress或matching winner read | Step 13 idempotency repository and stored result/receipt/report | 记录 reservation branch、duplicate replay boundary、no-rerun判定 | full idempotency key、request bytes、winner response body、second mutation claim |
| L-APP-04 | prerequisite resolver / exact owner load | `application` | `application_pre_uow` / `uow_active` | identity、registry、descriptor、relation、exposure或reference prerequisite读取 | Step 7 exact repository/resolver callable | 记录 prerequisite phase、typed missing/unavailable/degraded/consistency category | resolver response body、secret、external document、current-truth reconstruction |
| L-APP-05 | domain factory/member/policy返回 | `application` | `uow_active` | declared transition、no-op、stable rejection或domain error | Step 6 object contract and Step 10 state matrix | 记录 exact flow phase、transition category、changed/no-op branch | direct field values、method body、governance approval、runtime decision |
| L-APP-06 | local effect set完成写入前 | `application` | `uow_active` | change/trace/impact/material/reference/capture/stored result/receipt/report均按flow声明形成 | Step 9 side-effect inventory + Step 11 UoW contract | 记录 effect-set phase和声明的 carrier family，供后续commit observation关联 | staged body、partial effect当作已提交、log-derived result |
| L-APP-07 | accepted/rejected/duplicate typed surface形成 | `application` | `uow_active` / `commit_resolution` | stable rejection surface、stored replay surface或fresh accepted result已准备 | Step 8 response/rejection/replay surface | 记录 caller-visible disposition的形成阶段，不宣称 durable直到commit resolution | response payload、stored result复制、accepted audit提前写入 |
| L-APP-08 | Query resolver-first completion | `application` | `application_pre_uow` | Query Visible / NotVisible / Degraded / technical error | Step 9 Query no-write flow and resolver decision | 记录 read path completion、visibility/freshness/degraded category和duration | begin/reserve/write/capture/repair/handoff/read audit |
| L-APP-09 | Outbound source snapshot/capture准备 | `application` | `uow_active` | source revision、immutable snapshot和local capture进入同一source UoW | Step 9 Outbound Phase A and Step 11 capture authority | 记录 source/capture phase和capture ref availability category | event payload body、physical route、delivery status、outbox/relay lifecycle |
| L-APP-10 | post-commit handoff/collaboration facade dispatch | `application` collaboration facade | `post_commit_collaboration` | official stored snapshot/capture可读且调用条件成立 | Step 9 Phase B/C and Step 7 collaboration/handoff Port | 记录 continuation开始、typed external outcome和bind/handoff boundary | external response body、local delivery truth、rollback local commit |

### 31.3 Local authority / UoW / repository 边界

local authority 是 durability 与 commit resolution 的唯一主记录层。Repository adapter 可以记录技术调用切口，但不得自己解释业务 disposition；UoW owner必须在结果未知时保留 `Unknown`，不能由日志推断成功或失败。

| cut id | insertion point | owner | phase | trigger | authoritative source | allowed observation purpose | forbidden material |
|---|---|---|---|---|---|---|---|
| L-UOW-01 | `begin()` 成功 / 失败 | local UoW manager | `uow_active` | write flow创建UoW或begin失败 | Step 11 transaction contract | 区分没有effect的begin failure与已进入UoW | transaction internals、connection string、SQL/body、accepted result |
| L-UOW-02 | write-channel reserve / authority exact read / winner read | local persistence authority | `uow_active` / `commit_resolution` | write flow中的idempotency reserve，或rollback/commit resolution后的stored replay、winner、owner/version exact read | Step 11/13 same-authority read procedure | 记录 read purpose、matching branch和safe transaction ref availability；Query exact read不进入本切口 | full key、row/body dump、replica identity、log-derived winner result |
| L-UOW-03 | domain effect save / append / capture / stored surface save | repository/UoW owner | `uow_active` | declared write call成功或失败 | Step 7 exact method and Step 11 atomic effect set | 记录 operation group、effect family、call phase和failure class | staged object body、uncommitted truth、secret或payload bytes |
| L-UOW-04 | idempotency completion | local persistence authority | `uow_active` | stored response/receipt/report与completion record准备完成 | Step 8/11/13 stored replay contract | 记录 completion phase与sidecar symmetry检查 | 从日志创建completion、复制response/report body |
| L-UOW-05 | commit result | local UoW manager | `commit_resolution` | commit返回 Durable / NotDurable / Unknown | Step 11/13 three-state resolution | 记录 durability branch、safe ref和resolution budget category | Unknown改写为success/failure、commit text、replica guess |
| L-UOW-06 | rollback / rollback-failed | local UoW manager | `commit_resolution` | technical failure触发rollback，或rollback自身失败 | Step 12 recovery precedence | 记录原始phase与rollback outcome，保留无法证明的部分 | zero-effect claim、normal Failed target、raw backend error |
| L-UOW-07 | linearizable barrier / recovery exact read | same authority owner | `commit_resolution` | commit unknown或sidecar asymmetry需要resolution | Step 13 barrier and exact stored read | 记录 resolution attempt、barrier/result category和consistency diagnostic | 从日志/metric重建stored result、blind retry、repair mutation |
| L-UOW-08 | repository adapter raw failure映射前 | named infra adapter | `application_pre_uow` / `uow_active` / `diagnostic_resolution` | Query exact read或write-flow dependency返回既有typed/raw source failure | Step 12 raw-to-typed mapping | 记录 adapter family和已允许的 failure category，供ApplicationError关联；Query仍不创建UoW | raw error text、SQL/HTTP/provider body、private status classification |

### 31.4 External Port / adapter 边界

external Port 的日志主语是 typed boundary，而不是外部系统本身。adapter 只记录形成 typed return 所需的安全分类；外部 provider / governance / method-library / secret / document / consumer / observability body始终留在边界外。

| cut id | insertion point | owner | phase | trigger | authoritative source | allowed observation purpose | forbidden material |
|---|---|---|---|---|---|---|---|
| L-PORT-01 | resolver / source Port call前 | named external Port adapter | `application_pre_uow` / `post_commit_collaboration` | application发起body-free typed lookup或handoff | Step 7/14 exact Port + callable | 记录 Port family、callable phase、safe subject/ref和调用开始 | endpoint、credential、headers、request body、transport route |
| L-PORT-02 | resolver Port返回 typed outcome | named external Port/application boundary | `application_pre_uow` | Visible/Unresolved/Unavailable/Rejected等既有 outcome | Step 8/12 typed external surface | 记录 typed outcome family、resolution state或safe summary availability | provider response body、外部健康结论、raw status |
| L-PORT-03 | handoff / collaboration Port返回 typed outcome | named handoff / collaboration Port owner | `post_commit_collaboration` | handoff Accepted/Rejected/Unavailable/Retryable，或collaboration Candidate/Pending/Delivered/Failed/HandoffUnavailable等既有 outcome | Step 8/9 handoff and collaboration outcome contracts | 记录 external outcome category和local bind/handoff continuation边界 | external receipt body、attempt/lease/ack、local delivery state、acceptance evidence |
| L-PORT-04 | Port raw source failure分类 | adapter boundary | `diagnostic_resolution` | 无安全typed discriminant或concrete adapter failure | Step 12 `UnexpectedSourceFailure` / existing PortFailure mapping | 记录既有 raw-source class和safe diagnostic ref | raw error、HTTP status、private provider code、自动retry结论 |
| L-PORT-05 | typed response shape / symmetry gate | adapter + application boundary | `diagnostic_resolution` | malformed tuple、wrong owner/kind/source/version或carrier asymmetry | Step 12 InvalidTypedResponse / ConsistencyDefect mapping | 记录 shape invariant、phase和safe correlation ref | response body、payload bytes、把shape defect降级为unavailable |
| L-PORT-06 | disabled / missing / not configured binding | infra binding owner | `startup_assembly` or `application_pre_uow` | exact slot显式Disabled、required slot Missing或未配置 | Step 14 four-state binding matrix | 记录 slot kind、profile、typed unavailable boundary | fallback adapter、成功型fake、raw config、业务rejection替代startup failure |

### 31.5 Worker / Inbound / Outbound continuation 边界

Worker 记录 source runner 的生命周期和 admission，application 记录 receipt 与业务 effect。Outbound continuation 记录 capture continuation 和 Port outcome，不拥有物理投递生命周期。

| cut id | insertion point | owner | phase | trigger | authoritative source | allowed observation purpose | forbidden material |
|---|---|---|---|---|---|---|---|
| L-WKR-01 | named source slot activation decision | Worker root | `startup_assembly` / `worker_lifecycle` | Configured、DeterministicFake、Disabled或Missing判定 | Step 14 named source and activation barrier | 记录 source slot、binding decision、activation prerequisite | topic/group/partition、credential、wildcard route、raw config |
| L-WKR-02 | source task parked / activation barrier | Worker supervisor | `worker_lifecycle` | enabled task ready、Disabled slot closed、barrier打开/阻断 | Step 14 task lifecycle | 记录 lifecycle phase、barrier result和cleanup ownership | task object、runtime handle、transport metadata、partial graph |
| L-WKR-03 | header-first source admission | Worker driver | `entry_admission` | trusted actor、schema、body-size、logical event gate通过/失败 | Step 14 inbound source gate | 记录 source family、schema category、trusted actor decision、receipt path entry | encoded envelope bytes、offset/lease/delivery token、actor credential |
| L-WKR-04 | application consumer callable return | application consumer facade | `application_pre_uow` / `uow_active` | Accepted、DuplicateReplayed、Delayed、Ignored、Rejected、UnsupportedSchema或Quarantined | Step 8 receipt + Step 9 inbound flow + Step 12 mapping | 记录 typed receipt/disposition boundary和no-core-truth effect | receipt body dump、upstream event body、worker-private completion token |
| L-WKR-05 | worker continuation completion / failure | Worker continuation owner | `worker_lifecycle` | exact capture-ref continuation完成、失败或需要repair handoff | Step 14 guarded continuation and Step 9 Outbound continuation | 记录 continuation phase、safe capture ref category、cleanup result | retry count、queue/DLQ、lease/ack、new event/capture |
| L-WKR-06 | stop / drain / join / cleanup | Worker supervisor | `worker_lifecycle` | shutdown、partial-start rollback、task panic/cancellation或cleanup failure | Step 14 six-task lifecycle and cleanup contract | 记录 stop order、drain/join completion和original failure preservation | panic stack、task body、transport metadata、business receipt/report |
| L-OUT-01 | stored capture loaded for continuation | application collaboration facade | `post_commit_collaboration` | official snapshot/capture可读 | Step 9 Outbound Phase B | 记录 capture continuation开始和source authority | rebuild payload from current truth、payload body、route destination |
| L-OUT-02 | external collaboration typed return | collaboration Port owner | `post_commit_collaboration` | typed success/failure/unavailable/handoff outcome | Step 8/9 collaboration outcome | 记录 external outcome与local status separation | local Delivered/Failed state、external receipt body、attempt lifecycle |
| L-OUT-03 | capture bind / bind failure | application capture continuation | `post_commit_collaboration` | Captured -> IntentBound或bind失败 | Step 9 Phase C + capture state contract | 记录 bind phase、same capture identity和repair handoff boundary | second capture、new event、delivery success claim、rollback source truth |

### 31.5.1 Inbound / Outbound 不重复原则

1. Worker admission failure由 Worker 主记录；application 只有在 callable 被调用并形成 typed receipt/disposition 后才记录 application surface。
2. Inbound receipt 是 application-owned protocol fact；Worker log 不能替代 receipt，也不能为 Unsupported/Delayed 伪造 completed receipt。
3. Outbound source UoW、capture bind 和 external Port outcome分别由 source/application、capture continuation、collaboration owner观察；不输出本地 outbox、relay、DLQ、attempt、lease或ack日志。
4. Duplicate Inbound/Outbound continuation只观察 exact replay / same capture continuation，不重新记录业务 mutation或生成第二个 capture。

### 31.6 Jobs / Operations boundary

Jobs 记录 entry admission 和 process lifecycle，application Job owner记录 journal、per-target outcome与typed report。host scheduler只提供启动，不拥有 retry、queue、lease、attempt或业务报告。

| cut id | insertion point | owner | phase | trigger | authoritative source | allowed observation purpose | forbidden material |
|---|---|---|---|---|---|---|---|
| L-JOB-01 | job request header/kind/schema/body symmetry gate | Jobs entry | `entry_admission` | exact job kind、schema、metadata或bounded body gate通过/失败 | Step 8 Job protocol + Step 14 header-first admission | 记录 admission category和是否dispatch | job input body、raw bytes、host scheduler metadata |
| L-JOB-02 | application Job dispatch | Jobs entry + application facade | `entry_admission` -> `application_pre_uow` | exact handler/facade被调用或调用前失败 | Step 14 Jobs composition and Step 9 Job entry | 记录 dispatch boundary、job kind和safe run/ref availability | host-generated business id、raw request、application result body |
| L-JOB-03 | deterministic plan / reserve / initial journal | application Job owner | `application_pre_uow` / `uow_active` | fresh plan、duplicate replay、in-progress或safe reentry判定 | Step 9 Job planning + Step 13 replay + Job journal | 记录 planning branch、journal phase和reentry boundary | rescan current truth、attempt counter、retry permission、journal body |
| L-JOB-04 | per-target UoW / journal terminalization | application Job owner | `uow_active` / `commit_resolution` | target changed/no-op/typed failed/technical failure terminal outcome | Step 9/11 Job target journal contract | 记录 target ordinal category、terminalization phase和commit result | target body、counter-derived report、rollback prior targets |
| L-JOB-05 | final report assembly / completion | application Job owner | `uow_active` / `commit_resolution` | final typed report/envelope、stored result和idempotency completion形成 | Step 8/9/11 Job final report UoW | 记录 finalization boundary、report/ref availability和commit resolution | report body dump、从log重建report、accepted before durable commit |
| L-JOB-06 | post-commit collaboration / repair target | application Job owner + collaboration Port | `post_commit_collaboration` | official capture/snapshot loaded，repair/bind/collaboration callable返回 | Step 9 Job collaboration flow + Step 14 Port binding | 记录 target phase、typed external outcome和repair continuation | new event/capture、external body、local delivery lifecycle、host retry |
| L-JOB-07 | Jobs observation timeout / process drain | Jobs runtime | `job_lifecycle` | observation deadline、terminal notification、join/take/drain | Step 14 non-cancelling Jobs runtime | 记录 process observation end、drain/join ownership和host-safe return | application cancellation claim、detach、entry auto-retry、queue/lease |
| L-JOB-08 | runner / process startup or cleanup failure | Jobs runtime + infra builder | `startup_assembly` / `job_lifecycle` | runtime construction、task spawn、join、cleanup或response delivery failure | Step 14 Jobs failure totality | 记录 technical lifecycle category和cleanup precedence | typed Job report fabrication、raw runtime error、second invocation |

### 31.7 Infra config / runtime builder 边界

infra 是配置验证和完整 runtime graph 的 owner。它只记录 startup 可用性与构造失败，不能把配置诊断转换成业务协议错误，也不能通过日志隐藏 partial graph。

| cut id | insertion point | owner | phase | trigger | authoritative source | allowed observation purpose | forbidden material |
|---|---|---|---|---|---|---|---|
| L-INF-01 | raw config source进入 validated root前 | `infra/config` | `startup_assembly` | source resolution、schema、profile、required/disabled slot验证 | Step 14 config validation contract | 记录 safe source category、profile、section/slot kind和validation result | raw key/value、file/env path、endpoint、credential、secret |
| L-INF-02 | Stage 0 `validate_root` | runtime builder | `startup_assembly` | root validation pass/fail | Step 14 Stage 0~7 sequence | 记录 stage、selected entry、safe failure class和complete predicate未达成 | full config、raw source chain、partial graph、fallback |
| L-INF-03 | Stage 1~2 authority / technical primitive build | runtime builder | `startup_assembly` | single authority、clock/id、codec/hash、technical policy构造通过/失败 | Step 14 builder and dependency matrix | 记录 stage result、binding family和cleanup/disposal phase | connection string、algorithm body、secret、dependency version text |
| L-INF-04 | Stage 3 local Port graph | runtime builder | `startup_assembly` | 27/27 local/base Port graph构造通过/失败 | Step 14 single-authority local graph | 记录 port family/coverage category和partial-prefix disposal | repository body、DB schema、partial graph returned |
| L-INF-05 | Stage 4 external Port graph | runtime builder | `startup_assembly` | 9/9 external Port / 14 callable binding通过、Disabled或失败 | Step 14 external binding matrix | 记录 external family、slot decision、typed unavailable/startup class | endpoint、route、credential、provider response、fallback fake |
| L-INF-06 | Stage 5~7 selected entry / exposure barrier | runtime builder + entry root | `startup_assembly` | API/Worker/Jobs selected graph、neutral handoff、runtime owner和coverage成立/失败 | Step 14 complete predicate | 记录 selected entry、stage、barrier and cleanup outcome | listener body、task handles、host scheduler、business rejection |
| L-INF-07 | all-cause partial-prefix disposal | runtime builder | `startup_assembly` | any Stage 0~7 failure requires ordered cleanup | Step 14 failure precedence and cleanup contract | 记录 original failure category、cleanup completion and no-partial-return | raw cleanup errors、partial graph reuse、fallback entry |

### 31.8 Cross-cutting diagnostic / observer backend 边界

diagnostic 只负责把既有 error/issue 和 redaction 规则转换为安全观察；如果日志 backend 本身失败，caller不能改变原 business authority。该边界留给后续 `R15.6` 决定是否需要单独的 failure log，以及如何避免递归。

| cut id | insertion point | owner | phase | trigger | authoritative source | allowed observation purpose | forbidden material |
|---|---|---|---|---|---|---|---|
| L-DIAG-01 | existing ApplicationError / issue mapper | error/application owner | `diagnostic_resolution` | typed error或issue ref形成 | Step 12 mapper and fixed issue taxonomy | 记录既有 error kind、issue category、safe ref和operation phase | raw cause、new error、private code、stack trace |
| L-DIAG-02 | redaction / diagnostic mode gate | boundary owner | `diagnostic_resolution` | Off / Redacted profile决定可输出内容 | Step 14 Off/Redacted contract | 记录 redacted category、source omitted和safe summary availability | full/verbose mode、secret、raw body、authorization internals |
| L-DIAG-03 | observer backend invocation boundary | existing caller owner | caller's current phase | structured log sink调用成功/失败，且无需递归记录 | Step 15 observer failure invariant | 仅记录 backend failure category（若不会递归），不影响原流程 | backend response/body、retry loop、business rollback |
| L-DIAG-04 | ConsistencyDefect / impossible typed relation | application/infra owner | `diagnostic_resolution` | loaded object、stored sidecar或Port tuple违反既有 invariant | Step 12 consistency defect catalog | 记录 subject kind、invariant category、phase和safe refs | normal missing、Degraded、Quarantined或可重试结论 |
| L-DIAG-05 | CommitOutcomeUnknown / rollback failed | local authority owner | `commit_resolution` | durability或rollback结果未证明 | Step 11/12/13 resolution and recovery | 记录 unresolved branch、transaction ref和manual-resolution category | accepted、failed、zero-effect、blind retry |
| L-DIAG-06 | duplicate / idempotency in-progress diagnostic | application owner | `application_pre_uow` / `uow_active` | duplicate stored replay、same-key active reservation或winner reread | Step 13 exact replay procedure | 记录 duplicate/in-progress phase和safe result ref availability | full key、second mutation、winner body或conflict persistence |

### 31.9 位置覆盖与重复 owner 初步审计

| 观察主题 | 必须有主记录的 owner | R15.5 覆盖 cut | 重复 owner 风险 | 裁决 |
|---|---|---|---|---|
| protocol admission | API / Worker / Jobs entry | L-API-01/02、L-WKR-03、L-JOB-01 | application重复记录同一协议拒绝 | entry主记录；application只记录已dispatch后的typed结果 |
| application disposition | application service / consumer / Job owner | L-APP-02/03/05/07/08、L-WKR-04、L-JOB-03~05 | entry把transport结果当业务结果 | application主记录；entry只保留caller-visible boundary |
| durability / commit | local UoW authority | L-UOW-01~07、L-JOB-04/05 | API、Port、Job runner各自猜commit | authority主记录；其他层只关联安全 phase/ref |
| external typed outcome | named Port / collaboration owner | L-PORT-02/03/04/05、L-OUT-02、L-JOB-06 | application和adapter复制response或重分类 | Port主记录typed outcome；application记录调用边界 |
| Worker lifecycle | Worker supervisor / continuation owner | L-WKR-01/02/05/06 | application创建task lifecycle truth | Worker主记录；application只记录receipt/effect |
| Job report / journal | application Job owner | L-JOB-03~06 | runner从counter重建report | application journal/report主记录；Jobs只记录process observation |
| startup assembly | infra builder | L-INF-01~07 | entry把startup failure映射成协议拒绝 | infra主记录；entry exposure barrier只关联结果 |
| diagnostic safety | error/boundary owner | L-DIAG-01~06 | 每层输出raw cause或递归observer error | typed/redacted主记录；raw source永不出边界 |

本节形成的是 insertion-point candidate inventory，不是最终日志事件数量。一个 flow 可以在 `R15.6` 被裁决为“单条结构化日志承载多个 phase字段”，也可以被裁决为多个日志位置；本批不预先固定该数量。

## 32. R15.5 反向覆盖与主记录 owner 审计

### 32.1 83 条 flow family 到基础日志切口的覆盖

本批把 Step 9 的 83 个 exact flow 名称反向投影到 `L-*` 候选切口。这里的“覆盖”表示实现者至少能找到一个负责记录入口、编排、权威提交、typed boundary 或生命周期观察的候选位置；它不表示每个 flow 都要产生一条日志，也不预先决定日志级别或字段。

| flow family | Step 9 exact 数量 | 主要主记录切口 | 反向覆盖规则 | 结果 |
|---|---:|---|---|---|
| Command | 26 | `L-APP-01..07`、`L-UOW-01..07`、需要时 `L-APP-09..10` / `L-PORT-*` | admission由`L-API-*`或对应entry承接；validation、reserve、domain disposition和effect set由application承接；durability由UoW承接 | 26/26 |
| Query | 33 | `L-APP-08`、repository/read-adapter failure时的`L-UOW-08`、`L-DIAG-01/04`；API返回由`L-API-04`承接 | 本地visibility resolver-first、exact read、Visible/NotVisible/Degraded和technical error均保持no-write；不调用external resolver，不映射到`L-UOW-01..07`的写事务 | 33/33 |
| Inbound Event Consumer | 6 | `L-WKR-03`、`L-WKR-04`、必要时 `L-PORT-01..05`、`L-UOW-*` | Worker只记录header-first admission；application记录receipt/disposition；reference resolver或local append的权威结果由对应owner承接 | 6/6 |
| Outbound Event | 10 | `L-APP-09`、`L-UOW-03/05/06/07`、`L-OUT-01..03`、`L-PORT-03` | source/snapshot/capture在source UoW，external typed outcome在Port，IntentBound在capture continuation；不创建delivery lifecycle | 10/10 |
| Operations Job | 8 | `L-JOB-01..08`、`L-UOW-01..07`、`L-PORT-*` | Jobs runtime只记录admission/deadline/drain/join；application Job owner记录journal、target terminalization和typed report | 8/8 |
| **总计** | **83** | 上述五族候选集合 | exact flow name 集合与主记录覆盖集合逐族比较 | **83/83** |

反向检查固定以下结论：

1. 26 个 Command 不会因为 API 返回而重复生成 accepted truth；`L-APP-07` 只观察 typed surface形成，`L-UOW-05` 才观察 durability。
2. 33 个 Query 的 exact read、visibility decision和degraded surface不得触发 reserve、capture、audit write、repair或post-commit handoff；`L-UOW-02`在Query场景只保留“未进入本切口”的边界说明。
3. 6 个 Inbound 的 `UnsupportedSchema`、`Delayed`、`Quarantined`和duplicate receipt不会由 Worker lifecycle log伪造为`Complete`。
4. 10 个 Outbound 的 `Captured -> IntentBound` 是本地capture lifecycle；`Candidate / Pending / Delivered / Failed / HandoffUnavailable`仍是外部Port-owned typed outcome。
5. 8 个 Job 的 final disposition必须来自journal/report；`L-JOB-07/08`的deadline、join、cleanup和response delivery观察不能重建report。

### 32.2 Command / Query / Inbound / Outbound / Job coverage profile

| profile | 必须有的观察层 | 允许的主记录 | 明确不允许的替代 |
|---|---|---|---|
| Command write | entry admission、application validation、idempotency、domain/effect、UoW/commit、typed diagnostic | `L-API-*` + `L-APP-01..07` + `L-UOW-*` + `L-DIAG-*` | API response替代commit；log替代stored result；Port outcome替代local accepted fact |
| Query read | entry admission、本地visibility resolver/read outcome、visibility/degraded、duration、typed diagnostic | `L-API-04` + `L-APP-08` + failure-only `L-UOW-08` + `L-DIAG-*` | external resolver invocation、`begin`、reserve、capture、write audit、Job report、current-truth重建 |
| Inbound consume | source activation、header-first gate、application receipt、必要的resolver/UoW结果、worker completion | `L-WKR-01..04` + `L-UOW-*` + `L-PORT-*` | topic/offset/lease/ack、event body、Worker log伪造receipt |
| Outbound collaboration | source capture、post-commit load、Port typed result、bind/handoff continuation、repair lifecycle | `L-APP-09/10` + `L-OUT-*` + `L-PORT-03` + `L-JOB-06` | local outbox/relay/DLQ/attempt、external receipt body、Delivered推导为业务接受 |
| Operations Job | admission、plan/reserve、journal target、final report、deadline/drain/join、typed collaboration | `L-JOB-01..08` + `L-UOW-*` + `L-PORT-*` | scheduler retry、counter重建report、runner signal覆盖journal |

### 32.3 Step 12 的 17 个 ApplicationError 主记录映射

ApplicationError 的主记录 owner按“最接近形成该typed error的 authority”裁决。表中以斜线分隔的 cut 是按具体来源 phase选择的候选位置，不表示同一分支必须写多条日志；`L-DIAG-01`是统一mapper切口，不取代原始 owner。上层只能关联既有 issue/ref，不重复写 raw cause。

| ApplicationError | 主记录 owner / cut | 允许的上层关联 | 禁止推导 |
|---|---|---|---|
| `ContractRejected` | application/domain contract boundary: `L-APP-02` 或 entry `L-API-01/02` | caller-visible rejection phase | raw field/body、generic validation text |
| `DomainRejected` | domain/application service: `L-APP-05` | typed rejected disposition | approval、runtime deny、external failure |
| `InvalidInput` | application input boundary: `L-APP-02` / `L-DIAG-01` | safe input/invariant category | raw input or field value |
| `InvalidTechnicalStateTransition` | application technical object owner: `L-APP-05` / `L-DIAG-01` | operation phase and object-safe category | new state、automatic transition或retry |
| `TechnicalInvariantViolation` | application invariant owner: `L-APP-05` / `L-DIAG-04` | invariant family and safe subject kind | normal missing、Degraded或Quarantined |
| `MissingPrerequisite` | application prerequisite resolver: `L-APP-04` | typed missing prerequisite phase | arbitrary `None`、fallback owner或synthetic object |
| `OptimisticConflict` | repository/UoW CAS owner: `L-UOW-03` / `L-UOW-08` | application conflict surface | winner body、blind retry |
| `UniquenessConflict` | unique repository/authority: `L-UOW-03` / `L-UOW-08` | key family category without key value | last-write-wins、duplicate accepted fact |
| `IdempotencyConflict` | application reserve classifier: `L-APP-03` | safe matching-key class and rejection phase | full key、second mutation、log-derived winner |
| `IdempotencyInProgress` | application reserve / exact reentry owner: `L-APP-03`、`L-DIAG-06` | active reservation phase | attempt count、host retry或business rerun |
| `PortFailure` | named adapter raw-to-typed boundary: `L-PORT-04` / `L-UOW-08` | application typed dependency error via `L-DIAG-01` | raw status、provider health、retry from text |
| `TransactionBeginFailed` | UoW manager: `L-UOW-01` | application operation phase | accepted/rejected result、rollback claim |
| `TransactionCommitFailed` | UoW commit authority: `L-UOW-05` | `NotDurable` safe resolution category | accepted durable fact、Unknown混淆 |
| `TransactionRollbackFailed` | UoW recovery authority: `L-UOW-06` / `L-DIAG-05` | original phase and rollback-not-proven marker | zero-effect、normal Failed、blind retry |
| `CommitOutcomeUnknown` | same-authority resolver: `L-UOW-05/07`、`L-DIAG-05` | transaction ref、resolution budget/category | success、failure、NotDurable或zero-effect |
| `ConsistencyDefect` | typed relation authority: `L-PORT-05` after return, otherwise `L-DIAG-04` | subject/invariant safe category | normal missing、unavailable、retryable target |
| `CodecFailure` | originating canonical codec/digest phase: request/digest走`L-APP-01`，stored result/surface formation走`L-APP-07`，event snapshot走`L-APP-09`，persistence decode走`L-UOW-08`；`L-DIAG-01`只映射 | codec/integrity phase and safe carrier kind | payload bytes、body、secret、usable stored result |

### 32.4 51 个 CapabilityIssueCode 的 owner family 覆盖

Step 12 的 51 个 code 按其唯一 semantic source 分成下列 11 个 owner family。下表覆盖每个 code，不改变其固定 literal，也不把多个 code合并为新的 code。一个 code在不同入口可能由不同 source phase形成，但每个具体分支仍只有一个主记录 owner；`L-DIAG-01`只做既有 typed code 的安全映射。

| owner family | exact code members | 主记录切口 | coverage |
|---|---|---|---:|
| protocol envelope / request validation | `InvalidEnvelope`, `MissingRequiredField`, `OperationMismatch`, `InvalidField`, `InvalidScope` | `L-API-01/02`、`L-JOB-01`、`L-WKR-03`、`L-APP-02` | 5/5 |
| public duplicate / domain policy | `DuplicateConflict`, `PolicyRejected` | `L-APP-02/03/05` | 2/2 |
| body and visibility redaction | `BodyForbidden`, `RedactedBoundary`, `SubjectMissing` | `L-APP-02`、`L-PORT-02`、`L-DIAG-02` | 3/3 |
| reference resolution / material state | `ReferenceUnresolved`, `ReferenceUnavailable`, `StaleSource`, `MaterialRebuilding`, `MaterialUnavailable`, `PartialSurface` | `L-PORT-02`、`L-APP-04/08`、`L-DIAG-02` | 6/6 |
| inbound / target terminal boundary | `UnsupportedSchema`, `RetryRequired`, `BoundaryQuarantined`, `TerminalTargetSkipped` | `L-WKR-03/04`、`L-JOB-04`、`L-DIAG-01` | 4/4 |
| handoff / collaboration typed outcome | `HandoffRejected`, `HandoffUnavailable`, `HandoffRetryable`, `CollaborationFailed`, `CollaborationUnavailable` | `L-PORT-03`、`L-OUT-02`、`L-JOB-06` | 5/5 |
| application technical errors | `InvalidApplicationInput`, `InvalidTechnicalStateTransition`, `TechnicalInvariantViolation`, `MissingPrerequisite`, `OptimisticConflict`, `UniquenessConflict`, `IdempotencyConflict`, `IdempotencyInProgress` | `L-APP-02/03/04/05`、`L-UOW-03`、`L-DIAG-01/04/06` | 8/8 |
| dependency / transaction errors | `DependencyFailure`, `TransactionBeginFailed`, `TransactionCommitFailed`, `TransactionRollbackFailed`, `CommitOutcomeUnknown` | `L-PORT-04`、`L-UOW-01/05/06/07`、`L-DIAG-05` | 5/5 |
| consistency / codec errors | `ConsistencyDefect`, `CodecFailure` | `L-PORT-05`、`L-UOW-08`、`L-DIAG-01/04` | 2/2 |
| startup assembly | `RuntimeAssemblyFailed` | `L-INF-01..07`、`L-JOB-08`、`L-API-06` | 1/1 |
| entry-local mapping | `ApiRouteAssemblyFailed`, `ApiEnvelopeNormalizationFailed`, `ApiProtocolMappingFailed`, `WorkerInboundEnvelopeFailed`, `WorkerPayloadDecodingFailed`, `WorkerCollaborationContinuationFailed`, `WorkerMaintenanceTriggerFailed`, `JobInputFailed`, `JobApplicationDispatchFailed`, `JobResultMappingFailed` | `L-API-01/03`、`L-WKR-03/05/06`、`L-JOB-01/02/08`、`L-DIAG-01` | 10/10 |

合计 `5 + 2 + 3 + 6 + 4 + 5 + 8 + 5 + 2 + 1 + 10 = 51`。`UnsupportedSchema`只保留一个公共 code，API/Worker/Jobs 的来源差异由 source phase区分，不创建 channel-private code。

### 32.4.1 Exact flow-id partition

下表把 Step 9 / R15.4 的 exact matrix IDs 映射到本批的五类 coverage profile。区间均为闭区间；它是集合分区，不新增 flow，也不替代各 flow 的既有处理流正文。

| exact ID 集合 | 数量 | coverage profile | mandatory primary cuts |
|---|---:|---|---|
| `C01..C26` | 26 | Command write | `L-APP-01..07` + local UoW/diagnostic cuts；仅在具体 flow声明external resolver或post-commit handoff时追加 `L-PORT-*` / `L-APP-10` |
| `Q01..Q33` | 33 | Query read | `L-API-04` + `L-APP-08` + failure-only `L-UOW-08` / diagnostic cuts；严格排除external resolver、write UoW、capture和audit-write cuts |
| `I01..I06` | 6 | Inbound consume | `L-WKR-03/04` + application receipt/effect cuts；external reference resolver或local append按各flow选择 `L-PORT-*` / `L-UOW-*` |
| `O01..O10` | 10 | Outbound collaboration | `L-APP-09` + source UoW + `L-OUT-01..03` + `L-PORT-03`；external outcome和local capture bind不可合并 |
| `J01..J08` | 8 | Operations Job | `L-JOB-01..08` + target/final UoW cuts；runner lifecycle不能替代journal/report |
| **合计** | **83** | 五族 exact partition | **83/83，无交叉、无漏项** |

`C01..C26`、`Q01..Q33`、`I01..I06`、`O01..O10`、`J01..J08` 的名称和顺序以 Step 9 / R15.4 exact matrix为准；R15.5只为这些已有行提供基础日志观察位置。

### 32.5 Step 14 startup / invocation / binding 反向覆盖

| Step 14 分支 | 主记录 cut | 可观察边界 | 禁止转换 |
|---|---|---|---|
| raw source / schema / profile validation | `L-INF-01` | safe source category、profile、section/slot kind、validation result | raw key/value、path、endpoint、credential |
| Stage 0 root validation | `L-INF-02` | stage、selected entry、safe failure class、complete predicate | partial graph、fallback entry |
| Stage 1~2 authority / primitive construction | `L-INF-03` | stage result、binding family、cleanup phase | algorithm/body、secret、dependency source text |
| Stage 3 local/base Port graph | `L-INF-04` | 27/27 coverage category、prefix disposal | repository body、partial graph return |
| Stage 4 external Port graph | `L-INF-05` | 9/9 slots、14 callable family、Configured/Fake/Disabled/Missing decision | endpoint、route、provider response、fake fallback |
| Stage 5~7 selected entry / exposure barrier | `L-INF-06` / `L-API-06` | selected entry、barrier、coverage、cleanup outcome | startup failure as protocol rejection |
| any-stage partial-prefix cleanup | `L-INF-07` | original safe category、ordered cleanup completion、no-partial-return | cleanup raw error覆盖original failure、partial graph reuse |
| explicit Disabled | `L-PORT-06` / `L-WKR-01` | disabled slot and no-runner / typed NotConfigured boundary | success-like fake、business rejection替代binding fact |
| required Missing | `L-PORT-06` / `L-INF-01..07` | startup blocking source category | silent Disabled、fallback fake、partial availability |
| exposed invocation Temporary / Timeout | `L-PORT-04`、`L-API-05`、`L-WKR-05`、`L-JOB-07` | phase-specific observation end、typed failure class、ownership continuation | startup remap、automatic retry from log、cancel claim |
| typed external Failed / HandoffUnavailable | `L-PORT-03` / `L-OUT-02` / `L-JOB-06` | external-owned typed outcome and local continuation | local business failure、source rollback、delivery truth |
| malformed carrier / relation contradiction | `L-PORT-05` / `L-DIAG-04` | shape/invariant category、safe ref | downgrade to unavailable、synthetic success |
| commit resolution Unknown | `L-UOW-05/07` / `L-DIAG-05` | unresolved durability and resolution budget | success/failure/NotDurable fabrication |

### 32.6 Duplicate、Query no-write、Unknown、rollback与observer failure重复 owner 审计

| branch | 唯一主记录 owner | 允许关联 | 重复 owner 关闭结论 |
|---|---|---|---|
| completed duplicate replay | application idempotency owner `L-APP-03`；必要的write-channel authority exact read由 `L-UOW-02`承接 | API/Worker/Jobs只记录caller-visible replay boundary | 不由entry、log或current scan再次声明业务 effect；`L-UOW-02`不是第二个replay owner |
| idempotency in-progress / conflict | application reserve owner `L-APP-03`、`L-DIAG-06` | entry只关联 rejection/observation phase | 不创建attempt、retry或第二reservation lifecycle |
| Query no-write | application read owner `L-APP-08`、API `L-API-04` | resolver Port `L-PORT-01/02` | 绝不由`L-UOW-*`、capture、audit或Job切口记录写入成功 |
| `CommitOutcomeUnknown` | local authority `L-UOW-05/07`；`L-DIAG-05`只映射该既有结果 | application只关联 unresolved typed error | 不由API、Port、Job runner猜Durable/NotDurable |
| `TransactionRollbackFailed` | local authority `L-UOW-06`；`L-DIAG-05`只保留原始phase的安全关联 | application保留原始phase的safe ref | 不由Job/entry重标为普通Failed或zero-effect |
| `ConsistencyDefect` | typed relation owner `L-PORT-05`，未形成Port typed return时由`L-DIAG-04`映射 | application/entry只关联既有 issue ref | 不复制为Missing/Unavailable/Degraded/Retryable |
| observer/backend failure | 当前业务调用者 `L-DIAG-03`所在phase | 仅记录不递归的backend category | 不回滚truth、不改变disposition、不创建observer retry lifecycle |

本表的目的不是规定日志条数，而是证明每个特殊分支只有一个解释事实的主记录层。重复日志是否保留由 `R15.6` 根据最终字段和故障排查价值裁决。

## 33. R15.5 SOP 五问本批答案与写入边界

### 33.1 五问回答

| SOP 问题 | R15.5 本批答案 | 后续批次 |
|---|---|---|
| 哪些处理流必须记录审计？ | 本批不创建审计事件；只确定所有 83 条 flow 的 runtime log候选位置。只有正式 accepted truth、change/trace/impact、capture、report、handoff或operations fact成立时，才允许后续批次从其权威owner进入audit表；Query、duplicate、未证明durable的分支不因日志切口变成audit。 | `R15.11/R15.12` |
| 哪些错误分支必须记录日志？ | 所有 17 个 ApplicationError、51 个 issue code、Step 14 startup/binding分支以及 Worker/Jobs lifecycle failure都有主记录候选；`CommitOutcomeUnknown`、rollback failure、ConsistencyDefect、raw-source分类和observer failure保持独立语义。 | `R15.6` 统一错误分支与级别 |
| 哪些关键路径需要指标？ | 本批只确认 API/Query、UoW/commit、Port、Worker、Jobs、startup builder和handoff均有可计量切口；不决定指标名、类型、低基数标签或阈值。 | `R15.7/R15.8` |
| 日志、指标、审计字段分别记录什么？ | 日志候选承载 phase、owner、typed outcome、safe category和correlation/ref；指标后续只承载低基数计数/时长/状态族；审计后续只承载已成立的truth/change/impact/capture/report/handoff refs。三者都不得承载body、secret、credential、raw source或验收证据。 | `R15.6~R15.14` |
| 哪些监控和告警细节留给运维手册？ | level、event/key naming、sampling、retention、exporter、dashboard、SLO、threshold、alert routing、pager、runbook、on-call和backend failure policy均不在本批决定。 | `04`、部署/运维文档和后续R15批次 |

### 33.2 本批未决事项

1. `R15.6`需要把 60 个候选切口裁决成最终日志表，并决定同一phase是否合并记录；本批不提前假定一对一映射。
2. `R15.7~R15.10`需要分别裁决指标、trace/span和correlation字段；这些字段不能反向扩大 R15.5 的日志owner。
3. `R15.11~R15.14`需要裁决 accepted audit、operations fact、handoff和redaction的最终字段；本批只保留authority与禁止面。
4. observer/backend failure是否产生独立日志必须在 `R15.6` 结合递归风险和sink能力裁决；本批只登记候选 boundary。

## 34. R15.5 自检与 stop-review snapshot

### 34.1 本批自检

| Gate | Result | 说明 |
|---|---|---|
| structured log candidate cuts | pass | `L-API-01..06`、`L-APP-01..10`、`L-UOW-01..08`、`L-PORT-01..06`、`L-WKR-01..06`、`L-OUT-01..03`、`L-JOB-01..08`、`L-INF-01..07`、`L-DIAG-01..06` 共 60 个唯一候选ID |
| Step 9 exact flow reverse coverage | pass | Command 26/26、Query 33/33、Inbound 6/6、Outbound 10/10、Job 8/8；总计 83/83，missing/extra/duplicate=0 |
| Command / Query / Inbound / Outbound / Job profiles | pass | §32.2均有明确主记录、禁止替代和phase boundary |
| ApplicationError owner coverage | pass | 17/17；每个variant有唯一主记录owner，`Unknown`和rollback failure未合并 |
| CapabilityIssueCode owner coverage | pass | 51/51；11个semantic owner family合计51，无新增或复用literal |
| Step 14 startup / invocation coverage | pass | validation、Stage 0~7、Configured/Fake/Disabled/Missing、typed invocation failure、carrier contradiction、commit unknown均有owner |
| duplicate / Query no-write / observer failure audit | pass | §32.6；无log-derived replay、write、retry或truth |
| local capture / external collaboration separation | pass | source UoW、capture bind、Port typed outcome三者仍由不同owner负责 |
| body-free / redaction boundary | pass | raw body、secret、credential、route、transport private metadata、stack trace、evidence alias均在候选表禁止面 |
| final log level / key / schema | not entered | 留给 `R15.6`，本批未决定 |
| metric / trace / audit final tables | not entered | 留给 `R15.7~R15.14`，本批未决定 |
| Rust declaration delta | 0 | 未新增或修改struct、field、enum、variant、payload、trait、callable；结构体注释无新增遗漏 |
| formal document mutation | none | 正式 `03-详细设计.md` 未修改；`04`、Step 16~19未创建或修改 |
| implementation artifact / evidence | none | 未创建implementation ledger、planned boundary skeleton；未声称实现、测试、run_id、evidence alias或验收签署 |
| unresolved upstream blocker | 0 | 两项L0-core design-sync debt仍为non-blocking，不阻塞下一批 |

### 34.2 Stop-review snapshot

```text
document = 03-详细设计.md
step = 15 定义可观测性与审计埋点契约
batch = R15.5 structured log cuts:先思考
batch_status = completed_stop_review
step_15_status = in_progress
structured_log_candidate_ids = 60/60
candidate_id_duplicates = 0
command_flow_coverage = 26/26
query_flow_coverage = 33/33
inbound_flow_coverage = 6/6
outbound_flow_coverage = 10/10
operations_job_flow_coverage = 8/8
protocol_flow_exact_set = 83/83
application_error_owner_coverage = 17/17
issue_code_owner_coverage = 51/51
step_14_startup_invocation_coverage = pass
query_write_authorized = 0
commit_unknown_reclassified = 0
rollback_failed_reclassified = 0
observer_failure_business_reclassification = 0
new_rust_declarations = 0
formal_03_modified = false
formal_04_created = false
step_16_started = false
implementation_ledger_created = false
planned_boundary_skeleton_created = false
unresolved_upstream_blocker = none
non_blocking_cross_repo_design_debts = CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001,CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_6
```

### 34.3 R15.5 完成门禁

R15.5 已完成并停审。用户下一次明确确认后，只允许进入 `R15.6 structured log cuts:再写入`，进入时必须先读取本文件 §§30~34、Step 15 SOP / §5.14、Step 9 83-flow exact inventory、Step 12 17/51 error mapping和Step 14 startup/binding handoff。R15.6 才能决定日志级别、最终 event/key、字段 schema、错误分支日志表和重复记录是否合并。

本批不进入 `R15.7`，不修改正式 `03-详细设计.md`，不创建 `04-配置设计.md`、Step 16~19、implementation ledger或planned boundary skeleton，也不提交 commit。

## 35. R15.6 structured log cuts:最终裁决与字段闭口

### 35.1 本批授权与裁决原则

用户已确认从 `R15.5 completed_stop_review` 进入 `R15.6 structured log cuts:再写入`。本批只把 R15.5 的候选切口收敛为 backend-neutral 的最终日志契约；不新增 Rust type、field、variant、trait、Port、Cargo dependency、persisted state 或业务事件。

最终日志契约采用以下固定规则：

1. `event_key` 是稳定 ASCII 标识，按 `capability.<owner>.<boundary>` 命名。实现不得从 route、错误文本、provider 名称、topic、自由文本或 `Debug` 输出动态拼接 event key。
2. 每条独立日志都必须携带 `event_key`、`phase`、`owner`；能够取得既有调用上下文时还必须携带 `operation_name` 和 `trace_context_ref`。缺失的关联值保持 absent，不得生成 fallback id。
3. `mode=primary` 表示该 owner 对该事实形成唯一独立记录；`mode=failure-only` 表示只有明确失败、未知或清理异常才独立记录；`mode=folded` 表示字段并入最近的 primary 记录，不另写同义日志；`mode=sink-guarded` 仅在 observer backend 不会递归时记录 sink failure。
4. 日志级别只表达运行观察严重度，不表达业务 truth、durability、approval 或外部成功。`debug` 用于高频边界和技术成功，`info` 用于正常终态、replay、summary 以及合法 typed outcome，`warn` 用于输入/业务拒绝、临时依赖问题和需要关注的 handoff boundary，`error` 用于技术失败、commit unknown、rollback failure、startup failure 和 consistency defect。
5. 同一分支只允许一个 primary owner。上层可以写 `folded` caller-visible outcome，但不得复制底层 `error_kind`、raw source 或 result body。`L-DIAG-01` 只映射既有 error/issue，不取代形成该错误的 owner。
6. Query 的成功、NotVisible、Degraded、technical error 都使用 read-side primary；Query 不进入 begin、reserve、capture、audit-write、repair 或 post-commit 日志切口。`L-UOW-08` 仅在 read adapter 已形成技术失败时作为 failure-only 关联。
7. `CommitOutcomeUnknown`、rollback failure、`ConsistencyDefect`、typed external `Failed/HandoffUnavailable` 和 observer failure 保留独立语义。任何日志都不得把它们改写成普通成功、普通失败、zero-effect、retry authorization 或 accepted audit。
8. 本批不引入 `tracing`、`log`、OpenTelemetry、外部 exporter 或新的 `ObservabilityPort`。日志记录面是实现层可替换的 sink-neutral contract；Step 14 的第三方依赖和跨仓 Cargo 边界保持不变。

### 35.2 通用字段来源与表示规则

下表定义日志字段的唯一来源。字段名是 structured-log schema 的键，不是新的 Rust public field；实现必须从表中指定的既有 carrier 读取，不得为日志添加第二套 metadata 或 ref 类型。

| 字段 | 唯一来源 | 表示规则 | 允许用途 | 禁止内容 |
|---|---|---|---|---|
| `event_key` | 本节最终日志表 | 固定 ASCII literal | 选择日志事件 | 动态拼接 route、provider、topic 或错误文本 |
| `phase` | Step 9/11/14 已有调用阶段 | 使用本文件 §30.5 的 phase vocabulary | 定位处理边界 | 新增 persisted state 或 protocol state |
| `owner` | 本表指定的模块 owner | 固定有限集合 | 识别主记录层 | 运行时从调用栈或类型名推导 |
| `operation_name` | `CapabilityOperationContext.operation_name` 的 closed mapper | 使用已验证的 route-neutral name | 关联 exact Command / Query / Inbound / Job | 自由字符串、handler 名、route alias |
| `flow_id` | Step 9 exact flow inventory | 使用 `C01..C26`、`Q01..Q33`、`I01..I06`、`O01..O10`、`J01..J08` | 反向覆盖和定位 | 从 event key 猜 flow 或新增 generic flow |
| `trace_context_ref` | core `TraceId`，来自 metadata / envelope / Job metadata | stable body-free correlation ref；不存在则 absent | 跨层关联 | 新生成 trace、把 trace 当业务主键 |
| `request_ref` | core `RequestMetadata.request_id` | body-free request ref | API / command / query 关联 | 把 request ref 当 result 或 idempotency key |
| `actor_ref` | `ActorContext.actor_ref()` | body-free actor ref | 归因和排查 | role 判权、token、credential、display text |
| `source_event_ref` | Inbound envelope 的 `CapabilitySourceEventRef` | 原样 body-free ref | 关联上游事件 receipt | payload、offset、lease、ack、transport token |
| `inbound_event_ref` | worker 对 validated source ref 的既有 one-way local mapping | body-free local ref | 关联本地 feedback surface | 从 topic、payload 或日志重建 |
| `job_run_ref` | `CapabilityJobMetadata.run_id` / `CapabilityOperationContext.job_run_id` | existing `JobRunId` ref | 关联 journal/report/process observation | 伪造真实 run、当作 evidence alias |
| `subject_ref` | 当前 flow 的 exact typed subject/ref | body-free typed ref | 定位 capability truth 或 derived target | object body、method body、document、secret |
| `result_ref` | `CapabilityApplicationResultRef` 或既有 protocol result ref | 仅记录已形成的 ref | duplicate replay / stored surface 关联 | 从日志创建 result、复制 response body |
| `receipt_ref` | 既有 stored consumer receipt/result surface ref | 仅记录已形成的 ref | Inbound replay / receipt 关联 | 从 Worker lifecycle 伪造 receipt |
| `report_ref` | 既有 Job / reconciliation report ref | 仅记录已保存的 report ref | Job summary / maintenance 关联 | 从 count 或日志重建 report |
| `capture_ref` | `CapabilityEventCaptureRef` | exact local capture revision ref | Outbound continuation / repair 关联 | payload bytes、external delivery state |
| `snapshot_ref` | `CapabilityEventPayloadSnapshotId/Ref` 或既有 reference snapshot ref | exact stored snapshot ref | 证明读取官方快照 | current truth 重建、snapshot body |
| `intent_ref` | existing external collaboration intent ref | opaque body-free ref | 关联 Port-owned collaboration | local delivery truth、attempt、lease、ack |
| `transaction_ref` | existing `CapabilityTransactionRef` | 当前基线为 **absent / reserved-not-emitted**；只有受控回开后才允许使用显式 redacted accessor | commit / rollback resolution 关联 | inner value、repository key、business id、`Debug`、自行 hash |
| `issue_ref` | `CapabilityProtocolValidationIssueRef` | deterministic fixed-code ref | safe diagnostic / receipt/report issue | raw cause、raw body hash、随机 ref |
| `error_kind` | existing `ApplicationError` 或 entry wrapper typed variant | closed variant/category name | 区分技术/业务分支 | `Display`、`Debug`、private adapter code |
| `issue_code` | existing `CapabilityIssueCode::literal()` | fixed `capability-hub.issue/*.v1` literal | safe public issue classification | 从日志反推 retry、owner 或 state |
| `disposition` | existing protocol disposition / typed outcome | exact existing variant | caller-visible result观察 | 新增 `Observed` / `Logged` outcome |
| `resolution` | existing `CapabilityCommitResolution` | `Durable` / `NotDurable` / `Unknown` | durability observation | 从 row absence、elapsed time 或 log 推断 |
| `rollback_outcome` | existing rollback return / recovery branch | `succeeded` / `failed` / `not_attempted` only when known | 说明恢复顺序 | 宣称 zero effect 或 normal failed |
| `binding_state` | Step 14 binding matrix | `Configured` / `DeterministicFake` / `Disabled` / `Missing` | startup/invocation boundary | Missing 静默转 Fake/Disabled |
| `stage` | Step 14 runtime builder Stage 0~7 | fixed stage label | startup assembly定位 | partial graph、fallback entry |
| `entry_kind` | selected API / Worker / Jobs entry | closed entry family | exposure barrier关联 | host scheduler、listener body |
| `source_family` | closed `CapabilityInboundSourceFamily` | exact source family | Worker / receipt区分 | topic、consumer group、payload locator |
| `port_family` | existing `ApplicationPortKind` | exact Port family | typed external / repository boundary | provider identity或健康结论 |
| `adapter_kind` | Step 14 named adapter family | finite adapter category | binding / typed return观察 | endpoint、credential、private status |
| `schema_version` | existing protocol schema wrapper | validated version value | header/schema gate | raw envelope bytes |
| `freshness_state` | persisted derived/read surface state | exact existing state/category | Query degraded / material maintenance | timestamp age自行分类 |
| `outcome` | 当前 callable / gate 的 exact return branch | 使用既有 typed variant；纯技术 gate 仅用固定 `passed` / `rejected` / `failed` / `timed_out` | 表达该切口观察到的终态类别 | 新业务状态、durability推断、自由文本 |
| `purpose` | 当前 exact read / recovery callable 的静态调用点 | 固定 `reserve` / `winner_read` / `owner_read` / `commit_resolution` / `sidecar_check` 等 closed editorial value | 区分同一 authority 的读取目的 | caller input、动态 SQL、scope scan描述 |
| `effect_kind` | Step 9 当前 flow 的 side-effect inventory | 使用既有 carrier family，例如 truth、change、trace、impact、material、reference、capture、stored surface、receipt、journal、report | 定位 effect write family | object body、字段列表、从日志补造 effect |
| `source_slot` | Step 14 六个 named Worker source slot | exact closed slot name | Worker activation / lifecycle 定位 | topic、consumer group、transport route |
| `lifecycle_state` | Step 14 API / Worker / Jobs runtime 已有阶段 | 只使用 parked、active、stopping、draining、joined、ready、in_flight、consumed 等已定义阶段 | 运行承载观察 | 新 persisted lifecycle、attempt / lease state |
| `cleanup_outcome` | Step 14 ordered cleanup / join result | `completed` / `failed` only when exact result known | 保留 original failure precedence | raw cleanup cause、覆盖 original failure |
| `codec_surface_kind` | producing phase, closed editorial values | `request_digest` / `stored_surface` / `event_snapshot` / `persistence_decode` | `CodecFailure`阶段定位 | digest bytes、serialized body、algorithm选择 |
| `redaction_mode` | Step 14 `CapabilityDiagnosticMode` | `Off` / `Redacted` | safe output boundary | `Full` / `Verbose`豁免 |
| `duration_ms` | owning application/entry/worker/job boundary clock | non-negative observation duration | 排查延迟 | domain object读取 clock |
| `count` / `target_ordinal` | persisted journal/report or current loop boundary | only authoritative count/ordinal | summary / target定位 | 从日志反推 report、attempt counter |
| `event_key_of_failed_record` | the fixed `event_key` literal of the record whose sink write failed | copy the exact static literal; never derive or format it | non-recursive sink-failure correlation | free text、route、provider、stack trace、dynamic key |

未列入字段词典的字段默认禁止。当前 `transaction_ref` 虽然在 Step 11/14 作为 recovery carrier 存在，但没有安全序列化 accessor，因此不得进入任何 R15.6 日志；实现不得调用 `Debug`、`Display`、inner-value accessor 或自行 hash。特别是 `idempotency_key`、`idempotency_key_hash`、`request_digest`、`payload_digest`、`raw_source`、`raw_response`、`raw_config`、`endpoint`、`topic`、`offset`、`lease`、`ack`、`attempt`、`stack_trace`、`secret`、`credential`、`method_body`、`document_body`、`evidence_alias` 和 `acceptance_signature` 均不得进入 structured log。

当前基线不发射 `transaction_ref`。若后续确需把 commit resolution 与日志关联，必须在 R15.10/R15.16 重新定义一个不暴露 inner value 的命名 accessor，并受控回开 Step 14 dependency/instrumentation matrix；在该回开完成前，调用方只能依赖既有 `trace_context_ref`、`request_ref`、`job_run_ref` 或已形成的 result/report/capture ref。

### 35.3 级别与重复记录规则

| 分支 | 主记录级别 | 允许的上层记录 | 禁止 |
|---|---|---|---|
| protocol / metadata / body validation rejected | `warn` | entry 可记录未 dispatch 的 `folded` boundary | 复制成 domain / Port failure |
| normal accepted / no-op / typed visible result | `info` | API 可记录 response boundary | 把 info 当 accepted truth 或 durable proof |
| duplicate replay | `info` | entry 可记录 replay returned | 重跑 mutation、重复 effect 或新增 audit |
| idempotency conflict / in-progress | `warn` | caller-visible rejection可折叠 | 记录 raw key、attempt、retry授权 |
| dependency temporary / timeout / typed unavailable | `warn` | application 可折叠 typed disposition | 从日志授权重试或改写外部 truth |
| repository / codec / transaction technical failure | `error` | application 只关联既有 error | raw backend detail、伪造 zero-effect |
| commit `Unknown` / rollback failed | `error` | 只记录安全 unresolved phase | success、failure、NotDurable、blind retry |
| consistency defect / invalid typed response | `error` | mapper 可折叠 issue ref | 降级为 missing / unavailable / retryable |
| startup assembly / cleanup failure | `error` | selected entry 只关联 exposure blocked | 启动 partial graph 或发送业务协议错误 |
| observer backend failure | `error` only when non-recursive | 无 | 改变原 disposition、回滚 truth、建立 observer retry |

### 35.4 Backend-neutral instrumentation binding gate

R15.6 只定义字段和切口，不选择具体日志 crate，也不声称存在 Rust facade。实现阶段必须消费一个 backend-neutral 的 structured-record emission boundary；该 boundary 的参数、失败返回和 non-recursive fallback 规则由 R15.10/R15.16 继续闭合。若最终选择 `tracing`、`log`、OpenTelemetry 或其他实现库，必须先受控回开 Step 14 的 Cargo/dependency matrix，记录版本、feature、owner、类型泄漏和 sink failure 语义；实现者不得自行添加依赖或把第三方 `Span`/`Event` 类型扩散到 application、contracts、protocol、repository、Port 或 persisted surface。

在 instrumentation facade 闭合前，R15.6 的 `event_key`、字段 allowlist、mode、level 和 owner 仍是设计真相源；“没有具体 facade”不是授权跳过埋点，也不是当前 upstream blocker。

## 36. R15.6 最终日志埋点表（API / application / local authority）

表格列固定为：`cut id`、`event key`、`mode`、`level`、`insertion point / owner`、`trigger / phase`、`required fields`、`optional fields`、`authority / purpose`、`forbidden fields`。每个 R15.5 候选 ID 必须出现且只出现一次。

### 36.1 API / entry cuts

| cut id | event key | mode | level | insertion point / owner | trigger / phase | required fields | optional fields | authority / purpose | forbidden fields |
|---|---|---|---|---|---|---|---|---|---|
| L-API-01 | `capability.api.protocol_gate` | primary | `info` pass / `warn` reject | route, operation and body-symmetry gate / API entry | gate终态 / `entry_admission` | `phase`; `owner`; `outcome`; `error_kind` on reject | `operation_name`; `request_ref`; `trace_context_ref`; `flow_id`; `schema_version`; `issue_ref` | Step 8 exact protocol rejection；证明是否 dispatch | request body; raw route; transport status text; secret |
| L-API-02 | `capability.api.metadata_gate` | primary | `info` pass / `warn` reject | metadata, trace and idempotency header mapper / API entry | metadata gate终态 / `entry_admission` | `phase`; `owner`; `operation_name`; `outcome`; `error_kind` on reject | `request_ref`; `trace_context_ref`; `flow_id`; `issue_ref`; `redaction_mode` | 观察 metadata completeness，不保存 header map | raw headers; token; credential; full idempotency key; digest bytes |
| L-API-03 | `capability.api.dispatch` | primary | `debug` dispatched / `warn` pre-dispatch reject / `error` mapping failure | exact application callable boundary / API entry | callable invoked or returns typed surface / `entry_admission` | `phase`; `owner`; `operation_name`; `outcome` | `request_ref`; `trace_context_ref`; `flow_id`; `disposition`; `error_kind`; `result_ref` | 只记录 dispatch boundary和caller-visible category | response body; domain object; cancellation claim; raw error |
| L-API-04 | `capability.api.query_surface` | primary | `info` normal or NotVisible / `warn` Degraded / `error` technical | Query response surface形成 / API entry | Query returns Visible, NotVisible, Degraded or error / `entry_admission` end | `phase`; `owner`; `operation_name`; `disposition`; `duration_ms` | `request_ref`; `trace_context_ref`; `flow_id`; `subject_ref`; `freshness_state`; `issue_ref` | 证明 Query read boundary和no-write结果；NotVisible是合法 read surface | query body; subject enumeration; audit-write claim; external read body |
| L-API-05 | `capability.api.observation_end` | primary | `info` return / `warn` observation timeout | transport observation wrapper / API entry | response returned or observation budget ends / `entry_admission` end | `phase`; `owner`; `operation_name`; `outcome`; `duration_ms` | `request_ref`; `trace_context_ref`; `flow_id`; `disposition`; `error_kind` | 区分 transport observation end 与 application ownership继续 | application cancellation claim; detach claim; retry authorization; raw response |
| L-API-06 | `capability.api.exposure_barrier` | primary | `info` opened / `error` blocked | API composition root exposure barrier | complete graph and non-cancelling proof pass/fail / `startup_assembly` | `phase`; `owner`; `entry_kind`; `outcome`; `binding_state` | `stage`; `error_kind`; `issue_ref`; `redaction_mode` | 记录 API entry availability boundary | partial graph; fallback entry; listener body; raw config |

### 36.2 Application cuts

| cut id | event key | mode | level | insertion point / owner | trigger / phase | required fields | optional fields | authority / purpose | forbidden fields |
|---|---|---|---|---|---|---|---|---|---|
| L-APP-01 | `capability.application.canonical_input` | primary-on-failure plus `folded` success | `debug` success / `error` `CodecFailure` | shared guard and write-channel canonical encoder / application | canonical operation mapping or digest boundary returns / `application_pre_uow` | `phase`; `owner`; `operation_name`; `codec_surface_kind` on failure; `outcome` | `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `error_kind`; `issue_ref` | 观察 canonical encoder/digest boundary；`CodecFailure`按产生 surface择一 | request body; idempotency key or hash; digest bytes; free operation name |
| L-APP-02 | `capability.application.validation` | primary | `debug` pass / `warn` reject | body-local validation and forbidden-body gate / application | validation or redaction gate终态 / `application_pre_uow` | `phase`; `owner`; `operation_name`; `outcome`; `disposition` on typed reject | `trace_context_ref`; `request_ref`; `actor_ref`; `flow_id`; `subject_ref`; `issue_code`; `issue_ref`; `error_kind`; `redaction_mode` | application validation主记录；只输出 typed category | raw body; policy expression; method/document body; raw message |
| L-APP-03 | `capability.application.idempotency` | primary | `debug` reserved / `info` replay / `warn` conflict or in-progress | reservation and exact replay boundary / application | reserve result, completed duplicate, in-progress or winner read / pre-UoW | `phase`; `owner`; `operation_name`; `disposition` or `error_kind`; `outcome` | `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `result_ref`; `issue_ref` | 证明 reserve/replay/no-rerun；唯一 idempotency主记录 | raw key; key hash; request bytes; winner body; attempt/retry field |
| L-APP-04 | `capability.application.prerequisite` | primary | `debug` present / `warn` typed missing or unavailable / `error` consistency | exact owner load or resolver prerequisite / application | prerequisite returns typed value, missing, unavailable, degraded or contradiction / pre-UoW or UoW | `phase`; `owner`; `operation_name`; `outcome` | `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `subject_ref`; `port_family`; `adapter_kind`; `error_kind`; `issue_ref` | 记录 prerequisite authority与 typed boundary | resolver response body; external document; secret; current-truth reconstruction |
| L-APP-05 | `capability.application.domain_disposition` | primary | `debug` no-op or changed / `warn` stable reject / `error` technical invariant | domain factory/member/policy return / application | domain transition, no-op or stable rejection / `uow_active` | `phase`; `owner`; `operation_name`; `outcome`; `disposition` | `trace_context_ref`; `request_ref`; `actor_ref`; `flow_id`; `subject_ref`; `error_kind`; `issue_code`; `issue_ref` | 记录既有 domain/application disposition，不代替 truth change | direct field values; method body; approval; runtime execution decision |
| L-APP-06 | `inherited from L-UOW-03` | folded | inherited from `L-UOW-03` | declared local effect-set assembly / application | all flow-declared carriers formed before commit / `uow_active` | `phase`; `owner`; `operation_name`; `outcome` | `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `subject_ref`; `result_ref`; `capture_ref`; `report_ref`; `error_kind` | 只把 effect-set字段并入 UoW effect-write primary，避免重复终态日志 | staged body; partial effect as durable; log-created result; raw payload |
| L-APP-07 | `capability.application.result_surface` | primary | `info` stable result or replay / `warn` rejection / `error` surface failure | accepted, rejected or duplicate typed surface formation / application | response, stored replay surface or rejection is formed / UoW or resolution phase | `phase`; `owner`; `operation_name`; `outcome`; `disposition` | `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `result_ref`; `issue_ref`; `error_kind`; `resolution` | 记录 caller-visible surface形成，不宣称 durable | response body; stored surface bytes; accepted audit before commit; synthetic result |
| L-APP-08 | `capability.application.query_surface` | primary | `info` visible or normal missing or NotVisible / `warn` Degraded / `error` technical | resolver-first Query completion / application | Query read decision终态 / `application_pre_uow` | `phase`; `owner`; `operation_name`; `outcome`; `disposition`; `duration_ms` | `trace_context_ref`; `request_ref`; `flow_id`; `subject_ref`; `freshness_state`; `issue_code`; `issue_ref`; `error_kind` | Query唯一 application主记录；严格 no-write；NotVisible不生成 issue | begin; reserve; capture; audit write; repair; external resolver; response body |
| L-APP-09 | `capability.application.capture` | primary | `debug` capture formed / `error` capture or snapshot failure | outbound source snapshot and local capture formation / application | source, immutable snapshot and capture formed or failed / `uow_active` | `phase`; `owner`; `operation_name`; `outcome`; `flow_id` | `trace_context_ref`; `request_ref`; `subject_ref`; `capture_ref`; `snapshot_ref`; `schema_version`; `codec_surface_kind`; `error_kind`; `issue_ref` | 观察 local durable capture；不代表 external collaboration | event payload body; physical route; delivery status; outbox/relay/attempt lifecycle |
| L-APP-10 | `capability.application.post_commit` | primary | `debug` dispatched / `warn` typed non-success / `error` contract failure | post-commit collaboration/handoff facade / application | official capture loaded and Port call returns / `post_commit_collaboration` | `phase`; `owner`; `operation_name`; `outcome` | `trace_context_ref`; `job_run_ref`; `flow_id`; `capture_ref`; `snapshot_ref`; `intent_ref`; `disposition`; `issue_ref`; `error_kind` | 记录 continuation boundary；local commit已独立决定 | external response body; local delivery truth; rollback local commit; retry authorization |

### 36.3 Local authority / UoW / repository cuts

| cut id | event key | mode | level | insertion point / owner | trigger / phase | required fields | optional fields | authority / purpose | forbidden fields |
|---|---|---|---|---|---|---|---|---|---|
| L-UOW-01 | `capability.uow.begin` | primary | `debug` success / `error` failure | `CapabilityUnitOfWorkManager.begin` / local authority | UoW opened or begin fails / `uow_active` | `phase`; `owner`; `outcome` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `error_kind`; `issue_ref` | 区分未进入 effect set 的 begin failure | connection string; SQL; transaction internals; accepted result |
| L-UOW-02 | `inherited from L-APP-03 or L-UOW-07` | folded | inherited from the owning primary | reserve, winner read and same-authority exact read / persistence authority | write reservation or recovery read returns / `uow_active` or `commit_resolution` | `phase`; `owner`; `purpose`; `outcome` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `result_ref`; `issue_ref`; `error_kind` | 只把 exact-read purpose 作为所属 primary 的字段；不覆盖 Query read | full key; row/body; replica identity; scope scan; log-derived winner |
| L-UOW-03 | `capability.uow.effect_write` | primary-on-failure plus `folded` success | `debug` success / `error` failure | repository save/append/capture/stored-surface call / UoW owner | declared effect call returns / `uow_active` | `phase`; `owner`; `operation_name`; `effect_kind`; `outcome` | `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `subject_ref`; `capture_ref`; `result_ref`; `report_ref`; `error_kind`; `issue_ref` | 技术写入观察；Durability仍由 commit owner | staged object; uncommitted truth; secret; payload bytes; private SQL |
| L-UOW-04 | `inherited from L-UOW-03` | folded | inherited from the effect/commit primary | idempotency completion after stored result/receipt/report formation / local authority | Reserved -> Completed preparation / `uow_active` | `phase`; `owner`; `operation_name`; `outcome` | `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `result_ref`; `receipt_ref`; `report_ref`; `issue_ref`; `error_kind` | 只把 sidecar symmetry 作为所属 primary 的字段，不能创建 completion | raw key; response/report body; log-created completion; inferred durable |
| L-UOW-05 | `capability.uow.commit_resolution` | primary | `info` Durable / `error` NotDurable, Unknown or resolution failure | commit and `resolve_commit` / local authority | commit returns or authority resolves / `commit_resolution` | `phase`; `owner`; `resolution`; `outcome` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `result_ref`; `report_ref`; `issue_ref`; `error_kind`; `duration_ms` | 唯一 durability主记录；NotDurable和Unknown都保留技术失败语义 | success/failure guess; row absence; replica state; commit text; blind retry |
| L-UOW-06 | `capability.uow.rollback` | primary | `info` rollback succeeded / `error` rollback failed | rollback and rollback-failure recovery / local authority | pre-commit technical failure triggers rollback / `commit_resolution` | `phase`; `owner`; `rollback_outcome`; `outcome` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `error_kind`; `issue_ref` | 保留原始 failure phase与无法证明的边界 | zero-effect claim when unknown; normal Failed; raw backend error; retry authorization |
| L-UOW-07 | `capability.uow.recovery_read` | primary-on-failure | `debug` resolved / `error` unresolved or contradiction | barrier and exact recovery read / same authority | Unknown or sidecar asymmetry resolution attempt / `commit_resolution` | `phase`; `owner`; `purpose`; `outcome` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `resolution`; `result_ref`; `issue_ref`; `error_kind` | 记录 exact read/barrier结果，供 `CommitOutcomeUnknown` 关联 | log/metric reconstruction; blind mutation retry; scope scan; replica guess |
| L-UOW-08 | `capability.repository.typed_failure` | failure-only | `error` | named repository/adapter raw-to-typed mapping / repository owner | typed failure, `CodecFailure` decode or consistency failure formed / read or write phase | `phase`; `owner`; `port_family`; `outcome`; `error_kind` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `subject_ref`; `codec_surface_kind`; `issue_code`; `issue_ref` | 记录既有 typed mapping；Query只在 failure时关联 | raw error/text; SQL; HTTP/provider body; private status; Query write claim |

## 37. R15.6 最终日志埋点表（Port / Worker / Outbound / Jobs）

### 37.1 External Port / adapter cuts

| cut id | event key | mode | level | insertion point / owner | trigger / phase | required fields | optional fields | authority / purpose | forbidden fields |
|---|---|---|---|---|---|---|---|---|---|
| L-PORT-01 | `inherited from L-PORT-02, L-PORT-03 or L-PORT-04` | folded | inherited from the return/failure primary | named external Port callable entry / adapter | body-free typed invocation starts / pre-UoW or post-commit | `phase`; `owner`; `port_family`; `outcome` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `subject_ref`; `adapter_kind` | 只把调用开始作为所属 return/failure primary 的字段；不单独制造成功事件 | endpoint; credential; header; request body; transport route |
| L-PORT-02 | `capability.port.resolution_outcome` | primary | `debug` resolved / `warn` unresolved, unavailable or rejected / `error` invalid carrier | resolver Port typed return / named Port owner | `ReferenceResolutionObservation` or family-specific observation returns / `application_pre_uow` | `phase`; `owner`; `port_family`; `outcome`; `disposition` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `subject_ref`; `adapter_kind`; `issue_code`; `issue_ref`; `duration_ms` | typed outcome主记录；不解释外部健康 truth | provider response; raw status; external body; health conclusion |
| L-PORT-03 | `capability.port.collaboration_outcome` | primary | `info` Accepted/Candidate/PendingDelivery/Delivered or other valid typed outcome / `warn` typed rejection or retryable boundary / `error` invalid carrier | handoff or collaboration Port typed return / named Port owner | handoff/collaboration outcome returns / `post_commit_collaboration` | `phase`; `owner`; `port_family`; `outcome`; `disposition` | `operation_name`; `trace_context_ref`; `job_run_ref`; `flow_id`; `subject_ref`; `capture_ref`; `intent_ref`; `receipt_ref`; `issue_code`; `issue_ref`; `duration_ms` | external-owned typed outcome主记录；与local capture分离；PendingDelivery不表示失败 | external receipt body; attempt; lease; ack; local delivery state; evidence claim |
| L-PORT-04 | `capability.port.failure` | primary | `warn` temporary/timeout / `error` permanent, invalid or unexpected | adapter raw-source classifier / adapter owner | no legal typed return can be formed / `diagnostic_resolution` | `phase`; `owner`; `port_family`; `error_kind`; `outcome` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `adapter_kind`; `subject_ref`; `issue_code`; `issue_ref`; `duration_ms` | 唯一 raw-to-typed failure主记录；只输出 closed class | raw error; HTTP status/body; provider private code; retry from text |
| L-PORT-05 | `capability.port.contract_defect` | primary | `error` | typed response symmetry gate / adapter + application boundary | wrong owner/kind/source/version or malformed tuple / `diagnostic_resolution` | `phase`; `owner`; `port_family`; `error_kind`; `outcome` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `subject_ref`; `adapter_kind`; `issue_code`; `issue_ref` | typed relation defect主记录；保留 consistency语义 | response body; payload bytes; unavailable downgrade; synthetic success |
| L-PORT-06 | `capability.port.binding_state` | primary | `info` Configured/DeterministicFake/Disabled / `error` Missing or invalid | exact external slot binding / infra binding owner | startup binding decision or Disabled invocation / startup or pre-UoW | `phase`; `owner`; `port_family`; `binding_state`; `outcome` | `entry_kind`; `stage`; `operation_name`; `trace_context_ref`; `adapter_kind`; `issue_code`; `issue_ref`; `error_kind` | 区分显式 Disabled、required Missing 和 invocation NotConfigured | fallback adapter; success fake; raw config; business rejection substitution |

### 37.2 Worker / Inbound cuts

| cut id | event key | mode | level | insertion point / owner | trigger / phase | required fields | optional fields | authority / purpose | forbidden fields |
|---|---|---|---|---|---|---|---|---|---|
| L-WKR-01 | `capability.worker.source_binding` | primary | `info` Configured/DeterministicFake/Disabled / `error` Missing | named source activation decision / Worker root | each of six slots resolved / startup or lifecycle | `phase`; `owner`; `source_slot`; `binding_state`; `outcome` | `entry_kind`; `source_family`; `stage`; `issue_ref`; `error_kind` | Worker source binding主记录 | topic; group; partition; credential; wildcard route; raw config |
| L-WKR-02 | `capability.worker.activation_barrier` | primary | `info` opened / `error` blocked | parked task and activation barrier / Worker supervisor | all enabled tasks parked and Disabled slots closed or failure / `worker_lifecycle` | `phase`; `owner`; `lifecycle_state`; `outcome`; `count` | `entry_kind`; `source_slot`; `source_family`; `cleanup_outcome`; `issue_ref`; `error_kind` | 记录 barrier与cleanup ownership；不返回partial graph | task object; runtime handle; transport metadata; partial graph |
| L-WKR-03 | `capability.worker.inbound_gate` | primary | `info` accepted / `warn` rejected or unsupported / `error` decode technical failure | header-first admission / Worker driver | actor, schema, size and logical event gate terminal / `entry_admission` | `phase`; `owner`; `source_slot`; `source_family`; `outcome` | `operation_name`; `trace_context_ref`; `source_event_ref`; `schema_version`; `flow_id`; `actor_ref`; `issue_code`; `issue_ref`; `error_kind` | admission唯一主记录；失败时不调用 application | encoded envelope; payload bytes; offset; lease; delivery token; credential |
| L-WKR-04 | `capability.worker.consumer_surface` | primary | `info` Accepted/Duplicate/Ignored / `warn` Delayed/Rejected/Unsupported/Quarantined / `error` technical | application consumer facade return / application owner | typed `ConsumerReceipt` disposition formed or technical error / pre-UoW or UoW | `phase`; `owner`; `operation_name`; `disposition`; `outcome` | `trace_context_ref`; `source_event_ref`; `inbound_event_ref`; `source_family`; `flow_id`; `result_ref`; `receipt_ref`; `issue_code`; `issue_ref`; `error_kind`; `duration_ms` | receipt/disposition唯一主记录；Worker不能补 effect refs | receipt body; event payload; completion token; core truth claim |
| L-WKR-05 | `capability.worker.continuation` | primary | `info` completed / `warn` repair required / `error` failed | exact capture-ref continuation / Worker continuation owner | continuation completes, fails or yields repair handoff / `worker_lifecycle` | `phase`; `owner`; `outcome`; `lifecycle_state` | `operation_name`; `trace_context_ref`; `capture_ref`; `snapshot_ref`; `intent_ref`; `flow_id`; `issue_ref`; `error_kind`; `duration_ms` | 记录 exact-ref continuation，不拥有 collaboration truth | retry count; queue; DLQ; lease; ack; new capture/event |
| L-WKR-06 | `capability.worker.shutdown` | primary | `info` completed / `error` task or cleanup failure | stop, drain, join and cleanup / Worker supervisor | shutdown or partial-start rollback terminal / `worker_lifecycle` | `phase`; `owner`; `lifecycle_state`; `outcome`; `cleanup_outcome` | `entry_kind`; `source_slot`; `count`; `issue_ref`; `error_kind`; `duration_ms` | 保留 original failure precedence和six-task join结果 | panic stack; task body; transport metadata; receipt/report fabrication |

### 37.3 Outbound continuation cuts

| cut id | event key | mode | level | insertion point / owner | trigger / phase | required fields | optional fields | authority / purpose | forbidden fields |
|---|---|---|---|---|---|---|---|---|---|
| L-OUT-01 | `capability.outbound.capture_loaded` | primary | `debug` loaded / `error` missing or asymmetric | official capture + snapshot load / collaboration facade | exact stored capture is loaded for continuation / `post_commit_collaboration` | `phase`; `owner`; `capture_ref`; `outcome` | `operation_name`; `trace_context_ref`; `job_run_ref`; `flow_id`; `snapshot_ref`; `subject_ref`; `issue_ref`; `error_kind` | Outbound continuation 的 capture-load 主记录；证明从官方 snapshot 开始 | current truth rebuild; payload body; route destination; fabricated capture |
| L-OUT-02 | `inherited from L-PORT-03` | folded | inherited from `L-PORT-03` | collaboration typed return / collaboration Port owner | same exact Port return / `post_commit_collaboration` | `phase`; `owner`; `capture_ref`; `outcome`; `disposition` | `operation_name`; `trace_context_ref`; `job_run_ref`; `flow_id`; `intent_ref`; `issue_code`; `issue_ref`; `duration_ms` | 不产生第二条日志；作为 Outbound flow字段profile | local delivery state; external receipt body; attempt lifecycle |
| L-OUT-03 | `capability.outbound.intent_bound` | primary | `info` bound / `error` bind failed | short local capture-binding UoW / application continuation | same capture binds stable intent or remains Captured / `post_commit_collaboration` | `phase`; `owner`; `capture_ref`; `outcome` | `operation_name`; `trace_context_ref`; `job_run_ref`; `flow_id`; `snapshot_ref`; `intent_ref`; `resolution`; `issue_ref`; `error_kind` | local `Captured -> IntentBound`主记录；external status不在此处决定；当前不发射 transaction_ref | second capture; new event; delivery success claim; rollback source truth |

### 37.4 Jobs / Operations cuts

| cut id | event key | mode | level | insertion point / owner | trigger / phase | required fields | optional fields | authority / purpose | forbidden fields |
|---|---|---|---|---|---|---|---|---|---|
| L-JOB-01 | `capability.jobs.admission` | primary | `info` accepted / `warn` rejected / `error` input mapping failure | job request header/kind/schema/body gate / Jobs entry | exact Job admission terminal / `entry_admission` | `phase`; `owner`; `outcome` | `operation_name`; `job_run_ref`; `trace_context_ref`; `schema_version`; `flow_id`; `actor_ref`; `issue_code`; `issue_ref`; `error_kind` | Jobs protocol admission唯一主记录；malformed admission不得强制生成 operation/run ref | job input body; raw bytes; scheduler metadata; raw idempotency key |
| L-JOB-02 | `capability.jobs.dispatch` | primary | `debug` dispatched / `warn` pre-dispatch rejection / `error` dispatch failure | exact Jobs handler/facade boundary / Jobs entry | application Job callable invoked or returns / admission -> pre-UoW | `phase`; `owner`; `operation_name`; `job_run_ref`; `outcome` | `trace_context_ref`; `flow_id`; `disposition`; `result_ref`; `report_ref`; `issue_ref`; `error_kind` | 记录 dispatch boundary，不拥有 journal/report truth | host-generated business id; request/result body; second invocation |
| L-JOB-03 | `capability.jobs.plan` | primary | `info` fresh/replay/reentry / `warn` in-progress or stable reject / `error` unsafe planning failure | deterministic plan, reserve and initial journal / application Job owner | plan/journal branch is known / pre-UoW or UoW | `phase`; `owner`; `operation_name`; `job_run_ref`; `outcome`; `disposition` | `trace_context_ref`; `flow_id`; `result_ref`; `report_ref`; `count`; `issue_code`; `issue_ref`; `error_kind` | journal/reentry主记录；只从 frozen target plan决定 | current truth rescan; attempt; retry permission; journal body |
| L-JOB-04 | `capability.jobs.target` | primary | `info` succeeded/no-op/skipped / `warn` typed failed/retryable / `error` nonterminal technical | per-target UoW and journal terminalization / application Job owner | one target outcome is durably proven or remains Planned / UoW or resolution | `phase`; `owner`; `operation_name`; `job_run_ref`; `target_ordinal`; `outcome` | `trace_context_ref`; `flow_id`; `subject_ref`; `disposition`; `resolution`; `issue_code`; `issue_ref`; `error_kind` | target outcome唯一来源为journal + UoW proof | target body; counter-derived report; rollback prior targets; attempt |
| L-JOB-05 | `capability.jobs.report` | primary | `info` completed/partial/replayed / `warn` failed/retryable/rejected / `error` finalization technical | final report, stored result and completion UoW / application Job owner | final journal/report terminal or technical failure / UoW or resolution | `phase`; `owner`; `operation_name`; `job_run_ref`; `outcome`; `disposition` | `trace_context_ref`; `flow_id`; `result_ref`; `report_ref`; `count`; `resolution`; `issue_ref`; `error_kind`; `duration_ms` | Job final summary主记录；report ref必须已保存 | report body; log/counter reconstruction; accepted before durable commit |
| L-JOB-06 | `capability.jobs.collaboration_target` | primary | `info` successful typed outcome / `warn` non-success typed outcome / `error` technical | repair/handoff/collaboration target / application Job owner | official capture/snapshot loaded and exact Port returns / `post_commit_collaboration` | `phase`; `owner`; `operation_name`; `job_run_ref`; `target_ordinal`; `outcome` | `trace_context_ref`; `flow_id`; `capture_ref`; `snapshot_ref`; `intent_ref`; `disposition`; `issue_code`; `issue_ref`; `error_kind` | 记录 Job target与Port outcome关联；Port仍拥有外部状态 | new event/capture; external body; local delivery lifecycle; host retry |
| L-JOB-07 | `capability.jobs.process_observation` | primary | `info` terminal/drained / `warn` observation timeout / `error` join or take failure | non-cancelling process deadline, join, take and drain / Jobs runtime | observation ends and process ownership terminalizes / `job_lifecycle` | `phase`; `owner`; `operation_name`; `job_run_ref`; `lifecycle_state`; `outcome` | `trace_context_ref`; `flow_id`; `disposition`; `cleanup_outcome`; `issue_ref`; `error_kind`; `duration_ms` | 区分 host-safe return 与 application继续；不重建report | cancellation/detach claim; entry auto-retry; queue; lease; report body |
| L-JOB-08 | `capability.jobs.runtime_failure` | primary | `error` | process construction, spawn, response delivery or cleanup / Jobs runtime | startup or lifecycle technical failure / startup or lifecycle | `phase`; `owner`; `entry_kind`; `outcome`; `error_kind` | `operation_name`; `job_run_ref`; `trace_context_ref`; `stage`; `lifecycle_state`; `cleanup_outcome`; `issue_code`; `issue_ref` | Jobs runtime failure唯一主记录；不伪造 typed report | raw runtime error; report fabrication; second invocation; scheduler internals |

## 38. R15.6 最终日志埋点表（infra / diagnostic）

### 38.1 Infra config / runtime builder cuts

| cut id | event key | mode | level | insertion point / owner | trigger / phase | required fields | optional fields | authority / purpose | forbidden fields |
|---|---|---|---|---|---|---|---|---|---|
| L-INF-01 | `capability.infra.config_validation` | primary | `info` valid / `error` rejected or missing | raw-source-to-validated-root boundary / infra config | source/schema/profile/slot validation terminal / `startup_assembly` | `phase`; `owner`; `outcome`; `binding_state` | `entry_kind`; `stage`; `port_family`; `source_slot`; `issue_code`; `issue_ref`; `error_kind`; `redaction_mode` | config validation主记录，只输出 safe category | raw key/value; file/env path; endpoint; credential; secret |
| L-INF-02 | `capability.infra.stage_validate_root` | primary | `debug` passed / `error` failed | runtime builder Stage 0 / infra | validated root accepted or rejected / `startup_assembly` | `phase`; `owner`; `stage`; `entry_kind`; `outcome` | `binding_state`; `issue_code`; `issue_ref`; `error_kind`; `cleanup_outcome` | Stage 0主记录；complete predicate未成立时不暴露entry | full config; raw source chain; partial graph; fallback |
| L-INF-03 | `capability.infra.stage_primitives` | primary | `debug` passed / `error` failed | runtime builder Stage 1~2 / infra | authority/clock/id/codec/hash/policy build terminal / startup | `phase`; `owner`; `stage`; `entry_kind`; `outcome` | `binding_state`; `adapter_kind`; `issue_code`; `issue_ref`; `error_kind`; `cleanup_outcome` | 记录 primitive family构造与prefix disposition | connection string; algorithm body; secret; dependency version text |
| L-INF-04 | `capability.infra.stage_local_ports` | primary | `debug` complete / `error` failed | runtime builder Stage 3 / infra | 27/27 local/base Port graph terminal / startup | `phase`; `owner`; `stage`; `entry_kind`; `outcome`; `count` | `port_family`; `binding_state`; `issue_code`; `issue_ref`; `error_kind`; `cleanup_outcome` | 记录 local Port coverage，不返回partial graph | repository body; DB schema; partial graph; hidden store |
| L-INF-05 | `capability.infra.stage_external_ports` | primary | `info` complete / `error` failed or Missing | runtime builder Stage 4 / infra | 9/9 slots and 14 callables bound/Disabled/failed / startup | `phase`; `owner`; `stage`; `entry_kind`; `outcome`; `count` | `port_family`; `adapter_kind`; `binding_state`; `issue_code`; `issue_ref`; `error_kind`; `cleanup_outcome` | 记录 external binding complete predicate | endpoint; route; credential; provider response; fallback fake |
| L-INF-06 | `capability.infra.entry_barrier` | primary | `info` exposed/activated/ready / `error` blocked | runtime builder Stage 5~7 + selected entry root | application graph, neutral handoff, entry owner and coverage terminal / startup | `phase`; `owner`; `stage`; `entry_kind`; `outcome`; `binding_state` | `count`; `lifecycle_state`; `issue_code`; `issue_ref`; `error_kind`; `cleanup_outcome` | selected entry complete barrier主记录 | listener/task/runner body; host scheduler; business rejection; partial runtime |
| L-INF-07 | `capability.infra.prefix_disposal` | failure-only | `info` cleanup complete / `error` cleanup failed | all-cause ordered prefix disposal / infra builder | any Stage 0~7 failure / startup | `phase`; `owner`; `stage`; `entry_kind`; `cleanup_outcome`; `outcome` | `binding_state`; `issue_ref`; `error_kind`; `duration_ms` | 保留 original failure并证明no-partial-return | raw cleanup error; partial graph reuse; fallback entry; original failure overwrite |

### 38.2 Diagnostic / observer cuts

| cut id | event key | mode | level | insertion point / owner | trigger / phase | required fields | optional fields | authority / purpose | forbidden fields |
|---|---|---|---|---|---|---|---|---|---|
| L-DIAG-01 | `inherited from the forming primary owner` | folded | inherited from primary owner | existing error/issue mapper / forming owner | typed error maps to fixed issue / `diagnostic_resolution` | `phase`; `owner`; `error_kind`; `issue_code`; `issue_ref` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `subject_ref`; `port_family` | 将 Step 12 closed mapper字段并入primary，不另写第二条 | raw cause; new error; private code; stack trace; formatted source |
| L-DIAG-02 | `capability.diagnostic.redaction_gate` | failure-only | `error` on redaction invariant violation | redaction / diagnostic mode gate / current boundary owner | attempted field violates Off/Redacted allowlist / diagnostic | `phase`; `owner`; `redaction_mode`; `outcome`; `issue_code`; `issue_ref` | `operation_name`; `trace_context_ref`; `flow_id`; `subject_ref`; `error_kind` | 只记录违规类别和省略事实；正常 redaction不另打日志 | omitted value; raw body; secret; credential; authorization internals; Full/Verbose mode |
| L-DIAG-03 | `capability.diagnostic.sink_failure` | sink-guarded | `error` | current caller's non-recursive process fallback | structured-log sink fails and fallback cannot call same sink / caller phase | `phase`; `owner`; `outcome` | `event_key_of_failed_record`; `error_kind` | 最多一次进程级fallback；若无非递归通道则不写此日志，原业务结果不变 | backend response/body; recursive logging; retry loop; business rollback; disposition change |
| L-DIAG-04 | `capability.diagnostic.consistency_defect` | primary | `error` | relation/sidecar/typed tuple invariant owner | existing `ConsistencyDefect` formed / diagnostic | `phase`; `owner`; `error_kind`; `issue_code`; `issue_ref`; `outcome` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `subject_ref`; `port_family`; `capture_ref`; `result_ref`; `report_ref` | consistency defect唯一诊断主记录 | normal missing; Degraded; Quarantined; retryable; raw row/response |
| L-DIAG-05 | `inherited from L-UOW-05, L-UOW-06 or L-UOW-07` | folded | inherited from the relevant UoW primary | local authority error mapper | `CommitOutcomeUnknown` or rollback failure already recorded / `commit_resolution` | `phase`; `owner`; `error_kind`; `issue_code`; `issue_ref`; `outcome` | `operation_name`; `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `resolution`; `rollback_outcome` | 不另写第二条；字段并入 `L-UOW-05/06/07` | accepted/failed/zero-effect; blind retry; raw backend detail |
| L-DIAG-06 | `inherited from L-APP-03` | folded | inherited from `L-APP-03` | application idempotency mapper | duplicate, in-progress, conflict or winner reread / pre-UoW | `phase`; `owner`; `operation_name`; `outcome`; `disposition` or `error_kind` | `trace_context_ref`; `request_ref`; `source_event_ref`; `job_run_ref`; `flow_id`; `result_ref`; `issue_code`; `issue_ref` | 不另写第二条；保留 replay/no-rerun字段 | full key; key hash; second mutation; winner body; attempt/retry lifecycle |

### 38.3 Observer backend failure final decision

`L-DIAG-03` 不要求业务 caller 为每次成功 sink invocation 写日志，也不授权新增 observer retry state。若具体实现已有一个与主 structured-log sink 完全独立、不会递归调用同一 sink 的进程级 diagnostic channel，可在 sink failure 时输出一次 `capability.diagnostic.sink_failure`，字段仅限上表。若没有该通道，则 sink failure 不产生另一条 structured log；后续 `R15.7/R15.8` 只能考虑由 runtime/host owner 提供低基数 failure counter，且无论如何都不得改变原业务返回、durability、receipt、report、handoff或cleanup顺序。

## 39. R15.6 `ApplicationError` 最终主记录与级别表

Step 12 §16 的 17 个 `ApplicationError` variant 是唯一输入集合。本表规定每个 variant 的最终日志主记录、分支级别和折叠规则；`L-DIAG-01` 只把已经形成的 typed error 映射为 `issue_code` / `issue_ref`，不增加第二条错误日志。一个 variant 在不同产生阶段可能选择不同的已存在 cut，但单次调用只能选择其中一个形成事实的 owner。

| # | `ApplicationError` | 最终主记录 cut | 级别 | 发射 / 折叠规则 | 处理边界与禁止推导 |
|---:|---|---|---|---|---|
| 1 | `ContractRejected` | `L-APP-02`；若在 service 前由入口完成，则由 `L-API-01` / `L-API-02` 或对应 `L-WKR-03` / `L-JOB-01` 主记 | `warn` | 由形成 rejection 的入口或 application primary 发射；`issue_code`、`issue_ref` 作为同一条记录字段 | 不记录字段值、body、raw validation text；不再复制成 domain / Port failure |
| 2 | `DomainRejected` | `L-APP-05` | `warn` stable rejection；`error` technical invariant | domain disposition 与既有 `ApplicationError` 在同一 primary 记录；不由 mapper 单独发射 | 不把 policy rejection改成 approval、runtime deny 或 external failure |
| 3 | `InvalidInput` | `L-APP-02` | `warn` typed input rejection；`error` 无法形成合法 typed input | 输入边界 primary 记录 `error_kind`；`L-DIAG-01` folded | 不输出 raw input、字段值或自由文本 |
| 4 | `InvalidTechnicalStateTransition` | `L-APP-05` | `error` | 技术状态拒绝与 `error_kind` 同条记录 | 不创建新状态、不自动迁移、不从日志授权重试 |
| 5 | `TechnicalInvariantViolation` | `L-APP-05` | `error` | application technical invariant owner 主记；只有已形成的 persisted relation defect 才转由 `L-DIAG-04` 主记 | 不降级为 missing、Degraded 或 Quarantined |
| 6 | `MissingPrerequisite` | `L-APP-04` | `warn` typed missing / unavailable；`error` contradiction | prerequisite cut 携带 exact `purpose`、`subject_ref`（可得时）和既有 issue | 不把任意 `None`、Query missing 或 external typed outcome转为 prerequisite error |
| 7 | `OptimisticConflict` | `L-UOW-03`；若冲突在 read/decode adapter 形成则 `L-UOW-08` | `warn` | CAS / expected-version 冲突作为 effect owner 的单条记录；mapper folded | 不记录 winner body、版本值、blind retry 或 last-write-wins |
| 8 | `UniquenessConflict` | `L-UOW-03`；必要的 exact winner read 作为同一 owner 的 `purpose=winner_read` 字段 | `warn` | 唯一键冲突不另建 duplicate event | 不记录 key、winner body，不把冲突变成 accepted fact |
| 9 | `IdempotencyConflict` | `L-APP-03` | `warn` | reserve classification primary 发射；`L-DIAG-06` folded | 不记录完整 key、key hash、request bytes、attempt 或第二次 mutation |
| 10 | `IdempotencyInProgress` | `L-APP-03` | `warn` | active reservation / winner-read 结果并入 idempotency primary；不得产生 retry lifecycle log | 不从日志计算 attempt，不重跑业务 body，不创建第二 reservation |
| 11 | `PortFailure` | `L-PORT-04`；local repository adapter failure 使用 `L-UOW-08` | `warn` temporary / timeout；`error` permanent / invalid / unexpected | raw-to-typed classifier 是唯一 failure primary；application 只关联 typed `error_kind` | 不输出 raw status、provider code、response body，也不从日志决定重试 |
| 12 | `TransactionBeginFailed` | `L-UOW-01` | `error` | begin failure 独立记录；尚未形成 effect set | 不声明 accepted / rejected result，不声明 rollback 已完成 |
| 13 | `TransactionCommitFailed` | `L-UOW-05` | `error` | 仅在 `resolution=NotDurable` 或明确 commit failure 时记录 | 不把 `NotDurable` 写成 success，不由 row absence 推断结果 |
| 14 | `TransactionRollbackFailed` | `L-UOW-06` | `error` | rollback outcome 与原始 phase 作为同一 recovery primary；`L-DIAG-05` folded | 不声明 zero-effect、普通 Failed 或 blind retry |
| 15 | `CommitOutcomeUnknown` | `L-UOW-05`（commit return）；`L-UOW-07`（same-authority recovery read） | `error` | commit 与 recovery 是两个已定义 phase，可各自记录一次；不产生额外 diagnostic event | 不改写为 Durable、NotDurable、失败或 zero-effect；不得发射 `transaction_ref` |
| 16 | `ConsistencyDefect` | `L-PORT-05`（typed return symmetry）；未形成 Port return 时 `L-DIAG-04` | `error` | relation / tuple / sidecar defect 由实际 invariant owner 主记；`issue_code` 同条携带 | 不降级为 missing、unavailable、Degraded、Quarantined 或 retryable |
| 17 | `CodecFailure` | request digest=`L-APP-01`；stored surface=`L-APP-07`；event snapshot=`L-APP-09`；persistence decode=`L-UOW-08` | `error` | 按产生 codec surface 选择一个 primary；`L-DIAG-01` 只 folded 映射 | 不输出 bytes、body、secret、algorithm detail，不创建 usable stored result |

## 40. R15.6 `CapabilityIssueCode` exact owner 表

以下 51 行逐字复用 Step 12 §22 的固定 literal。issue code 是 structured record 的安全分类字段，不是独立 event key；每行的 `emission` 都表示并入对应 primary，除非该 owner 本身就是 failure-only primary。正常 Query missing、empty page、`NotVisible`、`Resolved`、`Candidate`、`PendingDelivery`、`Delivered` 和 zero-target Job 不因本表而新增 issue。

| # | `CapabilityIssueCode` | 固定 literal | 最终 owner cut | 级别 | emission / 使用边界 |
|---:|---|---|---|---|---|
| 1 | `InvalidEnvelope` | `capability-hub.issue/invalid-envelope.v1` | `L-API-01`；Worker=`L-WKR-03`；Job=`L-JOB-01` | `warn` | folded into the exact entry primary；只表示 envelope metadata 不对称 |
| 2 | `MissingRequiredField` | `capability-hub.issue/missing-required-field.v1` | `L-API-01` / `L-APP-02` / `L-WKR-03` / `L-JOB-01` | `warn` | folded；不记录 field name、body 或 selector |
| 3 | `OperationMismatch` | `capability-hub.issue/operation-mismatch.v1` | `L-API-01`；Job malformed dispatch=`L-JOB-01` | `warn` | folded；不由 operation string 动态生成 event key |
| 4 | `InvalidField` | `capability-hub.issue/invalid-field.v1` | `L-APP-02`；entry pre-dispatch 使用对应 entry primary | `warn` | folded；只保留 closed category |
| 5 | `InvalidScope` | `capability-hub.issue/invalid-scope.v1` | `L-APP-02` / `L-API-01` / `L-JOB-01` | `warn` | folded；不输出 actor role、filter body 或 target id |
| 6 | `DuplicateConflict` | `capability-hub.issue/duplicate-conflict.v1` | `L-APP-03` | `warn` | folded into idempotency primary；不等同于 replay |
| 7 | `PolicyRejected` | `capability-hub.issue/policy-rejected.v1` | `L-APP-05`；pre-service body/policy gate=`L-APP-02` | `warn` | folded；不表示 governance approval 或 runtime decision |
| 8 | `BodyForbidden` | `capability-hub.issue/body-forbidden.v1` | `L-APP-02`；entry gate 由对应 API / Worker / Job primary 承接 | `warn` | folded；不保存命中内容、method body 或 document body |
| 9 | `UnsupportedSchema` | `capability-hub.issue/unsupported-schema.v1` | `L-API-01` / `L-WKR-03` / `L-JOB-01` | `warn` | folded；三个入口复用同一 code，不创建 channel-private code |
| 10 | `SubjectMissing` | `capability-hub.issue/subject-missing.v1` | declared visible marker=`L-APP-08`；write prerequisite=`L-APP-04` | `info` visible marker / `warn` required write prerequisite | folded only when protocol explicitly requires a marker；normal visible missing remains issue-free |
| 11 | `ReferenceUnresolved` | `capability-hub.issue/reference-unresolved.v1` | `L-PORT-02`；Query surface=`L-APP-08` | `warn` | folded into typed resolver/degraded primary；不把 resolver body写入日志 |
| 12 | `ReferenceUnavailable` | `capability-hub.issue/reference-unavailable.v1` | `L-PORT-02`；Query surface=`L-APP-08` | `warn` | folded；不推断 provider health 或 retry authorization |
| 13 | `StaleSource` | `capability-hub.issue/stale-source.v1` | `L-APP-08` / `L-JOB-04`；persisted relation defect另用 `L-DIAG-04` | `warn` | folded；只引用既有 freshness/state category |
| 14 | `MaterialRebuilding` | `capability-hub.issue/material-rebuilding.v1` | `L-APP-08` / `L-JOB-04` | `warn` | folded into declared degraded or target primary；不创建 rebuild lifecycle |
| 15 | `MaterialUnavailable` | `capability-hub.issue/material-unavailable.v1` | `L-APP-08` / `L-JOB-04` | `warn` | folded；不把 material state 转为 core truth failure |
| 16 | `PartialSurface` | `capability-hub.issue/partial-surface.v1` | `L-APP-08` / `L-JOB-05` | `warn` | folded；只在 protocol/card 明示 partial surface 时使用 |
| 17 | `RedactedBoundary` | `capability-hub.issue/redacted-boundary.v1` | typed read/relation=`L-APP-08` / `L-PORT-02`；redaction violation=`L-DIAG-02` | `warn` typed surface / `error` violation | folded into the forming owner；不输出 omitted value |
| 18 | `RetryRequired` | `capability-hub.issue/retry-required.v1` | `L-WKR-04` | `warn` | folded into typed delayed receipt；不包含 backoff、attempt 或 queue |
| 19 | `BoundaryQuarantined` | `capability-hub.issue/boundary-quarantined.v1` | `L-WKR-04` | `warn` | folded into receipt/disposition primary；不创建 local quarantine state |
| 20 | `TerminalTargetSkipped` | `capability-hub.issue/terminal-target-skipped.v1` | `L-JOB-04` | `info` | folded into legal target summary；不是 technical failure |
| 21 | `HandoffRejected` | `capability-hub.issue/handoff-rejected.v1` | `L-PORT-03`；caller boundary=`L-APP-10` | `warn` | folded into external typed outcome；local source remains committed |
| 22 | `HandoffUnavailable` | `capability-hub.issue/handoff-unavailable.v1` | `L-PORT-03`；caller boundary=`L-APP-10` | `warn` | folded；不回滚 local truth、不创建 delivery state |
| 23 | `HandoffRetryable` | `capability-hub.issue/handoff-retryable.v1` | `L-PORT-03`；caller boundary=`L-APP-10` | `warn` | folded；retry policy remains external owner / Step 13 boundary |
| 24 | `CollaborationFailed` | `capability-hub.issue/collaboration-failed.v1` | `L-PORT-03`；Outbound view=`L-OUT-02` | `warn` | folded typed status；不表示 local delivery failure |
| 25 | `CollaborationUnavailable` | `capability-hub.issue/collaboration-unavailable.v1` | `L-PORT-03`；Outbound view=`L-OUT-02` | `warn` | folded typed status；不生成 second collaboration event |
| 26 | `InvalidApplicationInput` | `capability-hub.issue/invalid-application-input.v1` | `L-APP-02` | `error` | folded into application input primary；不输出 input payload |
| 27 | `InvalidTechnicalStateTransition` | `capability-hub.issue/invalid-technical-state-transition.v1` | `L-APP-05` | `error` | folded；不新增 state or transition |
| 28 | `TechnicalInvariantViolation` | `capability-hub.issue/technical-invariant-violation.v1` | `L-APP-05` | `error` | folded; persisted relation defects use `ConsistencyDefect` instead |
| 29 | `MissingPrerequisite` | `capability-hub.issue/missing-prerequisite.v1` | `L-APP-04` | `warn` typed absence / `error` contradiction | folded; Query normal missing is excluded |
| 30 | `OptimisticConflict` | `capability-hub.issue/optimistic-conflict.v1` | `L-UOW-03` / adapter decode=`L-UOW-08` | `warn` | folded; exact reread is a purpose field, not a second owner |
| 31 | `UniquenessConflict` | `capability-hub.issue/uniqueness-conflict.v1` | `L-UOW-03` | `warn` | folded; no key or winner body |
| 32 | `IdempotencyConflict` | `capability-hub.issue/idempotency-conflict.v1` | `L-APP-03` | `warn` | folded; no second mutation or retry lifecycle |
| 33 | `IdempotencyInProgress` | `capability-hub.issue/idempotency-in-progress.v1` | `L-APP-03` | `warn` | folded; exact reservation remains authority |
| 34 | `DependencyFailure` | `capability-hub.issue/dependency-failure.v1` | `L-PORT-04` / `L-UOW-08` | `warn` temporary / `error` permanent | folded into raw-to-typed failure primary; raw source discarded |
| 35 | `TransactionBeginFailed` | `capability-hub.issue/transaction-begin-failed.v1` | `L-UOW-01` | `error` | folded; no accepted result or rollback claim |
| 36 | `TransactionCommitFailed` | `capability-hub.issue/transaction-commit-failed.v1` | `L-UOW-05` | `error` | folded with `resolution=NotDurable`; no success inference |
| 37 | `TransactionRollbackFailed` | `capability-hub.issue/transaction-rollback-failed.v1` | `L-UOW-06` | `error` | folded; preserve original phase and unresolved boundary |
| 38 | `CommitOutcomeUnknown` | `capability-hub.issue/commit-outcome-unknown.v1` | `L-UOW-05` / `L-UOW-07` | `error` | folded into commit or recovery primary; no blind retry or `transaction_ref` |
| 39 | `ConsistencyDefect` | `capability-hub.issue/consistency-defect.v1` | `L-PORT-05` / `L-DIAG-04` | `error` | folded into the relation invariant owner; never downgrade to missing/unavailable |
| 40 | `CodecFailure` | `capability-hub.issue/codec-failure.v1` | `L-APP-01` / `L-APP-07` / `L-APP-09` / `L-UOW-08` | `error` | folded into the exact producing surface; bytes and body remain forbidden |
| 41 | `RuntimeAssemblyFailed` | `capability-hub.issue/runtime-assembly-failed.v1` | `L-INF-01..07` according to failing stage | `error` | folded into stage primary; selected entry sees only blocked exposure |
| 42 | `ApiRouteAssemblyFailed` | `capability-hub.issue/api-route-assembly-failed.v1` | startup=`L-API-06`; request mapping=`L-API-01` | `error` | folded; no partial API graph or fallback route |
| 43 | `ApiEnvelopeNormalizationFailed` | `capability-hub.issue/api-envelope-normalization-failed.v1` | `L-API-01` / `L-API-02` | `error` | folded; no raw envelope or transport status |
| 44 | `ApiProtocolMappingFailed` | `capability-hub.issue/api-protocol-mapping-failed.v1` | `L-API-03` | `error` | folded; no response-body dump or synthetic disposition |
| 45 | `WorkerInboundEnvelopeFailed` | `capability-hub.issue/worker-inbound-envelope-failed.v1` | `L-WKR-03` | `error` | folded; application consumer is not invoked |
| 46 | `WorkerPayloadDecodingFailed` | `capability-hub.issue/worker-payload-decoding-failed.v1` | `L-WKR-03` | `error` | folded; no payload bytes, offset, lease or ack |
| 47 | `WorkerCollaborationContinuationFailed` | `capability-hub.issue/worker-collaboration-continuation-failed.v1` | `L-WKR-05` | `error` | folded; exact capture ref remains continuation authority |
| 48 | `WorkerMaintenanceTriggerFailed` | `capability-hub.issue/worker-maintenance-trigger-failed.v1` | `L-WKR-05` / cleanup=`L-WKR-06` | `error` | folded; no transport lifecycle or synthetic receipt |
| 49 | `JobInputFailed` | `capability-hub.issue/job-input-failed.v1` | `L-JOB-01` | `error` | folded; malformed admission does not require `operation_name` or `job_run_ref` |
| 50 | `JobApplicationDispatchFailed` | `capability-hub.issue/job-application-dispatch-failed.v1` | `L-JOB-02` | `error` | folded; no second invocation or fabricated report |
| 51 | `JobResultMappingFailed` | `capability-hub.issue/job-result-mapping-failed.v1` | `L-JOB-02` / runtime delivery=`L-JOB-08` | `error` | folded into the exact mapping/runtime owner; no report reconstruction |

## 41. R15.6 83-flow exact event-profile mapping（Command / Query）

本节把 Step 9 §5 的 exact flow name 集合逐行映射到 §§36~38 的最终 cut。表内 bundle 是排版缩写，不是新的实现接口；每个 bundle 在表前展开为固定 cut 集合。`conditional` 只在该 flow 的既有分支成立时发射，`folded` 继续并入最近的 primary，不产生额外 event key。

### 41.1 Bundle 展开与共同技术分支

| bundle | exact cut expansion | 使用边界 |
|---|---|---|
| `CMD-BASE` | `L-API-01/02/03` + `L-APP-01/02/03/07` + `L-UOW-01/03/05`; `L-APP-06`、`L-UOW-02`、`L-UOW-04`、`L-DIAG-01` folded into the forming primary | 所有 API Command 的入口、canonical input、validation、reserve、caller-visible surface 和 local durability boundary |
| `CMD-TECH` | `L-UOW-06` on pre-commit failure; `L-UOW-07` on `Unknown` / sidecar resolution; `L-DIAG-04` or `L-PORT-05` on consistency; `L-UOW-08` or `L-PORT-04` on typed dependency failure | 只在相应 technical branch 发生时增加；不得把技术异常改写成 `Rejected` |
| `QUERY-BASE` | `L-API-01/02/03/04` + `L-APP-08`; resolver invocation/outcome=`L-PORT-01` folded into `L-PORT-02` when a named Port is used; read adapter failure=`L-UOW-08` failure-only | 所有 API Query；严格 no-write、no-reserve、no-capture、no-repair |
| `QUERY-TECH` | `L-DIAG-04` for owner/version/sidecar contradiction; `L-DIAG-02` only for a redaction invariant violation | normal missing、empty page、`NotVisible` 和 card-declared `Degraded` 不进入 technical-error cut |

Command 的 `CMD-BASE` 不意味着每条 flow 都产生 accepted truth：stable rejection、duplicate replay 和 no-op 仍使用同一 cut 的不同 `outcome` / `disposition`。Command 的 declared capture 由 `L-APP-09` 主记，capture persistence technical failure由 `L-UOW-03` 主记；`L-APP-10` / `L-PORT-03` 只用于 R15.4 明确声明的 post-commit handoff/collaboration。

Query 的 `QUERY-BASE` 中 `L-API-04` 是 Query surface 的唯一 entry response primary，`L-APP-08` 是 application read primary；`NotVisible` 使用 `info`，`Degraded` 使用 `warn`，技术读取失败使用 `error`。Query 不得为了“补齐日志”调用 `L-UOW-01/03/05`、`L-APP-03`、`L-APP-09` 或 `L-APP-10`。

### 41.2 Command exact mapping: `C01..C26`

| ID | exact Step 9 flow | final event-profile expression | conditional error / outcome profile | terminal and forbidden observation |
|---|---|---|---|---|
| `C01` | `command_establish_capability_access_context_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | source/ref resolver=`L-PORT-01/02`; uniqueness or source symmetry=`L-UOW-03` / `L-PORT-05`; technical branch=`CMD-TECH` | Accepted / replay / rejection only; no identity from source body, governance approval, runtime authorization or duplicate mutation |
| `C02` | `command_correct_capability_identity_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | expected-version/CAS=`L-UOW-03`; loaded relation defect=`L-DIAG-04`; technical branch=`CMD-TECH` | Correction result and exact effect refs only; no log-reconstructed correction, cascade delete, merged loser or blind retry |
| `C03` | `command_retire_capability_identity_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | lifecycle guard=`L-APP-05`; CAS/capture failure=`L-UOW-03`; technical branch=`CMD-TECH` | Retire identity only; no registry cascade, runtime revoke, external delivery or inferred dependency change |
| `C04` | `command_record_capability_access_review_fact_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | current-link or policy rejection=`L-APP-05`; relation defect=`L-DIAG-04`; technical branch=`CMD-TECH` | Review fact/revision only; no governance approval, vote, policy truth or duplicate review |
| `C05` | `command_register_capability_in_registry_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | unique winner=`L-UOW-03` with `purpose=winner_read`; identity resolver=`L-PORT-02`; technical branch=`CMD-TECH` | Registry registration only; no FormalVisible, runtime allowlist, marketplace listing or execution readiness |
| `C06` | `command_update_registry_lifecycle_state_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | no-op uses `info` `outcome=no_op`; illegal/CAS=`L-APP-05` / `L-UOW-03`; technical branch=`CMD-TECH` | No-op is not a change capture; no unrelated FormalVisible/Retired effect or fabricated lifecycle delta |
| `C07` | `command_update_registry_visibility_basis_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | policy/body gate=`L-APP-02/05`; material propagation is only an effect field; technical branch=`CMD-TECH` | Caller basis does not become runtime/search/marketplace authorization or FormalVisible without declared transition |
| `C08` | `command_retire_capability_registry_entry_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | terminal/CAS=`L-APP-05` / `L-UOW-03`; technical branch=`CMD-TECH` | Registry retirement only; no identity, descriptor or exposure deletion and no external listing claim |
| `C09` | `command_establish_adapter_descriptor_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | resolver invocation/outcome=`L-PORT-01/02`; raw/typed failure=`L-PORT-04`; symmetry=`L-PORT-05`; technical branch=`CMD-TECH` | Only body-free descriptor/ref/safe summary; no provider response, secret, method body, runtime adapter or marketplace metadata |
| `C10` | `command_replace_adapter_descriptor_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | old/new symmetry=`L-PORT-05`; resolver=`L-PORT-02`; CAS=`L-UOW-03`; technical branch=`CMD-TECH` | Old/new exact refs and revisions only; no current-truth reconstruction, provider health or execution success |
| `C11` | `command_record_descriptor_risk_constraint_summary_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | summary validation=`L-APP-02/05`; stale descriptor/CAS=`L-UOW-03`; technical branch=`CMD-TECH` | Summary is a declared local fact, not runtime policy, quota, cost, approval or raw scan result |
| `C12` | `command_attach_descriptor_secret_reference_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | secret Port=`L-PORT-01/02`; forbidden-body=`L-APP-02` / `L-DIAG-02` on violation; technical branch=`CMD-TECH` | Opaque ref/state/safe summary only; no secret, credential, KMS/Vault operation, TLS material or provider response |
| `C13` | `command_attach_governance_seam_relation_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | governance resolver=`L-PORT-01/02`; relation defect=`L-PORT-05` / `L-DIAG-04`; technical branch=`CMD-TECH` | Local seam/reference change and declared captures only; no governance approval, vote, workflow body, runtime deny or audit handoff call |
| `C14` | `command_replace_governance_seam_relation_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | old/new relation symmetry=`L-PORT-05`; resolver=`L-PORT-02`; CAS=`L-UOW-03`; technical branch=`CMD-TECH` | Exact seam replacement and declared captures only; no external response body or audit handoff outcome copied into seam state |
| `C15` | `command_expire_governance_seam_relation_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | terminal transition=`L-APP-05`; CAS/capture=`L-UOW-03`; technical branch=`CMD-TECH` | Seam expiry only; no governance approval mutation, identity deletion or external revoke acknowledgement |
| `C16` | `command_attach_capability_method_relation_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | method resolver=`L-PORT-01/02`; forbidden body=`L-APP-02`; relation symmetry=`L-PORT-05`; technical branch=`CMD-TECH` | Body-free method relation only; no method body, source code, TaskDefinition, execution result or library lifecycle |
| `C17` | `command_remove_capability_method_relation_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | exact relation/CAS=`L-UOW-03`; terminal defect=`L-DIAG-04`; technical branch=`CMD-TECH` | Relation removal only; no method-asset deletion, method disablement or runtime/tools revocation |
| `C18` | `command_establish_formal_exposure_boundary_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | prerequisite resolvers=`L-PORT-01/02`; source-version symmetry=`L-PORT-05`; technical branch=`CMD-TECH` | Exposure/visibility declared fact only; no runtime allow, SDK publication, marketplace listing or governance approval |
| `C19` | `command_update_formal_visibility_applicability_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | consumer/reference read=`L-PORT-02`; re-evaluate/mark-pending branch=`L-APP-05`; technical branch=`CMD-TECH` | Actual source-version-symmetric delta only; no caller-forced Visible, runtime deny/allow or view-freshness substitution |
| `C20` | `command_suspend_formal_exposure_boundary_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | source pair=`L-PORT-05`; terminal/CAS=`L-UOW-03`; technical branch=`CMD-TECH` | Exposure suspension only; no runtime/tools stop, SDK client revoke or consumer acknowledgement |
| `C21` | `command_retire_formal_exposure_boundary_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | exposure/visibility pair=`L-PORT-05`; multi-subject CAS=`L-UOW-03`; technical branch=`CMD-TECH` | Declared terminal revisions only; no identity/descriptor/relation cascade, runtime result or marketplace transaction |
| `C22` | `command_record_capability_change_impact_fact_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | exact change/trace source=`L-APP-04`; source mismatch=`L-DIAG-04`; technical branch=`CMD-TECH` | Impact fact only; no execution outcome, billing/cost fact, downstream acceptance or evidence alias |
| `C23` | `command_record_traceability_handoff_summary_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + post-commit `L-APP-10` / `L-PORT-03` | local request commit=`L-UOW-05`; typed handoff=`L-PORT-03`; handoff shape=`L-PORT-05`; technical branch=`CMD-TECH` | `HandoffPending` remains local fact; no external received/audit persisted claim, evidence alias, acceptance signature or local rollback |
| `C24` | `command_record_reference_resolution_state_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | resolver=`L-PORT-01/02`; state/source mismatch=`L-PORT-05`; technical branch=`CMD-TECH` | Canonical reference state only; no resolver body, external health, approval or relation/exposure mutation |
| `C25` | `command_register_external_document_reference_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | resolver=`L-PORT-01/02`; body/redaction=`L-APP-02` / `L-DIAG-02`; uniqueness=`L-UOW-03`; technical branch=`CMD-TECH` | Body-free document ref/state only; no document/OpenAPI body, source path or evidence document |
| `C26` | `command_register_capability_consumer_reference_flow` | `CMD-BASE` + `L-APP-04` + `L-APP-05` + `L-APP-09` | closed consumer union/resolver=`L-PORT-02`; candidate/owner symmetry=`L-PORT-05`; technical branch=`CMD-TECH` | Consumer reference only; no runtime invocation, tool result, SDK package/client, allowlist/cache or marketplace listing |

### 41.3 Query exact mapping: `Q01..Q33`

| ID | exact Step 9 flow | final event-profile expression | conditional error / outcome profile | terminal and forbidden observation |
|---|---|---|---|---|
| `Q01` | `query_get_capability_identity_flow` | `QUERY-BASE` + `L-PORT-01/02` when the identity visibility resolver is Port-owned | visible missing=`info` no issue; Degraded=`warn`; pair defect=`QUERY-TECH`; read failure=`L-UOW-08` | No body read after `NotVisible`; no identity creation, access-audit write or subject-id leakage |
| `Q02` | `query_search_capability_identities_flow` | `QUERY-BASE` + collection resolver `L-PORT-01/02` when declared | empty page and NotVisible empty page both `info` with distinct `outcome`; page/read failure=`L-UOW-08` | No cursor persistence, directory rebuild, query history or visibility inference from empty items |
| `Q03` | `query_get_capability_access_review_fact_flow` | `QUERY-BASE` + `L-PORT-01/02` for review/identity resolver | normal visible missing=`info`; declared Degraded=`warn`; relation defect=`QUERY-TECH` | No governance approval, review write, handoff or body disclosure outside card |
| `Q04` | `query_get_capability_registry_entry_flow` | `QUERY-BASE` + registry/identity resolver `L-PORT-01/02` | Visible missing=`info`; NotVisible=`info`; owner/version mismatch=`L-DIAG-04` `error` | No directory fallback, runtime authorization inference or registry mutation |
| `Q05` | `query_list_capability_registry_entries_flow` | `QUERY-BASE` + collection resolver `L-PORT-01/02` | empty/NotVisible=`info`; declared Degraded=`warn`; page defect/read failure=`QUERY-TECH` / `L-UOW-08` | No projection fallback, stored cursor/replay, read audit or write UoW |
| `Q06` | `query_get_registry_visibility_semantics_flow` | `QUERY-BASE` + optional exposure/visibility resolver `L-PORT-01/02` | optional absence follows card=`info`; source-version defect=`L-DIAG-04`; Degraded=`warn` | Semantics is not runtime allow/deny; no exposure or visibility creation |
| `Q07` | `query_get_adapter_descriptor_flow` | `QUERY-BASE` + descriptor/identity resolver `L-PORT-01/02` | visible missing=`info`; resolver unavailable=`warn`; relation defect=`QUERY-TECH` | No provider response, descriptor reconstruction or execution adapter invocation |
| `Q08` | `query_get_descriptor_risk_constraint_summary_flow` | `QUERY-BASE` + summary/descriptor resolver `L-PORT-01/02` | summary unavailable only if card-declared Degraded=`warn`; technical read=`error` | No policy approval, quota/cost inference, refresh or raw scan result |
| `Q09` | `query_get_descriptor_secret_safe_summary_flow` | `QUERY-BASE` + safe-summary resolver `L-PORT-01/02` | Redacted/Unavailable Degraded=`warn`; redaction violation=`L-DIAG-02` `error` | No secret value, credential, KMS/Vault body or secret health assertion |
| `Q10` | `query_list_descriptors_by_capability_flow` | `QUERY-BASE` + registry/descriptor collection resolver `L-PORT-01/02` | empty/NotVisible=`info`; page/owner defect=`QUERY-TECH`; read failure=`L-UOW-08` | No descriptor or registry creation, old provider catalog or cursor persistence |
| `Q11` | `query_get_governance_seam_relation_flow` | `QUERY-BASE` + seam/identity resolver `L-PORT-01/02` | ReferenceUnresolved/Unavailable Degraded=`warn`; relation defect=`L-DIAG-04` | No governance body, approval truth, review invocation or audit handoff |
| `Q12` | `query_get_access_governance_separation_flow` | `QUERY-BASE` + identity/review/seam resolver `L-PORT-01/02` | optional seam absence=`info`; declared Degraded=`warn`; mismatch=`QUERY-TECH` | No approval/vote/policy body, deny record or accepted approval inference |
| `Q13` | `query_get_capability_method_relation_flow` | `QUERY-BASE` + relation/identity resolver `L-PORT-01/02` | typed reference Degraded=`warn`; relation defect=`L-DIAG-04` | No method body/source code, execution result, handoff or relation mutation |
| `Q14` | `query_list_capability_relations_flow` | `QUERY-BASE` + kind-bound collection resolver `L-PORT-01/02` | empty/NotVisible=`info`; kind/page defect=`QUERY-TECH` | No governance/method relation merge, missing inference from empty page or capture |
| `Q15` | `query_get_formal_exposure_boundary_flow` | `QUERY-BASE` + exposure/registry/identity resolver `L-PORT-01/02` | Visible/NotVisible=`info`; declared Degraded=`warn`; paired defect=`L-DIAG-04` | No policy mutation, runtime allow, SDK publication or marketplace listing |
| `Q16` | `query_get_formal_visibility_applicability_flow` | `QUERY-BASE` + exposure/consumer resolver `L-PORT-01/02` | consumer/reference gap=`warn` Degraded; source pair defect=`QUERY-TECH` | Applicability read is not authorization; no exposure transition or deny record |
| `Q17` | `query_get_controlled_consumer_view_flow` | `QUERY-BASE` + view/exposure/consumer resolver `L-PORT-01/02` | StaleReadable/Rebuilding/Unavailable/Partial=`warn`; persisted relation defect=`L-DIAG-04` | No refresh/rebuild Job, exposure truth rewrite or runtime execution |
| `Q18` | `query_list_consumable_capabilities_for_runtime_tools_flow` | `QUERY-BASE` + consumer-bound view resolver `L-PORT-01/02` | material availability Degraded=`warn`; technical read=`error` | No tools execution, invocation/result, allowlist/cache or runtime authorization |
| `Q19` | `query_get_sdk_exposure_boundary_flow` | `QUERY-BASE` + SDK/exposure/view resolver `L-PORT-01/02` | SDK/ref/material gap=`warn` Degraded; paired defect=`QUERY-TECH` | No SDK client/package generation or publication status inference |
| `Q20` | `query_get_capability_access_trace_flow` | `QUERY-BASE` + trace collection resolver `L-PORT-01/02` | Partial/HandoffPending=`warn` Degraded; repository defect=`L-UOW-08` / `L-DIAG-04` | No log/metric reconstruction, evidence alias, append or HandoffPending repair |
| `Q21` | `query_get_capability_change_impact_flow` | `QUERY-BASE` + impact/change resolver `L-PORT-01/02` | visible missing=`info`; declared Degraded=`warn`; source-link defect=`L-DIAG-04` | No execution result, downstream feedback mutation or audit acceptance |
| `Q22` | `query_get_downstream_consumption_impact_summary_flow` | `QUERY-BASE` + downstream collection resolver `L-PORT-01/02` | item Delayed/Unavailable remains legal `info` fact; technical read=`error` | Do not turn item state into retry Command, runtime denial or capability truth failure |
| `Q23` | `query_get_audit_handoff_trace_summary_flow` | `QUERY-BASE` + trace/reference resolver `L-PORT-01/02` | partial non-resolved refs=`warn` Degraded; mandatory pair defect=`L-DIAG-04` | No raw audit store/telemetry, handoff/retry call, evidence alias or signature |
| `Q24` | `query_search_capability_directory_flow` | `QUERY-BASE` + directory collection resolver `L-PORT-01/02` | StaleReadable/Rebuilding/Unavailable=`warn`; projection read defect=`L-UOW-08` | No registry truth substitution, projection refresh/rebuild or trace write |
| `Q25` | `query_browse_capability_directory_flow` | `QUERY-BASE` + browse-scope resolver `L-PORT-01/02` | empty/NotVisible=`info`; directory degraded=`warn`; technical read=`error` | No current-truth page reconstruction, access authorization or material mutation |
| `Q26` | `query_get_audit_friendly_export_summary_flow` | `QUERY-BASE` + export/trace resolver `L-PORT-01/02` | Partial/Unavailable=`warn` Degraded; redaction defect=`L-DIAG-02/04` | No raw audit/log/span/metric body, evidence alias, signature or external audit call |
| `Q27` | `query_get_read_only_ecosystem_discovery_summary_flow` | `QUERY-BASE` + exposure/consumer summary resolver `L-PORT-01/02` | material freshness/unavailable=`warn`; read defect=`L-UOW-08` | No marketplace listing/ranking/pricing/transaction or runtime route |
| `Q28` | `query_get_capability_reconciliation_report_flow` | `QUERY-BASE` + report/collection resolver `L-PORT-01/02` | report state is `info`/declared Degraded `warn`; load contradiction=`L-DIAG-04` | No automatic truth repair, Job creation or report reconstruction |
| `Q29` | `query_get_reference_resolution_state_flow` | `QUERY-BASE` + external-reference resolver `L-PORT-01/02` | Unavailable/Redacted/StaleReadable=`warn` Degraded; Invalid/Forbidden stays typed | No resolver refresh, owner body reconstruction or new state |
| `Q30` | `query_get_external_document_reference_flow` | `QUERY-BASE` + document subject resolver `L-PORT-01/02` | body-forbidden/Unavailable=`warn` Degraded; pair defect=`L-DIAG-04` | No document body, state refresh or evidence interpretation |
| `Q31` | `query_get_runtime_tools_consumer_reference_flow` | `QUERY-BASE` + consumer-union resolver `L-PORT-01/02` | typed reference Degraded=`warn`; technical read=`error` | No runtime/tools invocation, result, allowlist or cache |
| `Q32` | `query_get_sdk_exposure_consumer_reference_flow` | `QUERY-BASE` + SDK-union resolver `L-PORT-01/02` | typed reference Degraded=`warn`; pair defect=`L-DIAG-04` | No client/package/generated code read or publication inference |
| `Q33` | `query_get_observability_audit_reference_flow` | `QUERY-BASE` + audit-subject resolver `L-PORT-01/02` | Redacted/Unavailable=`warn` Degraded; raw audit violation=`L-DIAG-02`; pair defect=`L-DIAG-04` | No raw telemetry/audit body, audit truth creation, evidence alias, retry or handoff success |

### 41.4 Command / Query exact-set audit

| audit | expected | actual | result |
|---|---:|---:|---|
| exact Command IDs | `C01..C26` / 26 | 26 | pass; each row has one exact Step 9 flow name |
| exact Query IDs | `Q01..Q33` / 33 | 33 | pass; each row has one exact Step 9 flow name |
| Command rows with `CMD-BASE` | 26 | 26 | pass |
| Query rows with `QUERY-BASE` | 33 | 33 | pass |
| Query rows containing a write/capture profile | 0 | 0 | pass |
| Command rows with declared capture or explicit no-capture exception | 26 | 26 | pass |
| duplicate exact IDs | 0 | 0 | pass |
| missing / extra exact flow names | 0 / 0 | 0 / 0 | pass |

## 42. R15.6 83-flow exact event-profile mapping（Inbound / Outbound / Job）

### 42.1 Event and Job bundle expansion

| bundle | exact cut expansion | 使用边界 |
|---|---|---|
| `IN-BASE` | `L-WKR-03/04` + `L-APP-04/05` + `L-UOW-01/03/05`; resolver call=`L-PORT-01/02` when the flow declares one; `L-DIAG-01` folded | header-first admission、typed receipt、declared local effect 和 commit resolution |
| `IN-CAPTURE` | `L-APP-09` + `L-UOW-03` folded/primary according to snapshot or persistence failure | 仅 reference/state flow 形成实际 declared change capture 时使用；no-change `Ignored` 不发 capture |
| `IN-CONTINUE` | `L-WKR-05` and, on source-task cleanup, `L-WKR-06` | 只观察 exact capture-ref continuation / source lifecycle，不创建 receipt 或 delivery state |
| `OUT-BASE` | `L-APP-09` + `L-UOW-01/03/05` + `L-OUT-01` + `L-PORT-03` + `L-OUT-03`; `L-OUT-02` folded into `L-PORT-03`; raw/shape failure=`L-PORT-04/05` | Phase A source/capture、Phase B external typed return、Phase C local bind；三阶段不可合并 |
| `JOB-PLAN` | `L-JOB-01/02/03` + `L-UOW-01/03/05`; `L-UOW-02` folded for reserve/winner/reentry read | admission、deterministic plan、initial reservation、frozen journal 和 duplicate/reentry authority |
| `JOB-TARGET` | `L-JOB-04` + `L-UOW-03/05/06`; `L-APP-09` only when target declares a changed derived/material/reference capture | one target's durable effect and journal terminalization；technical control-plane defect keeps target `Planned` |
| `JOB-FINAL` | `L-JOB-05` + `L-UOW-03/05/07`; `L-DIAG-04` on final relation defect | pure all-terminal journal assembly、typed report/result and completion；不从 counters/logs重建 |
| `JOB-RUNTIME` | `L-JOB-07/08` + `L-WKR-06` only where the selected entry owns drain/join cleanup | deadline、non-cancelling observation、process delivery、join/cleanup；不改变 journal/report disposition |
| `JOB-COLLAB` | `L-JOB-06` + `L-PORT-03` + `L-OUT-01/03` when a capture is bound; `L-OUT-02` folded | only collaboration-repair targets；external status remains Port-owned |

`IN-BASE` 的 `L-WKR-03` 只记录 header-first gate，`L-WKR-04` 只记录 application consumer typed receipt；Worker continuation 不得补写 application effect。`OUT-BASE` 的 `L-PORT-03` 允许 `Candidate`、`PendingDelivery`、`Delivered` 等合法 typed outcome 使用 `info`；`PendingDelivery` 不升级为 warning failure，只有 raw failure 或 invalid carrier 进入 `L-PORT-04/05`。`JOB-PLAN`、`JOB-TARGET`、`JOB-FINAL` 和 `JOB-RUNTIME` 的 owner 互不替代。

### 42.2 Inbound exact mapping: `I01..I06`

| ID | exact Step 9 flow | final event-profile expression | conditional error / outcome profile | terminal and forbidden observation |
|---|---|---|---|---|
| `I01` | `inbound_consume_governance_result_reference_changed_flow` | `IN-BASE` + `L-PORT-01/02` + conditional `IN-CAPTURE` + `IN-CONTINUE` | `Accepted` / `Ignored` / `DuplicateReplayed`=`info`; `Delayed` / `Rejected` / `Quarantined` / `UnsupportedSchema`=`warn`; shape defect=`L-PORT-05`; technical=`L-UOW-08` | Only GovernanceResultRef/state revision and typed receipt; no governance seam/approval/policy truth, payload decode on unsupported schema or automatic review execution |
| `I02` | `inbound_consume_method_asset_reference_changed_flow` | `IN-BASE` + `L-PORT-01/02` + conditional `IN-CAPTURE` + `IN-CONTINUE` | resolver typed Unresolved/Unavailable=`warn` disposition; method body/target contradiction=`L-WKR-04` + `L-DIAG-04`; unsupported decode=`warn` | Only MethodAssetRef/state revision and receipt; no method relation, source code, execution, queued Command or body persistence |
| `I03` | `inbound_consume_downstream_consumption_impact_reported_flow` | `IN-BASE` + `L-APP-04/05` + `L-UOW-03/05` + `IN-CONTINUE`; no `IN-CAPTURE` unless an exact declared impact event is present | valid payload states `Delayed` / `Unavailable` / `Ignored` still use accepted-processing `info`; unavailable prerequisite processing=`warn`; technical append/commit=`error` | Append only DownstreamConsumptionImpactSummary and receipt; no downstream execution/request/result, no retry reclassification from payload state, no impact/core-truth mutation |
| `I04` | `inbound_consume_external_capability_source_reference_changed_flow` | `IN-BASE` + `L-PORT-01/02` + conditional `IN-CAPTURE` + `IN-CONTINUE` | header/body-free gate rejection or quarantine=`warn`; source/digest/subject collision=`L-DIAG-04` `error`; raw Port failure=`L-PORT-04` | Only ExternalCapabilitySourceRef/state revision and receipt; no MCP/A2A/API body, credential, identity creation or runtime integration |
| `I05` | `inbound_consume_audit_material_reference_changed_flow` | `IN-BASE` + `L-PORT-01/02` + conditional `IN-CAPTURE` + `IN-CONTINUE` | redaction/body violation=`L-DIAG-02` `error`; resolver shape=`L-PORT-05` `error`; unsupported/quarantine=`warn` | Only ObservabilityAuditReference/state revision and receipt; no raw log/span/metric/audit body, trace append, handoff call, evidence alias or signature |
| `I06` | `inbound_consume_external_document_reference_changed_flow` | `IN-BASE` + `L-PORT-01/02` + conditional `IN-CAPTURE` + `IN-CONTINUE` | document body/owner/kind mismatch=`warn` quarantine or `error` consistency according to typed branch; raw source=`L-PORT-04` | Only ExternalDocumentReference/state revision and receipt; no document/OpenAPI/schema body, descriptor mutation, automatic support attach or evidence claim |

### 42.3 Outbound exact mapping: `O01..O10`

| ID | exact Step 9 flow | exact source/event family | final event-profile expression | conditional error / outcome profile | terminal and forbidden observation |
|---|---|---|---|---|---|
| `O01` | `outbound_capability_identity_changed_capture_and_collaborate_flow` | `CapabilityIdentityChanged` | `OUT-BASE` | source revision/snapshot asymmetry=`L-PORT-05` / `L-DIAG-04`; external raw failure=`L-PORT-04`; bind failure=`L-OUT-03` `error` | Start only from exact identity change record; no current-identity remap, Delivered-as-audit-acceptance or second event |
| `O02` | `outbound_capability_registry_changed_capture_and_collaborate_flow` | `CapabilityRegistryChanged` | `OUT-BASE` | registry source/capture mismatch=`L-PORT-05`; typed Candidate/Pending/Delivered=`info`; raw failure=`L-PORT-04` | Registry change record is the only source; no reconciliation report, directory or marketplace delivery inference |
| `O03` | `outbound_adapter_descriptor_changed_capture_and_collaborate_flow` | `AdapterDescriptorChanged` | `OUT-BASE` | forbidden body or descriptor symmetry=`L-PORT-05` / `L-DIAG-04`; capture codec=`L-APP-09` `error` | Immutable descriptor snapshot only; no secret/provider response, adapter execution state or current-descriptor reconstruction |
| `O04` | `outbound_governance_seam_relation_changed_capture_and_collaborate_flow` | `GovernanceSeamRelationChanged` | `OUT-BASE` | seam/source mismatch=`L-PORT-05`; external typed failure=`L-PORT-03` `warn` only when typed status is non-success | Collaboration is not governance approval; no approval/workflow body or external delivery-as-decision inference |
| `O05` | `outbound_capability_method_relation_changed_capture_and_collaborate_flow` | `CapabilityMethodRelationChanged` | `OUT-BASE` | relation/capture mismatch=`L-PORT-05`; raw external failure=`L-PORT-04` | No method body/source code/execution result and no method-library lifecycle mutation |
| `O06` | `outbound_formal_exposure_boundary_changed_capture_and_collaborate_flow` | `FormalExposureBoundaryChanged` | `OUT-BASE` | exposure/visibility source-version defect=`L-DIAG-04`; typed external outcome=`L-PORT-03` | No runtime allow/deny, SDK publication, marketplace listing or consumer execution conclusion |
| `O07` | `outbound_controlled_consumer_view_availability_changed_capture_and_collaborate_flow` | `ControlledConsumerViewAvailabilityChanged` | `OUT-BASE` | view source/freshness asymmetry=`L-PORT-05`; status `PendingDelivery` remains `info` | View revision is exact source, not exposure truth or runtime cache delivery; no current-view rebuild |
| `O08` | `outbound_capability_change_impact_identified_capture_and_collaborate_flow` | `CapabilityChangeImpactIdentified` | `OUT-BASE` | non-Identified source or impact/link mismatch=`L-DIAG-04`; external raw failure=`L-PORT-04` | Exact Identified impact only; no downstream feedback, later impact revision, execution/billing/acceptance fact |
| `O09` | `outbound_derived_material_refreshed_capture_and_collaborate_flow` | `DerivedMaterialRefreshed` | `OUT-BASE` | closed four-variant source mismatch=`L-PORT-05`; material snapshot/codec=`L-APP-09` / `L-UOW-03` | Only declared DirectoryProjection, AuditFriendlyExportSummary, ReadOnlyEcosystemDiscoverySummary or ReconciliationReport; no marketplace listing, evidence or auto-repair |
| `O10` | `outbound_reference_resolution_changed_capture_and_collaborate_flow` | `ReferenceResolutionChanged` | `OUT-BASE` | source subject/kind/version/digest defect=`L-PORT-05`; resolver response is never source; raw failure=`L-PORT-04` | Canonical state revision only; no external owner body, service-health inference, relation/exposure mutation or second capture |

`O01..O10` 必须按相同三阶段顺序解释日志：`L-APP-09` / `L-UOW-03` 观察 Phase A，`L-OUT-01` 观察从官方 capture/snapshot 加载，`L-PORT-03`（以及 folded `L-OUT-02`）观察外部 typed outcome，`L-OUT-03` 观察本地 `Captured -> IntentBound`。Phase B/C 的任何失败都不得回滚已提交 source；`L-OUT-01` 不得被改写成 current-source read。

### 42.4 Operations Job exact mapping: `J01..J08`

| ID | exact Step 9 flow | final event-profile expression | conditional error / outcome profile | terminal and forbidden observation |
|---|---|---|---|---|
| `J01` | `job_run_capability_registry_reconciliation_flow` | `JOB-PLAN` + `JOB-TARGET` + conditional `L-APP-09` + `JOB-FINAL` + `JOB-RUNTIME` | safe missing/finding=`L-JOB-04` typed target issue; journal/report defect=`L-DIAG-04` / `L-UOW-07`; duplicate=`L-JOB-03` `info` | Report and declared derived capture only; no registry repair, `CapabilityRegistryChanged`, log-counter report reconstruction or automatic rebuild |
| `J02` | `job_refresh_controlled_consumer_view_flow` | `JOB-PLAN` + `JOB-TARGET` + conditional `L-APP-09` + `JOB-FINAL` + `JOB-RUNTIME` | source inapplicable/unresolved=`L-JOB-04` typed target outcome; owner/version defect=`L-DIAG-04`; temporary resolver=`warn` Retryable | View revision/unchanged target and journal only; no formal exposure mutation, intermediate Rebuilding persistence or runtime/tools call |
| `J03` | `job_rebuild_directory_search_browse_projection_flow` | `JOB-PLAN` + `JOB-TARGET` + conditional `L-APP-09` + `JOB-FINAL` + `JOB-RUNTIME` | target missing may be stable failed target; persisted asymmetry=`L-DIAG-04`; projection write=`L-UOW-03` `error` | Projection revision/unchanged target only; no registry/descriptor/exposure backfill, provider/marketplace fallback or report reconstruction |
| `J04` | `job_prepare_audit_friendly_export_summary_flow` | `JOB-PLAN` + `JOB-TARGET` + conditional `L-APP-09` + `JOB-FINAL` + `JOB-RUNTIME` | Invalid/Forbidden=`L-JOB-04` `warn` stable target issue; material unavailable/unresolved/stale=`warn` typed target; pair defect=`L-DIAG-04` | Export summary and allowed refs only; no raw telemetry, external audit handoff, evidence alias, signature or raw error item |
| `J05` | `job_rebuild_read_only_ecosystem_discovery_summary_flow` | `JOB-PLAN` + `JOB-TARGET` + conditional `L-APP-09` + `JOB-FINAL` + `JOB-RUNTIME` | optional-source gap=`info`/typed target category; loaded owner/source defect=`L-DIAG-04`; technical control-plane=`error` and target remains Planned | Read-only discovery summary only; no marketplace listing/ranking/pricing/transaction, exposure rewrite or runtime route |
| `J06` | `job_run_derived_material_reconciliation_flow` | `JOB-PLAN` + `JOB-TARGET` + conditional `L-APP-09` + `JOB-FINAL` + `JOB-RUNTIME` | `RebuildRequired` / `Inconsistent` / explicit `Failed` remain report states; finalization defect=`L-JOB-05` / `L-UOW-07` | Reconciliation report only; no automatic nested Job, core/material repair or conversion of report state into execution |
| `J07` | `job_refresh_external_reference_resolution_flow` | `JOB-PLAN` + `JOB-TARGET` + conditional `L-PORT-01/02` + `L-APP-09` + `JOB-FINAL` + `JOB-RUNTIME` | temporary resolver failure=`L-PORT-04` / `L-JOB-04` Retryable; terminal skip=`L-JOB-04` `info`; invalid/forbidden reopen attempt=`L-DIAG-04` | Exact canonical reference state revision/unchanged/skipped target only; no missing ref creation, state reopen, dependent material stale mutation or external body copy |
| `J08` | `job_repair_capability_access_event_collaboration_flow` | `JOB-PLAN` + `JOB-TARGET` + `JOB-COLLAB` + `JOB-FINAL` + `JOB-RUNTIME`; capture load=`L-OUT-01`; local bind=`L-OUT-03`; `L-OUT-02` folded | typed external `Failed`/`HandoffUnavailable` is an inspected `info` item; no typed Port outcome=`L-PORT-04` and target may become Retryable; asymmetry=`L-PORT-05` / `L-DIAG-04` | Frozen capture/intent and journal/report only; no mapper rerun, current-source read, new event/snapshot/capture/intent or local delivery lifecycle |

### 42.5 Inbound / Outbound / Job exact-set audit

| audit | expected | actual | result |
|---|---:|---:|---|
| exact Inbound IDs | `I01..I06` / 6 | 6 | pass |
| exact Outbound IDs | `O01..O10` / 10 | 10 | pass |
| exact Job IDs | `J01..J08` / 8 | 8 | pass |
| Inbound header-first and typed receipt coverage | 6 | 6 | pass |
| Outbound Phase A/B/C coverage | 10 | 10 | pass |
| Job plan/target/final/runtime separation | 8 | 8 | pass |
| external status copied into local delivery state | 0 | 0 | pass |
| Job report reconstructed from logs/counters/current truth | 0 | 0 | pass |
| missing / extra / duplicate exact IDs | 0 / 0 / 0 | 0 / 0 / 0 | pass |

## 43. R15.6 特殊分支与重复 owner 最终审计

本节是对 §§39~42 的最终边界审计。审计对象不是新增日志 profile，而是确认每个容易被重复记录、错误降级或错误解释的分支仍只有一个事实形成 owner。`folded` 记录只允许携带调用者已经拥有的安全字段，不得把日志 mapper 变成第二个业务事实、恢复动作或外部协作状态机。

### 43.1 特殊分支审计矩阵

| 分支 | 唯一 primary owner | 允许的 folded / phase 关联 | 最终级别 | 必须保持的语义 | 禁止的重复或推导 | 结果 |
|---|---|---|---|---|---|---|
| duplicate replay | `L-APP-03` | `L-API-03`、`L-APP-07` 或 `L-JOB-02/03` 只携带 caller-visible replay；`L-DIAG-06` folded | `info` | exact stored result / receipt / report 已由既有 authority 返回；不重新执行 mutation | 不再 reserve、capture、effect-write、audit-write、Job target 或 external collaboration；不从日志重建 replay body | pass |
| idempotency conflict | `L-APP-03` | `L-API-03`、`L-APP-07` 可折叠 rejection；`L-DIAG-06` folded | `warn` | conflict 是 reserve classification，不是 duplicate replay，也不是 accepted truth | 不记录 key、key hash、winner body、attempt、retry authorization 或第二次 mutation | pass |
| idempotency in-progress | `L-APP-03` | exact winner-read / reservation purpose 作为 `purpose` 或安全 disposition 字段；`L-UOW-02` folded | `warn` | 当前 reservation 仍是唯一 authority；调用保持 typed in-progress 结果 | 不创建第二 reservation，不把等待或超时改写为 retry lifecycle，不由 log counter 计算 attempt | pass |
| Query no-write | `L-APP-08`；入口返回由 `L-API-04` 主记 | resolver typed outcome=`L-PORT-02`；read adapter technical failure=`L-UOW-08` failure-only；`L-API-05` 只观察 transport end | `info` for Visible / normal missing / `NotVisible`; `warn` for `Degraded`; `error` for technical failure | Query 只读、严格 no-write；`NotVisible` 是合法 read surface，不自动生成 issue | 不进入 `L-UOW-01/03/05/06`、reserve、capture、audit-write、repair、post-commit 或 Job write cut；不把 missing 变成 prerequisite error | pass |
| `CommitOutcomeUnknown` | `L-UOW-05` for commit return; `L-UOW-07` for same-authority recovery read | `L-DIAG-05` folded；两个已定义 phase 可各有一条主记录 | `error` | durable result 未知；只能记录 `Durable`、`NotDurable` 或 `Unknown` 中已由 authority 证明的 resolution | 不猜 success/failure/zero-effect，不 blind retry，不把 row absence、elapsed time 或日志计数当 resolution；当前不发射 `transaction_ref` | pass |
| rollback succeeded | `L-UOW-06` recovery primary | 原始 pre-commit failure 保持原 owner；`L-DIAG-05` folded | `info` for known rollback success | rollback 是恢复阶段事实，不改变原始失败 phase，也不产生 business result | 不把 rollback success 改写为 command success、accepted truth 或 `NotDurable` 之外的 commit resolution | pass |
| rollback failed | `L-UOW-06` | `L-DIAG-05` folded；必要时由 `L-UOW-07` 记录后续 same-authority recovery | `error` | rollback failure 与原始 failure 同时可见，effect boundary 仍按未知/未证明处理 | 不声明 zero-effect、普通 `Failed`、自动重试或已清理；不覆盖原始 failure | pass |
| `ConsistencyDefect` | `L-PORT-05` when typed response symmetry is returned; otherwise `L-DIAG-04` at local invariant owner | `L-DIAG-01` only folds fixed issue mapping | `error` | relation / tuple / sidecar / source-version contradiction 是独立技术缺陷 | 不降级为 missing、unavailable、Degraded、Quarantined 或 retryable；不生成 synthetic success 或修复状态 | pass |
| observer backend failure | `L-DIAG-03` only when a non-recursive fallback exists | no second structured record when no independent channel exists | `error` when emitted | observer failure cannot alter business result, durability, receipt, report, handoff or cleanup order | 不递归调用同一 sink，不建立 observer retry state，不回滚业务 truth，不改变 disposition | pass |
| local capture and external collaboration | local source/capture: `L-APP-09` plus `L-UOW-03/05`; official load: `L-OUT-01`; external typed outcome: `L-PORT-03` with folded `L-OUT-02`; local bind: `L-OUT-03` | `L-APP-10` may observe post-commit facade boundary; `L-PORT-01` is folded callable-entry context only | local durability follows UoW; typed external outcome follows its declared `info`/`warn`/`error` branch | local `Captured` / `IntentBound` and external `Accepted` / `Candidate` / `PendingDelivery` / `Delivered` remain separate authorities | 不把 external status复制到 local delivery state，不从 external response重建 capture，不回滚已提交 source，不生成 second event/capture/intent | pass |

### 43.2 Duplicate owner 与 level 一致性核对

| 检查项 | 唯一 owner / 规则 | 实际结论 |
|---|---|---|
| typed error 到日志 | 先由形成 error 的 primary 记录；`L-DIAG-01` 只 folded issue mapping | 无独立 mapper duplicate |
| issue code 到日志 | 51 个 fixed literal 只作为 owner primary 字段 | 无动态 event key、无第二条 issue event |
| caller-visible surface | API / Worker / Jobs 可以记录 boundary，但不复制底层 body、raw error 或 durable claim | 上层记录不会夺取 application / UoW / Port authority |
| external collaboration | `L-PORT-03` 是 external typed outcome primary；`L-OUT-02` folded | external status 不进入 local delivery lifecycle |
| Job report | `L-JOB-05` 只读取已保存 report / journal / result proof | 不由 log、metric、counter 或 current truth 重建 report |
| Query | `L-APP-08` 是唯一 application read primary；technical read failure 才关联 `L-UOW-08` | no-write 规则没有例外 |
| commit / rollback | `L-UOW-05/06/07` 按 phase 分开；`L-DIAG-05` folded | Unknown、rollback failed 与普通 failure 不混写 |
| sink failure | 只有非递归 fallback 才可发 `L-DIAG-03` | 业务路径不依赖观测 sink |

以上核对确认：`folded` 不是“额外的日志条数”，而是将既有安全字段并入一个已经存在的 primary record。任何实现若需要新增 primary、独立 event key、重试状态、delivery state 或 recovery action，必须回开所属 Step，不得在 observability facade 中自行扩展。

### 43.3 R15.6 SOP 五问最终回答

| SOP 问题 | R15.6 最终回答 | 可回指的设计位置 |
|---|---|---|
| 哪些错误分支必须记录日志？ | 17 个 `ApplicationError`、51 个 `CapabilityIssueCode`、entry admission / startup / binding、Worker / Jobs lifecycle failure、commit unknown、rollback failure、consistency defect 和 raw-source typed failure均有唯一 owner；正常 Query missing、`NotVisible`、合法 `PendingDelivery` 和 zero-target summary 不被误报为 failure。 | §§39~40、43.1 |
| 日志记录什么？ | 只记录固定 event key、phase、owner、typed outcome、closed error / issue、body-free ref、binding / lifecycle / resolution 和必要 duration；字段来源固定于 §35.2。 | §§35.1~35.3 |
| 日志不记录什么？ | 不记录 body、secret、credential、raw source / response / config、transport cursor、attempt / lease / ack、stack trace、method/document body、evidence alias 或 acceptance signature；`transaction_ref` 当前也不发射。 | §35.2、各 profile forbidden fields |
| 谁拥有失败和恢复事实？ | 入口、application、UoW、Port、Worker、Jobs、infra 和 diagnostic 各自保留 owner；mapper 与 caller 只能 folded；UoW durability / recovery 和 external typed outcome 不能由日志替代。 | §§36~38、43.2 |
| 观测 backend 失败如何处理？ | 只在存在独立非递归 fallback 时发一次 `L-DIAG-03`；否则不再写 structured log，原业务结果与清理顺序不变。 | §38.3、43.1 |

## 44. R15.6 最终机械自检与跨 Step 闭合

### 44.1 最终表机械自检

本批在写入后对最终日志表、错误表和 exact flow mapping 执行机械核对。以下数量只指当前中间产物的设计行，不代表实现代码、运行实例或测试结果。

| 自检项 | 期望 | 实际 | 结果 |
|---|---:|---:|---|
| R15.5 candidate cut IDs in final tables | 60 | 60 | pass |
| final structured-log profile rows | 60 | 60 | pass |
| independent event keys | 52 | 52 | pass |
| folded profiles | 8 | 8 | pass; `L-APP-06`, `L-UOW-02`, `L-UOW-04`, `L-PORT-01`, `L-OUT-02`, `L-DIAG-01`, `L-DIAG-05`, `L-DIAG-06` |
| `ApplicationError` final owner rows | 17 | 17 | pass |
| `CapabilityIssueCode` fixed literal rows | 51 | 51 | pass |
| exact Command mapping | 26 | 26 | pass |
| exact Query mapping | 33 | 33 | pass |
| exact Inbound mapping | 6 | 6 | pass |
| exact Outbound mapping | 10 | 10 | pass |
| exact Operations Job mapping | 8 | 8 | pass |
| total exact flow mapping | 83 | 83 | pass |
| missing / extra / duplicate flow IDs | 0 / 0 / 0 | 0 / 0 / 0 | pass |
| Query mapping with UoW write, reserve, capture, audit-write, repair or post-commit cut | 0 | 0 | pass |
| Outbound external status copied into local delivery state | 0 | 0 | pass |
| Job report reconstructed from log / metric / current-truth observation | 0 | 0 | pass |
| `transaction_ref` emitted by a final profile | 0 | 0 | pass; field remains reserved-not-emitted |
| new Rust declaration in R15.6 | 0 | 0 | pass |

### 44.2 Cross-Step source and boundary closure

| 上游 /边界 | R15.6 closure assertion | 结果 |
|---|---|---|
| Step 6 object carriers | identity / registry / descriptor / relation / exposure / traceability / change / impact / capture / report / reference refs remain existing sources; no observability-owned carrier added | pass |
| Step 7 Port and adapter owners | resolver, reference, handoff, collaboration, audit and typed failure owners map to `L-PORT-01..06`; raw external material remains forbidden | pass |
| Step 8 protocol surfaces | API / Worker / Jobs metadata, receipt, result, capture and report refs are only correlated when already formed; no wire schema delta | pass |
| Step 9 exact flows | 83/83 flow IDs map to fixed bundles and preserve phase/order; no recursive flow or observer-as-authority path | pass |
| Step 10 state matrix | logs reuse existing outcome/state categories; no `Observed`, `Logged`, `DeliveredByLog` or other synthetic state | pass |
| Step 11 persistence / UoW | effect write, commit resolution, rollback and recovery read remain local authority; logs cannot prove durability | pass |
| Step 12 errors / issues | all 17 errors and 51 issue literals have a primary owner or folded mapping; raw error text is excluded | pass |
| Step 13 concurrency / idempotency | duplicate, conflict, in-progress, exact reread and unknown outcome preserve no-rerun and no-blind-retry rules | pass |
| Step 14 config / runtime binding | Stage 0~7, four binding states, entry barrier and cleanup profiles are represented without raw config or partial graph exposure | pass |
| L4 observability / audit boundary | only body-free reference / handoff outcome is observed; external telemetry or audit store is not made Hub truth | pass |
| formal document boundary | only this calibration artifact is changed; formal `03-详细设计.md` remains reserved for Step 19 assembly | pass |

### 44.3 R15.6 完成判定

R15.6 的“再写入”目标已满足：60 个候选切口已收敛为最终 structured-log profile；每个 profile 有固定 event key 或明确 folded 归属、mode、level、owner、phase、字段 allowlist、禁止字段和 authority purpose；17/17 error、51/51 issue、83/83 flow 以及特殊分支重复 owner 均已闭合。该完成判定只针对设计中间产物，不代表任何实现、部署、运行、测试或验收事实。

当前仍无 unresolved upstream blocker。`CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` 与 `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` 继续作为 non-blocking cross-repository design debt 保留；本批没有通过日志契约伪造 L0-core 已同步。

## 45. R15.6 stop-review snapshot

| 项目 | 停审状态 |
|---|---|
| 当前正式文档 | `03-详细设计.md`；正式正文未修改，仍等待 Step 19 assembly |
| 当前校准文档 | `03_ddd_step_15_observability_audit.md` |
| 当前完成批次 | `R15.6 structured log cuts:再写入` |
| batch status | `completed_stop_review` |
| final structured-log profiles | 60 rows; 52 independent event keys; 8 folded profiles |
| exact flow closure | 83/83: Command 26, Query 33, Inbound 6, Outbound 10, Job 8 |
| error / issue closure | `ApplicationError` 17/17; `CapabilityIssueCode` 51/51 |
| special branch closure | duplicate / idempotency / Query no-write / commit unknown / rollback / consistency defect / observer failure / capture-vs-collaboration all pass |
| new Rust declaration | 0; no struct, field, enum, variant, payload, trait or callable added or changed |
| upstream blocker | none |
| non-blocking debt | `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001`; `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` |
| implementation artifact | not created; implementation ledger and planned boundary skeleton remain forbidden until `07-实施计划.md` completion |
| claimed implementation / test / evidence / sign-off | none; no run_id, evidence alias or acceptance signature is asserted |
| commit | not requested and not created |

本批完成后停止在 Step 15 的 R15.6 review gate。未经用户明确确认，不进入 R15.7，不修改正式 `03-详细设计.md`，不开始 Step 16，不创建 `04-配置设计.md` 或任何 implementation artifact。

## 46. R15.6 下一批门禁

```text
document = 03-详细设计.md
step = 15
completed_batch = R15.6 structured log cuts:再写入
status = completed_stop_review
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_7
next_batch = R15.7 metric cuts:先思考
allowed_scope_after_confirmation = metric topic candidates, low-cardinality label taxonomy, owner and phase analysis only
must_read_before_next_batch = this file §§35~45; 详细设计讨论流程_SOP.md Step 15; 详细设计书写规范.md §5.14; Step 9 exact flow inventory; Step 12 error/issue mapping; Step 14 config/runtime/binding handoff
forbidden_until_next_gate = final metric table, trace/span contract, audit event table, redaction final table, formal 03 assembly, 04, Step 16+, implementation ledger, planned boundary skeleton, code, tests, run_id, evidence, sign-off, commit
unresolved_upstream_blocker = none
```

R15.7 进入后只允许先思考指标主题、低基数标签和 owner 归属；不得把 structured-log 的 event key 直接当作 metric name，不得把 capability id、request id、trace id、provider identity、raw route、job target 或错误文本作为高基数标签。R15.6 的最终日志表在后续批次中保持只读输入，除非发现真实跨 Step contradiction 并按受控回开流程记录。

## 47. R15.7 授权、输入闭包与问题边界

### 47.1 本批授权与回读结论

用户已明确解除 R15.6 停审门并授权进入 `R15.7 metric cuts:先思考`。本批回读 Step 15 SOP、书写规范 §5.14、真相源标准 §2.14/§2.14-a、本文件 §§35~46、Step 9 exact flow inventory、Step 12 error / issue mapping、Step 13 idempotency / commit resolution 和 Step 14 config / runtime / binding handoff，并只把已经闭合的 owner、phase、typed outcome 和 bounded state 当作指标候选来源。

| 输入 | 本批使用的既有结论 | 本批不得推导 |
|---|---|---|
| R15.6 structured-log profiles | API、application、UoW、Port、Worker、Outbound、Jobs、infra、diagnostic 的事实形成 owner 与 phase | 将 52 个 event key 机械改名为 metric；从日志计数重建业务事实 |
| Step 9 83 exact flows | Command 26、Query 33、Inbound 6、Outbound 10、Job 8 的入口、调用顺序和终止分支 | 新 flow、generic handler、隐式 retry、runtime/tools execution |
| Step 11 / 13 | reserve、stored replay、effect write、commit resolution、rollback、same-authority recovery read | 由 counter 证明 durability；由 elapsed time 推断 `Unknown` 已解决 |
| Step 12 | 17 个 `ApplicationError`、51 个 issue literal 和既有 failure precedence | 从 raw text/status 私造新的 error category 或 retryability |
| Step 14 | Stage 0~7、Configured/DeterministicFake/Disabled/Missing、三类 entry barrier、cleanup owner | raw config、partial graph、provider health truth、backend/exporter 绑定 |
| Step 6~10 | typed outcome、receipt、capture、intent、journal、report、reference/material state | 指标专用 domain object、metric-owned state 或第二套 report |

当前无 unresolved upstream blocker。`CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` 与 `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` 继续作为 non-blocking cross-repository design debt；本批不借指标语义声明 L0-core 已完成正式同步。

### 47.2 本批只思考什么

R15.7 只形成三类审查材料：候选指标主语、候选 instrument type、候选低基数 label taxonomy。它不形成 SOP 所要求的最终指标埋点表，也不固定最终 metric name、suffix、unit、label schema、采集 backend 或实现 facade。

| 本批允许 | 本批禁止 |
|---|---|
| 按 owner / phase 提出 Counter、Histogram、Gauge 候选主语 | 最终 metric name、namespace、版本号、unit suffix 或 exporter 名称 |
| 指出候选插入边界、直接 authority 和不证明的事实 | `ObservabilityPort`、metric trait、macro、facade、第三方 crate 或 Rust 声明 |
| 给出低基数候选 label class 与禁用清单 | capability/request/trace/actor/ref、raw route、provider、target 等高基数 label |
| 用 exact flow set 反查候选主题是否覆盖入口和特殊分支 | 从 counter/log/gauge 生成 receipt、capture、intent、journal、report 或 audit truth |
| 标记 R15.8 必须裁决的合并、保留、拒绝项 | 告警阈值、SLO、dashboard、采样、retention、runbook、backend 配置 |

### 47.3 编辑 token 约束

下文 `MT-*` 全部是 calibration 内部的 **editorial topic token**，只用于审查候选主语是否遗漏或重复。它们不是 Rust identifier、常量、metric name、event key、span name、配置 key 或验收编号；R15.8 不得因 token 已出现而默认保留该候选，也不得直接把 `MT-*` 转写进正式 §14。

## 48. R15.7 指标类型语义与候选主题矩阵

### 48.1 Instrument type 的事实能力

| 类型 | 允许观察 | 不证明 / 不允许 | 候选插入 owner |
|---|---|---|---|
| Counter | 某个既有 owner 边界被触发并形成 closed typed outcome 的次数；process restart 后按 backend 常规重新累计 | 不证明 accepted truth、effect completeness、durability、external delivery、Job report 完整性或 retry eligibility；不得被反向用于业务决策 | entry、application、UoW/infra adapter、Port、Worker、Jobs、runtime builder、diagnostic origin |
| Histogram | 单次 owner 边界从已定义 start 到 terminal observation 的单调时长 | 不测 domain object 内部时间，不把 timeout 当 cancellation，不跨多个 owner 拼接 end-to-end truth，不以 bucket 推断 commit、delivery 或 report 状态 | API/application、Port、Worker、Jobs、infra/UoW adapter；不得放进 domain object |
| Gauge | 直接读取一个已有、bounded、可枚举的 runtime/read/material current state 或其按 closed state 聚合的数量 | 不从 log、Counter、Histogram、错误次数或外部 status 反推；无 exact current-state authority 时必须删除候选，不得新增 metric-owned state | infra binding/barrier、正式 derived/reference/material/report read owner |

所有指标都属于 L1 runtime observation。指标采集失败不得改变原业务返回、UoW、receipt、capture、intent、journal、report、cleanup 顺序或 external collaboration outcome；指标也不得成为 idempotency、recovery、acceptance evidence 或 audit 的输入。

### 48.2 API entry 候选主题（4）

| editorial token | 候选类型 | owner / 插入边界 | 直接 authority | 候选低基数标签 | 不得表达 |
|---|---|---|---|---|---|
| `MT-ENTRY-01` | Counter | API route/schema/metadata admission gate 结束 | Step 8 exact protocol gate | `entry_kind`, `protocol_family`, `outcome`, `error_family` | request/header/body、dynamic route、application 已执行 |
| `MT-ENTRY-02` | Counter | API 向 exact application callable dispatch 前后 | Step 9 entry call order | `entry_kind`, `protocol_family`, `operation_group`, `outcome` | handler 名、flow id、业务 accepted 或 durable |
| `MT-ENTRY-03` | Counter | API caller-visible typed surface 形成 | Step 8 response/error surface | `entry_kind`, `protocol_family`, `outcome`, `error_family` | response body、result ref、transport success 等同业务成功 |
| `MT-ENTRY-04` | Histogram | API 从 admission 后到 observation end | API monotonic observation boundary | `entry_kind`, `protocol_family`, `outcome` | timeout 后 application cancellation、跨 Port/UoW 的拼接时长 |

### 48.3 Application Command / Query 候选主题（5）

| editorial token | 候选类型 | owner / 插入边界 | 直接 authority | 候选低基数标签 | 不得表达 |
|---|---|---|---|---|---|
| `MT-APP-01` | Counter | Command application boundary 返回 typed disposition | exact Command service + result/error surface | `protocol_family`, `operation_group`, `outcome`, `error_family` | truth 数量、effect 数量、commit 未知时的成功 |
| `MT-APP-02` | Histogram | Command service invocation boundary | application monotonic boundary | `operation_group`, `outcome` | domain object clock、外部 handoff 总时长、durability |
| `MT-APP-03` | Counter | Query resolver-first boundary 返回 | exact Query service/view surface | `protocol_family`, `operation_group`, `outcome`, `error_family` | read audit、reserve、repair、missing 自动变 error |
| `MT-APP-04` | Histogram | Query service invocation boundary | application read boundary | `operation_group`, `outcome` | repository write、refresh/rebuild、body visibility |
| `MT-APP-05` | Counter | 仅在 Query 正式 view 已携带 freshness/availability marker 时观察 | typed Query view marker | `operation_group`, `freshness_state`, `outcome` | 由 duration/empty page 推导 freshness；为无 marker Query 补状态 |

`MT-APP-05` 是 freshness observation，不是 Gauge。Query 仍保持 33/33 no-write；它不能更新任何 freshness state，也不能触发 material maintenance。

### 48.4 Idempotency 候选主题（5）

| editorial token | 候选类型 | owner / 插入边界 | 直接 authority | 候选低基数标签 | 不得表达 |
|---|---|---|---|---|---|
| `MT-IDEM-01` | Counter | reserve classification 返回 | Step 13 reservation authority | `operation_group`, `disposition`, `error_family` | key/hash/digest、attempt、winner body、retry 次数 |
| `MT-IDEM-02` | Counter | exact stored result/receipt/report replay 返回 | stored replay authority | `protocol_family`, `operation_group`, `outcome` | 新 mutation、recomputed result、replay payload |
| `MT-IDEM-03` | Counter | same-key different-digest conflict 被 authority 分类 | reservation authority | `protocol_family`, `operation_group`, `outcome` | persisted Conflict state、digest label、security identity |
| `MT-IDEM-04` | Counter | reservation in-progress 被 authority 返回 | reservation authority | `protocol_family`, `operation_group`, `outcome` | wait attempt、lease、timeout-derived retry eligibility |
| `MT-IDEM-05` | Counter | bounded winner read / race resolution 结束 | same-authority exact read | `operation_group`, `outcome`, `error_family` | winner result body、row id、blind retry、second reserve |

`MT-IDEM-01` 与 `MT-IDEM-02..05` 当前是 generic-vs-dedicated 候选关系。R15.8 必须选择单一 emission owner 或明确互斥触发，不能对同一 reserve branch 无条件双计数。

### 48.5 UoW / repository authority 候选主题（7）

| editorial token | 候选类型 | owner / 插入边界 | 直接 authority | 候选低基数标签 | 不得表达 |
|---|---|---|---|---|---|
| `MT-UOW-01` | Counter | local UoW `begin` 返回 | UoW manager | `operation_group`, `outcome`, `error_family` | connection/transaction id、accepted truth |
| `MT-UOW-02` | Counter | authority read/write callable 返回 | named repository/UoW adapter | `operation_group`, `port_family`, `outcome`, `error_family` | SQL、row/body、repository method 名、replica identity |
| `MT-UOW-03` | Counter | declared effect save/append/capture/stored-surface write 返回 | exact Step 7 method + Step 11 effect set | `operation_group`, `material_kind`, `outcome`, `error_family` | staged body、effect count 作为 committed truth、partial success 推断 |
| `MT-UOW-04` | Counter | commit 返回 `Durable` / `NotDurable` / `Unknown` | UoW commit authority | `operation_group`, `outcome`, `error_family` | 把 `Unknown` 合并到 failure/success、log-derived resolution |
| `MT-UOW-05` | Histogram | infra/UoW adapter commit call boundary | monotonic adapter boundary | `operation_group`, `outcome` | elapsed time 证明 durability、transaction ref label |
| `MT-UOW-06` | Counter | rollback 返回或 rollback failed | UoW rollback authority | `operation_group`, `outcome`, `error_family` | rollback success 改写 command success、zero-effect 猜测 |
| `MT-UOW-07` | Counter | barrier / same-authority recovery exact read 返回 | Step 13 recovery procedure | `operation_group`, `outcome`, `error_family` | 从 metric 重建 stored result、blind retry、repair mutation |

### 48.6 External resolver / handoff / collaboration 候选主题（6）

| editorial token | 候选类型 | owner / 插入边界 | 直接 authority | 候选低基数标签 | 不得表达 |
|---|---|---|---|---|---|
| `MT-PORT-01` | Counter | named resolver Port typed return | Step 7 resolver outcome | `port_family`, `adapter_kind`, `source_family`, `outcome`, `error_family` | provider identity、raw status/body、external health truth |
| `MT-PORT-02` | Histogram | resolver Port invocation boundary | named Port monotonic boundary | `port_family`, `adapter_kind`, `source_family`, `outcome` | endpoint、route、retry attempt、caller total duration |
| `MT-PORT-03` | Counter | audit/traceability handoff Port typed return | existing handoff outcome | `handoff_kind`, `adapter_kind`, `outcome`, `error_family` | evidence alias、acceptance signature、external audit persisted claim |
| `MT-PORT-04` | Histogram | handoff Port invocation boundary | named Port monotonic boundary | `handoff_kind`, `adapter_kind`, `outcome` | external document/body、local truth rollback |
| `MT-PORT-05` | Counter | event collaboration Port typed return | existing collaboration outcome | `handoff_kind`, `adapter_kind`, `outcome`, `error_family` | external status 复制为 local delivery state、receipt body |
| `MT-PORT-06` | Histogram | event collaboration Port invocation boundary | named Port monotonic boundary | `handoff_kind`, `adapter_kind`, `outcome` | capture-to-delivery SLO、attempt/target、transport internals |

### 48.7 Worker activation / Inbound 候选主题（6）

| editorial token | 候选类型 | owner / 插入边界 | 直接 authority | 候选低基数标签 | 不得表达 |
|---|---|---|---|---|---|
| `MT-WORKER-01` | Counter | source slot activation / parked decision | Worker binding state | `entry_kind`, `source_slot`, `binding_state`, `outcome` | topic/group/endpoint、provider identity、业务 receipt |
| `MT-WORKER-02` | Counter | header-first schema/trusted-actor admission | Worker exact admission gate | `source_family`, `source_slot`, `disposition`, `error_family` | payload decode on unsupported schema、offset/lease/ack |
| `MT-WORKER-03` | Counter | application consumer typed receipt 返回 | exact Inbound receipt | `source_family`, `source_slot`, `disposition`, `error_family` | Worker 自造 receipt、local delivery state、raw payload |
| `MT-WORKER-04` | Counter | exact capture-ref continuation 返回 | continuation owner | `source_family`, `handoff_kind`, `outcome`, `error_family` | current-source remap、new capture、external success 推断 |
| `MT-WORKER-05` | Counter | stop/drain/join/cleanup terminal observation | Worker task owner | `source_slot`, `lifecycle_state`, `outcome`, `error_family` | task id、lease、process retry、receipt/report 修改 |
| `MT-WORKER-06` | Histogram | Worker 包裹单次 application consumer invocation | Worker monotonic boundary | `source_family`, `source_slot`, `disposition` | transport wait time、cross-message aggregate、application cancellation |

### 48.8 Outbound Phase A / B / C 候选主题（4）

| editorial token | 候选类型 | owner / 插入边界 | 直接 authority | 候选低基数标签 | 不得表达 |
|---|---|---|---|---|---|
| `MT-OUT-01` | Counter | Phase A immutable snapshot/capture 形成并写入 | local capture authority | `operation_group`, `material_kind`, `outcome`, `error_family` | event body、external delivery、capture 等同 commit 前 truth |
| `MT-OUT-02` | Histogram | application Phase A capture formation boundary | application monotonic boundary | `operation_group`, `material_kind`, `outcome` | Phase B/C 总时长、transport route、delivery SLO |
| `MT-OUT-03` | Counter | Phase B 前从 official capture/snapshot authority 加载 | capture repository | `material_kind`, `handoff_kind`, `outcome`, `error_family` | current truth 重建、mapper rerun、capture ref label |
| `MT-OUT-04` | Counter | Phase C local `Captured -> IntentBound` 返回 | local intent-binding authority | `handoff_kind`, `outcome`, `error_family` | external status、本地 Delivered state、回滚 Phase A |

Phase B 的 typed outcome 与时延只由 `MT-PORT-05/06` 候选承接。Phase A、B、C 不得合并为一个“publish success”Counter，也不得用 Phase B status 推进本地 intent 之外的 delivery lifecycle。

### 48.9 Operations Job 候选主题（8）

| editorial token | 候选类型 | owner / 插入边界 | 直接 authority | 候选低基数标签 | 不得表达 |
|---|---|---|---|---|---|
| `MT-JOB-01` | Counter | Jobs metadata/input admission 结束 | exact Job input contract | `entry_kind`, `job_kind`, `outcome`, `error_family` | raw input、run ref、scheduler identity、attempt |
| `MT-JOB-02` | Counter | Jobs 向 application Job callable dispatch / guarded completion | Step 14 runner ownership | `job_kind`, `lifecycle_state`, `outcome`, `error_family` | second invocation、caller cancellation、report reconstruction |
| `MT-JOB-03` | Counter | deterministic plan / initial reservation 返回 | durable journal authority | `job_kind`, `disposition`, `error_family` | target ordinal/id、plan body、counter 作为 journal |
| `MT-JOB-04` | Counter | one target durable terminalization 或保持 Planned | exact target journal/effect authority | `job_kind`, `disposition`, `error_family` | target identity、normal failure 掩盖 control-plane defect、自动 retry |
| `MT-JOB-05` | Counter | pure finalization / typed report-result assembly 返回 | durable all-terminal journal + result store | `job_kind`, `disposition`, `error_family` | 从 logs/counters/current truth 生成 report、报告 item body |
| `MT-JOB-06` | Histogram | Jobs runner 包裹一次 application Job invocation | Jobs monotonic boundary | `job_kind`, `disposition` | host schedule latency、target ordinal、跨 retry 聚合 |
| `MT-JOB-07` | Counter | runtime result delivery、drain、join、cleanup | owned task/process delivery authority | `job_kind`, `lifecycle_state`, `outcome`, `error_family` | 修改 journal/report disposition、host retry authorization |
| `MT-JOB-08` | Counter | pre-dispatch / post-dispatch deadline observation | Step 14 non-cancelling deadline procedure | `job_kind`, `lifecycle_state`, `outcome` | timeout 等同 cancellation、attempt、detached invocation |

### 48.10 Infra config / runtime assembly 候选主题（6）

| editorial token | 候选类型 | owner / 插入边界 | 直接 authority | 候选低基数标签 | 不得表达 |
|---|---|---|---|---|---|
| `MT-INFRA-01` | Counter | config parse/validation 完成 | typed config validator | `entry_kind`, `outcome`, `error_family` | config key/value、secret、endpoint、profile body |
| `MT-INFRA-02` | Counter | runtime builder Stage 0~7 单阶段返回 | Step 14 stage owner | `entry_kind`, `stage`, `outcome`, `error_family` | partial graph body、fallback、business protocol outcome |
| `MT-INFRA-03` | Histogram | 单个 runtime builder stage boundary | infra monotonic boundary | `entry_kind`, `stage`, `outcome` | 多 stage 拼接 SLO、dependency endpoint、raw failure |
| `MT-INFRA-04` | Gauge | 直接读取 closed binding slot current state | existing Configured/Fake/Disabled/Missing binding | `entry_kind`, `port_family`, `binding_state` | provider identity/health、从 startup error counter 推导 state |
| `MT-INFRA-05` | Gauge | 直接读取 API/Worker/Jobs complete entry barrier | existing complete predicate | `entry_kind`, `lifecycle_state` | partial graph 暴露、listener/task id、protocol availability 猜测 |
| `MT-INFRA-06` | Counter | Stage 0~7 partial-prefix disposal / startup cleanup 返回 | exact infra startup cleanup owner | `entry_kind`, `stage`, `outcome`, `error_family` | cleanup success 改写 startup success、Worker/Jobs shutdown混入、resource/secret dump |

### 48.11 Derived material / reference / report 候选主题（5）

| editorial token | 候选类型 | owner / 插入边界 | 直接 authority | 候选低基数标签 | 不得表达 |
|---|---|---|---|---|---|
| `MT-MAT-01` | Gauge candidate | official material current read 按 closed freshness state 聚合 | derived material repository/view state；exact bounded refresh尚待证明 | `material_kind`, `freshness_state` | 从 Query 次数推导、material 当 capability truth、individual ref；无一致读取则不得保留 |
| `MT-MAT-02` | Gauge candidate | official reference current read 按 existing resolution/freshness state 聚合 | reference state authority；exact bounded refresh尚待证明 | `source_family`, `source_slot`, `freshness_state` | resolver health、external body、reference id/provider label；无一致读取则不得保留 |
| `MT-MAT-03` | Gauge candidate | latest official durable report/result index 直接暴露的 closed availability/freshness | durable journal/report/result read surface；current index尚待证明 | `job_kind`, `freshness_state` | 从 Job counters/logs生成 report；无 exact bounded source 时不得保留该 Gauge |
| `MT-MAT-04` | Counter | maintenance target/report typed completion | existing Job/material owner | `job_kind`, `material_kind`, `disposition`, `error_family` | core truth repair、finding body、target ordinal、report reconstruction |
| `MT-MAT-05` | Histogram | application maintenance item 或 report finalization owner boundary | maintenance monotonic boundary | `job_kind`, `material_kind`, `disposition` | whole scheduler latency、target id、derived duration 证明 freshness |

`MT-MAT-01..03` 的保留条件均尚未满足。现有 material/reference repository 提供 exact read 或分页 scan，report repository 提供 immutable history page，但本批没有证据证明跨页聚合是一个一致、bounded 的 current-state authority。R15.8 必须逐项回指既有一致读取/刷新 owner；若只能扫描非一致历史页、读取 counter/log、沿用旧值或新增状态，就必须删除对应 Gauge candidate，而不是回开 Step 6 发明 metric carrier。

### 48.12 Diagnostic / redaction / observer failure 候选主题（3）

| editorial token | 候选类型 | owner / 插入边界 | 直接 authority | 候选低基数标签 | 不得表达 |
|---|---|---|---|---|---|
| `MT-DIAG-01` | Counter | existing `ApplicationError` / issue mapping 完成 | originating error owner | `operation_group`, `error_family`, `outcome` | issue text、raw cause、stack trace、subject/ref label |
| `MT-DIAG-02` | Counter | forbidden material / redaction invariant violation 被既有 gate 识别 | redaction gate + existing issue | `protocol_family`, `error_family`, `source_family` | leaked value、field name from untrusted body、evidence alias |
| `MT-DIAG-03` | Counter | metric/log observer sink 返回 failure，且 non-recursive fallback 可用 | existing observer caller boundary | `entry_kind`, `adapter_kind`, `error_family` | recursive self-instrumentation、业务 rollback、原 outcome 改写 |

候选池共 `59` 个 editorial topic：Counter 主题观察既有边界发生次数，Histogram 主题只观察明确 owner boundary 的时延，Gauge 主题必须直接读取已有 bounded state。这个数量是 R15.7 的审查输入，不是最终指标数量；R15.8 可以合并或拒绝候选，但必须记录原因并维持覆盖。

## 49. R15.7 低基数标签分类与禁止标签

### 49.1 允许进入 R15.8 复核的 label class

| candidate label class | 候选来源 | 基数边界 | R15.8 必须固定的事项 |
|---|---|---|---|
| `entry_kind` | API / Worker / Jobs 三类 composition entry | closed 3 | exact spelling；不得使用 binary/listener/task name |
| `protocol_family` | Command / Query / Inbound / Outbound / Job | closed 5 | 哪些 metric family 需要该 label，避免无意义乘积 |
| `operation_group` | identity、registry、descriptor、governance seam、method relation、exposure、traceability/impact、reference、consumer view、derived material 等既有 flow family | 必须固定 finite map | 83 flow -> group 的 total mapping；不得用 exact operation/handler/flow name |
| `outcome` / `disposition` | Step 8/9/12 已有 typed result 的 metric-specific subset | 每个 metric 单独 closed | 不创建跨协议巨型 union；normal missing、Degraded、Unknown 等语义不得折叠 |
| `error_family` | 17 个 `ApplicationError` 与 51 issue 的 deterministic low-cardinality mapping | finite mapping | 保留 `CommitOutcomeUnknown`、rollback failed、`ConsistencyDefect`、redaction、observer failure 的独立语义 |
| `port_family` / `adapter_kind` | Step 7/14 named Port 与 closed binding adapter kind | finite | 不得退化为 concrete type、crate path、provider 或 endpoint |
| `source_family` / `source_slot` | 6 个 Inbound source slot 和既有 external reference family | finite | exact closed value set；不得使用 topic、subscription、provider identity |
| `binding_state` | Configured / DeterministicFake / Disabled / Missing | closed 4 | 使用 Step 14 exact semantic，不另增 Unhealthy/Unknown |
| `stage` | runtime builder Stage 0~7 | closed 8 | exact stage mapping；不得放 function/file/module 名 |
| `lifecycle_state` | 已存在的 entry/task/job bounded runtime state | metric-specific finite subset | 不得为了 Gauge 发明新 persisted state；不同 owner 不强行共用一套值 |
| `freshness_state` | 已有 view/material/reference/report typed state | metric-specific finite subset | 无正式 marker 时不得填 inferred/default freshness |
| `job_kind` | 8 个 Operations Job exact kind | closed 8 | 使用 public kind，不使用 run ref、target 或 scheduler job name |
| `handoff_kind` | governance/audit/traceability/event collaboration 的既有 closed family | finite | local handoff request、external invocation、event collaboration 不得混义 |
| `material_kind` | controlled view、directory projection、audit-friendly export、ecosystem discovery、reconciliation/capture 等既有 closed family的适用子集 | metric-specific finite subset | 不得将 body type、document kind 或 arbitrary report name 放入 label |

以上是 label class 候选，不是最终 label schema。R15.8 必须对每个保留指标给出固定 label set 和 closed values 来源；不能以“可选 label”让同一 metric family 在不同调用点任意增减标签。

### 49.2 一律禁止作为 metric label 的材料

| 禁止类别 | 禁止示例 | 原因 |
|---|---|---|
| 业务 / 协议 identity 与 ref | capability/subject/request/trace/actor/result/receipt/report/capture/intent/transaction ref | 高基数、关联信息或事实载体；定位应走 structured log / trace / typed record |
| 调用实现 identity | `flow_id`、exact operation name、handler/function/type/file/crate 名、dynamic route | 基数随实现演化，且会泄露内部组织；使用 closed family label |
| 幂等 / 完整性材料 | raw idempotency key、key hash/fingerprint、digest、canonical bytes、attempt、target ordinal/id | 敏感或高基数；Counter 也不能成为 replay / retry authority |
| transport / provider 材料 | provider identity、endpoint、host、topic、partition、offset、lease、ack、scheduler run id | 外部正文或部署细节，不属于 Hub 指标 taxonomy |
| raw failure / payload | raw error/status/code/body、stack trace、SQL、request/response/event body、method/document body | 违反 typed failure、redaction 与 body-free 边界 |
| secret / credential | token、secret、credential、TLS/KMS/Vault material、raw config value | 安全边界绝对禁止 |
| 验收 / evidence 材料 | evidence alias、acceptance signature、sign-off、test/run id | 指标不是验收证据或签署载体 |
| 自由文本 | reason/message/description、provider label、user-supplied enum-like string | 无界基数且可能泄露正文；必须映射到既有 closed type |

`transaction_ref` 在 R15.6 中仍是 reserved-not-emitted；本批不因 Histogram 或 commit Counter 引入该字段，更不允许它成为 label。

### 49.3 Label product 与 emission 规则

1. 每个最终指标只保留回答该主语所必需的 label；不得把本节全部候选 class 叠加到每个指标。
2. `outcome`、`disposition`、`error_family` 必须由同一 typed authority 一次映射；禁止从 error text、status 或 duration 二次分类。
3. 同一 metric name 的 label key 集必须固定；不允许 success 少一个 label、failure 临时增加 raw error label。
4. Counter 的一次 emission 必须落在唯一 owner；entry 和 application 可以分别观察各自边界，但不得声称两者数值可作为 accepted/durable 一致性证明。
5. Histogram 的 start/end 必须属于同一 owner 和同一 invocation；timeout、cancellation、continued ownership 必须使用既有 typed outcome，而不是由 elapsed value推断。
6. Gauge 只能由直接 current-state read 刷新；状态 unavailable 时按 R15.8 固定的“停止发射 / 显式 unavailable state”规则处理，不得沿用缓存计数假装 current。
7. Gauge 如使用 one-hot series，必须固定清零和刷新所有 closed state 的规则；如使用按状态聚合数量，必须证明 bounded scan/read owner 和一致性口径。
8. metric backend、scrape interval、bucket、threshold、retention 和 dashboard 不在本 Step 决定；这些参数不得反向改变代码 owner 或 label taxonomy。

## 50. R15.7 83-flow 与 owner 反向覆盖

### 50.1 覆盖 bundle（编辑缩写）

以下 bundle 仅用于本节核对候选主题，不是最终 metric family 或实现 facade。`conditional` 表示只有 exact flow 的既有分支实际调用该 owner 时才观察；不得为了满足覆盖而新增 Port、write、capture、handoff 或 maintenance 调用。

| bundle | candidate topic expansion | 语义边界 |
|---|---|---|
| `M-CMD` | `MT-ENTRY-01..04` + `MT-APP-01/02` + `MT-IDEM-01` and one mutually classified `MT-IDEM-02..05` branch + `MT-UOW-01/03/04/05`; conditional `MT-UOW-02/06/07`, `MT-PORT-01/02`, `MT-OUT-01/02`, `MT-PORT-03/04` | Command 入口、application disposition、reserve、effect/commit 与 exact resolver/handoff；不以 Counter 证明 accepted/durable |
| `M-QUERY` | `MT-ENTRY-01..04` + `MT-APP-03/04`; conditional `MT-APP-05`, `MT-UOW-02`, `MT-PORT-01/02` | Query application completion 与 read/freshness observation；严格 no UoW begin/write/commit/reserve/capture/repair |
| `M-IN` | `MT-WORKER-01..03/06` + application typed outcome; conditional `MT-IDEM-01/02`, `MT-UOW-01..05`, `MT-PORT-01/02`, `MT-OUT-01/02`, `MT-WORKER-04/05` | header-first admission、typed receipt、declared local effect/capture、continuation；Worker 不创建 receipt |
| `M-OUT` | `MT-OUT-01..04` + `MT-UOW-01/03/04/05` + `MT-PORT-05/06`; conditional `MT-UOW-02/06/07`, `MT-WORKER-04/05` | Phase A capture、official load、Phase B typed collaboration、Phase C intent bind；不形成 local delivery lifecycle |
| `M-JOB` | `MT-JOB-01..08` + `MT-IDEM-01` and one mutually classified `MT-IDEM-02..05` branch + `MT-UOW-01/03/04/05` + `MT-MAT-04/05`; conditional `MT-UOW-02/06/07`, `MT-OUT-01/03/04`, `MT-PORT-01..06` | admission、plan、target、finalization、runner ownership、maintenance / collaboration；report 只来自 durable journal/result authority |

### 50.2 Command 26/26 exact coverage

| operation group | exact IDs | base candidate coverage | exact conditional owner | 禁止的指标解释 |
|---|---|---|---|---|
| capability identity / review | `C01..C04` | `M-CMD` | identity/review resolver=`MT-PORT-01/02`; changed capture=`MT-OUT-01/02` | identity 数量、review 指标不得解释为治理 approval |
| registry | `C05..C08` | `M-CMD` | winner read=`MT-IDEM-05`; changed capture=`MT-OUT-01/02` | registry accepted 不代表 runtime allow、marketplace listing 或 execution readiness |
| adapter descriptor | `C09..C12` | `M-CMD` | resolver=`MT-PORT-01/02`; redaction violation=`MT-DIAG-02`; changed capture=`MT-OUT-01/02` | descriptor / secret safe summary 指标不包含 provider body、secret 或 health truth |
| governance seam relation | `C13..C15` | `M-CMD` | resolver=`MT-PORT-01/02`; changed capture=`MT-OUT-01/02`; `C13/C14/C15` audit handoff count=`0` | relation outcome 不等于 governance approval；只有 `C23` 可进入 traceability audit handoff |
| method relation | `C16..C17` | `M-CMD` | method resolver=`MT-PORT-01/02`; changed capture=`MT-OUT-01/02` | 不计 method execution、body、library lifecycle 或 runtime revoke |
| formal exposure | `C18..C21` | `M-CMD` | prerequisite resolver=`MT-PORT-01/02`; changed capture=`MT-OUT-01/02` | exposure / visibility 指标不等于 runtime authorization、SDK publish 或 listing |
| traceability / impact / handoff | `C22..C23` | `M-CMD` | `C22` capture=`MT-OUT-01/02`; `C23` traceability handoff=`MT-PORT-03/04` | impact 不等于 execution/billing；handoff 不产生 evidence/sign-off |
| reference / external document / consumer | `C24..C26` | `M-CMD` | resolver=`MT-PORT-01/02`; redaction=`MT-DIAG-02`; changed capture=`MT-OUT-01/02` | 不计 external body、runtime/tools invocation、SDK client 或 marketplace state |

`C01..C26` exact set 的并集为 26，交集重复只表示共享候选 owner，不表示同一个 flow 被计为两个 operation group。R15.8 必须给出 26 -> closed `operation_group` total map；不得使用 exact command / handler / flow name 作为 label。

### 50.3 Query 33/33 exact coverage

| query surface group | exact IDs | base candidate coverage | typed state / resolver conditional | no-write assertion |
|---|---|---|---|---|
| identity / review | `Q01..Q03` | `M-QUERY` | resolver=`MT-PORT-01/02`; only declared freshness marker may use `MT-APP-05` | no reserve/UoW write/capture/audit/repair |
| registry | `Q04..Q06` | `M-QUERY` | resolver/read=`MT-PORT-01/02` or `MT-UOW-02` according to exact owner | empty/missing/NotVisible does not trigger refresh or issue write |
| descriptor | `Q07..Q10` | `M-QUERY` | resolver=`MT-PORT-01/02`; redaction violation=`MT-DIAG-02` | no provider read-through, secret probe or descriptor reconstruction |
| governance seam | `Q11..Q12` | `M-QUERY` | typed Degraded/optional absence at existing resolver | no governance invocation, approval audit or handoff |
| method relation | `Q13..Q14` | `M-QUERY` | relation resolver/read owner only | no method body/execution or relation mutation |
| exposure / controlled consumption | `Q15..Q19` | `M-QUERY` | formal view freshness/availability may use `MT-APP-05`; resolver=`MT-PORT-01/02` | no exposure transition, runtime/tools call, SDK generation or view rebuild |
| trace / impact / handoff summary | `Q20..Q23` | `M-QUERY` | typed Partial/HandoffPending/Delayed/Unavailable remain outcome categories | no trace append, impact mutation, handoff retry, evidence or audit-body read |
| directory / export / ecosystem / report | `Q24..Q28` | `M-QUERY` | material freshness=`MT-APP-05`; official read state may feed `MT-MAT-01/03` only at bounded owner | no projection rebuild, report reconstruction or automatic truth repair |
| reference / consumer union / observability reference | `Q29..Q33` | `M-QUERY` | reference freshness=`MT-APP-05`; bounded state may feed `MT-MAT-02`; resolver=`MT-PORT-01/02` | no reference refresh, runtime/tools invocation, SDK publish or audit handoff |

`Q01..Q33` 由 `M-QUERY` 全覆盖，且 `MT-UOW-01/03/04/05/06/07`、`MT-IDEM-*`、`MT-OUT-*`、`MT-JOB-*` 在 Query mapping 中均为 0。Gauge 只能由独立 official read owner 刷新，不能由 Query handler 在读路径写状态。

### 50.4 Inbound 6/6 exact coverage

| exact ID | base candidate coverage | conditional owner / state | 禁止的指标解释 |
|---|---|---|---|
| `I01` | `M-IN` | governance-result resolver=`MT-PORT-01/02`; changed capture=`MT-OUT-01/02`; receipt/continuation=`MT-WORKER-03/04` | reference changed 不等于 governance approval/policy truth |
| `I02` | `M-IN` | method-asset resolver=`MT-PORT-01/02`; changed capture=`MT-OUT-01/02` | 不计 method body/source/execution 或自动 Command |
| `I03` | `M-IN` | durable impact append=`MT-UOW-03/04`; capture 仅在 exact declared impact event 存在时使用 `MT-OUT-01/02` | payload 的 Delayed/Unavailable 不自动成为 retry/error |
| `I04` | `M-IN` | external source resolver=`MT-PORT-01/02`; changed capture=`MT-OUT-01/02` | 不使用 provider、MCP/A2A/API body、credential 或 runtime integration label |
| `I05` | `M-IN` | audit reference resolver=`MT-PORT-01/02`; redaction violation=`MT-DIAG-02`; changed capture=`MT-OUT-01/02` | 不计 raw telemetry/audit body、evidence alias 或 handoff success |
| `I06` | `M-IN` | document resolver=`MT-PORT-01/02`; changed capture=`MT-OUT-01/02` | 不计 document/OpenAPI/schema body 或自动 support attach |

所有 Inbound 使用 closed `source_slot/source_family`，不使用 consumer handler、topic、offset、lease、ack 或 event identity。`Accepted`、`Ignored`、`DuplicateReplayed`、`Delayed`、`Rejected`、`Quarantined`、`UnsupportedSchema` 必须在 R15.8 形成 metric-specific closed disposition map。

### 50.5 Outbound 10/10 exact coverage

| exact IDs | source family | base candidate coverage | 三阶段不变量 |
|---|---|---|---|
| `O01..O03` | identity / registry / descriptor change | `M-OUT` | Phase A source/capture、Phase B typed collaboration、Phase C local intent bind 各有独立 owner；descriptor body 永不进入 label |
| `O04..O06` | governance seam / method relation / formal exposure change | `M-OUT` | external outcome 不等于 governance approval、method lifecycle、runtime authorization、SDK publish 或 listing |
| `O07..O08` | controlled view availability / impact identified | `M-OUT` | view/impact source revision是 exact authority；不得从 current view或downstream execution重建 |
| `O09..O10` | derived material / reference resolution change | `M-OUT` | only closed material/reference family；不得把 resolver response、report body或external status复制为local delivery state |

`O01..O10` 的 Phase B 只使用 `MT-PORT-05/06`；`Candidate`、`PendingDelivery`、`Delivered` 等 typed outcome 是外部协作 observation，不是 Hub 持久化 delivery lifecycle。Phase C `MT-OUT-04` 只观察既有 `Captured -> IntentBound` authority，不能由 Phase B Counter 推导。

### 50.6 Operations Job 8/8 exact coverage

| exact ID | maintenance / collaboration subject | base candidate coverage | final authority / 禁止推导 |
|---|---|---|---|
| `J01` | capability registry reconciliation | `M-JOB` + `MT-MAT-04/05` | report 来自 frozen journal；不自动 repair registry，不从 finding Counter 重建 report |
| `J02` | controlled consumer view refresh | `M-JOB` + `MT-MAT-04/05` + conditional `MT-OUT-01` | exact view revision/unchanged target；不改 formal exposure，不持久化 intermediate Rebuilding |
| `J03` | directory projection rebuild | `M-JOB` + `MT-MAT-04/05` + conditional `MT-OUT-01` | projection revision/unchanged target；不 backfill registry/descriptor/exposure |
| `J04` | audit-friendly export summary | `M-JOB` + `MT-MAT-04/05` + conditional `MT-OUT-01` | summary/allowed refs only；无 raw telemetry、evidence alias、signature |
| `J05` | read-only ecosystem discovery summary | `M-JOB` + `MT-MAT-04/05` + conditional `MT-OUT-01` | read-only summary；无 marketplace listing/ranking/pricing/transaction |
| `J06` | derived material reconciliation | `M-JOB` + `MT-MAT-04/05` | report state 不是自动 nested Job、repair 或 core truth mutation |
| `J07` | external reference resolution refresh | `M-JOB` + `MT-PORT-01/02` + `MT-MAT-02/04/05` + conditional `MT-OUT-01` | canonical reference state only；resolver status 不成为 provider health，不 reopen terminal state |
| `J08` | access-event collaboration repair | `M-JOB` + `MT-OUT-03/04` + `MT-PORT-05/06` | frozen capture/intent + journal/report；不 rerun mapper、读 current source 或创建 new capture/intent |

`J01..J08` 的 Counter / Histogram 只观察 admission、plan、target、finalization、runner 和 maintenance owner。任何 Job report/result 仍只能由 durable journal/report/result store 形成；metric value、log count、current truth scan 或 external status 均不能作为 report item source。

### 50.7 Non-flow owner 反向覆盖

| owner / phase | candidate topics | existing source | 反向覆盖结论 |
|---|---|---|---|
| API entry admission/dispatch/completion | `MT-ENTRY-01..04` | Step 8/9 + Step 14 non-cancelling entry | covered；与 application/UoW truth 分离 |
| application Command/Query | `MT-APP-01..05` | exact service and typed surface | covered；Query no-write |
| idempotency/replay/race | `MT-IDEM-01..05` | reservation + stored replay + exact winner read | covered；R15.8 待消除 generic/dedicated double count |
| local UoW/repository | `MT-UOW-01..07` | begin/effect/commit/rollback/recovery authority | covered；Unknown 独立 |
| external resolver/handoff/collaboration | `MT-PORT-01..06` | 9 external Port / 14 callable | covered；typed outcome only |
| Worker activation/admission/receipt/continuation/shutdown | `MT-WORKER-01..06` | 6 source slots + task owner | covered；transport private state excluded |
| Outbound Phase A/B/C | `MT-OUT-01..04` + `MT-PORT-05/06` | capture repository + collaboration Port + intent authority | covered；external/local state separation |
| Jobs admission/plan/target/final/runtime | `MT-JOB-01..08` | 8 Job contracts + owned runner | covered；journal/report/runtime signal separation |
| config / Stage 0~7 / binding / barrier / cleanup | `MT-INFRA-01..06` | Step 14 typed config and runtime builder | covered；raw config and partial graph excluded |
| material/reference/report freshness and maintenance | `MT-MAT-01..05` | official read + Job owner | candidate covered；`MT-MAT-01..03` exact bounded current-state source must each be proven or removed |
| error/redaction/observer sink | `MT-DIAG-01..03` | existing error/issue/redaction/observer owner | covered；no recursive observer or raw cause |

### 50.8 特殊语义与重复 owner 审计

| special branch | candidate observation | 必须保留 | 禁止折叠 / 重复 | R15.7 result |
|---|---|---|---|---|
| duplicate replay | `MT-IDEM-02` + caller boundary outcome | exact stored replay、no rerun | 与 `MT-IDEM-01` 对同一 branch 双计数；effect/capture/Port/Job target emission | pass as candidate；R15.8 必须定唯一 emission rule |
| idempotency conflict | `MT-IDEM-03` | same-key mismatch classification，不持久化 Conflict state | key/hash/digest/attempt label；普通 validation failure | pass |
| idempotency in-progress | `MT-IDEM-04` | active reservation authority | timeout/retry lifecycle、second reserve、lease label | pass |
| Query no-write | `MT-ENTRY-*` + `MT-APP-03..05` + conditional read/Port | Visible/NotVisible/Degraded/technical failure | `MT-UOW-01/03..07`、`MT-IDEM-*`、`MT-OUT-*`、audit/repair emission | pass; 33/33 no-write |
| `CommitOutcomeUnknown` | `MT-UOW-04` with independent outcome；recovery=`MT-UOW-07` | durable result remains unknown until authority proves resolution | merge into normal failure/success、elapsed-time resolution、blind retry | pass |
| rollback succeeded / failed | `MT-UOW-06` closed outcome | original failure and recovery outcome remain separately interpretable | rollback success as business success；rollback failure as ordinary operation failure | pass |
| `ConsistencyDefect` | `MT-DIAG-01` with dedicated `error_family` candidate | invariant contradiction and exact owner | degraded/missing/adapter unavailable、automatic repair | pass |
| redaction violation | `MT-DIAG-02` | violation occurrence without leaked value | raw field/value/body、normal validation failure | pass |
| observer sink failure | `MT-DIAG-03` only with non-recursive path | original business outcome and cleanup unchanged | recursive self-count、rollback、caller error overwrite | pass |
| external collaboration status | `MT-PORT-05/06` | typed external observation | local Delivered/Pending state、Phase C intent state | pass |
| local intent bind | `MT-OUT-04` | exact local `Captured -> IntentBound` authority | external success inference、capture recreation | pass |
| Job report/final result | `MT-JOB-05` observes finalization only | durable journal/report/result remains source | logs/counters/Gauge/current truth reconstruction | pass |
| Gauge refresh failure | candidate owner stops or emits only a predeclared unavailable state | direct bounded current-state authority | last Counter value、log scan、default Healthy/Fresh | pass as rule; final behavior待 R15.8 |

## 51. SOP 五问增量回答与 R15.8 未决项

### 51.1 SOP 五问的本批增量

| SOP 问题 | R15.7 增量结论 | 本批未越界项 |
|---|---|---|
| 哪些处理流必须记录审计？ | 本批不改变 R15.4 的 business fact / audit 边界；Counter、Histogram、Gauge 均不是 audit event。 | 审计事件仍留 R15.11/R15.12；未由 metric 生成 accepted fact。 |
| 哪些错误分支必须记录日志？ | R15.6 的 17/17 error、51/51 issue structured-log owner保持只读；指标只候选聚合 closed `error_family`。 | 未改 event key、level、log fields 或 error precedence。 |
| 哪些关键路径需要指标？ | 已形成 59 个 editorial candidates，覆盖 API/application/idempotency/UoW/Port/Worker/Outbound/Job/infra/material/diagnostic 十一组 owner。 | 尚未固定最终 metric name、label schema 或 emission count。 |
| 日志、指标、审计字段分别记录什么？ | metric 只允许 metric-specific low-cardinality labels；单记录 ref 和排障上下文继续留 structured log / trace / typed record。 | 未把 ref、body、secret、evidence 或 external status 放入 label。 |
| 哪些监控和告警细节应留给运维手册？ | bucket、threshold、SLO、dashboard、backend/exporter、scrape、retention、pager 和 runbook继续后移。 | 未写任何生产阈值、告警规则或 backend 绑定。 |

### 51.2 R15.8 必须逐项裁决

| decision id | R15.8 必须输出的裁决 | 通过条件 |
|---|---|---|
| `MD-01` | 59 个候选逐项 keep / merge / reject | 每项有理由，删除后不破坏 83-flow / owner coverage |
| `MD-02` | 最终 backend-neutral metric identifier、instrument type 与 unit semantic | name 不复用 log event key；Counter/Histogram/Gauge 类型与 §48.1 一致 |
| `MD-03` | exact insertion point、start/end、emission trigger 和唯一 owner | 同一事实不被 generic/dedicated topic无条件双计数；observer failure不递归 |
| `MD-04` | 每个最终 metric 的固定 label keys 与 closed value source | 不存在 optional/dynamic label；禁止表命中为 0 |
| `MD-05` | 83 exact flow -> final metric family / no-metric exception map | Command 26、Query 33、Inbound 6、Outbound 10、Job 8 exact set均闭合 |
| `MD-06` | 17 errors + 51 issue -> closed `error_family` map或明确无指标例外 | `CommitOutcomeUnknown`、rollback failed、`ConsistencyDefect`、redaction、observer failure保持可区分 |
| `MD-07` | idempotency generic / dedicated Counter合并与互斥规则 | reserve、replay、conflict、in-progress、winner-read每 branch一次且不触发 mutation metric |
| `MD-08` | Outbound Phase A/B/C 与 handoff/collaboration metric separation | external status不复制local state；capture/load/bind不由 collaboration Counter推导 |
| `MD-09` | Gauge 的 exact bounded read owner、refresh semantics 和 stale/unavailable行为 | `MT-MAT-01..03` source逐项不成立则删除；不得新增 domain/Rust state |
| `MD-10` | Query no-write、Job durable-report-only、commit unknown/rollback特殊断言 | final table可直接交给实现者，不依赖日志、Counter或解释性猜测 |

R15.8 只允许完成最终指标埋点表与标签规则，不自动进入 trace/span；若 `MD-05`、`MD-06` 或 `MD-09` 暴露真实上游 contract 缺口，必须先登记受控回开或 blocker，而不是用新 metric carrier 补洞。

## 52. R15.7 自检与 stop-review snapshot

### 52.1 机械与语义自检

| 自检项 | 期望 | 实际 | 结果 |
|---|---:|---:|---|
| editorial metric candidates | 59 | 59 | pass |
| Counter / Histogram / Gauge candidates | `42 / 12 / 5` | `42 / 12 / 5` | pass |
| owner groups | 11 | 11 | pass; entry, application, idempotency, UoW, Port, Worker, Outbound, Job, infra, material, diagnostic |
| exact Command coverage | 26 | 26 | pass |
| exact Query coverage | 33 | 33 | pass |
| exact Inbound coverage | 6 | 6 | pass |
| exact Outbound coverage | 10 | 10 | pass |
| exact Job coverage | 8 | 8 | pass |
| total exact flow coverage | 83 | 83 | pass |
| Query candidate mapping with write/reserve/capture/repair metric | 0 | 0 | pass |
| forbidden identity/ref/body/secret labels admitted | 0 | 0 | pass |
| final metric names fixed | 0 | 0 | pass; reserved for R15.8 |
| metric backend / threshold / bucket / SLO fixed | 0 | 0 | pass; out of Step scope |
| new Rust declaration / structure comment delta | 0 | 0 | pass; no struct, field, enum, variant, trait or callable introduced |

### 52.2 Cross-Step boundary check

| boundary | R15.7 check | result |
|---|---|---|
| capability identity / registry / descriptor | only operation/material families are candidate labels；no id/provider/body | pass |
| governance seam / method relation | handoff/resolver observation remains separate from approval/method truth | pass |
| SDK / runtime / tools / marketplace | only controlled consumer/ref/material availability surfaces observed；no execution/listing/publish truth | pass |
| UoW / idempotency | metric does not prove durability or replay body；Unknown/rollback/winner read remain authority-owned | pass |
| Outbound collaboration | Phase A/B/C separated；external status not local delivery state | pass |
| Job | report/result source remains durable journal/store；metric is observation only | pass |
| observability/audit | no external audit body, evidence alias or acceptance signature；no `ObservabilityPort` | pass |
| config/runtime | Stage 0~7 and four binding states reused；no raw config/partial graph/backend binding | pass |
| historical material | provider/cost/runtime execution/marketplace/governance approval mainline not reintroduced | pass |

### 52.3 Stop-review snapshot

| 项目 | 停审状态 |
|---|---|
| 当前正式文档 | `03-详细设计.md`;正式正文未修改，仍等待 Step 19 assembly |
| 当前校准文档 | `03_ddd_step_15_observability_audit.md` |
| 当前完成批次 | `R15.7 metric cuts:先思考` |
| batch status | `completed_stop_review` |
| candidate topics | 59 editorial tokens: 42 Counter, 12 Histogram, 5 Gauge |
| exact flow closure | 83/83: Command 26, Query 33, Inbound 6, Outbound 10, Job 8 |
| special semantics | Query no-write、idempotency、commit unknown、rollback、consistency、redaction、observer failure、Outbound Phase A/B/C、Job report均已形成 R15.8 gate |
| final metric table / name | not created / not fixed; reserved for R15.8 |
| new Rust declaration / comment delta | 0;结构体注释无新增遗漏 |
| upstream blocker | none |
| non-blocking debt | `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001`; `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` |
| implementation artifact | not created; implementation ledger and planned boundary skeleton remain forbidden until `07-实施计划.md` completion |
| claimed implementation / test / evidence / sign-off | none; no run_id, evidence alias or acceptance signature is asserted |
| commit | not requested and not created |

本批完成后停止在 Step 15 的 R15.7 review gate。未经用户明确确认，不进入 R15.8，不修改正式 `03-详细设计.md`，不开始 Step 16，不创建 `04-配置设计.md` 或任何 implementation artifact。

## 53. R15.7 下一批门禁

```text
document = 03-详细设计.md
step = 15
completed_batch = R15.7 metric cuts:先思考
status = completed_stop_review
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_8
next_batch = R15.8 metric cuts:再写入
allowed_scope_after_confirmation = final metric keep/merge/reject decisions, backend-neutral metric names, instrument types, insertion points, fixed low-cardinality label sets, exact flow/error coverage and special-branch emission rules
must_read_before_next_batch = this file §§47~52 and §§35~46; 详细设计讨论流程_SOP.md Step 15; 详细设计书写规范.md §5.14; Step 9 exact flow inventory; Step 12 error/issue mapping; Step 13 idempotency/commit resolution; Step 14 config/runtime/binding handoff
forbidden_until_next_gate = trace/span contract, audit event table, redaction final table, formal 03 assembly, 04, Step 16+, implementation ledger, planned boundary skeleton, code, tests, run_id, evidence, sign-off, commit
unresolved_upstream_blocker = none
```

R15.8 必须把 editorial candidates 收敛成可落码的最终指标埋点表，但不得引入观测 Port、backend crate 或新 Rust carrier。完成 R15.8 后仍须停审，不能自动进入 R15.9 trace / span / correlation。

## 54. R15.8 授权、输入闭包与写入边界

### 54.1 授权与回读结论

用户已明确确认从 `03_step_15_r15_7_completed_stop_review` 进入 `R15.8 metric cuts:再写入`。本批重新读取本文件 §§35~53、Step 9 的 83-flow inventory、Step 12 的 17 个 `ApplicationError` 与 51 个 `CapabilityIssueCode`、Step 13 的 reserve-race / commit-resolution 算法、Step 14 的 Stage 0~7 / binding / entry-complete predicate，以及详细设计 SOP Step 15 和书写规范 §5.14。

回读没有发现需要回开 Step 6~14 的新缺口。现有 repository 只提供 exact read 或分页 scan，report repository 提供 immutable history page；没有一个接口能对全部 material、reference 或 report 提供一致且有界的 current-state snapshot。因此 `MT-MAT-01..03` 不满足 Gauge authority gate，必须在本批删除，不能以新增 repository finder、metric cache、后台聚合状态或 Rust carrier补洞。

| 本批允许写入 | 本批明确禁止 |
|---|---|
| 59 个候选逐项 keep / merge / reject 裁决 | trace / span / correlation contract；留给 R15.9/R15.10 |
| backend-neutral metric name、instrument type、seconds unit和唯一 owner | `ObservabilityPort`、metric trait/facade/macro、第三方 crate、exporter/backend绑定 |
| 48 个最终 metric profile、固定 label keys、逐指标闭值集合 | bucket、threshold、SLO、dashboard、scrape interval、retention、alert/runbook |
| 17 error、51 issue 的单次唯一 metric owner | 从 raw error/status/body 动态生成 label；同一 issue 同时进入 outcome 与 diagnostic metric |
| 83-flow exact reverse mapping和特殊分支发射规则 | 用 metric 证明 durability、external delivery、Job report、retry eligibility、audit或验收事实 |

### 54.2 本批硬结论

1. 最终 namespace 固定为 `capability_hub_*`；不复用 R15.6 的 structured-log `event_key`。
2. Counter 名全部以 `_total` 结尾；Histogram 名全部以 `_duration_seconds` 结尾且只接收单调时钟计算的秒值；Gauge 名不使用 `_total`。
3. 59 个候选收敛为 `48 = 34 Counter + 12 Histogram + 2 Gauge` 个最终 profile；三项 material/reference/report Gauge 被拒绝。
4. 每个 profile 的 label key 集固定；成功、失败、duplicate、timeout 等分支不得动态增减 label。没有错误时 `error_family=none`，但仅限该 profile 本来就声明 `error_family`。
5. 同一 issue 只允许一个形成 owner 携带非 `none` 的 `error_family`；上层或下层仍可记录自己的边界次数，但必须使用 `error_family=none`，不得复制 issue 分类。
6. metric sink 失败不改变业务返回、UoW、receipt、capture、intent、journal、report、cleanup或external typed outcome；只有独立非递归 fallback 可增加 `MP-DIAG-03`。
7. 本批新增或修改 Rust struct、field、enum、variant、trait、callable均为 `0`；结构体与字段 Rustdoc 增量为 `0`，不存在新增注释遗漏。

## 55. 59 个候选 keep / merge / reject 裁决

下表中的 `MP-*` 是本校准文档的 final metric profile ID，不是 Rust identifier、metric name、配置 key或public protocol值。每个 `MT-*` 候选在表中恰好出现一次。

| 候选 | 裁决 | 最终 profile | 裁决理由 |
|---|---|---|---|
| `MT-ENTRY-01` | keep | `MP-ENTRY-01` | admission gate具有独立pre-dispatch authority，不能由caller completion反推 |
| `MT-ENTRY-02` | keep as merge anchor | `MP-ENTRY-02` | dispatch已发生与caller surface形成属于同一个API invocation completion boundary |
| `MT-ENTRY-03` | merge | `MP-ENTRY-02` | 与dispatch completion拆成两个Counter会对同一API return无条件双计数；合并为一次terminal emission |
| `MT-ENTRY-04` | keep | `MP-ENTRY-03` | API owner内存在明确admitted-start与observation-end |
| `MT-APP-01` | keep | `MP-APP-01` | Command typed completion是application-owned终态 |
| `MT-APP-02` | keep | `MP-APP-02` | Command invocation拥有同owner monotonic start/end |
| `MT-APP-03` | keep | `MP-APP-03` | Query typed completion与API transport completion分层 |
| `MT-APP-04` | keep | `MP-APP-04` | Query read boundary可独立测时且保持no-write |
| `MT-APP-05` | keep | `MP-APP-05` | 只观察既有Query visibility/freshness marker，不形成Gauge或新状态 |
| `MT-IDEM-01` | keep as merge anchor | `MP-IDEM-01` | reservation authority形成单一最终classification |
| `MT-IDEM-02` | merge | `MP-IDEM-01` | duplicate replay成为互斥 `disposition`，不再发第二Counter |
| `MT-IDEM-03` | merge | `MP-IDEM-01` | conflict成为互斥 `disposition`，winner不变且不持久化Conflict |
| `MT-IDEM-04` | merge | `MP-IDEM-01` | in-progress成为互斥 `disposition`，不建立等待/attempt生命周期 |
| `MT-IDEM-05` | merge | `MP-IDEM-01` | bounded winner read只发最终classification，不另计generic reserve |
| `MT-UOW-01` | keep as merge anchor | `MP-UOW-01` | begin / commit / rollback / recovery均由同一local authority形成closed transition outcome |
| `MT-UOW-02` | keep | `MP-UOW-02` | read/lookup/list/load与effect write分区，避免同一repository call重复计数 |
| `MT-UOW-03` | keep | `MP-UOW-03` | declared effect write需要独立技术观测，但不证明commit |
| `MT-UOW-04` | merge | `MP-UOW-01` | commit三态进入UoW transition闭集，`Unknown`保持独立值 |
| `MT-UOW-05` | keep | `MP-UOW-04` | commit call有独立同owner时延；时延不解释resolution |
| `MT-UOW-06` | merge | `MP-UOW-01` | rollback succeeded/failed进入UoW transition闭集且不覆盖原始failure |
| `MT-UOW-07` | merge | `MP-UOW-01` | same-authority recovery结果进入UoW transition闭集；不从metric恢复结果 |
| `MT-PORT-01` | keep | `MP-PORT-01` | resolver typed return有独立external Port owner |
| `MT-PORT-02` | keep | `MP-PORT-02` | resolver invocation拥有同Port start/end |
| `MT-PORT-03` | keep | `MP-PORT-03` | audit handoff与event collaboration语义不同，不能共享outcome union |
| `MT-PORT-04` | keep | `MP-PORT-04` | audit handoff时延不能与collaboration或caller总时延拼接 |
| `MT-PORT-05` | keep | `MP-PORT-05` | collaboration typed status由external Port拥有，不复制为local delivery state |
| `MT-PORT-06` | keep | `MP-PORT-06` | collaboration callable的同owner时延保持独立 |
| `MT-WORKER-01` | keep | `MP-WORKER-01` | 六个named source slot的parked/disabled/blocked assembly decision可直接观察；activation transition由既有`MT-WORKER-05`目标profile承接 |
| `MT-WORKER-02` | keep | `MP-WORKER-02` | header-first admission在payload decode/application之前形成 |
| `MT-WORKER-03` | keep | `MP-WORKER-03` | receipt disposition是application consumer唯一public terminal surface |
| `MT-WORKER-04` | keep | `MP-WORKER-04` | exact capture-ref continuation不与receipt或Port status合并 |
| `MT-WORKER-05` | keep | `MP-WORKER-05` | task stop/drain/join/cleanup由Worker lifecycle owner形成 |
| `MT-WORKER-06` | keep | `MP-WORKER-06` | 单次application consumer invocation具有同owner时延 |
| `MT-OUT-01` | keep | `MP-OUT-01` | Phase A capture write与source UoW绑定，不能与Phase B/C折叠 |
| `MT-OUT-02` | keep | `MP-OUT-02` | Phase A formation时延只覆盖snapshot/capture owner |
| `MT-OUT-03` | keep | `MP-OUT-03` | Phase B前official capture load证明未从current truth重建 |
| `MT-OUT-04` | keep | `MP-OUT-04` | Phase C只观察local `Captured -> IntentBound` authority |
| `MT-JOB-01` | keep | `MP-JOB-01` | Jobs header/kind/schema/input admission是独立entry gate |
| `MT-JOB-02` | keep | `MP-JOB-02` | Jobs dispatch/guarded return属于entry-owned invocation boundary |
| `MT-JOB-03` | keep | `MP-JOB-03` | deterministic planning、initial journal与matching journal reentry需要独立classification；duplicate/conflict/in-progress仍只归`MP-IDEM-01` |
| `MT-JOB-04` | keep | `MP-JOB-04` | 每个selected target经authority证明后的`Planned/Succeeded/Failed/Skipped`四variant observation由journal owner形成 |
| `MT-JOB-05` | keep | `MP-JOB-05` | finalization只观察durable journal/report/result owner，不生成report |
| `MT-JOB-06` | keep | `MP-JOB-06` | runner包裹一次application Job invocation的时延边界明确 |
| `MT-JOB-07` | keep | `MP-JOB-07` | result delivery/drain/join/cleanup与report disposition分离 |
| `MT-JOB-08` | keep | `MP-JOB-08` | pre/post-dispatch deadline observation不等于cancellation或retry |
| `MT-INFRA-01` | keep | `MP-INFRA-01` | typed config validation terminal可直接计数 |
| `MT-INFRA-02` | keep | `MP-INFRA-02` | Stage 0~7每阶段有exact owner和terminal result |
| `MT-INFRA-03` | keep | `MP-INFRA-03` | 单阶段时延不跨stage拼接 |
| `MT-INFRA-04` | keep | `MP-INFRA-04` | Configured/DeterministicFake/Disabled/Missing是既有direct one-hot state |
| `MT-INFRA-05` | keep | `MP-INFRA-05` | API/Worker/Jobs complete predicate可直接读取为0/1 |
| `MT-INFRA-06` | keep | `MP-INFRA-06` | Stage 0~7 prefix/startup cleanup有独立owner，不能改写startup结果；Worker/Jobs shutdown分别由其lifecycle profile观察 |
| `MT-MAT-01` | reject | none | only exact/page material read；无一致bounded current-state snapshot，禁止跨页聚合或metric cache |
| `MT-MAT-02` | reject | none | reference list/page不是一致current snapshot；resolver status也不是local current-state authority |
| `MT-MAT-03` | reject | none | report是immutable history page；没有latest complete current index，禁止从Job Counter重建 |
| `MT-MAT-04` | keep | `MP-MAT-01` | maintenance target/report typed completion已有Job/material owner |
| `MT-MAT-05` | keep | `MP-MAT-02` | 单个maintenance item或report finalization有同owner时延 |
| `MT-DIAG-01` | keep | `MP-DIAG-01` | technical issue只在既有forming owner完成typed mapping后计数 |
| `MT-DIAG-02` | keep | `MP-DIAG-02` | redaction invariant violation必须独立于合法typed redacted surface |
| `MT-DIAG-03` | keep | `MP-DIAG-03` | observer sink failure只允许独立non-recursive process fallback计数 |

裁决算术：`59 candidates - 8 merge reductions - 3 rejects = 48 final profiles`。其中 8 个 reduction 来自 entry `1`、idempotency `4`、UoW `3`；被合并候选仍由目标profile的互斥闭值覆盖，不是静默丢失。

## 56. 最终命名、类型、单位与发射通则

### 56.1 命名与instrument约束

| 规则 | 最终要求 |
|---|---|
| namespace | 所有最终名称以 `capability_hub_` 开始；禁止 `capability.*` event key、crate/type/function名或backend前缀 |
| Counter | 单调增加，每次形成一个profile声明的既有typed terminal observation后 `+1`；名称以 `_total` 结尾 |
| Histogram | 每个声明的同owner invocation最多观察一次非负秒值；名称以 `_duration_seconds` 结尾；不固定bucket |
| Gauge | 只读取既有current owner；`MP-INFRA-04`为one-hot 0/1，`MP-INFRA-05`为predicate 0/1；不得从Counter/log推导 |
| metric name稳定性 | 名称是实现必须暴露的backend-neutral identifier；改名需要回开本Step，不得由exporter动态拼接 |
| structured log隔离 | metric name不复用R15.6 `capability.*` event key；日志字段、metric label和audit字段分别维护 |

### 56.2 一次发射与唯一issue owner

1. 一个profile的一次发射必须由其表中唯一 owner在typed terminal branch形成后执行；mapper、caller和observer sink不得再次发射同profile。
2. entry、application、UoW、Port可以分别观察自己的边界；这些数值不要求相等，也不能作为accepted truth、durability或delivery一致性证明。
3. 同一 `CapabilityIssueCode` occurrence只在 §59 指定的forming metric中令 `error_family`取非 `none`。其他同时发生的边界metric若保留自己的次数，只能使用`error_family=none`和本边界generic outcome。
4. `error_family`只从既有typed `CapabilityIssueCode`、§59的deterministic mapper或`observer_sink_failure`固定值取得；禁止读取 `Display`、`Debug`、raw status、stack trace或source chain。
5. success/failure使用相同label key集合。一个profile声明 `error_family` 时，正常分支固定发 `none`；未声明该label的profile不得临时增加它。
6. duplicate、conflict、in-progress、winner classification统一只发一次`MP-IDEM-01`。caller-visible API/Worker/Job completion仍可观察自己的边界，但不得再次携带idempotency issue family。
7. metric recording本身失败时，原profile不重试、不回滚业务、不改变typed outcome；只有独立fallback可发一次`MP-DIAG-03`，该profile不得观察自身。

### 56.3 Histogram与Gauge刷新

| 场景 | 最终规则 |
|---|---|
| normal return | 从同owner invocation start到typed return形成时观察一次 |
| typed failure | 仍在同owner terminal failure形成时观察一次，使用该Histogram既有closed outcome |
| observation timeout | 只有owner明确形成`timed_out`时才观察；不得据elapsed值推断cancellation、retry或commit resolution |
| panic/owner未形成terminal | 本Step不伪造样本；具体panic capture/host行为不是业务metric authority |
| binding one-hot refresh | 对一个已知 `(entry_kind, port_family)` 同时写四个closed state series：当前state为1，其余为0 |
| binding owner不可读 | 本轮不保留旧值、不默认Healthy/Configured；整组series本次不刷新，由host/backend stale规则处理，不能新增`unknown`state |
| entry barrier refresh | exact complete predicate成立写1，否则写0；不得按listener/task存活、请求成功率或stage Counter推断 |
| runtime owner已销毁 | 不沿用进程内cache声称current；停止刷新，不从cleanup success反推0/1 |

## 57. R15.8 最终指标埋点表

表内 `labels` 是该metric的完整且固定的label key集合；没有列出的key一律不得发射。`closed terminal values` 只给出该profile允许的值，完整公共词典及snake-case拼写见 §58。所有Counter在trigger形成时加一；所有Histogram在同一owner的start/end之间观察一次seconds值。

### 57.1 Entry、application 与 idempotency（9）

| profile | metric identifier | type | unique owner / exact trigger | labels | closed terminal values / authority boundary |
|---|---|---|---|---|---|
| `MP-ENTRY-01` | `capability_hub_entry_admissions_total` | Counter | API route/schema/envelope/metadata gate；在dispatch前形成pass或typed rejection时一次 | `entry_kind`, `protocol_family`, `outcome`, `error_family` | `entry_kind=api`；`outcome=passed/rejected/failed`；只由pre-dispatch protocol issue owner携带非`none` error，不表示application已执行 |
| `MP-ENTRY-02` | `capability_hub_entry_invocations_total` | Counter | API exact callable observation owner；已dispatch invocation在caller surface返回、技术失败或observation timeout时一次 | `entry_kind`, `protocol_family`, `outcome` | `entry_kind=api`；`outcome=returned/failed/timed_out`；不因底层issue重复分类，不表示timeout取消application |
| `MP-ENTRY-03` | `capability_hub_entry_invocation_duration_seconds` | Histogram(seconds) | 与`MP-ENTRY-02`同一API invocation owner；admission通过后start，caller observation terminal时end | `entry_kind`, `protocol_family`, `outcome` | outcome与`MP-ENTRY-02`相同；不跨application/Port/UoW拼接，不用duration推断cancellation或durability |
| `MP-APP-01` | `capability_hub_command_completions_total` | Counter | exact Command application service；typed accepted/rejected/replay surface或technical return形成时一次 | `operation_group`, `outcome`, `error_family` | `outcome=accepted/rejected/duplicate_replayed/failed`；仅当前Command semantic rejection owner可携带issue，transaction/technical issue由其专属profile拥有 |
| `MP-APP-02` | `capability_hub_command_duration_seconds` | Histogram(seconds) | exact Command application invocation；service entry start，typed return end | `operation_group`, `outcome` | outcome与`MP-APP-01`相同；不包含API transport等待，不证明effect或commit |
| `MP-APP-03` | `capability_hub_query_completions_total` | Counter | exact Query resolver-first service；typed Query response或technical return形成时一次 | `operation_group`, `outcome` | `outcome=returned/failed`；`Visible/NotVisible/Degraded`不在此处拆issue；33/33 Query仍no-write |
| `MP-APP-04` | `capability_hub_query_duration_seconds` | Histogram(seconds) | exact Query application invocation；resolver-first service entry start，typed return end | `operation_group`, `outcome` | outcome与`MP-APP-03`相同；不包含API transport，不触发refresh/rebuild/repair |
| `MP-APP-05` | `capability_hub_query_surface_observations_total` | Counter | typed `CapabilityQuerySurface` owner；无degraded marker时按surface发一条`error_family=none`，有marker时按每个既有marker各发一次 | `operation_group`, `visibility`, `freshness_state`, `error_family` | visibility/freshness复用Step 8闭集；非`none` error只来自marker的existing issue；不从empty page、duration或missing默认生成marker |
| `MP-IDEM-01` | `capability_hub_idempotency_classifications_total` | Counter | reservation / stored replay / one bounded winner-read authority；一次incoming write-channel调用只在最终classification形成后发一次 | `protocol_family`, `operation_group`, `disposition`, `error_family` | disposition=`fresh_reserved/duplicate_replayed/conflict/in_progress/winner_replayed/winner_conflict/winner_in_progress/winner_defect/failed`；不发第二reserve metric，不记录key/digest/attempt |

### 57.2 Local authority 与 external Port（10）

| profile | metric identifier | type | unique owner / exact trigger | labels | closed terminal values / authority boundary |
|---|---|---|---|---|---|
| `MP-UOW-01` | `capability_hub_uow_transitions_total` | Counter | `CapabilityUnitOfWorkManager`和同一local authority；begin、commit、rollback或recovery exact-read各自terminal时一次 | `operation_group`, `disposition` | disposition=`begin_succeeded/begin_failed/commit_durable/commit_not_durable/commit_unknown/rollback_succeeded/rollback_failed/recovery_durable/recovery_not_durable/recovery_unknown/recovery_defect`；Unknown与rollback failed不可折叠；matching technical issue只由`MP-DIAG-01`携带 |
| `MP-UOW-02` | `capability_hub_repository_operations_total` | Counter | named local repository adapter；非effect的get/find/list/search/load/resolve callable返回时一次 | `operation_group`, `port_family`, `outcome` | `outcome=succeeded/not_found/failed/consistency_defect`；effect write不进入本profile，Query failure不被解释成write |
| `MP-UOW-03` | `capability_hub_uow_effect_writes_total` | Counter | exact declared save/append/capture/stored-surface/journal/report write adapter；callable返回时一次 | `operation_group`, `port_family`, `outcome` | `outcome=succeeded/conflict/failed/consistency_defect`；成功仅表示staged/write call返回，不证明commit或accepted truth |
| `MP-UOW-04` | `capability_hub_uow_commit_duration_seconds` | Histogram(seconds) | local authority commit callable；commit call start至`Durable/NotDurable/Unknown`或typed failure返回 | `operation_group`, `outcome` | `outcome=durable/not_durable/unknown/failed`；elapsed time永不解析Unknown |
| `MP-PORT-01` | `capability_hub_external_resolver_outcomes_total` | Counter | 七类named external resolver Port；合法typed observation或无合法typed return形成时一次 | `port_family`, `outcome`, `error_family` | outcome=`resolved/unresolved/stale/invalid/unavailable/forbidden/expired/failed/contract_defect`；typed reference issue由此owner携带，technical failure/defect转`MP-DIAG-01`且本metric error为`none` |
| `MP-PORT-02` | `capability_hub_external_resolver_duration_seconds` | Histogram(seconds) | 与`MP-PORT-01`相同的单次resolver callable start/end | `port_family`, `outcome` | outcome与`MP-PORT-01`相同；不包含caller总时长、endpoint、retry attempt或provider health推断 |
| `MP-PORT-03` | `capability_hub_audit_handoff_outcomes_total` | Counter | `ObservabilityAuditHandoffPort` typed return owner；每个实际发生的exact callable return一次；当前83-flow只有`C23 -> handoff_traceability`可达 | `handoff_kind`, `outcome`, `error_family` | schema保留`handoff_kind=traceability/audit_export`以匹配既有两个Port callable，但当前`audit_export`无flow caller且不得发射；outcome=`accepted/unavailable/rejected/retryable/failed/contract_defect`；不声称external audit持久化、evidence或验收签署 |
| `MP-PORT-04` | `capability_hub_audit_handoff_duration_seconds` | Histogram(seconds) | 与`MP-PORT-03`相同的单次handoff callable start/end | `handoff_kind`, `outcome` | outcome与`MP-PORT-03`相同；不回滚local truth，不跨后续external处理 |
| `MP-PORT-05` | `capability_hub_event_collaboration_outcomes_total` | Counter | `CapabilityAccessEventCollaborationPort` typed return owner；`collaborate/get/list/repair`每次return一次 | `handoff_kind`, `outcome`, `error_family` | collaborate/get/repair使用`candidate/pending_delivery/delivered/failed/handoff_unavailable/not_found`；list成功固定`listed`；共同technical values=`contract_defect/technical_failure`；external status不是local delivery state |
| `MP-PORT-06` | `capability_hub_event_collaboration_duration_seconds` | Histogram(seconds) | 与`MP-PORT-05`相同的单次collaboration callable start/end | `handoff_kind`, `outcome` | outcome与`MP-PORT-05`相同；不测capture-to-delivery SLO，不记录intent/target/attempt |

### 57.3 Worker、Inbound 与 Outbound（10）

| profile | metric identifier | type | unique owner / exact trigger | labels | closed terminal values / authority boundary |
|---|---|---|---|---|---|
| `MP-WORKER-01` | `capability_hub_worker_source_bindings_total` | Counter | Worker root对六个named source slot的parked/Disabled/Missing assembly decision；每slot一次 | `source_slot`, `binding_state`, `outcome` | `outcome=parked/disabled/blocked`；activation release另由lifecycle owner观察；不记录topic/group/provider或业务receipt |
| `MP-WORKER-02` | `capability_hub_worker_admissions_total` | Counter | header-first actor/schema/size/logical-event gate；payload decode/application之前形成terminal时一次 | `source_family`, `source_slot`, `disposition`, `error_family` | disposition=`accepted/rejected/unsupported_schema/failed`；仅entry protocol issue在此携带，unsupported schema不decode payload |
| `MP-WORKER-03` | `capability_hub_inbound_receipts_total` | Counter | exact application consumer typed receipt owner；receipt disposition或technical return形成时一次 | `source_family`, `source_slot`, `disposition`, `error_family` | disposition=`accepted/duplicate_replayed/delayed/ignored/rejected/quarantined/failed`；header-first `unsupported_schema`只由`MP-WORKER-02`观察且不调用application；receipt semantic issue在此拥有，technical issue转`MP-DIAG-01` |
| `MP-WORKER-04` | `capability_hub_worker_continuations_total` | Counter | Worker exact capture-ref continuation wrapper；一次facade invocation terminal时一次 | `handoff_kind`, `outcome` | `handoff_kind=event_collaborate`；outcome=`completed/repair_required/failed/timed_out`；capture可能来自API/Inbound/Job且没有合法Inbound `source_family`，因此禁止伪造该label；不创建capture、delivery state、queue或retry attempt |
| `MP-WORKER-05` | `capability_hub_worker_lifecycle_transitions_total` | Counter | Worker supervisor对六个named source task的park/activate/stop/drain/join terminal owner；每slot每实际transition一次 | `source_slot`, `lifecycle_state`, `outcome` | lifecycle=`parked/active/stopping/draining/joined`；outcome=`completed/failed`；本profile同时承接`MT-WORKER-01`的activation观察；continuation drain不伪造source slot，由`MP-WORKER-04`终态承接；不改receipt或原始startup failure |
| `MP-WORKER-06` | `capability_hub_inbound_consumer_duration_seconds` | Histogram(seconds) | Worker包裹一次application consumer invocation；dispatch start至typed receipt/technical return | `source_family`, `source_slot`, `disposition` | disposition与`MP-WORKER-03`相同；unsupported schema没有application invocation与duration sample；不包含transport wait、ack、跨message聚合或cancellation推断 |
| `MP-OUT-01` | `capability_hub_outbound_captures_total` | Counter | Phase A source/snapshot/capture local authority；capture formation/write call terminal时一次 | `operation_group`, `outcome` | `outcome=formed/conflict/failed/consistency_defect`；formed不证明source commit或external delivery |
| `MP-OUT-02` | `capability_hub_outbound_capture_duration_seconds` | Histogram(seconds) | Phase A application capture formation boundary；snapshot/capture start至formation terminal | `operation_group`, `outcome` | outcome与`MP-OUT-01`相同；不包含Phase B/C、transport或delivery SLO |
| `MP-OUT-03` | `capability_hub_outbound_capture_loads_total` | Counter | Phase B前每次`CapabilityEventCaptureRepository::get_with_snapshot` exact load terminal时一次；repair list/page scan另由`MP-UOW-02`观察，不在此伪造loaded item | `handoff_kind`, `outcome` | `handoff_kind=event_collaborate/event_repair`；outcome=`loaded/not_found/failed/consistency_defect`；不得从current truth或mapper重建 |
| `MP-OUT-04` | `capability_hub_outbound_intent_bindings_total` | Counter | Phase C capture intent-binding authority；source/Worker continuation在short local UoW绑定，J08在同一target UoW内与journal success原子绑定；CAS terminal时一次 | `handoff_kind`, `outcome` | `handoff_kind=event_bind`；outcome=`bound/already_bound/conflict/failed/commit_unknown`；不同UoW owner不改变同一local state语义；external status不推进本地delivery lifecycle |

### 57.4 Operations Job（8）

| profile | metric identifier | type | unique owner / exact trigger | labels | closed terminal values / authority boundary |
|---|---|---|---|---|---|
| `MP-JOB-01` | `capability_hub_job_admissions_total` | Counter | Jobs header/kind/schema/input gate；application Job body之前形成terminal时一次 | `outcome`, `error_family` | `outcome=accepted/rejected/failed`；unknown/malformed job kind仍可在固定schema下计数，且不得伪造`job_kind`、run或report；pre-dispatch protocol issue在此拥有 |
| `MP-JOB-02` | `capability_hub_job_dispatches_total` | Counter | Jobs exact eight-arm handler/facade boundary；dispatch或guarded return terminal时一次 | `job_kind`, `lifecycle_state`, `outcome` | lifecycle=`ready/in_flight/consumed`；outcome=`dispatched/returned/failed`；不拥有journal/report或second invocation |
| `MP-JOB-03` | `capability_hub_job_plans_total` | Counter | deterministic planning / initial journal owner；fresh initial journal提交、matching `Planned` journal被选中重入、application planning rejection或unsafe planning failure形成时一次 | `job_kind`, `disposition`, `error_family` | `fresh_planned`=nonempty fresh journal；`empty_planned`=clean zero-target或typed issue-bearing empty journal；另有`reentered/rejected/failed`；completed duplicate、conflict与in-progress在planning前由`MP-IDEM-01`终止，绝不进入本profile；Counter不是journal或retry proof |
| `MP-JOB-04` | `capability_hub_job_target_outcomes_total` | Counter | one selected frozen target的journal/effect authority；该处理分支经commit/rollback/recovery与exact reload后证明terminal outcome或仍保持`Planned`时一次 | `job_kind`, `disposition`, `error_family` | disposition严格映射`CapabilityJobExecutionTargetOutcome`为`planned/succeeded/failed/skipped`；未选择的initial Planned targets不批量发射；`Unchanged`是`Succeeded`中的typed success detail，`RetryablePrerequisite`是failure impact并只影响final disposition；technical issue转`MP-DIAG-01` |
| `MP-JOB-05` | `capability_hub_job_finalizations_total` | Counter | all-terminal journal + pure assembler + result store owner；typed finalization或technical return形成时一次 | `job_kind`, `disposition`, `error_family` | disposition=`completed/partially_completed/failed/retryable/duplicate_replayed/rejected/technical_failure`；report只能来自durable journal/report/result |
| `MP-JOB-06` | `capability_hub_job_invocation_duration_seconds` | Histogram(seconds) | Jobs runner包裹一次application Job invocation；dispatch start至typed response/technical return | `job_kind`, `disposition` | disposition与`MP-JOB-05`相同；不包含host scheduling、跨retry或target ordinal |
| `MP-JOB-07` | `capability_hub_job_runtime_transitions_total` | Counter | Jobs process result-delivery/drain/join/cleanup owner；每个runtime terminal observation一次 | `job_kind`, `lifecycle_state`, `outcome` | lifecycle=`ready/in_flight/consumed/draining/joined`；outcome=`completed/failed`；不修改journal/report disposition |
| `MP-JOB-08` | `capability_hub_job_deadline_observations_total` | Counter | Step 14 non-cancelling pre/post-dispatch deadline owner；deadline observation terminal时一次 | `job_kind`, `lifecycle_state`, `outcome` | outcome=`within_deadline/timed_out`；timeout不表示cancellation、detachment、retry或new invocation |

### 57.5 Infra、maintenance 与 diagnostic（11）

| profile | metric identifier | type | unique owner / exact trigger | labels | closed terminal values / authority boundary |
|---|---|---|---|---|---|
| `MP-INFRA-01` | `capability_hub_config_validations_total` | Counter | typed config validator；raw-source-to-validated-root terminal时一次 | `outcome` | `outcome=valid/rejected/missing`；Stage 0失败可能尚无single selected entry，因此禁止`entry_kind`；technical issue由`MP-DIAG-01`拥有；无raw key/value/path/secret |
| `MP-INFRA-02` | `capability_hub_runtime_stage_outcomes_total` | Counter | runtime builder exact Stage 0~7 owner；每个实际进入stage的terminal一次 | `stage`, `outcome` | `outcome=completed/failed`；固定schema覆盖尚未形成selected entry的Stage 0失败；failed后later stage不发，不返回partial graph |
| `MP-INFRA-03` | `capability_hub_runtime_stage_duration_seconds` | Histogram(seconds) | 与`MP-INFRA-02`相同单stage start/end | `stage`, `outcome` | outcome与`MP-INFRA-02`相同；不拼接多stage、entry startup SLO或dependency endpoint |
| `MP-INFRA-04` | `capability_hub_binding_state` | Gauge(0/1 one-hot) | Step 14 binding owner直接读取一个selected entry的36个slot current state；每次刷新同时写四态 | `entry_kind`, `port_family`, `binding_state` | current state series=1，其余三态=0；owner不可读时整组不刷新；不得新增Healthy/Unknown或从startup Counter推导 |
| `MP-INFRA-05` | `capability_hub_entry_barrier_complete` | Gauge(0/1 predicate) | selected entry complete predicate owner直接读取Stage 0~7 + factory + runtime ownership + static coverage | `entry_kind` | predicate成立=1，否则=0；listener/task/request成功率不能替代predicate |
| `MP-INFRA-06` | `capability_hub_runtime_cleanup_total` | Counter | Stage 0~7 failure后的partial-prefix disposal/startup cleanup owner；exact cleanup terminal时一次 | `stage`, `outcome` | `outcome=completed/failed`；`stage`是触发disposal的exact failing stage；Worker shutdown用`MP-WORKER-05`，Jobs shutdown用`MP-JOB-07`；cleanup success不改写startup failure |
| `MP-MAT-01` | `capability_hub_maintenance_item_outcomes_total` | Counter | existing Job/material/reference owner；一个frozen maintenance target或report item形成typed terminal时一次 | `job_kind`, `material_kind`, `disposition`, `error_family` | disposition=`refreshed/unchanged/reconciled/inconsistent/rebuild_required/skipped/failed/retryable`；只拥有persisted material/reference semantic issue，不生成repair或report |
| `MP-MAT-02` | `capability_hub_maintenance_duration_seconds` | Histogram(seconds) | 单个maintenance item或pure report finalization owner的同一次start/end | `job_kind`, `material_kind`, `disposition` | disposition与`MP-MAT-01`相同；不测scheduler latency、不证明freshness或report completeness |
| `MP-DIAG-01` | `capability_hub_technical_issues_total` | Counter | existing typed error/issue forming owner完成Step 12 mapper时一次；specialized semantic owner已接管的issue不得进入 | `operation_group`, `error_family` | error_family仅使用§59 technical set；一个error occurrence一次，不记录raw cause/stack/body，不触发recovery |
| `MP-DIAG-02` | `capability_hub_redaction_violations_total` | Counter | existing redaction/diagnostic allowlist gate识别一次forbidden observability emission attempt | `error_family` | error_family固定=`redaction_violation`；不要求startup前不存在的entry/protocol identity；合法typed `BodyForbidden/RedactedBoundary` surface不发本metric，泄漏值/字段名永不作为label |
| `MP-DIAG-03` | `capability_hub_observer_sink_failures_total` | Counter | 当前caller已有独立non-recursive process fallback时，structured-log或metric sink失败一次 | `adapter_kind`, `error_family` | adapter=`structured_log_sink/metric_sink`，error=`observer_sink_failure`；startup前也可安全分类；不得观察自身、重试loop、rollback或覆盖原outcome |

最终profile总数为 `9 + 10 + 10 + 8 + 11 = 48`。表内所有metric identifier互不重复，Counter `34`、Histogram `12`、Gauge `2`；无Summary、UpDownCounter、backend-specific instrument或metric-owned state。

## 58. Label closed-value 字典与禁止标签

### 58.1 全局有限值与逐flow映射

所有label literal使用下表固定的lower snake case。表中“来源”是唯一typed source；实现不得从route、function/type名、`Debug`或配置alias推导。

| label key | exact closed values | unique source / mapping rule |
|---|---|---|
| `entry_kind` | `api`, `worker`, `jobs` | Step 14 selected composition entry；不是binary/listener/task name |
| `protocol_family` | `command`, `query`, `inbound`, `outbound`, `job` | Step 8 protocol family；startup-only profile不使用该key |
| `operation_group` | `identity`, `registry`, `descriptor`, `relation`, `exposure`, `trace_impact`, `reference`, `derived_material`, `inbound_reference`, `inbound_impact`, `operations_job`, `runtime_assembly`, `not_applicable` | 由本节 §58.2 exact flow partition或non-flow owner决定；Outbound按exact source subject归组，不使用generic outbound bucket；不得使用exact operation/flow name |
| `visibility` | `visible`, `not_visible`, `degraded` | `CapabilityQueryVisibility` exact mapper |
| `freshness_state` | `fresh`, `stale_readable`, `rebuilding`, `unavailable`, `not_applicable` | `CapabilityQueryFreshness` exact mapper；无marker时不得猜测 |
| `binding_state` | `configured`, `deterministic_fake`, `disabled`, `missing` | Step 14 four-state binding；`Fake`正式metric literal固定`deterministic_fake` |
| `stage` | `validate_root`, `build_single_authority`, `bind_technical_primitives`, `bind_local_base_ports`, `bind_external_ports`, `build_selected_application_graph`, `resolve_selected_entry_parameters_and_neutral_inputs`, `create_one_nonclone_entry_handoff` | Step 14 Stage 0~7 exact order；不使用数字、function/file名或自由文本 |
| `source_family` | `governance`, `method_library`, `downstream_consumer`, `external_capability_source`, `observability_audit`, `external_document` | `CapabilityInboundSourceFamily` exact mapper |
| `source_slot` | `governance_result_reference_changed`, `method_asset_reference_changed`, `downstream_consumption_impact_reported`, `external_capability_source_reference_changed`, `audit_material_reference_changed`, `external_document_reference_changed` | `CapabilityInboundSourceSlot` exact six-arm mapper |
| `job_kind` | `run_capability_registry_reconciliation`, `refresh_controlled_consumer_view`, `rebuild_directory_search_browse_projection`, `prepare_audit_friendly_export_summary`, `rebuild_read_only_ecosystem_discovery_summary`, `run_derived_material_reconciliation`, `refresh_external_reference_resolution`, `repair_capability_access_event_collaboration` | Step 8 closed eight-arm Job dispatch；不使用scheduler job name |
| `handoff_kind` | `traceability`, `audit_export`, `event_collaborate`, `event_get`, `event_list`, `event_repair`, `event_bind` | exact existing Port callable或local bind phase；`audit_export`是已声明但当前83-flow不可达的保留值，不能主动发射；audit handoff与event collaboration不共享outcome union |
| `material_kind` | `controlled_consumer_view`, `directory_projection`, `audit_export`, `ecosystem_discovery`, `reconciliation_report`, `reference_resolution`, `event_capture`, `not_applicable` | `DerivedMaterialKind`、reference/capture existing owner和metric-specific mapper；不使用body type/report name |
| `adapter_kind` | `structured_log_sink`, `metric_sink` for `MP-DIAG-03` | R15.8只允许这两个observer adapter literal；external Port profile不使用该key，避免concrete provider/type泄漏 |
| `port_family` | §58.3 fixed 36-value map | existing `ApplicationPortKind`/base Port mapper；不使用concrete adapter、crate path、endpoint或provider |

`operation_group=not_applicable` 只用于无exact protocol flow的startup、cleanup或observer technical issue；protocol-bound issue必须使用其exact flow group。`material_kind=not_applicable` 只用于maintenance finalization没有单一material target时，不能代替未知类型。

#### 58.1.1 `protocol_family` profile-specific domain

`protocol_family`不是所有五个值都能进入每个声明该label的profile。最终固定域如下，mapper遇到域外family必须拒绝该metric emission并走既有technical issue owner，不能发`other/unknown`：

| profiles | exact allowed values | direct reason / excluded values |
|---|---|---|
| `MP-ENTRY-01/02/03` | `command`, `query` | API entry只承接26 Command与33 Query；Inbound由Worker、Job由Jobs拥有，Outbound没有独立API invocation entry |
| `MP-IDEM-01` | `command`, `inbound`, `job` | 只有26 Command、6 Inbound和8 Operations Job使用request idempotency；33 Query严格no-write，10 Outbound使用immutable capture identity |

因此不存在允许五值任意组合的generic `protocol_family` metric。上述两个domain也是§57对应profile完整label schema的一部分。

### 58.2 83-flow 默认 `operation_group` 与 Outbound source override

| exact flow IDs | `operation_group` | count |
|---|---|---:|
| `C01..C04`, `Q01..Q03`, `O01` | `identity` | 8 |
| `C05..C08`, `Q04..Q06`, `O02` | `registry` | 8 |
| `C09..C12`, `Q07..Q10`, `O03` | `descriptor` | 9 |
| `C13..C17`, `Q11..Q14`, `O04..O05` | `relation` | 11 |
| `C18..C21`, `Q15..Q19`, `O06..O07` | `exposure` | 11 |
| `C22..C23`, `Q20..Q23`, `O08` | `trace_impact` | 7 |
| `C24..C26`, `Q29..Q33`, `O10` | `reference` | 9 |
| `Q24..Q28`, `O09` | `derived_material` | 6 |
| `I01..I02`, `I04..I06` | `inbound_reference` | 5 |
| `I03` | `inbound_impact` | 1 |
| `J01..J08` | `operations_job` | 8 |
| **total** | 11 disjoint groups | **83** |

该表只供metric label mapper使用，不增加`CapabilityOperationName` variant或改变Step 9 flow owner。每个flow ID出现一次，missing/duplicate均为0。映射规则按profile固定：

1. Entry/application/idempotency/UoW/diagnostic profile使用当前originating `C/Q/I/J` flow所在组。
2. `MP-OUT-01/02/03/04`观察event source/capture/continuation，必须改用matching `O01..O10` source组；不得沿用originating Inbound或Job的generic group。
3. 同一Phase A capture在originating flow表的`X-CAPTURE`和matching O flow表都只是reverse coverage入口，实际只由capture owner发射一次；其`MP-OUT-* operation_group`取O source组，而同一repository write的`MP-UOW-03 operation_group`仍取originating flow组。

这样既保留“哪个业务/Job调用触发了local write”，也保留“哪类event source进入了Outbound continuation”，且不会把两者压成generic `outbound_event`或重复加Counter。

### 58.3 `port_family` fixed map

`port_family` 采用以下 36 个固定literal；其中5个base/read-gate、22个repository和9个external Port恰好覆盖Step 14的36/36 application Port。UoW本身通过`capability_unit_of_work`表示，manager通过`capability_unit_of_work_manager`表示。

```text
capability_unit_of_work
capability_unit_of_work_manager
clock
id_generator
read_visibility_resolver
capability_identity_repository
capability_access_review_repository
capability_registry_repository
adapter_descriptor_repository
descriptor_safe_summary_repository
governance_seam_repository
capability_method_relation_repository
formal_exposure_repository
formal_visibility_repository
capability_change_record_repository
capability_traceability_repository
capability_impact_repository
capability_truth_snapshot_repository
controlled_consumer_view_repository
capability_derived_material_repository
capability_reconciliation_report_repository
capability_external_reference_repository
reference_resolution_state_repository
capability_idempotency_repository
stored_capability_result_repository
capability_event_capture_repository
capability_job_execution_repository
external_capability_source_reference
governance_result_reference
method_asset_reference
secret_reference
external_document_reference
capability_consumer_reference
observability_audit_reference
observability_audit_handoff
capability_access_event_collaboration
```

`MP-INFRA-04` 对当前selected entry的36个slot逐项刷新one-hot。某slot在该entry不被调用也必须有一个existing binding state；不得省略series或写`not_applicable`。本Gauge反映assembly binding，不表示dependency health、protocol availability或business success。

Profile-specific `port_family` 子集固定如下：

| profile | exact allowed subset | cardinality / exclusion |
|---|---|---|
| `MP-UOW-02` | `read_visibility_resolver` + 上述22个名称以`_repository`结尾的repository Port | 23；不含UoW manager、Clock、Id、7 external resolver、handoff或collaboration |
| `MP-UOW-03` | `MP-UOW-02`集合减去`read_visibility_resolver`和read-only `capability_truth_snapshot_repository` | 21 writable repositories；某callable是否为effect write仍由Step 7/11 exact method决定 |
| `MP-PORT-01/02` | `external_capability_source_reference`, `governance_result_reference`, `method_asset_reference`, `secret_reference`, `external_document_reference`, `capability_consumer_reference`, `observability_audit_reference` | 7 external resolver Ports；不含local read resolver、audit handoff或event collaboration |
| `MP-INFRA-04` | §58.3全部36值 | 36；one-hot refresh不得只发当前调用会用到的Port |

`MP-PORT-03/04` 不使用`port_family`，因为唯一Port已由metric name限定，`handoff_kind`只区分其两个callable。`MP-PORT-05/06`同理只使用`handoff_kind`区分collaborate/get/list/repair。这样避免在已限定的metric中重复增加无信息label，也避免concrete adapter/provider identity进入taxonomy。

### 58.3.1 Source slot / family exact pairs

| `source_slot` | only legal `source_family` |
|---|---|
| `governance_result_reference_changed` | `governance` |
| `method_asset_reference_changed` | `method_library` |
| `downstream_consumption_impact_reported` | `downstream_consumer` |
| `external_capability_source_reference_changed` | `external_capability_source` |
| `audit_material_reference_changed` | `observability_audit` |
| `external_document_reference_changed` | `external_document` |

`MP-WORKER-02/03/06` 必须使用这六个exact pair，不允许交叉组合；`MP-WORKER-01/05`只使用slot，不重复family。Worker exact-ref continuation `MP-WORKER-04`不使用slot/family，因为capture可来自API、Inbound或Job，不得伪造一个Inbound source identity。

### 58.4 逐profile outcome / disposition闭集索引

§57每行已经给出完整闭值；为禁止跨profile误用，以下规则优先于任何同名typed enum：

| subject | exact closed values |
|---|---|
| Query visibility | `visible`, `not_visible`, `degraded` |
| Query freshness | `fresh`, `stale_readable`, `rebuilding`, `unavailable`, `not_applicable` |
| Inbound receipt disposition | `accepted`, `duplicate_replayed`, `delayed`, `ignored`, `rejected`, `unsupported_schema`, `quarantined`, `failed` |
| Audit handoff outcome | `accepted`, `unavailable`, `rejected`, `retryable`, `failed`, `contract_defect` |
| Event collaboration outcome | `candidate`, `pending_delivery`, `delivered`, `failed`, `handoff_unavailable`, `not_found`, `listed`, `contract_defect`, `technical_failure`；`listed`仅用于list page成功，不是delivery state |
| Commit resolution portion of UoW disposition | `commit_durable`, `commit_not_durable`, `commit_unknown`, `recovery_durable`, `recovery_not_durable`, `recovery_unknown` |
| Job planning disposition | `fresh_planned`, `empty_planned`, `reentered`, `rejected`, `failed`；duplicate/conflict/in-progress只属于`MP-IDEM-01` |
| Job target outcome | `planned`, `succeeded`, `failed`, `skipped`；exact映射`CapabilityJobExecutionTargetOutcome`四个variant |
| Job protocol final disposition | `completed`, `partially_completed`, `failed`, `retryable`, `duplicate_replayed`, `rejected`, `technical_failure` |
| Entry/Job deadline outcome | `within_deadline`, `timed_out` |

没有跨协议“万能 outcome enum”。例如 Inbound `Delayed`、payload中已保存的downstream `Delayed`、Job `Retryable`、Port `Unavailable`和deadline `timed_out`是五个不同profile的closed value，不能互相转换。

#### 58.4.1 Runtime lifecycle label authority

`lifecycle_state`只把Step 14已有的process-local owner/action投影为低基数metric literal，不新增enum、持久化状态或迁移。各literal必须在下列exact boundary形成，不能从日志顺序或时延推断：

| profile / literal | exact Step 14 authority | emission boundary |
|---|---|---|
| `MP-WORKER-05 / parked` | one enabled named runner已成功spawn，owned task仍等待`CapabilityWorkerActivationWaiter` | parked spawn成功后一次；Disabled slot无task且不发本profile |
| `MP-WORKER-05 / active` | activation controller已选择`Released`，该named task的waiter观察到release | 每个enabled named task开始source interaction前一次 |
| `MP-WORKER-05 / stopping` | shutdown owner对该slot调用exact `feed_stop.request_stop()` | 每个present slot的stop terminal一次，success/failure均保留同一label set |
| `MP-WORKER-05 / draining` | `CapabilityWorkerInboundInvocationTerminal.timing` exact为`DrainedAfterRunDeadline` | 同一owned invocation达到terminal后按其source slot发一次；不是从shutdown等待时长推断；continuation drain没有source slot，仍由`MP-WORKER-04`观察 |
| `MP-WORKER-05 / joined` | `CapabilityWorkerSourceTask::join`消费该named task的唯一join handle | 每个present slot的join terminal一次；join failure不伪造success |
| `MP-JOB-02 / ready,in_flight,consumed` | exact `CapabilityJobsRuntimeProgress` three-variant owner | admission/dispatch/terminal guard按实际variant观察 |
| `MP-JOB-07 / draining,joined` | same owned `CapabilityJobsOwnedInvocation::drain`的terminal wait与唯一join boundary | 仅作为已有drain/join动作阶段；不是第四、第五个`CapabilityJobsRuntimeProgress` variant |

Worker的五个literal均有Step 14现存owner；Jobs只有`Ready/InFlight/Consumed`是exact enum variant，`draining/joined`是同一owned invocation上的动作阶段。两者均不得进入Step 10的24/111业务状态基线，也不得成为retry、receipt、report或shutdown成功证明。

### 58.5 禁止标签与固定key机械门禁

R15.7 §49.2 的禁用清单全部继续有效，并新增以下实现级判定：

1. 48个metric的label key set必须与§57逐字一致；同名metric出现额外、缺失或optional key均为设计违约。
2. 禁止任何 `*_id`、`*_ref`、request/trace/actor/result/receipt/report/capture/intent/transaction、idempotency key/hash/digest、target ordinal、flow ID、exact operation、route、handler/function/type/file/crate作为label。
3. 禁止provider、endpoint、host、topic、partition、offset、lease、ack、attempt、scheduler run、transport status/code/body或adapter concrete type。
4. 禁止raw error/cause/message/stack/SQL、request/response/event/method/document/audit body、secret/token/credential/config value、evidence alias、acceptance signature、test/run ID。
5. 禁止将structured-log `event_key`、trace/span name或audit event name作为metric label；关联定位走日志、trace或typed record，不扩大metric基数。
6. Counter/Histogram/Gauge emission不得使用自由文本fallback值；typed mapper无匹配时形成既有technical issue并走§59 owner，不得发`other/unknown`。唯一出现的`unknown`语义是既有commit resolution，metric literal固定嵌入`commit_unknown/recovery_unknown` disposition。

## 59. 17 errors / 51 issues 唯一指标 owner

### 59.1 唯一owner selector与优先级

一个 `CapabilityIssueCode` 可以作为body-free值被复制到response、receipt、report或log，但一次typed occurrence只能有一个metric owner。实现按以下顺序选中第一个成立的selector，随后所有copy层的`error_family`必须为`none`：

| selector | exact selection rule | selected final profile | downstream non-owner rule |
|---|---|---|---|
| `IOS-REDACTION-VIOLATION` | observability字段准备阶段试图发射forbidden body/secret/ref，且redaction gate拒绝 | `MP-DIAG-02`，固定`redaction_violation` | 不把本次违规再计为`BodyForbidden`、`RedactedBoundary`或technical issue |
| `IOS-TECHNICAL` | `ApplicationError` variants 3~8与11~17、entry thin-wrapper technical source、runtime assembly、codec、consistency、transaction或无合法typed Port return；`ContractRejected/DomainRejected`不进入本selector | `MP-DIAG-01` | UoW/Port/entry/Job profile只保留自己的generic outcome或disposition，不携带同一error family |
| `IOS-IDEMPOTENCY` | reservation authority形成duplicate/conflict/in-progress/winner classification | `MP-IDEM-01` | Command/Inbound/Job caller surface可计completion，但`error_family=none` |
| `IOS-HANDOFF` | `CapabilityHandoffDisposition` first forms a non-accepted body-free issue | `MP-PORT-03` | application/Command/Job copy层`error_family=none` |
| `IOS-COLLABORATION` | `EventCollaborationStatus` first forms failed/unavailable body-free issue | `MP-PORT-05` | Outbound/Worker/Job copy层`error_family=none` |
| `IOS-RESOLVER` | named external resolver Port first returns a typed reference issue | `MP-PORT-01` | Query/Inbound/Job surface复制该issue时`error_family=none` |
| `IOS-QUERY` | 无本次external resolver call；既有persisted Query surface first forms degraded/reference/material issue | `MP-APP-05` | API Query completion只计`MP-ENTRY-02/03`，不复制error family |
| `IOS-MAINTENANCE` | frozen Job material/reference target first forms stable persisted semantic issue，明确排除`TerminalTargetSkipped`及technical issue | `MP-MAT-01` | `MP-JOB-04/05`保留disposition但`error_family=none` |
| `IOS-INBOUND` | application consumer first forms receipt issue/marker | `MP-WORKER-03` | Worker continuation、UoW或Port copy层不再携带该family |
| `IOS-JOB` | non-maintenance Job admission/plan/target/final public semantic issue first forms | admission=`MP-JOB-01`; plan=`MP-JOB-03`; target=`MP-JOB-04`; final=`MP-JOB-05` | 只按exact forming phase选一行；later report copy不重复 |
| `IOS-COMMAND` | application Command first forms stable public rejection issue | `MP-APP-01` | API completion仍计returned/rejected boundary，但不复制error family |
| `IOS-ADMISSION` | API/Worker/Jobs pre-dispatch gate first forms protocol issue | API=`MP-ENTRY-01`; Worker=`MP-WORKER-02`; Jobs=`MP-JOB-01` | service/application未调用；Jobs owner不要求`job_kind` label；任何synthetic response copy不再计issue |

`IOS-TECHNICAL` 优先于semantic selector，只在没有合法typed semantic outcome时成立；合法 `Unavailable`、`Delayed`、`Retryable`或`Rejected`不得仅因“看起来失败”转成technical。`IOS-RESOLVER/HANDOFF/COLLABORATION` 优先于其caller copy，关闭external Port与application/Job重复计数。`IOS-QUERY/MAINTENANCE/INBOUND/JOB/COMMAND/ADMISSION` 由已存在的forming phase决定，不允许metric mapper自行选择。

### 59.2 `ApplicationError` 17/17 owner表

| # | `ApplicationError` variant | exact metric owner rule | `error_family` source | 同时发生的非owner metric规则 |
|---:|---|---|---|---|
| 1 | `ContractRejected` | 通过`issue_code()`后按既有typed forming phase选择`IOS-ADMISSION/COMMAND/INBOUND/JOB`；该variant始终是closed contract rejection，不进入`IOS-TECHNICAL` | matching 51-code snake-case literal | 单次只选一个semantic selector；不得同时计diagnostic；raw field/value不进入label |
| 2 | `DomainRejected` | 按既有typed forming phase选择`IOS-COMMAND/INBOUND/JOB`；reference typed outcome已由Port first-forming时选择`IOS-RESOLVER`；该variant不进入`IOS-TECHNICAL` | matching `policy_rejected/body_forbidden/reference_* / stale_source / redacted_boundary / invalid_field` | pure domain invariant仍由forming semantic profile拥有；persisted/technical contradiction必须使用既有technical variant，不得靠metric重分类 |
| 3 | `InvalidInput` | `IOS-TECHNICAL` -> `MP-DIAG-01` | `invalid_application_input` | application/entry profile只保留`failed`或`rejected` boundary，error=`none` |
| 4 | `InvalidTechnicalStateTransition` | `IOS-TECHNICAL` | `invalid_technical_state_transition` | 不创建transition metric或新state |
| 5 | `TechnicalInvariantViolation` | `IOS-TECHNICAL` | `technical_invariant_violation` | 不降级为missing/degraded/quarantined |
| 6 | `MissingPrerequisite` | `IOS-TECHNICAL` | `missing_prerequisite` | typed normal missing若已有public semantic issue不得构造本variant |
| 7 | `OptimisticConflict` | `IOS-TECHNICAL` | `optimistic_conflict` | `MP-UOW-03`可计`outcome=conflict`但不携带error family |
| 8 | `UniquenessConflict` | `IOS-TECHNICAL` | `uniqueness_conflict` | exact winner read/idempotency classification只有在Step 13成立时另走`MP-IDEM-01`，不复制本issue |
| 9 | `IdempotencyConflict` | `IOS-IDEMPOTENCY` -> `MP-IDEM-01` | public protocol branch已形成`DuplicateConflict`时使用`duplicate_conflict`；否则使用`idempotency_conflict`，二者恰选一 | winner state不写；internal/public mapping不双计；`MP-DIAG-01`禁止发射 |
| 10 | `IdempotencyInProgress` | `IOS-IDEMPOTENCY` -> `MP-IDEM-01` | `idempotency_in_progress` | 无wait/attempt/retry lifecycle；`MP-DIAG-01`禁止发射 |
| 11 | `PortFailure` | `IOS-TECHNICAL` -> `MP-DIAG-01` | `dependency_failure` | matching Port outcome计`failed/technical_failure`且error=`none`；不解析raw status |
| 12 | `TransactionBeginFailed` | `IOS-TECHNICAL` -> `MP-DIAG-01` | `transaction_begin_failed` | `MP-UOW-01`仍计`begin_failed` disposition，无error label |
| 13 | `TransactionCommitFailed` | `IOS-TECHNICAL` -> `MP-DIAG-01` | `transaction_commit_failed` | `MP-UOW-01`计`commit_not_durable`，`MP-UOW-04`计duration；均不复制error |
| 14 | `TransactionRollbackFailed` | `IOS-TECHNICAL` -> `MP-DIAG-01` | `transaction_rollback_failed` | `MP-UOW-01`独立计`rollback_failed`，原始failure metric也保留；三者语义不互相覆盖 |
| 15 | `CommitOutcomeUnknown` | `IOS-TECHNICAL` -> `MP-DIAG-01` | `commit_outcome_unknown` | commit return和每次declared recovery phase可分别计UoW disposition；不得把unknown改成failed/success或blind retry |
| 16 | `ConsistencyDefect` | `IOS-TECHNICAL` -> `MP-DIAG-01` | `consistency_defect` | Port/UoW/Job profile只计`contract_defect/consistency_defect/planned` outcome；不得降级为Unavailable |
| 17 | `CodecFailure` | `IOS-TECHNICAL` -> `MP-DIAG-01` | `codec_failure` | producing profile可计generic failed；bytes/body/algorithm不进入label |

17个variant全部有一个且仅一个owner算法。`ContractRejected`和`DomainRejected`并非“有时双发”，而是先根据Step 12既有typed source选定一个semantic或technical selector；一旦选定，其他selector全部失效。

### 59.3 `CapabilityIssueCode` 1~25 semantic owner表

`error_family` 固定为variant的lower snake-case拼写。下表“selector”是该code允许的唯一origin selector；若一个body-free issue被copy到其他carrier，copy层不发error family。

| # | `CapabilityIssueCode` | `error_family` | unique selector / exact owner rule |
|---:|---|---|---|
| 1 | `InvalidEnvelope` | `invalid_envelope` | `IOS-ADMISSION`；按API/Worker/Jobs实际pre-dispatch channel选择一项 |
| 2 | `MissingRequiredField` | `missing_required_field` | first-forming semantic selector：pre-dispatch=`IOS-ADMISSION`；Command=`IOS-COMMAND`；Inbound=`IOS-INBOUND`；Job body=`IOS-JOB`；不得在copy层重发 |
| 3 | `OperationMismatch` | `operation_mismatch` | `IOS-ADMISSION` only；service不得被调用 |
| 4 | `InvalidField` | `invalid_field` | first-forming semantic selector：admission、Command、Inbound或Job exact phase；每次只能命中一项 |
| 5 | `InvalidScope` | `invalid_scope` | first-forming semantic selector：admission、Command或Job exact phase；scope text/id不进入label |
| 6 | `DuplicateConflict` | `duplicate_conflict` | `IOS-IDEMPOTENCY` -> `MP-IDEM-01`；不得与`idempotency_conflict`同次双发，public code形成时使用本family，internal-only variant不再发自身family |
| 7 | `PolicyRejected` | `policy_rejected` | first-forming semantic selector：Command、Inbound、Job或admission gate；不表示governance approval或runtime authorization |
| 8 | `BodyForbidden` | `body_forbidden` | first-forming semantic selector：admission、Command、Inbound或Job；合法boundary rejection不是`IOS-REDACTION-VIOLATION` |
| 9 | `UnsupportedSchema` | `unsupported_schema` | `IOS-ADMISSION` only；Worker header-first branch不decode payload、不发application receipt或consumer-duration sample |
| 10 | `SubjectMissing` | `subject_missing` | persisted Query marker=`IOS-QUERY`；frozen maintenance target=`IOS-MAINTENANCE`；non-maintenance Job target=`IOS-JOB`；exact source决定一项 |
| 11 | `ReferenceUnresolved` | `reference_unresolved` | external typed return=`IOS-RESOLVER`；otherwise persisted Query=`IOS-QUERY`或frozen maintenance=`IOS-MAINTENANCE` |
| 12 | `ReferenceUnavailable` | `reference_unavailable` | external typed return=`IOS-RESOLVER`；otherwise persisted Query=`IOS-QUERY`或frozen maintenance=`IOS-MAINTENANCE` |
| 13 | `StaleSource` | `stale_source` | persisted Query marker=`IOS-QUERY`或frozen maintenance target=`IOS-MAINTENANCE`；resolver `Stale/Expired` first-return则`IOS-RESOLVER` |
| 14 | `MaterialRebuilding` | `material_rebuilding` | Query surface=`IOS-QUERY`；frozen maintenance target=`IOS-MAINTENANCE` |
| 15 | `MaterialUnavailable` | `material_unavailable` | Query surface=`IOS-QUERY`；frozen maintenance target=`IOS-MAINTENANCE` |
| 16 | `PartialSurface` | `partial_surface` | Query surface=`IOS-QUERY`；Job final report first forms partial issue=`IOS-JOB` |
| 17 | `RedactedBoundary` | `redacted_boundary` | resolver first-return=`IOS-RESOLVER`；otherwise persisted Query=`IOS-QUERY`或semantic protocol surface；observability emission violation不得使用本selector |
| 18 | `RetryRequired` | `retry_required` | `IOS-INBOUND` -> `MP-WORKER-03` only；payload business value`Delayed/Unavailable`不形成该issue |
| 19 | `BoundaryQuarantined` | `boundary_quarantined` | `IOS-INBOUND` -> `MP-WORKER-03` only |
| 20 | `TerminalTargetSkipped` | `terminal_target_skipped` | `IOS-JOB` target phase -> `MP-JOB-04`；若同target也有maintenance profile，maintenance error=`none` |
| 21 | `HandoffRejected` | `handoff_rejected` | `IOS-HANDOFF` -> `MP-PORT-03` only |
| 22 | `HandoffUnavailable` | `handoff_unavailable` | `IOS-HANDOFF` -> `MP-PORT-03` only |
| 23 | `HandoffRetryable` | `handoff_retryable` | `IOS-HANDOFF` -> `MP-PORT-03` only；metric不授权retry |
| 24 | `CollaborationFailed` | `collaboration_failed` | `IOS-COLLABORATION` -> `MP-PORT-05` only；不成为local delivery failure |
| 25 | `CollaborationUnavailable` | `collaboration_unavailable` | `IOS-COLLABORATION` -> `MP-PORT-05` only；不生成second intent/capture |

Rows 2、4、5、7、8以及10~17使用“first-forming selector”是为了适配同一public-safe code在不同协议carrier中的既有复用，不是实现自由选择。forming phase已由Step 9/12 exact flow固定；同一次occurrence只能走一个分支，后续copy均强制`none`。

### 59.4 `CapabilityIssueCode` 26~51 technical owner表

除两个idempotency code外，本表全部由 `IOS-TECHNICAL -> MP-DIAG-01` 唯一拥有。它们不得同时进入entry/application/UoW/Port/Worker/Job outcome metric的`error_family`。

| # | `CapabilityIssueCode` | `error_family` | unique metric owner |
|---:|---|---|---|
| 26 | `InvalidApplicationInput` | `invalid_application_input` | `MP-DIAG-01` |
| 27 | `InvalidTechnicalStateTransition` | `invalid_technical_state_transition` | `MP-DIAG-01` |
| 28 | `TechnicalInvariantViolation` | `technical_invariant_violation` | `MP-DIAG-01` |
| 29 | `MissingPrerequisite` | `missing_prerequisite` | `MP-DIAG-01` |
| 30 | `OptimisticConflict` | `optimistic_conflict` | `MP-DIAG-01` |
| 31 | `UniquenessConflict` | `uniqueness_conflict` | `MP-DIAG-01` |
| 32 | `IdempotencyConflict` | `idempotency_conflict` | `IOS-IDEMPOTENCY` -> `MP-IDEM-01`; 若同branch已形成public `DuplicateConflict`则本family不发；`MP-DIAG-01` forbidden |
| 33 | `IdempotencyInProgress` | `idempotency_in_progress` | `IOS-IDEMPOTENCY` -> `MP-IDEM-01`; `MP-DIAG-01` forbidden |
| 34 | `DependencyFailure` | `dependency_failure` | `MP-DIAG-01` |
| 35 | `TransactionBeginFailed` | `transaction_begin_failed` | `MP-DIAG-01` |
| 36 | `TransactionCommitFailed` | `transaction_commit_failed` | `MP-DIAG-01` |
| 37 | `TransactionRollbackFailed` | `transaction_rollback_failed` | `MP-DIAG-01` |
| 38 | `CommitOutcomeUnknown` | `commit_outcome_unknown` | `MP-DIAG-01` |
| 39 | `ConsistencyDefect` | `consistency_defect` | `MP-DIAG-01` |
| 40 | `CodecFailure` | `codec_failure` | `MP-DIAG-01` |
| 41 | `RuntimeAssemblyFailed` | `runtime_assembly_failed` | `MP-DIAG-01`; `operation_group=runtime_assembly` |
| 42 | `ApiRouteAssemblyFailed` | `api_route_assembly_failed` | `MP-DIAG-01`; startup=`runtime_assembly`，request-bound时使用exact flow group |
| 43 | `ApiEnvelopeNormalizationFailed` | `api_envelope_normalization_failed` | `MP-DIAG-01` |
| 44 | `ApiProtocolMappingFailed` | `api_protocol_mapping_failed` | `MP-DIAG-01` |
| 45 | `WorkerInboundEnvelopeFailed` | `worker_inbound_envelope_failed` | `MP-DIAG-01` |
| 46 | `WorkerPayloadDecodingFailed` | `worker_payload_decoding_failed` | `MP-DIAG-01` |
| 47 | `WorkerCollaborationContinuationFailed` | `worker_collaboration_continuation_failed` | `MP-DIAG-01` |
| 48 | `WorkerMaintenanceTriggerFailed` | `worker_maintenance_trigger_failed` | `MP-DIAG-01` |
| 49 | `JobInputFailed` | `job_input_failed` | `MP-DIAG-01` |
| 50 | `JobApplicationDispatchFailed` | `job_application_dispatch_failed` | `MP-DIAG-01` |
| 51 | `JobResultMappingFailed` | `job_result_mapping_failed` | `MP-DIAG-01` |

### 59.5 `error_family` complete set与无错误规则

全局允许值恰好为：`none`、上述51个snake-case `CapabilityIssueCode`、`redaction_violation`、`observer_sink_failure`。总闭集大小为54。每个具体profile只允许其§57/§59子集；不得因为全局闭集存在就把任意family发到任意metric。

`none` 的含义是“本profile不拥有一个matching issue occurrence”，不是“整个调用没有错误”。例如rollback failed时`MP-UOW-01`以`disposition=rollback_failed`发射且没有`error_family` key，`MP-DIAG-01`独立以`transaction_rollback_failed`发射；原始pre-commit failure仍由其自身形成owner发射。这样三个事实可分别解释，却不会对同一issue code双计数。

## 60. 83-flow 最终metric反向覆盖

### 60.1 Bundle展开与条件语义

下列bundle仅用于本节排版，不是metric identifier、Rust helper、facade、trait或配置。一个bundle中的profile仍只在§57 exact trigger真实发生时发射；例如pre-dispatch rejection不会伪造idempotency/UoW/capture样本，no-op不产生不存在的effect write。

| bundle | exact expansion | branch condition / no-metric rule |
|---|---|---|
| `F-CMD` | `MP-ENTRY-01/02/03`, `MP-APP-01/02`, conditional `MP-IDEM-01`, `MP-UOW-01/02/03/04`, `MP-DIAG-01` | API entry与Command application全覆盖；idempotency、UoW和diagnostic仅在exact branch进入；不自动包含external Port、maintenance或Job metric |
| `F-QRY` | `MP-ENTRY-01/02/03`, `MP-APP-03/04/05`, `MP-UOW-02`, conditional `MP-DIAG-01` | `MP-UOW-02`只计read visibility / repository read；`MP-IDEM-01`, `MP-UOW-01/03/04`, `MP-OUT-*`, `MP-MAT-*`, `MP-JOB-*`全部为0 |
| `F-IN` | header-first `MP-WORKER-02`; admission通过后`MP-WORKER-03/06`, conditional `MP-IDEM-01`, `MP-UOW-01/02/03/04`, `MP-DIAG-01` | Worker source binding/lifecycle是non-flow owner；unsupported/rejected admission没有application receipt/duration；event branch只有实际reserve/UoW时发对应profile |
| `F-OUT` | conditional Phase A `MP-OUT-01/02` + `MP-UOW-01/03/04`; Phase B `MP-OUT-03`, `MP-PORT-05/06`; Phase C `MP-OUT-04` + conditional `MP-UOW-01/03/04`; `MP-DIAG-01` | 三阶段逐owner发射，绝不形成一个publish-success metric；Worker-owned continuation另加`MP-WORKER-04` |
| `F-JOB` | `MP-JOB-01..08`, conditional `MP-IDEM-01`, `MP-UOW-01/02/03/04`, `MP-DIAG-01` | admission/dispatch/plan/target/final/runtime/deadline独立；report不是metric输出，未进入某phase则不发该phase profile |
| `X-RESOLVE` | `MP-PORT-01/02` | 只有现有named external resolver Port被实际调用才发；local read visibility resolver计入`MP-UOW-02` |
| `X-HANDOFF` | `MP-PORT-03/04` | only existing audit/traceability handoff callable |
| `X-CAPTURE` | `MP-OUT-01/02` + actual local UoW profiles | only exact declared snapshot/capture formation；`MP-OUT-*`使用matching O source group，UoW profile使用originating C/I/J group；同一capture只发一次 |
| `X-COLLAB` | per-item exact `MP-OUT-03`, `MP-PORT-05/06`, conditional `MP-OUT-04` + actual local bind UoW profiles；repair list/page read=`MP-UOW-02` | official capture load -> external typed outcome -> local bind；get/list inspection不自动触发bind；无local delivery state |
| `X-MAINT` | `MP-MAT-01/02` | only frozen target/material/reference/report owner；不是Gauge、repair authority或report source |

### 60.2 Command 26/26 exact mapping

| ID | operation group / short subject | final profile expression | exact conditional metric / explicit exclusion |
|---|---|---|---|
| `C01` | identity / establish access context | `F-CMD + X-RESOLVE + X-CAPTURE` | external capability-source resolver only when candidate resolution is invoked；no runtime integration/execution metric |
| `C02` | identity / correct identity | `F-CMD + X-CAPTURE` | no external resolver by default；loaded source/reference reads arelocal `MP-UOW-02` |
| `C03` | identity / retire identity | `F-CMD + X-CAPTURE` | no delivery claim from capture |
| `C04` | identity / record review fact | `F-CMD + X-CAPTURE` | no governance approval/policy metric |
| `C05` | registry / register entry | `F-CMD + X-CAPTURE` | no marketplace listing/discovery metric |
| `C06` | registry / lifecycle state | `F-CMD + X-CAPTURE` | no runtime availability metric |
| `C07` | registry / visibility basis | `F-CMD + X-CAPTURE` | no runtime authorization metric |
| `C08` | registry / retire entry | `F-CMD + X-CAPTURE` | no directory rebuild or listing metric |
| `C09` | descriptor / establish descriptor | `F-CMD + X-CAPTURE` | no provider invocation/health/cost metric |
| `C10` | descriptor / replace descriptor | `F-CMD + X-CAPTURE` | current-descriptor read remainslocal repository observation |
| `C11` | descriptor / risk constraint summary | `F-CMD + X-CAPTURE` | no governance decision or quota metric |
| `C12` | descriptor / attach secret ref | `F-CMD + X-RESOLVE + X-CAPTURE` | secret resolver only；no secret value/provider health label |
| `C13` | relation / attach governance seam | `F-CMD + X-RESOLVE + X-CAPTURE` | governance-result resolver only；no approval/Policy truth metric |
| `C14` | relation / replace governance seam | `F-CMD + X-RESOLVE + X-CAPTURE` | same resolver boundary；no workflow state metric |
| `C15` | relation / expire governance seam | `F-CMD + X-CAPTURE` | no external governance call |
| `C16` | relation / attach method relation | `F-CMD + X-RESOLVE + X-CAPTURE` | method-asset resolver only；no method body/execution metric |
| `C17` | relation / remove method relation | `F-CMD + X-CAPTURE` | no method-library mutation metric |
| `C18` | exposure / establish boundary | `F-CMD + X-CAPTURE` | prerequisite reference state islocal canonical read；no runtime/tools/SDK invocation metric |
| `C19` | exposure / update applicability | `F-CMD + X-CAPTURE` | no consumer execution/authorization metric |
| `C20` | exposure / suspend boundary | `F-CMD + X-CAPTURE` | no downstream cache invalidation truth metric |
| `C21` | exposure / retire boundary | `F-CMD + X-CAPTURE` | no SDK unpublish or marketplace metric |
| `C22` | trace-impact / record impact | `F-CMD + X-CAPTURE` | impact isHub fact，not downstream execution/billing metric |
| `C23` | trace-impact / traceability handoff summary | `F-CMD + X-HANDOFF` | no event capture unlessStep 9 separately declares one；handoff status不回滚trace truth或生成evidence metric |
| `C24` | reference / record resolution state | `F-CMD + X-RESOLVE + X-CAPTURE` | matching external resolver only whenflow invokes it；canonical local state remainsauthority |
| `C25` | reference / register document ref | `F-CMD + X-RESOLVE + X-CAPTURE` | document resolver only；no document/OpenAPI/schema body metric |
| `C26` | reference / register consumer ref | `F-CMD + X-RESOLVE + X-CAPTURE` | runtime-tools或SDK consumer resolver only；no execution/client/package metric |

Command set arithmetic：`C01..C26 = 26`，每个ID一行，missing/extra/duplicate均为0。`X-CAPTURE`只观察Phase A形成；对应external collaboration必须在`O01..O10`的exact continuation中按`F-OUT`观察，不能在Command completion Counter中推导。

### 60.3 Query 33/33 exact mapping

所有Query使用 `F-QRY`；下表的“conditional surface”只决定`MP-APP-05`既有marker和§59 owner，不增加write、external resolver或maintenance call。当前基线没有Query调用七类external resolver Port；`resolve_*`语义由local `CapabilityReadVisibilityResolverPort`和canonical repository read承担，统一计入`MP-UOW-02`。

| ID | operation group / short subject | final profile expression | conditional surface / explicit no-write rule |
|---|---|---|---|
| `Q01` | identity / get identity | `F-QRY` | Visible/NotVisible/Degraded/normal missing only；no identity mutation |
| `Q02` | identity / search identities | `F-QRY` | empty page isnormal surface；no refresh/index repair |
| `Q03` | identity / get review fact | `F-QRY` | optional absence does not create prerequisite issue |
| `Q04` | registry / get entry | `F-QRY` | no registry create/retire |
| `Q05` | registry / list entries | `F-QRY` | empty page not a missing/error metric |
| `Q06` | registry / visibility semantics | `F-QRY` | no exposure/visibility creation |
| `Q07` | descriptor / get descriptor | `F-QRY` | no provider read-through or descriptor reconstruction |
| `Q08` | descriptor / risk summary | `F-QRY` | no policy approval/quota/cost inference |
| `Q09` | descriptor / secret safe summary | `F-QRY` | legalRedacted surface uses`MP-APP-05`; forbidden observability emission alone uses`MP-DIAG-02` |
| `Q10` | descriptor / list by capability | `F-QRY` | no cursor persistence or descriptor create |
| `Q11` | relation / governance seam | `F-QRY` | no governance invocation/approval audit |
| `Q12` | relation / governance separation | `F-QRY` | optional seam absence remainsnormal |
| `Q13` | relation / method relation | `F-QRY` | no method body/execution or relation write |
| `Q14` | relation / list relations | `F-QRY` | no relation merge/capture |
| `Q15` | exposure / formal boundary | `F-QRY` | no policy mutation/runtime allow/SDK publish |
| `Q16` | exposure / applicability | `F-QRY` | applicability isnot authorization；no deny record |
| `Q17` | exposure / controlled view | `F-QRY` | stale/rebuilding/unavailable marker only；norefresh Job |
| `Q18` | exposure / runtime-tools consumable list | `F-QRY` | no tools invocation/cache/allowlist write |
| `Q19` | exposure / SDK boundary | `F-QRY` | no SDK generation/package/publication metric |
| `Q20` | trace-impact / access trace | `F-QRY` | partial/handoff-pending marker only；noappend/repair |
| `Q21` | trace-impact / change impact | `F-QRY` | visible missing may remainnormal；noimpact write |
| `Q22` | trace-impact / downstream summary | `F-QRY` | stored item Delayed/Unavailable isbusiness read value，not processing retry metric |
| `Q23` | trace-impact / audit handoff summary | `F-QRY` | no handoff Port call、evidence或signature metric |
| `Q24` | derived material / search directory | `F-QRY` | stale/rebuilding/unavailable marker only；no projection rebuild |
| `Q25` | derived material / browse directory | `F-QRY` | empty page normal；no current-truth reconstruction |
| `Q26` | derived material / audit export | `F-QRY` | no raw telemetry/audit body或external handoff |
| `Q27` | derived material / ecosystem summary | `F-QRY` | no marketplace listing/ranking/pricing/transaction metric |
| `Q28` | derived material / reconciliation report | `F-QRY` | immutable report read only；no Job/report reconstruction |
| `Q29` | reference / resolution state | `F-QRY` | read persisted canonical state；no resolver refresh |
| `Q30` | reference / external document | `F-QRY` | no document body/state refresh |
| `Q31` | reference / runtime-tools consumer | `F-QRY` | no runtime/tools invocation/result/cache |
| `Q32` | reference / SDK consumer | `F-QRY` | no client/package/generated code read |
| `Q33` | reference / observability-audit ref | `F-QRY` | no raw telemetry/audit body、audit truth或handoff success |

Query set arithmetic：`Q01..Q33 = 33`。全部33条的`MP-IDEM-01`, `MP-UOW-01/03/04`, `MP-OUT-01..04`, `MP-MAT-01/02`, `MP-JOB-01..08` emission为0；`MP-DIAG-02`只在observability emission gate实际违规时成立，不是每个legal Redacted surface的默认metric。

### 60.4 Inbound 6/6 exact mapping

| ID | operation group / source | final profile expression | exact conditional metric / explicit exclusion |
|---|---|---|---|
| `I01` | inbound_reference / governance result | `F-IN + X-RESOLVE + conditional X-CAPTURE` | resolver first-return issue归`MP-PORT-01`；receipt issue归`MP-WORKER-03`；accepted actual reference change才形成capture；no governance approval/Policy truth metric |
| `I02` | inbound_reference / method asset | `F-IN + X-RESOLVE + conditional X-CAPTURE` | same unique-owner rule；no method body/source/execution or automatic Command metric |
| `I03` | inbound_impact / downstream feedback | `F-IN + conditional X-CAPTURE` | valid payload `Delayed/Unavailable/Ignored`仍是accepted stored fact，不产生`retry_required`；只有processing prerequisite delayed才由receipt owner形成issue |
| `I04` | inbound_reference / external capability source | `F-IN + X-RESOLVE + conditional X-CAPTURE` | no provider/MCP/A2A/API body、credential、identity create或runtime integration metric |
| `I05` | inbound_reference / audit material | `F-IN + X-RESOLVE + conditional X-CAPTURE` | legalBodyForbidden/quarantine issue归receipt owner；只有observability emission gate泄漏尝试才发`MP-DIAG-02`；no evidence/handoff success metric |
| `I06` | inbound_reference / external document | `F-IN + X-RESOLVE + conditional X-CAPTURE` | no document/OpenAPI/schema body、descriptor mutation或automatic support attach metric |

Inbound set arithmetic：`I01..I06 = 6`。`MP-WORKER-02`在header-first gate失败时发射，application未调用，因此该branch没有`MP-WORKER-03/06`、idempotency、UoW、resolver或capture sample。`DuplicateReplayed`只发一次`MP-IDEM-01` classification和caller receipt boundary；不重跑resolver、effect write或capture。

### 60.5 Outbound 10/10 exact mapping

所有Outbound event continuation都使用`F-OUT`。`handoff_kind`按callable映射为`event_collaborate/event_get/event_list/event_repair/event_bind`；normal immediate continuation使用`event_collaborate`和`event_bind`，repair Job另按J08选择get/list/repair。Phase A `MP-OUT-01/02`与source Command/Inbound/Job表中的`X-CAPTURE`指向同一个capture formation，不得因为C/I/J和O两张reverse map都列出而发两次。下表固定source subject的`operation_group`，绝不把event name、flow ID或capture ref放入label。

| ID | exact outbound subject | final profile expression | three-phase invariant / explicit exclusion |
|---|---|---|---|
| `O01` | capability identity changed | `F-OUT`; group=`identity` | exact identity change source -> official capture -> external status -> local bind；no current identity remap或audit acceptance metric |
| `O02` | capability registry changed | `F-OUT`; group=`registry` | registry change record only；no reconciliation report、directory或marketplace delivery inference |
| `O03` | adapter descriptor changed | `F-OUT`; group=`descriptor` | immutable descriptor snapshot only；no secret/provider response、adapter execution health或current descriptor rebuild |
| `O04` | governance seam relation changed | `F-OUT`; group=`relation` | external collaboration不表示governance approval/workflow decision |
| `O05` | capability method relation changed | `F-OUT`; group=`relation` | no method body/source/execution或method-library lifecycle mutation |
| `O06` | formal exposure boundary changed | `F-OUT`; group=`exposure` | no runtime allow/deny、SDK publication、marketplace listing或consumer execution conclusion |
| `O07` | controlled consumer view availability changed | `F-OUT`; group=`exposure` | exact view revision is source；no runtime cache delivery/current-view rebuild |
| `O08` | capability change impact identified | `F-OUT`; group=`trace_impact` | exact Identified impact only；no downstream execution/billing/acceptance metric |
| `O09` | derived material refreshed | `F-OUT`; group=`derived_material` | source限directory/audit export/ecosystem/reconciliation variants；no marketplace/evidence/auto-repair metric |
| `O10` | reference resolution changed | `F-OUT`; group=`reference` | canonical local state revision only；resolver response/provider health不成为event source |

Outbound set arithmetic：`O01..O10 = 10`。Phase A `MP-OUT-01/02`、Phase B official load `MP-OUT-03`、external Port `MP-PORT-05/06`和Phase C `MP-OUT-04`是四个不同事实。任何实现若用一个“publish success”Counter替代、从external `Delivered`推导local bind、从local bind推导external delivery，或将Phase B failure回滚source，均违反本表。

### 60.6 Operations Job 8/8 exact mapping

所有Job使用`F-JOB`；`X-MAINT`只在one frozen target或finalization owner实际进入时发射。`MP-JOB-03`只观察fresh / empty committed plan、matching journal reentry及planning rejection/failure；completed duplicate、conflict和in-progress只由`MP-IDEM-01`分类。`MP-JOB-04`只观察journal的`Planned / Succeeded / Failed / Skipped`四种target outcome，`MP-MAT-01`观察material/reference/capture semantic outcome；同一issue只能按§59选择一个owner。

| ID | `job_kind` / maintenance subject | final profile expression | `material_kind` map / durable authority and exclusion |
|---|---|---|---|
| `J01` | `run_capability_registry_reconciliation` | `F-JOB + X-MAINT + conditional X-CAPTURE` | `material_kind=reconciliation_report`；report来自frozen journal；不repair registry、不从finding Counter生成report |
| `J02` | `refresh_controlled_consumer_view` | `F-JOB + X-MAINT + conditional X-CAPTURE` | `controlled_consumer_view`；exact view revision/no-op；不改formal exposure、不持久化intermediate Rebuilding |
| `J03` | `rebuild_directory_search_browse_projection` | `F-JOB + X-MAINT + conditional X-CAPTURE` | `directory_projection`；不backfill registry/descriptor/exposure，不使用marketplace fallback |
| `J04` | `prepare_audit_friendly_export_summary` | `F-JOB + X-MAINT + conditional X-CAPTURE` | `audit_export`；summary/allowed refs only；无raw telemetry、evidence alias、signature或external handoff claim |
| `J05` | `rebuild_read_only_ecosystem_discovery_summary` | `F-JOB + X-MAINT + conditional X-CAPTURE` | `ecosystem_discovery`；read-only summary only；无listing/ranking/pricing/transaction或runtime route |
| `J06` | `run_derived_material_reconciliation` | `F-JOB + X-MAINT + conditional X-CAPTURE` | target用existing specific material kind，pure finalization用`reconciliation_report`；report state不触发nested Job、repair或core truth mutation |
| `J07` | `refresh_external_reference_resolution` | `F-JOB + X-RESOLVE + X-MAINT + conditional X-CAPTURE` | `reference_resolution`；canonical state revision/no-op only；resolver status不是provider health，不reopen terminal state |
| `J08` | `repair_capability_access_event_collaboration` | `F-JOB + X-COLLAB + X-MAINT` | `event_capture`；list page成功使用collaboration `outcome=listed`，每个selected item再exact load；只有stable intent需要local bind时发`MP-OUT-04`；不rerun mapper、读current source、创建new event/capture/intent或local delivery state |

Job set arithmetic：`J01..J08 = 8`。`MP-JOB-05`和`MP-MAT-01`都只能观察已有durable journal/report/result或frozen target outcome；它们的Counter值、Histogram样本、structured log或current truth scan均不得成为report item、final disposition、reentry或retry authority。

### 60.7 Exact-set与non-flow owner closure

| audit item | expected | actual | result |
|---|---:|---:|---|
| Command exact IDs | 26 | 26 | pass |
| Query exact IDs | 33 | 33 | pass |
| Inbound exact IDs | 6 | 6 | pass |
| Outbound exact IDs | 10 | 10 | pass |
| Operations Job exact IDs | 8 | 8 | pass |
| total exact protocol-flow IDs | 83 | 83 | pass |
| missing / extra / duplicate IDs | 0 / 0 / 0 | 0 / 0 / 0 | pass |
| Query mapped to write/reserve/capture/repair/Job metric | 0 | 0 | pass |
| Outbound phase collapsed to one delivery metric | 0 | 0 | pass |
| Job report reconstructed from metric/log/current truth | 0 | 0 | pass |

Non-flow owners也已覆盖：config validation=`MP-INFRA-01`，Stage 0~7=`MP-INFRA-02/03`，36-slot binding one-hot=`MP-INFRA-04`，entry complete predicate=`MP-INFRA-05`，Stage 0~7 failure后的startup prefix cleanup=`MP-INFRA-06`，Worker source/startup/shutdown lifecycle=`MP-WORKER-01/05`，Jobs owned-process drain/join=`MP-JOB-07`，observer failure=`MP-DIAG-03`。这些profile不需要伪造一个第84条generic flow。

## 61. 特殊分支、重复计数与authority审计

### 61.1 多issue carrier的primary规则

一个protocol rejection、Inbound receipt、Query surface或Job report可以携带多个body-free issue ref，但terminal Counter不能因此把同一个receipt/report计成多次。最终规则如下：

| carrier / branch | metric primary selection | supplemental issue treatment |
|---|---|---|
| Command rejection | exact primary rejection code是`MP-APP-01.error_family`；若在service前形成则由`MP-ENTRY-01`拥有 | supplemental forbidden/policy code只保留在typed issue set和structured log，不另发metric |
| Inbound quarantine | `BoundaryQuarantined`为`MP-WORKER-03.error_family` | 同时存在的`BodyForbidden`是supplemental no-metric issue；forbidden值仍不得记录 |
| Inbound delayed | `RetryRequired`为`MP-WORKER-03.error_family` | `NoLocalEffect`是marker而非`CapabilityIssueCode`，不进入metric taxonomy |
| Query surface | 每个existing `CapabilityQueryDegradedMarker`分别发一条`MP-APP-05`；没有marker时发一条`error_family=none` | 同一marker只发一次；API层不复制；normal missing/empty/NotVisible若无marker只发`none` |
| Job target | exact target reason是`MP-JOB-04`或`MP-MAT-01`中的唯一semantic owner，按§59 selector二选一 | impact、advisory和report copy不重复发该issue；technical target error改走`MP-DIAG-01` |
| Job final report | finalization自身形成的primary rejection/partial issue才可进入`MP-JOB-05` | 已在target/maintenance阶段发射的run/target issues不按report `issue_refs`重放 |

因此 §59 的51行表示“该code作为primary时的唯一metric owner”。Supplemental/copy occurrence显式为no-metric exception；它仍保留在既有typed carrier，不会丢失业务或排障语义。实现不得为了“让每个issue都有一条指标”重复计terminal carrier。

### 61.2 高风险分支最终矩阵

| special branch | exact metric emissions | preserved authority | forbidden duplicate / inference | result |
|---|---|---|---|---|
| fresh reserve | `MP-IDEM-01 disposition=fresh_reserved`一次；随后只按真实UoW/flow发射 | atomic reservation winner | 再发generic replay/conflict metric；由Counter生成reservation | pass |
| completed duplicate replay | `MP-IDEM-01 disposition=duplicate_replayed`或`winner_replayed`一次；caller completion/receipt/report boundary可各观察自己的return | exact stored result/receipt/report | effect write、capture、resolver、Port、Job target、second reserve；caller复制idempotency error family | pass |
| same-key conflict | `MP-IDEM-01 disposition=conflict/winner_conflict`一次，family按exact public/internal issue二选一 | winner record/state/version不变 | persisted Conflict、key/hash/digest/attempt label、`MP-DIAG-01` duplicate | pass |
| in-progress | `MP-IDEM-01 disposition=in_progress/winner_in_progress`一次 | concrete active owner/exact read | wait/lease/attempt/retry lifecycle、second reserve、timeout-derived retry | pass |
| Job planning after idempotency branch | 只有fresh committed journal、empty committed journal、matching `Planned` journal reentry、planning rejection/failure进入`MP-JOB-03` | initial journal / exact matching journal / application planning owner | completed duplicate、conflict、in-progress再次作为plan disposition | pass |
| Job target no-op / retryable impact | `MP-JOB-04`只发`planned/succeeded/failed/skipped`；`Unchanged`仍映射`succeeded`，`RetryablePrerequisite`仍映射`failed`并只影响`MP-JOB-05` final disposition | `CapabilityJobExecutionTargetOutcome` + typed success/failure impact | `no_op/retryable`第五或第六target outcome、由Counter授权retry | pass |
| reserve race loser | rollback metric按真实rollback phase；一次bounded winner classification | same-authority winner read | recursive reserve、new business id/resolver/factory、winner body label | pass |
| Query no-write | `MP-ENTRY-01/02/03`, `MP-APP-03/04/05`, local read `MP-UOW-02`，必要technical `MP-DIAG-01` | resolver-first read decision and repositories | `MP-IDEM-01`, `MP-UOW-01/03/04`, `MP-OUT-*`, `MP-MAT-*`, `MP-JOB-*` | pass 33/33 |
| commit Durable | `MP-UOW-01 commit_durable`; `MP-UOW-04 outcome=durable`一次 | UoW commit authority/read barrier | 由Counter证明effect completeness、accepted audit或external delivery | pass |
| commit NotDurable | `MP-UOW-01 commit_not_durable`; `MP-UOW-04 not_durable`; `MP-DIAG-01 transaction_commit_failed`一次 | same authority证明原transaction永不durable | row absence/elapsed推断、success metric、blind retry | pass |
| `CommitOutcomeUnknown` | original commit=`MP-UOW-01 commit_unknown` + `MP-UOW-04 unknown` + `MP-DIAG-01 commit_outcome_unknown`；每次declared recovery phase另发对应`recovery_*`和该phase error occurrence | transaction ref + `resolve_commit` + barrier/exact reads | 合并normal failure/success、沿用last metric value、blind retry、发transaction ref label | pass |
| rollback succeeded | `MP-UOW-01 rollback_succeeded`；原始failure保持其owner | rollback authority only | command/job success、zero-effect超出authority、覆盖原始failure | pass |
| rollback failed | `MP-UOW-01 rollback_failed` + `MP-DIAG-01 transaction_rollback_failed`；原始failure另保留 | unresolved local effect boundary | normal business Failed、zero-effect、automatic retry、覆盖原始failure | pass |
| `ConsistencyDefect` | forming boundarygeneric `contract_defect/consistency_defect/planned` + `MP-DIAG-01 consistency_defect` | exact tuple/sidecar/source-version invariant owner | missing/unavailable/Degraded/Quarantined/retryable降级、synthetic repair | pass |
| typed external unavailable | resolver/handoff/collaboration semantic profile按closed outcome和§59 owner发射 | valid typed external outcome | 自动转`DependencyFailure`、provider health truth或retry authorization | pass |
| no legal external typed return | Port profilegeneric `failed/technical_failure` + `MP-DIAG-01 dependency_failure` | raw-to-typed adapter classifier | 同时发typed unavailable issue、解析raw status/text决定retry | pass |
| legal Redacted/Forbidden surface | semantic owner发`redacted_boundary/body_forbidden`或Query marker | existing public-safe typed boundary | `MP-DIAG-02`、leaked field/value、normal technical failure | pass |
| observability redaction violation | `MP-DIAG-02 redaction_violation`一次 | existing emission allowlist gate | 再发`BodyForbidden/RedactedBoundary`、输出命中值/field name、改变business result | pass |
| observer sink failure | 只有独立non-recursive fallback发`MP-DIAG-03`一次；失败的原metric不重试 | original business/metric owner remains unchanged | sink自观察、recursive loop、observer retry state、rollback/disposition change | pass |
| Outbound Phase A | `MP-OUT-01/02` + actual UoW profiles | source/snapshot/capture local authority | delivery success、Phase B/C total duration、current truth rebuild | pass |
| Outbound Phase B | `MP-OUT-03` + `MP-PORT-05/06` | official capture load + external typed outcome | local delivery state、Phase A rollback、capture recreation | pass |
| Outbound Phase C | `MP-OUT-04` + actual declared bind UoW profiles；source/Worker用short UoW，J08用target UoW + journal success | local capture intent CAS | external `Delivered` inference、second intent/capture/event、J08提前独立commit bind | pass |
| Job target/report | `MP-JOB-04`, optional`MP-MAT-01/02`, final`MP-JOB-05`按actual phases | durable journal/report/result and frozen target | 从logs/counters/Gauge/current truth生成report、counter决定retry/finalization | pass |
| deadline timeout | exact owner发`timed_out`；Histogram只在其declaredboundary观察 | non-cancelling ownership procedure | cancellation/detach/retry/second invocation推断 | pass |
| binding Gauge refresh | 36 slot x four-state one-hot，同组当前1其余0 | direct Step 14 binding state | startup failure Counter、provider health、last known state推导 | pass |
| entry barrier Gauge refresh | selected entry direct predicate 0/1 | complete Stage 0~7 + factory/runtime/static coverage predicate | listener/task存活或请求成功率推导 | pass |
| Gauge owner unavailable/destroyed | current cycle不刷新；不保留进程内last-value作为truth | no current proof | 默认Configured/Healthy、添加Unknown state、从cleanup推导 | pass |

### 61.3 指标与业务决策的单向性

```text
existing typed authority
  -> metric-specific closed mapper
  -> one Counter increment / Histogram observation / Gauge refresh
  -> backend-neutral observation only

metric value / scrape / log count / alert
  -X-> capability truth or relation mutation
  -X-> idempotency reserve / replay body / winner classification
  -X-> commit resolution / rollback proof / recovery read
  -X-> external collaboration delivery state
  -X-> Job journal / target outcome / report / retry eligibility
  -X-> audit fact / evidence alias / acceptance sign-off
```

metric调用必须位于typed owner已形成观察值之后，且在错误返回路径上保持best-effort non-authoritative。具体backend API、macro、global recorder或dependency仍未选择；实现计划若需要引入crate或共享instrument registry，必须在后续 `07` planned boundary中基于本表固定名称/labels接线，不能修改owner、taxonomy或业务流程。

## 62. R15.8 机械自检、跨Step闭合与stop-review snapshot

### 62.1 机械与语义自检

以下数量指设计表行，不表示实现、运行或测试结果。

| audit item | expected | actual | result |
|---|---:|---:|---|
| R15.7 editorial candidates decided | 59 | 59 | pass |
| keep / merge / reject candidate decisions | 48 / 8 / 3 | 48 / 8 / 3 | pass；keep含3个merge anchor，8是candidate reduction数 |
| final metric profiles | 48 | 48 | pass |
| Counter / Histogram / Gauge profiles | 34 / 12 / 2 | 34 / 12 / 2 | pass |
| unique backend-neutral metric identifiers | 48 | 48 | pass |
| Counter names ending `_total` | 34 | 34 | pass |
| Histogram names ending `_duration_seconds` | 12 | 12 | pass |
| retained material/reference/report Gauges | 0 | 0 | pass；`MT-MAT-01..03` rejected |
| retained direct-authority Gauges | 2 | 2 | pass；binding one-hot + entry predicate |
| profile-specific `protocol_family` domains | 2 | 2 | pass；API=`command/query`，idempotency=`command/inbound/job` |
| Job planning dispositions excluding idempotency classification | 5 | 5 | pass；duplicate/conflict/in-progress只归`MP-IDEM-01` |
| `CapabilityJobExecutionTargetOutcome` metric values | 4 | 4 | pass；`planned/succeeded/failed/skipped` |
| Worker lifecycle literals with exact Step 14 authority | 5 | 5 | pass；parked/active/stopping/draining/joined |
| fixed `port_family` values | 36 | 36 | pass；5 base/read-gate + 22 repository + 9 external |
| `ApplicationError` owner rows | 17 | 17 | pass |
| `CapabilityIssueCode` owner rows | 51 | 51 | pass |
| exact Command / Query / Inbound / Outbound / Job mapping | 26 / 33 / 6 / 10 / 8 | 26 / 33 / 6 / 10 / 8 | pass |
| total exact flow mapping | 83 | 83 | pass |
| Query write/reserve/capture/repair/Job metric mapping | 0 | 0 | pass |
| dynamic / optional label-key profile | 0 | 0 | pass |
| forbidden identity/ref/body/secret/evidence label | 0 | 0 | pass |
| metric backend/crate/bucket/threshold/SLO selection | 0 | 0 | pass；out of R15.8 |
| new Rust declaration / structure comment delta | 0 | 0 | pass；结构体、字段、enum、variant、trait、callable注释无新增遗漏 |

### 62.2 `MD-01..10` closure

| decision id | R15.8 closure | result |
|---|---|---|
| `MD-01` | §55逐项裁决59 candidates，merge/reject均有coverage理由 | closed |
| `MD-02` | §56/§57固定48 names、34/12/2 types和seconds unit | closed |
| `MD-03` | §57逐profile固定unique owner、trigger、start/end和authority boundary | closed |
| `MD-04` | §57/§58固定每个profile label keys与closed values；API与idempotency的`protocol_family`分别限制为2值与3值；optional key=0 | closed |
| `MD-05` | §60完成83-flow exact mapping和non-flow owner closure | closed |
| `MD-06` | §59完成17 errors、51 issues unique owner；§61.1明确supplemental no-metric exception | closed |
| `MD-07` | idempotency五候选合并为一个互斥classification profile，一incoming call一次 | closed |
| `MD-08` | Outbound Phase A/load/Phase B/Phase C分别由`MP-OUT-01/02`, `03`, `MP-PORT-05/06`, `04`拥有 | closed |
| `MD-09` | 删除三项无bounded authority Gauge；保留two direct Gauge并固定refresh/stale规则 | closed |
| `MD-10` | Query no-write、Job durable-report-only、plan/idempotency分离、target四variant映射、Unknown/rollback/ConsistencyDefect/observer failure见§61 | closed |

### 62.3 Cross-Step与专项边界审计

| boundary | R15.8 assertion | result |
|---|---|---|
| Step 6 objects / states | metrics只读取既有typed objects/state/outcome；无metric-owned object、state或report | pass |
| Step 7 Ports | 36-value `port_family`完整复用36/36 Port；未新增Observability Port、finder或adapter API | pass |
| Step 8 protocol | 83 protocols、existing dispositions/visibility/freshness/issues复用；API和idempotency `protocol_family`分别限制到真实协议族；无wire/DTO字段变化 | pass |
| Step 9 flow | 83/83 exact mapping；Job duplicate/conflict/in-progress在planning前终止，target四variant与journal一致；无第84条generic flow或recursive observer flow | pass |
| Step 10 state | binding/collaboration/UoW/Job existing state保持owner；Worker lifecycle仅投影Step 14 action boundary；无Observed/Healthy/DeliveredByMetric | pass |
| Step 11 UoW | metric不证明effect/durability；commit三态、rollback和recovery authority保持独立 | pass |
| Step 12 error/issue | 17/17、51/51 unique owner；raw error/text不进入label | pass |
| Step 13 concurrency | reserve/replay/conflict/in-progress/winner-read互斥；no key/digest/attempt和blind retry | pass |
| Step 14 runtime/config | Stage 0~7 exact labels、four binding states、three entry predicate、startup prefix cleanup、Worker五个lifecycle authority及Jobs owned drain/join owner复用 | pass |
| capability identity / registry / descriptor | 只按closed operation group观察；无provider runtime、quota、cost或secret body | pass |
| governance / method relation | only resolver/handoff/ref observation；无approval/Policy truth或method body/execution | pass |
| SDK / runtime / tools / marketplace | controlled read/reference boundary only；无execution、client/package、listing/transaction metric | pass |
| external collaboration | external typed status与local capture/intent state分离 | pass |
| Job | journal/report/result仍是唯一durable authority；metric不是report或retry input | pass |
| audit/evidence | metric不生成audit fact、evidence alias、acceptance signature、run_id或sign-off | pass |

当前无 unresolved upstream blocker。`CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` 与 `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` 继续作为non-blocking cross-repository design debt；本批没有声明上游实现或设计同步已完成。

### 62.4 Stop-review snapshot

| item | current stop state |
|---|---|
| current formal document | `03-详细设计.md`；正式正文未修改，仍等待Step 19 assembly |
| current calibration artifact | `03_ddd_step_15_observability_audit.md` |
| completed batch | `R15.8 metric cuts:再写入` |
| batch status | `03_step_15_r15_8_completed_stop_review` |
| candidate decision | 59/59；48 keep profiles、8 merge reductions、3 rejects |
| final metric profiles | 48：34 Counter、12 Histogram(seconds)、2 Gauge；Job plan/target、protocol-family与runtime-lifecycle语义复核通过 |
| exact flow closure | 83/83：Command 26、Query 33、Inbound 6、Outbound 10、Job 8 |
| error / issue closure | `ApplicationError` 17/17；`CapabilityIssueCode` 51/51；supplemental/copy no-metric rule fixed |
| Gauge closure | binding one-hot + entry complete predicate retained；material/reference/report Gauge=0 |
| new Rust declaration / comment delta | 0；结构体与字段注释无新增遗漏 |
| upstream blocker | none |
| non-blocking debt | `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001`; `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` |
| implementation artifact | not created；implementation ledger与planned boundary skeleton仍禁止提前生成 |
| claimed implementation / test / evidence / sign-off | none；无commit、run_id、真实evidence alias、测试结果或验收签署声明 |
| commit | not requested and not created |

本批完成后停止在 Step 15 的 R15.8 review gate。未经用户下一次明确确认，不进入R15.9，不修改正式`03/04`，不创建Step 16或任何implementation artifact。

## 63. R15.8 下一批门禁

```text
document = 03-详细设计.md
step = 15
completed_batch = R15.8 metric cuts:再写入
status = completed_stop_review
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_9
next_batch = R15.9 trace / span / correlation:先思考
allowed_scope_after_confirmation = metadata source inventory, entry/application/Port/Worker/Jobs span candidates, propagation and correlation ownership, no-payload/no-truth principles, exact flow reverse coverage as thinking artifact only
must_read_before_next_batch = this file §§15~19, §§35~46, §§54~62; 详细设计讨论流程_SOP.md Step 15; 详细设计书写规范.md §5.14; Step 8 metadata carriers; Step 9 exact call boundaries; Step 14 runtime and external binding handoff
forbidden_until_next_gate = final trace/span table, audit/operations fact table, redaction final table, formal 03 assembly, 04, Step 16+, implementation ledger, planned boundary skeleton, code, tests, run_id, evidence, sign-off, commit
unresolved_upstream_blocker = none
```

R15.9 只允许先思考 trace / span / correlation 主语、metadata source和传播边界；不得在同一批直接写入最终span表，也不得用trace/span补造transaction ref accessor、business state、external delivery或audit truth。

## 64. R15.9 授权、读取闭包与思考产物边界

### 64.1 授权与恢复点消费

用户已确认从 `03_step_15_r15_8_completed_stop_review` 进入 `R15.9 trace / span / correlation:先思考`。本批只形成 trace / span / correlation 的候选主语、来源和边界推导，完成后停审；不进入 `R15.10`，不修改正式 `03-详细设计.md`，不创建 `04-配置设计.md`、Step 16~19、implementation ledger 或 planned boundary skeleton。

本批已重新读取并交叉核对：

1. `详细设计讨论流程_SOP.md` Step 15、`详细设计书写规范.md` §5.14 和 `设计真相源闭环与可落码性标准.md` 的可观测性 / 业务审计分层规则。
2. 本文件 §§15~19、§§35~46、§§54~63，保持六层观察主语、structured-log 字段来源和 metric owner 不变。
3. Step 6 `CapabilityOperationContext`、stored result、snapshot / capture、Job execution journal 的字段和 factory；Step 7 九个 external Port 的 exact signature。
4. Step 8 Command / Query / Inbound / Outbound / Job metadata carrier，以及 83 个协议到 Step 9 flow 的映射。
5. Step 9 shared Command / Inbound / Query / Outbound / Job guard、三阶段 Outbound 边界、各 UoW 和 duplicate / reentry 路径。
6. Step 14 API / Worker / Jobs non-cancelling invocation、observation timeout、continuation、deadline、drain / join 和 Stage 0~7 handoff。
7. 实际 sibling `/home/aris/Projects/quantalithos-core/crates/contracts/src/metadata.rs` 与 `events.rs`，只为核实当前共享类型 shape；本批没有修改该实现仓。
8. `L1-governance`、`L1-artifact` Step 15 trace / span 小节，只借用表格深度，不继承其 business trace、outbox、relay、audit trail 或 handoff marker 语义。

### 64.2 本批产物如何读取

本批使用 `SPC-*`、`SB-*` 和 `CL-*` 作为 **editorial candidate token**。它们只帮助比较候选切口和反向覆盖，不是最终 span name、Rust constant、trait、event key、metric identifier、配置 key 或 backend schema。R15.10 必须逐项 keep / merge / reject 后，才能形成最终 trace / span / correlation 表。

| 本批允许固定 | 本批仍不得固定 |
|---|---|
| metadata 的唯一来源与派生方向 | 最终 span name、kind、status、attribute key allowlist |
| 哪个代码 owner 可以开始 / 结束候选 span | OpenTelemetry / `tracing` / `log` 或 exporter 绑定 |
| observation 与 non-cancelling invocation 的拆分理由 | sampling、baggage、trace flags、retention、export policy |
| parent 不可证明时必须使用 correlation / link 的原则 | W3C parent / child 兼容性声明或远端 propagation 成功声明 |
| body-free ref 可以作为候选关联来源的条件 | 最终哪些高基数 ref 必须写入每个 span |
| 83 个 exact flow 是否存在候选覆盖 | 审计事件、operations fact、redaction 最终表 |

## 65. Metadata 与 correlation source inventory

### 65.1 共享 core shape 的实际能力

当前 `core-contracts` 的实际 shape 如下：

| 类型 / 字段 | 当前正式能力 | 本批裁决 |
|---|---|---|
| `TraceId` | 通过 `string_newtype!` 定义的 distributed trace identifier；当前 contract 未声明固定字节长度、hex 格式、version、parent span、flags 或 sampling bit | 只能作为既有 opaque correlation identifier；不能仅凭类型名宣称它是完整 distributed trace context |
| `RequestMetadata` | `request_id`、`trace_id`、optional `idempotency_key`、`requested_at` | Command / Query 当前 invocation 的 request / trace 唯一来源；不存在第二份 parent metadata |
| `CommandMetadata` | `RequestMetadata` + optional reason / external ref | reason / external ref 不是 trace baggage；不得进入 parent 选择或 sampling 决策 |
| `QueryMetadata` | `RequestMetadata` + optional page + consistency | page / consistency 只影响 Query 语义；不得用于生成 trace identity |
| core `CloudEventEnvelope.traceparent` | 当前实现直接复制 `RequestMetadata.trace_id`，另有 optional string `tracestate` | 字段名不构成 W3C shape 证明；Capability Hub 不得据此解析出不存在的 parent span id 或 flags |
| `SpanId` / parent / trace flags / baggage | 当前检索结果为不存在 | R15.9 不新增本地替代类型；跨进程 parent-child 传播当前不可证明 |

这不是当前 R15.9 的 unresolved upstream blocker：当前详细设计可以闭合 **TraceId 级 correlation + process-local runtime span**。但 R15.10 必须明确将 remote parent propagation 标为当前 unsupported / not claimed；若未来需求要求完整跨进程 parent-child、sampling continuity 或 baggage，必须先升级 L0-core contract 并受控回开 Step 6 / 7 / 8 / 14，不能由 adapter 私加 header 或让 Hub 复制第二套 context。

### 65.2 五类协议的唯一来源

| 协议族 / phase | trace authority | 其他可关联 identity | application 内派生 | 禁止替代 |
|---|---|---|---|---|
| Command entry | `CapabilityCommandRequest.metadata.request.trace_id`；actor 另由 `actor_context` 提供 | `request_id`、closed command name；形成后才有 result / change / traceability / capture refs | `CapabilityOperationContext::from_command` 接收的显式 `trace_id` 必须与 metadata 相等，context copy 不是第二 authority | route、idempotency key、reason、result id、actor id 生成 trace |
| Query entry | `CapabilityQueryRequest.metadata.request.trace_id` | `request_id`、closed query name、read subject / page scope | `CapabilityOperationContext::from_query` 只复制已校验 trace；Query metadata 的 idempotency key 必须保持 write metadata 禁入规则 | page token、consistency、visible subject、current time 生成 trace |
| Inbound entry | `CapabilityInboundEventEnvelope.trace_id` | public `source_event_ref`、local one-way mapped `CapabilityInboundEventRef`、consumer name、source family | `from_inbound_event` 复制 envelope trace，并保留 public/local 双 ref；payload 不重复 metadata | topic、partition、offset、delivery token、payload locator、source key 生成 trace |
| Outbound Phase A | source-owning `CapabilityOperationContext.trace_id` 或 exact source contract 已要求的同源 trace；写入 public envelope 和 immutable snapshot | `(event_name,schema,source_ref)`、snapshot ref、capture ref | snapshot 独占 complete bytes 与 source trace；capture 只持有 snapshot / source / schema / digest / time 对称，不新增 trace 字段 | post-commit time、physical route、external intent、current truth 重算 trace |
| Operations Job entry | `CapabilityJobMetadata.trace_id` | `run_id`、job name、schema；形成后才有 journal / result / report refs | initial plan 复制到 `CapabilityJobExecutionRecord.trace_id`；reserved reentry 的业务记录继续使用 journal 原始 trace | scheduler id、process id、attempt、result ref、report ref 生成 trace |

Command / Query factory 目前同时接收 metadata 和显式 `TraceId`，但 Step 6 已固定“二者一致性由 Step 8 mapper 校验”。因此显式参数只是 validated copy，不允许 API normalizer提供两个不同值后由 application 选一个。Inbound / Job 同理只接受 envelope / metadata 已校验值。

### 65.3 非协议 owner 的来源与 absent 语义

| owner / activity | 是否已有 protocol trace | 可用 correlation source | absent 时的正确行为 |
|---|---|---|---|
| Stage 0~7 runtime builder | 否 | selected entry、stage、binding family、startup diagnostic category | 使用 process-local startup span / event 候选；不得生成 fake protocol trace |
| Worker source task fetch / parked lifecycle | fetch 前没有 | source slot、source family、task lifecycle | 保持无 protocol trace；取得并验证 envelope header 后才可关联其 `TraceId` |
| API pre-normalization reject | 可能尚无可信值 | route family、entry phase、safe rejection category | 本地 span 可以存在，但 trace correlation absent；不得接受 malformed raw value作为 trace |
| Jobs raw request / pre-header reject | 尚无可信值 | job entry phase、safe admission category | 保持 correlation absent；不得伪造 `run_id` 或 trace |
| external Port callable | trait signature没有 `TraceId` / context参数 | application callsite 的当前 invocation context + typed subject/ref | 只可形成 Hub 本地 call span；不得声称 adapter 已向远端传播 parent context |
| Outbound exact-ref continuation | caller只提供 capture ref，开始时没有新的 protocol metadata | capture ref；official snapshot加载后可取得 historical source trace | 先以 local invocation + capture ref关联；加载后只能 link / correlate source trace，不得把历史 trace 改成当前 parent |
| Worker / Jobs shutdown、drain、join | 通常没有单一protocol trace | runtime owner、source slot / entry kind、当前仍在drain的invocation安全ref | lifecycle observation独立；不得把一次 shutdown 归入任意最后请求 trace |

`absent` 有两种不同含义：协议要求 trace 但缺失 / malformed 时，按 Step 8 / 12 的既有 validation 或 entry error 拒绝；startup、task lifecycle、pre-header reject 本来就没有 protocol trace时，允许 process-local span 不带该关联。两者都不得通过 random id、timestamp、request id、run id 或 hash 补齐。

### 65.4 Durable carrier 与 current invocation 必须分开

| durable carrier / replay branch | durable trace role | 当前 invocation role | 必须采用的关联姿态 |
|---|---|---|---|
| stored Command result / rejection | 保存 original accepted / stored operation trace | duplicate request有自己的 current request / trace | 当前 duplicate span不切换为original trace；通过 result ref + original trace做historical link候选，不产生mutation child span |
| stored Inbound receipt | 保存 original receipt operation trace | redelivery envelope带current source trace，且必须通过same request identity/digest规则 | redelivery invocation保留current trace；stored receipt ref / original trace只作replay correlation |
| stored Job report | 保存original finalized execution trace | completed duplicate runner invocation有current metadata trace | 当前 runner span与stored report/result关联，不把replay画成original Job span继续运行 |
| Job execution journal | 初次完整 plan 的 actor / run / trace是后续target record的业务metadata authority | reserved reentry本身可能是新的runtime invocation | runtime span使用current invocation；journal original trace作为durable-record / historical link，target业务记录继续按Step 9使用journal trace |
| event payload snapshot | 保存source operation trace与complete envelope | immediate continuation、crash recovery或repair Job是后续独立invocation | 只能通过snapshot / capture / source refs建立link；绝不跨崩溃窗口延长source span |

## 66. Trace、span 与 correlation 的角色拆分

### 66.1 五种角色不是五个新字段

| editorial role | 含义 | owner | 不得混同 |
|---|---|---|---|
| current invocation trace | 当前 API / Inbound / Job 请求携带的 `TraceId` | validated entry metadata | stored original trace、business traceability record id、run id |
| historical source trace | snapshot、stored result、journal或committed record中已保存的 original `TraceId` | durable carrier owner | 当前 parent context、retry permission、recovery checkpoint |
| process-local span identity | backend在当前进程中为一次runtime interval生成的临时 identity | instrumentation backend / owning wrapper | public protocol field、repository key、business id、跨进程 parent证明 |
| stable correlation ref | request / source event / result / receipt / report / snapshot / capture / intent / subject等既有body-free ref | 形成该ref的既有owner | trace id、span id、metric label默认值、evidence alias |
| business trace / audit fact | change / traceability / impact / reference / report / handoff等已持久化事实 | domain / application repository + UoW | runtime trace、span status、structured log或metric |

这些名称只描述设计角色，不新增 Rust field。R15.10 若保留 process-local span，span id必须由backend内部生成且不得进入 contracts、domain、repository、Port、stored result、snapshot、journal、public response或metric label。

### 66.2 Parent、link 与 attribute 的判定顺序

```text
是否存在同一runtime拥有的active local span?
  -> yes: 可以作为process-local parent候选；仍不等于跨进程parent已传播
  -> no:
       是否只有validated TraceId?
         -> yes: 仅建立trace-level correlation；parent span unknown
         -> no:
              是否加载到snapshot / stored result / journal historical trace?
                -> yes: 只建立historical link + stable ref correlation
                -> no: process-local root / uncorrelated lifecycle observation
```

判定必须先看 carrier 和 lifecycle，不得因为两个动作共享 `TraceId` 就推断先后、因果、parent-child 或同一次执行；也不得因为两个动作 trace 不同就否定它们由同一 result / capture / journal ref关联。

### 66.3 Non-cancelling owner 的 span 生命周期约束

API、Worker、Jobs 都已在 Step 14 固定 non-cancelling invocation：observation timeout / caller cancellation只能结束外层等待，不能 abort、drop、detach、替换或重调 application future。因此候选 trace 模型必须至少区分：

1. **observation interval**：entry / host / dispatcher 从开始等待到typed result、safe admission end或observation timeout。
2. **owned invocation interval**：exact application future从dispatch到真实 terminal；即使外层 observation已结束，它仍由runtime owner持续drive / drain。
3. **cleanup interval**：stop / drain / join只观察owner收尾；不改变application结果，也不为timeout补造zero-effect结论。

一个“HTTP request span”“Worker delivery span”或“Job process span”若在timeout时同时标记application cancelled / failed，就违反Step 14。反过来，将外层span一直保持到后台future最终完成也会把transport观察时长与application执行时长混为一谈。R15.10必须从候选中保留可表达这两段生命周期的最小集合。

## 67. 候选 span 的共同语义门禁

### 67.1 候选 start / end 的定义规则

1. start只能绑定明确代码位置：entry gate前后、exact service dispatch、repository / Port call前、UoW begin前、journal phase进入或runtime lifecycle transition。
2. end只能来自该owner已形成的typed return、typed error、protocol disposition、commit resolution、observation timeout、drain / join结果；不得从日志是否写成功、elapsed threshold或下游状态猜测。
3. 一个候选span不能跨越source commit与post-commit collaboration、Job target commit与下一次reentry、process crash与repair invocation，也不能把多个独立UoW伪装成一个atomic interval。
4. duplicate replay只覆盖current classification + stored exact read + current response；不得生成原operation的domain、capture、resolver、target或commit child span。
5. Query span可以覆盖visibility resolver和repository read，但33条Query任何分支都不能出现idempotency、write UoW、capture、handoff、repair或audit-write child span。
6. observer backend失败不结束或改写业务span的typed outcome；防递归策略仍由R15.10/R15.16闭合，当前不创建“观察observer自身”的无限嵌套候选。

### 67.2 候选 status 不是真相

| 候选 runtime status 可表达 | 不能据此表达 |
|---|---|
| callable returned / rejected / typed failed / timed out / unknown / cleanup failed | committed truth、zero-effect、external delivery、approval、accepted audit |
| commit resolver返回 `Durable / NotDurable / Unknown` | 用span success推导Durable，或用span error把Unknown改成NotDurable |
| duplicate / conflict / in-progress classification | replay body正确、original operation再次执行、retry已获授权 |
| typed external outcome category | external receipt body、Hub local delivery state、handoff evidence |
| Job target journal disposition观察 | typed report已durable、whole Job成功、验收通过 |

R15.9 不固定backend status code映射。R15.10必须确保 span status 与 R15.6 structured-log level、R15.8 metric outcome和Step 12 error precedence彼此可关联但互不替代。

## 68. Entry 与 runtime span candidates

本节和后续两节的 `SPC-*` 均是候选，不是最终span表。`correlation candidate` 只列来源类别，不承诺每项都成为最终attribute；R15.10必须按安全、cardinality、owner和重复观测裁剪。

### 68.1 API candidates

| candidate | owner / exact interval | correlation candidate | end branches | 关键拆分理由 / 禁止项 |
|---|---|---|---|---|
| `SPC-API-01` | API route / envelope observation；trusted transport接收开始 -> pre-dispatch rejection、typed response可观察、transport observation timeout或mapping failure | validated request ref、trace id、closed Command/Query name、schema、entry phase | rejected / returned / timed_out / failed | 只观察caller-visible窗口；timeout不表示application cancelled、failed或zero-effect；raw path/header/body不进入 |
| `SPC-API-02` | API-owned exact handler invocation；成功dispatch exact service future -> application future真实terminal并被runtime owner取走 | current trace、request ref、operation、outer `SPC-API-01` local relation | typed return / application error / owner invariant failure | timeout后继续存在；不能在transport span结束时结束或重建；不得形成第二次dispatch |

`SPC-API-01` 与 `SPC-API-02` 是不同生命周期候选，不预先要求两个最终span。若R15.10决定只保留一个backend span，仍必须有事件 / 属性能够区分“observation ended”与“owned invocation terminal”；否则会破坏Step 14 non-cancelling contract。

### 68.2 Worker candidates

| candidate | owner / exact interval | correlation candidate | end branches | 关键拆分理由 / 禁止项 |
|---|---|---|---|---|
| `SPC-WKR-01` | named source task owner；parked / activated后的一次fetch-or-wait cycle -> feed result、stop-before-admission或source failure | source slot、source family、task lifecycle；通常无protocol trace | item_available / stopped / source_failed | topic、partition、offset、lease、delivery token均禁入；不得把source task span当Inbound业务span |
| `SPC-WKR-02` | Worker inbound observation；validated header admission开始 -> receipt action可观察或inbound observation timeout | validated envelope trace、source event ref、consumer、source family | rejected / unsupported / receipt_observed / timed_out / failed | header通过前trace可 absent；timeout不取消`SPC-WKR-03`，不生成retry / ack truth |
| `SPC-WKR-03` | Worker-owned exact Inbound invocation；typed handler dispatch -> application receipt / error真实terminal并完成consuming completion | envelope trace、public/local source refs、operation | receipt / application_error / owner_invariant_failure | caller observation结束后继续drive；只调用同一handler，不形成第二receipt或第二key |
| `SPC-WKR-04` | exact capture-ref continuation observation；caller admission -> continuation result可观察或observation timeout | capture ref；official snapshot尚未加载时无source trace | result_observed / timed_out / spawn_rejected | 不是第七source task、scan或scheduler；timeout不替换capture ref |
| `SPC-WKR-05` | Worker-owned continuation invocation；guard armed且exact-ref future被spawn -> same future terminal / guarded completion | capture ref；加载snapshot后可link historical source trace | typed_outcome / application_error / guarded_owner_failure | 不跨crash；不把historical source trace设为current parent；不新建event/capture |
| `SPC-WKR-06` | Worker supervisor lifecycle；stop开始 -> six feed stop、continuation drain和six join全部完成或聚合cleanup failure | selected entry、source slot集合、original startup/runtime failure category | joined / cleanup_failed | 没有单一请求trace；不得归入最后一个Inbound trace、覆盖original failure或记录task/transport body |

### 68.3 Jobs runtime candidates

| candidate | owner / exact interval | correlation candidate | end branches | 关键拆分理由 / 禁止项 |
|---|---|---|---|---|
| `SPC-JRT-01` | Jobs header-first admission；owned bytes接收 -> pre-dispatch reject / no-delivery deadline / exact typed dispatch | header校验后才有job name、run id、trace | rejected / no_delivery / dispatched / failed | malformed raw bytes无可信trace/run；不得伪造public Job rejection/report |
| `SPC-JRT-02` | Jobs host observation；exact task dispatched -> terminal被观察或original monotonic deadline先到 | current metadata trace、run id、job kind | terminal_observed / deadline_elapsed | deadline只改变host观察分类；不取消task、不把typed Retryable当entry retry命令 |
| `SPC-JRT-03` | Jobs-owned invocation；spawned exact application future -> single terminal cell + join/take完成 | current metadata trace、run id、operation | typed_response / application_error / runtime_invariant_failure | deadline/caller cancellation后继续drive；不得abort、detach、替换run/key或重新调用 |
| `SPC-JRT-04` | process residual drain；observation guard恢复 `InFlight` 或 process关闭 -> same task drain/join并进入`Consumed` | run id / job kind only when validated；runtime owner | drained / drained_after_deadline / drain_failed | 不形成report或journal fact，不把process exit映射成business success，禁止queue/lease/attempt |

## 69. Application、local authority 与 Port span candidates

### 69.1 Application family candidates

| candidate | owner / exact interval | current trace source | conditional children | 禁止合并 |
|---|---|---|---|---|
| `SPC-APP-01` | exact Command application method entry -> accepted / rejected / duplicate / typed error return | Command `CapabilityOperationContext.trace_id` | `SPC-IDEM-01`、`SPC-UOW-01`、`SPC-REPO-01`、flow-declared `SPC-PORT-*`、`SPC-OUT-01` | 不把API transport timeout、post-commit external delivery或business trace record当application terminal |
| `SPC-APP-02` | exact Query application method entry -> Visible / NotVisible / Degraded / typed error return | Query context trace | local visibility / repository `SPC-REPO-01` only | 无idempotency、write UoW、capture、handoff、external resolver、repair child |
| `SPC-APP-03` | exact Inbound consumer method entry -> typed receipt / error terminal | envelope-derived context trace | conditional idempotency、resolver、UoW、repository和`SPC-OUT-01` | Worker receipt action不是business child；duplicate不重跑resolver/effect/capture |
| `SPC-APP-04` | exact Operations Job service entry -> typed response / error terminal | current runner context用于runtime correlation；durable target records仍按journal original trace | `SPC-JOB-01..03`、conditional local/Port/Outbound candidates | whole application interval不表示一个UoW、一个target或atomic whole-run；deadline不结束它 |

### 69.2 Idempotency、UoW 与 repository candidates

| candidate | owner / exact interval | correlation candidate | terminal source | 不得证明 |
|---|---|---|---|---|
| `SPC-IDEM-01` | application idempotency decision；preflight / reserve / exact winner read开始 -> fresh / completed replay / conflict / in-progress / consistency branch形成 | current trace、operation、request/source/run ref；result ref only when loaded | Step 13 exact classification | 不记录full key/digest；不把duplicate画成original mutation child；不授权retry |
| `SPC-UOW-01` | local authority；每一次 `begin` 调用前 -> commit `Durable / NotDurable / Unknown`、rollback result或begin failure | current invocation或journal original trace、operation、safe result/capture/report ref when formed | Step 11/13 UoW / commit resolver | 一个span只对应一个UoW；不跨Job target、final UoW、post-commit Port call；span status不替代durability |
| `SPC-REPO-01` | exact repository trait call；call前 -> typed return / mapped repository error | active local application span + typed subject/ref family | Step 7 exact method return | 不记录row/body/SQL/connection/replica；高频读取是否保留独立span留R15.10裁剪 |

`SPC-UOW-01` 在 Job 中会出现 initial reservation/journal、每个target和final report多个独立实例；在 Outbound Phase C 只覆盖short bind UoW；Query实例数必须为0。`CommitOutcomeUnknown` 结束当前UoW候选时仍保持Unknown，后续resolution exact read若存在是新的local child候选，不回写旧span为success。

### 69.3 External Port candidates

当前九个 external Port trait 的 signatures 都不接收 `TraceId`、parent context或instrumentation carrier。应用层可以围绕Port调用形成本地span候选，但不能声称adapter已经把parent传播给远端。

| candidate | exact call families | owner / interval | current correlation | typed end | 传播边界 |
|---|---|---|---|---|---|
| `SPC-PORT-01` | 七类 body-free reference resolver callable | application callsite + concrete adapter；exact Port call前 -> typed observation / `ApplicationError` | current invocation trace、typed subject/ref、port family | Resolved / Unresolved / Unavailable / Rejected等现有typed observation，或既有Port failure | 本地 client-like span；不注入未声明header，不声称remote child，不记录locator/body/endpoint |
| `SPC-PORT-02` | `handoff_traceability`；既有`handoff_audit_export`仅保留callable schema | application handoff callsite；commit外实际调用前 -> typed handoff outcome / error；当前只有C23 callsite | current trace、exact traceability ref、audit ref；local handoff revision另作fact ref；当前无export调用correlation | Accepted / Unavailable / Rejected / Retryable或error；未调用的export callable不形成terminal | outcome不是evidence / acceptance；Port input无trace字段，不得声称远端parent continuity；不得为覆盖保留callable而合成span |
| `SPC-PORT-03` | collaboration `collaborate/get/list/repair` | application collaboration owner；exact call前 -> typed item/page/outcome / error | current invocation + capture/snapshot/intent/source refs；historical snapshot trace只link | existing candidate / pending / delivered / failed / unavailable category或error | external status不复制为Hub state；candidate bytes、route、receipt、attempt禁入 |

若未来具体 adapter 可以通过通用runtime context传播完整trace，必须先证明该上下文不会进入Port signature、协议或persisted carrier，并受控回开Step 14依赖和R15.10最终表；当前设计不把这种产品实现可能性写成已成立能力。

## 70. Outbound 与 Operations Job phase candidates

### 70.1 Outbound A / B / C candidates

| candidate | owner / exact interval | trace / link source | end branches | 不变量 |
|---|---|---|---|---|
| `SPC-OUT-01` | source-owning application；exact committed-source mapper开始 -> serialization + immutable snapshot + initial capture准备成功或同UoW失败 | current source operation trace、exact source ref；属于originating C/I/J active invocation | captured_candidate_ready / mapping_failed / persistence_failed | Phase A仍在source/target UoW；不表示commit Durable或external call；一个exact source revision只形成一次候选 |
| `SPC-OUT-02` | event collaboration application facade；exact capture load开始 -> official snapshot candidate校验 + one `SPC-PORT-03` outcome / error | current continuation trace若存在；capture / snapshot refs；snapshot source trace只作historical link | typed_external_outcome / load_or_shape_failure / port_error | 不读current truth、不rerun mapper、不跨Phase C UoW、不将external status写成local delivery lifecycle |
| `SPC-OUT-03` | application capture owner；typed stable intent通过source symmetry后 -> short bind UoW terminal | current continuation trace + capture/intent ref；source trace只link | intent_bound / bind_not_durable / bind_unknown / rollback_failed | 只观察 `Captured -> IntentBound`；不推导Delivered，不回滚source，不创建第二capture |

Immediate post-commit continuation若仍在同一owned invocation内，可以让`SPC-OUT-02/03`使用active local parent；Worker exact-ref continuation、crash recovery或J08 repair不存在该保证，只能从current invocation root开始并通过capture/snapshot/intent refs与historical source trace建立逻辑关联。

### 70.2 Operations Job internal phase candidates

| candidate | owner / exact interval | trace / correlation source | end branches | phase boundary |
|---|---|---|---|---|
| `SPC-JOB-01` | application Job owner；validated service entry后的scope planning -> duplicate/reentry branch，或fresh initial reservation+journal UoW terminal | current invocation trace；fresh plan保存到journal；reentry同时关联journal original trace/run | duplicate / conflict / in_progress / planned / empty_plan / planning_failed / consistency_error | planning read不等于target执行；fresh initial UoW与target UoW分开；reentry不rescan |
| `SPC-JOB-02` | application Job owner；从journal选择一个exact Planned ordinal -> target terminal journal outcome durable / unknown / unchanged Planned | journal original trace、run id、target ordinal/ref；current runtime invocation另作correlation | succeeded / failed / skipped / commit_unknown / consistency_error | 每target独立；external call在target local UoW外但属于同target orchestration；不能跨下一个target或从counter生成outcome |
| `SPC-JOB-03` | application Job owner；all-terminal journal exact load -> typed report + stored surface + journal Finalized + idempotency Completed的final UoW terminal | journal original trace、run id、result/report refs when formed | finalized / duplicate_replayed / commit_unknown / failed | 不重读current target，不把先前target rollback，不从runtime span/metric/log组装report |

`SPC-JOB-02` 观察target orchestration，不等于它内部的`SPC-UOW-01`或`SPC-PORT-*`。J07 resolver和J08 collaboration调用若先于target UoW结束，仍是同target span的local children候选，但external call不能参与local rollback。reserved reentry在新的runtime invocation中继续journal target时，current runtime trace和journal original trace必须并存为“当前观察 + durable source link”，不能只留其中一个后伪装连续执行。

### 70.3 Startup candidates

| candidate | owner / exact interval | correlation candidate | end branches | 禁止项 |
|---|---|---|---|---|
| `SPC-INF-01` | runtime composition root；validated root候选进入 -> one complete selected entry handoff / startup failure + prefix cleanup | selected entry、profile、binding family；无protocol trace | complete / blocked / cleanup_failed | 不返回partial graph，不生成protocol trace，不把startup failure写成业务拒绝 |
| `SPC-INF-02` | runtime builder；每个Stage 0~7开始 ->该stage complete / failure与本stage owned-prefix disposition | stage、entry kind、binding state | passed / failed / disposed | stage span不暴露raw config、endpoint、credential、graph handle，不执行business mutation或external collaboration |

Stage child candidates只服务startup排障；R15.10需要裁决是否保留八个stage实例、仅保留failure event，或并入`SPC-INF-01`。无论裁剪结果如何，complete predicate与first exposure barrier仍以Step 14 authority为准，不能由span tree完整性推断。

## 71. Propagation 与 correlation ownership

### 71.1 同进程传播

| boundary | propagation owner | 允许 | 禁止 |
|---|---|---|---|
| API / Worker / Jobs entry -> application | entry mapper验证metadata并构造 `CapabilityOperationContext` | 复制exact `TraceId`；backend可在当前owned future内传播local active span | application重新生成trace；把third-party `Span`放入context或public DTO |
| application -> domain factory / object member | application调用点 | 继续传已有 `TraceId` 到正式change/report/reference字段；runtime local span仅通过调用栈/context存在 | domain object创建runtime span identity、选择sampling、读取global tracer作为业务输入 |
| application -> repository/UoW | application / authority wrapper | current local active span关联typed call；持久化仅写既有正式trace字段 | 持久化span id、backend context、baggage；用span status决定commit |
| runtime observation -> owned invocation | API/Worker/Jobs runtime owner | outer observation与same invocation可建立local parent/link；timeout后owned interval继续 | timeout时drop context并让后续terminal成为无owner orphan；重调生成替代span |

### 71.2 跨协作边界

| boundary | 当前可传播 material | 当前可声明关系 | 当前不能声明 |
|---|---|---|---|
| Inbound external source -> Hub | envelope `TraceId` + source event ref | validated trace-level correlation；source event identity关联receipt | remote parent span、sampling continuity、source delivery attempt |
| Hub Outbound snapshot -> external collaboration | serialized public envelope内的 `TraceId` + exact source identity | candidate与source trace同源；external intent可由stable refs关联 | adapter remote child span、physical delivery trace、Delivered proof |
| Hub -> seven resolver Ports | trait inputs中的body-free typed refs，无trace参数 | Hub local Port call span与current invocation关联 | 远端收到trace、remote parent-child、baggage传播 |
| Hub -> audit handoff Port | exact traceability/export/audit refs，无trace参数 | local handoff invocation与refs关联 | observability store ingest span、audit acceptance/evidence |
| Hub -> collaboration get/list/repair | capture/snapshot/intent/source refs；candidate envelope仅collaborate时含source trace | local invocation + historical source link + stable intent correlation | external status是Hub span status或本地delivery state |

### 71.3 Logical link 的限定定义

本文件所说的 `link` 是“当前runtime观察引用一个既有historical trace id和stable body-free ref”的设计关系。由于当前没有`SpanId`、trace flags或正式remote context，它 **不等同于** OpenTelemetry `SpanLink` / W3C remote parent，也不要求backend具备某个link API。R15.10可以把它实现为安全attributes、structured event关联或backend link，但必须保留以下三元组语义：

```text
current invocation identity (when present)
  + historical trace identifier (when loaded from a durable carrier)
  + exact stable carrier ref (result / receipt / report / snapshot / capture / journal target)
```

只记录两个trace id而没有carrier ref，无法证明它们为什么相关；只记录carrier ref而把current span切换到historical trace，会伪造一个跨崩溃窗口持续存在的执行。

## 72. No-payload、no-truth 与安全关联原则

### 72.1 Candidate attribute classes

| class | R15.9允许进入R15.10复核的来源 | 使用边界 |
|---|---|---|
| closed identity | operation / protocol / job / consumer / event / port / repository / effect family | 只能来自closed mapper，不从route、type name、error text动态拼接 |
| runtime phase | entry admission、application、UoW、commit resolution、post-commit collaboration、drain/join、Stage 0~7 | 只是runtime阶段，不新增protocol或persisted state |
| typed outcome | existing disposition、visibility、freshness、commit resolution、Port outcome、journal target state、cleanup result | 只复制exact return；不根据duration、HTTP status或日志推导 |
| stable body-free ref | request、source event、subject、result、receipt、report、snapshot、capture、intent、traceability/export ref | 高基数关联候选；R15.10须逐span最小化，不得默认全部加入 |
| safe diagnostic | closed error kind、issue code/ref、safe failure category | 不含raw cause、stack、private provider code或authorization internals |
| bounded scalar | schema version、target ordinal、safe item count、duration | count必须来自current loop / durable journal/report owner，不得从日志/metric重建 |

### 72.2 No-payload source exclusion inventory（不是最终表）

下表是从Step 14 redaction handoff和本批owner分析得到的排除清单，用于证明候选切口不需要这些材料；它不是R15.10逐span的最终forbidden payload表，也不新增redaction分类。R15.10仍须把这些排除项反向装配到每个最终keep span，并审计没有例外路径。

| forbidden material | 原因 |
|---|---|
| raw Command / Query body、Inbound payload、Job input、public response / receipt / report body | runtime span不是payload store或replay source |
| serialized outbound envelope bytes、snapshot bytes、candidate bytes、digest raw bytes | snapshot repository是唯一complete-byte authority；观测复制会形成第二payload |
| external resolver / handoff / collaboration request或response body、HTTP headers/status、provider private code | Port只暴露typed body-free outcome；transport material越过owner边界 |
| secret、credential、token、TLS material、endpoint、connection string | 安全边界；不存在verbose/full例外 |
| topic、group、partition、offset、lease、ack、delivery token、attempt、DLQ | Hub不拥有这些delivery lifecycle truth |
| method body、governance approval / Policy body、document / OpenAPI / schema body、runtime/tools result、SDK response、marketplace listing | 边界外truth /正文，不因trace目的获得豁免 |
| raw config key/value/source path、partial runtime graph、task/runtime handles | startup span不成为config dump或resource registry |
| idempotency key、full key/hash、request/payload digest、transaction ref inner value | 当前无安全观测accessor或会泄露高风险关联材料 |
| raw error、`Display` / `Debug`、stack trace、panic payload | 只能使用existing typed category / redacted diagnostic ref |
| evidence alias、验收签署、真实测试结果、伪造run id | 观测信号不能制造实施或验收事实 |

### 72.3 No-truth assertions

1. span存在或status=success不能证明任何truth已提交；只有UoW / repository与既有record可证明。
2. UoW span结束为`Durable`只能复制commit authority返回，不能自行得出该结论；`Unknown`不能被tracer flush结果解决。
3. Outbound / handoff Port span成功只表示取得typed outcome，不表示external delivery、audit ingest、approval或验收成功。
4. duplicate span只证明当前调用走了stored-read分支；stored bytes / typed envelope仍是replay authority。
5. Job target span不能成为journal checkpoint，Job whole-run span不能成为report assembler，process span不能授权entry retry。
6. trace id相同不能证明同一transaction、同一request、同一actor、同一run或同一business subject；必须依赖相应typed identity。
7. span丢失、未采样、export失败不能回滚、拒绝或降级原流程；observer failure保持R15.6/R15.8的non-recursive独立边界。

## 73. 83-flow span-candidate 反向覆盖

### 73.1 Editorial bundles 与条件语义

下列bundle只用于本节排版，不是final span、Rust helper、facade、配置或backend概念。每个candidate仍只在§§68~70 exact start真实发生时存在；pre-dispatch rejection、duplicate、no-op、no-Port或no-capture分支不得伪造没有执行的child interval。

| bundle / conditional token | exact candidate expansion | branch rule |
|---|---|---|
| `SB-CMD` | `SPC-API-01/02` + `SPC-APP-01` + conditional `SPC-IDEM-01`, `SPC-UOW-01`, `SPC-REPO-01` | API observation与owned invocation分开；pre-dispatch只有`SPC-API-01`；duplicate不形成mutation/UoW/Port/capture children |
| `SB-QRY` | `SPC-API-01/02` + `SPC-APP-02` + conditional `SPC-REPO-01` | resolver-first local read；idempotency、write UoW、external Port、capture、handoff、Job candidates均为0 |
| `SB-IN` | `SPC-WKR-02/03` + `SPC-APP-03` + conditional `SPC-IDEM-01`, `SPC-UOW-01`, `SPC-REPO-01` | header rejection / Unsupported未dispatch application；duplicate只做exact stored receipt read |
| `SB-OUT` | `SPC-OUT-01/02/03` + `SPC-PORT-03` + conditional `SPC-UOW-01`, `SPC-REPO-01`, `SPC-WKR-04/05` | Phase A/B/C按实际执行拆开；Worker wrapper只在selected Worker exact-ref continuation拥有该调用时存在 |
| `SB-JOB` | `SPC-JRT-01/02/03` + `SPC-APP-04` + `SPC-JOB-01` + conditional `SPC-JOB-02/03`, `SPC-IDEM-01`, `SPC-UOW-01`, `SPC-REPO-01`, `SPC-JRT-04` | completed duplicate在planning/classification后停止；fresh/reserved才有target/final；drain只在对应runtime branch存在 |
| `CL-RESOLVE` | `SPC-PORT-01` | only exact seven-family resolver callable actually invoked |
| `CL-HANDOFF` | `SPC-PORT-02` | only exact traceability / audit-export handoff callable actually invoked |
| `CL-CAPTURE-A` | `SPC-OUT-01` + active source/target `SPC-UOW-01` / repository calls | only actual exact source snapshot/capture formation；same Phase A在origin flow和O row各出现一次语义引用，不双开span |
| `CL-COLLAB` | `SPC-OUT-02` + `SPC-PORT-03` + conditional `SPC-OUT-03` / local UoW | official stored candidate / exact intent only；get/list/repair不自动bind |

### 73.2 Command 26 / 26 exact coverage

| ID | exact operation / subject | candidate expression | trace / correlation boundary |
|---|---|---|---|
| `C01` | Establish capability access context | `SB-CMD + CL-RESOLVE + conditional CL-CAPTURE-A` | source resolver only whencandidate resolution调用；change/result/capture refs形成后才可关联 |
| `C02` | Correct capability identity | `SB-CMD + conditional CL-CAPTURE-A` | no external resolver；final committed source only |
| `C03` | Retire capability identity | `SB-CMD + conditional CL-CAPTURE-A` | dependent read local；capture不等于external delivery |
| `C04` | Record access review fact | `SB-CMD + conditional CL-CAPTURE-A` | review trace不等于governance approval |
| `C05` | Register registry entry | `SB-CMD + conditional CL-CAPTURE-A` | no marketplace/listing relation |
| `C06` | Update registry lifecycle | `SB-CMD + conditional CL-CAPTURE-A` | no runtime availability / authorization trace |
| `C07` | Update registry visibility basis | `SB-CMD + conditional CL-CAPTURE-A` | no runtime allow/deny relation |
| `C08` | Retire registry entry | `SB-CMD + conditional CL-CAPTURE-A` | no directory rebuild child |
| `C09` | Establish adapter descriptor | `SB-CMD + conditional CL-CAPTURE-A` | no provider invocation/body/health trace |
| `C10` | Replace adapter descriptor | `SB-CMD + conditional CL-CAPTURE-A` | loaded current descriptor islocal repository correlation |
| `C11` | Record descriptor risk summary | `SB-CMD + conditional CL-CAPTURE-A` | no policy approval、quota或cost trace |
| `C12` | Attach descriptor secret ref | `SB-CMD + CL-RESOLVE + conditional CL-CAPTURE-A` | Secret Port body-free only；secret value never attribute |
| `C13` | Attach governance seam | `SB-CMD + CL-RESOLVE + conditional CL-CAPTURE-A` | governance result ref only；no approval/workflow parent |
| `C14` | Replace governance seam | `SB-CMD + CL-RESOLVE + conditional CL-CAPTURE-A` | same resolver boundary；replacement history exact refs |
| `C15` | Expire governance seam | `SB-CMD + conditional CL-CAPTURE-A` | no external governance call |
| `C16` | Attach method relation | `SB-CMD + CL-RESOLVE + conditional CL-CAPTURE-A` | method asset ref only；no method body/execution trace |
| `C17` | Remove method relation | `SB-CMD + conditional CL-CAPTURE-A` | no method-library mutation child |
| `C18` | Establish formal exposure | `SB-CMD + conditional CL-CAPTURE-A` | prerequisite reads local；no runtime/tools/SDK invocation |
| `C19` | Update formal applicability | `SB-CMD + conditional CL-CAPTURE-A` | applicability isnot authorization decision |
| `C20` | Suspend formal exposure | `SB-CMD + conditional CL-CAPTURE-A` | no downstream cache invalidation truth |
| `C21` | Retire formal exposure | `SB-CMD + conditional CL-CAPTURE-A` | no SDK unpublish / listing trace |
| `C22` | Record change impact | `SB-CMD + conditional CL-CAPTURE-A` | impact fact不是runtime execution / billing result |
| `C23` | Record traceability handoff summary | `SB-CMD + conditional CL-HANDOFF` | local handoff revision commit与external handoff Port分开；no evidence / acceptance |
| `C24` | Record reference resolution state | `SB-CMD + conditional CL-RESOLVE + conditional CL-CAPTURE-A` | resolver仅在flow实际调用；canonical local state仍是authority |
| `C25` | Register external document ref | `SB-CMD + CL-RESOLVE + conditional CL-CAPTURE-A` | document body / OpenAPI / schema禁入 |
| `C26` | Register capability consumer ref | `SB-CMD + CL-RESOLVE + conditional CL-CAPTURE-A` | runtime-tools / SDK boundary only；no execution/client/package trace |

Command arithmetic：`C01..C26 = 26`，missing=`0`、extra=`0`、duplicate ID=`0`。`CL-CAPTURE-A`只在fresh accepted exact source形成时出现；rejected、conflict、in-progress和completed duplicate均没有该child。

### 73.3 Query 33 / 33 exact coverage

全部Query使用`SB-QRY`。`SPC-APP-02`的typed end可以是Visible、NotVisible、Degraded或existing error；normal missing / empty不是自动error。下面每行的禁止项同时保证没有write-like child。

| ID | exact query subject | expression | explicit no-write / no-owner-merge rule |
|---|---|---|---|
| `Q01` | Get capability identity | `SB-QRY` | no identity mutation / idempotency |
| `Q02` | Search identities | `SB-QRY` | empty page normal；no index repair |
| `Q03` | Get access review fact | `SB-QRY` | optional absence不建prerequisite fact |
| `Q04` | Get registry entry | `SB-QRY` | no registry write |
| `Q05` | List registry entries | `SB-QRY` | no cursor persistence |
| `Q06` | Get registry visibility semantics | `SB-QRY` | no exposure / visibility creation |
| `Q07` | Get adapter descriptor | `SB-QRY` | no provider read-through / reconstruction |
| `Q08` | Get risk summary | `SB-QRY` | no approval/quota/cost inference |
| `Q09` | Get secret safe summary | `SB-QRY` | legalRedacted无secret child / external secret call |
| `Q10` | List descriptors by capability | `SB-QRY` | no descriptor creation |
| `Q11` | Get governance seam | `SB-QRY` | no governance Port / approval audit |
| `Q12` | Get access-governance separation | `SB-QRY` | optional seam absence normal |
| `Q13` | Get method relation | `SB-QRY` | no method body / execution |
| `Q14` | List capability relations | `SB-QRY` | no relation merge / capture |
| `Q15` | Get formal exposure | `SB-QRY` | no runtime allow / SDK publish |
| `Q16` | Get formal applicability | `SB-QRY` | no authorization / deny record |
| `Q17` | Get controlled consumer view | `SB-QRY` | stale/rebuilding只读；no refresh Job |
| `Q18` | List runtime-tools consumable capabilities | `SB-QRY` | no tools invocation/cache/allowlist |
| `Q19` | Get SDK exposure boundary | `SB-QRY` | no SDK generation/package/publication |
| `Q20` | Get capability access trace | `SB-QRY` | no trace append / repair / handoff call |
| `Q21` | Get capability change impact | `SB-QRY` | no impact write |
| `Q22` | Get downstream impact summary | `SB-QRY` | stored Delayed / Unavailable不是processing retry |
| `Q23` | Get audit handoff trace summary | `SB-QRY` | no handoff Port / evidence / signature |
| `Q24` | Search capability directory | `SB-QRY` | no projection rebuild |
| `Q25` | Browse capability directory | `SB-QRY` | no current-truth reconstruction |
| `Q26` | Get audit-friendly export summary | `SB-QRY` | no raw telemetry / audit handoff |
| `Q27` | Get ecosystem discovery summary | `SB-QRY` | no marketplace listing/ranking/pricing |
| `Q28` | Get reconciliation report | `SB-QRY` | immutable report read；no report rebuild |
| `Q29` | Get reference resolution state | `SB-QRY` | no resolver refresh |
| `Q30` | Get external document ref | `SB-QRY` | no document body / state refresh |
| `Q31` | Get runtime-tools consumer ref | `SB-QRY` | no runtime/tools call |
| `Q32` | Get SDK consumer ref | `SB-QRY` | no client/package/generated code read |
| `Q33` | Get observability-audit ref | `SB-QRY` | no raw telemetry/audit body / handoff success |

Query arithmetic：`Q01..Q33 = 33`，missing=`0`、extra=`0`、duplicate ID=`0`。所有33条中`SPC-IDEM-01`、`SPC-UOW-01`、`SPC-PORT-01..03`、`SPC-OUT-01..03`和`SPC-JOB-01..03`实例均为0。

### 73.4 Inbound 6 / 6 exact coverage

| ID | exact consumer / source | candidate expression | correlation / exclusion |
|---|---|---|---|
| `I01` | Governance result reference changed | `SB-IN + conditional CL-RESOLVE + conditional CL-CAPTURE-A` | envelope trace + source event refs；no governance approval / Policy truth |
| `I02` | Method asset reference changed | `SB-IN + conditional CL-RESOLVE + conditional CL-CAPTURE-A` | no method body/source/execution |
| `I03` | Downstream consumption impact reported | `SB-IN + conditional CL-CAPTURE-A` | stored feedback state Delayed不是Worker observation timeout或retry |
| `I04` | External capability source ref changed | `SB-IN + conditional CL-RESOLVE + conditional CL-CAPTURE-A` | no provider/MCP/A2A/API body或runtime integration |
| `I05` | Audit material ref changed | `SB-IN + conditional CL-RESOLVE + conditional CL-CAPTURE-A` | no raw telemetry、evidence或handoff success |
| `I06` | External document ref changed | `SB-IN + conditional CL-RESOLVE + conditional CL-CAPTURE-A` | no document/OpenAPI/schema body或descriptor mutation |

Inbound arithmetic：`I01..I06 = 6`，missing=`0`、extra=`0`、duplicate ID=`0`。header-first rejection / Unsupported只有`SPC-WKR-02`候选且可能无可信trace；application未dispatch，因此`SPC-WKR-03`、`SPC-APP-03`及其children均为0。completed duplicate保留current invocation + stored receipt historical link，不重跑resolver/effect/capture。

### 73.5 Outbound 10 / 10 exact coverage

所有Outbound exact flow使用`SB-OUT`，但每个phase只在实际进入时创建候选实例。Phase A与originating C/I/J表的`CL-CAPTURE-A`是同一runtime interval；本表的反向引用不授权第二个span。

| ID | exact event source | expression | source/link boundary |
|---|---|---|---|
| `O01` | Capability identity changed | `SB-OUT` | exact identity change source；no current identity remap / accepted audit |
| `O02` | Capability registry changed | `SB-OUT` | exact registry change record；no reconciliation/listing inference |
| `O03` | Adapter descriptor changed | `SB-OUT` | immutable descriptor source；no secret/provider execution health |
| `O04` | Governance seam relation changed | `SB-OUT` | no approval/workflow decision |
| `O05` | Capability method relation changed | `SB-OUT` | no method body/execution/lifecycle mutation |
| `O06` | Formal exposure boundary changed | `SB-OUT` | no runtime allow/SDK publication/marketplace listing |
| `O07` | Controlled consumer view availability changed | `SB-OUT` | exact view revision；no runtime cache delivery/current-view rebuild |
| `O08` | Capability change impact identified | `SB-OUT` | exact impact fact；no execution/billing/acceptance |
| `O09` | Derived material refreshed | `SB-OUT` | exact allowed material/report revision；no evidence/auto-repair |
| `O10` | Reference resolution changed | `SB-OUT` | canonical local state revision；resolver response/provider health不是source |

Outbound arithmetic：`O01..O10 = 10`，missing=`0`、extra=`0`、duplicate ID=`0`。Immediate continuation可以使用active local parent；Worker continuation、crash recovery和J08只能使用current invocation + historical snapshot trace + exact capture/snapshot/intent refs的logical link。

### 73.6 Operations Job 8 / 8 exact coverage

| ID | exact Job subject | candidate expression | durable trace / phase exclusion |
|---|---|---|---|
| `J01` | Registry reconciliation | `SB-JOB + conditional CL-CAPTURE-A` | report/journal original trace；不repair registry，不从span生成finding/report |
| `J02` | Controlled consumer view refresh | `SB-JOB + conditional CL-CAPTURE-A` | exact target/no-op；不改formal exposure |
| `J03` | Directory projection rebuild | `SB-JOB + conditional CL-CAPTURE-A` | no registry/descriptor/exposure backfill |
| `J04` | Audit-friendly export preparation | `SB-JOB + conditional CL-CAPTURE-A` | summary refs only；no raw telemetry/evidence/signature |
| `J05` | Ecosystem discovery rebuild | `SB-JOB + conditional CL-CAPTURE-A` | no listing/ranking/pricing/transaction |
| `J06` | Derived material reconciliation | `SB-JOB + conditional CL-CAPTURE-A` | no nested Job、repair或core truth mutation |
| `J07` | External reference resolution refresh | `SB-JOB + conditional CL-RESOLVE + conditional CL-CAPTURE-A` | target Port child beforelocal target UoW；resolver status不是provider health |
| `J08` | Event collaboration repair | `SB-JOB + CL-COLLAB` | stored capture/intent + journal；no mapper/current source/new event/capture/intent |

Job arithmetic：`J01..J08 = 8`，missing=`0`、extra=`0`、duplicate ID=`0`。Completed duplicate只进入current `SPC-JOB-01` classification + stored report read；`SPC-JOB-02/03`和所有maintenance/Port/capture children为0。Reserved reentry可以进入剩余`SPC-JOB-02/03`，但通过journal original trace + target ref建立historical link；不得把新runtime invocation冒充初次plan span的延续。

### 73.7 Exact-set 与 non-flow owner closure

| audit subject | expected | actual | result |
|---|---:|---:|---|
| Command exact IDs | 26 | 26 | pass |
| Query exact IDs | 33 | 33 | pass |
| Inbound exact IDs | 6 | 6 | pass |
| Outbound exact IDs | 10 | 10 | pass |
| Job exact IDs | 8 | 8 | pass |
| total exact IDs | 83 | 83 | pass |
| duplicate exact IDs | 0 | 0 | pass |
| Query write / external / maintenance candidate instances | 0 | 0 | pass |
| flow with no candidate owner | 0 | 0 | pass |

Non-flow owner也已覆盖：startup composition=`SPC-INF-01/02`，Worker fetch/parked lifecycle=`SPC-WKR-01`，Worker stop/drain/join=`SPC-WKR-06`，API/Worker/Jobs timeout后的same-invocation ownership=`SPC-API-02` / `SPC-WKR-03/05` / `SPC-JRT-03/04`。这些不是第84个generic protocol flow。

## 74. 特殊分支与 owner 语义审计

### 74.1 High-risk branch matrix

| branch | current span / trace candidate | historical / stable correlation | mandatory exclusion | R15.9 result |
|---|---|---|---|---|
| malformed / missing protocol trace | process-local entry span only | safe entry phase / closed rejection whenavailable | random fallback、malformed raw trace、request/run ref替代trace | pass |
| pre-header Worker / Jobs reject | `SPC-WKR-02` / `SPC-JRT-01` without trusted trace | source slot或entry phase only | payload/raw bytes、fake source event/run | pass |
| completed duplicate | current invocation trace | stored result/receipt/report ref + original trace logical link | original mutation/target/capture child span、current trace切换 | pass |
| conflict / in-progress | current invocation + `SPC-IDEM-01` | operation / request-source-run ref only whenallowed | full key/digest、stored Conflict fact、retry authorization | pass |
| Query no-write | API + Query application + local read candidates | request / read subject refs | UoW/idempotency/external Port/capture/handoff/repair | 33/33 pass |
| commit unknown | current `SPC-UOW-01` ends Unknown | current trace + safe operation/result/capture/report ref if already formed | span error=>NotDurable、zero-effect、blind retry | pass |
| rollback failed | current UoW + typed failure correlation | original error category remainsseparate | overwrite original failure、claim no effect | pass |
| API observation timeout | outer `SPC-API-01` timed_out | same owned `SPC-API-02` continues | cancellation/failure/second dispatch | pass |
| Worker observation timeout | `SPC-WKR-02/04` timed_out | same `SPC-WKR-03/05` continues under owner | ack/retry truth、new source/capture invocation | pass |
| Jobs deadline/caller cancellation | `SPC-JRT-02` deadline/observation end | same `SPC-JRT-03/04` drains；run ref only ifvalidated | abort/detach/reinvoke/entry retry | pass |
| deferred Outbound continuation | newcurrent invocation or process-local root | capture/snapshot ref + historical source trace | extend source span acrosscommit/crash、current truth remap | pass |
| typed external Failed/HandoffUnavailable | local `SPC-PORT-02/03` typed end | exact audit/capture/intent/source refs | local delivery state、business/audit failure推断 | pass |
| external Port no trace parameter | Hub local Port span only | callsite current trace + typed refs | remote parent/child or propagation success claim | pass |
| Job reserved reentry | current runtime span + remaining target/final candidates | journal original trace/run + exact target/ref | rescan、continue old process span、replace original metadata | pass |
| observer backend failure | original business span semantics unchanged | failed static instrumentation operation only | recursive child、rollback、typed outcome overwrite | pass |
| startup / shutdown | process-local lifecycle span | entry/stage/source-slot owner | arbitrary protocol trace、last request ownership | pass |

### 74.2 Owner duplication audit

| observable fact | primary candidate owner | allowed surrounding relation | forbidden duplicate meaning |
|---|---|---|---|
| caller observation timeout | API / Worker / Jobs outer runtime candidate | owned invocation remains sibling/child-like local relation | application timeout/error/cancelled |
| application disposition | `SPC-APP-01..04` | entry outer may record caller-visible return | entry reclassifiesbusiness result或durability |
| repository call | `SPC-REPO-01` | active application / UoW local parent | adapter + application two equal primary spans with different outcome |
| commit resolution | `SPC-UOW-01` local authority | application outer referencesbranch | API/Worker/Jobs猜Durable/Unknown |
| external typed outcome | `SPC-PORT-01..03` | application orchestration / target span | external status copied aslocal state或application重新分类 |
| capture formation / collaborate / bind | `SPC-OUT-01/02/03`分别拥有 | origin flow / O reverse table share same instance | one publish-success span替代三phase；C/I/J与O各开一次Phase A |
| Job plan / target / final | `SPC-JOB-01/02/03` | Jobs runtime围绕same service invocation | runner从span重建journal/report或target state |
| startup complete predicate | Step 14 builder authority，`SPC-INF-01/02`只观察 | entry exposure barrier关联 | span tree complete推导graph complete |

### 74.3 Capability Hub专项边界审计

| boundary | trace/span candidate可观察 | 不得吸收的owner / truth | result |
|---|---|---|---|
| capability identity / registry | exact operation、body-free subject/change/capture ref | runtime identity、listing、execution state | pass |
| external MCP / A2A / API | body-free source resolver Port call和typed outcome | provider request/response、session、tool result、route/health/cost | pass |
| governance | result ref resolver、seam change、handoff ref | approval、Policy、shared rules、vote/workflow | pass |
| method-library | method asset ref resolver / relation | method body、source、package、execution | pass |
| formal exposure / controlled consumer | exposure/view/impact refs | runtime/tools authorization/execution、SDK client、marketplace listing | pass |
| event collaboration | snapshot/capture/intent refs和typed external status | local outbox/relay/DLQ/attempt/lease/ack、delivery proof | pass |
| observability / audit | body-free audit ref / traceability/export handoff call | raw telemetry、external audit store body、evidence、acceptance signature | pass |

## 75. R15.10 必须完成的裁决

| decision id | R15.10必须输出 | pass condition |
|---|---|---|
| `TRD-01` | 30个`SPC-*`逐项keep / merge / reject | 每项有理由；裁剪后API/application/Port/Worker/Jobs/startup与83-flow coverage不丢失 |
| `TRD-02` | 最终backend-neutral span identifier、kind、unique owner和exact start/end | 名称不复用log event key / metric name；一个interval不跨UoW、commit/crash或Job reentry |
| `TRD-03` | API/Worker/Jobs observation与owned invocation最终表达 | timeout/cancellation不结束、取消或重调same application future；drain/join owner可见 |
| `TRD-04` | current trace、historical trace、local parent、logical link的最终判定表 | 不因共享`TraceId`伪造parent；无`SpanId`时明确remote parent unsupported / not claimed |
| `TRD-05` | 五协议metadata、durable replay carrier和absent-context规则 | 每个字段回指existing carrier；required missing走既有reject，lifecycle absent不造fallback |
| `TRD-06` | 每个final span的attribute allowlist与forbidden payload表 | raw body/secret/transport/evidence命中为0；高基数ref逐span最小化，不默认全量加入 |
| `TRD-07` | 九external Port的local-call / remote-propagation规则 | trait无context参数时不声称remote propagation；typed outcome不成为delivery/approval truth |
| `TRD-08` | 83 exact flow -> final span family / conditional no-span map | `26 + 33 + 6 + 10 + 8 = 83` exact set；Query write-like span=0；duplicate no-rerun |
| `TRD-09` | status / error / commit resolution / observer failure规则 | span status不改变Step 12 precedence、durability、retry、business disposition或sink-failure behavior |
| `TRD-10` | backend-neutral implementation gate | 不引入未审计crate、public/persisted `Span`类型、新Port或第二metadata；backend choice仍需Step 14受控回开 |

R15.10不得因为当前只有`TraceId`就本地新增`TraceContext` / `SpanId` / baggage carrier，也不得为了“完整trace”把Port签名、public envelope、snapshot、journal或stored result扩大。若产品明确要求W3C-compatible remote parent / sampling continuity，届时才登记真实upstream change并受控回开；当前scope的TraceId correlation closure不被该未来能力阻塞。

## 76. R15.9 机械自检、停审快照与下一批门禁

### 76.1 Mechanical and semantic audit

| audit item | expected | actual | result |
|---|---:|---:|---|
| metadata protocol families | 5 | 5 | pass；Command、Query、Inbound、Outbound、Job |
| `SPC-*` candidate definitions | 30 | 30 | pass；API 2 + Worker 6 + Jobs runtime 4 + application 4 + local authority 3 + Port 3 + Outbound 3 + Job phase 3 + infra 2 |
| final span identifier fixed | 0 | 0 | pass；reserved for R15.10 |
| remote parent / sampling continuity claims | 0 | 0 | pass |
| exact protocol-flow coverage | 83 | 83 | pass；26/33/6/10/8 |
| Query write-like candidate instances | 0 | 0 | pass |
| raw payload / secret / transport / evidence field admitted | 0 | 0 | pass |
| new Rust type / field / variant / trait / Port | 0 | 0 | pass |
| structure / field comment delta | 0 | 0 | pass；本批无Rust声明可遗漏 |
| unresolved upstream blocker | 0 | 0 | pass |

当前L0-core只有opaque `TraceId`且没有`SpanId` / parent / flags，是已明确的能力边界，不是当前scope blocker。两项既有non-blocking design debt保持不变：`CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001`、`CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001`；本批不声称已修复或修改L0-core。

### 76.2 Stop-review snapshot

| item | stop-review state |
|---|---|
| 当前正式文档 | `03-详细设计.md`；未修改，仍等待Step 19 assembly |
| 当前校准文档 | `03_ddd_step_15_observability_audit.md` |
| completed batch | `R15.9 trace / span / correlation:先思考` |
| batch status | `completed_stop_review` |
| metadata closure | 5/5 protocol family；TraceId correlation only；remote parent unsupported / not claimed |
| candidate span cuts | 30 editorial candidates；尚未keep/merge/reject或命名 |
| exact flow closure | 83/83：Command 26、Query 33、Inbound 6、Outbound 10、Job 8 |
| non-flow closure | startup、Worker fetch/lifecycle、three-entry non-cancelling timeout/drain owner covered |
| no-payload / no-truth | raw body、secret、transport lifecycle、evidence、durability/delivery/approval/replay替代均为0 |
| new Rust declaration / comment delta | 0；结构体与字段注释无新增遗漏 |
| upstream blocker | none |
| non-blocking debt | existing two L0-core design-sync debts unchanged |
| implementation artifact | not created；implementation ledger与planned boundary skeleton仍禁止提前生成 |
| claimed implementation / test / evidence / sign-off | none；无commit、run_id、真实evidence alias、测试结果或验收签署声明 |
| commit | not requested and not created |

本批完成后停止在Step 15的R15.9 review gate。未经用户下一次明确确认，不进入R15.10，不修改正式`03/04`，不创建Step 16或任何implementation artifact。

### 76.3 R15.9 下一批门禁

```text
document = 03-详细设计.md
step = 15
completed_batch = R15.9 trace / span / correlation:先思考
status = completed_stop_review
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_10
next_batch = R15.10 trace / span / correlation:再写入
allowed_scope_after_confirmation = final candidate keep/merge/reject decisions, backend-neutral span identifiers and kinds, exact start/end/owner, current-vs-historical correlation and logical-link rules, per-span safe attribute allowlists, forbidden payload table, 83-flow final reverse mapping and non-cancelling timeout semantics
must_read_before_next_batch = this file §§64~76 and §§35~46; 详细设计讨论流程_SOP.md Step 15; 详细设计书写规范.md §5.14; Step 6 operation/stored/snapshot/journal carriers; Step 7 nine external Port signatures; Step 8 metadata carriers; Step 9 shared/exact flow boundaries; Step 12 error precedence; Step 13 replay/reentry/commit resolution; Step 14 three-entry non-cancelling runtime handoff
forbidden_until_next_gate = audit/operations fact table, redaction final table, formal 03 assembly, 04, Step 16+, implementation ledger, planned boundary skeleton, code, tests, run_id, evidence, sign-off, commit
unresolved_upstream_blocker = none
```

R15.10只能收敛本批trace/span/correlation候选，不能自动进入R15.11。若最终contract确实要求新增carrier、Port参数或第三方dependency，必须先登记受控回开；不得把候选表直接当作已有实现能力。

## 77. R15.10 授权、读取闭包与最终裁决口径

### 77.1 授权与批次边界

用户已明确确认从 `03_step_15_r15_9_completed_stop_review` 进入 `R15.10 trace / span / correlation:再写入`。本批只把 §§64~76 的 30 个 `SPC-*` editorial candidates 收敛为最终 backend-neutral span contract，完成后停审；不进入 `R15.11 audit / operations fact:先思考`，不修改正式 `03-详细设计.md`，不创建 `04-配置设计.md`、Step 16~19、implementation ledger 或 planned boundary skeleton。

本批新增的 `FSP-*`、span identifier、semantic kind、attribute key 和 span event identifier 都是详细设计中的 **instrumentation contract literal**，不是新的 Rust public type、field、enum、variant、trait、Port、protocol field、persisted state、配置 key 或已存在实现。实现阶段若选择具体 tracing / telemetry crate，必须先按 §86.4 受控回开 Step 14 的 Cargo 与 dependency matrix。

### 77.2 本批实际回读闭包

| 输入 | 本批读取焦点 | 最终使用结论 |
|---|---|---|
| `详细设计讨论流程_SOP.md` Step 15 | 代码必须知道日志、指标、trace 与审计切口；不写阈值 / 运维流程 | 本批只闭合 trace/span/correlation 代码切口，不进入审计事件或告警配置 |
| `详细设计书写规范.md` §5.14 | 可落码位置、字段和安全边界 | 27 个 final profile 均固定 owner、start、end、attributes 与 forbidden material |
| 本文件 §§35~46 | 60 个日志 profile、字段 authority、observer failure | span 不复制日志 event key，不扩大字段来源，不让 sink failure 改写业务结果 |
| 本文件 §§54~63 | 48 个 metric profile、低基数规则 | span 高基数 body-free ref 不进入 metric label；metric 不重建 span 或 durable truth |
| 本文件 §§64~76 | 30 个 candidates、五族 metadata、83-flow 覆盖 | 逐项 keep / merge；最终形成 27 个 profile，83-flow 与 non-flow owner 不丢失 |
| Step 6 object contracts | operation context、stored result / receipt / report、snapshot / capture / journal trace carrier | 只读取既有 `TraceId` 和 typed body-free ref，不新增 span/context 字段 |
| Step 7 Port contracts | 九个 external Port 的 exact signature | 九个 Port 均无 trace/context 参数；只允许 Hub-local call span |
| Step 8 protocol contracts | Command / Query / Inbound / Outbound / Job metadata | validated metadata 是 current trace authority；required missing 走既有 rejection |
| Step 9 function flows | 83 条 exact start / call / UoW / post-commit / target / final 边界 | span 不跨 source commit、crash、Job target、reentry 或独立 UoW |
| Step 12 error recovery | 17 errors、51 issue、precedence 和 recovery action | span status 不覆盖 `ApplicationError`、durability、retryability 或 business disposition |
| Step 13 concurrency / idempotency | replay、winner read、commit unknown、reserved reentry | duplicate 只观察 current classification + exact stored read；original trace 只作 historical correlation |
| Step 14 runtime binding | API / Worker / Jobs non-cancelling owner、Stage 0~7、Off / Redacted | observation 与 owned invocation 分离；startup stage 作为 root span 内静态事件 |
| L1-governance / L1-artifact Step 15 | trace/span 表的表格粒度 | 只参考组织方式；不继承其 TraceContext、outbox、relay、publisher 或业务 audit 对象 |

### 77.3 收敛原则

1. 一个 final span 只覆盖一个 runtime interval owner；不能横跨 commit、process crash、Job reentry 或两个独立 UoW。
2. API、Worker Inbound、Worker continuation、Jobs 的 caller observation 与 owned non-cancelling invocation 必须分别结束；timeout 只结束 observation。
3. 高频空闲 fetch cycle、same-task residual drain 和 Stage 0~7 不各自扩大为独立 span；它们合并为已有 owner span 内的固定事件，日志 / 指标继续承担聚合可见性。
4. application、idempotency、UoW、repository、external Port、Outbound A/B/C、Job plan/target/final 各有不同 authority，不能为了减少数量合并。
5. `TraceId` 只作为 opaque correlation ref；process-local parent 只在同一 runtime owner 的 active span 可证明时成立。
6. 没有 `SpanId`、parent context、trace flags、baggage 或 sampling continuity；remote parent propagation 明确为 unsupported / not claimed。
7. span 丢失、未采样、backend/exporter 失败或 `CapabilityDiagnosticMode::Off` 不改变业务、事务、清理、receipt、report、capture、handoff 或 retry 结果。
8. 本批没有 unresolved upstream blocker；两项既有 L0-core design-sync debt继续为 non-blocking，且不因 span 表而被声明已解决。

## 78. 30 个候选的最终 keep / merge / reject 裁决

| candidate | disposition | final profile | 裁决理由 |
|---|---|---|---|
| `SPC-API-01` | keep | `FSP-API-01` | caller-visible observation 可在 timeout 结束，不能与仍运行的 application future 合并 |
| `SPC-API-02` | keep | `FSP-API-02` | exact owned future 必须持续到真实 terminal，保留 non-cancelling owner |
| `SPC-WKR-01` | merge | `FSP-WKR-01` | fetch / wait cycle 高频且通常无 protocol trace；并入 Worker lifecycle 的固定 source-cycle event，避免每次空闲 poll 造 span |
| `SPC-WKR-02` | keep | `FSP-WKR-02` | header-first admission / receipt observation 与 application terminal 生命周期不同 |
| `SPC-WKR-03` | keep | `FSP-WKR-03` | Inbound exact future在 observation timeout后仍必须由Worker drive到terminal |
| `SPC-WKR-04` | keep | `FSP-WKR-04` | exact capture-ref continuation有独立 caller observation窗口 |
| `SPC-WKR-05` | keep | `FSP-WKR-05` | continuation exact future有独立 non-cancelling owner，不能跨crash延长 |
| `SPC-WKR-06` | keep | `FSP-WKR-01` | 作为 Worker lifecycle final owner，吸收 fetch-cycle events并保留stop/drain/join结果 |
| `SPC-JRT-01` | keep | `FSP-JRT-01` | raw admission、header rejection和no-delivery deadline发生在typed dispatch前 |
| `SPC-JRT-02` | keep | `FSP-JRT-02` | host observation可以先于application terminal按deadline结束 |
| `SPC-JRT-03` | keep | `FSP-JRT-03` | exact spawned task从dispatch持续到terminal cell、join/take和Consumed |
| `SPC-JRT-04` | merge | `FSP-JRT-03` | residual drain处理的是同一task；并入owned invocation固定drain events，禁止误画第二次调用 |
| `SPC-APP-01` | keep | `FSP-APP-01` | Command application owner独占typed outcome、idempotency和write orchestration |
| `SPC-APP-02` | keep | `FSP-APP-02` | Query read owner必须保持33/33 no-write边界 |
| `SPC-APP-03` | keep | `FSP-APP-03` | Inbound application receipt owner独立于Worker transport observation |
| `SPC-APP-04` | keep | `FSP-APP-04` | Job application owner独立于Jobs runtime与plan/target/final authority |
| `SPC-IDEM-01` | keep | `FSP-IDEM-01` | fresh / replay / conflict / in-progress / consistency classification是独立并发事实观察 |
| `SPC-UOW-01` | keep | `FSP-UOW-01` | `Durable / NotDurable / Unknown`与rollback resolution只能由single authority结束 |
| `SPC-REPO-01` | keep | `FSP-REPO-01` | exact repository trait call需要独立技术边界；row/SQL仍禁入 |
| `SPC-PORT-01` | keep | `FSP-PORT-01` | 七类reference resolver共享typed local-call语义但不得声称remote parent |
| `SPC-PORT-02` | keep | `FSP-PORT-02` | traceability / audit export handoff outcome不同于resolver和collaboration |
| `SPC-PORT-03` | keep | `FSP-PORT-03` | collaboration item/page/outcome与Hub local capture / bind state必须分离 |
| `SPC-OUT-01` | keep | `FSP-OUT-01` | source mapper + immutable snapshot/capture属于pre-commit Phase A，不代表durable或delivered |
| `SPC-OUT-02` | keep | `FSP-OUT-02` | official capture/snapshot load + one collaboration call是post-commit / repair Phase B |
| `SPC-OUT-03` | keep | `FSP-OUT-03` | stable intent的local bind是独立short UoW Phase C |
| `SPC-JOB-01` | keep | `FSP-JOB-01` | planning / duplicate / initial journal authority不能与target或final混合 |
| `SPC-JOB-02` | keep | `FSP-JOB-02` | 每个ordinal是一个独立target orchestration和UoW结果边界 |
| `SPC-JOB-03` | keep | `FSP-JOB-03` | final report / stored surface / Completed / Finalized是独立final UoW |
| `SPC-INF-01` | keep | `FSP-INF-01` | runtime composition root负责complete handoff与prefix cleanup |
| `SPC-INF-02` | merge | `FSP-INF-01` | Stage 0~7并入startup root固定stage event；span tree完整性不得成为complete predicate |

裁决算术：candidate=`30`，keep=`27`，merge=`3`，reject=`0`，final profile=`27`。`merge` 只减少重复 runtime interval，不删除原候选的失败 / lifecycle 信息；三个被合并候选均有下节固定 span event 承接。

## 79. Final span identifier、semantic kind 与合并事件

### 79.1 Semantic kind 闭集

| semantic kind | 设计语义 | 允许的 final owner | 不等同于 |
|---|---|---|---|
| `entry_observation` | caller / host / dispatcher 可观察窗口 | API、Worker、Jobs | business success、application terminal、remote server span |
| `owned_invocation` | runtime owner持有并持续drive的exact future | API、Worker、Jobs | caller仍在等待、retry attempt、detached background work |
| `lifecycle` | process-local entry/task启动、park、stop、drain、join | Worker supervisor | protocol trace、source delivery lifecycle、ack/lease |
| `application` | exact application service method interval | Command、Query、Inbound、Job service | transaction、accepted truth、audit record |
| `authority` | idempotency、UoW、repository等local authority interval | application / persistence owner | business state、durability inference、database vendor span |
| `local_external_call` | Hub callsite围绕external Port形成的本地client-like interval | application + concrete adapter | remote child、propagation success、external truth |
| `outbound_phase` | immutable capture、collaboration、intent bind的A/B/C单phase interval | application event collaboration owner | outbox/relay/delivery attempt lifecycle |
| `job_phase` | plan、single target、final report的durable phase interval | application Job owner | whole-run atomic transaction、journal checkpoint替代物 |
| `startup` | validated root进入Stage 0至complete handoff或ordered cleanup | infra runtime builder | protocol trace、partial graph success、health proof |

这些值是 backend-neutral semantic kind，不是 OpenTelemetry `SpanKind`、`tracing` level或Rust enum。具体backend若只有 `INTERNAL / SERVER / CLIENT` 等不同kind集合，映射必须在Step 14受控回开时逐项记录；不得仅凭 `entry_observation` 声称远端SERVER parent存在，也不得仅凭 `local_external_call` 注入未声明context。

### 79.2 被合并候选的固定 span event

| event identifier | owning final span | 触发位置 | 固定安全字段 | 禁止解释 |
|---|---|---|---|---|
| `capability-hub.worker.source-cycle` | `FSP-WKR-01` | 一个named source进入fetch/wait并形成`item_available / parked / stopped / source_failed`之一时 | `source_slot`、`source_family`、`outcome`；failure时可加`error_kind / issue_ref` | 不记录topic/partition/offset/lease/ack；不创建Inbound trace；不证明重试或交付 |
| `capability-hub.jobs.residual-drain` | `FSP-JRT-03` | deadline/caller observation结束后，same task进入drain，以及join/take进入`Consumed`时 | `job_run_ref`、`lifecycle_state`、`outcome`；failure时可加`error_kind / issue_ref` | 不表示第二次dispatch、entry retry、business success或report durable |
| `capability-hub.infra.stage` | `FSP-INF-01` | Stage 0~7每个stage进入和terminal / prefix disposal时 | `stage`、`entry_kind`、`outcome`、可选`binding_state / cleanup_outcome / issue_ref` | 不记录raw config/graph handle；不得从event全集推导complete predicate |

固定 event 只存在于 owning span 内；backend不支持 span event 时，可以按相同 static identifier 和 allowlist降为该span的结构化附属记录，但不得新增独立 span、动态 event name 或第二 primary日志事实。

## 80. 27 个最终 span 的 owner、identifier 与精确生命周期

### 80.1 Entry / runtime profiles

| final profile | fixed span identifier | semantic kind | unique owner | exact start | exact end |
|---|---|---|---|---|---|
| `FSP-API-01` | `capability-hub.api.observation` | `entry_observation` | API route / envelope observation wrapper | trusted transport request进入route family、开始safe envelope / metadata gate；malformed trace尚不可信 | pre-dispatch rejection、typed response已映射可观察、transport observation timeout、或response mapping technical failure四者之一 |
| `FSP-API-02` | `capability-hub.api.invocation` | `owned_invocation` | API exact handler future owner | exact handler已选择，owner guard armed，future成功dispatch且第一次poll前 | same future真实typed terminal / `ApplicationError` / owner invariant failure已被owner取走；即使`FSP-API-01`已timeout也继续 |
| `FSP-WKR-01` | `capability-hub.worker.lifecycle` | `lifecycle` | Worker supervisor | selected Worker entry取得六个named source task与continuation owner，进入park/activate前 | stop已广播、continuation已drain、六feed均join，或ordered cleanup聚合失败后original precedence已保留 |
| `FSP-WKR-02` | `capability-hub.worker.inbound.observation` | `entry_observation` | Worker inbound dispatcher | source item已交给header-first admission、开始closed header/schema gate；header通过前trace可absent | rejected / unsupported、receipt processing action已观察、observation timeout、或dispatcher technical failure |
| `FSP-WKR-03` | `capability-hub.worker.inbound.invocation` | `owned_invocation` | Worker exact Inbound handler owner | validated envelope映射exact handler，owner guard armed并dispatch同一个application future | typed receipt / `ApplicationError`真实terminal且consuming completion完成；不得因observation timeout提前结束 |
| `FSP-WKR-04` | `capability-hub.worker.continuation.observation` | `entry_observation` | Worker exact capture-ref continuation caller | exact capture ref被continuation入口接收、尚未加载official snapshot | result已观察、observation timeout、spawn rejected或pre-dispatch load/shape failure |
| `FSP-WKR-05` | `capability-hub.worker.continuation.invocation` | `owned_invocation` | Worker continuation future owner | exact-ref future成功spawn且guard armed；snapshot load前current protocol trace可absent | same future typed outcome / `ApplicationError` / guarded owner failure真实terminal；不跨process crash |
| `FSP-JRT-01` | `capability-hub.jobs.admission` | `entry_observation` | Jobs header-first admission owner | bounded owned bytes进入closed job-name/schema/run metadata检查前 | rejected、no-delivery deadline、exact typed dispatch成功、或admission technical failure |
| `FSP-JRT-02` | `capability-hub.jobs.observation` | `entry_observation` | Jobs host observation owner | exact typed task已dispatch且host开始等待terminal cell | terminal已观察、original monotonic deadline先到、caller observation结束或host mapping failure；不取消task |
| `FSP-JRT-03` | `capability-hub.jobs.invocation` | `owned_invocation` | Jobs spawned task + terminal cell owner | exact application future被spawn，single terminal cell和join/take guard进入`InFlight` | terminal cell只写一次、same task完成join/take并进入`Consumed`，或runtime invariant / drain failure返回；`FSP-JRT-02`结束后仍继续 |

### 80.2 Application / local authority / external Port profiles

| final profile | fixed span identifier | semantic kind | unique owner | exact start | exact end |
|---|---|---|---|---|---|
| `FSP-APP-01` | `capability-hub.application.command` | `application` | exact Command application service | validated `CapabilityOperationContext`与exact Command body进入同名service method | `CapabilityCommandOutcome<R>`或existing `ApplicationError`返回；post-commit continuation不自动延长本span |
| `FSP-APP-02` | `capability-hub.application.query` | `application` | exact Query application service | validated Query context与exact Query body进入同名service method | Visible / NotVisible / Degraded / legal empty surface或existing `ApplicationError`返回；全程no-write |
| `FSP-APP-03` | `capability-hub.application.inbound` | `application` | exact Inbound application service | validated envelope-derived context与typed payload进入exact consumer method | typed receipt或existing `ApplicationError`返回；Worker receipt processing action不在本span内 |
| `FSP-APP-04` | `capability-hub.application.job` | `application` | exact Operations Job application service | validated runner context与typed Job input进入exact job method | typed Job response或existing `ApplicationError`返回；可包含多个phase child但不表示whole-run atomic UoW |
| `FSP-IDEM-01` | `capability-hub.authority.idempotency` | `authority` | application idempotency coordinator | preflight / atomic reserve / exact winner read中第一个实际authority call前 | fresh、completed replay、conflict、in-progress、exact winner classification或consistency error已形成；不跨mutation重放 |
| `FSP-UOW-01` | `capability-hub.authority.uow` | `authority` | UnitOfWork manager / commit resolution authority | 一次exact `begin`调用前；每个initial/target/final/short-bind UoW独立实例 | begin failure、commit `Durable / NotDurable / Unknown`、rollback terminal或rollback failure；不得跨下一UoW/reentry |
| `FSP-REPO-01` | `capability-hub.authority.repository` | `authority` | exact repository adapter callsite | Step 7 exact repository trait method invocation前 | typed repository return或mapped repository error；一个method call一个span，不包围caller loop |
| `FSP-PORT-01` | `capability-hub.port.reference-resolution` | `local_external_call` | application resolver callsite + named adapter | 七类matching reference resolver的exact Port callable调用前 | typed observation已完成shape校验，或existing Port / consistency error返回 |
| `FSP-PORT-02` | `capability-hub.port.audit-handoff` | `local_external_call` | application handoff callsite + named adapter | 实际发生的exact Port callable调用前；当前83-flow仅`C23 -> handoff_traceability`，`handoff_audit_export`无caller且不启动span | typed handoff outcome已完成shape校验，或existing Port / consistency error返回 |
| `FSP-PORT-03` | `capability-hub.port.event-collaboration` | `local_external_call` | application collaboration callsite + named adapter | `collaborate / get / list / repair`之一的exact Port callable调用前 | typed item/page/outcome已完成source/intent校验，或existing Port / consistency error返回 |

### 80.3 Outbound / Job phase / startup profiles

| final profile | fixed span identifier | semantic kind | unique owner | exact start | exact end |
|---|---|---|---|---|---|
| `FSP-OUT-01` | `capability-hub.outbound.capture` | `outbound_phase` | source-owning application Phase A | exact committed-source candidate mapper开始；仍位于source/target UoW内 | immutable serialization + snapshot + initial capture准备/保存返回，或mapping/codec/persistence failure；不跨source UoW commit，不声明durable |
| `FSP-OUT-02` | `capability-hub.outbound.collaboration` | `outbound_phase` | event collaboration application facade Phase B | exact capture load开始；deferred invocation此时只必有capture ref | official snapshot五元组/bytes/digest校验 + one `FSP-PORT-03` typed outcome/error完成；不跨Phase C UoW |
| `FSP-OUT-03` | `capability-hub.outbound.intent-bind` | `outbound_phase` | application capture owner Phase C | stable intent通过source symmetry、准备开始short bind UoW | `Captured -> IntentBound` short UoW获得Durable / NotDurable / Unknown、rollback failure或bind consistency error |
| `FSP-JOB-01` | `capability-hub.job.plan` | `job_phase` | application Job planning owner | validated service entry后开始scope / normalized-key planning | duplicate/conflict/in-progress/reentry classification，或fresh initial reservation + frozen journal UoW terminal；无target时也在此结束 |
| `FSP-JOB-02` | `capability-hub.job.target` | `job_phase` | application Job single-target owner | journal选择一个exact first Planned ordinal并冻结target ref | 该ordinal journal outcome Durable terminal、commit Unknown、confirmed rollback后仍Planned、或consistency/control-plane error返回；不跨下一ordinal |
| `FSP-JOB-03` | `capability-hub.job.finalize` | `job_phase` | application Job final assembler owner | journal exact load证明all targets terminal，开始pure report / stored surface assembly | report + stored result + idempotency Completed + journal Finalized的final UoW terminal，或exact error / Unknown返回 |
| `FSP-INF-01` | `capability-hub.infra.startup` | `startup` | `infra::runtime_builder` composition root | validated runtime root candidate进入Stage 0；不存在protocol trace | exactly one complete selected entry handoff，或startup failure后的owned-prefix ordered disposal结束；Stage 0~7使用§79.2 event |

所有 final span 都由其 unique owner开始和结束。上层 span只允许记录自己的 observation / invocation outcome；不得为了“完整树”结束下层 span、复制下层错误正文、推断 durability，或在下层未真实执行时预创建 child。

## 81. Final attribute vocabulary 与唯一来源

### 81.1 所有 final span 的共同字段规则

每个实际创建的 final span 固定携带其 `fixed span identifier` 和 `semantic kind`。下表字段是 span attribute key；它们不新增 Rust carrier，且只有在唯一来源已验证、对应值真实存在时才能写入。除表中明确为 static 的键外，缺失值必须保持 absent，禁止空字符串、`unknown`占位、随机值、时间戳替代或hash替代。

| attribute key | 唯一来源 | 表示与使用规则 | 禁止替代 |
|---|---|---|---|
| `owner` | §80 unique owner | fixed closed literal；span start时必有 | runtime type name、thread/task id |
| `phase` | Step 9/11/14 exact phase + §80 start point | fixed closed literal；span start时必有 | current state、free text、route |
| `outcome` | §80 exact end branch的typed return / error / timeout / lifecycle result | span end时必有；使用该owner existing variant或本节closed technical literal | 从log level、metric、elapsed threshold或child status猜测 |
| `protocol_family` | static code location | `command / query / inbound / outbound / job`；只在协议span使用 | route string、payload union debug name |
| `operation_name` | `CapabilityOperationContext.operation_name` closed mapper，或Step 8 exact protocol name | 仅metadata / context验证后写入 | handler path、body字段、dynamic function name |
| `flow_id` | Step 9 exact static code location | `C01..C26 / Q01..Q33 / I01..I06 / O01..O10 / J01..J08`；只有进入exact flow后写 | 从operation name运行时反解析 |
| `trace_context_ref` | current validated `TraceId`：Command/Query request metadata、Inbound envelope、Job metadata或same invocation context | opaque body-free value；表示current invocation correlation，不表示backend parent | request/source/run/result id、timestamp、random trace |
| `historical_trace_context_ref` | 已加载且通过symmetry校验的stored result/receipt/report、event snapshot或Job journal original `TraceId` | 只用于§83 historical link；必须同时有exact carrier ref | current trace覆盖、未经校验row、current truth重算 |
| `correlation_mode` | §83 carrier/lifecycle判定 | fixed `local_parent / trace_only / historical_link / local_root`之一 | 根据trace id相等猜parent |
| `link_relation` | exact replay / reentry / continuation branch | 只允许`command_replay / inbound_replay / job_replay / job_reentry / snapshot_continuation / collaboration_repair` | arbitrary relation text、retry authorization |
| `request_ref` | core request metadata `request_id` | validated Command / Query current request correlation | idempotency key、result ref |
| `source_event_ref` | validated Inbound envelope `CapabilitySourceEventRef` | source receipt / replay correlation | topic/offset/lease/payload id |
| `inbound_event_ref` | existing validated public-to-local one-way mapping | 仅mapping已完成后写 | 从payload/topic重建 |
| `job_run_ref` | validated `CapabilityJobMetadata.run_id` / operation context Job run id | current Job invocation / journal symmetry correlation | scheduler id、attempt、process id |
| `schema_version` | validated Step 8 protocol schema wrapper | exact numeric/wrapper safe representation | raw header、decoder guess |
| `source_family` | existing closed Inbound source family | Worker source / Inbound span | topic、provider、tenant自由文本 |
| `source_slot` | Step 14 six named Worker source slots | lifecycle / source-cycle event only | consumer group、queue、subscription |
| `entry_kind` | Step 14 selected entry | `API / Worker / Jobs` fixed closed value | listener/server implementation name |
| `lifecycle_state` | Step 14 existing runtime lifecycle | parked/active/stopping/draining/joined/ready/in_flight/consumed等已定义值 | persisted business state、attempt state |
| `cleanup_outcome` | exact Step 14 ordered cleanup / join result | only when known | original failure replacement、zero-effect claim |
| `subject_ref` | current exact flow typed body-free subject/ref | 每个profile至多选择一个primary subject；只有已验证/已形成时写 | object body、display text、all related refs dump |
| `result_ref` | existing stored application/protocol result ref | 只在已形成或exact replay加载并验证后写 | current response body、new id for duplicate |
| `receipt_ref` | existing stored Inbound receipt/result ref | 只在已形成或exact replay加载并验证后写 | Worker processing action、ack token |
| `report_ref` | existing stored Job/reconciliation report ref | 只在已形成或exact replay加载并验证后写 | current count重建、run id替代 |
| `snapshot_ref` | existing event/reference snapshot typed ref | official snapshot通过owner/schema/digest/bytes symmetry后写 | snapshot bytes、digest、current source serialization |
| `capture_ref` | existing exact `CapabilityEventCaptureRef` | capture形成或exact load通过symmetry后写 | outbox id、delivery attempt |
| `intent_ref` | existing external collaboration stable intent ref | typed outcome通过source/intent symmetry后写 | local delivery state、receipt body |
| `traceability_ref` | existing traceability / handoff typed ref | exact handoff call / stored surface correlation | evidence alias、external audit body |
| `port_family` | existing `ApplicationPortKind` / Step 7 exact Port owner | closed Port family | provider/endpoint/remote service instance |
| `adapter_kind` | Step 14 named adapter family/binding | closed configured/fake adapter category；只用于Port/startup定位 | endpoint、credential、private status/health |
| `target_ordinal` | validated Job journal target ordinal | `FSP-JOB-02` single target only | retry attempt、loop counter |
| `resolution` | existing `CapabilityCommitResolution` | only `Durable / NotDurable / Unknown` from authority | row absence、span status、elapsed time |
| `rollback_outcome` | exact UoW rollback branch | only `succeeded / failed / not_attempted` when known | zero effect、commit result |
| `disposition` | existing protocol / receipt / Job / external typed disposition | owner-visible exact variant | synthesized `Observed / Logged / Delivered` |
| `error_kind` | existing `ApplicationError` / entry wrapper typed variant | closed variant/category only | `Display`、`Debug`、raw source code/status |
| `issue_code` | existing `CapabilityIssueCode::literal()` | fixed literal only | free text、raw adapter code |
| `issue_ref` | existing deterministic body-free issue ref | only when already formed | random diagnostic id、stack hash |
| `binding_state` | Step 14 existing binding matrix | Configured / DeterministicFake / Disabled / Missing | inferred health、fallback choice |
| `stage` | Step 14 Stage 0~7 | `FSP-INF-01` stage event only | arbitrary constructor/function name |
| `event_family` | Step 8 ten exact Outbound protocol names的closed static mapper | Outbound Phase A/B/C only | topic、route、payload variant debug text |
| `job_kind` | Step 8 eight exact Job names的closed static mapper | Jobs runtime/application/phase only | scheduler task name、input variant debug text |

`transaction_ref` 仍为 reserved-not-emitted：Step 11/14 没有安全 accessor，本批不新增 accessor，也不允许 `Debug`、inner value或自行hash。`idempotency_key`、key hash、request/payload digest同样不进入span attribute；idempotency只记录closed classification与已有request/source/run ref。

### 81.2 Correlation 字段的成组不变量

1. `historical_trace_context_ref` 不能单独出现；必须同时有恰好一个已验证的 `result_ref / receipt_ref / report_ref / snapshot_ref / capture_ref`，Job reentry还必须有 `job_run_ref`，并设置 `correlation_mode=historical_link`与exact `link_relation`。
2. `trace_context_ref` 与 `historical_trace_context_ref` 即使字面值相同，也仍代表current与durable source两个角色；不得因此声称parent、same process或same invocation。
3. 一个span没有可信 current trace但加载到historical trace时，backend span仍是process-local root；historical值只作attribute/link，不切换当前backend context。
4. active local parent的成立以同一runtime owner持有的backend context为准，不以`TraceId`相等为准；parent结束早于non-cancelling child是允许的，child仍必须由owner结束。
5. 高基数ref只用于单记录定位，不进入R15.8 metric label；不得为了减少attributes把多个refs拼成free text或JSON。

## 82. 27 个 final span 的 attribute allowlist

下表中“required”不重复列出固定 span identifier、semantic kind、`owner`、`phase`和terminal `outcome`；这五项对每个实际创建并正常结束的span均必需。`conditional`只在指定source已存在且通过上游校验后出现。表外attribute全部禁止。

### 82.1 Entry / runtime allowlist

| final profile | required attributes | conditional attributes | profile-specific minimum |
|---|---|---|---|
| `FSP-API-01` | `entry_kind`; `protocol_family` once route family known | `operation_name`; `flow_id`; `request_ref`; `trace_context_ref`; `schema_version`; `disposition`; `error_kind`; `issue_code`; `issue_ref`; `correlation_mode` | malformed metadata不得输出raw trace/header；pre-dispatch不得伪造flow id |
| `FSP-API-02` | `entry_kind`; `protocol_family`; `operation_name`; `flow_id`; `request_ref`; `trace_context_ref`; `correlation_mode` | `disposition`; `result_ref`; `error_kind`; `issue_code`; `issue_ref`; replay时§83 historical trio | 只描述same exact future；outer timeout不写本span `timed_out/cancelled` |
| `FSP-WKR-01` | `entry_kind`; `lifecycle_state` | `source_slot`; `source_family`; `cleanup_outcome`; `error_kind`; `issue_code`; `issue_ref`; §79.2 source-cycle event fields | 无protocol trace；不得归因到最后一个source event |
| `FSP-WKR-02` | `entry_kind`; `protocol_family=inbound` | header通过后`operation_name`; `flow_id`; `source_family`; `source_event_ref`; `inbound_event_ref`; `schema_version`; `trace_context_ref`; `correlation_mode`; `disposition`; `error_kind`; `issue_code`; `issue_ref` | header前只允许entry/phase/outcome；不记录transport cursor |
| `FSP-WKR-03` | `entry_kind`; `protocol_family=inbound`; `operation_name`; `flow_id`; `source_family`; `source_event_ref`; `schema_version`; `trace_context_ref`; `correlation_mode` | `inbound_event_ref`; `receipt_ref`; `result_ref`; `disposition`; `error_kind`; `issue_code`; `issue_ref`; replay时§83 historical trio | timeout后继续保留current invocation；不记录ack/retry truth |
| `FSP-WKR-04` | `entry_kind`; `capture_ref`; `correlation_mode` | official load后`snapshot_ref`; `historical_trace_context_ref`; `link_relation=snapshot_continuation`; `error_kind`; `issue_code`; `issue_ref` | 开始时没有protocol trace是合法的；不得以capture ref生成trace |
| `FSP-WKR-05` | `entry_kind`; `capture_ref`; `correlation_mode` | `snapshot_ref`; `intent_ref`; `historical_trace_context_ref`; `link_relation=snapshot_continuation`; `disposition`; `error_kind`; `issue_code`; `issue_ref` | 不跨crash；不把historical trace设为current parent |
| `FSP-JRT-01` | `entry_kind`; `protocol_family=job` | header通过后`operation_name`; `job_kind`; `flow_id`; `job_run_ref`; `schema_version`; `trace_context_ref`; `correlation_mode`; `disposition`; `error_kind`; `issue_code`; `issue_ref` | raw bytes / malformed run / malformed trace永不输出 |
| `FSP-JRT-02` | `entry_kind`; `protocol_family=job`; `operation_name`; `job_kind`; `flow_id`; `job_run_ref`; `schema_version`; `trace_context_ref`; `correlation_mode` | `disposition`; `result_ref`; `report_ref`; `error_kind`; `issue_code`; `issue_ref` | deadline outcome只属于host observation，不复制到application/target span |
| `FSP-JRT-03` | `entry_kind`; `protocol_family=job`; `operation_name`; `job_kind`; `flow_id`; `job_run_ref`; `schema_version`; `trace_context_ref`; `correlation_mode`; `lifecycle_state` | `disposition`; `result_ref`; `report_ref`; `error_kind`; `issue_code`; `issue_ref`; replay/reentry时§83 historical trio；§79.2 drain event fields | one task / one terminal cell；不得记录attempt、queue、lease或entry retry |

### 82.2 Application / authority / Port allowlist

| final profile | required attributes | conditional attributes | profile-specific minimum |
|---|---|---|---|
| `FSP-APP-01` | `protocol_family=command`; `operation_name`; `flow_id`; `request_ref`; `trace_context_ref`; `correlation_mode` | `subject_ref`; `result_ref`; `disposition`; `error_kind`; `issue_code`; `issue_ref`; replay时§83 historical trio | post-commit Port/collaboration不默认包含在application terminal |
| `FSP-APP-02` | `protocol_family=query`; `operation_name`; `flow_id`; `request_ref`; `trace_context_ref`; `correlation_mode` | one `subject_ref`; `disposition`; `error_kind`; `issue_code`; `issue_ref` | no idempotency/UoW write/capture/handoff/report-repair attributes |
| `FSP-APP-03` | `protocol_family=inbound`; `operation_name`; `flow_id`; `source_event_ref`; `trace_context_ref`; `correlation_mode` | `inbound_event_ref`; one `subject_ref`; `receipt_ref`; `result_ref`; `disposition`; `error_kind`; `issue_code`; `issue_ref`; replay时§83 historical trio | receipt action与external ack不进入application span |
| `FSP-APP-04` | `protocol_family=job`; `operation_name`; `job_kind`; `flow_id`; `job_run_ref`; `trace_context_ref`; `correlation_mode` | one `subject_ref`; `result_ref`; `report_ref`; `disposition`; `error_kind`; `issue_code`; `issue_ref`; reentry/replay时§83 historical trio | whole span不承诺one-UoW、all-target success或report durable |
| `FSP-IDEM-01` | `protocol_family`; `operation_name`; `flow_id`; `correlation_mode` | channel-specific `request_ref / source_event_ref / job_run_ref`; `trace_context_ref`; `result_ref / receipt_ref / report_ref`; `disposition`; `error_kind`; `issue_code`; `issue_ref`; replay时§83 historical trio | key、key hash、digest、attempt、winner body全部禁止 |
| `FSP-UOW-01` | `operation_name`; `flow_id`; `correlation_mode` | current `trace_context_ref`; reentry-owned `historical_trace_context_ref`; one safe `request_ref / source_event_ref / job_run_ref / capture_ref / report_ref`; `resolution`; `rollback_outcome`; `error_kind`; `issue_code`; `issue_ref` | transaction ref/inner id、row absence、replica、SQL禁入；一个实例一个UoW |
| `FSP-REPO-01` | `operation_name`; `flow_id`; `port_family`; `correlation_mode` | current/historical trace according to active owner；one `subject_ref / result_ref / receipt_ref / report_ref / snapshot_ref / capture_ref`; `error_kind`; `issue_code`; `issue_ref` | row/body/SQL/table/connection/replica/page dump禁入 |
| `FSP-PORT-01` | `operation_name`; `flow_id`; `port_family`; `adapter_kind`; `correlation_mode` | current `trace_context_ref`; one `subject_ref`; typed `disposition`; `error_kind`; `issue_code`; `issue_ref` | locator、external body/status/code、endpoint和remote propagation claim禁入 |
| `FSP-PORT-02` | `operation_name`; `flow_id`; `port_family`; `adapter_kind`; `correlation_mode` | current `trace_context_ref`; `traceability_ref`; one `subject_ref`; typed `disposition`; `error_kind`; `issue_code`; `issue_ref` | handoff package/body、evidence、signature、remote receipt body禁入 |
| `FSP-PORT-03` | `operation_name`; `flow_id`; `port_family`; `adapter_kind`; `correlation_mode` | current `trace_context_ref`; historical trio per§83；`capture_ref`; `snapshot_ref`; `intent_ref`; typed `disposition`; `error_kind`; `issue_code`; `issue_ref` | candidate bytes、route、attempt、lease、ack、local Delivered/Pending state禁入 |

### 82.3 Outbound / Job phase / startup allowlist

| final profile | required attributes | conditional attributes | profile-specific minimum |
|---|---|---|---|
| `FSP-OUT-01` | `protocol_family=outbound`; `event_family`; `flow_id`; `correlation_mode` | current `operation_name`; `trace_context_ref`; one source `subject_ref`; formed `snapshot_ref`; `capture_ref`; `error_kind`; `issue_code`; `issue_ref` | snapshot bytes/digest/schema body、delivery state禁入；span end不表示commit Durable |
| `FSP-OUT-02` | `protocol_family=outbound`; `event_family`; `capture_ref`; `correlation_mode` | current `operation_name / trace_context_ref / flow_id` when active；`snapshot_ref`; `historical_trace_context_ref`; `link_relation`; `intent_ref`; `disposition`; `error_kind`; `issue_code`; `issue_ref` | current truth、payload bytes、external receipt/attempt禁入 |
| `FSP-OUT-03` | `protocol_family=outbound`; `event_family`; `capture_ref`; `intent_ref`; `correlation_mode` | current `operation_name / trace_context_ref / flow_id`; `snapshot_ref`; `historical_trace_context_ref`; `link_relation`; `resolution`; `rollback_outcome`; `error_kind`; `issue_code`; `issue_ref` | only local IntentBound authority；不记录Delivered或approval/evidence |
| `FSP-JOB-01` | `protocol_family=job`; `operation_name`; `job_kind`; `flow_id`; `job_run_ref`; `trace_context_ref`; `correlation_mode` | `report_ref`; `result_ref`; `disposition`; `resolution`; `rollback_outcome`; `error_kind`; `issue_code`; `issue_ref`; replay/reentry时§83 historical trio | scope/input/body/frozen target list、key/digest禁入 |
| `FSP-JOB-02` | `protocol_family=job`; `operation_name`; `job_kind`; `flow_id`; `job_run_ref`; `target_ordinal`; `correlation_mode` | current `trace_context_ref`; journal `historical_trace_context_ref`; `link_relation=job_reentry` when reentered；one `subject_ref / capture_ref / report_ref`; `disposition`; `resolution`; `rollback_outcome`; `error_kind`; `issue_code`; `issue_ref` | target body/finding detail、next ordinal、attempt禁入；一个span不跨target |
| `FSP-JOB-03` | `protocol_family=job`; `operation_name`; `job_kind`; `flow_id`; `job_run_ref`; `correlation_mode` | current `trace_context_ref`; journal `historical_trace_context_ref`; `link_relation=job_reentry`; `report_ref`; `result_ref`; `disposition`; `resolution`; `rollback_outcome`; `error_kind`; `issue_code`; `issue_ref` | report body/items、current truth rescan、target rerun禁入 |
| `FSP-INF-01` | `entry_kind`; `correlation_mode=local_root` | `binding_state`; `cleanup_outcome`; `error_kind`; `issue_code`; `issue_ref`; §79.2 stage event fields | 无protocol trace；raw config/path/endpoint/credential/graph handle/partial graph禁入 |

## 83. Parent、current trace 与 historical link 最终判定

### 83.1 Correlation mode 定义

| mode | 成立条件 | backend relation | required correlation material | 禁止声明 |
|---|---|---|---|---|
| `local_parent` | 同一process、same owned invocation内存在仍可引用的active local parent context | process-local parent/child；parent可以早于non-cancelling child结束 | current `trace_context_ref`若协议已验证；parent identity只留backend内部 | remote parent、sampling continuity、同一transaction |
| `trace_only` | 有validated current `TraceId`，但没有可证明local parent | process-local root或backend自行关联；只写current trace attribute | `trace_context_ref` | 根据TraceId构造parent span id或W3C context |
| `historical_link` | exact durable carrier已加载且trace/ref symmetry通过 | current process span保持自己的root/local parent；historical材料作为logical link attribute/event | `historical_trace_context_ref` + exact carrier ref + `link_relation`；有current trace时两者并存 | 切换current trace、继续旧process span、声称OpenTelemetry SpanLink已实现 |
| `local_root` | lifecycle/startup/pre-header活动本来没有trusted protocol trace | process-local root | safe entry/lifecycle identity only | fake protocol trace、request/run/source ref替代trace |

### 83.2 Boundary-by-boundary 判定

| boundary | current relation | historical relation | final rule |
|---|---|---|---|
| API observation -> API owned invocation | same process owner可证明local parent | duplicate时stored result可在application/idempotency层link | `FSP-API-02`可为`FSP-API-01` local child；observation timeout后child继续，不改parent关系 |
| API owned invocation -> Command/Query application | same exact future可证明local parent | Command duplicate由stored result link；Query无historical write/replay link | application span使用local parent；API不结束application span |
| Worker inbound observation -> owned invocation -> application | header验证后same dispatcher/owner可证明local parent | duplicate receipt由stored receipt link | outer timeout结束observation，same Inbound future和application继续；不创建第二receipt span |
| Worker continuation observation -> owned invocation | exact capture-ref owner可证明process-local relation；通常无current protocol trace | snapshot load后使用snapshot/capture + original trace | `FSP-WKR-04/05`开始可为local root；不得把source historical trace设parent |
| Jobs admission -> host observation / owned invocation | dispatch成功后same process owner可证明local parent | completed replay / reserved reentry从report/journal link | `FSP-JRT-03`可outlive`FSP-JRT-02`；deadline不产生新task/span tree |
| application -> idempotency / UoW / repository | same invocation call stack/context | Job reentry的journal trace在current application下作historical link | local child only when actual call occurs；duplicate不创建mutation UoW |
| application -> external Port | Hub callsite可作local parent | deferred collaboration可同时有snapshot historical link | 只创建Hub-local `FSP-PORT-*`；Port signature无context，remote propagation=`unsupported_not_claimed` |
| source operation -> Outbound Phase A | same source/target UoW内可作local parent | none；使用current source trace | `FSP-OUT-01`不得跨source commit；capture不证明Durable |
| source commit -> immediate Phase B/C | 只有仍在same owned invocation且active context可证明时使用local parent | snapshot/capture仍可作exact stable correlation | 不延长Phase A跨commit；B/C各自独立span |
| crash / Worker deferred / J08 repair -> Phase B/C | no old local parent | snapshot/capture/intent + source original trace | new process/current Job span + historical link；绝不继续old source span |
| fresh Job plan -> target -> final | same current application invocation可形成local parent | journal original trace是durable authority | 每phase独立span；不得把three phases画成one atomic UoW |
| reserved Job reentry | new current runtime/application span | journal original trace + run + target/report ref | current and historical traces并存；只从first Planned ordinal继续 |
| startup / Worker lifecycle / pre-header reject | no protocol parent | none | `local_root`；协议要求的trace缺失仍按validation reject，不用lifecycle root掩盖 |

### 83.3 五协议 metadata 与 absent-context 最终表

| protocol / owner | current trace source | required supporting identity | missing / malformed handling | replay / continuation handling |
|---|---|---|---|---|
| Command | `CapabilityCommandRequest.metadata.request.trace_id` -> validated `CapabilityOperationContext` copy | request ref + exact command / flow | metadata gate reject；pre-gate API span保持trace absent | duplicate保留current trace；validated stored result + original trace使用`command_replay` link |
| Query | `CapabilityQueryRequest.metadata.request.trace_id` -> validated context copy | request ref + exact query / flow | metadata gate reject；不生成fallback | 无stored write replay；每次read只使用current trace，33/33 no-write |
| Inbound | `CapabilityInboundEventEnvelope.trace_id` -> validated context copy | source event ref + source family + schema + exact consumer / flow | header/schema reject；malformed raw值不进入attribute | duplicate保留current envelope trace；stored receipt + original trace使用`inbound_replay` link |
| Outbound | Phase A source `CapabilityOperationContext.trace_id`;snapshot保存original source trace | event family + exact source ref；形成后snapshot/capture | source contract required mismatch按existing error；deferred continuation开始时trace absent合法 | immediate可local parent；deferred/J08使用snapshot/capture + original trace，relation为`snapshot_continuation`或`collaboration_repair` |
| Job | `CapabilityJobMetadata.trace_id` -> runner/current context | run ref + job kind + schema + exact flow | pre-header reject不伪造trace/run；validated missing按existing rejection | completed replay使用report/result + `job_replay`; reserved reentry使用journal + `job_reentry`，业务record仍保留journal original trace |

### 83.4 九个 external Port 的传播否定表

| Port family | final local span | current local correlation | remote propagation claim | typed outcome不得替代 |
|---|---|---|---|---|
| `ExternalCapabilitySourceReference` | `FSP-PORT-01` | callsite current trace + subject ref | unsupported / not claimed | provider health、runtime integration、canonical local state |
| `GovernanceResultReference` | `FSP-PORT-01` | callsite current trace + governance result ref | unsupported / not claimed | approval、Policy、workflow decision |
| `MethodAssetReference` | `FSP-PORT-01` | callsite current trace + method asset ref | unsupported / not claimed | method body/source/execution/lifecycle |
| `SecretReference` | `FSP-PORT-01` | callsite current trace + secret ref only | unsupported / not claimed | secret value、credential validity、vault health |
| `ExternalDocumentReference` | `FSP-PORT-01` | callsite current trace + document ref | unsupported / not claimed | document/OpenAPI/schema body or correctness |
| `CapabilityConsumerReference` | `FSP-PORT-01` | callsite current trace + runtime-tools/SDK consumer ref | unsupported / not claimed | runtime/tools execution、SDK client/package/publication |
| `ObservabilityAuditReference` | `FSP-PORT-01` | callsite current trace + audit ref | unsupported / not claimed | raw telemetry/audit body、evidence、acceptance |
| `ObservabilityAuditHandoff` | `FSP-PORT-02` | callsite current trace + traceability/export ref | unsupported / not claimed | delivery proof、evidence alias、sign-off |
| `CapabilityAccessEventCollaboration` | `FSP-PORT-03` | callsite current trace；deferred branch可加snapshot historical link | unsupported / not claimed | Hub delivery state、outbox/relay/DLQ、attempt/ack/lease |

所有九个trait signature都没有`TraceId`、parent context、trace flags或instrumentation carrier。具体adapter不得私加“隐式header已传播”的设计承诺；未来若backend/runtime可透明传播，必须受控回开 Step 7/14/15并证明不扩散第三方context到application/public/persisted surface。

## 84. Status、error、timeout 与 observer failure 规则

### 84.1 Backend-neutral status policy

| terminal branch | required `outcome` meaning | backend status policy | 明确不代表 |
|---|---|---|---|
| normal typed success / no-op / empty / Visible | exact typed variant orclosed success literal | unset / ok | committed truth unless UoW authority separately saysDurable |
| business/policy rejection、NotVisible、Degraded、Unsupported、typed external Unavailable/Failed/Retryable | exact existing disposition | unset；用attribute表达，不自动设technical error | application crash、remote transport failure、retry authorization |
| completed duplicate replay | exact duplicate/replayed disposition | unset / ok afterstored symmetry passes | original mutation rerun、新truth、newaudit |
| caller observation timeout / monotonic deadline | `timed_out` / `deadline_elapsed` onobservation span only | unset；不得传播到owned invocation/application status | cancellation、failed、zero-effect、NotDurable |
| existing `ApplicationError` technical branch | exact `error_kind` + optional issue | error | rollback result、durability、business disposition |
| `CommitOutcomeUnknown` | `outcome=unknown`; `resolution=Unknown` | error | failed、NotDurable、safe retry、zero effect |
| rollback failed | `outcome=rollback_failed`; `rollback_outcome=failed` | error | original error被替换为业务truth、rollback succeeded |
| consistency / owner invariant failure | exact error / issue | error | missing/degraded/typed external failure、automatic repair |
| startup / cleanup failure | `failed / cleanup_failed` + exact safe issue | error | partial graph可用、protocol rejection、business failure |
| observer backend failure | original span fields/status保持原branch；必要时span可能缺失 | 不允许改写original status | rollback、caller error、retry、receipt/report/capture变化 |

backend若不支持`unset`，可使用其“不标记error”的等价状态。不得把R15.6 log level直接映射为span status，也不得把R15.8 metric outcome反向设置span status。

### 84.2 Non-cancelling terminal invariants

| pair | outer end | owned span required behavior | forbidden implementation |
|---|---|---|---|
| `FSP-API-01` / `FSP-API-02` | transport observation timeout / mapping failure | exact handler future继续到typed terminal并由API owner结束 | drop/abort future、second dispatch、把inner标timeout |
| `FSP-WKR-02` / `FSP-WKR-03` | receipt observation timeout | same Inbound future继续并只形成one receipt/result | retry/ack推断、second key/handler、orphan span |
| `FSP-WKR-04` / `FSP-WKR-05` | continuation observation timeout | same exact capture-ref future继续到guarded terminal | new capture ref、new candidate、cross-crash span延长 |
| `FSP-JRT-02` / `FSP-JRT-03` | deadline / caller observation end | same task写single terminal cell、join/take、Consumed；drain event记录same task | abort/detach/reinvoke、entry auto-retry、新run/key |

### 84.3 Observer failure与递归保护

1. span start、attribute、event、end、sampling或export失败均为 observation failure，不得进入 application return type、UoW、repository、Port、protocol response、receipt、capture、journal或report。
2. 若已有独立非递归fallback，最多发一次R15.6 `L-DIAG-03 capability.observer.sink_failure`和R15.8 `MP-DIAG-03 capability_hub_observer_sink_failures_total`；不得为该failure再创建span/event。
3. 无独立fallback时静默停止本次instrumentation并保留原业务 / cleanup result；不得panic、abort process、rollback或改写status。
4. span guard/drop不能拥有业务future；future owner必须是Step 14 runtime guard。丢失span guard不得drop/cancel业务future。
5. `CapabilityDiagnosticMode::Off` 时所有本节span/event调用必须等价于process-local no-op；`Redacted`时只允许§82 allowlist。没有`Full / Verbose`旁路。

## 85. Final forbidden payload 与 no-truth table

| scope | forbidden material | 原因 / 必须使用的替代 |
|---|---|---|
| all final spans/events | raw request/query/event/job body、serialized bytes、payload snapshot bytes、external response/body、free text reason、`Display/Debug` error、stack trace、SQL | 只使用typed disposition/error/issue和body-free ref |
| identity / idempotency | full idempotency key、key hash、request/payload digest、normalized key、winner body、attempt | 只使用current request/source/run ref和closed classification |
| transport / runtime | raw path/header、URL、endpoint、topic、partition、offset、consumer group、queue、lease、ack、delivery token、socket/process/thread/task id | 只使用closed entry/source/Port/adapter family与lifecycle state |
| config / startup | raw config key/value、env/file path、credential、secret、TLS material、graph handle、partial graph dump | 只使用stage、entry、binding state、safe issue |
| repository / UoW | row/document body、table/collection、query text、connection/replica、transaction inner value、lock token、staged write set | 只使用Port family、typed subject ref、resolution/rollback outcome |
| external MCP / A2A / API | provider identity、route/session、request/response、tool result、health、quota、cost、private status/code | 只使用typed Port family/outcome；不推断runtime truth |
| governance / method-library | approval、vote、workflow、Policy/shared-rule body、method body/source/package/execution result | 只使用governance result ref / method asset ref与Hub relation |
| secret / document | secret value、credential、KMS/Vault body、document/OpenAPI/schema body、locator | 只使用typed body-free ref / safe summary state |
| SDK / runtime / tools / marketplace | client/package/generated code、execution/authorization result、listing/ranking/pricing/transaction | 只使用controlled view或consumer ref；不形成这些系统truth |
| observability / audit / acceptance | raw log/metric/span/audit body、external ledger body、evidence alias、signature、sign-off、run_id伪证 | 只使用existing audit/traceability/export ref和typed handoff outcome |
| Outbound collaboration | candidate/snapshot body、external receipt body、route、attempt、lease、ack、local outbox/relay/DLQ、Delivered/Pending lifecycle | 只使用snapshot/capture/intent refs与typed external outcome；Hub只持有IntentBound local authority |
| Job | input/scope body、frozen target list、finding/report item body、current truth scan dump、scheduler/attempt state | 只使用run ref、ordinal、single subject/ref、journal/report/result ref |
| correlation | generated fallback trace、SpanId/parent/flags/baggage、malformed raw trace、request/run/result ref masquerading astrace、unverified historical row | absent保持absent；只从§81/§83 exact carrier读取 |

### 85.1 No-truth assertions

1. span existence、tree、status、event或attribute不证明accepted truth、durability、zero effect、external delivery、governance approval、method validity、runtime execution、SDK publication、marketplace listing、audit acceptance或evidence。
2. `FSP-UOW-01.resolution`只能复制authority return；其他span不得从child status推导resolution。
3. `FSP-PORT-03.disposition`只表示external typed observation；`FSP-OUT-03`只表示local intent bind，二者不能互相生成状态。
4. `FSP-JOB-02`不能作为journal checkpoint，`FSP-JOB-03`不能从span tree组装report，Jobs runtime不能从span授权entry retry。
5. `FSP-INF-01`与stage event不能替代Step 14 complete predicate；缺少span或stage event不表示startup incomplete。
6. Query 33条flow只有read/application/repository visibility；任何 idempotency、write UoW、external Port、capture、handoff、Job phase或audit-write span实例均为设计违规。

## 86. 83-flow final span 反向映射

### 86.1 Final bundle 与条件 token

本节 bundle 只压缩表格排版，不是新span、Rust helper、facade、配置或backend abstraction。每个span仍只在§80 exact start真实发生时创建；`conditional`表示该call / phase未发生时对应span实例必须为0。

| bundle / token | final expansion | branch rule |
|---|---|---|
| `FB-CMD` | `FSP-API-01/02 + FSP-APP-01 + conditional FSP-IDEM-01/FSP-UOW-01/FSP-REPO-01` | pre-dispatch只有API observation；completed duplicate只允许classification + exact stored read，不创建mutation UoW/Port/capture span |
| `FB-QRY` | `FSP-API-01/02 + FSP-APP-02 + conditional FSP-REPO-01` | 33条Query的idempotency、write UoW、external Port、Outbound、Job phase均为0 |
| `FB-IN` | `FSP-WKR-02/03 + FSP-APP-03 + conditional FSP-IDEM-01/FSP-UOW-01/FSP-REPO-01` | header reject/Unsupported不dispatchapplication；duplicate只做stored receipt read |
| `FB-OUT` | `FSP-OUT-01 + conditional FSP-OUT-02/FSP-PORT-03/FSP-OUT-03` | A/B/C只按实际进入创建；immediate与deferred continuation不得同时重复同一Phase B/C span |
| `FB-JOB` | `FSP-JRT-01/02/03 + FSP-APP-04 + FSP-JOB-01 + conditional FSP-IDEM-01/FSP-JOB-02/FSP-JOB-03/FSP-UOW-01/FSP-REPO-01` | completed duplicate在plan/classification + stored report read后停止；fresh/reserved才有target/final |
| `FX-RESOLVE` | `FSP-PORT-01` | 仅exact matching resolver callable真实执行时创建 |
| `FX-HANDOFF` | `FSP-PORT-02` | 仅traceability / audit export handoff callable真实执行时创建 |
| `FX-CAPTURE` | `FSP-OUT-01 + active FSP-UOW-01/FSP-REPO-01` | 仅accepted source确实形成immutable snapshot/capture；origin flow与Outbound row引用同一实例 |
| `FX-COLLAB` | `FSP-OUT-02 + FSP-PORT-03 + conditional FSP-OUT-03/FSP-UOW-01` | official stored candidate / stable intent only；get/list/repair不自动bind |
| `ER-OWNED` | existing owner span + `error_kind/issue_code/issue_ref` only whenallowed | Step 12 error不创建generic error span；形成error的existing owner结束为technical error |

API/Worker/Jobs lifecycle profiles并不为每条exact flow重复声明新的identifier；它们按每次actual invocation创建实例。Worker `FSP-WKR-01`和infra `FSP-INF-01`是non-flow process lifecycle，既不计入83条flow，也不能被某一flow独占。

### 86.2 Command 26 / 26

| ID | exact operation | final span expression | required zero / correlation rule |
|---|---|---|---|
| `C01` | Establish capability access context | `FB-CMD + FX-RESOLVE + conditional FX-CAPTURE` | resolver仅在candidate resolution调用；rejected/duplicate无capture |
| `C02` | Correct capability identity | `FB-CMD + conditional FX-CAPTURE` | no external resolver；capture不证明commit/delivery |
| `C03` | Retire capability identity | `FB-CMD + conditional FX-CAPTURE` | dependent reads local；no directory rebuild span |
| `C04` | Record access review fact | `FB-CMD + conditional FX-CAPTURE` | review trace不是governance approval |
| `C05` | Register registry entry | `FB-CMD + conditional FX-CAPTURE` | no marketplace/listing span |
| `C06` | Update registry lifecycle | `FB-CMD + conditional FX-CAPTURE` | no runtime availability/execution span |
| `C07` | Update registry visibility basis | `FB-CMD + conditional FX-CAPTURE` | no runtime allow/deny span |
| `C08` | Retire registry entry | `FB-CMD + conditional FX-CAPTURE` | no projection rebuild span |
| `C09` | Establish adapter descriptor | `FB-CMD + conditional FX-CAPTURE` | no provider invocation/body/health span |
| `C10` | Replace adapter descriptor | `FB-CMD + conditional FX-CAPTURE` | loaded descriptor only repository child |
| `C11` | Record descriptor risk summary | `FB-CMD + conditional FX-CAPTURE` | no policy approval/quota/cost span |
| `C12` | Attach descriptor secret ref | `FB-CMD + FX-RESOLVE + conditional FX-CAPTURE` | Secret resolver body-free；secret value/health zero |
| `C13` | Attach governance seam | `FB-CMD + FX-RESOLVE + conditional FX-CAPTURE` | governance result ref only；approval/workflow zero |
| `C14` | Replace governance seam | `FB-CMD + FX-RESOLVE + conditional FX-CAPTURE` | replacement exact refs；no remote parent claim |
| `C15` | Expire governance seam | `FB-CMD + conditional FX-CAPTURE` | no governance Port invocation |
| `C16` | Attach method relation | `FB-CMD + FX-RESOLVE + conditional FX-CAPTURE` | method asset ref only；body/execution zero |
| `C17` | Remove method relation | `FB-CMD + conditional FX-CAPTURE` | no method-library mutation/call span |
| `C18` | Establish formal exposure | `FB-CMD + conditional FX-CAPTURE` | no runtime/tools/SDK invocation |
| `C19` | Update formal applicability | `FB-CMD + conditional FX-CAPTURE` | applicability不是runtime authorization |
| `C20` | Suspend formal exposure | `FB-CMD + conditional FX-CAPTURE` | no downstream cache invalidation truth |
| `C21` | Retire formal exposure | `FB-CMD + conditional FX-CAPTURE` | no SDK unpublish/listing span |
| `C22` | Record change impact | `FB-CMD + conditional FX-CAPTURE` | impact不是execution/billing/acceptance |
| `C23` | Record traceability handoff summary | `FB-CMD + conditional FX-HANDOFF` | local revision/UoW与external Port span分开；no evidence/sign-off |
| `C24` | Record reference resolution state | `FB-CMD + conditional FX-RESOLVE + conditional FX-CAPTURE` | canonical local state authority；resolver只在flow调用 |
| `C25` | Register external document ref | `FB-CMD + FX-RESOLVE + conditional FX-CAPTURE` | no document/OpenAPI/schema body |
| `C26` | Register capability consumer ref | `FB-CMD + FX-RESOLVE + conditional FX-CAPTURE` | no runtime/tools execution或SDK client/package |

Command arithmetic：26个unique exact ID；missing=`0`、extra=`0`、duplicate=`0`。所有completed duplicate只保留current `FSP-API-01/02 + FSP-APP-01 + FSP-IDEM-01 + exact FSP-REPO-01`，通过stored result + original trace建立`command_replay` historical link；`FSP-UOW-01` mutation、`FSP-PORT-*`、`FSP-OUT-*`均为0。

### 86.3 Query 33 / 33

| ID | exact query | final span expression | explicit no-write / no-call rule |
|---|---|---|---|
| `Q01` | Get capability identity | `FB-QRY` | no identity mutation / idempotency |
| `Q02` | Search identities | `FB-QRY` | empty page normal；no index repair |
| `Q03` | Get access review fact | `FB-QRY` | optional absence不创建fact |
| `Q04` | Get registry entry | `FB-QRY` | no registry write |
| `Q05` | List registry entries | `FB-QRY` | no cursor persistence |
| `Q06` | Get registry visibility semantics | `FB-QRY` | no exposure/visibility creation |
| `Q07` | Get adapter descriptor | `FB-QRY` | no provider read-through/reconstruction |
| `Q08` | Get risk summary | `FB-QRY` | no approval/quota/cost inference |
| `Q09` | Get secret safe summary | `FB-QRY` | no external secret Port/value/health span |
| `Q10` | List descriptors by capability | `FB-QRY` | no descriptor creation |
| `Q11` | Get governance seam | `FB-QRY` | no governance Port/approval audit |
| `Q12` | Get access-governance separation | `FB-QRY` | optional seam absence normal |
| `Q13` | Get method relation | `FB-QRY` | no method body/execution |
| `Q14` | List capability relations | `FB-QRY` | no relation merge/capture |
| `Q15` | Get formal exposure | `FB-QRY` | no runtime allow/SDK publish |
| `Q16` | Get formal applicability | `FB-QRY` | no authorization/deny record |
| `Q17` | Get controlled consumer view | `FB-QRY` | no refresh Job/rebuild |
| `Q18` | List runtime-tools consumable capabilities | `FB-QRY` | no runtime/tools invocation/cache |
| `Q19` | Get SDK exposure boundary | `FB-QRY` | no SDK generation/package/publication |
| `Q20` | Get capability access trace | `FB-QRY` | no trace append/repair/handoff |
| `Q21` | Get capability change impact | `FB-QRY` | no impact write |
| `Q22` | Get downstream impact summary | `FB-QRY` | stored Delayed/Unavailable不是processing timeout |
| `Q23` | Get audit handoff trace summary | `FB-QRY` | no handoff Port/evidence/signature |
| `Q24` | Search capability directory | `FB-QRY` | no projection rebuild |
| `Q25` | Browse capability directory | `FB-QRY` | no current-truth reconstruction |
| `Q26` | Get audit-friendly export summary | `FB-QRY` | no raw telemetry/audit handoff |
| `Q27` | Get ecosystem discovery summary | `FB-QRY` | no marketplace listing/ranking/pricing |
| `Q28` | Get reconciliation report | `FB-QRY` | no report rebuild |
| `Q29` | Get reference resolution state | `FB-QRY` | no resolver refresh / external Port |
| `Q30` | Get external document ref | `FB-QRY` | no document body/state refresh |
| `Q31` | Get runtime-tools consumer ref | `FB-QRY` | no runtime/tools call |
| `Q32` | Get SDK consumer ref | `FB-QRY` | no SDK client/package call |
| `Q33` | Get observability-audit ref | `FB-QRY` | no raw telemetry/audit body/handoff |

Query arithmetic：33个unique exact ID；missing=`0`、extra=`0`、duplicate=`0`。所有33条中`FSP-IDEM-01`、write `FSP-UOW-01`、`FSP-PORT-01..03`、`FSP-OUT-01..03`、`FSP-JOB-01..03`实例均为0；legal empty / NotVisible / Degraded不会自动标technical error。

### 86.4 Inbound 6 / 6

| ID | exact consumer | final span expression | required zero / correlation rule |
|---|---|---|---|
| `I01` | Governance result reference changed | `FB-IN + conditional FX-RESOLVE + conditional FX-CAPTURE` | no governance approval/Policy truth |
| `I02` | Method asset reference changed | `FB-IN + conditional FX-RESOLVE + conditional FX-CAPTURE` | no method body/source/execution |
| `I03` | Downstream consumption impact reported | `FB-IN + conditional FX-CAPTURE` | stored Delayed不是Worker timeout/retry |
| `I04` | External capability source ref changed | `FB-IN + conditional FX-RESOLVE + conditional FX-CAPTURE` | no provider body/runtime integration |
| `I05` | Audit material ref changed | `FB-IN + conditional FX-RESOLVE + conditional FX-CAPTURE` | no raw telemetry/evidence/handoff success |
| `I06` | External document ref changed | `FB-IN + conditional FX-RESOLVE + conditional FX-CAPTURE` | no document/OpenAPI/schema body |

Inbound arithmetic：6个unique exact ID；missing=`0`、extra=`0`、duplicate=`0`。Header rejection / Unsupported只有`FSP-WKR-02`，application及其children为0。Completed duplicate只保留current Worker/application/idempotency + exact stored receipt read，并使用`inbound_replay` historical link；resolver/effect/capture不得重跑。

### 86.5 Outbound 10 / 10

| ID | exact event family | final span expression | phase / truth boundary |
|---|---|---|---|
| `O01` | Capability identity changed | `FB-OUT` | exact identity source；no runtime identity/listing |
| `O02` | Capability registry changed | `FB-OUT` | no reconciliation/listing inference |
| `O03` | Adapter descriptor changed | `FB-OUT` | no secret/provider execution health |
| `O04` | Governance seam relation changed | `FB-OUT` | no approval/workflow decision |
| `O05` | Capability method relation changed | `FB-OUT` | no method body/execution/lifecycle mutation |
| `O06` | Formal exposure boundary changed | `FB-OUT` | no runtime authorization/SDK publication/listing |
| `O07` | Controlled consumer view availability changed | `FB-OUT` | no runtime cache delivery/current-view rebuild |
| `O08` | Capability change impact identified | `FB-OUT` | no execution/billing/acceptance |
| `O09` | Derived material refreshed | `FB-OUT` | no evidence/automatic truth repair |
| `O10` | Reference resolution changed | `FB-OUT` | resolver response/provider health不是source |

Outbound arithmetic：10个unique exact ID；missing=`0`、extra=`0`、duplicate=`0`。Originating C/I/J row与O row的Phase A是同一个`FSP-OUT-01`实例。Immediate continuation可以使用local parent；Worker deferred、crash recovery和J08只能用snapshot/capture/intent + historical source trace，不能跨commit/crash延长span。

### 86.6 Operations Job 8 / 8

| ID | exact Job | final span expression | duplicate / reentry / truth rule |
|---|---|---|---|
| `J01` | Registry reconciliation | `FB-JOB + conditional FX-CAPTURE` | report来自journal；no registry repair |
| `J02` | Controlled consumer view refresh | `FB-JOB + conditional FX-CAPTURE` | target/no-op exact；no formal exposure write |
| `J03` | Directory projection rebuild | `FB-JOB + conditional FX-CAPTURE` | no registry/descriptor/exposure backfill |
| `J04` | Audit-friendly export preparation | `FB-JOB + conditional FX-CAPTURE` | summary refs only；no telemetry/evidence/signature |
| `J05` | Ecosystem discovery rebuild | `FB-JOB + conditional FX-CAPTURE` | no listing/ranking/pricing/transaction |
| `J06` | Derived material reconciliation | `FB-JOB + conditional FX-CAPTURE` | no nested Job/repair/core truth mutation |
| `J07` | External reference resolution refresh | `FB-JOB + conditional FX-RESOLVE + conditional FX-CAPTURE` | target Port beforelocal target UoW；no provider health |
| `J08` | Event collaboration repair | `FB-JOB + FX-COLLAB` | stored capture/intent only；no mapper/current source/new capture |

Job arithmetic：8个unique exact ID；missing=`0`、extra=`0`、duplicate=`0`。Completed duplicate只进入runtime/application + `FSP-JOB-01/FSP-IDEM-01/FSP-REPO-01` stored report classification，`FSP-JOB-02/03`、resolver、capture和collaboration为0。Reserved reentry使用current runtime trace + journal original trace + run/target ref，从first Planned ordinal继续；不把new invocation冒充old process span。

### 86.7 Exact-set 与 non-flow closure

| audit subject | expected | actual | result |
|---|---:|---:|---|
| Command exact IDs | 26 | 26 | pass |
| Query exact IDs | 33 | 33 | pass |
| Inbound exact IDs | 6 | 6 | pass |
| Outbound exact IDs | 10 | 10 | pass |
| Job exact IDs | 8 | 8 | pass |
| total exact IDs | 83 | 83 | pass |
| missing / extra / duplicate exact IDs | `0 / 0 / 0` | `0 / 0 / 0` | pass |
| Query write-like / external-call / maintenance span instance | 0 | 0 | pass |
| flow with no final span owner | 0 | 0 | pass |

Non-flow owner也保持闭合：startup=`FSP-INF-01` + stage events，Worker source/stop/join=`FSP-WKR-01` + source-cycle events，API/Worker/Jobs timeout后的same-invocation owner=`FSP-API-02 / FSP-WKR-03 / FSP-WKR-05 / FSP-JRT-03`。这些不是第84个protocol flow。

## 87. 高风险分支、重复 owner 与跨 Step 最终审计

### 87.1 High-risk branch matrix

| branch | final span behavior | required authority/correlation | forbidden outcome | result |
|---|---|---|---|---|
| malformed / missing required protocol trace | entry observation可为`local_root`且trace absent；按existing metadata/schema reject结束 | safe entry phase + existing issue | random fallback、malformed raw trace、继续dispatch | pass |
| startup / pre-header lifecycle本来无trace | `FSP-INF-01 / FSP-WKR-01 / FSP-JRT-01` local root | entry/source/stage safe identity | 伪造request/source/run或protocol trace | pass |
| completed duplicate | current entry/application/idempotency + exact stored read；no mutation child | current trace + stored result/receipt/report ref + original trace historical link | original flow继续、new capture/UoW/Port/target | pass |
| idempotency conflict / in-progress | `FSP-IDEM-01`按current trace结束 | request/source/run ref + closed classification | key/hash/digest、persisted Conflict、retry授权 | pass |
| Query legal missing / NotVisible / Degraded | API/application/read repository span按typed surface结束 | current Query trace | technical error、write/Port/capture/repair child | 33/33 pass |
| commit unknown | current `FSP-UOW-01`以`resolution=Unknown`结束；caller可关联但不改写 | authority return + current/historical trace as applicable | success、NotDurable、zero effect、blind retry | pass |
| rollback failed | current UoW technical error；original failure precedence保留 | exact rollback branch + safe issue | rollback succeeded、business result、normal failure折叠 | pass |
| API observation timeout | `FSP-API-01 timed_out`;same `FSP-API-02`继续 | runtime owner guard | application cancelled/failed、second dispatch | pass |
| Worker observation timeout | outer `FSP-WKR-02/04`结束；same `FSP-WKR-03/05`继续 | source/capture exact identity + owner guard | ack/retry、新key/ref、second receipt/candidate | pass |
| Jobs deadline/caller end | `FSP-JRT-02`结束；same `FSP-JRT-03`drain/join/Consumed | terminal cell + task owner | abort/detach/reinvoke/entry retry | pass |
| deferred Outbound continuation | new local root/current invocation；B/C各自span | snapshot/capture/intent + historical source trace | extend Phase A跨commit/crash、current truth remap | pass |
| external Port no context parameter | only Hub-local `FSP-PORT-*` | callsite current context + typed refs | remote parent/propagation/delivery/approval claim | 9/9 pass |
| typed external Failed/HandoffUnavailable | Port span以typed disposition正常结束，technical raw failure才error | existing Port return / error mapper | local delivery state、evidence、automatic retry | pass |
| Job reserved reentry | current runtime/application + remaining phase spans | journal original trace/run/ordinal/ref historical link | rescan/replan、continue old process span、replace original metadata | pass |
| Job target/final span absent due duplicate | no target/final span | exact stored report/result authority | infer target rerun orwhole-run success fromtree | pass |
| observer sink/export failure | original span/business outcome不变；最多non-recursive log/metric | R15.6/R15.8 diagnostic owner | recursive span、rollback、caller error/status overwrite | pass |
| startup stage event loss | root span/business startup result不变 | Step 14 complete predicate | graph incomplete、restart、protocol failure | pass |

### 87.2 Unique owner 与重复观测规则

| observable fact | unique final owner | allowed surrounding observation | forbidden duplicate |
|---|---|---|---|
| caller-visible timeout/deadline | `FSP-API-01 / FSP-WKR-02/04 / FSP-JRT-02` | owned child continues | application / UoW / Job target也标timeout |
| exact future terminal | `FSP-API-02 / FSP-WKR-03/05 / FSP-JRT-03` | application child记录自己的typed return | outer observation复制inner error/durability |
| application disposition | `FSP-APP-01..04` | entry records caller-visible mapping | entry重分类business result |
| idempotency branch | `FSP-IDEM-01` | application span关联disposition | second generic replay/conflict span |
| repository call | `FSP-REPO-01` | active application/UoW parent | adapter与application各发一个同义repository span |
| commit resolution | `FSP-UOW-01` | application/Job phase引用resolution | entry/application猜Durable/Unknown |
| external typed outcome | `FSP-PORT-01..03` | application/outbound/target orchestration包围 | Port与application复制两个primary external outcome |
| capture / collaborate / bind | `FSP-OUT-01/02/03`分别拥有 | origin flow和O row引用same instance | generic publish-success span替代A/B/C |
| Job plan / target / final | `FSP-JOB-01/02/03` | Jobs runtime/application包围 | runner用span重建journal/report或合并多target |
| startup complete | Step 14 builder authority；`FSP-INF-01`只观察 | stage event关联 | span tree / event count推导complete |

### 87.3 Capability Hub专项边界

| boundary | final span允许观察 | 明确不拥有 | result |
|---|---|---|---|
| capability identity / registry / descriptor | exact operation、typed subject/change/capture ref | runtime identity、provider health、listing、execution state | pass |
| governance seam | body-free governance result ref、Hub seam relation、handoff call | approval、Policy/shared rules、vote/workflow | pass |
| method-library relation | method asset ref、Hub relation | method body/source/package/execution | pass |
| formal exposure / controlled consumer | exposure/view/impact ref与Hub state | runtime/tools authorization/execution、SDK publication、marketplace listing | pass |
| external MCP / A2A / API | body-free resolver/collaboration Port call与typed outcome | provider request/response/session/tool result/route/health/cost | pass |
| event collaboration | snapshot/capture/intent ref与typed external status | local outbox/relay/DLQ/attempt/lease/ack/delivery proof | pass |
| observability / audit | audit ref / traceability/export handoff typed outcome | raw telemetry/audit store、evidence、acceptance signature | pass |

### 87.4 Step 6~14 source closure

| upstream | R15.10 final closure | result |
|---|---|---|
| Step 6 objects | only existing operation/stored/snapshot/capture/journal/report trace/ref carriers are read；no Span/context field added | pass |
| Step 7 Ports | nine external Port signatures remain unchanged；all remote propagation claims are zero | pass |
| Step 8 protocols | five metadata authorities and exact request/source/run/schema identities preserved；no wire delta | pass |
| Step 9 flows | 83/83 exact mapping preserves actual call and phase boundaries；no span crosses commit/crash/reentry | pass |
| Step 10 states | no `Observed/Traced/Delivered` synthetic state；span status not a state transition | pass |
| Step 11 consistency | UoW resolution remains sole durability authority；repository/span cannot prove commit | pass |
| Step 12 errors | technical status copies existing error precedence；typed reject/unavailable not blanket error | pass |
| Step 13 concurrency | duplicate/reentry current-vs-historical trace separation、no-rerun、no-blind-retry preserved | pass |
| Step 14 runtime/config | non-cancelling owners、Stage 0~7、Off/Redacted and cleanup precedence preserved | pass |

## 88. Backend-neutral implementation gate

### 88.1 Current design status

当前没有已授权的 `tracing`、OpenTelemetry、`log` exporter、trace backend、sampling policy或独立 observability crate，也没有本仓实现代码可证明某个span facade已经存在。因此本批只固定 callsite contract，不伪造 concrete crate、macro、subscriber、collector、exporter、remote propagation、运行结果或测试结果。

这不是当前 R15.10 的 unresolved upstream blocker：27个span的owner/start/end/attribute/status可以在backend-neutral层面闭合；但它是实现前的 **受控绑定前置门**。实施前必须通过Step 14/`04`/`07`规定的恢复流程明确具体绑定，不能由implementation agent自行选择依赖或扩散第三方类型。

### 88.2 Controlled reopen checklist

| gate item | implementation前必须固定 | rejection condition |
|---|---|---|
| backend dependency | crate/product、version、feature、license/source、direct owner member | 未登记依赖、默认启用network exporter、版本漂移 |
| direct dependency owners | 仅可在`application / infra / api / worker / jobs`中按actual callsite选择；`contracts / domain`禁止 | backend type进入contracts/domain或新增第八个crate |
| private binding surface | crate-private wrapper/macro/function的exact module、failure return/no-op和async context规则 | 新public trait/Port/protocol字段、第三方Span进入public signature |
| `Off / Redacted` | Off为zero-business-effect no-op；Redacted严格执行§82 allowlist | Full/Verbose旁路、raw debug field |
| async ownership | context attach不得拥有、drop、abort、clone或reinvokebusiness future；Step 14 guard仍是唯一owner | span guard drop导致future cancellation或orphan |
| local parent mapping | 只对same process active context；parent结束后child仍可terminal | 从TraceId构造SpanId/remote parent |
| historical link mapping | 保留current + historical trace + exact ref三元组；backend不支持link时用safe attributes/event | 切换current trace、声称OTel SpanLink或W3C propagation已成立 |
| status mapping | 按§84区分typed disposition、technical error、timeout和Unknown | log level直映status、Unknown变failed、typed unavailable blanket error |
| sink failure | non-recursive、never affects business；最多复用existing log/metric diagnostic owner | panic/rollback/caller error/observer retry flow |
| startup/export | exporter/backend不可成为complete graph或entry exposure前置，除非未来明确改需求并受控回开 | telemetry不可用阻塞Capability Hub业务entry、partial graph返回 |

### 88.3 Dependency and type leakage boundary

```text
contracts / domain
  -> know TraceId and business refs only
  -> MUST NOT know backend span/context/exporter types

application / api / worker / jobs / infra exact callsite
  -> consume private process-local instrumentation binding after controlled reopen
  -> keep business future ownership in Step 14 runtime guards

instrumentation backend / exporter
  -> best-effort observation only
  -> MUST NOT call repository, Port, domain transition, retry, receipt, capture, journal or report APIs
```

不得新增通用`ObservabilityPort`、observability ledger、第二metadata、persisted span id或独立observability workspace member。未来完整W3C remote parent / flags / baggage / sampling continuity需求必须先升级L0-core contract，并受控回开Step 6/7/8/14/15；当前设计不提前占位字段。

## 89. TRD-01~10 完成判定与机械自检

### 89.1 Decision completion matrix

| decision | required output | completion evidence | result |
|---|---|---|---|
| `TRD-01` | 30 candidates逐项裁决 | §78：27 keep + 3 merge + 0 reject -> 27 final | pass |
| `TRD-02` | identifier/kind/owner/start/end | §§79~80：27 unique fixed names、9 semantic kinds、exact owner/lifecycle | pass |
| `TRD-03` | three-entry observation vs owned invocation | §§80.1、84.2：API、Worker Inbound/continuation、Jobs均双interval闭合 | pass |
| `TRD-04` | current/historical/local parent/logical link | §83：4 correlation modes与boundary matrix | pass |
| `TRD-05` | five metadata + replay carrier + absent | §§81.2、83.3：5/5 authority与required-vs-lifecycle absent分开 | pass |
| `TRD-06` | per-span allowlist + forbidden payload | §§81~82、85：27/27 profile，表外字段默认禁止 | pass |
| `TRD-07` | nine external Port propagation rule | §83.4：9/9 Hub-local call，remote propagation claim=0 | pass |
| `TRD-08` | 83 exact flow final mapping | §86：26+33+6+10+8=83，missing/extra/duplicate=0 | pass |
| `TRD-09` | status/error/Unknown/observer failure | §84、§87.1：typed vs technical、timeout、Unknown、rollback、sink failure分离 | pass |
| `TRD-10` | backend-neutral implementation gate | §88：no invented crate/type；controlled reopen checklist与type leakage boundary | pass |

### 89.2 Mechanical audit

以下计数针对设计表，不是代码实现、运行实例或测试结果。

| audit item | expected | actual | result |
|---|---:|---:|---|
| R15.9 candidate definitions | 30 | 30 | pass |
| candidate decision rows | 30 | 30 | pass |
| keep / merge / reject | `27 / 3 / 0` | `27 / 3 / 0` | pass |
| final span profiles / unique identifiers | `27 / 27` | `27 / 27` | pass |
| semantic kinds | 9 | 9 | pass |
| merged fixed span events | 3 | 3 | pass |
| final profile allowlist rows | 27 | 27 | pass |
| correlation modes | 4 | 4 | pass |
| metadata protocol families | 5 | 5 | pass |
| external Port local-call rows | 9 | 9 | pass |
| remote parent / propagation claim | 0 | 0 | pass |
| exact flow IDs | 83 | 83 | pass；26/33/6/10/8 |
| missing / extra / duplicate exact IDs | `0 / 0 / 0` | `0 / 0 / 0` | pass |
| Query write-like / external / maintenance span | 0 | 0 | pass |
| raw body / secret / transport / evidence admitted | 0 | 0 | pass |
| new Rust type / field / variant / trait / Port / dependency | 0 | 0 | pass |
| structure / field comment delta | 0 | 0 | pass；本批无Rust声明可遗漏 |
| unresolved upstream blocker | 0 | 0 | pass |

### 89.3 Completion statement

R15.10的“再写入”目标已满足：30个候选已收敛为27个final span profile和3个owner-local fixed event；每个profile都有唯一identifier、semantic kind、owner、exact start/end、attribute allowlist、status规则和forbidden material；current trace、historical link、local parent、lifecycle absent、九Port propagation否定、non-cancelling timeout与83/83 exact flow均已闭合。

该完成判定只针对设计中间产物，不代表span已实现、backend已选择、依赖已加入、exporter已运行、remote propagation已验证、测试已执行或验收已签署。新增Rust声明与结构体/字段注释增量为0。两项既有non-blocking debt保持不变：`CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001`、`CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001`。

## 90. R15.10 stop-review snapshot 与下一批门禁

### 90.1 Stop-review snapshot

| item | stop-review state |
|---|---|
| current formal document | `03-详细设计.md`；未修改，仍等待Step 19 assembly |
| current calibration artifact | `03_ddd_step_15_observability_audit.md` |
| completed batch | `R15.10 trace / span / correlation:再写入` |
| batch status | `03_step_15_r15_10_completed_stop_review` |
| candidate decision | 30/30；27 keep、3 merge、0 reject |
| final span contract | 27 unique profiles/identifiers；9 semantic kinds；3 fixed merged events |
| metadata/correlation | 5/5 protocol family；4 modes；TraceId-only；remote parent/propagation unsupported/not claimed |
| exact flow closure | 83/83：Command 26、Query 33、Inbound 6、Outbound 10、Job 8 |
| non-flow closure | startup stage、Worker source/lifecycle、three-entry non-cancelling timeout/drain owner covered |
| backend status | not selected / not claimed；implementation前需受控回开Step 14 binding gate |
| new Rust declaration / comment delta | 0；结构体与字段注释无新增遗漏 |
| upstream blocker | none |
| non-blocking debt | existing two L0-core design-sync debts unchanged |
| implementation artifact | not created；implementation ledger与planned boundary skeleton仍禁止提前生成 |
| claimed implementation / test / evidence / sign-off | none；无commit、run_id、真实evidence alias、测试结果或验收签署声明 |
| commit | not requested and not created |

本批完成后停止在Step 15的R15.10 review gate。未经用户下一次明确确认，不进入R15.11，不修改正式`03/04`，不创建Step 16或任何implementation artifact。

### 90.2 R15.11 entry gate

```text
document = 03-详细设计.md
step = 15
completed_batch = R15.10 trace / span / correlation:再写入
status = completed_stop_review
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_11
next_batch = R15.11 audit / operations fact:先思考
allowed_scope_after_confirmation = accepted truth/change/trace/impact/capture/report/handoff fact inventory, non-audit branch classification, exact authority/source/consumer analysis and 83-flow reverse coverage as thinking artifact only
must_read_before_next_batch = this file §§9~20, §§35~46, §§54~63, §§77~90; 详细设计讨论流程_SOP.md Step 15; 详细设计书写规范.md §5.14; Step 6 truth/change/trace/impact/material/reference/capture/report objects; Step 7 audit/handoff/collaboration repositories and Ports; Step 8 stored result/receipt/report protocols; Step 9 exact accepted/rejected/duplicate/Query no-write side effects; Step 11 durability; Step 12 error precedence; Step 13 replay/reentry; Step 14 handoff/redaction boundaries
forbidden_until_next_gate = final audit/operations fact table, redaction final table, formal 03 assembly, 04, Step 16+, implementation ledger, planned boundary skeleton, code, tests, run_id, evidence, sign-off, commit
unresolved_upstream_blocker = none
```

R15.11只允许先思考哪些既有durable fact需要进入audit/operations表、哪些分支明确不是audit，以及它们的authority / consumer；不得同批直接写最终审计事件表，不得把log/metric/span、rejected/duplicate/unknown或external outcome伪造成accepted truth。

---

## 91. R15.11 audit / operations fact:授权、回读与 editorial token 边界

### 91.1 本批授权与恢复点消费

用户已明确同意从 `03_step_15_r15_10_completed_stop_review` 进入 `R15.11 audit / operations fact:先思考`。本批只做既有 durable truth 的候选盘点和权威来源推导；不把候选直接写成最终审计事件表，也不进入 `R15.12`。

| 本批允许 | 本批禁止 |
|---|---|
| 盘点 accepted truth、change、traceability、impact、reference、derived material、capture、stored result、receipt、journal、report、handoff 和 collaboration 的既有 owner | 新增 generic audit object、operations ledger、repository、Port、state、error、issue code、protocol 或 Rust declaration |
| 判断某一既有 carrier 是否具有 audit eligibility、operations fact 或 continuity/replay 资格 | 把 runtime log、metric、span、observer backend 或 external status 升级为业务 truth |
| 记录 source、authority、durable carrier、body-free ref、consumer 与禁止替代来源 | 直接确定最终 audit event name、最终字段 schema、日志/指标/trace字段或 redaction 表 |
| 对 `C01..C26`、`Q01..Q33`、`I01..I06`、`O01..O10`、`J01..J08` 做 exact reverse coverage | 修改正式 `03-详细设计.md`、创建 `04`、Step 16+、implementation artifact、测试结果、run_id、evidence、签署或 commit |

本批继续使用 `AF-*`、`OF-*`、`CF-*`、`HF-*`、`RF-*`、`DIAG-*` 和 `NA-*` 作为 **editorial candidate token**。这些 token 不是 Rust identifier、event key、schema field、metric name、Port、repository 或持久化对象。`R15.12` 只能在本批 source / authority 审计通过后，将需要落入正式 §14 的 token 映射到既有 carrier；若没有正式来源，必须保留为 non-audit 或 source-missing stop。

### 91.2 本批回读闭包与冲突处理

| 输入 | 本批实际用途 | 权威冲突处理 |
|---|---|---|
| Step 15 §§9~20、§§35~46、§§54~63、§§77~90 | 承接六层主语、最终日志/指标/trace/span边界、83-flow disposition 和禁止材料 | 只承接当前 Step 15 active baseline，不把旧正式 §14 当真相源 |
| Step 15 SOP 与书写规范 §5.14 | 保持“代码埋点切口”目标和最终三张表的回填格式 | 本批不提前填最终表，不加入告警或运维流程 |
| Step 6 对象契约 | 确认六类 change record、traceability、impact、derived/reference、snapshot/capture、Job journal 的正式字段来源 | 缺少正式 object / factory / repository 的候选不得升格为 fact |
| Step 7 Trait / Port / Adapter | 确认 reference resolver、audit handoff、event collaboration、stored-result、capture、journal 的 owner | `ReferencePort` 与 `HandoffPort` 永不合并；external outcome 不成为 Hub truth |
| Step 8 protocol 契约 | 确认 Command response、Inbound receipt、Outbound capture、Job report 和 duplicate replay surface | typed response 只证明声明的 protocol result，不自动证明业务 accepted truth |
| Step 9 function flows | 读取 83 条 exact flow 的 effect vector、same-UoW participant set、post-commit boundary 和 no-write规则 | 以 flow 的 exact side-effect inventory 为准，不由“所有 accepted 都一样”推断 |
| Step 11~13 | 确认 durability、commit resolution、rollback、duplicate、stored replay、capture recovery、Job journal recovery | `Unknown`、rollback failure、asymmetry 和 missing sidecar 均进入 stop/diagnostic，不进入 accepted fact |
| Step 14 | 确认 body-free、Off/Redacted、external binding、startup/entry owner 和 no-Cargo边界 | 任何 raw body、secret、transport、backend 或产品状态直接拒绝 |

### 91.3 事实进入候选表的判定顺序

一个候选主语必须按以下顺序判定，不能先起“audit event”名字再反推来源：

1. 先问它是否已经是 Step 6~11 定义、由正式 repository / UoW 保存并可被后续 flow exact-read 的事实。若是，优先归入既有 L2/L3/L4/L5 carrier；不得复制成 generic audit truth。
2. 再问它是否在 fresh accepted flow 的 effect vector 中明确出现，或由同一 flow 的 post-commit continuation 明确产生。没有 exact trigger 的候选不进入 R15.12。
3. 再验证 carrier 是否能提供稳定 typed ref、state、reason、exact source version、receipt、report 或 handoff ref。当前模型没有generic accepted `source_cursor`；不能提供 source 的字段不得由日志、指标或当前查询结果补造。
4. 再验证 body-free 和 redaction 条件。任何正文、serialized envelope bytes、secret、credential、transport metadata、stack trace 或外部 audit body 使该候选停止。
5. 最后区分它能证明的事实：accepted business change、operations outcome、continuity/replay、handoff attempt、derived/report result、diagnostic issue 或仅 runtime observation。不同类别不能共用一个“success”语义。

### 91.4 关联方向

```text
accepted local truth / change / trace / impact
                 |
                 +--> existing traceability / derived / report refs
                 |
                 +--> immutable snapshot + local capture (when flow declares)
                 |
                 +--> stored result / receipt / Job journal (continuity only)
                 |
                 +--> local handoff request --post-commit--> typed external outcome
                 |
                 +--> L1 log / metric / span / diagnostic observation

runtime signal, metric, span, external outcome, or query surface
                 -X-> accepted truth, replay authority, recovery decision, or audit body
```

`R15.11` 的核心结论是：最终 audit / operations 表可以引用既有 carrier，但不得因为需要“审计”而创建第二个 carrier。一个 carrier 可以被多个 consumer 通过 body-free ref 读取，但其 owner、写入时机和可证明范围不变。

## 92. Durable fact candidate inventory

### 92.1 Candidate class vocabulary

| token class | 本批语义 | 主要 authority | 是否可能进入正式 §14 |
|---|---|---|---|
| `AF-*` accepted-audit eligibility | 已接受且已 durable 的 capability access truth change、traceability 或 impact fact 的可审计引用资格；不是新 audit object | 对应 truth/change/trace/impact repository 与同一 local UoW | 可以，前提是 exact source、commit 和 ref 对称均已成立 |
| `OF-*` operations fact | reference、derived material、report、receipt、journal、binding 或 lifecycle 的运营事实 | 对应 object/repository、typed protocol surface 或 Job journal | 可以作为 operations fact；不得改名为 core truth audit |
| `CF-*` continuity/replay fact | reservation、stored result、receipt、snapshot、capture、journal 和 duplicate/reentry 的可恢复事实 | idempotency / stored-result / capture / Job-execution repository | 可以作为 continuity observation；不能证明业务 effect 以外的内容 |
| `HF-*` handoff/collaboration fact | local handoff request、stable intent、typed external outcome 和 repair boundary | local trace/export revision 或对应 external Port owner | 可以记录边界结果；不能声明 external delivery / acceptance |
| `RF-*` derived/report fact | controlled view、directory、export、discovery、reconciliation report 的已保存 revision/freshness/finding | derived/report repository 与 frozen Job plan | 可以作为 derived/operations fact；不能修复或替代 core truth |
| `DIAG-*` diagnostic fact | 既有 error/issue、commit unknown、rollback failure、consistency defect、redaction violation | Step 12 mapper、UoW owner、boundary owner | 只能作为 diagnostic / operational visibility；不得成为 accepted audit |
| `NA-*` non-audit | Query、runtime signal、duplicate replay observation、未证明 durable 的分支、外部正文和禁止材料 | 无 business-fact authority | 不进入 accepted audit；可由既有日志/指标/trace观察 |

### 92.2 Candidate inventory: accepted truth、operations、continuity

下表是候选 inventory，不是最终审计事件表。`allowed refs` 只表示可在后续表中引用的既有 typed ref / safe category，不表示新增字段。

| token | durable 主语与唯一 owner | trigger / admission | authority / carrier | allowed body-free refs | consumer | 禁止替代来源 | 初步裁决 |
|---|---|---|---|---|---|---|---|
| `AF-TRUTH-01` | 六类 core truth change record：identity、registry、descriptor、governance seam、method relation、formal exposure；owner 是对应 domain/application write flow | fresh Command 的声明 truth mutation 已完成并 commit；只限 effect vector 明确列出的 change record | 对应 `*ChangeRecord` append + same-UoW source object + `CapabilityChangeRecordRef` | change ref、subject id、kind、previous/next state、safe reason、actor context、`TraceId`、`recorded_at`及family-specific safe字段；六类record均无`version`字段 | trace query、impact/material builders、declared outbound source mapper、body-free handoff preparation | DB changelog、success log、current-state diff、external delivery、governance approval、runtime execution | accepted-audit eligible；R15.12必须按六家族保留 source 对称性 |
| `AF-TRACE-01` | access traceability revision；owner 是 `CapabilityTraceabilityRepository` / source application flow | `record_for_changes` 或 exact `request_handoff` 已在声明 flow 中形成并 commit | `CapabilityAccessTraceabilityRecord` append-only revision | traceability ref/version、subject、non-empty change refs、trace state、handoff ref set、safe reason、trace id | trace Query、audit-friendly export、handoff flow、impact derivation、external reference consumer | TraceId alone、runtime span、raw audit body、log line、evidence alias | accepted-audit eligible；`HandoffPending` 只证明 local request |
| `AF-IMPACT-01` | `CapabilityChangeImpactFact`；owner 是 trace-impact application service/repository | exact change/trace source 已 committed，impact command accepted | `CapabilityChangeImpactFact` versioned fact | impact ref/version、traceability ref、scope、consumer refs、safe impact state/reason | impact Query、downstream feedback flow、derived/report Job、declared outbound source | execution result、billing/cost、runtime health、downstream log、acceptance evidence | accepted-audit eligible for impact fact, not execution audit |
| `OF-IMPACT-02` | `DownstreamConsumptionImpactSummary`；owner 是 inbound feedback flow | I03 accepted 且 exact impact/consumer/source receipt 对称 | append-only downstream summary + stored inbound receipt | summary ref、impact ref、consumer ref、source event ref、closed state、safe observation/reason | impact Query、impact review follow-up、reconciliation/report consumer | external consumer body、request/result body、timeout guess、runtime deny | operations/feedback fact；不得升格为 core truth change |
| `OF-REF-01` | 八类 external reference object与其 canonical `ReferenceResolutionState`；owner 是 reference command/consumer/refresh flow | actual reference/state revision，且 source subject/kind/state id/version 对称 | reference repository + `ReferenceResolutionStateRepository`; actual state revision may form `ReferenceResolutionChanged` capture | reference subject/ref、kind、state ref/version、resolution value、safe reason、source version、trace id | reference Query、descriptor/relation/exposure gate、affected-material maintenance、reference refresh | resolver response body、provider health、state text inferred from log、missing-state default | operations fact；不是 six-family core change audit |
| `CF-RESULT-01` | completed Command stored result + idempotency completion；owner 是 write-channel flow | fresh accepted/rejected result reaches same-UoW stored surface and reservation completion | `StoredCapabilityOperationResult` + `CapabilityIdempotencyRecord` | result ref、operation/channel、stored disposition、surface ref/digest、trace id、completion state | exact duplicate replay、supporting operations query、recovery classification | response reconstructed from current truth、log aggregation、second mutation | continuity/replay only |
| `CF-RECEIPT-02` | Inbound receipt and consumer idempotency completion；owner 是 consumer flow | only declared receipt disposition is durably saved; `Delayed`/unsupported rules remain exact | `CapabilityInboundEventReceipt` + stored consumer receipt envelope | source event ref、consumer/source family、disposition、result ref if present、effect refs、issue refs、trace id | worker continuation、duplicate replay、consumer query/operations | worker completion log、topic/offset/lease、payload body、fresh duplicate processing | continuity plus protocol operations; not accepted core audit by itself |
| `CF-CAPTURE-03` | immutable outbound payload snapshot + local capture; owner is source-owning application UoW | O01~O10 Phase A source effect and complete mapper envelope commit together | `CapabilityEventPayloadSnapshot` + `CapabilityEventCaptureRecord` | source ref/version、snapshot ref、schema ref、candidate digest、capture ref/state、trace id | post-commit collaboration facade、repair Job、source event query | current truth remap、payload log、outbox/relay/attempt/DLQ state、external status copied locally | continuity fact; not delivery or accepted-audit proof |
| `CF-JOURNAL-04` | Operations Job execution journal; owner is Job application service | accepted Job initial/target/final UoW reaches exact journal state | `CapabilityJobExecutionRecord` + target plan/outcome | job kind/run ref、journal state、target ordinal/category、safe issue refs、trace id、final result ref | reentry, target processing, final report assembly, operations query | scheduler/queue/lease/attempt, log-derived progress, scope rescan, report-by-run lookup | continuity/operations fact |
| `OF-REPORT-05` | typed Job report and stored report envelope; owner is Job finalizer | all-terminal journal outcomes are pure-assembled and saved atomically with finalization/completion | `CapabilityJobReport<T>` + `CapabilityStoredJobReportEnvelope` + final journal/result ref | job/result/report refs、disposition、closed counts/categories、changed refs、failed/skipped refs、collaboration status refs | caller response、duplicate replay、operations/report Query、handoff preparation where explicitly declared | current material rescan、runtime log sum、external status as report detail、test/evidence claim | operations fact; report is not core truth |

### 92.3 Candidate inventory: handoff、derived/report、diagnostic 与 non-audit

| token | durable 主语与唯一 owner | trigger / admission | authority / carrier | allowed body-free refs | consumer | 禁止替代来源 | 初步裁决 |
|---|---|---|---|---|---|---|---|
| `HF-LOCAL-01` | local traceability `HandoffPending` revision；owner 是 `RecordTraceabilityHandoffSummary` | local request revision committed; optional audit ref was validated but external call has not yet been proved | exact traceability revision + optional `ObservabilityAuditRef` association | traceability ref、audit ref、scope category、state/reason、trace id | trace/handoff Query、later explicit handoff/review operation、audit-friendly export Job | external receipt, `Accepted` handoff outcome, evidence alias, acceptance signature | local operations/accepted revision; never external acceptance |
| `HF-AUDIT-02` | `ObservabilityAuditHandoffPort` typed outcome；owner is external handoff boundary, observed by application | current exact trigger仅为C23 post-commit `handoff_traceability` with trace ref and validated audit ref；`handoff_audit_export`虽已声明但当前无flow trigger | request-local `CapabilityAuditHandoffOutcome`;当前没有 Hub-owned durable outcome carrier，只有 local source revision 保持 durable | audit ref id、traceability ref、scope category、typed disposition、receipt ref only when outcome contract allows、safe reason；当前不得合成export ref outcome | runtime operations visibility、follow-up/retry owner already declared by C23 | local trace rewrite、source rollback、generic “audit succeeded”、external body/evidence、无caller的audit-export emission | boundary observation candidate only; no Hub-owned delivery/operations truth |
| `HF-COLLAB-03` | external event collaboration typed status/intent；owner is `CapabilityAccessEventCollaborationPort` | stored snapshot/capture candidate or existing intent exact call; local bind only after source/intent symmetry | request-local typed collaboration outcome/item；只有 capture `IntentBound` 与 Job journal/report 中已声明的 exact ref/status 才是 Hub durable carrier | capture ref、intent ref、source ref、schema/digest category、closed external status、safe issue ref | Outbound continuation、repair Job、runtime operations visibility | local delivery state, attempt counter, transport receipt body, second intent/event, accepted core audit | external-owned boundary observation; durable scope仅限既有 local bind/journal/report |
| `RF-MATERIAL-01` | controlled view, directory, discovery and audit-export revision; owner is corresponding derived repository | declared Command/Inbound/Job material revision commits with source-version fence | material object revision + `DerivedMaterialRef` + freshness/availability state | material ref/version、kind、source version set、freshness/availability、safe reason/count category | read Queries、refresh/rebuild Jobs、declared material outbound source | current truth mutation、query result as source, runtime cache, marketplace listing, raw audit body | derived/operations fact |
| `RF-REPORT-02` | immutable `CapabilityReconciliationReport`; owner is reconciliation Job/report repository | frozen truth/material basis produces completed/partial/inconsistent/rebuild-required/failed report | report ref/version, inspected truth/material refs, source versions, findings summary, report state | report ref、scope、state、source versions、finding category/count, job ref | report Query、maintenance/reconciliation operations、derived material consumer | automatic repair, current-state rescan, acceptance evidence, runtime health | derived/report fact |
| `DIAG-TECH-01` | existing `ApplicationError` / `CapabilityIssueCode` classification; owner is existing mapper and boundary | typed error, contract contradiction, redaction violation or Port raw failure reaches mapping | existing error/issue mapper; no new durable business object | error/issue category、phase、safe diagnostic ref、supporting typed refs、retry eligibility only when already typed | logs, metrics, spans, operations troubleshooting | error text as state, retry inference, accepted audit, fake success | diagnostic only |
| `DIAG-UNKNOWN-02` | `CommitOutcomeUnknown`, rollback failure, consistency defect, missing mandatory sidecar | authority cannot prove terminal durability or invariant | UoW/authority exact-read procedure and existing issue mapping | operation/ref category、resolution phase、safe transaction/result/capture/journal ref if already available | critical operations visibility and manual resolution | success/failure/zero-effect claim, blind retry, synthetic business rejection/report | diagnostic stop; never accepted audit |
| `NA-QUERY-01` | Query visible/empty/not-visible/degraded surface; owner is read resolver and exact repository read | every Q flow; strict no-write | request-local `CapabilityReadVisibilityDecision` + exact read surface | protocol/query family、visibility/freshness/degraded category、safe ref where already returned | read observability only | read audit append, stored result, trace/capture, refresh/repair, inference from empty page | explicit non-audit |
| `NA-RUNTIME-02` | API/Worker/Jobs/infra log, metric, span and observer signal | every runtime cut already closed in R15.6/R15.8/R15.10 | backend-neutral runtime instrumentation only | low-cardinality category or body-free correlation ref allowed by final profile | telemetry backend / troubleshooting | durability, business state, replay, report detail, acceptance | explicit non-audit |
| `NA-EXTERNAL-03` | raw resolver/adapter/provider/audit/transport body or external status not represented by typed outcome | any boundary without a closed typed carrier | no Hub authority | none beyond existing redacted issue category | none; redaction/diagnostic owner only | local audit, delivery fact, governance approval, method/runtime execution, evidence | hard stop / forbidden material |

### 92.4 Candidate class non-substitution rules

1. `AF-*` 可以引用 `CF-*` 的 result/capture ref 作为同一 accepted flow 的 continuity sidecar，但不能用 `CF-*` 反向证明 source truth 已提交。
2. `OF-REF-01` 的 canonical state revision 可以触发 `ReferenceResolutionChanged` capture，但 reference capture 不能替代 core change record；当前模型明确没有 reference-specific six-family change record。
3. `RF-*` 的 report、freshness、availability 和 finding 只能描述 derived material / report；它们不能修复 identity、registry、descriptor、relation 或 exposure，也不能证明外部 audit 已接收。
4. `HF-*` 的 local pending、external typed outcome 和 stable intent 是三个不同主语。任何一个主语都不能替代另一个主语的 receipt、delivery 或 acceptance。
5. `DIAG-*` 只能引用既有 category 和 ref；它不能创建 `Failed` target、`Rejected` business fact、retry authorization 或 accepted audit。
6. `NA-*` 即使被高频记录，也不会因日志量、指标值或 span status 变成 durable fact。

## 93. Accepted audit eligibility 与 operations fact 判定矩阵

### 93.1 Core truth 与 traceability families

| truth family | accepted audit eligibility | required proof before R15.12 | allowed local result | explicitly not proven |
|---|---|---|---|---|
| identity / access review | 只有 identity/review object、对应 identity change record、traceability revision（若 flow声明）和同一 UoW commit 全部对称时成立 | subject ref、change ref、trace ref、stored result/effect summary exact relation | accepted local identity/review change | governance approval、vote、runtime authorization、source payload validity beyond declared resolver result |
| registry | 只有 registry entry + `RegistryChangeRecord` + exact trace/capture/result（按 flow）成立时成立 | registry subject/version、change previous/next、trace/capture refs、commit resolution | accepted registry lifecycle/basis change | formal exposure、marketplace listing、runtime allowlist、external listing delivery |
| descriptor / secret safe summary | descriptor change record、descriptor/ref/state pair和 forbidden-body scan均通过时成立 | descriptor ref/version、change kind、safe marker、reference state/ref | accepted descriptor/safe-summary revision | provider health、secret validity/value、adapter runtime instance、method body |
| governance seam / method relation | local relation change record和 body-free governance/method reference state 对称时成立 | relation ref/version、change ref、external ref/state、trace/capture | accepted local relation revision | approval/Policy truth、method execution、external acknowledgement |
| formal exposure / visibility | exposure change record与 declared source-version-symmetric visibility/registry effects提交后成立 | exposure/visibility refs, change refs, source versions, effect summary | accepted formal exposure boundary change | runtime enforcement、SDK publication、marketplace transaction、consumer execution |

这些是 `AF-TRUTH-01` 的资格规则，不是要求每条 flow 额外创建一个 audit record。若任一 required proof 缺失，R15.12 必须停在 source-missing / consistency diagnostic；不能让实现者从 current state、log 或 metric 补全。

### 93.2 Reference、impact、derived 与 report families

| fact family | operations fact admission | durable source | allowed consumer | no-go inference |
|---|---|---|---|---|
| canonical reference state | 只有 actual state revision 才形成 operations fact；same-value/no-op 只保留 flow 声明的 receipt/replay surface | `ReferenceResolutionState` + exact reference object/state pair + optional `ReferenceResolutionChanged` capture | reference Query、dependent gate、affected material maintenance、refresh Job | resolver call success、provider health、missing state default、core relation approval |
| downstream impact summary | I03 的 typed feedback 被 exact impact/consumer/source 校验并 append 后成立 | `DownstreamConsumptionImpactSummary` + Inbound receipt | impact Query、review follow-up、report | downstream execution result、request body、runtime deny |
| mutable derived material | object revision、source-version fence、freshness/availability state和 declared capture（若有）同一 target UoW 成立后成立 | controlled view / directory / export / discovery repository + Job journal | read Query、refresh/rebuild Job、material event source | core truth mutation、current truth repair、marketplace listing |
| reconciliation report | frozen inspected refs/source versions与immutable report state已保存；report 可以是 `Failed`，但必须有 declared safe reason | `CapabilityReconciliationReport` + Job journal/report envelope | report Query、operations maintenance | automatic repair、acceptance evidence、log-summed findings |

### 93.3 Continuity / handoff families

| fact family | local authority | accepted scope | external scope | forbidden upgrade |
|---|---|---|---|---|
| Command/Inbound duplicate replay | immutable stored result / receipt and matching idempotency record | proves exact replay of the declared protocol response | none | new accepted audit, second mutation, new trace/capture, rerun resolver |
| Outbound capture | source revision + immutable snapshot + `CapabilityEventCaptureRecord` | proves a recoverable local candidate and optional stable intent binding | collaboration Port owns external status | outbox/delivery/attempt lifecycle, delivered audit, source rebuild |
| Job reentry/report | normalized-key Job journal + all-terminal target outcomes + stored typed report | proves execution journal/report continuity and duplicate replay | external target status only where typed Port outcome exists | scheduler progress, report reconstruction from current truth, retry permission from log |
| local handoff request | traceability next revision `HandoffPending` | proves Hub requested/recorded local handoff scope | external Port outcome is separate and post-commit | external received/persisted/accepted/evidence/sign-off |
| external audit handoff | typed `CapabilityAuditHandoffOutcome` with input audit ref symmetry | proves one request-local typed boundary outcome;当前不形成 Hub durable outcome record，receipt ref也不自动进入local trace/result | external system remains owner of body and delivery lifecycle | local accepted truth rewrite, generic audit success, evidence alias |
| external event collaboration | typed collaboration item/outcome plus local capture bind where applicable | proves inspected/returned typed collaboration status；Hub durable scope只到 declared capture bind或Job journal/report | Port owns intent/delivery status | local delivery state, second intent, source rollback |

## 94. 83-flow exact reverse coverage thinking table

本节按 exact flow ID 做反向覆盖。为避免再次复制 R15.4 的逐行 disposition 表，采用不重叠 bundle；每个 bundle 的 ID 列是完整、封闭、无重复的 exact set。bundle 只表达候选 fact 类别和 non-audit 分支，不提前命名最终审计事件。

### 94.1 Command `C01..C26`

| exact IDs | accepted / operations candidate | continuity candidate | handoff / collaboration candidate | explicit non-audit / stop |
|---|---|---|---|---|
| `C01,C02,C03,C04` | `AF-TRUTH-01` identity/review change + `AF-TRACE-01` when flow declares; C04 review fact remains local review truth | `CF-RESULT-01`; captures only declared identity/reference changes | `HF-COLLAB-03` only for declared outbound capture; no governance approval | rejected/no-op/duplicate do not create accepted change; duplicate exact replay only |
| `C05,C06,C07,C08` | `AF-TRUTH-01` registry change/trace; C07 actual basis/material effect follows its effect vector | `CF-RESULT-01` and declared capture | capture continuation only; no marketplace/runtime delivery | same-basis/no-op, stale, retired rejection and duplicate are not accepted registry audit |
| `C09,C10,C11,C12` | `AF-TRUTH-01` descriptor change; `OF-REF-01` for exact reference-state revisions; safe summary is local descriptor fact | `CF-RESULT-01`; declared descriptor/reference capture | typed resolver outcome is `DIAG-*` or `OF-REF-01`, never provider audit | secret/document/provider body, resolver raw failure and duplicate are non-audit/diagnostic |
| `C13,C14,C15,C16,C17` | `AF-TRUTH-01` seam/method relation change + exact trace; external ref state is separate `OF-REF-01` | `CF-RESULT-01`; captures only declared relation/reference changes | no audit handoff in C13~C17; only declared event-capture continuation remains separate | approval/vote/Policy body, method body, external acknowledgement, handoff success and duplicate are forbidden |
| `C18,C19,C20,C21` | `AF-TRUTH-01` formal exposure/visibility change and declared registry delta; exact source-version proof required | `CF-RESULT-01`; capture for actual exposure/material event only | no runtime/tools/SDK/marketplace collaboration claim | caller-forced visibility, view freshness, runtime allow/deny and duplicate do not become audit |
| `C22,C23` | C22 `AF-IMPACT-01`; C23 `AF-TRACE-01` local `HandoffPending` revision | `CF-RESULT-01`; C23 result stores local revision only | C23 may call `HF-AUDIT-02` after commit; outcome never rewrites stored result | C23 external success/failure, receipt/evidence/signature and duplicate are not accepted truth |
| `C24,C25,C26` | C24仅actual canonical state revision + material stale effects；C25保存`ExternalDocumentRef` + initial state；C26保存RuntimeTools/SDK consumer ref + initial state；三者`change_record_refs=[]`、`traceability_refs=[]` | `CF-RESULT-01`; `CF-CAPTURE-03` only on actual declared reference event | no implicit handoff; follow-up marker is not an invocation | resolver body, consumer execution, SDK publication, document evidence and duplicate are non-audit |

Command closure: `26/26` IDs appear exactly once; fresh accepted rows have a declared local carrier; stable rejection, duplicate, no-op, technical error and post-commit external outcome are never silently promoted to `AF-*`.

### 94.2 Query `Q01..Q33`

| exact IDs | existing surface that may be referenced | continuity / audit eligibility | explicit non-audit rule |
|---|---|---|---|
| `Q01,Q02,Q03,Q04,Q05,Q06` | exact identity/review/registry/visibility read surface | exact read may expose already persisted refs/state; no new fact | `NA-QUERY-01`; no reservation, stored result, trace append, read audit, capture or repair |
| `Q07,Q08,Q09,Q10` | descriptor/risk/secret-safe-summary read surface | existing descriptor/reference refs only | raw provider/secret body and “read success” audit prohibited |
| `Q11,Q12,Q13,Q14` | governance seam/method relation/ref-state read surface | existing local relation and canonical state refs only | no approval, method body, handoff or relation mutation |
| `Q15,Q16,Q17,Q18,Q19` | exposure/visibility/controlled-view/consumer-bound read surface | existing exposure/view/material refs and freshness categories only | view freshness is not exposure truth; no runtime/tools/SDK execution or write |
| `Q20,Q21,Q22,Q23` | trace/impact/downstream/handoff summary read surface | exact historical trace, impact, summary and local audit refs may be returned | no trace repair, handoff call, raw audit body or evidence/sign-off |
| `Q24,Q25,Q26,Q27,Q28` | directory/export/discovery/reconciliation material/report read surface | existing material/report revision and source version refs only | no rebuild, auto-repair, marketplace state or report-as-truth mutation |
| `Q29,Q30,Q31,Q32,Q33` | reference/document/runtime-tools/SDK/observability-audit ref/state read surface | exact registered ref/state only | `NA-QUERY-01` and `NA-EXTERNAL-03` for raw bodies; no resolver refresh, delivery or audit creation |

Query closure: `33/33` are explicit `NA-QUERY-01`; there is no Query accepted-audit candidate, no Query write-like span candidate and no Query-produced continuity record.

### 94.3 Inbound `I01..I06`

| exact IDs | accepted / operations candidate | continuity candidate | follow-up / handoff boundary | explicit non-audit / stop |
|---|---|---|---|---|
| `I01,I02,I04,I05,I06` | actual reference object/state revision -> `OF-REF-01`; no-change valid input -> no-op operations surface only | `CF-RECEIPT-02`; actual state revision may form `CF-CAPTURE-03` | body-free follow-up marker only; I05 never calls handoff Port | unsupported schema, raw body, quarantine, delayed without receipt and duplicate are not accepted audit |
| `I03` | `OF-IMPACT-02` downstream summary only after exact impact/consumer/source append | `CF-RECEIPT-02` with matching stored receipt | `H0`; impact review marker is not command/handoff | payload state `Delayed/Unavailable/Ignored` is not processing retry; no core truth mutation |

Inbound closure: `6/6`; every fresh accepted effect has either an exact reference-state or downstream-summary carrier, while receipt-only branches remain `CF-RECEIPT-02` and unsupported/rejected branches remain diagnostic/non-audit.

### 94.4 Outbound `O01..O10`

| exact IDs | source accepted fact | continuity candidate | collaboration candidate | explicit non-audit / stop |
|---|---|---|---|---|
| `O01,O02,O03,O04,O05,O06` | source-specific `AF-TRUTH-01` change record and exact source revision | `CF-CAPTURE-03` snapshot/capture; local `Captured -> IntentBound` only | `HF-COLLAB-03` typed external status; source remains local authority | no current-truth remap, second event, local delivery audit, governance/method/runtime claim |
| `O07,O08,O09,O10` | exact controlled-view/impact/derived/reference revision: `RF-MATERIAL-01`, `AF-IMPACT-01` or `OF-REF-01` as applicable | `CF-CAPTURE-03` with closed source variant | `HF-COLLAB-03`; external status remains Port-owned | material/report/ref event is not core truth repair, marketplace listing, delivery proof or evidence |

Outbound closure: `10/10`; all Phase A captures have a source carrier, all Phase B/C outcomes are `HF-COLLAB-03`, and no external status becomes `AF-TRUTH-01`.

### 94.5 Operations Job `J01..J08`

| exact IDs | durable operations / derived fact | continuity candidate | handoff / collaboration candidate | explicit non-audit / stop |
|---|---|---|---|---|
| `J01,J06` | `RF-REPORT-02` reconciliation report when frozen basis/report commits; no truth repair | `CF-JOURNAL-04` + `OF-REPORT-05` | only declared local material capture; no external handoff | log-summed findings, auto-repair, report-as-acceptance and duplicate scan are forbidden |
| `J02,J03,J04,J05` | `RF-MATERIAL-01` material revision; J04 audit export remains body-free derived fact | `CF-JOURNAL-04` + `OF-REPORT-05` | local `CF-CAPTURE-03` if material event declared; J04 no handoff Port | no raw audit body, evidence alias, marketplace listing, runtime execution or current-truth rebuild |
| `J07` | `OF-REF-01` actual canonical state revision; unchanged/terminal skip is a typed target outcome, not a new fact | `CF-JOURNAL-04` + `OF-REPORT-05` | no inline collaboration | no missing-state creation, terminal reopen, external body or material stale inference |
| `J08` | typed inspected collaboration status may enter `HF-COLLAB-03`; local capture bind is exact if it commits | `CF-JOURNAL-04` + `OF-REPORT-05` + `CF-CAPTURE-03` where declared | external get/repair/collaborate is Port-owned | no new event/capture/intent, no current source read, no local delivery lifecycle |

Job closure: `8/8`; journal is the reentry authority, report is the typed result/replay authority, and runtime runner signals remain `NA-RUNTIME-02`.

### 94.6 Exact-set audit

| family | expected | covered | missing | duplicate | result |
|---|---:|---:|---:|---:|---|
| Command | 26 | 26 | 0 | 0 | pass |
| Query | 33 | 33 | 0 | 0 | pass |
| Inbound | 6 | 6 | 0 | 0 | pass |
| Outbound | 10 | 10 | 0 | 0 | pass |
| Operations Job | 8 | 8 | 0 | 0 | pass |
| total | 83 | 83 | 0 | 0 | pass |

上述是中间产物的 exact-set 设计审计，不是代码实现、运行实例、测试执行或外部 evidence。

## 95. Source-missing、authority 不成立与必须停止矩阵

“没有来源”不是允许实现者自由补字段的提示，而是本设计的停止条件。下表的 `stop` 表示不得在 Step 15 内通过新对象或观测材料补齐；必要时回开拥有该事实的上游 Step。

| stop id | 发现的缺口 | 不得采用的伪来源 | 必须停止的输出 | 正确后续 owner |
|---|---|---|---|---|
| `SM-01` | accepted core mutation 没有对应 `*ChangeRecord` 或 source object 与 record 不对称 | DB changelog、current diff、success log | 不写 `AF-TRUTH-01`；标记 source-missing / consistency diagnostic | Step 6 object / Step 9 flow / Step 11 UoW |
| `SM-02` | change refs 存在但没有同 subject 的 traceability revision，或 trace 的 non-empty source set 无法验证 | `TraceId`、span id、log correlation、任意 subject string | 不写 accepted trace audit；不得让 `AF-TRACE-01` 代补 change source | Step 6 trace object、Step 7 repository、Step 9 flow |
| `SM-03` | impact fact 缺少 exact trace/change source、consumer set 或 version对称 | downstream log、metric、external feedback body、current consumer view | 不写 `AF-IMPACT-01`；只保留既有 typed error/diagnostic | Step 6 impact / Step 9 impact flow |
| `SM-04` | canonical reference state 变更没有 current subject/state pair、version或 declared capture source | resolver response body、`Resolved`默认值、last log line | 不写 `OF-REF-01` 或 reference capture；状态变更 flow 必须 stop | Step 6/7 reference contract、Step 9/11 |
| `SM-05` | derived material/report 缺 source versions、frozen refs、safe finding或 repository revision | current truth rescan、Query body、metric counts、log aggregation | 不写 `RF-MATERIAL-01` / `RF-REPORT-02`;不能生成 report | Step 6 derived/report、Step 9 Job、Step 11/13 |
| `SM-06` | snapshot/capture 缺 source/schema/digest/time对称，或 capture 无 immutable snapshot | current truth remap、payload bytes from log、adapter private queue | 不写 `CF-CAPTURE-03`;保留既有 consistency failure | Step 6/7 capture contract、Step 9 Outbound |
| `SM-07` | Job target/final report 缺 matching journal、all-terminal proof或 stored envelope symmetry | scheduler state、run scan、current material、runner counters | 不写 `CF-JOURNAL-04`/`OF-REPORT-05` 的成功或失败结论 | Step 9 Job / Step 11 journal / Step 13 replay |
| `SM-08` | handoff outcome 的 input audit ref、output audit ref或 receipt invariant不对称 | HTTP status、external body、“call returned”日志 | 不写 `HF-AUDIT-02 Accepted`；最多 `DIAG-*` | Step 7 Port / Step 9 post-commit flow |
| `SM-09` | external collaboration outcome 缺 source/intent symmetry，或 local bind commit未知 | transport ack、attempt counter、request-local return value | 不写 Delivered/IntentBound 或 local delivery fact；保持 Captured/unknown | Step 7 collaboration Port / Step 9/11/13 |
| `SM-10` | duplicate / commit-unknown 找不到 exact stored result、receipt、capture或journal | 当前 truth重建、时间猜测、再次调用 external Port | 不写 replay fact、不宣称成功/失败；进入 diagnostic stop | Step 11 authority read / Step 13 recovery |
| `SM-11` | Query 需要“访问审计”但没有需求与正式 write carrier | query log、metric counter、span结束事件 | 保持 `NA-QUERY-01`，不得新增 Query write | 上游需求/架构重新授权后再回开 |
| `SM-12` | rejected、unsupported、quarantined、delayed或rollback path没有 declared durable receipt/report | accepted audit、synthetic failed business record、log/metric/span | 只能输出 diagnostic/runtime observation；不写 accepted audit | Step 8/9/12 exact disposition |
| `SM-13` | raw body、secret、credential、topic/offset/lease、stack trace或 external audit body进入候选 | hash alone、debug-only字段、private backend alias | redaction hard stop；不继续生成该候选 | Step 14 redaction / R15.13 |
| `SM-14` | 观测 backend 失败被误认为业务失败或 rollback 原因 | observer error、exporter response、sink retry | 保持原 business authority；只允许 non-recursive diagnostic | R15.10 backend gate / R15.16 |

当前输入闭包中 `SM-01..SM-14` 都是已定义的设计门禁，不是已经发生的实现结果；本批没有因此新增 upstream blocker。未来任何一个实际 source-missing 发生时，必须停止对应正式表行并回开 owner Step，不能用本批 token“先占位”。

## 96. SOP 五问的 R15.11 增量答案

| SOP 问题 | R15.11 增量结论 | 下一批承接 |
|---|---|---|
| 哪些处理流必须记录审计？ | 只有 exact local truth/change/trace/impact 已 durable 的 accepted Command、声明形成 local fact 的 Inbound、以及已保存 derived/report/handoff/collaboration/journal surface 才具备相应 audit/operations eligibility；不是所有 accepted response 都产生同一种 audit。 | R15.12 按 candidate class 展开最终表 |
| 哪些错误分支必须记录日志？ | R15.11 不改 R15.6 的 60 个日志 profile；source-missing、commit unknown、rollback failure、consistency defect、redaction violation必须有 diagnostic visibility，但不能转成业务 audit。 | R15.12 复用 existing diagnostic owner |
| 哪些关键路径需要指标？ | R15.11 不改 R15.8 的 48 个 metric profile；指标只能提供低基数趋势，不能作为任何 candidate authority。 | R15.12 不新增 metric |
| 日志、指标、审计字段分别记录什么？ | audit/operations候选只允许引用既有 typed refs、state、reason、exact record/source version、receipt/report/handoff refs；当前Hub没有generic accepted `source_cursor`，log/metric/span不提供durable source，raw body永远排除。 | R15.12 做字段 allowlist 前先复核 source |
| 哪些监控和告警细节应留给运维手册？ | 阈值、SLO、告警、dashboard、retention、backend/exporter、pager、runbook、人工修复仍留运维/配置文档；本批不扩展。 | R15.13/R15.14 只处理 redaction 与 handoff |

## 97. R15.11 cross-step closure、自检与停审快照

### 97.1 Cross-step source closure

| closure axis | 当前结论 | 结果 |
|---|---|---|
| six core change families | identity、registry、descriptor、governance seam、method relation、formal exposure各有正式 change record、factory、repository/source flow | pass |
| traceability / impact | `CapabilityAccessTraceabilityRecord`、`CapabilityChangeImpactFact`及 downstream summary均有 exact source/ref relation | pass |
| reference | 八类 reference subject与 canonical state、actual revision/capture/no-op规则已由 Step 6/7/9/11闭合 | pass |
| derived / report | material revision、source-version fence、immutable reconciliation report、Job journal/report source已闭合 | pass |
| continuity | stored command/receipt/job result、snapshot/capture、normalized-key journal均有 authoritative replay source | pass |
| handoff / collaboration | local pending、external typed outcome、stable intent、local bind四者 owner分离 | pass |
| handoff callable reachability | `C23`是当前唯一`handoff_traceability(...)` caller；`handoff_audit_export(...)`只有Step 7声明、83-flow caller与emission均为0 | pass |
| diagnostic / non-audit | existing error/issue、Query no-write、runtime signal、observer failure和forbidden body均有禁止替代规则 | pass |
| Capability Hub scope | 没有引入 runtime execution、tools execution、marketplace listing、governance approval或method body truth | pass |

### 97.2 R15.11 mechanical / semantic self-check

| check | expected | actual | result |
|---|---:|---:|---|
| candidate class families | 7 (`AF/OF/CF/HF/RF/DIAG/NA`) | 7 | pass |
| candidate inventory rows | editorial only | 20 rows | pass |
| exact flow IDs | 83 | 83 | pass |
| Command / Query / Inbound / Outbound / Job closure | `26/33/6/10/8` | `26/33/6/10/8` | pass |
| missing / duplicate exact IDs | `0 / 0` | `0 / 0` | pass |
| Query accepted-audit writes | 0 | 0 | pass |
| `handoff_traceability(...)` Command owner | `C23` only | `C23` only; `C13/C14` call count 0 | pass |
| `handoff_audit_export(...)` exact flow caller / emission | 0 / 0 | 0 / 0；Port callable保留但当前不可达 | pass |
| external outcome promoted to local delivery truth | 0 | 0 | pass |
| raw body / secret / transport / evidence admitted | 0 | 0 | pass |
| new Rust type / field / variant / trait / Port / protocol | 0 | 0 | pass |
| structure / field comment delta | 0 | 0 | pass；本批无Rust声明 |
| formal `03` modified | false | false | pass |
| unresolved upstream blocker | 0 | 0 | pass；既有两项 L0-core debt 仍为 non-blocking |
| implementation / test / evidence / sign-off claim | 0 | 0 | pass |

`20 rows` 是本批 candidate inventory 的编辑性计数，包含 §92.2 与 §92.3 的候选行；它不是最终 audit event 数量，也不授权实现者按行创建 20 个对象或事件。

### 97.3 Stop-review snapshot

| item | stop-review state |
|---|---|
| current formal document | `03-详细设计.md`；未修改，仍等待 Step 19 assembly |
| current calibration artifact | `03_ddd_step_15_observability_audit.md` |
| completed batch | `R15.11 audit / operations fact:先思考` |
| batch status | `03_step_15_r15_11_completed_stop_review` |
| candidate inventory | accepted truth/change/trace/impact、reference、derived/report、continuity、handoff/collaboration、diagnostic、non-audit 已分类；最终事件表尚未写 |
| durable authority closure | six change families、traceability/impact、reference state、material/report、stored result/receipt/capture/journal、handoff/collaboration均有 source owner；无flow caller的audit-export handoff不生成fact |
| exact flow closure | `83/83`：Command 26、Query 33、Inbound 6、Outbound 10、Job 8 |
| source-missing gate | `SM-01..SM-14` 已定义；当前输入未发现实际 upstream blocker |
| new Rust declaration / comment delta | `0`；结构体、字段、enum variant、trait、callable注释门禁无新增遗漏 |
| formal document | unchanged；没有写入正式 §14 |
| implementation artifact | not created；implementation ledger与planned boundary skeleton仍禁止提前生成 |
| claimed implementation / test / evidence / sign-off | none；没有 run_id、真实 evidence alias、测试结果或验收签署 |
| commit | not requested and not created |

### 97.4 R15.12 entry gate

```text
document = 03-详细设计.md
step = 15
completed_batch = R15.11 audit / operations fact:先思考
status = completed_stop_review
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_12
next_batch = R15.12 audit / operations fact:再写入
allowed_scope_after_confirmation = expand only the accepted-audit / operations-fact candidates with final trigger, existing carrier, body-free field source, consumer and forbidden substitution; write the source-missing stop table as a final design gate
must_reread_before_next_batch = this file §§91~97; Step 6 object source/factory/repository sections; Step 7 handoff/collaboration and stored-result/capture/journal Ports; Step 8 response/receipt/report contracts; Step 9 exact effect vectors for 83 flows; Step 11~14 authority, recovery and redaction sections; detailed-design SOP Step 15 and §5.14
forbidden_until_next_gate = R15.13 redaction, formal 03 assembly, 04, Step 16+, implementation ledger, planned boundary skeleton, code, tests, run_id, evidence, sign-off, commit
unresolved_upstream_blocker = none
```

R15.11 已完成“先思考”目标，但没有完成最终 audit event / operations fact 表。未经用户下一次明确确认，不进入 `R15.12`，不修改正式 `03/04`，不创建 Step 16 或任何实现产物。

## 98. R15.12 授权、读取闭包与受控勘误

### 98.1 本批授权与输出边界

用户已明确确认从 `03_step_15_r15_11_completed_stop_review` 进入 `R15.12 audit / operations fact:再写入`。本批只把 §§91~97 的 20 个 editorial candidate 收敛为最终审计 / operations fact 埋点 profile、字段投影、发射门禁和 source-missing hard stop；不进入 `R15.13 redaction:先思考`。

| 本批允许 | 本批禁止 |
|---|---|
| 从 Step 6~14 已存在的 durable carrier 定义 post-commit 可观察投影 | 新建 generic audit event object、operations ledger、repository、Port、protocol、state、error、issue code或 public Rust schema |
| 按真实 carrier 字段固定 trigger、field source、consumer 和 forbidden substitution | 把 profile token 当 Rust identifier、wire event name、database table、outbox topic或 external audit record |
| 按 83 条 exact flow 判断 fresh durable write、no-op、stored rejection、duplicate、Query 和 external call 的发射资格 | 从日志、指标、span、当前查询、分页 cursor、timestamp、`TraceId` 或 ID generator 补造 durable source |
| 把 local handoff、request-local external outcome和 durable collaboration sidecar拆开 | 把 governance approval、runtime/tools execution、SDK publication、marketplace listing或 external delivery 合并进 Hub |
| 同步 `03_ddd_calibration_flow.md` 与 `project_execution_ledger.md` 的恢复点 | 修改正式 `03/04`、创建 Step 16+、implementation ledger、planned boundary skeleton或实现代码 |

### 98.2 本批实际读取闭包

| 输入 | 本批复核内容 | 结论 |
|---|---|---|
| `详细设计讨论流程_SOP.md` Step 15、`详细设计书写规范.md` §5.14 | 最终正式章节必须能装配日志表、指标表和审计事件表；本批只写代码埋点切口，不写阈值或运维流程 | pass |
| 本文件 §§91~97 | 20 个 candidate、7 类 authority、83-flow bundle 与 `SM-01..SM-14` | 全部消费；不另起候选全集 |
| Step 6 object contracts | 六类 change record、traceability、impact、reference、四类 material、reconciliation report、stored result、snapshot/capture、Job journal 的真实字段 | 20 个 final profile 均能落到既有 carrier；无 generic audit object |
| Step 7 trait / Port contracts | 22 个 repository owner、stored receipt / Job report envelope、audit handoff和event collaboration outcome | external outcome 与 Hub durable carrier严格拆分 |
| Step 8 protocol contracts | Command result、Inbound receipt、Outbound source、Job report 的 exact public surface | Query 33/33 no-write；duplicate只恢复原 surface |
| Step 9 function flows | 26 Command、33 Query、6 Inbound、10 Outbound、8 Job 的 effect vector、same-UoW和post-commit顺序 | `26/33/6/10/8 = 83/83` 可按 exact set闭合 |
| Step 11~13 | UoW durability、same-authority exact read、duplicate/reentry、commit resolution、sidecar symmetry | 只有 `Durable` 后允许 profile；`Unknown` 不得猜测 |
| Step 14 | body-free、Off/Redacted、external owner和backend binding前置门 | 本批不选择backend，不新增依赖；redaction细表仍留 R15.13/R15.14 |
| `L1-governance` / `L1-artifact` Step 15 | 审计表、字段规则、flow closure 的组织粒度 | 只参考结构；不复制 governance/artifact 事实或证据语义 |

### 98.3 受控勘误记录

在把 candidate 转成 final profile 前，本批逐项反查 Step 6 / Step 9，并固定以下勘误。它们修正的是本 Step 的观察口径，不改变上游对象、协议或 flow 数量。

| 勘误项 | final source truth | 被拒绝的旧推断 |
|---|---|---|
| `C24` | 只保存 actual `ReferenceResolutionState` revision、声明的 material stale effect、event capture与stored result；`change_record_refs=[]`、`traceability_refs=[]` | 把 reference state 变更伪装成六类 change record 或 traceability append |
| `C25` | 保存 `ExternalDocumentRef`、initial canonical `ReferenceResolutionState`、声明的 capture与stored result；`change_record_refs=[]`、`traceability_refs=[]` | 补造 descriptor change、document evidence或 trace record |
| `C26` | 按请求分支保存 `RuntimeToolsConsumerRef` 或 `SdkExposureConsumerRef`、initial canonical state、声明的 capture与stored result；`change_record_refs=[]`、`traceability_refs=[]` | 声称 runtime/tools execution、SDK publication或 exposure change |
| change record type | exact 类型为 `CapabilityIdentityChangeRecord`、`RegistryChangeRecord`、`DescriptorChangeRecord`、`GovernanceSeamChangeRecord`、`MethodRelationChangeRecord`、`CapabilityExposureChangeRecord` | 任何未在 Step 6 声明的同义扩展类型名 |
| change-record pseudo-version field | 六类 change record 均为 append-only record，均没有 `version` 字段 | 在审计投影中增加伪版本字段，或拿 source truth version冒充change-record字段 |
| accepted source cursor | Hub 当前没有 generic accepted `source_cursor` | 使用 page cursor、timestamp、`TraceId`、idempotency key或 ID generator补造 cursor |
| capture trace | `CapabilityEventCaptureRecord` 没有 `trace_id`；只能从 exact `payload_snapshot_id` 配对的 `CapabilityEventPayloadSnapshot.trace_id` 投影 | 从 capture、当前 invocation、intent ref或worker context猜 historical trace |
| audit handoff reachability | 只有 `C23` 调用 `handoff_traceability(...)`；`handoff_audit_export(...)` 当前 83-flow caller/emission均为 0 | 给 `C13/C14` 或 `J04` 合成 audit handoff |

这些勘误不构成 unresolved upstream blocker：现有 carrier 足以闭合本批。若未来要求 generic cursor、Hub-owned handoff result、durable audit envelope或 audit-export handoff caller，必须回开事实 owner 所属 Step，不能在可观测层私自增加。

## 99. Final profile 模型与 durable-commit-before-emission 门禁

### 99.1 Profile 的规范含义

本批的 final profile 是 **既有 durable carrier 在一个确定 post-commit 切口上的 body-free 可观察投影**。它不是第二份业务对象，不要求额外 repository write，也不授权创建同名 Rust struct、enum、event envelope、topic或数据库表。

```text
existing carrier(s) prepared and staged in declared UoW
  -> repository write succeeds only inside the UoW
  -> UoW commit / resolve_commit reaches Durable
  -> exact owner/sidecar symmetry is verified
  -> project only allowlisted existing fields to the selected observer binding
  -> observer success or failure never changes the business result
```

Profile 的作用是让 Step 19 能装配“审计事件表”，让实现者知道在何处、从哪个 carrier、读取哪些字段进行埋点；它不意味着 Hub 已经拥有一个 durable audit stream。需要 durable 重读时，consumer 必须读取原 repository / typed protocol surface，而不是读取 telemetry backend。

### 99.2 Commit 与发射状态机

| authority result / branch | final action | 允许的 profile | 禁止行为 |
|---|---|---|---|
| repository save尚处于 staged UoW | 不发射；继续原事务顺序 | none | 以 save return 当 durable、让 observer位于 commit前、observer失败触发rollback |
| `commit -> Durable` | 验证 exact carrier / sidecar 对称；仅对本次新 durable revision进入对应 profile cut | 本节定义的 20 个 profile中与 effect vector匹配者 | 从 current truth重建缺失 carrier、扩大 effect vector、把多个 revision压成 generic success |
| commit response unknown后 `resolve_commit -> Durable` | 通过同一 authority read barrier exact-read全部声明 owner / sidecar；对称后才允许对应 profile | 与原 fresh attempt相同的 carrier profile；不能多一个 recovery profile | 仅凭一次 row visible、log或timeout发射；重复 mutation或新 id |
| `NotDurable` | 不发射 durable-carrier profile；按既有错误 / retry owner继续 | none | 发射 failed business fact、假装零effect、从 staged object投影 |
| `Unknown` / resolution budget exhausted | 进入 `DIAG-UNKNOWN-02` 的既有 non-recursive diagnostic cut | none | success、failure、rollback、zero-effect、accepted audit或blind retry |
| rollback failure / `ConsistencyDefect` / mandatory sidecar asymmetry | 保留原错误优先级并进入 diagnostic stop | none | 发射部分 profile、补写 audit、用 observer修复 carrier |
| observer/backend接受投影 | 原业务结果保持不变 | best-effort observation only | 把 observer acknowledgement当 acceptance、evidence或 replay authority |
| observer/backend失败 | 最多进入一次既有 `observer_sink_failure` non-recursive diagnostic；随后停止观测递归 | source truth和caller result均不变 | rollback、返回新业务错误、再次调用 source mutation / resolver / handoff / collaboration |

### 99.3 一次性、duplicate 与 crash gap

1. 一个 profile instance 对应 **一个本次新 durable carrier revision**。同一 UoW 可合法形成多个不同 carrier profile，例如 accepted change、traceability、capture与stored result；它们证明的主语不同，不得折叠成一个 generic success。
2. same-key completed duplicate只 exact-read并恢复原 stored Command result、Inbound receipt或Job report。它不创建新 carrier revision，因此不再次发射任何本表 profile，也不创建新 trace、change、capture、resolver call、handoff或collaboration call。
3. stable stored rejection可形成 `CFP-STORED-RESULT`；这只证明可重放的 rejection surface，不形成 accepted/operations profile。未保存的 transient rejection只走日志 / 指标 / span。
4. commit 已 durable、process却在 observer call前崩溃时，durable carrier仍是唯一真相。当前没有 observer outbox、audit replay cursor或补偿 repository，因此本设计不声称 exactly-once / at-least-once telemetry delivery，也不允许借后续 duplicate重发。
5. 后续现有 maintenance / query consumer读取原 carrier不等于“补发 profile”；若未来需要可靠审计投递，必须另立需求并回开架构、对象、Port、持久化、恢复、配置和本 Step。

### 99.4 字段投影共同规则

| field category | 唯一来源 | final rule |
|---|---|---|
| profile family / carrier kind | 本节固定 profile id + exact carrier Rust type | profile id仅是设计索引；不得写回 carrier或作为新protocol字段 |
| subject / record / result / report / capture ref | carrier自身 typed id/ref，或已有 `as_ref` / union mapper | 必须保持 exact variant；不得转成自由文本、URL或外部 locator |
| state / disposition / kind | carrier已有 closed enum | 原样投影 closed category；不得从 `Debug/Display`、HTTP status或日志文本映射 |
| reason / issue | carrier已有 safe reason或 typed issue ref | 仅在 state invariant允许时投影；raw error/body不得作为fallback |
| actor | carrier自身 actor字段 | carrier没有 actor就省略；不得从当前 caller补 historical actor |
| trace | carrier自身 `trace_id`；capture profile例外，来自 exact paired snapshot | carrier没有 trace且没有正式配对来源就省略；不得生成fallback `TraceId` |
| version | 只有真实 versioned carrier的 `version` | 六类 change record无version；不得借 subject version、timestamp或cursor补造 |
| time | carrier自身 `recorded_at / updated_at / stored_at / captured_at / generated_at / finalized_at` | 保留语义，不统一改名成source cursor或外部 event time |
| source versions | material/report carrier已有 typed version set | 原样投影 safe marker set；不得扫描current truth重建 |
| digest | stored shell / snapshot / capture已有 canonical digest | 可作为完整性关联；不得输出serialized body，也不得宣称digest就是evidence |
| optional field | carrier当前 revision中的 `Option` / closed state invariant | `None`即省略；不得用空字符串、zero id、unknown text补位 |
| generic `source_cursor` | none | 永久缺席；page cursor、timestamp、trace、idempotency key和generated id都不是替代品 |

R15.13/R15.14 仍需对本节 allowlist做敏感字段与跨边界 redaction复核。在该批完成前，本节不授权 Full/Verbose 模式，也不授权输出 serialized surface、serialized event envelope或任意正文。

## 100. Final accepted-audit profiles（8）

### 100.1 六类 core change profile

下表的 profile id 是正式 §14 的稳定设计索引，不是新增代码类型。六行均在 source truth + change record +声明sidecar写入完成且 UoW 被证明 `Durable` 后，由对应 application write owner触发一次；append-only change record没有 `version`。

| profile id / 既有 carrier | 触发位置与 admission | 允许投影的 exact carrier 字段 | consumer | 明确禁止 |
|---|---|---|---|---|
| `AFP-CHANGE-IDENTITY` / `CapabilityIdentityChangeRecord` | identity/review Command声明形成新record；同一UoW source identity与record对称并 `Durable` | `change_record_id`, `capability_identity_id`, `change_kind`, `previous_state`, `next_state`, optional `related_identity_refs`, `change_reason`, `actor_context`, `trace_id`, `recorded_at` | traceability/impact/material source owner；body-free audit observer | 伪版本字段、identity body、governance approval、runtime authorization、DB diff |
| `AFP-CHANGE-REGISTRY` / `RegistryChangeRecord` | registry Command声明形成新record；entry/record/sidecar exact且 `Durable` | `registry_change_record_id`, `registry_entry_id`, `change_kind`, `previous_state`, `next_state`, `change_reason`, `actor_context`, `trace_id`, `recorded_at` | traceability、reconciliation、directory source owner；audit observer | 伪版本字段、marketplace listing、runtime allowlist、search projection当truth |
| `AFP-CHANGE-DESCRIPTOR` / `DescriptorChangeRecord` | descriptor Command声明形成新record；descriptor/ref-state/boundary invariant通过并 `Durable` | `descriptor_change_record_id`, `adapter_descriptor_id`, `change_kind`, `previous_state`, `next_state`, `change_reason`, `boundary_marker`, `actor_context`, `trace_id`, `recorded_at` | traceability/material owner；audit observer | 伪版本字段、secret value/diff、provider response/health、adapter runtime instance |
| `AFP-CHANGE-GOVERNANCE-SEAM` / `GovernanceSeamChangeRecord` | local seam relation发生声明变化并 `Durable`；governance ref/state只作已验证source pair | `seam_change_record_id`, `governance_seam_relation_id`, `change_kind`, `previous_state`, `next_state`, `change_reason`, `actor_context`, `trace_id`, `recorded_at` | traceability/exposure recheck/material owner；audit observer | 伪版本字段、approval/vote/Policy body、external acknowledgement、`C13/C14` handoff success |
| `AFP-CHANGE-METHOD-RELATION` / `MethodRelationChangeRecord` | body-free method relation发生声明变化并 `Durable` | `method_relation_change_record_id`, `method_relation_id`, `change_kind`, `previous_state`, `next_state`, `method_asset_ref_id`, `change_reason`, `actor_context`, `trace_id`, `recorded_at` | traceability/view refresh owner；audit observer | 伪版本字段、method body/package/execution、external lifecycle、implicit attach |
| `AFP-CHANGE-EXPOSURE` / `CapabilityExposureChangeRecord` | formal exposure或声明的controlled-view stale change形成record并 `Durable` | `exposure_change_record_id`, `formal_exposure_id`, `change_kind`, `previous_state`, `next_state`, `change_reason`, `actor_context`, `trace_id`, `recorded_at` | traceability/impact/view/material owner；audit observer | 伪版本字段、runtime enforcement、SDK publication、marketplace transaction、consumer execution |

六行只在对应 exact effect vector真正创建新record时发射。same-state no-op、validation rejection、duplicate replay、commit unknown和只改变reference state的 `C24/C25/C26` 均不进入这六行。

### 100.2 Traceability 与 impact profile

| profile id / 既有 carrier | 触发位置与 admission | 允许投影的 exact carrier 字段 | consumer | 明确禁止 |
|---|---|---|---|---|
| `AFP-TRACEABILITY` / `CapabilityAccessTraceabilityRecord` | `record_for_changes(...)` 或单次 `request_handoff(...)` 形成next revision；append-revision repository save与 UoW `Durable` 后；`source_change_refs` non-empty且同subject | `traceability_record_id`, `trace_subject`, `source_change_refs`, `trace_reason`, optional `handoff_refs`, `traceability_state`, optional `gap_reason`, optional `superseded_by`, `actor_context`, `trace_id`, `version`, `recorded_at`, `updated_at` | trace Query、impact derivation、audit-export builder；body-free audit observer | `TraceId`当record id、raw audit body、external receipt/acceptance、evidence alias；`HandoffPending`只证明local request |
| `AFP-IMPACT` / `CapabilityChangeImpactFact` | exact trace/change source验证后创建或迁移impact revision；repository save与 UoW `Durable` 后 | `impact_fact_id`, `traceability_record_ref`, `change_subject`, `impact_scope`, `affected_consumers`, `impact_state`, optional `state_reason`, `recorded_by`, `trace_id`, `version`, `created_at`, `updated_at` | impact Query、downstream feedback、reconciliation/material owner；audit observer | runtime/tools execution result、billing/cost、consumer log、acceptance evidence、source truth rollback |

`HF-LOCAL-01` 不再形成独立 profile：local handoff request就是 `AFP-TRACEABILITY` 的一个 `HandoffPending` revision。外部 `CapabilityAuditHandoffOutcome` 与本地 revision 不合并，见 §103。

## 101. Final operations / derived profiles（7）

### 101.1 Reference 与 downstream feedback

| profile id / 既有 carrier | 触发位置与 admission | 允许投影的 exact carrier 字段 | consumer | 明确禁止 |
|---|---|---|---|---|
| `OFP-REFERENCE-RESOLUTION` / matching reference object + `ReferenceResolutionState` | reference Command/Inbound/J07实际创建或改变 reference object / canonical state；subject-kind-state id/version对称且 UoW `Durable`；完全same value/reason no-op不发射 | state: `resolution_state_id`, `reference_subject`, `reference_kind`, `resolution_value`, `resolution_reason`, `checked_by`, `trace_id`, `version`, `created_at`, `last_checked_at`；pair: matching concrete reference id、`resolution_state_id`与真实object `version`（仅该flow实际保存时） | reference Query、descriptor/relation/exposure gate、material stale/refresh owner；operations observer | generic reference record/change record、resolver body、provider health、missing-state default、generic source cursor；`C24/C25/C26 change_record_refs/traceability_refs`必须为空 |
| `OFP-DOWNSTREAM-IMPACT-SUMMARY` / `DownstreamConsumptionImpactSummary` | `I03` exact impact/consumer/source feedback形成新summary revision，配对receipt与 UoW `Durable` | `impact_summary_id`, `impact_fact_ref`, `consumer_ref`, `source_feedback_ref`, optional `impact_observation`, `feedback_state`, optional `gap_reason`, optional `state_reason`, `accepted_by`, `trace_id`, `version`, `observed_at`, `updated_at` | impact Query、review follow-up、reconciliation/report owner；operations observer | downstream execution/request/result body、runtime deny、timeout推断ignored、core truth change |

### 101.2 四类 derived material

四类 material 各有不同状态、source set和owner，不能合并成 generic material event。只有真实 object revision被 repository保存且 commit为 `Durable` 才发射；Job target `Unchanged/Skipped/Failed` 没有新 material revision时，只进入 Job journal/report profile。

| profile id / 既有 carrier | 触发位置与 admission | 允许投影的 exact carrier 字段 | consumer | 明确禁止 |
|---|---|---|---|---|
| `OFP-CONTROLLED-CONSUMER-VIEW` / `ControlledConsumerView` | 任一 Command / Inbound exact effect vector声明的 shared affected-material propagation实际保存stale revision，或J02实际build/refresh revision；对应UoW `Durable` | `consumer_view_id`, `formal_exposure_id`, `consumer_ref`, body-free `descriptor_summary`, `source_versions`, `freshness_state`, `version`, `created_at`, `refreshed_at` | controlled-view Query、refresh owner；operations observer | secret/provider body、runtime cache/authorization、SDK client state、用view改写exposure |
| `OFP-DIRECTORY-PROJECTION` / `DirectorySearchBrowseProjection` | 任一 Command / Inbound exact effect vector声明的 shared affected-material propagation实际保存stale revision，或J03实际rebuild revision；对应UoW `Durable` | `projection_id`, exact three source refs, `display_summary`, `filter_facets`, `source_versions`, `freshness_state`, optional `state_reason`, `version`, `created_at`, `refreshed_at` | directory/search Query、rebuild/reconciliation owner；operations observer | marketplace listing、index engine/query plan、runtime cache、projection当registry truth |
| `OFP-AUDIT-EXPORT` / `AuditFriendlyExportSummary` | 任一 Command / Inbound exact effect vector声明的 shared affected-material propagation实际保存stale revision，或J04实际prepare/rebuild revision；对应UoW `Durable` | `export_summary_id`, `traceability_record_ref`, `export_scope`, `allowed_summary`, optional `observability_refs`, `source_versions`, `export_state`, optional `state_reason`, `version`, `created_at`, `refreshed_at` | audit-export Query、existing handoff preparation boundary；operations observer | raw audit/log/span/metric/alert/GRC body、evidence/sign-off；当前不得调用 `handoff_audit_export(...)` |
| `OFP-ECOSYSTEM-DISCOVERY` / `ReadOnlyEcosystemDiscoverySummary` | 任一 Command / Inbound exact effect vector声明的 shared affected-material propagation实际保存stale revision，或J05实际rebuild revision；对应UoW `Durable` | `ecosystem_summary_id`, `formal_exposure_ref`, `ecosystem_context_ref`, `discoverability_summary`, `source_versions`, `freshness_state`, optional `state_reason`, `version`, `created_at`, `refreshed_at` | discovery Query、rebuild/reconciliation owner；operations observer | marketplace listing/ownership/transaction/pricing、runtime execution、external fulfilment |

### 101.3 Reconciliation report

| profile id / 既有 carrier | 触发位置与 admission | 允许投影的 exact carrier 字段 | consumer | 明确禁止 |
|---|---|---|---|---|
| `OFP-RECONCILIATION-REPORT` / `CapabilityReconciliationReport` | J01/J06 frozen basis产生一个新immutable report，report repository与Job journal/report sidecar UoW `Durable` | `reconciliation_report_id`, `reconciliation_scope`, `source_truth_refs`, `inspected_material_refs`, `source_versions`, `finding_summary`, `report_state`, optional `failure_reason`, `job_run_id`, `generated_by`, `trace_id`, fixed `version`, `generated_at` | report Query、maintenance/rebuild decision owner；operations observer | 自动修复truth、current-state rescan补字段、log-summed finding、实现测试结果、evidence alias或验收签署 |

`OFP-RECONCILIATION-REPORT` 可以合法投影 carrier自身的 `Failed` report，但前提是该 failed report按对象契约完整保存并 `Durable`；target/UoW技术失败却没有正式report carrier时不得合成 failed report profile。

## 102. Final continuity profiles（5）

Continuity profile 证明的是 replay/reentry所需本地 carrier，不证明 source truth以外的业务成功。specialized receipt/report profile与 `CFP-STORED-RESULT` 可以在同一 UoW分别发射，因为一个是immutable stored shell，另一个是channel-specific typed surface；二者必须 exact symmetric，缺一或不对称即 `ConsistencyDefect`，两者都不发射。

### 102.1 Stored result 与 Inbound receipt

| profile id / 既有 carrier | 触发位置与 admission | 允许投影的 exact carrier 字段 | consumer | 明确禁止 |
|---|---|---|---|---|
| `CFP-STORED-RESULT` / `StoredCapabilityOperationResult` + matching idempotency completion/surface | fresh Command、stored Inbound或Job final result的shell、serialized surface与idempotency `Completed`同一UoW `Durable`且digest/refs对称 | `result_ref`, `result_kind`, original `disposition`, `surface_ref`, `surface_digest`, `trace_id`, `stored_at`；只投影surface metadata，不投影bytes | exact duplicate replay/recovery owner；continuity observer | `serialized_surface`、从current truth重建response、把stored rejection当accepted audit、duplicate创建新shell |
| `CFP-INBOUND-RECEIPT` / `CapabilityConsumerReceiptEnvelope` + `CapabilityInboundEventReceipt` + matching stored shell | Inbound fresh stable outcome具有 `result_ref=Some`，receipt envelope/shell/idempotency completion同一UoW `Durable` | envelope `result_ref`, `operation_name`, `surface_ref`；receipt `consumer_name`, `source_event_ref`, `result_ref`, `disposition`, closed `markers`, changed reference/state/summary/material refs, follow-up markers, typed `issue_refs`；historical `trace_id/stored_at`只取 matching shell | Worker exact completion、duplicate replay、consumer operations observer | payload/topic/group/partition/offset/lease、worker log、自动执行follow-up、fresh duplicate processing；`result_ref=None`分支不合成receipt profile |

### 102.2 Event capture

| profile id / 既有 carrier | 触发位置与 admission | 允许投影的 exact carrier 字段 | consumer | 明确禁止 |
|---|---|---|---|---|
| `CFP-EVENT-CAPTURE` / `CapabilityEventPayloadSnapshot` + `CapabilityEventCaptureRecord` | Phase A source/snapshot/capture同一UoW `Durable`，或 Phase C exact intent bind revision单独 `Durable`；source/id/schema/digest四元组对称 | capture: `capture_id`, `source_ref`, `payload_snapshot_id`, `schema_ref`, `candidate_digest`, `capture_state`, optional `collaboration_intent_ref`, `version`, `captured_at`, `updated_at`；snapshot仅投影matching `trace_id`与必要的 `source_ref/schema_ref/candidate_digest/captured_at`对称字段 | Outbound continuation、repair Job、capture Query；continuity observer | `serialized_envelope`、current truth remap、topic/route/credential、attempt/retry/DLQ、external delivery status；capture自身没有 `trace_id` |

Phase B 的 `CapabilityAccessEventCollaborationPort` request-local return不会直接发射本 profile。只有后续 `bind_intent(...)` 形成新的 local capture revision并被证明 `Durable`，才发射对应 `IntentBound` profile；external `Candidate/PendingDelivery/Delivered/Failed/HandoffUnavailable`不得复制进 capture。

### 102.3 Job journal 与 typed report

| profile id / 既有 carrier | 触发位置与 admission | 允许投影的 exact carrier 字段 | consumer | 明确禁止 |
|---|---|---|---|---|
| `CFP-JOB-JOURNAL` / `CapabilityJobExecutionRecord` | fresh Job plan、单个target terminal revision或finalization revision实际CAS保存且各自UoW `Durable` | `operation_name`, `job_name`, `schema_version`, `run_id`, `actor_context`, `trace_id`, `execution_state`, per-target `ordinal/target_ref/outcome`的closed body-free surface, typed `run_issues`, optional `final_result_ref`, `version`, `planned_at`, `updated_at`, optional `finalized_at` | exact Job reentry、target/finalizer、operations observer | normalized idempotency key、`request_digest`、raw target plan/body、scheduler/queue/lease/attempt、scope rescan或log-derived progress |
| `CFP-JOB-REPORT` / `CapabilityStoredJobReportEnvelope` + exact `CapabilityJobResponse<T>/CapabilityJobReport<T>` + stored shell | all-terminal proof后 typed report、stored envelope、journal finalization与idempotency completion在声明UoW `Durable`且全字段对称 | envelope `result_ref`, `operation_name`, `job_name`, `schema_version`, `run_id`, `surface_ref`；response `disposition`, typed `issue_refs`；report `result_ref`, reconciliation/material/reference refs, typed collaboration status refs, failed/skipped target refs与job-specific body-free detail；trace/time只取matching shell/journal | caller response、duplicate replay、operations/report Query；continuity observer | serialized surface、current material rescan、generic decoder、report-by-run lookup、外部status body、测试/evidence/sign-off claim |

Job duplicate只读取 `CapabilityStoredJobReportEnvelope.response` 并把当前 response临时映射为 `DuplicateReplayed`；不写journal/report/shell，不发射 `CFP-JOB-JOURNAL`、`CFP-JOB-REPORT` 或任何其他 final profile。

## 103. Handoff / collaboration final boundary

### 103.1 Local handoff merge

`RecordTraceabilityHandoffSummary` 的 local write不是第 21 个 profile。它调用 `CapabilityAccessTraceabilityRecord::request_handoff(...)` 形成一个 `HandoffPending` next revision，并由 `CapabilityTraceabilityRepository` append；该 revision 在 UoW `Durable` 后按 `AFP-TRACEABILITY` 发射。

| local fact | exact durable carrier | profile | 可证明 | 不可证明 |
|---|---|---|---|---|
| handoff scope被Hub本地记录 | `CapabilityAccessTraceabilityRecord` next revision | `AFP-TRACEABILITY` | exact trace subject/change set、optional validated audit ref、local `HandoffPending` state、actor/trace/version/time | external boundary已收到、已持久化、已接受；receipt/evidence/sign-off |

local commit之后的 external call无论成功还是失败，都不能反写这一 revision、stored Command result或 source change；也不能让 `HandoffPending` 自动迁移为一个未定义的 Delivered/Accepted local state。

### 103.2 Audit handoff remains request-local

| callable / reachability | exact input authority | outcome authority | final observation | durable profile decision |
|---|---|---|---|---|
| `C23 -> handoff_traceability(...)`；当前唯一caller | committed exact traceability revision + validated `ObservabilityAuditRefId` + closed handoff scope | request-local `CapabilityAuditHandoffOutcome`；`Accepted`要求matching audit ref + receipt/no reason，其它disposition要求reason/no receipt | 复用 R15.6 `L-PORT-03`、R15.8 `MP-PORT-03`和R15.10 `FSP-PORT-02`；只输出各自既有allowlist | no Hub durable profile；不得创建 handoff outcome repository、result row或trace rewrite |
| `handoff_audit_export(...)` | Step 7只有callable schema | 当前无 exact flow trigger | caller=0，metric/span/fact emission=0 | not reachable；不得因为 `OFP-AUDIT-EXPORT` 存在而调用 |

`CapabilityAuditHandoffOutcome` 没有 Hub-owned repository，也没有被当前 flow纳入 stored result、trace revision、Job journal或report。因此它只能说明本次调用返回了一个 typed boundary disposition；即使 `Accepted` 且带 `CapabilityHandoffReceiptRef`，也不形成 Hub durable operations fact、external audit body、evidence alias或验收签署。

### 103.3 Event collaboration split

| phase | owner / carrier | final profile or runtime observation | durable scope | forbidden upgrade |
|---|---|---|---|---|
| Phase A local candidate | immutable snapshot + `CapabilityEventCaptureRecord::Captured` | `CFP-EVENT-CAPTURE` after `Durable` | exact source/snapshot/schema/digest + historical snapshot trace | external intent、delivery、attempt、transport receipt |
| Phase B external collaborate/get/repair return | `CapabilityAccessEventCollaborationPort` request-local typed outcome | existing log/metric/span only | none until a declared local write commits | local Delivered/Failed fact、second event/intent、source rollback |
| Phase C local bind | `CapabilityEventCaptureRecord::IntentBound` next revision | `CFP-EVENT-CAPTURE` after bind UoW `Durable` | stable intent ref is linked to the same capture | external delivery status、attempt lifecycle、ack/evidence |
| Job inspected collaboration | exact target outcome + `CapabilityJobExecutionRecord` and final typed Job report | `CFP-JOB-JOURNAL` / `CFP-JOB-REPORT` only when those carriers commit | report/journal中already-declared typed status ref | 把request-local return直接写成generic collaboration audit |

`HF-COLLAB-03` 因此被拆成“request-local external observation”与“merge into existing durable carrier”。它不产生独立 final durable profile。repair不得创建新snapshot、capture、intent或source event；只允许围绕同一 exact capture/intent执行 Step 9 / 13 已授权动作。

### 103.4 Handoff / collaboration failure precedence

1. local source revision已 `Durable` 后，external unavailable/rejected/retryable/technical failure不得回滚或改写 source、stored result、capture或Job journal。
2. local bind / Job target commit为 `Unknown` 时，request-local external return不能证明 local side effect；必须 exact-read原 carrier，无法闭合则 `DIAG-UNKNOWN-02` stop。
3. external outcome invariant不对称时走 `InvalidContract` / `ConsistencyDefect` 的既有 owner，不产生 accepted profile。
4. external call observer失败只影响observer自身，不得重复 handoff/collaboration call。
5. governance resolver result不是 governance approval；method reference result不是 method execution；event collaboration status不是 runtime/tools execution或marketplace listing。

## 104. 20 个 editorial candidate 最终裁决

本表逐行消费 §92 的 20 个 candidate。`split` 只拆分为既有 carrier profile；`merge` 只合并到既有 profile；`request_local`、`diagnostic_only` 和 `reject` 都不会创建 durable profile。

| candidate | final disposition | mapped final profile(s) | 理由 / implementation consequence |
|---|---|---|---|
| `AF-TRUTH-01` | `split_keep` | `AFP-CHANGE-IDENTITY`, `AFP-CHANGE-REGISTRY`, `AFP-CHANGE-DESCRIPTOR`, `AFP-CHANGE-GOVERNANCE-SEAM`, `AFP-CHANGE-METHOD-RELATION`, `AFP-CHANGE-EXPOSURE` | 六类record字段、subject和forbidden boundary不同；必须按真实类型分别投影；均无`version`字段 |
| `AF-TRACE-01` | `keep` | `AFP-TRACEABILITY` | versioned append revision已有完整 durable authority |
| `AF-IMPACT-01` | `keep` | `AFP-IMPACT` | impact fact是独立 versioned local fact，不是execution audit |
| `OF-IMPACT-02` | `keep` | `OFP-DOWNSTREAM-IMPACT-SUMMARY` | I03 summary有exact impact/consumer/source carrier |
| `OF-REF-01` | `keep_refine` | `OFP-REFERENCE-RESOLUTION` | 必须投影actual concrete reference + canonical state pair；不创建reference change record |
| `CF-RESULT-01` | `keep` | `CFP-STORED-RESULT` | immutable shell + surface + idempotency完成是replay authority |
| `CF-RECEIPT-02` | `keep` | `CFP-INBOUND-RECEIPT` | typed receipt与matching shell/envelope分别提供protocol continuity |
| `CF-CAPTURE-03` | `keep` | `CFP-EVENT-CAPTURE` | snapshot + capture是local recovery authority；trace只来自snapshot |
| `CF-JOURNAL-04` | `keep` | `CFP-JOB-JOURNAL` | exact normalized ownership、plan/outcome和version提供Job重入authority；敏感technical key不投影 |
| `OF-REPORT-05` | `keep_reclassify_continuity` | `CFP-JOB-REPORT` | typed stored report同时是caller result与duplicate replay carrier；不是core truth audit |
| `HF-LOCAL-01` | `merge` | `AFP-TRACEABILITY` | local handoff request就是 `HandoffPending` traceability next revision |
| `HF-AUDIT-02` | `request_local` | none | `CapabilityAuditHandoffOutcome`无Hub durable repository；当前只允许C23的existing log/metric/span |
| `HF-COLLAB-03` | `split_request_local_and_merge` | `CFP-EVENT-CAPTURE`, `CFP-JOB-JOURNAL`, `CFP-JOB-REPORT` where exact local writes exist | Port outcome本身request-local；只有IntentBound或declared Job carrier可durable |
| `RF-MATERIAL-01` | `split_keep` | `OFP-CONTROLLED-CONSUMER-VIEW`, `OFP-DIRECTORY-PROJECTION`, `OFP-AUDIT-EXPORT`, `OFP-ECOSYSTEM-DISCOVERY` | 四类material字段、state和consumer不同，不能generic化 |
| `RF-REPORT-02` | `keep` | `OFP-RECONCILIATION-REPORT` | immutable report有frozen source refs/versions和safe findings |
| `DIAG-TECH-01` | `diagnostic_only` | none | 复用R15.6/R15.8/R15.10既有error/issue observation；不能变业务fact |
| `DIAG-UNKNOWN-02` | `diagnostic_stop` | none | commit unknown、rollback failure、consistency defect不具备terminal durable authority |
| `NA-QUERY-01` | `reject_durable_profile` | none | 33/33 Query严格no-write，只使用既有runtime observation |
| `NA-RUNTIME-02` | `reject_durable_profile` | none | log/metric/span是L1 runtime signal，不是durable carrier |
| `NA-EXTERNAL-03` | `reject_forbidden_material` | none | raw resolver/provider/audit/transport body无Hub authority且越过redaction边界 |

### 104.1 Candidate-to-profile arithmetic

```text
AF-TRUTH-01 split                     = 6
AF-TRACE-01 + AF-IMPACT-01            = 2
OF-IMPACT-02 + OF-REF-01              = 2
CF-RESULT/RECEIPT/CAPTURE/JOURNAL     = 4
OF-REPORT-05                          = 1
RF-MATERIAL-01 split                  = 4
RF-REPORT-02                          = 1
HF/DIAG/NA standalone durable profile = 0
-----------------------------------------
final durable-carrier profiles        = 20
```

按正式章节用途重排后：`8 accepted + 7 operations/derived + 5 continuity = 20`。任何实现若出现第21个 profile、generic audit struct或generic operations repository，必须停止并回到本表查明它应被merge、request-local、diagnostic还是拒绝。

## 105. 83-flow final admission / no-emission matrix

### 105.1 Matrix reading rules

- `eligible profile` 表示只有该 exact flow 的 fresh branch真实创建对应 carrier revision、并通过 §99 `Durable` 门禁时才发射；列出 profile不等于每次调用都必须产生该carrier。
- `no-emission branch` 对本表全部20个durable-carrier profile生效；该分支仍可使用 R15.6/R15.8/R15.10 已定义的 runtime observation。
- source carrier被读取而没有新revision时不得重复发射其 profile。Outbound Phase A只必然考虑新 snapshot/capture；source profile只有在同一 exact owner flow确实形成新source revision时才eligible。
- 本节每个 exact flow ID恰好出现一次；不使用省略的开放区间。

### 105.2 Command `C01..C26`

| exact IDs | fresh `Durable` carrier profiles（按真实effect vector取子集） | mandatory no-emission branches / boundary |
|---|---|---|
| `C01,C02,C03,C04` | `AFP-CHANGE-IDENTITY`, conditional `AFP-TRACEABILITY`, `CFP-STORED-RESULT`, declared `CFP-EVENT-CAPTURE` | stable no-op、unstored rejection、duplicate、unknown均不发accepted profile；review不等于governance approval |
| `C05,C06,C07,C08` | `AFP-CHANGE-REGISTRY`, conditional `AFP-TRACEABILITY`, material profile(s), `CFP-STORED-RESULT`, declared capture | same-basis/no-op、stale/retired rejection、duplicate不产生registry/material revision |
| `C09,C10,C11,C12` | `AFP-CHANGE-DESCRIPTOR`, `OFP-REFERENCE-RESOLUTION` where actual revision, conditional trace/material, `CFP-STORED-RESULT`, declared capture | raw secret/document/provider result、resolver technical failure、duplicate不发fact |
| `C13,C14,C15,C16,C17` | `AFP-CHANGE-GOVERNANCE-SEAM` or `AFP-CHANGE-METHOD-RELATION`, actual `OFP-REFERENCE-RESOLUTION`, conditional trace/material, `CFP-STORED-RESULT`, declared capture | `C13/C14` handoff call/profile=0；approval、method body/execution、external acknowledgement禁止 |
| `C18,C19,C20,C21` | `AFP-CHANGE-EXPOSURE`, declared registry/material revision, `CFP-STORED-RESULT`, declared capture | caller visibility、runtime/tools/SDK/marketplace状态、duplicate不成为fact |
| `C22,C23` | C22 `AFP-IMPACT`; C23 `AFP-TRACEABILITY` local revision；both `CFP-STORED-RESULT`; declared capture only | C23 external outcome request-local；failure不改local result；receipt/evidence/sign-off不发profile |
| `C24,C25,C26` | actual `OFP-REFERENCE-RESOLUTION`, declared material stale revision, `CFP-STORED-RESULT`, declared `CFP-EVENT-CAPTURE` | all six `AFP-CHANGE-*`=0、`AFP-TRACEABILITY`=0；resolver body、execution/publication/evidence、duplicate禁止 |

Command closure：`26/26`。`C24/C25/C26` 的 accepted response effect refs必须保持 `change_record_refs=[]`、`traceability_refs=[]`；不得为了满足审计表而补值。

### 105.3 Query `Q01..Q33`

| exact IDs | read-only surface | final durable-profile admission | mandatory no-emission rule |
|---|---|---|---|
| `Q01,Q02,Q03,Q04,Q05,Q06` | identity/review/registry/visibility exact read | none | no reservation、stored result、trace/change/capture或read audit |
| `Q07,Q08,Q09,Q10` | descriptor/risk/secret-safe-summary exact read | none | no raw secret/provider body、reference refresh或“read success” fact |
| `Q11,Q12,Q13,Q14` | seam/method relation/reference state read | none | no approval、method body、relation mutation或handoff |
| `Q15,Q16,Q17,Q18,Q19` | exposure/view/consumer-bound material read | none | freshness不变exposure truth；no runtime/tools/SDK execution/write |
| `Q20,Q21,Q22,Q23` | trace/impact/downstream/handoff summary read | none | no trace repair、handoff call、raw audit body或evidence |
| `Q24,Q25,Q26,Q27,Q28` | directory/export/discovery/reconciliation read | none | no rebuild、auto-repair、marketplace state或report-as-truth |
| `Q29,Q30,Q31,Q32,Q33` | reference/document/runtime-tools/SDK/audit ref-state read | none | no resolver refresh、external delivery或audit creation |

Query closure：`33/33`，write profile=`0`，accepted-audit profile=`0`，continuity profile=`0`。visible、empty、not-visible和degraded只由既有日志/指标/span观察。

### 105.4 Inbound `I01..I06`

| exact IDs | fresh `Durable` carrier profiles（按真实effect vector取子集） | mandatory no-emission branches / boundary |
|---|---|---|
| `I01,I02,I04,I05,I06` | actual `OFP-REFERENCE-RESOLUTION`, `CFP-STORED-RESULT` + `CFP-INBOUND-RECEIPT` when `result_ref=Some`, declared material revision/capture | unsupported schema和`result_ref=None` delayed不合成receipt profile；duplicate不重发；follow-up marker不调用Command/handoff |
| `I03` | actual `OFP-DOWNSTREAM-IMPACT-SUMMARY`, `CFP-STORED-RESULT` + `CFP-INBOUND-RECEIPT` when stored | no core change；payload `Delayed/Unavailable/Ignored`不是processing retry；duplicate不新建summary |

Inbound closure：`6/6`。只有实际保存的reference/summary/material/capture revision进入对应 profile；valid no-change receipt仍只可能进入continuity profile。

### 105.5 Outbound `O01..O10`

| exact IDs | fresh `Durable` carrier profiles | mandatory no-emission branches / boundary |
|---|---|---|
| `O01,O02,O03,O04,O05,O06` | Phase A/Phase C `CFP-EVENT-CAPTURE`; source `AFP-CHANGE-*` / `AFP-TRACEABILITY` only if this exact owner path created a new source revision | source仅被读取时不重发；Phase B typed outcome request-local；no delivery/attempt/governance/method/runtime profile |
| `O07,O08,O09,O10` | Phase A/Phase C `CFP-EVENT-CAPTURE`; source material/impact/reference profile only if a new source revision was created here | no report/material/ref repair inference、marketplace listing、delivery proof或evidence；Phase B不直接发durable profile |

Outbound closure：`10/10`。snapshot/capture必须先与source同UoW `Durable`；外部collaboration失败不能撤销 Phase A profile，bind commit unknown不能发 Phase C profile。

### 105.6 Operations Job `J01..J08`

| exact IDs | fresh `Durable` carrier profiles（按每个journal phase取子集） | mandatory no-emission branches / boundary |
|---|---|---|
| `J01,J06` | `CFP-JOB-JOURNAL`, actual `OFP-RECONCILIATION-REPORT`, final `CFP-STORED-RESULT` + `CFP-JOB-REPORT`, declared capture | duplicate不scan；无durable report carrier的technical failure不合成failed report；no auto-repair/evidence |
| `J02` | `CFP-JOB-JOURNAL`, actual `OFP-CONTROLLED-CONSUMER-VIEW`, final stored/report profiles, declared capture | unchanged/skipped target无material profile；no exposure/runtime rewrite |
| `J03` | `CFP-JOB-JOURNAL`, actual `OFP-DIRECTORY-PROJECTION`, final stored/report profiles, declared capture | unchanged/skipped target无projection profile；no marketplace/index-engine state |
| `J04` | `CFP-JOB-JOURNAL`, actual `OFP-AUDIT-EXPORT`, final stored/report profiles, declared capture | `handoff_audit_export(...)` call/emission=0；no raw audit body/evidence/sign-off |
| `J05` | `CFP-JOB-JOURNAL`, actual `OFP-ECOSYSTEM-DISCOVERY`, final stored/report profiles, declared capture | unchanged/skipped无material profile；no marketplace listing/transaction |
| `J07` | `CFP-JOB-JOURNAL`, actual `OFP-REFERENCE-RESOLUTION`, final stored/report profiles, declared capture | terminal/no-change target无reference profile；no missing-state creation或external body |
| `J08` | `CFP-JOB-JOURNAL`, durable `CFP-EVENT-CAPTURE` bind where declared, final stored/report profiles | request-local get/repair/collaborate不直接发profile；no new event/capture/intent/current-source remap |

Job closure：`8/8`。每个 plan/target/final revision分别遵守 `Durable` 门禁；final report不能从runner counter或current material重建，duplicate只恢复原 envelope。

### 105.7 Exact-set and branch closure

| family | expected exact IDs | covered once | Query writes | duplicate new fact | external request-local promoted | result |
|---|---:|---:|---:|---:|---:|---|
| Command | 26 | 26 | n/a | 0 | 0 | pass |
| Query | 33 | 33 | 0 | 0 | 0 | pass |
| Inbound | 6 | 6 | n/a | 0 | 0 | pass |
| Outbound | 10 | 10 | n/a | 0 | 0 | pass |
| Operations Job | 8 | 8 | n/a | 0 | 0 | pass |
| total | 83 | 83 | 0 | 0 | 0 | pass |

## 106. `SM-01..SM-14` final hard-stop table

`stop` 不是“少打一个埋点后继续”，而是禁止对应 durable profile发射，并按拥有该事实的上游 contract / existing diagnostic处理。observer不得承担修复、重试或补写职责。

| stop id | final detection at emission cut | prohibited profile / claim | required action | owner to reopen if design source is absent |
|---|---|---|---|---|
| `SM-01` | core mutation没有matching six-family change record或source/record不对称 | corresponding `AFP-CHANGE-*` | no emission；`ConsistencyDefect` diagnostic；不得从DB diff/current state补造 | Step 6/9/11 |
| `SM-02` | trace revision缺同subject non-empty source changes，或change ref无法exact-read | `AFP-TRACEABILITY` | no emission；保留source fact；trace owner stop | Step 6/7/9/11 |
| `SM-03` | impact缺exact trace/change、consumer set或version symmetry | `AFP-IMPACT` | no emission；existing diagnostic only | Step 6/9/11 |
| `SM-04` | reference object/state subject-kind-id-version不对称，或declared capture source缺失 | `OFP-REFERENCE-RESOLUTION`, related `CFP-EVENT-CAPTURE` | no emission；不得用resolver body/default state | Step 6/7/9/11 |
| `SM-05` | material/report缺source versions、frozen refs、safe finding或repository revision | `OFP-CONTROLLED-CONSUMER-VIEW`, `OFP-DIRECTORY-PROJECTION`, `OFP-AUDIT-EXPORT`, `OFP-ECOSYSTEM-DISCOVERY`, `OFP-RECONCILIATION-REPORT` | no emission；不得current rescan/log aggregate | Step 6/9/11/13 |
| `SM-06` | snapshot/capture source/id/schema/digest/time不对称，或capture找不到immutable snapshot | `CFP-EVENT-CAPTURE` | no emission；consistency stop；不得从log/adapter queue恢复payload | Step 6/7/9/11 |
| `SM-07` | Job target/final缺matching journal、all-terminal proof或stored envelope symmetry | `CFP-JOB-JOURNAL`, `CFP-JOB-REPORT`, matching `CFP-STORED-RESULT` | no success/failure profile；exact recovery only | Step 8/9/11/13 |
| `SM-08` | audit handoff input/output audit ref或receipt invariant不对称 | request-local `Accepted` observation | map existing contract error/diagnostic；不得写Hub fact | Step 7/9 |
| `SM-09` | collaboration source/intent不对称，或local bind commit未证明 | `CFP-EVENT-CAPTURE::IntentBound`, Job success sidecar | keep last proven local state；no Delivered/IntentBound claim | Step 7/9/11/13 |
| `SM-10` | duplicate/commit unknown找不到 exact result/receipt/capture/journal | all replay/continuity profiles | no replay/fresh rerun/profile；`DIAG-UNKNOWN-02` stop | Step 11/13 |
| `SM-11` | Query被要求追加访问审计但没有需求与write carrier | every final durable profile | maintain 33/33 no-write；不得用log/metric/span补write | requirement/architecture then Step 6~15 |
| `SM-12` | rejected/unsupported/quarantined/delayed/rollback没有declared durable shell/receipt/report | accepted/operations profile and synthetic failed fact | runtime diagnostic only；stored continuity仅在exact carrier存在时 | Step 8/9/12 |
| `SM-13` | raw body、secret、credential、topic/offset/lease、stack trace或external audit body进入投影 | all profiles containing that field | redaction hard stop；drop candidate field/profile；no hash/debug bypass | Step 14 + R15.13/R15.14 |
| `SM-14` | observer/backend failure试图改写caller result、rollback或触发recursive retry | every business/continuity outcome | preserve original authority；emit at most one non-recursive diagnostic | R15.6/R15.10/R15.16 |

当前设计输入中 `SM-01..SM-14` 都有明确判定与owner，实际 unresolved upstream blocker仍为 `0`。这不声称实现中从未发生上述缺口；它只说明设计已给出遇到缺口时的停止行为。

## 107. R15.12 cross-step 与专项边界闭环

### 107.1 Step 6~14 source closure

| upstream | 本批承接 | 本批未改变 | result |
|---|---|---|---|
| Step 6 object contracts | 20 个 profile全部绑定到已存在的 change/trace/impact/reference/material/report/result/snapshot/capture/journal carrier | object、field、factory、state、version和Rust声明数量 | pass |
| Step 7 trait / Port contracts | 沿用既有 repository / stored envelope / audit handoff / collaboration owner | repository/Port数量和signature；不新增observer/audit repository | pass |
| Step 8 protocol contracts | typed stored Command/Inbound/Job surface提供continuity字段；Query继续no-write | 250 public types、83 protocols、DTO field、response/receipt/report schema | pass |
| Step 9 function flows | final admission表逐族覆盖26 Command、33 Query、6 Inbound、10 Outbound、8 Job | exact effect vector、same-UoW、post-commit call顺序和caller reachability | pass |
| Step 10 state matrix | profile只投影已有closed state | 不新增Observed/Audited/Delivered/Exported或generic success state | pass |
| Step 11 persistence | `Durable`与same-authority exact read是发射唯一authority | transaction/repository语义；observer不是commit participant | pass |
| Step 12 error/recovery | commit unknown、rollback、consistency与Port contract defect只走既有diagnostic owner | 17 `ApplicationError`、51 issue code、错误优先级 | pass |
| Step 13 concurrency/idempotency | duplicate no-rerun/no-new-fact，unknown exact-read-first，capture/Job reentry保持原authority | normalized key、digest、reservation和recovery算法 | pass |
| Step 14 config/binding | body-free、Off/Redacted、non-cancelling owner和backend controlled-reopen gate继续生效 | dependency graph、external slot、runtime owner和配置字段 | pass |

### 107.2 Capability Hub专项边界

| boundary | 本批允许的 durable profile subject | 明确排除 | result |
|---|---|---|---|
| capability identity / registry | local change record、trace、impact和声明的derived/capture sidecar | provider identity、runtime authorization、marketplace listing | pass |
| adapter descriptor / external MCP-A2A-API | descriptor change、body-free external reference/state | provider request/response/session、secret、route、health、quota、cost、execution result | pass |
| governance seam | local relation change、body-free governance result ref/state | governance approval、Policy、vote、workflow、external acknowledgement | pass |
| method-library relation | local body-free relation change、method asset ref | method body/source/package/lifecycle/execution | pass |
| formal exposure / consumer boundary | exposure change、controlled view、consumer ref/state | runtime/tools execution、SDK package publication、client cache、marketplace transaction | pass |
| event collaboration | snapshot/capture/intent bind与declared Job carrier | Hub-owned delivery/attempt/relay/outbox/DLQ/ack truth | pass |
| observability / audit | existing durable carrier的body-free投影、local pending trace revision | raw telemetry/audit body、generic audit truth、evidence alias、acceptance signature | pass |

### 107.3 Handoff reachability closure

| check | expected | actual design result | result |
|---|---:|---:|---|
| `handoff_traceability(...)` exact Command caller | 1 | 1，`C23` only | pass |
| `C13/C14` audit handoff caller | 0 | 0 | pass |
| `handoff_audit_export(...)` exact flow caller | 0 | 0 | pass |
| `handoff_audit_export(...)` metric/span/fact emission | 0 | 0 | pass |
| Hub durable `CapabilityAuditHandoffOutcome` repository/profile | 0 | 0 | pass |
| request-local external outcome promoted to accepted truth | 0 | 0 | pass |

### 107.4 Historical material、blocker 与 debt

旧正式 `03-详细设计.md`、README和旧 provider/cost/runtime/audit 主线仍只作 `historical_material`。本批没有恢复 generic audit ledger、provider execution audit、cost record、runtime routing、marketplace listing或 governance approval truth。

当前未发现阻塞 `R15.12` 完成或进入后续 redaction 批次的 upstream blocker，计数为 `0`。以下两项保持既有 non-blocking design-sync debt，不在本批伪装为已解决：

- `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001`
- `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001`

backend产品 / crate仍未选择，实施前必须遵守 §88 的 Step 14 controlled-reopen gate；这不是当前 upstream blocker，也不授权 implementation agent自行选择。

## 108. SOP 五问的 R15.12 最终增量答案

| SOP问题 | R15.12 final answer | canonical sections |
|---|---|---|
| 哪些处理流必须记录审计？ | 只有 exact carrier新revision按声明effect vector写入、UoW被证明 `Durable` 且sidecar对称时，才进入20个final profile之一。accepted change/trace/impact为8类，reference/feedback/material/report为7类，continuity为5类；不是“所有Accepted共用一个审计事件”。 | §§99~105 |
| 哪些错误分支必须记录日志？ | source-missing、commit unknown、rollback failure、consistency/contract defect、redaction和observer failure继续由R15.6最终日志owner记录；本表不创建failed business fact。 | §§99.2、106；R15.6 |
| 哪些关键路径需要指标？ | R15.12不改变R15.8的48个metric profile；durable-carrier profile不自动增加counter，metric也不能证明profile已合法发射。 | R15.8 §§54~63 |
| 日志、指标、审计字段分别记录什么？ | audit/operations投影只读既有carrier的typed ref、closed state/kind、safe reason/issue、actor、trace、真实version/time和source-version set；六类change无`version`，capture trace来自matching snapshot，generic `source_cursor`不存在。日志/指标/span不补字段。 | §§98.3、99.4、100~102 |
| 哪些监控和告警细节应留给运维手册？ | backend/exporter、sampling、retention、阈值、SLO、dashboard、pager、alert routing、runbook、人工resolution和可靠审计投递机制仍留配置/运维/未来需求；本批不定义。 | §99.3、§107.4；R15.13~R15.16 |

## 109. R15.12 mechanical / semantic self-check

以下是设计表的静态审计，不是实现、测试、运行结果或外部 evidence。

### 109.1 Profile 与 candidate count

| check | expected | actual | result |
|---|---:|---:|---|
| R15.11 candidate inventory | 20 | 20 | pass |
| R15.12 candidate decision rows | 20 | 20 | pass |
| final accepted profiles | 8 | 8 | pass |
| final operations / derived profiles | 7 | 7 | pass |
| final continuity profiles | 5 | 5 | pass |
| final durable-carrier profiles | 20 | 20 unique design tokens | pass |
| final profile rows with trigger/carrier/field source/consumer/forbidden rule | 20 | 20 | pass |
| standalone durable handoff/collaboration profiles | 0 | 0 | pass |
| standalone diagnostic / Query / runtime profiles in durable table | 0 | 0 | pass |

### 109.2 Source、flow 与 boundary count

| check | expected | actual | result |
|---|---:|---:|---|
| six change carrier exact types | 6 | 6 | pass |
| forbidden synonym change-record type occurrences | 0 | 0 | pass |
| six change carrier `version` field admission | 0 | 0 | pass |
| generic accepted `source_cursor` admission | 0 | 0 | pass |
| source-missing hard stops | 14 | 14 | pass |
| exact flow IDs | 83 | 83；`26/33/6/10/8` | pass |
| missing / extra / duplicate exact flow IDs | `0/0/0` | `0/0/0` | pass |
| Query durable writes / profile emissions | 0 | 0 | pass |
| duplicate new fact/trace/capture/resolver/external call | 0 | 0 | pass |
| `handoff_traceability(...)` caller | `C23` only | `C23` only | pass |
| `handoff_audit_export(...)` caller / emission | `0/0` | `0/0` | pass |
| capture-local `trace_id` field assumption | 0 | 0；matching snapshot only | pass |
| external request-local outcome promoted to Hub durable truth | 0 | 0 | pass |
| raw body / secret / transport / evidence field admitted | 0 | 0 | pass |

### 109.3 Artifact 与声明边界

| check | expected | actual | result |
|---|---:|---:|---|
| new Rust struct / enum / field / variant / trait / Port / repository / protocol | 0 | 0 | pass |
| structure / field comment delta | 0 | 0；本批无Rust声明可遗漏 | pass |
| formal `03-详细设计.md` modified by R15.12 | false | false | pass |
| formal `04` / Step 16+ artifact created | false | false | pass |
| implementation ledger / planned boundary skeleton created | false | false | pass |
| implementation / test / run_id / evidence / sign-off claim | 0 | 0 | pass |
| unresolved upstream blocker | 0 | 0 | pass |

### 109.4 Completion statement

R15.12 的“再写入”目标已满足：20 个 candidate已逐项裁决为20个final durable-carrier profile，按 `8 accepted + 7 operations/derived + 5 continuity` 分组；每个profile都有真实trigger、existing carrier、field source、consumer、forbidden substitution和 `Durable` 发射门禁。local handoff已merge到traceability，external handoff/collaboration保持request-local或只进入既有capture/journal/report carrier；83条flow和14项source-missing stop均闭合。

该结论不表示profile已实现、observer/backend已选择、audit已投递、测试已执行、run_id或evidence已产生、验收已签署。正式 `03-详细设计.md` 仍等待 Step 19装配。

## 110. R15.12 stop-review snapshot 与下一批门禁

### 110.1 Stop-review snapshot

| item | stop-review state |
|---|---|
| current formal document | `03-详细设计.md`；未修改，仍等待Step 19 assembly |
| current calibration artifact | `03_ddd_step_15_observability_audit.md` |
| completed batch | `R15.12 audit / operations fact:再写入` |
| batch status | `03_step_15_r15_12_completed_stop_review` |
| final profile closure | 20/20；`8 accepted + 7 operations/derived + 5 continuity` |
| commit gate | repository write + UoW `Durable` + exact sidecar symmetry before emission；observer failure不改business result |
| exact flow closure | 83/83：Command 26、Query 33、Inbound 6、Outbound 10、Job 8；Query write=0 |
| handoff closure | `C23` only for `handoff_traceability(...)`；`handoff_audit_export(...)` caller/emission=`0/0` |
| source-missing gate | `SM-01..SM-14` final hard stop；当前实际upstream blocker=0 |
| new Rust declaration / comment delta | `0/0`；结构体和字段注释无新增遗漏 |
| non-blocking debt | 两项L0-core design-sync debt保持不变 |
| implementation artifact | not created；implementation ledger与planned boundary skeleton仍禁止提前生成 |
| claimed implementation / test / evidence / sign-off | none；无commit、run_id、真实evidence alias、测试结果或验收签署声明 |
| commit | not requested and not created |

本批完成后停止在 Step 15 的 R15.12 review gate。未经用户下一次明确确认，不进入 R15.13，不修改正式 `03/04`，不创建 Step 16或任何implementation artifact。

### 110.2 R15.13 entry gate

```text
document = 03-详细设计.md
step = 15
completed_batch = R15.12 audit / operations fact:再写入
status = completed_stop_review
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_13
next_batch = R15.13 redaction:先思考
allowed_scope_after_confirmation = classify sensitive fields, body-free sources, diagnostic refs and cross-repository / cross-boundary handoff exposure for all final log, metric, span and durable-carrier profiles as a thinking artifact only
must_reread_before_next_batch = this file §§35~46, §§54~63, §§77~90, §§98~110; Step 6 safe text / boundary marker / serialized carriers; Step 7 external Port input/output; Step 8 public DTO and forbidden payload rules; Step 12 redacted error/issue mapping; Step 14 Off/Redacted and forbidden-body binding; detailed-design SOP Step 15 and writing standard §5.14
forbidden_until_next_gate = R15.14 final redaction table, R15.15 closure, formal 03 assembly, 04, Step 16+, implementation ledger, planned boundary skeleton, code, tests, run_id, evidence, sign-off, commit
unresolved_upstream_blocker = none
```

R15.13只允许先思考敏感字段类别、body-free source与跨边界暴露风险，不得同批写最终redaction表或进入R15.14。

## 111. R15.13 redaction:授权、读取闭包与思考边界

### 111.1 授权与恢复点消费

用户已明确确认从 `03_step_15_r15_12_completed_stop_review` 进入 `R15.13 redaction:先思考`。本批只形成敏感材料分类、body-free source判定、diagnostic ref来源、serialized carrier禁区、跨repository / external Port / observer boundary暴露风险和155个final profile的分组覆盖账；不把候选分类升级为最终redaction表，也不进入R15.14。

本批继续固定以下输出边界：

- 不新增或修改 Rust struct、enum、field、variant、trait、Port、protocol、repository、state、error、issue code或Cargo dependency。
- 不选择 structured-log、metric、trace、audit backend，不发明本地 observability repository、redaction service或可靠投递队列。
- 不修改正式 `03-详细设计.md` / `04-配置设计.md`，不创建Step 16、implementation ledger、planned boundary skeleton或实现代码。
- 不把 `CapabilitySafeText`、typed ref、opaque id、digest或public DTO自动等同于“可以进入任意观测平面”。
- 不生成实现commit、run_id、真实evidence alias、测试结果、验收签署或外部audit receipt。

### 111.2 本批实际读取闭包

| 输入 | 本批读取重点 | 承接结论 |
|---|---|---|
| 本文件 §§35~46 | 60个final structured-log profile、字段词典、错误/issue owner和sink failure | structured log只允许固定key、typed category和显式allowlist；`transaction_ref`当前reserved-not-emitted |
| 本文件 §§54~63 | 48个final metric profile、closed labels和禁止标签 | metric只能使用低基数closed labels；任何id/ref/trace/actor/body/digest均禁入label |
| 本文件 §§77~90 | 27个final span、attribute allowlist、current/historical correlation、no-payload table | `Off`时span/event no-op；`Redacted`只允许逐span allowlist；不存在remote propagation声明 |
| 本文件 §§98~110 | 20个final durable-carrier profile、字段投影、commit gate与source-missing stop | profile只投影既有durable carrier；R15.13仍须复核safe text、actor、ref set、digest和跨边界暴露 |
| Step 6 object contracts | `CapabilitySafeText`、`SensitiveBoundaryMarker`、`ExposureSafetyMarker`、typed ref、serialized surface/snapshot、journal与safe reason | body-free是构造门，不是所有sink的无条件放行；serialized bytes仍有唯一business owner |
| Step 7 Port contracts | 9个external Port、14个callable的exact input/output和禁止正文 | business Port合法接收的typed locator/scope/candidate不自动成为telemetry field |
| Step 8 protocol contracts | public DTO、deterministic issue ref、serialized response/receipt/report/event surface | public可序列化不等于观测可复制；issue ref只分类，不定位实例 |
| Step 12 error/recovery | 17 `ApplicationError`、51 `CapabilityIssueCode`、redacted issue mapping | 只允许closed error kind、issue code/ref；禁止raw source、`Display/Debug`、stack和adapter text |
| Step 14 config/external binding | `CapabilityDiagnosticMode::Off / Redacted`、raw config owner和forbidden-body binding | 无Full/Verbose旁路；mode不能改变business truth、UoW、receipt、report、capture或retry结果 |
| SOP Step 15 / 书写规范 §5.14 | 日志、指标、审计字段与安全边界 | 本批只做redaction思考；正式章节仍须由R15.14/R15.16收口 |

### 111.3 冲突与历史材料处理

旧正式 `03`、README和旧 provider/runtime/cost/audit 方案仍为 `historical_material`。其中任何“debug/full mode”、provider response dump、KMS/Vault material、topic/offset/attempt、runtime/tools result、generic audit body或evidence字段均不得借redaction批次重新进入当前基线。

本批未发现需要回开Step 6~14的upstream blocker。当前需要裁决的内容都是Step 15内部的sink投影收窄问题：现有carrier、marker、typed accessor、Port和error mapper足以支持R15.14，不需要新增上游对象。两项L0-core design-sync debt继续保持non-blocking：

- `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001`
- `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001`

## 112. Redaction 判定模型与敏感材料候选词典

### 112.1 判定顺序

一个值只有依次通过下列判定，才有资格进入R15.14的某个sink allowlist。任一层失败都必须省略该字段或拒绝本次observer emission；不得hash、截断、调用`Debug`或换成空字符串绕过。

```text
existing typed source exists
  -> source was validated by its owning Step 6/8/12/14 gate
  -> exact field / enum variant / accessor is known
  -> value is body-free and not a serialized/raw/private carrier
  -> sink purpose actually needs this value
  -> target plane permits its cardinality and sensitivity
  -> boundary-specific exposure is declared
  -> CapabilityDiagnosticMode and profile emission rule permit emission
  -> emit only the minimum exact projection
```

`typed`只证明类型来源；`body-free`只证明不携带被禁止的正文；`safe text`只证明通过既有scanner与domain policy。三者都不能单独证明低基数、不可枚举、无身份关联、可跨仓或可进入metric label。

### 112.2 候选材料分类

下表的 `RC-*` 是R15.13 editorial class，不是Rust enum、wire value或最终redaction disposition。R15.14必须把每个最终字段落入一个明确处理规则。

| class | 材料特征与例子 | 当前可证明事实 | 主要风险 | R15.14待裁决方向 |
|---|---|---|---|---|
| `RC-STATIC-CLOSED` | profile id、event key、owner、phase、entry/protocol/source/Port/material family、closed state/outcome/error kind | 代码位置或closed mapper提供有限值 | dynamic fallback或把category误当truth | log/span/metric候选；逐profile固定exact domain |
| `RC-BOUNDED-SCALAR` | duration、authoritative count、schema version、target ordinal、version、timestamp | 有exact clock/journal/report/carrier owner | fingerprinting、把observed值反推业务状态 | metric只按既有schema；log/span/durable按purpose最小化 |
| `RC-CORRELATION-REF` | request/source/subject/result/receipt/report/snapshot/capture/intent/traceability ref、current/historical trace | typed body-free高基数关联值 | 身份关联、跨主体枚举、批量关系泄漏 | metric永禁；log/span仅逐profileconditional；durable按exact carrier复核 |
| `RC-ATTRIBUTION` | `ActorContext`、`recorded_by`、`accepted_by`、`checked_by`、`generated_by` | carrier拥有历史actor；log已有`ActorContext.actor_ref()`来源 | full actor context可能包含角色、权限或私有语境 | whole struct不是sink-ready；R15.14裁决是否只投影`actor_ref()` |
| `RC-SAFE-TEXT` | change/trace/gap/failure reason、scope、summary、facet、locator summary | `CapabilitySafeText` / marker已拒绝forbidden body | 仍是自由文本或高基数内容，可泄漏业务关系/locator | metric、span和普通runtime log候选禁入；durable/Port逐字段复核 |
| `RC-INTEGRITY` | stored surface digest、event candidate digest、reference candidate digest、schema ref | canonical完整性carrier存在 | 可作为稳定fingerprint；被误写成evidence或payload替代 | runtime log/metric/span候选禁入；仅exact durable metadata或business Port复核 |
| `RC-DIAGNOSTIC` | `CapabilityIssueCode`、deterministic `CapabilityProtocolValidationIssueRef`、closed `ApplicationError` kind | code/ref来自closed mapper，不含实例detail | 把ref误当diagnostic instance、trace、run或evidence | 允许category/ref候选；禁止field name、命中值、raw cause和随机ref |
| `RC-SERIALIZED` | stored result surface、snapshot `serialized_envelope`、Job response/report body、event collaboration candidate bytes | 有唯一store或business collaboration owner | 第二payload副本、正文泄漏、replay authority漂移 | 所有观测sink和durable投影禁入；只留原business store/Port |
| `RC-TRANSPORT-PRIVATE` | raw header/path/config、endpoint、TLS/credential、topic/group/partition/offset、lease/ack/attempt、scheduler/task handle | 仅entry/infra/driver内部拥有 | secret、拓扑、delivery lifecycle和运行实现泄漏 | 无条件禁入所有Step 15 profile；不存在local-debug例外 |
| `RC-EXTERNAL-BODY` | provider/audit/document/governance/method/runtime/tools/SDK/marketplace response或正文、external receipt body | owner在Hub边界外 | Hub越权保存外部truth或正文 | 无条件禁入；只能保留declared typed ref、closed outcome或safe summary |

### 112.3 缺失值、hash与fallback规则

1. optional source不存在时字段保持absent，不使用`unknown`、`redacted`字符串、zero id、当前时间、随机id或其他ref占位。
2. hash不能把forbidden body变成allowed field。raw body、secret、credential、transaction inner value、idempotency key或external response的hash仍然禁止。
3. digest只有在Step 6/8/13已定义canonical domain、existing typed digest carrier且profile明确需要完整性关联时才是候选；观测层不得临时计算新digest。
4. `CapabilityOpaqueId`不等于public-safe。除deterministic issue-ref的audited-static路径外，opaque值仍按其semantic owner和target boundary裁决。
5. page cursor、transport cursor、timestamp、trace、id generator和idempotency key都不能补造当前模型不存在的generic accepted `source_cursor`。

## 113. Body-free source 不是无条件暴露许可

### 113.1 Safe text与boundary marker的精确含义

| source contract | 它证明什么 | 它不证明什么 | 本批风险结论 |
|---|---|---|---|
| `CapabilitySafeText` | trim后非空并通过forbidden-body scanner | 低基数、匿名、不可枚举、适合metric、适合外部sink | runtime log/span不得因“safe”直接输出；durable/Port按字段purpose复核 |
| `SensitiveBoundaryMarker::BodyFree` | candidate不代表敏感正文 | locator/subject/ref无关联风险 | 可继续进入typed business flow；不是telemetry全字段通行证 |
| `SensitiveBoundaryMarker::ReferenceOnly` | 只通过typed ref指向敏感material | ref可被任意sink或consumer看到 | sink必须按ref family、profile和consumer最小化 |
| `SensitiveBoundaryMarker::ForbiddenBody` | candidate命中禁止正文 | 可以记录命中字段、命中值或hash | 只能拒绝candidate并形成closed issue；observer不得输出命中材料 |
| `ExposureSafetyMarker::ConsumerSafe` | declared consumer surface可使用summary | 所有observer/backend都等同该consumer | 只在原consumer contract内有效；观测sink另做allowlist |
| `ExposureSafetyMarker::RedactionRequired` | public/consumer surface必须redact | 可通过Full/Verbose旁路 | 只保留typed Redacted marker或safe issue；没有旁路 |
| `ExposureSafetyMarker::Forbidden` | 当前summary不得暴露 | 可降级输出partial body | 不发该body；只输出closed forbidden/redacted category |

### 113.2 Typed ref的二次分类

| ref group | examples | body-free status | exposure risk | R15.14必须固定 |
|---|---|---|---|---|
| invocation correlation | `request_ref`, `source_event_ref`, `inbound_event_ref`, `job_run_ref`, `trace_context_ref` | 是 | 可关联caller、source、run和跨调用活动 | 仅declared log/span profile conditional；metric永禁；不得跨Port声称trace传播 |
| local truth/revision | identity/registry/descriptor/relation/exposure/change/trace/impact refs | 是 | 暴露business subject与关系图 | durable profile按exact source候选；runtime一次只取primary subject；禁止bulk dump |
| continuity | `result_ref`, `receipt_ref`, `report_ref`, `snapshot_ref`, `capture_ref` | 是 | 暴露replay/recovery topology | 只在形成或exact-load symmetry通过后出现；不得从current truth创建 |
| external intent/handoff | `intent_ref`, audit ref、handoff ref | 是 | 暴露外部协作身份和可能的可枚举handle | 只在exact Port/capture profile；不得当delivery/evidence/acceptance |
| secret/document/audit reference | secret、external document、observability/audit variants | 是或ReferenceOnly | ref本身仍指向敏感owner/material | generic `subject_ref`必须保留variant；是否输出id由profile最小需要裁决 |
| source-version/ref set | affected consumer、source change、truth/material/source-version集合 | 是 | 一次性枚举完整关系图，规模可变 | metric/log/span禁bulk set；durable profile逐字段决定ref、set或省略 |

generic `subject_ref`、`ReferenceSubjectRef`或`CapabilityReadSubjectRef`不能丢失variant后只输出opaque inner id。特别是 `Secret`、`ExternalDocument`、`ObservabilityAudit`、runtime/tools和SDK consumer variants，必须先由profile确认是否需要该identity；禁止以“都是typed ref”为由统一放行。

### 113.3 Actor与历史归因

R15.12中的 `actor_context`、`recorded_by`、`accepted_by`、`checked_by`和`generated_by`表示carrier的历史归因来源，不表示可以把整个 `ActorContext` 序列化给observer。R15.6已经存在唯一body-free `ActorContext.actor_ref()`来源，因此R15.14必须显式裁决：

- whole `ActorContext`不得直接进入structured log、span attribute、metric label或external handoff。
- current caller actor不得补历史carrier缺失的actor，也不得覆盖stored actor。
- 若durable profile需要归因，候选最小投影是carrier-owned `actor_ref()`；role、authorization、token、display text和完整scope仍禁止。
- actor ref是高基数关联值，永不进入metric label，也不得作为trace、request或evidence identity。

该项是R15.12 allowlist的待收窄点，不是upstream blocker；现有accessor足以在R15.14闭口，无需修改core actor schema。

## 114. Diagnostic ref、error source与redaction violation

### 114.1 当前唯一public-safe issue identity

当前基线没有generic `DiagnosticRef`、observer error id或redaction incident id。可复用的public-safe diagnostic identity只有 `CapabilityProtocolValidationIssueRef`：

- 它只能由 `CapabilityIssueCode::literal()` 经 `CapabilityProtocolValidationIssueRef::from_code(...)`形成。
- 51个literal均为fixed ASCII、versioned、deterministic；同一code在不同调用中形成相同ref。
- 它只分类，不定位实例；不能拼入subject、field name、run、trace、timestamp、adapter code或raw-body hash。
- duplicate replay复制stored issue refs；fresh mapper不能从raw error或message substring重建。

`issue_code`与`issue_ref`可以在forming owner的declared profile中同时出现，但二者不得被解释为两个issue、审计记录、trace、run、evidence alias或外部receipt。

### 114.2 Error与nonpublic source边界

| material | allowed candidate | always forbidden |
|---|---|---|
| `ApplicationError` | exact closed variant/category name；declared issue code/ref | `Display`、`Debug`、raw cause chain、SQL、repository/backend text、stack/panic payload |
| entry / runtime wrapper error | closed entry category、phase、owner、safe issue | raw parser input、path/header/config value、runtime handle、join cause text |
| external adapter failure | `ApplicationPortKind`、closed timeout/unavailable/contract category | HTTP/broker status text、provider code、endpoint、response body、credential |
| consistency defect | invariant family、safe subject/ref when already validated | mismatched row/body dump、serialized sidecar、current-state reconstruction |
| observer sink failure | static failed profile/event key、closed sink kind、`observer_sink_failure` | backend response/body、retry loop、stack、recursive observer event |

nonpublic source可以保留在原错误对象中供process-local ownership与precedence处理，但Step 15 sink不得通过source chaining、`std::error::Error::source`、formatting或downcast暴露它。

### 114.3 Redaction violation自身的最小观察

一次observability emission候选命中forbidden字段时：

1. gate拒绝该候选字段或整条profile emission；不得先写出再补一条“已redact”。
2. 原business result、UoW、rollback、receipt、report、capture、handoff和retry决策保持不变。
3. 只允许既有 `L-DIAG-02` / `MP-DIAG-02` owner记录固定 `redaction_violation` category；不得把合法typed `BodyForbidden/RedactedBoundary` surface重复计为observer violation。
4. diagnostic不得包含命中field name、value、length、prefix、hash、source path或完整profile body。
5. 若diagnostic sink本身失败，只能按既有non-recursive observer-failure规则处理；不得观察自身或递归。

## 115. Serialized carrier与business Port例外边界

### 115.1 Serialized material inventory

| carrier / material | 唯一business用途 | 可供redaction复核的metadata | 任何Step 15 sink均禁止 |
|---|---|---|---|
| stored public result surface | exact duplicate replay与typed response恢复 | `result_ref`, `result_kind`, disposition、`surface_ref`；digest只作R15.14 integrity候选 | serialized surface bytes、decoded response/receipt/report body、current truth重建结果 |
| `CapabilityEventPayloadSnapshot.serialized_envelope` | post-commit collaboration与repair的唯一complete payload | snapshot/capture/source/schema refs、trace/time；candidate digest只作integrity候选 | envelope bytes、payload fragment、decoded event body、body hash debug dump |
| `CapabilityEventCollaborationCandidateSurface` | `CapabilityAccessEventCollaborationPort::collaborate(...)`的business input | local observer只可引用capture/snapshot/source identity | candidate bytes/body、route、transport headers/status、external receipt body |
| Job stored response/report surface | duplicate replay、caller response和report Query | result/report/run refs、closed disposition、typed issue refs | report item/detail body、frozen target body、generic decoder output、test/evidence material |
| API / Worker / Jobs owned request bytes | header-first validation与typed decode | validated protocol family/schema/closed outcome | raw body、malformed field value、header map、source payload、job input |
| external resolver/handoff response | adapter内部raw-to-typed mapping | Port family、closed typed outcome、safe issue | external body/status/code/header、governance/method/document/audit正文 |

### 115.2 Business Port合法传递不等于telemetry许可

`CapabilityAccessEventCollaborationPort::collaborate(...)`必须获得complete stored candidate，七类resolver Port合法获得各自body-free locator/scope/candidate，`ObservabilityAuditHandoffPort`合法获得exact trace/export ref、audit ref和body-free handoff scope。这些参数是完成business collaboration所需的typed input，不是观测字段库。

实现中必须保持两个调用面分离：

```text
business application -> exact Port input, including declared typed candidate/scope
observer facade       -> only profile-specific redacted projection
```

observer wrapper不得截获、clone、serialize或`Debug` Port request/response作为日志/span/audit body；Port adapter也不得把原始transport材料通过observer callback带回application。

## 116. `Off / Redacted` 模式的已知结论与待裁决面

### 116.1 不受diagnostic mode影响的business surface

无论mode为 `Off` 或 `Redacted`，以下事实都必须按Step 6~14原契约执行：domain validation、UoW/repository write、change/trace/impact/reference/material/result/receipt/snapshot/capture/journal/report carrier、duplicate replay、commit resolution、rollback、external Port调用、typed public `Redacted/Forbidden` surface和cleanup precedence。

mode不能：

- 跳过或增加business write；
- 把forbidden body变为allowed；
- 改写caller disposition、issue refs或Query visibility；
- 取消业务future、授权retry或改变external collaboration；
- 让20个carrier本身消失或产生额外revision。

### 116.2 Plane-by-plane状态

| plane | 上游已闭合结论 | R15.13不能擅自推断 | R15.14必须裁决 |
|---|---|---|---|
| 27 span + span events | `Off`等价process-local no-op；`Redacted`只用§82 allowlist | Full/Verbose、local-only raw attribute | 把本批field class反向应用到27/27 allowlist并收窄高风险ref |
| optional diagnostic record | enum定义`Off = No optional diagnostic emission`；Redacted排除raw config/external body | 所有业务错误都必须额外输出diagnostic | `L-DIAG-*`与non-recursive fallback在两mode下的exact emission |
| 60 structured logs | 现有表均已body-free并有forbidden fields | `CapabilityDiagnosticMode`天然关闭全部日志或天然不影响任何日志 | 60/60 profile的mode行为、required field与gate failure |
| 48 metrics | labels已全部closed low-cardinality | Off天然关闭metrics、或metric永远独立于mode | 48/48 profile与3个diagnostic metric的mode行为及sink failure |
| 20 durable-carrier projections | underlying carrier永远按business contract保存；profile在Durable后观察 | mode可以阻止carrier persistence，或profile等于可靠审计投递 | 区分carrier存在与observer projection emission；明确Off下是否仅抑制optional投影 |
| public Query / receipt / report Redacted marker | typed protocol行为，独立于observer | Off可把Redacted改成Visible/NotVisible或删除issue | 保持原wire mapping，不把observer violation与legal surface混计 |

当前mode作用域尚待R15.14在Step 15内部收口，但不存在新增配置variant的理由：最终只能使用既有 `Off / Redacted`，不得引入`Full`、`Verbose`、per-field override或backend-specificmode。

## 117. 155个final profile的redaction候选覆盖

### 117.1 Structured-log `60/60`

下表按final profile family穷尽R15.6的60个cut。它只标出共同风险与R15.14复核重点；不修改各profile现有required/optional字段。

| exact profile set | count | 主要候选classes | 最高风险字段/材料 | R15.14复核重点 |
|---|---:|---|---|---|
| `L-API-01..06` | 6 | static、correlation ref、diagnostic、scalar | request/trace ref、malformed metadata、raw header/body/config | pre-gate字段保持absent；mode与required字段不能冲突 |
| `L-APP-01..10` | 10 | static、correlation ref、attribution、diagnostic | actor/subject/result ref、safe reason、canonical input/digest | whole actor与reason禁入；每条只保留必要primary ref |
| `L-UOW-01..08` | 8 | static、correlation ref、diagnostic | transaction inner value、repository body、SQL、staged effects | `transaction_ref`继续0；repository/UoW只输出family、purpose、resolution |
| `L-PORT-01..06` | 6 | static、correlation ref、diagnostic | locator/scope/candidate、external body/status、audit receipt | observer不镜像Port参数；subject/ref逐call最小化 |
| `L-WKR-01..06` | 6 | static、correlation ref、scalar、diagnostic | raw envelope、topic/offset/lease/ack、trusted actor detail | header前不输出source identity；transport-private永禁 |
| `L-OUT-01..03` | 3 | static、correlation ref、integrity、diagnostic | snapshot/candidate bytes、digest、route、delivery state | refs only；digest与serialized body默认禁入runtime log |
| `L-JOB-01..08` | 8 | static、correlation ref、attribution、scalar、diagnostic | input/scope/target/report body、key/digest、scheduler/attempt | run/ordinal/ref按owner最小化；不输出target集合或whole actor |
| `L-INF-01..07` | 7 | static、diagnostic | raw config/path/endpoint/credential/partial graph/runtime handle | 只保留stage、binding、entry、safe issue；source chain不格式化 |
| `L-DIAG-01..06` | 6 | static、diagnostic、conditional ref | raw cause/stack、field/value、backend response、recursive failure | issue只分类；violation不含命中field；sink failure最多一次 |
| **total** | **60** | 9 disjoint profile families | no raw/body/private fallback | **60/60 pending final field-by-field redaction in R15.14** |

日志的 `required` 只在profile实际进入emission且上游source已形成时成立。若 `Off` 最终抑制某类optional emission，不能为了满足required schema而先读取/格式化敏感值；若 `Redacted` gate拒绝一个required候选字段，R15.14必须明确“省略字段”还是“拒绝整条record”，不能由实现者临时决定。

### 117.2 Metric `48/48`

| exact profile set | count | allowed material class | redaction risk | 本批结论 |
|---|---:|---|---|---|
| `MP-ENTRY-01..03` | 3 | static closed label + duration | exact operation/request/trace/body混入label | 只保留§57/§58固定keys与closed values |
| `MP-APP-01..05` | 5 | static closed label + duration | subject、actor、reason、flow id和free-text outcome | identity/ref/text全部禁入 |
| `MP-IDEM-01` | 1 | closed classification | key/hash/digest/result ref/attempt | 只记录互斥classification |
| `MP-UOW-01..04` | 4 | Port/repository family、phase、resolution、duration | transaction ref、row key、SQL、effect body | 只使用fixed 36-value map的声明子集 |
| `MP-PORT-01..06` | 6 | Port/handoff family、closed outcome、duration | provider/endpoint、subject/intent/audit ref、external code | exact refs永不作label |
| `MP-WORKER-01..06` | 6 | source slot/family、lifecycle、outcome、duration | topic/group/offset/lease/ack和source event ref | 只使用six exact slot/family pairs |
| `MP-OUT-01..04` | 4 | event/material group、phase、outcome、duration | capture/snapshot/intent ref、digest、route/attempt | 只保留closed semantic label |
| `MP-JOB-01..08` | 8 | job kind、phase、disposition、duration | run id、target ordinal/ref、scope/finding/report body | run/target/report identity永禁label |
| `MP-INFRA-01..06` | 6 | stage、entry、binding、closed result、duration | config/path/adapter concrete identity、endpoint | binding Gauge也不表示health |
| `MP-MAT-01..02` | 2 | material kind、freshness/disposition、duration | material/report ref、finding/reason、source version set | 不从material body造label |
| `MP-DIAG-01..03` | 3 | technical error family；observer sink kind | raw cause、field/value、profile body、backend response | redaction/observer failure使用固定literal且不递归 |
| **total** | **48** | §57固定label schema | every high-cardinality/ref/body candidate rejected | **48/48 label sets already candidate-safe;R15.14 fixes mode/gate semantics** |

R15.13没有发现需要新增或删除metric label的缺口。R15.14只需把`Off/Redacted`、mapper failure、sink failure和redaction violation的发射行为写成最终规则；不得借redaction批次改变48个identifier、34/12/2类型算术或closed value域。

### 117.3 Span `27/27`

| exact profile set | count | 主要候选classes | 高风险面 | R15.14复核重点 |
|---|---:|---|---|---|
| `FSP-API-01..02` | 2 | static、correlation ref、diagnostic | malformed header、request/current/historical trace | pre-validation absent语义；replay historical trio不可拆 |
| `FSP-WKR-01..05` | 5 | static、correlation ref、diagnostic | source/receipt/capture refs、transport cursor、historical trace | lifecycle root无协议identity；continuation只用validated carrier link |
| `FSP-JRT-01..03` | 3 | static、correlation ref、scalar、diagnostic | run/result/report ref、request bytes、scheduler/attempt | deadline不改owned span；reentry link完整成组 |
| `FSP-APP-01..04` | 4 | static、correlation ref、diagnostic | subject/result/receipt/report refs、actor/reason | 每span最多一个primary subject；whole actor/text禁入 |
| `FSP-IDEM-01`, `FSP-UOW-01`, `FSP-REPO-01` | 3 | static、correlation ref、diagnostic | key/hash/digest、transaction inner value、row/SQL/body | authority category only；`transaction_ref`继续禁发 |
| `FSP-PORT-01..03` | 3 | static、correlation ref、diagnostic | locator/scope/candidate、external body、remote context claim | local callsite span only；不传播或记录Port request body |
| `FSP-OUT-01..03` | 3 | static、correlation ref、integrity、diagnostic | envelope/digest、capture/intent topology、delivery state | refs按phase最小化；historical link不变parent |
| `FSP-JOB-01..03` | 3 | static、correlation ref、scalar、diagnostic | frozen plan、finding/report body、next target/attempt | one target/phase only；不展开set/body |
| `FSP-INF-01` | 1 | static、diagnostic | raw config/path/credential/graph/handle | local root；stage event仅safe closed fields |
| **total** | **27** | 9 disjoint profile groups | no payload / no remote propagation / no truth | **27/27 pending final attribute redaction audit in R15.14** |

R15.10的correlation group继续是不可拆不变量：`historical_trace_context_ref`必须与一个exact carrier ref、`correlation_mode=historical_link`和exact `link_relation`同存。redaction不能只删carrier ref却保留historical trace，也不能为“看起来完整”补造current trace或backend parent。

### 117.4 Durable-carrier profile `20/20`

| exact profile set | count | 主要候选classes | R15.12待收窄字段 | R15.14复核重点 |
|---|---:|---|---|---|
| `AFP-CHANGE-IDENTITY`, `AFP-CHANGE-REGISTRY`, `AFP-CHANGE-DESCRIPTOR`, `AFP-CHANGE-GOVERNANCE-SEAM`, `AFP-CHANGE-METHOD-RELATION`, `AFP-CHANGE-EXPOSURE` | 6 | ref/state、safe text、attribution、trace/time | `change_reason`, whole `actor_context`, related refs、boundary marker | 六类无version；reason/actor/ref set按sink purpose最小化 |
| `AFP-TRACEABILITY`, `AFP-IMPACT` | 2 | ref set/state、safe text、attribution、trace/version/time | source/handoff/consumer sets、trace/gap/state reason、actor | local durable relation可保留；observer不得bulk relationship dump |
| `OFP-REFERENCE-RESOLUTION`, `OFP-DOWNSTREAM-IMPACT-SUMMARY` | 2 | variant ref/state、safe text、attribution、trace/version/time | reference subject、resolution reason、consumer/feedback ref、gap reason | secret/document/audit variants二次分类；generic source cursor仍0 |
| `OFP-CONTROLLED-CONSUMER-VIEW`, `OFP-DIRECTORY-PROJECTION`, `OFP-AUDIT-EXPORT`, `OFP-ECOSYSTEM-DISCOVERY` | 4 | ref/source-version sets、safe summaries/scopes、state/time | descriptor/display/allowed/discoverability summary、facets、observability refs | whole safe summary/text/set不自动进入observer；material body不复制 |
| `OFP-RECONCILIATION-REPORT` | 1 | ref sets、safe scope/finding/reason、attribution、trace/version/time | source/material sets、finding summary、failure reason、generated_by | report body与evidence禁入；actor/ref set按consumer最小化 |
| `CFP-STORED-RESULT`, `CFP-INBOUND-RECEIPT` | 2 | continuity refs、integrity、closed disposition/issues | surface digest、receipt marker/ref sets、historical trace | serialized surface永禁；digest/ref set只在exact continuity purpose |
| `CFP-EVENT-CAPTURE` | 1 | source/snapshot/capture/intent refs、integrity、trace/version/time | schema/candidate digest、source ref、historical trace | serialized envelope永禁；capture trace只来自matching snapshot |
| `CFP-JOB-JOURNAL`, `CFP-JOB-REPORT` | 2 | run/target/result/report refs、attribution、issues、trace/version/time | whole actor、per-target set、job detail、surface ref | normalized key/request digest/body永禁；target/report只投影必要ref/category |
| **total** | **20** | 8 accepted + 7 operations/derived + 5 continuity | no generic audit envelope | **20/20 pending final projection redaction in R15.14** |

这里的redaction只约束R15.12定义的post-commit observer projection，不删除或改写underlying business carrier字段。若一个safe reason、actor或ref set对原repository object是合法且必要的，它仍按Step 6~13保存；R15.14只能决定observer是否省略、降到specific ref/category，不能改变对象schema或durability。

### 117.5 Coverage arithmetic

| plane | expected final profiles | classified once in §§117.1~117.4 | missing | extra | duplicate group |
|---|---:|---:|---:|---:|---:|
| structured log | 60 | 60 | 0 | 0 | 0 |
| metric | 48 | 48 | 0 | 0 | 0 |
| span | 27 | 27 | 0 | 0 | 0 |
| durable-carrier projection | 20 | 20 | 0 | 0 | 0 |
| **total** | **155** | **155** | **0** | **0** | **0** |

该算术是设计token与表行的静态覆盖，不表示任何profile已经实现、发射、被backend接收或通过测试。

## 118. 跨repository、协议与external boundary暴露分类

### 118.1 Boundary matrix

| boundary | business input / authority | observer可考虑的最小投影 | 必须停留在owner内部 | 禁止解释 |
|---|---|---|---|---|
| repository adapter -> application | exact typed object、Loaded version、repository result | repository family、purpose、typed outcome；已验证的single primary ref按profile | entity/row body、SQL/query、table/collection、connection/replica、lock token | repository成功等于business accepted或Durable |
| UoW/commit authority -> application | transaction handle、staged writes、resolution、rollback result | phase、`Durable/NotDurable/Unknown`、rollback category | transaction inner value、staged effect/body、backend cause | observer/span status解决commit unknown |
| application -> API/Worker/Jobs protocol | exact typed request/result/receipt/report | closed protocol/disposition、declared issue ref与必要result/receipt/report ref | raw request、serialized result、whole actor、private cause | observer fields写回DTO或改变public result |
| infra config -> runtime builder/entry | raw candidate -> validated root -> one handoff | stage、entry、binding state、safe issue | raw key/value/path、endpoint、credential/TLS、partial graph/handle | startup log/span替代complete predicate |
| seven resolver Ports | typed subject/kind/locator/scope/candidate -> typed observation | Port family、closed outcome、必要single subject/ref | locator/scope text、candidate digest/body、raw status/response | resolved等于provider health、approval、method validity、execution authorization |
| `ObservabilityAuditHandoffPort` | exact trace/export ref + audit ref + body-free scope | handoff kind、typed request-local outcome、必要traceability/audit ref | scope text、export/trace body、external receipt/audit/evidence body | external acceptance、evidence或Hub durable handoff truth |
| event collaboration Port | complete stored candidate或intent -> typed outcome/item/page | event family、capture/snapshot/intent refs、closed outcome | serialized candidate、route、status body、attempt/lease/ack、page body | Hub-ownedDelivered、outbox/relay/DLQ或remote trace propagation |
| durable carrier -> observer sink | repository object provenDurable + exact symmetry | R15.14逐profile的minimum projection | whole object serialization、all refs dump、body/surface/snapshot/journal/report detail | reliable audit delivery或second truth store |
| observer facade -> backend | final redacted record/labels/attributes/profile projection | only exact final schema | original object、Port args/return、error source chain、business future ownership | sink failure改变caller/rollback/retry |
| downstream observability/audit/archive consumer | body-free ref/handoff/safe summary contract | onlydeclared handoff surface | raw telemetry/audit/archive package、evidence/signature | directory存在/Port accepted等于deployment readiness |

### 118.2 External reference family risk

| reference variant | allowed business meaning | observer risk | forbidden promotion |
|---|---|---|---|
| external MCP/A2A/API source | body-free source ref/kind/resolution | locator与ref可揭示provider integration topology | provider identity/health/route/quota/cost/execution result |
| governance result | result ref/state/safe summary | ref与scope可揭示approval workflow关系 | approval、Policy、vote、workflow或acknowledgement |
| method asset | asset ref/kind/state | locator/kind可揭示method inventory | method body/source/package/lifecycle/execution |
| secret | secret ref/state/safe handling summary | ref/provider/scope即使body-free仍高度敏感 | value、path token、credential validity、KMS/Vault health/rotation |
| external document | document ref/kind/state | locator可暴露internal document/schema topology | OpenAPI/schema/guide body或correctness |
| runtime/tools or SDK consumer | consumer ref/scope/state | ref可揭示runtime integration/SDK surface | execution、authorization、cache、client/package/publication |
| observability/audit | audit ref/kind/state | ref/locator可揭示external ledger topology | raw telemetry/audit/GRC body、evidence、acceptance/sign-off |

R15.14必须让每个generic reference/subject字段保持variant-aware；禁止先erase variant，再按统一opaque string输出。对于secret/document/audit family，没有“只要ref就天然低风险”的例外。

### 118.3 Handoff reachability与redaction

redaction不改变R15.12已闭合的call reachability：

- `handoff_traceability(...)`仍只有`C23`一个exact caller。
- `C13/C14` handoff caller仍为0。
- `handoff_audit_export(...)` caller/emission仍为`0/0`；其Port schema只作为当前不可达的declared business contract保留。
- `CapabilityAuditHandoffOutcome`仍request-local，不因observer需要而新增repository/profile。
- external outcome不进入local accepted truth；local `HandoffPending`仍只由`AFP-TRACEABILITY` revision表达。

R15.14不得为了“统一redaction测试”主动调用不可达Port、构造fake receipt、创建第21个durable profile或把outcome写回carrier。

## 119. R15.14必须逐项完成的裁决

| decision id | R15.14必须回答的问题 | 当前候选约束 | 禁止偷渡 |
|---|---|---|---|
| `RD-01` | `Off`对60 logs、48 metrics、27 spans、20 post-commit projections各自的exact emission语义是什么？ | underlying business carrier/flow永不受影响；optional diagnostic明确可Off | 把mode变业务开关或新增第三mode |
| `RD-02` | `Redacted`的统一field gate在何处、失败时省略field还是拒绝record？ | owner在值进入backend前；不能先emit后补偿 | backend-specific sanitizer替代设计gate |
| `RD-03` | 每个material class最终为allow / conditional / project / omit / reject中的哪类？ | 只能用existing field/accessor/mapper | 新Rust carrier、genericredacted JSON |
| `RD-04` | 60日志required/optional字段如何与mode和source absent协调？ | pre-gate absent与optional不造fallback | 空串/unknown/hash占位 |
| `RD-05` | 48 metric profile在两mode下如何发射，mapper/gate/sink失败如何计数？ | label key/value不变；ref/body全禁 | 新diagnostic label、observer递归 |
| `RD-06` | 27 span和3个span event的allowlist如何逐项收窄？ | Off no-op；Redacted exact allowlist；historical trio不可拆 | remote propagation、Full/Verbose attribute |
| `RD-07` | 20 durable profile的safe reason、actor、ref set、digest、trace/time如何最小投影？ | carrier schema不变；only post-Durable projection | whole object serialization或second audit envelope |
| `RD-08` | `ActorContext`是否统一投影为carrier-owned `actor_ref()`，哪些profile应完全省略？ | whole struct禁止；current actor不补historical | role/token/scope/display text |
| `RD-09` | generic subject/reference union如何variant-aware输出？ | secret/document/audit等高风险variant单独判定 | opaque-id统一放行或variant erasure |
| `RD-10` | safe text/reason/scope/summary/facet/locator哪些仅留business carrier/Port？ | safe不等于sink-ready；metric/span/runtime log默认禁 | free-text “redacted”或truncate/hash旁路 |
| `RD-11` | typed digest/schema/surface refs在哪些durable profile仍有必要？ | no runtime log/metric/span digest；serialized bytes永禁 | digest=evidence、raw body hash |
| `RD-12` | issue code/ref、legal Redacted surface与observer redaction violation如何去重？ | issue ref只分类；violation只有L/MP-DIAG-02 | field/value泄漏、双计数 |
| `RD-13` | repository/UoW/Port wrapper如何保证不捕获args、return、raw cause？ | only explicit projection;transaction ref仍0 | automatic middleware debug dump |
| `RD-14` | audit handoff/event collaboration的business input与observer projection如何物理分离？ | complete candidate只走Port；observer只refs/outcome | clone/serialize candidate到sink |
| `RD-15` | redaction hard stop、observer sink failure和non-recursive fallback的优先级是什么？ | business result优先且不可改；最多一次fallback | observer retry state、panic/rollback |
| `RD-16` | Step 16/19/04/07需要承接哪些redaction testing/config/implementation gate？ | 只写handoff，不提前生成后续产物 | 伪造测试/evidence/run/sign-off |

R15.14完成前，本批不宣布155个profile的最终redaction schema，也不授权实现者从上述候选中自行选择。

## 120. R15.13 cross-step closure与专项边界

### 120.1 Step 6~14 source closure

| upstream | 本批复核结果 | 是否需回开 |
|---|---|---|
| Step 6 object contracts | safe text、marker、typed ref、serialized carrier和actor source均可精确分类；whole actor/text/ref set需要Step 15投影收窄 | no |
| Step 7 trait/Port contracts | 9 external Port业务input/output与observer projection可分离；无新Port或signature需要 | no |
| Step 8 protocol contracts | deterministic issue ref与public typed Redacted surface足够；public DTO不需新增observability字段 | no |
| Step 9 function flows | redaction不改变83个flow、effect vector、Port reachability或no-write | no |
| Step 10 state | redaction只观察existing state/marker，不新增Redacted/Audited/Observed state | no |
| Step 11 persistence | business carrier与post-commit projection可分离；无observer repository/transaction | no |
| Step 12 error/recovery | closed error/issue足够；raw/nonpublic source继续不可输出 | no |
| Step 13 concurrency/idempotency | key/digest/reentry authority不进入observer；redaction不改变replay/retry | no |
| Step 14 config/binding | onlyOff/Redacted足够；mode作用面需R15.14内部闭口，不需新config variant | no |

### 120.2 Capability Hub专项边界

| boundary | R15.13结论 | result |
|---|---|---|
| capability identity / registry | onlytyped ref/state/change category；no identity body、runtime identity或listing | pass |
| adapter descriptor / MCP-A2A-API | locator/body/candidate不进observer；no provider runtime/health/quota/cost/result | pass |
| governance seam | ref/safe summary不升级为approval/Policy/workflow | pass |
| method-library relation | asset ref不升级为method body/source/package/execution | pass |
| formal exposure / consumer | ref/view state不升级为runtime/tools/SDK/marketplace truth | pass |
| audit/observability | issue/audit/trace ref不升级为raw telemetry、evidence或acceptance | pass |
| event collaboration | serialized candidate只走business Port；observer不拥有delivery lifecycle | pass |
| diagnostics | no genericDiagnosticRef、Full/Verbose或raw source chain | pass |

### 120.3 Historical material、blocker与debt

本批没有恢复旧 provider debug dump、generic audit ledger、raw external body、runtime/tools execution、cost、marketplace listing、governance approval或method body。historical-material reintroduction=`0`。

unresolved upstream blocker=`0`。需要R15.14完成的16项是Step 15内部finalization，不是上游阻塞。两项L0-core design-sync debt不变，backend产品/crate仍未选择；未来选择具体backend仍须按§88受控回开Step 14并保持本批redaction边界。

## 121. SOP五问的R15.13增量答案

| SOP问题 | 本批增量回答 | 后续 |
|---|---|---|
| 哪些处理流必须记录审计？ | R15.12的20个durable profile资格不变；redaction只收窄observer projection，不改变carrier写入或83-flow admission | R15.14最终字段规则 |
| 哪些错误分支必须记录日志？ | closed error/issue可观察；raw cause、stack、field/value、external status和source chain均禁；violation与legal Redacted surface不得双计 | R15.14 mode/gate/fallback |
| 哪些关键路径需要指标？ | 48个profile及label schema不变；所有id/ref/text/body/digest仍禁label | R15.14两mode与sink failure |
| 日志、指标、审计字段分别记录什么？ | log/span仅最小closed category与conditional single ref；metric仅低基数closed label；durable projection来自exact carrier但safe text/actor/ref set仍需二次收窄 | RD-03~RD-14 |
| 哪些监控和告警细节应留给运维手册？ | backend/exporter、retention、sampling、threshold、SLO、dashboard、pager、runbook、endpoint和operator rendering仍后移；本批不定义 | `04`/运维/后续07 handoff |

## 122. R15.13机械自检与stop-review snapshot

### 122.1 Mechanical / semantic self-check

以下结果是设计文档静态审计，不是源码scan、实现测试、backend验证或安全测试结果。

| check | expected | actual | result |
|---|---:|---:|---|
| final structured-log profiles classified | 60 | 60 | pass |
| final metric profiles classified | 48 | 48 | pass |
| final span profiles classified | 27 | 27 | pass |
| final durable-carrier profiles classified | 20 | 20 | pass |
| total final profile classification | 155 | 155 | pass |
| editorial redaction classes | 10 | 10 | pass |
| external reference variants classified | 7 families / 8 variants | 7 rows covering external source、governance、method、secret、document、runtime-tools+SDK、observability-audit | pass |
| R15.14 explicit decisions | 16 | 16 | pass |
| generic accepted source cursor admitted | 0 | 0 | pass |
| generic DiagnosticRef / observer incident id added | 0 | 0 | pass |
| Full / Verbose / third diagnostic mode added | 0 | 0 | pass |
| new Rust declaration / struct field / comment delta | 0 / 0 / 0 | 0 / 0 / 0 | pass |
| unresolved upstream blocker | 0 | 0 | pass |
| formal `03/04` or implementation artifact modified/created | 0 | 0 | pass |

### 122.2 Stop-review snapshot

| item | stop-review state |
|---|---|
| current formal document | `03-详细设计.md`；未修改，仍等待Step 19 assembly |
| current calibration artifact | `03_ddd_step_15_observability_audit.md` |
| completed batch | `R15.13 redaction:先思考` |
| batch status | `03_step_15_r15_13_completed_stop_review` |
| profile classification | `60 log + 48 metric + 27 span + 20 durable = 155/155` |
| key risk finding | typed/body-free/safe text不等于任意sink可见；whole actor、safe text、variant ref、digest和serialized carrier已单独分类 |
| diagnostic closure | deterministic issue ref只分类；genericDiagnosticRef=0；raw cause/field/value/stack禁止 |
| mode closure | business carrier与flow不受mode影响；span Off/no-op已知；其余plane exact mode语义留R15.14 |
| cross-boundary closure | repository/UoW/protocol/config/7 resolver/audit handoff/event collaboration/observer/downstream边界已分类 |
| R15.14 decisions | `RD-01..RD-16` pending finalization |
| new Rust declaration / comment delta | `0/0`；未新增结构体或字段，不存在注释遗漏 |
| upstream blocker | none |
| non-blocking debt | 两项L0-core design-sync debt保持不变 |
| implementation artifact | not created；implementation ledger与planned boundary skeleton仍禁止提前生成 |
| claimed implementation/test/evidence/sign-off | none；无commit、run_id、真实evidence alias、测试结果或验收签署声明 |
| commit | not requested and not created |

本批完成后停止在Step 15的R15.13 review gate。未经用户下一次明确确认，不进入R15.14，不修改正式`03/04`，不创建Step 16或任何implementation artifact。

### 122.3 R15.14 entry gate

```text
document = 03-详细设计.md
step = 15
completed_batch = R15.13 redaction:先思考
status = completed_stop_review
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_14
next_batch = R15.14 redaction:再写入
allowed_scope_after_confirmation = decide RD-01..RD-16; write the final redaction disposition, per-plane mode, forbidden-material, actor/ref/safe-text/digest projection, cross-boundary and observer-failure tables; provide Step 16/19/04/07 handoff only
must_reread_before_next_batch = this file §§111~122 plus final source tables §§35~46, §§54~63, §§77~90, §§98~110; Step 6 marker/safe-text/actor/serialized carriers; Step 7 exact external Port schemas; Step 8 issue/public DTO contracts; Step 12 error/issue mapping; Step 14 CapabilityDiagnosticMode and binding; SOP Step 15 and writing standard §5.14
forbidden_until_next_gate = R15.15 closure, formal 03 assembly, 04, Step 16+, implementation ledger, planned boundary skeleton, code, tests, run_id, evidence, sign-off, commit
unresolved_upstream_blocker = none
```

R15.14必须把本批候选分类逐项裁决为最终redaction表，并反向覆盖155/155 profile；不得同批进入R15.15 cross-step closure。

## 123. R15.14 redaction:授权、读取闭包与最终投影模型

### 123.1 授权与本批边界

用户已明确确认从 `03_step_15_r15_13_completed_stop_review` 进入 `R15.14 redaction:再写入`。本批只消费 `RD-01..RD-16`，固定10类材料的最终 disposition、四个observer plane在 `Off / Redacted` 下的exact行为、required / optional source处理、actor / ref / safe-text / digest / issue投影、cross-boundary hard stop和后续handoff；不进入R15.15，不修改正式 `03/04`，不创建Step 16、implementation ledger、planned boundary skeleton或实现代码。

本批继续固定：

- 60个structured-log profile、48个metric identifier及其34 Counter / 12 Histogram / 2 Gauge、27个span与3个fixed event、20个durable-carrier profile的名称、数量、owner、trigger和业务admission均不增删。
- `CapabilityDiagnosticMode`仍只有 `Off / Redacted`；没有 `Full`、`Verbose`、per-field override或backend-specific mode。
- `Off / Redacted`只控制Step 15 observer emission。business carrier、83个flow、UoW、receipt、report、capture、handoff、external Port调用、retry/reentry、public typed `Redacted/Forbidden` surface和cleanup precedence均不受影响。
- 本批新增Rust声明、struct field、enum variant、trait、Port、protocol、state、error、issue code和Cargo dependency均为0；因此没有新增结构体/字段注释对象。

### 123.2 本批实际读取闭包

| 输入 | 本批回读内容 | 最终承接 |
|---|---|---|
| 本文件 §§35~46 | 60个log profile、字段词典、required/optional、17 errors、51 issues、sink failure | 最终log gate只收窄既有allowlist；不修改event key、level或primary owner |
| 本文件 §§54~63 | 48个metric profile、closed labels、issue owner和Gauge规则 | label schema原样保留；identity/ref/text/body/digest继续0标签 |
| 本文件 §§77~90 | 27个span、3个event、attribute allowlist、4类correlation mode | `Off` no-op；`Redacted`执行最终attribute gate；historical group原子保留或整体省略 |
| 本文件 §§98~110 | 20个durable profile、commit gate、exact field source和source-missing hard stop | 底层carrier不改；只定义post-Durable observer projection |
| 本文件 §§111~122 | 10类材料、155/155候选覆盖、16项未决裁决 | 全部转为本批final disposition和反向覆盖 |
| Step 6 / 8 / 12 / 14 | safe text、marker、actor accessor、serialized carrier、variant ref、issue mapper、`Off/Redacted` | existing source已足够，不需回开上游类型或配置variant |
| Step 7 exact Port schemas | 7 resolver、audit handoff、event collaboration input/output | business input与observer projection物理分离；wrapper不得捕获args/return |
| SOP Step 15 / 书写规范 §5.14 | 实现切口、安全字段和后续测试承接 | 本批不写告警阈值、backend产品、retention、runbook或测试结果 |

### 123.3 最终投影函数与执行顺序

每个observer plane都必须按同一顺序执行。该顺序是实现约束，不是新Rust API：

```text
business owner forms or loads exact typed source
  -> business validation / authority / commit semantics finish unchanged
  -> read CapabilityDiagnosticMode without formatting business material
  -> Off: return observer no-op before constructing any field
  -> Redacted: select one existing final profile by static owner/trigger
  -> construct only that profile's declared required and present optional sources
  -> apply material disposition and profile-specific allowlist
  -> required source absent/forbidden/unprojectable: reject whole emission
  -> optional source absent/forbidden/unprojectable: omit that field or atomic group
  -> validate closed label/attribute/record schema
  -> invoke sink once
  -> sink failure: at most one independent non-recursive fallback
  -> discard observer-local projection
```

四个关键不变量：

1. gate位于owner完成typed source选择之后、任何backend API调用和serialization之前；backend sanitizer、exporter processor或storage policy不能替代该gate。
2. `Off`路径不得读取、clone、format、hash或serialize可选观测字段；它是observer构造前的no-op，不是“构造完整record后丢弃”。
3. `Redacted`路径采用closed allowlist；表外字段默认reject。禁止先构造whole object / Port request / error chain，再用denylist删除字段。
4. observer outcome不回流business owner。无论profile被省略、拒绝或sink失败，caller-visible result、durability、retry、rollback、receipt、report、capture、handoff和cleanup都保持原结果。

## 124. `Off / Redacted` 最终逐平面行为

### 124.1 Exact mode matrix

| plane | `Off` | `Redacted` | mode切换不得改变 |
|---|---|---|---|
| 60 structured-log profiles | 60/60均不构造、不发射；folded字段也不加入其他record；`L-DIAG-01..06`全部observer no-op | 仅在§§36~38既有trigger成立时，按required/optional和本批redaction gate发射；folded profile仍只并入forming primary | error形成、public issue mapping、startup barrier、protocol disposition、UoW/recovery |
| 48 metric profiles | 48/48 Counter/Histogram observation均不记录；2 Gauge不注册/不刷新，不用zero伪装Off；`MP-DIAG-01..03`也不发射 | 48/48保持§57 exact owner、type、trigger、labels和value；不新增mode label | business count、clock、binding state、complete predicate、retry/action |
| 27 span + 3 fixed events | 27/27 span和3/3 event为process-local no-op；不创建空span、dummy trace或event fallback | 只创建§80 profile并使用§82经本批收窄后的attribute set；fixed event只能存在于owning span或其静态附属记录 | current/historical `TraceId` carrier、future ownership、timeout/cancellation、parent/remote propagation事实 |
| 20 durable-carrier observer projections | 20/20 projection不构造、不交给observer sink；**underlying carrier仍按Step 6~13持久化** | 仅在§99 commit/admission与本批minimum projection同时成立时，一次best-effort投影 | repository write、UoW `Durable`、carrier revision、Query visibility、replay/reentry |
| public typed `Redacted/Forbidden` surface | 不受mode影响，照Step 8/12返回 | 不受mode影响，照Step 8/12返回 | protocol bytes、disposition、issue refs、receipt/report symmetry |

上述mode选择是四个observer plane的统一闭口。它避免“日志关闭但指标泄漏”“span关闭但post-commit object被完整导出”等不一致，也保持Step 14对 `Off` 的定义：no optional diagnostic emission。`Off`不把observer缺席解释为正常、健康或零业务事件；它只表示本进程未发Step 15信号。

### 124.2 Startup config自举规则

raw config尚未形成validated root时，observer不得假定默认mode。`infra/config.rs`只能先把diagnostics token按closed enum独立分类：

| diagnostics候选 | 配置validation的observer行为 | business/startup行为 |
|---|---|---|
| exact `Redacted` | 后续validation可使用`L-INF-01` / `MP-INFRA-*` / `FSP-INF-01`的静态安全字段；不读取raw key/value/path | 继续完整config validation；其它错误仍可阻塞startup |
| exact `Off` | 配置validation及后续Step 15 observer均no-op | 继续完整config validation；mode不掩盖或修复错误 |
| missing / invalid / duplicate / unparseable | 不发任何Step 15 signal，因为不存在合法mode；不得fallback到Redacted或输出bad token | 形成既有safe startup validation failure并阻塞startup |

因此，`L-INF-01`的`redaction_mode`只在diagnostics token本身已合法为 `Redacted`时出现；不存在“为了记录invalid mode而先使用invalid mode”的环路。

### 124.3 Required、optional与atomic group规则

| source结果 | required field | optional / conditional field | atomic group |
|---|---|---|---|
| source存在且最终disposition允许 | 投影exact value | 投影exact value | 全组满足才投影 |
| source正常absent / 尚未形成 | 拒绝整条profile emission | 省略field，不写null/empty/unknown | 整组省略 |
| source存在但variant/profile不允许 | 拒绝整条profile emission | 省略field，并按§131判断是否为observer violation | 整组省略；不得留孤立成员 |
| source mapper / accessor失败 | 拒绝整条profile emission | 省略field；closed technical issue只能由原forming owner观察 | 整组省略 |
| forbidden body/private/raw source被提交给gate | 拒绝整条profile emission | 不投影；按一次redaction violation处理 | 整组拒绝，不读取其余成员 |

`event_key`、metric identifier、span identifier、profile id、static owner和static phase由compile-time profile选择提供，不是从business object提取的fallback。除此以外，required字段不得降级为optional。禁止填入空字符串、`unknown`、`redacted`、zero id、zero timestamp、随机ref、current caller actor或其它profile字段来维持schema。

historical correlation是atomic group：`historical_trace_context_ref + exact carrier ref + correlation_mode=historical_link + exact link_relation`必须一起存在；Job reentry还必须同时有`job_run_ref`。任一成员缺失或被省略时，整组不投影；若所在profile把其中成员列为required，则拒绝整条span，否则span保持current/local correlation而不声称historical link。

## 125. 最终material disposition表

### 125.1 Disposition vocabulary

| disposition | 最终含义 | 实现动作 |
|---|---|---|
| `allow` | source本身就是该profile声明的closed/static/scalar值 | 原样写入exact key，不重命名、不format其它对象 |
| `conditional` | source只有在profile、variant、phase、cardinality与purpose同时满足时可出现 | 先匹配typed branch，再按required/optional规则处理 |
| `project` | whole source禁止，但已有无损、最小typed accessor或字段可投影 | 只调用指定accessor/读取指定field；不得serialize whole source |
| `omit` | source可在business carrier存在，但当前observer purpose不需要 | 不读取、不投影；不是violation，也不写占位 |
| `reject` | 材料不能进入任何Step 15 sink，或调用方试图通过禁止方式构造它 | 在backend前hard stop；按§131去重观察violation |

### 125.2 Ten-class final disposition

| class | final disposition | log | metric | span/event | durable projection | 精确约束 |
|---|---|---|---|---|---|---|
| `RC-STATIC-CLOSED` | `allow` | exact event/profile phase、owner、closed category | exact §57/58 label | exact §82 attribute/event field | exact kind/state/disposition/marker | 只能来自static table或closed mapper；动态string为reject |
| `RC-BOUNDED-SCALAR` | `conditional` | 仅既有profile列出的duration/count/ordinal/version/time | 只允许metric value或已列低基数label；id/version/time不能作label | 仅§82列出的ordinal等；duration不是attribute扩展许可 | version/time及确有purpose的scalar可保留 | 必须由owning clock/carrier/journal产生；不得推断或补当前时间 |
| `RC-CORRELATION-REF` | `conditional` | 仅既有optional/required single ref；每个位置最多该profile声明集合 | `reject` as label | 仅§82 single ref或atomic historical group | 仅§§127~129逐profileminimum refs | 不bulk dump，不erase variant，不从current truth补历史ref |
| `RC-ATTRIBUTION` | `project` | current validated `ActorContext.actor_ref()`仅限`L-APP-02/05`、`L-WKR-03`、`L-JOB-01` | `reject` | `omit` | 仅§129明确的historical carrier-owned `actor_ref()` | whole context、role、scope、token、display text一律reject |
| `RC-SAFE-TEXT` | `omit` for observer | `omit` | `reject` | `reject` | `omit`，只保留closed state/category/ref | safe reason/scope/summary/facet/locator继续留原business carrier/Port/DTO；observer不复制、truncate或hash |
| `RC-INTEGRITY` | `conditional` | `reject` | `reject` | `reject` | 只保留`CFP-STORED-RESULT.surface_digest`与`CFP-EVENT-CAPTURE.schema_ref/candidate_digest` | 只能读existing canonical carrier；不得现场hash；不解释为evidence |
| `RC-DIAGNOSTIC` | `allow/conditional` | closed `error_kind/issue_code/issue_ref`按forming owner | 仅closed `error_family` | 同§82 | typed issue ref集合仅continuity/report profile需要时保留 | deterministic issue ref只分类；generic incident/DiagnosticRef仍为0 |
| `RC-SERIALIZED` | `reject` | reject | reject | reject | reject | bytes、decoded body、whole response/report/envelope永远只留原store/Port |
| `RC-TRANSPORT-PRIVATE` | `reject` | reject | reject | reject | reject | raw config/header/path/endpoint/TLS/credential/topic/cursor/lease/ack/attempt/scheduler handle均无例外 |
| `RC-EXTERNAL-BODY` | `reject` | reject | reject | reject | reject | provider/governance/method/document/audit/runtime/tools/SDK/marketplace正文与receipt/evidence均禁入 |

`RC-SAFE-TEXT=omit`是本批对R15.12 allowlist的受控收窄：safe text仍可合法存在于repository object、public body-free surface或exact business Port input，但当前backend、中转contract和retention均未选择，不能证明自由文本对observer最小必要。实现者不得把省略解释为删除carrier字段。

### 125.3 Always-reject construction methods

即使最终值看似body-free，以下构造方式也一律reject：

- whole-object `Serialize`、`Debug`、`Display`、error source-chain formatting或reflection/middleware argument capture；
- raw body、secret、idempotency key、request bytes、external response、transaction inner value或transport token的hash/truncate/prefix/length；
- 从route、topic、type name、error message、field name、provider code或backend response动态拼接category/ref/event key；
- 用current actor、current time、random id、zero value、另一种ref、日志上下文或backend-generated trace补缺失历史source；
- 先erase `ReferenceSubjectRef` / `CapabilityConsumerRef` / `CapabilityReadSubjectRef` variant再输出opaque inner id；
- 将digest、issue ref、receipt ref、span、observer record或handoff outcome命名为evidence、run、acceptance、delivery truth或approval。

## 126. Structured-log `60/60` 最终redaction规则

### 126.1 Family-by-family final gate

| exact profile set | count | `Redacted`下保留 | 本批新增省略 / project | required失败结果 |
|---|---:|---|---|---|
| `L-API-01..06` | 6 | static phase/owner/outcome、validated operation/schema/category、declared request/trace/result ref与duration | subject ref只保留typed non-sensitive single variant；safe text/body/header全部omit/reject | profile不发；pre-gate optional ref保持absent |
| `L-APP-01..10` | 10 | static operation/flow/outcome/disposition、必要single correlation/result/capture/report ref、closed issue | `actor_ref`仅`L-APP-02/05`从current validated actor project；safe reason、digest、whole actor omit/reject | profile不发；business result继续 |
| `L-UOW-01..08` | 8 | purpose/effect/repository family、resolution/rollback、必要caller ref、closed issue | `transaction_ref`继续reserved-not-emitted；row/version/body/SQL/raw cause reject | profile不发；UoW/recovery继续原语义 |
| `L-PORT-01..06` | 6 | Port/adapter family、typed outcome/disposition、duration、必要single subject/capture/intent/receipt ref | locator/scope/candidate、safe reason、external receipt body omit/reject；wrapper不得镜像args/return | profile不发；Port call/result不变 |
| `L-WKR-01..06` | 6 | source slot/family、lifecycle/outcome、validated source/receipt/capture refs | `actor_ref`只在`L-WKR-03` header/actor gate通过后project；transport-private永远reject | profile不发；receipt action不变 |
| `L-OUT-01..03` | 3 | capture/snapshot/intent single refs、typed collaboration outcome、resolution | candidate/schema digest和serialized envelope不进log；route/delivery lifecycle reject | profile不发；capture/continuation不变 |
| `L-JOB-01..08` | 8 | job/run/ordinal/lifecycle/outcome、必要result/report/capture refs、closed issue | `actor_ref`只在`L-JOB-01` typed admission成功后project；scope/target/report detail/digest omit/reject | profile不发；journal/report/process继续 |
| `L-INF-01..07` | 7 | stage/entry/binding/adapter/category/count/cleanup/duration | raw config/path/endpoint/credential/graph/handle/source chain reject | profile不发；startup failure/cleanup仍执行 |
| `L-DIAG-01..06` | 6 | closed error/issue/category、static failed event key，及已允许的single correlation ref | `L-DIAG-02`不输出field name/value；`L-DIAG-03`不输出backend detail；safe text omit | profile不发；最多按§131另走独立fallback |
| **total** | **60** | existing event key / level / owner / trigger unchanged | no new key or field | **reject emission, never business operation** |

### 126.2 Actor与subject/ref的日志收窄

1. `actor_ref`只在四个既有日志profile中有候选位置：`L-APP-02`、`L-APP-05`、`L-WKR-03`、`L-JOB-01`。前三类application/entry source必须已通过对应actor/metadata gate；不得为拒绝前的malformed actor强行形成ref。其它56个profile的actor emission为0。
2. `subject_ref`只有在profile already names an exact typed subject且该subject是当前owner排障所需的single primary ref时才保留。collection/page subject只保留variant/category，不输出scope inner id；secret、external document、observability/audit variant只保留variant/category，不输出inner ref。
3. governance、method asset、runtime/tools与SDK variant在exact resolver/call owner可输出`variant + one typed inner ref`，但不得输出locator/scope/state reason；它们不表示approval、execution、publication或health。
4. `request_ref/source_event_ref/job_run_ref/result_ref/receipt_ref/report_ref/capture_ref/snapshot_ref/intent_ref`仍逐profileconditional；不得为“统一关联”把同一调用中所有可得ref复制到每条日志。
5. `issue_code`与`issue_ref`可在forming owner同条出现；二者是同一issue分类，不得被下游计为两个incident。

### 126.3 Log gate failure与diagnostic去重

- 正常optional省略、mode=`Off`、pre-gate source absent以及profile未触发都不是redaction violation。
- caller向gate提交`RC-SERIALIZED / RC-TRANSPORT-PRIVATE / RC-EXTERNAL-BODY`、whole actor、forbidden variant inner ref，或表外字段时，原record被拒绝；`Redacted`模式下只允许一次`L-DIAG-02`候选。
- `L-DIAG-02`自身使用fixed `phase=diagnostic_resolution`、owner、`redaction_mode=Redacted`、`outcome=record_rejected`、existing `RedactedBoundary` code/ref；不得包含被拒profile key、field name、value、length、source path或subject ref。
- 若`L-DIAG-02` required source也无法安全形成，则静默放弃该diagnostic。不得为了观察redaction failure而放宽同一个gate。

## 127. Metric `48/48` 与 span/event `27/27 + 3/3` 最终规则

### 127.1 Metric final gate

48个metric在 `Redacted` 下原样使用§57/58的identifier、instrument、trigger、label key和closed value。最终规则如下：

| profile group | count | final material | mode/gate consequence |
|---|---:|---|---|
| `MP-ENTRY-01..03` | 3 | static protocol/entry/outcome + numeric duration | identity/ref/body absent；invalid label拒绝该sample |
| `MP-APP-01..05` | 5 | static protocol/operation group/disposition/error family + duration | actor/subject/reason/flow id永不进入label |
| `MP-IDEM-01` | 1 | closed mutually-exclusive classification | key/hash/digest/result ref/attempt永禁 |
| `MP-UOW-01..04` | 4 | static phase/purpose/resolution/repository family + duration | transaction/ref/SQL/effect body永禁 |
| `MP-PORT-01..06` | 6 | static Port/adapter/outcome/error family + duration | subject/locator/intent/audit/external code永禁 |
| `MP-WORKER-01..06` | 6 | six exact source pairs、lifecycle/outcome + duration | source event/transport cursor/actor永禁 |
| `MP-OUT-01..04` | 4 | static event/material/phase/outcome + duration | capture/snapshot/intent/digest/route永禁 |
| `MP-JOB-01..08` | 8 | static job/phase/disposition/error family + duration/count value | run/target/report/scope identity永禁 |
| `MP-INFRA-01..06` | 6 | stage/entry/binding/Port family/outcome + duration/Gauge value | raw config/adapter concrete identity/endpoint永禁 |
| `MP-MAT-01..02` | 2 | job/material/disposition/error family + duration | report/material ref、finding/reason/source set永禁 |
| `MP-DIAG-01..03` | 3 | fixed technical/redaction/sink categories | raw cause、field/value、failed record body永禁；non-recursive only |
| **total** | **48** | **34 Counter + 12 Histogram + 2 Gauge unchanged** | **Off=0 emission;Redacted=closed schema only** |

metric mapper产生未知key、未知closed value、缺失required label或forbidden label时，拒绝当前sample；不得把值映射为`unknown/other`。若失败本身是caller提交forbidden material，`MP-DIAG-02`最多计一次；普通mapper defect只由原typed error owner观察。metric sink failure只在独立non-recursive counter channel存在时计`MP-DIAG-03`，且`MP-DIAG-03`不能观察自身。Gauge source不可读时整组不刷新；不得写0表示Off、missing或failure。

### 127.2 Span attribute final narrowing

§82的27个allowlist继续是上限，本批应用以下统一收窄：

- static/closed required attribute和closed outcome/error/issue保持`allow`；`duration`不新增为span attribute。
- current invocation的request/source/job/trace ref按§82保留；`subject_ref`执行与日志相同的variant-aware规则，secret/document/audit只保留variant category，不输出inner id。
- whole actor、actor ref、safe text/reason/scope/summary/facet/locator、digest、schema body、serialized material全部从27/27 span中移除。
- `FSP-PORT-01..03`只描述Hub local callsite；不读取Port request/return object，不注入remote context，不记录external receipt body。
- historical group必须满足§124.3原子规则。不存在matching stored result/receipt/report/snapshot/capture/journal时不形成link，也不生成replacement trace。
- `transaction_ref`继续0；backend-generated span id/trace id不得写回domain、carrier、protocol或log schema。

### 127.3 Three fixed span events

| event | `Redacted` final fields | omit/reject | required失败 |
|---|---|---|---|
| `capability-hub.worker.source-cycle` | `source_slot`, `source_family`, closed `outcome`; failure时closed `error_kind/issue_ref` | topic/partition/offset/lease/ack/body | 不写该event；owning span可继续 |
| `capability-hub.jobs.residual-drain` | `job_run_ref`, closed `lifecycle_state/outcome`; failure时closed `error_kind/issue_ref` | scheduler/attempt/report body/safe reason | 不写该event；owning span可继续 |
| `capability-hub.infra.stage` | `stage`, `entry_kind`, closed `outcome`;optional `binding_state/cleanup_outcome/issue_ref` | raw config/path/graph/handle/endpoint | 不写该event；owning span可继续 |

backend不支持span event时，静态附属记录仍受同一mode、field gate和non-recursive failure规则；不能因此绕过structured-log profile表或制造第四个event。

## 128. Durable projection `20/20`:accepted与operations minimum

本节字段是post-Durable observer projection，不是底层carrier schema删改。所有safe text、whole actor和bulk set即使仍合法保存在repository，也不进入observer projection。

### 128.1 Accepted profiles `8/8`

| profile | `Redacted` required minimum | conditional minimum | omitted from R15.12 candidate field list |
|---|---|---|---|
| `AFP-CHANGE-IDENTITY` | change record id、capability identity id、change kind、previous/next state、trace id、recorded_at | carrier-owned actor ref | related identity ref set、change reason、whole actor、identity body |
| `AFP-CHANGE-REGISTRY` | registry change record id、registry entry id、change kind、previous/next state、trace id、recorded_at | carrier-owned actor ref | change reason、whole actor、listing/search body |
| `AFP-CHANGE-DESCRIPTOR` | descriptor change record id、adapter descriptor id、change kind、previous/next state、boundary marker、trace id、recorded_at | carrier-owned actor ref | change reason、whole actor、descriptor/secret/provider body |
| `AFP-CHANGE-GOVERNANCE-SEAM` | seam change record id、relation id、change kind、previous/next state、trace id、recorded_at | carrier-owned actor ref | change reason、whole actor、approval/Policy/workflow body |
| `AFP-CHANGE-METHOD-RELATION` | method relation change record id、relation id、change kind、previous/next state、trace id、recorded_at | method asset ref variant + one typed ref；carrier-owned actor ref | change reason、whole actor、method body/package |
| `AFP-CHANGE-EXPOSURE` | exposure change record id、formal exposure id、change kind、previous/next state、trace id、recorded_at | carrier-owned actor ref | change reason、whole actor、runtime/SDK/marketplace body |
| `AFP-TRACEABILITY` | traceability record id、trace subject variant + primary ref、traceability state、trace id、version、recorded_at、updated_at | superseded-by single ref；carrier-owned actor ref | source/handoff ref sets及其count、trace/gap reason、whole actor、external receipt/evidence |
| `AFP-IMPACT` | impact fact id、traceability record ref、change subject variant + primary ref、impact state、trace id、version、created_at、updated_at | carrier-owned recorded-by actor ref | impact scope、consumer set及其count、state reason、whole actor、execution/cost body |

六类append-only change record仍没有`version`，不得为projection补造。当前 `CapabilityIdentityRefSet`、`CapabilityChangeRecordRefSet`、`TraceabilityHandoffRefSet` 与 `CapabilityConsumerRefSet` 都没有公开 `iter()` / `len()`；因此本表不授权 related/source/handoff/consumer count。实现不得读取private tuple field、借底层 `CapabilityTypedSet::iter()`、serialize/Debug整个set或为observer新增accessor；这些set及其cardinality均直接omit。

### 128.2 Operations / derived profiles `7/7`

| profile | `Redacted` required minimum | conditional minimum | omitted / variant rule |
|---|---|---|---|
| `OFP-REFERENCE-RESOLUTION` | resolution state id、reference kind、resolution value、trace id、state version、created/last-checked time | reference subject按§130；matching concrete ref variant + id和object version；carrier-owned checked-by actor ref | resolution reason、locator、provider status、generic cursor |
| `OFP-DOWNSTREAM-IMPACT-SUMMARY` | impact summary id、impact fact ref、feedback state、trace id、version、observed/updated time | consumer ref按§130；source feedback ref；carrier-owned accepted-by actor ref | observation、gap/state reason、whole actor、downstream body |
| `OFP-CONTROLLED-CONSUMER-VIEW` | consumer view id、formal exposure id、freshness state、version、created/refreshed time | consumer ref按§130 | descriptor summary、whole source version set及其count、runtime/SDK body |
| `OFP-DIRECTORY-PROJECTION` | projection id、freshness state、version、created/refreshed time | three source ref variants + exact refs | display summary、facets、source version set及其count、state reason、marketplace/index body |
| `OFP-AUDIT-EXPORT` | export summary id、traceability record ref、export state、version、created/refreshed time | `observability_ref_count`按§129.2；无其它set count | export scope、allowed summary、ref成员、source version set及其count、audit/GRC/evidence body |
| `OFP-ECOSYSTEM-DISCOVERY` | ecosystem summary id、formal exposure ref、freshness state、version、created/refreshed time | ecosystem consumer variant + one typed ref | discoverability summary、source version set及其count、state reason、listing/fulfilment body |
| `OFP-RECONCILIATION-REPORT` | report id、report state、job run id、trace id、fixed version、generated_at | carrier-owned generated-by actor ref | reconciliation scope、finding/failure reason、source truth/material/source-version sets及其counts、report/evidence body |

`OFP-REFERENCE-RESOLUTION`的secret、document和observability/audit subject遵守高风险规则：observer只输出`reference_kind`与`resolution_value`，省略subject inner id和matching concrete ref id；其它五类reference variant可输出`variant + one exact typed id`。该省略不影响canonical reference object/state保存或Query surface。

`ConsumerViewSourceVersionSet`、`DerivedMaterialSourceVersionSet`、`AccessTruthRefSet` 与 `DerivedMaterialRefSet` 当前同样没有公开稳定迭代或长度读取能力，不能形成source-version、source-truth或material count。`ObservabilityAuditRefSet` 是本组唯一例外：它已有公开稳定 `iter()`，仅允许形成§129.2固定的 `observability_ref_count`，仍不得输出成员。

## 129. Durable projection `20/20`:continuity minimum

### 129.1 Continuity profiles `5/5`

| profile | `Redacted` required minimum | conditional minimum | omitted / rejected |
|---|---|---|---|
| `CFP-STORED-RESULT` | result ref、result kind、original disposition、surface ref、surface digest、historical trace id、stored_at | none | serialized surface、decoded response/receipt/report、current truth reconstruction |
| `CFP-INBOUND-RECEIPT` | consumer name、source event ref、result ref、disposition、surface ref、historical trace id、stored_at、`changed_reference_subject_count`、`reference_state_count`、`downstream_summary_count`、`affected_material_count` | closed marker set、follow-up marker set、typed issue refs | changed ref成员、payload/transport cursor、receipt body、safe text |
| `CFP-EVENT-CAPTURE` | capture id、source variant + primary ref、snapshot id、schema ref、candidate digest、capture state、version、captured/updated time、matching snapshot trace id | collaboration intent ref only for`IntentBound` | serialized envelope、route/attempt/delivery status、current truth remap |
| `CFP-JOB-JOURNAL` | operation/job name、schema version、run id、historical trace id、execution state、version、planned/updated time | current terminal target ordinal + target variant/primary ref + closed outcome；typed run issue refs；final result ref/finalized_at；carrier-owned actor ref | whole target plan/history set、request digest、key、scope/body/scheduler/attempt |
| `CFP-JOB-REPORT` | result ref、operation/job name、schema version、run id、surface ref、disposition、matching historical trace id/time、`reconciliation_report_count`、`changed_material_count`、`changed_reference_state_count`、`collaboration_status_count`、`failed_target_count`、`skipped_target_count` | typed issue refs | typed report item/detail body、all ref成员、serialized surface、external status body、evidence/sign-off |

`CFP-STORED-RESULT.surface_digest`与`CFP-EVENT-CAPTURE.schema_ref/candidate_digest`是唯一保留的integrity projection。前者支撑exact stored shell/surface symmetry，后者支撑snapshot/capture/collaboration candidate symmetry；它们必须来自existing canonical carrier，不得由observer重算。任何下游不得把digest解释为payload proof、signature、evidence alias或acceptance。

### 129.2 Closed count key / source table

下列11行是20个durable projection允许形成的全部count key。10个Step 8 public `Vec` key在对应receipt/report profile发射时都是required，即使长度为`0`也必须输出；`observability_ref_count`仅在`observability_refs=Some`时conditional出现。表外set即使存在于carrier，也没有count投影许可。

| profile | exact observer key | exact readable source | absent / forbidden handling |
|---|---|---|---|
| `OFP-AUDIT-EXPORT` | `observability_ref_count` | `observability_refs: Option<ObservabilityAuditRefSet>`为`Some`时，仅调用既有`ObservabilityAuditRefSet::iter().count()` | `None`时omit；不得输出成员或从source version推断 |
| `CFP-INBOUND-RECEIPT` | `changed_reference_subject_count` | `CapabilityInboundEventReceipt.changed_reference_subject_refs.len()` | public `Vec`始终可读；输出exact长度，包括`0` |
| `CFP-INBOUND-RECEIPT` | `reference_state_count` | `CapabilityInboundEventReceipt.reference_state_refs.len()` | public `Vec`始终可读；输出exact长度，包括`0` |
| `CFP-INBOUND-RECEIPT` | `downstream_summary_count` | `CapabilityInboundEventReceipt.downstream_summary_refs.len()` | public `Vec`始终可读；输出exact长度，包括`0` |
| `CFP-INBOUND-RECEIPT` | `affected_material_count` | `CapabilityInboundEventReceipt.affected_material_refs.len()` | public `Vec`始终可读；输出exact长度，包括`0` |
| `CFP-JOB-REPORT` | `reconciliation_report_count` | `CapabilityJobReport<T>.reconciliation_report_refs.len()` | public `Vec`始终可读；输出exact长度，包括`0` |
| `CFP-JOB-REPORT` | `changed_material_count` | `CapabilityJobReport<T>.changed_material_refs.len()` | public `Vec`始终可读；输出exact长度，包括`0` |
| `CFP-JOB-REPORT` | `changed_reference_state_count` | `CapabilityJobReport<T>.changed_reference_state_refs.len()` | public `Vec`始终可读；输出exact长度，包括`0` |
| `CFP-JOB-REPORT` | `collaboration_status_count` | `CapabilityJobReport<T>.collaboration_statuses.len()` | public `Vec`始终可读；输出exact长度，包括`0`，不输出external status body |
| `CFP-JOB-REPORT` | `failed_target_count` | `CapabilityJobReport<T>.failed_targets.len()` | public `Vec`始终可读；输出exact长度，包括`0`，不输出target/issue detail |
| `CFP-JOB-REPORT` | `skipped_target_count` | `CapabilityJobReport<T>.skipped_targets.len()` | public `Vec`始终可读；输出exact长度，包括`0`，不输出target/issue detail |

读取接口闭包如下：

- `CapabilityIdentityRefSet`、`CapabilityChangeRecordRefSet`、`TraceabilityHandoffRefSet`、`CapabilityConsumerRefSet`、`ConsumerViewSourceVersionSet`、`DerivedMaterialSourceVersionSet`、`AccessTruthRefSet` 与 `DerivedMaterialRefSet` 没有公开稳定 `iter()` / `len()`；成员与count全部omit，不回开Step 6增加observer-only accessor。
- `ObservabilityAuditRefSet`已有公开稳定`iter()`，但只授权上表单个count key；不得把迭代能力扩大为member projection。
- `CapabilityProtocolValidationIssueRefSet`已有公开稳定`iter()`，所以§§128~129明确列出的typed issue refs可按stored order投影；它不是count source，不得转成generic issue count、incident id或detail。
- receipt markers / follow-up markers与上述10个receipt/report vector都是Step 8公开字段；marker仅按closed variant stable order投影，ref/detail vector仅按上表取`len()`，不得输出成员。

### 129.3 Actor、set与time统一规则

1. historical attribution只允许从同一durable carrier的`actor_context / recorded_by / accepted_by / checked_by / generated_by`调用既有`actor_ref()`；current invocation actor不得补缺失值或覆盖stored actor。
2. `actor_ref()`是高基数关联值，只在§§128~129明确列出的profile conditional出现；它不进入metric、span或external handoff，也不表示authorization decision。
3. set默认不输出成员。只有§129.2的11个exact key可从对应公开读取面形成count；typed issue refs和closed marker set按本节已证明的stable iterator/order投影。任何其它subject/ref set、source-version set、target detail set既不bulk输出，也不形成count。
4. version与timestamp只复制carrier field；不得用observer clock补齐。required time/version缺失表示carrier/profile不对称，整条projection拒绝，并由原consistency owner处理。
5. 20个profile均要求post-Durable admission。`Unknown/NotDurable`、duplicate replay、Query、request-local Port outcome、source asymmetry、missing sidecar或no-op均不能因redaction投影需要而生成profile。

## 130. Variant-aware reference与issue最终规则

### 130.1 Reference / consumer / read subject projection

| union / variant | runtime log/span | durable projection | external observer/handoff | 禁止解释 |
|---|---|---|---|---|
| local capability truth/change/trace/impact/material | profile所需时`variant + one primary typed ref` | profile所需时保留exact variant/ref；set成员省略，count仅限§129.2 closed table | 只能进入已声明body-free handoff input，不由Step 15扩张 | whole object、relationship graph、current truth reconstruction |
| external MCP/A2A/API source | exact resolver/capture profile可`variant + one ref` | reference/capture profile可保留exact source ref | business Port原输入不变；observer不输出locator | provider identity/health/route/quota/cost/result |
| governance result | exact resolver/relation profile可`variant + one ref` | reference/change relation profile可保留exact ref | handoff不得升级approval | approval、Policy、vote、workflow、ack |
| method asset | exact resolver/relation profile可`variant + one ref` | relation/reference profile可保留exact ref | 不输出locator/body | method source/package/lifecycle/execution |
| secret | variant/category only，inner ref omit | reference resolution只保留kind/value，inner ref omit | business SecretReferencePort照常接收exact ref；observer/handoff不复制 | value、path、provider、credential validity、rotation |
| external document | variant/category only，inner ref omit | reference resolution只保留kind/value，inner ref omit | business Port照常；observer不复制 | document/OpenAPI/schema/guide body或correctness |
| runtime/tools consumer | exact owner可`variant + one ref` | 仅profile声明的single ref；consumer set/count omit | 不经Step 15创建downstream execution call | execution、authorization、cache、tool result |
| SDK consumer | exact owner可`variant + one ref` | 仅profile声明的single ref；consumer set/count omit | 不经Step 15发布client/package | SDK response、package/publication truth |
| observability/audit | variant/category only，inner ref omit；`C23` local handoff log按§130.2例外 | audit export仅`observability_ref_count`；reference resolution仅kind/value；inner ref omit | exact business handoff仍可获得validated audit ref；observer不得复制 | raw telemetry/audit/GRC body、external acceptance/evidence |

variant必须使用closed enum mapper输出，inner id使用该variant自有typed accessor；不允许把不同variant格式化成同一个裸`subject_ref`字符串。collection subject不输出inner scope id，只输出collection variant。

### 130.2 Handoff与event collaboration例外

`C23 -> handoff_traceability(...)`仍是唯一audit handoff caller。business Port必须获得exact committed traceability revision、validated audit ref和body-free scope；Step 15只允许：

- `L-PORT-03 / MP-PORT-03 / FSP-PORT-02`记录static handoff/Port family、typed disposition、traceability ref和closed issue；audit ref inner id、scope text、external receipt body均omit/reject。
- request-local `CapabilityAuditHandoffOutcome`不进入20个durable profile，不创建repository、delivery state、evidence或acceptance。
- `C13/C14` handoff caller仍为0；`handoff_audit_export(...)` caller/emission仍为`0/0`。

event collaboration保持两个完全分离的构造面：

```text
business path: complete stored candidate/snapshot -> exact collaboration Port
observer path: static family/outcome + capture/snapshot/intent refs -> redaction gate
```

observer wrapper不得borrow/clone/serialize/Debug complete candidate，也不得从Port return读取raw status、route、receipt body、attempt、lease或ack。Phase B outcome仍request-local；只有Phase A capture或Phase C intent-bound revision在local UoW `Durable`后进入`CFP-EVENT-CAPTURE`。

### 130.3 Issue、legal redaction与violation去重

| occurrence | semantic owner | allowed observation | explicitly zero |
|---|---|---|---|
| legal `BodyForbidden/RedactedBoundary` protocol/domain result | forming API/application/Port/Query owner | existing primary log/span fields + semantic metric owner；existing issue code/ref | `L-DIAG-02`, `MP-DIAG-02` |
| observer optional field正常省略 | profile redaction gate | no diagnostic | all violation logs/metrics |
| observer提交forbidden material | redaction gate | one `L-DIAG-02` candidate and one `MP-DIAG-02` candidate inRedacted mode, each through independent non-recursive path | duplicate semantic `BodyForbidden`, field/value/hash |
| raw/error/source mapper不能形成safe issue | original error owner | closed `error_kind` if already available | synthetic issue ref、genericDiagnosticRef |
| duplicate replay with stored issues | stored result/receipt/report owner | copy exact stored typed refs only | fresh mapper、new incident/ref |

`CapabilityProtocolValidationIssueRef`继续由fixed code deterministic构造，只分类，不定位实例。它不能承载subject、field、run、trace、timestamp或adapter identity，也不能作为observer incident id、evidence alias、receipt或acceptance signature。

## 131. Repository / UoW / Port / observer hard-stop优先级

### 131.1 Boundary implementation contract

| boundary | allowed construction | hard stop before observer | sink failure consequence |
|---|---|---|---|
| repository adapter | explicit static repository family/purpose/outcome + profile-declared single typed ref | no entity/row/page serialization；no SQL/table/connection/replica/lock/debug | repository/business result不变；fallback最多一次 |
| UoW / commit authority | phase/resolution/rollback + existing caller ref；`transaction_ref=0` | no transaction inner value、staged effects、backend cause或row inference | commit/rollback precedence不变；observer不能resolve Unknown |
| API / Worker / Jobs entry | validated closed metadata and typed surface category | no raw bytes/header/scheduler/source cursor/whole actor | dispatch/future/receipt/report ownership不变 |
| seven resolver Ports | static Port/adapter family、typed outcome、one permitted subject variant | no locator/scope/candidate、raw request/return/status/body | Port retry/result不变；no provider health claim |
| audit handoff | static handoff family、typed outcome、traceability ref、closed issue | no scope/audit inner ref/receipt body/evidence | local truth不回滚；outcome不持久化 |
| event collaboration | static event/phase/outcome + capture/snapshot/intent refs | no candidate/envelope/route/status/attempt/lease/ack | no repeat call；no local delivery truth |
| durable carrier owner | profile-specific explicit field reads afterDurable | no whole carrier serialization、safe-text body、bulk ref set | carrier/revision不变；projection不是reliable delivery |
| observer facade/backend | already-redacted static schema only | no original object、Port args/return、error source、business future | non-recursive fallback only；no observer retry state |
| downstream consumer | onlyexisting declared handoff/reference surface | no raw telemetry/audit/archive/evidence package invented by Hub | consumer absence/failure不改变Hub truth |

### 131.2 Hard-stop precedence

从高到低的唯一优先级如下：

1. **Business semantics first**：完成或保留当前Step 6~14 business result、authority、commit/recovery、receipt/report/capture/handoff/retry/cleanup语义；observer永不抢占其error precedence。
2. **Mode gate**：`Off`立即observer no-op；不构造字段，也不产生redaction/sink diagnostic。
3. **Profile admission**：`Redacted`下只有exact owner/trigger/admission成立才选择profile；未触发不是failure。
4. **Source and boundary gate**：先拒绝whole object/raw/private/external body，再执行required/optional与atomic-group规则；不得访问被拒材料的format/hash/length。
5. **Primary emission**：使用static schema调用对应sink一次；observer不得拥有retry loop、queue、outbox、DLQ、attempt或durable receipt。
6. **Redaction violation fallback**：仅当调用者实际提交forbidden material时，尝试一次不含field/value/profile body的`L-DIAG-02/MP-DIAG-02`；normal omission不触发。
7. **Sink failure fallback**：若存在与失败sink完全独立的non-recursive channel，最多一次`L-DIAG-03`或`MP-DIAG-03`；否则静默结束observer path。
8. **Recursion stop**：任何diagnostic/fallback自身失败立即停止；不得观察自身、panic、rollback、重调business Port或改变caller outcome。

同一次primary record若同时遇到redaction violation与sink failure，redaction gate先拒绝，primary sink尚未调用，因此只存在redaction violation候选，不得再计sink failure。primary通过gate但sink失败时只存在sink failure候选，不得改计redaction violation。

## 132. `RD-01..RD-16` 最终裁决

| decision | final answer | canonical section |
|---|---|---|
| `RD-01` | `Off`抑制60/48/27/20全部observer emission；`Redacted`按final schema发射；business surface全不受mode影响 | §124.1 |
| `RD-02` | gate在owner typed source之后、backend之前；required失败拒整条，optional失败省略，atomic group整体省略/拒绝 | §§123.3,124.3 |
| `RD-03` | 10类材料已逐项裁决为allow/conditional/project/omit/reject | §125.2 |
| `RD-04` | 60 logs的required/optional与mode/source absent已统一闭口；无placeholder/fallback | §§124.3,126 |
| `RD-05` | 48 metrics两mode、mapper/gate/sink failure和Gauge no-refresh已闭口；identifier/label/type不变 | §127.1 |
| `RD-06` | 27 span与3 event已收窄；whole actor/text/digest/body禁入，historical group保持原子 | §§127.2~127.3 |
| `RD-07` | 20 durable projection已收敛为exact minimum；carrier schema和persistence不改 | §§128~129 |
| `RD-08` | whole actor永禁；四个runtime log可project current validated actor ref；明确durable profile可projectcarrier-owned actor ref；span/metric/handoff省略 | §§125.2,126.2,129.3 |
| `RD-09` | generic subject/reference必须variant-aware；secret/document/audit省略inner id，collection仅variant | §130.1 |
| `RD-10` | safe reason/scope/summary/facet/locator全部留原business carrier/Port/DTO，observer省略 | §§125.2,128~129 |
| `RD-11` | integrity仅保留stored result surface digest与event capture schema/digest；serialized bytes永禁 | §§125.2,129.1 |
| `RD-12` | legal Redacted surface与observer violation分owner去重；issue ref只分类，genericDiagnosticRef=0 | §130.3 |
| `RD-13` | repository/UoW/Port仅explicit projection；middleware args/return/raw cause capture硬拒绝；transaction ref仍0 | §131.1 |
| `RD-14` | audit handoff/event collaboration的business input与observer projection采用独立构造面；reachability不变 | §130.2 |
| `RD-15` | business -> mode -> admission -> source gate -> primary -> violation/sink fallback -> recursion stop优先级固定 | §131.2 |
| `RD-16` | Step 16/19/04/07 handoff已列明且未提前创建后续产物 | §134 |

16/16 decision只出现一次并全部有final answer。不存在留给实现者自行选择的redaction disposition、mode行为、required-field fallback或observer retry策略。

## 133. 155/155 final profile反向覆盖

### 133.1 Plane arithmetic

| plane | existing final profile count | mode rule | field gate / minimum source | classified in R15.14 | missing | extra |
|---|---:|---|---|---:|---:|---:|
| structured log | 60 | §124.1 | §126 | 60 | 0 | 0 |
| metric | 48 | §124.1 | §127.1 | 48 | 0 | 0 |
| span | 27 | §124.1 | §127.2 | 27 | 0 | 0 |
| durable projection | 20 | §124.1 | §§128~129 | 20 | 0 | 0 |
| **total** | **155** | one `Off/Redacted` contract | ten-class final disposition | **155** | **0** | **0** |

附属span event单独审计为3/3，未计入155个profile算术。60 logs的profile family算术仍为`6+10+8+6+6+3+8+7+6=60`；48 metrics仍为`3+5+1+4+6+6+4+8+6+2+3=48`；27 spans仍为`2+5+3+4+3+3+3+3+1=27`；20 durable仍为`8 accepted + 7 operations/derived + 5 continuity`。

### 133.2 Final invariants audit

| check | expected | actual | result |
|---|---:|---:|---|
| `RD-*` final decisions | 16 | 16 | pass |
| material classes with disposition | 10 | 10 | pass |
| mode variants | 2 | 2 (`Off`,`Redacted`) | pass |
| log / metric / span / durable profile rename or count delta | 0 | 0 | pass |
| actor whole-context emission | 0 | 0 | pass |
| metric labels containing id/ref/trace/actor/body/digest | 0 | 0 | pass |
| runtime log/span safe-text emission | 0 | 0 | pass |
| serialized/private/external-body sink admission | 0 | 0 | pass |
| generic accepted source cursor | 0 | 0 | pass |
| durable count key / readable source pair | 11 | 11 | pass |
| count projected from wrapper without public reader | 0 | 0 | pass |
| genericDiagnosticRef / observer incident id | 0 | 0 | pass |
| `transaction_ref` emission | 0 | 0 | pass |
| `C23` handoff caller | 1 | 1 | pass |
| `C13/C14` handoff caller | 0 | 0 | pass |
| `handoff_audit_export(...)` caller/emission | `0/0` | `0/0` | pass |
| business carrier/flow change caused by mode | 0 | 0 | pass |
| new Rust declaration / field / comment delta | `0/0/0` | `0/0/0` | pass |
| unresolved upstream blocker | 0 | 0 | pass |

该表是设计token、profile和规则的静态反向审计，不是实现代码scan、backend运行、测试结果、性能数据、evidence或验收签署。

## 134. 后续Step / 文档handoff（只交接，不提前创建）

### 134.1 Step 16 testing handoff

Step 16必须从本批提取测试切口，但当前不创建 `03_ddd_step_16_test_cuts.md`：

- 两mode对60/48/27/20 profile的zero/exact emission矩阵；Off路径不得访问field accessor或sink。
- required absent/reject整条、optional absent/forbidden省略、historical group原子性、no-placeholder性质测试。
- 10类material disposition与whole-object/Debug/Display/hash/truncate/middleware capture负向测试。
- actor current-vs-historical source、variant-aware secret/document/audit inner-id omission、safe-text omission、两类digest唯一保留测试。
- 11个closed count key逐项验证exact公开source与零值；8类无reader wrapper验证成员/count均omit且不增加observer-only accessor。
- legal Redacted surface与observer violation去重、redaction-before-sink、sink failure non-recursion和observer zero-business-effect测试。
- 155/155 profile inventory、48 label schema、27 span allowlist、20 post-Durable admission的静态契约测试。

这些只是待验证契约，不声称测试已实现或通过。

### 134.2 Step 19 formal assembly handoff

正式§14装配时必须引用本文件，并将本批内容压缩为：mode总表、required/optional gate、material disposition、60/48/27/20 final table的redaction注释、durable minimum projection、11个closed count key/source、handoff/collaboration分离和hard-stop优先级。不得把R15批次状态、候选类推导、stop-review文本或机械过程日志写入正式正文；正式 `03-详细设计.md` 当前仍不修改。

### 134.3 `04-配置设计.md` handoff

`04`后续必须闭合 `CapabilityDiagnosticMode` raw key、source precedence、default、environment/profile availability、invalid/unknown handling、cold/hot update政策，以及具体observer sink/backend/exporter配置。必须保持：only `Off/Redacted`、invalid mode阻塞startup、Off不注册/刷新observer、Redacted使用本批固定schema、raw secret/config/endpoint不进入diagnostic。选择具体crate/backend前须按§88受控回开Step 14 dependency matrix；本批不选择产品或版本。

### 134.4 `07-实施计划.md` handoff

`07`后续必须为observability facade、四plane binding、redaction gate、explicit projection、non-recursive fallback和155-profile static verification安排planned boundary；必须把backend选择/Step 14 controlled reopen、Step 16测试切口和`04`配置前置写入实施顺序。implementation ledger与全部planned boundary skeleton只在完成正式 `07` 时同步创建，本批不提前创建。

## 135. R15.14自检与stop-review snapshot

### 135.1 Cross-step与专项边界

| boundary | R15.14 final result | reopen needed |
|---|---|---|
| Step 6 object / actor / safe-text / serialized carrier | existing accessor/field足够；无reader的8类set不投影count，`ObservabilityAuditRefSet.iter()`只供一个closed count key；不改object | no |
| Step 7 repository / UoW / external Port | exact business signature不改；explicit observer projection禁止wrapper capture | no |
| Step 8 protocol/public surface | legal Redacted/Forbidden不受mode影响；DTO不加observer字段 | no |
| Step 9 / 10 flow/state | 83 flow、24/111 state baseline与handoff reachability不改 | no |
| Step 11 / 13 durability/reentry | 20 profile仍post-Durable；observer不参与recovery/idempotency | no |
| Step 12 error/issue | 17/51复用；deterministic issue ref只分类；raw source禁入 | no |
| Step 14 mode/binding | onlyOff/Redacted足够；backend选择仍为未来controlled reopen | no current blocker |
| capability identity/registry/descriptor | typed primary ref/state only；no body/provider/runtime/listing | pass |
| governance/method/SDK/runtime/tools | ref不升级approval/body/execution/publication | pass |
| observability/audit/event collaboration | business input与observer projection分离；no evidence/delivery truth | pass |

旧README、旧正式 `03/05/06`、provider/cost/runtime/tools/generic audit ledger、Full/Verbose、raw dump、outbox/relay/DLQ/attempt和evidence主线均未重新进入。historical-material reintroduction=`0`。两项L0-core design-sync debt保持non-blocking；unresolved upstream blocker=`0`。

### 135.2 Artifact与声明边界

| item | R15.14 result |
|---|---|
| modified calibration artifact | 本文件追加§§123~135并更新顶部状态/批次表 |
| formal `03-详细设计.md` | not modified；Step 19前仍是historical material |
| formal `04-配置设计.md` | not created / modified |
| Step 16 / R15.15 / R15.16 | not created or entered |
| implementation ledger / planned boundary skeleton | not created |
| Rust declarations / structs / fields / variants / comments | delta=`0/0/0`；无结构体注释遗漏 |
| implementation/test/run/evidence/sign-off | none claimed |
| commit | not requested and not created |

### 135.3 Stop-review snapshot

| item | stop-review state |
|---|---|
| current formal document | `03-详细设计.md`；未修改，等待Step 19 assembly |
| current calibration artifact | `03_ddd_step_15_observability_audit.md` |
| completed batch | `R15.14 redaction:再写入` |
| batch status | `03_step_15_r15_14_completed_stop_review` |
| decisions | `RD-01..RD-16 = 16/16 final` |
| profile closure | `60 log + 48 metric + 27 span + 20 durable = 155/155`；3 fixed span events另为3/3 |
| mode closure | `Off`全部observer no-op；`Redacted` exact schema；business surface unchanged |
| field closure | required拒整条、optional省略、atomic group整体处理；无placeholder/hash fallback |
| count closure | 10个public `Vec` required count（含零值）+ 1个optional-set conditional count均有existing public reader；8类无reader wrapper的member/count投影为0 |
| sensitive closure | whole actor/text/body/private/external material拒绝或省略；variant ref/digest/issue最小投影及11个closed count key/source已固定 |
| observer failure | business first；redaction before sink；最多一次non-recursive fallback；recursion stop |
| upstream blocker | none |
| non-blocking debt | 两项L0-core design-sync debt不变；backend选择仍需未来受控回开Step 14 |
| next batch | 用户确认后仅 `R15.15 cross-step closure:先思考` |
| commit | 当前不需要；未经明确要求不提交 |

本批完成后停止在R15.14 review gate。不得自动进入R15.15、R15.16、Step 16或正式文档装配。

### 135.4 R15.15 entry gate

```text
document = 03-详细设计.md
step = 15
completed_batch = R15.14 redaction:再写入
status = completed_stop_review
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_15
next_batch = R15.15 cross-step closure:先思考
allowed_scope_after_confirmation = reread Step 6~14 and R15.3~R15.14 final contracts; audit duplicate owners, phase boundaries, 83-flow / 17-error / 51-issue / 155-profile cross-step consistency, historical exclusions and formal-source gaps; write thinking artifact only
must_reread_before_next_batch = this file §§19~29, §§41~46, §§60~63, §§86~90, §§105~110, §§123~135; Step 6~14 final closure sections; detailed-design SOP Step 15 and writing standard §5.14
forbidden_until_next_gate = R15.16 final closure, formal 03 assembly, 04, Step 16+, implementation ledger, planned boundary skeleton, code, tests, run_id, evidence, sign-off, commit
unresolved_upstream_blocker = none
```

## 136. R15.15 cross-step closure：授权、读取闭包与思考边界
### 136.1 授权与本批输出边界
用户已明确确认从 `03_step_15_r15_14_completed_stop_review` 进入 `R15.15 cross-step closure:先思考`。本批只对 Step 6~14 与 R15.3~R15.14 的 final contract 做独立交叉审计，形成重复 owner、phase boundary、反向覆盖、历史材料和正式装配缺口的候选结论；不把候选直接升级为 R15.16 最终 closure 表或正式 §14 source map。

本批继续执行以下边界：

1. 不修改正式 `03-详细设计.md` 或创建 `04-配置设计.md`。
2. 不创建 Step 16、implementation ledger、planned boundary skeleton或实现代码。
3. 不新增 `ObservabilityPort`、observer repository、public schema、Rust struct / enum / field / variant、Cargo dependency或第八个 workspace member。
4. 不把 profile count、静态表审计写成实现扫描、运行结果、测试通过、真实 evidence、验收签署或 commit。
5. R15.16 才能裁决本批候选缺口、形成 canonical source map并决定 Step 15 完成门禁。

### 136.2 实际读取闭包
| 输入 | 本批读取重点 | 交叉审计用途 |
|---|---|---|
| 详细设计 SOP Step 15、书写规范 §5.14 | 日志、指标、trace、审计切口及正式表结构 | 防止把运维阈值或过程台账写进正式 §14 |
| 中间产物规范、真相源闭环标准 | 先思考/再写入、三层台账、观测与事实分层 | 固定本批只输出候选审计，不提前完成 Step 15 |
| Step 6~8 final closure | object accessor、Port / repository、protocol metadata与carrier | 核对155个profile是否引用真实可读source |
| Step 9 final 83-flow / phase audit | 26 Command、33 Query、6 Inbound、10 Outbound、8 Job | 核对每个观测切口不改变effect、caller或phase |
| Step 10~13 final closure | state、UoW、error、reentry、winner read、commit resolution | 核对observer不成为状态、durability或recovery authority |
| Step 14 §§149~151 | entry owner、external binding、redaction与backend gate | 核对callsite归属和未来controlled reopen范围 |
| R15.3~R15.14 final contracts | 60 log、48 metric、27 span、3 event、20 durable projection | 核对plane内唯一owner与plane间非替代关系 |
| 旧正式 `03/05/06`、README历史审计结论 | provider/cost/runtime/tools/listing/audit/evidence旧主线 | 核对historical material未重新进入 |

本批没有发现必须回开 Step 6~14 才能继续 R15.15 的输入缺失。两项 L0-core design-sync debt继续保持non-blocking；具体observer backend仍未选择，按§142作为实现前受控绑定问题处理，不伪装成已解决事实。

### 136.3 本批交叉审计判定模型
本批使用下列editorial tuple识别“同一次发生”，它不是Rust type、字段、trace schema或持久化identity：

```text
occurrence = exact flow/callsite + semantic owner + phase + exact invocation/carrier ref + terminal branch
```

同一occurrence可以合法产生一个log record、一个或多个由各自定义触发的metric sample、一个span lifecycle和一个post-Durable projection，但四者必须回答不同问题：

- log回答“哪个owner在什么phase观察到什么typed branch”；
- metric回答“该owner的低基数聚合样本是什么”；
- span回答“该owner实际拥有的调用区间何时开始和结束”；
- durable projection回答“哪个既有carrier revision已经由local authority证明Durable”。

只要任一plane反向定义业务结果、补造carrier、解析commit、触发retry或把另一plane当source，即判为owner冲突。不能因为四个plane都观察同一occurrence就把它们机械视为四次业务决策，也不能因为已有一个plane就省略另一个plane的独立契约。

## 137. Cross-plane semantic owner 与重复记录候选审计
### 137.1 主要occurrence family交叉表
| occurrence family | semantic / authority owner | runtime planes的合法投影 | durable plane资格 | 候选重复或越权判定 |
|---|---|---|---|---|
| entry protocol / metadata admission | API、Worker或Jobs exact pre-dispatch gate | entry log + admission metric + entry-observation span；每个stage只记录自身terminal | none | protocol、metadata、schema和dispatch是不同stage；不得把pass写成application success |
| owned application invocation terminal | exact Command / Query / Inbound / Job service | application log + completion/duration metric + application span | 仅该调用实际形成并提交的declared carrier | entry timeout不得结束invocation；typed return不等于Durable |
| idempotency reserve / winner classification | application idempotency coordinator + repository atomic reserve | `L-APP-03`、`MP-IDEM-01`、`FSP-IDEM-01`；`L-UOW-02`只fold purpose | fresh carrier后续另判；duplicate自身none | reserve loser rollback后只做一次exact winner read；不得二次reserve或把winner read算第二classification |
| repository read / effect call | exact repository adapter callable | repository/UoW log、metric和单call span | write return自身无资格 | repository success只证明call returned；commit owner仍唯一 |
| UoW commit / recovery resolution | `CapabilityUnitOfWorkManager`与same authority | `L-UOW-05/07`、`MP-UOW-01/04`、`FSP-UOW-01` | 只在exact resolution=`Durable`后允许matching profiles | log/metric/span均不得解析Unknown；profile不得从row absence或elapsed time补造 |
| external reference resolution | exact application callsite + named resolver adapter | Port log + resolver metric + local Port span | 只有后续本地reference/material carrier真实Durable才可能投影 | typed resolver outcome不是provider health、approval或local truth |
| audit handoff / event collaboration return | exact application facade + named Port adapter | Port outcome log + Port metric + local Port span | request-local return本身none | external status不得复制为Hub delivery/audit/evidence truth |
| Outbound capture / intent bind | source-owning application与capture repository | phase-specific log + metric + `FSP-OUT-01/03` | `CFP-EVENT-CAPTURE`仅在对应revision Durable后 | Phase A formed不等于Durable；Phase B return不等于Phase C bind |
| Job plan / target / final revision | exact Job phase owner + journal/report authority | phase log + phase metric + `FSP-JOB-01/02/03` | matching `CFP-JOB-JOURNAL/REPORT/STORED-RESULT`按各UoW分别判定 | whole-run span/transaction、counter-derived report和跨ordinal合并均禁止 |
| accepted change / trace / impact / material carrier | Step 6对象owner + Step 9 effect owner + Step 11 authority | runtime planes只观察形成与commit边界 | 20个profile中的exact one or more，按真实effect vector | durable projection不是第二次业务写，也不是reliable delivery receipt |
| typed error / issue occurrence | Step 12 first-forming owner | 一个primary log owner、一个metric selector、owning span status/event | 只可复制已存carrier中的typed issue；不得fresh-map failed fact | 上层fold、span status和carrier copy不得再次形成issue identity |
| observer redaction / sink failure | redaction gate或独立non-recursive fallback | `L/MP-DIAG-02/03`按exact failure各一次；span/durable不新增profile | none | legal `BodyForbidden/RedactedBoundary`、redaction violation和sink failure三者不得互相替代 |

### 137.2 Plane内与plane间唯一性候选结论
| 检查面 | 已有唯一性机制 | R15.15发现 | R15.16需要最终确认 |
|---|---|---|---|
| structured log | 60 profile中52个独立event key + 8个folded；同branch一个primary owner | 未发现folded profile被当成第二primary；`L-DIAG-01`仍只做typed mapping | 机械确认60/60 profile与primary/folded算术 |
| metric | 48 profile逐项unique owner；17 error和51 issue有selector优先级 | 未发现同一issue同时进入specialized owner与`MP-DIAG-01`的合法路径 | 机械确认17/17、51/51与54值global error family闭集 |
| span | 27 profile逐项unique owner，3 event只合并局部phase | 未发现上层span结束下层future、跨crash或把status升级为truth | 机械确认27/27 lifecycle与3/3 event |
| durable projection | 20 profile均从existing carrier post-Durable读取 | 未发现runtime log/metric/span作为carrier source；request-local Port return保持0 profile | 机械确认20/20 admission、source与minimum projection |
| cross-plane | plane角色由§136.3分开 | 同一occurrence的多plane投影没有形成第二business authority | 固定“多plane可共存但不可互为source”的正式规则 |

这里的“未发现”是对现有设计表的静态候选审计，不是实现instrumentation scan或运行去重测试。R15.16仍需把profile token和source section做最终机械反查后才能宣告Step 15 closure。

## 138. Phase boundary交叉审计

### 138.1 Entry observation 与 non-cancelling invocation

| entry | observation owner / terminal | owned invocation owner / terminal | 必须保持的断点 | 候选结果 |
|---|---|---|---|---|
| API | `FSP-API-01`在pre-dispatch rejection、typed response observed、observation timeout或mapping failure结束 | `FSP-API-02`从exact future首次poll前到same future真实terminal | observation timeout不drop、abort、detach或结束application future | 无owner合并候选 |
| Worker Inbound | `FSP-WKR-02`在header/schema rejection、receipt action observed、timeout或dispatcher failure结束 | `FSP-WKR-03`覆盖同一exact consumer future至receipt/technical terminal和consuming completion | unsupported schema不dispatch；timeout不伪造receipt或cancellation | 无owner合并候选 |
| Worker continuation | `FSP-WKR-04`只观察exact capture-ref continuation入口 | `FSP-WKR-05`拥有已spawn exact-ref future至真实terminal | observation不得读取raw snapshot body或拥有collaboration retry | 无owner合并候选 |
| Jobs | `FSP-JRT-01`负责admission，`FSP-JRT-02`负责host observation | `FSP-JRT-03`拥有spawned task、terminal cell和join/take | deadline只结束observation；task继续且terminal cell只能写一次 | 无owner合并候选 |

### 138.2 Reserve、staged UoW 与 commit resolution

```text
preflight / reserve / loser classification
  -> one exact winner read when required
  -> one selected fresh/replay/conflict/in-progress terminal

fresh effect UoW
  -> staged truth/change/trace/material/capture/result sidecars
  -> commit + resolve_commit
  -> Durable: exact carrier projection becomes eligible
  -> NotDurable: no durable projection
  -> Unknown: no success/failure projection; exact recovery authority continues
```

- reserve loser必须先rollback并discard request-local plan/effect，再执行一次same-authority exact winner read；`L-APP-03`、`MP-IDEM-01`和`FSP-IDEM-01`共享这一classification语义，但各自不是第二reserve owner。
- `L-UOW-03` / `MP-UOW-03`的write succeeded只表示staged callable返回；`L-UOW-05` / `MP-UOW-01` / `FSP-UOW-01`才观察commit resolution，但仍只有Step 11 authority能决定Durable。
- `Unknown`后若exact recovery最终证明`Durable`，matching carrier才获得profile资格；在证明前155个profile中不存在“pending accepted”或“assumed failed”替代项。
- 每个initial、target、final和short-bind UoW独立开始/结束；span、metric或日志不得跨UoW拼成whole-run transaction。

### 138.3 Outbound Phase A / B / C

| phase | local / external authority | runtime observation | durable projection | 禁止跨phase解释 |
|---|---|---|---|---|
| Phase A | source-owning UoW保存semantic source + complete snapshot + initial `Captured` | `L-APP-09`、`MP-OUT-01/02`、`FSP-OUT-01` | UoW `Durable`后才有`CFP-EVENT-CAPTURE::Captured` | formed/write returned不等于committed或delivered |
| Phase B | application facade exact-load official capture/snapshot，调用external collaboration Port | `L-APP-10/L-PORT-03`、`MP-OUT-03/MP-PORT-05/06`、`FSP-OUT-02/FSP-PORT-03` | request-local Port return为0；不直接发`CFP-EVENT-CAPTURE` | Candidate/PendingDelivery/Delivered/Failed/HandoffUnavailable不得成为local state |
| Phase C | stable intent通过source symmetry，在short UoW绑定`Captured -> IntentBound` | `L-OUT-03/L-UOW-*`、`MP-OUT-04`、`FSP-OUT-03/FSP-UOW-01` | short UoW `Durable`后发`CFP-EVENT-CAPTURE::IntentBound` | external status不写入capture；Unknown不声明bound |

J08允许intent bind与该exact target journal success位于同一target UoW，但这只改变事务组合位置，不合并capture owner与journal owner，也不创建Hub delivery lifecycle。

### 138.4 Job plan / target / final

| Job phase | authority与原子集 | observation profiles | durable资格与重入 | 禁止合并 |
|---|---|---|---|---|
| plan | deterministic frozen plan + Reserved + complete Planned journal initial UoW | Job plan log、`MP-JOB-03`、`FSP-JOB-01` | plan revision Durable后`CFP-JOB-JOURNAL`；reserve loser只读winner | request-local accumulator、scope rescan、whole-run UoW |
| target | one first-Planned ordinal + actual effect/capture + terminal journal revision target UoW | target log、`MP-JOB-04`、`FSP-JOB-02` | 每个target revision单独判Durable；technical/Unknown保持existing state | 从counter生成target result、跨ordinal commit、失败即伪造failed report |
| final | all-terminal exact journal + pure report/shell assembly + Finalized + Completed final UoW | final log、`MP-JOB-05`、`FSP-JOB-03` | Durable后`CFP-JOB-JOURNAL/REPORT/STORED-RESULT`按对称carrier发射 | current material rescan、report-by-run lookup、runner signal替代report |

### 138.5 Request-local handoff / collaboration

- `C23`先提交local `HandoffPending` trace revision；该revision可按`AFP-TRACEABILITY`投影。之后`handoff_traceability(...)`的typed return只属于request-local handoff observation，失败不回滚local trace。
- `C13/C14`只拥有governance resolver、relation/reference change、trace和capture；audit handoff caller保持0。
- `handoff_audit_export(...)`虽有Step 7 callable schema，但83-flow caller、span start、metric emission和durable profile均保持0。
- event collaboration Phase B outcome只存在于request-local Port surface；只有Phase A capture或Phase C intent-bound revision在local UoW `Durable`后进入continuity profile。
- observer wrapper不得借记录需要clone/serialize完整Port request/return，也不得让sink failure重调handoff/collaboration。

## 139. 83-flow、17-error、51-issue与155-profile反向审计候选结论

### 139.1 Exact flow family覆盖

| flow family | exact baseline | 重点反查 | R15.15 candidate mismatch | R15.16动作 |
|---|---:|---|---:|---|
| Command | 26 | accepted/rejected/replay、local UoW、actual captures、C23 post-commit | 0 | 复算`C01..C26` exact set |
| Query | 33 | resolver-first、Visible/NotVisible/Degraded、strict no-write | 0 | 复算`Q01..Q33`且write/profile=0 |
| Inbound | 6 | header-first、typed receipt、duplicate exact read、unsupported no-dispatch | 0 | 复算`I01..I06` effect/profile条件 |
| Outbound | 10 | Phase A/B/C、source symmetry、request-local external status | 0 | 复算`O01..O10`且delivery truth=0 |
| Operations Job | 8 | plan/target/final、winner read、journal/report reentry | 0 | 复算`J01..J08` phase与profile条件 |
| **total** | **83** | exact ID union与无额外generic flow | **0 candidate mismatch** | R15.16做最终missing/extra/duplicate检查 |

### 139.2 Error / issue owner反查

| inventory | existing selector contract | cross-plane rule | R15.15发现 |
|---|---|---|---|
| 17 `ApplicationError` | §§39、59.2逐variant固定forming log owner与metric selector | span只复制closed status；durable plane不从error生成failed fact | 17/17均有owner，未发现第二error taxonomy |
| issue 1~25 | semantic first-forming selector；copy层不重发 | specialized metric owner与`MP-DIAG-01`互斥 | 25/25均能回指exact phase；无copy-as-new occurrence候选 |
| issue 26~51 | technical owner默认`MP-DIAG-01`；32/33由idempotency owner专属 | primary technical log只出现一次；span status不增加issue count | 26/26均有selector；无generic diagnostic ref需求 |
| legal body boundary | existing `BodyForbidden/RedactedBoundary` semantic result | 不触发observer violation metric | 与`L/MP-DIAG-02`保持分离 |
| observer failure | `redaction_violation`或`observer_sink_failure`独立closed family | 不进入17/51、不持久化、不递归 | 未发现反向改写business error的路径 |

### 139.3 Final profile总量反查

| plane | final profiles | source authority | 本批重点结果 | candidate missing / extra |
|---|---:|---|---|---:|
| structured log | 60 | exact callsite typed source | primary/folded owner不跨phase；error source不取raw cause | `0/0` |
| metric | 48 | exact low-cardinality terminal owner | 34 Counter / 12 Histogram / 2 Gauge不承担truth；issue selector互斥 | `0/0` |
| span | 27 | exact lifecycle owner | observation/invocation、UoW、Outbound、Job边界不交叉拥有future或commit | `0/0` |
| durable projection | 20 | existing carrier + exact UoW `Durable` + symmetry | `8 accepted + 7 operations/derived + 5 continuity`；request-local outcome=0 | `0/0` |
| **total** | **155** | planes不得互为source | 同一occurrence可多plane观察，但不存在155次业务决策含义 | **`0/0`** |

3个fixed span event仍单独按3/3审计，不计入155。以上计数来自设计表静态反查；R15.16还必须执行final token/source-map机械核对，不能把本表表述成实现中的实际发射次数或测试结果。

## 140. 高风险分支的authority与zero-surface审计

| branch | 唯一业务 / recovery authority | 允许观察 | 必须保持为0 |
|---|---|---|---|
| Query no-write | resolver-first decision + exact repository read | Query log、metric、application/entry span | UoW、reserve、stored result、change/trace/capture、durable profile、handoff/collaboration |
| completed duplicate | exact stored Command/Inbound/Job surface | replay log、one idempotency classification、historical correlation/link | domain rerun、resolver、new carrier/profile、new external call、current-truth reconstruction |
| reserve loser | rollback + discard local candidate + one exact winner read | one final classification与recovery-purpose observation | second reserve、request-local plan execution、winner mutation、blind retry |
| commit `Unknown` | same-authority `resolve_commit` + barrier + exact read | Unknown log/metric/span status及non-recursive diagnostic | Accepted/Failed/NotDurable/zero-effect claim、durable projection、blind mutation retry |
| rollback succeeded | UoW rollback return，且只对已知pre-commit failure | rollback observation并保留original error precedence | accepted/failed business fact、automatic retry、zero-effect claim beyond proven boundary |
| rollback failed | UoW owner + original failure | independent rollback-failed log/metric diagnostic | overwrite original error、normal Failed report、durable profile |
| `ConsistencyDefect` | exact Step 12 invariant / Port / carrier symmetry owner | primary error log、technical metric、owning span error status | downgrade为missing/unavailable、synthetic issue/ref、carrier repair、accepted/failed profile |
| observer mapper/redaction failure | redaction gate | one non-sensitive violation candidate | field/value/hash、business error改写、recursive observation |
| observer sink failure | independent non-recursive fallback if available | at most one sink-failure candidate | panic、rollback、Port retry、observer queue/outbox/DLQ、caller result change |
| `Off` mode | validated diagnostic mode gate | no observer field construction or sink call | all 60/48/27/20 emissions、violation/sink diagnostic；business flow仍照常 |

本表未发现通过observer改变Step 9 effect vector、Step 11 authority、Step 12 precedence或Step 13 reentry算法的路径。R15.16应把这些zero-surface变成final completion gate，而不是新增“observed”state或fallback protocol。

## 141. Historical material与Capability Hub专项owner复核

| boundary / historical candidate | 当前允许进入Step 15的材料 | 仍须排除 | R15.15结果 |
|---|---|---|---|
| capability identity / registry | typed local ref、state、change、trace、impact、declared capture | provider identity、runtime allowlist、marketplace listing | 未重新进入 |
| adapter descriptor / MCP / A2A / API | descriptor/ref/state、safe category、typed resolver outcome | external request/response、session、route、health、quota、cost、execution result | 未重新进入 |
| governance seam | local relation、governance result ref/state、safe issue | approval、Policy/shared-rules、vote、workflow、external acknowledgement | 未重新进入 |
| method-library relation | body-free asset relation/ref/state | method body、source、package、lifecycle、execution | 未重新进入 |
| formal exposure / consumer / SDK | exposure、controlled view、consumer ref与formal boundary | runtime/tools execution、SDK client/package/publication、consumer cache truth | 未重新进入 |
| observability / audit | body-free audit ref、trace handoff summary、redacted projection | raw telemetry/audit body、generic audit ledger、evidence alias、acceptance signature | 未重新进入 |
| event collaboration | snapshot、capture、stable intent bind、typed request-local outcome | Hub outbox/relay/DLQ/attempt/lease/ack/delivery lifecycle | 未重新进入 |
| old README / formal `03/05/06` | 仅用作污染词与冲突审计 |旧provider/cost/KMS/Vault/runtime/tools/marketplace、旧TC/run/evidence/sign-off | historical_material保持隔离 |

historical-material reintroduction候选计数=`0`。两项L0-core design-sync debt不变；本批没有声称L0-core正式设计已经同步，也没有把其依赖假设写成外部验收。

## 142. Formal source与backend-neutral instrumentation缺口分析

### 142.1 当前已闭合与尚未闭合必须分开

| item | 当前事实 | R15.15分类 | R15.16必须处理 |
|---|---|---|---|
| callsite semantics | 60/48/27/20 profile已固定owner、trigger、field/label/attribute/projection和failure boundary | closed input | 保持不变并纳入formal source map |
| public business boundary | 不需要且禁止新增`ObservabilityPort`、protocol field、repository或persisted observer state | closed negative contract | 写入final closure，防止implementation agent补Port |
| module placement | exact callsite位于现有`application / infra / api / worker / jobs` owner；`contracts / domain`不接触backend type | closed placement class | 固定为module-private static instrumentation cut |
| concrete backend / crate | 当前未选择`tracing`、OpenTelemetry、`log`、exporter、sampling或subscriber | implementation binding prerequisite | 固定controlled reopen顺序和拒绝条件，不伪造选型 |
| private wrapper / macro / function | 当前无实现仓、无已授权具体backend，不能真实声明exact private signature/path | controlled implementation cut | 说明何时只回开Step 14/15，何时必须连带回开Step 3/4/5/7 |
| formal §14 source map | §9仅是早期输出骨架，尚未指向每个final canonical section | Step 15 internal closure gap | R15.16必须形成`14.1~14.7` exact source map |
| reliable audit delivery | 当前20 profile是best-effort post-Durable projection，不是outbox/receipt/evidence | intentional non-goal | 明确不是缺口；需求变化先回开00/01/02/Step 6~15 |

### 142.2 Private instrumentation cut候选裁决方向

现有Step 4/5的七member布局可以承接本批callsite：每个owner在自身module内从typed source构造already-redacted static record，再交给未来受控绑定的process-local backend。这个方向不要求跨crate public trait、application依赖infra、独立observability crate或新增业务Port，因此当前没有理由回开Step 6/7创建Rust声明。

具体backend选定时必须按变化范围执行：

| future binding change | minimum controlled reopen候选 | 必须拒绝的捷径 |
|---|---|---|
| 现有member内private wrapper/macro，第三方type不出module | Step 14 dependency matrix + Step 15 implementation gate + 后续`04/07` | implementation agent未经记录直接加crate/feature |
| 新增现有crate内专用文件但dependency direction不变 | Step 4 file layout + Step 5 owner + Step 14/15 | 把文件存在当backend ready或测试通过 |
| 新workspace member或共享public facade | Step 3/4/5/14/15，且必须重新证明七member与dependency graph | 直接创建第八crate或generic `ObservabilityPort` |
| public trait / Port / protocol / object字段 | 对应回开Step 6/7/8以及Step 14/15 | 用“backend-neutral”名义扩散第三方类型 |
| remote parent、SpanId、flags、baggage或sampling continuity | 先升级L0-core与上游需求/架构，再回开Step 6/8/14/15 | 从opaque `TraceId`伪造W3C/OpenTelemetry语义 |
| observer failure开始阻塞entry或要求reliable delivery | 回开00/01/02及Step 6~15 | 私自加入outbox、retry、receipt、evidence或startup hard dependency |

R15.15候选结论是：**当前backend-neutral instrumentation可以作为现有模块内静态callsite contract落码，不需要新增业务Port；concrete backend及private binding仍是实现前受控门禁。** 这不是R15.16最终裁决，也不表示实现者现在可以自行选择库；R15.16必须把该方向转成formal source和明确reopen条件。

## 143. R15.16必须消费的closure backlog

下列`CC-*`只是在R15.15中形成的editorial decision token，不是Rust enum、issue code、evidence id或正式验收项：

| decision | R15.16必须给出的final answer | 本批候选输入 |
|---|---|---|
| `CC-01` | 四plane同occurrence的非替代关系与plane内unique owner是否全部闭合 | §§136~137 |
| `CC-02` | entry/invocation、reserve/winner、UoW、Outbound A/B/C、Job plan/target/final、request-local handoff phase是否全部闭合 | §138 |
| `CC-03` | 83/83 flow exact set是否missing/extra/duplicate均为0 | §139.1 |
| `CC-04` | 17/17 error与51/51 issue是否均有唯一forming/metric owner且copy层为0 | §139.2 |
| `CC-05` | 60/48/27/20=155/155及3/3 event是否都有canonical source且无rename/count delta | §139.3 |
| `CC-06` | Query、duplicate、Unknown、rollback、ConsistencyDefect、observer failure的zero-surface是否成为completion gate | §140 |
| `CC-07` | historical material、专项owner与两项non-blocking debt是否保持原分类 | §141 |
| `CC-08` | private static callsite与future backend controlled reopen是否足以防止implementation自行选边 | §142 |
| `CC-09` | 正式 §14 `14.1~14.7`是否有exact canonical source、装配顺序与禁止搬运内容 | R15.4/6/8/10/12/14 final sections + R15.15 closure |
| `CC-10` | Step 16测试切口entry、Step 19 assembly gate及`04/07`handoff是否完整且不提前创建产物 | §§134、142及本批closure |

R15.16不得通过新增Port、state、DTO、observer ledger或backend产品来“解决”上述decision；如果final审计发现现有source确实不足，必须明确记录controlled reopen owner，而不是让实现者补空白。

## 144. R15.15自检与stop-review snapshot

### 144.1 Mechanical / semantic self-check

| check | expected | R15.15 result |
|---|---:|---:|
| upstream Step reviewed | 9 (`6..14`) | 9 |
| exact flow family / flow total | `5 / 83` | `5 / 83` |
| ApplicationError / issue baseline | `17 / 51` | `17 / 51` |
| final profile arithmetic | `60 + 48 + 27 + 20 = 155` | unchanged |
| fixed span event | 3 | unchanged |
| cross-plane occurrence family | 12 | 12 |
| phase groups independently audited | 5 | 5：entry/invocation、reserve/UoW、Outbound、Job、handoff/collaboration |
| high-risk branch rows | 10 | 10 |
| historical material reintroduced | 0 | 0 |
| new Rust declaration / struct / field / comment delta | `0/0/0/0` | `0/0/0/0`；无结构体或字段注释遗漏 |
| unresolved upstream blocker | 0 | 0 |
| R15.16 decision tokens | 10 | 10 pending finalization |

该自检只验证设计表、section source和边界推导的静态完整性；没有执行源码scan、编译、测试、backend调用、性能测量、evidence生成或验收。

### 144.2 Stop-review snapshot

| item | stop-review state |
|---|---|
| current formal document | `03-详细设计.md`；未修改，等待Step 19 assembly |
| current calibration artifact | `03_ddd_step_15_observability_audit.md` |
| completed batch | `R15.15 cross-step closure:先思考` |
| batch status | `03_step_15_r15_15_completed_stop_review` |
| owner audit | 四plane角色与12类occurrence family已交叉审计；未发现需要回开业务authority的候选冲突 |
| phase audit | entry/invocation、reserve/winner/UoW、Outbound A/B/C、Job三phase及request-local handoff已复核 |
| reverse coverage | 83 flow、17 error、51 issue、155 profile + 3 event候选mismatch为0；final机械裁决留R15.16 |
| formal-source gap | canonical §14 `14.1~14.7` source map尚待R15.16 |
| instrumentation cut | 候选方向为现有模块内private static callsite；具体backend/private binding仍是受控实现前置门 |
| upstream blocker | none |
| non-blocking debt | 两项L0-core design-sync debt不变 |
| formal / implementation artifact | 正式`03/04`、Step 16、implementation ledger、planned boundary skeleton均未创建或修改 |
| claimed implementation / test / evidence / sign-off | none |
| commit | not requested and not created |

本批完成后停止在R15.15 review gate。不得自动进入R15.16、Step 16或正式文档装配。

### 144.3 R15.16 entry gate

```text
document = 03-详细设计.md
step = 15
completed_batch = R15.15 cross-step closure:先思考
status = completed_stop_review
next_allowed_action = wait_for_user_confirmation_then_enter_03_step_15_r15_16
next_batch = R15.16 cross-step closure:再写入
allowed_scope_after_confirmation = consume CC-01..CC-10; perform final token/source/count audit; write final cross-step closure, canonical formal §14 source map, instrumentation controlled-reopen gate, Step 16 entry gate and Step 15 completion snapshot
must_reread_before_next_batch = this file §§136~144 plus final §§35~46,54~63,77~90,98~110,123~135; Step 6~14 final closure; SOP Step 15 and writing standard §5.14
forbidden_until_next_gate = formal 03 assembly, 04, Step 16 artifact, implementation ledger, planned boundary skeleton, code, tests, run_id, evidence, sign-off, commit
unresolved_upstream_blocker = none
```

## 145. R15.16 cross-step closure：授权与最终裁决口径

用户已明确授权解除逐 Step 停审限制，并要求按 `/tmp/L3-capability-hub_full_restart_remaining_tasks.md` 连续完成剩余设计任务。因此本批消费 `CC-01..CC-10`，只关闭 Step 15 的静态设计表、正式 §14 装配来源、instrumentation 受控回开与下游入口；不在本批修改正式 `03-详细设计.md`，不创建实现事实，也不把静态反查表述成代码扫描或测试结果。

最终裁决继续使用以下 occurrence identity：

```text
exact flow/callsite + semantic owner + phase
+ exact invocation/carrier ref + terminal branch
```

同一 occurrence 的 log、metric、span、durable projection 可以同时存在，但每一 plane 只能从同一既有业务 source 独立投影；任何 plane 都不得成为另一 plane 的 source、commit authority、retry trigger 或第二业务事实。

## 146. `CC-01..CC-10` 最终裁决

| Decision | Final status | Final answer | Canonical evidence |
|---|---|---|---|
| `CC-01` | closed | 四 plane 非替代关系已固定；60 log、48 metric、27 span、20 durable profile 均有 plane 内唯一 semantic owner，同 occurrence 多投影不增加业务决策次数。 | §§136~137；§§35~46、54~63、77~90、98~110 |
| `CC-02` | closed | entry / invocation、reserve / winner、staged UoW / resolution、Outbound A/B/C、Job plan / target / final、request-local handoff / collaboration 的 owner 与 terminal 均独立；不存在跨 future、跨 UoW、跨 phase 的合并 owner。 | §138；Step 9 / 11 / 13 final closure |
| `CC-03` | closed | exact flow set 为 `C01..C26 + Q01..Q33 + I01..I06 + O01..O10 + J01..J08 = 83`；missing / extra / duplicate 均为 `0/0/0`。 | §§41~42、60、86、105、139 |
| `CC-04` | closed | 17 个 `ApplicationError` 与 51 个 issue 均有唯一 first-forming / metric owner；上层 copy、span status、durable projection 新建 error / issue 的数量均为 0。 | §§39~40、59、84、106、139 |
| `CC-05` | closed | `60 + 48 + 27 + 20 = 155` 个 final profile 与 3 个 fixed span event 均可回指 canonical source；无 rename、count delta、source-less profile。 | §§35~46、54~63、77~90、98~110、123~135 |
| `CC-06` | closed | Query no-write、completed duplicate、reserve loser、commit `Unknown`、rollback success/failure、`ConsistencyDefect`、redaction/sink failure、`Off` mode 均进入 completion gate；各自 zero-surface 保持为 0。 | §140；§§43、61、87、105~106、131 |
| `CC-07` | closed | provider secret/cost/runtime/tools/marketplace/old audit 等 historical material 未重新进入；Hub 专项 owner 不变；两项 L0-core design-sync debt 保持 non-blocking。 | §141；Step 1~14 historical audits |
| `CC-08` | closed | 当前只允许既有 `application / infra / api / worker / jobs` 模块内 private static instrumentation cut；具体 backend、crate、feature、facade 与 binding 必须走受控回开，implementation agent 无自由选边权。 | §§88、142、149 |
| `CC-09` | closed | 正式 §14 的 `14.1~14.7` 已固定 exact canonical source、装配顺序、压缩规则和 forbidden carryover；Step 19 只能从该 map 装配。 | §§147~148 |
| `CC-10` | closed | Step 16 测试切口、Step 19 装配、04 配置和 07 实施 handoff 均完整；当前只交接，不提前创建 implementation ledger 或 boundary skeleton。 | §§134、150~151 |

## 147. Final token、source 与 count audit

### 147.1 Exact inventory

| Inventory | Expected set / arithmetic | Final static result | Missing | Extra | Duplicate authority |
|---|---|---:|---:|---:|---:|
| Command flows | `C01..C26` | 26 | 0 | 0 | 0 |
| Query flows | `Q01..Q33` | 33 | 0 | 0 | 0 |
| Inbound flows | `I01..I06` | 6 | 0 | 0 | 0 |
| Outbound flows | `O01..O10` | 10 | 0 | 0 | 0 |
| Job flows | `J01..J08` | 8 | 0 | 0 | 0 |
| `ApplicationError` | closed Step 12 set | 17 | 0 | 0 | 0 |
| issue code | closed Step 12 set | 51 | 0 | 0 | 0 |
| structured log profile | §§36~38 | 60 | 0 | 0 | 0 |
| metric profile | §57 | 48 | 0 | 0 | 0 |
| final span profile | §80 | 27 | 0 | 0 | 0 |
| fixed span event | §79 / §80 | 3 | 0 | 0 | 0 |
| durable projection profile | §§100~102 | 20 | 0 | 0 | 0 |

The `155` total means 155 editorial observation profiles, not 155 runtime emissions or 155 business decisions. This table is a static design audit only; no source implementation, instrumentation backend, test, run, report or evidence was inspected or produced.

### 147.2 Source admissibility

| Source class | Admissible rule | Forbidden substitution | Result |
|---|---|---|---|
| typed callsite terminal | exact owner reads an existing typed return / error / closed issue | raw cause, stack, serialized request/response | pass |
| lifecycle source | exact future / callable / UoW boundary owned by the span | parent timeout, caller observation, elapsed-time inference | pass |
| durable carrier | existing carrier plus exact UoW resolution `Durable` and sidecar symmetry | log success, repository return, row absence, external status | pass |
| actor / ref / safe text | only profile-declared accessor and variant-aware projection | whole actor, inner secret/document/audit id, arbitrary `Display` | pass |
| count | 11 closed readers: 4 Inbound, 6 Job, 1 conditional audit-ref set | private wrapper introspection or observer-only accessor | pass |
| issue | existing public-safe issue or exact first-forming selector | generic diagnostic ref or remapped copy | pass |

## 148. 正式 §14 canonical assembly source map

正式 `03-详细设计.md` §14 只允许按下表装配。中间产物中的 SOP 问答、candidate token、批次状态、机械过程日志和停审措辞不得进入正式正文。

| Formal block | Exact canonical source | Required formal content | Forbidden carryover |
|---|---|---|---|
| `14.1 分层、occurrence 与非替代原则` | §§14~20、27~34、136~138、145~147 | 六层观测主语；四 plane 角色；same-occurrence identity；Query no-write、duplicate、post-commit 和 observer non-cancelling rules | candidate token、runtime emission count、第二业务 authority |
| `14.2 Structured log cuts` | §§35~44、123~126、130~133 | 60 final profiles；52 primary + 8 folded；level、owner、terminal、allowed fields、error/issue selector、Off/Redacted rule | raw body/cause、secret、whole actor、backend API |
| `14.3 Metric cuts` | §§54~62、124~127、130~133 | 48 final profiles；34 Counter / 12 Histogram / 2 Gauge；closed label vocabulary；17/51 selector；low-cardinality redline | trace/subject/ref labels、threshold/SLO/dashboard |
| `14.4 Trace / span / correlation` | §§77~89、124~127、130~133、138 | 27 spans、3 events、exact lifecycle、parent/current/historical link、status、attribute allowlist、non-cancelling observation | external provider span ownership、whole-run span、payload event |
| `14.5 Durable audit / operations projection` | §§98~109、124~125、128~133、138 | 8 accepted + 7 operations/derived + 5 continuity profiles；post-Durable gate；minimum projection；request-local exclusion | log/metric as source、Hub delivery truth、reliable audit store |
| `14.6 Redaction 与 observer failure` | §§111~122、123~135、140 | `Off/Redacted` behavior；10 material classes；required/optional/atomic projection；11 count readers；redaction-before-sink；one non-recursive fallback | raw/private/external body、secret value、synthetic marker、observer retry queue |
| `14.7 Controlled reopen 与下游 handoff` | §§134、141~151 | backend binding reopen matrix；Step 16 test cuts；04 config category；07 planned boundary requirement；Step 19 source gate | concrete crate/config key/topic/URL、test result、commit or evidence claim |

### 148.1 Formal carryover rejection list

| Rejected/deferred material | Disposition |
|---|---|
| old `DeniedInvocationAudit`, provider/cost/routing/tool/runtime observations | reject as historical material |
| marketplace listing, governance approval or method body observations | reject as responsibility leakage |
| alert thresholds, SLO, dashboard, retention, sampling, pager and runbook | defer to configuration/operations/acceptance owner |
| concrete backend crate, exporter, endpoint, topic, queue or credentials | defer behind §149 controlled reopen and formal 04 |
| fixture, CI command, actual evidence alias, run id and signed result | defer to 05/06/07 and future execution; never fabricate |

## 149. Backend-neutral instrumentation controlled-reopen gate

Current design direction is a private, backend-neutral, static instrumentation cut inside the existing module that owns each callsite. It creates no new business Port, repository, domain object, protocol field, state or workspace member.

| Proposed implementation change | Mandatory reopen | Required decision before coding | Stop condition |
|---|---|---|---|
| select observability crate/backend or feature set | Step 14 dependency/Cargo matrix + Step 15 §88/this section + formal 04 | exact version/features, owner, API leakage, startup/failure behavior, fake/disabled parity | any third-party type crosses application/contracts/protocol/repository/Port surface |
| add private facade/wrapper/macro/function | Step 3/4/5 file/module contract + Step 15 profiles | exact files, signatures, no-op mode, error return, redaction-before-sink, recursion stop | caller result, UoW, retry or public API changes |
| add config key/profile/backend endpoint | formal 04 Steps 4~11 and Step 14 | type/default/validation/source/precedence/sensitivity/activation/failure | implementation agent invents key, default, URL/topic or fail policy |
| add public schema/field/accessor/Port/repository | originating Step 6/7/8 plus dependent Step 9~16 | source owner, Rustdoc for declaration/field/variant/payload, flow/state/error/test delta | observer convenience is the only business justification |
| make observer reliable/blocking or add queue/outbox/retry | 00/01/02 and Steps 5~16 | new business requirement, authority, lifecycle, persistence, recovery, acceptance | observer failure changes business outcome without upstream redesign |

## 150. Step 16、Step 19、04 与 07 handoff

### 150.1 Step 16 minimum test cuts

Step 16 must define, at minimum, static and behavioral cuts for all rows below. It may name fixtures and test seams for detailed-design verification, but the complete test suite, CI matrix and evidence archive remain formal 05 responsibilities.

| Cut family | Required verification |
|---|---|
| owner and cardinality | 60/48/27/20 profiles and 3 events have exact owner/source; no duplicate primary emission contract |
| phase lifecycle | entry vs invocation, reserve/winner, each UoW, Outbound A/B/C and Job plan/target/final remain separate |
| no-write / no-rerun | 33 Queries produce no writes; duplicate and reserve-loser paths do not rerun effects or create new durable facts |
| durability | only exact `Durable` carrier revisions project; `NotDurable` and unresolved `Unknown` do not project success/failure |
| redaction | forbidden material cannot reach any plane; required failure drops the profile, optional failure omits field, atomic group is all-or-none |
| modes | `Off` performs pre-construction no-op; `Redacted` emits exact allowed schema only; observer failure is non-cancelling and non-recursive |
| labels and correlation | metric labels are closed/low-cardinality; current/historical correlation follows variant-aware rules |
| historical exclusions | provider cost/secret/runtime/tools/marketplace/governance approval/method body do not re-enter profiles |

### 150.2 Step 19 assembly gate

Step 19 may assemble formal §14 only after Step 16~18 are complete. It must preserve the profile IDs and counts as editorial indices, include enough rows to locate exact callsites and sources, cite §148, and repeat that concrete backend binding remains controlled. Any source/count/name mismatch reopens Step 15 before formal assembly.

### 150.3 Formal 04 and 07 handoff

- Formal 04 owns concrete diagnostic mode, backend-neutral enablement category, source/precedence, startup validation, sensitive endpoint/credential references, activation, failure/degradation and migration. No key/default/backend is preselected here.
- Formal 07 must allocate planned boundaries for backend selection/reopen, private facade and four-plane binding, redaction/mode gate, source projection, non-recursive fallback, and static profile verification. Those boundaries cannot claim implementation or evidence at design time.
- Implementation ledger and every planned boundary skeleton remain prohibited until formal 07 is assembled.

## 151. Step 15 final completion snapshot

| Check | Final result |
|---|---|
| `CC-01..CC-10` | `10/10 closed` |
| exact flows | `83/83`; missing/extra/duplicate=`0/0/0` |
| errors/issues | `17/17`, `51/51`; copy-as-new=`0` |
| profiles/events | `155/155 + 3/3`; rename/count/source delta=`0/0/0` |
| high-risk zero surfaces | `10/10 closed` |
| historical material reintroduced | `0` |
| new Rust declaration / struct / field / comment | `0/0/0/0`; no struct/field Rustdoc omission introduced |
| unresolved upstream blocker | `0` |
| non-blocking debt | two L0-core design-sync items unchanged |
| implementation/test/run/evidence/sign-off/commit claimed | none |
| next design artifact | `03_ddd_step_16_test_cuts.md` |

```text
document = 03-详细设计.md
step = 15
completed_batch = R15.16 cross-step closure:再写入
status = 03_step_15_completed_continuous_execution
next_allowed_action = enter_03_step_16_test_cuts
must_read_next = detailed-design SOP Step 16; writing standard §5.15; formal 00/01/02; Step 9~15 final closure; L1-governance Step 16 structure
unresolved_upstream_blocker = none
commit_required = no
```
