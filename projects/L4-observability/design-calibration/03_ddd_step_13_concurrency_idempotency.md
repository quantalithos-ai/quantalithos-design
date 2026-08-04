# L4-observability 03-详细设计 Step 13 · 并发、幂等与重入保护

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 13
> 回填章节: `03-详细设计.md` §12 并发、幂等与重入保护
> 当前模式: `full-restart`
> 当前门禁: 用户已授权一次完成 M2；本 Step 完成后只允许继续 M2 Step 14，必须在 Step 15 完成后停在 Step 16 前

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 定义并发、幂等与重入保护 |
| 输入基线 | 当前正式 `00` / `01` / `02`;本轮 Step 06~12 |
| 输出文件 | `projects/L4-observability/design-calibration/03_ddd_step_13_concurrency_idempotency.md` |
| 当前状态 | `completed_design_record_with_affected_open` |
| 正式回填状态 | blocked_until_step_19 |
| gate_status | `pass_with_affected_open` |
| 停审方式 | M2 批次内继续 Step 14；不得修改正式 `03-详细设计.md`，并在 Step 15 完成后停在 Step 16 前 |
| downstream targeted repair | `CFG-BLK-07-01` repaired on 2026-07-14；同步 Query enum owner、Consumer/producer static identity 与 schema-version token，不改变 key、digest、claim、fence 或 retry invariant |
| affected 状态 | inherited upstream/internal affected 全部保留；本 Step 只闭合可实现的 key/digest/dedup/claim/fence/token 契约，不宣称 owner、payload 或 runtime capability 已实现 |

## 2. 本步目标与非目标

本 Step 把 Step 06 的 application helper / state owner、Step 07 的 repository / UoW / publisher / delivery port、Step 08 的 16 Command / 9 Consumer / 9 Job 协议、Step 09 的函数级处理流、Step 10 的状态矩阵、Step 11 的事务与一致性、Step 12 的错误与恢复分类收束为可直接编码的并发、幂等与重入契约。

实现者必须能从本 Step 精确判断:

1. 哪些本仓 owned mutable row、append-only record、projection/reference/maintenance state、outbox marker、job report和idempotency support会发生并发冲突。
2. 16个Command、9个Inbound Consumer、9个Operations Job分别使用什么可计算key和稳定digest。
3. `same operation + same key + same digest`、`different digest`、`in-flight`、`completed result missing`和`commit outcome unknown`分别如何处理。
4. staged Job在start已提交、item部分完成、worker崩溃、finalize失败或duplicate调用时,如何识别同一execution并安全恢复。
5. 双publisher、projection rebuild、reference refresh、rollup/gap/replay maintenance、handoff/export external call如何避免覆盖winner或重复外部副作用。
6. Query为何不创建idempotency、不写read trace、不inline refresh/rebuild/repair。
7. Step 16需要哪些并发、幂等和重入测试切口。

本 Step 不定义:

- idempotency保留时长、reservation过期时间、worker lease时长、heartbeat周期、retry次数、backoff、jitter、exhaustion数字、batch并行度或scheduler配置；
- 具体hash crate、canonical serializer产品绑定、数据库DDL、HTTP/RPC数字、消息中间件ack/dead-letter配置；
- 日志字段名、metric名称、trace span名称、告警规则；
- 真实实现commit、真实run id、真实evidence alias、验收签署或测试结果；
- source truth修复、外部业务truth补偿或exactly-once承诺。

这些内容分别由Step 14、Step 15、Step 16、`04-配置设计.md`和`07-实施计划.md`承接；后续文档不得用配置或实现选择削弱本Step invariant。

## 3. 输入材料

| 输入 | 状态 | 本步用途 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 13 | current | 要求并发场景表、幂等键表、重入保护表及可测试实现策略 |
| `standards/document/详细设计书写规范.md` 5.12 | current | 要求只写真实场景,key必须可计算,duplicate处理必须明确 |
| 正式 `02-概要设计.md`;`02_hld_step_12_detailed_design_handoff.md` | pass | 提供Command/Consumer/Job幂等、duplicate no-write、outbox non-rollback、job no-repair和配置不可绕过门禁 |
| `03_ddd_step_06_object_contracts.md` | pass | 提供operation context、reservation、stored result、outbox record、job report和27个状态owner |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | pass | 提供versioned repository、UoW、projection/reference/outbox/idempotency/result/report及delivery ports |
| `03_ddd_step_08_protocol_contracts.md` | pass | 提供16 Command、14 Query、9 Consumer、12 outbound event、9 Job exact DTO |
| `03_ddd_step_09_function_flows.md` | pass | 提供reserve顺序、duplicate replay、publisher、staged Job和external delivery phase |
| `03_ddd_step_10_state_matrix.md` | pass | 提供27个状态机、reserved transition、outbox/idempotency/report terminal语义 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | pass | 提供CAS、unique identity、cursor/fence、transaction ordering、staged job recovery和consistency invariant |
| `03_ddd_step_12_error_recovery.md` | pass | 提供`VersionConflict`、`IdempotencyConflict`、`CompletedReservationResultMissing`、unknown/finalize recovery分类 |
| 旧 `03_ddd_step_13_concurrency_idempotency.md` | historical_material | 旧稿仅81行且混入废弃schema和自动顺推门禁,只用于问题诊断 |
| L1-governance / L1-artifact / L1-identity / L0-bus Step 13 | reference_only | 只参考资源、key/digest、duplicate/in-flight、job/outbox/handoff重入和测试粒度 |

## 4. 分批写入计划

| 批次 | 内容 | 当前状态 |
|---|---|---|
| 13.0 | 文件骨架、SOP问题回答、historical-material诊断、设计原则 | done |
| 13.1 | 并发资源inventory、控制primitive和Query排除面 | done |
| 13.2 | Command / Consumer / Job / propagation并发场景表 | done |
| 13.3 | operation namespace、context/reservation/result契约与必要前序回填 | done |
| 13.4 | 16 Command、9 Consumer、9 Job key/digest表 | done |
| 13.5 | duplicate/in-flight/recovery matrix与commit unknown算法 | done |
| 13.6 | staged Job work-set/claim/fence、outbox、projection/reference、handoff/export重入 | done |
| 13.7 | 测试切口、cross-step audit、回填草稿、自检和门禁 | done |

## 5. SOP 问题回答

| SOP问题 | 当前回答 |
|---|---|
| 哪些处理流可能并发修改同一资源? | 16个Command可能并发修改receipt/safety/correlation/signal/audit/evidence/handoff/authenticity/retention/protection/replay/no-write/gap/export/reference等本仓owned row；9个Consumer可能与Command或彼此竞争同一receipt/projection/reference/handoff/delivery/gap；9个Job可能与source mutation、同类Job或publisher竞争outbox、projection、rollup、reference、gap、replay、handoff/export、progress和report。Query只读,不参与写并发。 |
| 哪些接口、事件或Job可能重复调用? | 所有Command都可能因caller timeout/retry重复；所有Consumer都可能因at-least-once redelivery或ack失败重复；所有Job都可能因scheduler/operator/worker crash重跑；publisher item和external delivery phase可能在local finalize不确定后再次出现。 |
| 幂等键来自哪里? | Command来自`ObservationCommandMetadata.idempotency_key`；Consumer来自`ObservationInboundEventEnvelope.dedup_key`；Job来自`ObservationJobMetadata.idempotency_key`。三类都必须与typed operation namespace和stable digest组成logical key。Business unique key/CAS只负责业务或存储冲突,不能替代stored replay。Outbox item使用`outbox_ref + loaded version`控制本地marker竞争,external publisher还必须使用稳定event identity。 |
| 重复请求如何处理? | completed same digest精确replay immutable stored response/receipt/report；different digest返回`IdempotencyConflict`；in-flight不进入第二个mutation/job body；completed但result缺失/错kind为consistency defect；Query重复读取当前authorized surface；outbox第二worker按CAS loser分类,不得覆盖或改truth。 |
| 并发冲突如何测试? | Step 16承接deterministic CAS winner/loser、unique conflict、same-digest replay、different-digest conflict、in-flight、missing/wrong result、commit unknown probe、consumer redelivery、dual publisher、staged Job resume、projection fence、reference/retention race、external delivery finalize-only和Query no-write。 |

## 6. Historical material诊断与当前闭环缺口

### 6.1 旧 Step 13 诊断

| 旧材料问题 | 风险 | 当前处理 |
|---|---|---|
| 仅81行通用模板 | 无法指导repository、service、worker或fake落码 | 全量替换,不继承旧pass |
| 使用`NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection`等废弃主语 | 重新引入schema-first和业务truth漂移 | 只记录为historical material |
| 没有16 Command / 9 Consumer / 9 Job key/digest矩阵 | 实现侧会自行拼key或把时间写入digest | 本Step逐入口闭合 |
| 没有in-flight、stored missing、commit unknown、same-execution Job恢复 | duplicate可能重跑副作用 | 本Step输出优先级和恢复算法 |
| 没有outbox/external delivery at-least-once边界 | 容易宣称exactly-once或重复交付 | 本Step固定identity/finalize-only/probe规则 |
| gate为`next_step_or_formal_assembly` | 违反逐Step确认 | 改为完成后等待用户确认 |

### 6.2 当前Step 06~12缺口

| 缺口ID | 当前材料 | 为什么不可落码 | 本Step处理 |
|---|---|---|---|
| `DDD-S13-GAP-001` | `ObservationOperationName`仅有使用点,无正式定义 | repository logical unique key和stored-result operation compatibility无法构造 | 补有限typed operation namespace,统一Command/Consumer/Job |
| `DDD-S13-GAP-002` | `ObservationOperationContext`无operation name/channel | entry构造context后service仍需另传operation,存在错绑key/digest风险 | context携带正式operation；factory按Command/Consumer/Job typed name构造 |
| `DDD-S13-GAP-003` | `reserve_or_load`只返回reservation state,没有`Acquired`/`Replay`/`InFlight`结果 | 无法区分本次新reservation与另一执行仍在途,第二writer可能继续执行 | 引入`ObservationIdempotencyReserveOutcome`并由repository原子返回 |
| `DDD-S13-GAP-004` | reservation本身未保存operation name | completed result只能依赖repository隐含key验证 | reservation字段补operation；mark complete和replay均做operation/digest/kind校验 |
| `DDD-S13-GAP-005` | Job start可持久化Draft后崩溃,duplicate same key会遇到非terminal reservation/report | 没有same-execution恢复权、work-set和fencing,无法安全继续items/finalize | 引入durable work-set + execution claim/fencing token；只允许同一immutablebinding恢复 |
| `DDD-S13-GAP-006` | `Failed -> Pending`是reserved transition且`list_pending_with_payload`只列Pending | retryable publication失败没有正式重新选择/竞争面 | 增加retry candidate选择与atomic item claim/fence语义,状态仍不由worker私改 |
| `DDD-S13-GAP-007` | publisher/delivery port未显式接收external idempotency identity | external success + local marker失败可能重复副作用 | event/outbox identity、preparation/delivery intent ref作为稳定external token；exact token类型回填port |
| `DDD-S13-GAP-008` | Step 08 Job幂等表含`requested_at window` | volatile time导致同一logical input产生不同digest | 删除window口径；`requested_at`、`job_execution_ref`均排除digest |
| `DDD-S13-GAP-009` | inbound envelope和reference snapshot没有body-free source version/order marker | 只能用`occurred_at`猜顺序,无法兑现概要“old source version不得倒退snapshot/projection” | 增加optional `ObservationSourceVersionRef`;只有同producer/source且版本可比较时做monotonic guard,缺失时显式degraded而非猜时间 |
| `DDD-S13-GAP-010` | Step 12 `ApplicationError`没有typed in-flight variant | repository即使识别在途,service也只能误映射为dependency或generic conflict | 增加`IdempotencyInFlight`;恢复类为`RetryAfterStateChange`,public为non-retryable `DependencyUnavailable`/delayed semantic,不授权第二writer |
| `DDD-S13-GAP-011` | `StoredObservationResult`未保存reservation ref和原request digest | `PCI-OBS-018`要求operation/digest compatible,但result row无法独立校验 | 增加`idempotency_ref`和`request_digest`;replay校验operation/actor/digest/kind/schema/digest-summary |
| `DDD-S13-GAP-012` | Step 11 logical unique仅为`(operation,key)` | 两个actor复用raw key会互相冲突,错误实现甚至可能跨actor暴露stored surface | logical unique改为`(operation_name,actor_ref,idempotency_key)`;actor同时进入stable digest,任何replay仍重跑当前authorization/visibility envelope gate |
| `DDD-S13-GAP-013` | Step 12没有execution claim/fence typed error | global work claim loser或stale worker只能冒充普通CAS/repository failure | 增加`ExecutionFenceConflict`;恢复类为`RetryAfterStateChange`,runner必须reload plan/claim/item outcome |
| `DDD-S13-GAP-014` | inbound event只依赖caller-provided dedup key | producer若对同一`source_event_ref`换dedup key,可能创建第二reservation并重写本地状态 | reservation增加optional typed source-event identity与secondary unique index；same event/digest复用original execution,result mismatch quarantine |

以上均属于当前`03`详细设计内部可闭合问题,不改变正式`00`、`01`或`02`的业务主语、ownership、接口族或处理流主路径,因此不构成上游blocker。

## 7. 设计原则与红线

