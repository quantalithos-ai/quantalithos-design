# Step 15. 定义可观测性与审计埋点契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 15
> 回填章节: `projects/L3-method-library/03-详细设计.md` §14 可观测性与审计埋点契约
> 创建日期: 2026-06-24
> 当前模式: full-restart / step15-observability-audit
> 当前状态: in_progress
> 当前模块: `R15.16 cross-step closure and formal §14 candidate stop-review:再写入`
> 当前门禁: `R15.16` completed_wait_user_confirm;Step 15 completed;等待确认进入 Step 16 `R16.1 开工与必读文档:先思考`

---

## 0. 文件重置记录

旧 `03_ddd_step_15_observability_audit.md` 曾标记为 `[x] 已确认`,但其内容围绕旧 `MethodContent`、P0/P1 publish、snapshot、fingerprint、outbox relay、gateway context、governance validation、object storage、bus publish、projection rebuild 和旧 job/dry_run 口径展开。该 completed 状态和旧可观测性结论全部失效。

当前 Step 15 不继承旧 `AuditRecord`、旧 outbox 指标、旧 snapshot/fingerprint/gate 指标、旧 `MethodContent*` 审计事件、旧 bus topic、旧 dead-letter、旧 gateway trusted header 或旧 P1 plugin/cache/marketplace 观测项。旧内容只能作为 historical pollution 和差异审计输入,不得作为当前 L3-method-library 可观测性与审计埋点的正向来源。

当前 Step 15 的唯一正向基线是:

- 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。
- 本轮 `03-详细设计` Step 1~14 中间产物。
- 特别是 Step 6 的 trace / audit / marker / diagnostic 对象边界、Step 7 的 port / adapter / runtime availability 边界、Step 8 的 protocol shell、Step 9 的 Command / Query / Inbound / Outbound / Job flow、Step 10~13 的 state / persistence / recovery / idempotency 口径、Step 14 的 config binding / external dependency / runtime builder handoff。

---

## R15.1 开工与必读文档:先思考

### 1. 当前模块目标

`R15.1` 只思考 Step 15 的开工边界、必读文档、Step 14 handoff、L1-governance Step 15 框架参考、旧 Step 15 污染隔离、可观测性 / 审计分层分批计划和 `R15.2` 写入边界。当前模块不写日志埋点表、指标埋点表、trace/span 切口表、审计事件表、test case schema、implementation code 或正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考必读文档、输入边界、Step 14 handoff、L1-governance 框架参考、旧材料隔离、Step 15 分批计划和 `R15.2` 写入边界。 |
| 当前禁止 | 写 log / metric / trace / audit final table、具体字段 schema、告警阈值、SLO、dashboard、采样率、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Step 15 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、单模块推进规则、Step 14 completed_wait_user_confirm_to_step15。 | 跳过 R15.1/R15.2 直接写完整埋点表。 |
| `03_ddd_calibration_flow.md` | Step 14 completed、Step 15 wait_user_confirm_to_R15.1、Step 16+ blocked。 | 将测试切口、验收证据或实施计划提前写入 Step 15。 |
| `03_ddd_step_14_config_dependencies.md` R14.14 | config validation issue、adapter availability、entry precheck、publisher/handoff safe outcome、redacted config diagnostic handoff。 | 回写 config key、profile、secret、endpoint、topic、URL 或具体数值。 |
| `03_ddd_step_13_concurrency_idempotency.md` | duplicate replay、idempotency conflict、commit unknown、job reentry、publication retry、runtime guard。 | 用观测日志替代 stored result、receipt、report、checkpoint 或 idempotency source。 |
| `03_ddd_step_12_errors_recovery.md` | rejected / unsupported / delayed / failed / degraded / unavailable 的 recovery surface 和 safe diagnostic。 | 把 failed/rejected path 伪造成 accepted trace / audit。 |
| `03_ddd_step_11_persistence_tx_consistency.md` | trace / audit / report / stored result / marker 的 transaction、append-only、logical store 边界。 | 用 log/metric 替代本地 truth、stored replay、report 或 append-only record。 |
| `03_ddd_step_10_state_machine.md` | state transition、runtime assembly、adapter availability、entry local state。 | 通过 observability 后端状态反推业务状态或 state transition。 |
| `03_ddd_step_09_function_flows.md` | Command / Query / Inbound / Outbound / Operations Job 的 accepted/rejected/duplicate/failed 分支。 | 泛化成“所有成功都写 audit / outbox / trace”。 |
| `03_ddd_step_08_protocol_contracts.md` | command/query/event/job metadata、trace context、receipt/report/effect shell。 | 修改 public DTO、event/job schema 或 trace context 来源。 |
| `03_ddd_step_07_trait_port_adapter.md` | trace/audit/history/report/publisher/handoff/runtime availability ports and entry facade-only。 | 新增未闭口 observability port 或让 entry 直连 concrete adapter。 |
| `03_ddd_step_06_object_contracts.md` | trace / audit / diagnostic / marker / report 对象字段边界和 body-free redline。 | 把 raw request、raw event payload、adapter body、secret、stack trace 写入对象。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 15 | 日志、指标、trace、审计事件切口和五个 SOP 问题。 | 写告警阈值、运维流程、完整测试方案。 |
| `standards/document/详细设计书写规范.md` §5.14 | 必须输出日志埋点表、指标埋点表、审计事件表。 | 只写 narrative,不形成可实现打点切口。 |
| `standards/document/设计真相源闭环与可落码性标准.md` §2.14 | runtime log / metric、business trace / audit / history、outbox marker、handoff marker、job report、diagnostic issue 必须分层闭合。 | 用 log/metric 替代 business audit,或把 audit 保存外部正文。 |

### 3. Step 14 handoff 承接思考

| Step 14 handoff | Step 15 承接方式 | 当前 R15.1 裁决 |
|---|---|---|
| config validation issue | Step 15 思考 config validation rejected / redacted diagnostic 的日志和指标切口。 | 不写具体 config key 或 validation message。 |
| adapter availability | Step 15 思考 availability/degraded/unavailable 的日志、指标和 trace context。 | 不从 raw health payload / HTTP/SQL code 合成 public marker。 |
| entry precheck | Step 15 思考 API / worker / jobs precheck blocked/unavailable 的观测切口。 | entry 仍只能调用 facade,不因观测直连 adapter。 |
| publisher / handoff safe outcome | Step 15 思考 published / blocked / unavailable / failed / delivered / failed 的日志、指标和 audit/marker 边界。 | external receipt/body 不进入 audit/log/diagnostic。 |
| redacted config diagnostic | Step 15 思考 diagnostic ref 可记录哪些 safe refs。 | 不记录 secret、URL、topic concrete value、credential、connection string。 |
| forbidden configurable boundary | Step 15 必须继承 no config-as-source、no runtime-summary-as-truth、no fake-private-source。 | 观测不能补 source/marker/schema 缺口。 |

### 4. L1-governance Step 15 框架参考思考

L1-governance Step 15 的价值在组织深度和分层方法,不是领域语义。L3-method-library 只参考其“目标 -> 输入 -> 分批 -> SOP 问题 -> 总原则 -> 日志 -> 指标 -> 审计 -> trace/span -> redaction -> closure”的结构。

| L1 Step 15 框架点 | L3 采用方式 |
|---|---|
| 先区分 runtime log / metric 与 business trace / audit / history | L3 需要先区分运行观测、业务追溯、operations report、handoff marker 和 diagnostic issue。 |
| rejected / duplicate / query no-write 不伪造成 accepted audit | L3 必须按 Step 9/12/13 分支清楚列出哪些只写 log/metric/report/receipt。 |
| 日志、指标、审计分别成表 | L3 后续按 flow family 分批写 log table、metric table、audit/event table。 |
| metric label 低基数与敏感字段红线 | L3 必须明确不能使用 subject id、actor id、trace id、payload digest、secret、raw endpoint。 |
| trace context 来源于 metadata / event / job envelope | L3 不允许 domain object 自行生成 trace context。 |
| handoff / archive / external body 不入本仓 | L3 对 artifact/archive/marketplace/runtime/process/identity 等外部协作保持 body-free ref。 |
| 告警阈值和 dashboard 后移 | L3 Step 15 只写 code instrumentation cuts,告警阈值/采样/运维 runbook 后移。 |

### 5. SOP 五问初步回答

| SOP 问题 | R15.1 初步回答 | 后续落点 |
|---|---|---|
| 哪些处理流必须记录审计? | 只有 accepted truth change、正式 marker/report/handoff 状态变化、operations report closure 等已在 Step 6~13 闭口的业务/operations事实可写 audit/trace/report;Query no-write、rejected、unsupported、duplicate replay 不写 accepted audit。 | R15.7/R15.8、R15.11/R15.12 |
| 哪些错误分支必须记录日志? | validation rejected、domain rejected、not visible、idempotency conflict/in-flight/result missing、commit unknown、rollback failed、adapter unavailable、config rejected、unsupported event、handoff failed、job failed 都必须有 structured log cut。 | R15.3/R15.4 |
| 哪些关键路径需要指标? | Command、Query、Inbound、Outbound、Job、repository/UoW、idempotency、runtime assembly、adapter availability、config validation、publisher/handoff、projection/reference/report maintenance 需要 counter/histogram/gauge。 | R15.5/R15.6 |
| 日志、指标、审计字段分别记录什么? | 日志记录排障上下文和 safe refs;指标记录低基数聚合标签;审计记录 accepted business / operations facts 的 body-free refs、state、reason、source cursor、receipt/report refs。 | R15.3~R15.12 |
| 哪些监控和告警细节应留给运维手册? | SLO、alert threshold、dashboard、sampling、retention、backend product、pager/runbook、exporter endpoint、production health threshold 留给运维/配置文档。 | R15.13/R15.14 |

### 6. 旧 Step 15 污染隔离思考

| 旧内容 | 当前处理 |
|---|---|
| `MethodContentDraftCreated` 等旧审计事件 | historical pollution;不得进入当前 L3-method-library 正向审计主线。 |
| publish / deprecate / retire / supersede 旧主线 | 不继承;若当前 Step 8/9 没有同名 protocol/flow,不得写观测项。 |
| snapshot / fingerprint / gate / governance validation | 不继承字段和指标;只有当前 Step 6~14 明确保留的 body-free refs 才能进入。 |
| old outbox relay / dead-letter 指标 | 不继承命名;后续若当前 outbound/handoff flow 有正式 safe outcome,重新命名和闭口。 |
| old gateway context / request_id / actor field | 不继承字段名;metadata / trace context 以当前 Step 8 protocol 为准。 |
| old `ObservabilityPort` backend failure 不阻断业务 | 不直接继承;是否需要对应 port / failure rule 必须由当前 Step 7/12/14 证明。 |
| old dry_run write forbidden | 不继承命名;若当前 job flow 有 dry-run/preview 禁写,以后续 Step 9/13 当前命名为准。 |

### 7. Step 15 初步分批思考

| 模块 | 主题 | 初判边界 |
|---|---|---|
| R15.1/R15.2 | 开工与必读文档 | 写输入基线、旧材料隔离、SOP 五问、模块计划。 |
| R15.3/R15.4 | 可观测性分层与总原则 | 写 runtime log / metric / business trace / audit / report / marker / diagnostic 的分层。 |
| R15.5/R15.6 | structured log cuts | 写 API / application / worker / jobs / infra / adapter / config validation 日志切口。 |
| R15.7/R15.8 | metric cuts | 写 counter / histogram / gauge family、低基数 label、禁止 label。 |
| R15.9/R15.10 | trace / span / correlation cuts | 写 trace context 来源、span cut、correlation refs、duplicate replay correlation。 |
| R15.11/R15.12 | audit / operations fact cuts | 写 accepted business / operations audit、report、handoff marker、query no-write 红线。 |
| R15.13/R15.14 | redaction / sensitive boundary / handoff | 写禁止字段、body-free/redaction、Step 16/19/04/07 handoff。 |
| R15.15/R15.16 | cross-step closure and formal §14 candidate stop-review | 写 closure audit、candidate source map、Step 16 entry gate。 |

### 8. R15.2 写入边界思考

`R15.2` 只应把 R15.1 的开工思考落成可恢复台账,不得进入日志/指标/审计最终表:

1. 写 Step 15 必读文档表与读取状态。
2. 写输入基线与旧材料处理规则。
3. 写 Step 14 handoff 承接表。
4. 写 SOP 五问初步回答。
5. 写 Step 15 输出骨架、模块计划和 L1-governance 框架参考边界。
6. 写 `R15.3 可观测性分层与总原则:先思考` 进入门禁。

### 9. R15.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认旧 Step 15 completed 作废 | pass |
| 是否只思考开工、必读文档、Step 14 handoff 和分批计划 | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否明确不写 log / metric / trace / audit final table | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 16 test schema 或 implementation code | pass |
| 是否形成 R15.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.2 开工与必读文档:再写入`;只允许写入 Step 15 必读文档表、读取状态、输入基线、旧材料处理规则、Step 14 handoff 承接、SOP 五问初步回答、输出骨架、模块计划、L1-governance 框架参考边界和 `R15.3` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 log / metric / trace / audit final table、observability schema、test case schema、implementation code 或具体 config key/env/topic/URL。

---

## R15.2 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R15.1` 推进到 `R15.2`。 |
| 本模块写入范围 | 必读文档、读取状态、输入基线、旧材料处理规则、Step 14 handoff 承接、SOP 五问初步回答、Step 15 输出骨架、模块计划、L1-governance 框架参考边界和 `R15.3` 进入门禁。 |
| 本模块禁止范围 | 具体日志埋点表、指标埋点表、trace/span 表、审计事件 final table、observability schema、test case schema、implementation code、config key/env/topic/URL、告警阈值、SLO、dashboard、采样率和运维 runbook。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 15 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前恢复点、单模块推进规则、Step 15 当前门禁。 | 每次只推进一个 `R15.x` 模块。 |
| `03_ddd_calibration_flow.md` | 已读取并承接 | 确认 Step 14 completed、Step 15 in_progress、Step 16+ blocked。 | `R15.2` 完成后只能等待 `R15.3`。 |
| `03_ddd_step_15_observability_audit.md` | 已读取并承接 | 确认旧文件污染已重置、`R15.1` 已形成开工思考。 | 当前只补开工写入台账。 |
| `00-需求文档.md` | 作为正式上游基线 | 固定 L3-method-library 的仓定位、依赖裁剪、验收红线和业务边界。 | Step 15 不新增需求。 |
| `01-架构设计.md` | 作为正式上游基线 | 固定职责边界、外部协作、数据所有权、横切关注点。 | Step 15 只写代码埋点切口。 |
| `02-概要设计.md` | 作为直接输入基线 | 固定八个组成部分、对象轮廓、接口骨架、处理流、状态和异常。 | 观测切口必须回指概要边界。 |
| `03_ddd_step_06_object_contracts.md` | 已在 Step 15 启动中列为必读 | 固定 trace、audit、marker、diagnostic、report、safe ref 和 forbidden body 边界。 | runtime log / metric 不替代这些对象。 |
| `03_ddd_step_07_trait_port_adapter.md` | 已在 Step 15 启动中列为必读 | 固定 port、adapter、runtime availability、publisher、handoff、report 与 entry facade 边界。 | 不新增未闭口 observability port。 |
| `03_ddd_step_08_protocol_contracts.md` | 已在 Step 15 启动中列为必读 | 固定 command/query/event/job metadata、trace context、receipt/report/effect shell。 | 不修改 public DTO。 |
| `03_ddd_step_09_function_flows.md` | 已在 Step 15 启动中列为必读 | 固定 Command / Query / Inbound / Outbound / Job accepted/rejected/failed/duplicate 分支。 | 埋点必须逐 flow family 回指。 |
| `03_ddd_step_10_state_machine.md` | 已在 Step 15 启动中列为必读 | 固定 state transition、terminal、degraded、unavailable、blocked 语义。 | 不用观测后端反推业务状态。 |
| `03_ddd_step_11_persistence_tx_consistency.md` | 已在 Step 15 启动中列为必读 | 固定 trace/audit/report/stored result/marker 的事务和 append-only 边界。 | 日志不可替代持久化 truth。 |
| `03_ddd_step_12_errors_recovery.md` | 已在 Step 15 启动中列为必读 | 固定错误分支、recovery surface、safe diagnostic 和 failure semantics。 | rejected/failed 不伪造成 accepted audit。 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已在 Step 15 启动中列为必读 | 固定 duplicate replay、idempotency conflict、commit unknown、job reentry。 | duplicate 记录 replay 观测,不得重跑业务。 |
| `03_ddd_step_14_config_dependencies.md` | 已在 Step 15 启动中列为必读 | 固定 config validation、adapter availability、runtime builder 和 forbidden configurable boundary handoff。 | 不写具体 config key/env/topic/URL。 |
| `详细设计讨论流程_SOP.md` Step 15 | 已读取并承接 | 固定日志、指标、trace、审计事件切口和五个问题。 | 本 Step 输出实现埋点切口,不写运维阈值。 |
| `详细设计书写规范.md` §5.14 | 已读取并承接 | 固定日志埋点表、指标埋点表、审计事件表格式。 | 后续模块按表格落地。 |
| `设计真相源闭环与可落码性标准.md` §2.14 / §2.14-a | 已读取并承接 | 固定 observability 与 business audit 分层、accepted side-effect inventory 红线。 | 分层闭合是 Step 15 主线。 |
| `L1-governance 03_ddd_step_15_observability_audit.md` | 已读取框架 | 参考目标、输入、分批、SOP 问题、总原则、日志/指标/审计/redaction/closure 的组织深度。 | 只参考框架,不得复制 governance 领域语义。 |

### 3. 输入基线与旧材料处理规则

