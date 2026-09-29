# L4-archive 03 Step 15：可观测性与审计埋点契约

> 执行日期：2026-09-12。对应 `详细设计讨论流程_SOP.md` Step 15、`详细设计书写规范.md` §5.14；正式回填位置为 `03-详细设计.md` §14。
> 状态：`completed / pass_with_observability_boundary_and_upstream_blockers / continue_authorized`。本文件定义实现切口，不代表 telemetry backend、audit export、告警、证据或验收已存在。

## 1. Step 状态、输入与边界

| 项 | 结论 |
|---|---|
| 用户授权 | 连续完成全部 03；本步完成后按顺序进入 Step 16 |
| 直接输入 | 正式 00/01/02，Step 06～14，SOP Step 15，书写规范 §5.14 |
| 专项上游 | `L4-observability` 当前正式 00～03 的审计材料、redaction、no-write 与 backend owner 边界 |
| 粒度参考 | `L1-governance` Step 15 的 low-cardinality / native history 方式；`L1-workspace` Step 15 的字段白名单与 sink failure 方式；不复制领域对象 |
| 本步输出 | 信号分层、字段白名单、日志/指标/span表、native durable audit表、30入口覆盖、redaction/递归/失败规则 |
| 不在本步 | backend产品、采样、bucket、SLO、告警阈值、dashboard、retention days、pager/runbook、真实audit export合同 |
| 完成上限 | 每个实现切口知道记录何种安全技术信号及何种已有本地记录可作审查依据；不构成 evidence/readiness |

旧 README、旧正式 03/05/06 与 draft 中若存在“Archive 自有通用审计链、hash chain、审计数据库或直接推送 observability”的描述，一律是 historical material。`AR-UP-007` 未关闭前，不得声称可向/从 `L4-observability` 完整交付审计材料。

## 2. SOP 问题回答与设计取舍

### 2.1 SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些处理流必须记录审计？ | 所有 accepted Archive-owned mutation 都必须通过 Step 11 已有 native object/history/finding/intent/outcome/result/report 留下可审查落点；Query 不写持久审计。运行日志/指标/span覆盖30个入口，但不是审计真相。 |
| 哪些错误分支必须记录日志？ | 输入/合同阻断、authority/visibility不可证、duplicate/conflict/in-flight、CAS/fence、local/external unknown、sidecar/result损坏、unsupported/integrity failure、adapter/config/build失败、redaction/sink丢弃。只记录有限安全分类。 |
| 哪些关键路径需要指标？ | Command/Query/Consumer/Job入口、UoW、operation reservation、worker claim/fence、source capture、closure/assessment、storage/lifecycle、restore handoff、dependency/build与telemetry suppression。 |
| 各 channel 记录什么？ | log用于有限类别与安全关联；metric只用低基数类别；span表达调用拓扑与耗时；durable audit只复用已提交的本仓原生记录。任何 channel 都不创造owner truth、digest、evidence或success。 |
| 哪些留给运维/04？ | sink/binding、采样、filter、bucket、queue、retention、threshold、alert/dashboard/pager/runbook及部署凭据；不得改变本步redaction、no-write和非权威边界。 |

### 2.2 当前问题诊断与取舍

| 发现 | 风险 | 裁定 |
|---|---|---|
| Archive有大量history/finding/result，但没有通用AuditRecord | 实现者可能临时增加第二套审计ledger | durable审计只复用已有owner记录；若确需新对象/port必须回退Step06/07/11 |
| `L4-observability`是审计材料 owner | Archive可能将telemetry sink或摘要当完整审计链 | 只经未来正式、脱敏、body-free material/ref seam交接；`AR-UP-007`前blocked |
| Query需要可观测但必须no-write | 容易为了read audit开启本地UoW | Query只发out-of-band telemetry，零reservation/result/history/cache/audit write |
| accepted/committed/ACK/receiver success语义不同 | 日志“success”可能制造错误业务事实 | 结果标签使用typed posture；commit unknown只记indeterminate，ACK不记Committed |
| 日志常以业务ID定位 | ref、owner、bundle/location可能泄露存在性或关系 | 默认只记录有限类别；typed ref仅在受控内部log且通过redaction/visibility后可选，metrics永不使用 |
| telemetry sink失败 | 可能触发业务rollback/retry或递归观测 | sink best-effort；不改变业务结果、不重跑；丢弃只用独立安全counter，不回灌Archive |
| outbound candidates尚未获准 | audit事件命名可能被误作可发布协议 | 本步“审计发生”只是native landing描述，不是Outbound Event；无publisher/outbox |

