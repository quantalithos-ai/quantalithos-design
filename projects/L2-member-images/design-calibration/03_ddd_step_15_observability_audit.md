# L2-member-images 03 详细设计 Step 15：可观测性与审计埋点契约

> 创建日期：2026-08-31  
> 状态：`completed_stop_review`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 15  
> 回填位置：正式 `03-详细设计.md` 第 14 章“可观测性与审计埋点契约”（当前仅形成回填草稿，禁止装配正式 03）  
> 当前门禁：Step 15 已完成并停审；未经用户再次明确确认，不得进入 Step 16、装配正式 `03-详细设计.md`、实现、测试或提交。

## 0. Step 状态与开工确认

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 15：可观测性与审计埋点契约。 |
| 恢复入口 | 已先读取项目执行台账、03 flow、Step 14 及 Step 6、7、8、9、11、12、13 的必要约束，并读取详细设计 SOP/书写规范与 `L1-governance` Step 15 的粒度样例。 |
| 直接输入 | Step 6 的 `ImageTraceRecord`、composition carrier 与 static/live 红线；Step 7 的 `append_trace`、repository/UoW/adapter port；Step 8 的协议库存；Step 9 的逐接口处理流；Step 11 的 append-only/同 UoW 约束；Step 12 的错误与脱敏边界；Step 13 的 duplicate/replay 边界；Step 14 的 config/slot/composition 边界。 |
| 方法参照 | 只借鉴 `L1-governance` 的“日志 → 指标 → local audit/trace → redaction → 跨 Step 审计 → 回填草稿”粒度和表格格式。不继承其 outbox、publisher、receipt、job run/report、handoff/export、外部 GRC、观测后端或正向运行结论。 |
| 本 Step 目标 | 让未来实现者知道在何处形成安全 structured log、低基数 metric、runtime span 以及既有 local trace/audit cut，同时知道哪些路径必须保持零业务审计写入。 |
| 本 Step 不做 | 不选 observability 产品、日志/metric/trace backend、endpoint、credential、dashboard、SLO、告警、采样率、保留期、runbook、数据导出、report/evidence、outbound event、outbox、publisher、receipt、job run 或 readiness。 |
| 完成结论 | `pass_with_explicit_blockers`：已定义 product-neutral 的代码埋点切口和本地 trace/audit 边界；没有新增对象、port、协议、状态、store、event 或外部合同。 |
| 强制停点 | 当前只允许等待用户明确确认 Step 16。旧正式 `03-详细设计.md` 未读取，仍禁止装配。 |

### 0.1 当前可达性：观测不改变业务写入边界

| logical surface | 当前可形成的观测信号 | 当前绝不允许形成的 local record / 业务效果 |
|---|---|---|
| 10 个 Command | validation/context 或 `DDD-S9-B01/B02` fail-closed 分支可形成安全 log、metric、span。 | 零 UoW、零 canonicalize、零 reservation、零 truth/gap/freshness/result/replay/commit，且零 `ImageTraceRecord` 与 availability history。 |
| 6 个 Operations Job | action marker / boundary / `DDD-S9-B01/B02` stop 可形成安全 log、metric、span。 | 零 page selection、零 adapter call、零 run/report/evidence、零 local trace/history/gap/freshness/result/commit。 |
| 10 个 Query | strict read-only completion/degraded surface 可形成安全 log、metric、span。 | 不得为“读审计”创建 trace、marker、projection repair、gap、idempotency、source refresh 或任何 UoW。 |
| 2 条条件入站 | marker-only disposition 可形成安全 log、metric、span，且必须显式 `accepted_input=false`。 | 无 envelope、payload、event ID、receipt、dedup、quarantine、snapshot/gap/truth write 或 `ImageTraceRecord`。 |
| runtime composition | config/slot validation 可形成 local-composition log、metric、span。 | `Assembled`/slot `Available` 不得被记录为 provider health、build success、gate pass、Artifact acceptance、consumer confirmation、process/container start 或 readiness。 |
| outbound | 无。`ImageOutboundEventInventory::NoneAuthorized` 是严格零库存。 | 无 outbox、publisher、topic、delivery、notification、outbound metric/span/audit 或“发布成功”日志。 |

这里的 structured log、metric 与 span 是未来实现的运行期诊断信号，不是本仓持久化业务状态。它们不能被用来绕开前述零写约束，也不能作为 owner contract、证据、验收、signoff 或 readiness 的替代品。

## 1. Step 内计划、批次与停审门禁

| 批次 | 覆盖范围 | 状态 | 完成判断 |
|---:|---|---|---|
| 15.0 | 恢复、输入准入、SOP 问答、当前可达性判定 | `done` | 已确认旧正式 03 不可读；未把 L1-governance 的出站/报告/后端概念搬入本仓。 |
| 15.1 | signal model、owner 与 code-cut 边界 | `done` | 已明确 structured log、metric、span、`ImageTraceRecord` 和 external observability truth 的区别。 |
| 15.2 | 日志埋点、错误分支、字段与脱敏规则 | `done` | 当前 fail-closed/read-only/marker-only 分支与 future/reopen 分支均有不越界的记录规则。 |
| 15.3 | 指标、低基数标签与 span 切口 | `done` | 没有 actor/subject/request/trace ID、payload、endpoint、secret 或高基数字段作为 metric label。 |
| 15.4 | local trace/audit cut、`append_trace` 原子性与禁止审计清单 | `done` | audit 只使用既有 append-only `ImageTraceRecord`；无 audit backend/outbound event。 |
| 15.5 | static/live 与外部边界、跨 Step 闭环、回填草稿、blocker/handoff、自检 | `done` | 未修改正式 03，未创建 Step 16/04，全部 blocker 保持开放。 |

| Step / 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| `observability_audit` | done | done | done | done | done | done | `pass_with_explicit_blockers` | 已停审，等待用户明确确认 Step 16。 |

## 2. 输入准入与 SOP 问题回答

### 2.1 输入准入

| 输入 | 当前状态 | 本 Step 的限定用法 | 不可从中推导的内容 |
|---|---|---|---|
| `详细设计讨论流程_SOP.md` Step 15、`详细设计书写规范.md` §5.14 | normative / 已读取 | 固定日志、指标、审计事件三张表和“只写 code cut，不写运维阈值”的边界。 | backend、告警、运维流程或任何现有运行事实。 |
| Step 6 `ImageTraceRecord` | completed | 固定其字段、append-only、body-free、非第二 truth 的性质。 | runtime span body、log body、report/evidence、outbox、receipt 或 external audit truth。 |
| Step 7 `ReferenceDerivedRepositoryPort::append_trace` | completed | 固定 trace 只能由 owning future/reopen application flow 在同一 UoW 使用。 | 新 trace port、update/delete、query write 或 standalone audit transaction。 |
| Step 8 / 9 协议与 flow | completed with blockers | 固定 Command/Job B01/B02、Query no-write、marker-only inbound、zero outbound 的所有埋点前提。 | 成功 Command/Job、accepted input、event receipt、scheduler/report 或 outbound flow 当前可达。 |
| Step 11 / 12 / 13 | completed with blockers | 固定 UoW、append-only、错误映射、redaction、duplicate/replay、unknown 的观测上限。 | 通过日志、metric 或 trace 解决 B03、PF、in-flight 或 reservation namespace 缺口。 |
| Step 14 config/composition | completed with blockers | 固定 `ImageRuntimeAssemblyState`、slot marker 和 raw-config 不外泄边界。 | Assembled/Available 等于外部健康、业务成功、发布成功或 readiness。 |
| `L1-governance` Step 15 | granularity reference only | 参考分层表格、错误字段和前序审计方法。 | outbox/publisher/consumer receipt/job report/handoff/export/GRC/backend 等治理领域对象。 |
| 上游与 sibling 资料 | owner / pending input | 只在 local safe ref、gap、blocked/unavailable 语义上引用。 | digest、Artifact acceptance、Member Service confirmation、Role mapping body、provider run、产品观测数据或 ready 结论。 |
| 旧正式 `03-详细设计.md` | historical_material / not opened | 无。 | 读取、继承或修补旧正文。 |