| 类别 | 当前口径 |
|---|---|
| 正向基线 | 当前 `00/01/02` 和本轮 Step 1~14 中间产物。 |
| 旧 Step 15 | historical pollution;旧 completed 状态作废。 |
| 旧 `MethodContent` 主线 | 不进入当前 L3-method-library 观测主线。 |
| 旧 publish/deprecate/retire/supersede | 不继承;除非当前 Step 8/9 有同名 protocol/flow,否则不得写观测项。 |
| 旧 snapshot/fingerprint/outbox/gateway/dry_run | 不继承命名、字段、指标或审计事件。 |
| 旧 observability backend 规则 | 不直接继承;必须由当前 Step 7/12/14 重新证明。 |
| 正式 `03-详细设计.md` | 本模块不修改;后续由 Step 19 或明确回填模块装配。 |

### 4. Step 14 handoff 承接

| Step 14 输出 | Step 15 承接写法 | 本模块裁决 |
|---|---|---|
| config validation issue | 后续日志/指标切口需要覆盖 validation rejected、redacted diagnostic、config source ref。 | 不记录 secret、raw config、connection string、endpoint、topic concrete value。 |
| adapter availability | 后续日志/指标/trace 切口需要覆盖 unavailable、degraded、recovered、blocked。 | 不保存 raw health response 或 adapter body。 |
| entry precheck | 后续需要区分 API / worker / job entry precheck blocked 与业务 reject。 | entry 仍只调用 facade。 |
| runtime builder handoff | 后续需要记录 runtime assembly success/failure 的 safe diagnostic。 | 不把 runtime summary 当 truth source。 |
| publisher / handoff safe outcome | 后续需要区分 publication marker、handoff marker、receipt/report ref 与 runtime log。 | 不保存 archive package body、observability ledger body、external document body。 |
| forbidden configurable boundary | 后续所有日志、指标、审计字段必须继承 redaction 和 body-free 规则。 | observability 不能补 schema、marker、mapper、config 缺口。 |

### 5. SOP 五问写入口径

| SOP 问题 | 当前写入口径 | 后续模块 |
|---|---|---|
| 哪些处理流必须记录审计? | accepted truth change、正式 marker/report/handoff 状态变化、operations report closure 才能进入 business audit / trace / report;Query no-write、rejected、unsupported、duplicate replay 不写 accepted audit。 | R15.11/R15.12 |
| 哪些错误分支必须记录日志? | validation rejected、domain rejected、not visible、idempotency conflict、in-flight、result missing、commit unknown、rollback failed、adapter unavailable、config rejected、unsupported event、handoff failed、job failed 必须有 structured log cut。 | R15.5/R15.6 |
| 哪些关键路径需要指标? | Command、Query、Inbound、Outbound、Job、repository/UoW、idempotency、runtime assembly、adapter availability、config validation、publisher/handoff、projection/reference/report maintenance。 | R15.7/R15.8 |
| 日志、指标、审计字段分别记录什么? | 日志记录 safe refs、operation、status、diagnostic ref;指标只记录低基数 kind/state/result/error labels;审计记录 body-free refs、state、reason、source cursor、receipt/report refs。 | R15.3~R15.12 |
| 哪些监控和告警细节留给运维手册? | SLO、alert threshold、dashboard、sampling、retention、backend product、pager/runbook、exporter endpoint、production health threshold。 | R15.13/R15.14 |

### 6. Step 15 输出骨架

| 输出块 | 必须回答的问题 | 禁止内容 |
|---|---|---|
| 可观测性分层与总原则 | runtime log / metric、business trace / audit / history、outbox marker、handoff marker、job report、diagnostic issue 如何分层。 | 用 log/metric 替代 truth/audit/report。 |
| structured log cuts | 每类 handler、service、worker、job、adapter、config validation 在何处打日志。 | raw request、payload、response body、stack trace、secret。 |
| metric cuts | counter/histogram/gauge 名称族、打点位置、低基数标签。 | request id、actor id、subject id、trace id、payload digest、raw endpoint、free text。 |
| trace/span/correlation cuts | trace context 来源、span 边界、correlation ref、duplicate replay correlation。 | domain object 自行生成 trace context。 |
| audit / operations fact cuts | 哪些 accepted business/operations fact 写 audit/trace/report/marker。 | failed/rejected path 伪造成 accepted audit。 |
| redaction / sensitive boundary | 日志、指标、审计、diagnostic、handoff 中禁止字段和 body-free ref 规则。 | 外部正文、archive package body、observability ledger body。 |
| cross-step closure | 回查 Step 6~14 是否有遗漏、冲突或需交给 Step 16/19/04/07 的事项。 | 直接修改正式 `03-详细设计.md`。 |

### 7. Step 15 模块计划

| 模块 | 主题 | 输出边界 |
|---|---|---|
| R15.1 | 开工与必读文档:先思考 | 已完成开工思考、旧材料隔离和分批计划。 |
| R15.2 | 开工与必读文档:再写入 | 当前模块;完成可恢复开工台账。 |
| R15.3/R15.4 | 可观测性分层与总原则 | 写分层原则、accepted/rejected/duplicate/query no-write 总矩阵。 |
| R15.5/R15.6 | structured log cuts | 写日志埋点表和日志字段红线。 |
| R15.7/R15.8 | metric cuts | 写指标埋点表、低基数 label、禁止 label。 |
| R15.9/R15.10 | trace / span / correlation cuts | 写 trace context 来源、span 边界、correlation 和 duplicate replay 口径。 |
| R15.11/R15.12 | audit / operations fact cuts | 写审计事件表、operations report/marker/handoff fact 切口。 |
| R15.13/R15.14 | redaction / sensitive boundary / handoff | 写敏感字段、body-free boundary、Step 16/19/04/07 handoff。 |
| R15.15/R15.16 | cross-step closure and formal §14 candidate stop-review | 写 Step 6~14 closure audit、formal §14 candidate source map、进入 Step 16 门禁。 |

### 8. L1-governance 框架参考边界

| 参考项 | L3 采用方式 | 不采用内容 |
|---|---|---|
| Step 状态 / 目标 / 输入 / 分批计划 | 保留组织方式,用于恢复和审查。 | 不继承 governance 对象名、事件名、指标名前缀。 |
| SOP 问题回答 | 保留五问结构,但答案回指 L3 Step 6~14。 | 不复用 GovernanceTraceRecord、GovernanceOutboxRecord 等领域名。 |
| 总原则 | 保留 runtime log 与 business audit 分层方法。 | 不复制 Governance accepted side-effect inventory。 |
| 日志 / 指标 / 审计表 | 保留表格粒度和字段红线。 | 不把 L1-governance 的 command/query/job 列表搬入 L3。 |
| redaction / forbidden body | 保留安全边界表达深度。 | 不引入 L1 特有 archive/GRC 语义,除非 L3 当前 Step 已定义。 |

### 9. R15.3 进入门禁

`R15.3 可观测性分层与总原则:先思考` 只允许思考分层原则和总矩阵:

1. 区分 runtime log / metric、business trace / audit / history、outbox publication marker、handoff / export marker、job report、diagnostic issue。
2. 回查 Step 9 的 Command / Query / Inbound / Outbound / Job family,识别 accepted、rejected、duplicate、failed、delayed、unsupported、query no-write 的观测定位。
3. 判断哪些事实必须通过 Step 6~13 已闭合对象承载,哪些只允许记录 runtime log / metric。
4. 不写最终日志表、指标表、审计事件表和具体字段 schema。

### 10. R15.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成 Step 15 必读文档表与读取状态 | pass |
| 是否固定输入基线与旧材料处理规则 | pass |
| 是否承接 Step 14 handoff | pass |
| 是否写入 SOP 五问初步回答 | pass |
| 是否形成 Step 15 输出骨架和模块计划 | pass |
| 是否只参考 L1-governance 框架而不复制领域语义 | pass |
| 是否未写 log / metric / trace / audit final table | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.3 可观测性分层与总原则:先思考`;只允许思考 runtime log / metric、business trace / audit / history、outbox publication marker、handoff / export marker、job report、diagnostic issue 的分层原则和 accepted/rejected/duplicate/query no-write 总矩阵;不得直接修改正式 `03-详细设计.md`;不得写最终日志埋点表、指标埋点表、审计事件表、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.3 可观测性分层与总原则:先思考

### 1. 当前模块目标

`R15.3` 只思考 Step 15 的可观测性分层原则和总矩阵,为 `R15.4` 写入做准备。当前模块不写最终日志埋点表、指标埋点表、审计事件表、trace/span 字段表、具体 metric 名称、alert/SLO/dashboard、test case schema 或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 runtime log / metric、business trace / audit / history、outbox publication marker、handoff / export marker、job report、diagnostic issue 的分层原则;思考 161 个 flow family 的 accepted/rejected/duplicate/query no-write/failed/delayed/unsupported 总矩阵。 |
| 当前禁止 | 写最终日志表、指标表、审计事件表、metric name、log field schema、span payload、alert threshold、SLO、dashboard、sampling、retention、runbook、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 分层主语初判

| 层级 | 当前主语 | 正式来源 | Step 15 初判 |
|---|---|---|---|
| runtime log | API / worker / jobs entry、application service、repository/UoW、adapter binding、config validation、publisher/handoff/job runner。 | Step 6 entry/runtime/diagnostic object;Step 7 port;Step 9 flow branch;Step 12 error recovery;Step 14 config/dependency。 | 用于定位执行过程和失败原因,不构成 business truth。 |
| runtime metric | command/query/inbound/outbound/job/repository/UoW/adapter/config/publisher/handoff/job progress 的聚合计数和耗时。 | Step 8 protocol family;Step 9 flow family;Step 10 state family。 | 只能用低基数 kind/state/result/error 标签;不做单记录定位。 |
| business trace / history | accepted Command 产生的 truth/history/trace/audit/lineage/effect refs。 | Step 6 domain truth/support objects;Step 9 Command template;Step 11 persistence;Step 12 side-effect rules。 | 只有 accepted business fact 可以进入,不能由 log/metric 替代。 |
| business audit | `MethodAssetAuditTrail`、lineage、trace material、impact summary 等 body-free audit 主语。 | Step 6 `MethodAssetAuditTrail` / lineage / trace material;Step 10 trace/audit state;Step 11 append-only。 | 审计只保存 refs、state、reason、source cursor、safe actor/source,不保存 raw log。 |
| outbox / event candidate marker | `MethodAssetEventCandidateAssembly`、publication boundary/outcome、publisher binding/worker result。 | Step 6 event candidate/publisher entry;Step 8 outbound shell;Step 9 outbound flow;Step 10 outbound state;Step 14 publisher binding。 | 表达 body-free event candidate 与 publication outcome;不等同于 old outbox delivery truth。 |
| handoff / export marker | `MethodAssetHandoffBindingState`、handoff hint、report boundary、receipt/failure refs。 | Step 6 handoff binding/result state;Step 9 handoff/outbound/job flow;Step 10 handoff state;Step 14 target binding。 | 只能保存 marker/ref/report boundary,不保存 observability ledger body、archive package body 或 external document body。 |
| job report / progress | maintenance task、progress、checkpoint、run history、stored job result/report。 | Step 6 jobs objects;Step 8 job shell;Step 9 operations job template;Step 10 job state;Step 13 replay。 | Job 只能刷新派生材料/追溯材料/外围材料或 convergence summary,不得修 core truth。 |
| diagnostic issue | `MethodAssetInfraSafeDiagnostic`、validation issue、degraded/unavailable/blocked marker。 | Step 6 safe diagnostic/degraded decision;Step 8 marker/rejection shell;Step 12 error recovery;Step 14 adapter/config availability。 | 只能记录 safe summary/ref/severity/follow-up,不保存 raw request/payload/response/stack trace/secret。 |

### 3. Flow family 观测定位思考

| Flow family | Step 9 边界 | 观测分层初判 | 不能做的事 |
|---|---|---|---|
| Command | 58 个写入口;唯一业务写入口;accepted transaction 保存 truth/history/trace/audit/lineage/effect/stored result。 | accepted 需要 business trace/audit/history + runtime log/metric;rejected/conflict/duplicate 只走 safe result、log/metric 和 stored replay。 | 不把 rejected/failed 写成 accepted audit;不靠日志替代 stored result。 |
| Query | 57 个只读入口;no-write;从 resolver/repository/mapper 复制 safe view/page/marker。 | 只写 runtime log/metric;可关联 read decision/degraded decision/diagnostic refs;不写 business audit。 | 不刷新 material、不 append trace/audit、不合成 marker、不通过观测后端反推 read state。 |
| Inbound Consumer | 4 个 body-free intake;accepted/duplicate/unsupported/malformed/delayed 返回 safe receipt。 | accepted intake 可写 receipt/worker result/log/metric;只有正式 intake marker/trace source 已闭合时才写 trace marker。 | 不创建 core truth;不保存 raw broker payload;duplicate 不重跑 intake。 |
| Outbound Event / Publisher | 34 个 body-free event candidate;publisher 只消费 stored candidate / target registry / availability outcome。 | candidate/publication outcome 可写 marker/report/log/metric;publication failure 不回滚 accepted truth。 | 不重读 current truth 组 payload;不写 topic/delivery receipt/raw payload;不恢复 old outbox relay。 |
| Operations Job | 8 个 maintenance/convergence job;run/duplicate/resume/checkpoint/partial/report。 | 写 job progress/checkpoint/run history/report、runtime log/metric;partial/degraded/unavailable 复制 formal marker。 | 不修 core truth;不把 raw report body、scheduler/queue 私有状态写入 report/audit。 |

### 4. Accepted / rejected / duplicate / no-write 总原则思考

| 分支类别 | 应进入的层 | 不应进入的层 | 关键理由 |
|---|---|---|---|
| Command accepted truth change | business trace / audit / history、stored result、event candidate/effect refs、runtime log、runtime metric。 | raw payload log、observability-only truth、external delivery body。 | accepted 是业务事实,必须可通过 Step 6/9/11 truth 与 audit 重放。 |
| Command validation/domain rejected | stored rejected safe result where required、runtime log、runtime metric、safe diagnostic。 | accepted trace/audit/history/event candidate。 | rejected 未产生业务 truth,不得伪造成 accepted fact。 |
| Command duplicate same digest | stored result replay、runtime log、runtime metric。 | 新 truth、新 audit、新 event candidate、新 job。 | duplicate 只证明 replay,不得重跑 mutation。 |
| Query success / empty / not visible | runtime log、runtime metric、read decision/degraded decision refs。 | audit、outbound、stored command result、projection repair。 | Query no-write 是 Step 9/10/12/13 共同红线。 |
| Query stale/degraded/unavailable | runtime log、runtime metric、copied marker/diagnostic/ref。 | synthetic marker、audit success、job auto repair。 | marker 必须 copy-only,repair 需显式 job/command。 |
| Inbound accepted intake | receipt/worker result、safe intake marker where formal、runtime log、runtime metric。 | core truth mutation、raw event payload、accepted command audit。 | Inbound 只承接 body-free external fact,truth mutation 需 explicit Command。 |
| Inbound duplicate / unsupported / malformed / delayed | stored receipt or safe worker result、runtime log、runtime metric。 | accepted intake trace、truth mutation、payload body。 | 这些分支没有新的 accepted local fact。 |
| Outbound candidate published | publication outcome marker、worker result、runtime log、runtime metric、report ref where formal。 | core truth rollback、delivery body、current truth rebuild。 | publisher 只消费 stored candidate。 |
| Outbound failed / blocked / unavailable | publication failure/blocked marker、safe diagnostic、runtime log、runtime metric。 | accepted business audit mutation、raw transport response。 | post-commit failure 不回滚 truth。 |
| Job completed | progress/checkpoint/run history/report、stored job result、runtime log、runtime metric。 | core truth mutation、raw report body。 | Job 维护派生材料和报告,不修 truth。 |
| Job partial / failed / duplicate | partial issue/report/checkpoint or stored report replay、runtime log、runtime metric。 | silent skip、new truth、scheduler-private result。 | failure 必须可恢复/可审计,duplicate 不重跑 body。 |

### 5. Step 6~14 回指思考

| 来源 Step | 分层时必须继承 | 对 R15.4 的写入提示 |
|---|---|---|
| Step 6 object contracts | body-free refs、safe marker、audit trail、trace material、stored result、read/degraded decision、event candidate、job progress/result、safe diagnostic。 | 写总原则时明确这些对象是正式承载,log/metric 不是替代物。 |
| Step 7 ports/adapters | repository/UoW/resolver/mapper/publisher/handoff/runtime availability 是观测切口来源。 | 后续日志/指标表按 port family 找打点位置。 |
| Step 8 protocol | metadata/correlation、actor/source、result/rejection、page/cursor、marker、receipt/report shell。 | trace context 只能来自 metadata/event/job envelope。 |
| Step 9 function flows | Command/Query/Inbound/Outbound/Job 五类 flow 和 branch/replay/side-effect ordering。 | R15.4 总矩阵必须覆盖五类 flow,不能只写 narrative。 |
| Step 10 state matrix | read/material freshness、idempotency、runtime/adapter availability、outbound/handoff/job state。 | 观测可以记录 state/marker ref,不能决定 state。 |
| Step 11 persistence | truth/audit/report/stored result/checkpoint/candidate 的持久化与 append-only。 | 日志不能代替 durable replay/report。 |
| Step 12 errors/recovery | rejected/failed/degraded/unavailable/blocked/partial/commit unknown 的 safe recovery surface。 | failed/rejected branch 只写 safe diagnostics/log/metric/report,不写 accepted audit。 |
| Step 13 concurrency/idempotency | duplicate replay、idempotency conflict、job resume、publication retry。 | duplicate/retry 观测必须证明 no rerun / no hidden mutation。 |
| Step 14 config/dependency | config validation、adapter availability、publisher/handoff binding、forbidden config boundary。 | 不写 config key/env/topic/URL;只写 binding/availability/ref。 |

### 6. R15.4 写入边界思考

`R15.4` 应将上述思考落成可审查表格,但仍不进入具体日志/指标/审计 final table:

1. 写可观测性分层原则表。
2. 写 flow family 总矩阵。
3. 写 accepted / rejected / duplicate / query no-write / failed / delayed / unsupported 观测定位表。
4. 写 forbidden substitution table: log/metric 不能替代 truth/audit/report/stored result/checkpoint/receipt。
5. 写 `R15.5 structured log cuts:先思考` 进入门禁。

### 7. R15.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考分层原则和总矩阵 | pass |
| 是否覆盖 Command / Query / Inbound / Outbound / Job 五类 flow | pass |
| 是否明确 accepted 与 rejected/failed/duplicate/no-write 分层差异 | pass |
| 是否继承 body-free、copy-only marker、stored replay 和 no hidden repair 红线 | pass |
| 是否未写最终日志/指标/审计事件表 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.4 可观测性分层与总原则:再写入`;只允许写入可观测性分层原则表、flow family 总矩阵、accepted/rejected/duplicate/query no-write/failed/delayed/unsupported 观测定位表、forbidden substitution table 和 `R15.5 structured log cuts:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终日志埋点表、指标埋点表、审计事件表、具体 metric name、log field schema、trace/span payload、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.4 可观测性分层与总原则:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R15.3` 推进到 `R15.4`。 |
| 本模块写入范围 | 可观测性分层原则表、flow family 总矩阵、accepted/rejected/duplicate/query no-write/failed/delayed/unsupported 观测定位表、forbidden substitution table 和 `R15.5` 进入门禁。 |
| 本模块禁止范围 | 最终日志埋点表、指标埋点表、审计事件表、具体 metric name、log field schema、trace/span payload、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook、config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. 可观测性分层原则表

