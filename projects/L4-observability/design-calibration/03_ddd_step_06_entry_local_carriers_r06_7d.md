# L4-observability 03-详细设计 Step 06 - R06.7-D entry-local carrier 资格与边界审查

## 1. 批次状态与写入边界

| 项 | 当前结论 |
|---|---|
| 正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 06，逐模块定义对象实现契约 |
| 修复批次 | `R06.7-D` |
| 本批状态 | `done_design_only_consumed_by_R06.7-E` |
| 本批 current source | 本文件 §§1~20 |
| 本批审查对象 | `ObservationCommandHandlerState`、`ObservationQueryHandlerState`、`OutboxPublisherLoopState`、`ProjectionWorkerLoopState`、`ObservationJobRunnerContext` |
| 本批最终资格 | 五个候选均为 `DX`；当前 stable capability 已由现有 service bundle、safe entry slice、finite handler、invocation、operation context与Operations Job承接，不新增 canonical entry state object |
| 本批不闭合（D历史边界） | `EntryDisposition` definition / owner / enum schema；trait body；public DTO；raw config；repository/schema；Step 07~19；正式 `03`；任何 `04` 文件；实现代码；其中`EntryDisposition`已由E删除 |
| 当前下一允许动作 | 停审；用户明确确认后才可进入 `R06.8` final Step 06 audit |

`DX` 是逐对象审查后的正式设计结论，不是省略对象卡。Step 06 SOP要求对象必须回到模块 capability，也要求没有独立责任的候选不能因为旧清单存在就机械落成 struct。五个候选分别在 §§6~10 回答 capability、输入、输出、per-call material、替代 owner、错误、生命周期、持久化和重开条件。

## 2. 输入、authority order 与读取记录

### 2.1 Authority order

| 顺序 | 输入 | 本批消费方式 |
|---:|---|---|
| 1 | 当前正式 `00/01/02` 与 `02` Step 12~14 | 固定 Observability 只拥有 observation-side projection / audit / coordination truth；`PublishObservationOutbox` 与全部 derived maintenance均是 Operations Job |
| 2 | Step 06 SOP、详细设计书写规范、Rust 规范 | 每个候选独立资格审查；只有 capability无法由 current owner承接时才新增对象 |
| 3 | 当前 Step 05 entry dependency boundary | `api` / `worker` / `jobs` 只解析、调度、映射并调用 assigned façade；禁止 repository、UoW、resolver、adapter、raw config、private registry |
| 4 | R06.6 application current cards | 复用 operation、context、digest、result、façade、Job plan/claim/report identity等 owner；不复制定义 |
| 5 | R06.7-A / B / C | 复用 runtime inventory、availability snapshot、technical carriers、safe entry slices、finite catalogs、registrar和complete runtime |
| 6 | 冻结 Step 07/08/09/11/12/13/14 targeted use-sites | 只用于 executable seam、DTO metadata、error、reentry与stage-13反查；冲突登记 affected-use，不反向成为 definition owner |
| 7 | L1-governance / L1-artifact Step 06 | 参考逐对象卡和明确 defer粒度；L1-artifact证明稳定 call context / receipt / report已承接时，api/worker/jobs local runtime state可以正式 defer |

### 2.2 Current owner 输入

| Capability / carrier | Current owner / source | D 批结论 |
|---|---|---|
| finite Command / Query / Consumer / Job operation | `application::operation`，R06.6-A | entry只做exact static match，不保存第二份operation state |
| per-call application context | `ObservationOperationContext` + factory | actor、trace、key、digest、source event按family一次性归一化；不需要entry context shadow |
| canonical digest | `application::digest::ObservationDigestCanonicalizer`，R06.6-F1 | entry不得自行hash；current executable seam缺口继续受控 |
| application call results | R06.6-E五类 return carrier | 当前call完成后直接映射，不保存为handler/loop state |
| entry service bundles | frozen Step 07 `ObservationApiServices`、`ObservationWorkerServices`、`ObservationJobServices` use-site | 作为stage-13 least-authority assignment候选；定义/owner须在Step 07 affected review闭合 |
| API / worker / jobs safe slices | existing `ValidatedApiEntryConfig`、C-11、C-12 | root-level immutable配置，不需要按route再包装为canonical object |
| Consumer callback | C-03~C-06 | complete delivery -> exact handler -> completion已闭合；D不新增consumer state |
| Job callback | C-07~C-10 | complete invocation -> exact handler -> result/failure已闭合；D不新增runner call wrapper |
| durable publication / maintenance | R06.6 Job plan/claim/report + formal Operations Job | entry不得建立第二条resident execution authority |
| Job identity | R06.6-D2 | public correlation=`JobRunId`；local execution=`ObservationJobExecutionRef`；real external/runtime run absent；无alias/wrapper conversion |