| 原则 | 正式口径 |
|---|---|
| typed operation namespace | logical key必须包含operation family + exact typed operation variant；不同operation可复用同一raw key而不串result |
| atomic reserve outcome | repository一次原子操作返回`Acquired`、`Replay`、`Conflict`或`InFlight`;service不得由reservation row自行猜 |
| stable digest | digest只覆盖会改变logical outcome或work-set的canonical输入；顺序、Option和set语义按DTO精确规范化 |
| volatile exclusion | request id、requested/occurred/received/current time、trace id、job execution/run ref、transport offset、delivery attempt、retry counter、claim/lease token均不进digest |
| exact stored replay | duplicate只能读取immutable stored response/receipt/report；不得从current truth、projection、outbox或external adapter重算 |
| optimistic local update | existing mutable owner使用loaded `ObservationRepositoryVersion`;cursor、source version、timestamp、claim token不得替代row version |
| unique is not replay | business/storage unique conflict仍是conflict/policy结果；只有idempotency stored result能产生duplicate replay |
| append-only no overwrite | history/audit/refresh/lifecycle/execution record和immutable snapshot/result不覆盖旧记录；duplicate不追加第二份 |
| Query no-write | Query不reserve、不save result、不append read record、不refresh、不rebuild、不mark stale、不advance cursor |
| staged Job resumability | duplicate terminal report直接replay；in-progress同execution只能经durable claim/fence和immutable work-set恢复；不能重新解释当前input扩大范围 |
| item-level recovery | 已提交Job item不概念回滚；resume只处理未分类或明确retryable item,finalize只基于完整classification |
| at-least-once propagation | outbox/handoff/export只能承诺本地marker CAS + stable external idempotency token；不得宣称跨系统exactly-once |
| finalize-only after external success | 已取得body-freeexternal receipt后,本地known failure只重做local finalize；outcome unknown先probe |
| no truth writeback | concurrency、retry、replay、rebuild、handoff和reconciliation都不得修改外部source truth或把transport事实提升为业务truth |
| fake/durable parity | fake必须实现相同unique key、reserve outcome、CAS、claim fence、rollback invisibility、stored replay与Query no-write,不得用private shortcut绕过 |

## 8. 并发控制 primitive

| Primitive | 适用资源 | 成功语义 | 冲突语义 | 禁止替代 |
|---|---|---|---|---|
| `ObservationIdempotencyReserveOutcome` | Command/Consumer/Job logical operation | 一个`Acquired` writer或精确`Replay` | `Conflict` / `InFlight` | plain unique exception + current truth lookup |
| `ObservationRepositoryVersion` CAS | existing mutable truth/state/view/report/marker | loaded version唯一winner | `OptimisticConflict` / item conflict | cursor、source version、timestamp、hard-coded version |
| create-if-absent + formal unique key | first truth/state/binding/current lookup | 一个canonical current identity | unique conflict/policy rejection | 当作stored duplicate result |
| append-only identity | history/audit/result/snapshot/record | one immutable ref/semantic unique append | duplicate ref/invariant conflict | update old row |
| monotonic committed cursor | source index/stale/applied watermark | same namespace只前进 | older no-op或invariant error | row version / global order |
| scope read fence | projection rebuild source set | replace前后scope revision相同 | reload/reclassify item | item最后一次read时间 |
| immutable target/work-set binding | staged Job | same execution只处理既定canonical scope/items | changed digest/binding conflict | resume时重新list并扩大范围 |
| execution claim + fencing token | nonterminal staged Job / retryable propagation item | 同一时刻一个active worker可提交该execution/item | stale claimant CAS conflict | long DB transaction、裸process lock |
| stable external idempotency token | event publish / handoff / export delivery | target可识别同一logical external effect | existing receipt/probe/indeterminate | random attempt id / job run id |

Claim/lease的具体持久化字段、duration和heartbeat配置留给Step 14/`04`;但语义不可配置:claim必须持久化、renew/release必须CAS、每次acquire产生严格单调fencing token、任何item/report/marker save都必须验证当前token,过期worker不得提交。若目标adapter不支持external idempotency/probe,external outcome unknown必须停止在`ProbeBeforeRetry`/人工处理,不得自动重发。

## 9. 并发资源 inventory

### 9.1 Owned mutable truth / state

| 资源族 | 可能写入方 | 冲突identity | 控制方式 | 不得发生 |
|---|---|---|---|---|
| receipt / safety | intake/safety Command,Bus/Sandbox Consumer | receipt ref,current source binding,one-safety-per-receipt | operation reserve + source/current unique + loaded version | duplicate source创建second current receipt；terminal safety原地覆盖 |
| correlation / safe signal / rollup | correlation/signal Command,Runtime/Sandbox Consumer,rollup Job | receipt-current-context,signal ref,window ref/scope | operation reserve + current unique + CAS + append-only record | trace/source ref当business version；读取raw signal重建 |
| audit projection / evidence linkage | audit/evidence Command,source/governance/artifact Consumer | projection ref,body-free linkage semantic tuple | operation reserve + CAS + formal unique relation | same evidence relation重复append；保存body |
| handoff / authenticity | handoff/hint Command,archive feedback Consumer,delivery Job | handoff ref,current hint per handoff | reserve + CAS + immutable evidence-index input | delivered/hint terminal被duplicate改写；伪造signoff |
| retention / active protection | retention/protection Command,handoff/export/replay guards | protected-ref current marker,protection ref | reserve + current unique + CAS + transaction recheck | stale release穿透active protection |
| replay / no-write / gap | replay/no-write/gap Command,feedback Consumer,gap/replay Job | scope/violation/gap ref and formal source/current lookup | reserve + CAS + append-only execution/transition record | replay修source truth；gap被no-op静默关闭 |
| export preparation / peripheral delivery | export Command,feedback Consumer,delivery Job | preparation ref,one current delivery per preparation | reserve + CAS + external token + append record | Delivered重复交付或当external audit truth |
| reference snapshot | reference Command,identity/governance/artifact/runtime Consumer,refresh Job | snapshot ref,current subject binding | reserve + current unique + CAS + source freshness/state guard | old event/refresh覆盖newer local snapshot；复制external body |

### 9.2 Projection / maintenance / report

| 资源族 | 并发来源 | 控制方式 | 冲突后行为 |
|---|---|---|---|
| projection source record / membership / member position | accepted Command/Consumer与其他source mutation | same accepted UoW exact membership replacement + tagged cursor + target aggregate revision | rollback accepted mutation,不得留下stale membership |
| read model / diagnostic / gap / peripheral / reference view | rebuild Job之间,或与accepted stale/source mutation | versioned replace + source fence + dual-watermark monotonicity | rollback item,old complete view保留且surface保持stale/failed |
| target binding / aggregate position | two rebuild starts或source index update | target unique immutable canonical binding + aggregate revision | same set复用,different set conflict |
| maintenance / progress | rebuild/replay/rollup/peripheral Job | loaded version + target binding + execution fence | stale worker item/finalize失败,不得标Fresh |
| job report Draft | item worker、failure accounting、finalizer、resume worker | loaded report version + execution fencing token + mutually exclusive classification | one update wins;loser reload后只处理仍未分类项 |
| terminal job report / stored result | finalizers或duplicate caller | Draft->one terminal CAS;result-before-complete same UoW | second finalizer replay/consistency check,不改terminal report |

### 9.3 Idempotency / stored replay / outbox / external side effects

| 资源族 | 并发来源 | 控制方式 | 冲突后行为 |
|---|---|---|---|
| idempotency reservation | parallel same operation/actor/key calls | atomic logical unique `(operation_name,actor_ref,idempotency_key)` + digest compare | oneAcquired；same digest Replay/InFlight；different digest Conflict |
| immutable stored result | parallel finalizers / duplicate read | generated result ref + operation/digest/kind compatibility + immutable append | duplicate ref/mismatch为consistency failure |
| outbox marker + snapshot | accepted writers,publisher workers | append inaccepted UoW；publisher loaded version + item claim fence | truth不回滚；second publisher local marker loser只记item conflict |
| external event publish | worker crash/timeout/dual worker | stable outbound event token + exact stored payload digest | target duplicate应返回existing receipt；unknown先probe,不能换token重发 |
| handoff/export external prepare | staged Job resume | stable preparation intent token + persisted prepared ref | duplicate prepare复用same preparation；missing/unknown按probe/manual |
| handoff/export external deliver | local finalize failure/worker crash | stable delivery intent token + persisted preparation + local marker CAS | existing receipt进入finalize-only；unknown不得盲重发 |

### 9.4 Runtime / entry / Query排除面

| 主语 | 允许并发行为 | 禁止写入 |
|---|---|---|
| API Command entry | validation、digest canonicalization、context factory、调用service | entry-local private idempotency map、repository/UoW访问、成功marker |
| Consumer worker | envelope/schema gate、调用service、基于durable receipt ack | ack前改本地truth、用delivery attempt进digest、duplicate重解析payload |
| Job runner | context构造、acquire/resume、调用application job service | 用process memory claim、用job execution ref替代logical key、伪造run结果 |
| Outbox loop | 拉取eligible item、acquire item fence、调用publication service | cursor当claim/version、从current truth重建payload |
| 14个Query | 并发读取当前committed authorized surface；允许两次读取观察不同已提交版本 | idempotency/reservation/result/history/outbox/stale/refresh/rebuild/repair/cursor写入 |

Query重复读取不是“幂等重放”。它返回调用时的当前committed view和完整visibility/freshness/availability surface,因此两次结果可不同；这不授权Query保存old response或隐式修复派生状态。

## 10. 阶段检查点 13.0~13.1

| 审查项 | 结论 |
|---|---|
| 是否读取SOP Step 13、5.12、正式02、概要承接和Step 06~12 | pass |
| 是否把旧81行Step 13降级为historical material | pass |
| 是否识别真实影响落码的并发资源 | pass |
| 是否区分idempotency、CAS、unique、cursor、fence、claim和external token | pass |
| 是否保持Query no-write与no truth writeback | pass |
| 是否发现上游blocker | no |
| 当时下一批 | 13.2并发场景矩阵；13.3 operation/reserve contract回填；当前最终状态以文件尾部门禁为准 |

本表只保留早期分批写入检查点，不代表最终Step状态。无论最终门禁是否pass，都不得据此自动进入Step 14或装配正式`03-详细设计.md`。

## 11. 并发场景表

### 11.1 Shared application gates

| 场景 | 冲突资源 | 控制方式 | 失败错误 / surface | 测试切口 |
|---|---|---|---|---|
| 同一Command被并发提交 | actor-scoped idempotency logical key | atomic reserve outcome + digest compare | one `Acquired`;others `Replay` / `InFlight` / `IdempotencyConflict` | `TC-OBS-IDEM-001`~`004` |
| 同一Consumer event被并发投递 | consumer operation + system actor + dedup key | envelope/schema gate后atomic reserve;source version guard | duplicate receipt / in-flight delayed / conflict | `TC-OBS-EVENT-DEDUP-001`~`003` |
| 同一Job被并发触发 | job operation + actor + job key,plan/report | reserve + immutable plan + execution claim/fence | duplicate report / in-flight / stale claimant conflict | `TC-OBS-JOB-IDEM-001`~`004` |
| completed reservation与stored result不一致 | reservation/result rows | result-before-complete UoW + replay compatibility audit | `CompletedReservationResultMissing` / `StoredResultKindMismatch` | `TC-OBS-IDEM-RESULT-001` |
| accepted write与另一个writer竞争同一row | owned mutable row | versioned read + exact `expected_version` | `OptimisticConflict`;whole accepted UoW rollback | `TC-OBS-CONC-CAS-001` |
| first create竞争canonical current identity | formal unique index | create-if-absent + domain/business uniqueness | unique/policy conflict,not duplicate replay | `TC-OBS-CONC-UNIQUE-001` |
| accepted source mutation与projection rebuild交错 | source index/position,view/freshness | source UoW advances cursor/revision;rebuild uses scope fence + view CAS | item reload/failure;newer stale wins | `TC-OBS-PROJ-FENCE-001` |
| duplicate Query或并发Query | committed read surface | no idempotency and no write UoW | each read returns current authorized surface | `TC-OBS-QUERY-NOWRITE-001` |

### 11.2 Command concurrency scenarios

| Command flow | 主要冲突资源 / 竞争方 | 控制方式 | loser行为 | 测试切口 |
|---|---|---|---|---|
| `SubmitObservationMaterialFlow` | current receipt by `(source_ref,submission_purpose)`;Bus Consumer | idempotency first + source current unique + create/update version | duplicate replay or unique/policy conflict;never second current receipt | `TC-OBS-CONC-INTAKE-001` |
| `RecordSafetyDispositionFlow` | receipt + one safety disposition;Sandbox Consumer | versioned receipt/disposition + state matrix | rollback/reload;terminal state不覆盖 | `TC-OBS-CONC-SAFETY-001` |
| `BindCorrelationContextFlow` | current context by receipt;Runtime/Sandbox signal input | current-context unique + loaded context version | replay/conflict;不创建second current context | `TC-OBS-CONC-CORR-001` |
| `RecordSafeSignalFlow` | signal identity,rollup window,correlation state;rollup Job | signal/current unique where formal + loaded rollup version + append-only relation record | item/command version conflict;不把raw signal重算 | `TC-OBS-CONC-SIGNAL-001` |
| `AppendAuditProjectionFlow` | projection/source audit relation;Source Audit Consumer | body-free semantic unique + projection CAS | duplicate source conflict or reload;不重复audit append | `TC-OBS-CONC-AUDIT-001` |
| `LinkBodyFreeEvidenceFlow` | `(projection,boundary,purpose,digest)` linkage;Artifact/Governance Consumer | formal linkage unique + projection/linkage version | duplicate relation不新增；digest差异冲突 | `TC-OBS-CONC-EVIDENCE-001` |
| `PrepareReportHandoffFlow` | handoff current identity,immutable evidence-index input | exact input snapshot append + handoff unique/CAS | mismatched preview reject；不覆盖旧input | `TC-OBS-CONC-HANDOFF-001` |
| `EvaluateAuthenticityHintFlow` | one current hint per handoff;handoff delivery/feedback | handoff/hint version + terminal placeholder rule | reload/reject；不得把placeholder原地升级为real | `TC-OBS-CONC-HINT-001` |
| `SetRetentionMarkerFlow` | current marker + active protections;protection Command/handoff/replay Job | marker CAS + active protection recheck in same UoW | stale release rollback；重新读后reevaluate | `TC-OBS-CONC-RETENTION-001` |
| `ProtectActiveReferenceFlow` | protection consumer set + marker state | protection/marker CAS + canonical consumer set | one winner；不得丢失已提交consumer | `TC-OBS-CONC-PROTECT-001` |
| `DefineReplayScopeFlow` | replay scope identity/target set;replay Job | idempotency + immutable canonical target set + scope CAS | changed target set conflict；不扩大同execution | `TC-OBS-CONC-REPLAY-001` |
| `RecordNoWriteViolationFlow` | violation identity + mandatory record | composite save + formal trigger/current unique | whole UoW rollback；forbidden write仍blocked | `TC-OBS-CONC-NOWRITE-001` |
| `RecordGapStateFlow` | current gap by source/kind + degraded state;gap Job/feedback Consumer | gap/degraded CAS + append transition | reload/classify；不静默close或双开current gap | `TC-OBS-CONC-GAP-001` |
| `PrepareExternalAuditExportFlow` | export preparation/current delivery by view/consumer | preparation unique + delivery CAS + visibility/retention recheck | blocked/conflict；不重复创建current delivery | `TC-OBS-CONC-EXPORT-001` |
| `RegisterReferenceSnapshotFlow` | current snapshot by subject;source Consumer/refresh Job | subject current unique + optional source-version monotonic guard | old/equal version no-op/replay,uncomparable degraded/conflict | `TC-OBS-CONC-REF-001` |
| `UpdateReferenceSnapshotStateFlow` | snapshot row;source Consumer/refresh Job | loaded snapshot version + allowed transition + source-version guard | reload；old source version不得倒退state | `TC-OBS-CONC-REF-002` |