| 层级 | 正式用途 | 来源与承载 | 必须记录的定位 | 禁止替代 |
|---|---|---|---|---|
| runtime log | 定位运行路径、错误分支、adapter/config/runtime 问题和排障上下文。 | API / worker / jobs entry、application service、repository/UoW、adapter binding、publisher/handoff/job runner。 | operation family、safe refs、result/disposition、safe diagnostic ref、duration/count direction。 | 不替代 business truth、audit、stored result、receipt、checkpoint、report。 |
| runtime metric | 提供低基数聚合计数、耗时、状态分布和失败分布。 | Step 8 protocol family、Step 9 flow family、Step 10 state/disposition family。 | kind/state/result/error category/adapter kind/source family 等低基数标签。 | 不承载 request id、actor id、subject id、trace id、payload digest、raw endpoint 或 free text。 |
| business trace / history | 串联 accepted business fact 的来源、对象、结果和后续读取/分发线索。 | Command accepted transaction 中的 truth/history/trace/lineage/effect refs。 | truth ref、trace material ref、history/audit ref、effect/candidate ref、stored result ref。 | 不由 rejected、failed、duplicate replay 或 query no-write 分支创建。 |
| business audit | 保存 accepted business / operations fact 的 body-free 审计线。 | `MethodAssetAuditTrail`、`MethodAssetEvidenceLineage`、trace material、impact summary。 | audit subject ref、actor/source ref、reason ref、state/ref、source cursor、report/receipt ref。 | 不保存 raw log、request body、payload、secret、provider response、stack trace。 |
| event candidate / publication marker | 表达 body-free event candidate 与 publisher outcome。 | `MethodAssetEventCandidateAssembly`、publisher binding、worker publisher result、publication boundary marker。 | candidate ref、publication outcome ref、target/binding ref、failure/blocked marker。 | 不恢复 old outbox delivery truth;不保存 topic、payload body、delivery receipt body。 |
| handoff / export marker | 表达 handoff target、report boundary、package/receipt/failure refs。 | handoff binding、handoff hint、report boundary、job/worker result。 | handoff marker ref、target ref、report boundary ref、receipt/failure ref。 | 不保存 observability ledger body、archive package body、external document body。 |
| job report / progress | 表达 maintenance/convergence run、checkpoint、partial issue、stored report。 | jobs entry/result/progress object、checkpoint、run history、stored job result。 | run ref、scope ref、checkpoint ref、progress view ref、partial issue ref、stored report ref。 | 不修 core truth;不把 raw report body 或 scheduler private state 当 report。 |
| diagnostic issue | 表达 safe failure/degraded/unavailable/blocked/validation issue。 | `MethodAssetInfraSafeDiagnostic`、degraded decision、availability marker、config validation issue。 | safe issue/ref/severity/follow-up、related safe refs。 | 不保存 raw request、raw event payload、adapter response body、stack trace、SQL、credential、secret。 |

### 3. Flow family 总矩阵

| Flow family | 数量 | 正式执行边界 | 正向观测层 | 非正向/异常观测层 | 总原则 |
|---|---:|---|---|---|---|
| Command | 58 | 唯一业务写入口;accepted transaction 保存 truth、history/trace/audit/lineage/effect、stored result。 | accepted 写 business trace/audit/history、event candidate/effect refs、runtime log/metric。 | rejected/conflict/duplicate/commit unknown 写 safe result/diagnostic/log/metric;duplicate 复制 stored result。 | 只有 accepted truth change 形成 business fact。 |
| Query | 57 | 永远 no-write;从 repository/resolver/mapper 复制 view/page/marker。 | successful/empty/not-visible/stale/degraded/unavailable 只写 runtime log/metric 和 safe read/degraded refs。 | degraded/unavailable 写 copied marker/diagnostic;不写 audit/outbound/stored command result。 | Query 不修 material,不 append trace/audit,不合成 marker。 |
| Inbound Consumer | 4 | body-free intake;accepted/duplicate/unsupported/malformed/delayed 返回 safe receipt / worker result。 | accepted intake 写 receipt/worker result/log/metric;若正式 marker/trace source 存在可记录 marker trace。 | duplicate/unsupported/malformed/delayed 写 stored receipt or safe worker result/log/metric。 | Inbound 不创建 core truth;truth mutation 需 explicit Command。 |
| Outbound Event / Publisher | 34 | stored accepted fact/job/intake source -> event candidate -> target registry -> publisher outcome。 | candidate/publication outcome 写 marker/report/log/metric。 | failed/blocked/unavailable 写 safe outcome/diagnostic/log/metric;不回滚 truth。 | Publisher 不重读 current truth 构造 payload。 |
| Operations Job | 8 | job shell -> checkpoint/progress -> committed read -> derived material/progress/checkpoint/report -> stored job result。 | completed 写 progress/checkpoint/run history/report/log/metric。 | partial/failed/duplicate 写 partial issue/report/checkpoint or stored report replay/log/metric。 | Job 只维护派生材料和报告,不得修 core truth。 |

### 4. 分支观测定位表

| 分支类别 | 允许进入 | 禁止进入 | 说明 |
|---|---|---|---|
| accepted command truth change | business trace、audit/history、stored result、event candidate/effect refs、runtime log/metric。 | raw request/payload log、observability-only truth、external delivery body。 | 这是本仓业务事实,必须 durable and replayable。 |
| validation rejected | safe rejection/result where required、diagnostic issue、runtime log/metric。 | accepted trace/audit/history、event candidate。 | 请求未进入业务事实。 |
| domain rejected / policy denied | safe rejection/result、reason/marker ref、runtime log/metric。 | accepted trace/audit/history/outbound。 | 业务规则拒绝不是成功变更。 |
| idempotency conflict / in-flight | conflict ref / safe result、runtime log/metric。 | truth mutation、audit、event candidate。 | same key different digest 或正在处理不得产生新 side effect。 |
| duplicate same digest | stored result/receipt/report replay、runtime log/metric。 | 新 truth、新 audit、新 event candidate、新 job scan。 | duplicate 只能证明 replay source 存在。 |
| commit unknown / stored replay missing | safe diagnostic、manual/intervention issue、runtime log/metric、recovery report where formal。 | 重跑 mutation、重读 truth 重建 response。 | 需保持可恢复和可审计,不能由 observability 补口。 |
| query success / empty | runtime log/metric、read decision/page refs。 | audit/outbound/stored result/projection repair。 | Query no-write。 |
| query not-visible | runtime log/metric、visibility/read marker where formal。 | truth existence leak、audit/outbound。 | 不泄露对象是否存在。 |
| query stale / degraded / unavailable | copied marker/diagnostic/ref、runtime log/metric。 | synthetic marker、accepted audit、implicit repair job。 | marker 来源必须正式闭口。 |
| inbound accepted intake | receipt/worker result、intake marker where formal、runtime log/metric。 | core truth mutation、raw event payload、accepted command audit。 | 只承接 body-free external fact。 |
| inbound unsupported / malformed / delayed | safe receipt/worker result、diagnostic/log/metric。 | raw payload、accepted intake trace、truth mutation。 | 未形成新的 accepted local fact。 |
| outbound published | publication outcome marker、worker result/report ref where formal、runtime log/metric。 | core truth rollback、delivery body、current truth rebuild。 | 只消费 stored candidate。 |
| outbound failed / blocked / unavailable | publication failure/blocked/unavailable marker、safe diagnostic、runtime log/metric。 | business audit mutation、raw transport response。 | post-commit failure 不影响已提交 truth。 |
| job completed | progress/checkpoint/run history/report/stored job result、runtime log/metric。 | core truth mutation、raw report body。 | 维护派生材料和收敛报告。 |
| job partial / failed | partial issue/report/checkpoint、safe diagnostic、runtime log/metric。 | silent skip、raw report body、automatic truth repair。 | 失败必须有 safe report or issue surface。 |
| job duplicate / resume | checkpoint/run history/stored report replay、runtime log/metric。 | 重跑已完成 job body、scheduler private state。 | resume/replay 来源必须 durable。 |

### 5. Forbidden substitution table

| 不能用 | 替代对象 | 原因 | 正确口径 |
|---|---|---|---|
| runtime log | business truth | log 不具备事务原子性、version、replay 和 domain invariant。 | accepted truth 写 Step 6/11 正式对象。 |
| runtime metric | 单记录审计 | metric 是聚合值,标签必须低基数。 | 单记录定位走 audit/trace/log/report ref。 |
| log/metric | stored operation result | duplicate replay 需要 stable stored surface。 | Command/Inbound/Job duplicate 复制 stored result/receipt/report。 |
| safe diagnostic | domain state | diagnostic 只解释失败或降级,不拥有状态迁移。 | state 由 Step 10 正式状态主语承载。 |
| adapter raw status | public marker | raw status 不等于业务/public surface marker。 | marker 从 resolver/mapper/availability 输出复制。 |
| query read log | query audit | Query no-write,读请求不写 business audit。 | 只记录 runtime log/metric 和 safe read refs。 |
| publisher failure log | publication outcome marker | 日志不能替代 publisher/outcome state。 | failed/blocked/unavailable outcome 写正式 marker/result/report。 |
| job log | job report/checkpoint | 日志不可恢复 job progress。 | Job 写 progress/checkpoint/run history/report。 |
| handoff log | handoff marker/receipt | 日志不能证明 handoff target/outcome。 | 写 handoff marker、target ref、receipt/failure ref。 |
| observability backend | schema/mapper/port 缺口 | 观测系统不是设计真相源。 | 缺 schema/marker/mapper/port 时暂停回设计闭口。 |

### 6. R15.5 进入门禁

`R15.5 structured log cuts:先思考` 只允许思考结构化日志切口:

1. 按 API / application / worker / jobs / repository/UoW / adapter / config / publisher / handoff 划分日志位置。
2. 为 accepted、rejected、duplicate、query no-write、failed、blocked、unavailable、partial 分支识别日志目的。
3. 只思考日志等级、字段类别和红线,不写最终日志埋点表。
4. 不写 metric cuts、audit event table、trace/span payload、test schema 或 implementation code。

### 7. R15.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入可观测性分层原则表 | pass |
| 是否写入 Command / Query / Inbound / Outbound / Job flow family 总矩阵 | pass |
| 是否写入主要分支观测定位表 | pass |
| 是否写入 forbidden substitution table | pass |
| 是否未写最终日志/指标/审计事件表 | pass |
| 是否未写 metric name、log field schema、trace/span payload | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.5 structured log cuts:先思考`;只允许思考 API / application / worker / jobs / repository/UoW / adapter / config / publisher / handoff 的结构化日志切口、日志等级候选、字段类别和红线;不得直接修改正式 `03-详细设计.md`;不得写最终日志埋点表、指标埋点表、审计事件表、具体 metric name、trace/span payload、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.5 structured log cuts:先思考

### 1. 当前模块目标

`R15.5` 只思考结构化日志切口,为 `R15.6` 写入日志埋点表做准备。当前模块不写最终日志埋点表,不写指标表、审计事件表、trace/span payload、test schema 或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 API / application / worker / jobs / repository/UoW / adapter / config / publisher / handoff 的日志位置、等级候选、字段类别、用途和红线。 |
| 当前禁止 | 写最终日志埋点表、指标埋点表、审计事件表、metric name、trace/span payload、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook、config key/env/topic/URL 或正式 `03-详细设计.md`。 |

### 2. 日志位置思考

| 位置族 | 需要日志的原因 | 初步等级方向 | 字段类别方向 |
|---|---|---|---|
| API command entry | command metadata / actor / idempotency / runtime precheck 失败需要定位。 | accepted/info;validation rejected/warn;runtime blocked/error。 | command kind、safe actor/source ref、operation context ref、diagnostic ref、result kind。 |
| API query entry | query no-write surface、empty/not-visible/degraded/unavailable 需要定位。 | success/info or debug;not-visible/info;degraded/warn。 | query kind、read context ref、surface kind、safe marker ref、page/result count category。 |
| Application command service | accepted transaction、domain rejected、duplicate replay、stored result failure 是核心日志切口。 | accepted/info;domain rejected/warn;commit unknown/error。 | command family、truth/effect/stored result refs、safe reason ref、duration category。 |
| Application query service | resolver / mapper / material 读取结果要与 no-write 红线对应。 | success/debug or info;degraded/warn;consistency defect/error。 | query family、view/material family、read decision ref、degraded marker ref。 |
| Idempotency / replay support | duplicate、conflict、in-flight、stored result missing 要证明是否重跑。 | duplicate/info;conflict/warn;missing/error。 | operation group、idempotency scope ref、stored result/receipt/report ref、conflict ref。 |
| Repository / UoW | version conflict、unique conflict、commit unknown、rollback failure 影响恢复。 | conflict/warn;commit unknown/error;rollback failed/error。 | repository family、uow phase、resource family、expected version category、diagnostic ref。 |
| Worker inbound consumer | source envelope validation、unsupported、duplicate、delayed、accepted intake 需要日志。 | accepted/info;unsupported/warn;malformed/error or warn;delayed/warn。 | consumer family、source family、schema version ref、receipt/ref、safe diagnostic ref。 |
| Worker publisher / outbound | candidate load、target blocked、publication success/failure/unavailable 需要日志。 | published/info;blocked/warn;failed/error。 | event family、candidate ref、publisher binding ref、publication outcome ref、target ref。 |
| Jobs runner | run start/finish、checkpoint/resume、partial/failure、duplicate replay 需要日志。 | summary/info;partial/warn;failed/error;duplicate/info。 | job family、run ref、scope ref、checkpoint ref、report ref、partial issue refs category。 |
| Adapter / resolver | external body-free resolver、availability、handoff adapter、publisher adapter 失败需要定位。 | success/debug;unavailable/warn;boundary violation/error。 | adapter family、binding ref、availability state、safe diagnostic ref。 |
| Config / runtime builder | validation rejected、forbidden configurable boundary、runtime assembly failure 是开工前问题。 | rejected/error;assembly degraded/warn;ready/info。 | config source ref、binding family、runtime assembly state ref、validation issue ref。 |
| Handoff / report boundary | handoff prepared/delivered/failed 必须与 body-free report boundary 对齐。 | prepared/info;delivered/info;failed/warn or error。 | handoff family、target ref、marker ref、report boundary ref、receipt/failure ref。 |

### 3. 日志字段类别思考

| 字段类别 | 允许记录 | 禁止记录 |
|---|---|---|
| correlation | trace/context/correlation safe ref、operation context ref、worker/job context ref。 | raw header、token、transport request id 原文。 |
| actor/source | typed actor ref、source family、safe source summary ref。 | provider account、adapter private identity、secret、credential。 |
| operation | command/query/consumer/event/job family、operation group、entry family。 | HTTP route、RPC method、topic、queue、cron 表达式。 |
| object refs | truth ref、view/material ref、candidate ref、receipt/report/result ref、marker ref。 | object body、method content body、artifact/archive body、raw report body。 |
| status | result/disposition/surface/freshness/availability/error category。 | raw exception text、SQL text、HTTP response body、provider payload。 |
| diagnostic | safe diagnostic ref、validation issue ref、safe reason ref、follow-up hint ref。 | stack trace、secret、connection string、raw config、adapter response body。 |
| size/duration | bounded count category、duration category or measured duration if implementation policy allows。 | high-cardinality payload digest、free text body summary、raw endpoint。 |

### 4. R15.6 写入边界思考

`R15.6` 应把本模块思考落成日志埋点表和日志字段红线:

1. 写 structured log cut table:位置、日志级别、字段类别、目的。
2. 覆盖 API / application / worker / jobs / repository/UoW / adapter / config / publisher / handoff。
3. 写日志字段规则和禁止字段表。
4. 写 `R15.7 metric cuts:先思考` 进入门禁。

### 5. R15.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考结构化日志切口 | pass |
| 是否覆盖主要 entry / service / worker / job / infra 位置 | pass |
| 是否明确日志等级候选和字段类别 | pass |
| 是否未写最终日志埋点表 | pass |
| 是否未写 metric / audit / trace / test / implementation 内容 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.6 structured log cuts:再写入`;只允许写入 structured log cut table、日志字段规则和禁止字段表、`R15.7 metric cuts:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写指标埋点表、审计事件表、具体 metric name、trace/span payload、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.6 structured log cuts:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R15.5` 推进到 `R15.6`。 |
| 本模块写入范围 | structured log cut table、日志字段规则、禁止字段表和 `R15.7` 进入门禁。 |
| 本模块禁止范围 | 指标埋点表、审计事件表、metric name、trace/span payload、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook、config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. structured log cut table

