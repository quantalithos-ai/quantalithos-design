# L6-bridges 03 Step9：Query独立处理流

四Q是single-subject只读入口，不新增list/search/refresh。metadata.page/idempotency_key均None；Strong仅actual本地一致读，不能触发跨域refresh。Query不注入UoW/Clock/ID，不能临时借mutation service。snapshot的actual observed_at是原local读取时刻，不冒充请求结束时刻；最终SafeReadQualificationPort::revalidate由其受核provider按实际时刻检查期限/撤销，再以新的资格重做纯投影。无法取得完整同源basis/资格或安全时刻时Unavailable，不从requested_at/validity起点造now；authorized absent直接有限NotFound，不需要造snapshot/time。零项目测试。

## 1. Q01 GetBindingMappingView

### 1.1 入口与目标

QueryDispatcher::BindingMapping -> `GetBindingMappingViewInput::from_parts(context, subject)` -> `GetBindingMappingView::execute`；Application/U6读取U1。来源：[Step8§2/6](03_ddd_step_08_query_protocols.md)、Step6 Installation/AuthorizedMappingSnapshot/LocalViewProjector、Step7 SafeRead/Installation/Mapping。问题：未授权不能先查存在性，Pending relation不应要求Active才可读。采用read资格与business资格分离，不采用qualify_current来“修复”Query。

| 完整字段 / branch | 来源 -> 读取/构造 |
|---|---|
| context四字段/subject | host actor/query metadata/authority/trace + 原唯一subject；namespace从trusted authority配置解析，不切ref、无default tenant |
| Installation | InstallationRepository.read_snapshot实际InstallationSnapshot；ExistingLocalSnapshot::Installation + validate |
| Binding | get_binding完整原行；AuthorizedMappingSnapshot::from_parts(binding, None, None, None, actual read_basis)；缺coherent/time basis返回Unavailable |
| Mapping三variant | get_identity/get_location/get_message完整原行 + get_binding实际对应relation；仅所需行放Some，其余非适用None；不跨权限读取所有mapping |
| LocalSnapshotReadBasis五字段 | actual全部hydration/expected + 正式local access/row_limit/observed_at；必须原repository同源一致读/页basis可证明，不能由API猜造；缺basis不拼snapshot |
| view六字段 | LocalViewProjector.project从current subject/scope/stage disclosure/visible refs与actual snapshot取view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability；只原factory，零新view ID |

### 1.2 函数级调用图：GetBindingMappingView

```text
[QueryDispatcher -> GetBindingMappingView]
  | call Input.from_parts; validate three-family allowlist
  v
[SafeReadQualificationPort]
  | call qualify_subject then qualify_local_read
  v
[InstallationRepository / MappingRepository]
  | query read_snapshot or exact get_binding/get_identity/get_location/get_message
  | compose only full committed ExistingLocalSnapshot
  v
[SafeReadQualificationPort -> LocalViewProjector]
  | call revalidate and project with actual read time
  | return six-field filtered View or finite NotVisible/NotFound/Unavailable
```

关键说明：

- subject/scope读资格先于存在性查询，business Active与Query资格不混。
- full同源snapshot和最后current只用于纯六字段投影，不能补审计、资格或hidden count。

### 1.3 关键伪代码

