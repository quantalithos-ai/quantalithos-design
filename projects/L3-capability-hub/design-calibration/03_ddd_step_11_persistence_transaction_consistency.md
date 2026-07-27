# L3-capability-hub 03 详细设计 Step 11: 持久化、事务与一致性契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 11
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §10 数据持久化、事务与一致性契约
> 创建日期: 2026-07-17
> 当前模式: full-restart
> 当前批次: `11.5`
> 状态: `step_11_completed_with_step_14_commit_resolution_sync`
> Step 14 batch 14.2受控同步: 2026-07-19;single persistence authority新增stable transaction-ref commit resolution，所有commit-unknown / reserve-loser / rollback recovery read固定为linearizable authority read；36 Ports、22 repository traits / 110 methods与logical stores不变
> Step 13受控同步: 2026-07-18;`CapabilityIdempotencyRepository::save`只允许`Reserved -> Completed`；Command / Inbound committed `Reserved`无matching owner是consistency defect；Job `Reserved + Planned journal`是唯一合法恢复态；Step 10 active baseline为`638 = 239 current + 98 reserved + 301 illegal`
> 本轮口径: 将Step 6对象字段、Step 7 exact repository / UoW surface、Step 8 stored schema、Step 9实际事务顺序和Step 10状态 / propagation hard input收敛为产品中立但可直接实现的logical persistence contract；不锁数据库产品、DDL语法、migration文件、SQL index名称、并发重试算法、exact错误enum、配置值、测试结果或implementation artifact。

---

## 0. Step 11 开工确认与受控校正

| 项 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前Step | Step 11 `定义持久化、事务与一致性契约` |
| 用户确认 | 用户已回复“同意”,允许从已停审的Step 10进入Step 11 |
| 上一恢复点 | `03_step_10_completed_wait_user_review`;Step 10已完成22 local + 1 external状态边界、1 immutable formation audit；Step 13 controlled reopen后pair baseline同步为638 |
| 本Step输入 | Step 11 SOP / 书写规范§5.10；正式`01` §9；正式`02` §8~§12；Step 6 current objects；Step 7 §§6~§13 / §16；Step 8 stored schemas；Step 9 transaction / reentry；Step 10 §65~§73及§15~§62 |
| 本Step输出 | 本文件；`03_ddd_calibration_flow.md`和`project_execution_ledger.md`恢复点同步 |
| 正式文档写入 | 不写入；正式`03-详细设计.md`仍由Step 19统一装配 |
| 实现产物 | 不创建源码、DDL、migration、implementation ledger、planned boundary skeleton、commit或run |
| 停审方式 | 完成全部`11.1~11.5`批次、cross-step audit与正式§10 assembly source后停审；未经再次确认不得进入Step 12 |

### 0.1 Pre-entry exact trait count correction

机械枚举Step 7全部`pub trait`后得到:

```text
5 base / read-gate traits
+ 22 repository traits
+ 9 external resolver / handoff / collaboration traits
= 36 application-owned Ports
```

Step 10 §0.8和§65.1把repository trait数量汇总为23,与Step 7正式§20.2的`18 repository/store + 4 reference/replay = 22`以及代码块声明不一致。本Step以exact declaration为准,受控回开Step 10两处汇总为22并登记`CH-DDD-S10-REPOSITORY-COUNT-001`。该校正不新增或删除trait、method、object、state、protocol或flow,不改变36 Ports总数,不是上游项目blocker。

---

## 1. Step 11 写入批次状态表

| 批次 | 内容 | 状态 | 完成条件 | 后续动作 |
|---|---|---|---|---|
| `11.0` | 输入恢复、标准读取、exact trait inventory、Step 10计数校正 | completed | 22 repository / 36 Port口径与Step 7声明一致,无语义reopen | 已进入`11.1` |
| `11.1` | SOP回答、诊断、设计取舍、数据所有权、logical store inventory | completed | owned / ref / projection / immutable / ephemeral / external owner全部分类,每个Step 7 repository有store承接 | 已由`11.2`机械闭合 |
| `11.2` | Repository函数持久化语义、version / unique / current / history / page / dependency index | completed | 22 traits / 110 methods全部覆盖,不新增private finder,expected-version来源闭合 | 已进入`11.3` |
| `11.3` | Command / Consumer / Outbound / Job transaction boundary与physical save order | completed | Step 9所有local UoW class有begin / writes / commit / rollback / post-commit边界 | 已进入`11.4` |
| `11.4` | 一致性、隔离、失败恢复、fake / durable parity、anti-pattern | completed | crash visibility、collect-before-mutate、stored replay、capture / journal恢复闭合 | 已进入`11.5` |
| `11.5` | historical audit、cross-step closure、正式§10 assembly source、Step 12~16 handoff、停审 | completed | SOP门禁全部通过,unresolved blocker=0,正式`03`未改 | Step 11完成待用户审查 |

批次纪律:

- 每一批只补本表声明的surface；发现Step 7 callable不足时先登记blocker并受控回开,不得在store表中发明method。
- logical store不是migration或已存在的数据库事实；它是durable adapter和in-memory fake都必须实现的key / version / index / transaction语义。
- 单个repository trait可以承接多个logical store；单个logical store也可由一个typed-union repository承接。不得用“一trait一table”机械映射。
- 全部批次完成后只停在Step 11用户审查点,不自动创建Step 12文件。

---

## 2. 本Step目标与非目标

### 2.1 必须闭合

1. 本仓owned truth、body-free reference、safe summary、projection / report、append-only record和application technical record分别保存在哪里。
2. 每个logical store的primary identity、current uniqueness、reverse / affected index、version / append-only / insert-only规则。
3. Step 7每个repository method如何落到read、CAS save、append、atomic reserve、typed replay或stable page语义。
4. Step 9每类UoW的开始、local write set、constraint check、save order、commit、rollback和post-commit外部调用边界。
5. core truth内部强一致、truth到derived material的local stale强一致与重建最终一致、external ref引用有效性一致、external collaboration无分布式事务如何同时成立。
6. affected-material collect-before-mutate所需读取快照、stable union、own expected version和冲突回滚语义。
7. source + immutable event snapshot + Captured、stored surface + Completed、Job initial / target / final三类crash visibility闭合。
8. durable / fake在uniqueness、version conflict、terminal exclusion、cursor、missing/asymmetry和rollback方面的等价行为。

### 2.2 本Step不定义

| 后移内容 | owner | 当前边界 |
|---|---|---|
| exact `DomainError` / `ApplicationError` variants及public mapping | Step 12 | 本Step只声明conflict / missing / invariant / persistence / commit类别 |
| reserve race、digest codec、retry / backoff、same-intent duplicate算法 | Step 13 | 本Step固定atomic / immutable outcome,不写算法 |
| concrete database、search、broker、transaction driver、endpoint / credentials | Step 14与`04` | logical stores不等于产品选型 |
| metrics、logs、spans、audit telemetry fields | Step 15 | persisted change / trace不是已运行observability evidence |
| executable tests、coverage、result和acceptance evidence | Step 16、`05 / 06` | 只保留test handoff,不声称执行 |
| migration files、implementation phases、commit boundaries | `07` | 当前不创建implementation ledger或boundary skeleton |

本项目没有正式local outbox lifecycle。`CapabilityEventPayloadSnapshot + CapabilityEventCaptureRecord`只提供source-commit到external-intent之间的产品中立durability；external `EventCollaborationStatus`仍由Port owner维护。本Step不得把capture store改名或扩展成broker outbox / relay / attempt store。

---

## 3. 已读取输入与使用方式

| 输入 | 已读取范围 | 本Step用途 |
|---|---|---|
| 详细设计SOP Step 11 | 目标、6个问题、5类输出、进入条件 | 固定所有权、store、repository、transaction、consistency最小输出 |
| 详细设计书写规范§5.10 | ownership / store / repository / transaction表格式 | 固定正式§10装配结构 |
| 真相源闭环标准 | version source、stored replay、affected projection、history、payload snapshot、phase boundary | 防止adapter私补owner / scan / reconstruction |
| 正式`01` §9 | truth / snapshot / ref / forbidden body分层；strong / eventual / reference-validity consistency | persistence owner与一致性上限 |
| 正式`02` §8~§12 | 43 objects、83 protocols、Query no-write、Job no-core-truth-repair、event no-rollback | 防止持久化设计越过概要边界 |
| Step 6 current baseline | object fields、version / time、state-dependent nullable invariants、append-only / immutable records、technical helpers | logical persisted payload与constraint直接来源 |
| Step 7 §§6~§13 / §16 | 22 repository traits、UoW、Loaded/page/scope、36 Port parity | repository和index authority；禁止新增私有finder |
| Step 8 current baseline | stored command surface、typed consumer receipt、8 typed Job response、outbound envelope snapshot | insert-only result / snapshot对称约束 |
| Step 9 shared guards及83 flows | local atomic sets、collect-before-mutate、post-commit、Job three-phase journal | transaction class和save order直接来源 |
| Step 10 §15~§73 | state owner、current/reserved/illegal、propagation classes、Step 11 hard input | current uniqueness、terminal exclusion、transaction membership |
| L1 Governance / Artifact Step 11 | 结构、logical-store粒度、recovery / parity / anti-pattern审计 | 只参考表达深度,不复制领域对象或outbox产品 |

---

## 4. SOP问题回答

| 问题 | 当前回答 |
|---|---|
| 哪些数据对象由本仓拥有? | capability identity / review / registry / descriptor / safe summary / seam / method relation / exposure / visibility / change / trace / impact / downstream summary、controlled view、三类mutable derived material、immutable reconciliation report、八类body-free external ref及one canonical resolution state、event snapshot / capture、idempotency / stored result / Job journal。 |
| 哪些只是引用、快照或投影? | 八类external ref只保存body-free locator/candidate；governance / method / secret / runtime / SDK / observability正文不入仓。Controlled view、directory、audit export、ecosystem discovery是可重建projection；reconciliation是immutable report；event payload是已提交public envelope snapshot,不是source truth。 |
| repository函数如何命名、参数和返回是什么? | exact signature完全继承Step 7。Mutable create/update使用`save(value, Option<Version>, &uow)`；更新version只来自`Loaded.expected_version`。Change/report append-only；trace使用`append_revision(expected_previous_version)`；reserve使用`reserve_if_absent`；stored result / snapshot / typed envelope insert-only。 |
| 哪些flow需要事务? | 26 Command和6 Consumer的fresh terminal local path、10 Outbound source capture所在source UoW、event intent bind short UoW、8 Job initial / target / final UoW以及rollback后记录target failure的zero-effect UoW。33 Query严格no-write；external resolver / handoff / collaboration call不加入本地UoW。 |
| 是否需要乐观锁、行锁、版本号、outbox或projection? | 所有mutable/current owner需要CAS optimistic version；本Step不要求显式row lock,atomic absent reserve和unique constraint由store保证。需要projection及truth/reference dependency index。不创建local outbox lifecycle；event snapshot/capture承担正式声明的pre-intent durability。 |
| 发布或projection更新失败如何恢复? | Local source UoW失败整体rollback；commit后external collaboration / handoff失败不回滚truth。Captured记录保持AwaitingIntent可重试；material冲突使source Command整体rollback；rebuild target失败只记录journal terminal failure,不修core truth；missing stored surface / snapshot / journal asymmetry显式失败,不得重算。 |

---

## 5. 当前问题诊断、改动前后与设计取舍

### 5.1 问题诊断

| 来源 | 当前缺口 / 风险 | 本Step收口 |
|---|---|---|
| Step 7 exact trait | callable已闭合,但未逐store固定primary / unique / reverse / affected / current index | §§7~10建立logical schema和repository语义 |
| Step 9 local UoW | 事务成员已逐flow给出,但physical constraint timing与跨family save order未统一 | §§12~15形成transaction class与ordered write pipeline |
| Step 10 state | current / terminal subset已明确,但durable current index必须逐owner映射 | §9固定partial/current uniqueness与terminal exclusion |
| multi-subject stale | application先collect typed union,但需要一致读取窗口与stable pagination语义 | §11 / §16固定operation snapshot、cursor binding和conflict rollback |
| stored replay | shell / surface / typed envelope对称已定义,但insert / completion可见性需明确 | §14固定same-UoW and exact result-ref atomicity |
| event capture | snapshot / capture / source同UoW已定义,但unique constraint和crash visibility需明确 | §10 / §14固定source+schema uniqueness、insert-only snapshot、CAS bind |
| Job journal | initial/target/final UoW已定义,但journal plan与terminal payload物理immutability需明确 | §10 / §15固定normalized-key uniqueness、whole-record CAS和terminal guard |
| 旧正式`03` | provider contract、cost、KMS/Vault、allow/deny、runtime gateway和outbox relay store会污染当前schema | §18 historical audit全部排除 |

### 5.2 改动前后

| 维度 | Step 11前 | Step 11目标 |
|---|---|---|
| persistence mapping | object + repository callable | object -> persistence class -> logical store -> exact key / index / version |
| transaction | per-flow declared local set | reusable transaction class + per-flow membership + physical order + rollback visibility |
| derived propagation | typed affected scan contract | dependency index + stable collect snapshot + dedup union + own CAS save |
| replay | stored object contract | shell / surface / typed envelope / Completed same-ref atomic visibility |
| recovery | state / flow prose | crash point -> visible durable state -> exact reentry source -> forbidden reconstruction |
| adapter parity | Step 7 general gate | each key/index/CAS/cursor/asymmetry/rollback behavior mandatory in durable and fake |

### 5.3 设计取舍

| 议题 | 方案 | 当前裁决 |
|---|---|---|
| 具体DDL | 直接锁SQL vs logical contract | 采用logical contract。数据库产品未选定,但实现不得弱化key / index / CAS / transaction。 |
| versioned storage | append every object revision vs current row CAS + declared history records | current object使用CAS current row；只有Step 7明确提供exact revision/history的对象保存正式历史。Change / trace / report另按append-only契约。不得为所有对象私建第二truth。 |
| current uniqueness | application先查再写 vs store constraint | application执行typed guard,store仍以atomic unique/current constraint兜底；两者缺一不可。 |
| affected material | full scan vs dependency index | 必须使用truth/reference dependency index；禁止扫描serialized summary / body。 |
| transaction isolation | 全局serializable vs operation snapshot + CAS/unique | 同一UoW的staged writes必须参与cross-store校验与原子提交,但未携带`uow`的repository read仍只读committed state,不承诺未声明的read-your-writes；affected collect使用稳定committed snapshot且CAS/unique阻止lost update。具体数据库isolation映射留adapter,不得低于这些语义。 |
| event durability | concrete outbox vs snapshot/capture | 采用现有product-neutral snapshot/capture,不增加delivery attempt或broker状态。 |
| external call | 纳入local transaction vs phase separation | resolver read可发生在local mutation前但不可回滚；handoff/collaboration在source commit后；无distributed transaction。 |
| Job progress | private checkpoint vs typed journal | 只使用`CapabilityJobExecutionRecord`;禁止run lookup、scope rescan、lease / attempt私表。 |