| 位置 | 日志级别 | 字段类别 | 目的 |
|---|---|---|---|
| API command entry accepted | info | correlation ref、command family、actor/source ref、operation context ref、result ref category | 证明 command 入口被接收并进入正式 service flow。 |
| API command metadata / body validation rejected | warn | correlation ref、command family、validation issue ref、safe diagnostic ref | 定位请求壳、metadata、boundary 或 no-body 违规。 |
| API command runtime precheck blocked | error | command family、runtime assembly state ref、adapter availability ref、diagnostic ref | 说明 runtime / dependency 未 ready,且未进入业务写。 |
| API query entry completed | info or debug | correlation ref、query family、read context ref、surface kind、page/result count category | 追踪 query no-write 返回面。 |
| API query not-visible / degraded / unavailable | info / warn | query family、read decision ref、degraded marker ref、safe diagnostic ref | 解释 body-free read surface,不泄露 truth。 |
| Application command accepted transaction | info | command family、truth ref category、audit/trace ref category、stored result ref、event candidate/effect ref | 串联 accepted truth、audit 和 replay surface。 |
| Application command domain rejected | warn | command family、subject ref category、reason/marker ref、safe diagnostic ref | 区分业务拒绝与系统失败。 |
| Application command duplicate replay | info | command family、idempotency scope ref、stored result ref、replay decision ref | 证明 duplicate 未重跑 mutation。 |
| Application command idempotency conflict / in-flight | warn | command family、idempotency scope ref、conflict ref、safe result ref | 定位 same key different digest 或并发处理中。 |
| Application command commit unknown / stored result missing | error | command family、uow phase、stored result ref optional、diagnostic ref、recovery issue ref | 触发 recovery / manual intervention,禁止重建响应。 |
| Application query read success / empty | debug or info | query family、view/material family、read decision ref、page cursor category | 证明 query 只读且没有 hidden repair。 |
| Application query stale / degraded / consistency defect | warn / error | query family、freshness/availability marker ref、degraded decision ref、diagnostic ref | 定位读面降级和 marker 来源。 |
| Repository version / unique conflict | warn | repository family、resource family、expected version category、safe diagnostic ref | 排查 optimistic version / uniqueness 冲突。 |
| Repository unavailable | error | repository family、operation family、store binding state ref、safe diagnostic ref | 定位 store binding 或 repository failure。 |
| UoW begin / commit / rollback failure | error | uow phase、operation group、operation context ref、diagnostic ref | 支撑 commit unknown、rollback failed 和恢复分析。 |
| Inbound consumer envelope accepted | info | consumer family、source family、schema version ref、receipt ref、worker result ref | 追踪 body-free intake 成功。 |
| Inbound consumer duplicate replay | info | consumer family、source family、dedup scope ref、stored receipt ref | 证明 duplicate 未重写 intake / marker。 |
| Inbound consumer unsupported / malformed / delayed | warn | consumer family、source family、schema version ref、safe diagnostic ref、worker result ref | 说明未解析 raw payload 或延迟处理。 |
| Outbound candidate assembled | debug | event family、candidate ref、source result/report/intake ref、marker ref | 证明 candidate 来源于 stored accepted fact。 |
| Outbound publisher target blocked | warn | event family、candidate ref、target ref、publisher binding ref、blocked marker ref | 说明未执行发布且不回滚 truth。 |
| Outbound publication success | info | event family、candidate ref、publication outcome ref、target ref | 追踪 publication outcome。 |
| Outbound publication failed / unavailable | warn or error | event family、candidate ref、publisher binding ref、failure marker ref、diagnostic ref | 支撑 retry / recovery,不保存 transport body。 |
| Job runner started / resumed | info | job family、run ref、scope ref、checkpoint ref optional、job context ref | 追踪 maintenance run 和 resume 来源。 |
| Job duplicate replay | info | job family、run ref、stored report ref、checkpoint/run history ref | 证明 duplicate 不重跑 job body。 |
| Job item partial / failed | warn or error | job family、run ref、target family、partial issue ref、report boundary ref | 保留 partial failure 的 safe 定位。 |
| Job completed | info | job family、run ref、progress view ref、checkpoint ref、stored report ref、duration/count category | 汇总 job 成功结果和 report。 |
| External resolver success | debug | resolver family、source ref category、adapter binding ref、safe summary ref | 追踪 body-free resolution。 |
| External resolver unavailable / boundary violation | warn or error | resolver family、adapter availability ref、boundary marker ref、diagnostic ref | 说明 external body / adapter failure 未进入本仓正文。 |
| Runtime config validation rejected | error | config source ref、binding family、validation issue ref、diagnostic ref | 定位 config binding 失败,不记录 key/value/secret。 |
| Runtime assembly ready / degraded | info or warn | runtime assembly state ref、adapter availability state ref、diagnostic ref optional | 说明 entry 前 runtime readiness。 |
| Handoff prepared / delivered | info | handoff family、target ref、marker ref、report boundary ref、receipt ref optional | 追踪 body-free handoff outcome。 |
| Handoff failed / target rejected | warn or error | handoff family、target ref、failure ref、diagnostic ref、report boundary ref | 说明 handoff 失败且不保存 external document body。 |

### 3. 日志字段规则

| 字段规则 | 正式要求 |
|---|---|
| correlation ref | 来自 Step 8 metadata / event / job envelope 或 Step 6 operation context;不得由 domain object 自行生成。 |
| actor/source ref | 只能记录 typed ref 或 safe summary ref;不得记录 provider account、token、credential、raw header。 |
| operation family | 记录 command/query/consumer/event/job family,不得记录 route、topic、queue、cron 或 endpoint。 |
| object/ref field | 只记录 body-free refs、result refs、receipt/report refs、marker refs、diagnostic refs。 |
| key/digest field | idempotency / dedup 只能记录 typed scope ref 或 redacted one-way fingerprint,不得记录 caller raw key。 |
| diagnostic field | 只能指向 safe diagnostic / validation issue / reason ref。 |
| level rule | accepted / duplicate / completed 用 info;normal high-frequency resolver/read success 可用 debug;rejected/not-visible/blocked/degraded/partial 用 warn;commit unknown、rollback failed、repository unavailable、config rejected、body boundary violation 用 error。 |
| clock/duration | duration 由 entry/service/worker/job 边界记录;domain object 不读取 clock。 |

### 4. 日志禁止字段表

| 禁止字段 | 禁止原因 | 替代方式 |
|---|---|---|
| raw request body / raw event payload | 违反 body-free boundary。 | typed request/event shell ref、validation issue ref。 |
| method asset body / artifact body / archive package body | 本仓只保存 refs / safe summary。 | method asset ref、artifact/archive ref、report boundary ref。 |
| adapter response body / provider payload | 外部正文不进入本仓日志。 | adapter binding ref、availability marker、diagnostic ref。 |
| stack trace / SQL / transport error body | 可能泄露实现和敏感数据。 | stable error category、safe diagnostic ref。 |
| secret / token / credential / connection string | 安全边界。 | config source ref、binding family、validation issue ref。 |
| raw endpoint / topic / queue / route / cron | 配置与 transport 细节后移。 | adapter family、binding ref、operation family。 |
| actor id / subject id 原文 | 可能是高敏或跨仓私有身份。 | typed boundary ref、safe actor/source ref。 |
| free text explanation | 不可稳定测试和易泄露。 | safe reason ref、diagnostic code/ref。 |

### 5. R15.7 进入门禁

`R15.7 metric cuts:先思考` 只允许思考指标切口:

1. 按 Command / Query / Inbound / Outbound / Job / repository/UoW / adapter/config/runtime / handoff 划分 metric family。
2. 思考 counter / histogram / gauge 的适用边界。
3. 思考低基数 label 和禁止 label。
4. 不写最终指标埋点表、不写具体 metric name、不写告警阈值或 dashboard。

### 6. R15.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 structured log cut table | pass |
| 是否覆盖 API / application / worker / jobs / repository/UoW / adapter / config / publisher / handoff | pass |
| 是否写入日志字段规则 | pass |
| 是否写入禁止字段表 | pass |
| 是否未写指标表、审计事件表、trace/span payload | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.7 metric cuts:先思考`;只允许思考 Command / Query / Inbound / Outbound / Job / repository/UoW / adapter/config/runtime / handoff 的指标 family、counter/histogram/gauge 适用边界、低基数 label 和禁止 label;不得直接修改正式 `03-详细设计.md`;不得写最终指标埋点表、具体 metric name、审计事件表、trace/span payload、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.7 metric cuts:先思考

### 1. 当前模块目标

`R15.7` 只思考指标切口,为 `R15.8` 写入指标埋点表做准备。当前模块不写最终指标埋点表、不写具体 metric name、不写告警阈值、SLO、dashboard 或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考指标 family、counter/histogram/gauge 适用边界、打点位置类别、低基数 label 和禁止 label。 |
| 当前禁止 | 写最终指标埋点表、具体 metric name、审计事件表、trace/span payload、test case schema、implementation code、alert threshold、SLO、dashboard、sampling、retention、runbook、config key/env/topic/URL 或正式 `03-详细设计.md`。 |

### 2. metric family 思考

| 指标族 | 需要衡量什么 | 类型方向 | 打点位置方向 |
|---|---|---|---|
| Command | accepted/rejected/duplicate/conflict/error 数量和耗时。 | counter + histogram | API command handler / application command service 返回前。 |
| Query | success/empty/not-visible/stale/degraded/unavailable 数量和耗时。 | counter + histogram | API query handler / query service 返回前。 |
| Inbound Consumer | accepted/duplicate/unsupported/malformed/delayed 数量和耗时。 | counter + histogram | worker consumer service 返回前。 |
| Outbound / publisher | candidate assembled、published、blocked、failed、unavailable 数量和耗时。 | counter + histogram | candidate assembly / publisher outcome 后。 |
| Operations Job | run/completed/partial/failed/duplicate/resume 数量、耗时和 item 结果。 | counter + histogram + gauge where formal | job runner / item loop / report save 后。 |
| Repository / UoW | conflict、unavailable、commit unknown、rollback failed 数量和事务耗时。 | counter + histogram | repository error mapping / UoW phase boundary。 |
| Idempotency / replay | reserved、duplicate、conflict、in-flight、stored missing 数量。 | counter | idempotency guard decision 后。 |
| Adapter / resolver availability | ready/degraded/unavailable、resolution success/failure 数量和耗时。 | counter + histogram + gauge where formal | resolver call boundary / availability state update。 |
| Config / runtime assembly | config validation accepted/rejected、runtime ready/degraded/blocked 数量。 | counter + gauge where formal | runtime builder / config validation 后。 |
| Handoff / report boundary | prepared/delivered/failed/target rejected 数量和耗时。 | counter + histogram | handoff service / adapter outcome 后。 |

### 3. 低基数 label 思考

| label 类别 | 允许方向 | 示例方向 |
|---|---|---|
| operation kind | finite command/query/consumer/event/job family。 | command family、query family、job family。 |
| result/disposition | finite accepted/rejected/duplicate/failed/blocked/unavailable/partial。 | result kind、surface kind、worker disposition。 |
| resource family | finite domain/read/material/report/candidate family。 | repository family、view family、material family。 |
| error category | stable category,非 raw message。 | validation、domain_rejected、conflict、unavailable、commit_unknown。 |
| adapter family | logical adapter slot/kind,非 endpoint。 | external resolver、publisher、handoff、store binding。 |
| state category | finite availability/freshness/progress state。 | fresh/stale/degraded/unavailable、ready/blocked。 |

### 4. 禁止 label 思考

| 禁止 label | 原因 |
|---|---|
| request ref / trace id / correlation id | 高基数,应用日志/trace ref 定位。 |
| actor ref / subject ref / truth ref | 高基数且可能敏感。 |
| candidate / receipt / report / marker / diagnostic ref | 高基数;应进入日志或审计。 |
| idempotency key / dedup key / payload digest | 高基数且可能泄露调用信息。 |
| raw endpoint / topic / queue / route / cron | config/transport 细节,不得进入 Step 15 metric label。 |
| raw error text / free text / SQL / HTTP body | 不稳定且敏感。 |
| secret / token / credential / connection string | 安全禁止。 |

### 5. R15.8 写入边界思考

`R15.8` 应将上述思考落成指标埋点表:

1. 写 metric cut table:指标族、类型、打点位置、低基数标签。
2. 覆盖 Command / Query / Inbound / Outbound / Job / repository/UoW / idempotency / adapter/config/runtime / handoff。
3. 写 metric label rules 和禁止 label 表。
4. 写 `R15.9 trace / span / correlation cuts:先思考` 进入门禁。

### 6. R15.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考指标切口 | pass |
| 是否覆盖主要 metric family | pass |
| 是否区分 counter / histogram / gauge 适用方向 | pass |
| 是否明确低基数 label 与禁止 label | pass |
| 是否未写最终指标埋点表或具体 metric name | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.8 metric cuts:再写入`;只允许写入 metric cut table、metric label rules、禁止 label 表和 `R15.9 trace / span / correlation cuts:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写审计事件表、trace/span payload、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.8 metric cuts:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R15.7` 推进到 `R15.8`。 |
| 本模块写入范围 | metric cut table、metric label rules、禁止 label 表和 `R15.9` 进入门禁。 |
| 本模块禁止范围 | 审计事件表、trace/span payload、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook、config key/env/topic/URL、正式 `03-详细设计.md`。 |

### 2. metric cut table

| 指标族 | 类型 | 打点位置 | 低基数标签 |
|---|---|---|---|
| Command request/result | counter | API command handler 或 application command service 返回前。 | command family、result kind、error category。 |
| Command duration | histogram | command entry 包裹 service flow。 | command family、result kind。 |
| Command accepted truth change | counter | accepted transaction 保存 truth / stored result 后。 | truth family、operation family。 |
| Command rejection / conflict | counter | validation/domain/idempotency/version rejection 映射后。 | command family、rejection category、error category。 |
| Query request/result | counter | API query handler 或 query service 返回前。 | query family、surface kind、freshness category。 |
| Query duration | histogram | query entry 包裹 read flow。 | query family、surface kind。 |
| Query degraded / unavailable | counter | read decision / degraded decision 形成后。 | query family、degraded category、availability category。 |
| Inbound consumer result | counter | worker inbound consumer 返回 receipt / worker result 前。 | consumer family、source family、disposition。 |
| Inbound consumer duration | histogram | worker 包裹 intake flow。 | consumer family、disposition。 |
| Inbound unsupported / malformed | counter | unsupported / malformed / body-free violation surface 形成后。 | consumer family、source family、error category。 |
| Outbound candidate assembly | counter | event candidate assembly 完成后。 | event family、source family、candidate result。 |
| Outbound publication result | counter | publisher outcome 形成后。 | event family、publication result、target category。 |
| Outbound publication duration | histogram | publisher adapter / target registry 调用边界。 | event family、publication result、target category。 |
| Operations job result | counter | job runner 返回 stored report/result 前。 | job family、disposition、result category。 |
| Operations job duration | histogram | job runner 包裹 application job service。 | job family、disposition。 |
| Operations job item result | counter | job item loop 每项形成 outcome 后。 | job family、item result、target family。 |
| Operations job active/progress | gauge where formal | progress view / run history 保存或读取后。 | job family、progress state。 |
| Repository error | counter | repository / store binding error 映射时。 | repository family、error category。 |
| Repository operation duration | histogram | repository read/write boundary where available。 | repository family、operation category、result category。 |
| UoW phase result | counter | UoW begin / commit / rollback 返回后。 | uow phase、result category。 |
| UoW duration | histogram | UoW boundary。 | operation group、result category。 |
| Idempotency decision | counter | idempotency reserve / duplicate / complete / conflict / missing 判断后。 | operation group、decision category。 |
| Stored replay result | counter | command / inbound / job replay source 读取后。 | operation group、stored surface kind、result category。 |
| Adapter availability state | gauge where formal | runtime assembly / adapter availability state 更新后。 | adapter family、availability state。 |
| External resolver result | counter | resolver call 完成后。 | resolver family、adapter family、result category。 |
| External resolver duration | histogram | resolver adapter call boundary。 | resolver family、adapter family、result category。 |
| Runtime config validation result | counter | config validation 完成后。 | binding family、result category。 |
| Runtime assembly state | gauge where formal | runtime builder 输出 assembly state 后。 | runtime slot family、assembly state。 |
| Handoff result | counter | handoff prepared / delivered / failed / target rejected 后。 | handoff family、target category、result category。 |
| Handoff duration | histogram | handoff adapter / report boundary call 前后。 | handoff family、target category、result category。 |

### 3. metric label rules

| 规则 | 正式要求 |
|---|---|
| 低基数优先 | label 只能使用有限枚举式 family / kind / state / result / disposition / category。 |
| family 而非 identity | command/query/job/event/repository/adapter 只记录 family,不记录单个对象 identity。 |
| category 而非文本 | error、rejection、degraded、availability 使用 stable category,不得用 raw message。 |
| result 拆分 | accepted、rejected、duplicate、failed、blocked、unavailable、partial、not-visible、empty 等 result/disposition 必须稳定同义。 |
| metric 不做单记录定位 | 单记录定位通过 structured log、trace/audit refs、report refs、diagnostic refs 完成。 |
| domain 无 metric backend | domain object 不依赖 metric backend;指标由 entry/service/worker/job/infra boundary 记录。 |
| gauge 受限 | gauge 只用于正式 state/progress/availability 汇总,不得从日志临时扫描或 adapter raw status 推导。 |
| histogram 受限 | histogram 只记录 entry/service/adapter/job/repository 边界耗时,不把业务正文大小或 payload digest 作为维度。 |

### 4. 禁止 label 表