### 11.3 Consumer concurrency scenarios

| Consumer flow | 主要竞争方 / 资源 | 控制方式 | loser / duplicate行为 | 测试切口 |
|---|---|---|---|---|
| `ConsumeBusObservationMaterialFlow` | intake Command,current receipt/safety | dedup reserve + source current unique + CAS | replay stored receipt；不重复resolver/intake/outbox | `TC-OBS-EVENT-BUS-001` |
| `ConsumeSourceAuditMaterialFlow` | audit Command,projection/linkage relation | dedup + source version + projection semantic unique/CAS | older/no-change `NoOp`或duplicate；不重复append | `TC-OBS-EVENT-AUDIT-001` |
| `ConsumeIdentityObservationContextFlow` | reference Command/refresh Job,current subject snapshot | dedup + optional source version + snapshot CAS | old version不得覆盖；missing version显式degraded | `TC-OBS-EVENT-IDENTITY-001` |
| `ConsumeGovernanceAuditContextFlow` | evidence Command,reference/evidence input marker | dedup + body-free relation unique + visibility guard | duplicate receipt；not-visible不变成visible | `TC-OBS-EVENT-GOV-001` |
| `ConsumeArtifactEvidenceContextFlow` | evidence Command,linkage/reference state | dedup + linkage unique + source version/CAS | duplicate/no-op；不复制evidence body | `TC-OBS-EVENT-ART-001` |
| `ConsumeRuntimeSignalSummaryFlow` | signal Command,correlation/snapshot/rollup | dedup + signal/reference unique + CAS | duplicate不建新signal；乱序不倒退snapshot | `TC-OBS-EVENT-RUNTIME-001` |
| `ConsumeSandboxSignalSummaryFlow` | safety/signal Command,current receipt/disposition | dedup + state matrix + CAS | duplicate不重复quarantine/signal | `TC-OBS-EVENT-SANDBOX-001` |
| `ConsumeArchiveHandoffFeedbackFlow` | handoff delivery Job,current handoff marker | dedup + handoff CAS + delivery intent identity | existing delivered/failure receipt replay；不把feedback当archive truth | `TC-OBS-EVENT-ARCHIVE-001` |
| `ConsumeReportConsumerFeedbackFlow` | export delivery Job,current peripheral delivery/gap | dedup + delivery/gap CAS + source version guard | duplicate receipt；不覆盖newer delivery/gap | `TC-OBS-EVENT-REPORT-001` |

### 11.4 Job and propagation concurrency scenarios

| Job / phase | 冲突资源 | 控制方式 | loser / recovery | 测试切口 |
|---|---|---|---|---|
| `PublishObservationOutbox` duplicate execution | idempotency,plan,report | job reserve + frozen outbox work-set | terminal replay；in-flight不重新list/publish | `TC-OBS-JOB-PUBLISH-001` |
| two workers publish same outbox item | global outbound-event work identity,outbox row | execution claim/fence + loaded outbox version + stable event token | stale claimant cannot mark；target duplicate returns existing receipt | `TC-OBS-OUTBOX-DUAL-001` |
| publish succeeds but marker finalize fails | external event effect,local outbox marker | same event token + target probe + local finalize-only | no new token/payload；truth unchanged | `TC-OBS-OUTBOX-FINALIZE-001` |
| `RebuildObservationReadModels` overlaps source mutation | bound scopes,source fence,view/diagnostic/progress/report | immutable target binding + per-scope work item + fence + CAS | rollback/reclassify item；target remainsnon-Fresh | `TC-OBS-JOB-READMODEL-001` |
| two rollup jobs process same window | rollup window/rebuild state/report | window work identity + claim fence + rollup CAS/source cursor | one commit；loser reloads or classifies | `TC-OBS-JOB-ROLLUP-001` |
| refresh Job races Consumer/reference Command | snapshot/current binding/reference view | snapshot work identity + version/source-version guard | stale claimant/item conflict；不覆盖newer snapshot | `TC-OBS-JOB-REFRESH-001` |
| gap scan races explicit gap/feedback | gap/degraded/current source lookup | gap-source work identity + gap CAS | reload and classify existing state；不双开gap | `TC-OBS-JOB-GAP-001` |
| replay Job races source/projection mutation | replay scope,target maintenance/progress | immutable scope + target claim/fence + no-write/retention recheck | block/reload；不修source truth | `TC-OBS-JOB-REPLAY-001` |
| handoff delivery duplicate/crash | handoff/preparation/receipt/report | handoff work identity + stable intent token + phase marker CAS | reuse preparation/receipt,finalize-only；unknown probe | `TC-OBS-JOB-HANDOFF-001` |
| export delivery duplicate/crash | export preparation/delivery/package receipt/report | export work identity + stable intent token + phase marker CAS | no redelivery after known success；unknown probe | `TC-OBS-JOB-EXPORT-001` |
| peripheral rebuild overlaps source mutation/another rebuild | consumer scope view/dependency/progress | scope work identity + source fence + view CAS | old view retained/stale；loser item classified | `TC-OBS-JOB-PERIPHERAL-001` |
| worker crashes after some item commits | plan item states,report Draft | immutable plan + item terminal classification + new fenced claim | resume only unclassified/retryable item；no rescan ofcompleted work | `TC-OBS-JOB-RESUME-001` |
| two finalizers race | report/result/idempotency | report CAS + result-before-complete same UoW + execution fence | one terminal winner；other replay/reload | `TC-OBS-JOB-FINALIZE-001` |

## 12. Typed operation namespace与idempotency scope

### 12.1 Operation family

```rust
/// Route-neutral,finite operation identity used by context,digest,and idempotency.
pub enum ObservationOperationName {
    Command(ObservationCommandOperation),
    Query(ObservationQueryOperation),
    InboundConsumer(ObservationInboundConsumerOperation),
    Job(ObservationJobOperation),
}
```

| Family | Exact variants |
|---|---|
| `ObservationCommandOperation` | `SubmitObservationMaterial`;`RecordSafetyDisposition`;`BindCorrelationContext`;`RecordSafeSignal`;`AppendAuditProjection`;`LinkBodyFreeEvidence`;`PrepareReportHandoff`;`EvaluateAuthenticityHint`;`SetRetentionMarker`;`ProtectActiveReference`;`DefineReplayScope`;`RecordNoWriteViolation`;`RecordGapState`;`PrepareExternalAuditExport`;`RegisterReferenceSnapshot`;`UpdateReferenceSnapshotState` |
| `ObservationQueryOperation` | `GetObservationReceipt`;`GetIntakeStatus`;`GetSafeSignal`;`GetSignalRollup`;`GetAuditTimeline`;`GetEvidenceIndexInput`;`GetReportHandoff`;`GetRetentionProtection`;`GetObservationReadModel`;`GetDiagnosticView`;`GetGapStatus`;`GetPeripheralExportView`;`GetReferenceSnapshotView`;`GetRebuildProgress` |
| `ObservationInboundConsumerOperation` | `ConsumeBusObservationMaterial`;`ConsumeSourceAuditMaterial`;`ConsumeIdentityObservationContext`;`ConsumeGovernanceAuditContext`;`ConsumeArtifactEvidenceContext`;`ConsumeRuntimeSignalSummary`;`ConsumeSandboxSignalSummary`;`ConsumeArchiveHandoffFeedback`;`ConsumeReportConsumerFeedback` |
| `ObservationJobOperation` | `PublishObservationOutbox`;`RebuildObservationReadModels`;`RebuildSignalRollups`;`RefreshReferenceSnapshots`;`ScanObservationGaps`;`CoordinateObservationReplay`;`PrepareReportHandoffDelivery`;`PrepareExternalAuditExportDelivery`;`RebuildPeripheralViews` |

上述表是并发 / digest use projection，不是第二定义源。`ObservationQueryOperation` 的 actual Rust enum、14个variant和唯一owner固定在 Step 06 `application::idempotency`；本 Step 的 canonical operation discriminator必须逐variant复用该enum，不能定义local alias、string tag或仅为配置建立平行enum。Query仍然只构造`ObservationOperationContext`，不得进入reservation repository。

`ObservationCommandName`、`ObservationQueryName`、`ObservationInboundConsumerName`和`ObservationJobName`仍是public route-neutral wrapper。Entry必须通过compile-time/static route table映射到上述finite enum；未知名称、family/body不匹配或Command `PrepareExternalAuditExport`与Job `PrepareExternalAuditExportDelivery`混用都在UoW前返回`InvalidRequest`。

### 12.2 Context与logical key

```rust
/// Application context shared by command,query,consumer,and job use cases.
pub struct ObservationOperationContext {
    pub operation_name: ObservationOperationName,
    pub actor_ref: ActorSafeRef,
    pub trace_ref: Option<TraceCorrelationRef>,
    pub idempotency_key: Option<IdempotencyKey>,
    pub request_digest: RequestDigest,
    pub inbound_event_identity: Option<ObservationInboundEventIdentity>,
}

/// Logical key for one idempotent operation under one effective actor scope.
pub struct ObservationIdempotencyScope {
    pub operation_name: ObservationOperationName,
    pub actor_ref: ActorSafeRef,
    pub idempotency_key: IdempotencyKey,
}

/// Stable source-event identity that prevents dedup-key drift from duplicating one event.
pub struct ObservationInboundEventIdentity {
    pub consumer: ObservationInboundConsumerOperation,
    pub producer_family: ObservationProducerFamily,
    pub source_event_ref: SourceEventRef,
}
```

| Rule | Contract |
|---|---|
| scope unique | durable unique key为canonical `(operation_name,actor_ref,idempotency_key)`；enum discriminator必须保留 |
| eligible families | Command、InboundConsumer、Job必须有key；Query的`idempotency_key=None`且repository拒绝reserve |
| event identity | 只有InboundConsumer context为Some；其他family必须为None；identity必须与operation consumer variant、producer和source event相等 |
| same raw key | 不同operation或不同actor可合法复用,不得串result或conflict |
| actor normalization | API使用已认证effective actor；Consumer使用稳定system consumer principal；Job使用operator/system effective actor；不得使用process id、pod id或transport peer text |
| route binding | context operation必须等于request/envelope/job的static route；service不得另传一个可能不一致的operation name |
| digest verification | context digest必须由本地canonicalizer从validated typed input计算；若transport携带digest,必须constant-time/equivalent比较后才接受 |
| event secondary unique | Consumer reservation另建`(consumer,producer_family,source_event_ref)`唯一索引并指向original idempotency ref；dedup key漂移不能绕过同一event identity |

### 12.3 Reservation与原子reserve outcome

```rust
/// Durable lifecycle of one actor-scoped idempotency reservation.
pub enum IdempotencyReservationState {
    Reserved,
    Completed,
}

/// Durable idempotency record for commands,consumers,and jobs.
pub struct ObservationIdempotencyReservation {
    pub idempotency_ref: IdempotencyRef,
    pub scope: ObservationIdempotencyScope,
    pub request_digest: RequestDigest,
    pub inbound_event_identity: Option<ObservationInboundEventIdentity>,
    pub state: IdempotencyReservationState,
    pub stored_result_ref: Option<StoredObservationResultRef>,
}

/// Atomic repository decision. Replay,Conflict,and InFlight are request outcomes,
/// not persisted lifecycle states.
pub enum ObservationIdempotencyReserveOutcome {
    Acquired(ObservationIdempotencyReservation),
    Replay {
        idempotency_ref: IdempotencyRef,
        result_ref: StoredObservationResultRef,
    },
    Conflict {
        idempotency_ref: IdempotencyRef,
    },
    InFlight {
        idempotency_ref: IdempotencyRef,
    },
}
```

| Existing durable row | Incoming digest | Atomic outcome | Service action |
|---|---|---|---|
| absent | valid | `Acquired(new Reserved)` | only branch allowed to entermutation/job start |
| `Reserved`,same digest | same | `InFlight` | rollback current UoW;return delayed/non-retryable state-change surface |
| `Reserved`,different digest | different | `Conflict` | rollback;old row unchanged |
| `Completed`,same digest,result exists | same | `Replay` | rollback;load exact compatible stored surface |
| `Completed`,different digest | different | `Conflict` | rollback;never exposeold result ref as new result |
| `Completed`,same digest,result missing/wrong | same | repository error or replay then compatibility failure | consistency failure/manual;never rerun |

Consumer secondary-index collision在同一atomic reserve中处理:若existing event identity指向same digest,按原reservation返回Replay/InFlight；若digest不同,返回Conflict并映射Rejected/Quarantined。不得创建alias result、覆盖原dedup key或把source event identity降级为自由字符串。

`Replayable`和`Conflict`不再是durable `IdempotencyReservationState`。它们描述一次incoming request的判断；把它们写回reservation会让duplicate读请求修改幂等truth,也会掩盖原`Completed`状态。

### 12.4 Stored replay compatibility

`StoredObservationResult`在现有字段之外必须增加:

```rust
pub struct StoredObservationResult {
    pub result_ref: StoredObservationResultRef,
    pub idempotency_ref: IdempotencyRef,
    pub operation_name: ObservationOperationName,
    pub actor_ref: ActorSafeRef,
    pub request_digest: RequestDigest,
    pub public_result_ref: BodyFreeRef,
    pub disposition: OperationResultDisposition,
    pub replay_surface: StoredObservationReplaySurface,
    pub stored_at: ObservedAt,
}
```

Replay前必须按以下顺序fail closed校验:

1. reservation仍为`Completed`,并指向requested `result_ref`；
2. result的`idempotency_ref`、`operation_name`、`actor_ref`、`request_digest`与scope/reservation逐项相等；
3. `result_kind`等于operation family期待的CommandResult/CommandRejection/ConsumerReceipt/JobReport；
4. schema version受当前decoder支持,serialized surface digest与stored digest相等；
5. body-free decoder不产生raw body、credential、真实evidence alias、verdict或signoff字段。