---

## 6. Persistence Class与Owner边界

| persistence class | owners | write semantic | history / replacement | forbidden |
|---|---|---|---|---|
| versioned owned truth | identity、review、registry、descriptor、summaries、relations、exposure / visibility、impact / feedback | create `None`;update exact loaded version;domain-validated state / field delta only | owner-specific terminal object remains exact-readable whereStep 7 declares history;current index excludes terminal subset | last-write-wins、upsert、DB trigger transition |
| versioned projection / local snapshot | controlled view、directory、audit export、ecosystem discovery、canonical reference state | create/update by exact Job / Consumer / Command flow;own CAS version | stale / partial / unavailable remain current readable;rebuild writes final object only | projection correcting core truth、missing asdegraded |
| append-only domain record | six change families、trace revisions、reconciliation reports | insert only;trace next revision CASes expected previous;report generated id | all accepted revisions retained | update/delete/overwrite/current-truth reconstruction |
| body-free external reference | eight typed variants | create/update candidate fields + canonical state link by CAS | one ref owner pertyped id;candidate digest lookup | owner body、raw locator scan、second per-ref canonical state |
| insert-only application record | event payload snapshot、stored result shell / surface / typed envelope | immutable insert in declared UoW | no in-place replacement;new result/snapshot getsnew id | update/delete/rebuild fromcurrent truth |
| versioned application technical state | event capture、idempotency record、Job execution journal | narrow declared transitions with CAS / atomic reserve | capture onlybinds intent；journal plan andterminal outcomes immutable；idempotency Completed terminal | delivery status copy、winner overwrite、private checkpoint |
| derived read-only virtual snapshot | `CapabilityAccessTruthSnapshot` | repository composes committed typed refs / versions perpage;not separately persisted | cursor-bound page view | mixed-time graph presented asone atomic dump |
| ephemeral / non-persisted | operation context、read visibility decision、repository page request/cursor token、resolver observation、handoff/collaboration outcome | request-local only | none | canonical truth、resume source或audit evidence |
| external Port-owned state | `EventCollaborationStatus` | external owner only | read / repair throughPort | local status table、capture state duplication、distributed transaction |

---

## 7. 数据所有权实现表

| 数据对象 / family | 拥有模块 / repository | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `CapabilityIdentity` / `CapabilityAccessReviewFact` / `CapabilityRegistryEntry` | domain identity / registry；3 repositories | exact Commands | Command prerequisites、33 Queries、Job planning / snapshot | owned truth；own CAS；identity key / current review / current registry unique；matching change / trace / capture / stale / result同UoW |
| `AdapterDescriptor` / risk / secret safe summary | domain descriptor；descriptor + summary repositories | descriptor Commands | descriptor/exposure Commands、Queries、Job planning | owned truth / safe summary；current-by-owner unique；forbidden body absent；replacement / attachment atomic |
| `GovernanceSeamRelation` / `CapabilityMethodBodyFreeRelation` | domain relation；2 repositories | relation Commands | exposure prerequisite、Queries、snapshot / material Jobs | body-free owned relation；current non-terminal unique peridentity；terminal history excluded fromcurrent |
| `FormalExposureBoundary` / `FormalVisibilityApplicability` | domain exposure；2 repositories | exposure Commands | consumer view / SDK Query、Jobs、affected propagation | server truth；exposure + final visibility + actual registry delta sameUoW；view不得反写 |
| six `*ChangeRecord` families | owner domain；change repository | matching accepted source mutation | trace formation、Queries、event mapping | immutable append；subject/kind/ref对称；same operation time / trace；no update/delete |
| `CapabilityAccessTraceabilityRecord` revisions | domain trace；trace repository | accepted Commands / handoff follow-up | impact / export / Queries / event mapping | append revision；highest current；exact historical revision retained；concurrent successor conflict |
| `CapabilityChangeImpactFact` / `DownstreamConsumptionImpactSummary` | domain impact；impact repository | impact Command / inbound feedback Consumer | Queries、export/reconciliation planning | own CAS；trace/current andsource-feedback uniqueness；downstream failure不回滚source |
| `ControlledConsumerView` | domain exposure projection；view repository | source stale propagation / refresh Job | consumer/runtime/SDK Queries、reconciliation | mutable projection；compound owner unique；truth/reference dependency index；own CAS |
| directory / audit export / ecosystem discovery | domain derived；derived repository | source stale propagation / matching Jobs | directory/export/discovery Queries、reconciliation | mutable material；owner-specific current unique；dependency index；final-only rebuild save |
| `CapabilityReconciliationReport` | domain derived；report repository | reconciliation Jobs | Queries、stored Job response | immutable append-only report；scope/run indexes only forquery/planning,never current truth repair |
| eight `CapabilityExternalReference` variants | domain reference；external-reference repository | registration Commands / inbound Consumers | resolver guards、Queries、Job planning | body-free local ref；typed id / kind / candidate digest symmetry；CAS；no external正文 |
| `ReferenceResolutionState` | domain reference；state repository | reference Commands / Consumers / refresh Job | all reference-dependent guards / Queries / material propagation | one canonical state persubject；state id / subject / kind parity；own CAS；terminal Invalid/Forbidden notreopened |
| `CapabilityEventPayloadSnapshot` / `CapabilityEventCaptureRecord` | application event capture；capture repository | exact source-owning write path / bind facade / repair Job | collaboration facade / repair Job | source + snapshot + Captured sameUoW；snapshot insert-only；capture CAS bind；no delivery state |
| `CapabilityIdempotencyRecord` | application idempotency repository | Command / Consumer / Job shared write guard | duplicate / zero-write conflict classification / reserved reentry | normalized key atomic reserve；winner immutable；Completed same result ref asstored surface |
| stored shell / serialized surface / typed Consumer receipt / typed Job envelope | application stored-result repository | fresh terminal Command / Consumer / Job final path | duplicate replay only | insert-only andcross-store symmetry；sameUoW withCompleted；missing/mismatch explicit consistency failure |
| `CapabilityJobExecutionRecord` | application Job execution repository | Job initial / target / final phases | reserved reentry / final assembler | one journal pernormalized key；complete frozen plan；whole-record CAS；target terminal / final ref immutable |
| `CapabilityAccessTruthSnapshot` page | virtual truth snapshot repository | no independent write | rebuild / reconciliation planning | committed exact refs + versions,stable page;does not claim whole-scope atomic graph |
| external collaboration item/status | external collaboration Port | external owner | facade / repair Job | no local store；external success/failure cannot rollback local truth |

### 7.1 Forbidden persistence owner audit

| forbidden material | persistence result |
|---|---|
| provider secret、token、password、private key、KMS/Vault truth | no store / column / snapshot / result payload |
| governance approval、Policy、shared_rules、vote / workflow body | onlygovernance result ref + allowed safe summary / seam relation |
| method content、TaskDefinition、AIPolicyDef、ProcessTemplateDef、source code | onlymethod asset ref + body-free relation |
| runtime/tool invocation、result、allowlist / enforcement、provider route/quota/cost | onlyconsumer ref / controlled view / impact summary |
| SDK client/package/cache/publication state | onlySDK consumer ref + formal server exposure / controlled view |
| marketplace listing/ranking/pricing/transaction/fulfillment | onlyread-only ecosystem discovery summary |
| raw logs/spans/metrics/audit event/evidence alias/acceptance signature | onlyobservability/audit ref + body-free trace/export summary |
| broker topic、delivery attempt、retry counter、dead-letter record | no local owner；external collaboration Port state only |

---

## 8. Logical Store / Collection / Projection Inventory

### 8.1 Core truth and relation stores

| logical store | persisted owner / class | primary key | unique / current constraint | required read index | version rule |
|---|---|---|---|---|---|
| `capability_identity_store` | `CapabilityIdentity`;versioned truth | `capability_identity_id` | `identity_key` unique amongcurrent identity owner;id exact | identity ref;identity key;source ref/kind + state + stable id search | create=1;CAS expected;retired remains exact-readable |
| `capability_access_review_store` | `CapabilityAccessReviewFact`;versioned fact | `review_fact_id` | at most one`Recorded` current peridentity | exact ref;identity + current predicate;identity + stable history order | create=1;CAS;Superseded/Invalidated excluded current |
| `capability_registry_store` | `CapabilityRegistryEntry`;versioned truth | `registry_entry_id` | at most one non-Retired current entry peridentity | exact ref;identity current;typed lifecycle / visibility filters + stable id | create=1;CAS;Retired exact/history only |
| `adapter_descriptor_store` | `AdapterDescriptor`;versioned truth | `descriptor_id` | at most one Accepted/Unresolved current descriptor perregistry entry;Replaced/Retired excluded | exact ref;registry entry current/history | create=1;CAS;terminal objects retained |
| `descriptor_risk_summary_store` | risk summary;versioned safe summary | `summary_id` | one nonterminal current risk summary perdescriptor | exact id;descriptor current | create=1;CAS;terminal history excluded current |
| `secret_safe_summary_store` | secret handling summary;versioned safe summary | `summary_id` | one current summary persecret ref anddescriptor link | exact id;secret ref current;descriptor current join/index | create=1;CAS;no secret material |
| `governance_seam_store` | body-free relation;versioned truth | `relation_id` | one current`Pending/Active/Unresolved/Expired` peridentity | exact ref;identity current/history | create=1;CAS;Replaced/Forbidden excluded current |
| `method_relation_store` | body-free relation;versioned truth | `relation_id` | one current`Pending/Active/Stale/Unresolved` peridentity | exact ref;identity current/history;method asset reverse | create=1;CAS;Removed/Forbidden excluded current |
| `formal_exposure_store` | formal server boundary;versioned truth | `exposure_id` | one current non-Retired exposure perregistry entry | exact ref;registry entry current/history | create=1;CAS;terminal history retained |
| `formal_visibility_store` | applicability fact;versioned truth | `visibility_id` | one current visibility fact perexposure | exact id;exposure current | create=1;CAS;`source_exposure_version` must equalfinal exposure ref version |

### 8.2 Change, trace, impact, and derived stores

| logical store | persisted owner / class | primary key | unique / current constraint | required read index | version rule |
|---|---|---|---|---|---|
| `capability_change_record_store` | six-variant immutable union | typed `CapabilityChangeRecordRef` | typed ref globally unique;variant/ref/payload kind symmetric | exact typed ref;trace subject + recorded time + typed id stable order | append-only;no update/delete |
| `capability_trace_revision_store` | traceability revision | `(traceability_record_id, version)` | one row perexact revision;one highest committed current | exact id+version;change ref -> current;subject + id + version | first expected=None;next CAS expected previous;append-only revisions |
| `capability_impact_store` | impact fact;versioned truth | `impact_fact_id` | one current impact perexact traceability revision whereflow declares create/current | exact ref;trace ref;consumer reverse | create=1;CAS |
| `downstream_impact_summary_store` | feedback summary;versioned safe fact | `summary_id` | `source_feedback_ref` unique | exact ref;source feedback;impact / consumer / subject / observed time composite filters | create=1;CAS;terminal payload guards |
| `controlled_consumer_view_store` | mutable projection | `consumer_view_id` | one current per`(exposure_id, consumer_ref)` | compound owner;consumer + exposure/freshness;truth dependency;reference dependency | create=1;own CAS;degraded object remains readable |
| `directory_projection_store` | mutable projection | `projection_id` | one current perregistry entry | registry current;typed text/facets stable page;truth/reference dependency | create=1;own CAS;final-only refresh |
| `audit_export_summary_store` | mutable projection | `export_id` | one current per`(traceability exact ref, export scope)` | exact ref;trace+scope;scope page;truth/reference dependency | create=1;own CAS;body-free only |
| `ecosystem_discovery_store` | mutable projection | `discovery_id` | one current per`(exposure_id, ecosystem_context_ref)` | exact ref;compound owner;truth/reference dependency | create=1;own CAS;no marketplace truth |
| `reconciliation_report_store` | immutable report | `report_id` | report id unique;job/run relationship validated,not a current-owner key | exact ref;scope + generated time + id;job run | append-only;no update/delete |

### 8.3 Reference and application technical stores

| logical store | persisted owner / class | primary key | unique / current constraint | required read index | version rule |
|---|---|---|---|---|---|
| `external_reference_store` | eight typed body-free ref variants | typed local reference id | typed id unique;`(reference_kind,candidate_digest)` lookup must preserve variant;subject parity | exact typed ref;candidate digest;typed scan stable order | create=1;CAS;no raw-body search |
| `reference_resolution_state_store` | canonical state;versioned local snapshot | `resolution_state_id` | exactly one current state owner per`reference_subject`;state id/subject/kind parity | exact state ref;subject current;typed reference scan/state value | create=1;CAS;Invalid/Forbidden terminal |
| `event_payload_snapshot_store` | immutable complete envelope snapshot | `payload_snapshot_id` | `(source_ref,schema_ref)` unique andcandidate digest symmetric | exact snapshot id;source+schema join throughcapture | insert-only;bytes non-empty;digest recomputed on read |
| `event_capture_store` | versioned capture | `event_capture_id` | `(source_ref,schema_ref)` unique;one capture points one snapshot;intent nullability matchesstate | exact capture+snapshot;source+schema;AwaitingIntent stable scan | create=1 withCaptured;CAS bind exactly once |
| `idempotency_record_store` | versioned reservation | normalized idempotency key | atomic one winner perkey | exact key | reserve returnspersisted expected version;CAS Reserved->Completed;winner never overwritten |
| `stored_operation_result_store` | immutable result shell | application result ref | result ref unique;operation/kind/disposition/surface ref symmetry | exact result ref | insert-only |
| `stored_result_surface_store` | immutable serialized public surface | surface ref | surface ref unique;digest matchesnon-empty canonical bytes | exact surface ref | insert-only;no decoder-selected owner |
| `stored_consumer_receipt_store` | typed complete receipt envelope | application result ref | one envelope permatching Consumer shell/surface/operation | exact result ref | insert-only;receipt effect refs retained |
| `stored_job_report_store` | typed eight-variant Job envelope | application result ref | one envelope permatching Job shell/surface/operation/job/schema/run | exact result ref | insert-only;variant-bound response retained |
| `job_execution_journal_store` | versioned typed journal | normalized idempotency key | exactly one journal perreservation key;operation/job/schema/run/digest symmetry | exact normalized key only | create returnsinitial expected version;whole-record CAS;plan/terminal payload immutable |

### 8.4 Virtual / external / explicitly absent stores

