# L5-chat 03 · Step 9 逐接口函数级处理流

> 状态：done；gate_status：pass_with_upstream_blockers；日期：2026-10-01。
> 前置：Step8 done/pass_with_upstream_blockers；输入Step5模块/Step6函数/Step7 ports/Step8全43协议。
> 规范：详细设计SOP Step9/书写规范5.8；参考L1-governance Step9逐接口图、typed伪代码、构造、事务、状态、副作用与停审模板。
> TS planned流程，不实现/编译/运行；无backend UoW/outbox/bus。回填未来正式03 §8，本轮不装配。

## 1. 分批计划与SOP回答

| 顺序 | 范围 | 状态 | 门禁 |
|---|---|---|---|
| 9-A | 两业务Command+preview/local recovery | done | dispatch前reservation，unknown不重放 |
| 9-B | 20 Query，分navigation/material/local/project | done | 独立source slots/全字段factory |
| 9-C | 7 Consumer | done | source资格/撤销安全例外/receipt非业务确认 |
| 9-D | 2诊断意图+8Job+2local actions | done | local版本/恢复coverage/无owner repair |
| 9-E | 43条跨flow审计 | done | 方法/状态/SDK副作用闭合 |

每Step8协议必须同名独立flow。函数入口为app组成的typed ClientUseCases facade，其每方法完整签名见Step8独立卡；facade负责严格请求检查并显式委托coordinator。所有port调用只取Step7定义。方法返回Outcome.error必须停止后续不安全步骤；SDK开始dispatch后安全结果只能正式gate收敛，CAS失败不能重发。本文TS伪代码等价裁剪Rust模板；每call必须注明对象.方法(typed 参数)，不能新增隐藏transport或临时helper。

## 2. 共同局部一致性约束

```text
[ClientUseCases.<named>(NamedRequest)]
  | call NamedInputFactory / trusted session validation
  v
[NamedCoordinator + ClientStatePort.read()]
  | CAS reserve current local route/request/attempt before async IO
  v
[Step7 named SDK/host port]
  | qualified safe return; no owner API/bus fallback
  v
[Step6 named pure factory/reducer/gate]
  | CAS expected root.version + fence + all affected slot checks
  v
[ClientReplyFactory(value, committed/read localVersion)]
```

关键说明：
- 图是检查顺序；每接口下文给出独立调用和分支，不以本图替代。
- 每async读先登记ConsumptionRequest.slotId/current context，旧generation失效；nested section各source槽位单独登记。
- root CAS失败：只读可重读并验证当前slot后重算pure patch；**不改变incoming代次以通过检查**。已dispatch不重新SDK调用。
- current actor/scope/target/source/visibility/父revision/querylineage同时有效才可应用。取消read不证明command无副作用。

本地事务是单ClientStatePort.compareAndSet(expected, fence, ClientPatch)；root版本与消费checks一次原子应用，无部分成功。repository load/save/evict独立local版本，不能与root假设跨store原子。scope撤销先隐藏/失效，再stop/delete；delete失败依旧隐藏且restricted。local selector/草稿/视口及正式可核验的收紧cleanup允许空checks，正式结果/投影/水位更新不能空。

所有输入依Step8 schema和Step6 factory完整验证；SDK exact binding缺失立即dependency_unbound。fake只能独立preview/test语境，不确认真实attempt。每flow返值来自当前同local应用/读取版本；异步reply返回前若版本变化，重读确认该结果仍是当前切片，否则context_changed，不标新version假装旧数据新鲜。

## 3. Shared输出、错误和planned验证

ClientReplyFactory.create<T>仅在成功已应用/纯read当前版本后构造。所有consumer用LocalConsumerReceiptFactory，applied/duplicate/ignored/blocked/restricted/needs_requery是local处置。未执行的planned测试切口只描述验证目标，不记录test result/证据。

每flow默认错误：factory invalid_input/unsafe_material；正式资格authority_missing/access_denied/dependency_unbound；late=context_changed；CAS=local_conflict；只读取消aborted_read。所有错误先安全裁剪，不泄漏text/ref/token/stack。业务调用effect_unknown保留attempt关联只probe。无backend trace/audit/history/outbox/owner truth变动；只有正式SDK调用可能由owner产生业务副作用，Chat不声明其成功。

## 4. 9-A 受控Command及local入口

| Flow | 协议/对象 | port | 状态/停审 |
|---|---|---|---|
| SubmitConversationIntent | Step8 SubmitConversationIntent/IntentFeedbackViewModel | IntentCommandPort.prepare/dispatch; IntentProbePort.readCapability | 本flow独立停审，外部blocked |
| SubmitGovernanceIntent | Step8 SubmitGovernanceIntent/IntentFeedbackViewModel | IntentCommandPort.prepare/dispatch; IntentProbePort.readCapability | 本flow独立停审，外部blocked |
| RequestSafePreview | Step8 RequestSafePreview/PreviewResultView | SafeReferencePort.preview | 本flow独立停审，外部blocked |
| AcknowledgeLocalRecoveryAction | Step8 AcknowledgeLocalRecoveryAction/RecoveryViewModel | ResumePort/IntentProbePort或local clear | 本flow独立停审，外部blocked |

### 4.1 SubmitConversationIntent

#### 入口、目标与构造

submitConversationIntent(request: SubmitConversationIntentRequest): Promise<Outcome<SubmitConversationIntentReply>>，声明见Step8同名卡；归UserIntentCoordinator.submitConversation，input=ConversationIntentInput、value=IntentFeedbackViewModel。目标：显式用户提交；同draft/revision预留一次；普通receipt不能confirmed，unknown只probe。

#### 函数级调用图: SubmitConversationIntent

```text
[ClientUseCases.submitConversationIntent(typed request)]
  | call strict ClientRequestFactory / ConversationIntentInput validation
  v
[UserIntentCoordinator.submitConversation]
  | read current local state; call IntentCommandPort.prepare/dispatch; IntentProbePort.readCapability
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<ConversationIntentInput>(ClientRequest<ConversationIntentInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [ConversationIntentInputFactory.create(ConversationIntentInput input)]
const input = ConversationIntentInputFactory.create(request.input); // 失败立即返回
// [ClientStatePort.read(): ClientSnapshot]
const base = store.read(); // current session/fence/slot、capability、draftRevision须全部匹配
// 当前draftRef/revision已有nonterminal attempt时返回其feedback，不执行SDK。
const draft: DraftState = base.drafts.get(input.request.context.fence.contextRef);
const frozen: FrozenConversationPayload = FrozenConversationPayloadFactory.create({
  draftRef: draft.draftRef, draftRevision: draft.revisionHint, text: draft.safeText,
  attachments: draft.attachmentRefs, replyTarget: draft.replyTarget
});
const intent: LocalId<"intent"> = identity.newId("intent");
// [AttemptFactory.fromDraft(id, kind, fence, session, draft)]
const reserved = AttemptFactory.fromDraft(intent, "conversation", input.request.context.fence, session, draft);
// [DraftFactory.markSubmitting(draft, intent, expectedRevision)]
const submitting = DraftFactory.markSubmitting(draft, intent, input.draftRevision);
// 第一次CAS changes.attempts/drafts为base的immutable copy；当前slot检查覆盖输入。
// CAS失败没有prepare/dispatch调用权，重复点击读取已有attempt返回。
store.compareAndSet(base.version, reserved.fence, reservePatch);
// [CommandPrepareInputFactory.create(CommandPrepareInput)]
const prepareInput = CommandPrepareInputFactory.create({
  request: input.request, attempt: reserved, capability: input.capability,
  conversation: frozen, governance: null
});
// [IntentCommandPort.prepare(prepareInput, session)]
const prepared = await commands.prepare(prepareInput, session); // 正式no-effect且冻结payload
// prepare失败：未dispatch，failBeforeDispatch→failed，保留/重验草稿；不得产生Turn。
// [AttemptFactory.bindIdempotency(attempt, association)]
const bound = AttemptFactory.bindIdempotency(reserved, prepared.idempotencyAssociation);
// [AttemptFactory.reserveDispatch(attempt, prepared)]
const armed = AttemptFactory.reserveDispatch(bound, prepared);
// 第二次CAS以最新read.version写association、submitted/dispatched=true；同intent仍draft且当前slot。
// 只有成功CAS的此次调用拥有dispatch权，CAS失败不再发。
// [IntentCommandPort.dispatch(PreparedCommand prepared, QualifiedSession session)]
const submission = await commands.dispatch(prepared, session); // 唯一一次业务副作用边界
// 成功结果匹配关联后markSubmitted/applyReceipt；普通receipt至多pending。
// error/中断且无formal no-effect证明：AttemptFactory.markUnknown(armed,"waiting")。
// 回包写store失败只重读/gate，不能回到dispatch；route已切换不披露旧反馈。
// [IntentFeedbackFactory.fromAttempt(CommandAttemptState current)]
// factory名以Step6 IntentFeedbackFactory.fromAttempt为准；派生同root已应用attempt。
// [ClientReplyFactory.create<IntentFeedbackViewModel>(ClientReply<IntentFeedbackViewModel> input)]
```

#### 一致性、错误与状态副作用

两次local CAS：attempt+draft reservation，以及association+调用权；SDK调用不与CAS组成原子事务。已可能调用不得rollback为可发送状态。

CAS/prepare前失败无owner副作用；prepare后失去slot则不dispatch。reservation后中断保守unknown。正式确认进入ConsumeCommandReceiptOrResult/Probe流程；只匹配draftRef/revision清稿，编辑新revision保留。 默认错误见§3；CHAT-UP001/002未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：DraftPhase locally_valid→submitting；CommandResultPosture draft→submitted→pending/terminal/unknown；Feedback派生optimistic。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：双击、IME、ACK、旧确认不清新稿；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP001/002 blocked）；未运行测试。

### 4.2 SubmitGovernanceIntent

#### 入口、目标与构造

submitGovernanceIntent(request: SubmitGovernanceIntentRequest): Promise<Outcome<SubmitGovernanceIntentReply>>，声明见Step8同名卡；归UserIntentCoordinator.submitGovernance，input=GovernanceIntentInput、value=IntentFeedbackViewModel。目标：显式用户操作与正式Gate/action capability；点击不审批成功；不能借Process Gateway资格。

#### 函数级调用图: SubmitGovernanceIntent

```text
[ClientUseCases.submitGovernanceIntent(typed request)]
  | call strict ClientRequestFactory / GovernanceIntentInput validation
  v
[UserIntentCoordinator.submitGovernance]
  | read current local state; call IntentCommandPort.prepare/dispatch; IntentProbePort.readCapability
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<GovernanceIntentInput>(ClientRequest<GovernanceIntentInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [GovernanceIntentInputFactory.create(GovernanceIntentInput)]
const input = GovernanceIntentInputFactory.create(request.input);
// [ClientStatePort.read(): ClientSnapshot]
const base = store.read();
// gate/action/capability必须当前SDK registry且同actor/scope，Process gateway绝不作gate输入。
// [VisibilityGuard.evaluateIntent(IntentCapabilityView, AccessPosture)]
const guard = visibilityGuard.evaluateIntent(input.capability, base.access);
// 同Gate/action已nonterminal intent返回已有反馈；本地reservation键只安全ref，不存正文。
// [AttemptFactory.fromDraft(LocalId<"intent">, IntentKind, ContextFence, QualifiedSession, DraftState|null)]
const reserved = AttemptFactory.fromGovernance(identity.newId("intent"), input.request.context.fence, session, input);
// CAS attempts immutable copy，输入slot匹配且guard.allowed；失败没有发送权。
store.compareAndSet(base.version, reserved.fence, reservePatch);
// [CommandPrepareInputFactory.create(CommandPrepareInput)]
const prepareInput = CommandPrepareInputFactory.create({
  request: input.request, attempt: reserved, capability: input.capability,
  conversation: null, governance: input
});
// [IntentCommandPort.prepare(CommandPrepareInput, QualifiedSession)]
const prepared = await commands.prepare(prepareInput, session); // no-effect正式能力
// [AttemptFactory.bindIdempotency + reserveDispatch]
const bound = AttemptFactory.bindIdempotency(reserved, prepared.idempotencyAssociation);
const armed = AttemptFactory.reserveDispatch(bound, prepared);
// 再read并CAS当前intent/slot，submitted/dispatched=true预留调用权；失败不发送。
// [IntentCommandPort.dispatch(PreparedCommand, QualifiedSession)]
const submission = await commands.dispatch(prepared, session); // 仅一次
// [AttemptFactory.markSubmitted(CommandAttemptState, CommandSubmission)]
// [AttemptFactory.applyReceipt(CommandAttemptState, CommandReceiptView, CommandResultGate)]
// ordinary receipt非terminal；result另走gate；中断无no-effect证明markUnknown。
// [IntentFeedbackFactory.fromAttempt(CommandAttemptState)]
// [ClientReplyFactory.create<IntentFeedbackViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

local attempt reservation及调用权CAS与SDK独立，无Governance transaction/Decision写入。

授权/Gate/action stale立即拒绝；pre-dispatch正式无副作用失败可failed；已调用不确定unknown，只query/probe。点击反馈不approved，结果terminal需Governance ResultAuthority；双击不得重复调用。 默认错误见§3；CHAT-UP001/003未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：CommandResultPosture draft→submitted→pending/confirmed/rejected/failed/unknown；GateCard只派生Feedback，不写Decision。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：Gate过期、action错配、普通receipt、unknown；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP001/003 blocked）；未运行测试。

### 4.3 RequestSafePreview

#### 入口、目标与构造

requestSafePreview(request: RequestSafePreviewRequest): Promise<Outcome<RequestSafePreviewReply>>，声明见Step8同名卡；归PreviewBoundary.isOpenable + SafeReferencePort.preview，input=PreviewReadInput、value=PreviewResultView。目标：本轮只绑定正式no-effect preview query；若SDK定义副作用request则blocked，不模拟Command。

#### 函数级调用图: RequestSafePreview

```text
[ClientUseCases.requestSafePreview(typed request)]
  | call strict ClientRequestFactory / PreviewReadInput validation
  v