任一失败映射`CompletedReservationResultMissing`、`StoredResultKindMismatch`或`PersistenceInvariantViolation`,不得回查current truth重建surface。

## 13. Stable digest规范

### 13.1 Canonical encoding

| 类型 | Canonical rule |
|---|---|
| enum | 编码稳定variant discriminator,不能只编码display text |
| typed ref/newtype | 编码owner type discriminator + validated opaque value |
| `Option<T>` | 显式编码`Absent`或`Present(value)`；缺失不等于empty/default |
| ordered list | 保留validated request order；只有协议明确顺序影响语义时使用 |
| set-like list | validate,按typed canonical bytes排序去重；incoming duplicate item为invalid或canonical no-op按DTO规则 |
| boolean/number | 使用固定canonical representation；不得locale/string format漂移 |
| body-free snapshot | 编码exact typed refs/states/digest markers；不得读取或hash外部正文 |
| version | 只有协议输入的external/source semantic version或明确expected version才可编码；repository version绝不来自request |

Digest schema必须有独立版本,算法/serializer binding由Step 14配置与迁移兼容策略承接。算法替换不得让既有reservation在保留窗口内无法replay；同一schema version跨fake/durable/entry必须产生相同canonical bytes和digest。

### 13.2 Global include / exclude

| Include | Exclude |
|---|---|
| `ObservationOperationName` family + exact variant | raw idempotency key itself |
| effective `ActorSafeRef` | metadata/request/received/current time |
| validated route-bound typed refs、intent、state、reason、scope和safe marker | metadata trace ref、transport request/message id |
| Consumer source event/source/producer/schema/source-version + typed payload | `occurred_at`、bus offset、ack id、delivery attempt |
| Job input exact scope/cursor/page/filter/target/consumer fields | `job_execution_ref` / `JobRunRef`、scheduler attempt、retry counter、claim/fence token |
| explicit body-level semantic trace ref,仅当DTO将其作为domain relation输入 | API metadata trace ref、span id或telemetry-only correlation |
| explicit visibility/policy/input refs that changeresult/work-set | adapter endpoint、product name、raw response、secret |

`requested_at window`不得进入任何Job key或digest。它既不是幂等窗口,也不能证明同一work-set；幂等窗口是reservation保留策略,只由Step 14/`04`定义,不改变same-key语义。

## 14. Command幂等键表

所有Command的raw key均来自`ObservationCommandMetadata.idempotency_key`，logical key均为`Command(exact variant) + effective actor_ref + raw key`。表中digest字段是在全局固定包含operation/actor之外的Command body stable input；metadata `trace_ref`、`request_digest`、`requested_at`不重复进入material。若Command body自己含语义性`trace_ref`,只按body字段编码。

| Command | Stable digest fields | Canonical detail | Duplicate replay surface |
|---|---|---|---|
| `SubmitObservationMaterial` | `source_ref`;`source_family`;`submission_purpose`;`safe_summary_ref`;`redaction_marker` | 两个Option显式Absent/Present；不得hash source body | stored `ObservationCommandResponse<ObservationReceiptCommandResult>` or durable rejection |
| `RecordSafetyDisposition` | `receipt_ref`;`disposition_state`;`redaction_marker`;`sanitized_summary_ref`;`quarantine_reason` | summary/reason Option独立编码；redaction marker是typed marker | stored `ObservationCommandResponse<SafetyDispositionCommandResult>` or rejection |
| `BindCorrelationContext` | `receipt_ref`;body `trace_ref`;`causation_ref`;`source_ref`;`correlation_seed` | body trace是semantic relation；metadata trace仍排除 | stored `ObservationCommandResponse<CorrelationContextCommandResult>` or rejection |
| `RecordSafeSignal` | `correlation_context_ref`;`signal_kind`;`summary_ref`;`runtime_signal_ref`;`rollup_window_ref` | optional runtime/window显式编码；不含raw log/metric/trace | stored `ObservationCommandResponse<SafeSignalCommandResult>` or rejection |
| `AppendAuditProjection` | `subject_ref`;`correlation_context_ref`;`source_audit_ref`;`audit_action_summary_ref`;`visibility` | visibility完整typed surface canonical化；不含audit body | stored `ObservationCommandResponse<AuditProjectionCommandResult>` or rejection |
| `LinkBodyFreeEvidence` | `projection_ref`;`boundary_ref`;`digest_summary`;`evidence_purpose` | boundary保留owner discriminator；digest只证明body-free linkage | stored `ObservationCommandResponse<EvidenceLinkageCommandResult>` or rejection |
| `PrepareReportHandoff` | `handoff_scope_ref`;完整`evidence_index_input`;`consumer_ref`;`visibility` | input内linkage/audit/gap refs按set排序去重；input ref/scope/visibility均编码；不重查current relation | stored `ObservationCommandResponse<ReportHandoffCommandResult>` or rejection |
| `EvaluateAuthenticityHint` | `handoff_ref`;`evidence_index_input_ref`;`gap_refs`;`evidence_origin` | gap refs set canonical；origin不是verdict | stored `ObservationCommandResponse<AuthenticityHintCommandResult>` or rejection |
| `SetRetentionMarker` | `protected_ref`;`retention_purpose`;`hold_reason`;`release_reason` | hold/release Option都编码；非法双intent在digest前reject | stored `ObservationCommandResponse<GuardCommandResult>` or rejection |
| `ProtectActiveReference` | `protected_ref`;`consumer_ref`;`protection_reason` | consumer是boundary ref,不是truth owner | stored `ObservationCommandResponse<GuardCommandResult>` or rejection |
| `DefineReplayScope` | `target_refs`;`allowed_effect`;`boundary_constraint_ref`;`replay_purpose` | target set canonical sorted unique/non-empty；禁止source-repair effect | stored `ObservationCommandResponse<GuardCommandResult>` or rejection |
| `RecordNoWriteViolation` | `trigger_context_ref`;`attempted_write_target`;`violation_reason` | forbidden target保留typed owner；不含attempted body | stored `ObservationCommandResponse<GuardCommandResult>` or rejection |
| `RecordGapState` | `source_ref`;`gap_kind`;`degraded_reason`;`limited_consumption_allowed` | optional degraded reason独立；false不等于missing | stored `ObservationCommandResponse<GapStateCommandResult>` or rejection |
| `PrepareExternalAuditExport` | `export_scope_ref`;`consumer_ref`;`export_view_ref`;`visibility` | view ref + captured visibility决定准备结果；不含external target config | stored `ObservationCommandResponse<ExternalAuditExportCommandResult>` or rejection |
| `RegisterReferenceSnapshot` | `subject_ref`;`safe_summary_ref`;`freshness`;optional source version after protocol回填 | source version存在时绑定same producer/source；不使用requested time | stored `ObservationCommandResponse<ReferenceSnapshotCommandResult>` or rejection |
| `UpdateReferenceSnapshotState` | `snapshot_ref`;`state`;`safe_summary_ref`;`reason_ref`;optional source version after protocol回填 | source version用于out-of-order guard,不替代repository version | stored `ObservationCommandResponse<ReferenceSnapshotCommandResult>` or rejection |

Command duplicate规则:

- `Replay`分支返回原exact response，包括原`result_ref`、outcome、result、changed/outbox/gap refs和error surface；response outcome在entry映射为`DuplicateReplayed`,但不得伪造新的changed/outbox refs。
- durable rejection只有在Step 09/11已有正式accepted marker/quarantine/gap/no-write flow并保存exact rejection surface时才可replay；普通pre-UoW rejection不创建reservation/result。
- same key different digest不允许caller用新key绕过同一logical policy；新key只代表新operation attempt,仍需从current state重跑全部guard。
- business unique conflict不从current row组装“看似duplicate”的成功response。

## 15. Inbound Consumer幂等键表与乱序保护

### 15.1 Shared envelope material

所有Consumer的raw key来自`ObservationInboundEventEnvelope.dedup_key`，effective actor是按consumer route配置并验证的稳定system principal。Global digest material为:

```text
InboundConsumer(exact variant)
+ system_actor_ref
+ producer_family
+ source_event_ref
+ source_ref
+ schema_version
+ optional source_version_ref
+ typed payload canonical fields
```

`dedup_key`、`occurred_at`、metadata `trace_ref`、bus offset、message id、delivery attempt和ack状态排除。`occurred_at`只能作为外部陈述时间或safe display input,不能决定乱序winner。

### 15.2 Consumer matrix

Atomic reserve前必须先应用 Step 08 的 total static producer map；这张表同时固定 secondary identity 中 `producer_family` 的合法值：

| Consumer | Required `ObservationProducerFamily` |
|---|---|
| `ConsumeBusObservationMaterial` | `Bus` |
| `ConsumeSourceAuditMaterial` | `SourceOwner` |
| `ConsumeIdentityObservationContext` | `Identity` |
| `ConsumeGovernanceAuditContext` | `Governance` |
| `ConsumeArtifactEvidenceContext` | `Artifact` |
| `ConsumeRuntimeSignalSummary` | `Runtime` |
| `ConsumeSandboxSignalSummary` | `Sandbox` |
| `ConsumeArchiveHandoffFeedback` | `Archive` |
| `ConsumeReportConsumerFeedback` | `ReportConsumer` |

`ObservationInboundEventIdentity.producer_family`、envelope producer、optional `ObservationSourceVersionRef.producer_family`和validated Consumer binding必须exact相等。任一不等时在digest / reserve前拒绝；不得以同一个`source_event_ref`换producer namespace、按payload source family替代producer，或为错误producer创建reservation alias。

| Consumer | Payload stable fields | Local conflict resource | Duplicate / old-version behavior |
|---|---|---|---|
| `ConsumeBusObservationMaterial` | `source_family`;`submission_purpose`;`safe_summary_ref`;`redaction_marker` | current receipt/safety by source/purpose | same digest replay stored receipt；older source version no-op/delayed,不重复intake |
| `ConsumeSourceAuditMaterial` | `source_audit_ref`;`subject_ref`;`correlation_context_ref`;`audit_action_summary_ref`;`source_family` | audit projection/source relation | replay；older source version不append或倒退projection |
| `ConsumeIdentityObservationContext` | `subject_ref`;`safe_summary_ref`;`freshness` | current reference snapshot by subject | replay；older version no-op；uncomparable version显式stale/degraded |
| `ConsumeGovernanceAuditContext` | `governance_evidence_ref`;`digest_summary`;`visibility` | reference/evidence marker | replay；same ref different digest conflict/quarantine |
| `ConsumeArtifactEvidenceContext` | `artifact_evidence_ref`;`digest_summary`;`evidence_purpose`;`visibility` | linkage/reference snapshot | replay；old version不覆盖visibility/snapshot |
| `ConsumeRuntimeSignalSummary` | `runtime_signal_ref`;`signal_summary_ref`;`signal_kind`;`correlation_context_ref` | signal/reference/correlation relation | replay；old version不创建new signal或倒退snapshot |
| `ConsumeSandboxSignalSummary` | `sandbox_signal_ref`;`receipt_ref`;`signal_summary_ref`;`safety_state` | receipt/safety/signal marker | replay；terminal safety不被old feedback覆盖 |
| `ConsumeArchiveHandoffFeedback` | `archive_handoff_ref`;`handoff_ref`;`delivery_result`;`feedback_summary_ref` | handoff lifecycle/delivery marker | replay；old version不把Delivered退回Failed/Pending |
| `ConsumeReportConsumerFeedback` | `consumer_ref`;`delivery_ref`;`delivery_result`;`gap_kind` | peripheral delivery/gap | replay；old version不倒退delivery或重新打开已被newer version关闭的gap |

每个Consumer的duplicate replay surface都是stored exact `ObservationConsumerReceipt`。Same dedup key/different digest按Step 12映射为Rejected或Quarantined,不解析/重放payload,不覆盖旧receipt。Unsupported schema在payload parse与reserve前返回`UnsupportedSchema`,因此其digest最多使用已验证envelope header；当前设计选择不为其创建durable reservation/result。

### 15.3 `ObservationSourceVersionRef`

```rust
/// Opaque body-free version marker asserted by one producer for one source.
pub struct ObservationSourceVersionRef {
    pub producer_family: ObservationProducerFamily,
    pub source_ref: ObservationSourceRef,
    pub version_token: OpaqueSourceVersionToken,
}
```

| Rule | Contract |
|---|---|
| origin | 只能来自trusted event/resolver boundary；不得由`occurred_at`、local clock、schema version、repository version、cursor或digest生成 |
| comparison | 默认只支持equality；若该producer adapter声明并验证typed monotonic comparator,可得Older/Equal/Newer；不同producer/source为Uncomparable |
| missing | producer无version时envelope为None；consumer仍可dedup,但不得宣称out-of-order monotonic guarantee；受影响snapshot/projection必须保留explicit degraded/freshness evidence |
| equal | same logical source version + same payload digest为duplicate/no-op；different payload digest为producer inconsistency/quarantine |
| older | return stored/no-op/delayed surface according operation；不得写snapshot/projection/outbox normal event |
| newer | 仍需local CAS/state matrix；source version不替代`ObservationRepositoryVersion` |

Inbound envelope必须增加`source_version_ref: Option<ObservationSourceVersionRef>`；`ReferenceSnapshotState`和相关refresh record保存最后accepted marker。Step 14只能绑定per-producer comparator capability,不能把unknown/missing version默认解释为newer。

## 16. Operations Job幂等键表

所有Job raw key来自`ObservationJobMetadata.idempotency_key`，logical key为`Job(exact variant) + effective actor_ref + raw key`。`job_execution_ref`只用于一个已接受execution的local report lookup/runner correlation,不进digest,不充当幂等key,也不是真实external run id。