```rust
// [SafeReadQualificationPort.qualify_subject(ActorRef actor, InstallationNamespace namespace, BridgeViewSubjectRef subject, SafeAuthorityRef authority, BridgeCallControl control)]
let resolved = read_port.qualify_subject(&actor, &namespace, &subject, &authority, control).await?;
// Denied/Blocked/Unavailable零repo；Qualified/Degraded唯一读用途Query。
// [SafeReadQualificationPort.qualify_local_read(CurrentReadQualification qualification, u32 limit, BridgeCallControl control)]
let read_q = read_port.qualify_local_read(&current, row_limit, control).await?;
let session = BridgeLocalReadSession::Committed { context: &read_context };
// [InstallationRepository.read_snapshot(BridgeInstallationRef installation, BridgeLocalReadSession read, BridgeCallControl control)]
let snapshot = /* Installation branch */ installations.read_snapshot(&installation_ref, &session, control).await?;
// Mapping/Binding分支用1.1具名get与actual full basis构造，不能拿get ref当snapshot。
// [ExistingLocalSnapshot.validate()]
let full = /* Some实际行 */ ExistingLocalSnapshot::Installation(actual_snapshot).validate()?;
// [SafeReadQualificationPort.revalidate(CurrentReadQualification qualification, BridgeCallControl control)]
let final_q = read_port.revalidate(&current, control).await?;
// [LocalViewProjector.project(CurrentReadQualification read, Option<ExistingLocalSnapshot> snapshot, SafeInstant now)]
let result = projector.project(final_current, Some(full), actual_observed_at)?;
// [BridgeLocalView.assert_read_shape(CurrentReadQualification current, SafeInstant now)]
/* View only */ view.assert_read_shape(&final_current, actual_observed_at)?;
// final_current字段移交按原所有权；此示意借用顺序不宣称可编译。
```

### 1.4 事务边界

Committed session仅driver受权一致读，零begin/seal/commit/rollback/锁写/审计页快照。Required集合完整且受预算；Strong不满足则Unavailable，Eventual不能用跨页不一致拼成完整proof。授权absent才NotFound；scope变化需新current裁剪或Unavailable，不输出旧View。

### 1.5 错误映射

wrong family/page/key拒绝于decode/input；未授权NotVisible且无subject/count/found；已授权exact actual缺行NotFound；缺完整basis/driver/source/时间/Strong=Unavailable。合法可见empty不证明没有隐藏对象，无hidden_total。Stale/Degraded business snapshot仍需现时披露允许，不触发维护。

### 1.6 状态与事件副作用

只读BridgeInstallationState/ExternalBindingState/IdentityMappingState/LocationMappingState/MessageMappingState与实际revision；无Qualified刷新、自动激活、失效或result补写。整个链零write/audit/dedup/ID/eligible/probe/repair/O01；安全拒绝也不补审计。Step10仅读取候选，不产生状态触发。

### 1.7 测试切口与停审

`crates/application/tests/safe_read_tests.rs`、`crates/contracts/tests/protocol_surface_tests.rs`：三族/三mapping、Pending可见不需Active、resolver前零repo、四非法metadata、隐藏存在性/ref/count、read basis缺失/不一致/超预算、Strong失败、current撤销与实际六字段。全链port mock断言零write/clock-ID/probe；未运行。

| 停审项 | 结论 / 缺口 |
|---|---|
| DTO/对象/port | pass_fail_closed_design；唯一subject/两参input、三族具名读/实际basis；无法闭合snapshot不造shape proof |
| tx/error/state/副作用 | pass_design_only；resolver-first、最终current、无Active读门槛、零write与hidden泄漏 |
| 测试/phase/复杂度 | pass_design_only；原target，无新read model/clock port，下一Q02 |

## 2. Q02 GetBridgeOperationView

### 2.1 入口与目标

QueryDispatcher::BridgeOperation -> `GetBridgeOperationViewInput::from_parts(context, subject)` -> `GetBridgeOperationView::execute`；Application/U6读取U2/U3/U4。来源：[Step8§3/6](03_ddd_step_08_query_protocols.md)、Step6三snapshot/ExistingLocalSnapshot/LocalViewProjector、Step7具名repos。

问题/诊断：只有operation ID不能推完整OriginalOperationEffectRef；Blocked plan可没有intent，初绑action可没有callback。受权R1补三个独立Application-only snapshot和具名repo读取，S9-GAP-Q02-ROOTS本地闭口；不造operation.kind/effect、dummy intent/callback或持久化投影。actual row存在但basis/原关联不完整仍Unavailable，不误返回NotFound。