### 2.3 Historical material 与冲突裁定

| 旧内容 | 冲突 | 当前裁定 |
|---|---|---|
| `CommandHandlerState.last_entry_disposition` | 长期共享handler保存上一请求结果，形成跨请求数据竞争、泄漏和错误相关性 | historical invalid；结果只在当前call stack |
| `QueryHandlerState.visibility_defaults` | 静态默认可覆盖每次请求的visibility scope / consistency与application policy | historical invalid；逐请求解析 |
| `runtime_available` in API state | availability snapshot不是route state或authorization；application result已有availability/degraded surface | 不进入handler field |
| `WorkerErrorRef` / `WorkerFailureReason` | 无current owner/schema，会把typed `WorkerError`压成模糊reason/ref | 不恢复 |
| `OutboxLoopKind` / `ProjectionLoopKind` | 无current owner；把process scheduler误升为业务lifecycle | 不恢复 |
| resident `OutboxPublisherLoopState` | current formal `02`将publication定义为完整Operations Job；resident path没有Job context/plan/claim/report/stored-result闭环 | DX；publication只走Job path |
| `ProjectionWorkerLoopState.target_ref / maintenance_ref` | runtime无trigger/config/façade；会shadow durable maintenance truth | DX；maintenance只走typed Job path |
| `ObservationJobRunnerContext.job_ref: JobRunRef` | `JobRunRef`无current owner且混淆三层identity | historical invalid |
| generic `to_operation_context(digest)` | 只给digest无法证明operation/body/metadata由唯一canonicalizer校验 | 不提供shortcut；exact mapper走application-owned seam |

## 3. SOP 问题回答

### 3.1 Entry 模块必须完成哪些 capability？

| 模块 | Capability | 输入 | 输出 | Current承接主体 |
|---|---|---|---|---|
| `api` | exact Command route、protocol validation、application call、response mapping | typed Command request + root assignment | public Command response / `ApiError` | static route handler + API service bundle + application context/input seam |
| `api` | exact Query route、zero-write call、surface mapping | typed Query request + root assignment | public Query response / `ApiError` | static route handler + API service bundle + application context/input seam |
| `worker` | exact inbound Consumer callback与transport completion | C-03 delivery | C-05 completion | C-06 finite handler + inbound façade |
| `jobs` | scheduled/operator one-shot Job dispatch | C-07 complete invocation | C-08 result或C-09 failure | C-10 exact handler catalog + Operations Job application flow |
| runtime composition | enabled-set totality、least-authority assignment、all-or-nothing exposure | C-13 complete runtime | API root、opaque Consumer set、Job schedule/one-shot root | stage-13 composition；不是五个candidate state object |

### 3.2 为什么不能以“入口总要有state”为理由保留候选？

Rust web/runtime framework可能要求一个 local struct用于框架泛型，但框架承载形态不自动成为 Step 06 canonical object。只有当它拥有稳定语义、不变量、独立生命周期或不能由既有bundle/carrier表达的能力时，才值得进入对象合同。当前五个候选要么只是把已有字段重新打包，要么会创建第二执行authority，因此不具备资格。

### 3.3 DX 后实现是否仍可落码？

可以，但必须先关闭 §§11~15 的 executable affected seams。实现者按 static exact handler、root-level immutable bundle和per-call local variables落码；不得自行发明五个public/canonical struct。若具体framework必须有private state wrapper，它只能是crate-private wiring detail，字段必须等于E/R06.8最终least-authority assignment，不能进入public API、persistence、protocol、telemetry identity或business truth。

## 4. D 批资格与 owner 总账

| ID | 候选 | A 批暂定 | D 批最终资格 | Stable capability owner | 结论 |
|---|---|---|---|---|---|
| D-01 | `ObservationCommandHandlerState` | `FC` | `DX` | API root assignment + exact route function + application context/input seam | 无独立state；`last_entry_disposition`有害，operation/config/service已由root承接 |
| D-02 | `ObservationQueryHandlerState` | `FC` | `DX` | API root assignment + exact route function + read façade | 无独立state；visibility/consistency必须per-call，Query保持zero-write |
| D-03 | `OutboxPublisherLoopState` | `FC` | `DX` | `PublishObservationOutbox` Operations Job | resident loop与formal Job authority冲突且缺plan/report闭环 |
| D-04 | `ProjectionWorkerLoopState` | `FC` | `DX` | eight maintenance Operations Jobs | 无requirement/config/trigger/façade；不得shadow maintenance truth |
| D-05 | `ObservationJobRunnerContext` | `FC` | `DX` | C-07 invocation + C-10 exact handler + application operation context | wrapper重复已有完整carrier；旧JobRunRef错误 |
| D-06 | `EntryDisposition` | `UR` | `HX` after E | none | D未发现任何candidate需要它；E完成重复层审计后直接删除，禁止同义alias/wrapper |

