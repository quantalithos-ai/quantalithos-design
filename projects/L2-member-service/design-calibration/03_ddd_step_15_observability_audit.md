# Step 15：可观测性与审计埋点契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 15
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_15_observability_audit.md`
> 目标正式文档：`projects/L2-member-service/03-详细设计.md`
> 校准日期：2026-09-02

## 1. Step 状态、目标与边界

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 15 可观测性与审计埋点契约 |
| 当前状态 | completed / pass_with_upstream_blockers |
| 输入 | Step 6~14 的对象、Port、协议、flow、状态、事务、错误、并发和配置绑定 |
| 输出 | 本仓代码必须暴露的 log / metric / trace / audit 切口、字段和脱敏规则 |
| 正式正文 | 仍禁止写入，正式 `03` 只在 Step 19 装配 |
| 本步不锁定 | 日志/指标/trace 后端、采样率、保留期、SLO、告警阈值、pager、DLQ 产品、部署 endpoint |

本步只描述“代码在何处产生什么安全观测记录”。观测记录不是新的 Host Truth，不拥有 Runtime、Member、Images、Sandbox、L1、Bus 或 Observability backend truth。`HostHistoryEntry`、`HostFactMaterial`、`HostHandoffRecord`、`HostOutboxRecord` 和 `HostProjectionState` 仍按 Step 6/11 的 owner 与一致性规则处理；日志和指标不能替代这些业务记录。

## 2. Step 开工确认

| 项目 | 记录 |
|---|---|
| 已读取通用规范 | yes：设计文档编写通则、中间产物规范、设计真相源闭环与可落码性标准 |
| 已读取文档类型规范 | yes：详细设计讨论流程 SOP、详细设计书写规范 |
| 已读取前序输入 | yes：项目台账、03 flow、Step 6~14、02 概要设计、L1-governance Step 15 粒度参考 |
| 当前模式 | full-restart / serial continuation |
| 模块骨架 | done：入口、应用、领域/历史、持久化、外部 seam、worker、jobs、config 均列出观测切口 |
| 项目级门禁 | pass：用户已授权完成全部 03；Step 14 已完成 |
| 文档级门禁 | pass：允许进入 Step 15；正式 03 仍锁定到 Step 19 |

## 3. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 哪些处理流必须形成业务审计？ | 只有 accepted local truth transition、accepted local marker/feedback、outbox/publication marker、projection/reconciliation/handoff marker 和 job report 需要通过既有业务记录形成可追溯审计；纯 Query、validation reject、duplicate replay 不新增 accepted history/outbox。 |
| 哪些处理流至少要写 runtime log？ | 所有入口校验、domain reject、not-visible、version/unique conflict、idempotency duplicate/conflict/in-flight/result-missing、resolver unavailable、unsupported version、late/gap、publisher/handoff failure、projection failure、UoW commit unknown/rollback failure、配置拒绝和 adapter unavailable。 |
| 哪些处理流需要指标？ | Command、Query、Consumer、Outbox publisher、Operations Job、UoW/repository、resolver、projection、handoff、reconciliation、config validation 和 adapter availability 都需要 counter、duration histogram 或 state gauge；标签必须低基数。 |
| trace 如何跨同步和异步边界？ | `correlation_id` 与 `trace_context` 从已验证的 Command/Query/Event/Job metadata 继承；consumer、outbox、handoff、job 只能链接原 trace，不得每次重试生成新业务 correlation。具体 trace backend 由外部运维承接。 |
| 日志、指标、审计各记录什么？ | 日志记录定位所需的安全上下文和诊断引用；指标记录低基数分类与耗时；审计记录 committed local change、状态替代链、marker/report/result 引用及 actor/scope/correlation。 |
| 观测记录是否可以作为完成证明？ | 不可以。日志、metric、trace、receipt、adapter `Ok`、publication `submitted` 都不能推导 Runtime/Member/Sandbox/Images/Bus 的 delivered、observed、accepted、healthy、ready 或 external completion。 |
| 哪些字段永远不能出现？ | raw request/payload/response、Member/Runtime/Images/Sandbox 正文、镜像 manifest/digest 内容、credential/secret、endpoint、token、stack trace、SQL、broker body、ToolInvocation、LLM/goal/plan/memory/checkpoint、外部报告正文。 |

## 4. 当前材料问题诊断

| 材料位置 | 诊断 | 本步修正 |
|---|---|---|
| Step 6 的 history/material/outbox/marker | 已定义业务载体，但未明确日志/指标与业务审计的区别 | 固定 accepted local change 的审计链，禁止用 runtime log 代替 history/outbox |
| Step 7 的 repository / adapter Port | 已定义错误和 safe result，但打点位置、字段和失败分层不够明确 | 为 repository、UoW、resolver、publisher、handoff、clock/id、config builder 指定日志与 metric 切口 |
| Step 8 的协议 | metadata、receipt、job report 已有结构，但入口和 duplicate/unsupported 观测未收口 | 按 Command/Query/Consumer/Job 逐类固定入口、结果和 replay 埋点 |
| Step 9 的处理流 | accepted / rejected / unknown 顺序已闭合，观测字段没有逐分支绑定 | 将每条流的 accepted、reject、duplicate、delayed、unknown、failed 映射到安全事件 |
| Step 12~14 | 错误、幂等和配置已有语义，但容易把 timeout/availability 写成正向事实 | 加入 commit-unknown、same-key replay、blocked adapter、config reject 的专门观测规则 |
| 旧正式 03 | 混有 runtime callback、执行 body 和后端状态，可能导致诊断日志越界 | 旧 03 仅作污染输入；本步只保留 body-free ref/summary/diagnostic |

## 5. 设计取舍

| 议题 | 采用方案 | 未采用方案与原因 |
|---|---|---|
| 业务审计载体 | 复用 `HostHistoryEntry`、`HostFactMaterial`、`HostHandoffRecord`、`HostOutboxRecord`、projection/reconciliation/job marker 的引用链 | 另建 Observability ledger；会把 backend/观测 truth 错收为本仓 owner |
| accepted transition 记录 | local UoW 中 truth + history/material/outbox/stale marker/result 一起提交，并额外写安全 runtime log/metric | 只写日志；日志不可证明可回放的业务事实，也无法替代 append-only history |
| Query 观测 | 只写 log/metric，记录 visible/not-visible/degraded/stale/unavailable | 每次 Query 写 audit/refresh；会违反 Query no-write 并制造隐式修复 |
| duplicate replay 观测 | 写 replay log 和低基数 idempotency metric，不新增业务 history/outbox | 重跑 domain 或写第二份 trace；会违反 Step 13 的 exactly-once mutation 口径 |
| 指标标签 | `operation_kind`、`result_kind`、`error_kind`、`event_kind`、`job_kind`、`adapter_kind`、`freshness_state` 等低基数值 | 使用 host/member/request/idempotency raw value 作 label；会造成高基数和敏感泄露 |
| 外部错误 | 保存 stable error kind、safe diagnostic ref、retryability 和 availability | 保存 adapter exception/body/stack trace；外部正文不属于本仓 |
| trace carrier | 传递 metadata 中已有 trace/correlation，异步边界用 link/ref | 在每次 retry 或 adapter call 重新生成业务 trace；会破坏因果链和幂等审计 |

## 6. 观测分层与总原则

```text
validated entry metadata
        |
        v