| 全部DTO分支 | 具名读取与构造来源 |
|---|---|
| context/subject | trusted四字段+原subject；namespace/read同本页§1，wrong family预拒绝 |
| Inbound | InboundRepository.read_snapshot(record) -> ExistingLocalSnapshot::Inbound；record/dedup/original/read_basis全实际 |
| Intent | DeliveryRepository.read_snapshot(intent) -> Delivery；plan Option/intent/attempts/receipts/original/read_basis六字段完整 |
| Attempt | get_attempt -> 其actual intent/effect关联 -> read_snapshot原intent；不得通过attempt ID拼intent |
| Receipt | get_receipt -> actual原attempt/effect -> get_attempt/read_snapshot；known receipt不提升送达已读 |
| Callback | CallbackRepository.read_snapshot(callback) -> Callback；action Option/record/original/read_basis原四字段 |
| Operation | SafeTraceRepository.read_operation_snapshot(operation) -> ExistingLocalSnapshot::Operation；actual stored-result精确索引取完整original及全部结果，不凭id拼effect/kind |
| Presentation / Action | DeliveryRepository.read_plan_snapshot / CallbackRepository.read_action_snapshot -> Presentation / Action独立variant；无intent/callback也读原完整root，不造dummy |
| view构造 | 完整snapshot+current资格 -> 原六字段；五stage ACK/Local/Owner/Platform/Consumer独立；无GlobalSuccess/Delivered/TurnCommitted |

### 2.2 函数级调用图：GetBridgeOperationView

```text
[QueryDispatcher -> GetBridgeOperationView]
  | call Input.from_parts; validate eight-family allowlist
  v
[SafeReadQualificationPort]
  | call qualify_subject -> qualify_local_read
  v
[Inbound / Delivery / Callback / SafeTrace / Continuity repositories]
  | query exact actual row and original root snapshot only
  | missing root/full basis -> Unavailable, no guessed original or repair
  v
[SafeReadQualificationPort -> LocalViewProjector]
  | call revalidate; call project with original complete snapshot
  | return filtered stages/refs, no foreign probe
```

关键说明：

- Attempt/Receipt只能沿actual原root关联读取；缺original/standalone root返回Unavailable，不拼dummy对象。
- Protocol/Local/Owner/Platform/Consumer五stage独立，零foreign probe、补result或truth写入。

### 2.3 关键伪代码

```rust
// [SafeReadQualificationPort.qualify_subject(ActorRef actor, InstallationNamespace namespace, BridgeViewSubjectRef subject, SafeAuthorityRef authority, BridgeCallControl control)]
let subject_q = read.qualify_subject(&actor, &namespace, &subject, &authority, control).await?;
// [SafeReadQualificationPort.qualify_local_read(CurrentReadQualification qualification, u32 limit, BridgeCallControl control)]
let local_q = read.qualify_local_read(&current, row_limit, control).await?;
let session = BridgeLocalReadSession::Committed { context: &read_context };
// [DeliveryRepository.get_attempt(AttemptRef attempt, BridgeLocalReadSession read, BridgeCallControl control)]
let attempt = /* Attempt branch */ delivery.get_attempt(&attempt_ref, &session, control).await?;
// [DeliveryRepository.read_snapshot(DeliveryIntentRef intent, BridgeLocalReadSession read, BridgeCallControl control)]
let snapshot = /* Intent/actual Attempt/Receipt root only */ delivery.read_snapshot(&actual_intent_ref, &session, control).await?;
// [InboundRepository.read_snapshot(InboundRecordRef record, BridgeLocalReadSession read, BridgeCallControl control)]
let inbound_snapshot = /* exclusive Inbound branch */ inbound.read_snapshot(&record_ref, &session, control).await?;
// [CallbackRepository.read_snapshot(CallbackRecordRef callback, BridgeLocalReadSession read, BridgeCallControl control)]
let callback_snapshot = /* exclusive Callback branch */ callbacks.read_snapshot(&callback_ref, &session, control).await?;
// [SafeTraceRepository.read_operation_snapshot(BridgeOperationRef operation, BridgeLocalReadSession read, BridgeCallControl control)]
let operation_snapshot = /* exclusive Operation branch */ trace.read_operation_snapshot(&operation_ref, &session, control).await?;
// [DeliveryRepository.read_plan_snapshot(PresentationPlanRef plan, BridgeLocalReadSession read, BridgeCallControl control)]
let plan_snapshot = /* exclusive Presentation branch */ delivery.read_plan_snapshot(&plan_ref, &session, control).await?;
// [CallbackRepository.read_action_snapshot(ExternalActionBindingRef action, BridgeLocalReadSession read, BridgeCallControl control)]
let action_snapshot = /* exclusive Action branch */ callbacks.read_action_snapshot(&action_ref, &session, control).await?;
// [ExistingLocalSnapshot.validate()]
let full = /* chosen exact variant only */ ExistingLocalSnapshot::Delivery(actual_snapshot).validate()?;
// [SafeReadQualificationPort.revalidate(CurrentReadQualification qualification, BridgeCallControl control)]
let final_q = read.revalidate(&current, control).await?;
// [LocalViewProjector.project(CurrentReadQualification read, Option<ExistingLocalSnapshot> snapshot, SafeInstant now)]
let result = projector.project(final_current, Some(full), actual_observed_at)?;
// 每个branch只消费matching snapshot variant；actual full basis不足仍Unavailable。
```