| 禁止 label | 禁止原因 | 替代方式 |
|---|---|---|
| request ref / trace id / correlation id | 高基数。 | structured log 或 trace/correlation ref。 |
| actor ref / subject ref / truth ref | 高基数且可能敏感。 | actor/source family、resource family。 |
| result ref / receipt ref / report ref | 高基数。 | stored surface kind、result category。 |
| candidate ref / marker ref / diagnostic ref | 高基数,不适合聚合。 | event family、marker category、error category。 |
| idempotency key / dedup key | 高基数且可能泄露调用行为。 | operation group、decision category。 |
| payload digest / material digest | 高基数且可能泄露内容关联。 | resource family、candidate result。 |
| raw endpoint / route / topic / queue / cron | transport/config 细节。 | adapter family、target category、operation family。 |
| raw error text / exception / SQL / HTTP body | 不稳定且敏感。 | stable error category、safe diagnostic ref in log。 |
| secret / token / credential / connection string | 安全禁止。 | binding family、validation result。 |
| free text / user supplied label | 不可控高基数和泄露风险。 | stable enum category。 |

### 5. R15.9 进入门禁

`R15.9 trace / span / correlation cuts:先思考` 只允许思考 trace context、span boundary 和 correlation:

1. 回指 Step 8 metadata / event / job envelope 的 trace/correlation 来源。
2. 思考 API / application / worker / jobs / adapter / publisher / handoff 的 span 边界。
3. 思考 duplicate replay、stored result、receipt/report、candidate/publication outcome 的 correlation。
4. 不写 trace/span payload schema、不写审计事件表、不写 test schema 或 implementation code。

### 6. R15.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 metric cut table | pass |
| 是否覆盖 Command / Query / Inbound / Outbound / Job / repository/UoW / idempotency / adapter/config/runtime / handoff | pass |
| 是否写入 metric label rules | pass |
| 是否写入禁止 label 表 | pass |
| 是否未写具体 metric name、告警阈值、SLO、dashboard | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.9 trace / span / correlation cuts:先思考`;只允许思考 trace context 来源、span boundary、correlation refs、duplicate replay / stored result / receipt / report / event candidate / publication outcome 的关联;不得直接修改正式 `03-详细设计.md`;不得写 trace/span payload schema、审计事件表、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.9 trace / span / correlation cuts:先思考

### 1. 当前模块目标

`R15.9` 只思考 trace context 来源、span boundary 和 correlation refs,为 `R15.10` 写入 trace / span / correlation cut table 做准备。当前模块不写 trace/span payload schema、不写审计事件表、不写 test case schema、不写 implementation code,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 trace context 来源、API / application / worker / jobs / adapter / publisher / handoff span boundary、stored result / receipt / report / candidate / publication outcome correlation。 |
| 当前禁止 | 写 trace/span payload schema、审计事件表、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook、config key/env/topic/URL 或正式 `03-详细设计.md`。 |

### 2. trace / correlation 来源思考

| 来源族 | 正式来源 | 可关联对象 | 当前裁决 |
|---|---|---|---|
| API Command | Step 8 command envelope 的 shared metadata / actor / source / idempotency 与 Step 9 operation context。 | command family、operation context ref、idempotency scope ref、stored command result ref。 | trace context 只能从 entry metadata / operation context 复制或派生为 safe ref,domain truth 不自行生成 trace context。 |
| API Query | Step 8 query envelope 的 shared metadata / actor / source 与 Step 9 read context。 | query family、read context ref、read decision ref、view/page/degraded marker ref。 | Query no-write,只关联 read surface 和 safe marker,不创建 audit / stored command result。 |
| Inbound Consumer | Step 8 inbound envelope metadata / source 和 Step 9 body-free intake decision。 | inbound source ref、dedup scope ref、receipt ref、worker result ref。 | 不使用 broker raw payload、topic、offset 或 ack 作为 trace source。 |
| Outbound Publisher | stored accepted fact / stored job report / intake receipt、event candidate assembly、publication outcome。 | candidate ref、source result/report/receipt ref、target ref、publication outcome ref。 | Publisher span 只围绕 candidate 和 publisher outcome,不得重读 current truth 生成 payload。 |
| Operations Job | job input/context/run/checkpoint/report shell 和 Step 13 resume / replay source。 | job run ref、scope ref、checkpoint ref、progress ref、stored report ref、partial issue ref。 | Job duplicate/resume correlation 必须指向 checkpoint/run history/stored report,不得使用 scheduler attempt、queue offset 或 lease 作为业务 proof。 |
| Adapter / runtime / config | runtime assembly state、adapter binding state、availability marker、safe diagnostic。 | adapter binding ref、availability state ref、runtime assembly state ref、validation issue ref。 | 只关联 safe refs 和 diagnostic,不记录 raw endpoint、URL、topic、config value、provider payload。 |
| Handoff / report boundary | handoff marker、target ref、report boundary ref、receipt/failure ref。 | handoff marker ref、target ref、report boundary ref、receipt/failure ref。 | Handoff trace 只证明 local body-free boundary,不保存 external document body 或 archive package body。 |

### 3. span boundary 思考

| span boundary | 起点 | 终点 | 应关联的 safe refs | 禁止内容 |
|---|---|---|---|---|
| API command entry span | command shell accepted by entry facade。 | response/rejection/duplicate surface 返回。 | correlation ref、command family、operation context ref、stored result/ref or rejection ref。 | raw request body、route、header、token。 |
| Application command service span | operation context 创建后。 | UoW/stored result/commit observation 结束。 | truth ref category、audit/trace/effect ref category、stored result ref、idempotency decision ref。 | truth body、raw error text、rebuild response。 |
| API query entry span | query shell accepted by entry facade。 | safe view/page/empty/not-visible/degraded/unavailable surface 返回。 | query family、read context ref、read decision ref、degraded marker ref。 | query result body as trace payload、audit write。 |
| Application query service span | read context 创建后。 | mapper/resolver/repository read surface 完成。 | view/material family、page cursor category、visibility/freshness/degraded marker refs。 | repair material、append trace/audit、synthetic marker。 |
| Repository / UoW span | repository or UoW boundary entered。 | read/write/commit/rollback outcome mapped。 | repository family、resource family、expected version category、uow phase、diagnostic ref。 | SQL text、row body、transaction private id。 |
| Inbound worker span | worker envelope accepted。 | stored receipt / worker result 返回。 | source family、dedup scope ref、receipt ref、worker result ref。 | broker payload、topic、offset、dead-letter body。 |
| Outbound candidate span | stored source loaded for candidate assembly。 | candidate shell assembled or rejected/blocked。 | source stored result/report/receipt ref、candidate ref、event family。 | current truth payload,old outbox body。 |
| Publisher span | candidate shell and target binding loaded。 | publication outcome / blocked / failed surface returned。 | candidate ref、target ref、publisher binding ref、publication outcome ref。 | topic、delivery receipt body、transport response body。 |
| Job runner span | job shell accepted or resumed。 | stored report / checkpoint / partial issue / duplicate replay returned。 | job run ref、scope ref、checkpoint ref、report ref、partial issue ref。 | scheduler lease as checkpoint、queue offset、raw report body。 |
| Adapter / resolver span | body-free adapter/resolver call starts。 | safe summary / availability / diagnostic surface returned。 | adapter family、binding ref、availability marker ref、safe summary ref、diagnostic ref。 | provider payload、endpoint、credential、raw status body。 |
| Handoff span | handoff boundary prepared。 | delivered/failed/target rejected surface returned。 | handoff marker ref、target ref、report boundary ref、receipt/failure ref。 | external document body、archive package body、observability ledger body。 |

### 4. correlation 规则思考

| 场景 | 必须关联 | 不得关联 / 不得推断 | 思考结论 |
|---|---|---|---|
| accepted command -> business fact | operation context、truth/history/trace/audit/lineage/effect refs、stored result。 | 不从 log line 或 metric sample 反推 truth。 | correlation 证明 accepted transaction 的因果链,不替代 durable object。 |
| command duplicate replay | idempotency decision、stored result/rejection/effect summary。 | 不重跑 command body,不重读 current truth 重建 response。 | span 应标记 replay decision,并关联 stored surface ref。 |
| query success / empty / not-visible | read context、view/page/read decision/marker refs。 | 不写 audit,不修复 view,不创建 stored result。 | correlation 只解释 read path 和 no-write surface。 |
| query stale/degraded/unavailable | copied freshness/availability/degraded marker、safe diagnostic。 | 不合成 marker,不从 adapter raw error 推 marker。 | trace 只串联正式 marker 来源。 |
| inbound accepted | source metadata、dedup decision、intake decision、receipt/worker result。 | 不把 broker ack/offset 当业务 receipt。 | correlation 证明 intake result,不代表 core truth mutation。 |
| inbound duplicate / delayed / unsupported | stored receipt or safe worker result、safe diagnostic。 | 不重新解析 raw payload或重写 intake。 | replay span 应指向 stored receipt。 |
| outbound candidate / publication | stored source result/report/receipt、candidate、target binding、publication outcome。 | 不重读 current truth、不保存 topic/payload/delivery body。 | candidate span 与 publisher span 分离,publication failure 不回滚 truth。 |
| job run / resume / duplicate | run context、checkpoint、progress/run history、stored report、partial issue。 | 不用 queue offset、timestamp、lease 代替 checkpoint/report。 | duplicate/resume correlation 必须证明 no hidden rerun 或 formal resume anchor。 |
| handoff delivered / failed | handoff marker、target ref、report boundary、receipt/failure ref。 | 不把 external body 或 archive body 写入 span。 | handoff trace 只串联 local boundary outcome。 |

### 5. 禁止 trace/span 内容思考

| 禁止内容 | 原因 | 替代方式 |
|---|---|---|
| raw request / response body | 违反 body-free 和敏感边界。 | request shell ref、operation context ref、result surface ref。 |
| raw event payload / broker metadata | 外部 transport 私有信息,高敏且不可作为 truth。 | inbound source family、source summary ref、receipt ref。 |
| provider payload / adapter response body | 外部正文不进入本仓。 | adapter binding ref、availability marker、safe diagnostic ref。 |
| report body / archive package body / external document body | 本仓只保存 boundary refs 和 safe summary。 | report boundary ref、artifact/archive ref、handoff marker ref。 |
| SQL / stack trace / raw exception text | 可能泄露实现细节和敏感数据。 | stable error category、safe diagnostic ref。 |
| raw endpoint / route / topic / queue / cron | config / transport 细节后移,且不稳定。 | operation family、adapter family、binding ref。 |
| secret / token / credential / connection string | 安全禁止。 | config source ref、validation issue ref。 |
| synthetic marker / synthetic receipt / synthetic report | 破坏真相源闭环。 | 缺正式 source 时停审回补 Step 6/7/8/9/11/13。 |

### 6. R15.10 写入边界思考

`R15.10` 应将本模块思考落成 trace / span / correlation cut table:

1. 写 trace context source table,只列来源族、正式来源、关联 refs 和禁用来源。
2. 写 span boundary table,覆盖 API / application / repository/UoW / inbound / outbound / publisher / jobs / adapter / handoff。
3. 写 correlation rules table,覆盖 accepted command、duplicate replay、query no-write、inbound receipt、outbound candidate/publication、job report/checkpoint、handoff outcome。
4. 写 prohibited span payload table。
5. 写 `R15.11 audit / operations fact cuts:先思考` 进入门禁。

### 7. R15.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 trace / span / correlation 切口 | pass |
| 是否回指 Step 8 metadata / event / job envelope 和 Step 9 flow family | pass |
| 是否覆盖 duplicate replay / stored result / receipt / report / candidate / publication outcome correlation | pass |
| 是否明确禁止 domain object 生成 trace context 或 synthetic marker | pass |
| 是否未写 trace/span payload schema、审计事件表、test case schema | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.10 trace / span / correlation cuts:再写入`;只允许写入 trace context source table、span boundary table、correlation rules table、prohibited span payload table 和 `R15.11 audit / operations fact cuts:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写审计事件表、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.10 trace / span / correlation cuts:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R15.9` 推进到 `R15.10`。 |
| 本模块写入范围 | trace context source table、span boundary table、correlation rules table、prohibited span payload table 和 `R15.11` 进入门禁。 |
| 本模块禁止范围 | 审计事件表、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook、config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. trace context source table

| 来源族 | 正式来源 | 允许关联 refs | 禁用来源 |
|---|---|---|---|
| API Command | Step 8 command envelope shared metadata、actor/source、idempotency shell;Step 9 operation context。 | command family、operation context ref、idempotency scope ref、stored result/rejection ref。 | raw request body、raw header、route、transport request id、domain truth body。 |
| API Query | Step 8 query envelope shared metadata、actor/source;Step 9 read context。 | query family、read context ref、read decision ref、view/page ref、degraded/unavailable marker ref。 | query result body、query audit write、projection repair marker。 |
| Inbound Consumer | Step 8 inbound envelope metadata/source;Step 9 body-free intake decision and receipt。 | source family、dedup scope ref、intake decision ref、receipt ref、worker result ref。 | broker payload、topic、queue、offset、ack/dead-letter body。 |
| Outbound Candidate | stored accepted command result、stored job report、stored inbound receipt;Step 9 event candidate assembly。 | source result/report/receipt ref、candidate ref、event family、safe marker ref。 | current truth reload payload、old outbox body、event payload text。 |
| Publisher Outcome | Step 8 publication outcome shell;Step 9 publisher port outcome;Step 14 target binding。 | candidate ref、target ref、publisher binding ref、publication outcome ref、safe diagnostic ref。 | topic、delivery receipt body、transport response body、provider payload。 |
| Operations Job | Step 8 job input/result/report/checkpoint shell;Step 9 job run flow;Step 13 checkpoint/replay source。 | job run ref、scope ref、checkpoint ref、progress ref、stored report ref、partial issue ref。 | scheduler attempt、queue offset、lease token、timestamp as checkpoint、raw report body。 |
| Adapter / Runtime / Config | Step 14 runtime assembly、adapter binding state、availability marker、config validation issue。 | runtime assembly state ref、adapter binding ref、availability marker ref、validation issue ref、safe diagnostic ref。 | config key/value、URL、endpoint、secret、provider status body。 |
| Handoff / Report Boundary | Step 8 handoff/report shell;Step 9 handoff outcome;Step 14 target binding。 | handoff marker ref、target ref、report boundary ref、receipt/failure ref。 | external document body、archive package body、observability ledger body。 |

### 3. span boundary table

| span boundary | 起点 | 终点 | 必须关联 | 不得写入 |
|---|---|---|---|---|
| API command entry | entry facade accepts command shell。 | response / rejection / duplicate surface returned。 | correlation ref、command family、operation context ref、stored result or rejection ref。 | raw request body、route、header、token。 |
| Application command service | operation context created。 | stored result / rejection / commit observation completed。 | idempotency decision ref、truth ref category、audit/trace/effect ref category、stored result ref。 | truth body、raw error text、response rebuild material。 |
| API query entry | entry facade accepts query shell。 | safe view/page/empty/not-visible/degraded/unavailable returned。 | correlation ref、query family、read context ref、surface kind。 | query body as span payload、audit write。 |
| Application query service | read context created。 | resolver / repository / mapper surface completed。 | read decision ref、view/material family、page cursor category、marker refs。 | material repair、trace/audit append、synthetic marker。 |
| Repository read/write | repository boundary entered。 | read/write result or mapped failure returned。 | repository family、resource family、operation category、diagnostic ref。 | SQL text、row body、private connection id。 |
| UnitOfWork | UoW begin。 | commit / rollback / commit unknown surface mapped。 | uow phase、operation group、operation context ref、diagnostic ref。 | transaction private id、DB lock detail、raw exception。 |
| Inbound worker | worker envelope accepted。 | stored receipt / worker result returned。 | source family、dedup scope ref、receipt ref、worker result ref。 | broker payload、topic、offset、dead-letter body。 |
| Outbound candidate assembly | stored source result/report/receipt loaded。 | candidate shell assembled / rejected / blocked。 | source stored surface ref、candidate ref、event family、safe marker ref。 | current truth payload、old outbox body。 |
| Publisher | candidate shell and target binding loaded。 | publication outcome / blocked / failed returned。 | candidate ref、target ref、publisher binding ref、publication outcome ref。 | topic、delivery body、transport response body。 |
| Job runner | job shell accepted or resumed。 | stored report / checkpoint / duplicate replay / partial issue returned。 | job run ref、scope ref、checkpoint ref、report ref、partial issue ref。 | queue offset、lease as checkpoint、raw report body。 |
| Adapter / resolver | body-free adapter / resolver call starts。 | safe summary / availability / diagnostic returned。 | adapter family、binding ref、availability marker ref、safe summary ref、diagnostic ref。 | provider payload、endpoint、credential、raw status body。 |
| Runtime assembly / config validation | runtime/config binding validation starts。 | ready / degraded / rejected state returned。 | runtime assembly state ref、config source ref、validation issue ref、diagnostic ref。 | config value、secret、connection string、raw validation text。 |
| Handoff | handoff boundary prepared。 | delivered / failed / target rejected surface returned。 | handoff marker ref、target ref、report boundary ref、receipt/failure ref。 | external document body、archive package body、observability ledger body。 |

### 4. correlation rules table