| Job | Stable digest fields | Canonical work-set / plan rule | Duplicate replay surface |
|---|---|---|---|
| `PublishObservationOutbox` | `cursor`;`limit`;`event_filter` | filter set canonical；start UoW从eligible page冻结exact outbox refs + payload digest/event token | stored response/report；不重新list/publish |
| `RebuildObservationReadModels` | `target_ref`;`scopes`;`replay_scope_ref`;`diagnostic_visibility_scope_ref`;`source_cursor` | scopes typed set canonical且与immutable target binding完全一致；one item per scope | stored response/report；不重新capture/rebuild |
| `RebuildSignalRollups` | `scope`;`signal_cursor`;`window_refs` | window set canonical；若empty由scope list解析,解析结果必须在start冻结 | stored response/report；不重新list/rebuild |
| `RefreshReferenceSnapshots` | `scope`;`freshness_policy_ref`;`snapshot_refs` | explicit refs set canonical；empty/partial scope list在start冻结snapshot ref + observed version | stored response/report；不重新resolve |
| `ScanObservationGaps` | `scan_scope_ref`;`expected_source_refs`;`visibility_scope_ref` | expected source set canonical；scope-expanded candidates在start冻结 | stored response/report；不重新scan/open gap |
| `CoordinateObservationReplay` | `replay_scope_ref`;`target_ref`;`no_write_guard_ref` | load Approved immutable replay scope；freeze observation-side targets only | stored response/report；不重新coordinate或修source |
| `PrepareReportHandoffDelivery` | `handoff_scope_ref`;`handoff_ref`;`consumer_ref` | one handoff work item；freeze exact evidence-index input/preparation intent identity | stored response/report；不重新prepare/deliver |
| `PrepareExternalAuditExportDelivery` | `export_scope_ref`;`consumer_ref`;`preparation_ref` | one export work item；freeze exact view/preparation/delivery intent | stored response/report；不重新prepare/deliver |
| `RebuildPeripheralViews` | `consumer_scopes`;`source_cursor` | consumer scope set canonical；freeze exact view candidates under captured source position | stored response/report；不重新list/rebuild |

Job key/digest rules:

1. duplicate terminal report不进入Job body,不获取new claim,不读取candidate repository,直接校验并replay stored surface。
2. same key/digest nonterminal execution不是普通duplicate replay；它进入§18的fenced resume判断,不能创建第二report或新work-set。
3. operator明确要求从current state重新计算时必须使用new idempotency key和new `job_execution_ref`,并接受new digest/work-set；不得编辑old terminal report。
4. target/scopes/input变化必须产生different digest；same key因此Conflict。
5. `requested_at`、`job_execution_ref`、claim token、attempt counter、current time、retry schedule全部排除。
6. `limit`、cursor和explicit source cursor会改变candidate set或输出,因此属于digest；Step 14可校验上限但不能在reserve后悄悄截断。

## 17. 重复与in-flight处理矩阵

| Phase / existing state | Incoming | Required behavior | Public / runner surface | Durable write |
|---|---|---|---|---|
| pre-dispatch invalid route/metadata/schema/digest | any | reject beforeUoW | invalid/unsupported | none |
| no reservation | valid | atomic `Acquired`;run formal flow | normal outcome | reservation staged/committed perflow |
| `Reserved`,same digest,active valid claim/first writer | same operation/actor/key | `InFlight`;do not enter body | Command delayed;Consumer delayed/no ack policy;Job already running | none in incoming attempt |
| `Reserved`,same digest,no active claim,Command/Consumer single-UoW outcome unknown | same | do not acquire by timeout alone;probe UoW/result | `CommitOutcomeUnknown` / manual | probe is read-only |
| `Reserved`,same digest,staged Job has valid plan/report | same | acquire new fenced execution claim if prior claim expired/released | resume current execution | claim CAS only |
| `Reserved`,different digest | different | `Conflict`;no body | `IdempotencyConflict` | old row unchanged |
| `Completed`,same digest,compatible result | same | `Replay`;rollback incoming UoW;decode exact surface | DuplicateReplayed / Duplicate | none |
| `Completed`,different digest | different | `Conflict`;no result exposure | conflict/rejected/quarantined | none |
| `Completed`,same digest,result missing/wrong/corrupt | same | fail closed | consistency failure/manual | none except independent operations diagnostic |
| idempotency store unavailable | any write family | no mutation/body | dependency unavailable/delayed | none |
| Query repeated | no key | normal current read | current authorized surface | none |
| outbox item alreadyPublished/DeadLettered | scan/resume sees item | classify terminal,do notpublish | item skipped/terminal in report | report classification only under fence |
| external markerDelivered + same intent | resume sees marker | no delivery call;finalize/report as needed | finalize-only/replay | local finalize only |

### 17.1 `IdempotencyInFlight` error回填

`ApplicationError`增加:

```rust
/// Another execution currently owns the same operation,actor,key,and digest.
IdempotencyInFlight,
```

| Context | Mapping | Recovery |
|---|---|---|
| Command | `Delayed`,public `DependencyUnavailable` with body-free operation surface ref | `RetryAfterStateChange`,public `retryable=false`;wait forreservation/report state change |
| Consumer | `Delayed`;worker does not applypayload,ack/retry由transport binding后续决定 | `RetryAfterStateChange`;same dedup redelivery later |
| Job | runner reportsalready-running/in-progress without fabricated Job response if no legalreport surface | resume only throughexecution claim rules |

该variant不等价`RepositoryUnavailable`，也不等价`VersionConflict`。它证明同一logical operation已有owner,所以不得立即loop、换key、reload business row或启动第二writer。

### 17.2 Result replay priority

当repository返回`Replay(result_ref)`时,service必须先rollback incoming UoW,再通过read-only result repository读取和验证。若rollback outcome unknown,不得直接返回replay,因为incoming transaction visibility可能不确定；按Step 12进入`RollbackFailed`/manual。Result验证通过后entry可映射duplicate outcome,但authorization/route-level actor binding仍必须来自本次validated entry,不能把stored actor当新认证结果。

## 18. Staged Job immutable plan与fenced重入

### 18.1 Durable execution objects

```rust
/// Stable identity of one accepted local operations-job execution.
pub struct ObservationJobExecutionRef(pub JobRunRef);

/// Stable identity of one durable immutable execution plan.
pub struct ObservationJobExecutionPlanRef(pub BodyFreeRef);

/// Monotonic fencing token issued whenever an execution or item claim is acquired.
pub struct ObservationFencingToken(pub u64);

/// Finite global work identity shared across competing job executions.
pub enum ObservationJobWorkKey {
    Outbox(OutboxRecordRef),
    ProjectionScope(ObservationProjectionScope),
    SignalRollup(SignalRollupWindowRef),
    ReferenceSnapshot(ReferenceSnapshotRef),
    GapSource(GapSourceRef),
    ReplayTarget(MaintenanceTargetRef),
    ReportHandoff(ReportHandoffRecordRef),
    ExternalExport(ExternalAuditExportPreparationRef),
    PeripheralScope(PeripheralConsumerScopeRef),
}

/// Exact durable classification material folded into the public job report.
pub struct ObservationJobPlanItemOutcome {
    /// Local body-free refs changed or verified by this item.
    pub affected_refs: BodyFreeRefSet,
    /// Existing body-free refs whose item processing failed.
    pub failed_refs: BodyFreeRefSet,
    /// Gaps that explain missing,unsafe,or not-visible item material.
    pub gap_refs: GapStateRefSet,
    /// Durable progress,preparation,receipt,or equivalent-effect refs.
    pub progress_refs: BodyFreeRefSet,
    /// Typed failure or block reason when required by the item state.
    pub failure_reason: Option<JobFailureReason>,
    /// Digest over item state,canonical refs,and typed failure reason.
    pub outcome_digest: DigestSummary,
}

/// One frozen work item plus its current durable classification.
pub struct ObservationJobPlanItem {
    /// Global typed identity used for cross-execution item claims.
    pub work_key: ObservationJobWorkKey,
    /// Stable digest of the exact frozen input for this item.
    pub planned_input_digest: RequestDigest,
    /// Local owner version observed when the plan was materialized,when applicable.
    pub observed_version: Option<ObservationRepositoryVersion>,
    /// Current coordination state.
    pub state: ObservationJobPlanItemState,
    /// Current exact classification;None only while no finalizable outcome exists.
    pub outcome: Option<ObservationJobPlanItemOutcome>,
}

/// Durable coordination state of one item in an accepted immutable job plan.
pub enum ObservationJobPlanItemState {
    /// The item is frozen in the plan and has not acquired execution ownership.
    Planned,
    /// One current fenced claimant may execute or classify the item.
    Running,
    /// The item committed its intended local effect or equivalent success fact.
    Succeeded,
    /// A typed failure may permit retry while the owning report remains Draft.
    FailedRetryable,
    /// The item has a permanent failure classification for this execution.
    FailedPermanent,
    /// A policy,visibility,retention,or no-write guard blocked the item.
    Blocked,
    /// An equivalent durable terminal effect was verified without re-execution.
    SkippedTerminal,
}

/// Immutable work-set plus mutable item classifications for one accepted job.
pub struct ObservationJobExecutionPlan {
    pub plan_ref: ObservationJobExecutionPlanRef,
    pub execution_ref: ObservationJobExecutionRef,
    pub idempotency_ref: IdempotencyRef,
    pub operation_name: ObservationJobOperation,
    pub request_digest: RequestDigest,
    pub config_snapshot: JobExecutionConfigSnapshot,
    pub plan_digest: RequestDigest,
    pub items: Vec<ObservationJobPlanItem>,
}

/// Durable ownership of one execution or one global work item.
pub struct ObservationExecutionClaim {
    pub execution_ref: ObservationJobExecutionRef,
    pub work_key: Option<ObservationJobWorkKey>,
    pub fencing_token: ObservationFencingToken,
    pub state: ObservationExecutionClaimState,
}

pub enum ObservationExecutionClaimState {
    Active,
    Released,
    Expired,
}
```

`ObservationJobExecutionPlan.items`按typed `ObservationJobWorkKey` canonical bytes排序且无重复。`plan_digest`覆盖operation、request digest、完整canonical `JobExecutionConfigSnapshot`和每个item的work key / planned input digest / observed version；它不包含claim token、worker id、clock或attempt count。Plan的work-set、config snapshot与item planned input immutable，只有item state和structured outcome可通过CAS推进。Snapshot缺失、损坏或digest profile未知时停止为consistency/manual recovery，不能从current config补造。

`ObservationJobPlanItemOutcome`是report completeness的可编码来源:

- refs均canonical sorted/unique，`outcome_digest`覆盖item state、all refs和typed failure reason；
- `Planned`初始`outcome=None`；`Running`不得被finalize；
- `Succeeded`要求`failed_refs`为空且`failure_reason=None`；
- `FailedRetryable`、`FailedPermanent`和`Blocked`要求typed failure reason，gap/failed/progress refs按flow存在性保存；
- `SkippedTerminal`必须在affected/progress refs中指出已验证的equivalent durable owner/marker，不得空口声称成功；
- retryable item下一attempt可在fresh claim下推进state/outcome，但work key/planned digest/observed version不变，前次attempt history由既有append-only execution/maintenance/delivery record承载；
- finalize要求没有`Planned`/`Running`，并从每个current finalizable item outcome canonical fold出report的affected/failed/gap/progress sets和failure summary；report多一项、少一项或reason不兼容均为consistency failure。`FailedRetryable`在report仍Draft时可按policy/fresh claim重试；terminal report提交后整个plan封存。

### 18.2 Plan materialization table

| Job | Plan materialization | Global work key | Planned input digest至少覆盖 |
|---|---|---|---|
| `PublishObservationOutbox` | eligible Pending/explicitly retryable Failed page with exact stored snapshot | `Outbox(outbox_ref)` | effect binding ref,event ref/name,subject,schema,payload snapshot ref+digest,committed cursor,observed row version |
| `RebuildObservationReadModels` | request canonical bound scopes | `ProjectionScope(scope)` | target,binding digest,scope,visibility scope,replay scope,minimum cursor |
| `RebuildSignalRollups` | explicit windows or scope-expanded exact windows | `SignalRollup(window_ref)` | rollup scope/window,signal minimum cursor,observed version |
| `RefreshReferenceSnapshots` | explicit/scope-expanded snapshots | `ReferenceSnapshot(snapshot_ref)` | refresh scope,freshness policy,snapshot ref,last source version/local observed version |
| `ScanObservationGaps` | exact expected/scoped body-free sources | `GapSource(source_ref)` | scan scope,source ref,visibility scope,current gap version if any |
| `CoordinateObservationReplay` | Approved replay scope's exact observation-side targets | `ReplayTarget(target_ref)` | replay scope,target,no-write guard,retention/protection snapshot refs |
| `PrepareReportHandoffDelivery` | one handoff | `ReportHandoff(handoff_ref)` | effect binding ref,handoff scope,consumer,evidence-index input ref,readiness state/version,preparation/delivery intent tokens |
| `PrepareExternalAuditExportDelivery` | one export preparation | `ExternalExport(preparation_ref)` | effect binding ref,export scope,consumer,view/preparation/delivery refs+versions,preparation/delivery intent tokens |
| `RebuildPeripheralViews` | exact consumer scopes | `PeripheralScope(scope_ref)` | scope,source minimum cursor,current view/dependency position/version |

Plan creation rules:

1. Entry validation、operation context和request digest完成后begin Job start UoW。
2. `reserve_or_load`必须先返回`Acquired`；Replay/Conflict/InFlight不允许list candidates。
3. 在start UoW内解析并冻结完整bounded work-set与operation-specific `JobExecutionConfigSnapshot`；external effect必须按typed event/consumer subject解析exact binding。超界、分页不完整、binding不唯一或依赖未知必须回滚,不能提交partial plan后声称完整。
4. 创建所有item为`Planned + outcome=None`的plan、Draft report、必要target binding/maintenance/progress；完整config snapshot随plan保存并进入plan digest，再保存plan ref到report/idempotency execution linkage。
5. start commit成功后才允许item claim和external call。

现有`ObservationJobReportDraft`必须增加`execution_ref`、`plan_ref`、`plan_digest`和`fencing_token`/last accepted execution fence。现有report set仍是public/report摘要,plan item才是exact completeness owner；finalize要求没有`Planned`/`Running`，每个item恰好一个valid structured outcome并与report refs/reason一致。

### 18.3 Claim / fencing repository contract