## 3. 信号分层与唯一 owner

```text
Layer A  Runtime telemetry
  structured log + low-cardinality metric + runtime span
  out-of-band / best-effort / no business UoW / no retry authority

Layer B  Archive-owned durable review trail
  request + stage + binding/capture + manifest/closure + assessments
  placement/lifecycle/action + restore plan/item/handoff/outcome/compensation
  operation result + worker checkpoint
  committed through existing Step 11 repositories and UoWs

Layer C  External audit/evidence material boundary
  owner-approved, redacted, body-free material/ref only
  L4-observability remains owner; AR-UP-007 gates positive integration
```

| 规则 | 必须满足 |
|---|---|
| Layer A 不替代 Layer B | log/span OK或metric增加不能补缺history/result/intent；mandatory native record失败时原UoW失败 |
| Layer B 不吞 Layer C truth | `SourceClass::ObservabilityMaterial`只保存获准material/ref及provenance，不复制backend/audit chain |
| Layer C 不反写 Layer B | external sink/consumer ACK不能改变Archive state或证明evidence完整 |
| unknown不升级 | local/external unknown均记indeterminate并走Step12/13正式probe，不记success/failure certainty |
| telemetry不成为授权 | sink availability、dashboard、trace或日志内容不能产生authority/hold/delete/restore许可 |
| Query严格无写 | Query telemetry emitter不得调用本仓Command/Consumer/Job/store write面 |

## 4. 公共字段安全契约

### 4.1 有限字段词表

| 字段 | 合法来源 | 可用 channel | 约束 |
|---|---|---|---|
| `operation_name` | Step 08有限30入口registry | log/metric/span | code constant；E04/J12分支另用有限`target_kind`，不扩入口名 |
| `operation_channel` | Command/Query/InboundEvent/OperationJob | log/metric/span | 与operation key channel一致；Query无key仍可分类 |
| `phase` | entry/validate/reserve/read/mutate/persist/commit/external/probe/finalize/respond | log/metric/span | finite enum；不使用函数/SQL文本 |
| `result_kind` | Step08 disposition/receipt/report与Step10状态 | log/metric/span | accepted/committed仅在对应commit确认后 |
| `error_layer` | contracts/domain/application/infra/api/worker | log/metric/span | 对应Step12六owner，不解析message |
| `error_kind` | Step12 typed有限类别 | log/metric/span | 不输出raw error/provider body/stack |
| `source_class` | 八个`SourceClass` variant | log/metric/span | 只分类；不含owner/version/fence/selector |
| `adapter_slot` | Step14 `ArchiveAdapterSlot` family | log/metric/span | payload-bearing slot在metric只降为family，不放owner ref |
| `target_kind` | placement/lifecycle/restore/compensation等有限类别 | log/metric/span | 不含typed target ref |
| `state_before/after` | Step10对应状态enum | log/span/native record | 仅commit确认后；metrics用有限state但不携resource |
| `duration_ms` | boundary monotonic timer | log/metric/span | 不用于owner freshness/lease/commit判断 |
| `item_count` | bounded local collection | log/metric | 仅在不泄露hidden cardinality时；Query hidden结果不得记录 |
| `trace_id` / safe correlation ref | trusted Core metadata/envelope/job input | restricted log/span/result | 只有宿主安全策略批准才记录；不得重新生成替代历史trace |
| `issue_ref` / `result_ref` / `transaction_ref` | committed body-free local ref | restricted internal log/native trail | current disclosure与redaction允许时；metric禁止 |

### 4.2 默认禁止字段

任何 channel 默认禁止：raw request/event/provider/store body、conversation/work/artifact/audit正文、actor/principal/owner/receiver身份、scope/selector、bundle/material/location ref、source version/fence/watermark、public/private cursor、idempotency/dedup/external effect key、operation或Bundle digest、signature/key/KMS material、endpoint/DSN/topic、credential/token/secret、SQL、HTTP body、panic/debug dump、free-text reason、real run/evidence/verdict/signoff/readiness字段。

受控内部日志如确需一个 body-free local ref定位，必须先经过字段allowlist和访问策略，只能用§4.1列出的restricted字段；不得通过hash绕开禁止项，因为可关联hash仍可能泄露身份。redaction在序列化前执行，失败则丢弃整条signal或使用无关联的suppression计数。