| 场景 | correlation 必须串联 | 禁止推断 | 规则 |
|---|---|---|---|
| accepted command -> business fact | operation context、truth/history/trace/audit/lineage/effect refs、stored result。 | 从 log/metric 反推 truth 或 response。 | trace 只串联正式 durable refs,不替代 truth/audit/stored result。 |
| command duplicate replay | idempotency decision、stored result / rejection / effect summary。 | 重跑 command body、重读 current truth 重建 response。 | duplicate span 必须显示 replay source。 |
| command rejected / conflict | safe rejection/result、reason/marker ref、diagnostic ref。 | accepted audit、event candidate、truth mutation。 | rejected correlation 不能伪造成 accepted fact。 |
| query success / empty / not-visible | read context、view/page/read decision/marker refs。 | query audit、stored command result、material repair。 | Query correlation 证明 no-write read path。 |
| query stale / degraded / unavailable | copied freshness/availability/degraded marker、safe diagnostic。 | synthetic marker、adapter raw error as marker。 | trace 只复制正式 marker 来源。 |
| inbound accepted | source metadata、dedup decision、intake decision、receipt/worker result。 | broker ack/offset as receipt。 | inbound accepted 只证明 intake,不代表 core truth mutation。 |
| inbound duplicate / delayed / unsupported | stored receipt or worker result、safe diagnostic。 | 重新解析 payload、重写 intake。 | replay span 必须指向 stored receipt。 |
| outbound candidate assembled | stored accepted result/report/receipt、candidate ref、event family。 | current truth reload、payload reconstruction。 | candidate correlation 与 publisher correlation 分离。 |
| publication success / failed / blocked | candidate ref、target binding、publication outcome、diagnostic ref。 | delivery body、topic、truth rollback。 | publication failure 不回滚 accepted truth。 |
| job completed | job run、progress/checkpoint、stored report、candidate hint where formal。 | raw report body、core truth repair。 | completed job correlation 指向 report/progress/checkpoint。 |
| job duplicate / resume / partial | checkpoint/run history、stored report、partial issue。 | queue offset、timestamp、lease as checkpoint。 | duplicate/resume correlation 必须证明 no hidden rerun or formal resume anchor。 |
| handoff delivered / failed | handoff marker、target ref、report boundary、receipt/failure ref。 | external body、archive body、observability ledger body。 | handoff trace 只串联 local body-free boundary outcome。 |

### 5. prohibited span payload table

| 禁止 span payload | 禁止原因 | 替代方式 |
|---|---|---|
| raw request / response body | 违反 body-free 与敏感边界。 | request shell ref、operation context ref、result surface ref。 |
| raw event payload / broker metadata | 外部 transport 私有且不可作为 truth。 | inbound source family、source summary ref、receipt ref。 |
| provider payload / adapter response body | 外部正文不进入本仓。 | adapter binding ref、availability marker ref、safe diagnostic ref。 |
| method asset body / artifact body | 本仓只持有 typed ref / safe summary。 | method asset ref、artifact/archive ref。 |
| report body / archive package body / external document body | report/handoff 只承载 boundary refs。 | report boundary ref、handoff marker ref、receipt/failure ref。 |
| SQL / stack trace / raw exception text | 泄露实现细节且不稳定。 | stable error category、safe diagnostic ref。 |
| raw endpoint / route / topic / queue / cron | config / transport 细节不属于 trace payload。 | operation family、adapter family、binding ref。 |
| secret / token / credential / connection string | 安全禁止。 | config source ref、validation issue ref。 |
| actor id / subject id 原文 | 可能敏感且跨仓私有。 | typed actor/source ref、resource family。 |
| synthetic marker / synthetic receipt / synthetic report | 破坏真相源闭环。 | 缺正式 source 时停审回补 Step 6/7/8/9/11/13。 |

### 6. R15.11 进入门禁

`R15.11 audit / operations fact cuts:先思考` 只允许思考审计与 operations fact 切口:

1. 思考 accepted business fact、business trace/history、audit trail、lineage、impact summary 的审计边界。
2. 思考 operations report、job progress/checkpoint、event candidate、publication outcome、handoff marker 的 fact cut。
3. 思考 Query no-write、rejected、duplicate replay、failed/blocked/unavailable 分支不得伪造成 accepted audit 的红线。
4. 不写最终审计事件表、不写 test case schema、不写 implementation code。

### 7. R15.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 trace context source table | pass |
| 是否写入 span boundary table | pass |
| 是否写入 correlation rules table | pass |
| 是否写入 prohibited span payload table | pass |
| 是否覆盖 API / application / repository/UoW / inbound / outbound / publisher / jobs / adapter / handoff | pass |
| 是否未写审计事件表、test case schema、implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.11 audit / operations fact cuts:先思考`;只允许思考 accepted business fact、business trace/history、audit trail、lineage、impact summary、operations report、job progress/checkpoint、event candidate、publication outcome、handoff marker 的审计与 operations fact 切口;不得直接修改正式 `03-详细设计.md`;不得写最终审计事件表、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.11 audit / operations fact cuts:先思考

### 1. 当前模块目标

`R15.11` 只思考 audit / operations fact 的边界,为 `R15.12` 写入审计与 operations fact 切口表做准备。当前模块不写最终审计事件表、不写 event payload schema、不写 test case schema、不写 implementation code,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 accepted business fact、business trace/history、audit trail、lineage、impact summary、operations report、job progress/checkpoint、event candidate、publication outcome、handoff marker 的 fact cut。 |
| 当前禁止 | 写最终审计事件表、审计字段 schema、event payload schema、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook、config key/env/topic/URL 或正式 `03-详细设计.md`。 |

### 2. audit fact 主语思考

| fact 主语 | 来源 Step | 可审计事实 | 当前裁决 |
|---|---|---|---|
| accepted Command truth change | Step 6 truth/support objects;Step 9 Command accepted flow;Step 11 UoW/stored result。 | definition/catalog/formalization/version/consumption/relation/package/assembly 等 accepted mutation。 | 可进入 business audit / trace / history,但必须与 accepted UoW 和 stored result 对齐。 |
| business trace / history | Step 6 trace material/history/lineage objects;Step 9 accepted side effects。 | body-free change history、trace subject、source cursor、related truth refs。 | 只保存 refs、marker、safe reason、source cursor,不保存 raw log / request / payload。 |
| `MethodAssetAuditTrail` | Step 6 audit trail;Step 9 audit command flow;Step 11 append-only persistence。 | audit subject、actor/source ref、safe reason、trace refs、history refs。 | 是业务审计承载之一,不是 runtime log。 |
| `MethodAssetEvidenceLineage` | Step 6 lineage;Step 9 lineage command/query flow;Step 11 lineage append-only。 | external summary、basis summary、artifact/archive ref、trace/audit refs 的 lineage。 | 只连接 evidence refs,不保存 evidence body 或 archive body。 |
| `ConsumptionImpactSummary` | Step 6 impact summary;Step 9 impact command/job/query flow。 | downstream impact known/unknown/pending/no-known-effect summary。 | unknown/pending 必须显式保留,不得默认推断 no impact。 |
| policy / protection decision | Step 6 policy/guard;Step 9 protection decision flow;Step 12 safe diagnostic。 | eligibility/protection/integrity decision、safe reason、manual intervention hint。 | 可以作为 audit/trace fact,但不是执行 recovery 或 authorization 的替代。 |

### 3. operations fact 主语思考

| fact 主语 | 来源 Step | operations fact | 当前裁决 |
|---|---|---|---|
| event candidate | Step 6 event candidate shell;Step 8 outbound event shell;Step 9 candidate assembly。 | candidate assembled from accepted result / job report / inbound receipt。 | candidate 是 body-free local fact,不是 publication delivered。 |
| publication outcome | Step 8 publication outcome;Step 9 publisher flow;Step 11 publication outcome shell。 | published/blocked/failed/unavailable outcome and target ref。 | publication failure 不回滚 accepted truth,也不改 candidate source fact。 |
| handoff marker | Step 6 handoff binding/result state;Step 8 handoff/report shell;Step 9 handoff flow。 | prepared/delivered/failed/target rejected body-free marker。 | delivered 只能表示 formal receipt marker,不代表 downstream business truth。 |
| job progress / checkpoint | Step 6 job progress assembly;Step 9 job run;Step 11 progress/checkpoint store;Step 13 resume。 | run started/resumed/progress advanced/checkpoint saved。 | checkpoint 是 resume anchor,不是 optimistic version、page cursor、lease or queue offset。 |
| operations report | Step 6 job report shell;Step 8 job report boundary;Step 9 job completion/partial flow。 | completed/partial/failed/replayed report boundary and issue refs。 | report fact 只保存 boundary refs / safe summary / issue refs,不保存 report body。 |
| recovery / manual issue | Step 12 manual/consistency/recovery issue;Step 9 consistency recovery job。 | consistency defect、manual intervention required、partial issue。 | 可作为 operations fact,但不能自动 repair core truth。 |
| runtime / adapter availability outcome | Step 6 runtime/adapter state;Step 14 runtime binding;Step 12 unavailable classification。 | runtime ready/degraded/blocked,adapter unavailable/degraded safe outcome。 | 只记录 safe diagnostic/availability marker,不记录 raw health payload。 |

### 4. 不应形成 accepted audit 的分支思考

| 分支 | 允许记录 | 禁止记录 | 理由 |
|---|---|---|---|
| validation rejected | safe rejection / diagnostic、runtime log、metric。 | accepted business audit、event candidate、truth history。 | 没有 accepted truth change。 |
| domain rejected / policy denied | safe reason/ref、stored rejected surface where formal、log/metric。 | success audit、business trace fact、publication candidate。 | rejected 不是成功业务事实。 |
| idempotency duplicate replay | stored result/receipt/report replay、log/metric、trace correlation。 | new audit entry、新 event candidate、新 truth mutation。 | duplicate 只复制 stored surface。 |
| Query success / empty / not-visible | runtime log/metric、read decision/degraded refs。 | business audit、trace append、stored command result、repair job。 | Query 永远 no-write。 |
| Query degraded / unavailable | copied marker/diagnostic/log/metric。 | synthetic audit fact、auto repair、marker synthesis。 | marker 必须来自正式 mapper/source。 |
| inbound unsupported / malformed / delayed | safe receipt / worker result、diagnostic、log/metric。 | accepted core truth audit、raw payload audit。 | Inbound 只处理 body-free intake,不创建 core truth。 |
| publication failed / blocked | publication outcome/diagnostic、log/metric。 | truth rollback、delivery success audit。 | post-commit side effect 与 accepted truth 分离。 |
| job partial / failed | partial issue、progress/report boundary、log/metric。 | core truth repair、silent skip、raw report audit。 | Job 只能写 derived/report/progress/recovery issue。 |
| handoff failed / target rejected | handoff failure marker、diagnostic、report boundary。 | delivered audit、external body audit、truth rollback。 | handoff outcome 是 local marker,不是外部业务真相。 |

### 5. audit / operations fact 来源缺口思考

| 缺口类型 | 处理口径 | 禁止 fallback |
|---|---|---|
| audit subject source missing | 暂停回 Step 6/7/9 闭口 subject/ref/mapper。 | 从 route、request body、actor string 或 private map 推断。 |
| safe actor/source missing | 暂停回 entry metadata / actor-source mapper 闭口。 | 保存 raw header、provider account、token、credential。 |
| event candidate source missing | 暂停回 stored accepted result / job report / inbound receipt source。 | publisher 重读 current truth 或拼 payload。 |
| publication outcome marker missing | 暂停回 publisher/target registry safe outcome。 | 从 topic、delivery receipt body、HTTP status 或 adapter exception 推 marker。 |
| report boundary missing | 暂停回 job report shell / progress assembly / persistence contract。 | 保存 raw report body 或以 log 文件替代 report。 |
| handoff receipt marker missing | 暂停回 handoff port body-free receipt/outcome。 | 以 external response body、archive existence 或 downstream status 当 delivered。 |
| diagnostic source missing | 暂停回 safe diagnostic builder / availability resolver / degraded mapper。 | 保存 raw exception、SQL、stack trace、provider body。 |

### 6. R15.12 写入边界思考

`R15.12` 应将本模块思考落成 audit / operations fact cut 表:

1. 写 accepted business audit cut table,覆盖 Command truth change、trace/history、audit trail、lineage、impact summary、policy/protection decision。
2. 写 operations fact cut table,覆盖 event candidate、publication outcome、handoff marker、job progress/checkpoint、operations report、manual/recovery issue、runtime/adapter availability outcome。
3. 写 non-audit branch redline table,覆盖 rejected、duplicate、Query no-write、inbound unsupported、publication failed、job partial/failed、handoff failed。
4. 写 source-missing stop table。
5. 写 `R15.13 redaction / sensitive boundary / handoff:先思考` 进入门禁。

### 7. R15.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 audit / operations fact 切口 | pass |
| 是否区分 accepted business audit 与 operations fact | pass |
| 是否明确 Query no-write、rejected、duplicate replay 不形成 accepted audit | pass |
| 是否覆盖 event candidate、publication outcome、handoff marker、job report/progress/checkpoint | pass |
| 是否明确 source missing 时停审回补而非实现侧 fallback | pass |
| 是否未写最终审计事件表、字段 schema、test case schema | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.12 audit / operations fact cuts:再写入`;只允许写入 accepted business audit cut table、operations fact cut table、non-audit branch redline table、source-missing stop table 和 `R15.13 redaction / sensitive boundary / handoff:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.12 audit / operations fact cuts:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R15.11` 推进到 `R15.12`。 |
| 本模块写入范围 | accepted business audit cut table、operations fact cut table、non-audit branch redline table、source-missing stop table 和 `R15.13` 进入门禁。 |
| 本模块禁止范围 | test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook、config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. accepted business audit cut table

| audit cut | 正式来源 | 审计事实 | 必须关联 | 禁止内容 |
|---|---|---|---|---|
| Command accepted truth change | Step 6 truth/support objects;Step 9 accepted Command flow;Step 11 UoW/stored result。 | accepted mutation for definition/catalog/formalization/version/consumption/relation/package/assembly。 | operation context ref、truth ref、stored result ref、history/trace/audit/effect refs。 | raw request body、raw response body、runtime log body。 |
| Business trace / history append | Step 6 trace material/history/lineage;Step 9 accepted side effects;Step 11 append-only record。 | body-free history line,trace subject,lineage ref,source cursor。 | trace subject ref、source object refs、safe reason ref、source cursor。 | raw log、event payload、external body、report body。 |
| `MethodAssetAuditTrail` append | Step 6 audit trail;Step 9 audit flow;Step 11 audit append-only store。 | audit subject changed,actor/source recorded,safe reason linked。 | audit subject ref、safe actor/source ref、reason ref、trace/history refs。 | stack trace、request body、secret、free text audit payload。 |
| `MethodAssetEvidenceLineage` link | Step 6 lineage;Step 9 lineage flow;Step 11 lineage append-only store。 | evidence/source/artifact/basis lineage refs linked。 | evidence/source refs、basis summary ref、artifact/archive ref、trace/audit refs。 | evidence body、archive package body、provider document body。 |
| `ConsumptionImpactSummary` recorded | Step 6 impact summary;Step 9 impact flow;Step 12 unknown/pending semantics。 | impact known/unknown/pending/no-known-effect recorded。 | impact source ref、consumption material ref、safe summary ref、impact kind。 | downstream runtime truth、private work data、assumed no-impact。 |
| Policy / protection / integrity decision | Step 6 policy/guard;Step 9 protection/integrity flow;Step 12 safe diagnostic。 | eligibility/protection/integrity decision accepted or recorded as safe decision fact。 | decision ref、protected subject ref、safe reason ref、manual intervention hint ref。 | recovery plan body、authorization expansion、raw rule matrix。 |

### 3. operations fact cut table

| operations fact cut | 正式来源 | fact | 必须关联 | 禁止内容 |
|---|---|---|---|---|
| Event candidate assembled | Step 6 event candidate shell;Step 8 outbound event shell;Step 9 candidate assembly。 | body-free candidate assembled from accepted result / job report / inbound receipt。 | candidate ref、source stored result/report/receipt ref、event family、safe marker ref。 | event payload body、topic、old outbox body、delivery receipt。 |
| Publication outcome recorded | Step 8 publication outcome;Step 9 publisher flow;Step 11 outcome shell;Step 14 target binding。 | published/blocked/failed/unavailable outcome recorded。 | publication outcome ref、candidate ref、target ref、publisher binding ref、diagnostic ref。 | transport response body、subscriber ack、truth rollback。 |
| Handoff marker recorded | Step 6 handoff binding/result state;Step 8 handoff/report shell;Step 9 handoff flow。 | prepared/delivered/failed/target rejected body-free marker recorded。 | handoff marker ref、target ref、report boundary ref、receipt/failure ref。 | external document body、archive package body、downstream business truth。 |
| Job progress advanced | Step 6 job progress assembly;Step 9 job flow;Step 11 progress/checkpoint store。 | run started/resumed/progress advanced/checkpoint saved。 | job run ref、scope ref、progress ref、checkpoint ref、safe issue refs。 | scheduler lease、queue offset、timestamp as checkpoint。 |
| Operations report boundary saved | Step 6 job report shell;Step 8 job report boundary;Step 9 completion/partial flow。 | completed/partial/failed/replayed report boundary saved。 | report boundary ref、job run ref、progress ref、partial issue refs、stored report ref。 | report body、metrics payload、raw log、artifact body。 |
| Recovery / manual issue recorded | Step 12 manual/consistency issue;Step 9 recovery convergence job。 | consistency defect/manual intervention/partial issue recorded。 | recovery issue ref、diagnostic ref、affected safe refs、follow-up hint ref。 | repair script、operator free text、core truth mutation。 |
| Runtime / adapter availability outcome | Step 6 runtime/adapter state;Step 12 unavailable classification;Step 14 binding。 | runtime ready/degraded/blocked or adapter unavailable/degraded outcome observed。 | runtime assembly state ref、adapter binding ref、availability marker ref、safe diagnostic ref。 | raw health payload、endpoint、URL、config value、provider status body。 |

### 4. non-audit branch redline table

| branch | 允许记录 | 禁止记录 | 红线 |
|---|---|---|---|
| validation rejected | safe rejection/result、validation issue ref、diagnostic、log/metric。 | accepted business audit、truth history、event candidate。 | 未产生 accepted truth change。 |
| domain rejected / policy denied | safe reason/ref、stored rejected surface where formal、log/metric。 | success audit、accepted trace fact、publication candidate。 | 业务拒绝不是成功事实。 |
| idempotency duplicate replay | stored result/receipt/report replay、trace correlation、log/metric。 | new audit entry、新 event candidate、新 truth mutation。 | duplicate 只能复制 stored surface。 |
| Query success / empty / not-visible | read decision/degraded refs、runtime log/metric。 | business audit、trace append、stored command result、repair job。 | Query 永远 no-write。 |
| Query stale / degraded / unavailable | copied marker、diagnostic、runtime log/metric。 | synthetic audit fact、auto repair、marker synthesis。 | marker 必须来自正式 source。 |
| inbound unsupported / malformed / delayed | safe receipt/worker result、diagnostic、log/metric。 | accepted core truth audit、raw payload audit。 | Inbound 不从 raw signal 创建 core truth。 |
| publication failed / blocked | publication outcome、diagnostic、log/metric。 | truth rollback、delivery success audit、candidate rewrite。 | publication 是 post-commit side effect。 |
| job partial / failed | partial issue、progress/report boundary、log/metric。 | core truth repair、silent skip、raw report audit。 | Job 只写 derived/report/progress/recovery issue。 |
| handoff failed / target rejected | handoff failure marker、diagnostic、report boundary。 | delivered audit、external body audit、truth rollback。 | handoff outcome 是 local marker。 |