```rust
pub trait ObservationJobExecutionRepository {
    async fn get_plan(
        &self,
        plan_ref: ObservationJobExecutionPlanRef,
    ) -> Result<Option<Versioned<ObservationJobExecutionPlan>>, ApplicationError>;

    async fn find_plan_by_execution(
        &self,
        execution_ref: ObservationJobExecutionRef,
    ) -> Result<Option<Versioned<ObservationJobExecutionPlan>>, ApplicationError>;

    async fn save_plan(
        &self,
        plan: ObservationJobExecutionPlan,
        expected_version: Option<ObservationRepositoryVersion>,
        fencing_token: ObservationFencingToken,
        uow: &dyn ObservationUnitOfWork,
    ) -> Result<(), ApplicationError>;

    async fn acquire_execution_claim(
        &self,
        execution_ref: ObservationJobExecutionRef,
    ) -> Result<ObservationExecutionClaim, ApplicationError>;

    async fn acquire_item_claim(
        &self,
        execution_ref: ObservationJobExecutionRef,
        work_key: ObservationJobWorkKey,
    ) -> Result<ObservationExecutionClaim, ApplicationError>;

    async fn renew_claim(
        &self,
        claim: ObservationExecutionClaim,
    ) -> Result<ObservationExecutionClaim, ApplicationError>;

    async fn release_claim(
        &self,
        claim: ObservationExecutionClaim,
    ) -> Result<(), ApplicationError>;

    fn register_fence(
        &self,
        claim: &ObservationExecutionClaim,
        uow: &dyn ObservationUnitOfWork,
    ) -> Result<(), ApplicationError>;
}
```

| Rule | Exact contract |
|---|---|
| execution claim | 同一execution同一时刻一个active owner；resume需要prior claim正式Expired/Released,不能按本地clock直接判失效 |
| item claim | unique by global typed `work_key`,not only `(execution,work_key)`；避免不同job key同时处理同一outbox/view/snapshot |
| fencing token | 每次successful acquire严格单调增长；renew不降低token；stale token永远不能恢复有效 |
| commit validation | item/report/marker UoW必须`register_fence`;adapter在commit验证claim仍Active且token/current owner匹配 |
| external call | claim保护本地worker竞争,不保证external exactly-once；调用仍传stable external token |
| expiration | duration/heartbeat/config在Step 14/`04`;semantic state与new token由durable adapter决定 |
| fake parity | fake必须模拟token单调、expiry/reacquire和commit-time stale claimant rejection |

`ObservationExecutionClaim`不是业务truth、stored result或验收evidence。Worker id、host、pod、thread和lease时间不进入public protocol或digest；必要operations metadata只能在Step 15定义redacted telemetry。

### 18.4 Item execution algorithm

```text
Input: execution_ref, immutable plan item

1. Load plan and Draft report;verify operation/request/plan digest compatibility.
2. If item is Succeeded/FailedPermanent/Blocked/SkippedTerminal:
     do not acquire or execute;classification is already terminal.
3. If item is FailedRetryable:
     a new attempt is allowed only when Step 12 recovery class permits and policy/config gate allows;
     planned input and work key remain unchanged.
4. Acquire global item claim;receive fresh fencing token.
5. Reload current local owner and compare planned semantic identity/version.
6. Re-run retention,visibility,no-write,state and source-version guards.
7. For external calls,pass the stable external idempotency token;do not hold DB UoW.
8. Begin short item UoW;versioned reload mutable rows.
9. Register claim fence on the UoW.
10. Save exactly one structured item outcome + local derived state/marker + lossless report classification by CAS.
11. Commit;then release claim best-effort. Commit success is authoritative even if release fails.
12. On known rollback,claim may be released;on unknown commit,probe item/report/marker before reacquire.
```

一个item发生CAS/fence conflict时必须先rollback,再由独立failure-accounting UoW使用有效execution claim和fresh report version分类。若conflict表明另execution已完成同一global work key,当前item可在验证equivalent durable outcome后标`SkippedTerminal`;不得复制另execution的stored result作为本execution结果,也不得假装本worker执行成功。

### 18.5 Resume and finalize

| Existing execution state | Resume action | Forbidden action |
|---|---|---|
| terminal report + completed idempotency | exact stored report replay | acquire claim/list/execute/finalize again |
| Draft + active claim | return in-flight | second active execution owner |
| Draft + expired/released claim + valid plan | acquire fresh execution fence,load plan/report,iterate Planned/Running recovery or policy-eligible FailedRetryable items | regenerate plan/current candidate list |
| Draft + plan/report digest mismatch | consistency failure/manual | choose either version or patchreport |
| no Planned/Running,all outcomes valid,report Draft | finalize-only under fresh execution claim；FailedRetryable items are sealed by the chosen terminal report | rerun successful/permanent/blocked/skipped items |
| some retryable items | resume only thoseitems under unchangedplan | change scope/target/visibility/policy ref under same key |
| unclassified item after crash | probe item owner/report/marker;execute only if no prior durable outcome and fresh claim obtained | assume rollback from expired lease |

Finalize UoW fixed order:

```text
1. acquire/reuse current execution claim and fencing token
2. begin UoW;load plan + report + target binding/maintenance/progress with versions
3. register execution fence
4. verify no item is Planned/Running,validate every outcome digest,and canonical-fold all current outcomes to exactly the report sets/reason
5. recheck target/member freshness and target-scope fence where applicable
6. transition report Draft -> exactly one terminal state
7. save report with expected_version and fence
8. save exact StoredObservationResult(JobReport) with operation/actor/digest/idempotency refs
9. mark idempotency Completed
10. commit
```

若finalize known failure,earlier item outcomes remain durable and只重做finalize。若outcome unknown,按§21先probe report/result/reservation；不得重开plan或重做item。

## 19. Outbox publication重入契约

### 19.1 Eligible selection without `Failed -> Pending`

`OutboxPublicationState::Failed`保留为retryable-or-terminal-classified local state,但不能由worker直接改回`Pending`。Repository必须增加显式eligible读取面:

```rust
pub enum OutboxPublicationEligibility {
    Pending,
    RetryableFailed,
}

/// An eligible publication marker paired with its immutable payload snapshot.
pub struct EligibleObservationOutboxItem {
    pub record: ObservationOutboxRecord,
    pub payload_snapshot: ObservationOutboxPayloadSnapshot,
}

pub trait ObservationOutboxRepository {
    async fn list_eligible_with_payload(
        &self,
        eligibility: Vec<OutboxPublicationEligibility>,
        cursor: Option<OutboxCursor>,
        limit: u32,
    ) -> Result<Page<Versioned<EligibleObservationOutboxItem>>, ApplicationError>;
}
```

| Stored state | Eligible? | Action |
|---|---|---|
| `Pending` | yes | plan/claim/publish exact snapshot |
| `Failed` + typed retryable publication failure | only when configured policy permits | keep stateFailed while claimed；success -> Published,failed -> replace failure classification byCAS,exhaustion -> DeadLettered |
| `Failed` + permanent classification | no | operations visible；no retry |
| `Published` | no | terminal；duplicate target receipt may only supportlocal finalize probe |
| `DeadLettered` | no | terminal；future recovery requiresnew formal protocol,not hidden reopen |

Step 10的reserved `Failed -> Pending`不在P0暴露为state transition。Retry通过eligible selection + item claim表达,避免把scan/claim事实写成业务publication state。Retry interval、attempt count和exhaustion threshold属于Step 14/`04`,但`DeadLettered`/Published不可自动重开。

### 19.2 External publication token

```rust
pub struct ObservationPublicationToken {
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub event_ref: OutboundEventRef,
    pub outbox_ref: OutboxRecordRef,
    pub payload_digest: DigestSummary,
    pub schema_version: SchemaVersion,
}

pub enum PublicationProbeOutcome {
    Published(PublicationReceipt),
    NotPublished,
    Unknown,
    Unsupported,
}
```

`ObservationEventPublisher.publish`必须接收`ObservationPublicationToken`和exact stored payload；adapter还必须提供`probe_publication(token)`，或返回formal `Unsupported`。`effect_binding_ref`只能从accepted outbox snapshot复制，并且必须与plan config snapshot中的publication binding一致。Token在all retries恒定,不得使用job execution ref、claim token、attempt id、current time或current route。

`ObservationPublicationToken.schema_version` 只允许 Step 06 `SchemaVersion::V1`，并覆盖 exact stored protocol payload schema。它不是 `DigestProfileVersion(1)`、store revision或source ordering；token / snapshot / payload header三者schema不相等时禁止external call并进入consistency/manual分类。

| External/local cut | Recovery |
|---|---|
| publish known failed before target acceptance | local marker按typed failure CAS；policy允许时future retry same token |
| publish returned existing/success receipt | short UoW markPublished；target duplicate是same external effect,not second event |
| publish success,local mark known rollback | probe same token；Published -> finalize-only,NotPublished -> policy-controlledretry,Unknown -> stop/manual |
| publish call outcome unknown | probe before any resend；no probe/Unknown -> `ProbeBeforeRetry`/manual |
| local markPublished commit unknown | first probe local row/report,then target token；不得只看adapterresponse |
| payload missing/corrupt | no external call；consistency/dead-letter path,never rebuild from current truth |
| stored binding missing/mismatch | no external call；load exact historical binding or stop manual/consistency；never use current publisher default |

## 20. Projection / rollup / reference / gap / replay重入

| Family | Stable work identity | Before work guard | Commit guard | Resume rule |
|---|---|---|---|---|
| read model/diagnostic rebuild | typed projection scope + immutable target binding | plan digest,member binding,source dependency completeness | source read fence + both view CAS + item claim fence | completedscope不重建；newer stale/fence conflict重新分类 |
| peripheral view rebuild | consumer scope | visibility/retention/no-write,source dependency | source fence + view/dependency/progress CAS + claim | old complete view保留,failed item可sameplan重试 |
| signal rollup | window ref | stored SafeSignal only,minimum cursor,window state | rollup/rebuild CAS + source position + claim | no raw metric/trace read；completed window不重算 |
| reference refresh | snapshot ref | resolver target/body-free boundary,last source version | snapshot/reference view/report CAS + claim | successful snapshot保留；retryable failure同plan重试 |
| gap scan | gap source ref | expected source/visibility/current gap | gap/degraded/transition/report CAS + claim | existing equivalent gap no-op/skip；不重复open |
| replay coordination | target ref | Approved scope,retention/no-write,observation-side effect only | coordination/maintenance/progress/report CAS + claim | blocked/succeeded target不重做；不修source truth |

Projection source capture仍必须在item UoW内完成并注册`ProjectionReadFence`。Execution claim不能替代source fence；source fence不能替代view/report version；target-level fence不能由最后一个item fence代替。三者分别保护worker ownership、source-set consistency和mutable row overwrite。

Reference source-version与repository version也不可互换:source marker回答“producer陈述的是哪个版本”,repository version回答“本地哪个writer先提交”。Newer external version在本地CAS loser时仍必须reload,不能强行覆盖winner。

## 21. Commit outcome unknown重入口径

### 21.1 Command / Consumer single-UoW

```text
Input: exact ObservationIdempotencyScope + original stable RequestDigest

1. Do not use a new key and do not start a mutation UoW.
2. Read reservation by exact operation + actor + key.
3. If Completed(result_ref):
     load and validate exact stored result;
     return replay if compatible.
4. If no reservation and backend can formally prove the original transaction aborted:
     a new same-key attempt may acquire normally.
5. If Reserved:
     the outcome remains in-flight/indeterminate;
     do not execute body unless an operation-specific durable recovery contract proves abort.
6. If different digest/conflict:
     return IdempotencyConflict.
7. If result missing/wrong/corrupt:
     consistency failure/manual.
8. If store is unavailable or no abort proof exists:
     CommitOutcomeUnknown;no automatic retry.
```

`ObservationTransactionRef`不是通用commit-status query key。当前port没有formal transaction status probe,因此service不得从transaction ref、cursor gap、clock或absence of outbox推断rollback。若未来adapter增加transaction outcome probe,必须在Step 07/11正式回填且fake parity后才能自动采用。

### 21.2 Staged Job and external finalize

| Unknown cut | Probe order | Allowed recovery |
|---|---|---|
| Job start commit | reservation -> plan -> Draft report -> target binding/progress | all compatible -> resume；all absent + formal abort proof -> new start；partial -> manual |
| item commit | plan item -> local owner/marker -> report classification -> claim fence | equivalent terminal outcome -> mark/reconcile report only；none + formal abort proof -> item retry；ambiguous -> manual |
| Job finalize commit | terminal report -> stored result -> completed reservation | complete triple -> replay；Draft + no result + formal abort -> finalize-only；partial -> manual |
| external prepare local finalize | local preparation marker -> adapter token probe -> report progress | known preparation -> reuse；NotPrepared + formal local abort -> prepare；Unknown -> manual |
| external deliver local finalize | Delivered marker -> local receipt ref -> adapter token probe -> report/result | known receipt -> finalize-only；NotDelivered + formal local abort -> deliver；Unknown -> no redelivery |

Probe只读,不得在Query path运行。Repair或classification写入必须走独立operations flow/UoW,保留typed issue refs并受no-write/retention guard；不得用probe结果反写external business truth。

## 22. Handoff / export external intent token与probe

### 22.1 Stable token schema

```rust
/// Stable local identity of one planned external effect. It is body-free and immutable.
pub struct ExternalEffectIntentRef(pub BodyFreeRef);

pub struct HandoffPreparationToken {
    pub intent_ref: ExternalEffectIntentRef,
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub handoff_ref: ReportHandoffRecordRef,
    pub evidence_index_input_ref: EvidenceIndexInputViewRef,
    pub consumer_ref: ReportConsumerRef,
    pub material_digest: DigestSummary,
}

pub struct HandoffDeliveryToken {
    pub intent_ref: ExternalEffectIntentRef,
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub handoff_ref: ReportHandoffRecordRef,
    pub preparation_ref: HandoffDeliveryPreparationRef,
    pub consumer_ref: ReportConsumerRef,
    pub material_digest: DigestSummary,
}

pub struct ExportPreparationToken {
    pub intent_ref: ExternalEffectIntentRef,
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub preparation_ref: ExternalAuditExportPreparationRef,
    pub view_ref: DashboardAlertExportViewRef,
    pub consumer_ref: PeripheralConsumerRef,
    pub material_digest: DigestSummary,
}

pub struct ExportDeliveryToken {
    pub intent_ref: ExternalEffectIntentRef,
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub preparation_ref: ExternalAuditExportPreparationRef,
    pub delivery_ref: PeripheralDeliveryRef,
    pub consumer_ref: PeripheralConsumerRef,
    pub material_digest: DigestSummary,
}
```