### 2.2 SOP 问题回答

| # | SOP 问题 | 收敛回答 |
|---:|---|---|
| 1 | 哪些处理流必须记录审计？ | 只有 future/reopen 的**已允许且 flow 明确要求**的 local subject/gap/freshness/reference maintenance effect，才能在同一 UoW 内追加既有 `ImageTraceRecord`。当前 B01/B02 Command/Job、全部 Query、两个 marker-only inbound、config/slot composition 与零 outbound 都不写 local business audit。 |
| 2 | 哪些错误分支必须记录日志？ | config/slot validation blocked/unknown、Command/Job validation 或 B01/B02 stop、Query `Unavailable`/`Gap`/`Stale`/`Rebuilding`、marker-only inbound disposition、future/reopen repository/UoW/trace append/adapter error、raw-body boundary breach 都必须有安全 structured log cut。不得将 rejected/blocked 记成 accepted trace。 |
| 3 | 哪些关键路径需要指标？ | local composition、config/slot validation、Command/Job boundary disposition、Query surface、conditional inbound marker、future local trace append、future repository/UoW/adapter safe assessment 需要 counter/histogram。没有 outbound、build success、gate pass、Artifact acceptance、consumer confirmation、container health 或 readiness 指标。 |
| 4 | 日志、指标、审计字段分别记录什么？ | log/span 只放 safe ref、operation/disposition/state/error kind、redacted diagnostic ref、duration 与受限计数；metric 只放有限 kind/state/result label；`ImageTraceRecord` 仅保留它既有的 local subject、body-free source refs、correlation/causation、`SafeReason` 和 local recorded time。 |
| 5 | 哪些监控和告警细节应留给运维手册？ | backend、日志格式实现、采样、保留期、cardinality budget、dashboard、告警阈值、SLO、pager、查询语句、endpoint、credential、运营 runbook、真实健康检查与故障处置均不在本 Step 决定。 |

## 3. 当前材料诊断与设计取舍

### 3.1 诊断

| 来源 | 已有收敛 | 若直接实现的风险 | 本 Step 的处理 |
|---|---|---|---|
| Step 6 trace object | 已有 body-free local trace，但没有区分它与 runtime tracing。 | 将 `ImageTraceRecord` 当 span/log event，塞入 provider body、payload、live state 或 evidence。 | 规定 runtime span 与 local trace record 绝不互相替代；trace record 仅保留既有字段。 |
| Step 7 port/UoW | `append_trace` 已存在，且 trace append-only。 | 为日志/Query/error 临时开独立 audit UoW，或在 trace append 失败后另行补写。 | trace 只由 owning future/reopen flow、同一 UoW、flow-required 的地方调用；否则只产生日志/metric/span。 |
| Step 8 / 9 public surface | 10 Command、10 Query、2 条 conditional inbound、6 Job、0 outbound 均已有逻辑边界。 | 在每个入口“为了审计”新增 request/event payload、receipt、run/report、publisher 或读侧 repair。 | 按当前流的实际 reachability 记录；不新增 protocol field、route、topic 或 transport truth。 |
| Step 11 persistence | 本地 trace 与 history 有 append-only/transaction 规则，且 outbound 为零。 | 将 local trace、stored result、availability history 当 delivery receipt 或可导出的审计流水。 | 只允许 local `GetImageTrace` 的 future read 方向；无 external consumer、delivery、archive 或 evidence。 |
| Step 12 error | 统一 `ImageApplicationError` / protocol-safe `SafeReason`，禁止 raw error 穿透。 | 把 SQL/SDK/HTTP/event body、stack trace、secret、configuration 或 adapter response 写入日志。 | 日志/span/trace 使用 error kind、safe reason category、redacted diagnostic ref；不新增错误 enum 或 diagnostic store。 |
| Step 13 concurrency | duplicate/replay/commit unknown 有严格上限。 | 用 metric/log correlation 充当 idempotency key、in-flight state 或 recovery evidence。 | observability 数据不能参与 identity、replay 或 recovery decision；duplicate 不新增 local trace。 |
| Step 14 composition | `Assembled` 与 slot `Available` 仅为 local composition。 | 把正常 assembly info log、availability metric 误称 build/consumer/runtime readiness。 | 所有 composition 信号注明“local only”；不得形成 external health/readiness gauge。 |

### 3.2 设计取舍

| 议题 | 候选 | 本 Step 结论 | 取舍理由 |
|---|---|---|---|
| 本地业务可追溯载体 | 新建 telemetry/audit ledger；或使用既有 `ImageTraceRecord` | 使用既有 record，不新增 ledger。 | 本仓不拥有 observability backend 或第二 truth。 |
| rejected/blocked 的记录 | 写 failed business trace；或只记录 runtime diagnostic signal | 采用后者。 | B01/B02、Query、marker-only input 的禁止写入不能被“审计”绕过。 |
| Query 观测 | 每次读写 audit/marker；或只记录非业务 log/metric/span | 采用后者。 | Query 必须保持 strict no-write。 |
| conditional inbound | 记录 source event/receipt/dedup；或只记录 marker disposition | 采用后者。 | `MI-UP-005` 未闭合，且当前不存在 envelope/payload/receipt。 |
| 指标标签 | 放 object/request/trace ID；或只放有限类别 | 只放低基数类别。 | 避免敏感泄漏与高基数；单记录定位应回到 safe log/trace ref。 |
| composition observation | 记成 provider health/readiness；或仅记 local assembly state | 仅记 local assembly state。 | slot 装配不证明任何 external/consumer/runtime result。 |
| trace append failure | 另开补偿 trace 或忽略；或对要求 trace 的 future UoW fail closed | 后者。 | 保持 required local effect 与 trace 的原子可见性，不制造补偿语义。 |

## 4. 观测信号模型与职责边界

### 4.1 四类信号的不可替代关系