本表 supersede R06.7-A §6.4 的 provisional `FC`。A 的任务是列全候选，D 的任务是证明是否应该落成对象；因此资格变化不是跨Step反向修改上游truth，而是既定批次的审查结果。

## 5. Entry 共同执行规则

### 5.1 Per-call pipeline

```text
stage-13 exact static handler
  -> typed protocol validation
  -> public-name / operation / concrete-body exact match
  -> application-owned typed digest material
  -> ObservationDigestCanonicalizer
  -> supplied-digest verification where applicable
  -> ObservationOperationContextFactory
  -> operation-specific application input
  -> assigned application façade / exact Job handler
  -> application result
  -> exact public response / C completion / C-08 result mapping
```

除root-level immutable handles与validated bounds外，operation context、digest candidates、request input、application result、entry classification和public response都只是一次call的local value。它们不能写回framework state、全局registry、下一次request或runtime config。

### 5.2 Same-assembly 与 least-authority

本段是 R06.7-D 历史问题陈述，已由 R06.8-B §8 supersede。Current stage
13由每个独立 binary 的匹配具名 built-runtime分别形成一个root；三类
assignment的字段约束仍由下表保留，但它们不在同一 runtime/进程中并存，
也不形成跨进程联合激活。

| Root | 可接收 | 不可接收 |
|---|---|---|
| API | enabled Command/Query set、API bounds、truth-write/read façade、context/input seam | inbound/publication/maintenance façade、registrar、repository、adapter、raw config |
| Worker | enabled Consumer metadata、inbound façade、context/input seam、prebuilt inbound registrar | maintenance/Job schedule、direct publication repository/publisher pair、raw transport/private slot |
| Jobs | enabled Job set、job timeout、exact handler set、prebuilt schedule registrar | Consumer frame/transport、repository/resolver/delivery/UoW、request synthesis material |

C-13在D批当时只有accessor，故登记该seam；该历史缺口现已由R06.8-B
§8关闭为三个finite profile-specific built runtimes和matching process-local
activation seams。不得恢复`into_entry_assignments` aggregate split、seal/
permit或跨进程zero-partial承诺；zero-partial只适用于当前process root。

## 6. D-01 `ObservationCommandHandlerState` 资格审查

### 6.1 Candidate capability decomposition

| 候选声称能力 | 实际owner | 是否需要独立字段 |
|---|---|---:|
| 保存exact operation | static route type/function与finite route table | 否；handler本身已决定variant |
| 保存runtime availability | application probe/result surface | 否；snapshot不是route authorization |
| 保存application façade | root-level API service bundle | 否；每route复制Arc不增加语义 |
| 保存request bound | root-level `ValidatedApiEntryConfig` | 否；exact handler借用validated bound即可 |
| 保存last disposition | 无合法owner；per-call mapping value | 禁止 |
| map request | Step 08 exact protocol + application-owned digest/context/input seam | 是行为，不是state字段 |

### 6.2 Current implementation contract without candidate

16个Command各有一个exact static handler。Route exposure前，composition证明 enabled set与handler set完全相等。每个handler只借用 API root assignment，执行 §5.1 pipeline并调用 `ObservationTruthWriteService`对应method。它不能访问其他Command的dynamic map，也不能通过free-text选择service method。

Per-call local material至少包括：

| Local value | 来源 | 生命周期 | 禁止持久化/共享 |
|---|---|---|---|
| `ObservationCommandOperation` | static handler identity | current call | 不保存到last-route cache |
| typed request | contracts decoder | current call | raw/forbidden body不进state |
| digest candidates / verified supplied digest | application canonicalizer | pre-UoW current call | 不记录digest material/bytes |
| `ObservationOperationContext` | context factory | current call | 不复用到下一request |
| concrete `*Input` | exact mapper | service call | 不进入entry registry |
| `ObservationCommandResult` / `ApiError` | façade | response mapping | 不保存last result/disposition |

### 6.3 Error、lifecycle 与 persistence

Unknown route、body/type mismatch、missing actor/key和digest mismatch在UoW前返回 `ApiError::Protocol`或对应exact mapping。Application failure返回`ApiError::Application`；lossless response assembly失败返回`ResponseMappingFailed`。API route是process composition，不是durable lifecycle；没有repository、rehydrate、serde、state enum或transition。

### 6.4 DX conclusion

`ObservationCommandHandlerState` 不新增。若framework要求private handler state，只允许保存 API root assignment的borrow/Arc，不得出现operation-free generic map、availability authorization、last digest/result/disposition、repository/UoW或concrete adapter。该private detail不成为Step 06 object owner。