| surface | persistence treatment | rationale |
|---|---|---|
| `CapabilityAccessTruthSnapshot` | virtual paged read overcommitted truth stores;no snapshot table required bycurrent contract | frozen planning storesrefs/versions inJob plan;repository must not claim global atomic graph |
| `CapabilityReadVisibilityDecision` | ephemeral resolver result | query no-write;not authorization ortruth |
| repository cursor | opaque continuation derived frommethod+scope+sort key,optionally integrity-protected;not canonical store | same method/scope binding required;internal format notpublic |
| resolver observations | request-local;accepted fields copied intoowned ref/state/safe-summary UoW only | external reads cannot berolled back |
| audit handoff outcome | request-local;trace revision may persist body-free disposition/receipt throughdomain member | no raw external response / evidence store |
| external collaboration status/item | no local persistence | Port ownsstatus;capture storesonlystable intent ref |
| local outbox / relay / attempt / dead-letter | explicitly absent | not inStep 6/7 current model;cannot beintroduced byadapter |
| cache / search backend private truth | may optimize reads onlyifsemantically disposable andneverreturned asowner | directory projection remainsformal local read model;cache cannot repair oroverride it |

### 8.5 Batch `11.1` ownership / inventory stop-review

| gate | result |
|---|---|
| all22 repository traits haveone ormore store / virtual-read owner | pass;§9 exact method matrix covers 22 traits / 110 methods |
| owned truth / ref / projection / report / technical / ephemeral / external split | pass |
| 43 HLD objects + 7 application helpers remainunchanged | pass |
| newtype / field / callable / trait / Port / protocol / flow | 0 |
| structure / field / variant-payload Rustdoc omission | 0;no Rust declaration added |
| upstream blocker | 0;one Step 10 count typo corrected |
| formal`03-详细设计.md` modified | no |
| implementation artifact / commit / run / evidence created | no |

Batch `11.1`由§9的22-trait / 110-method exact matrix完成机械闭合,未发明private finder。

---

## 9. Repository 函数持久化语义

本章使用 `Trait::method` 作为函数标识；参数、返回类型和 `ApplicationError` 归属以 Step 7 对应 trait 的完整 Rust 签名为准。本章不复制第二套签名，也不允许实现者以本章的逻辑 store 名称新增未声明方法。

### 9.1 Identity / Review / Registry repository

| Repository method | 函数类别与 exact 读取面 | key / index 语义 | version / UoW 语义 | missing / conflict 口径 |
|---|---|---|---|---|
| `CapabilityIdentityRepository::get_with_version(identity_ref)` | exact identity load；返回 `Option<Loaded<CapabilityIdentity>>` | `capability_identity_id` 精确键；ref 内的 owner/version 必须对称 | Query 可直接读；Command 在同一 operation UoW 内读取，save 使用返回的 `expected_version` | missing 保持 `None`；版本/owner 不对称为 consistency error |
| `CapabilityIdentityRepository::find_by_id(identity_id)` | current identity composition read | identity id current index；不得从 opaque ref、locator 或 URL 反解 | read-only；若在已打开的 Command UoW 内使用，只读取该 UoW 的合法 snapshot/staged view | retired 仍可 exact read，但 current composition 不将其伪装为可用 |
| `CapabilityIdentityRepository::find_by_identity_key(identity_key)` | stable identity-key duplicate guard | `identity_key` current unique constraint | create preflight 可读；最终 `save` 仍由 store unique constraint 兜底 | existing current 返回 loaded identity；并发 unique conflict 不覆盖 winner |
| `CapabilityIdentityRepository::search(scope, page)` | typed filter + stable page | identity state/source/key typed indexes；sort 为稳定 id / declared order | Query no-write；cursor 绑定 method + scope + order，跨页不重复/遗漏 | empty page 是合法结果；不将 projection / runtime filter加入 scope |
| `CapabilityIdentityRepository::save(identity, expected_version, uow)` | create or validated identity state/field update | insert key or current row CAS；identity key unique | create 只能 `None`；update 只能使用 `Loaded.expected_version`；与对应 change/trace/capture/effect 同一 UoW | stale version / unique key / terminal guard 失败时 zero accepted mutation |
| `CapabilityAccessReviewRepository::get_with_version(review_ref)` | exact review fact load | review fact id exact key；state/version/ref 对称 | Command mutation source；Query exact read可不启write UoW | missing `None`；wrong identity/state pairing 为 consistency error |
| `CapabilityAccessReviewRepository::find_current_by_identity(identity_id)` | current `Recorded` fact lookup | `(identity_id, state=Recorded)` current index；只能一个 current recorded fact | read-only；supersede flow先读取 old loaded，再在同一 UoW 保存 replacement/old sidecar | Draft/Superseded/Invalidated 不得作为 current；无记录返回 `None` |
| `CapabilityAccessReviewRepository::list_by_identity(identity_id, page)` | current + historical review page | identity id + recorded_at / fact id stable history order | Query no-write；Command 只在明确的 domain flow中读取 | page empty 合法；不得将 review 解释为 governance approval |
| `CapabilityAccessReviewRepository::save(review, expected_version, uow)` | create draft / record / supersede / invalidate | review fact id insert or CAS current row；current predicate由state约束 | create `None`；existing update loaded version；replacement fact与对应 identity link / change / trace 按 flow 同UoW | current uniqueness、terminal guard或CAS冲突整体回滚 |
| `CapabilityRegistryRepository::get_with_version(entry_ref)` | exact registry entry load | registry entry id exact key | Command source version；Query可读但不写 | missing `None`；identity/entry ref mismatch为consistency error |
| `CapabilityRegistryRepository::find_current_by_identity(identity_id)` | current non-retired registry lookup | identity id + non-terminal lifecycle current index | retirement guard / descriptor / exposure prerequisite read；同一Command UoW内参与CAS检查 | retired 不返回 current；existing current阻止重复 register |
| `CapabilityRegistryRepository::list_matching(scope, page)` | typed registry truth page | identity/lifecycle/visibility typed indexes；stable entry id order | Query no-write；不读取 directory/search/runtime/marketplace state | empty page合法；空 state filter表示all，不表示runtime allowlist |
| `CapabilityRegistryRepository::save(entry, expected_version, uow)` | register / lifecycle / visibility-basis mutation | entry id insert or CAS; one current entry per identity | create `None`；update loaded version；descriptor/exposure declared cross-owner effects与其 source flow同UoW | unique/current/terminal/CAS conflict rollback，不级联修改 descriptor或exposure |

### 9.2 Descriptor / Summary / Relation / Exposure repository

| Repository method | 函数类别与 exact 读取面 | key / index 语义 | version / UoW 语义 | missing / conflict 口径 |
|---|---|---|---|---|
| `AdapterDescriptorRepository::get_with_version(descriptor_ref)` | exact descriptor load | descriptor id + version/ref parity | Command source version；Query exact read no-write | missing `None`；wrong registry owner / terminal mismatch为consistency error |
| `AdapterDescriptorRepository::find_current_by_registry_entry(registry_entry_id)` | current Accepted/Unresolved descriptor lookup | registry entry id + current non-terminal descriptor index | establish/replace prerequisite read；save with loaded descriptor version | Replaced/Retired excluded；no current returns `None` |
| `AdapterDescriptorRepository::list_by_registry_entry(registry_entry_id, page)` | descriptor history page | registry entry id + stable descriptor id/version | Query no-write；replacement history remains readable | empty page合法；不得从runtime provider state补descriptor |
| `AdapterDescriptorRepository::save(descriptor, expected_version, uow)` | establish / replace / bind descriptor | descriptor id insert or CAS; current-by-entry constraint | create `None`；update loaded version；registry delta, change/trace/material/capture按Step 9 source flow同UoW | current uniqueness, state guard or CAS failure rollback |
| `DescriptorSafeSummaryRepository::get_risk_summary_with_version(summary_id)` | exact risk safe-summary load | risk summary id exact key | Command source version; no external resolver call | missing `None`; descriptor owner mismatch为consistency error |
| `DescriptorSafeSummaryRepository::find_current_risk_summary(descriptor_id)` | current non-superseded risk summary | descriptor id + current summary index | prerequisite / query read；save uses returned version | missing summary is missing/degraded input, not low-risk default |
| `DescriptorSafeSummaryRepository::save_risk_summary(summary, expected_version, uow)` | create/update risk safe summary | summary id insert/CAS; one current non-terminal per descriptor | create `None`;update loaded version；descriptor attach flow同UoW | forbidden-body / state / CAS conflict rollback；不得保存风险正文之外的secret body |
| `DescriptorSafeSummaryRepository::get_secret_summary_with_version(summary_id)` | exact secret-handling summary load | summary id exact key | application read only;mutation uses returned version | missing `None`;summary/ref/descriptor asymmetry为consistency error |
| `DescriptorSafeSummaryRepository::find_current_secret_summary(secret_ref_id)` | current summary by secret ref | secret ref id + current summary index | descriptor/relation prerequisite read；no secret provider call | no summary不等于secret safe；返回 `None` 由flow显式处理 |
| `DescriptorSafeSummaryRepository::find_current_secret_summary_by_descriptor(descriptor_id)` | current summary through descriptor secret-ref relation | descriptor id -> secret ref id -> current summary index；不得扫描summary body | read-only composition；若同一UoW内更新则使用 exact loaded owner | descriptor缺secret ref或多current summary为consistency error |
| `DescriptorSafeSummaryRepository::save_secret_summary(summary, expected_version, uow)` | create/update secret safe summary | summary id insert/CAS; unique current `(secret_ref_id, descriptor_id)` | create `None`;update loaded version；secret ref change + safe summary/change records按flow同UoW | body boundary、unique、CAS失败整体rollback；不写secret value |
| `GovernanceSeamRepository::get_with_version(seam_ref)` | exact body-free seam load | relation id exact key | relation Command source version | missing `None`;identity/ref/state mismatch为consistency error |
| `GovernanceSeamRepository::find_current_by_identity(identity_id)` | current non-terminal seam lookup | identity id + state subset `Pending/Active/Unresolved/Expired` | attach/replace/expire prerequisite read；same UoW save | Replaced/Forbidden excluded；Unresolved仍是current，不得当missing |
| `GovernanceSeamRepository::list_by_identity(identity_id, page)` | seam current + historical page | identity id + stable relation id/version | Query no-write；body-free fields only | empty page合法；不读取governance approval / Policy正文 |
| `GovernanceSeamRepository::save(relation, expected_version, uow)` | attach / replace / expire relation | relation id insert/CAS; one current non-terminal per identity | create `None`;update loaded version；old Replaced + new relation + change/trace/capture按flow同UoW | terminal/current/CAS conflict rollback；不得改external approval truth |
| `CapabilityMethodRelationRepository::get_with_version(relation_ref)` | exact method relation load | relation id exact key | relation Command source version | missing `None`;method asset/identity pairing mismatch为consistency error |
| `CapabilityMethodRelationRepository::find_current_by_identity(identity_id)` | current non-terminal method relation | identity id + `Pending/Active/Stale/Unresolved` current index | attach/remove prerequisite read；Unresolved remains current | Removed/Forbidden excluded；multiple current为store invariant failure |
| `CapabilityMethodRelationRepository::list_by_identity(identity_id, page)` | method relation history page | identity id + stable relation id/version | Query no-write；body-free relation only | empty page合法；不得读method body |
| `CapabilityMethodRelationRepository::list_by_method_asset(method_asset_ref_id, page)` | reverse relation page | method asset ref id + relation id index | Query / replacement audit read；no external method resolver call | missing page合法；不得反推method lifecycle或正文 |
| `CapabilityMethodRelationRepository::save(relation, expected_version, uow)` | attach / remove / stale / replacement relation mutation | relation id insert/CAS; one current relation per identity | create `None`;update loaded version；change/trace/material/capture per source flow same UoW | current uniqueness, terminal or CAS failure rollback |
| `FormalExposureRepository::get_with_version(exposure_ref)` | exact formal exposure load | exposure id exact key | exposure Command source version | missing `None`;registry owner mismatch为consistency error |
| `FormalExposureRepository::find_current_by_registry_entry(registry_entry_id)` | current non-retired exposure | registry entry id + current exposure index | visibility/exposure prerequisite read | retired excluded；duplicate current isunique constraint failure |
| `FormalExposureRepository::list_by_registry_entry(registry_entry_id, page)` | exposure history page | registry entry id + stable exposure id/version | Query no-write；history exact readable | empty page合法；不读取runtime authorization / SDK package |
| `FormalExposureRepository::save(exposure, expected_version, uow)` | establish/update/suspend/retire exposure | exposure id insert/CAS; one current per registry entry | create `None`;update loaded version；final visibility and actual registry lifecycle delta same UoW when flow declares | source version mismatch, unique or CAS conflict rollback |
| `FormalVisibilityRepository::get_with_version(visibility_id)` | exact visibility applicability load | visibility id exact key | exposure mutation / query read;save uses loaded version | missing `None`;source exposure version mismatch is consistency error |
| `FormalVisibilityRepository::find_current_by_exposure(exposure_id)` | current visibility fact | exposure id + one current visibility index | exposure update final-normalization read;no runtime allowlist read | missing is explicit prerequisite failure or no-current branch, never synthesized |
| `FormalVisibilityRepository::save(visibility, expected_version, uow)` | create/final normalized applicability | visibility id insert/CAS; one current per exposure | create `None`;update loaded version;`source_exposure_version == final exposure.version` must hold in same UoW | stale source, applicability guard or CAS conflict rollback |

### 9.3 Repository method coverage checkpoint

| group | traits | exact methods covered | result |
|---|---:|---:|---|
| identity / review / registry | 3 | 13 | pass |
| descriptor / safe summary / governance seam / method relation / exposure / visibility | 6 | 27 | pass |
| cumulative | 9 | 40 | pending remaining 13 repository traits |

No method in §§9.1~9.2 opens a hidden transaction, scans body text, changes a state without a domain callable, or introduces a second owner for governance, method, secret, runtime, SDK, marketplace, or audit truth.

### 9.4 Change / Trace / Impact repository