| 信号 | 归属与载体 | 可记录的内容 | 不得承担 |
|---|---|---|---|
| structured log | planned entry/application/infra boundary 的瞬时结构化诊断；不新增本仓 store/port。 | safe ref、operation/disposition/state/error kind、redacted diagnostic ref、duration、受限计数。 | domain truth、trace record、replay input、event payload、receipt、report/evidence、外部观测真相。 |
| metric | planned local instrumentation facade 的聚合值；backend 未选。 | counter/histogram 及有限 kind/state/result label。 | 单条对象定位、actor/subject/request/trace identity、readiness、外部 health 或 acceptance proof。 |
| runtime span | planned handler/application/infra 调用范围；不是 domain object。 | safe correlation/ref、operation、disposition、error kind、duration、有限 count。 | `ImageTraceRecord` body、business state、outbound delivery、external trace backend contract。 |
| `ImageTraceRecord` | 既有 `ReferenceDerivedRepositoryPort` append-only local record。 | fixed body-free fields：subject、sources、correlation/causation、safe reason、recorded time。 | runtime span/log body、external audit/event/outbox、live state、payload/evidence、truth reconstruction。 |

`ImageTraceRecord` 不是“所有操作均必写”的通用日志。它只在 future/reopen 的 owning flow 已合法取得 local subject、通过 guard，并且该 flow 需要 local trace 时与其 UoW 一起 stage；commit 后才对 Query 可见。runtime log/metric/span 永远不能被用来推导该 record 已追加或 UoW 已提交。

### 4.2 模块级埋点职责

| 模块 / planned file | 可形成的观测 cut | 绝对禁止 |
|---|---|---|
| `api` logical entry | Command/Query outer span、request-safe completion log、counter/histogram；不读取 raw config。 | route/HTTP status/body、raw request、actor/authorization truth、写 trace 或 projection repair。 |
| `worker` logical entry | conditional inbound marker-only span/log/metric。 | envelope/payload/event ID/receipt/dedup、accepted input、UoW、snapshot/gap/trace write。 |
| `jobs` logical entry | job action marker/boundary span/log/metric。 | scheduler/run/tick/report/evidence、page selection before B01、trace/result/UoW current write。 |
| `application` coordinator/facade | safe outcome/error mapping、future UoW/trace append span boundary。 | raw provider/config/storage error、new telemetry truth、bypassing flow/UoW or changing protocol surface。 |
| `domain` | 无 backend-dependent log/metric/span creation。 | clock、logger、metric facade、trace backend、external diagnostic body。 |
| `infra/config.rs` / `infra/runtime_builder.rs` | config/slot/local assembly validation log/metric/span。 | raw config/secret/endpoint 外泄、process/container start、将 assembly变成 readiness。 |
| repository / UoW / adapter implementation | future/reopen safe error/outcome cut；`append_trace` 同 UoW outcome。 | SQL/SDK/HTTP body、provider health assertion、implicit repair、outbox/publisher/export。 |
| `infra/fakes.rs` | future TestOnly parity signal only。 | production fallback、evidence/readiness、替代 owner/external result。 |

### 4.3 当前与 future/reopen 的信号准入

| 流程类别 | 当前允许的 runtime signal | future/reopen 才可能允许的 local trace/audit | 不可因 signal 改变的规则 |
|---|---|---|---|
| Command | validation/B01/B02 log、metric、span。 | 只有 B01/B02 和 per-protocol canonical/result gap 均正式重开后，且该 flow 要求时才能 append trace。 | 当前不 canonicalize/reserve/UoW/write/result/commit；拒绝和 duplicate 不自动写新 trace。 |
| Job | marker/boundary/B01/B02 log、metric、span。 | 只有 future selected scope、UoW、local effect 与 result/replay contract 全部合法后才可能 append。 | 无 scheduler/run/report/evidence；当前不选 page、不调 adapter。 |
| Query | read completion/degraded log、metric、span。 | 永不允许。 | no UoW/reservation/trace/gap/freshness/view write/repair。 |
| conditional inbound | marker disposition log、metric、span，`accepted_input=false`。 | 永不允许，直到 owner contract重开并重新审计。 | 无 envelope/payload/receipt/dedup/UoW/truth write。 |
| config/composition | validation/slot/assembly log、metric、span。 | 永不以 composition 结论追加 business trace。 | blocked/assembled 都不是 business state、external health或 readiness。 |
| outbound | 无。 | 无。 | inventory 是 `NoneAuthorized`，不存在 publisher/outbox/delivery。 |

## 5. 日志埋点表与错误分支规则

### 5.1 日志埋点表

> 所有表项均为 future implementation code cut，不选择 logger crate、sink、格式、采样或 retention。`safe_*_ref` 只表示既有 typed/body-free ref；缺安全 ref 时应省略字段，不能拼造 raw identifier。

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| `infra/config.rs` configuration validation rejected / blocked | `warn` 或 `error` | `operation=config_validation`、`config_ref_optional`、`disposition`、`error_kind`、`safe_reason_category`、`redacted_diagnostic_ref_optional` | 定位 private config 不合规；不暴露 raw source、key、value、secret 或 endpoint。 |
| `infra/runtime_builder.rs` slot assessment | `debug`（Available）/`warn`（Blocked、Unknown、FakeOnly in Production） | `operation=slot_assessment`、`slot_kind`、`seam_kind`、`local_availability`、`safe_reason_category_optional` | 解释 local composition 决策；不是 provider health 或 business result。 |
| `infra/runtime_builder.rs` assembly validation completed | `info`（Assembled）/`warn`（Blocked） | `operation=runtime_composition`、`assembly_lifecycle`、`bounded_required_slot_count`、`fake_mode`、`safe_reason_category_optional`、`duration` | 说明 local wiring validation 的结果；必须显式避免 `ready`、`healthy`、`started` 等语义。 |
| Command entry validation/context reject | `warn` | `entry_kind=command`、`command_kind`、`safe_correlation_ref_optional`、`disposition=Rejected`、`error_kind`、`redacted_diagnostic_ref_optional` | 定位 metadata/typed-ref/contract failure；不记录 raw request、idempotency key或 command body。 |
| Command `DDD-S9-B01/B02` stop | `warn` | `entry_kind=command`、`command_kind`、`safe_correlation_ref_optional`、`disposition=Blocked`、`blocker_id`、`error_kind=ContractGap`、`duration` | 显式展示 fail-closed，但不产生 trace/history/gap/result/replay/commit。 |
| future/reopen Command committed local effect | `info` | `entry_kind=command`、`command_kind`、`safe_correlation_ref`、`safe_subject_ref_set_limited`、`disposition=Accepted`、`trace_ref_set_limited`、`duration` | 仅在所有 reopen prerequisite 满足且同一 UoW 已明确提交后关联 local effect；不表示 external build/publish/Artifact/consumer/runtime success。 |
| future/reopen duplicate/conflict/replay mapping | `info`（duplicate）/`warn`（conflict、missing result） | `entry_kind`、`operation_kind`、`safe_correlation_ref_optional`、`disposition`、`error_kind`、`stored_result_ref_optional`、`duration` | 证明只走既有 replay/error surface；duplicate 不追加新 trace、不重跑 domain/adapter/page。 |
| Query handler completion | `debug` 或 `info` | `entry_kind=query`、`query_kind`、`surface_status`、`content_state`、`visibility_state`、`safe_subject_ref_optional`、`duration` | 诊断 existing read outcome；不把 local reachability 写成 authorization。 |
| Query degraded / unavailable / gap | `warn`（不可用/contract gap）或 `debug`（expected empty/stale） | `entry_kind=query`、`query_kind`、`surface_status`、`safe_reason_category_optional`、`redacted_diagnostic_ref_optional`、`duration` | 便于定位读侧 degraded 状态；禁止 query-time repair、marker/trace/gap write。 |
| conditional inbound boundary disposition | `info`（rejected marker）/`warn`（Unavailable、ReopenRequired） | `entry_kind=conditional_inbound`、`consumer_name`、`marker_disposition`、`accepted_input=false`、`safe_reason_category_optional`、`duration` | 说明当前不是 active consumer；禁止 event metadata、payload、receipt、dedup 或 source event ID。 |
| Job validation/boundary/B01/B02 stop | `warn` | `entry_kind=job`、`job_kind`、`action_availability`、`disposition`、`blocker_id_optional`、`error_kind_optional`、`duration` | 解释 bounded action 为什么未执行；不得记录 scheduler/run/tick/page item、report 或 evidence。 |
| future/reopen repository/UoW failure | `error` | `operation_kind`、`repository_group_or_uow_phase`、`safe_subject_ref_optional`、`error_kind`、`safe_reason_category_optional`、`redacted_diagnostic_ref_optional`、`duration` | 定位 `Unavailable`、version conflict、`TransactionBoundary` 或 append failure；不记录 SQL、connection string、stack trace。 |
| future/reopen reference/adapter safe assessment | `warn`（Blocked/Unavailable/Unknown）/`debug`（non-positive local observation） | `operation_kind`、`seam_kind`、`assessment_class`、`safe_source_ref_optional`、`safe_reason_category_optional`、`duration` | 显示 conservative boundary result；不可记录 adapter body、endpoint、ACK/tag/cache，或称为 external success。 |
| future/reopen `append_trace` completion/failure | `debug`（committed append）/`error`（required append failure） | `operation=append_trace`、`safe_subject_ref`、`trace_ref_optional`、`append_result`、`uow_phase`、`error_kind_optional` | 验证 append-only local trace 的同 UoW cut；不输出 trace source body、reason text 或 record body。 |
| boundary validator detects forbidden raw body/live state | `error` | `operation=boundary_validation`、`boundary_kind`、`disposition=Rejected`、`error_kind=ContractViolation`、`redacted_diagnostic_ref_optional` | 使安全污染可诊断；不得将被拒绝的内容本身写回日志。 |