## 7. D-02 `ObservationQueryHandlerState` 资格审查

### 7.1 Candidate capability decomposition

| 候选声称能力 | 实际owner | 结论 |
|---|---|---|
| exact Query operation | static route function / finite route table | 不需要state字段 |
| page/read bounds | API safe slice | root-level immutable input |
| visibility defaults | typed request metadata + application policy | 禁止放入state |
| availability/freshness | `ObservationQueryResult<T>` | per-call result，不缓存 |
| read façade | API service bundle | root-level handle |

14个Query的 `visibility_scope_ref`、`consistency`、actor、trace、requested time和body必须逐请求解析。`default_page_limit`只在protocol明确允许省略limit时形成本次typed input；它不能成为default visibility、freshness、target或scope。超过max limit应按协议明确reject或bounded-rule处理，不能静默截断后宣称完整。

### 7.2 Zero-write closure

Query exact handler从 root可达的业务能力只有 `ObservationReadService`与application-owned context/input seam。正常、missing、not-visible、stale、rebuilding、degraded和unavailable都映射当前 `ObservationQueryResult<T>`；不得开启write UoW、reserve idempotency、save stored result、append outbox/history、mark stale、refresh、repair或rebuild。

### 7.3 Error、lifecycle 与 persistence

Malformed request/cursor进入`ApiError::Protocol`；repository/consistency failure由`ApplicationError`映射；合法not-visible/missing/stale优先是typed Query surface，不是可变state。Route/process restart只重新装配root；没有Query handler rehydrate、last visibility、last error或cache authority。

### 7.4 DX conclusion

`ObservationQueryHandlerState` 不新增。Private framework wrapper不得持有truth-write/maintenance/publication façade，也不得保存 `visibility_defaults`、上次surface或availability snapshot。

## 8. D-03 `OutboxPublisherLoopState` 资格审查

### 8.1 Authority conflict

当前正式 `02` §7 / §8 与其Step 07/08 handoff把 `PublishObservationOutbox`定义为九类Operations Job之一：request必须携带 `JobRunId` correlation、actor、idempotency key、cursor、limit与filter；application必须形成reservation、immutable plan、global item claim/fence、Draft/terminal report和stored result。Duplicate replay原report，不重新list/publish。

R06.7-C C-11和冻结Step 05/07/14又引入 worker resident loop、cadence和candidate limit。该路径只有publication façade与cursor候选，没有完整Job metadata/input，也被C禁止从schedule/config补造request。因此它无法合法建立：

1. actor-scoped idempotency reservation；
2. `ObservationJobExecutionRef`与immutable plan lineage；
3. global outbox work-key claim/fence；
4. Draft/terminal report与stored Job result；
5. duplicate replay / resume / finalize-only语义；
6. public Job response或operator-visible report。

### 8.2 Current ruling

上游formal authority更高且语义完整，因此P0只保留 `PublishObservationOutbox` Operations Job。Scheduler、operator或受控trigger必须转交完整 C-07 `ObservationJobInvocation::PublishObservationOutbox`；不能由worker cadence生成actor/key/cursor/filter或 `JobRunId`。

`ObservationPublicationService`仍可作为application内部的exact publication item/batch collaborator，但不能单独替代Operations Job orchestration。它当前被写成“worker-only façade”且只返回`ObservationPublicationBatchResult`，与`ObservationJobResult`/report闭环不一致；登记 `R06.7-D-PUBLICATION-JOB-SEAM`，R06.8必须裁定其被Job application service组合的exact boundary，不得新增第二entry mode。

### 8.3 Historical fields rejected

| 旧字段/函数 | 为什么不能保留 |
|---|---|
| `cursor` / `advance(cursor)` | cursor属于Job input与immutable plan candidate boundary；resident process不能在Job外推进 |
| `OutboxLoopKind` | 无owner且不能替代Job/report/publication state |
| `last_error_ref` | typed error/report已有owner；last error不构成恢复authority |
| `mark_failed(reason)` | failure必须逐plan item分类并写report/outbox state；generic reason丢失claim/fence/outcome |
| cadence / candidate limit | current worker slice字段与formal Job input/config snapshot冲突；需R06.8 affected repair |

### 8.4 DX conclusion

`OutboxPublisherLoopState` 不新增，不进入worker root、file layout或implementation handoff。C-11中的outbox cadence/limit、Step 05 worker publisher职责和Step 14 worker publisher root均为 affected definitions；在R06.8修正前不能作为实现依据。

## 9. D-04 `ProjectionWorkerLoopState` 资格审查

### 9.1 Capability closure audit