## 5. 日志埋点表

| 位置 | 级别 | 允许字段 | 目的 / 语义 |
|---|---|---|---|
| API/worker入口接收与返回 | debug/info | operation/channel/phase/result/error/duration；可选trusted trace | 一次调用边界；返回不自动证明业务提交 |
| envelope/metadata/shape/limit拒绝 | warn | operation/channel/phase=validate/error_kind | 诊断输入类别；不打印原输入 |
| authority/visibility检查 | debug/warn | operation/phase/adapter family/result/error/duration | 表达Allowed/Denied/Unavailable类别；hidden不带target |
| operation reserve/replay | info/warn | operation/channel/phase=reserve/result/error | 区分Reserved/Replay/Conflict/InFlight；不打印key/digest |
| local read/UoW/commit | debug/info/warn/error | operation/phase/result/error/duration；受控transaction ref | Committed/Aborted/Pending/Unknown严格区分 |
| domain guard/state transition | info/warn | operation/phase=mutate/state before/after或error | 只有commit后记录transition为confirmed；rollback不记after成立 |
| worker claim/fence/checkpoint | debug/info/warn | operation/phase/result/error/target_kind | 排他/fence/恢复类别；无holder/lease token |
| source bind/capture/reconcile | info/warn | operation/source_class/phase/result/error/duration | partial/stale/missing/conflicting/unknown显式；不含source refs |
| manifest/closure/seal | info/warn/error | operation/phase/result/error/item_count（安全时） | incomplete/overfull/invalid/consistency defect不被压平 |
| integrity/compatibility | info/warn | operation/adapter family/result/error/duration | Unknown/Unsupported/IntegrityFailed；不记录digest/signature/schema body |
| storage/lifecycle effect | info/warn/error | operation/target_kind/phase/result/error/duration | intent/dispatched/ack/committed/unknown分离 |
| restore plan/material/handoff | info/warn/error | operation/target_kind/phase/result/error/item_count（安全时） | per-owner posture但不记录owner；不宣称project restored |
| duplicate complete replay | info | operation/channel/result=Replay | 表明未重跑body/effect；不新增transition日志 |
| result/sidecar/correlation损坏 | error | operation/phase/error=ConsistencyDefect；可选safe issue ref | operator可见且fail-closed；不打印损坏内容 |
| runtime config/build/availability | info/warn/error | phase/adapter family/result/error；可选safe issue ref | exact assembly状态；Ready不等产品readiness |
| telemetry redaction/sink丢弃 | warn或独立fallback counter | signal kind/error=suppressed_or_dropped | 不通过同一失败sink递归记录，不影响业务结果 |

日志级别是静态建议，不是运维filter配置。高频成功细节可debug，但关键CommitUnknown/ConsistencyDefect/runtime required-slot失败必须有安全warn/error切口；是否实际采样、路由与保留留后续配置/运维。

## 6. 指标埋点表

| 指标 | 类型 / 单位 | 打点位置 | 标签白名单 |
|---|---|---|---|
| `archive_entry_total` | counter / calls | 30入口返回前 | `operation_name`,`operation_channel`,`result_kind`,`error_kind?` |
| `archive_entry_duration_ms` | histogram / ms | 入口包裹service | `operation_name`,`result_kind` |
| `archive_operation_reservation_total` | counter / attempts | reserve/replay/conflict/in-flight | `operation_channel`,`operation_name`,`result_kind` |
| `archive_uow_total` | counter / phases | begin/commit/probe完成 | `phase`,`result_kind`,`error_kind?` |
| `archive_uow_duration_ms` | histogram / ms | UoW/commit/probe边界 | `phase`,`result_kind` |
| `archive_consistency_defect_total` | counter / occurrences | result/sidecar/correlation/invariant损坏 | `phase`,`error_kind`,`target_kind?` |
| `archive_worker_claim_total` | counter / attempts | acquire/renew/release/fence-check | `phase`,`result_kind`,`target_kind` |
| `archive_source_operation_total` | counter / items | bind/capture/reconcile item完成 | `operation_name`,`source_class`,`result_kind` |
| `archive_manifest_operation_total` | counter / revisions | assemble/seal完成 | `operation_name`,`result_kind` |
| `archive_assessment_total` | counter / assessments | integrity/compatibility settle | `target_kind`,`result_kind` |
| `archive_external_effect_total` | counter / calls | storage/receiver/compensation调用或probe后 | `target_kind`,`phase`,`result_kind` |
| `archive_external_effect_duration_ms` | histogram / ms | exact adapter call前后 | `target_kind`,`phase`,`result_kind` |
| `archive_restore_item_total` | counter / item outcomes | plan/material/handoff/reconcile/compensation | `operation_name`,`result_kind` |
| `archive_dependency_total` | counter / checks/calls | binding inspect/adapter call结束 | `adapter_slot_family`,`result_kind`,`error_kind?` |
| `archive_runtime_assembly_total` | counter / attempts | builder terminal | `result_kind`,`error_kind?` |
| `archive_query_total` | counter / calls | 五Query安全surface形成后 | `operation_name`,`result_kind` |
| `archive_telemetry_suppressed_total` | counter / signals | pre-serialization redaction或sink drop | `signal_kind`,`reason_kind` |