### 5.2 日志字段、等级与错误分支规则

| 规则 | 正式要求 |
|---|---|
| safe ref | log/spans 只可记录 existing typed local ref、body-free external ref、correlation/causation ref、safe gap/ref 或受限 trace ref。不得把 string ID、manifest、digest、tag、event ID、provider run ID 作为替代字段。 |
| redacted diagnostic | 只能使用已有安全原因/脱敏 diagnostic ref。不得新增 diagnostic persistence、将 raw error 拼进 message，或把 stack trace 作为字段。 |
| duration / count | 允许 handler/application/infra boundary 产生 duration 与 bounded count；不得在 domain 读取 clock。Job B01/B02 前没有 selected-item count；不能把 count 变成 scheduler/report 数据。 |
| level | validation/domain/protocol reject、B01/B02、gap/unknown、idempotency conflict 使用 `warn`；configuration reject、UoW/rollback/required trace append failure、forbidden body 使用 `error`；正常 local read/assembly or duplicate replay 使用 `debug`/`info`。实际 level routing 留实现与运维。 |
| rejected path | rejected/blocked/unknown 的 log 不是 accepted audit。它不允许写 `ImageTraceRecord`、availability history、gap、freshness、stored result或 outbound effect。 |
| duplicate path | future duplicate replay可以写 runtime log/metric/span，但不得新增 local trace、truth/history/projection/replay record，且不得重跑 adapter/page selection。 |
| message text | message 应为固定、无敏感内容的 event sentence；可变诊断只能进入安全类别/ref。禁止 free-form request、payload、provider response 或 configuration echo。 |

## 6. 指标埋点表、标签与 span 切口

### 6.1 指标埋点表

> 下列名称是 planned code identifier，不暗示已有 exporter、backend、dashboard、告警或数据。所有 `*_total` 与 histogram 只描述本仓 local code-cut；它们不得成为 policy/evidence/readiness 输入。

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `member_images_config_validation_total` | counter | `infra/config.rs` validation return 后 | `result`、`failure_class_optional` |
| `member_images_runtime_composition_validation_total` | counter | `ImageRuntimeAssemblyState::validate` 的 infra wrapper 返回后 | `assembly_lifecycle`、`fake_mode` |
| `member_images_adapter_slot_assessment_total` | counter | slot marker validation/record wrapper 后 | `slot_kind`、`seam_kind`、`local_availability` |
| `member_images_command_boundary_total` | counter | Command handler return 前 | `command_kind`、`disposition`、`error_kind_optional` |
| `member_images_command_boundary_duration` | histogram | Command handler outer span 结束时 | `command_kind`、`disposition` |
| `member_images_query_total` | counter | Query handler return 前 | `query_kind`、`surface_status`、`content_state`、`visibility_state` |
| `member_images_query_duration` | histogram | Query handler outer span 结束时 | `query_kind`、`surface_status` |
| `member_images_conditional_inbound_boundary_total` | counter | marker-only boundary return 前 | `consumer_name`、`marker_disposition`、`accepted_input_class=always_false` |
| `member_images_job_boundary_total` | counter | Job entry return 前 | `job_kind`、`disposition`、`action_availability` |
| `member_images_job_boundary_duration` | histogram | Job entry outer span 结束时 | `job_kind`、`disposition` |
| `member_images_local_trace_append_total` | counter | future/reopen `append_trace` return 后 | `subject_kind`、`append_result` |
| `member_images_local_store_operation_total` | counter | future/reopen repository/UoW return 后 | `repository_group_or_uow_phase`、`operation_class`、`outcome_class` |
| `member_images_reference_or_adapter_assessment_total` | counter | future/reopen resolver/adapter safe assessment return 后 | `seam_kind`、`assessment_class` |

### 6.2 指标标签规则与禁止指标

| 规则 | 正式要求 |
|---|---|
| 低基数标签 | 只能使用已枚举的 operation kind、query/job/consumer kind、state、disposition、error category、slot/seam kind、local availability、content/visibility/freshness class等有限集合。 |
| 禁止高基数 | actor/subject/request/result/trace/gap/entry/transaction/object ID、idempotency key、stable input ref、cursor、watermark、source ref、event/provider run ID、manifest/image/digest/tag、free text均不得作为 metric label。 |
| 禁止敏感值 | raw config、secret、credential、token、endpoint、topic、payload、role/method/component/seed body、live memory/workspace、SQL/HTTP/SDK response、stack trace 均不得作为 label或数值。 |
| aggregation边界 | metric 只统计 local code path 的 disposition，不能统计或宣布 build success、gate pass、Artifact accepted、consumer confirmed、container/runtime health、publish/delivery或 readiness。 |
| 无 outbound 指标 | 不得创建 `outbox`、`publisher`、`delivery`、`event`、`receipt`、`export`、`handoff`、`report` 等指标；它们会虚构当前不存在的逻辑 surface。 |
| domain 独立 | domain object 不依赖 metric facade；metric 只在 entry/application/infra wrapper 形成。 |