| 必需闭环 | 当前证据 | 结论 |
|---|---|---|
| formal requirement / protocol | projection rebuild、rollup、reference refresh、gap scan、replay与peripheral rebuild均为Operations Job | 没有独立resident projection worker |
| runtime config | C-11只有Consumer registration与historical outbox loop values | 无projection trigger/cadence/limit |
| injected façade | worker bundle只有inbound/publication/context；maintenance只给jobs | worker不能合法推进maintenance |
| typed invocation | C只定义Consumer与Job invocation | 无projection loop input owner |
| durable state | maintenance/plan/claim/report/progress已有domain/application owner | entry state会shadow truth |
| recovery | Job claim/fence/report闭合；resident path无重入契约 | 不能安全执行 |

### 9.2 Current executable path

所有derived maintenance必须从完整 typed Job request进入C-10 exact handler，再由application创建operation context、reservation、plan、claim/fence与report。Stale marker只能成为Job candidate/source input，不能被worker直接转换成start authority。Worker不得补造target、scope、visibility、actor、idempotency key、cursor或public correlation。

### 9.3 Reopen conditions

只有正式上游明确常驻loop相对Operations Job的独立职责，并同时补齐typed trigger、finite enablement、bounded config、least-authority façade、与Job/claim/report的互斥、startup/shutdown/recovery和planned tests，才允许回开 Step 02/04/05/06/07/08/09/12/13/14。否则 `projection_worker.rs` 只是historical layout candidate。

### 9.4 DX conclusion

`ProjectionWorkerLoopState` 不新增。旧 `target_ref + loop kind + maintenance_ref` shape不得进入代码、protocol、persistence或telemetry identity。

## 10. D-05 `ObservationJobRunnerContext` 资格审查

### 10.1 Existing carrier coverage

| Runner需要的能力 | Current carrier / owner |
|---|---|
| exact operation与complete request | C-07 `ObservationJobInvocation` nine typed variants |
| exact callback selection | C-10 `ObservationJobHandlerCatalog` + `ObservationJobHandler::operation` |
| actor/key/trace/public correlation/input | existing typed `ObservationJobRequest<T>` metadata/input |
| request digest与application context | canonicalizer + `ObservationOperationContextFactory::for_job` |
| local accepted execution identity | application `IdGeneratorPort` after reservation Acquired |
| plan/claim/report/result | application jobs/report owners |
| response/failure | C-08 / C-09 |

一个额外 `ObservationJobRunnerContext` 只能重新包装这些值。若保存invocation与service handles，会重复exact handler；若拆出metadata，会丢失concrete input；若保存local execution ref，会越过application mint authority。

### 10.2 Identity redlines

Public metadata current affected definition必须使用 `job_run_id: JobRunId`，只作invocation correlation。它不进入logical idempotency scope/request digest，不是unique plan key，也不转换为 `ObservationJobExecutionRef`、claim owner/ref、report ref、trace、evidence alias或真实external/runtime run。Incoming duplicate的不同`JobRunId`不得覆盖首次accepted plan/report correlation。

### 10.3 One-shot handler ownership

Jobs composition root为每个enabled operation构造一个immutable exact handler `Arc`，一份clone交C-10 schedule registrar，另一份留在one-shot dispatch table。D修正C-10旧前瞻措辞：Arc留给one-shot exact handler调用，不是留给`ObservationJobRunnerContext`。Handler接收move-only完整invocation，执行application-owned input/context seam并返回C-08/C-09。

### 10.4 Error、lifecycle 与 persistence

Typed variant/public-name/body mismatch在application call前为C-09 `Protocol`。Application orchestration失败为C-09 `Application`；完整response形成前不得伪造result/report。Job durable lifecycle只存在于application plan/claim/report，不存在于entry runner。Invocation和callback future均不serde、不rehydrate、不存repository。

### 10.5 DX conclusion

`ObservationJobRunnerContext` 不新增，也不提供`from_metadata`或`to_operation_context(digest)`。Exact handler直接消费C-07 invocation；operation context只由application-owned seam形成。

## 11. Entry mapping ownership matrix

| 阶段 | Owner | 输入 | 输出 | 禁止行为 |
|---|---|---|---|---|
| static route/slot selection | api/worker/jobs exact mapper + C finite catalog | typed operation/registration | exact handler | wildcard/default/free-text map |
| protocol validation | contracts + exact entry mapper | request/frame/invocation | validated typed protocol material | unknown fields忽略、body/name mismatch继续 |
| digest material/computation | application digest owner | validated typed material | digest/candidates | entry hash raw bytes/debug/provider body |
| operation context/input | application-owned seam | operation + validated metadata/material | context + concrete input | entry直接构造private context或信任supplied digest |
| application call | assigned façade/exact Job handler | concrete input | current application result | entry访问repository/UoW/adapter |
| response/completion mapping | exact entry mapper | application result + protocol | public response / C-05 / C-08 | 保存last result、跨入口共享disposition |
| transport/runtime action | infra registrar/API runtime/scheduler | selected mapping | ack/response/exit | runtime重分类application truth |