指标标签只能来自有限enum；禁止任何ID/ref/key/digest/version/fence/endpoint/free text。histogram bucket、gauge采集周期和alert阈值没有authority，留后续配置/运维。没有建立“当前Bundle数/owner数/失败owner”等高基数或可能泄露存在性的gauge。计数描述runtime观察次数，不是exactly-once业务计数或验收证据。

## 7. Trace / span 契约

| Span 名 | 起点 / 父级 | 必要属性 | 结束语义 |
|---|---|---|---|
| `archive.entry` | API/worker root或trusted parent child | operation/channel | safe response形成；commit unknown=`indeterminate` |
| `archive.operation.reserve` | entry child | operation/channel/phase | reserved/replay/conflict/in-flight/error |
| `archive.application` | entry child | operation/target kind | application typed result；不等外部commit |
| `archive.store.uow` | application child | phase | committed/aborted/pending/unknown |
| `archive.store.read` | application child | target kind | found/not-available/stale/defect；无hidden ref |
| `archive.authority` | application child | adapter family | allowed/denied/unavailable/blocked |
| `archive.source` | application/job child | source class/phase | mapped owner outcome；不保存snapshot body |
| `archive.integrity` | application/job child | phase | verified/failed/unknown/blocked，禁止digest属性 |
| `archive.storage.effect` | committed intent之后的job child | target kind/phase | mapped dispatch knowledge；unknown不标error certainty |
| `archive.restore.effect` | committed per-owner intent之后的job child | target kind/phase | mapped receiver outcome；不含owner/material |
| `archive.worker.item` | job span child，claim成功后 | operation/target kind/phase | committed item report或accounting error |
| `archive.runtime.assembly` | config load开始 | phase/adapter family | exact assembly Ready/Failed；Ready不等readiness |

incoming trace只在metadata/envelope已由边界验证时传播；worker resume优先使用stored result/job correlation，current worker不得覆盖历史trace。span attribute沿§4 allowlist；exception body/stack不得自动record。runtime span不持久化为`TraceSpanRecord`，也不能成为operation key、authority、commit probe或evidence。

## 8. Durable 审计发生与原生落点

> 下表“审计发生”是代码审查语义，不是新Rust enum、outbound event或跨仓协议。触发必须以本地UoW已确认commit为准。