### 6.3 runtime span 切口表

| span cut | 开始位置 | 允许字段 | 结束条件 |
|---|---|---|---|
| `member_images.runtime_composition` | `infra/runtime_builder.rs` 开始 config/slot composition validation | `operation_kind`、`config_ref_optional`、`fake_mode`、`assembly_lifecycle`、`safe_reason_category_optional` | 返回 local Assembled/Blocked verdict；不启动任何 process。 |
| `member_images.command` | Command logical handler 收到已解析的 protocol carrier 后 | `command_kind`、`safe_correlation_ref_optional`、`disposition`、`error_kind_optional` | validation reject、B01/B02 stop，或 future/reopen protocol result；当前没有 local mutation child span。 |
| `member_images.query` | Query logical handler 开始 exact/page read 后 | `query_kind`、`safe_subject_or_scope_ref_optional`、`surface_status`、`content_state`、`visibility_state` | existing read surface 返回；不得启动 repair/rebuild/trace child span。 |
| `member_images.conditional_inbound` | conditional marker boundary 被检查时 | `consumer_name`、`marker_disposition`、`accepted_input=false`、`safe_reason_category_optional` | 返回 marker disposition；无 envelope/event/source ID/payload attribute。 |
| `member_images.job` | bounded Job action marker 形成后 | `job_kind`、`action_availability`、`disposition`、`error_kind_optional` | boundary return/B01/B02 stop，或 future/reopen job result；无 scheduler/run/report attribute。 |
| `member_images.local_uow` | future/reopen `ImageUnitOfWorkManager::begin` 成功后 | `operation_kind`、`safe_correlation_ref`、`uow_phase`、`outcome_class` | commit/rollback/unknown return；不记录 transaction ID、SQL、row count 或 staged body。 |
| `member_images.reference_resolution` | future/reopen application 调用 resolver/boundary port 前 | `seam_kind`、`safe_source_ref_optional`、`assessment_class`、`error_kind_optional` | safe conclusion/blocked/unavailable/unknown return；不记录 provider endpoint/body。 |
| `member_images.local_trace_append` | future/reopen required `append_trace` 调用前 | `subject_kind`、`safe_subject_ref`、`append_result_optional`、`uow_phase` | trace append result或 UoW failure；不能替代 `ImageTraceRecord` 本身。 |

### 6.4 span context 规则

| 规则 | 正式要求 |
|---|---|
| context source | 使用既有 protocol/application 的 safe correlation context；没有合法 context 时保留 absent/validation failure，不生成随机 correlation 用来掩盖缺口。 |
| span 与 record | span 是 ephemeral runtime scope，`ImageTraceRecord` 是 local append-only record。二者可关联同一 safe correlation ref，但互不生成、互不证明。 |
| async / adapter | adapter span 只能记录 local seam kind 和安全结果；不得传播或存储 provider trace headers、endpoint、request/response body、run ID、credential。 |
| outbound absence | 无 publisher/outbox/delivery span。任何需求此类 span 的实现都必须停止并重开 Step 5、7、8、9、11~15。 |

## 7. local trace / 审计事件表与写入规则

### 7.1 审计事件表

> 下表的“审计事件”是**文档中的 local audit classification**，不是新 Rust enum、public event DTO、outbound event、topic、receipt、report 或 external backend record。唯一持久化载体仍是既有 `ImageTraceRecord`，且下表的 future 行都受对应 flow/UoW/blocker 门禁约束。

| 审计事件 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| `LocalSubjectTraceAppend` | future/reopen Command/Job flow 已合法 stage 本仓 local subject/gap/freshness effect，且 Step 9 flow 明确要求 trace 时。 | existing `ImageTraceRecordRef`、`subject_ref`、body-free `source_refs`、`correlation_ref`、optional `causation_ref`、`SafeReason`、`recorded_at`。 | future local `GetImageTrace` read only；无 external consumer、dashboard、archive、event 或 delivery。 |
| `ReferenceMaintenanceTraceAppend` | future/reopen reference snapshot/gap/projection maintenance flow 已满足其 own guard/UoW，并且 flow 明确要求 trace 时。 | 同上；source 仅可为 exact local ref 或 body-free external ref，且不包含 source body。 | future local trace query；不得被 read model、resolver 或 external owner 当 truth/evidence。 |
| `AvailabilityLocalTraceAppend` | future/reopen availability action 的 local trace cut 在合法 append-only history/entry处理后、同一 UoW 内需要解释时。 | 同上；local availability subject/ref 与 safe reason。 | future local trace query；不证明 registry publish、Member Service confirmation、container launch 或 runtime readiness。 |
| `NoAuditOnCommandOrJobStop` | 当前 validation/B01/B02 fail-closed 分支。 | 无 `ImageTraceRecord`、无 history/gap/freshness/result/replay record。仅允许 §5/6 的 runtime diagnostic signal。 | 无。 |
| `NoAuditOnQuery` | 所有 10 Query 的 normal/empty/stale/rebuilding/unavailable/gap return。 | 无 audit record；不创建 marker、projection、gap、trace 或 repair。 | 无。 |
| `NoAuditOnConditionalInbound` | 两个 conditional inbound 的 marker-only disposition。 | 无 audit record；无 envelope/payload/receipt/dedup/snapshot/truth record，`accepted_input=false`。 | 无。 |
| `NoAuditOnCompositionOrOutbound` | config/slot/assembly validation 与 strict zero outbound inventory。 | composition仅可有 runtime signal；不存在 outbound audit/outbox/publisher/delivery record。 | 无。 |

### 7.2 `append_trace` 原子性与字段纪律

| 规则 | 正式要求 |
|---|---|
| owning flow | 只有既有 `ReferenceDerivedRepositoryPort::append_trace(trace, uow)` 的 owning future/reopen application/maintenance flow 可调用。entry、Query、domain、adapter、logger、metric facade、runtime builder 与 fake 不得绕开 flow 直接追加。 |
| UoW | 如果该 flow 要求 trace，则 local subject/gap/freshness等允许的 staged effect、trace append、stored result/reservation（若该 flow适用）必须遵守 Step 11 的同一 `ReadWrite` UoW 规则；trace 直到 commit 才可见。 |
| order | flow 先完成合法 local object/guard/typed-ref检查，再形成完整 trace，随后在同一 UoW append；不能在 validation/B01 前、Query 中或 post-commit 的独立事务补写。 |
| failure | required `append_trace` 失败时，该 future UoW 不得把相关 accepted local effect伪装为 committed；按既有 `ImageApplicationError`/`TransactionBoundary` 走 rollback/unknown 规则。不得另造补偿 trace、outbox 或 report。 |
| append-only | 不带 expected version；不 update/delete旧 trace。若解释需要修正，只能以新 local context/new trace 和合法 causation link 说明，不能改写既有记录。 |
| fixed fields | 仅允许 Step 6 已定义的 `trace_id`、`subject_ref`、`source_refs`、`correlation_ref`、optional `causation_ref`、`reason`、`recorded_at`。本 Step 不添加 trace kind、actor、event ID、payload digest、run ID、backend link、receipt、report 或 evidence 字段。 |
| truth direction | trace解释已合法的 local subject/source relation，不反写或重建 definition/build/qualification/supply truth，也不从 trace 导出 Artifact/consumer/owner truth。 |