## 12. Per-call field-source audit

| Field family | Formal source | Missing / mismatch | Forbidden substitute |
|---|---|---|---|
| API operation | static exact route + enabled set | startup totality或pre-UoW protocol failure | public string default route |
| API limits | `ValidatedApiEntryConfig` | startup invalid config / explicit request rejection | handler literal/current env |
| API metadata | each typed request | protocol error；zero call | prior request/default actor/default visibility |
| Consumer route/schema/actor | C-03 delivery + safe registration | protocol/completion mapping | payload-derived producer/actor |
| Job invocation | C-07 complete wrapper | C-09 failure | schedule/current config synthesis |
| public Job correlation | validated `JobRunId` | protocol failure | `JobRunRef`/local execution/claim/report ref |
| digest/context | application canonicalizer + factory | typed error；zero mutation | supplied digest trust、entry hash、unchecked literal |
| local Job execution | application ID generator after Acquired | application error/rollback | runner/scheduler mint |
| publication candidate/cursor | typed Job input + immutable plan | Job start failure/report classification | resident cursor/last ref/time/index |
| projection target/scope | typed Job input + target binding | blocked/failed item | stale marker猜target/default scope |

## 13. State、result 与 persistence audit

| Subject | Lifecycle owner? | Durable? | Current authority | Entry rule |
|---|---:|---:|---|---|
| static API handler | 否 | 否 | route composition | no canonical handler-state object |
| Consumer callback/completion | 否 | 否 | C technical seam | move once；registrar consumes action |
| outbox publication state | 是 | 是 | `ObservationOutboxRecord` | only Operations Job/application mutates |
| projection maintenance state | 是 | 是 | domain/application maintenance | only typed Job/application mutates |
| Job plan/claim/report | 是 | 是 | application jobs/report | entry never stores/mints |
| application return carrier | 否 | 否 | application services | current call only |
| public outcome | wire surface | response/result-backed | contracts Step 08 | exact mapping only |
| availability snapshot | 否 | 否 | application runtime | not handler state/authorization |
| generic entry disposition | 否且不存在 | 否 | none after E deletion | no candidate field requires it；equivalent alias/wrapper forbidden |

五个DX候选都没有repository、rehydrate、migration、serde或state transition contract。Process restart重新执行runtime composition；durable resume只读取application-owned result/plan/claim/report/outbox/maintenance state。

## 14. Executable seam blockers

### 14.1 Digest / input assembly

R06.6-F1已把canonicalizer定义为application-private唯一owner，且 `R06-F1-AFFECT-07-01` 明确要求façade/input assembler消费它。当前Step 07 bundle与C-13没有该executable seam。D不通过entry state暴露canonicalizer或复制算法；该affected blocker原样保留，API/Consumer/Job实现前必须闭合exact typed input assembler。

### 14.2 Entry assignment split

`R06.7-D-ENTRY-ASSIGNMENT-SEAM` 在本历史checkpoint为
`open_controlled_affected`，现由 R06.8-B §8
`resolved_at_step06_definition`。Step07/14仍须传播三类具名runtime、exact
assignment fields、matching consuming activation、profile-local zero-partial
error和opaque root lifetime；不得传播旧aggregate split。

### 14.3 Publication Job composition

`R06.7-D-PUBLICATION-JOB-SEAM=open_controlled_internal`：formal `PublishObservationOutbox` Job需要`ObservationJobResult`、plan/claim/report/stored result；current publication façade只返回batch carrier并被称为worker-only。R06.8必须把batch publication作为Job application orchestration内部capability，或以等价exact application owner闭合；禁止保留resident worker和Job双入口。

## 15. Error boundary

| Boundary | Current error | D 批规则 |
|---|---|---|
| stage-13 composition | `RuntimeAssemblyError::EntryBindingIncomplete` | complete-or-error；zero exposed root；不得first-call才发现missing handler |
| API mapping | `ApiError::{Protocol,Application,ResponseMappingFailed}` | one call return；不保存last error/disposition |
| Consumer | `WorkerError` + C-05 completion | no generic reason/ref；ack/dead-letter failure不回滚local result |
| Job complete response前 | C-09 `Protocol` / `Application` | 不伪造response/report/result ref |
| durable Job/report mutation | `ApplicationError` / `JobError` | application-owned；entry只映射 |
| digest | R06.6-F1 exact variants | zero mutation before validation；no material leakage |

Runtime pause/backoff/shutdown属于Step 12/13/14 runtime policy，不通过 `OutboxLoopKind` / `ProjectionLoopKind` 或五个candidate state表达。

## 16. Affected-use register