### 2.4 事务边界

只有Committed只读session。实际root关联及required集合完整才组装；超过预算、不一致或Strong不满足Unavailable，不截第一页变完整。lookup missing不查询owner/platform、不replay。最终current裁剪失败丢弃旧可见字段；没有begin/审计/dedup写。

### 2.5 错误映射

八族外/page/key=InvalidInput；无读权NotVisible；authorized subject actual absent才NotFound；subject有行但root/原op/basis不足Unavailable。owner Unknown/platform Indeterminate在获准View保阶段，不缩overall错误或伪零效果；隐藏stage/ref不出。

### 2.6 状态与事件副作用

只读原inbound/plan/intent/attempt/action/callback状态和immutable receipt。ACK失败仍可能OwnerAccepted，内部commit仍可能平台NotAttempted或Unknown；不补结果、调用foreign、生成run/O01。Step10只为原state读取点，不产生新触发。

### 2.7 测试切口与停审

`safe_read_tests.rs`/`protocol_surface_tests.rs`覆盖八族及新增Operation/Presentation/Action exact snapshot root、Attempt/Receipt实际root、完整journal/root缺来源时Unavailable零dummy、十一ExistingLocalSnapshot穷尽消费、所有stage不互提升、receipt非Delivered、hidden ref/count与取消、Strong/预算。全链zero write/probe/repair/audit断言；未运行。

| 停审项 | 结论 / 缺口 |
|---|---|
| DTO/对象/port | 受权R1 pass_design；八族独立选择、三个新增root均为完整actual只读，无dummy或反查全库 |
| tx/error/state/副作用 | pass_design_only；完整actual root、stage独立、零write/foreign probe/隐藏披露 |
| 测试/phase/复杂度 | pass_design_only；原target，无Query maintenance，下一Q03 |

## 3. Q03 GetContinuityView

### 3.1 入口与目标

QueryDispatcher::Continuity -> `GetContinuityViewInput::from_parts(context, subject)` -> `GetContinuityView::execute`；Application/U6读取U5。[Step8§4/6](03_ddd_step_08_query_protocols.md)、Step6 ContinuitySnapshot/LaneSnapshot/projector、Step7 ContinuityRepository/LaneRepository/SafeRead。问题：gap/unknown可见不等可修复；cursor三个轴不能化成平台offset。采用exact五族读，不调用eligible/current业务维护、clock-ID、advance、release/probe。