### 7.3 不得伪装为审计的材料

| 材料 | 不是 audit / trace 的原因 |
|---|---|
| runtime log、metric、span | 均是 ephemeral local diagnostic signal；没有本仓 business persistence、accepted state或外部 delivery语义。 |
| `ImageRuntimeAssemblyState::Assembled` / slot `Available` | 只表示 local composition validation；不等 build success、external health、gate pass、Artifact acceptance、Member Service confirmation或 readiness。 |
| `StoredImageOperationResult` / idempotency record | 只服务 future replay；不是 audit trail、receipt 或 report。 |
| `AvailabilityTransition` / `ConsumerHandoffGap` / `ContractGap` / `ProjectionFreshness` | 各自是 local history/gap/derived marker；不能被重命名为 external audit、delivery confirmation或 evidence。 |
| body-free external ref / snapshot | 只是 owner-boundary reference或安全结论；不是 owner body、digest、Artifact lineage、provider result 或 contract closure。 |
| any outbound-looking record | 本仓 `ImageOutboundEventInventory::NoneAuthorized`，所以不存在 outbox、publisher、event DTO、topic、delivery、receipt、notification 或 export audit。 |

## 8. Redaction、static/live 与外部边界审计

### 8.1 字段允许/禁止矩阵

| 材料类型 | 允许字段 | 严格禁止字段 |
|---|---|---|
| structured log | safe typed/body-free ref、operation/disposition/state/error kind、safe reason category、redacted diagnostic ref、duration、受限计数。 | raw command/query/event/job body、raw idempotency key、stable input、payload、role/mapping/method/component/seed body、build log/manifest、image/digest/tag string、Artifact/consumer body、provider response、run ID、SQL、stack trace、secret/token/credential/endpoint/topic。 |
| runtime span attributes | 与 log 相同的 safe fields；有限 operation/state/count。 | request/actor/subject/trace identity以外的 raw body；provider trace context/header、endpoint、payload、secret、run/report/evidence、container/process health assertion。 |
| metric labels / values | 有限 kind/state/disposition/error-category/seam/slot/content-state。 | 所有 ref/ID、free text、payload/digest/tag、config source/path/value、endpoint、credential、topic、external response、actor/subject/request/trace、provider run ID。 |
| `ImageTraceRecord` | Step 6 fixed body-free fields；`source_refs` 只能为 local ref 或 body-free external ref。 | raw logs、diagnostic message、role/mapping/component/seed/base body、policy/memory/workspace live state、build output/manifest/digest text、evidence、Artifact lineage/body、consumer confirmation、provider payload、secret、external observability span body。 |
| `SafeReason` / redacted diagnostic ref | category、stable safe explanation/ref，且不新增 persistence。 | raw configuration、database/SDK/HTTP/broker detail、unredacted exception、customer/user/conversation content。 |
| config/composition observation | config ref optional、slot/seam kind、local availability、assembly lifecycle。 | config key/value/profile/path、endpoint、credential、provider product、external health/readiness、container/image launch data。 |
| TestOnly fake signal | explicit fake mode、port/slot kind、deterministic outcome class。 | fake private map/body、production fallback、test result/evidence/verdict/signoff/readiness。 |

### 8.2 模板、种子、构建产物与 live state 的观测边界

| 关联材料 | 本 Step 可观测的最大范围 | 永久禁止 |
|---|---|---|
| RoleDefinition / Role-to-variant mapping | body-free owner/source ref、safe blocked/gap/unknown conclusion、seam kind。 | RoleDefinition/mapping body、具体 Role decision、未闭合 mapping schema或 hardcoded mapping。 |
| runtime/tools/member/supervisor/extras | static immutable component/ref 的存在性或 non-positive safe conclusion。 | runtime loop、tool invocation/capability registry、member主体、supervisor body、compatibility positive result、live memory/checkpoint。 |
| policy/memory/workspace seed | static template/placement ref 或 safe gap。 | seed/template正文、memory live state、workspace current files、checkpoint、conversation、secret或任何 runtime mutable state。 |
| build/provenance/qualification | local operation/seam disposition、safe ref/gap、error class。 | provider request/response、build log、real digest、signature/BOM/scan/evidence body、gate inventory/pass、Artifact accepted conclusion。 |
| Member Service supply | local entry/gap disposition和 safe local ref。 | manifest/ref confirmation、instance/host/container lifecycle、consumer confirmation、launch/health/readiness。 |
| Sandbox / external provider | seam category/blocked/unavailable/unknown。 | sandbox policy/backend truth、endpoint/credential、provider health、execution body。 |

### 8.3 观测信号不能关闭 blocker

| blocker / pending | 本 Step 后仍然的处理 |
|---|---|
| `DDD-S9-B01/B02` | 只允许记录 stop 的安全 runtime signal；不能借 trace、metric、log correlation或 config assembly 开启 canonicalization、reservation、UoW、result/replay或 commit。 |
| `DDD-S11-B03` | 不能将 availability history trace/log 作为 terminal/supersede persistence；仍禁止 delete/reinsert/overwrite。 |
| `DDD-S13-OPEN-01/02` | 不能把 span、metric、log correlation 变成 in-flight observation、lease、TTL、cleanup、namespace 或 idempotency identity。 |
| `PF-UNAVAILABLE-RECOVERY` | Query/metric 只能展示 existing `Unavailable`；不能以告警、log、retry metric或 composition signal制造 `Unavailable -> Rebuilding/Fresh`。 |
| `MI-UP-001~009` / `Q-MI-001~004` | safe signals只能暴露 local blocked/gap/unavailable/unknown；不可形成 digest、positive result、external health、Artifact/consumer closure、event acceptance、outbound delivery或 readiness。 |

## 9. Step 6~14 跨文档闭环审计