### 5. source-missing stop table

| missing source | stop action | forbidden fallback |
|---|---|---|
| audit subject source missing | 暂停回 Step 6/7/9 闭口 subject/ref/mapper。 | 从 route、request body、actor string、private map 推断。 |
| safe actor/source missing | 暂停回 entry metadata / actor-source mapper 闭口。 | 保存 raw header、provider account、token、credential。 |
| event candidate source missing | 暂停回 stored accepted result / job report / inbound receipt source。 | publisher 重读 current truth 或拼 payload。 |
| publication outcome marker missing | 暂停回 publisher/target registry safe outcome。 | 从 topic、delivery receipt body、HTTP status、adapter exception 推 marker。 |
| report boundary missing | 暂停回 job report shell / progress assembly / persistence contract。 | 保存 raw report body 或以 log 文件替代 report。 |
| handoff receipt marker missing | 暂停回 handoff port body-free receipt/outcome。 | 以 external response body、archive existence、downstream status 当 delivered。 |
| diagnostic source missing | 暂停回 safe diagnostic builder / availability resolver / degraded mapper。 | 保存 raw exception、SQL、stack trace、provider body。 |
| lineage/evidence source missing | 暂停回 external summary / artifact ref / basis summary source。 | 保存 evidence body、archive body、provider document。 |

### 6. R15.13 进入门禁

`R15.13 redaction / sensitive boundary / handoff:先思考` 只允许思考敏感字段、body-free boundary、redaction、handoff:

1. 思考 runtime log、metric、trace/span、audit/operations fact、diagnostic、report/handoff 中的禁止字段。
2. 思考 body-free refs、safe summary、marker、diagnostic、redaction marker 的承接关系。
3. 思考 Step 16/19/04/07 handoff:哪些内容给测试、正式装配、配置和实施计划。
4. 不写最终 redaction 表、不写正式 §14 候选草稿、不写 test case schema 或 implementation code。

### 7. R15.12 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 accepted business audit cut table | pass |
| 是否写入 operations fact cut table | pass |
| 是否写入 non-audit branch redline table | pass |
| 是否写入 source-missing stop table | pass |
| 是否明确 rejected / duplicate / Query no-write 不形成 accepted audit | pass |
| 是否未写 test case schema、implementation code、配置键或运维阈值 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.13 redaction / sensitive boundary / handoff:先思考`;只允许思考 runtime log、metric、trace/span、audit/operations fact、diagnostic、report/handoff 的敏感字段、body-free boundary、redaction marker 和 Step 16/19/04/07 handoff;不得直接修改正式 `03-详细设计.md`;不得写最终 redaction 表、正式 §14 候选草稿、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.13 redaction / sensitive boundary / handoff:先思考

### 1. 当前模块目标

`R15.13` 只思考 redaction / sensitive boundary / handoff 的落地边界,为 `R15.14` 写入最终 redaction 与敏感字段裁剪表做准备。当前模块不写最终 redaction 表、不写正式 §14 候选草稿、不写 test case schema、不写 implementation code,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 runtime log、metric、trace/span、audit/operations fact、diagnostic、report/handoff、config/runtime/adapter 中的敏感字段红线、body-free boundary、redaction marker 来源和 Step 16/19/04/07 handoff。 |
| 当前禁止 | 写最终 redaction 表、正式 §14 候选草稿、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook、具体 config key/env/topic/URL 或正式 `03-详细设计.md`。 |

### 2. sensitive-field surface 思考

| surface | 敏感风险 | Step 15 思考裁决 |
|---|---|---|
| runtime log | raw request/response、payload、SQL、stack trace、endpoint、route、topic、actor raw id 可能泄露。 | 只允许 operation family、phase、status、safe diagnostic ref、typed safe refs 和 low-detail stable category。 |
| runtime metric | label 高基数和私有 id 会泄露业务对象并破坏聚合。 | 只允许 low-cardinality family/kind/state/result/category labels;不得出现 trace id、actor/subject ref、truth ref、raw endpoint/topic。 |
| trace/span | span attribute 容易被误用为业务正文或 external body carrier。 | 只承载 trace context、operation boundary、typed refs、safe marker;不得保存 request body、event payload、adapter body、report body。 |
| business audit / operations fact | audit 一旦持久化会成为长期记录,必须 body-free。 | 只保存 accepted fact refs、safe actor/source、safe reason、marker/report/receipt refs;不得保存 raw free text 或外部正文。 |
| diagnostic issue | diagnostic 需要可排障但不能变成 exception dump。 | 只保存 stable error category、safe message/ref、safe diagnostic marker;raw exception、stack trace、provider body 不进入正式对象。 |
| report / handoff | report/handoff 常连接外部 archive、document、target。 | 只保存 report boundary ref、handoff marker、receipt/failure ref、target binding ref;不保存 report body、archive body、external document body。 |
| config / runtime / adapter | config、secret、endpoint、credential、connection string 和 health payload 均敏感。 | 只保存 config source ref、binding ref、availability marker、redacted diagnostic ref;不写具体 key/value/URL/topic/credential。 |

### 3. body-free / redaction source 思考

| source type | 可进入 observability 的形式 | 不足时处理 | 禁止 fallback |
|---|---|---|---|
| typed boundary ref | `Method*Ref`、report ref、receipt ref、candidate ref、marker ref 等正式 typed ref。 | 回 Step 6/7/8/9/11 闭口正式 ref 来源。 | 从 raw id、route param、topic、payload 字符串拼 ref。 |
| safe summary | Step 6/8/9 已定义的 safe summary 或 safe public shell。 | 回 object/protocol/flow 闭口 summary schema。 | 保存原始 method body、artifact body、external document、provider payload。 |
| no-body marker | 表示 body 存在边界、已裁剪、不可展开或只允许外部持有的 marker。 | 回 Step 6 marker 或 handoff shell 闭口。 | 用 hash/fingerprint、file path、object storage key 替代正式 marker。 |
| redaction marker | 说明字段被裁剪、敏感来源被 redacted、public surface 只能显示 safe category。 | 需要正式 mapper/resolver/builder 输出。 | service/log adapter 自行合成 marker 或用 raw error text 代替。 |
| safe diagnostic ref | 由 safe diagnostic builder、availability resolver、degraded mapper、validation issue 输出。 | 缺来源则暂停回 Step 7/12/14。 | 记录 stack trace、SQL、provider body、secret、raw config。 |
| report boundary ref | 指向 stored report shell / boundary,不展开 report body。 | 回 Step 6/8/9/11 的 report shell 与 persistence 闭口。 | 以 log 文件、markdown body、archive package 当 report boundary。 |
| handoff receipt/failure ref | 指向本仓 body-free receipt/failure marker。 | 回 handoff port / outcome shell 闭口。 | 以 external response body、downstream status、archive existence 推断 delivered。 |

### 4. forbidden field categories 思考

| forbidden category | 禁止进入的 surface | 替代思路 |
|---|---|---|
| raw request / response body | log、trace、audit、diagnostic、report、handoff。 | request shell ref、operation context ref、result surface ref。 |
| raw event payload / broker metadata | log、trace、audit、event candidate、publication outcome。 | source family、source summary ref、worker receipt ref、candidate ref。 |
| provider payload / adapter response | log、trace、diagnostic、availability outcome、handoff。 | adapter binding ref、availability marker、safe diagnostic ref。 |
| method asset body / artifact body / archive body / report body / external document body | audit、trace、report、handoff、lineage。 | typed asset ref、artifact/archive ref、report boundary ref、lineage safe summary。 |
| raw config、secret、token、credential、connection string | 所有 observability surface。 | config source ref、redacted validation issue、runtime binding ref。 |
| raw endpoint、route、topic、queue、cron、URL | metric label、log field、trace attribute、diagnostic。 | operation family、adapter family、target binding ref、schedule family。 |
| actor / subject raw id / private identity | log、metric label、trace attribute、audit public shell。 | typed actor/source ref、resource family、safe actor marker。 |
| stack trace、SQL、raw exception、free text | diagnostic、log、audit、report。 | stable category、safe message/ref、diagnostic ref。 |
| synthetic marker / receipt / report | all formal surfaces。 | 缺正式来源时停审回补 Step 6/7/8/9/11/12/13/14。 |

### 5. cross-document handoff 思考

| handoff target | 应交付内容 | 不应交付内容 |
|---|---|---|
| `04-配置设计.md` | redaction 相关 config category、runtime binding category、adapter availability category、safe diagnostic category 的配置承接问题。 | 具体 config key、profile、env、secret、endpoint、topic、URL、numeric policy。 |
| Step 16 测试切口 | no raw body、no secret、no raw payload、no synthetic marker、metric label low-cardinality、query no-write、duplicate no-rerun、post-commit failure no rollback 的测试红线。 | 完整 test case schema、fixture body、实现仓测试代码。 |
| Step 19 正式装配 | 从已确认 Step 15 产物装配 §14 的来源 map、日志/指标/audit/redaction 表。 | 未确认草稿、旧 Step 15 污染内容、正式文档直接临场补口。 |
| `07-实施计划.md` | implementation gate 需要检查 no private fallback、no synthetic marker、no raw body logging、no query audit、no metric high-cardinality label。 | commit plan、CI command、evidence schema 的具体落地细节。 |
| Step 7 / Step 12 / Step 14 | 若发现 redaction marker、safe diagnostic、availability summary 或 handoff marker 来源缺失,必须回这些 Step 补口。 | 在 Step 15 自行发明 port、mapper、config source 或 diagnostic schema。 |

### 6. R15.14 写入边界思考

`R15.14` 应将本模块思考落成 redaction / sensitive boundary / handoff 表:

1. 写 final redaction / sensitive field boundary table,覆盖 runtime log、metric、trace/span、audit/operations fact、diagnostic、report/handoff、config/runtime/adapter。
2. 写 body-free / redaction source mapping table,明确 typed ref、safe summary、no-body marker、redaction marker、diagnostic ref、report boundary ref、handoff receipt/failure ref 的正式来源与缺口处理。
3. 写 forbidden field category table,明确 raw body、payload、provider response、method/artifact/archive/report body、secret、endpoint、raw id、stack trace、synthetic marker 禁止进入哪些 surface。
4. 写 Step 16/19/04/07 handoff table。
5. 写 `R15.15 cross-step closure and formal §14 candidate stop-review:先思考` 进入门禁。

### 7. R15.13 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 redaction / sensitive boundary / handoff | pass |
| 是否覆盖 runtime log、metric、trace/span、audit/operations fact、diagnostic、report/handoff、config/runtime/adapter | pass |
| 是否明确 body-free refs、safe summary、no-body marker、redaction marker、safe diagnostic、report/handoff refs 的来源口径 | pass |
| 是否明确 forbidden field categories 和 synthetic marker 禁止 | pass |
| 是否明确 Step 16/19/04/07 handoff | pass |
| 是否未写正式 §14 候选草稿、test case schema、implementation code、配置键或运维阈值 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.14 redaction / sensitive boundary / handoff:再写入`;只允许写入 final redaction / sensitive field boundary table、body-free / redaction source mapping table、forbidden field category table、Step 16/19/04/07 handoff table 和 `R15.15 cross-step closure and formal §14 candidate stop-review:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写正式 §14 候选草稿、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.14 redaction / sensitive boundary / handoff:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R15.13` 推进到 `R15.14`。 |
| 本模块写入范围 | final redaction / sensitive field boundary table、body-free / redaction source mapping table、forbidden field category table、Step 16/19/04/07 handoff table 和 `R15.15` 进入门禁。 |
| 本模块禁止范围 | 正式 §14 候选草稿、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook、具体 config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. final redaction / sensitive field boundary table

| surface | 允许字段族 | 必须 redacted / forbidden | source rule |
|---|---|---|---|
| runtime log | operation family、phase、status、safe diagnostic ref、typed safe refs、stable category。 | raw request/response、payload、SQL、stack trace、secret、endpoint、route、topic、actor raw id。 | log 字段只能复制正式 typed refs / safe diagnostics / stable categories。 |
| runtime metric | family、kind、state、result、category、adapter family、job family 等低基数 label。 | request id、trace id、actor/subject/truth ref、candidate/report/receipt ref、raw endpoint/topic/queue、free text。 | metric label 必须来自 Step 15 low-cardinality 裁剪,不得从 runtime payload 动态派生。 |
| trace / span | trace context、span kind、operation boundary、typed boundary refs、safe marker refs。 | request body、event payload、adapter response、method body、report body、archive body、secret、raw exception。 | span attribute 只表达调用边界和 formal correlation,不承载正文。 |
| business audit / operations fact | accepted fact refs、safe actor/source、safe reason、trace/history refs、marker/report/receipt refs。 | raw free text、external body、stack trace、request body、payload、secret、operator private note。 | audit / operations fact 必须 body-free 且回指 Step 6/9/11 正式对象。 |
| diagnostic issue | stable error category、safe message/ref、diagnostic marker、availability/degraded marker。 | raw exception、SQL、stack trace、provider body、raw config、credential、connection string。 | diagnostic 只能来自 safe builder / resolver / mapper / validation issue。 |
| report / handoff | report boundary ref、handoff marker、target binding ref、receipt/failure ref、safe issue refs。 | report body、archive package body、external document body、observability ledger body、downstream status body。 | report/handoff 只保存本仓 boundary refs 和 body-free outcome。 |
| config / runtime / adapter | config source ref、runtime binding ref、adapter binding ref、availability marker、redacted validation issue。 | concrete key/value、profile/env value、secret、token、URL、topic、queue、health payload。 | 只允许引用配置来源和 binding/availability marker,不暴露具体配置值。 |

### 3. body-free / redaction source mapping table

| observability carrier | 正式来源 | 允许承载 | source missing 时 | forbidden fallback |
|---|---|---|---|---|
| typed boundary ref | Step 6 object contract、Step 8 shell、Step 9 flow、Step 11 persistence output。 | `Method*Ref`、candidate ref、receipt ref、report ref、marker ref。 | 暂停回 Step 6/7/8/9/11 补正式 ref 来源。 | route param、raw id、payload string、topic、private map。 |
| safe summary | Step 6 safe summary、Step 8 public shell、Step 9 assembled summary。 | safe status、safe reason、safe actor/source summary、safe issue summary。 | 暂停回 object/protocol/flow 闭口 summary schema。 | method body、artifact body、external document、provider payload。 |
| no-body marker | Step 6 marker / report / handoff shell。 | body redacted、body external-owned、body unavailable、body intentionally omitted。 | 暂停回 marker / shell 定义。 | hash/fingerprint、file path、object storage key、archive existence。 |
| redaction marker | Step 7 mapper/resolver/builder 或 Step 12/14 safe diagnostic source。 | redacted field family、redaction reason category、safe public marker。 | 暂停回 mapper/resolver/builder 闭口。 | log adapter 合成、service 拼字符串、raw error text。 |
| safe diagnostic ref | validation issue、availability resolver、degraded mapper、safe diagnostic builder。 | stable category、safe message/ref、diagnostic marker。 | 暂停回 Step 7/12/14。 | stack trace、SQL、provider body、secret、raw config。 |
| report boundary ref | Step 6 report shell、Step 8 job/report protocol、Step 9 job completion、Step 11 report store。 | report identity、scope、status、safe issue refs、stored report ref。 | 暂停回 report shell / persistence contract。 | markdown body、raw metrics dump、log file、archive body。 |
| handoff receipt/failure ref | Step 6 handoff result state、Step 8 handoff shell、Step 9 handoff flow、Step 14 target binding。 | delivered/failed/target rejected marker、target binding ref、safe failure ref。 | 暂停回 handoff port / outcome shell。 | external response body、downstream status、archive existence。 |

### 4. forbidden field category table

| forbidden category | 禁止进入 | 允许替代 |
|---|---|---|
| raw request / response body | log、trace、audit、diagnostic、report、handoff。 | request shell ref、operation context ref、result surface ref。 |
| raw event payload / broker metadata | log、trace、audit、event candidate、publication outcome。 | source family、source summary ref、worker receipt ref、candidate ref。 |
| provider payload / adapter response | log、trace、diagnostic、availability outcome、handoff。 | adapter binding ref、availability marker、safe diagnostic ref。 |
| method asset / artifact / archive / report / external document body | trace、audit、lineage、report、handoff。 | typed asset ref、artifact/archive ref、report boundary ref、lineage safe summary。 |
| raw config / secret / token / credential / connection string | all observability surfaces。 | config source ref、redacted validation issue、runtime binding ref。 |
| raw endpoint / route / topic / queue / cron / URL | metric label、log field、trace attribute、diagnostic。 | operation family、adapter family、target binding ref、schedule family。 |
| actor / subject raw id / private identity | log、metric label、trace attribute、audit public shell。 | typed actor/source ref、resource family、safe actor marker。 |
| stack trace / SQL / raw exception / free text | diagnostic、log、audit、report。 | stable category、safe message/ref、diagnostic ref。 |
| synthetic marker / receipt / report | all formal observability and public surfaces。 | 缺正式来源时停审回补 Step 6/7/8/9/11/12/13/14。 |

### 5. Step 16 / 19 / 04 / 07 handoff table