| DTO与构造全集 | 原来源 / guard |
|---|---|
| context+subject | actual host四字段+single subject，namespace正式配置解析、page/key None |
| Dedup/Cursor/Gap/Recovery | get_dedup/get_cursor/get_gap/get_recovery原完整行；有actual stream则read_snapshot(stream)，或以actual coherent/time basis组成ContinuitySnapshot::from_parts(dedup,cursors,gaps,recoveries,read_basis)；不适用集合空不表示全库空 |
| Lane | LaneRepository.read_snapshot原lane/candidate Option/active_attempt Option/read_basis -> ExistingLocalSnapshot::Lane；unknown head不能省略 |
| cursor/gap披露 | 原cursor revision/epoch/local和gap范围仅正式current允显的安全stage/ref；opaque resume token/私有position/store cursor不出wire |
| view六字段 | current资格+chosen ExistingLocalSnapshot经projector，count只visible集合；read_basis未完整含subject或超预算Unavailable，无填造 |

### 3.2 函数级调用图：GetContinuityView

```text
[QueryDispatcher -> GetContinuityView]
  | call Input.from_parts; validate five-family allowlist
  v
[SafeReadQualificationPort]
  | call qualify_subject and qualify_local_read
  v
[ContinuityRepository / LaneRepository]
  | query exact get_* or actual read_snapshot
  | compose full local snapshot, preserve gap/unknown head
  v
[SafeReadQualificationPort -> LocalViewProjector]
  | call revalidate and project; return filtered six-field view
  | no probe, cursor advance, lane release or recovery request
```

关键说明：

- expired key、gap和unknown head是原事实，不因为可见就获得修复或Fresh资格。
- 完整受权同源读取不足只Unavailable，不以Strong要求触发写事务、eligible或平台刷新。

### 3.3 关键伪代码

```rust
// [SafeReadQualificationPort.qualify_subject(ActorRef actor, InstallationNamespace namespace, BridgeViewSubjectRef subject, SafeAuthorityRef authority, BridgeCallControl control)]
let q = read.qualify_subject(&actor, &namespace, &subject, &authority, control).await?;
// [SafeReadQualificationPort.qualify_local_read(CurrentReadQualification qualification, u32 limit, BridgeCallControl control)]
let local_q = read.qualify_local_read(&current, row_limit, control).await?;
let session = BridgeLocalReadSession::Committed { context: &read_context };
// [ContinuityRepository.get_gap(GapRef gap, BridgeLocalReadSession read, BridgeCallControl control)]
let gap = /* Gap branch, others exact typed get */ continuity.get_gap(&gap_ref, &session, control).await?;
// [ContinuityRepository.read_snapshot(CursorNamespaceStream stream, BridgeLocalReadSession read, BridgeCallControl control)]
let continuity_snapshot = /* actual permitted stream only */ continuity.read_snapshot(&actual_stream, &session, control).await?;
// [LaneRepository.read_snapshot(DispatchLaneRef lane, BridgeLocalReadSession read, BridgeCallControl control)]
let lane_snapshot = /* exclusive Lane branch */ lanes.read_snapshot(&lane_ref, &session, control).await?;
// [ExistingLocalSnapshot.validate()]
let full = /* chosen variant */ ExistingLocalSnapshot::Lane(actual_lane_snapshot).validate()?;
// [SafeReadQualificationPort.revalidate(CurrentReadQualification qualification, BridgeCallControl control)]
let final_q = read.revalidate(&current, control).await?;
// [LocalViewProjector.project(CurrentReadQualification read, Option<ExistingLocalSnapshot> snapshot, SafeInstant now)]
let result = projector.project(final_current, Some(full), actual_observed_at)?;
```

### 3.4 事务边界

零local写事务、reserve、eligible selection、shared bound mutation。exact read required set不足则Unavailable；Strong不能通过begin/lock或刷新平台补足。受权absent才NotFound。保持原epoch/revision/mutation事实不“修正”。

### 3.5 错误映射