| 前序 Step | 本 Step 承接 | 审计结论 | 不得改变的边界 |
|---|---|---|---|
| Step 6：对象 | `ImageTraceRecord`、`ImageRuntimeAssemblyState`、slot marker 的 fixed meaning 已收稳。 | `pass`。不新增 telemetry/audit object、state variant、trace field或 composition truth。 | trace非第二 truth；Assembled/Available非 readiness。 |
| Step 7：port/adapter | `append_trace`、UoW、repository、adapter、安全 error 皆有归属。 | `pass`。不新增 exporter/logger backend/outbox/publisher/audit port。 | trace 只 append、同 UoW；adapter仍只给 safe result。 |
| Step 8：协议 | 10 Command/10 Query/2 conditional inbound/6 Job/0 outbound inventory 固定。 | `pass`。埋点不加入 DTO、route、topic、receipt、event ID、run/report字段。 | `NoneAuthorized` 严格为零；inbound仍无 payload。 |
| Step 9：function flow | current B01/B02、Query no-write、marker-only inbound、future trace位置已明确。 | `pass_with_blockers`。日志/metric/span 不触发 repository/adapter/repair；local trace只复用 future flow cut。 | 当前 Command/Job零 trace，Query/conditional inbound永久零 trace。 |
| Step 10：状态矩阵 | local lifecycle、projection freshness、composition lifecycle和外部 positive state已分开。 | `pass`。观测不触发 transition，也不把 status统合为 global ready。 | 不构造 Passed/Eligible/Accepted/Resolved/Fresh/recovery或 consumer success。 |
| Step 11：持久化/一致性 | trace append-only、same UoW、committed visibility、outbound absence已收稳。 | `pass_with_blockers`。没有独立 audit store，也不从 log/metric反推 commit。 | trace不 update/delete；query不看 staged record；无 outbox。 |
| Step 12：错误/恢复 | `ImageApplicationError`、safe reason、no raw body、unknown/manual语义已收稳。 | `pass_with_blockers`。错误日志只用分类/ref；failed/rejected不伪装 accepted audit。 | 不暴露底层错误，不新建 retry/repair路径。 |
| Step 13：并发/幂等 | identity、duplicate、commit unknown与 in-flight gap已收稳。 | `pass_with_open_items`。观测字段不进入 canonical input、reservation lookup或 replay body。 | duplicate无新 trace；没有 lease/TTL/run/report。 |
| Step 14：config/依赖 | raw config隔离、slot/composition、dependency category与 fake mode已收稳。 | `pass_with_blockers`。没有观测 backend/endpoint/credential config，也不将 slot metric解释为 external health。 | config不解除任何 blocker，不启动 process/worker/container。 |

### 9.1 横切反例审计

| 反例 | 结果 | 必须处置 |
|---|---|---|
| 为 Query 追加 “read audit” 或 freshness marker | `fail` | 停止实现；重回 Step 7/9/11，维持 strict no-write。 |
| 为 B01/B02 Command/Job 追加 `ImageTraceRecord` 来记录 blocker | `fail` | 删除写入；只允许安全 log/metric/span，保留零 UoW/zero trace。 |
| 把 marker-only inbound log 绑定 event envelope/receipt/dedup | `fail` | 停止；`MI-UP-005` 前只能记录 marker disposition与 `accepted_input=false`。 |
| 用 trace record 作为 outbox/delivery/audit export | `fail` | 停止；outbound inventory 为零，需多 Step/owner 重开。 |
| 在 metric label 中放 ref/ID/digest/tag/endpoint | `fail` | 删除高基数字段，改用有限 kind/state；单记录仅用 safe log/trace ref定位。 |
| 把 `Assembled` 或 `Available` 的日志/metric标为 ready/healthy/success | `fail` | 改回 local composition wording；重审 Step 6/10/14。 |
| 把 raw config/payload/live state/provider response 写入任何 signal | `fail` | 隔离输出；记录仅 `ContractViolation` + redacted diagnostic ref，重审相关 boundary。 |
| 新增 backend、告警、SLO、dashboard、endpoint、credential、采样或保留期 | out of scope | 取消本 Step 变更，留未来配置/运维/部署文档。 |

## 10. 正式 `03-详细设计.md` 回填草稿（禁止当前装配）

> 对应正式章节：第 14 章“可观测性与审计埋点契约”。  
> 写入前门禁：项目台账必须允许正式 03 装配，03 flow 必须完成至 Step 19，且后续 Step 回填均已批准。当前条件均不满足。

```md
## 14. 可观测性与审计埋点契约

> 校准来源：
> - `design-calibration/03_ddd_step_15_observability_audit.md`
> - `design-calibration/03_ddd_step_14_config_dependencies.md`
> - `design-calibration/03_ddd_step_13_concurrency_idempotency.md`
> - `design-calibration/03_ddd_step_12_error_recovery.md`
>
> 本章只定义 planned code instrumentation cut。backend、告警、SLO、dashboard、采样、retention、endpoint、credential 与 runbook 留给后续配置/运维/部署文档。

本仓区分四类不可互替代的信号：structured log、低基数 metric、runtime span 与 append-only local `ImageTraceRecord`。前 3 类不持有业务状态；`ImageTraceRecord` 仅解释 local subject 与 body-free source refs，不是 span、log、outbound event、receipt、report/evidence 或 external observability truth。`ImageRuntimeAssemblyState::Assembled` 和 slot `Available` 只表示 local composition validation，绝不表示 build/gate/Artifact/consumer/runtime readiness。

当前 10 个 Command 与 6 个 Job 都在 `DDD-S9-B01/B02` 前 fail-closed：可产生安全 runtime diagnostic signal，但必须零 UoW、零 reservation、零 trace/history/gap/freshness/result/commit。10 个 Query 严格只读；两个条件入站只返回 marker disposition 且 `accepted_input=false`；`ImageOutboundEventInventory` 固定为 `NoneAuthorized`。

### 14.1 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| config/slot/local assembly validation | `debug`/`info`/`warn`/`error` 依 local result | operation、config ref optional、slot/seam kind、local assembly state、safe reason category、redacted diagnostic ref、duration | 诊断本地 composition；不记录 raw config/secret/endpoint，不表示 readiness。 |
| Command/Job validation 或 B01/B02 stop | `warn` | entry/operation kind、safe correlation ref optional、disposition、blocker/error kind、duration | 说明 fail-closed；不写 local trace/history/result/replay。 |
| Query completion/degraded surface | `debug`/`info`/`warn` | query kind、surface/content/visibility state、safe ref optional、safe reason、duration | 诊断只读结果；不做 repair/trace/marker写入。 |
| conditional inbound marker disposition | `info`/`warn` | consumer name、marker disposition、`accepted_input=false`、safe reason、duration | 说明不是 active event consumer；无 envelope/payload/receipt/dedup。 |
| future/reopen repository/UoW/adapter/trace-append failure | `warn`/`error` | operation/seam/repository group、safe subject/source ref optional、error kind、redacted diagnostic ref、duration | 定位安全错误；不记录 SQL/SDK/HTTP/provider body。 |

structured log 与 span 只允许 safe ref、operation/disposition/state/error kind、redacted diagnostic ref、duration 和受限计数。raw request/payload/configuration、idempotency key、digest/tag、Role/mapping/component/seed body、live memory/workspace、manifest/build log/evidence、Artifact/consumer body、provider run/response、secret/credential/endpoint/topic/SQL/stack trace 均禁止。

### 14.2 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `member_images_config_validation_total` | counter | config validation return 后 | `result`, `failure_class_optional` |
| `member_images_runtime_composition_validation_total` | counter | local assembly validation return 后 | `assembly_lifecycle`, `fake_mode` |
| `member_images_adapter_slot_assessment_total` | counter | slot assessment return 后 | `slot_kind`, `seam_kind`, `local_availability` |
| `member_images_command_boundary_total` / `member_images_command_boundary_duration` | counter / histogram | Command handler return / outer span close | `command_kind`, `disposition`, `error_kind_optional` |
| `member_images_query_total` / `member_images_query_duration` | counter / histogram | Query handler return / outer span close | `query_kind`, `surface_status`, `content_state`, `visibility_state` |
| `member_images_conditional_inbound_boundary_total` | counter | marker boundary return 前 | `consumer_name`, `marker_disposition`, `accepted_input_class=always_false` |
| `member_images_job_boundary_total` / `member_images_job_boundary_duration` | counter / histogram | Job boundary return / outer span close | `job_kind`, `disposition`, `action_availability` |
| `member_images_local_trace_append_total` | counter | future/reopen `append_trace` return 后 | `subject_kind`, `append_result` |
| `member_images_local_store_operation_total` / `member_images_reference_or_adapter_assessment_total` | counter | future/reopen safe port result 后 | finite repository/uow/seam/outcome categories |

metric labels只能为有限 kind/state/result/error category；所有 actor/subject/request/trace/result/object ID、key、cursor、watermark、source ref、payload、digest/tag、endpoint、secret、free text 与 provider run ID 都禁止。不存在 outbox/publisher/delivery/build-success/gate-pass/Artifact-accepted/consumer-confirmed/container-health/readiness 指标。

### 14.3 审计事件表

| 审计事件 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| `LocalSubjectTraceAppend` | future/reopen flow 已合法 stage local subject/gap/freshness effect，且该 flow明确要求 trace 时 | existing `ImageTraceRecordRef`、subject ref、body-free source refs、correlation/causation ref、`SafeReason`、recorded time | future local `GetImageTrace` read only；无 external consumer/event/export。 |
| `ReferenceMaintenanceTraceAppend` | future/reopen reference/projection maintenance flow 已满足 own guard/UoW且要求 trace 时 | 同上；不得有 external body | future local trace query only。 |
| `AvailabilityLocalTraceAppend` | future/reopen合法 availability local action需要解释时 | 同上；只解释 local availability history/entry | future local trace query；不证明 consumer/runtime success。 |

上表是 local audit classification，不是新 public event。`append_trace` 只能由 owning future/reopen flow 经既有 `ReferenceDerivedRepositoryPort` 在同一 `ReadWrite` UoW 追加；trace append failure使要求它的 future UoW fail closed。Query、当前 B01/B02 Command/Job、marker-only inbound、config/slot composition 和 zero outbound 全部不得写 `ImageTraceRecord`。trace record append-only、不更新删除、不反写 truth，也不保存 log/span/report/evidence/payload/live state。
```