每个token在Job start/phase-local intent UoW中生成并保存到immutable plan item或formal local preparation record,之后所有attempt原样复用。Preparation token的`effect_binding_ref`来自start UoW按typed consumer解析的config snapshot；delivery token必须从matching preparation/intent复制同一ref。`material_digest`覆盖effect binding ref与exact body-free prepared material identity/refs，但不hash evidence body、report body、external package body、raw endpoint、credential或adapter config。`intent_ref`来自`IdGeneratorPort.new_external_effect_intent_ref`,不能由target path、timestamp、claim token或job execution ref拼接。

### 22.2 Probe outcomes and port signatures

```rust
pub enum ExternalPreparationProbe<T> {
    Prepared(T),
    NotPrepared,
    Unknown,
    Unsupported,
}

pub enum ExternalDeliveryProbe<T> {
    Delivered(T),
    NotDelivered,
    Unknown,
    Unsupported,
}

pub trait ReportHandoffDeliveryPort {
    async fn prepare_handoff(
        &self,
        token: HandoffPreparationToken,
        handoff: ReportHandoffRecord,
        input: EvidenceIndexInputView,
    ) -> Result<HandoffDeliveryPreparation, ApplicationError>;

    async fn probe_handoff_preparation(
        &self,
        token: HandoffPreparationToken,
    ) -> Result<ExternalPreparationProbe<HandoffDeliveryPreparation>, ApplicationError>;

    async fn deliver_handoff(
        &self,
        token: HandoffDeliveryToken,
        preparation: HandoffDeliveryPreparation,
    ) -> Result<HandoffDeliveryReceipt, ApplicationError>;

    async fn probe_handoff_delivery(
        &self,
        token: HandoffDeliveryToken,
    ) -> Result<ExternalDeliveryProbe<HandoffDeliveryReceipt>, ApplicationError>;
}

pub trait PeripheralExportDeliveryPort {
    async fn prepare_export(
        &self,
        token: ExportPreparationToken,
        preparation: ExternalAuditExportPreparation,
        view: DashboardAlertExportView,
    ) -> Result<PeripheralExportPackage, ApplicationError>;

    async fn probe_export_preparation(
        &self,
        token: ExportPreparationToken,
    ) -> Result<ExternalPreparationProbe<PeripheralExportPackage>, ApplicationError>;

    async fn deliver_export(
        &self,
        token: ExportDeliveryToken,
        package: PeripheralExportPackage,
    ) -> Result<PeripheralDeliveryResult, ApplicationError>;

    async fn probe_export_delivery(
        &self,
        token: ExportDeliveryToken,
    ) -> Result<ExternalDeliveryProbe<PeripheralDeliveryResult>, ApplicationError>;
}
```

### 22.3 Phase reentry matrix

| Phase durable state | Probe result | Allowed next action | Forbidden action |
|---|---|---|---|
| no local intent committed | n/a | do not call adapter；start/phase UoW must first commit intent token + effect binding | generate token inside adapter or resolve current target at call time |
| intent committed,no local preparation | `Prepared(value)` | validate token/material/binding,save Prepared marker/report progress only | call prepare again |
| intent committed,no local preparation | `NotPrepared` | call prepare once withsame token if prior local outcome formally known aborted | use new token |
| intent committed,no local preparation | `Unknown` / `Unsupported` | stop indeterminate/manual | blind prepare retry |
| local Prepared + matching preparation ref/binding | n/a | construct/reuse delivery token by copying preparation binding,do not reprepare | rebuild from current evidence/view or switch binding |
| delivery intent committed,no Delivered marker | `Delivered(receipt)` | finalize-only withsame receipt/token | deliver again |
| delivery intent committed,no Delivered marker | `NotDelivered` | deliver only if prior attempt formally known aborted andpolicy permits | change preparation/package |
| delivery intent committed,no Delivered marker | `Unknown` / `Unsupported` | stop indeterminate/manual | assume success/failure |
| local Delivered | any | no external call；report/result finalize or replay | redeliver or overwrite receipt |

Adapter configuration may state probe/idempotency capability,endpoint and timeout inStep 14/`04`,but cannot map`Unsupported` to`NotPrepared/NotDelivered`。Intent/plan/token binding mismatch或old binding unavailable时停止manual/consistency，不得解析current target继续。External receipt仍只是transport/delivery fact,不等于final verdict、验收签署、真实evidence alias或外部业务truth。

## 23. SOP总幂等键表

本表把§14~§16的逐入口明细压缩为SOP要求的统一检查面。`幂等窗口`表示reservation和stored result在逻辑上保持可重放的期间；具体保留时长属于Step 14/`04`，过期策略不得在同一窗口内改变key/digest语义或删除仍被nonterminal execution引用的记录。

| 接口 / Job / Event | 幂等键 | 幂等窗口 | 重复请求处理 |
|---|---|---|---|
| 16个Command | `(Command(exact variant),effective ActorSafeRef,ObservationCommandMetadata.idempotency_key)` | configured command reservation retention；Completed result与reservation同生命周期 | same digest Completed replay exact response；Reserved -> non-retryable InFlight/Delayed；different digest -> conflict；ordinary pre-UoW rejection不建reservation |
| 9个Inbound Consumer | `(InboundConsumer(exact variant),stable system ActorSafeRef,envelope.dedup_key)`；secondary unique `(consumer,producer_family,source_event_ref)` | 至少覆盖broker redelivery / ack ambiguity window；secondary event identity不得先于原reservation失效 | same digest replay exact receipt；Reserved不解析/重放payload；dedup-key drift解析到原reservation；different digest reject/quarantine；older source version no-write |
| 9个Operations Job | `(Job(exact variant),effective ActorSafeRef,ObservationJobMetadata.idempotency_key)` | 覆盖start、全部item、finalize和terminal report retention；nonterminal plan/report/claim引用存在时不得过期 | terminal replay exact report；nonterminal same digest按原plan fenced resume或already-running；different digest conflict；不重新list/scan/resolve/publish/deliver |
| Outbox publication item | global `ObservationJobWorkKey::Outbox(outbox_ref)`用于本地claim；external token为`(effect_binding_ref,event_ref,outbox_ref,payload_digest,schema_version)` | 从outbox commit到Published/DeadLettered及其reconciliation窗口结束 | local dual worker由claim/fence + version决胜；external retry始终same binding/token/payload；unknown先probe；Failed不回Pending |
| Projection/rollup/reference/gap/replay/peripheral item | 对应finite `ObservationJobWorkKey` + immutable plan item digest | 当前accepted Job execution及其resume/finalize窗口 | succeeded/permanent/blocked/skipped item不重做；FailedRetryable仅在Draft原plan和fresh claim下重入；source/read/version/fence任一冲突均rollback/reload，不覆盖winner |
| Handoff/export prepare/deliver phase | typed immutable `(ExternalEffectIntentRef,effect_binding_ref)` + exact local refs/material digest | intent commit到local terminal marker/report完成及外部probe窗口结束；old binding必须可解析到manual closure | Prepared/Delivered probe result只做local finalize；Not*仅在formal abort proof后same-binding/token call；Unknown/Unsupported或binding unavailable停下人工处理 |
| 14个Query | 不适用 | 不适用 | 每次读取当前committed authorized surface；不reserve、不stored replay、不写read audit/refresh/rebuild/repair |

Raw idempotency key不能单独作为repository unique key，business unique key不能替代exact replay，claim/work key也不能替代application reservation。四类identity各自解决logical request、业务对象唯一性、worker ownership和external effect去重，禁止互换。

### 23.1 五协议族 key / digest / dedup / claim / fence / token closure index

本表是 Step 13 的实现审计入口。它不替代 §14~§22 的逐入口字段和算法；任何实现都必须先从
`ObservationOperationName` 的 exact variant 落到本表，再回指对应明细。`not_applicable` 是经过边界审查后的
显式结论，不得被实现成空字符串 key、随机 token、隐式 reservation 或 telemetry write。

| 协议族 | 数量 | Logical identity / stable material | Dedup / replay | Claim / fence / token | 并发或 unknown outcome 处置 | 当前结论 |
|---|---:|---|---|---|---|---|
| Command C01-C16 | 16 | `(Command(exact variant), actor_ref, idempotency_key)`；digest 覆盖 operation、actor 与 §14 exact body semantic fields，排除 request time、metadata trace、attempt 和 repository version | 原子 `Acquired/Replay/Conflict/InFlight`；Completed 只重放 immutable stored response | 单 UoW mutation 不使用 Job claim；owned row 用 loaded repository version，outbox snapshot 用 local immutable identity | commit unknown 先 probe 原 reservation/result/owner marker；不得换 key 后 blind mutation | `pass_with_affected_open`；result/UoW 与 secondary owner affected 保留 |
| Query Q01-Q14 | 14 | `not_applicable`；query selector/page cursor 只决定本次 authorized read，不构造幂等 identity 或 stored digest | 不做 stored replay；每次返回当时 committed visibility/freshness/availability surface | 不 acquire claim/fence/token，不创建写 UoW、reservation、stored result、history、outbox、gap、refresh、rebuild 或 read-audit | 重复/并发读取可得不同 current result；consistency defect fail closed，禁止 inline repair | `pass_with_affected_open`；query carrier/visibility owner affected 保留 |
| Inbound Consumer I01-I09 | 9 | `(InboundConsumer(exact variant), system_actor_ref, dedup_key)`；secondary unique 为 `(consumer, producer_family, source_event_ref)`；digest 覆盖 validated header、source version 与 exact typed payload | same digest replay exact receipt；dedup-key drift 定位 original reservation；different digest reject/quarantine；older source version no-write | Consumer single UoW 不使用 Job claim；local row 使用 CAS，worker completion 只消费 known committed receipt | commit/ack unknown 分开；commit unknown 先 probe，ack failure 后 redelivery 走 original replay；不得 wildcard ack/retry/dead-letter | `pass_with_affected_open`；I05 payload/binding、action/outbox surface affected 保留 |
| Outbound Event E01-E12 | 12 | accepted source UoW 内冻结 `(event_ref, outbox_ref, schema_version, effect_binding_ref, payload_digest)`；payload 是 typed encoder 生成的 immutable snapshot | 不创建独立 application reservation；重复发布由同一 outbox identity、stored payload 和 publication token 去重 | J01 对 `ObservationJobWorkKey::Outbox(outbox_ref)` acquire claim/fence；external call 恒用同一 `ObservationPublicationToken` | local winner 由 claim/fence + row version 决定；external unknown 先 same-token probe；`Failed` 不回 `Pending`；禁止从 current truth 重建 payload | `pass_with_affected_open`；producer schema/binding 与 external phase affected 保留 |
| Operations Job J01-J09 | 9 | `(Job(exact variant), actor_ref, idempotency_key)`；digest 覆盖 exact input；start UoW 冻结 canonical work-set、config snapshot 与 item material | terminal replay exact report/result；nonterminal same digest 只恢复 original execution；different digest conflict | execution 与 global work item 使用 durable claim、strictly monotonic fence；publication/handoff/export 使用 frozen same-binding token | crash/resume 只处理 original plan 未分类或 typed retryable item；external unknown probe-first；terminal report 后不重做 item | `pass_with_affected_open`；J06 H13、report ref、external phase/retry accounting affected 保留 |
| **Total** | **60** | **16 + 14 + 9 + 12 + 9** | **所有可重复入口均有 exact replay/no-write 结论** | **claim/fence/token 只落到真实需要的 Job/external effect 边界** | **无 blind retry、无 current-truth payload rebuild、无 truth writeback** | **`60/60 recorded_with_affected_open`；`0/60` 无条件完成** |