| ID | Location | Current conflict | Required correction | Status |
|---|---|---|---|---|
| `R06.7-D-AFFECT-04-01` | Step 04 file layout | `outbox_publisher.rs` / `projection_worker.rs`被列为resident worker | 删除resident execution owners；保留Operations Job binaries/handlers | `affected_pending_R06.8` |
| `R06.7-D-AFFECT-05-01` | Step 05 entry responsibility | worker仍承接outbox/projection loop | worker只保留9 Consumer registration；publication/maintenance归Jobs | `affected_pending_R06.8` |
| `R06-F1-AFFECT-07-01` | Step 07 canonicalizer/context seam | no executable input assembler | application-owned exact assembler消费canonicalizer | `open_controlled_affected` |
| `R06.7-D-ENTRY-ASSIGNMENT-SEAM` | C-13 / Step 07 / Step 14 | historical aggregate runtime lacked least-authority handoff | current definition=three finite built runtimes + matching process-local activation；propagate exact ownership/error contract | `resolved_at_step06_definition_in_R06.8-B`;use propagation pending |
| `R06.7-D-PUBLICATION-JOB-SEAM` | R06.6-E / Step 07/09/14 | worker-only batch façade与formal Job report lifecycle断裂 | compose batch capability under canonical Job orchestration；single entry mode | `open_controlled_internal` |
| `R06.7-D-AFFECT-C10-01` | C-10 one-shot Arc handoff | text says Arc retained for runner context | retain for exact one-shot handler registry；no runner context object | `corrected_in_D_sync` |
| `R06.7-D-AFFECT-08-01` | Step 08 metadata | Command wording允许boundary derive/trust digest；Job仍写`JobExecutionRef` | followF1 supplied-digest rule；use `job_run_id: JobRunId` | `affected_pending_per_protocol` |
| `R06.7-D-AFFECT-09-01` | Step 09 entry flows | shared templates and resident publisher flow conflict | per-protocol pipeline；PublishOutbox only canonical Job flow | `affected_pending_per_flow` |
| `R06.7-D-AFFECT-11-01` | Step 11 report lookup | uses no-owner `JobRunRef` | local execution/plan relation；public correlation nonunique | `affected_pending` |
| `R06.7-D-AFFECT-12-01` | Step 12 entry errors | usable typed enums but old loop wording can implystateful errors | per-call typed error；safe telemetry later；no last error field | `affected_pending` |
| `R06.7-D-AFFECT-13-01` | Step 13 Job identity/reentry | defines `ObservationJobExecutionRef(pub JobRunRef)` | independent local ref fromR06.6-D2；entry no mint/alias | `affected_pending` |
| `R06.7-D-AFFECT-14-01` | Step 14 composition/config | resident worker publication values and no assignment/input seam | remove resident mode；close root assignments and Job composition | `affected_pending` |
| `R06.7-D-AFFECT-FORMAL-01` | formal `03` entry tables | old five structs、last disposition/default visibility/loop kinds/JobRunRef remain | Step 19装配D/E current conclusions | `frozen_until_step19` |

本表不授权本批修改冻结Step 04/05/07~19或formal正文。C-10中仅未来D handoff措辞可同步，不改变C的catalog schema、totality或registrar契约。

## 17. Planned verification cuts

| ID | Boundary | Planned check | Status |
|---|---|---|---|
| `TC-OBS-R067D-CMD-001` | Command routes | 16 enabled exact handlers total；no generic/default route | `planned/not_run` |
| `TC-OBS-R067D-CMD-002` | parallel Command | no cross-request digest/context/result/disposition storage | `planned/not_run` |
| `TC-OBS-R067D-QRY-001` | Query authority | no write/maintenance/publication/repository/UoW reachable | `planned/not_run` |
| `TC-OBS-R067D-QRY-002` | Query metadata | visibility/consistency/time per request；no cached defaults | `planned/not_run` |
| `TC-OBS-R067D-CONS-001` | Consumer | C delivery/handler/completion sufficient；no extra consumer state | `planned/not_run` |
| `TC-OBS-R067D-PUB-001` | publication mode | only complete Job invocation can publish；resident loop absent | `planned/not_run` |
| `TC-OBS-R067D-PUB-002` | publication replay | plan/claim/report/result complete；duplicate does not relist/republish | `planned/not_run` |
| `TC-OBS-R067D-PROJ-001` | projection mode | no resident struct/file/root registration without upstream reopen | `planned/not_run` |
| `TC-OBS-R067D-JOB-001` | Job dispatch | nine invocation variants -> exact handler；no runner wrapper | `planned/not_run` |
| `TC-OBS-R067D-JOB-002` | identity | no `JobRunId` conversion to local execution/claim/report/evidence/run | `planned/not_run` |
| `TC-OBS-R067D-DIG-001` | digest seam | no entry raw/debug hash；application canonicalizer precedescontext/service | `planned/not_run` |
| `TC-OBS-R067D-ASM-001` | assignments | historical D assertion superseded by R06.8-B；current cut is three named runtimes, one assignment each, independent process-local activation, no cross-process atomicity claim | `planned/not_run` |
| `TC-OBS-R067D-PERSIST-001` | all DX candidates | no public struct/serde/repository/UoW/rehydrate generated | `planned/not_run` |
| `TC-OBS-R067D-TRUTH-001` | no-write | entry cannot write source/business truth or mint evidence/signoff/real run | `planned/not_run` |