| Repository method | 函数类别与 exact 读取面 | key / index 语义 | version / UoW 语义 | missing / conflict 口径 |
|---|---|---|---|---|
| `CapabilityChangeRecordRepository::append_identity_change(record,uow)` | immutable identity change append | typed identity-change ref unique；identity subject index | 与accepted identity revision同一UoW；insert-only | duplicate/ref/payload asymmetry回滚；不得overwrite |
| `CapabilityChangeRecordRepository::append_registry_change(record,uow)` | immutable registry change append | typed registry-change ref unique；registry subject index | 与accepted registry revision同一UoW；insert-only | duplicate/ref/payload asymmetry回滚；不得overwrite |
| `CapabilityChangeRecordRepository::append_descriptor_change(record,uow)` | immutable descriptor change append | typed descriptor-change ref unique；descriptor subject index | 与accepted descriptor/summary revision同一UoW；insert-only | duplicate/ref/payload asymmetry回滚；不得overwrite |
| `CapabilityChangeRecordRepository::append_governance_seam_change(record,uow)` | immutable governance-seam change append | typed seam-change ref unique；seam subject index | 与accepted seam revision同一UoW；insert-only | duplicate/ref/payload asymmetry回滚；不得overwrite |
| `CapabilityChangeRecordRepository::append_method_relation_change(record,uow)` | immutable method-relation change append | typed relation-change ref unique；method relation subject index | 与accepted method relation revision同一UoW；insert-only | duplicate/ref/payload asymmetry回滚；不得overwrite |
| `CapabilityChangeRecordRepository::append_exposure_change(record,uow)` | immutable exposure/view change append | typed exposure-change ref unique；exact exposure or controlled-view subject index | 与accepted exposure/view revision同一UoW；insert-only | wrong subject kind/duplicate/asymmetry回滚；不得overwrite |
| `CapabilityChangeRecordRepository::get(change_ref)` | exact typed union read | typed ref direct lookup；requested variant必须等于stored variant | Query / flow prerequisite no-write | absent返回`None`；variant mismatch不是missing,而是consistency error |
| `CapabilityChangeRecordRepository::list_by_subject(subject, page)` | subject history page | subject + recorded time + typed id stable order | Query no-write；cursor scope-bound | empty合法；不得按serialized reason或event name扫描 |
| `CapabilityTraceabilityRepository::get_revision(trace_ref)` | exact historical revision read | `(traceability_id, exact version)` | no-write；不返回next-save token | absent exact revision返回`None`,不得fallback current/latest |
| `CapabilityTraceabilityRepository::get_current_with_version(trace_ref)` | current highest revision + persisted token | traceability id current-highest index；historical ref不得命中 | append next revision只用returned expected version | missing `None`;multiple highest / version gap consistency error |
| `CapabilityTraceabilityRepository::find_current_by_change(change_ref)` | current trace covering immutable change | change ref reverse index -> current trace | read-only；used by impact/handoff flow | missing显式处理；不得扫描trace body或external logs |
| `CapabilityTraceabilityRepository::list_by_subject(subject, page)` | all accepted revisions history | subject + trace id + version stable order | Query no-write | empty合法；不按external observability time排序 |
| `CapabilityTraceabilityRepository::append_revision(record, expected_previous_version, uow)` | first/next append-only revision | `(record id, version)` unique; current-highest compare | first `None`;next exact current token；与declared records/capture/result同UoW | concurrent successor、noncontiguous version、field invariant failure rollback |
| `CapabilityImpactRepository::get_impact_with_version(impact_ref)` | exact impact current object load | impact id exact key | mutation source / Query read；save uses returned token | missing `None`;trace/consumer/source mismatch consistency error |
| `CapabilityImpactRepository::find_impact_by_traceability(trace_ref)` | current impact derived from exact trace revision | exact trace ref unique/current reverse index | no-write lookup before create/update | multiple impacts违反declared current uniqueness |
| `CapabilityImpactRepository::list_impacts_by_consumer(consumer_ref, page)` | consumer-bound impact page | typed consumer ref + impact id stable order | Query no-write；no runtime execution lookup | empty合法；cursor cannot cross consumer scope |
| `CapabilityImpactRepository::save_impact(impact, expected_version, uow)` | create/update impact fact | impact id insert/CAS; trace/source/consumer indexes transactionally maintained | create `None`;update loaded token；matching change/trace/capture/result perflow sameUoW | unique/CAS/state conflict rollback；no exposure mutation |
| `CapabilityImpactRepository::get_downstream_summary_with_version(summary_ref)` | exact feedback summary load | summary id exact key | mutation/query read | missing `None`;payload/source mismatch consistency error |
| `CapabilityImpactRepository::find_downstream_summary_by_source_feedback(source_feedback_ref)` | inbound source dedup lookup | source event ref unique index | Consumer preflight / accepted path read；does not itself replay receipt | duplicate summary plus missing stored receipt is explicit inconsistency,not rerun permission |
| `CapabilityImpactRepository::list_downstream_summaries(scope, page)` | typed AND-filter page | exact impact / consumer / changed subject / observed range indexes | Query no-write；stable composite order | empty合法；不得 parse safe summary text or return arbitrary first page ascomplete |
| `CapabilityImpactRepository::save_downstream_summary(summary, expected_version, uow)` | create/update body-free feedback summary | summary id insert/CAS; source feedback unique; impact/consumer/subject/time indexes | create `None`;update loaded token；typed receipt and completion sameUoW forConsumer | dedup/CAS conflict leaves winner unchanged；does not rollback upstream source truth |

### 9.5 Controlled View / Derived Material / Report / Truth Snapshot repository

| Repository method | 函数类别与 exact 读取面 | key / index 语义 | version / UoW 语义 | missing / conflict 口径 |
|---|---|---|---|---|
| `ControlledConsumerViewRepository::get_with_version(view_ref)` | exact current view load | consumer view id exact key | source stale / Job refresh save token | explicit stale/partial/unavailable object remains readable；missing `None` |
| `ControlledConsumerViewRepository::find_current_by_exposure_and_consumer(exposure_id, consumer_ref)` | compound current view lookup | unique `(exposure_id, consumer_ref)` | read-only prerequisite；create/update branch selection | multiple current is invariant failure；missing never synthesized fromexposure |
| `ControlledConsumerViewRepository::list_matching(scope, page)` | consumer-bound projection page | consumer + explicit exposure ids + freshness states + stable view id | Query no-write；scope empty exposure set means declared all-for-consumer | empty page合法；no runtime allowlist/ranking |
| `ControlledConsumerViewRepository::list_affected_by_truth(subject, page)` | truth dependency candidate page | normalized truth dependency row `(subject, ControlledView, view_id)` | collect phase only；returns current Loaded token；no hidden write UoW | index hit + missing/wrong owner isconsistency error；full-table scan forbidden |
| `ControlledConsumerViewRepository::list_affected_by_reference(subject, page)` | reference dependency candidate page | normalized reference dependency row `(subject, ControlledView, view_id)` | collect phase only；reference marker must exist in source versions | mismatch/missing rollback source flow；no locator scan |
| `ControlledConsumerViewRepository::save(view, expected_version, uow)` | create/final refresh/stale revision | view id insert/CAS; compound owner and dependency rows atomically replaced | create `None`;update own Loaded token；matching availability capture/source flow sameUoW | CAS/owner/dependency conflict rollback；projection cannot mutate exposure |
| `CapabilityDerivedMaterialRepository::get_directory_projection_with_version(projection_ref)` | exact directory projection load | projection id exact key | stale/rebuild source token | missing `None`;wrong registry owner/source marker consistency error |
| `CapabilityDerivedMaterialRepository::get_audit_export_with_version(export_ref)` | exact audit export load | export id exact key | stale/rebuild source token | missing `None`;wrong trace/scope/source marker consistency error |
| `CapabilityDerivedMaterialRepository::get_ecosystem_discovery_with_version(discovery_ref)` | exact ecosystem discovery load | discovery id exact key | stale/rebuild source token | missing `None`;wrong exposure/context/source marker consistency error |
| `CapabilityDerivedMaterialRepository::find_directory_projection_by_registry_entry` | directory current owner lookup | unique registry entry -> current projection | Query/Job read-only | explicit degraded object returned；missing no fallback toregistry rebuild |
| `CapabilityDerivedMaterialRepository::search_directory_projections(scope,page)` | directory projection search/browse | body-free normalized text/facet indexes + stable projection id | Query no-write；search backend may optimize butcannot ownresult | empty legal；no registry creation/marketplace ranking |
| `CapabilityDerivedMaterialRepository::save_directory_projection(projection,expected_version,uow)` | create/final refresh/stale revision | projection id insert/CAS; registry owner anddependency rows | own token;capture + Job target outcome same targetUoW whenJob | CAS/index conflict rollback；no intermediate Rebuilding save in current flow |
| `CapabilityDerivedMaterialRepository::find_audit_export_by_traceability(trace_ref,scope)` | exact current export compound lookup | unique exact trace revision + normalized export scope | Query/Job read-only | missing no synthesized export；scope equality,not raw query parsing |
| `CapabilityDerivedMaterialRepository::list_audit_exports_by_scope(scope,page)` | scope-bound export page | normalized body-free scope + export id | Query no-write | empty legal；no external audit body |
| `CapabilityDerivedMaterialRepository::save_audit_export(export,expected_version,uow)` | create/final refresh/stale revision | export id insert/CAS; trace/scope owner anddependency rows | own token；capture + Job success same targetUoW | mismatch/CAS rollback；resolved-ref set replaced onlybydomain refresh |
| `CapabilityDerivedMaterialRepository::find_ecosystem_discovery(exposure_id,context_ref)` | compound current discovery lookup | unique exposure + ecosystem context | Query/Job read-only | missing no marketplace lookup orlisting creation |
| `CapabilityDerivedMaterialRepository::save_ecosystem_discovery(discovery,expected_version,uow)` | create/final refresh/stale revision | discovery id insert/CAS; compound owner anddependency rows | own token；capture + Job success same targetUoW | CAS/source mismatch rollback；no marketplace truth |
| `CapabilityDerivedMaterialRepository::list_material_refs(scope,page)` | typed derived material scan | material-kind/current owner/dependency indexes；scope-specific stable kind/id order | collect/planning read；returned ref isnot expected version | `MutableAffected*` excludes reconciliation report/view asdeclared；index mismatch explicit error |
| `CapabilityReconciliationReportRepository::get(report_ref)` | exact immutable report read | report id exact key | no-write | missing `None`;report state/payload invariant failure explicit |
| `CapabilityReconciliationReportRepository::list_by_scope(scope,page)` | immutable report history page | normalized reconciliation scope + generated time + report id | Query/planning no-write | empty legal；does not select a mutable current truth |
| `CapabilityReconciliationReportRepository::find_by_job_run(run_id)` | report association lookup fordeclared query/planning only | job run -> immutable report index | no-write；never duplicate Job replay source | multiple when contract expects one/asymmetry isconsistency error；cannot replace stored Job envelope |
| `CapabilityReconciliationReportRepository::append(report,uow)` | immutable report append | report id unique; scope/run fields indexed | target effect UoW withsnapshot/capture andjournal success whenJob | duplicate/different body conflict rollback；no update/delete |
| `CapabilityTruthSnapshotRepository::load_snapshot_page(scope,page)` | virtual committed truth-ref/version page | scope-specific union indexes + stable typed ref order | no writes; reads one committed page snapshot；planning freezes returned refs/versions injournal | cursor/scope mismatch error；missing referenced object later becomes target failure,not widened rescan |

Derived material dependency rows are logical secondary indexes owned by the material store,not independent truth objects。A material save atomically replaces its previous truth/reference dependency rows with the exact `source_versions` carried by the new object。Deleting dependency rows without deleting/replacing the owner revision,or leaving rows that point to a different current revision,is a consistency defect。

### 9.6 Repository method coverage checkpoint

| group | traits | exact methods covered | result |
|---|---:|---:|---|
| prior identity / relation groups | 9 | 40 | pass |
| change / trace / impact | 3 | 21 | pass |
| controlled view / derived / report / truth snapshot | 4 | 23 | pass |
| cumulative | 16 | 84 | pending remaining 6 repository traits |

### 9.7 External Reference / Canonical State repository

| Repository method | 函数类别与 exact 读取面 | key / index 语义 | version / UoW 语义 | missing / conflict 口径 |
|---|---|---|---|---|
| `CapabilityExternalReferenceRepository::get_with_version(subject)` | typed external-reference union exact load | `ReferenceSubjectRef` typed key；subject variant、reference kind、object id和resolution state id必须对称 | Command source version；Query paired read no-write | missing `None`;union/subject/kind asymmetry为consistency error |
| `CapabilityExternalReferenceRepository::find_by_candidate_digest(kind, candidate_digest)` | same-kind duplicate / replacement guard | `(ReferenceKind, canonical candidate_digest)` unique within family；不得由adapter重算digest | pre-create read；最终save仍以unique constraint兜底 | existing loaded reference returned；different kind cannot collide；race winner unchanged |
| `CapabilityExternalReferenceRepository::list(scope, page)` | explicit reference refresh scan | typed scope + canonical state relation;stable typed id order | Query / Job planning no-write；cursor绑定scope/kind/order | `NonResolved`显式包含Unresolved/Stale/Unavailable/Invalid/Forbidden/Expired；不得把状态missing |
| `CapabilityExternalReferenceRepository::save(reference, expected_version, uow)` | register / replace body-free reference | typed subject id insert/CAS；candidate digest and state-link indexes atomically maintained | create `None`;update exact loaded token；reference state create/update and declared capture/result sameUoW | forbidden body、kind/state asymmetry、unique/CAS conflict整体rollback |
| `ReferenceResolutionStateRepository::get_with_version(state_ref)` | exact canonical state load | resolution state id exact key | Command source version；Query exact read no-write | missing `None`;subject/kind/state-id mismatch explicit consistency failure |
| `ReferenceResolutionStateRepository::find_current_by_subject(subject)` | single canonical current state lookup | one current state id per `ReferenceSubjectRef` | reference guard / refresh read；save uses loaded token | no state returns explicit missing/prerequisite；never creates second state |
| `ReferenceResolutionStateRepository::list_by_reference_scope(scope, page)` | canonical state scan for refresh / Query | scope -> reference subject and state indexes;stable subject/state id order | planning read only；state transitions happen in application UoW | all declared resolution values remain visible;adapter must not collapse terminal or degraded state |
| `ReferenceResolutionStateRepository::save(state, expected_version, uow)` | initial / successor canonical state revision | state id insert/CAS;subject current unique;ref object state link parity checked in same UoW | create `None`;successor loaded token；actual state change + affected material capture + result/journal according to flow | same value/reason no-op is no save;terminal Invalid/Forbidden cannot reopen;CAS conflict rollback |

### 9.8 Idempotency / Stored Result / Event Capture / Job Journal repository