| 审计发生 | 触发 flow / 时点 | 既有持久落点 | 关键body-free字段来源 | 潜在消费者 |
|---|---|---|---|---|
| archive admission settled | C01/E01 commit | `ArchiveRequest` + `ArchiveJob` + initial `ArchiveJobStageRecord` + complete result | request/scope/admission basis/job/stage/result refs | Q01、worker、受控审查 |
| restore admission settled | C02 commit | `RestoreRequest` + `ArchiveJob` + stage + result | request/bundle revision/frozen owner-set/authority/result refs | Q01/Q04、worker |
| lifecycle request settled | C03 commit | `LifecycleExecution` + decision/block history + result | revision/decision/action/basis/result refs | Q02、J11/J12-L |
| job stage changed | J01 commit | `ArchiveJob` + append-only `ArchiveJobStageRecord` + report/checkpoint | job/component/stage/basis/report refs | Q01、resume |
| source binding/capture changed | J02/J03/J04/E02 commit | binding/attempt + `BoundSourceRecord`/coverage/captured record/findings + result | exact request/source/attempt/fence/coverage/finding refs | J05/Q01/Q02 |
| manifest revision assembled/sealed | J05/J06 commit | `ArchiveBundle` + immutable manifest/entries/closure/findings/source sidecar + report | revision/exact-set/closure/seal basis refs | Q02/J07/J13 |
| assessment settled | J07/J08 commit | verification/compatibility assessment + fixed input + findings + report | revision/target/posture/evidence or safe reason refs | Q03/J06/J13 |
| storage/retrieval action observed | J09/J10/J12/E04-P commit | placement + `ExternalActionRecord` + fixed input/observation histories + report | exact target/effect key ref/posture/evidence ref | Q02/J13 |
| lifecycle action observed | J11/J12-L/E03/E04-L commit | lifecycle + decision/block/action histories + report | decision/action/posture/basis refs | Q02/operator |
| restore plan/material changed | J13/J14 commit | restore plan/item + prepared material sidecar + report | plan revision/owner/item/entry/material/eligibility refs | Q04/J15 |
| handoff outcome observed | J15/J16/E05 commit | handoff + dispatch input + outcomes + item/plan posture + report | receiver/item/material/effect/outcome refs | Q04/Q05/J17 |
| compensation observed | J17 commit | compensation + fixed input/result/reconcile histories + item posture + report | authority/action/handoff/outcome refs | Q05/operator |
| operation completed/replayed | any non-Query write commit | `ArchiveIdempotencyRecord` + `CompleteArchiveResult` + business records + checkpoint in same UoW | operation key/digest refs/result surface/trace ref | duplicate replay/diagnostic |

普通pre-validation reject可以返回安全result但不虚构accepted domain audit；是否保存完整rejected result沿Step11入口事务契约。duplicate/replay不追加第二份business history。Query只读取上述既有记录并发Layer A，不新增ReadAccessRecord。L4-observability若未来消费，必须经`AR-UP-007`批准的独立material/export合同并按current visibility/redaction裁剪；本步不创建该export flow。

## 9. 30入口 telemetry / audit 覆盖

| 协议族 | 分母 | Runtime telemetry位置 | Durable landing规则 | 特别红线 |
|---|---:|---|---|---|
| Command C01～C03 | 3 | entry/validate/authority/reserve/read/UoW/respond | accepted/rejected/blocked按Step11完整result；只有真实mutation有native records | response/ACK不等archived/restored/committed |
| Query Q01～Q05 | 5 | entry/visibility/read/cursor/respond | none | no reserve/result/audit/cache/repair；hidden count不记录 |
| Consumer E01～E05 | 5 | envelope/schema/dedup/map/UoW/ACK | accepted mapped local change + receipt/result；duplicate只replay | ACK不等owner/storage commit；unsupported不解析body |
| Job J01～J17 | 17 | start/replay/claim/read/intent/external/probe/finalize | native plan/intent/history/outcome/report/result/checkpoint | partial保留逐项；external unknown不盲重发 |
| **总计** | **30 logical / 32 method surfaces** | **全部有有限operation/phase/result/error切口** | **仅既有owner落点** | **无outbound publisher、generic audit ledger或observability backend** |

E04/J12的Placement与Lifecycle method surface使用同一logical operation name加有限`target_kind`，不得拆成新协议；每条只按persisted target路由。J13～J17的per-owner detail保存在native record/report，不作为metrics label。

## 10. Redaction、sink failure 与递归保护

| ID | 强制规则 |
|---|---|
| `AR-TELEM-001` | allowlist校验在日志/span/metric序列化之前；未知字段默认拒绝 |
| `AR-TELEM-002` | telemetry facade不得依赖domain，也不得调用Archive Command/Consumer/Job/write repository |
| `AR-TELEM-003` | Query开启/关闭telemetry时业务read调用、surface和零写断言完全相同 |
| `AR-TELEM-004` | sink failure/drop/timeout不回滚已提交truth、不修改原error、不触发业务retry/probe |
| `AR-TELEM-005` | 不能用sink ACK、日志缺失、span status或metric值证明commit/not-dispatched/evidence/readiness |
| `AR-TELEM-006` | 本进程telemetry不得经Bus或observability adapter同步回灌Archive inbound consumer形成自观察循环 |
| `AR-TELEM-007` | suppression记录只能使用独立、无业务字段的bounded counter/fallback；fallback自身失败时静默计数/drop，禁止递归 |
| `AR-TELEM-008` | raw provider/store error只先映射Step12 typed error；原message/body/stack不得进入任何channel |
| `AR-TELEM-009` | native durable audit保存失败是业务UoW失败；runtime telemetry失败不是native audit失败，两者不可互换 |
| `AR-TELEM-010` | fake telemetry只能捕获设计字段供测试，不产出真实evidence、artifact、run或signoff |