wrong family或key/page拒绝；hidden subject NotVisible无存在性；actual authorized absent NotFound非NoEffect。缺coherent snapshot/time/强一致资格=Unavailable；合法Stale/Indeterminate原fact可按current公开，不转Closed/Ready/Resolved。never hidden_total/ref或opaque cursor。

### 3.6 状态与事件副作用

仅读DedupState/StreamCursorState/GapState/DispatchLaneState/RecoveryState；Expired dedup仍不是Fresh，gap未闭合不显示全覆盖，unknown head不释放。零audit/dedup/refresh/probe/repair/O01或新Recovery/Gap。Step10候选只有读取点。

### 3.7 测试切口与停审

`safe_read_tests.rs`：五族、unknown head/Gap/Recovery、expired key、cursor三轴安全裁剪、partial required超预算、Strong无fallback、hidden总数/offset、未授权先零repo；`protocol_surface_tests.rs`：六字段only/无page/repair。断言无全部write/eligible/probe/clock-ID；未运行。

| 停审项 | 结论 / 缺口 |
|---|---|
| DTO/对象/port | pass_fail_closed_design；五族exact读取/两snapshot，仅actual basis能闭合；缺失Unavailable |
| tx/error/state/副作用 | pass_design_only；zero mutation/probe/eligible、expired不Fresh、unknown不修复 |
| 测试/phase/复杂度 | pass_design_only；原target，无平台cursor export或新状态机，下一Q04 |

## 4. Q04 GetSafeHandoffView

### 4.1 入口与目标

QueryDispatcher::SafeHandoff -> `GetSafeHandoffViewInput::from_parts(context, subject)` -> `GetSafeHandoffView::execute`；Application/U6。[Step8§5/6](03_ddd_step_08_query_protocols.md)、Step6 SafeHandoffSnapshot/projector、Step7 SafeTrace/SafeRead。问题：audit并非canonical/evidence，consumer accepted并非verdict。采用现存material/result的受权裁剪，不repair或创造Bridges admission。

| 构造全集 | actual来源 / 缺失处理 |
|---|---|
| context/subject | host四字段+Audit/Handoff唯一subject，namespace正式source，Query page/key None |
| Audit | SafeTraceRepository.get_audit/read_handoff_snapshot(audit)；immutable audit/source/subject/actual original linkage；handoff None合法不等consumer已接纳 |
| Handoff | get_handoff完整row -> 原audit ref -> read_handoff_snapshot；consumer operation/claim/result/read_basis全原关联，不用日志反造audit |
| SafeHandoffSnapshot四参 | audit、handoff Option、original Option、actual same-source read_basis；有handoff必Some original；只有audit可None，但不能伪零效果 |
| view六字段 | current stage/ref disclosure + actual full snapshot；O01/schema/admission缺口不补ref，consumer stage独立；原visible集合count上限 |

### 4.2 函数级调用图：GetSafeHandoffView

```text
[QueryDispatcher -> GetSafeHandoffView]
  | call Input.from_parts; validate Audit/Handoff only
  v
[SafeReadQualificationPort]
  | call qualify_subject -> qualify_local_read
  v
[SafeTraceRepository]
  | query get_audit or get_handoff -> read_handoff_snapshot
  | no canonical/consumer refresh; original linkage only
  v
[SafeReadQualificationPort -> LocalViewProjector]
  | call revalidate; call project
  | return safe six fields, never evidence/verdict/readiness
```

关键说明：

- audit-only无handoff是合法本地事实；不能据此制造canonical、准入或ConsumerAccepted。
- current安全裁剪只读原关联，consumer accepted不提升为evidence、verdict或readiness。

### 4.3 关键伪代码