| Repository method | 函数类别与 exact 读取面 | key / index 语义 | version / UoW 语义 | missing / conflict 口径 |
|---|---|---|---|---|
| `CapabilityIdempotencyRepository::get_with_version(key)` | exact reservation / duplicate / reserved reentry read | normalized operation idempotency key only | established duplicate may read before Clock/UoW;reserved reentry uses exact loaded token | missing means absent preflight;completed/mismatch is application classification,not adapter mutation |
| `CapabilityIdempotencyRepository::reserve_if_absent(reservation,uow)` | atomic absent-key reservation | one winner per normalized key;unique check and insert are one operation | same fresh initial UoW as accepted local effects or Job journal create | `Reserved(Loaded<_>)` returns adapter-assigned persisted token;`Existing(Loaded<_>)` leaves winner unchanged |
| `CapabilityIdempotencyRepository::save(reservation,expected_version,uow)` | only `Reserved -> Completed` CAS update | key exact;result ref must be absent before completion and cannot be cleared/replaced after Completed | CAS token only from reservation read/create;sameUoW as stored result and final local effects | stale/CAS/terminal overwrite or any non-two-state value is rejected and rolled back;no conflict-state write |
| `StoredCapabilityResultRepository::get(result_ref)` | generic command result/rejection shell + surface paired read | application result ref -> shell/surface exact pair | read-only duplicate replay;no current truth reconstruction | missing, digest or kind mismatch is explicit consistency/persistence failure |
| `StoredCapabilityResultRepository::get_surface(surface_ref)` | exact serialized surface read | surface ref exact;digest verified against non-empty bytes | read-only;caller may not select a decoder from bytes | missing/digest mismatch failure;no fallback source rebuild |
| `StoredCapabilityResultRepository::save(result,surface,uow)` | generic immutable command shell/surface insert | result ref and surface ref unique;operation/kind/disposition/digest symmetric | insert-only in accepted/rejected stable result UoW;idempotency completion sameUoW | same ref with different bytes/digest conflicts;no overwrite |
| `StoredCapabilityResultRepository::get_consumer_receipt(result_ref)` | typed inbound receipt replay | result ref -> `ConsumerReceipt` + `InboundEvent` + typed envelope exact pair | read-only duplicate path;no resolver or local effect | missing/envelope/surface/effect ref asymmetry explicit failure |
| `StoredCapabilityResultRepository::save_consumer_receipt(result,surface,envelope,uow)` | typed consumer receipt insert | result/surface/envelope operation,source,receipt refs and digest all symmetric | same accepted Consumer UoW as declared ref/state/summary effect and idempotency completion | any mismatch rolls back all local effect;generic bytes-only save forbidden |
| `StoredCapabilityResultRepository::get_job_report(result_ref)` | typed eight-variant Job report replay | result ref -> JobReport shell/surface/operation/job/schema/run/variant exact pair | read-only duplicate path;must not use report-by-run or rescan | missing/variant/run/schema/digest mismatch explicit failure |
| `StoredCapabilityResultRepository::save_job_report(result,surface,envelope,uow)` | typed Job report insert | result/surface/envelope/detail result refs and fresh disposition symmetric | same final-report UoW as journal Finalized and idempotency Completed | terminal report immutable;generic shell-only save or report reconstruction forbidden |
| `CapabilityEventCaptureRepository::get_with_snapshot(capture_ref)` | exact current capture + immutable payload snapshot paired read | capture id -> snapshot id;five-tuple and bytes/digest symmetry | read-only facade/repair source;returns `Loaded` capture token | missing snapshot/asymmetry/digest failure;never return `None` or rebuild from source |
| `CapabilityEventCaptureRepository::find_by_source_and_schema(source_ref,schema_ref)` | unique source/schema capture lookup | `(source_ref,schema_ref)` unique;candidate digest checked from stored snapshot | source flow duplicate guard;no hidden UoW | same key/different snapshot is collision;not a second capture |
| `CapabilityEventCaptureRepository::list(scope,page)` | explicit capture or AwaitingIntent recovery page | scope typed;AwaitingIntent means `Captured + intent=None`;stable capture id order | repair planning read;cursor method/scope bound | missing snapshot in hit is consistency failure;no source reload |
| `CapabilityEventCaptureRepository::capture(snapshot,capture,uow)` | immutable snapshot + initial Captured insert | snapshot id unique;source/schema unique;capture points to one snapshot;state/nullability fixed | same source-owning UoW as final source revision and declared local sidecars | partial snapshot/capture commit forbidden;external collaboration not called inside UoW |
| `CapabilityEventCaptureRepository::bind_intent(capture,expected_version,uow)` | Captured -> IntentBound CAS bind | capture id exact;immutable five-tuple unchanged;one stable intent | short source-continuation UoW or repair target UoW;token only from Loaded capture | stale/mismatch/second bind rollback;does not write external status |
| `CapabilityJobExecutionRepository::get_with_version(key)` | only reserved Job journal recovery read | normalized idempotency key only;no run/target/scope alternate index | reserved reentry exact token | missing/asymmetric journal is consistency failure;no rescan/start-over |
| `CapabilityJobExecutionRepository::create(execution,uow)` | complete Planned journal insert | one journal per normalized key;plan ordinal contiguous/unique;run issues typed and duplicate-free | same initial UoW as fresh idempotency reservation;returns persisted initial token | existing key/partial plan/terminal payload rejected;no upsert |
| `CapabilityJobExecutionRepository::save(execution,expected_version,uow)` | one monotonic target terminal,run issue,or finalization CAS | plan/ordinal/target refs immutable;terminal payload immutable;final result ref one-way | token from create/latest exact load;target effect or final report set shares same UoW | plan mutation/terminal overwrite/stale token rollback;no list/scan/lease/attempt methods |

### 9.9 Exact repository coverage and persistence gate

| repository family | traits | exact methods | logical stores covered |
|---|---:|---:|---|
| identity / review / registry | 3 | 13 | 3 core truth stores |
| descriptor / summary / relation / exposure | 6 | 27 | 6 truth / safe-summary stores |
| change / trace / impact | 3 | 21 | immutable records + 2 versioned impact stores |
| controlled view / derived / report / truth snapshot | 4 | 23 | 1 view + 3 material + report + virtual snapshot |
| external reference / canonical state | 2 | 8 | ref union + canonical state |
| idempotency / stored result / capture / Job journal | 4 | 18 | reservation + 4 result surfaces + snapshot/capture + journal |
| **total** | **22** | **110** | **all Step 7 repository traits** |

Mechanical closure:

```text
repository_traits = 22
repository_methods = 110
step_7_declared_repository_traits = 22
step_7_declared_application_ports = 36
uncovered_repository_traits = 0
uncovered_repository_methods = 0
new_repository_method = 0
```

No repository method opens a nested transaction, performs a business transition without a Step 6 callable, or reconstructs forbidden external body. All 110 methods have an owner, exact Step 7 signature, logical store, key/index rule and failure category; exact error variants remain Step 12.

---

## 10. Transaction Boundary与保存顺序

### 10.1 Transaction boundary总表

| 场景 | 开始位置 | local atomic members | 物理保存顺序约束 | 提交 / 回滚 | 外部阶段与恢复源 |
|---|---|---|---|---|---|
| 26 Command fresh accepted / stable stored rejection | application service在reserve前完成body/metadata validation后开始 | exact domain truth / relation / reference state、declared change records、trace revision、actual affected material stale revisions、event snapshot/capture、typed/generic result surface、idempotency completion | 先读取并校验所有prerequisite；再按source owner写truth/state；随后append change/trace；再写affected material/index rows和capture；最后insert result/surface并CAS complete reservation。具体 family order见§10.2~§10.4 | 任一constraint、CAS、capture、result或completion失败，整个UoW rollback；不得只提交core truth | resolver read可在UoW前/内发生但不可回滚；handoff/collaboration仅commit后；duplicate读immutable stored result |
| 33 Query | 不开始write UoW | none | resolver-first后执行exact/current/history/page reads | no commit/rollback | 每次重新评估read visibility；不refresh/rebuild/repair |
| 6 Inbound Consumer accepted / stable terminal disposition | consumer service在reserve race确认fresh后开始 | declared external ref / canonical state或downstream summary、optional reference snapshot/capture、typed receipt + shell/surface、idempotency completion | 先写declared ref/state/summary；实际revision再写capture；typed receipt/shell/surface；最后complete reservation | local writes和receipt/completion同UoW；resolver read失败不产生local result；保存失败整体rollback | external resolver不可回滚；duplicate先typed `get_consumer_receipt`，不调用resolver |
| Outbound Phase A source capture | source-owning service已有caller UoW | exact final source revision / append record、complete payload snapshot、initial Captured record及flow declared sidecars | source object/record先在内存形成并校验；mapper/serialize；snapshot insert；capture insert；source + snapshot + capture一起commit | 任一source/mapper/snapshot/capture失败全部rollback；没有“source已提交、capture稍后补” | Phase B读取official capture/snapshot；Phase C独立bind UoW；external failure不回滚source |
| Outbound Phase B collaboration | source UoW已提交后，无local write UoW | none | load capture+snapshot；construct candidate；call external Port；validate source/intent symmetry | no local commit;external call不受本地rollback语义约束 | failure leaves Captured or already IntentBound official local record；repair使用same candidate/intent |
| Outbound Phase C intent binding | external typed outcome已返回后begin short UoW | one capture CAS `Captured -> IntentBound` | validate loaded five-tuple；domain bind；capture repository CAS save；commit | stale/mismatch rollback leaves Captured；不得保存external delivery status | capture AwaitingIntent scan / exact capture read；不创建second snapshot |
| Job initial | deterministic plan已完整形成后begin initial UoW | fresh idempotency `Reserved` + complete `CapabilityJobExecutionRecord::Planned` + initial run issues | reserve absent key；create complete journal；commit both atomically | reserve/create/constraint failure rollback both；concurrent Existing rollback request plan | exact normalized-key journal；never rescan scope |
| Job target actual effect | select first Planned target after exact journal load；begin target UoW | one target declared material/report/reference effect、matching snapshot/capture when changed、journal one terminal outcome | source/revision effect；capture if actual changed；record terminal outcome；journal CAS save；commit target | only current target rollback；earlier targets remain committed；after confirmed rollback can save typed Failed/Skipped in no-effect UoW | exact journal next Planned target；terminal payload immutable |
| Job target no-effect failure / PreclassifiedFailure | after rollback confirmation or directly for preclassified target begin no-effect UoW | journal only `record_failed` / `record_skipped` + CAS save | exact reload journal；record target outcome；save;commit | no source/material/capture writes allowed；failure before rollback completion forbidden | next Planned target or final assembly fromjournal |
| Job final report | all targets terminal and exact journal/reservation reload complete后begin final UoW | typed Job report shell/surface/envelope、journal Finalized + final result ref、idempotency Completed same result ref | insert typed report;finalize journal CAS;complete reservation CAS;commit all | any final write failure leaves journal Planned / reservation Reserved and earlier target outcomes durable | reserved reentry retries pure final assembly;completed duplicate typed report only |

### 10.2 Command accepted save ordering

Every accepted Command follows the shared guard, then one of the family-specific source pipelines below. The pipeline is an ordering contract, not a generic service or hidden method:

```text
validate typed request / operation metadata
  -> canonical digest location (Step 13-owned algorithm)
  -> exact duplicate preflight (read-only)
  -> begin UoW
  -> atomic reserve_if_absent
  -> load exact prerequisites and capture every Loaded.expected_version
  -> invoke Step 6 factory/member/policy in application order
  -> save source-owned truth / reference state using own token
  -> append matching change record(s) in declared stable record order
  -> append one trace revision when flow declares it
  -> collect affected candidates before any material mutation
  -> mark/save each actual non-stale material with own token and capture revision
  -> map/freeze/save each declared outbound snapshot + initial capture
  -> build and save immutable result shell + surface
  -> complete reservation using Reserved(Loaded<CapabilityIdempotencyRecord>).expected_version
  -> commit
  -> only then call audit handoff / event collaboration when flow declares it
```

Ordering constraints:

1. `save` of a source owner cannot be committed without its required append-only change/trace and declared local snapshot/capture.
2. A material dependency index row is written as part of the material owner save; no index update can be committed independently.
3. A result surface cannot be visible with `IdempotencyState::Completed` absent the exact same `CapabilityApplicationResultRef` and matching immutable surface.
4. A no-op source branch skips the source save, change, trace, capture, material and result side effects specified as zero by its flow; it may still persist a stable stored no-op response if the protocol says so.
5. Post-commit external outcome never reopens the UoW, changes stored response disposition or fabricates a delivery success.

### 10.3 Command family membership table

| Command family | source writes | record / trace writes | material / capture | result / completion |
|---|---|---|---|---|
| identity / review (4) | identity or review fact;review link where declared | identity change record(s),one trace revision when flow declares | identity change capture;actual dependent material stale only when Step 9 effect declares | generic command shell/surface + completion |
| registry (4) | registry entry/lifecycle/visibility basis | registry change record + trace | registry capture;affected view/material stale union | generic result + completion |
| descriptor / summary / secret (4) | descriptor and/or safe summary;secret ref/state relation | descriptor record(s) in stable kind order + trace | descriptor/safe-summary captures;affected material union | generic result + completion |
| governance seam / method relation (5) | relation and canonical ref/state where declared | relation change + trace | relation capture;affected material where declared | generic result + completion |
| formal exposure / visibility (4) | exposure;final visibility;actual registry delta when target changes | exposure change + trace | exposure/view/material captures per actual revision | generic result + completion |
| impact / trace handoff (2) | impact or trace revision | trace revision only for handoff flow;impact identified record per flow | impact capture only where outbound source exists;handoff no event capture | generic result + completion;handoff post-commit ifSome |
| reference (3) | external ref and/or canonical state | no fabricated core change;reference state change is exact source | reference capture on actual state revision;affected view/material stale where declared | generic result + completion |

The table is a transaction membership index for the 26 exact flows; it does not merge their domain callables or state matrices. Each flow's Step 9 card remains authoritative for whether a row is absent, no-op, reserved or actual.

### 10.4 Inbound Consumer ordering

```text
trusted source / schema / actor validation
  -> typed payload + operation context + digest
  -> completed duplicate preflight -> typed receipt replay, no UoW
  -> begin UoW and atomic reserve_if_absent
  -> call only declared resolver / local repository read
  -> form exact ref/state or downstream summary effect
  -> save owner with own expected version
  -> if actual canonical revision: snapshot + capture in same UoW
  -> save typed consumer receipt + shell + surface
  -> complete reservation with returned Loaded token
  -> commit
```

The six inbound flows never write identity, registry, descriptor, governance seam, method relation, formal exposure, controlled view, directory, audit export, ecosystem discovery or external collaboration truth. Resolver response is an input observation, not a rollback-able local write. A local persistence failure after resolver return leaves no stored receipt and permits the declared retry classification; it does not reverse the external observation.

### 10.5 Outbound source and collaboration ordering

| phase | required writes / calls | transaction rule |
|---|---|---|
| A source-owned | exact source revision + complete Step 8 envelope snapshot + `CapabilityEventCaptureRecord::capture` | same caller UoW;capture failure rolls back source |
| B external | `get_with_snapshot` -> candidate from stored snapshot -> `CapabilityAccessEventCollaborationPort::{collaborate,get}` | after source commit;no local transaction;no current-source rebuild |
| C local bind | `CapabilityEventCaptureRecord::bind_intent` + `CapabilityEventCaptureRepository::bind_intent` | independent short UoW;only capture CAS;failure keeps Captured |
| Repair Job captured target | stored capture candidate -> external collaborate -> capture bind + journal success | external call before target UoW;bind and journal success same target UoW;facade nested short UoW forbidden |
| Repair Job bound/intent target | external exact `get`/`repair` -> journal success/failure only | no capture mutation;journal-only target UoW |

No row in this table creates a local delivery-state store. `EventCollaborationStatus` remains external Port-owned, and event capture only stores the stable intent binding needed to re-enter that boundary.

### 10.6 Job initial / target / final ordering