structured runtime log + low-cardinality metric
        |
        +--> accepted local UoW --> HostHistoryEntry / Material / Outbox / Marker
        |
        +--> rejected / duplicate / unknown --> diagnostic log + disposition metric
        |
        +--> external handoff --> target-specific marker and feedback layer
```

关键说明：
- 图表达观测记录与业务记录的分层关系，不表达具体 backend、transport 或部署拓扑。
- accepted audit 必须指向已提交的 local truth 或 marker；日志本身不构成 commit proof。
- `submitted`、`delivered`、`observed`、`accepted` 四层反馈由 owner-specific marker 表达，观测事件不能跨层推导。

### 6.1 安全公共上下文

所有日志、指标、trace link 和审计引用必须从下列安全上下文中选择字段：

| 字段 | 来源 | 允许值 | 禁止值 |
|---|---|---|---|
| `trace_context_ref` | command/query/event/job metadata | stable trace reference 或 redacted correlation | raw trace header、token、完整 carrier |
| `correlation_id` | validated metadata 或继承 context | typed correlation ref | 每次重试新建业务 id |
| `operation_kind` | protocol / job kind | 固定 enum 名称 | 任意用户正文 |
| `actor_ref` | validated actor context | opaque actor ref / class | actor secret、credential、未经验证的 scheduler label |
| `project_member_ref` | validated ProjectMember scope | typed ref 或 hash/fingerprint | member profile/body |
| `host_ref` / `generation` | local Host record | typed ref、generation number | backend/container id 直接替代 host ref |
| `source_ref` / `target_ref` | safe external ref | opaque typed ref | endpoint、payload、manifest |
| `status/disposition` | formal enum | accepted/rejected/blocked/duplicate/unknown 等 | 自由文本推导 ready/healthy |
| `diagnostic_ref` | redacted diagnostic store/marker | stable safe ref | raw exception、stack、请求正文 |

`project_member_ref`、`host_ref` 和其他 typed ref 是否直接出现在具体后端日志由脱敏配置决定；不得因配置关闭 mandatory redaction baseline。高基数定位优先通过 safe ref 或 trace 关联，不进入 metric label。

## 7. 结构化日志切口

### 7.1 入口与应用层

| 位置 | 级别 | 必须记录 | 不得记录 |
|---|---|---|---|
| API Command entry | info | trace/correlation ref、request ref、command kind、actor class、idempotency fingerprint | raw key、request body |
| Command metadata/body validation reject | warn | command kind、error kind、validation issue ref、diagnostic ref | invalid body、secret、endpoint |
| Query entry/completion | debug/info | query kind、actor class、surface kind、result status、duration | domain object body、visibility reason body |
| Query not-visible | info | query kind、scope ref、visibility marker ref | 是否存在的额外猜测、domain truth |
| Application idempotency reserve | debug | operation kind、key fingerprint、reservation state | raw idempotency key、digest body |
| Duplicate replay | info | operation kind、key fingerprint、stored result ref/receipt ref/report ref | 第二次 domain transition |
| Idempotency conflict/in-flight/result missing | warn | reservation state、conflict/diagnostic ref、disposition | stored result payload、raw digest |
| Accepted local command | info | actor/scope/host ref、truth change ref、history/material/outbox/result ref、duration | external completion、raw DTO |
| Domain reject / blocked | warn | domain error kind、reason ref、blocker id、scope ref | adapter body、假定 ready |

### 7.2 存储、事务与维护层

| 位置 | 级别 | 必须记录 | 语义上限 |
|---|---|---|---|
| UoW begin/commit | debug/info | operation ref、uow phase、record counts、duration | 不证明外部提交 |
| UoW commit unknown | error | operation ref、uow phase、diagnostic ref、reconciliation marker ref（如已产生） | 不重放 mutation、不换 idempotency key |
| UoW rollback failure | error | operation ref、diagnostic ref、manual-recovery marker ref | 不返回 accepted |
| repository version/unique conflict | warn | repository kind、subject ref、expected revision marker、error kind | 不自动 merge |
| history/material/outbox append | debug/info | record ref、source change ref、payload snapshot ref、correlation | 不写 payload body |
| projection stale/rebuild | info/warn | view kind、scope ref、source cursor ref、freshness state、report ref | 不反写 source truth |
| reconciliation report | info/warn | job run ref、scope ref、report ref、finding count | 不保存外部正文 |

### 7.3 外部 seam、worker 与 jobs

| 位置 | 级别 | 必须记录 | 语义上限 |
|---|---|---|---|
| resolver success | debug | resolver kind、source ref、safe snapshot ref、freshness、duration | 不等于 qualification ready |
| resolver unavailable/rejected | warn | adapter kind、source ref、error kind、retryability、diagnostic ref | 不保存 external body |
| consumer envelope reject | warn | consumer kind、message ref、schema version、validation issue ref | 不解析或落 snapshot |
| consumer unsupported/late/gap | warn | consumer kind、source/event ref、version/sequence marker、disposition | 不推导 healthy/accepted |
| consumer accepted | info | consumer kind、source ref、affected local marker refs、receipt ref | 只表示本地接收 |
| action/cleanup feedback | info/warn | attempt/cleanup ref、generation、effect fingerprint、outcome class | 不创建新 effect key |
| outbox scan/publish | info/warn/error | job run ref、outbox ref、publication key fingerprint、submission state、report ref | `submitted` 不等于 delivered |
| handoff feedback | info/warn | handoff ref、target class、feedback layer、gap/failure ref | 不保存 package/document body |
| job summary | info | job kind、run ref、disposition、item/changed/failed counts、report ref | 不产生 authorization |
| adapter availability change | info/warn | adapter slot/kind、availability state、checked-at marker、failure ref | 不把 availability 变成 lifecycle state |

`effect key`、`publication key`、`handoff key` 和 dedup key 只能记录不可逆 fingerprint；原值继续只存在于允许的 local store 或 secure owner，不进入日志/metric。

## 8. 指标契约

指标只提供低基数聚合，具体 metric backend、命名空间和保留期由配置/运维文档承接。每个计时指标必须以 `duration` 语义记录，不得把 timeout 当成功。

| 指标族 | 类型 | 允许标签 | 触发点 | 失败/降级解释 |
|---|---|---|---|---|
| command_total | counter | command_kind、result_kind、error_kind | 每次 Command 结束 | rejected/blocked/duplicate 单独计数 |
| command_duration | histogram | command_kind、result_kind | Command handler 完成 | commit unknown 仍按 unknown 结果记录 |
| query_total | counter | query_kind、result_kind、freshness_state | Query 完成 | 不触发写操作 |
| consumer_total | counter | consumer_kind、disposition、version_class | Consumer receipt 形成 | duplicate/late/unsupported 保持独立 |
| job_total | counter | job_kind、disposition | Job report 形成 | item failure 不等于 scheduler failure |
| uow_total | counter | operation_kind、uow_result | begin/commit/rollback | unknown 与 failed 分开 |
| idempotency_total | counter | operation_kind、reservation_state | reserve/replay/conflict | 同 key 冲突不重跑 |
| repository_total | counter | repository_kind、operation_kind、error_kind | repository call | version/unique/unavailable 分类 |
| resolver_total | counter | resolver_kind、resolution_state、availability_state | source resolve | safe summary only |
| projection_total | counter | view_kind、freshness_state、rebuild_result | stale/rebuild | degraded/unavailable 不修 source |
| outbox_total | counter | event_kind、publication_state、error_kind | append/submit/fail | submitted/delivered 不能合并 |
| handoff_total | counter | target_class、feedback_layer、disposition | prepare/feedback | gap/unknown 保留原 key |
| reconciliation_total | counter | job_kind、finding_kind、case_disposition | finding/case report | 不代表外部修复 |
| config_validation_total | counter | config_section、validation_result、adapter_kind | load/validate | raw secret 不进入 label |
| adapter_availability | gauge | adapter_kind、availability_state | availability snapshot | gauge 不是 Host lifecycle |

禁止使用 `host_ref`、`project_member_ref`、`actor_ref`、request id、message id、idempotency key、effect key、URL、topic、image digest、error text 作为 metric label。若确需单对象诊断，使用日志和 typed diagnostic ref。

## 9. 业务审计与 trace 绑定

### 9.1 accepted local truth change

以下写集在 Step 11 规定的同一 local UoW 中完成，并通过日志/指标引用它们；日志不替代写集：

| 触发 | 必须关联 | 不得关联 |
|---|---|---|
| accepted intent/decision | Host truth ref、HostHistoryEntry、HostFactMaterial/Outbox（适用时）、stored result、actor、correlation | external action completion |
| accepted qualification/assembly/readiness | qualification/assembly/readiness refs、basis/gap/freshness、history/material（适用时） | image manifest、credential body、Sandbox policy |
| accepted host/generation/attempt/association | host/generation、attempt/effect fingerprint、association/safe outcome、history | container/process truth |
| accepted registration/session shell | registration/endpoint/session refs、generation、safe source/causality | Member body、Runtime run/checkpoint |
| accepted health/recovery | signal/assessment/failure/recovery refs、basis、generation | Observability observed truth、业务结果 |
| accepted closure/cleanup/reconciliation | closure/cleanup/finding/case refs、causality、same-key marker | external deletion/cleanup proof |
| accepted material/handoff/outbox/projection marker | material/handoff/outbox/projection/history refs、source cursor/marker cursor、target class | package body、Bus receipt body |

### 9.2 不产生 accepted audit 的分支

| 分支 | 允许记录 | 禁止记录 |
|---|---|---|
| validation/domain reject | warn log、error metric、safe rejected stored result（若协议要求） | accepted history、accepted outbox、ready/healthy |
| not-visible | visibility marker、log、metric | domain object body、存在性推断 |
| duplicate replay | replay log、idempotency metric、原 stored result ref | 第二次 mutation、第二条 accepted history |
| unsupported version | unsupported marker、log、counter | payload snapshot、accepted consumer marker |
| late/gap/unknown | gap/unknown marker、log、metric、reconciliation ref | 自动换 key、伪造 completed |
| publisher/handoff failure | publication/handoff marker、job report、failure ref | 回滚 Host Truth、声明 delivered/accepted |
| projection failure | stale/degraded/unavailable marker、job report | 用 Query 结果反写 source |
| commit unknown/rollback failure | error log、diagnostic/manual-recovery ref、reconciliation marker | 返回 accepted、盲目补偿 |

### 9.3 Trace propagation rules

1. API/worker/job entry 只接受已验证 metadata；`trace_context_ref` 和 `correlation_id` 进入 application operation context。
2. Domain method 不读取 telemetry backend，也不生成独立 trace；它只接收显式 correlation/causality 参数（若对象契约要求）。
3. UoW、repository、adapter、consumer、publisher 和 job 把 operation context 作为调用上下文传递；重试保留原 business correlation 和 stable operation key。
4. 异步下游只能使用 envelope 中的 source/message/correlation ref 建立 trace link；未知或缺失时返回 body-free reject/blocked。
5. `trace_context_ref` 不能作为 HostRevision、HostChangeCursor、CommittedChangeCursor、generation 或 idempotency key 的替代品。

## 10. 脱敏与禁止字段基线

| 禁止类别 | 示例 | 处理规则 |
|---|---|---|
| request / event / job body | 原始 JSON、完整 event payload、scheduler body | 只记录 typed kind、safe ref、digest/fingerprint |
| secret / credential | token、password、private key、credential body | 仅记录 opaque credential ref、validation result 或 diagnostic ref |
| external body | Member report、Runtime outcome、Sandbox response、adapter exception | 只记录 safe outcome class、reason code、availability 和 ref |
| image/supply detail | manifest、layer、digest body、BOM、provenance | 只记录 pinned ref、safe verification marker、gap |
| execution content | ToolInvocation、LLM loop、goal/plan、memory/checkpoint、process stdout | 不进入任何 log/metric/audit/trace |
| transport/backend detail | URL、topic、queue body、SQL、stack trace | 由 adapter/运维日志单独保护；本仓只留 redacted diagnostic ref |
| high-cardinality identity | raw request id、message id、effect key、actor id | 使用 typed ref 或 one-way fingerprint，不能作为 metric label |

脱敏 baseline 不可被 feature flag、profile、debug 模式或 adapter availability 关闭。发现 forbidden field 时，当前操作按 Step 12 的 `Rejected`/`Blocked`/`ConsistencyDefect` 处理，并记录安全诊断引用；不得为了诊断放行正文。

## 11. 跨 Step 闭环审计

| 审计项 | 结果 | 证据 / 当前上限 |
|---|---|---|
| Step 6 对象与 history/material/outbox/marker owner | pass | 本步只引用既有 owner，不新增 Observability truth object |
| Step 7 Port / adapter 打点位置 | pass_with_upstream_blockers | repository、UoW、resolver、publisher、handoff、config seam 均有切口；后端产品仍 pending |
| Step 8 metadata、receipt、job report | pass | 日志/metric 使用安全字段；receipt/report 不被解释为外部完成 |
| Step 9 accepted/rejected/duplicate/unknown 分支 | pass | 每类分支都有安全观测与禁止副作用 |
| Step 10 状态闭环 | pass | 观测不新增状态，不以 log/metric 推导 ready/healthy/current |
| Step 11 UoW/cursor/outbox/projection | pass_with_upstream_blockers | commit unknown、cursor separation、immutable payload 观测已绑定；cursor exact type仍 pending |
| Step 12 错误恢复 | pass | retryable/blocked/hold/manual recovery 具有诊断 ref 和 disposition 口径 |
| Step 13 并发幂等 | pass | duplicate replay、same-key unknown、conflict 和 in-flight 均不重复 mutation |
| Step 14 配置依赖 | pass_with_upstream_blockers | config validation、adapter availability、feature disabled 有安全观测；backend/SLO/retention留给下游 |
| `MSVC-UP-001~008` | pending / blocked / fail-closed | 不以 log、metric、receipt 或 adapter `Ok` 关闭上游合同 |

## 12. 复杂度判断与写入批次

本 Step 需要按“入口日志 -> 指标族 -> 业务审计 -> trace/脱敏 -> 闭环审计”五个批次组织，不能压缩成单一 observability 表。观测后端、SLO、保留期和告警属于下游运维/配置文档，不在本仓新增章节或对象。

## 13. 正式文档回填草稿

正式 `03-详细设计.md` §14 只装配以下收口结论：

1. Command/Query/Consumer/Publisher/Job/UoW/adapter/config 的安全日志切口。
2. 低基数指标族和禁止高基数/敏感标签规则。
3. accepted local truth 使用既有 history/material/outbox/marker 的审计链，Query/reject/duplicate/unknown 不新增 accepted audit。
4. trace/correlation 继承、重试保留原 key、四层 feedback 不互推。
5. raw body、secret、external response、execution content、transport/backend detail 的永久禁止清单。
6. backend、SLO、采样、保留、告警和 DLQ 产品继续由下游文档承接。

正式正文不得写入本文件的过程诊断、未确认后端、具体日志产品或测试结果。

## 14. 待确认事项与 blocker

| 事项 | 当前状态 | 未确认前处理 |
|---|---|---|
| 观测 backend / sink | pending | 使用 adapter-neutral sink seam，不写产品名或 endpoint |
| metric 命名空间、采样率、保留期 | pending | 只固定 metric 语义和低基数标签 |
| DLQ / diagnostic store | pending | 只记录 safe diagnostic ref / dead-letter marker，不伪造持久化产品 |
| Core/Bus trace envelope | `MSVC-UP-007` pending | 只继承 typed metadata/correlation；缺失则 body-free reject/blocked |
| Runtime/Member/Sandbox feedback | `MSVC-UP-001/002/004` pending | 只记录 host-side marker、safe outcome 和 gap，不声明 external completion |
| redaction scanner 最终规则 | pending | 保留 forbidden-field baseline；具体脚本由 05/实施阶段定义 |

## 15. Step 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 模块/入口覆盖完整 | pass |
| 日志字段安全且可定位 | pass_with_upstream_blockers |
| 指标低基数且不泄露敏感值 | pass |
| accepted audit 与 runtime log 分层 | pass |
| trace/correlation/idempotency 不相互替代 | pass |
| Query no-write、Job no-authorization、四层 feedback 分离 | pass |
| forbidden body / secret / backend truth 排除 | pass |
| 上游 blocker 保真 | pass_with_upstream_blockers |
| 正式 `03` 写入 | forbidden until Step 19 |

```text
step_15_status = completed
step_15_gate = pass_with_upstream_blockers
next_allowed_step = Step 16 test_cut
formal_03_write_allowed = false_until_step_19
```