本表只定义未来测试切口。未运行测试、静态扫描、runtime、integration或acceptance check。

## 18. R06.7-E 承接清单（已消费）

E 批已完成以下承接：

1. 基于D use-site审查删除 `EntryDisposition`，裁定为`HX`且禁止同义alias/wrapper。
2. 审计stored result、application result、public outcome、C completion与Job callback，确认不存在必要的generic entry classification。
3. 把五个candidate `DX`同步到R06.7 final inventory，确认不进入implementation handoff或formal object index。
4. 审计C-03~C-10的field/error/lifecycle闭环，不重开C schema；将C-11/C-13标记为`FC_affected`。
5. 保留三个executable seam到R06.8/affected review，不以猜测private wrapper宣称implementation-ready。
6. 给Step08/09逐协议/逐flow明确handoff，固定PublishOutbox single Job mode与Consumer no-default action rule。

E只关闭了R06.7 scope内owner、重复定义与defer裁定；在R06.8和frozen affected-use修复前，Step 06仍不能宣称implementation-ready。完整结论见`03_ddd_step_06_runtime_entry_cross_module_r06_7e.md` §§1~18。

## 19. Blocker 与停止审查

### 19.1 Blocker state

| Item | State after D | Blocking scope |
|---|---|---|
| newly found external upstream blocker | `none` | 无 |
| `R06.6-F2-H13-UPSTREAM` | unchanged `open_controlled` | formal `03` reassembly前 |
| `R06-F-AFFECT-UOW-01` | unchanged `open_controlled_downstream` | later affected review |
| `R06.7-ENTRY-DISPOSITION-OWNER` | `resolved_by_deletion_in_R06.7-E_design_only` | closed；禁止恢复同义类型 |
| `R06-F1-AFFECT-07-01` | reconfirmed `open_controlled_affected` | implementation-ready；R06.8/Step07 |
| `R06.7-D-ENTRY-ASSIGNMENT-SEAM` | historical open consumed；current=`resolved_at_step06_definition_in_R06.8-B` | Step07/14 use propagation仍阻塞implementation-ready |
| `R06.7-D-PUBLICATION-JOB-SEAM` | new `open_controlled_internal` | implementation-ready；R06.8/application/Step07/09/14 |
| projection resident capability | resolved as `DX` | 不阻塞D；禁止实现该loop |
| `03-RPR-S06-GRANULARITY` | unchanged open | R06.8与affected review未完成 |
| Step 08/09 quality blockers | unchanged | later per-protocol/per-flow repair |

### 19.2 Stop review

| 审查项 | 结果 |
|---|---|
| 是否逐项审查五个candidate | `pass_design_only`；五个均DX且各有independent qualification |
| 每个DX是否有capability替代owner和重开条件 | `pass_design_only` |
| 是否删除跨请求shared result/default visibility | `pass_design_only` |
| 是否恢复无owner loop/error support type | `no` |
| 是否保留formal Job与resident loop双authority | `no`；single Job mode |
| 是否伪造projection resident capability | `no` |
| Job三层identity是否隔离 | `pass_design_only` |
| 是否提前定义/放置`EntryDisposition` | D阶段`no`；E随后裁定为HX deletion |
| 是否识别executable seams | `yes`；digest/input、entry assignment、publication Job composition |
| 是否修改formal `03`、frozen Step 07+、`04`或实现代码 | `no` |
| 是否运行测试或声称结果 | `no`；全部`planned/not_run` |
| 是否创建commit/run ID/evidence alias/signoff/implementation boundary | `no` |

## 20. 当前停审点与 truthfulness

Current pointer: `R06.7-E_done_waiting_user_before_R06.8`；本D文件已被E消费。

下一步应先读取E专项 §§1~18、本文件 §§1~20、R06.7-A/B/C、Step 06主控§6.29、flow与项目台账，再进入R06.8。未经用户明确确认，不得进入R06.8、Step 07~19、正式 `03`、任何 `04`文件或实现代码。

本文件仅记录design-only contract。它不证明runtime已装配、route/Consumer/Job已启动、测试已通过、external effect已成功、evidence真实、验收已签署或implementation commit存在。当前不需要提交。