## 11. Blocker、Step 16 handoff 与停审门禁

### 11.1 保持开放的 blocker

| ID | 当前影响 | 本 Step 后的处理 | 重开前提 |
|---|---|---|---|
| `DDD-S9-B01` | Command/Job 无合法 canonical input，当前全部零写。 | 只记录安全 boundary stop；不写 trace/gap/result/replay。 | Step 7/8 形成 per-operation canonical carrier/mapper后重开。 |
| `DDD-S9-B02` | result ref/shell/body 与 replay 无法实施。 | 不记录伪 result、trace success 或 replay metric as hit。 | Step 6/7/8 闭合 result factory与一致性后重开。 |
| `DDD-S11-B03` | availability history existing transition 的 terminal/supersede persistence 未闭合。 | 不用 trace/log/metric修复或遮蔽；继续禁止 delete/reinsert/overwrite。 | Step 7/10 定义合法 persistence model。 |
| `DDD-S13-OPEN-01/02` | Reserved/in-flight 与 namespace 仍无统一合同。 | 不建立 lease/TTL/cleanup、in-flight metric truth或跨 channel replay。 | 重开 reservation/store/recovery/identity contract。 |
| `PF-UNAVAILABLE-RECOVERY` | projection `Unavailable` 尚无恢复函数。 | 只观察 existing state；不通过 signal/alert/retry转换状态。 | 定义 recovery function、truth source、version/UoW与测试切口。 |
| `MI-UP-001~009`、`Q-MI-001~004` | 多个 owner/schema/consumer/product/gate 输入未闭合。 | 只记录 local safe blocked/gap/unavailable/unknown；不伪造 digest、pass、accept、confirm、delivery、readiness。 | owner 正式合同停审后，按受影响 Step 重新校准。 |

### 11.2 Step 16 handoff（仅输入，不自动进入）

| future Step 16 应验证的切口 | 本 Step 已固定的可验证契约 | 当前不代表 |
|---|---|---|
| B01/B02 negative parity | 每个 Command/Job 在 stop 前可有 runtime signal，但 spies 必须见到零 UoW/reservation/repository mutation/trace/history/gap/freshness/result/commit。 | 测试已实现、执行、通过或有 run/report/evidence。 |
| Query no-write | 所有 Query 的 log/metric/span 不引起 trace、marker、projection repair、gap、idempotency或 source refresh写入。 | 查询授权或 production observability已可用。 |
| conditional inbound marker-only | `accepted_input=false` 且无 envelope/payload/receipt/dedup/UoW/trace write。 | event consumer、broker或 receipt contract已闭合。 |
| trace atomicity | future/reopen required trace 必须与合法 local effect位于同一 UoW；append failure不可产生伪 committed success。 | B01/B02 已解除或 trace path当前可达。 |
| redaction/cardinality | log/span不带 forbidden fields；metric无 high-cardinality/sensitive label；composition语义不升级 readiness。 | logger/backend/dashboard/alert policy 已被选择。 |
| outbound absence | static/protocol checks 保持 `NoneAuthorized`，无 outbox/publisher/delivery/export instrumentation。 | 本仓将来永远没有 outbound；仅表示当前没有 authority。 |

### 11.3 完成检查与停审记录

- [x] 已按 Step 15 的 SOP/书写规范形成日志埋点表、指标埋点表和审计事件表。
- [x] 已明确 structured log、metric、runtime span 与 `ImageTraceRecord` 的不同 owner、字段和持久化语义。
- [x] 已把 Command/Job B01/B02 的零 trace、Query no-write、marker-only inbound、zero outbound、local composition non-readiness 写为强制规则。
- [x] 已规定 low-cardinality metric 与 log/span/trace 的 redaction/forbidden-field boundary。
- [x] 已把 `append_trace` 限定为 existing port、owning future/reopen flow、same UoW、append-only、body-free local audit cut。
- [x] 已复核 Step 6~14；未新增对象、port、DTO、状态、store、outbox、publisher、backend、告警、产品、外部 positive contract或运行事实。
- [x] 已保留 `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY`、`MI-UP-001~009` 与 `Q-MI-001~004`。
- [x] 未读取旧正式 03，未装配正式 03，未创建 Step 16/04，未实现代码、运行测试、生成 run/report/digest/evidence/verdict/signoff/readiness 或提交 commit。

| 项目 | 记录 |
|---|---|
| Step 15 状态 | `completed_stop_review` |
| gate_status | `pass_with_explicit_blockers` |
| 已形成材料 | signal model、日志/指标/span cut、local trace/audit table、redaction、static/live/external boundary、跨 Step 审计、正式回填草稿、blocker ledger 与 Step 16 handoff。 |
| 正式文档状态 | `03-详细设计.md` 仍禁止写入；旧正式 03 仍未读取。 |
| 下一步 | 必须等待用户明确确认后，才可创建并进入 `03_ddd_step_16_test_seams.md`。 |
| 提交 | 当前无需提交；未经用户明确要求不得提交。 |

```text
Step 15 = completed_stop_review
gate_status = pass_with_explicit_blockers
next_allowed_action = wait_for_explicit_user_confirmation_for_step_16
formal_03_write_allowed = false_until_step_19
implementation_allowed = false
commit_required = false
```