```rust
// [SafeReadQualificationPort.qualify_subject(ActorRef actor, InstallationNamespace namespace, BridgeViewSubjectRef subject, SafeAuthorityRef authority, BridgeCallControl control)]
let q = read.qualify_subject(&actor, &namespace, &subject, &authority, control).await?;
// [SafeReadQualificationPort.qualify_local_read(CurrentReadQualification qualification, u32 limit, BridgeCallControl control)]
let local_q = read.qualify_local_read(&current, row_limit, control).await?;
let session = BridgeLocalReadSession::Committed { context: &read_context };
// [SafeTraceRepository.get_handoff(SafeHandoffRef handoff, BridgeLocalReadSession read, BridgeCallControl control)]
let row = /* Handoff only */ trace.get_handoff(&handoff_ref, &session, control).await?;
// [SafeTraceRepository.read_handoff_snapshot(SafeAuditRef audit, BridgeLocalReadSession read, BridgeCallControl control)]
let snapshot = trace.read_handoff_snapshot(&actual_audit_ref, &session, control).await?;
// [ExistingLocalSnapshot.validate()]
let full = ExistingLocalSnapshot::SafeHandoff(actual_snapshot).validate()?;
// [SafeReadQualificationPort.revalidate(CurrentReadQualification qualification, BridgeCallControl control)]
let final_q = read.revalidate(&current, control).await?;
// [LocalViewProjector.project(CurrentReadQualification read, Option<ExistingLocalSnapshot> snapshot, SafeInstant now)]
let result = projector.project(final_current, Some(full), actual_observed_at)?;
```

### 4.4 事务边界

Committed read-only，zero begin/stage/commit/rollback/claim/audit/probe。handoff -> audit读取同scope/原op/source；缺producer实体或full basis不伪造，Unavailable；exact permitted actual absent才NotFound。Strong只driver合同，不跨域刷新。

### 4.5 错误映射

wrong family/page/key拒绝；无权限NotVisible且hidden存在性/ref/count同样隐藏；missing actual authorized row NotFound；不兼容canonical/source/schema/完整slice不可得则Unavailable或已获准原Blocked/Indeterminate View，不变accepted。取消有限Unavailable不构造运行失败材料。

### 4.6 状态与事件副作用

audit/result immutable，仅读SafeHandoffState及consumer原阶段；当前无Bridges admission，不能制造Pending/ConsumerAccepted。零O01、replay、补canonical、evidence/report/verdict/signoff/readiness。Step10仅handoff state读取候选，无状态变化。

### 4.7 测试切口与停审

`safe_read_tests.rs`/`protocol_surface_tests.rs`覆盖两族、audit-only无handoff、consumer transport ACK vs accepted、wrong original/schema/ref、隐藏count/current撤销、Strong/required不足、zero J04/probe/audit/claim。只planned未执行。

| 停审项 | 结论 / 缺口 |
|---|---|
| DTO/对象/port | pass_design_only；两族原audit/handoff完整snapshot/factory/资格/六字段闭合 |
| tx/error/state/副作用 | pass_design_only；无canonical补写或准入签发，local audit不是证据与验收 |
| 测试/phase/复杂度 | pass_design_only；BR-UP-006保持blocked positive，原测试责任；下一E01 |

## 5. Query批次与组内审计

| Flow / 协议 | 模块 / 对象 | 主要port / 副作用 | 停审 |
|---|---|---|---|
| Q01 GetBindingMappingView | U6/U1 Installation与mapping snapshot | SafeRead + Installation/Mapping；zero write | pass_fail_closed_design |
| Q02 GetBridgeOperationView | U6/U2/U3/U4原stage snapshot | SafeRead + Inbound/Delivery/Callback/Continuity/SafeTrace；zero probe | pass_fail_closed_design；root positive缺口保留 |
| Q03 GetContinuityView | U6/U5 Continuity/Lane | SafeRead + Continuity/Lane；zero repair | pass_fail_closed_design |
| Q04 GetSafeHandoffView | U6 audit/handoff | SafeRead + SafeTrace；zero canonical/evidence | pass_design_only |

四独立flow/七子节/构造与停审完成；仅用已有snapshot与projector，不用共有模板代替分支。全链无UoW/Clock-ID/eligible/foreign probe注入或维护动作；actual missing和hidden/current不足分开。组内静态审计在X实际运行。