## 11. 测试切口与跨 Step 审计

| ID | 测试切口 | 断言 |
|---|---|---|
| TC-AR-OBS-001 | all 30 entry paths | 每入口有start/terminal span与有限result；无raw body/ID label |
| TC-AR-OBS-002 | commit outcome matrix | accepted仅Committed后；Unknown=`indeterminate`，Aborted无after-state日志 |
| TC-AR-OBS-003 | Query telemetry on/off | 五Query零写、零reserve、零external effect，surface不变 |
| TC-AR-OBS-004 | duplicate replay | 只有Replay技术信号，无第二history/intent/effect/accepted counter |
| TC-AR-OBS-005 | malicious canary payload | body/token/key/digest/endpoint/secret/stack不出现在captured signals |
| TC-AR-OBS-006 | metric cardinality scan | labels仅有限enum，无ref/ID/version/free text |
| TC-AR-OBS-007 | sink unavailable | 业务commit/result保持原样，无retry/rollback/recursive ingress |
| TC-AR-OBS-008 | native audit atomicity | mandatory record/result/checkpoint任一失败则accepted UoW不成立 |
| TC-AR-OBS-009 | external unknown | log/span/metric均不标Committed/Failed certainty；只指示reconcile |
| TC-AR-OBS-010 | workspace/artifact/audit material | source class/provenance保留，正文/owner truth不进入telemetry或本地generic ledger |
| TC-AR-OBS-011 | runtime Ready label | 只表示assembly成功，不出现product readiness/evidence字段 |
| TC-AR-OBS-012 | self-observation guard | telemetry emission不触发E01～E05或任何Archive write service |

| 跨 Step 审计项 | 结论 |
|---|---|
| Step06对象/state/history | pass：durable trail只复用26对象及其history/sidecar，无第27对象 |
| Step07 ports | pass：不新增business/audit/publisher port；host telemetry若无法直接注入须回退Step07/14 |
| Step08/09入口 | pass：3+5+5+17全部覆盖；E04/J12仍互斥target surface |
| Step10状态 | pass：指标/log只用正式有限state；不通过观测触发transition |
| Step11事务 | pass：native records同UoW；Layer A在UoW外且非权威 |
| Step12/13恢复 | pass：unknown/duplicate/conflict/fence不升级、不重跑 |
| Step14绑定 | pass_with_pending：backend/sink/config未选；不阻止安全instrumentation契约 |
| `L4-observability`边界 | pass_with_AR-UP-007：其审计后端与材料truth不复制；positive export仍blocked |

以上是未来Step16/正式05的测试输入，不是测试执行或evidence。

## 12. 正式回填草稿、待确认与门禁

正式 §14 应保留信号分层、字段白名单、日志/指标/span、native审计落点、30入口覆盖、redaction/sink/递归规则。不得列具体backend、threshold、retention或声明审计链完整。

| 待确认 | owner / 影响 | 当前姿态 |
|---|---|---|
| telemetry facade/library与host注入方式 | Archive实施/配置设计 | 不新增business port；若需要改compile graph回退Step03/07/14 |
| sink、采样、bucket、retention、alert | 配置/运维 owner | 不给默认值；不影响business truth |
| trusted trace/ref可记录规则 | security/observability owner | 未批准则省略restricted字段 |
| Archive→L4-observability audit material/export合同 | `AR-UP-007` | 无正向handoff、不声称完整审计材料 |

| 完成门禁 | 结果 |
|---|---|
| SOP问题回答 | pass |
| 日志/指标/span位置 | pass |
| native durable audit owner | pass |
| 30入口覆盖 | pass |
| redaction/no-write/recursion | pass |
| backend/export | pending/blocked，未伪造 |
| 正式03写入 | not allowed until Step19 |
| 下一动作 | 按连续授权进入Step16 |

本 Step 未实现埋点、未连接backend、未执行测试、未生成log/metric/trace/audit export/evidence/verdict/readiness，也未提交 commit。