| handoff target | 必须承接 | 不得承接 |
|---|---|---|
| Step 16 测试切口 | no raw body、no secret、no raw payload、no synthetic marker、metric label low-cardinality、query no-write、duplicate no-rerun、post-commit failure no rollback。 | fixture body、具体测试 schema、实现仓测试代码。 |
| Step 19 正式装配 | 从 R15.4/R15.6/R15.8/R15.10/R15.12/R15.14 已确认表格装配 §14;保留 source map。 | 旧 Step 15 污染内容、未确认草稿、临场新增字段。 |
| `04-配置设计.md` | config source category、runtime binding category、adapter availability category、redacted diagnostic category 的后续配置讨论入口。 | concrete config key、profile、env、secret、endpoint、topic、URL、numeric policy。 |
| `07-实施计划.md` | implementation gate 检查 no private fallback、no synthetic marker、no raw body logging、no query audit、no metric high-cardinality label。 | commit 切分、CI command、evidence schema 的具体实施细节。 |
| Step 7 / Step 12 / Step 14 回补 | redaction marker、safe diagnostic、availability summary、handoff receipt/failure 来源缺失时回补正式 port / mapper / source。 | Step 15 自行发明 port、mapper、config source、diagnostic schema 或 fallback。 |

### 6. R15.15 进入门禁

`R15.15 cross-step closure and formal §14 candidate stop-review:先思考` 只允许思考 Step 15 的跨 Step 闭环和正式 §14 候选草稿停审:

1. 思考 Step 15 已确认表格如何与 Step 6~14 对齐,尤其 log / metric / trace / audit / redaction 是否都能回指正式 source。
2. 思考是否存在 Step 16 测试切口必须承接的红线。
3. 思考正式 §14 候选草稿的 source map、章节结构和禁入项。
4. 不写正式 §14 候选草稿、不修改正式 `03-详细设计.md`、不写 test case schema 或 implementation code。

### 7. R15.14 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 final redaction / sensitive field boundary table | pass |
| 是否写入 body-free / redaction source mapping table | pass |
| 是否写入 forbidden field category table | pass |
| 是否写入 Step 16/19/04/07 handoff table | pass |
| 是否明确 source missing 时停审回补而不是实现侧 fallback | pass |
| 是否未写正式 §14 候选草稿、test case schema、implementation code、配置键或运维阈值 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.15 cross-step closure and formal §14 candidate stop-review:先思考`;只允许思考 Step 15 与 Step 6~14 的 cross-step closure、Step 16 测试切口承接、正式 §14 候选草稿 source map / 章节结构 / 禁入项;不得直接修改正式 `03-详细设计.md`;不得写正式 §14 候选草稿、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.15 cross-step closure and formal §14 candidate stop-review:先思考

### 1. 当前模块目标

`R15.15` 只思考 Step 15 的跨 Step 闭环、Step 16 测试切口承接、正式 §14 候选草稿的 source map / 章节结构 / 禁入项,为 `R15.16` 写入 closure audit 与停审记录做准备。当前模块不写正式 §14 候选草稿、不修改正式 `03-详细设计.md`、不写 test case schema 或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 Step 15 已确认表格与 Step 6~14 的闭环、Step 16 测试红线、正式 §14 候选草稿 source map / 章节结构 / 禁入项、Step 15 完成门禁。 |
| 当前禁止 | 写正式 §14 候选草稿、修改正式 `03-详细设计.md`、写 test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。 |

### 2. cross-step closure 思考

| Step | Step 15 必须闭合的关系 | 当前思考裁决 |
|---|---|---|
| Step 6 object contracts | trace、audit、diagnostic、marker、report、handoff、safe summary、body-free ref 是 observability 的正式承载来源。 | Step 15 只能引用这些对象或提出回补,不能自行新增对象字段。 |
| Step 7 trait / port / adapter | safe diagnostic、availability summary、redaction marker、publisher/handoff outcome 必须来自正式 port / mapper / resolver。 | 缺来源时停审回 Step 7,不得由 log/metric adapter 合成。 |
| Step 8 protocol contracts | command/query/event/job public shell、metadata、trace context、receipt/report/effect shell 决定 observability 可见面。 | Step 15 不修改 DTO,只约束打点字段和禁止字段。 |
| Step 9 function flows | 每个 Command / Query / Inbound / Outbound / Job 分支决定 log / metric / trace / audit cut。 | Step 15 必须按 accepted/rejected/duplicate/query no-write/post-commit side effect 分支对齐。 |
| Step 10 state machine | state transition、terminal/degraded/unavailable/blocked 语义决定 metric state 和 safe diagnostic category。 | Step 15 不从 observability 后端反推 state transition。 |
| Step 11 persistence / transaction | stored result、receipt、report、audit、trace、marker、checkpoint 的持久化边界决定 replay 和 audit source。 | log/metric 不替代 persistence truth;duplicate 只能引用 stored surface。 |
| Step 12 error / recovery | rejected、failed、degraded、unavailable、manual/consistency issue 的 safe recovery surface 决定诊断和 redaction 来源。 | raw exception/stack/SQL 不进入 formal surface;缺 safe diagnostic 则回补。 |
| Step 13 concurrency / idempotency | duplicate replay、idempotency conflict、commit unknown、job resume/reentry 决定 no rerun/no new audit/no new candidate。 | Step 15 只记录 replay correlation,不得鼓励重跑或重建响应。 |
| Step 14 config / dependencies | config validation、adapter availability、runtime binding、target binding 和 forbidden configurable boundary 决定 redacted config diagnostic。 | Step 15 不写具体 key/env/topic/URL,只交给 04 继续配置讨论。 |

### 3. Step 16 测试切口承接思考

| 测试红线 | Step 15 来源 | Step 16 应验证的方向 |
|---|---|---|
| no raw body | R15.6/R15.10/R15.14 | log、span、audit、report/handoff 不包含 request/event/provider/method/report/archive body。 |
| no secret / config value | R15.6/R15.8/R15.14 | log、metric label、diagnostic、trace 不包含 secret、token、credential、connection string、URL/topic concrete value。 |
| metric label low-cardinality | R15.8/R15.14 | label 只允许 family/kind/state/result/category,拒绝 trace id、actor/subject/truth refs、raw endpoint/topic。 |
| no synthetic marker | R15.10/R15.12/R15.14 | degraded/redaction/diagnostic/publication/handoff marker 必须来自正式 mapper/resolver/source。 |
| query no-write | R15.4/R15.12 | query success/empty/not-visible/degraded 不写 audit、stored command result、event candidate 或 repair。 |
| duplicate no-rerun | R15.10/R15.12 | duplicate replay 只复制 stored result/receipt/report/checkpoint,不新增 audit/candidate/truth mutation。 |
| post-commit failure no rollback | R15.12/R15.14 | publication/handoff failure 只写 outcome/marker/diagnostic,不回滚 accepted truth。 |
| source-missing stop | R15.12/R15.14 | audit subject、safe actor、diagnostic、report/handoff receipt 来源缺失时必须停审回补。 |

### 4. formal §14 source map 思考

| §14 候选块 | 来源中间产物 | 装配原则 |
|---|---|---|
| 14.1 Observability layering and principles | R15.4 可观测性分层与总原则 | 写分层、非替代关系、query no-write、duplicate replay、post-commit side effect 边界。 |
| 14.2 Structured log cuts | R15.6 structured log cuts | 按 API / application / repository/UoW / inbound / outbound / publisher / job / adapter / config validation 组织。 |
| 14.3 Metric cuts | R15.8 metric cuts | 按 counter/histogram/gauge family 和 allowed/forbidden labels 组织。 |
| 14.4 Trace / span / correlation cuts | R15.10 trace / span / correlation cuts | 写 trace context source、span boundary、correlation rules、prohibited span payload。 |
| 14.5 Audit / operations fact cuts | R15.12 audit / operations fact cuts | 写 accepted business audit、operations fact、non-audit branch redline、source-missing stop。 |
| 14.6 Redaction / sensitive boundary / handoff | R15.14 redaction / sensitive boundary / handoff | 写 sensitive field boundary、body-free/redaction source mapping、forbidden field categories、handoff。 |
| 14.7 Step 16 / 04 / 07 handoff summary | R15.14/R15.16 closure | 只写承接清单,不写测试 schema、配置键或实施 commit。 |

### 5. formal §14 禁入项思考

| 禁入项 | 禁入理由 |
|---|---|
| 旧 `MethodContent` / publish / snapshot / fingerprint / old outbox relay 观测项 | historical pollution,不属于当前 00/01/02 和 Step 1~14 正向基线。 |
| 告警阈值、SLO、dashboard、采样率、retention、runbook | 属于运维/配置/验收后续文档,不是 Step 15 的代码埋点契约。 |
| 具体 config key、env、profile、topic、queue、URL、cron、numeric policy | 应进入 `04-配置设计.md` 后续讨论,Step 15 只给 category/handoff。 |
| test case schema、fixture、evidence schema、CI command | 应进入 Step 16/05/06/07 后续文档。 |
| implementation code、具体 crate/file edits、commit plan | 不属于详细设计 Step 15 中间产物。 |
| 新增未闭口 port / mapper / DTO / marker / schema | 违反真相源闭环,缺口必须回对应 Step 补口。 |
| raw body、secret、provider payload、external document body、synthetic marker | 违反 Step 15 redaction 与 body-free 边界。 |

### 6. R15.16 写入边界思考

`R15.16` 应将本模块思考落成 Step 15 closure 与停审记录:

1. 写 cross-step closure audit table,逐项确认 Step 6~14 与 Step 15 已闭合。
2. 写 Step 16 test handoff checklist,只列测试红线和覆盖方向,不写 test case schema。
3. 写 formal §14 source map table,说明正式文档候选章节只能从 R15.4/R15.6/R15.8/R15.10/R15.12/R15.14/R15.16 装配。
4. 写 formal §14 forbidden carryover table,隔离旧 Step 15 和非本 Step 内容。
5. 写 Step 15 completed stop-review 和进入 Step 16 的门禁。

### 7. R15.15 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 cross-step closure 和正式 §14 候选草稿停审 | pass |
| 是否覆盖 Step 6~14 对齐关系 | pass |
| 是否列出 Step 16 测试切口承接方向 | pass |
| 是否形成 formal §14 source map 与禁入项思考 | pass |
| 是否未写正式 §14 候选草稿、test case schema、implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.16 cross-step closure and formal §14 candidate stop-review:再写入`;只允许写入 cross-step closure audit table、Step 16 test handoff checklist、formal §14 source map table、formal §14 forbidden carryover table、Step 15 completed stop-review 和进入 Step 16 的门禁;不得直接修改正式 `03-详细设计.md`;不得写正式 §14 候选草稿、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。

---

## R15.16 cross-step closure and formal §14 candidate stop-review:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| Step 状态 | Step 15 completed_wait_user_confirm |
| 用户确认 | 已确认从 `R15.15` 推进到 `R15.16`。 |
| 本模块写入范围 | cross-step closure audit table、Step 16 test handoff checklist、formal §14 source map table、formal §14 forbidden carryover table、Step 15 completed stop-review 和 Step 16 entry gate。 |
| 本模块禁止范围 | 正式 §14 候选草稿正文、test case schema、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook、具体 config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. cross-step closure audit table

| Step | closure status | Step 15 closure statement | open blocker |
|---|---|---|---|
| Step 6 object contracts | pass | observability 只引用 trace、audit、diagnostic、marker、report、handoff、safe summary 和 body-free refs;不新增对象字段。 | none_at_R15.16 |
| Step 7 trait / port / adapter | pass | safe diagnostic、availability summary、redaction marker、publisher/handoff outcome 均要求来自正式 port / mapper / resolver。 | none_at_R15.16 |
| Step 8 protocol contracts | pass | Step 15 不改 command/query/event/job DTO,只约束 metadata、trace context、receipt/report/effect shell 的观测使用方式。 | none_at_R15.16 |
| Step 9 function flows | pass | log / metric / trace / audit cuts 已按 Command、Query、Inbound、Outbound、Job 分支区分 accepted、rejected、duplicate、failed、blocked、no-write。 | none_at_R15.16 |
| Step 10 state machine | pass | metric state、diagnostic category 和 availability/degraded 语义只复制正式 state / marker,不从 observability 后端反推状态。 | none_at_R15.16 |
| Step 11 persistence / transaction | pass | stored result、receipt、report、audit、trace、marker、checkpoint 是 replay/audit source;log/metric 不替代持久化 truth。 | none_at_R15.16 |
| Step 12 error / recovery | pass | rejected、failed、degraded、unavailable、manual/consistency issue 只暴露 safe recovery surface。 | none_at_R15.16 |
| Step 13 concurrency / idempotency | pass | duplicate replay 只复制 stored result/receipt/report/checkpoint,不新增 audit、candidate 或 truth mutation。 | none_at_R15.16 |
| Step 14 config / dependencies | pass | config validation、adapter availability、runtime binding、target binding 只进入 redacted diagnostic / binding refs;不写具体 key/env/topic/URL。 | none_at_R15.16 |

### 3. Step 16 test handoff checklist

| handoff test cut | 覆盖方向 | source |
|---|---|---|
| no raw body | 验证 log、span、audit、diagnostic、report/handoff 不含 request/event/provider/method/report/archive body。 | R15.6/R15.10/R15.14 |
| no secret / config value | 验证 secret、token、credential、connection string、URL/topic concrete value 不进入 log/metric/trace/diagnostic。 | R15.6/R15.8/R15.14 |
| metric label low-cardinality | 验证 label 只含 family/kind/state/result/category,不含 trace id、actor/subject/truth refs、raw endpoint/topic。 | R15.8/R15.14 |
| no synthetic marker | 验证 degraded/redaction/diagnostic/publication/handoff marker 来自正式 mapper/resolver/source。 | R15.10/R15.12/R15.14 |
| query no-write | 验证 query success/empty/not-visible/degraded 不写 audit、stored command result、event candidate 或 repair。 | R15.4/R15.12 |
| duplicate no-rerun | 验证 duplicate replay 不重跑业务,不新增 audit/candidate/truth mutation。 | R15.10/R15.12 |
| post-commit failure no rollback | 验证 publication/handoff failure 只写 outcome/marker/diagnostic,不回滚 accepted truth。 | R15.12/R15.14 |
| source-missing stop | 验证 audit subject、safe actor、diagnostic、report/handoff receipt 来源缺失时必须停审回补。 | R15.12/R15.14 |

### 4. formal §14 source map table

| formal §14 candidate block | only source | assembly note |
|---|---|---|
| §14.1 Observability layering and principles | R15.4 | 装配 runtime log / metric、business trace / audit、report、marker、diagnostic 分层和非替代关系。 |
| §14.2 Structured log cuts | R15.6 | 装配 API / application / repository/UoW / inbound / outbound / publisher / job / adapter / config validation 日志切口。 |
| §14.3 Metric cuts | R15.8 | 装配 counter/histogram/gauge family、allowed labels、forbidden labels。 |
| §14.4 Trace / span / correlation cuts | R15.10 | 装配 trace context source、span boundary、correlation rules、prohibited span payload。 |
| §14.5 Audit / operations fact cuts | R15.12 | 装配 accepted business audit、operations fact、non-audit branch redline、source-missing stop。 |
| §14.6 Redaction / sensitive boundary / handoff | R15.14 | 装配 sensitive field boundary、body-free/redaction source mapping、forbidden field categories、handoff。 |
| §14.7 Downstream handoff | R15.14/R15.16 | 装配 Step 16 / 04 / 07 / 19 handoff summary,不写测试 schema、配置键或实施 commit。 |

### 5. formal §14 forbidden carryover table

| forbidden carryover | result |
|---|---|
| 旧 `MethodContent` / publish / snapshot / fingerprint / old outbox relay 观测项 | rejected;historical pollution。 |
| 告警阈值、SLO、dashboard、采样率、retention、runbook | deferred;后续运维/配置/验收文档处理。 |
| 具体 config key、env、profile、topic、queue、URL、cron、numeric policy | deferred;进入 `04-配置设计.md`。 |
| test case schema、fixture、evidence schema、CI command | deferred;进入 Step 16 / `05-测试方案.md` / `06-验收标准.md` / `07-实施计划.md`。 |
| implementation code、具体 crate/file edits、commit plan | rejected for Step 15;后移实施计划与实现仓。 |
| 新增未闭口 port / mapper / DTO / marker / schema | blocked if discovered;必须回对应 Step 补口。 |
| raw body、secret、provider payload、external document body、synthetic marker | rejected;违反 redaction 与 body-free boundary。 |

### 6. Step 16 entry gate

进入 Step 16 `定义测试切口与最小验证清单` / `R16.1 开工与必读文档:先思考` 前必须满足:

- Step 15 `R15.1` ~ `R15.16` 均已 completed_wait_user_confirm。
- 正式 `03-详细设计.md` 仍未由 Step 15 直接修改。
- Step 16 启动时必须先读取 `project_execution_ledger.md`、`03_ddd_calibration_flow.md`、当前 Step 16 文件、正式 `00/01/02`、Step 1~15 中间产物、SOP 与书写规范。
- Step 16 旧文件若存在,仍按 historical_material 处理,不得继承旧 completed 状态或旧测试切口。
- Step 16 只定义最小测试切口和验证清单,不得写完整测试方案、evidence schema、CI pipeline、验收标准或实施计划。

### 7. R15.16 final stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 cross-step closure audit table | pass |
| 是否写入 Step 16 test handoff checklist | pass |
| 是否写入 formal §14 source map table | pass |
| 是否写入 formal §14 forbidden carryover table | pass |
| 是否形成 Step 15 completed_wait_user_confirm 与 Step 16 entry gate | pass |
| 是否未写正式 §14 候选草稿正文 | pass |
| 是否未写 test case schema、implementation code、配置键或运维阈值 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.1 开工与必读文档:先思考`;只允许思考 Step 16 的开工边界、必读文档、Step 15 handoff、L1-governance 框架参考、旧 Step 16 污染隔离、测试切口分批计划和 `R16.2` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、告警阈值、SLO、dashboard、采样率、retention、runbook 或具体 config key/env/topic/URL。