| phase | exact ordered operations | atomicity / crash visibility |
|---|---|---|
| planning before transaction | validate scope;expand exact typed targets;freeze source refs/versions;assign contiguous ordinals;form typed planning issues | no reservation/journal;unsafe failure leaves no durable operation |
| initial UoW | `reserve_if_absent` -> `CapabilityJobExecutionRecord::create` -> commit | reservation and full plan visible together;fresh target effects cannot start before commit |
| target success | exact reload journal -> external read/collaborate if declared -> begin target UoW -> material/ref/state effect -> snapshot/capture if changed -> `record_succeeded` -> journal CAS save -> commit | one target effect and terminal success visible together;earlier committed targets survive later failures |
| target stable failure / skip | prove target UoW rollback or preclassified zero-effect -> exact journal reload -> `record_failed`/`record_skipped` -> journal CAS save -> commit | terminal outcome never claims an effect that committed;target identity retained |
| target conflict/reentry | rollback current target;exact reload journal;preserve concurrent terminal if present | no terminal overwrite;do not re-run completed target |
| final UoW | exact reload all-terminal journal + reservation -> assemble only journal outcomes -> save typed report -> `finalize` journal -> complete reservation -> commit | report, Finalized and Completed share result ref;failure leaves Planned/Reserved for final retry |
| completed duplicate | exact idempotency read -> typed `get_job_report` -> response-only DuplicateReplayed mapping | no scan/resolver/rebuild/collaboration or mutation |

### 10.7 Query no-write boundary

The 33 Query flows may call the read-visibility resolver and exact repository reads, including current/history/page/affected inspection reads where their card explicitly permits them. They must not call:

- `CapabilityUnitOfWorkManager::begin`, `commit` or `rollback`;
- any `save`, `append`, `reserve_if_absent`, `capture`, `bind_intent`, `create` or `finalize` callable;
- external resolver refresh, audit handoff, event collaboration or repair;
- projection rebuild, stale marking, canonical reference transition or missing-truth creation.

A Query may read a degraded/stale/unavailable persisted material and must map that state into its public response. Missing is not permission to rebuild or query the core truth as a hidden fallback.

---

## 11. Version、Identity、Cursor与Index规则

### 11.1 Optimistic version source

| mutation kind | version source | allowed save token | forbidden substitute |
|---|---|---|---|
| create versioned owner | no prior row | `expected_version = None` | caller `1` as update token、timestamp、cursor |
| update current truth / relation / summary / material / reference state | exact `Loaded<T>` returned by matching repository method | `Some(loaded.expected_version)` | mutated object `version`、fresh reread after mutation、other owner version |
| trace successor revision | `get_current_with_version` result | `expected_previous_version = Some(loaded.expected_version)` | trace time、event sequence、history count |
| idempotency completion | `Reserved(Loaded<CapabilityIdempotencyRecord>)` | exact reservation loaded token | assumed create version、object version、second pre-completion read |
| capture intent bind | `get_with_snapshot` result | exact capture `Loaded.expected_version` | payload snapshot version、external intent attempt number |
| Job journal target/final save | `create` or latest exact `get_with_version` result | exact journal loaded token | JobRunId、target ordinal、idempotency token、timestamp |

The object `version` is persisted domain data and may be checked for symmetry, but it is not an independent caller-provided concurrency token. A durable adapter must compare the supplied expected token against its persisted row version inside the same write operation; a fake must reject the same stale token.

### 11.2 Current and history indexes

1. A current index is a query / uniqueness surface over the owner-specific non-terminal subset from Step 10; it is not a second status field.
2. Terminal rows remain exact-readable when the corresponding repository exposes exact/history methods, but they are excluded from current prerequisite methods.
3. Every current lookup must use the owner key declared in §§8~9: identity, registry entry, descriptor, relation identity, exposure, visibility, trace revision, reference subject, consumer/exposure, or typed material scope. No generic `status = Active` index is allowed.
4. If a current uniqueness rule is conditional on state, the application performs the typed state guard and the durable/fake store enforces the same conditional uniqueness. A failed store constraint is a persistence/application conflict, not a reason to pick a different winner.

### 11.3 Dependency indexes for stale propagation

| index family | owner | key | returned surface | mutation timing |
|---|---|---|---|---|
| truth -> controlled view | `ControlledConsumerViewRepository` | `(CapabilityTraceSubjectRef, view_id)` | current `Loaded<ControlledConsumerView>` | atomically replaced with view source markers |
| reference -> controlled view | `ControlledConsumerViewRepository` | `(ReferenceSubjectRef, view_id)` | current `Loaded<ControlledConsumerView>` | atomically replaced with reference source markers |
| truth/reference -> derived material | `CapabilityDerivedMaterialRepository` | `(source subject, material kind, material id)` | typed `DerivedMaterialRef` page | atomically replaced with material `source_versions` |
| trace -> audit export | `CapabilityDerivedMaterialRepository` | `(trace revision, export scope, export id)` | exact/current export | replaced with final body-free ref set |
| impact -> downstream summary | `CapabilityImpactRepository` | `(impact_fact_ref, summary_id)` | paged typed summary | maintained with summary save |
| method asset -> relation | `CapabilityMethodRelationRepository` | `(method_asset_ref_id, relation_id)` | current/history relation page | maintained with relation save |

Affected scans are collect-only. The application first consumes every page, validates cursor continuity, deduplicates typed refs, and only then calls owner-specific exact get/save methods. It must not mutate the first page before obtaining the complete candidate set.

### 11.4 Cursor and page semantics

- A repository cursor is opaque application-local state bound to method name, validated scope, sort definition and last stable key. It is not a business ref, version token, resume journal or public protocol field.
- Durable and fake adapters must return the same stable ordering, empty-page behavior, next-cursor behavior and scope mismatch failure. A cursor from one repository method or scope must never be accepted by another.
- An affected-material page must not use a mutable owner version as cursor. The page carries current loaded values or typed refs; each actual save uses the exact loaded value's own expected token.
- `CapabilityTruthSnapshotRepository::load_snapshot_page` is a page of committed typed refs and versions, not a claim that all source rows form one global atomic snapshot. Job planning freezes that page-derived plan into the Job journal.

### 11.5 Typed union and owner symmetry

For every stored union, the adapter must validate variant symmetry before returning or committing:

```text
typed ref variant
  == stored object variant
  == owner key family
  == related state / result / source variant
```

This applies to `CapabilityChangeRecord`, `CapabilityExternalReference`, `DerivedMaterialRef`, `CapabilityStoredJobResponse`, `CapabilityJobExecutionTargetPlan`, event capture source and all stored result envelopes. A mismatch is not a missing row and must not be repaired by string parsing, table-name inference or current-truth reconstruction.

---

## 12. 一致性与隔离策略

### 12.1 Consistency strategy table

| consistency subject | required model | implementation contract | forbidden downgrade |
|---|---|---|---|
| one local truth / relation owner | strong local consistency | state guard + owner current uniqueness + CAS expected version in one UoW | last-write-wins、upsert、adapter-selected winner |
| source truth and required local sidecars | `same_uow_local_required` | source revision, change/trace, declared snapshot/capture, stored result and completion all visible or none | commit source first and repair missing sidecar later |
| source truth and affected material freshness | `same_uow_actual_stale` | stable dependency scan, typed dedup union, every actual non-stale material own CAS revision and capture in source UoW | full scan、blind stale update、eventual stale marker |
| derived material rebuild | eventually convergent after a strongly recorded stale/source version | Job freezes exact source refs/versions; target save verifies source-version fence and commits material + capture + journal outcome | rebuild from shifting current graph、projection repairing source truth |
| external reference and canonical state | reference-validity consistency | typed ref and one state owner commit together when created; every read validates subject/kind/state-id parity | per-ref duplicate state、resolver response as truth、missing auto-repair |
| append-only change / trace / report | append integrity | unique typed identity; trace contiguous successor CAS; report immutable | update/delete/overwrite、history synthesized from current row |
| idempotency and duplicate result | strong replay consistency | atomic reserve; immutable result insert and `Completed` share one result ref/UoW | duplicate re-execution、Completed without surface、winner replacement |
| event source and pre-intent recovery | strong local durability + external eventual collaboration | source + immutable snapshot + Captured same UoW; external intent later binds by CAS | transient-only event、local delivery status、distributed rollback claim |
| multi-target Job | per-phase strong local consistency | Reserved+plan initial UoW; effect+terminal target UoW; report+Finalized+Completed final UoW | whole-run business UoW、private checkpoint、report-by-run recovery |
| Query | committed read / explicit degradation | resolver-first, no write; exact owner/version mismatch maps missing/degraded/error perprotocol | hidden refresh、missing truth creation、body fallback |
| forbidden body boundary | structural consistency | no logical store, index, snapshot, result envelope or fake carrier may contain forbidden owner body | redaction-after-persist、test-only raw body、opaque blob loophole |

### 12.2 UoW read and write visibility

1. Every write passed the same `&dyn CapabilityUnitOfWork` is staged under one transaction identity and becomes visible atomically at `commit`.
2. A repository read method that does not accept `uow` reads committed state only. It must not discover another operation's uncommitted writes or implicitly join a global transaction map.
3. Application flows load prerequisites, stage the source CAS/write fence, then scan committed dependency rows while carrying the exact staged source object/ref forward. The scan does not need to read the uncommitted source row and no read method is expected to provide read-your-writes.
4. A repository may validate duplicate staged keys and cross-store symmetry through the concrete checked UoW handle, but it cannot expose staged state through undeclared read methods.
5. Nested transactions, autonomous commits and save methods that silently create their own transaction are forbidden. A wrong concrete UoW type is a wiring/consistency failure.

### 12.2.1 Commit-resolution and authoritative recovery reads

`CapabilityUnitOfWorkManager::commit` may consume the concrete UoW and still lose the driver acknowledgement。Application therefore copies the opaque`CapabilityTransactionRef`before commit and may call`resolve_commit`only after a commit outcome becomes unknown。The same configured persistence authority must satisfy:

| resolution | authority guarantee | required next action | forbidden inference |
|---|---|---|---|
| `Durable` | exact transaction is committed;its entire atomic write set is visible to subsequent authority reads | read every flow-declared idempotency/result/journal/capture/business owner and classify symmetry | skip sidecar validation、read replica/cache、rerun mutation |
| `NotDurable` | exact transaction did not commit and can never become durable later | authority-read the declared owners to classify a concurrent winner;only exact absence/unchanged state may authorize a new attempt | treat aspermission to overwrite a winner、reuse stale generated ids/tokens |
| `Unknown` | authority cannot prove either terminal status | remain`CommitOutcomeUnknown`;bounded observation may repeat underStep 14 policy | map to`None`、rollback、timeout、zero effect或success |

All repository methods keep their Step 7 signatures,但the concrete adapter behind commit-unknown recovery must execute those exact reads withlinearizable semantics against the same local authority that owns`resolve_commit`。It may use a primary transaction-status table,driver-native recovery token,consensus read index or equivalent product-neutral mechanism。It may not use asynchronous replica lag,cache invalidation,elapsed-time windows,sleep,log search,read-your-own-process memory orfallback acrossstores。

`Durable` establishes a read barrier:later authority reads cannot legally return pre-commit state for rows inthat transaction。`NotDurable` is stronger than “no row currently visible”:it is an authority proof about the original transaction identity。A concurrent different transaction may still have committed the same unique key orowner,so application always performs the exact winner/owner reads before starting a new attempt。

The in-memory fake retains a terminal status for every issued transaction ref and applies staged writes atomically before returning`Durable`。Failure injection may return anunknown commit response while internally selectingDurable、NotDurable orstillUnknown；`resolve_commit`and subsequent reads must expose onlythe selected legal behavior。A fake that simply maps all unknown responses toNotDurable isnot parity-compliant。

### 12.3 Affected-material stable scan and phantom protection

The collect-before-mutate rule needs more than stable sorting. A concurrent rebuild could otherwise insert or replace a material that still cites the old source version after the source Command has finished its dependency scan. The accepted persistence contract is:

```text
stage source subject S successor with CAS and acquire its persistence fence
  -> scan all committed current material owners whose source marker cites S
  -> deduplicate and load each current owner/version
  -> stage every eligible material Stale successor revision
  -> at commit validate:
       scanned dependency range for S has not gained/lost/changed an owner
       every material CAS token still matches
       no concurrent non-stale material may commit with an obsolete version of S
```

The source repository save and every non-stale material save must participate in the same logical per-source fence. A durable adapter may implement that fence with ordered source-row locks plus source-version validation, serializable predicate/range protection, or an equivalent product-neutral mechanism. A source save obtains the fence before its affected scan; a concurrent material save validates and fences every typed source ref in canonical order. Thus a material committed before the source fence is acquired is visible to the subsequent scan, while a material attempting to commit afterward either observes the successor source version or conflicts. The fake must model the same outcome. This is an infra concurrency primitive behind existing save methods, not a new business object, Port, state or private finder.

Required consequences:

- A source mutation and a concurrent non-stale material save that still declares the old source version cannot both commit as successful current rows. A Stale successor may retain the old marker to explain which source revision invalidated it.
- A material Job save validates every frozen `source_versions` marker against the exact current sources required by its plan. A mismatch rolls back the target and becomes a typed target failure later; the adapter does not refresh inputs automatically.
- Multi-subject Commands protect every scanned subject range, union candidate refs before material mutation and save each material at most once.
- Already-stale material remains a no-op only if its current owner revision and dependency row are symmetric. A stale index hit with a missing/wrong owner is a consistency failure.
- Immutable reconciliation reports are never included in a mutable dependency range.

### 12.4 Constraint timing and commit gate

| constraint class | validation time | commit requirement |
|---|---|---|
| object/state/payload invariant | before repository write and again at adapter boundary | invalid object never enters staged set |
| primary/unique/current-owner key | atomic insert/update and commit conflict check | exactly one winner;loser UoW cannot partially commit |
| optimistic expected version | owner save/append operation | supplied token equals persisted committed version at commit |
| typed ref/variant/source symmetry | before insert/update and on read | mismatch is consistency error,not `None` |
| cross-store local relation | when both rows are staged,may be deferred until commit | source/change/trace/capture/result references resolve within committed or same-UoW staged set |
| insert-only digest/bytes integrity | before staged insert and on exact read | non-empty bytes and recomputed digest match;row never updated |
| dependency range/fence | scan registration and commit | no missed concurrent old-source material |
| terminal immutability | save operation and CAS comparison | terminal state/payload/plan/result ref cannot be overwritten |

Product-specific foreign-key syntax or deferrable-constraint configuration belongs to implementation/config design. Whatever product is chosen must realize the logical commit gate above.

---

## 13. Failure、Crash Visibility与Recovery

### 13.1 Failure recovery matrix