[PreviewBoundary.isOpenable + SafeReferencePort.preview]
  | read current local state; call SafeReferencePort.preview
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<PreviewReadInput>(ClientRequest<PreviewReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [PreviewReadInputFactory.create(PreviewReadInput)]
const input = PreviewReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// 登记当前Artifact slot；reference由registry正式资格且只读/no-effect合同bound。
// [SafeReferencePort.preview(PreviewReadInput, QualifiedSession)]
const raw = await references.preview(input, session);
// [PreviewResultViewFactory.create(PreviewResultView)]
const view = PreviewResultViewFactory.create(raw.projection);
// formal authority/consumptionContext/source/visibility与当前slot完全匹配。
// [PreviewBoundary.isOpenable(PreviewReference, AccessPosture, PlatformCapabilityState)]
const openable = view.reference !== null &&
  previewBoundary.isOpenable(view.reference, view.surface.access, base.platform);
// host未绑定不执行open，view.openRef只能保留正式允许受控入口，UI按钮按openable控制。
// CAS changes.preview=view，checks含original raw.consumptionContext；hidden清reference/summary/openRef/provenance。
// [ClientStatePort.compareAndSet(LocalVersion, ContextFence, ClientPatch)]
const committed = store.compareAndSet(current.version, input.request.context.fence, previewPatch);
// [ClientReplyFactory.create<PreviewResultView>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

SDK未明确no-effect preview则dependency_unbound；expired/hidden不保存旧ref；宿主不可用不自动browser URL打开，safe摘要是否可读由Artifact access独立决定。 默认错误见§3；CHAT-UP004/host未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Access/Disclosure/Freshness独立；preview不是CommandResultPosture，不新增业务提交终态。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：preview过期、host不可用、迟到/隐藏；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP004/host blocked）；未运行测试。

### 4.4 AcknowledgeLocalRecoveryAction

#### 入口、目标与构造

acknowledgeLocalRecoveryAction(request: AcknowledgeLocalRecoveryActionRequest): Promise<Outcome<AcknowledgeLocalRecoveryActionReply>>，声明见Step8同名卡；归RecoveryCoordinator.choose，input=RecoveryActionInput、value=RecoveryViewModel。目标：用户选择只更新local恢复；unknown不自动重发；wait无业务IO。

#### 函数级调用图: AcknowledgeLocalRecoveryAction

```text
[ClientUseCases.acknowledgeLocalRecoveryAction(typed request)]
  | call strict ClientRequestFactory / RecoveryActionInput validation
  v
[RecoveryCoordinator.choose]
  | read current local state; call ResumePort/IntentProbePort或local clear
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<RecoveryActionInput>(ClientRequest<RecoveryActionInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [RecoveryActionInputFactory.create(RecoveryActionInput)]
const input = RecoveryActionInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// 当前source recovery.allowedActions含action；unknown attempt不得explicit_retry。
switch (input.action) {
  case "resume": /* [ResumeCoordinator.resume(ResumeInput, QualifiedSession)] */ await resumes.resume(input.resume, session); break;
  case "requery": /* [ResumeCoordinator.requery(ResumeInput, QualifiedSession)] */ await resumes.requery(input.resume, session); break;
  case "probe": /* [UserIntentCoordinator.resolveUnknown(LocalId<"intent">, QualifiedSession)] */ await intents.resolveUnknown(input.intentRef, session); break;
  case "clear": /* [CacheEvictionCoordinator.clearContext(ClearContextInput)] */ await eviction.clearContext(currentClearInput); break;
  case "wait": // 当前local allowed动作，无业务IO；保持姿态
  case "needs_action": // local nextAction提示，不执行SDK业务command
}
// [RecoveryCoordinator.choose(RecoveryActionInput, QualifiedSession)]返回当前派生RecoveryViewModel。
// 每分支独立当前slot/version，clear输入由当前partition/key/正式visibility构造，不能从目标ref拼key。
// [ClientReplyFactory.create<RecoveryViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

resume/requery/probe失败保持blocked/stale/unknown，不切换为发送；clear删除失败restricted；wait没有业务IO，user action本身不证明owner任何状态。 默认错误见§3；CHAT-UP002/storage未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：ContinuityPhase stale/gap→resuming等；Command unknown保持；LocalProjection evicting→cleared/restricted。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：非法action、unknown retry、清理失败；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP002/storage blocked）；未运行测试。

### 4.5 9-A停审

发送调用权先CAS再dispatch、result gate不吃普通ACK；预览no-effect限定、local恢复不业务重放。四flow独立构造/版本/异常/状态切口闭合；external blocker继续，不执行测试。进入9-B。

## 5. 9-B Query A：导航与安全协作读取

| Flow | 协议/对象 | port | 状态/停审 |
|---|---|---|---|
| ResolveEntryAccess | Step8同名/RouteContext | EntryAccessPort.resolve | 逐flow独立停审 |
| LoadConversationSurface | Step8同名/ConversationPageViewModel | CollaborationReadPort.readSurface | 逐flow独立停审 |
| LoadTurnPage | Step8同名/ConversationSurfaceViewModel | CollaborationReadPort.readTurnPage | 逐flow独立停审 |
| LoadOwnerSummary | Step8同名/SafeMaterialSnapshot | SafeMaterialReadPort.readSummary | 逐flow独立停审 |
| LoadArtifactPreview | Step8同名/PreviewResultView | SafeReferencePort.preview | 逐flow独立停审 |
| LoadIntentCapability | Step8同名/IntentCapabilityView | IntentProbePort.readCapability | 逐flow独立停审 |
| ProbeCommandAttempt | Step8同名/IntentFeedbackViewModel | IntentProbePort.probe | 逐flow独立停审 |
| LoadResumeContext | Step8同名/ResumeContext | ResumePort.resume | 逐flow独立停审 |

### 5.1 ResolveEntryAccess

#### 入口、目标与构造

resolveEntryAccess(request: ResolveEntryAccessRequest): Promise<Outcome<ResolveEntryAccessReply>>，声明见Step8同名卡；归RouteContextCoordinator.enter，input=EnterRouteInput、value=RouteContext。目标：未获target scope前不用ContextFence；所有返回/深链重新验证。

#### 函数级调用图: ResolveEntryAccess

```text
[ClientUseCases.resolveEntryAccess(typed request)]
  | call strict ClientRequestFactory / EnterRouteInput validation
  v
[RouteContextCoordinator.enter]
  | read current local state; call EntryAccessPort.resolve
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<EnterRouteInput>(ClientRequest<EnterRouteInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [EnterRouteInputFactory.create(EnterRouteInput)]
const input = EnterRouteInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// 可信请求session/actor/route/generation匹配，先invalidate旧consumption、遮蔽旧entry/surface/project/node/目录/preview/capability。
const candidate = input.entryCandidate !== null
  ? RouteContextFactory.fromEntry(input.requestFence.routeId, input.entryCandidate, base.platform.platformKind, input.kind, input.requestFence.generation, input.provenance)
  : RouteContextFactory.fromTarget(input.requestFence.routeId, input.targetCandidate, base.platform.platformKind, input.kind, input.requestFence.generation, input.provenance);
// CAS当前generation，route unresolved，access blocked，旧引用/slots清；取消旧query/feed不是授权条件。
// [EntryAccessPort.resolve(EnterRouteInput, QualifiedSession)]
const resolution = await entries.resolve(input, session);
// [QualifiedEntryResolutionFactory.create(QualifiedEntryResolution)]
const qualified = QualifiedEntryResolutionFactory.create(resolution);
// [VisibilityGuard.evaluateEntry(QualifiedEntryResolution)]
const guard = visibilityGuard.evaluateEntry(qualified);
// thread另用ScopeEntryGuard.evaluateThread(parent,qualified)；parent仅formal解析结果。
// [RouteContextFactory.applyEntryResult(RouteContext, QualifiedEntryResolution)]
const resolved = RouteContextFactory.applyEntryResult(candidate, qualified);
// CAS先核对当前routeId/session/actor/generation/requested scope，matched entry结果才能写route/access。
// 无目标fence时仅受控安全route验证路径，不能空checks导入其它材料。
// [RouteContextCoordinator.enter(EnterRouteInput, QualifiedSession)]返回同CAS的route。

```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

late entry先discard，hidden/blocked清scope/context/target/return引用。新route generation不能由返回结果修改；group/channel/dm/thread父级SDK证明；项目/目录不私造conversation context。 默认错误见§3；CHAT-UP001/005/009未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Route unresolved→resolved/restricted/expired/cleared；Access qualified可读或blocked/hidden；旧contexts invalidated→cleared。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：late/deep-link/thread-parent；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP001/005/009 blocked）；未运行测试。

### 5.2 LoadConversationSurface

#### 入口、目标与构造

loadConversationSurface(request: LoadConversationSurfaceRequest): Promise<Outcome<LoadConversationSurfaceReply>>，声明见Step8同名卡；归CollaborationSurfaceCoordinator.loadSurface，input=SurfaceReadInput、value=ConversationPageViewModel。目标：group/channel/dm/thread共用；每Turn正式分类safe renderer，unknown类型fallback。

#### 函数级调用图: LoadConversationSurface

```text
[ClientUseCases.loadConversationSurface(typed request)]
  | call strict ClientRequestFactory / SurfaceReadInput validation
  v
[CollaborationSurfaceCoordinator.loadSurface]
  | read current local state; call CollaborationReadPort.readSurface
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<SurfaceReadInput>(ClientRequest<SurfaceReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [SurfaceReadInputFactory.create(SurfaceReadInput)]
const input = SurfaceReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// request slot已登记且current active；contextRef/parent关系由正式SDK registry，不解析ref。
// [CollaborationReadPort.readSurface(SurfaceReadInput, QualifiedSession)]
const read = await reads.readSurface(input, session);
// [SurfaceReadProjectionFactory.create(SurfaceReadProjection)]先核对safe字段，not_visible清context/parent/turns。
// [SurfaceFactory.fromRead(QualifiedMaterial<SurfaceReadProjection>, ContinuityState, SelectionState)]
const surface = SurfaceFactory.fromRead(read, current.continuityBySource.get(input.request.context.sourceReference), current.selection);
// TurnPresentationFactory.fromSafeTurn逐safe Turn/独立provenance；未知类型unsupported，不能raw HTML。
// CAS changes.surface=surface，仅original read.consumptionContext check与current request。
// [PageViewModelAssembler.assemble(ClientSnapshot)]
const page = assembler.assemble(committed); // draft/feedback/accessibility/panels取同root
// [ClientReplyFactory.create<ConversationPageViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

empty保持正式context/access；hidden清引用，contract缺失blocked，无历史缓存授权。source状态缺正式连续性不能fresh。CAS失败重读current slot后pure重算，不能把incoming代次改成current。 默认错误见§3；CHAT-UP001/002未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Access/Disclosure/Freshness/Selection；Conversation不是Chat truth，不推进Turn lifecycle。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：empty、not_visible、thread关系、stale；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP001/002 blocked）；未运行测试。

### 5.3 LoadTurnPage

#### 入口、目标与构造

loadTurnPage(request: LoadTurnPageRequest): Promise<Outcome<LoadTurnPageReply>>，声明见Step8同名卡；归CollaborationSurfaceCoordinator.loadTurnPage，input=TurnPageInput、value=ConversationSurfaceViewModel。目标：分页不自排cursor/跨query合并；request代次匹配。

#### 函数级调用图: LoadTurnPage

```text
[ClientUseCases.loadTurnPage(typed request)]
  | call strict ClientRequestFactory / TurnPageInput validation
  v
[CollaborationSurfaceCoordinator.loadTurnPage]
  | read current local state; call CollaborationReadPort.readTurnPage
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<TurnPageInput>(ClientRequest<TurnPageInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [TurnPageInputFactory.create(TurnPageInput)]
const input = TurnPageInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// 当前surface非null可读，输入page.cursor/lineage必须base.surface.pageInfo，当前source/query一致。
// [CollaborationReadPort.readTurnPage(TurnPageInput, QualifiedSession)]
const page = await reads.readTurnPage(input, session);
// [TurnPageProjectionFactory.create(TurnPageProjection)]字段完整/正式page资格。
// [SurfaceFactory.applyTurnPage(ConversationSurfaceViewModel, QualifiedMaterial<TurnPageProjection>)]
const next = SurfaceFactory.applyTurnPage(current.surface, page);
// 保留SDK正式排序，同canonical Turn ref去重，pageInfo从qualified结果，不比较cursor大小。
// CAS changes.surface=next，check original page.consumptionContext，根version最新read。
// [ClientReplyFactory.create<ConversationSurfaceViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

新surface/query/generation或lineage错context_changed；前页尚未当前应用不能请求下一页；并发同页coalesce只读，不覆盖新lineage。hidden页清ref不能追加旧timeline。 默认错误见§3；CHAT-UP002未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：source Freshness/Disclosure；local selection不改变Turn truth。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：并发页、旧lineage、重复Turn；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP002 blocked）；未运行测试。

### 5.4 LoadOwnerSummary

#### 入口、目标与构造

loadOwnerSummary(request: LoadOwnerSummaryRequest): Promise<Outcome<LoadOwnerSummaryReply>>，声明见Step8同名卡；归SafeMaterialReadPort.readSummary + SafeMaterialComposer，input=OwnerSummaryReadInput、value=SafeMaterialSnapshot。目标：单owner摘要；tool/Agent/commit/test仅safe ref/summary，不验收。

#### 函数级调用图: LoadOwnerSummary

```text
[ClientUseCases.loadOwnerSummary(typed request)]
  | call strict ClientRequestFactory / OwnerSummaryReadInput validation
  v
[SafeMaterialReadPort.readSummary + SafeMaterialComposer]
  | read current local state; call SafeMaterialReadPort.readSummary
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<OwnerSummaryReadInput>(ClientRequest<OwnerSummaryReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [OwnerSummaryReadInputFactory.create(OwnerSummaryReadInput)]
const input = OwnerSummaryReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read(); // 当前target/source slot
// [SafeMaterialReadPort.readSummary(OwnerSummaryReadInput, QualifiedSession)]
const material = await materialsRead.readSummary(input, session);
// [SafeMaterialComposer.compose(QualifiedMaterial<SafeMaterialSnapshot>, AccessPosture)]
const safe = composer.compose(material, current.access); // target自己的access，非借route更宽权限
// materialId由正式target/current source的local缓存关联，不能把owner ID当local ID。
// CAS changes.materials=immutable map更新safe.materialId；original consumptionContext check。
// [ClientReplyFactory.create<SafeMaterialSnapshot>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

owner/source/visibility错拒绝；unknown/partial不表示完整coverage；Identity、Work、Member、Runtime、Workspace分域，不解释工具/commit/test结果为acceptance。 默认错误见§3；CHAT-UP004/005/006、WS-UP未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：FreshnessState/DisclosurePosture，单source local materials。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：wrong owner、部分来源、unsafe body；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP004/005/006、WS-UP blocked）；未运行测试。

### 5.5 LoadArtifactPreview

#### 入口、目标与构造

loadArtifactPreview(request: LoadArtifactPreviewRequest): Promise<Outcome<LoadArtifactPreviewReply>>，声明见Step8同名卡；归PreviewBoundary.isOpenable + SafeReferencePort.preview，input=PreviewReadInput、value=PreviewResultView。目标：不返回正文/URL；无正式no-effect能力blocked。

#### 函数级调用图: LoadArtifactPreview

```text
[ClientUseCases.loadArtifactPreview(typed request)]
  | call strict ClientRequestFactory / PreviewReadInput validation
  v
[PreviewBoundary.isOpenable + SafeReferencePort.preview]
  | read current local state; call SafeReferencePort.preview
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<PreviewReadInput>(ClientRequest<PreviewReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [PreviewReadInputFactory.create(PreviewReadInput)]
const input = PreviewReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// 登记当前Artifact slot；reference由registry正式资格且只读/no-effect合同bound。
// [SafeReferencePort.preview(PreviewReadInput, QualifiedSession)]
const raw = await references.preview(input, session);
// [PreviewResultViewFactory.create(PreviewResultView)]
const view = PreviewResultViewFactory.create(raw.projection);
// formal authority/consumptionContext/source/visibility与当前slot完全匹配。
// [PreviewBoundary.isOpenable(PreviewReference, AccessPosture, PlatformCapabilityState)]
const openable = view.reference !== null &&
  previewBoundary.isOpenable(view.reference, view.surface.access, base.platform);
// host未绑定不执行open，view.openRef只能保留正式允许受控入口，UI按钮按openable控制。
// CAS changes.preview=view，checks含original raw.consumptionContext；hidden清reference/summary/openRef/provenance。
// [ClientStatePort.compareAndSet(LocalVersion, ContextFence, ClientPatch)]
const committed = store.compareAndSet(current.version, input.request.context.fence, previewPatch);
// [ClientReplyFactory.create<PreviewResultView>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

SDK未明确no-effect preview则dependency_unbound；expired/hidden不保存旧ref；宿主不可用不自动browser URL打开，safe摘要是否可读由Artifact access独立决定。 默认错误见§3；CHAT-UP004/host未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Access/Disclosure/Freshness独立；preview不是CommandResultPosture，不新增业务提交终态。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：malicious ref、expired/hidden；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP004/host blocked）；未运行测试。

### 5.6 LoadIntentCapability

#### 入口、目标与构造

loadIntentCapability(request: LoadIntentCapabilityRequest): Promise<Outcome<LoadIntentCapabilityReply>>，声明见Step8同名卡；归IntentProbePort.readCapability，input=CapabilityReadInput、value=IntentCapabilityView。目标：read_only不可发；Retry允许不是unknown自动重放资格。

#### 函数级调用图: LoadIntentCapability

```text
[ClientUseCases.loadIntentCapability(typed request)]
  | call strict ClientRequestFactory / CapabilityReadInput validation
  v
[IntentProbePort.readCapability]
  | read current local state; call IntentProbePort.readCapability
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<CapabilityReadInput>(ClientRequest<CapabilityReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [CapabilityReadInputFactory.create(CapabilityReadInput)]
const input = CapabilityReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// [IntentProbePort.readCapability(CapabilityReadInput, QualifiedSession)]
const qualified = await probes.readCapability(input, session);
// [IntentCapabilityViewFactory.create(IntentCapabilityView)]
const capability = IntentCapabilityViewFactory.create(qualified.projection);
// kind/gate/action/source与original current slot对应，不能复用别的Gate授权。
// CAS changes.intentCapabilities按input.request.slotId替换；checks保留qualified.consumptionContext。
// [ClientReplyFactory.create<IntentCapabilityView>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

read_only/restricted/blocked显示受限入口；retryAllowed不能解除unknown禁止重放；button disabled是UX不替代server授权。 默认错误见§3；CHAT-UP001/003未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：AccessAvailability；capability分类不是新的权限状态机。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：capability迟到、Gate与action不匹配；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP001/003 blocked）；未运行测试。

### 5.7 ProbeCommandAttempt

#### 入口、目标与构造

probeCommandAttempt(request: ProbeCommandAttemptRequest): Promise<Outcome<ProbeCommandAttemptReply>>，声明见Step8同名卡；归UserIntentCoordinator.resolveUnknown，input=ProbeAttemptInput、value=IntentFeedbackViewModel。目标：只query/probe；not_found未证明no effect仍unknown。

#### 函数级调用图: ProbeCommandAttempt

```text
[ClientUseCases.probeCommandAttempt(typed request)]
  | call strict ClientRequestFactory / ProbeAttemptInput validation
  v
[UserIntentCoordinator.resolveUnknown]
  | read current local state; call IntentProbePort.probe
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<ProbeAttemptInput>(ClientRequest<ProbeAttemptInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [ProbeAttemptInputFactory.create(ProbeAttemptInput)]
const input = ProbeAttemptInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
const attempt: CommandAttemptState = base.attempts.get(input.intentRef);
// attempt存在且actor/fence/association匹配；terminal同结果只返回当前反馈，不重新probe。
// [IntentProbePort.probe(ProbeAttemptInput, QualifiedSession)]
const probe = await probes.probe(input, session);
// [FormalProbeResultFactory.create(FormalProbeResult)]
const safeProbe = FormalProbeResultFactory.create(probe.projection);
// [CommandResultGate.resolveUnknown(CommandAttemptState, FormalProbeResult)]
const decision = gate.resolveUnknown(attempt, safeProbe);
// resolved才允许AttemptFactory.applyResult(attempt, safeProbe.material, gate)。
// not_found无noEffectProven/unavailable/pending保持unknown或正式pending，不构造no-effect结果。
// CAS attempts，check probe original consumptionContext；terminal重复no-op，冲突结果reject。
// confirmed以当前draftRef/revision调用DraftCoordinator.clearConfirmed，不清更新稿。
// [IntentFeedbackFactory.fromAttempt(CommandAttemptState)]
// [ClientReplyFactory.create<IntentFeedbackViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

probe不调用prepare/dispatch；正式material缺失不能把noEffectProven bool单独变成failed。当前session切换不展示旧结果；probe失败不创建新attempt。 默认错误见§3；CHAT-UP001/003未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Command unknown→pending/confirmed/rejected/failed仅正式gate；unknown→unknown安全保持。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：not_found、普通receipt、conflicting terminal；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP001/003 blocked）；未运行测试。

### 5.8 LoadResumeContext

#### 入口、目标与构造

loadResumeContext(request: LoadResumeContextRequest): Promise<Outcome<LoadResumeContextReply>>，声明见Step8同名卡；归ResumeCoordinator.resume + root.resumesBySource，input=ResumeInput、value=ResumeContext。目标：名字沿用02；调用SDK只读恢复，不暗设loadResume SDK方法。

#### 函数级调用图: LoadResumeContext

```text
[ClientUseCases.loadResumeContext(typed request)]
  | call strict ClientRequestFactory / ResumeInput validation
  v
[ResumeCoordinator.resume + root.resumesBySource]
  | read current local state; call ResumePort.resume
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<ResumeInput>(ClientRequest<ResumeInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [ResumeInputFactory.create(ResumeInput)]
const input = ResumeInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// recoveryRef/source/current request与input.context一致；初始请求须SDK正式source/visibility资格。
// [ResumeCoordinator.resume(ResumeInput, QualifiedSession)]
const result = await resumes.resume(input, session);
// ResumeCoordinator内部ResumePort.resume，只读恢复single-flight；结果走ConsumeResumeResult同完整gate。
// [ClientStatePort.read(): ClientSnapshot]
const current = store.read();
const context: ResumeContext = current.resumesBySource.get(input.request.context.sourceReference);
// [ResumeContextFactory.replaceCursor(ResumeContext, ResumeResultView)]仅matched正式覆盖返回；无context不造空record。
// [ClientReplyFactory.create<ResumeContext>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

原02名称是读取已formal恢复后的当前context，无SDK同名export声明。complete不能凭HTTP200/ACK；缺source/ref/coverage保持blocked/stale，unknown attempt不重发。 默认错误见§3；CHAT-UP002/005/008/009未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：ContinuityPhase source-local；ResumeContext字段变化，无独立生命周期。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：partial、ACK、旧recovery；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP002/005/008/009 blocked）；未运行测试。

### 5.9 Query A停审

八条独立flow与typed port/field sources一致；entry前资格、source-local恢复、历史页lineage、preview安全、unknown仅probe均闭合。无owner写入；外部SDK blocked，进入Query B。

## 6. 9-B Query B：本地、平台、AT

| Flow | 协议/对象 | port | 状态/停审 |
|---|---|---|---|
| LoadLocalProjection | Step8同名/LocalProjectionEntry \| null | LocalProjectionRepository.load | 逐flow停审 |
| LoadDraft | Step8同名/DraftState \| null | DraftPort.get | 逐flow停审 |
| ProbePlatformCapability | Step8同名/PlatformCapabilityState | PlatformPort.probe | 逐flow停审 |
| LoadAccessibilityContext | Step8同名/AccessibilityState | AccessibilityPort.preferences | 逐flow停审 |

### 6.1 LoadLocalProjection

#### 入口、目标与构造

loadLocalProjection(request: LoadLocalProjectionRequest): Promise<Outcome<LoadLocalProjectionReply>>，声明见Step8同名卡；归LocalProjectionRepository.load + PersistenceSafetyGuard.canRestore，input=LocalReadInput、value=LocalProjectionEntry | null。目标：cache hit不authorized/fresh；null为local absent，不owner missing。

#### 函数级调用图: LoadLocalProjection

```text
[ClientUseCases.loadLocalProjection(typed request)]
  | call strict ClientRequestFactory / LocalReadInput validation
  v
[LocalProjectionRepository.load + PersistenceSafetyGuard.canRestore]
  | read current local state; call LocalProjectionRepository.load
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<LocalReadInput>(ClientRequest<LocalReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [LocalReadInputFactory.create(LocalReadInput)]
const input = LocalReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// fence/session/partition当前，key为既有local cache key，partition alias须正式SDK验证。
// [LocalProjectionRepository.load(LocalId<"cache_key">, LocalPartition)]
const entry = await projections.load(input.key, input.partition);
if (entry === null) {
  // 只表示local absent；reply value=null，root version仍base且fence当前，否则context_changed。
} else {
  // [PersistenceSafetyGuard.canRestore(LocalProjectionEntry, AccessPosture)]
  const decision = persistenceGuard.canRestore(entry, current.access);
  // 不可restore不得return旧payload；只有guard.allowed才返回safe candidate，stale而非fresh。
}
// 此Query不恢复权限、不写repository，不启动owner command；readonly reply用经重验base.version。
// [ClientReplyFactory.create<LocalProjectionEntry|null>(ClientReply)]
```

#### 一致性、错误与状态副作用

repository version来自load，root仅read；不能把entry.localVersion作为reply.localVersion。root在await中变化须重验并重新读取或context_changed。

repo失败storage_unavailable；分区/actor错拒绝不泄露cache existence；null不推owner missing；默认memory无durable恢复承诺。 默认错误见§3；storage/safe locator未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：LocalProjectionState absent/cached/stale只读取，不implicit restored/fresh。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：分区错、删除失败、stale缓存；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external storage/safe locator blocked）；未运行测试。

### 6.2 LoadDraft

#### 入口、目标与构造

loadDraft(request: LoadDraftRequest): Promise<Outcome<LoadDraftReply>>，声明见Step8同名卡；归DraftCoordinator.load，input=DraftReadInput、value=DraftState | null。目标：contextRef=null invalid_input；默认memory，不durable正文。

#### 函数级调用图: LoadDraft

```text
[ClientUseCases.loadDraft(typed request)]
  | call strict ClientRequestFactory / DraftReadInput validation
  v
[DraftCoordinator.load]
  | read current local state; call DraftPort.get
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<DraftReadInput>(ClientRequest<DraftReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [DraftReadInputFactory.create(DraftReadInput)]
const input = DraftReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// contextRef非null且属于当前verified Conversation，fence/actor/scope匹配；项目/目录无草稿。
// [DraftPort.get(ExternalHandle<"context">)]
const read = drafts.get(input.contextRef);
// get返回{draft,version}，version必须仍是同root；null与empty草稿不同。
// 不调用repo/owner，不从local projection恢复text；LoadDraft只读unique root草稿。
// [DraftCoordinator.load(ExternalHandle<"context">)]按同一get结果返回
// [ClientReplyFactory.create<DraftState|null>(ClientReply)]
```

#### 一致性、错误与状态副作用

纯root read，无CAS或SDK业务IO，返回draft的读取version；不得用draft.revisionHint替代store version。

旧session/scope/context拒绝；当前null安全显示空composer候选，创建新草稿是显式local edit，不把null当发送失败。 默认错误见§3；local session资格未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：DraftPhase只读取，与owner Turn/Command无迁移。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：跨会话text泄漏、null/empty草稿；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external local session资格 blocked）；未运行测试。

### 6.3 ProbePlatformCapability

#### 入口、目标与构造

probePlatformCapability(request: ProbePlatformCapabilityRequest): Promise<Outcome<ProbePlatformCapabilityReply>>，声明见Step8同名卡；归PlatformCapabilityAdapter.probe + PlatformCapabilityState.applyProbe，input=PlatformCapabilityKind、value=PlatformCapabilityState。目标：host available不授command；过期probe拒绝。

#### 函数级调用图: ProbePlatformCapability

```text
[ClientUseCases.probePlatformCapability(typed request)]
  | call strict ClientRequestFactory / PlatformCapabilityKind validation
  v
[PlatformCapabilityAdapter.probe + PlatformCapabilityState.applyProbe]
  | read current local state; call PlatformPort.probe
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<PlatformCapabilityKind>(ClientRequest<PlatformCapabilityKind> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// PlatformCapabilityKind校验有限四类，不由任意字符串发native命令。
const kind: PlatformCapabilityKind = request.input;
const base: ClientSnapshot = store.read();
// [PlatformCapabilityAdapter.probe(PlatformCapabilityKind)]
const result = await platformAdapter.probe(kind);
// [PlatformCapabilityState.applyProbe(PlatformCapabilityState, PlatformProbeResult)]
const next = PlatformCapabilityState.applyProbe(current.platform, result);
// 当前hostBinding/platform/session/local probe generation全部匹配。
// CAS changes.platform=next；这是host local资格无SDK消费槽位，checks=[]只在可信host path允许。
// [ClientReplyFactory.create<PlatformCapabilityState>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

WebPreview storage/open unavailable，native合同缺失unknown/unavailable；available不使Access available；重复/旧probe不覆盖当前结果。 默认错误见§3；host未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：CapabilityAvailability按能力独立，ShellLifecycle仅可信技术通知。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：Web preview safe_storage/controlled_preview拒绝；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external host blocked）；未运行测试。

### 6.4 LoadAccessibilityContext

#### 入口、目标与构造

loadAccessibilityContext(request: LoadAccessibilityContextRequest): Promise<Outcome<LoadAccessibilityContextReply>>，声明见Step8同名卡；归AccessibilitySemanticAdapter.derive，input=AccessibilityReadInput、value=AccessibilityState。目标：纯派生图/list/keyboard等价语义；不读取隐藏标题/关系。

#### 函数级调用图: LoadAccessibilityContext

```text
[ClientUseCases.loadAccessibilityContext(typed request)]
  | call strict ClientRequestFactory / AccessibilityReadInput validation
  v
[AccessibilitySemanticAdapter.derive]
  | read current local state; call AccessibilityPort.preferences
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<AccessibilityReadInput>(ClientRequest<AccessibilityReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [AccessibilityReadInputFactory.create(AccessibilityReadInput)]
const input = AccessibilityReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// 输入page是当前safe root assembler派生，旧page/version不能用于焦点或公告。
// [AccessibilityPort.preferences(): Outcome<AccessibilityPreferences>]
const prefs = accessibilityPort.preferences();
// [AccessibilitySemanticAdapter.derive(ClientPageViewModel, PlatformCapabilityState, AccessibilityPreferences)]
const next = semantics.derive(input.page, current.platform, prefs);
// semanticRegions/focus仅当前safe graph/list；StatusAnnouncement有限code，不复制owner正文。
// CAS changes.accessibility=next，local显示派生checks=[]，expected=该page的root版本。
// [ClientReplyFactory.create<AccessibilityState>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

host/DOM焦点失败安全回主区域；motion/contrast不能掩盖unknown/Gate姿态；隐藏node不留AT label/relationship/计数。 默认错误见§3；host/AT qualification未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：SelectionPhase/AccessibilityState派生，AT不是业务状态机。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：hidden焦点、减少运动、live公告；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external host/AT qualification blocked）；未运行测试。

### 6.5 本组停审

root/repo版本不混、cache候选不授access；host probe与AT仅技术/显示面，无业务effect。进入Query C，外部host/storage保持blocked。

## 7. 9-B Query C：项目、BPMN下钻与目录

| Flow | 协议/对象 | port | 状态/停审 |
|---|---|---|---|
| LoadProjectList | Step8同名/LocalPage<SafeMaterialSnapshot> | CollaborationReadPort.readProjectList | 逐flow停审 |
| LoadProjectDetail | Step8同名/ProjectDetailViewModel | CollaborationReadPort.readProjectDetail | 逐flow停审 |
| LoadProjectProcessFlow | Step8同名/ProcessFlowViewModel | CollaborationReadPort.readProjectProcessFlow | 逐flow停审 |
| LoadStageProcessFlow | Step8同名/ProcessFlowViewModel | CollaborationReadPort.readStageProcessFlow | 逐flow停审 |
| LoadProcessNodeDetail | Step8同名/ProcessNodeDetailViewModel | CollaborationReadPort.readProcessNodeDetail | 逐flow停审 |
| LoadProjectConversationLinks | Step8同名/ProjectConversationLinkViewModel | CollaborationReadPort.readProjectConversationLinks + EntryAccessPort.resolve | 逐flow停审 |
| LoadCompanyDirectory | Step8同名/CompanyDirectoryViewModel | CollaborationReadPort.readCompanyDirectory | 逐flow停审 |
| LoadMemberContext | Step8同名/readonly SafeMaterialSnapshot[] | CollaborationReadPort.readMemberContext | 逐flow停审 |

### 7.1 LoadProjectList

#### 入口、目标与构造

loadProjectList(request: LoadProjectListRequest): Promise<Outcome<LoadProjectListReply>>，声明见Step8同名卡；归ProjectContextCoordinator.loadList，input=ProjectListReadInput、value=LocalPage<SafeMaterialSnapshot>。目标：仅获准项目；empty不公司无项目，分页coverage不可由长度推。

#### 函数级调用图: LoadProjectList

```text
[ClientUseCases.loadProjectList(typed request)]
  | call strict ClientRequestFactory / ProjectListReadInput validation
  v
[ProjectContextCoordinator.loadList]
  | read current local state; call CollaborationReadPort.readProjectList
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<ProjectListReadInput>(ClientRequest<ProjectListReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [ProjectListReadInputFactory.create(ProjectListReadInput)]
const input = ProjectListReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// 当前Work source slot登记，page cursor/lineage仅base.projectList前页正式值。
// [CollaborationReadPort.readProjectList(ProjectListReadInput, QualifiedSession)]
const read = await reads.readProjectList(input, session);
// [LocalPageFactory.create<SafeMaterialSnapshot>(LocalPage<SafeMaterialSnapshot>)]
// 每item通过SafeMaterialComposer.compose；正式Work列表关系与visibility独立检查。
// CAS changes.projectList=qualified safe page，checks保留read.consumptionContext。
// [ProjectContextCoordinator.loadList(ProjectListReadInput, QualifiedSession)]
// 方法内部执行上述read/CAS，facade传完整ProjectListReadInput，保留page与slotId。
// [ClientReplyFactory.create<LocalPage<SafeMaterialSnapshot>>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

空页/partialcoverage保留formal marker；not_visible清所有items/cursor；无Work列表capability返回blocked，不合成来自已打开群聊的项目名单。 默认错误见§3；CHAT-UP001/006未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：ReadSurface.Access/Freshness，列表不是Project lifecycle。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：page lineage、not_visible、partial coverage；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP001/006 blocked）；未运行测试。

### 7.2 LoadProjectDetail

#### 入口、目标与构造

loadProjectDetail(request: LoadProjectDetailRequest): Promise<Outcome<LoadProjectDetailReply>>，声明见Step8同名卡；归ProjectContextCoordinator.loadDetail，input=ProjectDetailReadInput、value=ProjectDetailViewModel。目标：五标签overview/progress/conversations/work_items/evidence；不顶层进度；多source非原子。

#### 函数级调用图: LoadProjectDetail

```text
[ClientUseCases.loadProjectDetail(typed request)]
  | call strict ClientRequestFactory / ProjectDetailReadInput validation
  v
[ProjectContextCoordinator.loadDetail]
  | read current local state; call CollaborationReadPort.readProjectDetail
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<ProjectDetailReadInput>(ClientRequest<ProjectDetailReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [ProjectDetailReadInputFactory.create(ProjectDetailReadInput)]
const input = ProjectDetailReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// [CollaborationReadPort.readProjectDetail(ProjectDetailReadInput, QualifiedSession)]
const read = await reads.readProjectDetail(input, session); // workItemPage逐字段传入，不能丢分页
// [ProjectDetailFactory.forProject(OwnerReference, ClientConsumptionContext, AccessPosture)]
let view = ProjectDetailFactory.forProject(input.project, input.request.context, current.access);
// [ProjectDetailFactory.applySection(ProjectDetailViewModel, QualifiedMaterial<SafeMaterialSnapshot>)]
view = ProjectDetailFactory.applySection(view, read.projection.summary);
// workItems/evidenceRefs非null才各自applyWorkItems/applyEvidence；current从各独立slot读取。
// 其他Process/links分别Load*，不存在输出材料时null/partial，不复用Work fresh。
// [ProjectDetailFactory.setNavigation(ProjectDetailViewModel, ProjectNavigationState)]
view = ProjectDetailFactory.setNavigation(view, current.projectNavigation);
// CAS changes.projectDetail=view，checks含outer及summary/workItems/evidenceRefs各自原incoming。
// [ProjectContextCoordinator.loadDetail(ProjectDetailReadInput, QualifiedSession)]
// [ClientReplyFactory.create<ProjectDetailViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

某section无资格不借项目read权限，partial保留其它获准section。当前用户新tab/新项目不能被query回包覆盖；source/target不匹配context_changed；无snapshot atomic承诺。 默认错误见§3；CHAT-UP006/008/009未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：PageLoadPosture loading→ready/partial/stale/blocked/unavailable，Access/Freshness分源。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：证据不可读、工单↔项目错配、partial；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP006/008/009 blocked）；未运行测试。

### 7.3 LoadProjectProcessFlow

#### 入口、目标与构造

loadProjectProcessFlow(request: LoadProjectProcessFlowRequest): Promise<Outcome<LoadProjectProcessFlowReply>>，声明见Step8同名卡；归ProcessDrilldownCoordinator.loadProjectFlow，input=ProcessFlowReadInput、value=ProcessFlowViewModel。目标：整体BPMN正式fork/branches/join；布局可local算，连线/状态不得local造。

#### 函数级调用图: LoadProjectProcessFlow

```text
[ClientUseCases.loadProjectProcessFlow(typed request)]
  | call strict ClientRequestFactory / ProcessFlowReadInput validation
  v
[ProcessDrilldownCoordinator.loadProjectFlow]
  | read current local state; call CollaborationReadPort.readProjectProcessFlow
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<ProcessFlowReadInput>(ClientRequest<ProcessFlowReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [ProcessFlowReadInputFactory.create(ProcessFlowReadInput)]
const input = ProcessFlowReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// Process正式source/current项目，不能从WorkItem/Runtime/原型确定process。
// [CollaborationReadPort.readProjectProcessFlow(ProcessFlowReadInput, QualifiedSession)]
const read = await reads.readProjectProcessFlow(input, session);
// [ProcessFlowFactory.forContext(project, process, stage|null, context, access)]
let flow = ProcessFlowFactory.forContext(read.projection.project, read.projection.process, null, input.request.context, processAccess);
// [ProcessFlowFactory.applyTopology(ProcessFlowViewModel, QualifiedMaterial<SafeProcessTopologyView>)]
flow = ProcessFlowFactory.applyTopology(flow, read.projection.topology);
// states/governanceRefs分别applyState/applyGovernanceRefs：不同source，SDK证明适用拓扑版本及access。
// 正式node/edge两端均获准，fork/join/branch角色来自Process；layout只local视觉。
// [ProjectDetailFactory.applyFlow(ProjectDetailViewModel, ProcessFlowViewModel)]
const detail = ProjectDetailFactory.applyFlow(current.projectDetail, flow);
// 拓扑revision更新先invalidate旧stage/node/sections槽位、清旧选择/详情。
// CAS changes.projectDetail=detail及processNodeDetail/selection/contexts安全失效；checks所有nested source。
// [ProcessDrilldownCoordinator.loadProjectFlow(ProcessFlowReadInput, QualifiedSession)]
// [ClientReplyFactory.create<ProcessFlowViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

CHAT-UP008缺拓扑合同blocked，不从ref生成XML。node状态版本不兼容清state并partial/stale；Gateway≠Governance Gate，join条件不得由分支颜色推断。图/list/AT同safe集合，无隐藏total。 默认错误见§3；CHAT-UP008未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：PageLoadPosture/SelectionPhase/Freshness/ConsumptionContext，非Process token或执行迁移。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：hidden边、Gateway≠Gate、状态版本不兼容；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP008 blocked）；未运行测试。

### 7.4 LoadStageProcessFlow

#### 入口、目标与构造

loadStageProcessFlow(request: LoadStageProcessFlowRequest): Promise<Outcome<LoadStageProcessFlowReply>>，声明见Step8同名卡；归ProcessDrilldownCoordinator.loadStageFlow，input=StageFlowReadInput、value=ProcessFlowViewModel。目标：当前parent revision变更先失效子/节点；无formal child不拼子流程。

#### 函数级调用图: LoadStageProcessFlow

```text
[ClientUseCases.loadStageProcessFlow(typed request)]
  | call strict ClientRequestFactory / StageFlowReadInput validation
  v
[ProcessDrilldownCoordinator.loadStageFlow]
  | read current local state; call CollaborationReadPort.readStageProcessFlow
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<StageFlowReadInput>(ClientRequest<StageFlowReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [StageFlowReadInputFactory.create(StageFlowReadInput)]
const input = StageFlowReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
const parent: ProcessFlowViewModel = base.projectDetail.flowView;
// input.project/process/stage/parentRevision与parent获准node.drilldownReference及正式revision匹配。
// 新stage槽位登记，旧node和section失效/清引用，再开始异步。
// [CollaborationReadPort.readStageProcessFlow(StageFlowReadInput, QualifiedSession)]
const read = await reads.readStageProcessFlow(input, session);
// 当前parent revision仍与input.parentRevision等值，SDK正式父子关系/拓扑版本资格成立。
// [ProcessFlowFactory.forContext(project, process, stage, context, access)]
let flow = ProcessFlowFactory.forContext(input.project, input.process, input.stage, input.request.context, stageAccess);
flow = ProcessFlowFactory.applyTopology(flow, read.projection.topology);
// states/governanceRefs独立applyState/applyGovernanceRefs，不能从parent的状态沿用。
// [ProjectNavigationFactory.selectStage(ProjectNavigationState, OwnerReference, ProcessFlowViewModel)]
// 父safe topology支持该stage，导航local选中，并保存安全return候选；页面子图独立source。
// CAS将current detail.flowView更新为flow，checks保留stage及nested incoming，projectNavigation一并同步派生。
// [ProcessDrilldownCoordinator.loadStageFlow(StageFlowReadInput, ProcessFlowViewModel parent, QualifiedSession)]
// [ClientReplyFactory.create<ProcessFlowViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

父换版/项目切换/取消后late→context_changed，不能仅校验同route fence。返回整体图重新正式read，子流程不存在/不可读仅由正式read语义说明，不自行补图。 默认错误见§3；CHAT-UP008未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：PageLoadPosture loading/partial/stale；Selection selected/stale；旧consumer invalidated/cleared。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：parent换版、stage迟到；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP008 blocked）；未运行测试。

### 7.5 LoadProcessNodeDetail

#### 入口、目标与构造

loadProcessNodeDetail(request: LoadProcessNodeDetailRequest): Promise<Outcome<LoadProcessNodeDetailReply>>，声明见Step8同名卡；归ProcessDrilldownCoordinator.loadNodeDetail，input=ProcessNodeReadInput、value=ProcessNodeDetailViewModel。目标：节点可点击不是执行；BPMN/工单/Agent/工具/commit/test仅正式safe展示。

#### 函数级调用图: LoadProcessNodeDetail

```text
[ClientUseCases.loadProcessNodeDetail(typed request)]
  | call strict ClientRequestFactory / ProcessNodeReadInput validation
  v
[ProcessDrilldownCoordinator.loadNodeDetail]
  | read current local state; call CollaborationReadPort.readProcessNodeDetail
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<ProcessNodeReadInput>(ClientRequest<ProcessNodeReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [ProcessNodeReadInputFactory.create(ProcessNodeReadInput)]
const input = ProcessNodeReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
const parent: ProcessFlowViewModel = base.projectDetail.flowView;
// 当前parent topology正式包含获准node，revision=input.parentRevision；先登记node及独立owner slots。
// [CollaborationReadPort.readProcessNodeDetail(ProcessNodeReadInput, QualifiedSession)]
const read = await reads.readProcessNodeDetail(input, session);
// [NodeDetailFactory.forNode(node, revision, context, access)]
let view = NodeDetailFactory.forNode(input.node, input.parentRevision, input.request.context, nodeAccess);
// [NodeDetailFactory.applyAssociations(ProcessNodeDetailViewModel, QualifiedMaterial<SafeNodeAssociationView>)]
view = NodeDetailFactory.applyAssociations(view, read.projection.associations);
// 对每section：独立正式owner/target关联、current槽位和visibility，composer后applySection；任何未获准关联拒绝。
// sections包括Work/Gate/Artifact/Runtime/诊断safe材料，不Tools执行，不把commit/test变验收。
// 父图version变更先invalidateParent，再drop此次结果。
// CAS changes.processNodeDetail=view，checks=node/association及每获准section原incoming；partial不覆盖其它合法section。
// [ProcessDrilldownCoordinator.loadNodeDetail(ProcessNodeReadInput, ProcessFlowViewModel parent, QualifiedSession)]
// [ClientReplyFactory.create<ProcessNodeDetailViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

缺formal association不按标题/日志关联；rapid node切换保持current选中，node关闭后结果弃置；scope revoke仍影响已关闭slot涉及缓存。每section read failure安全partial，若node access撤销全部清。 默认错误见§3；CHAT-UP008/006/007未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：PageLoadPosture/Selection/Freshness/Disclosure分source；非Agent/Tools/Work执行状态。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：node快速切换、partial owner、关联造假；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP008/006/007 blocked）；未运行测试。

### 7.6 LoadProjectConversationLinks

#### 入口、目标与构造

loadProjectConversationLinks(request: LoadProjectConversationLinksRequest): Promise<Outcome<LoadProjectConversationLinksReply>>，声明见Step8同名卡；归ProjectContextCoordinator.loadLinks，input=LinkReadInput、value=ProjectConversationLinkViewModel。目标：一群至多一项目、项目多群是owner关系合同；每群Participant独立，Chat无绑定写入。

#### 函数级调用图: LoadProjectConversationLinks

```text
[ClientUseCases.loadProjectConversationLinks(typed request)]
  | call strict ClientRequestFactory / LinkReadInput validation
  v
[ProjectContextCoordinator.loadLinks]
  | read current local state; call CollaborationReadPort.readProjectConversationLinks + EntryAccessPort.resolve
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<LinkReadInput>(ClientRequest<LinkReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [LinkReadInputFactory.create(LinkReadInput)]
const input = LinkReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// [CollaborationReadPort.readProjectConversationLinks(LinkReadInput, QualifiedSession)]
const relationship = await reads.readProjectConversationLinks(input, session);
// [ProjectConversationLinkFactory.forAnchor(OwnerReference, ClientConsumptionContext)]
let links = ProjectConversationLinkFactory.forAnchor(input.anchor, input.request.context);
// [ProjectConversationLinkFactory.applyRelationship(ProjectConversationLinkViewModel, QualifiedMaterial<SafeProjectConversationAssociationView>)]
links = ProjectConversationLinkFactory.applyRelationship(links, relationship);
// 对每正式target建立独立EntryResolutionFence/EnterRouteInput，再EntryAccessPort.resolve。
// qualified入口AccessPosture仅从正式目标结果映射，独立target消费槽位，不复制anchor access。
// [ProjectConversationLinkFactory.applyTargetAccess(view,target,qualifiedAccess,currentTargetContext)]
// hidden目标不留ref/label/数量；relationship改变先清旧target和return候选。
// CAS current.projectDetail.conversationLinks（或当前群聊关联safe材料），checks关系及各目标current qualification。
// 点击目标仍RouteContextCoordinator.enter独立resolve，不写createBinding/unlink。
// [ClientReplyFactory.create<ProjectConversationLinkViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

provider owner未确认dependency_unbound，不能将锚点owner设为关系owner。解绑立即清入口；每群Participant不同，不并集继承项目/其他群权限。关系可见不等于target可见。 默认错误见§3；CHAT-UP009未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：PageLoadPosture/Access/Selection；relationship version仅formal provider。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：解绑、目标hidden、群聊权限串项目；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP009 blocked）；未运行测试。

### 7.7 LoadCompanyDirectory

#### 入口、目标与构造

loadCompanyDirectory(request: LoadCompanyDirectoryRequest): Promise<Outcome<LoadCompanyDirectoryReply>>，声明见Step8同名卡；归DirectoryCoordinator.load/search/loadNext，input=DirectoryReadInput、value=CompanyDirectoryViewModel。目标：人类/AI全公司coverage仅formal provider；不并集各成员集合。

#### 函数级调用图: LoadCompanyDirectory

```text
[ClientUseCases.loadCompanyDirectory(typed request)]
  | call strict ClientRequestFactory / DirectoryReadInput validation
  v
[DirectoryCoordinator.load/search/loadNext]
  | read current local state; call CollaborationReadPort.readCompanyDirectory
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<DirectoryReadInput>(ClientRequest<DirectoryReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [DirectoryReadInputFactory.create(DirectoryReadInput)]
const input = DirectoryReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// provider合同/人类AIcoverage/独立access正式确认；query/filter/page lineage/current slot全匹配。
// [CollaborationReadPort.readCompanyDirectory(DirectoryReadInput, QualifiedSession)]
const read = await reads.readCompanyDirectory(input, session);
// [CompanyDirectoryFactory.forProvider(provider, context, access)]
let view = CompanyDirectoryFactory.forProvider(input.provider, input.request.context, directoryAccess);
// [CompanyDirectoryFactory.updateSearch(view, LocalDirectorySearchState, ClientConsumptionContext)]
// 若query变化先清旧people/pageInfo/selectedPerson并登记新代次，绝不沿用旧cursor。
// [CompanyDirectoryFactory.applyPage(CompanyDirectoryViewModel, QualifiedMaterial<SafeDirectoryPageView>)]
view = CompanyDirectoryFactory.applyPage(currentView, read);
// pageInfo保存完整formal lineage，nextPageRef只读派生；局部safe ref去重保留正式排序。
// CAS changes.companyDirectory=view，checks=original directory incoming，不用当前context替代旧incoming。
// [DirectoryCoordinator.load(DirectoryReadInput, QualifiedSession)]
// [ClientReplyFactory.create<CompanyDirectoryViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

provider未知blocked，不合并Identity/ProjectMember/Participant/Member-presence造全公司名单。search rapid变化旧页丢弃，empty≠全scope没人；coverage unknown不能标全公司，人类/AI分类须provider支持。 默认错误见§3；CHAT-UP009未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：PageLoadPosture/Access/Freshness；搜索代次是local context非provider业务版本。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：搜索晚到、query lineage、部分coverage；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP009 blocked）；未运行测试。

### 7.8 LoadMemberContext

#### 入口、目标与构造

loadMemberContext(request: LoadMemberContextRequest): Promise<Outcome<LoadMemberContextReply>>，声明见Step8同名卡；归DirectoryCoordinator.loadMemberContext，input=MemberContextReadInput、value=readonly SafeMaterialSnapshot[]。目标：DM另走Conversation正式入口，无Chat create DM副作用。

#### 函数级调用图: LoadMemberContext

```text
[ClientUseCases.loadMemberContext(typed request)]
  | call strict ClientRequestFactory / MemberContextReadInput validation
  v
[DirectoryCoordinator.loadMemberContext]
  | read current local state; call CollaborationReadPort.readMemberContext
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<MemberContextReadInput>(ClientRequest<MemberContextReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [MemberContextReadInputFactory.create(MemberContextReadInput)]
const input = MemberContextReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// person来源当前safe目录/关联，project/conversation各正式范围，不从身份默认扩张。
// [CollaborationReadPort.readMemberContext(MemberContextReadInput, QualifiedSession)]
const read = await reads.readMemberContext(input, session);
// identity/projectMember/participant/presence四nullable qualified字段各current source slot与access。
// 每nonnull section：SafeMaterialComposer.compose(qualifiedSection, sectionAccess)，保留不同owner/provenance/visibility。
// CAS changes.materials为获准section的immutable map，各incoming作为checks；未获准section不保留旧材料。
// [DirectoryCoordinator.loadMemberContext(MemberContextReadInput, QualifiedSession)]
// [ClientReplyFactory.create<readonly SafeMaterialSnapshot[]>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

部分section unavailable保留其缺口code，不虚构某人不是成员/不在场。人类身份不私造AI GlobalMember；DM点击另Conversation正式入口，不发create DM command。 默认错误见§3；CHAT-UP006/009未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Disclosure/Freshness/Access逐section，不同步owner Member/Identity生命周期。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：项目成员不等参与者、presence不等身份；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP006/009 blocked）；未运行测试。

### 7.9 20 Query整体停审

20接口独立flow完整，全部字段传递typed coordinator/port，query qualified source/current slot与CAS闭合。Step9回查补root entry/projectList/preview/capability slices、目录pageInfo、coordinator typed Input，不留给实现补猜。Process正式关联、parent revision、节点section、目录coverage及关系权限都保持独立，CHAT-UP008/009继续blocked，进入9-C。

## 8. 9-C 七个Inbound Consumer

| Flow | 协议/对象 | port | 状态/停审 |
|---|---|---|---|
| ConsumeFormalChange | Step8同名/LocalConsumerReceipt | ChangeQualificationPort.qualify; ClientStatePort.compareAndSet | 单flow停审，source-local |
| ConsumeCommandReceiptOrResult | Step8同名/LocalConsumerReceipt | ClientStatePort.read/compareAndSet | 单flow停审，source-local |
| ConsumeResumeResult | Step8同名/LocalConsumerReceipt | ClientStatePort.read/compareAndSet | 单flow停审，source-local |
| ConsumeVisibilityChange | Step8同名/LocalConsumerReceipt | ChangeFeedPort.stopContext; LocalProjectionRepository.list/evict | 单flow停审，source-local |
| ConsumeMaterialRevisionChange | Step8同名/LocalConsumerReceipt | ChangeQualificationPort.qualify; SafeMaterialReadPort.readSummary | 单flow停审，source-local |
| ConsumeShellLifecycle | Step8同名/LocalConsumerReceipt | LifecyclePort; ChangeFeedPort.stopAll; PlatformPort.probe | 单flow停审，source-local |
| ConsumeEvictionTrigger | Step8同名/LocalConsumerReceipt | LocalProjectionRepository.load/evict; ChangeFeedPort.stopContext | 单flow停审，source-local |

### 8.1 ConsumeFormalChange

#### 入口、目标与构造

consumeFormalChange(request: ConsumeFormalChangeRequest): Promise<Outcome<ConsumeFormalChangeReply>>，声明见Step8同名卡；归ChangeReducer.consume，input=QualifiedMaterial<FormalChangeView>、value=LocalConsumerReceipt。目标：SDK正式feed触发；source局部去重、资格/coverage先判定，material/result仍单独gate。

#### 函数级调用图: ConsumeFormalChange

```text
[ClientUseCases.consumeFormalChange(typed request)]
  | call strict ClientRequestFactory / QualifiedMaterial<FormalChangeView> validation
  v
[ChangeReducer.consume]
  | read current local state; call ChangeQualificationPort.qualify; ClientStatePort.compareAndSet
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<QualifiedMaterial<FormalChangeView>>(ClientRequest<QualifiedMaterial<FormalChangeView>> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [FormalChangeViewFactory.create(FormalChangeView)]同时验证QualifiedMaterial registry资格。
const change: QualifiedMaterial<FormalChangeView> = request.input;
const base: ClientSnapshot = store.read();
// 来源change_source→source关系必须registry正式证明；current consumptionContext与对应root slot匹配。
// [ChangeQualificationInputFactory.create(ChangeQualificationInput)]
const qualificationInput = ChangeQualificationInputFactory.create({
  request: currentRequest, change, continuity: base.continuityBySource.get(change.projection.source)
});
// [ChangeQualificationPort.qualify(ChangeQualificationInput, QualifiedSession)]
const qualification = await qualifier.qualify(qualificationInput, session);
// [ChangeAcceptanceRecord.evaluate(qualifiedChange, qualification, consumedSet, continuity)]
const record = ChangeAcceptanceRecord.evaluate(change, qualification, current.consumedChanges.get(change.projection.source), current.continuityBySource.get(change.projection.source));
switch (record.acceptance) {
  case "duplicate": // no-op；local receipt duplicate，不移动cursor
  case "ignored": // 晚到/无关，不新增consumed key
  case "out_of_order": // formal判定，mark stale/needs_requery；不自己比较opaque revision
  case "gap": // ContinuityFactory.markGap，保留最后cursor；single-source requery
  case "restricted": // 正式范围验证后先hide/invalidate，委托visibility清理
  case "accepted":
    // [ChangeReducer.applyQualified(ClientSnapshot, FormalChangeView, ChangeAcceptanceRecord)]
    const patch = reducer.applyQualified(current, change.projection, record);
    // payload kind surface/material/project/process/links/directory/result分别Step6 factory/gate；
    // result走CommandResultGate、visibility走安全收紧，未知unsupported不补造数据。
    // patch含目标slice及consumedChanges/source cursor/version同一次CAS；所有source current checks。
    store.compareAndSet(current.version, change.fence, patch);
}
// [LocalConsumerReceiptFactory.create(LocalConsumerReceipt)]
// source/change来自formal registry，不是SDK业务提交receipt。
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

duplicate/ignored不副作用；gap/out_of_order安全stale并needs_requery。maxConsumedChanges到限先切新消费代次+正式coverage恢复，不清set后盲接旧event；fake不能进入真实确认。CAS冲突先重读资格，不能重放业务command。 默认错误见§3；CHAT-UP002/008/009未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Continuity fresh/stale/gap/restricted；Freshness/Disclosure及对应page slice；按source独立consumed集合。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：duplicate/乱序/gap/迟到；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP002/008/009 blocked）；未运行测试。

### 8.2 ConsumeCommandReceiptOrResult

#### 入口、目标与构造

consumeCommandReceiptOrResult(request: ConsumeCommandReceiptOrResultRequest): Promise<Outcome<ConsumeCommandReceiptOrResultReply>>，声明见Step8同名卡；归UserIntentCoordinator.applyFormalResult/applyReceipt，input=CommandResultInput、value=LocalConsumerReceipt。目标：正式result seam触发；ordinary receipt非terminal；冲突terminal拒绝，无自动重发。

#### 函数级调用图: ConsumeCommandReceiptOrResult

```text
[ClientUseCases.consumeCommandReceiptOrResult(typed request)]
  | call strict ClientRequestFactory / CommandResultInput validation
  v
[UserIntentCoordinator.applyFormalResult/applyReceipt]
  | read current local state; call ClientStatePort.read/compareAndSet
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<CommandResultInput>(ClientRequest<CommandResultInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
const input: CommandResultInput = request.input; // strict kind/material分支
const base: ClientSnapshot = store.read();
const material = input.material; // registry/session/source/current slot与正式intent关联检查
const attempt: CommandAttemptState = base.attempts.get(material.projection.intentRef);
// intent/fence/actor/association均匹配，terminal同结果duplicate；冲突terminal invalid_transition，保留原终态。
const gate = CommandResultGate.forIntent(attempt.intentKind);
const next = input.kind === "receipt"
  // [AttemptFactory.applyReceipt(CommandAttemptState, CommandReceiptView, CommandResultGate)]
  ? AttemptFactory.applyReceipt(attempt, CommandReceiptViewFactory.create(material.projection), gate)
  // [AttemptFactory.applyResult(CommandAttemptState, FormalResultMaterial, CommandResultGate)]
  : AttemptFactory.applyResult(attempt, FormalResultMaterialFactory.create(material.projection), gate);
// ordinary meaning received/pending只有非terminal；business_confirming须formal committed authority/receiptRef。
// CAS attempts immutable copy、input.material原incoming check；若confirmed与draft revision相同，同CAS清匹配草稿。
// [DraftFactory.clear(DraftState, ClearReason="confirmed_revision", expectedRevision)]
// [IntentFeedbackFactory.fromAttempt(CommandAttemptState)]、StatusAnnouncement.fromAttempt有限code。
// [LocalConsumerReceiptFactory.create(LocalConsumerReceipt)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

收到技术ACK不能构造input；result权威错/fake/旧会话拒绝，无反馈泄漏；旧确认不清新draftRevision。CAS失败不能dispatch，只当前gate重算；scope撤销优先清安全ref。 默认错误见§3；CHAT-UP001/003未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：CommandResultPosture唯一结果轴；Draft submitting→cleared仅同revision；Disclosure不由result自动扩权。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：ACK、重复确认、关联错、旧draft；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP001/003 blocked）；未运行测试。

### 8.3 ConsumeResumeResult

#### 入口、目标与构造

consumeResumeResult(request: ConsumeResumeResultRequest): Promise<Outcome<ConsumeResumeResultReply>>，声明见Step8同名卡；归ResumeCoordinator.applyResult，input=QualifiedMaterial<ResumeResultView>、value=LocalConsumerReceipt。目标：SDK resume/requery返回触发；complete须当前recovery及正式coverage，partial不fresh。

#### 函数级调用图: ConsumeResumeResult

```text
[ClientUseCases.consumeResumeResult(typed request)]
  | call strict ClientRequestFactory / QualifiedMaterial<ResumeResultView> validation
  v
[ResumeCoordinator.applyResult]
  | read current local state; call ClientStatePort.read/compareAndSet
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<QualifiedMaterial<ResumeResultView>>(ClientRequest<QualifiedMaterial<ResumeResultView>> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
const qualified: QualifiedMaterial<ResumeResultView> = request.input;
const base: ClientSnapshot = store.read();
// [ResumeResultViewFactory.create(ResumeResultView)]
const result = ResumeResultViewFactory.create(qualified.projection);
// source/recoveryRef/input.request/context/current slot、正式revision/coverage和feed边界必须匹配。
if (result.visibility !== null) {
  // 正式收紧先AccessPostureFactory.applyVisibility/ConsumptionContextFactory.invalidate/hide；
  // 即使随后snapshot/changes被拒绝，安全收紧已生效；clear/deletion另处置。
}
// result.changes每项qualified，正式order/coverage关系；不能按arrival/cursor排序；变化receipt不是复用父access。
// [ContinuityFactory.applyResumeResult(ContinuityState, ResumeResultView)]
const nextContinuity = ContinuityFactory.applyResumeResult(current.continuityBySource.get(result.request.context.sourceReference), result);
// [ResumeContextFactory.replaceCursor(ResumeContext, ResumeResultView)]
const nextResume = ResumeContextFactory.replaceCursor(current.resumesBySource.get(result.request.context.sourceReference), result);
// current slots复验，snapshot按SafeChangePayload对应pure factory/gate，qualified changes须同正式source覆盖。
// CAS所有目标slice/continuity/resumes/consumedChanges同root原子应用，不部分cursor成功。
// [ResumeCoordinator.applyResult(ResumeResultView)]
// [LocalConsumerReceiptFactory.create(LocalConsumerReceipt)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

complete无coverage/revision拒绝fresh；partial stale、gap gap、denied restricted、blocked blocked。当前父图/search/target变则context_changed，旧recovery不覆盖新single-flight。业务unknown仅probe，不因resume完成而confirmed。 默认错误见§3；CHAT-UP002/005/008/009未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Continuity resuming→fresh/stale/gap/restricted/blocked；各source Freshness，不跨owner统一fresh。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：ACK、partial、旧恢复、visibility收紧；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP002/005/008/009 blocked）；未运行测试。

### 8.4 ConsumeVisibilityChange

#### 入口、目标与构造

consumeVisibilityChange(request: ConsumeVisibilityChangeRequest): Promise<Outcome<ConsumeVisibilityChangeReply>>，声明见Step8同名卡；归RecoveryCoordinator.clearRevoked，input=QualifiedMaterial<VisibilityChangeView>、value=LocalConsumerReceipt。目标：scope撤销覆盖全部消费者，即使node槽位关闭；只收紧，不凭空升级available。

#### 函数级调用图: ConsumeVisibilityChange

```text
[ClientUseCases.consumeVisibilityChange(typed request)]
  | call strict ClientRequestFactory / QualifiedMaterial<VisibilityChangeView> validation
  v
[RecoveryCoordinator.clearRevoked]
  | read current local state; call ChangeFeedPort.stopContext; LocalProjectionRepository.list/evict
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<QualifiedMaterial<VisibilityChangeView>>(ClientRequest<QualifiedMaterial<VisibilityChangeView>> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
const qualified: QualifiedMaterial<VisibilityChangeView> = request.input;
const base: ClientSnapshot = store.read();
// [VisibilityChangeViewFactory.create(VisibilityChangeView)]
const visibility = VisibilityChangeViewFactory.create(qualified.projection);
// 先正式registry资格/当前session/actor/scope/source/visibility范围核对。
// scope reach遍历该scope所有registered consumer、所有相关root材料/locator分区，不依赖关闭node active slot。
// target reach只正式affected target+其依赖section，不能从ref字符串猜影响范围。
// [AccessPostureFactory.applyVisibility(AccessPosture, VisibilityChangeView)]
// [ConsumptionContextFactory.invalidate(ClientConsumptionContext, "revoked")]
// 对受影响route/selection/project/flow/node/link/directory/surface/preview/capability/draft/material：立即实际清字段，不CSS hide。
// CAS tighteningPatch：invalidate contexts、清引用及安全姿态；允许空checks仅此正式收紧路径。
// registry先invalidate被撤销句柄；本地hide不得等stop/delete成功。
// [ClearContextInputFactory.create(ClearContextInput)]
// 每affected已登记partition/cache key构造，fence=current、reason=revoked、visibility=正式材料。
// [RecoveryCoordinator.clearRevoked(ClearContextInput)]
// 内部ChangeFeedPort.stopContext + repo.list/evict；失败仍hidden/restricted。
// [LocalConsumerReceiptFactory.create(LocalConsumerReceipt)]
```

#### 一致性、错误与状态副作用

先单root tightening CAS（冲突重读继续收紧当前scope），后异步stop/delete独立repo版本；无跨store事务。清理失败不rollback hide，不声称cleared。

旧session revoke不清新session。scope收紧即使当前node slot已invalidated仍执行，先registry资格范围检查，不借空checks加宽权限。subject级引用/焦点/return/page游标一并移除，cleanup结果真实反映。 默认错误见§3；CHAT-UP002/009/storage未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Access hidden/restricted/blocked/read_only；Disclosure cleared；Consumption invalidated/cleared；LocalProjection evicting→cleared/restricted。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：node关闭后scope revoke、旧session、delete失败；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP002/009/storage blocked）；未运行测试。

### 8.5 ConsumeMaterialRevisionChange

#### 入口、目标与构造

consumeMaterialRevisionChange(request: ConsumeMaterialRevisionChangeRequest): Promise<Outcome<ConsumeMaterialRevisionChangeReply>>，声明见Step8同名卡；归ChangeReducer.consume，input=QualifiedMaterial<FormalChangeView>、value=LocalConsumerReceipt。目标：正式SDK材料变化触发；按source标stale/重查，不重建owner projection。

#### 函数级调用图: ConsumeMaterialRevisionChange

```text
[ClientUseCases.consumeMaterialRevisionChange(typed request)]
  | call strict ClientRequestFactory / QualifiedMaterial<FormalChangeView> validation
  v
[ChangeReducer.consume]
  | read current local state; call ChangeQualificationPort.qualify; SafeMaterialReadPort.readSummary
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<QualifiedMaterial<FormalChangeView>>(ClientRequest<QualifiedMaterial<FormalChangeView>> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
const change: QualifiedMaterial<FormalChangeView> = request.input;
// strict payload.kind==="material"，否则invalid_input，无局部替换。
const base: ClientSnapshot = store.read();
// [ChangeQualificationPort.qualify(ChangeQualificationInput, QualifiedSession)]
const qualification = await qualifier.qualify({ request: currentRequest, change, continuity: sourceContinuity }, session);
// [ChangeAcceptanceRecord.evaluate(...)]source duplicate/顺序/coverage gate。
const record = ChangeAcceptanceRecord.evaluate(change, qualification, sourceConsumed, sourceContinuity);
// 已accepted才对该materialID/source标新formal safe snapshot或stale；不从revision大小决定谁新。
// [FreshnessInterpreter.markStale(FreshnessMarker, SafeReasonCode)]
// 若正式表示source变更但没有安全内容，先裁剪再以OwnerSummaryReadInputFactory创建只读刷新。
// [ChangeReducer.applyQualified(ClientSnapshot, FormalChangeView, ChangeAcceptanceRecord)]
const patch = reducer.applyQualified(current, change.projection, record);
store.compareAndSet(current.version, change.fence, patch);
// [LocalConsumerReceiptFactory.create(LocalConsumerReceipt)]
// 当前access允许才另触发RefreshStaleMaterial；刷新缺合同blocked，不repair owner。
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

某owner revision改变只影响本source，Project/Process/Governance不跨owner比较。cached visibility不授fresh；材料撤销直接hide，不从列表消失推撤销。refresh晚到按原context丢弃。 默认错误见§3；CHAT-UP004/005/006、WS-UP未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Freshness fresh→stale/partial/unknown/expired，Disclosure收紧；Continuity source-local。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：source错、旧revision、unsafe material；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP004/005/006、WS-UP blocked）；未运行测试。

### 8.6 ConsumeShellLifecycle

#### 入口、目标与构造

consumeShellLifecycle(request: ConsumeShellLifecycleRequest): Promise<Outcome<ConsumeShellLifecycleReply>>，声明见Step8同名卡；归ShellLifecycleCoordinator.consume，input=ShellLifecycleEvent、value=LocalConsumerReceipt。目标：host触发；foreground资格重验/resume，offline非terminal attempt unknown；不owner cancel。

#### 函数级调用图: ConsumeShellLifecycle

```text
[ClientUseCases.consumeShellLifecycle(typed request)]
  | call strict ClientRequestFactory / ShellLifecycleEvent validation
  v
[ShellLifecycleCoordinator.consume]
  | read current local state; call LifecyclePort; ChangeFeedPort.stopAll; PlatformPort.probe
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<ShellLifecycleEvent>(ClientRequest<ShellLifecycleEvent> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [ShellLifecycleEventFactory.create(ShellLifecycleEvent)]
const event = ShellLifecycleEventFactory.create(request.input);
const base: ClientSnapshot = store.read();
// trusted hostBinding/sessionEpoch/generation，旧host事件ignored，不更改owner结果。
// [PlatformCapabilityState.applyLifecycle(PlatformCapabilityState, ShellLifecycleEvent)]
const platform = PlatformCapabilityState.applyLifecycle(base.platform, event);
switch (event.posture) {
  case "offline":
  case "background":
    // sources mark stale/reconnecting；已dispatch非terminal attempt标unknown，未dispatchdraft不自动发送。
    // 停止/暂停feed按formal SDK合同，不直接重连bus。
    break;
  case "foreground":
    // PlatformCapabilityAdapter.probe → RouteContextCoordinator.enter重新验证 → ResumeCoordinator.resume/requery；
    // gate未通过前不能展示旧owner内容或command。
    break;
  case "closing":
  case "restarting":
    // root invalidate/hide；ChangeFeedPort.stopAll；UI/host unsubscribe、memory clear；
    // no durable资格不能声称保存/恢复正文或host cancelled owner effect。
    break;
}
// [ShellLifecycleCoordinator.consume(ShellLifecycleEvent)]内部对应local CAS/stop顺序
// [LocalConsumerReceiptFactory.create]sourceRef/changeRef=null，technical applied≠业务成功。
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

foreground ≠ continuity fresh，offline ≠ command failed。取消host/read没有owner无副作用证明；background至多收紧，没有支持承诺的跨端后台任务。closing重复幂等清理，删除结果独立。 默认错误见§3；host/CHAT-UP002未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：ShellLifecyclePosture仅技术通知；CapabilityAvailability unknown；Continuity reconnecting/stale；Command未知effect。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：重复offline、旧host/epoch、closing；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external host/CHAT-UP002 blocked）；未运行测试。

### 8.7 ConsumeEvictionTrigger

#### 入口、目标与构造

consumeEvictionTrigger(request: ConsumeEvictionTriggerRequest): Promise<Outcome<ConsumeEvictionTriggerReply>>，声明见Step8同名卡；归CacheEvictionCoordinator.evict，input=EvictionInput、value=LocalConsumerReceipt。目标：session/正式revoke或local更严格TTL/容量触发；先遮蔽后删除，失败restricted。

#### 函数级调用图: ConsumeEvictionTrigger

```text
[ClientUseCases.consumeEvictionTrigger(typed request)]
  | call strict ClientRequestFactory / EvictionInput validation
  v
[CacheEvictionCoordinator.evict]
  | read current local state; call LocalProjectionRepository.load/evict; ChangeFeedPort.stopContext
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<EvictionInput>(ClientRequest<EvictionInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [EvictionInputFactory.create(EvictionInput)]
const input = EvictionInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// context.visibility若revoked须正式资格，TTL/容量只本地更严收紧。
// [ClientStatePort.compareAndSet]先失效当前受影响slots并实际隐藏root材料/草稿/selection。
const hidden = store.compareAndSet(base.version, input.context.fence, tighteningPatch);
// [LocalProjectionRepository.load(cacheKey, partition)]
const entry = await projections.load(input.context.key, input.context.partition);
// expectedVersion与load一致，新写冲突重读；不能blind delete其它session。
// [CacheEvictionCoordinator.evict(EvictionInput)]
const record = await eviction.evict(input); // 内部stopContext→versioned repository.evict
// DeleteResult deleted/already_absent才cleared；failed/storage conflict保持restricted/false。
// [LocalConsumerReceiptFactory.create]local source/change均null；formal revoke来源另核验但不捏event id。
```

#### 一致性、错误与状态副作用

hide/invalidate单root CAS在任何delete IO前；repository expected来自load/list，其version独立。stop/delete失败不能恢复旧展示。

confirmed_revision只删匹配稿，不把旧确认当全scope eviction。删除失败不声称cleared；容量eviction不取消dispatched command。local_policy无owner delete API。 默认错误见§3；storage未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：LocalProjection evicting→cleared/restricted，Consumption invalidated/cleared，Disclosure cleared。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：CAS删除冲突、旧分区、清理未确认；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external storage blocked）；未运行测试。

### 8.8 Consumer整体停审

七source typed输入与local receipt完整，duplicate/顺序/gap由SDK正式资格；result/coverage/撤销各自gate。scope revoke先当前范围验证，再隐藏失效，覆盖已关闭node；host/local不伪event id。root cursor/consumed/source patch同CAS，后续delete独立失败restricted。进入9-D，所有上游SDK/host/storage blocker保留。

## 9. 9-D 诊断/支持意图

| Flow | 协议/对象 | port | 状态/停审 |
|---|---|---|---|
| ClientDiagnosticHandoffRequested | Step8同名/DiagnosticHandoffView | DiagnosticPort.send | 显式用户操作/无body |
| ClientSupportContextRequested | Step8同名/DiagnosticHandoffView | DiagnosticPort.send | 显式用户操作/无body |

### 9.1 ClientDiagnosticHandoffRequested

#### 入口、目标与构造

clientDiagnosticHandoffRequested(request: ClientDiagnosticHandoffRequestedRequest): Promise<Outcome<ClientDiagnosticHandoffRequestedReply>>，声明见Step8同名卡；归DiagnosticHandoffAdapter.send，input=DiagnosticContext、value=DiagnosticHandoffView。目标：用户主动支持操作且formal_low_sensitivity时发送；名称不是公共event/topic。

#### 函数级调用图: ClientDiagnosticHandoffRequested

```text
[ClientUseCases.clientDiagnosticHandoffRequested(typed request)]
  | call strict ClientRequestFactory / DiagnosticContext validation
  v
[DiagnosticHandoffAdapter.send]
  | read current local state; call DiagnosticPort.send
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<DiagnosticContext>(ClientRequest<DiagnosticContext> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [DiagnosticContextFactory.create(DiagnosticContext)]
const input = DiagnosticContextFactory.create(request.input);
const base: ClientSnapshot = store.read();
// ClientDiagnosticHandoffRequested由明确用户支持操作触发，userRequested必须true，sessionEpoch当前。
if (config.diagnosticMode === "disabled") {
  // DiagnosticHandoffViewFactory.create({ requestId, status:"disabled", receiptRef:null, reason:"unavailable" })
  // 无SDK调用、无日志/文件/后台审计写入。
}
// exact SDK diagnostic capability缺失status blocked，不创建sink或bus event。
// [DiagnosticPort.send(DiagnosticContext, QualifiedSession)]
const result = await diagnostics.send(input, session);
// [DiagnosticHandoffViewFactory.create(DiagnosticHandoffView)]
const view = DiagnosticHandoffViewFactory.create(result);
// accepted仅正式safe receipt；已发起timeout只能unknown，不自动重送；用户再操作须明确新请求。
// 请求/响应不持久化，输入只有限category/reason/platform，不存text/ref/secret/stack。
// [ClientReplyFactory.create<DiagnosticHandoffView>(ClientReply)]按current root version/fence返回，旧session不披露。
```

#### 一致性、错误与状态副作用

没有owner或diagnostic backend事务；local request ID仅防当前用户重复点击。sink side effect独立，不能回滚为未发送事实；无outbox/定时retry。

strict schema额外字段直接invalid_input；未主动请求/disabled无IO；source capability missing blocked。accepted只表示交付receipt，不代表report/evidence/验收已创建。 默认错误见§3；CHAT-UP007未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：DiagnosticHandoffView四分类不是持续状态机，无Command terminal升级。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：disabled、正文/secret注入、未知交付；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP007 blocked）；未运行测试。

### 9.2 ClientSupportContextRequested

#### 入口、目标与构造

clientSupportContextRequested(request: ClientSupportContextRequestedRequest): Promise<Outcome<ClientSupportContextRequestedReply>>，声明见Step8同名卡；归DiagnosticHandoffAdapter.send，input=DiagnosticContext、value=DiagnosticHandoffView。目标：显式用户支持动作；不代表报告/审计/evidence已创建。

#### 函数级调用图: ClientSupportContextRequested

```text
[ClientUseCases.clientSupportContextRequested(typed request)]
  | call strict ClientRequestFactory / DiagnosticContext validation
  v
[DiagnosticHandoffAdapter.send]
  | read current local state; call DiagnosticPort.send
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<DiagnosticContext>(ClientRequest<DiagnosticContext> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [DiagnosticContextFactory.create(DiagnosticContext)]
const input = DiagnosticContextFactory.create(request.input);
const base: ClientSnapshot = store.read();
// ClientSupportContextRequested由明确用户支持操作触发，userRequested必须true，sessionEpoch当前。
if (config.diagnosticMode === "disabled") {
  // DiagnosticHandoffViewFactory.create({ requestId, status:"disabled", receiptRef:null, reason:"unavailable" })
  // 无SDK调用、无日志/文件/后台审计写入。
}
// exact SDK diagnostic capability缺失status blocked，不创建sink或bus event。
// [DiagnosticPort.send(DiagnosticContext, QualifiedSession)]
const result = await diagnostics.send(input, session);
// [DiagnosticHandoffViewFactory.create(DiagnosticHandoffView)]
const view = DiagnosticHandoffViewFactory.create(result);
// accepted仅正式safe receipt；已发起timeout只能unknown，不自动重送；用户再操作须明确新请求。
// 请求/响应不持久化，输入只有限category/reason/platform，不存text/ref/secret/stack。
// [ClientReplyFactory.create<DiagnosticHandoffView>(ClientReply)]按current root version/fence返回，旧session不披露。
```

#### 一致性、错误与状态副作用

没有owner或diagnostic backend事务；local request ID仅防当前用户重复点击。sink side effect独立，不能回滚为未发送事实；无outbox/定时retry。

strict schema额外字段直接invalid_input；未主动请求/disabled无IO；source capability missing blocked。accepted只表示交付receipt，不代表report/evidence/验收已创建。 默认错误见§3；CHAT-UP007未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：DiagnosticHandoffView四分类不是持续状态机，无Command terminal升级。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：用户未请求、sink缺失、重复请求；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP007 blocked）；未运行测试。

### 9.3 本组停审

两个local意图都有strict schema、sink资格/disabled/unknown分支，无backend event topic或outbox；不是观测结果/证据。继续Job。

## 10. 9-D 八个恢复与维护Job

| Flow | 协议/对象 | port | 状态/停审 |
|---|---|---|---|
| ResumeChangeContext | Step8同名/ResumeResultView | ResumePort.resume | 逐flow停审 |
| RequeryAfterGap | Step8同名/ResumeResultView | ResumePort.requery | 逐flow停审 |
| ResolveUnknownAttempt | Step8同名/IntentFeedbackViewModel | IntentProbePort.probe | 逐flow停审 |
| RefreshStaleMaterial | Step8同名/SafeMaterialSnapshot | SafeMaterialReadPort.readSummary | 逐flow停审 |
| RestoreAfterShellRestart | Step8同名/RecoveryViewModel | LocalProjectionRepository.load; EntryAccessPort.resolve; IntentProbePort.probe | 逐flow停审 |
| PersistLocalProjection | Step8同名/LocalProjectionEntry | LocalProjectionRepository.load/save | 逐flow停审 |
| EvictLocalMaterial | Step8同名/CacheLifecycleRecord | LocalProjectionRepository.load/list/evict; ChangeFeedPort.stopContext | 逐flow停审 |
| EmitDiagnosticHandoff | Step8同名/DiagnosticHandoffView | DiagnosticPort.send | 逐flow停审 |

### 10.1 ResumeChangeContext

#### 入口、目标与构造

resumeChangeContext(request: ResumeChangeContextRequest): Promise<Outcome<ResumeChangeContextReply>>，声明见Step8同名卡；归ResumeCoordinator.resume，input=ResumeInput、value=ResumeResultView。目标：reconnect或用户resume触发，single-flight per source/recovery；无业务重放。

#### 函数级调用图: ResumeChangeContext

```text
[ClientUseCases.resumeChangeContext(typed request)]
  | call strict ClientRequestFactory / ResumeInput validation
  v
[ResumeCoordinator.resume]
  | read current local state; call ResumePort.resume
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<ResumeInput>(ClientRequest<ResumeInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [ResumeInputFactory.create(ResumeInput)]
const input = ResumeInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
const source: ExternalHandle<"source"> = input.request.context.sourceReference;
// 当前source gap/reconnecting/stale、allowedActions含resume；recoveryRef匹配，single-flight同source/recovery。
// [ContinuityFactory.beginResume(ContinuityState, ResumeContext, LocalId<"recovery">)]
const resuming = ContinuityFactory.beginResume(base.continuityBySource.get(source), input.context, input.recoveryRef);
// CAS sources.continuity=resuming＋resumesBySource当前context；current request slot检查。
// [ResumePort.resume(ResumeInput, QualifiedSession)]
const qualified = await resumePort.resume(input, session);
// [ResumeResultViewFactory.create(ResumeResultView)] → ConsumeResumeResult完整资格/coverage/parent/target gate。
// [ResumeCoordinator.applyResult(ResumeResultView)]
resumes.applyResult(qualified.projection);
// 当前recovery response confirmed local application，complete才fresh，changes/snapshot/cursor同CAS。
// [ClientReplyFactory.create<ResumeResultView>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

同source/recovery已resuming时附同flight或waiting，不重复打开feed；新recovery使旧result context_changed。SDK缺resume返回blocked；single-source complete不刷新其它source。所有业务unknown保持待probe。 默认错误见§3；CHAT-UP002/008/009未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Continuity stale/gap/reconnecting→resuming→fresh/stale/gap/restricted/blocked。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：并发resume、旧cursor、partial；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP002/008/009 blocked）；未运行测试。

### 10.2 RequeryAfterGap

#### 入口、目标与构造

requeryAfterGap(request: RequeryAfterGapRequest): Promise<Outcome<RequeryAfterGapReply>>，声明见Step8同名卡；归ResumeCoordinator.requery，input=ResumeInput、value=ResumeResultView。目标：SDK明确gap触发；read-only快照，完整coverage资格缺失仍stale。

#### 函数级调用图: RequeryAfterGap

```text
[ClientUseCases.requeryAfterGap(typed request)]
  | call strict ClientRequestFactory / ResumeInput validation
  v
[ResumeCoordinator.requery]
  | read current local state; call ResumePort.requery
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<ResumeInput>(ClientRequest<ResumeInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [ResumeInputFactory.create(ResumeInput)]
const input = ResumeInputFactory.create(request.input);
// action必须requery，input.context.gapRef是formal gap；查询范围仍当前actor/scope/target/source。
const base: ClientSnapshot = store.read();
// beginResume与当前recovery/source CAS single-flight，保留最后accepted cursor，不造新offset。
// [ResumePort.requery(ResumeInput, QualifiedSession)]
const read = await resumePort.requery(input, session);
// SDK正式safe snapshot↔feed coverage边界必须可证明；partial不当完整补齐。
// [ResumeResultViewFactory.create(ResumeResultView)]
const result = ResumeResultViewFactory.create(read.projection);
// [ResumeCoordinator.applyResult(ResumeResultView)]走ConsumeResumeResult，current所有section checks与父revision。
// root目标slice/coverage/consumed/source水位同CAS；Visibility tightening先hide，不等完整requery。
// [ClientReplyFactory.create<ResumeResultView>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

HTTP200/empty snapshot不证明gap填齐；无coverage contract保持stale/blocked。query中source/节点/search改变丢旧结果，绝不把incoming当前化；无ownerrepair/自动业务重放。 默认错误见§3；CHAT-UP002/005/008/009未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Continuity gap/stale→resuming→fresh仅完整coverage；PageLoad partial/stale安全展示。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：gap→HTTP200非fresh、late snapshot；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP002/005/008/009 blocked）；未运行测试。

### 10.3 ResolveUnknownAttempt

#### 入口、目标与构造

resolveUnknownAttempt(request: ResolveUnknownAttemptRequest): Promise<Outcome<ResolveUnknownAttemptReply>>，声明见Step8同名卡；归UserIntentCoordinator.resolveUnknown，input=ProbeAttemptInput、value=IntentFeedbackViewModel。目标：用户probe/重连后的安全读取触发；无effect重放；not_found不自动failed。

#### 函数级调用图: ResolveUnknownAttempt

```text
[ClientUseCases.resolveUnknownAttempt(typed request)]
  | call strict ClientRequestFactory / ProbeAttemptInput validation
  v
[UserIntentCoordinator.resolveUnknown]
  | read current local state; call IntentProbePort.probe
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<ProbeAttemptInput>(ClientRequest<ProbeAttemptInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [ProbeAttemptInputFactory.create(ProbeAttemptInput)]
const input = ProbeAttemptInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
const attempt = base.attempts.get(input.intentRef);
// 此Job只unknown且dispatched=true，原SDKassociation有正式资格；不存在/错session拒绝。
// [IntentProbePort.probe(ProbeAttemptInput, QualifiedSession)]
const probe = await probes.probe(input, session);
// [FormalProbeResultFactory.create(FormalProbeResult)]
const safe = FormalProbeResultFactory.create(probe.projection);
// [CommandResultGate.resolveUnknown(CommandAttemptState, FormalProbeResult)]
const decision = gate.resolveUnknown(attempt, safe);
// 正式resolved material走AttemptFactory.applyResult，pending/not_found无no-effect证明保持unknown。
// CAS attempts，check original probe context/current intent，terminal重复no-op，conflict拒绝。
// confirmed匹配草稿才DraftFactory.clear同CAS；更新revision保留。
// [IntentFeedbackFactory.fromAttempt(CommandAttemptState)]
// [ClientReplyFactory.create<IntentFeedbackViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

Job不调用prepare/dispatch/retry；not_found或timeout永远不能自己制造failed，failed需要formal material.effect=no_effect。safe locator重启rebind缺合同blocked，不凭本地intentRef查私有ownerAPI。 默认错误见§3；CHAT-UP001/003未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Command unknown→pending/confirmed/rejected/failed只正式gate；无automatic retry。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：not_found、unknown永久等待、正式no effect；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP001/003 blocked）；未运行测试。

### 10.4 RefreshStaleMaterial

#### 入口、目标与构造

refreshStaleMaterial(request: RefreshStaleMaterialRequest): Promise<Outcome<RefreshStaleMaterialReply>>，声明见Step8同名卡；归SafeMaterialReadPort.readSummary + SafeMaterialComposer，input=OwnerSummaryReadInput、value=SafeMaterialSnapshot。目标：当前可见材料stale且capability允许触发；read-only，不repair owner。

#### 函数级调用图: RefreshStaleMaterial

```text
[ClientUseCases.refreshStaleMaterial(typed request)]
  | call strict ClientRequestFactory / OwnerSummaryReadInput validation
  v
[SafeMaterialReadPort.readSummary + SafeMaterialComposer]
  | read current local state; call SafeMaterialReadPort.readSummary
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<OwnerSummaryReadInput>(ClientRequest<OwnerSummaryReadInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [OwnerSummaryReadInputFactory.create(OwnerSummaryReadInput)]
const input = OwnerSummaryReadInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// target当前safe材料stale/expired，不凭ownerref默认visible；先当前独立access/source slot。
if (currentTargetAccess.availability === "hidden") {
  // 立即隐藏并不执行query，不留title/ref/旧preview。
}
// [SafeMaterialReadPort.readSummary(OwnerSummaryReadInput, QualifiedSession)]
const read = await materialsRead.readSummary(input, session);
// [SafeMaterialComposer.compose(QualifiedMaterial<SafeMaterialSnapshot>, AccessPosture)]
const material = composer.compose(read, currentTargetAccess);
// FreshnessInterpreter校验formal revision/coverage，不能TTL过期后直接fresh。
// CAS root.materials及实际引用该material的safe页面由对应factory纯投影，全部source incoming checks。
// [ClientReplyFactory.create<SafeMaterialSnapshot>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

某source刷新只改变自身freshness，不把Work状态刷新当Process拓扑有效。safe内容缺失partial/unavailable，unsafe body丢弃；revoke期间late结果context_changed。 默认错误见§3；CHAT-UP004/005/006、WS-UP未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Freshness stale/expired/unknown→fresh/partial仅新formal query；Disclosure不会绕过撤销。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：隐藏后refresh迟到、partial/expired；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP004/005/006、WS-UP blocked）；未运行测试。

### 10.5 RestoreAfterShellRestart

#### 入口、目标与构造

restoreAfterShellRestart(request: RestoreAfterShellRestartRequest): Promise<Outcome<RestoreAfterShellRestartReply>>，声明见Step8同名卡；归RecoveryCoordinator.restore，input=RestoreInput、value=RecoveryViewModel。目标：trusted shell restart触发；默认memory可能无候选；不恢复旧授权/confirmed断言或重发。

#### 函数级调用图: RestoreAfterShellRestart

```text
[ClientUseCases.restoreAfterShellRestart(typed request)]
  | call strict ClientRequestFactory / RestoreInput validation
  v
[RecoveryCoordinator.restore]
  | read current local state; call LocalProjectionRepository.load; EntryAccessPort.resolve; IntentProbePort.probe
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<RestoreInput>(ClientRequest<RestoreInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [RestoreInputFactory.create(RestoreInput)]
const input = RestoreInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// root旧generation先失效/refs隐藏；input.partition/key从trusted memory候选，routeGeneration当前。
const entry = await projections.load(input.key, input.partition); // [LocalProjectionRepository.load]
if (entry === null) {
  // safe empty recovery，default memory退出后无记录正常；不猜owner缺失。
}
// [PersistenceSafetyGuard.canRestore(LocalProjectionEntry, AccessPosture)]
const guard = persistenceGuard.canRestore(entry, current.access);
// 恢复候选不授access：RouteContextFactory.fromRestore(...hint...) → EnterRouteInputFactory.create(...restorationCandidate...)
// [EntryAccessPort.resolve(EnterRouteInput, QualifiedSession)]
// 正式SDK locator/session/actor/scope重新绑定，目标access独立；未绑定serializer blocked。
// [LocalProjectionEntry.restore(LocalProjectionEntry, AccessPosture)]仅restored/stale，draft正文默认不恢复。
// attemptHints只有SDK正式locator rebind后ProbeAttemptInputFactory构造→UserIntentCoordinator.resolveUnknown。
// [RecoveryCoordinator.restore(RestoreInput, QualifiedSession)]返回当前source nextActions/unknown安全反馈。
// [ClientReplyFactory.create<RecoveryViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

load与root新route验证分开；缓存恢复不能原子恢复跨owner内容。durable未qualified无跨重启数据保证；任何access前禁止旧text披露。

错partition/epoch/revision/candidate拒绝；routeGeneration变化弃旧restore；旧persisted confirmed不恢复当前business truth；无业务重放。恢复失败只展示安全next action，不造成功run。 默认错误见§3；safe locator/storage/CHAT-UP001/002未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Route expired→unresolved；LocalProjection cached/stale→restored/stale；Continuity stale/blocked。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：absent、错actor、expired候选；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external safe locator/storage/CHAT-UP001/002 blocked）；未运行测试。

### 10.6 PersistLocalProjection

#### 入口、目标与构造

persistLocalProjection(request: PersistLocalProjectionRequest): Promise<Outcome<PersistLocalProjectionReply>>，声明见Step8同名卡；归PersistenceSafetyGuard.canPersist + LocalProjectionRepository.save，input=PersistProjectionInput、value=LocalProjectionEntry。目标：local展示变动且guard允许触发；qualified serializer缺失不启durable。

#### 函数级调用图: PersistLocalProjection

```text
[ClientUseCases.persistLocalProjection(typed request)]
  | call strict ClientRequestFactory / PersistProjectionInput validation
  v
[PersistenceSafetyGuard.canPersist + LocalProjectionRepository.save]
  | read current local state; call LocalProjectionRepository.load/save
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<PersistProjectionInput>(ClientRequest<PersistProjectionInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [PersistProjectionInputFactory.create(PersistProjectionInput)]
const input = PersistProjectionInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// entry.partition/session/fence一致，payload只批准safe候选，text/material durable禁止。
const existing = await projections.load(input.entry.cacheKey, input.entry.partition); // version来源
// existing null时expectedVersion=null要求不存在；非null要求entry.localVersion==expectedVersion。
// [PersistenceSafetyGuard.canPersist(LocalProjectionEntry)]
const decision = persistenceGuard.canPersist(input.entry);
// 默认memoryOnly=true；safe locator缺serializer不造hint，不用ExternalHandle.token转字符串。
if (!decision.allowed) { /* storage_unavailable/dependency_unbound，无save */ }
// 保存前复验root.current fence且此前未开始evict/clear；被撤销partition没有写入权。
// [LocalProjectionRepository.save(LocalProjectionEntry, LocalVersion|null, ContextFence)]
const saved = await projections.save(input.entry, input.expectedVersion, input.fence);
// repository返回自己的localVersion，不当reply根版本；root再次核对仍current，无body泄露。
// [ClientReplyFactory.create<LocalProjectionEntry>(ClientReply)]
```

#### 一致性、错误与状态副作用

repository CAS independent from root；必须partition/generation被invalidate后拒绝旧pending save，不能hide后写回复活。expected只来自load，同partition sweep先invalidates write eligibility。

blind upsert/跨partition/unknownlocator拒绝；save失败不声称cached/durable。内存safe材料可持有但不serialize owner body/credential/text/command payload。配置不能开启未qualifieddurable。 默认错误见§3；storage/safe locator未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：LocalProjection absent/cached/stale受guard→cached，evicting/cleared不得旧generation保存。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：blind upsert拒绝、token/text拒绝、分区；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external storage/safe locator blocked）；未运行测试。

### 10.7 EvictLocalMaterial

#### 入口、目标与构造

evictLocalMaterial(request: EvictLocalMaterialRequest): Promise<Outcome<EvictLocalMaterialReply>>，声明见Step8同名卡；归CacheEvictionCoordinator.evict，input=EvictionInput、value=CacheLifecycleRecord。目标：logout/revoke/expiry/capacity触发；hide先于IO，失败restricted，不owner deletion。

#### 函数级调用图: EvictLocalMaterial

```text
[ClientUseCases.evictLocalMaterial(typed request)]
  | call strict ClientRequestFactory / EvictionInput validation
  v
[CacheEvictionCoordinator.evict]
  | read current local state; call LocalProjectionRepository.load/list/evict; ChangeFeedPort.stopContext
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<EvictionInput>(ClientRequest<EvictionInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [EvictionInputFactory.create(EvictionInput)]
const input = EvictionInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// 先invalidate受影响root slots/refs及partition旧write eligibility；hidden与keyboard/AT一起清。
store.compareAndSet(base.version, input.context.fence, tighteningPatch);
// [ChangeFeedPort.stopContext(ContextFence)]不能声称owner command canceled。
await feeds.stopContext(input.context.fence);
// partition sweep时LocalProjectionRepository.list获取每entry.localVersion，遍历新keypage，不owner cursor。
// [LocalProjectionRepository.load(cacheKey, partition)]
const currentEntry = await projections.load(input.context.key, input.context.partition);
// [LocalProjectionEntry.beginEvict(entry, ClearReason)]
// [LocalProjectionRepository.evict(cacheKey, partition, expectedVersion)]
const deleted = await projections.evict(input.context.key, input.context.partition, currentEntry === null ? null : currentEntry.localVersion);
// [CacheLifecycleRecord.finish(CacheLifecycleRecord, DeleteResult)]
const record = CacheLifecycleRecord.finish(CacheLifecycleRecord.fromEviction(input.context.key, input.context.reason), deleted);
// 已确认deleted/already_absent→cleared，否则restricted/deleteConfirmed=false，不rollbackhide。
// [ClientReplyFactory.create<CacheLifecycleRecord>(ClientReply)]
```

#### 一致性、错误与状态副作用

hide/stop/delete独立阶段，rootCAS先；repo版本per entry，冲突仅重读当前partition并继续安全清理，不能跨session强制删除。

stop失败依然尝试允许的local删除；delete未确认不cleared。scope revoke清所有affected key，即使node关闭；capacity只local收紧，不取消owner effect。draft confirmed_revision必须匹配最新revision。 默认错误见§3；storage未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：LocalProjection cached/restored/stale/restricted→evicting→cleared/restricted；Access/Disclosure只收紧。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：删除失败、concurrent write、version错；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external storage blocked）；未运行测试。

### 10.8 EmitDiagnosticHandoff

#### 入口、目标与构造

emitDiagnosticHandoff(request: EmitDiagnosticHandoffRequest): Promise<Outcome<EmitDiagnosticHandoffReply>>，声明见Step8同名卡；归DiagnosticHandoffAdapter.send，input=DiagnosticContext、value=DiagnosticHandoffView。目标：用户支持操作触发，本轮不自动定时发送/重发unknown；sink失败不影响业务。

#### 函数级调用图: EmitDiagnosticHandoff

```text
[ClientUseCases.emitDiagnosticHandoff(typed request)]
  | call strict ClientRequestFactory / DiagnosticContext validation
  v
[DiagnosticHandoffAdapter.send]
  | read current local state; call DiagnosticPort.send
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<DiagnosticContext>(ClientRequest<DiagnosticContext> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [DiagnosticContextFactory.create(DiagnosticContext)]
const input = DiagnosticContextFactory.create(request.input);
const base: ClientSnapshot = store.read();
// EmitDiagnosticHandoff由明确用户支持操作触发，userRequested必须true，sessionEpoch当前。
if (config.diagnosticMode === "disabled") {
  // DiagnosticHandoffViewFactory.create({ requestId, status:"disabled", receiptRef:null, reason:"unavailable" })
  // 无SDK调用、无日志/文件/后台审计写入。
}
// exact SDK diagnostic capability缺失status blocked，不创建sink或bus event。
// [DiagnosticPort.send(DiagnosticContext, QualifiedSession)]
const result = await diagnostics.send(input, session);
// [DiagnosticHandoffViewFactory.create(DiagnosticHandoffView)]
const view = DiagnosticHandoffViewFactory.create(result);
// accepted仅正式safe receipt；已发起timeout只能unknown，不自动重送；用户再操作须明确新请求。
// 请求/响应不持久化，输入只有限category/reason/platform，不存text/ref/secret/stack。
// [ClientReplyFactory.create<DiagnosticHandoffView>(ClientReply)]按current root version/fence返回，旧session不披露。
```

#### 一致性、错误与状态副作用

没有owner或diagnostic backend事务；local request ID仅防当前用户重复点击。sink side effect独立，不能回滚为未发送事实；无outbox/定时retry。

strict schema额外字段直接invalid_input；未主动请求/disabled无IO；source capability missing blocked。accepted只表示交付receipt，不代表report/evidence/验收已创建。 默认错误见§3；CHAT-UP007未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：DiagnosticHandoffView四分类不是持续状态机，无Command terminal升级。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：disabled无IO、sink timeout unknown；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP007 blocked）；未运行测试。

### 10.9 Job停审

八Job单接口完整call/版本/错误/状态/切口，恢复complete有正式coverage，unknown只probe，本地保存/删除有version pairing与partition失效；诊断显式userRequested。本地jobs不是backend实现/执行证据，所有external blockers仍open，继续local actions。

## 11. 9-D 项目导航与目录搜索

| Flow | 协议/对象 | port | 状态/停审 |
|---|---|---|---|
| NavigateProjectContext | Step8同名/ProjectNavigationState | ClientStatePort.read/compareAndSet | 局部版本/代次隔离 |
| UpdateDirectorySearch | Step8同名/CompanyDirectoryViewModel | ClientStatePort.compareAndSet; CollaborationReadPort.readCompanyDirectory | 局部版本/代次隔离 |

### 11.1 NavigateProjectContext

#### 入口、目标与构造

navigateProjectContext(request: NavigateProjectContextRequest): Promise<Outcome<NavigateProjectContextReply>>，声明见Step8同名卡；归ProjectContextCoordinator.navigate，input=NavigateProjectInput、value=ProjectNavigationState。目标：项目任务→详情progress标签；群聊→项目重验；route不增加顶层progress。

#### 函数级调用图: NavigateProjectContext

```text
[ClientUseCases.navigateProjectContext(typed request)]
  | call strict ClientRequestFactory / NavigateProjectInput validation
  v
[ProjectContextCoordinator.navigate]
  | read current local state; call ClientStatePort.read/compareAndSet
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<NavigateProjectInput>(ClientRequest<NavigateProjectInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [NavigateProjectInputFactory.create(NavigateProjectInput)]
const input = NavigateProjectInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// expectedVersion==base.version、fence当前、target project/stage/node都来自获准safe model。
const nav: ProjectNavigationState = input.navigation;
// tab必须overview/progress/conversations/work_items/evidence，无顶层progress route。
// 若node/stage变：先ConsumptionContextFactory.invalidate旧slot/section，clear旧node/detail焦点。
// [ProjectContextCoordinator.navigate(ProjectNavigationState, LocalVersion)]
projects.navigate(nav, input.expectedVersion); // 单root CAS，nav与detail.navigation只读派生一致
// 项目任务点击：正式Work关系得到project → RouteContextCoordinator.enter重验项目 → activeTab=progress。
// 群聊→项目只正式relationship入口，不能自动绑定项目或继承群权限；返回候选先裁剪，back重新resolve。
// 下钻已有formal ref另LoadStageProcessFlow/LoadProcessNodeDetail读，viewport只local展示。
// [ClientReplyFactory.create<ProjectNavigationState>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅单root versioned local navigation CAS；网络读取按后续独立Query，不与选择原子假定owner结果。checks=[]仅当前safe local选择/失效。

选隐藏node/stage、父revision错→access_denied/context_changed；pure tab变化可进入blocked缺能力面，不能显示旧缓存图。back新generation重新access，不恢复授权。 默认错误见§3；target access/CHAT-UP008/009未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：SelectionPhase empty/stale→selected需formal材料，parent change→stale，revoke→cleared；PageLoad由后续Query。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：hidden target、返回语境、父图更新；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external target access/CHAT-UP008/009 blocked）；未运行测试。

### 11.2 UpdateDirectorySearch

#### 入口、目标与构造

updateDirectorySearch(request: UpdateDirectorySearchRequest): Promise<Outcome<UpdateDirectorySearchReply>>，声明见Step8同名卡；归DirectoryCoordinator.search，input=DirectorySearchInput、value=CompanyDirectoryViewModel。目标：用户搜索触发；不扩coverage、不能全公司抓取local过滤，无正式provider则blocked。

#### 函数级调用图: UpdateDirectorySearch

```text
[ClientUseCases.updateDirectorySearch(typed request)]
  | call strict ClientRequestFactory / DirectorySearchInput validation
  v
[DirectoryCoordinator.search]
  | read current local state; call ClientStatePort.compareAndSet; CollaborationReadPort.readCompanyDirectory
  v
[Step6 named factory/gate; qualified source/current slot]
  | local CAS or same-version readonly output
  v
[ClientReplyFactory / LocalConsumerReceiptFactory]
```

关键说明：typed输入字段按Step8逐项传递；owner/SDK资格不由local factory生成。图中port均定义Step7；更具体执行次序与分支见下文。

#### 关键typed伪代码

```ts
// [ClientRequestFactory.create<DirectorySearchInput>(ClientRequest<DirectorySearchInput> request)]
// schemaVersion/session严格校验；每失败Outcome立即返回，不能继续unsafe调用。
// [DirectorySearchInputFactory.create(DirectorySearchInput)]
const input = DirectorySearchInputFactory.create(request.input);
const base: ClientSnapshot = store.read();
// input.search限长/批准filter，原provider/current scope/fence；query变化分配新requestGeneration，不能复用旧slot。
// [ConsumptionContextFactory.invalidate(oldContext, "target_changed")]
// [ConsumptionContextFactory.forRequest(route,session,project|null,target,source,visibility,newGeneration)]
const nextContext = qualifiedNextContext; // 所有source/access来自正式registry，无法构造则blocked
// [CompanyDirectoryFactory.updateSearch(CompanyDirectoryViewModel, LocalDirectorySearchState, ClientConsumptionContext)]
const nextView = CompanyDirectoryFactory.updateSearch(base.companyDirectory, input.search, nextContext);
// CAS contexts新代次、companyDirectory=nextView：people=[]、pageInfo cursor/lineage=null、selectedPerson=null。
// [DirectoryReadInputFactory.create(DirectoryReadInput)]provider当前正式ref，page第一页面cursor/lineage=null。
// [CollaborationReadPort.readCompanyDirectory(DirectoryReadInput, QualifiedSession)]
// [CompanyDirectoryFactory.applyPage(currentView, QualifiedMaterial<SafeDirectoryPageView>)]
// 每reply核对新query/代次/lineage，旧搜索/页late丢弃，不把incoming代次改成current。
// [DirectoryCoordinator.search(LocalDirectorySearchState, ConsumptionRequest, QualifiedSession)]
// [ClientReplyFactory.create<CompanyDirectoryViewModel>(ClientReply)]
```

#### 一致性、错误与状态副作用

仅本地root CAS，expected来自本次read；相关async消费checks全部核对。SDK只读与local root无跨owner原子事务。

provider contract missing先local清旧data并blocked，不抓全目录local过滤。输入search.selectedPerson不是新搜索授权，query变化必清选人。人员分类缺filter能力只能all，输入unsupported filter拒绝。 默认错误见§3；CHAT-UP009未关闭时对应port dependency_unbound、无private fallback。

状态承接Step10：Consumption oldactive→invalidated/cleared、新代次active；PageLoad→loading/blocked→ready/partial，Selection旧选择清。无backend truth/audit/history/outbox/bus；local result不作实现或验收证据。

#### planned切口与单flow停审

切口：rapid search、旧页、provider unavailable；核对actor/scope/source/target/visibility/代次、error无泄露、CAS版本和副作用边界。DTO/对象函数/port/状态可以回指Step6～8，本flow设计停审通过（external CHAT-UP009 blocked）；未运行测试。

### 11.3 本组停审

两个local action并未成为owner Command，项目五标签/关系跳转重验，搜索更换代次与清分页lineage；没有扩大权限或provider coverage。进入43flow跨审计。

## 12. 9-E 跨flow字段/状态/副作用审计

### 12.1 每类patch的完整写入范围

| 处理流/patch | changes完整local责任字段 | version/consumptionChecks | 外部副作用 |
|---|---|---|---|
| SubmitConversationIntent reservePatch | attempts immutable add(intent)；drafts同draft markSubmitting | expected=base.version；request slot incoming | 无，CAS后才no-effect prepare |
| SubmitGovernanceIntent reservePatch | attempts add完整gateReference/governanceAction | 当前actor/fence/Gate/action nonterminal去重，current slot | 无，CAS胜出者prepare |
| 两Submit dispatch reservation | attempts bindAssociation/reserveDispatch，dispatched=true/submitted | 最新root.version，同intent仍draft/当前slot；仅成功caller拥有调用权 | 一次SDK.dispatch |
| 两Submit反馈/结果 | attempts；匹配draftRef/revision才drafts.clear；accessibility公告只派生 | formal result原incoming；terminal重复no-op | 无新业务调用 |
| ResolveEntryAccess预遮蔽 | route候选unresolved；access blocked；selection清；entry/surface/projectList/projectDetail/projectNavigation/processNodeDetail/companyDirectory/preview/conversationLinks=null；intentCapabilities清；受影响contexts失效；受影响materials/drafts清；continuity/resumes清/受限 | 当前session/request generation；只收紧local旧数据可空checks | resolve只读，不creator owner |
| ResolveEntryAccess资格结果 | route/access；scope/context正式mapping，hidden全部refs清 | pre-entry requestFence/session/actor/route/current generation原子核对；普通业务材料不能走此例外 | 无 |
| LoadEntry（既有Collaboration.loadEntry helper） | entry来自assembler.assembleEntry | original read slot，expected最新read | readEntry只读；非新增protocol |
| LoadConversationSurface/TurnPage | surface；selection只当前root派生 | original qualified slot/page lineage；read与surface同version | 只读 |
| LoadOwnerSummary/RefreshStaleMaterial/MemberContext | materials及引用同safe材料的derived model；逐source缺失裁剪 | 每material/section原incoming，非主页面借权 | 只读 |
| Preview两个入口 | preview | Artifact原incoming/current slot，host open不作business proof | preview正式no-effect，未绑定不open |
| LoadIntentCapability | intentCapabilities按current slot | original capability current slot/kind/Gate/action | 只读 |
| ProjectList | projectList | Work query slot/lineage，pageInfo正式 | 只读 |
| ProjectDetail | projectDetail；navigation来自current projectNavigation | outer+summary/items/evidence各source checks | 只读，非atomic owner snapshot |
| 整体/阶段流程 | projectDetail.flowView；projectNavigation/selection清旧下钻；processNodeDetail清；旧section contexts失效 | outer+topology/state/governance各slot，parent revision | 只读，不Process执行 |
| NodeDetail | processNodeDetail及当前selection只derived；每section materials按资格 | node/关联及各source current checks | 只读，无Tools/Runtime执行 |
| ProjectConversationLinks | 项目上下文projectDetail.conversationLinks；群聊上下文root.conversationLinks | 关系原incoming+每target current入口资格 | 只读，无binding mutation |
| CompanyDirectory/UpdateSearch | companyDirectory（含pageInfo）、相关contexts、selection/people旧引用清 | current search generation/lineage；新page原incoming | formal directory只读 |
| FormalChange/MaterialRevision | 对应payload slice + continuityBySource/resumesBySource/consumedChanges同source更新 | qualification正式顺序，各payload所有current checks | 无业务重放 |
| Command receipt/result | attempts、同revision草稿、有限local公告 | sameintent/association/actor/fence/current source | 无；receipt非业务confirm |
| Resume/GapQuery | source continuity/resumes/consumed及snapshot/changes目标slice | recoveryRef/current slot、正式coverage、各source检查 | read-only恢复 |
| Visibility/Eviction/Logout | 受正式范围影响全部root/refs/草稿/return/focus/页cursor；contexts失效 | current session/scope/source正式收紧；不能仅oldslot决定 | stop feed、versioned delete；无owner取消 |
| ShellLifecycle/Platform/AT | platform/accessibility；source stale/unknown/closing清理按上表 | trusted hostBinding/session/generation；纯technical local checks=[] | probe/订阅释放，无业务提交 |
| LocalProjection/LoadDraft纯读 | 无changes | 同root read version、repo version独立、fence重验 | 无 |
| Persist | repo entry state/localVersion；不直接root fresh | load返回repo.version + explicit current fence/partition eligibility，同JS turnmemory CAS | 本地memory，无durable |
| Diagnostic三入口 | 无owner/root业务state；仅ephemeral交付返回 | current sessionEpoch；accepted formal sink receipt，unknown不重发 | 正式低敏sink，默认disabled |

### 12.2 DTO构造与helper回写

Step9反向审计发现并原位修复：
- 完整Input必须传coordinator，不丢slotId/workItemPage/member范围；Step6相应方法typed签名同步。
- 目录必须存pageInfo.lineageRef，nextPageRef唯一只读派生；Step6/8全字段表同步。
- Governance duplicate lookup须safe Gate/action关联，Step6 Attempt两个字段和fromGovernance完整工厂。
- entry/projectList/preview/capability/群聊关联都有唯一root slice，非组件独立cache。
- save须current fence与partition在真正memory写入时核验；撤销不等delete先invalidate，避免pending save复活。

所有patch只更新上述责任字段，使用immutable copies，不写version/session。store/guard不是owner授权。伪代码变量reservePatch/previewPatch/tighteningPatch/currentRequest/currentClearInput等由上述字段范围+Step6 typed carrier完整构造，不对应隐式SDK API或额外抽象；材料原incoming必须保留，不临时借current改代次。

### 12.3 43flow停审与下步门禁

| 审计项 | 结论 |
|---|---|
| 协议一对一覆盖 | Step8全部43项均有独立flow，非共享总表替代；既有loadEntry/helper已在Step6/7定义，不新增owner协议 |
| 函数/port | 所有SDK/host/repo调用回Step7；pure factory回Step6及Step8 helpers；发现缺口已回写，不留实现猜 |
| 事务/幂等 | root CAS/repo CAS/SDK调用独立；命令调用权前置、unknown不重放、source-local duplicate/coverage |
| 状态 | 只使用Step6正式enum；页面ready不业务complete，access不fresh，ACK不confirmed，expired不能cache复活 |
| 所有响应 | 同current local版本/槽位，negative裁剪；嵌套section独立source不parent借权 |
| 并发/撤销 | 节点/搜索/父图代次先失效，scope revoke覆盖关闭槽位；hide→stop→delete，failed仍restricted |
| 副作用/证据 | 无backend UoW/outbox/bus/owner repair；Agent/tool/commit/test摘要非验收；所有切口planned未运行 |
| 外部缺口 | CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、host/storage/config/quality继续open/blocked |

原诊断：抽象query骨架不足以确保每接口全字段构造/版本/调用权；本步逐接口展开并反向修正Step6～8。取舍：保守unknown与fail-closed，宁可保留blocked不伪正式结果；native preview/durable正向能力仍不实现。回填草稿为§4～12独立flow和局部patch审计。

全部flow本地设计停审通过，gate_status=pass_with_upstream_blockers；下一动作只进入Step10，先读取状态主语筛选/分族规范及Governance Step10粒度，再逐机状态集合/图/完整矩阵/非法转换/切口。不得进入Step11+、装配正式03、运行实现测试或提交commit。

### 12.4 PageLoad错误回查

五个page VM（不含ProjectNavigationState）各有Step6 §20.5具名Factory.failLoad完整签名。对应Query在SDK当前只读失败分支先核对original current slot，调用本VM failLoad再单root CAS；无法构造初始合法VM则用shell安全blocked面，不造provider ref。外部dependency_unbound/authority_missing/unsafe→blocked，当前已绑定只读依赖暂不可用dependency_unavailable→unavailable，正式gap→stale，部分source失败→partial。aborted_read/context_changed不写新view；local_conflict只重读。返回协议Outcome.error附安全UI姿态，失败不能伪ClientReply成功或owner missing。

这些方法是反向设计闭口，不临时留给实现新增；Step10矩阵的trigger直接回指对应Query及具名failLoad。无owner副作用/测试结果。

### 12.5 状态触发闭口同步

AccessPostureFactory.markUnavailable只当前技术依赖收紧，不能hidden→unavailable或授予visibility；对应Load*/host失败路径先收紧，正式subject缺失不推断。DraftFactory.releaseSubmission(draft,attempt)只同draftRef/revision/submittingIntent且failed/rejected，保留稿转editing并清旧validation；unknown/pending不得释放为可重发，显式编辑新revision仍允许且不取消旧attempt。失败保留稿随后validate才locally_valid/invalid。Feedback工厂统一IntentFeedbackFactory；材料工厂统一SafeMaterialFactory，preview唯一isOpenable。

local root所有新增slice初始null/空map，session替换/route影响范围/正式revoke一并清；MemoryProjectionRepository保存explicitfence在真正同步写入时核验currentpartition，不借root read旧资格延后save。以上pure函数已回Step6，Step7/8 signature同步；不表示SDK/host contract闭合。