Inherited affected 继续开放：`S08-E-I05-PAYLOAD-SCHEMA-01`、
`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、
`R07-EXTERNAL-PHASE-LINK-01`、`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、
`S08-CONSUMER-OUTBOX-SURFACE-01`、`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、
`S08-JOB-REPORT-REF-OWNER-01`、`S08-M1-SECONDARY-TYPE-OWNER-01` 与
`03-RPR-S09-PER-FLOW`。本 Step 不把这些项改名、关闭或降级为“实现时再定”。

## 24. 统一重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| Command/Consumer single-UoW duplicate | caller timeout、broker redelivery、ack failure | actor-scoped atomic reserve outcome；result-before-complete；exact stored replay | Replay直接返回原surface；InFlight等待状态变化；Conflict无写；commit unknown先probe exact scope/result |
| Consumer dedup-key drift | producer对同一source event换key | source-event secondary unique + original digest/state compatibility | 定位原reservation后Replay/InFlight/Conflict；不创建alias reservation/result |
| Consumer乱序 | at-least-once/out-of-order delivery | trusted producer/source comparator + `ObservationSourceVersionRef` + local CAS | older no-write；equal需digest兼容；newer可推进；unknown显式degraded，禁止按时间猜 |
| Staged Job start重入 | scheduler重复触发、start commit response丢失 | reservation、one execution、immutable canonical plan + config snapshot、one Draft report在start UoW闭合 | terminal replay；compatible nonterminal resume only from persisted snapshot；partial/mismatch或unknown且无abort proof -> manual |
| Job item crash/retry | worker崩溃、lease失效、dependency transient failure | global typed work claim、strictly monotonic fencing token、immutable item input、plan/report CAS | probe durable item/owner/report；fresh claim只处理unclassified或Draft execution中typed retryable item；terminal report后任何item不重做 |
| Job finalize重入 | all items committed后finalize失败/超时 | execution claim/fence、plan completeness、report CAS、result-before-complete | known failure只做finalize；unknown依次probe report/result/reservation；不重做item |
| 双publisher | 两个execution/worker命中同outbox | global Outbox work key、claim/fence、frozen row version、stable binding/publication token | one local winner；existing external receipt finalize-only；unknown probe；payload和binding永不重建 |
| Retryable outbox failure | dependency恢复、新publication Job | eligible selector直接读取typed retryable Failed；new execution仍冻结same stored binding/payload/token | same-binding/token retry；success -> Published；failure reclassify；exhaustion -> DeadLettered；无Failed->Pending |
| Projection/rebuild交错 | source mutation、另一rebuild、stale worker | immutable target binding、source snapshot/read fence、view/report/plan CAS、item fence | rollback item；reload current source/view/claim；old complete view保持且newer stale watermark不回退 |
| Retention/protection交错 | release与new active consumer、handoff/replay/export | marker/protection loaded versions + same-UoW recheck | loser reload后重新评估；永不执行source delete或绕过hold |
| Handoff/export prepare | adapter timeout、worker crash、local Prepared finalize failure | prepare intent-before-call、frozen binding/stable token、probe、local owner/plan/report fence | Prepared -> finalize-only；NotPrepared + abort proof -> same-binding/token prepare；Unknown/Unsupported/binding unavailable -> manual |
| Handoff/export deliver | external success、local Delivered finalize失败/unknown | delivery intent-before-call、copied binding/stable token、exact preparation、probe、marker CAS | Delivered -> finalize-only；NotDelivered + abort proof -> same-binding/token deliver；Unknown/Unsupported -> no redelivery |
| Query重复/并发 | client retry、parallel reads | committed read + visibility/freshness/availability mapping；strict no-write | 返回当次current surface；不保存旧结果、不inline repair |

## 25. 并发、幂等与重入测试切口

本Step定义可测试契约，不声称已经执行测试。Step 16应保留下列ID并扩展fixture、property和failure injection；`fake parity`表示in-memory fake与durable adapter必须得到同一分类和durable effect。

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `TC-OBS-IDEM-001` | §12~§17 Command reserve | N个parallel same scope/digest只有one Acquired；其余InFlight或commit后Replay；domain/outbox只执行一次 | application service + deterministic barrier |
| `TC-OBS-IDEM-002` | §13~§14 digest conflict | same operation/actor/key different digest返回Conflict，旧reservation/result不变且不进入domain | canonical digest unit + repository fake |
| `TC-OBS-IDEM-003` | §12.2 actor/operation scope | same raw key在different actor/operation不串result；同actor scope仍受授权检查 | repository contract + service test |
| `TC-OBS-IDEM-004` | §13 canonical digest | set/Option/enum canonical稳定；request time、metadata trace、job run、attempt、claim token不改变digest | property / golden vector |
| `TC-OBS-IDEM-RESULT-001` | §12.4 stored replay | missing/wrong idempotency ref、operation、actor、digest、kind、schema或surface digest均fail closed且不重算 | result repository + decoder contract |
| `TC-OBS-EVENT-DEDUP-001` | §15 consumer identity | exact redelivery replaysreceipt，无payload parse/resolver/state/outbox second effect | consumer service + spy ports |
| `TC-OBS-EVENT-DEDUP-002` | §12.3 secondary unique | same source event换dedup key仍定位原reservation；same digest replay/in-flight，different digest quarantine/conflict | repository concurrency contract |
| `TC-OBS-EVENT-DEDUP-003` | §15.3 source version | newer先提交后older到达不回退；equal mismatch冲突；missing/uncomparable不按occurred_at判winner | consumer/reference fake + comparator |
| `TC-OBS-JOB-IDEM-001` | §16~§18 Job start | terminal duplicate只replay report且零candidate read；nonterminal Active claim返回in-progress | job service + spy repositories |
| `TC-OBS-JOB-IDEM-002` | §18 immutable plan | resume不能增加/删除/重排item、改变planned input或读取current config替换snapshot；changed scope/input/config material under same plan conflicts | plan repository contract |
| `TC-OBS-JOB-IDEM-003` | §18 claim/fence | global same work key只有one Active claim；reacquire token严格递增；stale claimant commit为ExecutionFenceConflict | fake/durable adapter concurrency |
| `TC-OBS-JOB-IDEM-004` | §18.1/§18.4~§18.5 item/finalize | crash after item commit resumes remaining items；outcome digest tamper或report多/少ref被拒绝；no Planned/Running + Draft只finalize；report等于item outcomes canonical fold | job phase failure injection |
| `TC-OBS-COMMIT-UNKNOWN-001` | §21 | Command/Consumer unknown outcome不使用new key或blind mutation；reservation/result probe驱动Replay/InFlight/manual | UoW ambiguity simulation |
| `TC-OBS-CONC-CAS-001` | §8/§11 mutable row | stale expected version零写并返回OptimisticConflict；reload后重新跑全部guard | repository fake + durable contract |
| `TC-OBS-CONC-UNIQUE-001` | §8 create-if-absent | parallel canonical current create只有one owner；unique loser不伪装stored duplicate | repository concurrency |
| `TC-OBS-PROJ-FENCE-001` | §20 projection | capture后source revision推进使replace rollback；newer stale watermark保留；old complete bundle不部分覆盖 | projection source/store integration |
| `TC-OBS-OUTBOX-DUAL-001` | §19 | two workers same outbox只有authoritative fence可finalize；binding/payload/token完全相同；config route rotation不重定向old event；truth不回滚 | outbox + job execution fake |
| `TC-OBS-OUTBOX-FINALIZE-001` | §19/§21 | external Published后local known failure只finalize；unknown先probe；Unsupported不republish | publisher stub + UoW failure injection |
| `TC-OBS-JOB-RESUME-001` | §18 | Expired/Released claim不证明item rollback；probe equivalent terminal outcome后Skip/finalize，否则fresh claim执行 | job recovery integration |
| `TC-OBS-JOB-FINALIZE-001` | §18.5 | parallel finalizer只有one terminal report/result/complete；loser不编辑terminal report | job repository concurrency |
| `TC-OBS-CONC-RETENTION-001` | §11.2/§20 | release读取后new protection提交导致release CAS/recheck失败；无source delete | domain + repository transaction |
| `TC-OBS-JOB-HANDOFF-001` | §22/§24 | prepare/deliver intent先commit；两phase binding一致；target rotation不改old token；Prepared/Delivered probe走finalize-only；Unknown/Unsupported停止 | handoff adapter contract |
| `TC-OBS-JOB-EXPORT-001` | §22/§24 | binding/package/view refs与material digest固定；local failure不重建package、不换target或重复deliver | export adapter contract |
| `TC-OBS-QUERY-NOWRITE-001` | §7/§9.4 | repeated/parallel 14 Query无reservation/result/history/outbox/stale/refresh/rebuild/cursor写入 | query service + repository write spies |
| `TC-OBS-FAKE-PARITY-001` | §7 fake/durable parity | unique、reserve outcome、rollback invisibility、CAS、claim/fence、probe classification在fake/durable一致 | shared repository conformance suite |

§11各Command/Consumer/Job资源族中的细粒度`TC-OBS-CONC-*`、`TC-OBS-EVENT-*`和`TC-OBS-JOB-*`仍是Step 16必须展开的接口测试索引；本表列出跨接口最小门禁，不能用它删减逐资源race测试。

## 26. 前序契约回填审计

| 前序Step / 文件 | 本Step实际回填 | 当前结论 |
|---|---|---|
| Step 06 `03_ddd_step_06_object_contracts.md` | finite operation/context/scope；two-state reservation + four incoming outcomes；stored result ownership fields；source version；immutable plan/claim/fence；stable external tokens；状态闭环表移除Replayable/Conflict durable state | done |
| Step 07 `03_ddd_step_07_trait_port_adapter_contracts.md` | context factory；atomic idempotency repository；eligible outbox；Job execution repository；publisher/handoff/export token + probe ports；`IdempotencyInFlight` / `ExecutionFenceConflict` | done |
| Step 08 `03_ddd_step_08_protocol_contracts.md` | inbound/source version字段；reference Command version字段；finite route mapping；删除volatile requested-at window口径 | done |
| Step 09 `03_ddd_step_09_function_flows.md` | Command/Consumer atomic reserve；source-version guard；immutable Job plan/claim/fence；eligible outbox + stable token；handoff/export probe流程；旧调用图改为context signature | done |
| Step 10 `03_ddd_step_10_state_matrix.md` | reservation只Reserved -> Completed；incoming outcomes不持久化；Failed outbox不回Pending并支持same-token eligible retry | done |
| Step 11 `03_ddd_step_11_persistence_transaction_consistency.md` | actor/event unique stores；source-version guard；plan/claim/intent stores；accepted/publisher/Job/external transaction ordering；schema、cross-store invariant和recovery | done |
| Step 12 `03_ddd_step_12_error_recovery.md` | typed in-flight/fence errors；public/runner recovery；Job/outbox/handoff unknown/finalize branches；consistency defects | done |
| Step 14反查回填 | plan内完整config snapshot、五类external token的binding ref、material/plan digest、总幂等/重入矩阵与测试切口 | done；只加强destination immutability，不改变原幂等scope或state machine |

定义/使用闭环必须保持:

- `ObservationOperationName`只有finite variants，route wrapper只通过static mapping进入。
- `ObservationIdempotencyReserveOutcome`四个variant在Command、Consumer、Job shared flow均有分支；Query无调用点。
- `ObservationJobExecutionPlan`、`ObservationExecutionClaim`和`ObservationFencingToken`在object、port、flow、persistence、error和测试六层均有landing。
- `ObservationPublicationToken`与四个handoff/export token在port调用前均由durable local material构造，并携带与snapshot/plan/intent一致的`effect_binding_ref`；probe outcome四态不得合并。
- `IdempotencyInFlight`与`ExecutionFenceConflict`均由exact internal error驱动，不通过message text、generic CAS或generic unavailable猜测。

## 27. 后续Step承接边界

| 后续Step | 可继续定义 | 不得改写的本Step invariant |
|---|---|---|
| Step 14 配置与外部绑定 | digest algorithm/serializer binding、retention/lease/heartbeat/retry/backoff/jitter/exhaustion/batch limits、adapter capability/timeout | typed key scope、canonical include/exclude、claim durability/token monotonic、intent-before-call、probe Unknown/Unsupported fail closed |
| Step 15 可观测性与审计埋点 | redacted reserve/conflict/fence/probe/finalize signals及operations alert | telemetry不得成为truth、claim、result、acceptance evidence或retry authority；Query仍no-write |
| Step 16 测试切口 | fixture、property、barrier、failure injection、fake/durable conformance实现 | 不得把本Step测试ID写成已执行结果；必须覆盖SOP并发/幂等/重入表 |
| Step 17 实施承接 | module/file/boundary分解与实现前置gate | 不伪造实现commit/run/evidence；不把外部truth owner移入Observability |

本 Step 原始停审时尚未读取 Step 14。用户随后确认进入 Step 14 后，Step 14 仅反查回填了 immutable config snapshot / external binding propagation；未改写本 Step 的幂等scope、状态或重入门禁。当前仍由 Step 14 自身停审控制是否进入 Step 15。

## 28. 正式文档回填草稿

正式`03-详细设计.md`只能在Step 19装配。其§12至少必须保留以下结构和粒度:

```md
## 12. 并发、幂等与重入保护

### 12.1 并发资源与控制primitive
写入owned row、projection/reference、report/idempotency/outbox/external effect资源；区分CAS、unique、cursor、source fence、execution fence和external token。

### 12.2 幂等scope与stable digest
写入finite operation namespace、actor-scoped logical key、Consumer secondary event identity、canonical include/exclude和Command/Consumer/Job exact key表。

### 12.3 Duplicate、in-flight与commit unknown
写入Acquired/Replay/Conflict/InFlight、stored result compatibility、single-UoW probe顺序和Query no-write。

### 12.4 Staged Job与传播副作用重入
写入immutable plan、global typed work claim、fencing、resume/finalize、eligible outbox、publication token、handoff/export intent/probe。

### 12.5 并发与幂等测试切口
写入跨接口最小测试表并回指Step 16，不写伪造测试结果。
```

正式正文不得压缩为“使用幂等键和乐观锁”，也不得恢复raw schema、`Replayable/Conflict` durable state、pending-only publisher、`Failed -> Pending`、volatile digest、无token external call或Query write。

## 29. 待确认事项与blocker

| 项目 | 当前结论 | 是否阻塞Step 13 |
|---|---|---|
| upstream `00/01/02` truth / ownership冲突 | 未发现；本Step保持Observability只拥有观测、审计投影和technical coordination，不拥有业务truth | 否 |
| 旧正式`03`与旧Step 13内容 | historical material；旧schema-first/薄摘要/自动顺推不继承 | 否 |
| exact retention/lease/retry/backoff/exhaustion数值 | 后移Step 14/`04`，本Step已固定不可绕过的语义 | 否 |
| external adapter是否支持idempotency/probe | Step 14绑定 capability；不支持时unknown outcome必须manual，不能blind retry | 否，不阻塞design |
| 目标实现仓当前未发现 | 继续作为Step 17/`07-实施计划`实施前置gate | 否，不阻塞当前design |
| 真实实现commit、run id、evidence alias、验收签署或测试结果 | 本Step不需要且禁止伪造 | 否 |

## 30. 最终自检

| 检查项 | 当前结论 |
|---|---|
| 是否读取Step 13 SOP、书写规范5.12、Step 06~12、正式02/概要承接和L1/L0参考 | pass |
| 是否全量替换旧81行historical material而非沿用旧pass | pass |
| 是否输出SOP要求的并发场景表 | pass，§11覆盖shared、16 Command、9 Consumer、9 Job/propagation |
| 是否输出SOP要求的可计算幂等键表 | pass，§14~§16逐入口，§23统一检查面 |
| 是否输出SOP要求的重入保护表 | pass，§24 |
| 是否明确duplicate、conflict、in-flight、missing result和commit unknown | pass，§12/§17/§21 |
| 是否闭合staged Job immutable plan、claim/fence、resume/finalize | pass，§18 |
| 是否闭合outbox、projection/reference、handoff/export重入 | pass，§19~§24 |
| 是否保持body-free、no truth writeback、no signoff/no fake evidence边界 | pass |
| 是否保持14 Query no-write | pass |
| 是否完成Step 06~12前序回填 | pass，§26 |
| 是否提供可映射到Step 16的测试切口且未伪造执行结果 | pass，§25 |
| Markdown fence、旧有效口径、definition/use、trailing whitespace最终扫描 | pass；fence count even，`git diff --check` / trailing whitespace无报错，旧词命中仅historical diagnosis或明确禁止项 |
| 是否修改正式`03-详细设计.md` | no |
| 是否读取或进入Step 14 | 原始Step 13 pass时为no；当前由已获确认的Step 14反查完成binding闭环，未越过Step 14 |
| 是否发现上游blocker | 未发现新的上游 blocker；inherited upstream/internal affected 按 §23.1 保持开放 |

## 31. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| `pass_with_affected_open` | 60 协议的 key/digest/dedup/no-write、claim/fence/token、duplicate/in-flight、immutable plan、outbox/external probe 和 planned test cuts 均有可落码记录；inherited owner/payload/phase affected 未关闭，也未声称实现或测试完成 | `continue_M2_step_14;stop_after_step_15_before_step_16` |