| failure / crash point | durable local visibility | exact recovery source | forbidden recovery |
|---|---|---|---|
| before UoW begin / before reserve | none | caller may retry under Step 13 rules | fabricate reservation/result |
| after reserve staged, before commit/rollback | none outside UoW | discard transaction handle;retry exact key | reuse rolled-back `Loaded.expected_version` |
| Command/Consumer source or sidecar write fails | none from current UoW | original committed owner rows + idempotency key | repair missing change/capture after committing source |
| commit outcome is unknown to caller | do not assume success or failure | exact idempotency key read;then stored result or Reserved state classification | blindly replay writes or overwrite winner |
| source + snapshot + capture commit succeeds, process stops before collaboration | source and Captured record visible | AwaitingIntent scan / exact capture + immutable snapshot | reload current source and remap event |
| external collaborate forms intent, local bind fails/crashes | source and Captured remain visible;external intent may exist | same stored candidate;external seam must provide same stable-intent semantics | create second capture/snapshot/intent |
| capture bind commits, process stops before observing success | IntentBound visible | exact capture read + external `get(intent)` | call `collaborate` again or copy delivery state locally |
| post-commit audit handoff fails | committed HandoffPending trace/result remain | explicit later operation using exact current trace and new key;Step 12/13 own mapping | rewrite stored Accepted result、claim receipt/evidence |
| resolver returns observation, local write fails | no accepted local effect/receipt | retry may re-resolve under protocol rules | claim external observation was rolled back |
| Job planning unsafe failure before initial commit | no reservation or journal | caller retry | infer empty successful plan |
| Job initial commit fails | neither reservation nor journal visible | exact normalized key distinguishes absence from concurrent winner | start targets without committed plan |
| Job initial commit succeeds, crash before target | Reserved + complete Planned journal visible | exact normalized-key journal | rescan scope / regenerate target ids |
| Job external target call succeeds, local target commit fails | journal target remains Planned;external effect may exist | same frozen candidate or same intent/ref;then exact target UoW | mark success from request-local outcome after failed commit |
| Job target commit succeeds, crash before response loop continues | effect/capture + terminal journal outcome visible | exact journal skips terminal ordinal | repeat resolver/rebuild/capture for terminal target |
| target effect rollback succeeds | target remains Planned | exact reload;optional separate journal-only Failed/Skipped UoW | save failure before rollback completion |
| Job final UoW fails | prior targets remain;reservation Reserved;journal remains Planned and unfinalized | all-terminal journal pure assembler retries final UoW | whole-run rollback claim、rebuild report from current truth |
| Job final commit succeeds, caller misses response | typed report + Finalized + Completed visible | idempotency read + typed `get_job_report` | `find_by_job_run` reconstruction or generic decoder |
| Completed row exists but result/surface/envelope is missing/asymmetric | accepted impossible relation / consistency defect | explicit error and operator recovery path defined later | rerun original mutation/job/consumer |
| committed Command / Inbound `Reserved` is visible | no legal durable partial body exists because reservation and terminal local result belong to one UoW | classify as idempotency-state consistency defect; operator repair only | return ordinary in-progress indefinitely、rerun body或attach a late result |
| Job `Reserved` exists without a matching Planned journal,or journal identity/run/digest is asymmetric | initial atomic-set invariant is broken | consistency defect;no scope scan/replan/new journal | treat reservation alone as resumable Job |
| dependency index hit has missing owner/source marker | consistency defect | rollback current source/target UoW;later repair requires explicit design | silent skip or full-body scan |

### 13.2 Rollback scope

- `rollback` only cancels uncommitted writes registered in that local UoW.
- It never reverses resolver reads, external handoff, event collaboration, external intent formation or prior committed Job targets.
- Rollback failure or an indeterminate commit outcome is not converted to a domain state. Step 12 must preserve a persistence/consistency category; Step 13 decides safe exact-read recovery.
- A source Command cannot catch one material conflict and commit the remaining truth/captures. Its declared local atomic set is indivisible.
- A Job target conflict does not roll back earlier targets. It reloads only the same journal and preserves any concurrent terminal outcome.

### 13.3 Recovery authority table

| interrupted workflow | only durable recovery authority |
|---|---|
| Command / Consumer completed duplicate | `CapabilityIdempotencyRecord::Completed` + matching immutable stored surface / typed receipt |
| Command / Consumer incomplete local attempt | normalized idempotency record state and current committed owners;never request-local accumulator |
| outbound pre-intent | `CapabilityEventCaptureRecord::Captured` + immutable `CapabilityEventPayloadSnapshot` |
| outbound post-bind | capture stable intent + external Port exact item |
| Job reserved execution | `CapabilityJobExecutionRecord` by normalized key |
| Job completed duplicate | typed `CapabilityStoredJobReportEnvelope` referenced by Completed reservation |
| projection/reference target | frozen Job plan + exact source refs/versions + journal outcome |
| audit handoff follow-up | exact current trace revision and explicit new operation;no hidden marker store |

The Command / Consumer incomplete row above does not authorize a committed orphan `Reserved` record。Outside a transaction-visible active owner,such a row is aconsistency defect。OnlyanOperations Job maykeepa durable `Reserved`,andonlywhenanexact matching`Planned`journal withthe same key/channel/operation/job/schema/run/digest ispresent。

---

## 14. Durable / Fake Parity

| parity axis | durable requirement | fake requirement |
|---|---|---|
| UoW staging | writes isolated until commit;rollback removes all staged rows/index changes | transaction-local staged maps;no eager mutation of shared fake state |
| same-UoW identity | checked concrete handle;wrong adapter/UoW rejected | same rejection;no global lookup by transaction string |
| atomicity | declared cross-store rows and indexes commit together | one atomic merge or no merge;failure injection cannot leave partial state |
| create/update version | create `None`;update exact token;stale conflict | identical persisted token allocation and conflict behavior |
| current uniqueness | conditional owner/state uniqueness enforced atomically | same state subset and winner behavior;no last-write-wins map insert |
| append/insert-only | duplicate key/body mismatch rejected;no update/delete | same rejection;tests cannot mutate backing map directly |
| typed union symmetry | validate ref/variant/kind/source before write/read | same exhaustive validation;no debug-string dispatch |
| page/cursor | stable order, scope-bound cursor, no duplicate/omission | deterministic same order and cursor misuse failure |
| affected scan/fence | stable dependency range and phantom conflict | generation/fence model that reproduces concurrent old-source conflict |
| stored replay | shell/surface/envelope/result-ref/digest symmetry | no generic bytes shortcut or current-state reconstruction |
| event capture | source+snapshot+capture atomic;digest/five-tuple checked;bind CAS | same atomicity and missing/asymmetry failures;no second queue |
| Job journal | complete plan create;whole-record CAS;terminal payload immutable | no private checkpoint/run index;same reentry and conflict behavior |
| degraded/missing | explicit stale/partial/unavailable distinct from missing | same distinctions;no convenient default object |
| forbidden body | rejected before persistence | rejected in fake builders/fixtures too;no raw test payload storage |

Fake-only helper APIs may arrange initial committed fixtures or inject failures, but they must not be callable through application Ports and must produce states that satisfy the same persisted invariants. A fixture that creates `Completed` without a stored result, a committed Command / Inbound `Reserved`, a Job `Reserved` without its matching Planned journal, `IntentBound` without intent, or a Finalized journal with Planned targets is invalid test setup, not a supported fake state.

---

## 15. Cross-store Invariants与禁止模式

### 15.1 Cross-store invariant table

| invariant | required accepted relation |
|---|---|
| identity chain | registry/descriptor/relation/exposure owner refs resolve to exact committed identity/entry chain declared by the flow |
| exposure pair | Active exposure and Visible applicability share exact final exposure version;actual registry lifecycle delta is symmetric |
| reference pair | external ref `resolution_state_id` equals one canonical current state with same subject/kind |
| material owner | material compound owner, current row, source versions and dependency rows all describe the same revision |
| trace history | exact change refs exist;current highest revision is unique;next revision is contiguous |
| event capture | source/schema/snapshot id/digest/captured time five-tuple matches;bytes digest valid;state/intent nullability matches |
| stored command result | shell and surface share result/surface/digest/operation/disposition and Completed reservation points to it |
| stored Consumer receipt | shell/surface/typed envelope and receipt effect refs are symmetric with Completed reservation |
| stored Job result | shell/surface/eight-variant envelope/job/schema/run/detail and journal/reservation final refs are symmetric |
| Job initial | Reserved and complete Planned journal share normalized key/operation/job/schema/run/digest |
| Job target | committed target effect exactly matches one immutable terminal journal outcome,or terminal failure/skip has no committed effect |
| external collaboration | local capture only stores stable intent;external item/outcome source+intent symmetry is validated but status is not persisted locally |

### 15.2 Explicit anti-patterns

The following implementations violate this Step even if unit tests appear to pass:

1. repository `save` implemented as unconditional upsert or last-write-wins;
2. database trigger/cascade that advances domain state, creates change/trace, marks material stale or completes idempotency;
3. full-table or serialized-body scan used instead of a declared current/history/dependency/scope index;
4. adapter-private finder required by application behavior but absent from Step 7;
5. transaction opened or committed inside a repository method;
6. Query that refreshes, repairs, reserves, captures or creates missing truth;
7. source commit followed by best-effort change/trace/snapshot/capture insertion;
8. mutable reconciliation report or immutable event/result snapshot update/delete;
9. local outbox/relay/attempt/dead-letter table introduced as canonical lifecycle without reopening Steps 6~10;
10. duplicate result reconstructed from current truth, generic bytes, report-by-run or decoder guessing;
11. Job progress persisted in lease/attempt/private checkpoint/run-index state instead of the typed journal;
12. external resolver/handoff/collaboration call treated as rollback-able local transaction member;
13. fake that skips uniqueness, version, cursor, digest, terminal or forbidden-body checks;
14. cache/search backend treated as owner or allowed to correct formal truth/projection state;
15. forbidden external body hidden in JSON/blob/diagnostic/result envelope under an opaque field.

---

## 16. Historical Material与边界冲突审计

本节只记录污染来源和排除结论,不进入正式§10正文。旧正式`03-详细设计.md`和项目`README.md`仍是historical material；二者不能覆盖本轮正式`00 / 01 / 02`与Step 6~11形成的当前设计基线。

### 16.1 旧正式`03-详细设计.md`审计

| historical material | 与当前基线的冲突 | Step 11处理 | 是否进入logical store / transaction |
|---|---|---|---|
| `ProviderContract`、provider quota / route / failover | 把provider合同、路由、配额和runtime provider选择合并为本仓truth | 不沿用；当前owner是`AdapterDescriptor`及body-free risk / secret safe summary | 否；不得创建provider contract、quota、route store |
| `CapabilityDecision`、allow / deny list、policy refresh | 把governance approval与runtime enforcement并入hub | 不沿用；只保存`GovernanceSeamRelation`、正式exposure与consumer-controlled view | 否；不得创建policy truth、allowlist或decision cache truth |
| `CostRecord`、billing / finance event | 把调用成本、provider billing和执行结果纳入hub | 不沿用；runtime execution / cost accounting均在边界外 | 否；不得创建cost ledger、usage或billing store |
| KMS / Vault secret envelope正文 | 把secret平台产品和secret正文当成本仓持久化对象 | 不沿用；只保存`SecretRef`与`SecretHandlingSafeSummary` | 否；任何密钥、token、envelope bytes均禁入store |
| runtime / tools execution gateway | 把能力登记、访问视图和实际调用合并 | 不沿用；本仓只提供formal exposure与controlled view | 否；不得创建invocation、execution result或runtime decision store |
| marketplace metadata / listing / ranking | 把read-only discovery与marketplace listing truth混合 | 只保留可重建`EcosystemDiscoveryMaterial`,且不是listing owner | 否；不得创建listing、pricing、transaction或fulfillment store |
| old publisher / outbox / relay / retry | 预设broker outbox、publisher attempt和dead-letter本地生命周期 | 不沿用；当前只有immutable payload snapshot + versioned capture的pre-intent durability | 否；不得创建relay、attempt、retry counter或dead-letter store |
| current truth重算event/result/projection | 允许发布、duplicate replay或repair时读取当前truth重构历史结果 | 明确禁止；只能读取stored snapshot、stored result或typed Job journal | 否；不得增加adapter-private reconstruction path |

### 16.2 `README.md`审计

| README旧口径 | 当前裁决 | 处理状态 |
|---|---|---|
| “Provider Contract + 白名单 + 成本记账”仓使命 | 与当前capability identity / registry / adapter descriptor / formal exposure主线冲突 | `historical_material`;本Step不修改README,也不据此创建store |
| Runtime调用外部Tool必须经过hub | 混入runtime execution / enforcement | `historical_material`;hub只暴露受控服务端能力视图和ref边界 |
| provider API key / KMS加密存储 | 混入secret正文owner和具体产品 | `historical_material`;只保留SecretRef / safe summary,具体binding后移Step 14 / `04` |
| Policy动态更新白名单 | 混入governance approval与本地allowlist | `historical_material`;只承接governance result ref / seam relation |
| migrations含call log / Outbox | 预设未被当前对象、Port和flow支持的持久化产品 | `historical_material`;当前logical store inventory不包含call log或Outbox lifecycle |
| marketplace发布MCP Tool / Role镜像 | 混入listing / publication owner | `historical_material`;只允许read-only ecosystem discovery边界 |

README冲突不是当前上游blocker,因为正式`00 / 01 / 02`已经给出更高优先级且可落码的owner与边界。README后续若校准,必须由单独受控文档任务处理；Step 11不得顺手重写。

### 16.3 专项边界闭合

| 重点边界 | 当前持久化结论 | 禁止合并对象 |
|---|---|---|
| capability identity | 本仓versioned owner；identity key/current/history/CAS闭合 | external source identity正文、runtime principal truth |
| capability registry | 本仓versioned registry truth；current registry/exposure linkage闭合 | marketplace listing、runtime routing table |
| adapter descriptor | 本仓保存descriptor与body-free risk/secret safe summary | provider contract、secret正文、invocation adapter runtime state |
| governance approval seam | 只保存body-free seam relation与result/policy refs | governance approval、vote、policy/shared_rules truth |
| method-library asset relation | 只保存method asset ref + body-free relation及reverse index | method asset正文、template/source code、library publication state |
| SDK exposure boundary | 保存formal server exposure、visibility applicability及controlled view | SDK package/client/cache/publication truth |
| MCP / A2A / API integration | 作为identity/registry/descriptor/reference的typed source family进入 | runtime execution、tool invocation、provider routing |
| external event collaboration | 本地只保存snapshot/capture和stable intent binding | publisher delivery lifecycle、attempt、dead letter、external status |

结论：旧正式文档与README均被隔离为historical material；未发现需要沿用的旧store、transaction或recovery事实。当前unresolved upstream blocker为`0`。

---

## 17. Step 6~10 Cross-step Closure

### 17.1 主链闭环审计

| 上游Step | 本Step复核问题 | 闭合证据 | 结论 |
|---|---|---|---|
| Step 6 objects | 每个persisted field / state carrier是否有owner、write class和nullable / immutable约束 | §§6~8按truth、relation、summary、projection、report、reference、snapshot、technical state分类；§15固定cross-store field symmetry | pass；43 HLD objects + 7 application helpers不变 |
| Step 6 Rust declarations | 是否因持久化补了未注释struct / field / enum / variant payload | 本Step未新增Rust declaration；沿用Step 6 Rustdoc门禁 | pass；structure / field / variant-payload Rustdoc omission=`0` |
| Step 7 Ports | 每个repository callable是否有store、key/index、version/UoW和failure category | §9逐method覆盖22 repository traits / 110 methods；uncovered=`0` | pass；36 application-owned Ports不变,无private finder |
| Step 8 protocols | stored command、Consumer receipt、8 Job response、outbound event是否有immutable storage/replay surface | §§8.3、9.8、10、13固定shell/surface/typed envelope、snapshot/capture、journal/result-ref原值重放 | pass；83 protocols / flows不变 |
| Step 9 flows | 每个write family的begin/write/commit/rollback/post-commit是否可执行 | §§10.1~10.7覆盖26 Command、33 Query、6 Consumer、10 Outbound、8 Job及intent bind/finalize phase | pass；Query no-write、external phase separation保持 |
| Step 10 states | current/terminal/reserved状态是否进入current index、CAS、terminal immutability和recovery | §§8、11~15使用Step 10 exact state subset；Captured/IntentBound、Reserved/Completed、Planned/Finalized等技术状态单独闭合 | pass；22 local mutable + 1 external boundary、111 active variants、638 pairs |

### 17.2 真相源与消费闭环

| truth / derived family | authoritative write source | official replay / query source | consistency relation | prohibited substitute |
|---|---|---|---|---|
| core truth / relation | matching Command / Consumer exact flow | exact/current/history repository method | owner CAS + current unique + required sidecars sameUoW | projection、cache、resolver observation |
| controlled view / derived material | declared source stale propagation或typed Job target | material repository current/exact/page | stale标记与source mutation强一致；rebuild按frozen source最终收敛 | Query inline rebuild、current truth fallback |
| external reference | registration/Consumer/refresh flow接受的typed observation | local body-free ref + one canonical state | ref/state subject/kind/state-id parity | external正文、error string、private resolver map |
| command / Consumer result | accepted/rejected terminal local UoW | immutable shell + surface + typed receipt | stored surface与Completed same result ref | current truth reconstruction、generic decoder guessing |
| Job result / progress | initial/target/final UoW | normalized-key typed journal + typed stored report | per-target effect/outcome atomic；Finalized/report/Completed atomic | run scan、scope rescan、private checkpoint |
| outbound event | source-owned mapper形成的complete immutable snapshot | capture + stored snapshot；external stable intent | source/snapshot/Captured sameUoW；bind later CAS | source current reload、local delivery state |

### 17.3 Cross-store与phase closure gate

```text
step_6_object_baseline = 43 HLD objects + 7 application technical helpers
step_7_port_baseline = 36 application-owned Ports
step_7_repository_baseline = 22 traits / 110 methods
step_8_protocol_flow_baseline = 83
step_10_state_baseline = 22 local mutable + 1 external boundary
step_10_state_pair_baseline = 638 = 239 current + 98 reserved + 301 illegal

uncovered_repository_traits = 0
uncovered_repository_methods = 0
new_private_finder = 0
new_local_outbox_lifecycle = 0
new_business_object_or_state = 0
unresolved_upstream_blocker = none
non_blocking_cross_repo_debt = CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001
```

`CH-DDD-S10-REPOSITORY-COUNT-001`只校正Step 10两处汇总笔误：exact repository traits为22而不是23。该项已经关闭,不改变任何schema、Port、flow、state或transaction membership,也不要求回改正式`00 / 01 / 02`。

---

## 18. 正式`03-详细设计.md` §10 Assembly Source

Step 19必须从本节和§§6~15装配正式§10,不得从旧正式`03`的§9 / §10复制provider、decision、cost、outbox或projection内容。以下是装配结构和不可压缩契约,不是对正式文档的提前写入。

### 18.1 正式章节结构

| 正式章节 | 必须装配内容 | exact source | 不得省略 |
|---|---|---|---|
| §10.1 数据所有权与持久化分类 | owned truth、body-free ref、safe summary、projection/report、application technical、virtual/ephemeral/external分类表 | §§6~7 | forbidden-body owner audit与external collaboration status不落本地 |
| §10.2 Logical store / collection / projection | core/relation、change/trace/impact/derived、reference/application technical、virtual/absent四组store表 | §8.1~§8.4 | 每个store的PK、current/unique、read index、version/immutability规则 |
| §10.3 Repository函数持久化语义 | 22 traits / 110 methods exact matrix和coverage gate | §9.1~§9.9 | exact method name、key/index、version/UoW、missing/conflict；不得只给family摘要 |
| §10.4 事务边界与保存顺序 | transaction总表、Command pipeline/family membership、Consumer、Outbound A/B/C、Job initial/target/final、Query no-write | §10.1~§10.7 | begin、local write set、save order、commit、rollback、post-commit与durable recovery source |
| §10.5 Version、current/history、cursor与dependency index | expected-version来源、terminal exclusion、dependency index、cursor binding、typed union symmetry | §11.1~§11.5 | `Loaded.expected_version`唯一来源、collect-before-mutate、stable page与scope mismatch |
| §10.6 一致性与隔离 | consistency strategy、UoW visibility、per-source fence/phantom protection、commit constraint timing | §12.1~§12.4 | truth/material并发不能同时以old source成功、无nested/autonomous transaction |
| §10.7 失败可见性与恢复 | crash matrix、rollback scope、only durable recovery authority | §13.1~§13.3 | commit unknown、Captured、Job三阶段、Completed missing/asymmetry均不得重算 |
| §10.8 Durable / fake parity与禁止模式 | parity table、cross-store invariants、15个anti-pattern | §§14~15 | fake不得弱化unique/CAS/cursor/digest/terminal/body-free/rollback语义 |

### 18.2 正式章节开篇口径

Step 19应使用以下current-baseline口径组织§10开篇,可做中文排版调整但不得改变语义：

```text
Capability Hub持久化以logical contract为真相源,不在详细设计阶段锁定数据库、DDL、migration或索引物理名称。Durable adapter与in-memory fake都必须实现相同的owner key、conditional current uniqueness、optimistic version、append/insert-only、stable page/cursor、cross-store transaction和recovery语义。

本仓拥有capability identity、registry、adapter descriptor、body-free relation、formal exposure、controlled view、trace/impact、derived material、body-free external reference及application replay/capture/journal记录；不拥有governance approval、method-library asset body、secret body、runtime/tools execution、SDK package/client state、marketplace listing或external collaboration delivery status。

本项目不建立local outbox / relay / attempt / dead-letter lifecycle。CapabilityEventPayloadSnapshot与CapabilityEventCaptureRecord只闭合source commit到external stable intent之间的pre-intent durability；external collaboration状态仍由Port owner维护。
```

### 18.3 正式章节硬性语句

以下语句必须以等价明确措辞进入正式§10：

1. 所有mutable owner更新只接受matching repository返回的`Loaded.expected_version`;禁止last-write-wins、unconditional upsert、timestamp/cursor/object version替代并发token。
2. Repository方法不得自行begin/commit transaction,不得打开nested/autonomous transaction,不得通过adapter-private finder补application读取面。
3. Source mutation、required change/trace、actual stale material、event snapshot/capture、stored result和idempotency completion按Step 9声明组成同一local atomic set；任一必需成员失败全部rollback。
4. 33条Query严格no-write；missing/stale/degraded不是inline refresh、repair、rebuild或truth fallback许可。
5. External resolver、audit handoff和event collaboration不属于可回滚local UoW；commit后失败不得逆转已提交truth。
6. Affected material必须完整分页collect、验证cursor连续性、typed dedup后再mutation；source/material以per-source fence阻止漏标phantom和old-source material并发成功。
7. Duplicate replay只从immutable stored result/receipt/report读取；Completed但surface缺失或不对称是consistency defect,不得重跑或从current truth重构。
8. Job只从normalized-key typed journal恢复；initial、target、final各自是独立UoW,不得创建run lookup、scope rescan、lease/attempt/private checkpoint。
9. Fake必须与durable adapter在unique、version conflict、terminal guard、cursor、digest、asymmetry、rollback和forbidden-body rejection上等价。
10. Database trigger/cascade不得推进domain state、形成change/trace、标记material stale、capture event或完成idempotency。

### 18.4 Step 19装配校验

| assembly check | required result |
|---|---|
| 22 repository traits / 110 methods | 正式§10逐method可检索；不能压缩成“其余类似” |
| logical stores | §§8.1~§8.4全部store / virtual / absent surface可检索 |
| transaction classes | Command、Query、Consumer、Outbound A/B/C、Job initial/target/final全部出现 |
| state/persistence symmetry | current/terminal exclusion、Captured/IntentBound、Reserved/Completed、Planned/Finalized保持Step 10 exact names |
| external ownership | governance/method/secret/runtime/SDK/marketplace/collaboration body不进入local schema |
| historical pollution | `ProviderContract`、`CapabilityDecision`、`CostRecord`、local outbox relay不得作为current design出现 |
| process-text pollution | historical audit、batch状态、用户确认、blocker处理过程不得进入正式正文 |
| source annotation | 正式章节标注本文件为校准来源；必要时指向§§6~15 exact matrix |

---

## 19. Step 12~17 / 19 Handoff

| 后续Step | 必须读取 | 本Step固定输入 | 后续必须闭合但不得反向放宽的事项 |
|---|---|---|---|
| Step 12 错误与恢复 | §§9、12~15、17 | missing、version/unique conflict、invariant/asymmetry、persistence/commit unknown、external failure均已有检测点和rollback visibility | exact Domain/Application errors、protocol mapping、retryability与operator-visible category；不得把consistency defect映射成missing/no-op |
| Step 13 并发/幂等/重入 | §§9.8、10~13 | atomic reserve、CAS token、per-source fence、insert-only snapshot/result、capture bind、Job journal reentry已固定 | reserve race、same-key digest、commit-unknown exact-read、stable-intent duplicate、retry/backoff和canonical lock order算法 |
| Step 14 配置与依赖绑定 | §§8、10.5、12.3~12.4、14 | logical store / UoW / cursor / source-fence能力和9 external Ports边界已固定,未锁产品 | database/search/serialization/transaction driver、cursor integrity、external endpoint/timeout/capability binding；配置不能创造新owner或local delivery lifecycle |
| Step 15 可观测与审计 | §§10~15 | operation/UoW phase、CAS/constraint、capture/journal/crash点和body-free trace refs已固定 | metric/log/span/audit字段、redaction、phase correlation；不得声称已有run/evidence/test result |
| Step 16 测试切口 | §§8~15、17 | 22/110 repository、transaction class、crash matrix、durable/fake parity和anti-pattern均可直接形成tests | contract tests、concurrency/fence、rollback injection、duplicate replay、capture/journal reentry、cursor/asymmetry/forbidden-body negative cuts |
| Step 17 实施承接 | §§17~18及Step 12~16完成结果 | owner/store/method/transaction/consistency/recovery baseline可供07按boundary引用 | 字段/DTO/state/phase/name closure与实施前置阅读；不能在Step 17创建implementation ledger或boundary skeleton |
| Step 19 正式装配 | §18及§§6~15 | 正式§10结构、开篇口径、硬性语句和装配校验已给出 | 只在Step 19写正式`03`;不得回抄旧正式§9/§10或丢失110-method exact matrix |

Step 18若记录风险,应把数据库产品是否能实现per-source fence、cross-store transaction和cursor semantics列为implementation binding risk,而不是把这些已固定语义降为待确认。当前没有会阻塞进入Step 12的上游事项。

### 19.1 Step 16最小验证种子

| test seed | exact assertion |
|---|---|
| repository contract | create requires`None`;stale update conflicts;terminal/current index behavior and exact history read matchStep 10 |
| transaction rollback | inject failure at each required sidecar/result/completion write;committed visibility remains all-or-none |
| affected phantom | concurrent source successor andold-source material save cannot both commit successful current rows |
| stored replay | duplicate returns exact stored command/receipt/Job surface;missing/asymmetric surface fails without re-execution |
| event recovery | crash aftersource+Captured,afterexternal intent,afterbind each resumes fromsnapshot/capture anddoes not formsecond snapshot/capture |
| Job reentry | crash afterinitial,aftertarget,afterfinal commit skips terminal effects andusesnormalized-key journal only |
| Query no-write | everyQuery rejects/never invokesbegin/save/capture/resolver-refresh/rebuild path |
| durable/fake parity | same unique/CAS/cursor/digest/terminal/body-free/failure-injection scenarios yield equivalent classifications |

这些是Step 16输入,不是已执行测试、覆盖率或验收证据。

---

## 20. Step 11 Completion Gate与停审记录

### 20.1 SOP completion checklist

| gate | result | evidence |
|---|---|---|
| 数据所有权实现表完整 | pass | §§6~7覆盖owned/ref/snapshot/projection/report/technical/virtual/external/forbidden material |
| store / collection / projection契约完整 | pass | §8给出PK、unique/current、index、version/immutable语义 |
| Repository函数表完整 | pass | §9覆盖22 traits / 110 methods,uncovered=`0`,private finder=`0` |
| 事务边界完整 | pass | §10覆盖26 Command、33 Query、6 Consumer、10 Outbound、8 Job及phase UoW |
| 一致性与恢复收稳 | pass | §§11~15闭合CAS、index、fence、crash visibility、durable/fake parity与anti-pattern |
| historical material隔离 | pass | §16隔离旧正式`03`和README冲突,未沿用旧store或transaction |
| Step 6~10交叉闭环 | pass | §17基线计数与truth/replay/phase closure均无缺口 |
| 正式§10装配源 | pass | §18给出章节结构、hard statements和Step 19 assembly checks |
| 后续Step交接 | pass | §19给出Step 12~17 / 19输入和不得放宽项 |
| Rustdoc门禁 | pass | 本Step未新增Rust declaration；struct/field/enum/variant omission=`0` |
| 上游依赖状态 | pass by Step 13 authorized assumption | 本Step本仓持久化语义已同步；`CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001`保留历史诊断并已由精确用户授权假设解除，L0-core正式设计同步为非阻塞债务 |
| 正式文档/实现产物纪律 | pass | 正式`03`未修改；未创建Step 12、implementation ledger、boundary skeleton、DDL/migration/code/commit/run/evidence/test result |

### 20.2 完成状态

```text
current_document = 03-详细设计.md
current_step = 11
gate_status = 03_step_11_completed_with_step_13_controlled_reopen_sync
next_allowed_action = follow_current_03_step_14_batch_gate
formal_03_modified = false
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
non_blocking_cross_repo_debt = CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001
```

Step 11本仓持久化、事务与一致性语义已按Step 13两态幂等裁决同步。项目当前恢复点由Step 14控制；原L0-core accessor阻塞已按Step 13用户授权假设解除，正式设计同步不阻塞推进。正式`03`仍留Step 19装配。
